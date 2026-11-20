// PV（紹介動画）の絵：ゲームそのものを、時計を1コマずつ進めながら撮る（30コマ/秒、720×1280）
import { chromium } from "playwright"; import fs from "fs";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"] });
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const ctx = await b.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 2, userAgent: UA, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); p.on("pageerror", (e) => console.log("PAGEERR", e.message)); await p.route(/^https?:/, (r) => r.abort());
await p.addInitScript(() => { localStorage.setItem("jm_lang", JSON.stringify("ja")); let vt = 5000; const d0 = Date.now(); performance.now = () => vt; Date.now = () => d0 + vt; window.__tick = (ms) => { vt += ms; }; });
await p.goto("file:///home/claude/jumaime/dist/dev.html?nonet=1"); await p.waitForTimeout(800);
await p.evaluate(() => { const s = document.createElement("style"); s.textContent = "#skip{display:none!important}"; document.head.appendChild(s); window.__g.lockQuality(); });
const FPS = 15, PART = process.argv[2] || "A"; let n = 0; const TL = {}; fs.mkdirSync("shots/pv/" + PART, { recursive: true });
const step = (ms) => p.evaluate((ms) => new Promise((r) => { window.__tick(ms); requestAnimationFrame(r); }), ms);
const grab = async () => { await step(1000 / 30); await step(1000 / 30); await p.screenshot({ path: `shots/pv/${PART}/f${String(n).padStart(5, "0")}.jpg`, type: "jpeg", quality: 92 }); n++; };
const sec = () => n / FPS;
// A: はじまりの映像（八枚・九枚 → 一枚……足りない → 井戸から出てくる）→ 題字
await p.click("#start"); await p.waitForTimeout(400); await step(50); await p.evaluate(() => window.__g.seekOpening(11.4)); TL.op0 = sec();
if (PART === "A") { for (let i = 0; i < Math.round(12.5 * FPS); i++) await grab(); TL.total = sec(); fs.writeFileSync("shots/pv/A/timeline.json", JSON.stringify(TL)); console.log(JSON.stringify(TL), "frames", n); await b.close(); process.exit(0); }
// C: 屋敷の中。見つかって、走って、追いつかれる
await p.evaluate(() => window.__g.skip()); await p.waitForTimeout(300); await step(50); await p.click("#enter"); await p.waitForTimeout(300); for (let i = 0; i < 16; i++) await step(100);
TL.play0 = sec(); for (let i = 0; i < Math.round(1.4 * FPS); i++) await grab();
await p.evaluate(() => { const g = window.__g, P = g.P, O = g.O, c = { x: Math.floor(P.x / 9) * 9 + 4.5, z: Math.floor(P.z / 9) * 9 + 4.5 }, cl = (v, a, b) => Math.min(b, Math.max(a, v)); O.x = cl(P.x + 3.4, c.x - 3.4, c.x + 3.4); O.z = cl(P.z - 2.6, c.z - 3.4, c.z + 3.4); O.path = []; O.wait = 0; O.state = "wander"; });
TL.found = sec(); for (let i = 0; i < Math.round(0.7 * FPS); i++) await grab();
await p.keyboard.down("Shift"); await p.keyboard.down("KeyA"); await p.keyboard.down("KeyS");
for (let i = 0; i < Math.round(1.6 * FPS) && (await p.evaluate(() => window.__g.mode)) === "play"; i++) await grab();
await p.keyboard.up("Shift"); await p.keyboard.up("KeyA"); await p.keyboard.up("KeyS");
for (let i = 0; i < Math.round(3 * FPS) && (await p.evaluate(() => window.__g.mode)) === "play"; i++) await grab();
if ((await p.evaluate(() => window.__g.mode)) === "play") await p.evaluate(() => window.__g.caught());
TL.caught = sec(); for (let i = 0; i < 6; i++) await grab();
await p.waitForTimeout(600); await step(20); console.log("mode", await p.evaluate(() => window.__g.mode));
// D: 捕まる場面（「お前が…………」の途中から絶叫まで）
await p.evaluate(() => window.__g.seekCatch(3.4)); TL.catch0 = sec(); // この時刻が、捕まる場面の 3.4 秒目
for (let i = 0; i < Math.round((9.95 - 3.4 + 0.6) * FPS); i++) await grab();
// E: 終わりの題字
await p.evaluate(() => { const d = document.createElement("div"); d.id = "pvend"; d.style.cssText = "position:fixed;inset:0;z-index:99;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;opacity:0";
  d.innerHTML = '<div class="t" style="font-size:98px;letter-spacing:.24em">十枚目</div><div style="font-size:16px;letter-spacing:.3em;text-indent:.3em;color:#d9d4c6">ブラウザで　いますぐ遊べる</div><div style="font-size:11px;letter-spacing:.42em;text-indent:.42em;color:#d9d4c6;opacity:.55">なすびのお庭</div>'; document.body.appendChild(d); });
TL.end0 = sec(); for (let i = 0; i < Math.round(3.2 * FPS); i++) { await p.evaluate((k) => (document.querySelector("#pvend").style.opacity = k), Math.min(1, i / 18)); await grab(); }
TL.total = sec(); fs.writeFileSync("shots/pv/B/timeline.json", JSON.stringify(TL)); console.log(JSON.stringify(TL), "frames", n); await b.close();
