
/* ===================== コイン・ごほうび ===================== */
function dly(){if(!D.daily||D.daily.d!==today())D.daily={d:today(),q:0,l:0,p:0,b:0,o:0,c:0};return D.daily}
function coinFx(n){if(!P)return;for(let i=0;i<Math.min(16,4+n*2);i++)part({x:P.x,y:P.y+2.6,z:P.z,vx:(R2()-.5)*4,vy:4+R2()*4,vz:(R2()-.5)*4,g:12,life:1,s:.42,c:[1,.85,.2],tex:STAR})}
function addCoins(n){if(n<=0)return;D.coins=(D.coins||0)+n;save();if(W3.on){sfx('coin');coinFx(n);flyCoins(n);setTimeout(()=>w3Hud(true),900)}}
function confetti(x,y,z){burst(x,y,z,46,CONF,{tex:SQR,sp:5,up:8,g:10,life:1.5,s:.2})}
function cheer(e){if(!P)return;P.cheer=1.4;P.say(e);confetti(P.x,P.y+2.4,P.z)}

/* ---------- 会話・ミニクイズ ---------- */
function zoneTalk(k){const g=D.settings.grade;sfx('tap');if(!avail(k,g)){modal(NPCN[k],`<p style="font-size:16px">${ZN[k][1]}へようこそ！</p><p class="note">${SUBJ[k].n}は小3からだよ。ほかのゾーンにも行ってみてね。</p>`,el=>el.appendChild(btn('OK',closeW3Modal)));return}
 modal(NPCN[k],`<p style="font-size:16px">${ZN[k][1]}へようこそ！<br>${g}の${subjName(k,g)}、3問チャレンジしてみる？</p><div class="coinrow"><span class="pill coin">🪙 ×1</span>正解1問ごとに1コイン</div>`,el=>{el.appendChild(btn('チャレンジ！',()=>miniQuiz(k),'go'));el.appendChild(btn('あとで',closeW3Modal,'sub'))})}
function miniQuiz(k){const g=D.settings.grade,qs=buildQuiz(k,g,3);let i=0,ok=0;
 const show=()=>{const it=qs[i];const ch=[it.a,...it.ws].sort(()=>Math.random()-.5);
  modal(`${ZN[k][1]} ${i+1}/3`,`<div class="qs">${esc(it.sub||'答えはどれ？')}</div><div class="q${(it.long||it.q.length>14)?' long':it.ja?' ja':''}">${esc(it.q)}</div><div id="cs">${ch.map((c,n)=>`<button class="ch" data-n="${n}">${esc(c)}</button>`).join('')}</div><div id="nx"></div>`,el=>{
   if(it.speak&&it.speakNow)say(it.speak,'en',.9);
   el.querySelectorAll('.ch').forEach(b=>b.onclick=()=>{const cs=el.querySelector('#cs');if(cs.dataset.d)return;cs.dataset.d=1;const good=ch[+b.dataset.n]===it.a;if(good){ok++;sfx('coin')}else sfx('no');
    if(it.id){const V=D.vocab;V[it.id]=V[it.id]||{ok:0,ng:0};good?V[it.id].ok++:V[it.id].ng++}
    el.querySelectorAll('.ch').forEach(x=>{if(ch[+x.dataset.n]===it.a)x.classList.add('ok');else if(x===b)x.classList.add('ng')});
    const nx=el.querySelector('#nx');nx.innerHTML=`<div class="qs" style="margin:8px 0">${good?'⭕ 正解！ 🪙+1':'❌ おしい！'}</div>${it.e?`<div class="box" style="font-size:13px">${esc(it.e)}</div>`:''}`;
    nx.appendChild(btn(i<2?'次へ ▶':'おわり',()=>{i++;i<3?show():fin()}))})})};
 const fin=()=>{save();modal('けっか',`<div class="q">${ok}<span style="font-size:.45em;color:var(--sub)"> / 3</span></div><div class="coinbig">🪙 +${ok}</div>`,el=>el.appendChild(btn('ワールドにもどる',()=>{closeW3Modal();if(ok){addCoins(ok);cheer(ok===3?'🎉':'👍')}else P&&P.say('💪')},'go')))};show()}
function obbyGoal(){const d=dly();if(d.o){modal('ゴール！','<p>今日のゴールボーナスはもらったよ。明日またチャレンジしてね！</p>',el=>el.appendChild(btn('OK',closeW3Modal)));return}
 d.o=1;addCoins(3);cheer('🏆');modal('ゴール！🏆','<p style="font-size:16px">アスレチック クリア！</p><div class="coinbig">🪙 +3</div><p class="note">ゴールボーナスは1日1回</p>',el=>el.appendChild(btn('やったー！',closeW3Modal,'go')))}
function cloudGoal(){const d=dly();if(d.c){modal('くもの島','<p>今日のボーナスはもらったよ。また明日！</p>',el=>el.appendChild(btn('OK',closeW3Modal)));return}
 d.c=1;addCoins(5);cheer('🌈');modal('くもの島 とうちゃく！🌈','<p style="font-size:16px">空の上まで来たね！</p><div class="coinbig">🪙 +5</div><p class="note">くもの島ボーナスは1日1回</p>',el=>el.appendChild(btn('やったー！',closeW3Modal,'go')))}
function plazaBonus(){const d=dly();if(d.b){P.say('また明日！');sfx('no');return}d.b=1;addCoins(2);cheer('🪙');toast('🪙 きょうのボーナス +2')}
function closeW3Modal(){hush();$('#modal').classList.add('hidden')}

/* ===================== きせかえショップ ===================== */
const SHOP={open:false,tab:0,try:null,sel:null};
const swatch=id=>id==='rainbow'?'linear-gradient(135deg,#ff5a6a,#ffd23a,#35d07f,#39c2ff,#9b59d0)':id==='gold'?'linear-gradient(135deg,#fff0a0,#ffc21a 55%,#c98a00)':id;
function popIn(sel){if(window.gsap)gsap.from(sel,{scale:.55,opacity:0,duration:.34,ease:'back.out(2.2)',stagger:.018})}
function openShop(){if(BUILD.on)exitBuild();SHOP.open=true;SHOP.try=Object.assign({},D.av);SHOP.sel=null;cam.mode='show';W3el.classList.add('m-shop');$('#shop').classList.remove('hidden');P.rot=0;renderShop();sfx('tap');if(window.gsap){gsap.from('#shop',{y:260,duration:.45,ease:'back.out(1.4)'});popIn('#shop .it')}}
function closeShop(){SHOP.open=false;cam.mode='play';W3el.classList.remove('m-shop');$('#shop').classList.add('hidden');P.set(avCfg(D.av));syncPets()}
function renderShop(){const c=WEAR[SHOP.tab],T=SHOP.try;
 const tabs=WEAR.map((w,i)=>`<button class="tab${i===SHOP.tab?' on':''}" data-t="${i}">${w.n}</button>`).join('');
 const grid=c.it.map((it,n)=>{const[id,nm,pr,ic]=it,own=pr===0||owns(c.k+':'+id),on=T[c.k]===id;
  return`<button class="it${on?' on':''}${own?'':' lock'}" data-i="${n}">${c.col?`<i class="sw" style="background:${swatch(id)}"></i>`:`<span class="em">${ic}</span>`}${nm?`<b>${nm}</b>`:''}<span class="pr">${on?'そうび中':own?'もってる':'🪙'+pr}</span></button>`}).join('');
 const extra=c.k==='design'?`<div class="numrow">せばんごう <button class="mini" data-nm="-1">－</button><b>${T.num}</b><button class="mini" data-nm="1">＋</button></div>`:'';
 const s=SHOP.sel,hint=s?`<div class="buybar"><div><b>${esc(s.nm)}</b><small>${D.coins>=s.pr?'ためしに着てるよ':'あと 🪙'+(s.pr-D.coins)+' でかえる'}</small></div><button class="gbtn ${D.coins>=s.pr?'go':'dis'}" id="buy">🪙${s.pr} かう</button></div>`:`<div class="buybar dim"><small>タップでためしに着られるよ。キャラはドラッグで回せる</small></div>`;
 const el=$('#shop');el.innerHTML=`<div class="sh-h"><div class="sh-t ol">きせかえ</div><div class="pill coin">${D.coins}</div><button class="gbtn go" id="shX">できた！</button></div><div class="tabs">${tabs}</div><div class="grid">${grid}</div>${extra}${hint}`;
 el.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{SHOP.tab=+b.dataset.t;sfx('tap');renderShop();el.querySelector('.grid').scrollTop=0;popIn('#shop .it')});
 el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const it=c.it[+b.dataset.i],[id,nm,pr]=it,own=pr===0||owns(c.k+':'+id);T[c.k]=id;P.set(avCfg(T));syncPets();P.cheer=.5;sfx('tap');
  if(own){D.av[c.k]=id;save();SHOP.sel=null}else SHOP.sel={k:c.k,id,pr,nm:nm||c.n};renderShop()});
 el.querySelectorAll('[data-nm]').forEach(b=>b.onclick=()=>{const v=((T.num+ +b.dataset.nm)%100+100)%100;T.num=D.av.num=v;save();P.set(avCfg(T));renderShop()});
 const by=el.querySelector('#buy');if(by)by.onclick=()=>{const s=SHOP.sel;if(D.coins<s.pr){sfx('no');toast(`あと 🪙${s.pr-D.coins} 。クイズでコインをためよう！`);return}
  D.coins-=s.pr;D.own[s.k+':'+s.id]=1;D.av[s.k]=s.id;save();sfx('buy');cheer('✨');w3Hud(true);toast(`✨「${s.nm}」をゲット！`);SHOP.sel=null;renderShop()};
 el.querySelector('#shX').onclick=closeShop}

/* ===================== 家づくりモード ===================== */
const BUILD={on:false,tool:'put',tab:0,sel:1,rot:0,g:null,undo:[],clr:false};
const unlocked=b=>b.p===0||owns('b:'+b.id);
function enterBuild(){if(SHOP.open)closeShop();BUILD.on=true;BUILD.g=null;BUILD.clr=false;cam.mode='build';W3el.classList.add('m-build');$('#build').classList.remove('hidden');
 P.x=PX0+PN/2;P.z=PZ0+PN+1.6;P.y=0;P.vy=0;P.rot=Math.PI;renderBuild();sfx('tap');if(window.gsap){gsap.from('#build .bd-bot',{y:220,duration:.45,ease:'back.out(1.4)'});gsap.from('#build .bd-top',{y:-80,duration:.4,ease:'back.out(1.6)'})}}
function exitBuild(){BUILD.on=false;cam.mode='play';W3el.classList.remove('m-build');$('#build').classList.add('hidden');save();
 P.x=PX0+PN/2;P.z=PZ0+PN+1.6;P.y=0;P.vy=0;P.rot=0}
function renderBuild(){const items=BL.filter(b=>b.t===BUILD.tab);
 const tools=[['put','🧱','おく'],['erase','🧽','けす'],['rot','🔄','まわす']].map(([k,i,n])=>`<button class="tool${BUILD.tool===k?' on':''}" data-tl="${k}"><b>${i}</b>${n}</button>`).join('')+
  `<button class="tool" id="bU"${BUILD.undo.length?'':' disabled'}><b>↩️</b>もどす</button><button class="tool${BUILD.clr?' warn':''}" id="bC"><b>🗑️</b>${BUILD.clr?'ほんとに？':'ぜんぶ'}</button>`;
 const pal=items.map(b=>{const u=unlocked(b),on=BUILD.sel===b.n&&BUILD.tool==='put';
  return`<button class="it${on?' on':''}${u?'':' lock'}" data-b="${b.n}">${b.ic?`<span class="em">${b.ic}</span>`:`<i class="sw blk" style="background:${b.id==='rainbow'?swatch('rainbow'):b.c}"></i>`}<b>${b.nm}</b><span class="pr">${u?(b.p?'もってる':'むりょう'):'🪙'+b.p}</span></button>`}).join('');
 const el=$('#build');el.innerHTML=`<div class="bd-top"><div class="sh-t ol">🏠 マイホーム</div><div class="pill coin">${D.coins}</div><button class="gbtn go" id="bX">できた！</button></div>
  <div class="bd-bot"><div class="tools">${tools}</div><div class="tabs">${BTABS.map((t,i)=>`<button class="tab${i===BUILD.tab?' on':''}" data-bt="${i}">${t}</button>`).join('')}</div><div class="pal">${pal}</div>
  <div class="bd-hint">${BUILD.tool==='put'?'置きたい場所をタップ。ブロックの上にもつめるよ':BUILD.tool==='erase'?'けしたいブロックをタップ':'回したい家具ややねをタップ'}　・ドラッグで回す／ピンチでズーム</div></div>`;
 el.querySelectorAll('[data-tl]').forEach(b=>b.onclick=()=>{BUILD.tool=b.dataset.tl;BUILD.clr=false;sfx('tap');renderBuild()});
 el.querySelectorAll('[data-bt]').forEach(b=>b.onclick=()=>{BUILD.tab=+b.dataset.bt;sfx('tap');renderBuild();popIn('#build .pal .it')});
 el.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{const d=BLN[+b.dataset.b];
  if(!unlocked(d)){if(D.coins<d.p){sfx('no');toast(`「${d.nm}」は 🪙${d.p}。あと 🪙${d.p-D.coins}！`);return}
   D.coins-=d.p;D.own['b:'+d.id]=1;save();sfx('buy');toast(`🔓「${d.nm}」をアンロック！`);w3Hud(true)}
  BUILD.sel=d.n;BUILD.tool='put';BUILD.rot=0;sfx('tap');renderBuild()});
 el.querySelector('#bU').onclick=()=>{const u=BUILD.undo.pop();if(!u)return;for(const[idx,prev]of u)setVox(idx,prev);rebuildHouse();save();sfx('erase');renderBuild()};
 el.querySelector('#bC').onclick=()=>{if(!BUILD.clr){BUILD.clr=true;renderBuild();return}const u=[];for(let n=0;n<VOX.length;n++)if(VOX[n]){u.push([n,VOX[n]]);setVox(n,0)}BUILD.undo.push(u);BUILD.clr=false;rebuildHouse();save();sfx('erase');renderBuild()};
 el.querySelector('#bX').onclick=exitBuild}
function nrm(v){const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l]}
function crs(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function screenRay(sx,sy){const r=cv.getBoundingClientRect(),x=((sx-r.left)/r.width)*2-1,y=1-((sy-r.top)/r.height)*2;
 const f=nrm([cam.tx-cam.x,cam.ty-cam.y,cam.tz-cam.z]),rt=nrm(crs(f,[0,1,0])),u=crs(rt,f),th=Math.tan(FOV/2),as=r.width/r.height;
 return{o:[cam.x,cam.y,cam.z],d:nrm([0,1,2].map(a=>f[a]+rt[a]*x*th*as+u[a]*y*th))}}
function pick(sx,sy){const{o,d}=screenRay(sx,sy),oo=[o[0]-PX0,o[1]-PY0,o[2]-PZ0],lo=[0,-1,0],hi=[PN,PH,PN];let t0=0,t1=1e9;
 for(let a=0;a<3;a++){if(Math.abs(d[a])<1e-9){if(oo[a]<lo[a]||oo[a]>hi[a])return null;continue}let ta=(lo[a]-oo[a])/d[a],tb=(hi[a]-oo[a])/d[a];if(ta>tb)[ta,tb]=[tb,ta];t0=Math.max(t0,ta);t1=Math.min(t1,tb)}
 if(t0>t1)return null;const p=oo.map((v,a)=>v+d[a]*(t0+1e-4)),c=p.map((v,a)=>clamp(Math.floor(v),lo[a],hi[a]-1)),st=d.map(Math.sign),tD=d.map(v=>Math.abs(1/(v||1e-9))),
  tM=c.map((ci,a)=>d[a]>0?(ci+1-p[a])*tD[a]:(p[a]-ci)*tD[a]);let prev=null;
 for(let n=0;n<240;n++){const[i,j,k]=c;if(i<0||k<0||i>=PN||k>=PN||j>=PH||j<-1)return null;if(j===-1)return prev?{hit:null,place:prev}:null;
  if(VOX[vi(i,j,k)])return{hit:[i,j,k],place:prev};prev=[i,j,k];const a=tM[0]<tM[1]?(tM[0]<tM[2]?0:2):(tM[1]<tM[2]?1:2);c[a]+=st[a];tM[a]+=tD[a]}return null}
function buildTap(sx,sy){const r=pick(sx,sy);if(!r){sfx('no');return}
 if(BUILD.tool==='put'){if(!r.place){sfx('no');return}const[i,j,k]=r.place,idx=vi(i,j,k);const d=BLN[BUILD.sel];BUILD.undo.push([[idx,VOX[idx]]]);setVox(idx,d.n*4+((d.furn||d.wedge)?BUILD.rot:0));
  rebuildHouse();sfx('place');burst(PX0+i+.5,PY0+j+.5,PZ0+k+.5,10,[[1,1,1],hex(d.c||'#ffd23a')],{tex:SQR,sp:3,up:3,life:.5,s:.16})}
 else if(r.hit){const[i,j,k]=r.hit,idx=vi(i,j,k),c=VOX[idx],d=BLN[c>>2];
  if(BUILD.tool==='erase'){BUILD.undo.push([[idx,c]]);setVox(idx,0);rebuildHouse();sfx('erase');burst(PX0+i+.5,PY0+j+.5,PZ0+k+.5,14,[hex(d.c||'#c58a4a')],{tex:SQR,sp:3,up:4,life:.6,s:.2})}
  else if(d.furn||d.wedge){BUILD.undo.push([[idx,c]]);setVox(idx,(c&~3)|((c+1)&3));rebuildHouse();sfx('tap')}else sfx('no')}
 if(BUILD.undo.length>60)BUILD.undo.shift();save();if(isTouch)BUILD.g=null;renderBuild()}
function ghostParts(out){const g=BUILD.g;if(!g)return;
 if(BUILD.tool==='put'&&g.place){const[i,j,k]=g.place,d=BLN[BUILD.sel],base=M4.mul(M4.T(PX0+i+.5,PY0+j,PZ0+k+.5),M4.RY(BUILD.rot*Math.PI/2));
  if(d.furn){for(const f of d.furn)out.push(f[0]==='s'?{g:gpu(gSph(f[1],8,6)),m:M4.mul(base,M4.T(f[2],f[3],f[4])),c:H4(f[5],.3)}:{g:gpu(gBox(f[0],f[1],f[2],0,f[1]/2,0)),m:M4.mul(base,M4.T(f[3],f[4],f[5])),c:H4(f[6],.3)})}
  else out.push({g:gpu(d.wedge?gWedge():gBox(1,d.low?.85:1,1,0,(d.low?.85:1)/2,0)),m:base,c:H4(d.c,.3)});
  out.push({g:gpu(gBox(1.04,.03,1.04,0,.015,0)),m:M4.T(PX0+i+.5,PY0+j+.002,PZ0+k+.5),c:[1,1,1,1]})}
 else if(BUILD.tool!=='put'&&g.hit){const[i,j,k]=g.hit;out.push({g:gpu(gBox(1.06,1.06,1.06,0,.53,0)),m:M4.T(PX0+i+.5,PY0+j-.03,PZ0+k+.5),c:BUILD.tool==='erase'?[1,.25,.3,.6]:[.3,.8,1,.6]})}}

/* ===================== 入る・出る ===================== */
const W3el=$('#w3');const PETS=[];
function syncPets(){const all=[P,...BOTS],keep=PETS.splice(0);for(const c of all){if(!c||c.cfg.pet==='none')continue;const old=keep.find(p=>p.own===c);
 PETS.push(old?Object.assign(old,{type:c.cfg.pet}):{own:c,type:c.cfg.pet,x:c.x+1,y:c.y,z:c.z+1,rot:0,ph:0,mv:0})}}
function enterW3(opt){if(!gl){toast('この端末では3Dが使えません');return}avFix();W3el.classList.remove('hidden');$('#home').classList.add('hidden');
 if(!W3.built){try{if(!PC){initGL();initTex()}buildW3();INTER.push({x:0,z:0,y:1,r:2.6,label:'ボーナス',sub:'1日1回 🪙2',fn:plazaBonus});loadHouse();if(!D.house||!D.house.b){tplHouse();save()}}
  catch(e){toast('3Dの準備に失敗しました');console.error(e);exitW3();return}}
 if(!P)P=new Char(avCfg(D.av),{style:'player'});else P.set(avCfg(D.av));P.x=0;P.z=5.5;P.y=0;P.vy=0;P.rot=0;P.dj=0;syncPets();
 cam.mode='play';cam.tx=P.x;cam.ty=1;cam.tz=P.z;cam.dd=cam.dist;cam.pitch=.92;cam.yaw=0;
 W3.on=true;resizeW3();w3Hud();last3=performance.now();requestAnimationFrame(loop3);
 if(opt==='shop')openShop();else if(opt==='build')enterBuild();
 else if(!D.w3seen2){D.w3seen2=true;save();setTimeout(()=>modal('ようこそ！ブロックワールドへ',`<div class="welc"><p>🧑‍🏫 色のついたゾーンの先生に話しかけると<b>3問クイズ</b>。正解でコインがたまるよ。</p><p>👕 コインで<b>きせかえ</b>（ぼうし・はね・ペット…）</p><p>🏠 コインで<b>ブロックの家</b>をつくれるよ</p><p>🌈 ジャンプ台やアスレチックにもボーナスがあるよ</p></div>`,el=>el.appendChild(btn('あそぶ！',closeW3Modal,'go'))),400)}}
function exitW3(){if(SHOP.open)closeShop();if(BUILD.on)exitBuild();W3.on=false;W3el.classList.add('hidden');$('#home').classList.remove('hidden');renderHome()}
let coinShown=-1;
function w3Hud(bump){const c=D.coins||0;$('#w3coin').textContent=c;if(bump&&c!==coinShown){const p=$('#w3coinP');p.classList.remove('bump');void p.offsetWidth;p.classList.add('bump')}coinShown=c}
function resizeW3(){const dpr=Math.min(devicePixelRatio||1,isTouch?1.35:1.6);cv.width=Math.round(innerWidth*dpr);cv.height=Math.round(innerHeight*dpr)}
addEventListener('resize',()=>{if(W3.on)resizeW3()});

/* ---------- 操作 ---------- */
const keys={};let jumpQ=false,jumpHeld=false,joy={x:0,y:0,id:null};
const modalClosed=()=>$('#modal').classList.contains('hidden');
addEventListener('keydown',e=>{if(!W3.on||/INPUT|TEXTAREA/.test(e.target.tagName))return;keys[e.code]=true;
 if(e.code==='Space'){if(!e.repeat)jumpQ=true;jumpHeld=true;e.preventDefault()}
 if((e.code==='KeyE'||e.code==='Enter')&&curI&&modalClosed()&&!SHOP.open&&!BUILD.on)curI.fn();
 if(e.code==='KeyR'&&BUILD.on){BUILD.rot=(BUILD.rot+1)&3}
 if(e.code==='Escape'){if(SHOP.open)closeShop();else if(BUILD.on)exitBuild()}});
addEventListener('keyup',e=>{keys[e.code]=false;if(e.code==='Space')jumpHeld=false});
const ptrs=new Map();let tapStart=null;
cv.addEventListener('pointerdown',e=>{ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});if(ptrs.size===1)tapStart={x:e.clientX,y:e.clientY,t:performance.now(),moved:false};else tapStart=null});
cv.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);
 if(!p){if(BUILD.on&&e.pointerType==='mouse')BUILD.g=pick(e.clientX,e.clientY);return}
 const dx=e.clientX-p.x,dy=e.clientY-p.y;if(tapStart&&Math.hypot(e.clientX-tapStart.x,e.clientY-tapStart.y)>9)tapStart.moved=true;
 if(ptrs.size===1&&(!tapStart||tapStart.moved)){if(BUILD.on){cam.byaw-=dx*.008;cam.bp=clamp(cam.bp+dy*.005,.35,1.35);BUILD.g=null}else if(SHOP.open){P.rot+=dx*.012}}
 else if(ptrs.size===2){const o=[...ptrs.entries()].find(([k])=>k!==e.pointerId)[1];const d0=Math.hypot(p.x-o.x,p.y-o.y),d1=Math.hypot(e.clientX-o.x,e.clientY-o.y);
  if(d1>0){if(BUILD.on)cam.bdist=clamp(cam.bdist*d0/d1,12,40);else if(!SHOP.open)cam.dist=clamp(cam.dist*d0/d1,11,28)}}
 p.x=e.clientX;p.y=e.clientY});
/* 画面の大きさが変わったら仕上げ用のバッファも作りなおす */
const pend=e=>{const had=ptrs.delete(e.pointerId);if(had&&e.type==='pointerup'&&tapStart&&!tapStart.moved&&BUILD.on&&performance.now()-tapStart.t<600)buildTap(e.clientX,e.clientY);if(!ptrs.size)tapStart=null};
['pointerup','pointercancel','pointerleave'].forEach(n=>cv.addEventListener(n,pend));
cv.addEventListener('wheel',e=>{if(BUILD.on)cam.bdist=clamp(cam.bdist*(1+e.deltaY*.001),12,40);else if(!SHOP.open)cam.dist=clamp(cam.dist*(1+e.deltaY*.001),11,28);e.preventDefault()},{passive:false});
const JY=$('#joy'),KN=$('#knob');
JY.addEventListener('pointerdown',e=>{joy.id=e.pointerId;JY.setPointerCapture(e.pointerId);jm(e);e.preventDefault()});
JY.addEventListener('pointermove',e=>{if(e.pointerId===joy.id)jm(e)});
const je=e=>{if(e.pointerId!==joy.id)return;joy={x:0,y:0,id:null};KN.style.transform=''};JY.addEventListener('pointerup',je);JY.addEventListener('pointercancel',je);
function jm(e){const r=JY.getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const m=r.width*.38,l=Math.hypot(dx,dy);if(l>m){dx*=m/l;dy*=m/l}joy.x=dx/m;joy.y=dy/m;KN.style.transform=`translate(${dx}px,${dy}px)`}
const BJ=$('#bJump');BJ.addEventListener('pointerdown',e=>{jumpQ=true;jumpHeld=true;BJ.setPointerCapture(e.pointerId);e.preventDefault()});
['pointerup','pointercancel'].forEach(n=>BJ.addEventListener(n,()=>{jumpHeld=false}));
$('#bAct').addEventListener('pointerdown',e=>{e.preventDefault();if(curI&&modalClosed())curI.fn()});
$('#bExit').onclick=()=>{sfx('tap');exitW3()};$('#bShop').onclick=()=>openShop();$('#bHome').onclick=()=>enterBuild();

/* ---------- ループ ---------- */
let last3=0,t3=0,trailT=0;
function phys(ch,mx,mz,dt){const nx=ch.x+mx*dt;if(!blocked(nx,ch.z,ch.y))ch.x=nx;const nz=ch.z+mz*dt;if(!blocked(ch.x,nz,ch.y))ch.z=nz;
 const py=ch.y;ch.vy-=26*dt;ch.y+=ch.vy*dt;if(ch.vy>0){const c=ceilAt(ch.x,ch.z,py);if(ch.y+TALL>c){ch.y=c-TALL;ch.vy=0}}
 const g=groundAt(ch.x,ch.z,Math.max(py,ch.y)),was=ch.ground;ch.land=0;if(ch.y<=g){if(!was)ch.land=-ch.vy;ch.y=g;ch.vy=0;ch.ground=true}else ch.ground=ch.y-g<.02;ch.gy=g;
 ch.sq=Math.max(0,(ch.sq||0)-dt*1.4);if(ch.land>4)ch.sq=Math.min(.24,ch.land*.02);
 const sp=Math.hypot(mx,mz);ch.walk=lerp(ch.walk,sp>.6?1:0,Math.min(1,dt*10));ch.phase+=dt*sp*1.55}
function trail(c,dt){const f=c.cfg.fx;if(f==='none'||c.walk<.4&&c.ground)return;c.tr=(c.tr||0)-dt;if(c.tr>0)return;c.tr=.055;
 const b={x:c.x+(R2()-.5)*.5,y:c.y+.3+R2()*.6,z:c.z+(R2()-.5)*.5};
 if(f==='spark')part(Object.assign(b,{vy:1.2,g:0,life:.7,s:.34,c:[1,.92,.4],tex:STAR,grow:-.3}));
 else if(f==='heart')part(Object.assign(b,{vy:1.6,g:0,life:.9,s:.34,c:[1,.42,.62],tex:HEART}));
 else if(f==='rainbow')part(Object.assign(b,{y:c.y+.15,vy:.2,g:0,life:1.1,s:.3,c:hsv((t3*.6)%1,.8,1),tex:SQR}));
 else if(f==='fire')part(Object.assign(b,{vy:2.4,g:-1,life:.55,s:.42,c:R2()<.5?[1,.55,.1]:[1,.85,.25],tex:DOT,grow:-.5}))}
function stepBots(dt){for(const b of BOTS){if(b.bubbleT>0)b.bubbleT-=dt;if(b.cheer>0)b.cheer-=dt;let mx=0,mz=0;
 if(b.wait>0){b.wait-=dt}else{const dx=b.tx-b.x,dz=b.tz-b.z,d=Math.hypot(dx,dz);
  if(d<1||b.stuck>1.4){const w=WP[Math.floor(R2()*WP.length)];b.tx=w[0]+(R2()-.5)*3;b.tz=w[1]+(R2()-.5)*3;b.wait=1+R2()*3;b.stuck=0;if(R2()<.35)b.say(['👋','😄','🎵','⭐','📚','🔥'][Math.floor(R2()*6)])}
  else{mx=dx/d*4.2;mz=dz/d*4.2;b.rot=lerpAng(b.rot,Math.atan2(mx,mz),Math.min(1,dt*8));if(R2()<dt*.25&&b.ground)b.vy=9}}
 const ox=b.x,oz=b.z;phys(b,mx,mz,dt);if(mx||mz){const m=Math.hypot(b.x-ox,b.z-oz)/dt;b.stuck=m<1.2?b.stuck+dt:0}trail(b,dt)}}
function stepPets(dt){for(const p of PETS){const o=p.own,fx=-Math.sin(o.rot),fz=-Math.cos(o.rot);const tx=o.x+fx*1.5+fz*.9,tz=o.z+fz*1.5-fx*.9;const dx=tx-p.x,dz=tz-p.z,d=Math.hypot(dx,dz);
 if(d>14){p.x=tx;p.z=tz}const sp=d>.25?Math.min(d*3.2,11):0;if(sp){p.x+=dx/d*sp*dt;p.z+=dz/d*sp*dt;p.rot=lerpAng(p.rot,Math.atan2(dx,dz),Math.min(1,dt*8))}
 p.mv=lerp(p.mv,sp>.6?1:0,Math.min(1,dt*8));p.ph+=dt*(4+sp*1.6);p.y=lerp(p.y,o.gy??0,Math.min(1,dt*6))}}
function loop3(now){if(!W3.on)return;const dt=Math.min(.05,(now-last3)/1000);last3=now;t3+=dt;const rc=hsv((t3*.15)%1,.75,1);RBC=[rc[0],rc[1],rc[2],.3];
 const free=modalClosed()&&!SHOP.open&&!BUILD.on;let ix=0,iz=0;if(free){ix=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joy.x;iz=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-joy.y}
 let l=Math.hypot(ix,iz);if(l>1){ix/=l;iz/=l;l=1}
 const fx=-Math.sin(cam.yaw),fz=-Math.cos(cam.yaw),rx=Math.cos(cam.yaw),rz=-Math.sin(cam.yaw);let mx=(fx*iz+rx*ix)*7.5,mz=(fz*iz+rz*ix)*7.5;
 if(l>.08)P.rot=lerpAng(P.rot,Math.atan2(mx,mz),Math.min(1,dt*12));
 if(P.push){if(P.ground&&P.push.t>.15)P.push=null;else{P.push.t+=dt;mx=mx*.4+P.push.vx;mz=mz*.4+P.push.vz}}
 if(jumpQ&&free){if(P.ground){P.vy=9.8;P.ground=false;sfx('jump');P.dj=1}else if(P.cfg.back==='jet'&&P.dj===1){P.vy=9.6;P.dj=2;sfx('jet');burst(P.x,P.y+.6,P.z,10,[[1,.7,.2],[1,1,.6]],{sp:1.5,up:-2,g:2,life:.4,s:.3})}}jumpQ=false;
 if(!P.ground&&jumpHeld&&free&&(P.cfg.back==='wingA'||P.cfg.back==='wingD')&&P.vy<-2.4){P.vy=-2.4;if(R2()<.3)part({x:P.x+(R2()-.5),y:P.y+1.3,z:P.z+(R2()-.5),vy:-.5,g:0,life:.8,s:.25,c:P.cfg.back==='wingA'?[1,1,1]:[.7,.4,1],tex:DOT})}
 if(BUILD.on||SHOP.open){mx=mz=0}
 phys(P,mx,mz,dt);if(P.land>7){sfx('land');burst(P.x,P.y+.1,P.z,8,[[1,1,1]],{sp:2.5,up:1,g:4,life:.35,s:.3})}
 if(P.ground){const bd=voxDef(P.x,P.y-.05,P.z);if(bd&&bd.bounce){P.vy=16;P.ground=false;sfx('boing');burst(P.x,P.y,P.z,12,CONF,{tex:SQR,sp:3,up:3,life:.6,s:.16})}
  for(const pd of PADS)if(Math.hypot(P.x-pd.x,P.z-pd.z)<1.35&&Math.abs(P.y-pd.y)<.6){P.vy=pd.pow;P.ground=false;const h=pd.ty-pd.y,t=(pd.pow+Math.sqrt(Math.max(0,pd.pow*pd.pow-52*h)))/26;P.push={vx:(pd.tx-pd.x)/t,vz:(pd.tz-pd.z)/t,t:0};sfx('boing');burst(pd.x,pd.y+.4,pd.z,20,CONF,{tex:SQR,sp:4,up:6,life:1,s:.18});P.say('🚀',1.2)}}
 if(P.y<-4){P.x=0;P.z=5.5;P.y=.2;P.vy=0;P.push=null}
 if(P.bubbleT>0)P.bubbleT-=dt;if(P.cheer>0)P.cheer-=dt;
 stepBots(dt);stepPets(dt);stepParts(dt);trail(P,dt);for(const n of NPC3){if(n.bubbleT>0)n.bubbleT-=dt}
 curI=null;if(free){let bd=1e9;for(const it of INTER){const d=Math.hypot(it.x-P.x,it.z-P.z);if(d<it.r&&d<bd&&Math.abs((it.y||0)-P.y)<1.8){bd=d;curI=it}}}
 const ba=$('#bAct');if(curI){ba.classList.remove('hidden');const h=`${esc(curI.label)}<small>${esc(curI.sub)}</small>`;if(ba.dataset.h!==h){ba.innerHTML=h;ba.dataset.h=h}}else ba.classList.add('hidden');
 camUpdate(dt);try{draw3()}catch(e){console.error(e)}requestAnimationFrame(loop3)}
cam.mode='play';cam.dist=19;cam.byaw=.5;cam.bp=.95;cam.bdist=26;
function camUpdate(dt){let tx,ty,tz,yaw,pitch,dist;const asp=innerWidth/innerHeight;
 if(cam.mode==='show'){const th=Math.tan(FOV/2);dist=asp<1?13:9.5;tx=P.x;tz=P.z;ty=(P.gy??P.y)+1.55-(asp<1?.5:.22)*dist*th;yaw=0;pitch=.1;if(asp>=1.25)tx=P.x+dist*th*asp*.45}
 else if(cam.mode==='build'){tx=PX0+PN/2;tz=PZ0+PN/2;ty=PY0+(asp<1?-3:1);yaw=cam.byaw;pitch=cam.bp;dist=cam.bdist*(asp<1?1.65:1)}
 else{tx=P.x;tz=P.z;ty=P.y+1.2;yaw=0;pitch=.92;dist=cam.dist*(asp<.75?1.5:asp<1?1.25:1)}
 const k=1-Math.exp(-dt*7);cam.tx=lerp(cam.tx,tx,k);cam.ty=lerp(cam.ty,ty,k);cam.tz=lerp(cam.tz,tz,k);cam.yaw=lerpAng(cam.yaw,yaw,k);cam.pitch=lerp(cam.pitch,pitch,k);cam.dd=lerp(cam.dd||dist,dist,k);
 if(cam.mode==='show'){cam.tx=lerp(cam.tx,tx,k*2>1?1:k*2)}
 cam.x=cam.tx+Math.sin(cam.yaw)*Math.cos(cam.pitch)*cam.dd;cam.y=Math.max(.6,cam.ty+Math.sin(cam.pitch)*cam.dd);cam.z=cam.tz+Math.cos(cam.yaw)*Math.cos(cam.pitch)*cam.dd}

/* ---------- 描画（ブルーム＋FXAAの仕上げつき） ---------- */
const LD=nrm([.5,.85,.42]),FOG=[80,200],FOGC=[.86,.95,1.0];let SHOW=false,SNAP=false,LASTVP=null;
const POST={ok:false,w:0,h:0,sc:null,a:null,b:null};
function mkTarget(w,h,depth){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 const fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);let rb=null;
 if(depth){rb=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,rb);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_STENCIL,w,h);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_STENCIL_ATTACHMENT,gl.RENDERBUFFER,rb)}
 const ok=gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;gl.bindFramebuffer(gl.FRAMEBUFFER,null);return{t,fb,rb,w,h,ok}}
function freeTarget(T){if(!T)return;gl.deleteTexture(T.t);gl.deleteFramebuffer(T.fb);if(T.rb)gl.deleteRenderbuffer(T.rb)}
function ensurePost(W,H){if(!PQB)return false;if(POST.w===W&&POST.h===H)return POST.ok;for(const k of['sc','a','b'])freeTarget(POST[k]);
 POST.sc=mkTarget(W,H,true);const bw=Math.max(8,W>>2),bh=Math.max(8,H>>2);POST.a=mkTarget(bw,bh,false);POST.b=mkTarget(bw,bh,false);POST.w=W;POST.h=H;POST.ok=POST.sc.ok&&POST.a.ok&&POST.b.ok;return POST.ok}
/* 半とうめいの重ね方：画面用はアルファ＝光る量をのこす／撮影用はふつうに重ねる */
function blend(kind){gl.enable(gl.BLEND);if(SNAP){gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);return}
 if(kind==='glow'){gl.blendColor(0,0,0,.55);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.CONSTANT_ALPHA,gl.ONE)}else gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ZERO,gl.ONE)}
function bindMesh(m,col=true){gl.bindBuffer(gl.ARRAY_BUFFER,m.pb);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);if(!col)return;gl.bindBuffer(gl.ARRAY_BUFFER,m.nb);gl.vertexAttribPointer(1,3,gl.FLOAT,false,0,0);
 gl.bindBuffer(gl.ARRAY_BUFFER,m.cb);gl.vertexAttribPointer(2,4,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,m.ob);gl.vertexAttribPointer(3,3,gl.FLOAT,false,0,0)}
function attribs(n){for(let i=0;i<4;i++)i<n?gl.enableVertexAttribArray(i):gl.disableVertexAttribArray(i)}
function ink(u,on,th){gl.uniform1f(u.uInk,on?1:0);gl.uniform1f(u.uOut,on?th:0);gl.uniform1f(u.uPush,on?.011:0)}
function shadowPass(D3,LVP){gl.bindFramebuffer(gl.FRAMEBUFFER,SHM.fb);gl.viewport(0,0,SHM.size,SHM.size);gl.clearColor(1,1,1,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 gl.enable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.depthMask(true);gl.useProgram(PD.p);const u=PD.u;gl.uniformMatrix4fv(u.uVP,false,LVP);attribs(1);gl.uniformMatrix4fv(u.uM,false,IDENT);
 if(!SHOW)for(const m of[STG,HM])if(m){bindMesh(m,false);gl.drawArrays(gl.TRIANGLES,0,m.count)}
 let lg=null;for(const o of D3){if(o.ns)continue;if(o.g!==lg){gl.bindBuffer(gl.ARRAY_BUFFER,o.g.pb);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);lg=o.g}gl.uniformMatrix4fv(u.uM,false,o.m);gl.drawArrays(gl.TRIANGLES,0,o.g.count)}}
function quadPass(prog,target,setup){gl.bindFramebuffer(gl.FRAMEBUFFER,target?target.fb:null);gl.viewport(0,0,target?target.w:cv.width,target?target.h:cv.height);gl.useProgram(prog.p);setup(prog.u);gl.drawArrays(gl.TRIANGLES,0,6)}
function draw3(snap){const W=snap?snap.w:cv.width,H=snap?snap.h:cv.height;SNAP=!!snap;
 const eye=[cam.x,cam.y,cam.z],tgt=[cam.tx,cam.ty,cam.tz],V=M4.lookAt(eye,tgt,[0,1,0]),VP=M4.mul(M4.persp(FOV,W/H,.8,420),V);if(!snap)LASTVP=VP;
 const D3=[],TX=[],SP=[],SH=[];SHOW=SNAP||cam.mode==='show';P.draw(D3,TX,SP,SH,t3);
 if(SHOW){let pet=PETS.find(p=>p.own===P);if(!pet&&P.cfg.pet!=='none')pet={type:P.cfg.pet,x:P.x+1.3,y:P.gy??0,z:P.z+.7,rot:.5,ph:t3*3,mv:0};if(pet)drawPet(D3,pet,t3);
  const py=P.gy??P.y;D3.push({g:gpu(gCyl(1.9,2.1,.5,24)),m:M4.T(P.x,py-.5,P.z),c:H4('#ffd21f',.15)},{g:gpu(gCyl(1.5,1.5,.04,24)),m:M4.T(P.x,py-.02,P.z),c:H4('#fff3b0',.5),ni:1},{g:gpu(gCyl(2.6,2.9,.4,24)),m:M4.T(P.x,py-.9,P.z),c:H4('#2a48c4')})}
 else{for(const b of BOTS)b.draw(D3,TX,SP,SH,t3);for(const n of NPC3){n.walk=0;n.draw(D3,TX,SP,SH,t3)}for(const p of PETS)drawPet(D3,p,t3);for(const o of DYN3)D3.push({g:o.g,m:o.f(t3),c:o.c,ns:o.ns,ni:o.ns})}
 // かげ
 const sx=cam.mode==='build'&&!SNAP?PX0+PN/2:P.x,sz=cam.mode==='build'&&!SNAP?PZ0+PN/2:P.z,SR=SHOW?7:cam.mode==='build'?18:Math.max(22,cam.dd*1.25);
 const LVP=M4.mul(M4.ortho(-SR,SR,-SR,SR,1,160),M4.lookAt([sx+LD[0]*70,LD[1]*70,sz+LD[2]*70],[sx,0,sz],[0,1,0]));if(SHM.ok)shadowPass(D3,LVP);
 const post=!SNAP&&ensurePost(W,H);gl.bindFramebuffer(gl.FRAMEBUFFER,SNAP?snap.fb:post?POST.sc.fb:null);
 gl.viewport(0,0,W,H);gl.clearColor(SNAP?0:FOGC[0],SNAP?0:FOGC[1],SNAP?0:FOGC[2],0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 // 空
 if(!SNAP){gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.depthMask(false);gl.useProgram(PK.p);const u=PK.u,f=nrm([tgt[0]-eye[0],tgt[1]-eye[1],tgt[2]-eye[2]]),r=nrm(crs(f,[0,1,0])),up=crs(r,f),th=Math.tan(FOV/2);
  gl.uniform3fv(u.uF,f);gl.uniform3fv(u.uR,r);gl.uniform3fv(u.uU,up);gl.uniform2f(u.uTan,th*W/H,th);gl.uniform3fv(u.uLD,LD);gl.uniform1f(u.uShow,SHOW?1:0);gl.uniform1f(u.uT,t3);gl.uniform2f(u.uC,SHOW&&W/H>=1.25?-.45:0,SHOW?(W/H<1?.45:.25):0);
  attribs(1);gl.bindBuffer(gl.ARRAY_BUFFER,QP);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,6)}
 gl.enable(gl.DEPTH_TEST);gl.depthMask(true);gl.disable(gl.BLEND);attribs(1);gl.bindBuffer(gl.ARRAY_BUFFER,QP);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);
 // 海
 if(!SHOW){gl.useProgram(PW.p);const u=PW.u;gl.uniformMatrix4fv(u.uVP,false,VP);gl.uniform3fv(u.uCam,eye);gl.uniform3fv(u.uFogC,FOGC);gl.uniform2f(u.uFog,FOG[0],FOG[1]);gl.uniform1f(u.uT,t3);gl.drawArrays(gl.TRIANGLES,0,6)}
 // 本体
 gl.useProgram(PC.p);const u=PC.u;gl.uniformMatrix4fv(u.uVP,false,VP);gl.uniform3fv(u.uCam,eye);gl.uniform2f(u.uFog,FOG[0],FOG[1]);gl.uniform3fv(u.uFogC,FOGC);gl.uniform3fv(u.uLD,LD);
 gl.uniformMatrix4fv(u.uLVP,false,LVP);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,SHM.ok?SHM.tex:null);gl.uniform1i(u.uSh,1);gl.activeTexture(gl.TEXTURE0);
 gl.uniform1f(u.uShOn,SHM.ok?1:0);gl.uniform1f(u.uShT,1/SHM.size);gl.uniform1f(u.uStud,0);gl.uniform1f(u.uA,1);gl.uniform1f(u.uT,t3);gl.uniform1f(u.uTv,t3);gl.uniform1f(u.uSnap,SNAP?1:0);gl.uniformMatrix4fv(u.uM,false,IDENT);
 gl.uniform1f(u.uAsp,W/H);gl.uniformMatrix3fv(u.uNM,false,NM_I);attribs(4);if(!SHOW)for(const m of[STG,HM])if(m){bindMesh(m);ink(u,true,.0085);gl.drawArrays(gl.TRIANGLES,0,m.count);ink(u,false);gl.drawArrays(gl.TRIANGLES,0,m.count)}
 gl.uniform1f(u.uShOn,0);gl.disableVertexAttribArray(2);let lg=null;const cth=SNAP?.012:SHOW?.0105:.0105;
 for(const o of D3){if(o.g!==lg){gl.bindBuffer(gl.ARRAY_BUFFER,o.g.pb);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,o.g.nb);gl.vertexAttribPointer(1,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,o.g.ob);gl.vertexAttribPointer(3,3,gl.FLOAT,false,0,0);lg=o.g}
  gl.uniformMatrix4fv(u.uM,false,o.m);gl.uniformMatrix3fv(u.uNM,false,nm3(o.m));if(!o.ni){ink(u,true,cth);gl.drawArrays(gl.TRIANGLES,0,o.g.count);ink(u,false)}gl.vertexAttrib4fv(2,o.c);gl.drawArrays(gl.TRIANGLES,0,o.g.count)}
 // ガラス・ゴースト（半とうめい）
 blend();gl.depthMask(false);
 if(HGM&&!SHOW){attribs(4);bindMesh(HGM);gl.uniformMatrix4fv(u.uM,false,IDENT);gl.uniformMatrix3fv(u.uNM,false,NM_I);gl.uniform1f(u.uA,.5);gl.drawArrays(gl.TRIANGLES,0,HGM.count)}
 if(BUILD.on&&!SNAP){const G=[];ghostParts(G);if(G.length){attribs(4);gl.disableVertexAttribArray(2);gl.uniform1f(u.uA,.5+Math.sin(t3*6)*.12);
  for(const o of G){gl.bindBuffer(gl.ARRAY_BUFFER,o.g.pb);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,o.g.nb);gl.vertexAttribPointer(1,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,o.g.ob);gl.vertexAttribPointer(3,3,gl.FLOAT,false,0,0);
   gl.vertexAttrib4fv(2,o.c);gl.uniformMatrix4fv(u.uM,false,o.m);gl.uniformMatrix3fv(u.uNM,false,nm3(o.m));gl.drawArrays(gl.TRIANGLES,0,o.g.count)}}}
 gl.uniform1f(u.uA,1);
 // 板・文字・パーティクル
 gl.useProgram(PT.p);const t=PT.u;gl.uniformMatrix4fv(t.uVP,false,VP);gl.uniform3fv(t.uCam,eye);gl.uniform2f(t.uFog,FOG[0],FOG[1]);gl.uniform3fv(t.uFogC,FOGC);gl.uniform1i(t.uT,0);gl.uniform4f(t.uCol,1,1,1,1);
 attribs(2);gl.bindBuffer(gl.ARRAY_BUFFER,QP);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,QU);gl.vertexAttribPointer(1,2,gl.FLOAT,false,0,0);
 const dq=(tex,m)=>{gl.bindTexture(gl.TEXTURE_2D,tex.t);gl.uniformMatrix4fv(t.uM,false,m);gl.drawArrays(gl.TRIANGLES,0,6)};
 gl.depthMask(true);if(!SHOW)for(const q of SQ)dq(q.tex,q.m);for(const q of TX)dq(q.tex,q.m);
 gl.depthMask(false);gl.uniform4f(t.uCol,1,1,1,.85);if(!SHOW)for(const s of SH)dq(SHADOW,M4.c(M4.T(s.x,s.y+.04,s.z),M4.RX(-Math.PI/2),M4.S(s.s,s.s,1)));
 const rx=[V[0],V[4],V[8]],uy=[V[1],V[5],V[9]];const bb=(x,y,z,w,h)=>{const m=new Float32Array(16);m[0]=rx[0]*w;m[1]=rx[1]*w;m[2]=rx[2]*w;m[4]=uy[0]*h;m[5]=uy[1]*h;m[6]=uy[2]*h;m[10]=1;m[12]=x;m[13]=y;m[14]=z;m[15]=1;return m};
 if(!SNAP){
  if(curI){blend('glow');const a=.65+Math.sin(t3*6)*.25;gl.uniform4f(t.uCol,1,.9,.3,a);dq(DOT,M4.c(M4.T(curI.x,(curI.y||0)+.08,curI.z),M4.RX(-Math.PI/2),M4.S(2.6,2.6,1)));blend()}
  gl.uniform4f(t.uCol,1,1,1,1);gl.depthMask(true);
  if(cam.mode==='play')for(const b of BILL){const s=1+Math.sin(t3*2+b.bob)*.02;dq(b.tex,bb(b.x,b.y+Math.sin(t3*1.6+b.bob)*.25,b.z,b.w*s,b.w*s/b.tex.aspect))}
  gl.depthMask(false);blend('glow');for(const p of PARTS){const a=1-p.age/p.life;gl.uniform4f(t.uCol,p.c[0],p.c[1],p.c[2],Math.min(1,a*1.6));dq(p.tex,bb(p.x,p.y,p.z,Math.max(.01,p.s),Math.max(.01,p.s)))}blend();
  gl.disable(gl.DEPTH_TEST);gl.uniform4f(t.uCol,1,1,1,1);if(!SHOW)for(const s of SP){if(BUILD.on&&s.tex!==P.label)continue;dq(s.tex,bb(s.x,s.y,s.z,s.w,s.h))}}
 gl.depthMask(true);gl.enable(gl.DEPTH_TEST);gl.disable(gl.BLEND);
 // 仕上げ：光のにじみ（ブルーム）→ ギザギザとり（FXAA）＋周辺をすこし暗く
 if(post){gl.disable(gl.DEPTH_TEST);attribs(1);gl.bindBuffer(gl.ARRAY_BUFFER,QP);gl.vertexAttribPointer(0,3,gl.FLOAT,false,0,0);gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D,POST.sc.t);quadPass(PQB,POST.a,u=>{gl.uniform1i(u.uS,0);gl.uniform2f(u.uPx,1.5/W,1.5/H)});
  for(const k of[1,2]){gl.bindTexture(gl.TEXTURE_2D,POST.a.t);quadPass(PQL,POST.b,u=>{gl.uniform1i(u.uS,0);gl.uniform2f(u.uD,k/POST.a.w,0)});
   gl.bindTexture(gl.TEXTURE_2D,POST.b.t);quadPass(PQL,POST.a,u=>{gl.uniform1i(u.uS,0);gl.uniform2f(u.uD,0,k/POST.a.h)})}
  gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,POST.a.t);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,POST.sc.t);
  quadPass(PQC,null,u=>{gl.uniform1i(u.uS,0);gl.uniform1i(u.uB,1);gl.uniform2f(u.uPx,1/W,1/H);gl.uniform1f(u.uBl,1.25)});gl.enable(gl.DEPTH_TEST)}
 gl.bindFramebuffer(gl.FRAMEBUFFER,null)}

/* ---------- ロビーのアバター（3Dで撮影して絵にする） ---------- */
let SNAPT=null,LCH=null;
function lobbyAvatar(c2d){try{if(!gl||!c2d)return;if(!PC){initGL();initTex()}avFix();const S=420;if(!SNAPT)SNAPT=mkTarget(S,S,true);if(!SNAPT.ok)return;
 const cfg=avCfg(D.av);if(!LCH)LCH=new Char(cfg,{style:'player'});else LCH.set(cfg);LCH.x=500;LCH.z=500;LCH.y=0;LCH.gy=0;LCH.vy=0;LCH.walk=0;LCH.rot=.42;LCH.cheer=0;LCH.sq=0;LCH.bubbleT=0;
 const keep=P,kc=Object.assign({},cam),kt=t3;P=LCH;t3=.6;const yaw=.42,pit=.14,dist=6.1,ty0=1.47;cam.tx=500;cam.ty=ty0;cam.tz=500;cam.x=500+Math.sin(yaw)*Math.cos(pit)*dist;cam.y=ty0+Math.sin(pit)*dist;cam.z=500+Math.cos(yaw)*Math.cos(pit)*dist;cam.mode='show';
 draw3(SNAPT);const px=new Uint8Array(S*S*4);gl.bindFramebuffer(gl.FRAMEBUFFER,SNAPT.fb);gl.readPixels(0,0,S,S,gl.RGBA,gl.UNSIGNED_BYTE,px);gl.bindFramebuffer(gl.FRAMEBUFFER,null);
 P=keep;Object.assign(cam,kc);t3=kt;const g=c2d.getContext('2d'),im=g.createImageData(S,S);for(let y=0;y<S;y++)im.data.set(px.subarray((S-1-y)*S*4,(S-y)*S*4),y*S*4);g.clearRect(0,0,S,S);g.putImageData(im,0,0)}catch(e){console.error(e)}}

/* ---------- コインがHUDへ飛んでいく ---------- */
function flyCoins(n){const pill=$('#w3coinP');if(!pill||!LASTVP||!P)return;const v=LASTVP,x=P.x,y=P.y+2.6,z=P.z;const cw=v[3]*x+v[7]*y+v[11]*z+v[15];if(cw<=0)return;
 const sx=((v[0]*x+v[4]*y+v[8]*z+v[12])/cw*.5+.5)*innerWidth,sy=(1-((v[1]*x+v[5]*y+v[9]*z+v[13])/cw*.5+.5))*innerHeight;const r=pill.getBoundingClientRect(),tx=r.left+16,ty=r.top+r.height/2;
 const k=Math.min(10,n*2+2);for(let i=0;i<k;i++){const e=document.createElement('i');e.className='flycoin';e.style.left=sx+'px';e.style.top=sy+'px';W3el.appendChild(e);
  const ox=(Math.random()-.5)*140,oy=-40-Math.random()*90,G=window.gsap;
  if(G){const tl=G.timeline({delay:i*.05,onComplete:()=>{e.remove();w3Hud(true);sfx('tap')}});tl.fromTo(e,{scale:.2,x:0,y:0},{scale:1.15,x:ox,y:oy,duration:.32,ease:'back.out(2)'}).to(e,{x:tx-sx,y:ty-sy,scale:.7,duration:.5,ease:'power2.in'})}
  else{e.animate([{transform:'translate(0,0) scale(.2)'},{transform:`translate(${ox}px,${oy}px) scale(1.15)`,offset:.4},{transform:`translate(${tx-sx}px,${ty-sy}px) scale(.7)`}],{duration:820,delay:i*50,easing:'ease-in',fill:'forwards'}).onfinish=()=>{e.remove();w3Hud(true)}}}}
