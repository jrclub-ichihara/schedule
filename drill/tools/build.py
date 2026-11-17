import sys,json
import os
W=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','src');OUT=os.path.join(W,'..','dist')
H=open(W+'/head.html').read().split('\n')
L=open(W+'/base.html').read().split('\n')
s='\n'.join(L[133:531]); tail='\n'.join(L[874:])
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:70],s.count(a));s=s.replace(a,b)
# --- lobby patches (same as before) ---
rep(""" <div class="top"><div class="logo">送迎<span>ドリル</span></div><button class="sm" id="hSnd">${D.settings.sound?'🔊 音あり':'🔇 音なし'}</button></div>""",
""" <div class="top"><div class="logo">送迎<span>ドリル</span></div><div class="pill coin" title="コイン">${D.coins||0}</div><button class="sm" id="hSnd" aria-label="音">${D.settings.sound?'🔊':'🔇'}</button></div>""")
rep("""<p>${QN}問・約3分（${D.settings.grade}・${topic(D.settings.subj,D.settings.grade)}）</p>""","""<p>${QN}問・約3分（${D.settings.grade}・${topic(D.settings.subj,D.settings.grade)}）・正解で🪙</p>""")
rep(""" <div class="hero"><div class="heroT">今日の5分</div><div class="heroS">送迎の車の中・待ち時間で、サクッと1セット</div></div>""",
""" <div class="hero"><div class="heroT">今日の5分</div><div class="heroS">送迎の車の中・待ち時間で、サクッと1セット</div></div>
 <button class="card range" id="hRg"><div class="ic">📚</div><div><h3>テスト範囲モード</h3><p>テストに出る単元だけを練習${SETS.length?`・コーチのセット${SETS.length}個`:''}</p></div><div class="st">GO</div></button>""")
rep(""" <button class="card" id="hW" style="border-color:#35d07f;background:linear-gradient(90deg,#1f4a3a,var(--card) 70%)"><div class="ic">🌏</div><div><h3>ブロックワールド</h3><p>歩いて・ジャンプして・先生にクイズ！ 🪙${D.coins||0}</p></div><div class="st">GO ▶</div></button>""",
""" <div class="worldc"><div class="wcTop"><div><div class="wcT">ブロックワールド</div><div class="wcS">先生にクイズ → コインをためて、きせかえ＆家づくり！</div></div><canvas id="avc" class="avc" width="420" height="420" aria-label="じぶんのアバター"></canvas></div>
  <div class="wcC"><span>👕 ぼうし・はね・ペット</span><span>🏠 ブロックの家</span><span>🌈 くもの島</span></div>
  <button class="btn go play" id="hW">ワールドへ GO!</button><div class="wcB"><button class="btn sub" id="hWs">👕 きせかえ</button><button class="btn sub" id="hWb">🏠 家づくり</button></div></div>""")
rep("q('#hQ').onclick=quiz;q('#hW').onclick=enterW3;","q('#hQ').onclick=quiz;q('#hRg').onclick=rangeHome;q('#hW').onclick=()=>enterW3();q('#hWs').onclick=()=>enterW3('shop');q('#hWb').onclick=()=>enterW3('build');")
rep("""q('#hSnd').onclick=()=>{D.settings.sound=!D.settings.sound;save();renderHome()};""","""q('#hSnd').onclick=()=>{D.settings.sound=!D.settings.sound;save();renderHome();toast(D.settings.sound?'🔊 音あり':'🔇 音なし')};""")
rep(""" const finish=()=>{D.hist.push({date:today(),ts:Date.now(),type:'quiz',subj:sj,grade:gr,score:ok,total:N});save();checkBadges();""",
""" const finish=()=>{D.hist.push({date:today(),ts:Date.now(),type:'quiz',subj:sj,grade:gr,score:ok,total:N});const dd=dly();let got=0;if(dd.q<5){dd.q++;got=ok;D.coins=(D.coins||0)+got}save();checkBadges();""")
rep("""<div class="qs">${ok===N?'全問正解！すごい！':ok>=7?'いい感じ！':'まちがえた問題は、次に多めに出るよ'}</div>""",
"""<div class="qs">${ok===N?'全問正解！すごい！':ok>=7?'いい感じ！':'まちがえた問題は、次に多めに出るよ'}</div>${got?`<div class="coinbig">🪙 +${got}</div><p class="note" style="text-align:center">ワールドのきせかえ・家づくりに使えるよ</p>`:dd.q>=5?'<p class="note" style="text-align:center">コインがもらえるのは1日5回まで。続きはワールドの先生へ！</p>':''}""")
rep("""if(S.heard>=5){D.hist.push({date:today(),ts:Date.now(),type:'listen',grade:D.settings.grade,count:S.heard});save();checkBadges();toast(`🎧 ${S.heard}語 聞いた！おつかれさま`)}""",
"""if(S.heard>=5){D.hist.push({date:today(),ts:Date.now(),type:'listen',grade:D.settings.grade,count:S.heard});const dd=dly();let c='';if(!dd.l){dd.l=1;D.coins=(D.coins||0)+3;c=' 🪙+3'}save();checkBadges();toast(`🎧 ${S.heard}語 聞いた！${c}`)}""")
rep("""save();checkBadges();toast(studyDays().has(date)&&date===t?'⭐ 文武両道デー！':'記録しました！');closeModal()}))})}""",
"""const dd=dly();let c='';if(!dd.p){dd.p=1;D.coins=(D.coins||0)+3;c=' 🪙+3'}save();checkBadges();toast((studyDays().has(date)&&date===t?'⭐ 文武両道デー！':'記録しました！')+c);closeModal()}))})}""")
rep("""<p class="note" style="margin-top:10px">ごほうびは「やったこと」で決まります。長い時間やっても増えません。</p>""",
"""<p class="note" style="margin-top:10px">ごほうびは「やったこと」で決まります。長い時間やっても増えません。コイン：クイズとテスト範囲（あわせて1日5回まで）・聞き流し・練習記録（各1日1回）・ワールドの先生クイズ。</p>""")
rep("""Q=D.hist.filter(h=>h.type==='quiz');""","""Q=D.hist.filter(h=>h.type==='quiz'||h.type==='range');""")
rep("""<td>${h.subj?subjName(h.subj,h.grade)+'（'+h.grade+'）':'英語'}</td>""","""<td>${h.type==='range'?'📚'+esc(h.label||'テスト範囲'):h.subj?subjName(h.subj,h.grade)+'（'+h.grade+'）':'英語'}</td>""")
rep("""for(const h of qz)L.push(`・${h.subj?subjName(h.subj,h.grade)+'（'+h.grade+'）':'英語'}クイズ ${h.score}/${h.total}問 正解`);""",
"""for(const h of qz)L.push(`・${h.subj?subjName(h.subj,h.grade)+'（'+h.grade+'）':'英語'}クイズ ${h.score}/${h.total}問 正解`);for(const h of D.hist.filter(h=>h.date===ts&&h.type==='range'))L.push(`・テスト範囲「${h.label}」 ${h.score}/${h.total}問 正解`);""")
rep("if(q('#nmOk'))q('#nmOk').onclick=","if(gl)setTimeout(()=>lobbyAvatar(q('#avc')),40);else q('#avc').remove();if(!window._lobbyPopped&&window.gsap){window._lobbyPopped=1;gsap.from('#home .card,#home .hero,#home .worldc',{y:24,opacity:0,duration:.45,ease:'back.out(1.7)',stagger:.06})}\n if(q('#nmOk'))q('#nmOk').onclick=")
rep("function modal(title,html,mount){$('#mT').textContent=title;$('#mB').innerHTML=html;$('#modal').classList.remove('hidden');$('.mbox').scrollTop=0;mount&&mount($('#mB'))}",
    "function modal(title,html,mount){$('#mT').textContent=title;$('#mB').innerHTML=html;$('#modal').classList.remove('hidden');$('.mbox').scrollTop=0;mount&&mount($('#mB'));if(window.gsap)gsap.from('#mB > *',{y:14,opacity:0,duration:.32,ease:'back.out(2)',stagger:.03})}")
t0="load();if(D.unlocked)renderHome();else $('#gate').classList.remove('hidden');\n</script>\n</body>\n</html>\n"
assert tail==t0,repr(tail)
tail="load();D.unlocked=true;save();renderHome();\n"
# --- page head / css / shell ---
PAGE_HEAD='<title>送迎ドリル WORLD</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'+'\n'.join(H[5:8])+'\n'+'\n'.join(H[9:11])+'\n'
css='\n'.join(H[12:200]).replace('padding-top:calc(12px + var(--st))','padding-top:12px')+'\n'+open(W+'/extra.css').read()
shell='\n'.join(H[203:])
PAGE_LIBS='<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>'
SKEL_RESET=open(W+'/skel_reset.txt').read().strip() if __import__('os').path.exists(W+'/skel_reset.txt') else ':root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px/1.4 system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}'
js_const=lambda v:json.dumps(v,ensure_ascii=False).replace('</','<\\/')
main=("'use strict';document.body.appendChild(document.getElementById('shell').content.cloneNode(true));\n"
 f"const PAGE_HEAD={js_const(PAGE_HEAD)},PAGE_LIBS={js_const(PAGE_LIBS)},SKEL_RESET={js_const(SKEL_RESET)};\n"
 +s+'\n'+''.join(open(W+'/'+f).read() for f in ['w1.js','w2.js','w3.js','w4.js','u_data1.js','u_data2.js','u_logic.js','u_ui.js'])+'\n'+tail)
assert '</script' not in main.replace('<\\/script','')
sets=open(W+'/sets.json').read().strip().replace('<','\\u003c')
out=PAGE_HEAD+'<style id="css">'+css+'</style><template id="shell">'+shell+'</template><script type="application/json" id="sets">'+sets+'</script>'+PAGE_LIBS+'<script id="main">'+main+'</script>'
open(OUT+'/world.html','w').write(out);print('built',len(out))
open(OUT+'/world_test.html','w').write('<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>'+SKEL_RESET+'</style></head><body>'+out+'</body></html>')
