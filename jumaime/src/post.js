// 粗いドット＋ざらつき＋色ずれの仕上げ（pixelfx の「色を段にする・ディザ」の考え方を3Dに置きかえたもの）
import * as THREE from "three";

const FRAG = `
precision highp float;
uniform sampler2D tD;
uniform vec2 res;
uniform float time, aberr, grain, vig, inv, tint, dark, tear, gain;
uniform vec2 shake;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
float bayer(vec2 p){
  int x = int(mod(p.x, 4.0)), y = int(mod(p.y, 4.0));
  const float m[16] = float[16](0.,8.,2.,10., 12.,4.,14.,6., 3.,11.,1.,9., 15.,7.,13.,5.);
  return (m[x + y * 4] + 0.5) / 16.0;
}
void main(){
  vec2 uv = vUv + shake;
  // 画面の裂け（横ずれ）
  float band = step(0.985, hash(vec2(floor(uv.y * res.y / 3.0), floor(time * 14.0))));
  uv.x += band * tear * (hash(vec2(time, uv.y)) - 0.5) * 0.25;
  float ln = smoothstep(0.02, 0.0, abs(uv.y - fract(time * 0.11))) ;
  uv.x += ln * 0.006;
  vec2 px = floor(uv * res);
  vec3 c;
  float ab = floor(aberr * res.x + 0.5) / res.x; // 色ずれは1ドット単位（細い線に色のごみを出さない）
  c.r = texture2D(tD, uv + vec2(ab, 0.0)).r;
  c.g = texture2D(tD, uv).g;
  c.b = texture2D(tD, uv - vec2(ab, 0.0)).b;
  c = pow(max(c, 0.0), vec3(1.0 / 2.2));
  c *= gain;
  c += (hash(px + floor(time * 24.0) * 7.31) - 0.5) * grain;
  c += ln * 0.03;
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  c = mix(c, vec3(lum * 1.25, lum * 0.12, lum * 0.1), tint);
  const float LV = 22.0;
  float l2 = max(dot(c, vec3(0.299, 0.587, 0.114)), 0.0001);
  c = mix(vec3(l2), c, smoothstep(0.015, 0.11, l2)); // 暗い所は色を抜く（色のちらつきを出さない）
  c *= (floor(l2 * LV + bayer(px)) / LV) / l2; // 明るさだけ段にする（暗い所で色がにごらない）
  vec2 q = vUv - 0.5;
  c *= 1.0 - vig * dot(q, q) * 2.6;
  c = mix(c, 1.0 - c, inv);
  c *= 1.0 - dark;
  gl_FragColor = vec4(c, 1.0);
}`;
const VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

export function makePipeline(renderer, shortSide = 230) {
  const rt = new THREE.WebGLRenderTarget(4, 4, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: true });
  const u = {
    tD: { value: rt.texture }, res: { value: new THREE.Vector2(4, 4) }, time: { value: 0 },
    aberr: { value: 0.0012 }, grain: { value: 0.07 }, vig: { value: 0.9 }, inv: { value: 0 }, tint: { value: 0 },
    dark: { value: 0 }, tear: { value: 0 }, gain: { value: 1 }, shake: { value: new THREE.Vector2() },
  };
  const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: VERT, fragmentShader: FRAG, depthTest: false, depthWrite: false });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
  const qs = new THREE.Scene(); qs.add(quad);
  const qc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  let W = 4, H = 4, lw = 4, lh = 4, ss = shortSide;
  function setShort(n) { if (n !== ss) { ss = n; resize(lw, lh); } } // ドットの細かさを場面ごとに変える
  function resize(w, h) {
    lw = w; lh = h; const k = ss / Math.min(w, h);
    W = Math.max(8, Math.round(w * k)); H = Math.max(8, Math.round(h * k));
    rt.setSize(W, H); u.res.value.set(W, H);
  }
  function render(scene, camera, t) {
    u.time.value = t;
    renderer.setRenderTarget(rt); renderer.render(scene, camera);
    renderer.setRenderTarget(null); renderer.render(qs, qc);
  }
  return { u, resize, render, setShort };
}
