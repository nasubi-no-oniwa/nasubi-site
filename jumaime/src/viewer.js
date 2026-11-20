// 確認用：お菊さんのモデルと、捕まった場面
import * as THREE from "three";
import { gsap } from "gsap";
import { makePipeline } from "./post.js";
import { makeOkiku } from "./okiku.js";
import { makeCatchScene } from "./catch.js";
import { Sound } from "./audio.js";

const $ = (s) => document.querySelector(s);
const canvas = $("#gl"), layer = $("#subs");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
renderer.setPixelRatio(1);
const pipe = makePipeline(renderer, 300);
const snd = new Sound();

// ---- モデルを見る部屋 ----
const view = new THREE.Scene(); view.background = new THREE.Color(0x020203); view.fog = new THREE.Fog(0x020203, 2.5, 9);
const vcam = new THREE.PerspectiveCamera(42, 1, 0.05, 40);
const ok = makeOkiku(); view.add(ok.root); ok.lookAt = vcam.position;
{ const el = document.querySelector("#spec"); if (el) el.textContent = `約${Math.round(ok.triangles() / 1000) / 10}万ポリゴン　毛束${ok.strands}本`; }
{ const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d");
  g.fillStyle = "#3a3a26"; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${90 + Math.random() * 50},${95 + Math.random() * 45},${50 + Math.random() * 30},0.16)`; g.fillRect(Math.random() * 256, Math.random() * 256, 1, 5 + Math.random() * 9); }
  g.fillStyle = "#0c0c08"; g.fillRect(0, 0, 256, 5); g.fillRect(0, 0, 5, 256); g.fillRect(125, 0, 5, 256);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 5); t.magFilter = THREE.NearestFilter; t.colorSpace = THREE.SRGBColorSpace;
  const f = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), new THREE.MeshLambertMaterial({ map: t })); f.rotation.x = -Math.PI / 2; view.add(f); }
const lantern = new THREE.PointLight(0xffa860, 9, 9, 1.6); lantern.position.set(1.3, 1.1, 1.7); view.add(lantern);
const cold = new THREE.DirectionalLight(0x6f93a8, 0.35); cold.position.set(-2, 3, -1.5); view.add(cold);
view.add(new THREE.AmbientLight(0x10141a, 0.9));
const rim = new THREE.PointLight(0x8fb2c4, 14, 9, 1.5); rim.position.set(-1.4, 2.4, -1.6); view.add(rim);
const fill = new THREE.PointLight(0xa8c0c4, 1.6, 6, 1.6); fill.position.set(-0.6, 1.6, 2.2); view.add(fill);
const _hv = new THREE.Vector3();
let yaw = 0.35, pitch = 0.08, dist = 3.4, tgtY = 1.15;
const POSES = {
  stand: { reach: 0, headDown: 0.75, headTilt: 0.05, mouth: 0, part: 0, eye: 0.5, shiver: 0, twitch: 0.3, lean: 0.06, fps: 9 },
  look: { reach: 0.05, headDown: 0.05, headTilt: 0.45, mouth: 0, part: 0.25, eye: 0.9, shiver: 0.1, twitch: 0.6, lean: 0.04, fps: 9 },
  chase: { reach: 0.85, headDown: 0.2, headTilt: -0.3, mouth: 0.25, part: 0.4, eye: 1.1, shiver: 0.5, twitch: 0.9, lean: 0.3, fps: 12 },
  scream: { reach: 1, headDown: -0.12, headTilt: 0.3, mouth: 1, part: 1, eye: 1.5, shiver: 1, twitch: 1, lean: 0.2, fps: 14 },
};
function setPose(name) { gsap.to(ok.pose, { ...POSES[name], duration: 0.5, ease: "power2.out" }); document.querySelectorAll("[data-pose]").forEach((b) => b.classList.toggle("on", b.dataset.pose === name));
  if (name === "scream" || name === "chase") gsap.to({}, { duration: 0 }); }
document.querySelectorAll("[data-pose]").forEach((b) => b.addEventListener("click", () => setPose(b.dataset.pose)));
let drag = null;
canvas.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY }; });
addEventListener("pointermove", (e) => { if (!drag || mode !== "model") return; yaw -= (e.clientX - drag.x) * 0.008; pitch = Math.max(-0.25, Math.min(1.2, pitch + (e.clientY - drag.y) * 0.006)); drag = { x: e.clientX, y: e.clientY }; });
addEventListener("pointerup", () => (drag = null));
canvas.addEventListener("wheel", (e) => { dist = Math.max(0.7, Math.min(6, dist + e.deltaY * 0.003)); e.preventDefault(); }, { passive: false });
$("#near").addEventListener("click", () => { const near = dist > 1.5; gsap.to({ d: dist, y: tgtY }, { d: near ? 0.85 : 3.4, y: near ? 1.8 : 1.15, duration: 0.8, ease: "power2.inOut", onUpdate() { dist = this.targets()[0].d; tgtY = this.targets()[0].y; } }); $("#near").textContent = near ? "はなれる" : "顔に寄る"; });

// ---- 捕まった場面 ----
const cs = makeCatchScene(layer);
let mode = "model", t0 = 0, seek = null;
function playCatch() {
  snd.init(); mode = "catch"; cs.reset(); document.body.dataset.mode = "catch"; t0 = performance.now() / 1000; cs.playAudio(snd);
}
function endCatch() { mode = "after"; document.body.dataset.mode = "after"; gsap.fromTo("#after", { opacity: 0 }, { opacity: 1, duration: 1.6 }); }
$("#play").addEventListener("click", playCatch); $("#again").addEventListener("click", playCatch);
$("#back").addEventListener("click", () => { mode = "model"; document.body.dataset.mode = "model"; layer.innerHTML = ""; resetPost(); });
function resetPost() { const u = pipe.u; u.tint.value = 0; u.aberr.value = 0.0012; u.shake.value.set(0, 0); u.tear.value = 0; u.inv.value = 0; u.dark.value = 0; u.grain.value = 0.08; u.vig.value = 0.9; }

function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); canvas.style.width = w + "px"; canvas.style.height = h + "px"; pipe.resize(w, h); vcam.aspect = w / h; vcam.updateProjectionMatrix(); cs.setAspect(w / h); }
addEventListener("resize", resize); resize();

const turb = [document.querySelector("#ink1 feTurbulence"), document.querySelector("#ink3 feTurbulence")]; let seedStep = -1;
function frame() {
  const now = performance.now() / 1000;
  const s = Math.floor(now * 9); if (s !== seedStep) { seedStep = s; turb.forEach((x) => x && x.setAttribute("seed", String(s % 97))); }
  if (seek !== null) { cs.at(seek, pipe.u); pipe.render(cs.scene, cs.cam, seek); }
  else if (mode === "catch") { const t = now - t0; cs.at(t, pipe.u); pipe.render(cs.scene, cs.cam, t); if (t > cs.END) endCatch(); }
  else if (mode === "after") { pipe.u.dark.value = 1; pipe.render(cs.scene, cs.cam, now); }
  else {
    ok.update(now); lantern.intensity = 9 * (0.86 + Math.sin(now * 11) * 0.05 + Math.sin(now * 23.7) * 0.04 + (Math.random() < 0.03 ? -0.3 : 0));
    vcam.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, tgtY + Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist); if (dist < 1.6) { const h = ok.headWorld(_hv); vcam.position.set(h.x + Math.sin(yaw) * Math.cos(pitch) * dist, h.y + Math.sin(pitch) * dist, h.z + Math.cos(yaw) * Math.cos(pitch) * dist); vcam.lookAt(h); } else vcam.lookAt(0, tgtY, 0);
    pipe.render(view, vcam, now);
  }
  requestAnimationFrame(frame);
}
window.__ok = ok; window.__seek = (t) => { seek = t; if (t !== null) { document.body.dataset.mode = "catch"; } };
window.__pose = (n, y = 0.35, d = 3.4, ty = 1.15, p = 0.08) => { Object.assign(ok.pose, POSES[n]); yaw = y; dist = d; tgtY = ty; pitch = p; };
document.body.dataset.mode = "model"; setPose("stand"); frame();
