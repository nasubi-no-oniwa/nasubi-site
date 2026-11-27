// 鬼と血鬼術（「色変わりの刀」と「無限鬼斬」で共通に使う）
// ・原作の鬼：原作どおりの血鬼術（名前・動き）
// ・鬼になった人：名前で決まる、このゲームだけの血鬼術
// ・鬼になったことは、その端末にだけ覚える（ランキングの剣士の記録は消さない）
import { WAZA } from './waza.js?v=11272105';
import { genArt, TIERL } from './i18n.js?v=11272105';

// ---------- 見た目（色と形）----------
export const ONI_STY = {
  oni: { kind: 'claw', c: '#c8142c', c2: '#ff9a8a', shape: 'ember' },
  k_thorn: { kind: 'claw', c: '#4a0818', c2: '#ff2a40', shape: 'spark' }, k_kbolt: { kind: 'bolt', c: '#3a3a55', c2: '#ffe14a', shape: 'spark' },
  k_ice: { kind: 'mist', c: '#7fd4ff', c2: '#f4fdff', shape: 'spark' }, k_lotus: { kind: 'petal', c: '#8fd8ff', c2: '#ffffff', shape: 'petal' },
  k_akaza: { kind: 'bolt', c: '#2f8cff', c2: '#e8f8ff', shape: 'spark' }, k_baku: { kind: 'flame', c: '#ff3a7a', c2: '#ffd0e0', shape: 'ember' },
  k_wood: { kind: 'snake', c: '#7a5a2a', c2: '#c8e08a', shape: 'rock' }, k_sonic: { kind: 'boom', c: '#c8c8ff', c2: '#ffffff', shape: 'puff' },
  k_spear: { kind: 'claw', c: '#6a4ad0', c2: '#d8d0ff', shape: 'spark' }, k_fish: { kind: 'wave', c: '#2aa8a0', c2: '#d0fff4', shape: 'drop' },
  k_sickle: { kind: 'moon', c: '#a00a20', c2: '#ff6a5a', shape: 'crescent' }, k_obi: { kind: 'ribbon', c: '#e84a8a', c2: '#ffe0a0', shape: 'streak' },
  k_thread: { kind: 'ribbon', c: '#f4f4ff', c2: '#ff4a5a', shape: 'streak' }, k_dream: { kind: 'mist', c: '#7a4ad0', c2: '#ffd0f0', shape: 'puff' },
  k_biwa: { kind: 'rock', c: '#c8a060', c2: '#fff0c8', shape: 'rock' }, k_drum: { kind: 'claw', c: '#e8e0d0', c2: '#ff5a3a', shape: 'spark' },
  k_scent: { kind: 'mist', c: '#e06aa8', c2: '#ffe8f4', shape: 'petal' }, k_paper: { kind: 'plain', c: '#f0e8d0', c2: '#ff3a3a', shape: 'spark' },
  k_hand: { kind: 'rock', c: '#5a7a5a', c2: '#c8e0c0', shape: 'rock' }, k_blood: { kind: 'flame', c: '#b3122a', c2: '#ff5a6a', shape: 'drop' },
  k_poison: { kind: 'mist', c: '#6ac83a', c2: '#e8ffb0', shape: 'puff' }, k_shadow: { kind: 'claw', c: '#3a2a6a', c2: '#b08aff', shape: 'spark' },
  k_bone: { kind: 'rock', c: '#e8e4d8', c2: '#ffffff', shape: 'rock' }, k_mirror: { kind: 'moon', c: '#9fdcff', c2: '#ffffff', shape: 'crescent' },
  k_ink: { kind: 'wave', c: '#2a2a3a', c2: '#9a9ab8', shape: 'drop' }, k_rust: { kind: 'flame', c: '#a85a1e', c2: '#ffb46a', shape: 'ember' },
  k_needle: { kind: 'claw', c: '#aab4c0', c2: '#ffffff', shape: 'spark' }, k_chain: { kind: 'snake', c: '#8a8f98', c2: '#e8ecf0', shape: 'spark' },
};

// ---------- 原作の鬼 ----------
// [見出し, 技名, 原作の動き, 効果]（効果の書き方は waza.js と同じ。sty=見た目）
const A = (name, desc, p) => ['血鬼術', name, desc, p];
const reuse = (key, idx, sty, head) => idx.map(i => { const w = WAZA[key][i]; return [head + ' ' + w[0], w[1], w[2], Object.assign({}, w[3], { sty })]; });
export const KEKKI = {
  '鬼舞辻無惨': { power: 100, carry: 2, arts: [
    A('黒血枳棘', '血でできた有刺鉄線のような棘を広くまき散らす', { k: 'inst', L: 9, R: 30, O: 1, v: 'storm', sty: 'k_thorn' }),
    A('管と触手', '腕と背から生えた管を鞭のように振りまわす', { k: 'aura', L: 2, R: 9, D: 5, O: 1, v: 'vortex', sty: 'k_thorn' }),
    A('衝撃波', '全方位を吹き飛ばす', { k: 'inst', L: 9, R: 55, O: 1, I: 1, v: 'mega', sty: 'k_thorn' })] },
  '黒死牟': { power: 100, carry: 2, arts: reuse('purple', WAZA.purple.map((_, i) => i), 'purple', '月の呼吸') },
  '獪岳': { power: 86, carry: 1, arts: reuse('yellow', [1, 2, 3, 4, 5], 'k_kbolt', '雷の呼吸') },
  '童磨': { power: 99, carry: 2, arts: [
    A('蓮葉氷', '扇を振って蓮の形の氷を生む', { k: 'inst', L: 1, R: 14, v: 'arcH', sty: 'k_lotus' }),
    A('枯園垂り', '冷気をまとった扇で続けざまに斬る', { k: 'multi', N: 6, R: 22, v: 'arcs', sty: 'k_ice' }),
    A('凍て曇', '凍てつく霧を広げて動きを鈍らせる', { k: 'slow', D: 4.5, S: .35, v: 'eye', sty: 'k_ice' }),
    A('蔓蓮華', '氷の蔓を伸ばして捕らえる', { k: 'multi', N: 8, R: 34, v: 'arcs', sty: 'k_lotus' }),
    A('寒烈の白姫', '氷の巫女が広い範囲を凍らせる息を吹く', { k: 'inst', L: 9, R: 28, v: 'arcH', sty: 'k_ice' }),
    A('冬ざれ氷柱', '頭の上から巨大な氷柱を降らせる', { k: 'rain', D: 4, R: 30, O: 1, v: 'rain', sty: 'k_ice' }),
    A('散り蓮華', '細かな氷の花びらを舞わせる', { k: 'aura', L: 2, R: 9, D: 4, v: 'vortex', sty: 'k_lotus' }),
    A('結晶ノ御子', '自分と同じ技を使う氷の人形を出す', { k: 'flow', L: 1, D: 6, v: 'ribbon', sty: 'k_ice' }),
    A('霧氷・睡蓮菩薩', '巨大な氷の菩薩像で叩きつぶす', { k: 'inst', L: 9, R: 55, O: 1, I: 1, v: 'mega', sty: 'k_ice' })] },
  '猗窩座': { power: 98, carry: 2, arts: [
    A('術式展開 破壊殺・羅針', '雪の結晶の陣で闘気を読み、すべてを見切る', { k: 'slow', D: 5, S: .3, v: 'eye', sty: 'k_akaza', ring: 1 }),
    A('破壊殺・空式', '拳で空を打ち、離れた相手に衝撃を飛ばす', { k: 'inst', L: 0, R: 42, v: 'thrust', sty: 'k_akaza' }),
    A('破壊殺・乱式', '拳の乱れ打ち', { k: 'multi', N: 8, R: 20, v: 'arcs', sty: 'k_akaza' }),
    A('破壊殺・滅式', '全力で踏みこむ突進の一撃', { k: 'inst', L: 1, R: 36, O: 1, I: .8, v: 'dash', a: 'iai', sty: 'k_akaza' }),
    A('破壊殺・脚式 冠先割', '下から蹴り上げる', { k: 'inst', L: 0, R: 12, O: 1, v: 'arcUp', sty: 'k_akaza' }),
    A('破壊殺・脚式 流閃群光', '続けざまの蹴り', { k: 'multi', N: 6, R: 24, v: 'arcs', sty: 'k_akaza' }),
    A('破壊殺・脚式 飛遊星千輪', '回りながら蹴り上げる', { k: 'aura', L: 1, R: 8, D: 2.5, v: 'spin', sty: 'k_akaza' }),
    A('破壊殺・砕式 万葉閃柳', '地面を叩き割る', { k: 'inst', L: 2, R: 14, O: 1, v: 'fall', sty: 'k_akaza' }),
    A('破壊殺・鬼芯八重芯', '左右四発ずつの乱れ打ち', { k: 'multi', N: 8, R: 28, v: 'arcs', sty: 'k_akaza' }),
    A('破壊殺・終式 青銀乱残光', '全方向へほぼ同時に百発を打ちこむ', { k: 'inst', L: 9, R: 50, O: 1, I: 1, v: 'mega', sty: 'k_akaza' })] },
  '半天狗': { power: 96, carry: 2, arts: [
    A('積怒の雷', '錫杖を打ち鳴らして雷を落とす', { k: 'rain', D: 3.5, R: 28, v: 'rain', sty: 'yellow' }),
    A('可楽の団扇', '葉の団扇で突風を起こし、吹き飛ばす', { k: 'inst', L: 9, R: 24, O: 1, v: 'arcH', sty: 'green' }),
    A('空喜の超音波', '口から音の波を放つ', { k: 'inst', L: 1, R: 36, v: 'claws', sty: 'k_sonic' }),
    A('激涙刺突', '哀絶の槍の五連突き', { k: 'multi', N: 5, R: 24, v: 'arcs', sty: 'k_spear' }),
    A('狂鳴雷殺', '憎珀天。雷と音の波を合わせて放つ', { k: 'inst', L: 9, R: 40, O: 1, v: 'storm', sty: 'yellow' }),
    A('狂圧鳴波', '憎珀天。口から強烈な音の波', { k: 'inst', L: 2, R: 46, O: 1, v: 'storm', sty: 'k_sonic' }),
    A('無間業樹', '憎珀天。木の竜を次々に生やして襲わせる', { k: 'flow', L: 1, D: 6, v: 'dragon', sty: 'k_wood' })] },
  '玉壺': { power: 95, carry: 2, arts: [
    A('千本針 魚殺', '壺から出た金魚が毒の針を吐く', { k: 'multi', N: 10, R: 30, v: 'arcs', sty: 'k_fish' }),
    A('水獄鉢', '水の壺に閉じこめて息をさせない', { k: 'slow', D: 5, S: .3, v: 'eye', sty: 'k_fish' }),
    A('蛸壺地獄', '壺から巨大な蛸の足が飛び出す', { k: 'aura', L: 2, R: 9, D: 4, O: 1, v: 'vortex', sty: 'k_fish' }),
    A('一万滑空粘魚', '一万匹の魚を飛ばして喰らわせる', { k: 'rain', D: 5, R: 34, v: 'rain', sty: 'k_fish' }),
    A('陣殺魚鱗', '真の姿。鱗で縦横に跳ねまわる', { k: 'flow', L: 2, D: 5, v: 'ribbon', sty: 'k_fish' }),
    A('神の手', '真の姿。触れたものを魚に変える拳', { k: 'inst', L: 1, R: 16, O: 1, v: 'arcH', sty: 'k_fish' })] },
  '妓夫太郎': { power: 94, carry: 2, arts: [
    A('飛び血鎌', '血の斬撃を飛ばす', { k: 'inst', L: 1, R: 34, v: 'arcH', sty: 'k_sickle' }),
    A('跋扈跳梁', '血の斬撃を身のまわりにめぐらせる', { k: 'aura', L: 1, R: 8, D: 4, v: 'spin', sty: 'k_sickle' }),
    A('円斬旋回・飛び血鎌', '腕から渦をまく血の斬撃を広く放つ', { k: 'inst', L: 9, R: 40, O: 1, v: 'storm', sty: 'k_sickle' })] },
  '堕姫': { power: 90, carry: 2, arts: [
    A('帯', '帯を自在に伸ばして斬る', { k: 'multi', N: 7, R: 28, v: 'arcs', sty: 'k_obi' }),
    A('八重帯斬り', '逃げ場なく交差させた帯で斬る', { k: 'inst', L: 9, R: 26, v: 'claws', sty: 'k_obi' })] },
  '累': { power: 80, carry: 1, arts: [
    A('刻糸牢', '糸の籠に閉じこめて刻む', { k: 'inst', L: 1, R: 16, O: 1, v: 'claws', sty: 'k_thread' }),
    A('殺目篭', '糸の籠を一気に狭める', { k: 'aura', L: 1, R: 8, D: 3, v: 'spin', sty: 'k_thread' }),
    A('刻糸輪転', 'いちばん硬い糸を渦のように放つ', { k: 'inst', L: 9, R: 34, O: 1, v: 'storm', sty: 'k_thread' })] },
  '魘夢': { power: 78, carry: 1, arts: [
    A('強制昏倒催眠の囁き', '「眠れ」のささやきで眠りに落とす', { k: 'slow', D: 5, S: .3, v: 'eye', sty: 'k_dream' }),
    A('強制昏倒睡眠・眼', '目が合った相手を眠らせる', { k: 'aura', L: 9, R: 10, D: 4, v: 'calm', sty: 'k_dream' })] },
  '鳴女': { power: 92, carry: 2, arts: [
    A('琵琶', '琵琶の音で無限城の部屋を動かし、相手を遠くへ飛ばす', { k: 'inst', L: 9, R: 30, v: 'arcH', sty: 'k_biwa' }),
    A('襖', '足もとに襖を開いて落とす', { k: 'rain', D: 4, R: 30, O: 1, v: 'rain', sty: 'k_biwa' })] },
  '響凱': { power: 70, carry: 1, arts: [
    A('鼓（爪）', '鼓を打つと、爪あとのような斬撃が走る', { k: 'inst', L: 1, R: 30, v: 'claws', sty: 'k_drum' }),
    A('鼓（回転）', '鼓を打つと、部屋が回って足場を奪う', { k: 'slow', D: 4, S: .4, v: 'eye', sty: 'k_drum' }),
    A('尚速鼓打ち', '目にもとまらぬ速さで鼓を打ち続ける', { k: 'multi', N: 9, R: 30, v: 'arcs', sty: 'k_drum' })] },
  '珠世': { power: 75, carry: 1, arts: [
    A('惑血 視覚夢幻の香', '血の香りで幻を見せる', { k: 'slow', D: 6, S: .3, v: 'eye', sty: 'k_scent' }),
    A('惑血 白日の魔香', '嗅ぐと嘘がつけなくなる香り', { k: 'aura', L: 9, R: 9, D: 3.5, v: 'calm', sty: 'k_scent' })] },
  '愈史郎': { power: 65, carry: 1, arts: [
    A('紙眼', '札を使って姿と気配を隠す', { k: 'aura', L: 9, R: 8, D: 5, G: 1, v: 'calm', sty: 'k_paper' })] },
  '手鬼': { power: 55, carry: 1, arts: [
    A('無数の手', '体じゅうの手を伸ばしてつかむ', { k: 'multi', N: 6, R: 22, v: 'arcs', sty: 'k_hand' }),
    A('地中の手', '地面の下から手を突き上げる', { k: 'rain', D: 3, R: 24, v: 'rain', sty: 'k_hand' })] },
  '禰豆子': { power: 85, carry: 1, arts: [
    A('爆血', '自分の血を燃やして爆ぜさせる', { k: 'inst', L: 2, R: 26, O: 1, v: 'storm', sty: 'k_baku' })] },
};
// 鬼になる前の名前 → 鬼になったあとの名前（この名前は剣士として握れる。誘いは必ず出て、なれば原作どおりの鬼）
const HUMAN = { '継国巌勝': '黒死牟', '巌勝': '黒死牟', 'つぎくにみちかつ': '黒死牟', 'みちかつ': '黒死牟', '狛治': '猗窩座', 'はくじ': '猗窩座', '梅': '堕姫', 'うめ': '堕姫', '益魚儀': '玉壺', 'まなぎ': '玉壺', '竈門禰豆子': '禰豆子', '禰豆子': '禰豆子', 'かまどねずこ': '禰豆子', 'ねずこ': '禰豆子', '竃門禰豆子': '禰豆子', '竈門祢豆子': '禰豆子', '祢豆子': '禰豆子' };
// 「上弦の参」などの呼び名 → その鬼（[呼び名, 鬼の名前] の一覧。ひらがな・漢数字・数字のどれでも）
export const ONI_TITLES = (() => {
  const num = [['壱', '一', '1', 'いち'], ['弐', '二', '2', 'に'], ['参', '三', '3', 'さん'], ['肆', '四', '4', 'し', 'よん'], ['伍', '五', '5', 'ご'], ['陸', '六', '6', 'ろく']];
  const who = { 上弦: ['黒死牟', '童磨', '猗窩座', '半天狗', '玉壺', '妓夫太郎'], 下弦: ['魘夢', null, null, null, '累', '響凱'] }, yomi = { 上弦: 'じょうげん', 下弦: 'かげん' }, out = [];
  for (const g of ['上弦', '下弦']) who[g].forEach((nm, i) => { if (!nm) return; for (const pre of [g, yomi[g]]) for (const no of ['の', '']) for (const n of num[i]) out.push([pre + no + n, nm]); });
  out.push(['鬼の始祖', '鬼舞辻無惨'], ['おにのしそ', '鬼舞辻無惨'], ['憎珀天', '半天狗'], ['ぞうはくてん', '半天狗']);
  return out;
})();

// ---------- 名前で決まる血鬼術 ----------
function hash(s, seed) { let h = (2166136261 ^ seed) >>> 0; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 2246822519); h ^= h >>> 13; return (h >>> 0) / 4294967296; }
const EL = [ // [見た目, 名前の前半×3, 説明（日）, 説明（英）]
  ['red', ['焔', '業火', '灼熱'], '燃えさかる血の炎', 'burning blood-flame'], ['k_ice', ['氷牙', '霜', '凍土'], '凍てつく血の氷', 'freezing blood-ice'], ['yellow', ['雷', '紫電', '轟雷'], '血を走る雷', 'lightning through blood'],
  ['green', ['旋風', '颪', '鎌鼬'], '肉を裂く風', 'flesh-cutting wind'], ['blue', ['濁流', '水鏡', '潮'], '血の混じった水', 'blood-laced water'], ['gray', ['礫', '巌', '地割れ'], '地面の岩', 'stone from the ground'],
  ['white', ['朧', '霞', '煙'], '目をくらます霧', 'blinding mist'], ['k_blood', ['血刃', '紅', '血潮'], '固めた自分の血', 'its own hardened blood'], ['k_poison', ['蠱毒', '瘴気', '腐れ'], '肉を溶かす毒', 'flesh-melting venom'],
  ['k_shadow', ['影', '闇', '黒蝕'], '足もとの影', 'the shadows underfoot'], ['k_bone', ['骨', '髑髏', '白骨'], '体から伸ばした骨', 'bone grown from its body'], ['k_mirror', ['鏡', '玻璃', '写し身'], '鏡のかけら', 'shards of mirror'],
  ['sakura', ['徒花', '彼岸花', '散華'], '血を吸う花', 'blood-drinking flowers'], ['fuji', ['蟲', '毒蛾', '百足'], '体から湧く蟲', 'insects from its body'], ['k_ink', ['墨', '黒縄', '筆'], '生きた墨', 'living ink'],
  ['k_rust', ['錆', '朽ち鉄', '赤錆'], '刀を朽ちさせる錆', 'blade-rotting rust'], ['k_sonic', ['哭声', '残響', '鈴'], '耳を裂く音', 'ear-splitting sound'], ['k_dream', ['夢', '幻', '微睡'], '眠りに誘う幻', 'sleep-bringing illusions'],
  ['k_needle', ['針', '千本', '棘'], '無数の針', 'countless needles'], ['k_chain', ['鎖', '枷', '呪縛'], '血の鎖', 'chains of blood'], ['k_thread', ['糸', '繭', '綾'], '鋼より硬い糸', 'threads harder than steel'], ['purple', ['月', '朔', '残月'], '月の光の刃', 'blades of moonlight'],
];
const T5 = (a, t) => a[t];
const FM = [ // [名前の後半×3, 説明（日）, 説明（英）, 強さ(0〜4)から効果を作る]
  [['薙ぎ', '一閃', '払い'], '{e}で前を横に薙ぎ払う', 'Sweeps {e} across the front', t => ({ k: 'inst', L: T5([0, 1, 1, 2, 9], t), R: T5([8, 12, 18, 26, 40], t), v: 'arcH' })],
  [['穿ち', '貫き', '槍'], '{e}を槍にして、まっすぐ遠くまで貫く', 'Drives {e} straight ahead like a spear', t => ({ k: 'inst', L: 0, R: T5([14, 24, 36, 50, 70], t), O: t >= 3 ? 1 : 0, v: 'thrust' })],
  [['乱舞', '連爪', '八つ裂き'], '{e}で近い相手から次々に裂く', 'Tears through the nearest foes one after another with {e}', t => ({ k: 'multi', N: T5([2, 4, 6, 9, 14], t), R: T5([14, 20, 26, 32, 40], t), v: 'arcs' })],
  [['時雨', '驟雨', '落とし'], '{e}を空から降りそそがせる', 'Rains {e} down from above', t => ({ k: 'rain', D: T5([2, 3, 4, 5.5, 7], t), R: T5([18, 24, 30, 36, 44], t), O: t >= 3 ? 1 : 0, v: 'rain' })],
  [['結界', '纏い', '渦'], '{e}を身のまわりにめぐらせる', 'Wraps {e} around itself', t => ({ k: 'aura', L: T5([0, 1, 1, 2, 9], t), R: T5([6, 7, 8, 9, 10], t), D: T5([1.5, 2.5, 3.5, 5, 6.5], t), v: t >= 3 ? 'vortex' : 'spin' })],
  [['疾走', '蛇行', '奔り'], '{e}をまとい、体が勝手に相手を狩り続ける', 'Cloaked in {e}, its body hunts on its own', t => ({ k: 'flow', L: T5([0, 0, 1, 1, 2], t), D: T5([2, 3, 4.5, 6, 8], t), v: t >= 3 ? 'dragon' : 'ribbon' })],
  [['金縛り', '呪縛', '凍時'], '{e}でまわりの動きを鈍らせる', 'Slows everything around it with {e}', t => ({ k: 'slow', D: T5([2, 3, 4, 5.5, 7], t), S: T5([.6, .5, .4, .3, .2], t), v: 'eye' })],
  [['墜とし', '叩き割り', '地砕き'], '{e}を上から叩きつけ、障害物ごと砕く', 'Slams {e} down, smashing obstacles too', t => ({ k: 'inst', L: T5([0, 0, 1, 2, 9], t), R: T5([8, 10, 14, 18, 26], t), O: 1, v: 'fall' })],
  [['大災', '終焉', '天変'], '{e}で前のすべてを吹き飛ばす', 'Blows away everything ahead with {e}', t => ({ k: 'inst', L: T5([1, 2, 9, 9, 9], t), R: T5([16, 24, 36, 50, 70], t), O: 1, I: t >= 3 ? 1 : .5, v: t >= 2 ? 'mega' : 'storm' })],
  [['再生', '喰らい', '脈動'], '{e}で喰らい、再生の力を取りもどす', 'Feeds with {e} and restores its regeneration', t => ({ k: 'inst', L: T5([0, 0, 1, 1, 2], t), R: T5([8, 10, 12, 14, 18], t), H: T5([15, 25, 40, 60, 100], t), v: 'rain' })],
];
export const TIER = { ja: ['かすり傷ていど', '並', '強い', '凶悪', '災厄'], en: ['A scratch', 'Average', 'Strong', 'Vicious', 'Calamity'], zh: TIERL.zh, ko: TIERL.ko };
const norm0 = s => String(s).normalize('NFKC').replace(/[\s　・･]/g, '').toLowerCase().replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
// 名前から、その人だけの血鬼術を作る（同じ名前なら必ず同じ）
export function artOf(name) {
  const n = norm0(name), r = k => hash(n, 0x6f6e69 + k * 7919), ei = Math.floor(r(1) * EL.length), fi = Math.floor(r(2) * FM.length), e = EL[ei], f = FM[fi];
  const x = r(3) * 100, tier = x < 15 ? 0 : x < 45 ? 1 : x < 75 ? 2 : x < 93 ? 3 : 4, a = Math.floor(r(4) * 3), b = Math.floor(r(5) * 3);
  const nm = e[1][a] + '・' + f[0][b], p = Object.assign(f[3](tier), { sty: e[0] });
  return { art: ['血鬼術', nm, f[1].replace('{e}', e[2]), p, { en: genArt('en', ei, fi, a, b), zh: genArt('zh', ei, fi, a, b), ko: genArt('ko', ei, fi, a, b) }], en: f[2].replace('{e}', e[3]), tier, power: Math.round(35 + 65 * r(6)) };
}
// 名前で決まる血鬼術の日本語名（「灼熱・蛇行」）を、その言葉の名前にする（ランキングの表示用）
export function genNameL(nm, lang) {
  const i = nm.indexOf('・'); if (i < 0) return null; const x = nm.slice(0, i), y = nm.slice(i + 1), ei = EL.findIndex(e => e[1].includes(x)), fi = FM.findIndex(f => f[0].includes(y)); if (ei < 0 || fi < 0) return null;
  const g = genArt(lang, ei, fi, EL[ei][1].indexOf(x), FM[fi][0].indexOf(y)); return g ? g[0] : null;
}
// その名前の鬼としての中身。cn=原作のキャラなら、そのいちばん正式な名前
export function oniInfo(name, cn) {
  const as = KEKKI[cn] ? cn : (HUMAN[cn] || HUMAN[norm0(name)] || null);
  if (as) { const K = KEKKI[as]; return { canon: true, as, arts: K.arts, carry: K.carry, power: K.power, tier: -1 }; }
  const a = artOf(name); return { canon: false, as: null, arts: [a.art], carry: 1, power: a.power, tier: a.tier, en: a.en };
}
// 鬼になる前の名前か（必ず誘いが出る）
export const humanOf = (name, cn) => (KEKKI[cn] ? null : (HUMAN[cn] || HUMAN[norm0(name)] || null));

// ---------- その端末で鬼になった名前 ----------
const LSK = 'nsb_oni';
function load() { try { const v = JSON.parse(localStorage.getItem(LSK) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
export const oniHas = name => load().includes(norm0(name));
export function oniAdd(name) { try { const a = load(), n = norm0(name); if (!a.includes(n)) { a.push(n); localStorage.setItem(LSK, JSON.stringify(a.slice(-300))); } } catch (e) { } }

// ---------- 誘いの画面（どちらのゲームでも同じ）----------
const TXT = {
  ja: { tal: '素晴らしい才能だ。', none: '才能がないな。', hum: 'お前は、強くなりたいのだろう。', ask: '鬼にならないか。', ask2: '鬼になれば、もっと強くなれる。', yes: '鬼になる', no: '断る', sure: '二度と、刀は握れない。\nそれでも鬼になるか。', sure2: 'この名前は、ずっと鬼のままになります', go: '鬼になる', back: 'やめる', done: n => `「${n}」は、鬼になった。` },
  en: { tal: 'What splendid talent.', none: 'You have no talent.', hum: 'You want to be stronger, do you not?', ask: 'Become a demon.', ask2: 'As a demon, you can grow far stronger.', yes: 'Become a demon', no: 'Refuse', sure: 'You will never hold a blade again.\nWill you still become a demon?', sure2: 'This name will stay a demon forever', go: 'Become a demon', back: 'Go back', done: n => `${n} became a demon.` },
  zh: { tal: '了不起的才能。', none: '你沒有才能啊。', hum: '你想變強吧。', ask: '要不要成為鬼？', ask2: '成為鬼，就能變得更強。', yes: '成為鬼', no: '拒絕', sure: '再也無法握刀。\n即使如此也要成為鬼嗎？', sure2: '這個名字將永遠是鬼', go: '成為鬼', back: '算了', done: n => `「${n}」成為了鬼。` },
  ko: { tal: '훌륭한 재능이군.', none: '재능이 없구나.', hum: '너는 강해지고 싶은 거지.', ask: '귀신이 되지 않겠나.', ask2: '귀신이 되면 더 강해질 수 있다.', yes: '귀신이 된다', no: '거절한다', sure: '다시는 칼을 쥘 수 없다.\n그래도 귀신이 되겠나.', sure2: '이 이름은 영원히 귀신으로 남습니다', go: '귀신이 된다', back: '그만둔다', done: n => `「${n}」은(는) 귀신이 되었다.` },
};
export const oniText = l => TXT[l] || TXT.en;
function css() {
  if (document.getElementById('oniCss')) return; const s = document.createElement('style'); s.id = 'oniCss';
  s.textContent = `#oniInv{position:fixed;inset:0;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:radial-gradient(ellipse at 50% 42%,#3a0410cc 0%,#0a0206f2 62%,#000 100%);color:#f4e9e6;font-family:"Hiragino Mincho ProN","Yu Mincho","Noto Serif JP","Noto Serif CJK JP",serif;text-align:center;opacity:0;transition:opacity .5s}
#oniInv.on{opacity:1}#oniInv .eye{width:150px;height:60px;margin-bottom:26px;position:relative;filter:drop-shadow(0 0 18px #ff1030)}
#oniInv .eye i{position:absolute;top:10px;width:58px;height:26px;background:radial-gradient(ellipse at 50% 55%,#fff 0 8%,#ff2a40 14% 46%,#5a0010 78%);border-radius:60% 60% 50% 50%/80% 80% 40% 40%;animation:oniBl 4.2s infinite}
#oniInv .eye i:first-child{left:8px;transform:rotate(12deg)}#oniInv .eye i:last-child{right:8px;transform:rotate(-12deg)}
@keyframes oniBl{0%,92%,100%{clip-path:inset(0)}95%{clip-path:inset(48% 0)}}
#oniInv p{margin:0;white-space:pre-line;line-height:1.9;letter-spacing:.12em;text-shadow:0 0 14px #ff103088,0 2px 4px #000}
#oniInv .l1{font-size:19px;color:#e6cfc8;min-height:1.9em}#oniInv .l2{font-size:30px;font-weight:900;color:#fff;margin-top:6px;min-height:1.9em}#oniInv .l3{font-size:14px;color:#c9a8a0;margin-top:8px;min-height:1.9em}
#oniInv .bt{display:flex;gap:14px;margin-top:34px;opacity:0;transition:opacity .4s;pointer-events:none}#oniInv .bt.on{opacity:1;pointer-events:auto}
#oniInv button{font:inherit;font-weight:800;font-size:17px;letter-spacing:.12em;padding:15px 22px;border-radius:6px;border:1px solid #6a5a5a;background:#1a1416;color:#d8cfcf;min-width:132px;cursor:pointer}
#oniInv button.y{background:linear-gradient(#d21a34,#7a0a1a);border-color:#ff5a6a;color:#fff;box-shadow:0 0 22px #ff103066,0 4px 0 #3a0410}
#oniInv .vein{position:absolute;inset:0;pointer-events:none;background:repeating-conic-gradient(from 0deg at 50% 42%,#ff103000 0 7deg,#ff103012 8deg 9deg);mix-blend-mode:screen;animation:oniSp 40s linear infinite;opacity:.7}
@keyframes oniSp{to{transform:rotate(360deg)}}`;
  document.head.appendChild(s);
}
// 誘い。鬼になると答えたら true。kind: 'tal'（才能あり）/ 'none'（才能なし）/ 'hum'（鬼になる前の名前）
export function oniInvite(lang, kind) {
  css(); const T = oniText(lang);
  return new Promise(res => {
    const d = document.createElement('div'); d.id = 'oniInv';
    d.innerHTML = '<div class="vein"></div><div class="eye"><i></i><i></i></div><p class="l1"></p><p class="l2"></p><p class="l3"></p><div class="bt"><button class="n"></button><button class="y"></button></div>';
    document.body.appendChild(d); const q = s => d.querySelector(s), l1 = q('.l1'), l2 = q('.l2'), l3 = q('.l3'), bt = q('.bt'), by = q('.y'), bn = q('.n'); let step = 0, tm = [];
    const type = (el, s, sp) => new Promise(r => { el.textContent = ''; let i = 0; const f = () => { el.textContent = s.slice(0, ++i); if (i < s.length) tm.push(setTimeout(f, sp || 70)); else r(); }; f(); });
    const end = v => { tm.forEach(clearTimeout); d.classList.remove('on'); setTimeout(() => { d.remove(); res(v); }, 450); };
    const ask = async () => { step = 0; l2.style.fontSize = ''; bt.classList.remove('on'); by.textContent = T.yes; bn.textContent = T.no; l3.textContent = ''; await type(l1, T[kind] || T.tal); await new Promise(r => tm.push(setTimeout(r, 450))); await type(l2, T.ask, 110); l3.textContent = kind === 'tal' ? '' : T.ask2; bt.classList.add('on'); };
    by.onclick = async () => { if (step === 0) { step = 1; bt.classList.remove('on'); l1.textContent = ''; l3.textContent = T.sure2; l2.style.fontSize = '21px'; await type(l2, T.sure, 60); by.textContent = T.go; bn.textContent = T.back; bt.classList.add('on'); } else end(true); };
    bn.onclick = () => { if (step === 1) ask(); else end(false); };
    requestAnimationFrame(() => { d.classList.add('on'); tm.push(setTimeout(ask, 500)); });
  });
}
