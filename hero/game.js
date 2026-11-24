// 趣味でヒーローになる（なすびのお庭）
// 採点と記録はサーバー（/api/hero/）でやる。答えはこのページには一切ない
// まだ公開前：確認用の合言葉つきURL（?k=nasu0824）で一度開いた端末だけ遊べる
(() => { let ok = false; try { if (/[?&]k=nasu0824\b/.test(location.search)) localStorage.setItem('hero_open', '1'); ok = localStorage.getItem('hero_open') === '1'; } catch (e) { }
  if (!ok) { document.body.innerHTML = '<div style="position:fixed;inset:0;display:grid;place-items:center;background:#10131c;color:#fff;font:900 22px/1.8 sans-serif;text-align:center">趣味でヒーローになる<br><span style="font-size:15px;color:#a9b0c2">ただいま準備中です</span></div>'; throw new Error('closed'); } })();
const gsap = window.gsap, PFX = window.PFX;
const $ = id => document.getElementById(id);
const DEV = /[?&]dev=1/.test(location.search);
const IS_PHONE = /iPhone|iPod|iPad|Android/i.test(navigator.userAgent || '');
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
const API = '/api/hero/';
const DUR = DEV && /[?&]short=1/.test(location.search) ? 5 : 30;
const PANELS = ['title', 'brief', 'evres', 'wbrief', 'write', 'result', 'rank', 'recov'];
let ST = 'load', SID = '', MODE = 'temp', PASS = { r: 250, t: 150, g: 25, w: 280 }, PH = {}, LAST = null, BACK = 'title';

function show(id) {
  PANELS.forEach(p => $(p).hidden = p !== id);
  if (id) { const c = document.querySelector('#' + id + ' .card'); if (c) gsap.fromTo(c, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'power3.out' }); $(id).scrollTop = 0; }
}
let toastT = 0; function toast(m, ms) { const t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, ms || 5000); }
async function api(p, b) {
  const o = b === undefined ? { credentials: 'same-origin' } : { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) };
  const r = await fetch(API + p, o); let j = {}; try { j = await r.json(); } catch (e) { }
  if (!r.ok) { const e = new Error(j.err || ('http' + r.status)); e.code = j.err || ('http' + r.status); throw e; }
  return j;
}
const ERRMSG = { taken: 'かぶっています。他の名前にしてください', empty: '名前とヒーローネームを両方入れてください', long: '名前は10文字、ヒーローネームは15文字までです', setup: 'いまは準備中です。少し待ってからもう一度どうぞ', cheat: '記録がおかしいため、この試験は無効になりました', sid: '試験の時間が切れました。もう一度受けてください' };
const errMsg = e => ERRMSG[e && e.code] || '通信できませんでした。電波のいい所でもう一度どうぞ';

// ---------- 音 ----------
let SND = ls.get('hero_snd', true), AC = null;
function ac() { if (!SND) return null; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; } catch (e) { return null; } }
function tone(f, d, type, v, f2) { const a = ac(); if (!a) return; const o = a.createOscillator(), g = a.createGain(), t = a.currentTime; o.type = type || 'square'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); g.gain.setValueAtTime(v || .08, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(a.destination); o.start(t); o.stop(t + d + .02); }
function noise(d, v) { const a = ac(); if (!a) return; const n = a.createBufferSource(), b = a.createBuffer(1, a.sampleRate * d, a.sampleRate), x = b.getChannelData(0); for (let i = 0; i < x.length; i++)x[i] = (Math.random() * 2 - 1) * (1 - i / x.length); n.buffer = b; const g = a.createGain(); g.gain.value = v || .15; n.connect(g).connect(a.destination); n.start(); }
const sfx = {
  hit() { noise(.06, .18); tone(140, .07, 'square', .06, 60); }, beep() { tone(660, .12, 'square', .06); }, go() { tone(880, .25, 'square', .08); }, ok() { tone(740, .09, 'triangle', .1); setTimeout(() => tone(1100, .14, 'triangle', .1), 80); },
  bad() { tone(160, .25, 'sawtooth', .06, 90); }, stamp() { noise(.18, .3); tone(90, .3, 'sine', .25, 40); }, fan() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, .18, 'triangle', .09), i * 110)); }, tick() { tone(1200, .03, 'square', .03); }
};
function setSnd() { $('sndBtn').textContent = SND ? '🔊 音 あり' : '🔇 音 なし'; }
$('sndBtn').onclick = () => { SND = !SND; ls.set('hero_snd', SND); setSnd(); if (SND) sfx.beep(); };

// ---------- 背景（夕方の街） ----------
const bg = $('bg'), bx = bg.getContext('2d'); let W = 0, H = 0, DPR = 1;
function drawBg() {
  DPR = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight;
  for (const c of [bg, $('pc')]) { c.width = W * DPR; c.height = H * DPR; }
  const x = bx; x.setTransform(DPR, 0, 0, DPR, 0, 0);
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1b2140'); g.addColorStop(.55, '#5a3550'); g.addColorStop(.8, '#d9643a'); g.addColorStop(1, '#2a1a1a'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.save(); x.globalAlpha = .08; x.strokeStyle = '#fff'; x.lineWidth = 2; const cx = W / 2, cy = H * .78;
  for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; x.beginPath(); x.moveTo(cx + Math.cos(a) * 60, cy + Math.sin(a) * 60); x.lineTo(cx + Math.cos(a) * 2000, cy + Math.sin(a) * 2000); x.stroke(); }
  x.restore();
  let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let layer = 0; layer < 2; layer++) {
    x.fillStyle = layer ? '#0d0f18' : '#2a2238'; let px = -20; const base = H * (layer ? .86 : .8);
    while (px < W + 20) { const w = 26 + r() * 50, h = (layer ? 40 : 70) + r() * (layer ? 120 : 160); x.fillRect(px, base - h, w, H); if (layer) { x.fillStyle = '#ffd96a'; for (let k = 0; k < 6; k++) { if (r() < .5) x.fillRect(px + 5 + r() * (w - 12), base - h + 8 + r() * (h - 16), 4, 5); } x.fillStyle = '#0d0f18'; } px += w + 2; }
  }
}
addEventListener('resize', () => { drawBg(); if (EV && EV.draw) EV.draw(); });

// ---------- 演出（pixelfx） ----------
const fxc = $('fxc'), fctx = fxc.getContext('2d'); let FXS = [], fxRaf = 0, fxLast = 0, fxFrame = null, fxImg = null;
function fxAdd(kind, o) { try { if (!PFX || !PFX.fx[kind]) return; if (!fxFrame) { fxFrame = PFX.createFrame(160, 160); fxImg = new ImageData(160, 160); } const f = PFX.createFx(PFX.fx[kind], Object.assign({ x: 80, y: 80, seed: (Math.random() * 1e6) | 0 }, o || {})); f._life = kind === 'confetti' ? 3 : 1.4; FXS.push(f); if (!fxRaf) { fxLast = performance.now(); fxRaf = requestAnimationFrame(fxLoop); } } catch (e) { } }
function fxLoop(now) { const dt = Math.min(.05, (now - fxLast) / 1000); fxLast = now; try { PFX.clearFrame(fxFrame); FXS = FXS.filter(f => { f.update(dt); f.draw(fxFrame, 'back'); f.draw(fxFrame, 'front'); f._life -= dt; return !f.done() && f._life > 0; }); PFX.composite(fxFrame, fxImg.data, null); fctx.putImageData(fxImg, 0, 0); } catch (e) { FXS = []; } if (FXS.length) fxRaf = requestAnimationFrame(fxLoop); else { fxRaf = 0; fctx.clearRect(0, 0, 160, 160); } }
const YEL = ['#5a3a00', '#8a5a00', '#c98a00', '#ffb800', '#ffd21f', '#ffe56b', '#fff2b0', '#ffffff'];
const RED = ['#3a0000', '#6a0a0a', '#a01414', '#d42020', '#ff3a2a', '#ff7a5a', '#ffc0a8', '#ffffff'];
function flash(c, a) { const f = $('flash'); f.style.background = c || '#fff'; gsap.fromTo(f, { opacity: a || .7 }, { opacity: 0, duration: .35 }); }
function pop(txt, col) { const p = $('pop'); p.textContent = txt; p.style.color = col || '#fff'; p.hidden = false; gsap.killTweensOf(p); gsap.fromTo(p, { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: .25, ease: 'back.out(3)' }); gsap.to(p, { opacity: 0, duration: .3, delay: .7, onComplete: () => p.hidden = true }); }

// ---------- 体力テスト ----------
const pc = $('pc'), px = pc.getContext('2d');
const EVENTS = [
  { k: 'r', n: '連打（パンチ力）', d: '30秒間、画面をひたすらたたいてサンドバッグを殴れ！<br>指は何本使ってもいい。', p: () => `合格ライン：30秒で${PASS.r}回` },
  { k: 't', n: '反応速度', d: '画面が「今だ！」に変わった瞬間にタップ！<br>30秒のあいだに何度も出る。<b>一番速かった1回</b>で判定。<br>合図の前に押すとフライング。', p: () => `合格ライン：${(PASS.t / 1000).toFixed(2)}秒` },
  { k: 'g', n: '持久走', d: '押している間ペースが上がり、離すと下がる。<br><b>黄色い帯</b>の中にペースを保ち続けろ。帯はゆっくり動く。', p: () => `合格ライン：30秒中${PASS.g}秒` },
  { k: 'w', n: '重り持ち上げ', d: '左右に動く針が<b>まん中</b>に来た瞬間にタップ！<br>ど真ん中なら10kg、近ければ5kg。外すと少し休み。', p: () => `合格ライン：合計${PASS.w}kg` },
];
let EV = null, EVI = 0, raf = 0;

function startPhys() { EVI = 0; PH = {}; brief(); }
function brief() {
  const e = EVENTS[EVI]; ST = 'brief';
  $('bN').textContent = `体力テスト ${EVI + 1} / 4`; $('bT').textContent = e.n; $('bD').innerHTML = e.d; $('bP').textContent = e.p();
  show('brief');
}
$('bGo').onclick = () => { ac(); runEvent(EVENTS[EVI].k); };

function runEvent(k) {
  show(null); ST = 'play'; pc.hidden = false; $('hud').hidden = false; $('hint').hidden = false;
  HOLD = 0; EV = MAKE[k](); EV.k = k; EV.t = 0; EV.on = false;
  $('hudN').textContent = EVENTS[EVI].n; gsap.set('#tbarI', { scaleX: 1 }); $('hudSec').textContent = DUR.toFixed(1) + '秒'; EV.hud(); EV.draw();
  // 3・2・1
  const cd = $('cd'); cd.hidden = false; cd.classList.remove('go'); let n = 3;
  const step = () => {
    if (n > 0) { cd.textContent = n; sfx.beep(); gsap.fromTo(cd, { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .3 }); n--; setTimeout(step, 750); }
    else { cd.textContent = 'はじめ！'; cd.classList.add('go'); sfx.go(); gsap.fromTo(cd, { scale: 1.4 }, { scale: 1, duration: .25 }); gsap.to(cd, { opacity: 0, delay: .45, duration: .25, onComplete: () => cd.hidden = true }); EV.on = true; EV.t0 = performance.now(); EV.begin && EV.begin(); loop(); }
  };
  step();
}
function loop() {
  cancelAnimationFrame(raf);
  let last = performance.now();
  const f = now => {
    if (!EV || !EV.on) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    EV.t = (now - EV.t0) / 1000; const rest = Math.max(0, DUR - EV.t);
    $('hudSec').textContent = rest.toFixed(1) + '秒'; $('tbarI').style.transform = `scaleX(${rest / DUR})`;
    EV.step(dt, now); EV.draw(now); EV.hud();
    if (rest <= 0) return endEvent();
    raf = requestAnimationFrame(f);
  };
  raf = requestAnimationFrame(f);
}
function endEvent() {
  EV.on = false; cancelAnimationFrame(raf); sfx.go(); pop('そこまで！', '#ffd21f');
  const v = EV.value(); PH[EV.k] = v;
  setTimeout(() => {
    pc.hidden = true; $('hud').hidden = true; $('hint').hidden = true;
    const e = EVENTS[EVI], pts = ptsOf(EV.k, v);
    $('eN').textContent = `体力テスト ${EVI + 1} / 4　${e.n}`; $('eV').textContent = EV.label(v); $('eM').textContent = e.p() + (pts >= 25 ? '　合格ライン突破！' : '');
    show('evres'); ST = 'evres';
    const o = { n: 0 }; gsap.to(o, { n: pts, duration: .8, ease: 'power2.out', onUpdate: () => $('eP').textContent = Math.round(o.n), onComplete: () => { if (pts >= 25) { sfx.fan(); fxAdd('burst', { palette: YEL }); } else sfx.ok(); } });
    $('eGo').textContent = EVI < 3 ? '次の種目へ' : '体力テスト終了';
    EV = null;
  }, 900);
}
// 画面に見せる点（サーバーと同じ計算。最後の点はサーバーが決める）
function ptsOf(k, v) {
  if (k === 'r') return Math.floor(25 * Math.min(1, v / PASS.r));
  if (k === 't') return v >= 100 ? (v <= PASS.t ? 25 : Math.floor(25 * PASS.t / v)) : 0;
  if (k === 'g') return Math.floor(25 * Math.min(1, v / PASS.g));
  return Math.floor(25 * Math.min(1, v / PASS.w));
}
$('eGo').onclick = async () => {
  if (EVI < 3) { EVI++; brief(); return; }
  $('eGo').disabled = true;
  try {
    const j = await api('phys', { sid: SID, r: PH.r | 0, t: Math.round(PH.t || 0), g: +(PH.g || 0).toFixed(2), w: PH.w | 0 });
    PH.sc = j.sc; QNOW = j.q; show('wbrief'); ST = 'wbrief';
  } catch (e) { toast(errMsg(e)); if (e.code === 'cheat' || e.code === 'sid') toTitle(); }
  $('eGo').disabled = false;
};

// 入力（タップ・クリック・スペースキー）
let HOLD = 0;
pc.addEventListener('pointerdown', e => { e.preventDefault(); if (EV && EV.on) { HOLD++; EV.down(e.timeStamp, e.clientX, e.clientY); } });
addEventListener('pointerup', () => { HOLD = Math.max(0, HOLD - 1); if (EV && EV.on && EV.up) EV.up(); });
addEventListener('pointercancel', () => { HOLD = Math.max(0, HOLD - 1); });
addEventListener('keydown', e => { if (e.code !== 'Space' || e.repeat || !EV || !EV.on) return; e.preventDefault(); HOLD++; EV.down(e.timeStamp, W / 2, H / 2); });
addEventListener('keyup', e => { if (e.code !== 'Space' || !EV) return; HOLD = Math.max(0, HOLD - 1); if (EV.up) EV.up(); });
if (!CanvasRenderingContext2D.prototype.roundRect) CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h) { this.rect(x, y, w, h); };
const C2 = () => { px.setTransform(DPR, 0, 0, DPR, 0, 0); px.clearRect(0, 0, W, H); };
function txt(s, x, y, size, col, al) { px.font = `900 ${size}px "Hiragino Sans","Noto Sans JP",sans-serif`; px.textAlign = al || 'center'; px.textBaseline = 'middle'; px.lineWidth = Math.max(3, size / 7); px.strokeStyle = '#000'; px.strokeText(s, x, y); px.fillStyle = col || '#fff'; px.fillText(s, x, y); }

const MAKE = {
  // 連打：サンドバッグ
  r() {
    let n = 0, sw = 0, sv = 0, shake = 0;
    return {
      value: () => n, label: v => `${v}回`,
      hud() { $('hudS').innerHTML = `${n}<small>回</small>`; $('hint').textContent = 'たたけ！たたけ！'; },
      down(ts, x, y) { n++; sv += (x < W / 2 ? 1 : -1) * 2.2; shake = 1; sfx.hit(); if (n % 25 === 0) { fxAdd('burst', { palette: YEL, x: 80 + (x - W / 2) / W * 120, y: 70 }); } },
      step(dt) { sv += -sw * 30 * dt; sv *= Math.exp(-3 * dt); sw += sv * dt; sw = Math.max(-.6, Math.min(.6, sw)); shake *= Math.exp(-12 * dt); },
      draw() {
        C2(); const cx = W / 2, top = H * .16, L = Math.min(H * .5, 380);
        px.save(); px.translate(cx, top); px.rotate(sw);
        px.strokeStyle = '#222'; px.lineWidth = 4; px.beginPath(); px.moveTo(0, 0); px.lineTo(0, L * .25); px.stroke();
        const bw = Math.min(W * .34, 150), bh = L * .7, by = L * .25, k = 1 + shake * .06;
        px.translate(0, by + bh / 2); px.scale(k, 1 / k);
        px.fillStyle = '#b5311f'; px.strokeStyle = '#000'; px.lineWidth = 4; px.beginPath(); px.roundRect(-bw / 2, -bh / 2, bw, bh, 26); px.fill(); px.stroke();
        px.fillStyle = '#7d1f12'; px.fillRect(-bw / 2 + 4, -bh / 2 + 18, bw - 8, 10); px.fillRect(-bw / 2 + 4, bh / 2 - 28, bw - 8, 10);
        px.restore();
        const p = Math.min(1, n / PASS.r), y = H * .9; px.fillStyle = '#000'; px.fillRect(30, y - 9, W - 60, 18); px.fillStyle = p >= 1 ? '#ffd21f' : '#e8322a'; px.fillRect(32, y - 7, (W - 64) * p, 14);
        txt(p >= 1 ? '合格ライン突破！' : `あと${PASS.r - n}回`, W / 2, y - 28, 18, p >= 1 ? '#ffd21f' : '#fff');
      },
    };
  },
  // 反応速度
  t() {
    let st = 'wait', at = 0, goT = 0, best = 0, last = '', lastC = '#fff', cnt = 0, foul = 0, pending = false;
    const sched = now => { st = 'wait'; at = now + 1200 + Math.random() * 2600; };
    return {
      value: () => best, label: v => v ? `一番速かった1回：${(v / 1000).toFixed(3)}秒` : '記録なし',
      hud() { $('hudS').innerHTML = best ? `${(best / 1000).toFixed(3)}<small>秒</small>` : '—'; $('hint').textContent = st === 'go' ? '' : '画面が変わったらタップ'; },
      begin() { sched(performance.now()); },
      down(ts) {
        const now = performance.now();
        if (st === 'go') { const rt = ts - goT; if (rt < 100) { foul++; last = 'フライング'; lastC = '#ff7a6a'; sfx.bad(); } else { cnt++; if (!best || rt < best) best = rt; last = (rt / 1000).toFixed(3) + '秒'; lastC = rt <= PASS.t ? '#ffd21f' : '#fff'; if (rt <= PASS.t) { sfx.fan(); fxAdd('burst', { palette: YEL }); } else sfx.ok(); } st = 'rest'; at = now + 900; }
        else if (st === 'wait') { foul++; last = 'フライング！'; lastC = '#ff7a6a'; sfx.bad(); flash('#ff0000', .3); sched(now + 300); }
      },
      step(dt, now) {
        if (st === 'wait' && now >= at) { st = 'arm'; pending = true; }
        else if (st === 'go' && now - goT > 1500) { last = 'おそい！'; lastC = '#ff7a6a'; sched(now); }
        else if (st === 'rest' && now >= at) sched(now);
      },
      draw(now) {
        C2();
        if (st === 'arm' || st === 'go') {
          px.fillStyle = '#e8322a'; px.fillRect(0, 0, W, H); txt('今だ！', W / 2, H * .45, Math.min(W * .22, 110), '#ffd21f');
          if (st === 'arm' && pending) { pending = false; st = 'go'; goT = performance.now(); sfx.go(); }
        } else { px.fillStyle = '#0c0f18cc'; px.fillRect(0, 0, W, H); txt('待て…', W / 2, H * .45, Math.min(W * .16, 80), '#7d859c'); }
        if (last && st !== 'go' && st !== 'arm') txt(last, W / 2, H * .62, 34, lastC);
        txt(`成功 ${cnt}回　フライング ${foul}回`, W / 2, H * .9, 15, '#fff');
      },
    };
  },
  // 持久走（長押しでペースを帯の中に保つ）
  g() {
    let L = .3, v = 0, inb = 0, t = 0, runP = 0, on = false;
    const band = tt => { const k = Math.min(1, tt / 3); return .5 + k * (.22 * Math.sin(tt * .5) + .08 * Math.sin(tt * 1.37 + 1)); };
    const BW = .08;
    return {
      value: () => inb, label: v => `帯の中にいた時間：${v.toFixed(1)}秒`,
      hud() { $('hudS').innerHTML = `${inb.toFixed(1)}<small>秒</small>`; $('hint').textContent = on ? 'いい調子！' : '押す＝ペースアップ／離す＝ダウン'; },
      down() { }, up() { },
      step(dt) {
        t += dt; const a = HOLD > 0 ? 1.15 : -.95; v += (a - 2.6 * v) * dt; L += v * dt;
        if (L < 0) { L = 0; v = 0; } if (L > 1) { L = 1; v = 0; }
        const c = band(t); on = Math.abs(L - c) <= BW / 2; if (on) inb += dt; runP += dt * (2 + L * 10);
      },
      draw() {
        C2(); const gx = W - 70, gy = H * .17, gh = H * .62, gw = 40, c = band(t);
        px.fillStyle = '#000'; px.fillRect(gx - 4, gy - 4, gw + 8, gh + 8); px.fillStyle = '#2a3142'; px.fillRect(gx, gy, gw, gh);
        px.fillStyle = on ? '#ffd21f' : '#ffd21f99'; px.fillRect(gx, gy + gh * (1 - c - BW / 2), gw, gh * BW);
        const ly = gy + gh * (1 - L); px.fillStyle = '#fff'; px.fillRect(gx - 12, ly - 3, gw + 24, 6); px.strokeStyle = '#000'; px.lineWidth = 2; px.strokeRect(gx - 12, ly - 3, gw + 24, 6);
        txt('ペース', gx + gw / 2, gy - 18, 14, '#fff');
        // 走る人（どこにでもいる人型）
        const cx = W * .36, gyr = H * .66, s = Math.min(W, 420) / 420, ph = runP;
        px.strokeStyle = '#000'; px.lineWidth = 9 * s; px.lineCap = 'round';
        px.fillStyle = '#ffffff22'; px.fillRect(0, gyr + 74 * s, W - 90, 6);
        const leg = a => { px.beginPath(); px.moveTo(cx, gyr); px.lineTo(cx + Math.sin(a) * 26 * s, gyr + 38 * s); px.lineTo(cx + Math.sin(a) * 26 * s - 6 * s, gyr + 74 * s); px.stroke(); };
        const arm = a => { px.beginPath(); px.moveTo(cx + 4 * s, gyr - 52 * s); px.lineTo(cx + Math.sin(a) * 26 * s, gyr - 26 * s); px.stroke(); };
        leg(ph); leg(ph + Math.PI); arm(ph + Math.PI); arm(ph);
        px.beginPath(); px.moveTo(cx, gyr); px.lineTo(cx + 6 * s, gyr - 58 * s); px.stroke();
        px.fillStyle = on ? '#ffd21f' : '#e8322a'; px.beginPath(); px.arc(cx + 9 * s, gyr - 76 * s, 15 * s, 0, 7); px.fill(); px.lineWidth = 4 * s; px.stroke();
        if (!on) txt(L > c ? '速すぎ！' : '遅すぎ！', cx, gyr - 120 * s, 22, '#ff7a6a');
        txt(`合格ライン ${PASS.g}秒`, W * .36, H * .9, 15, inb >= PASS.g ? '#ffd21f' : '#fff');
      },
    };
  },
  // 重り持ち上げ
  w() {
    let kg = 0, t = 0, stun = 0, lift = 0, msg = '', msgC = '#fff', msgT = 0;
    const pos = () => .5 + .5 * Math.sin(t * 4.6);
    return {
      value: () => kg, label: v => `合計 ${v}kg`,
      hud() { $('hudS').innerHTML = `${kg}<small>kg</small>`; $('hint').textContent = stun > 0 ? 'ひと休み…' : 'まん中でタップ！'; },
      down() {
        if (stun > 0) return; const d = Math.abs(pos() - .5);
        if (d < .06) { kg += 10; lift = 1; msg = 'ど真ん中！ +10kg'; msgC = '#ffd21f'; sfx.fan(); fxAdd('burst', { palette: YEL, y: 70 }); }
        else if (d < .16) { kg += 5; lift = .6; msg = 'おしい +5kg'; msgC = '#fff'; sfx.ok(); }
        else { stun = .45; msg = 'はずれ…'; msgC = '#ff7a6a'; sfx.bad(); }
        msgT = .8;
      },
      step(dt) { t += dt; stun = Math.max(0, stun - dt); lift *= Math.exp(-3 * dt); msgT -= dt; },
      draw() {
        C2(); const cx = W / 2, y0 = H * .5 - lift * 70, bw = Math.min(W * .8, 340), plates = Math.min(8, Math.floor(kg / 40) + 1);
        px.fillStyle = '#ddd'; px.strokeStyle = '#000'; px.lineWidth = 3; px.fillRect(cx - bw / 2, y0 - 5, bw, 10); px.strokeRect(cx - bw / 2, y0 - 5, bw, 10);
        for (let i = 0; i < plates; i++) for (const sd of [-1, 1]) { const x = cx + sd * (bw / 2 - 18 - i * 13); px.fillStyle = i % 2 ? '#e8322a' : '#2a3142'; px.fillRect(x - 6, y0 - 40, 12, 80); px.strokeRect(x - 6, y0 - 40, 12, 80); }
        txt(`${kg}kg`, cx, y0 - 70, 34, kg >= PASS.w ? '#ffd21f' : '#fff');
        const my = H * .74, mw = Math.min(W - 40, 360), mx = cx - mw / 2;
        px.fillStyle = '#000'; px.fillRect(mx - 4, my - 22, mw + 8, 44); px.fillStyle = '#2a3142'; px.fillRect(mx, my - 18, mw, 36);
        px.fillStyle = '#ffd21f88'; px.fillRect(cx - mw * .16, my - 18, mw * .32, 36); px.fillStyle = '#ffd21f'; px.fillRect(cx - mw * .06, my - 18, mw * .12, 36);
        const nx = mx + mw * pos(); px.fillStyle = stun > 0 ? '#7d859c' : '#fff'; px.fillRect(nx - 3, my - 30, 6, 60); px.strokeStyle = '#000'; px.lineWidth = 2; px.strokeRect(nx - 3, my - 30, 6, 60);
        if (msgT > 0) txt(msg, cx, my - 60, 22, msgC);
        txt(`合格ライン ${PASS.w}kg`, cx, H * .9, 15, '#fff');
      },
    };
  },
};

// ---------- 筆記 ----------
let QNOW = null, LEFT = false, WL = null, BUSY = false;
async function wake() { try { if ('wakeLock' in navigator && !WL && document.visibilityState === 'visible') { WL = await navigator.wakeLock.request('screen'); WL.addEventListener('release', () => { WL = null; }); } } catch (e) { WL = null; } }
function unwake() { try { if (WL) WL.release(); } catch (e) { } WL = null; }
$('wGo').onclick = () => { ac(); ST = 'write'; wake(); showQ(QNOW); };

function wrap(x, s, maxW) { const out = []; for (const para of String(s).split('\n')) { let line = ''; for (const ch of [...para]) { const t = line + ch; if (x.measureText(t).width > maxW && line) { if (/^[、。，．）」』,.)?!？！]$/.test(ch)) { line = t; continue; } out.push(line); line = ch; } else line = t; } out.push(line); } return out; }
function drawText(cv, s, opt) {
  const o = Object.assign({ size: 17, pad: 14, col: '#1d1a14', bg: null, center: false, minH: 0 }, opt || {});
  const cssW = cv.parentElement.clientWidth || 360, d = Math.min(2, window.devicePixelRatio || 1), x = cv.getContext('2d');
  x.font = `700 ${o.size}px "Hiragino Sans","Noto Sans JP",sans-serif`; const lines = wrap(x, s, cssW - o.pad * 2); const lh = o.size * 1.6;
  const h = Math.max(o.minH, Math.ceil(lines.length * lh + o.pad * 2)); cv.width = cssW * d; cv.height = h * d; cv.style.height = h + 'px';
  x.setTransform(d, 0, 0, d, 0, 0); if (o.bg) { x.fillStyle = o.bg; x.fillRect(0, 0, cssW, h); }
  x.font = `700 ${o.size}px "Hiragino Sans","Noto Sans JP",sans-serif`; x.fillStyle = o.col; x.textBaseline = 'middle'; x.textAlign = o.center ? 'center' : 'left';
  lines.forEach((l, i) => { const isNote = /^※/.test(l); x.fillStyle = isNote ? '#b0281f' : o.col; x.fillText(l, o.center ? cssW / 2 : o.pad, o.pad + lh * i + lh / 2); });
}
function showQ(q) {
  if (!q) return; QNOW = q; LEFT = false; show('write');
  $('wNo').textContent = `第${q.i + 1}問 / ${q.n}`; $('wSubj').textContent = q.s + (q.k === 'c' ? '・4択' : '・記述');
  $('wDots').innerHTML = Array.from({ length: q.n }, (_, i) => `<i class="${i < q.i ? 'd' : i === q.i ? 'c' : ''}"></i>`).join('');
  requestAnimationFrame(() => {
    drawText($('qc'), q.q, { size: 17, minH: 110 });
    const box = $('wCh'); box.innerHTML = '';
    if (q.k === 'c') {
      $('wIn').hidden = true; box.hidden = false;
      const order = q.c.map((_, i) => i).sort(() => Math.random() - .5);
      order.forEach((ci, k) => {
        const b = document.createElement('button'); const cv = document.createElement('canvas'); b.appendChild(cv); box.appendChild(b);
        drawText(cv, 'アイウエ'[k] + '　' + q.c[ci], { size: 16, pad: 12, col: '#111', minH: 48 });
        b.onclick = () => answer(q.c[ci]);
      });
      $('wNote').textContent = '';
    } else {
      box.hidden = true; $('wIn').hidden = false; $('wAns').value = ''; $('wSend').disabled = true;
      $('wNote').textContent = '答え方の指示（※）にあわせて入力してください。空白は気にしなくてOK。';
    }
  });
}
$('wAns').addEventListener('input', () => { $('wSend').disabled = !$('wAns').value.trim(); });
$('wAns').addEventListener('keydown', e => { if (e.key === 'Enter' && $('wAns').value.trim()) { e.preventDefault(); answer($('wAns').value); } });
$('wSend').onclick = () => answer($('wAns').value);
$('wSkip').onclick = () => answer('');
async function answer(v, left) {
  if (BUSY || !QNOW) return; BUSY = true; const i = QNOW.i;
  try {
    const j = await api('a', { sid: SID, i, v: left ? null : v });
    if (left) toast('ページを離れたので、この問題は不正解になりました', 4500); else sfx.tick();
    if (j.res) { BUSY = false; unwake(); return result(j.res); }
    showQ(j.q);
  } catch (e) { toast(errMsg(e)); if (e.code === 'sid') { unwake(); toTitle(); } }
  BUSY = false;
}
document.addEventListener('visibilitychange', () => {
  if (ST !== 'write') return;
  if (document.hidden) { LEFT = true; }
  else { wake(); if (LEFT && QNOW) { LEFT = false; answer(null, true); } }
});
addEventListener('pagehide', () => { if (ST === 'write' && QNOW && SID) { try { navigator.sendBeacon(API + 'a', new Blob([JSON.stringify({ sid: SID, i: QNOW.i, v: null })], { type: 'application/json' })); } catch (e) { } } });

// ---------- 合格通知書 ----------
let RANK = null;
const rkTxt = r => `${r.c}級 ${r.r}位`;
function result(res) {
  ST = 'result'; LAST = res;
  const name = res.temp ? '' : res.name, hero = res.temp ? '' : res.hero;
  $('rWho').innerHTML = res.temp ? '<b>名無しの受験者</b> 殿' : `<b>${esc(name)}</b> 殿<span class="hn">ヒーローネーム「${esc(hero)}」</span>`;
  $('rTemp').hidden = !res.temp;
  $('rRank').textContent = rkTxt(res.rank); $('rRank').className = res.rank.c;
  const sc = PH.sc || { r: 0, t: 0, g: 0, w: 0 };
  $('rSc').innerHTML = [['連打（パンチ力）', sc.r, 25], ['反応速度', sc.t, 25], ['持久走', sc.g, 25], ['重り持ち上げ', sc.w, 25], ['筆記試験（10問）', res.writ, 50]].map(a => `<tr><td>${a[0]}</td><td class="v">${a[1]} / ${a[2]}</td></tr>`).join('') + `<tr class="t"><td><b>合計</b></td><td class="v">${res.total} / 150点</td></tr>`;
  if (res.temp) { $('rBest').innerHTML = '※仮の級です。ランキングにはのりません。'; $('rMsg').innerHTML = '<b>次は名前を入れて、本試験に挑戦だ！</b>'; }
  else {
    $('rBest').innerHTML = res.newBest ? (res.best === res.total ? '<b>自己ベスト更新！</b>　ランキングに反映されました' : '') : `これまでの最高：<b>${res.best}点（${rkTxt(res.bestRank)}）</b>`;
    $('rMsg').innerHTML = res.same > 1 ? `同じ順位（${res.newBest ? res.total : res.best}点）のヒーローは <b>${res.same}人</b>` : (res.newBest ? `<b>${res.total}点</b>はいま、あなた1人だけ` : '');
  }
  $('rAll').textContent = 'みんなの割合：読みこみ中…';
  if (res.rec) { $('rRec').hidden = false; $('rRec').innerHTML = `復活の合言葉<b>${res.rec}</b>機種変更などでこの名前が使えなくなったら、タイトルの「合言葉で復活」に入れると戻れます。<br><b style="font-size:13px;letter-spacing:0;font-family:inherit;color:#e8322a">スクショしておこう（もう出ません）</b>`; }
  else $('rRec').hidden = true;
  if (!res.temp) { ls.set('hero_last', { n: name, h: hero }); }
  POST = postText(res); LAST.card = makeCard(res);
  envelope(res, () => reveal(res));
}
function reveal(res) {
  show('result');
  const st = document.querySelector('#result .stamp'); gsap.fromTo(st, { scale: 2.6, opacity: 0, rotate: -40 }, { scale: 1, opacity: .85, rotate: -14, duration: .35, delay: .35, ease: 'power4.in', onComplete: () => { sfx.stamp(); flash('#fff', .25); fxAdd(res.rank.c === 'S' ? 'confetti' : 'burst', { palette: res.rank.c === 'S' ? YEL : RED }); } });
  gsap.fromTo('#rRank', { scale: .5, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, delay: .15, ease: 'back.out(2.5)' });
  loadRank().then(() => { if (!RANK) return; const t = RANK.tot || 0, c = RANK.cls; if (!t) { $('rAll').textContent = 'みんなの割合：まだ合格者がいません'; return; } $('rAll').innerHTML = 'みんなの割合：' + ['S', 'A', 'B', 'C'].map(k => { const p = (c[k] / t * 100).toFixed(1); return k === res.rank.c ? `<b>${k}級 ${p}%</b>` : `${k}級 ${p}%`; }).join('・') + `（合格者${t.toLocaleString()}人）`; }).catch(() => { $('rAll').textContent = 'みんなの割合：いまは読みこめません'; });
}
// ---------- 封筒（横にスライドして封を切り、合格通知書を取り出す） ----------
function envelope(res, done) {
  show(null); ST = 'env';
  const E = $('env'), box = $('envBox'), tr = $('envTrail'), tip = $('envTip'), top = $('envTop'), let_ = $('envLetter');
  $('envWho').textContent = (res.temp ? '名無しの受験者' : res.name) + ' 殿';
  gsap.set([top, let_, box, tr, tip], { clearProps: 'all' }); tr.style.width = '0'; $('envHint').style.visibility = 'visible'; $('envHint').textContent = '横にスライドして、封を切れ';
  E.hidden = false;
  gsap.fromTo(box, { y: innerHeight * .7, rotate: -18, scale: .6 }, { y: 0, rotate: 0, scale: 1, duration: .7, ease: 'back.out(1.4)', onComplete: () => { sfx.hit(); if (!cut) gsap.to(box, { y: -8, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1 }); } });
  let id = null, x0 = 0, dir = 0, prog = 0, lastTick = 0, cut = false;
  const bw = () => box.getBoundingClientRect().width;
  const paint = () => { const w = prog * 100; tr.style.width = w + '%'; if (dir < 0) { tr.style.left = 'auto'; tr.style.right = '0'; tip.style.left = (100 - w) + '%'; } else { tr.style.right = 'auto'; tr.style.left = '0'; tip.style.left = w + '%'; } tip.style.opacity = prog > 0 && prog < 1 ? 1 : 0; };
  const down = e => { if (cut || id !== null) return; id = e.pointerId; x0 = e.clientX; dir = 0; prog = 0; paint(); ac(); };
  const move = e => {
    if (cut || e.pointerId !== id) return; const dx = e.clientX - x0;
    if (!dir && Math.abs(dx) > 8) dir = dx > 0 ? 1 : -1;
    if (!dir) return; const p = Math.max(0, Math.min(1, dx * dir / (bw() * .8)));
    if (p > prog) { prog = p; paint(); if (prog - lastTick > .08) { lastTick = prog; tone(900 + prog * 900, .03, 'square', .03); } }
    if (prog >= 1) finish();
  };
  const up = e => { if (cut || e.pointerId !== id) return; id = null; if (prog < 1) { const o = { p: prog }; gsap.to(o, { p: 0, duration: .25, onUpdate: () => { prog = o.p; paint(); } }); lastTick = 0; } };
  E.addEventListener('pointerdown', down); addEventListener('pointermove', move); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  function finish() {
    cut = true; removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); E.removeEventListener('pointerdown', down);
    $('envHint').style.visibility = 'hidden'; tip.style.opacity = 0; gsap.killTweensOf(box, 'y'); sfx.stamp(); flash('#fff', .5); fxAdd('burst', { palette: YEL, y: 62 });
    const tl = gsap.timeline();
    tl.to(top, { y: -160, x: dir * 90, rotate: dir * 28, opacity: 0, duration: .55, ease: 'power2.in' }, 0)
      .to(tr, { opacity: 0, duration: .3 }, 0)
      .to(let_, { y: -box.getBoundingClientRect().height * .78, duration: .7, ease: 'power3.out' }, .45)
      .add(() => sfx.ok(), .5)
      .to(box, { scale: 1.25, duration: .35, ease: 'power2.in' }, 1.45)
      .to(E, { opacity: 0, duration: .3 }, 1.6)
      .add(() => { E.hidden = true; E.style.opacity = ''; ST = 'result'; done(); }, 1.9);
  }
}

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
$('again').onclick = () => toTitle();
$('rankBtn2').onclick = () => openRank('result');

// ---------- 画像とXに投稿 ----------
let POST = '', QUOTE = {};
fetch('https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/xquote/g/hero.json').then(r => r.json()).then(d => { if (d && typeof d === 'object') QUOTE = d; }).catch(() => { });
function quoteURL() { const u = QUOTE.ja || ''; return /^https:\/\/x\.com\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}$/.test(u) ? u : ''; }
function postText(r) {
  const head = r.temp ? `ヒーロー試験（仮試験）の結果は【${rkTxt(r.rank)}】相当…` : `ヒーロー協会から【${rkTxt(r.rank)}】に認定された！\n${r.name}（ヒーローネーム：${r.hero}）`;
  return `${head}\n合計${r.total}点（体力${r.phys}・筆記${r.writ}）\n#趣味でヒーローになる #ブラウザゲーム\nhttps://nasubi-no-oniwa.com/hero/`;
}
async function makeCard(r) {
  try { await document.fonts.ready; } catch (e) { }
  const S = 1080, c = document.createElement('canvas'); c.width = c.height = S; const x = c.getContext('2d');
  const M = '"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP",serif', G = '"Hiragino Sans","Noto Sans JP",sans-serif';
  x.fillStyle = '#1b2140'; x.fillRect(0, 0, S, S); x.fillStyle = '#f6f1e3'; x.fillRect(60, 60, S - 120, S - 120);
  x.strokeStyle = '#8a6a2a'; x.lineWidth = 6; x.strokeRect(84, 84, S - 168, S - 168); x.lineWidth = 2; x.strokeRect(96, 96, S - 192, S - 192);
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#6b5a3a'; x.font = `700 30px ${G}`; x.fillText('ヒ ー ロ ー 協 会', S / 2, 160);
  x.fillStyle = '#1d1a14'; x.font = `900 84px ${M}`; x.fillText('合 格 通 知 書', S / 2, 250);
  x.font = `900 52px ${G}`; x.fillText(r.temp ? '名無しの受験者 殿' : `${r.name} 殿`, S / 2, 370, S - 260);
  if (!r.temp) { x.fillStyle = '#6b5a3a'; x.font = `700 34px ${G}`; x.fillText(`ヒーローネーム「${r.hero}」`, S / 2, 430, S - 260); }
  x.fillStyle = '#1d1a14'; x.font = `700 34px ${M}`; x.fillText('あなたを下記のヒーローとして認定します', S / 2, 510);
  x.fillStyle = r.rank.c === 'S' ? '#2b2205' : '#1d1a14'; x.fillRect(S / 2 - 300, 560, 600, 170); x.fillStyle = r.rank.c === 'S' ? '#ffd21f' : '#fff'; x.font = `900 120px ${G}`; x.fillText(rkTxt(r.rank), S / 2, 650);
  x.fillStyle = '#1d1a14'; x.font = `800 38px ${G}`; x.fillText(`合計 ${r.total} / 150点（体力 ${r.phys}・筆記 ${r.writ}）`, S / 2, 790);
  if (r.temp) { x.fillStyle = '#e8322a'; x.font = `900 32px ${G}`; x.fillText('※仮試験', S / 2, 845); }
  x.save(); x.translate(S - 220, 300); x.rotate(-.25); x.strokeStyle = '#d22'; x.lineWidth = 8; x.beginPath(); x.arc(0, 0, 80, 0, 7); x.stroke(); x.fillStyle = '#d22'; x.font = `900 30px ${M}`; x.fillText('ヒーロー', 0, -30); x.fillText('協会', 0, 6); x.fillText('認定', 0, 42); x.restore();
  x.fillStyle = '#e8322a'; x.font = `900 40px ${G}`; x.fillText('趣味でヒーローになる', S / 2, S - 180);
  x.fillStyle = '#6b5a3a'; x.font = '600 28px ui-monospace,Menlo,monospace'; x.fillText('nasubi-no-oniwa.com/hero', S / 2, S - 132);
  x.fillStyle = '#9a8f78'; x.font = `500 20px ${G}`; x.fillText('※非公式のファン作品です', S / 2, S - 100);
  return await new Promise(res => c.toBlob(b => res(b), 'image/png'));
}
const cardFile = b => new File([b], 'hero.png', { type: 'image/png' });
function saveBlob(b) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'hero.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); }
$('xBtn').addEventListener('click', async () => {
  const R = LAST; if (!R) return; const q = quoteURL(); let b = null; try { b = await R.card; } catch (e) { }
  if (b && IS_PHONE && navigator.canShare) { const f = cardFile(b); try { if (navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: POST + (q ? '\n' + q : '') }); try { if (typeof gtag === 'function') gtag('event', 'x_share', { game: 'hero', via: 'sheet' }); } catch (e) { } return; } } catch (e) { if (e && e.name === 'AbortError') return; } }
  let how = 0; if (b) { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]); how = 1; } catch (e) { if (!IS_PHONE) { try { saveBlob(b); how = 2; } catch (_) { } } } }
  if (how) toast(how === 1 ? '画像をコピーしました。投稿の画面で貼りつけてください' : '画像を保存しました。投稿にそえてください');
  const u = 'https://x.com/intent/post?text=' + encodeURIComponent(POST) + (q ? '&url=' + encodeURIComponent(q) : ''); const w = window.open(u, '_blank'); if (!w) location.href = u;
});
$('imgBtn').addEventListener('click', async () => {
  const R = LAST; if (!R) return; let b = null; try { b = await R.card; } catch (e) { } if (!b) return; const f = cardFile(b);
  try { if (IS_PHONE && navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  saveBlob(b);
});

// ---------- ランキング ----------
let RK_AT = 0, TAB = 'S';
async function loadRank(force) { if (!force && RANK && Date.now() - RK_AT < 20000) return RANK; RANK = await api('rank'); RK_AT = Date.now(); return RANK; }
const RANGE = { S: [150, 140], A: [139, 120], B: [119, 80], C: [79, 0] };
function myBest() { return (MINE || []).map(m => m.best).filter(b => b != null); }
function drawRank() {
  document.querySelectorAll('#rkTabs button').forEach(b => b.classList.toggle('on', b.dataset.c === TAB));
  if (!RANK) return; const [hi, lo] = RANGE[TAB], mb = myBest(); let h = '';
  for (let s = hi; s >= lo; s--) {
    const e = RANK.by[s], r = s >= 140 ? 151 - s : s >= 120 ? 140 - s : s >= 80 ? 120 - s : 80 - s;
    const w = !e ? '<div class="w e">空席</div>' : e.n === 1 ? `<div class="w"><b>${esc(e.name)}</b><small>${esc(e.hero)}</small></div>` : `<div class="w m">${e.n}人</div>`;
    h += `<li class="${mb.includes(s) ? 'me' : ''}"><div class="p"><b>${r}位</b><small>${s}点</small></div>${w}</li>`;
  }
  $('rkList').innerHTML = h;
}
async function openRank(from) {
  BACK = from || 'title'; show('rank'); ST = 'rank'; $('rkShare').textContent = '読みこみ中…'; $('rkList').innerHTML = '';
  const mb = myBest(); TAB = mb.length ? (Math.max(...mb) >= 140 ? 'S' : Math.max(...mb) >= 120 ? 'A' : Math.max(...mb) >= 80 ? 'B' : 'C') : 'S';
  if (LAST && !LAST.temp) TAB = LAST.bestRank ? LAST.bestRank.c : LAST.rank.c;
  try {
    await loadRank(true); const t = RANK.tot, c = RANK.cls;
    $('rkShare').innerHTML = t ? `合格者 <b>${t.toLocaleString()}人</b>　` + ['S', 'A', 'B', 'C'].map(k => `${k}級 ${(c[k] / t * 100).toFixed(1)}%`).join('・') + '<br>同じ点数は同じ順位。1人だけの順位は名前を表示。' : 'まだ合格者がいません。最初のヒーローになろう。';
    drawRank();
  } catch (e) { $('rkShare').textContent = 'いまは読みこめません'; }
}
document.querySelectorAll('#rkTabs button').forEach(b => b.onclick = () => { TAB = b.dataset.c; drawRank(); $('rank').scrollTop = 0; });
$('rkBack').onclick = () => { if (BACK === 'result' && LAST) { show('result'); ST = 'result'; } else toTitle(); };
$('rankBtn').onclick = () => openRank('title');

// ---------- 合言葉で復活 ----------
$('recBtn').onclick = () => { show('recov'); ST = 'recov'; $('rcIn').value = ''; $('rcNote').textContent = ''; $('rcNote').className = 'note'; };
$('rcBack').onclick = () => toTitle();
$('rcGo').onclick = async () => {
  $('rcGo').disabled = true;
  try { const j = await api('recover', { code: $('rcIn').value }); toast(`復活しました：${j.name}（${j.hero}）`); ls.set('hero_last', { n: j.name, h: j.hero }); await toTitle(); $('nm').value = j.name; $('hn').value = j.hero; }
  catch (e) { $('rcNote').textContent = e.code === 'code' ? '合言葉がちがいます' : errMsg(e); $('rcNote').className = 'note err'; }
  $('rcGo').disabled = false;
};

// ---------- タイトル ----------
let MINE = [];
async function loadMine() {
  try { const j = await api('me'); MINE = j.list || []; } catch (e) { MINE = []; }
  $('mine').innerHTML = MINE.length ? MINE.slice(0, 6).map((m, i) => `<button data-i="${i}">${esc(m.name)}／${esc(m.hero)}${m.best != null ? `（${m.best}点）` : ''}</button>`).join('') : '';
  $('mine').querySelectorAll('button').forEach(b => b.onclick = () => { const m = MINE[+b.dataset.i]; $('nm').value = m.name; $('hn').value = m.hero; $('tNote').textContent = ''; });
}
async function toTitle() {
  ST = 'title'; unwake(); pc.hidden = true; $('hud').hidden = true; $('hint').hidden = true; SID = ''; QNOW = null;
  $('tNote').textContent = ''; $('tNote').className = 'note'; show('title'); await loadMine();
}
async function begin(mode) {
  ac(); const n = $('nm').value.trim(), h = $('hn').value.trim();
  if (mode === 'main' && (!n || !h)) { $('tNote').textContent = ERRMSG.empty; $('tNote').className = 'note err'; return; }
  $('mainBtn').disabled = $('tempBtn').disabled = true; $('tNote').textContent = '受付中…'; $('tNote').className = 'note';
  try {
    const j = await api('start', mode === 'main' ? { mode, name: n, hero: h } : { mode: 'temp' });
    SID = j.sid; MODE = mode; if (j.pass) PASS = j.pass; ls.set('hero_last', mode === 'main' ? { n, h } : ls.get('hero_last', null));
    try { if (typeof gtag === 'function') gtag('event', 'game_start', { game: 'hero', mode }); } catch (e) { }
    startPhys();
  } catch (e) { $('tNote').textContent = errMsg(e); $('tNote').className = 'note err'; sfx.bad(); }
  $('mainBtn').disabled = $('tempBtn').disabled = false;
}
$('mainBtn').onclick = () => begin('main');
$('tempBtn').onclick = () => begin('temp');
$('hn').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); begin('main'); } });
$('nm').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('hn').focus(); } });

// ---------- 起動 ----------
drawBg(); setSnd();
const lst = ls.get('hero_last', null); if (lst) { $('nm').value = lst.n || ''; $('hn').value = lst.h || ''; }
$('load').hidden = true; toTitle();
if (DEV) window.__H = { result, showQ, runEvent, get ST() { return ST; }, set PH(v) { PH = v; }, openRank, MAKE, get EV() { return EV; }, brief, set EVI(v) { EVI = v; }, show, endEvent };
