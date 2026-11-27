// 剣士（全員同じモデル。関節つき・アニメ風の塗りと輪郭線）と、型ごとの動き
import { THREE } from './lib.js?v=11271835';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export function toonMap() { const d = new Uint8Array([70, 70, 70, 255, 150, 150, 150, 255, 215, 215, 215, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 4, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; }
const GM = toonMap();
export const OUT = new THREE.MeshBasicMaterial({ color: 0x05050a, side: THREE.BackSide });
export const toon = (c, o) => new THREE.MeshToonMaterial(Object.assign({ color: c, gradientMap: GM }, o || {}));
// 輪郭線つきの部品
export function part(geo, mat, ol) { const m = new THREE.Mesh(geo, mat); if (ol !== 0) { const o = new THREE.Mesh(geo, OUT); o.scale.setScalar(ol || 1.09); m.add(o); } return m; }
// Blender で作ったモデル用：色は頂点に入っている。輪郭線は面の向きに少しふくらませて描く
export const OUTN = new THREE.MeshBasicMaterial({ color: 0x05050a, side: THREE.BackSide });
OUTN.onBeforeCompile = s => { s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed += normalize(normal) * 0.013;'); };
export const vtoon = c => toon(c == null ? 0xffffff : c, { vertexColors: true });
export const withOut = (geo, mat) => { const m = new THREE.Mesh(geo, mat); m.add(new THREE.Mesh(geo, OUTN)); return m; };
export function makeRig(glowTex) {
  const root = new THREE.Group(), rig = new THREE.Group(); root.add(rig);
  const black = toon(0x1b1b24), beige = toon(0xd9d2bf), skin = toon(0xf0c8a4), hairM = toon(0x241a1e), white = toon(0xf2f0ea), gold = toon(0xc9a14a), wood = toon(0x2a1d16);
  const J = {}; const grp = (parent, x, y, z) => { const g = new THREE.Group(); g.position.set(x, y, z || 0); parent.add(g); return g; };
  J.hips = grp(rig, 0, .95);
  // 腰・帯
  const pelvis = part(new THREE.CapsuleGeometry(.17, .1, 4, 10), black); pelvis.position.y = .02; J.hips.add(pelvis);
  const belt = part(new THREE.CylinderGeometry(.185, .185, .07, 14), white, 1.05); belt.position.y = .13; J.hips.add(belt);
  // 脚（はかま風の太もも・脚絆）
  for (const s of ['L', 'R']) { const sg = s === 'L' ? -1 : 1; const hip = grp(J.hips, sg * .105, 0); J['hip' + s] = hip;
    const th = part(new THREE.CapsuleGeometry(.105, .26, 4, 10), black); th.position.y = -.2; hip.add(th);
    const knee = grp(hip, 0, -.42); J['knee' + s] = knee; const sh = part(new THREE.CapsuleGeometry(.075, .26, 4, 10), beige); sh.position.y = -.2; knee.add(sh);
    const ft = part(new THREE.BoxGeometry(.12, .08, .24), black, 1.12); ft.position.set(0, -.44, -.05); knee.add(ft); }
  // 胴（背中に「滅」）
  J.torso = grp(J.hips, 0, .15);
  const chest = part(new THREE.CapsuleGeometry(.185, .26, 4, 12), black); chest.position.y = .22; chest.scale.set(1.08, 1, .82); J.torso.add(chest);
  const mt = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#f4f2ec'; x.font = '900 104px "Hiragino Mincho ProN","Yu Mincho","Noto Serif JP","Noto Serif CJK JP",serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('滅', 64, 70); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const metsu = new THREE.Mesh(new THREE.PlaneGeometry(.3, .3), new THREE.MeshBasicMaterial({ map: mt, transparent: true })); metsu.position.set(0, .26, .162); J.torso.add(metsu);
  // 羽織（色は刀の色に合わせる。裾がなびく）
  const haoriM = toon(0x335588, { side: THREE.DoubleSide });
  J.tails = []; for (const sg of [-1, 1]) { const tg = grp(J.torso, sg * .1, .02, .14); const tl = part(new THREE.BoxGeometry(.2, .5, .02), haoriM, 1.06); tl.position.y = -.25; tg.add(tl); J.tails.push(tg); }
  const collar = part(new THREE.CylinderGeometry(.21, .23, .12, 12, 1, true), haoriM, 0); collar.position.y = .4; J.torso.add(collar);
  // 頭
  J.head = grp(J.torso, 0, .56);
  const neck = part(new THREE.CylinderGeometry(.06, .07, .1, 8), skin, 0); neck.position.y = -.08; J.head.add(neck);
  const face = part(new THREE.SphereGeometry(.17, 14, 12), skin); face.position.y = .1; J.head.add(face);
  const hair = part(new THREE.SphereGeometry(.185, 14, 12, 0, Math.PI * 2, 0, Math.PI * .62), hairM); hair.position.set(0, .12, .025); hair.rotation.x = .45; J.head.add(hair);
  for (let i = 0; i < 7; i++) { const a = (i / 6 - .5) * 2.2, sp = part(new THREE.ConeGeometry(.055, .2, 5), hairM, 1.15); sp.position.set(Math.sin(a) * .15, .1 + Math.cos(a) * .05 - Math.abs(a) * .03, .13 - Math.abs(Math.sin(a)) * .04); sp.rotation.set(1.9, 0, -a * .6); J.head.add(sp); }
  // 腕
  for (const s of ['L', 'R']) { const sg = s === 'L' ? -1 : 1; const sh = grp(J.torso, sg * .25, .4); J['sh' + s] = sh;
    const up = part(new THREE.CapsuleGeometry(.068, .17, 4, 8), black); up.position.y = -.13; sh.add(up);
    const sl = part(new THREE.CylinderGeometry(.075, .13, .2, 10, 1, true), haoriM, 0); sl.position.y = -.14; sh.add(sl);
    const el = grp(sh, 0, -.27); J['el' + s] = el; const fo = part(new THREE.CapsuleGeometry(.055, .16, 4, 8), black); fo.position.y = -.12; el.add(fo);
    const hd = part(new THREE.SphereGeometry(.06, 8, 8), skin); hd.position.y = -.26; el.add(hd); J['hand' + s] = grp(el, 0, -.26); }
  // 刀
  J.kat = grp(J.handR, 0, 0);
  const bladeM = new THREE.MeshBasicMaterial({ color: 0xb9bec4 });
  const blade = new THREE.Mesh(new THREE.BoxGeometry(.05, 1.12, .014), bladeM); blade.position.y = .7; J.kat.add(blade);
  const bo = new THREE.Mesh(new THREE.BoxGeometry(.075, 1.15, .03), OUT); bo.position.y = .7; J.kat.add(bo);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(.026, .09, 4), bladeM); tip.position.y = 1.3; tip.scale.z = .3; J.kat.add(tip);
  const tsuba = part(new THREE.CylinderGeometry(.085, .085, .025, 12), gold, 1.1); tsuba.position.y = .12; J.kat.add(tsuba);
  const tsuka = part(new THREE.CylinderGeometry(.026, .028, .3, 8), wood, 1.2); tsuka.position.y = -.03; J.kat.add(tsuka);
  const bg = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0, fog: false })); bg.scale.set(.5, 1.6, 1); bg.position.y = .72; J.kat.add(bg);
  // さや（左の腰）
  const saya = part(new THREE.CylinderGeometry(.03, .024, .95, 8), wood, 1.2); saya.position.set(-.2, .0, .2); saya.rotation.set(1.05, 0, .2); J.hips.add(saya);
  // 鬼の姿（Blender のモデルを関節に取りつける）。look(true) で剣士の部品をかくして鬼にする
  const humanParts = []; root.traverse(o => { if (o.isMesh || o.isSprite) humanParts.push(o); }); const oniParts = []; let oniOn = false;
  const JOINT = { hips: 'hips', thighR: 'hipR', thighL: 'hipL', shinR: 'kneeR', shinL: 'kneeL', torso: 'torso', torso_glow: 'torso', head: 'head', head_glow: 'head', upperR: 'shR', upperL: 'shL', foreR: 'elR', foreL: 'elL' };
  function setOniModel(gltf) { if (oniParts.length) return; const VT = vtoon(), GL = new THREE.MeshBasicMaterial({ vertexColors: true }); gltf.scene.traverse(o => { if (!o.isMesh || !JOINT[o.name]) return; const glow = /_glow$/.test(o.name), m = glow ? new THREE.Mesh(o.geometry, GL) : withOut(o.geometry, VT); m.visible = oniOn; J[JOINT[o.name]].add(m); oniParts.push(m); }); }
  function look(oni) { oniOn = !!oni && oniParts.length > 0; humanParts.forEach(o => { o.visible = !oniOn; }); oniParts.forEach(o => { o.visible = oniOn; }); rig.scale.setScalar(oniOn ? 1.14 : 1); }
  const P = {}; let ph = 0, act = null, actT = 0, actW = 0, tailA = 0, loop = null;
  const BASE = { by: 0, bz: 0, brx: 0, bry: 0, brz: 0, trx: 0, ty: 0, trz: 0, hrx: 0, sRx: 0, sRz: 0, eR: 0, ba: 2.4, sLx: 0, sLz: 0, eL: 0, hLx: 0, kL: 0, hRx: 0, kR: 0 };
  // 動き（u は 0→1）。k: [[時刻, 姿勢], …]
  const C1 = { sRx: 2.35, sRz: .6, eR: .6, ba: .8, ty: -.6, sLx: 1.6, eL: 1.0 }, C2 = { sRx: .7, sRz: -.4, eR: .2, ba: -2.25, ty: .65, sLx: .5, eL: .6 };
  const D1 = { sRx: 2.3, sRz: -.5, eR: .6, ba: .8, ty: .6, sLx: 1.6, eL: 1.0 }, D2 = { sRx: .7, sRz: .65, eR: .2, ba: -2.25, ty: -.65, sLx: .5, eL: .6 };
  const H1 = { sRx: 1.45, sRz: .2, eR: .15, ba: -1.5, ty: -1.4, bry: -.55, trx: -.15, sLx: 1.2, eL: .8 }, H2 = Object.assign({}, H1, { ty: 1.4, bry: .75 });
  const FL = { sRx: 2.3, sRz: 0, eR: .15, ba: -.6, hLx: 1.25, kL: -1.7, hRx: 1.25, kR: -1.7, trx: -.3, sLx: 2.2, eL: .2 };
  const RI1 = { by: -.3, trx: -.75, sRx: -.4, sRz: .2, eR: .3, ba: 2.55, hLx: .95, kL: -1.5, hRx: .95, kR: -1.5, sLx: -.3, eL: .5 }, RI2 = { by: 1.15, trx: .25, sRx: 2.95, sRz: 0, eR: .1, ba: .45, hLx: .15, kL: -.2, hRx: -.35, kR: -.6, sLx: 2.6, eL: .3 };
  const SM1 = { by: 2.0, trx: .4, sRx: 3.0, sRz: 0, eR: .55, ba: 1.35, hLx: .85, kL: -1.6, hRx: .5, kR: -1.3, sLx: 2.9, eL: .5 }, SM2 = { by: .02, trx: -.9, sRx: .7, sRz: 0, eR: .1, ba: -2.35, hLx: 1.15, kL: -1.35, hRx: -.45, kR: -.7, sLx: .7, eL: .2 };
  const TH1 = { sRx: .15, sRz: .1, eR: 2.0, ba: -1.57, ty: -.65, bz: .4, trx: -.3, hLx: -.4, kL: -.3, hRx: .5, kR: -.6, sLx: .9, eL: .9 }, TH2 = { sRx: 1.55, sRz: -.1, eR: 0, ba: -1.57, ty: .45, bz: -2.4, trx: -.6, hLx: 1.1, kL: -.7, hRx: -.9, kR: -.2, sLx: -.5, eL: .3 };
  const IA1 = { by: -.4, trx: -.85, ty: -.75, hrx: .7, sRx: .45, sRz: -.8, eR: 1.5, ba: 2.55, hLx: 1.15, kL: -1.35, hRx: -.75, kR: -.5, bz: 0, sLx: .25, eL: 1.2 }, IA2 = { by: -.1, trx: -.55, ty: 1.15, hrx: .4, sRx: 1.5, sRz: .95, eR: 0, ba: -1.57, hLx: -.55, kL: -.3, hRx: 1.05, kR: -.9, bz: -7.5, sLx: -.7, eL: .3 };
  const ACT = {
    cutA: { d: .2, hit: .09, k: [[0, C1], [.25, C1], [.8, C2], [1, C2]] }, cutB: { d: .2, hit: .09, k: [[0, D1], [.25, D1], [.8, D2], [1, D2]] },
    slashH: { d: .52, hit: .2, k: [[0, H1], [.32, H1], [.6, H2], [1, H2]] }, slashH2: { d: .78, hit: .16, k: [[0, H1], [.18, H1], [.42, H2], [.56, H2], [.82, H1], [1, H1]] },
    flipV: { d: .62, hit: .2, flip: 1, k: [[0, FL], [1, FL]] },
    rise: { d: .56, hit: .22, k: [[0, RI1], [.32, RI1], [.6, RI2], [.8, Object.assign({}, RI2, { by: .7 })], [1, Object.assign({}, RI2, { by: 0 })]] },
    smash: { d: .66, hit: .44, k: [[0, Object.assign({}, SM1, { by: 0 })], [.4, SM1], [.7, SM2], [1, SM2]] },
    thrust: { d: .52, hit: .2, k: [[0, TH1], [.3, TH1], [.46, TH2], [.8, TH2], [1, Object.assign({}, TH2, { bz: 0 })]] },
    iai: { d: .8, hit: .4, k: [[0, IA1], [.46, IA1], [.55, IA2], [.8, IA2], [1, Object.assign({}, IA2, { bz: 0 })]] },
  };
  const LOOP = {
    spin: t => ({ bry: t * 15, sRx: 1.5, sRz: .35, eR: 0, ba: -1.5, by: .14 + Math.sin(t * 8) * .05, hLx: .45, kL: -1.0, hRx: .2, kR: -.7, trx: 0, sLx: 1.5, sLz: -.35, eL: 0 }),
    flow: t => ({ bry: Math.sin(t * 7) * .9, brz: Math.sin(t * 7) * .28, ty: Math.sin(t * 14) * 1.25, sRx: 1.35, sRz: .2, eR: .1, ba: -1.5 + Math.sin(t * 14 + 1) * .6, trx: -.3, sLx: 1.1, eL: .7 }),
    dragon: t => ({ brz: t * 11, by: .85, bry: Math.sin(t * 5) * .4, ty: Math.sin(t * 16) * 1.0, sRx: 2.0, sRz: .2, eR: .1, ba: -1.2, trx: -.5, hLx: .9, kL: -1.4, hRx: .6, kR: -1.2, sLx: 2.0, eL: .2 }),
    calm: () => ({ trx: 0, ty: 0, hrx: 0, sRx: .22, sRz: .28, eR: .05, ba: 2.98, sLx: 0, sLz: -.1, eL: .1, hLx: 0, kL: 0, hRx: 0, kR: 0, by: 0 }),
    charge: () => ({ trx: -1.0, hrx: .8, sRx: -1.0, sRz: .55, eR: .15, ba: 2.2, sLx: -1.0, sLz: -.55, eL: .15 }),
    raise: () => ({ sRx: 3.0, sRz: .1, eR: 0, ba: .05, trx: .05, sLx: .5, eL: .5 }),
    sense: () => ({ by: -.32, trx: -.3, sRz: 1.3, sRx: .2, eR: .2, ba: -1.5, sLz: -1.3, sLx: .2, eL: .2, hLx: .7, kL: -1.3, hRx: .7, kR: -1.3 }),
    idle: t => ({ trx: -.04, sRx: .95, sRz: .12, eR: .45, ba: -.85 + Math.sin(t * 2) * .03, sLx: .85, sLz: .1, eL: .75, hLx: .12, kL: -.2, hRx: -.18, kR: -.1, by: Math.sin(t * 2) * .012 }),
    multi: t => { const i = Math.floor(t / .1), u = (t / .1) % 1, a = i % 2 ? [D1, D2] : [C1, C2], o = {}; const k = u * u * (3 - 2 * u); for (const key in a[0]) o[key] = a[0][key] + (a[1][key] - a[0][key]) * k; return o; },
    down: t => ({ brx: -Math.min(1.45, t * 3), by: -Math.min(.25, t * .5), sRx: .6, eR: .3, ba: -1.2, hLx: .5, kL: -1.2, hRx: .2, kR: -.9 }),
  };
  function kf(keys, u) { let i = 0; while (i < keys.length - 2 && u > keys[i + 1][0]) i++; const a = keys[i], b = keys[i + 1]; let k = clamp((u - a[0]) / (b[0] - a[0] || 1), 0, 1); k = k * k * (3 - 2 * k); const o = {}; for (const key in b[1]) { const va = a[1][key]; o[key] = va === undefined ? b[1][key] : va + (b[1][key] - va) * k; } for (const key in a[1]) if (!(key in o)) o[key] = a[1][key]; return o; }
  const A = {
    root, J, bladeM, haoriM, bladeGlow: bg.material, setOniModel, look, isOni: () => oniOn,
    play(id) { const a = ACT[id]; if (!a) return 0; act = a; actT = 0; return a.hit; }, playing: () => !!act, setLoop(id) { if ((id || null) !== loop) { loop = id || null; actT = 0; actW = 0; } }, loop: () => loop,
    // run: 走っているか、sp: 脚の速さ、dt
    step(dt, run, sp) {
      ph += dt * sp; const s = Math.sin(ph), c = Math.cos(ph), p = Object.assign({}, BASE);
      if (run) { p.hLx = s * .95; p.kL = -(.3 + Math.max(0, c)); p.hRx = -s * .95; p.kR = -(.3 + Math.max(0, -c)); p.trx = -.42; p.ty = s * .15; p.by = Math.abs(c) * .07; p.sLx = -s * .8; p.eL = 1.0; p.sLz = -.15; p.sRx = -.6 + s * .12; p.sRz = .45; p.eR = .35; p.ba = 2.3; p.hrx = .3; }
      let ov = null, w = 0, flip = 0;
      if (act) { actT += dt; const u = actT / act.d; if (u >= 1.25) act = null; else { ov = kf(act.k, Math.min(1, u)); w = Math.min(1, actT / .045) * (u > 1 ? 1 - (u - 1) / .25 : 1); if (act.flip) { const e = Math.min(1, u); flip = e * e * (3 - 2 * e); ov.brx = u >= 1 ? 0 : -Math.PI * 2 * flip; ov.by = Math.sin(Math.min(1, u) * Math.PI) * 1.5; } } }
      else if (loop) { ov = LOOP[loop](actT += dt); w = actW = Math.min(1, actW + dt * 9); }
      if (!act && !loop) { actW = 0; if (actT > 1e3) actT = 0; }
      if (ov) for (const k in ov) p[k] = k === 'brx' || k === 'bry' || k === 'brz' ? ov[k] * (w > .5 ? 1 : w * 2) : p[k] + (ov[k] - p[k]) * w;
      rig.position.set(0, p.by, p.bz); rig.rotation.set(p.brx, p.bry, p.brz);
      J.torso.rotation.set(p.trx, p.ty, p.trz); J.head.rotation.x = p.hrx;
      J.shR.rotation.set(p.sRx, 0, p.sRz); J.elR.rotation.x = p.eR; J.kat.rotation.x = p.ba - p.sRx - p.eR - p.trx;
      J.shL.rotation.set(p.sLx, 0, p.sLz); J.elL.rotation.x = p.eL;
      J.hipL.rotation.x = p.hLx; J.kneeL.rotation.x = p.kL; J.hipR.rotation.x = p.hRx; J.kneeR.rotation.x = p.kR;
      tailA += ((run ? .9 : .1) + Math.sin(ph * 2) * .18 - tailA) * Math.min(1, dt * 6); J.tails[0].rotation.x = tailA - p.trx; J.tails[1].rotation.x = tailA * .9 + Math.cos(ph * 2) * .1 - p.trx; J.tails[0].rotation.z = -.12 - tailA * .1; J.tails[1].rotation.z = .12 + tailA * .1;
    },
  };
  return A;
}
