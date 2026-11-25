import { THREE } from './lib.js?v=11260040';
import { COLORS, CHARS, ORDER } from './data.js?v=11260040';
import { WAZA, desc, unlocked, CHAR_WAZA, CHAR_CAP } from './waza.js?v=11260040';
const $ = id => document.getElementById(id);
const gsap = window.gsap, PFX = window.PFX;
const DEV = /[?&]dev=1/.test(location.search);
const IS_PHONE = /iPhone|iPod|iPad|Android/i.test(navigator.userAgent || '');
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---------- ことば ----------
const TX = {
  ja: { lang: '日本語', ttl: '無限鬼斬', h1: '<small>むげんおにきり</small>無限鬼斬', lead: '名前で決まる日輪刀で、鬼を斬って走れ。<br>斬るほど刃こぼれする。どこまで行けるか。', ph: '名前を入れる', start: '日輪刀を握る', needName: '名前を入れてください', sndOn: '🔊 音あり', sndOff: '🔇 音なし', rank: 'ランキング', prev: '刀の色を見る（前作）',
    hold: '長押しで握る', keep: 'そのまま握りしめると…？', aka: '赫く灼けた', isOni: '鬼なので、日輪刀を握れなかった', who: n => `「<b>${esc(n)}</b>」の日輪刀`, den: '才能', sharpInfo: (c, m) => c < .2 ? '刃こぼれしない' : `鬼を${Math.max(1, Math.floor(m / c))}体斬ると刃こぼれ`, akaInfo: '赫刀：刃こぼれしにくい',
    noWaza: '呼吸の適性なし。技は使えない。よけて、斬って、進め。', pick1: n => `持っていく技を1つ選ぶ（${n}個が使える）`, pick2: n => `持っていく技を2つ選ぶ（${n}個が使える）`, lockAt: p => `才能${p}%から`, go: '出陣', back: 'もどる',
    how: '・画面の左側／右側をタップでレーン移動（PCは ← →）<br>・鬼のレーンに入ると斬る。斬るほど刃こぼれし、斬らずにいると戻る<br>・切れ味がないまま鬼に当たるか、障害物に当たると終わり<br>・右下の丸がたまったら押して技（PCはスペース）', how2: '・2つの丸はスワイプで切りかえ（PCは ↑）',
    sharp: '切れ味', kills: n => `鬼 ${n}体`, why: { dull: '刃こぼれで、斬れなかった', obs: '障害物にぶつかった' }, rInfo: (R, k, wz) => `「<b>${esc(R.name)}</b>」の日輪刀<br>${R.kk}・才能 <b>${R.den}%</b>${R.akaDone ? '<span class="aka">赫刀</span>' : ''}<br>斬った鬼 <b>${k}</b>体${wz ? '<br>技：' + esc(wz) : ''}`,
    best: d => `自己ベスト ${d.toLocaleString()}m`, newBest: '自己ベスト更新！', again: 'もう一度走る', repick: '技を選びなおす', rename: '名前を変える', x: '𝕏 に投稿', fan: '※非公式のファンゲームです',
    post: (R, d, k) => `「${R.name}」の日輪刀（${R.kk}・才能${R.den}%${R.akaDone ? '・赫刀' : ''}）で ${d.toLocaleString()}m 走り、鬼を${k}体斬った。\n#無限鬼斬 #ブラウザゲーム\nhttps://nasubi-no-oniwa.com/onikiri/`,
    rkAll: '全体', loading: '読みこみ中…', rkErr: '読みこめませんでした', rkEmpty: 'まだ記録がありません', nogl: 'この端末では3Dを表示できませんでした', capCol: (c, k) => `${c}　${k}` },
  en: { lang: 'English', ttl: 'MUGEN ONIKIRI', h1: '<small>MUGEN ONIKIRI</small>無限鬼斬', lead: 'Your name decides your Nichirin Blade.<br>Run, slash demons, and mind the chipping edge.', ph: 'Enter a name', start: 'Grip the blade', needName: 'Please enter a name', sndOn: '🔊 Sound on', sndOff: '🔇 Sound off', rank: 'Ranking', prev: 'See your blade color',
    hold: 'Hold to grip', keep: 'Keep holding…?', aka: 'The blade burns crimson', isOni: "You're a demon. The blade won't let you hold it", who: n => `<b>${esc(n)}</b>'s Nichirin Blade`, den: 'Talent', sharpInfo: (c, m) => c < .2 ? 'Never chips' : `Chips out after ${Math.max(1, Math.floor(m / c))} demons`, akaInfo: 'Crimson blade: chips slower',
    noWaza: 'No breathing aptitude. No techniques. Dodge, slash, keep going.', pick1: n => `Pick 1 technique (${n} unlocked)`, pick2: n => `Pick 2 techniques (${n} unlocked)`, lockAt: p => `Talent ${p}%+`, go: 'Go', back: 'Back',
    how: '・Tap left / right side to change lanes (PC: ← →)<br>・Enter a demon\'s lane to slash it. Slashing chips the blade; it recovers while you rest<br>・Hit a demon with no edge left, or any obstacle, and it\'s over<br>・When the circle fills, tap it for your technique (PC: Space)', how2: '・Swipe the circles to switch (PC: ↑)',
    sharp: 'Edge', kills: n => `${n} demons`, why: { dull: 'The chipped blade could not cut', obs: 'Hit an obstacle' }, rInfo: (R, k, wz) => `<b>${esc(R.name)}</b>'s Nichirin Blade<br>${R.kk} · Talent <b>${R.den}%</b>${R.akaDone ? '<span class="aka">Crimson</span>' : ''}<br>Demons slain: <b>${k}</b>${wz ? '<br>Technique: ' + esc(wz) : ''}`,
    best: d => `Best ${d.toLocaleString()}m`, newBest: 'New best!', again: 'Run again', repick: 'Change technique', rename: 'Change name', x: 'Post on 𝕏', fan: '※Unofficial fan game',
    post: (R, d, k) => `"${R.name}"'s Nichirin Blade (${R.kk}, talent ${R.den}%${R.akaDone ? ', crimson' : ''}) ran ${d.toLocaleString()}m and slew ${k} demons.\n#無限鬼斬 #ブラウザゲーム\nhttps://nasubi-no-oniwa.com/onikiri/`,
    rkAll: 'All', loading: 'Loading…', rkErr: 'Could not load', rkEmpty: 'No records yet', nogl: "This device can't show 3D", capCol: (c, k) => `${c}  ${k}` },
};
function pickLang() { const q = (/[?&]lang=([a-z]+)/.exec(location.search) || [])[1]; if (TX[q]) return q; const s = ls.get('onikiri_lang', null); if (TX[s]) return s; return (navigator.language || 'ja').toLowerCase().startsWith('ja') ? 'ja' : 'en'; }
let L = pickLang(), T = TX[L];
const cl = k => (COLORS[k].name[L] || COLORS[k].name.en), kk = k => (COLORS[k].kokyu[L] || COLORS[k].kokyu.en);
function applyLang() {
  T = TX[L]; document.documentElement.lang = L; document.title = T.ttl;
  $('tH1').innerHTML = T.h1; $('tLead').innerHTML = T.lead; $('nm').placeholder = T.ph; $('startBtn').textContent = T.start; $('rkBtn').textContent = T.rank; $('rkBtn2').textContent = T.rank; $('prevBtn').textContent = T.prev;
  $('holdT').textContent = T.hold; $('goBtn').textContent = T.go; $('pkBack').textContent = T.back; $('shL').textContent = T.sharp; $('again').textContent = T.again; $('repick').textContent = T.repick; $('rename').textContent = T.rename; $('xBtn').textContent = T.x; $('rkT').textContent = T.rank; $('rkBack').textContent = T.back;
  $('tFan').textContent = T.fan; $('rFan').textContent = T.fan; sndLabel();
  $('langs').innerHTML = Object.keys(TX).map(k => `<button data-l="${k}" class="${k === L ? 'on' : ''}">${TX[k].lang}</button>`).join('');
  $('langs').querySelectorAll('button').forEach(b => b.onclick = () => { L = b.dataset.l; ls.set('onikiri_lang', L); applyLang(); });
}

// ---------- 名前から刀を決める（前作「色変わりの刀」と同じ決め方。同じ名前なら同じ色・同じ才能） ----------
const toHira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const norm = s => toHira(String(s).normalize('NFKC').replace(/[\s　・･]/g, '').toLowerCase());
function hash(s, seed) { let h = (2166136261 ^ seed) >>> 0; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
const CHMAP = new Map();
CHARS.forEach(c => c.n.forEach(v => { const n = norm(v); if (!CHMAP.has(n)) CHMAP.set(n, c); }));
const POOL = ORDER.map(k => [k, COLORS[k].w]);
function judge(name) {
  const n = norm(name); const r1 = hash(n, 0x6b61), r2 = hash(n, 0x7461);
  const c = CHMAP.get(n); if (c) return { key: c.k, den: c.den, n, aka: !!c.aka, stab: !!c.stab, ch: c.n[0] };
  let key = null, x = r1 * 100; for (const [k, w] of POOL) { if (x < w) { key = k; break; } x -= w; } key = key || 'none';
  let den;
  if (key === 'none') den = Math.floor(r2 * 6);
  else if (COLORS[key].base) den = Math.round(18 + 82 * Math.pow(r2, 0.85));
  else if (key === 'black') den = Math.round(62 + 38 * r2);
  else den = Math.round(42 + 58 * r2);
  return { key, den, n };
}
// 使える型（キャラは作中の設定、それ以外は才能％で下から。端数は切り上げ）
function usable(R) {
  const W = WAZA[R.key]; if (!W) return [];
  const all = W.map((_, i) => i);
  if (R.ch) { const cw = CHAR_WAZA[R.ch]; if (cw === 'all') return all; if (cw) return cw; return all.slice(0, Math.min(CHAR_CAP[R.ch] || W.length, unlocked(W.length, R.den))); }
  return all.slice(0, unlocked(W.length, R.den));
}
const needDen = (i, n) => Math.floor(i * 100 / n) + 1;
const wzName = (key, i) => { const w = WAZA[key][i]; return w[0] + ' ' + w[1]; };

// ---------- 音 ----------
let AC = null, SND = ls.get('onikiri_snd', true);
function sndLabel() { $('sndBtn').textContent = SND ? T.sndOn : T.sndOff; }
$('sndBtn').onclick = () => { SND = !SND; ls.set('onikiri_snd', SND); sndLabel(); };
function ac() { if (!SND) return null; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; } catch (e) { return null; } }
function noise(a, dur) { const b = a.createBuffer(1, a.sampleRate * dur, a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = a.createBufferSource(); s.buffer = b; return s; }
function sfx(k, v) {
  const a = ac(); if (!a) return; const t = a.currentTime, g = a.createGain(); g.connect(a.destination); v = v || 1;
  if (k === 'cut') { const s = noise(a, .22), f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.setValueAtTime(5200, t); f.frequency.exponentialRampToValueAtTime(1100, t + .2); s.connect(f); f.connect(g); g.gain.setValueAtTime(.32 * v, t); g.gain.exponentialRampToValueAtTime(.0001, t + .22); s.start(t); s.stop(t + .22); }
  else if (k === 'ring') { [1320, 1980, 2640].forEach((fq, i) => { const o = a.createOscillator(), gg = a.createGain(); o.frequency.value = fq; o.connect(gg); gg.connect(g); gg.gain.setValueAtTime(.0001, t); gg.gain.exponentialRampToValueAtTime(.16 / (i + 1), t + .01); gg.gain.exponentialRampToValueAtTime(.0001, t + 1.6 - i * .3); o.start(t); o.stop(t + 1.7); }); }
  else if (k === 'thud') { const o = a.createOscillator(); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(38, t + .5); o.connect(g); g.gain.setValueAtTime(.55, t); g.gain.exponentialRampToValueAtTime(.0001, t + .6); o.start(t); o.stop(t + .6); }
  else if (k === 'clang') { [2400, 3150, 4100].forEach((fq, i) => { const o = a.createOscillator(), gg = a.createGain(); o.frequency.value = fq; o.connect(gg); gg.connect(g); gg.gain.setValueAtTime(.16 / (i + 1), t); gg.gain.exponentialRampToValueAtTime(.0001, t + .5); o.start(t); o.stop(t + .52); }); }
  else if (k === 'waza') { const s = noise(a, .7), f = a.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 4; f.frequency.setValueAtTime(600, t); f.frequency.exponentialRampToValueAtTime(6000, t + .5); s.connect(f); f.connect(g); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.4, t + .08); g.gain.exponentialRampToValueAtTime(.0001, t + .7); s.start(t); s.stop(t + .7); const o = a.createOscillator(), gg = a.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(880, t + .25); o.connect(gg); gg.connect(a.destination); gg.gain.setValueAtTime(.12, t); gg.gain.exponentialRampToValueAtTime(.0001, t + .4); o.start(t); o.stop(t + .4); }
  else if (k === 'stone') { [880, 1320].forEach((fq, i) => { const o = a.createOscillator(), gg = a.createGain(); o.type = 'triangle'; o.frequency.value = fq; o.connect(gg); gg.connect(g); gg.gain.setValueAtTime(.14, t + i * .07); gg.gain.exponentialRampToValueAtTime(.0001, t + .3 + i * .07); o.start(t + i * .07); o.stop(t + .4); }); }
  else if (k === 'full') { const o = a.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(660, t); o.frequency.setValueAtTime(990, t + .08); o.connect(g); g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.0001, t + .3); o.start(t); o.stop(t + .3); }
  else if (k === 'move') { const o = a.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(520, t + .06); o.connect(g); g.gain.setValueAtTime(.05, t); g.gain.exponentialRampToValueAtTime(.0001, t + .08); o.start(t); o.stop(t + .08); }
}

// ---------- 2Dの演出（pixelfx） ----------
const fctx = $('fxc').getContext('2d'); let FXS = [], fxRaf = 0, fxLast = 0, fxFrame = null, fxImg = null;
function ramp(hex) { const c = new THREE.Color(hex), o = []; for (let i = 0; i < 8; i++) { const t = i / 7, k = c.clone().multiplyScalar(.6 + .4 * Math.min(1, t * 1.4)).lerp(new THREE.Color('#ffffff'), Math.max(0, t - .55) * 1.6); o.push('#' + k.getHexString()); } return o; }
function fxAdd(mod, o) { try { if (!PFX || !mod) return; if (!fxFrame) { fxFrame = PFX.createFrame(160, 160); fxImg = new ImageData(160, 160); } const f = PFX.createFx(mod, o); f._life = mod === PFX.fx.confetti ? 3 : 1.4; FXS.push(f); if (!fxRaf) { fxLast = performance.now(); fxRaf = requestAnimationFrame(fxLoop); } } catch (e) { } }
function fxLoop(now) { const dt = Math.min(.05, (now - fxLast) / 1000); fxLast = now; try { PFX.clearFrame(fxFrame); FXS = FXS.filter(f => { f.update(dt); f.draw(fxFrame, 'back'); f.draw(fxFrame, 'front'); f._life -= dt; return !f.done() && f._life > 0; }); PFX.composite(fxFrame, fxImg.data, null); fctx.putImageData(fxImg, 0, 0); } catch (e) { FXS = []; } if (FXS.length) fxRaf = requestAnimationFrame(fxLoop); else { fxRaf = 0; fctx.clearRect(0, 0, 160, 160); } }
function cap(t, hold) { const c = $('cap'); c.textContent = t; gsap.killTweensOf(c); gsap.fromTo(c, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .3 }); if (hold) gsap.to(c, { opacity: 0, duration: .4, delay: hold }); }
function flash(hex, a) { const f = $('flash'); f.style.background = hex; gsap.fromTo(f, { opacity: a || .7 }, { opacity: 0, duration: .5, ease: 'power2.out' }); }
let toastT = 0; function toast(m) { const t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 5000); }

// ---------- 3D ----------
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas: $('gl'), antialias: true }); } catch (e) { $('load').textContent = T.nogl; throw e; }
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x06070f); scene.fog = new THREE.Fog(0x06070f, 45, 135);
const camera = new THREE.PerspectiveCamera(60, 1, .1, 400);
const CAM = new THREE.Vector3(0, 4.7, 9.4);
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; const hf = 2 * Math.atan(4.5 / 10.5); camera.fov = clamp(THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hf / 2) / camera.aspect)), 44, 86); camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
scene.add(new THREE.HemisphereLight(0x9aa6e0, 0x1a1420, 1.5));
const moonL = new THREE.DirectionalLight(0xc6d4ff, 1.6); moonL.position.set(-6, 14, 6); scene.add(moonL);
const auraL = new THREE.PointLight(0xffffff, 0, 16, 1.6); auraL.position.set(0, 1.6, -1.2); scene.add(auraL);
const LW = 1.4, lx = l => (l - 2) * LW;
function ctex(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
// 道（石畳）
const roadTex = ctex(256, 256, (x, w, h) => { x.fillStyle = '#23263a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 90; i++) { const a = Math.random() * w, b = Math.random() * h, s = 14 + Math.random() * 26; x.fillStyle = `rgba(${40 + Math.random() * 30 | 0},${44 + Math.random() * 30 | 0},${70 + Math.random() * 30 | 0},.55)`; x.fillRect(a, b, s, s * .6); } x.fillStyle = '#5d6694'; for (let i = 1; i < 5; i++) x.fillRect(i * w / 5 - 1.5, 0, 3, h); x.fillStyle = '#8a93c4'; x.fillRect(0, 0, 4, h); x.fillRect(w - 4, 0, 4, h); x.fillStyle = '#ffffff10'; x.fillRect(0, 0, w, 6); });
roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping; roadTex.repeat.set(1, 30); roadTex.anisotropy = 4;
const road = new THREE.Mesh(new THREE.PlaneGeometry(LW * 5, 240), new THREE.MeshLambertMaterial({ map: roadTex })); road.rotation.x = -Math.PI / 2; road.position.set(0, 0, -100); scene.add(road);
const side = new THREE.Mesh(new THREE.PlaneGeometry(120, 260), new THREE.MeshLambertMaterial({ color: 0x0d0e18 })); side.rotation.x = -Math.PI / 2; side.position.set(0, -.03, -100); scene.add(side);
const moon = new THREE.Mesh(new THREE.CircleGeometry(10, 40), new THREE.MeshBasicMaterial({ color: 0xf6ecc9, fog: false })); moon.position.set(34, 52, -190); scene.add(moon);
const moonG = new THREE.Mesh(new THREE.CircleGeometry(22, 40), new THREE.MeshBasicMaterial({ color: 0x8892c8, fog: false, transparent: true, opacity: .16 })); moonG.position.set(34, 52, -191); scene.add(moonG);
// 町並み（大正の夜）
const SCEN = [];
{
  const wallM = [0x2a2230, 0x1f2636, 0x33262a, 0x262a2e].map(c => new THREE.MeshLambertMaterial({ color: c })), roofM = new THREE.MeshLambertMaterial({ color: 0x14161f }), winM = new THREE.MeshBasicMaterial({ color: 0xffc66a }), winM2 = new THREE.MeshBasicMaterial({ color: 0xff9a4a });
  const box = new THREE.BoxGeometry(1, 1, 1), roofG = new THREE.ConeGeometry(.78, 1, 4);
  for (let i = 0; i < 30; i++) {
    const sgn = i % 2 ? 1 : -1, g = new THREE.Group(), w = 3.4 + Math.random() * 2, h = 2.6 + Math.random() * 2.2, d = 5 + Math.random() * 3;
    const b = new THREE.Mesh(box, wallM[i % 4]); b.scale.set(w, h, d); b.position.y = h / 2; g.add(b);
    const r = new THREE.Mesh(roofG, roofM); r.scale.set(w * 1.15, 1.5, d * 1.15); r.rotation.y = Math.PI / 4; r.position.y = h + .75; g.add(r);
    for (let k = 0; k < 2; k++) if (Math.random() < .75) { const wn = new THREE.Mesh(box, Math.random() < .5 ? winM : winM2); wn.scale.set(.06, .9, 1.1); wn.position.set(-sgn * (w / 2 + .02), 1.3 + Math.random() * .5, (k - .5) * d * .5); g.add(wn); }
    g.position.set(sgn * (LW * 2.5 + 2.6 + w / 2 + Math.random() * 1.2), 0, -Math.floor(i / 2) * 15 + 12); scene.add(g); SCEN.push({ m: g, span: 225 });
  }
  const postM = new THREE.MeshLambertMaterial({ color: 0x1a1a22 }), lampM = new THREE.MeshBasicMaterial({ color: 0xffb04a });
  for (let i = 0; i < 16; i++) { const sgn = i % 2 ? 1 : -1, g = new THREE.Group(); const p = new THREE.Mesh(box, postM); p.scale.set(.12, 2.6, .12); p.position.y = 1.3; g.add(p); const l = new THREE.Mesh(box, lampM); l.scale.set(.34, .44, .34); l.position.y = 2.7; g.add(l); g.position.set(sgn * (LW * 2.5 + .8), 0, -Math.floor(i / 2) * 28 + 6); scene.add(g); SCEN.push({ m: g, span: 224 }); }
}
// 演出の板（光る線・弧・輪）
const beamTex = ctex(64, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#0000'); g.addColorStop(.35, '#fff6'); g.addColorStop(.5, '#fff'); g.addColorStop(.65, '#fff6'); g.addColorStop(1, '#0000'); x.fillStyle = g; x.fillRect(0, 0, w, h); x.globalCompositeOperation = 'destination-in'; const v = x.createLinearGradient(0, 0, 0, h); v.addColorStop(0, '#0000'); v.addColorStop(.15, '#fff'); v.addColorStop(.85, '#fff'); v.addColorStop(1, '#0000'); x.fillStyle = v; x.fillRect(0, 0, w, h); });
const arcTex = ctex(256, 256, (x, w, h) => { x.strokeStyle = '#fff'; x.lineCap = 'round'; for (let i = 0; i < 3; i++) { x.globalAlpha = [.25, .5, 1][i]; x.lineWidth = [46, 26, 10][i]; x.beginPath(); x.arc(w / 2, h * 1.02, h * .78, Math.PI * 1.13, Math.PI * 1.87); x.stroke(); } });
const ringTex = ctex(256, 256, (x, w, h) => { x.strokeStyle = '#fff'; for (let i = 0; i < 3; i++) { x.globalAlpha = [.2, .45, 1][i]; x.lineWidth = [40, 20, 6][i]; x.beginPath(); x.arc(w / 2, h / 2, w * .38, 0, 6.3); x.stroke(); } x.globalAlpha = .9; x.lineWidth = 10; for (let k = 0; k < 4; k++) { x.beginPath(); x.arc(w / 2, h / 2, w * .3, k * 1.57, k * 1.57 + .7); x.stroke(); } });
const glowTex = ctex(128, 128, (x, w, h) => { const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, '#ffffffff'); g.addColorStop(.3, '#ffffff99'); g.addColorStop(.6, '#ffffff33'); g.addColorStop(1, '#ffffff00'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
const planeG = new THREE.PlaneGeometry(1, 1);
const FXP = [], FXL = [];
function fxMesh(tex) { let m = FXP.pop(); if (!m) { m = new THREE.Mesh(planeG, new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })); scene.add(m); } m.material.map = tex; m.material.needsUpdate = true; m.visible = true; m.rotation.set(0, 0, 0); m.scale.set(1, 1, 1); return m; }
function fxPush(m, col, life, o) { m.material.color.set(col); m.material.opacity = 1; FXL.push(Object.assign({ m, life, max: life, a: 1 }, o || {})); }
function beam(x, z0, z1, w, col, life, o) { const m = fxMesh(beamTex); m.rotation.x = -Math.PI / 2; m.position.set(x, .22, (z0 + z1) / 2); m.scale.set(w, Math.abs(z1 - z0), 1); fxPush(m, col, life || .35, o); }
function vbeam(x, z, h, w, col, life, o) { const m = fxMesh(beamTex); m.position.set(x, h / 2, z); m.scale.set(w, h, 1); fxPush(m, col, life || .3, o); }
function arcFlat(x, z, w, col, life, o) { const m = fxMesh(arcTex); m.rotation.x = -Math.PI / 2; m.position.set(x, .5, z); m.scale.set(w, w * .7, 1); fxPush(m, col, life || .4, o); }
function arcVert(x, z, s, col, life, o) { const m = fxMesh(arcTex); m.position.set(x, 1.3, z); m.scale.set(s, s, 1); m.rotation.z = (o && o.rz) || 0; fxPush(m, col, life || .3, o); }
function ringFx(r, col, life, o) { const m = fxMesh(ringTex); m.rotation.x = -Math.PI / 2; m.position.set(G.x, .3, -1); m.scale.set(r * 2, r * 2, 1); fxPush(m, col, life, Object.assign({ follow: 1, spin: 9 }, o || {})); }
function glowFx(x, y, z, s, col, life, o) { const m = fxMesh(glowTex); m.position.set(x, y, z); m.scale.set(s, s, 1); fxPush(m, col, life, o); }
function fxStep(dt, wdt) {
  for (let i = FXL.length - 1; i >= 0; i--) { const f = FXL[i], m = f.m; f.life -= dt; if (f.life <= 0) { m.visible = false; FXP.push(m); FXL.splice(i, 1); continue; }
    const p = f.life / f.max; m.material.opacity = (f.hold ? Math.min(1, p * 4) : p) * f.a; if (f.vz) m.position.z += f.vz * dt; if (f.vy) m.position.y += f.vy * dt; if (f.grow) { const k = 1 + f.grow * dt; m.scale.x *= k; m.scale.y *= k; } if (f.follow) { m.position.x = G.x; } if (f.spin) m.rotation.z += f.spin * dt; if (f.world) m.position.z += G.speed * wdt; }
}
// 剣士（後ろ姿）
const player = new THREE.Group(); scene.add(player);
const P = {};
{
  const dark = new THREE.MeshLambertMaterial({ color: 0x16161e }), skin = new THREE.MeshLambertMaterial({ color: 0xe8c4a0 });
  P.haoriM = new THREE.MeshLambertMaterial({ color: 0x334466, side: THREE.DoubleSide }); P.bladeM = new THREE.MeshBasicMaterial({ color: 0xb9bec4 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.24, .3, .8, 10), dark); body.position.y = 1.0; player.add(body);
  const haori = new THREE.Mesh(new THREE.CylinderGeometry(.3, .55, .95, 12, 1, true), P.haoriM); haori.position.y = .93; player.add(haori); P.haori = haori;
  P.legL = new THREE.Mesh(new THREE.BoxGeometry(.17, .62, .17), dark); P.legR = P.legL.clone(); P.legL.geometry.translate(0, -.31, 0); P.legL.position.set(-.14, .62, 0); P.legR.position.set(.14, .62, 0); player.add(P.legL, P.legR);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.23, 14, 10), new THREE.MeshLambertMaterial({ color: 0x1c1418 })); head.position.y = 1.62; player.add(head);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, .12, 8), skin); neck.position.y = 1.43; player.add(neck);
  P.arm = new THREE.Group(); P.arm.position.set(.34, 1.25, 0); player.add(P.arm);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(.12, .5, .12), dark); arm.position.y = -.2; P.arm.add(arm);
  P.kat = new THREE.Group(); P.kat.position.set(0, -.42, 0); P.arm.add(P.kat);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(.05, 1.3, .02), P.bladeM); blade.position.y = .72; P.kat.add(blade);
  const tsuba = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, .03, 10), new THREE.MeshLambertMaterial({ color: 0xc9a14a })); tsuba.position.y = .06; P.kat.add(tsuba);
  P.kat.rotation.x = -1.15; P.arm.rotation.z = -.2;
  P.auraM = new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0, fog: false }); P.aura = new THREE.Sprite(P.auraM); P.aura.scale.set(3.0, 4.0, 1); P.aura.position.set(0, 1.15, -.1); player.add(P.aura);
  P.bladeGlowM = new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0, fog: false }); P.bladeGlow = new THREE.Sprite(P.bladeGlowM); P.bladeGlow.scale.set(.5, 1.7, 1); P.bladeGlow.position.y = .72; P.kat.add(P.bladeGlow);
  const n = 46, pos = new Float32Array(n * 3); P.pv = []; for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * 1.4; pos[i * 3 + 1] = Math.random() * 2.6; pos[i * 3 + 2] = (Math.random() - .5) * 1.0; P.pv.push(.6 + Math.random() * 1.4); }
  P.pg = new THREE.BufferGeometry(); P.pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); P.pm = new THREE.PointsMaterial({ size: .09, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0, fog: false }); player.add(new THREE.Points(P.pg, P.pm));
}
// 鬼・障害物・砥石
const GEO = { box: new THREE.BoxGeometry(1, 1, 1), sph: new THREE.SphereGeometry(.5, 12, 9), horn: new THREE.ConeGeometry(.07, .34, 6), rock: new THREE.DodecahedronGeometry(.62, 0), eye: new THREE.SphereGeometry(.06, 6, 5) };
const MAT = { oni: [0x7a2030, 0x3e5a36, 0x34406e, 0x6a3470, 0x7a5a20].map(c => new THREE.MeshLambertMaterial({ color: c })), horn: new THREE.MeshLambertMaterial({ color: 0xece4cc }), eye: new THREE.MeshBasicMaterial({ color: 0xffd23c }), crate: new THREE.MeshLambertMaterial({ color: 0x6b4a22 }), crate2: new THREE.MeshLambertMaterial({ color: 0x3a2812 }), rock: new THREE.MeshLambertMaterial({ color: 0x5a5c6c, flatShading: true }), stone: new THREE.MeshBasicMaterial({ color: 0xdfe6ff }) };
const FREE = { oni: [], obs: [], stone: [] }, ENT = [];
function mkEnt(type) {
  const g = new THREE.Group();
  if (type === 'oni') { const mt = MAT.oni[Math.random() * 5 | 0]; const b = new THREE.Mesh(GEO.box, mt); b.scale.set(.78, 1.15, .5); b.position.y = .62; g.add(b); const h = new THREE.Mesh(GEO.sph, mt); h.scale.setScalar(.66); h.position.y = 1.48; g.add(h); for (const s of [-1, 1]) { const hn = new THREE.Mesh(GEO.horn, MAT.horn); hn.position.set(s * .15, 1.86, .04); hn.rotation.z = -s * .25; g.add(hn); const e = new THREE.Mesh(GEO.eye, MAT.eye); e.position.set(s * .12, 1.52, .3); g.add(e); const a = new THREE.Mesh(GEO.box, mt); a.scale.set(.2, .7, .2); a.position.set(s * .52, .95, .18); a.rotation.x = -.9; g.add(a); } }
  else if (type === 'obs') { if (Math.random() < .5) { const c = new THREE.Mesh(GEO.box, MAT.crate); c.scale.set(1.12, 1.12, 1.12); c.position.y = .56; g.add(c); for (const y of [.12, 1.0]) { const s = new THREE.Mesh(GEO.box, MAT.crate2); s.scale.set(1.18, .12, 1.18); s.position.y = y; g.add(s); } } else { const r = new THREE.Mesh(GEO.rock, MAT.rock); r.scale.set(1, 1.05, 1); r.position.y = .56; r.rotation.y = Math.random() * 3; g.add(r); } }
  else { const s = new THREE.Mesh(GEO.box, MAT.stone); s.scale.set(.55, .2, .32); s.position.y = .75; g.add(s); const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xaecbff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: .8 })); gl.scale.set(1.8, 1.8, 1); gl.position.y = .75; g.add(gl); }
  scene.add(g); return g;
}
function spawn(type, lane, z) { const m = FREE[type].pop() || mkEnt(type); m.visible = true; m.position.set(lx(lane), 0, z); m.rotation.set(0, 0, 0); m.scale.set(1, 1, 1); const e = { type, lane, z, m, dead: 0, ph: Math.random() * 6 }; ENT.push(e); return e; }
function clearEnts() { for (const e of ENT) { e.m.visible = false; FREE[e.type].push(e.m); } ENT.length = 0; for (const f of FXL) { f.m.visible = false; FXP.push(f.m); } FXL.length = 0; }

// ---------- 走る ----------
let ST = 'load', R = null, G = { x: 0, speed: 0 }, SEL = [], BEST = ls.get('onikiri_best', 0);
function newRun() {
  clearEnts(); const den = R.den, cost = 15 * (1 - den / 100) * (R.akaDone ? .8 : 1);
  G = { t: 0, dist: 0, speed: 13, lane: 2, x: 0, max: Math.round(70 + 30 * den / 100), cost, sharp: 0, gauge: 0, kills: 0, over: 0, inv: 0, fx: null, slowT: 0, slowS: 1, hit: 0, lastCut: -9, next: 12, safe: 2, shake: 0, q: [], sel: 0, wz: SEL.map(i => WAZA[R.key][i]), used: {}, why: '' };
  G.sharp = G.max; for (let z = -48; z > -124; z -= 19) spawnRow(z); G.next = 12; hudWaza(); $('hud').hidden = false; $('wzBtns').hidden = !G.wz.length; $('wzB').hidden = G.wz.length < 2; ST = 'run'; hudStep(true);
}
function auraCol() { if (!R || R.key === 'none') return new THREE.Color(0x9aa0aa); const c = new THREE.Color(COLORS[R.key].hex); if (R.key === 'black') c.set(0xff7a3a); if (R.akaDone) c.lerp(new THREE.Color(0xff2a14), .62); return c; }
const hexOf = () => '#' + auraCol().getHexString();
function setLook(prog, aura) {
  const C = COLORS[R.key], steel = new THREE.Color(0xb9bec4), col = new THREE.Color(R.key === 'none' ? '#b9bec4' : C.hex);
  P.bladeM.color.copy(steel).lerp(col, prog); if (R.akaDone) P.bladeM.color.lerp(new THREE.Color(0xff3a14), .7);
  const a = auraCol(); P.auraM.color.copy(a); P.pm.color.copy(a); P.bladeGlowM.color.copy(R.akaDone ? new THREE.Color(0xff3a14) : col); P.bladeGlowM.opacity = (R.key === 'none' ? .15 : .7) * prog;
  P.haoriM.color.copy(col).multiplyScalar(R.key === 'black' ? 2.2 : .5).lerp(new THREE.Color(0x202432), R.key === 'none' ? .7 : .25);
  const k = R.key === 'none' ? .12 : (.3 + .5 * R.den / 100); P.auraM.opacity = aura * k * .9; P.pm.opacity = aura * k; auraL.color.copy(a); auraL.intensity = aura * (R.key === 'none' ? 3 : 26);
  document.documentElement.style.setProperty('--tint', hexOf());
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; }
function spawnRow(z) {
  const d = G.dist, q = Math.min(1, d / 2500); z = z || -128;
  if (Math.random() < .55) G.safe = clamp(G.safe + (Math.random() < .5 ? -1 : 1), 0, 4); // この道には障害物を置かない（必ず通れる道を1本残す）
  const lanes = shuffle([0, 1, 2, 3, 4]), cells = [null, null, null, null, null];
  const wall = d > 450 && Math.random() < Math.min(.3, .04 + (d - 450) / 5000);
  if (wall) { const nObs = Math.random() < .5 ? 0 : (Math.random() < .6 ? 1 : 2); let o = 0; for (const l of lanes) { if (o < nObs && l !== G.safe) { cells[l] = 'obs'; o++; } else cells[l] = 'oni'; } }
  else { let n = 1 + (Math.random() < .35 + .4 * q ? 1 : 0) + (Math.random() < .5 * q ? 1 : 0) + (Math.random() < .3 * q ? 1 : 0), o = 0; for (let i = 0; i < n; i++) { const l = lanes[i]; if (l !== G.safe && o < 2 && Math.random() < .26 + .14 * q) { cells[l] = 'obs'; o++; } else cells[l] = 'oni'; } if (Math.random() < .075) cells[lanes[4]] = 'stone'; }
  cells.forEach((c, l) => { if (c) spawn(c, l, z); });
}
function kill(e, free, quiet) {
  if (e.dead) return; e.dead = .001; e.vx = (Math.random() - .5) * 7; G.kills++; G.gauge = Math.min(100, G.gauge + (free ? 2.5 : 7));
  const col = hexOf(); arcVert(e.m.position.x, e.z + .2, 2.4, col, .22, { rz: (Math.random() - .5) * 2.4, world: 1 }); glowFx(e.m.position.x, 1.1, e.z, 2.2, '#ffffff', .14, { world: 1 });
  if (!quiet) sfx('cut', free ? .5 : 1);
}
function smash(e) { if (e.dead) return; e.dead = .001; e.vx = (Math.random() - .5) * 10; glowFx(e.m.position.x, .8, e.z, 3, '#ffd9a0', .2, { world: 1 }); sfx('thud'); }
function inZone(e, Lw, Rr, zNear) { return e.z <= (zNear == null ? 1 : zNear) && e.z >= -Rr && (Lw >= 9 || Math.abs(e.lane - G.lane) <= Lw); }
function zoneKill(Lw, Rr, O, zNear) { let n = 0; for (const e of ENT) { if (e.dead || !inZone(e, Lw, Rr, zNear)) continue; if (e.type === 'oni') { kill(e, true, n > 2); n++; } else if (e.type === 'obs' && O) smash(e); } return n; }
function die(why) { if (G.over) return; G.over = .001; G.why = why; G.shake = .9; sfx('thud'); sfx('clang'); flash('#ff2a2a', .6); fxAdd(PFX && PFX.fx.burst, { x: 80, y: 90, seed: 9, palette: ramp('#ff3048') }); }
function useWaza() {
  if (ST !== 'run' || G.over || !G.wz.length || G.gauge < 100 || G.fx) return;
  const w = G.wz[G.sel], p = w[3], col = hexOf(), px = G.x, W = (p.L >= 9 ? 5 : (2 * p.L + 1)) * LW, cx = p.L >= 9 ? 0 : px;
  G.gauge = 0; G.hit = .32; G.used[w[0] + ' ' + w[1]] = 1; sfx('waza'); flash(col, .22);
  const el = $('wz'); el.innerHTML = `<small>${esc(kk(R.key))}</small>${esc(w[0])}　${esc(w[1])}`; gsap.killTweensOf(el); gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: .62, y: 0, duration: .18 }); gsap.to(el, { opacity: 0, duration: .5, delay: .95 });
  if (p.H) G.sharp = Math.min(G.max, G.sharp + p.H);
  if (p.k === 'inst') {
    zoneKill(p.L, p.R, p.O); G.inv = Math.max(G.inv, p.I || .4);
    const v = p.v;
    if (v === 'arcH') { arcFlat(cx, -3, W + 1.5, col, .45, { vz: -p.R * 2.2, grow: .6 }); arcFlat(cx, -1.5, W + .8, '#ffffff', .3, { vz: -p.R * 2.2, a: .6 }); }
    else if (v === 'wheel' || v === 'arcUp' || v === 'arcDown' || v === 'fall') { for (let l = -p.L; l <= p.L; l++) { if (p.L >= 9 && l) continue; arcVert(px + l * LW, -2, 3.4, col, .5, { vz: -p.R * 2, rz: v === 'arcDown' || v === 'fall' ? Math.PI : 0, spin: v === 'wheel' ? -14 : 0 }); } beam(px, 0, -p.R, W * .8, col, .35); if (v === 'fall') { G.shake = .5; glowFx(px, .5, -p.R * .5, W * 2.2, col, .4); } }
    else if (v === 'claws') { for (let l = 0; l < 5; l++) if (p.L >= 9 || Math.abs(l - G.lane) <= p.L) beam(lx(l), 0, -p.R, .7, col, .42); }
    else if (v === 'storm') { for (let l = 0; l < 5; l++) { beam(lx(l), 0, -p.R, .9, col, .4); vbeam(lx(l), -4 - Math.random() * p.R * .8, 9, .8, '#ffffff', .25); } G.shake = .4; }
    else if (v === 'mega') { beam(cx, 0, -p.R, W * 1.25, col, .7); beam(cx, 0, -p.R, W * .5, '#ffffff', .45); arcFlat(cx, -4, W + 3, col, .6, { vz: -p.R * 1.6, grow: 1 }); G.shake = .8; flash(col, .5); }
    else { beam(px, 0, -p.R, v === 'dash' ? 1.5 : 1.0, col, .45); beam(px, 0, -p.R, .35, '#ffffff', .3); if (p.L > 0) for (const s of [-1, 1]) beam(px + s * LW, 0, -p.R, .8, col, .38); if (v === 'bolt') vbeam(px, -p.R * .5, 10, 1, '#ffffff', .18); }
  } else if (p.k === 'multi') {
    const ts = ENT.filter(e => !e.dead && e.type === 'oni' && e.z < 1 && e.z > -p.R).sort((a, b) => b.z - a.z).slice(0, p.N);
    ts.forEach((e, i) => G.q.push({ t: i * .05, e })); G.inv = Math.max(G.inv, .35 + ts.length * .05); if (!ts.length) arcVert(px, -2, 3, col, .3, { vz: -30 });
  } else if (p.k === 'slow') { G.slowT = p.D; G.slowS = p.S; gsap.to('#tint', { opacity: .55, duration: .25 }); gsap.to('#tint', { opacity: 0, duration: .5, delay: p.D / 1 }); G.fx = { p, t: 0, D: p.D }; }
  else { G.fx = { p, t: 0, D: p.D, rain: 0 }; const r = p.k === 'rain' ? 0 : (p.v === 'calm' ? Math.max(4, W * .55) : W * .5 + 1.2); if (r) { ringFx(r, col, p.D, { hold: 1, spin: p.v === 'calm' ? 1.5 : 10 }); ringFx(r * .6, '#ffffff', p.D, { hold: 1, spin: -7, a: .4 }); } if (p.v === 'calm') glowFx(G.x, 1.2, -1, r * 2.6, col, p.D, { hold: 1, follow: 1, a: .35 }); }
}
function runStep(dt) {
  if (G.over) { G.over += dt; if (G.over > 1.05) { showResult(); } return 0; }
  if (G.hit > 0) G.hit -= dt; if (G.slowT > 0) G.slowT -= dt;
  const ts = (G.hit > 0 ? .35 : 1) * (G.slowT > 0 ? G.slowS : 1), wdt = dt * ts;
  G.t += wdt; G.speed = 13 + 17 * Math.min(1, G.dist / 1800); const mv = G.speed * wdt; G.dist += mv;
  const p1 = Math.min(1, G.dist / 1800), gap = G.dist < 1800 ? 18 - 8 * p1 : Math.max(7, 10 - (G.dist - 1800) / 1500);
  G.next -= mv; while (G.next <= 0) { spawnRow(); G.next += gap; }
  // 技（続くもの）
  const F = G.fx; let immune = G.inv > 0, ghost = false, brk = false;
  if (G.inv > 0) G.inv -= dt;
  if (F) {
    F.t += dt; const p = F.p;
    if (p.k === 'aura') { immune = true; ghost = !!p.G; brk = !!p.O; zoneKill(p.L, p.R, p.O); }
    else if (p.k === 'flow') { immune = true; ghost = true; brk = !!p.O; const Lw = p.grow ? Math.min(2, Math.floor(F.t / F.D * 3)) : p.L; let tg = null; for (const e of ENT) if (!e.dead && e.type === 'oni' && e.z < -1 && e.z > -34 && (!tg || e.z > tg.z)) tg = e; if (tg && tg.lane !== G.lane) { G.lane = tg.lane; beam(G.x, 0, -3, .5, hexOf(), .25); } zoneKill(Lw, 7, p.O); }
    else if (p.k === 'rain') { F.rain -= dt; if (F.rain <= 0) { F.rain = .22; zoneKill(9, p.R, p.O, -2.5); for (let i = 0; i < 3; i++) vbeam(lx(Math.random() * 5 | 0), -4 - Math.random() * (p.R - 4), 11, 1.0, hexOf(), .3, { world: 1 }); G.shake = Math.max(G.shake, .18); } }
    if (F.t >= F.D) { G.fx = null; G.inv = Math.max(G.inv, .35); }
  }
  for (let i = G.q.length - 1; i >= 0; i--) { const k = G.q[i]; k.t -= dt; if (k.t <= 0) { if (ENT.includes(k.e)) kill(k.e, true); G.q.splice(i, 1); } }
  if (!G.fx && G.gauge < 100) { const g0 = G.gauge; G.gauge = Math.min(100, G.gauge + 1.3 * wdt); if (g0 < 100 && G.gauge >= 100) sfx('full'); }
  // 切れ味は、斬らずにいると戻る
  if (G.t - G.lastCut > 1.0) G.sharp = Math.min(G.max, G.sharp + 10 * wdt);
  // 自分
  const tx = lx(G.lane); G.x += (tx - G.x) * Math.min(1, dt * 24); const pl = clamp(Math.round(G.x / LW) + 2, 0, 4);
  // 鬼・障害物
  for (let i = ENT.length - 1; i >= 0; i--) {
    const e = ENT[i]; e.z += mv; e.m.position.z = e.z;
    if (e.dead) { e.dead += dt; const m = e.m; m.position.y += 6 * dt; m.position.x += e.vx * dt; m.rotation.z += e.vx * 1.4 * dt; const s = Math.max(.01, 1 - e.dead / .34); m.scale.set(s, s, s); if (e.dead > .34) { m.visible = false; FREE[e.type].push(m); ENT.splice(i, 1); } continue; }
    if (e.type === 'oni') { e.m.position.y = Math.abs(Math.sin(G.t * 9 + e.ph)) * .12; e.m.rotation.z = Math.sin(G.t * 9 + e.ph) * .06; } else if (e.type === 'stone') { e.m.rotation.y += dt * 3; e.m.position.y = Math.sin(G.t * 4 + e.ph) * .12; }
    if (e.z > -.75 && e.z < .85 && e.lane === pl) {
      if (e.type === 'stone') { e.dead = .3; G.sharp = Math.min(G.max, G.sharp + 40); sfx('stone'); glowFx(G.x, 1, 0, 3.5, '#cfe0ff', .35, { follow: 1 }); }
      else if (e.type === 'oni') { if (immune) kill(e, true); else if (G.sharp >= G.cost) { G.sharp -= G.cost; G.lastCut = G.t; kill(e); swing = .22; } else { die('dull'); } }
      else { if (brk) smash(e); else if (ghost) { } else die('obs'); }
    }
    if (e.z > 12) { e.m.visible = false; FREE[e.type].push(e.m); ENT.splice(i, 1); }
  }
  return mv;
}
let swing = 0, tAll = 0, lastT = 0, HOLD = null, holding = false;
function frame(now) {
  requestAnimationFrame(frame); const dt = Math.min(.05, (now - lastT) / 1000 || 0); lastT = now; tAll += dt; if (document.hidden) return;
  let mv = 0;
  if (ST === 'run') mv = runStep(dt); else if (ST === 'grip') gripStep(dt); else if (ST === 'title' || ST === 'pick') mv = 5 * dt;
  // 景色を流す
  roadTex.offset.y += mv / 8; for (const s of SCEN) { s.m.position.z += mv; if (s.m.position.z > 16) s.m.position.z -= s.span; }
  // 剣士の動き
  const run = ST === 'run' && !G.over, sp = run ? 13 + G.speed * .25 : 3;
  P.legL.rotation.x = Math.sin(tAll * sp) * (run ? .9 : .12); P.legR.rotation.x = -P.legL.rotation.x; player.position.set(ST === 'run' ? G.x : 0, run ? Math.abs(Math.sin(tAll * sp)) * .1 : 0, 0);
  player.rotation.z = ST === 'run' ? clamp((lx(G.lane) - G.x) * -.35, -.4, .4) : 0; player.rotation.x = run ? .16 : 0;
  if (swing > 0) { swing -= dt; P.arm.rotation.x = -2.2 * Math.sin(Math.max(0, swing) / .22 * Math.PI); } else P.arm.rotation.x = run ? Math.sin(tAll * sp) * .25 : 0;
  if (ST === 'run' && G.over) { player.rotation.x = Math.min(1.4, G.over * 2.4); player.position.y = Math.max(-.2, .1 - G.over * .4); }
  const pp = P.pg.attributes.position; for (let i = 0; i < P.pv.length; i++) { let y = pp.getY(i) + P.pv[i] * dt; if (y > 2.8) y = 0; pp.setY(i, y); } pp.needsUpdate = true;
  if (ST === 'run' || ST === 'pick') { const pulse = .85 + .15 * Math.sin(tAll * 5); P.aura.scale.set(3.0 * pulse, 4.0 * pulse, 1); }
  fxStep(dt, dt);
  if (ST === 'run') { G.shake = Math.max(0, G.shake - dt * 1.8); hudStep(); }
  const sh = ST === 'run' ? G.shake : 0; camera.position.set(CAM.x + (ST === 'run' ? G.x * .35 : 0) + (Math.random() - .5) * sh, CAM.y + (Math.random() - .5) * sh, CAM.z); camera.lookAt((ST === 'run' ? G.x * .35 : 0), 1.1, -10);
  renderer.render(scene, camera);
}
// 画面の上の表示
const SHC = ['#e24b4a', '#ef9f27', '#f5d04a', '#63b03a', '#3f8ef0', '#f4f6f9'];
let hudLast = {};
function hudStep(force) {
  const segs = $('sh').children; for (let i = 0; i < 6; i++) { const lo = i * 100 / 6, hi = lo + 100 / 6, f = clamp((G.sharp - lo) / (hi - lo), 0, 1); const b = segs[i].firstChild; b.style.width = (f * 100).toFixed(0) + '%'; b.style.background = SHC[i]; segs[i].className = G.max <= lo + 1 ? 'lock' : ''; }
  $('sh').className = G.cost > .2 && G.sharp < G.cost ? 'low' : '';
  const d = Math.floor(G.dist); if (force || d !== hudLast.d) { $('dM').textContent = d.toLocaleString() + 'm'; hudLast.d = d; } if (force || G.kills !== hudLast.k) { $('dK').textContent = T.kills(G.kills); hudLast.k = G.kills; }
  const full = G.gauge >= 100 && !G.fx; $('wzA').style.setProperty('--p', G.gauge.toFixed(0)); $('wzB').style.setProperty('--p', G.gauge.toFixed(0)); $('wzA').classList.toggle('full', full);
}
const wzShort = w => w[1][0] === '（' ? w[0] : w[1];
function hudWaza() { if (!G.wz.length) return; $('wzA').firstChild.textContent = wzShort(G.wz[G.sel]); if (G.wz.length > 1) $('wzB').firstChild.textContent = wzShort(G.wz[1 - G.sel]); }
function swapWaza() { if (ST !== 'run' || G.wz.length < 2 || G.fx) return; G.sel = 1 - G.sel; hudWaza(); sfx('move'); gsap.fromTo('#wzA', { scale: .8 }, { scale: 1, duration: .15 }); }
function move(d) { if (ST !== 'run' || G.over) return; if (G.fx && G.fx.p.k === 'flow') return; const l = clamp(G.lane + d, 0, 4); if (l !== G.lane) { G.lane = l; sfx('move'); } }
$('gl').addEventListener('pointerdown', e => { if (ST === 'run') { e.preventDefault(); move(e.clientX < innerWidth / 2 ? -1 : 1); } });
{ let sx = 0, sy = 0, tg = null; const b = $('wzBtns');
  b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); sx = e.clientX; sy = e.clientY; tg = e.target.closest('.wzc'); try { b.setPointerCapture(e.pointerId); } catch (_) { } });
  b.addEventListener('pointerup', e => { const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.hypot(dx, dy) > 22 || (tg && tg.id === 'wzB')) swapWaza(); else useWaza(); tg = null; }); }
addEventListener('keydown', e => { if (ST !== 'run') return; if (e.key === 'ArrowLeft' || e.key === 'a') move(-1); else if (e.key === 'ArrowRight' || e.key === 'd') move(1); else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); useWaza(); } else if (e.key === 'ArrowUp' || e.key === 'Shift' || e.key === 'w') swapWaza(); });

// ---------- 握る ----------
function grip() {
  const name = $('nm').value.trim(); if (!name) { $('nmNote').textContent = T.needName; $('nmNote').classList.add('err'); return; }
  $('nmNote').textContent = ''; ac(); R = judge(name); R.name = name; R.akaDone = false;
  if (R.key === 'nezuko') { sfx('thud'); flash('#ff3048', .5); toast(T.isOni); return; }
  R.kk = kk(R.key); R.forms = usable(R); R.slots = R.den >= 100 && R.forms.length >= 2 ? 2 : (R.forms.length ? 1 : 0);
  ls.set('onikiri_name', name); $('title').hidden = true; clearEnts(); $('hud').hidden = true; setLook(0, 0); HOLD = { p: 0, ph: 0, t: 0, h2: 0 }; holding = false; $('hold').hidden = false; $('holdRing').style.setProperty('--p', 0); $('holdT').textContent = T.hold; ST = 'grip';
}
{ const h = $('hold'); const dn = e => { e.preventDefault(); holding = true; h.classList.add('on'); ac(); }, up = () => { holding = false; h.classList.remove('on'); };
  h.addEventListener('pointerdown', dn); addEventListener('pointerup', up); addEventListener('pointercancel', up); h.addEventListener('contextmenu', e => e.preventDefault()); }
function ignite() { R.akaDone = true; sfx('ring'); sfx('waza'); flash('#ff3a14', .6); cap(T.aka, 1.2); setLook(1, 1); fxAdd(PFX && PFX.fx.burst, { x: 80, y: 80, seed: 5, palette: ramp('#ff3a14') }); }
function gripStep(dt) {
  const H = HOLD; if (!H) return;
  if (H.ph === 0) { if (holding) H.p = Math.min(1, H.p + dt / 1.1); else H.p = Math.max(0, H.p - dt * .8); $('holdRing').style.setProperty('--p', (H.p * 100).toFixed(0)); setLook(H.p, H.p * .6);
    if (H.p >= 1) { H.ph = 1; H.t = 0; sfx('ring'); flash(R.key === 'none' ? '#b9bec4' : COLORS[R.key].hex, .35); setLook(1, 1); cap(T.capCol(cl(R.key), R.kk), 1.3); fxAdd(PFX && PFX.fx.burst, { x: 80, y: 80, seed: 3, palette: ramp(R.key === 'none' ? '#b9bec4' : COLORS[R.key].hex) }); } return; }
  H.t += dt;
  if (H.ph === 1) { // 色が決まったあと：そのまま握りしめ続けると赫く灼ける（キャラは作中で到達した人だけ、自動で）
    if (R.key === 'none') { if (H.t > 1.1) H.ph = 3; return; }
    if (R.ch) { if (R.aka && !H.done && H.t > .7) { H.done = 1; ignite(); } if (H.t > (R.aka ? 2.0 : 1.1)) H.ph = 3; return; }
    if (H.done) { if (H.t > H.doneAt + 1.2) H.ph = 3; return; }
    if (holding) { H.h2 += dt; if (H.h2 > .45 && !H.hint) { H.hint = 1; cap(T.keep); } if (H.h2 >= 1.7) { H.done = 1; H.doneAt = H.t; ignite(); } } else if (H.t > .9) H.ph = 3;
    return; }
  if (H.ph === 3) { HOLD = null; $('hold').hidden = true; gsap.to('#cap', { opacity: 0, duration: .2 }); holding = false; openPick(); }
}
// ---------- 技を選ぶ ----------
function openPick() {
  ST = 'pick'; setLook(1, 1); const W = WAZA[R.key] || [], C = COLORS[R.key], un = R.forms;
  $('pkWho').innerHTML = T.who(R.name); const pc = $('pkCol'); pc.textContent = cl(R.key) + '　' + R.kk; pc.style.background = R.key === 'none' ? '#b9bec4' : C.hex; pc.style.color = new THREE.Color(R.key === 'none' ? '#b9bec4' : C.hex).getHSL({}).l > .55 ? '#14131c' : '#fff';
  const cost = 15 * (1 - R.den / 100) * (R.akaDone ? .8 : 1), mx = 70 + 30 * R.den / 100;
  $('pkInfo').innerHTML = `${T.den} <b style="color:#fff">${R.den}%</b>${R.akaDone ? '<span class="aka">' + T.aka + '</span>' : ''}<br>${T.sharp}：${T.sharpInfo(cost, mx)}${R.akaDone && cost >= .2 ? '（' + T.akaInfo + '）' : ''}`;
  const saved = ls.get('onikiri_sel', {})[R.n]; SEL = (Array.isArray(saved) ? saved.filter(i => un.includes(i)) : []).slice(0, R.slots); for (let i = un.length - 1; i >= 0 && SEL.length < R.slots; i--) if (!SEL.includes(un[i])) SEL.push(un[i]);
  $('pkT').textContent = !un.length ? T.noWaza : (R.slots === 2 ? T.pick2(un.length) : T.pick1(un.length));
  const box = $('pkList'); box.innerHTML = W.map((w, i) => { const ok = un.includes(i); return `<button class="wl${ok ? '' : ' lock'}" data-i="${i}"${ok ? '' : ' disabled'}>${ok ? '' : `<em>${R.ch ? '—' : T.lockAt(needDen(i, W.length))}</em>`}<b>${esc(w[0])}　${esc(w[1])}</b><small>${esc(desc(w[3]))}</small></button>`; }).join('');
  const paint = () => box.querySelectorAll('.wl').forEach(b => b.classList.toggle('on', SEL.includes(+b.dataset.i)));
  box.querySelectorAll('.wl:not(.lock)').forEach(b => b.onclick = () => { const i = +b.dataset.i; if (SEL.includes(i)) { if (R.slots === 2 && SEL.length === 2) SEL = SEL.filter(v => v !== i); } else { SEL.push(i); while (SEL.length > R.slots) SEL.shift(); } paint(); sfx('move'); });
  paint(); $('pkHow').innerHTML = T.how + (R.slots === 2 ? '<br>' + T.how2 : ''); $('pick').hidden = false; $('pick').scrollTop = 0;
}
$('goBtn').onclick = () => { if (R.slots && SEL.length < R.slots) { for (const i of R.forms.slice().reverse()) if (SEL.length < R.slots && !SEL.includes(i)) SEL.push(i); } const s = ls.get('onikiri_sel', {}); s[R.n] = SEL; ls.set('onikiri_sel', s); $('pick').hidden = true; ac(); newRun(); };
$('pkBack').onclick = () => { $('pick').hidden = true; toTitle(); };
function toTitle() { ST = 'title'; $('hud').hidden = true; $('result').hidden = true; $('hold').hidden = true; clearEnts(); if (R) setLook(1, .5); $('title').hidden = false; $('title').scrollTop = 0; }
$('startBtn').onclick = grip;
$('nm').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('nm').blur(); grip(); } });
$('prevBtn').onclick = () => { location.href = '../katana/'; };

// ---------- 結果 ----------
let LAST = null, POST = '';
function showResult() {
  ST = 'result'; $('hud').hidden = true; const d = Math.floor(G.dist), k = G.kills, wz = Object.keys(G.used).join('、') || G.wz.map(w => w[0] + ' ' + w[1]).join('、');
  LAST = { d, k, wz }; const nb = d > BEST; if (nb) { BEST = d; ls.set('onikiri_best', d); }
  $('rWhy').textContent = T.why[G.why] || ''; $('rDist').innerHTML = d.toLocaleString() + '<small>m</small>'; $('rBest').textContent = nb ? T.newBest : T.best(BEST); $('rInfo').innerHTML = T.rInfo(R, k, wz);
  POST = T.post(R, d, k); $('result').hidden = false; $('result').scrollTop = 0;
  if (nb) fxAdd(PFX && PFX.fx.confetti, { x: 80, y: 60, seed: 11 });
  try { if (typeof gtag === 'function') gtag('event', 'run_end', { game: 'onikiri', dist: d, kills: k, kokyu: R.key }); } catch (e) { }
  submit(d, k, wz).catch(() => { });
}
$('again').onclick = () => { $('result').hidden = true; newRun(); };
$('repick').onclick = () => { $('result').hidden = true; clearEnts(); openPick(); };
$('rename').onclick = () => { toTitle(); const n = $('nm'); n.value = ''; setTimeout(() => { try { n.focus(); } catch (e) { } }, 50); };
// Xに投稿（自分の紹介ツイートを引用する。引用するツイートは一覧ページ quote/ で切りかえ）
let QUOTE = {};
fetch('https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/xquote/g/onikiri.json').then(r => r.json()).then(d => { if (d && typeof d === 'object') QUOTE = d; }).catch(() => { });
function quoteURL() { const u = (L === 'ja' ? QUOTE.ja : QUOTE.en) || ''; return /^https:\/\/x\.com\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}$/.test(u) ? u : ''; }
$('xBtn').onclick = () => { const q = quoteURL(), u = 'https://x.com/intent/post?text=' + encodeURIComponent(POST) + (q ? '&url=' + encodeURIComponent(q) : ''); const w = window.open(u, '_blank'); if (!w) location.href = u; };

// ---------- ランキング（otokonoji の onikiri/r と onikiri/b/呼吸） ----------
const FB = { key: 'AIzaSyAcJgJLVbuvx85_qEGJe1WhwsOelidxeYk', db: 'https://otokonoji-default-rtdb.asia-southeast1.firebasedatabase.app' };
async function fx(url, opt) { let err; for (let i = 0; i < 3; i++) { try { return await fetch(url, opt); } catch (e) { err = e; await new Promise(r => setTimeout(r, 400 * (i + 1))); } } throw err; }
let AUTH = null;
async function auth() {
  let a = AUTH || ls.get('onikiri_auth', null); if (a && a.exp > Date.now() + 60000) return AUTH = a;
  if (a && a.refresh) { try { const r = await fx('https://securetoken.googleapis.com/v1/token?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(a.refresh) }); if (r.ok) { const j = await r.json(); a = { uid: j.user_id, token: j.id_token, refresh: j.refresh_token, exp: Date.now() + (+j.expires_in) * 1000 }; ls.set('onikiri_auth', a); return AUTH = a; } } catch (_) { } }
  const r = await fx('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
  if (!r.ok) throw new Error('auth'); const j = await r.json(); a = { uid: j.localId, token: j.idToken, refresh: j.refreshToken, exp: Date.now() + (+j.expiresIn) * 1000 }; ls.set('onikiri_auth', a); return AUTH = a;
}
const DBU = p => FB.db + '/onikiri/' + p + '.json';
async function submit(d, k, wz) {
  if (DEV || d < 30) return; const sent = ls.get('onikiri_sent', {}), rec = { n: R.name.slice(0, 16), d, k: R.key, t: R.den, c: k, w: String(wz).slice(0, 60), a: R.akaDone ? 1 : 0, ts: { '.sv': 'timestamp' } };
  const doAll = d > (sent.all || 0), doB = d > (sent[R.key] || 0); if (!doAll && !doB) return; const a = await auth(), q = '?auth=' + encodeURIComponent(a.token), o = { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rec) };
  if (doAll) { const r = await fx(DBU('r/' + a.uid) + q, o); if (r.ok) sent.all = d; }
  if (doB) { const r = await fx(DBU('b/' + R.key + '/' + a.uid) + q, o); if (r.ok) sent[R.key] = d; }
  ls.set('onikiri_sent', sent);
}
let rkFrom = 'title', rkTab = 'all';
async function openRank(from) {
  rkFrom = from; $('title').hidden = true; $('result').hidden = true; $('rank').hidden = false; $('rank').scrollTop = 0;
  const tabs = [['all', T.rkAll]]; if (R && WAZA[R.key]) tabs.push([R.key, R.kk]); if (!tabs.some(t => t[0] === rkTab)) rkTab = 'all';
  $('rkTabs').innerHTML = tabs.map(t => `<button data-t="${t[0]}" class="${t[0] === rkTab ? 'on' : ''}">${esc(t[1])}</button>`).join(''); $('rkTabs').querySelectorAll('button').forEach(b => b.onclick = () => { rkTab = b.dataset.t; openRank(rkFrom); });
  const box = $('rkBox'); box.innerHTML = '<p class="note">' + T.loading + '</p>';
  try { const r = await fx(DBU(rkTab === 'all' ? 'r' : 'b/' + rkTab) + '?orderBy=%22d%22&limitToLast=50'); if (!r.ok) throw 0; const j = (await r.json()) || {}; const me = (AUTH || ls.get('onikiri_auth', {}) || {}).uid;
    const rows = Object.entries(j).map(([u, v]) => Object.assign({ u }, v)).filter(v => v && typeof v.d === 'number').sort((a, b) => b.d - a.d);
    if ($('rank').hidden) return; if (!rows.length) { box.innerHTML = '<p class="note">' + T.rkEmpty + '</p>'; return; }
    box.innerHTML = '<table class="rk">' + rows.map((v, i) => { const C = COLORS[v.k] || COLORS.none; return `<tr${v.u === me ? ' class="me"' : ''}><td class="n">${i + 1}</td><td>${esc(v.n || '')}${v.a ? '<span class="aka">' + (L === 'ja' ? '赫刀' : 'Crimson') + '</span>' : ''}<small><i style="background:${C.hex}"></i>${esc(C.kokyu[L] || C.kokyu.en)}・${T.den}${+v.t || 0}%${v.w ? '・' + esc(String(v.w)) : ''}</small></td><td class="d">${(+v.d).toLocaleString()}m<small>${T.kills(+v.c || 0)}</small></td></tr>`; }).join('') + '</table>';
  } catch (e) { box.innerHTML = '<p class="note err">' + T.rkErr + '</p>'; }
}
$('rkBtn').onclick = () => openRank('title'); $('rkBtn2').onclick = () => openRank('result');
$('rkBack').onclick = () => { $('rank').hidden = true; if (rkFrom === 'result' && LAST) $('result').hidden = false; else $('title').hidden = false; };

// ---------- はじめ ----------
applyLang();
{ const q = (/[?&]n=([^&]+)/.exec(location.search) || [])[1]; let nm = ''; try { nm = q ? decodeURIComponent(q.replace(/\+/g, ' ')).slice(0, 16) : ''; } catch (e) { } $('nm').value = nm || ls.get('onikiri_name', '') || ''; }
R = null; P.auraM.opacity = 0; ST = 'title'; $('load').hidden = true; $('title').hidden = false;
if (DEV) window.__G = () => ({ ST, G, R, SEL, ENT: ENT.length, FXL: FXL.length });
requestAnimationFrame(frame);
