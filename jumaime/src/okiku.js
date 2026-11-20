// お菊さんのモデル 第3版（形・髪・目・肌をすべてコードで作る。絵は使わない）
import * as THREE from "three";

const R = 0.15; // 頭の基準の半径
function rnd(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function hash(n) { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); }
const gauss = (dx, dy, sx, sy) => Math.exp(-(dx * dx) / (2 * sx * sx) - (dy * dy) / (2 * sy * sy));
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const sstep = (a, b, x) => { const u = clamp01((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const MOUTH_Y = -0.078, MOUTH_W = 0.036;

// ---- 頭の形：球の上の点を、彫刻した顔の表面へ移す（頭・生えぎわ・髪の根もとで同じ式を使う） ----
function sculpt(px, py, pz, o) {
  let x = px, y = py * 1.24, z = pz * 1.04;
  const front = clamp01(z / R), low = clamp01(-y / (R * 1.24));
  x *= 1 - 0.34 * Math.pow(low, 1.25); z *= 1 - 0.1 * low * low;                 // あごへ向けて細く
  if (z < 0) z *= 1.05;                                                           // 後頭部
  x *= 1 - 0.05 * gauss(y - 0.05, z - 0.055, 0.03, 0.045);                        // こめかみのくぼみ
  if (front > 0) {
    const f = Math.pow(front, 0.6);
    z -= f * (0.026 * gauss(x + 0.047, y - 0.02, 0.021, 0.014) + 0.036 * gauss(x - 0.047, y - 0.017, 0.023, 0.017)); // 眼窩（向かって右は深い穴）
    z += 0.009 * f * gauss(x, y - 0.052, 0.07, 0.012);                            // 眉の骨
    z += 0.006 * f * gauss(x + 0.047, y - 0.037, 0.02, 0.0045);                   // 上まぶたのかぶさり
    z += 0.034 * f * gauss(x, y + 0.02, 0.0095, 0.026) + 0.013 * f * gauss(x, y + 0.04, 0.016, 0.008); // 鼻すじと小鼻
    z += 0.012 * f * (gauss(x + 0.066, y + 0.012, 0.022, 0.016) + gauss(x - 0.066, y + 0.012, 0.022, 0.016)); // 頬骨
    z -= f * (0.016 * gauss(x + 0.056, y + 0.07, 0.022, 0.03) + 0.022 * gauss(x - 0.056, y + 0.072, 0.024, 0.032)); // こけた頬（片側はより深い）
    z += 0.008 * f * gauss(x, y - MOUTH_Y, 0.03, 0.012);                          // 口もと
    z += 0.012 * f * gauss(x, y + 0.158, 0.02, 0.016);                            // あご先
    z += 0.005 * f * (gauss(x + 0.07, y + 0.115, 0.018, 0.02) + gauss(x - 0.07, y + 0.115, 0.018, 0.02)); // えら
    for (const ex of [-0.047, 0.047]) { const d = Math.hypot((x - ex) / 0.025, (y - 0.02) / 0.0155); z += 0.0042 * f * Math.exp(-((d - 1) * (d - 1)) / 0.05); } // まぶたのふち
    z -= 0.009 * f * (gauss(x + 0.0098, y + 0.047, 0.0042, 0.003) + gauss(x - 0.0098, y + 0.047, 0.0042, 0.003)); // 鼻の穴
    z += 0.0045 * f * gauss(x, y - (MOUTH_Y + 0.008), 0.024, 0.0038) + 0.0055 * f * gauss(x, y - (MOUTH_Y - 0.021), 0.02, 0.0048); // 上下のくちびる
    z -= 0.003 * f * gauss(x, y - (MOUTH_Y + 0.02), 0.0035, 0.008);               // 人中
    z -= 0.0032 * f * (gauss(x + 0.0085, y - 0.052, 0.0024, 0.012) + gauss(x - 0.0085, y - 0.052, 0.0024, 0.012)); // 眉間のしわ
    if (y > 0.066 && y < 0.125) z -= 0.0019 * f * Math.max(0, Math.sin(y * 470 + Math.sin(x * 60) * 0.8)) * gauss(x, 0, 0.06, 1) * sstep(0.066, 0.078, y) * sstep(0.125, 0.11, y); // 額のしわ
    { const ax = Math.abs(x), ux = 0.021, uy = -0.04, vx = 0.024, vy = -0.05; // ほうれい線
      const tt = clamp01(((ax - ux) * vx + (y - uy) * vy) / (vx * vx + vy * vy)), dd = Math.hypot(ax - ux - vx * tt, y - uy - vy * tt); z -= 0.0048 * f * Math.exp(-(dd * dd) / (2 * 0.0036 * 0.0036)); }
    z -= 0.006 * f * (gauss(x + 0.05, y + 0.006, 0.02, 0.0045) + gauss(x - 0.05, y + 0.006, 0.02, 0.0045)); // 目の下のくぼみ
  }
  o[0] = x; o[1] = y; o[2] = z; return o;
}
// 生えぎわの高さ（az: 正面を0とした向き）。額は横一文字、こめかみで下がり、うなじまで
function hairlineY(az) {
  const a = Math.abs(az);
  if (a < 0.7) return 0.096 - 0.007 * gauss(a, 0, 0.14, 1) + 0.0045 * Math.sin(az * 31) + 0.003 * Math.sin(az * 67 + 1.3);
  if (a < 1.3) return 0.096 - 0.151 * sstep(0.7, 1.3, a) + 0.004 * Math.sin(az * 31) * (1.3 - a);
  return -0.055 - 0.055 * sstep(1.3, 2.0, a);
}

// ---- 肌の模様（むら・血管・くま・ひび割れた唇・垂れる黒いもの） ----
function skinTexture() {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 1280;
  const g = c.getContext("2d"); const r = rnd(11); g.scale(2, 2);
  let gr = g.createRadialGradient(256, 290, 30, 256, 320, 380);
  gr.addColorStop(0, "#d4d8cf"); gr.addColorStop(0.55, "#b0b8b0"); gr.addColorStop(1, "#6c7773");
  g.fillStyle = gr; g.fillRect(0, 0, 512, 640);
  for (let i = 0; i < 460; i++) { // こまかいむら
    g.fillStyle = `rgba(${50 + r() * 40},${58 + r() * 36},${70 + r() * 30},${0.025 + r() * 0.05})`;
    g.beginPath(); g.ellipse(r() * 512, r() * 640, 3 + r() * 30, 2 + r() * 20, r() * 3, 0, 7); g.fill();
  }
  for (let i = 0; i < 22; i++) { // 死斑（紫と緑のにごり）
    const x = r() * 512, y = 120 + r() * 480, rad = 24 + r() * 60; gr = g.createRadialGradient(x, y, 2, x, y, rad);
    const col = r() < 0.5 ? "70,40,90" : "50,80,60"; gr.addColorStop(0, `rgba(${col},${0.1 + r() * 0.1})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  g.lineCap = "round";
  for (let i = 0; i < 16; i++) { // 額を伝う水のすじ
    let x = 110 + r() * 292, y = 150 + r() * 40; g.strokeStyle = `rgba(30,36,44,${0.07 + r() * 0.1})`; g.lineWidth = 0.8 + r() * 2; g.beginPath(); g.moveTo(x, y);
    const len = 50 + r() * 220; for (let k = 0; k < len; k += 9) { x += (r() - 0.5) * 3; y += 9; g.lineTo(x, y); } g.stroke();
  }
  for (const [x, k] of [[176, 0.75], [336, 1]]) { // 眼窩のくま
    gr = g.createRadialGradient(x, 300, 8, x, 304, 92);
    gr.addColorStop(0, `rgba(6,0,4,${k})`); gr.addColorStop(0.4, `rgba(30,8,18,${0.8 * k})`); gr.addColorStop(1, "rgba(60,36,50,0)");
    g.fillStyle = gr; g.fillRect(x - 110, 190, 220, 230);
  }
  g.strokeStyle = "rgba(128,24,36,0.6)"; g.lineWidth = 3.5; g.beginPath(); g.ellipse(176, 300, 31, 20, 0, 0, 7); g.stroke(); // 目のふちの赤み
  g.fillStyle = "#000"; g.beginPath(); g.ellipse(336, 304, 42, 29, 0.06, 0, 7); g.fill(); // 向かって右：真っ黒な穴
  for (let i = 0; i < 11; i++) { // 穴から垂れる黒いもの
    let x = 304 + r() * 66, y = 320; g.strokeStyle = `rgba(${14 + r() * 30},0,6,${0.55 + r() * 0.4})`; g.lineWidth = 1.2 + r() * 5; g.beginPath(); g.moveTo(x, y);
    const len = 70 + r() * 260; for (let k = 0; k < len; k += 10) { x += (r() - 0.5) * 5; y += 10; g.lineTo(x, y); } g.stroke();
  }
  for (let i = 0; i < 4; i++) { // 残った目からも細く
    let x = 160 + r() * 34, y = 318; g.strokeStyle = `rgba(60,6,12,${0.3 + r() * 0.3})`; g.lineWidth = 0.8 + r() * 1.6; g.beginPath(); g.moveTo(x, y);
    const len = 40 + r() * 120; for (let k = 0; k < len; k += 10) { x += (r() - 0.5) * 4; y += 10; g.lineTo(x, y); } g.stroke();
  }
  for (let i = 0; i < 96; i++) { // 血管
    let x = 50 + r() * 412, y = 70 + r() * 520, a = r() * 6.28; g.strokeStyle = `rgba(${70 + r() * 40},30,${60 + r() * 50},${0.1 + r() * 0.2})`; g.lineWidth = 0.5 + r() * 1.2; g.beginPath(); g.moveTo(x, y);
    for (let k = 0; k < 10; k++) { a += (r() - 0.5) * 1.3; x += Math.cos(a) * 9; y += Math.sin(a) * 9; g.lineTo(x, y); } g.stroke();
  }
  for (const [x, k] of [[118, 0.5], [394, 0.62]]) { // こけた頬のかげ
    gr = g.createRadialGradient(x, 440, 6, x, 440, 110); gr.addColorStop(0, `rgba(34,42,50,${k})`); gr.addColorStop(1, "rgba(34,42,50,0)"); g.fillStyle = gr; g.fillRect(0, 300, 512, 300);
  }
  for (const x of [240, 272]) { gr = g.createRadialGradient(x, 398, 1, x, 398, 12); gr.addColorStop(0, "rgba(10,2,6,0.85)"); gr.addColorStop(1, "rgba(10,2,6,0)"); g.fillStyle = gr; g.fillRect(x - 14, 384, 28, 28); } // 鼻の穴
  gr = g.createRadialGradient(256, 454, 4, 256, 454, 76); gr.addColorStop(0, "rgba(40,6,14,0.62)"); gr.addColorStop(1, "rgba(40,6,14,0)"); g.fillStyle = gr; g.fillRect(150, 380, 212, 150); // 口のまわり
  g.fillStyle = "rgba(44,20,34,0.66)"; g.beginPath(); g.ellipse(256, 444, 40, 6.5, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(256, 463, 34, 9, 0, 0, 7); g.fill(); // 黒ずんだ唇
  for (let i = 0; i < 22; i++) { const x = 222 + r() * 68, y = 438 + r() * 30; g.strokeStyle = `rgba(8,0,4,${0.4 + r() * 0.4})`; g.lineWidth = 0.6 + r(); g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 3, y + 4 + r() * 7); g.stroke(); } // ひび
  for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) { // 口のはしから垂れる黒いもの
    let x = 256 + sx * (26 + r() * 14), y = 456; g.strokeStyle = `rgba(${10 + r() * 20},0,4,${0.5 + r() * 0.4})`; g.lineWidth = 1 + r() * 3; g.beginPath(); g.moveTo(x, y);
    const len = 40 + r() * 130; for (let k = 0; k < len; k += 9) { x += (r() - 0.5) * 4; y += 9; g.lineTo(x, y); } g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

// 白くにごった死人の目
function eyeTexture() {
  const c = document.createElement("canvas"); c.width = 512; c.height = 256; const g = c.getContext("2d"); const r = rnd(5); g.scale(2, 2);
  g.fillStyle = "#d6cfbc"; g.fillRect(0, 0, 256, 128);
  const cx = 128, cy = 64; // 球の正面
  let gr = g.createRadialGradient(cx, cy, 20, cx, cy, 70); gr.addColorStop(0, "rgba(150,60,50,0)"); gr.addColorStop(1, "rgba(120,30,30,0.55)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 70; i++) { // 血走り
    const a = r() * 6.28; let x = cx + Math.cos(a) * 66, y = cy + Math.sin(a) * 62; g.strokeStyle = `rgba(${140 + r() * 40},10,20,${0.5 + r() * 0.4})`; g.lineWidth = 0.4 + r() * 1.5; g.beginPath(); g.moveTo(x, y);
    for (let k = 0; k < 7; k++) { x += (cx - x) * 0.13 + (r() - 0.5) * 7; y += (cy - y) * 0.13 + (r() - 0.5) * 7; g.lineTo(x, y); } g.stroke();
  }
  gr = g.createRadialGradient(cx, cy, 3, cx, cy, 17); gr.addColorStop(0, "#9aa6a8"); gr.addColorStop(0.7, "#74858a"); gr.addColorStop(0.9, "#2c3438"); gr.addColorStop(1, "#141a1c");
  g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, 17, 0, 7); g.fill(); // にごった虹彩
  g.strokeStyle = "rgba(210,220,220,0.35)"; g.lineWidth = 0.5; for (let i = 0; i < 40; i++) { const a = r() * 6.28; g.beginPath(); g.moveTo(cx + Math.cos(a) * 5, cy + Math.sin(a) * 5); g.lineTo(cx + Math.cos(a) * 15, cy + Math.sin(a) * 15); g.stroke(); }
  g.fillStyle = "#000"; g.beginPath(); g.arc(cx, cy, 4.2, 0, 7); g.fill(); // 針の先のような瞳
  g.fillStyle = "rgba(255,255,255,0.95)"; g.beginPath(); g.arc(cx - 6, cy - 7, 2.2, 0, 7); g.fill(); // 光の点
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function ribbon(pts, w0, side, taper = 0.7) {
  const pos = [], idx = [], n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i], u = i / (n - 1), w = w0 * (1 - Math.pow(u, 3) * taper);
    pos.push(p.x - side.x * w / 2, p.y, p.z - side.z * w / 2, p.x + side.x * w / 2, p.y, p.z + side.z * w / 2);
    if (i < n - 1) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  return geo;
}
function tintGeo(geo, fn) {
  const p = geo.attributes.position, col = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) { fn(c, p.getX(i), p.getY(i), p.getZ(i), i); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3)); return geo;
}

// ---- 頭（あごは本当に外れて下がる。頭皮は頭の形そのものを髪の色にする） ----
function makeHead(skinTex) {
  const geo = new THREE.SphereGeometry(R, 208, 156);
  const p = geo.attributes.position, n = p.count, uv = geo.attributes.uv, o = [0, 0, 0];
  const base = new Float32Array(n * 3), jawK = new Float32Array(n), inK = new Float32Array(n), dkK = new Float32Array(n), scK = new Float32Array(n), ulK = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const pz = p.getZ(i); sculpt(p.getX(i), p.getY(i), pz, o);
    const x = o[0], y = o[1], z = o[2], front = clamp01(pz * 1.04 / R);
    base[i * 3] = x; base[i * 3 + 1] = y; base[i * 3 + 2] = z;
    const k0 = sstep(MOUTH_Y + 0.006, MOUTH_Y - 0.014, y), xm = sstep(MOUTH_W, MOUTH_W * 0.55, Math.abs(x)) * (front > 0.5 ? 1 : 0);
    jawK[i] = k0 * sstep(-0.2, 0.35, front);                                               // あごと一緒に下がる量
    inK[i] = k0 > 0.001 && k0 < 0.999 ? clamp01(Math.pow(4 * k0 * (1 - k0), 0.35) * xm * 1.15) : 0; // 口の中になる所
    dkK[i] = Math.max(inK[i], xm * sstep(MOUTH_Y - 0.04, MOUTH_Y - 0.016, y) * k0 * 0.95);
    ulK[i] = front > 0.5 ? gauss(x, y - (MOUTH_Y + 0.01), 0.03, 0.006) * (1 - k0) : 0;       // 上くちびる（叫ぶとめくれる）
    const hl = hairlineY(Math.atan2(x, z));
    scK[i] = 1 - 0.996 * sstep(hl - 0.004, hl + 0.007, y);                                  // 頭皮は髪の色
    uv.setXY(i, clamp01(x / 0.3 + 0.5), clamp01((y - 0.007) / 0.42 + 0.5));                 // 模様は正面から貼る
  }
  geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: skinTex, vertexColors: true, emissive: 0x070909 }));
  let last = -1;
  function setJaw(open) { // open 0..1
    if (Math.abs(open - last) < 0.004) return; last = open;
    const drop = open * 0.105, c = geo.attributes.color;
    for (let i = 0; i < n; i++) {
      let x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
      const k = jawK[i], q = inK[i];
      if (k > 0) { y -= drop * k; z -= drop * 0.28 * k; x = x * (1 - open * 0.1 * k) + open * 0.011 * k; } // 下がりながら横にずれる
      if (q > 0) z -= (0.006 + open * 0.055) * q;
      const ul = ulK[i]; if (ul > 0.01) { y += open * 0.0075 * ul; z += open * 0.003 * ul; }
      p.setXYZ(i, x, y, z);
      const m = 1 - Math.max(clamp01(q * (0.5 + open * 3)), dkK[i] * sstep(0.15, 0.6, open)), sc = scK[i]; // 口の中は赤黒く、頭皮は黒く
      c.setXYZ(i, m * m * sc, m * m * m * m * sc, m * m * m * m * sc);
    }
    p.needsUpdate = true; c.needsUpdate = true; geo.computeVertexNormals();
  }
  setJaw(0);
  return { mesh, setJaw };
}

// ---- 髪：640本の毛束。頭の上は頭の形に沿わせ、そこから先は1本ずつ重力で垂らす ----
function makeHair(head, r) {
  const mat = new THREE.MeshPhongMaterial({ color: 0x0b0e13, specular: 0x1b2026, shininess: 30, side: THREE.DoubleSide });
  const topMat = new THREE.MeshPhongMaterial({ color: 0x030406, specular: 0x0b0e11, shininess: 22, side: THREE.DoubleSide });
  const o = [0, 0, 0];
  const surf = (a, ph, k, v) => { const s = Math.sin(ph) * R * k; sculpt(Math.sin(a) * s, Math.cos(ph) * R * k, Math.cos(a) * s, o); return v.set(o[0], o[1], o[2]); };
  const phOfY = (y, k) => Math.acos(clamp(y / (1.24 * R * k), -1, 1));
  const N = 640, S = [], pos = [], idx = [];
  for (let i = 0; i < N; i++) {
    const a = ((i + r()) / N) * Math.PI * 2 - Math.PI, aa = Math.abs(a), sg = a >= 0 ? 1 : -1;
    const fringe = aa < 0.8;
    if (fringe && a < -0.16 && a > -0.44 && i % 7 !== 0) continue; // 片目だけのぞくすき間
    const stay = fringe && aa < 0.5 && i % 17 === 0;                // 開いても顔に残る細い毛
    if (fringe && !stay && i % 9 > 4) continue;                     // 前髪はまばらにして、すき間から顔がのぞくようにする
    const k = 1.03 + r() * 0.035, kE = k + 0.02;
    const w = stay ? 0.0042 : fringe ? 0.003 + r() * 0.008 : 0.007 + r() * 0.015;
    const phE = fringe ? phOfY(hairlineY(a) + 0.005, kE) : phOfY(0.045 - r() * 0.05, kE);
    const phR = Math.min(phE - 0.15, fringe ? 0.2 + r() * 0.6 : 0.03 + r() * 0.6);
    const sx = Math.cos(a) * w * 0.62, sz = -Math.sin(a) * w * 0.62, nseg = Math.max(2, Math.ceil((phE - phR) / 0.1)), b = pos.length / 3;
    let end = null;
    for (let j = 0; j <= nseg; j++) { // 頭に沿う部分
      const u = j / nseg, v = surf(a + Math.sin(u * 3 + i) * 0.02, phR + (phE - phR) * u, k + (kE - k) * u, new THREE.Vector3());
      pos.push(v.x - sx, v.y, v.z - sz, v.x + sx, v.y, v.z + sz); end = v;
      if (j < nseg) { const q = b + j * 2; idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); }
    }
    let r1 = null;
    if (fringe && !stay) { const a1 = sg * (0.84 + aa * 0.42); r1 = surf(a1, phOfY(hairlineY(a1) + 0.005, kE), kE, new THREE.Vector3()); } // 開いたときの位置（こめかみ）
    const total = fringe ? 0.3 + r() * 0.46 : aa > 2.0 ? 0.9 + r() * 0.45 : aa < 1.2 ? 0.55 + r() * 0.4 : 0.36 + r() * 0.14;
    const L1 = Math.min(0.19, total * 0.36);
    S.push({ sg, r0: end, r1, L1, L2: total - L1, w, amp: 0.004 + r() * 0.016, mix: r(), lift: fringe ? 0.62 : 0.03, tone: 0.25 + r() * r() * 1.5, sp: 0.5 + r() * 0.9, ph: r() * 6.28,
      yq: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), a + (r() - 0.5) * 0.5) });
  }
  for (let j = 0; j < 54; j++) { // 額にはりつく短いおくれ毛（髪を開いても残る）
    const a = (r() - 0.5) * 1.5, len = 0.03 + r() * 0.055, k = 1.022;
    S.push({ sg: 1, r0: surf(a, phOfY(hairlineY(a) + 0.003, k), k, new THREE.Vector3()), r1: null, L1: len * 0.6, L2: len * 0.4, w: 0.0028 + r() * 0.004, amp: 0.002 + r() * 0.004, mix: r(), lift: 0.64, tone: 0.3 + r(), sp: 0.5 + r(), ph: r() * 6.28,
      yq: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), a + (r() - 0.5) * 0.4) });
  }
  for (let i = S.length - 1; i > 0; i--) { const j = (r() * (i + 1)) | 0; [S[i], S[j]] = [S[j], S[i]]; } // 順番をまぜておく（本数を減らしても、まんべんなく残るように）
  let cnt = S.length;
  const top = new THREE.BufferGeometry(); top.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); top.setIndex(idx); top.computeVertexNormals();
  head.add(new THREE.Mesh(top, topMat));
  const seg = (taper, wave) => { // 長さ1・幅1の毛束（実際の長さと幅は1本ずつ変える）
    const P = [], I = [], m = 12;
    for (let j = 0; j <= m; j++) { const v = j / m, hw = 0.5 * (1 - Math.pow(v, 2.5) * taper), z = wave(v); P.push(-hw, -v, z, hw, -v, z); if (j < m) { const q = j * 2; I.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); } }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals(); return g;
  };
  const m1 = new THREE.InstancedMesh(seg(0, (v) => Math.sin(v * Math.PI) * 0.35), mat, S.length);
  const m2 = new THREE.InstancedMesh(seg(0.85, (v) => Math.sin(v * 5.2) * v * (1 - v * 0.4)), mat, S.length);
  m1.frustumCulled = m2.frustumCulled = false; head.add(m1, m2);
  { const c = new THREE.Color(); S.forEach((s, i) => { c.setRGB(s.tone, s.tone * 1.04, s.tone * 1.1); m1.setColorAt(i, c); m2.setColorAt(i, c); }); }
  const DOWN = new THREE.Vector3(0, -1, 0), g = [DOWN.clone(), DOWN.clone()], gv = [new THREE.Vector3(), new THREE.Vector3()], gT = new THREE.Vector3();
  const KS = [80, 30], DS = [9, 4.5]; // 速く追う髪と、遅れて揺れる髪
  const _q = new THREE.Quaternion(), _d = new THREE.Vector3(), _d1 = new THREE.Vector3(), _p = new THREE.Vector3(), _n = new THREE.Vector3(), _s = new THREE.Vector3(), _m = new THREE.Matrix4();
  let ready = false;
  function update(t, dt, part, sway) {
    head.getWorldQuaternion(_q).invert(); gT.copy(DOWN).applyQuaternion(_q); // 頭から見た「下」
    if (!ready || dt < 0 || dt > 0.2) { g[0].copy(gT); g[1].copy(gT); gv[0].set(0, 0, 0); gv[1].set(0, 0, 0); ready = true; }
    else if (dt > 0) { const steps = dt > 0.02 ? 3 : 1, h = dt / steps;
      for (let k = 0; k < steps; k++) for (let c = 0; c < 2; c++) { _d.copy(gT).sub(g[c]).multiplyScalar(KS[c]).addScaledVector(gv[c], -DS[c]); gv[c].addScaledVector(_d, h); g[c].addScaledVector(gv[c], h); } }
    for (let i = 0; i < cnt; i++) {
      const s = S[i], pt = s.r1 ? part : 0;
      _p.copy(s.r0); if (pt > 0) _p.lerp(s.r1, pt);
      _n.set(_p.x, 0, _p.z).normalize();
      if (pt > 0) _p.addScaledVector(_n, 0.05 * pt * (1 - pt));
      _d.copy(g[0]).lerp(g[1], s.mix);
      _d.x += Math.sin(t * s.sp + s.ph) * 0.03 * sway; _d.z += Math.cos(t * s.sp * 0.8 + s.ph) * 0.03 * sway; _d.normalize();
      const into = Math.max(0, -(_d.x * _n.x + _d.z * _n.z));                              // 重力が頭の中へ向かう分
      const k1 = into * 1.1 + s.lift * clamp01((-_d.y - 0.55) / 0.45) * (1 - 0.85 * pt); // 頭や顔にめりこまないよう外へ逃がす
      _d1.set(_d.x + _n.x * k1, _d.y, _d.z + _n.z * k1).normalize();
      _q.setFromUnitVectors(DOWN, _d1).multiply(s.yq);
      m1.setMatrixAt(i, _m.compose(_p, _q, _s.set(s.w, s.L1, s.amp)));
      _p.addScaledVector(_d1, s.L1);
      _d1.set(_d.x + _n.x * into * 0.2, _d.y, _d.z + _n.z * into * 0.2).normalize();
      _q.setFromUnitVectors(DOWN, _d1).multiply(s.yq);
      m2.setMatrixAt(i, _m.compose(_p, _q, _s.set(s.w, s.L2, s.amp)));
    }
    m1.instanceMatrix.needsUpdate = true; m2.instanceMatrix.needsUpdate = true;
  }
  return { update, count: S.length, setDetail(k) { cnt = Math.max(60, Math.round(S.length * k)); m1.count = m2.count = cnt; } };
}

// ---- 手（関節のある長い指と爪、手の甲のすじ） ----
function makeHand(sx, skin, nailMat) {
  const hand = new THREE.Group();
  const palmG = new THREE.BoxGeometry(0.066, 0.086, 0.02, 8, 8, 3);
  { const p = palmG.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) * (0.8 + (0.043 - y) * 2.6)); } palmG.computeVertexNormals(); }
  const palm = new THREE.Mesh(palmG, skin); palm.position.y = -0.045; hand.add(palm);
  for (let k = 0; k < 4; k++) { const tn = new THREE.Mesh(new THREE.CylinderGeometry(0.0028, 0.0034, 0.085, 8), skin); tn.position.set((k - 1.5) * 0.015, -0.045, -0.0105); tn.rotation.z = (k - 1.5) * 0.11; hand.add(tn); }
  const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.016, 0.16, 16, 4), skin); wrist.position.y = 0.07; wrist.scale.z = 0.72; hand.add(wrist);
  const fingers = [];
  for (let f = 0; f < 5; f++) {
    const thumb = f === 0, root = new THREE.Group();
    root.position.set(thumb ? -sx * 0.04 : (f - 2.5) * 0.0185 * -sx, thumb ? -0.03 : -0.088, 0);
    const L = thumb ? 0.085 : 0.135 + (f === 2 ? 0.02 : 0) - (f === 4 ? 0.03 : 0) - (f === 1 ? 0.008 : 0);
    const segs = thumb ? [0.5, 0.5] : [0.42, 0.32, 0.26], joints = []; let parent = root, rad = thumb ? 0.0085 : 0.0072;
    segs.forEach((k) => {
      const jg = new THREE.Group(); parent.add(jg); const len = L * k;
      const bone = new THREE.CylinderGeometry(rad * 0.82, rad, len, 12, 3); bone.translate(0, -len / 2, 0);
      jg.add(new THREE.Mesh(bone, skin));
      jg.add(new THREE.Mesh(new THREE.SphereGeometry(rad * 1.25, 12, 9), skin)); // 節
      const next = new THREE.Group(); next.position.y = -len; jg.add(next); joints.push(jg); parent = next; rad *= 0.84;
    });
    const nail = new THREE.ConeGeometry(rad * 1.1, 0.04, 10, 3); nail.rotateX(Math.PI); nail.translate(0, -0.02, 0); nail.scale(1, 1, 0.55);
    parent.add(new THREE.Mesh(nail, nailMat));
    root.userData = { spread: thumb ? -sx * 0.95 : (f - 2.5) * 0.1 * -sx, f, joints, thumb };
    hand.add(root); fingers.push(root);
  }
  return { hand, fingers };
}

export function makeOkiku() {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const r = rnd(77);
  const cloth = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
  const skin = new THREE.MeshLambertMaterial({ color: 0xa9b3ab });
  const nailMat = new THREE.MeshLambertMaterial({ color: 0x2c2228 });
  const whiteAt = (c, y, top, bottom, k = 1) => { // 上は白、すそは闇に溶ける
    const u = clamp01((y - bottom) / (top - bottom)), v = Math.pow(u, 0.8) * k;
    c.setRGB(0.045 + 0.8 * v, 0.055 + 0.82 * v, 0.075 + 0.8 * v);
  };
  // 着物：しわのあるすそ（下はぼろぼろで、井戸の水としみで黒ずむ）
  const skirt = new THREE.CylinderGeometry(0.175, 0.37, 1.3, 128, 52, true);
  { const p = skirt.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), u = (0.65 - y) / 1.3, a = Math.atan2(x, z);
      const fold = 1 + (Math.sin(a * 9 + Math.sin(y * 5) * 1.2) * 0.045 + Math.sin(a * 23 + y * 9) * 0.014 + Math.sin(a * 47 + y * 21) * 0.005) * Math.pow(u, 0.7) + (hash(i * 3.1) - 0.5) * 0.02 * u;
      p.setX(i, x * fold); p.setZ(i, z * fold * 0.8);
      if (u > 0.9) p.setY(i, y + hash(Math.round(a * 9) * 9.7) * 0.22 * (u - 0.9) * 10);
    } }
  skirt.translate(0, 0.65, 0); skirt.computeVertexNormals();
  tintGeo(skirt, (c, x, y, z) => {
    const a = Math.atan2(x, z); whiteAt(c, y, 1.1, 0.03, 0.9 + Math.sin(a * 9 + Math.sin((y - 0.65) * 5) * 1.2) * 0.1);
    const st = clamp01(Math.sin(a * 3.1 + Math.sin(y * 7) * 2) * Math.sin(y * 9 + a * 2) * 1.6) * sstep(0.95, 0.35, y); // しみ
    c.r *= 1 - st * 0.5; c.g *= 1 - st * 0.62; c.b *= 1 - st * 0.66;
  });
  body.add(new THREE.Mesh(skirt, cloth));
  // 上半身（なで肩）
  const chest = new THREE.CylinderGeometry(0.1, 0.178, 0.42, 72, 24);
  { const p = chest.attributes.position;
    for (let i = 0; i < p.count; i++) { const y = p.getY(i), u = (y + 0.21) / 0.42; const w = 1 + Math.sin(clamp01(u * 1.15) * Math.PI) * 0.34; p.setX(i, p.getX(i) * w * 1.2); p.setZ(i, p.getZ(i) * (0.72 + 0.1 * Math.sin(u * 3))); } }
  chest.translate(0, 1.44, 0); chest.computeVertexNormals();
  tintGeo(chest, (c, x, y) => { const v = y > 1.645 ? 0.16 : 0.8 + Math.sin(x * 60 + y * 20) * 0.03; c.setRGB(v, v * 1.03, v * 1.02); });
  body.add(new THREE.Mesh(chest, cloth));
  // えり（死に装束は左前）
  for (const s of [1, -1]) {
    const pts = []; for (let k = 0; k <= 24; k++) { const u = k / 24; pts.push(new THREE.Vector3(s * (0.085 - u * 0.15), 1.63 - u * 0.36, 0.085 + Math.sin(u * 2.6) * 0.058 + (s < 0 ? 0.006 : 0))); }
    const band = ribbon(pts, 0.05, { x: 0.86, z: -0.5 * s }, 0); tintGeo(band, (c) => c.setRGB(0.58, 0.62, 0.63)); body.add(new THREE.Mesh(band, cloth));
  }
  const obi = new THREE.Mesh(tintGeo(new THREE.CylinderGeometry(0.182, 0.186, 0.05, 48, 1, true), (c) => c.setRGB(0.5, 0.53, 0.55)), cloth); obi.scale.set(1.03, 1, 0.84); obi.position.y = 1.24; body.add(obi);
  // 首（長すぎる。すじが浮く）
  const neckG = new THREE.CylinderGeometry(0.036, 0.05, 0.24, 40, 12);
  { const p = neckG.attributes.position; for (let i = 0; i < p.count; i++) { const a = Math.atan2(p.getX(i), p.getZ(i)); const k = 1 + 0.16 * (gauss(a - 0.5, 0, 0.16, 1) + gauss(a + 0.5, 0, 0.16, 1)); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); } neckG.computeVertexNormals(); }
  const neck = new THREE.Mesh(neckG, skin); neck.position.set(0, 1.655, -0.035); neck.rotation.x = 0.12; body.add(neck);

  // 頭
  const headPivot = new THREE.Group(); headPivot.position.set(0, 1.75, 0); body.add(headPivot);
  const head = new THREE.Group(); head.position.y = 0.14; headPivot.add(head);
  const H = makeHead(skinTexture()); head.add(H.mesh);
  // 眼球（向かって左だけ。飛び出していて、相手を目で追う）
  const eyeMat = new THREE.MeshBasicMaterial({ map: eyeTexture(), color: 0x8a8a84 });
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.0205, 32, 24), eyeMat); eye.rotation.y = -Math.PI / 2; eye.position.set(-0.047, 0.02, 0.114); head.add(eye);
  const pitMat = new THREE.MeshBasicMaterial({ color: 0x000000 }); // 黒い穴の奥で、ときどき赤く光るもの
  const pit = new THREE.Mesh(new THREE.SphereGeometry(0.0032, 10, 8), pitMat); pit.position.set(0.047, 0.016, 0.104); head.add(pit);
  // 歯と歯ぐき（上は頭に、下はあごと一緒に動く）
  const toothMat = new THREE.MeshLambertMaterial({ color: 0x8d8566 }), gumMat = new THREE.MeshLambertMaterial({ color: 0x3c0d14 });
  const upper = new THREE.Group(), lower = new THREE.Group(); head.add(upper, lower);
  for (let i = 0; i < 13; i++) {
    const u = (i - 6) / 6, x = u * 0.03, z = 0.133 - u * u * 0.014;
    if (i !== 3 && i !== 9) { const h = 0.009 + hash(i * 3.3) * 0.006, g1 = new THREE.CylinderGeometry(0.0017, 0.0026, h, 10, 2); g1.translate(0, -h / 2, 0);
      const t1 = new THREE.Mesh(g1, toothMat); t1.position.set(x, MOUTH_Y - 0.003, z); t1.rotation.z = (hash(i) - 0.5) * 0.35; t1.scale.z = 0.7; upper.add(t1); }
    if (i % 5 !== 2) { const h = 0.007 + hash(i * 5.1) * 0.005, g2 = new THREE.CylinderGeometry(0.0024, 0.0016, h, 10, 2); g2.translate(0, h / 2, 0);
      const t2 = new THREE.Mesh(g2, toothMat); t2.position.set(x * 0.9, MOUTH_Y - 0.03, z - 0.014); t2.rotation.z = (hash(i + 20) - 0.5) * 0.45; t2.scale.z = 0.7; lower.add(t2); }
  }
  for (const [grp, y, zz] of [[upper, MOUTH_Y - 0.002, 0.118], [lower, MOUTH_Y - 0.031, 0.104]]) {
    const gum = new THREE.Mesh(new THREE.TorusGeometry(0.031, 0.0042, 10, 36, Math.PI), gumMat); gum.rotation.x = Math.PI / 2; gum.scale.set(1, 0.5, 1); gum.position.set(0, y, zz - 0.018); grp.add(gum); }
  upper.visible = lower.visible = false;
  // 髪
  const hair = makeHair(head, r);

  // 腕（広いそで＋骨ばった手）
  const arms = [];
  for (const sx of [-1, 1]) {
    const arm = new THREE.Group(); arm.position.set(sx * 0.2, 1.53, 0); body.add(arm);
    const up = new THREE.CylinderGeometry(0.062, 0.085, 0.42, 32, 14);
    { const p = up.attributes.position; for (let i = 0; i < p.count; i++) { const a = Math.atan2(p.getX(i), p.getZ(i)), k = 1 + Math.sin(a * 5 + p.getY(i) * 14) * 0.06; p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k * 1.15); } }
    up.translate(0, -0.2, 0); up.computeVertexNormals(); tintGeo(up, (c, x, y) => { const v = 0.78 + Math.sin(y * 40) * 0.03; c.setRGB(v, v * 1.03, v * 1.02); });
    arm.add(new THREE.Mesh(up, cloth));
    const fore = new THREE.Group(); fore.position.y = -0.4; arm.add(fore);
    const sl = new THREE.BoxGeometry(0.11, 0.38, 0.36, 6, 26, 26);
    { const p = sl.attributes.position;
      for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), v = (0.19 - y) / 0.38;
        p.setX(i, x * (1 - 0.35 * Math.abs(z) / 0.18) + Math.sin(z * 30 + y * 12) * 0.006 * v);
        if (z < 0.02) p.setY(i, y - (0.26 * v * clamp01((0.02 - z) / 0.2)) - hash(Math.round(z * 40) * 5.3) * 0.05 * v); } } // たもとが垂れる
    sl.translate(0, -0.17, -0.06); sl.computeVertexNormals(); tintGeo(sl, (c, x, y, z) => whiteAt(c, y, 0.05, -0.8, 0.92 + Math.sin(z * 30 + y * 12) * 0.08));
    fore.add(new THREE.Mesh(sl, cloth));
    const hd = makeHand(sx, skin, nailMat); hd.hand.position.set(0, -0.42, 0.03); fore.add(hd.hand);
    arms.push({ arm, fore, hand: hd.hand, fingers: hd.fingers, sx });
  }

  const pose = { reach: 0, headDown: 0.75, headTilt: 0.0, headTurn: 0, lean: 0.06, mouth: 0, part: 0, eye: 0.55, twitch: 0.25, sway: 1, fps: 9, shiver: 0 };
  const api = { root, pose, lookAt: null };
  const _v = new THREE.Vector3();
  let tw = 0, twT = -1, lastT = null;
  function update(t) {
    const dt = lastT === null ? -1 : t - lastT; lastT = t;
    const tq = pose.fps > 0 ? Math.floor(t * pose.fps) / pose.fps : t; // 体はコマ撮りのようにカクカク動く（髪だけはなめらかに揺れる）
    const step = Math.floor(t * (pose.fps || 9));
    if (step !== twT) { twT = step; tw = hash(step * 1.37) > 1 - pose.twitch * 0.35 ? (hash(step * 7.7) - 0.5) : tw * 0.4; }
    const sh = pose.shiver;
    body.rotation.x = pose.lean + Math.sin(tq * 0.9) * 0.015 * pose.sway + (hash(step * 3.3) - 0.5) * 0.03 * sh;
    body.rotation.z = Math.sin(tq * 0.6 + 1) * 0.02 * pose.sway + (hash(step * 4.1) - 0.5) * 0.04 * sh;
    body.position.y = Math.sin(tq * 1.1) * 0.012 * pose.sway;
    headPivot.rotation.x = pose.headDown + Math.sin(tq * 0.7) * 0.03 * pose.sway + (hash(step * 5.9) - 0.5) * 0.12 * sh;
    headPivot.rotation.z = pose.headTilt + tw * 0.5 * pose.twitch + (hash(step * 6.3) - 0.5) * 0.1 * sh;
    headPivot.rotation.y = pose.headTurn + tw * 0.25 * pose.twitch;
    const mo = clamp01(pose.mouth);
    H.setJaw(mo); upper.visible = lower.visible = mo > 0.12; lower.position.set(mo * 0.011, -mo * 0.105 * 0.82, -mo * 0.03);
    for (const A of arms) {
      const j = (hash(step * 2.1 + A.sx) - 0.5) * 0.08 * (pose.reach + sh);
      A.arm.rotation.x = -pose.reach * 1.25 + j; A.arm.rotation.z = A.sx * (0.07 + pose.reach * 0.3);
      A.fore.rotation.x = -pose.reach * 0.55; A.hand.rotation.x = -pose.reach * 0.55;
      for (const f of A.fingers) {
        const d = f.userData; f.rotation.z = d.spread * (0.3 + pose.reach * 1.0);
        const curl = 0.16 + pose.reach * 0.42 + Math.sin(tq * 3 + d.f) * 0.1 * (pose.reach + sh * 0.5);
        d.joints.forEach((jg, k) => { jg.rotation.x = (d.thumb ? 0.2 : 1) * curl * (k === 0 ? -0.4 : 1.0); }); // つけ根は反り、先はかぎ爪に曲がる
      }
    }
    root.updateMatrixWorld(true);
    hair.update(t, dt, clamp01(pose.part), pose.sway);
    // 目：相手の位置を目だけで追う。ときどき小さくふるえる
    let yaw = -0.1, pitch = 0;
    if (api.lookAt) { _v.copy(api.lookAt); head.worldToLocal(_v); _v.sub(eye.position); yaw = clamp(Math.atan2(_v.x, _v.z), -0.7, 0.7) - 0.05; pitch = clamp(-Math.atan2(_v.y, Math.hypot(_v.x, _v.z)), -0.5, 0.5); }
    eye.rotation.set(pitch + (hash(step * 2.9) - 0.5) * 0.1 * sh, -Math.PI / 2 + yaw + (hash(step * 3.9) - 0.5) * 0.14 * sh, 0);
    eyeMat.color.setScalar(pose.eye); eye.scale.setScalar(1 + mo * 0.22);
    const glow = Math.max(0, pose.eye - 0.7) * (hash(Math.floor(t * 5) * 1.7) > 0.45 ? 1 : 0.15); pitMat.color.setRGB(glow * 0.55, glow * 0.02, glow * 0.02);
  }
  update(0);
  api.update = update;
  api.headWorld = (v) => { root.updateMatrixWorld(true); return head.getWorldPosition(v); };
  api.triangles = () => { let n = 0; root.traverse((m) => { if (m.isMesh) { const g = m.geometry, c = (g.index ? g.index.count : g.attributes.position.count) / 3; n += c * (m.isInstancedMesh ? m.count : 1); } }); return Math.round(n); };
  api.strands = hair.count; api.setDetail = hair.setDetail; // 重い端末では毛束を減らせる
  return api;
}
