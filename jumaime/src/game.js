// 十枚目：屋敷逃走劇（見下ろし3D）
import * as THREE from "three";
import { gsap } from "gsap";
import { makePipeline } from "./post.js";
import { makeOkiku } from "./okiku.js";
import { makeCatchScene } from "./catch.js";
import { Sound, kanaMoras, COUNTS, COUNT_KANJI, LINES } from "./audio.js";
import { dots, setVertical } from "./dots.js";
import { LANGS, TX, pickLang } from "./tx.js";
import { ls, badName, myId, seedOf, hasRun, netStart, dropRun, submit, board, minTimeOfMap } from "./rank.js";
import { S, GW, GH, genMap, buildWorld, roomOf, roomCenter, doorPoint } from "./world.js";
import { createFrame, clearFrame, createFx, composite } from "../vendor/pixelfx/core/index.js";
import * as spiritFlame from "../vendor/pixelfx/fx/fire/spirit-flame.js";
import * as keyGlint from "../vendor/pixelfx/fx/pickups/key-glint.js";
import * as collectBurst from "../vendor/pixelfx/fx/pickups/collect-burst.js";

const $ = (s) => document.querySelector(s);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x)), clamp01 = (x) => clamp(x, 0, 1), lerp = (a, b, u) => a + (b - a) * u;
const ease = (u) => { u = clamp01(u); return u * u * (3 - 2 * u); };
const hash = (n) => { const x = Math.sin(n * 91.7) * 43758.5453; return x - Math.floor(x); };
// ---- ことば（日本語・英語・繁体中文・韓国語） ----
let lang = pickLang(ls.get("jm_lang", null)), T = TX[lang];
const t = (k, v) => { let x = T[k]; if (v) for (const key in v) x = x.split("{" + key + "}").join(v[key]); return x; };
const IS_MOBILE = /iPhone|iPod|iPad|Android|Mobile/i.test(navigator.userAgent || "");
const FINE = matchMedia("(hover:hover) and (pointer:fine)").matches;
const NONET = __DEV__ && /[?&]nonet=1/.test(location.search);
const track = (name, o) => { try { if (typeof window.gtag === "function") window.gtag("event", name, { game: "jumaime", ...o }); } catch (e) { } };

const canvas = $("#gl");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
renderer.setPixelRatio(1); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.BasicShadowMap;
const pipe = makePipeline(renderer, 300), snd = new Sound();
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000);
const cam = new THREE.PerspectiveCamera(44, 1, 0.08, 90);
const amb = new THREE.AmbientLight(0x263046, 1.15); scene.add(amb);
const lantern = new THREE.PointLight(0xffa862, 0, 14.5, 1.3); lantern.castShadow = true; lantern.shadow.mapSize.set(512, 512); lantern.shadow.camera.near = 0.06; lantern.shadow.camera.far = 15; lantern.shadow.bias = -0.012; lantern.shadow.normalBias = 0.03; scene.add(lantern);
const moon = new THREE.PointLight(0x6f8fba, 10, 12, 1.3); scene.add(moon);
const ghostLight = new THREE.PointLight(0x8fb2cc, 1.8, 4.6, 1.5); scene.add(ghostLight);
const sky = new THREE.DirectionalLight(0x7088ac, 0); sky.position.set(0.4, 1, 0.3); scene.add(sky); // 押し入れからのぞくときだけ使う、うすい夜の明かり

// ---- お菊さん ----
const ok = makeOkiku(); scene.add(ok.root);
ok.root.traverse((m) => { if (m.isMesh && (m.isInstancedMesh || m.geometry.attributes.position.count > 600)) m.castShadow = true; });
const cs = makeCatchScene($("#subs"), ok);
const lookV = new THREE.Vector3();

// ---- 自分（のっぺらぼうの人形。頭に十枚目の皿、手に提灯） ----
function makePlayer() {
  const g = new THREE.Group(), mat = new THREE.MeshLambertMaterial({ color: 0xb4b1a6 });
  const mk = (geo, x, y, z, parent = g) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; }; // 自分の影は落とさない（後ろが見えなくなるため）
  mk(new THREE.CapsuleGeometry(0.15, 0.4, 6, 14), 0, 0.95, 0); mk(new THREE.SphereGeometry(0.135, 16, 12), 0, 1.43, 0);
  const limb = (x, y, len, rad) => { const p = new THREE.Group(); p.position.set(x, y, 0); const geo = new THREE.CapsuleGeometry(rad, len, 4, 10); geo.translate(0, -len / 2 - rad * 0.5, 0); mk(geo, 0, 0, 0, p); g.add(p); return p; };
  const legs = [limb(-0.085, 0.66, 0.5, 0.062), limb(0.085, 0.66, 0.5, 0.062)], arms = [limb(-0.215, 1.2, 0.4, 0.046), limb(0.215, 1.2, 0.4, 0.046)];
  arms.forEach((a) => a.traverse((m) => (m.castShadow = false)));
  const plate = new THREE.Group(); plate.position.set(0, 1.575, 0); g.add(plate);
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.11, 0.035, 22), new THREE.MeshLambertMaterial({ color: 0xe9e6da, emissive: 0x15140f })); plate.add(dish);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.008, 6, 22), new THREE.MeshLambertMaterial({ color: 0x27407c })); rim.rotation.x = Math.PI / 2; rim.position.y = 0.018; plate.add(rim);
  const lamp = new THREE.Group(); lamp.position.set(0, -0.5, 0.06); arms[1].add(lamp);
  lamp.add(new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.2, 0.13), new THREE.MeshBasicMaterial({ color: 0xffb060 })));
  const cap = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.03, 0.15), new THREE.MeshLambertMaterial({ color: 0x18110c })); cap.position.y = 0.11; lamp.add(cap); const cap2 = cap.clone(); cap2.position.y = -0.11; lamp.add(cap2);
  return { g, legs, arms, plate, lamp };
}
const PM = makePlayer(); scene.add(PM.g);
const shards = new THREE.Group(); scene.add(shards);

// ---- 人魂（pixelfx の青い火を、板に映して浮かべる） ----
function makeFlame(seed) {
  const frame = createFrame(80, 124), fx = createFx(spiritFlame, { x: 40, y: 94, seed }), cv = document.createElement("canvas"); cv.width = 80; cv.height = 124;
  const ctx = cv.getContext("2d"), img = ctx.createImageData(80, 124), tex = new THREE.CanvasTexture(cv); tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); sp.scale.set(0.66, 1.02, 1); let acc = 1;
  return { sp, update(dt) { acc += dt; if (acc < 1 / 14) return; fx.update(Math.min(acc, 0.2)); acc = 0; clearFrame(frame); fx.draw(frame); composite(frame, img.data, null); const d = img.data; for (let y = 0; y < 124; y++) for (let x = 0; x < 80; x++) { const k = clamp01(1.9 - Math.hypot((x - 40) / 40, (y - 70) / 62) * 2.1); d[(y * 80 + x) * 4 + 3] *= k * k; } ctx.putImageData(img, 0, 0); tex.needsUpdate = true; } };
}
const flames = [makeFlame(7), makeFlame(21), makeFlame(40)]; flames.forEach((f) => scene.add(f.sp));
const GOLD = ["#1a1204", "#3a2808", "#6b4a10", "#9a7420", "#c9a03a", "#e8c868", "#fff0b0", "#ffffff"];
function fxCanvas(w, h) { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const ctx = cv.getContext("2d"), img = ctx.createImageData(w, h), tex = new THREE.CanvasTexture(cv); tex.magFilter = tex.minFilter = THREE.NearestFilter; tex.colorSpace = THREE.SRGBColorSpace; return { ctx, img, tex }; }
function makeKeyFx() { // 落ちている鍵。定期的にきらっと光る（きらめきは暗がりでも見える。鍵そのものは提灯の光が届いたときだけ見える）
  const [w, h] = keyGlint.meta.size, [ox, oy] = keyGlint.meta.origin, frame = createFrame(w, h), fx = createFx(keyGlint, { x: ox, y: oy, palette: GOLD }), A = fxCanvas(w, h), B = fxCanvas(w, h), tmp = new Uint32Array(w * h);
  const body = new THREE.Sprite(new THREE.SpriteMaterial({ map: A.tex, transparent: true, depthWrite: false })), glint = new THREE.Sprite(new THREE.SpriteMaterial({ map: B.tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  const g = new THREE.Group(); for (const s of [body, glint]) { s.center.set(ox / w, 1 - oy / h); s.scale.set(w * 0.017, h * 0.017, 1); g.add(s); } let acc = 1;
  return { g, body, update(dt) { acc += dt; if (acc < 1 / 15) return; fx.update(Math.min(acc, 0.2)); acc = 0; clearFrame(frame); fx.draw(frame);
    tmp.set(frame.light); frame.light.fill(0); composite(frame, A.img.data, null); A.ctx.putImageData(A.img, 0, 0); A.tex.needsUpdate = true;
    frame.light.set(tmp); frame.color.fill(0); composite(frame, B.img.data, null); B.ctx.putImageData(B.img, 0, 0); B.tex.needsUpdate = true; } };
}
const keyFx = makeKeyFx(); scene.add(keyFx.g);
const bursts = [];
function burstAt(x, z) { // 鍵をひろった瞬間の光
  const [w, h] = collectBurst.meta.size, [ox, oy] = collectBurst.meta.origin, frame = createFrame(w, h), fx = createFx(collectBurst, { x: ox, y: oy, palette: GOLD }), C = fxCanvas(w, h);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: C.tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); sp.center.set(ox / w, 1 - oy / h); sp.scale.set(w * 0.016, h * 0.016, 1); sp.position.set(x, 0.05, z); scene.add(sp);
  bursts.push({ update(dt) { fx.update(dt); clearFrame(frame); fx.draw(frame); composite(frame, C.img.data, null); C.ctx.putImageData(C.img, 0, 0); C.tex.needsUpdate = true; if (fx.done()) { scene.remove(sp); return true; } return false; } });
}
// 走る足音の輪（走ると音が広がって、お菊さんに聞こえることを目で伝える）
const rings = [...Array(5)].map(() => { const m = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.0, 40), new THREE.MeshBasicMaterial({ color: 0xd9d4c6, transparent: true, opacity: 0, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.y = 0.03; m.visible = false; scene.add(m); return m; }); let ringI = 0;
function stepRing() { const m = rings[ringI++ % rings.length]; m.visible = true; m.position.set(P.x, 0.03, P.z); m.scale.setScalar(0.3); m.material.opacity = 0.32; gsap.to(m.scale, { x: 3.4, y: 3.4, z: 3.4, duration: 0.55, ease: "power1.out" }); gsap.to(m.material, { opacity: 0, duration: 0.55, onComplete: () => (m.visible = false) }); }

// ---- 状態 ----
let map, world, mode = "title", tPlay = 0, runSeen = false, now = 0, last = 0;
const P = { x: 0, z: 0, face: 0, stamina: 1, running: false, tired: false, hidden: null, hasKey: false, plate: true, stride: 0, moving: 0 };
const O = { x: 0, z: 0, face: 0, state: "wander", path: [], wait: 0, mul: 1, lastSeen: null, seenT: -9, knows: null, searchT: 0, hearCd: 0, countI: 0, countT: 4, croakT: 0, stare: 0, pose: {} };
let quality = 0, qLock = false, qSum = 0, qN = 0, qT = 0, playShort = 440;
function qualityStep(raw) { // 重い端末では、見た目をほぼ変えずに自動で軽くする
  if (qLock || quality >= 2 || mode !== "play" || P.hidden || raw > 0.5) return; qSum += raw; qN++; qT += raw;
  if (qT < 3 || qN < 20) return; const avg = qSum / qN; qSum = 0; qN = 0; qT = 0; if (avg < 0.03) return; quality++;
  if (quality >= 1) { lantern.shadow.mapSize.set(256, 256); if (lantern.shadow.map) { lantern.shadow.map.dispose(); lantern.shadow.map = null; } playShort = 370; }
  if (quality >= 2) { ok.setDetail(0.5); ok.root.traverse((m) => (m.castShadow = false)); playShort = 320; }
}
const keys = {}; let joy = null, runHeld = false, botVec = null, heartT = 0, fear = 0, gateHintT = 0, camY = 15.5;

function disposeWorld(w) { scene.remove(w.group); w.group.traverse((m) => { if (m.geometry) m.geometry.dispose(); const ms = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []; for (const x of ms) { if (x.map) x.map.dispose(); x.dispose(); } }); }
let busy = false;
async function newRun(withOpening) {
  // 始めるときにサーバーの時刻（切符）をもらい、その時刻から間取りを決める。通信できなければ、でたらめな間取りで始めて、この回は記録しない
  if (busy) return; busy = true; let st = null;
  if (NONET) dropRun(); else { try { st = await Promise.race([netStart(), new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 2500))]); } catch (e) { dropRun(); st = null; } }
  busy = false;
  if (world) disposeWorld(world);
  map = genMap(st ? seedOf(st) : (((Date.now() ^ (Math.random() * 1e9)) >>> 0) || 1)); world = buildWorld(map); scene.add(world.group);
  Object.assign(P, { x: world.start.x, z: world.start.z, face: Math.PI, stamina: 1, running: false, tired: false, hidden: null, hasKey: false, plate: true, stride: 0 });
  Object.assign(O, { x: world.well.x + 1.6, z: world.well.z + 0.4, state: "wander", path: [], wait: 14, mul: 1, lastSeen: null, seenT: -9, knows: null, searchT: 0, hearCd: 0, countI: 0, countT: 3, croakT: 0, stare: 0, peekT: 0, sink: 0, rushT: 0 });
  scene.add(ok.root); ok.root.scale.setScalar(1); ok.root.position.set(O.x, 0, O.z);
  PM.g.visible = true; PM.plate.visible = true; PM.plate.position.set(0, 1.575, 0); PM.plate.rotation.set(0, 0, 0); PM.g.add(PM.plate); shards.clear();
  moon.position.set(world.well.x, 4.2, world.well.z);
  flames.forEach((f, i) => f.sp.position.set(world.well.x + Math.cos(i * 2.1) * 1.5, 1.3 + i * 0.25, world.well.z + Math.sin(i * 2.1) * 1.5));
  keyFx.g.position.set(world.key.x, 0.02, world.key.z); keyFx.g.visible = true; world.key.mesh.visible = false;
  tPlay = 0; fear = 0; $("#keyIcon").classList.remove("on"); $("#slit").classList.remove("on"); world.setView(false); resetPost();
  if (withOpening) startOpening(); else startPlay();
}
function resetPost() { const u = pipe.u; u.tint.value = 0; u.aberr.value = 0; u.shake.value.set(0, 0); u.tear.value = 0; u.inv.value = 0; u.dark.value = 0; u.grain.value = 0.085; u.vig.value = 1.0; }

// ---- 字幕・しるし ----
function hint(text, dur = 3.2) { const el = $("#hint"); el.innerHTML = dots(text); gsap.killTweensOf(el); gsap.fromTo(el, { opacity: 0, filter: "blur(6px)" }, { opacity: 0.9, filter: "blur(0px)", duration: 0.7 }); gsap.to(el, { opacity: 0, duration: 1.2, delay: dur }); }
function countSub(text, vol, dx, dz, chase) {
  const el = $("#count"), d = Math.hypot(dx, dz) || 1; el.innerHTML = dots(text); el.style.left = 50 + (dx / d) * 39 + "%"; el.style.top = clamp(50 + (dz / d) * 34, 17, 82) + "%"; el.style.fontSize = 14 + vol * 15 + "px"; el.classList.toggle("chase", !!chase);
  gsap.killTweensOf(el); gsap.fromTo(el, { opacity: 0 }, { opacity: 0.22 + vol * 0.78, duration: chase ? 0.15 : 0.5 }); gsap.to(el, { opacity: 0, duration: chase ? 0.4 : 1.1, delay: chase ? 0.5 : 1.5 });
}

// 目的（いつも画面の上に出す）と、通った部屋が描かれていく地図
function setGoal() { $("#goalL").textContent = T.goalL; $("#goalText").textContent = P.hasKey ? T.goalGate : T.goalKey; $("#goal").classList.toggle("gate", P.hasKey); }
let visited = new Set(), mapT = 0, bellT = 2, nearCd = 0, warnPlate = false;
const mapCv = $("#map"), mctx = mapCv.getContext("2d");
function drawMap() {
  const c = 17, pad = 4, W = GW * c + pad * 2; if (mapCv.width !== W * 2) mapCv.width = mapCv.height = W * 2; mctx.setTransform(2, 0, 0, 2, 0, 0); mctx.clearRect(0, 0, W, W);
  const cur = roomOf(P.x, P.z);
  for (const i of visited) { const x = pad + (i % GW) * c, y = pad + ((i / GW) | 0) * c; mctx.fillStyle = i === cur ? "rgba(226,220,204,.36)" : "rgba(226,220,204,.13)"; mctx.fillRect(x + 1, y + 1, c - 2, c - 2);
    mctx.fillStyle = "rgba(226,220,204,.34)"; for (const j of map.adj(i)) { const dx = (j % GW) - (i % GW), dy = ((j / GW) | 0) - ((i / GW) | 0); mctx.fillRect(x + c / 2 - 2 + dx * (c / 2 - 0.5), y + c / 2 - 2 + dy * (c / 2 - 0.5), 4, 4); } // 戸口
    if (i === map.well) { mctx.strokeStyle = "rgba(140,170,200,.8)"; mctx.lineWidth = 1.2; mctx.beginPath(); mctx.arc(x + c / 2, y + c / 2, 3.2, 0, 7); mctx.stroke(); }
    if (i === map.keyRoom && !P.hasKey) { if (i === cur) { mctx.fillStyle = `rgba(227,196,106,${0.22 + 0.2 * Math.sin(now * 5)})`; mctx.fillRect(x + 1, y + 1, c - 2, c - 2); } mctx.fillStyle = "#e3c46a"; mctx.beginPath(); mctx.arc(x + c / 2, y + c / 2, 2.2, 0, 7); mctx.fill(); } } // 鍵のある部屋に入ると、そこが少し光る
  { const G = world.gate, x = pad + (G.x / S) * c, y = pad + (G.z / S) * c; mctx.fillStyle = "#d2493a"; mctx.fillRect(x - (G.alongX ? 4 : 1.5), y - (G.alongX ? 1.5 : 4), G.alongX ? 8 : 3, G.alongX ? 3 : 8); } // 門ははじめから印
  mctx.fillStyle = "#fff"; mctx.beginPath(); mctx.arc(pad + (P.x / S) * c, pad + (P.z / S) * c, 2, 0, 7); mctx.fill();
}
function hudStep(dt) {
  mapT -= dt; if (mapT <= 0) { mapT = 0.12; visited.add(roomOf(P.x, P.z)); drawMap(); }
  if (!P.hasKey && roomOf(P.x, P.z) === map.keyRoom) { bellT -= dt; if (bellT <= 0) { bellT = 2; snd.bell(0.16, clamp((world.key.x - P.x) / 6, -1, 1)); } } // 同じ部屋にあるときだけ、鈴が小さく鳴る
  nearCd -= dt; if (fear > 0.5 && O.state !== "chase" && O.state !== "open" && !P.hidden && nearCd <= 0) { hint(T.hNear, 1.8); nearCd = 14; }
  if (P.plate && P.running && P.stamina < 0.38 && !warnPlate) { warnPlate = true; hint(T.hRun, 2.2); } if (P.stamina > 0.7) warnPlate = false;
}

// ---- はじまりの映像：九枚まで数えて、一枚足りない ----
const OPT = { first: 2.2, step: 1.32, miss: 2.2 + 9 * 1.32 + 1.5, rise: 2.2 + 9 * 1.32 + 3.9, cut: 2.2 + 9 * 1.32 + 7.4, end: 2.2 + 9 * 1.32 + 11.2 };
let opT0 = 0, opFired = 0, drone = null;
function startOpening() {
  mode = "opening"; document.body.dataset.mode = "opening"; keyFx.g.visible = false; opT0 = now; opFired = 0; world.setView(true); PM.g.visible = false; lantern.intensity = 0; $("#opsubs").innerHTML = ""; $("#opmiss").innerHTML = ""; pipe.u.dark.value = 1;
  const t0 = snd.now + 0.05; if (drone) drone.stop(0.1); drone = snd.drone(0.16);
  for (let i = 0; i < 9; i++) { snd.voice(kanaMoras(COUNTS[i], 168 - i * 2, 1.12), t0 + OPT.first + i * OPT.step, { amp: 0.34 + i * 0.03, breath: 0.6, croak: 0.8, croakHz: 24, drive: 3, pan: (i % 2 ? 0.25 : -0.25), wet: 0.85, tail: 0.3 }); }
  snd.voice(kanaMoras("いちまい", 128, 1.5), t0 + OPT.miss, { amp: 0.6, breath: 0.5, croak: 0.9, croakHz: 21, drive: 4, wet: 0.8, tail: 0.3 });
  snd.voice(kanaMoras("たりない", 118, 1.6), t0 + OPT.miss + 1.75, { amp: 0.7, breath: 0.45, croak: 0.95, croakHz: 19, drive: 5, wet: 0.8, tail: 0.5 });
  snd.sting(t0 + OPT.rise + 0.4, 3.2, 0.1); snd.boom(t0 + OPT.cut, 1.2);
}
function openingAt(t, dt) {
  const w = world.well, u = ease(t / OPT.cut), tall = cam.aspect < 0.8, D = (tall ? 4.9 : 4.4) * (1 - u * 0.36), ca = 0.62 - u * 0.12; // 井戸へゆっくり寄っていく
  cam.fov = tall ? 62 : 48; cam.position.set(w.x + Math.sin(ca) * D, 2.25 - u * 0.5, w.z + Math.cos(ca) * D); cam.lookAt(w.x, 0.9 + u * 0.2, w.z); cam.rotation.z += Math.sin(t * 0.5) * 0.008; cam.updateProjectionMatrix();
  pipe.u.dark.value = t < 1.6 ? 1 - ease(t / 1.6) : t >= OPT.cut ? 1 : 0; pipe.u.grain.value = 0.1; pipe.u.vig.value = 1.25;
  const k = ease((t - OPT.rise) / 3.2);
  ok.root.position.set(w.x, -2.25 + k * 1.52, w.z); ok.root.rotation.y = Math.atan2(cam.position.x - w.x, cam.position.z - w.z);
  Object.assign(ok.pose, { reach: 0, headDown: 0.62 - k * 0.3, headTilt: k * 0.42, headTurn: 0, lean: 0, mouth: 0, part: 0, eye: 0.5 + k * 0.5, twitch: 0.3 + k * 0.6, shiver: k * 0.3, sway: 1, fps: 8 });
  ok.lookAt = cam.position; ok.update(t);
  const fl = t > OPT.rise ? (hash(Math.floor(t * 11)) > 0.75 ? 0.25 : 1) : 1;
  sky.intensity = 0; moon.intensity = 34 * fl; ghostLight.position.set(cam.position.x - 1.2, 2.6, cam.position.z + 0.6); ghostLight.distance = 14; ghostLight.intensity = 9 * fl; // 月明かりと、手前からのうすい光
  flames.forEach((f, i) => { f.update(dt); const a = ca + Math.PI + (i - 1) * 1.15 + Math.sin(t * 0.3 + i * 2) * 0.25, rr = 1.6 + Math.sin(t * 0.7 + i) * 0.25; f.sp.position.set(w.x + Math.cos(a) * rr, 1.25 + Math.sin(t * 0.9 + i * 1.7) * 0.2 + i * 0.12, w.z + Math.sin(a) * rr); f.sp.material.opacity = t > OPT.rise ? Math.max(0, 1 - (t - OPT.rise) * 0.8) : 1; });
  // 字幕（数えるたびに右から左へ一行ずつ）
  while (opFired < 9 && t >= OPT.first + opFired * OPT.step) { const d = document.createElement("div"); d.innerHTML = dots(T.counts[opFired] + "…"); $("#opsubs").appendChild(d); gsap.fromTo(d, { opacity: 0, filter: "blur(6px)" }, { opacity: 0.86, filter: "blur(0px)", duration: 0.55 }); opFired++; }
  if (opFired === 9 && t >= OPT.miss) { gsap.to("#opsubs div", { opacity: 0.22, duration: 0.8 }); const d = $("#opmiss"); d.innerHTML = "<span>" + dots(T.miss1) + "</span>"; gsap.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.9 }); opFired = 10; }
  if (opFired === 10 && t >= OPT.miss + 1.75) { const d = $("#opmiss"); d.innerHTML += "<span>" + T.miss2 + "</span>"; gsap.fromTo(d.lastChild, { opacity: 0 }, { opacity: 1, duration: 0.5 }); opFired = 11; }
  if (opFired === 11 && t >= OPT.cut) { $("#opsubs").innerHTML = ""; $("#opmiss").innerHTML = ""; const tt = $("#bigtitle"); gsap.fromTo(tt, { opacity: 0 }, { opacity: 1, duration: 1.4, delay: 0.7 }); gsap.to(tt, { opacity: 0, duration: 0.9, delay: 3.0 }); opFired = 12; }
  if (t >= OPT.end) showHowto();
}
function showHowto() { mode = "howto"; document.body.dataset.mode = "howto"; pipe.u.dark.value = 1; $("#opsubs").innerHTML = ""; $("#opmiss").innerHTML = ""; gsap.set("#bigtitle", { opacity: 0 }); gsap.fromTo("#howto", { opacity: 0 }, { opacity: 1, duration: 0.8 }); }

function startPlay() {
  mode = "play"; document.body.dataset.mode = "play"; world.setView(false); PM.g.visible = true; keyFx.g.visible = !P.hasKey; $("#opsubs").innerHTML = ""; $("#opmiss").innerHTML = ""; gsap.set("#bigtitle", { opacity: 0 });
  if (!drone) drone = snd.drone(0.16);
  ok.root.rotation.set(0, 0, 0); ok.root.position.set(O.x, 0, O.z); cam.fov = 44; cam.updateProjectionMatrix();
  cam.position.set(P.x, camY, P.z + 5.8); pipe.u.dark.value = 1; gsap.to(pipe.u.dark, { value: 0, duration: 1.8 });
  setGoal(); visited = new Set([roomOf(P.x, P.z)]); drawMap(); bellT = 2.5; nearCd = 0; warnPlate = false;
  setTimeout(() => mode === "play" && hint(T.hKey, 3.6), 1200);
  track("game_start");
}

// ---- 当たり判定 ----
function collide(x, z, rad) {
  for (let it = 0; it < 2; it++) for (const c of world.cols) {
    const nx = clamp(x, c.x0, c.x1), nz = clamp(z, c.z0, c.z1), dx = x - nx, dz = z - nz, d2 = dx * dx + dz * dz;
    if (d2 >= rad * rad) continue;
    if (d2 > 1e-8) { const d = Math.sqrt(d2); x = nx + (dx / d) * rad; z = nz + (dz / d) * rad; }
    else { const l = x - c.x0, r = c.x1 - x, t = z - c.z0, b = c.z1 - z, m = Math.min(l, r, t, b); if (m === l) x = c.x0 - rad; else if (m === r) x = c.x1 + rad; else if (m === t) z = c.z0 - rad; else z = c.z1 + rad; }
  }
  return [x, z];
}
function segBox(ax, az, bx, bz, c) {
  let t0 = 0, t1 = 1;
  for (const [p, d, lo, hi] of [[ax, bx - ax, c.x0, c.x1], [az, bz - az, c.z0, c.z1]]) {
    if (Math.abs(d) < 1e-9) { if (p < lo || p > hi) return false; continue; }
    let u0 = (lo - p) / d, u1 = (hi - p) / d; if (u0 > u1) [u0, u1] = [u1, u0]; t0 = Math.max(t0, u0); t1 = Math.min(t1, u1); if (t0 > t1) return false;
  }
  return true;
}

// ---- お菊さんの動き ----
function pathTo(x, z) { const a = roomOf(O.x, O.z), rooms = map.path(a, roomOf(x, z)); O.path = []; let prev = a; for (const rm of rooms) { O.path.push(doorPoint(prev, rm)); prev = rm; } O.path.push({ x, z }); }
function moveAlong(speed, dt) {
  let rem = speed * dt;
  while (rem > 0 && O.path.length) { const p = O.path[0], dx = p.x - O.x, dz = p.z - O.z, d = Math.hypot(dx, dz); if (d <= rem) { O.x = p.x; O.z = p.z; O.path.shift(); rem -= d; } else { O.x += (dx / d) * rem; O.z += (dz / d) * rem; O.face = Math.atan2(dx, dz); rem = 0; } }
  return O.path.length === 0;
}
function canSee() { // 目が合う：同じ部屋にいて、間にさえぎる物がない
  if (P.hidden) return false; const rm = roomOf(O.x, O.z); if (rm !== roomOf(P.x, P.z)) return false;
  if (Math.hypot(P.x - O.x, P.z - O.z) > 11) return false; return !world.los[rm].some((c) => segBox(O.x, O.z, P.x, P.z, c));
}
function randIn(rm) { const c = roomCenter(rm); return { x: c.x + (Math.random() - 0.5) * (S - 3.2), z: c.z + (Math.random() - 0.5) * (S - 3.2) }; }
function okikuAI(dt) {
  const dist = Math.hypot(P.x - O.x, P.z - O.z), sees = canSee(), pr = roomOf(P.x, P.z), orr = roomOf(O.x, O.z), pan = clamp((O.x - P.x) / 12, -1, 1), near = clamp01(1 - dist / 34);
  O.hearCd -= dt; O.peekT = Math.max(0, (O.peekT || 0) - dt);
  if (sees) {
    if (O.state !== "chase") { O.state = "chase"; hint(T.hFound, 2); snd.sting(snd.now, 1.6, 0.3); snd.boom(snd.now, 0.7); pipe.u.inv.value = 1; setTimeout(() => (pipe.u.inv.value = 0), 70); O.croakT = 0.2; }
    O.lastSeen = { x: P.x, z: P.z }; O.seenT = tPlay; O.goalSet = false; O.path = [{ x: P.x, z: P.z }]; moveAlong(3.15 * O.mul, dt);
  } else if (O.state === "chase") { // 見失った：どの戸口へ逃げたかまでは見えている。そこへ向かう
    if (!P.hidden && tPlay - O.seenT < 0.75) { O.lastSeen = { x: P.x, z: P.z }; O.goalSet = false; }
    if (!O.goalSet) { pathTo(O.lastSeen.x, O.lastSeen.z); O.goalSet = true; }
    if (moveAlong(3.0 * O.mul, dt)) { O.state = O.knows ? "open" : "search"; O.searchT = 4.5 + Math.random() * 2.5; O.wait = 0.7;
      if (!O.knows && P.hidden && P.hidden.room === roomOf(O.x, O.z) && Math.random() < 0.65) { O.path = [{ x: P.hidden.fx, z: P.hidden.fz }]; O.stare = 2.4; } }
  } else if (O.state === "open") { // 隠れるところを見られていた：押し入れを開けに来る
    if (!P.hidden) { O.state = "search"; O.searchT = 3; } else { if (!O.path.length) O.path = [{ x: P.hidden.fx, z: P.hidden.fz }]; if (moveAlong(2.4 * O.mul, dt)) { O.face = Math.atan2(-P.hidden.nx, -P.hidden.nz); O.peekT = 0.3; O.wait -= dt; if (O.wait < -1.2) return caught(); } }
  } else if (O.state === "search") {
    O.searchT -= dt;
    if (O.path.length) { if (moveAlong(1.9 * O.mul, dt) && O.stare > 0 && P.hidden) { O.face = Math.atan2(-P.hidden.nx, -P.hidden.nz); O.wait = O.stare; O.peekT = O.stare - 0.3; O.stare = 0; } }
    else if (O.wait > 0) O.wait -= dt; else { const p = randIn(orr); O.path = [p]; O.wait = 0.4 + Math.random() * 0.8; }
    if (O.searchT <= 0 && O.wait <= 0) { O.state = "wander"; O.path = []; O.wait = 0.5; }
  } else { // さまよう／音のした方へ
    if (O.rushT > 0) { O.rushT -= dt; if (!P.hidden && O.hearCd <= 0) { pathTo(P.x, P.z); O.state = "investigate"; O.wait = 0; O.hearCd = 0.25; } } // 皿の割れた音：しばらくは居場所がつつぬけ
    if (P.running && !P.hidden && O.hearCd <= 0) { const d = map.bfs(orr)[pr]; if (d <= 2) { pathTo(P.x, P.z); O.state = "investigate"; O.hearCd = 1.1; } }
    if (O.wait > 0) O.wait -= dt;
    else if (!O.path.length) { const hunt = clamp(0.12 + tPlay / 240, 0.12, 0.72), dP = map.bfs(pr); let cand = [...Array(GW * GH).keys()].filter((i) => i !== orr); if (Math.random() < hunt) { const nearP = cand.filter((i) => dP[i] <= 2); if (nearP.length) cand = nearP; }
      const p = randIn(cand[(Math.random() * cand.length) | 0]); pathTo(p.x, p.z); O.state = "wander"; }
    else if (moveAlong((O.state === "investigate" ? 2.35 : 1.35) * O.mul, dt)) { O.wait = 1.4 + Math.random() * 2.6; O.state = "wander"; }
  }
  if (!P.hidden && Math.hypot(P.x - O.x, P.z - O.z) < 0.7) return caught();
  // 声：さまよっている間は皿を数え続ける。追ってくる間はのどを鳴らす
  if (O.state === "chase" || O.state === "open") { O.croakT -= dt; if (O.croakT <= 0) { snd.croak(0.12 + near * near * 0.7, pan); countSub(T.croak, near * near, O.x - P.x, O.z - P.z, true); O.croakT = 0.75 + Math.random() * 0.5; } }
  else { O.countT -= dt; if (O.countT <= 0) { const a = 0.05 + near * near * 0.7, dz = O.z - P.z;
      if (O.countI < 9) { snd.voice(kanaMoras(COUNTS[O.countI], 160, 1.15), snd.now + 0.02, { amp: a, breath: 0.6, croak: 0.85, croakHz: 24, drive: 3, pan, wet: 0.8, tail: 0.3 }); countSub(T.counts[O.countI] + "…", near * near, O.x - P.x, dz); O.countI++; O.countT = O.countI === 9 ? 3.3 : 2.5; }
      else { snd.voice(kanaMoras("いちまいたりない", 126, 1.4), snd.now + 0.02, { amp: a * 1.2, breath: 0.5, croak: 0.95, croakHz: 20, drive: 4.5, pan, wet: 0.8, tail: 0.4 }); countSub(T.missOne, near * near, O.x - P.x, dz); O.countI = 0; O.countT = 5.2; } } }
}
function okikuLook(dt) { // 見た目
  const chase = O.state === "chase" || O.state === "open", tgt = chase ? { reach: 0.9, headDown: 0.22, headTilt: -0.3, mouth: 0.3, part: 0.5, eye: 1.2, shiver: 0.55, twitch: 0.9, lean: 0.28, fps: 12 } : O.wait > 0 ? { reach: 0, headDown: 0.5, headTilt: 0.35, mouth: 0, part: 0.1, eye: 0.7, shiver: 0.1, twitch: 0.7, lean: 0.05, fps: 8 } : { reach: 0, headDown: 0.72, headTilt: 0.08, mouth: 0, part: 0, eye: 0.55, shiver: 0, twitch: 0.3, lean: 0.07, fps: 9 };
  const peek = P.hidden && O.peekT > 0; // 押し入れのすき間に顔を寄せて、のぞきこむ
  if (peek) Object.assign(tgt, { reach: 0.1, headDown: -0.06, headTilt: 0.42, mouth: 0.12, part: 0.9, eye: 1.5, shiver: 0.3, twitch: 0.8, lean: 0.16, fps: 9 });
  O.sink = lerp(O.sink || 0, peek ? 0.62 : 0, 1 - Math.exp(-dt * 3.5));
  const k = 1 - Math.exp(-dt * 6); for (const key in tgt) ok.pose[key] = key === "fps" ? tgt[key] : lerp(ok.pose[key] ?? tgt[key], tgt[key], k); ok.pose.headTurn = 0; ok.pose.sway = 1;
  let da = O.face - ok.root.rotation.y; da = Math.atan2(Math.sin(da), Math.cos(da)); ok.root.rotation.y += da * (1 - Math.exp(-dt * 9));
  ok.root.position.set(O.x, -(O.sink || 0), O.z);
  if (P.hidden) ok.lookAt = cam.position; else { lookV.set(P.x, 1.4, P.z); ok.lookAt = lookV; }
  ok.update(now);
  { const tx = P.hidden ? cam.position.x : P.x, tz = P.hidden ? cam.position.z : P.z, vx = tx - O.x, vz = tz - O.z, vd = Math.hypot(vx, vz) || 1, off = Math.min(0.9, vd * 0.5); // お菊さんの青白い光は、こちらを向いた面を照らす
    ghostLight.position.set(O.x + (vx / vd) * off, 1.85, O.z + (vz / vd) * off); }
  ghostLight.distance = P.hidden ? 7 : 4.6; ghostLight.intensity = (P.hidden ? 4.2 : chase ? 2.0 : 1.2) * (0.85 + hash(Math.floor(now * 9)) * 0.3);
}

// ---- 自分の動き ----
function playerStep(dt) {
  let ix = 0, iz = 0;
  if (joy) { ix = (joy.x - joy.x0) / 52; iz = (joy.y - joy.y0) / 52; }
  if (botVec) { ix = botVec.x; iz = botVec.z; }
  if (keys.KeyA || keys.ArrowLeft) ix -= 1; if (keys.KeyD || keys.ArrowRight) ix += 1; if (keys.KeyW || keys.ArrowUp) iz -= 1; if (keys.KeyS || keys.ArrowDown) iz += 1;
  let mag = Math.hypot(ix, iz); if (mag > 1) { ix /= mag; iz /= mag; mag = 1; } if (mag < 0.12) mag = 0;
  if (P.tired && P.stamina > 0.35) P.tired = false;
  P.running = (runHeld || keys.ShiftLeft || keys.ShiftRight) && mag > 0.3 && !P.tired; P.moving = mag;
  if (mag > 0) { const sp = (P.running ? 4.4 : 2.5) * mag; [P.x, P.z] = collide(P.x + ix * sp * dt, P.z + iz * sp * dt, 0.3); let da = Math.atan2(ix, iz) - P.face; da = Math.atan2(Math.sin(da), Math.cos(da)); P.face += da * (1 - Math.exp(-dt * 12));
    P.stride += dt * (P.running ? 11.5 : 7.2) * mag; if (Math.sin(P.stride) * Math.sin(P.stride - dt * 12) < 0) { snd.step(P.running ? 0.3 : 0.13); if (P.running) stepRing(); } }
  // 疲れ：走ると減り、歩く・止まるともどる。尽きると皿が落ちる
  if (P.running) { P.stamina -= dt / 7; if (P.stamina <= 0) { P.stamina = 0; P.tired = true; if (P.plate) breakPlate(); } }
  else P.stamina = Math.min(1, P.stamina + dt * (mag > 0 ? 0.085 : 0.15));
  if (P.plate && P.running && P.stamina < 0.4 && Math.random() < dt * (5 + (0.4 - P.stamina) * 30)) snd.clink(0.06 + (0.4 - P.stamina) * 0.3);
  // 鍵・門・押し入れ
  if (!P.hasKey && Math.hypot(P.x - world.key.x, P.z - world.key.z) < 0.85) { P.hasKey = true; keyFx.g.visible = false; burstAt(world.key.x, world.key.z); snd.chime(0.3); hint(T.hGot, 2.6); $("#keyIcon").classList.add("on"); setGoal(); drawMap(); }
  const gd = Math.hypot(P.x - world.gate.fx, P.z - world.gate.fz); gateHintT -= dt;
  if (gd < 1.25) { if (P.hasKey) return escape(); if (gateHintT <= 0) { hint(T.hNeed, 2.4); gateHintT = 6; } }
  let best = null, bd = 1.05; for (const c of world.closets) { const d = Math.hypot(P.x - c.fx, P.z - c.fz); if (d < bd) { bd = d; best = c; } }
  P.near = best; $("#act").classList.toggle("on", !!best); $("#act").textContent = T.hide;
}
function playerLook(dt) {
  const g = PM.g; g.position.set(P.x, Math.abs(Math.sin(P.stride)) * 0.03 * P.moving, P.z); g.rotation.y = P.face;
  const sw = Math.sin(P.stride) * (P.running ? 0.95 : 0.6) * P.moving; PM.legs[0].rotation.x = sw; PM.legs[1].rotation.x = -sw; PM.arms[0].rotation.x = -sw * 0.7; PM.arms[1].rotation.x = -0.75 + sw * 0.12; PM.arms[1].rotation.z = 0.12;
  if (P.plate) { const w = Math.pow(1 - P.stamina, 1.6) * (P.running ? 0.55 : 0.2) + 0.012 * P.moving; PM.plate.rotation.x = Math.sin(now * 17) * w; PM.plate.rotation.z = Math.cos(now * 13.3) * w; PM.plate.position.x = Math.sin(now * 11) * w * 0.08; }
  const fl = 0.86 + Math.sin(now * 11) * 0.05 + Math.sin(now * 23.7) * 0.04 - (hash(Math.floor(now * 12)) > 0.93 - fear * 0.25 ? 0.25 + fear * 0.4 : 0);
  lantern.position.set(P.x + Math.sin(P.face) * 0.5 + Math.cos(P.face) * 0.22, 1.5, P.z + Math.cos(P.face) * 0.5 - Math.sin(P.face) * 0.22);
  lantern.intensity = lerp(lantern.intensity, P.hidden ? 0 : 30 * fl, 1 - Math.exp(-dt * 10));
}
function breakPlate() {
  P.plate = false; const wp = new THREE.Vector3(); PM.plate.getWorldPosition(wp); scene.add(PM.plate); PM.plate.position.copy(wp);
  const fx = Math.sin(P.face), fz = Math.cos(P.face);
  gsap.to(PM.plate.position, { x: wp.x + fx * 0.5, z: wp.z + fz * 0.5, duration: 0.42, ease: "none" }); gsap.to(PM.plate.rotation, { x: 4, z: 2.4, duration: 0.42, ease: "none" });
  gsap.to(PM.plate.position, { y: 0.03, duration: 0.42, ease: "power2.in", onComplete() {
    PM.plate.visible = false; snd.shatter(snd.now, 0.9); const m = new THREE.MeshLambertMaterial({ color: 0xe6e3d8, side: THREE.DoubleSide });
    for (let i = 0; i < 9; i++) { const s = new THREE.Mesh(new THREE.CircleGeometry(0.05 + Math.random() * 0.07, 3), m); s.rotation.set(-Math.PI / 2 + (Math.random() - 0.5) * 0.3, 0, Math.random() * 6.28); s.position.set(wp.x + fx * 0.5 + (Math.random() - 0.5) * 0.7, 0.012, wp.z + fz * 0.5 + (Math.random() - 0.5) * 0.7); shards.add(s); }
    // お菊さんが気づく：ここから速さが10倍
    O.mul = 10; O.rushT = 6; if (O.state !== "chase") { pathTo(P.x, P.z); O.state = "investigate"; } O.wait = 0; snd.sting(snd.now + 0.25, 2.6, 0.4);
    snd.voice([{ v: "a", d: 1.6, f: [420, 520], fp: [[0, 420], [0.3, 560], [1, 470]], vib: 0.05 }], snd.now + 0.3, { amp: 0.8, breath: 0.4, croak: 0.5, croakHz: 40, drive: 8, wet: 0.9, shriek: 1, tail: 0.3 });
    hint(T.hBroke, 2.8); pipe.u.inv.value = 1; setTimeout(() => (pipe.u.inv.value = 0), 90);
  } });
}

// ---- 隠れる ----
function toggleHide() {
  if (mode !== "play") return;
  if (P.hidden) { const c = P.hidden; P.hidden = null; P.x = c.fx; P.z = c.fz; PM.g.visible = true; c.panels.forEach((m) => (m.visible = true)); world.setView(false); $("#slit").classList.remove("on"); snd.slide(0.25); cam.fov = 44; cam.updateProjectionMatrix(); cam.position.set(P.x, camY, P.z + 5.8); if (O.state === "open") O.state = "chase"; return; }
  const c = P.near; if (!c) return;
  // 入るところを見られていたら、開けに来る
  O.knows = O.state === "chase" && (canSee() || (tPlay - O.seenT < 0.5 && roomOf(O.x, O.z) === c.room)) ? c : null;
  P.hidden = c; P.running = false; PM.g.visible = false; c.panels.forEach((m) => (m.visible = false)); world.setView(true); $("#slit").classList.add("on"); snd.slide(0.3); $("#act").textContent = T.out;
}
function hideView(dt) {
  const c = P.hidden; cam.fov = 84; cam.position.set(c.cx + c.nx * 0.2, 1.22 + Math.sin(now * 1.3) * 0.012, c.cz + c.nz * 0.2); cam.lookAt(c.cx + c.nx * 4, 1.08, c.cz + c.nz * 4); cam.rotation.z += Math.sin(now * 0.9) * 0.006; cam.updateProjectionMatrix();
  P.stamina = Math.min(1, P.stamina + dt * 0.2);
}

// ---- 捕まる・逃げきる ----
function caught() {
  if (mode !== "play") return; mode = "caught"; document.body.dataset.mode = "catch"; $("#slit").classList.remove("on"); gsap.killTweensOf("#hint"); gsap.set("#hint,#count", { opacity: 0 });
  if (drone) { drone.stop(0.05); drone = null; } snd.sting(snd.now, 0.5, 0.4);
  setTimeout(() => { if (mode !== "caught") return; mode = "catch"; cs.begin(); cs.t0 = now; cs.playAudio(snd); }, 380);
}
function escape() {
  if (mode !== "play") return; mode = "escape"; finT = Math.round(tPlay * 1000); snd.creak(0.45); world.gate.col.x0 = world.gate.col.x1 = 1e9;
  const G = world.gate; world.gateDoors.forEach((m, i) => { if (i < 2) gsap.to(m.rotation, { y: (i ? 1 : -1) * 1.3 * (G.alongX ? 1 : -1), duration: 1.6, ease: "power2.inOut" }); else gsap.to(m.position, { y: 0.1, duration: 0.5 }); });
  gsap.to(pipe.u.dark, { value: 1, duration: 2.2, delay: 0.6, onComplete: () => showResult(true) }); if (drone) { drone.stop(2.5); drone = null; }
}
let finT = 0, wonRun = false, sentName = null, postText = "";
const setMsg = (text, cls) => { const el = $("#recMsg"); el.textContent = text; el.className = cls || ""; };
function setBig(el, html, vh, vw, px) { // 大きな題字。縦書きは文字の数に合わせて大きさを決める
  el.innerHTML = html; if (!T.vert) { el.style.fontSize = ""; return; }
  const n = Math.max(3, [...html.replace(/<br>/g, "")].length); el.style.fontSize = `min(${((vh * 3) / n).toFixed(2)}vh, ${vw}vw, ${px}px)`;
}
function showResult(won) {
  mode = "result"; document.body.dataset.mode = "result"; pipe.u.dark.value = 1; resetPostKeepDark(); wonRun = won; if (!won) finT = Math.round(tPlay * 1000);
  fillResult(true); const el = $("#result"); el.scrollTop = 0; el.style.pointerEvents = "";
  gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1.6 });
  track("game_end", { won: won ? 1 : 0, sec: Math.round(finT / 1000), plate: P.plate ? 1 : 0, pf: IS_MOBILE ? "m" : "p" });
}
function fillResult(fresh) {
  const tm = T.time(Math.floor(finT / 1000));
  setBig($("#resTitle"), wonRun ? T.resWin : T.resLose, 8, 14, 70);
  $("#resLine").textContent = t(wonRun ? "lineWin" : "lineLose", { t: tm }); $("#resNote").textContent = wonRun ? (P.plate ? T.nOk : T.nBroken) : T.nLose;
  postText = (wonRun ? t("postWin", { t: tm, p: P.plate ? T.pOk : T.pBroken }) : t("postLose", { t: tm })) + "\n" + T.tags;
  $("#recBox").hidden = !wonRun; if (!wonRun || !fresh) return;
  sentName = null; $("#nm").value = ls.get("jm_name", ""); const can = hasRun(); $("#recBtn").disabled = !can; $("#nm").disabled = !can; setMsg(can ? "" : T.offline, "dim");
}
// ---- ランキング ----
async function doRecord() {
  let nm = $("#nm").value.trim().slice(0, 12); if (!nm) return setMsg(T.needname, "err"); if (badName(nm)) return setMsg(T.badname, "err");
  $("#recBtn").disabled = true; setMsg(T.sending, "dim");
  try { const r = await submit(nm, finT, P.plate), rk = (x) => (x ? t("rankN", { r: x }) : T.rankOut); ls.set("jm_name", nm); sentName = nm; setMsg(t("sent", { d: rk(r.d), a: rk(r.a) }) + (r.okA ? "" : T.notbetter), ""); track("rank_submit"); }
  catch (e) { setMsg(T.senderr, "err"); $("#recBtn").disabled = false; }
}
const fmtT = (ms) => { const x = Math.floor(ms / 1000); return Math.floor(x / 60) + ":" + String(x % 60).padStart(2, "0") + "." + String(Math.floor((ms % 1000) / 10)).padStart(2, "0"); };
let rkWhen = "d", rkTok = 0;
async function openRank(when) {
  if (when) rkWhen = when; const pn = $("#rank"); if (!pn.classList.contains("on")) { pn.classList.add("on"); pn.scrollTop = 0; }
  $("#tabD").classList.toggle("on", rkWhen === "d"); $("#tabA").classList.toggle("on", rkWhen === "all");
  const box = $("#rkList"), tok = ++rkTok, msg = (x) => { box.innerHTML = ""; const d = document.createElement("div"); d.className = "rkmsg"; d.textContent = x; box.appendChild(d); }; msg(T.loading);
  try {
    const rows = await board(rkWhen); if (tok !== rkTok) return; if (!rows.length) return msg(T.empty);
    const me = myId(); box.innerHTML = "";
    for (const x of rows) { const d = document.createElement("div"); d.className = "rk" + (x.id === me ? " me" : ""); const add = (tag, cls, txt) => { const e = document.createElement(tag); e.className = cls; e.textContent = txt; d.appendChild(e); };
      add("span", "r", x.rk); add("span", "n", typeof x.n === "string" ? x.n : "?"); if (x.p === 1) add("i", "p", "皿"); add("span", "tm", fmtT(x.t)); box.appendChild(d); }
  } catch (e) { if (tok === rkTok) msg(T.rkErr); }
}
// ---- Xに投稿（自分の紹介ツイートを引用する。引用するツイートは一覧ページ quote/ で切りかえ） ----
const SHARE_URL = "https://nasubi-no-oniwa.com/jumaime/"; let QUOTE = {};
if (!NONET) fetch("https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/xquote/g/jumaime.json").then((r) => r.json()).then((d) => { if (d && typeof d === "object") QUOTE = d; }).catch(() => { });
function quoteURL() { const u = (lang === "ja" ? QUOTE.ja : QUOTE.en) || ""; return /^https:\/\/x\.com\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}$/.test(u) ? u : ""; }
function xIntent(text, url) { const q = quoteURL(); return "https://x.com/intent/post?text=" + encodeURIComponent(q ? text + "\n" + url : text) + "&url=" + encodeURIComponent(q || url); }

// ---- ことばを画面に入れる ----
const FONT = { zh: "Noto+Serif+TC:wght@500;600;900", ko: "Noto+Serif+KR:wght@500;600;900" };
function applyLang() {
  T = TX[lang]; document.documentElement.lang = { ja: "ja", en: "en", zh: "zh-Hant", ko: "ko" }[lang]; document.body.dataset.lang = lang; document.body.classList.toggle("hz", !T.vert); setVertical(T.vert); document.title = T.doc;
  if (FONT[lang] && !document.getElementById("f-" + lang)) { const l = document.createElement("link"); l.id = "f-" + lang; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=" + FONT[lang] + "&display=swap"; document.head.appendChild(l); }
  setBig($("#tBig"), T.big, 11, 19, 92); setBig($("#bigtitle b"), T.big, 13, 22, 400);
  const set = (id, v) => ($(id).textContent = v);
  set("#tSub", T.sub); set("#start", T.start); set("#rankBtn", T.rank); set("#rankBtn2", T.rank); set("#tNote", T.note);
  set("#howH", T.howH); $("#howLead").innerHTML = T.lead; $("#howList").innerHTML = T.how.map((h, i) => `<li><i>${T.howI[i]}</i><span>${h}</span></li>`).join(""); set("#ctl", FINE ? T.ctlP : T.ctlM); set("#enter", T.enter);
  set("#run", T.run); set("#act", P.hidden ? T.out : T.hide); set("#skip", T.skip); if (map) setGoal();
  set("#again", T.again); set("#xBtn", T.xpost); set("#mapNote", T.mapNote); set("#recBtn", T.rec); $("#nm").placeholder = T.nameP;
  set("#rkH", T.rank); set("#tabD", T.today); set("#tabA", T.alltime); set("#rkNote", T.rkNote); set("#rkBack", T.back);
  cs.setWords({ ja: lang === "ja", vert: T.vert, c1: T.c1, c2: T.c2, c3: T.c3, bang: T.bang });
  for (const b of document.querySelectorAll("#langs button")) b.classList.toggle("on", b.dataset.l === lang);
  if (mode === "result") fillResult(false);
}
function resetPostKeepDark() { const u = pipe.u; u.tint.value = 0; u.aberr.value = 0; u.shake.value.set(0, 0); u.tear.value = 0; u.inv.value = 0; u.grain.value = 0.085; }

// ---- 入力 ----
addEventListener("keydown", (e) => { keys[e.code] = true; if ((e.code === "KeyE" || e.code === "Space") && !e.repeat) toggleHide(); });
addEventListener("keyup", (e) => (keys[e.code] = false));
canvas.addEventListener("pointerdown", (e) => { if (mode !== "play" || P.hidden || joy) return; joy = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY }; const j = $("#joy"); j.style.left = e.clientX + "px"; j.style.top = e.clientY + "px"; j.classList.add("on"); });
addEventListener("pointermove", (e) => { if (joy && e.pointerId === joy.id) { joy.x = e.clientX; joy.y = e.clientY; const dx = joy.x - joy.x0, dy = joy.y - joy.y0, m = Math.max(1, Math.hypot(dx, dy) / 52); $("#joy i").style.transform = `translate(${dx / m}px,${dy / m}px)`; } });
const joyEnd = (e) => { if (joy && e.pointerId === joy.id) { joy = null; $("#joy").classList.remove("on"); $("#joy i").style.transform = ""; } };
addEventListener("pointerup", joyEnd); addEventListener("pointercancel", joyEnd);
const rb = $("#run"); rb.addEventListener("pointerdown", (e) => { runHeld = true; rb.classList.add("held"); e.preventDefault(); }); for (const ev of ["pointerup", "pointercancel", "pointerleave"]) rb.addEventListener(ev, () => { runHeld = false; rb.classList.remove("held"); });
$("#act").addEventListener("click", toggleHide);
$("#start").addEventListener("click", () => { if (busy) return; snd.init(); $("#title").style.pointerEvents = "none"; gsap.to("#title", { opacity: 0, duration: 0.8, onComplete: () => ($("#title").style.display = "none") }); newRun(true); });
$("#skip").addEventListener("click", () => { if (mode !== "opening") return; const old = snd.ctx; snd.ctx = null; snd.init(); old.close(); drone = null; showHowto(); }); // 予約した声ごと切りかえる
$("#enter").addEventListener("click", () => { snd.init(); startPlay(); });
$("#again").addEventListener("click", () => { if (busy) return; snd.init(); $("#result").style.pointerEvents = "none"; gsap.to("#result", { opacity: 0, duration: 0.5 }); newRun(false); });
$("#recBtn").addEventListener("click", doRecord);
$("#nm").addEventListener("input", () => { if (sentName !== null) $("#recBtn").disabled = $("#nm").value.trim() === sentName; });
$("#nm").addEventListener("keydown", (e) => { e.stopPropagation(); if (e.key === "Enter") { e.target.blur(); if (!$("#recBtn").disabled) doRecord(); } });
$("#nm").addEventListener("keyup", (e) => e.stopPropagation());
$("#xBtn").addEventListener("click", () => window.open(xIntent(postText, SHARE_URL), "_blank"));
$("#rankBtn").addEventListener("click", () => openRank()); $("#rankBtn2").addEventListener("click", () => openRank());
$("#tabD").addEventListener("click", () => openRank("d")); $("#tabA").addEventListener("click", () => openRank("all"));
$("#rkBack").addEventListener("click", () => { rkTok++; $("#rank").classList.remove("on"); });
for (const [code, name] of LANGS) { const b = document.createElement("button"); b.textContent = name; b.dataset.l = code; b.addEventListener("click", () => { lang = code; ls.set("jm_lang", code); applyLang(); }); $("#langs").appendChild(b); }

function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); pipe.resize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); cs.setAspect(w / h); camY = w / h < 0.72 ? 16 : 14; }
addEventListener("resize", resize); resize();

// ---- 毎フレーム ----
const turb = [...document.querySelectorAll("filter feTurbulence")]; let seedStep = -1;
function frame() {
  now = performance.now() / 1000; const raw = now - last, dt = Math.min(0.05, raw); last = now; qualityStep(raw);
  const sst = Math.floor(now * 9); if (sst !== seedStep) { seedStep = sst; turb.forEach((x) => x.setAttribute("seed", String(sst % 97))); }
  if (mode === "opening") { pipe.setShort(300); pipe.u.gain.value = 1; openingAt(now - opT0, dt); pipe.render(scene, cam, now); }
  else if (mode === "play" || mode === "caught" || mode === "escape") {
    if (mode === "play") { tPlay += dt; if (!P.hidden) playerStep(dt); if (mode === "play") okikuAI(dt); if (mode === "play") hudStep(dt); }
    if (mode !== "catch" && mode !== "result") {
      okikuLook(dt); playerLook(dt); keyFx.update(dt); for (let i = bursts.length - 1; i >= 0; i--) if (bursts[i].update(dt)) bursts.splice(i, 1);
      keyFx.body.material.color.setScalar(P.hidden || roomOf(P.x, P.z) !== map.keyRoom ? 0.04 : clamp(2.2 / (1 + 0.1 * ((P.x - world.key.x) ** 2 + (P.z - world.key.z) ** 2)), 0.06, 1));
      flames.forEach((f, i) => { f.update(dt); const a = now * 0.3 + i * 2.1; f.sp.position.set(world.well.x + Math.cos(a) * 1.5, 1.3 + Math.sin(now * 0.9 + i * 1.7) * 0.2 + i * 0.15, world.well.z + Math.sin(a) * 1.5); f.sp.material.opacity = 1; });
      const d = Math.hypot(P.x - O.x, P.z - O.z), chase = O.state === "chase" || O.state === "open"; fear = lerp(fear, Math.max(clamp01(1 - d / 13), chase ? 0.65 : 0), 1 - Math.exp(-dt * 3));
      heartT -= dt; if (fear > 0.06 && heartT <= 0) { snd.heart(snd.now, 0.2 + fear * 0.75); heartT = lerp(1.15, 0.36, fear); gsap.fromTo("#fearfx", { opacity: 0.1 + fear * 0.6 }, { opacity: fear * 0.14, duration: Math.min(0.5, heartT * 0.85), ease: "power2.out" }); }
      if (fear <= 0.06) $("#fearfx").style.opacity = 0;
      if (P.hidden) hideView(dt); else { cam.position.x = lerp(cam.position.x, P.x, 1 - Math.exp(-dt * 7)); cam.position.z = lerp(cam.position.z, P.z + 5.8, 1 - Math.exp(-dt * 7)); cam.position.y = camY; cam.lookAt(cam.position.x, 0.5, cam.position.z - 6.2); }
      const u = pipe.u; u.aberr.value = fear * fear * 0.011; u.grain.value = (P.hidden ? 0.085 : 0.05) + fear * 0.07; u.vig.value = (P.hidden ? 1.5 : 0.7) + fear * 0.55; u.tear.value = chase ? 0.6 : 0;
      amb.intensity = P.hidden ? 4.2 : 1.15; sky.intensity = P.hidden ? 0.55 : 0; moon.intensity = 24; pipe.setShort(P.hidden ? 300 : playShort); u.gain.value = P.hidden ? 1 : 1.22;
      const sb = $("#stam b"), se = $("#stam"), lab = P.plate ? T.plate : T.broken; sb.style.height = P.stamina * 100 + "%"; se.classList.toggle("low", P.stamina < 0.35 && P.plate); se.classList.toggle("gone", !P.plate); if (se.dataset.l !== lab) se.dataset.l = lab;
      if (mode === "caught") { u.shake.value.set((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02); u.aberr.value = 0.012; }
      pipe.render(scene, cam, now);
    }
  }
  else if (mode === "catch") { pipe.setShort(300); pipe.u.gain.value = 1; const t = now - cs.t0; cs.at(t, pipe.u); pipe.render(cs.scene, cs.cam, t); if (t > cs.END) { showResult(false); } }
  else { pipe.u.dark.value = 1; pipe.render(scene, cam, now); }
  requestAnimationFrame(frame);
}
const _gold = new THREE.Color(0xd2a63a);
document.body.dataset.mode = "title"; last = performance.now() / 1000;
document.documentElement.style.setProperty("--top", (window.self !== window.top ? 96 : 10) + "px"); // アプリの中で開くと上にボタンが重なるので、その分さげる
// 題の画面のうしろに、暗い屋敷を用意しておく
map = genMap(20261117); world = buildWorld(map); scene.add(world.group); world.setView(false); cam.position.set(world.start.x, camY, world.start.z + 5.8); cam.lookAt(world.start.x, 0.5, world.start.z); pipe.u.dark.value = 1;
applyLang();
frame();
// 自動で遊ばせて調べるための入口（音は鳴らさず、絵も描かずに時間だけ進める）
if (__DEV__) {
const simulate = function (seconds, bot) {
  const dt = 1 / 30, names = ["voice", "step", "clink", "slide", "chime", "creak", "croak", "sting", "boom", "heart", "shatter", "ring"], saved = {}, ev = [];
  for (const k of names) { saved[k] = snd[k]; snd[k] = () => ({ starts: [], total: 0 }); }
  let still = 0, lx = O.x, lz = O.z, maxStill = 0, t = 0;
  try { for (; t < seconds && mode === "play"; t += dt) {
    if (bot) { const b = bot(dt); botVec = b && b.vec; runHeld = !!(b && b.run); if (b && b.hide) toggleHide(); }
    tPlay += dt; if (!P.hidden) playerStep(dt); if (mode === "play") okikuAI(dt);
    if (!isFinite(O.x + O.z + P.x + P.z)) { ev.push("NaN"); break; }
    if (O.x < 0 || O.z < 0 || O.x > GW * S || O.z > GH * S || P.x < 0.2 || P.z < 0.2 || P.x > GW * S - 0.2 || P.z > GH * S - 0.2) { ev.push("out"); break; }
    if (Math.hypot(O.x - lx, O.z - lz) < 0.01) { still += dt; maxStill = Math.max(maxStill, still); } else { still = 0; lx = O.x; lz = O.z; }
  } } catch (e) { ev.push("ERR " + e.message); }
  for (const k of names) snd[k] = saved[k]; botVec = null; runHeld = false;
  return { t, mode, ev, maxStill, plate: P.plate, key: P.hasKey, state: O.state };
};
window.__g = { Sound, kanaMoras, COUNTS, LINES, lockQuality() { qLock = true; }, get quality() { return quality; }, simulate, seekOpening(t) { opT0 = now - t; }, seekCatch(t) { cs.t0 = now - t; }, minT() { return minTimeOfMap(map); }, skip() { $("#skip").click(); }, P, O, get map() { return map; }, get world() { return world; }, get mode() { return mode; }, newRun, toggleHide, caught, escape, showResult, applyLang, openRank, setLang(l) { lang = l; applyLang(); }, get T() { return T; }, set finT(v) { finT = v; }, snd, pipe, ok, cam, startPlay, breakPlate, set time(v) { tPlay = v; } };
}
