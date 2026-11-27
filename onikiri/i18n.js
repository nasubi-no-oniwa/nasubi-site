// 技の言葉（英語・中国語（繁体字）・韓国語）。日本語は waza.js / oni.js に書いてあるものがそのまま出る。
// 公式の訳がある技はそれに合わせ、ないものは意味が通る訳にしてある。並びは waza.js と同じ。
import { WAZA } from './waza.js?v=11272332';

// ---------- 呼吸の型：[技名, 原作の動き] ----------
export const WN = {
  en: {
    blue: [['Water Surface Slash', 'Crosses the arms and cuts horizontally'], ['Water Wheel', 'Spins vertically while cutting'], ['Flowing Dance', 'Cuts while moving with flowing footwork'], ['Striking Tide', 'A smooth chain of consecutive cuts'], ['Blessed Rain After the Drought', 'A merciful stroke that gives no pain'], ['Whirlpool', 'Twists the upper and lower body to raise a vortex'], ['Drop Ripple Thrust', 'The fastest thrust of Water Breathing'], ['Waterfall Basin', 'Slams down from above'], ['Splashing Water Flow, Turbulent', 'Minimizes landing time and moves in every direction'], ['Constant Flux', 'Spins like a dragon in a chain of attacks, growing stronger with each turn'], ['Dead Calm', 'Nullifies everything that enters its range']],
    red: [['Unknowing Fire', 'Charges in at once for a diagonal slash'], ['Rising Scorching Sun', 'An upward arcing slash'], ['Blazing Universe', 'A downward arcing slash'], ['Blooming Flame Undulation', 'Sweeps the front with swirling flames and blocks attacks'], ['Flame Tiger', 'Pounces like a tiger'], ['Rengoku', 'The ultimate technique: an all-out charge that gouges wide']],
    yellow: [['Thunderclap and Flash', 'A godspeed quick-draw'], ['Rice Spirit', 'Five strikes in an instant'], ['Thunder Swarm', 'Circles the enemy while cutting'], ['Distant Thunder', 'A slash that reaches far'], ['Heat Lightning', 'An upward slash'], ['Rumble and Flash', 'Unleashes countless slashes all around'], ['Honoikazuchi no Kami', 'The godspeed strike Zenitsu created himself']],
    green: [['Dust Whirlwind Cutter', 'Charges like a tornado, gouging the ground'], ['Claws-Purifying Wind', 'Four claw-like slashes'], ['Clean Storm Wind Tree', 'Slashes swirling around the body'], ['Rising Dust Storm', 'Consecutive slashes blowing upward'], ['Cold Mountain Wind', 'Spins and blows down from above'], ['Black Wind Mountain Mist', 'Slashes upward from below'], ['Gale, Sudden Gusts', 'Spins in the air and sends out many slashes'], ['Primary Gale Slash', 'Cuts in a vortex while rushing past'], ['Idaten Typhoon', 'A huge slash delivered upside down from the sky']],
    gray: [['Serpentinite Bipolar', 'Throws the flail and the axe at once'], ['Upper Smash', 'Steps on the chain to drop the flail from overhead'], ['Stone Skin', 'Swings the chain around to guard'], ['Volcanic Rock, Rapid Conquest', 'Swings axe and flail over a wide area'], ['Arcs of Justice', 'Drops the flail and axe one after another from the sky']],
    purple: [['Dark Moon, Evening Palace', 'A horizontal quick-draw slash'], ['Pearl Flower Moongazing', 'Three rising slashes'], ['Loathsome Moon, Chains', 'Two wide horizontal slashes'], ['Moon Spirit Calamitous Eddy', 'A vortex of slashes without swinging the blade'], ['Perpetual Night, Lonely Moon - Incessant', 'Spreads countless vertical slashes'], ['Mirror of Misfortune, Moonlit', 'Five slashes run far along the ground'], ['Moon-Dragon Ringtail', 'A gigantic horizontal slash'], ['Waning Moonswaths', 'Slashes rain down from above'], ['Drilling Slashes, Moon Through Bamboo Leaves', 'A triple slash like a spinning saw'], ['Catastrophe, Tenman Crescent Moon', 'Giant slashes layered like a vortex'], ['Moonbow, Half Moon', 'Six slashes fall from above and gouge the ground']],
    white: [['Low Clouds, Distant Haze', 'A straight thrust'], ['Eight-Layered Mist', 'Layer upon layer of strikes'], ['Scattering Mist Splash', 'Spins to sweep all around'], ['Shifting Flow Slash', 'Slides in with a rising slash'], ['Sea of Clouds and Haze', 'Advances at high speed with fine strikes'], ['Lunar Dispersing Mist', 'A wide slash during a somersault'], ['Obscuring Clouds', 'Vanishes with changes of pace to confuse (created by Muichiro)']],
    pink: [['Shivers of First Love', 'Cuts many times at once with a whip-like blade'], ['Love Pangs', 'The winding blade circles around to cut'], ['Lovely Kitty Paw Shower', 'Leaps and cuts down incoming attacks'], ['Swaying Love, Wildclaw', 'Wild wide slashes during a somersault'], ['Cat-Legged Winds of Love', 'Spins and catches everything in the cut']],
    sakura: [['Honorable Shadow Plum', 'Consecutive slashes surrounding the body'], ['Crimson Hanagoromo', 'A slash drawn in a large circle'], ['Peonies of Futility', 'Nine consecutive strikes'], ['Whirling Peach', 'Twists the body in mid-air to cut'], ['Equinoctial Vermilion Eye', 'Raises eyesight to its limit so foes look slow']],
    bluepurple: [['Winding Serpent Slash', 'Closes the distance and sweeps sideways'], ['Venom Fangs of the Narrow Head', 'Slips behind and cuts'], ['Coil Choke', 'Surrounds like a coil and cuts'], ['Twin-Headed Reptile', 'Pinches from both sides like a two-headed snake'], ['Slithering Serpent', 'Winds widely while cutting forward']],
    fuji: [['Caprice', 'Thrusts again and again as if dancing'], ['True Flutter', 'A straight high-speed thrust'], ['Compound Eye Hexagon', 'Six consecutive thrusts'], ['Hundred-Legged Zigzag', 'Thrusts after zigzag footwork in every direction']],
    orange: [['Roar', 'Slams both blades down to explode'], ['Constant Resounding Slashes', 'Spins both blades to block with a wall of explosions'], ['String Performance', 'Charges with explosions while spinning the blades']],
    ainezu: [['Pierce', 'Stabs with both blades'], ['Slice', 'Crosses both blades to cut'], ['Devour', 'Cuts outward from both sides'], ["Slice 'n' Dice", 'Cuts finely over and over'], ['Crazy Cutting', 'Cuts in every direction'], ['Palisade Bite', 'Pinches and saws through'], ['Spatial Awareness', 'Senses enemies around through the skin'], ['Explosive Rush', 'Drops all guard and charges straight'], ['Extending Bendy Slash', 'Dislocates the joints to stretch the arm and cut far away'], ['Whirling Fangs', 'Spins both blades as a shield']],
    black: [['Dance', 'A single circular stroke'], ['Clear Blue Sky', 'A vertical circular slash'], ['Raging Sun', 'Two horizontal slashes, left and right'], ['Burning Bones, Summer Sun', 'Sweeps the front with swirling flames'], ['Sunflower Thrust', 'A thrust toward the sky'], ['Solar Heat Haze Dragon, Head Dance', 'Winds through like a dragon, cutting in succession'], ['Setting Sun Transformation', 'A horizontal slash during a somersault'], ['Solar Heat Haze', 'The blade wavers and its reach extends'], ['Beneficent Radiance', 'Charges in a spiral'], ['Fire Wheel', 'Leaps over the foe and cuts in a vertical spin'], ['Fake Rainbow', 'Dodges with high-speed spins, leaving afterimages'], ['Flame Dance', 'Two consecutive slashes'], ['(Linking the first twelve)', 'Connects the twelve forms and repeats them']],
  },
  zh: {
    blue: [['水面斬擊', '雙臂交叉後水平斬擊'], ['水車', '縱向旋轉斬擊'], ['流流舞動', '以流水般的步法邊移動邊斬'], ['擊打潮', '毫無停滯地連續斬擊'], ['乾天的慈雨', '不帶來痛苦的慈悲一刀'], ['扭轉漩渦', '扭轉上半身與下半身捲起漩渦'], ['雫波紋突刺', '水之呼吸中最快的突刺'], ['瀧壺', '由上往下猛力劈落'], ['水流飛沫・亂', '將落地時間縮到最短，縱橫移動'], ['生生流轉', '如龍一般旋轉連擊，越轉越強'], ['凪', '將進入攻擊範圍的一切化為無']],
    red: [['不知火', '一口氣踏進並斜斬'], ['上升炎天', '由下往上畫弧上斬'], ['氣炎萬象', '由上往下畫弧劈下'], ['盛炎的捲曲', '以漩渦般的火焰橫掃前方並擋下攻擊'], ['炎虎', '如猛虎般撲上'], ['煉獄', '傾盡全力突進、大範圍剜削的奧義']],
    yellow: [['霹靂一閃', '神速的拔刀斬'], ['稻魂', '一瞬間五連擊'], ['聚蚊成雷', '繞著對手旋轉斬擊'], ['遠雷', '能斬到遠處的斬擊'], ['熱界雷', '由下往上斬'], ['電轟雷轟', '向四周放出無數斬擊'], ['火雷神', '善逸自創的神速一擊']],
    green: [['塵旋風・削斬', '如龍捲風般削著地面突進'], ['爪爪・科戶風', '如爪般的四道斬擊'], ['晴嵐風樹', '在自身周圍捲起漩渦斬擊'], ['昇上砂塵嵐', '由下往上吹起的連續斬'], ['寒風颪', '從上方旋轉吹下'], ['黑風煙嵐', '由下往上斬'], ['勁風・天狗風', '在空中旋轉並放出多道斬擊'], ['初烈風斬', '擦身而過時捲起漩渦斬擊'], ['韋馱天颱風', '從高空倒立放出巨大斬擊']],
    gray: [['蛇紋岩・雙極', '同時擲出鐵球與斧'], ['天面碎', '踩住鎖鏈，讓鐵球從頭頂落下'], ['岩軀之膚', '揮舞鎖鏈守住四周'], ['流紋岩・速征', '大範圍揮舞斧與鐵球'], ['瓦輪刑部', '從高空接連砸下鐵球與斧']],
    purple: [['闇月・宵之宮', '拔刀橫一閃'], ['珠華弄月', '三連上斬'], ['厭忌月・銷蝕', '橫向兩連的大範圍斬擊'], ['月魄災渦', '不揮刀便向四周放出漩渦斬擊'], ['常夜孤月・無間', '展開無數縱向斬擊'], ['厄鏡・月映', '五道貼地斬擊奔向遠處'], ['月龍輪尾', '巨大的橫一文字'], ['降月・連面', '斬擊由上方傾注而下'], ['穿面斬・蘿月', '如迴轉鋸般的三重斬擊'], ['兇變・天滿纖月', '如漩渦般層疊的巨大斬擊'], ['月虹・片割月', '六道斬擊自上落下並剜削地面']],
    white: [['垂天遠霞', '筆直的突刺'], ['八重霞', '層層疊疊的連擊'], ['霞散飛沫', '旋轉橫掃四周'], ['移流斬', '滑步切入並上斬'], ['霞雲之海', '一邊細密連擊一邊高速前進'], ['月之霞消', '後空翻的同時大範圍斬擊'], ['朧', '以緩急變化隱去身影迷惑對手（無一郎自創之型）']],
    pink: [['初戀的戰慄', '以柔韌的刀一口氣斬擊多次'], ['懊惱巡迴之戀', '蜿蜒的刀繞著四周斬擊'], ['戀貓時雨', '跳躍著連同飛來的攻擊一起斬斷'], ['搖擺不定的戀情・亂爪', '後空翻的同時大範圍亂斬'], ['貓足戀風', '旋轉著捲入並斬擊']],
    sakura: [['御影梅', '環繞自身的連續斬'], ['紅花衣', '畫出大圓斬擊'], ['徒之芍藥', '九連擊'], ['渦桃', '在空中扭轉身體斬擊'], ['彼岸朱眼', '將眼力提升到極限，使對手看起來變慢']],
    bluepurple: [['委蛇斬', '拉近距離後橫掃'], ['狹頭之毒牙', '繞到背後斬擊'], ['塒締', '如盤踞般包圍後斬擊'], ['頸蛇雙生', '如雙頭蛇般從左右夾擊'], ['蜿蜿長蛇', '大幅蜿蜒著大範圍斬進']],
    fuji: [['戲弄', '如舞蹈般反覆突刺'], ['真靡', '一直線的高速突刺'], ['複眼六角', '六連突刺'], ['百足蛇腹', '向四面八方蜿蜒踏步後突刺']],
    orange: [['轟', '雙刀砸下引發爆炸'], ['響斬無間', '旋轉雙刀，以爆炸之壁防禦'], ['鳴弦奏奏', '一邊旋轉刀一邊伴隨爆炸突進']],
    ainezu: [['穿透刺擊', '以雙刀刺穿'], ['撕裂', '雙刀交叉斬擊'], ['咬裂', '由左右向外斬開'], ['碎裂斬', '細碎地反覆斬擊'], ['狂裂', '向四面八方斬擊'], ['亂杭咬', '如鋸子般夾住斬斷'], ['空間識覺', '以皮膚的感覺得知周圍敵人的位置'], ['爆裂猛進', '捨棄防守筆直突進'], ['伸・蜿蜒裂', '卸下關節伸長手臂，斬向遠處'], ['圓轉旋牙', '旋轉雙刀當作盾']],
    black: [['圓舞', '畫出圓形的一刀'], ['碧羅之天', '縱向畫圓斬擊'], ['烈日紅鏡', '左右兩次水平斬'], ['灼骨炎陽', '以漩渦般的火焰橫掃前方'], ['陽華突', '朝向天空的突刺'], ['日暈之龍・頭舞', '如龍般蜿蜒奔馳，連續斬擊'], ['斜陽轉身', '後空翻後水平斬擊'], ['飛輪陽炎', '刀刃搖曳，攻擊距離延伸'], ['輝輝恩光', '捲起漩渦突進'], ['火車', '躍過對手，縱向旋轉斬擊'], ['幻日虹', '以高速旋轉與扭身留下殘像閃避'], ['炎舞', '二連斬'], ['（連接壹至拾貳）', '將十二個型相連並反覆施展']],
  },
  ko: {
    blue: [['수면 베기', '팔을 교차해 수평으로 벤다'], ['물레방아', '세로로 회전하며 벤다'], ['유류무', '흐르는 듯한 발놀림으로 움직이며 벤다'], ['들이치는 조수', '막힘 없이 연속으로 벤다'], ['간천의 자우', '고통을 주지 않는 자비의 한 칼'], ['비틀린 소용돌이', '상반신과 하반신을 비틀어 소용돌이를 일으킨다'], ['물방울 파문 찌르기', '물의 호흡에서 가장 빠른 찌르기'], ['용소', '위에서 아래로 내리친다'], ['수류 물보라·난', '착지 시간을 최소로 줄이고 종횡으로 움직인다'], ['생생유전', '용처럼 회전하며 연격. 돌수록 강해진다'], ['잔잔한 물결', '간격 안에 들어온 모든 것을 무로 돌린다']],
    red: [['부지화', '단숨에 파고들어 비스듬히 벤다'], ['상승 염천', '아래에서 위로 호를 그리며 올려 벤다'], ['기염만상', '위에서 아래로 호를 그리며 내리친다'], ['성염의 굽이침', '소용돌이치는 화염으로 앞을 쓸고 공격을 막는다'], ['염호', '호랑이처럼 달려든다'], ['연옥', '온 힘을 다한 돌진으로 넓게 도려내는 오의']],
    yellow: [['벽력일섬', '신속의 발도'], ['도혼', '한순간에 5연격'], ['취문성뢰', '상대의 주위를 돌며 벤다'], ['원뢰', '멀리까지 닿는 참격'], ['열계뢰', '아래에서 올려 벤다'], ['전굉뇌굉', '주위에 무수한 참격을 날린다'], ['화뢰신', '젠이츠가 만들어 낸 신속의 일격']],
    green: [['진선풍·깎아내기', '땅을 깎아내며 회오리처럼 돌진한다'], ['손톱·과호풍', '손톱 같은 네 줄기 참격'], ['청람풍수', '자신의 주위에 소용돌이치는 참격'], ['승상사진람', '아래에서 치솟는 연속 베기'], ['초겨울 내리바람', '위에서 회전하며 내리친다'], ['흑풍연람', '아래에서 위로 올려 벤다'], ['경풍·천구풍', '공중에서 회전하며 참격을 여럿 날린다'], ['초열풍 베기', '스쳐 지나가며 소용돌이쳐 벤다'], ['위타천 태풍', '상공에서 거꾸로 선 채 큰 참격을 날린다']],
    gray: [['사문암·쌍극', '철구와 도끼를 동시에 던진다'], ['천면 부수기', '사슬을 밟아 철구를 머리 위에서 떨어뜨린다'], ['암구의 피부', '사슬을 휘둘러 주위를 지킨다'], ['유문암·속정', '도끼와 철구를 넓은 범위로 휘두른다'], ['와륜형부', '상공에서 철구와 도끼를 잇달아 떨어뜨린다']],
    purple: [['어둠달·저녁의 궁', '발도의 가로 일섬'], ['주화의 농월', '3연속 올려 베기'], ['염기월·쇄', '가로로 두 번, 넓은 참격'], ['월백재와', '칼을 휘두르지 않고 주위에 소용돌이 참격'], ['상야고월·무간', '세로로 무수한 참격을 펼친다'], ['액경·달비침', '땅을 기는 다섯 줄기 참격이 멀리 달린다'], ['월룡윤미', '거대한 가로 일자 베기'], ['내리는 달·연면', '위에서 참격이 쏟아진다'], ['천면참·나월', '회전 톱 같은 삼중 참격'], ['흉변·천만섬월', '소용돌이처럼 겹치는 거대한 참격'], ['월홍·조각달', '위에서 여섯 줄기 참격이 내려와 땅을 도려낸다']],
    white: [['수천원하', '곧은 찌르기'], ['팔중하', '겹겹이 쌓는 연격'], ['하산의 물보라', '회전하며 주위를 쓸어 낸다'], ['이류 베기', '미끄러져 들어가며 올려 벤다'], ['하운의 바다', '잘게 연격하며 고속으로 나아간다'], ['달의 하소', '공중제비하며 넓게 벤다'], ['으스름', '완급으로 모습을 감춰 현혹한다(무이치로가 만든 형)']],
    pink: [['첫사랑의 떨림', '휘어지는 칼로 단숨에 여러 번 벤다'], ['번뇌를 맴도는 사랑', '굽이치는 칼로 주위를 돌며 벤다'], ['사랑 고양이 소나기', '뛰어오르며 날아오는 공격째 벤다'], ['흔들리는 연정·난조', '공중제비하며 넓게 난도질한다'], ['고양이 발 사랑바람', '회전하며 휘감아 벤다']],
    sakura: [['미영매', '자신의 주위를 감싸는 연속 베기'], ['홍화의', '크게 원을 그리며 벤다'], ['덧없는 작약', '9연격'], ['와도', '공중에서 몸을 비틀어 벤다'], ['피안주안', '눈의 힘을 극한까지 끌어올려 상대가 느리게 보인다']],
    bluepurple: [['위사 베기', '간격을 좁혀 가로로 휩쓴다'], ['협두의 독아', '등 뒤로 돌아 벤다'], ['똬리 조르기', '똬리처럼 에워싸고 벤다'], ['경사쌍생', '머리 둘 달린 뱀처럼 좌우에서 조인다'], ['완완장사', '크게 굽이치며 넓게 베어 나아간다']],
    fuji: [['희롱', '춤추듯 여러 번 찌른다'], ['진미', '일직선의 고속 찌르기'], ['복안육각', '6연속 찌르기'], ['백족사복', '사방팔방으로 굽이치는 발놀림에서 찌른다']],
    orange: [['굉', '쌍도를 내리쳐 폭발시킨다'], ['향참무간', '쌍도를 돌려 폭발의 벽으로 막는다'], ['명현주주', '칼을 돌리며 폭발과 함께 돌진한다']],
    ainezu: [['꿰뚫어 찌르기', '쌍도로 찌른다'], ['베어 찢기', '쌍도를 교차해 벤다'], ['물어 찢기', '좌우에서 바깥으로 베어 연다'], ['잘게 찢기', '잘게 여러 번 벤다'], ['미친 듯 찢기', '사방팔방을 벤다'], ['난항 물기', '톱처럼 물고 벤다'], ['공간식각', '피부의 감각으로 주위 적의 위치를 안다'], ['폭렬맹진', '방어를 버리고 곧장 돌진한다'], ['신·굽이쳐 찢기', '관절을 빼 팔을 늘여 멀리 벤다'], ['원전선아', '쌍도를 돌려 방패로 삼는다']],
    black: [['원무', '원을 그리는 한 칼'], ['벽라의 하늘', '세로로 원을 그리며 벤다'], ['열일홍경', '좌우로 두 번의 수평 베기'], ['작골염양', '소용돌이치는 화염으로 앞을 쓸어 낸다'], ['양화돌', '하늘을 향한 찌르기'], ['일훈의 용·머리춤', '용처럼 굽이치며 달려 연이어 벤다'], ['사양전신', '공중제비해 수평으로 벤다'], ['비륜양염', '칼날이 흔들리며 간격이 늘어난다'], ['휘휘은광', '소용돌이치며 돌진한다'], ['화차', '상대를 뛰어넘어 세로로 돌며 벤다'], ['환일홍', '고속 회전과 비틀기로 잔상을 남기고 피한다'], ['염무', '2연속 베기'], ['(제1~제12를 잇는다)', '열두 가지 형을 이어 되풀이한다']],
  },
};

// ---------- 原作の血鬼術：日本語の技名 → { en:[技名, 説明], zh:…, ko:… } ----------
const A3 = (en, ed, zh, zd, ko, kd) => ({ en: [en, ed], zh: [zh, zd], ko: [ko, kd] });
export const AN = {
  '黒血枳棘': A3('Black Blood, Brambles', 'Scatters barbed-wire thorns made of blood far and wide', '黑血枳棘', '將血化成有如刺鐵絲的棘刺，大範圍撒出', '흑혈지극', '피로 된 철조망 같은 가시를 넓게 흩뿌린다'),
  '管と触手': A3('Tubes and Tentacles', 'Whips around the tubes growing from its arms and back', '管與觸手', '將手臂與背上長出的管子如鞭子般揮舞', '관과 촉수', '팔과 등에서 난 관을 채찍처럼 휘두른다'),
  '衝撃波': A3('Shockwave', 'Blows away everything in all directions', '衝擊波', '將四面八方全部震飛', '충격파', '사방을 날려 버린다'),
  '蓮葉氷': A3('Frozen Lotus', 'Swings the fans to create lotus-shaped ice', '蓮葉冰', '揮動扇子生出蓮花形的冰', '연잎 얼음', '부채를 휘둘러 연꽃 모양의 얼음을 만든다'),
  '枯園垂り': A3('Barren Hanging Garden', 'Slashes in succession with fans wrapped in cold air', '枯園垂', '以纏繞寒氣的扇子接連斬擊', '마른 정원 드리우기', '냉기를 두른 부채로 연이어 벤다'),
  '凍て曇': A3('Freezing Clouds', 'Spreads a freezing mist that dulls movement', '凍雲', '散開凍結的霧氣使動作遲鈍', '얼어붙는 구름', '얼어붙는 안개를 퍼뜨려 움직임을 둔하게 한다'),
  '蔓蓮華': A3('Lotus Vines', 'Stretches out vines of ice to capture', '蔓蓮華', '伸出冰之藤蔓加以捕捉', '덩굴 연화', '얼음 덩굴을 뻗어 붙잡는다'),
  '寒烈の白姫': A3('Cold White Princesses', 'Ice maidens breathe out air that freezes a wide area', '寒烈的白姬', '冰之巫女吹出凍結大範圍的氣息', '한렬의 백희', '얼음 무녀가 넓은 범위를 얼리는 숨을 내쉰다'),
  '冬ざれ氷柱': A3('Wintry Icicles', 'Drops giant icicles from overhead', '冬日冰柱', '從頭頂降下巨大的冰柱', '겨울 고드름', '머리 위에서 거대한 고드름을 떨어뜨린다'),
  '散り蓮華': A3('Scattering Lotuses', 'Sends fine petals of ice dancing', '散落蓮華', '讓細小的冰花瓣飛舞', '흩날리는 연화', '잘게 부서진 얼음 꽃잎을 흩날린다'),
  '結晶ノ御子': A3('Crystalline Divine Child', 'Creates an ice doll that uses the same techniques', '結晶之御子', '造出能使用相同招式的冰人偶', '결정의 아이', '자신과 같은 기술을 쓰는 얼음 인형을 만든다'),
  '霧氷・睡蓮菩薩': A3('Rime - Water Lily Bodhisattva', 'Crushes with a giant bodhisattva statue of ice', '霧冰・睡蓮菩薩', '以巨大的冰菩薩像壓垮', '무빙·수련보살', '거대한 얼음 보살상으로 내리찍는다'),
  '術式展開 破壊殺・羅針': A3('Technique Development: Destructive Death - Compass Needle', 'Reads fighting spirit with a snowflake formation and sees through everything', '術式展開 破壞殺・羅針', '以雪花結晶之陣讀取鬥氣，看穿一切', '술식 전개 파괴살·나침', '눈 결정의 진으로 투기를 읽어 모든 것을 간파한다'),
  '破壊殺・空式': A3('Destructive Death: Air Type', 'Punches the air to send a shock at distant foes', '破壞殺・空式', '以拳擊打空氣，將衝擊送向遠處的對手', '파괴살·공식', '주먹으로 허공을 쳐 떨어진 상대에게 충격을 날린다'),
  '破壊殺・乱式': A3('Destructive Death: Disorder', 'A flurry of punches', '破壞殺・亂式', '拳頭的亂打', '파괴살·난식', '주먹의 난타'),
  '破壊殺・滅式': A3('Destructive Death: Annihilation Type', 'A charging blow with full force', '破壞殺・滅式', '全力踏進的突進一擊', '파괴살·멸식', '온 힘으로 파고드는 돌진의 일격'),
  '破壊殺・脚式 冠先割': A3('Destructive Death: Leg Type - Crown Splitter', 'Kicks upward from below', '破壞殺・腳式 冠先割', '由下往上踢', '파괴살·각식 관선할', '아래에서 위로 차올린다'),
  '破壊殺・脚式 流閃群光': A3('Destructive Death: Leg Type - Rushing Flashes of Light', 'A rapid series of kicks', '破壞殺・腳式 流閃群光', '接連不斷的踢擊', '파괴살·각식 유섬군광', '연이은 발차기'),
  '破壊殺・脚式 飛遊星千輪': A3('Destructive Death: Leg Type - Flying Planet Thousand Wheels', 'Kicks upward while spinning', '破壞殺・腳式 飛遊星千輪', '一邊旋轉一邊上踢', '파괴살·각식 비유성천륜', '회전하며 차올린다'),
  '破壊殺・砕式 万葉閃柳': A3('Destructive Death: Crush Type - Ten Thousand Leaves Flashing Willow', 'Smashes and splits the ground', '破壞殺・碎式 萬葉閃柳', '擊碎並劈裂地面', '파괴살·쇄식 만엽섬류', '땅을 내리쳐 쪼갠다'),
  '破壊殺・鬼芯八重芯': A3('Destructive Death: Eight-Layered Demon Core', 'A flurry of four blows from each side', '破壞殺・鬼芯八重芯', '左右各四發的亂打', '파괴살·귀심팔중심', '좌우 네 발씩의 난타'),
  '破壊殺・終式 青銀乱残光': A3('Destructive Death: Final Type - Blue Silver Chaotic Afterglow', 'A hundred blows in every direction almost at once', '破壞殺・終式 青銀亂殘光', '幾乎同時向全方位打出百發', '파괴살·종식 청은난잔광', '모든 방향으로 거의 동시에 백 발을 꽂는다'),
  '積怒の雷': A3("Sekido's Lightning", 'Strikes the staff to call down lightning', '積怒之雷', '敲響錫杖降下落雷', '세키도의 번개', '석장을 울려 번개를 떨어뜨린다'),
  '可楽の団扇': A3("Karaku's Fan", 'Raises a gust with a leaf fan and blows foes away', '可樂的團扇', '以葉扇掀起突風吹飛對手', '카라쿠의 부채', '잎 부채로 돌풍을 일으켜 날려 버린다'),
  '空喜の超音波': A3("Urogi's Sonic Scream", 'Fires sound waves from the mouth', '空喜的超音波', '從口中放出音波', '우로기의 초음파', '입에서 음파를 쏜다'),
  '激涙刺突': A3('Violent Tear Thrust', "Aizetsu's five spear thrusts", '激淚刺突', '哀絕之槍的五連突刺', '격루자돌', '아이제츠의 창 5연속 찌르기'),
  '狂鳴雷殺': A3('Frenzied Thunder Kill', 'Zohakuten. Fires lightning and sound waves together', '狂鳴雷殺', '憎珀天。將雷與音波合而放出', '광명뇌살', '조하쿠텐. 번개와 음파를 합쳐 쏜다'),
  '狂圧鳴波': A3('Frenzied Pressure Sound Wave', 'Zohakuten. A violent sound wave from the mouth', '狂壓鳴波', '憎珀天。從口中放出強烈的音波', '광압명파', '조하쿠텐. 입에서 강렬한 음파를 쏜다'),
  '無間業樹': A3('Unending Karmic Trees', 'Zohakuten. Grows wooden dragons one after another to attack', '無間業樹', '憎珀天。接連長出木龍襲擊', '무간업수', '조하쿠텐. 나무 용을 잇달아 돋게 해 덮친다'),
  '千本針 魚殺': A3('Thousand Needle Fish Kill', 'Goldfish from the pots spit poison needles', '千本針 魚殺', '從壺中出現的金魚吐出毒針', '천본침 어살', '항아리에서 나온 금붕어가 독침을 뱉는다'),
  '水獄鉢': A3('Water Prison Pot', 'Traps the foe in a pot of water so they cannot breathe', '水獄缽', '關進水之壺中使其無法呼吸', '수옥발', '물의 항아리에 가둬 숨을 못 쉬게 한다'),
  '蛸壺地獄': A3('Octopus Vase Hell', 'Giant octopus arms burst out of the pot', '蛸壺地獄', '巨大的章魚腳從壺中飛出', '문어항아리 지옥', '항아리에서 거대한 문어 다리가 튀어나온다'),
  '一万滑空粘魚': A3('Ten Thousand Gliding Slime Fish', 'Sends ten thousand fish flying to devour', '一萬滑空黏魚', '放出一萬條魚飛去啃食', '일만 활공 점어', '물고기 만 마리를 날려 뜯어먹게 한다'),
  '陣殺魚鱗': A3('Killer Fish Scales', 'True form. Bounces in every direction on its scales', '陣殺魚鱗', '真身。以鱗片縱橫彈跳', '진살어린', '진짜 모습. 비늘로 종횡으로 튀어 다닌다'),
  '神の手': A3('Hand of God', 'True form. A fist that turns whatever it touches into fish', '神之手', '真身。將碰到的東西變成魚的拳頭', '신의 손', '진짜 모습. 닿은 것을 물고기로 바꾸는 주먹'),
  '飛び血鎌': A3('Flying Blood Sickles', 'Sends out slashes of blood', '飛血鐮', '放出血之斬擊', '날아가는 피의 낫', '피의 참격을 날린다'),
  '跋扈跳梁': A3('Rampant Arc Rampage', 'Surrounds itself with slashes of blood', '跋扈跳梁', '讓血之斬擊環繞自身', '발호도량', '피의 참격을 몸 주위에 두른다'),
  '円斬旋回・飛び血鎌': A3('Rotating Circular Slashes: Flying Blood Sickles', 'Unleashes swirling blood slashes from the arms far and wide', '圓斬旋迴・飛血鐮', '從手臂大範圍放出旋渦般的血之斬擊', '원참선회·날아가는 피의 낫', '팔에서 소용돌이치는 피의 참격을 넓게 날린다'),
  '帯': A3('Obi Sashes', 'Stretches the sashes freely to cut', '腰帶', '自在地伸長腰帶斬擊', '오비', '띠를 자유자재로 뻗어 벤다'),
  '八重帯斬り': A3('Eight-Layered Obi Slash', 'Cuts with crossing sashes that leave no escape', '八重帶斬', '以無處可逃的交錯腰帶斬擊', '팔중 띠 베기', '달아날 곳 없이 교차시킨 띠로 벤다'),
  '刻糸牢': A3('Cutting Thread Cage', 'Traps in a cage of threads and slices', '刻線牢', '關進絲線之籠並切碎', '각사뢰', '실의 우리에 가두고 썬다'),
  '殺目篭': A3('Murderous Eye Basket', 'Tightens a cage of threads at once', '殺目籠', '一口氣收緊絲線之籠', '살목롱', '실의 우리를 단숨에 좁힌다'),
  '刻糸輪転': A3('Cutting Thread Rotation', 'Unleashes its hardest threads in a vortex', '刻線輪轉', '將最硬的絲線如漩渦般放出', '각사윤전', '가장 단단한 실을 소용돌이처럼 날린다'),
  '強制昏倒催眠の囁き': A3('Whispers of Forced Unconscious Hypnosis', 'Puts foes to sleep with a whispered "sleep"', '強制昏倒催眠的呢喃', '以「睡吧」的低語使其入睡', '강제 혼도 최면의 속삭임', '"잠들어라"라는 속삭임으로 잠들게 한다'),
  '強制昏倒睡眠・眼': A3('Forced Unconscious Sleep: Eyes', 'Puts to sleep anyone who meets its eyes', '強制昏倒睡眠・眼', '讓對上視線的對手入睡', '강제 혼도 수면·눈', '눈이 마주친 상대를 잠들게 한다'),
  '琵琶': A3('Biwa', 'Moves the rooms of the Infinity Castle with the sound of the biwa and sends foes far away', '琵琶', '以琵琶之音移動無限城的房間，將對手送往遠處', '비파', '비파 소리로 무한성의 방을 움직여 상대를 멀리 날려 보낸다'),
  '襖': A3('Sliding Doors', 'Opens sliding doors underfoot to drop foes', '襖門', '在腳下打開襖門使其墜落', '장지문', '발밑에 장지문을 열어 떨어뜨린다'),
  '鼓（爪）': A3('Drum (Claws)', 'A beat of the drum sends claw-like slashes', '鼓（爪）', '敲鼓便有如爪痕的斬擊奔出', '북(손톱)', '북을 치면 손톱 자국 같은 참격이 달린다'),
  '鼓（回転）': A3('Drum (Rotation)', 'A beat of the drum rotates the room and steals footing', '鼓（迴轉）', '敲鼓便使房間旋轉，奪去立足之地', '북(회전)', '북을 치면 방이 돌아 발 디딜 곳을 빼앗는다'),
  '尚速鼓打ち': A3('High-Speed Drumming', 'Keeps beating the drums faster than the eye can see', '尚速鼓擊', '以肉眼跟不上的速度不停擊鼓', '상속 북치기', '눈에 보이지 않는 속도로 북을 계속 친다'),
  '惑血 視覚夢幻の香': A3('Bewitching Blood: Scent of Visual Illusion', 'Shows illusions with the scent of blood', '惑血 視覺夢幻之香', '以血之香氣讓人看見幻覺', '혹혈 시각몽환의 향', '피의 향으로 환상을 보여 준다'),
  '惑血 白日の魔香': A3('Bewitching Blood: Daylight Sorcery Scent', 'A scent that makes lying impossible', '惑血 白日的魔香', '聞到就無法說謊的香氣', '혹혈 백일의 마향', '맡으면 거짓말을 할 수 없게 되는 향'),
  '紙眼': A3('Paper Eyes', 'Hides form and presence using talismans', '紙眼', '使用符咒隱藏身影與氣息', '종이 눈', '부적을 써서 모습과 기척을 숨긴다'),
  '無数の手': A3('Countless Hands', 'Stretches the hands all over its body to grab', '無數的手', '伸出全身的手抓住對手', '무수한 손', '온몸의 손을 뻗어 붙잡는다'),
  '地中の手': A3('Hands from the Ground', 'Thrusts hands up from under the ground', '地中之手', '從地面下突出手來', '땅속의 손', '땅 밑에서 손을 찔러 올린다'),
  '爆血': A3('Exploding Blood', 'Burns its own blood and makes it burst', '爆血', '燃燒自己的血使其爆裂', '폭혈', '자신의 피를 태워 터뜨린다'),
};

// ---------- 名前で決まる血鬼術の言葉（oni.js の EL・FM と同じ並び）----------
export const GENL = {
  en: { el: [[['Blaze', 'Hellfire', 'Scorch'], 'burning blood-flame'], [['Ice Fang', 'Frost', 'Permafrost'], 'freezing blood-ice'], [['Thunder', 'Violet Bolt', 'Roaring Thunder'], 'lightning running through blood'], [['Whirlwind', 'Downdraft', 'Sickle Wind'], 'flesh-cutting wind'], [['Muddy Torrent', 'Water Mirror', 'Tide'], 'blood-laced water'], [['Gravel', 'Crag', 'Fissure'], 'stone from the ground'],
      [['Haze', 'Mist', 'Smoke'], 'blinding mist'], [['Blood Blade', 'Crimson', 'Blood Tide'], 'its own hardened blood'], [['Curse Venom', 'Miasma', 'Rot'], 'flesh-melting venom'], [['Shadow', 'Darkness', 'Black Eclipse'], 'the shadows underfoot'], [['Bone', 'Skull', 'White Bone'], 'bone grown from its body'], [['Mirror', 'Glass', 'Reflection'], 'shards of mirror'],
      [['False Bloom', 'Spider Lily', 'Falling Petals'], 'blood-drinking flowers'], [['Vermin', 'Venom Moth', 'Centipede'], 'insects welling from its body'], [['Ink', 'Black Rope', 'Brush'], 'living ink'], [['Rust', 'Decayed Iron', 'Red Rust'], 'blade-rotting rust'], [['Wail', 'Echo', 'Bell'], 'ear-splitting sound'], [['Dream', 'Phantom', 'Slumber'], 'sleep-bringing illusions'],
      [['Needle', 'Thousand Needles', 'Thorn'], 'countless needles'], [['Chain', 'Shackle', 'Curse Bind'], 'chains of blood'], [['Thread', 'Cocoon', 'Twill'], 'threads harder than steel'], [['Moon', 'New Moon', 'Waning Moon'], 'blades of moonlight']],
    fm: [[['Sweep', 'Flash', 'Mow'], 'Sweeps {e} across the front'], [['Pierce', 'Impale', 'Spear'], 'Drives {e} straight ahead like a spear'], [['Wild Dance', 'Chain Claws', 'Rend'], 'Tears through the nearest foes one after another with {e}'], [['Drizzle', 'Downpour', 'Drop'], 'Rains {e} down from above'], [['Barrier', 'Mantle', 'Vortex'], 'Wraps {e} around itself'],
      [['Sprint', 'Meander', 'Rush'], 'Cloaked in {e}, its body hunts on its own'], [['Paralysis', 'Curse', 'Frozen Time'], 'Slows everything around it with {e}'], [['Plunge', 'Shatter', 'Earthbreaker'], 'Slams {e} down, smashing obstacles too'], [['Catastrophe', 'Demise', 'Cataclysm'], 'Blows away everything ahead with {e}'], [['Regrowth', 'Devour', 'Pulse'], 'Feeds with {e} and restores its regeneration']],
    tier: ['A scratch', 'Average', 'Strong', 'Vicious', 'Calamity'], sep: ' ' },
  zh: { el: [[['焰', '業火', '灼熱'], '熊熊燃燒的血之炎'], [['冰牙', '霜', '凍土'], '凍結的血之冰'], [['雷', '紫電', '轟雷'], '奔走於血中的雷'], [['旋風', '颪', '鐮鼬'], '撕裂皮肉的風'], [['濁流', '水鏡', '潮'], '混著血的水'], [['礫', '巖', '地裂'], '地面的岩石'],
      [['朧', '霞', '煙'], '遮蔽視線的霧'], [['血刃', '紅', '血潮'], '凝固的自身之血'], [['蠱毒', '瘴氣', '腐蝕'], '溶解皮肉的毒'], [['影', '闇', '黑蝕'], '腳下的影子'], [['骨', '髑髏', '白骨'], '從身體伸出的骨'], [['鏡', '玻璃', '映身'], '鏡子的碎片'],
      [['徒花', '彼岸花', '散華'], '吸血的花'], [['蟲', '毒蛾', '百足'], '從身體湧出的蟲'], [['墨', '黑繩', '筆'], '活著的墨'], [['鏽', '朽鐵', '赤鏽'], '使刀腐朽的鏽'], [['哭聲', '殘響', '鈴'], '撕裂耳朵的聲音'], [['夢', '幻', '微睡'], '誘人入睡的幻覺'],
      [['針', '千本', '棘'], '無數的針'], [['鎖', '枷', '咒縛'], '血之鎖鏈'], [['絲', '繭', '綾'], '比鋼還硬的絲'], [['月', '朔', '殘月'], '月光之刃']],
    fm: [[['薙', '一閃', '橫掃'], '以{e}橫掃前方'], [['穿', '貫', '槍'], '將{e}化為長槍，筆直貫穿遠處'], [['亂舞', '連爪', '八裂'], '以{e}由近而遠接連撕裂對手'], [['時雨', '驟雨', '落'], '讓{e}從空中傾注而下'], [['結界', '纏', '渦'], '讓{e}環繞自身'],
      [['疾走', '蛇行', '奔'], '纏繞{e}，身體自行不斷獵殺對手'], [['定身', '咒縛', '凍時'], '以{e}使周圍的動作遲鈍'], [['墜', '劈裂', '碎地'], '將{e}從上方砸下，連障礙物一起粉碎'], [['大災', '終焉', '天變'], '以{e}將前方的一切吹飛'], [['再生', '噬', '脈動'], '以{e}吞噬，取回再生之力']],
    tier: ['擦傷程度', '普通', '強', '凶惡', '災厄'], sep: '・' },
  ko: { el: [[['불꽃', '업화', '작열'], '타오르는 피의 불꽃'], [['빙아', '서리', '동토'], '얼어붙는 피의 얼음'], [['번개', '자전', '굉뢰'], '피를 타고 달리는 번개'], [['선풍', '내리바람', '낫바람'], '살을 가르는 바람'], [['탁류', '수경', '조수'], '피가 섞인 물'], [['자갈', '바위', '땅갈림'], '땅의 바위'],
      [['으스름', '안개', '연기'], '눈을 가리는 안개'], [['혈인', '진홍', '피의 조수'], '굳힌 자신의 피'], [['고독', '장기', '부패'], '살을 녹이는 독'], [['그림자', '어둠', '흑식'], '발밑의 그림자'], [['뼈', '해골', '백골'], '몸에서 뻗은 뼈'], [['거울', '유리', '분신'], '거울 조각'],
      [['헛꽃', '피안화', '산화'], '피를 빠는 꽃'], [['벌레', '독나방', '지네'], '몸에서 솟는 벌레'], [['먹', '검은 밧줄', '붓'], '살아 있는 먹'], [['녹', '썩은 쇠', '붉은 녹'], '칼을 썩게 하는 녹'], [['곡성', '잔향', '방울'], '귀를 찢는 소리'], [['꿈', '환영', '선잠'], '잠으로 이끄는 환상'],
      [['바늘', '천 개의 바늘', '가시'], '무수한 바늘'], [['사슬', '족쇄', '주박'], '피의 사슬'], [['실', '고치', '능직'], '강철보다 단단한 실'], [['달', '초하루', '잔월'], '달빛의 칼날']],
    fm: [[['휩쓸기', '일섬', '쓸기'], '{e}(으)로 앞을 가로로 휩쓴다'], [['꿰뚫기', '관통', '창'], '{e}을(를) 창으로 삼아 곧장 멀리까지 꿰뚫는다'], [['난무', '연조', '갈가리 찢기'], '{e}(으)로 가까운 상대부터 잇달아 찢는다'], [['가랑비', '소나기', '떨구기'], '{e}을(를) 하늘에서 쏟아붓는다'], [['결계', '두르기', '소용돌이'], '{e}을(를) 몸 주위에 두른다'],
      [['질주', '사행', '내달리기'], '{e}을(를) 두르고, 몸이 멋대로 상대를 계속 사냥한다'], [['가위눌림', '주박', '얼어붙은 시간'], '{e}(으)로 주위의 움직임을 둔하게 한다'], [['추락', '내리쪼개기', '땅 부수기'], '{e}을(를) 위에서 내리쳐 장애물째 부순다'], [['대재앙', '종언', '천변'], '{e}(으)로 앞의 모든 것을 날려 버린다'], [['재생', '포식', '맥동'], '{e}(으)로 삼키고 재생의 힘을 되찾는다']],
    tier: ['긁힌 정도', '보통', '강함', '흉악', '재앙'], sep: '·' },
};

// ---------- 見出し（壱ノ型・血鬼術など）----------
const NUM = { '壱': 1, '弐': 2, '参': 3, '肆': 4, '伍': 5, '陸': 6, '漆': 7, '捌': 8, '玖': 9, '拾': 10, '拾壱': 11, '拾弐': 12, '拾参': 13, '拾肆': 14, '拾伍': 15, '拾陸': 16 };
const ORD = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth'];
const ZN = ['', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖', '拾', '拾壹', '拾貳', '拾參', '拾肆', '拾伍', '拾陸'];
const FIX = { '血鬼術': { en: 'Blood Demon Art', zh: '血鬼術', ko: '혈귀술' }, '終ノ型': { en: 'Final Form', zh: '終之型', ko: '종의 형' }, '蝶ノ舞': { en: 'Butterfly Dance', zh: '蝶之舞', ko: '나비의 춤' }, '蜂牙ノ舞': { en: 'Dance of the Bee Sting', zh: '蜂牙之舞', ko: '벌침의 춤' }, '蜻蛉ノ舞': { en: 'Dance of the Dragonfly', zh: '蜻蛉之舞', ko: '잠자리의 춤' }, '蜈蚣ノ舞': { en: 'Dance of the Centipede', zh: '蜈蚣之舞', ko: '지네의 춤' },
  '月の呼吸': { en: 'Moon Breathing', zh: '月之呼吸', ko: '달의 호흡' }, '雷の呼吸': { en: 'Thunder Breathing', zh: '雷之呼吸', ko: '번개의 호흡' } };
export function labelL(label, lang) {
  if (lang === 'ja' || !label) return label; const sp = label.indexOf(' ');
  if (sp > 0) return labelL(label.slice(0, sp), lang) + (lang === 'en' ? ', ' : ' ') + labelL(label.slice(sp + 1), lang);
  if (FIX[label]) return FIX[label][lang] || label; const m = /^(.+)ノ(型|牙)$/.exec(label), n = m && NUM[m[1]]; if (!n) return label;
  if (lang === 'en') return ORD[n] + (m[2] === '牙' ? ' Fang' : ' Form'); if (lang === 'zh') return ZN[n] + '之' + m[2]; return '제' + n + (m[2] === '牙' ? '엄니' : '형');
}
// 日本語の技名 → その技が waza.js のどこにあるか
const REV = {}; for (const k of Object.keys(WAZA)) WAZA[k].forEach((w, i) => { REV[w[1]] = [k, i]; });
// 技1つを、その言葉で [見出し, 技名, 原作の動き] にして返す（ほかの作品の技は w[4] に訳を持たせる）
export function locW(w, lang) {
  if (!w || lang === 'ja') return w; let t = null;
  if (w[4] && w[4][lang]) t = w[4][lang]; else if (AN[w[1]]) t = AN[w[1]][lang]; else if (REV[w[1]] && WN[lang] && WN[lang][REV[w[1]][0]]) t = WN[lang][REV[w[1]][0]][REV[w[1]][1]];
  return [t && t[2] ? t[2] : labelL(w[0], lang), t ? t[0] : w[1], t ? t[1] : w[2]];
}
// ---------- ゲーム内の効果の説明 ----------
const DL = {
  en: { wide: { 0: 'your lane', 1: 'your lane and both neighbors', 2: '2 lanes on each side', 9: 'all lanes' }, foe: ['demons', 'slayers'], gauge: ['edge', 'regeneration'], o: '. Also breaks obstacles', g: '. Passes through obstacles', h: (n, w) => `. Restores ${n} ${w}`,
    inst: (w, r) => `Cuts ${r}m ahead across ${w} at once`, aura: (d, w, f) => `For ${d}s, keeps cutting ${f} that come near within ${w} (they can't hit you)`, flow: (d, wd, f, gr) => `For ${d}s, moves on its own and cuts through ${f}${wd ? ' widely' : ''} (can't be hit)${gr ? '. Gradually widens' : ''}`, multi: (n, r) => `Cuts the ${n} nearest (up to ${r}m ahead)`, rain: (d, r, oni) => `For ${d}s, ${oni ? 'the art rains' : 'slashes rain'} down on all lanes up to ${r}m ahead`, slow: d => `For ${d}s, everything around slows down` },
  zh: { wide: { 0: '自己的跑道', 1: '自己與左右相鄰的跑道', 2: '自己與左右各2條跑道', 9: '全部跑道' }, foe: ['鬼', '隊士'], gauge: ['鋒利度', '再生力'], o: '。也會破壞障礙物', g: '。也能穿過障礙物', h: (n, w) => `。${w}回復${n}`,
    inst: (w, r) => `一口氣斬擊${w}的前方${r}m`, aura: (d, w, f) => `${d}秒內，在${w}持續斬擊靠近的${f}（不會被${f}撞到）`, flow: (d, wd, f, gr) => `${d}秒內，自動移動並${wd ? '大範圍' : ''}一路斬擊${f}（不會被撞到）${gr ? '。範圍會逐漸擴大' : ''}`, multi: (n, r, oni) => `由近而遠斬擊${n}${oni ? '人' : '隻'}（前方${r}m以內）`, rain: (d, r, oni) => `${d}秒內，${oni ? '血鬼術' : '斬擊'}落在全部跑道的前方${r}m`, slow: d => `${d}秒內，周圍會變慢` },
  ko: { wide: { 0: '자기 레인', 1: '자기와 양옆 레인', 2: '자기와 좌우 2레인', 9: '모든 레인' }, foe: ['귀신', '대원'], gauge: ['예리함', '재생력'], o: '. 장애물도 부순다', g: '. 장애물도 통과한다', h: (n, w) => `. ${w} ${n} 회복`,
    inst: (w, r) => `${w}의 앞 ${r}m를 단숨에 벤다`, aura: (d, w, f) => `${d}초 동안 ${w}에서 다가오는 ${f}을 계속 벤다(${f}에게 부딪히지 않는다)`, flow: (d, wd, f, gr) => `${d}초 동안 저절로 움직이며 ${wd ? '넓게 ' : ''}${f}을 베어 나아간다(부딪히지 않는다)${gr ? '. 점점 넓어진다' : ''}`, multi: (n, r, oni) => `가까운 순으로 ${n}${oni ? '명을' : '마리를'} 벤다(앞 ${r}m까지)`, rain: (d, r, oni) => `${d}초 동안 모든 레인의 앞 ${r}m에 ${oni ? '혈귀술' : '참격'}이 쏟아진다`, slow: d => `${d}초 동안 주위가 느려진다` },
};
export function descL(p, lang, oni) {
  const T = DL[lang]; if (!T) return null; const f = T.foe[oni ? 1 : 0], o = p.O ? T.o : '', g = p.G ? T.g : '', h = p.H ? T.h(p.H, T.gauge[oni ? 1 : 0]) : '';
  let s = ''; if (p.k === 'inst') s = T.inst(T.wide[p.L], p.R) + o + h; else if (p.k === 'aura') s = T.aura(p.D, T.wide[p.L], f) + o + g; else if (p.k === 'flow') s = T.flow(p.D, p.L >= 2, f, p.grow) + o;
  else if (p.k === 'multi') s = T.multi(p.N, p.R, oni); else if (p.k === 'rain') s = T.rain(p.D, p.R, oni) + o; else if (p.k === 'slow') s = T.slow(p.D);
  if (oni) s = lang === 'en' ? s.replace(/\bCuts\b/g, 'Strikes').replace(/\bcuts\b/g, 'strikes').replace(/\bcutting\b/g, 'striking') : lang === 'zh' ? s.replace(/斬擊/g, '擊倒') : s.replace(/베어 나아간다/g, '쓰러뜨리며 나아간다').replace(/벤다/g, '쓰러뜨린다');
  return s;
}
// 日本語の技名（「壱ノ型 水面斬り」「蓮葉氷」など）を、その言葉の技名にする。知らない名前は null
export const EXTRA = {}; // 別作品の技：「見出し 技名」（日本語）→ { en:[技名, 説明, 見出し], … }（others.js が入れる）
export function nameL(s, lang) {
  if (lang === 'ja') return s; const x = EXTRA[s] && EXTRA[s][lang]; if (x) return (x[2] ? x[2] + (lang === 'en' ? ': ' : ' ') : '') + x[0];
  const one = n => (AN[n] ? AN[n][lang][0] : REV[n] && WN[lang] ? WN[lang][REV[n][0]][REV[n][1]][0] : null);
  const d = one(s); if (d) return d; const sp = s.indexOf(' '); if (sp < 0) return null; const t = one(s.slice(sp + 1)); return t ? labelL(s.slice(0, sp), lang) + (lang === 'en' ? ': ' : ' ') + t : null;
}

// 名前で決まる血鬼術の [技名, 説明]（ei=属性の番号, fi=形の番号, a・b=3つの言葉のどれか）
const jong = w => { const c = w.charCodeAt(w.length - 1) - 0xAC00; return c < 0 || c > 11171 ? -1 : c % 28; };
export function genArt(lang, ei, fi, a, b) {
  const G = GENL[lang]; if (!G) return null; const e = G.el[ei], f = G.fm[fi]; let d = f[1];
  if (lang === 'ko') { const j = jong(e[1]); d = d.replace('{e}(으)로', e[1] + (j === 0 || j === 8 ? '로' : '으로')).replace('{e}을(를)', e[1] + (j === 0 ? '를' : '을')); }
  return [e[0][a] + G.sep + f[0][b], d.replace('{e}', e[1])];
}
export const TIERL = { zh: GENL.zh.tier, ko: GENL.ko.tier };

// 原作の鬼の名前
const ONAME = { '鬼舞辻無惨': ['Muzan Kibutsuji', '鬼舞辻無慘', '키부츠지 무잔'], '黒死牟': ['Kokushibo', '黑死牟', '코쿠시보'], '獪岳': ['Kaigaku', '獪岳', '카이가쿠'], '童磨': ['Doma', '童磨', '도우마'], '猗窩座': ['Akaza', '猗窩座', '아카자'], '半天狗': ['Hantengu', '半天狗', '한텐구'], '玉壺': ['Gyokko', '玉壺', '굣코'], '妓夫太郎': ['Gyutaro', '妓夫太郎', '규타로'], '堕姫': ['Daki', '墮姬', '다키'],
  '累': ['Rui', '累', '루이'], '魘夢': ['Enmu', '魘夢', '엔무'], '鳴女': ['Nakime', '鳴女', '나키메'], '響凱': ['Kyogai', '響凱', '쿄우가이'], '珠世': ['Tamayo', '珠世', '타마요'], '愈史郎': ['Yushiro', '愈史郎', '유시로'], '手鬼': ['Hand Demon', '手鬼', '손 귀신'], '禰豆子': ['Nezuko', '禰豆子', '네즈코'] };
export const oniNameL = (n, lang) => (lang === 'ja' || !ONAME[n] ? n : ONAME[n][{ en: 0, zh: 1, ko: 2 }[lang]] || n);
