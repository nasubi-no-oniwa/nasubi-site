// 人間はどこだ：画面・3D・試合の流れ
import { THREE } from './lib.js?v=11271300';
import * as W from './world.js?v=11271300';
import { Lobby, Mesh, waiting } from './net.js?v=11271300';
import { TX, LANGS } from './text.js?v=11271300';
const gsap = window.gsap, PFX = window.PFX;
const $ = id => document.getElementById(id);
const DEV = /[?&]dev=1/.test(location.search);
const IS_PHONE = /iPhone|iPod|Android|Mobile/i.test(navigator.userAgent || '');
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function pickLang() { const q = (/[?&]lang=([a-z]+)/.exec(location.search) || [])[1]; if (TX[q]) return q; const s = ls.get('ningen_lang', null); if (TX[s]) return s; const n = (navigator.language || 'ja').toLowerCase(); return n.startsWith('ja') ? 'ja' : n.startsWith('zh') ? 'zh' : n.startsWith('ko') ? 'ko' : 'en'; }
let L = pickLang(), T = TX[L];
let SND = ls.get('ningen_snd', true);
function toast(h, ms = 2600) { const t = $('toast'); t.innerHTML = h; t.hidden = false; gsap.killTweensOf(t); gsap.fromTo(t, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .25 }); clearTimeout(toast.t); toast.t = setTimeout(() => gsap.to(t, { opacity: 0, duration: .3, onComplete: () => t.hidden = true }), ms); }
function banner(h, ms = 1800) { const b = $('banner'); b.innerHTML = h; b.hidden = false; gsap.killTweensOf(b); gsap.fromTo(b, { scale: .7, opacity: 0 }, { scale: 1, opacity: 1, duration: .35, ease: 'back.out(2)' }); clearTimeout(banner.t); banner.t = setTimeout(() => gsap.to(b, { opacity: 0, duration: .3, onComplete: () => b.hidden = true }), ms); }
function show(id) { for (const p of ['title', 'lobby', 'conn', 'result']) $(p).hidden = p !== id; }

// ---------- 音（その場で作る） ----------
let AC = null; function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } if (AC && AC.state === 'suspended') AC.resume(); return AC; }
function tone(f, d, type = 'sine', v = .2, f2) { if (!SND) return; const a = ac(); if (!a) return; const o = a.createOscillator(), g = a.createGain(), t = a.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d); o.connect(g).connect(a.destination); o.start(t); o.stop(t + d + .02); }
function noise(d, v = .25, f = 1200) { if (!SND) return; const a = ac(); if (!a) return; const n = a.sampleRate * d | 0, b = a.createBuffer(1, n, a.sampleRate), c = b.getChannelData(0); for (let i = 0; i < n; i++) c[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(); fl.type = 'bandpass'; fl.frequency.value = f; g.gain.value = v; s.buffer = b; s.connect(fl).connect(g).connect(a.destination); s.start(); }
const SFX = {
  tick() { tone(880, .08, 'square', .08); }, go() { tone(660, .12, 'square', .12); setTimeout(() => tone(990, .25, 'square', .12), 130); },
  siren(vol = 1) { for (let i = 0; i < 4; i++) setTimeout(() => tone(i % 2 ? 640 : 860, .22, 'sawtooth', .07 * vol), i * 230); },
  scream(vol = 1) { tone(900, .5, 'sawtooth', .09 * vol, 1500); noise(.45, .12 * vol, 2200); },
  tap() { tone(520, .05, 'sine', .06); }, bad() { tone(220, .35, 'square', .12, 140); }, good() { tone(660, .1, 'triangle', .15); setTimeout(() => tone(880, .2, 'triangle', .15), 110); }
};

// ---------- 3D ----------
const cv = $('gl');
const RD = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' });
RD.setPixelRatio(Math.min(window.devicePixelRatio || 1, IS_PHONE ? 1.75 : 2));
RD.outputColorSpace = THREE.SRGBColorSpace;
const SC = new THREE.Scene(); SC.background = new THREE.Color('#bfd9ee'); SC.fog = new THREE.Fog('#bfd9ee', 45, 95);
const CAM = new THREE.PerspectiveCamera(55, 1, .1, 200);
SC.add(new THREE.HemisphereLight('#ffffff', '#8a7a62', 1.7));
const sun = new THREE.DirectionalLight('#fff3dc', 1.6); sun.position.set(18, 30, 12); SC.add(sun);
function resize() { const w = innerWidth, h = innerHeight; RD.setSize(w, h, false); CAM.aspect = w / h; CAM.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
const MATS = new Map(); const mat = c => { if (!MATS.has(c)) MATS.set(c, new THREE.MeshLambertMaterial({ color: c })); return MATS.get(c); };
function tex(draw, w = 256, h = 256, rep = 1) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = 4; return t; }
const box = (w, h, d, c) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c));
function buildWorld() {
  // 石だたみ
  const g = tex((x, w, h) => { x.fillStyle = '#cfc6b6'; x.fillRect(0, 0, w, h); const n = 8, s = w / n; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const k = (i * 7 + j * 13) % 5; x.fillStyle = ['#d7cebf', '#c8bfae', '#d2c9b9', '#bfb6a5', '#dcd4c6'][k]; x.fillRect(i * s + 1, j * s + 1, s - 2, s - 2); } }, 256, 256, 16);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(W.HALF * 2, W.HALF * 2), new THREE.MeshLambertMaterial({ map: g })); ground.rotation.x = -Math.PI / 2; ground.name = 'ground'; SC.add(ground);
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), mat('#8fb56a')); grass.rotation.x = -Math.PI / 2; grass.position.y = -.02; SC.add(grass);
  // 広場のまわりの建物
  const R = W.rng(5);
  for (let side = 0; side < 4; side++) for (let i = -3; i <= 3; i++) {
    const h = 6 + R() * 10, w = 7 + R() * 2, b = box(w, h, 7, ['#e9dcc4', '#d9c3a5', '#c9d3d9', '#e4c7b5', '#d4d9c3'][R() * 5 | 0]); const a = side * Math.PI / 2, d = W.HALF + 6, u = i * 9;
    b.position.set(Math.sin(a) * d + Math.cos(a) * u, h / 2, Math.cos(a) * d - Math.sin(a) * u); b.rotation.y = a; SC.add(b);
    const roof = box(w + .4, .5, 7.4, '#8a5a44'); roof.position.copy(b.position); roof.position.y = h + .25; roof.rotation.y = a; SC.add(roof);
  }
  // 低い植えこみで広場を囲む
  for (let side = 0; side < 4; side++) { const a = side * Math.PI / 2, hd = box(W.HALF * 2, .7, .8, '#5f8a4a'); hd.position.set(Math.sin(a) * (W.HALF + .4), .35, Math.cos(a) * (W.HALF + .4)); hd.rotation.y = a; SC.add(hd); }
  // 噴水
  const f1 = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.8, .7, 40), mat('#b9b2a6')); f1.position.y = .35; SC.add(f1);
  const wat = new THREE.Mesh(new THREE.CylinderGeometry(4.1, 4.1, .05, 40), new THREE.MeshLambertMaterial({ color: '#6fb6dd', transparent: true, opacity: .85 })); wat.position.y = .68; SC.add(wat); SC.userData.water = wat;
  const f2 = new THREE.Mesh(new THREE.CylinderGeometry(.5, .8, 2.2, 16), mat('#c9c2b6')); f2.position.y = 1.4; SC.add(f2);
  const f3 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.2, .3, 24), mat('#c9c2b6')); f3.position.y = 2.5; SC.add(f3);
  const jet = new THREE.Mesh(new THREE.ConeGeometry(.35, 1.4, 12), new THREE.MeshLambertMaterial({ color: '#cfeaff', transparent: true, opacity: .7 })); jet.position.y = 3.3; SC.add(jet); SC.userData.jet = jet;
  for (const b of W.BENCH) { const gr = new THREE.Group(); const seat = box(2.2, .12, .6, '#9a6b42'); seat.position.y = .48; gr.add(seat); const back = box(2.2, .5, .1, '#8a5d38'); back.position.set(0, .8, -.3); gr.add(back); for (const s of [-.95, .95]) { const l = box(.1, .48, .5, '#3a3a40'); l.position.set(s, .24, 0); gr.add(l); } gr.position.set(b.x, 0, b.z); gr.rotation.y = b.ry; SC.add(gr); }
  const AW = ['#d9534f', '#4a7bd0', '#e8b33a', '#5aa469', '#8e6bc4', '#e07b39'];
  for (const s of W.STALL) { const gr = new THREE.Group(); const c = box(3.2, 1, 1.6, '#a8774e'); c.position.y = .5; gr.add(c); const top = box(3.4, .1, 1.8, '#e9e2d6'); top.position.y = 1.02; gr.add(top); for (const x of [-1.5, 1.5]) for (const z of [-.7, .7]) { const p = box(.08, 2.4, .08, '#6b4f3a'); p.position.set(x, 1.2, z); gr.add(p); } const aw = box(3.6, .18, 2.2, AW[s.c]); aw.position.y = 2.45; aw.rotation.x = -.18; gr.add(aw); for (let i = 0; i < 6; i++) { const it = box(.35, .3, .35, ['#f2c94c', '#e86a5a', '#7bc96f', '#ffffff', '#f29e4c'][i % 5]); it.position.set(-1.2 + i * .48, 1.2, .2); gr.add(it); } gr.position.set(s.x, 0, s.z); gr.rotation.y = s.ry; SC.add(gr); }
  for (const t of W.TREE) { const tr = new THREE.Mesh(new THREE.CylinderGeometry(.18, .25, 2, 8), mat('#6b4a2e')); tr.position.set(t.x, 1, t.z); SC.add(tr); const lf = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5 * t.s, 0), mat('#5c9a48')); lf.position.set(t.x, 2.7 * t.s + .4, t.z); SC.add(lf); }
  for (const l of W.LAMP) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.08, .12, 3.6, 8), mat('#2f3542')); p.position.set(l.x, 1.8, l.z); SC.add(p); const h = new THREE.Mesh(new THREE.SphereGeometry(.28, 12, 8), mat('#fff6d8')); h.position.set(l.x, 3.75, l.z); SC.add(h); }
  const sky = new THREE.Mesh(new THREE.SphereGeometry(150, 16, 8), new THREE.MeshBasicMaterial({ color: '#bfd9ee', side: THREE.BackSide, fog: false })); SC.add(sky);
}
buildWorld();
const GROUND = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

// 人（人間もAIも同じ作り）
const G_BODY = new THREE.CapsuleGeometry(.27, .5, 4, 10), G_HEAD = new THREE.SphereGeometry(.2, 14, 10), G_HAIR = new THREE.SphereGeometry(.215, 14, 8, 0, Math.PI * 2, 0, Math.PI * .55), G_LEG = new THREE.BoxGeometry(.15, .62, .17), G_ARM = new THREE.BoxGeometry(.11, .55, .12), G_HAT = new THREE.CylinderGeometry(.22, .24, .14, 14), G_BRIM = new THREE.CylinderGeometry(.34, .34, .03, 16), G_HIT = new THREE.CylinderGeometry(.42, .42, 1.9, 8);
const SHADOW = new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: .22, depthWrite: false }), G_SH = new THREE.CircleGeometry(.42, 16), HITM = new THREE.MeshBasicMaterial({ visible: false });
function person(lk) {
  const root = new THREE.Group(), g = new THREE.Group(); root.add(g); g.scale.setScalar(lk.h);
  const body = new THREE.Mesh(G_BODY, mat(lk.shirt)); body.position.y = 1.1; g.add(body);
  const head = new THREE.Mesh(G_HEAD, mat(lk.skin)); head.position.y = 1.62; g.add(head);
  const hair = new THREE.Mesh(G_HAIR, mat(lk.hair)); hair.position.y = 1.64; hair.rotation.x = -.25; g.add(hair);
  if (lk.hat) { const h = new THREE.Mesh(G_HAT, mat(lk.hat)); h.position.y = 1.8; g.add(h); const b = new THREE.Mesh(G_BRIM, mat(lk.hat)); b.position.y = 1.74; g.add(b); }
  const legs = [], arms = [];
  for (const s of [-1, 1]) { const p = new THREE.Group(); p.position.set(s * .12, .78, 0); const m = new THREE.Mesh(G_LEG, mat(lk.pants)); m.position.y = -.31; p.add(m); g.add(p); legs.push(p); }
  for (const s of [-1, 1]) { const p = new THREE.Group(); p.position.set(s * .36, 1.38, 0); const m = new THREE.Mesh(G_ARM, mat(lk.shirt)); m.position.y = -.25; p.add(m); const hd = new THREE.Mesh(new THREE.SphereGeometry(.065, 8, 6), mat(lk.skin)); hd.position.y = -.55; p.add(hd); g.add(p); arms.push(p); }
  if (lk.bag) { const b = box(.3, .34, .14, '#6b4a2e'); b.position.set(0, 1.1, -.27); g.add(b); }
  const sh = new THREE.Mesh(G_SH, SHADOW); sh.rotation.x = -Math.PI / 2; sh.position.y = .02; root.add(sh);
  const hit = new THREE.Mesh(G_HIT, HITM); hit.position.y = .95; root.add(hit);
  return { root, g, legs, arms, head, hit, ph: Math.random() * 6 };
}
// 赤いマーク（まちがえた人の頭の上）・自分の目印・選んだ人の輪
const redMark = () => { const m = new THREE.Mesh(new THREE.ConeGeometry(.22, .45, 12), new THREE.MeshBasicMaterial({ color: '#ff2a2a' })); m.rotation.x = Math.PI; m.position.y = 2.45; return m; };
const ME_MK = new THREE.Mesh(new THREE.ConeGeometry(.16, .3, 3), new THREE.MeshBasicMaterial({ color: '#ffffff', depthTest: false, transparent: true, opacity: .9 })); ME_MK.rotation.x = Math.PI; ME_MK.renderOrder = 5;
const SEL = new THREE.Mesh(new THREE.RingGeometry(.5, .64, 32), new THREE.MeshBasicMaterial({ color: '#ffd54a', transparent: true, opacity: .95, depthWrite: false })); SEL.rotation.x = -Math.PI / 2; SEL.position.y = .04; SEL.visible = false; SC.add(SEL);
const TAPR = new THREE.Mesh(new THREE.RingGeometry(.2, .32, 24), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false })); TAPR.rotation.x = -Math.PI / 2; TAPR.position.y = .05; SC.add(TAPR);
function nameTag(s, c = '#ffd54a') { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 64; const x = cv.getContext('2d'); x.font = '700 30px system-ui,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineWidth = 6; x.strokeStyle = '#000a'; x.strokeText(s, 128, 32); x.fillStyle = c; x.fillText(s, 128, 32); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true })); sp.scale.set(2.4, .6, 1); sp.position.y = 2.5; sp.renderOrder = 6; return sp; }

// ---------- 試合の状態（全員共通の見え方） ----------
let G = null;   // { seed, you, N, ppl:[], buf:[], off, ... }
function setupMatch(seed, you, N) {
  if (G) for (const p of G.ppl) SC.remove(p.root);
  G = { seed, you, N, ppl: [], buf: [], off: null, sel: -1, out: false, red: 0, score: 0, cd: 0, left: 0, T: 0, over: false, reveal: {}, tags: {}, gone: new Set() };
  for (let i = 0; i < N; i++) { const p = person(W.look(seed, i)); p.id = i; p.hit.userData.id = i; p.red = redMark(); p.red.visible = false; p.root.add(p.red); SC.add(p.root); G.ppl.push(p); p.x = 0; p.z = 0; p.ry = 0; p.st = 0; }
  G.ppl[you].root.add(ME_MK); ME_MK.position.y = 2.25;
}
// 届いた位置を少し遅らせて、なめらかにつなぐ
function pushSnap(Tm, a) { const now = performance.now() / 1000, o = now - Tm; G.off = G.off == null ? o : Math.min(G.off + .002, o); if (G.off > o) G.off = o; G.buf.push({ T: Tm, a }); if (G.buf.length > 40) G.buf.shift(); G.T = Tm; }
function sample() {
  const b = G.buf; if (!b.length) return; const t = performance.now() / 1000 - G.off - (HOST ? .0 : .12);
  let i = b.length - 1; while (i > 0 && b[i - 1].T > t) i--; const A = b[Math.max(0, i - 1)], B = b[i]; let k = B.T === A.T ? 1 : (t - A.T) / (B.T - A.T); k = Math.max(0, Math.min(1, k));
  for (let n = 0; n < G.N; n++) {
    const p = G.ppl[n], j = n * 5, a = A.a, c = B.a;
    p.x = (a[j] + (c[j] - a[j]) * k) / 20; p.z = (a[j + 1] + (c[j + 1] - a[j + 1]) * k) / 20;
    const r0 = a[j + 2] / 100, r1 = c[j + 2] / 100; let d = r1 - r0; d = Math.atan2(Math.sin(d), Math.cos(d)); p.ry = r0 + d * k;
    p.st = k < .5 ? a[j + 3] : c[j + 3]; p.redf = c[j + 4];
  }
}
function animPeople(dt) {
  const now = performance.now() / 1000;
  for (const p of G.ppl) {
    if (p.st === W.ST.gone) { if (!G.gone.has(p.id)) { G.gone.add(p.id); takeAway(p); } continue; }
    const mv = Math.hypot(p.x - (p.px ?? p.x), p.z - (p.pz ?? p.z)) / Math.max(dt, .001); p.px = p.x; p.pz = p.z;
    p.root.position.set(p.x, 0, p.z); p.root.rotation.y = p.ry;
    const walk = p.st === W.ST.walk && mv > .2; p.ph += dt * (walk ? mv * 4.2 : 0);
    const sw = walk ? Math.sin(p.ph) * .55 : 0;
    let gy = 0, lx = 0, ax = 0, az = 0;
    if (p.st === W.ST.sit) { gy = -.3; lx = -1.45; ax = -.35; }
    else if (p.st === W.ST.shock) { ax = -2.7; az = .35; gy = Math.sin(now * 40) * .02; }
    p.g.position.y = gy + (walk ? Math.abs(Math.cos(p.ph)) * .04 : 0);
    p.legs[0].rotation.x = lx + sw; p.legs[1].rotation.x = lx - sw;
    p.arms[0].rotation.x = ax - sw * .8; p.arms[1].rotation.x = ax + sw * .8; p.arms[0].rotation.z = -az; p.arms[1].rotation.z = az;
    p.head.rotation.y = p.st === W.ST.look ? Math.sin(now * 1.3 + p.id) * .5 : p.st === W.ST.idle ? Math.sin(now * .7 + p.id * 2) * .35 : 0;
    p.red.visible = !!p.redf; if (p.redf) { p.red.position.y = 2.45 + Math.sin(now * 8) * .08; p.red.rotation.y = now * 3; }
  }
}
function takeAway(p) { // 逮捕された人：パトランプの光とともに消える
  const fl = new THREE.Mesh(new THREE.CylinderGeometry(.6, .6, 4, 16, 1, true), new THREE.MeshBasicMaterial({ color: '#ff3b3b', transparent: true, opacity: .5, side: THREE.DoubleSide, depthWrite: false })); fl.position.set(p.x, 2, p.z); SC.add(fl);
  gsap.to(p.root.position, { y: 3, duration: .9, ease: 'power2.in', delay: .5 }); gsap.to(p.root.scale, { x: .1, y: .1, z: .1, duration: .9, delay: .5, onComplete: () => { p.root.visible = false; } });
  gsap.to(fl.material, { opacity: 0, duration: 1.6, delay: .4, onComplete: () => { SC.remove(fl); } });
  let n = 0; const iv = setInterval(() => { fl.material.color.set(n++ % 2 ? '#ff3b3b' : '#3b6bff'); if (n > 10) clearInterval(iv); }, 120);
}

// ---------- 視点（自分の後ろから。ドラッグで見回す） ----------
const VIEW = { yaw: 0, pitch: .42, dist: 7, cx: 0, cz: 0 };
function camUpdate(dt) {
  let tx = 0, tz = 0, ty = 1.3;
  if (G && !G.out) { const me = G.ppl[G.you]; tx = me.x; tz = me.z; VIEW.dist = 7; }
  else { tx = VIEW.cx; tz = VIEW.cz; ty = 0; VIEW.dist = 34; }
  const k = 1 - Math.exp(-dt * 10); VIEW.tx = VIEW.tx == null ? tx : VIEW.tx + (tx - VIEW.tx) * k; VIEW.tz = VIEW.tz == null ? tz : VIEW.tz + (tz - VIEW.tz) * k;
  const cp = Math.cos(VIEW.pitch), d = VIEW.dist;
  CAM.position.set(VIEW.tx - Math.sin(VIEW.yaw) * cp * d, ty + Math.sin(VIEW.pitch) * d, VIEW.tz - Math.cos(VIEW.yaw) * cp * d);
  CAM.lookAt(VIEW.tx, ty, VIEW.tz);
}
const PT = { id: null, x: 0, y: 0, drag: false, multi: 0 };
cv.addEventListener('pointerdown', e => { if (!G || G.over) return; PT.multi++; if (PT.id != null) return; PT.id = e.pointerId; PT.x = PT.sx = e.clientX; PT.y = PT.sy = e.clientY; PT.drag = false; cv.setPointerCapture(e.pointerId); });
cv.addEventListener('pointermove', e => { if (e.pointerId !== PT.id) return; const dx = e.clientX - PT.x, dy = e.clientY - PT.y; PT.x = e.clientX; PT.y = e.clientY; if (Math.hypot(e.clientX - PT.sx, e.clientY - PT.sy) > 9) PT.drag = true; if (PT.drag) { VIEW.yaw -= dx * .0065; VIEW.pitch = Math.max(.12, Math.min(1.25, VIEW.pitch + dy * .005)); } });
const endPt = e => { PT.multi = Math.max(0, PT.multi - 1); if (e.pointerId !== PT.id) return; PT.id = null; if (!PT.drag) tapAt(e.clientX, e.clientY); };
cv.addEventListener('pointerup', endPt); cv.addEventListener('pointercancel', e => { PT.multi = 0; if (e.pointerId === PT.id) PT.id = null; });
const RC = new THREE.Raycaster(), V2 = new THREE.Vector2(), V3 = new THREE.Vector3();
function tapAt(x, y) {
  if (!G || G.over || G.out || !G.live) return;
  V2.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); RC.setFromCamera(V2, CAM);
  const hits = RC.intersectObjects(G.ppl.filter(p => p.root.visible && p.id !== G.you && p.st !== W.ST.gone).map(p => p.hit), false);
  if (hits.length) { G.sel = hits[0].object.userData.id; SFX.tap(); updHud(); return; }
  if (RC.ray.intersectPlane(GROUND, V3)) {
    const [px, pz] = W.clampPt(V3.x, V3.z); G.sel = -1; send({ k: 'go', x: +px.toFixed(2), z: +pz.toFixed(2) });
    TAPR.position.set(px, .05, pz); gsap.killTweensOf(TAPR.material); gsap.killTweensOf(TAPR.scale); TAPR.material.opacity = .9; TAPR.scale.setScalar(.6); gsap.to(TAPR.scale, { x: 1.6, y: 1.6, z: 1.6, duration: .5 }); gsap.to(TAPR.material, { opacity: 0, duration: .5 });
    updHud();
  }
}
$('bSit').onclick = () => send({ k: 'act', a: 'sit' }); $('bLook').onclick = () => send({ k: 'act', a: 'look' }); $('bStop').onclick = () => send({ k: 'act', a: 'stop' });
$('bArr').onclick = () => {
  if (!G || G.sel < 0 || G.cd > 0 || G.out) return; const me = G.ppl[G.you], t = G.ppl[G.sel];
  if (Math.hypot(me.x - t.x, me.z - t.z) > W.REACH) { toast(T.far, 1200); return; }
  send({ k: 'arr', id: G.sel }); G.cd = W.CD; G.cdAt = performance.now();
};
function dist2sel() { if (!G || G.sel < 0) return 1e9; const me = G.ppl[G.you], t = G.ppl[G.sel]; return Math.hypot(me.x - t.x, me.z - t.z); }
function near(list, kx, kz, r) { const me = G.ppl[G.you]; return list.some(o => Math.hypot(o[kx] - me.x, o[kz] - me.z) < r); }
let hudT = 0;
function updHud() {
  if (!G) return; const left = Math.max(0, W.DUR - G.T), m = Math.floor(left / 60), s = Math.floor(left % 60);
  $('hTime').textContent = m + ':' + String(s).padStart(2, '0'); $('hTime').classList.toggle('low', left < 30);
  $('hLeft').innerHTML = T.left(G.left); $('hMine').innerHTML = T.mine(G.score);
  if (G.cd > 0) G.cd = Math.max(0, W.CD - (performance.now() - G.cdAt) / 1000);
  const d = dist2sel(), ok = G.sel >= 0 && d <= W.REACH && G.cd <= 0, ab = $('bArr');
  ab.classList.toggle('ok', ok); ab.style.setProperty('--p', G.cd > 0 ? (1 - G.cd / W.CD) * 100 : 100);
  $('bArrS').textContent = G.cd > 0 ? Math.ceil(G.cd) + '' : G.sel < 0 ? T.sel : d > W.REACH ? T.far : '';
  if (G.sel >= 0) { const t = G.ppl[G.sel]; if (!t.root.visible || t.st === W.ST.gone) G.sel = -1; }
  SEL.visible = G.sel >= 0 && !G.out; if (SEL.visible) { const t = G.ppl[G.sel]; SEL.position.set(t.x, .04, t.z); SEL.material.color.set(d <= W.REACH ? '#ff5a3a' : '#ffd54a'); }
  if (!G.out) { $('bSit').disabled = !near(W.BENCH, 'x', 'z', 4.2); $('bLook').disabled = !near(W.STALL, 'fx', 'fz', 4.7); }
  $('redTint').style.opacity = G.ppl[G.you] && G.ppl[G.you].redf && !G.out ? 1 : 0;
}

// ---------- 通信まわり ----------
let LOBBY = null, MESH = null, HOST = false, HOSTID = null, ME = null, MEM = [], NAMES = {}, SIM = null, BK = null, DEAD = new Set(), evN = 0, acc = 0, stepN = 0, lastHostMsg = 0, ROOM = null;
function send(m) { if (!G || G.out || G.over) return; if (HOST) { const r = SIM.input(ME, m); if (r) ack(ME, r); } else MESH && MESH.send(HOSTID, { t: 'in', ...m }); }
function ack(p, ev) { const m = { t: 'ack', ok: ev.k }; if (p === ME) onMsg(ME, m); else MESH.send(p, m); }
function vice() { return MEM.find(p => p !== ME && !DEAD.has(p) && MESH.P[p] && MESH.P[p].open) || null; }
function onMsg(p, m) {
  if (!m || !m.t) return;
  if (HOST && m.t === 'in') { if (!G || G.over || !SIM) return; const r = SIM.input(p, m); if (r) ack(p, r); return; }
  if (p !== ME && p !== HOSTID && m.t !== 'host') return; lastHostMsg = performance.now();
  if (m.t === 'start') { startLocal(m); }
  else if (m.t === 's') { if (G) { pushSnap(m.T, m.a); G.left = m.n; } }
  else if (m.t === 'ev') onEv(m.e);
  else if (m.t === 'ack') { if (m.ok === 'arr') { G.score++; SFX.good(); banner(T.youArr); } else if (m.ok === 'miss') { SFX.bad(); banner(T.youMiss, 2400); } }
  else if (m.t === 'bk') BK = m.d;
  else if (m.t === 'rv') { G.reveal = m.r || {}; updTags(); }
  else if (m.t === 'end') endMatch(m.r);
  else if (m.t === 'host') { HOSTID = m.h; }
}
function onEv(e) {
  if (!G) return;
  if (e.k === 'arr') {
    const me = G.ppl[G.you], d = Math.hypot(me.x - e.x, me.z - e.z), vol = Math.max(.25, 1 - d / 40); SFX.siren(vol);
    if (e.v === ME) { G.out = true; G.sel = -1; ME_MK.visible = false; banner(T.caught(esc(e.by || '?')), 3200); $('hud').classList.add('out'); $('spect').hidden = false; VIEW.cx = e.x; VIEW.cz = e.z; VIEW.pitch = .9; }
    else toast(T.evArr(e.left));
    G.left = e.left;
  } else if (e.k === 'miss') { const me = G.ppl[G.you], d = Math.hypot(me.x - e.x, me.z - e.z); if (d < 26) SFX.scream(Math.max(.2, 1 - d / 26)); toast(T.evMiss, 1800); }
  else if (e.k === 'left') toast(T.evLeft);
}
function updTags() { for (const id in G.tags) { G.tags[id].parent && G.tags[id].parent.remove(G.tags[id]); } G.tags = {}; if (!G.out) return; for (const [id, n] of Object.entries(G.reveal)) { const p = G.ppl[id]; if (!p) continue; const t = nameTag(n); p.root.add(t); G.tags[id] = t; } }

// 待ち合わせ
function findMatch(code) {
  const nm = $('nm').value.trim().slice(0, 12); if (!nm) { $('nmNote').textContent = T.nmNeed; $('nm').focus(); return; } ls.set('ningen_name', nm); ac();
  if (LOBBY) LOBBY.leave();
  show('lobby'); $('lbList').innerHTML = ''; $('lbNote').innerHTML = ''; $('lbCnt').innerHTML = ''; $('rdBtn').textContent = T.ready; $('rdBtn').classList.remove('on');
  $('lbT').textContent = code ? T.lbCode(code) : T.lbRandom; $('invBtn').hidden = !code; LBC = code || ''; lastAt = 0;
  LOBBY = new Lobby(nm, code, {
    status: lbStatus, begin: beginMatch, moved: () => toast(T.moved), err: () => { $('lbNote').textContent = T.err; }
  });
  LOBBY.start().catch(() => { $('lbNote').textContent = T.err; });
}
let LBC = '', lastAt = 0, lastKey = '', cntIv = 0;
function lbStatus(s) {
  if (s.full) { $('lbNote').textContent = T.full; return; } if (s.busy) { $('lbNote').textContent = T.busy; return; }
  $('lbList').innerHTML = s.alive.map(a => `<li class="${a.rd ? 'rd' : ''}">${esc(a.n)}${a.id === s.me ? ` <small>（${T.you}）</small>` : ''}<i>${a.rd ? '✔' : ''}</i></li>`).join('');
  const key = s.alive.map(a => a.id).join(',');
  if (lastAt && s.at && s.at !== lastAt && key !== lastKey) toast(T.reset);
  lastKey = key;
  if (s.at) { lastAt = s.at; clearInterval(cntIv); const upd = () => { const r = Math.max(0, Math.ceil((s.at - (Date.now() + (LOBBY ? LOBBY.now() - Date.now() : 0))) / 1000)); $('lbCnt').innerHTML = T.cnt(r); if (r <= 3 && r > 0 && r !== upd.l) { SFX.tick(); upd.l = r; } }; upd(); cntIv = setInterval(upd, 200); $('lbNote').innerHTML = ''; }
  else { clearInterval(cntIv); $('lbCnt').innerHTML = ''; lastAt = 0; const n = s.alive.length; $('lbNote').innerHTML = n < 2 ? T.need1 : T.needN(Math.floor(n / 2) + 1 - s.ready); }
}
$('rdBtn').onclick = () => { if (!LOBBY) return; const on = !LOBBY.rd; LOBBY.setReady(on); $('rdBtn').textContent = on ? T.unready : T.ready; $('rdBtn').classList.toggle('on', on); SFX.tap(); };
$('lbLeave').onclick = () => { if (LOBBY) LOBBY.leave(); LOBBY = null; clearInterval(cntIv); toTitle(); };
$('invBtn').onclick = async () => { const u = location.origin + location.pathname + '?k=' + encodeURIComponent(LBC); try { if (IS_PHONE && navigator.share) { await navigator.share({ url: u, text: T.ttl }); return; } } catch (e) { if (e && e.name === 'AbortError') return; } try { await navigator.clipboard.writeText(u); toast(T.invCopied); } catch (e) { prompt('', u); } };
addEventListener('pagehide', () => { if (LOBBY) LOBBY.leave(); });

async function beginMatch(b) {
  clearInterval(cntIv); LOBBY = null; ROOM = b.room; ME = b.me; MEM = b.mem; NAMES = b.names; HOSTID = b.host; HOST = b.host === ME; DEAD = new Set(); BK = null; SIM = null; evN = 0;
  show('conn'); $('connNote').textContent = T.conn;
  MESH = new Mesh(b.room, ME, MEM, { msg: onMsg, lost: onLost });
  const t0 = performance.now(), got = await MESH.connect(HOST ? 16000 : 20000);
  if (HOST) {
    const hum = [ME, ...got].sort((a, c) => MEM.indexOf(a) - MEM.indexOf(c));
    for (const p of MEM) if (!hum.includes(p)) DEAD.add(p);
    if (hum.length < 2) return failConn();
    MEM = hum; const seed = (Math.random() * 4294967295) >>> 0;
    SIM = new W.Sim(seed, hum.map(p => ({ pid: p, n: NAMES[p] })));
    for (const p of hum) { const m = { t: 'start', seed, you: SIM.H[p].eid, N: SIM.E.length, mem: hum, names: NAMES, h: ME }; if (p === ME) startLocal(m); else MESH.send(p, m); }
    setTimeout(() => import('./net.js?v=11271300').then(n => n.db.del('r/' + ROOM).catch(() => { })), 12000);
  } else {
    // 代表からの開始を待つ（つながらなければ失敗）
    while (!(G && G.live)) { const hp = MESH && MESH.P[HOSTID]; if (!MESH || performance.now() - t0 > 26000 || (hp && hp.dead)) return failConn(); await new Promise(r => setTimeout(r, 200)); }
  }
}
function failConn() { if (MESH) MESH.close(); MESH = null; G = null; show('title'); toast(T.connFail, 3500); pollWait(); }
function startLocal(m) {
  MEM = m.mem || MEM; NAMES = m.names || NAMES; HOSTID = m.h || HOSTID;
  setupMatch(m.seed, m.you, m.N); G.live = true; G.left = MEM.length;
  $('conn').hidden = true; $('hud').hidden = false; $('hud').classList.remove('out'); $('spect').hidden = true; ME_MK.visible = true;
  if (HOST) { pushSnap(SIM.T, SIM.snap()); } else lastHostMsg = performance.now();
  // 最初は自分の向いている向きの後ろから
  setTimeout(() => { if (G && G.ppl[G.you]) { VIEW.yaw = G.ppl[G.you].ry; VIEW.tx = null; } }, 300);
  SFX.go(); banner(T.start, 2000); updHud();
}
function onLost(p) {
  DEAD.add(p);
  if (!G || G.over) return;
  if (HOST) { if (SIM && SIM.H[p] && !SIM.H[p].left) { SIM.leave(p); SIM.push({ k: 'left' }); } return; }
  if (p !== HOSTID) return;
  // 代表が抜けた：残っている人のうち、いちばん先の人が引き継ぐ
  const nx = MEM.find(q => !DEAD.has(q) && (q === ME || (MESH.P[q] && MESH.P[q].open)));
  if (nx === ME) {
    if (!BK) return abortMatch();
    SIM = W.Sim.load(BK); const old = HOSTID; HOST = true; HOSTID = ME; SIM.leave(old); SIM.push({ k: 'left' }); evN = SIM.ev.length; acc = 0;
    MESH.all({ t: 'host', h: ME }); toast(T.hostMove, 3000); pushSnap(SIM.T, SIM.snap());
  } else { HOSTID = nx; lastHostMsg = performance.now(); }
}
function abortMatch() { if (!G) return; G.over = true; if (MESH) MESH.close(); MESH = null; $('hud').hidden = true; toast(T.hostLost, 4000); setTimeout(toTitle, 1500); }

// 代表のしごと：計算して、みんなに送る
function hostTick() {
  stepN++;
  const a = SIM.snap(), n = SIM.aliveN(); pushSnap(SIM.T, a); G.left = n;
  if (stepN % 3 === 0) MESH.all({ t: 's', T: +SIM.T.toFixed(3), a, n }, true);
  while (evN < SIM.ev.length) {
    const e = SIM.ev[evN++]; if (e.k === 'end') continue;
    const o = { k: e.k, x: +e.x?.toFixed?.(1) || 0, z: +e.z?.toFixed?.(1) || 0, left: e.left }; if (e.k === 'arr') { o.v = e.v; o.by = SIM.H[e.v].by; }
    MESH.all({ t: 'ev', e: o }); onEv(o);
    if (e.k === 'arr') reveal();
  }
  if (stepN % 30 === 0) { const v = vice(); if (v) MESH.send(v, { t: 'bk', d: SIM.dump() }); }
  if (SIM.over && !G.over) { const r = SIM.result(); r.names = NAMES; MESH.all({ t: 'end', r }); endMatch(r); }
}
function reveal() { // 逮捕された人には、まだ残っている人間の名前を見せる（観戦用）
  const r = {}; for (const p in SIM.H) { const h = SIM.H[p]; if (!h.out && !h.left) r[h.eid] = h.n; }
  for (const p in SIM.H) { const h = SIM.H[p]; if (!h.out) continue; if (p === ME) onMsg(ME, { t: 'rv', r }); else MESH.send(p, { t: 'rv', r }); }
}

// ---------- 結果 ----------
let LAST = null;
function endMatch(r) {
  if (!G || G.over) return; G.over = true; G.live = false; G.res = r;
  setTimeout(() => { if (MESH) MESH.close(); MESH = null; }, 1500);
  $('hud').hidden = true; SEL.visible = false; SFX.siren(.6);
  const rows = r.rows, me = rows.findIndex(x => x.p === ME), mine = rows[me] || { s: 0 };
  banner(r.T >= W.DUR - .5 ? T.timeup : T.lastOne, 1600);
  LAST = { rank: me + 1, n: rows.length, a: mine.s, r };
  setTimeout(() => {
    show('result'); $('result').scrollTop = 0;
    $('rRank').innerHTML = T.rRank(me + 1, rows.length);
    $('rList').innerHTML = rows.map((x, i) => `<tr class="${x.p === ME ? 'me' : ''}"><td class="n">${i + 1}</td><td><i style="background:${COL[i % COL.length]}"></i>${esc(x.n)}<small>${x.l ? T.rLeft : x.o ? T.rOut(esc(x.by)) : T.rAlive}</small></td><td class="d">${T.rArr} ${x.s}<small>${T.rMiss} ${x.m}</small></td></tr>`).join('');
    replay(r); LAST.card = makeCard();
    gsap.fromTo('#result .card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'power3.out' });
    try { if (PFX && me === 0) fxBurst(); } catch (e) { }
  }, 1700);
}
const COL = ['#ff4d4d', '#3aa0ff', '#ffd54a', '#4cd964', '#c37dff', '#ff9f43', '#2ee6d6', '#ff6fb5'];
let rpRaf = 0;
function drawMap(x, w, r, k) { // 上から見た広場と道すじ（k = 0〜1 どこまで描くか）
  const s = w / (W.HALF * 2), P = (v) => (v / 4 + W.HALF) * s;
  x.fillStyle = '#d8d0c2'; x.fillRect(0, 0, w, w);
  x.fillStyle = '#9fc6e0'; x.beginPath(); x.arc(w / 2, w / 2, 4.6 * s, 0, 7); x.fill();
  x.fillStyle = '#b08a64'; for (const b of W.BENCH) { x.beginPath(); x.arc((b.x + W.HALF) * s, (b.z + W.HALF) * s, 1 * s, 0, 7); x.fill(); }
  x.fillStyle = '#c9a074'; for (const t of W.STALL) { x.beginPath(); x.arc((t.x + W.HALF) * s, (t.z + W.HALF) * s, 2 * s, 0, 7); x.fill(); }
  x.fillStyle = '#7aa864'; for (const t of W.TREE) { x.beginPath(); x.arc((t.x + W.HALF) * s, (t.z + W.HALF) * s, .9 * s, 0, 7); x.fill(); }
  const hum = {}; r.rows.forEach((h, i) => hum[h.eid] = i);
  const ids = Object.keys(r.trail).sort((a, b) => (a in hum) - (b in hum));
  for (const id of ids) {
    const t = r.trail[id], n = Math.floor(t.length / 2 * k), isH = id in hum; if (n < 1) continue;
    x.strokeStyle = isH ? COL[hum[id] % COL.length] : '#0000002e'; x.lineWidth = isH ? Math.max(2, w / 160) : Math.max(1, w / 360); x.lineJoin = x.lineCap = 'round';
    x.beginPath(); let on = false, lx = 0, ly = 0; for (let i = 0; i < n; i++) { const a = t[i * 2], b = t[i * 2 + 1]; if (a === 9999) break; const px = P(a), py = P(b); if (!on) { x.moveTo(px, py); on = true; } else x.lineTo(px, py); lx = px; ly = py; } x.stroke();
    if (on) { x.fillStyle = isH ? COL[hum[id] % COL.length] : '#0000004a'; x.beginPath(); x.arc(lx, ly, isH ? w / 70 : w / 160, 0, 7); x.fill(); if (isH) { x.font = `700 ${Math.round(w / 26)}px system-ui,sans-serif`; x.textAlign = 'center'; x.lineWidth = 4; x.strokeStyle = '#000a'; const nm = r.rows[hum[id]].n; x.strokeText(nm, lx, ly - w / 40); x.fillStyle = '#fff'; x.fillText(nm, lx, ly - w / 40); } }
  }
}
function replay(r) {
  const c = $('rMap'), w = c.width = 600; c.height = 600; const x = c.getContext('2d'); cancelAnimationFrame(rpRaf); const t0 = performance.now();
  const f = () => { const k = Math.min(1, ((performance.now() - t0) / 1000 % 11) / 9); drawMap(x, w, r, k); if (!$('result').hidden) rpRaf = requestAnimationFrame(f); }; f();
}
function makeCard() {
  const W_ = 1080, H = 1350, c = document.createElement('canvas'); c.width = W_; c.height = H; const x = c.getContext('2d'), F = s => `800 ${s}px "Hiragino Sans","Noto Sans JP",system-ui,sans-serif`;
  x.fillStyle = '#141820'; x.fillRect(0, 0, W_, H); x.textAlign = 'center';
  x.fillStyle = '#ffd54a'; x.font = F(76); x.fillText(T.ttl, W_ / 2, 120);
  x.fillStyle = '#fff'; x.font = F(54); x.fillText(T.cardA(LAST.a) + '  /  ' + T.rRank(LAST.rank, LAST.n).replace(/<[^>]+>/g, ''), W_ / 2, 205);
  const m = document.createElement('canvas'); m.width = m.height = 900; drawMap(m.getContext('2d'), 900, LAST.r, 1); x.drawImage(m, 90, 250, 900, 900);
  x.fillStyle = '#9aa3b2'; x.font = F(30); x.fillText(T.replay, W_ / 2, 1205); x.fillStyle = '#ffd54a'; x.font = '600 32px ui-monospace,Menlo,monospace'; x.fillText('nasubi-no-oniwa.com/ningen', W_ / 2, 1290);
  return new Promise(r => c.toBlob(b => r(b), 'image/png'));
}
let fxRaf = 0; function fxBurst() { const c = $('fxc'), x = c.getContext('2d'), fr = PFX.createFrame(160, 160), im = new ImageData(160, 160); const fs = [PFX.createFx(PFX.fx.confetti, { x: 80, y: 30, seed: 7 })]; let last = performance.now(), life = 3; cancelAnimationFrame(fxRaf); const f = now => { const dt = Math.min(.05, (now - last) / 1000); last = now; life -= dt; PFX.clearFrame(fr); for (const e of fs) { e.update(dt); e.draw(fr, 'back'); e.draw(fr, 'front'); } PFX.composite(fr, im.data, null); x.putImageData(im, 0, 0); if (life > 0) fxRaf = requestAnimationFrame(f); else x.clearRect(0, 0, 160, 160); }; fxRaf = requestAnimationFrame(f); }
// Xに投稿（自分の紹介ツイートを引用。引用するツイートは一覧ページ quote/ で切りかえ）
let QUOTE = {};
fetch('https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/xquote/g/ningen.json').then(r => r.json()).then(d => { if (d && typeof d === 'object') QUOTE = d; }).catch(() => { });
function quoteURL() { const u = (L === 'ja' ? QUOTE.ja : QUOTE.en) || ''; return /^https:\/\/x\.com\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}$/.test(u) ? u : ''; }
const cardFile = b => new File([b], 'ningen.png', { type: 'image/png' });
function saveBlob(b) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'ningen.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); }
$('xBtn').onclick = async () => {
  if (!LAST) return; const q = quoteURL(), POST = T.post(LAST.a, LAST.rank, LAST.n); let b = null; try { b = await LAST.card; } catch (e) { }
  if (b && IS_PHONE && navigator.canShare) { const f = cardFile(b); try { if (navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: POST + (q ? '\n' + q : '') }); try { if (typeof gtag === 'function') gtag('event', 'x_share', { game: 'ningen', via: 'sheet' }); } catch (e) { } return; } } catch (e) { if (e && e.name === 'AbortError') return; } }
  let how = 0; if (b) { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]); how = 1; } catch (e) { if (!IS_PHONE) { try { saveBlob(b); how = 2; } catch (_) { } } } }
  if (how) toast(how === 1 ? T.xCopied : T.xSaved);
  const u = 'https://x.com/intent/post?text=' + encodeURIComponent(POST) + (q ? '&url=' + encodeURIComponent(q) : ''); const w = window.open(u, '_blank'); if (!w) location.href = u;
};
$('imgBtn').onclick = async () => { if (!LAST) return; let b = null; try { b = await LAST.card; } catch (e) { } if (!b) return; const f = cardFile(b); try { if (IS_PHONE && navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return; } } catch (e) { if (e && e.name === 'AbortError') return; } saveBlob(b); };
$('again').onclick = () => { cleanup(); findMatch(LBC); };
$('toTitle').onclick = () => { cleanup(); toTitle(); };
function cleanup() { cancelAnimationFrame(rpRaf); if (MESH) MESH.close(); MESH = null; HOST = false; SIM = null; if (G) { for (const p of G.ppl) SC.remove(p.root); } G = null; }

// ---------- タイトル ----------
function applyLang() {
  T = TX[L]; document.documentElement.lang = L === 'zh' ? 'zh-Hant' : L; document.title = T.ttl;
  $('tH1').innerHTML = `<small>${T.sub}</small>${esc(T.ttl)}`; $('tLead').innerHTML = T.lead; $('nm').placeholder = T.nmPh; $('findBtn').textContent = T.find; $('codeOpen').textContent = T.codeOpen; $('code').placeholder = T.codePh; $('codeGo').textContent = T.codeGo;
  $('how').innerHTML = T.how; $('sndBtn').textContent = T.snd(SND); $('tFan').textContent = T.fan;
  $('langs').innerHTML = LANGS.map(([k, n]) => `<button data-l="${k}" class="${k === L ? 'on' : ''}">${n}</button>`).join(''); document.querySelectorAll('#langs button').forEach(b => b.onclick = () => { L = b.dataset.l; ls.set('ningen_lang', L); applyLang(); });
  $('lbLeave').textContent = T.leave; $('invBtn').textContent = T.invite; $('rdBtn').textContent = LOBBY && LOBBY.rd ? T.unready : T.ready; $('lbHead').textContent = T.lbT;
  $('bSit').textContent = T.sit; $('bLook').textContent = T.look; $('bStop').textContent = T.stop; $('bArrT').textContent = T.arrest; $('spect').textContent = T.spect;
  $('rT').textContent = T.rT; $('replayT').textContent = T.replay; $('again').textContent = T.again; $('toTitle').textContent = T.toTitle; $('xBtn').textContent = T.xBtn; $('imgBtn').textContent = T.imgBtn; $('rFan').textContent = T.fan;
  showWait(WAITN);
}
let WAITN = null, waitIv = 0;
function showWait(n) { WAITN = n; $('waitN').innerHTML = n == null ? '' : n < 0 ? T.waitX : T.waitN(n); }
function pollWait() { clearInterval(waitIv); const f = async () => { if ($('title').hidden) return; showWait(await waiting()); }; f(); waitIv = setInterval(f, 6000); }
function toTitle() { cleanup(); show('title'); $('hud').hidden = true; VIEW.cx = 0; VIEW.cz = 0; pollWait(); gsap.fromTo('#title .card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'power3.out' }); }
$('findBtn').onclick = () => findMatch('');
$('codeOpen').onclick = () => { $('codeBox').hidden = !$('codeBox').hidden; if (!$('codeBox').hidden) $('code').focus(); };
$('codeGo').onclick = () => { const c = $('code').value.trim(); if (!c) { $('nmNote').textContent = T.codeNeed; return; } findMatch(c.slice(0, 16)); };
$('nm').addEventListener('input', () => $('nmNote').textContent = '');
$('sndBtn').onclick = () => { SND = !SND; ls.set('ningen_snd', SND); $('sndBtn').textContent = T.snd(SND); };

// ---------- 毎フレーム ----------
let lastF = performance.now();
function frame(now) {
  const dt = Math.min(.1, (now - lastF) / 1000); lastF = now;
  if (G && G.live && !G.over) {
    if (HOST && SIM) { acc += dt; let k = 0; while (acc >= 1 / 30 && k < 6) { SIM.step(1 / 30); acc -= 1 / 30; k++; hostTick(); } }
    else if (MESH && performance.now() - lastHostMsg > 3500) { const h = HOSTID; lastHostMsg = performance.now(); if (h && !DEAD.has(h) && h !== ME) MESH.drop(h); else abortMatch(); } // 代表から3.5秒なにも来なければ、抜けたとみなす
  }
  if (G) { sample(); animPeople(dt); hudT += dt; if (hudT > .1) { hudT = 0; if (!G.over) updHud(); } }
  else { VIEW.yaw += dt * .05; }
  const w = SC.userData.jet; if (w) w.scale.y = 1 + Math.sin(now / 180) * .12;
  camUpdate(dt); RD.render(SC, CAM);
  requestAnimationFrame(frame);
}
applyLang(); $('nm').value = ls.get('ningen_name', '') || ''; $('load').hidden = true;
{ const k = (/[?&]k=([^&]+)/.exec(location.search) || [])[1]; if (k) { $('code').value = decodeURIComponent(k).slice(0, 16); $('codeBox').hidden = false; } }
toTitle();
requestAnimationFrame(frame);
if (DEV) window.__N = () => ({ G, SIM, HOST, HOSTID, ME, MEM, MESH, LOBBY, BK, DEAD, LAST });
if (DEV) window.__tap = (x, z) => send({ k: 'go', x, z });
if (DEV) window.__arr = id => { G.sel = id; G.cd = 0; $('bArr').onclick(); };
if (DEV) window.__demo = (seed = 123) => { ME = 'me'; HOST = true; MEM = ['me']; NAMES = { me: 'demo' }; SIM = new W.Sim(seed, [{ pid: 'me', n: 'demo' }]); MESH = { all() { }, send() { }, P: {}, close() { } }; startLocal({ seed, you: SIM.H.me.eid, N: SIM.E.length, mem: ['me'], names: NAMES, h: 'me' }); show(''); $('hud').hidden = true; $('banner').hidden = true; };
if (DEV) window.__view = v => Object.assign(VIEW, v);
