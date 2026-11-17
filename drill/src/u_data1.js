
/* ===================== テスト範囲モード：単元データ ===================== */
/* 問題の形：[問題, 正解, まちがい1, まちがい2, まちがい3, 解説] */
const RU={en:{n:'英語',ic:'🔤',tabs:['中1','中2','中3'],u:[]},ma:{n:'数学',ic:'➗',tabs:['中1','中2','中3'],u:[]},sc:{n:'理科',ic:'🔬',tabs:['中1','中2','中3'],u:[]},so:{n:'社会',ic:'🗾',tabs:['地理','歴史','公民'],u:[]}};
function U(s,id,g,n,q){RU[s].u.push({id:s+'.'+id,g,n,q})}
function UG(s,id,g,n,gen){RU[s].u.push({id:s+'.'+id,g,n,gen})}

/* ---------- 英語 ---------- */
U('en','e1','中1','be動詞（am / is / are）',[
 ['I （　） a student.','am','is','are','be','主語が I のときは am。'],
 ['She （　） my sister.','is','am','are','be','主語が he / she / it や1人・1つのときは is。'],
 ['We （　） good friends.','are','is','am','be','主語が we / you / they や2人以上のときは are。'],
 ['（　） you from Chiba?','Are','Is','Am','Do','be動詞の疑問文は be動詞を前に出す。you には Are。'],
 ['This （　） my bag.','is','are','am','be','this は1つのものなので is。'],
 ['Tom and Ken （　） in the gym.','are','is','am','be','Tom and Ken は2人なので are。'],
 ['He （　） not a teacher.','is','are','am','do','be動詞の否定文は be動詞のあとに not。'],
 ['What （　） that? ― It\'s a camera.','is','are','do','does','that は1つなので What is that?'],
]);
U('en','e2','中1','一般動詞（I / you）',[
 ['I （　） soccer every day.','play','plays','am play','playing','主語が I なら動詞はそのまま。be動詞といっしょに使わない。'],
 ['Do you like music? ― Yes, I （　）.','do','am','like','does','Do ～? には do で答える。'],
 ['I （　） not have a pen.','do','am','does','is','一般動詞の否定文は do not（don\'t）＋動詞。'],
 ['（　） you play the piano?','Do','Are','Does','Is','一般動詞の疑問文は Do を前に。'],
 ['We （　） English on Monday.','study','studies','are study','studying','主語が we なら動詞はそのまま。'],
 ['「私はネコが好きではありません。」 I （　） like cats.','don\'t','doesn\'t','am not','not','I のときは don\'t ＋動詞。'],
 ['They （　） to school by bus.','go','goes','are go','going','主語が they なら動詞はそのまま。'],
 ['Do you have a dog? ― No, I （　）.','don\'t','am not','doesn\'t','not','Do ～? に「いいえ」は No, I don\'t.'],
]);
U('en','e3','中1','名詞の複数形・a / an',[
 ['I have two （　）.','dogs','dog','a dog','doges','2つ以上は複数形。dog → dogs。'],
 ['This is （　） egg.','an','a','two','many','母音（a, i, u, e, o）の音で始まる語の前は an。'],
 ['How many （　） do you have?','books','book','a book','bookes','How many のあとは複数形。'],
 ['three （　）（箱）','boxes','boxs','box','boxies','x で終わる語は es をつける。'],
 ['two （　）（子ども）','children','childs','child','childrens','child の複数形は children（形が変わる）。'],
 ['I want （　） water.','some','a','an','many','water は数えられないので a や many は使わない。'],
 ['We have five （　）.','classes','class','classs','a class','ss で終わる語は es をつける。'],
 ['two （　）（女性）','women','womans','woman','womens','woman の複数形は women。'],
]);
U('en','e4','中1','疑問詞（What / Who / Where …）',[
 ['（　） is this? ― It\'s a pen.','What','Who','Where','When','「何」は What。'],
 ['（　） is that girl? ― She is Mika.','Who','What','Where','How','「だれ」は Who。'],
 ['（　） do you live? ― I live in Ichihara.','Where','What','When','Who','「どこ」は Where。'],
 ['（　） is your birthday? ― It\'s May 5.','When','Where','Who','How','「いつ」は When。'],
 ['（　） many pens do you have?','How','What','Which','Who','数をたずねるときは How many。'],
 ['（　） bag is this? ― It\'s mine.','Whose','Who','Where','How','「だれの」は Whose。'],
 ['（　） old are you?','How','What','When','Who','年れいは How old。'],
 ['（　） do you like, tea or coffee?','Which','Who','Where','When','「どちら」は Which。'],
]);
U('en','e5','中1','三人称単数（He plays）',[
 ['He （　） tennis.','plays','play','playing','is play','主語が he / she / 1人のとき、動詞に s をつける。'],
 ['My mother （　） dinner every day.','cooks','cook','cooking','is cook','My mother は3人称単数なので cooks。'],
 ['She （　） English very well.','speaks','speak','speaking','is speak','she なので speaks。'],
 ['Ken （　） TV after dinner.','watches','watchs','watch','watching','ch で終わる語は es。watch → watches。'],
 ['（　） she like dogs?','Does','Do','Is','Are','3人称単数の疑問文は Does ＋主語＋動詞の原形。'],
 ['He （　） not have a bike.','does','do','is','are','3人称単数の否定文は does not ＋動詞の原形。'],
 ['My brother （　） his homework.','does','do','dos','doing','do の3人称単数は does。'],
 ['Mika （　） two cats.','has','have','haves','having','have の3人称単数は has。'],
]);
U('en','e6','中1','代名詞（my / me / mine）',[
 ['This is （　） bag.（私の）','my','me','I','mine','「私の～」は my。'],
 ['I know （　）.（彼を）','him','he','his','he\'s','「彼を」は him。'],
 ['That book is （　）.（彼女のもの）','hers','her','she','she\'s','「彼女のもの」は hers。'],
 ['（　） are my friends.（彼らは）','They','Them','Their','Theirs','「彼らは」は They。'],
 ['Do you know （　）?（彼女を）','her','she','hers','she\'s','「彼女を」は her。'],
 ['This is （　） house.（私たちの）','our','us','we','ours','「私たちの～」は our。'],
 ['Is this your pen? ― Yes, it\'s （　）.','mine','my','me','I','「私のもの」は mine。'],
 ['Please help （　）.（私たちを）','us','we','our','ours','「私たちを」は us。'],
]);
U('en','e7','中1','現在進行形（be ＋ ～ing）',[
 ['I am （　） in the pool now.','swimming','swim','swims','swiming','swim → swimming（m を重ねる）。'],
 ['She is （　） a book.','reading','read','reads','readed','進行形は be動詞＋～ing。'],
 ['They （　） playing soccer now.','are','is','am','do','they なので are ＋ ～ing。'],
 ['What are you （　）? ― I\'m cooking.','doing','do','does','did','「何をしているの？」は What are you doing?'],
 ['（　） he studying now?','Is','Does','Are','Do','進行形の疑問文は be動詞を前に。'],
 ['Look! The dog is （　）.','running','runs','run','runing','run → running（n を重ねる）。'],
 ['We are not （　） TV now.','watching','watch','watches','watched','否定文は be動詞＋not＋～ing。'],
 ['Is Ken sleeping? ― Yes, he （　）.','is','does','are','do','Is ～? には is で答える。'],
]);
U('en','e8','中1','助動詞 can',[
 ['I can （　） fast.','run','runs','running','ran','can のあとは動詞の原形。'],
 ['（　） you swim? ― Yes, I can.','Can','Do','Are','Is','can の疑問文は Can を前に。'],
 ['She can （　） the guitar.','play','plays','playing','played','主語が she でも can のあとは原形。'],
 ['He （　） speak Chinese.（話せない）','can\'t','doesn\'t can','isn\'t','not can','否定は can\'t（cannot）＋原形。'],
 ['（　） I use this pen? ― Sure.','Can','Am','Do','Is','「～してもいいですか」は Can I ～?'],
 ['Can Ken cook? ― No, he （　）.','can\'t','doesn\'t','isn\'t','don\'t','Can ～? には can / can\'t で答える。'],
 ['「窓を開けてくれますか。」 （　） you open the window?','Can','Are','Is','Does','「～してくれますか」は Can you ～?'],
 ['My sister can （　） well.','dance','dances','dancing','danced','can のあとは原形。'],
]);
U('en','e9','中1','過去形（一般動詞）',[
 ['I （　） tennis yesterday.','played','play','plays','playing','yesterday（昨日）なので過去形。play → played。'],
 ['She （　） to Tokyo last week.','went','goes','go','goed','go の過去形は went（不規則）。'],
 ['We （　） a movie last night.','saw','see','sees','seed','see の過去形は saw。'],
 ['（　） you study English yesterday?','Did','Do','Were','Are','過去の疑問文は Did ＋主語＋原形。'],
 ['I did not （　） breakfast this morning.','eat','ate','eats','eating','did not のあとは原形。'],
 ['He （　） a letter last Sunday.','wrote','write','writes','writed','write の過去形は wrote。'],
 ['Did Ken come? ― Yes, he （　）.','did','do','was','does','Did ～? には did で答える。'],
 ['I （　） up at six yesterday.','got','get','gets','getted','get の過去形は got。'],
]);
U('en','e10','中1','過去形（be動詞）・過去進行形',[
 ['I （　） busy yesterday.','was','were','am','is','I の過去は was。'],
 ['They （　） in the park then.','were','was','are','is','they の過去は were。'],
 ['（　） you tired last night?','Were','Was','Did','Are','you の過去は were。'],
 ['I was （　） TV at nine last night.','watching','watch','watched','watches','過去進行形は was / were ＋～ing。'],
 ['What （　） you doing then?','were','was','did','are','you なので were ＋～ing。'],
 ['She （　） not at home yesterday.','was','were','is','did','she の過去は was。'],
 ['We were （　） soccer at that time.','playing','play','played','plays','were ＋～ing。'],
 ['Was it cold yesterday? ― Yes, it （　）.','was','were','did','is','Was ～? には was で答える。'],
]);
U('en','f1','中2','未来（will / be going to）',[
 ['I （　） visit Kyoto next week.','will','am','did','was','未来のことは will ＋原形。'],
 ['It will （　） sunny tomorrow.','be','is','are','was','will のあとは原形。is の原形は be。'],
 ['I am going （　） play tennis.','to','for','will','at','be going to ＋原形。'],
 ['She is going to （　） a cake.','make','makes','made','making','be going to のあとは原形。'],
 ['（　） you help me tomorrow?','Will','Do','Did','Are','will の疑問文は Will を前に。'],
 ['We （　） going to see a movie.','are','is','will','do','we なので are going to。'],
 ['He will not come. ＝ He （　） come.','won\'t','willn\'t','doesn\'t','isn\'t','will not の短縮形は won\'t。'],
 ['What are you going to （　） this weekend?','do','doing','does','did','be going to のあとは原形 do。'],
]);
U('en','f2','中2','助動詞（must / have to / should / may）',[
 ['You （　） study hard.（しなければならない）','must','can','may','will','「～しなければならない」は must。'],
 ['You must not （　） here.（走ってはいけない）','run','runs','running','ran','must not ＋原形で「～してはいけない」。'],
 ['I have （　） clean my room.','to','for','must','at','have to ＋原形で「～しなければならない」。'],
 ['She （　） to get up early.（しなければならない）','has','have','must','is','主語が she なので has to。'],
 ['You don\'t have to （　）.（急ぐ必要はない）','hurry','hurries','hurried','hurrying','don\'t have to ＋原形で「～する必要はない」。'],
 ['You （　） go to bed early.（したほうがいい）','should','must not','may','can\'t','「～したほうがいい」は should。'],
 ['（　） I come in?（入ってもいいですか）','May','Must','Will','Should','「～してもいいですか」は May I ～?'],
 ['It （　） rain tomorrow.（ふるかもしれない）','may','must','should','has to','「～かもしれない」は may。'],
]);
U('en','f3','中2','不定詞（to ＋ 動詞の原形）',[
 ['I want （　） a doctor.','to be','be','being','am','want to ＋原形。am の原形は be。'],
 ['I went to the library （　） study.','to','for','at','in','「～するために」は to ＋原形。'],
 ['I have a lot of homework （　） do.','to','for','at','of','「するべき宿題」は homework to do。'],
 ['She likes （　） pictures.','to draw','draws','drew','draw','like to ＋原形。'],
 ['I\'m happy （　） see you.','to','for','at','of','「～してうれしい」は happy to ＋原形。'],
 ['Do you have anything （　） drink?','to','for','of','at','「何か飲むもの」は anything to drink。'],
 ['He hopes （　） abroad.','to go','go','goes','went','hope to ＋原形。'],
 ['I don\'t know what （　） do.（何をしたらよいか）','to','for','I','of','what to ＋原形で「何を～したらよいか」。'],
]);
U('en','f4','中2','動名詞（～ing）',[
 ['I enjoy （　） soccer.','playing','to play','play','played','enjoy のあとは～ing（動名詞）。'],
 ['She finished （　） her homework.','doing','to do','do','did','finish のあとは～ing。'],
 ['（　） is fun.（泳ぐことは楽しい）','Swimming','Swim','Swims','Swam','「～すること」が主語のとき～ing。'],
 ['Thank you for （　） me.','helping','help','to help','helped','前置詞 for のあとは～ing。'],
 ['My hobby is （　） pictures.','taking','take','took','takes','「～すること」は～ing。'],
 ['How about （　） shopping?','going','go','to go','went','How about ～ing? で「～するのはどう？」。'],
 ['I\'m good at （　）.','singing','sing','to sing','sang','be good at ～ing で「～が得意」。'],
 ['She is interested in （　） Japanese.','learning','learn','to learn','learned','前置詞 in のあとは～ing。'],
]);
U('en','f5','中2','接続詞（when / if / because / that）',[
 ['I was watching TV （　） my mother came home.','when','if','because','but','「～したとき」は when。'],
 ['（　） it rains tomorrow, I\'ll stay home.','If','Because','That','But','「もし～なら」は if。'],
 ['「かぜをひいていたので、家にいた。」 I stayed home （　） I had a cold.','because','if','but','or','「～なので」は because。'],
 ['I think （　） he is kind.','that','if','because','when','「～だと思う」は I think that ～。'],
 ['「急ぎなさい、さもないとおくれるよ。」 Hurry up, （　） you\'ll be late.','or','and','but','so','命令文, or ～で「さもないと～」。'],
 ['I know （　） she likes music.','that','but','or','so','「～ということを知っている」は know that ～。'],
 ['When I （　） home, it was raining.','got','get','will get','getting','過去のことなので got。'],
 ['If it （　） sunny tomorrow, let\'s play tennis.','is','will be','was','be','if の文の中は未来のことでも現在形。'],
]);
U('en','f6','中2','比較（-er / -est / as ～ as）',[
 ['Tom is （　） than Ken.','taller','tall','tallest','more tall','than があるときは比較級（-er）。'],
 ['This is the （　） mountain in Japan.','highest','higher','high','most high','the ～ in … は最上級（-est）。'],
 ['This book is （　） interesting than that one.','more','most','many','very','長い語の比較級は more ～。'],
 ['She runs （　） fastest in her class.','the','a','more','than','最上級の前には the。'],
 ['I\'m as tall （　） my brother.','as','than','so','more','as ～ as … で「…と同じくらい～」。'],
 ['I like summer （　） than winter.','better','best','more good','well','like A better than B。'],
 ['Which do you like （　）, dogs or cats?','better','more','much','best','2つをくらべるときは better。'],
 ['This is the （　） book of the three.','best','better','good','most good','good の最上級は best。'],
]);
U('en','f7','中2','受け身（be ＋ 過去分詞）',[
 ['English is （　） in many countries.','spoken','speak','spoke','speaking','受け身は be動詞＋過去分詞。speak → spoken。'],
 ['This room is （　） every day.','cleaned','clean','cleaning','cleans','be動詞＋過去分詞で「～される」。'],
 ['The letter was （　） by Mika.','written','wrote','write','writing','write の過去分詞は written。'],
 ['This temple （　） built 300 years ago.','was','is','were','did','過去の受け身は was / were ＋過去分詞。'],
 ['These pictures were （　） by him.','taken','took','take','taking','take の過去分詞は taken。'],
 ['（　） this song loved by young people?','Is','Does','Do','Are','受け身の疑問文は be動詞を前に。'],
 ['The window was （　） by Ken.','broken','broke','break','breaking','break の過去分詞は broken。'],
 ['Many stars can be （　） here.','seen','saw','see','seeing','can be ＋過去分詞。see → seen。'],
]);
U('en','f8','中2','There is ～ / 文型（give 人 物 など）',[
 ['There （　） a cat under the table.','is','are','am','be','1つのときは There is。'],
 ['There （　） many books in the room.','are','is','am','be','2つ以上のときは There are。'],
 ['（　） there a station near here?','Is','Are','Does','Do','There is の疑問文は Is there ～?'],
 ['My father gave （　） a watch.','me','I','my','mine','give 人 物。「人」は me（目的格）。'],
 ['We call him （　）.','Ken','to Ken','Ken\'s','for Ken','call A B で「AをBとよぶ」。'],
 ['This song makes me （　）.','happy','happily','happiness','to happy','make A B で「AをBにする」。B は形容詞。'],
 ['There （　） a lot of people in the park yesterday.','were','was','are','is','過去で複数なので There were。'],
 ['I\'ll show （　） some pictures.','you','your','yours','to you','show 人 物。'],
]);
U('en','g1','中3','現在完了（経験）',[
 ['I have （　） to Kyoto twice.','been','gone','went','go','「行ったことがある」は have been to。'],
 ['Have you ever （　） sushi?','eaten','ate','eat','eating','have ＋過去分詞。eat → eaten。'],
 ['I have （　） seen a panda.（一度も見たことがない）','never','ever','yet','ago','「一度も～ない」は never。'],
 ['How many times （　） you visited Okinawa?','have','did','are','do','回数をたずねる現在完了は How many times have you ～?'],
 ['She has （　） that movie three times.','seen','saw','see','seeing','see の過去分詞は seen。'],
 ['Have you ever been to Hokkaido? ― No, I （　）.','haven\'t','didn\'t','don\'t','wasn\'t','Have ～? には have / haven\'t で答える。'],
 ['I have read this book （　）.（一度）','once','ago','yet','still','「一度」は once。'],
 ['My father has （　） to America many times.','been','gone','went','go','経験は have been to。'],
]);
U('en','g2','中3','現在完了（継続・完了）',[
 ['I have lived here （　） ten years.','for','since','from','in','期間（～の間）は for。'],
 ['She has been busy （　） last week.','since','for','from','ago','始まった時点（～から）は since。'],
 ['How long （　） you known him?','have','did','are','do','How long have you ～? で「どのくらいの間」。'],
 ['I have （　） finished my homework.','already','yet','ever','since','肯定文の「もう」は already。'],
 ['Have you eaten lunch （　）?','yet','since','ago','still','疑問文の「もう」は yet。'],
 ['The train has just （　）.','left','leave','leaving','leaves','have just ＋過去分詞。leave → left。'],
 ['I haven\'t cleaned my room （　）.','yet','already','ever','never','否定文の「まだ」は yet。'],
 ['We have been friends （　） we were children.','since','for','ago','during','「～のときから」は since。'],
]);
U('en','g3','中3','分詞（名詞を後ろから説明）',[
 ['Look at the boy （　） soccer.','playing','played','plays','to plays','「～している」は～ing。'],
 ['This is a car （　） in Japan.','made','making','makes','make','「～された」は過去分詞。'],
 ['The girl （　） a red hat is my sister.','wearing','worn','wears','wear','「かぶっている」は wearing。'],
 ['I have a book （　） in English.','written','writing','wrote','writes','「書かれた」は written。'],
 ['Who is the man （　） with Ken?','talking','talked','talks','talk','「話している」は talking。'],
 ['The language （　） in Brazil is Portuguese.','spoken','speaking','speaks','spoke','「話されている」は spoken。'],
 ['Do you know the （　） baby?','sleeping','slept','sleeps','sleep','「ねている赤ちゃん」は sleeping baby。'],
 ['This is a picture （　） by my father.','taken','taking','took','takes','「とられた」は taken。'],
]);
U('en','g4','中3','関係代名詞（who / which / that）',[
 ['I have a friend （　） lives in Osaka.','who','which','what','whose','人を説明するときは who（that）。'],
 ['This is the book （　） I bought yesterday.','which','who','what','whose','ものを説明するときは which（that）。'],
 ['The girl （　） is singing is Yui.','who','which','what','where','人なので who。'],
 ['This is a dog （　） has long ears.','which','who','what','where','動物・ものは which。'],
 ['He is the man （　） I met at the station.','that','what','where','whose','人を説明する that（who）。'],
 ['The cake （　） my mother made was delicious.','that','who','what','where','ものを説明する that（which）。'],
 ['I know a boy （　） father is a pilot.','whose','who','which','that','「その人の～」は whose。'],
 ['Is this the bus （　） goes to the station?','that','who','what','where','ものを説明する that（which）。'],
]);
U('en','g5','中3','間接疑問・不定詞の発展',[
 ['I don\'t know where he （　）.','lives','does live','live','is live','文の中の疑問詞のあとはふつうの語順。'],
 ['Do you know what （　） is?','this','is this','does this','this does','間接疑問は 疑問詞＋主語＋動詞。'],
 ['Tell me when （　） come.','you will','will you','do you','did you','文の中の疑問詞のあとは 主語＋動詞。'],
 ['It is important （　） us to study.','for','of','to','with','It is ～ for 人 to …。'],
 ['It is easy for me （　） this book.','to read','read','reading','reads','It is ～ for 人 to ＋原形。'],
 ['I want you （　） me.','to help','help','helping','helped','want 人 to ～ で「人に～してほしい」。'],
 ['My mother told me （　） my room.','to clean','clean','cleaning','cleaned','tell 人 to ～ で「人に～するように言う」。'],
 ['I know how （　） this machine.','to use','use','using','used','how to ～ で「～のしかた」。'],
]);
U('en','g6','中3','仮定法（If I were ～ / I wish）',[
 ['If I （　） a bird, I could fly.','were','am','is','be','現実とちがう仮定は be動詞を were にする。'],
 ['If I had money, I （　） buy a new bike.','would','will','can','am','仮定法では would / could を使う。'],
 ['I wish I （　） swim.','could','can','will','am','I wish ～ では過去形（could）を使う。'],
 ['I wish I （　） a brother.','had','have','has','having','I wish ～ では過去形 had。'],
 ['If I （　） you, I would ask him.','were','am','are','be','If I were you で「もし私があなたなら」。'],
 ['If it （　） sunny, we could go out.','were','is','will be','be','仮定法では were を使う。'],
 ['I wish I （　） taller.','were','am','will be','be','I wish ＋主語＋were。'],
 ['If he studied harder, he （　） pass the test.','could','can','will','does','仮定法では could / would。'],
]);
