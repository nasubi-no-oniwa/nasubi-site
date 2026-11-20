// =============================================
//  漢ノ字  画像（SNSに貼る 1200×675）
//  ・結果画像：左に決着の一撃、右に勝ち名乗り（地元の最強と同じ作り）
//  ・挑戦状の画像：作った形を大きく、合言葉と強さ
// =============================================
(function () {
  const OK = window.OK, R = OK.R;
  const W = 1200, H = 675, LW = 700, RX = 935;
  const F_BIG = '"Dela Gothic One", sans-serif', F_FUDE = '"Yuji Syuku", serif', F_UI = '"M PLUS Rounded 1c", sans-serif';
  const sum = st => st.hp + st.atk + st.def + st.shp + st.spd;

  // 自慢の一言
  OK.resultTags = function (r, w0, w1) {
    const out = [];
    if (r.winner < 0) { if (r.endBy === 'time') out.push({ t: '時間切れ判定' }); return out; }
    const w = r.winner ? w1 : w0, l = r.winner ? w0 : w1, wr = r.winner ? r.rb : r.ra;
    if (sum(l.st) - sum(w.st) >= 60) out.push({ t: '下剋上！', gold: true });
    if (r.endBy === 'break' && r.hitN === 1) out.push({ t: '一撃！', gold: true });
    if (w.ch === l.ch) out.push({ t: '同じ字対決' });
    if (l.orig && !w.orig) out.push({ t: '手本を超えた' });
    if (w.hw && w.j.rep >= 95) out.push({ t: OK.repTitle(w) + 'の一筆', gold: true });
    if (w.hw && !l.hw && !l.orig) out.push({ t: '手書きが組み替えを破る' });
    if ((w.nref || w.prep.length) < (l.nref || l.prep.length) - 8) out.push({ t: '画数の差をはね返した', gold: true });
    if (r.endBy === 'break' && wr < 0.45) out.push({ t: 'ギリギリの勝ち' });
    if (r.endBy === 'time') out.push({ t: '時間切れ判定' });
    return out.slice(0, 2);
  };
  OK.whoOf = w => (OK.Works && OK.Works.nameOf(w.s)) || (OK.Chal && OK.Chal.names[w.s]) || '';
  OK.workName = w => { const n = OK.whoOf(w); return (n ? n + 'の' : '') + '「' + w.ch + '」' + (w.orig ? '（手本）' : ''); };

  async function fontsReady() {
    if (!document.fonts || !document.fonts.load) return;
    const wait = Promise.all([
      document.fonts.load('400 80px "Dela Gothic One"', '字力勝ち0123456789%/'),
      document.fonts.load('400 60px "Yuji Syuku"', '字力勝負ありの勝ち！引き分け挑戦状書作神筆達師範有段者習中くせ解読不能手本組み替え'),
      document.fonts.load('800 20px "M PLUS Rounded 1c"', 'のこり破る合言葉'),
    ]);
    await Promise.race([wait, new Promise(r => setTimeout(r, 2500))]).catch(() => {});
  }
  function logo(c, x, y, size) {
    c.save(); c.textAlign = 'left'; c.textBaseline = 'middle'; c.font = `400 ${size}px ${F_FUDE}`;
    c.lineWidth = Math.max(4, size * 0.14); c.strokeStyle = 'rgba(15,11,8,.85)'; c.lineJoin = 'round';
    c.strokeText('字力', x, y); c.fillStyle = '#fff'; c.fillText('字', x, y);
    const a = c.measureText('字').width; c.fillStyle = '#e8462f'; c.fillText('力', x + a, y);
    c.restore();
  }
  // 再現度の称号
  OK.repTitle = function (w) {
    if (!w.hw) return w.orig ? '手本' : '組み替え';
    const r = w.j.rep;
    return r >= 98 ? '神筆' : r >= 95 ? '達筆' : r >= 90 ? '師範' : r >= 80 ? '有段者' : r >= 70 ? '習字中' : r >= 50 ? 'くせ字' : '解読不能';
  };
  // 総合パワーの格（枠の色）
  OK.grade = function (t) {
    return t >= 420 ? { k: 'gold', n: '金', a: '#fff3b0', b: '#e0a81e', c: '#8a5a00' } : t >= 340 ? { k: 'silver', n: '銀', a: '#ffffff', b: '#b9c2cc', c: '#5b6470' } : t >= 260 ? { k: 'bronze', n: '銅', a: '#ffd9b0', b: '#c8793a', c: '#6a3410' } : { k: 'ink', n: '墨', a: '#d8c6a4', b: '#8a7860', c: '#3a2e22' };
  };
  // 大きな字（作品の元の字）を、はんこのように
  function bigChar(c, ch, x, y, s, col) {
    c.save(); c.font = `400 ${s}px ${F_FUDE}, ${F_BIG}, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineJoin = 'round'; c.lineWidth = Math.max(6, s * 0.08); c.strokeStyle = '#3a0c06'; c.strokeText(ch, x, y);
    const gr = c.createLinearGradient(0, y - s / 2, 0, y + s / 2); gr.addColorStop(0, '#fff6d8'); gr.addColorStop(1, col || '#ffcf3a'); c.fillStyle = gr; c.fillText(ch, x, y);
    c.restore();
  }

  // ---------- 結果画像 ----------
  // o：{ m, r, w:[w0,w1], chal, url }
  OK.drawResultImage = async function (cv, o) {
    await fontsReady();
    const c = cv.getContext('2d'), { m, r } = o, [w0, w1] = o.w;
    c.setTransform(1, 0, 0, 1, 0, 0); c.textBaseline = 'middle';
    c.fillStyle = '#120e0b'; c.fillRect(0, 0, W, H);
    const SNAP = 900;
    let snap = null; try { snap = R.snapshot(m, SNAP, r.endBy === 'break' ? r.lastEv : null); } catch (e) { snap = null; }
    const hx = r.endBy === 'break' && r.lastEv ? r.lastEv.x : (m.A.x + m.B.x) / 2, hy = r.endBy === 'break' && r.lastEv ? r.lastEv.y : (m.A.y + m.B.y) / 2;
    const zoom = 1.12, sw = LW / zoom, sh = H / zoom;
    let fx = LW / 2, fy = H / 2;
    c.save(); c.beginPath(); c.rect(0, 0, LW, H); c.clip();
    if (snap) {
      const sc = snap.sc;
      let sx = SNAP / 2 + hx * sc - sw / 2, sy = SNAP / 2 + hy * sc - sh / 2;
      sx = Math.max(0, Math.min(SNAP - sw, sx)); sy = Math.max(0, Math.min(SNAP - sh, sy));
      c.drawImage(snap, sx, sy, sw, sh, 0, 0, LW, H); R.free(snap);
      fx = (SNAP / 2 + hx * sc - sx) * zoom; fy = (SNAP / 2 + hy * sc - sy) * zoom;
    }
    if (r.winner >= 0) {
      c.save(); c.translate(fx, fy); c.globalAlpha = 0.16; c.fillStyle = '#fff';
      for (let i = 0; i < 72; i++) { const an = i / 72 * Math.PI * 2 + (i % 3) * 0.021, r0 = 240 + (i * 37 % 70); c.beginPath(); c.moveTo(Math.cos(an) * r0, Math.sin(an) * r0); c.lineTo(Math.cos(an + 0.011) * 1000, Math.sin(an + 0.011) * 1000); c.lineTo(Math.cos(an - 0.011) * 1000, Math.sin(an - 0.011) * 1000); c.fill(); }
      c.restore();
    }
    const vg = c.createRadialGradient(fx, fy, 170, fx, fy, 600); vg.addColorStop(0, 'rgba(18,14,11,0)'); vg.addColorStop(1, 'rgba(18,14,11,.85)'); c.fillStyle = vg; c.fillRect(0, 0, LW, H);
    const fade = c.createLinearGradient(LW - 230, 0, LW, 0); fade.addColorStop(0, 'rgba(18,14,11,0)'); fade.addColorStop(1, 'rgba(18,14,11,1)'); c.fillStyle = fade; c.fillRect(LW - 230, 0, 230, H);
    c.restore();
    logo(c, 36, 56, 46);
    const draw = r.winner < 0, w = draw ? null : (r.winner ? w1 : w0), l = draw ? null : (r.winner ? w0 : w1);
    // 朱のはんこ
    c.save(); c.translate(1094, 98); c.rotate(0.12);
    c.fillStyle = draw ? '#6a5a4a' : '#c8281c'; c.beginPath(); c.arc(0, 0, 58, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#f6eedb'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 50, 0, Math.PI * 2); c.stroke();
    c.fillStyle = '#f6eedb'; c.textAlign = 'center'; c.font = '400 34px ' + F_FUDE;
    if (draw) { c.fillText('痛み', 0, -16); c.fillText('分け', 0, 22); } else { c.fillText('勝負', 0, -16); c.fillText('あり', 0, 22); }
    c.restore();
    c.textAlign = 'center';
    if (draw) {
      c.font = '400 92px ' + F_FUDE; c.fillStyle = '#fff'; c.fillText('引き分け', RX, 230);
      bigChar(c, w0.ch, RX - 90, 350, 96, '#ff9a7a'); bigChar(c, w1.ch, RX + 90, 350, 96, '#9ac0ff');
      c.font = '400 40px ' + F_FUDE; c.fillStyle = '#d8c6a4'; c.fillText('と', RX, 352);
    } else {
      c.font = '800 22px ' + F_UI; c.fillStyle = '#d8c6a4';
      c.fillText((OK.whoOf(w) ? OK.whoOf(w) + '・' : '') + (w.hw ? '書いた字 再現度' + w.j.rep.toFixed(1) + '%' : w.orig ? '手本の字' : '組み替えた作品') + '・総合' + sum(w.st), RX - 20, 160);
      { const gl = c.createRadialGradient(RX, 248, 10, RX, 248, 250); gl.addColorStop(0, 'rgba(255,190,40,.42)'); gl.addColorStop(0.5, 'rgba(210,48,31,.16)'); gl.addColorStop(1, 'rgba(18,14,11,0)'); c.fillStyle = gl; c.fillRect(LW - 60, 0, W - LW + 60, 520); }
      bigChar(c, w.ch, RX, 248, 168);
      c.font = '400 60px ' + F_FUDE; c.fillStyle = '#fff'; c.fillText('の勝ち！', RX, 350);
      c.font = '800 26px ' + F_UI; c.fillStyle = '#e9dcc0';
      c.fillText(OK.workName(l) + ' を破る', RX, 404);
    }
    const by = 462;
    const bar = (yy, wk, b, side) => {
      const x0 = RX - 210, bw = 420, p = Math.round(b.ratio() * 100);
      c.textAlign = 'left'; c.font = '800 20px ' + F_UI; c.fillStyle = '#efe4cc'; c.fillText(OK.workName(wk), x0, yy);
      { const nw = c.measureText(OK.workName(wk)).width; c.font = '800 15px ' + F_UI; c.fillStyle = '#d8c6a4'; c.fillText('総合' + sum(wk.st) + (wk.hw ? '・' + OK.repTitle(wk) : ''), x0 + nw + 10, yy + 1); }
      c.textAlign = 'right'; c.font = '400 26px ' + F_BIG; c.fillStyle = side === r.winner ? '#ffcf3a' : '#a89c90'; c.fillText(p + '%', x0 + bw, yy);
      c.fillStyle = 'rgba(255,255,255,.13)'; c.fillRect(x0, yy + 18, bw, 10);
      c.fillStyle = R.COL[side].f; c.fillRect(x0, yy + 18, bw * Math.max(0, Math.min(1, b.ratio())), 10);
      c.fillStyle = '#fff'; c.fillRect(x0 + bw * OK.LOSE - 1, yy + 14, 2, 18);
    };
    bar(by, w0, m.A, 0); bar(by + 54, w1, m.B, 1);
    const tags = OK.resultTags(r, w0, w1).slice();
    if (o.chal) tags.push({ t: '挑戦状 ' + OK.Chal.fmt(o.chal.id) });
    let tx = RX - 210, ty = by + 98; c.textAlign = 'left'; c.font = '800 19px ' + F_UI;
    for (const gg of tags) {
      const tw = c.measureText(gg.t).width + 26; if (tx + tw > RX + 215) break;
      c.fillStyle = gg.gold ? '#ffcf3a' : 'rgba(255,255,255,.15)'; c.beginPath(); (c.roundRect ? c.roundRect(tx, ty, tw, 34, 17) : c.rect(tx, ty, tw, 34)); c.fill();
      c.fillStyle = gg.gold ? '#2a211b' : '#efe4cc'; c.fillText(gg.t, tx + 13, ty + 18); tx += tw + 9;
    }
    c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(0, H - 50, W, 50);
    { const G = OK.grade(draw ? 0 : sum(w.st)), fg = c.createLinearGradient(0, 0, W, H); fg.addColorStop(0, G.a); fg.addColorStop(0.5, G.b); fg.addColorStop(1, G.a);
      c.strokeStyle = fg; c.lineWidth = 8; c.beginPath(); if (c.roundRect) c.roundRect(10, 10, W - 20, H - 20, 22); else c.rect(10, 10, W - 20, H - 20); c.stroke(); }
    c.font = '800 18px ' + F_UI; c.fillStyle = '#d8c6a4'; c.textAlign = 'left'; c.fillText('#字力 #ブラウザゲーム', 34, H - 30);
    c.textAlign = 'right'; c.fillText(o.url.replace('https://', '').replace(/\/$/, ''), W - 34, H - 30);
  };

  // ---------- 字力カードの画像（書いた字・強さ・合言葉） ----------
  function rr(c, x, y, w, h, r) { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); }
  // 決まった乱数（同じ作品なら同じ画像になる）
  function rng(seed) { let a = seed >>> 0 || 1; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  OK.drawWorkImage = async function (cv, w, code, url, opt = {}) {
    await fontsReady();
    const c = cv.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.textBaseline = 'middle';
    const tot = OK.SH.total(w.st), G = OK.grade(tot), name = (opt.name != null ? opt.name : (OK.Works && OK.Works.nameOf(w.s))) || '';
    try { if (document.fonts && document.fonts.load) await Promise.race([Promise.all([document.fonts.load('400 40px "Yuji Syuku"', name + w.ch + '書作'), document.fonts.load('800 20px "M PLUS Rounded 1c"', '手本なしで書いたをばらして組み替えた総合パワー体力攻撃防御鋭さ速さ合言葉金銀銅墨の格字力カード白線＝素質' + w.ch)]), new Promise(r => setTimeout(r, 2000))]); } catch (e) {}
    let sd = 7; for (const ch of w.s.slice(0, 200)) sd = (sd * 31 + ch.codePointAt(0)) >>> 0; const rnd = rng(sd);
    // 地：墨色に、朱と金の光
    c.fillStyle = '#120d0a'; c.fillRect(0, 0, W, H);
    let g = c.createRadialGradient(330, 330, 60, 330, 330, 760); g.addColorStop(0, 'rgba(200,52,30,.55)'); g.addColorStop(0.55, 'rgba(90,22,12,.25)'); g.addColorStop(1, 'rgba(18,13,10,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    g = c.createRadialGradient(1010, 150, 20, 1010, 150, 520); g.addColorStop(0, G.k === 'ink' ? 'rgba(216,198,164,.14)' : 'rgba(255,207,58,.22)'); g.addColorStop(1, 'rgba(18,13,10,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    // 放射の線（字の後ろから）
    c.save(); c.translate(330, 338); c.globalAlpha = 0.11; c.fillStyle = G.a;
    for (let i = 0; i < 40; i++) { const an = i / 40 * Math.PI * 2 + rnd() * 0.05, wd = 0.02 + rnd() * 0.035; c.beginPath(); c.moveTo(Math.cos(an) * 250, Math.sin(an) * 250); c.lineTo(Math.cos(an - wd) * 1400, Math.sin(an - wd) * 1400); c.lineTo(Math.cos(an + wd) * 1400, Math.sin(an + wd) * 1400); c.fill(); }
    c.restore();
    // 金の粉
    for (let i = 0; i < 150; i++) { const x = rnd() * W, y = rnd() * H, r = rnd() * 1.9 + 0.3; c.globalAlpha = 0.15 + rnd() * 0.5; c.fillStyle = rnd() < 0.7 ? G.a : '#fff'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
    c.globalAlpha = 1;
    // 半紙（少しかたむける）
    const ps = 548, pcx = 330, pcy = 334;
    c.save(); c.translate(pcx, pcy); c.rotate(-0.035);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 34; c.shadowOffsetY = 14;
    c.fillStyle = '#f7f1e2'; c.fillRect(-ps / 2, -ps / 2, ps, ps); c.shadowColor = 'transparent';
    // 紙の地模様
    for (let i = 0; i < 520; i++) { c.globalAlpha = 0.05 + rnd() * 0.06; c.fillStyle = rnd() < 0.5 ? '#b89a6a' : '#fff'; c.fillRect(-ps / 2 + rnd() * ps, -ps / 2 + rnd() * ps, 1 + rnd() * 9, 1); }
    c.globalAlpha = 1;
    // 方眼と十字
    c.strokeStyle = 'rgba(160,120,80,.2)'; c.lineWidth = 1.4; c.beginPath();
    for (let i = 1; i < 10; i++) { if (i === 5) continue; const v = -ps / 2 + ps * i / 10; c.moveTo(v, -ps / 2); c.lineTo(v, ps / 2); c.moveTo(-ps / 2, v); c.lineTo(ps / 2, v); } c.stroke();
    c.strokeStyle = 'rgba(200,52,30,.5)'; c.lineWidth = 2.4; if (c.setLineDash) c.setLineDash([13, 9]);
    c.beginPath(); c.moveTo(0, -ps / 2); c.lineTo(0, ps / 2); c.moveTo(-ps / 2, 0); c.lineTo(ps / 2, 0); c.stroke(); if (c.setLineDash) c.setLineDash([]);
    c.strokeStyle = 'rgba(200,52,30,.75)'; c.lineWidth = 5; c.strokeRect(-ps / 2 + 3, -ps / 2 + 3, ps - 6, ps - 6);
    // 字（書いた位置と大きさのまま。組み替えは形を大きく）
    if (w.hw) {
      const k = ps / 1000; c.strokeStyle = '#17120e'; c.fillStyle = '#17120e'; c.lineCap = 'round'; c.lineJoin = 'round';
      w.strokes.forEach((st, i) => OK.W.ink(c, st, w.rad[i], k, -ps / 2, -ps / 2));
    } else R.shapeIcon(c, w.b.parts, 0, 0, ps * 0.8, 0, 0, { fill: '#17120e', stroke: '#000', lw: 2 });
    // 手本の字のはんこ（右上）
    c.save(); c.translate(ps / 2 - 52, -ps / 2 + 52); c.rotate(0.06);
    c.fillStyle = '#c8281c'; rr(c, -36, -36, 72, 72, 10); c.fill(); c.strokeStyle = '#f7f1e2'; c.lineWidth = 2.5; rr(c, -30, -30, 60, 60, 7); c.stroke();
    c.fillStyle = '#f7f1e2'; c.font = `400 44px ${F_FUDE}, ${F_BIG}, sans-serif`; c.textAlign = 'center'; c.fillText(w.ch, 0, 3); c.restore();
    // 名前（左下に、筆で）
    if (name) { c.font = `400 30px ${F_FUDE}`; c.textAlign = 'left'; c.fillStyle = 'rgba(40,28,18,.85)'; c.fillText(name + (w.hw ? ' 書' : ' 作'), -ps / 2 + 20, ps / 2 - 30); }
    c.restore();
    // 再現度のはんこ（半紙の右下にかぶせる）
    c.save(); c.translate(pcx + ps / 2 - 30, pcy + ps / 2 - 64); c.rotate(-0.16);
    const R0 = 104;
    c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 18; c.shadowOffsetY = 6;
    c.fillStyle = '#d2301f'; c.beginPath(); c.arc(0, 0, R0, 0, 7); c.fill(); c.shadowColor = 'transparent';
    c.strokeStyle = '#fbeedb'; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, R0 - 11, 0, 7); c.stroke();
    c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, R0 - 18, 0, 7); c.stroke();
    c.fillStyle = '#fbeedb'; c.textAlign = 'center';
    if (w.hw) {
      c.font = '800 21px ' + F_UI; c.fillText('再現度', 0, -52);
      const rp = w.j.rep.toFixed(1); c.font = '400 50px ' + F_BIG; const tw = c.measureText(rp).width; c.font = '400 24px ' + F_BIG; const pw = c.measureText('%').width;
      c.textAlign = 'left'; c.font = '400 50px ' + F_BIG; c.fillText(rp, -(tw + pw + 2) / 2, -6); c.font = '400 24px ' + F_BIG; c.fillText('%', -(tw + pw + 2) / 2 + tw + 2, 2); c.textAlign = 'center';
      c.font = `400 38px ${F_FUDE}`; c.fillText(OK.repTitle(w), 0, 50);
    } else { c.font = `400 50px ${F_FUDE}`; const t = OK.repTitle(w); if (t.length > 2) { c.fillText(t.slice(0, 2), 0, -24); c.fillText(t.slice(2), 0, 32); } else c.fillText(t, 0, 4); }
    c.restore();
    // 右：強さ
    const X0 = 668, X1 = 1152;
    logo(c, X0, 74, 62);
    c.textAlign = 'right'; c.font = '800 20px ' + F_UI; c.fillStyle = '#d8c6a4';
    c.fillText(w.hw ? '手本なしで書いた「' + w.ch + '」' : w.orig ? '手本の「' + w.ch + '」' : '「' + w.ch + '」をばらして組み替えた', X1, 62);
    c.fillText(G.n + 'の格', X1, 90);
    // 総合パワー
    c.textAlign = 'left'; c.font = '800 24px ' + F_UI; c.fillStyle = '#efe4cc'; c.fillText('総合パワー', X0, 140);
    c.font = '400 150px ' + F_BIG; c.lineJoin = 'round';
    const ty = 222, ts = String(tot);
    c.save(); c.shadowColor = G.k === 'ink' ? 'rgba(216,198,164,.5)' : 'rgba(255,190,40,.75)'; c.shadowBlur = 36;
    c.lineWidth = 12; c.strokeStyle = G.c; c.strokeText(ts, X0 - 4, ty); c.restore();
    g = c.createLinearGradient(0, ty - 70, 0, ty + 70); g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, G.a); g.addColorStop(1, G.b); c.fillStyle = g; c.fillText(ts, X0 - 4, ty);
    // 5つの能力
    const by = 322, bh = 47, bx = X0 + 92, bw = 300;
    OK.STATS.forEach((x, i) => {
      const y = by + i * bh, v = w.st[x.k];
      c.textAlign = 'left'; c.font = '800 25px ' + F_UI; c.fillStyle = '#efe4cc'; c.fillText(x.n, X0, y);
      c.fillStyle = 'rgba(255,255,255,.1)'; rr(c, bx, y - 11, bw, 22, 11); c.fill();
      const fw = Math.max(22, bw * Math.min(150, v) / 150);
      g = c.createLinearGradient(bx, 0, bx + bw, 0); g.addColorStop(0, '#d2301f'); g.addColorStop(0.6, '#f08a2a'); g.addColorStop(1, '#ffe27a'); c.fillStyle = g; rr(c, bx, y - 11, fw, 22, 11); c.fill();
      c.fillStyle = 'rgba(255,255,255,.35)'; rr(c, bx + 6, y - 8, Math.max(4, fw - 12), 6, 3); c.fill();
      if (w.hw && w.base) { const mx = bx + bw * Math.min(150, w.base[x.k]) / 150; c.fillStyle = '#fff'; c.fillRect(mx - 1.5, y - 16, 3, 32); }
      c.textAlign = 'right'; c.font = '400 36px ' + F_BIG; c.fillStyle = v >= 120 ? '#ffe27a' : '#fff'; c.fillText(String(v), X1, y + 1);
    });
    // 合言葉
    const cy0 = 560;
    c.strokeStyle = G.b; c.lineWidth = 3; c.fillStyle = 'rgba(0,0,0,.35)'; rr(c, X0, cy0, X1 - X0, 64, 14); c.fill(); c.stroke();
    c.textAlign = 'left'; c.font = '800 20px ' + F_UI; c.fillStyle = '#d8c6a4'; c.fillText(code ? '合言葉' : '字力カード', X0 + 18, cy0 + 33);
    c.textAlign = 'right'; c.font = '400 44px ' + F_BIG; c.fillStyle = '#ffcf3a'; c.fillText(code ? OK.Chal.fmt(code) : (w.hw && w.base ? '白線＝字の素質' : ''), X1 - 18, cy0 + 34);
    if (!code) { c.font = '800 20px ' + F_UI; c.fillStyle = '#d8c6a4'; }
    // 枠
    g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, G.a); g.addColorStop(0.5, G.b); g.addColorStop(1, G.a);
    c.strokeStyle = g; c.lineWidth = 8; rr(c, 10, 10, W - 20, H - 20, 22); c.stroke();
    c.strokeStyle = 'rgba(0,0,0,.55)'; c.lineWidth = 2; rr(c, 17, 17, W - 34, H - 34, 17); c.stroke();
    // 下の帯
    c.font = '800 18px ' + F_UI; c.fillStyle = 'rgba(216,198,164,.9)'; c.textAlign = 'right'; c.fillText('#字力 #ブラウザゲーム', X1, H - 30);
    c.textAlign = 'left'; c.fillText((url || '').replace('https://', '').replace(/\/$/, ''), 60, H - 30);
  };
})();
