// エフェクト：呼吸ごとに絵を作り分ける（水＝浮世絵の波、炎、雷、風、岩、月、霞、恋、花、蛇、蟲、音、獣、日）
import { THREE } from './lib.js?v=11271730';
export const STY = {
  blue: { kind: 'wave', c: '#2a78e6', c2: '#cdeaff', shape: 'drop' }, red: { kind: 'flame', c: '#ff5a1e', c2: '#ffd24a', shape: 'ember' }, yellow: { kind: 'bolt', c: '#ffcf1e', c2: '#fff7c0', shape: 'spark' },
  green: { kind: 'wind', c: '#3fd07a', c2: '#e6fff0', shape: 'streak' }, gray: { kind: 'rock', c: '#a39686', c2: '#e6dccc', shape: 'rock' }, purple: { kind: 'moon', c: '#8a4be0', c2: '#ffe9a0', shape: 'crescent' },
  white: { kind: 'mist', c: '#bfe0ee', c2: '#ffffff', shape: 'puff' }, pink: { kind: 'ribbon', c: '#ff5fa8', c2: '#ffd0e6', shape: 'heart' }, sakura: { kind: 'petal', c: '#f58ab0', c2: '#fff0f5', shape: 'petal' },
  bluepurple: { kind: 'snake', c: '#6a5cf0', c2: '#d8d0ff', shape: 'spark' }, fuji: { kind: 'fly', c: '#b48cf0', c2: '#f3e6ff', shape: 'butterfly' }, orange: { kind: 'boom', c: '#ff8a1e', c2: '#fff0b0', shape: 'ember' },
  ainezu: { kind: 'claw', c: '#7f9ab8', c2: '#e6f4ff', shape: 'spark' }, black: { kind: 'sun', c: '#ff3a14', c2: '#ffb030', shape: 'ember' }, none: { kind: 'plain', c: '#c0c4cc', c2: '#ffffff', shape: 'spark' },
};
const TAU = Math.PI * 2, rnd = (a, b) => a + Math.random() * (b - a);
function ctex(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
// 小さな形（粒）
function shape(x, kind, px, py, s, rot, c, c2) {
  x.save(); x.translate(px, py); x.rotate(rot || 0);
  if (kind === 'crescent') { x.fillStyle = c2; x.shadowColor = c; x.shadowBlur = s * .5; x.beginPath(); x.arc(0, 0, s, -1.9, 1.9); x.arc(s * .42, 0, s * .82, 1.55, -1.55, true); x.closePath(); x.fill(); }
  else if (kind === 'petal') { x.fillStyle = c2; x.beginPath(); x.moveTo(0, -s); x.bezierCurveTo(s * .9, -s * .5, s * .7, s * .8, 0, s); x.bezierCurveTo(-s * .7, s * .8, -s * .9, -s * .5, 0, -s); x.fill(); x.fillStyle = c; x.globalAlpha *= .55; x.beginPath(); x.ellipse(0, s * .25, s * .28, s * .6, 0, 0, TAU); x.fill(); }
  else if (kind === 'heart') { x.fillStyle = c; x.shadowColor = c2; x.shadowBlur = s * .4; x.beginPath(); x.moveTo(0, s * .8); x.bezierCurveTo(-s * 1.4, -s * .2, -s * .6, -s * 1.1, 0, -s * .35); x.bezierCurveTo(s * .6, -s * 1.1, s * 1.4, -s * .2, 0, s * .8); x.fill(); }
  else if (kind === 'butterfly') { for (const sg of [-1, 1]) { x.fillStyle = c2; x.beginPath(); x.ellipse(sg * s * .55, -s * .25, s * .55, s * .42, sg * .5, 0, TAU); x.fill(); x.fillStyle = c; x.beginPath(); x.ellipse(sg * s * .42, s * .35, s * .38, s * .3, -sg * .4, 0, TAU); x.fill(); } x.fillStyle = '#2a1a40'; x.fillRect(-s * .06, -s * .5, s * .12, s); }
  else if (kind === 'rock') { x.fillStyle = c; x.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU, r = s * rnd(.65, 1); x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); x.strokeStyle = c2; x.lineWidth = Math.max(1, s * .12); x.stroke(); }
  else if (kind === 'drop') { x.fillStyle = c2; x.shadowColor = c; x.shadowBlur = s * .6; x.beginPath(); x.arc(0, 0, s * .7, 0, TAU); x.fill(); x.fillStyle = c; x.globalAlpha *= .6; x.beginPath(); x.arc(s * .12, s * .12, s * .36, 0, TAU); x.fill(); }
  else if (kind === 'streak') { x.strokeStyle = c2; x.lineCap = 'round'; x.lineWidth = Math.max(1.5, s * .22); x.beginPath(); x.moveTo(-s, s * .3); x.quadraticCurveTo(0, -s * .5, s, s * .2); x.stroke(); }
  else if (kind === 'puff') { const g = x.createRadialGradient(0, 0, 0, 0, 0, s); g.addColorStop(0, '#ffffffcc'); g.addColorStop(1, '#ffffff00'); x.fillStyle = g; x.fillRect(-s, -s, s * 2, s * 2); }
  else if (kind === 'ember') { const g = x.createRadialGradient(0, 0, 0, 0, 0, s); g.addColorStop(0, '#ffffff'); g.addColorStop(.35, c2); g.addColorStop(.7, c); g.addColorStop(1, '#0000'); x.fillStyle = g; x.fillRect(-s, -s, s * 2, s * 2); }
  else { x.fillStyle = c2; x.shadowColor = c; x.shadowBlur = s * .5; x.beginPath(); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, r = i % 2 ? s * .22 : s; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); }
  x.restore();
}
// 弧の絵（512×512。上にふくらむ弧）
function arcDraw(x, W, S) {
  const cx = W / 2, cy = W * 1.02, R = W * .78, a0 = Math.PI * 1.13, a1 = Math.PI * 1.87, P = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r], k = S.kind, c = S.c, c2 = S.c2;
  const st = (lw, col, al, r, b0, b1, blur) => { x.save(); x.globalAlpha = al; x.strokeStyle = col; x.lineWidth = lw; x.lineCap = 'round'; if (blur) { x.shadowColor = col; x.shadowBlur = blur; } x.beginPath(); x.arc(cx, cy, r || R, b0 == null ? a0 : b0, b1 == null ? a1 : b1); x.stroke(); x.restore(); };
  const jag = (r, amp, lw, col, al, blur) => { x.save(); x.globalAlpha = al; x.strokeStyle = col; x.lineWidth = lw; x.lineJoin = 'miter'; if (blur) { x.shadowColor = col; x.shadowBlur = blur; } x.beginPath(); for (let a = a0; a <= a1 + .001; a += .035) { const p = P(a, r + rnd(-amp, amp)); x.lineTo(p[0], p[1]); } x.stroke(); x.restore(); };
  if (k === 'wave') {
    st(86, c, .5, R - 8, null, null, 24); st(56, '#1a55c8', .9, R - 10); st(30, '#4f9cf5', .9, R - 2); for (let i = 0; i < 5; i++) st(3, '#e8f6ff', .7, R - 34 + i * 9, a0 + rnd(0, .5), a1 - rnd(0, .5));
    for (let a = a0 + .02; a < a1; a += .05) { const r = rnd(15, 25), p = P(a, R + 30 + rnd(-5, 8)); x.fillStyle = '#f6fcff'; x.beginPath(); x.arc(p[0], p[1], r, 0, TAU); x.fill(); const q = P(a + .012, R + 22); x.fillStyle = '#3f8ef0'; x.beginPath(); x.arc(q[0], q[1], r * .5, 0, TAU); x.fill(); x.fillStyle = '#f6fcff'; x.beginPath(); x.arc(q[0] + r * .15, q[1] - r * .1, r * .22, 0, TAU); x.fill(); }
    for (let i = 0; i < 46; i++) { const p = P(rnd(a0, a1), R + rnd(58, 110)); x.fillStyle = '#eaf7ff'; x.globalAlpha = rnd(.5, 1); x.beginPath(); x.arc(p[0], p[1], rnd(2, 6), 0, TAU); x.fill(); } x.globalAlpha = 1;
  } else if (k === 'flame' || k === 'sun' || k === 'boom') {
    if (k === 'sun') st(70, '#3a0600', .7, R - 26, null, null, 10);
    for (let i = 0; i < 64; i++) { const a = rnd(a0, a1), len = rnd(40, k === 'boom' ? 90 : 150), w = rnd(.02, .045), b = P(a - w, R - 18), e = P(a + w, R - 18), tip = P(a + rnd(-.05, .05), R + len), m = P(a, R + len * .45); const g = x.createLinearGradient(b[0], b[1], tip[0], tip[1]); g.addColorStop(0, '#fff8d0'); g.addColorStop(.3, c2); g.addColorStop(.75, c); g.addColorStop(1, k === 'sun' ? '#7a0a00' : c + '00'); x.fillStyle = g; x.globalAlpha = rnd(.55, .95); x.beginPath(); x.moveTo(b[0], b[1]); x.quadraticCurveTo(m[0] + rnd(-14, 14), m[1] + rnd(-14, 14), tip[0], tip[1]); x.quadraticCurveTo(m[0] + rnd(-10, 10), m[1] + rnd(-10, 10), e[0], e[1]); x.closePath(); x.fill(); }
    x.globalAlpha = 1; st(34, c, .9, R - 14, null, null, 20); st(16, c2, 1, R - 12); st(6, '#ffffff', 1, R - 12);
    if (k === 'boom') for (let i = 0; i < 9; i++) { const p = P(a0 + (i + .5) / 9 * (a1 - a0), R + rnd(0, 40)), r = rnd(34, 62), g = x.createRadialGradient(p[0], p[1], 0, p[0], p[1], r); g.addColorStop(0, '#ffffff'); g.addColorStop(.3, c2); g.addColorStop(.7, c); g.addColorStop(1, '#0000'); x.fillStyle = g; x.fillRect(p[0] - r, p[1] - r, r * 2, r * 2); }
  } else if (k === 'bolt') {
    jag(R, 26, 34, c, .28, 30); jag(R, 22, 13, c, .9, 12); jag(R, 20, 5, '#ffffff', 1);
    for (let i = 0; i < 8; i++) { let a = rnd(a0, a1), r = R; x.strokeStyle = i % 2 ? '#ffffff' : c2; x.lineWidth = rnd(2, 5); x.shadowColor = c; x.shadowBlur = 10; x.beginPath(); for (let j = 0; j < 5; j++) { const p = P(a, r); x.lineTo(p[0], p[1]); a += rnd(-.04, .04); r += rnd(14, 34) * (i % 3 ? 1 : -1); } x.stroke(); } x.shadowBlur = 0;
  } else if (k === 'wind') {
    st(70, c, .22, R, null, null, 30); for (let i = 0; i < 9; i++) st(rnd(3, 10), i % 3 ? '#ffffff' : c2, rnd(.5, .95), R - 48 + i * 13, a0 + rnd(0, .7), a1 - rnd(0, .7)); for (let i = 0; i < 5; i++) st(2, c, .9, R + 60 + i * 9, a0 + rnd(.2, 1), a1 - rnd(.2, 1));
  } else if (k === 'rock') {
    st(64, '#5d544a', .95, R - 6); st(36, c, 1, R); st(8, c2, .9, R + 14); x.strokeStyle = '#2a2420'; x.lineWidth = 3; for (let i = 0; i < 22; i++) { const a = rnd(a0, a1), p = P(a, R - 34), q = P(a + rnd(-.03, .03), R + 28); x.beginPath(); x.moveTo(p[0], p[1]); x.lineTo((p[0] + q[0]) / 2 + rnd(-8, 8), (p[1] + q[1]) / 2); x.lineTo(q[0], q[1]); x.stroke(); }
    for (let i = 0; i < 26; i++) { const p = P(rnd(a0, a1), R + rnd(36, 120)); x.globalAlpha = rnd(.7, 1); shape(x, 'rock', p[0], p[1], rnd(8, 22), rnd(0, 6), i % 2 ? c : '#6d6358', c2); } x.globalAlpha = 1;
  } else if (k === 'moon') {
    st(56, c, .5, R, null, null, 30); st(22, c, .95, R); st(8, c2, 1, R + 2); for (let i = 0; i < 20; i++) { const a = rnd(a0, a1), p = P(a, R + rnd(-40, 110)); x.globalAlpha = rnd(.7, 1); shape(x, 'crescent', p[0], p[1], rnd(12, 34), a + Math.PI / 2 + rnd(-.6, .6), c, c2); } x.globalAlpha = 1;
  } else if (k === 'mist') {
    for (let i = 0; i < 6; i++) st(rnd(60, 110), '#ffffff', rnd(.07, .14), R + rnd(-30, 50), a0 + rnd(0, .3), a1 - rnd(0, .3), 40); st(10, c, .6, R, null, null, 14); st(4, '#ffffff', .95, R);
  } else if (k === 'ribbon') {
    for (const [lw, col, ph] of [[14, c, 0], [6, c2, 0], [9, c, 2], [4, '#ffffff', 2]]) { x.strokeStyle = col; x.lineWidth = lw; x.lineCap = 'round'; x.shadowColor = c; x.shadowBlur = 12; x.beginPath(); for (let a = a0; a <= a1; a += .02) { const p = P(a, R + Math.sin(a * 16 + ph) * 22); x.lineTo(p[0], p[1]); } x.stroke(); } x.shadowBlur = 0;
    for (let i = 0; i < 10; i++) { const p = P(rnd(a0, a1), R + rnd(40, 110)); shape(x, 'heart', p[0], p[1], rnd(8, 16), rnd(-.5, .5), c, c2); }
  } else if (k === 'petal') {
    st(46, c, .4, R, null, null, 26); st(10, '#ffffff', .95, R); for (let i = 0; i < 44; i++) { const p = P(rnd(a0, a1), R + rnd(-40, 120)); x.globalAlpha = rnd(.65, 1); shape(x, 'petal', p[0], p[1], rnd(7, 15), rnd(0, 6), c, c2); } x.globalAlpha = 1;
  } else if (k === 'snake') {
    st(52, '#3a2f9a', 1, R); st(40, c, 1, R); st(10, c2, .8, R - 12); x.fillStyle = '#2a206a'; for (let a = a0 + .03; a < a1 - .08; a += .045) { const p = P(a, R + 6); x.save(); x.translate(p[0], p[1]); x.rotate(a); x.beginPath(); x.moveTo(0, -10); x.lineTo(9, 0); x.lineTo(0, 10); x.lineTo(-9, 0); x.fill(); x.restore(); }
    const h = P(a1 - .02, R); x.save(); x.translate(h[0], h[1]); x.rotate(a1 + Math.PI / 2); x.fillStyle = c; x.beginPath(); x.moveTo(-34, -30); x.quadraticCurveTo(10, -46, 52, 0); x.quadraticCurveTo(10, 46, -34, 30); x.closePath(); x.fill(); x.fillStyle = '#ffe14a'; x.beginPath(); x.arc(14, -14, 6, 0, TAU); x.arc(14, 14, 6, 0, TAU); x.fill(); x.strokeStyle = '#ff3a5a'; x.lineWidth = 4; x.beginPath(); x.moveTo(50, 0); x.lineTo(78, -8); x.moveTo(50, 0); x.lineTo(78, 8); x.stroke(); x.restore();
  } else if (k === 'fly') {
    st(36, c, .3, R, null, null, 22); st(5, c2, 1, R); for (let i = 0; i < 12; i++) { const p = P(rnd(a0, a1), R + rnd(-30, 110)); shape(x, 'butterfly', p[0], p[1], rnd(12, 24), rnd(-.8, .8), c, c2); }
  } else if (k === 'claw') {
    for (const dr of [-30, 6, 42]) { x.fillStyle = c; x.shadowColor = c2; x.shadowBlur = 14; x.beginPath(); for (let a = a0; a <= a1 + .001; a += .03) { const t = (a - a0) / (a1 - a0), w = 16 * Math.sin(t * Math.PI) + 1, p = P(a, R + dr + w + rnd(-5, 5)); x.lineTo(p[0], p[1]); } for (let a = a1; a >= a0; a -= .03) { const t = (a - a0) / (a1 - a0), w = 16 * Math.sin(t * Math.PI) + 1, p = P(a, R + dr - w + rnd(-5, 5)); x.lineTo(p[0], p[1]); } x.closePath(); x.fill(); } x.shadowBlur = 0; st(3, '#ffffff', .9, R + 6);
  } else { st(46, c, .25); st(26, c, .5); st(10, '#ffffff', 1); }
}
// 線の絵（128×512。縦に長い）
function beamDraw(x, W, H, S) {
  const k = S.kind, c = S.c, c2 = S.c2;
  if (k === 'bolt') { for (const [lw, col, al, bl] of [[40, c, .25, 20], [14, c, .9, 10], [5, '#ffffff', 1, 0]]) { x.globalAlpha = al; x.strokeStyle = col; x.lineWidth = lw; x.lineJoin = 'miter'; x.shadowColor = c; x.shadowBlur = bl; x.beginPath(); let px = W / 2; for (let y = 0; y <= H; y += 26) { x.lineTo(px, y); px = W / 2 + rnd(-30, 30); } x.stroke(); } }
  else if (k === 'snake') { for (const [lw, col] of [[44, '#3a2f9a'], [32, c], [8, c2]]) { x.strokeStyle = col; x.lineWidth = lw; x.beginPath(); for (let y = 0; y <= H; y += 8) x.lineTo(W / 2 + Math.sin(y * .05) * 24, y); x.stroke(); } }
  else {
    const g = x.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#0000'); g.addColorStop(.28, c + '88'); g.addColorStop(.44, c2); g.addColorStop(.5, '#ffffff'); g.addColorStop(.56, c2); g.addColorStop(.72, c + '88'); g.addColorStop(1, '#0000'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    if (k === 'wave') for (let y = 0; y < H; y += 20) for (const sx of [.26, .74]) { x.fillStyle = '#f6fcff'; x.beginPath(); x.arc(W * sx + rnd(-6, 6), y + rnd(-6, 6), rnd(7, 13), 0, TAU); x.fill(); }
    if (k === 'flame' || k === 'sun' || k === 'boom') for (let i = 0; i < 60; i++) { const y = rnd(0, H), sg = Math.random() < .5 ? -1 : 1, l = rnd(16, 50); x.fillStyle = Math.random() < .5 ? c : c2; x.globalAlpha = rnd(.4, .9); x.beginPath(); x.moveTo(W / 2 + sg * 12, y); x.lineTo(W / 2 + sg * (12 + l), y - rnd(10, 40)); x.lineTo(W / 2 + sg * 14, y - 30); x.fill(); }
    const sh = { moon: 'crescent', petal: 'petal', fly: 'butterfly', ribbon: 'heart', rock: 'rock', wind: 'streak' }[k]; if (sh) for (let i = 0; i < 16; i++) { x.globalAlpha = rnd(.7, 1); shape(x, sh, rnd(W * .2, W * .8), rnd(0, H), rnd(7, 15), rnd(0, 6), c, c2); }
  }
  x.globalAlpha = 1; x.shadowBlur = 0; x.globalCompositeOperation = 'destination-in'; const v = x.createLinearGradient(0, 0, 0, H); v.addColorStop(0, '#0000'); v.addColorStop(.12, '#fff'); v.addColorStop(.88, '#fff'); v.addColorStop(1, '#0000'); x.fillStyle = v; x.fillRect(0, 0, W, H);
}
export function makeFx(scene, W) {
  const TC = {};
  const tex = (key, type) => { const id = key + type; if (TC[id]) return TC[id]; const S = STY[key] || STY.none; let t;
    if (type === 'arc') t = ctex(512, 512, (x, w) => arcDraw(x, w, S)); else if (type === 'beam') { t = ctex(128, 512, (x, w, h) => beamDraw(x, w, h, S)); }
    else if (type === 'shape') t = ctex(64, 64, x => shape(x, S.shape, 32, 32, 26, 0, S.c, S.c2));
    else if (type === 'trail') t = ctex(256, 64, (x, w, h) => { const g = x.createLinearGradient(0, h, 0, 0); g.addColorStop(0, '#0000'); g.addColorStop(.35, S.c + 'aa'); g.addColorStop(.8, S.c2); g.addColorStop(1, '#ffffff'); x.fillStyle = g; x.fillRect(0, 0, w, h); x.globalCompositeOperation = 'destination-in'; const f = x.createLinearGradient(0, 0, w, 0); f.addColorStop(0, '#fff'); f.addColorStop(.25, '#fffc'); f.addColorStop(1, '#0000'); x.fillStyle = f; x.fillRect(0, 0, w, h); });
    return TC[id] = t; };
  const glowTex = ctex(128, 128, (x, w, h) => { const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, '#ffffffff'); g.addColorStop(.3, '#ffffff99'); g.addColorStop(.6, '#ffffff33'); g.addColorStop(1, '#ffffff00'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
  const ringTex = ctex(256, 256, (x, w, h) => { x.strokeStyle = '#fff'; for (let i = 0; i < 3; i++) { x.globalAlpha = [.18, .4, 1][i]; x.lineWidth = [40, 20, 5][i]; x.beginPath(); x.arc(w / 2, h / 2, w * .4, 0, 6.3); x.stroke(); } });
  const planeG = new THREE.PlaneGeometry(1, 1), POOL = [], LIVE = [];
  function mesh(t, add) { let m = POOL.pop(); if (!m) { m = new THREE.Mesh(planeG, new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false })); m.renderOrder = 5; scene.add(m); } m.material.map = t; m.material.blending = add === false ? THREE.NormalBlending : THREE.AdditiveBlending; m.material.needsUpdate = true; m.visible = true; m.rotation.set(0, 0, 0); m.scale.set(1, 1, 1); return m; }
  function push(m, col, life, o) { m.material.color.set(col || '#ffffff'); m.material.opacity = 1; const f = Object.assign({ m, life, max: life, a: 1 }, o || {}); LIVE.push(f); return f; }
  const F = {
    glowTex, tex,
    beam(key, x, z0, z1, w, life, o) { const m = mesh(tex(key, 'beam')); m.rotation.x = -Math.PI / 2; m.position.set(x, .24, (z0 + z1) / 2); m.scale.set(w, Math.abs(z1 - z0), 1); return push(m, null, life || .4, o); },
    vbeam(key, x, z, h, w, life, o) { const m = mesh(tex(key, 'beam')); m.position.set(x, h / 2, z); m.scale.set(w, h, 1); return push(m, null, life || .3, o); },
    arcFlat(key, x, z, w, life, o) { const m = mesh(tex(key, 'arc')); m.rotation.x = -Math.PI / 2; m.rotation.z = (o && o.rz) || 0; m.position.set(x, (o && o.y) || .55, z); m.scale.set(w, w * .72, 1); return push(m, null, life || .45, o); },
    arcVert(key, x, z, s, life, o) { const m = mesh(tex(key, 'arc')); m.position.set(x, (o && o.y) || 1.3, z); m.scale.set(s, s, 1); m.rotation.z = (o && o.rz) || 0; return push(m, null, life || .3, o); },
    ring(col, x, z, r, life, o) { const m = mesh(ringTex); m.rotation.x = -Math.PI / 2; m.position.set(x, .12, z); m.scale.set(r * 2, r * 2, 1); return push(m, col, life, o); },
    glow(col, x, y, z, s, life, o) { const m = mesh(glowTex); m.position.set(x, y, z); m.scale.set(s, s, 1); return push(m, col, life, o); },
    // 粒をまき散らす
    burst(key, x, y, z, n, o) { o = o || {}; n = Math.ceil(n * (F.q || 1)); const t = tex(key, 'shape'), S = STY[key] || STY.none, add = !/petal|butterfly|rock|heart|crescent/.test(S.shape); for (let i = 0; i < n && LIVE.length < 230; i++) { const m = mesh(t, add), s = rnd(.18, .5) * (o.s || 1); m.position.set(x + rnd(-.3, .3) * (o.w || 1), y + rnd(-.2, .4), z + rnd(-.4, .4)); m.scale.set(s, s, 1); m.rotation.z = rnd(0, 6); const sp = o.sp || 5; push(m, null, rnd(.4, .9) * (o.life || 1), { vx: rnd(-1, 1) * sp * (o.wide || 1), vy: rnd(.2, 1) * sp * .9, vz: rnd(-1, .4) * sp * (o.fwd || 1), g: o.g == null ? 9 : o.g, spin: rnd(-9, 9), world: o.world == null ? 1 : o.world }); } },
    step(dt, mv) {
      for (let i = LIVE.length - 1; i >= 0; i--) { const f = LIVE[i], m = f.m; f.life -= dt; if (f.life <= 0) { m.visible = false; POOL.push(m); LIVE.splice(i, 1); continue; }
        const p = f.life / f.max; m.material.opacity = (f.hold ? Math.min(1, p * 5, (1 - p) * 8 + .2) : p) * f.a; if (f.vx) m.position.x += f.vx * dt; if (f.vy) m.position.y += f.vy * dt; if (f.vz) m.position.z += f.vz * dt; if (f.g) { f.vy -= f.g * dt; if (m.position.y < .05) { m.position.y = .05; f.vy = 0; } }
        if (f.grow) { const k = 1 + f.grow * dt; m.scale.x *= k; m.scale.y *= k; } if (f.follow) m.position.x = W.x + (f.ox || 0); if (f.spin) m.rotation.z += f.spin * dt; if (f.world) m.position.z += mv; }
    },
    clear() { for (const f of LIVE) { f.m.visible = false; POOL.push(f.m); } LIVE.length = 0; }, count: () => LIVE.length,
  };
  // 刀の軌跡（刀の根元と切っ先をたどる帯）
  const TN = 22, tGeo = new THREE.BufferGeometry(), tPos = new Float32Array(TN * 6), tUv = new Float32Array(TN * 4), tIdx = [];
  for (let i = 0; i < TN; i++) { tUv[i * 4] = i / (TN - 1); tUv[i * 4 + 1] = 0; tUv[i * 4 + 2] = i / (TN - 1); tUv[i * 4 + 3] = 1; if (i < TN - 1) { const a = i * 2; tIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
  tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3)); tGeo.setAttribute('uv', new THREE.BufferAttribute(tUv, 2)); tGeo.setIndex(tIdx);
  const tMat = new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false, opacity: 0 }), tMesh = new THREE.Mesh(tGeo, tMat); tMesh.frustumCulled = false; tMesh.renderOrder = 6; scene.add(tMesh);
  const TS = []; let tOn = 0;
  F.trail = { key(k) { tMat.map = tex(k, 'trail'); tMat.needsUpdate = true; }, on(sec) { if (tOn <= 0) TS.length = 0; tOn = Math.max(tOn, sec); }, reset() { TS.length = 0; tOn = 0; tMat.opacity = 0; },
    step(dt, base, tip) { if (tOn > 0) tOn -= dt; TS.unshift([base.x, base.y, base.z, tip.x, tip.y, tip.z]); if (TS.length > TN) TS.pop(); tMat.opacity += ((tOn > 0 ? 1 : 0) - tMat.opacity) * Math.min(1, dt * 14);
      for (let i = 0; i < TN; i++) { const s = TS[Math.min(i, TS.length - 1)]; tPos.set(s, i * 6); } tGeo.attributes.position.needsUpdate = true; } };
  // うねる帯（龍・蛇・波がうねりながら前へのびる）
  const DN = 34, dGeo = new THREE.BufferGeometry(), dPos = new Float32Array(DN * 6), dUv = new Float32Array(DN * 4), dIdx = [];
  for (let i = 0; i < DN; i++) { dUv[i * 4] = 0; dUv[i * 4 + 1] = i / (DN - 1); dUv[i * 4 + 2] = 1; dUv[i * 4 + 3] = i / (DN - 1); if (i < DN - 1) { const a = i * 2; dIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
  dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3)); dGeo.setAttribute('uv', new THREE.BufferAttribute(dUv, 2)); dGeo.setIndex(dIdx);
  const dMat = new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false, opacity: 0 }), dMesh = new THREE.Mesh(dGeo, dMat); dMesh.frustumCulled = false; dMesh.renderOrder = 6; scene.add(dMesh);
  let dOn = 0, dT = 0, dLen = 16, dWide = 1;
  F.dragon = { start(key, sec, len, wide) { dMat.map = tex(key, 'beam'); dMat.needsUpdate = true; dOn = sec; dLen = len || 16; dWide = wide || 1; }, stop() { dOn = 0; }, reset() { dOn = 0; dMat.opacity = 0; },
    step(dt) { if (dOn > 0) dOn -= dt; dT += dt; dMat.opacity += ((dOn > 0 ? 1 : 0) - dMat.opacity) * Math.min(1, dt * 8); if (dMat.opacity < .01) { dMesh.visible = false; return; } dMesh.visible = true;
      for (let i = 0; i < DN; i++) { const u = i / (DN - 1), z = 1 - u * dLen, amp = Math.sin(u * Math.PI) * 1.9 * dWide, x = W.x + Math.sin(u * 7 - dT * 9) * amp, y = 1.1 + Math.sin(u * 9 - dT * 11) * .7 * Math.sin(u * Math.PI) + u * .6, w = (.5 + Math.sin(u * Math.PI) * .9) * dWide; dPos.set([x - w, y, z, x + w, y, z], i * 6); } dGeo.attributes.position.needsUpdate = true; } };
  return F;
}
