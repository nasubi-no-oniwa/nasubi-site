// 人間はどこだ：広場の形と、試合の計算（代表の人のスマホだけが動かす）
export const HALF = 30;            // 広場の半分の広さ
export const CIT = 40;             // 市民（AI）の数
export const DUR = 180;            // 試合の長さ（秒）
export const REACH = 3.2;          // 逮捕できる距離
export const CD = 5;               // 次の逮捕までの秒数
export const RED = 5;              // まちがえたときに赤いマークが出る秒数
export const ST = { idle: 0, walk: 1, sit: 2, look: 3, shock: 4, gone: 5 };

export function rng(seed) { let a = seed >>> 0 || 1; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ---------- 広場の形（全員同じ） ----------
export const OBS = [], BENCH = [], STALL = [], TREE = [], LAMP = [];
OBS.push({ x: 0, z: 0, r: 4.9, k: 'fountain' });
for (let i = 0; i < 8; i++) { // 噴水のまわりのベンチ（噴水のほうを向く）
  const a = (i + .5) / 8 * Math.PI * 2, r = 10.5, x = Math.sin(a) * r, z = Math.cos(a) * r, ry = Math.atan2(-x, -z);
  const b = { x, z, ry, seats: [] }; const px = Math.cos(ry), pz = -Math.sin(ry);
  for (const s of [-.55, .55]) b.seats.push({ x: x + px * s - Math.sin(ry) * .05, z: z + pz * s - Math.cos(ry) * .05 });
  BENCH.push(b); OBS.push({ x, z, r: 1.15, k: 'bench' });
}
for (let i = 0; i < 6; i++) { // 屋台（外がわ。広場の中を向く）
  const a = i / 6 * Math.PI * 2 + .26, r = 22.5, x = Math.sin(a) * r, z = Math.cos(a) * r, ry = Math.atan2(-x, -z);
  STALL.push({ x, z, ry, fx: x + Math.sin(ry) * 2.6, fz: z + Math.cos(ry) * 2.6, c: i });
  OBS.push({ x, z, r: 2.1, k: 'stall' });
}
{ const R = rng(77); for (let i = 0; i < 14; i++) { // 木
  const a = i / 14 * Math.PI * 2 + .12, r = i % 2 ? 16.5 : 27.5, x = Math.sin(a) * r, z = Math.cos(a) * r;
  if (STALL.some(s => Math.hypot(s.x - x, s.z - z) < 5)) continue; TREE.push({ x, z, s: .85 + R() * .4 }); OBS.push({ x, z, r: .75, k: 'tree' }); } }
for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + Math.PI / 4, x = Math.sin(a) * 14, z = Math.cos(a) * 14; LAMP.push({ x, z }); OBS.push({ x, z, r: .35, k: 'lamp' }); }

export function free(x, z, pad = .5) { if (Math.abs(x) > HALF - 1 || Math.abs(z) > HALF - 1) return false; for (const o of OBS) if (Math.hypot(x - o.x, z - o.z) < o.r + pad) return false; return true; }
export function randPt(R) { for (let i = 0; i < 60; i++) { const x = (R() * 2 - 1) * (HALF - 2), z = (R() * 2 - 1) * (HALF - 2); if (free(x, z, .7)) return [x, z]; } return [8, 8]; }
export function clampPt(x, z) { x = Math.max(-HALF + 1.2, Math.min(HALF - 1.2, x)); z = Math.max(-HALF + 1.2, Math.min(HALF - 1.2, z)); for (const o of OBS) { const d = Math.hypot(x - o.x, z - o.z), m = o.r + .45; if (d < m) { const k = d < 1e-4 ? 1 : m / d; x = o.x + (x - o.x || .01) * k; z = o.z + (z - o.z) * k; } } return [x, z]; }

// 見た目（id と seed で全員同じになる。人間とAIで区別はつかない）
export const SHIRT = ['#d9534f', '#4a7bd0', '#5aa469', '#e8b33a', '#8e6bc4', '#e8e2d6', '#3a3f4b', '#e07b39', '#4fb3bf', '#c75b8f'];
export const PANTS = ['#2f3542', '#55606e', '#3d5a80', '#6b4f3a', '#1e1e24', '#8a8f98'];
export const SKIN = ['#f3d2b3', '#e6b98f', '#c98f62', '#9a6a45'];
export const HAIR = ['#1d1b1a', '#3b2a20', '#6b4a2e', '#b8925a', '#8a8a8a', '#2b2f3a'];
// 見た目：全員まったく同じ服装・背格好（人間とAIで区別はつかない）
export const LOOK = { shirt: '#4a7bd0', pants: '#2f3542', skin: '#e6b98f', hair: '#1d1b1a', h: 1, hat: null, bag: false };
export function look(seed, id) { return LOOK; }

// ---------- 試合の計算 ----------
export class Sim {
  constructor(seed, humans) {
    this.seed = seed >>> 0; const R = this.R = rng(this.seed ^ 0x9e3779b9);
    const N = CIT + humans.length, ids = [...Array(N).keys()];
    for (let i = N - 1; i > 0; i--) { const j = R() * (i + 1) | 0;[ids[i], ids[j]] = [ids[j], ids[i]]; }
    this.E = []; for (let i = 0; i < N; i++) this.E.push(null);
    this.H = {}; this.order = humans.map(h => h.pid);
    const take = new Set();
    humans.forEach((h, i) => { const eid = ids[i]; take.add(eid); this.H[h.pid] = { eid, n: h.n, score: 0, miss: 0, out: 0, by: '', left: 0 }; });
    for (let id = 0; id < N; id++) {
      const [x, z] = randPt(R), hum = take.has(id);
      const e = { id, x, z, ry: R() * 6.283, sp: 1.25 + R() * .4, st: ST.idle, tx: x, tz: z, tm: .5 + R() * 3, g: null, h: hum ? 1 : 0, red: 0, cd: 0, stuck: 0, lx: x, lz: z, turn: 0, tr: R() * 6.283 };
      this.E[id] = e;
      if (!hum) { const r = R(); if (r < .45) this.goal(e); else if (r < .62) this.goBench(e, true); else if (r < .74) this.goStall(e, true); }
      else e.tm = 1e9;
    }
    this.T = 0; this.over = false; this.nextTrail = 0; this.ev = [];
    // 結果のリプレイ用の道すじ：人間全員と、市民から14人
    this.trail = {}; for (const p in this.H) this.trail[this.H[p].eid] = [];
    let c = 0; for (const e of this.E) if (!e.h && c < 14) { this.trail[e.id] = []; c++; }
  }
  // 市民の行き先を決める
  goal(e) { const [x, z] = randPt(this.R); e.g = { k: 'pt' }; e.tx = x; e.tz = z; e.st = ST.walk; }
  seatFree(b, s) { return !this.E.some(o => o && o.g && o.g.k === 'bench' && o.g.b === b && o.g.s === s); }
  goBench(e, warp, near) {
    const list = []; BENCH.forEach((b, bi) => b.seats.forEach((s, si) => { if (this.seatFree(bi, si)) list.push([bi, si, Math.hypot(s.x - e.x, s.z - e.z)]); }));
    if (!list.length) return this.goal(e);
    let pick; if (near != null) { list.sort((a, b) => a[2] - b[2]); if (list[0][2] > near) return false; pick = list[0]; } else pick = list[this.R() * list.length | 0];
    const s = BENCH[pick[0]].seats[pick[1]]; e.g = { k: 'bench', b: pick[0], s: pick[1] };
    // ベンチの前に立ってから座る
    const b = BENCH[pick[0]]; e.tx = s.x + Math.sin(b.ry) * .9; e.tz = s.z + Math.cos(b.ry) * .9;
    if (warp) { e.x = s.x; e.z = s.z; e.ry = b.ry; e.st = ST.sit; e.tm = 3 + this.R() * 10; } else e.st = ST.walk;
    return true;
  }
  goStall(e, warp, near) {
    let si; if (near != null) { let best = 1e9; STALL.forEach((s, i) => { const d = Math.hypot(s.fx - e.x, s.fz - e.z); if (d < best) { best = d; si = i; } }); if (best > near) return false; } else si = this.R() * STALL.length | 0;
    const s = STALL[si], a = (this.R() - .5) * 1.6, ox = Math.cos(s.ry) * a, oz = -Math.sin(s.ry) * a;
    e.g = { k: 'stall', i: si }; e.tx = s.fx + ox; e.tz = s.fz + oz;
    if (warp) { e.x = e.tx; e.z = e.tz; e.ry = s.ry + Math.PI; e.st = ST.look; e.tm = 2 + this.R() * 6; } else e.st = ST.walk;
    return true;
  }
  ai(e) { const r = this.R(); if (r < .58) this.goal(e); else if (r < .8) this.goBench(e); else this.goStall(e); }
  arrive(e) {
    const g = e.g || { k: 'pt' };
    if (g.k === 'bench') { const b = BENCH[g.b], s = b.seats[g.s]; e.x = s.x; e.z = s.z; e.st = ST.sit; e.ry = b.ry; e.tm = e.h ? 1e9 : 5 + this.R() * 10; }
    else if (g.k === 'stall') { const s = STALL[g.i]; e.st = ST.look; e.ry = Math.atan2(s.x - e.x, s.z - e.z); e.tm = e.h ? 1e9 : 3 + this.R() * 6; }
    else { e.st = ST.idle; e.tm = e.h ? 1e9 : .8 + this.R() * 4; e.g = null; }
  }
  // 遊んでいる人の操作
  input(pid, m) {
    const H = this.H[pid]; if (!H || H.out || H.left || this.over) return null; const e = this.E[H.eid]; if (!e || e.st === ST.gone) return null;
    if (m.k === 'go') { const [x, z] = clampPt(+m.x || 0, +m.z || 0); e.g = { k: 'pt' }; e.tx = x; e.tz = z; e.st = ST.walk; e.stuck = 0; }
    else if (m.k === 'act') {
      if (m.a === 'stop') { if (e.st === ST.walk) { e.st = ST.idle; e.g = null; } }
      else if (m.a === 'sit') { if (e.st !== ST.sit) this.goBench(e, false, 4); }
      else if (m.a === 'look') { if (e.st !== ST.look) this.goStall(e, false, 4.5); }
    }
    else if (m.k === 'arr') return this.arrest(pid, m.id | 0);
    return null;
  }
  arrest(pid, tid) {
    const H = this.H[pid], a = this.E[H.eid], b = this.E[tid];
    if (!b || b === a || b.st === ST.gone || a.cd > 0) return null;
    if (Math.hypot(a.x - b.x, a.z - b.z) > REACH + .25) return null;
    a.cd = CD;
    const vp = Object.keys(this.H).find(p => this.H[p].eid === tid && !this.H[p].out && !this.H[p].left);
    if (vp) {
      const V = this.H[vp]; V.out = Math.max(.1, this.T); V.by = H.n; H.score++; b.st = ST.gone; b.g = null;
      const ev = { k: 'arr', b: tid, x: b.x, z: b.z, v: vp, left: this.aliveN() }; this.push(ev); return ev;
    }
    H.miss++; a.red = RED; b.st = ST.shock; b.tm = 2.6; b.g = null; b.ry = Math.atan2(a.x - b.x, a.z - b.z);
    const ev = { k: 'miss', b: tid, x: b.x, z: b.z }; this.push(ev); return ev;
  }
  push(ev) { ev.T = +this.T.toFixed(2); this.ev.push(ev); }
  aliveN() { let n = 0; for (const p in this.H) if (!this.H[p].out && !this.H[p].left) n++; return n; }
  // 抜けた人：その人の体は、そのまま市民（AI）として歩きつづける
  leave(pid) { const H = this.H[pid]; if (!H || H.left) return; H.left = 1; if (!H.out) { const e = this.E[H.eid]; e.h = 0; e.tm = 1; } }
  step(dt) {
    if (this.over) return;
    this.T += dt; const E = this.E;
    for (const e of E) {
      if (e.st === ST.gone) continue;
      if (e.red > 0) e.red = Math.max(0, e.red - dt); if (e.cd > 0) e.cd = Math.max(0, e.cd - dt);
      if (e.st === ST.walk) {
        let dx = e.tx - e.x, dz = e.tz - e.z; const d = Math.hypot(dx, dz);
        if (d < .25) { this.arrive(e); continue; }
        dx /= d; dz /= d;
        // ぶつからないように少しよける
        let ax = 0, az = 0;
        for (const o of OBS) { const ox = e.x - o.x, oz = e.z - o.z, od = Math.hypot(ox, oz), m = o.r + 1.1; if (od < m && od > 1e-4) { const w = (m - od) / m * 1.6; ax += ox / od * w; az += oz / od * w; const t = dx * -oz / od + dz * ox / od; ax += -oz / od * Math.sign(t || 1) * w * .8; az += ox / od * Math.sign(t || 1) * w * .8; } }
        for (const o of E) { if (o === e || o.st === ST.gone) continue; const ox = e.x - o.x, oz = e.z - o.z, od = ox * ox + oz * oz; if (od < .64 && od > 1e-6) { const q = Math.sqrt(od), w = (.8 - q) / .8 * 1.4; ax += ox / q * w; az += oz / q * w; } }
        let vx = dx + ax, vz = dz + az; const vl = Math.hypot(vx, vz) || 1; vx /= vl; vz /= vl;
        const sp = e.sp * (d < 1 ? .6 + d * .4 : 1);
        e.x += vx * sp * dt; e.z += vz * sp * dt;
        const want = Math.atan2(vx, vz); let df = want - e.ry; df = Math.atan2(Math.sin(df), Math.cos(df)); e.ry += Math.max(-7 * dt, Math.min(7 * dt, df));
        // 止まってしまったら（市民は行き先を変える）
        e.stuck += dt; if (e.stuck > 2.5) { const mv = Math.hypot(e.x - e.lx, e.z - e.lz); e.lx = e.x; e.lz = e.z; e.stuck = 0; if (mv < .4) { if (e.h) { e.st = ST.idle; e.g = null; } else this.goal(e); } }
      } else {
        if (e.st === ST.shock) { e.tm -= dt; if (e.tm <= 0) { e.st = ST.idle; e.tm = .8 + this.R(); } continue; }
        if (!e.h) { e.tm -= dt; if (e.tm <= 0) { this.ai(e); continue; } }
        if (e.st === ST.idle && !e.h) { // 立ち止まっているあいだ、ときどき見回す
          e.turn -= dt; if (e.turn <= 0) { e.turn = 1 + this.R() * 2.5; e.tr = e.ry + (this.R() - .5) * 2.2; }
          let df = e.tr - e.ry; df = Math.atan2(Math.sin(df), Math.cos(df)); e.ry += Math.max(-2 * dt, Math.min(2 * dt, df));
        }
      }
    }
    // 重なりと障害物のめりこみを直す
    for (const e of E) { if (e.st === ST.gone || e.st === ST.sit) continue; for (const o of OBS) { const ox = e.x - o.x, oz = e.z - o.z, od = Math.hypot(ox, oz), m = o.r + .3; if (od < m) { const k = od < 1e-4 ? 1 : m / od; e.x = o.x + (ox || .01) * k; e.z = o.z + oz * k; } } e.x = Math.max(-HALF + .5, Math.min(HALF - .5, e.x)); e.z = Math.max(-HALF + .5, Math.min(HALF - .5, e.z)); }
    if (this.T >= this.nextTrail) { this.nextTrail += .5; for (const id in this.trail) { const e = E[id]; this.trail[id].push(e.st === ST.gone ? 9999 : Math.round(e.x * 4), e.st === ST.gone ? 9999 : Math.round(e.z * 4)); } }
    if (this.T >= DUR || (this.order.length >= 2 && this.aliveN() <= 1)) { this.over = true; this.push({ k: 'end' }); }
  }
  // 全員に送る位置（誰が人間かは入っていない）
  snap() { const a = []; for (const e of this.E) a.push(Math.round(e.x * 20), Math.round(e.z * 20), Math.round(e.ry * 100), e.st, e.red > 0 ? 1 : 0); return a; }
  cd(pid) { const H = this.H[pid]; return H ? this.E[H.eid].cd : 0; }
  result() {
    const rows = Object.keys(this.H).map(p => { const h = this.H[p]; return { p, n: h.n, eid: h.eid, s: h.score, m: h.miss, o: h.out, by: h.by, l: h.left }; });
    rows.sort((a, b) => (a.l - b.l) || (b.s - a.s) || ((b.o || 1e9) - (a.o || 1e9)) || (a.m - b.m));
    return { rows, T: +this.T.toFixed(1), trail: this.trail, cit: CIT };
  }
  dump() { return { seed: this.seed, E: this.E, H: this.H, order: this.order, T: this.T, over: this.over, nextTrail: this.nextTrail, trail: this.trail, ev: this.ev.slice(-30) }; }
  static load(d) { const s = Object.create(Sim.prototype); Object.assign(s, d); s.R = rng((d.seed ^ Math.floor(d.T * 1000)) >>> 0); return s; }
}
