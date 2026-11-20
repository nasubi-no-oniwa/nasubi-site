// フィフティー：中身の見えないシェイカーから、グラスにぴったり50%注ぐゲーム
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import * as GL from './glass.js?v=3';
import { TX, LANGS } from './tx.js?v=4';

const $ = id => document.getElementById(id);
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch (e) { return d } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { } } };
const GAME = 'fifty', GAME_URL = 'https://nasubi-no-oniwa.com/fifty/';
const QS = new URLSearchParams(location.search);
const OGP = QS.has('ogp'), ICON = QS.has('icon');
const PV = window.__FFPV || null; // 確認用（通信しない）
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const sm = k => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const FF = '"Hiragino Maru Gothic ProN","Rounded Mplus 1c","Noto Sans CJK JP","Noto Sans JP",system-ui,sans-serif';
const HZ = GL.HZ;

// ===== ことば =====
let lang = (q => ['ja', 'en', 'zh', 'ko'].includes(q) ? q : null)(QS.get('lang')) || ls.get('ff_lang', null) || (n => n.startsWith('ja') ? 'ja' : n.startsWith('zh') ? 'zh' : n.startsWith('ko') ? 'ko' : 'en')((navigator.language || 'ja').toLowerCase());
const t = (k, o) => { let s = (TX[lang] || TX.ja)[k]; if (s == null) s = TX.ja[k]; if (o) for (const [a, b] of Object.entries(o)) s = String(s).split('{' + a + '}').join(b); return s; };
const LI = () => ({ ja: 0, en: 1, zh: 2, ko: 3 }[lang]);
const no4 = n => String(n).padStart(4, '0');
const diffName = d => t(d === 'e' ? 'dE' : d === 'n' ? 'dN' : d === 'h' ? 'dH' : 'dC');

// ===== 音 =====
let AC = null, master = null, NB = null, pourG = null, pourF = null;
function ac() { try { if (!AC) { AC = new (window.AudioContext || window.webkitAudioContext)(); master = AC.createGain(); master.gain.value = .8; master.connect(AC.destination); } if (AC.state === 'suspended') AC.resume(); return AC; } catch (e) { return null; } }
function nbuf() { if (!NB) { NB = AC.createBuffer(1, AC.sampleRate, AC.sampleRate); const d = NB.getChannelData(0); for (let i = 0; i < d.length; i++)d[i] = Math.random() * 2 - 1; } return NB; }
function tone(at, f, dur, type, vol, f2) { if (!AC) return; const o = AC.createOscillator(), g = AC.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f, at); if (f2) o.frequency.exponentialRampToValueAtTime(f2, at + dur); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + .01); g.gain.exponentialRampToValueAtTime(.0001, at + dur); o.connect(g); g.connect(master); o.start(at); o.stop(at + dur + .02); }
function noise(at, dur, type, f, q, vol, f2) { if (!AC) return; const s = AC.createBufferSource(); s.buffer = nbuf(); s.loop = true; const fl = AC.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, at); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, at + dur); fl.Q.value = q; const g = AC.createGain(); g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(.0001, at + dur); s.connect(fl); fl.connect(g); g.connect(master); s.start(at); s.stop(at + dur + .02); }
function pourSound(v, fill) { // 注いでいるあいだ鳴りつづける音（量で大きさ、たまり具合で高さが変わる）
  if (!AC) return; if (!pourG) { const s = AC.createBufferSource(); s.buffer = nbuf(); s.loop = true; pourF = AC.createBiquadFilter(); pourF.type = 'bandpass'; pourF.Q.value = 1.2; pourG = AC.createGain(); pourG.gain.value = 0; s.connect(pourF); pourF.connect(pourG); pourG.connect(master); s.start(); }
  const n = AC.currentTime; pourG.gain.setTargetAtTime(v, n, .04); pourF.frequency.setTargetAtTime(700 + 1900 * fill, n, .08);
}
function sClink() { if (!ac()) return; const n = AC.currentTime; tone(n, 2300, .5, 'sine', .08); tone(n, 3460, .35, 'sine', .05); tone(n, 5200, .2, 'sine', .03); }
function sDrum() { if (!ac()) return; const n = AC.currentTime; for (let i = 0; i < 14; i++)noise(n + i * .055, .05, 'bandpass', 240 + i * 14, 2, .12 + i * .008); }
function sGood() { if (!ac()) return; const n = AC.currentTime + .02;[784, 988, 1175, 1568].forEach((f, i) => tone(n + i * .08, f, .4, 'triangle', .09)); }
function sPerfect() { if (!ac()) return; const n = AC.currentTime + .02;[523, 659, 784, 1047, 1319, 1568, 2093].forEach((f, i) => tone(n + i * .07, f, .6, 'triangle', .1)); tone(n + .6, 2637, 1.2, 'sine', .07); }
function sSoso() { if (!ac()) return; const n = AC.currentTime + .02; tone(n, 440, .22, 'triangle', .09); tone(n + .16, 392, .4, 'triangle', .09); }
function sSpill() { if (!ac()) return; const n = AC.currentTime; noise(n, .9, 'lowpass', 1800, .7, .35, 300); tone(n, 300, .5, 'sawtooth', .06, 80); }
function sTap() { if (!ac()) return; tone(AC.currentTime, 880, .08, 'sine', .05); }

// ===== 絵（3D） =====
const R = new THREE.WebGLRenderer({ canvas: $('c'), antialias: true, preserveDrawingBuffer: OGP || ICON });
R.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.15;
const SC = new THREE.Scene();
{ const pm = new THREE.PMREMGenerator(R); SC.environment = pm.fromScene(new RoomEnvironment(), .04).texture; pm.dispose(); }
// 背景：夜のバー
function bgTex() { const c = document.createElement('canvas'); c.width = 64; c.height = 512; const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#0d0a1a'); gr.addColorStop(.45, '#241634'); gr.addColorStop(.7, '#3a1f33'); gr.addColorStop(1, '#1a0f16'); g.fillStyle = gr; g.fillRect(0, 0, 64, 512); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return tx; }
SC.background = bgTex();
function dotTex(soft) { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(soft, 'rgba(255,255,255,.85)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return tx; }
const TEX_BOKEH = dotTex(.72), TEX_SOFT = dotTex(.05);
const bokeh = []; {
  const cols = [0xffb347, 0xff7a59, 0xffd27a, 0xff5d9e, 0x7ad7ff, 0xffe9b0, 0xc79bff]; const r = GL.rng(4242);
  for (let i = 0; i < 46; i++) { const m = new THREE.SpriteMaterial({ map: TEX_BOKEH, color: cols[Math.floor(r() * cols.length)], transparent: true, opacity: .1 + r() * .32, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }); const s = new THREE.Sprite(m); const z = -5 - r() * 9; s.position.set((r() - .5) * 16, .4 + r() * 6.5, z); const sc = .35 + r() * 1.1; s.scale.set(sc, sc, 1); s.userData = { o: m.opacity, p: r() * 6.28, w: .4 + r() * 1.2 }; s.renderOrder = -5; SC.add(s); bokeh.push(s); }
}
const WORLD = new THREE.Group(); SC.add(WORLD); // グラスの底（内側）が y=0
const counter = new THREE.Mesh(new THREE.PlaneGeometry(60, 9), new THREE.MeshStandardMaterial({ color: 0x2b170e, roughness: .2, metalness: .35, envMapIntensity: .8 })); counter.rotation.x = -Math.PI / 2; counter.position.z = 2.2; SC.add(counter);
const cEdge = new THREE.Mesh(new THREE.BoxGeometry(60, .05, .06), new THREE.MeshStandardMaterial({ color: 0xc9964a, roughness: .3, metalness: .9, envMapIntensity: 1.2 })); cEdge.position.set(0, -.02, -2.3); counter.add(cEdge); cEdge.rotation.x = Math.PI / 2; cEdge.position.set(0, 4.5, -.02);
const pool = new THREE.Mesh(new THREE.CircleGeometry(3.2, 48), new THREE.MeshBasicMaterial({ map: TEX_SOFT, color: 0xffc98a, transparent: true, opacity: .34, blending: THREE.AdditiveBlending, depthWrite: false })); pool.rotation.x = -Math.PI / 2; SC.add(pool);
const blob = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshBasicMaterial({ map: TEX_SOFT, color: 0x000000, transparent: true, opacity: .55, depthWrite: false })); blob.rotation.x = -Math.PI / 2; SC.add(blob);
SC.add(new THREE.HemisphereLight(0xffe8d0, 0x2a1a30, .7));
const key = new THREE.DirectionalLight(0xfff0dc, 1.5); key.position.set(2.5, 6, 4); SC.add(key);
const rim = new THREE.DirectionalLight(0x9fc4ff, .9); rim.position.set(-4, 3, -3); SC.add(rim);

const CAM = new THREE.PerspectiveCamera(30, 1, .1, 100);
const OCAM = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 100); OCAM.position.set(0, 0, 20);
let camera = CAM;

const COLS = ['#ff5d73', '#ff9f1c', '#ffd23a', '#7bd389', '#35d0c0', '#4aa8ff', '#b46cff', '#ff7ad9', '#e8322a', '#c98a3c', '#9be15d', '#f4efe0'];
const SEG = 72, ROW = 110, LROW = 44, GT = 0.022, BT = 0.06;
const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: .03, metalness: 0, transparent: true, opacity: .17, envMapIntensity: 2.3, side: THREE.DoubleSide, depthWrite: false });
const fresMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { c: { value: new THREE.Color(0xcfe2ff) }, p: { value: 2.4 }, k: { value: .8 } },
  vertexShader: 'varying vec3 vN;varying vec3 vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
  fragmentShader: 'uniform vec3 c;uniform float p;uniform float k;varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),p);gl_FragColor=vec4(c*f*k,f*k);}'
});
const liqMat = new THREE.MeshPhysicalMaterial({ color: 0xff5d73, roughness: .1, metalness: 0, transparent: true, opacity: .9, envMapIntensity: 1.1, emissive: 0xff5d73, emissiveIntensity: .22, side: THREE.DoubleSide });
const streamMat = new THREE.MeshStandardMaterial({ color: 0xff5d73, roughness: .15, emissive: 0xff5d73, emissiveIntensity: .35 });
const metalMat = new THREE.MeshStandardMaterial({ color: 0xdfe4ec, metalness: 1, roughness: .16, envMapIntensity: 1.6 });
const metalMat2 = new THREE.MeshStandardMaterial({ color: 0x9aa3b0, metalness: 1, roughness: .32, envMapIntensity: 1.3 });

// いまのグラス
let CUR = null; // {g, meta, grp, liq, liqPos, yb, lines}
function ringXZ(g, yn, add, out, o, yWorld) { for (let j = 0; j < SEG; j++) { const th = j / SEG * Math.PI * 2; const rr = g.rAt(yn) * g.secR(th, yn) + add; out[o++] = Math.cos(th) * rr; out[o++] = yWorld; out[o++] = Math.sin(th) * rr; } return o; }
function buildGlassMesh(g) {
  const H = g.H, sp = g.spec; const grp = new THREE.Group();
  // カップ：内側・外側・ふち・底
  const nv = (ROW + 1) * SEG * 2 + SEG + 2; const pos = new Float32Array(nv * 3); let o = 0;
  for (let i = 0; i <= ROW; i++)o = ringXZ(g, i / ROW, 0, pos, o, i / ROW * H);          // 内側
  for (let i = 0; i <= ROW; i++)o = ringXZ(g, i / ROW, GT, pos, o, i / ROW * H);         // 外側
  const baseRing = o / 3; for (let j = 0; j < SEG; j++) { const th = j / SEG * Math.PI * 2; const rr = (g.rAt(0) * g.secR(th, 0) + GT) * .82; pos[o++] = Math.cos(th) * rr; pos[o++] = -BT; pos[o++] = Math.sin(th) * rr; }
  const cIn = o / 3; pos[o++] = 0; pos[o++] = 0; pos[o++] = 0; const cOut = o / 3; pos[o++] = 0; pos[o++] = -BT; pos[o++] = 0;
  const idx = []; const quad = (a, b, c, d) => { idx.push(a, b, c, a, c, d); };
  const IN = 0, OUT = (ROW + 1) * SEG;
  for (let i = 0; i < ROW; i++)for (let j = 0; j < SEG; j++) { const j2 = (j + 1) % SEG; quad(IN + i * SEG + j, IN + i * SEG + j2, IN + (i + 1) * SEG + j2, IN + (i + 1) * SEG + j); quad(OUT + i * SEG + j, OUT + (i + 1) * SEG + j, OUT + (i + 1) * SEG + j2, OUT + i * SEG + j2); }
  for (let j = 0; j < SEG; j++) { const j2 = (j + 1) % SEG; quad(IN + ROW * SEG + j, IN + ROW * SEG + j2, OUT + ROW * SEG + j2, OUT + ROW * SEG + j); quad(OUT + j, OUT + j2, baseRing + j2, baseRing + j); idx.push(cIn, IN + j2, IN + j); idx.push(cOut, baseRing + j, baseRing + j2); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
  const cup = new THREE.Mesh(geo, glassMat); cup.renderOrder = 2; grp.add(cup);
  const fr = new THREE.Mesh(geo, fresMat); fr.renderOrder = 3; grp.add(fr);
  // 脚と台
  let yb = -BT;
  if (sp.stem > 0.02) {
    const st = sp.stem, ft = sp.foot || .38; yb = -BT - st - .05;
    const pts = [new THREE.Vector2(0.001, yb), new THREE.Vector2(ft, yb), new THREE.Vector2(ft, yb + .015), new THREE.Vector2(ft * .55, yb + .035), new THREE.Vector2(.07, yb + .06), new THREE.Vector2(.042, yb + .1), new THREE.Vector2(.04, -BT - .06), new THREE.Vector2(.07, -BT - .015), new THREE.Vector2(Math.min(.2, g.rAt(0) * .8 + .02), -BT)];
    const lg = new THREE.LatheGeometry(pts, 40); const m1 = new THREE.Mesh(lg, glassMat); m1.renderOrder = 2; grp.add(m1); const m2 = new THREE.Mesh(lg, fresMat); m2.renderOrder = 3; grp.add(m2);
  }
  // 液体
  const lnv = (LROW + 1) * SEG + SEG + 1; const lpos = new Float32Array(lnv * 3); const lidx = [];
  for (let i = 0; i < LROW; i++)for (let j = 0; j < SEG; j++) { const j2 = (j + 1) % SEG; lidx.push(i * SEG + j, (i + 1) * SEG + j, (i + 1) * SEG + j2, i * SEG + j, (i + 1) * SEG + j2, i * SEG + j2); }
  const capO = (LROW + 1) * SEG, capC = capO + SEG; for (let j = 0; j < SEG; j++)lidx.push(capC, capO + (j + 1) % SEG, capO + j);
  const lgeo = new THREE.BufferGeometry(); lgeo.setAttribute('position', new THREE.BufferAttribute(lpos, 3)); lgeo.setIndex(lidx);
  const liq = new THREE.Mesh(lgeo, liqMat); liq.renderOrder = 1; liq.visible = false; liq.frustumCulled = false; grp.add(liq);
  return { grp, liq, lpos, yb, lv: -1, la: -1 };
}
// 水面の高さ（0..1）と波の大きさで、液体の形を作り直す
function setLiquid(C, level, amp, T) {
  const g = C.g, H = g.H, p = C.lpos; if (level <= 0.0005) { C.liq.visible = false; return; } C.liq.visible = true;
  if (Math.abs(level - C.lv) < 1e-6 && amp === 0 && C.la === 0) return; C.lv = level; C.la = amp;
  let o = 0; const top = level * H; const wob = (x, z) => amp * (.6 * Math.sin(9 * x + T * 15) + .4 * Math.sin(7 * z - T * 11.5));
  for (let i = 0; i <= LROW; i++) { const yn = level * i / LROW; const y = yn * H; const last = i === LROW; for (let j = 0; j < SEG; j++) { const th = j / SEG * Math.PI * 2; const rr = Math.max(.004, g.rAt(yn) * g.secR(th, yn) * .975 - .004); const x = Math.cos(th) * rr, z = Math.sin(th) * rr; p[o++] = x; p[o++] = last ? Math.min(H, y + wob(x, z)) : y; p[o++] = z; } }
  const s = LROW * SEG * 3; for (let j = 0; j < SEG * 3; j++)p[o++] = p[s + j];
  p[o++] = 0; p[o++] = Math.min(H, top + wob(0, 0)); p[o++] = 0;
  C.liq.geometry.attributes.position.needsUpdate = true; C.liq.geometry.computeVertexNormals();
}
function setColor(ci) { const c = new THREE.Color(COLS[ci % COLS.length]); liqMat.color.copy(c); liqMat.emissive.copy(c); streamMat.color.copy(c); streamMat.emissive.copy(c); dropMat.color.copy(c); }
function setGold(on) { glassMat.color.set(on ? 0xffd45a : 0xffffff); glassMat.opacity = on ? .42 : .17; fresMat.uniforms.c.value.set(on ? 0xffd97a : 0xcfe2ff); fresMat.uniforms.k.value = on ? 1.3 : .8; }
function useGlass(g, meta) {
  if (CUR) { WORLD.remove(CUR.grp); CUR.grp.traverse(m => { if (m.geometry) m.geometry.dispose(); }); }
  const M = buildGlassMesh(g); CUR = { g, meta, ...M }; WORLD.add(M.grp); setColor(MILK && mode !== 'maker' ? 11 : (g.spec.col || 0)); picPlace(-(g.maxR + GT + .12)); setGold(false);
  WORLD.position.y = -M.yb + .006; counter.position.y = 0; pool.position.set(0, .002, 0); blob.position.set(0, .004, 0); const fr = g.spec.stem > .02 ? (g.spec.foot || .38) : g.rAt(0) * .9; blob.scale.setScalar(fr * 1.5 + .15);
  clearLines(); return CUR;
}
// 結果で見せる線（あなた・本当の50%・高さ半分）
const lineGrp = new THREE.Group(); WORLD.add(lineGrp);
function clearLines() { while (lineGrp.children.length) { const m = lineGrp.children.pop(); m.geometry.dispose(); m.material.dispose(); } }
function addLine(yn, col, dash) { const g = CUR.g; const n = 144; const pts = []; for (let j = 0; j <= n; j++) { const th = j / n * Math.PI * 2; const rr = g.rAt(yn) * g.secR(th, yn) + GT + .012; pts.push(new THREE.Vector3(Math.cos(th) * rr, yn * g.H, Math.sin(th) * rr)); } const geo = new THREE.BufferGeometry().setFromPoints(pts); const mat = dash ? new THREE.LineDashedMaterial({ color: col, dashSize: .05, gapSize: .04, depthTest: false, transparent: true }) : new THREE.LineBasicMaterial({ color: col, depthTest: false, transparent: true }); const l = new THREE.Line(geo, mat); if (dash) l.computeLineDistances(); l.renderOrder = 6; l.userData = { yn }; lineGrp.add(l); return l; }

// シェイカー（注ぎ口が原点、胴体は -y の向き）
const shk = new THREE.Group(); WORLD.add(shk); {
  const P = (r, y) => new THREE.Vector2(r, y);
  const body = new THREE.Mesh(new THREE.LatheGeometry([P(.001, -.86), P(.17, -.86), P(.19, -.84), P(.215, -.42), P(.22, -.36), P(.2, -.34)], 40), metalMat); shk.add(body);
  const band = new THREE.Mesh(new THREE.LatheGeometry([P(.2, -.34), P(.225, -.335), P(.225, -.31), P(.2, -.305)], 40), metalMat2); shk.add(band);
  const sh = new THREE.Mesh(new THREE.LatheGeometry([P(.2, -.305), P(.19, -.26), P(.13, -.17), P(.095, -.13), P(.095, -.12)], 40), metalMat); shk.add(sh);
  const cap = new THREE.Mesh(new THREE.LatheGeometry([P(.095, -.12), P(.1, -.115), P(.1, -.03), P(.085, -.005), P(.05, 0), P(.001, 0)], 32), metalMat2); shk.add(cap);
}
// 特別なコード：シェイカーの代わりに、絵（フェルメール「牛乳を注ぐ女」）が注ぐ。絵の中の壺の口が原点にくる
const shkBody = new THREE.Group(); while (shk.children.length) shkBody.add(shk.children[0]); shk.add(shkBody);
const PIC_H = 1.5, PIC_W = PIC_H * 900 / 1009, PIC_U = .334, PIC_V = .584; // 壺の口の場所（絵の左から・上から）
const picPivot = new THREE.Group(); shk.add(picPivot); const pic = new THREE.Group(); pic.visible = false; picPivot.add(pic); pic.position.set((.5 - PIC_U) * PIC_W, (PIC_V - .5) * PIC_H, 0);
const picMat = new THREE.MeshBasicMaterial({ color: 0x777777, toneMapped: false });
{ const fr = new THREE.Mesh(new THREE.BoxGeometry(PIC_W + .1, PIC_H + .1, .04), new THREE.MeshStandardMaterial({ color: 0xb8893a, metalness: .9, roughness: .35 })); fr.position.z = -.03; pic.add(fr); const pl = new THREE.Mesh(new THREE.PlaneGeometry(PIC_W, PIC_H), picMat); pic.add(pl); }
let MILK = !!ls.get('ff_milk', 0), picLoaded = false, picZ = -1;
function picPlace(z) { picZ = z; picPivot.position.set(0, 0, z); }
function setMilk(on) {
  MILK = !!on; ls.set('ff_milk', MILK ? 1 : 0); shkBody.visible = !MILK; pic.visible = MILK;
  if (MILK && !picLoaded) { picLoaded = true; new THREE.TextureLoader().load('milk.jpg?v=1', tx => { tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; picMat.map = tx; picMat.color.set(0xffffff); picMat.needsUpdate = true; }, undefined, () => { picLoaded = false; }); }
  if (CUR) { setColor(MILK && mode !== 'maker' ? 11 : (CUR.g.spec.col || 0)); picPlace(-(CUR.g.maxR + GT + .12)); if (mode === 'title' || mode === 'play') { frame(mode); camSnap = true; visual(P, 0); } }
}
// 注がれる筋
const STN = 17, STS = 8; const stPos = new Float32Array(STN * STS * 3); const stGeo = new THREE.BufferGeometry(); stGeo.setAttribute('position', new THREE.BufferAttribute(stPos, 3)); { const ix = []; for (let i = 0; i < STN - 1; i++)for (let j = 0; j < STS; j++) { const j2 = (j + 1) % STS; ix.push(i * STS + j, (i + 1) * STS + j, (i + 1) * STS + j2, i * STS + j, (i + 1) * STS + j2, i * STS + j2); } stGeo.setIndex(ix); }
const stream = new THREE.Mesh(stGeo, streamMat); stream.frustumCulled = false; stream.renderOrder = 1; WORLD.add(stream);
// しぶき
const DN = 220; const dPos = new Float32Array(DN * 3).fill(-99), dVel = new Float32Array(DN * 3), dLife = new Float32Array(DN); let dK = 0;
const dGeo = new THREE.BufferGeometry(); dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3)); const dropMat = new THREE.PointsMaterial({ size: .05, map: TEX_BOKEH, transparent: true, depthWrite: false, color: 0xff5d73, sizeAttenuation: true });
const drops = new THREE.Points(dGeo, dropMat); drops.frustumCulled = false; drops.renderOrder = 4; WORLD.add(drops);
function dropEmit(x, y, z, vx, vy, vz, life) { const i = dK++ % DN; dPos[i * 3] = x; dPos[i * 3 + 1] = y; dPos[i * 3 + 2] = z; dVel[i * 3] = vx; dVel[i * 3 + 1] = vy; dVel[i * 3 + 2] = vz; dLife[i] = life; }
function dropStep(dt) { for (let i = 0; i < DN; i++) { if (dLife[i] > 0) { dLife[i] -= dt; dVel[i * 3 + 1] -= 6 * dt; dPos[i * 3] += dVel[i * 3] * dt; dPos[i * 3 + 1] += dVel[i * 3 + 1] * dt; dPos[i * 3 + 2] += dVel[i * 3 + 2] * dt; if (dLife[i] <= 0) dPos[i * 3 + 1] = -99; } } dGeo.attributes.position.needsUpdate = true; }
function dropClear() { dPos.fill(-99); dLife.fill(0); dGeo.attributes.position.needsUpdate = true; }

// ===== 注ぐ計算（glass.js の totalOf と同じ手順） =====
function makePour() {
  return {
    tick: 0, tilt: 0, emitted: 0, landed: 0, em: [], log: [], seg: -1, end: -1, lastLand: -99999, lastEmit: -99999, landFlow: 0, spilled: false,
    step(pressed, wantEnd) {
      const i = this.tick; if (wantEnd && this.end < 0) this.end = i;
      const hold = pressed && this.end < 0 && this.log.length < 300;
      if (hold && this.seg < 0) this.seg = i; if (!hold && this.seg >= 0) { this.log.push([this.seg, i]); this.seg = -1; }
      this.tilt = GL.nextTilt(this.tilt, hold);
      const q = GL.flowOf(this.tilt); this.em.push(q); this.emitted += q; if (q > 0) this.lastEmit = i;
      const a = i - GL.FALL; let land = 0; if (a >= 0) { land = this.em[a]; if (land > 0) { this.landed += land; this.lastLand = i; } }
      this.landFlow = land; this.tick = i + 1;
    },
    get settled() { return this.end >= 0 && this.tilt <= 0 && this.tick > this.lastEmit + GL.FALL + 1 && this.tick > this.lastLand + HZ + 6; }
  };
}
const pressedAt = (log, i) => { for (const s of log) { if (s[0] <= i && i < s[1]) return true; if (s[0] > i) break; } return false; };

// ===== 画面のうごき =====
let mode = 'title', P = null, pressed = false, wantEnd = false, acc = 0, TIME = 0, spillT = -1, FIN = null, RUNST = null, replay = null, hintOff = false;
// 見るモード：グラスのまわりを360度見回す（yaw）・上からのぞく（pitch）。止めた視点のまま注げる
const VIEW = { on: false, yaw: 0, pitch: 0, drag: null, homing: false }, PMIN = -.1, PMAX = 1.25;
const PANELS = ['title', 'result', 'vidPanel', 'rankPanel', 'codePanel', 'madePanel'];
function show(id) { PANELS.forEach(p => $(p).hidden = (p !== id)); $('maker').hidden = id !== 'maker'; }
function big(h, cls) { const b = $('big'); b.innerHTML = h || ''; b.className = cls || ''; if (h) { void b.offsetWidth; b.classList.add('pop'); } }
let portrait = true, VW = 1, VH = 1;
// カメラ：グラス（と シェイカー）が画面のどこにどの大きさで見えるかを決める
const camGoal = { p: new THREE.Vector3(0, 1, 8), l: new THREE.Vector3(0, 1, 0) }; let camSnap = true;
function frame(kind) {
  if (!CUR) return; const g = CUR.g; const yb = 0, yt = -CUR.yb + g.H; let top = yt, xh = g.maxR + GT + .1, size = .74, cf = .5, cx = 0;
  if (kind === 'play') { top = yt + (MILK ? 1.62 : 1.12); xh = Math.max(xh, MILK ? 1.08 : .8); size = .76; cf = .52; }
  else if (kind === 'result') { xh += .55; if (portrait) { size = .3; cf = .2; } else { size = .7; cf = .5; cx = .22; } }
  else if (kind === 'title') { top = yt + (MILK ? 1.62 : 1.12); xh = Math.max(xh, MILK ? 1.08 : .8); size = portrait ? 1.0 : .8; cf = .5; }
  const V = top - yb; const tf = Math.tan(CAM.fov * Math.PI / 360); let visH = V / size; const needW = 2 * xh / .94; if (visH * CAM.aspect < needW) visH = needW / CAM.aspect;
  const d = visH / 2 / tf; const cy = (top + yb) / 2; const ly = cy - (.5 - cf) * visH; const lx = cx * visH * CAM.aspect;
  const el = .1304 + (kind === 'play' ? VIEW.pitch : 0); camGoal.l.set(lx, ly, 0); camGoal.p.set(lx, Math.max(.2, ly + d * Math.sin(el)), d * Math.cos(el));
}
function camStep(dt) { const k = camSnap ? 1 : Math.min(1, dt * 5); CAM.position.lerp(camGoal.p, k); CAM.userData.l = (CAM.userData.l || camGoal.l.clone()).lerp(camGoal.l, k); CAM.lookAt(CAM.userData.l); camSnap = false; }
function resize() { if (OGP || ICON) return; VW = innerWidth; VH = innerHeight; portrait = VW < VH * 1.05; R.setSize(VW, VH, false); CAM.aspect = VW / VH; CAM.updateProjectionMatrix(); fxSize(); if (mode === 'maker') layoutMaker(); else frame(mode === 'result' ? 'result' : mode === 'title' ? 'title' : 'play'); }
addEventListener('resize', resize);

// シェイカー・筋・水面を、いまの計算の状態に合わせる
const TH0 = 1.66, TH1 = 2.45;
function visual(Pp, dt) {
  const g = CUR.g, H = g.H; const tl = Pp ? Pp.tilt : 0; const a = sm(tl / GL.T0);
  let rimMin = 9; for (let j = 0; j < 24; j++)rimMin = Math.min(rimMin, g.rAt(1) * g.secR(j / 24 * 6.283, 1));
  const px = clamp(rimMin * .3, .02, .14), py = H + .34; const rx = MILK ? px : .5, ry = H + (MILK ? .72 : 1.04);
  const u0 = Math.max(0, tl - GL.T0) / (1 - GL.T0); const th = MILK ? a * .1 + u0 * .5 : a * TH0 + u0 * (TH1 - TH0);
  shk.position.set(lerp(rx, px, a), lerp(ry, py, a), 0); shk.rotation.z = th; const zs = MILK ? picZ : 0;
  const frac = Pp ? Math.min(1, Pp.landed) : 0; const level = g.levelOf(frac);
  let amp = 0; if (Pp) { const since = (Pp.tick - Pp.lastLand) / HZ; const e = clamp(1 - since, 0, 1); amp = .014 * e * (Pp.landFlow > 0 ? 1 : e) * Math.min(1, .35 + level * 2); }
  setLiquid(CUR, level, amp, TIME);
  // 筋
  const surf = level * H; let any = false;
  if (Pp) { const n = Pp.em.length; for (let k = 0; k < STN; k++) { const q = n - 1 - k >= 0 ? Pp.em[n - 1 - k] : 0; const f = k / (STN - 1); const y = py - (py - surf) * f * f; const rr = q > 0 ? .008 + Math.sqrt(q / GL.QMAX) * .03 * (1 - .35 * f) : 0; if (rr > 0) any = true; const sx = px + Math.sin(TIME * 23 + k * .5) * .003; for (let j = 0; j < STS; j++) { const an = j / STS * 6.283; const o = (k * STS + j) * 3; stPos[o] = sx + Math.cos(an) * rr; stPos[o + 1] = y; stPos[o + 2] = zs * (1 - f) + Math.sin(an) * rr; } } }
  stream.visible = any; if (any) { stGeo.attributes.position.needsUpdate = true; stGeo.computeVertexNormals(); }
  return { px, py, surf, level };
}

// ===== 遊ぶ =====
const gidOf = meta => meta.kind === 'c' ? 'c' + meta.code : meta.diff + meta.no;
const triedSet = () => new Set(ls.get('ff_tried', []));
function markTried(gid) { const s = triedSet(); if (!s.has(gid)) { s.add(gid); ls.set('ff_tried', [...s].slice(-3000)); } }
function startGlass(g, meta) {
  useGlass(g, meta); shk.visible = true; P = makePour(); pressed = false; wantEnd = false; acc = 0; spillT = -1; FIN = null; replay = null; hintOff = false; dropClear(); fxReset();
  VIEW.on = false; VIEW.yaw = 0; VIEW.pitch = 0; VIEW.homing = false; VIEW.drag = null;
  mode = 'play'; show(null); big(''); camSnap = true; frame('play');
  const gid = gidOf(meta); const practice = triedSet().has(gid);
  RUNST = { gid, state: practice ? 'practice' : 'pending', st: 0 };
  if (!practice) { markTried(gid); const R0 = RUNST; netStart(gid).then(r => { if (RUNST !== R0) return; R0.state = r.state; R0.st = r.st || 0; hud(); }).catch(() => { if (RUNST === R0) { R0.state = 'off'; hud(); } }); }
  hud(); $('hud').hidden = false; $('hint').hidden = false; $('hint').style.opacity = 1; $('hint').innerHTML = esc(t('hint')) + '<small>' + esc(t('hint2')) + '</small>';
  $('decide').hidden = false; $('decide').disabled = true; $('decide').textContent = t('decide'); viewUI();
  try { if (typeof gtag === 'function') gtag('event', 'game_start', { game: GAME, diff: meta.diff || 'c' }); } catch (e) { }
}
function metaLabel(meta) { return meta.kind === 'c' ? t('gCustom') + '「' + meta.name + '」' : t('gno', { n: no4(meta.no) }) + '・' + diffName(meta.diff); }
function metaName(meta, g) { return meta.kind === 'c' ? meta.name : GL.nameOf(g, LI()); }
function hud() { if (!CUR) return; const m = CUR.meta; $('hudG').textContent = m.kind === 'c' ? t('gCustom') + '　' + t('code') + ' ' + m.code : t('gno', { n: no4(m.no) }) + '・' + diffName(m.diff); $('hudN').textContent = metaName(m, CUR.g); $('hudP').textContent = mode === 'replay' ? '' : (RUNST && RUNST.state === 'practice') ? t('practice') : ''; }
function pickNo(diff) { const [a, b] = GL.RANGE[diff]; const tr = triedSet(); const free = []; for (let n = a; n <= b; n++)if (!tr.has(diff + n)) free.push(n); const pool2 = free.length ? free : Array.from({ length: b - a + 1 }, (_, i) => a + i); return pool2[Math.floor(Math.random() * pool2.length)]; }
function startNo(n) { n = clamp(Math.floor(n), 1, 1000); const g = GL.glassNo(n); startGlass(g, { kind: 'n', no: n, diff: GL.DIFF_OF(n) }); }
function startDiff(d) { ac(); sTap(); startNo(pickNo(d)); }
function startCustom(code, c) { const g = GL.build(GL.customSpec(c)); startGlass(g, { kind: 'c', code, name: String(c.n || t('defName')).slice(0, 12), cup: c }); }

const cv = $('c');
cv.addEventListener('pointerdown', e => { if (mode !== 'play') return; ac(); if (VIEW.on) { if (!wantEnd) { VIEW.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: VIEW.yaw, pitch: VIEW.pitch }; VIEW.homing = false; } } else pressed = true; try { cv.setPointerCapture(e.pointerId); } catch (_) { } e.preventDefault(); });
cv.addEventListener('pointermove', e => { const d = VIEW.drag; if (!d || d.id !== e.pointerId || mode !== 'play') return; VIEW.yaw = d.yaw + (e.clientX - d.x) * .009; VIEW.pitch = clamp(d.pitch + (e.clientY - d.y) * .006, PMIN, PMAX); frame('play'); camSnap = true; });
const up = () => { pressed = false; VIEW.drag = null; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up); addEventListener('blur', up);
addEventListener('keydown', e => { if (e.code === 'Space' && mode === 'play' && !e.repeat && !VIEW.on) { ac(); pressed = true; e.preventDefault(); } if (e.code === 'Enter' && mode === 'play' && !$('decide').disabled) $('decide').click(); });
addEventListener('keyup', e => { if (e.code === 'Space') pressed = false; });
addEventListener('contextmenu', e => e.preventDefault());
$('decide').onclick = () => { if (mode === 'play' && P && P.emitted > 0 && !wantEnd) { wantEnd = true; pressed = false; VIEW.on = false; VIEW.drag = null; sClink(); $('decide').disabled = true; $('hint').hidden = true; } else if (mode === 'replay') { endReplay(); } };

function viewUI() {
  const b = $('viewBtn'); b.textContent = t(VIEW.on ? 'pourBtn' : 'viewBtn'); b.classList.toggle('on', VIEW.on); $('homeBtn').textContent = t('homeBtn');
  if (mode !== 'play' || wantEnd) return; const h = $('hint');
  if (VIEW.on) { h.className = 'view'; h.hidden = false; h.style.opacity = 1; h.innerHTML = esc(t('viewHint')) + '<small>' + esc(t('viewHint2')) + '</small>'; }
  else { h.className = ''; h.innerHTML = esc(t('hint')) + '<small>' + esc(t('hint2')) + '</small>'; h.style.opacity = hintOff ? 0 : 1; }
}
$('viewBtn').onclick = () => { if (mode !== 'play' || wantEnd) return; ac(); sTap(); VIEW.on = !VIEW.on; pressed = false; VIEW.drag = null; viewUI(); };
$('homeBtn').onclick = () => { if (mode !== 'play') return; sTap(); VIEW.yaw = Math.atan2(Math.sin(VIEW.yaw), Math.cos(VIEW.yaw)); VIEW.homing = true; VIEW.drag = null; };
function playStep(dt) {
  const Pp = P; const rp = mode === 'replay'; let speed = 1;
  if (rp && replay) { const i = Pp.tick; const idle = Pp.tilt <= 0 && i > Pp.lastEmit + GL.FALL + 30 && i < replay.end && !pressedAt(replay.log, i + 40); if (idle) speed = 6; }
  acc += dt * speed; let n = Math.floor(acc * HZ); acc -= n / HZ; if (n > 60) n = 60; let landed0 = Pp.landed, flowSum = 0;
  for (let s = 0; s < n; s++) {
    if (rp) Pp.step(pressedAt(replay.log, Pp.tick), Pp.tick >= replay.end); else Pp.step(pressed, wantEnd);
    flowSum += Pp.landFlow;
    if (!Pp.spilled && Pp.landed > 1 + 1e-9) { Pp.spilled = true; spillT = 0; wantEnd = true; pressed = false; if (!rp) { sSpill(); big(esc(t('spill')), 'spill'); FX.shake = 1; $('decide').hidden = true; $('hint').hidden = true; } }
  }
  const V = visual(Pp, dt);
  // しぶきと音
  if (flowSum > 0) { const k = Math.min(4, 1 + Math.floor(flowSum / GL.QMAX * .5)); for (let i = 0; i < k; i++)if (Math.random() < .5) dropEmit(V.px + (Math.random() - .5) * .04, V.surf + .01, (Math.random() - .5) * .04, (Math.random() - .5) * .5, .5 + Math.random() * .7, (Math.random() - .5) * .5, .35); }
  pourSound(n ? Math.min(.22, flowSum / n / GL.QMAX * .3) : 0, V.level);
  if (Pp.spilled) { spillT += dt; const g = CUR.g; for (let i = 0; i < 5; i++) { const th = Math.random() * 6.283; const rr = g.rAt(1) * g.secR(th, 1) + GT; dropEmit(Math.cos(th) * rr, g.H, Math.sin(th) * rr, Math.cos(th) * .35, .25 + Math.random() * .3, Math.sin(th) * .35, .9); } }
  if (!rp) {
    if (!hintOff && Pp.emitted > 0) { hintOff = true; $('hint').style.opacity = 0; $('decide').disabled = false; }
    if (Pp.spilled && spillT > 1.5) finish(true); else if (!Pp.spilled && Pp.settled) finish(false);
  } else { if ((Pp.spilled && spillT > 1.5) || (!Pp.spilled && Pp.settled)) replayDone(); }
}

// ===== 結果 =====
function finish(spill) {
  const Pp = P, g = CUR.g, meta = CUR.meta; pourSound(0, 0); VIEW.on = false; VIEW.pitch = 0; VIEW.homing = false; VIEW.drag = null; $('hint').className = ''; if (Pp.seg >= 0) { Pp.log.push([Pp.seg, Pp.tick]); Pp.seg = -1; }
  const total = Pp.emitted; const pct = total * 100; const dev = Math.abs(pct - 50);
  FIN = { g, meta, spill, total, pct, dev, log: Pp.log.slice(), end: Pp.end, dur: Math.round(Pp.end / HZ * 1000) / 1000, hy: g.levelOf(Math.min(1, total)) * 100, run: RUNST, perfect: !spill && dev < 0.005, sent: null };
  try { if (typeof gtag === 'function') gtag('event', 'game_end', { game: GAME, diff: meta.diff || 'c', spill: spill ? 1 : 0 }); } catch (e) { }
  showResult(true);
}
function fmtPct(p) { return p.toFixed(2) + '%'; }
function showResult(first) {
  const F = FIN, g = F.g; mode = 'result'; show('result'); $('hud').hidden = true; $('hint').hidden = true; $('decide').hidden = true; big('');
  if (CUR.g !== g) { useGlass(g, F.meta); camSnap = true; } shk.visible = false; visual(null, 0); setLiquid(CUR, g.levelOf(Math.min(1, F.total)), 0, 0); stream.visible = false; frame('result');
  clearLines(); if (!F.spill) { const ly = addLine(g.levelOf(F.total), 0xffffff, false); ly.userData.k = 'you'; } const l5 = addLine(g.h50, 0xffc21a, false); l5.userData.k = 'fifty'; const lh = addLine(.5, 0x9aa4b5, true); lh.userData.k = 'half';
  setGold(F.perfect);
  $('rG').innerHTML = '<span class="tag ' + (F.meta.diff || 'c') + '">' + esc(diffName(F.meta.diff || 'c')) + '</span>' + esc(F.meta.kind === 'c' ? metaName(F.meta, g) + '　' + t('code') + ' ' + F.meta.code : t('gno', { n: no4(F.meta.no) }) + '　' + metaName(F.meta, g));
  const pc = $('rPct'); pc.className = 'pct' + (F.spill ? ' spill' : F.perfect ? ' gold' : ''); pc.textContent = F.spill ? t('spill') : fmtPct(F.pct);
  $('rDev').textContent = F.spill ? t('spill2') : F.perfect ? t('perfect') : F.pct > 50 ? t('devOver', { d: F.dev.toFixed(2) }) : t('devUnder', { d: F.dev.toFixed(2) });
  $('rFacts').innerHTML = (F.spill ? '' : '<i style="background:#fff;box-shadow:0 0 0 1px #999"></i>' + t('fYou', { h: F.hy.toFixed(0), p: F.pct.toFixed(2) }) + '<br>') + '<i style="background:#ffc21a"></i>' + t('f50', { h: (g.h50 * 100).toFixed(0) }) + '<br><i style="background:#9aa4b5"></i>' + t('fHalf', { p: (g.halfFrac * 100).toFixed(1) });
  recUI();
  $('xBtn').textContent = t('xpost'); $('imgBtn').textContent = t('img'); $('vidBtn').textContent = t('video'); $('nextBtn').textContent = t('next'); $('againBtn').textContent = t('again'); $('topBtn').textContent = t('top'); $('rRank').textContent = F.meta.kind === 'c' ? t('rkTitleC') : t('rank');
  $('result').querySelector('.card').scrollTop = 0;
  if (first) { if (F.spill) { } else if (F.perfect) { sPerfect(); fxConfetti(160); } else if (F.dev < 3) { sGood(); fxConfetti(F.dev < 1 ? 60 : 20); } else sSoso(); }
}
function recUI() {
  const F = FIN, st = F.run ? F.run.state : 'off'; const note = $('recNote'), form = $('recForm'); note.className = 'note'; form.hidden = true;
  if (F.spill) { note.textContent = t('recSpill'); return; }
  if (F.sent) { note.className = 'note ok'; note.innerHTML = F.sent; return; }
  if (st === 'practice') { note.textContent = t('recPractice'); return; }
  if (st === 'off' || PV && PV.off) { note.textContent = t('recOff'); return; }
  note.textContent = t('recAsk'); form.hidden = false; $('nameIn').placeholder = t('name'); if (!$('nameIn').value) $('nameIn').value = ls.get('ff_name', ''); $('recGo').textContent = t('recGo'); $('recGo').disabled = false;
}
$('recGo').onclick = async () => {
  const F = FIN; if (!F || F.sent) return; const nm = $('nameIn').value.trim().slice(0, 12); const note = $('recNote');
  if (!nm) { note.className = 'note err'; note.textContent = t('needname'); return; } if (badName(nm)) { note.className = 'note err'; note.textContent = t('badname'); return; }
  ls.set('ff_name', nm); $('recGo').disabled = true; note.className = 'note'; note.textContent = t('sending');
  try { const r = await submit(F, nm); if (FIN !== F) return; F.sent = F.meta.kind === 'c' ? t('sentC', { r: rankTxt(r.rc) }) : t('sent', { d: rankTxt(r.rd), a: rankTxt(r.ra) }) + (r.better ? '' : '<br>' + t('notbetter')); recUI(); }
  catch (e) { console.warn(e); if (FIN !== F) return; note.className = 'note err'; note.textContent = t('senderr'); $('recGo').disabled = false; }
};
$('nextBtn').onclick = () => { const m = FIN && FIN.meta; if (m && m.kind === 'n') startDiff(m.diff); else showTitle(); };
$('againBtn').onclick = () => { const F = FIN; if (!F) return; ac(); sTap(); startGlass(F.g, F.meta); };
$('topBtn').onclick = () => showTitle();
$('rRank').onclick = () => { const m = FIN.meta; if (m.kind === 'c') openRank('c', 'all', 'fin', m.code); else openRank(m.diff, 'd', 'fin'); };

// ===== タイトル =====
function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : lang; document.title = t('hud');
  $('tTitle').innerHTML = t('title'); $('tSub').textContent = t('sub'); $('tHow').innerHTML = t('how');
  $('dE').innerHTML = esc(t('dE')) + '<small>' + esc(t('dEs')) + '</small>'; $('dN').innerHTML = esc(t('dN')) + '<small>' + esc(t('dNs')) + '</small>'; $('dH').innerHTML = esc(t('dH')) + '<small>' + esc(t('dHs')) + '</small>';
  $('mkBtn').textContent = t('mk'); $('codeBtn').textContent = t('codeBtn'); $('rankBtn').textContent = t('rank');
  $('langs').innerHTML = ''; LANGS.forEach(([k, n]) => { const b = document.createElement('button'); b.textContent = n; b.className = k === lang ? 'on' : ''; b.onclick = () => { lang = k; ls.set('ff_lang', k); applyLang(); }; $('langs').appendChild(b); });
  $('cpHead').textContent = t('cpHead'); $('cpMilk').textContent = t('milkBack'); $('cpGo').textContent = t('cpGo'); $('cpBack').textContent = t('back'); $('rankBack').textContent = t('back');
  $('vShare').textContent = t('vShare'); $('vSave').textContent = t('vSave'); $('vX').textContent = t('xpost'); $('vBack').textContent = t('back');
  $('mkTop').innerHTML = esc(t('mkTop')) + '<small>' + esc(t('mkTop2')) + '</small>'; [['mkLSec', 'mkLSec'], ['mkLAmp', 'mkLAmp'], ['mkLTw', 'mkLTw'], ['mkLSt', 'mkLSt'], ['mkLRim', 'mkLRim'], ['mkLWid', 'mkLWid'], ['mkLBot', 'mkLBot'], ['mkLHt', 'mkLHt']].forEach(([id, k]) => { $(id).textContent = t(k); }); $('mkName').placeholder = t('mkName'); $('mkBack').textContent = t('back'); $('mkClear').textContent = t('mkClear'); $('mkSave').textContent = t('mkSave'); if (MK && mode === 'maker') mkUI();
  $('mdHead').textContent = t('mdHead'); $('mdHow').textContent = t('mdHow'); $('mdPlay').textContent = t('mdPlay'); $('mdX').textContent = t('mdX'); $('mdCopy').textContent = t('mdCopy'); $('mdTop').textContent = t('top');
  if (mode === 'result' && FIN) showResult(false); if (mode === 'play' || mode === 'replay') hud(); viewUI();
}
let titleNo = 1;
function showTitle() {
  mode = 'title'; camera = CAM; shk.visible = true; show('title'); $('hud').hidden = true; $('hint').hidden = true; $('decide').hidden = true; big(''); fxReset(); dropClear(); pourSound(0, 0); P = null; replay = null;
  titleNo = [1, 13, 6, 2, 25, 4][Math.floor(Math.random() * 6)]; const g = GL.glassNo(titleNo); useGlass(g, { kind: 'n', no: titleNo, diff: 'e' }); setLiquid(CUR, g.h50, 0, 0); visual(null, 0); setLiquid(CUR, g.h50, 0, 0); camSnap = true; frame('title');
}
$('dE').onclick = () => startDiff('e'); $('dN').onclick = () => startDiff('n'); $('dH').onclick = () => startDiff('h');
$('rankBtn').onclick = () => openRank('e', 'd', 'title');
$('codeBtn').onclick = () => { show('codePanel'); $('cpMsg').textContent = ''; $('codeIn').value = ''; $('cpMilk').hidden = !MILK; };
$('cpBack').onclick = () => showTitle();
const normCode = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/O/g, '0').replace(/I/g, '1').slice(0, 8);
async function goCode(code, silent) {
  code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8); const msg = $('cpMsg');
  if (code === 'NATH' && !silent) { setMilk(!MILK); sClink(); msg.className = 'note ok'; msg.textContent = t(MILK ? 'milkOn' : 'milkOff'); $('codeIn').value = ''; $('cpMilk').hidden = !MILK; try { if (typeof gtag === 'function') gtag('event', 'special_code', { game: GAME, on: MILK ? 1 : 0 }); } catch (e) { } return false; } if (code.length !== 8) { if (!silent) { msg.className = 'note err'; msg.textContent = t('cpNone'); } return false; }
  msg.className = 'note'; msg.textContent = t('loading');
  try { const c = await loadCup(code); if (!c) { msg.className = 'note err'; msg.textContent = t('cpNone'); return false; } ac(); startCustom(code, c); return true; }
  catch (e) { msg.className = 'note err'; msg.textContent = t('neterr'); return false; }
}
$('cpGo').onclick = () => { ac(); goCode($('codeIn').value); };
$('cpMilk').onclick = () => { setMilk(false); $('cpMilk').hidden = true; $('cpMsg').className = 'note ok'; $('cpMsg').textContent = t('milkOff'); };

// ===== 効果（紙ふぶき・ゆれ・線の名前） =====
const FXC = $('fx'), fxg = FXC.getContext('2d'); let fxW = 0, fxH = 0;
const FX = { conf: [], shake: 0 };
function fxSize() { const d = Math.min(2, window.devicePixelRatio || 1); fxW = innerWidth; fxH = innerHeight; FXC.width = fxW * d; FXC.height = fxH * d; fxg.setTransform(d, 0, 0, d, 0, 0); }
function fxReset() { FX.conf = []; FX.shake = 0; }
function fxConfetti(n) { const C = ['#ffd23a', '#ff5d73', '#b46cff', '#3fd28b', '#4aa8ff', '#ffffff', '#ff9f1c']; for (let i = 0; i < n; i++)FX.conf.push({ x: .5 + (Math.random() - .5) * .3, y: .22, vx: (Math.random() - .5) * 1.1, vy: -.5 - Math.random() * .9, r: Math.random() * 6.28, vr: (Math.random() - .5) * 12, c: C[i % C.length], s: 5 + Math.random() * 6, l: 2.2 + Math.random() * 1.2 }); }
function fxStep(dt) { FX.shake = Math.max(0, FX.shake - dt * 2.4); for (const c of FX.conf) { c.vy += 1.5 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.r += c.vr * dt; c.l -= dt; } FX.conf = FX.conf.filter(c => c.l > 0 && c.y < 1.2); }
const _v = new THREE.Vector3();
function proj(x, y, z, W, Hh, cam) { _v.set(x, y, z); WORLD.localToWorld(_v); _v.project(cam || camera); return [(_v.x * .5 + .5) * W, (-_v.y * .5 + .5) * Hh]; }
function drawLabels(g2, W, Hh, sc, cam) {
  if (!CUR) return; const g = CUR.g; g2.save(); g2.textBaseline = 'middle'; g2.lineJoin = 'round';
  const items = []; for (const l of lineGrp.children) { const yn = l.userData.yn; const rr = g.rAt(yn) * g.secR(0, yn) + GT + .012; let mx = 0; for (let j = 0; j < 24; j++)mx = Math.max(mx, g.rAt(yn) * g.secR(j / 24 * 6.283, yn)); const [x, y] = proj(mx + GT + .05, yn * g.H, 0, W, Hh, cam); const k = l.userData.k; items.push({ x, y, k, txt: k === 'you' ? t('lYou') : k === 'fifty' ? t('lFifty') : t('lHalf'), col: k === 'you' ? '#ffffff' : k === 'fifty' ? '#ffc21a' : '#b9c2d0' }); }
  items.sort((a, b) => a.y - b.y); const fs = 13 * sc; for (let i = 1; i < items.length; i++)if (items[i].y - items[i - 1].y < fs * 1.25) items[i].y = items[i - 1].y + fs * 1.25;
  for (const it of items) { g2.font = '900 ' + fs + 'px ' + FF; const w = g2.measureText(it.txt).width; let x = it.x + 6 * sc; if (x + w > W - 4) x = W - 4 - w; g2.lineWidth = 4 * sc; g2.strokeStyle = '#000c'; g2.strokeText(it.txt, x, it.y); g2.fillStyle = it.col; g2.fillText(it.txt, x, it.y); }
  g2.restore();
}
function drawFX(g2, W, Hh) { for (const c of FX.conf) { g2.save(); g2.translate(c.x * W, c.y * Hh); g2.rotate(c.r); g2.fillStyle = c.c; g2.globalAlpha = Math.min(1, c.l); g2.fillRect(-c.s / 2, -c.s / 4, c.s, c.s / 2); g2.restore(); } }

// ===== Xへの投稿 =====
function postText() {
  const F = FIN; if (!F) return ''; const m = F.meta, nm = metaName(m, F.g); let s;
  if (m.kind === 'c') s = F.spill ? t('postSC', { name: nm, code: m.code }) : F.perfect ? t('postPC', { name: nm, code: m.code }) : t('postC', { p: F.pct.toFixed(2), name: nm, code: m.code });
  else s = F.spill ? t('postS', { n: no4(m.no), name: nm, diff: diffName(m.diff) }) : F.perfect ? t('postP', { n: no4(m.no), name: nm, diff: diffName(m.diff) }) : t('post', { p: F.pct.toFixed(2), n: no4(m.no), name: nm, diff: diffName(m.diff) });
  return s + '\n' + t('tags');
}
function shareURL() { const F = FIN; if (!F) return GAME_URL; return F.meta.kind === 'c' ? GAME_URL + '?c=' + F.meta.code : GAME_URL + '?g=' + F.meta.no; }
let QUOTE = {}; if (!PV) fetch('https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/xquote/g/' + GAME + '.json').then(r => r.json()).then(d => { if (d && typeof d === 'object') QUOTE = d; }).catch(() => { });
function quoteURL() { const u = (lang === 'ja' ? QUOTE.ja : QUOTE.en) || ''; return /^https:\/\/x\.com\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}$/.test(u) ? u : ''; }
function xIntent(text, url) { const q = quoteURL(); return 'https://x.com/intent/post?text=' + encodeURIComponent(q ? text + '\n' + url : text) + '&url=' + encodeURIComponent(q || url); }
const openXWith = (text, url) => { const u = xIntent(text, url); const w = window.open(u, '_blank'); if (!w) location.href = u; };
const openX = () => openXWith(postText(), shareURL());
$('xBtn').onclick = openX; $('vX').onclick = openX;

// ===== 結果の画像と動画 =====
// 画面と同じ絵を、決めた大きさでもう一度描いて取りこむ
function renderTo(g2, W, Hh, kind) {
  const keepA = CAM.aspect; R.setPixelRatio(1); R.setSize(W, Hh, false); CAM.aspect = W / Hh; CAM.updateProjectionMatrix(); const pp = portrait; portrait = true; frame(kind); portrait = pp; camSnap = true; camStep(0);
  R.render(SC, CAM); g2.drawImage(R.domElement, 0, 0, W, Hh);
  return () => { R.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); R.setSize(VW, VH, false); CAM.aspect = keepA; CAM.updateProjectionMatrix(); };
}
function fitF(g2, s, z, wt, maxW) { g2.font = wt + ' ' + z + 'px ' + FF; while (g2.measureText(s).width > maxW && z > 12) { z -= 2; g2.font = wt + ' ' + z + 'px ' + FF; } }
function txt2(g2, s, x, y) { g2.strokeText(s, x, y); g2.fillText(s, x, y); }
function drawCard(g2, W, Hh, F, a, top) { // 結果の文字（画像と動画で同じ）
  const u = W / 540; g2.save(); g2.globalAlpha = a; g2.textAlign = 'center'; g2.textBaseline = 'alphabetic'; g2.lineJoin = 'round'; g2.strokeStyle = '#000d'; g2.lineWidth = 8 * u;
  const gr = g2.createLinearGradient(0, top - 40 * u, 0, Hh); gr.addColorStop(0, 'rgba(10,6,20,0)'); gr.addColorStop(.25, 'rgba(10,6,20,.8)'); gr.addColorStop(1, 'rgba(10,6,20,.92)'); g2.fillStyle = gr; g2.fillRect(0, top - 40 * u, W, Hh - top + 40 * u);
  let y = top + 40 * u; const m = F.meta, nm = metaName(m, F.g);
  const l1 = m.kind === 'c' ? t('gCustom') + '「' + nm + '」 ' + t('code') + ' ' + m.code : t('gno', { n: no4(m.no) }) + '（' + diffName(m.diff) + '）' + nm;
  g2.fillStyle = '#e7dcff'; fitF(g2, l1, 24 * u, 900, W - 40 * u); txt2(g2, l1, W / 2, y); y += 96 * u;
  const big2 = F.spill ? t('spill') : fmtPct(F.pct); g2.fillStyle = F.spill ? '#ff6a5c' : F.perfect ? '#ffd23a' : '#ffffff'; g2.lineWidth = 12 * u; fitF(g2, big2, 104 * u, 900, W - 40 * u); txt2(g2, big2, W / 2, y); y += 50 * u; g2.lineWidth = 8 * u;
  const l3 = F.spill ? t('spill2') : F.perfect ? t('perfect') : F.pct > 50 ? t('devOver', { d: F.dev.toFixed(2) }) : t('devUnder', { d: F.dev.toFixed(2) }); g2.fillStyle = '#ffd23a'; fitF(g2, l3, 32 * u, 900, W - 40 * u); txt2(g2, l3, W / 2, y); y += 46 * u;
  const strip = s => s.replace(/<[^>]+>/g, ''); g2.fillStyle = '#d5dbe6'; const l4 = strip(t('f50', { h: (F.g.h50 * 100).toFixed(0) })), l5 = strip(t('fHalf', { p: (F.g.halfFrac * 100).toFixed(1) }));
  fitF(g2, l4, 22 * u, 800, W - 40 * u); txt2(g2, l4, W / 2, y); y += 32 * u; fitF(g2, l5, 22 * u, 800, W - 40 * u); txt2(g2, l5, W / 2, y);
  g2.restore();
}
function drawBrand(g2, W, Hh) { const u = W / 540; g2.save(); g2.textAlign = 'center'; g2.lineJoin = 'round'; g2.lineWidth = 8 * u; g2.strokeStyle = '#000c'; g2.fillStyle = '#fff'; g2.font = '900 ' + 40 * u + 'px ' + FF; txt2(g2, t('hud'), W / 2, 62 * u); g2.lineWidth = 6 * u; g2.fillStyle = '#fffc'; g2.font = '700 ' + 20 * u + 'px system-ui,sans-serif'; txt2(g2, GAME_URL.replace('https://', ''), W / 2, Hh - 22 * u); g2.restore(); }
let vidBusy = false, vidExt = 'mp4', shareBlob = null;
$('imgBtn').onclick = () => { if (!FIN || vidBusy) return; makeImage(); };
$('vidBtn').onclick = () => { if (!vidBusy && FIN) makeVideo(); };
$('vBack').onclick = () => { showResult(false); };
function makeImage() {
  const F = FIN, W = 1080, Hh = 1350; const c = document.createElement('canvas'); c.width = W; c.height = Hh; const g2 = c.getContext('2d');
  const size = .5, back = renderImgFrame(g2, W, Hh); drawLabels(g2, W, Hh, 2.4, CAM); drawBrand(g2, W, Hh); drawCard(g2, W, Hh, F, 1, Hh * .585); back(); frame('result'); camSnap = true;
  c.toBlob(b => { shareDone(b, 'png'); }, 'image/png');
}
function renderImgFrame(g2, W, Hh) { // 画像用：グラスを上半分に大きく
  const keepA = CAM.aspect; R.setPixelRatio(1); R.setSize(W, Hh, false); CAM.aspect = W / Hh; CAM.updateProjectionMatrix();
  const g = CUR.g; const yt = -CUR.yb + g.H; const V = yt + .1; const tf = Math.tan(CAM.fov * Math.PI / 360); let visH = V / .46; const needW = 2 * (g.maxR + .7) / .94; if (visH * CAM.aspect < needW) visH = needW / CAM.aspect; const d = visH / 2 / tf; const cy = V / 2; const ly = cy - (.5 - .34) * visH;
  CAM.position.set(0, ly + d * .13, d * .991); CAM.lookAt(0, ly, 0); CAM.userData.l = new THREE.Vector3(0, ly, 0); CAM.updateMatrixWorld();
  R.render(SC, CAM); g2.drawImage(R.domElement, 0, 0, W, Hh);
  return () => { R.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); R.setSize(VW, VH, false); CAM.aspect = keepA; CAM.updateProjectionMatrix(); };
}
async function makeVideo() {
  vidBusy = true; const W = 540, Hh = 960; const vc = document.createElement('canvas'); vc.width = W; vc.height = Hh;
  if (!vc.captureStream || !window.MediaRecorder) { shareDone(null, 'mp4'); return; }
  const F = FIN; show(null); mode = 'video'; $('recBadge').hidden = false; $('recBadge').textContent = '● ' + t('making');
  const g2 = vc.getContext('2d'); ac(); let dest = null; try { dest = AC.createMediaStreamDestination(); master.connect(dest); } catch (e) { }
  const stream2 = vc.captureStream(30); if (dest) dest.stream.getAudioTracks().forEach(tr => stream2.addTrack(tr));
  const types = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4;codecs=avc3,mp4a.40.2', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  const mime = types.find(x => { try { return MediaRecorder.isTypeSupported(x) } catch (e) { return false } }) || ''; vidExt = mime.includes('mp4') ? 'mp4' : 'webm';
  let rec; const restore0 = () => { try { if (dest) master.disconnect(dest); } catch (_) { } $('recBadge').hidden = true; R.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); R.setSize(VW, VH, false); CAM.aspect = VW / VH; CAM.updateProjectionMatrix(); pourSound(0, 0); };
  try { rec = new MediaRecorder(stream2, mime ? { mimeType: mime, videoBitsPerSecond: 4e6 } : {}); } catch (e) { restore0(); shareDone(null, 'mp4'); return; }
  const chunks = []; rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); }; const stopped = new Promise(r => { rec.onstop = r; }); rec.start(200);
  // 注いだ操作をそのまま再生する
  clearLines(); setGold(false); dropClear(); fxReset(); shk.visible = true; const Pp = makePour(); const rp = { log: F.log, end: F.end }; let a2 = 0, sT = -1, endAt = -1, T = 0, last = performance.now(), cardOn = false;
  R.setPixelRatio(1); R.setSize(W, Hh, false); CAM.aspect = W / Hh; CAM.updateProjectionMatrix(); const pp = portrait; portrait = true; frame('play'); camSnap = true;
  const CARD = 3.2;
  await new Promise(res => {
    function step(now) {
      const dt = Math.min(.05, (now - last) / 1000); last = now; T += dt; TIME += dt;
      if (endAt < 0) {
        let speed = 1; const i = Pp.tick; if (Pp.tilt <= 0 && i > Pp.lastEmit + GL.FALL + 30 && i < rp.end && !pressedAt(rp.log, i + 40)) speed = 8;
        a2 += dt * speed; let n = Math.floor(a2 * HZ); a2 -= n / HZ; if (n > 80) n = 80; let fs = 0;
        for (let s = 0; s < n; s++) { Pp.step(pressedAt(rp.log, Pp.tick), Pp.tick >= rp.end); fs += Pp.landFlow; if (!Pp.spilled && Pp.landed > 1 + 1e-9) { Pp.spilled = true; sT = 0; sSpill(); } }
        const V = visual(Pp, dt); if (fs > 0 && Math.random() < .6) dropEmit(V.px, V.surf + .01, 0, (Math.random() - .5) * .5, .5 + Math.random() * .7, (Math.random() - .5) * .5, .35);
        pourSound(n ? Math.min(.22, fs / n / GL.QMAX * .3) : 0, V.level);
        if (Pp.spilled) { sT += dt; const g = CUR.g; for (let q = 0; q < 4; q++) { const th = Math.random() * 6.283; const rr = g.rAt(1) * g.secR(th, 1) + GT; dropEmit(Math.cos(th) * rr, g.H, Math.sin(th) * rr, Math.cos(th) * .35, .3, Math.sin(th) * .35, .9); } }
        if ((Pp.spilled && sT > 1.2) || (!Pp.spilled && Pp.settled)) { endAt = T; pourSound(0, 0); shk.visible = false; visual(null, 0); setLiquid(CUR, CUR.g.levelOf(Math.min(1, F.total)), 0, 0); stream.visible = false; if (!F.spill) addLine(CUR.g.levelOf(F.total), 0xffffff, false).userData.k = 'you'; addLine(CUR.g.h50, 0xffc21a, false).userData.k = 'fifty'; addLine(.5, 0x9aa4b5, true).userData.k = 'half'; setGold(F.perfect); if (F.perfect) { sPerfect(); fxConfetti(120); } else if (!F.spill && F.dev < 3) { sGood(); fxConfetti(30); } else if (!F.spill) sSoso(); portrait = true; frame('result'); camGoal.l.y += 0; }
      }
      dropStep(dt); fxStep(dt); camStep(dt); R.render(SC, CAM); g2.clearRect(0, 0, W, Hh); g2.drawImage(R.domElement, 0, 0, W, Hh);
      if (endAt >= 0) { const k = sm((T - endAt - .5) / .4); if (T - endAt > .35) drawLabels(g2, W, Hh, 1.3, CAM); drawCard(g2, W, Hh, F, k, Hh * .56); }
      else { g2.save(); g2.textAlign = 'center'; g2.lineJoin = 'round'; g2.lineWidth = 7; g2.strokeStyle = '#000c'; g2.fillStyle = '#ffd23a'; g2.font = '900 30px ' + FF; txt2(g2, t('vHow'), W / 2, 112); g2.restore(); }
      drawFX(g2, W, Hh); drawBrand(g2, W, Hh);
      if (endAt >= 0 && T >= endAt + CARD) res(); else requestAnimationFrame(step);
    } requestAnimationFrame(step);
  });
  rec.stop(); await stopped; portrait = pp; restore0(); shareDone(new Blob(chunks, { type: (mime || 'video/webm').split(';')[0] }), vidExt);
}
function shareDone(blob, ext) {
  vidBusy = false; mode = 'result'; shk.visible = false; show('vidPanel'); const isImg = ext === 'png'; $('vidPrev').hidden = true; $('imgPrev').hidden = true; clearLines(); const F = FIN; if (!F.spill) addLine(F.g.levelOf(F.total), 0xffffff, false).userData.k = 'you'; addLine(F.g.h50, 0xffc21a, false).userData.k = 'fifty'; addLine(.5, 0x9aa4b5, true).userData.k = 'half'; setGold(F.perfect); visual(null, 0); setLiquid(CUR, F.g.levelOf(Math.min(1, F.total)), 0, 0); frame('result'); camSnap = true;
  if (!blob || !blob.size) { $('vMsg').textContent = t('vfail'); $('vShare').hidden = $('vSave').hidden = true; return; }
  const url = URL.createObjectURL(blob); if (isImg) { $('imgPrev').hidden = false; $('imgPrev').src = url; } else { $('vidPrev').hidden = false; $('vidPrev').src = url; $('vidPrev').play().catch(() => { }); }
  const nm = GAME + '_' + (F.spill ? 'spill' : F.pct.toFixed(2)) + '.' + ext; const file = new File([blob], nm, { type: blob.type }); const canShare = !!(navigator.canShare && navigator.canShare({ files: [file] }));
  $('vShare').hidden = !canShare; $('vSave').hidden = false; $('vMsg').textContent = canShare ? t(isImg ? 'imade' : 'vmade') : t(isImg ? 'ihint' : 'shareHint');
  $('vShare').onclick = async () => { try { await navigator.share({ files: [file], text: postText() + '\n' + shareURL() + (quoteURL() ? '\n' + quoteURL() : '') }); } catch (e) { } };
  $('vSave').onclick = () => { const a = document.createElement('a'); a.href = url; a.download = nm; document.body.appendChild(a); a.click(); a.remove(); };
}

// ===== 通信（Firebase：ft-red の fifty の下） =====
const FB = { apiKey: 'AIzaSyBCzVyblBmfNQq4XdPHdQppE94gyiYxDkA', databaseURL: (PV && PV.db) || 'https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app', auth: (PV && PV.auth) || null };
const NG = ['ちんこ', 'ちんぽ', 'まんこ', 'せっくす', 'セックス', 'きんたま', 'レイプ', '死ね', 'しね', '殺す', 'ころす', 'ガイジ', 'キチガイ', 'きちがい', 'ニガー', 'チョン', '支那', 'fuck', 'shit', 'bitch', 'cunt', 'dick', 'pussy', 'nigger', 'nigga', 'faggot', 'retard', 'whore', 'slut', 'rape', 'porn', 'nazi', 'hitler', '씨발', '시발', '병신', '좆', '肏', '屄', '屌', '幹你', '操你', '婊子'];
const badName = s => { const n = s.normalize('NFKC').toLowerCase().replace(/[\s・._\-ー〜~!！?？*＊]/g, ''); return NG.some(w => n.includes(w.normalize('NFKC').toLowerCase())); };
async function fetchR(url, opt) { let err; for (let i = 0; i < 3; i++) { try { return await fetch(url, opt); } catch (e) { err = e; await new Promise(r => setTimeout(r, 500 * (i + 1))); } } throw err; }
const NONET = !!(PV && !PV.db);
let AUTH = null, authP = null;
function fbAuth() { if (NONET) return Promise.reject(new Error('pv')); if (AUTH && AUTH.exp > Date.now() + 60000) return Promise.resolve(AUTH); if (!authP) authP = fbAuth0().then(a => { AUTH = a; authP = null; return a; }, e => { authP = null; throw e; }); return authP; }
async function fbAuth0() {
  let a = AUTH || ls.get('ff_auth', null); if (a && a.exp > Date.now() + 60000) return a;
  const idURL = FB.auth ? FB.auth + '/identitytoolkit.googleapis.com/v1/accounts:signUp?key=x' : 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FB.apiKey;
  const tkURL = FB.auth ? FB.auth + '/securetoken.googleapis.com/v1/token?key=x' : 'https://securetoken.googleapis.com/v1/token?key=' + FB.apiKey;
  if (a && a.refresh) { try { const r = await fetchR(tkURL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(a.refresh) }); if (r.ok) { const j = await r.json(); a = { uid: j.user_id, token: j.id_token, refresh: j.refresh_token, exp: Date.now() + (+j.expires_in) * 1000 }; ls.set('ff_auth', a); return a; } } catch (_) { } }
  const r = await fetchR(idURL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
  if (!r.ok) throw new Error('auth'); const j = await r.json(); a = { uid: j.localId, token: j.idToken, refresh: j.refreshToken, exp: Date.now() + (+j.expiresIn) * 1000 }; ls.set('ff_auth', a); return a;
}
const NSQ = (PV && PV.ns) ? '&ns=' + PV.ns : '';
const DB = p => FB.databaseURL + '/fifty/' + p;
const QA = a => '.json?auth=' + encodeURIComponent(a.token) + NSQ;
const QP = q => '.json?' + (q || '') + NSQ;
const PUT = (url, body) => fetchR(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const TS = { '.sv': 'timestamp' };
// グラスを出したとき：「このグラスに1回目の挑戦をした」とサーバーに書く。2回目からは練習になる
async function netStart(gid) {
  if (NONET) return { state: PV.off ? 'off' : 'yes', st: Date.now() };
  const a = await fbAuth(); const r1 = await PUT(DB('tried/' + a.uid + '/' + gid) + QA(a), TS); if (r1.status === 401 || r1.status === 403) return { state: 'practice' }; if (!r1.ok) throw new Error('tried ' + r1.status);
  const r2 = await PUT(DB('run/' + a.uid) + QA(a), { g: gid, st: TS }); if (!r2.ok) throw new Error('run ' + r2.status); const j = await r2.json().catch(() => null); let st = j && j.st; if (typeof st !== 'number') { const s = await fetchR(DB('run/' + a.uid) + QA(a)).then(x => x.json()); st = s.st; }
  return { state: 'yes', st };
}
const dayKey = ms => Math.floor((ms + 32400000) / 86400000);
const TOPN = 100;
async function submit(F, nm) {
  if (NONET) return { rd: 3, ra: 12, rc: 2, better: true };
  const a = await fbAuth(); const gid = gidOf(F.meta); const rec = { n: nm, g: gid, k: F.dev, dur: F.dur, lg: GL.encLog(F.log, F.end), st: F.run.st, v: 1, at: TS };
  const better = (old, k) => !old || !(old.k <= k);
  if (F.meta.kind === 'c') { const p = 'cr/' + F.meta.code + '/' + a.uid; const old = await fetchR(DB(p) + QP()).then(x => x.ok ? x.json() : null).catch(() => null); if (better(old, rec.k)) { const r = await PUT(DB(p) + QA(a), rec); if (!r.ok) throw new Error('cr ' + r.status); } const rows = await loadBoard('c', 'all', F.meta.code).catch(() => []); const me = rows.find(x => x.id === a.uid); return { rc: me ? me.rk : null, better: true }; }
  const d = F.meta.diff; const dk = dayKey(Date.now()); const recD = { ...rec, dk, ds: dk * 1000 + rec.k };
  const [old, oldD] = await Promise.all([fetchR(DB('b/' + d + '/all/' + a.uid) + QP()).then(x => x.ok ? x.json() : null).catch(() => null), fetchR(DB('b/' + d + '/d/' + a.uid) + QP()).then(x => x.ok ? x.json() : null).catch(() => null)]);
  const okA = better(old, rec.k), okD = !oldD || oldD.dk !== dk || !(oldD.k <= rec.k);
  if (okD) { const r = await PUT(DB('b/' + d + '/d/' + a.uid) + QA(a), recD); if (!r.ok) throw new Error('d ' + r.status); }
  if (okA) { const r = await PUT(DB('b/' + d + '/all/' + a.uid) + QA(a), rec); if (!r.ok) throw new Error('all ' + r.status); }
  const [rd, ra] = await Promise.all([myRank(d, 'd', a.uid), myRank(d, 'all', a.uid)]); return { rd, ra, better: okA };
}
// 記録が本当か：注いだ操作から量を計算しなおして、合わない記録は出さない
function checkRow(r, diff, code) {
  if (!r || typeof r.k !== 'number' || typeof r.lg !== 'string' || typeof r.n !== 'string' || typeof r.g !== 'string') return null; const L = GL.decLog(r.lg); if (!L) return null;
  const tot = GL.totalOf(L.log, L.end); if (!(tot > 0) || tot > 1 + 1e-9) return null; const pct = tot * 100; if (Math.abs(Math.abs(pct - 50) - r.k) > 1e-7) return null;
  if (diff === 'c') { if (r.g !== 'c' + code) return null; } else { const no = +r.g.slice(1); if (r.g[0] !== diff || !(no >= 1 && no <= 1000) || GL.DIFF_OF(no) !== diff) return null; r.no = no; }
  r.pct = pct; r.L = L; return r;
}
async function loadBoard(diff, when, code) {
  const today = dayKey(Date.now()); let url;
  if (diff === 'c') url = DB('cr/' + code) + QP('orderBy=%22k%22&limitToFirst=' + TOPN);
  else if (when === 'd') url = DB('b/' + diff + '/d') + QP('orderBy=%22ds%22&startAt=' + (today * 1000) + '&endAt=' + (today * 1000 + 999) + '&limitToFirst=' + TOPN);
  else url = DB('b/' + diff + '/all') + QP('orderBy=%22k%22&limitToFirst=' + TOPN);
  const [d, h] = await Promise.all([fetch(url).then(r => { if (!r.ok) throw 0; return r.json() }), fetch(DB('hidden') + QP()).then(r => r.ok ? r.json() : null).catch(() => null)]);
  const rows = Object.entries(d || {}).map(([id, v]) => ({ ...v, id })).filter(r => !(h && h[r.id])).map(r => checkRow(r, diff, code)).filter(Boolean).sort((a, b) => a.k - b.k || a.dur - b.dur || a.at - b.at);
  rows.forEach((r, i) => { r.rk = i + 1; }); return rows;
}
const rankTxt = r => r ? t('rankN', { r }) : t('rankOut');
async function myRank(diff, when, uid) { try { const rows = await loadBoard(diff, when); const r = rows.find(x => x.id === uid); return r ? r.rk : null; } catch (e) { return null; } }
let RK = { diff: 'e', when: 'd', from: null, code: null, rows: [] };
async function openRank(diff, when, from, code) {
  RK = { diff, when, from: from || RK.from, code: code || null, rows: [] }; mode = mode === 'replay' ? 'result' : mode; show('rankPanel'); $('hud').hidden = true; $('decide').hidden = true; big('');
  const isC = diff === 'c'; $('rkTitle').textContent = isC ? t('rkTitleC') : t('rank'); $('rkDiff').hidden = isC; $('rkWhen').hidden = isC; $('rkNote').textContent = t('rkNote');
  $('rkDiff').querySelectorAll('button').forEach(b => { const d = b.dataset.d; b.textContent = diffName(d); b.className = d === diff ? 'on' : ''; b.onclick = () => openRank(d, RK.when, RK.from); });
  $('rkWhen').querySelectorAll('button').forEach(b => { const w = b.dataset.w; b.textContent = t(w === 'd' ? 'today' : 'alltime'); b.className = w === when ? 'on' : ''; b.onclick = () => openRank(RK.diff, w, RK.from); });
  const box = $('rankBox'); box.innerHTML = '<p>' + t('loading') + '</p>';
  const rowH = (r, me) => '<tr data-i="' + r.rk + '"' + (me ? ' class="me"' : '') + '><td class="r">' + r.rk + '</td><td class="n">' + esc(r.n) + '<br><small style="color:var(--sub);font-size:11px">' + (isC ? '' : esc(t('gno', { n: no4(r.no) })) + '・') + fmtPct(r.pct) + '</small></td><td class="c">±' + r.k.toFixed(3) + '%　▶</td></tr>';
  try {
    let rows; if (NONET) { rows = [{ n: 'ぴったり職人', k: .012, pct: 49.988, no: 17, rk: 1 }, { n: ls.get('ff_name', 'なすび'), k: .34, pct: 50.34, no: 102, rk: 2, me: 1 }, { n: 'のみすぎ', k: 2.1, pct: 52.1, no: 44, rk: 3 }]; } else rows = await loadBoard(diff, when, code);
    RK.rows = rows; const myId = (ls.get('ff_auth', null) || {}).uid; let h = '<table class="rank">' + rows.slice(0, TOPN).map(r => rowH(r, r.me || r.id === myId)).join(''); if (!rows.length) h += '<tr><td></td><td colspan="2">' + t('empty') + '</td></tr>'; box.innerHTML = h + '</table>';
    box.querySelectorAll('tr[data-i]').forEach(tr => { tr.onclick = () => { const r = RK.rows[+tr.dataset.i - 1]; if (r && r.L) startReplay(r); }; });
  } catch (e) { box.innerHTML = '<p>' + t('rankerr') + '</p>'; }
}
$('rankBack').onclick = () => { if (RK.from === 'fin' && FIN) showResult(false); else showTitle(); };
// ランキングの行を押すと、その人の注ぎ方を再生する
async function startReplay(r) {
  let g, meta; if (RK.diff === 'c') { try { const c = await loadCup(RK.code); if (!c) return; g = GL.build(GL.customSpec(c)); meta = { kind: 'c', code: RK.code, name: String(c.n || '').slice(0, 12) }; } catch (e) { return; } } else { g = GL.glassNo(r.no); meta = { kind: 'n', no: r.no, diff: RK.diff }; }
  VIEW.on = false; VIEW.yaw = 0; VIEW.pitch = 0; VIEW.homing = false; VIEW.drag = null;
  ac(); useGlass(g, meta); shk.visible = true; P = makePour(); replay = { log: r.L.log, end: r.L.end, row: r }; acc = 0; spillT = -1; dropClear(); fxReset(); mode = 'replay'; show(null); camSnap = true; frame('play'); big('');
  hud(); $('hudP').textContent = t('replay', { n: r.n }); $('hud').hidden = false; $('hint').hidden = true; $('decide').hidden = false; $('decide').disabled = false; $('decide').textContent = t('back');
}
function replayDone() { if (!replay || replay.done) return; replay.done = true; pourSound(0, 0); const r = replay.row; big(fmtPct(r.pct) + '<br><span style="font-size:24px">±' + r.k.toFixed(3) + '%</span>'); addLine(CUR.g.h50, 0xffc21a, false).userData.k = 'fifty'; addLine(CUR.g.levelOf(r.pct / 100), 0xffffff, false).userData.k = 'you'; sGood(); }
function endReplay() { pourSound(0, 0); replay = null; P = null; clearLines(); shk.visible = !(FIN && RK.from === 'fin'); if (FIN && RK.from === 'fin') { useGlass(FIN.g, FIN.meta); } openRank(RK.diff, RK.when, RK.from, RK.code); if (!(FIN && RK.from === 'fin')) { const g = GL.glassNo(titleNo); useGlass(g, { kind: 'n', no: titleNo, diff: 'e' }); setLiquid(CUR, g.h50, 0, 0); } else { setLiquid(CUR, FIN.g.levelOf(Math.min(1, FIN.total)), 0, 0); } visual(null, 0); frame(FIN && RK.from === 'fin' ? 'result' : 'title'); camSnap = true; }

// ===== 自作グラス（ろくろ） =====
const CODE_CH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode = () => { let s = ''; const a = new Uint32Array(8); (window.crypto || { getRandomValues: x => { for (let i = 0; i < x.length; i++)x[i] = Math.random() * 4294967296; } }).getRandomValues(a); for (let i = 0; i < 8; i++)s += CODE_CH[a[i] % 32]; return s; };
const cupOK = c => c && typeof c === 'object' && Array.isArray(c.r) && c.r.length >= 24 && c.r.length <= 40 && c.r.every(x => typeof x === 'number') && typeof c.h === 'number';
async function loadCup(code) { if (NONET) return ls.get('ff_cup_' + code, null); const r = await fetch(DB('cups/' + code) + QP()); if (!r.ok) throw new Error('cup'); const c = await r.json(); return cupOK(c) ? c : null; }
async function saveCup(c) { if (NONET) { const code = newCode(); ls.set('ff_cup_' + code, c); return code; } const a = await fbAuth(); for (let i = 0; i < 4; i++) { const code = newCode(); const r = await PUT(DB('cups/' + code) + QA(a), { ...c, by: a.uid, at: TS }); if (r.ok) return code; if (r.status !== 401 && r.status !== 403) throw new Error('cup ' + r.status); } throw new Error('cup'); }
const SEC_ICON = ['○', '☆', '□', '✿', '△', '⚙', '⬭', '💧'];
// MK：base はなぞった形（40個の半径）。つまみ（ふち・太さ・底）は、その上から倍率をかける
let MK = null, mkL = null, mkStroke = null, mkSnap = null, mkPart = false, mkLast = 0, mkScope = 'all';
const MKN = GL.CUSTOM_N;
const defCup = () => { const base = []; for (let i = 0; i < MKN; i++)base.push(.06 + .64 * i / (MKN - 1)); return { base, h: .95, s: 0, s2: 0, a: 30, t: 0, st: 50, rim: 100, wid: 100, bot: 100, c: Math.floor(Math.random() * 12), drawn: false }; };
const mkMod = i => { const y = i / (MKN - 1); return (MK.wid / 100) * (1 + (MK.rim / 100 - 1) * sm((y - .55) / .45)) * (1 + (MK.bot / 100 - 1) * sm((.45 - y) / .45)); };
const mkR = i => clamp(MK.base[i] * mkMod(i), .045, 1);
function mkCup() { const r = []; for (let i = 0; i < MKN; i++)r.push(Math.round(mkR(i) * 1000)); if (r[MKN - 1] < 150) { r[MKN - 1] = 150; if (r[MKN - 2] < 110) r[MKN - 2] = 110; } return { r, h: Math.round(clamp(MK.h, .3, 1.85) * 100), s: MK.s, s2: MK.s2, a: MK.a, t: MK.t, st: MK.st, c: MK.c }; }
const MK_SL = [['mkRim', 'rim'], ['mkWid', 'wid'], ['mkBot', 'bot'], ['mkSt', 'st'], ['mkTw', 't'], ['mkAmp', 'a']];
function openMaker() {
  ac(); sTap(); mode = 'maker'; show('maker'); $('hud').hidden = true; $('hint').hidden = true; $('decide').hidden = true; big(''); P = null; pourSound(0, 0); if (!MK) MK = defCup();
  $('mkSecs').innerHTML = ''; SEC_ICON.forEach((ic, i) => { const b = document.createElement('button'); b.textContent = ic; b.onclick = () => { if (mkScope !== 'hi') MK.s = i; if (mkScope !== 'lo') MK.s2 = i; mkUI(); mkRebuild(); }; $('mkSecs').appendChild(b); });
  $('mkCols').innerHTML = ''; COLS.forEach((c, i) => { const b = document.createElement('button'); b.style.background = c; b.onclick = () => { MK.c = i; mkUI(); mkRebuild(); }; $('mkCols').appendChild(b); });
  $('mkScope').querySelectorAll('button').forEach(b => { b.onclick = () => { mkScope = b.dataset.s; mkUI(); }; });
  $('mkMsg').textContent = ''; mkUI(); layoutMaker(); mkRebuild();
}
function mkUI() {
  const cur = mkScope === 'hi' ? MK.s2 : MK.s;[...$('mkSecs').children].forEach((b, i) => b.className = (mkScope === 'all' ? (i === MK.s && i === MK.s2) : i === cur) ? 'on' : (mkScope === 'all' && (i === MK.s || i === MK.s2)) ? 'half' : '');
  [...$('mkCols').children].forEach((b, i) => b.className = i === MK.c ? 'on' : ''); $('mkScope').querySelectorAll('button').forEach(b => { b.className = b.dataset.s === mkScope ? 'on' : ''; b.textContent = t(b.dataset.s === 'all' ? 'scAll' : b.dataset.s === 'lo' ? 'scLo' : 'scHi'); });
  MK_SL.forEach(([id, k]) => { $(id).value = MK[k]; }); $('mkHt').value = Math.round(MK.h * 100);
}
MK_SL.forEach(([id, k]) => { $(id).oninput = e => { MK[k] = +e.target.value; mkRebuild(); }; });
$('mkHt').oninput = e => { MK.h = +e.target.value / 100; mkRebuild(); };
function layoutMaker() {
  const bar = $('mkBar').getBoundingClientRect(); const top = 50; const W = innerWidth, Hs = innerHeight; const Ah = Math.max(150, bar.top - top - 6);
  const dc = $('mkDraw'); dc.style.left = '0px'; dc.style.top = top + 'px'; dc.style.width = W + 'px'; dc.style.height = Ah + 'px'; const d = Math.min(2, window.devicePixelRatio || 1); dc.width = W * d; dc.height = Ah * d;
  const k = 1.95 / (Ah * .74); const axisX = W * .42, y0 = Ah * .78; mkL = { top, W, Hs, Ah, k, axisX, y0, d, maxR: Math.min(1, (W - axisX) * k - .03) };
  const py = top + y0; OCAM.left = -axisX * k; OCAM.right = (W - axisX) * k; OCAM.top = py * k; OCAM.bottom = -(Hs - py) * k; OCAM.updateProjectionMatrix(); OCAM.position.set(0, 0, 20); OCAM.lookAt(0, 0, 0); mkDraw();
}
function mkRebuild() { const g = GL.build(GL.customSpec(mkCup())); const rot = CUR ? CUR.grp.rotation.y : 0; useGlass(g, { kind: 'c', code: '', name: '' }); CUR.grp.rotation.y = rot; WORLD.position.y = 0; counter.position.y = CUR.yb; pool.position.y = CUR.yb + .003; blob.position.y = CUR.yb + .004; setLiquid(CUR, g.h50, 0, 0); shk.visible = false; stream.visible = false; mkDraw(); }
function mkDraw() {
  if (!mkL || !MK) return; const L = mkL, c = $('mkDraw'), g2 = c.getContext('2d'); g2.setTransform(L.d, 0, 0, L.d, 0, 0); g2.clearRect(0, 0, L.W, L.Ah);
  g2.fillStyle = 'rgba(255,255,255,.06)'; g2.fillRect(L.axisX, 0, L.W - L.axisX, L.y0);
  g2.strokeStyle = '#fff8'; g2.lineWidth = 1.5; g2.setLineDash([6, 6]); g2.beginPath(); g2.moveTo(L.axisX, 0); g2.lineTo(L.axisX, L.y0); g2.moveTo(L.axisX - 20, L.y0); g2.lineTo(L.W, L.y0); g2.stroke(); g2.setLineDash([]);
  g2.fillStyle = '#fffc'; g2.font = '900 12px ' + FF; g2.textAlign = 'right'; g2.fillText(t('mkArea'), L.W - 8, 16);
  // いまの形の線（この線の一部を上からなぞると、そこだけ変わる）
  const cup = mkCup(), Hh = cup.h / 100; g2.lineJoin = g2.lineCap = 'round'; g2.strokeStyle = MK.drawn ? '#ffd23a' : '#ffd23aaa'; g2.lineWidth = MK.drawn ? 2.5 : 3; if (!MK.drawn) g2.setLineDash([4, 7]);
  g2.beginPath(); for (let i = 0; i < MKN; i++) { const x = L.axisX + cup.r[i] / 1000 / L.k, y = L.y0 - (i / (MKN - 1)) * Hh / L.k; i ? g2.lineTo(x, y) : g2.moveTo(x, y); } g2.stroke(); g2.setLineDash([]);
  if (!MK.drawn) { g2.fillStyle = '#ffd23a'; g2.textAlign = 'left'; g2.font = '900 13px ' + FF; g2.fillText('↑ ' + t('mkTrace'), L.axisX + 12, L.y0 - 8); }
  if (mkStroke && mkStroke.length > 1) { g2.strokeStyle = '#fff'; g2.lineWidth = 4; g2.beginPath(); mkStroke.forEach((p, i) => i ? g2.lineTo(p[0], p[1]) : g2.moveTo(p[0], p[1])); g2.stroke(); }
}
const mkc = $('mkDraw');
mkc.addEventListener('pointerdown', e => {
  if (mode !== 'maker') return; const b = mkc.getBoundingClientRect(); const p = [e.clientX - b.left, e.clientY - b.top]; mkStroke = [p]; mkSnap = { base: MK.base.slice(), h: MK.h };
  const yw = (mkL.y0 - p[1]) * mkL.k; mkPart = MK.drawn && yw > MK.h * .12; // 底より上から描きはじめたら「一部だけなぞり直し」
  try { mkc.setPointerCapture(e.pointerId); } catch (_) { } e.preventDefault();
});
mkc.addEventListener('pointermove', e => { if (!mkStroke) return; const b = mkc.getBoundingClientRect(); const p = [e.clientX - b.left, e.clientY - b.top]; const q = mkStroke[mkStroke.length - 1]; if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 2) return; mkStroke.push(p); mkFromStroke(false); mkDraw(); });
const mkEnd = () => { if (!mkStroke) return; mkFromStroke(true); mkStroke = null; mkSnap = null; mkDraw(); }; mkc.addEventListener('pointerup', mkEnd); mkc.addEventListener('pointercancel', mkEnd);
// なぞった線の、高さ yy のところの半径（下へもどった線は、いちばん外側をとる）
function strokeR(s, yy, bin) { let mx = -1; for (const p of s) if (Math.abs(p[1] - yy) <= bin * .5) mx = Math.max(mx, p[0]); if (mx >= 0) return mx; let lo = s[0], hi = s[s.length - 1]; for (const p of s) { if (p[1] <= yy) lo = p; if (p[1] >= yy) { hi = p; break; } } const d = hi[1] - lo[1]; return d > 1e-6 ? lo[0] + (hi[0] - lo[0]) * (yy - lo[1]) / d : lo[0]; }
function mkFromStroke(final) {
  const L = mkL; const pts = mkStroke.map(p => [clamp((p[0] - L.axisX) * L.k, .045, L.maxR), (L.y0 - p[1]) * L.k]).filter(p => p[1] > -.05); if (pts.length < 2) return;
  let ya = Infinity, yb = -Infinity; for (const p of pts) { ya = Math.min(ya, p[1]); yb = Math.max(yb, p[1]); } ya = Math.max(0, ya); const s = pts.slice().sort((a, b) => a[1] - b[1]);
  if (mkPart) { // 一部だけ：なぞった高さのところだけ、形を入れかえる
    const Hh = mkSnap.h, bin = Hh / (MKN - 1); MK.base = mkSnap.base.slice(); for (let i = 0; i < MKN; i++) { const yy = i / (MKN - 1) * Hh; if (yy < ya - bin * .5 || yy > yb + bin * .5) continue; MK.base[i] = clamp(strokeR(s, clamp(yy, ya, yb), bin) / mkMod(i), .02, 2); }
  } else { // 全部：なぞった線がそのままグラスになる（つまみは元にもどす）
    const Hh = yb - ya; if (Hh < .12) return; MK.rim = MK.wid = MK.bot = 100; const bin = Hh / (MKN - 1); const base = []; for (let i = 0; i < MKN; i++)base.push(clamp(strokeR(s, ya + Hh * i / (MKN - 1), bin), .045, 1)); MK.base = base; MK.h = clamp(Hh, .3, 1.85); MK.drawn = true; if (final) mkUI();
  }
  const now = performance.now(); if (final || now - mkLast > 60) { mkLast = now; mkRebuild(); }
}
$('mkBtn').onclick = openMaker;
$('mkBack').onclick = () => { shk.visible = true; showTitle(); };
$('mkClear').onclick = () => { const c = MK.c; MK = defCup(); MK.c = c; $('mkMsg').textContent = ''; mkUI(); mkRebuild(); };
let MADE = null;
$('mkSave').onclick = async () => {
  if (!MK.drawn) { $('mkMsg').textContent = t('mkNeed'); return; } const nm = ($('mkName').value.trim() || t('defName')).slice(0, 12); if (badName(nm)) { $('mkMsg').textContent = t('badname'); return; }
  $('mkSave').disabled = true; $('mkMsg').textContent = t('sending');
  const c = { ...mkCup(), n: nm };
  try { const code = await saveCup(c); MADE = { code, c }; shk.visible = true; show('madePanel'); mode = 'made'; camera = CAM; WORLD.position.y = -CUR.yb; counter.position.y = 0; pool.position.y = .003; blob.position.y = .004; frame('title'); camSnap = true; $('mdName').textContent = '「' + nm + '」'; $('mdCode').textContent = code; $('mkMsg').textContent = ''; try { if (typeof gtag === 'function') gtag('event', 'cup_made', { game: GAME }); } catch (e) { } }
  catch (e) { console.warn(e); $('mkMsg').textContent = t('mkErr'); } $('mkSave').disabled = false;
};
$('mdPlay').onclick = () => { if (MADE) { MK = null; $('mkName').value = ''; startCustom(MADE.code, MADE.c); } };
$('mdX').onclick = () => { if (MADE) openXWith(t('postMake', { name: MADE.c.n, code: MADE.code }) + '\n' + t('tags'), GAME_URL + '?c=' + MADE.code); };
$('mdCopy').onclick = async () => { try { await navigator.clipboard.writeText(MADE.code); $('mdCopy').textContent = t('copied'); setTimeout(() => { $('mdCopy').textContent = t('mdCopy'); }, 1500); } catch (e) { } };
$('mdTop').onclick = () => { MK = null; $('mkName').value = ''; showTitle(); };

// ===== まわす =====
let last = performance.now();
function frameStep(dt) {
  TIME += dt;
  for (const s of bokeh) s.material.opacity = s.userData.o * (.75 + .25 * Math.sin(TIME * s.userData.w + s.userData.p));
  if (mode === 'play' || mode === 'replay') { if (P) playStep(dt); }
  if (VIEW.homing) { const k = Math.min(1, dt * 8); VIEW.yaw -= VIEW.yaw * k; VIEW.pitch -= VIEW.pitch * k; if (Math.abs(VIEW.yaw) < .003 && Math.abs(VIEW.pitch) < .003) { VIEW.yaw = VIEW.pitch = 0; VIEW.homing = false; } if (mode === 'play') { frame('play'); camSnap = true; } }
  if (CUR) { if (mode === 'title' || mode === 'made') CUR.grp.rotation.y += dt * .25; else if (mode === 'maker') CUR.grp.rotation.y += dt * 2.2; else CUR.grp.rotation.y = (mode === 'play' || mode === 'result') ? VIEW.yaw : 0; lineGrp.rotation.y = (mode === 'play' || mode === 'result') ? VIEW.yaw : 0; }
  { const vOn = mode === 'play' && !!P && !wantEnd && !P.spilled; if ($('viewBtn').hidden === vOn) $('viewBtn').hidden = !vOn; const hOn = vOn && (Math.abs(VIEW.yaw) > .01 || Math.abs(VIEW.pitch) > .01); if ($('homeBtn').hidden === hOn) $('homeBtn').hidden = !hOn;
    if (mode === 'play' && P) shk.visible = !(VIEW.on && P.tilt <= 0); const vp = mode === 'play' ? VIEW.pitch : 0; picPivot.rotation.x = -vp * .9; pool.material.opacity = .34 * (1 - .75 * clamp(vp / PMAX, 0, 1)); }
  dropStep(dt); fxStep(dt);
  const cam = mode === 'maker' ? OCAM : CAM; camera = cam; if (cam === CAM) camStep(dt);
  const sh = FX.shake; cv.style.transform = sh > .01 ? 'translate(' + ((Math.random() - .5) * 12 * sh) + 'px,' + ((Math.random() - .5) * 12 * sh) + 'px)' : '';
  R.render(SC, cam);
  fxg.clearRect(0, 0, fxW, fxH); if (mode === 'result' && !$('result').hidden || (mode === 'replay' && replay && replay.done)) drawLabels(fxg, fxW, fxH, 1, CAM); drawFX(fxg, fxW, fxH);
}
function loop(now) {
  requestAnimationFrame(loop); const dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = now; if (mode === 'video') return; if (PV && PV.manual) return;
  frameStep(dt);
}

// ===== はじめ =====
applyLang();
if (OGP) {
  document.body.style.width = '1200px'; document.body.style.height = '630px'; R.setPixelRatio(1); R.setSize(1200, 630, false); CAM.aspect = 1200 / 630; CAM.updateProjectionMatrix(); if (!QS.get('lang')) lang = 'ja';
  const g = GL.glassNo(1); useGlass(g, { kind: 'n', no: 1, diff: 'e' }); const Pp = makePour(); for (let i = 0; i < 300; i++)Pp.step(i < 235, false); TIME = 1.3; visual(Pp, 0);
  const yt = -CUR.yb + g.H + 1.1; CAM.position.set(-1.25, yt * .56, 6.4); CAM.lookAt(-1.25, yt * .5, 0); R.render(SC, CAM);
  const T = $('ogpT'); T.hidden = false; T.innerHTML = '<b>' + esc(t('hud')) + '</b><i>' + esc(t('ogp2')) + '</i><u>' + esc(t('ogp3')) + '</u>'; window.__ready = 1;
} else if (ICON) {
  R.setPixelRatio(1); R.setSize(512, 512, false); CAM.aspect = 1; CAM.updateProjectionMatrix(); const g = GL.glassNo(1); useGlass(g, { kind: 'n', no: 1, diff: 'e' }); setLiquid(CUR, g.h50, 0, 0); shk.visible = false; const yt = -CUR.yb + g.H; CAM.position.set(0, yt * .62, 5.2); CAM.lookAt(0, yt * .52, 0); R.render(SC, CAM); window.__ready = 1;
} else {
  resize(); if (MILK) setMilk(true); showTitle(); requestAnimationFrame(loop);
  const qc = QS.get('c'), qg = +QS.get('g');
  if (qc) { goCode(qc, true).then(ok => { if (!ok) { show('codePanel'); $('codeIn').value = qc; } }); }
  else if (qg >= 1 && qg <= 1000) { /* 共有されたグラスは、押してから始める（音を鳴らすため） */ const g = GL.glassNo(Math.floor(qg)); useGlass(g, { kind: 'n', no: Math.floor(qg), diff: GL.DIFF_OF(Math.floor(qg)) }); setLiquid(CUR, g.h50, 0, 0); const b = document.createElement('button'); b.className = 'huge'; b.textContent = t('gno', { n: no4(Math.floor(qg)) }) + ' ' + t('challenge'); b.onclick = () => { ac(); startNo(qg); }; $('tHow').after(b); }
}
window.__FF = { GL, get VIEW() { return VIEW }, view(v) { VIEW.on = !!v; viewUI(); }, setView(y, p) { VIEW.yaw = y; VIEW.pitch = p; frame('play'); camSnap = true; }, setMilk, get MILK() { return MILK }, tick: frameStep, frame, snap() { camSnap = true; }, get RUN() { return RUNST }, get RK() { return RK }, get MADE() { return MADE }, loadBoard, get mode() { return mode }, get P() { return P }, get FIN() { return FIN }, get CUR() { return CUR }, startNo, startDiff, startCustom, showTitle, openRank, openMaker, makeImage, makeVideo, press(v) { pressed = v; }, decide() { $('decide').click(); }, get MK() { return MK }, setMK(o) { Object.assign(MK, o); mkUI(); mkRebuild(); }, adv(n, pr) { for (let i = 0; i < n; i++) { P.step(pr, wantEnd); } visual(P, 0); if (P.emitted > 0) { $('hint').style.opacity = 0; $('decide').disabled = false; hintOff = true; } }, setTime(v) { TIME = v; }, finishNow(frac) { /* 確認用：決めた量を注いだことにする */ const Pp = P; let n = 0; while (Pp.emitted < frac && n < 100000) { Pp.step(true, false); n++; } wantEnd = true; } };
