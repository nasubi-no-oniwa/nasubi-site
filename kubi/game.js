import { THREE, GLTFLoader, RoomEnvironment } from './lib.js';
import { TX } from './text.js';
import { MAP } from './map.js';
const $ = id => document.getElementById(id);
const gsap = window.gsap, PFX = window.PFX;
const DEV = /[?&]dev=1/.test(location.search);
const IS_PHONE = /iPhone|iPod|iPad|Android/i.test(navigator.userAgent || '');
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---------- 距離の決まり ----------
// 反応の時間は 0.0001秒きざみ（tu）。1秒以上は首塚（約600m）、0.01秒で東京の将門の首塚まで。速いほうほど差が大きくなる。
const ORG = [135.8211, 34.4733], GOAL = [139.7628, 35.6872], RAD = Math.PI / 180;
function hav(a, b) { const p1 = a[1] * RAD, p2 = b[1] * RAD, dl = (b[0] - a[0]) * RAD, dp = p2 - p1, h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2; return 6371000 * 2 * Math.asin(Math.sqrt(h)); }
const DMAX = hav(ORG, GOAL), DMIN = 600, LATE = 1500, SUPER = 100;
function distOf(tu) { const t = tu / 10000; if (t <= 0.01) return DMAX; if (t >= 1) return DMIN; return DMIN * Math.pow(DMAX / DMIN, -Math.log10(t) / 2); }
const MS = [
  { k: 'kubizuka', d: 600, p: [135.8195, 34.4788] }, { k: 'moukon', d: 2700, p: [135.848, 34.462] }, { k: 'irukajinja', d: 5400, p: [135.7836, 34.5069] }, { k: 'kubiotoshi', d: 6900, p: [135.770, 34.515] }, { k: 'takami', d: 27000, p: [136.115, 34.430] },
  { k: 'ise', d: 83000, p: [136.7256, 34.4550] }, { k: 'atsuta', d: 123000, p: [136.9087, 35.1275] }, { k: 'hamana', d: 164000, p: [137.58, 34.75] }, { k: 'fuji', d: 283000, p: [138.7274, 35.3606] }, { k: 'masakado', d: DMAX, p: GOAL }
];
const fmtD = d => { if (d < 1000) return Math.round(d) + 'm'; const k = d / 1000; return (k < 10 ? k.toFixed(2) : k < 100 ? k.toFixed(1) : String(Math.round(k))) + 'km'; };
const fmtT = tu => (tu / 10000).toFixed(4);
const passed = d => { let m = null; for (const x of MS) if (d >= x.d - 0.5) m = x; return m; };
const nextMs = d => MS.find(x => d < x.d - 0.5) || null;
const landAt = d => { const f = clamp(d / DMAX, 0, 1); return [ORG[0] + (GOAL[0] - ORG[0]) * f, ORG[1] + (GOAL[1] - ORG[1]) * f]; };

// ---------- ことば ----------
let L = 'ja', T = TX.ja, LAST = null;
function pickLang() { const q = (/[?&]lang=([a-z]+)/.exec(location.search) || [])[1]; if (TX[q]) return q; const s = ls.get('kubi_lang', null); if (TX[s]) return s; const n = (navigator.language || 'ja').toLowerCase(); return n.startsWith('ja') ? 'ja' : n.startsWith('zh') ? 'zh' : n.startsWith('ko') ? 'ko' : 'en'; }
function setLang(l) {
  L = TX[l] ? l : 'ja'; T = TX[L]; ls.set('kubi_lang', L); document.documentElement.lang = L === 'zh' ? 'zh-Hant' : L; document.title = T.ttl;
  $('tYr').textContent = T.yr; $('tH1').innerHTML = T.h1; $('tH1').style.fontSize = L === 'ja' || L === 'zh' ? '58px' : L === 'ko' ? '46px' : '38px'; $('tLead').innerHTML = T.lead; $('startBtn').textContent = T.start; $('mvBtn').textContent = T.mv; $('rkBtn').textContent = T.rank; $('rkBtn2').textContent = T.rank; $('skip').textContent = T.skip; $('kamae').textContent = T.kamae;
  $('rkT').textContent = T.rank; $('rkNote').textContent = T.rkNote; $('rkBack').textContent = T.back; $('rkWhen').children[0].textContent = T.today; $('rkWhen').children[1].textContent = T.all;
  $('nm').placeholder = T.name; $('recBtn').textContent = T.rec; $('imgBtn').textContent = T.img; $('xBtn').textContent = T.x; $('again').textContent = T.again; $('toTitle').textContent = T.toTitle;
  $('langs').innerHTML = Object.keys(TX).map(k => `<button data-l="${k}" class="${k === L ? 'on' : ''}">${TX[k].lang}</button>`).join(''); $('langs').querySelectorAll('button').forEach(b => b.onclick = () => setLang(b.dataset.l));
  sndLabel(); if (LAST && !$('result').hidden) showResult();
}

// ---------- 画面 ----------
const canvas = $('gl');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); } catch (e) { $('load').textContent = TX[pickLang()].nogl; throw e; }
renderer.setPixelRatio(Math.min(IS_PHONE ? 1.75 : 2, window.devicePixelRatio || 1));
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0d0705); scene.fog = new THREE.FogExp2(0x1c100a, 0.03);
const sky = new THREE.Scene(); sky.background = new THREE.Color(0x8fc4ea); sky.fog = new THREE.Fog(0xcfe4f2, 120, 1500);
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 14000);
let VIEW = 'hall', PORT = true;
const CAM = { x: 0, y: 1.7, z: 11, lx: 0, ly: 2.6, lz: -9, fov: 50, sh: 0 };
function resize() { const w = window.innerWidth, h = window.innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; PORT = w < h; const c = $('slash'); c.width = w; c.height = h; }
window.addEventListener('resize', resize); resize();
function applyCam() { const s = CAM.sh; camera.position.set(CAM.x + (Math.random() - .5) * s, CAM.y + (Math.random() - .5) * s, CAM.z + (Math.random() - .5) * s); camera.lookAt(CAM.lx, CAM.ly, CAM.lz); const f = PORT ? CAM.fov : CAM.fov * 0.72; if (camera.fov !== f) { camera.fov = f; camera.updateProjectionMatrix(); } }

// 明かり：窓からの日（影つき）、入口からの光、灯台の火
scene.add(new THREE.HemisphereLight(0xffe2bc, 0x20120a, 0.42));
const sunL = new THREE.DirectionalLight(0xfff0d2, 2.3); sunL.position.set(8, 9.5, 2.5); sunL.target.position.set(1, 0, -1); sunL.castShadow = true;
sunL.shadow.mapSize.set(IS_PHONE ? 1024 : 2048, IS_PHONE ? 1024 : 2048); { const c = sunL.shadow.camera; c.left = -6; c.right = 6; c.top = 6; c.bottom = -6; c.near = 1; c.far = 30; } sunL.shadow.bias = -0.0015; sunL.shadow.normalBias = 0.02;
scene.add(sunL, sunL.target);
const doorL = new THREE.DirectionalLight(0xcfe0ff, 0.9); doorL.position.set(0, 3, 14); scene.add(doorL);
try { const pm = new THREE.PMREMGenerator(renderer); const env = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environment = env; scene.environmentIntensity = 0.16; sky.environment = env; sky.environmentIntensity = 0.35; } catch (e) { }
sky.add(new THREE.HemisphereLight(0xffffff, 0x88aa66, 0.75)); { const d = new THREE.DirectionalLight(0xfff4dc, 1.25); d.position.set(-3, 8, 5); sky.add(d); }

// ---------- 模型（Blenderで作った kubi.glb） ----------
let GLr = null; const F = {}; let sword, sword2, scroll, bow, skyHead, gorinto, flames = [], lampL = [];
const LAMPS = [[-2.6, -7.4], [2.6, -7.4], [-3.3, -2.5], [3.3, -2.5]];
function part(n) { const o = GLr.getObjectByName(n); if (!o) throw new Error('no ' + n); return o.clone(true); }
function fig(name, shock) { const g = new THREE.Group(), f = { g }; for (const k of ['body', 'head', 'armL', 'armR']) { f[k] = part(name + '_' + k); g.add(f[k]); } if (shock) { f.headS = part(name + '_headS'); f.headS.visible = false; g.add(f.headS); } g.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); scene.add(g); return f; }
function setup(gl) {
  GLr = gl.scene;
  const hall = part('hall'); hall.traverse(m => { if (m.isMesh) m.receiveShadow = true; }); scene.add(hall);
  const misu = part('misu'); misu.traverse(m => { if (m.isMesh && m.material && /misu/.test(m.material.name)) { m.material.transparent = true; m.material.opacity = 0.72; } }); scene.add(misu);
  const mt = part('mat'); mt.position.set(1.5, 0.001, -1.6); mt.traverse(m => { if (m.isMesh) m.receiveShadow = true; }); scene.add(mt);
  for (const [x, z] of LAMPS) { const f = part('flame'); f.position.set(x, 1.44, z); scene.add(f); flames.push(f); const p = new THREE.PointLight(0xffa040, 7, 8, 1.8); p.position.set(x, 1.6, z); scene.add(p); lampL.push(p); }
  for (const n of ['prince', 'iruka']) F[n] = fig(n, true);
  for (const n of ['maro', 'tenno', 'assassin', 'kamatari']) F[n] = fig(n);
  F.g1 = fig('guard'); F.g2 = fig('guard');
  sword = part('sword'); sword.traverse(m => { if (m.isMesh) m.castShadow = true; }); F.prince.armR.add(sword); sword.position.set(0, -0.6, 0);
  sword2 = part('sword'); F.assassin.armR.add(sword2); sword2.position.set(0, -0.6, 0); sword2.rotation.x = 1.85;
  for (const g of [F.g1, F.g2]) { const s = part('sword'); g.armR.add(s); s.position.set(0, -0.6, 0); s.rotation.x = 2.6; }
  scroll = part('scroll'); F.maro.g.add(scroll); scroll.position.set(0, 1.12, 0.46); scroll.rotation.x = -0.55;
  bow = part('bow'); F.kamatari.armL.add(bow); bow.position.set(0, -0.6, 0); bow.rotation.x = 1.57;
  F.tenno.g.position.set(0, 0.7, -11.3);
  skyHead = part('iruka_headS'); skyHead.position.set(0, 0, 0); const sh = new THREE.Group(); sh.add(skyHead); skyHead.position.y = -0.2; sh.scale.setScalar(3.4); skyHead = sh; sky.add(sh);
  gorinto = part('gorinto'); gorinto.scale.setScalar(0.001); gorinto.visible = false; sky.add(gorinto);
  buildShafts(); buildDust(); buildSky();
}
// 窓からさす光のすじと、床の光だまり
function buildShafts() {
  const pos = [], col = [], fpos = [], fcol = [];
  const quad = (P, C, a, b, c, d, ca, cb) => { for (const [v, k] of [[a, ca], [b, ca], [c, cb], [a, ca], [c, cb], [d, cb]]) { P.push(v[0], v[1], v[2]); C.push(k, k * 0.9, k * 0.68); } };
  for (let k = 0; k < 8; k++) { const z1 = 12.6 - k * 3.25, z0 = z1 - 2.5, s = -1.1;
    quad(pos, col, [6.85, 3.7, z0], [6.85, 3.7, z1], [0.6, 0.02, z1 + s], [0.6, 0.02, z0 + s], 1, 0.05);
    quad(pos, col, [6.85, 1.5, z0], [6.85, 1.5, z1], [4.3, 0.02, z1 + s], [4.3, 0.02, z0 + s], 0.8, 0.05);
    quad(fpos, fcol, [4.3, 0.012, z0 + s], [4.3, 0.012, z1 + s], [0.6, 0.012, z1 + s], [0.6, 0.012, z0 + s], 1, 0.75); }
  const mk = (P, C, op) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); m.renderOrder = 5; scene.add(m); return m; };
  mk(pos, col, 0.10); mk(fpos, fcol, 0.16);
  for (const sx of [-1, 1]) { const o = new THREE.Mesh(new THREE.PlaneGeometry(27, 2.6), new THREE.MeshBasicMaterial({ color: sx > 0 ? 0xe9eef0 : 0xb9c6cc, fog: false })); o.position.set(sx * 7.35, 2.6, 0); o.rotation.y = -sx * Math.PI / 2; scene.add(o); }
  const door = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), new THREE.MeshBasicMaterial({ color: 0xdde8f2, fog: false })); door.position.set(0, 2.4, 13.6); door.rotation.y = Math.PI; scene.add(door);
}
let dust, dustV;
function buildDust() { const N = 260, p = new Float32Array(N * 3); dustV = new Float32Array(N * 3); for (let i = 0; i < N; i++) { p[i * 3] = 0.5 + Math.random() * 6; p[i * 3 + 1] = 0.2 + Math.random() * 3.6; p[i * 3 + 2] = -7 + Math.random() * 12; dustV[i * 3] = (Math.random() - .5) * .05; dustV[i * 3 + 1] = (Math.random() - .5) * .03; dustV[i * 3 + 2] = (Math.random() - .5) * .05; } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3)); dust = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffe2b0, size: 0.03, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(dust); }
// 空を飛ぶ場面
let ground, gtex, clouds = [], streak, streakP;
function buildSky() {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'); x.fillStyle = '#6f9a48'; x.fillRect(0, 0, 512, 512); let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 150; i++) { x.fillStyle = ['#7fa850', '#5f8a3e', '#8fb45a', '#b8b56a', '#587f3a', '#9cbd68'][Math.floor(r() * 6)]; x.fillRect(r() * 512, r() * 512, 20 + r() * 70, 14 + r() * 50); }
  x.strokeStyle = '#5c93b8'; x.lineWidth = 7; x.beginPath(); x.moveTo(0, 150); x.bezierCurveTo(140, 90, 300, 260, 512, 150); x.stroke(); x.strokeStyle = '#cfc9a8'; x.lineWidth = 3; x.beginPath(); x.moveTo(90, 0); x.lineTo(130, 512); x.moveTo(0, 380); x.lineTo(512, 420); x.stroke();
  for (let i = 0; i < 60; i++) { x.fillStyle = '#3f6a2c'; x.beginPath(); x.arc(r() * 512, r() * 512, 5 + r() * 12, 0, 7); x.fill(); }
  gtex = new THREE.CanvasTexture(c); gtex.wrapS = gtex.wrapT = THREE.RepeatWrapping; gtex.repeat.set(90, 90); gtex.colorSpace = THREE.SRGBColorSpace; gtex.anisotropy = 4;
  ground = new THREE.Mesh(new THREE.PlaneGeometry(18000, 18000), new THREE.MeshBasicMaterial({ map: gtex })); ground.rotation.x = -Math.PI / 2; sky.add(ground);
  const cc = document.createElement('canvas'); cc.width = cc.height = 128; const y = cc.getContext('2d'); const g = y.createRadialGradient(64, 64, 4, 64, 64, 62); g.addColorStop(0, '#ffffffee'); g.addColorStop(.6, '#ffffff66'); g.addColorStop(1, '#ffffff00'); y.fillStyle = g; y.fillRect(0, 0, 128, 128); const ct = new THREE.CanvasTexture(cc);
  for (let i = 0; i < 26; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ct, transparent: true, opacity: 0.85, depthWrite: false, fog: false })); sp.scale.set(14 + Math.random() * 22, 6 + Math.random() * 8, 1); sp.position.set(-80 + Math.random() * 160, -14 + Math.random() * 30, -8 - Math.random() * 60); sky.add(sp); clouds.push(sp); }
  const N = 70; streakP = new Float32Array(N * 6); for (let i = 0; i < N; i++) { const yy = -7 + Math.random() * 14, zz = -6 + Math.random() * 10, xx = -30 + Math.random() * 60, l = 2 + Math.random() * 5; streakP.set([xx, yy, zz, xx + l, yy, zz], i * 6); } const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(streakP, 3)); streak = new THREE.LineSegments(sg, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, fog: false })); sky.add(streak);
}

// ---------- 立ち位置と姿勢 ----------
const SHOT_G = { x: -6.3, y: 1.0, z: -0.72, lx: 1.5, ly: 1.85, lz: -0.72, fov: 50, sh: 0 };
let TW = []; const tw = (t, v) => { const x = gsap.to(t, v); TW.push(x); return x; }; let SEQ = null;
function killAll() { TW.forEach(t => t.kill()); TW = []; if (SEQ) { SEQ.kill(); SEQ = null; } }
function arms(f, l, r) { f.armL.rotation.set(l, 0, 0); f.armR.rotation.set(r, 0, 0); }
function resetStage() {
  killAll(); VIEW = 'hall'; const P = F.prince, I = F.iruka;
  for (const f of [P, I]) { f.g.add(f.headS); f.headS.position.set(0, 1.46, 0); f.headS.rotation.set(0, 0, 0); f.headS.scale.setScalar(1); f.headS.visible = false; f.head.visible = true; f.head.rotation.set(0, 0, 0); f.g.rotation.set(0, 0, 0); f.g.visible = true; }
  P.g.position.set(1.5, 0, 0.2); P.g.rotation.y = Math.PI; arms(P, -2.35, -2.5); P.armL.rotation.z = 0.25; sword.rotation.set(1.85, 0, 0);
  I.g.position.set(1.5, 0.03, -1.6); I.g.rotation.y = Math.PI + 0.5; arms(I, -0.5, -0.5); I.armL.rotation.z = 0.5; I.armR.rotation.z = -0.5;
  F.maro.g.position.set(3.3, 0, -1.2); F.maro.g.rotation.set(0, Math.PI + 0.35, 0); arms(F.maro, -1.2, -1.2); F.maro.armL.rotation.z = 0.35; F.maro.armR.rotation.z = -0.35;
  F.g1.g.position.set(5.0, 0, 0.1); F.g1.g.rotation.y = -1.9; arms(F.g1, 0.1, -0.5); F.g2.g.position.set(5.6, 0, -0.8); F.g2.g.rotation.y = -2.1; arms(F.g2, 0.1, -0.4);
  F.kamatari.g.position.set(4.9, 0, 1.5); F.kamatari.g.rotation.y = -2.2; arms(F.kamatari, -0.9, 0);
  F.assassin.g.visible = false; F.assassin.g.position.set(1.5, 0, 1.08); F.assassin.g.rotation.set(0, Math.PI, 0); arms(F.assassin, -2.3, -2.6);
  Object.assign(CAM, SHOT_G);
  gsap.set(['#flash', '#iris', '#rt', '#kamae', '#cap', '#fly'], { opacity: 0 }); gsap.set('#bang', { opacity: 0, scale: .2 }); gsap.set(['#barT', '#barB'], { height: 0 }); $('verd').hidden = true; $('skip').hidden = true; $('flyB').innerHTML = ''; slashA = 0; drawSlash();
}

// ---------- 音 ----------
let AC = null, MG = null, MUTE = !!ls.get('kubi_mute', 0), AMB = null;
function audioInit() { if (AC) { if (AC.state === 'suspended') AC.resume(); return; } try { AC = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' }); MG = AC.createGain(); MG.gain.value = MUTE ? 0 : 1; MG.connect(AC.destination); } catch (e) { AC = null; } }
function tone(f, d, type = 'sine', v = .2, when = 0, f2) { if (!AC) return; const t = AC.currentTime + when, o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(MG); o.start(t); o.stop(t + d + .02); }
function noise(d, v = .2, when = 0, hp = 800, lp = 0) { if (!AC) return; const t = AC.currentTime + when, n = Math.floor(AC.sampleRate * d), b = AC.createBuffer(1, n, AC.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = AC.createBufferSource(); s.buffer = b; const f = AC.createBiquadFilter(); f.type = lp ? 'lowpass' : 'highpass'; f.frequency.value = lp || hp; const g = AC.createGain(); g.gain.value = v; s.connect(f); f.connect(g); g.connect(MG); s.start(t); }
const SFX = {
  tap: () => tone(660, .07, 'triangle', .16),
  cue: () => { tone(1568, .32, 'square', .22, 0, 2349); tone(3136, .2, 'sine', .2); noise(.06, .5, 0, 3500); },
  slash: () => { noise(.2, .8, 0, 1400); tone(1200, .16, 'sawtooth', .25, 0, 110); tone(80, .35, 'sine', .5, .03, 40); },
  pop: () => { tone(260, .28, 'sine', .35, 0, 1100); noise(.08, .2, 0, 2000); },
  pass: () => { tone(880, .09, 'triangle', .14, 0, 1320); },
  land: () => { tone(120, .22, 'sine', .5, 0, 50); noise(.12, .3, 0, 0, 500); tone(420, .18, 'sine', .18, .16, 640); },
  fan: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .24, 'triangle', .16, i * .1)),
  sp: () => [523, 659, 784, 1047, 1319, 1568, 2093].forEach((f, i) => tone(f, .3, 'square', .1, i * .08)),
  thud: () => { tone(90, .4, 'sine', .6, 0, 38); noise(.15, .4, 0, 0, 400); },
  drop: () => { tone(200, .12, 'sine', .4, 0, 70); noise(.06, .25, 0, 0, 700); },
  beat: () => { tone(58, .12, 'sine', .5, 0, 40); tone(52, .14, 'sine', .4, .16, 36); },
  voice: v => tone(150 + Math.random() * 70 + Math.sin(performance.now() / 28) * 22 * v, .15, 'triangle', .035 + .02 * v)
};
function sfx(n, a) { if (AC && SFX[n]) try { SFX[n](a); } catch (e) { } }
function ambient(kind) {   // 雨の音（板蓋宮）／風の音（空）
  if (AMB) { try { AMB.s.stop(); } catch (e) { } AMB = null; } if (!kind || !AC) return;
  const n = AC.sampleRate * 2, b = AC.createBuffer(1, n, AC.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1;
  const s = AC.createBufferSource(); s.buffer = b; s.loop = true; const f = AC.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = kind === 'rain' ? 3200 : 500; f.Q.value = kind === 'rain' ? 0.4 : 0.8; const g = AC.createGain(); g.gain.value = kind === 'rain' ? 0.045 : 0.0001; s.connect(f); f.connect(g); g.connect(MG); s.start(); AMB = { s, g, f, kind };
}
function sndLabel() { $('sndBtn').textContent = MUTE ? T.sndOff : T.sndOn; }
$('sndBtn').onclick = () => { MUTE = !MUTE; ls.set('kubi_mute', MUTE ? 1 : 0); audioInit(); if (MG) MG.gain.value = MUTE ? 0 : 1; sndLabel(); };

// ---------- 演出（pixelfx と、斬った線） ----------
const fctx = $('fxc').getContext('2d'); let FXS = [], fxFrame = null, fxImg = null, fxRaf = 0, fxLast = 0;
function fxAdd(mod, o) { try { if (!PFX || !mod) return; if (!fxFrame) { fxFrame = PFX.createFrame(160, 160); fxImg = new ImageData(160, 160); } const f = PFX.createFx(mod, o); f._life = mod === PFX.fx.confetti ? 3.2 : 1.3; FXS.push(f); if (!fxRaf) { fxLast = performance.now(); fxRaf = requestAnimationFrame(fxLoop); } } catch (e) { } }
function fxLoop(now) { const dt = Math.min(.05, (now - fxLast) / 1000); fxLast = now; try { PFX.clearFrame(fxFrame); FXS = FXS.filter(f => { f.update(dt); f.draw(fxFrame, 'back'); f.draw(fxFrame, 'front'); f._life -= dt; return !f.done() && f._life > 0; }); PFX.composite(fxFrame, fxImg.data, null); fctx.putImageData(fxImg, 0, 0); } catch (e) { FXS = []; } if (FXS.length) fxRaf = requestAnimationFrame(fxLoop); else { fxRaf = 0; fctx.clearRect(0, 0, 160, 160); } }
let slashA = 0, slashC = '#ffffff';
function drawSlash() { const c = $('slash'), x = c.getContext('2d'), w = c.width, h = c.height; x.clearRect(0, 0, w, h); if (slashA <= 0.01) return; x.save(); x.globalAlpha = Math.min(1, slashA); x.translate(w / 2, h * 0.42); x.rotate(-0.42); const len = Math.hypot(w, h) * 0.75, th = Math.max(6, h * 0.022) * (0.4 + slashA * 0.6); const g = x.createLinearGradient(-len, 0, len, 0); g.addColorStop(0, '#ffffff00'); g.addColorStop(.25, slashC); g.addColorStop(.75, slashC); g.addColorStop(1, '#ffffff00'); x.shadowColor = slashC; x.shadowBlur = 30; x.fillStyle = g; x.beginPath(); x.moveTo(-len, 0); x.quadraticCurveTo(0, -th, len, 0); x.quadraticCurveTo(0, th, -len, 0); x.fill(); x.restore(); }
function slashFx(col) { slashC = col || '#ffffff'; const o = { a: 1.4 }; slashA = 1.4; drawSlash(); tw(o, { a: 0, duration: .55, ease: 'power2.in', onUpdate: () => { slashA = o.a; drawSlash(); } }); }

// ---------- 進行 ----------
let ST = 'load', RUN = null, SHOT = null, cueAt = 0, readyAt = 0, tCue = 0, beatAt = 0, voiceAt = 0, tens = 0;
let MAN = false, VT = 0; const now = () => MAN ? VT : performance.now();
async function start(btn, movie) {
  if (btn && btn.classList.contains('busy')) return; if (btn) btn.classList.add('busy'); try { document.activeElement && document.activeElement.blur(); } catch (e) { } audioInit(); sfx('tap'); LAST = null;
  let st = null; try { st = await Promise.race([netStart(), new Promise(r => setTimeout(() => r(null), 3500))]); } catch (e) { st = null; }
  if (st == null) RUN = null; if (btn) btn.classList.remove('busy');
  $('title').hidden = true; $('result').hidden = true; $('rank').hidden = true; resetStage(); ambient('rain');
  try { if (typeof gtag === 'function') gtag('event', 'game_start', { game: 'kubi' }); } catch (e) { }
  if (movie || !ls.get('kubi_mv', 0)) playMovie(); else ready();
}
function ready() {
  resetStage(); ST = 'ready'; readyAt = now(); cueAt = readyAt + 800 + Math.random() * 4200; beatAt = readyAt + 300; voiceAt = readyAt; tens = 0;
  gsap.fromTo('#kamae', { opacity: 0 }, { opacity: 1, duration: .25 }); tw('#kamae', { opacity: 0, duration: .5, delay: 1.1 });
  Object.assign(CAM, SHOT_G, { x: -6.6 }); tw(CAM, { x: -5.7, duration: 5.2, ease: 'none' });
  if (DEV && DEVCUE != null) cueAt = readyAt + DEVCUE;
}
let DEVCUE = null;
function cue() { ST = 'cue'; const b = $('bang'); b.style.opacity = 1; b.style.transform = 'scale(1)'; sfx('cue'); tCue = now(); }
function onPress(e) {
  if (ST !== 'ready' && ST !== 'cue') return; if (e.target && e.target.closest && e.target.closest('button')) return;
  let ts = e.timeStamp; const n = now(); if (!(ts > 0) || Math.abs(n - ts) > 4000) ts = n;
  if (ST === 'ready') { if (ts - readyAt < 350) return; fail('early'); return; }
  const r = ts - tCue; if (r < 0) fail('early'); else if (r > LATE) fail('late'); else slash(r);
}
window.addEventListener('pointerdown', onPress, { passive: true });
window.addEventListener('keydown', e => { if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat && (ST === 'ready' || ST === 'cue')) { e.preventDefault(); onPress({ timeStamp: e.timeStamp, target: null }); } });
function shot() { return new Promise(r => { SHOT = r; }); }

function slash(r) {
  ST = 'slash'; killAll(); const tu = Math.max(1, Math.round(r * 10)), d = distOf(tu), R = LAST = { ok: true, tu, d, sp: tu < SUPER, run: RUN, ms: passed(d), nx: nextMs(d), tipA: Math.floor(Math.random() * 4) };
  const P = F.prince, I = F.iruka; gsap.set('#bang', { opacity: 0 }); gsap.set('#kamae', { opacity: 0 });
  sfx('slash'); gsap.fromTo('#flash', { opacity: 1 }, { opacity: 0, duration: .3 }); slashFx(R.sp ? '#ffe27a' : '#ffffff');
  P.g.position.z = -2.5; arms(P, -0.5, -0.7); P.armL.rotation.z = 0.2; P.g.rotation.x = 0.12; I.head.rotation.y = 0;
  Object.assign(CAM, SHOT_G, { x: -6.4, lz: -1.2, z: -1.2, sh: 0.09 }); tw(CAM, { sh: 0, duration: .4 });
  $('rt').innerHTML = fmtT(tu) + '<small>' + T.sec + '</small>'; gsap.fromTo('#rt', { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: .16, ease: 'power3.in' });
  fxAdd(PFX && PFX.fx.star, { seed: tu }); let shotRes; R.shot = new Promise(r => { shotRes = r; });
  SEQ = gsap.timeline();
  SEQ.call(() => {   // 首が飛ぶ
    sfx('pop'); I.head.visible = false; I.headS.visible = true; scene.attach(I.headS); fxAdd(PFX && PFX.fx.burst, { seed: tu + 1 });
    tw(I.headS.position, { y: 9, duration: .6, ease: 'power2.out' }); tw(I.headS.position, { z: 3.5, x: 0.6, duration: .6, ease: 'none' }); tw(I.headS.rotation, { x: -9, z: 3, duration: .6, ease: 'none' });
    tw(I.armL.rotation, { x: -2.6, duration: .15 }); tw(I.armR.rotation, { x: -2.6, duration: .15 }); tw(CAM, { ly: 3.0, duration: .5, ease: 'power2.out' });
  }, null, .85);
  SEQ.call(() => { SHOT = shotRes; }, null, .92);
  SEQ.to('#flash', { opacity: 1, duration: .12 }, 1.33); SEQ.to('#rt', { opacity: 0, duration: .12 }, 1.33);
  SEQ.call(() => fly(R), null, 1.46);
}

function fail(kind) {
  ST = 'fail'; killAll(); const R = LAST = { ok: false, why: kind, run: null, tipA: Math.floor(Math.random() * 3) }; const P = F.prince, A = F.assassin, I = F.iruka;
  gsap.set('#bang', { opacity: 0 }); gsap.set('#kamae', { opacity: 0 }); sfx('thud');
  A.g.visible = true; A.g.position.y = 4; tw(A.g.position, { y: 0, duration: .16, ease: 'power2.in' }); tw(CAM, { lz: 0.45, z: 0.45, x: -5.6, duration: .22 });
  SEQ = gsap.timeline();
  SEQ.call(() => {
    sfx('slash'); slashFx('#ff5a3c'); gsap.fromTo('#flash', { opacity: .9 }, { opacity: 0, duration: .25 }); CAM.sh = 0.1; tw(CAM, { sh: 0, duration: .4 });
    arms(A, -0.5, -0.6); P.head.visible = false; P.headS.visible = true; scene.attach(P.headS); R.shot = shot();
  }, null, .34);
  SEQ.call(() => {   // 首は真下に落ちる
    const h = P.headS; tw(h.position, { y: 0.16, duration: .5, ease: 'power2.in', onComplete: () => { sfx('drop'); gsap.to(h.position, { y: 0.42, duration: .13, yoyo: true, repeat: 1, ease: 'power1.out' }); } }); tw(h.rotation, { x: 1.3, z: 0.5, duration: .75 });
    tw(P.g.rotation, { x: -1.5, duration: .7, ease: 'power2.in', delay: .25 }); tw(P.armR.rotation, { x: -0.2, duration: .3 }); tw(P.armL.rotation, { x: -0.2, duration: .3 });
    tw(I.head.rotation, { y: 2.2, duration: .25, delay: .3 }); tw(CAM, { ly: 0.9, y: 1.3, duration: .7 });
  }, null, .52);
  SEQ.call(() => { $('vV').textContent = T.vNg; $('verd').hidden = false; gsap.fromTo('#vV', { scale: 2.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .25, ease: 'power3.in' }); }, null, 1.25);
  SEQ.call(() => showResult(true), null, 2.5);
}

// 空を飛ぶ → 落ちる
let FL = null;
function fly(R) {
  ST = 'fly'; VIEW = 'sky'; ambient('wind'); const d = R.d, dur = 2.3 + 1.15 * Math.log10(d / DMIN);
  FL = { R, t: 0, dur, s: 0, alt: 0, amax: clamp(40 + d / 220, 45, 800), shown: 0, landed: false, tl: 0 };
  gorinto.visible = false; gorinto.scale.setScalar(0.001); skyHead.position.set(0, 0, 0); skyHead.rotation.set(0, 0, 0); clouds.forEach(c => c.visible = true);
  Object.assign(CAM, { x: -3.5, y: 1.6, z: 9, lx: 0, ly: 0.3, lz: 0, fov: 52, sh: 0 });
  $('flyB').innerHTML = ''; $('flyD').innerHTML = '0<small>m</small>'; gsap.set('#fly', { opacity: 1 }); gsap.to('#flash', { opacity: 0, duration: .3 });
}
function flyStep(dt) {
  const f = FL; if (!f) return; const R = f.R;
  if (!f.landed) {
    f.t += dt; const u = clamp(f.t / f.dur, 0, 1), e = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, s = R.d * e, sp = (s - f.s) / Math.max(dt, 1e-3); f.s = s;
    f.alt = f.amax * Math.pow(Math.sin(Math.PI * u), 0.7); ground.position.y = -3.2 - f.alt; const k = clamp(Math.log10(1 + sp) / 5.6, 0, 1);
    gtex.offset.x += dt * (0.25 + k * 2.4) * (26 / Math.max(26, f.alt * 0.5)); sky.fog.near = 60 + f.alt * 0.6; sky.fog.far = 800 + f.alt * 3.4;
    skyHead.rotation.z -= dt * (3.5 + 8 * k); skyHead.rotation.x = Math.sin(f.t * 3) * 0.25; skyHead.rotation.y = -0.3; skyHead.position.y = Math.sin(f.t * 7) * 0.12;
    for (const c of clouds) { c.position.x -= dt * (10 + 150 * k) * (1 + (c.position.z + 70) / 90); if (c.position.x < -90) { c.position.x = 90; c.position.y = -14 + Math.random() * 30; } c.material.opacity = 0.85 * clamp(f.alt / 60, 0, 1); }
    streak.material.opacity = 0.75 * k * clamp(f.alt / 30, 0, 1); for (let i = 0; i < streakP.length; i += 6) { const v = dt * (60 + 260 * k); streakP[i] -= v; streakP[i + 3] -= v; if (streakP[i + 3] < -32) { const l = 2 + Math.random() * 6; streakP[i] = 30; streakP[i + 3] = 30 + l; } } streak.geometry.attributes.position.needsUpdate = true;
    if (AMB && AMB.kind === 'wind') { AMB.g.gain.value = 0.02 + 0.14 * k; AMB.f.frequency.value = 350 + 1500 * k; }
    const m = /([\d.]+)(\D+)/.exec(fmtD(s)); $('flyD').innerHTML = m[1] + '<small>' + m[2] + '</small>';
    while (f.shown < MS.length && MS[f.shown].d <= s + 0.5 && MS[f.shown].d <= R.d + 0.5) { const b = document.createElement('div'); b.innerHTML = T.flyPass(esc(T.ms[MS[f.shown].k][0])); const box = $('flyB'); box.insertBefore(b, box.firstChild); while (box.children.length > 3) box.removeChild(box.lastChild); gsap.fromTo(b, { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .16 }); sfx('pass'); f.shown++; }
    if (u >= 1) {   // 着地
      f.landed = true; ambient(null); clouds.forEach(c => c.visible = false); streak.material.opacity = 0; ground.position.y = -3.2; sky.fog.near = 60; sky.fog.far = 900;
      skyHead.position.y = 9; gsap.to(skyHead.position, { y: -2.5, duration: .38, ease: 'power2.in', onComplete: () => { sfx('land'); CAM.sh = 0.25; gsap.to(CAM, { sh: 0, duration: .35 }); gsap.to(skyHead.position, { y: -1.2, duration: .16, yoyo: true, repeat: 1, ease: 'power1.out' }); fxAdd(PFX && PFX.fx.burst, { seed: R.tu }); } });
      gsap.to(skyHead.rotation, { z: Math.round((skyHead.rotation.z - 6) / (Math.PI * 2)) * Math.PI * 2 + 0.18, x: 0.1, y: -0.25, duration: 1.0, ease: 'power2.out' });
      gorinto.visible = true; gorinto.position.set(1.9, -3.2, -3.4); gsap.to(gorinto.scale, { x: 1.9, y: 1.9, z: 1.9, duration: .35, delay: .85, ease: 'back.out(2.2)' });
      gsap.to(CAM, { y: 0.2, z: 11, x: -1.5, ly: -1.2, duration: .9, ease: 'power2.out' });
      gsap.delayedCall(.75, () => { $('vV').textContent = R.sp ? T.vSp : T.vOk; $('verd').hidden = false; gsap.fromTo('#vV', { scale: 2.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .25, ease: 'power3.in' }); sfx(R.sp ? 'sp' : 'fan'); if (R.sp || R.d >= 27000) fxAdd(PFX && PFX.fx.confetti, { seed: R.tu }); });
      gsap.delayedCall(2.5, () => { if (ST === 'fly' && LAST === R) showResult(true); });
    }
  }
}

// ムービー（史実に沿った始まり。飛ばせる）
const SHOTS = [
  [{ x: 0, y: 1.7, z: 11.2, lx: 0, ly: 2.7, lz: -9, fov: 58 }, { z: 7.2, y: 2.0 }],
  [{ x: 0.0, y: 1.55, z: -3.9, lx: 1.5, ly: 1.5, lz: -1.6, fov: 44 }, { x: 0.35, z: -3.5 }],
  [{ x: 2.3, y: 1.55, z: -3.7, lx: 3.3, ly: 1.4, lz: -1.2, fov: 46 }, { x: 2.6, z: -3.4 }],
  [{ x: 2.4, y: 1.5, z: -7.0, lx: 2.4, ly: 1.3, lz: -1.4, fov: 56 }, { z: -6.2 }],
  [{ x: 0.4, y: 1.25, z: -2.1, lx: 1.5, ly: 1.6, lz: 0.2, fov: 50 }, { x: 0.7, z: -1.8 }]
];
function playMovie() {
  ST = 'movie'; resetStage(); $('skip').hidden = false; gsap.to('#barT', { height: '8%', duration: .4 }); gsap.to('#barB', { height: '21%', duration: .4 }); tens = 0; voiceAt = now() + 3600;
  arms(F.prince, 0.1, 0.25); F.prince.armL.rotation.z = 0; sword.rotation.set(2.9, 0, 0);
  const D = 3.9; SEQ = gsap.timeline();
  SHOTS.forEach((s, i) => {
    SEQ.call(() => { gsap.killTweensOf(CAM); Object.assign(CAM, { sh: 0 }, s[0]); tw(CAM, { ...s[1], duration: D + .2, ease: 'none' }); $('capT').innerHTML = T.mvs[i]; gsap.fromTo('#cap', { opacity: 0 }, { opacity: 1, duration: .35 }); tens = i >= 2 ? (i - 1) / 3 : 0;
      if (i === 4) { tw(F.prince.armR.rotation, { x: -2.5, duration: 1.4, delay: 1.2, ease: 'power2.inOut' }); tw(F.prince.armL.rotation, { x: -2.35, z: 0.25, duration: 1.4, delay: 1.2, ease: 'power2.inOut' }); tw(sword.rotation, { x: 1.85, duration: 1.4, delay: 1.2 }); }
      if (i === 3) tw(F.iruka.head.rotation, { y: -0.7, duration: .5, delay: 1.6 });
    }, null, i * D);
    SEQ.to('#cap', { opacity: 0, duration: .25 }, i * D + D - .3);
  });
  SEQ.call(endMovie, null, SHOTS.length * D);
}
function endMovie() { if (ST !== 'movie') return; ls.set('kubi_mv', 1); killAll(); gsap.to(['#barT', '#barB'], { height: 0, duration: .3 }); gsap.set('#cap', { opacity: 0 }); $('skip').hidden = true; gsap.fromTo('#iris', { opacity: 1 }, { opacity: 0, duration: .35 }); ready(); }
$('skip').addEventListener('click', e => { e.stopPropagation(); sfx('tap'); endMovie(); });

// ---------- 毎フレーム ----------
let lastF = 0;
function frame(t) {
  if (!MAN) requestAnimationFrame(frame); const dt = Math.min(MAN ? 0.3 : 0.05, (t - lastF) / 1000 || 0.016); lastF = t; const n = now();
  if (ST === 'ready' && n >= cueAt) cue();
  if (ST === 'cue' && n - tCue > LATE) fail('late');
  if (ST === 'ready' || ST === 'cue' || ST === 'movie') {
    if (ST !== 'movie') tens = clamp((n - readyAt) / 4500, 0, 1);
    if (ST !== 'movie' && n >= beatAt) { sfx('beat'); beatAt = n + 1000 - 420 * tens; }
    if (ST !== 'cue' && n >= voiceAt) { sfx('voice', tens); voiceAt = n + 170 + Math.random() * 160; }
    const M = F.maro, k = 0.006 + 0.03 * tens; M.g.rotation.z = Math.sin(n / 31) * k; scroll.rotation.z = Math.sin(n / 23) * k * 3; M.head.rotation.x = 0.25 + Math.sin(n / 400) * 0.05;
    if (ST !== 'movie') { F.prince.g.position.y = Math.sin(n / 300) * 0.006; sword.rotation.z = Math.sin(n / 47) * 0.012 * tens; }
  }
  if (VIEW === 'hall') {
    const p = dust.geometry.attributes.position; for (let i = 0; i < p.count; i++) { let x = p.getX(i) + dustV[i * 3] * dt, y = p.getY(i) + dustV[i * 3 + 1] * dt, z = p.getZ(i) + dustV[i * 3 + 2] * dt; if (y < 0.1 || y > 4) dustV[i * 3 + 1] *= -1; if (x < 0.4 || x > 6.6) dustV[i * 3] *= -1; p.setXYZ(i, x, y, z); } p.needsUpdate = true;
    flames.forEach((f, i) => { const s = 1 + Math.sin(n / 60 + i * 2) * 0.12 + Math.sin(n / 23 + i) * 0.06; f.scale.set(1, s, 1); lampL[i].intensity = 6 + s * 1.6; });
    if (ST === 'title') { const a = n / 9000; CAM.x = Math.sin(a) * 1.6; CAM.y = 1.9; CAM.z = 9.5 + Math.cos(a) * 1.2; CAM.lx = 0.6; CAM.ly = 2.3; CAM.lz = -6; CAM.fov = 58; }
  } else flyStep(dt);
  applyCam(); renderer.render(VIEW === 'hall' ? scene : sky, camera);
  if (SHOT) { const r = SHOT; SHOT = null; try { r(canvas.toDataURL('image/jpeg', 0.86)); } catch (e) { r(null); } }
}

// ---------- 結果 ----------
let POST = '';
const SHARE_URL = 'https://nasubi-no-oniwa.com/kubi/';
const placeLine = R => R.sp || !R.nx ? T.max : T.pass(T.ms[R.ms.k][0]);
function showResult(first) {
  const R = LAST; if (!R) return; const sec = '<small>' + T.sec + '</small>';
  $('rV').textContent = R.ok ? (R.sp ? T.vSp : T.vOk) : T.vNg; $('rV').className = 'rv' + (R.ok ? (R.sp ? ' sp' : '') : ' ng');
  if (R.ok) {
    $('rT').innerHTML = fmtT(R.tu) + sec; $('rL').textContent = T.tReact; $('rD').textContent = fmtD(R.d); $('rP').innerHTML = esc(placeLine(R)) + (R.nx && !R.sp ? '<br><span style="color:var(--sub);font-size:13px">' + esc(T.next(T.ms[R.nx.k][0], fmtD(R.nx.d - R.d))) + '</span>' : '');
    $('map').hidden = false; drawMap($('map').getContext('2d'), 600, R); $('tipT').textContent = T.tip + '：' + T.ms[R.ms.k][0]; $('tipB').innerHTML = esc(T.ms[R.ms.k][1]) + '<br><br>' + esc(T.after[R.tipA % T.after.length]);
    POST = (R.sp ? T.postSp(fmtT(R.tu), fmtD(R.d)) : T.postOk(fmtT(R.tu), fmtD(R.d), placeLine(R))) + '\n' + SHARE_URL;
  } else {
    const w = R.why === 'early' ? T.whyEarly : T.whyLate; $('rT').innerHTML = '—'; $('rL').textContent = w; $('rD').textContent = T.drop; $('rP').textContent = ''; $('map').hidden = true; $('tipT').textContent = T.tip; $('tipB').textContent = T.fail[R.tipA % T.fail.length];
    POST = T.postNg(w) + '\n' + SHARE_URL;
  }
  R.card = makeCard(R).catch(() => null); $('recBox').hidden = !R.ok;
  if (first) {
    ST = 'result'; $('verd').hidden = true; gsap.to('#fly', { opacity: 0, duration: .3 }); $('result').hidden = false; $('result').scrollTop = 0; if (R.ok) ambient(null);
    $('recBtn').disabled = !R.run; $('recNote').textContent = R.ok ? (R.run ? '' : T.norun) : ''; $('recNote').className = 'note';
    gsap.fromTo('#result .card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .35, ease: 'power2.out', clearProps: 'transform' }); gsap.fromTo('#rV', { scale: 2.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .28, delay: .3, ease: 'power3.in' });
  }
}
// 地図：板蓋宮から東京の将門の首塚へ向かう線の上に、落ちた場所を出す
function drawMap(x, W, R) {
  const L1 = landAt(R.d), hv = Math.max(R.d * 0.66, 4300), c0 = [(ORG[0] + L1[0]) / 2, (ORG[1] + L1[1]) / 2], kx = Math.cos(c0[1] * RAD) * 111320, ky = 110900, sc = (W / 2) / hv;
  const PX = p => [W / 2 + (p[0] - c0[0]) * kx * sc, W / 2 - (p[1] - c0[1]) * ky * sc];
  x.fillStyle = '#a9cbd6'; x.fillRect(0, 0, W, W); x.fillStyle = '#ece2c0'; x.strokeStyle = '#bfae7c'; x.lineWidth = 1.5; x.lineJoin = 'round';
  for (const r of MAP) { x.beginPath(); for (let i = 0; i < r.length; i += 2) { const q = PX([130 + r[i] / 200, 30 + r[i + 1] / 200]); i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]); } x.closePath(); x.fill(); x.stroke(); }
  const o = PX(ORG), l = PX(L1), g = PX(GOAL);
  x.setLineDash([3, 7]); x.strokeStyle = '#1b120d33'; x.lineWidth = 1.5; for (const m of MS) { const rr = m.d * sc; if (rr > 14 && rr < W * 1.2) { x.beginPath(); x.arc(o[0], o[1], rr, 0, 7); x.stroke(); } }
  x.setLineDash([6, 8]); x.strokeStyle = '#1b120d55'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(o[0], o[1]); x.lineTo(g[0], g[1]); x.stroke(); x.setLineDash([]);
  x.strokeStyle = '#b8281a'; x.lineWidth = 7; x.lineCap = 'round'; x.beginPath(); x.moveTo(o[0], o[1]); x.lineTo(l[0], l[1]); x.stroke();
  const F2 = (px, wt = 900) => `${wt} ${px}px "Hiragino Sans","Noto Sans JP","Noto Sans CJK JP","Yu Gothic UI",sans-serif`, used = [];
  const label = (p, t, col, top) => { x.font = F2(22); const w = x.measureText(t).width; let lx = clamp(p[0] - w / 2, 6, W - w - 6), ly = top ? p[1] - 18 : p[1] + 34; ly = clamp(ly, 26, W - 30); for (const u of used) if (Math.abs(u[1] - ly) < 26 && lx < u[0] + u[2] + 6 && u[0] < lx + w + 6) return; used.push([lx, ly, w]); x.lineWidth = 6; x.strokeStyle = '#fffaf0'; x.strokeText(t, lx, ly); x.fillStyle = col; x.fillText(t, lx, ly); };
  x.fillStyle = '#b8281a'; x.strokeStyle = '#1b120d'; x.lineWidth = 3; x.beginPath(); x.arc(l[0], l[1], 13, 0, 7); x.fill(); x.stroke(); x.fillStyle = '#1b120d'; x.fillRect(o[0] - 9, o[1] - 9, 18, 18);
  label(l, fmtD(R.d), '#b8281a', true); label(o, T.origin, '#1b120d', false);
  for (const m of MS) { const p = PX(m.p); if (p[0] < 10 || p[0] > W - 10 || p[1] < 10 || p[1] > W - 10) continue; if (m.d < hv * 0.16 && hv > 9000) continue; x.fillStyle = m.d <= R.d + 0.5 ? '#c8962a' : '#fffaf0'; x.strokeStyle = '#1b120d'; x.lineWidth = 2.5; x.beginPath(); x.arc(p[0], p[1], 8, 0, 7); x.fill(); x.stroke(); label(p, T.ms[m.k][0], '#4a3a2a', false); }
  x.font = F2(15, 700); x.fillStyle = '#1b120d99'; x.textAlign = 'right'; x.fillText(T.credit, W - 8, W - 8); x.textAlign = 'left';
}
async function makeCard(R) {
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const Fn = (px, wt = 900) => `${wt} ${px}px "Hiragino Sans","Noto Sans JP","Noto Sans CJK JP","Yu Gothic UI",sans-serif`;
  x.fillStyle = '#f6efdc'; x.fillRect(0, 0, W, H); const PH = 640; x.fillStyle = '#120b08'; x.fillRect(0, 0, W, PH);
  const src = R.shot ? await R.shot : null;
  if (src) { const im = new Image(); const ok = await new Promise(r => { im.onload = () => r(true); im.onerror = () => r(false); im.src = src; }); if (ok) { const s = Math.max(W / im.width, PH / im.height), w = im.width * s, h = im.height * s; x.save(); x.beginPath(); x.rect(0, 0, W, PH); x.clip(); x.drawImage(im, (W - w) / 2, (PH - h) * (im.height > im.width ? (R.ok ? .69 : .66) : .5), w, h); x.restore(); } }
  x.fillStyle = '#1b120d'; x.fillRect(0, PH, W, 8); x.fillStyle = '#c8962a'; x.fillRect(0, PH + 8, W, 6);
  x.save(); x.translate(250, 110); x.rotate(-.05); const lab = R.ok ? (R.sp ? T.vSp : T.vOk) : T.vNg; x.font = Fn(80); const lw = Math.min(640, x.measureText(lab).width + 70); x.fillStyle = '#1b120d'; x.fillRect(-lw / 2 + 8, -58, lw, 128); x.fillStyle = R.ok ? (R.sp ? '#4a1f5e' : '#b8281a') : '#2a2422'; x.fillRect(-lw / 2, -66, lw, 128); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(lab, 0, 0, lw - 40); x.restore();
  x.textBaseline = 'alphabetic'; x.textAlign = 'left'; const top = PH + 44;
  const wrap = (t, mw, f) => { x.font = f; const o = []; let cur = ''; const tok = /[^\x00-\xff]/.test(t) ? [...t] : t.split(' ').map((w, i, a) => i < a.length - 1 ? w + ' ' : w); for (const ch of tok) { if (x.measureText(cur + ch).width > mw && cur) { o.push(cur); cur = ch; } else cur += ch; } if (cur) o.push(cur); return o; };
  if (R.ok) {
    const MSZ = 590, mx = 40, my = top; const mc = document.createElement('canvas'); mc.width = mc.height = 600; drawMap(mc.getContext('2d'), 600, R); x.drawImage(mc, mx, my, MSZ, MSZ); x.lineWidth = 6; x.strokeStyle = '#1b120d'; x.strokeRect(mx, my, MSZ, MSZ);
    const tx = mx + MSZ + 34, tw2 = W - tx - 36; x.fillStyle = '#7a6a52'; x.font = Fn(28, 700); x.fillText(T.tReact, tx, my + 36, tw2);
    x.fillStyle = '#1b120d'; x.font = '900 92px ui-monospace,Menlo,Consolas,monospace'; x.fillText(fmtT(R.tu), tx - 4, my + 130, tw2 - 60); const wT = Math.min(tw2 - 60, x.measureText(fmtT(R.tu)).width); x.font = Fn(40); x.fillText(T.sec, tx + wT + 4, my + 130);
    x.fillStyle = '#b8281a'; x.font = Fn(110); x.fillText(fmtD(R.d), tx - 4, my + 268, tw2);
    x.fillStyle = '#33221a'; wrap(placeLine(R), tw2, Fn(40)).slice(0, 3).forEach((l, i) => x.fillText(l, tx, my + 336 + i * 54));
    x.fillStyle = '#1b120d'; x.font = Fn(64); x.fillText(T.ttl, tx, my + MSZ - 50, tw2); x.fillStyle = '#7a6a52'; x.font = '700 26px ui-monospace,Menlo,monospace'; x.fillText('nasubi-no-oniwa.com/kubi', tx, my + MSZ - 10, tw2);
  } else {
    x.fillStyle = '#1b120d'; x.font = Fn(84); x.fillText(T.drop, 50, top + 100, W - 100); x.fillStyle = '#b8281a'; wrap(R.why === 'early' ? T.whyEarly : T.whyLate, W - 100, Fn(50)).slice(0, 2).forEach((l, i) => x.fillText(l, 50, top + 190 + i * 66));
    x.fillStyle = '#33221a'; wrap(T.fail[R.tipA % T.fail.length], W - 100, Fn(34, 700)).slice(0, 5).forEach((l, i) => x.fillText(l, 50, top + 340 + i * 50));
    x.fillStyle = '#1b120d'; x.font = Fn(64); x.fillText(T.ttl, 50, H - 86); x.fillStyle = '#7a6a52'; x.font = '700 26px ui-monospace,Menlo,monospace'; x.fillText('nasubi-no-oniwa.com/kubi', 50, H - 44);
  }
  return await new Promise(r => c.toBlob(b => r(b), 'image/png'));
}
// ---------- Xに投稿（自分の紹介ツイートを引用する。引用するツイートは一覧ページ quote/ で切りかえ） ----------
let QUOTE = {};
fetch('https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/xquote/g/kubi.json').then(r => r.json()).then(d => { if (d && typeof d === 'object') QUOTE = d; }).catch(() => { });
function quoteURL() { const u = (L === 'ja' ? QUOTE.ja : QUOTE.en) || ''; return /^https:\/\/x\.com\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}$/.test(u) ? u : ''; }
const cardFile = b => new File([b], 'kubi.png', { type: 'image/png' });
function saveBlob(b, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name || 'kubi.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); }
let toastT = 0; function toast(m) { const t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 7000); }
$('xBtn').addEventListener('click', async () => {
  const R = LAST; if (!R) return; const q = quoteURL(); let b = null; try { b = await R.card; } catch (e) { }
  if (b && IS_PHONE && navigator.canShare) { const f = cardFile(b); try { if (navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: POST + (q ? '\n' + q : '') }); try { if (typeof gtag === 'function') gtag('event', 'x_share', { game: 'kubi', via: 'sheet' }); } catch (e) { } return; } } catch (e) { if (e && e.name === 'AbortError') return; } }
  let how = 0; if (b) { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]); how = 1; } catch (e) { if (!IS_PHONE) { try { saveBlob(b); how = 2; } catch (_) { } } } }
  if (how) toast(how === 1 ? T.xCopied : T.xSaved);
  const u = 'https://x.com/intent/post?text=' + encodeURIComponent(POST) + (q ? '&url=' + encodeURIComponent(q) : ''); const w = window.open(u, '_blank'); if (!w) location.href = u;
});
$('imgBtn').addEventListener('click', async () => {
  const R = LAST; if (!R) return; let b = null; try { b = await R.card; } catch (e) { } if (!b) return; const f = cardFile(b);
  try { if (IS_PHONE && navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  saveBlob(b);
});

// ---------- ランキング（otokonoji の kubi） ----------
const FB = { key: 'AIzaSyAcJgJLVbuvx85_qEGJe1WhwsOelidxeYk', db: 'https://otokonoji-default-rtdb.asia-southeast1.firebasedatabase.app' };
const NG_WORDS = ['ちんこ', 'ちんぽ', 'まんこ', 'せっくす', 'セックス', 'きんたま', 'レイプ', '死ね', 'しね', '殺す', 'ころす', 'ガイジ', 'キチガイ', 'きちがい', 'ニガー', 'チョン', '支那', 'fuck', 'shit', 'bitch', 'cunt', 'dick', 'pussy', 'nigger', 'nigga', 'faggot', 'retard', 'whore', 'slut', 'rape', 'porn', 'nazi', 'hitler'];
const badName = s => { const n = s.normalize('NFKC').toLowerCase().replace(/[\s・._\-ー〜~!！?？*＊]/g, ''); return NG_WORDS.some(w => n.includes(w.normalize('NFKC').toLowerCase())); };
async function fx(url, opt) { let err; for (let i = 0; i < 3; i++) { try { return await fetch(url, opt); } catch (e) { err = e; await new Promise(r => setTimeout(r, 500 * (i + 1))); } } throw err; }
let AUTH = null;
async function auth() {
  let a = AUTH || ls.get('kubi_auth', null); if (a && a.exp > Date.now() + 60000) return AUTH = a;
  if (a && a.refresh) { try { const r = await fx('https://securetoken.googleapis.com/v1/token?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(a.refresh) }); if (r.ok) { const j = await r.json(); a = { uid: j.user_id, token: j.id_token, refresh: j.refresh_token, exp: Date.now() + (+j.expires_in) * 1000 }; ls.set('kubi_auth', a); return AUTH = a; } } catch (_) { } }
  const r = await fx('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
  if (!r.ok) throw new Error('auth'); const j = await r.json(); a = { uid: j.localId, token: j.idToken, refresh: j.refreshToken, exp: Date.now() + (+j.expiresIn) * 1000 }; ls.set('kubi_auth', a); return AUTH = a;
}
const DB = p => FB.db + '/kubi/' + p + '.json';
const QA = a => '?auth=' + encodeURIComponent(a.token);
const PUT = (url, body) => fx(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const TSV = { '.sv': 'timestamp' };
const dayKey = ms => Math.floor((ms + 32400000) / 86400000);
async function netStart() { RUN = null; if (DEV && /[?&]nonet=1/.test(location.search)) return null; const a = await auth(); const r = await PUT(DB('run/' + a.uid) + QA(a), { st: TSV }); if (!r.ok) throw new Error('run'); const j = await r.json(); RUN = { st: j.st }; return j.st; }
async function submit(nm) {
  const R = LAST; if (!R || !R.run || !R.ok) throw new Error('norun');
  const a = await auth(), sk = R.tu;
  const rec = { n: nm, t: R.tu, sk, st: R.run.st, v: 1, at: TSV };
  const dk = dayKey(Date.now()), recD = { ...rec, dk, ds: dk * 100000 + sk };
  const get = p => fx(DB(p)).then(x => x.ok ? x.json() : null).catch(() => null);
  const [old, oldD] = await Promise.all([get('b/all/' + a.uid), get('b/d/' + a.uid)]);
  const okA = !old || sk < old.sk, okD = !oldD || oldD.dk !== dk || sk < oldD.sk;
  if (okD) { const r = await PUT(DB('b/d/' + a.uid) + QA(a), recD); if (!r.ok) throw new Error('d'); }
  if (okA) { const r = await PUT(DB('b/all/' + a.uid) + QA(a), rec); if (!r.ok) throw new Error('all'); }
  const [rd, ra] = await Promise.all([board('d'), board('all')]);
  const f = B => { const x = B.find(r => r.id === a.uid); return x ? T.place(x.rk) : T.out; };
  return T.rankRes(f(rd), f(ra), okA);
}
const realRec = x => typeof x.t === 'number' && x.t % 1 === 0 && x.t >= 1 && x.t <= LATE * 10 && x.sk === x.t;
// 0.01秒より速い人は「人間を超えた」枠としてまとめて1位。ほかの人はその次から
async function board(when) {
  const dk = dayKey(Date.now()), base = dk * 100000;
  const q = when === 'd' ? `?orderBy="ds"&startAt=${base}&endAt=${base + 99999}&limitToFirst=100` : '?orderBy="sk"&limitToFirst=100';
  const r = await fx(DB('b/' + when) + q); if (!r.ok) throw new Error('board');
  const rows = Object.entries(await r.json() || {}).map(([id, v]) => ({ id, ...v })).filter(realRec).sort((a, b) => a.sk - b.sk || a.at - b.at);
  const sp = rows.filter(x => x.sk < SUPER).length; let rk = 0, prev = null, i = 0;
  rows.forEach(x => { if (x.sk < SUPER) { x.rk = 1; x.sp = true; return; } i++; if (x.sk !== prev) { rk = i + (sp ? 1 : 0); prev = x.sk; } x.rk = rk; });
  return rows;
}
let RKS = { when: 'd', from: 'title' };
async function openRank(when, from) {
  const my = RKS = { when, from: from || RKS.from };
  $('title').hidden = true; $('result').hidden = true; $('rank').hidden = false;
  $('rkWhen').querySelectorAll('button').forEach(b => { b.className = b.dataset.w === when ? 'on' : ''; b.onclick = () => openRank(b.dataset.w); });
  const box = $('rankBox'); box.innerHTML = '<p class="note">' + T.loading + '</p>';
  try {
    const B = await board(when); if (RKS !== my) return;
    const me = (ls.get('kubi_auth', null) || {}).uid, sp = B.filter(r => r.sp), rest = B.filter(r => !r.sp);
    const row = r => `<tr${r.id === me ? ' class="me"' : ''}><td class="r">${r.rk}</td><td class="n">${esc(String(r.n))}</td><td class="c">${fmtT(r.t)}${T.sec}<small>${fmtD(distOf(r.t))}</small></td></tr>`;
    box.innerHTML = B.length ? '<table class="rk">' + (sp.length ? `<tr class="sp"><td class="r">1</td><td class="n">${esc(T.spRow(sp.length))}</td><td class="c">&lt; 0.0100${T.sec}<small>${fmtD(DMAX)}</small></td></tr>` : '') + rest.map(row).join('') + '</table>' : '<p class="note">' + T.empty + '</p>';
  } catch (e) { if (RKS === my) box.innerHTML = '<p class="note err">' + T.rankErr + '</p>'; }
}
$('rkBtn').onclick = () => openRank('d', 'title');
$('rkBtn2').onclick = () => openRank('d', 'result');
function toTitle() { $('result').hidden = true; $('rank').hidden = true; $('title').hidden = false; $('title').scrollTop = 0; resetStage(); ST = 'title'; ambient(null); }
$('toTitle').onclick = () => { sfx('tap'); toTitle(); };
$('rkBack').onclick = () => { $('rank').hidden = true; if (RKS.from === 'result' && LAST) $('result').hidden = false; else $('title').hidden = false; };
$('nm').value = ls.get('kubi_name', '');
$('recBtn').onclick = async () => {
  const nm = $('nm').value.trim(), note = $('recNote'); note.className = 'note';
  if (!nm) { note.textContent = T.needName; note.className = 'note err'; return; }
  if (badName(nm)) { note.textContent = T.badName; note.className = 'note err'; return; }
  ls.set('kubi_name', nm); $('recBtn').disabled = true; note.textContent = T.sending;
  try { note.textContent = T.recPre + await submit(nm); note.className = 'note ok'; }
  catch (e) { note.textContent = e.message === 'norun' ? T.norun : T.sendErr; note.className = 'note err'; if (e.message !== 'norun') $('recBtn').disabled = false; }
};
$('startBtn').addEventListener('click', () => start($('startBtn')));
$('again').addEventListener('click', () => start($('again')));
$('mvBtn').addEventListener('click', () => start($('mvBtn'), true));

// ---------- 起動 ----------
setLang(pickLang());
$('load').textContent = T.loading;
new GLTFLoader().load('kubi.glb', gl => {
  try { setup(gl); } catch (e) { console.error(e); $('load').textContent = T.nogl; return; }
  resetStage(); ST = 'title'; $('load').hidden = true; $('title').hidden = false; requestAnimationFrame(frame);
}, undefined, () => { $('load').textContent = T.nogl; });
if (DEV) window.__K = { get ST() { return ST; }, get LAST() { return LAST; }, CAM, F, distOf, fmtD, fmtT, board, submit, realRec, showResult, start: mv => start(null, mv), cueIn(ms) { DEVCUE = ms; }, press(r) { if (ST === 'ready') cue(); onPress({ timeStamp: tCue + r, target: null }); }, early() { onPress({ timeStamp: readyAt + 600, target: null }); }, man() { MAN = true; VT = performance.now(); lastF = VT; gsap.ticker.remove(gsap.updateRoot); }, step(ms) { VT += ms; gsap.updateRoot(VT / 1000); frame(VT); }, set(o) { Object.assign(CAM, o); }, state(s) { ST = s; }, cardURL: async () => { const b = await LAST.card; if (!b) return null; return await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(b); }); } };
