
/* ===================== ブロックワールド（ごほうびエリア） ===================== */
const ZC={en:'#3c7be0',ja:'#e94b4b',ma:'#ff7a1a',sc:'#35d07f',so:'#9b59d0'};
const ZN={en:['ENGLISH','英語の島'],ja:['KANJI','漢字の森'],ma:['MATH','計算の塔'],sc:['SCIENCE','理科ラボ'],so:['SOCIAL','社会の街']};
const NPCN={en:'イングリッシュ先生',ja:'かんじ博士',ma:'けいさんロボ',sc:'ラボ先生',so:'ちずマスター'};
const NPCAV={en:{shirt:'#3c7be0',hat:'cap',face:'grin',hairStyle:0,hair:'#5a3b22'},ja:{shirt:'#e94b4b',hairStyle:2,hair:'#eeeeee',face:'smile',pants:'#22262f',design:'none'},
 ma:{shirt:'#ff7a1a',skin:'#d9dde3',hat:'robo',face:'robo',pants:'#6b7586',design:'bolt'},sc:{shirt:'#f4f4f4',pants:'#f4f4f4',hairStyle:1,hair:'#35d07f',face:'star',design:'none'},
 so:{shirt:'#9b59d0',hat:'straw',face:'wink',hairStyle:3,hair:'#1b1b1b',design:'star'}};
const BILL=[],SQ=[],INTER=[],NPC3=[],BOTS=[],DYN3=[],PADS=[],KEEP=[];let W3={built:false,on:false},P=null,curI=null;
const cam={yaw:0,pitch:.38,dist:9,x:0,y:3,z:10,tx:0,ty:1.5,tz:0,oy:0,dd:9,sp:.38};
const WP=[[0,7],[6,-5],[-6,-5],[0,-21],[-12,-11.5],[11,-4.5],[13,3],[-15,7],[0,13],[-7,3],[7,2],[18,-2],[-20,-3],[10,14],[-10,14]];
function quad(tex,x,y,z,w,h,rot=0){SQ.push({tex,m:M4.c(M4.T(x,y,z),M4.RY(rot),M4.S(w,h,1))})}
function tint(h,t){const c=hex(h);return[lerp(c[0],1,t),lerp(c[1],1,t),lerp(c[2],1,t)]}
function bTree(x,z,s=1,kind=0){const G=['#3fae49','#2f9a3a','#56c24a'];
 if(kind===0){box(x,0,z,.7*s,2.2*s,.7*s,'#8b5a2b',{jit:0});box(x,2*s,z,3*s,1.4*s,3*s,G[0],{jit:.05,em:-1});box(x,3.3*s,z,2.2*s,1.2*s,2.2*s,G[2],{jit:.05,em:-1});box(x,4.4*s,z,1.2*s,.9*s,1.2*s,G[1],{jit:.05,em:-1})}
 else{box(x,0,z,.6*s,1.6*s,.6*s,'#7a4a22',{jit:0});for(let i=0;i<3;i++)cyl(x,(1.3+i*1.25)*s,z,0,(2-i*.5)*s,1.9*s,G[i],6,{em:-1})}
 addCircle(x,z,.5*s,99)}
const clearAt=(x,z,m=0)=>!KEEP.some(k=>Math.hypot(x-k[0],z-k[1])<k[2]+m);
function bush(x,z,s=1){const C=['#2c9a45','#36ad4f','#43c05a'];const n=3+Math.floor(R()*3);for(let i=0;i<n;i++){const a=i/n*TAU+R(),r=(.45+R()*.35)*s,ox=Math.cos(a)*r*.9,oz=Math.sin(a)*r*.9;addS(gSph(.8,7,5),M4.c(M4.T(x+ox,.55*s,z+oz),M4.S(s*(.9+R()*.3),s*(.75+R()*.25),s*(.9+R()*.3))),C[i%3],-1,.04)}
 addS(gSph(.7,7,5),M4.c(M4.T(x,1.05*s,z),M4.S(s,s*.8,s)),'#5cd36c',-1,.04);for(let i=0;i<3;i++){const a=R()*TAU;addS(gSph(.09,5,3),M4.T(x+Math.cos(a)*.7*s,(.75+R()*.5)*s,z+Math.sin(a)*.7*s),['#ff5a8a','#ffd23a','#ffffff'][i],.35,0)}}
function tuft(x,z){OUTL=false;for(let i=0;i<3;i++){const a=i*2.1+R(),m=M4.c(M4.T(x,0,z),M4.RY(a),M4.RZ(.28),M4.T(0,0,0));addS(gCyl(0,.07,.42+R()*.2,3),m,R()<.5?'#3fae49':'#4cbf4f',-1,.05)}OUTL=true}
function path(x0,z0,x1,z1,w=2.6){const dx=x1-x0,dz=z1-z0,L=Math.hypot(dx,dz);box((x0+x1)/2,0,(z0+z1)/2,w,.04,L,'#f1dfae',{rot:Math.atan2(dx,dz),jit:.03,ol:false})}
function mkNpc(cfg,label,x,z,rot,y=.2){const ch=new Char(cfg,{label,style:'npc'});ch.x=x;ch.z=z;ch.y=ch.gy=y;ch.rot=rot;NPC3.push(ch);return ch}
function spinCoin(x,y,z,r=.45){DYN3.push({g:gpu(gCyl(r,r,r*.28,12)),c:H4('#ffd23a',.45),f:t=>M4.c(M4.T(x,y+Math.sin(t*2+x)*.15,z),M4.RY(t*2.4+x),M4.RX(Math.PI/2))})}

function buildW3(){R=rng(11);
 // 島：砂はま → しばふのタイル
 box(0,-2.3,0,124,2,124,'#f3dc9a',{jit:0});
 for(let i=-15;i<15;i++)for(let j=-15;j<15;j++){const x=i*4+2,z=j*4+2;box(x,-.2,z,4,.2,4,(i+j)&1?'#6fd05a':'#5cbf4a',{jit:.03,ol:false})}
 extraBlock=(x,z)=>Math.abs(x)>59.6||Math.abs(z)>59.6;
 for(let s=-60;s<=60;s+=4.8)for(const[a,b]of[[s,-60.4],[s,60.4],[-60.4,s],[60.4,s]]){box(a,0,b,.4,1.1,.4,'#ffffff',{jit:.02})}
 for(const e of[-60.4,60.4]){box(0,.7,e,121,.14,.14,'#ffb14a',{jit:0});box(e,.7,0,.14,.14,121,'#ffb14a',{jit:0})}
 // まんなかの広場：ごほうびコインの台
 KEEP.push([0,0,10]);cyl(0,0,0,7.6,7.6,.1,'#e9e2d2',32,{col:true,jit:.03});cyl(0,.1,0,1.3,1.6,.9,'#c9d1dc',12,{col:true,cr:1.6,top:1});cyl(0,1,0,1.05,1.05,.12,'#ffd23a',12,{em:.3});
 DYN3.push({g:gpu(gCyl(1.15,1.15,.3,16)),c:H4('#ffd23a',.45),f:t=>M4.c(M4.T(0,2.7+Math.sin(t*1.6)*.15,0),M4.RY(t*1.5),M4.RX(Math.PI/2))});
 DYN3.push({g:gpu(gCyl(.7,.7,.34,5)),c:H4('#fff3b0',.8),f:t=>M4.c(M4.T(0,2.7+Math.sin(t*1.6)*.15,0),M4.RY(t*1.5),M4.RX(Math.PI/2))});
 const BC=['#e94b4b','#ffd23a','#35d07f','#3c7be0','#ff7ac8','#ff7a1a'];
 [[5.6,5.6],[-5.6,5.6],[5.6,-5.6],[-5.6,-5.6]].forEach(([x,z],n)=>{cyl(x,.1,z,.14,.2,3.2,'#3a4a86',8,{col:true,cr:.3,top:99});sph(x,3.5,z,.36,'#fff1a8',{em:.9});
  for(let i=0;i<3;i++){const bx=x+(i-1)*.55,ph=n*2+i;DYN3.push({g:gpu(gSph(.42,8,6)),c:H4(BC[(n*3+i)%6],.12),f:t=>M4.T(bx+Math.sin(t*1.1+ph)*.12,5+i*.35+Math.sin(t*1.7+ph)*.14,z+Math.cos(t*.9+ph)*.12)})}});
 // 入口のアーチ
 for(const s of[-1,1])cyl(5.6*s,0,-9.8,.4,.5,6.6,'#ff7a1a',10,{col:true,cr:.55,top:99});
 box(0,4,-9.8,12.4,2.7,.5,'#16204a',{jit:0});const st=signTex('送迎ドリル WORLD','勉強のごほうびエリア',{w:1024,h:230,bg:'#ff7a1a'});
 quad(st,0,5.35,-9.53,11.6,11.6/st.aspect,0);quad(st,0,5.35,-10.07,11.6,11.6/st.aspect,Math.PI);
 // 教科ゾーン
 const ks=Object.keys(ZN);ks.forEach((k,i)=>{const a=-Math.PI/2+i/ks.length*TAU,zx=Math.cos(a)*34,zz=Math.sin(a)*34,c=ZC[k];
  const dx=-Math.cos(a),dz=-Math.sin(a),rot=Math.atan2(dx,dz),G=grp(zx,zz,rot);KEEP.push([zx,zz,12.5]);
  cyl(zx,0,zz,9.6,9.6,.2,c,32,{col:true,jit:.04});cyl(zx,.2,zz,6.2,6.2,.02,tint(c,.45),32,{jit:.02});
  path(dx*7.4,dz*7.4,zx+dx*9.5,zz+dz*9.5);
  for(const s of[-1,1]){G.b(4.3*s,0,9.3,1.4,6.2,1.4,c,0,0);G.b(4.3*s,6.2,9.3,1.8,.5,1.8,'#ffffff',0,0);G.col(4.3*s,9.3,.85)}
  G.b(0,4.5,9.3,10,2.1,.9,c,0,.03);const t=signTex(ZN[k][0],ZN[k][1],{w:900,h:200,bg:c});G.q(t,0,5.55,9.77,9,9/t.aspect);G.q(t,0,5.55,8.83,9,9/t.aspect,Math.PI);{const p=G.w(0,-4.2);BILL.push({tex:t,x:p[0],y:11.5,z:p[1],w:7.5,bob:i})}
  // たてもの
  G.b(0,.2,-4.2,8,4.8,6.6,'#fbf6ea',0,.03);G.b(0,5,-4.2,9,.7,7.6,c,0,.04);G.b(0,5.7,-4.2,6.6,.9,5.2,tint(c,.25),0,.04);
  G.b(0,.2,-.86,1.9,2.9,.16,'#5b3a1e',0,0);G.b(.6,1.5,-.76,.14,.14,.1,'#ffd23a',.3,0);for(const s of[-1,1])G.b(2.7*s,2,-.86,1.5,1.5,.14,'#9fe0ff',.55,0);
  G.b(0,3.3,-.4,3.4,.28,1.2,c,0,0);G.col(0,-4.2,4.6);
  const L=5.8,Z=1.6;G.col(-L,Z,1.35);G.col(L,Z,1.2);
  if(k==='en'){[['A','#e94b4b',-6.6,.2],['B','#35d07f',-5,.2],['C','#ffd23a',-5.8,1.7]].forEach(([ch,cc,lx,ly])=>{G.b(lx,ly,Z,1.5,1.5,1.5,cc,0,.03);const lt=letterTex(ch,cc);G.q(lt,lx,ly+.75,Z+.76,1.5,1.5);G.q(lt,lx,ly+.75,Z-.76,1.5,1.5,Math.PI)});
   G.c(L,.2,Z,.12,.16,2.6,'#6b7586');const hb=bubbleTex('Hello!');G.q(hb,L,3.5,Z,2.8,2.8/hb.aspect);G.q(hb,L,3.5,Z-.02,2.8,2.8/hb.aspect,Math.PI)}
  if(k==='ja'){G.c(-L,.2,Z,.6,0,1,'#f0cfa0',6);G.c(-L,.2,Z,.14,0,.26,'#22262f',6);G.c(-L,1.2,Z,.6,.6,3,'#ffd23a',6);G.c(-L,4.2,Z,.62,.62,.2,'#c9d1dc',6);G.c(-L,4.4,Z,.6,.6,.5,'#ff8fb0',6);
   G.b(L,.2,Z,1.7,1.7,1.7,c,0,.03);const kt=letterTex('字',c);G.q(kt,L,1.05,Z+.86,1.7,1.7);G.q(kt,L,1.05,Z-.86,1.7,1.7,Math.PI);
   [[-7.6,-2.6],[7.6,-2.6],[-7.2,5.6],[7.2,5.6]].forEach(([lx,lz],n)=>{const p=G.w(lx,lz);bTree(p[0],p[1],.75,n%2)})}
  if(k==='ma'){for(let h=0;h<4;h++)G.b(0,6.6+h*1.6,-4.2,3.6-h*.6,1.6,3.6-h*.6,h%2?'#ffffff':c,0,.03);
   [['＋','#e94b4b',-L],['×','#3c7be0',L]].forEach(([ch,cc,lx])=>{G.b(lx,.2,Z,1.7,1.7,1.7,cc,0,.03);const lt=letterTex(ch,cc);G.q(lt,lx,1.05,Z+.86,1.7,1.7);G.q(lt,lx,1.05,Z-.86,1.7,1.7,Math.PI)})}
  if(k==='sc'){G.c(-L,.2,Z,.5,.78,.7,'#6b7586',8);G.c(-L,.9,Z,.9,.9,3.2,'#f4f4f4',10);G.c(-L,4.1,Z,0,.9,1.5,'#e94b4b',10);G.s(-L,2.9,Z+.82,.34,'#5ad1ff',.6);G.b(-L,2.2,Z,1.84,.3,1.84,'#e94b4b',0,0);
   for(const[fx,fz]of[[1.05,0],[-1.05,0],[0,1.05],[0,-1.05]])G.b(-L+fx,.2,Z+fz,fx?.5:.16,1.5,fx?.16:.5,'#e94b4b',0,0);
   G.c(L,.2,Z,.34,1,1.3,'#7fe9ff',8,.35);G.c(L,1.5,Z,.34,.34,.8,'#d9f6ff',8,.35);G.c(L,.2,Z,.9,1.02,.5,'#35d07f',8,.5);G.c(L,2.3,Z,.42,.42,.1,'#ffffff',8)}
  if(k==='so'){G.c(-L,.2,Z,.3,.8,.9,'#6b4423');G.s(-L,2.5,Z,1.5,'#2f8fd8',.12);G.s(-L+.5,3,Z+.95,.62,'#3fae49',.05);G.s(-L-.8,2.3,Z+.9,.56,'#3fae49',.05);G.s(-L+.3,1.8,Z+1,.42,'#3fae49',.05);G.s(-L+.9,2.4,Z-.8,.6,'#3fae49',.05);
   G.b(L,.2,Z,2,3.2,2,'#d9dde3',0,.04);for(const[mx,mz]of[[-.75,-.75],[.75,-.75],[-.75,.75],[.75,.75]])G.b(L+mx,3.4,Z+mz,.5,.5,.5,'#d9dde3',0,.04);G.c(L,3.4,Z,.06,.06,1.8,'#6b7586');G.b(L+.45,4.7,Z,.9,.5,.04,c,.1,0);G.b(L,.2,Z+1.01,.7,1.3,.06,'#5b3a1e',0,0)}
  const np=G.w(0,2.6);mkNpc(NPCAV[k],NPCN[k],np[0],np[1],rot);spinCoin(np[0],3.75,np[1]);
  INTER.push({x:np[0],z:np[1],r:3.2,label:'話す',sub:ZN[k][1],fn:()=>zoneTalk(k)})});
 // きせかえショップ
 {const G=grp(-12,-17,0);KEEP.push([-12,-16,8.5]);path(-4.5,-6,-10.5,-11.5);
  G.b(0,0,-1,9,4.4,6,'#fff4e0',0,.03);G.b(0,4.4,-1,9.6,.6,6.6,'#ff5fa2',0,.03);for(let i=0;i<6;i++)G.b(-3.75+i*1.5,3.05,2.6,1.5,.25,1.3,i%2?'#ffffff':'#ff5fa2',0,0);
  G.b(0,0,2.02,2,2.8,.12,'#7a4a2a',0,0);for(const s of[-1,1])G.b(3*s,1.2,2.02,1.9,1.7,.12,'#9fe0ff',.55,0);
  G.b(0,5,1.6,8.2,2,.3,'#c93c80',0,0);const t=signTex('きせかえショップ','コインでおしゃれしよう',{bg:'#ff5fa2',w:900,h:210});G.q(t,0,6,1.77,7.8,7.8/t.aspect);BILL.push({tex:t,x:-12,y:9.6,z:-17,w:7,bob:7})
  addBox(-12,-18,9,6,99);
  G.c(3.7,0,3.7,.5,.62,.9,'#ffffff',10);G.c(3.7,.9,3.7,.3,.3,.18,'#ffcc1a',8,.3);for(let i=0;i<5;i++){const an=i/5*TAU;G.c(3.7+Math.sin(an)*.23,1.08,3.7+Math.cos(an)*.23,0,.08,.2,'#ffcc1a',4,.3)}G.col(3.7,3.7,.6);
  G.c(-3.7,0,3.7,.5,.62,.9,'#ffffff',10);G.c(-3.7,.9,3.7,0,.4,.8,'#6c3fd1',8);G.col(-3.7,3.7,.6);
  mkNpc({shirt:'#ff7ac8',hat:'phones',face:'wink',hairStyle:6,hair:'#ff7ac8',back:'wingA',design:'heart',pants:'#f4f4f4'},'ショップてんちょう',-12,-13.4,0,0);
  INTER.push({x:-12,z:-13.4,r:3.2,label:'きせかえ',sub:'ショップ',fn:()=>openShop('wear')})}
 // マイホーム（家づくりの土地）
 {const cx=PX0+PN/2,cz=PZ0+PN/2;KEEP.push([cx,cz,12.5]);path(5,-4.5,10,-7.6);
  box(cx,0,cz,PN,.2,PN,'#bfe6a4',{col:true,jit:.02});for(const[a,b,w,d]of[[cx,PZ0-.15,PN+.6,.3],[cx,PZ0+PN+.15,PN+.6,.3],[PX0-.15,cz,.3,PN],[PX0+PN+.15,cz,.3,PN]])box(a,0,b,w,.32,d,'#ffffff',{jit:.02});
  for(const[a,b]of[[PX0-.15,PZ0-.15],[PX0+PN+.15,PZ0-.15],[PX0-.15,PZ0+PN+.15],[PX0+PN+.15,PZ0+PN+.15]]){box(a,0,b,.4,1.6,.4,'#ff7a1a',{jit:0});sph(a,1.85,b,.28,'#ffd23a',{em:.4})}
  box(4.1,0,-7.2,.14,1.1,.14,'#6b7586',{jit:0});box(4.1,1.1,-7.2,.5,.4,.7,'#e94b4b',{jit:0});W3.homeAt=[4.1,2.3,-7.2];
  mkNpc({shirt:'#ffd23a',pants:'#8a5a2b',hat:'cap',face:'grin',hairStyle:4,design:'none',back:'pack'},'だいくさん',10.6,-6.3,Math.atan2(-10.6,6.3),0);{const t=signTex('マイホーム','コインでブロックの家をつくろう',{bg:'#35a86a',w:900,h:210});BILL.push({tex:t,x:cx,y:9.5,z:cz,w:7,bob:3})}
  INTER.push({x:10.6,z:-6.3,r:3,label:'家づくり',sub:'マイホーム',fn:()=>enterBuild()});INTER.push({x:cx,z:cz,r:11.4,label:'家づくり',sub:'マイホーム',fn:()=>enterBuild()})}
 // アスレチック（ジャンプで登る）
 {KEEP.push([0,24,11]);path(0,7.4,-2,14.5);const cols=['#e94b4b','#ff7a1a','#ffd23a','#35d07f','#3c7be0','#9b59d0','#ff6ab0'];let x=-3,z=16,y=0;
  for(let i=0;i<9;i++){y+=1;x+=[0,3,3,0,-3,-3,0,3,0][i];z+=[3,0,0,3,0,0,3,0,3][i];box(x,0,z,2.4,y,2.4,cols[i%7],{col:true,jit:.03})}
  box(x,0,z+3.2,4,y,4,'#ffd23a',{col:true,jit:.03});cyl(x,y,z+4.4,.5,.7,.5,'#6b4423',8);cyl(x,y+.5,z+4.4,.5,.25,.8,'#ffcc1a',8,{em:.3});W3.goal={x,y,z:z+3.2};
  INTER.push({x,z:z+3.2,y,r:2.4,label:'ゴール！',sub:'アスレチック',fn:obbyGoal});
  const ot=signTex('ジャンプ チャレンジ','ブロックをのぼってゴールをめざそう',{w:900,h:200,bg:'#35a86a'});box(-7.5,0,15.6,5.6,2.9,.4,'#16204a',{col:true,top:99,jit:0});quad(ot,-7.5,1.6,15.82,5.2,5.2/ot.aspect,0);BILL.push({tex:ot,x:x,y:y+4.6,z:z+3.2,w:5.6,bob:5})}
 // ジャンプ台 → くもの島
 {KEEP.push([17,5,6]);path(6.8,2.4,13.6,3.8);
  const pad=(x,y,z,tx,ty,tz)=>{cyl(x,y,z,1.4,1.5,.24,'#e94b4b',14);cyl(x,y+.24,z,1.05,1.05,.05,'#ffffff',14,{em:.5});PADS.push({x,y,z,pow:20.5,tx,ty,tz})};
  pad(15,0,4,19.5,6,6);box(19.5,5.2,6,4.6,.8,4.6,'#ff8fc0',{col:true,bot:5.2,jit:.03});pad(20.6,6,6.6,25.5,12,9);
  box(26,11.2,9,8,.8,7,'#ffffff',{col:true,bot:11.2,em:.3,jit:0});for(const[a,b,c,w]of[[21.6,10.9,8,2.2],[30.4,10.8,10,2.4],[26,10.7,13,3],[27,10.8,5.2,2.6]])box(a,b,c,w,1,w,'#ffffff',{em:.35,jit:0});
  const RB=['#e94b4b','#ff7a1a','#ffd23a','#35d07f','#3c7be0','#9b59d0'];for(let i=0;i<6;i++){const r=3.3-i*.3;for(let s=0;s<=10;s++){const an=s/10*Math.PI;addS(gBox(.5,.3,.5),M4.T(28+Math.cos(an)*r,12+Math.sin(an)*r,11.2),RB[i],.25,0)}}
  cyl(28.4,12,7.4,.5,.7,.5,'#6b4423',8);addS(gCyl(.9,.9,.22,5),M4.c(M4.T(28.4,13.5,7.4),M4.RX(Math.PI/2)),'#ffd23a',.5);
  const pt=signTex('ジャンプ台','のって空へ！',{w:600,h:200,bg:'#e94b4b'});BILL.push({tex:pt,x:15,y:3.6,z:4,w:3.6,bob:2});const ct=signTex('くもの島','にじの下にタッチ！',{w:600,h:200,bg:'#39c2ff'});BILL.push({tex:ct,x:26,y:17.6,z:9,w:4.6,bob:4});
  INTER.push({x:26,z:9,y:12,r:3.6,label:'やったー！',sub:'くもの島',fn:cloudGoal})}
 // いけ
 {KEEP.push([-22,8,8]);path(-6.9,2.6,-16.5,6.2);box(-22,0,8,9,.05,7,'#3aa7ff',{em:.45,jit:0});
  for(let i=0;i<18;i++){const an=i/18*TAU,rx=5.1,rz=4.1;const s=.35+R()*.3;sph(-22+Math.cos(an)*rx*Math.min(1.25,1/Math.max(Math.abs(Math.cos(an)),.8)),.12,8+Math.sin(an)*rz*Math.min(1.25,1/Math.max(Math.abs(Math.sin(an)),.8)),s,'#aab2bd',{ws:6,hs:4})}
  for(let i=0;i<3;i++){const ph=i*TAU/3;const f=(t,dy,dz2)=>{const a2=t*.35+ph;return M4.c(M4.T(-22+Math.cos(a2)*2.6,dy+.05,8+Math.sin(a2)*1.9),M4.RY(-a2),M4.T(0,0,dz2))};
   DYN3.push({g:gpu(gBox(.4,.28,.5)),c:H4('#ffd84a'),f:t=>f(t,.14,0)});DYN3.push({g:gpu(gBox(.24,.24,.24)),c:H4('#ffd84a'),f:t=>f(t,.4,.22)});DYN3.push({g:gpu(gBox(.1,.06,.12)),c:H4('#ff8a1e'),f:t=>f(t,.38,.38)})}
  box(-22,0,13.4,3,.45,.9,'#c58a4a',{col:true,jit:.03});box(-22,.45,13.8,3,.7,.14,'#c58a4a',{jit:.03});bTree(-28.5,12.5,1.25,0)}
 // 木・花・岩
 for(let n=0,t=0;n<58&&t<400;t++){const a=R()*TAU,r=38+R()*20,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)>57||Math.abs(z)>57||!clearAt(x,z,1.5))continue;KEEP.push([x,z,2.2]);bTree(x,z,.75+R()*.55,R()<.4?1:0);n++}
 const FC=['#ff5a8a','#ffd23a','#ffffff','#ff8a1e','#b07cff'];
 for(let n=0,t=0;n<150&&t<900;t++){const x=(R()-.5)*114,z=(R()-.5)*114;if(!clearAt(x,z,.4))continue;box(x,0,z,.08,.3,.08,'#3fae49',{jit:0,ol:false});box(x,.3,z,.3,.2,.3,FC[n%5],{jit:.04,em:.1,ol:false});n++}
 for(let n=0,t=0;n<34&&t<500;t++){const x=(R()-.5)*112,z=(R()-.5)*112;if(Math.hypot(x,z)<11||!clearAt(x,z,1.2))continue;KEEP.push([x,z,1.6]);bush(x,z,.85+R()*.5);n++}
 for(let n=0,t=0;n<220&&t<1200;t++){const x=(R()-.5)*114,z=(R()-.5)*114;if(!clearAt(x,z,.2))continue;tuft(x,z);n++}
 for(let n=0,t=0;n<16&&t<200;t++){const x=(R()-.5)*110,z=(R()-.5)*110;if(!clearAt(x,z,1.5))continue;const s=.5+R()*.7;sph(x,s*.3,z,s,'#9aa3b2',{ws:6,hs:4});addCircle(x,z,s*.8,s*.9);n++}
 // 雲・ヨット（うごく）
 for(let i=0;i<10;i++){const cx=(R()-.5)*240,cz=(R()-.5)*240,cy=30+R()*14,s=.8+R()*.9,sp=.5+R()*.6;
  for(const[ox,oy,oz,w,h,d]of[[0,0,0,11,2.6,6.5],[3.5,1.6,.4,5.5,2.2,4.4],[-3.6,1.2,-.5,4.6,1.8,3.8]])DYN3.push({g:gpu(gBox(w*s,h*s,d*s)),c:H4('#ffffff',.7),ns:1,f:t=>M4.T(((cx+ox*s+t*sp+170)%340+340)%340-170,cy+oy*s,cz+oz*s)})}
 for(let i=0;i<2;i++){const r=82+i*14,sp=(i?-.05:.06),ph=i*2.4;const f=(t,m)=>{const a=t*sp+ph;return M4.c(M4.T(Math.cos(a)*r,-.25+Math.sin(t*1.3+i)*.08,Math.sin(a)*r),M4.RY(-a+(sp>0?Math.PI:0)),m)};
  DYN3.push({g:gpu(gBox(1.5,.7,3.6)),c:H4(i?'#e94b4b':'#3c7be0'),ns:1,f:t=>f(t,M4.T(0,0,0))});DYN3.push({g:gpu(gBox(.12,3.4,.12)),c:H4('#f4f4f4'),ns:1,f:t=>f(t,M4.T(0,2,0))});
  DYN3.push({g:gpu(gBox(.06,2.4,1.5)),c:H4('#ffffff',.3),ns:1,f:t=>f(t,M4.T(0,2.2,.85))})}
 // 島を歩いているコンピューターのなかま
 const BN=['そら','ひなた','りく','ゆず','みお'],BA=[{shirt:'#e94b4b',hat:'cap',pet:'dog',face:'grin',hairStyle:1},{shirt:'#ffd23a',hat:'bunny',hairStyle:6,hair:'#5a3b22',face:'wink',design:'heart'},
  {shirt:'#35d07f',back:'cape',hat:'crown',face:'cool',hairStyle:0,design:'bolt'},{shirt:'#ff7ac8',hat:'cat',hairStyle:3,hair:'#c98b3a',face:'cat',design:'star'},{shirt:'#39c2ff',back:'jet',hat:'beanie',hairStyle:2,hair:'#3c7be0',face:'star',pants:'#22262f'}];
 BN.forEach((n,i)=>{const b=new Char(Object.assign({skin:SKIN6[(i*2+1)%6],num:(i*13+4)%100},BA[i]),{label:n,style:'bot'});const w=WP[(i*3+1)%WP.length];b.x=b.tx=w[0];b.z=b.tz=w[1];b.wait=i*.7;b.stuck=0;BOTS.push(b)});
 uploadStatic();W3.built=true}

/* ===================== マイホーム（ブロックの家） ===================== */
const PN=16,PH=12,PX0=5,PY0=.2,PZ0=-24;
const VOX=new Uint16Array(PN*PH*PN);const vi=(i,j,k)=>(j*PN+k)*PN+i;
let HM=null,HGM=null,voxN=0;
voxEach=function(x,z,fn){if(!voxN)return;const gx=x-PX0,gz=z-PZ0;if(gx<-1||gz<-1||gx>PN+1||gz>PN+1)return;
 const i0=Math.floor(gx-PR),i1=Math.floor(gx+PR),k0=Math.floor(gz-PR),k1=Math.floor(gz+PR);
 for(let k=k0;k<=k1;k++)for(let i=i0;i<=i1;i++){if(i<0||k<0||i>=PN||k>=PN)continue;const cx=clamp(gx,i,i+1),cz=clamp(gz,k,k+1);if((gx-cx)*(gx-cx)+(gz-cz)*(gz-cz)>=PR*PR)continue;
  for(let j=0;j<PH;j++){const c=VOX[vi(i,j,k)];if(!c)continue;const d=BLN[c>>2];if(d.solid===0)continue;fn(PY0+j,PY0+j+(d.h||1),d)}}};
function voxDef(x,y,z){const i=Math.floor(x-PX0),j=Math.floor(y-PY0),k=Math.floor(z-PZ0);if(i<0||j<0||k<0||i>=PN||j>=PH||k>=PN)return null;const c=VOX[vi(i,j,k)];return c?BLN[c>>2]:null}
function loadHouse(){VOX.fill(0);const b=(D.house&&D.house.b)||{};for(const k in b){const n=+k,c=b[k];if(n>=0&&n<VOX.length&&BLN[c>>2])VOX[n]=c}rebuildHouse()}
function setVox(idx,code){VOX[idx]=code;if(!D.house||!D.house.b)D.house={b:{}};if(code)D.house.b[idx]=code;else delete D.house.b[idx]}
const FACES=[[1,0,0,[[1,0,0],[1,1,0],[1,1,1],[1,0,1]]],[-1,0,0,[[0,0,0],[0,0,1],[0,1,1],[0,1,0]]],[0,1,0,[[0,1,0],[0,1,1],[1,1,1],[1,1,0]]],[0,-1,0,[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]],[0,0,1,[[0,0,1],[1,0,1],[1,1,1],[0,1,1]]],[0,0,-1,[[0,0,0],[0,1,0],[1,1,0],[1,0,0]]]];
function rebuildHouse(){const T={p:[],n:[],c:[],o:[]},Gl={p:[],n:[],c:[],o:[]};voxN=0;R=rng(7);
 const at=(i,j,k)=>(i<0||j<0||k<0||i>=PN||j>=PH||k>=PN)?null:(VOX[vi(i,j,k)]?BLN[VOX[vi(i,j,k)]>>2]:null);
 const cube=d=>d&&!d.furn&&!d.wedge&&!d.glass;
 for(let j=0;j<PH;j++)for(let k=0;k<PN;k++)for(let i=0;i<PN;i++){const code=VOX[vi(i,j,k)];if(!code)continue;voxN++;const d=BLN[code>>2],rot=code&3,X=PX0+i,Y=PY0+j,Z=PZ0+k;
  if(d.furn){const base=M4.mul(M4.T(X+.5,Y,Z+.5),M4.RY(rot*Math.PI/2));for(const f of d.furn){if(f[0]==='s')emit(T,gSph(f[1],8,6),M4.mul(base,M4.T(f[2],f[3],f[4])),f[5],0,.04);else emit(T,gBox(f[0],f[1],f[2],0,f[1]/2,0),M4.mul(base,M4.T(f[3],f[4],f[5])),f[6],f[7]||0,.04)}continue}
  if(d.wedge){OUTL=false;emit(T,gWedge(),M4.mul(M4.T(X+.5,Y,Z+.5),M4.RY(rot*Math.PI/2)),d.c,0,.05);OUTL=true;continue}
  const O=d.glass?Gl:T,c=hex(d.c),hs=Math.sin(vi(i,j,k)*12.9898)*43758.5453,f=1+((hs-Math.floor(hs))-.5)*(d.em?0:.09),hh=d.low?.85:1;
  for(const[dx,dy,dz,q]of FACES){const nb=at(i+dx,j+dy,k+dz);if(cube(nb)||(d.glass&&nb===d))continue;if(dy<0&&j===0)continue;const sh=d.glass?1:(dy>0?1:dy<0?.8:1);
   for(const n of[0,1,2,0,2,3]){O.p.push(X+q[n][0],Y+q[n][1]*hh,Z+q[n][2]);O.n.push(dx,dy,dz);O.c.push(c[0]*f*sh,c[1]*f*sh,c[2]*f*sh,d.em||0);if(d.glass)O.o.push(0,0,0);else O.o.push(q[n][0]*2-1,q[n][1]*2-1,q[n][2]*2-1)}}}
 freeMesh(HM);freeMesh(HGM);HM=T.p.length?mkMesh(T):null;HGM=Gl.p.length?mkMesh(Gl):null}
/* みほんの家（無料のブロックだけでできている） */
function tplHouse(){const S=(i,j,k,n,r=0)=>setVox(vi(i,j,k),n*4+r);
 for(let i=4;i<=10;i++)for(let k=5;k<=10;k++){if(i>4&&i<10&&k>5&&k<10)continue;const corner=(i===4||i===10)&&(k===5||k===10);for(let j=0;j<3;j++)S(i,j,k,corner?1:2)}
 for(const[i,k]of[[5,10],[9,10],[4,7],[4,8],[10,7],[10,8],[7,5]])S(i,1,k,4);
 setVox(vi(7,1,10),0);S(7,0,10,5,0);
 for(let L=0;L<4;L++){for(let i=3;i<=11;i++){S(i,3+L,11-L,3,0);S(i,3+L,4+L,3,2)}for(const i of[4,10])for(let k=5+L;k<=10-L;k++)S(i,3+L,k,2)}
 rebuildHouse()}
