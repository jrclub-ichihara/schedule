
/* ===================== テスト範囲モード：画面 ===================== */
let SETS=[];try{SETS=JSON.parse(document.getElementById('sets').textContent||'[]')}catch(e){SETS=[]}
const RN=[10,20];
const allUnits=s=>RU[s].u;
const unitById=id=>{const s=id.split('.')[0];return RU[s]&&RU[s].u.find(u=>u.id===id)};
function rangeHome(){const sets=SETS.slice().reverse();
 modal('📚 テスト範囲モード',`<p class="note" style="font-size:12px">テストに出る範囲だけを練習しよう。まちがえた問題は、次に多めに出るよ。正解で🪙もたまる！</p>
  ${sets.length?`<div class="sec">🧑‍🏫 コーチの範囲セット</div>${sets.map(s=>`<button class="card" data-set="${esc(s.id)}"><div class="ic">${RU[s.subj]?.ic||'📝'}</div><div><h3>${esc(s.title)}</h3><p>${esc(s.grade)}・${esc(RU[s.subj]?.n||'')}・${s.qs.length}問${s.range?'・'+esc(s.range.slice(0,24)):''}</p></div><div class="st">START</div></button>`).join('')}`:''}
  <div class="sec">教科をえらぶ<small>教科書の単元から範囲を決める</small></div>
  <div class="subjgrid">${Object.entries(RU).map(([k,v])=>`<button class="subjb" data-rs="${k}"><b>${v.ic}</b>${v.n}<small>${v.u.length}単元</small></button>`).join('')}</div>
  ${COACH.ok?`<button class="btn sub" id="coachGo">🧑‍🏫 コーチ用：範囲セットを作る</button>`:''}`,el=>{
  el.querySelectorAll('[data-set]').forEach(b=>b.onclick=()=>startSet(b.dataset.set));
  el.querySelectorAll('[data-rs]').forEach(b=>b.onclick=()=>rangePick(b.dataset.rs));
  const c=el.querySelector('#coachGo');if(c)c.onclick=()=>coachHome()})}
function rangePick(subj,tab){const R=RU[subj],us=R.u;D.rsel=D.rsel||{};let sel=new Set((D.rsel[subj]||[]).filter(id=>us.some(u=>u.id===id)));
 tab=tab??Math.max(0,R.tabs.indexOf(us.find(u=>sel.has(u.id))?.g??(subj==='so'?'地理':D.settings.grade)));if(tab<0)tab=0;const n=D.rn||10;
 const opts=us.map((u,i)=>`<option value="${i}">${u.g}｜${esc(u.n)}</option>`).join('');const idx=us.map((u,i)=>sel.has(u.id)?i:-1).filter(i=>i>=0);
 const qn=subj==='ma'?'∞':us.filter(u=>sel.has(u.id)).reduce((a,u)=>a+u.q.length,0);
 modal(`${R.ic} ${R.n}：範囲をえらぶ`,`<div class="rbox"><div class="rlab">ここから</div><select id="rFrom">${opts}</select><div class="rlab">ここまで</div><select id="rTo">${opts}</select><button class="gbtn go" id="rSet">この範囲にする</button></div>
  <p class="note">または下の単元を1つずつタップして選んでもOK</p>
  <div class="tabs">${R.tabs.map((t,i)=>`<button class="tab${i===tab?' on':''}" data-tb="${i}">${t}</button>`).join('')}</div>
  <div class="ulist">${us.map((u,i)=>u.g!==R.tabs[tab]?'':`<button class="urow${sel.has(u.id)?' on':''}" data-u="${i}"><i>${sel.has(u.id)?'✓':''}</i><span>${esc(u.n)}</span><small>${u.q?u.q.length+'問':'計算'}</small></button>`).join('')}</div>
  <div class="rfoot"><div><b>${sel.size}</b> 単元をえらんだ<small>（${qn}問の中から出題）</small></div><button class="mini2" id="rClr">クリア</button></div>
  <div class="chips" style="margin-top:8px">${RN.map(k=>`<button class="chip${n===k?' on':''}" data-n="${k}">${k}問</button>`).join('')}</div>
  <div id="rGo"></div>`,el=>{
  const f=el.querySelector('#rFrom'),t=el.querySelector('#rTo');f.value=idx.length?idx[0]:0;t.value=idx.length?idx[idx.length-1]:0;
  const keep=()=>{D.rsel[subj]=[...sel];save()};
  el.querySelector('#rSet').onclick=()=>{let a=+f.value,b=+t.value;if(a>b)[a,b]=[b,a];sel=new Set(us.slice(a,b+1).map(u=>u.id));keep();sfx('tap');rangePick(subj,R.tabs.indexOf(us[b].g))};
  el.querySelectorAll('[data-tb]').forEach(b=>b.onclick=()=>rangePick(subj,+b.dataset.tb));
  el.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{const u=us[+b.dataset.u];sel.has(u.id)?sel.delete(u.id):sel.add(u.id);keep();sfx('tap');rangePick(subj,tab)});
  el.querySelector('#rClr').onclick=()=>{sel.clear();keep();rangePick(subj,tab)};
  el.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{D.rn=+b.dataset.n;save();rangePick(subj,tab)});
  el.querySelector('#rGo').appendChild(btn(sel.size?`▶ スタート（${n}問）`:'単元をえらんでね',()=>{if(!sel.size){toast('まず範囲をえらんでね');return}startRange(subj,[...sel],n)},sel.size?'go':'dis'));
  const back=btn('◀ 教科をえらびなおす',rangeHome,'sub');el.appendChild(back)})}
function weightPick(items,n){const V=D.vocab,sc=it=>{const v=V[it.id];return v?(v.ng*2-v.ok)+Math.random()*1.5:1+Math.random()};return items.slice().sort((a,b)=>sc(b)-sc(a)).slice(0,n).sort(()=>Math.random()-.5)}
function unitItems(u){return u.q.map(([q,a,w1,w2,w3,e],i)=>({id:u.id+':'+i,q,a,ws:[w1,w2,w3],e,unit:u.id,un:u.n,long:true}))}
function startRange(subj,ids,n){const us=ids.map(unitById).filter(Boolean);if(!us.length)return;let items=[];
 if(subj==='ma'){const seen=new Set();let t=0;while(items.length<n&&t++<400){const u=rpick(us),g=rpick(u.gen),[q,a,ws,e]=g();if(seen.has(q)||!ws||ws.length<3)continue;seen.add(q);items.push({id:null,q,a,ws:ws.slice(0,3),e,unit:u.id,un:u.n,long:q.length>16})}}
 else items=weightPick(us.flatMap(unitItems),n);
 const label=us.length===1?us[0].n:`${us[0].n} 〜 ${us[us.length-1].n}`;
 runQuiz({title:`${RU[subj].n}｜テスト範囲`,items,subj,label,retry:wk=>startRange(subj,wk.length?wk:ids,n),units:true})}
function startSet(id){const s=SETS.find(x=>x.id===id);if(!s)return;const items=weightPick(s.qs.map((x,i)=>({id:'set:'+s.id+':'+i,q:x.q,a:x.a,ws:x.w.slice(0,3),e:x.e||'',long:true})),Math.min(s.qs.length,20));
 runQuiz({title:s.title,items,subj:s.subj,label:s.title,retry:()=>startSet(id)})}
/* クイズ本体（テスト範囲用） */
function runQuiz(o){const qs=o.items,N=qs.length;let i=0,ok=0;const res=[];if(!N){toast('問題が見つからなかった');return}
 const show=()=>{const it=qs[i];const ch=[it.a,...it.ws].sort(()=>Math.random()-.5);const cls=it.long&&(it.q.length>14)?' long':' ja';
  modal(`${o.title} ${i+1}/${N}`,`<div class="bar">${qs.map((_,k)=>`<i class="${k<i?(res[k].c?'ok':'ng'):k===i?'cur':''}"></i>`).join('')}</div>
   ${it.un?`<div class="qs" style="margin-top:10px">📖 ${esc(it.un)}</div>`:''}<div class="q${cls}">${esc(it.q)}</div>
   <div id="cs">${ch.map((c,k)=>`<button class="ch" data-k="${k}">${esc(c)}</button>`).join('')}</div><div id="nx"></div>`,el=>{
   el.querySelectorAll('.ch').forEach(b=>b.onclick=()=>{const cs=el.querySelector('#cs');if(cs.dataset.d)return;cs.dataset.d=1;const good=ch[+b.dataset.k]===it.a;if(good)ok++;res.push({it,c:good});sfx(good?'coin':'no');
    if(it.id){const V=D.vocab;V[it.id]=V[it.id]||{ok:0,ng:0};good?V[it.id].ok++:V[it.id].ng++}
    el.querySelectorAll('.ch').forEach(x=>{if(ch[+x.dataset.k]===it.a)x.classList.add('ok');else if(x===b)x.classList.add('ng')});
    const nx=el.querySelector('#nx');nx.innerHTML=`<div class="qs" style="margin:8px 0">${good?'⭕ 正解！':'❌ おしい！ 正解は「'+esc(it.a)+'」'}</div>${it.e?`<div class="box" style="font-size:13px">${esc(it.e)}</div>`:''}`;
    nx.appendChild(btn(i<N-1?'次へ ▶':'結果を見る',()=>{if(res.length!==i+1)return;i++;i<N?show():fin()}))})})};
 const fin=()=>{D.hist.push({date:today(),ts:Date.now(),type:'range',subj:o.subj,label:o.label,score:ok,total:N});const dd=dly();let got=0;if(dd.q<5){dd.q++;got=ok;D.coins=(D.coins||0)+got}save();checkBadges();
  const miss=res.filter(r=>!r.c);let unitHtml='';
  if(o.units){const m=new Map();for(const r of res){const k=r.it.unit;const v=m.get(k)||{n:r.it.un,ok:0,t:0};v.t++;if(r.c)v.ok++;m.set(k,v)}
   unitHtml=`<div class="sec">単元ごとの結果</div>${[...m.entries()].map(([k,v])=>`<div class="ures${v.ok<v.t?' weak':''}"><span>${esc(v.n)}</span><b>${v.ok}/${v.t}</b></div>`).join('')}`}
  const weak=o.units?[...new Set(miss.map(r=>r.it.unit))]:[];
  modal('結果',`<div class="q">${ok}<span style="font-size:.45em;color:var(--sub)"> / ${N}</span></div><div class="qs">${ok===N?'全問正解！テストもバッチリ！':ok>=N*.7?'いい感じ！あと少し！':'だいじょうぶ。まちがえた問題は次に多めに出るよ'}</div>
   ${got?`<div class="coinbig">🪙 +${got}</div>`:dd.q>=5?'<p class="note" style="text-align:center">コインがもらえるのは1日5回まで。練習はいくらでもできるよ！</p>':''}${unitHtml}
   ${miss.length?`<div class="sec">まちがえた問題</div>${miss.map(r=>`<div class="box ng"><b>${esc(r.it.q)}</b><br>答え：${esc(r.it.a)}${r.it.e?`<div class="note">${esc(r.it.e)}</div>`:''}</div>`).join('')}`:''}`,el=>{
   if(o.units&&weak.length)el.appendChild(btn('🔁 にがてな単元だけもう一回',()=>o.retry(weak),'go'));else el.appendChild(btn('🔁 もう一回',()=>o.retry([]),'go'));
   el.appendChild(btn('ホームへ',closeModal,'sub'))})};
 show()}

/* ===================== コーチ用：範囲セットをつくる ===================== */
const COACH={ok:false,sample:null,art:null};
(async()=>{try{if(!window.claude||!claude.use)return;const u=await claude.use('user');if(!u||!(await u.isOwner()))return;COACH.sample=await claude.use('sample');COACH.art=await claude.use('artifact');COACH.ok=!!COACH.art}catch(e){}})();
const CDK='sougei_coach_draft';
function cdLoad(){try{return JSON.parse(localStorage.getItem(CDK)||'null')}catch(e){return null}}
function cdSave(d){try{d?localStorage.setItem(CDK,JSON.stringify(d)):localStorage.removeItem(CDK)}catch(e){}}
function coachHome(){const d=cdLoad();
 modal('🧑‍🏫 範囲セット（コーチ用）',`<p class="note">この画面はあなた（このページの持ち主）にだけ見えます。子どもたちには、公開した範囲セットだけが見えます。</p>
  ${d&&d.qs&&d.qs.length?`<button class="btn go" id="cdResume">✏️ 作りかけの下書きを続ける（${d.qs.length}問）</button>`:''}
  <button class="btn" id="cdNew">＋ 新しい範囲セットを作る</button>
  <div class="sec">公開中の範囲セット</div>${SETS.length?SETS.map(s=>`<div class="cset"><div><b>${esc(s.title)}</b><small>${esc(s.grade)}・${esc(RU[s.subj]?.n||'')}・${s.qs.length}問</small></div><button class="mini2" data-ed="${esc(s.id)}">なおす</button><button class="mini2 red" data-del="${esc(s.id)}">けす</button></div>`).join(''):'<p class="note">まだありません</p>'}`,el=>{
  const r=el.querySelector('#cdResume');if(r)r.onclick=()=>coachEdit(d);
  el.querySelector('#cdNew').onclick=()=>coachNew();
  el.querySelectorAll('[data-ed]').forEach(b=>b.onclick=()=>{const s=SETS.find(x=>x.id===b.dataset.ed);const dd={editId:s.id,subj:s.subj,grade:s.grade,title:s.title,range:s.range||'',n:s.qs.length,qs:s.qs.map(q=>({q:q.q,a:q.a,w:q.w.slice(0,3),e:q.e||''}))};cdSave(dd);coachEdit(dd)});
  el.querySelectorAll('[data-del]').forEach(b=>{let armed=false;b.onclick=()=>{if(!armed){armed=true;b.textContent='ほんとに？';return}publishSets(SETS.filter(x=>x.id!==b.dataset.del),'範囲セットをけしました')}})})}
function coachNew(){const d=cdLoad()||{};const v=(k,def)=>esc(d[k]??def);
 modal('＋ 新しい範囲セット',`<label class="f" for="cSubj">教科</label><select id="cSubj">${Object.entries(RU).map(([k,x])=>`<option value="${k}"${d.subj===k?' selected':''}>${x.n}</option>`).join('')}</select>
  <label class="f" for="cGrade">学年</label><select id="cGrade">${['中1','中2','中3'].map(g=>`<option${d.grade===g?' selected':''}>${g}</option>`).join('')}</select>
  <label class="f" for="cTitle">タイトル（子どもに見える名前）</label><input id="cTitle" maxlength="30" value="${v('title','')}" placeholder="例：2学期期末テスト 理科">
  <label class="f" for="cRange">テスト範囲（くわしく書くほど正確になります）</label><textarea id="cRange" rows="4" maxlength="600" placeholder="例：教科書 p.40〜72「化学変化と原子・分子」〜「化学変化と質量」。化学反応式と、銅・マグネシウムの酸化の質量の計算が大事">${v('range','')}</textarea>
  <label class="f" for="cN">問題数</label><select id="cN">${[10,15,20].map(k=>`<option${(d.n||15)===k?' selected':''}>${k}</option>`).join('')}</select>
  <p class="note">Claude が問題の下書きを作ります（30秒〜1分くらい）。そのあと、答えが正しいか確認してから公開してね。</p><div id="cOut"></div>`,el=>{
  const get=()=>({...d,subj:el.querySelector('#cSubj').value,grade:el.querySelector('#cGrade').value,title:el.querySelector('#cTitle').value.trim(),range:el.querySelector('#cRange').value.trim(),n:+el.querySelector('#cN').value});
  ['cSubj','cGrade','cTitle','cRange','cN'].forEach(id=>el.querySelector('#'+id).addEventListener('change',()=>cdSave(Object.assign(get(),{qs:d.qs||[]}))));
  const out=el.querySelector('#cOut');const go=btn('✨ AIで下書きを作る',async()=>{const x=get();if(!x.title||!x.range){toast('タイトルと範囲を書いてね');return}
   if(!COACH.sample){toast('この画面ではAIの下書きが使えません');return}go.disabled=true;go.textContent='作成中…（30秒〜1分）';out.innerHTML='';
   try{const qs=await aiDraft(x);const dd=Object.assign(x,{qs});cdSave(dd);coachEdit(dd)}
   catch(e){go.disabled=false;go.textContent='✨ AIで下書きを作る';out.innerHTML=`<div class="box ng">${esc(aiErr(e))}</div>`}},'go');
  out.after(go);el.appendChild(btn('◀ もどる',coachHome,'sub'))})}
function aiErr(e){const c=e&&e.code;return c==='not_granted'?'AIの利用が許可されませんでした。もう一度ためすと確認が出ます。':c==='rate_limited'?'少し時間をおいてから、もう一度ためしてね。':c==='invalid_json'?'うまく問題の形にできませんでした。範囲を短くして、もう一度ためしてね。':'下書きを作れませんでした（'+(c||'エラー')+'）。もう一度ためしてね。'}
async function aiDraft(x){const sj=RU[x.subj].n;
 const prompt=`あなたは日本の中学校の${sj}の先生です。定期テスト対策の4択問題を${x.n}問つくってください。
学年：${x.grade}
教科：${sj}
テスト範囲：${x.range}
対象：勉強が苦手な中学生。基本〜標準レベルを中心に、テストに出やすい大事なところから出題する。
ルール：
- 日本の中学校の教科書（学習指導要領）の内容どおりで、答えがひとつに決まる、まちがいのない問題にする。自信がない内容は出さない。
- 正解は1つ。まちがいの選択肢3つは、ありがちなまちがいにするが、正しくなってしまうものは入れない。4つの選択肢はすべてちがう文字にする。
- 問題文は70字以内、選択肢は25字以内、解説は60字以内。ふりがなは不要。中学生が読める言葉で書く。
- 英語の文法問題は「I （　） a student.」のように（　）を空らんにする。
- 数学は計算して答えが整数か簡単な分数・平方根になる問題にする。
- 同じ問題をくり返さない。
出力は次の形のJSONだけにする：{"questions":[{"q":"問題文","a":"正解","w":["まちがい1","まちがい2","まちがい3"],"e":"解説"}]}`;
 const r=await COACH.sample.json(prompt,{modelTier:'complex',cache:false});const arr=(r&&r.questions)||[];
 const qs=arr.map(o=>({q:String(o.q||'').trim(),a:String(o.a||'').trim(),w:(Array.isArray(o.w)?o.w:[]).map(s=>String(s).trim()).slice(0,3),e:String(o.e||'').trim()})).filter(o=>o.q&&o.a&&o.w.length===3&&new Set([o.a,...o.w]).size===4);
 if(!qs.length)throw{code:'invalid_json'};return qs}
function coachEdit(d){const bad=q=>!q.q||!q.a||q.w.length<3||q.w.some(s=>!s)||new Set([q.a,...q.w]).size<4;
 modal(`✏️ ${d.title||'範囲セット'}`,`<p class="note">AIの問題にはまちがいがまじることがあります。<b>答えが正しいか1問ずつ確認</b>してから公開してね。直したい所は、そのまま書きかえられます。</p>
  <div id="cq">${d.qs.map((q,i)=>`<div class="cq${bad(q)?' bad':''}" data-i="${i}"><div class="cqh"><b>${i+1}</b><button class="mini2 red" data-rm="${i}">けす</button></div>
   <textarea id="q${i}" rows="2" data-k="q">${esc(q.q)}</textarea><label class="f" for="a${i}">⭕ 正解</label><input id="a${i}" data-k="a" value="${esc(q.a)}">
   <label class="f">❌ まちがい</label>${[0,1,2].map(j=>`<input id="w${i}_${j}" data-k="w${j}" value="${esc(q.w[j]||'')}" aria-label="まちがい${j+1}">`).join('')}
   <label class="f" for="e${i}">解説</label><input id="e${i}" data-k="e" value="${esc(q.e||'')}"></div>`).join('')}</div>
  <button class="btn sub" id="cAdd">＋ 1問ふやす</button><div id="cPub"></div>`,el=>{
  el.querySelectorAll('.cq').forEach(box=>{const i=+box.dataset.i;box.querySelectorAll('[data-k]').forEach(inp=>inp.addEventListener('input',()=>{const k=inp.dataset.k,q=d.qs[i];if(k[0]==='w'&&k.length===2)q.w[+k[1]]=inp.value.trim();else q[k]=inp.value.trim();cdSave(d);box.classList.toggle('bad',bad(q))}))});
  el.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{d.qs.splice(+b.dataset.rm,1);cdSave(d);coachEdit(d)});
  el.querySelector('#cAdd').onclick=()=>{d.qs.push({q:'',a:'',w:['','',''],e:''});cdSave(d);coachEdit(d)};
  el.querySelector('#cPub').appendChild(btn(d.editId?'📢 なおした内容で公開する':'📢 子どもたちに公開する',()=>{const ng=d.qs.findIndex(bad);if(!d.qs.length){toast('問題が0問です');return}
   if(ng>=0){toast(`${ng+1}問目：空らんか、同じ選択肢があります`);el.querySelector(`[data-i="${ng}"]`)?.scrollIntoView({block:'center'});return}
   const set={id:d.editId||('s'+Date.now().toString(36)),title:d.title||'範囲セット',subj:d.subj,grade:d.grade,range:d.range||'',at:today(),qs:d.qs.map(q=>({q:q.q,a:q.a,w:q.w.slice(0,3),e:q.e||''}))};
   const next=d.editId?SETS.map(s=>s.id===d.editId?set:s):[...SETS,set];publishSets(next,'公開しました！',true)},'go'));
  el.appendChild(btn('◀ もどる（下書きは保存されています）',coachHome,'sub'))})}
async function publishSets(next,msg,clearDraft){if(!COACH.art){toast('ここでは公開できません');return}
 try{try{sessionStorage.setItem('sougei_msg',msg)}catch(e){}if(clearDraft){try{sessionStorage.setItem('sougei_clear',1)}catch(e){}}
  await COACH.art.publish(pageSource(next))}
 catch(e){try{sessionStorage.removeItem('sougei_msg');sessionStorage.removeItem('sougei_clear')}catch(x){}
  const c=e&&e.code;toast(c==='conflict'?'ほかの画面で更新されていました。開きなおしてもう一度ためしてね':c==='not_writer'||c==='not_granted'?'公開する権限がありません':'公開できませんでした（'+(c||'エラー')+'）')}}
(()=>{try{const m=sessionStorage.getItem('sougei_msg');if(m){sessionStorage.removeItem('sougei_msg');setTimeout(()=>toast('📢 '+m),600)}if(sessionStorage.getItem('sougei_clear')){sessionStorage.removeItem('sougei_clear');cdSave(null)}}catch(e){}})();
/* ページ全体を作りなおす（範囲セットを中に入れて公開する） */
function pageSource(sets){const q=id=>document.getElementById(id);
 return '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>'+SKEL_RESET+'</style></head><body>'+
  PAGE_HEAD+'<style id="css">'+q('css').textContent+'</style><template id="shell">'+q('shell').innerHTML+'</template><script type="application/json" id="sets">'+JSON.stringify(sets).replace(/</g,'\\u003c')+'<\/script>'+
  PAGE_LIBS+'<script id="main">'+q('main').textContent+'<\/script></body></html>'}
