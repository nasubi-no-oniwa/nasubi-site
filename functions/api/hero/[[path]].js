// 趣味でヒーローになる：採点と記録（Cloudflare Pages Functions）
// 必要な設定（Cloudflare の管理画面）：D1 データベースを HERO_DB という名前でつなぐ
// 答えはこのファイルにもページにも置かず、非公開のデータベースの answers 表だけにある
import { QS } from './_qs.js';

const DAY = 86400000;
const PHYS_MIN_MS = 100000;     // 体力テスト4種目（30秒×4）より早く終わる記録ははじく
const RENDA_MAX = 600;          // 30秒で600回（1秒に20回）を超える連打ははじく
const PASS = { r: 250, t: 150, g: 25, w: 280 }; // 合格点：連打250回・反応0.15秒・持久走25秒・重り280kg

let ready = false;
async function setup(db) {
  if (ready) return;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS players(id INTEGER PRIMARY KEY AUTOINCREMENT, nkey TEXT NOT NULL, hkey TEXT NOT NULL, name TEXT NOT NULL, hero TEXT NOT NULL, tok TEXT NOT NULL, rec TEXT NOT NULL, best INTEGER, best_at INTEGER, tries INTEGER DEFAULT 0, created INTEGER, UNIQUE(nkey,hkey))`),
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS players_rec ON players(rec)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS players_best ON players(best)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS answers(qid TEXT PRIMARY KEY, a TEXT NOT NULL)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS sessions(sid TEXT PRIMARY KEY, pid INTEGER, created INTEGER, qs TEXT, step INTEGER DEFAULT -1, phys INTEGER, pdata TEXT, ok INTEGER DEFAULT 0, done INTEGER DEFAULT 0, fresh INTEGER DEFAULT 0)`),
  ]);
  ready = true;
}

const J = (o, st = 200, h = {}) => new Response(JSON.stringify(o), { status: st, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...h } });
const ERR = (code, st = 400) => J({ err: code }, st);

function norm(s) {
  s = String(s ?? '').normalize('NFKC');
  s = s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
  return s.toLowerCase().replace(/\s+/g, '').replace(/[。]+$/, '');
}
// 名前のくらべ方：全角・半角、大文字・小文字、空白の違いは同じ（ひらがなとカタカナは別）
const nameKey = s => String(s ?? '').normalize('NFKC').toLowerCase().replace(/\s+/g, '');
const cleanName = s => String(s ?? '').normalize('NFC').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim();
const len = s => [...s].length;

let ANS = null, ANS_AT = 0;
async function answers(db) {
  if (ANS && Date.now() - ANS_AT < 600000) return ANS;
  const rs = (await db.prepare('SELECT qid, a FROM answers').all()).results || [];
  const m = {}; for (const r of rs) { try { m[r.qid] = JSON.parse(r.a).map(norm); } catch (e) { } }
  ANS = m; ANS_AT = Date.now(); return m;
}
async function hmac(key, msg) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(msg)));
  return [...sig].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 24);
}
function rnd(n) { const a = new Uint8Array(n); crypto.getRandomValues(a); return a; }
const hex = n => [...rnd(n)].map(b => b.toString(16).padStart(2, '0')).join('');
const REC_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const recCode = () => { const a = rnd(8); let s = ''; for (let i = 0; i < 8; i++) { s += REC_ABC[a[i] % REC_ABC.length]; if (i === 3) s += '-'; } return s; };

// 級と順位：150点＝S級1位から1点ごとに1つ下がる（S11・A20・B40・C80）
function rankOf(s) {
  s = Math.max(0, Math.min(150, s | 0));
  if (s >= 140) return { c: 'S', r: 151 - s };
  if (s >= 120) return { c: 'A', r: 140 - s };
  if (s >= 80) return { c: 'B', r: 120 - s };
  return { c: 'C', r: 80 - s };
}

function physScore(p) {
  const r = Math.max(0, p.r | 0), t = +p.t || 0, g = Math.max(0, Math.min(30, +p.g || 0)), w = Math.max(0, +p.w || 0);
  const s = {
    r: Math.floor(25 * Math.min(1, r / PASS.r)),
    t: t >= 100 ? (t <= PASS.t ? 25 : Math.floor(25 * PASS.t / t)) : 0,
    g: Math.floor(25 * Math.min(1, g / PASS.g)),
    w: Math.floor(25 * Math.min(1, w / PASS.w)),
  };
  s.sum = s.r + s.t + s.g + s.w;
  return s;
}

// クッキー：この端末で受けた人の印（何人分でも持てる）。サーバーから渡すので、iPhoneの7日で消える仕組みの対象外
function getToks(req) {
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)hero_t=([a-f0-9.]+)/);
  return m ? m[1].split('.').filter(Boolean) : [];
}
function setToks(toks) {
  const v = [...new Set(toks)].slice(-30).join('.');
  return { 'set-cookie': `hero_t=${v}; Path=/api/hero; Max-Age=315360000; HttpOnly; Secure; SameSite=Lax` };
}

async function body(req) { try { return await req.json(); } catch (e) { return {}; } }

async function getSession(db, sid) {
  if (!/^[a-f0-9]{32}$/.test(String(sid || ''))) return null;
  return await db.prepare('SELECT * FROM sessions WHERE sid=?').bind(sid).first();
}

function questionOut(ss, i) {
  const qs = JSON.parse(ss.qs); const slot = QS[i], v = slot.v[qs[i]];
  const o = { i, n: QS.length, s: slot.s, k: slot.k, q: v.q };
  if (slot.k === 'c') o.c = v.c;
  return o;
}

async function finish(db, ss) {
  const total = Math.max(0, Math.min(150, (ss.phys | 0) + 5 * (ss.ok | 0)));
  const out = { total, phys: ss.phys | 0, writ: 5 * (ss.ok | 0), rank: rankOf(total), temp: !ss.pid };
  if (ss.pid) {
    const pl = await db.prepare('SELECT * FROM players WHERE id=?').bind(ss.pid).first();
    const best = Math.max(total, pl.best ?? -1);
    await db.prepare('UPDATE players SET best=?, best_at=CASE WHEN best IS NULL OR ?>best THEN ? ELSE best_at END, tries=tries+1 WHERE id=?').bind(best, total, Date.now(), ss.pid).run();
    out.best = best; out.bestRank = rankOf(best); out.newBest = pl.best == null || total > pl.best;
    out.name = pl.name; out.hero = pl.hero;
    if (ss.fresh) out.rec = pl.rec;
    const same = await db.prepare('SELECT COUNT(*) AS n FROM players WHERE best=?').bind(best).first();
    out.same = same.n;
  } else {
    const same = await db.prepare('SELECT COUNT(*) AS n FROM players WHERE best=?').bind(total).first();
    out.same = same.n;
  }
  return out;
}

async function ranking(db) {
  const rows = (await db.prepare('SELECT best, COUNT(*) AS n, MIN(name) AS name, MIN(hero) AS hero FROM players WHERE best IS NOT NULL GROUP BY best').all()).results || [];
  const by = {}; let tot = 0; const cls = { S: 0, A: 0, B: 0, C: 0 };
  for (const r of rows) { by[r.best] = r.n === 1 ? { n: 1, name: r.name, hero: r.hero } : { n: r.n }; tot += r.n; cls[rankOf(r.best).c] += r.n; }
  return { by, tot, cls, at: Date.now() };
}

export async function onRequest(ctx) {
  const { request: req, env, params } = ctx;
  const path = (params.path || []).join('/');
  const db = env.HERO_DB;
  if (!db) return ERR('setup', 503);
  try { await setup(db); } catch (e) { return ERR('db', 503); }
  const M = req.method;

  try {
    // ランキング（30秒ためておく）
    if (path === 'rank' && M === 'GET') {
      const cache = caches.default, key = new Request(new URL('/api/hero/rank', req.url).toString());
      let hit = await cache.match(key); if (hit) return hit;
      const res = J(await ranking(db), 200, { 'cache-control': 'public, max-age=30' });
      ctx.waitUntil(cache.put(key, res.clone()));
      return res;
    }

    // この端末で受けた人の一覧
    if (path === 'me' && M === 'GET') {
      const toks = getToks(req); if (!toks.length) return J({ list: [] });
      const ph = toks.map(() => '?').join(',');
      const rs = (await db.prepare(`SELECT name, hero, best FROM players WHERE tok IN (${ph}) ORDER BY id DESC`).bind(...toks).all()).results || [];
      return J({ list: rs });
    }

    // 試験を始める
    if (path === 'start' && M === 'POST') {
      const A = await answers(db); if (Object.keys(A).length < 40) { ANS = null; return ERR('setup', 503); }
      const b = await body(req); const now = Date.now();
      if (Math.random() < .05) ctx.waitUntil(db.prepare('DELETE FROM sessions WHERE created<?').bind(now - DAY).run());
      let pid = null, fresh = 0, hdr = {};
      if (b.mode === 'main') {
        const name = cleanName(b.name), hero = cleanName(b.hero);
        if (!name || !hero) return ERR('empty');
        if (len(name) > 10 || len(hero) > 15) return ERR('long');
        const nk = nameKey(name), hk = nameKey(hero), toks = getToks(req);
        let pl = await db.prepare('SELECT * FROM players WHERE nkey=? AND hkey=?').bind(nk, hk).first();
        if (pl) {
          if (!toks.includes(pl.tok)) return ERR('taken', 409);
        } else {
          const tok = hex(16);
          for (let k = 0; k < 5 && !pl; k++) {
            try { await db.prepare('INSERT INTO players(nkey,hkey,name,hero,tok,rec,created) VALUES(?,?,?,?,?,?,?)').bind(nk, hk, name, hero, tok, recCode(), now).run(); }
            catch (e) { const ex = await db.prepare('SELECT id FROM players WHERE nkey=? AND hkey=?').bind(nk, hk).first(); if (ex) return ERR('taken', 409); }
            pl = await db.prepare('SELECT * FROM players WHERE nkey=? AND hkey=?').bind(nk, hk).first();
          }
          if (!pl) return ERR('db', 503);
          fresh = 1; hdr = setToks([...toks, tok]);
        }
        pid = pl.id;
      }
      const sid = hex(16); const qs = QS.map(s => rnd(1)[0] % s.v.length);
      await db.prepare('INSERT INTO sessions(sid,pid,created,qs,fresh) VALUES(?,?,?,?,?)').bind(sid, pid, now, JSON.stringify(qs), fresh).run();
      return J({ sid, pass: PASS }, 200, hdr);
    }

    // 体力テストの記録
    if (path === 'phys' && M === 'POST') {
      const b = await body(req); const ss = await getSession(db, b.sid);
      if (!ss || ss.done || ss.step !== -1) return ERR('sid');
      const p = { r: +b.r || 0, t: +b.t || 0, g: +b.g || 0, w: +b.w || 0 };
      if (Date.now() - ss.created < (env.HERO_TEST ? 0 : PHYS_MIN_MS) || p.r > RENDA_MAX || !isFinite(p.t) || !isFinite(p.g) || !isFinite(p.w)) {
        await db.prepare('UPDATE sessions SET done=1 WHERE sid=?').bind(ss.sid).run();
        return ERR('cheat', 422);
      }
      const sc = physScore(p);
      await db.prepare('UPDATE sessions SET step=0, phys=?, pdata=? WHERE sid=? AND step=-1').bind(sc.sum, JSON.stringify(p), ss.sid).run();
      return J({ sc, q: questionOut({ ...ss, step: 0 }, 0) });
    }

    // 筆記：いまの問題
    if (path === 'q' && M === 'POST') {
      const b = await body(req); const ss = await getSession(db, b.sid);
      if (!ss || ss.done || ss.step < 0 || ss.step >= QS.length) return ERR('sid');
      return J({ q: questionOut(ss, ss.step) });
    }

    // 筆記：答える（v が null ならページを離れたので不正解）
    if (path === 'a' && M === 'POST') {
      const b = await body(req); const ss = await getSession(db, b.sid);
      if (!ss || ss.done || ss.step < 0) return ERR('sid');
      const i = b.i | 0; if (i !== ss.step) return J({ again: true, q: ss.step < QS.length ? questionOut(ss, ss.step) : null });
      const qs = JSON.parse(ss.qs); let good = false;
      if (b.v != null && String(b.v).length <= 200) {
        const A = await answers(db), list = A[`${i}-${qs[i]}`] || [];
        good = list.includes(norm(b.v));
      }
      const step = i + 1, ok = (ss.ok | 0) + (good ? 1 : 0);
      const upd = await db.prepare('UPDATE sessions SET step=?, ok=?, done=? WHERE sid=? AND step=?').bind(step, ok, step >= QS.length ? 1 : 0, ss.sid, i).run();
      if (!upd.meta || upd.meta.changes !== 1) return ERR('sid');
      const ns = { ...ss, step, ok };
      if (step < QS.length) return J({ q: questionOut(ns, step) });
      return J({ res: await finish(db, ns) });
    }

    // 合言葉で復活
    if (path === 'recover' && M === 'POST') {
      const b = await body(req); const code = String(b.code || '').normalize('NFKC').toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (code.length !== 8) return ERR('code');
      const pl = await db.prepare('SELECT * FROM players WHERE rec=?').bind(code.slice(0, 4) + '-' + code.slice(4)).first();
      if (!pl) return ERR('code', 404);
      return J({ name: pl.name, hero: pl.hero, best: pl.best }, 200, setToks([...getToks(req), pl.tok]));
    }

    return ERR('path', 404);
  } catch (e) {
    return ERR('server', 500);
  }
}
