// 音はすべてその場で合成する（素材なし）。声は「つぶれた、雑音に近い声」で、音程（抑揚）だけ日本語に合わせる
const F = { // 母音ごとの響き（フォルマント）
  a: [850, 1300, 2800], i: [320, 2400, 3100], u: [360, 1250, 2500], e: [520, 1950, 2700], o: [500, 880, 2700], n: [260, 1100, 2400],
};

export class Sound {
  constructor() { this.ctx = null; }
  init() {
    if (this.ctx) { if (this.ctx.state === "suspended") this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; const c = (this.ctx = new AC());
    this.master = c.createGain(); this.master.gain.value = 0.9;
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 8; comp.attack.value = 0.002; comp.release.value = 0.2;
    this.master.connect(comp); comp.connect(c.destination);
    this.rev = c.createConvolver(); this.rev.buffer = this.impulse(3.4, 2.2);
    this.revGain = c.createGain(); this.revGain.gain.value = 0.55; this.rev.connect(this.revGain); this.revGain.connect(this.master);
    this.noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = this.noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  get now() { return this.ctx.currentTime; }
  impulse(sec, decay) {
    const c = this.ctx, b = c.createBuffer(2, c.sampleRate * sec, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, decay) * (i < 400 ? i / 400 : 1); }
    return b;
  }
  noise() { const s = this.ctx.createBufferSource(); s.buffer = this.noiseBuf; s.loop = true; s.loopStart = Math.random(); return s; }
  out(node, wet = 0.4, pan = 0) {
    const c = this.ctx; let n = node;
    if (c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = pan; n.connect(p); n = p; }
    n.connect(this.master); const w = c.createGain(); w.gain.value = wet; n.connect(w); w.connect(this.rev);
  }
  shaper(k) {
    const ws = this.ctx.createWaveShaper(), n = 1024, cv = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; cv[i] = Math.tanh(x * k) * (1 - 0.15 * Math.sin(x * 9)); }
    ws.curve = cv; ws.oversample = "2x"; return ws;
  }

  /** 声。moras = [{c:子音, v:母音, d:長さ秒, f:[始まりの高さ, 終わりの高さ]}] 。戻り値は各モーラの開始時刻 */
  voice(moras, t0, o = {}) {
    const c = this.ctx, { amp = 0.6, breath = 0.5, croak = 0.6, croakHz = 27, drive = 3, vib = 0.02, vibHz = 6, pan = 0, wet = 0.5, shriek = 0 } = o;
    const total = moras.reduce((s, m) => s + m.d, 0), tEnd = t0 + total + 0.4;
    const o1 = c.createOscillator(), o2 = c.createOscillator(), o3 = c.createOscillator();
    o1.type = "sawtooth"; o2.type = "sawtooth"; o3.type = "square"; o2.detune.value = 19;
    const voiced = c.createGain(); voiced.gain.value = 0;
    const g3 = c.createGain(); g3.gain.value = 0.35; o1.connect(voiced); o2.connect(voiced); o3.connect(g3); g3.connect(voiced);
    // がらがらした喉（低い周期でぶつ切りにする）
    const cr = c.createOscillator(); cr.type = "square"; cr.frequency.value = croakHz; const crG = c.createGain(); crG.gain.value = croak * 0.5;
    const crJ = c.createOscillator(); crJ.frequency.value = 3.1; const crJG = c.createGain(); crJG.gain.value = croakHz * 0.3; crJ.connect(crJG); crJG.connect(cr.frequency);
    const am = c.createGain(); am.gain.value = 1 - croak * 0.5; cr.connect(crG); crG.connect(am.gain); voiced.connect(am);
    const lfo = c.createOscillator(); lfo.frequency.value = vibHz; const lg = c.createGain(); lfo.connect(lg);
    const nz = this.noise(), nG = c.createGain(); nG.gain.value = 0; nz.connect(nG);
    const bus = c.createGain(); am.connect(bus); nG.connect(bus);
    const fs = [0, 1, 2].map((k) => { const f = c.createBiquadFilter(); f.type = "bandpass"; f.Q.value = [5, 9, 9][k]; const g = c.createGain(); g.gain.value = [1, 0.7, 0.4][k]; bus.connect(f); f.connect(g); return { f, g }; });
    const sum = c.createGain(); fs.forEach((x) => x.g.connect(sum));
    const ws = this.shaper(drive); const pre = c.createGain(); pre.gain.value = 2.2; sum.connect(pre); pre.connect(ws);
    const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 140; const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 5200;
    const env = c.createGain(); env.gain.value = 0; ws.connect(hp); hp.connect(lp); lp.connect(env); this.out(env, wet, pan);
    // 子音用の雑音
    const cn = this.noise(), cf = c.createBiquadFilter(), cg = c.createGain(); cg.gain.value = 0; cf.type = "bandpass"; cn.connect(cf); cf.connect(cg); this.out(cg, wet * 0.6, pan);
    let t = t0; const starts = [];
    env.gain.setValueAtTime(0, t0);
    const setF = (v, at, tc) => fs.forEach((x, k) => x.f.frequency.setTargetAtTime(F[v][k] * (1 + shriek * 0.12), at, tc));
    fs.forEach((x, k) => x.f.frequency.setValueAtTime(F[moras[0].v][k], t0));
    [o1, o2].forEach((os) => os.frequency.setValueAtTime(moras[0].f[0], t0)); o3.frequency.setValueAtTime(moras[0].f[0] / 2, t0);
    for (const m of moras) {
      starts.push(t - t0);
      const c0 = m.c || "", a = (m.a ?? 1) * amp; let vs = t; // vs: 母音が鳴り始める時刻
      if ("kt".includes(c0) && c0) { env.gain.setTargetAtTime(0, t, 0.008); vs = t + 0.045; cf.frequency.setValueAtTime(c0 === "k" ? 2100 : 4200, t); cf.Q.value = 1.2; cg.gain.setValueAtTime(0, vs - 0.012); cg.gain.linearRampToValueAtTime(a * 0.9, vs); cg.gain.setTargetAtTime(0, vs + 0.012, 0.012); }
      else if (c0 === "g") { env.gain.setTargetAtTime(a * 0.25, t, 0.01); vs = t + 0.04; cf.frequency.setValueAtTime(1500, t); cg.gain.setValueAtTime(a * 0.5, vs - 0.005); cg.gain.setTargetAtTime(0, vs, 0.01); }
      else if (c0 === "s" || c0 === "h") { const L = Math.min(0.09, m.d * 0.5); env.gain.setTargetAtTime(0, t, 0.01); cf.frequency.setValueAtTime(c0 === "s" ? 3400 : 1400, t); cf.Q.value = c0 === "s" ? 1.5 : 0.6; cg.gain.setTargetAtTime(a * (c0 === "s" ? 0.8 : 0.55), t, 0.012); cg.gain.setTargetAtTime(0, t + L, 0.015); vs = t + L; }
      else if (c0 === "m" || c0 === "n") { setF("n", t, 0.008); env.gain.setTargetAtTime(a * 0.4, t, 0.012); vs = t + 0.055; }
      else if (c0 === "w") { setF("u", t, 0.005); env.gain.setTargetAtTime(a * 0.6, t, 0.012); vs = t + 0.04; }
      setF(m.v, vs, c0 === "w" ? 0.03 : 0.014);
      env.gain.setTargetAtTime(a, vs, 0.016);
      voiced.gain.setTargetAtTime(1 - breath * 0.75, vs, 0.02); nG.gain.setTargetAtTime(breath * 1.6 + shriek * 0.5, vs, 0.02);
      const [f0, f1] = m.f, pts = m.fp || [[0, f0], [1, f1]];
      for (const [u, fv] of pts) { const at = t + u * m.d; [o1, o2].forEach((os) => os.frequency.linearRampToValueAtTime(fv, Math.max(at, t + 0.001))); o3.frequency.linearRampToValueAtTime(fv / 2, Math.max(at, t + 0.001)); }
      lg.gain.setTargetAtTime((m.vib ?? vib) * f1, t, 0.05);
      t += m.d;
    }
    lg.connect(o1.frequency); lg.connect(o2.frequency);
    env.gain.setTargetAtTime(0, t, o.tail ?? 0.06);
    [o1, o2, o3, cr, crJ, lfo, nz, cn].forEach((n) => { n.start(t0); n.stop(tEnd + 0.5); });
    return { starts, total };
  }

  boom(t, a = 1) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(26, t + 0.9);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.008); g.gain.exponentialRampToValueAtTime(0.001, t + 1.6); o.connect(g); this.out(g, 0.5); o.start(t); o.stop(t + 1.7);
    const n = this.noise(), f = c.createBiquadFilter(), ng = c.createGain(); f.type = "lowpass"; f.frequency.setValueAtTime(2600, t); f.frequency.exponentialRampToValueAtTime(120, t + 0.5);
    ng.gain.setValueAtTime(a * 0.9, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.6); n.connect(f); f.connect(ng); this.out(ng, 0.6); n.start(t); n.stop(t + 0.7);
  }
  heart(t, a = 0.8) { for (const [d, k] of [[0, 1], [0.17, 0.7]]) { const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(64, t + d); o.frequency.exponentialRampToValueAtTime(34, t + d + 0.14); g.gain.setValueAtTime(0, t + d); g.gain.linearRampToValueAtTime(a * k, t + d + 0.012); g.gain.exponentialRampToValueAtTime(0.001, t + d + 0.24); o.connect(g); g.connect(this.master); o.start(t + d); o.stop(t + d + 0.3); } }
  /** 不協和な金切り音（目が合った瞬間など） */
  sting(t, dur = 1.8, a = 0.5) {
    const c = this.ctx, g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.01); g.gain.setTargetAtTime(0, t + dur * 0.5, dur * 0.25);
    const f = c.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 700; f.connect(g); this.out(g, 0.8);
    for (const fr of [1318, 1397, 1865, 1976, 2637, 2794]) { const o = c.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(fr * 0.97, t); o.frequency.linearRampToValueAtTime(fr * 1.03, t + dur); const og = c.createGain(); og.gain.value = 0.16; o.connect(og); og.connect(f); o.start(t); o.stop(t + dur + 1); }
  }
  /** 皿の割れる音 */
  shatter(t, a = 0.9) {
    const c = this.ctx;
    for (let i = 0; i < 16; i++) {
      const at = t + (i === 0 ? 0 : 0.02 + Math.random() * Math.random() * 0.9), n = this.noise(), f = c.createBiquadFilter(), g = c.createGain();
      f.type = "bandpass"; f.frequency.value = 2400 + Math.random() * 6000; f.Q.value = 14 + Math.random() * 22;
      const v = a * (i === 0 ? 1.6 : 0.3 + Math.random() * 0.7); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(v * 3, at + 0.002); g.gain.exponentialRampToValueAtTime(0.001, at + 0.07 + Math.random() * 0.3);
      n.connect(f); f.connect(g); this.out(g, 0.35, Math.random() * 1.4 - 0.7); n.start(at); n.stop(at + 0.5);
    }
    const n = this.noise(), g = c.createGain(), hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1800; g.gain.setValueAtTime(a * 1.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.09); n.connect(hp); hp.connect(g); g.connect(this.master); n.start(t); n.stop(t + 0.12);
  }
  /** 耳鳴り */
  ring(t, dur = 3, a = 0.05) { const c = this.ctx, o = c.createOscillator(), g = c.createGain(); o.frequency.value = 7300; g.gain.setValueAtTime(a, t); g.gain.exponentialRampToValueAtTime(0.0005, t + dur); o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur); }
  /** 低いうなり。返り値の stop(秒) で消える */
  drone(a = 0.22) {
    const c = this.ctx, g = c.createGain(), t = this.now; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 2.5);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 210; lp.Q.value = 3; lp.connect(g); this.out(g, 0.6);
    const os = [41.2, 43.4, 61.9, 82.1].map((f, i) => { const o = c.createOscillator(); o.type = i < 2 ? "sawtooth" : "triangle"; o.frequency.value = f; const og = c.createGain(); og.gain.value = i < 2 ? 0.5 : 0.25; o.connect(og); og.connect(lp); o.start(); return o; });
    const l = c.createOscillator(); l.frequency.value = 0.09; const lgn = c.createGain(); lgn.gain.value = 90; l.connect(lgn); lgn.connect(lp.frequency); l.start();
    const n = this.noise(), nf = c.createBiquadFilter(), ng = c.createGain(); nf.type = "bandpass"; nf.frequency.value = 420; nf.Q.value = 0.7; ng.gain.value = 0.05; n.connect(nf); nf.connect(ng); ng.connect(g); n.start();
    return { gain: g, stop: (sec = 0.05) => { const tt = this.now; g.gain.cancelScheduledValues(tt); g.gain.setTargetAtTime(0, tt, sec / 3); [...os, l, n].forEach((x) => x.stop(tt + sec + 0.5)); } };
  }
}

// ---- セリフ（音程は日本語のアクセントに合わせる。高さの単位は Hz） ----
export const LINES = {
  // お前が……（耳元のささやき。低く、がらがら）
  omae1: { o: { amp: 0.5, breath: 0.85, croak: 0.95, croakHz: 23, drive: 2.5, pan: -0.55, wet: 0.7, tail: 0.25 },
    m: [{ v: "o", d: 0.26, f: [118, 122] }, { c: "m", v: "a", d: 0.25, f: [138, 142] }, { v: "e", d: 0.24, f: [142, 140] }, { c: "g", v: "a", d: 0.8, f: [136, 82], a: 0.8 }] },
  // お前が…………（しぼり出す。震えて、少し高く）
  omae2: { o: { amp: 0.75, breath: 0.55, croak: 0.8, croakHz: 31, drive: 4, pan: 0.35, wet: 0.6, vib: 0.045, vibHz: 7.5, tail: 0.3 },
    m: [{ v: "o", d: 0.34, f: [150, 162] }, { c: "m", v: "a", d: 0.3, f: [205, 214] }, { v: "e", d: 0.3, f: [216, 212] }, { c: "g", v: "a", d: 1.25, f: [208, 120], fp: [[0, 208], [0.5, 214], [1, 120]], a: 0.9 }] },
  // 私をはめたのか！！！（絶叫）
  hameta: { o: { amp: 1.25, breath: 0.35, croak: 0.45, croakHz: 44, drive: 9, wet: 0.75, vib: 0.03, vibHz: 9, shriek: 1, tail: 0.12 },
    m: [{ c: "w", v: "a", d: 0.15, f: [430, 440] }, { c: "t", v: "a", d: 0.15, f: [448, 450] }, { c: "s", v: "i", d: 0.16, f: [452, 452] }, { v: "o", d: 0.2, f: [452, 448] },
      { c: "h", v: "a", d: 0.16, f: [450, 455] }, { c: "m", v: "e", d: 0.17, f: [460, 464] }, { c: "t", v: "a", d: 0.17, f: [466, 468] }, { c: "n", v: "o", d: 0.2, f: [468, 472] },
      { c: "k", v: "a", d: 1.5, f: [480, 440], fp: [[0, 480], [0.15, 496], [0.82, 492], [1, 440]], vib: 0.045 }] },
};

// ---- 皿を数える声（かなから作る。音程は「低→高…」の平板で、最後だけ下がる） ----
const KANA = { い: ["", "i"], ち: ["t", "i"], ま: ["m", "a"], に: ["n", "i"], さ: ["s", "a"], ん: ["n", "n"], よ: ["", "o"], ご: ["g", "o"], ろ: ["n", "o"], く: ["k", "u"], な: ["n", "a"], は: ["h", "a"], き: ["k", "i"], ゅ: ["", "u"], う: ["", "u"], た: ["t", "a"], り: ["n", "i"], ー: ["", null] };
export function kanaMoras(kana, base = 150, slow = 1) {
  const out = []; let lastV = "a";
  [...kana].forEach((ch, i, arr) => {
    const k = KANA[ch]; if (!k) return; const v = k[1] || lastV; lastV = v;
    const lastOne = i === arr.length - 1, hi = i === 0 ? 0.84 : 1;
    out.push({ c: k[0], v, d: (lastOne ? 0.62 : 0.2) * slow, f: lastOne ? [base * hi, base * 0.62] : [base * hi, base * hi] });
  });
  return out;
}
export const COUNTS = ["いちまい", "にまい", "さんまい", "よんまい", "ごまい", "ろくまい", "ななまい", "はちまい", "きゅうまい"];
export const COUNT_KANJI = ["一枚", "二枚", "三枚", "四枚", "五枚", "六枚", "七枚", "八枚", "九枚"];

// ---- 屋敷で使う小さな音 ----
Object.assign(Sound.prototype, {
  step(a = 0.2, pan = 0) { // 畳をふむ音
    const c = this.ctx, t = this.now, n = this.noise(), f = c.createBiquadFilter(), g = c.createGain(); f.type = "lowpass"; f.frequency.value = 260 + Math.random() * 120;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.008); g.gain.exponentialRampToValueAtTime(0.001, t + 0.09); n.connect(f); f.connect(g); this.out(g, 0.25, pan); n.start(t); n.stop(t + 0.12);
    const n2 = this.noise(), f2 = c.createBiquadFilter(), g2 = c.createGain(); f2.type = "bandpass"; f2.frequency.value = 2200; f2.Q.value = 0.7; g2.gain.setValueAtTime(a * 0.12, t); g2.gain.exponentialRampToValueAtTime(0.001, t + 0.06); n2.connect(f2); f2.connect(g2); g2.connect(this.master); n2.start(t); n2.stop(t + 0.08);
  },
  clink(a = 0.2) { // 頭の皿がかたかた鳴る
    const c = this.ctx, t = this.now; for (const fr of [2700 + Math.random() * 900, 4300 + Math.random() * 1200]) { const o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = fr; g.gain.setValueAtTime(a, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.07 + Math.random() * 0.05); o.connect(g); this.out(g, 0.3); o.start(t); o.stop(t + 0.15); }
  },
  slide(a = 0.3) { // 襖をひく
    const c = this.ctx, t = this.now, n = this.noise(), f = c.createBiquadFilter(), g = c.createGain(); f.type = "bandpass"; f.Q.value = 1.4; f.frequency.setValueAtTime(820, t); f.frequency.exponentialRampToValueAtTime(260, t + 0.36);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.05); g.gain.setTargetAtTime(0, t + 0.28, 0.04); n.connect(f); f.connect(g); this.out(g, 0.3); n.start(t); n.stop(t + 0.5); this.step(a * 0.8);
  },
  chime(a = 0.25) { // 鍵をひろう
    const c = this.ctx, t = this.now; [1318, 1976, 2637].forEach((fr, i) => { const o = c.createOscillator(), g = c.createGain(); o.frequency.value = fr; g.gain.setValueAtTime(0, t + i * 0.07); g.gain.linearRampToValueAtTime(a / (i + 1), t + i * 0.07 + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + 1.4); o.connect(g); this.out(g, 0.9); o.start(t); o.stop(t + 1.5); });
  },
  creak(a = 0.4) { // 門がきしむ
    const c = this.ctx, t = this.now, o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(), l = c.createOscillator(), lg = c.createGain(); o.type = "sawtooth"; o.frequency.setValueAtTime(92, t); o.frequency.linearRampToValueAtTime(58, t + 1.6);
    f.type = "bandpass"; f.Q.value = 6; f.frequency.setValueAtTime(500, t); f.frequency.linearRampToValueAtTime(1300, t + 1.6); l.frequency.value = 13; lg.gain.value = 0.5; l.connect(lg); lg.connect(g.gain);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.15); g.gain.setTargetAtTime(0, t + 1.4, 0.15); o.connect(f); f.connect(g); this.out(g, 0.8); o.start(t); l.start(t); o.stop(t + 2.2); l.stop(t + 2.2); this.boom(t + 1.5, 0.5);
  },
  bell(a = 0.2, pan = 0) { // 鍵についた鈴。近いほど大きく、左右から聞こえる
    const c = this.ctx, t0 = this.now;
    [0, 0.11, 0.2].forEach((dl, k) => [2637, 3520, 4699].forEach((fr, i) => { const o = c.createOscillator(), g = c.createGain(), t = t0 + dl; o.frequency.value = fr * (1 + (k - 1) * 0.004); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime((a * (k === 0 ? 1 : 0.55)) / (i + 1), t + 0.004); g.gain.exponentialRampToValueAtTime(0.0008, t + 0.5); o.connect(g); this.out(g, 0.7, pan); o.start(t); o.stop(t + 0.6); }));
  },
  croak(a = 0.4, pan = 0) { // 追ってくるときの、のどの音
    this.voice([{ v: "a", d: 0.5 + Math.random() * 0.3, f: [112 + Math.random() * 20, 80] }], this.now + 0.01, { amp: a, breath: 0.5, croak: 1, croakHz: 19 + Math.random() * 6, drive: 5, pan, wet: 0.7, tail: 0.2 });
  },
});
