import { THREE, GLTFLoader } from './lib.js?v=11251614';
import { CHARS, KAIJU, NUMS, ABIL, RANKS, UNKNOWN, FORTS, BUCKETS } from './data.js?v=11251614';
const $ = id => document.getElementById(id);
const gsap = window.gsap, PFX = window.PFX;
const DEV = /[?&]dev=1/.test(location.search);
const FAST = /[?&]fast=1/.test(location.search);
const IS_PHONE = /iPhone|iPod|iPad|Android/i.test(navigator.userAgent || '');
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TTL = '解放戦力', FAN = '※非公式のファン診断です', TAG = '#解放戦力 #ブラウザゲーム';

// ---------- 名前から結果を決める（同じ名前なら必ず同じ結果） ----------
const kata2hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const clean = s => String(s || '').normalize('NFKC').replace(/[\s　]+/g, '');
const canonKey = s => kata2hira(clean(s)).toLowerCase();   // 原作キャラは漢字・ひらがな・カタカナ・空白のあるなしを同じに扱う
function hash(s, seed) { let h = (2166136261 ^ seed) >>> 0; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
function hkey(s) { const a = Math.floor(hash(s, 0x51ed) * 4294967296), b = Math.floor(hash(s, 0x9e37) * 4294967296); return (a.toString(36) + b.toString(36)).padStart(10, '0').slice(0, 14); }
const CMAP = new Map();
CHARS.forEach(c => [c.s + c.m, c.sy + c.my, c.s + c.my, c.sy + c.m, c.m, c.my].forEach(v => { const k = canonKey(v); if (!CMAP.has(k)) CMAP.set(k, c); })); // 名字だけは対象外
// 出やすさ（原作寄り：ふつうの隊員は20%前後、90%以上は約1%）
const DIST = [[.08, 1, 9], [.55, 10, 29], [.20, 30, 49], [.10, 50, 69], [.045, 70, 84], [.015, 85, 89], [.01, 90, 100]];
function pctOf(u, v) { let x = u; for (const [w, a, b] of DIST) { if (x < w) { const t = a >= 90 ? v * v : v; return Math.min(b, a + Math.floor(t * (b - a + 1))); } x -= w; } return 20; }
// 番号の読み取り（数字・全角・漢数字・ひらがな。「ななごう」「しちごう」のように読み方がちがっても同じ番号）
const KD = { '〇': 0, '零': 0, '一': 1, '壱': 1, '二': 2, '弐': 2, '三': 3, '参': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 'T', '百': 'H', '千': 'K' };
const HR = [['きゅう', 9], ['じゅう', 'T'], ['じっ', 'T'], ['ひゃく', 'H'], ['びゃく', 'H'], ['ぴゃく', 'H'], ['せん', 'K'], ['ぜん', 'K'], ['いち', 1], ['いっ', 1], ['さん', 3], ['よん', 4], ['ろく', 6], ['ろっ', 6], ['なな', 7], ['しち', 7], ['はち', 8], ['はっ', 8], ['れい', 0], ['ぜろ', 0], ['まる', 0], ['に', 2], ['し', 4], ['よ', 4], ['ご', 5], ['く', 9]];
function parseNum(r) {
  if (!r) return 0; const tk = []; let i = 0;
  while (i < r.length) { const ch = r[i]; if (ch >= '0' && ch <= '9') { tk.push(+ch); i++; continue; } if (ch in KD) { tk.push(KD[ch]); i++; continue; } const h = HR.find(([w]) => r.startsWith(w, i)); if (!h) return 0; tk.push(h[1]); i += h[0].length; }
  if (!tk.some(t => typeof t === 'string')) { const n = +tk.join(''); return n > 0 && n < 100000 ? n : 0; }
  const U = { T: 10, H: 100, K: 1000 }; let tot = 0, cur = null;
  for (const t of tk) { if (typeof t === 'number') cur = cur == null ? t : cur * 10 + t; else { tot += (cur == null ? 1 : cur) * U[t]; cur = null; } }
  tot += cur || 0; return tot > 0 && tot < 100000 ? tot : 0;
}
const kaijuWord = k => /怪獣|かいじゅう|kaiju/.test(k); // 「怪獣」の文字が入っていたら問答無用で怪獣行き
// 「怪獣6号」「怪獣六号」「怪獣ろくごう」「かいじゅうろくごう」「カイジュウ６ゴウ」…から番号を取りだす（番号でなければ 0）
function kaijuNo(k) {
  let r = k.replace(/^(識別|しきべつ)/, '').replace(/^(かいじゅう|kaiju)/, '怪獣'); if (!r.startsWith('怪獣')) return 0; r = r.slice(2).replace(/^(第|だい|no\.?|なんばー)/, '');
  if (r.endsWith('号')) return parseNum(r.slice(0, -1));
  if (r.endsWith('ごう')) { const n = parseNum(r.slice(0, -2)); if (n) return n; }
  return parseNum(r);
}
const abilPick = name => ABIL[Math.floor(hash(name, 0x6162) * ABIL.length)];
function judge(raw) {
  const name = [...clean(raw)].slice(0, 15).join(''), ck = canonKey(name), c = CMAP.get(ck);
  const R = { name, h: hkey('kaiho:' + name), type: 'human' };
  const kn = kaijuNo(ck);
  if (kn) { // 番号つきの怪獣：1〜15号は原作どおり。それ以外は、登録されている怪獣を照会する
    R.canon = true; R.h = hkey('kaiho:kaiju:' + kn); R.pct = 0; R.auto = true; const kj = KAIJU.find(x => x.no === kn);
    if (kj) R.kai = { f: kj.f, no: kj.no, canon: true, est: !!kj.est, ab: kj.ab, owner: kj.n || '' }; else R.lookup = kn; return R;
  }
  if (c) { R.canon = true; R.h = hkey('kaiho:canon:' + c.s + c.m); if (c.p == null) { R.type = 'unknown'; R.pct = null; } else { R.pct = c.p; if (c.k) { const kj = KAIJU.find(x => x.no === c.k.no); R.kai = { f: c.k.f, no: c.k.no, canon: true, ab: kj ? kj.ab : '' }; } } return R; }
  const r1 = hash(name, 0x6b31), r2 = hash(name, 0x6832), r3 = hash(name, 0x6633);
  if (r1 < .01 || kaijuWord(ck)) { R.pct = 0; R.kai = { f: Math.min(99, 80 + Math.floor(20 * Math.pow(r3, 1.7))), ab: abilPick(name) }; R.auto = kaijuWord(ck); return R; } // 100人に1人は0%（＝大怪獣）
  R.pct = pctOf(r2, r3); return R;
}
const rankOf = p => RANKS.find(r => p >= r.min);
const fortOf = f => FORTS.find(r => f >= r.min);
const bucketOf = p => p <= 0 ? 0 : Math.min(10, Math.floor(p / 10) + 1);
const fstr = f => f == null ? '不明' : (f / 10).toFixed(1);
const UNKF = { name: '大怪獣', word: '詳細は不明。記録だけが残る識別怪獣。' };
const fortX = f => f == null ? UNKF : fortOf(f);

// ---------- 音 ----------
let SND = ls.get('kaiho_snd', true), AC = null;
function sndLabel() { $('sndBtn').textContent = SND ? '🔊 音あり' : '🔇 音なし'; }
$('sndBtn').onclick = () => { SND = !SND; ls.set('kaiho_snd', SND); sndLabel(); };
function ac() { if (!SND) return null; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; } catch (e) { return null; } }
function tone(type, f0, f1, dur, vol, delay, lp) { const a = ac(); if (!a) return; const t = a.currentTime + (delay || 0), o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur); let n = o; if (lp) { const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; o.connect(f); n = f; } n.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.start(t); o.stop(t + dur + .03); }
function nz(dur, vol, ft, f0, f1, delay, q) { const a = ac(); if (!a) return; const t = a.currentTime + (delay || 0), b = a.createBuffer(1, Math.max(1, a.sampleRate * dur | 0), a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = a.createBufferSource(); s.buffer = b; const f = a.createBiquadFilter(); f.type = ft; f.Q.value = q || 1; f.frequency.setValueAtTime(f0, t); if (f1 !== f0) f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur); const g = a.createGain(); s.connect(f); f.connect(g); g.connect(a.destination); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur); s.start(t); s.stop(t + dur + .02); }
function sfx(k, p) {
  p = p || 0;
  if (k === 'tap') { tone('square', 260 + 900 * p, 520 + 1500 * p, .07, .09, 0, 2400 + 4000 * p); nz(.04, .07, 'highpass', 3000, 3000); }
  else if (k === 'dud') { tone('sine', 110, 70, .12, .22); nz(.05, .05, 'lowpass', 500, 300); }
  else if (k === 'beep') { tone('square', 880, 880, .09, .08, 0, 3000); }
  else if (k === 'go') { tone('square', 660, 660, .1, .1, 0, 3000); tone('square', 990, 990, .22, .1, .12, 3000); }
  else if (k === 'lock') { tone('sine', 150, 38, .9, .6); nz(.5, .32, 'bandpass', 5200, 900, 0, 1.2);[1320, 1980, 2640].forEach((f, i) => tone('sine', f, f, 1.6 - i * .3, .1 / (i + 1), .02)); }
  else if (k === 'big') { tone('sawtooth', 220, 880, .5, .12, 0, 2600); tone('sawtooth', 330, 1320, .5, .1, .08, 3000);[1047, 1319, 1568, 2093].forEach((f, i) => tone('triangle', f, f, .5, .12, .45 + i * .09)); }
  else if (k === 'err') { tone('square', 160, 150, .28, .16, 0, 900); tone('square', 160, 150, .28, .16, .34, 900); }
  else if (k === 'crack') { nz(.5, .5, 'highpass', 2600, 7000, 0, .7); for (let i = 0; i < 7; i++) nz(.03, .4, 'bandpass', 3000 + Math.random() * 5000, 3000, i * .05 + Math.random() * .03, 6); tone('sine', 90, 30, .7, .5); }
  else if (k === 'siren') { for (let i = 0; i < 3; i++) { tone('sawtooth', 520, 780, .32, .07, i * .6, 2200); tone('sawtooth', 780, 520, .28, .07, i * .6 + .32, 2200); } }
  else if (k === 'thump') { tone('sine', 95 + 60 * p, 34, .22, .5); nz(.08, .12, 'lowpass', 700, 200); }
  else if (k === 'roar') { tone('sawtooth', 92, 44, 1.6, .34, 0, 520); tone('sawtooth', 61, 33, 1.7, .3, .03, 380); nz(1.5, .3, 'bandpass', 700, 180, 0, .8); tone('sine', 60, 24, 1.8, .6); }
  else if (k === 'stamp') { tone('sine', 180, 40, .35, .6); nz(.12, .3, 'lowpass', 1800, 300); }
  else if (k === 'num') { tone('square', 1200, 1200, .05, .06, 0, 4000); }
}
let HUM = null;
function humOn() { if (HUM) return; const a = ac(); if (!a) return; const t = a.currentTime, o = a.createOscillator(), o2 = a.createOscillator(), f = a.createBiquadFilter(), g = a.createGain(); o.type = 'sawtooth'; o2.type = 'sine'; o.frequency.value = 55; o2.frequency.value = 110; f.type = 'lowpass'; f.frequency.value = 240; o.connect(f); o2.connect(f); f.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.07, t + .3); o.start(t); o2.start(t); HUM = { o, o2, f, g, a }; }
function humSet(p, k) { if (!HUM) return; const t = HUM.a.currentTime; HUM.o.frequency.setTargetAtTime(k ? 40 + 30 * p : 55 + 150 * p, t, .06); HUM.o2.frequency.setTargetAtTime(k ? 80 + 40 * p : 110 + 420 * p, t, .06); HUM.f.frequency.setTargetAtTime(k ? 200 + 500 * p : 240 + 2000 * p, t, .06); HUM.g.gain.setTargetAtTime(.05 + .09 * p, t, .08); }
function humStop() { if (!HUM) return; const { o, o2, g, a } = HUM, t = a.currentTime; try { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(Math.max(.0001, g.gain.value), t); g.gain.exponentialRampToValueAtTime(.0001, t + .25); o.stop(t + .3); o2.stop(t + .3); } catch (e) { } HUM = null; }

// ---------- 3D ----------
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas: $('gl'), antialias: true, preserveDrawingBuffer: true }); } catch (e) { $('load').textContent = 'この端末では3Dを表示できませんでした'; throw e; }
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor('#05080c');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, .1, 120);
const CAM = { d: 9.4, y: 1.5, ty: 1.35, off: .27, yaw: 0, roll: 0 };
const CYAN = new THREE.Color('#3fe0ff'), RED = new THREE.Color('#ff2a1a'), AMBER = new THREE.Color('#ffb020');
// みんなで使う値：uProg＝光の高さ(0〜1)、uPulse＝連打の脈、uKai＝怪獣側(0〜1)、uKp＝怪獣の力(0〜1)、uErr＝反応なしの点滅、uPow＝全身の発光
const G = { uTime: { value: 0 }, uProg: { value: 0 }, uPulse: { value: 0 }, uKai: { value: 0 }, uKp: { value: 0 }, uErr: { value: 0 }, uPow: { value: 0 }, uCol: { value: CYAN.clone() }, uWave: { value: 0 }, uWave2: { value: 0 }, uBeam: { value: 0 } };
const TM = '\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n';
const NOISE = `
float h21(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
vec2 h22(vec2 p){ float n = h21(p); return vec2(n, h21(p+n+7.13)); }
float crack(vec2 p){ vec2 g = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0; for(int y=-1;y<=1;y++){ for(int x=-1;x<=1;x++){ vec2 o = vec2(float(x),float(y)); vec2 r = o + h22(g+o) - f; float d = dot(r,r); if(d<d1){ d2=d1; d1=d; } else if(d<d2){ d2=d; } } } return sqrt(d2)-sqrt(d1); }
`;
// スーツ（つるっとした人型）。筋が下から光っていく。怪獣側ではひび割れが光る
const suitMat = new THREE.ShaderMaterial({
  uniforms: G, vertexColors: true,
  vertexShader: `varying vec3 vW; varying vec3 vN; varying vec3 vV; varying vec3 vC;
    void main(){ vC = vec3(0.0);
      #ifdef USE_COLOR
      vC = color.rgb;
      #endif
      vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vV = cameraPosition - w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  fragmentShader: `uniform float uTime,uProg,uPulse,uKai,uKp,uErr,uPow; uniform vec3 uCol; varying vec3 vW; varying vec3 vN; varying vec3 vV; varying vec3 vC;` + NOISE + `
    void main(){
      vec3 n = normalize(vN), v = normalize(vV);
      float fr = pow(1.0 - clamp(dot(n,v),0.0,1.0), 2.2);
      float df = clamp(dot(n, normalize(vec3(.35,.85,.55))),0.0,1.0);
      float df2 = clamp(dot(n, normalize(vec3(-.7,.25,-.5))),0.0,1.0);
      vec3 base = mix(mix(vec3(.05,.07,.095), vec3(.13,.16,.19), vC.g), vec3(.022,.017,.019), uKai);
      float sp = pow(clamp(dot(n, normalize(normalize(vec3(.35,.85,.55)) + v)),0.0,1.0), 40.0);
      vec3 c = base*(.3 + 1.15*df) + mix(vec3(.10,.19,.27), vec3(.32,.03,.03), uKai)*df2*.9;
      c += fr * mix(vec3(.13,.24,.32), vec3(.36,.04,.04), uKai);
      c += sp * mix(vec3(.35,.45,.5)*(.5+vC.g), vec3(.5,.12,.08), uKai);
      float h = clamp(vW.y/2.78, 0.0, 1.0);
      float ang = atan(vW.z, vW.x);
      float seam = smoothstep(.05,.0,abs(fract(ang*4.0/6.2831853+.125)-.5));
      float band = smoothstep(.07,.0,abs(fract(vW.y*2.4+.2)-.5));
      float ln = max(max(seam, band)*.22*(1.0-vC.g), step(.5,vC.r));
      float on = step(.001,uProg);
      float lit = smoothstep(uProg+.015, uProg-.03, h) * on;
      float fl = .55+.45*sin(vW.y*22.0 - uTime*10.0);
      vec3 e = uCol * ln * lit * (1.2 + 2.8*uPulse) * fl;
      e += uCol * exp(-pow((h-uProg)*26.0,2.0)) * on * (1.1+2.2*uPulse);
      e += uCol * lit * fr * (.55 + 1.5*uPulse + 1.6*uPow);
      e += uCol * lit * uPow * .35;
      e += uCol * ln * .10;
      e += uCol * step(.5,vC.b) * (1.3 + 2.2*uPulse + 1.5*clamp(uProg*2.0,0.0,1.0)) * (1.0-uKai);
      e += vec3(1.0,.16,.08) * ln * uErr * step(.5, fract(uTime*9.0));
      vec2 cp = vec2(ang*1.7, vW.y*2.3) * 2.2;
      float cr = crack(cp);
      float ck = smoothstep(.10,.0,cr);
      vec3 ke = vec3(1.0,.15,.05) * ck * (.22 + 2.4*uKp + 2.6*uPulse) * (.7+.3*sin(uTime*6.0 + vW.y*5.0));
      ke += vec3(1.0,.62,.35) * smoothstep(.03,.0,cr) * (uKp*1.4 + uPulse);
      ke += vec3(1.0,.10,.04) * fr * (.35 + 1.8*uKp + uPulse);
      e = mix(e, ke, uKai);
      gl_FragColor = vec4(c + e, 1.0);` + TM + `}`
});
const fig = new THREE.Group(); scene.add(fig);
const figH = new THREE.Group(), figK = new THREE.Group(); fig.add(figH, figK); figK.visible = false; // 人の側（スーツ）と、怪獣の側
// Blender で作ったモデルの目・胸の位置（build_models.py が書きだした値）
const PT = { suit: { eye: [0, 2.551, .136], chest: [0, 2.125, .2] }, kaiju: { eyeL: [.054, 2.877, .275], eyeR: [-.052, 2.878, .275], chest: [0, 2.267, .33] } };
{ // 読みこめるまでの仮の人型（丸と筒）
  const tmp = new THREE.Group(); figH.add(tmp); const capG = (r, l) => new THREE.CapsuleGeometry(r, l, 6, 14), sphG = r => new THREE.SphereGeometry(r, 18, 12);
  const part = (geo, x, y, z, sx, sy, sz) => { const m = new THREE.Mesh(geo, suitMat); m.position.set(x, y, z); m.scale.set(sx || 1, sy || 1, sz || 1); tmp.add(m); };
  part(capG(.33, .9), 0, 1.6, 0, 1.1, 1, .7); part(sphG(.24), 0, 2.5, 0, .92, 1.08, 1);[-1, 1].forEach(s => { part(capG(.11, 1.1), s * .6, 1.5, 0); part(capG(.15, 1.0), s * .2, .6, 0); });
  const ld = new GLTFLoader(), use = (g, par, done) => { g.scene.traverse(o => { if (o.isMesh) { o.material = suitMat; o.frustumCulled = false; } }); par.add(g.scene); done && done(); };
  ld.load('suit.glb?v=11251614', g => use(g, figH, () => figH.remove(tmp)), undefined, () => { });
  ld.load('kaiju.glb?v=11251614', g => use(g, figK), undefined, () => { const c = tmp.clone(); c.scale.setScalar(1.15); figK.add(c); });
}
// 目（怪獣側）
const eyeMat = new THREE.SpriteMaterial({ map: null, color: '#ff5a2a', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
const eyes = [PT.kaiju.eyeL, PT.kaiju.eyeR].map(p => { const m = new THREE.Sprite(eyeMat); m.position.set(p[0], p[1], p[2]); m.scale.set(.2, .1, 1); figK.add(m); return m; });
// ぼんやりした光（胸の芯と、うしろのオーラ）
function glowTex() { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, '#ffffffff'); g.addColorStop(.25, '#ffffff88'); g.addColorStop(.6, '#ffffff22'); g.addColorStop(1, '#ffffff00'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); return t; }
const GT = glowTex(); eyeMat.map = GT;
const coreMat = new THREE.SpriteMaterial({ map: GT, color: CYAN.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false });
const core = new THREE.Sprite(coreMat); core.position.set(PT.suit.chest[0], PT.suit.chest[1], PT.suit.chest[2] + .05); core.scale.setScalar(1.2); fig.add(core);
const auraMat = new THREE.SpriteMaterial({ map: GT, color: CYAN.clone(), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
const aura = new THREE.Sprite(auraMat); aura.position.set(0, 1.5, -.6); aura.scale.set(5.2, 6.4, 1); scene.add(aura);
// 床（測定台）
const floorMat = new THREE.ShaderMaterial({
  uniforms: G, vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `uniform float uTime,uProg,uPulse,uKai,uKp,uWave,uWave2,uPow; uniform vec3 uCol; varying vec2 vP;
    void main(){ float r = length(vP); float a = atan(vP.y,vP.x);
      vec3 col = mix(uCol, vec3(1.0,.14,.07), uKai);
      vec3 c = vec3(.012,.018,.024);
      float rings = smoothstep(.035,.0,abs(fract(r*1.5)-.5));
      float spokes = smoothstep(.016,.0,abs(fract(a*16.0/6.2831853)-.5)) * smoothstep(1.2,1.6,r);
      float hexm = smoothstep(.03,.0,abs(fract(r*6.0 - uTime*.6)-.5)) * smoothstep(1.15,.2,r);
      float pw = uProg + uKp;
      c += col * (rings*.30 + spokes*.22) * (.22 + .9*pw + .6*uPulse);
      c += col * hexm * (.10 + .5*pw + .8*uPulse);
      c += col * smoothstep(.06,.0,abs(r-1.2)) * (.7 + 1.6*uPulse + 1.5*pw);
      c += col * smoothstep(1.2,.0,r) * (.05 + .28*pw + .3*uPulse + .5*uPow);
      float w1 = smoothstep(.32,.0,abs(r - uWave)) * step(.01,uWave) * clamp(1.0 - uWave/8.0,0.0,1.0);
      float w2 = smoothstep(.5,.0,abs(r - uWave2)) * step(.01,uWave2) * clamp(1.0 - uWave2/8.0,0.0,1.0);
      c += col * (w1*2.2 + w2*1.6);
      c *= smoothstep(8.0, 2.4, r);
      gl_FragColor = vec4(c,1.0);` + TM + `}`
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), floorMat); floor.rotation.x = -Math.PI / 2; scene.add(floor);
// 壁（試験場の筒）
const wallMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, uniforms: G, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `uniform float uTime,uProg,uKai,uKp,uPulse,uPow; uniform vec3 uCol; varying vec2 vUv;` + NOISE + `
    void main(){ vec2 u = vUv; vec2 cell = vec2(u.x*28.0, u.y*7.0); vec2 id = floor(cell), f = fract(cell);
      vec3 col = mix(uCol, vec3(1.0,.12,.06), uKai);
      float rnd = h21(id);
      vec3 c = vec3(.014,.02,.027) + vec3(.012,.018,.024)*rnd;
      float edge = max(step(.955,f.x), step(.93,f.y));
      c *= 1.0 - edge*.55;
      float lamp = step(.86,rnd) * smoothstep(.5,.2,abs(f.y-.5)) * smoothstep(.12,.06,abs(f.x-.5));
      float pw = uProg + uKp;
      c += col * lamp * (.5 + 1.6*pw + 1.2*uPulse) * (.75+.25*sin(uTime*3.0 + rnd*40.0));
      float strip = smoothstep(.012,.0,abs(u.y-.16)) + smoothstep(.012,.0,abs(u.y-.52));
      c += col * strip * (.3 + .9*pw);
      float sw = pow(max(0.0, cos(u.x*6.2831853*2.0 - uTime*5.0)), 10.0) * uKai;
      c += vec3(1.0,.05,.02) * sw * .55;
      c = mix(c, c*vec3(1.7,.45,.42), uKai);
      c += col * uPow * .06;
      c *= smoothstep(1.0,.72,u.y) * smoothstep(-.05,.14,u.y);
      gl_FragColor = vec4(c,1.0);` + TM + `}`
});
const wall = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 12, 56, 1, true), wallMat); wall.position.y = 5; scene.add(wall);
// 測定の輪
const ringMat = new THREE.MeshBasicMaterial({ color: CYAN.clone(), transparent: true, opacity: .25, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
const rings = [[1.32, .014, Math.PI * 1.5], [1.48, .01, Math.PI * 1.1], [1.18, .02, Math.PI * .7], [1.62, .008, Math.PI * 1.8]].map(([r, t, arc], i) => { const m = new THREE.Mesh(new THREE.TorusGeometry(r, t, 6, 72, arc), ringMat); m.rotation.x = Math.PI / 2; m.userData = { sp: (i % 2 ? -1 : 1) * (.5 + i * .35), ph: i * 1.7 }; scene.add(m); return m; });
// 光の柱（測定が決まった瞬間）
const beamMat = new THREE.ShaderMaterial({
  uniforms: G, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: 'uniform float uBeam,uTime,uKai; uniform vec3 uCol; varying vec2 vUv; void main(){ vec3 col = mix(uCol, vec3(1.0,.2,.08), uKai); float s = .6+.4*sin(vUv.x*60.0 + uTime*20.0); float a = uBeam * pow(1.0-vUv.y, 1.6) * s; gl_FragColor = vec4(col*a*1.4, a); }'
});
const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 9, 40, 1, true), beamMat); beam.position.y = 4.5; scene.add(beam);
// 光の粒
const PN = 320, pGeo = new THREE.BufferGeometry(), pPos = new Float32Array(PN * 3), pVel = new Float32Array(PN * 3), pLife = new Float32Array(PN), pA = new Float32Array(PN); let pIdx = 0;
for (let i = 0; i < PN; i++) pPos[i * 3 + 1] = -99;
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pGeo.setAttribute('aA', new THREE.BufferAttribute(pA, 1));
const pMat = new THREE.ShaderMaterial({
  uniforms: { uCol: G.uCol, uKai: G.uKai, uPx: { value: 1 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: 'attribute float aA; varying float vA; uniform float uPx; void main(){ vA = aA; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = uPx * (10.0 + 70.0*aA) / -mv.z; gl_Position = projectionMatrix * mv; }',
  fragmentShader: 'uniform vec3 uCol; uniform float uKai; varying float vA; void main(){ float d = length(gl_PointCoord-.5); float a = smoothstep(.5,.0,d) * vA; vec3 col = mix(uCol, vec3(1.0,.3,.1), uKai); gl_FragColor = vec4(mix(col, vec3(1.0), smoothstep(.2,.0,d)*.6)*a, a); }'
});
scene.add(new THREE.Points(pGeo, pMat));
function emit(n, burst) { for (let k = 0; k < n; k++) { const i = pIdx++ % PN, a = Math.random() * 6.283, r = burst ? .3 + Math.random() * .5 : .5 + Math.random() * .9; pPos[i * 3] = Math.cos(a) * r; pPos[i * 3 + 1] = burst ? .6 + Math.random() * 1.8 : .05 + Math.random() * .3; pPos[i * 3 + 2] = Math.sin(a) * r; const sp = burst ? 2.5 + Math.random() * 5 : .3; pVel[i * 3] = Math.cos(a) * sp; pVel[i * 3 + 1] = burst ? (Math.random() - .2) * 4 : 1.6 + Math.random() * 2.6; pVel[i * 3 + 2] = Math.sin(a) * sp; pLife[i] = .7 + Math.random() * .8; } }
function stepP(dt) { for (let i = 0; i < PN; i++) { if (pLife[i] <= 0) { pA[i] = 0; continue; } pLife[i] -= dt; pPos[i * 3] += pVel[i * 3] * dt; pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt; pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt; pVel[i * 3] *= .96; pVel[i * 3 + 2] *= .96; pA[i] = Math.max(0, Math.min(1, pLife[i] * 1.6)); } pGeo.attributes.position.needsUpdate = true; pGeo.attributes.aA.needsUpdate = true; }
// 浮きあがるがれき（怪獣側）
scene.add(new THREE.HemisphereLight('#ff7a5a', '#100404', 1.2));
const rockMat = new THREE.MeshStandardMaterial({ color: '#191316', roughness: .85, metalness: .1, emissive: '#ff2a10', emissiveIntensity: 0, transparent: true, opacity: 0 });
const rocks = []; for (let i = 0; i < 26; i++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(.07 + Math.random() * .16, 0), rockMat), a = Math.random() * 6.283, r = 1.3 + Math.random() * 2.6; m.userData = { a, r, y: Math.random() * 3.2, sp: .15 + Math.random() * .5, rs: Math.random() * 2 }; m.scale.set(1, .6 + Math.random() * .9, 1); scene.add(m); rocks.push(m); }

// ---------- 画面の大きさ・カメラ ----------
let VW = 1, VH = 1, shake = 0, tAll = 0, lastT = performance.now(), ST = 'load';
function resize() { VW = innerWidth; VH = innerHeight; renderer.setSize(VW, VH, false); camera.aspect = VW / VH; pMat.uniforms.uPx.value = renderer.getPixelRatio() * VH / 800; const c = $('crack'); const pr = Math.min(2, window.devicePixelRatio || 1); c.width = VW * pr; c.height = VH * pr; crackDraw(); const s = $('seis'); s.width = VW * pr; s.height = 54 * pr; }
addEventListener('resize', resize);
function frame(now) {
  const rdt = Math.min(1, (now - lastT) / 1000), dt = Math.min(.1, rdt); lastT = now; tAll += dt; G.uTime.value = tAll;
  G.uPulse.value *= Math.exp(-dt * 7);
  if (M && M.live) measureStep(rdt);
  const kai = G.uKai.value, pw = Math.max(G.uProg.value, G.uKp.value);
  // 輪
  rings.forEach((m, i) => { m.rotation.z += dt * m.userData.sp * (1 + pw * 3 + G.uPulse.value * 2); m.position.y = .12 + (i / 3) * 2.5 * (kai > .5 ? G.uKp.value : G.uProg.value) + Math.sin(tAll * 1.3 + m.userData.ph) * .04; });
  ringMat.opacity = .16 + .5 * pw + .5 * G.uPulse.value; ringMat.color.copy(G.uCol.value).lerp(RED, kai);
  // 光
  coreMat.opacity = Math.min(1, (kai > .5 ? .25 + G.uKp.value : G.uProg.value * .8) + G.uPulse.value * .6 + G.uPow.value); coreMat.color.copy(G.uCol.value).lerp(RED, kai); core.scale.setScalar(1.0 + pw * 1.4 + G.uPulse.value * .7 + G.uPow.value * 1.5);
  auraMat.opacity = Math.min(.9, .05 + pw * .4 + G.uPulse.value * .25 + G.uPow.value * .5); auraMat.color.copy(G.uCol.value).lerp(RED, kai);
  eyeMat.opacity = kai * (.75 + .25 * Math.sin(tAll * 9)); eyes.forEach(e => e.scale.set(.2 + G.uPulse.value * .12 + G.uKp.value * .08, .09 + G.uPulse.value * .06, 1));
  // 立ち姿（息づかい・ふるえ）
  const tr = (kai > .5 ? G.uKp.value * .02 : G.uProg.value * .008) + G.uPulse.value * .012;
  fig.position.set((Math.random() - .5) * tr, 0, (Math.random() - .5) * tr);
  fig.scale.y = fig.scale.x * (1 + Math.sin(tAll * (1.6 + kai * 2.4)) * (.004 + kai * .008));
  // がれき
  rockMat.opacity = kai; rockMat.emissiveIntensity = kai * (.03 + G.uKp.value * .12 + G.uPulse.value * .25);
  rocks.forEach(m => { const u = m.userData; u.y += dt * u.sp * (.3 + G.uKp.value * 1.8) * kai; if (u.y > 4.4) u.y = 0; m.position.set(Math.cos(u.a + tAll * .1) * u.r, kai > .01 ? u.y : -5, Math.sin(u.a + tAll * .1) * u.r); m.rotation.x += dt * u.rs; m.rotation.y += dt * u.rs * .7; });
  if ((ST === 'title' || ST === 'result') && Math.random() < dt * 6) emit(1);
  stepP(dt);
  shake *= Math.exp(-dt * 5);
  const a = Math.sin(tAll * .22) * .2 + CAM.yaw, sx = (Math.random() - .5) * shake, sy = (Math.random() - .5) * shake;
  camera.position.set(Math.sin(a) * CAM.d + sx, CAM.y + sy, Math.cos(a) * CAM.d); camera.lookAt(sx * .5, CAM.ty + sy * .5, 0); camera.rotation.z += CAM.roll + (Math.random() - .5) * shake * .05;
  camera.setViewOffset(VW, VH, 0, Math.round(CAM.off * VH), VW, VH);
  if (SEIS.on) seisDraw(dt);
  renderer.render(scene, camera); requestAnimationFrame(frame);
}
function camTo(o, dur, ease) { return gsap.to(CAM, Object.assign({ duration: dur || 1, ease: ease || 'power3.inOut', overwrite: true }, o)); }
function wave(k) { const u = k ? G.uWave2 : G.uWave; gsap.fromTo(u, { value: .05 }, { value: 8, duration: k ? 1.5 : 1.1, ease: 'power2.out', onComplete() { u.value = 0; } }); }
function beamUp(v) { gsap.fromTo(G.uBeam, { value: v || 1 }, { value: 0, duration: 1.4, ease: 'power2.out' }); }
function flash(hex, v, d) { const f = $('flash'); f.style.background = hex; gsap.fromTo(f, { opacity: v || .8 }, { opacity: 0, duration: d || .7, ease: 'power2.out', overwrite: true }); }

// ---------- 2Dの演出（pixelfx） ----------
const fctx = $('fxc').getContext('2d'); let FXS = [], fxRaf = 0, fxLast = 0, fxFrame = null, fxImg = null;
function ramp(hex) { const c = new THREE.Color(hex), o = []; for (let i = 0; i < 8; i++) { const t = i / 7, k = c.clone().multiplyScalar(.6 + .4 * Math.min(1, t * 1.4)).lerp(new THREE.Color('#ffffff'), Math.max(0, t - .55) * 1.6); o.push('#' + k.getHexString()); } return o; }
function fxAdd(mod, o) { try { if (!PFX || !mod) return; if (!fxFrame) { fxFrame = PFX.createFrame(160, 160); fxImg = new ImageData(160, 160); } const f = PFX.createFx(mod, o); f._life = mod === PFX.fx.confetti ? 3 : 1.4; FXS.push(f); if (!fxRaf) { fxLast = performance.now(); fxRaf = requestAnimationFrame(fxLoop); } } catch (e) { } }
function fxLoop(now) { const dt = Math.min(.05, (now - fxLast) / 1000); fxLast = now; try { PFX.clearFrame(fxFrame); FXS = FXS.filter(f => { f.update(dt); f.draw(fxFrame, 'back'); f.draw(fxFrame, 'front'); f._life -= dt; return !f.done() && f._life > 0; }); PFX.composite(fxFrame, fxImg.data, null); fctx.putImageData(fxImg, 0, 0); } catch (e) { FXS = []; } if (FXS.length) fxRaf = requestAnimationFrame(fxLoop); else { fxRaf = 0; fctx.clearRect(0, 0, 160, 160); } }

// 大きめのドット絵エフェクト（道具箱の pixelfx：プラズマ爆発・地面への一撃・落雷・電磁パルス・吸いこみ・画面の乱れ）
const PFX2 = window.PFX2, f2 = $('fx2').getContext('2d'); let FX2 = [], fx2Raf = 0, fx2Last = 0, fx2Frame = null, fx2Img = null;
function fx2Add(name, o, life) { try { if (!PFX2 || !PFX2.fx[name]) return; if (!fx2Frame) { fx2Frame = PFX2.createFrame(320, 300); fx2Img = new ImageData(320, 300); } const f = PFX2.createFx(PFX2.fx[name], o); f._life = life || 4; FX2.push(f); if (!fx2Raf) { fx2Last = performance.now(); fx2Raf = requestAnimationFrame(fx2Loop); } } catch (e) { } }
function fx2Loop(now) { const dt = Math.min(.05, (now - fx2Last) / 1000); fx2Last = now; try { PFX2.clearFrame(fx2Frame); FX2 = FX2.filter(f => { f.update(dt); f.draw(fx2Frame, 'back'); f.draw(fx2Frame, 'front'); f._life -= dt; return !f.done() && f._life > 0; }); PFX2.composite(fx2Frame, fx2Img.data, null); f2.putImageData(fx2Img, 0, 0); } catch (e) { FX2 = []; } if (FX2.length) fx2Raf = requestAnimationFrame(fx2Loop); else { fx2Raf = 0; f2.clearRect(0, 0, 320, 300); } }

// ---------- 画面のひび割れ ----------
const CRK = { paths: [], prog: 0, alpha: 1, ox: 0, oy: 0 };
function crackMake(ox, oy) {
  CRK.ox = ox; CRK.oy = oy; CRK.paths = []; const far = Math.hypot(VW, VH);
  const grow = (x, y, ang, len, w, depth, t0) => { const pts = [[x, y]]; let L = 0, a = ang; while (L < len) { const seg = 18 + Math.random() * 46; a += (Math.random() - .5) * .75; x += Math.cos(a) * seg; y += Math.sin(a) * seg; L += seg; pts.push([x, y]); if (depth < 2 && Math.random() < .22) grow(x, y, a + (Math.random() < .5 ? -1 : 1) * (.5 + Math.random() * .7), len * (.25 + Math.random() * .3), w * .6, depth + 1, t0 + L / far * .9); a += (ang - a) * .35; } CRK.paths.push({ pts, w, t0, len: L }); };
  const n = 9; for (let i = 0; i < n; i++) grow(ox, oy, i / n * 6.283 + (Math.random() - .5) * .4, far * (.5 + Math.random() * .55), 2.4 + Math.random() * 1.6, 0, 0);
  // ボタンのまわりの輪のひび
  for (let k = 0; k < 3; k++) { const r = 60 + k * 62 + Math.random() * 20, a0 = Math.random() * 6.283, pts = []; for (let j = 0; j <= 9; j++) { const a = a0 + j / 9 * (1.6 + Math.random() * .8), rr = r + (Math.random() - .5) * 16; pts.push([ox + Math.cos(a) * rr, oy + Math.sin(a) * rr]); } CRK.paths.push({ pts, w: 1.6, t0: .08 + k * .08, len: r * 2 }); }
}
function crackDraw() {
  const c = $('crack'), x = c.getContext('2d'), pr = c.width / Math.max(1, VW); x.setTransform(pr, 0, 0, pr, 0, 0); x.clearRect(0, 0, VW, VH); if (!CRK.paths.length || CRK.alpha <= 0) return;
  const far = Math.hypot(VW, VH);
  const stroke = (col, wmul, blur) => { x.strokeStyle = col; x.shadowColor = col; x.shadowBlur = blur; x.lineCap = 'round'; x.lineJoin = 'round'; for (const p of CRK.paths) { const t = (CRK.prog - p.t0) / Math.max(.05, p.len / far * .9); if (t <= 0) continue; const lim = Math.min(1, t) * p.len; let L = 0; x.lineWidth = p.w * wmul; x.beginPath(); x.moveTo(p.pts[0][0], p.pts[0][1]); for (let i = 1; i < p.pts.length; i++) { const [ax, ay] = p.pts[i - 1], [bx, by] = p.pts[i], seg = Math.hypot(bx - ax, by - ay); if (L + seg > lim) { const k = (lim - L) / seg; x.lineTo(ax + (bx - ax) * k, ay + (by - ay) * k); break; } x.lineTo(bx, by); L += seg; } x.stroke(); } };
  x.globalAlpha = CRK.alpha; x.globalCompositeOperation = 'lighter';
  stroke('#ff2a10', 3.2, 18); stroke('#ff7a4a', 1.5, 8); x.globalCompositeOperation = 'source-over'; stroke('#ffffff', .5, 0); x.globalAlpha = 1; x.shadowBlur = 0;
}
function crackClear() { CRK.paths = []; CRK.prog = 0; CRK.alpha = 1; crackDraw(); }

// ---------- 地震計のような波（怪獣側） ----------
const SEIS = { on: false, amp: 0, buf: new Float32Array(160), t: 0 };
function seisDraw(dt) { const c = $('seis'), x = c.getContext('2d'), W = c.width, H = c.height; SEIS.t += dt; while (SEIS.t > .016) { SEIS.t -= .016; SEIS.buf.copyWithin(0, 1); SEIS.buf[159] = (Math.random() - .5) * 2 * (SEIS.amp + G.uPulse.value * .6); } x.clearRect(0, 0, W, H); x.strokeStyle = '#ff4a3a'; x.shadowColor = '#ff2a1a'; x.shadowBlur = 8; x.lineWidth = Math.max(1.5, H / 30); x.beginPath(); for (let i = 0; i < 160; i++) { const px = i / 159 * W, py = H / 2 + SEIS.buf[i] * H * .46; if (i) x.lineTo(px, py); else x.moveTo(px, py); } x.stroke(); }

// ---------- 測定の表示 ----------
const GN = 26; ['gauge', 'gaugeL'].forEach(id => { const g = $(id); for (let i = 0; i < GN; i++) g.appendChild(document.createElement('i')); });
function setGauge(fr) { const n = Math.round(Math.max(0, Math.min(1, fr)) * GN);['gauge', 'gaugeL'].forEach(id => { const k = $(id).children; for (let i = 0; i < GN; i++) k[i].classList.toggle('on', i < n); }); }
function setVal(v, u, size) { $('hVal').textContent = v; $('hUnit').textContent = u; $('hVal').style.fontSize = size ? size + 'px' : ''; }
function cap(t, hold) { const c = $('cap'); c.textContent = t; gsap.killTweensOf(c); gsap.fromTo(c, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: .28, ease: 'power3.out' }); gsap.to(c, { opacity: 0, duration: .3, delay: hold || .9 }); }
function ripple(k) { const b = $('tap').getBoundingClientRect(), d = document.createElement('div'); d.className = 'rip'; d.style.left = (b.left + b.width / 2) + 'px'; d.style.top = (b.top + b.height / 2) + 'px'; if (k) d.style.borderColor = '#ff3a2a'; document.body.appendChild(d); gsap.fromTo(d, { scale: 1, opacity: .9 }, { scale: 2.2, opacity: 0, duration: .45, ease: 'power2.out', onComplete() { d.remove(); } }); }

// ---------- 測定（連打。結果は名前で決まっていて、連打しなくても約10秒で決まる） ----------
const DUR = FAST ? 2.5 : 10, NEED = 34, MINT = FAST ? .8 : 2.4;
let M = null, LAST = null, busy = false;
function setTheme(k) { document.body.classList.toggle('kai', !!k); }
function resetScene() {
  gsap.killTweensOf([G.uProg, G.uKai, G.uKp, G.uPow, G.uErr, G.uBeam, fig.scale, figK.scale]);
  G.uProg.value = 0; G.uKai.value = 0; G.uKp.value = 0; G.uPow.value = 0; G.uErr.value = 0; G.uBeam.value = 0; G.uCol.value.copy(CYAN);
  fig.scale.setScalar(1); figH.visible = true; figK.visible = false; figK.scale.setScalar(1); core.position.set(PT.suit.chest[0], PT.suit.chest[1], PT.suit.chest[2] + .05);
  setTheme(false); crackClear(); SEIS.on = false; SEIS.amp = 0; $('seis').style.opacity = 0;
  gsap.set(['#warn1', '#warn2'], { opacity: 0 });
}
function hudReset(label) { $('hLabel').textContent = label; $('hSub').textContent = ''; $('hSub').className = ''; gsap.set(['#hStamp', '#hNo'], { opacity: 0 }); $('hStamp').textContent = ''; $('hNo').innerHTML = ''; setGauge(0); gsap.set('#hTime i', { scaleX: 1 }); }
async function start() {
  if (busy || ST !== 'title') return; const raw = clean($('nm').value);
  if (!raw) { $('nmNote').textContent = '名前を入れてください'; $('nmNote').className = 'note err'; try { $('nm').focus(); } catch (e) { } return; }
  $('nmNote').textContent = ''; $('nmNote').className = 'note'; busy = true; ac(); ls.set('kaiho_name', $('nm').value); try { $('nm').blur(); } catch (e) { }
  const R = judge(raw);
  if (R.lookup) { // 「怪獣110号」のように番号を入れたとき：登録されていればその怪獣、いなければ「まだ登録されていません」
    const no = R.lookup, miss = t => { $('nmNote').textContent = t; $('nmNote').className = 'note err'; busy = false; sfx('err'); };
    if (no <= 100) return miss(`怪獣${no}号は、まだ登録されていません`);
    $('nmNote').textContent = '照会中…';
    let e; try { e = await findKaiju(no); } catch (_) { return miss('いまは照会できません。少し待ってもう一度どうぞ'); }
    if (!e) return miss(`怪獣${no}号は、まだ登録されていません`);
    $('nmNote').textContent = ''; R.kai = { f: e.f, no, canon: true, ab: abilPick(e.n), owner: e.n };
  }
  LAST = R; R.stage = 'h';
  resetScene(); hudReset('解放戦力'); setVal('0', '%');
  $('title').hidden = true; ST = 'measure';
  $('hud').hidden = false; gsap.fromTo('#hud', { opacity: 0 }, { opacity: 1, duration: .4 });
  const t = $('tap'); t.hidden = false; t.className = ''; $('tapT').textContent = '連打'; $('tapS').textContent = ''; gsap.set(t, { x: 0, y: 0 }); gsap.fromTo(t, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, delay: .5, ease: 'back.out(2)' });
  camTo({ d: 7.7, off: .03, y: 1.55, ty: 1.4 }, 1.1);
  $('hSub').textContent = 'スーツ起動'; sfx('beep'); humOn();
  gsap.delayedCall(.55, () => sfx('beep'));
  gsap.delayedCall(1.1, () => { sfx('go'); cap('連打！', .8); $('hSub').textContent = '測定中'; M = { R, mode: 'h', t: 0, taps: 0, p: 0, live: true, scr: 0 }; busy = false; });
  count(R).catch(() => { }).then(loadCounts).catch(() => { });
}
function tapDown() {
  if (!M || !M.live) return; M.taps++; ac();
  const k = M.mode === 'k', R = M.R, dead = !k && R.type === 'human' && R.pct === 0;
  gsap.fromTo('#tap', { scale: .88 }, { scale: 1, duration: .16, ease: 'back.out(3)', overwrite: 'auto' });
  if (dead) { sfx('dud'); G.uErr.value = 1; gsap.to(G.uErr, { value: 0, duration: .35, overwrite: true }); gsap.fromTo('#tap', { rotation: -5 }, { rotation: 0, duration: .25, ease: 'elastic.out(1,.4)' }); return; }
  G.uPulse.value = 1; ripple(k); emit(k ? 9 : 6); shake = Math.max(shake, k ? .1 + .2 * M.p : .03 + .05 * M.p);
  sfx(k ? 'thump' : 'tap', M.p);
  try { if (navigator.vibrate) navigator.vibrate(k ? 18 : 8); } catch (e) { }
}
const easeV = p => 1 - Math.pow(1 - p, 2.3);
function measureStep(dt) {
  const R = M.R, k = M.mode === 'k'; M.t += dt;
  const dead = !k && R.type === 'human' && R.pct === 0;
  const auto = Math.pow(Math.min(1, M.t / DUR), 2.6), byTap = Math.min(M.taps / NEED, M.t / MINT);
  const p = Math.min(1, Math.max(auto, byTap)); M.p += (p - M.p) * Math.min(1, dt * 9);
  gsap.set('#hTime i', { scaleX: Math.max(0, 1 - M.t / DUR) }); humSet(dead ? 0 : M.p, k);
  if (k) {
    const F = R.kai.f == null ? 90 : R.kai.f, f = F * easeV(M.p) / 10, j = (Math.random() - .5) * .16 * (1 - M.p) * M.p * 4;
    if (R.kai.f == null) { M.scr = (M.scr || 0) - dt; if (M.scr <= 0) { M.scr = .06; setVal((Math.random() * 9.9).toFixed(1), ''); setGauge(Math.random()); } } else { setVal(Math.max(0, f + j).toFixed(1), ''); setGauge(f / 10); }
    G.uKp.value = easeV(M.p) * Math.min(1, F / 99); SEIS.amp = .06 + .9 * easeV(M.p);
    shake = Math.max(shake, .03 * M.p); if (Math.random() < dt * (4 + 30 * M.p)) emit(1);
  } else if (R.type === 'unknown') {
    M.scr -= dt; if (M.scr <= 0) { M.scr = .06; const v = Math.floor(Math.random() * 100); setVal(String(v).padStart(2, '0'), '%'); setGauge(Math.random()); G.uProg.value = Math.random() * M.p; G.uCol.value.copy(CYAN).lerp(AMBER, M.p); }
  } else if (dead && R.auto) {
    setVal('0', '%'); $('hSub').textContent = M.t > 1.2 ? '異常な反応…' : '測定中'; if (M.t > 1.2) { G.uErr.value = 1; shake = Math.max(shake, .05 + (M.t - 1.2) * .25); }
    if (M.t >= (FAST ? .9 : 2.6)) { M.live = false; goKaiju($('tap')); return; }
  } else if (dead) {
    setVal('0', '%'); $('hSub').textContent = M.t > 6.5 ? '反応なし…' : M.t > 3.5 ? '再試行中…' : '測定中';
  } else {
    const v = R.pct * easeV(M.p); setVal(String(Math.floor(v + (M.p < .97 ? Math.random() * 1.2 : 0))), '%'); G.uProg.value = .04 + .96 * (v / 100); setGauge(v / 100);
  }
  const end = dead ? (M.t >= DUR || (M.taps >= NEED && M.t >= DUR * .5)) : (p >= 1 && M.p > .985) || M.t >= DUR + .3;
  if (end) { M.live = false; if (k) lockKaiju(R); else lockHuman(R); }
}
function op(html, cb) { const o = $('op'); o.innerHTML = html + '<small>タップで結果へ ▶</small>'; o.hidden = false; gsap.fromTo(o, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .3 }); gsap.to('#hNo', { opacity: 0, duration: .25 }); OPCB = cb; ST = 'locked'; OPAT = performance.now(); }
let OPCB = null, OPAT = 0;
function opClose() { if (ST !== 'locked' || !OPCB || performance.now() - OPAT < 450) return; const cb = OPCB; OPCB = null; $('op').hidden = true; cb(); }
document.addEventListener('pointerdown', e => { if (ST === 'locked' && !(e.target.closest && e.target.closest('#tap'))) opClose(); });
function lockHuman(R) {
  humStop(); const big = $('hVal');
  if (R.type === 'unknown') {
    setVal('測定不能', '', 60); setGauge(0); G.uProg.value = 0; G.uCol.value.copy(AMBER); sfx('err'); flash('#ffb020', .5, .6); shake = .4; fx2Add('emp', { x: 160, y: 150, seed: 4, palette: ramp('#ffb020') }, 3.4); $('hSub').textContent = 'エラー'; $('hSub').className = 'hbig';
    gsap.fromTo(big, { scale: 1.5 }, { scale: 1, duration: .5, ease: 'back.out(2)' });
    gsap.delayedCall(1.2, () => op('数値が…出ません。<br><b>測定不能</b>です。', showResult)); return;
  }
  if (R.pct === 0) {
    setVal('0', '%'); setGauge(0); sfx('err'); shake = .15; fx2Add('implosion', { x: 160, y: 150, seed: 2, palette: ramp('#6f8590') }, 2); $('hSub').textContent = '反応なし'; $('hSub').className = 'hbig'; $('tap').classList.add('dead'); $('tapS').textContent = '反応なし';
    gsap.fromTo(big, { scale: 1.3 }, { scale: 1, duration: .5, ease: 'back.out(2)' });
    gsap.delayedCall(1.3, () => op('解放戦力…<b>0%</b>。<br>スーツが、まったく反応しません。', showResult)); return;
  }
  const rk = rankOf(R.pct), top = R.pct >= 90;
  setVal(String(R.pct), '%'); setGauge(R.pct / 100); G.uProg.value = .04 + .96 * R.pct / 100;
  sfx('lock'); flash('#c8f7ff', top ? .95 : .7, top ? 1.1 : .7); wave(); beamUp(.5 + R.pct / 100); shake = .25 + R.pct / 100 * .6; emit(40 + R.pct, true);
  G.uPulse.value = 1; gsap.fromTo(G.uPow, { value: .4 + R.pct / 100 }, { value: R.pct / 100 * .35, duration: 1.2 });
  fxAdd(PFX && PFX.fx.burst, { x: 80, y: 80, seed: 5, palette: ramp('#3fe0ff') }); fx2Add('plasma', { x: 160, y: 150, seed: R.pct, palette: ramp('#3fe0ff') }, 2); if (R.pct >= 60) fx2Add('strike', { x: 160, y: 276, seed: R.pct + 3, palette: ramp('#8ff0ff') }, 3.2);
  gsap.fromTo(big, { scale: 1.9 }, { scale: 1, duration: .6, ease: 'elastic.out(1,.45)' });
  gsap.fromTo(CAM, { d: 6.6 }, { d: 7.7, duration: 1.1, ease: 'power3.out' });
  $('hSub').textContent = '測定完了'; try { if (navigator.vibrate) navigator.vibrate([30, 40, 60]); } catch (e) { }
  gsap.delayedCall(.55, () => { const st = $('hStamp'); st.textContent = rk.name; st.style.fontSize = rk.name.length > 5 ? '44px' : '58px'; gsap.fromTo(st, { opacity: 0, scale: 3 }, { opacity: 1, scale: 1, duration: .28, ease: 'power4.in', onComplete() { sfx('stamp'); shake = Math.max(shake, .3); wave(1); if (top) { sfx('big'); fxAdd(PFX && PFX.fx.confetti, { x: 80, y: 50, seed: 11 }); flash('#ffffff', .5, .8); } } }); });
  gsap.delayedCall(top ? 2.0 : 1.6, () => op(top ? `解放戦力…<b>${R.pct}%</b>！？<br>${rk.name}です！` : `解放戦力 <b>${R.pct}%</b>。<br>${rk.name}です。`, showResult));
}

// ---------- 怪獣側（0%の人が連打ボタンをスライドすると、画面が割れて始まる） ----------
const canSlide = () => LAST && LAST.kai && !LAST.kaiDone && LAST.pct === 0 && (ST === 'measure' || ST === 'locked' || ST === 'result') && !busy;
function slidable(el, isTap) {
  let st = null;
  el.addEventListener('pointerdown', e => { st = { x: e.clientX, y: e.clientY }; try { el.setPointerCapture(e.pointerId); } catch (_) { } if (isTap) tapDown(); e.preventDefault(); });
  el.addEventListener('pointermove', e => { if (!st || !canSlide()) return; const dx = e.clientX - st.x, dy = e.clientY - st.y, d = Math.hypot(dx, dy); gsap.set(el, { x: dx, y: dy }); if (d > 66) { st = null; goKaiju(el); } });
  const end = () => { if (!st) return; st = null; gsap.to(el, { x: 0, y: 0, duration: .35, ease: 'elastic.out(1,.5)' }); };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  el.addEventListener('contextmenu', e => e.preventDefault());
}
slidable($('tap'), true); slidable($('dead'), false);
let NOP = null;
function goKaiju(el) {
  const R = LAST; if (!R || !R.kai || R.kaiDone) return; R.kaiDone = true; busy = true; ac();
  const b = el.getBoundingClientRect(), ox = b.left + b.width / 2, oy = b.top + b.height / 2;
  if (M) M.live = false; M = null; OPCB = null; $('op').hidden = true; ST = 'kai'; humStop();
  NOP = regKaiju(R).catch(() => null);
  const t = $('tap');
  // 割れる
  crackMake(ox, oy); CRK.alpha = 1; gsap.fromTo(CRK, { prog: 0 }, { prog: 1.05, duration: .85, ease: 'power2.out', onUpdate: crackDraw });
  sfx('crack'); shake = .9; try { if (navigator.vibrate) navigator.vibrate([40, 30, 80, 30, 160]); } catch (e) { }
  flash('#ffffff', .55, .3); $('hud').classList.add('glitch'); $('gl').classList.add('glitch');
  gsap.delayedCall(.22, () => { sfx('crack'); shake = 1.1; });
  gsap.delayedCall(.75, () => {
    $('result').hidden = true; $('hud').hidden = false; $('hud').classList.remove('glitch'); $('gl').classList.remove('glitch');
    flash('#ff1a0a', .95, 1.1); setTheme(true); sfx('roar'); sfx('siren'); shake = 1.2;
    hudReset('フォルティチュード'); setVal('0.0', ''); $('hSub').textContent = '怪獣反応';
    t.hidden = false; t.className = 'kai'; $('tapT').textContent = '連打'; $('tapS').textContent = ''; gsap.set(t, { x: 0, y: 0 }); gsap.fromTo(t, { scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: 'back.out(2)' });
    gsap.to(G.uKai, { value: 1, duration: 1.1, ease: 'power2.out' }); gsap.to(G.uProg, { value: 0, duration: .3 }); G.uPow.value = 0;
    gsap.to(CRK, { alpha: .22, duration: 1.2, delay: .4, onUpdate: crackDraw });
    figH.visible = false; figK.visible = true; core.position.set(PT.kaiju.chest[0], PT.kaiju.chest[1], PT.kaiju.chest[2] + .05); // 赤い光のなかで、怪獣の体に入れかわる
    gsap.fromTo(figK.scale, { x: .82, y: .82, z: .82 }, { x: 1, y: 1, z: 1, duration: 1.5, ease: 'elastic.out(1,.55)' });
    camTo({ d: 7.3, off: .03, y: .95, ty: 1.55 }, 1.4, 'power3.out'); wave(); wave(1); emit(120, true);
    fxAdd(PFX && PFX.fx.burst, { x: 80, y: 80, seed: 7, palette: ramp('#ff3020') }); fx2Add('wipe', { x: 160, y: 150, seed: 6 }, 2); fx2Add('slam', { x: 160, y: 272, seed: 6, palette: ramp('#ff3020') }, 3.4);
    gsap.to(['#warn1', '#warn2'], { opacity: 1, duration: .3 }); gsap.to(['#warn1', '#warn2'], { opacity: 0, duration: .5, delay: 2.6 });
    $('seis').style.opacity = 1; SEIS.on = true; SEIS.amp = .06; SEIS.buf.fill(0);
    cap('怪獣反応を検知', 1.5);
  });
  gsap.delayedCall(2.7, () => { sfx('go'); cap('連打！', .8); $('hSub').textContent = '計測中'; humOn(); R.stage = 'k'; M = { R, mode: 'k', t: 0, taps: 0, p: 0, live: true }; busy = false; ST = 'measure'; });
}
function lockKaiju(R) {
  humStop(); const f = R.kai.f, ft = fortX(f), top = f != null && f >= 98; busy = true;
  setVal(fstr(f), '', f == null ? 76 : 0); setGauge(f == null ? 0 : f / 100); G.uKp.value = 1; SEIS.amp = 1;
  sfx('roar'); sfx('lock'); flash(top ? '#ffffff' : '#ff3a1a', 1, top ? 1.6 : .9); wave(); gsap.delayedCall(.18, () => wave(1)); beamUp(1.2); shake = top ? 1.6 : 1.1; emit(220, true); G.uPulse.value = 1;
  gsap.fromTo(G.uPow, { value: 1.4 }, { value: .35, duration: 1.6 });
  fxAdd(PFX && PFX.fx.burst, { x: 80, y: 80, seed: 9, palette: ramp('#ff3020') }); fx2Add('slam', { x: 160, y: 272, seed: 9, palette: ramp('#ff3020') }, 3.4); fx2Add('strike', { x: 160, y: 276, seed: 12, palette: ramp('#ff6a3a') }, 3.2);
  gsap.fromTo('#hVal', { scale: 2.1 }, { scale: 1, duration: .7, ease: 'elastic.out(1,.4)' });
  gsap.fromTo(CAM, { d: 6.0 }, { d: 7.3, duration: 1.3, ease: 'power3.out' });
  $('hSub').textContent = '計測完了'; try { if (navigator.vibrate) navigator.vibrate([60, 40, 60, 40, 200]); } catch (e) { }
  gsap.delayedCall(.7, () => { const st = $('hStamp'); st.textContent = ft.name; st.style.fontSize = ft.name.length > 4 ? '40px' : '64px'; gsap.fromTo(st, { opacity: 0, scale: 3.4 }, { opacity: 1, scale: 1, duration: .3, ease: 'power4.in', onComplete() { sfx('stamp'); shake = Math.max(shake, .7); wave(1); if (top) { sfx('roar'); flash('#ffffff', .8, 1.2); emit(200, true); fxAdd(PFX && PFX.fx.burst, { x: 80, y: 80, seed: 3, palette: ramp('#ffd0a0') }); } } }); });
  const showNo = no => { R.kai.no = no || R.kai.no || null; const el = $('hNo'); el.innerHTML = '識別番号<b>' + (R.kai.no ? '怪獣' + R.kai.no + '号' : '照会中…') + '</b>'; gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .35 }); sfx('num'); gsap.delayedCall(.12, () => sfx('num')); gsap.delayedCall(.24, () => sfx('num')); };
  const say = () => { busy = false; op((f == null ? 'フォルティチュード、<b>不明</b>…！<br>' : `フォルティチュード <b>${fstr(f)}</b>…！<br>`) + (top ? '観測史上、最大級の大怪獣です！' : '大怪獣です！') + (R.kai.no ? `<br>識別番号、<b>怪獣${R.kai.no}号</b>！` : ''), showResult); };
  Promise.race([NOP || Promise.resolve(null), sleep(4500).then(() => null)]).then(async no => { const wait = 1500 - 0; await sleep(wait); showNo(no); await sleep(1300); say(); });
  // 通信が遅れて番号があとから届いたら、結果にも反映する
  (NOP || Promise.resolve(null)).then(no => { if (no && !R.kai.no) { R.kai.no = no; if (ST === 'result' && LAST === R) { fillResult(R); R.card = makeCard(R); } } });
}

// ---------- 結果 ----------
let COUNTS = null, countErr = false, KTOTAL = null, POST = '';
function fillResult(R) {
  const k = R.stage === 'k', big = $('rBig'); big.className = 'num';
  $('deadWrap').hidden = !(R.kai && !R.kaiDone && R.pct === 0); gsap.set('#dead', { x: 0, y: 0 });
  $('rFort').hidden = !k; $('rBarW').hidden = R.type === 'unknown';
  if (k) {
    const ft = fortX(R.kai.f), who = R.kai.owner || R.name;
    $('rWho').innerHTML = `「<b>${esc(who)}</b>」の正体は`; big.classList.add('kj'); big.innerHTML = `<span class="v">${R.kai.no ? '怪獣' + R.kai.no + '号' : '大怪獣'}</span>`;
    $('rRank').textContent = ft.name; $('rFort').innerHTML = 'フォルティチュード<b>' + (R.kai.est ? '<small style="font-size:.5em">推定</small>' : '') + fstr(R.kai.f) + '</b><div id="rAb">能力：' + esc(R.kai.ab || '不明') + '</div>'; $('rWord').textContent = ft.word + (R.kai.no ? '' : '（識別番号は、通信できたときに決まります）');
    $('stBtn2').textContent = '識別怪獣の一覧'; $('again').textContent = 'ほかの名前で測る';
    POST = `「${who}」は怪獣だった。\n${R.kai.no ? '識別番号【怪獣' + R.kai.no + '号】' : '【大怪獣】'}フォルティチュード${fstr(R.kai.f)}\n能力：${R.kai.ab || '不明'}\n${TAG}`;
  } else if (R.type === 'unknown') {
    $('rWho').innerHTML = `「<b>${esc(R.name)}</b>」の解放戦力は`; big.classList.add('txt'); big.innerHTML = '<span class="v">測定不能</span>';
    $('rRank').textContent = UNKNOWN.name; $('rWord').textContent = UNKNOWN.word; $('stBtn2').textContent = 'みんなの解放戦力';
    POST = `「${R.name}」の解放戦力は【測定不能】\n測定器が答えを出せなかった。\n${TAG}`;
  } else {
    const rk = rankOf(R.pct);
    $('rWho').innerHTML = `「<b>${esc(R.name)}</b>」の解放戦力は`; big.innerHTML = `<span class="v">${R.pct}</span><span class="u">%</span>`;
    $('rRank').textContent = rk.name; $('rWord').textContent = rk.word; $('stBtn2').textContent = 'みんなの解放戦力';
    POST = R.pct === 0 ? `「${R.name}」の解放戦力は【0%】\nスーツが、まったく反応しなかった。\n${TAG}` : `「${R.name}」の解放戦力は【${R.pct}%】\n${rk.name}\n${TAG}`;
  }
  shareLine();
}
function total() { return COUNTS ? Object.values(COUNTS).reduce((a, b) => a + (+(b && b.c) || 0), 0) : 0; }
function shareLine() {
  const R = LAST; if (!R) return; const el = $('rShare');
  if (R.stage === 'k') { el.innerHTML = KTOTAL != null ? `これまでに確認された識別怪獣：<b>${(KTOTAL + KAIJU.length).toLocaleString()}</b> 体` : (countErr ? '識別怪獣の数：いまは読みこめません' : '識別怪獣の数：照会中…'); return; }
  if (R.type === 'unknown') { el.innerHTML = '測定不能は、みんなの結果には数えません'; return; }
  if (!COUNTS) { el.innerHTML = countErr ? 'みんなの結果：いまは読みこめません' : 'みんなの結果：集計中…'; return; }
  const tot = total(), b = bucketOf(R.pct), n = +(COUNTS['b' + b] && COUNTS['b' + b].c) || 0;
  el.innerHTML = tot ? `みんなの結果：${BUCKETS[b]} は <b>${n.toLocaleString()}人</b>（全体の <b>${(n / tot * 100).toFixed(1)}%</b>）` : 'みんなの結果：集計中…';
}
function showResult() {
  const R = LAST, k = R.stage === 'k'; ST = 'result'; fillResult(R);
  $('hud').hidden = true; $('tap').hidden = true; gsap.to(['#warn1', '#warn2'], { opacity: 0, duration: .2 }); if (k) gsap.to(CRK, { alpha: .12, duration: .6, onUpdate: crackDraw });
  camTo({ d: 9.4, off: .27, y: 1.5, ty: 1.35 }, 1.0);
  $('result').hidden = false; $('result').scrollTop = 0;
  gsap.fromTo('#result .card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'power3.out' });
  gsap.fromTo('#rBar', { width: '0%' }, { width: (k ? Math.min(100, R.kai.f || 0) : R.pct || 0) + '%', duration: 1.1, delay: .3, ease: 'power2.out' });
  gsap.fromTo('#rBig', { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .6, delay: .1, ease: 'back.out(2)' });
  R.card = makeCard(R);
  if (k) loadKTotal().then(shareLine); else loadCounts().then(shareLine);
}
function toTitle() {
  $('result').hidden = true; $('stats').hidden = true; $('hud').hidden = true; $('tap').hidden = true; $('op').hidden = true; M = null; busy = false; humStop();
  resetScene(); camTo({ d: 9.4, off: .27, y: 1.5, ty: 1.35, yaw: 0 }, .8); ST = 'title'; $('title').hidden = false; $('title').scrollTop = 0;
  const n = $('nm'); n.value = ''; setTimeout(() => { try { if (!IS_PHONE) n.focus(); } catch (e) { } }, 50);
}
$('startBtn').onclick = start;
$('nm').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); start(); } });
$('again').onclick = toTitle;

// ---------- 記録（otokonoji の kaiho/。同じ名前は何人が入れても1人として数える） ----------
const FB = { key: 'AIzaSyAcJgJLVbuvx85_qEGJe1WhwsOelidxeYk', db: 'https://otokonoji-default-rtdb.asia-southeast1.firebasedatabase.app' };
async function fx(url, opt) { let err; for (let i = 0; i < 3; i++) { try { return await fetch(url, opt); } catch (e) { err = e; await sleep(400 * (i + 1)); } } throw err; }
let AUTH = null;
async function auth() {
  let a = AUTH || ls.get('kaiho_auth', null); if (a && a.exp > Date.now() + 60000) return AUTH = a;
  if (a && a.refresh) { try { const r = await fx('https://securetoken.googleapis.com/v1/token?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(a.refresh) }); if (r.ok) { const j = await r.json(); a = { uid: j.user_id, token: j.id_token, refresh: j.refresh_token, exp: Date.now() + (+j.expires_in) * 1000 }; ls.set('kaiho_auth', a); return AUTH = a; } } catch (_) { } }
  const r = await fx('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
  if (!r.ok) throw new Error('auth'); const j = await r.json(); a = { uid: j.localId, token: j.idToken, refresh: j.refreshToken, exp: Date.now() + (+j.expiresIn) * 1000 }; ls.set('kaiho_auth', a); return AUTH = a;
}
const DBU = p => FB.db + '/kaiho/' + p + '.json';
const patch = async body => fx(FB.db + '/kaiho.json?auth=' + encodeURIComponent((await auth()).token), { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const FAKE = { n: { b0: { c: 12 }, b1: { c: 96 }, b2: { c: 330 }, b3: { c: 318 }, b4: { c: 121 }, b5: { c: 117 }, b6: { c: 61 }, b7: { c: 58 }, b8: { c: 36 }, b9: { c: 33 }, b10: { c: 14 } }, 'kc/c': 143 };
const getv = async p => { if (DEV && p in FAKE) return FAKE[p]; const r = await fx(DBU(p)); if (!r.ok) throw new Error('get'); return await r.json(); };
// 区切りごとの人数に1人足す（その名前がまだ数えられていないときだけ）
async function count(R) {
  if (DEV || R.type === 'unknown') return; const b = 'b' + bucketOf(R.pct), sent = ls.get('kaiho_sent', []); if (sent.includes(R.h)) return;
  const done = () => { sent.push(R.h); ls.set('kaiho_sent', sent.slice(-400)); };
  if ((await getv('u/' + R.h)) != null) { done(); return; }
  for (let i = 0; i < 5; i++) {
    const c = +(await getv('n/' + b + '/c')) || 0, body = {}; body['u/' + R.h] = b; body['n/' + b] = { c: c + 1, h: R.h };
    if ((await patch(body)).ok) { done(); return; }
    if ((await getv('u/' + R.h)) != null) { done(); return; }
    await sleep(150 + Math.random() * 400);
  }
  throw new Error('put');
}
// 識別番号をもらう（101号から順番。同じ名前なら最初にもらった番号のまま）
async function regKaiju(R) {
  if (R.kai.canon) return R.kai.no;
  if (DEV) { await sleep(300); return 101 + Math.floor(hash(R.name, 3) * 60); }
  const mem = ls.get('kaiho_kno', {}), save = n => { mem[R.h] = n; ls.set('kaiho_kno', mem); return n; }; if (mem[R.h]) return mem[R.h];
  let v = await getv('k/' + R.h + '/i'); if (v) return save(+v);
  for (let i = 0; i < 6; i++) {
    const c = +(await getv('kc/c')) || 100, N = c + 1, body = { kc: { c: N, h: R.h } }; body['k/' + R.h] = { i: N, n: R.name, f: R.kai.f };
    if ((await patch(body)).ok) return save(N);
    v = await getv('k/' + R.h + '/i'); if (v) return save(+v);
    await sleep(150 + Math.random() * 400);
  }
  throw new Error('put');
}
async function findKaiju(no) { if (DEV) { await sleep(200); return no % 2 ? null : { i: no, n: 'てすと', f: 91 }; } const r = await fx(DBU('k') + '?orderBy=%22i%22&equalTo=' + no); if (!r.ok) throw new Error('get'); const o = (await r.json()) || {}; return Object.values(o).find(v => v && v.i === no) || null; }
async function loadCounts() { try { COUNTS = (await getv('n')) || {}; countErr = false; } catch (e) { countErr = true; } return COUNTS; }
async function loadKTotal() { try { const c = +(await getv('kc/c')) || 100; KTOTAL = Math.max(0, c - 100); countErr = false; } catch (e) { countErr = true; } return KTOTAL; }

// ---------- 一覧（隊員：区切りごとの人数と割合。横にスライドすると識別怪獣の一覧） ----------
let VIEW = 'h'; const KL = { rows: [], last: 100, end: false, loading: false, err: false };
async function openStats(from, view) {
  $('stats').dataset.from = from; $('title').hidden = true; $('result').hidden = true; $('stats').hidden = false; $('stats').scrollTop = 0; setView(view || 'h');
}
function setView(v) { VIEW = v; $('stats').classList.toggle('k', v === 'k'); $('kTools').hidden = v !== 'k'; $('stT').textContent = v === 'k' ? '識別怪獣の一覧' : 'みんなの解放戦力'; $('stMore').hidden = true; if (v === 'k') renderK(true); else renderH(); }
async function renderH() {
  const box = $('stBox'); box.innerHTML = '<p class="note">読みこみ中…</p>'; $('stNote').textContent = '';
  await loadCounts(); if ($('stats').hidden || VIEW !== 'h') return;
  if (!COUNTS) { box.innerHTML = '<p class="note err">いまは読みこめません</p>'; return; }
  const tot = total(); $('stNote').textContent = tot ? `これまでに ${tot.toLocaleString()} 人を測定` : 'まだ誰も測定していません';
  const me = $('stats').dataset.from === 'result' && LAST && LAST.type === 'human' ? bucketOf(LAST.pct) : -1;
  const rows = []; for (let b = 10; b >= 0; b--) { const n = +(COUNTS['b' + b] && COUNTS['b' + b].c) || 0; rows.push(`<tr${b === me ? ' class="me"' : ''}><td class="num">${BUCKETS[b]}</td><td class="b"><span style="width:${tot ? (n / tot * 100).toFixed(1) : 0}%"></span></td><td class="p num">${n.toLocaleString()}人</td><td class="p num">${tot ? (n / tot * 100).toFixed(1) : '0.0'}%</td></tr>`); }
  box.innerHTML = '<table class="st">' + rows.join('') + '</table>';
}
async function loadK(all) {
  if (KL.loading || KL.end) return; KL.loading = true;
  if (DEV) { const nm = ['なすび', 'たろう', '部長', 'ゴジラ好き', '田中太郎', 'ねこ', 'あいうえおかきくけこさしすせそ', 'XYZ']; for (let i = 101; i <= 143; i++) KL.rows.push({ i, n: nm[i % nm.length] + (i % 5 ? '' : i), f: 80 + (i * 7) % 20 }); KL.end = true; KL.loading = false; return; }
  try { do { const r = await fx(DBU('k') + '?orderBy=%22i%22&startAt=' + (KL.last + 1) + '&limitToFirst=200'); if (!r.ok) throw 0; const o = (await r.json()) || {}, arr = Object.values(o).filter(v => v && v.i).sort((a, b) => a.i - b.i); KL.rows.push(...arr); if (arr.length) KL.last = arr[arr.length - 1].i; if (arr.length < 200) KL.end = true; } while (all && !KL.end); KL.err = false; } catch (e) { KL.err = true; }
  KL.loading = false;
}
async function renderK(fresh) {
  const box = $('stBox'), q = clean($('kQ').value), min = +$('kF').value || 0, filt = !!(q || min);
  if (fresh && !KL.rows.length) { box.innerHTML = '<p class="note">読みこみ中…</p>'; }
  if (!KL.rows.length || filt) await loadK(filt); if ($('stats').hidden || VIEW !== 'k') return;
  const qk = canonKey(q), qn = kaijuNo(qk.startsWith('怪獣') || qk.startsWith('かいじゅう') ? qk : '怪獣' + qk), hit = (no, name, f, ab) => (!min || (f != null && f >= min)) && (!q || no === qn || (name && canonKey(name).includes(qk)) || (ab && ab.includes(q)));
  const me = LAST && LAST.kai && LAST.kai.no ? LAST.kai.no : -1;
  const cn = KAIJU.filter(k => hit(k.no, k.n || '', k.f, k.ab)).map(k => `<tr class="cn${k.no === me ? ' me' : ''}"><td class="kn">怪獣${k.no}号</td><td class="nm">${k.n ? esc(k.n) : '―'}<small>${esc(k.ab)}</small></td><td class="kf num">${k.f == null ? '<small>不明</small>' : (k.est ? '<small>推定</small>' : '') + fstr(k.f)}</td></tr>`);
  const pl = KL.rows.filter(k => hit(k.i, k.n, k.f, abilPick(k.n))).map(k => `<tr${k.i === me ? ' class="me"' : ''}><td class="kn">怪獣${k.i}号</td><td class="nm">${esc(k.n)}<small>${esc(abilPick(k.n))}</small></td><td class="kf num">${fstr(k.f)}</td></tr>`);
  $('stNote').textContent = KL.err && !KL.rows.length ? '原作の識別怪獣だけ表示しています（いまは読みこめません）' : '識別番号・名前と能力・フォルティチュード';
  box.innerHTML = '<table class="st">' + cn.join('') + (pl.length ? '<tr class="sep"><td colspan="3">ここから、名前で見つかった怪獣</td></tr>' + pl.join('') : '') + '</table>' + (!cn.length && !pl.length ? '<p class="note">見つかりませんでした</p>' : '');
  const more = $('stMore'); more.hidden = KL.end || filt; more.textContent = KL.loading ? '読みこみ中…' : '▲ 上にスライドで、つづきの番号';
}
$('stats').addEventListener('scroll', async () => { const s = $('stats'); if (VIEW !== 'k' || KL.end || KL.loading) return; if (s.scrollTop + s.clientHeight > s.scrollHeight - 240) { await loadK(false); renderK(false); } });
let kT = 0; $('kQ').addEventListener('input', () => { clearTimeout(kT); kT = setTimeout(() => renderK(false), 250); }); $('kF').addEventListener('change', () => renderK(false));
{ // 横にスライドで、隊員の一覧と識別怪獣の一覧を切りかえる
  let st = null; const s = $('stats');
  s.addEventListener('pointerdown', e => { if (e.target.closest && e.target.closest('input,select,button')) { st = null; return; } st = { x: e.clientX, y: e.clientY }; });
  s.addEventListener('pointerup', e => { if (!st) return; const dx = e.clientX - st.x, dy = e.clientY - st.y; st = null; if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) { const to = VIEW === 'h' ? 'k' : 'h', dir = dx < 0 ? -1 : 1; gsap.fromTo('#stats .card', { x: -dir * 60, opacity: 0 }, { x: 0, opacity: 1, duration: .3, ease: 'power2.out' }); setView(to); $('stats').scrollTop = 0; } });
  s.addEventListener('pointercancel', () => { st = null; });
}
$('stBtn').onclick = () => openStats('title', 'h');
$('stBtn2').onclick = () => openStats('result', LAST && LAST.stage === 'k' ? 'k' : 'h');
$('stBack').onclick = () => { $('stats').hidden = true; if ($('stats').dataset.from === 'result' && LAST) $('result').hidden = false; else $('title').hidden = false; };

// ---------- 画像（結果カード） ----------
async function makeCard(R) {
  await sleep(1300); // カメラが引いてから写す
  const k = R.stage === 'k', W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const col = k ? '#ff3030' : R.type === 'unknown' ? '#ffb020' : '#3fe0ff';
  const F = (s, w) => `${w || 900} ${s}px "Hiragino Sans","Noto Sans JP","Noto Sans CJK JP","Yu Gothic UI",sans-serif`;
  const fit = (t, size, w, maxW) => { let z = size; x.font = F(z, w); while (z > 18 && x.measureText(t).width > maxW) { z -= 2; x.font = F(z, w); } return z; };
  const wrap = (t, maxW) => { const out = []; let line = ''; for (const ch of t) { if (x.measureText(line + ch).width > maxW && line) { out.push(line); line = ch; } else line += ch; } if (line) out.push(line); return out; };
  x.fillStyle = '#05080c'; x.fillRect(0, 0, W, H);
  const g = $('gl'), gw = g.width, gh = g.height, BW = 1000, BH = 560; let sh = Math.min(gh * .46, gw / (BW / BH)), sw = sh * (BW / BH), sx = (gw - sw) / 2, sy = Math.max(0, gh * .01);
  try { x.drawImage(g, sx, sy, sw, sh, (W - BW) / 2, 44, BW, BH); } catch (e) { }
  const fade = x.createLinearGradient(0, 430, 0, 610); fade.addColorStop(0, '#05080c00'); fade.addColorStop(1, '#05080c'); x.fillStyle = fade; x.fillRect(0, 430, W, 180);
  x.strokeStyle = col; x.lineWidth = 4; x.strokeRect(22, 22, W - 44, H - 44); x.fillStyle = col; x.fillRect(22, 22, 90, 8); x.fillRect(22, 22, 8, 90); x.fillRect(W - 112, H - 30, 90, 8); x.fillRect(W - 30, H - 112, 8, 90);
  x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  const who = k ? `「${R.kai.owner || R.name}」の正体は` : `「${R.name}」の解放戦力は`; x.fillStyle = '#bfd3dc'; fit(who, 44, 700, W - 160); x.fillText(who, W / 2, 640);
  x.shadowColor = col; x.shadowBlur = 50; x.fillStyle = '#ffffff';
  let y = 0;
  if (k) { const t = R.kai.no ? '怪獣' + R.kai.no + '号' : '大怪獣'; fit(t, 190, 900, W - 160); x.fillText(t, W / 2, 830); x.shadowBlur = 0; const ft = fortX(R.kai.f); x.fillStyle = col; x.font = F(56); x.fillText('フォルティチュード  ' + (R.kai.est ? '推定' : '') + fstr(R.kai.f), W / 2, 930); x.fillStyle = '#ffffff'; x.font = F(48); const tw = x.measureText(ft.name).width + 90; x.fillStyle = col; x.fillRect(W / 2 - tw / 2, 962, tw, 76); x.fillStyle = '#fff'; x.fillText(ft.name, W / 2, 1018); x.fillStyle = '#ffd9d0'; fit('能力：' + (R.kai.ab || '不明'), 44, 800, W - 180); x.fillText('能力：' + (R.kai.ab || '不明'), W / 2, 1100); y = 1164; x.font = F(34, 600); x.fillStyle = '#eafaff'; wrap(ft.word, W - 200).slice(0, 1).forEach((l, i) => x.fillText(l, W / 2, y + i * 50)); }
  else if (R.type === 'unknown') { x.font = F(170); x.fillText('測定不能', W / 2, 840); x.shadowBlur = 0; x.font = F(38, 600); x.fillStyle = '#eafaff'; wrap(UNKNOWN.word, W - 200).slice(0, 3).forEach((l, i) => x.fillText(l, W / 2, 960 + i * 54)); }
  else { const rk = rankOf(R.pct), t = String(R.pct); x.font = F(280); const w1 = x.measureText(t).width; x.font = F(120); const w2 = x.measureText('%').width; x.font = F(280); x.textAlign = 'left'; x.fillText(t, W / 2 - (w1 + w2) / 2, 880); x.fillStyle = col; x.font = F(120); x.fillText('%', W / 2 - (w1 + w2) / 2 + w1 + 6, 880); x.textAlign = 'center'; x.shadowBlur = 0; x.font = F(54); const tw = x.measureText(rk.name).width + 100; x.fillStyle = col; x.fillRect(W / 2 - tw / 2, 930, tw, 84); x.fillStyle = '#02161d'; x.fillText(rk.name, W / 2, 992); const bw = 720; x.fillStyle = '#12202a'; x.fillRect(W / 2 - bw / 2, 1050, bw, 18); x.fillStyle = col; x.fillRect(W / 2 - bw / 2, 1050, bw * R.pct / 100, 18); x.font = F(38, 600); x.fillStyle = '#eafaff'; wrap(rk.word, W - 200).slice(0, 2).forEach((l, i) => x.fillText(l, W / 2, 1136 + i * 54)); }
  x.shadowBlur = 0; x.fillStyle = '#5f7480'; x.font = F(24, 600); x.fillText(FAN, W / 2, H - 150);
  x.fillStyle = col; x.font = F(50); x.fillText(TTL, W / 2, H - 92); x.fillStyle = '#7f98a6'; x.font = '600 28px ui-monospace,Menlo,monospace'; x.fillText('nasubi-no-oniwa.com/kaiho', W / 2, H - 52);
  return await new Promise(r => c.toBlob(b => r(b), 'image/png'));
}

// ---------- Xに投稿（自分の紹介ツイートを引用する。引用するツイートは一覧ページ quote/ で切りかえ） ----------
let QUOTE = {};
fetch('https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/xquote/g/kaiho.json').then(r => r.json()).then(d => { if (d && typeof d === 'object') QUOTE = d; }).catch(() => { });
function quoteURL() { const u = QUOTE.ja || ''; return /^https:\/\/x\.com\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}$/.test(u) ? u : ''; }
const cardFile = b => new File([b], 'kaiho.png', { type: 'image/png' });
function saveBlob(b, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name || 'kaiho.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); }
let toastT = 0; function toast(m) { const t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 7000); }
$('xBtn').addEventListener('click', async () => {
  const R = LAST; if (!R) return; const q = quoteURL(); let b = null; try { b = await R.card; } catch (e) { }
  if (b && IS_PHONE && navigator.canShare) { const f = cardFile(b); try { if (navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: POST + (q ? '\n' + q : '') }); try { if (typeof gtag === 'function') gtag('event', 'x_share', { game: 'kaiho', via: 'sheet' }); } catch (e) { } return; } } catch (e) { if (e && e.name === 'AbortError') return; } }
  let how = 0; if (b) { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]); how = 1; } catch (e) { if (!IS_PHONE) { try { saveBlob(b); how = 2; } catch (_) { } } } }
  if (how) toast(how === 1 ? '画像をコピーしました。Xの投稿欄に貼りつけ（Ctrl+V）すると画像がつきます' : '画像を保存しました。Xの投稿に、保存した画像を追加してください');
  const u = 'https://x.com/intent/post?text=' + encodeURIComponent(POST) + (q ? '&url=' + encodeURIComponent(q) : ''); const w = window.open(u, '_blank'); if (!w) location.href = u;
});
$('imgBtn').addEventListener('click', async () => {
  const R = LAST; if (!R) return; let b = null; try { b = await R.card; } catch (e) { } if (!b) return; const f = cardFile(b);
  try { if (IS_PHONE && navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  saveBlob(b);
});

// ---------- 起動 ----------
gsap.ticker.lagSmoothing(0); // 重い端末でも、演出の時間が実際の時間からずれないようにする
if (FAST) gsap.globalTimeline.timeScale(4);
sndLabel(); $('nm').value = ls.get('kaiho_name', '');
resize(); ST = 'title'; $('load').hidden = true; $('title').hidden = false;
gsap.fromTo('#title .card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' });
requestAnimationFrame(frame);
if (DEV) window.__K = { judge, hash, clean, start, tapDown, goKaiju, G, CAM, get LAST() { return LAST; }, get ST() { return ST; }, get M() { return M; }, setName(n) { $('nm').value = n; }, openStats, setView, KL, card: async () => { const b = await LAST.card; return await new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); }); } };
