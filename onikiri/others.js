// 別作品の剣士たち（色変わりの刀・無限鬼斬の両方で使う）
// ・フルネームのときだけ反応する（漢字・ひらがな・カタカナ。英語・中国語・韓国語のフルネームも同じ人として扱う）
// ・刀の色は、その剣士の属性どおり（わかりにくい人は雰囲気）。才能は、その剣士の強さ
// ・技は原作の技。見出し・技名・説明は [日本語, 英語, 中国語（繁体字）, 韓国語] の順
// ・鬼になったら、ほかの名前と同じく「名前で決まる血鬼術」になる
import { EXTRA } from './i18n.js?v=11271810';

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
};

// 作品
export const WORKS = {
  bleach: ['BLEACH', 'BLEACH', 'BLEACH 死神', '블리치'],
  onepiece: ['ONE PIECE', 'ONE PIECE', 'ONE PIECE 航海王', '원피스'],
  kenshin: ['るろうに剣心', 'Rurouni Kenshin', '神劍闖江湖', '바람의 검심'],
};
const LI = { ja: 0, en: 1, zh: 2, ko: 3 }, pick = (a, lang) => a[LI[lang]] || a[1] || a[0];

// 技1つ：t(見出し×4, 技名×4, 説明×4, 効果)
const t = (lb, nm, ds, p) => [lb[0], nm[0], ds[0], p, { en: [nm[1], ds[1], lb[1]], zh: [nm[2], ds[2], lb[2]], ko: [nm[3], ds[3], lb[3]] }];
// 剣士1人：c(漢字のフルネーム, よみ, [英語, 中国語, 韓国語], 作品, 色, 才能, 流派×4, 技, ほかの書き方)
const c = (name, yomi, nm, w, k, den, sch, wz, alt) => ({ n: [name, yomi].concat(alt || []), nm: [name].concat(nm), w, k, den, sch, wz });

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
];

// ---------- 名前で引く ----------
// 同じ人として扱う字（旧字・異体字）。登録した名前にも、入力された名前にも同じ直しをかける
const VAR = { '齋': '斎', '斉': '斎', '齊': '斎', '劍': '剣', '劔': '剣', '剱': '剣', '國': '国', '眞': '真', '實': '実', '澤': '沢', '邊': '辺', '邉': '辺', '髙': '高', '﨑': '崎', '龍': '竜', '瀧': '滝', '櫻': '桜', '條': '条', '廣': '広', '濱': '浜', '嶋': '島', '嶌': '島', '惠': '恵', '藏': '蔵', '壽': '寿', '彌': '弥', '禮': '礼', '靜': '静', '曉': '暁', '樂': '楽', '戀': '恋', '瀨': '瀬', '姬': '姫', '黑': '黒', '德': '徳', '榮': '栄', '圓': '円', '兒': '児', '將': '将', '豐': '豊', '淺': '浅', '傳': '伝', '櫻': '桜', '鐵': '鉄', '燈': '灯', '彈': '弾', '發': '発', '續': '続', '學': '学', '氣': '気', '靈': '霊', '龜': '亀', '萬': '万', '與': '与', '禪': '禅', '眞': '真' };
export const okey = s => String(s).normalize('NFKC').replace(/[\s　・･=＝\-‐—.,、。「」『』'’]/g, '').toLowerCase().replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60)).replace(/[︀-️]/g, '').replace(/[^\u0000-\u007f]/g, ch => VAR[ch] || ch);
const OMAP = new Map();
for (const o of OTHERS) {
  const v = o.n.concat(o.nm.slice(1)), en = o.nm[1].split(' ');
  if (en.length === 2) v.push(en[1] + ' ' + en[0]); // 英語は「名 姓」「姓 名」のどちらでも
  for (const x of v) { const k = okey(x); if (k && !OMAP.has(k)) OMAP.set(k, o); }
  for (const w of o.wz) EXTRA[w[0] + ' ' + w[1]] = w[4]; // 記録に残った技名（「見出し 技名」）を、ほかの言葉で出せるように
}
// その名前が別作品の剣士なら、その中身を返す（フルネームのときだけ）
export const otherOf = name => OMAP.get(okey(name)) || null;
// いちばん正式な名前（漢字のフルネーム）から引く（ランキングの表示用）
const BYN = new Map(OTHERS.map(o => [o.n[0], o]));
export const otherByName = n => BYN.get(n) || null;
export const otName = (o, lang) => pick(o.nm, lang), otSch = (o, lang) => pick(o.sch, lang), otWork = (o, lang) => pick(WORKS[o.w], lang);
// ひとこと（色変わりの刀の結果に出す）
export const otWord = (o, lang) => ({ ja: `『${otWork(o, 'ja')}』の剣士。世界が違っても、刀は持ち主の強さを映す。`, en: `A sword-wielder from ${otWork(o, 'en')}. Even in another world, the blade reflects its wielder's strength.`, zh: `來自《${otWork(o, 'zh')}》的劍士。即使世界不同，刀依然映照出持有者的強大。`, ko: `『${otWork(o, 'ko')}』의 검사. 세계가 달라도 칼은 주인의 강함을 비춘다.` })[lang];
export const ETC = { hex: '#8d8f99', name: { ja: 'その他', en: 'Others', zh: '其他', ko: '기타' }, kokyu: { ja: '別作品の剣士', en: 'From other works', zh: '其他作品的劍士', ko: '다른 작품의 검사' } };
