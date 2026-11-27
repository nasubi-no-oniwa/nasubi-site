// 別作品の剣士たち（色変わりの刀・無限鬼斬の両方で使う）
// ・フルネームのときだけ反応する（漢字・ひらがな・カタカナ。英語・中国語・韓国語のフルネームも同じ人として扱う）
// ・刀の色は、その剣士の属性どおり（わかりにくい人は雰囲気）。才能は、その剣士の強さ
// ・技は原作の技。見出し・技名・説明は [日本語, 英語, 中国語（繁体字）, 韓国語] の順
// ・鬼になったら、ほかの名前と同じく「名前で決まる血鬼術」になる
import { EXTRA } from './i18n.js?v=11271730';

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
];

// ---------- 名前で引く ----------
// 同じ人として扱う字（旧字・異体字）。登録した名前にも、入力された名前にも同じ直しをかける
const VAR = { '齋': '斎', '斉': '斎', '齊': '斎', '劍': '剣', '劔': '剣', '剱': '剣', '國': '国', '眞': '真', '實': '実', '澤': '沢', '邊': '辺', '邉': '辺', '髙': '高', '﨑': '崎', '龍': '竜', '瀧': '滝', '櫻': '桜', '條': '条', '廣': '広', '濱': '浜', '嶋': '島', '嶌': '島', '惠': '恵', '藏': '蔵', '壽': '寿', '彌': '弥', '禮': '礼', '靜': '静', '曉': '暁' };
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
