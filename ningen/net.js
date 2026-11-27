// 人間はどこだ：待ち合わせ（Firebase を1秒に1回のぞく形。常時つながらないので同時接続の上限に数えられない）
// と、試合中の直接通信（WebRTC。全員どうしをつなぐ。代表が抜けたら控えが引き継ぐ）
//
// データの形（otokonoji の ningen/）
//   o/{部屋}          : { n:人数, t:時刻, s:'w' }      さがすで入れる部屋の一覧（あいことば部屋は載せない）
//   r/{部屋}/p/{人}   : { n:名前, rd:準備OK, t:時刻, j:入った時刻 }
//   r/{部屋}/c        : { at:開始の時刻, k:メンバー, h:代表 }   過半数が準備OKのときだけ
//   r/{部屋}/s        : 'g'（試合が始まった）
//   r/{部屋}/x/{人}/{自動}: 直接通信をつなぐための合図
//   z/{人}            : 時刻合わせ（すぐ消す）
const PROD = 'https://otokonoji-default-rtdb.asia-southeast1.firebasedatabase.app', KEY = 'AIzaSyAcJgJLVbuvx85_qEGJe1WhwsOelidxeYk';
const MOCK = (/[?&]fb=([^&]+)/.exec(location.search) || [])[1];
const DB = MOCK ? decodeURIComponent(MOCK) : PROD;
export const MAXP = 8;
const ICE = [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun.cloudflare.com:3478' }];
const sleep = ms => new Promise(r => setTimeout(r, ms));
export const rid = (n = 10) => { const c = 'abcdefghijkmnpqrstuvwxyz23456789'; let s = ''; const a = crypto.getRandomValues(new Uint8Array(n)); for (const b of a) s += c[b % c.length]; return s; };
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
async function fx(url, opt) { let err; for (let i = 0; i < 3; i++) { try { return await fetch(url, opt); } catch (e) { err = e; await sleep(300 * (i + 1)); } } throw err; }
let AUTH = null;
async function auth() {
  if (MOCK) return { token: 'mock' };
  let a = AUTH || ls.get('ningen_auth', null); if (a && a.exp > Date.now() + 60000) return AUTH = a;
  if (a && a.refresh) { try { const r = await fx('https://securetoken.googleapis.com/v1/token?key=' + KEY, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(a.refresh) }); if (r.ok) { const j = await r.json(); a = { token: j.id_token, refresh: j.refresh_token, exp: Date.now() + (+j.expires_in) * 1000 }; ls.set('ningen_auth', a); return AUTH = a; } } catch (_) { } }
  const r = await fx('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + KEY, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
  if (!r.ok) throw new Error('auth'); const j = await r.json(); a = { token: j.idToken, refresh: j.refreshToken, exp: Date.now() + (+j.expiresIn) * 1000 }; ls.set('ningen_auth', a); return AUTH = a;
}
async function req(m, p, v, keep) {
  const q = MOCK ? '' : '?auth=' + encodeURIComponent((await auth()).token);
  const r = await fx(DB + '/ningen/' + p + '.json' + q, { method: m, headers: { 'Content-Type': 'application/json' }, body: v === undefined ? undefined : JSON.stringify(v), keepalive: !!keep });
  if (!r.ok) throw new Error('db ' + r.status); return r.json();
}
const get = p => fx(DB + '/ningen/' + p + '.json').then(r => r.ok ? r.json() : null);
export const db = { get, put: (p, v) => req('PUT', p, v), patch: (p, v) => req('PATCH', p, v), del: (p, k) => req('DELETE', p, undefined, k), post: (p, v) => req('POST', p, v) };
const SV = { '.sv': 'timestamp' };
const clean = s => String(s || '').normalize('NFKC').toLowerCase().replace(/\s+/g, '').slice(0, 16);
function hcode(s) { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); }

// いま待っている人の数（タイトル画面に出す）
export async function waiting() { try { const o = (await get('o')) || {}, t = await offset(); const now = Date.now() + t; let n = 0; for (const k in o) { const v = o[k]; if (v && v.s === 'w' && now - v.t < 12000) n += v.n | 0; } return n; } catch (e) { return -1; } }
let OFF = null;
async function offset() { if (OFF != null) return OFF; try { const id = rid(8), t0 = Date.now(), t = await db.put('z/' + id, SV), t1 = Date.now(); db.del('z/' + id).catch(() => { }); OFF = t - (t0 + t1) / 2; } catch (e) { OFF = 0; } return OFF; }

// ---------- 待ち合わせ ----------
export class Lobby {
  constructor(name, code, cb) { this.name = name; this.code = code ? clean(code) : ''; this.cb = cb; this.pid = rid(10); this.rd = 0; this.j = 0; this.stopped = false; this.bad = new Set(); this.room = null; }
  now() { return Date.now() + (OFF || 0); }
  async start() { await offset(); this.room = await this.pick(); this.loop(); }
  async pick() {
    if (this.code) return 'k' + hcode(this.code);
    let o = {}; try { o = (await get('o')) || {}; } catch (e) { }
    const now = this.now(), c = [];
    for (const [id, v] of Object.entries(o)) {
      if (!v || now - v.t > 60000) { db.del('o/' + id).catch(() => { }); db.del('r/' + id).catch(() => { }); continue; }
      if (v.s === 'w' && v.n < MAXP && now - v.t < 12000 && !this.bad.has(id)) c.push([id, v.n]);
    }
    c.sort((a, b) => b[1] - a[1]);
    return c.length ? c[0][0] : 'r' + rid(9);
  }
  setReady(v) { this.rd = v ? 1 : 0; this.kick = 1; }
  async move() { const old = this.room; this.bad.add(old); db.del('r/' + old + '/p/' + this.pid).catch(() => { }); this.room = await this.pick(); this.j = 0; this.rd = 0; this.cb.moved && this.cb.moved(); }
  async loop() {
    while (!this.stopped) {
      const t0 = performance.now();
      try { await this.tick(); } catch (e) { this.cb.err && this.cb.err(e); }
      if (this.stopped) break;
      // 1秒に1回。準備OKを押したときはすぐ
      for (let i = 0; i < 10 && !this.kick && !this.stopped; i++) await sleep(Math.max(0, (1000 - (performance.now() - t0)) / 10));
      this.kick = 0;
    }
  }
  async tick() {
    const me = { n: this.name, rd: this.rd, t: SV }; if (!this.j) me.j = SV;
    const t0 = Date.now(), res = await db.patch('r/' + this.room + '/p/' + this.pid, me), t1 = Date.now();
    if (res && res.t) OFF = res.t - (t0 + t1) / 2; if (!this.j && res) this.j = res.j || res.t;
    if (this.stopped) return;
    const room = (await get('r/' + this.room)) || {}, now = this.now(), P = room.p || {};
    const c = room.c && typeof room.c.k === 'string' ? room.c : null, mem = c ? c.k.split(',') : [];
    if (c && now >= c.at) {
      if (mem.includes(this.pid)) return this.begin(room, c);
      return this.busy();
    }
    if (room.s === 'g') return this.busy();
    let alive = Object.entries(P).filter(([k, v]) => v && typeof v.t === 'number' && now - v.t < 6000).map(([k, v]) => ({ id: k, n: String(v.n || '').slice(0, 12), rd: v.rd ? 1 : 0, j: v.j || v.t })).sort((a, b) => (a.j - b.j) || (a.id < b.id ? -1 : 1));
    if (!alive.some(a => a.id === this.pid)) alive.push({ id: this.pid, n: this.name, rd: this.rd, j: this.j || now });
    if (alive.findIndex(a => a.id === this.pid) >= MAXP) { if (this.code) { this.cb.status({ full: 1 }); return; } return this.move(); }
    alive = alive.slice(0, MAXP);
    const key = alive.map(a => a.id).join(','), ready = alive.filter(a => a.rd).length, need = alive.length >= 2 && ready * 2 > alive.length;
    if (alive[0].id === this.pid) { // いちばん先に来た人が部屋の世話をする
      for (const [k, v] of Object.entries(P)) if (!v || now - v.t >= 6000) db.del('r/' + this.room + '/p/' + k).catch(() => { });
      if (!this.code) db.put('o/' + this.room, { n: alive.length, t: SV, s: 'w' }).catch(() => { });
      if (need) { if (!c || c.k !== key) { await db.put('r/' + this.room + '/c', { at: Math.round(now + 10000), k: key, h: this.pid }); } }
      else if (c) await db.del('r/' + this.room + '/c');
    }
    this.cb.status({ alive, ready, need, at: c && c.k === key ? c.at : 0, now, me: this.pid, code: this.code });
  }
  async busy() {
    if (this.code) { this.cb.status({ busy: 1 }); return; }
    return this.move();
  }
  async begin(room, c) {
    this.stopped = true;
    const mem = c.k.split(','), P = room.p || {}, names = {}; for (const id of mem) names[id] = String((P[id] && P[id].n) || '?').slice(0, 12);
    if (c.h === this.pid) { db.put('r/' + this.room + '/s', 'g').catch(() => { }); if (!this.code) db.del('o/' + this.room).catch(() => { }); }
    this.cb.begin({ room: this.room, me: this.pid, host: c.h, mem, names });
  }
  leave() { this.stopped = true; if (!this.room) return; db.del('r/' + this.room + '/p/' + this.pid, true).catch(() => { }); }
}

// ---------- 試合中の直接通信（全員どうし） ----------
export class Mesh {
  constructor(room, me, mem, cb) { this.room = room; this.me = me; this.mem = mem; this.cb = cb; this.P = {}; this.closed = false; }
  async connect(ms = 22000) {
    const peers = this.mem.filter(p => p !== this.me);
    for (const p of peers) this.P[p] = { pc: null, e: null, s: null, open: false, dead: false };
    const t0 = performance.now(), seen = new Set();
    for (const p of peers) if (this.me < p) this.offer(p);
    // 合図の受け取り（直接通信がつながるまでだけ、Firebase をのぞく）
    while (performance.now() - t0 < ms && !this.closed) {
      try {
        const box = (await get('r/' + this.room + '/x/' + this.me)) || {};
        for (const [k, m] of Object.entries(box)) { if (seen.has(k) || !m) continue; seen.add(k); db.del('r/' + this.room + '/x/' + this.me + '/' + k).catch(() => { }); await this.signal(m); }
      } catch (e) { }
      if (peers.every(p => this.P[p].open)) break;
      // 代表とつながったら、ほかの人を待つのは少しだけ
      await sleep(600);
    }
    return peers.filter(p => this.P[p].open);
  }
  mk(p) {
    const pc = new RTCPeerConnection({ iceServers: ICE }); this.P[p].pc = pc;
    pc.onconnectionstatechange = () => { if (['failed', 'closed'].includes(pc.connectionState)) this.drop(p); else if (pc.connectionState === 'disconnected') { clearTimeout(this.P[p].dt); this.P[p].dt = setTimeout(() => { if (pc.connectionState === 'disconnected') this.drop(p); }, 4000); } };
    return pc;
  }
  wire(p, ch) {
    const P = this.P[p]; P[ch.label] = ch;
    ch.onopen = () => { if (P.e && P.s && P.e.readyState === 'open' && P.s.readyState === 'open' && !P.open) { P.open = true; this.cb.open && this.cb.open(p); } };
    ch.onclose = () => this.drop(p);
    ch.onmessage = ev => { let m; try { m = JSON.parse(ev.data); } catch (e) { return; } this.cb.msg(p, m); };
  }
  async gather(pc) { if (pc.iceGatheringState === 'complete') return; await new Promise(r => { const t = setTimeout(r, 2500); pc.addEventListener('icegatheringstatechange', () => { if (pc.iceGatheringState === 'complete') { clearTimeout(t); r(); } }); }); }
  async offer(p) {
    try {
      const pc = this.mk(p);
      this.wire(p, pc.createDataChannel('e', { ordered: true }));
      this.wire(p, pc.createDataChannel('s', { ordered: false, maxRetransmits: 0 }));
      await pc.setLocalDescription(await pc.createOffer()); await this.gather(pc);
      await db.post('r/' + this.room + '/x/' + p, { f: this.me, y: 'o', d: pc.localDescription.sdp });
    } catch (e) { }
  }
  async signal(m) {
    const p = m.f; if (!this.P[p]) return;
    try {
      if (m.y === 'o') {
        if (this.P[p].pc) return; const pc = this.mk(p); pc.ondatachannel = ev => this.wire(p, ev.channel);
        await pc.setRemoteDescription({ type: 'offer', sdp: m.d }); await pc.setLocalDescription(await pc.createAnswer()); await this.gather(pc);
        await db.post('r/' + this.room + '/x/' + p, { f: this.me, y: 'a', d: pc.localDescription.sdp });
      } else if (m.y === 'a') { const pc = this.P[p].pc; if (pc && !pc.currentRemoteDescription) await pc.setRemoteDescription({ type: 'answer', sdp: m.d }); }
    } catch (e) { }
  }
  drop(p) { const P = this.P[p]; if (!P || P.dead) return; P.dead = true; const was = P.open; P.open = false; try { P.pc && P.pc.close(); } catch (e) { } if (was || !this.connecting) this.cb.lost && this.cb.lost(p); }
  send(p, m, fast) { const P = this.P[p]; if (!P || !P.open) return false; const ch = fast ? P.s : P.e; try { if (ch.readyState === 'open') { ch.send(typeof m === 'string' ? m : JSON.stringify(m)); return true; } } catch (e) { } return false; }
  all(m, fast) { const s = JSON.stringify(m); for (const p in this.P) this.send(p, s, fast); }
  live() { return Object.keys(this.P).filter(p => this.P[p].open); }
  close() { this.closed = true; for (const p in this.P) { const P = this.P[p]; P.dead = true; try { P.pc && P.pc.close(); } catch (e) { } } }
}
