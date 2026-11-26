// 懸賞🍆のPV（縦 1080×1920・20秒）。?pv=1 のときだけ読みこむ。window.__pv(t) で t 秒目の絵を描く
export function run(K) {
  const W = 1080, H = 1920, c = document.createElement('canvas'); c.width = W; c.height = H; c.style.cssText = 'display:block;width:540px;height:960px'; document.body.appendChild(c);
  const x = c.getContext('2d'), J = K.SERIF.ja, N = K.NUMF;
  K.setLang('ja');
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), seg = (t, a, b) => cl((t - a) / (b - a)), eo = p => 1 - Math.pow(1 - p, 3), eb = p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
  // 顔の絵（PV用の似顔絵）
  const face = document.createElement('canvas'); face.width = 600; face.height = 520; { const f = face.getContext('2d'); f.fillStyle = '#6aa0d8'; f.fillRect(0, 0, 600, 520); f.fillStyle = '#2b2b38'; f.beginPath(); f.ellipse(300, 210, 175, 150, 0, Math.PI, 0); f.fill(); f.fillStyle = '#f2c9a5'; f.beginPath(); f.ellipse(300, 260, 150, 175, 0, 0, Math.PI * 2); f.fill(); f.fillStyle = '#2b2b38'; f.beginPath(); f.ellipse(300, 150, 160, 70, 0, Math.PI, 0); f.fill(); f.fillStyle = '#222'; f.beginPath(); f.arc(245, 255, 16, 0, 7); f.arc(355, 255, 16, 0, 7); f.fill(); f.strokeStyle = '#a33'; f.lineWidth = 9; f.beginPath(); f.arc(300, 320, 50, .2, Math.PI - .2); f.stroke(); f.fillStyle = '#3c6fa8'; f.fillRect(120, 440, 360, 80); }
  const PH1 = { img: face, s: 1, x: 0, y: 0 };
  const P = (name, ph, o) => { const R = K.judge(name); return { R, a: K.drawPoster(R, ph, Object.assign({ amount: false, stamp: false }, o || {})), b: K.drawPoster(R, ph, o || {}) }; };
  const A = P('たなか', PH1, { no: 1024 }), B = P('ルフィ', null, { no: 5000 });
  const TEAM = ['たなか', 'さとう', 'ゾロ', 'すずき', 'ナミ'].map((n, i) => P(n, i === 0 ? PH1 : null, { no: 1024 + i }));
  const LANGP = ['ja', 'en', 'zh', 'ko'].map(l => { K.setLang(l); const r = K.drawPoster(K.judge('Luffy'), null, { no: 5000 }); return r; }); K.setLang('ja');
  const total = TEAM.reduce((a, t) => a + (t.R.b || 0), 0);
  function bg() { const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a2716'); g.addColorStop(1, '#120b06'); x.fillStyle = g; x.fillRect(0, 0, W, H); x.fillStyle = '#00000035'; for (let px = 0; px < W; px += 135) x.fillRect(px, 0, 4, H); }
  function cap(s, y, size, a, col) { if (a <= 0) return; x.save(); x.globalAlpha = a; x.fillStyle = col || '#f3e3b8'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 ' + size + 'px ' + J; x.shadowColor = '#000c'; x.shadowBlur = 18; x.fillText(s, W / 2, y + (1 - a) * 30); x.restore(); }
  function poster(cv, cx, cy, w, rot, a) { if (a <= 0) return; const h = w * K.PH / K.PW; x.save(); x.globalAlpha = a; x.translate(cx, cy); x.rotate(rot || 0); x.shadowColor = '#000b'; x.shadowBlur = 40; x.shadowOffsetY = 18; x.drawImage(cv, -w / 2, -h / 2, w, h); x.restore(); }
  function rollOn(R, cx, cy, w, p, black) { // 手配書の金額の場所に、回っている数字を描く
    const s = w / K.PW, h = w * K.PH / K.PW, v = R.b == null ? 0 : Math.round(R.b * p * p / 1e5) * 1e5, txt = K.digits(p >= 1 ? R.b : v) + '-';
    x.save(); x.translate(cx - w / 2, cy - h / 2); x.scale(s, s); x.font = '900 92px ' + N; let f = 92; while (x.measureText(txt).width > 560 && f > 20) { f -= 2; x.font = '900 ' + f + 'px ' + N; }
    const tw = x.measureText(txt).width, ic = f * 1.05, sx = K.PW / 2 - (tw + ic + 10) / 2; K.nasu(x, sx + ic / 2, 1000 - f * .36, ic); x.fillStyle = black ? '#e2c26a' : '#2a1a0c'; x.textAlign = 'left'; x.fillText(txt, sx + ic + 10, 1000); x.restore();
  }
  function stampAt(cx, cy, w, p) { if (p <= 0) return; const s = w / K.PW, h = w * K.PH / K.PW, k = 1 + 2.2 * (1 - eo(p)); x.save(); x.translate(cx - w / 2 + 682 * s, cy - h / 2 + 1046 * s); x.scale(k * s, k * s); x.rotate(-.24); x.globalAlpha = cl(p * 3); x.strokeStyle = '#b3241a'; x.fillStyle = '#b3241a'; x.lineWidth = 6; x.beginPath(); x.arc(0, 0, 50, 0, 7); x.stroke(); x.lineWidth = 2; x.beginPath(); x.arc(0, 0, 42, 0, 7); x.stroke(); x.font = '900 52px ' + J; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('茄', 0, 3); x.restore(); }
  function confetti(t0, t) { const d = t - t0; if (d < 0 || d > 2) return; const r = K.rng(77); for (let i = 0; i < 140; i++) { const a = r() * Math.PI * 2, sp = 300 + r() * 900, px = W / 2 + Math.cos(a) * sp * d, py = 900 + Math.sin(a) * sp * d + 600 * d * d; x.fillStyle = ['#f0b040', '#ffe08a', '#c8701e', '#ffffff', '#8d4fc4'][i % 5]; x.globalAlpha = cl(1 - d / 2); x.fillRect(px, py, 14, 14); } x.globalAlpha = 1; }
  function typeBox(s, n, a) { if (a <= 0) return; x.save(); x.globalAlpha = a; x.fillStyle = '#fbf3dc'; x.strokeStyle = '#6b4a22'; x.lineWidth = 6; x.beginPath(); x.roundRect(190, 1660, 700, 130, 18); x.fill(); x.stroke(); x.fillStyle = '#2a1a0c'; x.font = '900 70px ' + J; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText([...s].slice(0, n).join('') + (n < [...s].length || Math.floor(performance.now() / 400) % 2 ? '' : ''), W / 2, 1727); x.restore(); }
  window.__pv = t => {
    bg();
    // 1：つかみ（0〜2.4秒）
    if (t < 2.6) { const a = seg(t, .1, .6) * (1 - seg(t, 2.2, 2.6)); cap('あなたの首には', 700, 96, a); cap('いくらの', 840, 96, seg(t, .5, 1) * (1 - seg(t, 2.2, 2.6))); const k = eb(seg(t, .9, 1.4)); if (k > 0) { x.save(); x.globalAlpha = 1 - seg(t, 2.2, 2.6); K.nasu(x, W / 2 - 190, 1040, 200 * k); x.restore(); } x.save(); x.translate(90, 0); cap('がかかる？', 1060, 96, seg(t, 1.1, 1.6) * (1 - seg(t, 2.2, 2.6))); x.restore(); }
    // 2：名前を入れるだけ（2.4〜7.2秒）
    else if (t < 7.2) { const s = 'たなか', n = Math.floor(seg(t, 2.6, 3.3) * 3.99); cap('名前を入れるだけ', 130, 84, seg(t, 2.5, 2.9)); typeBox(s, n, seg(t, 2.5, 2.8) * (1 - seg(t, 6.9, 7.2)));
      const d = seg(t, 3.4, 3.9), w = 820, cy = 840 - (1 - eb(d)) * 1400; poster(seg(t, 5.5, 5.8) > 0 && t > 5.75 ? A.b : A.a, W / 2, cy, w, -.02 * (1 - d), d > 0 ? 1 : 0);
      if (t > 3.9 && t < 5.75) rollOn(A.R, W / 2, cy, w, eo(seg(t, 3.9, 5.5)), false); if (t >= 5.5 && t < 5.75) stampAt(W / 2, cy, w, seg(t, 5.5, 5.75));
      cap('懸賞金 ' + K.amtWord(A.R.b) + '🍆', 1500, 72, seg(t, 5.9, 6.3), '#ffe08a'); cap('同じ名前なら いつも同じ額', 1500 + 0, 0, 0); }
    // 3：ワンピースのキャラなら作中の額（7.2〜11.2秒）
    else if (t < 11.2) { cap('キャラの名前なら', 130, 76, seg(t, 7.3, 7.7)); cap('作中の額（ベリー→🍆）', 230, 62, seg(t, 7.5, 7.9), '#ffe08a'); typeBox('ルフィ', Math.floor(seg(t, 7.4, 8) * 3.99), seg(t, 7.3, 7.5) * (1 - seg(t, 10.9, 11.2)));
      const d = seg(t, 8.1, 8.6), w = 820, cy = 950 - (1 - eb(d)) * 1400, shake = t > 9.6 && t < 10 ? Math.sin(t * 90) * 14 * (10 - t) : 0; poster(t > 9.65 ? B.b : B.a, W / 2 + shake, cy, w, 0, d > 0 ? 1 : 0);
      if (t > 8.6 && t < 9.65) rollOn(B.R, W / 2, cy, w, eo(seg(t, 8.6, 9.4)), true); if (t >= 9.4 && t < 9.65) stampAt(W / 2, cy, w, seg(t, 9.4, 9.65)); confetti(9.65, t); }
    // 4：一味の手配書（11.2〜15秒）
    else if (t < 15) { cap('仲間の名前も入れて', 170, 80, seg(t, 11.3, 11.7)); cap('一味の名前をつけて並べる（5人まで）', 280, 60, seg(t, 11.5, 11.9), '#ffe08a');
      const w = 330, pos = [[200, 640], [540, 620], [880, 640], [370, 1100], [710, 1100]]; TEAM.forEach((p, i) => { const d = seg(t, 11.7 + i * .45, 12.05 + i * .45); if (d <= 0) return; poster(p.b, pos[i][0], pos[i][1] - (1 - eb(d)) * 300, w * (0.6 + 0.4 * eb(d)), (i % 2 ? .04 : -.04), cl(d * 2)); });
      const v = Math.round(total * eo(seg(t, 13.4, 14.4)) / 1e5) * 1e5; if (t > 13.3) { cap('なすびの一味', 1400, 64, seg(t, 13.1, 13.4), '#efe0b6'); cap('懸賞金 総額', 1480, 52, seg(t, 13.3, 13.6)); cap(K.digits(v) + '🍆', 1570, 92, seg(t, 13.3, 13.6), '#ffe08a'); } }
    // 5：4言語（15〜17.4秒）
    else if (t < 17.4) { const i = Math.min(3, Math.floor((t - 15) / .55)); cap('日本語・英語・中国語・韓国語', 200, 64, seg(t, 15, 15.3)); poster(LANGP[i], W / 2, 960, 820, 0, 1); cap(['日本語', 'English', '中文', '한국어'][i], 1640, 76, 1, '#ffe08a'); }
    // 6：しめ（17.4〜20秒）
    else { const a = seg(t, 17.4, 17.9); x.save(); x.globalAlpha = a; x.fillStyle = '#efe0b6'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 230px ' + J; x.shadowColor = '#000'; x.shadowBlur = 24; x.fillText('懸賞', W / 2 - 110, 820); x.restore(); const k = eb(seg(t, 17.7, 18.2)); if (k > 0) K.nasu(x, W / 2 + 270, 800, 260 * k); cap('名前で決まる、あなたの懸賞金', 1040, 62, seg(t, 18, 18.4)); cap('無料・登録なし', 1160, 58, seg(t, 18.2, 18.6), '#ffe08a'); cap('nasubi-no-oniwa.com/kensho', 1300, 50, seg(t, 18.4, 18.8)); }
    return true;
  };
  window.__pvReady = true;
}
