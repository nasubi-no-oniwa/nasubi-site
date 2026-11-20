// PV（紹介動画）の音：ゲームと同じ音の仕組みで、鳴らさずに計算して wav にする。時刻は撮った絵の記録（timeline.json）に合わせる
import { chromium } from "playwright"; import fs from "fs";
const A = JSON.parse(fs.readFileSync("shots/pv/A/timeline.json", "utf8")), B = JSON.parse(fs.readFileSync("shots/pv/B/timeline.json", "utf8")), G = A.total;
const T = { total: G + B.total, play0: G + B.play0, found: G + B.found, caught: G + B.caught, c0: G + B.catch0 - 3.4, end0: G + B.end0 }; console.log(JSON.stringify(T));
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--autoplay-policy=no-user-gesture-required", "--disable-gpu"] });
const p = await b.newPage(); p.on("pageerror", (e) => console.log("PAGEERR", e.message)); await p.route(/^https?:/, (r) => r.abort());
await p.goto("file:///home/claude/jumaime/dist/dev.html?nonet=1"); await p.waitForTimeout(1500);
const b64 = await p.evaluate(async (T) => {
  const g = window.__g, Real = window.AudioContext, SR = 44100, N = Math.ceil(SR * T.total), L = g.LINES;
  const render = async (fn) => { window.AudioContext = function () { return new OfflineAudioContext(2, N, SR); }; const s = new g.Sound(); s.init(); window.AudioContext = Real; let base = 0; Object.defineProperty(s, "now", { get: () => base, configurable: true }); fn(s, (t) => { base = t; }); const buf = await s.ctx.startRendering(); return [buf.getChannelData(0), buf.getChannelData(1)]; };
  const CUT = T.c0 + 9.95, OFF2 = T.c0 + 6.55;
  const bed = await render((s) => { s.drone(0.2); });
  const ev = await render((s, at) => {
    const cv = { breath: 0.6, croak: 0.8, croakHz: 24, drive: 3, wet: 0.85, tail: 0.3 };
    s.voice(g.kanaMoras(g.COUNTS[7], 154, 1.12), 0.04, { ...cv, amp: 0.55, pan: 0.25 }); s.voice(g.kanaMoras(g.COUNTS[8], 152, 1.12), 1.36, { ...cv, amp: 0.58, pan: -0.25 });
    s.voice(g.kanaMoras("いちまい", 128, 1.5), 4.2, { amp: 0.6, breath: 0.5, croak: 0.9, croakHz: 21, drive: 4, wet: 0.8, tail: 0.3 });
    s.voice(g.kanaMoras("たりない", 118, 1.6), 5.95, { amp: 0.7, breath: 0.45, croak: 0.95, croakHz: 19, drive: 5, wet: 0.8, tail: 0.5 });
    s.sting(7.0, 3.2, 0.1); s.boom(10.1, 1.2);
    for (let t = T.play0 + 0.3; t < T.found; t += 0.8) s.heart(t, 0.35);
    s.sting(T.found, 1.6, 0.3); s.boom(T.found, 0.7);
    for (let t = T.found + 0.1; t < T.caught; t += 0.42) s.heart(t, 0.8);
    for (let t = T.found + 0.25; t < T.caught; t += 0.9) { at(t); s.croak(0.55, 0.3); }
    for (let t = T.found + 0.7; t < Math.min(T.caught, T.found + 2.3); t += 0.27) { at(t); s.step(0.3); }
    s.sting(T.caught, 0.5, 0.4);
    s.voice(L.omae2.m, T.c0 + 4.1, L.omae2.o); s.heart(OFF2 + 0.08, 0.9); s.heart(OFF2 + 0.47, 1.0);
    const T3 = T.c0 + 7.35; s.boom(T3, 1.3); s.sting(T3, 2.4, 0.42); s.voice(L.hameta.m, T3, L.hameta.o);
    s.voice(L.hameta.m.map((m) => ({ ...m, f: m.f.map((x) => x * 0.5), fp: m.fp && m.fp.map(([u, x]) => [u, x * 0.502]) })), T3 + 0.012, { ...L.hameta.o, amp: 0.8, croak: 0.9, croakHz: 33, breath: 0.6, pan: -0.2 });
    s.voice(L.hameta.m.map((m) => ({ ...m, f: m.f.map((x) => x * 1.5), fp: m.fp && m.fp.map(([u, x]) => [u, x * 1.49]) })), T3 + 0.02, { ...L.hameta.o, amp: 0.45, breath: 0.8, pan: 0.3 });
  });
  const tail = await render((s) => { s.shatter(CUT, 1.0); s.ring(CUT + 0.05, 2.4, 0.04); s.boom(T.end0 + 0.25, 0.5); });
  const out = [new Float32Array(N), new Float32Array(N)]; let peak = 0;
  for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) { const t = i / SR, eb = t < OFF2 ? Math.min(1, t / 1.2) : Math.max(0, 1 - (t - OFF2) / 0.03), ee = t < CUT - 0.004 ? 1 : 0; const v = bed[c][i] * eb + ev[c][i] * ee + tail[c][i]; out[c][i] = v; if (Math.abs(v) > peak) peak = Math.abs(v); }
  const k = peak > 0 ? Math.min(3, 0.92 / peak) : 1, pcm = new Int16Array(N * 2); for (let i = 0; i < N; i++) { pcm[i * 2] = Math.max(-1, Math.min(1, out[0][i] * k)) * 32767; pcm[i * 2 + 1] = Math.max(-1, Math.min(1, out[1][i] * k)) * 32767; }
  const u8 = new Uint8Array(pcm.buffer); let bin = ""; for (let i = 0; i < u8.length; i += 32768) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 32768)); return { b64: btoa(bin), peak, k };
}, T);
console.log("peak", b64.peak, "gain", b64.k);
const pcm = Buffer.from(b64.b64, "base64"), h = Buffer.alloc(44); h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVEfmt ", 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(44100, 24); h.writeUInt32LE(44100 * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
fs.writeFileSync("shots/pv/audio.wav", Buffer.concat([h, pcm])); console.log("audio.wav", (pcm.length / 176400).toFixed(2), "s"); await b.close();
