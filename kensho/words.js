// 懸賞🍆：画面の言葉（日本語・英語・中国語・韓国語）と、ふつうの名前につける異名
export const LANGS = ['ja', 'en', 'zh', 'ko'];
export const T = {
  ja: {
    lang: '日本語', small: 'けんしょうなす', lead: '名前を入れると、あなたの懸賞金が決まる。<br>お尋ね者の手配書を発行しよう。', leadF: '仲間の名前を入れて、<br>一味の手配書を並べよう。（5人まで）',
    nmL: '名前', nmLF: '仲間の名前', ph: '名前を入れる', phL: '写真（なくてもOK）', phPick: '写真を選ぶ', phSub: '手配書の顔に入ります', phSet: '写真を変える', phSetSub: '押すと位置を合わせなおせます',
    start: '手配書を発行する', startF: '仲間の手配書を発行する', rank: 'ランキング', back: 'もどる', needName: '名前を入れてください', same: 'その名前はもう一味にいます', imgErr: '写真を読みこめませんでした',
    notes: '※懸賞金は名前だけで決まります（写真は関係ありません）。同じ名前なら、いつも同じ額です。<br>※ワンピースのキャラの名前を入れると、作中の懸賞金（ベリーを🍆に置きかえた額）になります。非公式のファンゲームです。<br>※写真はこの端末の中だけで使い、どこにも送りません。人の写真を使うときは、本人の許可をとってね。',
    edT: '顔の位置を合わせる', edHint: '指で動かす・2本指で拡大（下のつまみでも拡大できます）', edOk: 'これで決定', edRe: '別の写真', edDel: '写真を外す',
    x: '𝕏 に投稿する', img: '画像を保存', friend: '仲間の手配書も作る', friend2: '仲間を加える（あと{n}人）', again: '別の名前で',
    rkT: '懸賞金ランキング', rkAll: '全期間', rkToday: '今日', rkNote: '名前1つにつき1件。作中のキャラの名前は載りません。', rkEmpty: 'まだ記録がありません', rkErr: 'ランキングを読みこめませんでした', loading: '読みこみ中…',
    amtL: '懸賞金', totL: '一味の懸賞金 総額', cmpUp: '{a}より上', cmpDown: '{a}より下', cmpSame: '{a}と同じ', cmpTop: '作中の誰よりも高い！', cmpBottom: '作中の誰よりも安い…', sep: '、',
    charNote: '作中の懸賞金（ベリーを🍆に置きかえた額）', unknown: '額不明', unknownNote: '作中で額が明かされていません', pet: 'ペット扱い', petNote: 'ペット扱いの額です', noFace: '顔を見せない分 危険', no: 'No.',
    wanted: 'お尋ね者', report: '見つけ次第 なすび奉行所まで', office: 'なすび奉行所', faceless: '正体不明',
    post: '私の懸賞金は {a}🍆\n「{n}」', postT: '一味の懸賞金 総額 {a}🍆（{c}人）\n{list}', sndOn: '🔊 音あり', sndOff: '🔇 音なし', load: '読みこみ中…',
  },
  en: {
    lang: 'English', small: 'BOUNTY', lead: 'Your name decides your bounty.<br>Get your WANTED-style poster issued.', leadF: 'Add your crewmates’ names<br>and line up the posters. (up to 5)',
    nmL: 'Name', nmLF: 'Crewmate’s name', ph: 'Enter a name', phL: 'Photo (optional)', phPick: 'Choose a photo', phSub: 'It goes on the poster', phSet: 'Change photo', phSetSub: 'Tap to adjust the position',
    start: 'Issue the poster', startF: 'Issue a crewmate’s poster', rank: 'Ranking', back: 'Back', needName: 'Please enter a name', same: 'That name is already in the crew', imgErr: 'Could not read the photo',
    notes: '* The bounty depends only on the name (the photo does not matter). The same name always gets the same amount.<br>* Enter a ONE PIECE character’s name to get their bounty from the story (Berries replaced with 🍆). Unofficial fan game.<br>* Your photo stays on this device and is never sent anywhere. Ask before using someone else’s photo.',
    edT: 'Adjust the face', edHint: 'Drag to move, pinch to zoom (or use the slider)', edOk: 'Done', edRe: 'Another photo', edDel: 'Remove photo',
    x: 'Post on 𝕏', img: 'Save image', friend: 'Add a crewmate', friend2: 'Add a crewmate ({n} left)', again: 'Try another name',
    rkT: 'Bounty Ranking', rkAll: 'All time', rkToday: 'Today', rkNote: 'One entry per name. Characters from the story are not listed.', rkEmpty: 'No records yet', rkErr: 'Could not load the ranking', loading: 'Loading…',
    amtL: 'Bounty', totL: 'Total crew bounty', cmpUp: 'above {a}', cmpDown: 'below {a}', cmpSame: 'same as {a}', cmpTop: 'Higher than anyone in the story!', cmpBottom: 'Lower than anyone in the story…', sep: ', ',
    charNote: 'Bounty from the story (Berries → 🍆)', unknown: 'Unknown', unknownNote: 'Never revealed in the story', pet: 'Pet', petNote: 'Treated as a pet', noFace: 'No face shown — extra dangerous', no: 'No.',
    wanted: 'OUTLAW', report: 'REPORT TO THE NASUBI MAGISTRATE', office: 'NASUBI MAGISTRATE', faceless: 'UNKNOWN',
    post: 'My bounty is {a} 🍆\n"{n}"', postT: 'Our crew’s total bounty: {a} 🍆 ({c} members)\n{list}', sndOn: '🔊 Sound on', sndOff: '🔇 Sound off', load: 'Loading…',
  },
  zh: {
    lang: '中文', small: '悬赏茄子', lead: '输入名字，决定你的悬赏金。<br>发行属于你的通缉令吧。', leadF: '输入伙伴的名字，<br>把一伙人的通缉令排在一起。（最多5人）',
    nmL: '名字', nmLF: '伙伴的名字', ph: '输入名字', phL: '照片（可不选）', phPick: '选择照片', phSub: '会放在通缉令的头像处', phSet: '更换照片', phSetSub: '点击可重新调整位置',
    start: '发行通缉令', startF: '发行伙伴的通缉令', rank: '排行榜', back: '返回', needName: '请输入名字', same: '这个名字已经在一伙里了', imgErr: '无法读取照片',
    notes: '※悬赏金只由名字决定（与照片无关）。同一个名字永远是同样的金额。<br>※输入《海贼王》角色的名字，会得到作品中的悬赏金（把贝利换成🍆）。非官方同人游戏。<br>※照片只在本设备中使用，不会发送到任何地方。使用他人照片前请先征得同意。',
    edT: '调整头像位置', edHint: '拖动移动，双指缩放（也可以用下面的滑块）', edOk: '确定', edRe: '换一张', edDel: '不用照片',
    x: '发到 𝕏', img: '保存图片', friend: '也做伙伴的通缉令', friend2: '加入伙伴（还可{n}人）', again: '换个名字',
    rkT: '悬赏金排行榜', rkAll: '总榜', rkToday: '今日', rkNote: '每个名字只记1条。作品中的角色名不上榜。', rkEmpty: '还没有记录', rkErr: '无法读取排行榜', loading: '读取中…',
    amtL: '悬赏金', totL: '一伙的悬赏金 总额', cmpUp: '高于{a}', cmpDown: '低于{a}', cmpSame: '与{a}相同', cmpTop: '比作品里任何人都高！', cmpBottom: '比作品里任何人都低…', sep: '，',
    charNote: '作品中的悬赏金（贝利换成🍆）', unknown: '金额不明', unknownNote: '作品中尚未公开金额', pet: '宠物', petNote: '被当作宠物的金额', noFace: '不露脸 更危险', no: 'No.',
    wanted: '悬赏犯', report: '发现后请速报茄子奉行所', office: '茄子奉行所', faceless: '真面目不明',
    post: '我的悬赏金是 {a}🍆\n「{n}」', postT: '我们一伙的悬赏金总额 {a}🍆（{c}人）\n{list}', sndOn: '🔊 有声', sndOff: '🔇 静音', load: '读取中…',
  },
  ko: {
    lang: '한국어', small: '현상금 가지', lead: '이름을 넣으면 당신의 현상금이 정해진다.<br>현상수배서를 발행하자.', leadF: '동료의 이름을 넣어서<br>일당의 수배서를 나란히 놓자. (5명까지)',
    nmL: '이름', nmLF: '동료의 이름', ph: '이름을 입력', phL: '사진 (없어도 OK)', phPick: '사진 고르기', phSub: '수배서의 얼굴에 들어갑니다', phSet: '사진 바꾸기', phSetSub: '누르면 위치를 다시 맞출 수 있어요',
    start: '수배서 발행하기', startF: '동료의 수배서 발행하기', rank: '랭킹', back: '돌아가기', needName: '이름을 입력해 주세요', same: '그 이름은 이미 일당에 있어요', imgErr: '사진을 읽을 수 없었습니다',
    notes: '※현상금은 이름만으로 정해집니다 (사진과는 관계없음). 같은 이름이면 언제나 같은 금액입니다.<br>※원피스 캐릭터의 이름을 넣으면 작중 현상금(베리를 🍆로 바꾼 금액)이 됩니다. 비공식 팬 게임입니다.<br>※사진은 이 기기 안에서만 쓰고 어디에도 보내지 않습니다. 다른 사람의 사진은 본인 허락을 받아 주세요.',
    edT: '얼굴 위치 맞추기', edHint: '손가락으로 이동, 두 손가락으로 확대 (아래 슬라이더로도 가능)', edOk: '이걸로 결정', edRe: '다른 사진', edDel: '사진 빼기',
    x: '𝕏 에 올리기', img: '이미지 저장', friend: '동료 수배서도 만들기', friend2: '동료 추가 (앞으로 {n}명)', again: '다른 이름으로',
    rkT: '현상금 랭킹', rkAll: '전체', rkToday: '오늘', rkNote: '이름 하나당 1건. 작중 캐릭터 이름은 실리지 않습니다.', rkEmpty: '아직 기록이 없습니다', rkErr: '랭킹을 불러올 수 없었습니다', loading: '불러오는 중…',
    amtL: '현상금', totL: '일당 현상금 총액', cmpUp: '{a}보다 위', cmpDown: '{a}보다 아래', cmpSame: '{a}와 같음', cmpTop: '작중의 누구보다도 높다!', cmpBottom: '작중의 누구보다도 낮다…', sep: ', ',
    charNote: '작중 현상금 (베리를 🍆로 바꾼 금액)', unknown: '금액 불명', unknownNote: '작중에서 금액이 밝혀지지 않았습니다', pet: '애완동물', petNote: '애완동물 취급 금액입니다', noFace: '얼굴을 안 보인 만큼 위험', no: 'No.',
    wanted: '현상수배범', report: '발견 즉시 나스비 부교소로', office: '나스비 부교소', faceless: '정체불명',
    post: '내 현상금은 {a}🍆\n「{n}」', postT: '우리 일당 현상금 총액 {a}🍆 ({c}명)\n{list}', sndOn: '🔊 소리 켬', sndOff: '🔇 소리 끔', load: '불러오는 중…',
  },
};

// 異名：ふつうの名前は、懸賞金の高さで3つの箱から1つ選ぶ（どの言語でも同じ番号の言葉になる）
// [日本語, 英語, 中国語, 韓国語]
export const EPI_LOW = [
  ['二度寝', 'Snooze', '回笼觉', '두번잠'], ['夜ふかし', 'Night Owl', '熬夜', '올빼미'], ['腹ペコ', 'Hungry', '饿肚子', '배고픈'], ['三日坊主', 'Quitter', '三分钟热度', '작심삼일'],
  ['猫舌', 'Cat Tongue', '怕烫', '고양이혀'], ['迷子', 'Lost Child', '迷路', '길치'], ['寝ぐせ', 'Bedhead', '乱发', '까치머리'], ['長風呂', 'Long Bath', '泡澡王', '긴목욕'],
  ['金欠', 'Broke', '穷光蛋', '빈털터리'], ['給料日前', 'Payday Eve', '发薪前夜', '월급전날'], ['既読無視', 'Left-on-Read', '已读不回', '읽씹'], ['遅刻魔', 'Always Late', '迟到大王', '지각대장'],
  ['方向音痴', 'No Compass', '路痴', '방향치'], ['大食い', 'Big Eater', '大胃王', '먹보'], ['泣き虫', 'Crybaby', '爱哭鬼', '울보'], ['見栄っ張り', 'Show-Off', '爱面子', '허세'],
  ['無課金', 'Free-to-Play', '零氪', '무과금'], ['重課金', 'Whale', '重氪', '핵과금'], ['焼き茄子', 'Grilled Eggplant', '烤茄子', '가지구이'], ['茄子漬け', 'Pickled Eggplant', '腌茄子', '가지절임'],
  ['千鳥足', 'Tipsy', '醉步', '갈지자'], ['早口', 'Fast Talker', '话痨', '속사포'], ['ものぐさ', 'Lazybones', '懒虫', '게으름뱅이'], ['くしゃみ', 'Sneeze', '喷嚏', '재채기'],
];
export const EPI_MID = [
  ['嵐呼び', 'Storm Caller', '唤风', '폭풍부름'], ['海鳴り', 'Sea Roar', '海啸', '바다울음'], ['霧隠れ', 'the Mist', '雾隐', '안개'], ['鉄拳', 'Iron Fist', '铁拳', '철권'],
  ['紅蓮', 'Crimson', '红莲', '홍련'], ['百面相', 'Hundred Faces', '百面', '백면'], ['夜明け', 'Dawn', '黎明', '여명'], ['月夜', 'Moonlight', '月夜', '달밤'],
  ['暴れ茄子', 'Wild Eggplant', '暴走茄子', '폭주가지'], ['畑荒らし', 'Field Raider', '菜园大盗', '밭도둑'], ['雷鳴', 'Thunder', '雷鸣', '뇌명'], ['黒潮', 'Black Tide', '黑潮', '흑조'],
];
export const EPI_HIGH = [
  ['覇道', 'Conqueror', '霸道', '패도'], ['深淵', 'the Abyss', '深渊', '심연'], ['鬼神', 'War God', '鬼神', '귀신'], ['天災', 'Calamity', '天灾', '천재지변'],
  ['黒雲', 'Black Cloud', '黑云', '먹구름'], ['不沈', 'Unsinkable', '不沉', '불침'], ['千本刀', 'Thousand Blades', '千刀', '천도'], ['星喰い', 'Star Eater', '噬星', '별먹이'],
];
export const EPI_PET = ['ペット', 'Pet', '宠物', '애완'];
