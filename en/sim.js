// 円：120秒でボールが円をこわすゲームの計算（毎回同じ結果になるよう、足し算・かけ算・割り算・平方根だけを使う）
// お金は「当たるたびに1」だけ。ボールと速さは当たる回数（＝お金）をふやし、攻撃力は円を早くこわす
// 画面・ランキングの確かめ・試験で同じものを使う
const DIRS = [0.9323273456060345,0.361615431964962,-0.9317368833787797,0.36313410766767457,0.44174021511636763,-0.897143011090732,0.28028590973391687,0.9599165634598825,-0.8550884287196865,-0.5184821878036869,0.9807452809516597,-0.1952913052110873,-0.5912536662721762,0.8064856490475885,-0.10880117583403968,-0.9940635312378834,0.7517068681888761,0.6594973724873145,-0.9997693242463568,0.021477855944742892,0.7226907017244365,-0.6911715775703176,-0.06600993961000451,0.9978189654805543,-0.6253433514999432,-0.7803497246330124,0.9882273906285018,0.15299223644218812,-0.8320328931280654,0.5547262971528765,0.2388029312316933,-0.9710680511865022,0.47986119415980505,0.8773444217293035,-0.9464723519735712,-0.3227848926911179,0.9159373184539963,-0.4013213533607482,-0.40429499382340517,0.9146286448440879,-0.3197082264375042,-0.9475160420532127,0.8757807863046733,0.4827090369358836,-0.9718387652425429,0.23564680004585165,0.5574265336951565,-0.8302262700809958,0.14978080971877986,0.9887192265956937,-0.7783139489351489,-0.6278753036176644,0.9980281569192574,-0.06276781019240862,-0.6935158557811112,0.7204413631796782,0.02472586009443173,-0.9996942691856299,0.6570516963464166,0.7538455202017827,-0.9937048044432475,-0.11203018176548371,0.8084022972402933,-0.5886303813231325];
const ROT = [0.9427546655283462,-0.3334870921408144,0.9689124217106447,-0.24740395925452294,0.9855847669095608,-0.16918234906699603,0.9959527330119943,-0.08987854919801104,0.9992001066609779,0.03998933418663416,0.9939560979566968,0.10977830083717481,0.9820042351172703,0.18885889497650057,0.9637708963658905,0.26673143668883115,0.9358968236779348,0.35227423327508994];
export const HZ = 60, SECS = 120, TICKS = HZ * SECS;
export const R = 1, BR = 0.045;
export const MAXB = 30, MAXS = 12, MAXA = 999;
const V0 = 2.1, VK = 1.13;
// 円ごとの体力（外側の円ほど多い）
export function hpOf(k) { return 6 + 4 * k + 2 * k * k; }
// 攻撃力（1回当たるとへる体力）
export function dmgOf(L) { return 1 + L + ((L * L) >> 2); }
// 強化の値段（0：ボール、1：速さ、2：攻撃力）。買うほど上がる
export function costOf(type, L) { const n = L + 1; return type === 0 ? n * n + 2 : type === 1 ? 2 * n * n + 2 : n * n + 1; }
export const maxOf = type => type === 0 ? MAXB - 1 : type === 1 ? MAXS : MAXA;
export function create() {
  const s = { tick: 0, coins: 0, k: 0, hp: hpOf(0), hp0: hpOf(0), lv: [0, 0, 0], v: V0 / HZ, balls: [], rng: 0x9e3779b9 | 0, hits: 0, ev: [] };
  addBall(s); return s;
}
function addBall(s) { const i = s.balls.length; const dx = DIRS[(i % 32) * 2], dy = DIRS[(i % 32) * 2 + 1]; s.balls.push({ x: dx * 0.08, y: dy * 0.08, vx: dx * s.v, vy: dy * s.v }); }
function rnd(s) { let t = s.rng = (s.rng + 0x6D2B79F5) | 0; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return (t ^ (t >>> 14)) >>> 0; }
// 強化を買う（買えなければ false）
export function buy(s, type) {
  if (s.lv[type] >= maxOf(type)) return false; const c = costOf(type, s.lv[type]); if (s.coins < c) return false;
  s.coins -= c; s.lv[type]++;
  if (type === 0) addBall(s);
  else if (type === 1) { s.v *= VK; for (const b of s.balls) { b.vx *= VK; b.vy *= VK; } }
  return true;
}
// 1コマすすめる。ev に当たった場所などを入れる（画面の演出用）
export function step(s) {
  const dmg = dmgOf(s.lv[2]), lim = R - BR;
  for (let i = 0; i < s.balls.length; i++) {
    const b = s.balls[i]; b.x += b.vx; b.y += b.vy; const d2 = b.x * b.x + b.y * b.y;
    if (d2 > lim * lim) {
      const d = Math.sqrt(d2), nx = b.x / d, ny = b.y / d; const vn = b.vx * nx + b.vy * ny;
      if (vn > 0) {
        let vx = b.vx - 2 * vn * nx, vy = b.vy - 2 * vn * ny; const j = (rnd(s) % 9) * 2, c = ROT[j], sn = ROT[j + 1];
        let rx = vx * c - vy * sn, ry = vx * sn + vy * c;
        if (rx * nx + ry * ny > -0.25 * s.v) { rx = vx; ry = vy; } // 壁に沿いすぎないように
        b.vx = rx; b.vy = ry; s.hits++; s.coins += 1; s.hp -= dmg; s.ev.push(i, nx, ny);
        if (s.hp <= 0) { s.k++; s.hp = s.hp0 = hpOf(s.k); s.ev.push(-1, s.k, 0); }
      }
      b.x = nx * lim; b.y = ny * lim;
    }
  }
  s.tick++;
}
export const scoreOf = s => s.k + Math.floor((1 - s.hp / s.hp0) * 1000) / 1000;
// 強化の記録：[[コマ, 種類], ...] を文字にする
export const encLog = L => L.map(([t, y]) => t.toString(36) + 'BSA'[y]).join('');
export function decLog(str, ticks = TICKS) { if (typeof str !== 'string' || str.length > 4000) return null; const L = []; const re = /([0-9a-z]+)([BSA])/g; let m, pos = 0, last = -1; while ((m = re.exec(str))) { if (m.index !== pos) return null; pos = re.lastIndex; const t = parseInt(m[1], 36); if (!(t >= 0 && t < ticks) || t < last) return null; last = t; L.push([t, 'BSA'.indexOf(m[2])]); } if (pos !== str.length) return null; return L; }
// 記録どおりに最初から最後まで計算しなおす（買えない強化があれば null）
export function replayAll(L, ticks = TICKS) { const s = create(); let j = 0; for (let t = 0; t < ticks; t++) { while (j < L.length && L[j][0] === t) { if (!buy(s, L[j][1])) return null; j++; } step(s); s.ev.length = 0; } if (j !== L.length) return null; return s; }
