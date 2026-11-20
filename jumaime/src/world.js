// 屋敷：毎回ちがう間取り（広さはいつも 6×6 部屋）を作り、立体と当たり判定を組む
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const S = 9, GW = 6, GH = 6, WT = 0.28, WH = 2.3, DW = 2.1, LOW = 0.5;
export function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const DIRS = { N: [0, -1], S: [0, 1], W: [-1, 0], E: [1, 0] };

export function genMap(seed) {
  const r = rng(seed), N = GW * GH, all = [...Array(N).keys()];
  const nb = (i) => { const x = i % GW, y = (i / GW) | 0, o = []; if (x > 0) o.push(i - 1); if (x < GW - 1) o.push(i + 1); if (y > 0) o.push(i - GW); if (y < GH - 1) o.push(i + GW); return o; };
  const key = (a, b) => (a < b ? a * 100 + b : b * 100 + a), doors = new Set();
  const pick = (arr) => arr[(r() * arr.length) | 0];
  // 迷路（かならず全部の部屋がつながる）＋ぐるっと回れる抜け道
  const first = (r() * N) | 0, seen = new Set([first]), stack = [first];
  while (stack.length) { const c = stack[stack.length - 1], cand = nb(c).filter((j) => !seen.has(j)); if (!cand.length) { stack.pop(); continue; } const j = pick(cand); doors.add(key(c, j)); seen.add(j); stack.push(j); }
  for (let extra = 11, guard = 600; extra > 0 && guard > 0; guard--) { const i = (r() * N) | 0, j = pick(nb(i)); if (!doors.has(key(i, j))) { doors.add(key(i, j)); extra--; } }
  const adj = (i) => nb(i).filter((j) => doors.has(key(i, j)));
  const bfs = (s) => { const d = new Array(N).fill(-1); d[s] = 0; const q = [s]; for (let h = 0; h < q.length; h++) for (const j of adj(q[h])) if (d[j] < 0) { d[j] = d[q[h]] + 1; q.push(j); } return d; };
  const path = (a, b) => { const prev = new Array(N).fill(-1), q = [a]; prev[a] = a; for (let h = 0; h < q.length && prev[b] < 0; h++) for (const j of adj(q[h])) if (prev[j] < 0) { prev[j] = q[h]; q.push(j); } const out = []; for (let c = b; c !== a; c = prev[c]) out.unshift(c); return out; };
  const edge = (i) => { const x = i % GW, y = (i / GW) | 0; return x === 0 || y === 0 || x === GW - 1 || y === GH - 1; };
  const start = (r() * N) | 0, dS = bfs(start), far = Math.max(...dS);
  const well = pick(all.filter((i) => dS[i] >= far - 1 && i !== start)), dW = bfs(well);
  let ks = all.filter((i) => dS[i] >= 4 && dW[i] >= 2 && i !== well); if (!ks.length) ks = all.filter((i) => i !== start && i !== well);
  const keyRoom = pick(ks), dK = bfs(keyRoom);
  let gs = all.filter((i) => edge(i) && dK[i] >= 4 && dS[i] >= 2 && i !== well); if (!gs.length) gs = all.filter((i) => edge(i) && i !== keyRoom && i !== well && i !== start);
  const gate = pick(gs), gx = gate % GW, gy = (gate / GW) | 0, sides = [];
  if (gx === 0) sides.push("W"); if (gx === GW - 1) sides.push("E"); if (gy === 0) sides.push("N"); if (gy === GH - 1) sides.push("S");
  return { seed, r, doors, key, nb, adj, bfs, path, start, well, keyRoom, gate, gateSide: pick(sides) };
}
export const roomOf = (x, z) => Math.min(GW - 1, Math.max(0, Math.floor(x / S))) + GW * Math.min(GH - 1, Math.max(0, Math.floor(z / S)));
export const roomCenter = (i) => ({ x: (i % GW) * S + S / 2, z: ((i / GW) | 0) * S + S / 2 });
export function doorPoint(a, b) { const A = roomCenter(a), Bc = roomCenter(b); return { x: (A.x + Bc.x) / 2, z: (A.z + Bc.z) / 2 }; }

// ---- 模様 ----
function tex(w, h, draw, rx = 1, ry = 1) {
  const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; return t;
}
const R0 = rng(12345);
const tatamiTex = () => tex(256, 128, (g, w, h) => {
  const mat = (x, y, mw, mh, vert) => { // 1枚の畳（目の向きと、長い辺のへり）
    g.save(); g.beginPath(); g.rect(x, y, mw, mh); g.clip(); g.fillStyle = `rgb(${104 + R0() * 14},${100 + R0() * 12},${60 + R0() * 10})`; g.fillRect(x, y, mw, mh);
    for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${110 + R0() * 70},${104 + R0() * 60},${52 + R0() * 40},${0.1 + R0() * 0.18})`; const px = x + R0() * mw, py = y + R0() * mh, l = 3 + R0() * 9; vert ? g.fillRect(px, py, 1, l) : g.fillRect(px, py, l, 1); }
    for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(20,16,8,${0.06 + R0() * 0.1})`; g.beginPath(); g.ellipse(x + R0() * mw, y + R0() * mh, 5 + R0() * 16, 4 + R0() * 12, R0() * 3, 0, 7); g.fill(); }
    g.fillStyle = "#14150e"; if (vert) { g.fillRect(x, y, 3, mh); g.fillRect(x + mw - 3, y, 3, mh); } else { g.fillRect(x, y, mw, 3); g.fillRect(x, y + mh - 3, mw, 3); }
    g.strokeStyle = "rgba(8,8,5,0.75)"; g.lineWidth = 1.5; g.strokeRect(x, y, mw, mh); g.restore();
  };
  mat(0, 0, 64, 128, true); mat(64, 0, 64, 128, true); mat(128, 0, 128, 64, false); mat(128, 64, 128, 64, false);
}, (GW * S) / 3.6, (GH * S) / 1.8);
const grainTex = (base, streak, rep = 1) => tex(128, 128, (g, w, h) => {
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${R0() < 0.5 ? "0,0,0" : "255,240,210"},${0.03 + R0() * 0.07})`; if (streak) g.fillRect(R0() * w, R0() * h, 14 + R0() * 60, 1); else g.fillRect(R0() * w, R0() * h, 1 + R0() * 3, 1 + R0() * 3); }
  if (streak) { g.fillStyle = "rgba(0,0,0,0.5)"; for (let y = 0; y < h; y += 32) g.fillRect(0, y, w, 1.5); }
  for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(0,0,0,${0.06 + R0() * 0.1})`; g.beginPath(); g.ellipse(R0() * w, R0() * h, 8 + R0() * 26, 6 + R0() * 18, R0() * 3, 0, 7); g.fill(); }
}, rep, rep);
const fusumaTex = () => tex(128, 256, (g, w, h) => {
  g.fillStyle = "#b3aa8c"; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(60,50,30,${0.03 + R0() * 0.06})`; g.fillRect(R0() * w, R0() * h, 1 + R0() * 5, 1); }
  g.fillStyle = "rgba(30,34,30,0.42)"; g.beginPath(); g.moveTo(0, 190); for (let x = 0; x <= w; x += 8) g.lineTo(x, 190 - Math.abs(Math.sin(x * 0.045) * 46) - Math.sin(x * 0.2) * 5); g.lineTo(w, h); g.lineTo(0, h); g.fill(); // 墨の山
  g.fillStyle = "rgba(20,22,20,0.5)"; for (let i = 0; i < 16; i++) g.fillRect(R0() * w, 60 + R0() * 60, 6 + R0() * 16, 1.5); // かすれた雲
  g.fillStyle = "rgba(40,10,10,0.35)"; g.beginPath(); g.ellipse(88, 150, 14, 30, 0.3, 0, 7); g.fill(); // しみ
  g.strokeStyle = "#17120d"; g.lineWidth = 8; g.strokeRect(0, 0, w, h); g.fillStyle = "#0c0a08"; g.beginPath(); g.arc(w - 18, h / 2, 5, 0, 7); g.fill();
});

export function buildWorld(map) {
  const r = map.r, group = new THREE.Group(), cols = [], los = Array.from({ length: GW * GH }, () => []), B = {};
  const add = (mat, x, y, z, w, h, d, ry = 0) => { const g = new THREE.BoxGeometry(w, h, d); if (ry) g.rotateY(ry); g.translate(x, y + h / 2, z); (B[mat] || (B[mat] = [])).push(g); };
  const addG = (mat, g) => (B[mat] || (B[mat] = [])).push(g.index ? g : g);
  const solid = (x, z, w, d, room = -1, tall = false) => { const c = { x0: x - w / 2, z0: z - d / 2, x1: x + w / 2, z1: z + d / 2 }; cols.push(c); if (tall && room >= 0) los[room].push(c); return c; };
  const hasDoor = (a, b) => b >= 0 && map.doors.has(map.key(a, b));
  const neighbor = (i, side) => { const x = (i % GW) + DIRS[side][0], y = ((i / GW) | 0) + DIRS[side][1]; return x < 0 || y < 0 || x >= GW || y >= GH ? -1 : x + y * GW; };

  // ---- 壁 ----
  const wallSeg = (xc, zc, len, alongX) => {
    const w = alongX ? len + WT : WT, d = alongX ? WT : len + WT;
    add("wallLow", xc, 0, zc, w, LOW, d); add("wallFull", xc, 0, zc, w, WH, d); add("beam", xc, LOW, zc, w + 0.02, 0.05, d + 0.02); solid(xc, zc, w, d);
  };
  const doorway = (xc, zc, alongX) => {
    const half = DW / 2 + 0.07;
    for (const s of [-1, 1]) { const px = alongX ? xc + s * half : xc, pz = alongX ? zc : zc + s * half; add("post", px, 0, pz, 0.2, LOW + 0.16, 0.2); add("wallFull", px, 0, pz, 0.2, WH, 0.2); }
    add("post", xc, 0, zc, alongX ? DW : WT + 0.06, 0.03, alongX ? WT + 0.06 : DW); // 敷居
    add("wallFull", xc, WH - 0.4, zc, alongX ? DW : WT, 0.4, alongX ? WT : DW);      // 鴨居の上の壁
    const off = half + 0.55; // 開けはなした襖
    if (alongX) add("fusumaFull", xc + off, 0, zc + 0.2, 1.0, 1.85, 0.05); else add("fusumaFull", xc + 0.2, 0, zc + off, 0.05, 1.85, 1.0);
  };
  let gateInfo = null;
  const boundary = (a, b, xc, zc, alongX, side) => { // a と b の間の壁（b が -1 なら外壁）
    if (a === map.gate && b < 0 && side === map.gateSide) {
      const GWd = 2.6, seg = (S - GWd) / 2;
      for (const s of [-1, 1]) { const o = s * (GWd / 2 + seg / 2); wallSeg(alongX ? xc + o : xc, alongX ? zc : zc + o, seg, alongX); }
      gateInfo = { x: xc, z: zc, alongX, nx: -DIRS[side][0], nz: -DIRS[side][1], col: solid(xc, zc, alongX ? GWd : WT + 0.2, alongX ? WT + 0.2 : GWd) };
      return;
    }
    if (b >= 0 && hasDoor(a, b)) {
      const seg = (S - DW) / 2;
      for (const s of [-1, 1]) { const o = s * (DW / 2 + seg / 2); wallSeg(alongX ? xc + o : xc, alongX ? zc : zc + o, seg, alongX); }
      doorway(xc, zc, alongX);
    } else wallSeg(xc, zc, S, alongX);
  };
  for (let gy = 0; gy <= GH; gy++) for (let gx = 0; gx < GW; gx++) { // 東西にのびる壁
    const up = gy > 0 ? gx + (gy - 1) * GW : -1, dn = gy < GH ? gx + gy * GW : -1;
    if (up < 0) boundary(dn, -1, gx * S + S / 2, 0, true, "N"); else if (dn < 0) boundary(up, -1, gx * S + S / 2, GH * S, true, "S"); else boundary(up, dn, gx * S + S / 2, gy * S, true, "S");
  }
  for (let gx = 0; gx <= GW; gx++) for (let gy = 0; gy < GH; gy++) { // 南北にのびる壁
    const lf = gx > 0 ? gx - 1 + gy * GW : -1, rt = gx < GW ? gx + gy * GW : -1;
    if (lf < 0) boundary(rt, -1, 0, gy * S + S / 2, false, "W"); else if (rt < 0) boundary(lf, -1, GW * S, gy * S + S / 2, false, "E"); else boundary(lf, rt, gx * S, gy * S + S / 2, false, "E");
  }

  // ---- 床 ----
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(GW * S, GH * S), new THREE.MeshLambertMaterial({ map: tatamiTex() }));
  floor.rotation.x = -Math.PI / 2; floor.position.set((GW * S) / 2, 0, (GH * S) / 2); floor.receiveShadow = true; group.add(floor);
  const plankMat = new THREE.MeshLambertMaterial({ map: grainTex("#4a3524", true, 3) }), earthMat = new THREE.MeshLambertMaterial({ map: grainTex("#39352c", false, 4) });
  const overlay = (i, mat) => { const c = roomCenter(i), m = new THREE.Mesh(new THREE.PlaneGeometry(S - WT, S - WT), mat); m.rotation.x = -Math.PI / 2; m.position.set(c.x, 0.004, c.z); m.receiveShadow = true; group.add(m); };

  // ---- 部屋の中 ----
  const closets = [], types = [];
  const butsuma = (() => { const c = [...Array(GW * GH).keys()].filter((i) => i !== map.well && i !== map.start && i !== map.gate); return c[(r() * c.length) | 0]; })();
  const along = (i, side, off, depth) => { // 壁ぎわの位置
    const c = roomCenter(i), d = S / 2 - WT / 2 - depth / 2;
    if (side === "N") return { x: c.x + off, z: c.z - d, ry: 0 }; if (side === "S") return { x: c.x + off, z: c.z + d, ry: Math.PI };
    if (side === "W") return { x: c.x - d, z: c.z + off, ry: Math.PI / 2 }; return { x: c.x + d, z: c.z + off, ry: -Math.PI / 2 };
  };
  const offFor = (i, side, w) => { // ドアをよけた横位置
    const door = hasDoor(i, neighbor(i, side)) || (i === map.gate && side === map.gateSide), lim = S / 2 - w / 2 - 0.5;
    if (!door) return (r() * 2 - 1) * lim; const lo = DW / 2 + w / 2 + 0.5; return lo > lim ? null : (r() < 0.5 ? -1 : 1) * (lo + r() * (lim - lo));
  };
  const size = (ry, w, d) => (Math.abs(Math.sin(ry)) > 0.5 ? [d, w] : [w, d]);
  for (let i = 0; i < GW * GH; i++) {
    const c = roomCenter(i);
    if (i === map.well) { types[i] = "well"; overlay(i, earthMat); continue; }
    const ita = i !== map.start && r() < 0.2; types[i] = i === butsuma ? "butsuma" : ita ? "ita" : "tatami"; if (ita) overlay(i, plankMat);
    const used = new Set(), sidesAll = ["N", "S", "W", "E"].sort(() => r() - 0.5);
    // 押し入れ（ドアのない壁に）
    if (r() < 0.5 || i === map.start) {
      const sd = sidesAll.find((s) => !hasDoor(i, neighbor(i, s)) && !(i === map.gate && s === map.gateSide));
      if (sd) {
        const w = 2.0, d = 0.95, h = 1.95, off = (r() * 2 - 1) * (S / 2 - w / 2 - 0.8), p = along(i, sd, off, d), [bw, bd] = size(p.ry, w, d), nx = -DIRS[sd][0], nz = -DIRS[sd][1];
        add("woodDark", p.x, 0, p.z, bw, h, bd); solid(p.x, p.z, bw, bd, i, true); used.add(sd);
        const fm = new THREE.MeshLambertMaterial({ map: fusumaTex() }), panels = [];
        for (const s of [-1, 1]) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.98, 1.8, 0.04), fm); m.position.set(p.x + nx * (d / 2 + 0.02) + (nz !== 0 ? s * 0.5 : 0), 0.92, p.z + nz * (d / 2 + 0.02) + (nx !== 0 ? s * 0.5 : 0)); m.rotation.y = nx !== 0 ? Math.PI / 2 : 0; m.receiveShadow = true; group.add(m); panels.push(m); }
        closets.push({ room: i, cx: p.x, cz: p.z, nx, nz, fx: p.x + nx * (d / 2 + 0.6), fz: p.z + nz * (d / 2 + 0.6), panels });
      }
    }
    // 仏壇
    if (types[i] === "butsuma") { const sd = sidesAll.find((s) => !used.has(s)); const off = offFor(i, sd, 1.3); if (off !== null) { const p = along(i, sd, off, 0.6), [bw, bd] = size(p.ry, 1.3, 0.6), nx = -DIRS[sd][0], nz = -DIRS[sd][1];
      add("lacquer", p.x, 0, p.z, bw, 1.7, bd); add("gold", p.x + nx * 0.29, 0.75, p.z + nz * 0.29, nx ? 0.04 : 0.9, 0.7, nz ? 0.04 : 0.9); add("lacquer", p.x + nx * 0.55, 0, p.z + nz * 0.55, nx ? 0.45 : 0.8, 0.3, nz ? 0.45 : 0.8);
      for (const s of [-1, 1]) add("gold", p.x + nx * 0.55 + (nz ? s * 0.25 : 0), 0.3, p.z + nz * 0.55 + (nx ? s * 0.25 : 0), 0.05, 0.22, 0.05);
      solid(p.x, p.z, bw, bd, i, true); used.add(sd); } }
    // たんす
    for (let n = 0, want = (r() * 2.4) | 0; n < want; n++) { const sd = sidesAll.find((s) => !used.has(s)); if (!sd) break; const off = offFor(i, sd, 1.5); used.add(sd); if (off === null) continue;
      const p = along(i, sd, off, 0.55), [bw, bd] = size(p.ry, 1.5, 0.55), nx = -DIRS[sd][0], nz = -DIRS[sd][1], h = 1.2 + r() * 0.45;
      add("woodMid", p.x, 0, p.z, bw, h, bd); for (let k = 1; k < 4; k++) add("woodDark", p.x + nx * 0.28, (h * k) / 4, p.z + nz * 0.28, nx ? 0.02 : 1.42, 0.03, nz ? 0.02 : 1.42);
      solid(p.x, p.z, bw, bd, i, true); }
    // ちゃぶ台と座ぶとん
    if (!ita && r() < 0.55) { const x = c.x + (r() - 0.5) * 3 + (i === map.start ? 2.4 : 0), z = c.z + (r() - 0.5) * 3 + (i === map.start ? -2 : 0);
      const g = new THREE.CylinderGeometry(0.62, 0.62, 0.06, 20); g.translate(x, 0.33, z); addG("woodMid", g); add("woodDark", x, 0, z, 0.5, 0.3, 0.5); solid(x, z, 1.1, 1.1, i);
      for (let k = 0, m = 1 + ((r() * 3) | 0); k < m; k++) { const a = r() * 6.28; add("cloth", x + Math.cos(a) * 1.05, 0, z + Math.sin(a) * 1.05, 0.5, 0.06, 0.5, r()); } }
    // 屏風
    if (r() < 0.38 && i !== map.start) { const x = c.x + (r() - 0.5) * 4, z = c.z + (r() < 0.5 ? -1 : 1) * (1.6 + r() * 1.2), horiz = r() < 0.6;
      for (let k = 0; k < 4; k++) { const o = (k - 1.5) * 0.56, zig = (k % 2 ? 1 : -1) * 0.1; if (horiz) add("paper", x + o, 0, z + zig, 0.6, 1.55, 0.035, (k % 2 ? 1 : -1) * 0.35); else add("paper", x + zig, 0, z + o, 0.035, 1.55, 0.6, (k % 2 ? 1 : -1) * 0.35); }
      horiz ? solid(x, z, 2.3, 0.45, i, true) : solid(x, z, 0.45, 2.3, i, true); }
    // 布団
    if (!ita && r() < 0.3) { const x = c.x + (r() - 0.5) * 4.5, z = c.z + (r() - 0.5) * 4.5, ry = r() < 0.5 ? 0 : Math.PI / 2; add("cloth", x, 0, z, 1.0, 0.1, 1.9, ry); add("clothDark", x, 0.1, z, 0.95, 0.07, 1.2, ry); }
    // 行灯（火は消えている）
    if (r() < 0.45) { const x = c.x + (r() < 0.5 ? -1 : 1) * (2.6 + r()), z = c.z + (r() < 0.5 ? -1 : 1) * (2.6 + r()); add("woodDark", x, 0, z, 0.3, 0.08, 0.3); add("paper", x, 0.08, z, 0.26, 0.55, 0.26); add("woodDark", x, 0.63, z, 0.3, 0.05, 0.3); solid(x, z, 0.34, 0.34, i); }
    // 板の間：かまどと樽
    if (ita) { const sd = sidesAll.find((s) => !used.has(s)); if (sd) { const off = offFor(i, sd, 1.5); if (off !== null) { const p = along(i, sd, off, 0.8), [bw, bd] = size(p.ry, 1.5, 0.8); add("stone", p.x, 0, p.z, bw, 0.75, bd); const g = new THREE.CylinderGeometry(0.28, 0.2, 0.3, 14); g.translate(p.x, 0.75 + 0.15, p.z); addG("lacquer", g); solid(p.x, p.z, bw, bd, i); used.add(sd); } }
      for (let k = 0, m = 2 + ((r() * 3) | 0); k < m; k++) { const x = c.x + (r() < 0.5 ? -1 : 1) * (2.4 + r() * 1.3), z = c.z + (r() < 0.5 ? -1 : 1) * (2.4 + r() * 1.3); const g = new THREE.CylinderGeometry(0.4, 0.34, 0.85, 14); g.translate(x, 0.425, z); addG("woodMid", g); solid(x, z, 0.8, 0.8, i); } }
  }
  // ---- 井戸（中庭） ----
  const wc = roomCenter(map.well);
  { const ring = new THREE.CylinderGeometry(0.82, 0.9, 0.85, 20, 1, true); ring.translate(wc.x, 0.425, wc.z); addG("stone", ring);
    const lip = new THREE.TorusGeometry(0.82, 0.09, 8, 22); lip.rotateX(Math.PI / 2); lip.translate(wc.x, 0.85, wc.z); addG("stone", lip);
    for (const s of [-1, 1]) add("woodDark", wc.x + s * 1.05, 0, wc.z, 0.14, 2.2, 0.14); add("woodDark", wc.x, 2.1, wc.z, 2.5, 0.14, 0.18);
    const g = new THREE.CylinderGeometry(0.16, 0.13, 0.26, 10); g.translate(wc.x + 0.5, 0.98, wc.z + 0.3); addG("woodMid", g);
    const hole = new THREE.Mesh(new THREE.CircleGeometry(0.8, 20), new THREE.MeshBasicMaterial({ color: 0x000000 })); hole.rotation.x = -Math.PI / 2; hole.position.set(wc.x, 0.5, wc.z); group.add(hole);
    solid(wc.x, wc.z, 1.75, 1.75, map.well);
    for (let k = 0; k < 2; k++) { const a = r() * 6.28, x = wc.x + Math.cos(a) * 3.1, z = wc.z + Math.sin(a) * 3.1; // 石灯籠
      add("stone", x, 0, z, 0.3, 0.75, 0.3); add("stone", x, 0.75, z, 0.5, 0.3, 0.5); add("stone", x, 1.05, z, 0.66, 0.1, 0.66); solid(x, z, 0.5, 0.5, map.well); }
    const tx = wc.x - 3.2, tz = wc.z - 3.0; // 枯れ木
    const trunk = new THREE.CylinderGeometry(0.1, 0.2, 2.6, 8); trunk.translate(tx, 1.3, tz); addG("woodDark", trunk);
    for (let k = 0; k < 6; k++) { const b = new THREE.CylinderGeometry(0.02, 0.06, 1.1 + r() * 0.8, 5); b.translate(0, 0.6, 0); b.rotateZ(0.5 + r() * 0.8); b.rotateY(r() * 6.28); b.translate(tx, 1.5 + r() * 1.0, tz); addG("woodDark", b); }
    solid(tx, tz, 0.4, 0.4, map.well); }
  // ---- 門 ----
  const G = gateInfo, gateDoors = [];
  { const gm = new THREE.MeshLambertMaterial({ map: grainTex("#2a1d14", true, 1) });
    for (const s of [-1, 1]) { const m = new THREE.Mesh(new THREE.BoxGeometry(G.alongX ? 1.28 : 0.16, 2.2, G.alongX ? 0.16 : 1.28), gm); m.position.set(G.x + (G.alongX ? s * 0.65 : 0), 1.1, G.z + (G.alongX ? 0 : s * 0.65)); m.castShadow = true; group.add(m); gateDoors.push(m); }
    const bar = new THREE.Mesh(new THREE.BoxGeometry(G.alongX ? 2.2 : 0.12, 0.16, G.alongX ? 0.12 : 2.2), gm); bar.position.set(G.x + G.nx * 0.16, 1.05, G.z + G.nz * 0.16); group.add(bar); gateDoors.push(bar);
    G.fx = G.x + G.nx * 0.95; G.fz = G.z + G.nz * 0.95; }
  const chochin = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), new THREE.MeshBasicMaterial({ color: 0x7a1a10 })); chochin.scale.y = 1.35; chochin.position.set(G.x + G.nx * 0.7 + (G.alongX ? 1.7 : 0), 1.75, G.z + G.nz * 0.7 + (G.alongX ? 0 : 1.7)); group.add(chochin);
  const gateLight = new THREE.PointLight(0xff3a1c, 2.4, 6.5, 1.5); gateLight.position.copy(chochin.position); group.add(gateLight);

  // ---- 束ねて1つの立体に（面ごとに世界の座標で模様を貼る） ----
  const M = {
    wallLow: new THREE.MeshLambertMaterial({ map: grainTex("#6f6753", false, 1) }), wallFull: new THREE.MeshLambertMaterial({ map: grainTex("#6f6753", false, 1) }),
    beam: new THREE.MeshLambertMaterial({ color: 0x1c140e }), post: new THREE.MeshLambertMaterial({ color: 0x241910 }),
    woodDark: new THREE.MeshLambertMaterial({ map: grainTex("#2b1f16", true, 1) }), woodMid: new THREE.MeshLambertMaterial({ map: grainTex("#4d3725", true, 1) }),
    paper: new THREE.MeshLambertMaterial({ map: grainTex("#a89f84", false, 1) }), fusumaFull: new THREE.MeshLambertMaterial({ map: fusumaTex() }),
    cloth: new THREE.MeshLambertMaterial({ color: 0x77736a }), clothDark: new THREE.MeshLambertMaterial({ color: 0x3c2f33 }),
    stone: new THREE.MeshLambertMaterial({ map: grainTex("#5a5c5c", false, 1) }), lacquer: new THREE.MeshLambertMaterial({ color: 0x0c0a0a }), gold: new THREE.MeshLambertMaterial({ color: 0x9a7a2a, emissive: 0x1a1204 }),
  };
  const meshes = {};
  for (const k in B) {
    const g = mergeGeometries(B[k].map((x) => (x.index ? x.toNonIndexed() : x)));
    if (k !== "fusumaFull") { const p = g.attributes.position, n = g.attributes.normal, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) { const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)); if (ay > 0.5) uv.setXY(i, p.getX(i) * 0.5, p.getZ(i) * 0.5); else if (ax > 0.5) uv.setXY(i, p.getZ(i) * 0.5, p.getY(i) * 0.5); else uv.setXY(i, p.getX(i) * 0.5, p.getY(i) * 0.5); } }
    const m = new THREE.Mesh(g, M[k]); m.receiveShadow = true; m.castShadow = !["wallLow", "beam", "post", "cloth", "clothDark", "fusumaFull"].includes(k); group.add(m); meshes[k] = m;
  }
  // 見下ろしでは壁は低く見せる（影だけは本来の高さで落とす）。のぞき穴の視点では本来の高さで見せる
  function setView(first) {
    for (const k of ["wallFull", "fusumaFull"]) { const mt = meshes[k].material; mt.colorWrite = first; mt.depthWrite = first; }
    for (const k of ["wallLow", "beam", "post"]) meshes[k].visible = !first;
  }
  setView(false);

  // ---- 鍵 ----
  const kc = roomCenter(map.keyRoom); let kx = kc.x, kz = kc.z;
  for (let t = 0; t < 40; t++) { const x = kc.x + (r() - 0.5) * (S - 3.4), z = kc.z + (r() - 0.5) * (S - 3.4); if (!cols.some((c) => x > c.x0 - 0.5 && x < c.x1 + 0.5 && z > c.z0 - 0.5 && z < c.z1 + 0.5)) { kx = x; kz = z; break; } }
  const keyMesh = new THREE.Group(), km = new THREE.MeshBasicMaterial({ color: 0xb08a2a });
  { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.02, 6, 14), km); ring.position.x = -0.12; const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.03), km); shaft.position.x = 0.05; const bit = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.09), km); bit.position.set(0.14, 0, 0.04); keyMesh.add(ring, shaft, bit); }
  keyMesh.rotation.x = -Math.PI / 2; keyMesh.rotation.z = r() * 6.28; keyMesh.position.set(kx, 0.06, kz); group.add(keyMesh);

  const sc = roomCenter(map.start);
  return { group, cols, los, closets, types, setView, key: { x: kx, z: kz, mesh: keyMesh, mat: km }, gate: G, gateDoors, well: wc, start: { x: sc.x, z: sc.z + 0.6 }, floorMeshes: meshes };
}
