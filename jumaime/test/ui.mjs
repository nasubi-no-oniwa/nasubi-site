// 画面の確認：4つの言葉の題・やること・結果・ランキング、記録の送信（Firebase はまねで代用）
import { chromium } from "playwright"; import fs from "fs";
import { mockFirebase } from "./test/mock.mjs";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"] });
const what = process.argv[2] || "all", W = +(process.argv[3] || 375), H = +(process.argv[4] || 667); fs.mkdirSync("shots/ui", { recursive: true });
const errs = [];
async function open(lang, opts = {}) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, locale: "ja-JP", userAgent: opts.ua });
  const p = await ctx.newPage(); p.on("console", (m) => { if (m.type() === "error" && !/net::ERR|Failed to load resource/.test(m.text())) errs.push(lang + ": " + m.text()); }); p.on("pageerror", (e) => errs.push(lang + ": PAGEERR " + e.message));
  const S = mockFirebase(p, opts);
  await p.addInitScript((l) => { try { localStorage.setItem("jm_lang", JSON.stringify(l)); } catch (e) { } }, lang);
  await p.goto("file:///home/claude/jumaime/dist/dev.html"); await p.waitForTimeout(900); return { p, S, ctx };
}
const shot = async (p, name) => { const f = `shots/ui/${name}_${W}x${H}.png`; await p.screenshot({ path: f }); console.log(f); };
const langs = what === "ja" ? ["ja"] : ["ja", "en", "zh", "ko"];
for (const lang of langs) {
  const st0 = Date.now() - 86400000 * 3, seedRows = { u1: { n: "おきく", t: 95210, p: 1, st: st0, v: 1, at: st0 + 99000 }, u2: { n: "Banchō", t: 131050, p: 0, st: st0 + 5, v: 1, at: st0 + 140000 }, u3: { n: "十枚目の皿を割った人", t: 214730, p: 0, st: st0 + 9, v: 1, at: st0 + 220000 }, cheat: { n: "ずる", t: 15000, p: 1, st: st0 + 11, v: 1, at: st0 + 16000 } };
  const { p, S, ctx } = await open(lang, { seedRows });
  await shot(p, `${lang}_1title`);
  await p.click("#rankBtn"); await p.waitForTimeout(700); await shot(p, `${lang}_2rank_all0`); await p.click("#tabA"); await p.waitForTimeout(700); await shot(p, `${lang}_2rank_all`); await p.click("#rkBack");
  await p.click("#start"); await p.waitForTimeout(1500); await p.evaluate(() => window.__g.seekOpening(9)); await p.waitForTimeout(700); await shot(p, `${lang}_3opening`);
  await p.evaluate(() => window.__g.seekOpening(17.3)); await p.waitForTimeout(900); await shot(p, `${lang}_3opening2`);
  await p.evaluate(() => window.__g.seekOpening(24.3)); await p.waitForTimeout(2300); await shot(p, `${lang}_3opening3`);
  await p.evaluate(() => window.__g.skip()); await p.waitForTimeout(1100); await shot(p, `${lang}_4howto`);
  await p.click("#enter"); await p.waitForTimeout(2600); await shot(p, `${lang}_5play`);
  // 逃げきったことにして結果へ（時間は 83.45 秒。まねのサーバーの時計も、その分だけ進める）
  await p.evaluate(() => { const g = window.__g; g.time = 83.45; g.P.hasKey = true; g.escape(); }); S.skew += 84000; await p.waitForTimeout(3600); await shot(p, `${lang}_6result_win`);
  await p.fill("#nm", lang === "en" ? "Okiku" : "なすび"); await p.click("#recBtn"); await p.waitForTimeout(1500); await shot(p, `${lang}_7result_sent`);
  console.log(lang, "msg:", await p.textContent("#recMsg"), "| writes:", JSON.stringify(S.log));
  await p.click("#rankBtn2"); await p.waitForTimeout(800); await shot(p, `${lang}_8rank_today`); await p.click("#tabA"); await p.waitForTimeout(800); await shot(p, `${lang}_8rank_all`);
  console.log(lang, "rows:", await p.evaluate(() => [...document.querySelectorAll("#rkList .rk")].map((r) => r.textContent).join(" / ")));
  await p.click("#rkBack");
  const url = await p.evaluate(() => { let u = ""; const o = window.open; window.open = (x) => { u = x; return null; }; document.querySelector("#xBtn").click(); window.open = o; return decodeURIComponent(u); }); console.log(lang, "X:", url.replace(/\n/g, " ⏎ "));
  // もう一度 → 捕まる
  await p.click("#again"); await p.waitForTimeout(1500); await p.evaluate(() => { const g = window.__g; g.time = 47; g.caught(); }); await p.waitForTimeout(2300); await shot(p, `${lang}_9catch1`);
  await p.waitForTimeout(3300); await shot(p, `${lang}_9catch2`); await p.waitForTimeout(3300); await shot(p, `${lang}_9catch3`); await p.waitForTimeout(4600); await shot(p, `${lang}_9result_lose`);
  await ctx.close();
}
console.log(errs.length ? "ERRORS:\n" + errs.join("\n") : "no errors"); await b.close();
