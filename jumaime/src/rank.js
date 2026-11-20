// ランキング（ft-blue の jumaime）。門を出るまでの時間で、短いほど上
// ずる対策：
//  ・始めるときにサーバーの時刻をもらい（切符）、その時刻から屋敷の間取りを決める。自分で楽な間取りは選べない
//  ・記録は、切符をもらってから実際に経った時間より短くできない（データベースのルールで止める）
//  ・ランキングを出すときに、その切符の間取りを作りなおして「どんなに速く走ってもこれより短くはならない時間」を出し、それより短い記録は並べない
import { genMap, roomCenter, doorPoint, S } from "./world.js";

export const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
const FB = { key: "AIzaSyB2iLUuAyxSJ45RewGrbyLg0sYLsC7njIo", db: "https://ft-blue-default-rtdb.asia-southeast1.firebasedatabase.app" };
export const MAPV = 1; // 間取りの作り方を変えたら、この数字を上げる（古い記録の間取りは作りなおせなくなるため）
const NG = ["ちんこ", "ちんぽ", "まんこ", "せっくす", "セックス", "きんたま", "レイプ", "死ね", "しね", "殺す", "ころす", "ガイジ", "キチガイ", "きちがい", "ニガー", "チョン", "支那", "fuck", "shit", "bitch", "cunt", "dick", "pussy", "nigger", "nigga", "faggot", "retard", "whore", "slut", "rape", "porn", "nazi", "hitler"];
export const badName = (s) => { const n = s.normalize("NFKC").toLowerCase().replace(/[\s・._\-ー〜~!！?？*＊]/g, ""); return NG.some((w) => n.includes(w.normalize("NFKC").toLowerCase())); };
async function fx(url, opt) { let err; for (let i = 0; i < 3; i++) { try { return await fetch(url, opt); } catch (e) { err = e; await new Promise((r) => setTimeout(r, 500 * (i + 1))); } } throw err; }
let AUTH = null;
async function auth() {
  let a = AUTH || ls.get("jm_auth", null); if (a && a.exp > Date.now() + 60000) return (AUTH = a);
  if (a && a.refresh) { try { const r = await fx("https://securetoken.googleapis.com/v1/token?key=" + FB.key, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=refresh_token&refresh_token=" + encodeURIComponent(a.refresh) }); if (r.ok) { const j = await r.json(); a = { uid: j.user_id, token: j.id_token, refresh: j.refresh_token, exp: Date.now() + +j.expires_in * 1000 }; ls.set("jm_auth", a); return (AUTH = a); } } catch (_) { } }
  const r = await fx("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + FB.key, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ returnSecureToken: true }) });
  if (!r.ok) throw new Error("auth"); const j = await r.json(); a = { uid: j.localId, token: j.idToken, refresh: j.refreshToken, exp: Date.now() + +j.expiresIn * 1000 }; ls.set("jm_auth", a); return (AUTH = a);
}
const DB = (p) => FB.db + "/jumaime/" + p + ".json";
const QA = (a) => "?auth=" + encodeURIComponent(a.token);
const PUT = (url, body) => fx(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const TS = { ".sv": "timestamp" };
const dayKey = (ms) => Math.floor((ms + 32400000) / 86400000);
export const myId = () => (AUTH || ls.get("jm_auth", null) || {}).uid;

// 切符の時刻 → 屋敷の種
export const seedOf = (st) => { const lo = st % 4294967296 >>> 0, hi = Math.floor(st / 4294967296) >>> 0; return ((Math.imul(lo ^ (lo >>> 15), 2654435761) ^ Math.imul(hi + 0x9e3779b9, 40503)) >>> 0) || 1; };
// その間取りで、どんなに速くても門を出るまでにかかる時間（秒）。部屋の真ん中どうしを戸口づたいに結んだ道のりを、走る速さで割る
const minCache = new Map();
export function minTimeOfMap(m) {
  const leg = (a, b) => { let d = 0, prev = roomCenter(a), cur = a; for (const rm of m.path(a, b)) { const dp = doorPoint(cur, rm); d += Math.hypot(dp.x - prev.x, dp.z - prev.z); prev = dp; cur = rm; } const c = roomCenter(b); return d + Math.hypot(c.x - prev.x, c.z - prev.z); };
  return Math.max(0, (leg(m.start, m.keyRoom) + leg(m.keyRoom, m.gate) - S * 1.2) / 4.4); // 部屋の中での位置のずれの分（1.2部屋ぶん）は引いておく
}
export function minTime(st) { if (!minCache.has(st)) minCache.set(st, minTimeOfMap(genMap(seedOf(st)))); return minCache.get(st); }

let RUN = null;
export const hasRun = () => !!RUN;
/** 始めるとき：切符（サーバーの時刻）をもらう。もらえなければ、この回は記録できない */
let runN = 0;
export async function netStart() {
  const my = ++runN; RUN = null; const a = await auth();
  const r = await PUT(DB("run/" + a.uid) + QA(a), { st: TS }); if (!r.ok) throw new Error("run"); const j = await r.json(); if (typeof j.st !== "number") throw new Error("run");
  if (my !== runN) throw new Error("stale"); // 待ちきれずに先に始めたあとで届いた切符は使わない（間取りと合わなくなるため）
  RUN = { st: j.st }; return j.st;
}
/** 切符なしで始める（通信できなかったとき）。この回は記録できない */
export function dropRun() { runN++; RUN = null; }
/** 門を出たあと：記録を送る。t はミリ秒、p は皿が無事なら1 */
export async function submit(nm, t, p) {
  if (!RUN) throw new Error("norun");
  const a = await auth(), rec = { n: nm, t, p: p ? 1 : 0, st: RUN.st, v: MAPV, at: TS }, dk = dayKey(Date.now()), recD = { ...rec, dk, ds: dk * 10000000 + t };
  const get = (pth) => fx(DB(pth)).then((x) => (x.ok ? x.json() : null)).catch(() => null);
  const [old, oldD] = await Promise.all([get("b/all/" + a.uid), get("b/d/" + a.uid)]);
  const okA = !old || t < old.t, okD = !oldD || oldD.dk !== dk || t < oldD.t;
  const reA = old && old.st === rec.st && old.t === t && old.n !== nm, reD = oldD && oldD.st === rec.st && oldD.t === t && oldD.n !== nm; // 同じ記録の名前だけ変える
  if (okD || reD) { const r = await PUT(DB("b/d/" + a.uid) + QA(a), reD && !okD ? { ...recD, dk: oldD.dk, ds: oldD.ds } : recD); if (!r.ok) throw new Error("d"); }
  if (okA || reA) { const r = await PUT(DB("b/all/" + a.uid) + QA(a), rec); if (!r.ok) throw new Error("all"); }
  const [rd, ra] = await Promise.all([board("d"), board("all")]);
  const f = (rows) => { const x = rows.find((r) => r.id === a.uid); return x ? x.rk : 0; };
  return { d: f(rd), a: f(ra), okA };
}
/** ランキングを読む（when: "d" 今日 / "all" 全期間）。上位100件 */
export async function board(when) {
  const dk = dayKey(Date.now());
  const q = when === "d" ? '?orderBy="ds"&startAt=' + dk * 10000000 + "&endAt=" + (dk * 10000000 + 9999999) + "&limitToFirst=100" : '?orderBy="t"&limitToFirst=100';
  const r = await fx(DB("b/" + when) + q); if (!r.ok) throw new Error("board");
  const o = (await r.json()) || {};
  const rows = Object.keys(o).map((id) => ({ id, ...o[id] })).filter((x) => typeof x.t === "number" && typeof x.st === "number" && x.t >= 15000 && (x.v !== MAPV || x.t >= minTime(x.st) * 1000)); // 間取りから見てありえない速さの記録は並べない
  rows.sort((a, b) => a.t - b.t || a.at - b.at);
  let rk = 0, prev = null; rows.forEach((x, i) => { if (x.t !== prev) { rk = i + 1; prev = x.t; } x.rk = rk; });
  return rows;
}
