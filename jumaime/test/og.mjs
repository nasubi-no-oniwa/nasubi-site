// アイコンとSNS用の画像を、ゲームの絵そのものから作る（捕まる場面のお菊さん＋題字）
import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"] });
async function make(W, H, name, overlay, times) {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 }); const p = await ctx.newPage(); await p.route(/^https?:/, (r) => r.abort());
  await p.addInitScript(() => localStorage.setItem("jm_lang", JSON.stringify("ja")));
  await p.goto("file:///home/claude/jumaime/dist/dev.html?nonet=1"); await p.waitForTimeout(700); await p.click("#start"); await p.waitForTimeout(900); await p.evaluate(() => window.__g.skip()); await p.waitForTimeout(900); await p.click("#enter"); await p.waitForTimeout(800);
  await p.evaluate(() => window.__g.caught()); await p.waitForTimeout(700);
  await p.evaluate((html) => { const s = document.createElement("style"); s.textContent = "#subs{display:none!important}"; document.head.appendChild(s); const d = document.createElement("div"); d.innerHTML = html; document.body.appendChild(d); }, overlay);
  for (const t of times) { await p.evaluate((t) => window.__g.seekCatch(t - 0.9), t); await p.waitForTimeout(900); await p.screenshot({ path: `shots/${name}_${t}.png` }); }
  await ctx.close();
}
const what = process.argv[2] || "both", times = process.argv.slice(3).map(Number);
if (what !== "icon") await make(1200, 630, "ogp", `<div style="position:fixed;inset:0;background:linear-gradient(90deg,rgba(0,0,0,0) 46%,rgba(0,0,0,.82) 74%,#000 100%)"></div>
<div class="t" style="position:fixed;right:118px;top:50%;transform:translateY(-50%);font-size:168px;letter-spacing:.2em">十枚目</div>
<div style="position:fixed;right:64px;top:92px;writing-mode:vertical-rl;font-size:22px;letter-spacing:.5em;color:#cfc9ba;opacity:.8">番町皿屋敷より</div>
<div style="position:fixed;right:372px;top:150px;writing-mode:vertical-rl;font-size:34px;letter-spacing:.42em;font-weight:600;color:#e6e0d0;filter:url(#ink1)">一枚、足りない。</div>`, times.length ? times : [8.0, 8.4, 8.8, 9.2]);
if (what !== "ogp") await make(512, 512, "icon", `<div style="position:fixed;inset:0;background:linear-gradient(90deg,rgba(0,0,0,0) 52%,rgba(0,0,0,.75) 86%,#000 100%)"></div>
<div class="t" style="position:fixed;right:26px;top:50%;transform:translateY(-50%);font-size:112px;letter-spacing:.16em">十枚目</div>`, times.length ? times : [8.0, 8.4, 8.8, 9.2]);
await b.close();
