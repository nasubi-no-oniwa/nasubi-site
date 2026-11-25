import { THREE } from './lib.js?v=11260100';
import { COLORS, CHARS, ORDER } from './data.js?v=11260100';
import { WAZA, desc, unlocked, CHAR_WAZA, CHAR_CAP } from './waza.js?v=11260100';
import { renderer, gripFrame, gripStart, gripOnDone, gripReset, gripLang, gripSnd, fxAdd, ramp } from './grip.js?v=11260100';
import { makeFx, STY } from './fx.js?v=11260100';
import { makeRig, toon, part } from './rig.js?v=11260100';
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
    rkAll: '全体', rkToday: '今日', loading: '読みこみ中…', rkErr: '読みこめませんでした', rkEmpty: 'まだ記録がありません', nogl: 'この端末では3Dを表示できませんでした', capCol: (c, k) => `${c}　${k}` },
  en: { lang: 'English', ttl: 'MUGEN ONIKIRI', h1: '<small>MUGEN ONIKIRI</small>無限鬼斬', lead: 'Your name decides your Nichirin Blade.<br>Run, slash demons, and mind the chipping edge.', ph: 'Enter a name', start: 'Grip the blade', needName: 'Please enter a name', sndOn: '🔊 Sound on', sndOff: '🔇 Sound off', rank: 'Ranking', prev: 'See your blade color',
    hold: 'Hold to grip', keep: 'Keep holding…?', aka: 'The blade burns crimson', isOni: "You're a demon. The blade won't let you hold it", who: n => `<b>${esc(n)}</b>'s Nichirin Blade`, den: 'Talent', sharpInfo: (c, m) => c < .2 ? 'Never chips' : `Chips out after ${Math.max(1, Math.floor(m / c))} demons`, akaInfo: 'Crimson blade: chips slower',
    noWaza: 'No breathing aptitude. No techniques. Dodge, slash, keep going.', pick1: n => `Pick 1 technique (${n} unlocked)`, pick2: n => `Pick 2 techniques (${n} unlocked)`, lockAt: p => `Talent ${p}%+`, go: 'Go', back: 'Back',
    how: '・Tap left / right side to change lanes (PC: ← →)<br>・Enter a demon\'s lane to slash it. Slashing chips the blade; it recovers while you rest<br>・Hit a demon with no edge left, or any obstacle, and it\'s over<br>・When the circle fills, tap it for your technique (PC: Space)', how2: '・Swipe the circles to switch (PC: ↑)',
    sharp: 'Edge', kills: n => `${n} demons`, why: { dull: 'The chipped blade could not cut', obs: 'Hit an obstacle' }, rInfo: (R, k, wz) => `<b>${esc(R.name)}</b>'s Nichirin Blade<br>${R.kk} · Talent <b>${R.den}%</b>${R.akaDone ? '<span class="aka">Crimson</span>' : ''}<br>Demons slain: <b>${k}</b>${wz ? '<br>Technique: ' + esc(wz) : ''}`,
    best: d => `Best ${d.toLocaleString()}m`, newBest: 'New best!', again: 'Run again', repick: 'Change technique', rename: 'Change name', x: 'Post on 𝕏', fan: '※Unofficial fan game',
    post: (R, d, k) => `"${R.name}"'s Nichirin Blade (${R.kk}, talent ${R.den}%${R.akaDone ? ', crimson' : ''}) ran ${d.toLocaleString()}m and slew ${k} demons.\n#無限鬼斬 #ブラウザゲーム\nhttps://nasubi-no-oniwa.com/onikiri/`,
    rkAll: 'All', rkToday: 'Today', loading: 'Loading…', rkErr: 'Could not load', rkEmpty: 'No records yet', nogl: "This device can't show 3D", capCol: (c, k) => `${c}  ${k}` },
};
function pickLang() { const q = (/[?&]lang=([a-z]+)/.exec(location.search) || [])[1]; if (TX[q]) return q; const s = ls.get('onikiri_lang', null); if (TX[s]) return s; return (navigator.language || 'ja').toLowerCase().startsWith('ja') ? 'ja' : 'en'; }
let L = pickLang(), T = TX[L];
const cl = k => (COLORS[k].name[L] || COLORS[k].name.en), kk = k => (COLORS[k].kokyu[L] || COLORS[k].kokyu.en);
function applyLang() {
  T = TX[L]; gripLang(L); document.documentElement.lang = L; document.title = T.ttl;
  $('tH1').innerHTML = T.h1; $('tLead').innerHTML = T.lead; $('nm').placeholder = T.ph; $('startBtn').textContent = T.start; $('rkBtn').textContent = T.rank; $('rkBtn2').textContent = T.rank; $('prevBtn').textContent = T.prev;
  $('goBtn').textContent = T.go; $('pkBack').textContent = T.back; $('shL').textContent = T.sharp; $('again').textContent = T.again; $('repick').textContent = T.repick; $('rename').textContent = T.rename; $('xBtn').textContent = T.x; $('rkT').textContent = T.rank; $('rkBack').textContent = T.back;
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
$('sndBtn').onclick = () => { SND = !SND; ls.set('onikiri_snd', SND); gripSnd(SND); sndLabel(); };
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

// ---------- 小さな表示 ----------
function cap(t, hold) { const c = $('cap'); c.textContent = t; gsap.killTweensOf(c); gsap.fromTo(c, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .3 }); if (hold) gsap.to(c, { opacity: 0, duration: .4, delay: hold }); }
function flash(hex, a) { const f = $('flash'); f.style.background = hex; gsap.fromTo(f, { opacity: a || .7 }, { opacity: 0, duration: .5, ease: 'power2.out' }); }
let toastT = 0; function toast(m) { const t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 5000); }

// ---------- 3D（走る場面）。描く道具（renderer）は握る場面と共用 ----------
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x06070f); scene.fog = new THREE.Fog(0x06070f, 45, 135);
const camera = new THREE.PerspectiveCamera(60, 1, .1, 400);
const CAM = new THREE.Vector3(0, 4.7, 9.4);
function resize() { const w = innerWidth, h = innerHeight; camera.aspect = w / h; const hf = 2 * Math.atan(4.5 / 10.5); camera.fov = clamp(THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hf / 2) / camera.aspect)), 44, 86); camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
scene.add(new THREE.HemisphereLight(0xaab4f0, 0x2a2030, 1.9));
const moonL = new THREE.DirectionalLight(0xd6e0ff, 2.0); moonL.position.set(-5, 12, 8); scene.add(moonL);
const auraL = new THREE.PointLight(0xffffff, 0, 16, 1.6); auraL.position.set(0, 1.6, -1.2); scene.add(auraL);
const LW = 1.4, lx = l => (l - 2) * LW, rnd = (a, b) => a + Math.random() * (b - a);
function ctex(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
// 道（石畳）
const roadTex = ctex(256, 256, (x, w, h) => { x.fillStyle = '#23263a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 90; i++) { const a = Math.random() * w, b = Math.random() * h, s = 14 + Math.random() * 26; x.fillStyle = `rgba(${40 + Math.random() * 30 | 0},${44 + Math.random() * 30 | 0},${70 + Math.random() * 30 | 0},.55)`; x.fillRect(a, b, s, s * .6); } x.fillStyle = '#4b5380'; for (let i = 1; i < 5; i++) x.fillRect(i * w / 5 - 1, 0, 2, h); x.fillStyle = '#8a93c4'; x.fillRect(0, 0, 4, h); x.fillRect(w - 4, 0, 4, h); x.fillStyle = '#ffffff10'; x.fillRect(0, 0, w, 6); });
roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping; roadTex.repeat.set(1, 30); roadTex.anisotropy = 4;
const road = new THREE.Mesh(new THREE.PlaneGeometry(LW * 5, 240), new THREE.MeshLambertMaterial({ map: roadTex })); road.rotation.x = -Math.PI / 2; road.position.set(0, 0, -100); scene.add(road);
const side = new THREE.Mesh(new THREE.PlaneGeometry(120, 260), new THREE.MeshLambertMaterial({ color: 0x0d0e18 })); side.rotation.x = -Math.PI / 2; side.position.set(0, -.03, -100); scene.add(side);
const moon = new THREE.Mesh(new THREE.CircleGeometry(10, 40), new THREE.MeshBasicMaterial({ color: 0xf6ecc9, fog: false })); moon.position.set(34, 52, -190); scene.add(moon);
const moonG = new THREE.Mesh(new THREE.CircleGeometry(22, 40), new THREE.MeshBasicMaterial({ color: 0x8892c8, fog: false, transparent: true, opacity: .16 })); moonG.position.set(34, 52, -191); scene.add(moonG);
// 町並み（大正の夜）と藤の花
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
  const fujiT = ctex(128, 256, (x, w, h) => { for (let k = 0; k < 7; k++) { const cx = 12 + k * 17 + Math.random() * 8, len = 110 + Math.random() * 130; for (let j = 0; j < 40; j++) { const t = j / 40, rr = (1 - t) * 9 + 2; x.fillStyle = `hsla(${268 + Math.random() * 20},${55 + Math.random() * 20}%,${60 + t * 18}%,${.9 - t * .3})`; x.beginPath(); x.arc(cx + (Math.random() - .5) * rr * 2, 8 + t * len, 2.5 + (1 - t) * 3, 0, 7); x.fill(); } } });
  const fujiM = new THREE.MeshBasicMaterial({ map: fujiT, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  for (let i = 0; i < 8; i++) { const sgn = i % 2 ? 1 : -1, m = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4.6), fujiM); m.position.set(sgn * (LW * 2.5 + 1.5), 3.6, -Math.floor(i / 2) * 56 - 20); m.rotation.y = sgn * -.9; scene.add(m); SCEN.push({ m, span: 224 }); }
}
// エフェクトと剣士
const WREF = { x: 0 }, FX = makeFx(scene, WREF);
STY.ash = { kind: 'plain', c: '#5a2414', c2: '#ffb07a', shape: 'ember' };
const RIG = makeRig(FX.glowTex); scene.add(RIG.root);
const P = {};
{
  P.auraM = new THREE.SpriteMaterial({ map: FX.glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0, fog: false }); P.aura = new THREE.Sprite(P.auraM); P.aura.scale.set(3.0, 4.0, 1); P.aura.position.set(0, 1.15, -.1); RIG.root.add(P.aura);
  const n = 60, pos = new Float32Array(n * 3); P.pv = []; for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * 1.5; pos[i * 3 + 1] = Math.random() * 2.8; pos[i * 3 + 2] = (Math.random() - .5) * 1.1; P.pv.push(.7 + Math.random() * 1.6); }
  P.pg = new THREE.BufferGeometry(); P.pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); P.pm = new THREE.PointsMaterial({ size: .1, map: FX.glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0, fog: false }); RIG.root.add(new THREE.Points(P.pg, P.pm));
}
// 鬼・障害物・砥石
const GEO = { box: new THREE.BoxGeometry(1, 1, 1), sph: new THREE.SphereGeometry(.5, 12, 10), horn: new THREE.ConeGeometry(.07, .36, 6), rock: new THREE.DodecahedronGeometry(.62, 0), eye: new THREE.SphereGeometry(.06, 6, 5), body: new THREE.CapsuleGeometry(.3, .5, 4, 10), limb: new THREE.CapsuleGeometry(.1, .5, 3, 8) };
const MAT = { oni: [[0x8a2a3a, 0xb7a7b2], [0x4a6a40, 0xa9c79a], [0x3a4a80, 0xa8b0d8], [0x70397a, 0xc9b0d0], [0x8a6a24, 0xd8c8a0], [0x2a2a34, 0xc8c2cc]].map(c => [toon(c[0]), toon(c[1])]), horn: toon(0xf2ead0), eye: new THREE.MeshBasicMaterial({ color: 0xff3040 }), crate: toon(0x7a5426), crate2: toon(0x3a2812), rock: toon(0x6a6c7e), stone: new THREE.MeshBasicMaterial({ color: 0xdfe6ff }) };
const FREE = { oni: [], obs: [], stone: [] }, ENT = [];
function mkEnt(type) {
  const g = new THREE.Group();
  if (type === 'oni') { const mt = MAT.oni[Math.random() * 6 | 0], body = new THREE.Group(), head = new THREE.Group(); g.add(body, head);
    const b = part(GEO.body, mt[0]); b.position.y = .78; b.scale.set(1.15, 1, .85); b.rotation.x = .2; body.add(b);
    for (const s of [-1, 1]) { const a = part(GEO.limb, mt[1], 1.14); a.position.set(s * .42, .98, .28); a.rotation.set(1.15, 0, -s * .25); body.add(a); const l = part(GEO.limb, mt[0], 1.14); l.position.set(s * .17, .3, 0); body.add(l); }
    const hd = part(GEO.sph, mt[1]); hd.scale.setScalar(.6); head.add(hd); const hair = part(GEO.sph, toon(0x16121a), 0); hair.scale.set(.64, .5, .62); hair.position.set(0, .1, -.06); head.add(hair);
    for (const s of [-1, 1]) { const hn = new THREE.Mesh(GEO.horn, MAT.horn); hn.position.set(s * .14, .33, .1); hn.rotation.set(.25, 0, -s * .3); head.add(hn); const e = new THREE.Mesh(GEO.eye, MAT.eye); e.position.set(s * .11, .02, .27); head.add(e); }
    const eg = new THREE.Sprite(new THREE.SpriteMaterial({ map: FX.glowTex, color: 0xff2030, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: .75 })); eg.scale.set(.9, .45, 1); eg.position.set(0, .02, .3); head.add(eg);
    g.userData = { body, head }; }
  else if (type === 'obs') { if (Math.random() < .5) { const c = part(GEO.box, MAT.crate, 1.05); c.scale.set(1.12, 1.12, 1.12); c.position.y = .56; g.add(c); for (const y of [.12, 1.0]) { const s = new THREE.Mesh(GEO.box, MAT.crate2); s.scale.set(1.18, .12, 1.18); s.position.y = y; g.add(s); } } else { const r = part(GEO.rock, MAT.rock, 1.06); r.scale.set(1, 1.05, 1); r.position.y = .56; r.rotation.y = Math.random() * 3; g.add(r); } }
  else { const s = new THREE.Mesh(GEO.box, MAT.stone); s.scale.set(.55, .2, .32); s.position.y = .75; g.add(s); const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: FX.glowTex, color: 0xaecbff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: .8 })); gl.scale.set(1.8, 1.8, 1); gl.position.y = .75; g.add(gl); }
  scene.add(g); return g;
}
function spawn(type, lane, z) { const m = FREE[type].pop() || mkEnt(type); m.visible = true; m.position.set(lx(lane), 0, z); m.rotation.set(0, 0, 0); const sc = type === 'oni' ? rnd(.92, 1.14) : 1; m.scale.set(sc, sc, sc); if (type === 'oni') { const u = m.userData; u.head.position.set(0, 1.56, .1); u.head.rotation.set(0, 0, 0); u.head.scale.set(1, 1, 1); u.body.scale.set(1, 1, 1); u.body.position.set(0, 0, 0); } const e = { type, lane, z, m, dead: 0, ph: Math.random() * 6 }; ENT.push(e); return e; }
function clearEnts() { for (const e of ENT) { e.m.visible = false; FREE[e.type].push(e.m); } ENT.length = 0; FX.clear(); FX.trail.reset(); FX.dragon.reset(); }

// ---------- 走る ----------
let ST = 'load', R = null, G = { x: 0, speed: 0, lane: 2 }, SEL = [], BEST = ls.get('onikiri_best', 0);
function newRun() {
  clearEnts(); const den = R.den, cost = 15 * (1 - den / 100) * (R.akaDone ? .8 : 1);
  G = { t: 0, dist: 0, speed: 13, lane: 2, x: 0, max: Math.round(70 + 30 * den / 100), cost, sharp: 0, gauge: 0, kills: 0, over: 0, inv: 0, fx: null, slowT: 0, slowS: 1, hit: 0, lastCut: -9, next: 12, safe: 2, shake: 0, pend: [], sel: 0, wz: SEL.map(i => WAZA[R.key][i]), used: {}, why: '', cutN: 0, pt: 0 };
  G.sharp = G.max; for (let z = -48; z > -124; z -= 19) spawnRow(z); G.next = 12; hudWaza(); $('hud').hidden = false; $('wzBtns').hidden = !G.wz.length; $('wzB').hidden = G.wz.length < 2; RIG.setLoop(null); setLook(1); ST = 'run'; hudStep(true);
}
const KEY = () => (R && STY[R.key] ? R.key : 'none');
function auraCol() { if (!R || R.key === 'none') return new THREE.Color(0x9aa0aa); const c = new THREE.Color(STY[R.key].c); if (R.akaDone) c.lerp(new THREE.Color(0xff2a14), .6); return c; }
const hexOf = () => '#' + auraCol().getHexString();
function setLook(aura) {
  const C = COLORS[R.key], col = new THREE.Color(R.key === 'none' ? '#b9bec4' : C.hex);
  RIG.bladeM.color.copy(col); if (R.key === 'black') RIG.bladeM.color.set(0x2a2a30); if (R.akaDone) RIG.bladeM.color.lerp(new THREE.Color(0xff3a14), .75);
  const a = auraCol(); P.auraM.color.copy(a); P.pm.color.copy(a); RIG.bladeGlow.color.copy(R.akaDone ? new THREE.Color(0xff3a14) : (R.key === 'black' ? new THREE.Color(0xff7a3a) : col)); RIG.bladeGlow.opacity = R.key === 'none' ? .15 : .75;
  RIG.haoriM.color.copy(R.key === 'none' ? new THREE.Color(0x4a4e58) : (R.key === 'black' ? new THREE.Color(0x2c3a34) : col.clone().multiplyScalar(.8)));
  const k = R.key === 'none' ? .12 : (.3 + .5 * R.den / 100); P.auraM.opacity = aura * k * .9; P.pm.opacity = aura * k; auraL.color.copy(a); auraL.intensity = aura * (R.key === 'none' ? 3 : 26);
  FX.trail.key(KEY()); document.documentElement.style.setProperty('--tint', hexOf());
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
// 鬼を斬る：頸が飛び、体は灰になる
function kill(e, free, quiet) {
  if (e.dead) return; e.dead = .001; e.vx = rnd(-1, 1) * 4 + (e.m.position.x - G.x) * 2; e.vy = rnd(6, 10); G.kills++; G.gauge = Math.min(100, G.gauge + (free ? 2.5 : 7));
  const K = KEY(), x = e.m.position.x; FX.arcVert(K, x, e.z + .3, 2.8, .26, { rz: rnd(-1.4, 1.4), world: 1, y: 1.4 }); FX.glow('#ffffff', x, 1.4, e.z, 2.6, .12, { world: 1 }); FX.burst(K, x, 1.3, e.z, free ? 3 : 6, { sp: 6 }); FX.burst('ash', x, .8, e.z, 5, { sp: 3, g: -3, life: 1.3 });
  if (!quiet) sfx('cut', free ? .5 : 1);
}
function smash(e) { if (e.dead) return; e.dead = .001; e.vx = rnd(-5, 5); e.vy = 6; FX.glow('#ffd9a0', e.m.position.x, .8, e.z, 3, .2, { world: 1 }); FX.burst('gray', e.m.position.x, .7, e.z, 8, { sp: 8 }); sfx('thud'); }
function inZone(e, Lw, Rr, zNear) { return e.z <= (zNear == null ? 1 : zNear) && e.z >= -Rr && (Lw >= 9 || Math.abs(e.lane - G.lane) <= Lw); }
function zoneKill(Lw, Rr, O, zNear) { let n = 0; for (const e of ENT) { if (e.dead || !inZone(e, Lw, Rr, zNear)) continue; if (e.type === 'oni') { kill(e, true, n > 2); n++; } else if (e.type === 'obs' && O) smash(e); } return n; }
function die(why) { if (G.over) return; G.over = .001; G.why = why; G.shake = .9; G.fx = null; RIG.setLoop('down'); FX.dragon.stop(); sfx('thud'); sfx('clang'); flash('#ff2a2a', .6); fxAdd(PFX && PFX.fx.burst, { x: 80, y: 90, seed: 9, palette: ramp('#ff3048') }); }
// 型ごとの動き（原作の動きに合わせる）
function actOf(p) { if (p.a) return p.a; const v = p.v; if (p.k === 'inst') return v === 'wheel' ? 'flipV' : v === 'arcUp' ? 'rise' : (v === 'arcDown' || v === 'fall') ? 'smash' : v === 'thrust' ? 'thrust' : (v === 'bolt' || v === 'dash' || v === 'mega') ? 'iai' : (v === 'claws' || v === 'storm') ? 'slashH2' : 'slashH'; if (p.k === 'multi') return 'multi'; if (p.k === 'aura') return v === 'calm' ? 'calm' : v === 'dashAura' ? 'charge' : 'spin'; if (p.k === 'flow') return v === 'dragon' ? 'dragon' : 'flow'; if (p.k === 'rain') return 'raise'; return p.v === 'eye' && p.S > .45 ? 'sense' : null; }
// 一撃の型のエフェクト
function castFx(p) {
  const K = KEY(), S = STY[K], px = G.x, all = p.L >= 9, Wd = (all ? 5 : 2 * p.L + 1) * LW, cx = all ? 0 : px, v = p.v, Rr = p.R, lanes = [];
  for (let l = 0; l < 5; l++) if (all || Math.abs(l - G.lane) <= p.L) lanes.push(l);
  FX.ring(S.c, px, -1, 1.2, .45, { grow: 6 }); FX.burst(K, px, 1.1, -1.5, 16, { sp: 8, fwd: 2.5 }); sfx('cut');
  if (v === 'arcH' || v === 'rain') { for (let i = 0; i < 3; i++) FX.arcFlat(K, cx, -2 - i * 1.3, Wd + 2.4 - i * .3, .5 + i * .08, { vz: -Rr * 2.4, grow: .5, a: 1 - i * .25 }); FX.arcVert(K, cx, -1.6, Wd + 1.6, .28, { y: 1.2 }); if (v === 'rain') for (let i = 0; i < 14; i++) FX.vbeam(K, cx + rnd(-Wd, Wd) * .6, -rnd(2, Rr), 7, .5, rnd(.3, .6), { a: .6 }); }
  else if (v === 'wheel' || v === 'arcUp' || v === 'arcDown' || v === 'fall') {
    lanes.forEach(l => { FX.arcVert(K, lx(l), -2, 4.4, .55, { vz: -Rr * 2, rz: (v === 'arcDown' || v === 'fall') ? Math.PI : 0, spin: v === 'wheel' ? -16 : 0, y: 1.7 }); FX.beam(K, lx(l), 0, -Rr, 1.5, .45); });
    if (v === 'fall' || v === 'arcDown') { G.shake = .65; lanes.forEach(l => { FX.vbeam(K, lx(l), -Rr * .45, 9, 1.7, .42); FX.ring(S.c2, lx(l), -Rr * .45, 1.5, .5, { grow: 5 }); }); FX.burst(K, cx, .5, -Rr * .45, 26, { sp: 10, w: Wd }); }
    if (v === 'arcUp') lanes.forEach(l => FX.vbeam(K, lx(l), -Rr * .5, 10, 1.4, .45, { vy: 6 }));
  }
  else if (v === 'claws') lanes.forEach((l, i) => { FX.beam(K, lx(l), 0, -Rr, 1.2, .5); FX.arcVert(K, lx(l), -3, 3.2, .42, { vz: -Rr * 2.2, rz: i % 2 ? -.6 : .6 }); });
  else if (v === 'storm') { lanes.forEach(l => { FX.beam(K, lx(l), 0, -Rr, 1.4, .5); for (let i = 0; i < 2; i++) FX.vbeam(K, lx(l), -3 - Math.random() * Rr * .9, 11, 1.5, rnd(.25, .5)); }); G.shake = .6; flash(S.c2, .35); }
  else if (v === 'mega') { FX.beam(K, cx, 0, -Rr, Wd * 1.5, .85); FX.beam(K, cx, 0, -Rr, Wd * .7, .6); for (let i = 0; i < 5; i++) FX.arcFlat(K, cx, -3 - i * 3, Wd + 3, .75, { vz: -Rr * 1.5, grow: .9, a: 1 - i * .12 }); FX.dragon.start(K, .8, Math.min(42, Rr * .6), 1.7); G.shake = 1; flash(S.c, .55); FX.burst(K, cx, 1, -6, 40, { sp: 13, w: Wd, fwd: 3 }); lanes.forEach(l => FX.vbeam(K, lx(l), -rnd(6, Rr * .7), 12, 1.6, .5)); }
  else { FX.beam(K, px, .5, -Rr, v === 'dash' ? 2.3 : 1.7, .5); FX.beam(K, px, 0, -Rr, .8, .35); if (p.L > 0 && !all) for (const s of [-1, 1]) FX.beam(K, px + s * LW, 0, -Rr, 1.3, .42);
    if (v === 'bolt') { for (let i = 0; i < 4; i++) FX.vbeam(K, px + rnd(-1.5, 1.5), -rnd(2, Rr), 12, 1.7, rnd(.18, .4)); flash('#ffffff', .3); }
    if (v === 'dash') FX.arcVert(K, px, -3, 4.2, .42, { vz: -Rr * 2, rz: -.8 }); FX.ring(S.c2, px, -Rr * .5, 1, .4, { grow: 7 }); FX.arcFlat(K, px, -Rr * .6, 3.6, .4, { grow: 1.5 }); }
}
// 続く型のエフェクト
function auraFx(p) {
  const K = KEY(), S = STY[K], D = p.D, v = p.v;
  if (p.k === 'aura') { const r = p.L >= 9 ? 6.6 : (2 * p.L + 1) * LW * .5 + 1.4; for (let i = 0; i < 3; i++) FX.arcFlat(K, G.x, -1, r * 2.3, D, { rz: i * 2.094, spin: v === 'calm' ? 1.3 : 8.5, follow: 1, hold: 1, y: .6, a: v === 'calm' ? .55 : 1 }); FX.ring(S.c, G.x, -1, r, D, { follow: 1, hold: 1 }); if (v === 'calm') { FX.ring('#ffffff', G.x, -1, r * .55, D, { follow: 1, hold: 1, a: .4 }); FX.glow(S.c, G.x, 1.2, -1, r * 2.2, D, { follow: 1, hold: 1, a: .3 }); } if (v === 'dashAura') FX.dragon.start(K, D, 9, .8); }
  else if (p.k === 'flow') FX.dragon.start(K, D, v === 'dragon' ? 22 : 13, v === 'dragon' ? 1.4 : .85);
  else if (p.k === 'slow') { gsap.to('#tint', { opacity: .55, duration: .25 }); gsap.to('#tint', { opacity: 0, duration: .5, delay: D }); FX.ring(S.c, G.x, -1, 2, .8, { grow: 5, follow: 1 }); }
}
function useWaza() {
  if (ST !== 'run' || G.over || !G.wz.length || G.gauge < 100 || G.fx || RIG.playing()) return;
  const w = G.wz[G.sel], p = w[3], col = hexOf(), a = actOf(p);
  G.gauge = 0; G.used[w[0] + ' ' + w[1]] = 1; sfx('waza'); flash(col, .2);
  const el = $('wz'); el.innerHTML = `<small>${esc(kk(R.key))}</small>${esc(w[0])}　${esc(w[1])}`; gsap.killTweensOf(el); gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: .62, y: 0, duration: .18 }); gsap.to(el, { opacity: 0, duration: .5, delay: 1.0 });
  if (p.H) G.sharp = Math.min(G.max, G.sharp + p.H);
  if (p.k === 'inst') { const hit = RIG.play(a) || .1; G.hit = hit + .14; G.inv = Math.max(G.inv, hit + (p.I || .45)); FX.trail.on(hit + .45); G.pend.push({ t: hit, f: () => { zoneKill(p.L, p.R, p.O); castFx(p); } }); }
  else { const D = p.k === 'multi' ? p.N * .1 + .15 : p.D; G.hit = .3; G.fx = { p, t: 0, D, tick: 0, n: 0 }; if (a) RIG.setLoop(a); FX.trail.on(D); if (p.k === 'slow') { G.slowT = p.D; G.slowS = p.S; } auraFx(p); }
}
function runStep(dt) {
  if (G.over) { G.over += dt; if (G.over > 1.1) showResult(); return 0; }
  if (G.hit > 0) G.hit -= dt; if (G.slowT > 0) G.slowT -= dt;
  const ts = (G.hit > 0 ? .3 : 1) * (G.slowT > 0 ? G.slowS : 1), wdt = dt * ts;
  G.t += wdt; G.speed = 13 + 17 * Math.min(1, G.dist / 1800); const mv = G.speed * wdt; G.dist += mv;
  const p1 = Math.min(1, G.dist / 1800), gap = G.dist < 1800 ? 18 - 8 * p1 : Math.max(7, 10 - (G.dist - 1800) / 1500);
  G.next -= mv; while (G.next <= 0) { spawnRow(); G.next += gap; }
  for (let i = G.pend.length - 1; i >= 0; i--) { const k = G.pend[i]; k.t -= dt; if (k.t <= 0) { G.pend.splice(i, 1); k.f(); } }
  // 続く型
  const F = G.fx; let immune = G.inv > 0, ghost = false, brk = false;
  if (G.inv > 0) G.inv -= dt;
  if (F) {
    F.t += dt; F.tick -= dt; const p = F.p, K = KEY();
    if (p.k === 'aura') { immune = true; ghost = !!p.G; brk = !!p.O; zoneKill(p.L, p.R, p.O); if (F.tick <= 0) { F.tick = .07; FX.burst(K, G.x + rnd(-1, 1) * (p.L >= 9 ? 3 : p.L * LW + 1), .8, -1 + rnd(-2, 1), 2, { sp: 4, world: 0 }); } }
    else if (p.k === 'flow') { immune = true; ghost = true; brk = !!p.O; const Lw = p.grow ? Math.min(2, Math.floor(F.t / F.D * 3)) : p.L; let tg = null; for (const e of ENT) if (!e.dead && e.type === 'oni' && e.z < -1 && e.z > -34 && (!tg || e.z > tg.z)) tg = e; if (tg && tg.lane !== G.lane) { G.lane = tg.lane; FX.arcFlat(K, G.x, -1, 3.4, .3, { rz: rnd(0, 6) }); } zoneKill(Lw, 7, p.O); if (F.tick <= 0) { F.tick = .06; FX.burst(K, G.x, 1, -.5, 2, { sp: 5 }); } }
    else if (p.k === 'rain') { if (F.tick <= 0) { F.tick = .2; zoneKill(9, p.R, p.O, -2.5); for (let i = 0; i < 4; i++) { const x = lx(Math.random() * 5 | 0), z = -4 - Math.random() * (p.R - 4); FX.vbeam(K, x, z, 12, 1.5, .32, { world: 1 }); FX.ring(STY[K].c, x, z, .8, .35, { grow: 6, world: 1 }); FX.burst(K, x, .4, z, 3, { sp: 6 }); } G.shake = Math.max(G.shake, .22); } }
    else if (p.k === 'multi') { immune = true; if (F.tick <= 0 && F.n < p.N) { F.tick = .1; F.n++; let tg = null; for (const e of ENT) if (!e.dead && e.type === 'oni' && e.z < 1 && e.z > -p.R && (!tg || e.z > tg.z)) tg = e; if (tg) { kill(tg, true); FX.beam(K, (G.x + tg.m.position.x) / 2, 0, tg.z, .7, .2); } else FX.arcVert(K, G.x + rnd(-.6, .6), -2, 3, .25, { rz: rnd(-1.5, 1.5), vz: -20 }); } }
    if (F.t >= F.D) { G.fx = null; G.inv = Math.max(G.inv, .4); RIG.setLoop(null); FX.dragon.stop(); }
  }
  if (!G.fx && G.gauge < 100) { const g0 = G.gauge; G.gauge = Math.min(100, G.gauge + 1.3 * wdt); if (g0 < 100 && G.gauge >= 100) sfx('full'); }
  if (G.t - G.lastCut > 1.0) G.sharp = Math.min(G.max, G.sharp + 10 * wdt); // 切れ味は、斬らずにいると戻る
  const tx = lx(G.lane); G.x += (tx - G.x) * Math.min(1, dt * 24); const pl = clamp(Math.round(G.x / LW) + 2, 0, 4);
  for (let i = ENT.length - 1; i >= 0; i--) {
    const e = ENT[i]; e.z += mv; e.m.position.z = e.z;
    if (e.dead) { e.dead += dt; const m = e.m, u = m.userData;
      if (e.type === 'oni' && u.head) { const h = u.head; e.vy -= 20 * dt; h.position.y += e.vy * dt; h.position.x += e.vx * dt; h.position.z -= 3 * dt; h.rotation.z += 11 * dt; h.rotation.x += 7 * dt; const s = Math.max(.01, 1 - e.dead / .5); u.body.scale.set(s, s * s, s); u.body.position.y = 0; if (e.dead > .38) h.scale.setScalar(Math.max(.01, 1 - (e.dead - .38) / .2)); }
      else { m.position.y += e.vy * dt; m.position.x += e.vx * dt; m.rotation.z += e.vx * dt; const s = Math.max(.01, 1 - e.dead / .34); m.scale.set(s, s, s); }
      if (e.dead > (e.type === 'oni' ? .58 : .34)) { m.visible = false; FREE[e.type].push(m); ENT.splice(i, 1); } continue; }
    if (e.type === 'oni') { e.m.position.y = Math.abs(Math.sin(G.t * 9 + e.ph)) * .12; e.m.rotation.z = Math.sin(G.t * 9 + e.ph) * .07; } else if (e.type === 'stone') { e.m.rotation.y += dt * 3; e.m.position.y = Math.sin(G.t * 4 + e.ph) * .12; }
    if (e.z > -.75 && e.z < .85 && e.lane === pl) {
      if (e.type === 'stone') { e.dead = .3; e.vx = 0; e.vy = 3; G.sharp = Math.min(G.max, G.sharp + 40); sfx('stone'); FX.glow('#cfe0ff', G.x, 1, 0, 3.5, .35, { follow: 1 }); FX.ring('#cfe0ff', G.x, 0, 1, .4, { grow: 5, follow: 1 }); }
      else if (e.type === 'oni') { if (immune) kill(e, true); else if (G.sharp >= G.cost) { G.sharp -= G.cost; G.lastCut = G.t; kill(e); RIG.play(G.cutN++ % 2 ? 'cutB' : 'cutA'); FX.trail.on(.3); } else die('dull'); }
      else { if (brk) smash(e); else if (ghost) { } else die('obs'); }
    }
    if (e.z > 12) { e.m.visible = false; FREE[e.type].push(e.m); ENT.splice(i, 1); }
  }
  return mv;
}
let tAll = 0, lastT = 0; const V1 = new THREE.Vector3(), V2 = new THREE.Vector3();
function frame(now) {
  requestAnimationFrame(frame);
  if (ST === 'title' || ST === 'grip' || ST === 'load') { renderer.toneMapping = THREE.ACESFilmicToneMapping; gripFrame(now); lastT = now; return; }
  const dt = Math.min(.05, (now - lastT) / 1000 || 0) * (DEV && window.__ts || 1); lastT = now; tAll += dt; if (document.hidden) return;
  renderer.toneMapping = THREE.NoToneMapping;
  let mv = 0; if (ST === 'run') mv = runStep(dt); else mv = 4 * dt;
  roadTex.offset.y += mv / 8; for (const s of SCEN) { s.m.position.z += mv; if (s.m.position.z > 16) s.m.position.z -= s.span; }
  const inRun = ST === 'run', run = inRun && !G.over && RIG.loop() !== 'calm', slow = inRun && (G.hit > 0 ? .3 : 1) * (G.slowT > 0 ? Math.max(.6, G.slowS) : 1);
  WREF.x = inRun ? G.x : 0; RIG.root.position.x = WREF.x; RIG.root.rotation.z = inRun ? clamp((lx(G.lane) - G.x) * -.3, -.35, .35) : 0;
  RIG.step(dt * (inRun ? slow || 1 : 1), run, run ? 13 + G.speed * .25 : 3);
  RIG.root.updateMatrixWorld(true); RIG.J.kat.localToWorld(V1.set(0, .18, 0)); RIG.J.kat.localToWorld(V2.set(0, 1.34, 0)); FX.trail.step(dt, V1, V2); FX.dragon.step(dt);
  const pp = P.pg.attributes.position; for (let i = 0; i < P.pv.length; i++) { let y = pp.getY(i) + P.pv[i] * dt; if (y > 2.9) y = 0; pp.setY(i, y); } pp.needsUpdate = true;
  const pulse = .85 + .15 * Math.sin(tAll * 5); P.aura.scale.set(3.0 * pulse, 4.0 * pulse, 1);
  FX.step(dt, mv);
  if (inRun) { G.shake = Math.max(0, G.shake - dt * 1.8); hudStep(); }
  const sh = inRun ? G.shake : 0, cx = inRun ? G.x * .35 : 0; camera.position.set(CAM.x + cx + (Math.random() - .5) * sh, CAM.y + (Math.random() - .5) * sh, CAM.z); camera.lookAt(cx, 1.1, -10);
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

// ---------- 握る（前作「色変わりの刀」の場面をそのまま使う） ----------
function prep(name) { R = judge(name); R.name = name; R.akaDone = false; R.kk = kk(R.key); R.forms = usable(R); R.slots = R.den >= 100 && R.forms.length >= 2 ? 2 : (R.forms.length ? 1 : 0); return R; }
function grip() {
  const name = $('nm').value.trim(); if (!name) { $('nmNote').textContent = T.needName; $('nmNote').classList.add('err'); gsap.fromTo('#nm', { x: -8 }, { x: 0, duration: .4, ease: 'elastic.out(1,.3)' }); return; }
  if (ST !== 'title') return; $('nmNote').textContent = ''; ac(); prep(name); ls.set('onikiri_name', name); $('title').hidden = true; $('hud').hidden = true; ST = 'grip'; gripSnd(SND); gripStart(R);
}
gripOnDone(r => { if (r !== R) return; if (R.key === 'nezuko') { toast(T.isOni); toTitle(); return; } flash(R.key === 'none' ? '#b9bec4' : COLORS[R.key].hex, .5); openPick(); });

// ---------- 技を選ぶ ----------
function openPick() {
  ST = 'pick'; clearEnts(); RIG.setLoop('idle'); setLook(1); $('hud').hidden = true; $('title').hidden = true; const W = WAZA[R.key] || [], C = COLORS[R.key], un = R.forms;
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
function toTitle() { $('hud').hidden = true; $('result').hidden = true; $('pick').hidden = true; clearEnts(); gripReset(); ST = 'title'; $('title').hidden = false; $('title').scrollTop = 0; }
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
const dayKey = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10).replace(/-/g, ''); // 日本の日付
async function submit(d, k, wz) {
  if (DEV || d < 30) return; const sent = ls.get('onikiri_sent', {}), rec = { n: R.name.slice(0, 16), d, k: R.key, t: R.den, c: k, w: String(wz).slice(0, 60), a: R.akaDone ? 1 : 0, ts: { '.sv': 'timestamp' } };
  const day = dayKey(), doAll = d > (sent.all || 0), doB = !!WAZA[R.key] && d > (sent[R.key] || 0), doD = d > (sent['d' + day] || 0); if (!doAll && !doB && !doD) return; const a = await auth(), q = '?auth=' + encodeURIComponent(a.token), o = { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rec) };
  if (doAll) { const r = await fx(DBU('r/' + a.uid) + q, o); if (r.ok) sent.all = d; }
  if (doB) { const r = await fx(DBU('b/' + R.key + '/' + a.uid) + q, o); if (r.ok) sent[R.key] = d; }
  if (doD) { const r = await fx(DBU('d/' + day + '/' + a.uid) + q, o); if (r.ok) { for (const k of Object.keys(sent)) if (k[0] === 'd' && k !== 'd' + day) delete sent[k]; sent['d' + day] = d; } }
  ls.set('onikiri_sent', sent);
}
let rkFrom = 'title', rkTab = 'all';
async function openRank(from) {
  rkFrom = from; $('title').hidden = true; $('result').hidden = true; $('rank').hidden = false; $('rank').scrollTop = 0;
  const tabs = [['all', T.rkAll], ['today', T.rkToday]]; if (R && WAZA[R.key]) tabs.push([R.key, R.kk]); if (!tabs.some(t => t[0] === rkTab)) rkTab = 'all';
  $('rkTabs').innerHTML = tabs.map(t => `<button data-t="${t[0]}" class="${t[0] === rkTab ? 'on' : ''}">${esc(t[1])}</button>`).join(''); $('rkTabs').querySelectorAll('button').forEach(b => b.onclick = () => { rkTab = b.dataset.t; openRank(rkFrom); });
  const box = $('rkBox'); box.innerHTML = '<p class="note">' + T.loading + '</p>';
  try { const r = await fx(DBU(rkTab === 'all' ? 'r' : rkTab === 'today' ? 'd/' + dayKey() : 'b/' + rkTab) + '?orderBy=%22d%22&limitToLast=50'); if (!r.ok) throw 0; const j = (await r.json()) || {}; const me = (AUTH || ls.get('onikiri_auth', {}) || {}).uid;
    const rows = Object.entries(j).map(([u, v]) => Object.assign({ u }, v)).filter(v => v && typeof v.d === 'number').sort((a, b) => b.d - a.d);
    if ($('rank').hidden) return; if (!rows.length) { box.innerHTML = '<p class="note">' + T.rkEmpty + '</p>'; return; }
    box.innerHTML = '<table class="rk">' + rows.map((v, i) => { const C = COLORS[v.k] || COLORS.none; return `<tr${v.u === me ? ' class="me"' : ''}><td class="n">${i + 1}</td><td>${esc(v.n || '')}${v.a ? '<span class="aka">' + (L === 'ja' ? '赫刀' : 'Crimson') + '</span>' : ''}<small><i style="background:${C.hex}"></i>${esc(C.kokyu[L] || C.kokyu.en)}・${T.den}${+v.t || 0}%${v.w ? '・' + esc(String(v.w)) : ''}</small></td><td class="d">${(+v.d).toLocaleString()}m<small>${T.kills(+v.c || 0)}</small></td></tr>`; }).join('') + '</table>';
  } catch (e) { box.innerHTML = '<p class="note err">' + T.rkErr + '</p>'; }
}
$('rkBtn').onclick = () => openRank('title'); $('rkBtn2').onclick = () => openRank('result');
$('rkBack').onclick = () => { $('rank').hidden = true; if (rkFrom === 'result' && LAST) $('result').hidden = false; else $('title').hidden = false; };

// ---------- はじめ ----------
applyLang(); gripSnd(SND); $('nm').value = ls.get('onikiri_name', '') || ''; $('load').hidden = true;
{ // 前作「色変わりの刀」の結果から来たとき：握る場面をとばして、すぐ技を選ぶところへ（名前は同じサイトの中で受けわたす）
  const go = /[?&]go=1/.test(location.search), h = go ? ls.get('onikiri_go', null) : null; let direct = false;
  if (h && h.n && Date.now() - (+h.t || 0) < 10 * 60e3) { const nm = String(h.n).trim().slice(0, 16); if (nm && judge(nm).key !== 'nezuko') { prep(nm); if (R.ch ? R.aka : !!h.a) R.akaDone = true; $('nm').value = nm; ls.set('onikiri_name', nm); direct = true; } }
  try { localStorage.removeItem('onikiri_go'); if (go) history.replaceState(null, '', location.pathname); } catch (e) { }
  if (direct) { openPick(); gsap.fromTo('#pick .card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'power3.out' }); }
  else { ST = 'title'; $('title').hidden = false; gsap.fromTo('#title .card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' }); }
}
if (DEV) window.__G = () => ({ ST, G, R, SEL, ENT: ENT.length, FXL: FX.count() });
requestAnimationFrame(frame);
