// =============================================
//  字力  書く画面（字をえらぶ → 手本なしで書く → 字力カード）
//  書いた座標は 0〜1000 の箱（y は下向き）。箱のまん中が十字線
// =============================================
(function () {
  const OK = window.OK, SH = OK.SH, GL = OK.GL, JD = OK.JD;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const E = OK.W = {};
  const st = { ch: '', form: '', forms: [], ref: null, strokes: [], cur: null, t0: 0, size: 300, w: null };

  // ---------- ひらく ----------
  E.open = async function (work) {
    OK.show('s-write');
    if (work && SH.isW(work)) { const d = SH.decodeW(work); if (d) { await setChar(d.ch, d.form); return; } }
    if (work && typeof work === 'object' && work.ch) { await setChar(work.ch, work.form); return; }
    if (st.ch) { resize(); draw(); return; }
    empty(true);
  };
  function empty(on) {
    $('wr-empty').classList.toggle('on', on); $('wr-empty').hidden = !on;
    if (on) { $('wr-ch-t').textContent = '？'; $('wr-q').textContent = '書く字をえらんでください'; $('wr-st').textContent = ''; setTimeout(() => $('wr-qin').focus(), 50); }
    resize(); draw(); upd();
  }
  async function setChar(raw, form) {
    const ch = GL.first(raw); if (!ch) { msg('字を1つ入れてください'); return false; }
    const g = await GL.get(ch).catch(() => null);
    if (!g) { msg(`「${ch}」は画のデータがないので書けません。ほかの字にしてください`); return false; }
    st.forms = GL.formsOf(g); st.form = form && g.forms[form] ? form : st.forms[0];
    st.ch = ch; st.g = g; st.ref = g.forms[st.form]; st.strokes = []; st.cur = null; st.t0 = 0;
    const sel = $('wr-form'); sel.innerHTML = st.forms.map(f => `<option value="${f}"${f === st.form ? ' selected' : ''}>${esc(GL.FORM[f])}</option>`).join(''); sel.hidden = st.forms.length < 2;
    $('wr-ch-t').textContent = ch;
    $('wr-q').innerHTML = `「<b>${esc(ch)}</b>」を書いてください`;
    empty(false); msg(''); return true;
  }
  function msg(t) { const e = $('wr-st'); if (t) { OK.toast(t); } }
  function upd() {
    const n = st.strokes.length, need = st.ref ? st.ref.length : 0;
    $('wr-st').textContent = st.ch ? `${n}画／手本${need}画` : '';
    $('wr-done').disabled = !st.ch || n === 0;
    $('wr-undo').disabled = n === 0; $('wr-clear').disabled = n === 0;
  }

  // ---------- 描く ----------
  let cv, g;
  function resize() {
    cv = $('wr-cv'); const box = $('wr-board');
    const bw = box.clientWidth || 320, top = box.getBoundingClientRect().top, vh = window.innerHeight || 640;
    const size = Math.max(220, Math.min(bw, vh - Math.max(0, top) - 120, 560));
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    cv.style.width = size + 'px'; cv.style.height = size + 'px';
    cv.width = Math.round(size * dpr); cv.height = Math.round(size * dpr);
    st.size = size; g = cv.getContext('2d'); g.setTransform(cv.width / 1000, 0, 0, cv.height / 1000, 0, 0);
  }
  function draw() {
    if (!g) return;
    g.clearRect(0, 0, 1000, 1000);
    g.fillStyle = '#f7f1e3'; g.fillRect(0, 0, 1000, 1000);
    // 方眼（細い線）
    g.strokeStyle = 'rgba(160,120,80,.22)'; g.lineWidth = 2;
    g.beginPath(); for (let i = 1; i < 10; i++) { if (i === 5) continue; g.moveTo(i * 100, 0); g.lineTo(i * 100, 1000); g.moveTo(0, i * 100); g.lineTo(1000, i * 100); } g.stroke();
    // まん中の十字（赤い点線）
    g.strokeStyle = 'rgba(200,60,40,.55)'; g.lineWidth = 4; g.setLineDash([22, 14]);
    g.beginPath(); g.moveTo(500, 0); g.lineTo(500, 1000); g.moveTo(0, 500); g.lineTo(1000, 500); g.stroke(); g.setLineDash([]);
    // 外わく
    g.strokeStyle = 'rgba(200,60,40,.7)'; g.lineWidth = 8; g.strokeRect(4, 4, 992, 992);
    // 書いた線（ゆっくりは太く、速いと細く）
    g.strokeStyle = '#1b1612'; g.fillStyle = '#1b1612'; g.lineCap = 'round'; g.lineJoin = 'round';
    const all = st.cur ? st.strokes.concat([st.cur]) : st.strokes;
    for (const s of all) E.ink(g, s, SH.radii(s), 1, 0, 0);
  }
  // 太さの変わる線を描く（k：倍率、ox・oy：ずらし）
  E.ink = function (c, s, rad, k, ox, oy) {
    const n = s.length / 3;
    if (n <= 1) { c.beginPath(); c.arc(ox + s[0] * k, oy + s[1] * k, rad[0] * k, 0, Math.PI * 2); c.fill(); return; }
    for (let i = 0; i < n - 1; i++) {
      c.lineWidth = (rad[i] + rad[i + 1]) * k;
      c.beginPath(); c.moveTo(ox + s[3 * i] * k, oy + s[3 * i + 1] * k); c.lineTo(ox + s[3 * i + 3] * k, oy + s[3 * i + 4] * k); c.stroke();
    }
  };
  function pos(ev) { const r = cv.getBoundingClientRect(); return [Math.round(Math.max(0, Math.min(1000, (ev.clientX - r.left) / r.width * 1000))), Math.round(Math.max(0, Math.min(1000, (ev.clientY - r.top) / r.height * 1000)))]; }
  let pid = null;
  function down(ev) {
    if (!st.ch || pid !== null) return; ev.preventDefault();
    pid = ev.pointerId; try { cv.setPointerCapture(pid); } catch (e) {}
    const now = performance.now(); if (!st.strokes.length) st.t0 = now;
    const [x, y] = pos(ev); st.cur = [x, y, Math.round(now - st.t0)]; draw();
  }
  function move(ev) {
    if (ev.pointerId !== pid || !st.cur) return; ev.preventDefault();
    const evs = ev.getCoalescedEvents ? ev.getCoalescedEvents() : [ev];
    for (const e of (evs.length ? evs : [ev])) {
      const [x, y] = pos(e), c = st.cur, lx = c[c.length - 3], ly = c[c.length - 2];
      if ((x - lx) * (x - lx) + (y - ly) * (y - ly) < 36) continue;
      c.push(x, y, Math.round(performance.now() - st.t0));
    }
    draw();
  }
  function up(ev) {
    if (ev.pointerId !== pid) return; pid = null;
    if (st.cur) { const c = st.cur; const t = Math.round(performance.now() - st.t0); if (c[c.length - 1] !== t) c.push(c[c.length - 3], c[c.length - 2], t); st.strokes.push(c); st.cur = null; OK.S && OK.S.play && OK.S.play('place'); if (OK.FX && ev.clientX != null) OK.FX.stroke(ev.clientX, ev.clientY); }
    if (st.strokes.length > 60) st.strokes.length = 60;
    draw(); upd();
  }

  // ---------- 字力カード ----------
  async function done() {
    if (!st.strokes.length) return;
    const s = SH.encodeW(st.form, st.ch, st.strokes);
    let w; try { w = await SH.make(s); } catch (e) { OK.toast(e.message || '読みこめませんでした'); return; }
    st.w = w; showCard(w);
  }
  E.card = showCard;
  // 名前のおまかせ（書道の号っぽく）
  const NA = ['墨', '筆', '硯', '雅', '翠', '月', '風', '雲', '石', '竹', '松', '梅', '鶴', '龍', '虎', '桜'], NB = ['舟', '庵', '堂', '斎', '山', '水', '亭', '園', '仙', '泉'];
  E.autoName = () => NA[Math.floor(Math.random() * NA.length)] + NB[Math.floor(Math.random() * NB.length)];
  function showCard(w) {
    const tot = SH.total(w.st), gr = OK.grade(tot);
    $('jc-title').textContent = OK.repTitle(w);
    $('jc-stamp').classList.toggle('kumi', !w.hw);
    $('jc-pow').textContent = w.hw ? '素質の ' + Math.round(w.jr.k * 100) + '% を出せた' : '';
    $('jc-grade').textContent = gr.n + 'の格'; $('jcard').dataset.g = gr.k;
    // 半紙に書いた字
    const c = $('jc-shape').getContext('2d'), Z = 360; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, Z, Z);
    c.fillStyle = '#f7f1e2'; c.fillRect(0, 0, Z, Z);
    c.strokeStyle = 'rgba(200,52,30,.45)'; c.lineWidth = 2; c.setLineDash([9, 7]); c.beginPath(); c.moveTo(Z / 2, 0); c.lineTo(Z / 2, Z); c.moveTo(0, Z / 2); c.lineTo(Z, Z / 2); c.stroke(); c.setLineDash([]);
    c.strokeStyle = 'rgba(200,52,30,.7)'; c.lineWidth = 5; c.strokeRect(2.5, 2.5, Z - 5, Z - 5);
    c.strokeStyle = '#17120e'; c.fillStyle = '#17120e'; c.lineCap = 'round'; c.lineJoin = 'round';
    if (w.hw) w.strokes.forEach((s, i) => E.ink(c, s, w.rad[i], Z / 1000, 0, 0)); else OK.R.shapeIcon(c, w.b.parts, Z / 2, Z / 2, Z * 0.8, 0, 0, { fill: '#17120e', stroke: '#000', lw: 2 });
    const rv = $('jc-radar').getContext('2d'); rv.clearRect(0, 0, 300, 270); rv.save(); rv.scale(2, 2);
    OK.R.radar(rv, 75, 70, 48, OK.STATS.map(x => w.base[x.k]), null, { fs: 10, fill: 'rgba(90,80,70,.15)', stroke: 'rgba(60,40,20,.35)' }); OK.R.radar(rv, 75, 70, 48, OK.STATS.map(x => w.st[x.k]), null, { fs: 10, labels: false, fill: 'rgba(217,69,46,.45)', stroke: 'rgba(122,26,16,.9)' }); rv.restore();
    $('jc-stl').innerHTML = OK.STATS.map(x => { const a = w.base[x.k], b = w.st[x.k], d = b - a; return `<div><b>${x.n}</b><b>${b}<small class="${d >= 0 ? 'up' : 'dn'}"> ${d >= 0 ? '+' : ''}${d}</small></b></div>`; }).join('');
    const j = w.j, why = w.jr.why.slice();
    why.unshift(`画数：${j.nu}画（手本${j.nr}画）${j.order === true ? '・書き順○' : j.order === false ? '・書き順×' : ''}`);
    $('jc-why').innerHTML = why.map(t => `<li>${esc(t)}</li>`).join('');
    try { $('jc-name').value = localStorage.getItem('jr_name') || ''; } catch (e) {}
    $('jcard').classList.add('on');
    if (OK.FX) OK.FX.card(w, { rep: w.j.rep, tot, gold: gr.k === 'gold' || gr.k === 'silver' }); else { $('jc-rep').textContent = w.j.rep.toFixed(1) + '%'; $('jc-total').textContent = tot; }
  }
  function closeCard() { if (OK.FX) OK.FX.cardSkip(); $('jcard').classList.remove('on'); }

  // ---------- ボタン ----------
  function bind() {
    cv = $('wr-cv');
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move);
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    $('wr-back').onclick = () => { OK.S && OK.S.play('ui'); OK.toTitle(); };
    $('wr-ch').onclick = () => { st.ch = ''; st.ref = null; st.strokes = []; empty(true); };
    $('wr-go').onclick = () => setChar($('wr-qin').value);
    $('wr-qin').onkeydown = e => { if (e.key === 'Enter') setChar($('wr-qin').value); };
    $('wr-rand').onclick = () => setChar(OK.randomChar());
    $('wr-form').onchange = () => setChar(st.ch, $('wr-form').value);
    $('wr-undo').onclick = () => { st.strokes.pop(); draw(); upd(); };
    $('wr-clear').onclick = () => { st.strokes = []; st.t0 = 0; draw(); upd(); };
    $('wr-done').onclick = done;
    $('jc-again').onclick = () => { closeCard(); st.strokes = []; st.t0 = 0; draw(); upd(); };
    $('jc-save').onclick = () => {
      if (!st.w) return;
      let nm = $('jc-name').value.replace(/\s+/g, ' ').trim().slice(0, 12);
      if (!nm) nm = E.autoName();
      try { localStorage.setItem('jr_name', $('jc-name').value.trim().slice(0, 12)); } catch (e) {}
      OK.Works.add(st.w.s); OK.Works.setName && OK.Works.setName(st.w.s, nm);
      closeCard(); OK.practice(st.w.s);
    };
    window.addEventListener('resize', () => { if (document.querySelector('#s-write.active')) { resize(); draw(); } });
  }
  E.bind = bind;   // main.js の起動から呼ばれる
})();
