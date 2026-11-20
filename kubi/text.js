// 首が飛鳥：ことば（日本語・英語・繁体字・韓国語）
export const TX = {
  ja: {
    lang: '日本語', ttl: '首が飛鳥', yr: '六四五年　飛鳥', h1: '首が<em>飛鳥</em>', lead: '音が鳴ったら、<b>斬れ。</b>', start: '斬る', mv: 'ムービーを見る', rank: 'ランキング', skip: 'スキップ ▶', kamae: '構え', sec: '秒',
    vOk: '一閃', vSp: '人間を超えた', vNg: '斬られた', tReact: '反応の速さ', whyEarly: '早まった。合図の前に動いた', whyLate: 'おじけづいた。1.5秒、動けなかった', drop: '首は真下に落ちた',
    pass: n => `${n} 超え`, next: (n, d) => `${n}まで あと${d}`, max: '東京まで飛んだ。将門に並んだ', flyPass: n => `<b>${n}</b> 通過`, tip: 'まめ知識', origin: '板蓋宮', credit: '地図：国土地理院の地球地図日本をもとに作成',
    name: '名前（12文字まで）', rec: 'ランキングに記録する', img: '画像にする', x: '𝕏 に投稿', again: 'もう一度 斬る', back: 'もどる', toTitle: 'タイトルに戻る', today: '今日', all: '全期間', rkNote: '反応の速い順。0.01秒より速い人は「人間を超えた」枠', spRow: n => `人間を超えた（${n}人）`, loading: '読みこみ中…', empty: 'まだ誰も斬っていません', rankErr: 'ランキングを読みこめませんでした', needName: '名前を入れてください', badName: 'その名前は使えません', sending: '記録しています…', recPre: '記録しました：', sendErr: '記録できませんでした。電波のいい所でもう一度押してください', norun: '今回は通信できなかったので、記録できません', place: n => n + '位', out: '100位より下', rankRes: (d, a, best) => `今日 ${d}／全期間 ${a}` + (best ? '（自己ベスト）' : ''), sndOn: '🔊 音あり（音が合図）', sndOff: '🔇 音なし', nogl: 'この端末では3Dを表示できませんでした', xCopied: '画像をコピーしました。Xの投稿欄に貼りつけ（Ctrl+V）すると画像がつきます', xSaved: '画像を保存しました。Xの投稿に、保存した画像を追加してください',
    postOk: (t, d, p) => `蘇我入鹿の首を ${d} 飛ばした。\n反応 ${t}秒。${p}。\n#首が飛鳥 #ブラウザゲーム`, postSp: (t, d) => `蘇我入鹿の首が東京まで飛んだ（${d}）。\n反応 ${t}秒。人間を超えた。\n#首が飛鳥 #ブラウザゲーム`, postNg: w => `入鹿を斬るはずが、自分の首が落ちた。\n（${w}）\n#首が飛鳥 #ブラウザゲーム`,
    mvs: ['645年6月12日。飛鳥板蓋宮。<br>外は、雨。', '蘇我入鹿。天皇をしのぐ力を持つ男。<br>用心深く、いつも剣を手放さない。<br>——この日は、道化にだまされて剣を預けていた。', '石川麻呂が上表文を読み上げる。それが合図。<br>だが斬り役の二人は、おじけづいて動けない。', '麻呂の声が震えだす。<br>入鹿が怪しむ。「なぜ震える」', '中大兄皇子は思った。<br>——もう、自分でやるしかない。'],
    ms: {
      kubizuka: ['入鹿の首塚', '飛鳥寺の西に立つ五輪塔。入鹿の首がここまで飛んできた、と伝わる。いちばん有名な首塚。'],
      moukon: ['もうこの森', '気都和既神社の森。入鹿の首に追われた鎌足が、ここまで逃げて「もう来ぬだろう」と言った、という伝説がある。'],
      irukajinja: ['入鹿神社', '入鹿をまつる、全国でもめずらしい神社。このあたりでは、入鹿はしたわれていた。'],
      kubiotoshi: ['首落橋', '入鹿の首が落ちたと伝わる橋。まわりの地名は、いまも「曽我町」。'],
      takami: ['高見山', '奈良と三重のさかいの山。入鹿の首がここまで飛んだという伝説があり、ふもとにも首塚がある。伝説の中でいちばん遠い。'],
      ise: ['伊勢神宮', 'ここからは伝説超え。伊勢神宮は、天皇家の祖先の神・天照大神をまつる。この事件の45年後（690年）に、20年ごとに建てかえる「式年遷宮」が始まった。'],
      atsuta: ['熱田神宮', '三種の神器のひとつ、草薙剣をまつる。この事件の23年後（668年）に剣が盗まれた、と日本書紀に書かれている。'],
      hamana: ['浜名湖', 'このころの浜名湖は、海とつながっていない淡水の湖。約850年後（1498年）の大地震と津波で、海とつながった。'],
      fuji: ['富士山', 'このころの富士山は、噴火をくり返す活火山。記録に残るいちばん古い噴火は、136年後の781年。'],
      masakado: ['将門の首塚（東京）', '約300年後の940年、平将門の首が京都からここまで飛んだと伝わる。飛んだ首どうし、入鹿が将門に並んだ。']
    },
    after: ['斬られた入鹿は「私に何の罪が」と天皇に訴えた。その日は雨。なきがらは、むしろで覆われた。', '翌日、父の蘇我蝦夷は屋敷に火を放って自害。蘇我氏の本家はほろびた。', 'この事件が「乙巳の変」。翌年の「改新の詔」から始まる改革が「大化の改新」。', '中大兄皇子は、のちの天智天皇。中臣鎌足は「藤原」の姓をもらい、藤原氏のはじまりになった。'],
    fail: ['史実では、斬り役の二人はおじけづいて動けなかった。水をかけた飯も、のどを通らず吐いたという。だから皇子は、自分で飛び出した。', '用心深い入鹿は、いつも剣を身につけていた。この日は道化（わざひと）がおどけて、剣を外させた。', '上表文を読む石川麻呂は、汗だくで声も手も震えた。入鹿に「なぜ震える」と聞かれ、「天皇のおそばで恐れ多くて」と答えた。']
  },
  en: {
    lang: 'English', ttl: 'Heads Up, Asuka', yr: 'ASUKA, 645 AD', h1: 'Heads Up, <em>Asuka</em>', lead: 'When you hear the sound, <b>strike.</b>', start: 'STRIKE', mv: 'Watch the intro', rank: 'Ranking', skip: 'Skip ▶', kamae: 'READY', sec: 's',
    vOk: 'ONE FLASH', vSp: 'BEYOND HUMAN', vNg: 'CUT DOWN', tReact: 'Reaction time', whyEarly: 'Too early. You moved before the signal', whyLate: 'You froze. 1.5 seconds without moving', drop: 'Your head dropped straight down',
    pass: n => `Past ${n}`, next: (n, d) => `${d} short of ${n}`, max: 'It flew all the way to Tokyo', flyPass: n => `Passing <b>${n}</b>`, tip: 'History note', origin: 'Palace', credit: 'Map: based on Global Map Japan (GSI)',
    name: 'Name (up to 12)', rec: 'Submit to ranking', img: 'Save image', x: 'Post to 𝕏', again: 'Strike again', back: 'Back', toTitle: 'Back to title', today: 'Today', all: 'All time', rkNote: 'Fastest first. Under 0.01s goes in the "Beyond Human" slot', spRow: n => `Beyond Human (${n})`, loading: 'Loading…', empty: 'Nobody has struck yet', rankErr: 'Could not load the ranking', needName: 'Enter a name', badName: "That name can't be used", sending: 'Submitting…', recPre: 'Saved: ', sendErr: 'Could not submit. Try again with a better connection', norun: 'This run had no connection, so it cannot be submitted', place: n => '#' + n, out: 'outside top 100', rankRes: (d, a, best) => `Today ${d} / All time ${a}` + (best ? ' (personal best)' : ''), sndOn: '🔊 Sound on (sound is the signal)', sndOff: '🔇 Sound off', nogl: 'This device could not show 3D graphics', xCopied: 'Image copied. Paste it (Ctrl+V) into the post box on X to attach it', xSaved: 'Image saved. Attach the saved image to your post on X',
    postOk: (t, d, p) => `I sent Soga no Iruka's head flying ${d}.\nReaction ${t}s. ${p}.\n#HeadsUpAsuka #browsergame`, postSp: (t, d) => `Soga no Iruka's head flew all the way to Tokyo (${d}).\nReaction ${t}s. Beyond human.\n#HeadsUpAsuka #browsergame`, postNg: w => `I was supposed to cut down Iruka. My own head fell instead.\n(${w})\n#HeadsUpAsuka #browsergame`,
    mvs: ['June 12, 645. Itabuki Palace, Asuka.<br>Rain outside.', 'Soga no Iruka. A man more powerful than the emperor.<br>Wary, he never lets go of his sword.<br>Today a jester tricked him into handing it over.', 'Ishikawa no Maro reads a memorial aloud. That is the signal.<br>But the two swordsmen are too frightened to move.', "Maro's voice starts to shake.<br>Iruka grows suspicious. “Why are you trembling?”", 'Prince Naka no Oe thought:<br>I will have to do it myself.'],
    ms: {
      kubizuka: ["Iruka's Head Mound", "A stone pagoda west of Asuka-dera temple. Legend says Iruka's head flew this far. The most famous of his head mounds."],
      moukon: ['Mokon Forest', 'The grove of Kitsuwaki Shrine. Legend says Kamatari, chased by Iruka\'s head, fled here and said “It won\'t come this far.”'],
      irukajinja: ['Iruka Shrine', 'One of the very few shrines that honor Iruka. Around here he was well liked.'],
      kubiotoshi: ['Head-Fall Bridge', "A bridge where Iruka's head is said to have landed. The district is still called Soga-cho."],
      takami: ['Mt. Takami', 'A mountain on the Nara–Mie border. Legend says the head flew all the way here, and there is a head mound at its foot. The farthest of the legends.'],
      ise: ['Ise Grand Shrine', 'From here you have beaten the legends. Ise enshrines Amaterasu, ancestor deity of the imperial family. 45 years after this event (690), its rebuilding every 20 years began.'],
      atsuta: ['Atsuta Shrine', 'Home of the sacred sword Kusanagi, one of the Three Sacred Treasures. The chronicles say it was stolen 23 years after this event (668).'],
      hamana: ['Lake Hamana', 'At this time it was a freshwater lake cut off from the sea. A great earthquake and tsunami about 850 years later (1498) opened it to the ocean.'],
      fuji: ['Mt. Fuji', 'An active volcano that kept erupting in this era. Its oldest recorded eruption came 136 years later, in 781.'],
      masakado: ["Masakado's Head Mound (Tokyo)", "About 300 years later, in 940, the head of Taira no Masakado is said to have flown here from Kyoto. Iruka's head has matched it."]
    },
    after: ['Struck down, Iruka pleaded to the empress: “What crime have I committed?” It rained that day. His body was covered with a straw mat.', "The next day his father, Soga no Emishi, set fire to his mansion and died. The main Soga line was destroyed.", 'This was the Isshi Incident. The reforms that began with the edict of the following year are called the Taika Reform.', 'Prince Naka no Oe later became Emperor Tenji. Nakatomi no Kamatari received the name Fujiwara and founded the Fujiwara clan.'],
    fail: ['In history, the two chosen swordsmen froze with fear. They are said to have vomited the rice they tried to swallow. So the prince rushed out himself.', 'Iruka was cautious and always wore his sword. That day a court jester clowned around and got him to take it off.', 'Reading the memorial, Maro was soaked in sweat, his voice and hands shaking. Asked why, he said: “I am in awe, being so near Her Majesty.”']
  },
  zh: {
    lang: '繁體中文', ttl: '首級飛鳥', yr: '六四五年　飛鳥', h1: '首級<em>飛鳥</em>', lead: '聲音一響，就<b>斬。</b>', start: '斬', mv: '看動畫', rank: '排行榜', skip: '跳過 ▶', kamae: '預備', sec: '秒',
    vOk: '一閃', vSp: '超越人類', vNg: '被斬了', tReact: '反應速度', whyEarly: '太急了。信號前就動了', whyLate: '嚇呆了。1.5秒動不了', drop: '頭直直掉了下來',
    pass: n => `超過 ${n}`, next: (n, d) => `離${n}還有${d}`, max: '飛到東京了。與將門並列', flyPass: n => `通過 <b>${n}</b>`, tip: '小知識', origin: '板蓋宮', credit: '地圖：依據日本國土地理院的地球地圖日本製作',
    name: '名字（最多12字）', rec: '登錄排行榜', img: '存成圖片', x: '發到 𝕏', again: '再斬一次', back: '返回', toTitle: '回到標題', today: '今天', all: '全部', rkNote: '反應越快越前面。比0.01秒快的人歸在「超越人類」', spRow: n => `超越人類（${n}人）`, loading: '讀取中…', empty: '還沒有人出手', rankErr: '無法讀取排行榜', needName: '請輸入名字', badName: '這個名字不能使用', sending: '登錄中…', recPre: '已登錄：', sendErr: '登錄失敗，請在收訊好的地方再按一次', norun: '這一局沒有連線，無法登錄', place: n => '第' + n + '名', out: '100名以外', rankRes: (d, a, best) => `今天 ${d}／全部 ${a}` + (best ? '（個人最佳）' : ''), sndOn: '🔊 有聲音（聲音是信號）', sndOff: '🔇 靜音', nogl: '這台裝置無法顯示3D畫面', xCopied: '已複製圖片。在 X 的發文欄貼上（Ctrl+V）就能附上圖片', xSaved: '已儲存圖片。請把儲存的圖片加到 X 的貼文裡',
    postOk: (t, d, p) => `我把蘇我入鹿的頭斬飛了 ${d}。\n反應 ${t}秒。${p}。\n#首級飛鳥 #browsergame`, postSp: (t, d) => `蘇我入鹿的頭飛到了東京（${d}）。\n反應 ${t}秒。超越人類。\n#首級飛鳥 #browsergame`, postNg: w => `本來要斬入鹿，結果掉的是自己的頭。\n（${w}）\n#首級飛鳥 #browsergame`,
    mvs: ['645年6月12日。飛鳥板蓋宮。<br>外面下著雨。', '蘇我入鹿。權勢壓過天皇的男人。<br>他很謹慎，劍從不離身。<br>——這一天，他被俳優騙走了劍。', '石川麻呂朗讀上表文。那就是信號。<br>但負責動手的兩人嚇得動不了。', '麻呂的聲音開始發抖。<br>入鹿起了疑心。「為什麼發抖？」', '中大兄皇子心想：<br>——只能自己動手了。'],
    ms: {
      kubizuka: ['入鹿首塚', '立在飛鳥寺西邊的五輪塔。相傳入鹿的頭飛到了這裡。最有名的首塚。'],
      moukon: ['茂古森', '氣都和既神社的森林。傳說被入鹿的頭追趕的鎌足逃到這裡，說「應該不會再追來了」。'],
      irukajinja: ['入鹿神社', '全日本少見、祭祀入鹿的神社。在這一帶，入鹿很受愛戴。'],
      kubiotoshi: ['首落橋', '相傳入鹿的頭掉落的橋。附近的地名至今仍叫「曾我町」。'],
      takami: ['高見山', '奈良與三重交界的山。傳說入鹿的頭飛到這裡，山腳也有首塚。是傳說中最遠的地方。'],
      ise: ['伊勢神宮', '從這裡開始就超越傳說了。伊勢神宮祭祀天皇家的祖神天照大神。事件45年後（690年），開始了每20年重建一次的「式年遷宮」。'],
      atsuta: ['熱田神宮', '祭祀三種神器之一的草薙劍。《日本書紀》記載，事件23年後（668年）劍曾被偷走。'],
      hamana: ['濱名湖', '當時的濱名湖是不與海相連的淡水湖。約850年後（1498年）的大地震與海嘯讓它與海相通。'],
      fuji: ['富士山', '當時的富士山是不斷噴發的活火山。有紀錄的最早噴發是136年後的781年。'],
      masakado: ['將門首塚（東京）', '約300年後的940年，相傳平將門的頭從京都飛到這裡。入鹿的頭與將門並列了。']
    },
    after: ['被斬的入鹿向天皇申訴：「我有什麼罪？」那天下著雨。遺體被蓋上了草蓆。', '隔天，父親蘇我蝦夷放火燒了宅邸自盡。蘇我氏本家就此滅亡。', '這起事件稱為「乙巳之變」。從隔年的「改新之詔」開始的改革就是「大化革新」。', '中大兄皇子就是後來的天智天皇。中臣鎌足獲賜「藤原」之姓，成為藤原氏的始祖。'],
    fail: ['史實中，負責動手的兩人嚇得動不了，據說連泡水的飯都吞不下去吐了出來。所以皇子自己衝了出去。', '謹慎的入鹿總是佩著劍。這一天，俳優耍寶逗他，讓他把劍解了下來。', '朗讀上表文的石川麻呂滿身大汗，聲音和手都在抖。入鹿問「為什麼發抖」，他回答：「在天皇身邊，太惶恐了。」']
  },
  ko: {
    lang: '한국어', ttl: '목이 아스카', yr: '645년　아스카', h1: '목이 <em>아스카</em>', lead: '소리가 나면, <b>베어라.</b>', start: '벤다', mv: '영상 보기', rank: '랭킹', skip: '건너뛰기 ▶', kamae: '준비', sec: '초',
    vOk: '일섬', vSp: '인간을 넘었다', vNg: '베였다', tReact: '반응 속도', whyEarly: '성급했다. 신호 전에 움직였다', whyLate: '겁먹었다. 1.5초 동안 움직이지 못했다', drop: '목은 바로 아래로 떨어졌다',
    pass: n => `${n} 돌파`, next: (n, d) => `${n}까지 ${d} 남음`, max: '도쿄까지 날아갔다. 마사카도와 나란히', flyPass: n => `<b>${n}</b> 통과`, tip: '토막 지식', origin: '이타부키 궁', credit: '지도: 일본 국토지리원 지구지도 일본을 바탕으로 제작',
    name: '이름 (12자까지)', rec: '랭킹에 기록하기', img: '이미지로 저장', x: '𝕏 에 올리기', again: '다시 벤다', back: '돌아가기', toTitle: '타이틀로 돌아가기', today: '오늘', all: '전체', rkNote: '반응이 빠른 순. 0.01초보다 빠르면 「인간을 넘었다」 칸', spRow: n => `인간을 넘었다 (${n}명)`, loading: '불러오는 중…', empty: '아직 아무도 베지 않았습니다', rankErr: '랭킹을 불러오지 못했습니다', needName: '이름을 입력하세요', badName: '그 이름은 쓸 수 없습니다', sending: '기록 중…', recPre: '기록했습니다: ', sendErr: '기록하지 못했습니다. 신호가 좋은 곳에서 다시 눌러 주세요', norun: '이번 판은 통신이 되지 않아 기록할 수 없습니다', place: n => n + '위', out: '100위 밖', rankRes: (d, a, best) => `오늘 ${d} / 전체 ${a}` + (best ? ' (개인 최고)' : ''), sndOn: '🔊 소리 켬 (소리가 신호)', sndOff: '🔇 소리 끔', nogl: '이 기기에서는 3D를 표시할 수 없습니다', xCopied: '이미지를 복사했습니다. X 글쓰기 칸에 붙여넣기(Ctrl+V)하면 이미지가 첨부됩니다', xSaved: '이미지를 저장했습니다. X 게시물에 저장한 이미지를 첨부해 주세요',
    postOk: (t, d, p) => `소가노 이루카의 목을 ${d} 날렸다.\n반응 ${t}초. ${p}.\n#목이아스카 #browsergame`, postSp: (t, d) => `소가노 이루카의 목이 도쿄까지 날아갔다 (${d}).\n반응 ${t}초. 인간을 넘었다.\n#목이아스카 #browsergame`, postNg: w => `이루카를 베려다 내 목이 떨어졌다.\n(${w})\n#목이아스카 #browsergame`,
    mvs: ['645년 6월 12일. 아스카 이타부키 궁.<br>밖에는 비.', '소가노 이루카. 천황을 능가하는 권력자.<br>조심성이 많아 늘 칼을 놓지 않는다.<br>——이날은 광대에게 속아 칼을 맡겼다.', '이시카와노 마로가 상표문을 읽는다. 그것이 신호.<br>하지만 베기로 한 두 사람은 겁에 질려 움직이지 못한다.', '마로의 목소리가 떨리기 시작한다.<br>이루카가 의심한다. “왜 떠느냐.”', '나카노오에 황자는 생각했다.<br>——이제 내가 할 수밖에 없다.'],
    ms: {
      kubizuka: ['이루카 목 무덤', '아스카데라 서쪽에 선 오륜탑. 이루카의 목이 여기까지 날아왔다고 전한다. 가장 유명한 목 무덤.'],
      moukon: ['모우콘 숲', '기쓰와키 신사의 숲. 이루카의 목에 쫓기던 가마타리가 여기까지 도망쳐 “이제 안 오겠지”라고 말했다는 전설이 있다.'],
      irukajinja: ['이루카 신사', '이루카를 모시는, 전국에서도 드문 신사. 이 일대에서 이루카는 사랑받았다.'],
      kubiotoshi: ['구비오토시 다리', '이루카의 목이 떨어졌다고 전하는 다리. 주변 지명은 지금도 “소가초”.'],
      takami: ['다카미 산', '나라와 미에의 경계에 있는 산. 이루카의 목이 여기까지 날아왔다는 전설이 있고, 기슭에도 목 무덤이 있다. 전설 중 가장 멀다.'],
      ise: ['이세 신궁', '여기부터는 전설 돌파. 이세 신궁은 천황가의 조상신 아마테라스를 모신다. 이 사건 45년 뒤(690년), 20년마다 새로 짓는 “식년천궁”이 시작됐다.'],
      atsuta: ['아쓰타 신궁', '삼종신기 중 하나인 구사나기 검을 모신다. 이 사건 23년 뒤(668년) 검을 도둑맞았다고 일본서기에 적혀 있다.'],
      hamana: ['하마나 호', '이 무렵의 하마나 호는 바다와 이어지지 않은 민물 호수. 약 850년 뒤(1498년)의 대지진과 해일로 바다와 이어졌다.'],
      fuji: ['후지 산', '이 무렵의 후지 산은 분화를 거듭하던 활화산. 기록에 남은 가장 오래된 분화는 136년 뒤인 781년.'],
      masakado: ['마사카도 목 무덤 (도쿄)', '약 300년 뒤인 940년, 다이라노 마사카도의 목이 교토에서 여기까지 날아왔다고 전한다. 이루카가 마사카도와 나란히 섰다.']
    },
    after: ['베인 이루카는 천황에게 “제게 무슨 죄가 있습니까” 하고 호소했다. 그날은 비. 시신은 거적으로 덮였다.', '다음 날, 아버지 소가노 에미시는 저택에 불을 지르고 자결했다. 소가 씨 본가는 멸망했다.', '이 사건이 “을사의 변”. 이듬해 “개신의 조”에서 시작된 개혁이 “다이카 개신”이다.', '나카노오에 황자는 훗날의 덴지 천황. 나카토미노 가마타리는 “후지와라” 성을 받아 후지와라 씨의 시조가 되었다.'],
    fail: ['실제 역사에서 베기로 한 두 사람은 겁에 질려 움직이지 못했다. 물에 만 밥도 넘기지 못하고 토했다고 한다. 그래서 황자가 직접 뛰쳐나갔다.', '조심성 많은 이루카는 늘 칼을 차고 있었다. 이날은 광대가 익살을 부려 칼을 풀게 했다.', '상표문을 읽던 이시카와노 마로는 땀투성이에 목소리도 손도 떨렸다. 이루카가 “왜 떠느냐” 묻자 “천황 곁이라 황공해서”라고 답했다.']
  }
};
