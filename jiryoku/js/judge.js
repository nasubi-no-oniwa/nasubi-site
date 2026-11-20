// =============================================
//  字力  書いた字を手本とくらべて「書きの出来」を出す
//  ・座標は 0〜1000 の箱（y は下向き）。箱のまん中（500,500）が十字線
//  ・書いた画は [x,y,t, x,y,t, ...]（t は書きはじめからのミリ秒）
//  ・どの端末でも同じ答えになるよう、四則演算・平方根・atan2 だけで計算する
// =============================================
(function (G) {
  const OK = G.OK = G.JM = G.OK || G.JM || {};
  const JD = OK.JD = {};
  const STEP = 12;   // くらべるときの点の間かく

  // ---------- 下ごしらえ ----------
  // 折れ線 [x,y,x,y,...] を、同じ間かくの点 [[x,y],...] にする
  function resample(xy, step) {
    const out = [[xy[0], xy[1]]]; if (xy.length < 4) return out;
    let px = xy[0], py = xy[1], left = step;
    for (let i = 2; i < xy.length; i += 2) {
      let x = xy[i], y = xy[i + 1], dx = x - px, dy = y - py, d = Math.sqrt(dx * dx + dy * dy);
      while (d >= left) { const f = left / d; px += dx * f; py += dy * f; out.push([px, py]); dx = x - px; dy = y - py; d = Math.sqrt(dx * dx + dy * dy); left = step; }
      left -= d; px = x; py = y;
    }
    const l = out[out.length - 1]; if (l[0] !== px || l[1] !== py) out.push([px, py]);
    return out;
  }
  // 書いた画 [x,y,t,...] → 折れ線 [x,y,...]
  JD.xy = s => { const o = []; for (let i = 0; i < s.length; i += 3) o.push(s[i], s[i + 1]); return o; };
  const lenOf = xy => { let L = 0; for (let i = 2; i < xy.length; i += 2) L += Math.sqrt((xy[i] - xy[i - 2]) ** 2 + (xy[i + 1] - xy[i - 1]) ** 2); return L; };
  function bbox(strokes) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const s of strokes) for (let i = 0; i < s.length; i += 2) { if (s[i] < x0) x0 = s[i]; if (s[i] > x1) x1 = s[i]; if (s[i + 1] < y0) y0 = s[i + 1]; if (s[i + 1] > y1) y1 = s[i + 1]; }
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
  }
  // 線の重心（長さで重みづけ）
  function centroid(strokes) {
    let sx = 0, sy = 0, sw = 0;
    for (const s of strokes) {
      if (s.length === 2) { sx += s[0] * 4; sy += s[1] * 4; sw += 4; continue; }
      for (let i = 2; i < s.length; i += 2) { const l = Math.sqrt((s[i] - s[i - 2]) ** 2 + (s[i + 1] - s[i - 1]) ** 2); sx += (s[i] + s[i - 2]) / 2 * l; sy += (s[i + 1] + s[i - 1]) / 2 * l; sw += l; }
    }
    return sw > 0 ? [sx / sw, sy / sw] : [500, 500];
  }
  // 位置と大きさをそろえる（外接する箱の中心を原点、長いほうの辺を 800 に）
  function normalize(strokes) {
    const b = bbox(strokes), k = 800 / Math.max(b.w, b.h, 60);
    return strokes.map(s => s.map((v, i) => (v - (i % 2 ? b.cy : b.cx)) * k));
  }
  const pts = (strokes, step) => { const o = []; for (const s of strokes) for (const p of resample(s, step)) o.push(p); return o; };
  // かたよりのない平均距離（A→B と B→A）
  function chamfer(A, B) {
    const one = (P, Q) => { let t = 0; for (const p of P) { let m = 1e18; for (const q of Q) { const d = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2; if (d < m) m = d; } t += Math.sqrt(m); } return t / P.length; };
    return (one(A, B) + one(B, A)) / 2;
  }
  // 回転のずれ（書いた点を、近い手本の点に合わせる回転の角度。右上がりが＋）
  function rotation(A, B) {
    let ax = 0, ay = 0, bx = 0, by = 0; for (const p of A) { ax += p[0]; ay += p[1]; } for (const q of B) { bx += q[0]; by += q[1]; }
    ax /= A.length; ay /= A.length; bx /= B.length; by /= B.length;
    let th = 0;
    for (let it = 0; it < 3; it++) {
      const c = Math.cos(th), s = Math.sin(th); let num = 0, den = 0;
      for (const p of A) {
        const x = (p[0] - ax) * c - (p[1] - ay) * s, y = (p[0] - ax) * s + (p[1] - ay) * c;
        let m = 1e18, mq = null; for (const q of B) { const d = (x - (q[0] - bx)) ** 2 + (y - (q[1] - by)) ** 2; if (d < m) { m = d; mq = q; } }
        const qx = mq[0] - bx, qy = mq[1] - by, px = p[0] - ax, py = p[1] - ay;
        num += px * qy - py * qx; den += px * qx + py * qy;
      }
      th = Math.atan2(num, den);
    }
    return th * 180 / Math.PI;   // 画面は y が下向き。書いた字を手本に合わせる回転が時計回り（＋）＝書いた字は反時計回りに傾いている（右上がり）
  }
  // 画どうしのずれ（16点にそろえてくらべる）
  function strokeCost(a, b) {
    const n = 16, A = resampleN(a, n), B = resampleN(b, n); let t = 0;
    for (let i = 0; i < n; i++) t += Math.sqrt((A[i][0] - B[i][0]) ** 2 + (A[i][1] - B[i][1]) ** 2);
    return t / n;
  }
  function resampleN(xy, n) {
    const L = lenOf(xy); if (L <= 0) return Array.from({ length: n }, () => [xy[0], xy[1]]);
    const r = resample(xy, L / (n - 1) * 0.9999); while (r.length < n) r.push(r[r.length - 1]); return r.slice(0, n);
  }
  // なめらかさ：一定の間かくの点で、向きの変わり方のばらつき（角度の2回差）
  function wobble(strokes) {
    let t = 0, n = 0;
    for (const s of strokes) {
      const r = resample(s, 16); if (r.length < 4) continue;
      const ang = []; for (let i = 1; i < r.length; i++) ang.push(Math.atan2(r[i][1] - r[i - 1][1], r[i][0] - r[i - 1][0]));
      const tr = []; for (let i = 1; i < ang.length; i++) { let d = ang[i] - ang[i - 1]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; tr.push(d); }
      for (let i = 1; i < tr.length; i++) { const d = Math.abs(tr[i] - tr[i - 1]); if (d < 1.6) { t += d; n++; } }   // 大きな曲がり角（折れ）は数えない
    }
    return n ? t / n : 0;
  }
  // 画の対応（ハンガリー法・少ない数なので素直に）
  function assign(C) {
    const n = C.length, m = C[0].length, N = Math.max(n, m), INF = 1e15;
    const a = []; for (let i = 0; i < N; i++) { a.push([]); for (let j = 0; j < N; j++) a[i].push(i < n && j < m ? C[i][j] : 1e6); }
    const u = new Array(N + 1).fill(0), v = new Array(N + 1).fill(0), p = new Array(N + 1).fill(0), way = new Array(N + 1).fill(0);
    for (let i = 1; i <= N; i++) {
      p[0] = i; let j0 = 0; const minv = new Array(N + 1).fill(INF), used = new Array(N + 1).fill(false);
      do {
        used[j0] = true; const i0 = p[j0]; let d = INF, j1 = 0;
        for (let j = 1; j <= N; j++) if (!used[j]) { const cur = a[i0 - 1][j - 1] - u[i0] - v[j]; if (cur < minv[j]) { minv[j] = cur; way[j] = j0; } if (minv[j] < d) { d = minv[j]; j1 = j; } }
        for (let j = 0; j <= N; j++) if (used[j]) { u[p[j]] += d; v[j] -= d; } else minv[j] -= d;
        j0 = j1;
      } while (p[j0] !== 0);
      do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
    }
    const res = new Array(n).fill(-1); for (let j = 1; j <= N; j++) if (p[j] - 1 < n && j - 1 < m) res[p[j] - 1] = j - 1;
    return res;
  }

  // ---------- 書き順がわかる字か ----------
  JD.orderable = form => form === 'j' || form === 'c';

  // ---------- 判定 ----------
  // user：書いた画 [[x,y,t,...],...]、ref：手本の画 [[x,y,...],...]（0〜1000）、form：字形の記号
  JD.judge = function (user, ref, form) {
    const U = user.map(JD.xy).filter(s => s.length >= 2), Rf = ref;
    const nu = normalize(U), nr = normalize(Rf);
    const PU = pts(nu, STEP), PR = pts(nr, STEP);
    const d = chamfer(PU, PR);
    // 画の数のちがい
    const dn = Math.abs(U.length - Rf.length);
    // 画ごとの対応のずれ（いちばん合う組み合わせ。余った画は 1本 200 のずれとして数える）
    const C0 = nu.map(a => nr.map(b => strokeCost(a, b)));
    const as0 = assign(C0); let sc = 0, sn = 0;
    for (let i = 0; i < nu.length; i++) if (as0[i] >= 0) { sc += C0[i][as0[i]]; sn++; }
    const sa = (sc + dn * 200) / Math.max(nu.length, nr.length);
    // 再現度（%）：形全体のずれ（d）と、画ごとのずれ（sa）から。ていねいに書けば 90% 台、ちがう字だと 50% を切る
    let rep = 100 - Math.max(0, d - 18) * 0.5 - Math.max(0, sa - 30) * 0.35;
    rep = Math.max(0, Math.min(100, rep));
    // 重心のずれ（箱の％。手本の字そのもののかたよりは引く）
    const cu = centroid(U), cr = centroid(Rf);
    const bu = bbox(U), br = bbox(Rf);
    const offX = (cu[0] - cr[0]) / 10, offY = (cu[1] - cr[1]) / 10;
    // 大きさ（手本に対する、長いほうの辺の比）
    const size = Math.max(bu.w, bu.h, 1) / Math.max(br.w, br.h, 1);
    // 傾き（度。右上がりが＋）
    const tilt = rotation(PU, PR);
    // なめらかさ（手本との差。ガタガタほど大きい）
    const wob = Math.max(0, wobble(nu) - wobble(nr));
    // 書く速さ：手本の線の長さあたりの時間（1000 あたりの秒）
    const t0 = user[0][2], last = user[user.length - 1];
    const ms = Math.max(1, last[last.length - 1] - t0);
    const inkR = Rf.reduce((a, s) => a + lenOf(s), 0);
    const secPer = ms / 1000 / Math.max(300, inkR) * 1000;   // 線 1000 を書くのにかかった秒
    // 書き順（画の数が同じで、順番どおりの対応がいちばん合っていて、向きも合っている）
    let order = null;
    if (JD.orderable(form) && U.length === Rf.length && U.length > 1) {
      const C = nu.map(a => nr.map(b => strokeCost(a, b)));
      const best = assign(C);
      let inOrder = 0, opt = 0; for (let i = 0; i < nu.length; i++) { inOrder += C[i][i]; opt += C[i][best[i]]; }
      const dirOk = nu.every((a, i) => { const b = nr[i]; const ax = a[a.length - 2] - a[0], ay = a[a.length - 1] - a[1], bx = b[b.length - 2] - b[0], by = b[b.length - 1] - b[1]; return ax * bx + ay * by > -0.2 * Math.sqrt((ax * ax + ay * ay) * (bx * bx + by * by)) || (Math.abs(bx) + Math.abs(by) < 40); });
      order = inOrder <= opt * 1.15 + 8 * nu.length && dirOk;
    } else if (JD.orderable(form) && U.length === 1 && Rf.length === 1) order = true;
    return { rep: Math.round(rep * 10) / 10, d, sa, dn, offX, offY, size, tilt, wob, secPer, order, nu: U.length, nr: Rf.length };
  };

  // ---------- 強さ ----------
  // base：手本の字の素質（0〜100）、j：判定。返り値は試合に出す強さと、上下の内わけ
  // 再現度がきびしめ：90%以上でほぼ全力、70%で 7割
  JD.power = rep => rep >= 90 ? 0.97 + (rep - 90) * 0.003 : Math.max(0.15, 0.97 - (90 - rep) * 0.0135);
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  // くせは「配分だけ」を変える（上げたぶん、どこかを下げる。合計は 0）
  // 合計を動かすのは、再現度（かけ算）・書き順・線のなめらかさ だけ
  JD.mods = function (j) {
    const m = { hp: 0, atk: 0, def: 0, shp: 0, spd: 0 }, why = [];
    const add = (o) => { for (const k in o) m[k] += o[k]; };
    // 大きさ：大きく書くと重く（体力・攻撃＋、速さ−）
    const sz = clamp((j.size - 1) / 0.4, -1, 1);
    if (Math.abs(sz) > 0.25) { add({ hp: sz * 12, atk: sz * 10, spd: -sz * 22 }); why.push(sz > 0 ? '大きく書いた：体力・攻撃↑ 速さ↓' : '小さく書いた：速さ↑ 体力・攻撃↓'); }
    // 傾き：右上がりで前のめり（攻撃＋、防御−）
    const tl = clamp(j.tilt / 12, -1, 1);
    if (Math.abs(tl) > 0.15) { add({ atk: tl * 16, def: -tl * 16 }); why.push(tl > 0 ? '右上がり：攻撃↑ 防御↓' : '右下がり：防御↑ 攻撃↓'); }
    // 上下のかたより：下に寄るとどっしり（防御＋、速さ−）
    const oy = clamp(j.offY / 15, -1, 1);
    if (Math.abs(oy) > 0.15) { add({ def: oy * 14, spd: -oy * 14 }); why.push(oy > 0 ? '下に寄った：どっしり（防御↑ 速さ↓）' : '上に寄った：身軽（速さ↑ 防御↓）'); }
    // 書く速さ：すばやいと速さ＋、そのぶん体力−（線1000を 1.2秒で書けば＋、4秒以上かかると−）
    const sp = clamp((2.2 - j.secPer) / 1.6, -1, 1);
    if (Math.abs(sp) > 0.1) { add({ spd: sp * 18, hp: -sp * 18 }); why.push(sp > 0 ? 'すばやく書いた：速さ↑ 体力↓' : 'じっくり書いた：体力↑ 速さ↓'); }
    // ここから下は合計も動く
    const wb = clamp((j.wob - 0.08) / 0.35, 0, 1);
    if (wb > 0.15) { m.def -= Math.round(wb * 20); why.push('線がガタガタ：防御↓（総合↓）'); } else { m.def += 6; why.push('線がなめらか：防御↑（総合↑）'); }
    if (j.order === true) { m.hp += 10; why.push('書き順が正しい：体力↑（総合↑）'); }
    else if (j.order === false) why.push('書き順がちがう：ボーナスなし');
    // 左右のかたより：試合で押す力がそちらへ逃げる
    if (Math.abs(j.offX) > 2) why.push(j.offX > 0 ? '右に寄った：押すと体が回る' : '左に寄った：押すと体が回る');
    for (const k in m) m[k] = Math.round(m[k]);
    return { m, why };
  };
  JD.stats = function (base, j) {
    const k = JD.power(j.rep), { m, why } = JD.mods(j), st = {};
    for (const key of ['hp', 'atk', 'def', 'shp', 'spd']) st[key] = Math.round(clamp(base[key] * k + m[key], 1, 150));
    return { st, k, m, why };
  };
  // 試合で使う、左右のかたより（-1〜1）
  JD.lean = j => clamp(j.offX / 12, -1, 1);
})(typeof window !== 'undefined' ? window : globalThis);
