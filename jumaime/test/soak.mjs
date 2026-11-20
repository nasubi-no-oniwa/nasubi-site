import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"] });
const p = await b.newPage({ viewport: { width: 390, height: 780 } });
p.on("console", (m) => { if (m.type() === "error") console.log("ERR", m.text()); }); p.on("pageerror", (e) => console.log("PAGEERR", e.message));
await p.route(/googleapis|gstatic|googletagmanager|firebasedatabase/, (r) => r.abort()); await p.goto("file:///home/claude/jumaime/dist/dev.html?nonet=1"); await p.waitForTimeout(1200);
await p.click("#start"); await p.waitForTimeout(800); await p.evaluate(() => window.__g.skip()); await p.waitForTimeout(900); await p.click("#enter"); await p.waitForTimeout(500);
const N = +(process.argv[2] || 12), out = [];
for (let i = 0; i < N; i++) {
  const r = await p.evaluate(async (i) => {
    const g = window.__g; await g.newRun(false);
    const S = 9, GW = 6, style = i % 4; // 0: 歩いて鍵→門 1: ずっと走る 2: 追われたら走る 3: うろうろするだけ
    const P = g.P, O = g.O, map = g.map, world = g.world;
    const roomOf = (x, z) => Math.min(5, Math.max(0, Math.floor(x / S))) + GW * Math.min(5, Math.max(0, Math.floor(z / S)));
    const center = (i) => ({ x: (i % GW) * S + S / 2, z: Math.floor(i / GW) * S + S / 2 });
    const door = (a, c) => { const A = center(a), B = center(c); return { x: (A.x + B.x) / 2, z: (A.z + B.z) / 2 }; };
    let wp = [], goal = null, lastX = P.x, lastZ = P.z, stuck = 0, jit = 0, jv = null, wanderT = 0;
    const plan = (x, z) => { const a = roomOf(P.x, P.z), rooms = map.path(a, roomOf(x, z)); wp = []; let prev = a; for (const rm of rooms) { const d = door(prev, rm), c = center(rm); wp.push(d, { x: d.x + (c.x - d.x) * 0.15, z: d.z + (c.z - d.z) * 0.15 }); prev = rm; } wp.push({ x, z }); };
    const bot = (dt) => {
      if (P.hidden) return {};
      let tgt;
      if (style === 3) { wanderT -= dt; if (wanderT <= 0 || !wp.length) { const c = center(Math.floor(Math.random() * 36)); plan(c.x + (Math.random() - 0.5) * 4, c.z + (Math.random() - 0.5) * 4); wanderT = 20; } }
      else { const want = P.hasKey ? "gate" : "key"; if (goal !== want) { goal = want; if (want === "key") plan(world.key.x, world.key.z); else plan(world.gate.fx, world.gate.fz); } if (!wp.length) { if (want === "key") plan(world.key.x, world.key.z); else plan(world.gate.fx, world.gate.fz); } }
      tgt = wp[0]; if (!tgt) return {};
      let dx = tgt.x - P.x, dz = tgt.z - P.z, d = Math.hypot(dx, dz); if (d < 0.45) { wp.shift(); return { vec: { x: 0, z: 0 } }; }
      stuck += dt; if (stuck > 0.8) { if (Math.hypot(P.x - lastX, P.z - lastZ) < 0.25) { jit = 0.7; const a = Math.random() * 6.28; jv = { x: Math.cos(a), z: Math.sin(a) }; } lastX = P.x; lastZ = P.z; stuck = 0; }
      if (jit > 0) { jit -= dt; return { vec: jv }; }
      const run = style === 1 || (style === 2 && O.state === "chase");
      return { vec: { x: dx / d, z: dz / d }, run };
    };
    const res = g.simulate(420, bot); res.style = style; res.t = Math.round(res.t); res.maxStill = Math.round(res.maxStill); res.minT = Math.round(g.minT()); res.bad = res.mode === "escape" && res.t < g.minT() ? "FASTER THAN MIN" : undefined;
    return res;
  }, i);
  out.push(r); console.log(JSON.stringify(r)); await p.waitForTimeout(700);
}
const c = (f) => out.filter(f).length; console.log(`escape ${c((r) => r.mode === "escape")} caught ${c((r) => r.mode === "caught")} timeout ${c((r) => r.mode === "play")} errors ${c((r) => r.ev.length)}`);
await b.close();
