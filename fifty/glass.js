// フィフティー：グラスの形（1000種類＋自作）と、注いだ量の計算
// 形は「高さ y（0=底, 1=ふち）ごとの半径 r(y)」と「断面の形 s(θ)」で決まる。
// 体積は輪切りにして足し合わせる（すべて数値計算なので、どんな形でも正しく出る）。

export const NS = 240;            // 輪切りの数
export const NA = 96;             // 断面の角度の数

// ---- 乱数（番号ごとに必ず同じ形になる） ----
export function rng(seed) { let s = (seed >>> 0) || 1; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ---- なめらかな曲線（制御点 → 細かい点） ----
function catmull(pts, n) {
  // pts: [[y,r],...] y は 0→1 の順。出力：長さ n+1 の半径の配列（y = i/n）
  const out = new Array(n + 1);
  const P = pts.slice().sort((a, b) => a[0] - b[0]);
  for (let i = 0; i <= n; i++) {
    const y = i / n; let k = 0;
    while (k < P.length - 2 && P[k + 1][0] < y) k++;
    const p0 = P[Math.max(0, k - 1)], p1 = P[k], p2 = P[Math.min(P.length - 1, k + 1)], p3 = P[Math.min(P.length - 1, k + 2)];
    const span = Math.max(1e-6, p2[0] - p1[0]); let t = (y - p1[0]) / span; t = Math.max(0, Math.min(1, t));
    const t2 = t * t, t3 = t2 * t;
    let r = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
    // 曲線がはみ出さないように、となりの点のあいだに少しだけ余裕をもたせて抑える
    const lo = Math.min(p1[1], p2[1]) * 0.82, hi = Math.max(p1[1], p2[1]) * 1.18 + 0.01;
    out[i] = Math.max(lo, Math.min(hi, r));
  }
  return out;
}

// ---- 断面の形 ----
// kind: 0 丸 1 星 2 四角 3 花 4 三角 5 歯車 6 だ円 7 しずく
export const SEC_N = 8;
export function secFn(kind, a) {
  a = a == null ? 0.3 : a;
  switch (kind) {
    case 1: return th => 1 + a * Math.cos(5 * th);
    case 2: return th => { const c = Math.abs(Math.cos(th)), s = Math.abs(Math.sin(th)); return 1 / Math.pow(Math.pow(c, 4) + Math.pow(s, 4), 0.25); };
    case 3: return th => 1 + a * 0.7 * Math.abs(Math.cos(3 * th)) - a * 0.2;
    case 4: return th => 1 + a * 0.6 * Math.cos(3 * th);
    case 5: return th => 1 + 0.14 * Math.tanh(4 * Math.cos(10 * th));
    case 6: return th => 1 / Math.sqrt(Math.cos(th) * Math.cos(th) / (1.35 * 1.35) + Math.sin(th) * Math.sin(th) / (0.72 * 0.72));
    case 7: return th => 0.78 + 0.32 * Math.cos(th) + 0.08 * Math.cos(2 * th);
    default: return () => 1;
  }
}

// ---- グラスを組み立てる ----
// spec: { pts:[[y,r]], h:高さ, sec:[kindA,aA,kindB,aB], tw:ねじれ(回転), stem:脚の長さ, foot:台の半径, col:液体の色番号, fam:形の名前の番号, diff:'e'|'n'|'h'|'c' }
export function build(spec) {
  const R = catmull(spec.pts, NS);
  for (let i = 0; i <= NS; i++) R[i] = Math.max(0.045, R[i]);
  const sec = spec.sec || [0, 0, 0, 0];
  const fA = secFn(sec[0], sec[1]), fB = secFn(sec[2], sec[3]);
  const same = sec[0] === sec[2] && sec[1] === sec[3];
  // 断面の「面積の倍率」（半径1のときの面積）を高さごとに
  const SA = new Float64Array(NA), SB = new Float64Array(NA);
  for (let j = 0; j < NA; j++) { const th = j / NA * Math.PI * 2; SA[j] = fA(th); SB[j] = fB(th); }
  const sq = arr => { let s = 0; for (let j = 0; j < NA; j++) s += arr[j] * arr[j]; return 0.5 * s * (Math.PI * 2 / NA); };
  const aA = sq(SA);
  const area = new Float64Array(NS + 1), cum = new Float64Array(NS + 1);
  for (let i = 0; i <= NS; i++) {
    const y = i / NS; let a;
    if (same) a = aA; else { let s = 0; for (let j = 0; j < NA; j++) { const m = SA[j] + (SB[j] - SA[j]) * y; s += m * m; } a = 0.5 * s * (Math.PI * 2 / NA); }
    area[i] = a * R[i] * R[i];
  }
  const H = spec.h;
  for (let i = 1; i <= NS; i++) cum[i] = cum[i - 1] + (area[i - 1] + area[i]) * 0.5 * (H / NS);
  const cap = cum[NS];
  const g = { spec, R, SA, SB, same, area, cum, cap, H };
  const tw = spec.tw || 0;
  g.secR = (th, y) => { const a = th - tw * y; const A = fA(a); return same ? A : A + (fB(a) - A) * y; }; // 角度 th・高さ y での断面の半径の倍率
  g.rAt = y => { const x = Math.max(0, Math.min(1, y)) * NS, i = Math.min(NS - 1, Math.floor(x)), k = x - i; return R[i] + (R[i + 1] - R[i]) * k; };
  g.secAt = (j, y) => same ? SA[j] : SA[j] + (SB[j] - SA[j]) * y; // j: 角度の番号, y: 0..1
  // 注いだ割合（0..1）→ 水面の高さ（0..1）
  g.levelOf = f => {
    const v = Math.max(0, Math.min(1, f)) * cap;
    let lo = 0, hi = NS;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] < v) lo = m; else hi = m; }
    const d = cum[hi] - cum[lo]; const k = d > 0 ? (v - cum[lo]) / d : 0;
    return (lo + k) / NS;
  };
  // 水面の高さ（0..1）→ 体積の割合
  g.fracAt = y => { y = Math.max(0, Math.min(1, y)); const x = y * NS, i = Math.min(NS - 1, Math.floor(x)), k = x - i; return (cum[i] + (cum[i + 1] - cum[i]) * k) / cap; };
  g.h50 = g.levelOf(0.5);
  g.halfFrac = g.fracAt(0.5);
  let mx = 0; for (let i = 0; i <= NS; i++) { const s = same ? 1 : 1; mx = Math.max(mx, R[i]); }
  let smax = 0; for (let j = 0; j < NA; j++) smax = Math.max(smax, SA[j], SB[j]);
  g.maxR = mx * smax;
  g.rimR = R[NS];
  return g;
}

// ---- 1000種類の形 ----
// No.1〜200 かんたん（よく見る形）／201〜600 ふつう（ありそうでなさそう）／601〜1000 むずかしい（意味がわからない）
export const DIFF_OF = n => n <= 200 ? 'e' : n <= 600 ? 'n' : 'h';
export const RANGE = { e: [1, 200], n: [201, 600], h: [601, 1000] };

// 形の名前（4言語）。番号は fam に入る
export const FAM = [
  // かんたん 0〜11
  ['カクテルグラス', 'Cocktail Glass', '雞尾酒杯', '칵테일 글라스'],
  ['ワイングラス', 'Wine Glass', '葡萄酒杯', '와인 글라스'],
  ['ブランデーグラス', 'Brandy Snifter', '白蘭地杯', '브랜디 글라스'],
  ['シャンパンクープ', 'Champagne Coupe', '香檳碟杯', '샴페인 쿠프'],
  ['フルートグラス', 'Flute', '香檳長笛杯', '플루트 글라스'],
  ['マルガリータグラス', 'Margarita Glass', '瑪格麗特杯', '마르가리타 글라스'],
  ['ピルスナーグラス', 'Pilsner Glass', '皮爾森杯', '필스너 글라스'],
  ['タンブラー', 'Tumbler', '平底杯', '텀블러'],
  ['おちょこ', 'Sake Cup', '清酒杯', '사케잔'],
  ['ゴブレット', 'Goblet', '高腳杯', '고블릿'],
  ['ハリケーングラス', 'Hurricane Glass', '颶風杯', '허리케인 글라스'],
  ['チューリップグラス', 'Tulip Glass', '鬱金香杯', '튤립 글라스'],
  // ふつう 12〜23
  ['砂時計グラス', 'Hourglass Glass', '沙漏杯', '모래시계 글라스'],
  ['ひょうたんグラス', 'Gourd Glass', '葫蘆杯', '호리병 글라스'],
  ['逆さ円錐グラス', 'Upside-down Cone', '倒圓錐杯', '거꾸로 원뿔 글라스'],
  ['電球グラス', 'Light Bulb Glass', '燈泡杯', '전구 글라스'],
  ['二段グラス', 'Two-tier Glass', '雙層杯', '2단 글라스'],
  ['波打ちグラス', 'Wavy Glass', '波浪杯', '물결 글라스'],
  ['花びんグラス', 'Vase Glass', '花瓶杯', '꽃병 글라스'],
  ['つぼグラス', 'Jar Glass', '罈子杯', '항아리 글라스'],
  ['ランタングラス', 'Lantern Glass', '燈籠杯', '랜턴 글라스'],
  ['玉ねぎグラス', 'Onion Glass', '洋蔥杯', '양파 글라스'],
  ['階段グラス', 'Stepped Glass', '階梯杯', '계단 글라스'],
  ['ベルグラス', 'Bell Glass', '鐘形杯', '종 글라스'],
  // むずかしい 24〜29
  ['名状しがたいグラス', 'Indescribable Glass', '難以名狀的杯子', '형언할 수 없는 글라스'],
  ['くびれすぎグラス', 'Way Too Curvy Glass', '腰太細的杯子', '너무 잘록한 글라스'],
  ['だんごグラス', 'Dango Glass', '糰子杯', '경단 글라스'],
  ['ぐにゃぐにゃグラス', 'Wobbly Glass', '歪七扭八的杯子', '흐물흐물 글라스'],
  ['とげとげグラス', 'Spiky Glass', '刺刺杯', '뾰족뾰족 글라스'],
  ['迷子のグラス', 'Lost Glass', '迷路的杯子', '길 잃은 글라스'],
  // 自作 30
  ['自作グラス', 'Handmade Glass', '自製杯', '직접 만든 글라스'],
];
export const SECNAME = [
  ['', '', '', ''],
  ['星形の', 'Star ', '星形', '별 모양 '],
  ['四角い', 'Square ', '方形', '네모난 '],
  ['花形の', 'Flower ', '花形', '꽃 모양 '],
  ['三角の', 'Triangle ', '三角', '세모난 '],
  ['歯車の', 'Gear ', '齒輪', '톱니 '],
  ['だ円の', 'Oval ', '橢圓', '타원 '],
  ['しずく形の', 'Teardrop ', '水滴形', '물방울 '],
];
export const TWNAME = ['ねじれた', 'Twisted ', '扭轉的', '꼬인 '];

function pick(r, a) { return a[Math.floor(r() * a.length)]; }
const U = (r, a, b) => a + (b - a) * r();

function easy(r, f) {
  let pts, h = U(r, 0.9, 1.3), stem = 0, foot = 0;
  switch (f) {
    case 0: { const w = U(r, .7, .95); pts = [[0, .05], [.5, w * .5 + .02], [1, w]]; h = U(r, .75, 1.05); stem = U(r, .7, 1.1); foot = U(r, .35, .5); break; }
    case 1: { const w = U(r, .42, .55); pts = [[0, .1], [.12, w * .62], [.45, w], [.8, w * .97], [1, w * U(r, .8, .9)]]; h = U(r, 1, 1.3); stem = U(r, .6, .9); foot = U(r, .32, .42); break; }
    case 2: { const w = U(r, .55, .7); pts = [[0, .14], [.08, w * .8], [.3, w], [.62, w * .84], [1, w * U(r, .48, .56)]]; h = U(r, .95, 1.15); stem = U(r, .15, .3); foot = U(r, .32, .42); break; }
    case 3: { const w = U(r, .75, .95); pts = [[0, .06], [.3, w * .66], [.7, w * .93], [1, w]]; h = U(r, .38, .5); stem = U(r, .8, 1.1); foot = U(r, .35, .45); break; }
    case 4: { const w = U(r, .2, .26); pts = [[0, .06], [.15, w * .72], [.6, w * .95], [1, w * U(r, 1.0, 1.12)]]; h = U(r, 1.45, 1.7); stem = U(r, .55, .8); foot = U(r, .28, .34); break; }
    case 5: { const w = U(r, .8, .95); pts = [[0, .1], [.3, .24], [.42, .3], [.55, w * .55], [.8, w * .86], [1, w]]; h = U(r, .75, .95); stem = U(r, .6, .85); foot = U(r, .35, .45); break; }
    case 6: { const w = U(r, .38, .46); pts = [[0, w * U(r, .32, .4)], [.5, w * .62], [.85, w * .86], [1, w]]; h = U(r, 1.45, 1.75); stem = U(r, .06, .14); foot = w * .45; break; }
    case 7: { const w = U(r, .44, .54); pts = [[0, w * U(r, .5, .62)], [1, w]]; h = U(r, 1.05, 1.35); stem = 0; foot = 0; break; }
    case 8: { const w = U(r, .55, .7); pts = [[0, w * .35], [.4, w * .72], [1, w]]; h = U(r, .45, .6); stem = 0; foot = 0; break; }
    case 9: { const w = U(r, .55, .68); pts = [[0, .08], [.2, w * .72], [.55, w * .96], [1, w]]; h = U(r, .85, 1.05); stem = U(r, .45, .7); foot = U(r, .36, .46); break; }
    case 10: { const w = U(r, .4, .5); pts = [[0, w * .55], [.3, w * .8], [.55, w * .62], [.8, w * .88], [1, w]]; h = U(r, 1.35, 1.6); stem = U(r, .12, .25); foot = U(r, .34, .42); break; }
    default: { const w = U(r, .45, .55); pts = [[0, .1], [.2, w * .8], [.5, w], [.8, w * .86], [1, w * U(r, .92, 1.02)]]; h = U(r, 1.05, 1.3); stem = U(r, .4, .65); foot = U(r, .32, .4); }
  }
  return { pts, h, stem, foot, fam: f, sec: [0, 0, 0, 0], tw: 0 };
}

function normal(r, f) {
  let pts, h = U(r, .9, 1.4), stem = U(r, 0, .7), foot = U(r, .3, .45);
  const w = U(r, .42, .7);
  switch (f) {
    case 12: pts = [[0, w], [.5, w * U(r, .2, .35)], [1, w * U(r, .9, 1.1)]]; break;
    case 13: { const a = U(r, .55, .8); pts = [[0, .1], [.15, w * a * .9], [.3, w * a], [.5, w * .3], [.75, w], [.95, w * .8], [1, w * .7]]; break; }
    case 14: pts = [[0, w], [.6, w * .62], [1, Math.max(.16, w * U(r, .3, .4))]]; stem = U(r, 0, .25); break;
    case 15: pts = [[0, .08], [.2, w * .3], [.5, w * .72], [.78, w], [.92, w * .72], [1, Math.max(.16, w * U(r, .38, .48))]]; break;
    case 16: { const a = U(r, .3, .5); pts = [[0, w * a], [.45, w * a], [.5, w * a * 1.1], [.56, w], [1, w * 1.02]]; break; }
    case 17: { const pts2 = []; const k = 3 + Math.floor(r() * 3); for (let i = 0; i <= 10; i++) { const y = i / 10; pts2.push([y, w * (.75 + .22 * Math.sin(y * Math.PI * k + r()))]); } pts = pts2; break; }
    case 18: pts = [[0, w * .5], [.35, w], [.7, w * .5], [.85, w * .2], [1, w * .45]]; break;
    case 19: pts = [[0, w * .45], [.25, w], [.6, w * .95], [.85, w * .45], [1, w * .55]]; stem = 0; break;
    case 20: pts = [[0, w * .2], [.12, w * .45], [.35, w * .75], [.66, w], [.86, w * .9], [1, Math.max(.16, w * .5)]]; break;
    case 21: pts = [[0, .1], [.15, w * .7], [.35, w], [.6, w * .75], [.85, w * .3], [1, w * .22]]; break;
    case 22: { const n = 3 + Math.floor(r() * 3); const pts2 = []; for (let i = 0; i < n; i++) { const a = w * (.35 + .65 * (i / (n - 1))); pts2.push([i / n + .02, a], [(i + 1) / n - .02, a]); } pts = pts2; break; }
    default: pts = [[0, .1], [.1, w * .25], [.5, w * .45], [.8, w * .8], [1, w * 1.05]];
  }
  if (r() < .35) { h *= U(r, .7, 1.25); }
  return { pts, h, stem, foot, fam: f, sec: [0, 0, 0, 0], tw: 0 };
}

function hard(r, f) {
  let pts = [], h = U(r, .9, 1.6), stem = U(r, 0, 1), foot = U(r, .3, .5);
  const w = U(r, .4, .7);
  switch (f) {
    case 25: { const n = 2 + Math.floor(r() * 3); for (let i = 0; i <= n * 2; i++) pts.push([i / (n * 2), i % 2 ? w * U(r, .08, .16) : w * U(r, .6, 1)]); break; }
    case 26: { const n = 3 + Math.floor(r() * 3); for (let i = 0; i <= n * 4; i++) { const y = i / (n * 4); pts.push([y, w * (.18 + .82 * Math.abs(Math.sin(y * Math.PI * n))) * U(r, .7, 1.05)]); } break; }
    case 27: { for (let i = 0; i <= 14; i++) pts.push([i / 14, w * U(r, .15, 1)]); break; }
    case 28: { for (let i = 0; i <= 18; i++) pts.push([i / 18, w * (i % 2 ? U(r, .7, 1) : U(r, .2, .45))]); break; }
    case 29: { const n = 5 + Math.floor(r() * 5); for (let i = 0; i <= n; i++) pts.push([Math.pow(i / n, U(r, .6, 1.6)), w * U(r, .12, 1)]); pts[0][0] = 0; pts[pts.length - 1][0] = 1; break; }
    default: { const n = 6 + Math.floor(r() * 5); for (let i = 0; i <= n; i++) pts.push([i / n, w * U(r, .1, 1)]); }
  }
  pts[pts.length - 1][1] = Math.max(pts[pts.length - 1][1], .16);
  let sec = [0, 0, 0, 0], tw = 0;
  const q = r();
  if (q < .75) { const a = 1 + Math.floor(r() * 7), b = r() < .5 ? a : Math.floor(r() * 8); sec = [a, U(r, .15, .4), b, U(r, .15, .4)]; }
  if (r() < .5) tw = U(r, -2.5, 2.5);
  return { pts, h, stem, foot, fam: f, sec, tw };
}

const cache = new Map();
export function glassNo(n) {
  if (cache.has(n)) return cache.get(n);
  const d = DIFF_OF(n);
  const f = d === 'e' ? (n - 1) % 12 : d === 'n' ? 12 + (n - 201) % 12 : 24 + (n - 601) % 6;
  const need = d === 'e' ? 0.06 : d === 'n' ? 0.05 : 0.04;
  let g = null, best = -1;
  for (let k = 0; k < 80; k++) {
    const r = rng(n * 7919 + 104729 * k + 13);
    const sp = d === 'e' ? easy(r, f) : d === 'n' ? normal(r, f) : hard(r, f);
    sp.col = Math.floor(r() * 12); sp.diff = d; sp.no = n;
    const gg = build(sp);
    // かんたんすぎる形（高さ半分＝体積半分に近い）は使わない。ふちが細すぎる形も使わない
    const off = Math.abs(gg.h50 - 0.5);
    if (gg.rimR < 0.14 || gg.maxR > 1.15) continue;
    if (off >= need) { g = gg; break; }
    if (off > best) { best = off; g = gg; }
  }
  cache.set(n, g);
  return g;
}

// ---- 自作グラス ----
// 保存する形：r は40個の半径（45〜1000の整数。古いものは24個）、h は高さ（×100）、s は下の型、s2 は上の型、a は型の強さ（×100）、t はねじれ（×100）
export const CUSTOM_N = 40;
export function customSpec(c) {
  const N = c.r.length, pts = [];
  for (let i = 0; i < N; i++) pts.push([i / (N - 1), Math.max(45, c.r[i]) / 1000]);
  const a = (c.a == null ? 30 : c.a) / 100, s1 = c.s || 0, s2 = c.s2 == null ? s1 : c.s2;
  return { pts, h: c.h / 100, stem: (c.st || 0) / 100, foot: 0.4, fam: 30, sec: [s1, a, s2, a], tw: (c.t || 0) / 100, col: c.c || 0, diff: 'c' };
}

export function nameOf(g, li) {
  const sp = g.spec;
  if (sp.diff === 'c') return null;
  let s = '';
  if (sp.tw && Math.abs(sp.tw) > .3) s += TWNAME[li];
  if (sp.sec && sp.sec[0]) s += SECNAME[sp.sec[0]][li];
  return s + FAM[sp.fam][li];
}

// ---- 注ぐしくみ（毎秒120回の決まった計算。同じ操作なら必ず同じ量になる） ----
export const HZ = 120;
export const T0 = 0.22;      // ここまで傾けると出はじめる
export const UPR = 0.55 / HZ; // 押しているあいだ1回ごとに傾く量
export const DNR = 0.5 / HZ;  // 離したあとシェイカーが戻る量（離した瞬間に、注ぐのは止まる）
export const QMAX = 0.5 / HZ; // いちばん傾けたときの1回ごとの量（グラス1杯＝1）
export const FALL = 0;        // 出たぶんはすぐグラスに入る（離したあとに水面は上がらない）
// 押しているあいだ：出はじめるまでは速く傾き（約0.2秒）、そこからはゆっくり傾く。離したら、その瞬間に注ぐのは止まる
export function nextTilt(tilt, hold) { if (hold) return Math.min(1, tilt + (tilt < T0 ? UPR * 2.2 : UPR)); if (tilt > T0) tilt = T0; return Math.max(0, tilt - DNR); }
export function flowOf(tilt) { if (tilt <= T0) return 0; const u = (tilt - T0) / (1 - T0); return QMAX * u * Math.sqrt(u); }
// log：[[押した回, 離した回], ...]（回 = 1/120 秒）。end：決定した回
export function totalOf(log, end) {
  let tilt = 0, v = 0, k = 0; const last = end + 2000;
  for (let i = 0; i < last; i++) {
    let hold = false;
    while (k < log.length && log[k][1] <= i) k++;
    if (k < log.length && log[k][0] <= i && i < log[k][1] && i < end) hold = true;
    tilt = nextTilt(tilt, hold);
    v += flowOf(tilt);
    if (i >= end && tilt <= 0) break;
    if (v > 1.2) break;
  }
  return v;
}
export function encLog(log, end) { return log.map(p => p[0].toString(36) + '.' + (p[1] - p[0]).toString(36)).join(',') + '|' + end.toString(36); }
export function decLog(s) {
  if (typeof s !== 'string' || s.length > 4000) return null;
  const [a, b] = s.split('|'); if (b == null) return null;
  const end = parseInt(b, 36); if (!(end >= 0)) return null;
  const log = []; if (a) for (const x of a.split(',')) { const [p, d] = x.split('.'); const pp = parseInt(p, 36), dd = parseInt(d, 36); if (!(pp >= 0 && dd >= 0)) return null; log.push([pp, pp + dd]); }
  for (let i = 1; i < log.length; i++) if (log[i][0] < log[i - 1][1]) return null;
  return { log, end };
}
