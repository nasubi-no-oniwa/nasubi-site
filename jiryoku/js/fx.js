// =============================================
//  字力  演出（GSAP の動きと、pixelfx の墨しぶき・紙吹雪）
//  ゲームの勝ち負けや数字には関係しない。部品が読めなかったときは、演出なしでそのまま動く
// =============================================
(function () {
  const OK = window.OK, FX = OK.FX = {};
  const $ = id => document.getElementById(id);
  const G = () => window.gsap, P = () => window.PFX;
  const S = () => OK.S || { play() {} };
  // 墨と朱の色（半紙の上でも見える、暗い→明るい）
  const INK = ['#0d0a08', '#1d1813', '#3a0c06', '#7a1a10', '#c8281c', '#e8462f', '#ff8a5a', '#ffd9b0'];
  const SUMI = ['#000000', '#0d0a08', '#1d1813', '#2a221c', '#3a2e22', '#5a4a35', '#7a6a55', '#a89c90'];
  const KAMI = ['#d9452e', '#e0b23a', '#1d1813', '#2f63ad', '#fbf7ec', '#c8281c', '#ffcf3a'];
  const reduce = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };

  // ---------- 試合：当たり ----------
  let lastBig = 0;
  FX.hit = function (e) {
    const p = P(), R = OK.R; if (!p || !R || !R.sc) return;
    const x = R.cx + e.x * R.sc, y = R.cy + e.y * R.sc, br = (e.br[0] || 0) + (e.br[1] || 0), now = performance.now();
    if (br > 0.25 && now - lastBig > 260) { lastBig = now; p.play('crit', x, y, { scale: br > 0.8 ? 3 : 2, palette: INK, seed: (e.x * 97 + e.y * 31) | 0, lightK: 0.35, max: 5 }); }
    else if (br > 0 || e.v > 7) p.play('spark', x, y, { scale: 2, palette: SUMI, flip: e.x > 0, seed: (e.v * 13) | 0, lightK: 0, max: 5 });
  };
  // ---------- 試合：決着 ----------
  FX.finish = function (winner) {
    const p = P(); if (!p || winner < 0 || reduce()) return;
    const W = innerWidth, H = innerHeight;
    p.play('confetti', W / 2, H * 0.8, { scale: Math.max(2, Math.min(4, Math.round(W / 190))), palette: KAMI, seed: (Math.random() * 99) | 0, lightK: 0, max: 9, z: 15 });
  };
  // 呼び出しの文字（のこった！・勝ち名乗り）を、たたきつける
  FX.call = function (el) {
    const g = G(); if (!g || reduce()) return;
    g.killTweensOf(el); g.fromTo(el, { scale: 2.4, rotation: -4 }, { scale: 1, rotation: 0, duration: 0.28, ease: 'back.out(2.2)' });
  };
  // 結果の紙を出す
  FX.result = function () {
    const g = G(), el = document.querySelector('#result .sheet-in'); if (!g || !el || reduce()) return;
    g.fromTo(el, { y: 70, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.42, ease: 'back.out(1.6)', clearProps: 'transform,opacity' });
    g.fromTo('#res-t', { scale: 1.9 }, { scale: 1, duration: 0.5, delay: 0.15, ease: 'elastic.out(1,0.55)', clearProps: 'transform' });
  };

  // ---------- 字力カード ----------
  // w：作品。数字を 0 から数え上げ、はんこをたたきつけ、総合パワーをどんと出す
  let tl = null;
  FX.card = function (w, o) {
    const g = G(), rep = o.rep, tot = o.tot;
    const setRep = v => { $('jc-rep').textContent = (w.hw ? v.toFixed(1) + '%' : ''); }, setTot = v => { $('jc-total').textContent = Math.round(v); };
    if (tl) { tl.kill(); tl = null; }
    if (!g || reduce()) { setRep(rep); setTot(tot); return; }
    const sheet = $('jc-in'), stamp = $('jc-stamp'), rows = $('jc-stl').children, why = $('jc-why').children;
    const c = { r: 0, t: 0 }; setRep(0); setTot(0);
    g.set([sheet, stamp, '#jc-shape', '.jc-tot', rows, why, '#jc-radar', '.jc-name', '#jcard .row'], { clearProps: 'transform,opacity' });
    tl = g.timeline();
    tl.from(sheet, { y: 90, opacity: 0, duration: 0.3, ease: 'power3.out' })
      .from('#jc-shape', { scale: 0.55, rotation: -10, opacity: 0, duration: 0.45, ease: 'back.out(1.8)' }, '-=0.1')
      .set(stamp, { opacity: 0 }, 0)
      .from('.jc-tot', { opacity: 0, x: 24, duration: 0.25 }, '-=0.2')
      .from(rows, { opacity: 0, x: 26, duration: 0.22, stagger: 0.07, ease: 'power2.out' }, '-=0.1')
      .from('#jc-radar', { opacity: 0, scale: 0.6, duration: 0.3, ease: 'back.out(2)' }, '<')
      .to(c, { t: tot, duration: 0.8, ease: 'power2.out', onUpdate: () => setTot(c.t) }, '-=0.3')
      .fromTo('#jc-total', { scale: 1 }, { scale: 1.28, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out', onStart: () => S().play(o.gold ? 'win' : 'place') })
      // はんこ
      .to(c, { r: rep, duration: w.hw ? 0.7 : 0.01, ease: 'power1.inOut', onStart: () => { g.set(stamp, { opacity: 1, scale: 1 }); stamp.classList.add('ghost'); }, onUpdate: () => setRep(c.r) })
      .add(() => { stamp.classList.remove('ghost'); })
      .fromTo(stamp, { scale: 3.4, rotation: -34, opacity: 0 }, { scale: 1, rotation: -9, opacity: 1, duration: 0.2, ease: 'power4.in' })
      .add(() => {
        S().play('hit'); setRep(rep);
        const r = stamp.getBoundingClientRect(), p = P();
        if (p) p.play('crit', r.left + r.width / 2, r.top + r.height / 2, { scale: 2, palette: INK, lightK: 0.2, seed: (rep * 10) | 0, z: 40 });
      })
      .fromTo(sheet, { x: -9 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.4,0.22)' })
      .fromTo(stamp, { scale: 1.16 }, { scale: 1, duration: 0.3, ease: 'elastic.out(1,0.4)' }, '<')
      .from(why, { opacity: 0, y: 8, duration: 0.2, stagger: 0.05 }, '-=0.25')
      .from(['.jc-name', '#jcard .row'], { opacity: 0, y: 10, duration: 0.22, stagger: 0.06 }, '-=0.1');
  };
  FX.cardSkip = function () { if (tl) tl.progress(1); };
  // 書く画面：1画ごとに、線の終わりに小さな墨しぶき
  FX.stroke = function (x, y) { const p = P(); if (p && !reduce()) p.play('spark', x, y, { scale: 1.5, palette: SUMI, lightK: 0, max: 3, speed: 1.4, z: 12 }); };
})();
