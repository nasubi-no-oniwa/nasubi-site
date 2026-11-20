// 捕まった場面：「お前が……お前が…………私をはめたのか！！！」
import * as THREE from "three";
import { gsap } from "gsap";
import { makeOkiku } from "./okiku.js";
import { LINES } from "./audio.js";

const _v = new THREE.Vector3();
const hash = (n) => { const x = Math.sin(n * 91.7) * 43758.5453; return x - Math.floor(x); };
const lerp = (a, b, u) => a + (b - a) * Math.min(1, Math.max(0, u));
const ease = (u) => { u = Math.min(1, Math.max(0, u)); return u * u * (3 - 2 * u); };

const T1 = 1.4, GL = 2.75, T2 = 4.1, ON2 = 3.5, OFF2 = 6.55, T3 = 7.35, CUT = 9.95, END = 12.2;
const durOf = (L) => L.m.reduce((s, m) => s + m.d, 0);
const startsOf = (L) => { let t = 0; return L.m.map((m) => { const s = t; t += m.d; return s; }); };

// 字幕：[文字, その文字が出る時刻(秒)]。声は日本語のままなので、ほかの言葉は声の長さに合わせて順に出す
function subtitlePlan(W) {
  const s1 = startsOf(LINES.omae1), s2 = startsOf(LINES.omae2), s3 = startsOf(LINES.hameta);
  const e1 = durOf(LINES.omae1), e2 = durOf(LINES.omae2);
  if (!W || W.ja) return [
    { cls: "l1", chars: [["お", T1 + s1[0]], ["前", T1 + s1[1]], ["が", T1 + s1[3]], ["…", T1 + e1 - 0.25], ["…", T1 + e1 + 0.15]] },
    { cls: "l2", chars: [["お", T2 + s2[0]], ["前", T2 + s2[1]], ["が", T2 + s2[3]], ["…", T2 + e2 - 0.7], ["…", T2 + e2 - 0.4], ["…", T2 + e2 - 0.1], ["…", T2 + e2 + 0.2]] },
    { cls: "l3", chars: [["私", T3 + s3[0]], ["を", T3 + s3[3]], ["は", T3 + s3[4]], ["め", T3 + s3[5]], ["た", T3 + s3[6]], ["の", T3 + s3[7]], ["か", T3 + s3[8], "last"], ["！！！", T3 + s3[8] + 0.22, "bang"]] },
  ];
  const spread = (arr, t0, e, dot0, dotStep) => { const w = arr.filter((c) => c !== "…"), out = w.map((c, i) => [c, t0 + (i / w.length) * Math.max(0.3, e - 0.55)]); for (let j = 0; j < arr.length - w.length; j++) out.push(["…", t0 + e + dot0 + j * dotStep]); return out; };
  const n3 = W.c3.length;
  return [
    { cls: "l1", chars: spread(W.c1, T1, e1, -0.25, 0.4) },
    { cls: "l2", chars: spread(W.c2, T2, e2, -0.7, 0.3) },
    { cls: "l3", chars: [...W.c3.map((c, i) => [c, T3 + s3[8] * (i / Math.max(1, n3 - 1)), i === n3 - 1 ? "last" : ""]), [W.bang, T3 + s3[8] + 0.22, "bang"]] },
  ];
}

export function makeCatchScene(layer, shared) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x000000); scene.fog = new THREE.Fog(0x000000, 1.5, 7.5);
  const cam = new THREE.PerspectiveCamera(58, 1, 0.04, 30);
  const ok = shared || makeOkiku(); if (!shared) { scene.add(ok.root); ok.lookAt = cam.position; } // 目はいつもこちらを追う
  function begin() { scene.add(ok.root); ok.lookAt = cam.position; ok.root.rotation.set(0, 0, 0); buildSubs(); lastT = -1; } // ゲームのお菊さんをそのままこの場面へ連れてくる
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.MeshLambertMaterial({ color: 0x23231c })); floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const key = new THREE.SpotLight(0xb9d2cc, 0, 12, 0.85, 0.9, 1.2); key.position.set(0.5, 3.2, 0.6); scene.add(key); scene.add(key.target);
  const under = new THREE.PointLight(0x9db3ac, 0, 3, 1.4); scene.add(under);
  const amb = new THREE.AmbientLight(0x202830, 0); scene.add(amb);

  let els = [], words = null, plan = subtitlePlan(), fired = new Set(), lastT = -1;
  function setWords(W) { words = W; plan = subtitlePlan(W); buildSubs(); lastT = -1; }
  function buildSubs() {
    layer.innerHTML = ""; els = []; fired = new Set();
    for (const L of plan) { // 「…」は文字に頼らず、点を縦に描く（端末によって横向きに出るため）
      const d = document.createElement("div"); d.className = "sub " + L.cls;
      const vert = !words || words.vert;
      if (L.cls === "l3") { const n = L.chars.length - 1; d.style.fontSize = vert ? `min(${((n > 7 ? 66 : 74) / Math.max(7, n)).toFixed(2)}vh, 27vw)` : "min(15vw, 10vh)"; d.dataset.n = n; }
      L.chars.forEach(([ch, at, extra], i) => { const s = document.createElement("span"); if (ch === "…" && vert) { s.className = "dots"; s.textContent = "口"; } else s.textContent = ch; if (extra === "bang") s.className = "bang"; d.appendChild(s); els.push({ s, at, cls: L.cls, i, line: d, ch, last: extra === "last" }); });
      layer.appendChild(d);
    }
  }
  function showChar(e) {
    const s = e.s;
    if (e.cls === "l1") gsap.fromTo(s, { opacity: 0, filter: "blur(7px)", y: -6 }, { opacity: 0.86, filter: "blur(0px)", y: 0, duration: 0.5, ease: "power1.out" });
    else if (e.cls === "l2") gsap.fromTo(s, { opacity: 0, filter: "blur(5px)", x: gsap.utils.random(-3, 3) }, { opacity: 1, filter: "blur(0px)", duration: 0.28, ease: "power2.out" });
    else {
      const n = +e.line.dataset.n || 7, hz = words && !words.vert, k = 0.92 + e.i * 0.075 * Math.min(1, 6 / Math.max(1, n - 1)) * (hz ? 0.5 : 1);
      gsap.fromTo(s, { opacity: 1, scale: k * 1.9, rotation: gsap.utils.random(-9, 9), x: gsap.utils.random(-14, 14) }, { scale: k, rotation: gsap.utils.random(-4, 4), duration: 0.07, ease: "power4.out" });
      if (e.last) gsap.to(s, { scaleY: k * (hz ? 1.9 : 2.6), scaleX: k * 0.86, duration: 1.25, ease: "power1.in", delay: 0.08 });
      if (s.className === "bang") gsap.fromTo(s, { opacity: 1, y: -30 }, { y: 0, duration: 0.09 });
    }
  }
  function subs(t) {
    if (t < lastT) buildSubs();
    lastT = t;
    for (const e of els) if (t >= e.at && !fired.has(e)) { fired.add(e); showChar(e); }
    // 前の行はうすく残す → 絶叫で消える
    const l1 = layer.querySelector(".l1"), l2 = layer.querySelector(".l2"), l3 = layer.querySelector(".l3");
    if (l1) l1.style.opacity = t > OFF2 ? 0 : t > T2 ? 0.32 : 1;
    if (l2) l2.style.opacity = t > OFF2 ? 0 : 1;
    if (l3) { l3.style.opacity = t >= CUT ? 0 : 1; l3.classList.toggle("split", t > T3); }
    const st = Math.floor(t * 10);
    if (l2 && t > T2) l2.style.transform = `translate(${(hash(st) - 0.5) * 2.4}px, ${(hash(st + 9) - 0.5) * 2.4}px)`;
    if (l3 && t > T3) l3.style.transform = `translate(${(hash(st * 3) - 0.5) * 12}px, ${(hash(st * 3 + 5) - 0.5) * 10}px)`;
  }

  /** 時刻 t（秒）の絵を作る。post は仕上げのつまみ */
  function at(t, post) {
    const p = ok.pose, st = Math.floor(t * 12);
    let L = 0, z = -5.6, tint = 0, aberr = 0.0012, sx = 0, sy = 0, tear = 0, inv = 0, dark = 0, redL = 0, grain = 0.08;
    p.reach = 0; p.mouth = 0; p.part = 0; p.eye = 0.4; p.headDown = 0.85; p.headTilt = 0.1; p.headTurn = 0; p.shiver = 0; p.twitch = 0.3; p.fps = 8; p.lean = 0.08; p.sway = 1;
    cam.position.set(0, 1.52, 0); cam.rotation.set(0, 0, 0); cam.fov = 58;
    if (t >= GL && t < GL + 0.14) { L = 1.0; z = -5.4; }                       // 一瞬だけ見える
    else if (t >= GL + 0.3 && t < GL + 0.36) { L = 0.5; z = -5.4; }
    else if (t >= ON2 && t < OFF2) {                                            // カクカク近づく
      const u = (t - ON2) / (OFF2 - ON2), steps = Math.floor((t - ON2) / 0.42);
      z = -3.5 + steps * 0.3; L = 0.55 * (hash(st * 1.7) > 0.84 ? 0.12 : 1) * (0.8 + hash(st) * 0.3);
      p.headTilt = 0.15 + steps * 0.085; p.headDown = 0.8 - u * 0.25; p.reach = u * 0.22; p.twitch = 0.5 + u * 0.5; p.shiver = u * 0.35; p.part = u * 0.12;
      cam.rotation.z = Math.sin(t * 0.7) * 0.012; grain = 0.1;
    } else if (t >= T3 && t < CUT) {                                            // 絶叫
      const u = t - T3, lunge = ease(u / 0.22);
      z = -1.2;
      p.fps = 14; p.reach = lerp(0.3, 1, ease(u / 0.3)); p.mouth = ease((u - 0.02) / 0.3) * (0.9 + Math.sin(t * 43) * 0.1);
      p.part = ease(u / 0.18); p.eye = 1.5; p.headDown = lerp(0.45, -0.16, ease(u / 0.16)); p.shiver = 1; p.twitch = 1; p.lean = 0.2;
      p.headTilt = (hash(Math.floor(t * 7)) - 0.5) * 0.55; p.headTurn = (hash(Math.floor(t * 7) + 3) - 0.5) * 0.18;
      const strobe = hash(st * 5.1) > 0.82 ? 0.2 : 1; L = 0.85 * strobe; redL = 0.7 * strobe;
      tint = 0.12 + 0.2 * hash(st); aberr = 0.006 + 0.012 * hash(st * 1.3); tear = 1; grain = 0.16;
      sx = (hash(st * 7.1) - 0.5) * 0.045; sy = (hash(st * 8.3) - 0.5) * 0.04;
      inv = (u < 0.06 || (u > 1.42 && u < 1.5)) ? 1 : 0;
      cam.fov = 58;
    }
    if (t >= CUT) dark = 1;
    ok.root.position.set((t >= T3 && t < CUT) ? 0.02 : 0, 0, z);
    key.intensity = L * 60; key.target.position.set(0, 1.3, z); key.position.set(0.5, 3.2, z + 1.5);
    under.intensity = redL * 0.9; under.position.set(0, 1.2, z + 0.45); amb.intensity = L > 0 ? 0.25 : 0;
    ok.update(t);
    if (t >= T3 && t < CUT) { // 顔の位置を基準にカメラを置く（必ず顔が画面いっぱいに来る）
      const u = t - T3, h = ok.headWorld(_v), d = lerp(1.25, 0.66, ease(u / 0.2)) - ease((u - 0.4) / 2.2) * 0.17 + (hash(st * 2.2) - 0.5) * 0.03;
      cam.position.set(h.x + (hash(st * 3.7) - 0.5) * 0.03, h.y - 0.1, h.z + d); cam.lookAt(h.x, h.y - 0.02, h.z); cam.rotation.z += (hash(st * 9.9) - 0.5) * 0.12;
      key.position.set(h.x + 0.3, h.y + 1.2, h.z + 1.2); key.target.position.copy(h); under.position.set(h.x, h.y - 0.55, h.z + 0.5);
    }
    cam.updateProjectionMatrix();
    if (post) { post.tint.value = tint; post.aberr.value = aberr; post.shake.value.set(sx, sy); post.tear.value = tear; post.inv.value = inv; post.dark.value = dark; post.grain.value = grain; post.vig.value = 1.1; }
    subs(t);
  }

  /** 音をまとめて予約する */
  function playAudio(snd) {
    const t0 = snd.now + 0.06; snd.boom(t0, 0.5);
    const dr = snd.drone(0.2); setTimeout(() => dr.stop(0.03), (OFF2 + 0.02) * 1000);
    snd.voice(LINES.omae1.m, t0 + T1, LINES.omae1.o);
    snd.sting(t0 + GL, 0.5, 0.12);
    snd.voice(LINES.omae2.m, t0 + T2, LINES.omae2.o);
    snd.heart(t0 + OFF2 + 0.08, 0.9); snd.heart(t0 + OFF2 + 0.47, 1.0);
    snd.boom(t0 + T3, 1.3); snd.sting(t0 + T3, 2.4, 0.42);
    snd.voice(LINES.hameta.m, t0 + T3, LINES.hameta.o);
    snd.voice(LINES.hameta.m.map((m) => ({ ...m, f: m.f.map((x) => x * 0.5), fp: m.fp && m.fp.map(([u, x]) => [u, x * 0.502]) })), t0 + T3 + 0.012, { ...LINES.hameta.o, amp: 0.8, croak: 0.9, croakHz: 33, breath: 0.6, pan: -0.2 });
    snd.voice(LINES.hameta.m.map((m) => ({ ...m, f: m.f.map((x) => x * 1.5), fp: m.fp && m.fp.map(([u, x]) => [u, x * 1.49]) })), t0 + T3 + 0.02, { ...LINES.hameta.o, amp: 0.45, breath: 0.8, pan: 0.3 });
    snd.shatter(t0 + CUT, 1.0); snd.ring(t0 + CUT + 0.05, 2.4, 0.04);
    // ぶつっと切る
    const m = snd.master.gain; m.setValueAtTime(0.9, t0 + CUT - 0.01); m.setValueAtTime(0.0, t0 + CUT - 0.004); m.setValueAtTime(0.9, t0 + CUT);
    snd.revGain.gain.setValueAtTime(0.55, t0 + CUT - 0.01); snd.revGain.gain.setValueAtTime(0, t0 + CUT - 0.004); snd.revGain.gain.linearRampToValueAtTime(0.55, t0 + CUT + 0.3);
  }
  buildSubs();
  function setAspect(a) { cam.aspect = a; cam.updateProjectionMatrix(); }
  return { scene, cam, at, playAudio, END, setAspect, reset: buildSubs, begin, setWords };
}
