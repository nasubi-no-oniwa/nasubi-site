import { THREE, GLTFLoader } from './lib.js?v=11272140';
import { COLORS, CHARS, ORDER } from './data.js?v=11272140';
import { WAZA, desc, unlocked, CHAR_WAZA, CHAR_CAP } from './waza.js?v=11272140';
import { renderer, gripFrame, gripStart, gripOnDone, gripReset, gripLang, gripSnd, gripInvite, fxAdd, ramp } from './grip.js?v=11272140';
import { makeFx, STY } from './fx.js?v=11272140';
import { makeRig, toon, part, OUT, OUTN, vtoon, withOut } from './rig.js?v=11272140';
import { ONI_STY, ONI_TITLES, TIER, oniInfo, humanOf, oniHas, oniAdd , genNameL } from './oni.js?v=11272140';
import { locW, descL, nameL, oniNameL } from './i18n.js?v=11272140';
import { OT_STY, ETC, varNorm, otherOf, otherByName, otName, otSch, otWork } from './others.js?v=11272140';
Object.assign(STY, ONI_STY, OT_STY); COLORS.etc = ETC; COLORS.oni = { hex: '#b3122a', name: { ja: '鬼', en: 'Demon', zh: '鬼', ko: '귀신' }, kokyu: { ja: '血鬼術', en: 'Blood Demon Art', zh: '血鬼術', ko: '혈귀술' } };
const $ = id => document.getElementById(id);
const gsap = window.gsap, PFX = window.PFX;
const DEV = /[?&]dev=1/.test(location.search);
const IS_PHONE = /iPhone|iPod|iPad|Android/i.test(navigator.userAgent || '');
const ls = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---------- ことば ----------
const TX = {
  ja: { lang: '日本語', ttl: '無限鬼斬', h1: '<small>むげんおにきり</small>無限鬼斬', lead: '名前で決まる日輪刀で、鬼を斬って走れ。<br>斬るほど刃こぼれする。どこまで行けるか。', ph: '名前を入れる', start: '日輪刀を握る', needName: '名前を入れてください', sndOn: '🔊 音あり', sndOff: '🔇 音なし', rank: 'ランキング', prev: '刀の色を見る（前作）',
    hold: '長押しで握る', keep: 'そのまま握りしめると…？', aka: '赫く灼けた', isOni: '鬼なので、日輪刀を握れなかった', who: n => `「<b>${esc(n)}</b>」の日輪刀`, den: '才能', sharpInfo: (c, m) => `鬼を${Math.max(1, Math.floor(m / c))}体斬ると刃こぼれ`, akaInfo: '赫刀：刃こぼれしにくい',
    noWaza: '呼吸の適性なし。技は使えない。よけて、斬って、進め。', pick1: n => `持っていく技を1つ選ぶ（${n}個が使える）`, pick2: n => `持っていく技を2つ選ぶ（${n}個が使える）`, lockAt: p => `才能${p}%から`, go: '出陣', back: 'もどる',
    how: '・画面の左側／右側をタップ、または指を横にスライドでレーン移動（PCは ← →）<br>・鬼のレーンに入ると斬る。斬るほど刃こぼれし、斬らずにいると戻る<br>・切れ味がないまま鬼に当たるか、障害物に当たると終わり<br>・オーラのある鬼は固い。斬ると10体分の切れ味を一気に失う<br>・右下の丸がたまったら押して技（PCはスペース）', how2: '・2つの丸はスワイプで切りかえ（PCは ↑）',
    sharp: '切れ味', kills: n => `鬼 ${n}体`, why: { dull: '刃こぼれで、斬れなかった', obs: '障害物にぶつかった' }, rInfo: (R, k, wz) => `「<b>${esc(R.name)}</b>」の日輪刀<br>${R.kk}・才能 <b>${R.den}%</b>${R.akaDone ? '<span class="aka">赫刀</span>' : ''}<br>斬った鬼 <b>${k}</b>体${wz ? '<br>技：' + esc(wz) : ''}`,
    best: d => `自己ベスト ${d.toLocaleString()}m`, newBest: '自己ベスト更新！', again: 'もう一度走る', repick: '技を選びなおす', rename: '名前を変える', x: '𝕏 に投稿', img: '画像にする', xCopied: '画像をコピーしました。Xの投稿欄に貼りつけ（Ctrl+V）すると画像がつきます', xSaved: '画像を保存しました。Xの投稿に、保存した画像を追加してください', hintL: 'タップで左へ', hintR: 'タップで右へ', hintS: '指を横にスライドでも動ける', wzTip: '押して技！', fan: '※非公式のファンゲームです',
    post: (R, d, k) => `「${R.name}」の日輪刀（${R.kk}・才能${R.den}%${R.akaDone ? '・赫刀' : ''}）で ${d.toLocaleString()}m 走り、鬼を${k}体斬った。\n#無限鬼斬 #ブラウザゲーム\nhttps://nasubi-no-oniwa.com/onikiri/`,
    rkAll: '全体', rkToday: '今日', rkNone: '才能なし', rkOni: '鬼', howO: '・画面の左側／右側をタップ、または指を横にスライドでレーン移動（PCは ← →）<br>・隊士のレーンに入ると倒す。そのたびに斬られて再生力が減り、斬られずにいると戻る<br>・再生力がないまま隊士に当たるか、障害物に当たると終わり<br>・オーラのある隊士は手ごわい。倒すと10人分の再生力を一気に失う<br>・赤い小瓶（稀血）を拾うと再生力が戻る<br>・右下の丸がたまったら押して血鬼術（PCはスペース）', regen: '再生力', killsO: n => `隊士 ${n}人`, whoOni: n => `「<b>${esc(n)}</b>」は、鬼`, oniAs: n => `鬼としての名：<b style="color:#fff">${esc(n)}</b>`, oniTier: t => `血鬼術の強さ：<b style="color:#fff">${t}</b>`, regenInfo: (c, m) => `隊士に${Math.max(1, Math.floor(m / c))}回斬られるまで耐える（斬られずにいると戻る）`, pickO1: n => n > 1 ? `血鬼術を1つ選ぶ（${n}個）` : 'この鬼の血鬼術', pickO2: n => `血鬼術を2つ選ぶ（${n}個）`, whyO: { dull: '再生が追いつかず、頸を斬られた', obs: '障害物に足を取られ、頸を斬られた' }, loadM: '鬼の体を作っています…',
    rInfoO: (R, k, wz) => `「<b>${esc(R.name)}</b>」は、鬼${R.oni.as && R.oni.as !== R.name ? '（' + esc(oniNameL(R.oni.as, L)) + '）' : ''}<br>血鬼術：<b>${esc(wz)}</b><br>倒した隊士 <b>${k}</b>人`, postO: (R, d, k, wz) => `「${R.name}」は鬼になった。\n血鬼術「${wz}」で ${d.toLocaleString()}m 走り、隊士を${k}人倒した。\n#無限鬼斬 #ブラウザゲーム\nhttps://nasubi-no-oniwa.com/onikiri/`, rkNote: '名前1つにつき1件（その名前でいちばん走った記録）・上位100', loading: '読みこみ中…', rkErr: '読みこめませんでした', rkEmpty: 'まだ記録がありません', nogl: 'この端末では3Dを表示できませんでした', capCol: (c, k) => `${c}　${k}`,
    tr: 'トレーニング場', trZone: v => '当たり判定：' + (v ? '表示' : '非表示'), trMove: v => '動き：' + (v ? '走る' : '止まる'), trHelpRun: '走りながら技を出す。タップ／スライドでレーン移動', trHelpStop: '止まって技を出す。画面をなぞると360度まわせる（2本指で近づく・はなれる）。タップでレーン移動', trBusy: '技が終わってから', trAuto: v => '自動で連続：' + (v ? 'オン' : 'オフ'), trHelpAuto: '自動で技を出しつづける。画面をなぞると360度まわせる（2本指で近づく・はなれる）。タップでレーン移動',
    akaS: '赫刀', cardO: as => '鬼' + (as ? '・' + as : '') + '・血鬼術', sepW: '、' },
  en: { lang: 'English', ttl: 'MUGEN ONIKIRI', h1: '<small>MUGEN ONIKIRI</small>無限鬼斬', lead: 'Your name decides your Nichirin Blade.<br>Run, slash demons, and mind the chipping edge.', ph: 'Enter a name', start: 'Grip the blade', needName: 'Please enter a name', sndOn: '🔊 Sound on', sndOff: '🔇 Sound off', rank: 'Ranking', prev: 'See your blade color',
    hold: 'Hold to grip', keep: 'Keep holding…?', aka: 'The blade burns crimson', isOni: "You're a demon. The blade won't let you hold it", who: n => `<b>${esc(n)}</b>'s Nichirin Blade`, den: 'Talent', sharpInfo: (c, m) => c < .2 ? 'Never chips' : `Chips out after ${Math.max(1, Math.floor(m / c))} demons`, akaInfo: 'Crimson blade: chips slower',
    noWaza: 'No breathing aptitude. No techniques. Dodge, slash, keep going.', pick1: n => `Pick 1 technique (${n} unlocked)`, pick2: n => `Pick 2 techniques (${n} unlocked)`, lockAt: p => `Talent ${p}%+`, go: 'Go', back: 'Back',
    how: '・Tap the left / right side, or slide your finger sideways, to change lanes (PC: ← →)<br>・Enter a demon\'s lane to slash it. Slashing chips the blade; it recovers while you rest<br>・Hit a demon with no edge left, or any obstacle, and it\'s over<br>・Demons with an aura are tough: cutting one costs 10 demons\' worth of edge<br>・When the circle fills, tap it for your technique (PC: Space)', how2: '・Swipe the circles to switch (PC: ↑)',
    sharp: 'Edge', kills: n => `${n} demons`, why: { dull: 'The chipped blade could not cut', obs: 'Hit an obstacle' }, rInfo: (R, k, wz) => `<b>${esc(R.name)}</b>'s Nichirin Blade<br>${R.kk} · Talent <b>${R.den}%</b>${R.akaDone ? '<span class="aka">Crimson</span>' : ''}<br>Demons slain: <b>${k}</b>${wz ? '<br>Technique: ' + esc(wz) : ''}`,
    best: d => `Best ${d.toLocaleString()}m`, newBest: 'New best!', again: 'Run again', repick: 'Change technique', rename: 'Change name', x: 'Post on 𝕏', img: 'Save image', xCopied: 'Image copied. Paste it (Ctrl+V) into your post to attach it', xSaved: 'Image saved. Add the saved image to your post', hintL: 'Tap: left', hintR: 'Tap: right', hintS: 'Sliding sideways works too', wzTip: 'Tap!', fan: '※Unofficial fan game',
    post: (R, d, k) => `"${R.name}"'s Nichirin Blade (${R.kk}, talent ${R.den}%${R.akaDone ? ', crimson' : ''}) ran ${d.toLocaleString()}m and slew ${k} demons.\n#無限鬼斬 #ブラウザゲーム\nhttps://nasubi-no-oniwa.com/onikiri/`,
    rkAll: 'All', rkToday: 'Today', rkNone: 'No talent', rkOni: 'Demons', howO: '・Tap the left / right side, or slide your finger sideways, to change lanes (PC: ← →)<br>・Enter a slayer\'s lane to take them down. Each one cuts you and drains regeneration; it recovers when you are not cut<br>・Hitting a slayer with no regeneration left, or any obstacle, ends the run<br>・Slayers with an aura are tough: taking one down costs 10 slayers\' worth of regeneration<br>・Red vials (rare blood) restore regeneration<br>・When the circle fills, press it for your Blood Demon Art (PC: Space)', regen: 'Regeneration', killsO: n => `${n} slayers`, whoOni: n => `<b>${esc(n)}</b> is a demon`, oniAs: n => `Demon name: <b style="color:#fff">${esc(n)}</b>`, oniTier: t => `Art strength: <b style="color:#fff">${t}</b>`, regenInfo: (c, m) => `Survives ${Math.max(1, Math.floor(m / c))} cuts from slayers (recovers when not cut)`, pickO1: n => n > 1 ? `Choose 1 art (${n})` : "This demon's art", pickO2: n => `Choose 2 arts (${n})`, whyO: { dull: 'Regeneration could not keep up', obs: 'Tripped on an obstacle and was beheaded' }, loadM: 'Shaping the demon…',
    rInfoO: (R, k, wz) => `<b>${esc(R.name)}</b> is a demon${R.oni.as && R.oni.as !== R.name ? ' (' + esc(oniNameL(R.oni.as, L)) + ')' : ''}<br>Blood Demon Art: <b>${esc(wz)}</b><br>Slayers defeated: <b>${k}</b>`, postO: (R, d, k, wz) => `${R.name} became a demon.\nRan ${d.toLocaleString()}m with the Blood Demon Art "${wz}" and defeated ${k} slayers.\n#無限鬼斬 #ブラウザゲーム\nhttps://nasubi-no-oniwa.com/onikiri/`, rkNote: 'One entry per name (its best run). Top 100', loading: 'Loading…', rkErr: 'Could not load', rkEmpty: 'No records yet', nogl: "This device can't show 3D", capCol: (c, k) => `${c}  ${k}`,
    tr: 'Training Ground', trZone: v => 'Hit area: ' + (v ? 'shown' : 'hidden'), trMove: v => 'Mode: ' + (v ? 'running' : 'standing'), trHelpRun: 'Use techniques while running. Tap / slide to change lanes', trHelpStop: 'Use techniques while standing. Drag to rotate 360° (pinch to zoom). Tap to change lanes', trBusy: 'Wait until the technique ends', trAuto: v => 'Auto-repeat: ' + (v ? 'on' : 'off'), trHelpAuto: 'The technique repeats automatically. Drag to rotate 360° (pinch to zoom). Tap to change lanes',
    akaS: 'Crimson', cardO: as => 'Demon' + (as ? ' · ' + as : '') + ' · Blood Demon Art', sepW: ', ' },
  zh: { lang: '繁體中文', ttl: '無限鬼斬', h1: '<small>MUGEN ONIKIRI</small>無限鬼斬', lead: '以名字決定的日輪刀，邊跑邊斬鬼。<br>斬得越多刀刃越鈍。你能跑多遠？', ph: '輸入名字', start: '握住日輪刀', needName: '請輸入名字', sndOn: '🔊 有聲音', sndOff: '🔇 靜音', rank: '排行榜', prev: '看看刀的顏色（前作）',
    hold: '長按握住', keep: '就這樣繼續緊握的話…？', aka: '燒成了赫紅', isOni: '因為是鬼，握不住日輪刀', who: n => `「<b>${esc(n)}</b>」的日輪刀`, den: '才能', sharpInfo: (c, m) => c < .2 ? '不會捲刃' : `斬${Math.max(1, Math.floor(m / c))}隻鬼就會捲刃`, akaInfo: '赫刀：不容易捲刃',
    noWaza: '沒有呼吸的適性，無法使用招式。閃避、斬擊、前進。', pick1: n => `選1個要帶的招式（可用${n}個）`, pick2: n => `選2個要帶的招式（可用${n}個）`, lockAt: p => `才能${p}%起`, go: '出陣', back: '返回',
    how: '・點擊畫面左側／右側，或手指橫向滑動來換跑道（電腦為 ← →）<br>・進入鬼所在的跑道就會斬擊。斬得越多刀刃越鈍，不斬的時候會恢復<br>・在沒有鋒利度的狀態下撞到鬼，或撞到障礙物就結束<br>・有氣場的鬼很硬，斬了會一口氣失去10隻份的鋒利度<br>・右下的圓圈集滿後按下就能使出招式（電腦為空白鍵）', how2: '・2個圓圈可滑動切換（電腦為 ↑）',
    sharp: '鋒利度', kills: n => `鬼 ${n}隻`, why: { dull: '刀刃捲了，斬不下去', obs: '撞上了障礙物' }, rInfo: (R, k, wz) => `「<b>${esc(R.name)}</b>」的日輪刀<br>${R.kk}・才能 <b>${R.den}%</b>${R.akaDone ? '<span class="aka">赫刀</span>' : ''}<br>斬殺的鬼 <b>${k}</b>隻${wz ? '<br>招式：' + esc(wz) : ''}`,
    best: d => `個人最佳 ${d.toLocaleString()}m`, newBest: '刷新個人最佳！', again: '再跑一次', repick: '重選招式', rename: '換名字', x: '發佈到 𝕏', img: '做成圖片', xCopied: '已複製圖片。在 X 的發文欄貼上（Ctrl+V）就能附上圖片', xSaved: '已儲存圖片。請在 X 的貼文中加入儲存的圖片', hintL: '點擊往左', hintR: '點擊往右', hintS: '手指橫向滑動也能移動', wzTip: '按下使出招式！', fan: '※這是非官方的粉絲遊戲',
    post: (R, d, k) => `用「${R.name}」的日輪刀（${R.kk}・才能${R.den}%${R.akaDone ? '・赫刀' : ''}）跑了 ${d.toLocaleString()}m，斬了${k}隻鬼。\n#無限鬼斬 #ブラウザゲーム\nhttps://nasubi-no-oniwa.com/onikiri/`,
    rkAll: '全體', rkToday: '今天', rkNone: '沒有才能', rkOni: '鬼', howO: '・點擊畫面左側／右側，或手指橫向滑動來換跑道（電腦為 ← →）<br>・進入隊士所在的跑道就會打倒對方。每次都會被砍而減少再生力，沒被砍的時候會恢復<br>・在沒有再生力的狀態下撞到隊士，或撞到障礙物就結束<br>・有氣場的隊士很難纏，打倒會一口氣失去10人份的再生力<br>・撿到紅色小瓶（稀血）就能恢復再生力<br>・右下的圓圈集滿後按下就能使出血鬼術（電腦為空白鍵）', regen: '再生力', killsO: n => `隊士 ${n}人`, whoOni: n => `「<b>${esc(n)}</b>」是鬼`, oniAs: n => `作為鬼的名字：<b style="color:#fff">${esc(n)}</b>`, oniTier: t => `血鬼術的強度：<b style="color:#fff">${t}</b>`, regenInfo: (c, m) => `能承受隊士${Math.max(1, Math.floor(m / c))}次斬擊（沒被砍的時候會恢復）`, pickO1: n => n > 1 ? `選1個血鬼術（${n}個）` : '這隻鬼的血鬼術', pickO2: n => `選2個血鬼術（${n}個）`, whyO: { dull: '再生跟不上，被斬下了頸項', obs: '被障礙物絆住，被斬下了頸項' }, loadM: '正在製作鬼的身體…',
    rInfoO: (R, k, wz) => `「<b>${esc(R.name)}</b>」是鬼${R.oni.as && R.oni.as !== R.name ? '（' + esc(oniNameL(R.oni.as, L)) + '）' : ''}<br>血鬼術：<b>${esc(wz)}</b><br>打倒的隊士 <b>${k}</b>人`, postO: (R, d, k, wz) => `「${R.name}」成為了鬼。\n以血鬼術「${wz}」跑了 ${d.toLocaleString()}m，打倒了${k}名隊士。\n#無限鬼斬 #ブラウザゲーム\nhttps://nasubi-no-oniwa.com/onikiri/`, rkNote: '每個名字1筆（該名字跑得最遠的紀錄）・前100名', loading: '讀取中…', rkErr: '無法讀取', rkEmpty: '還沒有紀錄', nogl: '這台裝置無法顯示3D', capCol: (c, k) => `${c}　${k}`,
    tr: '訓練場', trZone: v => '攻擊判定：' + (v ? '顯示' : '隱藏'), trMove: v => '動作：' + (v ? '奔跑' : '靜止'), trHelpRun: '邊跑邊使出招式。點擊／滑動來換跑道', trHelpStop: '站著使出招式。滑動畫面可旋轉360度（雙指縮放）。點擊來換跑道', trBusy: '請等招式結束', trAuto: v => '自動連發：' + (v ? '開' : '關'), trHelpAuto: '自動不斷使出招式。滑動畫面可旋轉360度（雙指縮放）。點擊來換跑道',
    akaS: '赫刀', cardO: as => '鬼' + (as ? '・' + as : '') + '・血鬼術', sepW: '、' },
  ko: { lang: '한국어', ttl: '무한 귀신 베기', h1: '<small>MUGEN ONIKIRI</small>無限鬼斬', lead: '이름으로 정해지는 일륜도로 귀신을 베며 달려라.<br>벨수록 칼날이 무뎌진다. 어디까지 갈 수 있을까.', ph: '이름을 입력', start: '일륜도를 쥔다', needName: '이름을 입력해 주세요', sndOn: '🔊 소리 켬', sndOff: '🔇 소리 끔', rank: '랭킹', prev: '칼의 색 보기(전작)',
    hold: '길게 눌러 쥐기', keep: '그대로 꽉 쥐고 있으면…?', aka: '붉게 달아올랐다', isOni: '귀신이라 일륜도를 쥘 수 없었다', who: n => `「<b>${esc(n)}</b>」의 일륜도`, den: '재능', sharpInfo: (c, m) => c < .2 ? '이가 빠지지 않는다' : `귀신을 ${Math.max(1, Math.floor(m / c))}마리 베면 이가 빠진다`, akaInfo: '혁도: 이가 잘 빠지지 않는다',
    noWaza: '호흡의 적성 없음. 기술은 쓸 수 없다. 피하고, 베고, 나아가라.', pick1: n => `가져갈 기술을 1개 고른다(${n}개 사용 가능)`, pick2: n => `가져갈 기술을 2개 고른다(${n}개 사용 가능)`, lockAt: p => `재능 ${p}%부터`, go: '출진', back: '돌아가기',
    how: '・화면 왼쪽/오른쪽을 탭하거나 손가락을 옆으로 밀어 레인 이동(PC는 ← →)<br>・귀신이 있는 레인에 들어가면 벤다. 벨수록 칼날이 무뎌지고, 베지 않으면 회복된다<br>・예리함이 없는 채로 귀신에 부딪히거나 장애물에 부딪히면 끝<br>・오라가 있는 귀신은 단단하다. 베면 10마리분의 예리함을 한 번에 잃는다<br>・오른쪽 아래 원이 차면 눌러서 기술(PC는 스페이스)', how2: '・두 원은 스와이프로 전환(PC는 ↑)',
    sharp: '예리함', kills: n => `귀신 ${n}마리`, why: { dull: '이가 빠져 벨 수 없었다', obs: '장애물에 부딪혔다' }, rInfo: (R, k, wz) => `「<b>${esc(R.name)}</b>」의 일륜도<br>${R.kk}・재능 <b>${R.den}%</b>${R.akaDone ? '<span class="aka">혁도</span>' : ''}<br>벤 귀신 <b>${k}</b>마리${wz ? '<br>기술: ' + esc(wz) : ''}`,
    best: d => `자기 최고 ${d.toLocaleString()}m`, newBest: '자기 최고 기록 갱신!', again: '다시 달리기', repick: '기술 다시 고르기', rename: '이름 바꾸기', x: '𝕏에 올리기', img: '이미지로 만들기', xCopied: '이미지를 복사했습니다. X 게시란에 붙여넣기(Ctrl+V)하면 이미지가 첨부됩니다', xSaved: '이미지를 저장했습니다. X 게시물에 저장한 이미지를 추가해 주세요', hintL: '탭하면 왼쪽', hintR: '탭하면 오른쪽', hintS: '손가락을 옆으로 밀어도 움직인다', wzTip: '눌러서 기술!', fan: '※비공식 팬 게임입니다',
    post: (R, d, k) => `「${R.name}」의 일륜도(${R.kk}・재능 ${R.den}%${R.akaDone ? '・혁도' : ''})로 ${d.toLocaleString()}m를 달려 귀신을 ${k}마리 벴다.\n#無限鬼斬 #ブラウザゲーム\nhttps://nasubi-no-oniwa.com/onikiri/`,
    rkAll: '전체', rkToday: '오늘', rkNone: '재능 없음', rkOni: '귀신', howO: '・화면 왼쪽/오른쪽을 탭하거나 손가락을 옆으로 밀어 레인 이동(PC는 ← →)<br>・대원이 있는 레인에 들어가면 쓰러뜨린다. 그때마다 베여서 재생력이 줄고, 베이지 않으면 회복된다<br>・재생력이 없는 채로 대원에 부딪히거나 장애물에 부딪히면 끝<br>・오라가 있는 대원은 만만치 않다. 쓰러뜨리면 10명분의 재생력을 한 번에 잃는다<br>・붉은 작은 병(희귀혈)을 주우면 재생력이 회복된다<br>・오른쪽 아래 원이 차면 눌러서 혈귀술(PC는 스페이스)', regen: '재생력', killsO: n => `대원 ${n}명`, whoOni: n => `「<b>${esc(n)}</b>」은(는) 귀신`, oniAs: n => `귀신으로서의 이름: <b style="color:#fff">${esc(n)}</b>`, oniTier: t => `혈귀술의 강함: <b style="color:#fff">${t}</b>`, regenInfo: (c, m) => `대원에게 ${Math.max(1, Math.floor(m / c))}번 베일 때까지 버틴다(베이지 않으면 회복된다)`, pickO1: n => n > 1 ? `혈귀술을 1개 고른다(${n}개)` : '이 귀신의 혈귀술', pickO2: n => `혈귀술을 2개 고른다(${n}개)`, whyO: { dull: '재생이 따라가지 못해 목이 베였다', obs: '장애물에 발이 걸려 목이 베였다' }, loadM: '귀신의 몸을 만드는 중…',
    rInfoO: (R, k, wz) => `「<b>${esc(R.name)}</b>」은(는) 귀신${R.oni.as && R.oni.as !== R.name ? '(' + esc(oniNameL(R.oni.as, L)) + ')' : ''}<br>혈귀술: <b>${esc(wz)}</b><br>쓰러뜨린 대원 <b>${k}</b>명`, postO: (R, d, k, wz) => `「${R.name}」은(는) 귀신이 되었다.\n혈귀술 「${wz}」(으)로 ${d.toLocaleString()}m를 달려 대원을 ${k}명 쓰러뜨렸다.\n#無限鬼斬 #ブラウザゲーム\nhttps://nasubi-no-oniwa.com/onikiri/`, rkNote: '이름 하나당 1건(그 이름으로 가장 멀리 달린 기록)・상위 100', loading: '불러오는 중…', rkErr: '불러올 수 없었습니다', rkEmpty: '아직 기록이 없습니다', nogl: '이 기기에서는 3D를 표시할 수 없었습니다', capCol: (c, k) => `${c}　${k}`,
    tr: '훈련장', trZone: v => '타격 판정: ' + (v ? '표시' : '숨김'), trMove: v => '움직임: ' + (v ? '달리기' : '멈춤'), trHelpRun: '달리면서 기술을 쓴다. 탭/슬라이드로 레인 이동', trHelpStop: '멈춰서 기술을 쓴다. 화면을 문지르면 360도 돌릴 수 있다(두 손가락으로 확대·축소). 탭으로 레인 이동', trBusy: '기술이 끝난 뒤에', trAuto: v => '자동 연속: ' + (v ? '켬' : '끔'), trHelpAuto: '자동으로 기술을 계속 쓴다. 화면을 문지르면 360도 돌릴 수 있다(두 손가락으로 확대·축소). 탭으로 레인 이동',
    akaS: '혁도', cardO: as => '귀신' + (as ? '・' + as : '') + '・혈귀술', sepW: ', ' },
};
function pickLang() { const q = (/[?&]lang=([a-z]+)/.exec(location.search) || [])[1]; if (TX[q]) return q; const s = ls.get('onikiri_lang', null) || ls.get('katana_lang', null); if (TX[s]) return s; const n = (navigator.language || 'ja').toLowerCase(); return n.startsWith('ja') ? 'ja' : n.startsWith('zh') ? 'zh' : n.startsWith('ko') ? 'ko' : 'en'; }
let L = pickLang(), T = TX[L];
const cl = k => (COLORS[k].name[L] || COLORS[k].name.en), kk = k => (COLORS[k].kokyu[L] || COLORS[k].kokyu.en);
// 技の言葉：lw=技1つをいまの言葉に、trWz=記録に残っている日本語の技名（「、」区切り）をいまの言葉に
const lw = w => locW(w, L), trArt = s => (L === 'ja' ? s : nameL(s, L) || genNameL(s, L) || s), trWz = s => (L === 'ja' || !s ? s : String(s).split('、').map(trArt).join(T.sepW));
function applyLang() {
  T = TX[L]; gripLang(L); document.documentElement.lang = L === 'zh' ? 'zh-Hant' : L; document.title = T.ttl;
  $('tH1').innerHTML = T.h1; $('tLead').innerHTML = T.lead; $('nm').placeholder = T.ph; $('startBtn').textContent = T.start; $('rkBtn').textContent = T.rank; $('rkBtn2').textContent = T.rank; $('prevBtn').textContent = T.prev;
  $('goBtn').textContent = T.go; $('trBtn').textContent = T.tr; $('trT').textContent = T.tr; $('trExit').textContent = T.back; $('pkBack').textContent = T.back; $('shL').textContent = T.sharp; $('again').textContent = T.again; $('repick').textContent = T.repick; $('rename').textContent = T.rename; $('xBtn').textContent = T.x; $('imgBtn').textContent = T.img; $('hintL').textContent = T.hintL; $('hintR').textContent = T.hintR; $('hintS').textContent = T.hintS; $('wzTip').textContent = T.wzTip; $('rkT').textContent = T.rank; $('rkNote').textContent = T.rkNote; $('rkBack').textContent = T.back;
  $('tFan').textContent = T.fan; $('rFan').textContent = T.fan; sndLabel();
  $('langs').innerHTML = Object.keys(TX).map(k => `<button data-l="${k}" class="${k === L ? 'on' : ''}">${TX[k].lang}</button>`).join('');
  $('langs').querySelectorAll('button').forEach(b => b.onclick = () => { L = b.dataset.l; ls.set('onikiri_lang', L); applyLang(); });
}

// ---------- 名前から刀を決める（前作「色変わりの刀」と同じ決め方。同じ名前なら同じ色・同じ才能） ----------
const toHira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const norm = s => toHira(String(s).normalize('NFKC').replace(/[\s　・･]/g, '').toLowerCase());
function hash(s, seed) { let h = (2166136261 ^ seed) >>> 0; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
// 原作キャラは、漢字・ひらがな・カタカナ、名字のあるなし、名字と名前の漢字／よみの組みあわせを同じに扱う（解放戦力と同じ決まり）。名字だけは対象外。色を決める計算に使う名前（norm）は変えない
const charKey = s => varNorm(norm(s).replace(/[\uFE00-\uFE0F\u{E0100}-\u{E01EF}]/gu, '')).replace(/を/g, 'お');
const CHMAP = new Map();
CHARS.forEach(c => { const n = c.n, v = n.slice(); if (n.length >= 4 && n[0].endsWith(n[2]) && n[1].endsWith(n[3])) { const s = n[0].slice(0, -n[2].length), sy = n[1].slice(0, -n[3].length); if (s && sy) v.push(s + n[3], sy + n[2]); } v.forEach(x => { const k = charKey(x); if (!CHMAP.has(k)) CHMAP.set(k, c); }); });
ONI_TITLES.forEach(([al, nm]) => { const c = CHARS.find(c => c.n[0] === nm); if (c) { const k = charKey(al); if (!CHMAP.has(k)) CHMAP.set(k, c); } }); // 「上弦の参」→ 猗窩座 など
const POOL = ORDER.map(k => [k, COLORS[k].w]);
function judge(name) {
  const n = norm(name); const r1 = hash(n, 0x6b61), r2 = hash(n, 0x7461);
  const o = otherOf(name); if (o) return { key: o.k, den: o.den, n, aka: false, stab: false, ch: o.n0, ot: o }; // 別作品の剣士（フルネームのときだけ）
  const c = CHMAP.get(charKey(name)); if (c) return { key: c.k, den: c.den, n, aka: !!c.aka, stab: !!c.stab, ch: c.n[0] };
  let key = null, x = r1 * 100; for (const [k, w] of POOL) { if (x < w) { key = k; break; } x -= w; } key = key || 'none';
  let den;
  if (key === 'none') den = Math.floor(r2 * 6);
  else if (COLORS[key].base) den = Math.round(18 + 82 * Math.pow(r2, 0.85));
  else if (key === 'black') den = Math.round(62 + 38 * r2);
  else den = Math.round(42 + 58 * r2);
  return { key, den, n };
}
// 使える型（キャラは作中の設定、それ以外は才能％で下から。端数は切り上げ）
const wzOf = r => (r.ot ? r.ot.wz : WAZA[r.key]); // その人の技の表（別作品の剣士は、その人だけの技）
function usable(R) {
  const W = wzOf(R); if (!W) return [];
  const all = W.map((_, i) => i); if (R.ot) return all;
  if (R.ch) { const cw = CHAR_WAZA[R.ch]; if (cw === 'all') return all; if (cw) return cw; return all.slice(0, Math.min(CHAR_CAP[R.ch] || W.length, unlocked(W.length, R.den))); }
  return all.slice(0, unlocked(W.length, R.den));
}
const needDen = (i, n) => Math.floor(i * 100 / n) + 1;
const wzName = (key, i) => { const w = WAZA[key][i]; return w[0] + ' ' + w[1]; };

// ---------- 音 ----------
let AC = null, SND = ls.get('onikiri_snd', true);
function sndLabel() { $('sndBtn').textContent = SND ? T.sndOn : T.sndOff; }
$('sndBtn').onclick = () => { SND = !SND; ls.set('onikiri_snd', SND); gripSnd(SND); if (!SND) BGM.stop(); sndLabel(); };
function ac() { if (!SND) return null; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; } catch (e) { return null; } }
function noise(a, dur) { const b = a.createBuffer(1, a.sampleRate * dur, a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = a.createBufferSource(); s.buffer = b; return s; }
function sfx(k, v) {
  const a = ac(); if (!a) return; const t = a.currentTime, g = a.createGain(); g.connect(a.destination); v = v || 1;
  if (k === 'cut') { const s = noise(a, .22), f = a.createBiquadFilter(); f.type = 'highpass'; f.frequency.setValueAtTime(5200, t); f.frequency.exponentialRampToValueAtTime(1100, t + .2); s.connect(f); f.connect(g); g.gain.setValueAtTime(.32 * v, t); g.gain.exponentialRampToValueAtTime(.0001, t + .22); s.start(t); s.stop(t + .22); }
  else if (k === 'ring') { [1320, 1980, 2640].forEach((fq, i) => { const o = a.createOscillator(), gg = a.createGain(); o.frequency.value = fq; o.connect(gg); gg.connect(g); gg.gain.setValueAtTime(.0001, t); gg.gain.exponentialRampToValueAtTime(.16 / (i + 1), t + .01); gg.gain.exponentialRampToValueAtTime(.0001, t + 1.6 - i * .3); o.start(t); o.stop(t + 1.7); }); }
  else if (k === 'thud') { const o = a.createOscillator(); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(38, t + .5); o.connect(g); g.gain.setValueAtTime(.55, t); g.gain.exponentialRampToValueAtTime(.0001, t + .6); o.start(t); o.stop(t + .6); }
  else if (k === 'clang') { [2400, 3150, 4100].forEach((fq, i) => { const o = a.createOscillator(), gg = a.createGain(); o.frequency.value = fq; o.connect(gg); gg.connect(g); gg.gain.setValueAtTime(.16 / (i + 1), t); gg.gain.exponentialRampToValueAtTime(.0001, t + .5); o.start(t); o.stop(t + .52); }); }
  else if (k === 'waza') { const s = noise(a, .7), f = a.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 4; f.frequency.setValueAtTime(600, t); f.frequency.exponentialRampToValueAtTime(6000, t + .5); s.connect(f); f.connect(g); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.4, t + .08); g.gain.exponentialRampToValueAtTime(.0001, t + .7); s.start(t); s.stop(t + .7); const o = a.createOscillator(), gg = a.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(880, t + .25); o.connect(gg); gg.connect(a.destination); gg.gain.setValueAtTime(.12, t); gg.gain.exponentialRampToValueAtTime(.0001, t + .4); o.start(t); o.stop(t + .4); }
  else if (k === 'stone') { [880, 1320].forEach((fq, i) => { const o = a.createOscillator(), gg = a.createGain(); o.type = 'triangle'; o.frequency.value = fq; o.connect(gg); gg.connect(g); gg.gain.setValueAtTime(.14, t + i * .07); gg.gain.exponentialRampToValueAtTime(.0001, t + .3 + i * .07); o.start(t + i * .07); o.stop(t + .4); }); }
  else if (k === 'full') { const o = a.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(660, t); o.frequency.setValueAtTime(990, t + .08); o.connect(g); g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.0001, t + .3); o.start(t); o.stop(t + .3); }
  else if (k === 'move') { const o = a.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(520, t + .06); o.connect(g); g.gain.setValueAtTime(.05, t); g.gain.exponentialRampToValueAtTime(.0001, t + .08); o.start(t); o.stop(t + .08); }
}

// 走っている間の音楽：大太鼓・締太鼓・三味線ふうの旋律。進むほど速くなる
const BGM = { on: false, next: 0, step: 0, g: null, nb: null,
  start() { const a = ac(); this.stop(); if (!a) return; this.g = a.createGain(); this.g.gain.setValueAtTime(.0001, a.currentTime); this.g.gain.exponentialRampToValueAtTime(.55, a.currentTime + .5); this.g.connect(a.destination); if (!this.nb) { this.nb = a.createBuffer(1, a.sampleRate * .2, a.sampleRate); const d = this.nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; } this.on = true; this.next = a.currentTime + .12; this.step = 0; },
  stop() { const g = this.g; this.on = false; this.g = null; if (!g || !AC) return; try { const t = AC.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(Math.max(.0001, g.gain.value), t); g.gain.exponentialRampToValueAtTime(.0001, t + .5); setTimeout(() => { try { g.disconnect(); } catch (e) { } }, 800); } catch (e) { } },
  tick(k) { if (!this.on || !AC) return; if (!SND) { this.stop(); return; } const a = AC, s16 = 60 / (112 + 44 * k) / 4; if (this.next < a.currentTime - .5) this.next = a.currentTime + .05; while (this.next < a.currentTime + .2) { this.note(this.step, this.next, s16); this.next += s16; this.step = (this.step + 1) % 64; } },
  note(i, t, s16) { const a = AC, out = this.g, b = i % 16, bar = i >> 4;
    if (b === 0 || b === 6 || b === 8 || (b === 14 && bar % 2) || (bar === 3 && b >= 12)) { const o = a.createOscillator(), g = a.createGain(); o.frequency.setValueAtTime(b === 0 ? 125 : 105, t); o.frequency.exponentialRampToValueAtTime(42, t + .22); o.connect(g); g.connect(out); g.gain.setValueAtTime(b === 0 ? .95 : .6, t); g.gain.exponentialRampToValueAtTime(.0001, t + .32); o.start(t); o.stop(t + .34); }
    if (b % 4 === 2 || b === 11 || b === 15) { const n = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); n.buffer = this.nb; f.type = 'bandpass'; f.frequency.value = 2600; f.Q.value = 1.2; n.connect(f); f.connect(g); g.connect(out); g.gain.setValueAtTime(b === 15 ? .22 : .32, t); g.gain.exponentialRampToValueAtTime(.0001, t + .07); n.start(t); n.stop(t + .08); }
    if (i % 2 === 0) { const m = BGM.MEL[i / 2]; if (m >= 0) { const o = a.createOscillator(), f = a.createBiquadFilter(), g = a.createGain(); o.type = 'sawtooth'; o.frequency.value = BGM.SC[m]; f.type = 'lowpass'; f.frequency.setValueAtTime(2600, t); f.frequency.exponentialRampToValueAtTime(500, t + .2); o.connect(f); f.connect(g); g.connect(out); g.gain.setValueAtTime(.17, t); g.gain.exponentialRampToValueAtTime(.0001, t + .26); o.start(t); o.stop(t + .28); } }
    if (b === 0) { const o = a.createOscillator(), g = a.createGain(); o.type = 'triangle'; o.frequency.value = bar === 2 ? 98 : 73.42; o.connect(g); g.connect(out); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.2, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + s16 * 15); o.start(t); o.stop(t + s16 * 16); } } };
BGM.SC = [146.83, 155.56, 196, 220, 233.08, 293.66, 311.13, 392]; // 都節ふうの音階（レ・ミ♭・ソ・ラ・シ♭）
BGM.MEL = [0, -1, 2, -1, 3, -1, 2, 1, 0, -1, 4, -1, 3, 2, -1, -1, 5, -1, 4, -1, 3, -1, 2, 3, 4, -1, 2, -1, 1, 0, -1, -1];
// ---------- 小さな表示 ----------
function cap(t, hold) { const c = $('cap'); c.textContent = t; gsap.killTweensOf(c); gsap.fromTo(c, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .3 }); if (hold) gsap.to(c, { opacity: 0, duration: .4, delay: hold }); }
function flash(hex, a) { const f = $('flash'); f.style.background = hex; gsap.fromTo(f, { opacity: a || .7 }, { opacity: 0, duration: .5, ease: 'power2.out' }); }
let toastT = 0; function toast(m) { const t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 5000); }

// ---------- 3D（走る場面）。描く道具（renderer）は握る場面と共用 ----------
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x06070f); scene.fog = new THREE.Fog(0x06070f, 45, 135);
const camera = new THREE.PerspectiveCamera(60, 1, .1, 400);
const CAM = new THREE.Vector3(0, 4.7, 9.4);
function resize() { const w = innerWidth, h = innerHeight; camera.aspect = w / h; const hf = 2 * Math.atan(4.5 / 10.5); camera.fov = clamp(THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hf / 2) / camera.aspect)), 44, 86); camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
scene.add(new THREE.HemisphereLight(0xaab4f0, 0x2a2030, 1.9));
const moonL = new THREE.DirectionalLight(0xd6e0ff, 2.0); moonL.position.set(-5, 12, 8); scene.add(moonL);
const auraL = new THREE.PointLight(0xffffff, 0, 16, 1.6); auraL.position.set(0, 1.6, -1.2); scene.add(auraL);
const LW = 1.4, lx = l => (l - 2) * LW, rnd = (a, b) => a + Math.random() * (b - a);
function ctex(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
// 道（石畳）
const roadTex = ctex(256, 256, (x, w, h) => { x.fillStyle = '#23263a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 90; i++) { const a = Math.random() * w, b = Math.random() * h, s = 14 + Math.random() * 26; x.fillStyle = `rgba(${40 + Math.random() * 30 | 0},${44 + Math.random() * 30 | 0},${70 + Math.random() * 30 | 0},.55)`; x.fillRect(a, b, s, s * .6); } x.fillStyle = '#4b5380'; for (let i = 1; i < 5; i++) x.fillRect(i * w / 5 - 1, 0, 2, h); x.fillStyle = '#8a93c4'; x.fillRect(0, 0, 4, h); x.fillRect(w - 4, 0, 4, h); x.fillStyle = '#ffffff10'; x.fillRect(0, 0, w, 6); });
roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping; roadTex.repeat.set(1, 30); roadTex.anisotropy = 4;
const road = new THREE.Mesh(new THREE.PlaneGeometry(LW * 5, 240), new THREE.MeshLambertMaterial({ map: roadTex })); road.rotation.x = -Math.PI / 2; road.position.set(0, 0, -100); scene.add(road);
const side = new THREE.Mesh(new THREE.PlaneGeometry(120, 260), new THREE.MeshLambertMaterial({ color: 0x0d0e18 })); side.rotation.x = -Math.PI / 2; side.position.set(0, -.03, -100); scene.add(side);
const moon = new THREE.Mesh(new THREE.CircleGeometry(10, 40), new THREE.MeshBasicMaterial({ color: 0xf6ecc9, fog: false })); moon.position.set(34, 52, -190); scene.add(moon);
const moonG = new THREE.Mesh(new THREE.CircleGeometry(22, 40), new THREE.MeshBasicMaterial({ color: 0x8892c8, fog: false, transparent: true, opacity: .16 })); moonG.position.set(34, 52, -191); scene.add(moonG);
// 町並み（大正の夜）と藤の花
const SCEN = [];
{
  const wallM = [0x2a2230, 0x1f2636, 0x33262a, 0x262a2e].map(c => new THREE.MeshLambertMaterial({ color: c })), roofM = new THREE.MeshLambertMaterial({ color: 0x14161f }), winM = new THREE.MeshBasicMaterial({ color: 0xffc66a }), winM2 = new THREE.MeshBasicMaterial({ color: 0xff9a4a });
  const box = new THREE.BoxGeometry(1, 1, 1), roofG = new THREE.ConeGeometry(.78, 1, 4);
  for (let i = 0; i < 30; i++) {
    const sgn = i % 2 ? 1 : -1, g = new THREE.Group(), w = 3.4 + Math.random() * 2, h = 2.6 + Math.random() * 2.2, d = 5 + Math.random() * 3;
    const b = new THREE.Mesh(box, wallM[i % 4]); b.scale.set(w, h, d); b.position.y = h / 2; g.add(b);
    const r = new THREE.Mesh(roofG, roofM); r.scale.set(w * 1.15, 1.5, d * 1.15); r.rotation.y = Math.PI / 4; r.position.y = h + .75; g.add(r);
    for (let k = 0; k < 2; k++) if (Math.random() < .75) { const wn = new THREE.Mesh(box, Math.random() < .5 ? winM : winM2); wn.scale.set(.06, .9, 1.1); wn.position.set(-sgn * (w / 2 + .02), 1.3 + Math.random() * .5, (k - .5) * d * .5); g.add(wn); }
    g.position.set(sgn * (LW * 2.5 + 2.6 + w / 2 + Math.random() * 1.2), 0, -Math.floor(i / 2) * 15 + 12); scene.add(g); SCEN.push({ m: g, span: 225 });
  }
  const postM = new THREE.MeshLambertMaterial({ color: 0x1a1a22 }), lampM = new THREE.MeshBasicMaterial({ color: 0xffb04a });
  for (let i = 0; i < 16; i++) { const sgn = i % 2 ? 1 : -1, g = new THREE.Group(); const p = new THREE.Mesh(box, postM); p.scale.set(.12, 2.6, .12); p.position.y = 1.3; g.add(p); const l = new THREE.Mesh(box, lampM); l.scale.set(.34, .44, .34); l.position.y = 2.7; g.add(l); g.position.set(sgn * (LW * 2.5 + .8), 0, -Math.floor(i / 2) * 28 + 6); scene.add(g); SCEN.push({ m: g, span: 224 }); }
  const fujiT = ctex(128, 256, (x, w, h) => { for (let k = 0; k < 7; k++) { const cx = 12 + k * 17 + Math.random() * 8, len = 110 + Math.random() * 130; for (let j = 0; j < 40; j++) { const t = j / 40, rr = (1 - t) * 9 + 2; x.fillStyle = `hsla(${268 + Math.random() * 20},${55 + Math.random() * 20}%,${60 + t * 18}%,${.9 - t * .3})`; x.beginPath(); x.arc(cx + (Math.random() - .5) * rr * 2, 8 + t * len, 2.5 + (1 - t) * 3, 0, 7); x.fill(); } } });
  const fujiM = new THREE.MeshBasicMaterial({ map: fujiT, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  for (let i = 0; i < 8; i++) { const sgn = i % 2 ? 1 : -1, m = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4.6), fujiM); m.position.set(sgn * (LW * 2.5 + 1.5), 3.6, -Math.floor(i / 2) * 56 - 20); m.rotation.y = sgn * -.9; scene.add(m); SCEN.push({ m, span: 224 }); }
}
// エフェクトと剣士
const WREF = { x: 0 }, FX = makeFx(scene, WREF);
STY.ash = { kind: 'plain', c: '#5a2414', c2: '#ffb07a', shape: 'ember' };
const RIG = makeRig(FX.glowTex); scene.add(RIG.root);
// 自分のいるレーンをうっすら光らせる
const laneGlow = new THREE.Mesh(new THREE.PlaneGeometry(LW, 13), new THREE.MeshBasicMaterial({ map: ctex(32, 128, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.3, 'rgba(255,255,255,.5)'); g.addColorStop(.7, 'rgba(255,255,255,1)'); g.addColorStop(.9, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); x.globalCompositeOperation = 'destination-in'; const e = x.createLinearGradient(0, 0, w, 0); e.addColorStop(0, 'rgba(0,0,0,0)'); e.addColorStop(.15, 'rgba(0,0,0,1)'); e.addColorStop(.85, 'rgba(0,0,0,1)'); e.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = e; x.fillRect(0, 0, w, h); }), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0, fog: false })); laneGlow.rotation.x = -Math.PI / 2; laneGlow.position.set(0, .03, -4.5); scene.add(laneGlow);
const P = {};
{
  P.auraM = new THREE.SpriteMaterial({ map: FX.glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0, fog: false }); P.aura = new THREE.Sprite(P.auraM); P.aura.scale.set(3.0, 4.0, 1); P.aura.position.set(0, 1.15, -.1); RIG.root.add(P.aura);
  const n = 60, pos = new Float32Array(n * 3); P.pv = []; for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * 1.5; pos[i * 3 + 1] = Math.random() * 2.8; pos[i * 3 + 2] = (Math.random() - .5) * 1.1; P.pv.push(.7 + Math.random() * 1.6); }
  P.pg = new THREE.BufferGeometry(); P.pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); P.pm = new THREE.PointsMaterial({ size: .1, map: FX.glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0, fog: false }); RIG.root.add(new THREE.Points(P.pg, P.pm));
}
// 鬼・障害物・砥石
const GEO = { box: new THREE.BoxGeometry(1, 1, 1), sph: new THREE.SphereGeometry(.5, 14, 11), horn: new THREE.ConeGeometry(.06, .34, 6), rock: new THREE.DodecahedronGeometry(.62, 0), eye: new THREE.SphereGeometry(.06, 8, 6),
  robe: new THREE.CylinderGeometry(.22, .5, 1.15, 12), chest: new THREE.CapsuleGeometry(.25, .22, 4, 10), sash: new THREE.CylinderGeometry(.3, .33, .11, 12), arm: new THREE.CapsuleGeometry(.065, .58, 3, 8), claw: new THREE.ConeGeometry(.02, .13, 4), hair: new THREE.SphereGeometry(.31, 12, 8, 0, Math.PI * 2, 0, Math.PI * .6), hairB: new THREE.ConeGeometry(.25, .7, 8), fang: new THREE.ConeGeometry(.022, .09, 5) };
const MAT = { robe: [0x2a1630, 0x1c2a3c, 0x3c1a1c, 0x1e3024, 0x17171e, 0x3a2a14].map(c => toon(c)), skin: [0xc9b9c4, 0xb9c6b4, 0xd2c4ac, 0xaaa6c4].map(c => toon(c)), sash: toon(0x8a1422), hair: toon(0x15101a), mouth: new THREE.MeshBasicMaterial({ color: 0x1a0508 }), horn: toon(0xf2ead0), eye: new THREE.MeshBasicMaterial({ color: 0xff2030 }), crate: toon(0x7a5426), crate2: toon(0x3a2812), rock: toon(0x6a6c7e), stone: new THREE.MeshBasicMaterial({ color: 0xdfe6ff }), stoneO: new THREE.MeshBasicMaterial({ color: 0xff2a40 }) };
// 鬼の部品は、同じ色のものを1つの形にまとめておく（描く回数をへらして軽くする）。[形, 位置, 回転, 大きさ, 輪郭線の太さ(0=なし)]
function bake(list) { const P = [[], []], N = [[], []], m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), n = new THREE.Vector3(), nm = new THREE.Matrix3(); let anyOl = false;
  for (const [geo, p, r, sc, ol] of list) { const g = geo.index ? geo.toNonIndexed() : geo, pa = g.attributes.position, na = g.attributes.normal; if (ol) anyOl = true;
    for (let k = 0; k < 2; k++) { if (k && !ol) continue; const f = k ? ol : 1; q.setFromEuler(e.set(r[0], r[1], r[2])); m.compose(v.set(p[0], p[1], p[2]), q, n.set(sc[0] * f, sc[1] * f, sc[2] * f)); nm.getNormalMatrix(m); for (let i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i).applyMatrix4(m); P[k].push(v.x, v.y, v.z); n.fromBufferAttribute(na, i).applyMatrix3(nm).normalize(); N[k].push(n.x, n.y, n.z); } } }
  return [0, 1].map(k => { if (k && !anyOl) return null; const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P[k], 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N[k], 3)); return g; }); }
const ONI = (() => { const I = [1, 1, 1], S = [-1, 1], claws = [], eyes = [], fangs = [];
  for (const sg of S) { for (let k = -1; k <= 1; k++) claws.push([GEO.claw, [sg * .45 + k * .045, 1.11, .82], [1.8, 0, 0], I, 0]); eyes.push([GEO.eye, [sg * .1, .03, .235], [0, 0, sg * .45], [1.5, .55, .6], 0]); fangs.push([GEO.fang, [sg * .055, -.17, .23], [Math.PI, 0, 0], I, 0]); }
  return { body: bake([[GEO.robe, [0, .6, 0], [0, 0, 0], I, 1.06], [GEO.chest, [0, 1.2, .06], [.3, 0, 0], [1.22, 1, .82], 1.08]]), arms: bake(S.map(sg => [GEO.arm, [sg * .36, 1.2, .44], [1.3, 0, -sg * .3], I, 1.18])), claws: bake(claws),
    head: bake([[GEO.sph, [0, 0, 0], [0, 0, 0], [.5, .58, .5], 1.09]]), hair: bake([[GEO.hair, [0, .05, -.04], [-.4, 0, 0], [.88, .88, .9], 1.05], [GEO.hairB, [0, -.22, -.2], [.25, 0, 0], I, 1.05]]),
    horn1: bake([[GEO.horn, [0, .3, .1], [.3, 0, 0], I, 1.25]]), horn2: bake(S.map(sg => [GEO.horn, [sg * .13, .3, .1], [.3, 0, -sg * .35], I, 1.25])), eyes: bake(eyes), fangs: bake(fangs), mouth: bake([[GEO.box, [0, -.13, .235], [0, 0, 0], [.2, .07, .05], 0]]) }; })();
const FREE = { oni: [], obs: [], stone: [], kishi: [], oni2: [] }, ENT = [];
const HAORI = [0x3a78c8, 0x3aa86a, 0xc8a03a, 0xb04a6a, 0x7a5ac8, 0x4aa8b8, 0xc86a3a, 0x8a8f98]; let KM = null;
function mkKishi() { // 隊士：体（色は頂点）＋羽織（1体ごとに色がちがう）＋刀（倒されると刀だけ飛ぶ）
  KM = KM || { body: vtoon(), haori: HAORI.map(c => vtoon(c)) }; const g = new THREE.Group(), body = new THREE.Group(), head = new THREE.Group(), K = KISHI; g.add(body, head);
  body.add(withOut(K.body.geometry, KM.body), withOut(K.haori.geometry, KM.haori[Math.random() * HAORI.length | 0]));
  const kt = withOut(K.katana.geometry, KM.body); kt.quaternion.copy(K.katana.quaternion); head.add(kt); const hp = K.katana.position.clone();
  const au = new THREE.Sprite(new THREE.SpriteMaterial({ map: FX.glowTex, color: 0x4a9aff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: .85, fog: false })); au.scale.set(3.0, 3.8, 1); au.position.set(0, 1.05, -.25); au.visible = false; g.add(au);
  const au2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: FX.glowTex, color: 0xfff0a0, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: .7, fog: false })); au2.scale.set(1.7, 2.6, 1); au2.position.set(0, 1.1, -.2); au2.visible = false; g.add(au2);
  g.userData = { body, head, au, au2, hp }; scene.add(g); return g;
}
// 敵の鬼（Blender で作った鬼。自分が鬼になったときと同じ姿。頸を斬ると頭が飛ぶ）。読みこみが終わるまでは前の鬼を出す
let OLO = null, OM = null;
new GLTFLoader().load('models/oni_lo.glb?v=11272140', g => { const o = {}; g.scene.traverse(n => { if (n.isMesh) o[n.name] = n; }); if (o.body && o.head) OLO = o; }, undefined, () => { });
function mkOni2() {
  OM = OM || { body: vtoon(), glow: new THREE.MeshBasicMaterial({ vertexColors: true }) }; const g = new THREE.Group(), body = new THREE.Group(), head = new THREE.Group(), K = OLO; g.add(body, head);
  body.add(withOut(K.body.geometry, OM.body)); if (K.marks) body.add(new THREE.Mesh(K.marks.geometry, OM.glow));
  head.add(withOut(K.head.geometry, OM.body)); if (K.eyes) head.add(new THREE.Mesh(K.eyes.geometry, OM.glow)); const hp = K.head.position.clone();
  const eg = new THREE.Sprite(new THREE.SpriteMaterial({ map: FX.glowTex, color: 0xff2030, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: .7 })); eg.scale.set(.5, .2, 1); eg.position.set(0, .12, .22); eg.material.opacity = .5; head.add(eg);
  const au = new THREE.Sprite(new THREE.SpriteMaterial({ map: FX.glowTex, color: 0xc030ff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: .85, fog: false })); au.scale.set(3.0, 3.8, 1); au.position.set(0, 1.05, -.25); au.visible = false; g.add(au);
  const au2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: FX.glowTex, color: 0xff2050, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: .7, fog: false })); au2.scale.set(1.7, 2.6, 1); au2.position.set(0, 1.1, -.2); au2.visible = false; g.add(au2);
  g.userData = { body, head, au, au2, hp }; scene.add(g); return g;
}
function mkEnt(type) {
  if (type === 'kishi') return mkKishi(); if (type === 'oni2') return mkOni2();
  const g = new THREE.Group();
  if (type === 'oni') { const robe = MAT.robe[Math.random() * 6 | 0], skin = MAT.skin[Math.random() * 4 | 0], body = new THREE.Group(), head = new THREE.Group(), O = ONI; g.add(body, head);
    const two = (geo, mat, grp) => { const m = new THREE.Mesh(geo[0], mat); if (geo[1]) m.add(new THREE.Mesh(geo[1], OUT)); grp.add(m); return m; };
    two(O.body, robe, body); two(O.arms, skin, body); two(O.claws, MAT.horn, body); const sa = new THREE.Mesh(GEO.sash, MAT.sash); sa.position.y = 1.0; body.add(sa);
    two(O.head, skin, head); two(O.hair, MAT.hair, head); two(Math.random() < .3 ? O.horn1 : O.horn2, MAT.horn, head); two(O.eyes, MAT.eye, head); two(O.fangs, MAT.horn, head); two(O.mouth, MAT.mouth, head);
    const eg = new THREE.Sprite(new THREE.SpriteMaterial({ map: FX.glowTex, color: 0xff2030, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: .75 })); eg.scale.set(.9, .42, 1); eg.position.set(0, .03, .3); head.add(eg);
    const au = new THREE.Sprite(new THREE.SpriteMaterial({ map: FX.glowTex, color: 0xc030ff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: .85, fog: false })); au.scale.set(3.0, 3.8, 1); au.position.set(0, 1.05, -.25); au.visible = false; g.add(au);
    const au2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: FX.glowTex, color: 0xff2050, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: .7, fog: false })); au2.scale.set(1.7, 2.6, 1); au2.position.set(0, 1.1, -.2); au2.visible = false; g.add(au2);
    g.userData = { body, head, au, au2 }; }
  else if (type === 'obs') { if (Math.random() < .5) { const c = part(GEO.box, MAT.crate, 1.05); c.scale.set(1.12, 1.12, 1.12); c.position.y = .56; g.add(c); for (const y of [.12, 1.0]) { const s = new THREE.Mesh(GEO.box, MAT.crate2); s.scale.set(1.18, .12, 1.18); s.position.y = y; g.add(s); } } else { const r = part(GEO.rock, MAT.rock, 1.06); r.scale.set(1, 1.05, 1); r.position.y = .56; r.rotation.y = Math.random() * 3; g.add(r); } }
  else { const s = new THREE.Mesh(GEO.box, MAT.stone); s.scale.set(.55, .2, .32); s.position.y = .75; g.add(s); const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: FX.glowTex, color: 0xaecbff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: .8 })); gl.scale.set(1.8, 1.8, 1); gl.position.y = .75; g.add(gl); }
  scene.add(g); return g;
}
function spawn(type, lane, z, hard) { const pk = type === 'oni' ? (ONIMODE ? 'kishi' : OLO ? 'oni2' : 'oni') : type, m = FREE[pk].pop() || mkEnt(pk); m.visible = true; m.position.set(lx(lane), 0, z); m.rotation.set(0, 0, 0); const sc = type === 'oni' ? (hard ? 1.42 : rnd(.92, 1.14)) * (pk === 'oni2' ? .92 : 1) : 1; m.scale.set(sc, sc, sc); if (type === 'oni') { const u = m.userData; if (u.hp) u.head.position.copy(u.hp); else u.head.position.set(0, 1.66, .2); u.head.rotation.set(0, 0, 0); u.head.scale.set(1, 1, 1); u.body.scale.set(1, 1, 1); u.body.position.set(0, 0, 0); u.au.visible = u.au2.visible = !!hard; } if (type === 'stone') { const red = !!(R && R.oni); m.children[0].material = red ? MAT.stoneO : MAT.stone; if (m.children[1]) m.children[1].material.color.set(red ? 0xff3050 : 0xaecbff); } const e = { type, pk, lane, z, m, dead: 0, ph: Math.random() * 6, hard: !!hard }; ENT.push(e); return e; }
function clearEnts() { for (const e of ENT) { e.m.visible = false; FREE[e.pk || e.type].push(e.m); } ENT.length = 0; FX.clear(); FX.trail.reset(); FX.dragon.reset(); }

// ---------- 走る ----------
let ST = 'load', R = null, G = { x: 0, speed: 0, lane: 2 }, SEL = [], BEST = ls.get('onikiri_best', 0);
// 1体斬るごとの刃こぼれ：才能がないほど早い（0%で約4体）。才能が高いとほとんど減らないが、少しは減る。赫刀は1割だけ減りにくい
// オーラのある固い鬼は、10体分の切れ味を一気に失う（最高速になってから出る）
const costOf = r => Math.max(1.5, 15 * (1 - r.den / 100)) * (r.akaDone ? .9 : 1), HARD = 10;
let ONIMODE = false, TR = null; // TR＝トレーニング場にいるあいだの状態
function newRun() {
  clearEnts(); ONIMODE = !!R.oni && !!KISHI; $('shL').textContent = R.oni ? T.regen : T.sharp; const den = R.den, cost = costOf(R);
  G = { t: 0, dist: 0, speed: 13, lane: 2, x: 0, max: Math.round(70 + 30 * den / 100), cost, sharp: 0, gauge: 0, kills: 0, over: 0, inv: 0, fx: null, slowT: 0, slowS: 1, hit: 0, lastCut: -9, next: 12, safe: 2, shake: 0, pend: [], sel: 0, wz: SEL.map(i => wzOf(R)[i]), used: {}, why: '', cutN: 0, pt: 0 };
  G.sharp = G.max; if (TR) { G.gauge = 100; trEnts(); } else for (let z = -48; z > -124; z -= 19) spawnRow(z); G.next = 12; $('hud').classList.toggle('tr', !!TR); $('trBar').hidden = !TR; hudWaza(); $('hud').hidden = false; $('wzBtns').hidden = !G.wz.length; $('wzB').hidden = G.wz.length < 2; RIG.setLoop(null); setLook(1); ST = 'run'; hudStep(true); BGM.start(); G.snapT = .7; G.snapP = 0; G.snapBest = 0; snapHas = false;
  const hn = TR ? 9 : ls.get('onikiri_hint', 0); if (hn < 3) { ls.set('onikiri_hint', hn + 1); const h = $('hint'); h.hidden = false; gsap.killTweensOf(h); gsap.fromTo(h, { opacity: 0 }, { opacity: 1, duration: .25 }); gsap.to(h, { opacity: 0, duration: .5, delay: 3.2, onComplete: () => { h.hidden = true; } }); } else $('hint').hidden = true;
}
const KEY = () => { const w = G && G.wz && G.wz[G.sel], st = w && w[3].sty; if (st && STY[st] && R && (R.oni || R.ot)) return st; if (R && R.oni) return 'oni'; return R && STY[R.key] ? R.key : 'none'; };
function auraCol() { if (!R || R.key === 'none') return new THREE.Color(0x9aa0aa); const c = new THREE.Color(STY[R.key].c); if (R.akaDone) c.lerp(new THREE.Color(0xff2a14), .6); return c; }
const hexOf = () => '#' + auraCol().getHexString();
function setLook(aura) {
  const C = COLORS[R.key], col = new THREE.Color(R.key === 'none' ? '#b9bec4' : C.hex);
  RIG.bladeM.color.copy(col); if (R.key === 'black') RIG.bladeM.color.set(0x2a2a30); if (R.akaDone) RIG.bladeM.color.lerp(new THREE.Color(0xff3a14), .75);
  const a = auraCol(); P.auraM.color.copy(a); P.pm.color.copy(a); RIG.bladeGlow.color.copy(R.akaDone ? new THREE.Color(0xff3a14) : (R.key === 'black' ? new THREE.Color(0xff7a3a) : col)); RIG.bladeGlow.opacity = R.key === 'none' ? .15 : .75;
  RIG.haoriM.color.copy(R.key === 'none' ? new THREE.Color(0x4a4e58) : (R.key === 'black' ? new THREE.Color(0x2c3a34) : col.clone().multiplyScalar(.8)));
  const k = R.key === 'none' ? .12 : (.3 + .5 * R.den / 100); P.auraM.opacity = aura * k * .9; P.pm.opacity = aura * k; auraL.color.copy(a); auraL.intensity = aura * (R.key === 'none' ? 3 : 26);
  RIG.look(!!R.oni); laneGlow.material.color.copy(a); FX.trail.key(KEY()); document.documentElement.style.setProperty('--tint', hexOf());
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; }
function spawnRow(z) {
  const d = G.dist, q = Math.min(1, d / 2500); z = z || -128;
  if (Math.random() < .55) G.safe = clamp(G.safe + (Math.random() < .5 ? -1 : 1), 0, 4); // この道には障害物を置かない（必ず通れる道を1本残す）
  const lanes = shuffle([0, 1, 2, 3, 4]), cells = [null, null, null, null, null];
  const wall = d > 450 && Math.random() < Math.min(.3, .04 + (d - 450) / 5000);
  if (wall) { const nObs = Math.random() < .5 ? 0 : (Math.random() < .6 ? 1 : 2); let o = 0; for (const l of lanes) { if (o < nObs && l !== G.safe) { cells[l] = 'obs'; o++; } else cells[l] = 'oni'; } }
  else { let n = 1 + (Math.random() < .35 + .4 * q ? 1 : 0) + (Math.random() < .5 * q ? 1 : 0) + (Math.random() < .3 * q ? 1 : 0), o = 0; for (let i = 0; i < n; i++) { const l = lanes[i]; if (l !== G.safe && o < 2 && Math.random() < .26 + .14 * q) { cells[l] = 'obs'; o++; } else cells[l] = 'oni'; } if (Math.random() < .075) cells[lanes[4]] = 'stone'; }
  const pH = d < 1800 ? 0 : Math.min(.3, .07 + (d - 1800) / 9000); // 固い鬼：最高速になってから時々、進むほど割と出る。必ず通れる道には置かない
  cells.forEach((c, l) => { if (c) spawn(c, l, z, c === 'oni' && l !== G.safe && Math.random() < pH); });
}
// 鬼を斬る：頸が飛び、体は灰になる
function kill(e, free, quiet) {
  if (e.dead) return; e.dead = .001; e.vx = rnd(-1, 1) * 4 + (e.m.position.x - G.x) * 2; e.vy = rnd(6, 10); G.kills++; if (!free) G.gauge = Math.min(100, G.gauge + 7); // 技で倒した鬼ではゲージはたまらない
  const K = KEY(), x = e.m.position.x; FX.arcVert(K, x, e.z + .3, 2.8, .26, { rz: rnd(-1.4, 1.4), world: 1, y: 1.4 }); FX.glow('#ffffff', x, 1.4, e.z, 2.6, .12, { world: 1 }); FX.burst(K, x, 1.3, e.z, free ? 3 : 6, { sp: 6 }); FX.burst('ash', x, .8, e.z, 5, { sp: 3, g: -3, life: 1.3 });
  if (e.hard) { const u = e.m.userData; u.au.visible = u.au2.visible = false; G.shake = Math.max(G.shake, .45); FX.ring('#c030ff', x, e.z, 1.2, .5, { grow: 6, world: 1 }); FX.burst('ash', x, 1.2, e.z, 14, { sp: 7, g: -2, life: 1.4 }); FX.glow('#c030ff', x, 1.3, e.z, 5, .25, { world: 1 }); if (!free) { sfx('clang'); G.gauge = Math.min(100, G.gauge + 8); } }
  if (R.oni && free && !quiet) FX.burst(KEY(), e.m.position.x, 1.1, e.z, 8, { sp: 6, life: .7 });
  if (!quiet) sfx('cut', free ? .5 : 1); if (!free) reqSnap(1, .06);
}
function smash(e) { if (e.dead) return; e.dead = .001; e.vx = rnd(-5, 5); e.vy = 6; FX.glow('#ffd9a0', e.m.position.x, .8, e.z, 3, .2, { world: 1 }); FX.burst('gray', e.m.position.x, .7, e.z, 8, { sp: 8 }); sfx('thud'); }
function inZone(e, Lw, Rr, zNear) { return e.z <= (zNear == null ? 1 : zNear) && e.z >= -Rr && (Lw >= 9 || Math.abs(e.lane - G.lane) <= Lw); }
function zoneKill(Lw, Rr, O, zNear) { let n = 0; for (const e of ENT) { if (e.dead || !inZone(e, Lw, Rr, zNear)) continue; if (e.type === 'oni') { kill(e, true, n > 2); n++; } else if (e.type === 'obs' && O) smash(e); } return n; }
function die(why) { if (G.over || TR || (DEV && window.__god)) return; G.over = .001; G.why = why; G.shake = .9; G.fx = null; RIG.setLoop('down'); FX.dragon.stop(); BGM.stop(); sfx('thud'); sfx('clang'); flash('#ff2a2a', .6); fxAdd(PFX && PFX.fx.burst, { x: 80, y: 90, seed: 9, palette: ramp('#ff3048') }); }
// 型ごとの動き（原作の動きに合わせる）
function actOf(p) { if (p.a) return p.a; const v = p.v; if (p.k === 'inst') return v === 'wheel' ? 'flipV' : v === 'arcUp' ? 'rise' : (v === 'arcDown' || v === 'fall') ? 'smash' : v === 'thrust' ? 'thrust' : (v === 'bolt' || v === 'dash' || v === 'mega') ? 'iai' : (v === 'claws' || v === 'storm') ? 'slashH2' : 'slashH'; if (p.k === 'multi') return 'multi'; if (p.k === 'aura') return v === 'calm' ? 'calm' : v === 'dashAura' ? 'charge' : 'spin'; if (p.k === 'flow') return v === 'dragon' ? 'dragon' : 'flow'; if (p.k === 'rain') return 'raise'; return p.v === 'eye' && p.S > .45 ? 'sense' : null; }
// 一撃の型のエフェクト
function castFx(p) {
  const K = KEY(), S = STY[K], px = G.x, all = p.L >= 9, Wd = (all ? 5 : 2 * p.L + 1) * LW, cx = all ? 0 : px, v = p.v, Rr = p.R, lanes = [];
  for (let l = 0; l < 5; l++) if (all || Math.abs(l - G.lane) <= p.L) lanes.push(l);
  FX.ring(S.c, px, -1, 1.2, .45, { grow: 6 }); FX.burst(K, px, 1.1, -1.5, 16, { sp: 8, fwd: 2.5 }); sfx('cut');
  if (v === 'arcH' || v === 'rain') { for (let i = 0; i < 3; i++) FX.arcFlat(K, cx, -2 - i * 1.3, Wd + 2.4 - i * .3, .5 + i * .08, { vz: -Rr * 2.4, grow: .5, a: 1 - i * .25 }); FX.arcVert(K, cx, -1.6, Wd + 1.6, .28, { y: 1.2 }); if (v === 'rain') for (let i = 0; i < 14; i++) FX.vbeam(K, cx + rnd(-Wd, Wd) * .6, -rnd(2, Rr), 7, .5, rnd(.3, .6), { a: .6 }); }
  else if (v === 'wheel' || v === 'arcUp' || v === 'arcDown' || v === 'fall') {
    lanes.forEach(l => { FX.arcVert(K, lx(l), -2, 4.4, .55, { vz: -Rr * 2, rz: (v === 'arcDown' || v === 'fall') ? Math.PI : 0, spin: v === 'wheel' ? -16 : 0, y: 1.7 }); FX.beam(K, lx(l), 0, -Rr, 1.5, .45); });
    if (v === 'fall' || v === 'arcDown') { G.shake = .65; lanes.forEach(l => { FX.vbeam(K, lx(l), -Rr * .45, 9, 1.7, .42); FX.ring(S.c2, lx(l), -Rr * .45, 1.5, .5, { grow: 5 }); }); FX.burst(K, cx, .5, -Rr * .45, 26, { sp: 10, w: Wd }); }
    if (v === 'arcUp') lanes.forEach(l => FX.vbeam(K, lx(l), -Rr * .5, 10, 1.4, .45, { vy: 6 }));
  }
  else if (v === 'claws') lanes.forEach((l, i) => { FX.beam(K, lx(l), 0, -Rr, 1.2, .5); FX.arcVert(K, lx(l), -3, 3.2, .42, { vz: -Rr * 2.2, rz: i % 2 ? -.6 : .6 }); });
  else if (v === 'storm') { lanes.forEach(l => { FX.beam(K, lx(l), 0, -Rr, 1.4, .5); for (let i = 0; i < 2; i++) FX.vbeam(K, lx(l), -3 - Math.random() * Rr * .9, 11, 1.5, rnd(.25, .5)); }); G.shake = .6; flash(S.c2, .35); }
  else if (v === 'mega') { FX.beam(K, cx, 0, -Rr, Wd * 1.5, .85); FX.beam(K, cx, 0, -Rr, Wd * .7, .6); for (let i = 0; i < 5; i++) FX.arcFlat(K, cx, -3 - i * 3, Wd + 3, .75, { vz: -Rr * 1.5, grow: .9, a: 1 - i * .12 }); FX.dragon.start(K, .8, Math.min(42, Rr * .6), 1.7); G.shake = 1; flash(S.c, .55); FX.burst(K, cx, 1, -6, 40, { sp: 13, w: Wd, fwd: 3 }); lanes.forEach(l => FX.vbeam(K, lx(l), -rnd(6, Rr * .7), 12, 1.6, .5)); }
  else { FX.beam(K, px, .5, -Rr, v === 'dash' ? 2.3 : 1.7, .5); FX.beam(K, px, 0, -Rr, .8, .35); if (p.L > 0 && !all) for (const s of [-1, 1]) FX.beam(K, px + s * LW, 0, -Rr, 1.3, .42);
    if (v === 'bolt') { for (let i = 0; i < 4; i++) FX.vbeam(K, px + rnd(-1.5, 1.5), -rnd(2, Rr), 12, 1.7, rnd(.18, .4)); flash('#ffffff', .3); }
    if (v === 'dash') FX.arcVert(K, px, -3, 4.2, .42, { vz: -Rr * 2, rz: -.8 }); FX.ring(S.c2, px, -Rr * .5, 1, .4, { grow: 7 }); FX.arcFlat(K, px, -Rr * .6, 3.6, .4, { grow: 1.5 }); }
  flair(p, K);
}
// 血鬼術ごとの演出（見た目の種類ごとに、氷柱・棘・衝撃波・爆ぜる血・糸の網などを足す）
function flair(p, K, light) {
  if (!p.sty) return; const S = STY[K], x = G.x, Rr = p.R || 12, all = p.L >= 9 || p.k === 'rain' || p.k === 'slow', Wd = (all ? 5 : 2 * (p.L || 0) + 1) * LW, cx = all ? 0 : x, st = S.fl || p.sty, q = light ? .5 : 1;
  const zs = n => { const m = Math.max(2, Math.round(n * q)); return Array.from({ length: m }, (_, i) => -2 - (Rr - 2) * (i + .5) / m); }, rx = () => cx + rnd(-Wd, Wd) * .5;
  // 別作品の技の演出
  if (st === 'f_crescent') { const n = light ? 1 : (all ? 3 : 2); for (let i = 0; i < n; i++) FX.arcVert(K, cx + (i - (n - 1) / 2) * Wd * .32, -2 - i, 5 + i, .8, { vz: -Rr * 1.5, y: 2.1, a: .95 }); if (!light) { FX.ring(S.c2, x, -1, 1.2, .5, { grow: 10 }); FX.glow(S.c, cx, 2, -Rr * .4, 9, .5, { a: .45 }); G.shake = Math.max(G.shake, .5); } FX.burst(K, cx, 1.6, -Rr * .4, 18 * q, { sp: 9, fwd: 8, w: Wd, life: 1 }); }
  else if (st === 'f_petal') { for (let i = 0; i < 16 * q; i++) FX.arcVert(K, rx(), -rnd(1, Math.max(8, Rr)), rnd(.7, 1.6), rnd(.6, 1.2), { rz: rnd(0, 6.28), spin: rnd(-9, 9), y: rnd(.6, 3) }); FX.burst(K, cx, 2.4, -Rr * .45, 46 * q, { sp: 5, w: Wd + 2, g: 1.5, life: 2 }); if (!light) { FX.glow(S.c, cx, 1.6, -Rr * .4, 10, .9, { a: .3 }); FX.arcFlat(K, cx, -Rr * .5, Wd + 3, 1.4, { grow: .4, a: .45, y: .06 }); } }
  else if (st === 'f_pillar') { zs(5).forEach(z => { for (const sd of [-1, 1]) FX.vbeam(K, cx + sd * (Wd / 2 + .3) + rnd(-.4, .4), z, rnd(5, 9), .9, rnd(.6, 1), { a: .9, vy: 2 }); FX.burst(K, rx(), .4, z, 10, { sp: 6, g: -6, life: 1.1 }); }); if (!light) { flash(S.c, .3); FX.glow(S.c2, cx, 1.5, -Rr * .4, 11, .6, { a: .4 }); G.shake = Math.max(G.shake, .55); } }
  else if (st === 'f_cross') { const n = light ? 1 : 2; for (let i = 0; i < n; i++) for (const sd of [-1, 1]) FX.arcFlat(K, cx, -2.5 - i * 1.5, Wd + 3, .6, { rz: sd * .7, vz: -Rr * 1.3, a: .9, y: 1.1 + i * .3 }); FX.burst(K, cx, 1.2, -3, 16 * q, { sp: 10, fwd: 10, w: Wd, life: .8 }); if (!light) G.shake = Math.max(G.shake, .4); }
  else if (st === 'f_fang') { for (let i = 0; i < 9 * q; i++) FX.beam(K, cx + rnd(-Wd, Wd) * .3, -rnd(0, 2), -rnd(Rr * .7, Rr), .22, rnd(.25, .5)); for (let i = 0; i < 3; i++) FX.ring(i % 2 ? S.c2 : S.c, cx, -2 - i * (Rr / 3.5), .7 + i * .25, .4 + i * .1, { grow: 7 }); if (!light) G.shake = Math.max(G.shake, .45); }
  else if (st === 'f_quake') { zs(4).forEach(z => { const bx = rx(); FX.vbeam(K, bx, z, rnd(2, 4), 1, .5, { vy: 4 }); FX.burst(K, bx, .5, z, 12, { sp: 9, g: 16, life: .9 }); }); if (!light) { FX.ring(S.c, x, -1.5, 1.5, .6, { grow: 12 }); flash(S.c2, .22); G.shake = Math.max(G.shake, .85); } }
  else if (st === 'k_ice' || st === 'k_lotus') { zs(6).forEach(z => { for (const s of [-1, 1]) FX.vbeam(K, cx + s * (Wd / 2 + .2) + rnd(-.3, .3), z, rnd(2.5, 5), .5, rnd(.7, 1.2), { a: .9 }); }); if (!light) FX.arcFlat(K, cx, -Rr * .5, Wd + 3, 1.6, { grow: .3, a: .5, y: .06 }); FX.burst(K, cx, 2.5, -Rr * .4, 30 * q, { sp: 5, w: Wd, g: 6, life: 1.4 }); }
  else if (st === 'k_thorn') { for (let i = 0; i < 16 * q; i++) FX.arcVert(K, rx(), -rnd(2, Rr), rnd(2.5, 5), rnd(.4, .8), { rz: rnd(0, 6.28), y: rnd(.6, 2.2) }); G.shake = Math.max(G.shake, .5 * q); }
  else if (st === 'k_akaza') { for (let i = 0; i < 3; i++) FX.ring(i % 2 ? S.c2 : S.c, x, -1.5 - i * (Rr / 4), 1 + i * .4, .5 + i * .12, { grow: 9 }); FX.burst(K, x, 1.2, -2, 24 * q, { sp: 12, fwd: 6 }); G.shake = Math.max(G.shake, .45 * q); }
  else if (st === 'k_baku') { zs(5).forEach(z => { const bx = rx(); FX.glow(S.c, bx, 1.2, z, rnd(4, 7), .5); FX.burst(K, bx, 1, z, 14, { sp: 9, life: .9 }); }); if (!light) flash(S.c, .4); G.shake = Math.max(G.shake, .6 * q); }
  else if (st === 'k_sickle') { for (const s of [-1, 1]) FX.arcVert(K, x + s * .8, -2, 3.6, .9, { vz: -Rr * 1.3, spin: s * 14, y: 1.3 }); }
  else if (st === 'k_thread' || st === 'k_obi') { zs(5).forEach((z, i) => FX.arcFlat(K, cx, z, Wd + 2.5, .7, { rz: (i % 2 ? 1 : -1) * .78, a: .9, y: .9 + (i % 3) * .5 })); for (let i = 0; i < 6 * q; i++) FX.arcVert(K, rx(), -rnd(2, Rr), rnd(3, 5), .5, { rz: rnd(-1, 1), y: 1.4 }); }
  else if (st === 'k_fish' || st === 'blue') { zs(6).forEach(z => FX.burst(K, rx(), .3, z, 8, { sp: 7, g: 14, life: 1 })); if (!light) FX.arcFlat(K, cx, -3, Wd + 3, .8, { vz: -Rr * 1.2, grow: .8 }); }
  else if (st === 'k_sonic') { zs(5).forEach((z, i) => FX.arcVert(K, cx, z, 2 + i * 1.3, .35 + i * .08, { y: 1.3, a: .8 - i * .1 })); G.shake = Math.max(G.shake, .4 * q); }
  else if (st === 'k_dream' || st === 'k_scent' || st === 'k_poison' || st === 'white') { for (let i = 0; i < 5 * q; i++) FX.glow(i % 2 ? S.c2 : S.c, rx(), rnd(.8, 2.2), -rnd(2, Math.max(8, Rr)), rnd(5, 9), rnd(1.2, 2.2), { a: .35 }); FX.burst(K, cx, 1.5, -5, 26 * q, { sp: 3, w: Wd + 2, g: -1, life: 2 }); }
  else if (st === 'k_biwa') { for (let l = 0; l < 5; l++) FX.vbeam(K, lx(l), -rnd(4, Rr), 3.2, LW * .9, .5, { a: .8 }); if (!light) flash('#fff0c8', .25); }
  else if (st === 'k_drum') { for (let i = -1; i <= 1; i++) FX.arcVert(K, x + i * .9, -3, 4.5, .5, { vz: -Rr * 1.8, rz: -.5, y: 1.4 }); }
  else if (st === 'k_hand' || st === 'k_wood' || st === 'k_bone' || st === 'gray') { zs(6).forEach(z => FX.vbeam(K, rx(), z, rnd(2, 4), .7, .7, { vy: 3 })); }
  else if (st === 'k_shadow' || st === 'k_ink') { if (!light) FX.arcFlat(K, cx, -Rr * .5, Wd + 4, 1.2, { grow: .5, a: .8, y: .05 }); zs(5).forEach(z => FX.vbeam(K, rx(), z, rnd(2, 5), .6, .6)); }
  else if (st === 'k_blood' || st === 'k_needle' || st === 'k_chain' || st === 'k_spear') { for (let i = 0; i < 12 * q; i++) FX.beam(K, rx(), -rnd(0, Rr * .5), -rnd(Rr * .5, Rr), .25, rnd(.3, .6)); }
  else if (st === 'k_mirror' || st === 'k_paper' || st === 'sakura' || st === 'fuji') { for (let i = 0; i < 8 * q; i++) FX.arcVert(K, rx(), -rnd(2, Math.max(8, Rr)), rnd(1, 2.2), rnd(.5, 1), { rz: rnd(0, 6.28), spin: rnd(-6, 6), y: rnd(.8, 2.4) }); FX.burst(K, cx, 2, -Rr * .4, 20 * q, { sp: 4, w: Wd + 1, g: 2, life: 1.6 }); }
  else if (st === 'k_rust' || st === 'k_kbolt' || st === 'yellow') { for (let i = 0; i < 5 * q; i++) FX.vbeam(K, rx(), -rnd(2, Rr), 12, 1.4, rnd(.2, .45)); if (!light) flash(S.c2, .25); }
  else if (st === 'red' || st === 'green' || st === 'purple') { zs(4).forEach(z => FX.burst(K, rx(), 1, z, 10, { sp: 7, life: .9 })); }
}
// 続く型のエフェクト
function auraFx(p) {
  const K = KEY(), S = STY[K], D = p.D, v = p.v; flair(p, K);
  if (p.k === 'aura') { const r = p.L >= 9 ? 6.6 : (2 * p.L + 1) * LW * .5 + 1.4; for (let i = 0; i < 3; i++) FX.arcFlat(K, G.x, -1, r * 2.3, D, { rz: i * 2.094, spin: v === 'calm' ? 1.3 : 8.5, follow: 1, hold: 1, y: .6, a: v === 'calm' ? .55 : 1 }); FX.ring(S.c, G.x, -1, r, D, { follow: 1, hold: 1 }); if (v === 'calm') { FX.ring('#ffffff', G.x, -1, r * .55, D, { follow: 1, hold: 1, a: .4 }); FX.glow(S.c, G.x, 1.2, -1, r * 2.2, D, { follow: 1, hold: 1, a: .3 }); } if (v === 'dashAura') FX.dragon.start(K, D, 9, .8); }
  else if (p.k === 'flow') FX.dragon.start(K, D, v === 'dragon' ? 22 : 13, v === 'dragon' ? 1.4 : .85);
  else if (p.k === 'slow') { gsap.to('#tint', { opacity: .55, duration: .25 }); gsap.to('#tint', { opacity: 0, duration: .5, delay: D }); FX.ring(S.c, G.x, -1, 2, .8, { grow: 5, follow: 1 }); }
}
function useWaza() {
  if (ST !== 'run' || G.over || !G.wz.length || G.gauge < 100 || G.fx || RIG.playing()) return;
  const w = G.wz[G.sel], p = w[3], col = hexOf(), a = actOf(p);
  G.gauge = 0; G.used[artName(w)] = 1; sfx('waza'); FX.trail.key(KEY()); flash(col, .2); if (TIPN < 3) ls.set('onikiri_tip', ++TIPN); reqSnap(2, p.k === 'inst' ? (ACTHIT[a] || .2) + .13 : .55);
  const el = $('wz'), wl = lw(w); el.innerHTML = R.oni ? `<small>${esc(wl[0])}</small>${esc(wl[1])}` : `<small>${esc(R.ot ? R.kk : kk(R.key))}</small>${R.ot && wl[0] === R.kk ? '' : esc(wl[0]) + '　'}${esc(wl[1])}`; { const n = wlen(el.textContent) - wlen(el.firstChild.textContent); el.style.fontSize = L === 'en' || R.oni ? '' : n > 17 ? '15px' : n > 12 ? '18px' : ''; } el.classList.toggle('lat', L === 'en'); el.classList.toggle('oni', !!R.oni); if (R.oni) { gsap.fromTo('#tint', { opacity: .5 }, { opacity: 0, duration: .9 }); if (p.ring) { for (let i = 0; i < 6; i++) FX.arcFlat(KEY(), G.x, -1, 6.5, p.D, { rz: i * 1.047, follow: 1, hold: 1, spin: .5, y: .08, a: .8 }); FX.ring(STY[KEY()].c2, G.x, -1, 3.2, p.D, { follow: 1, hold: 1 }); FX.ring(STY[KEY()].c, G.x, -1, 1.6, p.D, { follow: 1, hold: 1 }); } } gsap.killTweensOf(el); gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: .62, y: 0, duration: .18 }); gsap.to(el, { opacity: 0, duration: .5, delay: 1.0 });
  if (p.H) G.sharp = Math.min(G.max, G.sharp + p.H);
  if (p.k === 'inst') { const hit = RIG.play(a) || .1; if (TR) TR.lock = hit + .55; G.hit = hit + .14; G.inv = Math.max(G.inv, hit + (p.I || .45)); FX.trail.on(hit + .45); G.pend.push({ t: hit, f: () => { zoneKill(p.L, p.R, p.O); castFx(p); } }); }
  else { const D = p.k === 'multi' ? p.N * .1 + .15 : p.D; G.hit = .3; G.fx = { p, t: 0, D, tick: 0, n: 0 }; if (a) RIG.setLoop(a); FX.trail.on(D); if (p.k === 'slow') { G.slowT = p.D; G.slowS = p.S; } auraFx(p); }
}
function runStep(dt) {
  if (G.over) { G.over += dt; if (G.over > 1.1) showResult(); return 0; }
  if (G.hit > 0) G.hit -= dt; if (G.slowT > 0) G.slowT -= dt;
  const ts = (G.hit > 0 ? .3 : 1) * (G.slowT > 0 ? G.slowS : 1), wdt = dt * ts;
  G.t += wdt; G.speed = TR ? (TR.move ? 13 : 0) : 13 + 17 * Math.min(1, G.dist / 1800); const mv = G.speed * wdt; if (!TR) G.dist += mv;
  const p1 = Math.min(1, G.dist / 1800), gap = G.dist < 1800 ? 18 - 8 * p1 : Math.max(7, 10 - (G.dist - 1800) / 1500);
  G.next -= mv; while (G.next <= 0) { if (TR) { trRow(-128); G.next += 9; } else { spawnRow(); G.next += gap; } }
  if (TR) trStep(dt);
  for (let i = G.pend.length - 1; i >= 0; i--) { const k = G.pend[i]; k.t -= dt; if (k.t <= 0) { G.pend.splice(i, 1); k.f(); } }
  // 続く型
  const F = G.fx; let immune = G.inv > 0, ghost = false, brk = false;
  if (F && F.p && F.p.sty) { F.fl = (F.fl == null ? .6 : F.fl) - dt; if (F.fl <= 0) { F.fl = .6; flair(F.p, KEY(), true); } }
  if (G.inv > 0) G.inv -= dt;
  if (F) {
    F.t += dt; F.tick -= dt; const p = F.p, K = KEY();
    if (p.k === 'aura') { immune = true; ghost = !!p.G; brk = !!p.O; zoneKill(p.L, p.R, p.O); if (F.tick <= 0) { F.tick = .07; FX.burst(K, G.x + rnd(-1, 1) * (p.L >= 9 ? 3 : p.L * LW + 1), .8, -1 + rnd(-2, 1), 2, { sp: 4, world: 0 }); } }
    else if (p.k === 'flow') { immune = true; ghost = true; brk = !!p.O; const Lw = p.grow ? Math.min(2, Math.floor(F.t / F.D * 3)) : p.L; let tg = null; for (const e of ENT) if (!e.dead && e.type === 'oni' && e.z < -1 && e.z > -34 && (!tg || e.z > tg.z)) tg = e; if (tg && tg.lane !== G.lane) { G.lane = tg.lane; FX.arcFlat(K, G.x, -1, 3.4, .3, { rz: rnd(0, 6) }); } zoneKill(Lw, 7, p.O); if (F.tick <= 0) { F.tick = .06; FX.burst(K, G.x, 1, -.5, 2, { sp: 5 }); } }
    else if (p.k === 'rain') { if (F.tick <= 0) { F.tick = .2; zoneKill(9, p.R, p.O, -2.5); for (let i = 0; i < 4; i++) { const x = lx(Math.random() * 5 | 0), z = -4 - Math.random() * (p.R - 4); FX.vbeam(K, x, z, 12, 1.5, .32, { world: 1 }); FX.ring(STY[K].c, x, z, .8, .35, { grow: 6, world: 1 }); FX.burst(K, x, .4, z, 3, { sp: 6 }); } G.shake = Math.max(G.shake, .22); } }
    else if (p.k === 'multi') { immune = true; if (F.tick <= 0 && F.n < p.N) { F.tick = .1; F.n++; let tg = null; for (const e of ENT) if (!e.dead && e.type === 'oni' && e.z < 1 && e.z > -p.R && (!tg || e.z > tg.z)) tg = e; if (tg) { kill(tg, true); FX.beam(K, (G.x + tg.m.position.x) / 2, 0, tg.z, .7, .2); } else FX.arcVert(K, G.x + rnd(-.6, .6), -2, 3, .25, { rz: rnd(-1.5, 1.5), vz: -20 }); } }
    if (F.t >= F.D) { G.fx = null; G.inv = Math.max(G.inv, .4); RIG.setLoop(null); FX.dragon.stop(); }
  }
  if (!G.fx && G.gauge < 100) { const g0 = G.gauge; G.gauge = Math.min(100, G.gauge + 1.3 * wdt); if (g0 < 100 && G.gauge >= 100) sfx('full'); }
  if (G.t - G.lastCut > 1.0) G.sharp = Math.min(G.max, G.sharp + 10 * wdt); // 切れ味は、斬らずにいると戻る
  const tx = lx(G.lane); G.x += (tx - G.x) * Math.min(1, dt * 24); const pl = clamp(Math.round(G.x / LW) + 2, 0, 4);
  for (let i = ENT.length - 1; i >= 0; i--) {
    const e = ENT[i]; e.z += mv; e.m.position.z = e.z;
    if (e.dead) { e.dead += dt; const m = e.m, u = m.userData;
      if (e.type === 'oni' && u.head) { const h = u.head; e.vy -= 20 * dt; h.position.y += e.vy * dt; h.position.x += e.vx * dt; h.position.z -= 3 * dt; h.rotation.z += 11 * dt; h.rotation.x += 7 * dt; const s = Math.max(.01, 1 - e.dead / .5); u.body.scale.set(s, s * s, s); u.body.position.y = 0; if (e.dead > .38) h.scale.setScalar(Math.max(.01, 1 - (e.dead - .38) / .2)); }
      else { m.position.y += e.vy * dt; m.position.x += e.vx * dt; m.rotation.z += e.vx * dt; const s = Math.max(.01, 1 - e.dead / .34); m.scale.set(s, s, s); }
      if (e.dead > (e.type === 'oni' ? .58 : .34)) { m.visible = false; FREE[e.pk || e.type].push(m); ENT.splice(i, 1); } continue; }
    if (e.type === 'oni') { e.m.position.y = Math.abs(Math.sin(G.t * 9 + e.ph)) * .12; e.m.rotation.z = Math.sin(G.t * 9 + e.ph) * .07; if (e.hard) { const k = 1 + Math.sin(G.t * 11 + e.ph) * .12, u = e.m.userData; u.au.scale.set(3.0 * k, 3.8 * k, 1); u.au2.scale.set(1.7 / k, 2.6 * k, 1); } } else if (e.type === 'stone') { e.m.rotation.y += dt * 3; e.m.position.y = Math.sin(G.t * 4 + e.ph) * .12; }
    if (e.z > -.75 && e.z < .85 && e.lane === pl) {
      if (e.type === 'stone') { e.dead = .3; e.vx = 0; e.vy = 3; G.sharp = Math.min(G.max, G.sharp + 40); sfx('stone'); FX.glow('#cfe0ff', G.x, 1, 0, 3.5, .35, { follow: 1 }); FX.ring('#cfe0ff', G.x, 0, 1, .4, { grow: 5, follow: 1 }); }
      else if (e.type === 'oni') { if (immune) kill(e, true); else { const need = TR ? 0 : e.hard ? G.cost * HARD : G.cost; if (G.sharp >= need) { G.sharp -= need; G.lastCut = G.t; kill(e); RIG.play(G.cutN++ % 2 ? 'cutB' : 'cutA'); FX.trail.on(.3); } else die('dull'); } }
      else { if (brk) smash(e); else if (ghost) { } else die('obs'); }
    }
    if (e.z > 12) { e.m.visible = false; FREE[e.pk || e.type].push(e.m); ENT.splice(i, 1); }
  }
  return mv;
}
let tAll = 0, lastT = 0; const V1 = new THREE.Vector3(), V2 = new THREE.Vector3();
function frame(now) {
  if (!(DEV && window.__ticking)) requestAnimationFrame(frame);
  if (DEV && window.__manual && !window.__ticking) return;
  if (ST === 'title' || ST === 'grip' || ST === 'load') { renderer.toneMapping = THREE.ACESFilmicToneMapping; gripFrame(now); lastT = now; return; }
  const raw = (now - lastT) / 1000 || 0, dt = Math.min(.05, raw) * (DEV && window.__ts || 1); lastT = now; tAll += dt; if (document.hidden) return;
  renderer.toneMapping = THREE.NoToneMapping;
  let mv = 0; if (ST === 'run') mv = runStep(dt); else mv = 4 * dt;
  roadTex.offset.y += mv / 8; for (const s of SCEN) { s.m.position.z += mv; if (s.m.position.z > 16) s.m.position.z -= s.span; }
  const inRun = ST === 'run', still = !!TR && !TR.move, run = inRun && !G.over && RIG.loop() !== 'calm' && !still, slow = inRun && (G.hit > 0 ? .3 : 1) * (G.slowT > 0 ? Math.max(.6, G.slowS) : 1);
  WREF.x = inRun ? G.x : 0; RIG.root.position.x = WREF.x; laneGlow.position.x = inRun ? lx(G.lane) : 0; laneGlow.material.opacity += ((inRun && !G.over ? .42 : 0) - laneGlow.material.opacity) * Math.min(1, dt * 8); RIG.root.rotation.z = inRun ? clamp((lx(G.lane) - G.x) * -.3, -.35, .35) : 0;
  RIG.step(dt * (inRun ? slow || 1 : 1), run, run ? 13 + G.speed * .25 : 3);
  RIG.root.updateMatrixWorld(true); RIG.J.kat.localToWorld(V1.set(0, .18, 0)); RIG.J.kat.localToWorld(V2.set(0, 1.34, 0)); FX.trail.step(dt, V1, V2); FX.dragon.step(dt);
  const pp = P.pg.attributes.position; for (let i = 0; i < P.pv.length; i++) { let y = pp.getY(i) + P.pv[i] * dt; if (y > 2.9) y = 0; pp.setY(i, y); } pp.needsUpdate = true;
  const pulse = .85 + .15 * Math.sin(tAll * 5); P.aura.scale.set(3.0 * pulse, 4.0 * pulse, 1);
  FX.step(dt, mv);
  if (inRun) { G.shake = Math.max(0, G.shake - dt * 1.8); hudStep(); }
  const sh = inRun ? G.shake : 0, cx = inRun ? G.x * .35 : 0; if (inRun && TR && (!TR.move || TR.auto)) { const cp = Math.cos(TR.pit), r = TR.rad; camera.position.set(G.x + Math.sin(TR.ang) * cp * r + (Math.random() - .5) * sh, 1.1 + Math.sin(TR.pit) * r + (Math.random() - .5) * sh, -4 + Math.cos(TR.ang) * cp * r); camera.lookAt(G.x, 1.1, -4); } // トレーニング場で止まっているとき・自動で出しているときは、まわりを回って見られる
  else { camera.position.set(CAM.x + cx + (Math.random() - .5) * sh, CAM.y + (Math.random() - .5) * sh, CAM.z); camera.lookAt(cx, 1.1, -10); }
  zoneStep();
  renderer.render(scene, camera);
  if (inRun && G.snapT > 0) { G.snapT -= dt; if (G.snapT <= 0) { doSnap(); G.snapBest = G.snapP; } }
  if (inRun && !G.over) BGM.tick(TR ? 0 : Math.min(1, G.dist / 1800));
  // 重い端末では自動で軽くする（2回つづけて40コマ/秒を下まわったら1段さげる）
  if (inRun && !G.over && !DEV && !TR && raw < .2) { qT += raw; if (++qN >= 100) { if (qT / qN > 1 / 40) { if (++qBad >= 2 && QL < 2) { QL++; qBad = 0; ls.set('onikiri_q', QL); applyQ(); } } else qBad = 0; qT = qN = 0; } }
}
let QL = ls.get('onikiri_q', 0), qT = 0, qN = 0, qBad = 0; const DPR = Math.min(2, window.devicePixelRatio || 1);
function applyQ() { renderer.setPixelRatio(QL === 0 ? DPR : QL === 1 ? Math.min(DPR, 1.5) : 1); renderer.setSize(innerWidth, innerHeight, false); OUT.visible = OUTN.visible = QL < 1; FX.q = QL >= 2 ? .5 : 1; P.pm.visible = QL < 2; }
if (QL) applyQ();
// 画面の上の表示
const SHC = ['#e24b4a', '#ef9f27', '#f5d04a', '#63b03a', '#3f8ef0', '#f4f6f9'];
let hudLast = {};
function hudStep(force) {
  const segs = $('sh').children; for (let i = 0; i < 6; i++) { const lo = i * 100 / 6, hi = lo + 100 / 6, f = clamp((G.sharp - lo) / (hi - lo), 0, 1); const b = segs[i].firstChild; b.style.width = (f * 100).toFixed(0) + '%'; b.style.background = SHC[i]; segs[i].className = G.max <= lo + 1 ? 'lock' : ''; }
  $('sh').className = G.cost > .2 && G.sharp < G.cost ? 'low' : '';
  const d = Math.floor(G.dist); if (force || d !== hudLast.d) { $('dM').textContent = d.toLocaleString() + 'm'; hudLast.d = d; } if (force || G.kills !== hudLast.k) { $('dK').textContent = killsT(G.kills); hudLast.k = G.kills; }
  const full = G.gauge >= 100 && !G.fx; $('wzTip').hidden = !(full && G.wz.length && TIPN < 3); $('wzA').style.setProperty('--p', G.gauge.toFixed(0)); $('wzB').style.setProperty('--p', G.gauge.toFixed(0)); $('wzA').classList.toggle('full', full);
}
let TIPN = ls.get('onikiri_tip', 0); const ACTHIT = { slashH: .2, slashH2: .16, flipV: .2, rise: .22, smash: .44, thrust: .2, iai: .4 };
// 結果の画像に使う一枚：型を出した瞬間（なければ鬼を斬った瞬間）の画面を写しておく
const SNAP = document.createElement('canvas'); SNAP.width = 1080; SNAP.height = 810; let snapHas = false;
function reqSnap(pri, delay) { if (ST === 'run' && !TR && pri >= (G.snapBest || 0) && pri >= (G.snapT > 0 ? G.snapP : 0)) { G.snapT = delay; G.snapP = pri; } }
function doSnap() { try { const c = renderer.domElement, cw = c.width, ch = c.height; let sw = Math.min(cw, ch * 1.2), sh = sw * .75; if (sh > ch) { sh = ch; sw = sh / .75; } SNAP.getContext('2d').drawImage(c, (cw - sw) / 2, clamp(ch * .5 - sh / 2, 0, ch - sh), sw, sh, 0, 0, 1080, 810); snapHas = true; } catch (e) { } }
const wzShort = w0 => { const w = lw(w0); let n = w[1];
  if (L !== 'ja') { if (w0[1][0] === '（') return w[0]; for (const c of [' - ', ': ', ', ']) if (wlen(n) > 12 && n.includes(c)) n = n.slice(n.lastIndexOf(c) + c.length); if (R && R.oni && L !== 'en') for (const c of [' ', '・', '·']) if (n.length > 7 && n.includes(c)) n = n.slice(n.lastIndexOf(c) + 1); return n; }
  if (R && R.oni) { if (n.length > 7 && n.includes(' ')) n = n.slice(n.lastIndexOf(' ') + 1); if (n.length > 7 && n.includes('・')) n = n.slice(n.lastIndexOf('・') + 1); return n; } return n[0] === '（' ? w[0] : n; };
// 文字の幅のめやす（英数字は半分）
const wlen = s => { let n = 0; for (const c of s) n += c.charCodeAt(0) < 0x2000 ? .52 : 1; return n; };
function hudWaza() { if (!G.wz.length) return; const set = (id, t, sz) => { const b = $(id).firstChild, n = wlen(t); b.textContent = t; b.style.wordBreak = L === 'en' ? 'normal' : ''; b.style.fontSize = sz(n); };
  set('wzA', wzShort(G.wz[G.sel]), n => n > 16 ? '8.5px' : n > 11 ? '9.5px' : n > 7 ? '10.5px' : n > 5 ? '12px' : ''); if (G.wz.length > 1) set('wzB', wzShort(G.wz[1 - G.sel]), n => n > 12 ? '6.5px' : n > 8 ? '7.5px' : n > 5 ? '9px' : ''); }
function swapWaza() { if (ST !== 'run' || TR || G.wz.length < 2 || G.fx) return; G.sel = 1 - G.sel; hudWaza(); sfx('move'); gsap.fromTo('#wzA', { scale: .8 }, { scale: 1, duration: .15 }); }
function move(d) { if (ST !== 'run' || G.over) return; if (G.fx && G.fx.p.k === 'flow') return; const l = clamp(G.lane + d, 0, 4); if (l !== G.lane) { G.lane = l; sfx('move'); } }
// 移動：タップ（左半分・右半分）でも、指を横にスライドでも動ける。スライドは指を動かした分だけレーンを移る
{ const gl = $('gl'), PT = new Map(), stepW = () => clamp(innerWidth * .14, 34, 70), orbit = () => ST === 'run' && TR && (!TR.move || TR.auto); let pin = 0;
  gl.addEventListener('pointerdown', e => { if (ST !== 'run') return; e.preventDefault(); PT.set(e.pointerId, { x: e.clientX, y: e.clientY, x0: e.clientX, slid: false }); pin = 0; try { gl.setPointerCapture(e.pointerId); } catch (_) { } });
  gl.addEventListener('pointermove', e => { const p = PT.get(e.pointerId); if (!p || ST !== 'run') return;
    if (orbit()) { // 止まっているとき：なぞると回る、2本指で近づく・はなれる
      if (PT.size >= 2) { const dx0 = e.clientX - p.x, dy0 = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY; p.slid = true; const a = [...PT.values()], d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); if (pin) TR.rad = clamp(TR.rad * pin / Math.max(20, d), 5, 45); pin = d; for (const q of a) q.slid = true; return; }
      const dx = e.clientX - p.x, dy = e.clientY - p.y; if (!p.slid && Math.hypot(e.clientX - p.x0, dy) < 8) return; p.slid = true; p.x = e.clientX; p.y = e.clientY; TR.ang -= dx * .009; TR.pit = clamp(TR.pit + dy * .006, .06, 1.45); return; }
    const S = stepW(); for (let i = 0; i < 4; i++) { const dx = e.clientX - p.x, thr = p.slid ? S : S * .6; if (Math.abs(dx) < thr) break; const d = dx > 0 ? 1 : -1, l = G.lane; move(d); p.slid = true; p.x = G.lane === l ? e.clientX : p.x + d * thr; } });
  const end = e => { const p = PT.get(e.pointerId); if (!p) return; PT.delete(e.pointerId); pin = 0; if (!p.slid && e.type === 'pointerup' && ST === 'run') move(p.x0 < innerWidth / 2 ? -1 : 1); };
  gl.addEventListener('pointerup', end); gl.addEventListener('pointercancel', end);
  gl.addEventListener('wheel', e => { if (orbit()) { e.preventDefault(); TR.rad = clamp(TR.rad * (e.deltaY > 0 ? 1.1 : .9), 5, 45); } }, { passive: false }); }
{ let sx = 0, sy = 0, tg = null; const b = $('wzBtns');
  b.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); sx = e.clientX; sy = e.clientY; tg = e.target.closest('.wzc'); try { b.setPointerCapture(e.pointerId); } catch (_) { } });
  b.addEventListener('pointerup', e => { const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.hypot(dx, dy) > 22 || (tg && tg.id === 'wzB')) swapWaza(); else useWaza(); tg = null; }); }
addEventListener('keydown', e => { if (ST !== 'run') return; if (e.key === 'ArrowLeft' || e.key === 'a') move(-1); else if (e.key === 'ArrowRight' || e.key === 'd') move(1); else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); useWaza(); } else if (e.key === 'ArrowUp' || e.key === 'Shift' || e.key === 'w') swapWaza(); });

// ---------- トレーニング場 ----------
// 入れた名前のキャラのまま、技を何回でも試せる。走りながら／止まって（止まっているときは360度まわして見られる）。当たり判定の表示つき
const trBusy = () => !!(G.fx || G.pend.length || TR.lock > 0); // 技が出ているあいだ（ふつうに斬る動きは数えない）
const trCell = (k, l) => ((k === 2 && (l === 0 || l === 4)) || (k === 6 && (l === 1 || l === 3)) ? 'obs' : 'oni'); // 的のならび（障害物も少し置く）
function trRow(z) { TR.n = (TR.n || 0) + 1; const ob = TR.n % 4 === 0 ? (TR.n % 8 === 0 ? [0, 4] : [1, 3]) : []; for (let l = 0; l < 5; l++) spawn(ob.includes(l) ? 'obs' : 'oni', l, z, TR.n % 5 === 0 && l === 2); }
function trFill() { for (let k = 0; k < 9; k++) { const z = -6 - 8 * k; for (let l = 0; l < 5; l++) { if (ENT.some(e => e.lane === l && Math.abs(e.z - z) < 1)) continue; spawn(trCell(k, l), l, z, k === 4 && l === 2); } } }
function trEnts() { for (const e of ENT) { e.m.visible = false; FREE[e.pk || e.type].push(e.m); } ENT.length = 0; TR.re = 0; TR.n = 0; for (const sc of SCEN) sc.m.visible = TR.move && !TR.auto; /* まわして見るときは、まわりの建物をどかす */ if (TR.move) { for (let z = -22; z > -124; z -= 9) trRow(z); G.next = 9; } else trFill(); }
function trStep(dt) {
  if (TR.lock > 0) TR.lock -= dt; G.sharp = G.max; const busy = trBusy(); if (!busy) G.gauge = 100;
  if (!TR.move) { if (busy) TR.re = 0; else { TR.re += dt; if (TR.re > .8) { TR.re = 0; trFill(); } } } // 止まっているとき：技が終わったら的を補充
  if (!busy && TR.q) { const f = TR.q; TR.q = null; f(); }
  if (TR.auto && !busy) { TR.at = (TR.at || 0) + dt; if (TR.at > (TR.move ? .7 : 1.4)) { TR.at = 0; useWaza(); } } else TR.at = 0; // 自動：技が終わるたびに、少し間をおいて次を出す
  const dis = busy && !TR.auto; if (dis !== TR.busy) { TR.busy = dis; for (const id of ['trPrev', 'trNext', 'trMove']) $(id).disabled = dis; }
}
function trPaint() {
  const w = G.wz[0], wl = lw(w), nm = $('trName'); $('trBar').classList.toggle('lat', L === 'en'); nm.children[0].textContent = (R.oni || (R.ot && wl[0] === R.kk) ? '' : wl[0] + '　') + wl[1]; nm.children[1].textContent = descT(w[3]); nm.children[2].textContent = (TR.i + 1) + '/' + TR.list.length;
  $('trZone').textContent = T.trZone(TR.zone); $('trZone').classList.toggle('on', TR.zone); $('trMove').textContent = T.trMove(TR.move); $('trAuto').textContent = T.trAuto(TR.auto); $('trAuto').classList.toggle('on', TR.auto); $('trHelp').textContent = TR.auto ? T.trHelpAuto : TR.move ? T.trHelpRun : T.trHelpStop;
  gsap.killTweensOf('#trHelp'); gsap.fromTo('#trHelp', { opacity: .9 }, { opacity: 0, duration: .6, delay: 4 });
}
function trSet(d) { if (!TR) return; if (trBusy()) { toast(T.trBusy); if (TR.auto) TR.q = () => trSet(d); return; } /* 自動のときは、技が終わったら切りかえる */ const n = TR.list.length; TR.i = (TR.i + d + n) % n; G.wz = [wzOf(R)[TR.list[TR.i]]]; G.sel = 0; G.gauge = 100; hudWaza(); FX.trail.key(KEY()); trPaint(); sfx('move'); }
function openTraining() {
  const un = R.forms; if (!un.length) return; const first = SEL.length ? un.indexOf(SEL[SEL.length - 1]) : -1;
  TR = { move: true, zone: true, ang: 0, pit: .3, rad: 14, list: un.slice(), i: first < 0 ? un.length - 1 : first, re: 0, n: 0, busy: null, lock: 0, auto: false, at: 0 };
  $('pick').hidden = true; ac(); const go = () => { if (ST !== 'pick' || !TR) return; SEL = [TR.list[TR.i]]; newRun(); trPaint(); };
  if (R.oni) { if (!KISHI) toast(T.loadM); loadModels().then(go).catch(go); } else go();
}
function closeTraining() { if (!TR) return; TR = null; for (const sc of SCEN) sc.m.visible = true; G.fx = null; G.pend.length = 0; G.slowT = 0; FX.dragon.stop(); BGM.stop(); gsap.killTweensOf('#tint'); gsap.set('#tint', { opacity: 0 }); $('hud').classList.remove('tr'); $('trBar').hidden = true; zoneStep(); openPick(); }
document.querySelectorAll('#trBar button').forEach(b => b.addEventListener('click', () => b.blur())); // 押したあとにスペースキーで同じボタンが押されないように
$('trBtn').onclick = openTraining; $('trExit').onclick = closeTraining; $('trPrev').onclick = () => trSet(-1); $('trNext').onclick = () => trSet(1);
$('trAuto').onclick = () => { if (!TR) return; TR.auto = !TR.auto; TR.at = 0; TR.q = null; if (!TR.auto && TR.move) { TR.ang = 0; TR.pit = .3; TR.rad = 14; } for (const sc of SCEN) sc.m.visible = TR.move && !TR.auto; trPaint(); };
$('trZone').onclick = () => { if (!TR) return; TR.zone = !TR.zone; trPaint(); };
const trMode = () => { if (!TR) return; if (trBusy()) { toast(T.trBusy); if (TR.auto) TR.q = trMode; return; } TR.move = !TR.move; TR.ang = 0; TR.pit = .3; TR.rad = 14; G.slowT = 0; trEnts(); trPaint(); }; $('trMove').onclick = trMode;
// 当たり判定：技がとどく範囲を地面に出す（黄＝当たる範囲、水色＝相手を探しに行く範囲）
const ZN = [0, 0].map(() => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0xffe14a, transparent: true, opacity: .24, depthWrite: false, fog: false, side: THREE.DoubleSide })); m.rotation.x = -Math.PI / 2; m.visible = false; m.renderOrder = 3; const ed = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: 0xffe14a, transparent: true, opacity: .95, fog: false, depthWrite: false })); m.add(ed); scene.add(m); return m; });
function zoneStep() {
  ZN[0].visible = ZN[1].visible = false; if (!TR || !TR.zone || ST !== 'run' || !G.wz.length) return; const p = G.wz[0][3], F = G.fx;
  const rect = (m, l0, l1, zn, zf, col, op) => { m.visible = true; m.position.set((lx(l0) + lx(l1)) / 2, .05, (zn + zf) / 2); m.scale.set((l1 - l0 + 1) * LW, zn - zf, 1); m.material.color.set(col); m.material.opacity = op; m.children[0].material.color.set(col); };
  const span = Lw => (Lw >= 9 ? [0, 4] : [Math.max(0, G.lane - Lw), Math.min(4, G.lane + Lw)]), Y = '#ffe14a', B = '#4ad2ff';
  if (p.k === 'inst' || p.k === 'aura') { const s = span(p.L); rect(ZN[0], s[0], s[1], 1, -p.R, Y, .24); }
  else if (p.k === 'flow') { const Lw = p.grow ? (F ? Math.min(2, Math.floor(F.t / F.D * 3)) : 0) : p.L, s = span(Lw); rect(ZN[0], s[0], s[1], 1, -7, Y, .3); rect(ZN[1], 0, 4, -1, -34, B, .1); }
  else if (p.k === 'multi') rect(ZN[0], 0, 4, 1, -p.R, Y, .2);
  else if (p.k === 'rain') rect(ZN[0], 0, 4, -2.5, -p.R, Y, .22);
}
// ---------- 握る（前作「色変わりの刀」の場面をそのまま使う） ----------
function prep(name) { R = judge(name); R.name = name; R.akaDone = false; if (R.key === 'nezuko' || oniHas(name)) return setOni(R); R.kk = R.ot ? otSch(R.ot, L) : kk(R.key); R.forms = usable(R); R.slots = R.den >= 100 && R.forms.length >= 2 ? 2 : (R.forms.length ? 1 : 0); return R; }
// 鬼：原作の鬼は原作の血鬼術、鬼になった人は名前で決まる血鬼術。体の強さ（再生力）も名前で決まる
function setOni(R) { const o = oniInfo(R.name, R.ch); R.oni = o; R.ot = null; R.was = R.key; R.key = 'oni'; R.den = o.power; R.akaDone = false; WAZA.oni = o.arts; R.kk = kk('oni'); R.forms = o.arts.map((_, i) => i); R.slots = Math.min(o.carry, o.arts.length); loadModels(); return R; }
gripInvite(r => r.oni ? null : humanOf(r.name, r.ch) ? 'hum' : r.key === 'none' ? 'none' : r.den >= 90 ? 'tal' : null);
const killsT = n => (R && R.oni ? T.killsO(n) : T.kills(n)), artName = w => (R && R.oni ? w[1] : w[0] + ' ' + w[1]), descT = p => (L !== 'ja' ? descL(p, L, !!(R && R.oni)) : R && R.oni ? desc(p).replace(/鬼/g, '隊士').replace(/切れ味/g, '再生力').replace(/斬撃/g, '血鬼術').replace(/(\d)体/g, '$1人').replace(/一気に斬る/g, '一気になぎ払う').replace(/斬り続ける/g, '倒し続ける').replace(/斬り進む/g, '倒し進む').replace(/を斬る/g, 'を倒す') : desc(p));
// 鬼と隊士のモデル（Blender で作ったもの）。鬼で遊ぶときだけ読みこむ
let MODELS = null, KISHI = null;
function loadModels() { if (MODELS) return MODELS; const ld = new GLTFLoader(), one = f => new Promise((res, rej) => ld.load('models/' + f + '.glb?v=11272140', res, undefined, rej));
  MODELS = Promise.all([one('oni'), one('kishi')]).then(([o, k]) => { RIG.setOniModel(o); const g = {}; k.scene.traverse(n => { if (n.isMesh) g[n.name] = n; }); KISHI = g; return true; }).catch(e => { MODELS = null; throw e; }); return MODELS; }
function grip() {
  const name = $('nm').value.trim(); if (!name) { $('nmNote').textContent = T.needName; $('nmNote').classList.add('err'); gsap.fromTo('#nm', { x: -8 }, { x: 0, duration: .4, ease: 'elastic.out(1,.3)' }); return; }
  if (ST !== 'title') return; $('nmNote').textContent = ''; ac(); prep(name); ls.set('onikiri_name', name); $('title').hidden = true; $('hud').hidden = true; ST = 'grip'; gripSnd(SND); gripStart(R);
}
gripOnDone(r => { if (r !== R) return; if (R.becameOni) { R.becameOni = false; oniAdd(R.name); setOni(R); try { if (typeof gtag === 'function') gtag('event', 'become_oni', { game: 'onikiri' }); } catch (e) { } } flash(R.key === 'none' ? '#b9bec4' : COLORS[R.key].hex, .5); openPick(); });

// ---------- 技を選ぶ ----------
function openPick() {
  ST = 'pick'; clearEnts(); RIG.setLoop('idle'); setLook(1); $('hud').hidden = true; $('title').hidden = true; const W = wzOf(R) || [], C = COLORS[R.key], un = R.forms;
  $('pkWho').innerHTML = (R.oni ? T.whoOni : T.who)(R.name); const pc = $('pkCol'); pc.textContent = cl(R.key) + '　' + R.kk; pc.style.background = R.key === 'none' ? '#b9bec4' : C.hex; pc.style.color = new THREE.Color(R.key === 'none' ? '#b9bec4' : C.hex).getHSL({}).l > .55 ? '#14131c' : '#fff';
  const cost = costOf(R), mx = 70 + 30 * R.den / 100;
  if (R.oni) $('pkInfo').innerHTML = [R.oni.as && R.oni.as !== R.name ? T.oniAs(oniNameL(R.oni.as, L)) : '', R.oni.tier >= 0 ? T.oniTier((TIER[L] || TIER.en)[R.oni.tier]) : '', `${T.regen}：${T.regenInfo(cost, mx)}`].filter(Boolean).join('<br>');
  else $('pkInfo').innerHTML = (R.ot ? `<span style="opacity:.8">${esc(otWork(R.ot, L))}${L === 'ja' ? '' : '｜' + esc(otName(R.ot, L))}</span><br>` : '') + `${T.den} <b style="color:#fff">${R.den}%</b>${R.akaDone ? '<span class="aka">' + T.aka + '</span>' : ''}<br>${T.sharp}：${T.sharpInfo(cost, mx)}${R.akaDone && cost >= .2 ? '（' + T.akaInfo + '）' : ''}`;
  const saved = ls.get('onikiri_sel', {})[R.n]; SEL = (Array.isArray(saved) ? saved.filter(i => un.includes(i)) : []).slice(0, R.slots); for (let i = un.length - 1; i >= 0 && SEL.length < R.slots; i--) if (!SEL.includes(un[i])) SEL.push(un[i]);
  $('pkT').textContent = R.oni ? (R.slots === 2 ? T.pickO2(un.length) : T.pickO1(un.length)) : !un.length ? T.noWaza : (R.slots === 2 ? T.pick2(un.length) : T.pick1(un.length));
  const box = $('pkList'); box.innerHTML = W.map((w, i) => { const ok = un.includes(i), wl = lw(w); return `<button class="wl${ok ? '' : ' lock'}" data-i="${i}"${ok ? '' : ' disabled'}>${ok ? '' : `<em>${R.ch ? '—' : T.lockAt(needDen(i, W.length))}</em>`}<b>${R.oni ? '' : esc(wl[0]) + '　'}${esc(wl[1])}</b>${R.oni ? `<small style="opacity:.75">${esc(wl[0])}｜${esc(wl[2])}</small>` : R.ot ? `<small style="opacity:.75">${esc(wl[2])}</small>` : ''}<small>${esc(descT(w[3]))}</small></button>`; }).join('');
  const paint = () => box.querySelectorAll('.wl').forEach(b => b.classList.toggle('on', SEL.includes(+b.dataset.i)));
  box.querySelectorAll('.wl:not(.lock)').forEach(b => b.onclick = () => { const i = +b.dataset.i; if (SEL.includes(i)) { if (R.slots === 2 && SEL.length === 2) SEL = SEL.filter(v => v !== i); } else { SEL.push(i); while (SEL.length > R.slots) SEL.shift(); } paint(); sfx('move'); });
  $('trBtn').hidden = !un.length; paint(); $('pkHow').innerHTML = (R.oni ? T.howO : T.how) + (R.slots === 2 ? '<br>' + T.how2 : ''); $('pick').hidden = false; $('pick').scrollTop = 0;
}
$('goBtn').onclick = () => { if (R.slots && SEL.length < R.slots) { for (const i of R.forms.slice().reverse()) if (SEL.length < R.slots && !SEL.includes(i)) SEL.push(i); } const s = ls.get('onikiri_sel', {}); s[R.n] = SEL; ls.set('onikiri_sel', s); $('pick').hidden = true; ac(); if (R.oni) { if (!KISHI) toast(T.loadM); loadModels().then(() => { if (ST === 'pick') newRun(); }).catch(() => { if (ST === 'pick') newRun(); }); } else newRun(); };
$('pkBack').onclick = () => { $('pick').hidden = true; toTitle(); };
function toTitle() { $('hud').hidden = true; $('result').hidden = true; $('pick').hidden = true; clearEnts(); gripReset(); ST = 'title'; $('title').hidden = false; $('title').scrollTop = 0; }
$('startBtn').onclick = grip;
$('nm').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('nm').blur(); grip(); } });
$('prevBtn').onclick = () => { location.href = '../katana/'; };

// ---------- 結果 ----------
let LAST = null, POST = '';
function showResult() {
  ST = 'result'; $('hud').hidden = true; $('hint').hidden = true; const d = Math.floor(G.dist), k = G.kills, wz = Object.keys(G.used).join('、') || G.wz.map(artName).join('、');
  LAST = { d, k, wz }; const nb = d > BEST; if (nb) { BEST = d; ls.set('onikiri_best', d); }
  $('rWhy').textContent = (R.oni ? T.whyO : T.why)[G.why] || ''; $('rDist').innerHTML = d.toLocaleString() + '<small>m</small>'; $('rBest').textContent = nb ? T.newBest : T.best(BEST); $('rInfo').innerHTML = R.oni ? T.rInfoO(R, k, trWz(wz)) : T.rInfo(R, k, trWz(wz));
  POST = R.oni ? T.postO(R, d, k, G.wz.map(w => lw(w)[1]).join(L === 'en' ? ' / ' : '・')) : T.post(R, d, k); $('result').hidden = false; $('result').scrollTop = 0; gsap.fromTo('#result .card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: 'power3.out' });
  if (nb) fxAdd(PFX && PFX.fx.confetti, { x: 80, y: 60, seed: 11 });
  LAST.card = makeCard(R, d, k, wz).catch(() => null);
  try { if (typeof gtag === 'function') gtag('event', 'run_end', { game: 'onikiri', dist: d, kills: k, kokyu: R.key }); } catch (e) { }
  submit(d, k, wz).catch(() => { });
}
$('again').onclick = () => { $('result').hidden = true; newRun(); };
$('repick').onclick = () => { $('result').hidden = true; clearEnts(); openPick(); };
$('rename').onclick = () => { toTitle(); const n = $('nm'); n.value = ''; setTimeout(() => { try { n.focus(); } catch (e) { } }, 50); };
// 結果の画像（1080×1350）：上に型を出した瞬間の画面、下に名前・距離・呼吸・技
async function makeCard(R, d, k, wz) {
  const C = COLORS[R.key], tint = R.key === 'none' ? '#b9bec4' : (STY[R.key] || STY.none).c, W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const F = (s, w) => `${w || 800} ${s}px "Hiragino Mincho ProN","Yu Mincho","Noto Serif JP","Noto Serif CJK JP",serif`;
  const fit = (t, size, w, maxW) => { let z = size; x.font = F(z, w); while (z > 18 && x.measureText(t).width > maxW) { z -= 2; x.font = F(z, w); } };
  x.fillStyle = '#0b0b12'; x.fillRect(0, 0, W, H);
  if (snapHas) x.drawImage(SNAP, 0, 0, W, 810); const fade = x.createLinearGradient(0, 610, 0, 830); fade.addColorStop(0, '#0b0b1200'); fade.addColorStop(1, '#0b0b12'); x.fillStyle = fade; x.fillRect(0, 610, W, 230);
  x.strokeStyle = '#c9a14a'; x.lineWidth = 3; x.strokeRect(22, 22, W - 44, H - 44); x.strokeStyle = '#c9a14a55'; x.strokeRect(34, 34, W - 68, H - 68);
  x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  const who = (R.oni ? T.whoOni : T.who)(R.name).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  x.shadowColor = '#000'; x.shadowBlur = 12; x.fillStyle = '#e9e2cf'; fit(who, 44, 700, W - 160); x.fillText(who, W / 2, 800);
  const ds = d.toLocaleString() + 'm'; fit(ds, 190, 900, W - 200); x.shadowColor = tint; x.shadowBlur = 44; x.fillStyle = '#f6efdc'; x.fillText(ds, W / 2, 985); x.shadowBlur = 0;
  const l2 = R.oni ? T.cardO(R.oni.as && R.oni.as !== R.name ? oniNameL(R.oni.as, L) : '') : R.kk + '・' + T.den + ' ' + R.den + '%' + (R.akaDone ? '・' + T.akaS : ''); fit(l2, 46, 800, W - 300); const tw = Math.min(W - 160, x.measureText(l2).width + 90);
  x.fillStyle = R.key === 'none' ? '#b9bec4' : C.hex; x.shadowColor = tint; x.shadowBlur = 26; x.fillRect(W / 2 - tw / 2, 1020, tw, 76); x.shadowBlur = 0; x.strokeStyle = '#ffffff66'; x.lineWidth = 2; x.strokeRect(W / 2 - tw / 2, 1020, tw, 76);
  x.fillStyle = new THREE.Color(R.key === 'none' ? '#b9bec4' : C.hex).getHSL({}).l > .55 ? '#14131c' : '#ffffff'; x.fillText(l2, W / 2, 1074);
  const l3 = killsT(k) + (wz ? '　' + trWz(wz) : ''); x.fillStyle = '#cfc6b3'; fit(l3, 36, 600, W - 160); x.fillText(l3, W / 2, 1150);
  x.fillStyle = '#6d6680'; x.font = F(22, 600); x.fillText(T.fan, W / 2, 1196);
  x.fillStyle = '#c9a14a'; x.font = F(52); x.fillText(T.ttl, W / 2, 1262); x.fillStyle = '#9a93a8'; x.font = '600 28px ui-monospace,Menlo,monospace'; x.fillText('nasubi-no-oniwa.com/onikiri', W / 2, 1304);
  return await new Promise(r => c.toBlob(b => r(b), 'image/png'));
}
// Xに投稿（画像つき。自分の紹介ツイートを引用する。引用するツイートは一覧ページ quote/ で切りかえ）
let QUOTE = {};
fetch('https://ft-red-default-rtdb.asia-southeast1.firebasedatabase.app/xquote/g/onikiri.json').then(r => r.json()).then(d => { if (d && typeof d === 'object') QUOTE = d; }).catch(() => { });
function quoteURL() { const u = (L === 'ja' ? QUOTE.ja : QUOTE.en) || ''; return /^https:\/\/x\.com\/[A-Za-z0-9_]{1,15}\/status\/\d{5,25}$/.test(u) ? u : ''; }
const cardFile = b => new File([b], 'onikiri.png', { type: 'image/png' });
function saveBlob(b, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name || 'onikiri.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); }
$('xBtn').addEventListener('click', async () => {
  if (!LAST) return; const q = quoteURL(); let b = null; try { b = await LAST.card; } catch (e) { }
  if (b && IS_PHONE && navigator.canShare) { const f = cardFile(b); try { if (navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], text: POST + (q ? '\n' + q : '') }); try { if (typeof gtag === 'function') gtag('event', 'x_share', { game: 'onikiri', via: 'sheet' }); } catch (e) { } return; } } catch (e) { if (e && e.name === 'AbortError') return; } }
  let how = 0; if (b) { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]); how = 1; } catch (e) { if (!IS_PHONE) { try { saveBlob(b); how = 2; } catch (_) { } } } }
  if (how) toast(how === 1 ? T.xCopied : T.xSaved);
  const u = 'https://x.com/intent/post?text=' + encodeURIComponent(POST) + (q ? '&url=' + encodeURIComponent(q) : ''); const w = window.open(u, '_blank'); if (!w) location.href = u;
});
$('imgBtn').addEventListener('click', async () => {
  if (!LAST) return; let b = null; try { b = await LAST.card; } catch (e) { } if (!b) return; const f = cardFile(b);
  try { if (IS_PHONE && navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  saveBlob(b);
});

// ---------- ランキング（otokonoji の onikiri/r と onikiri/b/呼吸） ----------
const FB = { key: 'AIzaSyAcJgJLVbuvx85_qEGJe1WhwsOelidxeYk', db: 'https://otokonoji-default-rtdb.asia-southeast1.firebasedatabase.app' };
async function fx(url, opt) { let err; for (let i = 0; i < 3; i++) { try { return await fetch(url, opt); } catch (e) { err = e; await new Promise(r => setTimeout(r, 400 * (i + 1))); } } throw err; }
let AUTH = null;
async function auth() {
  let a = AUTH || ls.get('onikiri_auth', null); if (a && a.exp > Date.now() + 60000) return AUTH = a;
  if (a && a.refresh) { try { const r = await fx('https://securetoken.googleapis.com/v1/token?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(a.refresh) }); if (r.ok) { const j = await r.json(); a = { uid: j.user_id, token: j.id_token, refresh: j.refresh_token, exp: Date.now() + (+j.expires_in) * 1000 }; ls.set('onikiri_auth', a); return AUTH = a; } } catch (_) { } }
  const r = await fx('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FB.key, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
  if (!r.ok) throw new Error('auth'); const j = await r.json(); a = { uid: j.localId, token: j.idToken, refresh: j.refreshToken, exp: Date.now() + (+j.expiresIn) * 1000 }; ls.set('onikiri_auth', a); return AUTH = a;
}
const DBU = p => FB.db + '/onikiri/' + p + '.json';
const dayKey = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10).replace(/-/g, ''); // 日本の日付
// 名前1つにつき1件：どの技の組みあわせでも、その名前でいちばん良い記録だけが残る（原作キャラは書き方がちがっても同じ1件）
function hkey(s) { const a = Math.floor(hash(s, 0x51ed) * 4294967296), b = Math.floor(hash(s, 0x9e37) * 4294967296); return (a.toString(36) + b.toString(36)).padStart(10, '0').slice(0, 14); }
const nameKey = r => hkey(r.ch ? 'c:' + r.ch : 'n:' + r.n);
async function submit(d, k, wz) {
  if (DEV || d < 30) return; if (R.oni) return submitOni(d, k, wz); if (R.ot) return submitOni(d, k, wz, 'etc'); const h = nameKey(R), day = dayKey(), sent = ls.get('onikiri_best2', {}), rec = { n: (R.ch || R.name).slice(0, 16), d, k: R.key, t: R.den, c: k, w: String(wz).slice(0, 60), a: R.akaDone ? 1 : 0, ts: { '.sv': 'timestamp' } };
  const doAll = d > (sent[h] || 0), doD = d > (sent[day + h] || 0); if (!doAll && !doD) return; const a = await auth(), q = '?auth=' + encodeURIComponent(a.token), o = { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rec) };
  // いまの記録より伸びていないときは、サーバーが書きこみを受けつけない（ほかの人が同じ名前でもっと走っているとき）
  if (doAll) { try { await fx(DBU('n/' + h) + q, o); await fx(DBU('k/' + R.key + '/' + h) + q, o); } catch (e) { } sent[h] = d; }
  if (doD) { try { await fx(DBU('t/' + day + '/' + h) + q, o); } catch (e) { } for (const x of Object.keys(sent)) if (/^20\d{6}/.test(x) && !x.startsWith(day)) delete sent[x]; sent[day + h] = d; }
  ls.set('onikiri_best2', sent);
}
async function submitOni(d, k, wz, kind) { // 鬼の記録は「鬼」、別作品の剣士の記録は「その他」のランキングにだけ載る（名前1つにつき1件）
  const K = kind || 'oni', h = nameKey(R), sent = ls.get('onikiri_best2', {}), key = (K === 'oni' ? 'o' : 'e') + h; if (d <= (sent[key] || 0)) return;
  const a = await auth(), rec = { n: (R.ch || R.name).slice(0, 16), d, k: K, t: R.den, c: k, w: String(wz).slice(0, 60), a: 0, ts: { '.sv': 'timestamp' } };
  try { await fx(DBU('k/' + K + '/' + h) + '?auth=' + encodeURIComponent(a.token), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rec) }); } catch (e) { } sent[key] = d; ls.set('onikiri_best2', sent);
}
let rkFrom = 'title', rkTab = 'all';
async function openRank(from) {
  rkFrom = from; $('title').hidden = true; $('result').hidden = true; $('rank').hidden = false; $('rank').scrollTop = 0;
  const ks = ORDER.filter(x => WAZA[x]), short = x => (COLORS[x].kokyu[L] || COLORS[x].kokyu.en).replace(/の呼吸$| Breathing$|之呼吸$|의 호흡$/, '');
  $('rkTabs').innerHTML = [['all', T.rkAll], ['today', T.rkToday]].map(t => `<button data-t="${t[0]}" class="${t[0] === rkTab ? 'on' : ''}">${esc(t[1])}</button>`).join('');
  $('rkK').innerHTML = ks.map(x => `<button data-t="${x}" class="${x === rkTab ? 'on' : ''}"><i style="background:${COLORS[x].hex}"></i>${esc(short(x))}</button>`).join('') + `<button data-t="none" class="${rkTab === 'none' ? 'on' : ''}"><i style="background:#b9bec4"></i>${esc(T.rkNone)}</button><button data-t="oni" class="${rkTab === 'oni' ? 'on' : ''}"><i style="background:#c8142c"></i>${esc(T.rkOni)}</button><button data-t="etc" class="${rkTab === 'etc' ? 'on' : ''}"><i style="background:${ETC.hex}"></i>${esc(ETC.name[L] || ETC.name.en)}</button>`; // 才能なしだけ・鬼だけのランキング
  document.querySelectorAll('#rkTabs button,#rkK button').forEach(b => b.onclick = () => { rkTab = b.dataset.t; openRank(rkFrom); });
  const box = $('rkBox'), tab = rkTab; box.innerHTML = '<p class="note">' + T.loading + '</p>';
  try { const r = await fx(DBU(tab === 'all' ? 'n' : tab === 'today' ? 't/' + dayKey() : 'k/' + tab) + '?orderBy=%22d%22&limitToLast=100'); if (!r.ok) throw 0; const j = (await r.json()) || {}; const me = R ? nameKey(R) : '';
    const rows = Object.entries(j).map(([u, v]) => Object.assign({ u }, v)).filter(v => v && typeof v.d === 'number').sort((a, b) => b.d - a.d).slice(0, 100);
    if ($('rank').hidden || tab !== rkTab) return; if (!rows.length) { box.innerHTML = '<p class="note">' + T.rkEmpty + '</p>'; return; }
    box.innerHTML = '<table class="rk">' + rows.map((v, i) => { const o = v.k === 'etc' ? otherByName(v.n) : null, C = o ? { hex: COLORS[o.k].hex, kokyu: { [L]: otWork(o, L) + '・' + otSch(o, L) } } : COLORS[v.k] || COLORS.none; return `<tr${v.u === me ? ' class="me"' : ''}><td class="n">${i + 1}</td><td>${esc(o ? otName(o, L) : v.n || '')}${v.a ? '<span class="aka">' + T.akaS + '</span>' : ''}<small><i style="background:${C.hex}"></i>${esc(C.kokyu[L] || C.kokyu.en)}${v.k === 'oni' ? '' : '・' + T.den + (+v.t || 0) + '%'}${v.w ? '・' + esc(trWz(String(v.w))) : ''}</small></td><td class="d">${(+v.d).toLocaleString()}m<small>${(v.k === 'oni' ? T.killsO : T.kills)(+v.c || 0)}</small></td></tr>`; }).join('') + '</table>';
  } catch (e) { if (tab === rkTab) box.innerHTML = '<p class="note err">' + T.rkErr + '</p>'; }
}
$('rkBtn').onclick = () => openRank('title'); $('rkBtn2').onclick = () => openRank('result');
$('rkBack').onclick = () => { $('rank').hidden = true; if (rkFrom === 'result' && LAST) $('result').hidden = false; else $('title').hidden = false; };

// ---------- はじめ ----------
applyLang(); gripSnd(SND); $('nm').value = ls.get('onikiri_name', '') || ''; $('load').hidden = true;
{ // 前作「色変わりの刀」の結果から来たとき：握る場面をとばして、すぐ技を選ぶところへ（名前は同じサイトの中で受けわたす）
  const go = /[?&]go=1/.test(location.search), h = go ? ls.get('onikiri_go', null) : null; let direct = false;
  if (h && h.n && Date.now() - (+h.t || 0) < 10 * 60e3) { const nm = String(h.n).trim().slice(0, 16); if (nm) { prep(nm); if (!R.oni && (R.ch ? R.aka : !!h.a)) R.akaDone = true; $('nm').value = nm; ls.set('onikiri_name', nm); direct = true; } }
  try { localStorage.removeItem('onikiri_go'); if (go) history.replaceState(null, '', location.pathname); } catch (e) { }
  if (direct) { openPick(); gsap.fromTo('#pick .card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'power3.out' }); }
  else { ST = 'title'; $('title').hidden = false; gsap.fromTo('#title .card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out' }); }
}
if (DEV) { window.__oni = n => { prep(n); if (!R.oni) setOni(R); return loadModels().then(() => { openPick(); return R.oni.arts.map(a => a[1]); }); }; window.__G = () => ({ ST, G, R, SEL, LAST, QL, ENT: ENT.length, FXL: FX.count() }); window.__spawnT = (t, lane, z) => spawn(t, lane, z); window.__bgm = BGM; window.__lg = laneGlow; }
if (DEV) window.__cast = (key, i) => { R.key = key; R.kk = kk(key); setLook(1); G.wz = [WAZA[key][i]]; G.sel = 0; G.gauge = 100; G.fx = null; G.over = 0; G.sharp = G.max; G.inv = 9; RIG.setLoop(null); useWaza(); return WAZA[key][i][1]; };
if (DEV) window.__castO = i => { G.wz = [WAZA.oni[i]]; G.sel = 0; G.gauge = 100; G.fx = null; G.over = 0; G.sharp = G.max; G.inv = 9; RIG.setLoop(null); hudWaza(); useWaza(); return WAZA.oni[i][1]; };
if (DEV) window.__pk = n => { prep(n); openPick(); return R.key; }; if (DEV) window.__castW = i => { G.wz = [wzOf(R)[i]]; G.sel = 0; G.gauge = 100; G.fx = null; G.over = 0; G.sharp = G.max; G.inv = 9; RIG.setLoop(null); hudWaza(); useWaza(); return G.wz[0][1]; }; if (DEV) window.__W = WAZA; if (DEV) window.__spawn = (lane, z, hard) => spawn('oni', lane, z, hard);
if (DEV) { window.__E = ENT; let fk = 0; window.__tick = () => { if (!fk) { fk = performance.now(); try { gsap.ticker.remove(gsap.updateRoot); } catch (e) { } } fk += 1000 / 30; window.__ticking = 1; try { gsap.updateRoot(fk / 1000); frame(fk); } finally { window.__ticking = 0; } }; window.__judge = n => { const r = judge(n); return [r.key, r.den, usable(r).length]; }; }
requestAnimationFrame(frame);
