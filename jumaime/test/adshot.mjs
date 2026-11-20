// 広告の場所の確認画像（スマホの大きさ 375×812 と 375×667）。広告の部品は本物と同じものを手元で動かし、広告の中身だけ番号の枠で代用する
import { chromium } from "playwright"; import fs from "fs"; import path from "path";
import { mockFirebase } from "./test/mock.mjs";
const HOME = "/home/claude/nasubi-no-oniwa/homepage", UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"] });
fs.mkdirSync("shots/ad", { recursive: true }); const TYPES = { ".js": "text/javascript", ".json": "application/json", ".html": "text/html", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp" };
const label = async (p, start) => p.evaluate((start) => {
  const NUM = "①②③④⑤⑥⑦⑧"; let n = start; const out = [];
  for (const el of document.querySelectorAll(".nsb-ad")) { const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1 || getComputedStyle(el).display === "none") continue; let ok = true; for (let x = el; x && x.nodeType === 1; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === "none" || parseFloat(s.opacity) < 0.05) ok = false; } if (!ok) continue;
    let m = el.querySelector(".__lab"); if (!m) { m = document.createElement("div"); m.className = "__lab"; el.style.position = "relative"; el.appendChild(m); }
    const big = r.height > 100; m.style.cssText = "position:absolute;inset:0;z-index:9;display:flex;align-items:center;justify-content:center;background:rgba(190,30,30,.3);outline:2px dashed #ff5a4a;outline-offset:-2px;color:#fff;font:700 " + (big ? 20 : 15) + "px sans-serif;letter-spacing:0;text-shadow:0 0 4px #000";
    m.textContent = NUM[n] + (big ? " 大きい広告 300×250" : " 広告の帯 320×50"); out.push(NUM[n] + (big ? "大" : "帯") + " y=" + Math.round(r.top) + "〜" + Math.round(r.bottom)); n++; }
  return { n, out };
}, start);
for (const [W, H] of [[375, 812], [375, 667]]) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, userAgent: UA, locale: "ja-JP", hasTouch: true, isMobile: true });
  const p = await ctx.newPage(); p.on("pageerror", (e) => console.log("PAGEERR", e.message));
  await p.route(/^https?:/, (r) => r.abort());
  const S = mockFirebase(p);
  await p.route(/^https:\/\/nasubi-no-oniwa\.github\.io\//, (route) => { const u = new URL(route.request().url()); let f = path.join(HOME, decodeURIComponent(u.pathname)); if (f.endsWith("/")) f += "index.html"; if (!fs.existsSync(f)) return route.fulfill({ status: 404, body: "" }); route.fulfill({ status: 200, contentType: TYPES[path.extname(f)] || "application/octet-stream", body: fs.readFileSync(f) }); });
  await p.addInitScript(() => localStorage.setItem("jm_lang", JSON.stringify("ja")));
  await p.goto("file:///home/claude/jumaime/dist/dev.ad.html"); await p.waitForTimeout(1800);
  const snap = async (name, sel, start) => { // 最初に見える範囲と、いちばん下まで送ったところ
    const r = await label(p, start); const f1 = `shots/ad/${name}_${W}x${H}_a.png`; await p.screenshot({ path: f1 });
    const more = await p.evaluate((sel) => { const e = document.querySelector(sel); const m = e.scrollHeight - e.clientHeight; e.scrollTop = m; return m; }, sel); await p.waitForTimeout(500);
    let f2 = ""; if (more > 4) { await label(p, start); f2 = `shots/ad/${name}_${W}x${H}_b.png`; await p.screenshot({ path: f2 }); }
    const pos2 = await p.evaluate(() => [...document.querySelectorAll(".nsb-ad")].filter((e) => e.getBoundingClientRect().height > 0).map((e) => Math.round(e.getBoundingClientRect().top)).join(","));
    await p.evaluate((sel) => (document.querySelector(sel).scrollTop = 0), sel);
    console.log(`${W}x${H} ${name}: ${r.out.join(" / ")} | 下へ送れる量 ${more}px | 送ったあとの位置 ${pos2}`); return r.n;
  };
  let n = await snap("1title", "#title", 0);
  await p.click("#start"); await p.waitForTimeout(1500); await p.evaluate(() => window.__g.skip()); await p.waitForTimeout(1000); await p.click("#enter"); await p.waitForTimeout(1500);
  await p.screenshot({ path: `shots/ad/2play_${W}x${H}.png` }); console.log("遊んでいる最中に見えている広告の数:", await p.evaluate(() => [...document.querySelectorAll(".nsb-ad")].filter((e) => { for (let x = e; x && x.nodeType === 1; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === "none" || parseFloat(s.opacity) < 0.05) return false; } return e.getBoundingClientRect().height > 0; }).length));
  await p.evaluate(() => { const g = window.__g; g.time = 83.45; g.P.hasKey = true; g.escape(); }); S.skew += 84000; await p.waitForTimeout(5200);
  n = await snap("3result_win", "#result", n);
  console.log("次のゲームの行:", await p.evaluate(() => { const c = document.querySelector("#result .card"); return [...c.children].map((e) => (e.id || e.className || e.tagName) + ":" + Math.round(e.getBoundingClientRect().height)).join(" "); }));
  await p.click("#again"); await p.waitForTimeout(1500); await p.evaluate(() => { const g = window.__g; g.time = 47; g.caught(); }); await p.waitForTimeout(700); await p.evaluate(() => window.__g.seekCatch(11.6)); await p.waitForTimeout(3500);
  await snap("4result_lose", "#result", 2);
  await ctx.close();
}
await b.close();
