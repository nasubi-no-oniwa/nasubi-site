import { THREE, GLTFLoader, RoomEnvironment } from './lib.js';
const $ = id => document.getElementById(id);
const gsap = window.gsap, PFX = window.PFX;
const DEV = /[?&]dev=1/.test(location.search);
const IS_PHONE = /iPhone|iPod|iPad|Android/i.test(navigator.userAgent || '');

// ---------- ことば ----------
const TX = {
  ja: { lang: '日本語', ttl: 'カエります', h1: 'カエ<em>り</em>ます', lead: '巣穴に<b>カエれ。</b><br>鳴き声のするほうへ。<br>草が揺れたら、<b>逃げろ。</b>', start: 'カエる', rank: 'ランキング', hop: 'ぴょん', hint: 'なぞって向きを変える<br>ボタンを押してぴょん', hintPC: 'ドラッグか ← → で向きを変える<br>スペースキーでぴょん', eaten: '食われた', home: 'ただいま', rvDead: '食われた', rvOk: 'カエれた', tOk: 'カエるまでの時間', tDead: '生きていた時間', msgOk: k => k ? `ザリガニ ${k}匹から逃げきった` : 'ザリガニに1匹も会わなかった', msgDead: m => `巣穴まで あと ${m}m`, legend: '白：通った道　赤：ザリガニ　茶：巣穴', name: '名前（12文字まで）', rec: 'ランキングに記録する', img: '画像にする', x: '𝕏 に投稿', again: 'もう一度 カエる', back: 'もどる', today: '今日', all: '全期間', rkNote: '巣穴にカエれた人だけ。早い順', loading: '読みこみ中…', empty: 'まだ誰もカエれていません', rankErr: 'ランキングを読みこめませんでした', needName: '名前を入れてください', badName: 'その名前は使えません', sending: '記録しています…', recPre: '記録しました：', sendErr: '記録できませんでした。電波のいい所でもう一度押してください', norun: 'この回は通信ができなかったため、記録できません', deadNote: '食われたので、記録はありません', place: n => n + '位', out: '100位圏外', rankRes: (d, a, best) => `今日 ${d}／全期間 ${a}` + (best ? '（自己ベスト）' : ''), sndOn: '🔊 音あり', sndOff: '🔇 音なし', croak: 'ケロ', postOk: (t, k) => `「カエります」で、${t} で巣穴にカエれました。\nザリガニ${k}匹から逃げきった。\n#カエります #ブラウザゲーム`, postDead: (t, m) => `「カエります」で、ザリガニに食われました。\n巣穴まで あと${m}m（${t}）\n#カエります #ブラウザゲーム`, xCopied: '画像をコピーしました。Xの投稿欄に貼りつけ（Ctrl+V）すると画像がつきます', xSaved: '画像を保存しました。Xの投稿に、保存した画像を追加してください', nogl: 'この端末では3Dを表示できませんでした' },
  en: { lang: 'English', ttl: 'Hop Home', h1: 'Hop <em>Home</em>', lead: '<b>Get back</b> to your burrow.<br>Follow the croaking.<br>If the grass shakes, <b>run.</b>', start: 'Go home', rank: 'Ranking', hop: 'HOP', hint: 'Drag to turn<br>Hold the button to hop', hintPC: 'Drag or ← → to turn<br>Space to hop', eaten: 'EATEN', home: 'HOME!', rvDead: 'EATEN', rvOk: 'HOME', tOk: 'Time to get home', tDead: 'Time alive', msgOk: k => k ? `Escaped ${k} crayfish` : 'Met no crayfish at all', msgDead: m => `${m}m short of the burrow`, legend: 'White: your path  Red: crayfish  Brown: burrow', name: 'Name (up to 12)', rec: 'Submit to ranking', img: 'Save image', x: 'Post to 𝕏', again: 'Go home again', back: 'Back', today: 'Today', all: 'All time', rkNote: 'Only frogs that got home. Fastest first', loading: 'Loading…', empty: 'Nobody has made it home yet', rankErr: 'Could not load the ranking', needName: 'Enter a name', badName: "That name can't be used", sending: 'Submitting…', recPre: 'Saved: ', sendErr: 'Could not submit. Try again with a better connection', norun: 'This run had no connection, so it cannot be submitted', deadNote: 'You were eaten, so there is no record', place: n => '#' + n, out: 'outside top 100', rankRes: (d, a, best) => `Today ${d} / All time ${a}` + (best ? ' (personal best)' : ''), sndOn: '🔊 Sound on', sndOff: '🔇 Sound off', croak: 'ribbit', postOk: (t, k) => `I got home in ${t} in "Hop Home".\nEscaped ${k} crayfish.\n#HopHome #browsergame`, postDead: (t, m) => `A crayfish ate me in "Hop Home".\n${m}m short of the burrow (${t})\n#HopHome #browsergame`, xCopied: 'Image copied. Paste it (Ctrl+V) into the post box on X to attach it', xSaved: 'Image saved. Attach the saved image to your post on X', nogl: 'This device could not show 3D graphics' },
  zh: { lang: '繁體中文', ttl: '青蛙要回家', h1: '青蛙要<em>回家</em>', lead: '<b>回到</b>你的巢穴。<br>往叫聲的方向走。<br>草一搖動，就<b>快逃。</b>', start: '回家', rank: '排行榜', hop: '跳', hint: '滑動改變方向<br>按住按鈕跳', hintPC: '拖曳或 ← → 改變方向<br>空白鍵跳', eaten: '被吃了', home: '我回來了', rvDead: '被吃了', rvOk: '回家了', tOk: '回家花的時間', tDead: '存活時間', msgOk: k => k ? `從 ${k} 隻小龍蝦手中逃掉了` : '一隻小龍蝦都沒遇到', msgDead: m => `離巢穴還有 ${m}m`, legend: '白：走過的路　紅：小龍蝦　棕：巢穴', name: '名字（最多12字）', rec: '登錄排行榜', img: '存成圖片', x: '發到 𝕏', again: '再回家一次', back: '返回', today: '今天', all: '全部', rkNote: '只有回到巢穴的人。越快越前面', loading: '讀取中…', empty: '還沒有人回到家', rankErr: '無法讀取排行榜', needName: '請輸入名字', badName: '這個名字不能使用', sending: '登錄中…', recPre: '已登錄：', sendErr: '登錄失敗，請在收訊好的地方再按一次', norun: '這一局沒有連線，無法登錄', deadNote: '被吃掉了，所以沒有紀錄', place: n => '第' + n + '名', out: '100名以外', rankRes: (d, a, best) => `今天 ${d}／全部 ${a}` + (best ? '（個人最佳）' : ''), sndOn: '🔊 有聲音', sndOff: '🔇 靜音', croak: '呱', postOk: (t, k) => `在「青蛙要回家」裡，花了 ${t} 回到巢穴。\n從${k}隻小龍蝦手中逃掉了。\n#青蛙要回家 #browsergame`, postDead: (t, m) => `在「青蛙要回家」裡，被小龍蝦吃了。\n離巢穴還有${m}m（${t}）\n#青蛙要回家 #browsergame`, xCopied: '已複製圖片。在 X 的發文欄貼上（Ctrl+V）就能附上圖片', xSaved: '已儲存圖片。請把儲存的圖片加到 X 的貼文裡', nogl: '這台裝置無法顯示3D畫面' },
  ko: { lang: '한국어', ttl: '개구리 귀가', h1: '개구리 <em>귀가</em>', lead: '굴로 <b>돌아가라.</b><br>울음소리가 나는 쪽으로.<br>풀이 흔들리면 <b>도망쳐라.</b>', start: '돌아간다', rank: '랭킹', hop: '폴짝', hint: '밀어서 방향 바꾸기<br>버튼을 눌러 폴짝', hintPC: '드래그나 ← → 로 방향 바꾸기<br>스페이스로 폴짝', eaten: '먹혔다', home: '다녀왔습니다', rvDead: '먹혔다', rvOk: '귀가 성공', tOk: '돌아가는 데 걸린 시간', tDead: '살아 있던 시간', msgOk: k => k ? `가재 ${k}마리에게서 도망쳤다` : '가재를 한 마리도 만나지 않았다', msgDead: m => `굴까지 ${m}m 남았다`, legend: '흰색: 지나온 길  빨강: 가재  갈색: 굴', name: '이름 (12자까지)', rec: '랭킹에 기록하기', img: '이미지로 저장', x: '𝕏 에 올리기', again: '다시 돌아간다', back: '돌아가기', today: '오늘', all: '전체', rkNote: '굴에 돌아간 사람만. 빠른 순', loading: '불러오는 중…', empty: '아직 아무도 돌아가지 못했습니다', rankErr: '랭킹을 불러오지 못했습니다', needName: '이름을 입력하세요', badName: '그 이름은 쓸 수 없습니다', sending: '기록 중…', recPre: '기록했습니다: ', sendErr: '기록하지 못했습니다. 신호가 좋은 곳에서 다시 눌러 주세요', norun: '이번 판은 통신이 되지 않아 기록할 수 없습니다', deadNote: '먹혔기 때문에 기록이 없습니다', place: n => n + '위', out: '100위 밖', rankRes: (d, a, best) => `오늘 ${d} / 전체 ${a}` + (best ? ' (자기 최고)' : ''), sndOn: '🔊 소리 켬', sndOff: '🔇 소리 끔', croak: '개굴', postOk: (t, k) => `「개구리 귀가」에서 ${t} 만에 굴로 돌아갔습니다.\n가재 ${k}마리에게서 도망쳤다.\n#개구리귀가 #browsergame`, postDead: (t, m) => `「개구리 귀가」에서 가재에게 먹혔습니다.\n굴까지 ${m}m 남았다 (${t})\n#개구리귀가 #browsergame`, xCopied: '이미지를 복사했습니다. X 글쓰기 칸에 붙여넣기(Ctrl+V)하면 이미지가 첨부됩니다', xSaved: '이미지를 저장했습니다. X 게시물에 저장한 이미지를 첨부해 주세요', nogl: '이 기기에서는 3D를 표시할 수 없습니다' }
};
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
let L = 'ja', T = TX.ja, LAST = null;
function pickLang() { const q = (/[?&]lang=([a-z]+)/.exec(location.search) || [])[1]; if (TX[q]) return q; const s = ls.get('kaeru_lang', null); if (TX[s]) return s; const n = (navigator.language || 'ja').toLowerCase(); return n.startsWith('ja') ? 'ja' : n.startsWith('zh') ? 'zh' : n.startsWith('ko') ? 'ko' : 'en'; }
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = cs => { cs = Math.max(0, Math.round(cs)); const m = Math.floor(cs / 6000), s = Math.floor(cs / 100) % 60, c = cs % 100; return m + ':' + String(s).padStart(2, '0') + '.' + String(c).padStart(2, '0'); };
function setLang(l) {
  L = TX[l] ? l : 'ja'; T = TX[L]; ls.set('kaeru_lang', L); document.documentElement.lang = L === 'zh' ? 'zh-Hant' : L; document.title = T.ttl;
  $('tH1').innerHTML = T.h1; $('tH1').style.fontSize = L === 'ja' ? '54px' : L === 'en' ? '50px' : '40px'; $('tLead').innerHTML = T.lead; $('startBtn').textContent = T.start; $('rkBtn').textContent = T.rank; $('rkBtn2').textContent = T.rank;
  $('rkT').textContent = T.rank; $('rkNote').textContent = T.rkNote; $('rkBack').textContent = T.back; $('rkWhen').children[0].textContent = T.today; $('rkWhen').children[1].textContent = T.all;
  $('nm').placeholder = T.name; $('recBtn').textContent = T.rec; $('imgBtn').textContent = T.img; $('xBtn').textContent = T.x; $('again').textContent = T.again; $('hopBtn').textContent = T.hop; $('routeL').textContent = T.legend; $('croak').lastChild.textContent = T.croak;
  $('langs').innerHTML = Object.keys(TX).map(k => `<button data-l="${k}" class="${k === L ? 'on' : ''}">${TX[k].lang}</button>`).join(''); $('langs').querySelectorAll('button').forEach(b => b.onclick = () => setLang(b.dataset.l));
  sndLabel(); if (LAST && !$('result').hidden) showResult();
}

// ---------- 決まりごと ----------
const TILE = 28, HOP = 1.25, HOPT = 0.40, REST = 0.12, DIST = 144, EYE = 0.24, CELL = 13, TRIG = 6.0, CATCH = 1.15, CSPD = 1.9, CSCALE = 1.7, GOALR = 1.7, BURR = 3.6;
const SUN = new THREE.Vector3(0.55, 0.62, 0.56).normalize();
const FOGC = new THREE.Color(0.60, 0.78, 0.62);
function hsh(a, b, c) { let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(c | 0, 1274126177); h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; }

// ---------- 3Dの世界 ----------
const canvas = $('gl');
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !IS_PHONE, powerPreference: 'high-performance' }); } catch (e) { $('load').textContent = TX[pickLang()].nogl; throw e; }
let PR = Math.min(IS_PHONE ? 1.6 : 2, window.devicePixelRatio || 1);
renderer.setPixelRatio(PR);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene(); scene.fog = new THREE.Fog(FOGC, 5.5, 13.2);
const camera = new THREE.PerspectiveCamera(72, 1, 0.04, 900);
scene.add(new THREE.HemisphereLight(0xdff2ff, 0x35521f, 1.3));
const sunL = new THREE.DirectionalLight(0xfff0cf, 2.4); sunL.position.copy(SUN).multiplyScalar(50); scene.add(sunL);
try { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.28; } catch (e) { }
function resize() { const w = window.innerWidth, h = window.innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w < h ? 78 : 62; camera.updateProjectionMatrix(); }
window.addEventListener('resize', resize); resize();

const NOISE = `
float h21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*vnoise(p); p*=2.03; a*=.5; } return s; }
`;
// 空
const sky = new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { uSun: { value: SUN }, uTime: { value: 0 }, uFog: { value: FOGC } },
  vertexShader: `varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
  fragmentShader: NOISE + `varying vec3 vD; uniform vec3 uSun; uniform float uTime; uniform vec3 uFog;
  void main(){ vec3 d = normalize(vD); float h = clamp(d.y,0.,1.);
    vec3 col = mix(uFog*1.12, vec3(0.16,0.42,0.86), pow(h,0.55));
    float sd = max(dot(d,uSun),0.);
    col += vec3(1.,.85,.55)*pow(sd,6.)*.35 + vec3(1.,.95,.8)*pow(sd,180.)*2.5 + vec3(1.)*smoothstep(.9992,.9996,sd)*6.;
    vec2 cp = d.xz/(d.y+.25)*1.4 + vec2(uTime*.006,0.);
    float c = smoothstep(.52,.78,fbm(cp))*smoothstep(.02,.3,d.y);
    col = mix(col, vec3(1.,.99,.96), c*.8);
    gl_FragColor = vec4(col,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }` }));
sky.renderOrder = -10; sky.frustumCulled = false; scene.add(sky);

// 地面
const UNI = { uCam: { value: new THREE.Vector2() }, uTime: { value: 0 }, uTile: { value: TILE }, uSun: { value: SUN }, uFog: { value: FOGC }, uBur: { value: new THREE.Vector3(1e5, 1e5, BURR) }, uRust: { value: [0, 1, 2, 3].map(() => new THREE.Vector4(1e5, 1e5, 0, 1)) }, uFlat: { value: [0, 1, 2, 3, 4].map(() => new THREE.Vector3(1e5, 1e5, 1)) } };
const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({
  uniforms: UNI, fog: false,
  vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
  fragmentShader: NOISE + `varying vec3 vW; uniform vec2 uCam; uniform vec3 uFog; uniform vec3 uBur;
  void main(){ vec2 p = vW.xz; float n = fbm(p*.9), n2 = fbm(p*4.3+7.);
    vec3 soil = mix(vec3(.050,.032,.018), vec3(.12,.080,.045), n2);
    vec3 moss = mix(vec3(.02,.07,.015), vec3(.05,.13,.03), n2);
    float db = distance(p,uBur.xy);
    float bare = 1.-smoothstep(uBur.z*.5, uBur.z*1.1, db);
    vec3 col = mix(mix(soil, moss, smoothstep(.35,.6,n)), mix(vec3(.16,.105,.06),vec3(.24,.17,.10),n2), bare);
    col *= mix(.55, 1.25, bare);
    float d = distance(p,uCam);
    col = mix(col, uFog, smoothstep(5.5,13.2,d));
    gl_FragColor = vec4(col,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }` }));
ground.frustumCulled = false; scene.add(ground);

// 草（カメラのまわりだけに生やして、進むと先回りして生えてくる）
let BLADES = IS_PHONE ? 13000 : 24000;
function makeGrass(N) {
  const g = new THREE.InstancedBufferGeometry();
  const P = [], I = [], rows = 5;
  for (let r = 0; r < rows - 1; r++) { const t = r / (rows - 1); P.push(-0.5, t, 0, 0.5, t, 0); }
  P.push(0, 1, 0);
  for (let r = 0; r < rows - 2; r++) { const a = r * 2; I.push(a, a + 1, a + 3, a, a + 3, a + 2); }
  const a = (rows - 2) * 2; I.push(a, a + 1, a + 2);
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I);
  const off = new Float32Array(N * 2), rnd = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) { off[i * 2] = Math.random() * TILE; off[i * 2 + 1] = Math.random() * TILE; rnd[i * 4] = Math.random(); rnd[i * 4 + 1] = Math.random(); rnd[i * 4 + 2] = Math.random(); rnd[i * 4 + 3] = Math.random(); }
  g.setAttribute('aOff', new THREE.InstancedBufferAttribute(off, 2)); g.setAttribute('aRnd', new THREE.InstancedBufferAttribute(rnd, 4));
  g.instanceCount = N; return g;
}
const grassMat = new THREE.ShaderMaterial({
  uniforms: UNI, side: THREE.DoubleSide, fog: false,
  vertexShader: NOISE + `
  attribute vec2 aOff; attribute vec4 aRnd;
  uniform vec2 uCam; uniform float uTime; uniform float uTile; uniform vec4 uRust[4]; uniform vec3 uFlat[5]; uniform vec3 uBur;
  varying float vT; varying float vU; varying vec3 vCol; varying float vD; varying vec3 vN; varying vec3 vW;
  void main(){
    vec2 base = mod(aOff - uCam + uTile*.5, uTile) - uTile*.5 + uCam;
    float t = position.y;
    float pn = vnoise(base*.16);
    float tall = step(.42, aRnd.x);
    float h = mix(mix(.35,1.2,aRnd.y), mix(2.3,4.4,aRnd.y)*(.7+.6*pn), tall);
    float w = mix(.045,.105,aRnd.w)*mix(.7,1.,tall);
    float dc = distance(base,uCam);
    h *= 1.-smoothstep(10.4,13.4,dc);
    float db = distance(base,uBur.xy);
    float clr = smoothstep(uBur.z*.62, uBur.z, db);
    h *= mix(.0, 1., clr); w *= mix(.3,1.,clr);
    float ang = aRnd.z*6.2831853;
    vec2 face = vec2(cos(ang),sin(ang)); vec2 side = vec2(-face.y,face.x);
    vec2 lean = face*(.12+.42*fract(aRnd.x*7.31))*h;
    float wv = sin(uTime*1.25 + base.x*.33 + base.y*.27) + .5*sin(uTime*2.3 + base.x*.9 - base.y*.4);
    lean += vec2(.85,.4)*wv*.07*h;
    float flat_ = 0.;
    for(int i=0;i<5;i++){ vec3 f = uFlat[i]; vec2 d = base-f.xy; float dd = length(d); float k = 1.-smoothstep(f.z*.35, f.z, dd); lean += (d/max(dd,.001))*k*h*.85; flat_ = max(flat_,k); }
    for(int i=0;i<4;i++){ vec4 r = uRust[i]; float k = r.z*(1.-smoothstep(r.w*.2, r.w, distance(base,r.xy))); lean += vec2(sin(uTime*26.+ang*3.), cos(uTime*23.+ang*5.))*k*.30*h; }
    h *= 1.-.72*flat_;
    float t2 = t*t;
    vec3 p; p.xz = base + side*position.x*w*(1.-pow(t,1.6)*.96) + lean*t2;
    p.y = h*t - .32*length(lean)*t2;
    vT = t; vU = position.x; vW = p; vD = dc;
    vN = normalize(vec3(face.x, .45, face.y));
    vec3 lo = vec3(.02,.085,.012);
    vec3 hi = mix(vec3(.10,.30,.035), vec3(.26,.44,.06), aRnd.w);
    hi = mix(hi, vec3(.40,.40,.10), smoothstep(.55,.9,pn)*.35*aRnd.y);
    vCol = mix(lo, hi, pow(t,.7)) * (.42+.58*t);
    gl_Position = projectionMatrix*viewMatrix*vec4(p,1.);
  }`,
  fragmentShader: `
  uniform vec3 uSun; uniform vec3 uFog;
  varying float vT; varying float vU; varying vec3 vCol; varying float vD; varying vec3 vN; varying vec3 vW;
  void main(){
    vec3 n = normalize(vN);
    float li = .55 + .55*abs(dot(n,uSun));
    vec3 vd = normalize(vW - cameraPosition);
    float back = pow(max(dot(vd,uSun),0.),2.5);
    vec3 col = vCol*li + vec3(.42,.50,.06)*back*vT*.9;
    col *= 1.-.22*(1.-smoothstep(0.,.09,abs(vU)));
    col = mix(col, uFog, smoothstep(5.5,13.2,vD));
    gl_FragColor = vec4(col,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }` });
let grass = new THREE.Mesh(makeGrass(BLADES), grassMat); grass.frustumCulled = false; scene.add(grass);

// 土ぼこり
const DN = 90, dustPos = new Float32Array(DN * 3).fill(-999), dustV = new Float32Array(DN * 4); let dustI = 0;
const dustG = new THREE.BufferGeometry(); dustG.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
const dust = new THREE.Points(dustG, new THREE.PointsMaterial({ color: 0x6b4a2c, size: 0.16, sizeAttenuation: true, transparent: true, opacity: 0.9, depthWrite: false })); dust.frustumCulled = false; scene.add(dust);
function puff(x, y, z, n, pw) { for (let i = 0; i < n; i++) { const k = dustI++ % DN, a = Math.random() * 6.283, s = (0.4 + Math.random()) * pw; dustPos[k * 3] = x; dustPos[k * 3 + 1] = y; dustPos[k * 3 + 2] = z; dustV[k * 4] = Math.cos(a) * s; dustV[k * 4 + 1] = (1.2 + Math.random() * 2.2) * pw; dustV[k * 4 + 2] = Math.sin(a) * s; dustV[k * 4 + 3] = 0.5 + Math.random() * 0.5; } }
function dustStep(dt) { for (let k = 0; k < DN; k++) { if (dustV[k * 4 + 3] <= 0) continue; dustV[k * 4 + 3] -= dt; dustV[k * 4 + 1] -= 7 * dt; dustPos[k * 3] += dustV[k * 4] * dt; dustPos[k * 3 + 1] += dustV[k * 4 + 1] * dt; dustPos[k * 3 + 2] += dustV[k * 4 + 2] * dt; if (dustV[k * 4 + 3] <= 0 || dustPos[k * 3 + 1] < 0) { dustPos[k * 3 + 1] = -999; dustV[k * 4 + 3] = 0; } } dustG.attributes.position.needsUpdate = true; }

// ---------- モデル（Blenderで作ったもの） ----------
let CRAYS = [], FRIEND = null, MOUND = null, DECOR = null;
const prims = n => n.isMesh ? [n] : n.children.filter(c => c.isMesh);
function setupModels(gl) {
  const S = gl.scene, src = S.getObjectByName('cray');
  const TW = { shell: [0.40, 0.022, 0.012], dark: [0.15, 0.01, 0.01], joint: [0.72, 0.19, 0.04], frog: [0.10, 0.38, 0.035], frogd: [0.035, 0.16, 0.02], stone: [0.20, 0.20, 0.185], mud: [0.13, 0.085, 0.05], leaf: [0.07, 0.30, 0.04], leaf2: [0.16, 0.42, 0.07] };
  S.traverse(o => { if (o.isMesh) { o.frustumCulled = false; const c = TW[o.material.name]; if (c) o.material.color.setRGB(c[0], c[1], c[2]); } });
  for (let i = 0; i < 3; i++) {
    const root = src.clone(true), n = {}; root.traverse(o => { n[o.name] = o; });
    const holder = new THREE.Group(); holder.add(root); root.scale.setScalar(CSCALE); holder.visible = false; scene.add(holder);
    CRAYS.push({ holder, root, n, st: 'off', x: 0, z: 0, ang: 0, t: 0, ph: Math.random() * 9, key: '', snap: 0, open: 0 });
  }
  FRIEND = S.getObjectByName('frog'); FRIEND.scale.setScalar(2.3); scene.add(FRIEND);
  MOUND = S.getObjectByName('mound'); MOUND.scale.setScalar(2.4); scene.add(MOUND);
  DECOR = ['clover', 'flower', 'pebble1', 'pebble2'].map((nm, i) => { const max = 90; const ms = prims(S.getObjectByName(nm)).map(m => { const im = new THREE.InstancedMesh(m.geometry, m.material, max); im.frustumCulled = false; im.count = 0; scene.add(im); return im; }); return { ms, max, sc: [3.6, 5.2, 2.6, 2.2][i] }; });
}
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _e = new THREE.Euler();
let decKey = '';
function placeDecor(px, pz) {
  const DC = 3.4, cx = Math.floor(px / DC), cz = Math.floor(pz / DC), key = cx + ',' + cz; if (key === decKey || !DECOR) return; decKey = key;
  const cnt = [0, 0, 0, 0];
  for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) {
    const a = cx + i, b = cz + j, r = hsh(a, b, 11); let ty = r < 0.42 ? -1 : r < 0.74 ? 0 : r < 0.88 ? 1 : r < 0.95 ? 2 : 3; if (ty < 0) continue;
    const x = (a + 0.15 + 0.7 * hsh(a, b, 12)) * DC, z = (b + 0.15 + 0.7 * hsh(a, b, 13)) * DC;
    if (Math.hypot(x - BUR.x, z - BUR.z) < BURR + 0.6) continue;
    const D = DECOR[ty]; if (cnt[ty] >= D.max) continue;
    _e.set(0, hsh(a, b, 14) * 6.283, 0); _q.setFromEuler(_e); _s.setScalar(D.sc * (0.75 + 0.6 * hsh(a, b, 15))); _p.set(x, 0, z); _m.compose(_p, _q, _s);
    for (const im of D.ms) im.setMatrixAt(cnt[ty], _m); cnt[ty]++;
  }
  DECOR.forEach((D, i) => D.ms.forEach(im => { im.count = cnt[i]; im.instanceMatrix.needsUpdate = true; }));
}

// ---------- ゲームの状態 ----------
let ST = 'load', SEED = 1, RUN = null;
const Pl = { x: 0, z: 0, yaw: 0, pitch: 0.1, hop: null, rest: 0, y: EYE, hops: 0 };
const BUR = { x: 1e5, z: 1e5 }, START = { x: 0, z: 0 };
let tStart = 0, tNow = 0, held = false, queued = 0, keys = {}, spent = {}, met = 0, ROUTE = [], MARKS = [], routeT = 0, nextCroak = 0, crayCheck = 0, SEQ = null, SHOT = null, shake = 0, titleYaw = 0;
const fwd = (yaw) => [Math.sin(yaw), Math.cos(yaw)];
const relAng = (tx, tz) => { let a = Math.atan2(tx - Pl.x, tz - Pl.z) - Pl.yaw; while (a > Math.PI) a -= 6.2831853; while (a < -Math.PI) a += 6.2831853; return a; };

function resetWorld(seed) {
  SEED = seed >>> 0; const r1 = hsh(SEED, 1, 2), r2 = hsh(SEED, 3, 4), r3 = hsh(SEED, 5, 6), r4 = hsh(SEED, 7, 8);
  START.x = Math.floor(r1 * 4000) - 2000; START.z = Math.floor(r2 * 4000) - 2000;
  const a = r3 * 6.2831853; BUR.x = START.x + Math.cos(a) * DIST; BUR.z = START.z + Math.sin(a) * DIST;
  Pl.x = START.x; Pl.z = START.z; Pl.yaw = r4 * 6.2831853; Pl.pitch = 0.1; Pl.hop = null; Pl.rest = 0; Pl.y = EYE; Pl.hops = 0;
  UNI.uBur.value.set(BUR.x, BUR.z, BURR);
  if (MOUND) { MOUND.position.set(BUR.x, 0, BUR.z); FRIEND.position.set(BUR.x + Math.cos(a) * 1.1, 0.22, BUR.z + Math.sin(a) * 1.1); FRIEND.rotation.y = Math.atan2(START.x - FRIEND.position.x, START.z - FRIEND.position.z); }
  CRAYS.forEach(c => { c.st = 'off'; c.holder.visible = false; });
  spent = {}; met = 0; ROUTE = [[Pl.x, Pl.z]]; MARKS = []; routeT = 0; decKey = ''; held = false; queued = 0; SEQ = null; shake = 0;
}

// ---------- ザリガニ ----------
function crayAt(cx, cz) { if (hsh(cx, cz, SEED ^ 0x5bd1) > 0.62) return null; const x = (cx + 0.2 + 0.6 * hsh(cx, cz, SEED ^ 0x1234)) * CELL, z = (cz + 0.2 + 0.6 * hsh(cx, cz, SEED ^ 0x4321)) * CELL; if (Math.hypot(x - START.x, z - START.z) < 11 || Math.hypot(x - BUR.x, z - BUR.z) < 7.5) return null; return { x, z }; }
function crayScan() {
  const cx = Math.floor(Pl.x / CELL), cz = Math.floor(Pl.z / CELL);
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
    const key = (cx + i) + ',' + (cz + j); if (spent[key] && spent[key] > tNow) continue; const p = crayAt(cx + i, cz + j); if (!p) continue;
    const d = Math.hypot(p.x - Pl.x, p.z - Pl.z); if (d > TRIG || d < 2.2) continue; if (CRAYS.some(c => c.st !== 'off' && c.key === key)) continue;
    const c = CRAYS.find(c => c.st === 'off'); if (!c) return;
    c.st = 'rustle'; c.t = 0; c.x = p.x; c.z = p.z; c.key = key; c.ang = Math.atan2(Pl.x - p.x, Pl.z - p.z); c.holder.visible = false; c.snap = 0; met++; MARKS.push([p.x, p.z]);
    sfxAt('rustle', p.x, p.z);
  }
}
function poseCray(c, o) {
  // o: {walk, raise, spread, open, tail, tilt}
  const n = c.n, w = c.ph;
  for (let i = 1; i <= 4; i++) { const a = Math.sin(w + i * 1.7) * 0.42 * o.walk, b = Math.max(0, Math.cos(w + i * 1.7)) * 0.3 * o.walk; n['legL' + i].rotation.set(0, a, -b); n['legR' + i].rotation.set(0, a, b); }
  n.armL.rotation.set(-o.raise, o.spread, 0); n.armR.rotation.set(-o.raise, -o.spread, 0);
  n.clawL.rotation.set(-o.raise * 0.35, -o.spread * 0.6, 0); n.clawR.rotation.set(-o.raise * 0.35, o.spread * 0.6, 0);
  n.pinL.rotation.set(0, -o.open, 0); n.pinR.rotation.set(0, o.open, 0);
  n.tail.rotation.set(o.tail, 0, 0); n.tail2.rotation.set(o.tail * 1.3, 0, 0);
  n.antL.rotation.set(Math.sin(w * 0.7) * 0.15, Math.sin(w * 0.9) * 0.2, 0); n.antR.rotation.set(Math.sin(w * 0.8 + 1) * 0.15, -Math.sin(w * 0.75) * 0.2, 0);
  c.root.rotation.x = -o.tilt;
}
function crayStep(dt) {
  for (const c of CRAYS) {
    if (c.st === 'off') continue; c.t += dt;
    const dx = Pl.x - c.x, dz = Pl.z - c.z, d = Math.hypot(dx, dz);
    if (c.st === 'rustle') { if (Math.random() < dt * 14) puff(c.x + (Math.random() - .5) * 1.6, 0.05, c.z + (Math.random() - .5) * 1.6, 1, 0.8); if (c.t > 1.15) { c.st = 'emerge'; c.t = 0; c.holder.visible = true; c.ang = Math.atan2(dx, dz); puff(c.x, 0.1, c.z, 26, 1.5); sfxAt('emerge', c.x, c.z); } }
    else if (c.st === 'emerge') { const k = Math.min(1, c.t / 0.42), e = 1 - (1 - k) * (1 - k); c.holder.position.set(c.x, -1.5 * (1 - e), c.z); c.holder.rotation.y = c.ang; c.ph += dt * 10; poseCray(c, { walk: 1, raise: 0.45 * e, spread: 0.15, open: 0.8 * e, tail: 0.2, tilt: 0.2 * e }); if (k >= 1) { c.st = 'chase'; c.t = 0; } }
    else if (c.st === 'chase') {
      let ta = Math.atan2(dx, dz), da = ta - c.ang; while (da > Math.PI) da -= 6.2831853; while (da < -Math.PI) da += 6.2831853; c.ang += Math.max(-3.2 * dt, Math.min(3.2 * dt, da));
      if (ST === 'play') { c.x += Math.sin(c.ang) * CSPD * dt; c.z += Math.cos(c.ang) * CSPD * dt; }
      c.ph += dt * 17; c.snap -= dt; const near = d < 4.5; let open = 0.55 + 0.35 * Math.sin(c.t * 9); if (c.snap <= 0) { c.snap = near ? 0.34 : 0.62; sfxAt('click', c.x, c.z); }
      c.holder.position.set(c.x, Math.abs(Math.sin(c.ph * 0.5)) * 0.05, c.z); c.holder.rotation.y = c.ang;
      poseCray(c, { walk: 1, raise: near ? -0.06 : 0.1, spread: 0.32 + 0.16 * Math.sin(c.t * 5), open: Math.max(0, open), tail: 0.15 + 0.1 * Math.sin(c.t * 8), tilt: near ? 0.1 : 0.05 });
      if (ST === 'play') { if (d < CATCH) { die(c); return; } if (d > 9.5 || c.t > 7.5) { c.st = 'leave'; c.t = 0; } }
    }
    else if (c.st === 'leave') { const k = Math.min(1, c.t / 0.7); c.holder.position.set(c.x, -1.6 * k * k, c.z); c.ph += dt * 6; poseCray(c, { walk: 1, raise: 0.1, spread: 0.3, open: 0.2, tail: 0.5, tilt: 0 }); if (k >= 1) { c.st = 'off'; c.holder.visible = false; spent[c.key] = tNow + 25; puff(c.x, 0.1, c.z, 8, 0.8); } }
  }
}

// ---------- 死ぬ・カエれた ----------
function die(c) {
  ST = 'dying'; SEQ = { c, t: 0, snap: false, shot: false, yaw0: Pl.yaw, pit0: Pl.pitch }; held = false; queued = 0; Pl.hop = null;
  const cs = Math.round((performance.now() - tStart) / 10), left = Math.max(0, Math.hypot(BUR.x - Pl.x, BUR.z - Pl.z) - GOALR);
  LAST = { s: 0, t: cs, k: met, left, run: null, route: ROUTE.concat([[Pl.x, Pl.z]]), marks: MARKS.slice(), bur: { ...BUR }, start: { ...START }, end: [Pl.x, Pl.z], shot: null, card: null };
  $('hopBtn').hidden = true; $('hint').hidden = true; ambient(false); sfx('scream');
  try { if (typeof gtag === 'function') gtag('event', 'game_end', { game: 'kaeru', lang: L, s: 0, t: cs, k: met }); } catch (e) { }
}
function goal() {
  ST = 'goal'; SEQ = { t: 0, shot: false }; held = false; queued = 0;
  { const dx = BUR.x - Pl.x, dz = BUR.z - Pl.z, d = Math.hypot(dx, dz) || 1; FRIEND.position.set(BUR.x + dx / d * 1.1, 0.22, BUR.z + dz / d * 1.1); FRIEND.rotation.y = Math.atan2(-dx, -dz); SEQ.fy = 0.3; }
  const cs = Math.round((performance.now() - tStart) / 10);
  LAST = { s: 1, t: cs, k: met, left: 0, run: RUN, route: ROUTE.concat([[Pl.x, Pl.z]]), marks: MARKS.slice(), bur: { ...BUR }, start: { ...START }, end: [Pl.x, Pl.z], shot: null, card: null };
  $('hopBtn').hidden = true; $('hint').hidden = true; $('timer').textContent = fmt(cs); ambient(false); sfx('fanfare');
  CRAYS.forEach(c => { if (c.st !== 'off') { c.st = 'leave'; c.t = 0; } });
  fxAdd(PFX && PFX.fx.confetti, { x: 80, y: 70, seed: 5 }); fxAdd(PFX && PFX.fx.star, { x: 80, y: 80, seed: 3 });
  const v = $('verd'); v.className = 'ok'; $('vV').textContent = T.home; v.hidden = false; gsap.fromTo('#vV', { scale: 2.4, opacity: 0, rotate: 8 }, { scale: 1, opacity: 1, rotate: -3, duration: .35, ease: 'back.out(2)' });
  try { if (typeof gtag === 'function') gtag('event', 'game_end', { game: 'kaeru', lang: L, s: 1, t: cs, k: met }); } catch (e) { }
}
function seqStep(dt) {
  const q = SEQ; q.t += dt;
  if (ST === 'dying') {
    const c = q.c, ta = Math.atan2(c.x - Pl.x, c.z - Pl.z); let da = ta - Pl.yaw; while (da > Math.PI) da -= 6.2831853; while (da < -Math.PI) da += 6.2831853;
    Pl.yaw += da * Math.min(1, dt * 12); Pl.pitch += (0.06 - Pl.pitch) * Math.min(1, dt * 10); Pl.y += (EYE - Pl.y) * Math.min(1, dt * 10);
    const k = Math.min(1, q.t / 0.5); if (q.d0 == null) q.d0 = Math.hypot(c.x - Pl.x, c.z - Pl.z); const e2 = 1 - (1 - Math.min(1, q.t / 0.35)) ** 2, nd = q.d0 + (2.45 - q.d0) * e2;
    c.x = Pl.x + Math.sin(ta) * nd; c.z = Pl.z + Math.cos(ta) * nd; c.ang = ta + Math.PI; c.ph += dt * 20;
    c.holder.position.set(c.x, 0.05 + 0.12 * k, c.z); c.holder.rotation.y = c.ang;
    const cl = q.t < 0.62 ? 0 : Math.min(1, (q.t - 0.62) / 0.07);
    poseCray(c, { walk: 0.6, raise: 0.10 + 0.08 * k, spread: -0.05 * (1 - cl) + 0.95 * cl, open: 1.0 * (1 - cl), tail: 0.5, tilt: 0.12 * k });
    $('danger').style.opacity = Math.min(1, q.t * 3);
    if (!q.shot && q.t > 0.5) { q.shot = true; SHOT = d => { LAST.shot = d; }; }
    if (!q.snap && q.t > 0.68) { q.snap = true; sfx('snap'); shake = 0.5; gsap.fromTo('#flash', { opacity: .9 }, { opacity: 0, duration: .25 }); gsap.to('#iris', { opacity: 1, duration: .28, delay: .1 }); const v = $('verd'); v.className = ''; $('vV').textContent = T.eaten; v.hidden = false; gsap.fromTo('#vV', { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: .22, delay: .3, ease: 'power3.in' }); try { navigator.vibrate && navigator.vibrate([60, 40, 160]); } catch (e) { } }
    if (q.t > 2.1) { showResult(true); }
  } else if (ST === 'goal') {
    const ta = Math.atan2(FRIEND.position.x - Pl.x, FRIEND.position.z - Pl.z); let da = ta - Pl.yaw; while (da > Math.PI) da -= 6.2831853; while (da < -Math.PI) da += 6.2831853;
    Pl.yaw += da * Math.min(1, dt * 4); Pl.pitch += (0.1 - Pl.pitch) * Math.min(1, dt * 4); Pl.y += (EYE + 0.2 - Pl.y) * Math.min(1, dt * 6);
    FRIEND.position.y = 0.22 + Math.abs(Math.sin(q.t * 7)) * 0.35 * Math.max(0, 1 - q.t / 1.6);
    if (!q.shot && q.t > 0.7) { q.shot = true; SHOT = d => { LAST.shot = d; }; }
    if (q.t > 2.2) { showResult(true); }
  }
}

// ---------- 毎フレーム ----------
let lastF = 0, fAcc = 0, fN = 0, tuned = false;
const camDir = new THREE.Vector3();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - lastF) / 1000 || 0.016); lastF = now; tNow += dt;
  if (ST === 'play') {
    const tr = (keys.ArrowLeft || keys.a ? 1 : 0) - (keys.ArrowRight || keys.d ? 1 : 0); Pl.yaw += tr * 2.0 * dt;
    if (Pl.hop) {
      const h = Pl.hop; h.t += dt; const k = Math.min(1, h.t / HOPT), st = (k - h.k) * HOP; h.k = k; Pl.x += h.dx * st; Pl.z += h.dz * st; Pl.y = EYE + 0.5 * Math.sin(Math.PI * k);
      if (k >= 1) { Pl.hop = null; Pl.rest = REST; Pl.y = EYE; sfx('land'); puff(Pl.x, 0.05, Pl.z, 3, 0.5); }
    } else {
      if (Pl.rest > 0) { Pl.rest -= dt; Pl.y = EYE - 0.05 * Math.sin(Math.PI * Math.max(0, Pl.rest) / REST); }
      if (Pl.rest <= 0 && (held || keys[' '] || keys.w || keys.ArrowUp || queued > 0)) { if (queued > 0) queued--; const f = fwd(Pl.yaw); Pl.hop = { t: 0, k: 0, dx: f[0], dz: f[1] }; Pl.hops++; sfx('hop'); if (Pl.hops === 3) gsap.to('#hint', { opacity: 0, duration: .6, onComplete: () => { $('hint').hidden = true; $('hint').style.opacity = 1; } }); }
    }
    routeT -= dt; if (routeT <= 0) { routeT = 0.5; if (ROUTE.length < 4000) ROUTE.push([Math.round(Pl.x * 10) / 10, Math.round(Pl.z * 10) / 10]); }
    crayCheck -= dt; if (crayCheck <= 0) { crayCheck = 0.15; crayScan(); }
    $('timer').textContent = fmt((performance.now() - tStart) / 10);
    if (Math.hypot(BUR.x - Pl.x, BUR.z - Pl.z) < GOALR) goal();
    if (tNow >= nextCroak) { nextCroak = tNow + 3.6; croak(); }
    let dng = 0; for (const c of CRAYS) if (c.st === 'chase') dng = Math.max(dng, 1 - Math.hypot(c.x - Pl.x, c.z - Pl.z) / 6); $('danger').style.opacity = Math.max(0, dng) * 0.8;
  } else if (ST === 'title' || ST === 'result') { titleYaw += dt * 0.12; }
  if (ST === 'play' || ST === 'dying' || ST === 'goal') crayStep(dt);
  if (SEQ && (ST === 'dying' || ST === 'goal')) seqStep(dt);
  // カメラ
  const yaw = ST === 'title' ? titleYaw : Pl.yaw, pitch = ST === 'title' ? 0.16 + 0.05 * Math.sin(tNow * 0.4) : Pl.pitch + (Pl.hop ? -0.05 * Math.sin(Math.PI * 2 * Pl.hop.k) : 0);
  shake = Math.max(0, shake - dt * 1.6);
  camera.position.set(Pl.x + (Math.random() - .5) * shake * .3, Pl.y + (Math.random() - .5) * shake * .3, Pl.z);
  camDir.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)); camera.lookAt(camera.position.x + camDir.x, camera.position.y + camDir.y, camera.position.z + camDir.z);
  UNI.uCam.value.set(Pl.x, Pl.z); UNI.uTime.value = tNow; sky.material.uniforms.uTime.value = tNow; sky.position.copy(camera.position); ground.position.set(Pl.x, 0, Pl.z);
  let ri = 0, fi = 0; const R = UNI.uRust.value, F = UNI.uFlat.value;
  for (const c of CRAYS) { if (c.st === 'off') continue; if (ri < 4) { R[ri++].set(c.x, c.z, c.st === 'rustle' ? 1 : c.st === 'emerge' ? 0.8 : 0.45, c.st === 'rustle' ? 3.2 : 2.6); } if (c.st !== 'rustle' && fi < 4) F[fi++].set(c.x, c.z, 1.9); }
  for (; ri < 4; ri++) R[ri].set(1e5, 1e5, 0, 1); for (; fi < 4; fi++) F[fi].set(1e5, 1e5, 1); F[4].set(Pl.x, Pl.z, 1.5);
  placeDecor(Pl.x, Pl.z); dustStep(dt);
  if (FRIEND && ST !== 'goal') { const s = 2.3 * (1 + 0.06 * Math.max(0, Math.sin((tNow - (nextCroak - 3.6)) * 20)) * (tNow - (nextCroak - 3.6) < 0.6 ? 1 : 0)); FRIEND.scale.setScalar(s); }
  renderer.render(scene, camera);
  if (SHOT) { const cb = SHOT; SHOT = null; try { cb(canvas.toDataURL('image/jpeg', 0.86)); } catch (e) { cb(null); } }
  // 重い端末では草を減らす
  if (ST === 'play' && !tuned) { fAcc += dt; fN++; if (fAcc > 3) { tuned = true; const ms = fAcc / fN * 1000; if (ms > 30) { BLADES = Math.floor(BLADES * 0.55); grass.geometry.instanceCount = BLADES; PR = Math.min(PR, 1); renderer.setPixelRatio(PR); resize(); } else if (ms > 22) { BLADES = Math.floor(BLADES * 0.75); grass.geometry.instanceCount = BLADES; } } }
}

// ---------- 操作 ----------
let drag = null;
canvas.addEventListener('pointerdown', e => { if (ST !== 'play') return; drag = { id: e.pointerId, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t: performance.now(), moved: 0 }; try { canvas.setPointerCapture(e.pointerId); } catch (_) { } });
canvas.addEventListener('pointermove', e => { if (!drag || e.pointerId !== drag.id || ST !== 'play') return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy); const k = 0.0062 * (IS_PHONE ? 1 : 0.8); Pl.yaw -= dx * k; Pl.pitch = Math.max(-0.1, Math.min(0.55, Pl.pitch - dy * 0.003)); });
const dragEnd = e => { if (!drag || e.pointerId !== drag.id) return; if (drag.moved < 10 && performance.now() - drag.t < 280 && ST === 'play') queued = Math.min(2, queued + 1); drag = null; };
canvas.addEventListener('pointerup', dragEnd); canvas.addEventListener('pointercancel', dragEnd);
const hb = $('hopBtn');
hb.addEventListener('pointerdown', e => { e.preventDefault(); held = true; hb.classList.add('on'); try { hb.setPointerCapture(e.pointerId); } catch (_) { } });
const hbUp = () => { held = false; hb.classList.remove('on'); }; hb.addEventListener('pointerup', hbUp); hb.addEventListener('pointercancel', hbUp); hb.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('keydown', e => { if (e.target && e.target.tagName === 'INPUT') return; keys[e.key.length === 1 ? e.key.toLowerCase() : e.key] = true; if (ST === 'play' && (e.key === ' ' || e.key.startsWith('Arrow'))) e.preventDefault(); });
window.addEventListener('keyup', e => { keys[e.key.length === 1 ? e.key.toLowerCase() : e.key] = false; });
window.addEventListener('blur', () => { keys = {}; held = false; hb.classList.remove('on'); });

// ---------- ドット絵の演出（道具箱の pixelfx） ----------
const fxc = $('fxc'), fctx = fxc.getContext('2d'); let FXS = [], fxRaf = 0, fxFrame = null, fxImg = null, fxLast = 0;
function fxAdd(mod, o) { try { if (!PFX || !mod) return; if (!fxFrame) { fxFrame = PFX.createFrame(160, 160); fxImg = new ImageData(160, 160); } const f = PFX.createFx(mod, o); f._life = mod === PFX.fx.confetti ? 3.2 : 1.3; FXS.push(f); if (!fxRaf) { fxLast = performance.now(); fxRaf = requestAnimationFrame(fxLoop); } } catch (e) { } }
function fxLoop(now) { const dt = Math.min(.05, (now - fxLast) / 1000); fxLast = now; try { PFX.clearFrame(fxFrame); FXS = FXS.filter(f => { f.update(dt); f.draw(fxFrame, 'back'); f.draw(fxFrame, 'front'); f._life -= dt; return !f.done() && f._life > 0; }); PFX.composite(fxFrame, fxImg.data, null); fctx.putImageData(fxImg, 0, 0); } catch (e) { FXS = []; } if (FXS.length) fxRaf = requestAnimationFrame(fxLoop); else { fxRaf = 0; fctx.clearRect(0, 0, 160, 160); } }

// ---------- 音 ----------
let AC = null, MG = null, MUTE = !!ls.get('kaeru_mute', 0), AMB = null;
function audioInit() { if (AC) { if (AC.state === 'suspended') AC.resume(); return; } try { AC = new (window.AudioContext || window.webkitAudioContext)(); MG = AC.createGain(); MG.gain.value = MUTE ? 0 : 1; MG.connect(AC.destination); } catch (e) { AC = null; } }
function out(pan, lp) { let n = MG; if (pan != null && AC.createStereoPanner) { const p = AC.createStereoPanner(); p.pan.value = Math.max(-1, Math.min(1, pan)); p.connect(n); n = p; } if (lp) { const f = AC.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; f.connect(n); n = f; } return n; }
function tone(f, d, type = 'sine', v = .2, when = 0, f2, dst) { if (!AC) return; const t = AC.currentTime + when, o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(dst || MG); o.start(t); o.stop(t + d + .02); }
function noise(d, v = .2, when = 0, hp = 800, dst, flat) { if (!AC) return; const t = AC.currentTime + when, n = Math.floor(AC.sampleRate * d), b = AC.createBuffer(1, n, AC.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = (Math.random() * 2 - 1) * (flat ? (0.4 + 0.6 * Math.abs(Math.sin(i / n * 40))) * Math.sin(Math.PI * i / n) : (1 - i / n)); const s = AC.createBufferSource(); s.buffer = b; const f = AC.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; const g = AC.createGain(); g.gain.value = v; s.connect(f); f.connect(g); g.connect(dst || MG); s.start(t); }
function sfx(n) { if (!AC) return; const S = { hop: () => { tone(240, .13, 'sine', .10, 0, 520); noise(.12, .05, 0, 2500); }, land: () => { tone(110, .1, 'sine', .16, 0, 60); noise(.07, .07, 0, 1500); }, snap: () => { noise(.14, .6, 0, 1200); tone(240, .16, 'square', .3, 0, 60); tone(70, .4, 'sine', .4, .02, 35); }, scream: () => { tone(900, .25, 'sawtooth', .08, 0, 300); }, fanfare: () => { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, .22, 'triangle', .16, i * .12)); }, tap: () => tone(660, .07, 'triangle', .16) }; if (S[n]) S[n](); }
function sfxAt(n, x, z) { if (!AC) return; const a = relAng(x, z), d = Math.hypot(x - Pl.x, z - Pl.z), g = Math.max(0.15, 1 - d / 12), dst = out(-Math.sin(a), Math.cos(a) < -0.2 ? 1800 : 0);
  if (n === 'rustle') { noise(1.15, .34 * g, 0, 2200, dst, true); noise(.5, .2 * g, .3, 3800, dst, true); }
  else if (n === 'emerge') { noise(.3, .5 * g, 0, 500, dst); tone(90, .3, 'sine', .3 * g, 0, 45, dst); }
  else if (n === 'click') { tone(1900, .03, 'square', .09 * g, 0, 0, dst); tone(1500, .03, 'square', .07 * g, .06, 0, dst); } }
function croak() {
  const a = relAng(BUR.x, BUR.z), d = Math.hypot(BUR.x - Pl.x, BUR.z - Pl.z), g = 0.10 + 0.5 / (1 + d / 28), back = Math.cos(a) < -0.15;
  if (AC) { const dst = out(-Math.sin(a) * 0.95, back ? 900 : 0); for (let i = 0; i < 2; i++) { const t0 = i * 0.24; for (let j = 0; j < 5; j++) tone(430 + i * 40 + j * 6, .034, 'sawtooth', g * (back ? .8 : 1), t0 + j * 0.032, 0, dst); tone(1250 + i * 80, .14, 'triangle', g * .25, t0, 900, dst); } }
  // 音を出せない人のために、聞こえた方向をおおまかに（8方向）画面のはしに出す
  const q = Math.round(a / (Math.PI / 4)) * (Math.PI / 4), el = $('croak'); el.style.left = (50 - Math.sin(q) * 40) + '%'; el.style.top = (48 - Math.cos(q) * 34) + '%'; const sc = 0.55 + 0.9 / (1 + d / 30);
  gsap.killTweensOf(el); gsap.fromTo(el, { opacity: 0, scale: sc * 0.5 }, { opacity: 0.95, scale: sc, duration: .14, yoyo: true, repeat: 3, repeatDelay: .02, onComplete: () => gsap.to(el, { opacity: 0, duration: .25 }) });
}
function ambient(on) { if (AMB) { try { AMB.s.stop(); } catch (e) { } clearInterval(AMB.iv); AMB = null; } if (!on || !AC) return; const n = AC.sampleRate * 3, b = AC.createBuffer(1, n, AC.sampleRate), a = b.getChannelData(0); let v = 0; for (let i = 0; i < n; i++) { v = v * 0.985 + (Math.random() * 2 - 1) * 0.015; a[i] = v * 6 * (0.7 + 0.3 * Math.sin(i / n * 6.283)); } const s = AC.createBufferSource(); s.buffer = b; s.loop = true; const g = AC.createGain(); g.gain.value = 0.11; s.connect(g); g.connect(MG); s.start(); const iv = setInterval(() => { if (Math.random() < 0.5) { const f = 3400 + Math.random() * 1400; for (let i = 0; i < 4; i++) tone(f, .05, 'sine', .012, i * .09); } }, 2300); AMB = { s, iv }; }
function sndLabel() { $('sndBtn').textContent = MUTE ? T.sndOff : T.sndOn; }
$('sndBtn').onclick = () => { MUTE = !MUTE; ls.set('kaeru_mute', MUTE ? 1 : 0); audioInit(); if (MG) MG.gain.value = MUTE ? 0 : 1; sndLabel(); };

// ---------- 始める・結果 ----------
async function start(btn) {
  if (btn.classList.contains('busy')) return; btn.classList.add('busy'); audioInit(); sfx('tap'); LAST = null;
  let st = null; try { st = await Promise.race([netStart(), new Promise(r => setTimeout(() => r(null), 3500))]); } catch (e) { st = null; }
  if (st == null) RUN = null; btn.classList.remove('busy');
  resetWorld(st != null ? Math.floor(st) % 2147483647 : Math.floor(Math.random() * 2147483647));
  ST = 'play'; tStart = performance.now(); nextCroak = tNow + 1.2; tuned = false; fAcc = 0; fN = 0;
  $('title').hidden = true; $('result').hidden = true; $('rank').hidden = true; $('verd').hidden = true; $('timer').hidden = false; $('timer').textContent = fmt(0); hb.hidden = false; $('hint').hidden = false; $('hint').style.opacity = 1; $('hint').innerHTML = IS_PHONE ? T.hint : T.hintPC;
  gsap.set(['#iris', '#flash', '#danger'], { opacity: 0 });
  try { if (typeof gtag === 'function') gtag('event', 'game_start', { game: 'kaeru' }); } catch (e) { }
  ambient(true);
}
$('startBtn').addEventListener('click', () => start($('startBtn')));
$('again').addEventListener('click', () => start($('again')));
let POST = '';
const SHARE_URL = 'https://nasubi-no-oniwa.com/kaeru/';
function drawRoute(x, W, R, pad = 40) {
  const pts = R.route, all = pts.concat([[R.bur.x, R.bur.z], [R.start.x, R.start.z]], R.marks); let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9; for (const p of all) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); z0 = Math.min(z0, p[1]); z1 = Math.max(z1, p[1]); }
  const sc = (W - pad * 2) / Math.max(x1 - x0, z1 - z0, 20), ox = (W - (x1 - x0) * sc) / 2, oz = (W - (z1 - z0) * sc) / 2, X = p => ox + (p[0] - x0) * sc, Y = p => oz + (p[1] - z0) * sc;
  const g = x.createLinearGradient(0, 0, W, W); g.addColorStop(0, '#234a1a'); g.addColorStop(1, '#142e12'); x.fillStyle = g; x.fillRect(0, 0, W, W);
  x.strokeStyle = '#2f5f22'; x.lineWidth = Math.max(1.5, W / 300); for (let i = 0; i < 260; i++) { const a = hsh(i, 1, 9) * W, b = hsh(i, 2, 9) * W, h = W * (0.012 + 0.02 * hsh(i, 3, 9)); x.beginPath(); x.moveTo(a, b); x.lineTo(a + h * 0.3, b - h); x.stroke(); }
  x.lineJoin = 'round'; x.lineCap = 'round';
  x.setLineDash([W / 60, W / 45]); x.strokeStyle = '#ffffff30'; x.lineWidth = W / 220; x.beginPath(); x.moveTo(X([R.start.x, R.start.z]), Y([R.start.x, R.start.z])); x.lineTo(X([R.bur.x, R.bur.z]), Y([R.bur.x, R.bur.z])); x.stroke(); x.setLineDash([]);
  x.strokeStyle = '#0b1c0a'; x.lineWidth = W / 60; x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(X(p), Y(p)) : x.moveTo(X(p), Y(p))); x.stroke();
  x.strokeStyle = '#f3f6e4'; x.lineWidth = W / 110; x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(X(p), Y(p)) : x.moveTo(X(p), Y(p))); x.stroke();
  for (const m of R.marks) { const a = X(m), b = Y(m), r = W / 52; x.fillStyle = '#e03a22'; x.strokeStyle = '#0b1c0a'; x.lineWidth = W / 260; x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); x.stroke(); x.beginPath(); x.arc(a - r, b - r * 1.1, r * 0.6, 0, 7); x.fill(); x.stroke(); x.beginPath(); x.arc(a + r, b - r * 1.1, r * 0.6, 0, 7); x.fill(); x.stroke(); }
  { const a = X([R.bur.x, R.bur.z]), b = Y([R.bur.x, R.bur.z]), r = W / 30; x.fillStyle = '#8a5a30'; x.strokeStyle = '#0b1c0a'; x.lineWidth = W / 200; x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); x.stroke(); x.fillStyle = '#160d06'; x.beginPath(); x.arc(a, b, r * 0.55, 0, 7); x.fill(); }
  { const a = X([R.start.x, R.start.z]), b = Y([R.start.x, R.start.z]), r = W / 46; x.fillStyle = '#58c63c'; x.strokeStyle = '#0b1c0a'; x.lineWidth = W / 200; x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); x.stroke(); }
  if (!R.s) { const a = X(R.end), b = Y(R.end), r = W / 36; x.strokeStyle = '#0b1c0a'; x.lineWidth = W / 50; x.beginPath(); x.moveTo(a - r, b - r); x.lineTo(a + r, b + r); x.moveTo(a + r, b - r); x.lineTo(a - r, b + r); x.stroke(); x.strokeStyle = '#ff5a3c'; x.lineWidth = W / 90; x.stroke(); }
}
function showResult(first) {
  const R = LAST; if (!R) return; const ts = fmt(R.t), m = (R.left / 10).toFixed(1);
  $('rV').textContent = R.s ? T.rvOk : T.rvDead; $('rV').className = 'rv' + (R.s ? ' ok' : ''); $('rT').textContent = ts; $('rL').textContent = R.s ? T.tOk : T.tDead; $('rMsg').textContent = R.s ? T.msgOk(R.k) : T.msgDead(m);
  drawRoute($('route').getContext('2d'), 600, R);
  POST = (R.s ? T.postOk(ts, R.k) : T.postDead(ts, m)) + '\n' + SHARE_URL; R.card = makeCard(R).catch(() => null);
  $('recBox').hidden = !R.s;
  if (first) { ST = 'result'; SEQ = null; $('timer').hidden = true; $('verd').hidden = true; hb.hidden = true; $('result').hidden = false; $('result').scrollTop = 0; gsap.to(['#iris', '#danger'], { opacity: 0, duration: .5 }); CRAYS.forEach(c => { c.st = 'off'; c.holder.visible = false; }); titleYaw = Pl.yaw; Pl.pitch = 0.1; Pl.y = EYE;
    $('recBtn').disabled = !R.run; $('recNote').textContent = R.s ? (R.run ? '' : T.norun) : ''; $('recNote').className = 'note';
    gsap.fromTo('#result .card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .35, ease: 'power2.out', clearProps: 'transform' }); gsap.fromTo('#rV', { scale: 2.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .28, delay: .3, ease: 'power3.in' }); }
}
async function makeCard(R) {
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const F = (px, wt = 900) => `${wt} ${px}px "Hiragino Maru Gothic ProN","Hiragino Sans","Noto Sans JP","Noto Sans CJK JP","Yu Gothic UI",sans-serif`;
  x.fillStyle = '#f3f6e4'; x.fillRect(0, 0, W, H);
  const PH = 660; x.fillStyle = '#1d3a17'; x.fillRect(0, 0, W, PH);
  if (R.shot) { const im = new Image(); const ok = await new Promise(r => { im.onload = () => r(true); im.onerror = () => r(false); im.src = R.shot; }); if (ok) { const s = Math.max(W / im.width, PH / im.height), w = im.width * s, h = im.height * s; x.save(); x.beginPath(); x.rect(0, 0, W, PH); x.clip(); x.drawImage(im, (W - w) / 2, (PH - h) * .5, w, h); x.restore(); } }
  x.fillStyle = '#10240f'; x.fillRect(0, PH, W, 10);
  x.save(); x.translate(210, 120); x.rotate(-.05); const lab = R.s ? T.rvOk : T.rvDead; x.font = F(88); const lw = Math.min(520, x.measureText(lab).width + 70); x.fillStyle = '#10240f'; x.fillRect(-lw / 2 + 8, -62, lw, 136); x.fillStyle = R.s ? '#2f8f2a' : '#c8321e'; x.fillRect(-lw / 2, -70, lw, 136); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(lab, 0, 2, lw - 40); x.restore();
  const MS = 560, mx = 44, my = PH + 54; const mc = document.createElement('canvas'); mc.width = mc.height = MS; drawRoute(mc.getContext('2d'), MS, R, 44); x.save(); x.beginPath(); x.roundRect(mx, my, MS, MS, 28); x.clip(); x.drawImage(mc, mx, my); x.restore(); x.lineWidth = 6; x.strokeStyle = '#10240f'; x.beginPath(); x.roundRect(mx, my, MS, MS, 28); x.stroke();
  const tx = mx + MS + 36, tw = W - tx - 40; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
  x.fillStyle = '#5f7257'; x.font = F(30, 700); x.fillText(R.s ? T.tOk : T.tDead, tx, my + 44, tw);
  x.fillStyle = '#16511a'; x.font = '900 104px ui-monospace,Menlo,Consolas,monospace'; x.fillText(fmt(R.t), tx - 4, my + 150, tw);
  const wrap = (t, mw, f) => { x.font = f; const o = []; let cur = ''; const tok = /[^\x00-\xff]/.test(t) ? [...t] : t.split(' ').map((w, i, a) => i < a.length - 1 ? w + ' ' : w); for (const ch of tok) { if (x.measureText(cur + ch).width > mw && cur) { o.push(cur); cur = ch; } else cur += ch; } if (cur) o.push(cur); return o; };
  x.fillStyle = '#28402a'; const ls2 = wrap(R.s ? T.msgOk(R.k) : T.msgDead((R.left / 10).toFixed(1)), tw, F(40)); ls2.slice(0, 4).forEach((l, i) => x.fillText(l, tx, my + 236 + i * 56));
  x.fillStyle = '#16511a'; x.font = F(62); x.fillText(T.ttl, tx, my + MS - 56, tw); x.fillStyle = '#5f7257'; x.font = '700 26px ui-monospace,Menlo,monospace'; x.fillText('nasubi-no-oniwa.com/kaeru', tx, my + MS - 14, tw);
  x.fillStyle = '#5f7257'; x.font = F(24, 700); x.fillText(T.legend, mx, my + MS + 40, W - 80);
  return await new Promise(r => c.toBlob(b => r(b), 'image/png'));
}
// ---------- Xに投稿（自分の紹介ツイートを引用する。引用するツイートは一覧ページ quote/ で切りかえ） ----------
let QUOTE = {};
fetch('https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/xquote/g/kaeru.json').then(r => r.json()).then(d => { if (d && typeof d === 'object') QUOTE = d; }).catch(() => { });
function quoteURL() { const u = (L === 'ja' ? QUOTE.ja : QUOTE.en) || ''; return /^https:\/\/x\.com\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}$/.test(u) ? u : ''; }
const cardFile = b => new File([b], 'kaeru.png', { type: 'image/png' });
function saveBlob(b, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name || 'kaeru.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); }
let toastT = 0; function toast(m) { const t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 7000); }
$('xBtn').addEventListener('click', async () => {
  const R = LAST; if (!R) return; const q = quoteURL(); let b = null; try { b = await R.card; } catch (e) { }
  if (b && IS_PHONE && navigator.canShare) { const f = cardFile(b); try { if (navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: POST + (q ? '\n' + q : '') }); try { if (typeof gtag === 'function') gtag('event', 'x_share', { game: 'kaeru', via: 'sheet' }); } catch (e) { } return; } } catch (e) { if (e && e.name === 'AbortError') return; } }
  let how = 0; if (b) { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]); how = 1; } catch (e) { if (!IS_PHONE) { try { saveBlob(b); how = 2; } catch (_) { } } } }
  if (how) toast(how === 1 ? T.xCopied : T.xSaved);
  const u = 'https://x.com/intent/post?text=' + encodeURIComponent(POST) + (q ? '&url=' + encodeURIComponent(q) : ''); const w = window.open(u, '_blank'); if (!w) location.href = u;
});
$('imgBtn').addEventListener('click', async () => {
  const R = LAST; if (!R) return; let b = null; try { b = await R.card; } catch (e) { } if (!b) return; const f = cardFile(b);
  try { if (IS_PHONE && navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  saveBlob(b);
});

// ---------- ランキング（otokonoji の kaeru） ----------
const FB = { key: 'AIzaSyAcJgJLVbuvx85_qEGJe1WhwsOelidxeYk', db: 'https://otokonoji-default-rtdb.asia-southeast1.firebasedatabase.app' };
const NG_WORDS = ['ちんこ', 'ちんぽ', 'まんこ', 'せっくす', 'セックス', 'きんたま', 'レイプ', '死ね', 'しね', '殺す', 'ころす', 'ガイジ', 'キチガイ', 'きちがい', 'ニガー', 'チョン', '支那', 'fuck', 'shit', 'bitch', 'cunt', 'dick', 'pussy', 'nigger', 'nigga', 'faggot', 'retard', 'whore', 'slut', 'rape', 'porn', 'nazi', 'hitler'];
const badName = s => { const n = s.normalize('NFKC').toLowerCase().replace(/[\s・._\-ー〜~!！?？*＊]/g, ''); return NG_WORDS.some(w => n.includes(w.normalize('NFKC').toLowerCase())); };
async function fx(url, opt) { let err; for (let i = 0; i < 3; i++) { try { return await fetch(url, opt); } catch (e) { err = e; await new Promise(r => setTimeout(r, 500 * (i + 1))); } } throw err; }
let AUTH = null;
async function auth() {
  let a = AUTH || ls.get('kaeru_auth', null); if (a && a.exp > Date.now() + 60000) return AUTH = a;
  if (a && a.refresh) { try { const r = await fx('https://securetoken.googleapis.com/v1/token?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(a.refresh) }); if (r.ok) { const j = await r.json(); a = { uid: j.user_id, token: j.id_token, refresh: j.refresh_token, exp: Date.now() + (+j.expires_in) * 1000 }; ls.set('kaeru_auth', a); return AUTH = a; } } catch (_) { } }
  const r = await fx('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
  if (!r.ok) throw new Error('auth'); const j = await r.json(); a = { uid: j.localId, token: j.idToken, refresh: j.refreshToken, exp: Date.now() + (+j.expiresIn) * 1000 }; ls.set('kaeru_auth', a); return AUTH = a;
}
const DB = p => FB.db + '/kaeru/' + p + '.json';
const QA = a => '?auth=' + encodeURIComponent(a.token);
const PUT = (url, body) => fx(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const TSV = { '.sv': 'timestamp' };
const dayKey = ms => Math.floor((ms + 32400000) / 86400000);
async function netStart() { RUN = null; const a = await auth(); const r = await PUT(DB('run/' + a.uid) + QA(a), { st: TSV }); if (!r.ok) throw new Error('run'); const j = await r.json(); RUN = { st: j.st }; return j.st; }
async function submit(nm) {
  const R = LAST; if (!R || !R.run || !R.s) throw new Error('norun');
  const a = await auth(), sk = R.t;
  const rec = { n: nm, t: R.t, k: Math.min(999, R.k), sk, st: R.run.st, v: 1, at: TSV };
  const dk = dayKey(Date.now()), recD = { ...rec, dk, ds: dk * 100000000 + sk };
  const get = p => fx(DB(p)).then(x => x.ok ? x.json() : null).catch(() => null);
  const [old, oldD] = await Promise.all([get('b/all/' + a.uid), get('b/d/' + a.uid)]);
  const okA = !old || sk < old.sk, okD = !oldD || oldD.dk !== dk || sk < oldD.sk;
  if (okD) { const r = await PUT(DB('b/d/' + a.uid) + QA(a), recD); if (!r.ok) throw new Error('d'); }
  if (okA) { const r = await PUT(DB('b/all/' + a.uid) + QA(a), rec); if (!r.ok) throw new Error('all'); }
  const [rd, ra] = await Promise.all([board('d'), board('all')]);
  const f = B => { const x = B.find(r => r.id === a.uid); return x ? T.place(x.rk) : T.out; };
  return T.rankRes(f(rd), f(ra), okA);
}
// 記録がありえるか：まっすぐ帰っても1分かかる距離なので、それより速い記録は出さない
const realRec = x => typeof x.t === 'number' && x.t % 1 === 0 && x.t >= 5800 && x.t <= 99999999 && x.sk === x.t;
async function board(when) {
  const dk = dayKey(Date.now()), base = dk * 100000000;
  const q = when === 'd' ? `?orderBy="ds"&startAt=${base}&endAt=${base + 99999999}&limitToFirst=100` : '?orderBy="sk"&limitToFirst=100';
  const r = await fx(DB('b/' + when) + q); if (!r.ok) throw new Error('board');
  const rows = Object.entries(await r.json() || {}).map(([id, v]) => ({ id, ...v })).filter(realRec).sort((a, b) => a.sk - b.sk || a.at - b.at);
  let rk = 0, prev = null; rows.forEach((x, i) => { if (x.sk !== prev) { rk = i + 1; prev = x.sk; } x.rk = rk; });
  return rows;
}
let RKS = { when: 'd', from: 'title' };
async function openRank(when, from) {
  const my = RKS = { when, from: from || RKS.from };
  $('title').hidden = true; $('result').hidden = true; $('rank').hidden = false;
  $('rkWhen').querySelectorAll('button').forEach(b => { b.className = b.dataset.w === when ? 'on' : ''; b.onclick = () => openRank(b.dataset.w); });
  const box = $('rankBox'); box.innerHTML = '<p class="note">' + T.loading + '</p>';
  try {
    const B = await board(when); if (RKS !== my) return;
    const me = (ls.get('kaeru_auth', null) || {}).uid;
    box.innerHTML = B.length ? '<table class="rk">' + B.map(r => `<tr${r.id === me ? ' class="me"' : ''}><td class="r">${r.rk}</td><td class="n">${esc(String(r.n))}</td><td class="c">${fmt(r.t)}</td></tr>`).join('') + '</table>' : '<p class="note">' + T.empty + '</p>';
  } catch (e) { if (RKS === my) box.innerHTML = '<p class="note err">' + T.rankErr + '</p>'; }
}
$('rkBtn').onclick = () => openRank('d', 'title');
$('rkBtn2').onclick = () => openRank('d', 'result');
$('rkBack').onclick = () => { $('rank').hidden = true; if (RKS.from === 'result' && LAST) $('result').hidden = false; else $('title').hidden = false; };
$('nm').value = ls.get('kaeru_name', '');
$('recBtn').onclick = async () => {
  const nm = $('nm').value.trim(), note = $('recNote'); note.className = 'note';
  if (!nm) { note.textContent = T.needName; note.className = 'note err'; return; }
  if (badName(nm)) { note.textContent = T.badName; note.className = 'note err'; return; }
  ls.set('kaeru_name', nm); $('recBtn').disabled = true; note.textContent = T.sending;
  try { note.textContent = T.recPre + await submit(nm); note.className = 'note ok'; }
  catch (e) { note.textContent = e.message === 'norun' ? T.norun : T.sendErr; note.className = 'note err'; if (e.message !== 'norun') $('recBtn').disabled = false; }
};

// ---------- 起動 ----------
setLang(pickLang());
$('load').textContent = T.loading;
new GLTFLoader().load('kaeru.glb', gl => {
  setupModels(gl); resetWorld(Math.floor(Math.random() * 1e9)); ST = 'title'; titleYaw = Pl.yaw; $('load').hidden = true; $('title').hidden = false; requestAnimationFrame(frame);
}, undefined, () => { $('load').textContent = T.nogl; });
if (DEV) window.__K = { get ST() { return ST; }, set ST(v) { ST = v; }, Pl, BUR, START, CRAYS, UNI, grass, get FRIEND() { return FRIEND; }, get LAST() { return LAST; }, get met() { return met; }, resetWorld, start: () => start($('startBtn')), tp(x, z, yaw) { Pl.x = x; Pl.z = z; if (yaw != null) Pl.yaw = yaw; }, spawn(dist, st) { const c = CRAYS[0], f = fwd(Pl.yaw); c.x = Pl.x + f[0] * dist; c.z = Pl.z + f[1] * dist; c.st = st || 'emerge'; c.t = 0; c.key = 'dev'; c.ang = Pl.yaw + Math.PI; c.holder.visible = st !== 'rustle'; if (st === 'chase') { c.holder.position.set(c.x, 0, c.z); c.holder.rotation.y = c.ang; } }, die: () => die(CRAYS[0]), goal, board, submit, realRec, showResult, crayAt, hold(v) { held = v; }, shot: () => new Promise(r => { SHOT = r; }), cardURL: async () => { const b = await LAST.card; if (!b) return null; return await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(b); }); } };
