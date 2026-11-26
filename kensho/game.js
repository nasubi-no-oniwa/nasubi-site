// 懸賞🍆：名前で懸賞金が決まる手配書（写真は見た目だけ。金額・異名は名前だけで決まる）
import { CHARS } from './data.js';
import { T as TT, LANGS, EPI_LOW, EPI_MID, EPI_HIGH, EPI_PET } from './words.js';
const $ = id => document.getElementById(id);
const gsap = window.gsap, PFX = window.PFX;
const DEV = /[?&]dev=1/.test(location.search);
const IS_PHONE = /iPhone|iPod|Android|Mobile|Windows Phone/i.test(navigator.userAgent || '');
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => o[k] != null ? o[k] : m);
const ev = (n, o) => { try { if (typeof gtag === 'function') gtag('event', n, Object.assign({ game: 'kensho' }, o || {})); } catch (e) { } };

// ---------- 言語 ----------
let L = ls.get('kensho_lang', null);
if (!LANGS.includes(L)) { const n = (navigator.language || 'ja').toLowerCase(); L = n.startsWith('ja') ? 'ja' : n.startsWith('zh') ? 'zh' : n.startsWith('ko') ? 'ko' : 'en'; }
let T = TT[L]; const LI = () => LANGS.indexOf(L);

// ---------- 名前 → 懸賞金 ----------
const toHira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const norm = s => toHira(String(s).normalize('NFKC').replace(/[\s　・･.\-_'’"“”]/g, '').toLowerCase());
const clean = s => String(s || '').normalize('NFC').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16);
function hash(s, seed) { let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed; for (const ch of s) { const c = ch.codePointAt(0); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); } h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909); h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909); return ((h2 >>> 0) * 4294967296 + (h1 >>> 0)) / 18446744073709551616; }
function rng(seed) { let a = seed >>> 0 || 1; return () => { a = a + 0x6D2B79F5 >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const MAP = new Map();
for (const c of CHARS) for (const a of [...c.a, ...(c.en || [])]) { const k = norm(a); if (k && !MAP.has(k)) MAP.set(k, c); }
const PUB = CHARS.filter(c => c.b != null).slice().sort((a, b) => a.b - b.b);
// 普通の名前の懸賞金の出方：ほとんどは1000万〜5億。10億以上は約1.5%、30億以上は約0.5%。まれに1000🍆（ペット扱い）
const TIERS = [[0.005, 3e9, 5e9], [0.01, 1e9, 3e9], [0.08, 5e8, 1e9], [0.30, 1e8, 5e8], [0.50, 1e7, 1e8], [1, 1e5, 1e7]];
function judge(raw) {
  const name = clean(raw), k = norm(name), c = MAP.get(k);
  if (c) return { name, k, ch: c, b: c.b, unknown: c.b == null, pet: c.b === 1000 };
  const u = hash(k, 11), v = hash(k, 23), w = hash(k, 37);
  let b, pet = false;
  if (u < 0.004) { b = 1000; pet = true; }
  else { const p = (u - 0.004) / 0.996; let acc = 0; for (const [q, lo, hi] of TIERS) { acc += q; if (p < acc || q === 1) { b = Math.exp(Math.log(lo) + (Math.log(hi) - Math.log(lo)) * v); break; } } const st = b >= 1e8 ? 1e6 : 1e5; b = Math.min(5e9, Math.max(st, Math.round(b / st) * st)); }
  const box = pet ? null : b >= 1e9 ? EPI_HIGH : b >= 1e8 ? EPI_MID : EPI_LOW;
  return { name, k, ch: null, b, pet, epi: pet ? EPI_PET : box[Math.floor(w * box.length)] };
}
// 手配書に大きく出す名前（異名つき）
function bigName(R) {
  if (R.ch) {
    const c = R.ch, en = L !== 'ja' && c.en, short = en ? c.en[c.en.length - 1] : c.a[c.a.length - 1], full = en ? c.en[0] : c.a[0];
    const e = L === 'ja' || L === 'zh' ? c.e : (c.ee || '');
    if (!e) return full;
    if (L === 'en') return /^(of|the)\b/.test(e) ? short + ' ' + e : '"' + e + '" ' + short;
    if (L === 'ja') return e + 'の' + short;
    return L === 'zh' ? '「' + e + '」' + short : "'" + e + "' " + short;
  }
  const e = R.epi[LI()], n = R.name;
  return L === 'ja' ? '「' + e + '」' + n : L === 'en' ? (/^the\b/.test(e) ? n + ' ' + e : '"' + e + '" ' + n) : L === 'zh' ? '「' + e + '」' + n : "'" + e + "' " + n;
}
const digits = b => Math.round(b).toLocaleString('en-US');
function amtWord(b) {
  if (b == null) return T.unknown;
  if (L === 'en') return digits(b);
  const oku = Math.floor(b / 1e8), man = Math.floor(b % 1e8 / 1e4), rest = Math.round(b % 1e4), U = L === 'zh' ? ['亿', '万'] : L === 'ko' ? ['억', '만'] : ['億', '万'], sp = L === 'ko' ? ' ' : '';
  let s = ''; if (oku) s += oku + U[0]; if (man) s += (s ? sp : '') + man + U[1]; if (rest || !s) s += (s ? sp : '') + rest; return s;
}
const cname = c => (L !== 'ja' && c.en ? c.en[c.en.length - 1] : c.a[c.a.length - 1]);
function compare(R) {
  if (R.b == null) return '';
  const P = L === 'ja' ? PUB : PUB.filter(c => c.en), same = P.filter(c => c.b === R.b && c !== R.ch), up = P.filter(c => c.b < R.b).pop(), dn = P.find(c => c.b > R.b), op = L === 'en' || L === 'ko' ? [' (', ')'] : ['（', '）'];
  const tag = c => '<em>' + esc(cname(c)) + '</em>' + op[0] + esc(amtWord(c.b)) + '🍆' + op[1];
  const out = [];
  if (same.length) out.push(fill(T.cmpSame, { a: same.slice(0, 3).map(c => '<em>' + esc(cname(c)) + '</em>').join(T.sep) }));
  if (up) out.push(fill(T.cmpUp, { a: tag(up) })); else if (!same.length) out.push(esc(T.cmpBottom));
  if (dn) out.push(fill(T.cmpDown, { a: tag(dn) })); else if (!same.length && R.b > P[P.length - 1].b) out.push(esc(T.cmpTop));
  return out.join(T.sep);
}
function tierOf(R) { if (R.unknown) return 'gold'; if (R.pet || R.b < 1e7) return 'thin'; if (R.b >= 3e9) return 'black'; if (R.b >= 1e9) return 'gold'; return 'normal'; }

// ---------- 手配書の絵 ----------
const PW = 800, PH = 1130, FR = { x: 80, y: 205, w: 640, h: 520 };
const SERIF = { ja: '"Hiragino Mincho ProN","Yu Mincho","YuMincho","Noto Serif JP","Noto Serif CJK JP",serif', zh: '"Songti SC","STSong","Noto Serif SC","Noto Serif CJK SC","SimSun",serif', ko: '"AppleMyungjo","Nanum Myeongjo","Noto Serif KR","Noto Serif CJK KR","Batang",serif', en: '"Georgia","Times New Roman","Noto Serif",serif' };
const NUMF = '"Georgia","Times New Roman","Hiragino Mincho ProN",serif';
function fitText(x, s, max, size, weight, fam) { let f = size; do { x.font = weight + ' ' + f + 'px ' + fam; if (x.measureText(s).width <= max) break; f -= 2; } while (f > 12); return f; }
function spaced(x, s, cx, y, gap) { const ch = [...s], ws = ch.map(c => x.measureText(c).width), tot = ws.reduce((a, b) => a + b, 0) + gap * (ch.length - 1); let px = cx - tot / 2; x.textAlign = 'left'; ch.forEach((c, i) => { x.fillText(c, px, y); px += ws[i] + gap; }); x.textAlign = 'center'; }
function nasu(x, cx, cy, s) { // なすの絵（🍆の代わり。どの端末でも同じ見た目にする）
  x.save(); x.translate(cx, cy); x.rotate(-0.35); const g = x.createLinearGradient(-s * .4, 0, s * .4, 0); g.addColorStop(0, '#7b3fb0'); g.addColorStop(.5, '#5b2a86'); g.addColorStop(1, '#2d1047');
  x.fillStyle = g; x.beginPath(); x.ellipse(0, s * .12, s * .3, s * .42, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = '#ffffff38'; x.beginPath(); x.ellipse(-s * .12, s * .02, s * .06, s * .2, -.2, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#3f7a2a'; x.beginPath(); x.moveTo(-s * .28, -s * .2); x.lineTo(0, -s * .34); x.lineTo(s * .28, -s * .2); x.lineTo(s * .12, -s * .16); x.lineTo(0, -s * .24); x.lineTo(-s * .12, -s * .16); x.closePath(); x.fill(); x.fillRect(-s * .04, -s * .5, s * .08, s * .2); x.restore();
}
function paper(x, R, tier) {
  const r = rng(Math.floor(hash(R.k || 'x', 99) * 4e9)), black = tier === 'black', thin = tier === 'thin';
  x.fillStyle = black ? '#1d1712' : thin ? '#efe5c8' : '#e7d3a2'; x.fillRect(0, 0, PW, PH);
  const im = x.getImageData(0, 0, PW, PH), d = im.data, amp = black ? 16 : thin ? 18 : 26; for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * amp; d[i] += n; d[i + 1] += n; d[i + 2] += n * .8; } x.putImageData(im, 0, 0);
  for (let i = 0; i < 8; i++) { const cx = r() * PW, cy = r() * PH, rad = 50 + r() * 170, g = x.createRadialGradient(cx, cy, 0, cx, cy, rad); g.addColorStop(0, black ? '#00000044' : 'rgba(120,78,30,.14)'); g.addColorStop(1, 'rgba(120,78,30,0)'); x.fillStyle = g; x.fillRect(cx - rad, cy - rad, rad * 2, rad * 2); }
  if (thin) { x.strokeStyle = '#8a6a4022'; x.lineWidth = 2; for (let i = 0; i < 9; i++) { x.beginPath(); let px = r() * PW, py = r() * PH; x.moveTo(px, py); for (let j = 0; j < 4; j++) { px += (r() - .5) * 300; py += (r() - .5) * 300; x.lineTo(px, py); } x.stroke(); } }
  const g = x.createRadialGradient(PW / 2, PH / 2, PH * .3, PW / 2, PH / 2, PH * .75); g.addColorStop(0, 'rgba(80,48,15,0)'); g.addColorStop(1, black ? 'rgba(0,0,0,.6)' : 'rgba(90,55,20,.5)'); x.fillStyle = g; x.fillRect(0, 0, PW, PH);
  if (tier === 'gold' || black) { const gg = x.createLinearGradient(0, 0, PW, PH); gg.addColorStop(0, '#f6dc7a'); gg.addColorStop(.5, '#b8872a'); gg.addColorStop(1, '#f0cf68'); x.strokeStyle = gg; x.lineWidth = 10; x.strokeRect(22, 22, PW - 44, PH - 44); x.lineWidth = 3; x.strokeRect(38, 38, PW - 76, PH - 76); x.fillStyle = gg; for (const [cx, cy] of [[38, 38], [PW - 38, 38], [38, PH - 38], [PW - 38, PH - 38]]) { x.beginPath(); x.arc(cx, cy, 12, 0, Math.PI * 2); x.fill(); } }
}
function sepia(c) { const x = c.getContext('2d'), im = x.getImageData(0, 0, c.width, c.height), d = im.data; for (let i = 0; i < d.length; i += 4) { const y = d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11, k = .78; d[i] = d[i] * (1 - k) + Math.min(255, y * 1.07 + 18) * k; d[i + 1] = d[i + 1] * (1 - k) + Math.min(255, y * .93 + 6) * k; d[i + 2] = d[i + 2] * (1 - k) + y * .72 * k; } x.putImageData(im, 0, 0); }
function drawPhoto(x, ph, fw, fh) { const im = ph.img, iw = im.width, ih = im.height, s = Math.max(fw / iw, fh / ih) * ph.s, w = iw * s, h = ih * s; x.drawImage(im, (fw - w) / 2 + ph.x * fw, (fh - h) / 2 + ph.y * fh, w, h); }
function face(x, R, ph, tier) {
  const c = document.createElement('canvas'); c.width = FR.w; c.height = FR.h; const fx = c.getContext('2d');
  if (ph && ph.img) { fx.fillStyle = '#2a1d10'; fx.fillRect(0, 0, FR.w, FR.h); drawPhoto(fx, ph, FR.w, FR.h); sepia(c); }
  else { // 写真なし：黒塗りで「正体不明」
    const g = fx.createLinearGradient(0, 0, 0, FR.h); g.addColorStop(0, '#1a120b'); g.addColorStop(1, '#0c0805'); fx.fillStyle = g; fx.fillRect(0, 0, FR.w, FR.h);
    fx.fillStyle = '#2b1e12'; fx.beginPath(); fx.arc(FR.w / 2, FR.h * .42, 118, 0, Math.PI * 2); fx.fill(); fx.beginPath(); fx.ellipse(FR.w / 2, FR.h * 1.02, 250, 210, 0, Math.PI, 0); fx.fill();
    fx.fillStyle = '#d9c08a'; fx.textAlign = 'center'; fx.textBaseline = 'middle'; const f = fitText(fx, T.faceless, FR.w - 80, 78, '900', SERIF[L]); fx.font = '900 ' + f + 'px ' + SERIF[L]; fx.fillText(T.faceless, FR.w / 2, FR.h * .44); fx.font = '900 64px ' + NUMF; fx.fillStyle = '#d9c08a99'; fx.fillText('?', FR.w / 2 - 190, FR.h * .2); fx.fillText('?', FR.w / 2 + 200, FR.h * .72);
  }
  const vg = fx.createRadialGradient(FR.w / 2, FR.h / 2, FR.h * .35, FR.w / 2, FR.h / 2, FR.w * .62); vg.addColorStop(0, '#0000'); vg.addColorStop(1, '#2a160888'); fx.fillStyle = vg; fx.fillRect(0, 0, FR.w, FR.h);
  x.save(); x.globalAlpha = tier === 'black' ? .9 : .94; x.drawImage(c, FR.x, FR.y); x.restore();
  x.lineWidth = 6; x.strokeStyle = tier === 'black' ? '#c9a24a' : '#2a1a0c'; x.strokeRect(FR.x, FR.y, FR.w, FR.h); x.lineWidth = 2; x.strokeRect(FR.x - 10, FR.y - 10, FR.w + 20, FR.h + 20);
}
// o.amount：金額を描くか（数字が回る演出の間は描かない）、o.stamp：はんこを描くか
function drawPoster(R, ph, o) {
  o = o || {}; const c = document.createElement('canvas'); c.width = PW; c.height = PH; const x = c.getContext('2d'), tier = tierOf(R), black = tier === 'black', ink = black ? '#e2c26a' : '#2a1a0c', fam = SERIF[L];
  paper(x, R, tier); x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillStyle = ink;
  let f = fitText(x, T.wanted, 640, L === 'en' ? 150 : 150, '900', fam); x.font = '900 ' + f + 'px ' + fam; spaced(x, T.wanted, PW / 2, 172, L === 'en' ? 6 : 18);
  if (o.no) { x.font = '700 24px ' + NUMF; x.textAlign = 'right'; x.fillText(T.no + String(o.no).padStart(6, '0'), PW - 62, 66); x.textAlign = 'center'; }
  face(x, R, ph, tier);
  x.fillStyle = ink; f = fitText(x, T.report, 640, 32, '800', fam); x.font = '800 ' + f + 'px ' + fam; spaced(x, T.report, PW / 2, 790, L === 'en' ? 2 : 6);
  const nm = bigName(R); f = fitText(x, nm, 680, 92, '900', fam); x.font = '900 ' + f + 'px ' + fam; x.fillText(nm, PW / 2, 895);
  if (o.amount !== false) drawAmount(x, R, ink);
  if (!(ph && ph.img) && !R.unknown) { x.fillStyle = black ? '#e2c26a' : '#a8231b'; f = fitText(x, T.noFace, 600, 26, '800', fam); x.font = '800 ' + f + 'px ' + fam; x.fillText(T.noFace, PW / 2, 1044); }
  x.fillStyle = ink; x.textAlign = 'left'; f = fitText(x, T.office, 420, 30, '900', fam); x.font = '900 ' + f + 'px ' + fam; x.fillText(T.office, 74, 1090);
  x.textAlign = 'center'; x.font = '600 17px ' + NUMF; x.fillStyle = black ? '#e2c26a99' : '#2a1a0c99'; x.fillText('nasubi-no-oniwa.com/kensho', PW / 2, 1112);
  if (o.stamp !== false) hanko(x);
  // 文字のかすれ
  const r = rng(Math.floor(hash(R.k || 'x', 7) * 4e9)); x.fillStyle = black ? '#1d171255' : '#e7d3a255'; for (let i = 0; i < 1400; i++) { const px = r() * PW, py = 60 + r() * 1060; if (py > FR.y - 12 && py < FR.y + FR.h + 12) continue; x.fillRect(px, py, 1 + r() * 2.5, 1 + r() * 2.5); }
  return c;
}
function drawAmount(x, R, ink) {
  const s = R.b == null ? '?,???,???,???' : digits(R.b), txt = s + '-', fam = NUMF; let f = fitText(x, txt, 560, 92, '900', fam); x.font = '900 ' + f + 'px ' + fam;
  const w = x.measureText(txt).width, ic = f * 1.05, tot = w + ic + 10, sx = PW / 2 - tot / 2; nasu(x, sx + ic / 2, 1000 - f * .36, ic); x.fillStyle = ink; x.textAlign = 'left'; x.fillText(txt, sx + ic + 10, 1000); x.textAlign = 'center';
}
function hanko(x) { x.save(); x.translate(682, 1046); x.rotate(-.24); x.strokeStyle = '#b3241acc'; x.fillStyle = '#b3241acc'; x.lineWidth = 6; x.beginPath(); x.arc(0, 0, 50, 0, Math.PI * 2); x.stroke(); x.lineWidth = 2; x.beginPath(); x.arc(0, 0, 42, 0, Math.PI * 2); x.stroke(); x.font = '900 52px ' + SERIF.ja; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('茄', 0, 3); x.restore(); }

// ---------- 音 ----------
let SND = ls.get('kensho_snd', true), AC = null;
function ac() { if (!SND) return null; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { } return AC; }
function sfx(t) {
  const a = ac(); if (!a) return; const now = a.currentTime, g = a.createGain(); g.connect(a.destination);
  if (t === 'tick') { const o = a.createOscillator(); o.type = 'square'; o.frequency.value = 1800 + Math.random() * 400; g.gain.setValueAtTime(.04, now); g.gain.exponentialRampToValueAtTime(.0001, now + .03); o.connect(g); o.start(now); o.stop(now + .04); }
  else if (t === 'stamp') { const n = a.createBufferSource(), b = a.createBuffer(1, a.sampleRate * .25, a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3); n.buffer = b; const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600; n.connect(f); f.connect(g); g.gain.value = .9; n.start(now); const o = a.createOscillator(); o.frequency.setValueAtTime(140, now); o.frequency.exponentialRampToValueAtTime(50, now + .2); const g2 = a.createGain(); g2.gain.setValueAtTime(.5, now); g2.gain.exponentialRampToValueAtTime(.001, now + .25); o.connect(g2); g2.connect(a.destination); o.start(now); o.stop(now + .3); }
  else if (t === 'big') { [523, 659, 784, 1047].forEach((fq, i) => { const o = a.createOscillator(), gg = a.createGain(); o.type = 'triangle'; o.frequency.value = fq; gg.gain.setValueAtTime(0, now + i * .09); gg.gain.linearRampToValueAtTime(.12, now + i * .09 + .02); gg.gain.exponentialRampToValueAtTime(.001, now + i * .09 + .6); o.connect(gg); gg.connect(a.destination); o.start(now + i * .09); o.stop(now + i * .09 + .7); }); }
  else if (t === 'sad') { const o = a.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(330, now); o.frequency.linearRampToValueAtTime(180, now + .6); g.gain.setValueAtTime(.12, now); g.gain.exponentialRampToValueAtTime(.001, now + .7); o.connect(g); o.start(now); o.stop(now + .75); }
}
$('snd').onclick = () => { SND = !SND; ls.set('kensho_snd', SND); $('snd').textContent = SND ? T.sndOn : T.sndOff; if (SND) sfx('tick'); };

// ---------- 演出（pixelfx） ----------
const fctx = $('fxc').getContext('2d'); let FXS = [], fxRaf = 0, fxLast = 0, fxFrame = null, fxImg = null;
function fxAdd(mod, o, life) { try { if (!PFX || !mod) return; if (!fxFrame) { fxFrame = PFX.createFrame(160, 160); fxImg = new ImageData(160, 160); } const f = PFX.createFx(mod, o); f._life = life || 1.6; FXS.push(f); if (!fxRaf) { fxLast = performance.now(); fxRaf = requestAnimationFrame(fxLoop); } } catch (e) { } }
function fxLoop(now) { const dt = Math.min(.05, (now - fxLast) / 1000); fxLast = now; try { PFX.clearFrame(fxFrame); FXS = FXS.filter(f => { f.update(dt); f.draw(fxFrame, 'back'); f.draw(fxFrame, 'front'); f._life -= dt; return !f.done() && f._life > 0; }); PFX.composite(fxFrame, fxImg.data, null); fctx.putImageData(fxImg, 0, 0); } catch (e) { FXS = []; } if (FXS.length) fxRaf = requestAnimationFrame(fxLoop); else { fxRaf = 0; fctx.clearRect(0, 0, 160, 160); } }
const GOLD = ['#3b1f0a', '#7a3b12', '#c8701e', '#f0b040', '#ffe08a', '#fff6d0'], PURP = ['#1c0b2c', '#3a1660', '#5b2a86', '#8d4fc4', '#c9a0ff', '#f3e6ff'];

// ---------- 写真 ----------
let PHOTO = null; // { img(canvas), s, x, y }
const ED = { img: null, s: 1, x: 0, y: 0 };
function loadFile(file) {
  return new Promise((res, rej) => { const u = URL.createObjectURL(file), im = new Image(); im.onload = () => { const m = 1400, k = Math.min(1, m / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas'); c.width = Math.max(1, Math.round(im.naturalWidth * k)); c.height = Math.max(1, Math.round(im.naturalHeight * k)); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); res(c); }; im.onerror = () => { URL.revokeObjectURL(u); rej(new Error('img')); }; im.src = u; });
}
$('phBox').onclick = () => { if (PHOTO) { Object.assign(ED, PHOTO); openEdit(); } else $('phFile').click(); };
$('phFile').onchange = async e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (!f) return; try { const c = await loadFile(f); Object.assign(ED, { img: c, s: 1, x: 0, y: 0 }); openEdit(); } catch (er) { $('tErr').textContent = T.imgErr; } };
function show(id) { for (const s of ['title', 'edit', 'result', 'rank']) $(s).hidden = s !== id; window.scrollTo(0, 0); }
function openEdit() { show('edit'); $('zoom').value = ED.s; drawEd(); }
const edc = $('edC').getContext('2d');
function drawEd() { edc.fillStyle = '#2a1d10'; edc.fillRect(0, 0, 640, 520); if (ED.img) drawPhoto(edc, ED, 640, 520); edc.strokeStyle = '#ffffff55'; edc.lineWidth = 2; edc.beginPath(); edc.ellipse(320, 230, 150, 190, 0, 0, Math.PI * 2); edc.stroke(); }
{
  const w = $('edWrap'), P = new Map(); let pin = null; const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), cl = v => Math.max(1, Math.min(5, v));
  w.addEventListener('pointerdown', e => { try { w.setPointerCapture(e.pointerId); } catch (er) { } P.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (P.size === 2) { const [a, b] = [...P.values()]; pin = { d: dist(a, b) || 1, s: ED.s }; } });
  w.addEventListener('pointermove', e => { if (!P.has(e.pointerId)) return; const pv = P.get(e.pointerId), cu = { x: e.clientX, y: e.clientY }; P.set(e.pointerId, cu); const r = w.getBoundingClientRect();
    if (P.size === 1) { ED.x += (cu.x - pv.x) / r.width; ED.y += (cu.y - pv.y) / r.height; } else if (P.size === 2 && pin) { const [a, b] = [...P.values()]; ED.s = cl(pin.s * dist(a, b) / pin.d); $('zoom').value = ED.s; } ED.x = Math.max(-1.5, Math.min(1.5, ED.x)); ED.y = Math.max(-1.5, Math.min(1.5, ED.y)); drawEd(); });
  const up = e => { P.delete(e.pointerId); if (P.size < 2) pin = null; }; w.addEventListener('pointerup', up); w.addEventListener('pointercancel', up);
  w.addEventListener('wheel', e => { e.preventDefault(); ED.s = cl(ED.s * (e.deltaY < 0 ? 1.08 : 1 / 1.08)); $('zoom').value = ED.s; drawEd(); }, { passive: false });
  $('zoom').oninput = () => { ED.s = +$('zoom').value; drawEd(); };
}
$('edOk').onclick = () => { PHOTO = ED.img ? { img: ED.img, s: ED.s, x: ED.x, y: ED.y } : null; drawThumb(); show('title'); ev('photo_set'); };
$('edRe').onclick = () => $('phFile').click();
$('edDel').onclick = () => { PHOTO = null; ED.img = null; drawThumb(); show('title'); };
function drawThumb() { const c = $('phThumb'), x = c.getContext('2d'); x.fillStyle = '#3a2a18'; x.fillRect(0, 0, c.width, c.height); if (PHOTO) drawPhoto(x, PHOTO, c.width, c.height); else { x.fillStyle = '#d9c08a88'; x.font = '900 40px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('?', c.width / 2, c.height / 2); } $('phTxt').innerHTML = esc(PHOTO ? T.phSet : T.phPick) + '<small>' + esc(PHOTO ? T.phSetSub : T.phSub) + '</small>'; }

// ---------- 発行番号（何人目のお尋ね者か） ----------
const FB = { key: 'AIzaSyAcJgJLVbuvx85_qEGJe1WhwsOelidxeYk', db: 'https://otokonoji-default-rtdb.asia-southeast1.firebasedatabase.app' };
async function fx(url, opt) { let err; for (let i = 0; i < 3; i++) { try { return await fetch(url, opt); } catch (e) { err = e; await new Promise(r => setTimeout(r, 400 * (i + 1))); } } throw err; }
let AUTH = null;
async function auth() {
  let a = AUTH || ls.get('kensho_auth', null); if (a && a.exp > Date.now() + 60000) return AUTH = a;
  if (a && a.refresh) { try { const r = await fx('https://securetoken.googleapis.com/v1/token?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(a.refresh) }); if (r.ok) { const j = await r.json(); a = { uid: j.user_id, token: j.id_token, refresh: j.refresh_token, exp: Date.now() + (+j.expires_in) * 1000 }; ls.set('kensho_auth', a); return AUTH = a; } } catch (e) { } }
  const r = await fx('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
  if (!r.ok) throw new Error('auth'); const j = await r.json(); a = { uid: j.localId, token: j.idToken, refresh: j.refreshToken, exp: Date.now() + (+j.expiresIn) * 1000 }; ls.set('kensho_auth', a); return AUTH = a;
}
const DBU = p => FB.db + '/kensho/' + p + '.json';
async function issueNo(R) { // 同じ端末で同じ名前なら、前と同じ番号（何度発行しても数は増えない）
  const m = ls.get('kensho_no', {}); if (m[R.k]) return m[R.k]; if (DEV) return 0;
  try { const a = await auth(), q = '?auth=' + encodeURIComponent(a.token); const r = await fx(DBU('c') + q, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ '.sv': { increment: 1 } }) }); if (!r.ok) return 0; let n = await r.json(); if (typeof n !== 'number') { const g = await fx(DBU('c')); n = await g.json(); } if (typeof n === 'number' && n > 0) { m[R.k] = n; ls.set('kensho_no', m); return n; } } catch (e) { }
  return 0;
}
// ---------- ランキング（名前1つにつき1件。作中のキャラは載せない） ----------
const dayKey = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10).replace(/-/g, '');
function hkey(s) { const a = Math.floor(hash(s, 0x51ed) * 4294967296), b = Math.floor(hash(s, 0x9e37) * 4294967296); return (a.toString(36) + b.toString(36)).padStart(10, '0').slice(0, 14); }
async function submit(R) {
  if (DEV || R.ch || R.b == null) return; const h = hkey('n:' + R.k), day = dayKey(), sent = ls.get('kensho_sent', {}); if (sent[day + h]) return;
  const rec = { n: R.name.slice(0, 16), b: R.b, i: R.epi[0].slice(0, 24), ts: { '.sv': 'timestamp' } };
  try { const a = await auth(), q = '?auth=' + encodeURIComponent(a.token), o = { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rec) }; if (!sent[h]) { await fx(DBU('n/' + h) + q, o); sent[h] = 1; } await fx(DBU('t/' + day + '/' + h) + q, o); for (const x of Object.keys(sent)) if (/^20\d{6}/.test(x) && !x.startsWith(day)) delete sent[x]; sent[day + h] = 1; ls.set('kensho_sent', sent); } catch (e) { }
}
let rkFrom = 'title', rkTab = 'all';
async function openRank(from) {
  rkFrom = from; show('rank');
  $('rkTabs').innerHTML = [['all', T.rkAll], ['today', T.rkToday]].map(t => `<button data-t="${t[0]}" class="${t[0] === rkTab ? 'on' : ''}">${esc(t[1])}</button>`).join('');
  document.querySelectorAll('#rkTabs button').forEach(b => b.onclick = () => { rkTab = b.dataset.t; openRank(rkFrom); });
  const box = $('rkBox'), tab = rkTab; box.innerHTML = '<p class="note">' + esc(T.loading) + '</p>';
  try {
    const r = await fx(DBU(tab === 'all' ? 'n' : 't/' + dayKey()) + '?orderBy=%22b%22&limitToLast=100'); if (!r.ok) throw 0; const j = (await r.json()) || {};
    const mine = new Set(TEAM.filter(t => !t.R.ch).map(t => hkey('n:' + t.R.k)));
    const rows = Object.entries(j).map(([u, v]) => Object.assign({ u }, v)).filter(v => v && typeof v.b === 'number').sort((a, b) => b.b - a.b).slice(0, 100);
    if ($('rank').hidden || tab !== rkTab) return; if (!rows.length) { box.innerHTML = '<p class="note">' + esc(T.rkEmpty) + '</p>'; return; }
    box.innerHTML = '<table class="rk">' + rows.map((v, i) => `<tr${mine.has(v.u) ? ' class="me"' : ''}><td class="n">${i + 1}</td><td>${esc(v.n || '')}${v.i && L === 'ja' ? '<small>「' + esc(v.i) + '」' + esc(v.n || '') + '</small>' : ''}</td><td class="b">${esc(amtWord(v.b))}🍆</td></tr>`).join('') + '</table>';
  } catch (e) { if (tab === rkTab) box.innerHTML = '<p class="note" style="color:#a8231b">' + esc(T.rkErr) + '</p>'; }
}
$('rkBtn').onclick = () => openRank('title'); $('rkBtn2').onclick = () => openRank('result');
$('rkBack').onclick = () => { if (rkFrom === 'result' && TEAM.length) show('result'); else show('title'); };

// ---------- 発行 ----------
let TEAM = [], MODE = 'main'; // TEAM：[{ R, ph, no, cv }]（最大5人）
const MAXT = 5;
const crewName = () => fill(T.crewFmt, { n: clean($('crew').value) || (TEAM[0] ? TEAM[0].R.name : '') });
$('crew').addEventListener('input', () => { ls.set('kensho_crew', $('crew').value); info(); });
$('crew').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('crew').blur(); } });
function start() {
  const nm = clean($('nm').value); if (!nm) { $('tErr').textContent = T.needName; return; }
  const R = judge(nm); if (MODE === 'friend' && TEAM.some(t => t.R.k === R.k)) { $('tErr').textContent = T.same; return; }
  $('tErr').textContent = ''; ac(); if (MODE === 'main') { TEAM = []; ls.set('kensho_name', nm); }
  const ent = { R, ph: PHOTO, no: 0 }; TEAM.push(ent); PHOTO = null; drawThumb();
  ev('issue', { mode: MODE, char: R.ch ? 1 : 0, photo: ent.ph ? 1 : 0, team: TEAM.length });
  const noP = issueNo(R).then(n => ent.no = n); submit(R);
  renderResult(true, noP);
}
$('startBtn').onclick = start; $('nm').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('nm').blur(); start(); } });
function renderResult(anim, noP) {
  show('result'); const box = $('posters'), n = TEAM.length; box.innerHTML = ''; box.style.flexWrap = n > 2 ? 'wrap' : 'nowrap';
  TEAM.forEach((t, i) => { const last = anim && i === n - 1, d = document.createElement('div'); d.className = 'pw'; d.style.flex = n === 1 ? '1' : n === 2 ? '0 0 calc(50% - 5px)' : '0 0 calc(33.3% - 7px)'; const cv = drawPoster(t.R, t.ph, { amount: !last, stamp: !last, no: t.no }); t.cv = cv; d.appendChild(cv); box.appendChild(d); if (last) d.id = 'pwLast'; });
  info(anim);
  if (!anim) return;
  const t = TEAM[n - 1], d = $('pwLast'), R = t.R;
  $('posters').querySelectorAll('.pw').forEach(e => e.style.opacity = e.id === 'pwLast' ? 1 : .55);
  gsap.fromTo(d, { y: -40, rotation: -6, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: .5, ease: 'back.out(1.6)' });
  const roll = document.createElement('div'); roll.className = 'roll'; roll.style.fontFamily = NUMF; if (tierOf(R) === 'black') roll.style.color = '#e2c26a'; roll.innerHTML = '<i></i><span>0-</span>'; d.appendChild(roll);
  const fit = () => { roll.style.fontSize = Math.max(10, d.clientWidth * .1) + 'px'; }; fit();
  const sp = roll.querySelector('span'), o = { v: 0 }, target = R.b == null ? 0 : R.b, dur = R.b == null ? 1.2 : R.b >= 1e9 ? 2.4 : 1.7; let lt = 0;
  gsap.to(o, { v: 1, duration: dur, delay: .45, ease: 'power2.out', onUpdate() { const p = o.v; sp.textContent = R.b == null ? '?'.repeat(1 + Math.floor(Math.random() * 10)) + '-' : digits(Math.round(target * p * p / 1e5) * 1e5) + '-'; const now = performance.now(); if (now - lt > 55) { lt = now; sfx('tick'); } }, onComplete: async () => {
    sp.textContent = R.b == null ? '?,???,???,???-' : digits(target) + '-';
    try { await Promise.race([noP, new Promise(r => setTimeout(r, 1500))]); } catch (e) { }
    const hk = document.createElement('div'); hk.className = 'hanko'; hk.style.fontFamily = SERIF.ja; hk.style.fontSize = d.clientWidth * .075 + 'px'; hk.textContent = '茄'; d.appendChild(hk);
    gsap.fromTo(hk, { opacity: 0, scale: 3 }, { opacity: 1, scale: 1, duration: .26, ease: 'power4.in', onComplete() {
      sfx('stamp'); gsap.fromTo(d, { x: -6 }, { x: 0, duration: .35, ease: 'elastic.out(1,.3)' });
      const big = R.b != null && R.b >= 1e9, sad = R.pet || (R.b != null && R.b < 1e7);
      fxAdd(PFX && PFX.fx.burst, { x: 80, y: 80, seed: 5, palette: big ? GOLD : PURP }, 1.4); if (big) { sfx('big'); fxAdd(PFX && PFX.fx.confetti, { x: 80, y: 40, seed: 11 }, 3); } else if (sad) sfx('sad');
      const cv = drawPoster(R, t.ph, { no: t.no }); t.cv = cv; d.replaceChild(cv, d.querySelector('canvas')); roll.remove(); hk.remove();
      $('posters').querySelectorAll('.pw').forEach(e => e.style.opacity = 1);
      gsap.fromTo(['#rAmt', '#rCmp', '#rNote', '#rTot'], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .35, stagger: .06 });
    } });
  } });
  gsap.set(['#rAmt', '#rCmp', '#rNote', '#rTot'], { opacity: 0 });
}
function info() {
  const t = TEAM[TEAM.length - 1], R = t.R;
  $('rAmt').innerHTML = esc(bigName(R)) + '<b>' + esc(T.amtL) + ' ' + esc(amtWord(R.b)) + (R.b == null ? '' : '🍆') + '</b>';
  $('rCmp').innerHTML = compare(R);
  $('rNote').textContent = R.unknown ? T.unknownNote : R.pet ? T.petNote : R.ch ? T.charNote : '';
  const known = TEAM.filter(x => x.R.b != null), tot = known.reduce((a, x) => a + x.R.b, 0);
  $('rTot').innerHTML = TEAM.length > 1 ? esc(fill(T.totN, { c: crewName() })) + '<br><b style="font-size:22px">' + esc(amtWord(tot)) + '🍆</b>' : '';
  $('crewRow').hidden = TEAM.length < 2;
  const left = MAXT - TEAM.length; $('friendBtn').hidden = left <= 0; $('friendBtn').textContent = TEAM.length === 1 ? T.friend : fill(T.friend2, { n: left });
}
$('friendBtn').onclick = () => { MODE = 'friend'; $('nm').value = ''; applyLang(); show('title'); setTimeout(() => { try { $('nm').focus(); } catch (e) { } }, 50); ev('friend_open', { team: TEAM.length }); };
$('backBtn').onclick = () => { if (TEAM.length) { MODE = 'main'; applyLang(); show('result'); } };
$('again').onclick = () => { MODE = 'main'; TEAM = []; $('crew').value = ''; ls.set('kensho_crew', ''); PHOTO = null; drawThumb(); $('nm').value = ''; applyLang(); show('title'); };

// ---------- 投稿用の画像 ----------
function shareCanvas() {
  const n = TEAM.length, cols = n === 1 ? 1 : n === 2 ? 2 : 3, rows = n <= 3 ? 1 : 2, pw = n === 1 ? 840 : n === 2 ? 700 : 470, ph = Math.round(pw * PH / PW), gap = 36, W = n === 1 ? 1080 : cols * pw + (cols + 1) * gap, top = 40, cap = 110, H = top + rows * ph + (rows - 1) * gap + cap + 30;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a2716'); g.addColorStop(1, '#170f08'); x.fillStyle = g; x.fillRect(0, 0, W, H); x.fillStyle = '#00000040'; for (let px = 0; px < W; px += 120) x.fillRect(px, 0, 3, H);
  TEAM.forEach((t, i) => { const row = i < cols ? 0 : 1, inRow = row ? n - cols : Math.min(n, cols), col = row ? i - cols : i, rw = inRow * pw + (inRow - 1) * gap, sx = (W - rw) / 2 + col * (pw + gap), sy = top + row * (ph + gap), rot = (hash(t.R.k, 5) - .5) * .05;
    x.save(); x.translate(sx + pw / 2, sy + ph / 2); x.rotate(rot); x.shadowColor = '#000a'; x.shadowBlur = 24; x.shadowOffsetY = 10; x.drawImage(t.cv, -pw / 2, -ph / 2, pw, ph); x.shadowColor = '#0000'; x.fillStyle = '#b3241a'; x.beginPath(); x.arc(0, -ph / 2 + 18, 11, 0, Math.PI * 2); x.fill(); x.fillStyle = '#ffffff55'; x.beginPath(); x.arc(-3, -ph / 2 + 15, 4, 0, Math.PI * 2); x.fill(); x.restore(); });
  const cy = H - cap / 2 - 10; x.fillStyle = '#efe0b6'; x.textAlign = 'center'; x.textBaseline = 'middle';
  if (n > 1) { const tot = TEAM.filter(t => t.R.b != null).reduce((a, t) => a + t.R.b, 0), s = fill(T.totN, { c: crewName() }) + '  ' + digits(tot) + '-'; const f0 = fitText(x, s, W - 160, 40, '900', SERIF[L]); x.font = '900 ' + f0 + 'px ' + SERIF[L]; const w = x.measureText(s).width; nasu(x, W / 2 - w / 2 - 30, cy - 18, 46); x.fillText(s, W / 2 + 10, cy - 20); x.font = '700 24px ' + NUMF; x.fillStyle = '#d9c08acc'; x.fillText('懸賞🍆  nasubi-no-oniwa.com/kensho', W / 2, cy + 30); }
  else { x.font = '900 44px ' + SERIF.ja; x.fillText('懸賞🍆', W / 2, cy - 14); x.font = '700 24px ' + NUMF; x.fillStyle = '#d9c08acc'; x.fillText('nasubi-no-oniwa.com/kensho', W / 2, cy + 30); }
  return c;
}
const toBlob = c => new Promise(r => c.toBlob(b => r(b), 'image/png'));
const fileName = () => 'kensho-' + (TEAM[0] ? TEAM[0].R.name.replace(/[\\/:*?"<>|\s]/g, '').slice(0, 12) : 'nasu') + '.png';
let QUOTE = {};
fetch('https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/xquote/g/kensho.json').then(r => r.json()).then(d => { if (d && typeof d === 'object') QUOTE = d; }).catch(() => { });
function quoteURL() { const u = (L === 'ja' ? QUOTE.ja : (QUOTE.en || QUOTE.ja)) || ''; return /^https:\/\/x\.com\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}$/.test(u) ? u : ''; }
function postText() {
  const n = TEAM.length, R = TEAM[n - 1].R; let s;
  if (n === 1) s = fill(T.post, { a: amtWord(R.b), n: bigName(R) });
  else { const tot = TEAM.filter(t => t.R.b != null).reduce((a, t) => a + t.R.b, 0); s = fill(T.postT, { crew: crewName(), a: amtWord(tot), c: n, list: TEAM.map(t => bigName(t.R) + ' ' + amtWord(t.R.b) + (t.R.b == null ? '' : '🍆')).join('\n') }); }
  return s + '\n#懸賞なす #ブラウザゲーム\nhttps://nasubi-no-oniwa.com/kensho/';
}
async function saveImg() { const b = await toBlob(shareCanvas()); const f = new File([b], fileName(), { type: 'image/png' });
  try { if (IS_PHONE && navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = fileName(); document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); }
$('imgBtn').onclick = () => { saveImg(); ev('img_save'); };
$('xBtn').onclick = async () => {
  const q = quoteURL(), text = postText();
  if (IS_PHONE && navigator.canShare) { try { const b = await toBlob(shareCanvas()), f = new File([b], fileName(), { type: 'image/png' }); if (navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: text + (q ? '\n' + q : '') }); ev('x_share', { via: 'sheet' }); return; } } catch (e) { if (e && e.name === 'AbortError') return; } }
  if (!IS_PHONE) saveImg(); // パソコン：先に画像を保存してから、投稿画面を開く（画像は手で添付）
  const u = 'https://x.com/intent/post?text=' + encodeURIComponent(text) + (q ? '&url=' + encodeURIComponent(q) : ''); const w = window.open(u, '_blank'); if (!w) location.href = u;
};

// ---------- 言語の切りかえ ----------
function applyLang() {
  T = TT[L]; document.documentElement.lang = L === 'zh' ? 'zh-CN' : L;
  $('langs').innerHTML = LANGS.map(k => `<button data-l="${k}" class="${k === L ? 'on' : ''}">${esc(TT[k].lang)}</button>`).join('');
  document.querySelectorAll('#langs button').forEach(b => b.onclick = () => { L = b.dataset.l; ls.set('kensho_lang', L); applyLang(); if (TEAM.length) TEAM.forEach(t => t.cv = drawPoster(t.R, t.ph, { no: t.no })); });
  const fr = MODE === 'friend';
  $('tSmall').textContent = T.small; $('tLead').innerHTML = fr ? T.leadF : T.lead; $('nmL').textContent = fr ? T.nmLF : T.nmL; $('nm').placeholder = T.ph; $('phL').textContent = T.phL;
  $('startBtn').textContent = fr ? T.startF : T.start; $('rkBtn').textContent = T.rank; $('backBtn').textContent = T.back; $('backBtn').hidden = !fr; $('tNote').innerHTML = T.notes;
  $('edT').textContent = T.edT; $('edHint').textContent = T.edHint; $('edOk').textContent = T.edOk; $('edRe').textContent = T.edRe; $('edDel').textContent = T.edDel;
  $('crewL').textContent = T.crewL; $('crew').placeholder = T.crewPh; $('crewPre').textContent = T.crewPre; $('crewSuf').textContent = T.crewSuf; $('xBtn').textContent = T.x; $('imgBtn').textContent = T.img; $('again').textContent = T.again; $('rkBtn2').textContent = T.rank; $('rkT').textContent = T.rkT; $('rkNote').textContent = T.rkNote; $('rkBack').textContent = T.back;
  $('snd').textContent = SND ? T.sndOn : T.sndOff; $('load').textContent = T.load; drawThumb(); if (TEAM.length) info();
}

// ---------- OGP・アイコン用（?ogp=1 / ?icon=1 のときだけ） ----------
function special() {
  const q = location.search;
  if (/[?&]pv=1/.test(q)) { document.body.innerHTML = ''; const st = document.createElement('style'); st.textContent = 'body:before{display:none!important}body{margin:0;background:#000}'; document.head.appendChild(st); import('./pv.js').then(m => m.run({ drawPoster, judge, nasu, SERIF, NUMF, PW, PH, digits, bigName, amtWord, hash, rng, setLang: l => { L = l; T = TT[l]; } })); return true; }
  if (!/[?&](ogp|icon)=1/.test(q)) return false;
  document.body.innerHTML = ''; document.body.style.cssText = 'margin:0;background:#000'; document.body.style.minHeight = '0';
  const st = document.createElement('style'); st.textContent = 'body:before{display:none!important}'; document.head.appendChild(st);
  if (/icon=1/.test(q)) { const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d'); const g = x.createRadialGradient(256, 256, 60, 256, 256, 380); g.addColorStop(0, '#efdcab'); g.addColorStop(1, '#b8915a'); x.fillStyle = g; x.fillRect(0, 0, 512, 512); x.strokeStyle = '#2a1a0c'; x.lineWidth = 14; x.strokeRect(24, 24, 464, 464); x.lineWidth = 4; x.strokeRect(46, 46, 420, 420); x.fillStyle = '#2a1a0c'; x.textAlign = 'center'; x.font = '900 120px ' + SERIF.ja; x.fillText('懸賞', 256, 168); nasu(x, 256, 330, 250); c.style.cssText = 'display:block'; document.body.appendChild(c); return true; }
  const W = 1200, H = 630, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a2716'); g.addColorStop(1, '#170f08'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const names = [['なすび', 3.66e8], ['ルフィ', null], ['ゾロ', null]]; const items = names.map(([n, b]) => { const R = judge(n); if (b) R.b = b; return drawPoster(R, null, { no: 12 }); });
  const pw = 300, ph = Math.round(pw * PH / PW); items.forEach((cv, i) => { x.save(); x.translate(700 + i * 175, 318 + (i % 2) * 14); x.rotate((i - 1) * .07); x.shadowColor = '#000a'; x.shadowBlur = 20; x.drawImage(cv, -pw / 2, -ph / 2, pw, ph); x.restore(); });
  x.fillStyle = '#efe0b6'; x.textAlign = 'center'; x.font = '900 120px ' + SERIF.ja; x.fillText('懸賞🍆', 260, 280); x.font = '800 30px ' + SERIF.ja; x.fillText('名前で決まる、あなたの懸賞金', 260, 350); x.font = '700 22px ' + NUMF; x.fillStyle = '#d9c08acc'; x.fillText('nasubi-no-oniwa.com/kensho', 260, 400);
  c.style.cssText = 'display:block'; document.body.appendChild(c); return true;
}

// ---------- はじめ ----------
if (!special()) {
  applyLang(); $('nm').value = ls.get('kensho_name', '') || ''; $('crew').value = ls.get('kensho_crew', '') || ''; $('load').hidden = true; show('title');
  gsap.fromTo('#title .card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' });
  if (DEV) window.__K = { judge, TEAM: () => TEAM, bigName, amtWord, compare, setL: l => { L = l; applyLang(); } };
}
