// 別作品の剣士たち（色変わりの刀・無限鬼斬の両方で使う）
// ・フルネームのときだけ反応する（漢字・ひらがな・カタカナ。英語・中国語・韓国語のフルネームも同じ人として扱う）
// ・刀の色は、その剣士の属性どおり（わかりにくい人は雰囲気）。才能は、その剣士の強さ
// ・技は原作の技。見出し・技名・説明は [日本語, 英語, 中国語（繁体字）, 韓国語] の順
// ・鬼になったら、ほかの名前と同じく「名前で決まる血鬼術」になる
import { EXTRA } from './i18n.js?v=11272110';

// 技の見た目（色と形）。fl は、技を出したときに足す演出の種類
export const OT_STY = {
  x_getsuga: { kind: 'moon', c: '#2f8cff', c2: '#eaf6ff', shape: 'crescent', fl: 'f_crescent' },
  x_kuro: { kind: 'moon', c: '#16070b', c2: '#ff2438', shape: 'crescent', fl: 'f_crescent' },
  x_senbon: { kind: 'petal', c: '#ff7fb6', c2: '#fff0f8', shape: 'petal', fl: 'f_petal' },
  x_hyorin: { kind: 'mist', c: '#7fd4ff', c2: '#f4fdff', shape: 'spark', fl: 'k_ice' },
  x_yuki: { kind: 'mist', c: '#cfeaff', c2: '#ffffff', shape: 'puff', fl: 'k_ice' },
  x_nozarashi: { kind: 'boom', c: '#ffd21e', c2: '#fff8c8', shape: 'spark', fl: 'f_quake' },
  x_ryujin: { kind: 'sun', c: '#ff3c00', c2: '#fff2a0', shape: 'ember', fl: 'f_pillar' },
  x_santoryu: { kind: 'claw', c: '#19b35a', c2: '#d9ffe8', shape: 'streak', fl: 'f_cross' },
  x_hiten: { kind: 'wind', c: '#e0322a', c2: '#ffe9d6', shape: 'streak', fl: 'f_cross' },
  x_gatotsu: { kind: 'claw', c: '#3d6fd8', c2: '#e2efff', shape: 'streak', fl: 'f_fang' },
  x_homura: { kind: 'flame', c: '#ff6a00', c2: '#ffe45a', shape: 'ember', fl: 'f_pillar' },
  x_shinso: { kind: 'bolt', c: '#dfe8f6', c2: '#ffffff', shape: 'spark', fl: 'f_fang' },
  x_beni: { kind: 'moon', c: '#e0102a', c2: '#ffc0c8', shape: 'crescent', fl: 'f_crescent' },
  x_katen: { kind: 'ribbon', c: '#ff6fae', c2: '#ffe0ee', shape: 'petal', fl: 'f_petal' },
  x_zabi: { kind: 'snake', c: '#e63a2a', c2: '#ffe0c8', shape: 'spark', fl: 'f_fang' },
  x_kyoka: { kind: 'mist', c: '#8a5cff', c2: '#f0e8ff', shape: 'spark', fl: 'k_dream' },
  x_hitsugi: { kind: 'rock', c: '#2a1640', c2: '#b06cff', shape: 'rock', fl: 'f_pillar' },
  x_soul: { kind: 'mist', c: '#a8f0e0', c2: '#ffffff', shape: 'puff', fl: 'k_ice' },
  x_room: { kind: 'wave', c: '#35b8ff', c2: '#e6f8ff', shape: 'spark', fl: 'f_cross' },
  x_oden: { kind: 'moon', c: '#7a2bd6', c2: '#ffd6ff', shape: 'crescent', fl: 'f_cross' },
  x_shuku: { kind: 'wind', c: '#e8f4ff', c2: '#ffffff', shape: 'streak', fl: 'f_fang' },
  x_kodachi: { kind: 'snake', c: '#5b6cf0', c2: '#dfe4ff', shape: 'streak', fl: 'f_cross' },
  x_tessaiga: { kind: 'wind', c: '#ffd34a', c2: '#fffbe0', shape: 'streak', fl: 'f_quake' },
  x_meido: { kind: 'moon', c: '#1a1030', c2: '#b48cff', shape: 'crescent', fl: 'f_crescent' },
  x_bakusai: { kind: 'boom', c: '#57e08a', c2: '#f0fff4', shape: 'spark', fl: 'f_quake' },
  x_soryu: { kind: 'bolt', c: '#3a8cff', c2: '#e6f2ff', shape: 'spark', fl: 'f_fang' },
  x_chidori: { kind: 'bolt', c: '#7fb8ff', c2: '#ffffff', shape: 'spark', fl: 'k_kbolt' },
  x_susanoo: { kind: 'moon', c: '#7a3cff', c2: '#e8d8ff', shape: 'crescent', fl: 'f_pillar' },
  x_sao: { kind: 'bolt', c: '#3fe0ff', c2: '#ffffff', shape: 'spark', fl: 'f_cross' },
  x_rapier: { kind: 'bolt', c: '#ffd6ea', c2: '#ffffff', shape: 'spark', fl: 'f_fang' },
  x_strash: { kind: 'bolt', c: '#4aa8ff', c2: '#fff7c0', shape: 'spark', fl: 'f_crescent' },
  x_yami: { kind: 'moon', c: '#3a1a5c', c2: '#c9a0ff', shape: 'crescent', fl: 'f_crescent' },
  x_kaze: { kind: 'wind', c: '#9fd8ff', c2: '#ffffff', shape: 'streak', fl: 'f_cross' },
  x_excalibur: { kind: 'sun', c: '#ffd24a', c2: '#fffbe0', shape: 'spark', fl: 'f_pillar' },
  x_shigure: { kind: 'wave', c: '#3f9cff', c2: '#d8f0ff', shape: 'drop', fl: 'f_fang' },
  x_toyako: { kind: 'wind', c: '#e8ecf4', c2: '#ffffff', shape: 'streak', fl: 'f_cross' },
  x_shinsen: { kind: 'claw', c: '#3a3a48', c2: '#ffd24a', shape: 'spark', fl: 'f_cross' },
  x_okita: { kind: 'petal', c: '#f7a8c0', c2: '#fff4f8', shape: 'petal', fl: 'f_cross' },
  x_bazooka: { kind: 'boom', c: '#ff8a1e', c2: '#fff0b0', shape: 'ember', fl: 'f_quake' },
  x_katsura: { kind: 'wind', c: '#6f86ff', c2: '#e0e6ff', shape: 'streak', fl: 'f_fang' },
  x_kihei: { kind: 'moon', c: '#8a2be2', c2: '#ffb0e8', shape: 'crescent', fl: 'f_crescent' },
  x_hoshina: { kind: 'claw', c: '#a06cff', c2: '#f0e6ff', shape: 'streak', fl: 'f_cross' },
  x_erza: { kind: 'bolt', c: '#ff4060', c2: '#ffe0e6', shape: 'spark', fl: 'f_fang' },
  x_jao: { kind: 'flame', c: '#2a0a3a', c2: '#b040ff', shape: 'ember', fl: 'f_pillar' },
  x_counter: { kind: 'ribbon', c: '#59e0c0', c2: '#ffffff', shape: 'spark', fl: 'f_crescent' },
  x_kogetsu: { kind: 'moon', c: '#7fd0ff', c2: '#f0faff', shape: 'crescent', fl: 'f_crescent' },
  x_yoru: { kind: 'moon', c: '#0e2a1c', c2: '#62ffb0', shape: 'crescent', fl: 'f_crescent' },
  x_haoshoku: { kind: 'bolt', c: '#b0122a', c2: '#ff9aa8', shape: 'spark', fl: 'f_pillar' },
  x_gravity: { kind: 'rock', c: '#7a4cff', c2: '#e0d0ff', shape: 'rock', fl: 'f_quake' },
  x_kitsune: { kind: 'flame', c: '#ff7a1e', c2: '#fff0c0', shape: 'ember', fl: 'f_cross' },
  x_odm: { kind: 'wind', c: '#b8e0c0', c2: '#ffffff', shape: 'streak', fl: 'f_cross' },
  x_rika: { kind: 'bolt', c: '#e6f0ff', c2: '#ff9ad8', shape: 'spark', fl: 'f_pillar' },
  x_intetsu: { kind: 'bolt', c: '#4a6cff', c2: '#e0e8ff', shape: 'spark', fl: 'f_fang' },
  x_ubw: { kind: 'flame', c: '#ff5a2a', c2: '#ffe9c0', shape: 'ember', fl: 'f_fang' },
  x_tsubame: { kind: 'wind', c: '#b48cff', c2: '#f4eaff', shape: 'streak', fl: 'f_cross' },
  x_sakanade: { kind: 'mist', c: '#ffd24a', c2: '#ffe9f4', shape: 'spark', fl: 'k_dream' },
  x_tenken: { kind: 'rock', c: '#a39686', c2: '#fff0d0', shape: 'rock', fl: 'f_quake' },
  x_suzume: { kind: 'bolt', c: '#ffd21e', c2: '#fff8c8', shape: 'spark', fl: 'f_fang' },
  x_hyun: { kind: 'bolt', c: '#f4f8ff', c2: '#ffe9a0', shape: 'spark', fl: 'f_crescent' },
  x_trunks: { kind: 'bolt', c: '#ffe14a', c2: '#7fd0ff', shape: 'spark', fl: 'f_crescent' },
  x_kiri: { kind: 'mist', c: '#bfe0ee', c2: '#ffffff', shape: 'puff', fl: 'k_dream' },
  x_murasame: { kind: 'moon', c: '#a00820', c2: '#ff5a70', shape: 'crescent', fl: 'f_crescent' },
  x_reid: { kind: 'sun', c: '#ff5030', c2: '#fff0c0', shape: 'spark', fl: 'f_pillar' },
  x_ariel: { kind: 'wind', c: '#8fe8b0', c2: '#ffffff', shape: 'streak', fl: 'f_cross' },
  x_bugi: { kind: 'bolt', c: '#6fb0ff', c2: '#ffffff', shape: 'spark', fl: 'f_cross' },
  x_mugen: { kind: 'bolt', c: '#5a7cff', c2: '#e0f0ff', shape: 'spark', fl: 'f_fang' },
  x_nanasen: { kind: 'wind', c: '#c0c8ff', c2: '#ffffff', shape: 'streak', fl: 'f_cross' },
  x_shana: { kind: 'flame', c: '#ff3a14', c2: '#ffd24a', shape: 'ember', fl: 'f_pillar' },
  x_hakuba: { kind: 'wind', c: '#f0f6ff', c2: '#ffd0ea', shape: 'streak', fl: 'f_cross' },
};

// 作品
export const WORKS = {
  bleach: ['BLEACH', 'BLEACH', 'BLEACH 死神', '블리치'],
  onepiece: ['ONE PIECE', 'ONE PIECE', 'ONE PIECE 航海王', '원피스'],
  kenshin: ['るろうに剣心', 'Rurouni Kenshin', '神劍闖江湖', '바람의 검심'],
  inuyasha: ['犬夜叉', 'Inuyasha', '犬夜叉', '이누야샤'],
  naruto: ['NARUTO -ナルト-', 'Naruto', '火影忍者', '나루토'],
  sao: ['ソードアート・オンライン', 'Sword Art Online', '刀劍神域', '소드 아트 온라인'],
  dai: ['ダイの大冒険', 'Dragon Quest: The Adventure of Dai', '勇者鬥惡龍 達伊的大冒險', '드래곤 퀘스트 다이의 대모험'],
  bclover: ['ブラッククローバー', 'Black Clover', '黑色五葉草', '블랙 클로버'],
  fate: ['Fate', 'Fate', 'Fate', '페이트'],
  gintama: ['銀魂', 'Gintama', '銀魂', '은혼'],
  kaiju8: ['怪獣8号', 'Kaiju No. 8', '怪獸8號', '괴수 8호'],
  fairytail: ['FAIRY TAIL', 'Fairy Tail', 'FAIRY TAIL 魔導少年', '페어리 테일'],
  yuhaku: ['幽☆遊☆白書', 'Yu Yu Hakusho', '幽遊白書', '유유백서'],
  nanatsu: ['七つの大罪', 'The Seven Deadly Sins', '七大罪', '일곱 개의 대죄'],
  wtrigger: ['ワールドトリガー', 'World Trigger', '境界觸發者', '월드 트리거'],
  aot: ['進撃の巨人', 'Attack on Titan', '進擊的巨人', '진격의 거인'],
  jjk: ['呪術廻戦', 'Jujutsu Kaisen', '咒術迴戰', '주술회전'],
  rakudai: ['落第騎士の英雄譚', 'Chivalry of a Failed Knight', '落第騎士英雄譚', '낙제 기사의 영웅담'],
  dragonball: ['ドラゴンボール', 'Dragon Ball', '七龍珠', '드래곤볼'],
  akame: ['アカメが斬る！', 'Akame ga Kill!', '斬！赤紅之瞳', '아카메가 벤다!'],
  rezero: ['Re:ゼロから始める異世界生活', 'Re:ZERO -Starting Life in Another World-', 'Re:從零開始的異世界生活', 'Re: 제로부터 시작하는 이세계 생활'],
  danmachi: ['ダンジョンに出会いを求めるのは間違っているだろうか', 'Is It Wrong to Try to Pick Up Girls in a Dungeon?', '在地下城尋求邂逅是否搞錯了什麼', '던전에서 만남을 추구하면 안 되는 걸까'],
  overlord: ['オーバーロード', 'Overlord', 'OVERLORD', '오버로드'],
  dgray: ['D.Gray-man', 'D.Gray-man', 'D.Gray-man 驅魔少年', '디 그레이맨'],
  toaru: ['とある魔術の禁書目録', 'A Certain Magical Index', '魔法禁書目錄', '어떤 마술의 금서목록'],
  shana: ['灼眼のシャナ', 'Shakugan no Shana', '灼眼的夏娜', '작안의 샤나'],
  aoex: ['青の祓魔師', 'Blue Exorcist', '青之驅魔師', '청의 엑소시스트'],
  noragami: ['ノラガミ', 'Noragami', '流浪神差', '노라가미'],
  seraph: ['終わりのセラフ', 'Seraph of the End', '終結的熾天使', '종말의 세라프'],
  souleater: ['ソウルイーター', 'Soul Eater', '噬魂師', '소울 이터'],
  tensura: ['転生したらスライムだった件', 'That Time I Got Reincarnated as a Slime', '關於我轉生變成史萊姆這檔事', '전생했더니 슬라임이었던 건에 대하여'],
  mushoku: ['無職転生', 'Mushoku Tensei: Jobless Reincarnation', '無職轉生', '무직전생'],
  opm: ['ワンパンマン', 'One-Punch Man', '一拳超人', '원펀맨'],
  berserk: ['ベルセルク', 'Berserk', '烙印勇士', '베르세르크'],
  hxh: ['HUNTER×HUNTER', 'Hunter × Hunter', 'HUNTER×HUNTER 獵人', '헌터×헌터'],
  jojo: ['ジョジョの奇妙な冒険', "JoJo's Bizarre Adventure", 'JoJo的奇妙冒險', '죠죠의 기묘한 모험'],
  fma: ['鋼の錬金術師', 'Fullmetal Alchemist', '鋼之鍊金術師', '강철의 연금술사'],
  reborn: ['家庭教師ヒットマンREBORN!', 'Katekyo Hitman Reborn!', '家庭教師HITMAN REBORN!', '가정교사 히트맨 리본!'],
};
const LI = { ja: 0, en: 1, zh: 2, ko: 3 }, pick = (a, lang) => a[LI[lang]] || a[1] || a[0];

// 技1つ：t(見出し×4, 技名×4, 説明×4, 効果)
const t = (lb, nm, ds, p) => [lb[0], nm[0], ds[0], p, { en: [nm[1], ds[1], lb[1]], zh: [nm[2], ds[2], lb[2]], ko: [nm[3], ds[3], lb[3]] }];
// 剣士1人：c(漢字のフルネーム, よみ, [英語, 中国語, 韓国語], 作品, 色, 才能, 流派×4, 技, ほかの書き方, その書き方だけの名前)
// x＝その書き方のときだけ反応する名前（名字のない短い名前。「だい」「あすな」のような、ふつうの人の名前とぶつからないように、ひらがなでは反応させない）
const c = (name, yomi, nm, w, k, den, sch, wz, alt, x) => ({ n: (yomi ? [name, yomi] : []).concat(alt || []), n0: name, nm: [name].concat(nm), w, k, den, sch, wz, x: x || null });

// よく使う見出し
const SHIKAI = ['始解', 'Shikai', '始解', '시해'], BANKAI = ['卍解', 'Bankai', '卍解', '만해'], OUGI = ['奥義', 'Secret Technique', '奧義', '오의'];
const SANTO = ['三刀流', 'Three Sword Style', '三刀流', '삼도류'], ITTO = ['一刀流', 'One Sword Style', '一刀流', '일도류'], KYUTO = ['九刀流', 'Nine Sword Style', '九刀流', '구도류'];
const HITEN = ['飛天御剣流', 'Hiten Mitsurugi Style', '飛天御劍流', '비천어검류'], GATOTSU = ['牙突', 'Gatotsu', '牙突', '아돌'], HIKEN = ['秘剣', 'Secret Sword', '秘劍', '비검'];
const ZANKA = ['残火の太刀', 'Zanka no Tachi', '殘火太刀', '잔화의 태도'], ZANJUTSU = ['斬術', 'Swordsmanship', '斬術', '참술'];

export const OTHERS = [
  // ---------- BLEACH ----------
  c('黒崎一護', 'くろさきいちご', ['Ichigo Kurosaki', '黑崎一護', '쿠로사키 이치고'], 'bleach', 'black', 100, ['斬魄刀「斬月」', 'Zanpakuto: Zangetsu', '斬魄刀「斬月」', '참백도 「참월」'], [
    t(SHIKAI, ['月牙天衝', 'Getsuga Tensho', '月牙天衝', '월아천충'], ['霊圧を三日月の斬撃にして飛ばす', 'Fires spirit energy as a crescent slash', '將靈壓化為新月形的斬擊放出', '영압을 초승달 모양의 참격으로 날린다'], { k: 'inst', L: 1, R: 42, v: 'arcH', sty: 'x_getsuga' }),
    t(BANKAI, ['天鎖斬月', 'Tensa Zangetsu', '天鎖斬月', '천쇄참월'], ['力を小さな黒い刀に固め、超高速で斬りまわる', 'Compresses its power into a small black blade and cuts at blinding speed', '將力量凝聚成小小的黑刀，以超高速四處斬擊', '힘을 작은 검은 칼에 응축해 초고속으로 베고 다닌다'], { k: 'flow', L: 1, D: 6, v: 'ribbon', sty: 'x_kuro' }),
    t(BANKAI, ['月牙十字衝', 'Getsuga Jujisho', '月牙十字衝', '월아십자충'], ['二振りの月牙を十字に重ねて放つ', 'Fires two Getsuga crossed into one', '將兩道月牙交叉成十字放出', '두 줄기 월아를 십자로 겹쳐 날린다'], { k: 'inst', L: 2, R: 40, O: 1, v: 'claws', sty: 'x_kuro' }),
    t(['最後の月牙天衝', 'Final Getsuga Tensho', '最後的月牙天衝', '최후의 월아천충'], ['無月', 'Mugetsu', '無月', '무월'], ['一振りで、闇がすべてを呑みこむ', 'One swing, and darkness swallows everything', '一揮之下，黑暗吞沒一切', '한 번 휘두르면 어둠이 모든 것을 삼킨다'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_kuro' }),
  ]),
  c('朽木ルキア', 'くちきるきあ', ['Rukia Kuchiki', '朽木露琪亞', '쿠치키 루키아'], 'bleach', 'white', 93, ['斬魄刀「袖白雪」', 'Zanpakuto: Sode no Shirayuki', '斬魄刀「袖白雪」', '참백도 「소데노시라유키」'], [
    t(SHIKAI, ['初の舞・月白', 'Some no Mai, Tsukishiro', '初舞・月白', '첫 번째 춤·월백'], ['足もとに円を描き、その中を天まで凍らせる', 'Draws a circle and freezes everything inside it up to the sky', '在腳下畫圓，將圓內直到天際全部凍結', '발밑에 원을 그려 그 안을 하늘까지 얼린다'], { k: 'inst', L: 1, R: 16, O: 1, v: 'arcUp', sty: 'x_yuki' }),
    t(SHIKAI, ['次の舞・白漣', 'Tsugi no Mai, Hakuren', '次舞・白漣', '다음 춤·백련'], ['雪崩のような冷気を一直線に放つ', 'Unleashes an avalanche of cold in a straight line', '將雪崩般的冷氣筆直放出', '눈사태 같은 냉기를 일직선으로 쏜다'], { k: 'inst', L: 1, R: 44, v: 'thrust', sty: 'x_yuki' }),
    t(SHIKAI, ['参の舞・白刀', 'San no Mai, Shirafune', '參舞・白刀', '세 번째 춤·백도'], ['氷の刃を伸ばして貫く', 'Extends a blade of ice and pierces through', '伸長冰之刃貫穿對手', '얼음 칼날을 뻗어 꿰뚫는다'], { k: 'inst', L: 0, R: 28, O: 1, v: 'thrust', sty: 'x_yuki' }),
    t(BANKAI, ['白霞罸', 'Hakka no Togame', '白霞罰', '백하벌'], ['白い冷気がまわりのすべてを凍らせる', 'A white chill freezes everything around', '白色的冷氣凍結周圍的一切', '하얀 냉기가 주위의 모든 것을 얼린다'], { k: 'aura', L: 9, R: 10, D: 5, v: 'calm', sty: 'x_yuki' }),
  ]),
  c('朽木白哉', 'くちきびゃくや', ['Byakuya Kuchiki', '朽木白哉', '쿠치키 뱌쿠야'], 'bleach', 'sakura', 98, ['斬魄刀「千本桜」', 'Zanpakuto: Senbonzakura', '斬魄刀「千本櫻」', '참백도 「천본앵」'], [
    t(SHIKAI, ['千本桜', 'Senbonzakura', '千本櫻', '천본앵'], ['刀身が無数の花びらの刃になって舞う', 'The blade scatters into countless petal-like blades', '刀身化為無數花瓣般的刀刃飛舞', '칼날이 무수한 꽃잎의 칼날이 되어 흩날린다'], { k: 'multi', N: 8, R: 30, v: 'arcs', sty: 'x_senbon' }),
    t(BANKAI, ['千本桜景厳', 'Senbonzakura Kageyoshi', '千本櫻景嚴', '천본앵경엄'], ['億を数える刃が波になって降りそそぐ', 'A hundred million blades pour down like a wave', '數以億計的刀刃化為波濤傾注而下', '억에 이르는 칼날이 파도가 되어 쏟아진다'], { k: 'rain', D: 5, R: 38, O: 1, v: 'rainfall', sty: 'x_senbon' }),
    t(BANKAI, ['殲景・千本桜景厳', 'Senkei, Senbonzakura Kageyoshi', '殲景・千本櫻景嚴', '섬경·천본앵경엄'], ['刃を千本の剣に変えてまわりを囲む', 'Turns the blades into a thousand swords that surround it', '將刀刃化為千把劍環繞四周', '칼날을 천 자루의 검으로 바꿔 주위를 에워싼다'], { k: 'aura', L: 2, R: 9, D: 5, v: 'spin', sty: 'x_senbon' }),
    t(BANKAI, ['終景・白帝剣', 'Shukei, Hakuteiken', '終景・白帝劍', '종경·백제검'], ['すべての刃を一振りの白い剣に集めて貫く', 'Gathers every blade into one white sword and pierces', '將所有刀刃凝聚成一把白劍貫穿', '모든 칼날을 한 자루의 흰 검에 모아 꿰뚫는다'], { k: 'inst', L: 1, R: 60, O: 1, I: .8, v: 'thrust', sty: 'x_senbon' }),
  ]),
  c('日番谷冬獅郎', 'ひつがやとうしろう', ['Toshiro Hitsugaya', '日番谷冬獅郎', '히츠가야 토시로'], 'bleach', 'white', 97, ['斬魄刀「氷輪丸」', 'Zanpakuto: Hyorinmaru', '斬魄刀「冰輪丸」', '참백도 「빙륜환」'], [
    t(SHIKAI, ['氷輪丸', 'Hyorinmaru', '冰輪丸', '빙륜환'], ['氷の龍を放ち、触れたものを凍らせる', 'Unleashes a dragon of ice that freezes what it touches', '放出冰龍，凍結觸碰到的一切', '얼음 용을 풀어 닿는 것을 얼린다'], { k: 'flow', L: 1, D: 5, v: 'dragon', sty: 'x_hyorin' }),
    t(BANKAI, ['大紅蓮氷輪丸', 'Daiguren Hyorinmaru', '大紅蓮冰輪丸', '대홍련빙륜환'], ['氷の翼と尾をまとい、近づくものを凍らせる', 'Cloaked in wings and a tail of ice, it freezes whatever comes near', '披上冰之翼與尾，凍結靠近的一切', '얼음 날개와 꼬리를 두르고 다가오는 것을 얼린다'], { k: 'aura', L: 2, R: 9, D: 5, O: 1, v: 'vortex', sty: 'x_hyorin' }),
    t(BANKAI, ['竜霰架', 'Ryusenka', '龍霰架', '용산가'], ['突き刺した相手を十字の氷に閉じこめて砕く', 'Stabs, seals the foe in a cross of ice, and shatters it', '刺中對手後封入十字之冰並擊碎', '찌른 상대를 십자의 얼음에 가둬 부순다'], { k: 'inst', L: 0, R: 30, O: 1, v: 'thrust', sty: 'x_hyorin' }),
    t(BANKAI, ['千年氷牢', 'Sennen Hyoro', '千年冰牢', '천년빙뢰'], ['無数の氷の柱で囲み、動きを封じる', 'Surrounds with countless pillars of ice and seals all movement', '以無數冰柱包圍，封住行動', '무수한 얼음 기둥으로 에워싸 움직임을 봉한다'], { k: 'slow', D: 6, S: .3, v: 'eye', sty: 'x_hyorin' }),
    t(BANKAI, ['氷天百華葬', 'Hyoten Hyakkaso', '冰天百華葬', '빙천백화장'], ['降る雪に触れたものが、氷の華になって凍りつく', 'Whatever the falling snow touches freezes into flowers of ice', '碰到降雪的東西都會化為冰之花而凍結', '내리는 눈에 닿은 것이 얼음 꽃이 되어 얼어붙는다'], { k: 'rain', D: 6, R: 40, v: 'rainfall', sty: 'x_hyorin' }),
  ]),
  c('更木剣八', 'ざらきけんぱち', ['Kenpachi Zaraki', '更木劍八', '자라키 켄파치'], 'bleach', 'yellow', 100, ['斬魄刀「野晒」', 'Zanpakuto: Nozarashi', '斬魄刀「野晒」', '참백도 「노자라시」'], [
    t(ZANJUTSU, ['力まかせの一太刀', 'A Swing of Brute Force', '全憑蠻力的一刀', '힘으로 내리치는 한 칼'], ['技の名はない。ただ斬るだけで足りる', 'It has no name. Just cutting is enough', '沒有招式名。只要斬下去就夠了', '기술의 이름은 없다. 그저 베는 것만으로 충분하다'], { k: 'inst', L: 1, R: 14, O: 1, v: 'arcDown', sty: 'x_nozarashi' }),
    t(ZANJUTSU, ['剣道（両手持ち）', 'Kendo (Two-Handed)', '劍道（雙手持刀）', '검도(양손 잡기)'], ['片手より両手で振ったほうが強い。それだけ', 'Two hands hit harder than one. That is all', '雙手揮刀比單手更強。僅此而已', '한 손보다 두 손으로 휘두르는 쪽이 강하다. 그뿐이다'], { k: 'inst', L: 1, R: 30, O: 1, I: .6, v: 'fall', sty: 'x_nozarashi' }),
    t(SHIKAI, ['野晒', 'Nozarashi', '野晒', '노자라시'], ['巨大な斧のような刃で、目の前を叩き割る', 'Smashes everything ahead with a blade like a giant axe', '以巨斧般的刀刃劈開眼前的一切', '거대한 도끼 같은 칼날로 눈앞을 내리쪼갠다'], { k: 'inst', L: 2, R: 26, O: 1, v: 'fall', sty: 'x_nozarashi' }),
    t(BANKAI, ['（名は不明）', '(Name Unknown)', '（名稱不明）', '(이름 불명)'], ['鬼のような姿になり、力のままにすべてを叩き斬る', 'Takes a demon-like form and cuts down everything with raw power', '化為鬼一般的姿態，憑蠻力斬碎一切', '귀신 같은 모습이 되어 힘이 닿는 대로 모든 것을 베어 넘긴다'], { k: 'flow', L: 2, D: 6, O: 1, v: 'ribbon', sty: 'x_nozarashi' }),
  ]),
  c('山本元柳斎重國', 'やまもとげんりゅうさいしげくに', ['Genryusai Shigekuni Yamamoto', '山本元柳齋重國', '야마모토 겐류사이 시게쿠니'], 'bleach', 'red', 100, ['斬魄刀「流刃若火」', 'Zanpakuto: Ryujin Jakka', '斬魄刀「流刃若火」', '참백도 「유인약화」'], [
    t(SHIKAI, ['流刃若火', 'Ryujin Jakka', '流刃若火', '유인약화'], ['万象一切を灰にする炎を広く放つ', 'Unleashes flames that turn all of creation to ash', '大範圍放出將萬象一切化為灰燼的火焰', '만상 일체를 재로 만드는 불꽃을 넓게 뿜는다'], { k: 'inst', L: 9, R: 34, v: 'storm', sty: 'x_ryujin' }),
    t(SHIKAI, ['城郭炎上', 'Jokaku Enjo', '城郭炎上', '성곽염상'], ['炎の壁でまわりを囲む', 'Surrounds itself with a wall of flame', '以火焰之牆環繞四周', '불꽃의 벽으로 주위를 에워싼다'], { k: 'aura', L: 2, R: 9, D: 5, v: 'vortex', sty: 'x_ryujin' }),
    t(ZANKA, ['東「旭日刃」', 'East: Kyokujitsujin', '東「旭日刃」', '동 「욱일인」'], ['炎のすべてを刃先に集め、触れたものを跡形もなく消す', 'Focuses all its flame on the edge and erases whatever it touches', '將所有火焰集中於刀尖，觸及之物皆不留痕跡地消滅', '모든 불꽃을 칼끝에 모아 닿은 것을 흔적도 없이 지운다'], { k: 'inst', L: 0, R: 55, O: 1, v: 'thrust', sty: 'x_ryujin' }),
    t(ZANKA, ['西「残日獄衣」', 'West: Zanjitsu Gokui', '西「殘日獄衣」', '서 「잔일옥의」'], ['太陽の熱を身にまとい、近づくものを焼きつくす', 'Wears the heat of the sun and burns whatever comes near', '身披太陽般的高熱，燒盡靠近的一切', '태양의 열을 몸에 둘러 다가오는 것을 모조리 태운다'], { k: 'aura', L: 9, R: 9, D: 5, O: 1, G: 1, v: 'calm', sty: 'x_ryujin' }),
    t(ZANKA, ['南「火火十万億死大葬陣」', 'South: Kaka Jumanokushi Daisojin', '南「火火十萬億死大葬陣」', '남 「화화십만억사대장진」'], ['これまで斬った者たちの灰をよみがえらせ、襲わせる', 'Raises the ashes of everyone it has ever slain and sends them to attack', '喚醒至今斬殺之人的灰燼，使其襲向對手', '지금까지 벤 자들의 재를 되살려 덮치게 한다'], { k: 'multi', N: 14, R: 40, v: 'arcs', sty: 'x_ryujin' }),
    t(ZANKA, ['北「天地灰尽」', 'North: Tenchi Kaijin', '北「天地灰盡」', '북 「천지회진」'], ['一振りで、その先にあるすべてを灰にする', 'One swing turns everything beyond it to ash', '一揮之下，前方的一切皆化為灰燼', '한 번 휘두르면 그 앞의 모든 것이 재가 된다'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_ryujin' }),
  ], ['山本元柳斎重国']),
  // ---------- ONE PIECE ----------
  c('ロロノア・ゾロ', 'ろろのあぞろ', ['Roronoa Zoro', '羅羅亞・索隆', '롤로노아 조로'], 'onepiece', 'green', 99, SANTO, [
    t(SANTO, ['鬼斬り', 'Oni Giri', '鬼斬', '귀신 베기'], ['三本の刀を交差させ、すれ違いざまに斬る', 'Crosses three swords and cuts while rushing past', '三把刀交叉，擦身而過時斬擊', '세 자루의 칼을 교차시켜 스쳐 지나가며 벤다'], { k: 'inst', L: 1, R: 20, I: .5, v: 'claws', sty: 'x_santoryu' }),
    t(SANTO, ['虎狩り', 'Tora Gari', '虎狩', '호랑이 사냥'], ['三本を背負うように構え、上から叩き斬る', 'Raises all three swords behind the back and slams them down', '三把刀高舉過背，由上往下劈斬', '세 자루를 등 뒤로 겨누었다가 위에서 내리친다'], { k: 'inst', L: 1, R: 14, O: 1, v: 'arcDown', sty: 'x_santoryu' }),
    t(ITTO, ['獅子歌歌', 'Shishi Sonson', '獅子歌歌', '사자의 노래'], ['一瞬で抜き、鉄をも断つ居合い', 'A quick-draw so fast it cuts through steel', '一瞬間拔刀，連鋼鐵都能斬斷的居合', '한순간에 뽑아 강철도 베는 발도술'], { k: 'inst', L: 0, R: 40, I: .5, v: 'bolt', a: 'iai', sty: 'x_santoryu' }),
    t(SANTO, ['百八煩悩鳳', '108 Pound Phoenix', '百八煩惱鳳', '백팔번뇌봉'], ['三本で飛ぶ斬撃を放つ', 'Fires flying slashes from all three swords', '以三把刀放出飛行的斬擊', '세 자루로 날아가는 참격을 쏜다'], { k: 'inst', L: 1, R: 50, v: 'thrust', sty: 'x_santoryu' }),
    t(SANTO, ['三・千・世・界', 'Three Thousand Worlds', '三・千・世・界', '삼·천·세·계'], ['両手の刀を風車のように回して突っこむ奥義', 'The ultimate technique: charges while spinning two swords like a windmill', '將雙手的刀如風車般旋轉並衝入的奧義', '양손의 칼을 풍차처럼 돌리며 돌진하는 오의'], { k: 'inst', L: 2, R: 38, O: 1, I: .8, v: 'spin', sty: 'x_santoryu' }),
    t(KYUTO, ['阿修羅 弌霧銀', 'Asura: Ichibugin', '阿修羅 弌霧銀', '아수라 일무은'], ['気迫で三面六臂に見え、九本の刀で斬りぬける', 'His spirit makes him look three-faced and six-armed as nine swords cut through', '氣魄使其看似三頭六臂，以九把刀斬穿而過', '기백으로 삼면육비처럼 보이며 아홉 자루의 칼로 베어 지나간다'], { k: 'multi', N: 9, R: 34, v: 'arcs', sty: 'x_santoryu' }),
  ], ['ロロノアゾロ']),
  // ---------- るろうに剣心 ----------
  c('緋村剣心', 'ひむらけんしん', ['Kenshin Himura', '緋村劍心', '히무라 켄신'], 'kenshin', 'red', 99, HITEN, [
    t(HITEN, ['龍槌閃', 'Ryutsuisen', '龍槌閃', '용추섬'], ['高く跳び、落ちる勢いで叩き斬る', 'Leaps high and strikes down with the force of the fall', '高高躍起，藉下落之勢劈斬', '높이 뛰어올라 떨어지는 기세로 내리친다'], { k: 'inst', L: 0, R: 14, O: 1, v: 'fall', sty: 'x_hiten' }),
    t(HITEN, ['龍翔閃', 'Ryushosen', '龍翔閃', '용상섬'], ['刀の腹を支えて、下から跳ね上げる', 'Braces the flat of the blade and strikes upward from below', '以手撐住刀身，由下往上挑起', '칼의 옆면을 받쳐 아래에서 쳐올린다'], { k: 'inst', L: 0, R: 12, O: 1, v: 'arcUp', sty: 'x_hiten' }),
    t(HITEN, ['龍巻閃', 'Ryukansen', '龍卷閃', '용권섬'], ['体を回して攻めをかわし、そのまま斬る', 'Spins to dodge the attack and cuts in the same motion', '旋轉身體閃開攻擊，順勢斬擊', '몸을 돌려 공격을 피하고 그대로 벤다'], { k: 'aura', L: 1, R: 7, D: 2.5, v: 'spin', sty: 'x_hiten' }),
    t(HITEN, ['龍巣閃', 'Ryusosen', '龍巢閃', '용소섬'], ['全身の急所をめった打ちにする乱撃', 'A flurry that hammers every vital point of the body', '亂打全身要害的亂擊', '온몸의 급소를 마구 치는 난격'], { k: 'multi', N: 9, R: 22, v: 'arcs', sty: 'x_hiten' }),
    t(HITEN, ['土龍閃', 'Doryusen', '土龍閃', '토룡섬'], ['地面を打ち、土と石のつぶてを飛ばす', 'Strikes the ground and sends earth and stones flying', '擊打地面，使土石飛射而出', '땅을 쳐서 흙과 돌멩이를 날린다'], { k: 'inst', L: 1, R: 30, O: 1, v: 'storm', sty: 'x_hiten' }),
    t(HITEN, ['双龍閃', 'Soryusen', '雙龍閃', '쌍룡섬'], ['抜刀をかわされても、鞘の二撃目が続く', 'If the draw is dodged, a second strike with the sheath follows', '即使拔刀被閃過，還有刀鞘的第二擊', '발도를 피해도 칼집의 두 번째 일격이 이어진다'], { k: 'inst', L: 1, R: 18, I: .5, v: 'arcH', a: 'iai', sty: 'x_hiten' }),
    t(HITEN, ['九頭龍閃', 'Kuzuryusen', '九頭龍閃', '구두룡섬'], ['九つの斬撃を同時に打ちこむ、防げない突進', 'An unblockable charge that lands nine strikes at once', '同時打出九道斬擊、無法防禦的突進', '아홉 줄기 참격을 동시에 꽂는, 막을 수 없는 돌진'], { k: 'inst', L: 2, R: 32, O: 1, I: .8, v: 'claws', sty: 'x_hiten' }),
    t(OUGI, ['天翔龍閃', 'Amakakeru Ryu no Hirameki', '天翔龍閃', '천상용섬'], ['左足を踏みこむ、超神速の抜刀術', 'A draw beyond godspeed, stepping in with the left foot', '踏出左腳、超神速的拔刀術', '왼발을 내딛는 초신속의 발도술'], { k: 'inst', L: 9, R: 55, O: 1, I: 1, v: 'mega', a: 'iai', sty: 'x_hiten' }),
  ]),
  c('斎藤一', 'さいとうはじめ', ['Hajime Saito', '齋藤一', '사이토 하지메'], 'kenshin', 'ainezu', 96, GATOTSU, [
    t(GATOTSU, ['壱式', 'Isshiki (First Stance)', '壹式', '1식'], ['左手一本の、突進しながらの突き', 'A left-handed thrust delivered while charging', '單憑左手、一邊突進一邊刺出的突刺', '왼손 하나로 돌진하며 찌른다'], { k: 'inst', L: 0, R: 46, I: .6, v: 'thrust', sty: 'x_gatotsu' }),
    t(GATOTSU, ['弐式', 'Nishiki (Second Stance)', '貳式', '2식'], ['斜め上から突き下ろす', 'Thrusts down diagonally from above', '由斜上方往下刺', '비스듬히 위에서 내리찌른다'], { k: 'inst', L: 0, R: 30, O: 1, v: 'fall', sty: 'x_gatotsu' }),
    t(GATOTSU, ['参式', 'Sanshiki (Third Stance)', '參式', '3식'], ['空中の相手を下から突き上げる', 'Thrusts upward at a foe in the air', '由下往上刺向空中的對手', '공중의 상대를 아래에서 찔러 올린다'], { k: 'inst', L: 1, R: 16, O: 1, v: 'arcUp', sty: 'x_gatotsu' }),
    t(GATOTSU, ['零式', 'Zeroshiki (Zero Stance)', '零式', '0식'], ['間合いなしで、上半身のバネだけで放つ奥の手', 'His trump card: fired at point-blank range with the spring of the upper body alone', '在零距離下，僅憑上半身的彈力使出的殺手鐧', '거리 없이 상반신의 탄력만으로 쏘는 비장의 수'], { k: 'inst', L: 1, R: 60, O: 1, I: 1, v: 'mega', sty: 'x_gatotsu' }),
  ], ['斉藤一']),
  c('志々雄真実', 'ししおまこと', ['Makoto Shishio', '志志雄真實', '시시오 마코토'], 'kenshin', 'red', 99, ['無限刃', 'Mugenjin', '無限刃', '무한인'], [
    t(HIKEN, ['壱の秘剣・焔霊', 'First Secret Sword: Homuradama', '壹之秘劍・焰靈', '제1비검·염령'], ['刃にしみこんだ人の脂を燃やし、斬りながら焼く', 'Ignites the human fat soaked into the blade, burning as it cuts', '點燃滲入刀刃的人脂，邊斬邊燒', '칼날에 밴 사람의 기름을 태워 베면서 불태운다'], { k: 'inst', L: 1, R: 18, v: 'arcH', sty: 'x_homura' }),
    t(HIKEN, ['弐の秘剣・紅蓮腕', 'Second Secret Sword: Guren Kaina', '貳之秘劍・紅蓮腕', '제2비검·홍련완'], ['手甲の火薬に火をつけ、つかんだ相手ごと爆発させる', 'Lights the gunpowder in his gauntlet and blows up whoever he has grabbed', '點燃手甲中的火藥，連同抓住的對手一起引爆', '수갑의 화약에 불을 붙여 붙잡은 상대째 폭발시킨다'], { k: 'inst', L: 1, R: 12, O: 1, v: 'storm', sty: 'x_homura' }),
    t(HIKEN, ['終の秘剣・火産霊神', 'Final Secret Sword: Kaguzuchi', '終之秘劍・火產靈神', '최종비검·화산령신'], ['刀身すべてを燃やし、炎の竜巻を起こす', 'Sets the whole blade ablaze and raises a tornado of fire', '點燃整把刀身，掀起火焰龍捲', '칼날 전체를 불태워 불꽃의 회오리를 일으킨다'], { k: 'aura', L: 2, R: 10, D: 5.5, O: 1, v: 'vortex', sty: 'x_homura' }),
  ], ['志志雄真実']),
  // ---------- 2回目：BLEACH・ONE PIECE・るろうに剣心 ----------
  c('市丸ギン', 'いちまるぎん', ['Gin Ichimaru', '市丸銀', '이치마루 긴'], 'bleach', 'white', 97, ['斬魄刀「神鎗」', 'Zanpakuto: Shinso', '斬魄刀「神槍」', '참백도 「신창」'], [
    t(SHIKAI, ['神鎗', 'Shinso', '神槍', '신창'], ['「射殺せ」のひと声で、刀身が一瞬で伸びて貫く', 'At the words "shoot to kill," the blade extends in an instant and pierces', '一聲「射殺他」，刀身瞬間伸長貫穿', '"쏴 죽여라" 한마디에 칼날이 순식간에 늘어나 꿰뚫는다'], { k: 'inst', L: 0, R: 60, v: 'thrust', sty: 'x_shinso' }),
    t(BANKAI, ['神殺鎗', 'Kamishini no Yari', '神殺槍', '신살창'], ['音よりも速く伸び縮みする刃で貫く', 'Pierces with a blade that extends and contracts faster than sound', '以比聲音更快伸縮的刀刃貫穿', '소리보다 빠르게 늘었다 줄어드는 칼날로 꿰뚫는다'], { k: 'inst', L: 0, R: 70, O: 1, I: .6, v: 'thrust', sty: 'x_shinso' }),
    t(BANKAI, ['無踏', 'Buto', '無踏', '무답'], ['胸の前に構え、最速の伸びで撃ちぬく', 'Held at the chest, then fired at its fastest extension', '架於胸前，以最快的伸長擊穿', '가슴 앞에 겨누고 가장 빠른 신장으로 꿰뚫는다'], { k: 'inst', L: 0, R: 50, I: .5, v: 'bolt', a: 'iai', sty: 'x_shinso' }),
    t(BANKAI, ['無踏連刃', 'Buto Renjin', '無踏連刃', '무답연인'], ['伸び縮みをくり返し、続けざまに貫く', 'Extends and contracts over and over, piercing in rapid succession', '反覆伸縮，接連貫穿', '늘었다 줄기를 되풀이하며 잇달아 꿰뚫는다'], { k: 'multi', N: 10, R: 50, v: 'arcs', sty: 'x_shinso' }),
    t(BANKAI, ['殺せ「神殺鎗」', 'Kill, Kamishini no Yari', '殺吧「神殺槍」', '죽여라 「신살창」'], ['相手の中に残した刃のかけらの毒で、内側から溶かす', 'A shard of the blade left inside the foe dissolves them from within with its poison', '以留在對手體內的刀刃碎片之毒，由內部溶解', '상대의 몸속에 남긴 칼날 조각의 독으로 안에서부터 녹인다'], { k: 'inst', L: 1, R: 30, O: 1, v: 'storm', sty: 'x_shinso' }),
  ]),
  c('浦原喜助', 'うらはらきすけ', ['Kisuke Urahara', '浦原喜助', '우라하라 키스케'], 'bleach', 'red', 99, ['斬魄刀「紅姫」', 'Zanpakuto: Benihime', '斬魄刀「紅姬」', '참백도 「홍희」'], [
    t(SHIKAI, ['啼け「紅姫」', 'Sing, Benihime', '啼吧「紅姬」', '울어라 「홍희」'], ['紅い斬撃を飛ばす', 'Fires a crimson slash', '放出紅色的斬擊', '붉은 참격을 날린다'], { k: 'inst', L: 1, R: 36, v: 'arcH', sty: 'x_beni' }),
    t(SHIKAI, ['血霞の盾', 'Chikasumi no Tate', '血霞之盾', '혈하의 방패'], ['血の色の盾を張って攻めを防ぐ', 'Raises a blood-colored shield that blocks attacks', '展開血色之盾擋下攻擊', '핏빛 방패를 펼쳐 공격을 막는다'], { k: 'aura', L: 1, R: 7, D: 4, G: 1, v: 'calm', sty: 'x_beni' }),
    t(SHIKAI, ['剃刀紅姫', 'Kamisori Benihime', '剃刀紅姬', '면도날 홍희'], ['かみそりのように鋭い紅の刃を飛ばす', 'Fires a crimson blade as sharp as a razor', '放出如剃刀般銳利的紅刃', '면도날처럼 날카로운 붉은 칼날을 날린다'], { k: 'inst', L: 0, R: 50, v: 'thrust', sty: 'x_beni' }),
    t(SHIKAI, ['縛り紅姫', 'Shibari Benihime', '縛紅姬', '속박의 홍희'], ['黒い網を広げて相手を縛りつける', 'Spreads a black net that binds the foe', '展開黑網束縛對手', '검은 그물을 펼쳐 상대를 묶는다'], { k: 'slow', D: 5, S: .35, v: 'eye', sty: 'x_beni' }),
    t(SHIKAI, ['火遊紅姫 数珠繋', 'Hiasobi Benihime, Juzutsunagi', '火遊紅姬 數珠繫', '불장난 홍희 염주 잇기'], ['網を伝って、数珠つなぎに爆発させる', 'Sets off a chain of explosions along the net like prayer beads', '沿著網子如念珠般連鎖引爆', '그물을 타고 염주처럼 줄줄이 폭발시킨다'], { k: 'multi', N: 12, R: 36, v: 'arcs', sty: 'x_beni' }),
    t(BANKAI, ['観音開紅姫改メ', 'Kannonbiraki Benihime Aratame', '觀音開紅姬改', '관음개 홍희 개'], ['触れたものを切り開き、造り変える', 'Cuts open whatever it touches and remakes it', '切開觸及之物並加以改造', '닿은 것을 갈라 열어 다시 만든다'], { k: 'aura', L: 9, R: 9, D: 6, O: 1, G: 1, v: 'calm', sty: 'x_beni' }),
  ]),
  c('京楽春水', 'きょうらくしゅんすい', ['Shunsui Kyoraku', '京樂春水', '쿄라쿠 슌스이'], 'bleach', 'pink', 99, ['斬魄刀「花天狂骨」', 'Zanpakuto: Katen Kyokotsu', '斬魄刀「花天狂骨」', '참백도 「화천광골」'], [
    t(SHIKAI, ['不精独楽', 'Bushogoma', '不精獨樂', '게으른 팽이'], ['風の渦を巻き起こす', 'Whips up a vortex of wind', '捲起風之漩渦', '바람의 소용돌이를 일으킨다'], { k: 'aura', L: 1, R: 7, D: 3, v: 'vortex', sty: 'x_katen' }),
    t(SHIKAI, ['嶄鬼', 'Takaoni', '嶄鬼', '참귀'], ['高いところにいる方が勝つ遊び。上から叩き斬る', 'A game where whoever is higher wins. Strikes down from above', '位置高的一方獲勝的遊戲。由上往下劈斬', '높은 곳에 있는 쪽이 이기는 놀이. 위에서 내리친다'], { k: 'inst', L: 1, R: 16, O: 1, v: 'fall', sty: 'x_katen' }),
    t(SHIKAI, ['影鬼', 'Kageoni', '影鬼', '그림자 술래'], ['影にもぐり、踏まれた影から斬る', 'Sinks into shadows and cuts from the shadow that was stepped on', '潛入影中，從被踩到的影子斬擊', '그림자에 숨어들어 밟힌 그림자에서 벤다'], { k: 'multi', N: 7, R: 30, v: 'arcs', sty: 'x_katen' }),
    t(SHIKAI, ['艶鬼', 'Irooni', '艷鬼', '색깔 술래'], ['口にした色のものだけが斬れる遊び', 'A game where only things of the color you name can be cut', '只有說出口的顏色才能斬到的遊戲', '입에 올린 색의 것만 벨 수 있는 놀이'], { k: 'inst', L: 2, R: 24, v: 'arcH', sty: 'x_katen' }),
    t(BANKAI, ['花天狂骨枯松心中', 'Katen Kyokotsu: Karamatsu Shinju', '花天狂骨枯松心中', '화천광골 고송심중'], ['まわりを暗く冷たい絶望で包みこむ', 'Wraps everything around in dark, cold despair', '以陰暗冰冷的絕望籠罩四周', '주위를 어둡고 차가운 절망으로 감싼다'], { k: 'slow', D: 7, S: .3, v: 'eye', sty: 'x_katen' }),
    t(BANKAI, ['〆の段・糸切鋏血染喉', 'Shime no Dan: Itokiribasami Chizome no Nodobue', '終段・絲切鋏血染喉', '마무리 단·실 가위 피에 물든 목'], ['相手の喉に糸を巻き、ひと息に断つ', 'Winds a thread around the throat and severs it in one breath', '以絲線纏住對手的咽喉，一口氣切斷', '상대의 목에 실을 감아 단숨에 끊는다'], { k: 'inst', L: 9, R: 50, O: 1, I: 1, v: 'mega', sty: 'x_katen' }),
  ]),
  c('阿散井恋次', 'あばらいれんじ', ['Renji Abarai', '阿散井戀次', '아바라이 렌지'], 'bleach', 'red', 94, ['斬魄刀「蛇尾丸」', 'Zanpakuto: Zabimaru', '斬魄刀「蛇尾丸」', '참백도 「사미환」'], [
    t(SHIKAI, ['蛇尾丸', 'Zabimaru', '蛇尾丸', '사미환'], ['節に分かれた刃が、鞭のように伸びてうねる', 'The segmented blade extends and whips like a lash', '分成數節的刀刃如鞭子般伸長甩動', '마디로 나뉜 칼날이 채찍처럼 늘어나 굽이친다'], { k: 'multi', N: 6, R: 30, v: 'arcs', sty: 'x_zabi' }),
    t(BANKAI, ['狒狒王蛇尾丸', 'Hihio Zabimaru', '狒狒王蛇尾丸', '비비왕 사미환'], ['巨大な骨の大蛇をあやつって暴れさせる', 'Commands a gigantic skeletal serpent to rampage', '操縱巨大的骨蛇肆虐', '거대한 뼈의 뱀을 조종해 날뛰게 한다'], { k: 'flow', L: 1, D: 5, v: 'dragon', sty: 'x_zabi' }),
    t(BANKAI, ['狒牙絶咬', 'Higa Zekko', '狒牙絕咬', '비아절교'], ['ばらけた刃の節を、四方から突き立てる', 'Drives the scattered blade segments in from every side', '將散開的刀節從四面八方刺入', '흩어진 칼날 마디를 사방에서 꽂는다'], { k: 'rain', D: 3, R: 30, v: 'rainfall', sty: 'x_zabi' }),
    t(BANKAI, ['狒骨大砲', 'Hikotsu Taiho', '狒骨大砲', '비골대포'], ['大蛇の口から霊圧の砲撃を放つ', 'Fires a blast of spirit energy from the serpent\'s mouth', '從大蛇口中放出靈壓砲擊', '뱀의 입에서 영압의 포격을 쏜다'], { k: 'inst', L: 1, R: 60, O: 1, v: 'mega', sty: 'x_zabi' }),
    t(['真の卍解', 'True Bankai', '真正的卍解', '진정한 만해'], ['双王蛇尾丸・蛇牙鉄炮', 'So-o Zabimaru: Zaga Teppo', '雙王蛇尾丸・蛇牙鐵砲', '쌍왕 사미환·사아철포'], ['炎の牙で噛みつき、そのまま焼きつくす', 'Bites down with fangs of flame and burns the foe to nothing', '以火焰之牙咬住，直接燒盡', '불꽃의 송곳니로 물고 그대로 모조리 태운다'], { k: 'inst', L: 2, R: 40, O: 1, I: .8, v: 'claws', sty: 'x_zabi' }),
  ]),
  c('藍染惣右介', 'あいぜんそうすけ', ['Sosuke Aizen', '藍染惣右介', '아이젠 소스케'], 'bleach', 'purple', 100, ['斬魄刀「鏡花水月」', 'Zanpakuto: Kyoka Suigetsu', '斬魄刀「鏡花水月」', '참백도 「경화수월」'], [
    t(SHIKAI, ['鏡花水月', 'Kyoka Suigetsu', '鏡花水月', '경화수월'], ['解放を一度でも見た者の五感を支配する、完全催眠', 'Complete hypnosis: controls all five senses of anyone who has seen its release even once', '完全催眠：支配所有見過其解放之人的五感', '완전최면. 해방을 한 번이라도 본 자의 오감을 지배한다'], { k: 'slow', D: 7, S: .25, v: 'eye', sty: 'x_kyoka' }),
    t(ZANJUTSU, ['一太刀', 'A Single Stroke', '一刀', '한 칼'], ['気づいたときには、もう斬られている', 'By the time you notice, you have already been cut', '察覺到的時候，已經被斬了', '알아차렸을 때는 이미 베여 있다'], { k: 'multi', N: 10, R: 36, v: 'arcs', sty: 'x_kyoka' }),
    t(['破道の九十', 'Hado #90', '破道之九十', '파도의 90'], ['黒棺', 'Kurohitsugi', '黑棺', '흑관'], ['黒い箱に閉じこめ、無数の刃で貫く', 'Seals the foe in a black box and runs them through with countless blades', '關入黑色箱中，以無數刀刃貫穿', '검은 상자에 가두고 무수한 칼날로 꿰뚫는다'], { k: 'inst', L: 9, R: 40, O: 1, v: 'storm', sty: 'x_hitsugi' }),
    t(['破道の九十九', 'Hado #99', '破道之九十九', '파도의 99'], ['五龍転滅', 'Goryu Tenmetsu', '五龍轉滅', '오룡전멸'], ['大地を割って、霊圧の龍を呼び出す', 'Splits the earth and summons dragons of spirit energy', '撕裂大地，喚出靈壓之龍', '대지를 갈라 영압의 용을 불러낸다'], { k: 'rain', D: 5, R: 40, O: 1, v: 'rainfall', sty: 'x_hitsugi' }),
  ]),
  c('ブルック', 'ぶるっく', ['Brook', '布魯克', '브룩'], 'onepiece', 'white', 90, ['魂の喪剣', 'Soul Solid', '魂之喪劍', '혼의 상검'], [
    t(['仕込み杖', 'Cane Sword', '手杖劍', '지팡이 검'], ['鼻唄三丁 矢筈斬り', 'Hanauta Sancho: Yahazu Giri', '鼻歌三丁 矢筈斬', '콧노래 세 가락 화살깃 베기'], ['斬られたことに気づかせない、すれ違いざまの居合い', 'A passing quick-draw so fast the foe does not notice being cut', '擦身而過的居合，讓人察覺不到已被斬', '베였다는 것조차 모르게 하는, 스쳐 지나가는 발도술'], { k: 'inst', L: 0, R: 34, I: .5, v: 'bolt', a: 'iai', sty: 'x_soul' }),
    t(['仕込み杖', 'Cane Sword', '手杖劍', '지팡이 검'], ['革命舞曲 ボンナバン', 'Gavotte Bond en Avant', '革命舞曲 向前躍進', '가보트 본 아방'], ['一直線に飛びこむ突き', 'A thrust that leaps straight in', '筆直躍進的突刺', '일직선으로 뛰어드는 찌르기'], { k: 'inst', L: 0, R: 45, v: 'thrust', sty: 'x_soul' }),
    t(['仕込み杖', 'Cane Sword', '手杖劍', '지팡이 검'], ['夜明歌 クー・ドロア', 'Aubade Coup Droit', '晨歌 直擊', '오바드 쿠 드루아'], ['突きの衝撃だけを遠くへ飛ばす', 'Sends just the shock of the thrust flying far ahead', '只將突刺的衝擊送向遠處', '찌르기의 충격만을 멀리 날린다'], { k: 'inst', L: 0, R: 55, v: 'thrust', sty: 'x_soul' }),
    t(['魂の喪剣', 'Soul Solid', '魂之喪劍', '혼의 상검'], ['魂の喪剣', 'Soul Solid', '魂之喪劍', '혼의 상검'], ['黄泉の国の冷気を刃にまとわせる', 'Cloaks the blade in the chill of the underworld', '讓刀刃纏上黃泉之國的寒氣', '황천의 냉기를 칼날에 두른다'], { k: 'aura', L: 1, R: 7, D: 4, v: 'spin', sty: 'x_soul' }),
    t(['魂の喪剣', 'Soul Solid', '魂之喪劍', '혼의 상검'], ['掠り唄 吹雪斬り', 'Kasuriuta: Fubuki Giri', '掠歌 吹雪斬', '스침 노래 눈보라 베기'], ['すれ違いざまに斬り、傷口から凍らせる', 'Cuts while passing, and the wound freezes over', '擦身而過時斬擊，從傷口開始凍結', '스쳐 지나가며 베고, 상처부터 얼린다'], { k: 'multi', N: 7, R: 30, v: 'arcs', sty: 'x_soul' }),
  ]),
  c('トラファルガー・ロー', 'とらふぁるがーろー', ['Trafalgar Law', '特拉法爾加・羅', '트라팔가 로'], 'onepiece', 'blue', 97, ['オペオペの実と妖刀「鬼哭」', 'Ope Ope no Mi & Kikoku', '手術果實與妖刀「鬼哭」', '수술수술 열매와 요도 「귀곡」'], [
    t(['オペオペの実', 'Ope Ope no Mi', '手術果實', '수술수술 열매'], ['ROOM', 'ROOM', 'ROOM', 'ROOM'], ['青い球の空間を広げ、中のものを自在に切りきざむ', 'Spreads a blue sphere and freely cuts up whatever is inside', '展開藍色球形空間，隨意切割其中之物', '푸른 구의 공간을 펼쳐 그 안의 것을 자유자재로 썬다'], { k: 'aura', L: 2, R: 10, D: 5, v: 'calm', sty: 'x_room' }),
    t(['オペオペの実', 'Ope Ope no Mi', '手術果實', '수술수술 열매'], ['シャンブルズ', 'Shambles', '屠宰場', '섐블즈'], ['ROOMの中のものの場所を入れかえ、次々に斬る', 'Swaps the positions of things inside the ROOM and cuts one after another', '交換ROOM內物體的位置，接連斬擊', 'ROOM 안의 것들의 위치를 바꿔 가며 잇달아 벤다'], { k: 'flow', L: 1, D: 4, v: 'ribbon', sty: 'x_room' }),
    t(['オペオペの実', 'Ope Ope no Mi', '手術果實', '수술수술 열매'], ['ラジオナイフ', 'Radio Knife', '放射刀', '라디오 나이프'], ['電気をまとった刃で、くっつけられないように切りはなす', 'Cuts with an electrified blade so the pieces cannot be rejoined', '以帶電的刀刃切開，使其無法再接合', '전기를 두른 칼날로 다시 붙지 못하게 잘라 낸다'], { k: 'multi', N: 6, R: 24, v: 'arcs', sty: 'x_room' }),
    t(['オペオペの実', 'Ope Ope no Mi', '手術果實', '수술수술 열매'], ['注射ショット', 'Injection Shot', '注射槍', '인젝션 샷'], ['刀を銃のように突き出して撃ちぬく', 'Thrusts the sword forward like a gunshot', '將刀如槍一般刺出擊穿', '칼을 총처럼 내질러 꿰뚫는다'], { k: 'inst', L: 0, R: 50, v: 'thrust', sty: 'x_room' }),
    t(['オペオペの実', 'Ope Ope no Mi', '手術果實', '수술수술 열매'], ['ガンマナイフ', 'Gamma Knife', '伽瑪刀', '감마 나이프'], ['外は傷つけず、体の内側だけを壊す', 'Leaves the outside unharmed and destroys only the inside of the body', '不傷外表，只破壞身體內部', '겉은 다치게 하지 않고 몸속만 부순다'], { k: 'inst', L: 0, R: 14, O: 1, v: 'arcDown', sty: 'x_room' }),
    t(['覚醒', 'Awakening', '覺醒', '각성'], ['穿刺波', 'Puncture Wille', '穿刺波', '펑처 빌레'], ['刀から衝撃波を伸ばし、どこまでも貫く', 'Extends a shock wave from the sword that pierces without end', '從刀延伸出衝擊波，無止境地貫穿', '칼에서 충격파를 뻗어 어디까지고 꿰뚫는다'], { k: 'inst', L: 1, R: 70, O: 1, I: .8, v: 'mega', sty: 'x_room' }),
  ], ['トラファルガー・D・ワーテル・ロー']),
  c('光月おでん', 'こうづきおでん', ['Kozuki Oden', '光月御田', '코즈키 오뎅'], 'onepiece', 'purple', 100, ['おでん二刀流', 'Oden Two Sword Style', '御田二刀流', '오뎅 이도류'], [
    t(['おでん二刀流', 'Oden Two Sword Style', '御田二刀流', '오뎅 이도류'], ['銃・擬鬼', 'Gun Modoki', '銃・擬鬼', '건 모도키'], ['二刀をそろえて撃ちこむ、突進の斬撃', 'A charging slash that drives both swords in together', '雙刀併攏擊出的突進斬擊', '두 칼을 모아 꽂는 돌진의 참격'], { k: 'inst', L: 1, R: 50, O: 1, v: 'thrust', sty: 'x_oden' }),
    t(['おでん二刀流', 'Oden Two Sword Style', '御田二刀流', '오뎅 이도류'], ['桃源白滝', 'Togen Shirataki', '桃源白瀧', '도원백롱'], ['二刀を重ねて、横へ大きく薙ぐ', 'Layers both swords and sweeps wide to the side', '雙刀重疊，大幅橫掃', '두 칼을 겹쳐 옆으로 크게 휩쓴다'], { k: 'inst', L: 2, R: 24, v: 'arcH', sty: 'x_oden' }),
    t(['おでん二刀流', 'Oden Two Sword Style', '御田二刀流', '오뎅 이도류'], ['桃源十拳', 'Togen Totsuka', '桃源十拳', '도원십권'], ['カイドウにただ一つの傷を残した、十字の斬撃', 'The cross-shaped slash that left Kaido his only scar', '在凱多身上留下唯一傷痕的十字斬擊', '카이도에게 단 하나의 흉터를 남긴 십자 참격'], { k: 'inst', L: 9, R: 60, O: 1, I: 1, v: 'mega', sty: 'x_oden' }),
  ], ['こうずきおでん']),
  c('瀬田宗次郎', 'せたそうじろう', ['Sojiro Seta', '瀨田宗次郎', '세타 소지로'], 'kenshin', 'white', 98, ['縮地', 'Shukuchi', '縮地', '축지'], [
    t(['縮地', 'Shukuchi', '縮地', '축지'], ['三歩手前', 'Three Steps Short', '三步之前', '세 걸음 전'], ['まだ本気ではない。それでも目で追えない', 'Not serious yet. Still too fast for the eye to follow', '還沒有認真。即使如此肉眼也追不上', '아직 진심이 아니다. 그래도 눈으로 좇을 수 없다'], { k: 'flow', L: 0, D: 3, v: 'ribbon', sty: 'x_shuku' }),
    t(['縮地', 'Shukuchi', '縮地', '축지'], ['一歩手前', 'One Step Short', '一步之前', '한 걸음 전'], ['壁も天井も足場にして、四方から斬る', 'Uses walls and ceiling as footholds and cuts from every side', '以牆壁與天花板為踏板，從四面八方斬擊', '벽도 천장도 발판으로 삼아 사방에서 벤다'], { k: 'flow', L: 1, D: 4.5, v: 'ribbon', sty: 'x_shuku' }),
    t(['縮地', 'Shukuchi', '縮地', '축지'], ['縮地', 'Shukuchi', '縮地', '축지'], ['姿が消え、地を蹴る音だけが残る', 'His form vanishes; only the sound of feet striking the ground remains', '身影消失，只留下蹬地的聲音', '모습이 사라지고 땅을 차는 소리만 남는다'], { k: 'flow', L: 2, D: 6, O: 1, v: 'dragon', sty: 'x_shuku' }),
    t(OUGI, ['瞬天殺', 'Shuntensatsu', '瞬天殺', '순천살'], ['縮地から抜刀術へつなぐ、痛みを感じる間もない一撃', 'Shukuchi into a sword draw: a blow that leaves no time to feel pain', '由縮地接拔刀術，連痛都來不及感覺的一擊', '축지에서 발도술로 잇는, 아픔을 느낄 틈도 없는 일격'], { k: 'inst', L: 1, R: 60, O: 1, I: 1, v: 'mega', a: 'iai', sty: 'x_shuku' }),
  ]),
  c('四乃森蒼紫', 'しのもりあおし', ['Aoshi Shinomori', '四乃森蒼紫', '시노모리 아오시'], 'kenshin', 'bluepurple', 96, ['御庭番式小太刀二刀流', 'Oniwaban Twin Kodachi Style', '御庭番式小太刀二刀流', '오니와반식 소태도 이도류'], [
    t(['御庭番式', 'Oniwaban Style', '御庭番式', '오니와반식'], ['流水の動き', 'Ryusui no Ugoki', '流水之動', '유수의 움직임'], ['緩急をつけたゆるやかな動きで、相手の目を惑わす', 'Slow, flowing movement with shifts of pace that deceives the eye', '以緩急有致的流暢動作迷惑對手的眼睛', '완급을 준 느긋한 움직임으로 상대의 눈을 현혹한다'], { k: 'flow', L: 1, D: 4, v: 'ribbon', sty: 'x_kodachi' }),
    t(['小太刀二刀流', 'Twin Kodachi Style', '小太刀二刀流', '소태도 이도류'], ['陰陽交叉', 'Onmyo Kosa', '陰陽交叉', '음양교차'], ['一刀の峰をもう一刀で打ち、押し斬る', 'Strikes the back of one blade with the other to force the cut through', '以另一刀敲擊刀背，強行壓斬', '한 칼의 등을 다른 칼로 쳐서 눌러 벤다'], { k: 'inst', L: 0, R: 14, O: 1, v: 'arcDown', sty: 'x_kodachi' }),
    t(['小太刀二刀流', 'Twin Kodachi Style', '小太刀二刀流', '소태도 이도류'], ['陰陽撥止', 'Onmyo Hasshi', '陰陽撥止', '음양발지'], ['二刀を重ねて投げ、一本目の影に二本目を隠す', 'Throws both blades stacked, hiding the second in the shadow of the first', '將雙刀重疊擲出，把第二把藏在第一把的影子裡', '두 칼을 겹쳐 던져 첫 번째의 그림자에 두 번째를 숨긴다'], { k: 'inst', L: 0, R: 45, v: 'thrust', sty: 'x_kodachi' }),
    t(['小太刀二刀流', 'Twin Kodachi Style', '小太刀二刀流', '소태도 이도류'], ['呉鉤十字', 'Goko Juji', '吳鉤十字', '오구십자'], ['二刀を交差させ、はさみのように斬る', 'Crosses both blades and cuts like a pair of shears', '雙刀交叉，如剪刀般斬擊', '두 칼을 교차시켜 가위처럼 벤다'], { k: 'inst', L: 1, R: 16, v: 'claws', sty: 'x_kodachi' }),
    t(['小太刀二刀流', 'Twin Kodachi Style', '小太刀二刀流', '소태도 이도류'], ['回天剣舞', 'Kaiten Kenbu', '迴天劍舞', '회천검무'], ['流水の動きから、回りながらの三連撃', 'From the flowing movement, three spinning strikes in a row', '由流水之動接旋轉的三連擊', '유수의 움직임에서 돌면서 3연격'], { k: 'multi', N: 3, R: 20, v: 'arcs', sty: 'x_kodachi' }),
    t(['小太刀二刀流', 'Twin Kodachi Style', '小太刀二刀流', '소태도 이도류'], ['回天剣舞・六連', 'Kaiten Kenbu Rokuren', '迴天劍舞・六連', '회천검무·육련'], ['二刀で左右から打ちこむ、六連撃', 'Six consecutive strikes driven in from both sides with two blades', '以雙刀從左右打入的六連擊', '두 칼로 좌우에서 꽂는 6연격'], { k: 'multi', N: 12, R: 34, v: 'arcs', sty: 'x_kodachi' }),
  ]),
  // ---------- 3回目：犬夜叉・NARUTO・SAO・ダイの大冒険・ブラッククローバー・Fate・REBORN ----------
  c('犬夜叉', 'いぬやしゃ', ['Inuyasha', '犬夜叉', '이누야샤'], 'inuyasha', 'red', 96, ['鉄砕牙', 'Tessaiga', '鐵碎牙', '철쇄아'], [
    t(['鉄砕牙', 'Tessaiga', '鐵碎牙', '철쇄아'], ['風の傷', 'Wind Scar', '風之傷', '바람의 상처'], ['妖気がぶつかる裂け目を斬り、ひと振りで百の妖怪をなぎ払う', 'Cuts the rift where demonic auras clash and mows down a hundred demons in one swing', '斬開妖氣相撞的裂縫，一揮掃倒百隻妖怪', '요기가 부딪치는 틈을 베어 한 번 휘둘러 백 마리 요괴를 쓸어 버린다'], { k: 'inst', L: 2, R: 40, v: 'arcH', sty: 'x_tessaiga' }),
    t(['鉄砕牙', 'Tessaiga', '鐵碎牙', '철쇄아'], ['爆流破', 'Backlash Wave', '爆流破', '폭류파'], ['相手の妖気を巻きこみ、竜巻にして押し返す', 'Catches the foe\'s demonic energy and hurls it back as a tornado', '捲入對手的妖氣，化為龍捲反擊回去', '상대의 요기를 휘감아 회오리로 만들어 되돌려 보낸다'], { k: 'inst', L: 9, R: 50, O: 1, v: 'storm', sty: 'x_tessaiga' }),
    t(['鉄砕牙', 'Tessaiga', '鐵碎牙', '철쇄아'], ['金剛槍破', 'Adamant Barrage', '金剛槍破', '금강창파'], ['金剛石の槍を数えきれないほど撃ち出す', 'Fires countless spears of diamond', '射出數不清的金剛石之槍', '금강석의 창을 셀 수 없이 쏘아 낸다'], { k: 'rain', D: 4, R: 40, O: 1, v: 'rainfall', sty: 'x_tessaiga' }),
    t(['竜鱗の鉄砕牙', 'Dragon-Scaled Tessaiga', '龍鱗鐵碎牙', '용린의 철쇄아'], ['妖力吸収', 'Demonic Power Absorption', '吸收妖力', '요력 흡수'], ['斬った相手の妖力を吸いとって自分のものにする', 'Absorbs the demonic power of whoever it cuts', '吸取被斬對手的妖力化為己用', '벤 상대의 요력을 빨아들여 제 것으로 삼는다'], { k: 'inst', L: 1, R: 20, H: 40, v: 'arcH', sty: 'x_tessaiga' }),
    t(['黒い鉄砕牙', 'Black Tessaiga', '黑色鐵碎牙', '검은 철쇄아'], ['冥道残月破', 'Meido Zangetsuha', '冥道殘月破', '명도잔월파'], ['冥界への道を刃の形に開き、相手を送りこむ', 'Opens paths to the underworld shaped like blades and sends the foe through', '以刀刃之形開啟通往冥界之路，將對手送入其中', '명계로 가는 길을 칼날 모양으로 열어 상대를 보내 버린다'], { k: 'inst', L: 9, R: 60, O: 1, I: 1, v: 'mega', sty: 'x_meido' }),
  ]),
  c('殺生丸', 'せっしょうまる', ['Sesshomaru', '殺生丸', '셋쇼마루'], 'inuyasha', 'white', 99, ['爆砕牙', 'Bakusaiga', '爆碎牙', '폭쇄아'], [
    t(['妖術', 'Demon Art', '妖術', '요술'], ['光の鞭', 'Whip of Light', '光之鞭', '빛의 채찍'], ['指先から光の鞭を伸ばして薙ぐ', 'Extends a whip of light from the fingertips and sweeps', '從指尖伸出光之鞭橫掃', '손끝에서 빛의 채찍을 뻗어 휩쓴다'], { k: 'multi', N: 6, R: 24, v: 'arcs', sty: 'x_bakusai' }),
    t(['闘鬼神', 'Tokijin', '鬥鬼神', '투귀신'], ['蒼龍破', 'Dragon Strike', '蒼龍破', '창룡파'], ['青い龍の形をした雷を放つ', 'Fires lightning in the shape of a blue dragon', '放出青龍形狀的雷', '푸른 용 모양의 번개를 쏜다'], { k: 'inst', L: 1, R: 50, O: 1, v: 'thrust', sty: 'x_soryu' }),
    t(['天生牙', 'Tenseiga', '天生牙', '천생아'], ['冥道残月破', 'Meido Zangetsuha', '冥道殘月破', '명도잔월파'], ['完全な円の冥道を開き、相手をまるごと冥界へ送る', 'Opens a perfect circle to the underworld and sends the foe through whole', '開啟完整圓形的冥道，將對手整個送往冥界', '완전한 원의 명도를 열어 상대를 통째로 명계로 보낸다'], { k: 'inst', L: 9, R: 55, O: 1, I: .8, v: 'mega', sty: 'x_meido' }),
    t(['爆砕牙', 'Bakusaiga', '爆碎牙', '폭쇄아'], ['爆砕牙', 'Bakusaiga', '爆碎牙', '폭쇄아'], ['斬ったものを壊しつづけ、二度と再生させない', 'Keeps destroying whatever it cuts so it can never regenerate', '持續破壞被斬之物，使其再也無法再生', '벤 것을 계속 부수어 다시는 재생하지 못하게 한다'], { k: 'inst', L: 2, R: 38, O: 1, v: 'storm', sty: 'x_bakusai' }),
  ]),
  c('うちはサスケ', 'うちはさすけ', ['Sasuke Uchiha', '宇智波佐助', '우치하 사스케'], 'naruto', 'purple', 99, ['草薙の剣', 'Sword of Kusanagi', '草薙劍', '쿠사나기의 검'], [
    t(['雷遁', 'Lightning Release', '雷遁', '뇌둔'], ['千鳥流し', 'Chidori Stream', '千鳥流', '치도리 흘리기'], ['全身から雷を放ち、まわりをしびれさせる', 'Releases lightning from the whole body and paralyzes everything around', '從全身放出雷電，麻痺四周', '온몸에서 번개를 뿜어 주위를 마비시킨다'], { k: 'aura', L: 1, R: 7, D: 3, v: 'spin', sty: 'x_chidori' }),
    t(['雷遁', 'Lightning Release', '雷遁', '뇌둔'], ['千鳥刀', 'Chidori Katana', '千鳥刀', '치도리 검'], ['刀に千鳥を流し、防げない刃にする', 'Channels Chidori through the sword, making a blade that cannot be blocked', '將千鳥注入刀中，化為無法防禦的刀刃', '칼에 치도리를 흘려 막을 수 없는 칼날로 만든다'], { k: 'inst', L: 1, R: 18, O: 1, v: 'arcH', sty: 'x_chidori' }),
    t(['雷遁', 'Lightning Release', '雷遁', '뇌둔'], ['千鳥鋭槍', 'Chidori Sharp Spear', '千鳥銳槍', '치도리 예창'], ['雷を槍の形に伸ばして遠くまで貫く', 'Extends lightning into a spear that pierces far ahead', '將雷電伸長成槍形貫穿遠處', '번개를 창 모양으로 뻗어 멀리까지 꿰뚫는다'], { k: 'inst', L: 0, R: 50, v: 'thrust', sty: 'x_chidori' }),
    t(['万華鏡写輪眼', 'Mangekyo Sharingan', '萬花筒寫輪眼', '만화경 사륜안'], ['炎遁・加具土命', 'Blaze Release: Kagutsuchi', '炎遁・加具土命', '염둔·카구츠치'], ['消えない黒い炎を剣の形にしてあやつる', 'Shapes the unquenchable black flames into a sword and wields it', '將不滅的黑炎化為劍形加以操縱', '꺼지지 않는 검은 불꽃을 검 모양으로 만들어 다룬다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_kuro' }),
    t(['万華鏡写輪眼', 'Mangekyo Sharingan', '萬花筒寫輪眼', '만화경 사륜안'], ['須佐能乎', 'Susanoo', '須佐能乎', '스사노오'], ['紫の巨人をまとい、その太刀で前をなぎ払う', 'Cloaked in a purple giant, sweeps everything ahead with its great sword', '身披紫色巨人，以其太刀橫掃前方', '보랏빛 거인을 두르고 그 태도로 앞을 휩쓴다'], { k: 'inst', L: 9, R: 60, O: 1, I: 1, v: 'mega', sty: 'x_susanoo' }),
  ]),
  c('キリト', '', ['Kirito', '桐人', '키리토'], 'sao', 'black', 99, ['二刀流', 'Dual Blades', '二刀流', '이도류'], [
    t(['片手剣', 'One-Handed Sword', '單手劍', '한손검'], ['ソニックリープ', 'Sonic Leap', '音速衝擊', '소닉 리프'], ['ひと息に間合いをつめる突進の一撃', 'A charging blow that closes the distance in one breath', '一口氣拉近距離的突進一擊', '단숨에 거리를 좁히는 돌진의 일격'], { k: 'inst', L: 0, R: 26, I: .5, v: 'dash', a: 'iai', sty: 'x_sao' }),
    t(['片手剣', 'One-Handed Sword', '單手劍', '한손검'], ['ホリゾンタル・スクエア', 'Horizontal Square', '水平方陣斬', '호리존탈 스퀘어'], ['水平の四連撃で四角を描く', 'Four horizontal slashes that trace a square', '以水平四連擊畫出方形', '수평 4연격으로 사각형을 그린다'], { k: 'inst', L: 2, R: 14, v: 'arcH', sty: 'x_sao' }),
    t(['片手剣', 'One-Handed Sword', '單手劍', '한손검'], ['バーチカル・スクエア', 'Vertical Square', '垂直方陣斬', '버티컬 스퀘어'], ['垂直の四連撃', 'Four vertical slashes in a row', '垂直四連擊', '수직 4연격'], { k: 'multi', N: 4, R: 20, v: 'arcs', sty: 'x_sao' }),
    t(['片手剣', 'One-Handed Sword', '單手劍', '한손검'], ['ヴォーパル・ストライク', 'Vorpal Strike', '奪命擊', '보팔 스트라이크'], ['刀身の倍の長さまで届く、重い突き', 'A heavy thrust that reaches twice the length of the blade', '攻擊距離達刀身兩倍的重突刺', '칼날의 두 배 길이까지 닿는 묵직한 찌르기'], { k: 'inst', L: 0, R: 50, O: 1, v: 'thrust', sty: 'x_sao' }),
    t(['二刀流', 'Dual Blades', '二刀流', '이도류'], ['スターバースト・ストリーム', 'Starburst Stream', '星爆氣流斬', '스타버스트 스트림'], ['二刀で打ちこむ十六連撃', 'Sixteen consecutive strikes with two swords', '以雙刀打出的十六連擊', '두 칼로 꽂는 16연격'], { k: 'multi', N: 16, R: 34, v: 'arcs', sty: 'x_sao' }),
    t(['二刀流', 'Dual Blades', '二刀流', '이도류'], ['ジ・イクリプス', 'The Eclipse', '日蝕', '디 이클립스'], ['二刀の二十七連撃。太陽のコロナのように全方位を斬る', 'Twenty-seven strikes with two swords, cutting in every direction like a solar corona', '雙刀二十七連擊。如日冕般斬向全方位', '두 칼의 27연격. 태양의 코로나처럼 모든 방향을 벤다'], { k: 'aura', L: 9, R: 10, D: 5, O: 1, v: 'spin', sty: 'x_sao' }),
  ], ['桐ヶ谷和人', 'きりがやかずと', '桐ケ谷和人', 'Kazuto Kirigaya'], ['キリト']),
  c('アスナ', '', ['Asuna', '亞絲娜', '아스나'], 'sao', 'white', 97, ['細剣', 'Rapier', '細劍', '세검'], [
    t(['細剣', 'Rapier', '細劍', '세검'], ['リニアー', 'Linear', '線性攻擊', '리니어'], ['基本のひと突き。速すぎて光の線にしか見えない', 'A basic single thrust, so fast it looks like a line of light', '基本的一刺。快到只能看見一道光線', '기본 찌르기. 너무 빨라 빛의 선으로만 보인다'], { k: 'inst', L: 0, R: 34, I: .4, v: 'thrust', sty: 'x_rapier' }),
    t(['細剣', 'Rapier', '細劍', '세검'], ['スター・スプラッシュ', 'Star Splash', '星屑飛濺', '스타 스플래시'], ['八連続の突き', 'Eight consecutive thrusts', '八連突刺', '8연속 찌르기'], { k: 'multi', N: 8, R: 24, v: 'arcs', sty: 'x_rapier' }),
    t(['細剣', 'Rapier', '細劍', '세검'], ['フラッシング・ペネトレイター', 'Flashing Penetrator', '閃光穿刺', '플래싱 페네트레이터'], ['光の尾を引いて突進し、まとめて貫く', 'Charges trailing light and pierces everything in the way', '拖著光尾突進，一併貫穿', '빛의 꼬리를 끌며 돌진해 한꺼번에 꿰뚫는다'], { k: 'inst', L: 1, R: 55, O: 1, I: .8, v: 'mega', sty: 'x_rapier' }),
    t(['オリジナル・ソードスキル', 'Original Sword Skill', '原創劍技', '오리지널 소드 스킬'], ['マザーズ・ロザリオ', "Mother's Rosario", '聖母聖詠', '마더즈 로자리오'], ['十字を描く十連突きと、とどめの一突き。ユウキから受けついだ十一連撃', 'Ten thrusts tracing a cross and one finishing thrust: the eleven-hit combo inherited from Yuuki', '畫出十字的十連刺加上最後一刺。從有紀手中繼承的十一連擊', '십자를 그리는 10연속 찌르기와 마지막 일격. 유우키에게 물려받은 11연격'], { k: 'multi', N: 11, R: 36, v: 'arcs', sty: 'x_rapier' }),
  ], ['結城明日奈', 'ゆうきあすな', 'Asuna Yuuki'], ['アスナ']),
  c('ダイ', '', ['Dai', '達伊', '다이'], 'dai', 'blue', 100, ['アバン流刀殺法', 'Avan-Style Sword Technique', '阿邦流刀殺法', '아방류 도살법'], [
    t(['アバン流刀殺法', 'Avan-Style', '阿邦流刀殺法', '아방류 도살법'], ['大地斬', 'Earth Slash', '大地斬', '대지참'], ['力で、岩も鉄も断ち割る', 'Splits rock and iron with sheer strength', '以力量斬斷岩石與鋼鐵', '힘으로 바위도 쇠도 가른다'], { k: 'inst', L: 0, R: 14, O: 1, v: 'arcDown', sty: 'x_strash' }),
    t(['アバン流刀殺法', 'Avan-Style', '阿邦流刀殺法', '아방류 도살법'], ['海波斬', 'Wave Slash', '海波斬', '해파참'], ['速さで、炎も水も斬り裂く', 'Cuts through fire and water with sheer speed', '以速度斬開火焰與水', '속도로 불꽃도 물도 베어 가른다'], { k: 'inst', L: 1, R: 30, v: 'arcH', sty: 'x_strash' }),
    t(['アバン流刀殺法', 'Avan-Style', '阿邦流刀殺法', '아방류 도살법'], ['空裂斬', 'Air Slash', '空裂斬', '공렬참'], ['目に見えない邪悪を、光の闘気で斬る', 'Cuts unseen evil with an aura of light', '以光之鬥氣斬斷肉眼看不見的邪惡', '눈에 보이지 않는 사악함을 빛의 투기로 벤다'], { k: 'inst', L: 0, R: 45, v: 'thrust', sty: 'x_strash' }),
    t(['必殺技', 'Finishing Move', '必殺技', '필살기'], ['アバンストラッシュ', 'Avan Strash', '阿邦斯特拉修', '아방 스트랏슈'], ['三つの技を一つにした、必殺の一撃', 'The finishing blow that combines the three techniques into one', '將三招合而為一的必殺一擊', '세 가지 기술을 하나로 합친 필살의 일격'], { k: 'inst', L: 1, R: 50, O: 1, I: .6, v: 'thrust', sty: 'x_strash' }),
    t(['魔法剣', 'Magic Sword', '魔法劍', '마법검'], ['ライデインストラッシュ', 'Lightning Strash', '雷電斯特拉修', '라이데인 스트랏슈'], ['雷の呪文を剣に宿して放つ', 'Fires the Strash with a lightning spell held in the blade', '將雷電咒文寄宿於劍中放出', '번개의 주문을 검에 깃들여 쏜다'], { k: 'inst', L: 2, R: 50, O: 1, v: 'claws', sty: 'x_strash' }),
    t(['魔法剣', 'Magic Sword', '魔法劍', '마법검'], ['ギガストラッシュ', 'Giga Strash', '終極斯特拉修', '기가 스트랏슈'], ['最強の雷を宿した、勇者の最大の一撃', "The hero's greatest blow, carrying the mightiest lightning", '寄宿最強雷電的勇者最大一擊', '최강의 번개를 깃들인 용사의 최대 일격'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_strash' }),
  ], [], ['ダイ']),
  c('アスタ', '', ['Asta', '亞斯塔', '아스타'], 'bclover', 'black', 97, ['反魔法の剣', 'Anti-Magic Swords', '反魔法之劍', '반마법의 검'], [
    t(['断魔の剣', 'Demon-Slayer Sword', '斷魔之劍', '단마의 검'], ['ブル・スラスト', 'Bull Thrust', '蠻牛突刺', '불 스러스트'], ['剣に引っぱられるように突進して貫く', 'Charges as if pulled by the sword and pierces through', '如同被劍拉著一般突進貫穿', '검에 이끌리듯 돌진해 꿰뚫는다'], { k: 'inst', L: 0, R: 45, I: .6, v: 'thrust', sty: 'x_kuro' }),
    t(['断魔の剣', 'Demon-Slayer Sword', '斷魔之劍', '단마의 검'], ['ブラック・ハリケーン', 'Black Hurricane', '黑色颶風', '블랙 허리케인'], ['回転しながら、まわりの魔法ごと斬る', 'Spins and cuts down everything around, magic included', '一邊旋轉一邊連同周圍的魔法一起斬斷', '회전하며 주위의 마법째 벤다'], { k: 'aura', L: 1, R: 7, D: 3.5, v: 'spin', sty: 'x_kuro' }),
    t(['ブラックアスタ', 'Black Asta', '黑色亞斯塔', '블랙 아스타'], ['ブラック・メテオライト', 'Black Meteorite', '黑色隕石', '블랙 메테오라이트'], ['黒い流星になって突っこむ', 'Becomes a black meteor and crashes in', '化為黑色流星衝入', '검은 유성이 되어 돌진한다'], { k: 'inst', L: 1, R: 55, O: 1, I: .8, v: 'mega', sty: 'x_kuro' }),
    t(['宿魔の剣', 'Demon-Dweller Sword', '宿魔之劍', '숙마의 검'], ['ブラック・ディバイダー', 'Black Divider', '黑色分割者', '블랙 디바이더'], ['反魔法をのばした巨大な刃で両断する', 'Cleaves with a gigantic blade of extended anti-magic', '以延伸反魔法形成的巨大刀刃一刀兩斷', '반마법을 뻗은 거대한 칼날로 양단한다'], { k: 'inst', L: 9, R: 50, O: 1, v: 'storm', sty: 'x_kuro' }),
    t(['滅魔の剣', 'Demon-Destroyer Sword', '滅魔之劍', '멸마의 검'], ['因果崩し', 'Causality Break', '因果破除', '인과 깨기'], ['かけられた魔法の効果そのものを打ち消す', 'Cancels the very effects of magic cast upon it', '將被施加的魔法效果本身消除', '걸린 마법의 효과 자체를 지운다'], { k: 'aura', L: 2, R: 9, D: 5, G: 1, v: 'calm', sty: 'x_kuro' }),
  ], [], ['アスタ']),
  c('ヤミ・スケヒロ', 'やみすけひろ', ['Yami Sukehiro', '夜見介大', '야미 스케히로'], 'bclover', 'purple', 99, ['闇魔法', 'Dark Magic', '闇魔法', '암흑 마법'], [
    t(['闇魔法', 'Dark Magic', '闇魔法', '암흑 마법'], ['闇纏・無明斬り', 'Dark Cloaked Lightless Slash', '闇纏・無明斬', '어둠 두르기·무명참'], ['闇をまとった刀から、斬撃を飛ばす', 'Fires a slash from a sword cloaked in darkness', '從纏繞黑暗的刀放出斬擊', '어둠을 두른 칼에서 참격을 날린다'], { k: 'inst', L: 1, R: 36, v: 'arcH', sty: 'x_yami' }),
    t(['闇魔法', 'Dark Magic', '闇魔法', '암흑 마법'], ['闇纏・黒刃', 'Dark Cloaked Black Blade', '闇纏・黑刃', '어둠 두르기·흑인'], ['闇で刃をのばして斬る', 'Extends the blade with darkness and cuts', '以黑暗延伸刀刃斬擊', '어둠으로 칼날을 늘여 벤다'], { k: 'inst', L: 2, R: 20, O: 1, v: 'arcH', sty: 'x_yami' }),
    t(['闇魔法', 'Dark Magic', '闇魔法', '암흑 마법'], ['黒穴', 'Black Hole', '黑穴', '블랙홀'], ['相手の魔法を吸いこむ闇の穴を開く', 'Opens a hole of darkness that swallows enemy magic', '開啟吸入對手魔法的黑暗之穴', '상대의 마법을 빨아들이는 어둠의 구멍을 연다'], { k: 'aura', L: 2, R: 9, D: 4.5, G: 1, v: 'calm', sty: 'x_yami' }),
    t(['闇魔法', 'Dark Magic', '闇魔法', '암흑 마법'], ['闇纏・次元斬り', 'Dark Cloaked Dimension Slash', '闇纏・次元斬', '어둠 두르기·차원참'], ['空間ごと断ち切る', 'Cuts through space itself', '連同空間一起斬斷', '공간째 베어 끊는다'], { k: 'inst', L: 9, R: 55, O: 1, I: .8, v: 'mega', sty: 'x_yami' }),
    t(['闇魔法', 'Dark Magic', '闇魔法', '암흑 마법'], ['闇纏・次元斬り 彼岸', 'Dark Cloaked Dimension Slash: Equinox', '闇纏・次元斬 彼岸', '어둠 두르기·차원참 피안'], ['離れた相手を、空間ごと斬る', 'Cuts a distant foe along with the space around them', '將遠處的對手連同空間一起斬斷', '떨어진 상대를 공간째 벤다'], { k: 'inst', L: 1, R: 70, O: 1, v: 'thrust', sty: 'x_yami' }),
  ], ['夜見介大']),
  c('アルトリア・ペンドラゴン', 'あるとりあぺんどらごん', ['Artoria Pendragon', '阿爾托莉雅・潘德拉剛', '아르토리아 펜드래건'], 'fate', 'yellow', 100, ['聖剣エクスカリバー', 'Holy Sword Excalibur', '聖劍 Excalibur', '성검 엑스칼리버'], [
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['風王結界', 'Invisible Air', '風王結界', '풍왕결계'], ['風で刀身を見えなくする。間合いが読めない', 'Hides the blade with wind so its reach cannot be read', '以風使劍身隱形，讓人讀不出攻擊距離', '바람으로 칼날을 보이지 않게 한다. 간격을 읽을 수 없다'], { k: 'inst', L: 1, R: 16, v: 'arcH', sty: 'x_kaze' }),
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['風王鉄槌', 'Strike Air', '風王鐵槌', '풍왕철퇴'], ['まとっていた風を、ひと息に撃ち出す', 'Releases the cloaking wind in a single blast', '將纏繞的風一口氣擊出', '두르고 있던 바람을 단숨에 쏘아 낸다'], { k: 'inst', L: 1, R: 45, O: 1, v: 'thrust', sty: 'x_kaze' }),
    t(['スキル', 'Skill', '技能', '스킬'], ['魔力放出', 'Mana Burst', '魔力放出', '마력 방출'], ['魔力を噴き出して加速し、斬りこむ', 'Bursts mana to accelerate and cut in', '噴出魔力加速並斬入', '마력을 뿜어 가속하며 베어 들어간다'], { k: 'flow', L: 1, D: 4, v: 'ribbon', sty: 'x_kaze' }),
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['全て遠き理想郷', 'Avalon', '遙遠的理想鄉', '전부 머나먼 이상향'], ['あらゆる攻めを通さない、絶対の守り', 'An absolute defense that lets no attack through', '任何攻擊都無法穿透的絕對防禦', '어떤 공격도 통하지 않는 절대의 방어'], { k: 'aura', L: 1, R: 7, D: 5, G: 1, v: 'calm', sty: 'x_excalibur' }),
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['約束された勝利の剣', 'Excalibur', '誓約勝利之劍', '약속된 승리의 검'], ['星の光を束ねて放つ、黄金の斬撃', 'A golden slash that gathers the light of the stars and releases it', '匯聚星光放出的黃金斬擊', '별빛을 모아 쏘는 황금의 참격'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_excalibur' }),
  ], [], ['セイバー']),
  c('山本武', 'やまもとたけし', ['Takeshi Yamamoto', '山本武', '야마모토 타케시'], 'reborn', 'blue', 95, ['時雨蒼燕流', 'Shigure Soen Style', '時雨蒼燕流', '시구레 소엔류'], [
    t(['攻式', 'Offensive Form', '攻式', '공식'], ['一の型 車軸の雨', '1st Form: Shajiku no Ame', '一之型 車軸之雨', '제1형 차축의 비'], ['突進からの鋭いひと突き', 'A sharp thrust out of a charge', '由突進接上的銳利一刺', '돌진에서 이어지는 날카로운 찌르기'], { k: 'inst', L: 0, R: 40, v: 'thrust', sty: 'x_shigure' }),
    t(['守式', 'Defensive Form', '守式', '수식'], ['二の型 逆巻く雨', '2nd Form: Sakamaku Ame', '二之型 逆卷之雨', '제2형 역류하는 비'], ['水の壁を巻き上げて身を隠す', 'Whips up a wall of water to hide behind', '捲起水牆藏身其後', '물의 벽을 말아 올려 몸을 숨긴다'], { k: 'aura', L: 1, R: 7, D: 3.5, G: 1, v: 'vortex', sty: 'x_shigure' }),
    t(['攻式', 'Offensive Form', '攻式', '공식'], ['五の型 五月雨', '5th Form: Samidare', '五之型 五月雨', '제5형 오월비'], ['途中で刀を持ちかえ、守りの間を狂わせる', 'Switches hands mid-swing to throw off the timing of the guard', '中途換手持刀，打亂對手防守的時機', '도중에 칼을 바꿔 쥐어 방어의 타이밍을 흐트러뜨린다'], { k: 'multi', N: 5, R: 24, v: 'arcs', sty: 'x_shigure' }),
    t(['攻式', 'Offensive Form', '攻式', '공식'], ['八の型 篠突く雨', '8th Form: Shinotsuku Ame', '八之型 篠突之雨', '제8형 억수 같은 비'], ['父が友のためにつくった型。鋭い斬り上げ', 'A form his father created for a friend: a sharp rising slash', '父親為友人所創的型。銳利的上斬', '아버지가 친구를 위해 만든 형. 날카로운 올려 베기'], { k: 'inst', L: 1, R: 18, O: 1, v: 'arcUp', sty: 'x_shigure' }),
    t(['攻式', 'Offensive Form', '攻式', '공식'], ['九の型 うつし雨', '9th Form: Utsushi Ame', '九之型 映雨', '제9형 비치는 비'], ['水面に自分の姿を映して惑わせ、背後から斬る', 'Deceives with a reflection on the water and cuts from behind', '以水面映出自己的身影迷惑對手，從背後斬擊', '수면에 제 모습을 비춰 현혹하고 등 뒤에서 벤다'], { k: 'multi', N: 7, R: 30, v: 'arcs', sty: 'x_shigure' }),
    t(['特式', 'Special Form', '特式', '특식'], ['十の型 燕特攻', '10th Form: Scontro di Rondine', '十之型 燕特攻', '제10형 제비 특공'], ['雨の炎の燕とともに、水をまとって突っこむ', 'Charges cloaked in water alongside a swallow of Rain Flame', '與雨之炎的燕子一同身纏水流衝入', '비의 불꽃 제비와 함께 물을 두르고 돌진한다'], { k: 'inst', L: 2, R: 50, O: 1, I: .8, v: 'mega', sty: 'x_shigure' }),
  ]),
  // ---------- 4回目：銀魂・怪獣8号・FAIRY TAIL・幽☆遊☆白書・七つの大罪・ワールドトリガー ----------
  c('坂田銀時', 'さかたぎんとき', ['Gintoki Sakata', '坂田銀時', '사카타 긴토키'], 'gintama', 'white', 99, ['木刀「洞爺湖」', 'Wooden Sword "Lake Toya"', '木刀「洞爺湖」', '목검 「도야코」'], [
    t(['木刀', 'Wooden Sword', '木刀', '목검'], ['洞爺湖', 'Lake Toya', '洞爺湖', '도야코'], ['通販で買った木刀のひと振り。なぜか何でも叩き斬れる', 'One swing of a wooden sword bought by mail order. Somehow it cuts through anything', '郵購買來的木刀一揮。不知為何什麼都砍得斷', '통신 판매로 산 목검의 한 번 휘두르기. 어째선지 뭐든 베어 버린다'], { k: 'inst', L: 1, R: 18, O: 1, v: 'arcDown', sty: 'x_toyako' }),
    t(['異名', 'Alias', '異名', '이명'], ['白夜叉', 'Shiroyasha', '白夜叉', '백야차'], ['攘夷戦争で敵にも味方にも恐れられた、鬼神のような戦いぶり', 'Fights like the demon god feared by friend and foe alike in the Joi War', '在攘夷戰爭中令敵我雙方都畏懼、宛如鬼神的戰鬥', '양이 전쟁에서 적도 아군도 두려워한, 귀신 같은 싸움'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_toyako' }),
    t(['万事屋', 'Yorozuya', '萬事屋', '해결사'], ['俺の剣が届く範囲は俺の国だ', 'The Reach of My Sword Is My Country', '我的劍所及之處就是我的國家', '내 검이 닿는 범위는 내 나라다'], ['間合いに入ったものは、すべて守り、すべて斬る', 'Whatever enters his reach, he protects it all and cuts it all', '進入攻擊範圍的一切，全部守護，全部斬斷', '간격 안에 들어온 것은 모두 지키고 모두 벤다'], { k: 'aura', L: 2, R: 9, D: 5, O: 1, v: 'spin', sty: 'x_toyako' }),
  ]),
  c('土方十四郎', 'ひじかたとうしろう', ['Toshiro Hijikata', '土方十四郎', '히지카타 토시로'], 'gintama', 'black', 95, ['真選組 副長', 'Shinsengumi Vice-Commander', '真選組 副長', '진선조 부장'], [
    t(['真選組', 'Shinsengumi', '真選組', '진선조'], ['御用改め', 'Official Inspection', '御用改', '어용 검문'], ['「御用改めである！」と踏みこみ、次々に斬り伏せる', 'Storms in shouting "Official inspection!" and cuts them down one after another', '大喊「御用改！」闖入，接連斬倒', '"어용 검문이다!" 하고 뛰어들어 잇달아 베어 넘긴다'], { k: 'multi', N: 7, R: 28, v: 'arcs', sty: 'x_shinsen' }),
    t(['異名', 'Alias', '異名', '이명'], ['鬼の副長', 'Demon Vice-Commander', '鬼之副長', '귀신 부장'], ['隊の規律を破るものは斬る。近づくものも斬る', 'Cuts down anyone who breaks the rules. And anyone who comes near', '違反隊規者斬。靠近者也斬', '대의 규율을 어기는 자는 벤다. 다가오는 자도 벤다'], { k: 'aura', L: 1, R: 8, D: 4, v: 'spin', sty: 'x_shinsen' }),
    t(['妖刀', 'Cursed Sword', '妖刀', '요도'], ['村麻紗', 'Muramasha', '村麻紗', '무라마샤'], ['持ち主をヘタレたオタクにしてしまう妖刀。まわりの空気までゆるむ', 'A cursed sword that turns its owner into a spineless otaku. Even the air around goes slack', '會把持有者變成懦弱宅男的妖刀。連周圍的氣氛都鬆懈下來', '주인을 한심한 오타쿠로 만들어 버리는 요도. 주위의 공기까지 풀어진다'], { k: 'slow', D: 5, S: .4, v: 'eye', sty: 'x_shinsen' }),
  ]),
  c('沖田総悟', 'おきたそうご', ['Sogo Okita', '沖田總悟', '오키타 소고'], 'gintama', 'sakura', 97, ['真選組 一番隊隊長', 'Shinsengumi 1st Division Captain', '真選組 一番隊隊長', '진선조 1번대 대장'], [
    t(['真選組', 'Shinsengumi', '真選組', '진선조'], ['一番隊隊長', '1st Division Captain', '一番隊隊長', '1번대 대장'], ['真選組でいちばんの剣の腕。涼しい顔で斬りぬける', 'The best swordsman in the Shinsengumi. Cuts through with a cool face', '真選組首屈一指的劍術。若無其事地斬穿而過', '진선조 제일의 검 솜씨. 태연한 얼굴로 베고 지나간다'], { k: 'flow', L: 1, D: 4.5, v: 'ribbon', sty: 'x_okita' }),
    t(['愛刀', 'Favorite Sword', '愛刀', '애도'], ['菊一文字RX-78', 'Kikuichimonji RX-78', '菊一文字RX-78', '키쿠이치몬지 RX-78'], ['柄に音楽プレーヤーがついた名刀。曲に乗って連続で斬る', 'A famed sword with a music player in the hilt. Cuts in rhythm with the song', '刀柄附有音樂播放器的名刀。隨著樂曲連續斬擊', '손잡이에 음악 플레이어가 달린 명도. 곡에 맞춰 연속으로 벤다'], { k: 'multi', N: 8, R: 28, v: 'arcs', sty: 'x_okita' }),
    t(['真選組', 'Shinsengumi', '真選組', '진선조'], ['バズーカ', 'Bazooka', '火箭筒', '바주카'], ['土方さんをねらってぶっ放す。ついでに前のものが吹き飛ぶ', 'Fired at Hijikata. Whatever is in front gets blown away too', '瞄準土方先生發射。順便把前方的東西炸飛', '히지카타 씨를 노리고 쏜다. 덤으로 앞의 것들이 날아간다'], { k: 'inst', L: 2, R: 40, O: 1, v: 'storm', sty: 'x_bazooka' }),
  ]),
  c('桂小太郎', 'かつらこたろう', ['Kotaro Katsura', '桂小太郎', '카츠라 코타로'], 'gintama', 'bluepurple', 96, ['攘夷志士', 'Joi Patriot', '攘夷志士', '양이지사'], [
    t(['異名', 'Alias', '異名', '이명'], ['狂乱の貴公子', 'Noble of Fury', '狂亂的貴公子', '광란의 귀공자'], ['攘夷戦争でそう呼ばれた、激しい剣さばき', 'The fierce swordplay that earned him that name in the Joi War', '在攘夷戰爭中贏得此名的激烈劍技', '양이 전쟁에서 그렇게 불린 격렬한 칼솜씨'], { k: 'multi', N: 9, R: 30, v: 'arcs', sty: 'x_katsura' }),
    t(['異名', 'Alias', '異名', '이명'], ['逃げの小太郎', 'Runaway Kotaro', '逃跑小太郎', '도망자 코타로'], ['どんな包囲もすり抜けて逃げきる。誰にも捕まらない', 'Slips through any encirclement and gets away. No one can catch him', '任何包圍都能溜走逃脫。誰也抓不到', '어떤 포위도 빠져나가 달아난다. 누구에게도 잡히지 않는다'], { k: 'flow', L: 1, D: 6, v: 'ribbon', sty: 'x_katsura' }),
    t(['攘夷志士', 'Joi Patriot', '攘夷志士', '양이지사'], ['時限爆弾', 'Time Bomb', '定時炸彈', '시한폭탄'], ['ふところから出した爆弾を転がす', 'Rolls out a bomb pulled from his robes', '從懷中掏出炸彈滾出去', '품에서 꺼낸 폭탄을 굴린다'], { k: 'inst', L: 9, R: 30, O: 1, v: 'storm', sty: 'x_bazooka' }),
  ]),
  c('高杉晋助', 'たかすぎしんすけ', ['Shinsuke Takasugi', '高杉晉助', '타카스기 신스케'], 'gintama', 'purple', 98, ['鬼兵隊 総督', 'Kiheitai Commander', '鬼兵隊 總督', '귀병대 총독'], [
    t(['鬼兵隊', 'Kiheitai', '鬼兵隊', '귀병대'], ['総督の一太刀', "The Commander's Stroke", '總督的一刀', '총독의 한 칼'], ['煙管をくわえたまま、すれ違いざまに斬る', 'Cuts while passing, pipe still in his mouth', '叼著煙管，擦身而過時斬擊', '곰방대를 문 채 스쳐 지나가며 벤다'], { k: 'inst', L: 1, R: 30, I: .5, v: 'dash', a: 'iai', sty: 'x_kihei' }),
    t(['鬼兵隊', 'Kiheitai', '鬼兵隊', '귀병대'], ['黒い獣', 'The Black Beast', '黑色野獸', '검은 짐승'], ['「俺の中の黒い獣」が止まるまで、斬りつづける', 'Keeps cutting until "the black beast inside me" goes quiet', '直到「我心中的黑色野獸」平息為止，不斷斬擊', '"내 안의 검은 짐승"이 멎을 때까지 계속 벤다'], { k: 'flow', L: 1, D: 5, v: 'dragon', sty: 'x_kihei' }),
    t(['鬼兵隊', 'Kiheitai', '鬼兵隊', '귀병대'], ['ぶっ壊すだけだ', "I'll Just Destroy It", '只管破壞', '부술 뿐이다'], ['この腐った世界を、目の前のものからすべて壊す', 'Destroys this rotten world, starting with everything in front of him', '從眼前之物開始，破壞這個腐敗的世界', '이 썩은 세계를 눈앞의 것부터 모조리 부순다'], { k: 'inst', L: 9, R: 50, O: 1, I: .8, v: 'mega', sty: 'x_kihei' }),
  ]),
  // ---------- 怪獣8号 ----------
  c('保科宗四郎', 'ほしなそうしろう', ['Soshiro Hoshina', '保科宗四郎', '호시나 소시로'], 'kaiju8', 'purple', 96, ['保科流刀伐術', 'Hoshina-Style Sword Technique', '保科流刀伐術', '호시나류 도벌술'], [
    t(['保科流刀伐術', 'Hoshina Style', '保科流刀伐術', '호시나류 도벌술'], ['1式 空討ち', 'Form 1: Sora Uchi', '1式 空討', '1식 공중 베기'], ['刀を振って、斬撃を飛ばす', 'Swings the blade and sends the slash flying', '揮刀放出飛行的斬擊', '칼을 휘둘러 참격을 날린다'], { k: 'inst', L: 0, R: 40, v: 'thrust', sty: 'x_hoshina' }),
    t(['保科流刀伐術', 'Hoshina Style', '保科流刀伐術', '호시나류 도벌술'], ['2式 交差討ち', 'Form 2: Kosa Uchi', '2式 交叉討', '2식 교차 베기'], ['二刀を交差させて斬る', 'Cuts with both blades crossed', '雙刀交叉斬擊', '두 칼을 교차시켜 벤다'], { k: 'inst', L: 1, R: 16, v: 'claws', sty: 'x_hoshina' }),
    t(['保科流刀伐術', 'Hoshina Style', '保科流刀伐術', '호시나류 도벌술'], ['3式 返し討ち', 'Form 3: Kaeshi Uchi', '3式 返討', '3식 되받아 베기'], ['攻めを受け流して、そのまま斬り返す', 'Parries the attack and cuts back in the same motion', '卸開攻擊，順勢反斬', '공격을 흘리고 그대로 되받아 벤다'], { k: 'aura', L: 1, R: 7, D: 3, v: 'spin', sty: 'x_hoshina' }),
    t(['保科流刀伐術', 'Hoshina Style', '保科流刀伐術', '호시나류 도벌술'], ['4式 乱討ち', 'Form 4: Midare Uchi', '4式 亂討', '4식 난무 베기'], ['目で追えない速さの乱れ斬り', 'A flurry of cuts too fast for the eye to follow', '肉眼追不上的亂斬', '눈으로 좇을 수 없는 속도의 난도질'], { k: 'multi', N: 8, R: 26, v: 'arcs', sty: 'x_hoshina' }),
    t(['保科流刀伐術', 'Hoshina Style', '保科流刀伐術', '호시나류 도벌술'], ['5式 霞討ち', 'Form 5: Kasumi Uchi', '5式 霞討', '5식 안개 베기'], ['霞のようにすり抜けながら斬る', 'Cuts while slipping past like mist', '如霞霧般穿梭而過並斬擊', '안개처럼 빠져나가며 벤다'], { k: 'flow', L: 1, D: 4, v: 'ribbon', sty: 'x_hoshina' }),
    t(['保科流刀伐術', 'Hoshina Style', '保科流刀伐術', '호시나류 도벌술'], ['6式 八重討ち', 'Form 6: Yae Uchi', '6式 八重討', '6식 여덟 겹 베기'], ['八つの斬撃を重ねて叩きこむ', 'Drives in eight layered slashes', '疊加八道斬擊打入', '여덟 줄기 참격을 겹쳐 꽂는다'], { k: 'inst', L: 2, R: 24, O: 1, v: 'claws', sty: 'x_hoshina' }),
    t(['保科流刀伐術', 'Hoshina Style', '保科流刀伐術', '호시나류 도벌술'], ['7式 十二単', 'Form 7: Juni Hitoe', '7式 十二單', '7식 십이단'], ['十二の斬撃をひと息に重ねる', 'Layers twelve slashes in a single breath', '一口氣疊加十二道斬擊', '열두 줄기 참격을 단숨에 겹친다'], { k: 'multi', N: 12, R: 36, v: 'arcs', sty: 'x_hoshina' }),
  ]),
  // ---------- FAIRY TAIL ----------
  c('エルザ・スカーレット', 'えるざすかーれっと', ['Erza Scarlet', '艾爾莎・史卡雷特', '에르자 스칼렛'], 'fairytail', 'red', 98, ['換装「騎士」', 'Requip: The Knight', '換裝「騎士」', '환장 「더 나이트」'], [
    t(['天輪の鎧', "Heaven's Wheel Armor", '天輪之鎧', '천륜의 갑옷'], ['天輪・循環の剣', 'Circle Sword', '天輪・循環之劍', '천륜·순환의 검'], ['呼び出した剣を、まわりで輪のように回す', 'Summoned swords spin around her in a ring', '召喚出的劍在周圍如輪般旋轉', '불러낸 검을 주위에서 고리처럼 돌린다'], { k: 'aura', L: 2, R: 8, D: 4, v: 'spin', sty: 'x_erza' }),
    t(['天輪の鎧', "Heaven's Wheel Armor", '天輪之鎧', '천륜의 갑옷'], ['天輪・繚乱の剣', 'Blumenblatt', '天輪・繚亂之劍', '천륜·요란의 검'], ['たくさんの剣とともに、いっせいに斬りぬける', 'Cuts through all at once together with a host of swords', '與眾多的劍一同一齊斬穿', '수많은 검과 함께 일제히 베고 지나간다'], { k: 'multi', N: 10, R: 34, v: 'arcs', sty: 'x_erza' }),
    t(['天輪の鎧', "Heaven's Wheel Armor", '天輪之鎧', '천륜의 갑옷'], ['天輪・五芒星の剣', 'Pentagram Sword', '天輪・五芒星之劍', '천륜·오망성의 검'], ['五芒星の形に斬る', 'Cuts in the shape of a pentagram', '斬出五芒星的形狀', '오망성 모양으로 벤다'], { k: 'inst', L: 2, R: 20, v: 'claws', sty: 'x_erza' }),
    t(['黒羽の鎧', 'Black Wing Armor', '黑羽之鎧', '흑우의 갑옷'], ['月閃', 'Moon Flash', '月閃', '월섬'], ['すれ違いざまに、十字に斬る', 'A cross-shaped cut delivered while rushing past', '擦身而過時斬出十字', '스쳐 지나가며 십자로 벤다'], { k: 'inst', L: 1, R: 30, I: .5, v: 'dash', a: 'iai', sty: 'x_erza' }),
    t(['妖刀', 'Demon Blade', '妖刀', '요도'], ['紅桜', 'Benizakura', '紅櫻', '홍앵'], ['鎧を捨て、すべての魔力をひと振りにこめる', 'Casts off her armor and puts all her magic into a single swing', '捨棄鎧甲，將所有魔力注入一揮之中', '갑옷을 버리고 모든 마력을 한 번의 휘두름에 담는다'], { k: 'inst', L: 1, R: 55, O: 1, I: .8, v: 'mega', sty: 'x_erza' }),
  ]),
  // ---------- 幽☆遊☆白書 ----------
  c('飛影', 'ひえい', ['Hiei', '飛影', '히에이'], 'yuhaku', 'black', 97, ['邪王炎殺拳', 'Jao Ensatsuken', '邪王炎殺拳', '사왕염살권'], [
    t(['邪眼', 'Jagan Eye', '邪眼', '사안'], ['邪眼の呪縛', 'Jagan Bind', '邪眼的咒縛', '사안의 주박'], ['額の第三の目で、相手の動きをしばる', 'Binds the foe\'s movement with the third eye on his forehead', '以額頭上的第三隻眼束縛對手的行動', '이마의 제3의 눈으로 상대의 움직임을 묶는다'], { k: 'slow', D: 5, S: .3, v: 'eye', sty: 'x_jao' }),
    t(['邪王炎殺拳', 'Jao Ensatsuken', '邪王炎殺拳', '사왕염살권'], ['邪王炎殺剣', 'Sword of the Darkness Flame', '邪王炎殺劍', '사왕염살검'], ['魔界の炎を剣の形にして斬る', 'Shapes the flames of the Demon World into a sword and cuts', '將魔界之炎化為劍形斬擊', '마계의 불꽃을 검 모양으로 만들어 벤다'], { k: 'inst', L: 1, R: 24, O: 1, v: 'arcH', sty: 'x_jao' }),
    t(['邪王炎殺拳', 'Jao Ensatsuken', '邪王炎殺拳', '사왕염살권'], ['邪王炎殺煉獄焦', 'Fist of the Mortal Flame', '邪王炎殺煉獄焦', '사왕염살연옥초'], ['炎をまとった拳を、続けざまに打ちこむ', 'Drives in fists wreathed in flame one after another', '將纏繞火焰的拳頭接連打入', '불꽃을 두른 주먹을 잇달아 꽂는다'], { k: 'multi', N: 10, R: 28, v: 'arcs', sty: 'x_jao' }),
    t(['邪王炎殺拳', 'Jao Ensatsuken', '邪王炎殺拳', '사왕염살권'], ['邪王炎殺黒龍波', 'Dragon of the Darkness Flame', '邪王炎殺黑龍波', '사왕염살흑룡파'], ['魔界の黒い炎を、龍にして撃ち出す', 'Fires the black flames of the Demon World as a dragon', '將魔界的黑炎化為龍擊出', '마계의 검은 불꽃을 용으로 만들어 쏜다'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_jao' }),
  ]),
  // ---------- 七つの大罪 ----------
  c('メリオダス', '', ['Meliodas', '梅里奧達斯', '멜리오다스'], 'nanatsu', 'black', 100, ['憤怒の罪', "Dragon's Sin of Wrath", '憤怒之罪', '분노의 죄'], [
    t(['魔力', 'Power', '魔力', '마력'], ['全反撃', 'Full Counter', '全反擊', '풀 카운터'], ['自分に向けられた魔力を、倍以上にしてはね返す', 'Reflects magic aimed at him back at more than double the power', '將朝自己而來的魔力以倍數以上反彈回去', '자신에게 향한 마력을 배 이상으로 되받아친다'], { k: 'aura', L: 1, R: 8, D: 4, G: 1, v: 'calm', sty: 'x_counter' }),
    t(['魔神の力', 'Demon Power', '魔神之力', '마신의 힘'], ['付呪・獄炎', 'Enchant: Hellblaze', '附魔・獄炎', '인챈트 헬블레이즈'], ['消えない黒い炎を刃にまとわせて斬る', 'Cuts with unquenchable black flames wrapped around the blade', '讓不滅的黑炎纏繞刀刃斬擊', '꺼지지 않는 검은 불꽃을 칼날에 둘러 벤다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_jao' }),
    t(['魔神の力', 'Demon Power', '魔神之力', '마신의 힘'], ['神千斬り', 'Divine Thousand Slashes', '神千斬', '신천참'], ['闇をのばした巨大な刃のひと振り', 'One swing of a gigantic blade of extended darkness', '以延伸黑暗形成的巨大刀刃一揮', '어둠을 뻗은 거대한 칼날의 한 번 휘두르기'], { k: 'inst', L: 2, R: 42, O: 1, v: 'arcDown', sty: 'x_jao' }),
    t(['魔力', 'Power', '魔力', '마력'], ['リベンジ・カウンター', 'Revenge Counter', '復仇反擊', '리벤지 카운터'], ['受けつづけた魔力をためこみ、ひと息に解き放つ', 'Stores up all the magic he has taken and releases it in a single blast', '累積持續承受的魔力，一口氣釋放', '계속 받아 낸 마력을 모아 단숨에 풀어 놓는다'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_counter' }),
  ], [], ['メリオダス']),
  // ---------- ワールドトリガー ----------
  c('太刀川慶', 'たちかわけい', ['Kei Tachikawa', '太刀川慶', '타치카와 케이'], 'wtrigger', 'ainezu', 97, ['弧月（二刀）', 'Kogetsu (Dual Wield)', '弧月（雙刀）', '호월(쌍검)'], [
    t(['弧月', 'Kogetsu', '弧月', '호월'], ['旋空弧月', 'Senku Kogetsu', '旋空弧月', '선공호월'], ['一瞬だけ刃をのばし、遠くまでまとめて斬る', 'Extends the blade for an instant and cuts everything far ahead', '只在一瞬間伸長刀刃，將遠處一併斬斷', '한순간만 칼날을 늘여 멀리까지 한꺼번에 벤다'], { k: 'inst', L: 2, R: 32, v: 'arcH', sty: 'x_kogetsu' }),
    t(['弧月', 'Kogetsu', '弧月', '호월'], ['二刀の連撃', 'Dual-Blade Combo', '雙刀連擊', '쌍검 연격'], ['二本の弧月で、休みなく斬りこむ', 'Cuts in without pause with two Kogetsu', '以兩把弧月毫不停歇地斬入', '두 자루의 호월로 쉴 새 없이 베어 들어간다'], { k: 'multi', N: 8, R: 26, v: 'arcs', sty: 'x_kogetsu' }),
    t(['オプション', 'Option Trigger', '選配觸發器', '옵션 트리거'], ['グラスホッパー', 'Grasshopper', '蚱蜢', '그래스호퍼'], ['踏むと跳ねる板を出し、ひと息に飛びこんで斬る', 'Sets a springboard, leaps in at once, and cuts', '放出踩了會彈起的板子，一口氣躍入斬擊', '밟으면 튀는 판을 꺼내 단숨에 뛰어들어 벤다'], { k: 'inst', L: 0, R: 40, I: .6, v: 'dash', a: 'iai', sty: 'x_kogetsu' }),
    t(['オプション', 'Option Trigger', '選配觸發器', '옵션 트리거'], ['シールド', 'Shield', '護盾', '실드'], ['トリオンの盾を張って攻めを防ぐ', 'Raises a shield of Trion to block attacks', '展開觸力護盾擋下攻擊', '트리온의 방패를 펼쳐 공격을 막는다'], { k: 'aura', L: 1, R: 7, D: 4, G: 1, v: 'calm', sty: 'x_kogetsu' }),
  ]),
  // ---------- 5回目：ONE PIECE・進撃の巨人・呪術廻戦・落第騎士の英雄譚・Fate ----------
  c('ジュラキュール・ミホーク', 'じゅらきゅーるみほーく', ['Dracule Mihawk', '喬拉可爾・密佛格', '쥬라큘 미호크'], 'onepiece', 'black', 100, ['黒刀「夜」', 'Black Blade "Yoru"', '黑刀「夜」', '흑도 「요루」'], [
    t(['小刀', 'Small Knife', '小刀', '소도'], ['小刀のひと突き', 'A Thrust of the Small Knife', '小刀一刺', '소도의 한 번 찌르기'], ['首にさげた小さなナイフ。それだけで三刀流を受け流す', 'The tiny knife worn at his neck. That alone turns aside the Three Sword Style', '掛在頸上的小刀。光憑它就能擋開三刀流', '목에 건 작은 칼. 그것만으로 삼도류를 받아 흘린다'], { k: 'inst', L: 0, R: 12, v: 'thrust', sty: 'x_yoru' }),
    t(['黒刀「夜」', 'Black Blade "Yoru"', '黑刀「夜」', '흑도 「요루」'], ['飛ぶ斬撃', 'Flying Slash', '飛行的斬擊', '날아가는 참격'], ['軽いひと振りが、はるか先の船まで両断する', 'A light swing cleaves a ship far in the distance', '輕輕一揮，連遠方的船都一刀兩斷', '가벼운 한 번의 휘두름이 저 멀리 배까지 양단한다'], { k: 'inst', L: 1, R: 60, O: 1, v: 'arcH', sty: 'x_yoru' }),
    t(['黒刀「夜」', 'Black Blade "Yoru"', '黑刀「夜」', '흑도 「요루」'], ['世界最強の斬撃', "The World's Strongest Slash", '世界最強的斬擊', '세계 최강의 참격'], ['氷の山さえ両断する、世界一の大剣豪のひと太刀', 'One stroke from the world\'s greatest swordsman, cleaving even a mountain of ice', '連冰山都能一刀兩斷，世界第一大劍豪的一刀', '얼음 산마저 양단하는, 세계 제일 대검호의 한 칼'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_yoru' }),
  ], ['ジュラキュールミホーク']),
  c('シャンクス', '', ['Shanks', '傑克', '샹크스'], 'onepiece', 'red', 100, ['愛刀「グリフォン」', 'Saber "Gryphon"', '愛刀「獅鷲」', '애도 「그리폰」'], [
    t(['覇王色の覇気', "Conqueror's Haki", '霸王色霸氣', '패왕색 패기'], ['覇王色の覇気', "Conqueror's Haki", '霸王色霸氣', '패왕색 패기'], ['にらむだけで、まわりのものが動けなくなる', 'A single glare leaves everything around unable to move', '只要一瞪，周圍的一切就動彈不得', '노려보는 것만으로 주위의 것들이 움직이지 못하게 된다'], { k: 'slow', D: 7, S: .2, v: 'eye', sty: 'x_haoshoku' }),
    t(['見聞色の覇気', 'Observation Haki', '見聞色霸氣', '견문색 패기'], ['見聞殺し', 'Observation Killing', '見聞殺', '견문 죽이기'], ['相手の先読みを封じ、攻めをすべて空振りさせる', 'Shuts down the foe\'s foresight so every attack misses', '封住對手的預知，使所有攻擊落空', '상대의 앞을 읽는 힘을 봉해 공격을 모두 헛치게 한다'], { k: 'aura', L: 1, R: 8, D: 4, G: 1, v: 'calm', sty: 'x_haoshoku' }),
    t(['覇王色の覇気', "Conqueror's Haki", '霸王色霸氣', '패왕색 패기'], ['神避', 'Divine Departure', '神避', '신피'], ['覇王色をまとった斬撃。海賊王ロジャーと同じ技', "A slash cloaked in Conqueror's Haki, the same technique as the Pirate King Roger", '纏繞霸王色的斬擊。與海賊王羅傑相同的招式', '패왕색을 두른 참격. 해적왕 로저와 같은 기술'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_haoshoku' }),
  ], [], ['シャンクス']),
  c('藤虎', 'ふじとら', ['Fujitora', '藤虎', '후지토라'], 'onepiece', 'purple', 99, ['ズシズシの実と仕込み杖', 'Zushi Zushi no Mi & Cane Sword', '重重果實與手杖刀', '즈시즈시 열매와 지팡이 검'], [
    t(['重力刀', 'Gravity Blade', '重力刀', '중력도'], ['猛虎', 'Raging Tiger', '猛虎', '맹호'], ['重力を横向きにかけ、前のものをすべて吹き飛ばす', 'Turns gravity sideways and blows away everything ahead', '將重力轉為橫向，把前方的一切吹飛', '중력을 옆으로 걸어 앞의 모든 것을 날려 버린다'], { k: 'inst', L: 9, R: 45, O: 1, v: 'storm', sty: 'x_gravity' }),
    t(['重力', 'Gravity', '重力', '중력'], ['地獄旅', 'Journey to Hell', '地獄旅', '지옥 여행'], ['重力で、まわりを地面ごと押しつぶす', 'Crushes everything around, ground and all, with gravity', '以重力將周圍連同地面一起壓垮', '중력으로 주위를 땅째 짓눌러 버린다'], { k: 'aura', L: 2, R: 9, D: 4, O: 1, v: 'calm', sty: 'x_gravity' }),
    t(['重力', 'Gravity', '重力', '중력'], ['隕石', 'Meteorite', '隕石', '운석'], ['空の上から隕石を引きずり落とす', 'Drags meteorites down from above the sky', '從天外把隕石拖落下來', '하늘 위에서 운석을 끌어 내린다'], { k: 'rain', D: 5, R: 44, O: 1, v: 'rainfall', sty: 'x_gravity' }),
  ], ['Issho'], ['イッショウ']),
  c('錦えもん', 'きんえもん', ["Kin'emon", '錦衛門', '킨에몬'], 'onepiece', 'orange', 93, ['狐火流', 'Foxfire Style', '狐火流', '호화류'], [
    t(['狐火流', 'Foxfire Style', '狐火流', '호화류'], ['焔裂き', 'Flame Cleaver', '焰裂', '불꽃 가르기'], ['炎そのものを斬り裂いて、道を開く', 'Cuts fire itself apart to open a path', '將火焰本身斬開，開出道路', '불꽃 자체를 베어 갈라 길을 연다'], { k: 'aura', L: 1, R: 8, D: 4, G: 1, v: 'vortex', sty: 'x_kitsune' }),
    t(['狐火流', 'Foxfire Style', '狐火流', '호화류'], ['火柳一閃', 'Karyu Issen', '火柳一閃', '화류일섬'], ['炎をまとった刀で、爆発ごと斬る', 'Cuts through explosions with a blade wreathed in flame', '以纏繞火焰的刀連同爆炸一起斬斷', '불꽃을 두른 칼로 폭발째 벤다'], { k: 'inst', L: 1, R: 30, O: 1, I: .5, v: 'arcH', a: 'iai', sty: 'x_kitsune' }),
  ], ['錦衛門', 'Kinemon']),
  // ---------- 進撃の巨人 ----------
  c('リヴァイ・アッカーマン', 'りゔぁいあっかーまん', ['Levi Ackerman', '里維・阿卡曼', '리바이 아커만'], 'aot', 'green', 100, ['立体機動と超硬質ブレード', 'ODM Gear & Ultrahard Steel Blades', '立體機動與超硬質刀刃', '입체기동과 초경질 블레이드'], [
    t(['立体機動', 'ODM Gear', '立體機動', '입체기동'], ['うなじ削ぎ', 'Nape Slice', '削後頸', '목덜미 베기'], ['ワイヤーで飛びこみ、急所をそぎ落とす', 'Swings in on wires and slices off the vital spot', '以鋼索飛入，削下要害', '와이어로 뛰어들어 급소를 도려낸다'], { k: 'inst', L: 0, R: 40, I: .5, v: 'dash', a: 'iai', sty: 'x_odm' }),
    t(['立体機動', 'ODM Gear', '立體機動', '입체기동'], ['回転斬り', 'Spinning Slash', '迴旋斬', '회전 베기'], ['体ごと回転しながら、続けざまに斬りきざむ', 'Spins his whole body and cuts again and again', '整個身體旋轉著接連切割', '온몸으로 회전하며 잇달아 썰어 낸다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_odm' }),
    t(['雷槍', 'Thunder Spear', '雷槍', '뇌창'], ['雷槍', 'Thunder Spear', '雷槍', '뇌창'], ['刺さってから爆発する槍を撃ちこむ', 'Fires a spear that explodes after it sticks', '射出刺入後才爆炸的槍', '꽂힌 뒤에 폭발하는 창을 쏜다'], { k: 'inst', L: 1, R: 50, O: 1, v: 'storm', sty: 'x_bazooka' }),
    t(['アッカーマン', 'Ackerman', '阿卡曼', '아커만'], ['人類最強', "Humanity's Strongest", '人類最強', '인류 최강'], ['目で追えない速さで、まとめて斬り伏せる', 'Cuts them all down faster than the eye can follow', '以肉眼追不上的速度一併斬倒', '눈으로 좇을 수 없는 속도로 한꺼번에 베어 넘긴다'], { k: 'multi', N: 14, R: 40, v: 'arcs', sty: 'x_odm' }),
  ], ['リバイ・アッカーマン']),
  c('ミカサ・アッカーマン', 'みかさあっかーまん', ['Mikasa Ackerman', '米卡莎・阿卡曼', '미카사 아커만'], 'aot', 'red', 98, ['立体機動と超硬質ブレード', 'ODM Gear & Ultrahard Steel Blades', '立體機動與超硬質刀刃', '입체기동과 초경질 블레이드'], [
    t(['立体機動', 'ODM Gear', '立體機動', '입체기동'], ['うなじ削ぎ', 'Nape Slice', '削後頸', '목덜미 베기'], ['ワイヤーで飛びこみ、急所をそぎ落とす', 'Swings in on wires and slices off the vital spot', '以鋼索飛入，削下要害', '와이어로 뛰어들어 급소를 도려낸다'], { k: 'inst', L: 0, R: 36, I: .5, v: 'dash', a: 'iai', sty: 'x_odm' }),
    t(['アッカーマン', 'Ackerman', '阿卡曼', '아커만'], ['覚醒した力', 'Awakened Power', '覺醒的力量', '각성한 힘'], ['自分の体を完全に支配し、ためらいなく斬りすすむ', 'In complete control of her body, she cuts forward without hesitation', '完全支配自己的身體，毫不猶豫地一路斬擊', '자신의 몸을 완전히 지배해 망설임 없이 베어 나아간다'], { k: 'flow', L: 1, D: 4.5, v: 'ribbon', sty: 'x_odm' }),
    t(['雷槍', 'Thunder Spear', '雷槍', '뇌창'], ['雷槍', 'Thunder Spear', '雷槍', '뇌창'], ['刺さってから爆発する槍を撃ちこむ', 'Fires a spear that explodes after it sticks', '射出刺入後才爆炸的槍', '꽂힌 뒤에 폭발하는 창을 쏜다'], { k: 'inst', L: 1, R: 50, O: 1, v: 'storm', sty: 'x_bazooka' }),
  ]),
  // ---------- 呪術廻戦 ----------
  c('乙骨憂太', 'おっこつゆうた', ['Yuta Okkotsu', '乙骨憂太', '옷코츠 유타'], 'jjk', 'white', 100, ['刀と特級過呪怨霊「リカ」', 'Katana & Special Grade Cursed Spirit "Rika"', '刀與特級過咒怨靈「里香」', '칼과 특급 과주원령 「리카」'], [
    t(['呪力', 'Cursed Energy', '咒力', '주력'], ['呪力をこめた刀', 'Cursed-Energy Blade', '注入咒力的刀', '주력을 담은 칼'], ['底なしの呪力を刀に流して斬る', 'Cuts with bottomless cursed energy poured into the blade', '將深不見底的咒力注入刀中斬擊', '바닥없는 주력을 칼에 흘려 벤다'], { k: 'inst', L: 1, R: 20, O: 1, v: 'arcH', sty: 'x_rika' }),
    t(['術式', 'Cursed Technique', '術式', '술식'], ['模倣', 'Copy', '模仿', '모방'], ['ほかの術師の術式をまねる。呪言「動くな」', 'Copies another sorcerer\'s technique. Cursed Speech: "Don\'t move"', '模仿其他術師的術式。咒言「不准動」', '다른 술사의 술식을 흉내 낸다. 주언 "움직이지 마"'], { k: 'slow', D: 5, S: .3, v: 'eye', sty: 'x_rika' }),
    t(['リカ', 'Rika', '里香', '리카'], ['完全顕現', 'Full Manifestation', '完全顯現', '완전 현현'], ['リカを呼び出し、近づくものをともに叩きつぶす', 'Summons Rika, and together they crush whatever comes near', '喚出里香，一同擊潰靠近的一切', '리카를 불러내 다가오는 것을 함께 때려 부순다'], { k: 'aura', L: 2, R: 9, D: 5, O: 1, v: 'vortex', sty: 'x_rika' }),
    t(['領域展開', 'Domain Expansion', '領域展開', '영역전개'], ['真贋相愛', 'Authentic Mutual Love', '真贗相愛', '진안상애'], ['数えきれない刀がならぶ領域。刀ごとに、まねた術式が宿る', 'A domain lined with countless swords, each holding a copied technique', '排列著無數把刀的領域。每把刀都寄宿著模仿來的術式', '셀 수 없는 칼이 늘어선 영역. 칼마다 흉내 낸 술식이 깃든다'], { k: 'rain', D: 6, R: 44, O: 1, v: 'rainfall', sty: 'x_rika' }),
  ]),
  // ---------- 落第騎士の英雄譚 ----------
  c('黒鉄一輝', 'くろがねいっき', ['Ikki Kurogane', '黑鐵一輝', '쿠로가네 잇키'], 'rakudai', 'black', 96, ['固有霊装「陰鉄」', 'Device: Intetsu', '固有靈裝「陰鐵」', '고유영장 「인테츠」'], [
    t(['伐刀絶技', 'Noble Art', '伐刀絕技', '벌도절기'], ['一刀修羅', 'Itto Shura', '一刀修羅', '일도수라'], ['持てる力のすべてを、1分間で使いきる', 'Burns through every bit of his power in a single minute', '將所有力量在一分鐘內用盡', '가진 힘의 전부를 1분 동안 다 써 버린다'], { k: 'flow', L: 1, D: 6, v: 'dragon', sty: 'x_intetsu' }),
    t(['第一秘剣', 'First Secret Sword', '第一秘劍', '제1비검'], ['犀撃', 'Saigeki', '犀擊', '서격'], ['全身の力を切っ先に集めた、突進の突き', 'A charging thrust with the whole body\'s power gathered at the tip', '將全身之力集中於刀尖的突進突刺', '온몸의 힘을 칼끝에 모은 돌진 찌르기'], { k: 'inst', L: 0, R: 45, O: 1, v: 'thrust', sty: 'x_intetsu' }),
    t(['第三秘剣', 'Third Secret Sword', '第三秘劍', '제3비검'], ['円', 'Madoka', '圓', '마도카'], ['受けた力を回転で流し、そのまま相手に返す', 'Turns the force he receives through a spin and sends it straight back', '以旋轉卸開承受的力量，直接奉還對手', '받은 힘을 회전으로 흘려 그대로 상대에게 되돌린다'], { k: 'aura', L: 1, R: 7, D: 3.5, G: 1, v: 'spin', sty: 'x_intetsu' }),
    t(['第四秘剣', 'Fourth Secret Sword', '第四秘劍', '제4비검'], ['蜃気狼', 'Shinkiro', '蜃氣狼', '신기루'], ['緩急で残像を残し、相手の目をあざむく', 'Leaves afterimages with shifts of pace to deceive the eye', '以緩急留下殘像，欺騙對手的眼睛', '완급으로 잔상을 남겨 상대의 눈을 속인다'], { k: 'flow', L: 1, D: 4, v: 'ribbon', sty: 'x_intetsu' }),
    t(['第七秘剣', 'Seventh Secret Sword', '第七秘劍', '제7비검'], ['雷光', 'Raiko', '雷光', '뇌광'], ['目に映らない速さの一閃', 'A flash too fast for the eye to register', '肉眼無法捕捉的一閃', '눈에 비치지 않는 속도의 일섬'], { k: 'inst', L: 1, R: 36, I: .5, v: 'bolt', a: 'iai', sty: 'x_intetsu' }),
    t(['伐刀絶技', 'Noble Art', '伐刀絕技', '벌도절기'], ['一刀羅刹', 'Itto Rasetsu', '一刀羅剎', '일도나찰'], ['すべての力を、たった1秒に凝縮したひと太刀', 'One stroke with all his power condensed into a single second', '將所有力量凝縮於僅僅一秒的一刀', '모든 힘을 단 1초에 응축한 한 칼'], { k: 'inst', L: 9, R: 60, O: 1, I: 1, v: 'mega', sty: 'x_intetsu' }),
  ]),
  // ---------- Fate ----------
  c('衛宮士郎', 'えみやしろう', ['Shirou Emiya', '衛宮士郎', '에미야 시로'], 'fate', 'red', 93, ['投影魔術', 'Projection Magecraft', '投影魔術', '투영 마술'], [
    t(['投影', 'Projection', '投影', '투영'], ['干将・莫耶', 'Kanshou & Bakuya', '干將・莫邪', '간장·막야'], ['白と黒の夫婦剣で斬りむすぶ', 'Fights with the married pair of white and black swords', '以黑白夫婦劍交鋒', '희고 검은 부부검으로 맞붙는다'], { k: 'multi', N: 6, R: 22, v: 'arcs', sty: 'x_ubw' }),
    t(['投影', 'Projection', '投影', '투영'], ['鶴翼三連', 'Crane Wing Three Realm', '鶴翼三連', '학익삼련'], ['投げた双剣が引き合い、三方から同時に斬る', 'The thrown twin swords attract each other and cut from three sides at once', '擲出的雙劍互相吸引，從三方同時斬擊', '던진 쌍검이 서로 끌어당겨 세 방향에서 동시에 벤다'], { k: 'inst', L: 2, R: 26, v: 'claws', sty: 'x_ubw' }),
    t(['投影', 'Projection', '投影', '투영'], ['壊れた幻想', 'Broken Phantasm', '幻想崩壞', '브로큰 판타즘'], ['投影した剣そのものを爆発させる', 'Detonates the projected sword itself', '將投影出的劍本身引爆', '투영한 검 자체를 폭발시킨다'], { k: 'inst', L: 1, R: 36, O: 1, v: 'storm', sty: 'x_ubw' }),
    t(['投影', 'Projection', '投影', '투영'], ['熾天覆う七つの円環', 'Rho Aias', '熾天覆七重圓環', '로 아이아스'], ['花びらのような七枚の盾で身を守る', 'Shields himself with seven petal-like layers', '以七片花瓣般的盾保護自身', '꽃잎 같은 일곱 장의 방패로 몸을 지킨다'], { k: 'aura', L: 1, R: 7, D: 5, G: 1, v: 'calm', sty: 'x_ubw' }),
    t(['固有結界', 'Reality Marble', '固有結界', '고유결계'], ['無限の剣製', 'Unlimited Blade Works', '無限劍製', '무한의 검제'], ['剣が無限に突き立つ丘から、剣の雨を降らせる', 'Rains swords from a hill where blades stand without end', '從無數劍矗立的山丘降下劍雨', '검이 무한히 꽂힌 언덕에서 검의 비를 내린다'], { k: 'rain', D: 6, R: 44, O: 1, v: 'rainfall', sty: 'x_ubw' }),
  ]),
  c('佐々木小次郎', 'ささきこじろう', ['Kojiro Sasaki', '佐佐木小次郎', '사사키 코지로'], 'fate', 'purple', 98, ['物干し竿', 'Monohoshizao', '曬衣竿', '모노호시자오'], [
    t(['スキル', 'Skill', '技能', '스킬'], ['宗和の心得', 'Knowledge of the Sowa', '宗和的心得', '종화의 심득'], ['何度見せても見切られない太刀筋', 'Swordplay that cannot be read no matter how many times it is seen', '無論看過幾次都看不穿的刀路', '몇 번을 보여도 간파당하지 않는 칼솜씨'], { k: 'flow', L: 1, D: 4.5, v: 'ribbon', sty: 'x_tsubame' }),
    t(['スキル', 'Skill', '技能', '스킬'], ['透化', 'Vitrify', '透化', '투화'], ['明鏡止水の心で、あらゆる攻めを受け流す', 'With a mind like still water, turns aside every attack', '以明鏡止水之心，卸開一切攻擊', '명경지수의 마음으로 모든 공격을 받아 흘린다'], { k: 'aura', L: 1, R: 7, D: 4, G: 1, v: 'calm', sty: 'x_tsubame' }),
    t(['秘剣', 'Secret Sword', '秘劍', '비검'], ['燕返し', 'Swallow Reversal', '燕返', '제비 베기'], ['三つの太刀筋が、まったく同時に相手を囲む', 'Three sword paths surround the foe at exactly the same instant', '三道刀路完全同時包圍對手', '세 줄기 칼길이 완전히 동시에 상대를 에워싼다'], { k: 'inst', L: 2, R: 24, O: 1, I: .6, v: 'claws', sty: 'x_tsubame' }),
  ], ['佐佐木小次郎']),
  // ---------- 6回目：BLEACH・REBORN・ダイの大冒険・ドラゴンボール・Fate・NARUTO ----------
  c('卯ノ花烈', 'うのはなれつ', ['Retsu Unohana', '卯之花烈', '우노하나 레츠'], 'bleach', 'red', 99, ['斬魄刀「肉雫唼」', 'Zanpakuto: Minazuki', '斬魄刀「肉雫唼」', '참백도 「미나즈키」'], [
    t(SHIKAI, ['肉雫唼', 'Minazuki', '肉雫唼', '미나즈키'], ['巨大なエイが傷ついた者を呑みこみ、癒やす', 'A gigantic ray swallows the wounded and heals them', '巨大的魟魚吞下傷者並加以治癒', '거대한 가오리가 다친 자를 삼켜 치유한다'], { k: 'inst', L: 0, R: 10, H: 60, v: 'rain', sty: 'x_beni' }),
    t(['異名', 'Alias', '異名', '이명'], ['八千流', 'Yachiru', '八千流', '야치루'], ['あらゆる流派をきわめた、初代剣八の剣', 'The sword of the first Kenpachi, who mastered every school', '精通所有流派的初代劍八之劍', '모든 유파를 통달한 초대 켄파치의 검'], { k: 'multi', N: 12, R: 36, v: 'arcs', sty: 'x_beni' }),
    t(BANKAI, ['皆尽', 'Minazuki', '皆盡', '개진'], ['血のような液があたりを満たす。斬っては癒やし、また斬る', 'A blood-like liquid fills the area. She cuts, heals, and cuts again', '血一般的液體充滿四周。斬了又治，治了再斬', '피 같은 액체가 주위를 채운다. 베고는 치유하고 다시 벤다'], { k: 'flow', L: 1, D: 6, v: 'dragon', sty: 'x_beni' }),
  ], ['卯之花烈']),
  c('平子真子', 'ひらこしんじ', ['Shinji Hirako', '平子真子', '히라코 신지'], 'bleach', 'yellow', 95, ['斬魄刀「逆撫」', 'Zanpakuto: Sakanade', '斬魄刀「逆撫」', '참백도 「사카나데」'], [
    t(SHIKAI, ['逆撫', 'Sakanade', '逆撫', '사카나데'], ['上下・左右・前後を逆さまに感じさせて惑わす', 'Makes up and down, left and right, front and back all feel reversed', '使上下、左右、前後的感覺全部顛倒', '위아래·좌우·앞뒤를 거꾸로 느끼게 해 현혹한다'], { k: 'slow', D: 6, S: .3, v: 'eye', sty: 'x_sakanade' }),
    t(['虚化', 'Hollowfication', '虛化', '호로화'], ['虚閃', 'Cero', '虛閃', '세로'], ['仮面をつけ、破壊の光線を放つ', 'Dons the mask and fires a beam of destruction', '戴上面具，放出破壞的光線', '가면을 쓰고 파괴의 광선을 쏜다'], { k: 'inst', L: 1, R: 50, O: 1, v: 'thrust', sty: 'x_beni' }),
    t(BANKAI, ['逆様邪八方塞', 'Sakashima Yokoshima Happofusagari', '逆樣邪八方塞', '역양사팔방색'], ['敵と味方の見分けを逆さまにし、同士討ちさせる', 'Reverses the sense of friend and foe so they strike each other', '顛倒敵我的辨識，使其自相殘殺', '적과 아군의 구분을 뒤집어 서로 치게 한다'], { k: 'aura', L: 9, R: 10, D: 5, v: 'calm', sty: 'x_sakanade' }),
  ]),
  c('狛村左陣', 'こまむらさじん', ['Sajin Komamura', '狛村左陣', '코마무라 사진'], 'bleach', 'gray', 95, ['斬魄刀「天譴」', 'Zanpakuto: Tenken', '斬魄刀「天譴」', '참백도 「천견」'], [
    t(SHIKAI, ['天譴', 'Tenken', '天譴', '천견'], ['巨人の腕と刀が現れ、同じ動きで斬る', "A giant's arm and sword appear and cut with the same motion", '巨人的手臂與刀出現，以相同動作斬擊', '거인의 팔과 칼이 나타나 같은 움직임으로 벤다'], { k: 'inst', L: 2, R: 30, O: 1, v: 'fall', sty: 'x_tenken' }),
    t(BANKAI, ['黒縄天譴明王', 'Kokujo Tengen Myo-o', '黑繩天譴明王', '흑승천견명왕'], ['巨大な鎧武者が、同じ動きで叩き斬る', 'A colossal armored warrior strikes with the same motion', '巨大的鎧甲武者以相同動作劈斬', '거대한 갑옷 무사가 같은 움직임으로 내리친다'], { k: 'inst', L: 9, R: 50, O: 1, I: .8, v: 'mega', sty: 'x_tenken' }),
    t(BANKAI, ['断鎧縄衣', 'Dangai Joe', '斷鎧繩衣', '단개승의'], ['鎧を脱いだ明王は、いくら斬られても倒れない', 'With its armor shed, the Myo-o does not fall no matter how it is cut', '脫去鎧甲的明王，無論被斬多少次都不會倒下', '갑옷을 벗은 명왕은 아무리 베여도 쓰러지지 않는다'], { k: 'flow', L: 2, D: 6, O: 1, v: 'dragon', sty: 'x_tenken' }),
  ]),
  c('砕蜂', 'そいふぉん', ['Soi Fon', '碎蜂', '소이퐁'], 'bleach', 'yellow', 96, ['斬魄刀「雀蜂」', 'Zanpakuto: Suzumebachi', '斬魄刀「雀蜂」', '참백도 「스즈메바치」'], [
    t(SHIKAI, ['弐撃決殺', 'Death in Two Steps', '貳擊決殺', '이격결살'], ['同じ場所を二度刺せば、かならず倒れる', 'Stab the same spot twice and the foe is certain to fall', '同一處刺中兩次，對手必定倒下', '같은 곳을 두 번 찌르면 반드시 쓰러진다'], { k: 'multi', N: 8, R: 26, v: 'arcs', sty: 'x_suzume' }),
    t(['瞬閧', 'Shunko', '瞬閧', '순홍'], ['瞬閧', 'Shunko', '瞬閧', '순홍'], ['風の鬼道を手足にまとう、高等の白打', 'An advanced hand-to-hand art that wraps wind kido around the limbs', '將風之鬼道纏繞於手腳的高等白打', '바람의 귀도를 손발에 두르는 고등 백타'], { k: 'aura', L: 1, R: 7, D: 4, v: 'vortex', sty: 'x_suzume' }),
    t(BANKAI, ['雀蜂雷公鞭', 'Jakuho Raikoben', '雀蜂雷公鞭', '작봉뇌공편'], ['巨大な針を撃ち出し、大爆発させる', 'Fires a gigantic stinger that sets off a massive explosion', '射出巨大的針，引發大爆炸', '거대한 침을 쏘아 대폭발을 일으킨다'], { k: 'inst', L: 9, R: 60, O: 1, I: .8, v: 'mega', sty: 'x_bazooka' }),
  ], ['ソイフォン']),
  // ---------- REBORN! ----------
  c('スペルビ・スクアーロ', 'すぺるびすくあーろ', ['Superbi Squalo', '斯貝爾比・斯庫瓦羅', '스페르비 스쿠알로'], 'reborn', 'blue', 96, ['剣帝を倒した剣', 'The Sword That Beat the Sword Emperor', '擊敗劍帝之劍', '검제를 쓰러뜨린 검'], [
    t(['剣技', 'Sword Technique', '劍技', '검기'], ['鮫の牙', 'Zanna di Squalo', '鮫之牙', '상어의 이빨'], ['目にもとまらない連続の突き', 'A string of thrusts too fast to see', '快得看不見的連續突刺', '눈에도 보이지 않는 연속 찌르기'], { k: 'multi', N: 10, R: 28, v: 'arcs', sty: 'x_shigure' }),
    t(['剣技', 'Sword Technique', '劍技', '검기'], ['鮫衝撃', 'Attacco di Squalo', '鮫衝擊', '상어 충격'], ['強い衝撃を伝えて、相手の体をしびれさせる', 'Sends a heavy shock through the foe that numbs the body', '傳遞強烈衝擊，使對手身體麻痺', '강한 충격을 전해 상대의 몸을 마비시킨다'], { k: 'slow', D: 4, S: .4, v: 'eye', sty: 'x_shigure' }),
    t(['剣技', 'Sword Technique', '劍技', '검기'], ['鮫特攻', 'Scontro di Squalo', '鮫特攻', '상어 특공'], ['剣を振りまわしながら突進し、えぐり抜く', 'Charges while whirling the sword and gouges straight through', '一邊揮舞劍一邊突進，剜穿而過', '검을 휘두르며 돌진해 도려내며 지나간다'], { k: 'inst', L: 1, R: 50, O: 1, I: .8, v: 'mega', sty: 'x_shigure' }),
  ]),
  // ---------- ダイの大冒険 ----------
  c('ヒュンケル', '', ['Hyunckel', '修凱爾', '흉켈'], 'dai', 'white', 96, ['アバン流刀殺法と光の闘気', 'Avan Style & Aura of Light', '阿邦流刀殺法與光之鬥氣', '아방류 도살법과 빛의 투기'], [
    t(['必殺技', 'Finishing Move', '必殺技', '필살기'], ['ブラッディースクライド', 'Bloody Scryde', '血腥螺旋突', '블러디 스크라이드'], ['剣を高速で回転させながら突きだす', 'Thrusts while spinning the sword at high speed', '一邊高速旋轉劍一邊刺出', '검을 고속으로 회전시키며 찌른다'], { k: 'inst', L: 0, R: 50, O: 1, v: 'thrust', sty: 'x_hyun' }),
    t(['アバン流刀殺法', 'Avan-Style', '阿邦流刀殺法', '아방류 도살법'], ['海波斬', 'Wave Slash', '海波斬', '해파참'], ['速さで、炎も水も斬り裂く', 'Cuts through fire and water with sheer speed', '以速度斬開火焰與水', '속도로 불꽃도 물도 베어 가른다'], { k: 'inst', L: 1, R: 30, v: 'arcH', sty: 'x_hyun' }),
    t(['暗黒闘気', 'Dark Aura', '暗黑鬥氣', '암흑 투기'], ['闘魔傀儡掌', 'Toma Kugutsusho', '鬥魔傀儡掌', '투마괴뢰장'], ['暗黒闘気の糸で相手をあやつり、動きを封じる', 'Controls the foe with threads of dark aura and seals their movement', '以暗黑鬥氣之絲操縱對手，封住行動', '암흑 투기의 실로 상대를 조종해 움직임을 봉한다'], { k: 'slow', D: 5, S: .3, v: 'eye', sty: 'x_hyun' }),
    t(['光の闘気', 'Aura of Light', '光之鬥氣', '빛의 투기'], ['グランドクルス', 'Grand Cross', '十字聖擊', '그랜드 크루스'], ['十字にかまえた武器から、命がけの光の闘気を放つ', 'Releases a life-risking aura of light from a weapon held in a cross', '從架成十字的武器放出賭上性命的光之鬥氣', '십자로 겨눈 무기에서 목숨을 건 빛의 투기를 쏜다'], { k: 'inst', L: 9, R: 60, O: 1, I: 1, v: 'mega', sty: 'x_hyun' }),
  ], [], ['ヒュンケル']),
  // ---------- ドラゴンボール ----------
  c('トランクス', '', ['Trunks', '特南克斯', '트랭크스'], 'dragonball', 'purple', 97, ['剣', 'Sword', '劍', '검'], [
    t(['剣', 'Sword', '劍', '검'], ['シャイニングソードアタック', 'Shining Sword Attack', '閃光劍擊', '샤이닝 소드 어택'], ['一瞬で細かく斬りきざみ、気功波で消しとばす', 'Dices the foe in an instant, then wipes out the pieces with a ki blast', '一瞬間細細切碎，再以氣功波消滅', '한순간에 잘게 썰고 기공파로 날려 버린다'], { k: 'multi', N: 12, R: 30, v: 'arcs', sty: 'x_trunks' }),
    t(['気功波', 'Ki Blast', '氣功波', '기공파'], ['バーニングアタック', 'Burning Attack', '燃燒攻擊', '버닝 어택'], ['腕をすばやく動かしてから、気の弾を撃つ', 'Whips his arms through rapid motions, then fires a ball of ki', '快速擺動雙臂後射出氣彈', '팔을 빠르게 움직인 뒤 기의 탄을 쏜다'], { k: 'inst', L: 1, R: 45, O: 1, v: 'thrust', sty: 'x_trunks' }),
    t(['気功波', 'Ki Blast', '氣功波', '기공파'], ['ヒートドームアタック', 'Heat Dome Attack', '熱圓頂攻擊', '히트 돔 어택'], ['まわりを気のドームでおおい、真上へ撃ちあげる', 'Covers the area in a dome of ki and blasts it straight up', '以氣之圓頂覆蓋四周，朝正上方擊出', '주위를 기의 돔으로 덮고 바로 위로 쏘아 올린다'], { k: 'aura', L: 2, R: 9, D: 4, O: 1, v: 'vortex', sty: 'x_trunks' }),
    t(['剣', 'Sword', '劍', '검'], ['希望の剣', 'Sword of Hope', '希望之劍', '희망의 검'], ['みんなの気を集めた光の剣で両断する', "Cleaves with a blade of light gathered from everyone's ki", '以匯聚眾人之氣的光之劍一刀兩斷', '모두의 기를 모은 빛의 검으로 양단한다'], { k: 'inst', L: 9, R: 65, O: 1, I: 1, v: 'mega', sty: 'x_trunks' }),
  ], [], ['トランクス']),
  // ---------- Fate ----------
  c('ギルガメッシュ', '', ['Gilgamesh', '吉爾伽美什', '길가메시'], 'fate', 'yellow', 100, ['王の財宝', 'Gate of Babylon', '王之財寶', '왕의 재보'], [
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['王の財宝', 'Gate of Babylon', '王之財寶', '왕의 재보'], ['宝物庫の扉を開き、数えきれない宝具を撃ち出す', 'Opens the gates of his treasury and fires countless Noble Phantasms', '開啟寶庫之門，射出數不清的寶具', '보물고의 문을 열어 셀 수 없는 보구를 쏘아 낸다'], { k: 'rain', D: 5, R: 44, O: 1, v: 'rainfall', sty: 'x_excalibur' }),
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['天の鎖', 'Enkidu: Chains of Heaven', '天之鎖', '하늘의 사슬'], ['神に近いものほど固くしばる鎖', 'Chains that bind tighter the closer the target is to the gods', '越接近神的存在就綁得越緊的鎖鏈', '신에 가까운 자일수록 단단히 묶는 사슬'], { k: 'slow', D: 6, S: .25, v: 'eye', sty: 'x_excalibur' }),
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['天地乖離す開闢の星', 'Enuma Elish', '天地乖離開闢之星', '천지를 가르는 개벽의 별'], ['乖離剣エアで、世界ごと斬り裂く', 'Cuts apart the world itself with Ea, the Sword of Rupture', '以乖離劍Ea連同世界一起斬裂', '괴리검 에아로 세계째 베어 가른다'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_haoshoku' }),
  ], [], ['ギルガメッシュ']),
  c('沖田総司', 'おきたそうじ', ['Soji Okita', '沖田總司', '오키타 소지'], 'fate', 'sakura', 98, ['天然理心流', 'Tennen Rishin Style', '天然理心流', '천연이심류'], [
    t(['スキル', 'Skill', '技能', '스킬'], ['縮地', 'Shukuchi', '縮地', '축지'], ['一瞬で間合いをつめる歩法で、斬りぬける', 'Cuts through using footwork that closes the distance in an instant', '以一瞬間拉近距離的步法斬穿而過', '한순간에 거리를 좁히는 보법으로 베고 지나간다'], { k: 'flow', L: 1, D: 4, v: 'ribbon', sty: 'x_okita' }),
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['誠の旗', 'Flag of Sincerity', '誠之旗', '성(誠)의 깃발'], ['新選組の隊士たちを呼び出し、ともに斬りこむ', 'Summons the men of the Shinsengumi to charge in together', '喚出新選組的隊士們一同斬入', '신선조 대원들을 불러내 함께 베어 들어간다'], { k: 'multi', N: 12, R: 36, v: 'arcs', sty: 'x_okita' }),
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['無明三段突き', 'Mumyo Sandanzuki', '無明三段突', '무명삼단찌르기'], ['まったく同時に放たれる三つの突き。防ぐことはできない', 'Three thrusts delivered at exactly the same instant. They cannot be blocked', '完全同時刺出的三段突刺。無法防禦', '완전히 동시에 나가는 세 번의 찌르기. 막을 수 없다'], { k: 'inst', L: 0, R: 40, O: 1, I: .6, v: 'thrust', sty: 'x_okita' }),
  ]),
  // ---------- NARUTO ----------
  c('桃地再不斬', 'ももちざぶざ', ['Zabuza Momochi', '桃地再不斬', '모모치 자부자'], 'naruto', 'white', 92, ['首斬り包丁', "Executioner's Blade", '斬首大刀', '참수대도'], [
    t(['忍術', 'Ninjutsu', '忍術', '인술'], ['霧隠れの術', 'Hidden Mist Jutsu', '霧隱之術', '안개 은신술'], ['濃い霧で姿を隠し、相手の目をうばう', 'Hides in thick mist and robs the foe of sight', '以濃霧隱藏身影，奪去對手的視線', '짙은 안개로 모습을 숨겨 상대의 눈을 빼앗는다'], { k: 'slow', D: 6, S: .4, v: 'eye', sty: 'x_kiri' }),
    t(['暗殺術', 'Assassination Art', '暗殺術', '암살술'], ['無音殺人術', 'Silent Killing', '無聲殺人術', '무음 살인술'], ['音だけをたよりに、霧の中から斬る', 'Cuts from within the mist, guided by sound alone', '只憑聲音，從霧中斬擊', '소리만을 의지해 안개 속에서 벤다'], { k: 'multi', N: 8, R: 30, v: 'arcs', sty: 'x_kiri' }),
    t(['水遁', 'Water Release', '水遁', '수둔'], ['水龍弾の術', 'Water Dragon Jutsu', '水龍彈之術', '수룡탄술'], ['水の龍を放って押し流す', 'Unleashes a dragon of water that sweeps everything away', '放出水龍沖走一切', '물의 용을 풀어 휩쓸어 버린다'], { k: 'flow', L: 1, D: 4.5, v: 'dragon', sty: 'x_shigure' }),
    t(['首斬り包丁', "Executioner's Blade", '斬首大刀', '참수대도'], ['首斬り', 'Beheading', '斬首', '참수'], ['大刀のひと振りで両断する', 'Cleaves in two with one swing of the great blade', '大刀一揮，一刀兩斷', '대도의 한 번 휘두름으로 양단한다'], { k: 'inst', L: 2, R: 16, O: 1, v: 'arcH', sty: 'x_kiri' }),
  ]),
  // ---------- 7回目：アカメが斬る！・リゼロ・ダンまち・オーバーロード・D.Gray-man・とある・灼眼のシャナ・ONE PIECE ----------
  c('アカメ', '', ['Akame', '赤瞳', '아카메'], 'akame', 'red', 97, ['帝具「一斬必殺 村雨」', 'Teigu: One-Cut Killer Murasame', '帝具「一斬必殺 村雨」', '제구 「일참필살 무라사메」'], [
    t(['帝具', 'Teigu', '帝具', '제구'], ['一斬必殺', 'One-Cut Killer', '一斬必殺', '일참필살'], ['かすり傷ひとつで、呪いの毒が心臓を止める', 'A single scratch, and the cursed poison stops the heart', '只要一道擦傷，詛咒之毒就會讓心臟停止', '스친 상처 하나로 저주의 독이 심장을 멈춘다'], { k: 'multi', N: 10, R: 30, v: 'arcs', sty: 'x_murasame' }),
    t(['暗殺剣', "Assassin's Blade", '暗殺劍', '암살검'], ['葬る', 'Eliminate', '葬送', '처단'], ['「葬る」のひと言とともに、一瞬で斬りぬける', 'With the single word "eliminate," she cuts through in an instant', '隨著一句「葬送」，瞬間斬穿而過', '"처단한다"는 한마디와 함께 한순간에 베고 지나간다'], { k: 'inst', L: 1, R: 36, I: .5, v: 'dash', a: 'iai', sty: 'x_murasame' }),
    t(['奥の手', 'Trump Card', '王牌', '비장의 수'], ['役小角', 'Ennoozuno', '役小角', '엔노오즈노'], ['自分を村雨で斬り、呪いを力に変える', 'Cuts herself with Murasame and turns the curse into power', '以村雨斬傷自己，將詛咒化為力量', '자신을 무라사메로 베어 저주를 힘으로 바꾼다'], { k: 'flow', L: 2, D: 6, v: 'dragon', sty: 'x_murasame' }),
  ], [], ['アカメ']),
  c('ラインハルト・ヴァン・アストレア', 'らいんはるとゔぁんあすとれあ', ['Reinhard van Astrea', '萊因哈魯特・范・阿斯特雷亞', '라인하르트 반 아스트레아'], 'rezero', 'red', 100, ['剣聖', 'Sword Saint', '劍聖', '검성'], [
    t(['加護', 'Divine Protection', '加護', '가호'], ['剣聖の加護', 'Divine Protection of the Sword Saint', '劍聖的加護', '검성의 가호'], ['剣の才のすべてを受けつぐ加護', 'A blessing that passes down every talent for the sword', '繼承一切劍術才能的加護', '검의 재능 전부를 물려받는 가호'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_reid' }),
    t(['加護', 'Divine Protection', '加護', '가호'], ['矢避けの加護', 'Divine Protection of Arrow Evasion', '避箭的加護', '화살 피하기의 가호'], ['飛んでくるものは、すべて当たらない', 'Nothing that flies at him ever hits', '飛來的東西全都打不中', '날아오는 것은 모두 맞지 않는다'], { k: 'aura', L: 1, R: 7, D: 5, G: 1, v: 'calm', sty: 'x_reid' }),
    t(['龍剣', 'Dragon Sword', '龍劍', '용검'], ['龍剣レイド', 'Dragon Sword Reid', '龍劍雷德', '용검 레이드'], ['抜くべき相手の前でしか抜けない剣。ひと振りで空が割れる', 'A sword that can only be drawn before a worthy foe. One swing splits the sky', '只有在值得拔劍的對手面前才拔得出的劍。一揮便劈開天空', '뽑아야 할 상대 앞에서만 뽑히는 검. 한 번 휘두르면 하늘이 갈라진다'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_reid' }),
  ], ['ラインハルト・バン・アストレア']),
  c('アイズ・ヴァレンシュタイン', 'あいずゔぁれんしゅたいん', ['Ais Wallenstein', '艾絲・華倫斯坦', '아이즈 발렌슈타인'], 'danmachi', 'green', 98, ['剣姫', 'Sword Princess', '劍姬', '검희'], [
    t(['魔法', 'Magic', '魔法', '마법'], ['エアリエル', 'Airiel', '風靈疾走', '에어리얼'], ['「目覚めよ」のひと声で風をまとい、速さと斬れ味を上げる', 'At the word "Awaken," she cloaks herself in wind, raising her speed and edge', '一聲「覺醒吧」便身纏疾風，提升速度與鋒利度', '"깨어나라" 한마디에 바람을 둘러 속도와 예리함을 높인다'], { k: 'aura', L: 1, R: 8, D: 5, v: 'vortex', sty: 'x_ariel' }),
    t(['スキル', 'Skill', '技能', '스킬'], ['復讐姫', 'Avenger', '復仇姬', '어벤저'], ['怪物への憎しみが、力を大きく引き上げる', 'Her hatred of monsters greatly raises her power', '對怪物的憎恨大幅提升力量', '괴물에 대한 증오가 힘을 크게 끌어올린다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_ariel' }),
    t(['魔法', 'Magic', '魔法', '마법'], ['リル・ラファーガ', 'Lil Rafaga', '風靈突擊', '릴 라파가'], ['風をまとって飛びこむ、神風の突き', 'A thrust like a divine wind, diving in cloaked in gales', '身纏疾風衝入的神風突刺', '바람을 두르고 뛰어드는 신풍의 찌르기'], { k: 'inst', L: 1, R: 60, O: 1, I: .8, v: 'mega', sty: 'x_ariel' }),
  ], ['アイズ・バレンシュタイン']),
  c('ブレイン・アングラウス', 'ぶれいんあんぐらうす', ['Brain Unglaus', '布萊恩・安格勞斯', '브레인 앙글라우스'], 'overlord', 'blue', 90, ['武技', 'Martial Arts', '武技', '무투기'], [
    t(['武技', 'Martial Art', '武技', '무투기'], ['領域', 'Field', '領域', '영역'], ['半径3メートルの中のすべてを感じとる', 'Senses everything within a radius of three meters', '感知半徑三公尺內的一切', '반경 3미터 안의 모든 것을 감지한다'], { k: 'aura', L: 1, R: 7, D: 4, v: 'calm', sty: 'x_bugi' }),
    t(['武技', 'Martial Art', '武技', '무투기'], ['神閃', 'God Flash', '神閃', '신섬'], ['目に映らない速さの居合い', 'A quick-draw too fast for the eye to register', '肉眼無法捕捉的居合', '눈에 비치지 않는 속도의 발도술'], { k: 'inst', L: 0, R: 30, I: .5, v: 'bolt', a: 'iai', sty: 'x_bugi' }),
    t(['秘剣', 'Secret Sword', '秘劍', '비검'], ['虎落笛', 'Mogari-bue', '虎落笛', '호락적'], ['領域で急所をとらえ、神閃で斬る', 'Finds the vital spot with Field and cuts it with God Flash', '以領域捕捉要害，以神閃斬擊', '영역으로 급소를 포착하고 신섬으로 벤다'], { k: 'inst', L: 1, R: 20, O: 1, v: 'arcH', sty: 'x_bugi' }),
    t(['武技', 'Martial Art', '武技', '무투기'], ['四光連斬', 'Fourfold Slash of Light', '四光連斬', '사광연참'], ['一度に四つの斬撃を放つ', 'Fires four slashes at once', '一次放出四道斬擊', '한 번에 네 줄기 참격을 날린다'], { k: 'multi', N: 4, R: 24, v: 'arcs', sty: 'x_bugi' }),
    t(['秘剣', 'Secret Sword', '秘劍', '비검'], ['爪切り', 'Nail Clipper', '爪切', '손톱깎이'], ['吸血鬼の爪を斬るためだけに、みがきぬいたひと太刀', 'A stroke honed for one purpose: to cut a vampire\'s nail', '只為斬斷吸血鬼的指甲而千錘百鍊的一刀', '흡혈귀의 손톱을 베기 위해서만 갈고닦은 한 칼'], { k: 'inst', L: 0, R: 16, O: 1, v: 'arcDown', sty: 'x_bugi' }),
  ]),
  c('ガゼフ・ストロノーフ', 'がぜふすとろのーふ', ['Gazef Stronoff', '葛傑夫・史托羅諾夫', '가제프 스트로노프'], 'overlord', 'orange', 92, ['王国戦士長', 'Warrior Captain of the Kingdom', '王國戰士長', '왕국 전사장'], [
    t(['武技', 'Martial Art', '武技', '무투기'], ['六光連斬', 'Sixfold Slash of Light', '六光連斬', '육광연참'], ['一度に六つの斬撃を放つ', 'Fires six slashes at once', '一次放出六道斬擊', '한 번에 여섯 줄기 참격을 날린다'], { k: 'multi', N: 6, R: 26, v: 'arcs', sty: 'x_bugi' }),
    t(['武技', 'Martial Art', '武技', '무투기'], ['即応反射', 'Instant Counter', '即應反射', '즉응반사'], ['くずれた体勢を一瞬で立てなおし、すぐに斬り返す', 'Recovers his stance in an instant and cuts right back', '瞬間重整崩壞的姿勢，立刻反斬', '무너진 자세를 한순간에 바로잡고 곧바로 되받아 벤다'], { k: 'aura', L: 1, R: 7, D: 3.5, v: 'spin', sty: 'x_bugi' }),
    t(['武技', 'Martial Art', '武技', '무투기'], ['流水加速', 'Flow Acceleration', '流水加速', '유수가속'], ['神経を加速させ、流れるように動く', 'Accelerates his nerves and moves like flowing water', '加速神經，如流水般行動', '신경을 가속시켜 흐르듯 움직인다'], { k: 'flow', L: 1, D: 4, v: 'ribbon', sty: 'x_bugi' }),
    t(['王国の秘宝', 'Treasure of the Kingdom', '王國秘寶', '왕국의 비보'], ['剃刀の刃', 'Razor Edge', '剃刀之刃', '레이저 에지'], ['どんな鎧もバターのように斬る剣', 'A sword that cuts any armor like butter', '切任何鎧甲都像切奶油一樣的劍', '어떤 갑옷도 버터처럼 베는 검'], { k: 'inst', L: 1, R: 30, O: 1, v: 'arcH', sty: 'x_bugi' }),
  ]),
  c('神田ユウ', 'かんだゆう', ['Yu Kanda', '神田優', '칸다 유우'], 'dgray', 'blue', 95, ['対アクマ武器「六幻」', 'Anti-Akuma Weapon: Mugen', '對惡魔武器「六幻」', '대 악마 무기 「무겐」'], [
    t(['災厄招来', 'Calling Forth Misfortune', '災厄招來', '재액초래'], ['界蟲「一幻」', 'Netherworld Insects: First Illusion', '界蟲「一幻」', '계충 「일환」'], ['刀から冥界の蟲を放ち、食いちぎらせる', 'Releases insects of the netherworld from the blade to tear the foe apart', '從刀中放出冥界之蟲撕咬對手', '칼에서 명계의 벌레를 풀어 물어뜯게 한다'], { k: 'inst', L: 1, R: 45, v: 'thrust', sty: 'x_mugen' }),
    t(['六幻', 'Mugen', '六幻', '무겐'], ['二幻刀', 'Double Illusion Blades', '二幻刀', '이환도'], ['鞘を二本目の刀に変え、二刀で斬る', 'Turns the sheath into a second sword and cuts with both', '將刀鞘化為第二把刀，以雙刀斬擊', '칼집을 두 번째 칼로 바꿔 쌍검으로 벤다'], { k: 'multi', N: 8, R: 26, v: 'arcs', sty: 'x_mugen' }),
    t(['二幻', 'Second Illusion', '二幻', '이환'], ['八花螳蜋', 'Eight Flower Mantis', '八花螳螂', '팔화당랑'], ['花びらのような八つの斬撃を、同時に放つ', 'Fires eight petal-like slashes all at once', '同時放出如花瓣般的八道斬擊', '꽃잎 같은 여덟 줄기 참격을 동시에 날린다'], { k: 'inst', L: 2, R: 24, v: 'claws', sty: 'x_mugen' }),
    t(['禁忌', 'Forbidden', '禁忌', '금기'], ['三幻式', 'Third Illusion Style', '三幻式', '삼환식'], ['命を刀に食わせて、力を大きく引き上げる', 'Feeds his own life to the sword to raise his power greatly', '讓刀吞噬自己的生命，大幅提升力量', '목숨을 칼에 먹여 힘을 크게 끌어올린다'], { k: 'flow', L: 1, D: 5.5, v: 'dragon', sty: 'x_mugen' }),
  ], ['神田優']),
  c('神裂火織', 'かんざきかおり', ['Kaori Kanzaki', '神裂火織', '칸자키 카오리'], 'toaru', 'bluepurple', 98, ['七天七刀', 'Shichiten Shichito', '七天七刀', '칠천칠도'], [
    t(['鋼糸', 'Steel Wires', '鋼絲', '강사'], ['七閃', 'Seven Flashes', '七閃', '칠섬'], ['抜刀に見せかけて、七本の鋼の糸で斬りきざむ', 'Feigns a sword draw and slices with seven steel wires', '佯裝拔刀，實則以七條鋼絲切割', '발도처럼 보이게 하고 일곱 가닥의 강철 실로 썰어 낸다'], { k: 'inst', L: 2, R: 30, v: 'claws', sty: 'x_nanasen' }),
    t(['聖人', 'Saint', '聖人', '성인'], ['聖人の力', 'Power of a Saint', '聖人之力', '성인의 힘'], ['音より速く動き、まとめて斬り伏せる', 'Moves faster than sound and cuts them all down', '以超越音速行動，一併斬倒', '소리보다 빠르게 움직여 한꺼번에 베어 넘긴다'], { k: 'flow', L: 1, D: 4.5, v: 'ribbon', sty: 'x_nanasen' }),
    t(['抜刀術', 'Sword Draw', '拔刀術', '발도술'], ['唯閃', 'Single Flash', '唯閃', '유섬'], ['聖人の力を一瞬だけ解き放つ、本気の抜刀', 'A true sword draw that unleashes the power of a saint for one instant', '只在一瞬間解放聖人之力的全力拔刀', '성인의 힘을 한순간만 풀어 놓는 진심의 발도'], { k: 'inst', L: 1, R: 55, O: 1, I: .8, v: 'mega', a: 'iai', sty: 'x_nanasen' }),
  ]),
  c('シャナ', '', ['Shana', '夏娜', '샤나'], 'shana', 'red', 96, ['大太刀「贄殿遮那」', 'Odachi: Nietono no Shana', '大太刀「贄殿遮那」', '대태도 「니에토노노 샤나」'], [
    t(['自在法', 'Unrestricted Spell', '自在法', '자재법'], ['紅蓮の双翼', 'Crimson Wings', '紅蓮雙翼', '홍련의 쌍익'], ['炎の翼で飛びながら斬りすすむ', 'Flies on wings of flame, cutting as she goes', '以火焰之翼飛行並一路斬擊', '불꽃의 날개로 날며 베어 나아간다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_shana' }),
    t(['自在法', 'Unrestricted Spell', '自在法', '자재법'], ['飛焔', 'Hien', '飛焰', '비염'], ['刀から炎を撃ち出す', 'Fires flames from the sword', '從刀中射出火焰', '칼에서 불꽃을 쏘아 낸다'], { k: 'inst', L: 1, R: 45, v: 'thrust', sty: 'x_shana' }),
    t(['自在法', 'Unrestricted Spell', '自在法', '자재법'], ['真紅', 'Shinku', '真紅', '진홍'], ['炎でできた巨大な腕を呼び出し、叩きつぶす', 'Summons a gigantic arm of flame and crushes the foe', '喚出火焰形成的巨大手臂擊潰對手', '불꽃으로 된 거대한 팔을 불러내 때려 부순다'], { k: 'inst', L: 2, R: 26, O: 1, v: 'fall', sty: 'x_shana' }),
    t(['自在法', 'Unrestricted Spell', '自在法', '자재법'], ['審判', 'Shinpan', '審判', '심판'], ['炎の目で、まわりの力の流れを見切る', 'Reads the flow of power all around with an eye of flame', '以火焰之眼看穿周圍力量的流向', '불꽃의 눈으로 주위의 힘의 흐름을 간파한다'], { k: 'slow', D: 5, S: .35, v: 'eye', sty: 'x_shana' }),
    t(['自在法', 'Unrestricted Spell', '自在法', '자재법'], ['断罪', 'Danzai', '斷罪', '단죄'], ['刀から伸ばした巨大な炎の刃で両断する', 'Cleaves with a gigantic blade of flame extended from the sword', '以從刀延伸出的巨大火焰之刃一刀兩斷', '칼에서 뻗은 거대한 불꽃의 칼날로 양단한다'], { k: 'inst', L: 9, R: 60, O: 1, I: .8, v: 'mega', sty: 'x_shana' }),
  ], [], ['シャナ']),
  c('たしぎ', '', ['Tashigi', '達絲琪', '타시기'], 'onepiece', 'blue', 88, ['愛刀「時雨」', 'Shigure', '愛刀「時雨」', '애도 「시구레」'], [
    t(ITTO, ['斬時雨', 'Kiri Shigure', '斬時雨', '참시우'], ['するどく踏みこんで斬る', 'Steps in sharply and cuts', '銳利地踏進並斬擊', '날카롭게 파고들어 벤다'], { k: 'inst', L: 1, R: 20, v: 'arcH', sty: 'x_shigure' }),
    t(['六式', 'Rokushiki', '六式', '육식'], ['剃', 'Soru', '剃', '소루'], ['目に見えない速さで間合いをつめる', 'Closes the distance too fast to see', '以肉眼看不見的速度拉近距離', '눈에 보이지 않는 속도로 거리를 좁힌다'], { k: 'flow', L: 0, D: 3, v: 'ribbon', sty: 'x_shigure' }),
  ], [], ['たしぎ', 'タシギ']),
  c('キャベンディッシュ', '', ['Cavendish', '卡文迪許', '캐번디시'], 'onepiece', 'white', 94, ['名刀「デュランダル」', 'Durandal', '名刀「迪朗達爾」', '명도 「듀랜달」'], [
    t(['美剣', 'Beautiful Sword', '美劍', '미검'], ['斬・星屑王子', 'Zan Saint-Exupéry', '斬・星屑王子', '참·성설왕자'], ['白馬に乗ったまま、すれ違いざまに斬る', 'Cuts while riding past on his white horse', '騎著白馬擦身而過時斬擊', '백마를 탄 채 스쳐 지나가며 벤다'], { k: 'inst', L: 1, R: 36, I: .5, v: 'dash', a: 'iai', sty: 'x_hakuba' }),
    t(['美剣', 'Beautiful Sword', '美劍', '미검'], ['円卓', 'Round Table', '圓桌', '원탁'], ['まわりを円く斬りはらう', 'Sweeps a circle all around', '將四周斬成圓形', '주위를 둥글게 베어 낸다'], { k: 'aura', L: 2, R: 8, D: 3, v: 'spin', sty: 'x_hakuba' }),
    t(['ハクバ', 'Hakuba', '白馬', '하쿠바'], ['美剣 青い鳥', 'Blue Bird', '美劍 青鳥', '미검 파랑새'], ['眠ると現れる別の人格。誰にも見えない速さで斬りまわる', 'The other self that appears when he sleeps, cutting faster than anyone can see', '入睡後出現的另一個人格。以誰也看不見的速度四處斬擊', '잠들면 나타나는 다른 인격. 누구에게도 보이지 않는 속도로 베고 다닌다'], { k: 'flow', L: 2, D: 6, v: 'dragon', sty: 'x_hakuba' }),
  ], [], ['キャベンディッシュ']),
  // ---------- 8回目：BLEACH ----------
  c('檜佐木修兵', 'ひさぎしゅうへい', ['Shuhei Hisagi', '檜佐木修兵', '히사기 슈헤이'], 'bleach', 'green', 90, ['斬魄刀「風死」', 'Zanpakuto: Kazeshini', '斬魄刀「風死」', '참백도 「카제시니」'], [
    t(SHIKAI, ['風死', 'Kazeshini', '風死', '카제시니'], ['鎖でつないだ二枚の鎌を投げ、回して斬る', 'Throws and whirls two scythes linked by a chain', '擲出並旋轉以鎖鏈相連的兩把鐮刀斬擊', '사슬로 이은 두 자루의 낫을 던지고 돌려 벤다'], { k: 'multi', N: 8, R: 30, v: 'arcs', sty: 'x_santoryu' }),
    t(BANKAI, ['風死絞縄', 'Fushi no Kojo', '風死絞繩', '풍사교승'], ['鎖でたがいを結び、霊圧が尽きるまで死なせない', 'Binds both fighters with chains; neither can die until their spirit energy runs out', '以鎖鏈將彼此相連，靈壓耗盡之前都死不了', '사슬로 서로를 묶어 영압이 다할 때까지 죽지 못하게 한다'], { k: 'aura', L: 2, R: 9, D: 6, v: 'calm', sty: 'x_santoryu' }),
  ]),
  c('吉良イヅル', 'きらいづる', ['Izuru Kira', '吉良伊鶴', '키라 이즈루'], 'bleach', 'gray', 88, ['斬魄刀「侘助」', 'Zanpakuto: Wabisuke', '斬魄刀「侘助」', '참백도 「와비스케」'], [
    t(SHIKAI, ['侘助', 'Wabisuke', '侘助', '와비스케'], ['斬ったものの重さを倍にする。相手は重さに耐えかねて頭をたれる', 'Doubles the weight of whatever it cuts until the foe bows under the load', '使被斬之物的重量加倍，對手不堪重負而低頭', '벤 것의 무게를 배로 만든다. 상대는 무게를 못 이겨 고개를 숙인다'], { k: 'slow', D: 6, S: .3, v: 'eye', sty: 'x_tenken' }),
    t(['解号', 'Release Call', '解號', '해호'], ['面を上げろ', 'Raise Your Head', '抬起頭來', '고개를 들어라'], ['斬るたびに倍、また倍。七度斬れば動けない', 'Double with every cut, and double again. Seven cuts and the foe cannot move', '每斬一次就加倍，再加倍。斬七次便動彈不得', '벨 때마다 배, 또 배. 일곱 번 베면 움직이지 못한다'], { k: 'multi', N: 7, R: 26, v: 'arcs', sty: 'x_tenken' }),
  ], ['吉良伊鶴']),
  c('東仙要', 'とうせんかなめ', ['Kaname Tosen', '東仙要', '토센 카나메'], 'bleach', 'orange', 93, ['斬魄刀「清虫」', 'Zanpakuto: Suzumushi', '斬魄刀「清蟲」', '참백도 「스즈무시」'], [
    t(SHIKAI, ['清虫', 'Suzumushi', '清蟲', '스즈무시'], ['高い音をひびかせ、聞いたものを気絶させる', 'Rings out a high tone that knocks out all who hear it', '響起高亢的聲音，使聽見的人昏厥', '높은 소리를 울려 들은 자를 기절시킨다'], { k: 'slow', D: 5, S: .3, v: 'eye', sty: 'x_kaze' }),
    t(SHIKAI, ['清虫弐式・紅飛蝗', 'Suzumushi Nishiki: Benihiko', '清蟲貳式・紅飛蝗', '스즈무시 2식·홍비황'], ['数えきれない刃を雨のように降らせる', 'Rains down countless blades', '讓數不清的刀刃如雨般降下', '셀 수 없는 칼날을 비처럼 내린다'], { k: 'rain', D: 4, R: 36, v: 'rainfall', sty: 'x_kaze' }),
    t(BANKAI, ['清虫終式・閻魔蟋蟀', 'Suzumushi Tsuishiki: Enma Korogi', '清蟲終式・閻魔蟋蟀', '스즈무시 종식·염마실솔'], ['黒い球の中で、目も耳も鼻も霊圧を感じる力もうばう', 'Inside a black dome, takes away sight, hearing, smell, and the sense of spirit energy', '在黑色球體中奪去視覺、聽覺、嗅覺與感知靈壓的能力', '검은 구 안에서 눈도 귀도 코도 영압을 느끼는 힘도 빼앗는다'], { k: 'aura', L: 9, R: 10, D: 6, v: 'calm', sty: 'x_hitsugi' }),
  ]),
  c('浮竹十四郎', 'うきたけじゅうしろう', ['Jushiro Ukitake', '浮竹十四郎', '우키타케 쥬시로'], 'bleach', 'white', 97, ['斬魄刀「双魚理」', 'Zanpakuto: Sogyo no Kotowari', '斬魄刀「雙魚理」', '참백도 「소교노코토와리」'], [
    t(SHIKAI, ['双魚理', 'Sogyo no Kotowari', '雙魚理', '소교노코토와리'], ['片方の刀で相手の技を吸いこみ、もう片方から撃ち返す', "Absorbs the foe's attack with one blade and fires it back from the other", '以一把刀吸收對手的招式，再從另一把射回去', '한쪽 칼로 상대의 기술을 빨아들여 다른 쪽에서 되쏜다'], { k: 'aura', L: 1, R: 8, D: 5, G: 1, v: 'calm', sty: 'x_counter' }),
    t(ZANJUTSU, ['二刀の連撃', 'Dual-Blade Combo', '雙刀連擊', '쌍검 연격'], ['ひもでつないだ二刀で、とぎれなく斬りこむ', 'Cuts in without pause with two blades joined by a cord', '以繩索相連的雙刀不間斷地斬入', '끈으로 이은 두 칼로 끊임없이 베어 들어간다'], { k: 'multi', N: 8, R: 26, v: 'arcs', sty: 'x_counter' }),
  ]),
  c('黒崎一心', 'くろさきいっしん', ['Isshin Kurosaki', '黑崎一心', '쿠로사키 잇신'], 'bleach', 'red', 98, ['斬魄刀「剡月」', 'Zanpakuto: Engetsu', '斬魄刀「剡月」', '참백도 「염월」'], [
    t(SHIKAI, ['剡月', 'Engetsu', '剡月', '염월'], ['血をふきかけた刀身に炎をともす', 'Lights the blade aflame with a spray of his own blood', '在噴上鮮血的刀身點燃火焰', '피를 뿜은 칼날에 불꽃을 붙인다'], { k: 'aura', L: 1, R: 8, D: 4, v: 'vortex', sty: 'x_ryujin' }),
    t(SHIKAI, ['月牙天衝', 'Getsuga Tensho', '月牙天衝', '월아천충'], ['息子に受けつがれた、三日月の斬撃', 'The crescent slash that was passed on to his son', '傳承給兒子的新月斬擊', '아들에게 이어진 초승달의 참격'], { k: 'inst', L: 1, R: 44, O: 1, v: 'arcH', sty: 'x_beni' }),
    t(['体術', 'Hand-to-Hand', '體術', '체술'], ['鬼デコ', 'Demon Flick', '鬼彈額', '귀신 딱밤'], ['デコピンひとつで相手を吹き飛ばす', 'Sends the foe flying with a single flick to the forehead', '只用一記彈額頭就把對手彈飛', '딱밤 하나로 상대를 날려 버린다'], { k: 'inst', L: 0, R: 20, O: 1, v: 'thrust', sty: 'x_beni' }),
  ]),
  c('斑目一角', 'まだらめいっかく', ['Ikkaku Madarame', '斑目一角', '마다라메 잇카쿠'], 'bleach', 'red', 92, ['斬魄刀「鬼灯丸」', 'Zanpakuto: Hozukimaru', '斬魄刀「鬼燈丸」', '참백도 「호오즈키마루」'], [
    t(SHIKAI, ['鬼灯丸', 'Hozukimaru', '鬼燈丸', '호오즈키마루'], ['「延びろ」で槍に、「裂けろ」で三節棍に変わる', '"Extend" makes it a spear; "split" makes it a three-section staff', '「延伸吧」變成槍，「裂開吧」變成三節棍', '"늘어나라"에 창으로, "갈라져라"에 삼절곤으로 변한다'], { k: 'multi', N: 6, R: 28, v: 'arcs', sty: 'x_zabi' }),
    t(BANKAI, ['龍紋鬼灯丸', 'Ryumon Hozukimaru', '龍紋鬼燈丸', '용문 호오즈키마루'], ['斬り合うほど龍の紋が赤くそまり、力が上がる', 'The more it fights, the redder the dragon crest glows and the stronger it gets', '越是交鋒，龍紋越是染紅，力量隨之上升', '싸울수록 용의 문양이 붉게 물들며 힘이 오른다'], { k: 'flow', L: 1, D: 6, grow: 1, v: 'dragon', sty: 'x_zabi' }),
  ]),
  c('綾瀬川弓親', 'あやせがわゆみちか', ['Yumichika Ayasegawa', '綾瀨川弓親', '아야세가와 유미치카'], 'bleach', 'fuji', 88, ['斬魄刀「藤孔雀」', 'Zanpakuto: Fuji Kujaku', '斬魄刀「藤孔雀」', '참백도 「후지쿠자쿠」'], [
    t(SHIKAI, ['藤孔雀', 'Fuji Kujaku', '藤孔雀', '후지쿠자쿠'], ['四枚に分かれた刃で斬る', 'Cuts with a blade split into four', '以分成四片的刀刃斬擊', '네 갈래로 나뉜 칼날로 벤다'], { k: 'inst', L: 1, R: 16, v: 'claws', sty: 'x_tsubame' }),
    t(SHIKAI, ['瑠璃色孔雀', "Ruri'iro Kujaku", '瑠璃色孔雀', '루리이로쿠자쿠'], ['光のつるが相手の霊力を吸いあげ、花を咲かせる', "Vines of light drain the foe's spirit energy and burst into bloom", '光之藤蔓吸取對手的靈力並綻放花朵', '빛의 덩굴이 상대의 영력을 빨아올려 꽃을 피운다'], { k: 'inst', L: 2, R: 24, H: 50, v: 'rain', sty: 'x_tsubame' }),
  ]),
  c('松本乱菊', 'まつもとらんぎく', ['Rangiku Matsumoto', '松本亂菊', '마츠모토 란기쿠'], 'bleach', 'orange', 90, ['斬魄刀「灰猫」', 'Zanpakuto: Haineko', '斬魄刀「灰貓」', '참백도 「하이네코」'], [
    t(SHIKAI, ['灰猫', 'Haineko', '灰貓', '하이네코'], ['刀身を灰に変える。灰がふれたところが斬れる', 'Turns the blade to ash, and wherever the ash touches is cut', '將刀身化為灰。灰碰到的地方就會被斬', '칼날을 재로 바꾼다. 재가 닿은 곳이 베인다'], { k: 'aura', L: 2, R: 9, D: 5, v: 'vortex', sty: 'x_kiri' }),
    t(SHIKAI, ['猫輪舞', 'Neko Rinbu', '貓輪舞', '고양이 윤무'], ['灰の竜巻で相手を包み、斬りきざむ', 'Wraps the foe in a tornado of ash and cuts them to pieces', '以灰之龍捲包住對手並切碎', '재의 회오리로 상대를 감싸 썰어 낸다'], { k: 'rain', D: 4, R: 30, v: 'rainfall', sty: 'x_kiri' }),
  ]),
  c('雛森桃', 'ひなもりもも', ['Momo Hinamori', '雛森桃', '히나모리 모모'], 'bleach', 'pink', 85, ['斬魄刀「飛梅」', 'Zanpakuto: Tobiume', '斬魄刀「飛梅」', '참백도 「토비우메」'], [
    t(SHIKAI, ['飛梅', 'Tobiume', '飛梅', '토비우메'], ['刀身から火の玉を撃ち出す', 'Fires balls of flame from the blade', '從刀身射出火球', '칼날에서 불덩이를 쏘아 낸다'], { k: 'inst', L: 1, R: 36, O: 1, v: 'storm', sty: 'x_homura' }),
    t(['鬼道', 'Kido', '鬼道', '귀도'], ['鬼道の網', 'Kido Net', '鬼道之網', '귀도의 그물'], ['見えない鬼道の網を張り、まとめて爆発させる', 'Lays an unseen net of kido and detonates it all at once', '張開看不見的鬼道之網，一併引爆', '보이지 않는 귀도의 그물을 쳐서 한꺼번에 폭발시킨다'], { k: 'inst', L: 9, R: 30, O: 1, v: 'storm', sty: 'x_homura' }),
  ]),
  c('涅マユリ', 'くろつちまゆり', ['Mayuri Kurotsuchi', '涅繭利', '쿠로츠치 마유리'], 'bleach', 'purple', 97, ['斬魄刀「疋殺地蔵」', 'Zanpakuto: Ashisogi Jizo', '斬魄刀「疋殺地藏」', '참백도 「아시소기 지조」'], [
    t(SHIKAI, ['疋殺地蔵', 'Ashisogi Jizo', '疋殺地藏', '아시소기 지조'], ['斬られた手足だけが、しびれて動かなくなる', 'Only the limbs it cuts go numb and stop moving', '只有被斬到的手腳會麻痺而無法動彈', '베인 손발만 마비되어 움직이지 않게 된다'], { k: 'slow', D: 6, S: .3, v: 'eye', sty: 'x_kyoka' }),
    t(BANKAI, ['金色疋殺地蔵', 'Konjiki Ashisogi Jizo', '金色疋殺地藏', '금색 아시소기 지조'], ['巨大な赤子の像が毒をまき、刃をはやして突進する', 'A giant infant-like figure spreads poison and charges with blades bared', '巨大的嬰兒像散播毒氣，並長出刀刃突進', '거대한 아기의 상이 독을 뿌리고 칼날을 돋워 돌진한다'], { k: 'flow', L: 2, D: 6, O: 1, v: 'dragon', sty: 'x_kyoka' }),
    t(BANKAI, ['金色疋殺地蔵・魔胎伏印症体', 'Konjiki Ashisogi Jizo: Matai Fukuin Shotai', '金色疋殺地藏・魔胎伏印症體', '금색 아시소기 지조·마태복인증체'], ['戦う相手に合わせて、その場で作りなおした卍解', 'A bankai rebuilt on the spot to suit the foe in front of it', '配合交戰對手當場重新改造的卍解', '싸우는 상대에 맞춰 그 자리에서 다시 만든 만해'], { k: 'inst', L: 9, R: 55, O: 1, I: .8, v: 'mega', sty: 'x_kyoka' }),
  ]),
  // ---------- 9回目：BLEACH（破面・完現術者）・ONE PIECE ----------
  c('ティア・ハリベル', 'てぃあはりべる', ['Tier Harribel', '蒂雅・赫麗貝爾', '티아 할리벨'], 'bleach', 'blue', 97, ['帰刃「皇鮫后」', 'Resurrección: Tiburón', '歸刃「皇鮫后」', '레스렉시온 「티부론」'], [
    t(['帰刃', 'Resurrección', '歸刃', '레스렉시온'], ['皇鮫后', 'Tiburón', '皇鮫后', '티부론'], ['水をあやつる鮫の女帝の姿になり、近づくものを斬る', 'Takes the form of a shark empress who commands water and cuts whatever comes near', '化為操縱水的鯊魚女帝之姿，斬擊靠近的一切', '물을 다루는 상어 여제의 모습이 되어 다가오는 것을 벤다'], { k: 'aura', L: 2, R: 9, D: 5, v: 'vortex', sty: 'x_shigure' }),
    t(['帰刃', 'Resurrección', '歸刃', '레스렉시온'], ['戦雫', 'La Gota', '戰雫', '라 고타'], ['剣先から水の弾を撃つ', 'Fires a bullet of water from the tip of the blade', '從劍尖射出水彈', '칼끝에서 물의 탄을 쏜다'], { k: 'inst', L: 0, R: 45, v: 'thrust', sty: 'x_shigure' }),
    t(['帰刃', 'Resurrección', '歸刃', '레스렉시온'], ['断瀑', 'Cascada', '斷瀑', '카스카다'], ['巨大な滝を落として、すべて押し流す', 'Brings down a gigantic waterfall that sweeps everything away', '降下巨大瀑布沖走一切', '거대한 폭포를 떨어뜨려 모두 휩쓸어 버린다'], { k: 'inst', L: 9, R: 50, O: 1, v: 'storm', sty: 'x_shigure' }),
  ]),
  c('グリムジョー・ジャガージャック', 'ぐりむじょーじゃがーじゃっく', ['Grimmjow Jaegerjaquez', '葛力姆喬・賈卡傑克', '그림죠 재거잭'], 'bleach', 'blue', 98, ['帰刃「豹王」', 'Resurrección: Pantera', '歸刃「豹王」', '레스렉시온 「판테라」'], [
    t(['帰刃', 'Resurrección', '歸刃', '레스렉시온'], ['豹王', 'Pantera', '豹王', '판테라'], ['豹のような姿になり、すばやく飛びかかって爪で裂く', 'Takes a panther-like form, pouncing fast and rending with claws', '化為豹一般的姿態，迅速撲上以爪撕裂', '표범 같은 모습이 되어 재빨리 덮쳐 발톱으로 찢는다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_getsuga' }),
    t(['帰刃', 'Resurrección', '歸刃', '레스렉시온'], ['豹鉤', 'Garra de la Pantera', '豹鉤', '가라 데 라 판테라'], ['ひじから、爆発する針を撃ち出す', 'Fires explosive darts from his elbows', '從手肘射出會爆炸的針', '팔꿈치에서 폭발하는 침을 쏜다'], { k: 'inst', L: 1, R: 40, O: 1, v: 'thrust', sty: 'x_getsuga' }),
    t(['帰刃', 'Resurrección', '歸刃', '레스렉시온'], ['豹王の爪', 'Desgarrón', '豹王之爪', '데스가론'], ['霊圧でできた巨大な爪で、まとめて引き裂く', 'Tears everything apart with gigantic claws of spirit energy', '以靈壓形成的巨大爪子一併撕裂', '영압으로 된 거대한 발톱으로 한꺼번에 찢는다'], { k: 'inst', L: 9, R: 55, O: 1, I: .8, v: 'claws', sty: 'x_getsuga' }),
  ]),
  c('ウルキオラ・シファー', 'うるきおらしふぁー', ['Ulquiorra Cifer', '烏爾奇奧拉・西法', '우르키오라 쉬퍼'], 'bleach', 'green', 99, ['帰刃「黒翼大魔」', 'Resurrección: Murciélago', '歸刃「黑翼大魔」', '레스렉시온 「무르시엘라고」'], [
    t(['帰刃', 'Resurrección', '歸刃', '레스렉시온'], ['黒翼大魔', 'Murciélago', '黑翼大魔', '무르시엘라고'], ['黒い翼で飛び、光の槍で斬りつける', 'Flies on black wings and strikes with a lance of light', '以黑翼飛行，用光之槍斬擊', '검은 날개로 날며 빛의 창으로 벤다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_yoru' }),
    t(['帰刃', 'Resurrección', '歸刃', '레스렉시온'], ['黒虚閃', 'Cero Oscuras', '黑虛閃', '세로 오스쿠라스'], ['解放した十刃だけが撃てる、黒い虚閃', 'The black Cero only a released Espada can fire', '只有解放後的十刃才能發射的黑色虛閃', '해방한 에스파다만 쏠 수 있는 검은 세로'], { k: 'inst', L: 1, R: 55, O: 1, v: 'thrust', sty: 'x_yoru' }),
    t(['刀剣解放第二階層', 'Segunda Etapa', '刀劍解放第二階層', '세군다 에타파'], ['雷霆の槍', 'Lanza del Relámpago', '雷霆之槍', '란사 델 렐람파고'], ['投げれば、あたり一帯が吹き飛ぶ槍', 'A lance that blows away the whole area when thrown', '一擲出去就會炸飛整片區域的槍', '던지면 일대가 날아가는 창'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_yoru' }),
  ]),
  c('ノイトラ・ジルガ', 'のいとらじるが', ['Nnoitra Gilga', '諾伊特拉・吉爾加', '노이트라 질가'], 'bleach', 'yellow', 95, ['帰刃「聖哭螳蜋」', 'Resurrección: Santa Teresa', '歸刃「聖哭螳螂」', '레스렉시온 「산타 테레사」'], [
    t(['鋼皮', 'Hierro', '鋼皮', '이에로'], ['最硬の鋼皮', 'The Hardest Hierro', '最硬的鋼皮', '가장 단단한 이에로'], ['十刃でいちばん硬い体。斬りつけた刃のほうがこぼれる', 'The hardest body among the Espada. It is the attacking blade that chips', '十刃中最堅硬的身體。砍上來的刀反而會崩口', '에스파다 중 가장 단단한 몸. 벤 칼날 쪽이 이가 빠진다'], { k: 'aura', L: 1, R: 7, D: 5, G: 1, v: 'calm', sty: 'x_nozarashi' }),
    t(['帰刃', 'Resurrección', '歸刃', '레스렉시온'], ['聖哭螳蜋', 'Santa Teresa', '聖哭螳螂', '산타 테레사'], ['六本の腕すべてに大鎌を持ち、いっせいに斬りつける', 'Wields a great scythe in each of six arms and strikes with all at once', '六隻手臂全都握著大鐮刀，一齊斬擊', '여섯 개의 팔 모두에 큰 낫을 들고 일제히 벤다'], { k: 'multi', N: 12, R: 34, v: 'arcs', sty: 'x_nozarashi' }),
  ]),
  c('銀城空吾', 'ぎんじょうくうご', ['Kugo Ginjo', '銀城空吾', '긴죠 쿠고'], 'bleach', 'black', 96, ['完現術「クロス・オブ・スキャッフォルド」', 'Fullbring: Cross of Scaffold', '完現術「絞刑架十字」', '풀브링 「크로스 오브 스캐폴드」'], [
    t(['完現術', 'Fullbring', '完現術', '풀브링'], ['クロス・オブ・スキャッフォルド', 'Cross of Scaffold', '絞刑架十字', '크로스 오브 스캐폴드'], ['十字架の首かざりを大剣に変えて叩き斬る', 'Turns a cross pendant into a great sword and cuts down', '將十字架項鍊化為大劍劈斬', '십자가 목걸이를 대검으로 바꿔 내리친다'], { k: 'inst', L: 1, R: 20, O: 1, v: 'arcDown', sty: 'x_meido' }),
    t(BANKAI, ['月牙天衝', 'Getsuga Tensho', '月牙天衝', '월아천충'], ['うばった力で放つ、紫がかった月牙', 'A violet-tinged Getsuga fired with stolen power', '以奪來的力量放出的紫色月牙', '빼앗은 힘으로 쏘는 보랏빛 월아'], { k: 'inst', L: 1, R: 45, O: 1, v: 'arcH', sty: 'x_meido' }),
  ]),
  c('月島秀九郎', 'つきしましゅうくろう', ['Shukuro Tsukishima', '月島秀九郎', '츠키시마 슈쿠로'], 'bleach', 'ainezu', 94, ['完現術「ブック・オブ・ジ・エンド」', 'Fullbring: Book of the End', '完現術「終結之書」', '풀브링 「북 오브 디 엔드」'], [
    t(['完現術', 'Fullbring', '完現術', '풀브링'], ['ブック・オブ・ジ・エンド', 'Book of the End', '終結之書', '북 오브 디 엔드'], ['斬った相手の過去に、自分の存在をはさみこむ', 'Inserts his own presence into the past of whoever he cuts', '將自己的存在插入被斬對手的過去', '벤 상대의 과거에 자신의 존재를 끼워 넣는다'], { k: 'slow', D: 6, S: .3, v: 'eye', sty: 'x_kodachi' }),
    t(['完現術', 'Fullbring', '完現術', '풀브링'], ['はさみこまれた過去', 'An Inserted Past', '被插入的過去', '끼워 넣은 과거'], ['「その技はもう知っている」。相手の技をすべて見切る', '"I already know that technique." Reads every move the foe makes', '「那一招我早就知道了」。看穿對手所有招式', '"그 기술은 이미 알고 있다." 상대의 기술을 모두 간파한다'], { k: 'aura', L: 1, R: 8, D: 5, G: 1, v: 'spin', sty: 'x_kodachi' }),
  ]),
  c('ビスタ', '', ['Vista', '比斯塔', '비스타'], 'onepiece', 'sakura', 95, ['花剣', 'Flower Sword', '花劍', '화검'], [
    t(['花剣', 'Flower Sword', '花劍', '화검'], ['薔薇ロンド', 'Rose Rondo', '薔薇迴旋曲', '장미 론도'], ['バラの花びらを舞わせながら、二刀で斬りまわる', 'Cuts with two swords amid a whirl of rose petals', '讓玫瑰花瓣飛舞，以雙刀四處斬擊', '장미 꽃잎을 흩날리며 쌍검으로 베고 다닌다'], { k: 'aura', L: 2, R: 9, D: 4, v: 'spin', sty: 'x_senbon' }),
    t(['花剣', 'Flower Sword', '花劍', '화검'], ['二刀の花剣', 'Twin Flower Swords', '雙刀花劍', '쌍검의 화검'], ['世界一の大剣豪とも打ち合える、白ひげ海賊団の二刀', 'The twin blades of the Whitebeard Pirates, able to trade blows with the world\'s greatest swordsman', '能與世界第一大劍豪交鋒的白鬍子海賊團雙刀', '세계 제일의 대검호와도 맞설 수 있는 흰 수염 해적단의 쌍검'], { k: 'multi', N: 9, R: 30, v: 'arcs', sty: 'x_senbon' }),
  ], [], ['ビスタ']),
  c('霜月リューマ', 'しもつきりゅーま', ['Shimotsuki Ryuma', '霜月龍馬', '시모츠키 류마'], 'onepiece', 'black', 99, ['黒刀「秋水」', 'Black Blade "Shusui"', '黑刀「秋水」', '흑도 「슈스이」'], [
    t(ITTO, ['鼻唄三丁 矢筈斬り', 'Hanauta Sancho: Yahazu Giri', '鼻歌三丁 矢筈斬', '콧노래 세 가락 화살깃 베기'], ['斬られたことに気づかせない、すれ違いざまの居合い', 'A passing quick-draw so fast the foe does not notice being cut', '擦身而過的居合，讓人察覺不到已被斬', '베였다는 것조차 모르게 하는, 스쳐 지나가는 발도술'], { k: 'inst', L: 0, R: 34, I: .5, v: 'bolt', a: 'iai', sty: 'x_yoru' }),
    t(['秋水', 'Shusui', '秋水', '슈스이'], ['竜斬り', 'Dragon Slaying', '斬龍', '용 베기'], ['空を飛ぶ竜を一太刀で両断した、伝説のひと振り', 'The legendary stroke that cleaved a flying dragon in two', '一刀將飛天之龍斬成兩半的傳說一揮', '하늘을 나는 용을 한 칼에 양단한 전설의 일격'], { k: 'inst', L: 9, R: 60, O: 1, I: 1, v: 'mega', sty: 'x_yoru' }),
  ], ['霜月龍馬']),
  c('シルバーズ・レイリー', 'しるばーずれいりー', ['Silvers Rayleigh', '西爾巴斯・雷利', '실버즈 레일리'], 'onepiece', 'white', 100, ['冥王', 'Dark King', '冥王', '명왕'], [
    t(['覇王色の覇気', "Conqueror's Haki", '霸王色霸氣', '패왕색 패기'], ['覇王色の覇気', "Conqueror's Haki", '霸王色霸氣', '패왕색 패기'], ['ひとにらみで、まわりのものが気を失う', 'One glare and everything around passes out', '一瞪之下，周圍的人全都昏厥', '한 번 노려보면 주위의 것들이 정신을 잃는다'], { k: 'slow', D: 7, S: .2, v: 'eye', sty: 'x_haoshoku' }),
    t(['武装色の覇気', 'Armament Haki', '武裝色霸氣', '무장색 패기'], ['飛ぶ斬撃', 'Flying Slash', '飛行的斬擊', '날아가는 참격'], ['覇気をまとった斬撃を飛ばす', 'Fires a slash cloaked in Haki', '放出纏繞霸氣的斬擊', '패기를 두른 참격을 날린다'], { k: 'inst', L: 1, R: 55, O: 1, v: 'arcH', sty: 'x_shuku' }),
    t(['異名', 'Alias', '異名', '이명'], ['冥王', 'Dark King', '冥王', '명왕'], ['海賊王の右腕。老いてなお、大将の足を止める', "The Pirate King's right hand. Even in old age he stops an Admiral in his tracks", '海賊王的右腕。即使年老依然能擋下大將', '해적왕의 오른팔. 늙어서도 대장의 발을 묶는다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_shuku' }),
  ]),
  c('ゴール・D・ロジャー', 'ごーるでぃーろじゃー', ['Gol D. Roger', '哥爾・D・羅傑', '골 D. 로저'], 'onepiece', 'red', 100, ['愛刀「エース」', 'Saber "Ace"', '愛刀「艾斯」', '애도 「에이스」'], [
    t(['覇王色の覇気', "Conqueror's Haki", '霸王色霸氣', '패왕색 패기'], ['覇王色の覇気', "Conqueror's Haki", '霸王色霸氣', '패왕색 패기'], ['海賊王の覇気。向き合うだけで動けなくなる', "The Pirate King's Haki. Just facing him leaves you unable to move", '海賊王的霸氣。光是面對就動彈不得', '해적왕의 패기. 마주 서는 것만으로 움직일 수 없게 된다'], { k: 'slow', D: 7, S: .2, v: 'eye', sty: 'x_haoshoku' }),
    t(['覇王色の覇気', "Conqueror's Haki", '霸王色霸氣', '패왕색 패기'], ['神避', 'Divine Departure', '神避', '신피'], ['覇王色をまとった斬撃。ふれずに相手を吹き飛ばす', "A slash cloaked in Conqueror's Haki that blows the foe away without touching", '纏繞霸王色的斬擊。不必碰觸就能把對手擊飛', '패왕색을 두른 참격. 닿지 않고도 상대를 날려 버린다'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_haoshoku' }),
  ], ['ゴールドロジャー', 'ゴール・D・ロジャー']),
  // ---------- 10回目：るろうに剣心・銀魂・NARUTO ----------
  c('比古清十郎', 'ひこせいじゅうろう', ['Seijuro Hiko', '比古清十郎', '히코 세이쥬로'], 'kenshin', 'white', 100, HITEN, [
    t(HITEN, ['龍槌閃', 'Ryutsuisen', '龍槌閃', '용추섬'], ['高く跳び、落ちる勢いで叩き斬る', 'Leaps high and strikes down with the force of the fall', '高高躍起，藉下落之勢劈斬', '높이 뛰어올라 떨어지는 기세로 내리친다'], { k: 'inst', L: 1, R: 16, O: 1, v: 'fall', sty: 'x_hiten' }),
    t(HITEN, ['九頭龍閃', 'Kuzuryusen', '九頭龍閃', '구두룡섬'], ['九つの斬撃を同時に打ちこむ。師匠のそれは弟子より重い', "Nine strikes landed at once. The master's hits harder than the pupil's", '同時打出九道斬擊。師父的比徒弟的更重', '아홉 줄기 참격을 동시에 꽂는다. 스승의 것은 제자보다 무겁다'], { k: 'inst', L: 2, R: 36, O: 1, I: .8, v: 'claws', sty: 'x_hiten' }),
    t(OUGI, ['天翔龍閃', 'Amakakeru Ryu no Hirameki', '天翔龍閃', '천상용섬'], ['飛天御剣流、十三代目継承者の超神速の抜刀術', 'The beyond-godspeed sword draw of the thirteenth master of the Hiten Mitsurugi Style', '飛天御劍流第十三代傳人的超神速拔刀術', '비천어검류 13대 계승자의 초신속 발도술'], { k: 'inst', L: 9, R: 60, O: 1, I: 1, v: 'mega', a: 'iai', sty: 'x_hiten' }),
  ]),
  c('雪代縁', 'ゆきしろえにし', ['Enishi Yukishiro', '雪代緣', '유키시로 에니시'], 'kenshin', 'gray', 98, ['倭刀術', 'Watojutsu', '倭刀術', '왜도술'], [
    t(['倭刀術', 'Watojutsu', '倭刀術', '왜도술'], ['蹴撃刀勢', 'Shugeki Tosei', '蹴擊刀勢', '축격도세'], ['刀の峰をけって、斬撃を加速させる', 'Kicks the back of the blade to accelerate the cut', '踢擊刀背使斬擊加速', '칼등을 차서 참격을 가속시킨다'], { k: 'inst', L: 0, R: 24, O: 1, v: 'arcH', sty: 'x_bugi' }),
    t(['倭刀術', 'Watojutsu', '倭刀術', '왜도술'], ['朝天刀勢', 'Choten Tosei', '朝天刀勢', '조천도세'], ['下から突きあげ、相手を宙に浮かせる', 'Thrusts up from below and lifts the foe into the air', '由下往上突刺，將對手挑上半空', '아래에서 찔러 올려 상대를 공중에 띄운다'], { k: 'inst', L: 1, R: 14, O: 1, v: 'arcUp', sty: 'x_bugi' }),
    t(['倭刀術', 'Watojutsu', '倭刀術', '왜도술'], ['疾空刀勢', 'Shikku Tosei', '疾空刀勢', '질공도세'], ['空中でもう一度跳び、上から斬りかかる', 'Leaps a second time in mid-air and cuts down from above', '在空中再次跳躍，由上方斬下', '공중에서 한 번 더 뛰어 위에서 베어 내린다'], { k: 'flow', L: 1, D: 3.5, v: 'ribbon', sty: 'x_bugi' }),
    t(['絶技', 'Ultimate Technique', '絕技', '절기'], ['虎伏絶刀勢', 'Kofuku Zettosei', '虎伏絕刀勢', '호복절도세'], ['低く伏せて力をため、全身のバネで斬りあげる', 'Crouches low to gather power, then cuts upward with the spring of the whole body', '伏低身體蓄力，以全身的彈力上斬', '낮게 엎드려 힘을 모았다가 온몸의 탄력으로 올려 벤다'], { k: 'inst', L: 9, R: 50, O: 1, I: .8, v: 'mega', sty: 'x_bugi' }),
  ]),
  c('鵜堂刃衛', 'うどうじんえ', ['Jin-e Udo', '鵜堂刃衛', '우도 진에'], 'kenshin', 'black', 93, ['二階堂平法', 'Nikaido Heiho', '二階堂平法', '니카이도 평법'], [
    t(['二階堂平法', 'Nikaido Heiho', '二階堂平法', '니카이도 평법'], ['心の一方', 'Shin no Ippo', '心之一方', '심의 일방'], ['ひとにらみの気合いで、相手の体をしばる', 'Binds the foe\'s body with the force of a single glare', '以一瞪的氣勢束縛對手的身體', '한 번 노려보는 기합으로 상대의 몸을 묶는다'], { k: 'slow', D: 6, S: .25, v: 'eye', sty: 'x_murasame' }),
    t(['二階堂平法', 'Nikaido Heiho', '二階堂平法', '니카이도 평법'], ['背車刀', 'Haishato', '背車刀', '배차도'], ['背中で刀を持ちかえ、思わぬ方から斬る', 'Switches sword hands behind his back and cuts from an unexpected side', '在背後換手持刀，從意想不到的方向斬擊', '등 뒤에서 칼을 바꿔 쥐고 뜻밖의 방향에서 벤다'], { k: 'inst', L: 1, R: 18, v: 'arcH', sty: 'x_murasame' }),
    t(['二階堂平法', 'Nikaido Heiho', '二階堂平法', '니카이도 평법'], ['憑鬼の術', 'Hyoki no Jutsu', '憑鬼之術', '빙귀술'], ['自分に暗示をかけ、力を限界まで引きだす', 'Hypnotizes himself to draw out his full strength', '對自己施加暗示，將力量引出至極限', '자신에게 암시를 걸어 힘을 한계까지 끌어낸다'], { k: 'flow', L: 1, D: 5, v: 'dragon', sty: 'x_murasame' }),
  ]),
  c('沢下条張', 'さわげじょうちょう', ['Cho Sawagejo', '澤下條張', '사와게죠 쵸'], 'kenshin', 'yellow', 88, ['刀狩', 'Sword Hunter', '刀狩', '칼 사냥꾼'], [
    t(['殺人奇剣', 'Killing Blade', '殺人奇劍', '살인기검'], ['連刃刀', 'Renbato', '連刃刀', '연인도'], ['二枚の刃をならべた刀。傷がふさがらない', 'A sword with two parallel blades. The wounds do not close', '兩片刀刃並排的刀。傷口無法癒合', '두 장의 칼날을 나란히 붙인 칼. 상처가 아물지 않는다'], { k: 'inst', L: 1, R: 16, v: 'claws', sty: 'x_zabi' }),
    t(['殺人奇剣', 'Killing Blade', '殺人奇劍', '살인기검'], ['薄刃乃太刀', 'Hakujin no Tachi', '薄刃乃太刀', '박인내태도'], ['鞭のようにしなる、うすくて長い刃をあやつる', 'Wields a long, thin blade that bends like a whip', '操縱如鞭子般柔韌的細長薄刃', '채찍처럼 휘는 얇고 긴 칼날을 다룬다'], { k: 'multi', N: 8, R: 30, v: 'arcs', sty: 'x_zabi' }),
    t(['我流', 'Self-Taught', '我流', '아류'], ['大蛇', 'Orochi', '大蛇', '오로치'], ['薄刃乃太刀を大蛇のようにうねらせて、まわりを薙ぐ', 'Makes the Hakujin no Tachi writhe like a great serpent and sweeps all around', '讓薄刃乃太刀如大蛇般蜿蜒，橫掃四周', '박인내태도를 큰 뱀처럼 굽이치게 해 주위를 휩쓴다'], { k: 'aura', L: 2, R: 9, D: 4, v: 'spin', sty: 'x_zabi' }),
  ], ['澤下條張']),
  c('明神弥彦', 'みょうじんやひこ', ['Yahiko Myojin', '明神彌彥', '묘진 야히코'], 'kenshin', 'yellow', 80, ['神谷活心流', 'Kamiya Kasshin Style', '神谷活心流', '카미야 활심류'], [
    t(['奥義の防り', 'Secret Defense', '奧義之守', '오의의 방어'], ['刃止め', 'Hadome', '刃止', '칼날 막기'], ['交差させた両手の甲で、刃をはさんで止める', 'Catches the blade between the crossed backs of both hands', '以交叉的雙手手背夾住刀刃', '교차시킨 양 손등으로 칼날을 끼워 막는다'], { k: 'aura', L: 1, R: 7, D: 3.5, G: 1, v: 'calm', sty: 'x_toyako' }),
    t(['奥義の攻め', 'Secret Attack', '奧義之攻', '오의의 공격'], ['刃渡り', 'Hawatari', '刃渡', '칼날 타기'], ['止めた刃をすべらせ、柄で打ちこむ', 'Slides along the caught blade and strikes with the hilt', '順著擋下的刀刃滑進，以刀柄擊打', '막은 칼날을 타고 미끄러져 손잡이로 친다'], { k: 'inst', L: 0, R: 14, O: 1, v: 'thrust', sty: 'x_toyako' }),
    t(['見よう見まね', 'Imitation', '有樣學樣', '어깨너머'], ['龍槌閃', 'Ryutsuisen', '龍槌閃', '용추섬'], ['剣心の技を、見て覚えたとおりに放つ', "Kenshin's technique, done just as he remembered seeing it", '照著看過的樣子使出劍心的招式', '켄신의 기술을 보고 익힌 대로 쓴다'], { k: 'inst', L: 0, R: 12, O: 1, v: 'fall', sty: 'x_toyako' }),
  ], ['明神彌彦']),
  c('神谷薫', 'かみやかおる', ['Kaoru Kamiya', '神谷薰', '카미야 카오루'], 'kenshin', 'sakura', 75, ['神谷活心流', 'Kamiya Kasshin Style', '神谷活心流', '카미야 활심류'], [
    t(['奥義の防り', 'Secret Defense', '奧義之守', '오의의 방어'], ['刃止め', 'Hadome', '刃止', '칼날 막기'], ['交差させた両手の甲で、刃をはさんで止める', 'Catches the blade between the crossed backs of both hands', '以交叉的雙手手背夾住刀刃', '교차시킨 양 손등으로 칼날을 끼워 막는다'], { k: 'aura', L: 1, R: 7, D: 3.5, G: 1, v: 'calm', sty: 'x_okita' }),
    t(['柄の下段', 'Low Hilt Strike', '柄之下段', '손잡이 하단'], ['膝挫', 'Hizahishigi', '膝挫', '무릎 꺾기'], ['木刀の柄で、相手のひざを打ちくだく', "Shatters the foe's knee with the hilt of a wooden sword", '以木刀的刀柄擊碎對手的膝蓋', '목검의 손잡이로 상대의 무릎을 부순다'], { k: 'inst', L: 0, R: 10, O: 1, v: 'arcDown', sty: 'x_okita' }),
  ]),
  // ---------- 銀魂 ----------
  c('志村新八', 'しむらしんぱち', ['Shinpachi Shimura', '志村新八', '시무라 신파치'], 'gintama', 'ainezu', 78, ['天堂無心流', 'Tendo Mushin Style', '天堂無心流', '천당무심류'], [
    t(['万事屋', 'Yorozuya', '萬事屋', '해결사'], ['ツッコミ', 'The Retort', '吐槽', '태클'], ['全力のツッコミで、その場の空気を止める', 'A full-force retort that brings everything to a halt', '以全力的吐槽讓現場氣氛凝結', '전력의 태클로 그 자리의 공기를 멈춘다'], { k: 'slow', D: 4, S: .4, v: 'eye', sty: 'x_toyako' }),
    t(['天堂無心流', 'Tendo Mushin Style', '天堂無心流', '천당무심류'], ['恒道館の剣', 'The Kodokan Sword', '恆道館之劍', '항도관의 검'], ['つぶれかけの道場を守ってきた、まっすぐな剣', 'The honest sword that has kept a failing dojo alive', '一直守護著瀕臨倒閉道場的正直之劍', '망해 가는 도장을 지켜 온 올곧은 검'], { k: 'multi', N: 5, R: 24, v: 'arcs', sty: 'x_toyako' }),
    t(['本体', 'True Body', '本體', '본체'], ['メガネ', 'The Glasses', '眼鏡', '안경'], ['本体はメガネのほう。メガネが無事なら、やられない', 'The glasses are the real him. As long as they are safe, he cannot be beaten', '本體是眼鏡。只要眼鏡沒事就不會被打倒', '본체는 안경 쪽. 안경이 무사하면 당하지 않는다'], { k: 'aura', L: 1, R: 7, D: 4, G: 1, v: 'calm', sty: 'x_toyako' }),
  ]),
  c('柳生九兵衛', 'やぎゅうきゅうべえ', ['Kyubei Yagyu', '柳生九兵衛', '야규 큐베에'], 'gintama', 'bluepurple', 94, ['柳生陳陰流', "Yagyu Chin'in Style", '柳生陳陰流', '야규 진음류'], [
    t(['柳生陳陰流', "Yagyu Chin'in Style", '柳生陳陰流', '야규 진음류'], ['神速の剣', 'God-Speed Blade', '神速之劍', '신속의 검'], ['柳生家はじまって以来の天才といわれる、目にもとまらぬ剣', 'The blinding swordplay of the greatest prodigy in the history of the Yagyu clan', '被譽為柳生家有史以來的天才，快得看不見的劍', '야규 가문 사상 최고의 천재라 불리는, 눈에도 보이지 않는 검'], { k: 'flow', L: 1, D: 4.5, v: 'ribbon', sty: 'x_katsura' }),
    t(['体質', 'Reflex', '體質', '체질'], ['男にふれられると投げとばす', 'Throws Any Man Who Touches Her', '被男人碰到就會摔出去', '남자가 닿으면 내던진다'], ['ふれた相手を、考えるより先に投げとばしてしまう', 'Throws whoever touches her before she even thinks', '碰到她的人，她還來不及思考就摔了出去', '닿은 상대를 생각하기도 전에 내던져 버린다'], { k: 'aura', L: 1, R: 7, D: 4, O: 1, v: 'spin', sty: 'x_katsura' }),
  ]),
  // ---------- NARUTO ----------
  c('干柿鬼鮫', 'ほしがききさめ', ['Kisame Hoshigaki', '干柿鬼鮫', '호시가키 키사메'], 'naruto', 'blue', 97, ['大刀「鮫肌」', 'Samehada', '大刀「鮫肌」', '대도 「사메하다」'], [
    t(['鮫肌', 'Samehada', '鮫肌', '사메하다'], ['削りとる', 'Shave', '削取', '깎아 내기'], ['斬るのではなく削り、相手のチャクラを喰う', "Does not cut but shaves, devouring the foe's chakra", '不是斬而是削，並吞噬對手的查克拉', '베는 것이 아니라 깎아 내며 상대의 차크라를 먹는다'], { k: 'inst', L: 1, R: 16, H: 50, v: 'arcH', sty: 'x_shigure' }),
    t(['水遁', 'Water Release', '水遁', '수둔'], ['水鮫弾の術', 'Water Shark Bullet Jutsu', '水鮫彈之術', '수교탄술'], ['鮫の形の水を撃ち出す', 'Fires water in the shape of a shark', '射出鯊魚形狀的水', '상어 모양의 물을 쏘아 낸다'], { k: 'inst', L: 1, R: 45, O: 1, v: 'thrust', sty: 'x_shigure' }),
    t(['水遁', 'Water Release', '水遁', '수둔'], ['千食鮫', 'Thousand Feeding Sharks', '千食鮫', '천식교'], ['千匹の水の鮫が、いっせいに食らいつく', 'A thousand sharks of water bite down all at once', '千條水鯊一齊撲咬', '천 마리의 물 상어가 일제히 물어뜯는다'], { k: 'multi', N: 14, R: 40, v: 'arcs', sty: 'x_shigure' }),
    t(['水遁', 'Water Release', '水遁', '수둔'], ['大爆水衝波', 'Great Exploding Water Shock Wave', '大爆水衝波', '대폭수충파'], ['口から大量の水をはき、あたりを水で満たす', 'Spews a vast volume of water and floods the whole area', '從口中吐出大量的水，淹沒四周', '입에서 대량의 물을 토해 주위를 물로 채운다'], { k: 'aura', L: 9, R: 10, D: 5, v: 'calm', sty: 'x_shigure' }),
  ]),
  c('キラービー', '', ['Killer B', '奇拉比', '킬러 비'], 'naruto', 'purple', 98, ['七本の刀', 'Seven Swords', '七把刀', '일곱 자루의 칼'], [
    t(['剣技', 'Sword Technique', '劍技', '검기'], ['アクロバット', 'Acrobat', '特技劍法', '아크로바트'], ['体じゅうに七本の刀をはさみ、読めない動きで斬る', 'Grips seven swords all over his body and cuts with unreadable moves', '全身夾著七把刀，以無法預測的動作斬擊', '온몸에 일곱 자루의 칼을 끼우고 읽을 수 없는 움직임으로 벤다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_chidori' }),
    t(['雷遁', 'Lightning Release', '雷遁', '뇌둔'], ['超ビブラート雷遁刀', 'Super Vibrato Lightning Release Blade', '超顫音雷遁刀', '초 비브라토 뇌둔도'], ['高速でふるえる雷の刃で、何でも貫く', 'A lightning blade vibrating at high speed pierces anything', '以高速震動的雷之刃貫穿一切', '고속으로 떨리는 번개의 칼날로 무엇이든 꿰뚫는다'], { k: 'inst', L: 0, R: 40, O: 1, v: 'thrust', sty: 'x_chidori' }),
    t(['尾獣', 'Tailed Beast', '尾獸', '미수'], ['尾獣玉', 'Tailed Beast Ball', '尾獸玉', '미수옥'], ['八尾のチャクラを黒い玉に固めて撃つ', 'Compresses the chakra of the Eight-Tails into a black ball and fires it', '將八尾的查克拉凝聚成黑色球體射出', '팔미의 차크라를 검은 구슬로 뭉쳐 쏜다'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_susanoo' }),
  ], [], ['キラービー', 'キラー・ビー']),
  // ---------- 11回目：Fate・ソードアート・オンライン ----------
  c('モードレッド', '', ['Mordred', '莫德雷德', '모드레드'], 'fate', 'red', 97, ['燦然と輝く王剣', 'Clarent', '燦然輝耀的王劍', '찬란히 빛나는 왕검'], [
    t(['スキル', 'Skill', '技能', '스킬'], ['魔力放出', 'Mana Burst', '魔力放出', '마력 방출'], ['赤い雷をまとって、力まかせに斬りこむ', 'Cloaked in red lightning, cuts in with brute force', '身纏紅色雷電，憑蠻力斬入', '붉은 번개를 두르고 힘으로 베어 들어간다'], { k: 'flow', L: 1, D: 4, v: 'ribbon', sty: 'x_haoshoku' }),
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['我が麗しき父への叛逆', 'Clarent Blood Arthur', '對吾華麗父王的叛逆', '나의 아름다운 아버지에 대한 반역'], ['王剣にためた赤い雷を、まっすぐ撃ち出す', 'Fires the red lightning stored in the royal sword straight ahead', '將蓄積於王劍的紅色雷電筆直射出', '왕검에 모은 붉은 번개를 곧장 쏘아 낸다'], { k: 'inst', L: 9, R: 65, O: 1, I: 1, v: 'mega', sty: 'x_haoshoku' }),
  ], [], ['モードレッド']),
  c('ランスロット', '', ['Lancelot', '蘭斯洛特', '랜슬롯'], 'fate', 'blue', 99, ['無毀なる湖光', 'Arondight', '無毀的湖光', '무훼의 호광'], [
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['騎士は徒手にて死せず', 'Knight of Owner', '騎士不死於徒手', '기사는 맨손으로 죽지 않는다'], ['手にしたものは、何でも自分の宝具にして戦う', 'Whatever he picks up becomes his own Noble Phantasm', '任何到手的東西都能化為自己的寶具戰鬥', '손에 쥔 것은 무엇이든 자신의 보구로 삼아 싸운다'], { k: 'multi', N: 9, R: 30, v: 'arcs', sty: 'x_getsuga' }),
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['縛鎖全断・過重湖光', 'Arondight Overload', '縛鎖全斷・過重湖光', '박쇄전단·과중호광'], ['剣にこめすぎた魔力を、斬った切り口から解きはなつ', 'Overloads the sword with mana and releases it through the cut', '將過量灌注於劍中的魔力從斬開的切口釋放', '검에 지나치게 담은 마력을 벤 자리에서 풀어 놓는다'], { k: 'inst', L: 1, R: 50, O: 1, I: .8, v: 'mega', sty: 'x_getsuga' }),
  ], [], ['ランスロット']),
  c('ガウェイン', '', ['Gawain', '高文', '가웨인'], 'fate', 'orange', 98, ['転輪する勝利の剣', 'Excalibur Galatine', '轉輪勝利之劍', '전륜하는 승리의 검'], [
    t(['スキル', 'Skill', '技能', '스킬'], ['聖者の数字', 'Numeral of the Saint', '聖者的數字', '성자의 숫자'], ['太陽が出ているあいだ、力が三倍になる', 'While the sun is up, his strength is tripled', '太陽當空之時，力量變為三倍', '태양이 떠 있는 동안 힘이 세 배가 된다'], { k: 'flow', L: 1, D: 5, v: 'dragon', sty: 'x_ryujin' }),
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['転輪する勝利の剣', 'Excalibur Galatine', '轉輪勝利之劍', '전륜하는 승리의 검'], ['太陽の熱をやどした剣で、あたりを焼きはらう', 'Scorches the area with a sword that holds the heat of the sun', '以寄宿太陽之熱的劍焚燒四周', '태양의 열을 품은 검으로 주위를 불태운다'], { k: 'inst', L: 9, R: 60, O: 1, I: 1, v: 'mega', sty: 'x_ryujin' }),
  ], [], ['ガウェイン']),
  c('ネロ・クラウディウス', 'ねろくらうでぃうす', ['Nero Claudius', '尼祿・克勞狄烏斯', '네로 클라우디우스'], 'fate', 'red', 95, ['原初の火', 'Aestus Estus', '原初之火', '원초의 불'], [
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['招き蕩う黄金劇場', 'Aestus Domus Aurea', '招蕩的黃金劇場', '초탕의 황금극장'], ['自分に都合のいい黄金の劇場を作り、相手を弱らせる', 'Raises a golden theater that favors her and weakens the foe', '建起對自己有利的黃金劇場，削弱對手', '자신에게 유리한 황금 극장을 세워 상대를 약하게 한다'], { k: 'slow', D: 6, S: .3, v: 'eye', sty: 'x_excalibur' }),
    t(['剣技', 'Sword Technique', '劍技', '검기'], ['童女謳う華の帝政', 'Laus Saint Claudius', '童女謳歌的華之帝政', '동녀가 노래하는 꽃의 제정'], ['劇場の中で放つ、花ふぶきの一閃', 'A flash amid a storm of petals, delivered inside her theater', '在劇場中放出的花吹雪一閃', '극장 안에서 펼치는 꽃보라의 일섬'], { k: 'inst', L: 2, R: 40, O: 1, I: .6, v: 'arcH', sty: 'x_senbon' }),
  ]),
  c('ジークフリート', '', ['Siegfried', '齊格飛', '지크프리트'], 'fate', 'ainezu', 97, ['幻想大剣・天魔失墜', 'Balmung', '幻想大劍・天魔失墜', '환상대검·천마실추'], [
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['悪竜の血鎧', 'Armor of Fafnir', '惡龍的血鎧', '악룡의 피갑옷'], ['竜の血をあびた体は、ほとんどの攻めを通さない', 'A body bathed in dragon blood turns away nearly every attack', '沐浴過龍血的身體幾乎能擋下所有攻擊', '용의 피를 뒤집어쓴 몸은 거의 모든 공격을 통하지 않게 한다'], { k: 'aura', L: 1, R: 7, D: 5, G: 1, v: 'calm', sty: 'x_strash' }),
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['幻想大剣・天魔失墜', 'Balmung', '幻想大劍・天魔失墜', '환상대검·천마실추'], ['竜殺しの剣から、たそがれ色の波を放つ', 'Releases a twilight-colored wave from the dragon-slaying sword', '從屠龍之劍放出黃昏色的波濤', '용을 죽인 검에서 황혼빛의 파도를 쏜다'], { k: 'inst', L: 9, R: 65, O: 1, I: 1, v: 'mega', sty: 'x_strash' }),
  ], [], ['ジークフリート']),
  c('岡田以蔵', 'おかだいぞう', ['Izo Okada', '岡田以藏', '오카다 이조'], 'fate', 'black', 92, ['人斬り', 'Hitokiri', '人斬', '히토키리'], [
    t(['スキル', 'Skill', '技能', '스킬'], ['人斬り', 'Hitokiri', '人斬', '히토키리'], ['人を斬ることだけをきわめた剣', 'A sword honed for one thing only: cutting people down', '只精通斬人的劍', '사람을 베는 것만을 갈고닦은 검'], { k: 'inst', L: 1, R: 20, O: 1, v: 'arcH', sty: 'x_murasame' }),
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['始末剣', 'Shimatsuken', '始末劍', '시말검'], ['一度見た剣技を、そっくり自分のものにして斬る', 'Makes any swordplay he has seen once entirely his own', '只要看過一次的劍技，就能完全化為己用', '한 번 본 검기를 고스란히 제 것으로 삼아 벤다'], { k: 'multi', N: 9, R: 30, v: 'arcs', sty: 'x_murasame' }),
  ]),
  c('宮本武蔵', 'みやもとむさし', ['Musashi Miyamoto', '宮本武藏', '미야모토 무사시'], 'fate', 'blue', 100, ['二天一流', 'Niten Ichi-ryu', '二天一流', '이천일류'], [
    t(['スキル', 'Skill', '技能', '스킬'], ['第五勢', 'Fifth Form', '第五勢', '제5세'], ['二刀のかまえから、すきなく斬りこむ', 'Cuts in without an opening from a two-sword stance', '由雙刀架勢毫無破綻地斬入', '쌍검의 자세에서 빈틈없이 베어 들어간다'], { k: 'multi', N: 8, R: 28, v: 'arcs', sty: 'x_strash' }),
    t(['スキル', 'Skill', '技能', '스킬'], ['天眼', 'Tengan', '天眼', '천안'], ['斬ると決めた一点に、すべてをしぼりこむ', 'Narrows everything down to the single point she has decided to cut', '將一切集中於決定要斬的那一點', '베겠다고 정한 한 점에 모든 것을 모은다'], { k: 'slow', D: 5, S: .35, v: 'eye', sty: 'x_strash' }),
    t(['宝具', 'Noble Phantasm', '寶具', '보구'], ['六道五輪・倶利伽羅天象', 'Rikudo Gorin: Kurikara Tensho', '六道五輪・俱利伽羅天象', '육도오륜·구리가라 천상'], ['仁王の気迫で斬りきざみ、最後のひと太刀で「空」にいたる', 'Cuts with the spirit of the Nio, and the final stroke reaches "the Void"', '以仁王的氣魄斬擊，最後一刀抵達「空」', '인왕의 기백으로 베어 내고 마지막 한 칼로 "공"에 이른다'], { k: 'inst', L: 9, R: 60, O: 1, I: 1, v: 'mega', sty: 'x_strash' }),
  ], ['宮本武藏']),
  c('紺野木綿季', 'こんのゆうき', ['Yuuki Konno', '紺野木綿季', '콘노 유우키'], 'sao', 'purple', 98, ['絶剣', 'Absolute Sword', '絕劍', '절검'], [
    t(['異名', 'Alias', '異名', '이명'], ['絶剣', 'Zekken', '絕劍', '절검'], ['だれにも負けなかった、速すぎる剣', 'A sword too fast for anyone to beat', '從未敗給任何人的極速之劍', '누구에게도 지지 않은, 너무나 빠른 검'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_tsubame' }),
    t(['オリジナル・ソードスキル', 'Original Sword Skill', '原創劍技', '오리지널 소드 스킬'], ['マザーズ・ロザリオ', "Mother's Rosario", '聖母聖詠', '마더즈 로자리오'], ['十字をえがく十連突きと、とどめの一突き。自分で作りあげた十一連撃', 'Ten thrusts tracing a cross and one finishing thrust: the eleven-hit combo she created herself', '畫出十字的十連刺加上最後一刺。自己創出的十一連擊', '십자를 그리는 10연속 찌르기와 마지막 일격. 스스로 만들어 낸 11연격'], { k: 'multi', N: 11, R: 36, v: 'arcs', sty: 'x_tsubame' }),
  ]),
  c('ユージオ', '', ['Eugeo', '尤吉歐', '유지오'], 'sao', 'blue', 95, ['青薔薇の剣', 'Blue Rose Sword', '藍薔薇之劍', '푸른 장미의 검'], [
    t(['アインクラッド流', 'Aincrad Style', '艾恩葛朗特流', '아인크라드류'], ['バーチカル', 'Vertical', '垂直斬', '버티컬'], ['キリトに教わった、まっすぐな縦斬り', 'The straight vertical cut he learned from Kirito', '向桐人學來的筆直縱斬', '키리토에게 배운 곧은 세로 베기'], { k: 'inst', L: 0, R: 14, O: 1, v: 'arcDown', sty: 'x_hyorin' }),
    t(['武装完全支配術', 'Enhance Armament', '武裝完全支配術', '무장완전지배술'], ['咲け、青薔薇', 'Bloom, Blue Rose', '綻放吧，藍薔薇', '피어라, 푸른 장미'], ['氷のつるで相手をしばり、凍らせる', 'Binds the foe with vines of ice and freezes them', '以冰之藤蔓束縛對手並凍結', '얼음 덩굴로 상대를 묶어 얼린다'], { k: 'slow', D: 6, S: .25, v: 'eye', sty: 'x_hyorin' }),
    t(['記憶解放術', 'Release Recollection', '記憶解放術', '기억해방술'], ['リリース・リコレクション', 'Release Recollection', '記憶解放', '릴리스 리컬렉션'], ['氷の薔薇が命を吸いあげ、花を咲かせる', 'Roses of ice drain life and burst into bloom', '冰之薔薇吸取生命並綻放', '얼음 장미가 생명을 빨아올려 꽃을 피운다'], { k: 'aura', L: 9, R: 10, D: 5, v: 'calm', sty: 'x_hyorin' }),
  ], [], ['ユージオ']),
  c('アリス・シンセシス・サーティ', 'ありすしんせしすさーてぃ', ['Alice Synthesis Thirty', '愛麗絲・辛賽西斯・薩提', '앨리스 신세시스 서티'], 'sao', 'yellow', 99, ['金木犀の剣', 'Osmanthus Blade', '金木犀之劍', '금목서의 검'], [
    t(['武装完全支配術', 'Enhance Armament', '武裝完全支配術', '무장완전지배술'], ['エンハンス・アーマメント', 'Enhance Armament', '武裝完全支配', '인핸스 아머먼트'], ['刀身が数百の金の花びらに分かれ、自在に飛ぶ', 'The blade splits into hundreds of golden petals that fly at will', '刀身分成數百片金色花瓣，自在飛舞', '칼날이 수백 장의 금빛 꽃잎으로 나뉘어 자유자재로 난다'], { k: 'rain', D: 5, R: 40, O: 1, v: 'rainfall', sty: 'x_excalibur' }),
    t(['記憶解放術', 'Release Recollection', '記憶解放術', '기억해방술'], ['リリース・リコレクション', 'Release Recollection', '記憶解放', '릴리스 리컬렉션'], ['花びらを一つにまとめ、光の柱にして撃つ', 'Gathers the petals into one and fires them as a pillar of light', '將花瓣匯聚為一，化為光柱射出', '꽃잎을 하나로 모아 빛의 기둥으로 쏜다'], { k: 'inst', L: 9, R: 65, O: 1, I: 1, v: 'mega', sty: 'x_excalibur' }),
  ], ['アリス・ツーベルク', 'ありすつーべるく']),
  // ---------- 12回目：D.Gray-man・青の祓魔師・ノラガミ・終わりのセラフ・ソウルイーター・七つの大罪 ----------
  c('アレン・ウォーカー', 'あれんうぉーかー', ['Allen Walker', '亞連・沃克', '알렌 워커'], 'dgray', 'white', 96, ['神ノ道化', 'Crown Clown', '神之道化', '신의 광대'], [
    t(['神ノ道化', 'Crown Clown', '神之道化', '신의 광대'], ['道化ノ帯', 'Clown Belt', '道化之帶', '광대의 띠'], ['白い帯をのばして、相手をしばりあげる', 'Extends a white belt and binds the foe', '伸出白色帶子捆住對手', '하얀 띠를 뻗어 상대를 묶는다'], { k: 'slow', D: 4, S: .4, v: 'eye', sty: 'x_shuku' }),
    t(['神ノ道化', 'Crown Clown', '神之道化', '신의 광대'], ['破滅ノ爪', 'Edge End', '破滅之爪', '엣지 엔드'], ['左手の巨大な爪で引き裂く', 'Rends with the giant claws of his left hand', '以左手的巨大爪子撕裂', '왼손의 거대한 발톱으로 찢는다'], { k: 'inst', L: 2, R: 20, O: 1, v: 'claws', sty: 'x_shuku' }),
    t(['神ノ道化', 'Crown Clown', '神之道化', '신의 광대'], ['退魔ノ剣', 'Sword of Exorcism', '退魔之劍', '퇴마의 검'], ['左腕を大剣に変える。人は斬らず、悪だけを斬る', 'Turns his left arm into a great sword that cuts only evil, never people', '將左臂化為大劍。不斬人，只斬惡', '왼팔을 대검으로 바꾼다. 사람은 베지 않고 악만을 벤다'], { k: 'inst', L: 1, R: 45, O: 1, I: .6, v: 'thrust', sty: 'x_shuku' }),
  ]),
  c('奥村燐', 'おくむらりん', ['Rin Okumura', '奧村燐', '오쿠무라 린'], 'aoex', 'blue', 95, ['降魔剣「倶利伽羅」', 'Koma Sword: Kurikara', '降魔劍「俱利伽羅」', '항마검 「쿠리카라」'], [
    t(['青い炎', 'Blue Flames', '青焰', '푸른 불꽃'], ['抜刀', 'Unsheathe', '拔刀', '발도'], ['刀を抜くと、サタンの青い炎が体をつつむ', "Draws the sword and Satan's blue flames wrap his body", '一拔刀，撒旦的青焰便包覆全身', '칼을 뽑으면 사탄의 푸른 불꽃이 몸을 감싼다'], { k: 'aura', L: 1, R: 8, D: 5, v: 'vortex', sty: 'x_getsuga' }),
    t(['青い炎', 'Blue Flames', '青焰', '푸른 불꽃'], ['青い炎の斬撃', 'Blue Flame Slash', '青焰斬擊', '푸른 불꽃의 참격'], ['青い炎を刃にのせて飛ばす', 'Sends blue flames flying off the blade', '將青焰附於刀刃上放出', '푸른 불꽃을 칼날에 실어 날린다'], { k: 'inst', L: 1, R: 36, O: 1, v: 'arcH', sty: 'x_getsuga' }),
    t(['必殺技', 'Finishing Move', '必殺技', '필살기'], ['サタンスラッシュ', 'Satan Slash', '撒旦斬', '사탄 슬래시'], ['全力の青い炎で、まっすぐ断ちわる', 'Cleaves straight through with blue flames at full power', '以全力的青焰筆直劈開', '전력의 푸른 불꽃으로 곧장 가른다'], { k: 'inst', L: 9, R: 55, O: 1, I: .8, v: 'mega', sty: 'x_getsuga' }),
  ]),
  c('霧隠シュラ', 'きりがくれしゅら', ['Shura Kirigakure', '霧隱修羅', '키리가쿠레 슈라'], 'aoex', 'red', 93, ['霧隠流魔剣技', 'Kirigakure-Style Demon Sword Technique', '霧隱流魔劍技', '키리가쿠레류 마검기'], [
    t(['霧隠流魔剣技', 'Kirigakure Style', '霧隱流魔劍技', '키리가쿠레류 마검기'], ['蛇牙', 'Snake Fang', '蛇牙', '사아'], ['魔剣を振り、牙のような斬撃を飛ばす', 'Swings the demon sword and fires fang-like slashes', '揮動魔劍，放出如牙般的斬擊', '마검을 휘둘러 송곳니 같은 참격을 날린다'], { k: 'inst', L: 1, R: 36, v: 'arcH', sty: 'x_zabi' }),
    t(['霧隠流魔剣技', 'Kirigakure Style', '霧隱流魔劍技', '키리가쿠레류 마검기'], ['蛇腹化・蛇牙', 'Snake Belly Form: Snake Fang', '蛇腹化・蛇牙', '사복화·사아'], ['刀を蛇腹のようにのばして、広く斬りはらう', 'Extends the sword like a segmented whip and sweeps wide', '將刀如蛇腹般伸長，大範圍橫掃', '칼을 뱀의 배처럼 늘여 넓게 휩쓴다'], { k: 'inst', L: 2, R: 30, O: 1, v: 'claws', sty: 'x_zabi' }),
  ]),
  c('夜ト', 'やと', ['Yato', '夜斗', '야토'], 'noragami', 'blue', 96, ['神器「雪器」', 'Regalia: Sekki', '神器「雪器」', '신기 「세키」'], [
    t(['祝詞', 'Incantation', '祝詞', '축사'], ['斬', 'Rend', '斬', '참'], ['「我 夜ト神、来たり降り…」ととなえ、妖を祓い斬る', 'Chants "I, the god Yato, have descended..." and cuts the phantom away', '吟誦「吾乃夜斗神，降臨於此…」，祓除並斬斷妖物', '"나, 야토신이 강림하여…"를 외고 요괴를 베어 정화한다'], { k: 'inst', L: 1, R: 36, O: 1, v: 'arcH', sty: 'x_sao' }),
    t(['祝の器', 'Blessed Regalia', '祝器', '축기'], ['雪器・二刀', 'Sekki: Twin Blades', '雪器・雙刀', '세키·쌍검'], ['祝の器になって二本にふえた刀で、斬りきざむ', 'Cuts with the blade that became two when it turned into a Blessed Regalia', '以成為祝器後化為兩把的刀切碎對手', '축기가 되어 두 자루로 늘어난 칼로 썰어 낸다'], { k: 'multi', N: 9, R: 30, v: 'arcs', sty: 'x_sao' }),
  ], ['夜斗']),
  c('百夜優一郎', 'ひゃくやゆういちろう', ['Yuichiro Hyakuya', '百夜優一郎', '햐쿠야 유이치로'], 'seraph', 'green', 94, ['鬼呪装備「阿朱羅丸」', 'Cursed Gear: Asuramaru', '鬼咒裝備「阿朱羅丸」', '귀주장비 「아슈라마루」'], [
    t(['鬼呪', 'Demon Curse', '鬼咒', '귀주'], ['憑依', 'Possession', '憑依', '빙의'], ['刀にやどる鬼の力を、自分の体に引きこむ', 'Draws the power of the demon in the sword into his own body', '將寄宿於刀中的鬼之力引入自己體內', '칼에 깃든 귀신의 힘을 자신의 몸에 끌어들인다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_yoru' }),
    t(['鬼呪', 'Demon Curse', '鬼咒', '귀주'], ['阿朱羅観音', 'Asura Kannon', '阿朱羅觀音', '아슈라 관음'], ['たくさんの刀を呼び出してまわりにならべ、いっせいに撃つ', 'Summons many swords around him and fires them all at once', '喚出許多刀排列於四周，一齊射出', '수많은 칼을 불러내 주위에 늘어놓고 일제히 쏜다'], { k: 'rain', D: 4, R: 36, v: 'rainfall', sty: 'x_yoru' }),
  ]),
  c('一瀬グレン', 'いちのせぐれん', ['Guren Ichinose', '一瀨紅蓮', '이치노세 구렌'], 'seraph', 'red', 97, ['鬼呪装備「真昼ノ夜」', 'Cursed Gear: Mahiru-no-Yo', '鬼咒裝備「真晝之夜」', '귀주장비 「마히루노요」'], [
    t(['鬼呪', 'Demon Curse', '鬼咒', '귀주'], ['憑依', 'Possession', '憑依', '빙의'], ['刀にやどる鬼の力を、自分の体に引きこむ', 'Draws the power of the demon in the sword into his own body', '將寄宿於刀中的鬼之力引入自己體內', '칼에 깃든 귀신의 힘을 자신의 몸에 끌어들인다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_kuro' }),
    t(['鬼呪', 'Demon Curse', '鬼咒', '귀주'], ['真昼ノ夜', 'Mahiru-no-Yo', '真晝之夜', '마히루노요'], ['黒い斬撃を広く飛ばす', 'Fires a wide black slash', '大範圍放出黑色斬擊', '검은 참격을 넓게 날린다'], { k: 'inst', L: 2, R: 40, O: 1, v: 'arcH', sty: 'x_kuro' }),
  ], ['一瀬紅蓮']),
  c('クロナ', '', ['Crona', '克羅納', '크로나'], 'souleater', 'black', 90, ['魔剣「ラグナロク」', 'Demon Sword: Ragnarok', '魔劍「諸神黃昏」', '마검 「라그나로크」'], [
    t(['黒血', 'Black Blood', '黑血', '흑혈'], ['黒血の硬化', 'Black Blood Hardening', '黑血硬化', '흑혈 경화'], ['体を流れる黒い血を固めて、刃を通さなくする', 'Hardens the black blood in the body so no blade gets through', '將體內流動的黑血硬化，使刀刃無法穿透', '몸에 흐르는 검은 피를 굳혀 칼날이 통하지 않게 한다'], { k: 'aura', L: 1, R: 7, D: 4.5, G: 1, v: 'calm', sty: 'x_meido' }),
    t(['悲鳴共鳴', 'Scream Resonance', '悲鳴共鳴', '비명 공명'], ['スクリーチα', 'Screech Alpha', '尖嘯α', '스크리치 알파'], ['剣が悲鳴をあげ、ふるえる刃から斬撃を飛ばす', 'The sword screams and fires a slash from its vibrating edge', '劍發出悲鳴，從震動的刀刃放出斬擊', '검이 비명을 지르고 떨리는 칼날에서 참격을 날린다'], { k: 'inst', L: 1, R: 40, O: 1, v: 'arcH', sty: 'x_meido' }),
    t(['黒血', 'Black Blood', '黑血', '흑혈'], ['ブラッディニードル', 'Bloody Needle', '血針', '블러디 니들'], ['流れた黒い血を針に変えて、突き立てる', 'Turns spilled black blood into needles that stab upward', '將流出的黑血化為針刺出', '흘린 검은 피를 바늘로 바꿔 꽂는다'], { k: 'rain', D: 3, R: 30, v: 'rainfall', sty: 'x_meido' }),
  ], [], ['クロナ']),
  c('ブラック☆スター', '', ['Black Star', '布萊克☆斯塔', '블랙☆스타'], 'souleater', 'blue', 94, ['魔暗器「中務椿」', 'Dark Arm: Tsubaki Nakatsukasa', '魔暗器「中務椿」', '마암기 「나카츠카사 츠바키」'], [
    t(['魂威', 'Soul Force', '魂威', '혼위'], ['黒☆星ビッグウェーブ', 'Black Star Big Wave', '黑☆星巨浪', '블랙☆스타 빅 웨이브'], ['魂の波長を、手のひらから直接うちこむ', 'Drives his soul wavelength straight in through the palm', '將靈魂波長從手掌直接打入', '혼의 파장을 손바닥에서 직접 꽂는다'], { k: 'inst', L: 1, R: 20, O: 1, v: 'thrust', sty: 'x_chidori' }),
    t(['妖刀モード', 'Enchanted Sword Mode', '妖刀模式', '요도 모드'], ['影☆星', 'Shadow Star', '影☆星', '그림자☆별'], ['影をあやつる妖刀で、足もとの影から斬る', 'With the shadow-wielding enchanted sword, cuts from the shadows underfoot', '以操縱影子的妖刀，從腳下的影子斬擊', '그림자를 다루는 요도로 발밑의 그림자에서 벤다'], { k: 'multi', N: 8, R: 30, v: 'arcs', sty: 'x_meido' }),
  ], ['Black☆Star'], ['ブラック☆スター', 'ブラックスター']),
  c('アーサー・ペンドラゴン', 'あーさーぺんどらごん', ['Arthur Pendragon', '亞瑟・潘德拉貢', '아서 펜드래건'], 'nanatsu', 'yellow', 95, ['聖剣エクスカリバー', 'Holy Sword Excalibur', '聖劍 Excalibur', '성검 엑스칼리버'], [
    t(['聖剣', 'Holy Sword', '聖劍', '성검'], ['エクスカリバー', 'Excalibur', 'Excalibur', '엑스칼리버'], ['歴代の王の技がやどる剣。にぎるだけで達人になる', 'A sword holding the skills of every king before him. Just gripping it makes him a master', '寄宿歷代國王技藝的劍。只要握住就能成為高手', '역대 왕들의 기술이 깃든 검. 쥐는 것만으로 달인이 된다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_excalibur' }),
    t(['混沌', 'Chaos', '混沌', '혼돈'], ['混沌の力', 'Power of Chaos', '混沌之力', '혼돈의 힘'], ['思いえがいたものを、そのまま現実にする', 'Makes whatever he imagines real', '將心中所想直接化為現實', '떠올린 것을 그대로 현실로 만든다'], { k: 'inst', L: 9, R: 60, O: 1, I: .8, v: 'mega', sty: 'x_excalibur' }),
  ]),
  c('ギルサンダー', '', ['Gilthunder', '吉爾桑達', '길선더'], 'nanatsu', 'yellow', 92, ['魔力「雷帝」', 'Power: Thunderbolt', '魔力「雷帝」', '마력 「뇌제」'], [
    t(['魔力', 'Power', '魔力', '마력'], ['雷帝の重鎧', "Thunder Emperor's Heavy Armor", '雷帝的重鎧', '뇌제의 중갑'], ['雷を鎧としてまとう', 'Wears lightning as armor', '將雷電作為鎧甲披上', '번개를 갑옷으로 두른다'], { k: 'aura', L: 1, R: 7, D: 4.5, v: 'spin', sty: 'x_suzume' }),
    t(['魔力', 'Power', '魔力', '마력'], ['雷帝の鉄槌', 'Iron Hammer of the Thunder Emperor', '雷帝的鐵鎚', '뇌제의 철퇴'], ['雷を落として叩きつぶす', 'Brings down lightning to crush the foe', '降下雷電擊潰對手', '번개를 떨어뜨려 때려 부순다'], { k: 'rain', D: 3, R: 34, O: 1, v: 'rainfall', sty: 'x_suzume' }),
    t(['魔力', 'Power', '魔力', '마력'], ['雷帝の粛清', 'Purge of the Thunder Emperor', '雷帝的肅清', '뇌제의 숙청'], ['雷をまとった剣で、ひと息に突進する', 'Charges in a single breath with a sword wreathed in lightning', '以纏繞雷電的劍一口氣突進', '번개를 두른 검으로 단숨에 돌진한다'], { k: 'inst', L: 1, R: 50, O: 1, I: .6, v: 'thrust', sty: 'x_suzume' }),
  ], [], ['ギルサンダー']),
  // ---------- 13回目：転スラ・無職転生・ダンまち・落第騎士・ワンパンマン・ワールドトリガー ----------
  c('ハクロウ', '', ['Hakuro', '白老', '하쿠로'], 'tensura', 'white', 96, ['朧流', 'Oboro Style', '朧流', '오보로류'], [
    t(['スキル', 'Skill', '技能', '스킬'], ['天空眼', 'Heavenly Eye', '天空眼', '천공안'], ['ひたいの第三の目で、すべての動きを見切る', 'Reads every movement with the third eye on his forehead', '以額頭上的第三隻眼看穿所有動作', '이마의 제3의 눈으로 모든 움직임을 간파한다'], { k: 'slow', D: 5, S: .35, v: 'eye', sty: 'x_shuku' }),
    t(['朧流', 'Oboro Style', '朧流', '오보로류'], ['朧・流水斬', 'Oboro: Flowing Water Slash', '朧・流水斬', '오보로·유수참'], ['流れる水のような足運びで、すり抜けながら斬る', 'Cuts while slipping past with footwork like flowing water', '以流水般的步法穿梭而過並斬擊', '흐르는 물 같은 발놀림으로 빠져나가며 벤다'], { k: 'flow', L: 1, D: 4.5, v: 'ribbon', sty: 'x_shuku' }),
    t(['朧流', 'Oboro Style', '朧流', '오보로류'], ['朧・地天轟雷', 'Oboro: Chiten Gorai', '朧・地天轟雷', '오보로·지천굉뢰'], ['雷のような速さの、ひと息の居合い', 'A single-breath quick-draw as fast as lightning', '如雷電般迅速、一氣呵成的居合', '번개 같은 속도의, 단숨의 발도술'], { k: 'inst', L: 1, R: 40, O: 1, I: .6, v: 'bolt', a: 'iai', sty: 'x_shuku' }),
  ], [], ['ハクロウ']),
  c('ベニマル', '', ['Benimaru', '紅丸', '베니마루'], 'tensura', 'red', 98, ['朧流と黒炎', 'Oboro Style & Black Flame', '朧流與黑炎', '오보로류와 흑염'], [
    t(['剣技', 'Sword Technique', '劍技', '검기'], ['黒炎の太刀', 'Black Flame Blade', '黑炎太刀', '흑염의 태도'], ['黒い炎を刃にまとわせて斬る', 'Cuts with black flames wrapped around the blade', '讓黑炎纏繞刀刃斬擊', '검은 불꽃을 칼날에 둘러 벤다'], { k: 'inst', L: 1, R: 36, O: 1, v: 'arcH', sty: 'x_jao' }),
    t(['スキル', 'Skill', '技能', '스킬'], ['黒炎獄', 'Hellflare', '黑炎獄', '헬플레어'], ['黒い炎の球でつつみこみ、中のものを焼きつくす', 'Engulfs the area in a sphere of black flame and burns everything inside', '以黑炎之球包覆，燒盡其中的一切', '검은 불꽃의 구로 감싸 안의 것을 모조리 태운다'], { k: 'inst', L: 9, R: 45, O: 1, v: 'storm', sty: 'x_jao' }),
  ], [], ['ベニマル']),
  c('ヒナタ・サカグチ', 'ひなたさかぐち', ['Hinata Sakaguchi', '日向・坂口', '히나타 사카구치'], 'tensura', 'white', 99, ['聖騎士団長', 'Captain of the Holy Knights', '聖騎士團長', '성기사단장'], [
    t(['細剣', 'Rapier', '細劍', '세검'], ['七彩終焉刺突撃', 'Dead End Rainbow', '七彩終焉刺突擊', '데드 엔드 레인보우'], ['七度目の突きが当たれば、かならず終わる', 'If the seventh thrust lands, it is certain to end the fight', '只要第七次突刺命中，就必定終結', '일곱 번째 찌르기가 맞으면 반드시 끝난다'], { k: 'multi', N: 7, R: 30, v: 'arcs', sty: 'x_rapier' }),
    t(['聖剣技', 'Holy Sword Art', '聖劍技', '성검기'], ['メルトスラッシュ', 'Melt Slash', '崩魔靈子斬', '멜트 슬래시'], ['霊子をまとった剣で、何でも断ちわる', 'Cleaves anything with a sword wrapped in spirit particles', '以纏繞靈子的劍斬斷一切', '영자를 두른 검으로 무엇이든 가른다'], { k: 'inst', L: 9, R: 50, O: 1, v: 'storm', sty: 'x_excalibur' }),
    t(['神聖魔法', 'Holy Magic', '神聖魔法', '신성 마법'], ['霊子崩壊', 'Disintegration', '靈子崩壞', '디스인티그레이션'], ['光で、相手を跡形もなく消す', 'Erases the foe without a trace with light', '以光將對手消滅得不留痕跡', '빛으로 상대를 흔적도 없이 지운다'], { k: 'inst', L: 1, R: 60, O: 1, I: .8, v: 'mega', sty: 'x_excalibur' }),
  ], ['坂口日向', 'さかぐちひなた']),
  c('エリス・ボレアス・グレイラット', 'えりすぼれあすぐれいらっと', ['Eris Boreas Greyrat', '艾莉絲・伯雷亞斯・格雷拉特', '에리스 보레아스 그레이랫'], 'mushoku', 'red', 96, ['剣神流', 'Sword God Style', '劍神流', '검신류'], [
    t(['異名', 'Alias', '異名', '이명'], ['狂剣王', 'Mad Sword King', '狂劍王', '광검왕'], ['止まらずに、斬って斬って斬りつづける', 'Never stops: cuts, and cuts, and keeps on cutting', '毫不停歇地斬、斬、不斷地斬', '멈추지 않고 베고 베고 계속 벤다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_erza' }),
    t(['剣神流', 'Sword God Style', '劍神流', '검신류'], ['光の太刀', 'Sword of Light', '光之太刀', '빛의 태도'], ['光の速さにとどく、剣神流の奥義', 'The secret technique of the Sword God Style, reaching the speed of light', '達到光速的劍神流奧義', '빛의 속도에 닿는 검신류의 오의'], { k: 'inst', L: 1, R: 45, O: 1, I: .6, v: 'bolt', a: 'iai', sty: 'x_erza' }),
  ], ['エリス・グレイラット']),
  c('ギレーヌ・デドルディア', 'ぎれーぬでどるでぃあ', ['Ghislaine Dedoldia', '基列奴・泰德路迪亞', '길레느 데돌디아'], 'mushoku', 'ainezu', 95, ['剣神流 剣王', 'Sword God Style: Sword King', '劍神流 劍王', '검신류 검왕'], [
    t(['獣族', 'Beastfolk', '獸族', '수인'], ['獣の感覚', 'Beast Senses', '野獸的感官', '짐승의 감각'], ['鼻と耳で、見えない相手もとらえて斬る', 'Finds and cuts even unseen foes by scent and sound', '憑鼻子與耳朵捕捉看不見的對手並斬擊', '코와 귀로 보이지 않는 상대도 포착해 벤다'], { k: 'aura', L: 1, R: 8, D: 4, v: 'spin', sty: 'x_bugi' }),
    t(['剣神流', 'Sword God Style', '劍神流', '검신류'], ['光の太刀', 'Sword of Light', '光之太刀', '빛의 태도'], ['光の速さにとどく、剣神流の奥義', 'The secret technique of the Sword God Style, reaching the speed of light', '達到光速的劍神流奧義', '빛의 속도에 닿는 검신류의 오의'], { k: 'inst', L: 1, R: 45, O: 1, I: .6, v: 'bolt', a: 'iai', sty: 'x_bugi' }),
  ]),
  c('リュー・リオン', 'りゅーりおん', ['Ryu Lion', '琉・里昂', '류 리온'], 'danmachi', 'green', 96, ['疾風', 'Gale Wind', '疾風', '질풍'], [
    t(['木刀', 'Wooden Sword', '木刀', '목검'], ['疾風の剣', 'Blade of the Gale', '疾風之劍', '질풍의 검'], ['風のような速さで、すれ違いながら打ちこむ', 'Strikes in passing with the speed of the wind', '以風一般的速度擦身而過並擊打', '바람 같은 속도로 스쳐 지나가며 친다'], { k: 'flow', L: 1, D: 4.5, v: 'ribbon', sty: 'x_ariel' }),
    t(['魔法', 'Magic', '魔法', '마법'], ['ルミノス・ウィンド', 'Luminous Wind', '光明之風', '루미노스 윈드'], ['風をまとった光の玉を、数えきれないほど撃ち出す', 'Fires countless orbs of light wrapped in wind', '射出數不清的纏繞疾風的光球', '바람을 두른 빛의 구슬을 셀 수 없이 쏘아 낸다'], { k: 'rain', D: 4, R: 40, O: 1, v: 'rainfall', sty: 'x_ariel' }),
  ]),
  c('ベル・クラネル', 'べるくらねる', ['Bell Cranel', '貝爾・克朗尼', '벨 크라넬'], 'danmachi', 'white', 93, ['ヘスティア・ナイフ', 'Hestia Knife', '赫斯緹雅小刀', '헤스티아 나이프'], [
    t(['ナイフ', 'Knife', '小刀', '나이프'], ['二刀の連撃', 'Dual-Blade Combo', '雙刀連擊', '쌍검 연격'], ['二本のナイフで、すばやく斬りこむ', 'Cuts in fast with two knives', '以兩把小刀迅速斬入', '두 자루의 나이프로 재빨리 베어 들어간다'], { k: 'multi', N: 8, R: 24, v: 'arcs', sty: 'x_rapier' }),
    t(['魔法', 'Magic', '魔法', '마법'], ['ファイアボルト', 'Firebolt', '火焰雷電', '파이어볼트'], ['となえる言葉なしで撃てる、炎の稲妻', 'A bolt of flame lightning cast without any chant', '無需詠唱就能發射的火焰雷電', '주문 없이 쏠 수 있는 불꽃의 번개'], { k: 'inst', L: 1, R: 40, O: 1, v: 'thrust', sty: 'x_homura' }),
    t(['スキル', 'Skill', '技能', '스킬'], ['英雄願望', 'Argonaut', '英雄願望', '아르고노트'], ['力をためて、次の一撃を何倍にもする', 'Charges up to multiply the power of the next blow', '蓄力使下一擊的威力倍增', '힘을 모아 다음 일격을 몇 배로 만든다'], { k: 'inst', L: 9, R: 60, O: 1, I: .8, v: 'mega', sty: 'x_homura' }),
  ]),
  c('ステラ・ヴァーミリオン', 'すてらゔぁーみりおん', ['Stella Vermillion', '史黛菈・法米利昂', '스텔라 버밀리온'], 'rakudai', 'red', 98, ['固有霊装「妃竜の罪剣」', 'Device: Lævateinn', '固有靈裝「妃龍的罪劍」', '고유영장 「비룡의 죄검」'], [
    t(['伐刀絶技', 'Noble Art', '伐刀絕技', '벌도절기'], ['妃竜の息吹', 'Dragon Breath', '妃龍的吐息', '비룡의 숨결'], ['高熱の炎を身にまとい、近づくものを焼く', 'Wears searing flames and burns whatever comes near', '身纏高熱火焰，燒灼靠近的一切', '고열의 불꽃을 몸에 둘러 다가오는 것을 태운다'], { k: 'aura', L: 1, R: 8, D: 5, O: 1, v: 'vortex', sty: 'x_shana' }),
    t(['伐刀絶技', 'Noble Art', '伐刀絕技', '벌도절기'], ['天壌焼き焦がす竜王の焔', 'Katharterio Salamandra', '燒焦天壤的龍王之焰', '천양을 불태우는 용왕의 불꽃'], ['空までとどく巨大な炎の剣を振りおろす', 'Brings down a gigantic sword of flame that reaches the sky', '揮下直達天際的巨大火焰之劍', '하늘까지 닿는 거대한 불꽃의 검을 내리친다'], { k: 'inst', L: 9, R: 65, O: 1, I: 1, v: 'mega', sty: 'x_shana' }),
  ], ['ステラ・バーミリオン']),
  c('アトミック侍', 'あとみっくさむらい', ['Atomic Samurai', '原子武士', '아토믹 사무라이'], 'opm', 'gray', 95, ['S級ヒーローの剣', 'Sword of an S-Class Hero', 'S級英雄之劍', 'S급 히어로의 검'], [
    t(['必殺', 'Killer Move', '必殺', '필살'], ['アトミック斬', 'Atomic Slash', '原子斬', '아토믹 참'], ['相手を原子の大きさまで斬りきざむ、数えきれない斬撃', 'Countless slashes that dice the foe down to the size of atoms', '將對手切碎至原子大小的無數斬擊', '상대를 원자 크기까지 썰어 내는 셀 수 없는 참격'], { k: 'inst', L: 2, R: 40, O: 1, I: .6, v: 'claws', sty: 'x_bugi' }),
    t(['必殺', 'Killer Move', '必殺', '필살'], ['集中アトミック斬', 'Focused Atomic Slash', '集中原子斬', '집중 아토믹 참'], ['すべての斬撃を、一点に集めて撃ちこむ', 'Concentrates every slash on a single point', '將所有斬擊集中於一點打入', '모든 참격을 한 점에 모아 꽂는다'], { k: 'inst', L: 0, R: 60, O: 1, v: 'thrust', sty: 'x_bugi' }),
  ], ['アトミックサムライ', 'あとみっくざむらい']),
  c('迅悠一', 'じんゆういち', ['Yuichi Jin', '迅悠一', '진 유이치'], 'wtrigger', 'blue', 97, ['黒トリガー「風刃」', 'Black Trigger: Fujin', '黑觸發器「風刃」', '블랙 트리거 「후진」'], [
    t(['サイドエフェクト', 'Side Effect', '副作用', '사이드 이펙트'], ['未来視', 'Foresight', '未來視', '미래시'], ['目の前の人の、少し先の未来が見える', 'Sees a short way into the future of whoever is in front of him', '能看見眼前之人不久後的未來', '눈앞에 있는 사람의 조금 앞의 미래가 보인다'], { k: 'slow', D: 6, S: .35, v: 'eye', sty: 'x_kogetsu' }),
    t(['トリガー', 'Trigger', '觸發器', '트리거'], ['エスクード', 'Escudo', '盾牌', '에스쿠도'], ['地面から盾を生やして身を守る', 'Raises shields out of the ground for cover', '從地面長出盾牌保護自身', '땅에서 방패를 돋워 몸을 지킨다'], { k: 'aura', L: 1, R: 7, D: 4, G: 1, v: 'calm', sty: 'x_kogetsu' }),
    t(['風刃', 'Fujin', '風刃', '후진'], ['風刃', 'Fujin', '風刃', '후진'], ['見える範囲のどこへでも、物を伝って斬撃を走らせる', 'Sends slashes running along surfaces to anywhere in sight', '讓斬擊沿著物體奔向視線所及的任何地方', '보이는 범위 어디로든 물체를 타고 참격을 달리게 한다'], { k: 'multi', N: 11, R: 45, v: 'arcs', sty: 'x_kogetsu' }),
  ]),
  // ---------- 14回目：犬夜叉・ダイの大冒険・ベルセルク・HUNTER×HUNTER・ジョジョ・鋼の錬金術師 ----------
  c('蛮骨', 'ばんこつ', ['Bankotsu', '蠻骨', '반코츠'], 'inuyasha', 'red', 94, ['大鉾「蛮竜」', 'Great Halberd: Banryu', '大鉾「蠻龍」', '대모 「반류」'], [
    t(['蛮竜', 'Banryu', '蠻龍', '반류'], ['蛮竜閃', 'Dragon Hammer', '蠻龍閃', '만룡섬'], ['蛮竜を振り、妖気の斬撃を飛ばす', 'Swings Banryu and fires a slash of demonic energy', '揮動蠻龍，放出妖氣斬擊', '반류를 휘둘러 요기의 참격을 날린다'], { k: 'inst', L: 1, R: 40, O: 1, v: 'arcH', sty: 'x_tessaiga' }),
    t(['蛮竜', 'Banryu', '蠻龍', '반류'], ['竜雷閃', 'Dragon Thunder', '龍雷閃', '용뢰섬'], ['空に雷雲を呼び、雷を落とす', 'Calls thunderclouds overhead and brings down lightning', '喚來雷雲降下落雷', '하늘에 뇌운을 불러 번개를 떨어뜨린다'], { k: 'rain', D: 4, R: 40, O: 1, v: 'rainfall', sty: 'x_tessaiga' }),
  ]),
  c('蛇骨', 'じゃこつ', ['Jakotsu', '蛇骨', '자코츠'], 'inuyasha', 'bluepurple', 88, ['蛇骨刀', 'Jakotsuto', '蛇骨刀', '사골도'], [
    t(['蛇骨刀', 'Jakotsuto', '蛇骨刀', '사골도'], ['蛇骨刀', 'Jakotsuto', '蛇骨刀', '사골도'], ['何枚もの刃がつながり、蛇のようにうねって斬る', 'Many linked blades writhe like a snake as they cut', '數片相連的刀刃如蛇般蜿蜒斬擊', '여러 장의 칼날이 이어져 뱀처럼 굽이치며 벤다'], { k: 'multi', N: 9, R: 36, v: 'arcs', sty: 'x_zabi' }),
    t(['七人隊', 'Band of Seven', '七人隊', '칠인대'], ['切り込み隊長', 'Vanguard Captain', '突擊隊長', '돌격대장'], ['先頭に立って、楽しそうに斬りこむ', 'Takes the lead and cuts in with glee', '站在最前頭，興高采烈地斬入', '선두에 서서 즐거운 듯 베어 들어간다'], { k: 'flow', L: 1, D: 4.5, v: 'ribbon', sty: 'x_zabi' }),
  ]),
  c('バラン', '', ['Baran', '巴蘭', '바란'], 'dai', 'yellow', 100, ['真魔剛竜剣', 'True Demon Dragon Sword', '真魔剛龍劍', '진마강룡검'], [
    t(['竜闘気', 'Dragonic Aura', '龍鬥氣', '용투기'], ['竜闘気', 'Dragonic Aura', '龍鬥氣', '용투기'], ['全身をおおう、鋼よりかたい闘気', 'An aura harder than steel that covers the whole body', '覆蓋全身、比鋼鐵還硬的鬥氣', '온몸을 덮는, 강철보다 단단한 투기'], { k: 'aura', L: 1, R: 7, D: 5, G: 1, v: 'calm', sty: 'x_strash' }),
    t(['魔法剣', 'Magic Sword', '魔法劍', '마법검'], ['ギガブレイク', 'Giga Break', '終極爆破斬', '기가 브레이크'], ['最強の雷を剣に落とし、そのまま斬りつける', 'Calls the mightiest lightning onto the sword and strikes with it', '將最強的雷電降於劍上，直接斬下', '최강의 번개를 검에 떨어뜨려 그대로 벤다'], { k: 'inst', L: 1, R: 50, O: 1, I: .8, v: 'mega', sty: 'x_strash' }),
    t(['竜魔人', 'Dragonoid', '龍魔人', '용마인'], ['ドルオーラ', 'Doruora', '龍鬥氣砲', '도르오라'], ['竜の口の形に合わせた両手から、闘気の砲撃を放つ', 'Fires a cannon blast of aura from hands joined in the shape of a dragon\'s mouth', '從合成龍口形狀的雙手放出鬥氣砲擊', '용의 입 모양으로 모은 두 손에서 투기의 포격을 쏜다'], { k: 'inst', L: 9, R: 70, O: 1, I: 1, v: 'mega', sty: 'x_strash' }),
  ], [], ['バラン']),
  c('アバン＝デ＝ジニュアール3世', 'あばんでじにゅあーるさんせい', ['Avan de Zinuar III', '阿邦・德・吉紐爾三世', '아방 데 지뉴아르 3세'], 'dai', 'blue', 97, ['アバン流刀殺法', 'Avan-Style Sword Technique', '阿邦流刀殺法', '아방류 도살법'], [
    t(['アバン流刀殺法', 'Avan-Style', '阿邦流刀殺法', '아방류 도살법'], ['空裂斬', 'Air Slash', '空裂斬', '공렬참'], ['目に見えない邪悪を、光の闘気で斬る', 'Cuts unseen evil with an aura of light', '以光之鬥氣斬斷肉眼看不見的邪惡', '눈에 보이지 않는 사악함을 빛의 투기로 벤다'], { k: 'inst', L: 0, R: 45, v: 'thrust', sty: 'x_hyun' }),
    t(['奥義', 'Secret Technique', '奧義', '오의'], ['無刀陣', 'Mutojin', '無刀陣', '무도진'], ['武器を手ばなして闘気を消し、相手の最大の技にカウンターを合わせる', "Lets go of his weapon, erases his aura, and counters the foe's greatest attack", '放下武器、消去鬥氣，對準對手最強的招式反擊', '무기를 놓고 투기를 지워 상대의 최대 기술에 카운터를 맞춘다'], { k: 'aura', L: 1, R: 7, D: 4, G: 1, v: 'calm', sty: 'x_hyun' }),
    t(['必殺技', 'Finishing Move', '必殺技', '필살기'], ['アバンストラッシュ', 'Avan Strash', '阿邦斯特拉修', '아방 스트랏슈'], ['三つの技を一つにした、勇者の家庭教師の必殺技', 'The finishing move of the hero\'s tutor, combining three techniques into one', '將三招合而為一的勇者家庭教師必殺技', '세 가지 기술을 하나로 합친, 용사의 가정교사의 필살기'], { k: 'inst', L: 1, R: 50, O: 1, I: .6, v: 'thrust', sty: 'x_hyun' }),
  ], ['アバン・デ・ジニュアール3世', 'アバン＝デ＝ジニュアール三世'], ['アバン先生']),
  // ---------- ベルセルク ----------
  c('ガッツ', '', ['Guts', '格斯', '가츠'], 'berserk', 'black', 100, ['大剣「ドラゴンころし」', 'Great Sword: Dragonslayer', '大劍「斬龍劍」', '대검 「드래곤 슬레이어」'], [
    t(['ドラゴンころし', 'Dragonslayer', '斬龍劍', '드래곤 슬레이어'], ['鉄塊のひと振り', 'A Swing of the Iron Slab', '鐵塊的一揮', '쇳덩이의 한 번 휘두르기'], ['大きく、ぶ厚く、重い鉄のかたまりで、まとめて叩き斬る', 'Cuts them all down with a huge, thick, heavy slab of iron', '以巨大、厚重的鐵塊一併劈斬', '크고 두껍고 무거운 쇳덩이로 한꺼번에 내리친다'], { k: 'inst', L: 2, R: 20, O: 1, v: 'arcH', sty: 'x_kuro' }),
    t(['義手', 'Prosthetic Arm', '義手', '의수'], ['大砲', 'Arm Cannon', '義手大砲', '대포'], ['左の義手にしこんだ大砲を撃つ', 'Fires the cannon built into his left prosthetic arm', '發射裝在左手義肢裡的大砲', '왼쪽 의수에 장치한 대포를 쏜다'], { k: 'inst', L: 1, R: 40, O: 1, v: 'storm', sty: 'x_bazooka' }),
    t(['狂戦士の甲冑', 'Berserker Armor', '狂戰士甲冑', '광전사의 갑주'], ['狂戦士', 'Berserker', '狂戰士', '광전사'], ['痛みを忘れ、止まらずに斬りつづける', 'Forgets all pain and keeps cutting without stopping', '忘卻痛楚，毫不停歇地持續斬擊', '아픔을 잊고 멈추지 않고 계속 벤다'], { k: 'flow', L: 2, D: 6, O: 1, v: 'dragon', sty: 'x_kuro' }),
  ], [], ['ガッツ']),
  c('グリフィス', '', ['Griffith', '格里菲斯', '그리피스'], 'berserk', 'white', 99, ['鷹の団 団長', 'Leader of the Band of the Hawk', '鷹之團 團長', '매의 단 단장'], [
    t(['サーベル', 'Saber', '軍刀', '사브르'], ['白い鷹', 'The White Hawk', '白鷹', '하얀 매'], ['細い剣で、相手のすきを正確につらぬく', 'Pierces the foe\'s opening precisely with a slender blade', '以細劍精準地刺穿對手的破綻', '가는 검으로 상대의 빈틈을 정확히 꿰뚫는다'], { k: 'inst', L: 0, R: 40, I: .5, v: 'thrust', sty: 'x_rapier' }),
    t(['異名', 'Alias', '異名', '이명'], ['光の鷹', 'The Hawk of Light', '光之鷹', '빛의 매'], ['戦場をかけぬけ、ふれるものをすべて斬りふせる', 'Races across the battlefield and cuts down all in his path', '馳騁戰場，斬倒觸及的一切', '전장을 달려 닿는 것을 모두 베어 넘긴다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_rapier' }),
  ], [], ['グリフィス']),
  // ---------- HUNTER×HUNTER ----------
  c('ノブナガ＝ハザマ', 'のぶながはざま', ['Nobunaga Hazama', '信長・哈查馬', '노부나가 하자마'], 'hxh', 'ainezu', 92, ['居合と円', 'Iai & En', '居合與圓', '거합과 엔'], [
    t(['念', 'Nen', '念', '넨'], ['円', 'En', '圓', '엔'], ['半径4メートルの中に入ったものを、すべて感じとる', 'Senses everything that enters a radius of four meters', '感知進入半徑四公尺內的一切', '반경 4미터 안에 들어온 것을 모두 감지한다'], { k: 'aura', L: 1, R: 7, D: 4, v: 'calm', sty: 'x_bugi' }),
    t(['居合', 'Iai', '居合', '거합'], ['居合', 'Iai', '居合', '거합'], ['間合いに入ったものを、抜く手も見せずに斬る', 'Cuts whatever enters his range without even showing the draw', '進入攻擊範圍者，連拔刀的動作都看不見就被斬', '간격에 들어온 것을 뽑는 손도 보이지 않게 벤다'], { k: 'inst', L: 1, R: 16, O: 1, I: .5, v: 'bolt', a: 'iai', sty: 'x_bugi' }),
  ], ['ノブナガ・ハザマ']),
  c('フェイタン', '', ['Feitan', '飛坦', '페이탄'], 'hxh', 'black', 95, ['仕込み刀', 'Hidden Blade', '藏刀', '숨긴 칼'], [
    t(['剣技', 'Sword Technique', '劍技', '검기'], ['残像の剣', 'Afterimage Blade', '殘像之劍', '잔상의 검'], ['残像がのこる速さで斬りまわる', 'Cuts so fast he leaves afterimages', '以留下殘像的速度四處斬擊', '잔상이 남는 속도로 베고 다닌다'], { k: 'flow', L: 1, D: 4.5, v: 'ribbon', sty: 'x_kuro' }),
    t(['念能力', 'Nen Ability', '念能力', '넨 능력'], ['許されざる者', 'Pain Packer', '不可饒恕者', '페인 패커'], ['受けた痛みを力に変える鎧をまとう', 'Dons armor that turns the pain he takes into power', '披上將所受痛楚轉化為力量的鎧甲', '받은 아픔을 힘으로 바꾸는 갑옷을 두른다'], { k: 'aura', L: 1, R: 7, D: 4, G: 1, v: 'calm', sty: 'x_ryujin' }),
    t(['念能力', 'Nen Ability', '念能力', '넨 능력'], ['太陽に灼かれて', 'Rising Sun', '灼熱的太陽', '라이징 선'], ['ためた痛みを小さな太陽に変えて、あたりを焼く', 'Turns his stored pain into a small sun that scorches the area', '將累積的痛楚化為小太陽，燒灼四周', '모은 아픔을 작은 태양으로 바꿔 주위를 태운다'], { k: 'inst', L: 9, R: 45, O: 1, I: .8, v: 'storm', sty: 'x_ryujin' }),
  ], [], ['フェイタン']),
  // ---------- ジョジョ ----------
  c('ジャン＝ピエール・ポルナレフ', 'じゃんぴえーるぽるなれふ', ['Jean Pierre Polnareff', '尚・皮耶爾・波魯那雷夫', '장 피에르 폴나레프'], 'jojo', 'white', 95, ['銀の戦車', 'Silver Chariot', '銀色戰車', '실버 채리엇'], [
    t(['スタンド', 'Stand', '替身', '스탠드'], ['針串刺しの刑', 'Hora Rush', '針刺之刑', '바늘 꼬치의 형'], ['目に見えない速さの、連続の突き', 'A flurry of thrusts too fast to see', '快得看不見的連續突刺', '눈에 보이지 않는 속도의 연속 찌르기'], { k: 'multi', N: 12, R: 28, v: 'arcs', sty: 'x_shinso' }),
    t(['スタンド', 'Stand', '替身', '스탠드'], ['甲冑を脱ぐ', 'Armor Off', '卸下甲冑', '갑주 벗기'], ['甲冑をぬぎすて、残像が見えるほど速くなる', 'Sheds its armor and becomes fast enough to leave afterimages', '脫去甲冑，速度快到能看見殘像', '갑주를 벗어 던지고 잔상이 보일 만큼 빨라진다'], { k: 'flow', L: 1, D: 5, v: 'ribbon', sty: 'x_shinso' }),
    t(['スタンド', 'Stand', '替身', '스탠드'], ['剣針飛ばし', 'Blade Shot', '射出劍針', '검침 날리기'], ['剣の刃そのものを撃ち出す、とっておきの一手', 'Fires the sword blade itself: his last trick', '將劍刃本身射出的最後一招', '검의 칼날 자체를 쏘아 내는 비장의 한 수'], { k: 'inst', L: 0, R: 50, O: 1, v: 'thrust', sty: 'x_shinso' }),
  ], ['ジャン・ピエール・ポルナレフ', 'J・P・ポルナレフ'], ['ポルナレフ']),
  // ---------- 鋼の錬金術師 ----------
  c('キング・ブラッドレイ', 'きんぐぶらっどれい', ['King Bradley', '金・布拉德雷', '킹 브래드레이'], 'fma', 'black', 99, ['最強の眼', 'The Ultimate Eye', '最強之眼', '최강의 눈'], [
    t(['最強の眼', 'Ultimate Eye', '最強之眼', '최강의 눈'], ['最強の眼', 'The Ultimate Eye', '最強之眼', '최강의 눈'], ['弾の通る道まで見切る眼', 'An eye that reads even the paths of bullets', '連子彈的軌跡都能看穿的眼睛', '총알이 지나갈 길까지 간파하는 눈'], { k: 'slow', D: 6, S: .3, v: 'eye', sty: 'x_shinsen' }),
    t(['剣技', 'Sword Technique', '劍技', '검기'], ['五本の剣', 'Five Swords', '五把劍', '다섯 자루의 검'], ['腰の五本の剣を次々に抜き、戦車さえ斬る', 'Draws the five swords at his waist one after another and cuts down even a tank', '接連拔出腰間的五把劍，連戰車都能斬斷', '허리의 다섯 자루 검을 잇달아 뽑아 전차마저 벤다'], { k: 'multi', N: 10, R: 34, v: 'arcs', sty: 'x_shinsen' }),
    t(['異名', 'Alias', '異名', '이명'], ['憤怒のラース', 'Wrath', '憤怒的拉斯', '분노의 라스'], ['老いを感じさせない速さで、斬りぬける', 'Cuts through with a speed that shows no sign of age', '以不顯老態的速度斬穿而過', '늙음을 느낄 수 없는 속도로 베고 지나간다'], { k: 'flow', L: 1, D: 5, O: 1, v: 'ribbon', sty: 'x_shinsen' }),
  ]),
];

// ---------- 名前で引く ----------
// 同じ人として扱う字（旧字・異体字）。登録した名前にも、入力された名前にも同じ直しをかける
const VAR = { '齋': '斎', '斉': '斎', '齊': '斎', '劍': '剣', '劔': '剣', '剱': '剣', '國': '国', '眞': '真', '實': '実', '澤': '沢', '邊': '辺', '邉': '辺', '髙': '高', '﨑': '崎', '龍': '竜', '瀧': '滝', '櫻': '桜', '條': '条', '廣': '広', '濱': '浜', '嶋': '島', '嶌': '島', '惠': '恵', '藏': '蔵', '壽': '寿', '彌': '弥', '禮': '礼', '靜': '静', '曉': '暁', '樂': '楽', '戀': '恋', '瀨': '瀬', '姬': '姫', '黑': '黒', '德': '徳', '榮': '栄', '圓': '円', '兒': '児', '將': '将', '豐': '豊', '淺': '浅', '傳': '伝', '櫻': '桜', '鐵': '鉄', '燈': '灯', '彈': '弾', '發': '発', '續': '続', '學': '学', '氣': '気', '靈': '霊', '龜': '亀', '萬': '万', '與': '与', '禪': '禅', '眞': '真', '總': '総', '晉': '晋', '驒': '騨', '嶽': '岳', '槇': '槙', '遙': '遥', '顯': '顕', '壹': '壱', '條': '条', '彥': '彦', '薰': '薫', '緣': '縁', '鬪': '闘', '鬥': '闘', '獸': '獣', '黃': '黄', '賴': '頼', '惡': '悪', '亞': '亜', '佛': '仏', '拜': '拝', '濤': '涛', '莊': '荘', '顏': '顔', '寶': '宝', '雙': '双', '藥': '薬', '譽': '誉', '慘': '惨', '冨': '富', '墮': '堕', '壷': '壺', '繼': '継', '巖': '巌', '嶼': '嶼', '兪': '愈', '癒': '愈', '燒': '焼', '竃': '竈', '祢': '禰', '髓': '髄', '彌': '弥', '獵': '猟', '靑': '青', '淸': '清', '郞': '郎', '朗': '郎', '曾': '曽', '增': '増', '德': '徳', '隆': '隆', '晴': '晴', '神': '神', '福': '福', '海': '海', '者': '者' };
// 旧字・異体字を、ふだんの字にそろえる（鬼滅のキャラの名前を引くときにも使う。例：鬼舞辻無慘→鬼舞辻無惨、富岡→冨岡）
export const varNorm = s => String(s).replace(/[^\u0000-\u007f]/g, ch => VAR[ch] || ch);
export const okey = s => String(s).normalize('NFKC').replace(/[\s　・･=＝\-‐—.,、。「」『』'’]/g, '').toLowerCase().replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60)).replace(/[︀-️]/g, '').replace(/[^\u0000-\u007f]/g, ch => VAR[ch] || ch);
const OMAP = new Map(), OEX = new Map(), exkey = s => String(s).normalize('NFKC').replace(/[\s　・･]/g, '').toLowerCase();
for (const o of OTHERS) {
  if (o.x) for (const x of o.x) OEX.set(exkey(x), o);
  const v = o.n.concat(o.nm.slice(1)), en = o.nm[1].split(' ');
  if (en.length === 2) v.push(en[1] + ' ' + en[0]); // 英語は「名 姓」「姓 名」のどちらでも
  for (const x of v) { const k = okey(x); if (k && !OMAP.has(k)) OMAP.set(k, o); }
  for (const w of o.wz) EXTRA[w[0] + ' ' + w[1]] = w[4]; // 記録に残った技名（「見出し 技名」）を、ほかの言葉で出せるように
}
// その名前が別作品の剣士なら、その中身を返す（フルネームのときだけ）
export const otherOf = name => OEX.get(exkey(name)) || OMAP.get(okey(name)) || null;
// いちばん正式な名前（漢字のフルネーム）から引く（ランキングの表示用）
const BYN = new Map(OTHERS.map(o => [o.n0, o]));
export const otherByName = n => BYN.get(n) || null;
export const otName = (o, lang) => pick(o.nm, lang), otSch = (o, lang) => pick(o.sch, lang), otWork = (o, lang) => pick(WORKS[o.w], lang);
// ひとこと（色変わりの刀の結果に出す）
export const otWord = (o, lang) => ({ ja: `『${otWork(o, 'ja')}』の剣士。世界が違っても、刀は持ち主の強さを映す。`, en: `A sword-wielder from ${otWork(o, 'en')}. Even in another world, the blade reflects its wielder's strength.`, zh: `來自《${otWork(o, 'zh')}》的劍士。即使世界不同，刀依然映照出持有者的強大。`, ko: `『${otWork(o, 'ko')}』의 검사. 세계가 달라도 칼은 주인의 강함을 비춘다.` })[lang];
export const ETC = { hex: '#8d8f99', name: { ja: 'その他', en: 'Others', zh: '其他', ko: '기타' }, kokyu: { ja: '別作品の剣士', en: 'From other works', zh: '其他作品的劍士', ko: '다른 작품의 검사' } };
