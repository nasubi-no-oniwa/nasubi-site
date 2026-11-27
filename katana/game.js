import { THREE, RoomEnvironment } from './lib.js?v=11241806';
import { COLORS, ORDER, CHARS } from './data.js?v=11241806';
import { ONI_TITLES, TIER, oniInfo, humanOf, oniHas, oniAdd, oniInvite, oniText } from '../onikiri/oni.js?v=11272150';
import { locW, oniNameL } from '../onikiri/i18n.js?v=11272150';
import { varNorm, otherOf, otSch, otWord } from '../onikiri/others.js?v=11272150';
const $ = id => document.getElementById(id);
const gsap = window.gsap, PFX = window.PFX;
const DEV = /[?&]dev=1/.test(location.search);
const FAST = /[?&]fast=1/.test(location.search);
const IS_PHONE = /iPhone|iPod|iPad|Android/i.test(navigator.userAgent || '');
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- ことば ----------
const TX = {
  ja: { oni: 'この刀で鬼を斬りに行く', oniGo: '鬼として暴れに行く', artL: '血鬼術', tierL: '強さ', oniAs: n => `鬼としての名：${n}`, more: n => ` ほか${n}`, whoOni: n => `「<b>${esc(n)}</b>」は鬼になった。もう`, postOni: (n, a, self) => (self ? `「${n}」は鬼になった。` : `「${n}」は鬼なので、日輪刀を握れなかった。`) + `\n血鬼術「${a}」\n#色変わりの刀 #ブラウザゲーム`, lang: '日本語', ttl: '色変わりの刀', h1: '<small>いろがわりのかたな</small>色変わりの刀', lead: '名前を入れて、日輪刀を握れ。<br>刀身の色で、呼吸の適性と才能がわかる。', ph: '名前を入れる', start: '日輪刀を握る', needName: '名前を入れてください', sndOn: '🔊 音あり', sndOff: '🔇 音なし', stats: 'みんなの刀の色', again: 'ほかの名前で握る', img: '画像にする', x: '𝕏 に投稿', back: 'もどる',
    who: n => `「<b>${esc(n)}</b>」の日輪刀は`, den: '才能（色の濃さ）', ranks: ['ほぼ無色', '才能うすめ', '並', '一人前', '秀才', '天賦の才'], rNone: '才能なし', rNez: '鬼',
    odds: p => `出やすさ：約${p}%`, share: (p, n) => `みんなの結果：この色は全体の <b>${p}%</b>（${n}人中）`, shareWait: 'みんなの結果：集計中…', shareErr: 'みんなの結果：いまは読みこめません',
    stNote: n => `これまでに ${n} 人が刀を握った`, stEmpty: 'まだ誰も握っていません', loading: '読みこみ中…', mine: '← あなた',
    capGrip: 'にぎる', capHold: '長押しで握る', capNone: '……変わらない', capNez: '握れない',
    post: (n, c, s, r, d) => `「${n}」の日輪刀は【${c}】に変わった。\n${s}・階級${r}（濃さ${d}%）\n#色変わりの刀 #ブラウザゲーム`,
    postNone: n => `「${n}」の日輪刀は……色が変わらなかった。\n呼吸の適性なし。\n#色変わりの刀 #ブラウザゲーム`,
    postNez: n => `「${n}」は鬼なので、日輪刀を握れなかった。\n#色変わりの刀 #ブラウザゲーム`,
    kyu: '階級', kan: ['甲（きのえ）', '乙（きのと）', '丙（ひのえ）', '丁（ひのと）', '戊（つちのえ）', '己（つちのと）', '庚（かのえ）', '辛（かのと）', '壬（みずのえ）', '癸（みずのと）'], sp: { hashira: '柱', exhashira: '元・柱', notmember: '隊士ではない', sengoku: '戦国の剣士', selection: '最終選別で散った', member: '隊士（階級は不明）', oni: '鬼' }, from: k => `（${k}の派生）`,
    words: { human: '人間に戻った。もう、日輪刀を握る必要はない。', genya: '呼吸は使えない。それでも最後まで戦い抜いた。' },
    crow: (n, c, k) => `カァー！「${n}」ノ日輪刀ハ<b>${c}</b>！${k}ノ適性アリ！`, crowNone: n => `カァー！「${n}」ノ日輪刀、色ガ変ワラナイ！`, crowOni: n => `カァー！鬼ダ！「${n}」ハ鬼ダ！`,
    akaCap: '赫く灼けた', tapNext: 'タップで結果へ', aka: '握りしめた日輪刀が、赫く灼けた', akaPost: '日輪刀が赫く灼けた。', cut: '頸を斬った', stab: '突き刺した。藤の花の毒が回る', cutNo: '頸が硬い…斬れない', fan: '※非公式のファン診断です', keepHold: 'そのまま握りしめると…？',
    xCopied: '画像をコピーしました。Xの投稿欄に貼りつけ（Ctrl+V）すると画像がつきます', xSaved: '画像を保存しました。Xの投稿に、保存した画像を追加してください', nogl: 'この端末では3Dを表示できませんでした', cardTag: '刀身の色で、才能がわかる' },
  en: { oni: 'Slay demons with this blade', oniGo: 'Go rampage as a demon', artL: 'Blood Demon Art', tierL: 'Strength', oniAs: n => `Demon name: ${n}`, more: n => ` +${n}`, whoOni: n => `<b>${esc(n)}</b> became a demon. The blade`, postOni: (n, a, self) => (self ? `${n} became a demon.` : `"${n}" is a demon and couldn't hold the blade.`) + `\nBlood Demon Art: ${a}\n#色変わりの刀 #ブラウザゲーム`, lang: 'English', ttl: 'The Color-Changing Blade', h1: '<small>IROGAWARI NO KATANA</small>Color Blade', lead: 'Enter a name. Grip the Nichirin Blade.<br>Its color reveals your Breathing and talent.', ph: 'Enter a name', start: 'Grip the blade', needName: 'Please enter a name', sndOn: '🔊 Sound on', sndOff: '🔇 Sound off', stats: "Everyone's blades", again: 'Try another name', img: 'Save image', x: 'Post on 𝕏', back: 'Back',
    who: n => `<b>${esc(n)}</b>'s Nichirin Blade turned`, den: 'Talent (color depth)', ranks: ['Barely tinted', 'Faint talent', 'Average', 'Capable', 'Gifted', 'Born genius'], rNone: 'No talent', rNez: 'Demon',
    odds: p => `Odds: about ${p}%`, share: (p, n) => `Everyone: <b>${p}%</b> got this color (of ${n})`, shareWait: 'Everyone: counting…', shareErr: "Everyone: can't load right now",
    stNote: n => `${n} people have gripped the blade`, stEmpty: 'Nobody yet', loading: 'Loading…', mine: '← you',
    capGrip: 'GRIP', capHold: 'Press and hold', capNone: '…no change', capNez: "Can't hold it",
    post: (n, c, s, r, d) => `"${n}"'s blade turned ${c}.\n${s} / ${r} (depth ${d}%)\n#色変わりの刀 #ブラウザゲーム`,
    postNone: n => `"${n}"'s blade… didn't change color.\nNo particular talent.\n#色変わりの刀 #ブラウザゲーム`,
    postNez: n => `"${n}" couldn't hold the blade.\n#色変わりの刀 #ブラウザゲーム`,
    kyu: 'Rank', kan: ['甲 Kinoe', '乙 Kinoto', '丙 Hinoe', '丁 Hinoto', '戊 Tsuchinoe', '己 Tsuchinoto', '庚 Kanoe', '辛 Kanoto', '壬 Mizunoe', '癸 Mizunoto'], sp: { hashira: 'Hashira', exhashira: 'Former Hashira', notmember: 'Not a Corps member', sengoku: 'Sengoku-era swordsman', selection: 'Fell in the Final Selection', member: 'Corps member (rank unknown)', oni: 'Demon' }, from: k => ` (derived from ${k})`,
    words: { human: 'Human again. No need to hold a Nichirin Blade anymore.', genya: "Couldn't use Breathing. Fought to the very end anyway." },
    crow: (n, c, k) => `CAW! ${n}'s blade is <b>${c}</b>! ${k}!`, crowNone: n => `CAW! ${n}'s blade didn't change color!`, crowOni: n => `CAW! A demon! ${n} is a demon!`,
    akaCap: 'Burning red', tapNext: 'Tap to see the result', aka: 'Gripped hard, the blade burned crimson', akaPost: 'The blade burned crimson.', cut: 'Head severed', stab: 'Stabbed. The wisteria poison spreads', cutNo: "Too hard… can't cut it", fan: '* Unofficial fan quiz', keepHold: 'Keep holding…?',
    xCopied: 'Image copied. Paste it (Ctrl+V) into your post to attach it', xSaved: 'Image saved. Add the saved image to your post', nogl: "This device can't show 3D", cardTag: 'The blade color reveals your talent' },
  zh: { oni: '用這把刀去斬鬼', oniGo: '以鬼的身分去大鬧', artL: '血鬼術', tierL: '強度', oniAs: n => `作為鬼的名字：${n}`, more: n => ` 等${n}`, whoOni: n => `「<b>${esc(n)}</b>」成為了鬼。再也`, postOni: (n, a, self) => (self ? `「${n}」成為了鬼。` : `「${n}」是鬼，握不住日輪刀。`) + `\n血鬼術「${a}」\n#色変わりの刀 #ブラウザゲーム`, lang: '繁體中文', ttl: '變色之刀', h1: '<small>變色之刀</small>變色之刀', lead: '輸入名字，握住日輪刀。<br>刀身的顏色揭曉呼吸的適性與才能。', ph: '輸入名字', start: '握刀', needName: '請輸入名字', sndOn: '🔊 有聲音', sndOff: '🔇 靜音', stats: '大家的刀色', again: '換個名字握', img: '存成圖片', x: '發到 𝕏', back: '返回',
    who: n => `「<b>${esc(n)}</b>」的日輪刀變成了`, den: '才能（顏色深淺）', ranks: ['幾乎無色', '才能稀薄', '普通', '獨當一面', '秀才', '天賦異稟'], rNone: '沒有才能', rNez: '鬼',
    odds: p => `出現機率：約${p}%`, share: (p, n) => `大家的結果：這個顏色佔 <b>${p}%</b>（共${n}人）`, shareWait: '大家的結果：統計中…', shareErr: '大家的結果：目前無法讀取',
    stNote: n => `已經有 ${n} 人握過刀`, stEmpty: '還沒有人握過', loading: '讀取中…', mine: '← 你',
    capGrip: '握', capHold: '長按來握', capNone: '……沒有變色', capNez: '握不住',
    post: (n, c, s, r, d) => `「${n}」的刀變成了【${c}】。\n${s}・${r}（深度${d}%）\n#色変わりの刀 #ブラウザゲーム`,
    postNone: n => `「${n}」的刀……沒有變色。\n沒什麼才能。\n#色変わりの刀 #ブラウザゲーム`,
    postNez: n => `「${n}」握不住刀。\n#色変わりの刀 #ブラウザゲーム`,
    kyu: '階級', kan: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'], sp: { hashira: '柱', exhashira: '前・柱', notmember: '不是隊士', sengoku: '戰國的劍士', selection: '殞命於最終選拔', member: '隊士（階級不明）', oni: '鬼' }, from: k => `（${k}的衍生）`,
    words: { human: '變回人類了。已經不需要再握日輪刀。', genya: '無法使用呼吸。即使如此仍戰到最後。' },
    crow: (n, c, k) => `嘎——！「${n}」的日輪刀是<b>${c}</b>！有${k}的適性！`, crowNone: n => `嘎——！「${n}」的日輪刀沒有變色！`, crowOni: n => `嘎——！是鬼！「${n}」是鬼！`,
    akaCap: '赫紅灼燒', tapNext: '點一下看結果', aka: '緊握的日輪刀，燒得赫紅', akaPost: '日輪刀燒得赫紅。', cut: '斬下了頸', stab: '刺穿了。紫藤花之毒蔓延開來', cutNo: '頸太硬了…斬不斷', fan: '※非官方的粉絲診斷', keepHold: '就這樣繼續握緊…？',
    xCopied: '已複製圖片。在 X 的貼文欄貼上（Ctrl+V）即可附上圖片', xSaved: '已儲存圖片。請在 X 貼文中加入儲存的圖片', nogl: '這台裝置無法顯示 3D', cardTag: '刀身的顏色揭曉你的才能' },
  ko: { oni: '이 칼로 귀신을 베러 간다', oniGo: '귀신으로 날뛰러 간다', artL: '혈귀술', tierL: '강함', oniAs: n => `귀신으로서의 이름: ${n}`, more: n => ` 외 ${n}`, whoOni: n => `「<b>${esc(n)}</b>」은(는) 귀신이 되었다. 이제`, postOni: (n, a, self) => (self ? `「${n}」은(는) 귀신이 되었다.` : `「${n}」은(는) 귀신이라 칼을 쥘 수 없었다.`) + `\n혈귀술「${a}」\n#色変わりの刀 #ブラウザゲーム`, lang: '한국어', ttl: '색이 변하는 칼', h1: '<small>이로가와리노 카타나</small>색이 변하는 칼', lead: '이름을 넣고 일륜도를 쥐어라.<br>칼날의 색으로 호흡의 적성과 재능을 알 수 있다.', ph: '이름 입력', start: '칼을 쥔다', needName: '이름을 입력해 주세요', sndOn: '🔊 소리 켬', sndOff: '🔇 소리 끔', stats: '모두의 칼 색', again: '다른 이름으로 쥐기', img: '이미지로 저장', x: '𝕏 에 올리기', back: '돌아가기',
    who: n => `「<b>${esc(n)}</b>」의 일륜도는`, den: '재능（색의 농도）', ranks: ['거의 무색', '재능 옅음', '보통', '제 몫', '수재', '천부적 재능'], rNone: '재능 없음', rNez: '귀신',
    odds: p => `나올 확률: 약 ${p}%`, share: (p, n) => `모두의 결과: 이 색은 전체의 <b>${p}%</b>（${n}명 중）`, shareWait: '모두의 결과: 집계 중…', shareErr: '모두의 결과: 지금은 불러올 수 없음',
    stNote: n => `지금까지 ${n}명이 칼을 쥐었다`, stEmpty: '아직 아무도 없음', loading: '불러오는 중…', mine: '← 당신',
    capGrip: '쥔다', capHold: '길게 눌러 쥐기', capNone: '……변하지 않는다', capNez: '쥘 수 없다',
    post: (n, c, s, r, d) => `「${n}」의 칼은【${c}】으로 변했다.\n${s}・${r}（농도 ${d}%）\n#色変わりの刀 #ブラウザゲーム`,
    postNone: n => `「${n}」의 칼은……색이 변하지 않았다.\n재능, 딱히 없음.\n#色変わりの刀 #ブラウザゲーム`,
    postNez: n => `「${n}」은 칼을 쥘 수 없었다.\n#色変わりの刀 #ブラウザゲーム`,
    kyu: '계급', kan: ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'], sp: { hashira: '주', exhashira: '전・주', notmember: '대원이 아님', sengoku: '전국시대의 검사', selection: '최종 선별에서 쓰러짐', member: '대원（계급 불명）', oni: '귀신' }, from: k => `（${k}의 파생）`,
    words: { human: '인간으로 돌아왔다. 이제 일륜도를 쥘 필요는 없다.', genya: '호흡은 쓸 수 없다. 그래도 끝까지 싸웠다.' },
    crow: (n, c, k) => `까악! 「${n}」의 일륜도는 <b>${c}</b>! ${k}의 적성 있음!`, crowNone: n => `까악! 「${n}」의 일륜도, 색이 변하지 않는다!`, crowOni: n => `까악! 귀신이다! 「${n}」은 귀신이다!`,
    akaCap: '붉게 달아올랐다', tapNext: '탭해서 결과 보기', aka: '움켜쥔 일륜도가 붉게 달아올랐다', akaPost: '일륜도가 붉게 달아올랐다.', cut: '목을 베었다', stab: '찔렀다. 등꽃의 독이 퍼진다', cutNo: '목이 너무 단단하다…베지 못했다', fan: '※비공식 팬 진단입니다', keepHold: '그대로 계속 쥐면…?',
    xCopied: '이미지를 복사했습니다. X 글쓰기 칸에 붙여넣기（Ctrl+V）하면 이미지가 붙습니다', xSaved: '이미지를 저장했습니다. X 글에 저장한 이미지를 추가해 주세요', nogl: '이 기기에서는 3D를 표시할 수 없습니다', cardTag: '칼날의 색으로 재능을 알 수 있다' },
};
let L = 'ja', T = TX.ja;
function pickLang() { const q = (/[?&]lang=([a-z]+)/.exec(location.search) || [])[1]; if (TX[q]) return q; const s = ls.get('katana_lang', null); if (TX[s]) return s; const n = (navigator.language || 'ja').toLowerCase(); return n.startsWith('ja') ? 'ja' : n.startsWith('zh') ? 'zh' : n.startsWith('ko') ? 'ko' : 'en'; }
function setLang(l) {
  L = l; T = TX[l]; ls.set('katana_lang', l); document.documentElement.lang = l === 'zh' ? 'zh-Hant' : l; document.title = T.ttl;
  $('tH1').innerHTML = T.h1; $('tLead').innerHTML = T.lead; $('nm').placeholder = T.ph; $('startBtn').textContent = T.start; $('stBtn').textContent = T.stats; $('stBtn2').textContent = T.stats;
  $('again').textContent = T.again; $('oniBtn').textContent = T.oni; $('imgBtn').textContent = T.img; $('xBtn').textContent = T.x; $('stBack').textContent = T.back; $('tFan').textContent = T.fan; $('stT').textContent = T.stats; $('nmNote').textContent = '';
  $('langs').innerHTML = Object.keys(TX).map(k => `<button data-l="${k}" class="${k === L ? 'on' : ''}">${TX[k].lang}</button>`).join(''); $('langs').querySelectorAll('button').forEach(b => b.onclick = () => setLang(b.dataset.l));
  sndLabel(); if (LAST && !$('result').hidden) fillResult(LAST);
}

// ---------- 名前から色を決める（同じ名前なら必ず同じ） ----------
const toHira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const norm = s => toHira(String(s).normalize('NFKC').replace(/[\s　・･]/g, '').toLowerCase());
function hash(s, seed) { let h = (2166136261 ^ seed) >>> 0; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
// 原作キャラは、漢字・ひらがな・カタカナ、名字のあるなし、名字と名前の漢字／よみの組みあわせを同じに扱う（解放戦力と同じ決まり）。名字だけは対象外。色を決める計算に使う名前（norm）は変えない
const charKey = s => varNorm(norm(s).replace(/[\uFE00-\uFE0F\u{E0100}-\u{E01EF}]/gu, '')).replace(/を/g, 'お');
const CHMAP = new Map();
CHARS.forEach(c => { const n = c.n, v = n.slice(); if (n.length >= 4 && n[0].endsWith(n[2]) && n[1].endsWith(n[3])) { const s = n[0].slice(0, -n[2].length), sy = n[1].slice(0, -n[3].length); if (s && sy) v.push(s + n[3], sy + n[2]); } v.forEach(x => { const k = charKey(x); if (!CHMAP.has(k)) CHMAP.set(k, c); }); });
ONI_TITLES.forEach(([al, nm]) => { const c = CHARS.find(c => c.n[0] === nm); if (c) { const k = charKey(al); if (!CHMAP.has(k)) CHMAP.set(k, c); } }); // 「上弦の参」→ 猗窩座 など
// 鬼にする：原作の鬼と、この端末で鬼になった名前。刀は握れず、血鬼術が決まる
function makeOni(R) { R.oni = oniInfo(R.name, R.cn); R.ot = null; R.key = 'nezuko'; R.den = 0; R.rank = 'oni'; R.word = undefined; R.aka = false; R.akaDone = false; return R; }
const POOL = ORDER.map(k => [k, COLORS[k].w]);
function judge(name) {
  const n = norm(name); const r1 = hash(n, 0x6b61), r2 = hash(n, 0x7461);
  const o = otherOf(name); if (o) return { key: o.k, den: o.den, n, aka: false, stab: false, ch: true, cn: o.n0, ot: o }; // 別作品の剣士（フルネームのときだけ）
  const c = CHMAP.get(charKey(name)); if (c) return { key: c.k, den: c.den, n, rank: c.rank, aka: !!c.aka, word: c.word, stab: !!c.stab, ch: true, cn: c.n[0] };
  let key = null, x = r1 * 100; for (const [k, w] of POOL) { if (x < w) { key = k; break; } x -= w; } key = key || 'none';
  let den;
  if (key === 'none') den = Math.floor(r2 * 6); // 変わらない：ほんの少しだけ
  else if (key === 'nezuko') den = 0;
  else if (COLORS[key].base) den = Math.round(18 + 82 * Math.pow(r2, 0.85));
  else if (key === 'black') den = Math.round(62 + 38 * r2);
  else den = Math.round(42 + 58 * r2);
  return { key, den, n };
}
const KAN = '甲乙丙丁戊己庚辛壬癸';
function rankOf(R) {
  if (R.rank) return T.sp[R.rank] || T.kan[KAN.indexOf(R.rank)] || R.rank;
  if (R.key === 'nezuko') return T.sp.oni; if (R.key === 'none') return T.kan[9];
  if (R.den >= 99) return T.sp.hashira; return T.kan[Math.min(9, Math.floor((100 - R.den) / 10))];
}
const kokyu = (k, R) => { if (R && R.ot) return otSch(R.ot, L); const C = COLORS[k]; return C.kokyu[L] + (C.from ? T.from(COLORS[C.from].kokyu[L]) : ''); };
const wordOf = R => R.ot ? otWord(R.ot, L) : R.word ? T.words[R.word] : COLORS[R.key].word[L];

// ---------- 音 ----------
let AC = null, SND = ls.get('katana_snd', true);
function sndLabel() { $('sndBtn').textContent = SND ? T.sndOn : T.sndOff; }
$('sndBtn').onclick = () => { SND = !SND; ls.set('katana_snd', SND); sndLabel(); };
function ac() { if (!SND) return null; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; } catch (e) { return null; } }
function noise(a, dur) { const b = a.createBuffer(1, a.sampleRate * dur, a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = a.createBufferSource(); s.buffer = b; return s; }
function sfx(k) {
  const a = ac(); if (!a) return; const t = a.currentTime, g = a.createGain(); g.connect(a.destination);
  if (k === 'draw') { const s = noise(a, .7), f = a.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 6; f.frequency.setValueAtTime(1800, t); f.frequency.exponentialRampToValueAtTime(7000, t + .6); s.connect(f); f.connect(g); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.35, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + .7); s.start(t); s.stop(t + .7); }
  else if (k === 'ring') { [1320, 1980, 2640].forEach((fq, i) => { const o = a.createOscillator(), gg = a.createGain(); o.type = 'sine'; o.frequency.value = fq * (1 + i * .003); o.connect(gg); gg.connect(g); gg.gain.setValueAtTime(.0001, t); gg.gain.exponentialRampToValueAtTime(.22 / (i + 1), t + .01); gg.gain.exponentialRampToValueAtTime(.0001, t + 2.2 - i * .4); o.start(t); o.stop(t + 2.3); }); g.gain.value = 1; }
  else if (k === 'thud') { const o = a.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(40, t + .5); o.connect(g); g.gain.setValueAtTime(.5, t); g.gain.exponentialRampToValueAtTime(.0001, t + .6); o.start(t); o.stop(t + .6); }
  else if (k === 'caw') { [0, .32].forEach(d => { const o = a.createOscillator(), f = a.createBiquadFilter(), gg = a.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(820, t + d); o.frequency.exponentialRampToValueAtTime(430, t + d + .22); f.type = 'bandpass'; f.frequency.value = 1100; f.Q.value = 2.5; o.connect(f); f.connect(gg); gg.connect(g); gg.gain.setValueAtTime(.0001, t + d); gg.gain.exponentialRampToValueAtTime(.35, t + d + .02); gg.gain.exponentialRampToValueAtTime(.0001, t + d + .26); o.start(t + d); o.stop(t + d + .28); }); g.gain.value = 1; }
  else if (k === 'growl') { const o = a.createOscillator(), f = a.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(70, t); o.frequency.linearRampToValueAtTime(55, t + .8); f.type = 'lowpass'; f.frequency.value = 400; o.connect(f); f.connect(g); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.28, t + .15); g.gain.exponentialRampToValueAtTime(.0001, t + .9); o.start(t); o.stop(t + .95); }
  else if (k === 'cut') { const s2 = noise(a, .35), f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.setValueAtTime(5000, t); f.frequency.exponentialRampToValueAtTime(900, t + .3); s2.connect(f); f.connect(g); g.gain.setValueAtTime(.5, t); g.gain.exponentialRampToValueAtTime(.0001, t + .35); s2.start(t); s2.stop(t + .35); }
  else if (k === 'clang') { [2400, 3150, 4100].forEach((fq, i) => { const o = a.createOscillator(), gg = a.createGain(); o.frequency.value = fq; o.connect(gg); gg.connect(g); gg.gain.setValueAtTime(.2 / (i + 1), t); gg.gain.exponentialRampToValueAtTime(.0001, t + .6); o.start(t); o.stop(t + .62); }); g.gain.value = 1; }
  else if (k === 'zap') { const s = noise(a, .5), f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2500; s.connect(f); f.connect(g); g.gain.setValueAtTime(.3, t); g.gain.exponentialRampToValueAtTime(.0001, t + .5); s.start(t); s.stop(t + .5); }
}
let HUM = null;
function humOn() { if (HUM) return; const a = ac(); if (!a) return; const t = a.currentTime, o = a.createOscillator(), o2 = a.createOscillator(), f = a.createBiquadFilter(), g = a.createGain(); o.type = 'sawtooth'; o2.type = 'sine'; o.frequency.value = 70; o2.frequency.value = 140; f.type = 'lowpass'; f.frequency.value = 300; o.connect(f); o2.connect(f); f.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.1, t + .15); o.start(t); o2.start(t); HUM = { o, o2, f, g, a }; }
function humSet(p) { if (!HUM) return; const t = HUM.a.currentTime; HUM.o.frequency.setTargetAtTime(70 + 190 * p, t, .05); HUM.o2.frequency.setTargetAtTime(140 + 480 * p, t, .05); HUM.f.frequency.setTargetAtTime(300 + 2100 * p, t, .05); }
function humStop() { if (!HUM) return; const { o, o2, g, a } = HUM, t = a.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(Math.max(.0001, g.gain.value), t); g.gain.exponentialRampToValueAtTime(.0001, t + .15); o.stop(t + .2); o2.stop(t + .2); HUM = null; }

// ---------- 3D ----------
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas: $('gl'), antialias: true, preserveDrawingBuffer: true }); } catch (e) { $('load').textContent = TX[pickLang()].nogl; throw e; }
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, .1, 100); camera.position.set(0, 0, 9);
const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = .9;
// 背景（上が紫がかった夜、下が闇）
const bgMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { uTint: { value: new THREE.Color('#c9a14a') }, uMix: { value: 0 } },
  vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: 'uniform vec3 uTint; uniform float uMix; varying vec3 vP; void main(){ float h = vP.y*.5+.5; vec3 c = mix(vec3(.012,.012,.025), vec3(.085,.07,.13), smoothstep(.2,.95,h)); float r = 1.0-smoothstep(0.0,.55,length(vP.xy*vec2(.9,1.4))); c += uTint*r*r*.22*uMix; gl_FragColor = vec4(c,1.0); }' });
scene.add(new THREE.Mesh(new THREE.SphereGeometry(40, 32, 16), bgMat));
const key = new THREE.DirectionalLight('#fff6e6', 2.2); key.position.set(3, 5, 6); scene.add(key);
const rim = new THREE.DirectionalLight('#8aa0ff', 1.4); rim.position.set(-5, 2, -4); scene.add(rim);
scene.add(new THREE.AmbientLight('#404060', .6));

// 刀身（反りあり・鎬・切っ先）。aU = 根元0→切っ先1、aE = 刃先ほど1
function bladeGeo() {
  const Lb = 3.0, N = 120, pos = [], au = [], ae = [];
  const ring = [];
  for (let i = 0; i <= N; i++) {
    const p = i / N, x = p * Lb, w = .15 * (1 - .3 * p), t = .034 * (1 - .4 * p), kp = Math.max(0, (p - .87) / .13);
    const yT = w / 2 * (1 - .3 * kp * kp), yE = -w / 2 + w * .85 * Math.pow(kp, 1.35), yS = yT + (yE - yT) * .3, tt = t * (1 - .92 * kp), yo = .16 * p * p;
    ring.push([[x, yT + yo, tt * .35, 0], [x, yS + yo, tt, .15], [x, yE + yo, 0, 1], [x, yS + yo, -tt, .15], [x, yT + yo, -tt * .35, 0]]);
  }
  const push = (v, u) => { pos.push(v[0], v[1], v[2]); au.push(u); ae.push(v[3]); };
  for (let i = 0; i < N; i++) { const A = ring[i], B = ring[i + 1], ua = i / N, ub = (i + 1) / N; for (let j = 0; j < 5; j++) { const j2 = (j + 1) % 5; push(A[j], ua); push(B[j], ub); push(B[j2], ub); push(A[j], ua); push(B[j2], ub); push(A[j2], ua); } }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aU', new THREE.Float32BufferAttribute(au, 1)); g.setAttribute('aE', new THREE.Float32BufferAttribute(ae, 1)); g.computeVertexNormals(); return g;
}
const U = { uProg: { value: 0 }, uTint: { value: new THREE.Color('#ffffff') }, uAmt: { value: 0 }, uGlow: { value: 0 }, uAura: { value: 0 }, uTime: { value: 0 } };
const bladeMat = new THREE.MeshPhysicalMaterial({ color: '#d7dbe0', metalness: 1, roughness: .2, clearcoat: .6, clearcoatRoughness: .15, envMapIntensity: 1.25 });
bladeMat.onBeforeCompile = sh => {
  Object.assign(sh.uniforms, U);
  sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aU; attribute float aE; varying float vU; varying float vE;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvU = aU; vE = aE;');
  sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uProg; uniform vec3 uTint; uniform float uAmt; uniform float uGlow; uniform float uAura; uniform float uTime; varying float vU; varying float vE;\nfloat fillAt(){ return 1.0 - smoothstep(uProg - .035, uProg, vU); }\nfloat hamon(){ return smoothstep(.72, .86, vE + .05*sin(vU*95.0)*sin(vU*31.0+1.3)); }')
    .replace('#include <color_fragment>', '#include <color_fragment>\nfloat fl = fillAt(); float hm = hamon(); vec3 tc = pow(mix(sqrt(max(diffuseColor.rgb, vec3(0.0))), sqrt(uTint), uAmt), vec3(2.0)); diffuseColor.rgb = mix(mix(diffuseColor.rgb, tc, fl), vec3(.95,.96,.98), hm*.55);')
    .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, mix(.2, .9, 1.0-uAmt), fl*(1.0-hm*.6));')
    .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, .4, fl*uAmt);')
    .replace('#include <lights_physical_fragment>', '#include <lights_physical_fragment>\n#ifdef USE_CLEARCOAT\nmaterial.clearcoat *= 1.0 - fillAt()*uAmt*.85;\n#endif')
    .replace('#include <lights_fragment_end>', '#include <lights_fragment_end>\nreflectedLight.indirectSpecular *= 1.0 - fillAt()*uAmt*(1.0-hamon())*.75;')
    .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\nfloat band = exp(-pow((vU - uProg)/.03, 2.0)); totalEmissiveRadiance += uTint*band*uGlow*2.2 + uTint*fl*uAmt*(1.0-hm)*uAura*(.32 + .08*sin(uTime*2.0 + vU*8.0));');
};
const katana = new THREE.Group(), inner = new THREE.Group(); katana.add(inner); scene.add(katana);
const blade = new THREE.Mesh(bladeGeo(), bladeMat); inner.add(blade);
const gold = new THREE.MeshStandardMaterial({ color: '#c9a14a', metalness: 1, roughness: .32 });
const iron = new THREE.MeshStandardMaterial({ color: '#2a2622', metalness: .85, roughness: .5 });
const habaki = new THREE.Mesh(new THREE.BoxGeometry(.13, .17, .085), gold); habaki.position.set(.035, .0, 0); inner.add(habaki);
const tsuba = new THREE.Mesh(new THREE.CylinderGeometry(.24, .24, .04, 48), iron); tsuba.rotation.z = Math.PI / 2; tsuba.position.x = -.05; inner.add(tsuba);
const tring = new THREE.Mesh(new THREE.TorusGeometry(.24, .013, 8, 48), gold); tring.rotation.y = Math.PI / 2; tring.position.x = -.05; inner.add(tring);
const seppa = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .1, 24), gold); seppa.rotation.z = Math.PI / 2; seppa.position.x = -.05; inner.add(seppa);
function tsukaTex() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 128; const x = c.getContext('2d');
  x.fillStyle = '#16121a'; x.fillRect(0, 0, 128, 128);
  x.fillStyle = '#ebe4d2'; x.beginPath(); x.moveTo(64, 14); x.lineTo(104, 64); x.lineTo(64, 114); x.lineTo(24, 64); x.closePath(); x.fill();
  for (let i = 0; i < 160; i++) { x.fillStyle = `rgba(150,140,120,${Math.random() * .5})`; x.beginPath(); x.arc(40 + Math.random() * 48, 30 + Math.random() * 68, Math.random() * 1.6 + .4, 0, 7); x.fill(); }
  x.strokeStyle = '#3a3040'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 0); x.lineTo(128, 128); x.moveTo(128, 0); x.lineTo(0, 128); x.stroke();
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 7); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const tsuka = new THREE.Mesh(new THREE.CylinderGeometry(.062, .068, 1.0, 32, 1, true), new THREE.MeshStandardMaterial({ map: tsukaTex(), roughness: .8, metalness: 0 })); tsuka.rotation.z = Math.PI / 2; tsuka.rotation.x = Math.PI / 2; tsuka.position.x = -.6; inner.add(tsuka);
const kashira = new THREE.Mesh(new THREE.SphereGeometry(.07, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), iron); kashira.rotation.z = Math.PI / 2; kashira.position.x = -1.1; inner.add(kashira);
const fuchi = new THREE.Mesh(new THREE.CylinderGeometry(.075, .075, .05, 24), iron); fuchi.rotation.z = Math.PI / 2; fuchi.position.x = -.1; inner.add(fuchi);
inner.position.x = -.95; // 刀の真ん中を回転の中心に

// 大正の夜（月・山・瓦屋根の町並み・電柱・ガス灯・藤の花）
function taishoTex() {
  const W = 2048, H = 1024, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const R = (a => () => (a = (a * 16807) % 2147483647) / 2147483647)(7);
  const g = x.createRadialGradient(1110, 190, 10, 1110, 190, 150); g.addColorStop(0, '#fff7e0'); g.addColorStop(.33, '#efe0b8'); g.addColorStop(.36, '#efe0b844'); g.addColorStop(1, '#efe0b800'); x.fillStyle = g; x.fillRect(950, 30, 320, 320);
  x.fillStyle = '#1a1730'; x.beginPath(); x.moveTo(0, 640); for (let i = 0; i <= 32; i++) x.lineTo(i * 64, 600 - Math.sin(i * .55) * 70 - Math.sin(i * 1.7) * 30); x.lineTo(W, H); x.lineTo(0, H); x.fill();
  let bx = -40; while (bx < W) { const w = 150 + R() * 140, h = 150 + R() * 140, top = H - h - 40;
    x.fillStyle = '#0e0c16'; x.fillRect(bx, top, w, h + 40);
    x.beginPath(); x.moveTo(bx - 22, top + 6); x.quadraticCurveTo(bx + w / 2, top - 46, bx + w + 22, top + 6); x.lineTo(bx + w + 22, top + 20); x.lineTo(bx - 22, top + 20); x.fill();
    if (R() > .45) { x.beginPath(); x.moveTo(bx - 14, top + h * .5); x.lineTo(bx + w + 14, top + h * .5); x.lineTo(bx + w, top + h * .5 + 14); x.lineTo(bx, top + h * .5 + 14); x.fill(); }
    for (let r = 0; r < 2; r++) for (let k = 0; k < Math.floor(w / 46); k++) if (R() > .45) { const wx = bx + 14 + k * 46, wy = top + 34 + r * h * .48; x.fillStyle = R() > .5 ? '#f2b45a' : '#d9873a'; x.globalAlpha = .55 + R() * .4; x.fillRect(wx, wy, 26, 30); x.globalAlpha = 1; x.fillStyle = '#0e0c16'; x.fillRect(wx + 12, wy, 2, 30); x.fillRect(wx, wy + 14, 26, 2); }
    bx += w + 6 + R() * 30; }
  x.strokeStyle = '#0a0910'; x.lineWidth = 7; [260, 880, 1640].forEach(px => { x.beginPath(); x.moveTo(px, H); x.lineTo(px, 440); x.stroke(); x.lineWidth = 5; x.beginPath(); x.moveTo(px - 30, 470); x.lineTo(px + 30, 470); x.stroke(); x.lineWidth = 7; });
  x.lineWidth = 1.5; x.beginPath(); x.moveTo(0, 520); x.quadraticCurveTo(570, 560, 880, 472); x.quadraticCurveTo(1260, 540, 1640, 472); x.quadraticCurveTo(1900, 520, W, 500); x.stroke();
  [520, 1240, 1900].forEach(px => { const gg = x.createRadialGradient(px, 800, 2, px, 800, 70); gg.addColorStop(0, '#ffd890'); gg.addColorStop(1, '#ffd89000'); x.fillStyle = gg; x.fillRect(px - 70, 730, 140, 140); x.fillStyle = '#0a0910'; x.fillRect(px - 3, 812, 6, 212); });
  for (const side of [0, 1]) for (let k = 0; k < 9; k++) { const cx = side ? W - 40 - k * 70 - R() * 40 : 40 + k * 70 + R() * 40, len = 120 + R() * 220;
    for (let j = 0; j < 46; j++) { const t = j / 46, yy = t * len, rr = (1 - t) * 18 + 4; x.fillStyle = `hsla(${268 + R() * 20},${55 + R() * 20}%,${62 + t * 18}%,${.75 - t * .35})`; x.beginPath(); x.arc(cx + (R() - .5) * rr * 2, yy, 4 + (1 - t) * 4, 0, 7); x.fill(); } }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const taisho = new THREE.Mesh(new THREE.PlaneGeometry(30, 15), new THREE.MeshBasicMaterial({ map: taishoTex(), transparent: true, depthWrite: false, toneMapped: false, opacity: .9 }));
taisho.position.set(0, 0, -11); scene.add(taisho);
// 光の粒（色が走るところから舞い上がる）
const PN = 160, pGeo = new THREE.BufferGeometry(), pPos = new Float32Array(PN * 3), pLife = new Float32Array(PN), pVel = new Float32Array(PN * 3);
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pGeo.setAttribute('aLife', new THREE.BufferAttribute(pLife, 1));
const pMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uTint: U.uTint, uPx: { value: renderer.getPixelRatio() } },
  vertexShader: 'attribute float aLife; varying float vL; uniform float uPx; void main(){ vL = aLife; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = uPx*(26.0*aLife+4.0)/(-mv.z)*3.0; gl_Position = projectionMatrix*mv; }',
  fragmentShader: 'uniform vec3 uTint; varying float vL; void main(){ float d = length(gl_PointCoord-.5); float a = smoothstep(.5,.0,d)*vL; gl_FragColor = vec4(mix(uTint, vec3(1.0), .35)*a, a); }' });
const sparks = new THREE.Points(pGeo, pMat); sparks.frustumCulled = false; inner.add(sparks);
let emitAt = -1, pIdx = 0;
function emit(n, u, spread) { for (let k = 0; k < n; k++) { const i = pIdx++ % PN; const x = u * 3.0, yo = .16 * u * u; pPos[i * 3] = x + (Math.random() - .5) * .1; pPos[i * 3 + 1] = yo + (Math.random() - .5) * .14; pPos[i * 3 + 2] = (Math.random() - .5) * .08; const a = Math.random() * 6.283, s = (spread || .6) * (.4 + Math.random()); pVel[i * 3] = Math.cos(a) * s * .5; pVel[i * 3 + 1] = Math.sin(a) * s; pVel[i * 3 + 2] = (Math.random() - .5) * s; pLife[i] = 1; } }
function stepSparks(dt) { for (let i = 0; i < PN; i++) { if (pLife[i] <= 0) continue; pLife[i] -= dt * .9; pPos[i * 3] += pVel[i * 3] * dt; pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt; pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt; pVel[i * 3] *= .97; pVel[i * 3 + 1] *= .97; if (pLife[i] < 0) pLife[i] = 0; } pGeo.attributes.position.needsUpdate = true; pGeo.attributes.aLife.needsUpdate = true; }
// 舞う塵
const DN = 220, dGeo = new THREE.BufferGeometry(), dPos = new Float32Array(DN * 3);
for (let i = 0; i < DN; i++) { dPos[i * 3] = (Math.random() - .5) * 14; dPos[i * 3 + 1] = (Math.random() - .5) * 10; dPos[i * 3 + 2] = -1 - Math.random() * 8; }
dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
const dust = new THREE.Points(dGeo, new THREE.PointsMaterial({ color: '#b98be0', size: .055, transparent: true, opacity: .7, depthWrite: false })); scene.add(dust);

// ---------- 画面の大きさと刀の置き方 ----------
let VW = 1, VH = 1;
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); { const bh = 2 * (camera.position.z + 11) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.04, bw = Math.max(bh * 2, bh * camera.aspect * 1.04); taisho.scale.set(bw / 30, bw / 2 / 15, 1); taisho.position.y = (bw / 2 - bh) / 2 * -1 + 0; } VH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)); VW = VH * camera.aspect; pMat.uniforms.uPx.value = renderer.getPixelRatio(); if (POSE === 'top') setPose('top', 0); else if (POSE === 'stand') setPose('stand', 0); }
const LEN = 4.15;
function poseOf(p) {
  if (p === 'top') { const s = Math.min(1, VW * .9 / LEN, VH * .3 / .9); return { x: 0, y: VH / 2 - VH * .19, s, rz: .1, ry: 0 }; }
  const s = Math.min(1.05, VH * .72 / LEN, VW * 1.6 / LEN); return { x: 0, y: VH * .06, s, rz: Math.PI / 2 - .06, ry: 0 };
}
let POSE = 'top';
function setPose(p, dur, ease) { POSE = p; const P = poseOf(p); if (!dur) { katana.position.set(P.x, P.y, 0); katana.scale.setScalar(P.s); katana.rotation.z = P.rz; return null; } return gsap.timeline().to(katana.position, { x: P.x, y: P.y, duration: dur, ease: ease || 'power3.inOut' }, 0).to(katana.scale, { x: P.s, y: P.s, z: P.s, duration: dur, ease: ease || 'power3.inOut' }, 0).to(katana.rotation, { z: P.rz, duration: dur, ease: ease || 'power3.inOut' }, 0); }
addEventListener('resize', resize);

// ---------- 描く ----------
let ST = 'load', spin = 0, shake = 0, lastT = performance.now(), tAll = 0;
function frame(now) {
  const dt = Math.min(.1, (now - lastT) / 1000); lastT = now; tAll += dt; U.uTime.value = tAll;
  if (ST === 'title' || ST === 'result') { spin += dt * .55; katana.rotation.y = Math.sin(spin) * .55; katana.rotation.x = Math.sin(spin * .7) * .12; }
  if (ST === 'hold' && HOLD) holdStep(dt);
  if (ST === 'reveal' && REV) revealStep(dt);
  stepAsh(dt);
  if (emitAt >= 0) emit(2, Math.min(1, emitAt), .5);
  stepSparks(dt);
  const sx = (Math.random() - .5) * shake, sy = (Math.random() - .5) * shake; camera.position.x = sx; camera.position.y = sy;
  for (let i = 0; i < DN; i++) { dPos[i * 3 + 1] -= dt * (.18 + (i % 7) * .03); dPos[i * 3] += Math.sin(tAll * .9 + i) * dt * .12; if (dPos[i * 3 + 1] < -5) dPos[i * 3 + 1] = 5; } dGeo.attributes.position.needsUpdate = true;
  renderer.render(scene, camera); requestAnimationFrame(frame);
}

// ---------- 2Dの演出（pixelfx） ----------
const fctx = $('fxc').getContext('2d'); let FXS = [], fxRaf = 0, fxLast = 0, fxFrame = null, fxImg = null;
function ramp(hex) { const c = new THREE.Color(hex), o = []; for (let i = 0; i < 8; i++) { const t = i / 7, k = c.clone().multiplyScalar(.6 + .4 * Math.min(1, t * 1.4)).lerp(new THREE.Color('#ffffff'), Math.max(0, t - .55) * 1.6); o.push('#' + k.getHexString()); } return o; }
function fxAdd(mod, o) { try { if (!PFX || !mod) return; if (!fxFrame) { fxFrame = PFX.createFrame(160, 160); fxImg = new ImageData(160, 160); } const f = PFX.createFx(mod, o); f._life = mod === PFX.fx.confetti ? 3 : 1.4; FXS.push(f); if (!fxRaf) { fxLast = performance.now(); fxRaf = requestAnimationFrame(fxLoop); } } catch (e) { } }
function fxLoop(now) { const dt = Math.min(.05, (now - fxLast) / 1000); fxLast = now; try { PFX.clearFrame(fxFrame); FXS = FXS.filter(f => { f.update(dt); f.draw(fxFrame, 'back'); f.draw(fxFrame, 'front'); f._life -= dt; return !f.done() && f._life > 0; }); PFX.composite(fxFrame, fxImg.data, null); fctx.putImageData(fxImg, 0, 0); } catch (e) { FXS = []; } if (FXS.length) fxRaf = requestAnimationFrame(fxLoop); else { fxRaf = 0; fctx.clearRect(0, 0, 160, 160); } }

// ---------- 握る ----------
let LAST = null, busy = false;
function cap(t, hold) { const c = $('cap'); c.textContent = t; gsap.killTweensOf(c); gsap.fromTo(c, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .35 }); if (hold) gsap.to(c, { opacity: 0, duration: .4, delay: hold }); }
function grip() {
  if (busy) return; const name = $('nm').value.trim();
  if (!name) { $('nmNote').textContent = T.needName; $('nmNote').className = 'note g err'; gsap.fromTo('#nm', { x: -8 }, { x: 0, duration: .4, ease: 'elastic.out(1,.3)' }); return; }
  busy = true; ls.set('katana_name', name); $('nmNote').textContent = '';
  const R = judge(name); R.name = name; if (R.key === 'nezuko' || oniHas(name)) makeOni(R); LAST = R; const C = COLORS[R.key];
  ac(); sfx('draw'); $('title').hidden = true; ST = 'grip';
  U.uProg.value = 0; U.uGlow.value = 0; U.uAura.value = 0; U.uAmt.value = 0; bgMat.uniforms.uMix.value = 0;
  const tint = new THREE.Color(R.key === 'none' || R.key === 'nezuko' ? '#d7dbe0' : C.hex); U.uTint.value.copy(tint); bgMat.uniforms.uTint.value.copy(tint);
  const amt = R.key === 'none' ? .0 : R.key === 'black' ? 1 : (.55 + .45 * R.den / 100);
  const tl = gsap.timeline();
  tl.to(katana.rotation, { y: 0, x: 0, duration: .9, ease: 'power3.inOut' }, 0); tl.add(setPose('stand', .9), 0);
    tl.call(() => { U.uAmt.value = amt; HOLD = { R, p: 0, on: false }; ST = 'hold'; holdUI(true); });
}
// 長押し：押しているあいだ刀身が根元から色づく（これがゲージ）。離すと根元へ戻る。最後まで押しきると決まる
let HOLD = null, holding = false;
const HOLD_T = 2.4;
function holdUI(on) { const h = $('hold'); h.hidden = !on; if (on) { $('holdT').textContent = T.capHold; gsap.fromTo(h, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .35 }); } }
function press(v) { if (!((ST === 'hold' && HOLD) || (ST === 'reveal' && REV))) { holding = false; return; } holding = v; if (v) { ac(); humOn(); } else humStop(); $('hold').classList.toggle('on', v); }
function holdStep(dt) {
  const H = HOLD, R = H.R, nez = R.key === 'nezuko';
  if (holding) H.p = Math.min(1, H.p + dt / (nez ? 1.6 : HOLD_T)); else H.p = Math.max(0, H.p - dt / 1.1);
  const p = H.p; $('holdRing').style.setProperty('--p', (p * 100).toFixed(1));
  humSet(p); shake = holding ? (nez ? .03 + .14 * p : .04 * p * p) : 0;
  if (nez) { U.uTint.value.set('#ff3048'); emitAt = holding ? .05 + .3 * p : -1; }
  else { U.uProg.value = p * 1.06; U.uGlow.value = R.key === 'none' ? .25 * (holding ? 1 : .4) : (holding ? 1 : .45); emitAt = holding && R.key !== 'none' ? Math.min(1, p) : -1; }
  if (p >= 1) { HOLD = null; ST = 'grip'; holdUI(false); humStop(); emitAt = -1; shake = 0; finish(R); }
}
function finish(R) {
  const C = COLORS[R.key];
  if (R.key === 'nezuko') {
    sfx('thud'); sfx('zap'); flash('#ff3048'); fxAdd(PFX && PFX.fx.burst, { x: 80, y: 80, seed: 7, palette: ramp('#ff3048') }); cap(T.capNez);
    const tl = gsap.timeline();
    tl.to(katana.rotation, { z: '+=' + (Math.PI * 1.5), duration: .7, ease: 'power2.out' });
    tl.to(katana.position, { y: -VH * .9, duration: .7, ease: 'power2.in' }, '<');
    tl.add(() => { crow(T.crowOni(R.name)).then(() => { katana.position.y = VH; setPose('top', .9, 'back.out(1.2)').call(() => { busy = false; showResult(); }); }); }, '+=.2');
    return;
  }
  U.uProg.value = 1.06;
  if (R.key === 'none') { sfx('thud'); cap(T.capNone, 1.4); U.uGlow.value = 0; }
  else {
    sfx('ring'); flash(C.hex); U.uGlow.value = 0; U.uAura.value = 1.2; gsap.to(U.uAura, { value: .55, duration: 1.6 }); gsap.to(bgMat.uniforms.uMix, { value: 1, duration: 1 });
    emit(60, .5, 2.2); fxAdd(PFX && PFX.fx.burst, { x: 80, y: 80, seed: 3, palette: ramp(C.hex) });
    if (R.den >= 95 || R.key === 'black') fxAdd(PFX && PFX.fx.confetti, { x: 80, y: 60, seed: 11 });
    cap(C.name[L], 1.4);
  }
  // 色が決まったあと：そのまま握りしめ続けると赫く灼ける（キャラは作中で到達した人だけ、自動で）
  REV = { R, t: 0, hold: 0, done: false }; ST = 'reveal';
}
let REV = null;
function revealStep(dt) {
  const V = REV, R = V.R; V.t += dt;
  if (R.key === 'none') { if (V.t > 1.2) proceed(); return; }
  if (R.ch) { if (R.aka && !V.done && V.t > .7) { V.done = true; ignite(R); } if (V.t > (R.aka ? 2.2 : 1.2)) proceed(); return; }
  if (V.done) { if (V.t - V.doneAt > 1.4) proceed(); return; }
  if (holding) { V.hold += dt; shake = .02 + .05 * V.hold; if (V.hold > .5 && !V.hinted) { V.hinted = true; cap(T.keepHold); } humOn(); humSet(Math.min(1, .6 + V.hold / 3)); if (V.hold >= 1.8) { V.done = true; V.doneAt = V.t; humStop(); shake = 0; ignite(R); } }
  else { shake = 0; humStop(); if (V.t > 1.0) proceed(); }
}
function ignite(R) {
  R.akaDone = true; sfx('zap'); sfx('ring'); flash('#ff3a14'); cap(T.akaCap, 1.4);
  gsap.to(U.uTint.value, { r: 1, g: .09, b: .02, duration: .5 }); gsap.to(U.uAura, { value: 1.8, duration: .3 }); gsap.to(U.uAmt, { value: 1, duration: .3 });
  emit(80, .55, 2.6); fxAdd(PFX && PFX.fx.burst, { x: 80, y: 80, seed: 5, palette: ramp('#ff3a14') });
}
function proceed() {
  if (!REV) return; const R = REV.R; REV = null; ST = 'grip'; gsap.killTweensOf('#cap'); gsap.to('#cap', { opacity: 0, duration: .25 }); shake = 0; humStop(); holding = false; $('hold').classList.remove('on');
  const C = COLORS[R.key];
  document.documentElement.style.setProperty('--tint', R.key === 'none' ? '#8a8f96' : (R.key === 'white' ? '#9aa3ad' : C.hex));
  const say = R.key === 'none' ? T.crowNone(R.name) : T.crow(R.name, C.name[L], kokyu(R.key, R));
  const go = () => crow(say).then(() => { setPose('top', .9).call(() => { busy = false; showResult(); }); });
  // 才能のある人（90%以上）・ない人・鬼になる前の名前には、ここで「鬼にならないか」と誘いが来る
  const kind = humanOf(R.name, R.cn) ? 'hum' : R.key === 'none' ? 'none' : R.den >= 90 ? 'tal' : null; if (!kind) { go(); return; }
  setTimeout(() => oniInvite(L, kind).then(yes => { if (!yes) { go(); return; } oniAdd(R.name); makeOni(R); R.becameOni = true; try { if (typeof gtag === 'function') gtag('event', 'become_oni', { game: 'katana' }); } catch (e) { } turnOni(R).then(() => { busy = false; showResult(); }); }), 500);
}
// 鬼になる演出：刀が手からこぼれ落ち、画面が血の色にそまる
function turnOni(R) {
  return new Promise(res => {
    sfx('thud'); sfx('zap'); flash('#ff1030'); shake = .12; cap(oniText(L).done(R.name), 2.2);
    fxAdd(PFX && PFX.fx.burst, { x: 80, y: 80, seed: 9, palette: ramp('#ff1030') }); fxAdd(PFX && PFX.fx.burst, { x: 80, y: 60, seed: 21, palette: ramp('#5a0010') });
    gsap.to(U.uTint.value, { r: .55, g: .02, b: .06, duration: .5 }); gsap.to(U.uAura, { value: 2.2, duration: .3 }); gsap.to(bgMat.uniforms.uTint.value, { r: .7, g: .03, b: .08, duration: .6 }); gsap.to(bgMat.uniforms.uMix, { value: 1, duration: .6 });
    const tl = gsap.timeline();
    tl.to({}, { duration: .7, onUpdate() { shake = .12 * (1 - this.progress()); } });
    tl.to(katana.rotation, { z: '+=' + (Math.PI * 1.5), duration: .8, ease: 'power2.in' }); tl.to(katana.position, { y: -VH * .95, duration: .8, ease: 'power2.in' }, '<');
    tl.call(() => { sfx('thud'); flash('#ff1030'); shake = 0; }, null, '+=.05');
    tl.call(() => { katana.position.y = VH; setPose('top', .01); res(); }, null, '+=.9');
  });
}

// ---------- 伝令の烏 ----------
function crow(text) {
  // 烏は結果を告げたらとどまる。タップ（またはキー）で結果へ
  return new Promise(res => {
    const c = $('crow'), b = $('crowSay'); b.innerHTML = text + '<small>' + esc(T.tapNext) + '</small>'; b.style.opacity = 0; c.hidden = false; b.hidden = false; sfx('caw');
    let bob = null, done = false;
    const go = () => { if (done) return; done = true; removeEventListener('pointerdown', go); removeEventListener('keydown', go); if (bob) bob.kill(); gsap.to(b, { opacity: 0, duration: .15 }); gsap.to(c, { x: -innerWidth * .9, y: -innerHeight * .15, rotate: -15, duration: .45, ease: 'power2.in', onComplete: () => { c.hidden = true; b.hidden = true; res(); } }); };
    const tl = gsap.timeline();
    tl.fromTo(c, { x: innerWidth * .62, y: -innerHeight * .08, scale: .7, rotate: 18 }, { x: innerWidth * .22, y: innerHeight * .1, scale: 1, rotate: 0, duration: .7, ease: 'power2.out' });
    tl.fromTo(b, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .25 });
    tl.call(() => { bob = gsap.to(c, { y: '+=6', duration: .9, yoyo: true, repeat: -1, ease: 'sine.inOut' }); setTimeout(() => { if (!done) { addEventListener('pointerdown', go); addEventListener('keydown', go); } }, 400); });
  });
}

// ---------- 鬼の頸を斬る ----------
const oni = new THREE.Group(), oniHead = new THREE.Group(); scene.add(oni); oni.visible = false;
const oniMats = [];
function om(o) { const m = new THREE.MeshStandardMaterial(Object.assign({ transparent: true }, o)); m.userData.e0 = m.emissive.clone(); oniMats.push(m); return m; }
{
  const robe = new THREE.Mesh(new THREE.CylinderGeometry(.3, .62, 1.6, 20), om({ color: '#2a1630', roughness: .9 })); robe.position.y = -.4; oni.add(robe);
  const sash = new THREE.Mesh(new THREE.CylinderGeometry(.42, .44, .14, 20), om({ color: '#7a1020', roughness: .7 })); sash.position.y = -.25; oni.add(sash);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(.11, .14, .22, 12), om({ color: '#b7a7b2', roughness: .6 })); neck.position.y = .48; oni.add(neck);
  const skin = om({ color: '#c9b9c4', roughness: .55 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(.3, 24, 18), skin); head.scale.set(1, 1.12, .95); oniHead.add(head);
  const hornM = om({ color: '#e8dcc0', roughness: .4 });
  [-1, 1].forEach(sg => { const h = new THREE.Mesh(new THREE.ConeGeometry(.06, .3, 12), hornM); h.position.set(.15 * sg, .32, .02); h.rotation.z = -.35 * sg; oniHead.add(h);
    const e = new THREE.Mesh(new THREE.SphereGeometry(.045, 10, 8), om({ color: '#ff2030', emissive: '#ff1020', emissiveIntensity: 2.5 })); e.position.set(.11 * sg, .04, .26); oniHead.add(e); });
  const fang = om({ color: '#f4efe4' }); [-1, 1].forEach(sg => { const f = new THREE.Mesh(new THREE.ConeGeometry(.025, .09, 8), fang); f.rotation.x = Math.PI; f.position.set(.06 * sg, -.15, .25); oniHead.add(f); });
  const hair = new THREE.Mesh(new THREE.SphereGeometry(.32, 20, 12, 0, Math.PI * 2, 0, Math.PI * .55), om({ color: '#151018', roughness: .8 })); hair.position.y = .04; hair.rotation.x = -.25; oniHead.add(hair);
  oniHead.position.y = .82; oni.add(oniHead);
}
const ASH = 140, aGeo = new THREE.BufferGeometry(), aPos = new Float32Array(ASH * 3), aVel = new Float32Array(ASH * 3), aLife = new Float32Array(ASH);
aGeo.setAttribute('position', new THREE.BufferAttribute(aPos, 3));
const ash = new THREE.Points(aGeo, new THREE.PointsMaterial({ color: '#d27a4a', size: .05, transparent: true, opacity: .9, depthWrite: false, blending: THREE.AdditiveBlending })); ash.frustumCulled = false; scene.add(ash);
function ashBurst(p, n) { for (let k = 0, i = 0; k < ASH && i < n; k++) { if (aLife[k] > 0) continue; i++; aPos[k * 3] = p.x + (Math.random() - .5) * .6; aPos[k * 3 + 1] = p.y + (Math.random() - .5) * 1.4; aPos[k * 3 + 2] = p.z; aVel[k * 3] = (Math.random() - .3) * .5; aVel[k * 3 + 1] = .3 + Math.random() * .7; aVel[k * 3 + 2] = (Math.random() - .5) * .3; aLife[k] = 1 + Math.random(); } }
function stepAsh(dt) { let any = false; for (let k = 0; k < ASH; k++) { if (aLife[k] <= 0) { aPos[k * 3 + 1] = -99; continue; } any = true; aLife[k] -= dt * .7; aPos[k * 3] += aVel[k * 3] * dt; aPos[k * 3 + 1] += aVel[k * 3 + 1] * dt; aPos[k * 3 + 2] += aVel[k * 3 + 2] * dt; } aGeo.attributes.position.needsUpdate = true; }
function oniFade(v, d) { oniMats.forEach(m => gsap.to(m, { opacity: v, duration: d })); }
function slashLine(p, ok) {
  const v = p.clone().project(camera), sx = (v.x * .5 + .5) * innerWidth, sy = (-v.y * .5 + .5) * innerHeight, el = $('slash');
  el.style.left = sx + 'px'; el.style.top = sy + 'px'; el.style.background = ok ? '' : 'linear-gradient(90deg,#0000,#ffd27a,#0000)'; el.hidden = false;
  gsap.fromTo(el, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: .14, ease: 'power3.out' }); gsap.to(el, { opacity: 0, duration: .35, delay: .2, onComplete: () => { el.hidden = true; } });
}
function slash(R) {
  return new Promise(res => {
    const ok = R.key !== 'none' && R.den >= 30;
    const s = Math.min(.62, VH * .45 / LEN), ox = Math.min(VW * .24, 1.1);
    oni.visible = true; oni.position.set(ox, -.15, .3); oni.rotation.set(0, -.35, 0); oni.scale.setScalar(Math.min(1, VW / 2.6));
    oniHead.position.set(0, .82, 0); oniHead.rotation.set(0, 0, 0); oniMats.forEach(m => { m.opacity = 0; });
    const tl = gsap.timeline({ onComplete: res });
    tl.to(katana.position, { x: -ox * .9, y: .1, duration: .5, ease: 'power2.inOut' }, 0).to(katana.scale, { x: s, y: s, z: s, duration: .5 }, 0).to(katana.rotation, { z: 2.3, y: 0, x: 0, duration: .5, ease: 'power2.inOut' }, 0);
    tl.call(() => { oniFade(1, .4); sfx('growl'); }, null, .1);
    if (R.stab) { // 胡蝶しのぶ：頸は斬れない。突き刺して毒で倒す
      tl.to(katana.rotation, { z: .05, duration: .35, ease: 'power2.inOut' }, '+=.2');
      tl.to(katana.position, { x: -ox * 1.25, duration: .3, ease: 'power2.out' }, '<');
      tl.to(katana.position, { x: ox * .05, duration: .12, ease: 'power4.in' });
      tl.call(() => {
        sfx('cut'); flash('#b298dc'); cap(T.stab, 1.6); shake = .05; gsap.delayedCall(.2, () => { shake = 0; });
        oniMats.forEach(m => { if (m.emissive) gsap.to(m.emissive, { r: .45, g: .15, b: .7, duration: .6 }); });
        gsap.to(oni.rotation, { z: .06, duration: .08, yoyo: true, repeat: 9 });
        gsap.delayedCall(1.0, () => { const p = new THREE.Vector3(); oni.getWorldPosition(p); ashBurst(p, 120); oniFade(0, .8); });
      });
      tl.to({}, { duration: 1.9 });
      tl.call(() => { oni.visible = false; oniMats.forEach(m => { if (m.emissive && m.userData.e0) m.emissive.copy(m.userData.e0); }); });
      return;
    }
    tl.to({}, { duration: .55 });
    tl.to(katana.rotation, { z: -.55, duration: .16, ease: 'power4.in' });
    tl.to(katana.position, { x: ox * .2, duration: .16, ease: 'power4.in' }, '<');
    tl.call(() => {
      const neck = new THREE.Vector3(); oniHead.getWorldPosition(neck); neck.y -= .2;
      slashLine(neck, ok);
      if (ok) {
        sfx('cut'); shake = .08; gsap.to({}, { duration: .25, onComplete: () => { shake = 0; } }); cap(T.cut, 1.2);
        gsap.to(oniHead.position, { x: .9, y: 2.2, duration: .9, ease: 'power2.out' }); gsap.to(oniHead.rotation, { z: -4, x: 2, duration: .9 });
        gsap.delayedCall(.5, () => { const p = new THREE.Vector3(); oni.getWorldPosition(p); ashBurst(p, 120); oniFade(0, .8); });
      } else {
        sfx('clang'); shake = .05; gsap.to({}, { duration: .2, onComplete: () => { shake = 0; } }); cap(T.cutNo, 1.4);
        gsap.to(katana.rotation, { z: 1.2, duration: .35, ease: 'back.out(2)' }); gsap.to(katana.position, { x: -ox * .7, duration: .35 });
        gsap.to(oni.position, { x: ox + .15, duration: .1, yoyo: true, repeat: 3 }); gsap.delayedCall(.8, () => oniFade(0, .6));
      }
    });
    tl.to({}, { duration: 1.6 });
    tl.call(() => { oni.visible = false; });
  });
}
$('gl').addEventListener('pointerdown', e => { if (ST === 'hold' || ST === 'reveal') { e.preventDefault(); press(true); } });
$('hold').addEventListener('pointerdown', e => { e.preventDefault(); press(true); });
['pointerup', 'pointercancel', 'blur'].forEach(k => addEventListener(k, () => press(false)));
addEventListener('keydown', e => { if ((ST === 'hold' || ST === 'reveal') && (e.code === 'Space' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); press(true); } });
addEventListener('keyup', e => { if (e.code === 'Space' || e.key === 'Enter') press(false); });
document.addEventListener('visibilitychange', () => { if (document.hidden) press(false); });
function flash(hex) { const f = $('flash'); f.style.background = hex; gsap.fromTo(f, { opacity: .85 }, { opacity: 0, duration: .7, ease: 'power2.out' }); }

// ---------- 結果 ----------
function fillResult(R) {
  const C = COLORS[R.key], col = $('rCol');
  document.documentElement.style.setProperty('--tint', R.key === 'none' ? '#b9bec4' : C.hex);
  $('rWho').innerHTML = T.who(R.name);
  col.textContent = C.name[L]; col.style.background = C.hex; const lum = new THREE.Color(C.hex).getHSL({}).l; col.style.color = lum > .6 ? '#14131c' : '#fff';
  $('rSch').textContent = kokyu(R.key, R); $('rRank').innerHTML = esc(T.kyu + '：' + rankOf(R)) + (R.akaDone ? ' <span class="aka">' + esc(T.aka) + '</span>' : '');
  $('rDenL').textContent = T.den; $('rDenV').textContent = R.den + '%'; $('rDen').hidden = $('rBar').parentNode.hidden = R.key === 'nezuko';
  $('rWord').textContent = wordOf(R); $('rFan').textContent = T.fan; $('oniBtn').hidden = false; $('oniBtn').textContent = R.oni ? T.oniGo : T.oni;
  const ra = $('rArt'); ra.hidden = !R.oni; if (R.oni) { const o = R.oni, a = o.arts.map(w => locW(w, L)), sep = L === 'en' || L === 'ko' ? ': ' : '：'; ra.innerHTML = `<small>${esc(T.artL)}${o.as && o.as !== R.name ? '　' + esc(T.oniAs(oniNameL(o.as, L))) : ''}</small><b>${a.slice(0, 4).map(w => esc(w[1])).join('<br>')}${a.length > 4 ? '<i>' + esc(T.more(a.length - 4)) + '</i>' : ''}</b>${o.canon ? '' : `<p>${esc(a[0][2])}</p><em>${esc(T.tierL)}${sep}${esc((TIER[L] || TIER.en)[o.tier])}</em>`}`; if (R.becameOni) { $('rWho').innerHTML = T.whoOni(R.name); } }
  shareLine();
}
let COUNTS = null, countErr = false;
function shareLine() {
  const R = LAST; if (!R) return; const C = COLORS[R.key]; const parts = [];
  if (C.w) parts.push(T.odds(C.w >= 2 ? C.w.toFixed(C.w % 1 ? 1 : 0) : C.w));
  if (COUNTS) { const tot = Object.values(COUNTS).reduce((a, b) => a + (+b || 0), 0), n = +COUNTS[R.key] || 0; if (tot > 0) parts.push(T.share((n / tot * 100).toFixed(1), tot.toLocaleString())); }
  else parts.push(countErr ? T.shareErr : T.shareWait);
  $('rShare').innerHTML = parts.join('<br>');
}
function showResult() {
  const R = LAST; ST = 'result'; fillResult(R);
  $('result').hidden = false; $('result').scrollTop = 0;
  gsap.fromTo('#result .card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: 'power3.out' });
  gsap.fromTo('#rBar', { width: '0%' }, { width: R.den + '%', duration: 1.1, delay: .3, ease: 'power2.out' });
  gsap.fromTo('#rCol', { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .6, delay: .1, ease: 'back.out(2)' });
  R.card = makeCard(R);
  POST = R.key === 'none' ? T.postNone(R.name) : R.oni ? T.postOni(R.name, R.oni.arts.slice(0, 3).map(w => locW(w, L)[1]).join(L === 'en' ? ' / ' : '・') + (R.oni.arts.length > 3 ? T.more(R.oni.arts.length - 3) : ''), !!R.becameOni || !R.oni.canon) : R.key === 'nezuko' ? T.postNez(R.name) : T.post(R.name, COLORS[R.key].name[L], kokyu(R.key, R), rankOf(R), R.den); if (R.akaDone) POST = POST.replace('#色変わりの刀', T.akaPost + '\n#色変わりの刀');
  count(R).catch(() => { }).then(loadCounts).then(shareLine).catch(() => { });
}
$('startBtn').onclick = grip;
// 続編「無限鬼斬」へ：握る場面をとばして、技を選ぶところへ直行する（名前は同じサイトの中で受けわたす）
$('oniBtn').onclick = () => { const R = LAST; if (!R) return; ls.set('onikiri_go', { n: R.name, a: R.akaDone ? 1 : 0, o: R.oni ? 1 : 0, t: Date.now() }); try { if (typeof gtag === 'function') gtag('event', 'to_onikiri', { game: 'katana' }); } catch (e) { } location.href = '../onikiri/?go=1'; };
$('nm').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('nm').blur(); grip(); } });
$('again').onclick = () => { $('result').hidden = true; ST = 'title'; U.uProg.value = 0; U.uAura.value = 0; U.uAmt.value = 0; bgMat.uniforms.uMix.value = 0; $('title').hidden = false; $('title').scrollTop = 0; const n = $('nm'); n.value = ''; setTimeout(() => { try { n.focus(); } catch (e) { } }, 50); };

// ---------- みんなの結果（otokonoji の katana/n/色 を数える） ----------
const FB = { key: 'AIzaSyAcJgJLVbuvx85_qEGJe1WhwsOelidxeYk', db: 'https://otokonoji-default-rtdb.asia-southeast1.firebasedatabase.app' };
async function fx(url, opt) { let err; for (let i = 0; i < 3; i++) { try { return await fetch(url, opt); } catch (e) { err = e; await new Promise(r => setTimeout(r, 400 * (i + 1))); } } throw err; }
let AUTH = null;
async function auth() {
  let a = AUTH || ls.get('katana_auth', null); if (a && a.exp > Date.now() + 60000) return AUTH = a;
  if (a && a.refresh) { try { const r = await fx('https://securetoken.googleapis.com/v1/token?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(a.refresh) }); if (r.ok) { const j = await r.json(); a = { uid: j.user_id, token: j.id_token, refresh: j.refresh_token, exp: Date.now() + (+j.expires_in) * 1000 }; ls.set('katana_auth', a); return AUTH = a; } } catch (_) { } }
  const r = await fx('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
  if (!r.ok) throw new Error('auth'); const j = await r.json(); a = { uid: j.localId, token: j.idToken, refresh: j.refreshToken, exp: Date.now() + (+j.expiresIn) * 1000 }; ls.set('katana_auth', a); return AUTH = a;
}
const DBU = p => FB.db + '/katana/' + p + '.json';
// 同じ名前はこの端末で1回だけ数える
async function count(R) {
  if (DEV) return; const sent = ls.get('katana_sent', []); const h = Math.floor(hash(R.n, 0x5e) * 1e9).toString(36); if (sent.includes(h)) return;
  const a = await auth(), url = DBU('n/' + R.key) + '?auth=' + encodeURIComponent(a.token);
  for (let i = 0; i < 4; i++) {
    const g = await fx(url); if (!g.ok) throw new Error('get'); const v = +(await g.json()) || 0;
    const p = await fx(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v + 1) });
    if (p.ok) { sent.push(h); ls.set('katana_sent', sent.slice(-300)); return; }
    await new Promise(r => setTimeout(r, 150 + Math.random() * 300));
  }
  throw new Error('put');
}
async function loadCounts() { try { const r = await fx(DBU('n')); if (!r.ok) throw 0; COUNTS = (await r.json()) || {}; countErr = false; } catch (e) { countErr = true; } return COUNTS; }
async function openStats(from) {
  $('stats').dataset.from = from; $('title').hidden = true; $('result').hidden = true; $('stats').hidden = false; $('stats').scrollTop = 0;
  const box = $('stBox'); box.innerHTML = '<p class="note">' + T.loading + '</p>'; $('stNote').textContent = '';
  await loadCounts(); if ($('stats').hidden) return;
  if (!COUNTS) { box.innerHTML = '<p class="note err">' + T.shareErr + '</p>'; return; }
  const keys = [...ORDER, 'nezuko'], tot = keys.reduce((a, k) => a + (+COUNTS[k] || 0), 0);
  $('stNote').textContent = tot ? T.stNote(tot.toLocaleString()) : T.stEmpty;
  const rows = keys.map(k => ({ k, n: +COUNTS[k] || 0 })).filter(r => r.k !== 'nezuko' || r.n > 0).sort((a, b) => b.n - a.n || ORDER.indexOf(a.k) - ORDER.indexOf(b.k));
  const mx = Math.max(1, ...rows.map(r => r.n)), me = from === 'result' && LAST ? LAST.key : null;
  box.innerHTML = '<table class="st">' + rows.map(r => { const C = COLORS[r.k]; return `<tr${r.k === me ? ' class="me"' : ''}><td class="c"><i style="background:${C.hex}"></i></td><td>${esc(C.name[L])}${r.k === me ? ' <small style="color:var(--gold)">' + T.mine + '</small>' : ''}</td><td class="b"><span style="width:${(r.n / mx * 100).toFixed(1)}%;background:${C.hex}"></span></td><td class="p">${tot ? (r.n / tot * 100).toFixed(1) : '0.0'}%</td></tr>`; }).join('') + '</table>';
}
$('stBtn').onclick = () => openStats('title');
$('stBtn2').onclick = () => openStats('result');
$('stBack').onclick = () => { $('stats').hidden = true; if ($('stats').dataset.from === 'result' && LAST) $('result').hidden = false; else $('title').hidden = false; };

// ---------- 画像（結果カード） ----------
async function makeCard(R) {
  await new Promise(r => setTimeout(r, 1200)); // 刀が上に戻ってから写す
  const C = COLORS[R.key], W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const F = (s, w) => `${w || 800} ${s}px "Hiragino Mincho ProN","Yu Mincho","Noto Serif JP","Noto Serif CJK JP",serif`;
  const fit = (t, size, w, maxW) => { let z = size; x.font = F(z, w); while (z > 18 && x.measureText(t).width > maxW) { z -= 2; x.font = F(z, w); } };
  const wrap = (t, maxW) => { const out = []; let line = ''; for (const ch of t) { if (x.measureText(line + ch).width > maxW && line) { out.push(line); line = ch; } else line += ch; } if (line) out.push(line); return out; };
  x.fillStyle = '#0b0b12'; x.fillRect(0, 0, W, H);
  // 刀：画面の上のほう（刀がいる帯）を横長に切りとって、決まった枠に収める
  const g = $('gl'), gw0 = g.width, gh0 = g.height, BW = 1000, BH = 400;
  let sh = Math.min(gh0 * .36, gw0 / (BW / BH)), sw = sh * (BW / BH), sx = (gw0 - sw) / 2, sy = Math.max(0, gh0 * .19 - sh / 2);
  x.drawImage(g, sx, sy, sw, sh, (W - BW) / 2, 50, BW, BH);
  const fade = x.createLinearGradient(0, 330, 0, 470); fade.addColorStop(0, '#0b0b1200'); fade.addColorStop(1, '#0b0b12'); x.fillStyle = fade; x.fillRect(0, 330, W, 140);
  x.strokeStyle = '#c9a14a'; x.lineWidth = 3; x.strokeRect(22, 22, W - 44, H - 44); x.strokeStyle = '#c9a14a55'; x.strokeRect(34, 34, W - 68, H - 68);
  x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  const who = T.who(R.name).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  x.fillStyle = '#cfc6b3'; fit(who, 40, 600, W - 160); x.fillText(who, W / 2, 520);
  const cn = C.name[L]; fit(cn, 96, 800, W - 260); const tw = Math.min(W - 180, x.measureText(cn).width + 140);
  x.shadowColor = R.key === 'none' ? '#b9bec4' : C.hex; x.shadowBlur = 40; x.fillStyle = R.key === 'none' ? '#b9bec4' : C.hex; x.fillRect(W / 2 - tw / 2, 560, tw, 150); x.shadowBlur = 0; x.strokeStyle = '#ffffff55'; x.lineWidth = 2; x.strokeRect(W / 2 - tw / 2, 560, tw, 150);
  x.fillStyle = new THREE.Color(R.key === 'none' ? '#b9bec4' : C.hex).getHSL({}).l > .6 ? '#14131c' : '#ffffff'; x.fillText(cn, W / 2, 668);
  x.fillStyle = '#f2ead6'; fit(kokyu(R.key, R), 52, 800, W - 160); x.fillText(kokyu(R.key, R), W / 2, 790);
  x.fillStyle = '#c9a14a'; const rk = T.kyu + '：' + rankOf(R); fit(rk, 38, 700, W - 160); x.fillText(rk, W / 2, 850);
  let y = 900;
  if (R.akaDone) { x.fillStyle = '#ff5a3a'; fit('◆ ' + T.aka + ' ◆', 32, 700, W - 160); x.fillText('◆ ' + T.aka + ' ◆', W / 2, y); y += 40; }
  if (R.key !== 'nezuko') {
    const bw = 640; x.fillStyle = '#1b1a24'; x.fillRect(W / 2 - bw / 2, y, bw, 18); x.fillStyle = R.key === 'none' ? '#b9bec4' : C.hex; x.fillRect(W / 2 - bw / 2, y, bw * R.den / 100, 18);
    x.fillStyle = '#cfc6b3'; x.font = F(30, 600); x.fillText(T.den + '  ' + R.den + '%', W / 2, y + 62); y += 130;
  } else { y += 40; if (R.oni) { const an = R.oni.arts.slice(0, 2).map(w => locW(w, L)[1]).join(L === 'en' ? ' / ' : '・') + (R.oni.arts.length > 2 ? T.more(R.oni.arts.length - 2) : ''); x.fillStyle = '#ff8a8a'; x.font = F(30, 700); x.fillText(T.artL, W / 2, y); x.fillStyle = '#ffffff'; x.shadowColor = '#ff1030'; x.shadowBlur = 26; fit(an, 60, 900, W - 160); x.fillText(an, W / 2, y + 76); x.shadowBlur = 0; y += 150; } }
  x.fillStyle = '#f2ead6'; x.font = F(40, 600); wrap(wordOf(R), W - 180).slice(0, 3).forEach((l, i) => x.fillText(l, W / 2, y + i * 58));
  x.fillStyle = '#6d6680'; x.font = F(24, 600); x.fillText(T.fan, W / 2, H - 150);
  x.fillStyle = '#c9a14a'; x.font = F(48); x.fillText(T.ttl, W / 2, H - 92); x.fillStyle = '#9a93a8'; x.font = '600 28px ui-monospace,Menlo,monospace'; x.fillText('nasubi-no-oniwa.com/katana', W / 2, H - 52);
  return await new Promise(r => c.toBlob(b => r(b), 'image/png'));
}

// ---------- Xに投稿（自分の紹介ツイートを引用する。引用するツイートは一覧ページ quote/ で切りかえ） ----------
let POST = '', QUOTE = {};
fetch('https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/xquote/g/katana.json').then(r => r.json()).then(d => { if (d && typeof d === 'object') QUOTE = d; }).catch(() => { });
function quoteURL() { const u = (L === 'ja' ? QUOTE.ja : QUOTE.en) || ''; return /^https:\/\/x\.com\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}$/.test(u) ? u : ''; }
const cardFile = b => new File([b], 'katana.png', { type: 'image/png' });
function saveBlob(b, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name || 'katana.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); }
let toastT = 0; function toast(m) { const t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 7000); }
$('xBtn').addEventListener('click', async () => {
  const R = LAST; if (!R) return; const q = quoteURL(); let b = null; try { b = await R.card; } catch (e) { }
  if (b && IS_PHONE && navigator.canShare) { const f = cardFile(b); try { if (navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: POST + (q ? '\n' + q : '') }); try { if (typeof gtag === 'function') gtag('event', 'x_share', { game: 'katana', via: 'sheet' }); } catch (e) { } return; } } catch (e) { if (e && e.name === 'AbortError') return; } }
  let how = 0; if (b) { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]); how = 1; } catch (e) { if (!IS_PHONE) { try { saveBlob(b); how = 2; } catch (_) { } } } }
  if (how) toast(how === 1 ? T.xCopied : T.xSaved);
  const u = 'https://x.com/intent/post?text=' + encodeURIComponent(POST) + (q ? '&url=' + encodeURIComponent(q) : ''); const w = window.open(u, '_blank'); if (!w) location.href = u;
});
$('imgBtn').addEventListener('click', async () => {
  const R = LAST; if (!R) return; let b = null; try { b = await R.card; } catch (e) { } if (!b) return; const f = cardFile(b);
  try { if (IS_PHONE && navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  saveBlob(b);
});

// ---------- 起動 ----------
if (FAST) gsap.globalTimeline.timeScale(6);
setLang(pickLang());
$('nm').value = ls.get('katana_name', '');
resize(); setPose('top', 0);
ST = 'title'; $('load').hidden = true; $('title').hidden = false;
gsap.fromTo('#title .card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' });
requestAnimationFrame(frame);
if (DEV) window.__K = { judge, norm, grip, get LAST() { return LAST; }, get ST() { return ST; }, COLORS, U, bladeMat, scene, press, card: async () => { const b = await LAST.card; return await new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result); f.readAsDataURL(b); }); }, setName(n) { $('nm').value = n; }, count, loadCounts, show(k, den, rz, sc, x, y) { ST = 'shot'; ['title', 'result', 'stats'].forEach(i => $(i).hidden = true); U.uTint.value.set(COLORS[k].hex); bgMat.uniforms.uTint.value.set(COLORS[k].hex); bgMat.uniforms.uMix.value = 1; U.uAmt.value = .55 + .45 * den / 100; U.uProg.value = 1.06; U.uAura.value = .6; U.uGlow.value = 0; katana.rotation.set(0, 0, rz); katana.scale.setScalar(sc); katana.position.set(x, y, 0); } };
