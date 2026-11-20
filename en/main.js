// 円：120秒で、跳ねるボールが円をいくつこわせるか。強化（ボールの数・速さ・攻撃力）のしかたで結果が変わる
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as S from './sim.js?v=2';
import { TX, LANGS } from './tx.js?v=2';

const $ = id => document.getElementById(id);
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch (e) { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { } } };
const GAME = 'en', GAME_URL = 'https://nasubi-no-oniwa.com/en/';
const QS = new URLSearchParams(location.search);
const OGP = QS.has('ogp'), ICON = QS.has('icon');
const PV = window.__ENPV || null; // 確認用（通信しない）
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const sm = k => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const FF = '"Hiragino Maru Gothic ProN","Rounded Mplus 1c","Noto Sans CJK JP","Noto Sans JP",system-ui,sans-serif';
const HZ = S.HZ, TICKS = S.TICKS, MODES = [30, 60, 120];
let SECS = 120, TK = TICKS; // いま遊んでいる組（30秒・60秒・120秒）
const warnOf = s => s <= 30 ? 5 : 10; // のこり何秒からあせらせるか
const BP = s => s === 120 ? 'b' : 'b' + s; // ランキングの置き場所（120秒は前からの b のまま）

// ===== ことば =====
let lang = (q => ['ja', 'en', 'zh', 'ko'].includes(q) ? q : null)(QS.get('lang')) || ls.get('en_lang', null) || (n => n.startsWith('ja') ? 'ja' : n.startsWith('zh') ? 'zh' : n.startsWith('ko') ? 'ko' : 'en')((navigator.language || 'ja').toLowerCase());
const t = (k, o) => { let s = (TX[lang] || TX.ja)[k]; if (s == null) s = TX.ja[k]; if (o) for (const [a, b] of Object.entries(o)) s = String(s).split('{' + a + '}').join(b); return s; };
const fmt = n => Math.floor(n).toLocaleString('en-US');

// ===== 音 =====
let AC = null, master = null, NB = null;
function ac() { try { if (!AC) { AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = .8; master.connect(AC.destination); } if (AC.state === 'suspended') AC.resume(); return AC; } catch (e) { return null; } }
function nbuf() { if (!NB) { NB = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = NB.getChannelData(0); for (let i = 0; i < d.length; i++)d[i] = Math.random() * 2 - 1; } return NB; }
function tone(at, f, dur, type, vol, f2) { if (!AC) return; const o = AC.createOscillator(), g = AC.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, at); if (f2) o.frequency.exponentialRampToValueAtTime(f2, at + dur); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + .01); g.gain.exponentialRampToValueAtTime(.0001, at + dur); o.connect(g); g.connect(master); o.start(at); o.stop(at + dur + .02); }
function noise(at, dur, type, f, q, vol, f2) { if (!AC) return; const s = AC.createBufferSource(); s.buffer = nbuf(); s.loop = true; const fl = AC.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, at); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, at + dur); fl.Q.value = q; const g = AC.createGain(); g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(.0001, at + dur); s.connect(fl); fl.connect(g); g.connect(master); s.start(at); s.stop(at + dur + .02); }
const PENTA = [0, 2, 4, 7, 9];
let lastHitS = 0, lastBreakS = 0;
function sHit(frac) { if (!AC) return; const n = AC.currentTime; if (n - lastHitS < .045) return; lastHitS = n; const st = PENTA[Math.floor(Math.random() * 5)] + Math.round((1 - frac) * 12); tone(n, 440 * Math.pow(2, st / 12), .09, 'triangle', .045); }
function sBreak(k) { if (!AC) return; const n = AC.currentTime; if (n - lastBreakS < .07) return; lastBreakS = n; noise(n, .32, 'bandpass', 2600, .8, .22, 500); noise(n, .18, 'highpass', 5000, .5, .1); const b = 392 * Math.pow(2, PENTA[k % 5] / 12);[1, 1.5, 2].forEach((m, i) => tone(n + i * .045, b * m, .3, 'sine', .09)); tone(n, 150, .25, 'sine', .2, 50); }
function sBuy(type) { if (!ac()) return; const n = AC.currentTime; const f = [660, 880, 550][type]; tone(n, f, .1, 'square', .05); tone(n + .07, f * 1.5, .16, 'square', .05); }
function sNo() { if (!ac()) return; tone(AC.currentTime, 160, .12, 'sawtooth', .04); }
function sTap() { if (!ac()) return; tone(AC.currentTime, 880, .08, 'sine', .05); }
function sCount(last) { if (!ac()) return; tone(AC.currentTime, last ? 1047 : 523, last ? .5 : .16, 'triangle', .1); }
function sWarn() { if (!AC) return; tone(AC.currentTime, 1320, .07, 'square', .03); }
function sFin() { if (!ac()) return; const n = AC.currentTime + .02;[523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(n + i * .08, f, .5, 'triangle', .1)); noise(n, .5, 'highpass', 4000, .5, .08); }

// ===== 絵（3D） =====
const R = new THREE.WebGLRenderer({ canvas: $('c'), antialias: true, preserveDrawingBuffer: OGP || ICON });
R.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.0;
const SC = new THREE.Scene();
{ const pm = new THREE.PMREMGenerator(R); SC.environment = pm.fromScene(new RoomEnvironment(), .04).texture; pm.dispose(); }
function bgTex() { const c = document.createElement('canvas'); c.width = 64; c.height = 512; const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#070512'); gr.addColorStop(.45, '#120c2c'); gr.addColorStop(1, '#231245'); g.fillStyle = gr; g.fillRect(0, 0, 64, 512); const x = new THREE.CanvasTexture(c); x.colorSpace = THREE.SRGBColorSpace; return x; }
SC.background = bgTex();
function dotTex(soft) { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(soft, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); }
const TEX_SOFT = dotTex(.12), TEX_DOT = dotTex(.5);
const WORLD = new THREE.Group(); SC.add(WORLD);
SC.add(new THREE.HemisphereLight(0xcfd8ff, 0x2a1850, .55));
const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(2, 6, 3); SC.add(key);
const rim = new THREE.DirectionalLight(0x9f8cff, .8); rim.position.set(-4, 3, -3); SC.add(rim);
// 遠くのぼんやりした光
const bokeh = []; { const C = [0x6c4dff, 0xff5da8, 0x3aa8ff, 0xffc23a]; for (let i = 0; i < 16; i++) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: TEX_SOFT, color: C[i % 4], transparent: true, opacity: .1, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending })); const a = i * 2.4, r = 2.6 + (i % 5) * .9; m.position.set(Math.cos(a) * r, -3.5, Math.sin(a) * r * 1.3); const s = 1.2 + (i % 4) * .7; m.scale.set(s, s, 1); m.userData = { o: .05 + (i % 3) * .035, w: .4 + (i % 5) * .17, p: i }; m.renderOrder = -5; SC.add(m); bokeh.push(m); } }
// 床の光（いまの円の色）
const glow = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), new THREE.MeshBasicMaterial({ map: TEX_SOFT, color: 0x8a5cff, transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending })); glow.rotation.x = -Math.PI / 2; glow.position.y = -.12; glow.renderOrder = -2; WORLD.add(glow);
const disc = new THREE.Mesh(new THREE.CircleGeometry(1.02, 72), new THREE.MeshBasicMaterial({ color: 0x05030d, transparent: true, opacity: .55, depthWrite: false })); disc.rotation.x = -Math.PI / 2; disc.position.y = -.08; disc.renderOrder = -1; WORLD.add(disc);

// 円（スロット0がいまの円。1〜は外側で待っている円）
const NS = 10, TB0 = .052, TBMIN = .015, TBN = 12, UPR = 1.142, GAP = .074, UTB = .0235;
const slotR = i => i === 0 ? 1 + TB0 : UPR + (i - 1) * GAP;
const RV = slotR(NS - 1) + UTB + .03; // 見せたい範囲の半径
const colOf = k => new THREE.Color().setHSL(((k * 29 + 262) % 360) / 360, 1, .52);
const geo0 = []; for (let j = 0; j < TBN; j++) { const tb = TBMIN + (TB0 - TBMIN) * j / (TBN - 1); geo0.push(new THREE.TorusGeometry(1 + tb, tb, 14, 128)); }
const rings = []; for (let i = 0; i < NS; i++) { const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .3, metalness: 0, clearcoat: 1, clearcoatRoughness: .2, emissive: 0xffffff, emissiveIntensity: .3, envMapIntensity: .45, transparent: i === NS - 1 }); const m = new THREE.Mesh(i === 0 ? geo0[TBN - 1] : new THREE.TorusGeometry(slotR(i), UTB, 10, 128), mat); m.rotation.x = Math.PI / 2; WORLD.add(m); rings.push(m); }
// ボールと、しっぽ
const MAXB = S.MAXB, TR = 6;
const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .15, metalness: 0, emissive: 0xffffff, emissiveIntensity: .9 });
const balls = new THREE.InstancedMesh(new THREE.SphereGeometry(S.BR, 18, 14), ballMat, MAXB); balls.frustumCulled = false; balls.count = 0; WORLD.add(balls);
const trails = new THREE.InstancedMesh(new THREE.SphereGeometry(S.BR * .9, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .32, depthWrite: false, blending: THREE.AdditiveBlending }), MAXB * TR); trails.frustumCulled = false; trails.count = 0; trails.renderOrder = 2; WORLD.add(trails);
const halo = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: TEX_SOFT, color: 0xffffff, transparent: true, opacity: .38, depthWrite: false, blending: THREE.AdditiveBlending }), MAXB); halo.frustumCulled = false; halo.count = 0; halo.renderOrder = 1; WORLD.add(halo);
// 破片
const SHN = 200; const shards = new THREE.InstancedMesh(new THREE.BoxGeometry(.085, .04, .04), new THREE.MeshBasicMaterial({ color: 0xffffff }), SHN); shards.frustumCulled = false; shards.instanceMatrix.setUsage(THREE.DynamicDrawUsage); WORLD.add(shards);
const SH = []; for (let i = 0; i < SHN; i++) { SH.push({ l: 0, p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler(), rv: new THREE.Vector3(), s: 1 }); shards.setColorAt(i, new THREE.Color(1, 1, 1)); } let shK = 0;
// 火花
const SPN = 320; const spPos = new Float32Array(SPN * 3).fill(-99), spVel = new Float32Array(SPN * 3), spLife = new Float32Array(SPN); let spK = 0;
const spGeo = new THREE.BufferGeometry(); spGeo.setAttribute('position', new THREE.BufferAttribute(spPos, 3));
const sparks = new THREE.Points(spGeo, new THREE.PointsMaterial({ map: TEX_DOT, color: 0xffffff, size: .075, transparent: true, opacity: .95, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true })); sparks.frustumCulled = false; sparks.renderOrder = 3; WORLD.add(sparks);
// 広がる輪
const waves = []; for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(new THREE.RingGeometry(.97, 1.07, 96), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; m.position.y = .02; m.visible = false; m.userData.l = 0; m.renderOrder = 2; WORLD.add(m); waves.push(m); } let wvK = 0;

const CAM = new THREE.PerspectiveCamera(30, 1, .1, 100);
const TILT = .3;
// カメラ：幅 W・高さ H の画面で、上 top・下 bot をあけた残りに円がおさまるようにする
function setCam(W, H, top, bot, zoom) {
  const avail = Math.max(60, H - top - bot), cy = top + avail / 2, tf = Math.tan(CAM.fov * Math.PI / 360), asp = W / H;
  const dist = Math.max(RV / (tf * asp), RV * 1.02 / (tf * avail / H)) * 1.03 / (zoom || 1);
  CAM.aspect = asp; CAM.position.set(0, dist * Math.cos(TILT), dist * Math.sin(TILT)); CAM.lookAt(0, 0, 0);
  const dy = Math.round(H / 2 - cy); if (dy) CAM.setViewOffset(W, H, 0, dy, W, H); else CAM.clearViewOffset(); CAM.updateProjectionMatrix(); CAM.updateMatrixWorld();
}

// ===== 見た目を、計算の状態に合わせる =====
const V = { k: -1, shift: 0, flash: 0, hist: [], budget: 0, shake: 0, quiet: false };
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _c = new THREE.Color();
function recolor(k) { for (let i = 0; i < NS; i++) { const c = colOf(k + i); const m = rings[i].material; m.color.copy(c); m.emissive.copy(c); m.emissiveIntensity = i === 0 ? .55 : .16; if (i > 0) { m.color.multiplyScalar(.62 - i * .03); m.emissive.multiplyScalar(.7 - i * .04); } } const c0 = colOf(k); glow.material.color.copy(c0); trails.material.color.copy(c0).lerp(_c.set(0xffffff), .35); halo.material.color.copy(c0).lerp(_c.set(0xffffff), .2); }
function viewReset(s) { V.k = s.k; V.shift = 0; V.flash = 0; V.hist = []; V.shake = 0; recolor(s.k); for (const o of SH) o.l = 0; spPos.fill(-99); spLife.fill(0); for (const w of waves) { w.visible = false; w.userData.l = 0; } for (let i = 0; i < NS; i++) { rings[i].scale.set(1, 1, 1); rings[i].material.opacity = 1; } }
function spark(x, z, vx, vz) { const i = spK++ % SPN; spPos[i * 3] = x; spPos[i * 3 + 1] = .02; spPos[i * 3 + 2] = z; spVel[i * 3] = vx; spVel[i * 3 + 1] = .4 + Math.random() * .8; spVel[i * 3 + 2] = vz; spLife[i] = .22 + Math.random() * .16; }
function onHit(s, nx, ny) {
  V.flash = Math.min(1, V.flash + .45);
  if (V.budget > 0) { V.budget--; for (let q = 0; q < 3; q++) { const a = (Math.random() - .5) * 1.6, c = Math.cos(a), sn = Math.sin(a), sp = .6 + Math.random() * 1.3; spark(nx * .99, ny * .99, -(nx * c - ny * sn) * sp, -(nx * sn + ny * c) * sp); } }
  if (!V.quiet) sHit(s.hp / s.hp0);
}
function onBreak(s, kNew) {
  const col = colOf(kNew - 1);
  for (let q = 0; q < 34; q++) { const o = SH[shK++ % SHN]; const a = q / 34 * Math.PI * 2 + Math.random() * .15, c = Math.cos(a), sn = Math.sin(a), sp = 1.2 + Math.random() * 2.6; o.l = .7 + Math.random() * .45; o.p.set(c * 1.03, 0, sn * 1.03); o.v.set(c * sp, 1.2 + Math.random() * 2.6, sn * sp); o.r.set(Math.random() * 6, Math.random() * 6, Math.random() * 6); o.rv.set((Math.random() - .5) * 14, (Math.random() - .5) * 14, (Math.random() - .5) * 14); o.s = .7 + Math.random() * .9; shards.setColorAt((shK - 1) % SHN, _c.copy(col).lerp(new THREE.Color(0xffffff), Math.random() * .3)); }
  if (shards.instanceColor) shards.instanceColor.needsUpdate = true;
  const w = waves[wvK++ % waves.length]; w.visible = true; w.userData.l = 1; w.material.color.copy(col);
  V.k = kNew; recolor(kNew); V.shift = 1; V.shake = Math.min(1, V.shake + .5); V.flash = 0;
  pxBreak(kNew, col);
  if (!V.quiet) sBreak(kNew);
}
function handleEv(s) { const ev = s.ev; for (let i = 0; i < ev.length; i += 3) { if (ev[i] < 0) onBreak(s, ev[i + 1]); else onHit(s, ev[i + 1], ev[i + 2]); } ev.length = 0; }
function viewSync(s, dt) {
  if (s.k !== V.k) { V.k = s.k; recolor(s.k); }
  // いまの円は、体力がへるほど細くなる
  const fr = clamp(s.hp / s.hp0, 0, 1); const gi = Math.round(fr * (TBN - 1)); if (rings[0].geometry !== geo0[gi]) rings[0].geometry = geo0[gi];
  V.shift = Math.max(0, V.shift - dt / .3); const e = V.shift * V.shift;
  for (let i = 0; i < NS; i++) { const sc = i < NS - 1 ? lerp(1, slotR(i + 1) / slotR(i), e) : 1; const wob = i === 0 ? 1 + V.flash * .006 : 1; rings[i].scale.set(sc * wob, sc * wob, 1); }
  rings[NS - 1].material.opacity = 1 - e;
  V.flash *= Math.exp(-dt * 10); rings[0].material.emissiveIntensity = .55 + V.flash * 1.1;
  glow.material.opacity = .3 + V.flash * .2; V.shake = Math.max(0, V.shake - dt * 3);
  // ボール
  const n = s.balls.length; balls.count = n; halo.count = n; let tk = 0;
  _q.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
  for (let i = 0; i < n; i++) {
    const b = s.balls[i]; _m.makeTranslation(b.x, 0, b.y); balls.setMatrixAt(i, _m);
    _m.compose(_p.set(b.x, -.03, b.y), _q, _s.set(.27, .27, 1)); halo.setMatrixAt(i, _m);
    const h = V.hist[i] || (V.hist[i] = []); h.unshift(b.x, b.y); if (h.length > TR * 2) h.length = TR * 2;
    for (let j = 1; j * 2 < h.length; j++) { const sc = 1 - j / (TR + 1); _m.compose(_p.set(h[j * 2], 0, h[j * 2 + 1]), _q, _s.set(sc, sc, sc)); trails.setMatrixAt(tk++, _m); }
  }
  trails.count = tk; balls.instanceMatrix.needsUpdate = true; halo.instanceMatrix.needsUpdate = true; trails.instanceMatrix.needsUpdate = true;
  // 破片
  for (let i = 0; i < SHN; i++) { const o = SH[i]; if (o.l > 0) { o.l -= dt; o.v.y -= 7.5 * dt; o.p.addScaledVector(o.v, dt); o.r.x += o.rv.x * dt; o.r.y += o.rv.y * dt; o.r.z += o.rv.z * dt; const sc = o.s * clamp(o.l * 3, 0, 1); _m.compose(o.p, _q.setFromEuler(o.r), _s.set(sc, sc, sc)); } else _m.makeScale(0, 0, 0); shards.setMatrixAt(i, _m); }
  shards.instanceMatrix.needsUpdate = true;
  // 火花
  for (let i = 0; i < SPN; i++) { if (spLife[i] > 0) { spLife[i] -= dt; spVel[i * 3 + 1] -= 4 * dt; spPos[i * 3] += spVel[i * 3] * dt; spPos[i * 3 + 1] += spVel[i * 3 + 1] * dt; spPos[i * 3 + 2] += spVel[i * 3 + 2] * dt; if (spLife[i] <= 0) spPos[i * 3 + 1] = -99; } }
  spGeo.attributes.position.needsUpdate = true;
  for (const w of waves) { if (w.userData.l > 0) { w.userData.l -= dt / .5; const k = 1 - Math.max(0, w.userData.l); const sc = 1 + k * 1.3; w.scale.set(sc, sc, 1); w.material.opacity = .7 * (1 - k) * (1 - k); if (w.userData.l <= 0) w.visible = false; } }
}

// ===== 画面のうごき =====
let mode = 'title', G = null, LOG = [], acc = 0, TIME = 0, FIN = null, RUN = null, cd = 0, cdN = 0, DEMO = null, finT = 0, lastSec = -1;
const PANELS = ['title', 'result', 'vidPanel', 'rankPanel'];
function show(id) { PANELS.forEach(p => $(p).hidden = (p !== id)); }
function big(h) { const b = $('big'); b.innerHTML = h || ''; b.className = ''; if (h) { void b.offsetWidth; b.classList.add('pop'); } }
let VW = 1, VH = 1;
function frame() {
  if (OGP || ICON) return; const land = VW > VH * 1.05;
  if (mode === 'result' || mode === 'rank' || mode === 'share') { if (land) setCam(VW, VH, 20, 20, 1); else setCam(VW, VH, 16, VH * .7, 1); }
  else if (mode === 'title') setCam(VW, VH, 0, 0, land ? 1 : 1.5);
  else setCam(VW, VH, 78, Math.min(190, VH * .27), 1);
}
// 画面の本当の大きさ（Xなどのアプリ内ブラウザでは innerHeight がずれて、円が縦にのびることがあるので、絵の箱そのものの大きさを見る）
function realSize() { const c = $('c'); const w = c.clientWidth || innerWidth, h = c.clientHeight || innerHeight; return [Math.max(1, Math.round(w)), Math.max(1, Math.round(h))]; }
function resize() { if (OGP || ICON) return; const [w, h] = realSize(); VW = w; VH = h; R.setSize(VW, VH, false); fxSize(); frame(); }
addEventListener('resize', resize); addEventListener('orientationchange', () => setTimeout(resize, 200)); try { if (window.visualViewport) visualViewport.addEventListener('resize', resize); } catch (e) { }
let sizeChk = 0; function sizeWatch(dt) { sizeChk -= dt; if (sizeChk > 0) return; sizeChk = .25; const [w, h] = realSize(); if (w !== VW || h !== VH) resize(); }

// 強化のボタン
const UPS = ['upB', 'upS', 'upA'];
function upsText(s) {
  const vals = [t('upBv', { n: s.lv[0] + 1 }), t('upSv', { n: s.lv[1] + 1 }), t('upAv', { n: fmt(S.dmgOf(s.lv[2])) })];
  UPS.forEach((id, y) => { const b = $(id), mx = s.lv[y] >= S.maxOf(y), c = S.costOf(y, s.lv[y]); const key = lang + '|' + s.lv[y]; if (b.dataset.k !== key) { b.dataset.k = key; b.innerHTML = '<b>' + esc(t(['upB', 'upS', 'upA'][y])) + '</b><u>' + esc(vals[y]) + '</u><s>' + (mx ? t('max') : fmt(c) + esc(t('coin') || '')) + '</s>'; } const can = !mx && s.coins >= c && mode === 'play'; if (b.classList.contains('can') !== can) b.classList.toggle('can', can); if (b.classList.contains('maxed') !== mx) b.classList.toggle('maxed', mx); });
}
function hudText(s) {
  const left = Math.max(0, (TK - s.tick) / HZ); $('hTime').textContent = left.toFixed(1); $('tfill').style.transform = 'scaleX(' + (left / SECS).toFixed(4) + ')'; $('hud').classList.toggle('hurry', left <= warnOf(SECS) && mode === 'play');
  gsBump(s.k); $('hRings').innerHTML = s.k + '<i>' + esc(t('unit')) + '</i>'; $('coinRow').innerHTML = fmt(s.coins) + '<i>' + esc(t('coin') || '●') + '</i>';
}
function tryBuy(y) {
  if (mode !== 'play' || !G) return; ac();
  if (S.buy(G, y)) { LOG.push([G.tick, y]); sBuy(y); const b = $(UPS[y]); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); upsText(G); hudText(G); } else sNo();
}
UPS.forEach((id, y) => { $(id).addEventListener('pointerdown', e => { e.preventDefault(); tryBuy(y); }); });
addEventListener('keydown', e => { if (e.key === '1') tryBuy(0); else if (e.key === '2') tryBuy(1); else if (e.key === '3') tryBuy(2); });

// ===== 遊ぶ =====
function startGame(secs) {
  if (MODES.includes(secs)) { SECS = secs; TK = secs * HZ; ls.set('en_mode', secs); }
  ac(); sTap(); G = S.create(); LOG = []; acc = 0; FIN = null; lastSec = -1; hudK = -1; viewReset(G); mode = 'count'; cd = 1.8; cdN = 4; show(null); $('hud').hidden = false; $('ups').hidden = false; frame(); upsText(G); hudText(G); big('');
  const run = { state: 'pending', st: 0, secs: SECS }; RUN = run; netStart(SECS).then(r => { run.state = r.state; run.st = r.st; }, () => { run.state = 'off'; });
  try { if (typeof gtag === 'function') gtag('event', 'game_start', { game: GAME, secs: SECS }); } catch (e) { }
}
function playStep(dt) {
  acc += dt; let n = Math.floor(acc * HZ); acc -= n / HZ; if (n > 6) { n = 6; acc = 0; }
  V.budget = 14;
  for (let i = 0; i < n && G.tick < TK; i++) { S.step(G); handleEv(G); }
  const sec = Math.ceil((TK - G.tick) / HZ); if (sec !== lastSec) { lastSec = sec; if (sec <= warnOf(SECS) && sec > 0) sWarn(); }
  hudText(G); upsText(G);
  if (G.tick >= TK) finish();
}
function finish() {
  const s = G; mode = 'fin'; finT = 1.5; big(esc(t('fin'))); sFin(); upsText(s);
  FIN = { secs: SECS, k: s.k, score: S.scoreOf(s), pct: Math.floor((1 - s.hp / s.hp0) * 100), lv: s.lv.slice(), dmg: S.dmgOf(s.lv[2]), log: LOG.slice(), run: RUN, sent: null };
  try { if (typeof gtag === 'function') gtag('event', 'game_end', { game: GAME, rings: s.k, secs: SECS }); } catch (e) { }
}

// ===== 結果 =====
function showResult(first) {
  const F = FIN; mode = 'result'; show('result'); $('hud').hidden = true; $('ups').hidden = true; big(''); frame();
  $('rG').textContent = t('resHead', { s: F.secs }); $('rPct').innerHTML = esc(t('resN', { n: F.k })); $('rDev').textContent = t('resNext', { p: F.pct });
  $('rFacts').textContent = t('resLv', { b: F.lv[0] + 1, s: F.lv[1] + 1, a: fmt(F.dmg) });
  recUI();
  $('xBtn').textContent = t('xpost'); $('imgBtn').textContent = t('img'); $('vidBtn').textContent = t('video'); $('againBtn').textContent = t('again'); $('topBtn').textContent = t('top'); $('rRank').textContent = t('rank');
  $('result').querySelector('.card').scrollTop = 0; if (first) gsResult(F);
  if (first) fxConfetti(clamp(F.k * 3, 20, 140));
}
function recUI() {
  const F = FIN, st = F.run ? F.run.state : 'off'; const note = $('recNote'), form = $('recForm'); note.className = 'note'; form.hidden = true;
  if (F.sent) { note.className = 'note ok'; note.innerHTML = F.sent; return; }
  if (st === 'off' || (PV && PV.off)) { note.textContent = t('recOff'); return; }
  note.textContent = t('recAsk'); form.hidden = false; $('nameIn').placeholder = t('name'); if (!$('nameIn').value) $('nameIn').value = ls.get('en_name', ''); $('recGo').textContent = t('recGo'); $('recGo').disabled = false;
}
$('recGo').onclick = async () => {
  const F = FIN; if (!F || F.sent) return; const nm = $('nameIn').value.trim().slice(0, 12); const note = $('recNote');
  if (!nm) { note.className = 'note err'; note.textContent = t('needname'); return; } if (badName(nm)) { note.className = 'note err'; note.textContent = t('badname'); return; }
  ls.set('en_name', nm); $('recGo').disabled = true; note.className = 'note'; note.textContent = t('sending');
  try { const r = await submit(F, nm); if (FIN !== F) return; F.sent = t('sent', { d: rankTxt(r.rd), a: rankTxt(r.ra) }) + (r.better ? '' : '<br>' + t('notbetter')); recUI(); }
  catch (e) { console.warn(e); if (FIN !== F) return; note.className = 'note err'; note.textContent = t('senderr'); $('recGo').disabled = false; }
};
$('againBtn').onclick = () => startGame(FIN ? FIN.secs : SECS);
$('topBtn').onclick = () => showTitle();
$('rRank').onclick = () => openRank(FIN.secs, 'd', 'fin');

// ===== タイトル =====
function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : lang; document.title = '円';
  $('tTitle').textContent = t('title'); $('tSub').textContent = t('sub'); $('tHow').innerHTML = t('how'); $('tPick').textContent = t('pick'); MODES.forEach(m => { $('m' + m).textContent = t('mBtn', { s: m }); }); $('rankBtn').textContent = t('rank');
  $('langs').innerHTML = ''; LANGS.forEach(([k, n]) => { const b = document.createElement('button'); b.textContent = n; b.className = k === lang ? 'on' : ''; b.onclick = () => { lang = k; ls.set('en_lang', k); applyLang(); }; $('langs').appendChild(b); });
  $('rankBack').textContent = t('back'); $('vShare').textContent = t('vShare'); $('vSave').textContent = t('vSave'); $('vX').textContent = t('xpost'); $('vBack').textContent = t('back');
  $('hTimeL').textContent = t('timeL'); $('hRingsL').textContent = t('ringsL');
  if (mode === 'result' && FIN) showResult(false); if (G && (mode === 'play' || mode === 'count')) { upsText(G); hudText(G); }
}
// タイトルのうしろで、勝手に遊んでいる見本
const cheapest = s => { let b = -1, bc = 1e18; for (let y = 0; y < 3; y++) { if (s.lv[y] >= S.maxOf(y)) continue; const c = S.costOf(y, s.lv[y]); if (c < bc) { bc = c; b = y; } } return s.coins >= bc ? b : -1; };
function demoNew(pre) { DEMO = S.create(); for (let i = 0; i < pre; i++) { const y = cheapest(DEMO); if (y >= 0) S.buy(DEMO, y); S.step(DEMO); DEMO.ev.length = 0; } viewReset(DEMO); }
function demoStep(dt) { if (!DEMO || DEMO.tick >= TICKS) demoNew(HZ * 20); acc += dt; let n = Math.floor(acc * HZ); acc -= n / HZ; if (n > 6) { n = 6; acc = 0; } V.budget = 10; V.quiet = true; for (let i = 0; i < n; i++) { const y = cheapest(DEMO); if (y >= 0) S.buy(DEMO, y); S.step(DEMO); handleEv(DEMO); } V.quiet = false; }
function showTitle() { mode = 'title'; show('title'); $('hud').hidden = true; $('ups').hidden = true; big(''); fxReset(); G = null; demoNew(HZ * (18 + Math.floor(Math.random() * 30))); acc = 0; frame(); gsTitle(); }
MODES.forEach(m => { $('m' + m).onclick = () => startGame(m); });
$('rankBtn').onclick = () => openRank(+ls.get('en_mode', 120), 'd', 'title');

// ===== ドット絵の演出（道具箱の pixelfx。MIT） =====
// 円がこわれるたびに、ふちから光がはじける。10個ごとに真ん中でプラズマ爆発。読みこめなくてもゲームはそのまま動く
const PX = { ok: false, core: null, mods: {}, list: [], frame: null, img: null, cv: document.createElement('canvas'), g: null, s: 3, w: 0, h: 0, vw: innerWidth, vh: innerHeight };
PX.g = PX.cv.getContext('2d');
if (!OGP && !ICON) Promise.all([import('./pixelfx/core/index.js'), import('./pixelfx/fx/pickups/collect-burst.js'), import('./pixelfx/fx/explosions/plasma-explosion.js')]).then(([c, a, b]) => { PX.core = c; PX.mods.burst = a; PX.mods.plasma = b; PX.ok = true; }).catch(() => { });
function pxView(W, Hh) { PX.vw = W; PX.vh = Hh; PX.s = Math.max(2, Math.round(Math.min(W, Hh) / 130)); }
function pxPal(col, n) { const out = [], dark = new THREE.Color(0x0a0620), wh = new THREE.Color(0xffffff), c = new THREE.Color(); for (let i = 0; i < n; i++) { const k = i / (n - 1); if (k < .6) c.copy(dark).lerp(col, k / .6); else c.copy(col).lerp(wh, (k - .6) / .4); out.push('#' + c.getHexString()); } return out; }
function pxSpawn(name, sx, sy, col) { if (!PX.ok || PX.list.length >= 14) return; try { PX.list.push(PX.core.createFx(PX.mods[name], { x: Math.round(sx / PX.s), y: Math.round(sy / PX.s), palette: pxPal(col, name === 'burst' ? 8 : 7), seed: (Math.random() * 1e6) | 0 })); } catch (e) { } }
function pxBreak(kNew, col) {
  if (!PX.ok) return; const W = PX.vw, Hh = PX.vh;
  const a0 = Math.random() * Math.PI * 2; for (let q = 0; q < 3; q++) { const a = a0 + q * 2.09 + (Math.random() - .5) * .6; const p = proj(Math.cos(a), 0, Math.sin(a), W, Hh); pxSpawn('burst', p[0], p[1] + 40 * PX.s, col); }
  if (kNew > 0 && kNew % 10 === 0) { const p = proj(0, 0, 0, W, Hh); pxSpawn('plasma', p[0], p[1], col); }
}
function pxReset() { PX.list.length = 0; }
function pxStep(dt) { if (!PX.list.length) return; for (const f of PX.list) f.update(dt); PX.list = PX.list.filter(f => !f.done()); }
function pxDraw(g2, W, Hh) {
  if (!PX.ok || !PX.list.length) return; const w = Math.ceil(W / PX.s), h = Math.ceil(Hh / PX.s);
  if (!PX.frame || PX.w !== w || PX.h !== h) { PX.w = w; PX.h = h; PX.frame = PX.core.createFrame(w, h); PX.img = new ImageData(w, h); PX.cv.width = w; PX.cv.height = h; }
  PX.core.clearFrame(PX.frame); for (const f of PX.list) f.draw(PX.frame); PX.core.composite(PX.frame, PX.img.data, null); PX.g.putImageData(PX.img, 0, 0);
  g2.save(); g2.imageSmoothingEnabled = false; g2.globalCompositeOperation = 'lighter'; g2.drawImage(PX.cv, 0, 0, w * PX.s, h * PX.s); g2.restore();
}

// ===== 画面の動き（道具箱の GSAP。読みこめないときは動きなしで出す） =====
const GS = () => window.gsap || null;
let hudK = -1;
function gsBump(k) { const g = GS(); if (!g || k === hudK) { hudK = k; return; } const first = hudK < 0; hudK = k; if (first) return; g.fromTo($('hRings'), { scale: 1.45 }, { scale: 1, duration: .35, ease: 'back.out(3)', overwrite: true }); }
function gsTitle() { const g = GS(); if (!g) return; g.fromTo($('tTitle'), { scale: .3, rotation: -12 }, { scale: 1, rotation: 0, duration: .9, ease: 'elastic.out(1,.45)', overwrite: true }); g.fromTo('#title .modes button', { y: 26, scale: .85 }, { y: 0, scale: 1, duration: .5, ease: 'back.out(2.2)', stagger: .07, delay: .15, overwrite: true }); }
function gsResult(F) {
  const g = GS(); if (!g) return; const card = $('result').querySelector('.card');
  g.fromTo(card, { y: 70 }, { y: 0, duration: .55, ease: 'back.out(1.6)', overwrite: true });
  const o = { n: 0 }; g.to(o, { n: F.k, duration: Math.min(1.6, .5 + F.k * .02), ease: 'power3.out', delay: .15, onUpdate: () => { $('rPct').innerHTML = esc(t('resN', { n: Math.round(o.n) })); }, onComplete: () => { $('rPct').innerHTML = esc(t('resN', { n: F.k })); g.fromTo($('rPct'), { scale: 1.25 }, { scale: 1, duration: .5, ease: 'elastic.out(1,.4)' }); } });
  g.fromTo(['#rDev', '#rFacts'], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .4, stagger: .1, delay: .35, ease: 'power2.out', overwrite: true });
}

// ===== 効果（紙ふぶき・真ん中の数字） =====
const FXC = $('fx'), fxg = FXC.getContext('2d'); let fxW = 0, fxH = 0;
const FX = { conf: [] };
function fxSize() { const d = Math.min(2, window.devicePixelRatio || 1); fxW = VW > 1 ? VW : innerWidth; fxH = VH > 1 ? VH : innerHeight; FXC.width = fxW * d; FXC.height = fxH * d; fxg.setTransform(d, 0, 0, d, 0, 0); }
function fxReset() { FX.conf = []; pxReset(); }
function fxConfetti(n) { const C = ['#ffd23a', '#ff5d73', '#b46cff', '#3fd28b', '#4aa8ff', '#ffffff', '#ff9f1c']; for (let i = 0; i < n; i++)FX.conf.push({ x: .5 + (Math.random() - .5) * .3, y: .2, vx: (Math.random() - .5) * 1.1, vy: -.5 - Math.random() * .9, r: Math.random() * 6.28, vr: (Math.random() - .5) * 12, c: C[i % C.length], s: 5 + Math.random() * 6, l: 2.2 + Math.random() * 1.2 }); }
function fxStep(dt) { for (const c of FX.conf) { c.vy += 1.5 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.r += c.vr * dt; c.l -= dt; } FX.conf = FX.conf.filter(c => c.l > 0 && c.y < 1.2); }
function drawFX(g2, W, Hh) { for (const c of FX.conf) { g2.save(); g2.translate(c.x * W, c.y * Hh); g2.rotate(c.r); g2.fillStyle = c.c; g2.globalAlpha = Math.min(1, c.l); g2.fillRect(-c.s / 2, -c.s / 3, c.s, c.s * .66); g2.restore(); } }
const _v = new THREE.Vector3();
function proj(x, y, z, W, Hh) { _v.set(x, y, z); _v.project(CAM); return [(_v.x * .5 + .5) * W, (-_v.y * .5 + .5) * Hh]; }
// いまの円の残りの体力を、円の真ん中に出す
function drawHP(g2, W, Hh, s) {
  const c = proj(0, 0, 0, W, Hh), e = proj(1, 0, 0, W, Hh); const rad = Math.abs(e[0] - c[0]); const txt = fmt(Math.max(0, s.hp)); let z = rad * .5; g2.save(); g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.font = '900 ' + z + 'px ' + FF; const w = g2.measureText(txt).width; if (w > rad * 1.25) { z *= rad * 1.25 / w; g2.font = '900 ' + z + 'px ' + FF; }
  g2.globalAlpha = .78 + V.flash * .2; g2.lineJoin = 'round'; g2.lineWidth = Math.max(2, z * .09); g2.strokeStyle = 'rgba(8,4,24,.8)'; g2.strokeText(txt, c[0], c[1]); g2.fillStyle = '#' + _c.copy(colOf(s.k)).lerp(new THREE.Color(0xffffff), .72).getHexString(); g2.fillText(txt, c[0], c[1]); g2.restore();
}

// ===== Xへの投稿 =====
function postText() { const F = FIN; if (!F) return ''; return t('post', { n: F.k, s: F.secs }) + '\n' + t('tags'); }
function shareURL() { return GAME_URL; }
let QUOTE = {}; if (!PV) fetch('https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/xquote/g/' + GAME + '.json').then(r => r.json()).then(d => { if (d && typeof d === 'object') QUOTE = d; }).catch(() => { });
function quoteURL() { const u = (lang === 'ja' ? QUOTE.ja : QUOTE.en) || ''; return /^https:\/\/x\.com\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}$/.test(u) ? u : ''; }
function xIntent(text, url) { const q = quoteURL(); return 'https://x.com/intent/post?text=' + encodeURIComponent(q ? text + '\n' + url : text) + '&url=' + encodeURIComponent(q || url); }
const openXWith = (text, url) => { const u = xIntent(text, url); const w = window.open(u, '_blank'); if (!w) location.href = u; };
const openX = () => openXWith(postText(), shareURL());
$('xBtn').onclick = openX; $('vX').onclick = openX;

// ===== 結果の画像と動画 =====
function fitF(g2, s, z, wt, maxW) { g2.font = wt + ' ' + z + 'px ' + FF; while (g2.measureText(s).width > maxW && z > 12) { z -= 2; g2.font = wt + ' ' + z + 'px ' + FF; } }
function txt2(g2, s, x, y) { g2.strokeText(s, x, y); g2.fillText(s, x, y); }
function drawCard(g2, W, Hh, F, a, top) {
  const u = W / 540; g2.save(); g2.globalAlpha = a; g2.textAlign = 'center'; g2.textBaseline = 'alphabetic'; g2.lineJoin = 'round'; g2.strokeStyle = '#000d'; g2.lineWidth = 8 * u;
  const gr = g2.createLinearGradient(0, top - 50 * u, 0, Hh); gr.addColorStop(0, 'rgba(8,5,20,0)'); gr.addColorStop(.22, 'rgba(8,5,20,.82)'); gr.addColorStop(1, 'rgba(8,5,20,.94)'); g2.fillStyle = gr; g2.fillRect(0, top - 50 * u, W, Hh - top + 50 * u);
  let y = top + 36 * u; g2.fillStyle = '#e7dcff'; fitF(g2, t('resHead', { s: F.secs }), 28 * u, 900, W - 40 * u); txt2(g2, t('resHead', { s: F.secs }), W / 2, y); y += 118 * u;
  g2.fillStyle = '#ffd23a'; g2.lineWidth = 12 * u; fitF(g2, t('resN', { n: F.k }), 124 * u, 900, W - 40 * u); txt2(g2, t('resN', { n: F.k }), W / 2, y); y += 52 * u; g2.lineWidth = 8 * u;
  g2.fillStyle = '#ffffff'; fitF(g2, t('resNext', { p: F.pct }), 28 * u, 900, W - 40 * u); txt2(g2, t('resNext', { p: F.pct }), W / 2, y); y += 40 * u;
  const l4 = t('resLv', { b: F.lv[0] + 1, s: F.lv[1] + 1, a: fmt(F.dmg) }); g2.fillStyle = '#c9d0e0'; fitF(g2, l4, 22 * u, 800, W - 40 * u); txt2(g2, l4, W / 2, y);
  g2.restore();
}
function drawBrand(g2, W, Hh) { const u = W / 540; g2.save(); g2.textAlign = 'center'; g2.lineJoin = 'round'; g2.lineWidth = 8 * u; g2.strokeStyle = '#000c'; g2.fillStyle = '#fff'; g2.font = '900 ' + 54 * u + 'px ' + FF; txt2(g2, '円', W / 2, 70 * u); g2.lineWidth = 6 * u; g2.fillStyle = '#fffc'; g2.font = '700 ' + 20 * u + 'px system-ui,sans-serif'; txt2(g2, GAME_URL.replace('https://', ''), W / 2, Hh - 22 * u); g2.restore(); }
function restoreView() { R.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); R.setSize(VW, VH, false); frame(); }
let vidBusy = false, vidExt = 'mp4';
$('imgBtn').onclick = () => { if (!FIN || vidBusy) return; makeImage(); };
$('vidBtn').onclick = () => { if (!vidBusy && FIN) makeVideo(); };
$('vBack').onclick = () => { showResult(false); };
function makeImage() {
  const F = FIN, W = 1080, Hh = 1350; const c = document.createElement('canvas'); c.width = W; c.height = Hh; const g2 = c.getContext('2d');
  R.setPixelRatio(1); R.setSize(W, Hh, false); setCam(W, Hh, 150, Hh * .41, 1.22); viewSync(G, 0); R.render(SC, CAM); g2.drawImage(R.domElement, 0, 0, W, Hh); drawHP(g2, W, Hh, G); drawBrand(g2, W, Hh); drawCard(g2, W, Hh, F, 1, Hh * .6);
  c.toBlob(b => { shareDone(b, 'png'); }, 'image/png');
}
async function makeVideo() {
  vidBusy = true; const W = 540, Hh = 960; const vc = document.createElement('canvas'); vc.width = W; vc.height = Hh;
  if (!vc.captureStream || !window.MediaRecorder) { shareDone(null, 'mp4'); return; }
  const F = FIN; show(null); mode = 'video'; $('recBadge').hidden = false; $('recBadge').textContent = '● ' + t('making');
  const g2 = vc.getContext('2d'); ac(); let dest = null; try { dest = AC.createMediaStreamDestination(); master.connect(dest); } catch (e) { }
  const stream2 = vc.captureStream(30); if (dest) dest.stream.getAudioTracks().forEach(tr => stream2.addTrack(tr));
  const types = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4;codecs=avc3,mp4a.40.2', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  const mime = types.find(x => { try { return MediaRecorder.isTypeSupported(x) } catch (e) { return false } }) || ''; vidExt = mime.includes('mp4') ? 'mp4' : 'webm';
  let rec; const restore0 = () => { try { if (dest) master.disconnect(dest); } catch (_) { } $('recBadge').hidden = true; };
  try { rec = new MediaRecorder(stream2, mime ? { mimeType: mime, videoBitsPerSecond: 4e6 } : {}); } catch (e) { restore0(); shareDone(null, 'mp4'); return; }
  const chunks = []; rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); }; const stopped = new Promise(r => { rec.onstop = r; }); rec.start(200);
  // 強化の記録どおりに、最初から早送りで再生する
  /* どの組も12秒ほどの動画になる */ const VT = F.secs * HZ, SPEED = F.secs / 12, s = S.create(); let j = 0, a2 = 0, endAt = -1, T = 0, last = performance.now(); viewReset(s); fxReset();
  R.setPixelRatio(1); R.setSize(W, Hh, false); setCam(W, Hh, 150, 150, 1);
  const CARD = 3.4;
  await new Promise(res => {
    function step(now) {
      const real = Math.min(.3, (now - last) / 1000), dt = Math.min(.05, real); last = now; T += real; TIME += dt; pxView(W, Hh);
      if (endAt < 0) {
        a2 += real * SPEED; let n = Math.floor(a2 * HZ); a2 -= n / HZ; if (n > 200) n = 200; V.budget = 14; // おそい端末でも、動画の長さが同じになるようにする
        for (let q = 0; q < n && s.tick < VT; q++) { while (j < F.log.length && F.log[j][0] === s.tick) { S.buy(s, F.log[j][1]); j++; } S.step(s); handleEv(s); }
        if (s.tick >= VT) { endAt = T; sFin(); fxConfetti(clamp(F.k * 3, 20, 140)); setCam(W, Hh, 110, Hh * .42, 1); }
      }
      viewSync(s, dt); fxStep(dt); pxStep(dt); R.render(SC, CAM); g2.clearRect(0, 0, W, Hh); g2.drawImage(R.domElement, 0, 0, W, Hh); drawHP(g2, W, Hh, s); pxDraw(g2, W, Hh);
      if (endAt >= 0) drawCard(g2, W, Hh, F, sm((T - endAt - .3) / .4), Hh * .6);
      else {
        g2.save(); g2.lineJoin = 'round'; g2.strokeStyle = '#000c'; const left = Math.max(0, (VT - s.tick) / HZ);
        g2.fillStyle = '#ffffff22'; g2.fillRect(20, 96, W - 40, 8); const gr = g2.createLinearGradient(20, 0, W - 20, 0); gr.addColorStop(0, '#ffd23a'); gr.addColorStop(.5, '#ff7ad9'); gr.addColorStop(1, '#7b6cff'); g2.fillStyle = gr; g2.fillRect(20, 96, (W - 40) * left / F.secs, 8);
        g2.lineWidth = 6; g2.textAlign = 'left'; g2.fillStyle = '#fff'; g2.font = '900 30px ' + FF; txt2(g2, left.toFixed(1), 20, 140); g2.textAlign = 'right'; g2.fillStyle = '#ffd23a'; g2.font = '900 40px ' + FF; txt2(g2, s.k + t('unit'), W - 20, 146);
        g2.textAlign = 'center'; g2.fillStyle = '#ffd23a'; g2.font = '900 24px ' + FF; txt2(g2, t('vHow', { s: F.secs }) + '（' + t('vSpeed', { n: SPEED }) + '）', W / 2, Hh - 108);
        g2.fillStyle = '#e7dcff'; fitF(g2, t('resLv', { b: s.lv[0] + 1, s: s.lv[1] + 1, a: fmt(S.dmgOf(s.lv[2])) }), 22, 900, W - 40); txt2(g2, t('resLv', { b: s.lv[0] + 1, s: s.lv[1] + 1, a: fmt(S.dmgOf(s.lv[2])) }), W / 2, Hh - 70); g2.restore();
      }
      drawFX(g2, W, Hh); drawBrand(g2, W, Hh);
      if (endAt >= 0 && T >= endAt + CARD) res(); else requestAnimationFrame(step);
    } requestAnimationFrame(step);
  });
  rec.stop(); await stopped; restore0(); shareDone(new Blob(chunks, { type: (mime || 'video/webm').split(';')[0] }), vidExt);
}
function shareDone(blob, ext) {
  vidBusy = false; mode = 'share'; show('vidPanel'); const isImg = ext === 'png'; $('vidPrev').hidden = true; $('imgPrev').hidden = true; const F = FIN; if (G) viewReset(G); restoreView();
  if (!blob || !blob.size) { $('vMsg').textContent = t('vfail'); $('vShare').hidden = $('vSave').hidden = true; return; }
  const url = URL.createObjectURL(blob); if (isImg) { $('imgPrev').hidden = false; $('imgPrev').src = url; } else { $('vidPrev').hidden = false; $('vidPrev').src = url; $('vidPrev').play().catch(() => { }); }
  const nm = GAME + '_' + F.secs + 's_' + F.k + '.' + ext; const file = new File([blob], nm, { type: blob.type }); const canShare = !!(navigator.canShare && navigator.canShare({ files: [file] }));
  $('vShare').hidden = !canShare; $('vSave').hidden = false; $('vMsg').textContent = canShare ? t(isImg ? 'imade' : 'vmade') : t(isImg ? 'ihint' : 'shareHint');
  $('vShare').onclick = async () => { try { await navigator.share({ files: [file], text: postText() + '\n' + shareURL() + (quoteURL() ? '\n' + quoteURL() : '') }); } catch (e) { } };
  $('vSave').onclick = () => { const a = document.createElement('a'); a.href = url; a.download = nm; document.body.appendChild(a); a.click(); a.remove(); };
}

// ===== 通信（Firebase：ft-red の en の下） =====
const FB = { apiKey: 'AIzaSyBCzVyblBmfNQq4XdPHdQppE94gyiYxDkA', databaseURL: (PV && PV.db) || 'https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app', auth: (PV && PV.auth) || null };
const NG = ['ちんこ', 'ちんぽ', 'まんこ', 'せっくす', 'セックス', 'きんたま', 'レイプ', '死ね', 'しね', '殺す', 'ころす', 'ガイジ', 'キチガイ', 'きちがい', 'ニガー', 'チョン', '支那', 'fuck', 'shit', 'bitch', 'cunt', 'dick', 'pussy', 'nigger', 'nigga', 'faggot', 'retard', 'whore', 'slut', 'rape', 'porn', 'nazi', 'hitler', '씨발', '시발', '병신', '좆', '肏', '屄', '屌', '幹你', '操你', '婊子'];
const badName = s => { const n = s.normalize('NFKC').toLowerCase().replace(/[\s・._\-ー〜~!！?？*＊]/g, ''); return NG.some(w => n.includes(w.normalize('NFKC').toLowerCase())); };
async function fetchR(url, opt) { let err; for (let i = 0; i < 3; i++) { try { return await fetch(url, opt); } catch (e) { err = e; await new Promise(r => setTimeout(r, 500 * (i + 1))); } } throw err; }
const NONET = !!(PV && !PV.db);
let AUTH = null, authP = null;
function fbAuth() { if (NONET) return Promise.reject(new Error('pv')); if (AUTH && AUTH.exp > Date.now() + 60000) return Promise.resolve(AUTH); if (!authP) authP = fbAuth0().then(a => { AUTH = a; authP = null; return a; }, e => { authP = null; throw e; }); return authP; }
async function fbAuth0() {
  let a = AUTH || ls.get('en_auth', null); if (a && a.exp > Date.now() + 60000) return a;
  const idURL = FB.auth ? FB.auth + '/identitytoolkit.googleapis.com/v1/accounts:signUp?key=x' : 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FB.apiKey;
  const tkURL = FB.auth ? FB.auth + '/securetoken.googleapis.com/v1/token?key=x' : 'https://securetoken.googleapis.com/v1/token?key=' + FB.apiKey;
  if (a && a.refresh) { try { const r = await fetchR(tkURL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(a.refresh) }); if (r.ok) { const j = await r.json(); a = { uid: j.user_id, token: j.id_token, refresh: j.refresh_token, exp: Date.now() + (+j.expires_in) * 1000 }; ls.set('en_auth', a); return a; } } catch (_) { } }
  const r = await fetchR(idURL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
  if (!r.ok) throw new Error('auth'); const j = await r.json(); a = { uid: j.localId, token: j.idToken, refresh: j.refreshToken, exp: Date.now() + (+j.expiresIn) * 1000 }; ls.set('en_auth', a); return a;
}
const NSQ = (PV && PV.ns) ? '&ns=' + PV.ns : '';
const DB = p => FB.databaseURL + '/en/' + p;
const QA = a => '.json?auth=' + encodeURIComponent(a.token) + NSQ;
const QP = q => '.json?' + (q || '') + NSQ;
const PUT = (url, body) => fetchR(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const TS = { '.sv': 'timestamp' };
// 遊びはじめたとき：はじめた時刻をサーバーに書く（120秒たたないと記録できないようにするため）
async function netStart(secs) {
  if (NONET) return { state: PV.off ? 'off' : 'yes', st: Date.now() };
  const a = await fbAuth(); const r2 = await PUT(DB('run/' + a.uid) + QA(a), { st: TS, m: secs }); if (!r2.ok) throw new Error('run ' + r2.status); const j = await r2.json().catch(() => null); let st = j && j.st; if (typeof st !== 'number') { const s = await fetchR(DB('run/' + a.uid) + QA(a)).then(x => x.json()); st = s.st; }
  return { state: 'yes', st };
}
const dayKey = ms => Math.floor((ms + 32400000) / 86400000);
const TOPN = 100;
async function submit(F, nm) {
  if (NONET) return { rd: 3, ra: 12, better: true };
  if (!F.run || F.run.state !== 'yes') throw new Error('norun');
  const a = await fbAuth(); const rec = { n: nm, k: F.score, lg: S.encLog(F.log), st: F.run.st, v: 1, at: TS };
  const dk = dayKey(Date.now()); const recD = { ...rec, dk, ds: dk * 1000 + rec.k };
  const [old, oldD] = await Promise.all([fetchR(DB(BP(F.secs) + '/all/' + a.uid) + QP()).then(x => x.ok ? x.json() : null).catch(() => null), fetchR(DB(BP(F.secs) + '/d/' + a.uid) + QP()).then(x => x.ok ? x.json() : null).catch(() => null)]);
  const okA = !old || !(old.k >= rec.k), okD = !oldD || oldD.dk !== dk || !(oldD.k >= rec.k);
  if (okD) { const r = await PUT(DB(BP(F.secs) + '/d/' + a.uid) + QA(a), recD); if (!r.ok) throw new Error('d ' + r.status); }
  if (okA) { const r = await PUT(DB(BP(F.secs) + '/all/' + a.uid) + QA(a), rec); if (!r.ok) throw new Error('all ' + r.status); }
  const [rd, ra] = await Promise.all([myRank(F.secs, 'd', a.uid), myRank(F.secs, 'all', a.uid)]); return { rd, ra, better: okA };
}
// 記録が本当か：強化の記録どおりに計算しなおして、合わない記録は出さない
function checkRow(r, secs) {
  if (!r || typeof r.k !== 'number' || typeof r.lg !== 'string' || typeof r.n !== 'string') return null; const L = S.decLog(r.lg, secs * HZ); if (!L) return null;
  const s = S.replayAll(L, secs * HZ); if (!s) return null; if (Math.abs(S.scoreOf(s) - r.k) > 1e-9) return null;
  r.rings = s.k; r.pct = Math.floor((1 - s.hp / s.hp0) * 100); return r;
}
async function loadBoard(secs, when) {
  const today = dayKey(Date.now()); let url;
  if (when === 'd') url = DB(BP(secs) + '/d') + QP('orderBy=%22ds%22&startAt=' + (today * 1000) + '&endAt=' + (today * 1000 + 999.9999) + '&limitToLast=' + TOPN);
  else url = DB(BP(secs) + '/all') + QP('orderBy=%22k%22&limitToLast=' + TOPN);
  const [d, h] = await Promise.all([fetch(url).then(r => { if (!r.ok) throw 0; return r.json() }), fetch(DB('hidden') + QP()).then(r => r.ok ? r.json() : null).catch(() => null)]);
  const rows = Object.entries(d || {}).map(([id, v]) => ({ ...v, id })).filter(r => !(h && h[r.id])).map(r => checkRow(r, secs)).filter(Boolean).sort((a, b) => b.k - a.k || a.at - b.at);
  rows.forEach((r, i) => { r.rk = i + 1; }); return rows;
}
const rankTxt = r => r ? t('rankN', { r }) : t('rankOut');
async function myRank(secs, when, uid) { try { const rows = await loadBoard(secs, when); const r = rows.find(x => x.id === uid); return r ? r.rk : null; } catch (e) { return null; } }
let RK = { secs: 120, when: 'd', from: null, rows: [] };
async function openRank(secs, when, from) {
  if (!MODES.includes(secs)) secs = 120; const my = RK = { secs, when, from: from || RK.from, rows: [] }; if (RK.from === 'fin') mode = 'rank'; show('rankPanel'); $('hud').hidden = true; $('ups').hidden = true; big('');
  $('rkTitle').textContent = t('rank'); $('rkNote').textContent = t('rkNote');
  $('rkWhen').querySelectorAll('button').forEach(b => { const w = b.dataset.w; b.textContent = t(w === 'd' ? 'today' : 'alltime'); b.className = w === when ? 'on' : ''; b.onclick = () => openRank(RK.secs, w, RK.from); });
  $('rkMode').querySelectorAll('button').forEach(b => { const m = +b.dataset.m; b.textContent = t('mBtn', { s: m }); b.className = m === secs ? 'on' : ''; b.onclick = () => openRank(m, RK.when, RK.from); });
  const box = $('rankBox'); box.innerHTML = '<p>' + t('loading') + '</p>';
  const rowH = (r, me) => '<tr' + (me ? ' class="me"' : '') + '><td class="r">' + r.rk + '</td><td class="n">' + esc(r.n) + '</td><td class="c">' + esc(t('rowS', { n: r.rings, p: r.pct })) + '</td></tr>';
  try {
    let rows; if (NONET) { rows = [{ n: '円こわし名人', rings: 72, pct: 31, rk: 1 }, { n: ls.get('en_name', 'なすび'), rings: 64, pct: 80, rk: 2, me: 1 }, { n: 'のんびり', rings: 41, pct: 5, rk: 3 }]; } else rows = await loadBoard(secs, when);
    if (RK !== my) return; RK.rows = rows; const myId = (ls.get('en_auth', null) || {}).uid; let h = '<table class="rank">' + rows.slice(0, TOPN).map(r => rowH(r, r.me || (!!myId && r.id === myId))).join(''); if (!rows.length) h += '<tr><td></td><td colspan="2">' + t('empty') + '</td></tr>'; box.innerHTML = h + '</table>';
  } catch (e) { if (RK === my) box.innerHTML = '<p>' + t('rankerr') + '</p>'; }
}
$('rankBack').onclick = () => { if (RK.from === 'fin' && FIN) showResult(false); else showTitle(); };

// ===== まわす =====
let last = performance.now();
const cv = $('c');
function frameStep(dt) {
  TIME += dt; sizeWatch(dt); pxView(fxW || innerWidth, fxH || innerHeight);
  for (const s of bokeh) s.material.opacity = s.userData.o * (.75 + .25 * Math.sin(TIME * s.userData.w + s.userData.p));
  let st = G;
  if (mode === 'title' || (!G && DEMO)) { if (mode === 'title') demoStep(dt); st = DEMO; }
  else if (mode === 'count') { cd -= dt; const n = Math.ceil(cd / .6); if (n !== cdN) { cdN = n; if (n > 0) { big(String(n)); sCount(false); } else { big(esc(t('go'))); sCount(true); mode = 'play'; acc = 0; setTimeout(() => { if (mode === 'play') big(''); }, 600); } } }
  else if (mode === 'play') playStep(dt);
  else if (mode === 'fin') { finT -= dt; if (finT <= 0) showResult(true); }
  if (st) viewSync(st, dt);
  fxStep(dt); pxStep(dt);
  const sh = V.shake; cv.style.transform = sh > .01 && mode !== 'title' ? 'translate(' + ((Math.random() - .5) * 9 * sh) + 'px,' + ((Math.random() - .5) * 9 * sh) + 'px)' : '';
  R.render(SC, CAM);
  fxg.clearRect(0, 0, fxW, fxH); if (st && mode !== 'title' && mode !== 'rank' && mode !== 'share') drawHP(fxg, fxW, fxH, st); if (mode !== 'rank' && mode !== 'share') pxDraw(fxg, fxW, fxH); drawFX(fxg, fxW, fxH);
}
function loop(now) {
  requestAnimationFrame(loop); const dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = now; if (mode === 'video') return; if (PV && PV.manual) return;
  frameStep(dt);
}

// ===== はじめ =====
applyLang();
if (OGP || ICON) {
  const W = OGP ? 1200 : 512, Hh = OGP ? 630 : 512; if (OGP) { document.body.style.width = '1200px'; document.body.style.height = '630px'; if (!QS.get('lang')) lang = 'ja'; }
  R.setPixelRatio(1); R.setSize(W, Hh, false); demoNew(HZ * 46); V.budget = 40; V.quiet = true; for (let i = 0; i < 8; i++) { S.step(DEMO); handleEv(DEMO); viewSync(DEMO, 1 / 60); } V.flash = .5; viewSync(DEMO, 0);
  if (OGP) { setCam(W, Hh, 20, 20, 1); CAM.setViewOffset(W, Hh, -270, 0, W, Hh); CAM.updateProjectionMatrix(); const T = $('ogpT'); T.hidden = false; T.innerHTML = '<b>円</b><i>' + esc(t('ogp2')) + '</i><u>' + esc(t('ogp3')) + '</u>'; }
  else setCam(W, Hh, 0, 0, 1.45);
  R.render(SC, CAM); window.__ready = 1;
} else {
  resize(); showTitle(); requestAnimationFrame(loop);
}
window.__EN = { S, get mode() { return mode }, get G() { return G }, get FIN() { return FIN }, get RUN() { return RUN }, get RK() { return RK }, get LOG() { return LOG }, get V() { return V }, tick: frameStep, startGame, showTitle, showResult, openRank, loadBoard, makeImage, makeVideo, buy: tryBuy, frame,
  // 試験用：n コマすすめる（強化はいちばん安いものを買う）
  adv(n, auto) { if (mode === 'count') { mode = 'play'; big(''); } for (let i = 0; i < n && G && G.tick < TK; i++) { if (auto) { const y = cheapest(G); if (y >= 0 && S.buy(G, y)) LOG.push([G.tick, y]); } S.step(G); G.ev.length = 0; } if (G) { viewReset(G); hudText(G); upsText(G); if (G.tick >= TK && mode === 'play') finish(); } }, get SECS() { return SECS } };
