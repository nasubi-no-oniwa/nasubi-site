// 十枚目：画面のことば（日本語・英語・繁体中文・韓国語）
export const LANGS = [["ja", "日本語"], ["en", "English"], ["zh", "繁中"], ["ko", "한국어"]];
const pad = (n) => String(n).padStart(2, "0");
export const TX = {
  ja: {
    vert: true, doc: "十枚目", big: "十枚目", sub: "番町皿屋敷より", start: "はじめる", note: "音なしでも遊べます。音ありなら、声のする方向も聞こえます", rank: "ランキング",
    howH: "やること", lead: "十枚目の皿は<br>お前の頭の上にある",
    how: ["屋敷のどこかの床に落ちている<b>鍵</b>をさがす。ときどき、きらっと光る", "鍵を持って<b>門</b>から出る。左上の地図の赤い印が門", "走ると足音で気づかれる。<b>走りすぎると皿が落ちて割れ</b>、お菊の速さが十倍になる", "画面の端に出る<b>「三枚…」の文字が、お菊のいる方向</b>。大きいほど近い", "見つかったら部屋を出るか、<b>押し入れに隠れる</b>"],
    howI: ["鍵", "門", "皿", "菊", "隠"], ctlM: "画面をなぞって移動　／　「走る」を押している間は走る", ctlP: "移動：WASD か 矢印　／　走る：Shift　／　隠れる・出る：E", enter: "屋敷へ入る",
    goalL: "目的", goalKey: "鍵をさがせ", goalGate: "門から出ろ",
    hKey: "鍵は　床できらきら光る", hGot: "鍵を　手に入れた", hNeed: "鍵がいる", hFound: "見つかった　逃げろ", hNear: "近い……", hRun: "走りすぎだ　皿が落ちる", hBroke: "皿が割れた　隠れろ",
    run: "走る", hide: "隠れる", out: "出る", skip: "とばす", plate: "皿", broken: "割",
    counts: ["一枚", "二枚", "三枚", "四枚", "五枚", "六枚", "七枚", "八枚", "九枚"], miss1: "一枚……", miss2: "足りない", missOne: "一枚　足りない", croak: "ア゛ア゛…",
    c1: ["お", "前", "が", "…", "…"], c2: ["お", "前", "が", "…", "…", "…", "…"], c3: ["私", "を", "は", "め", "た", "の", "か"], bang: "！！！",
    resWin: "夜明け", resLose: "十枚目", lineWin: "屋敷を出るまで　{t}", lineLose: "逃げのびた時間　{t}", nOk: "皿は　割れずに残った", nBroken: "皿は　割れた", nLose: "お前が　十枚目だ", again: "もう一度", mapNote: "屋敷の間取りは、毎回変わります",
    nameP: "名前（12文字まで）", rec: "ランキングに記録する", sending: "送信中…", sent: "ランキング：今日 {d}・全期間 {a}", rankN: "{r}位", rankOut: "100位より下", notbetter: "（全期間は前の記録のほうが上）", offline: "始めたときに通信できなかったので、この回は記録できません", senderr: "送れませんでした。もう一度押してください", needname: "記録するには名前を入れてね", badname: "その名前は使えません",
    xpost: "Xに投稿", postWin: "十枚目｜{t}で屋敷から逃げきった{p}", pOk: "（皿は無事）", pBroken: "（皿は割れた）", postLose: "十枚目｜{t}逃げたけど、お菊に捕まって十枚目にされた", tags: "#十枚目 #ブラウザゲーム",
    today: "今日", alltime: "全期間", rkNote: "門を出るまでの時間。金の印は、皿を割らずに出た記録", back: "もどる", loading: "読み込み中…", empty: "まだ誰もいません", rkErr: "ランキングを読み込めませんでした",
    time: (s) => `${Math.floor(s / 60)}分${pad(s % 60)}秒`,
  },
  en: {
    vert: false, doc: "THE TENTH PLATE", big: "THE TENTH<br>PLATE", sub: "From the Japanese ghost story Banchō Sarayashiki", start: "START", note: "Playable without sound. With sound on, you can hear where the voice comes from.", rank: "RANKING",
    howH: "WHAT TO DO", lead: "The tenth plate<br>is on your head.",
    how: ["Find the <b>key</b> lying on a floor somewhere in the mansion. It glints now and then.", "Take the key and leave through the <b>gate</b> — the red mark on the map at the top left.", "Running makes noise. <b>Run too long and the plate falls and breaks</b>, and Okiku becomes ten times faster.", "The <b>“Three…” text at the edge of the screen shows where Okiku is</b>. Bigger means closer.", "If she sees you, leave the room or <b>hide in a closet</b>."],
    howI: ["鍵", "門", "皿", "菊", "隠"], ctlM: "Drag anywhere to move　/　Hold RUN to run", ctlP: "Move: WASD or arrows　/　Run: Shift　/　Hide・Leave: E", enter: "ENTER THE MANSION",
    goalL: "GOAL", goalKey: "Find the key", goalGate: "Leave through the gate",
    hKey: "The key glints on the floor", hGot: "You got the key", hNeed: "You need the key", hFound: "She saw you. Run", hNear: "She is close…", hRun: "You ran too long. The plate is slipping", hBroke: "The plate broke. Hide",
    run: "RUN", hide: "HIDE", out: "LEAVE", skip: "SKIP", plate: "PLATE", broken: "BROKEN",
    counts: ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"], miss1: "One…", miss2: "is missing", missOne: "One is missing", croak: "Aa… aa…",
    c1: ["You", "…"], c2: ["You", "…", "…", "…"], c3: ["YOU", "FRAMED", "ME"], bang: "!!!",
    resWin: "DAWN", resLose: "THE TENTH<br>PLATE", lineWin: "Out of the mansion in {t}", lineLose: "You lasted {t}", nOk: "The plate survived", nBroken: "The plate broke", nLose: "You are the tenth", again: "PLAY AGAIN", mapNote: "The mansion's layout changes every time",
    nameP: "Name (up to 12 letters)", rec: "SUBMIT TO RANKING", sending: "Sending…", sent: "Ranking: today {d} / all-time {a}", rankN: "#{r}", rankOut: "below 100", notbetter: " (your earlier all-time record is better)", offline: "There was no connection when you started, so this run can't be recorded", senderr: "Couldn't send. Press again", needname: "Enter a name to submit", badname: "That name can't be used",
    xpost: "POST TO X", postWin: "The Tenth Plate | Escaped the mansion in {t}{p}", pOk: " (plate intact)", pBroken: " (plate broken)", postLose: "The Tenth Plate | Lasted {t}, then Okiku made me her tenth plate", tags: "#十枚目 #ブラウザゲーム",
    today: "TODAY", alltime: "ALL-TIME", rkNote: "Time to get out of the gate. A gold mark means the plate survived.", back: "BACK", loading: "Loading…", empty: "No one yet", rkErr: "Couldn't load the ranking",
    time: (s) => `${Math.floor(s / 60)}:${pad(s % 60)}`,
  },
  zh: {
    vert: true, doc: "第十枚", big: "第十枚", sub: "改編自日本怪談《番町皿屋敷》", start: "開始", note: "沒有聲音也能玩。開聲音的話，還能聽出聲音傳來的方向", rank: "排行榜",
    howH: "該做的事", lead: "第十枚盤子<br>就在你的頭上",
    how: ["找出掉在宅邸某處地板上的<b>鑰匙</b>。它偶爾會閃一下光", "拿著鑰匙從<b>大門</b>出去。左上地圖的紅色記號就是大門", "跑步的腳步聲會被發現。<b>跑太久盤子會掉下來摔破</b>，阿菊的速度會變成十倍", "畫面邊緣出現的<b>「三枚…」文字，就是阿菊所在的方向</b>。字越大就越近", "被發現的話就離開房間，或是<b>躲進壁櫥</b>"],
    howI: ["鍵", "門", "皿", "菊", "隠"], ctlM: "滑動畫面移動　／　按住「跑」的期間會跑步", ctlP: "移動：WASD 或方向鍵　／　跑：Shift　／　躲藏・出來：E", enter: "進入宅邸",
    goalL: "目標", goalKey: "找到鑰匙", goalGate: "從大門出去",
    hKey: "鑰匙　在地板上閃閃發光", hGot: "拿到了　鑰匙", hNeed: "需要鑰匙", hFound: "被發現了　快逃", hNear: "很近……", hRun: "跑太久了　盤子要掉了", hBroke: "盤子破了　快躲起來",
    run: "跑", hide: "躲藏", out: "出來", skip: "跳過", plate: "盤", broken: "破",
    counts: ["一枚", "二枚", "三枚", "四枚", "五枚", "六枚", "七枚", "八枚", "九枚"], miss1: "一枚……", miss2: "不夠", missOne: "少了　一枚", croak: "啊啊…",
    c1: ["是", "你", "…", "…"], c2: ["是", "你", "…", "…", "…", "…"], c3: ["是", "你", "陷", "害", "我", "的"], bang: "！！！",
    resWin: "黎明", resLose: "第十枚", lineWin: "逃出宅邸　用時 {t}", lineLose: "撐了　{t}", nOk: "盤子　完好無缺", nBroken: "盤子　破了", nLose: "你就是　第十枚", again: "再玩一次", mapNote: "宅邸的格局每次都不一樣",
    nameP: "名字（最多12字）", rec: "登上排行榜", sending: "傳送中…", sent: "排行榜：今日 {d}・全期間 {a}", rankN: "第{r}名", rankOut: "100名以外", notbetter: "（全期間是之前的紀錄比較好）", offline: "開始時沒有連上網路，這次無法記錄", senderr: "傳送失敗，請再按一次", needname: "請先輸入名字", badname: "這個名字不能使用",
    xpost: "發到 X", postWin: "第十枚｜花了{t}逃出宅邸{p}", pOk: "（盤子沒破）", pBroken: "（盤子破了）", postLose: "第十枚｜撐了{t}，還是被阿菊抓到，成了第十枚盤子", tags: "#十枚目 #ブラウザゲーム",
    today: "今日", alltime: "全期間", rkNote: "逃出大門所花的時間。金色記號代表盤子沒破", back: "返回", loading: "讀取中…", empty: "還沒有人", rkErr: "無法讀取排行榜",
    time: (s) => `${Math.floor(s / 60)}分${pad(s % 60)}秒`,
  },
  ko: {
    vert: true, doc: "열 번째 접시", big: "열 번째 접시", sub: "일본 괴담 ‘반초 사라야시키’에서", start: "시작", note: "소리 없이도 플레이할 수 있어요. 소리를 켜면 목소리가 들리는 방향도 알 수 있어요", rank: "랭킹",
    howH: "할 일", lead: "열 번째 접시는<br>네 머리 위에 있다",
    how: ["저택 어딘가 바닥에 떨어진 <b>열쇠</b>를 찾는다. 가끔 반짝 빛난다", "열쇠를 들고 <b>대문</b>으로 나간다. 왼쪽 위 지도의 빨간 표시가 대문", "달리면 발소리로 들킨다. <b>너무 오래 달리면 접시가 떨어져 깨지고</b>, 오키쿠의 속도가 열 배가 된다", "화면 가장자리에 뜨는 <b>‘세 장…’ 글자가 오키쿠가 있는 방향</b>. 클수록 가깝다", "들키면 방을 나가거나 <b>벽장에 숨는다</b>"],
    howI: ["鍵", "門", "皿", "菊", "隠"], ctlM: "화면을 밀어서 이동　／　‘달리기’를 누르는 동안 달린다", ctlP: "이동: WASD 또는 방향키　／　달리기: Shift　／　숨기・나오기: E", enter: "저택으로 들어간다",
    goalL: "목표", goalKey: "열쇠를 찾아라", goalGate: "대문으로 나가라",
    hKey: "열쇠는　바닥에서 반짝인다", hGot: "열쇠를　손에 넣었다", hNeed: "열쇠가 필요하다", hFound: "들켰다　도망쳐", hNear: "가깝다……", hRun: "너무 달렸다　접시가 떨어진다", hBroke: "접시가 깨졌다　숨어라",
    run: "달리기", hide: "숨기", out: "나오기", skip: "건너뛰기", plate: "접시", broken: "깨짐",
    counts: ["한 장", "두 장", "세 장", "네 장", "다섯 장", "여섯 장", "일곱 장", "여덟 장", "아홉 장"], miss1: "한 장……", miss2: "모자라", missOne: "한 장이　모자라", croak: "아아…",
    c1: ["네", "가", "…", "…"], c2: ["네", "가", "…", "…", "…", "…"], c3: ["네", "가", "날", "모", "함", "했", "구", "나"], bang: "！！！",
    resWin: "새벽", resLose: "열 번째 접시", lineWin: "저택을 나갈 때까지　{t}", lineLose: "버틴 시간　{t}", nOk: "접시는　깨지지 않았다", nBroken: "접시는　깨졌다", nLose: "네가　열 번째다", again: "한 번 더", mapNote: "저택의 구조는 매번 바뀝니다",
    nameP: "이름 (12자까지)", rec: "랭킹에 기록하기", sending: "보내는 중…", sent: "랭킹: 오늘 {d}・전체 {a}", rankN: "{r}위", rankOut: "100위 밖", notbetter: " (전체는 이전 기록이 더 좋습니다)", offline: "시작할 때 통신이 되지 않아 이번 판은 기록할 수 없습니다", senderr: "보내지 못했습니다. 다시 눌러 주세요", needname: "기록하려면 이름을 입력해 주세요", badname: "그 이름은 쓸 수 없습니다",
    xpost: "X에 올리기", postWin: "열 번째 접시｜{t} 만에 저택에서 탈출했다{p}", pOk: " (접시는 무사)", pBroken: " (접시는 깨짐)", postLose: "열 번째 접시｜{t} 버텼지만 오키쿠에게 잡혀 열 번째 접시가 되었다", tags: "#十枚目 #ブラウザゲーム",
    today: "오늘", alltime: "전체", rkNote: "대문을 나갈 때까지 걸린 시간. 금색 표시는 접시를 깨지 않고 나간 기록", back: "돌아가기", loading: "불러오는 중…", empty: "아직 아무도 없습니다", rkErr: "랭킹을 불러오지 못했습니다",
    time: (s) => `${Math.floor(s / 60)}분 ${pad(s % 60)}초`,
  },
};
export function pickLang(saved) {
  if (saved && TX[saved]) return saved;
  const n = (navigator.language || "ja").toLowerCase();
  return n.startsWith("ja") ? "ja" : n.startsWith("zh") ? "zh" : n.startsWith("ko") ? "ko" : "en";
}
