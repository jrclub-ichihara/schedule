
/* ===================== アバター ===================== */
const AV0={skin:'#eebd92',hair:'#1b1b1b',hairStyle:0,shirt:'#2b5bd7',pants:'#16204a',shoes:'#ffffff',face:'smile',design:'num',num:7,hat:'none',back:'none',pet:'none',fx:'none'};
let RBC=[1,0,0,.35];const CS=1.32,LK=CS/1.15;
function colv(v,em=0){if(v==='gold')return[1,.78,.12,.3];const c=hex(v);return[c[0],c[1],c[2],em]}
const MT_={},DT_={};
/* 口（顔の下半分だけ絵にする。目・まゆ・ほっぺは立体） */
function mouthTex(id){return MT_[id]||(MT_[id]=ctex(128,64,g=>{const ink='#1c2233';g.lineCap='round';g.lineJoin='round';g.strokeStyle=ink;g.lineWidth=7;
 if(id==='grin'||id==='star'){g.beginPath();g.moveTo(34,14);g.quadraticCurveTo(64,70,94,14);g.closePath();g.fillStyle=ink;g.fill();g.stroke();g.save();g.clip();g.beginPath();g.ellipse(64,46,17,10,0,0,TAU);g.fillStyle='#ff6b81';g.fill();g.restore();
  g.fillStyle='#fff';g.fillRect(44,14,40,7)}
 else if(id==='cat'){g.beginPath();g.moveTo(40,22);g.quadraticCurveTo(52,42,64,24);g.quadraticCurveTo(76,42,88,22);g.stroke();g.lineWidth=4;for(const s of[-1,1]){g.beginPath();g.moveTo(64+s*30,16);g.lineTo(64+s*58,10);g.moveTo(64+s*30,28);g.lineTo(64+s*58,32);g.stroke()}}
 else if(id==='cool'){g.beginPath();g.moveTo(46,30);g.quadraticCurveTo(68,42,86,22);g.stroke()}
 else if(id==='wink'){g.beginPath();g.moveTo(42,18);g.quadraticCurveTo(64,46,86,18);g.stroke();g.beginPath();g.ellipse(72,34,8,6,0,0,TAU);g.fillStyle='#ff6b81';g.fill()}
 else if(id==='robo'){}
 else{g.beginPath();g.moveTo(42,18);g.quadraticCurveTo(64,48,86,18);g.stroke()}}))}
function desTex(d,num){const s={star:'★',heart:'♥',bolt:'⚡',fire:'🔥',crown:'👑',act:actIc()}[d];const key=d+'|'+(d==='num'?num:s);
 return DT_[key]||(DT_[key]=ctex(128,128,g=>{g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.font=`900 84px ${FJP}`;const tx=d==='num'?String(num):s;if(!tx)return;
  if(d==='num'||d==='star'||d==='heart'){g.lineWidth=13;g.strokeStyle='rgba(10,16,40,.85)';g.strokeText(tx,64,70);g.fillStyle=d==='star'?'#ffd23a':d==='heart'?'#ff5a8a':'#fff'}
  g.fillText(tx,64,70)}))}
const INK_=[.11,.13,.2,0],WHITE_=[1,1,1,0],CHEEK_=[1,.56,.64,.12];
/* オリジナルのキャラ：大きな丸い頭・ずんぐり体・短い足・丸い手 */
class Char{
 constructor(cfg,opts={}){Object.assign(this,{x:0,y:0,z:0,rot:0,vy:0,phase:0,walk:0,ground:true,bubble:null,bubbleT:0,cheer:0,gy:0});this.opts=opts;this.set(cfg)}
 set(cfg){this.cfg=Object.assign({},AV0,cfg);const c=this.cfg,K=k=>c[k]==='rainbow'?null:colv(c[k]);
  this.col={skin:colv(c.skin),hair:K('hair'),shirt:K('shirt'),pants:colv(c.pants),shoes:K('shoes')};
  this.mouth=c.face==='robo'?null:mouthTex(c.face);this.des=c.design==='none'?null:desTex(c.design,c.num);
  const lb=this.opts.label||c.name||'';if(lb!==this.lbT){if(this.label)gl.deleteTexture(this.label.t);this.label=labelTex(lb,this.opts.style||'player');this.lbT=lb}}
 say(s,t=2.4){if(this.bubble)gl.deleteTexture(this.bubble.t);this.bubble=bubbleTex(s);this.bubbleT=t}
 draw(D,TX,SP,SH,t){const c=this.col,cf=this.cfg,skin=c.skin,hair=c.hair||RBC,shirt=c.shirt||RBC,pants=c.pants,shoes=c.shoes||RBC;
  const sv=clamp(1+this.vy*.009,.9,1.13)-(this.sq||0),sq_=1/Math.sqrt(sv);
  const root=M4.c(M4.T(this.x,this.y,this.z),M4.RY(this.rot),M4.S(CS*sq_,CS*sv,CS*sq_));
  const w=this.walk,ph=this.phase,sw=Math.sin(ph)*.9*w,bob=Math.abs(Math.cos(ph))*.06*w+Math.sin(t*2.2+this.x)*.015*(1-w);
  const air=!this.ground,up=this.cheer>0,S=gSS(1,14,10),SS=gSS(1,10,7);
  const E=(g,m,col,ni)=>D.push({g:gpu(g),m:M4.mul(root,m),c:col,ni});
  const el=(x,y,z,sx,sy,sz,col,rot,ni)=>E(sx<.08?SS:S,rot?M4.c(M4.T(x,y,z),rot,M4.S(sx,sy,sz)):M4.c(M4.T(x,y,z),M4.S(sx,sy,sz)),col,ni);
  // あし・くつ
  for(const s of[-1,1]){const lm=M4.mul(M4.T(.15*s,.46,0),M4.RX(air?(s>0?-.6:.35):sw*s));E(gCapD(.12,.22),lm,pants);E(S,M4.c(lm,M4.T(0,-.36,.05),M4.S(.15,.11,.21)),shoes)}
  // こし・どう
  el(0,.55+bob*.5,0,.31,.19,.25,pants);el(0,.84+bob,0,.37,.36,.3,shirt);
  // うで（そで＋手）
  for(const s of[-1,1]){const ang=(air||up)?M4.mul(M4.RX(-2.6),M4.RZ(.3*s)):M4.mul(M4.RX(-sw*s*.9),M4.RZ(.24*s));const am=M4.c(M4.T(.37*s,1.02+bob,0),ang);
   E(S,M4.mul(am,M4.S(.15,.15,.15)),shirt);E(gCapD(.095,.2),am,skin);E(S,M4.c(am,M4.T(0,-.33,0),M4.S(.125,.125,.125)),skin)}
  if(this.des)TX.push({tex:this.des,m:M4.c(root,M4.T(0,.86+bob,.302),M4.S(.32,.32,1))});
  // あたま
  const hy=1.5+bob,H=M4.c(root,M4.T(0,hy,0),M4.RZ(Math.sin(ph)*.05*w),M4.RX(air?-.1:0));
  const HE=(g,m,col,ni)=>D.push({g:gpu(g),m:M4.mul(H,m),c:col,ni});
  const he=(x,y,z,sx,sy,sz,col,rot,ni)=>HE(sx<.08&&sy<.08?SS:S,rot?M4.c(M4.T(x,y,z),rot,M4.S(sx,sy,sz)):M4.c(M4.T(x,y,z),M4.S(sx,sy,sz)),col,ni);
  const R=.56;he(0,0,0,R*1.06,R*.96,R,skin);
  // かお：目・まゆ・ほっぺ（立体）
  const f=cf.face,blink=((t+this.x*.37+this.z*.11)%3.6)<.13,look=this===P&&SHOW?0:Math.sin(t*.7+this.x)*.012;
  if(f==='robo'){he(0,.06,.43,.43,.17,.15,H4('#39c2ff',.65));for(const s of[-1,1])he(.15*s,.07,.565,.055,.055,.02,H4('#ffffff',1),0,1)}
  else if(f==='cool'){for(const s of[-1,1])he(.2*s,.06,.5,.18,.12,.07,H4('#151821'),M4.RY(.3*s));HE(gBox(.16,.05,.05),M4.T(0,.1,.56),H4('#151821'));for(const s of[-1,1])he(.2*s+.06,.11,.565,.045,.025,.01,H4('#ffffff',.6),0,1)}
  else for(const s of[-1,1]){const er=M4.RY(.32*s),closed=blink||(f==='wink'&&s>0);
   if(closed)he(.2*s,.04,.52,.11,.028,.035,INK_,er);
   else{he(.2*s,.06,.46,.125,.165,.09,WHITE_,er);const st=f==='star',pr=st?.085:.072;he(.205*s+look,.045,.54,pr,pr*1.3,.04,st?H4('#ffb400',.3):INK_,er,1);he(.205*s+.035+look,.095,.575,.028,.034,.012,H4('#ffffff',1),er,1)}}
  if(f!=='robo'&&f!=='cool')for(const s of[-1,1])he(.2*s,.29,.47,.1,.03,.035,cf.hair==='rainbow'?RBC:hair,M4.RZ(-(f==='grin'||f==='star'?.2:.1)*s));
  if(f!=='robo')for(const s of[-1,1])he(.37*s,-.12,.37,.09,.055,.04,CHEEK_,M4.RY(.75*s),1);
  if(this.mouth)TX.push({tex:this.mouth,m:M4.c(H,M4.T(0,-.2,.535),M4.S(f==='cat'?.44:.3,f==='cat'?.22:.15,1))});
  // かみがた（頭の丸みにそったヘルメット形＋前がみ）
  const a=cf.hat,cover=a==='cap'||a==='beanie'||a==='straw'||a==='wizard'||a==='crown';let hs=cf.hairStyle;if(cover&&(hs===1||hs===2))hs=0;
  const cap=rr=>HE(gSS(1,18,8,Math.PI*.52),M4.c(M4.T(0,.02,-.01),M4.RX(-.65),M4.S(R*1.06*rr,R*.96*rr,R*rr)),hair);
  if(a!=='robo'){
   if(hs===4)cap(1.025);
   else{cap(1.08);
    if(hs===0||hs===5||hs===6)for(let i=-1;i<=1;i++)he(i*.2,.37,.37,.17,.12,.12,hair,M4.c(M4.RZ(-i*.35),M4.RX(.55)));
    if(hs===1)for(let i=0;i<6;i++){const an=(i/5-.5)*2.3;HE(gCyl(0,.15,.36,6),M4.c(M4.T(Math.sin(an)*.3,.44+Math.cos(an)*.05,-.1-Math.abs(an)*.06),M4.RZ(-an*.7),M4.RX(-.4)),hair)}
    if(hs===2)for(const[x,y,z,r]of[[0,.5,-.06,.3],[-.3,.38,-.1,.25],[.3,.38,-.1,.25],[0,.36,-.34,.28],[-.26,.16,-.3,.22],[.26,.16,-.3,.22]])he(x,y,z,r,r,r,hair);
    if(hs===3){he(0,-.3,-.3,.5,.5,.22,hair);for(const s of[-1,1])he(.52*s,-.24,-.02,.11,.34,.17,hair)}
    if(hs===5){he(0,.22,-.6,.14,.14,.14,hair);he(0,-.1,-.7,.13,.32,.13,hair,M4.RX(.35+sw*.3))}
    if(hs===6)for(const s of[-1,1]){he(.57*s,.12,-.12,.11,.11,.11,hair);he(.68*s,-.2,-.12,.12,.3,.12,hair,M4.RZ(.25*s+sw*.15))}}}
  // ぼうし
  const red=H4('#e94b4b'),wht=H4('#ffffff'),gold=H4('#ffcc1a',.28);
  if(a==='cap'){HE(gSS(1,18,8,Math.PI*.5),M4.c(M4.T(0,.08,0),M4.RX(-.22),M4.S(.65,.53,.65)),red);he(0,.17,.56,.31,.035,.25,red,M4.RX(.12));he(0,.62,-.08,.055,.055,.055,wht)}
  else if(a==='band'){HE(gRing(.555,.12),M4.c(M4.T(0,.18,0),M4.RX(-.18),M4.S(1.07,1,1.03)),wht);he(0,.25,.57,.08,.06,.03,red,0,1);for(const s of[-1,1])he(.09*s,.1,-.66,.05,.18,.03,wht,M4.RX(.5+sw*.4*s))}
  else if(a==='beanie'){const gr=H4('#35d07f');HE(gSS(1,18,8,Math.PI*.55),M4.c(M4.T(0,.1,-.02),M4.RX(-.25),M4.S(.65,.64,.65)),gr);HE(gRing(.63,.14),M4.c(M4.T(0,.04,-.02),M4.RX(-.25),M4.S(1.03,1,1)),wht);he(0,.8,-.14,.13,.13,.13,wht)}
  else if(a==='straw'){const sc=H4('#e8c66a');HE(gCyl(.95,.95,.04,22),M4.c(M4.T(0,.3,0),M4.RX(-.12)),sc);HE(gCyl(.42,.46,.3,18),M4.c(M4.T(0,.32,-.02),M4.RX(-.12)),sc);HE(gRing(.465,.09),M4.c(M4.T(0,.34,-.02),M4.RX(-.12)),red)}
  else if(a==='phones'){const dk=H4('#22262f');for(let i=0;i<=8;i++){const an=i/8*Math.PI;he(Math.cos(an)*.64,.05+Math.sin(an)*.6,-.04,.065,.065,.065,dk)}for(const s of[-1,1]){he(.6*s,0,0,.11,.21,.21,dk);he(.69*s,0,0,.04,.15,.15,H4('#ff7a1a',.2),0,1)}}
  else if(a==='cat'){for(const s of[-1,1]){HE(gCyl(0,.17,.3,4),M4.c(M4.T(.3*s,.46,-.06),M4.RZ(-.38*s)),hair);HE(gCyl(0,.09,.17,4),M4.c(M4.T(.3*s,.48,0),M4.RZ(-.38*s)),H4('#ff9ec4'),1)}}
  else if(a==='bunny'){for(const s of[-1,1]){const m=M4.c(M4.T(.18*s,.62,-.06),M4.RZ(-.15*s+Math.sin(t*3)*.05));HE(S,M4.c(m,M4.T(0,.26,0),M4.S(.1,.32,.06)),wht);HE(S,M4.c(m,M4.T(0,.26,.04),M4.S(.05,.24,.03)),H4('#ff9ec4'),1)}}
  else if(a==='wizard'){const pu=H4('#6c3fd1');HE(gCyl(.85,.85,.04,22),M4.c(M4.T(0,.36,0),M4.RX(-.12)),pu);HE(gCyl(0,.43,.9,18),M4.c(M4.T(0,.38,-.02),M4.RX(-.18)),pu);HE(gRing(.43,.09),M4.c(M4.T(0,.38,-.02),M4.RX(-.18)),gold)}
  else if(a==='halo'){HE(gRing(.32,.05,26),M4.T(0,.92+Math.sin(t*2.4)*.03,0),H4('#fff1a8',.95))}
  else if(a==='crown'){HE(gRing(.36,.15),M4.T(0,.5,-.02),gold);for(let i=0;i<5;i++){const an=i/5*TAU;HE(gCyl(0,.08,.18,4),M4.T(Math.sin(an)*.33,.65,Math.cos(an)*.33-.02),gold)}he(0,.58,.36,.06,.06,.04,H4('#e94b4b',.45))}
  else if(a==='robo'){HE(gCyl(.03,.03,.3,6),M4.T(0,.5,0),H4('#d9dde3'));he(0,.84,0,.09,.09,.09,H4('#e94b4b',.6));for(const s of[-1,1])he(.6*s,0,0,.07,.15,.15,H4('#9aa3b2'))}
  // せなか
  const b=cf.back,by=.9+bob;
  if(b==='pack'){el(0,by,-.33,.27,.3,.15,H4('#ff7a1a'));el(0,by-.08,-.46,.18,.12,.05,H4('#ffb14a'))}
  else if(b==='cape'){const cm=M4.c(M4.T(0,1.12+bob,-.27),M4.RX(-.12-w*.45-Math.sin(t*5+this.x)*.05*(w+.3)-(air?.5:0)));E(S,M4.c(cm,M4.T(0,-.42,0),M4.S(.4,.48,.04)),H4('#e03a4e'))}
  else if(b==='wingA'||b==='wingD'){const A=b==='wingA',c1=A?H4('#ffffff',.18):H4('#7a3fd0'),c2=A?H4('#dff3ff',.18):H4('#b04cf0'),fl=Math.sin(t*(air?16:3.2))*(air?.55:.14);
   for(const s of[-1,1]){const m=M4.c(M4.T(.12*s,by+.12,-.28),M4.RY((-.5-fl)*s),M4.RZ(.3*s));E(S,M4.c(m,M4.T(.28*s,.05,0),M4.S(.28,.15,.035)),c1);E(S,M4.c(m,M4.T(.5*s,.2,0),M4.S(.2,.11,.03)),c2);E(S,M4.c(m,M4.T(.42*s,-.12,0),M4.S(.18,.09,.03)),c2)}}
  else if(b==='jet'){for(const s of[-1,1]){E(gCapD(.11,.3),M4.T(.15*s,by+.18,-.34),H4('#b8c0cc'));E(gCyl(0,.11,.16,10),M4.T(.15*s,by+.28,-.34),red);if(air)E(gCyl(.09,0,.32+Math.random()*.16,8),M4.c(M4.T(.15*s,by-.25,-.34),M4.RX(Math.PI)),H4('#ffb020',1),1)}el(0,by,-.27,.18,.16,.08,H4('#6b7586'))}
  const lh=.46;SP.push({top:1,tex:this.label,x:this.x,y:this.y+(2.85+(a==='wizard'?.95:a==='bunny'?.55:a==='halo'||a==='crown'?.3:0))*LK,z:this.z,w:lh*this.label.aspect,h:lh});
  if(this.bubble&&this.bubbleT>0){const bh=this.bubble.aspect>1.2?.62:.85;SP.push({top:1,tex:this.bubble,x:this.x,y:this.y+3.65*LK,z:this.z,w:bh*this.bubble.aspect,h:bh})}
  SH.push({x:this.x,z:this.z,y:this.gy??0,s:1.5*LK})}
}
/* ---------- ペット（まるいフォルム） ---------- */
function drawPet(D,p,t){const fly=p.type==='ufo'||p.type==='dragon'||p.type==='robo';const hop=fly?(p.type==='robo'?.5:.9)+Math.sin(t*3)*.08:Math.abs(Math.sin(p.ph))*.2*p.mv;
 const root=M4.c(M4.T(p.x,p.y+hop,p.z),M4.RY(p.rot),M4.S(1.35,1.35,1.35)),S=gSS(1,14,10);
 const E=(g,m,col,ni)=>D.push({g:gpu(g),m:M4.mul(root,m),c:typeof col==='string'?H4(col):col,ni});
 const el=(x,y,z,sx,sy,sz,col,rot,ni)=>E(S,rot?M4.c(M4.T(x,y,z),rot,M4.S(sx,sy,sz)):M4.c(M4.T(x,y,z),M4.S(sx,sy,sz)),col,ni);
 const eyes=(y,z,dx=.08,r=.05)=>{for(const s of[-1,1]){el(dx*s,y,z,r,r*1.25,r*.6,WHITE_);el(dx*s,y-.005,z+r*.45,r*.6,r*.8,r*.35,INK_,0,1);el(dx*s+.012,y+.018,z+r*.7,r*.22,r*.22,r*.1,H4('#ffffff',1),0,1)}};
 const ty=p.type;
 if(ty==='chick'){el(0,.24,0,.25,.23,.25,'#ffd84a');el(0,.5,.05,.19,.18,.19,'#ffd84a');E(gCyl(0,.06,.12,8),M4.c(M4.T(0,.47,.24),M4.RX(Math.PI/2)),'#ff8a1e');eyes(.53,.19,.07,.045);
  for(const s of[-1,1]){el(.24*s,.26,0,.06,.12,.14,'#f7c530',M4.RZ((.3+Math.sin(t*12)*.25*p.mv)*s));el(.08*s,.02,.04,.06,.03,.08,'#ff8a1e')}el(0,.68,.02,.04,.07,.04,'#ffd84a')}
 else if(ty==='slime'){const q=1+Math.sin(t*5)*.08;el(0,.24*q,0,.32/q,.26*q,.32/q,H4('#48d98a',.15));el(-.12,.36*q,.16,.07,.05,.04,H4('#ffffff',.6),0,1);eyes(.28*q,.27,.1,.06)}
 else if(ty==='dog'||ty==='cat'){const c1=ty==='dog'?'#d9a066':'#9aa3b2',c2=ty==='dog'?'#8a5a2b':'#6b7586',c3=ty==='dog'?'#f3d2a8':'#d9dde3';
  el(0,.3,0,.22,.19,.32,c1);el(0,.54,.26,.22,.2,.2,c1);el(0,.48,.42,.11,.08,.09,c3);el(0,.52,.5,.04,.03,.03,INK_);eyes(.6,.42,.09,.05);
  for(const sx of[-1,1])for(const sz of[-1,1])E(gCapD(.06,.12),M4.mul(M4.T(.12*sx,.2,.17*sz),M4.RX(Math.sin(p.ph+(sx*sz>0?0:Math.PI))*.6*p.mv)),c2);
  if(ty==='dog'){for(const s of[-1,1])el(.2*s,.55,.24,.06,.15,.09,c2,M4.RZ(.35*s));E(gCapD(.05,.2),M4.c(M4.T(0,.38,-.3),M4.RY(Math.sin(t*12)*.6),M4.RX(-.9)),c2)}
  else{for(const s of[-1,1]){E(gCyl(0,.09,.16,4),M4.c(M4.T(.13*s,.7,.26),M4.RZ(-.3*s)),c2)}E(gCapD(.05,.34),M4.c(M4.T(0,.36,-.3),M4.RX(-2.5+Math.sin(t*3)*.2)),c2)}}
 else if(ty==='robo'){el(0,.18,0,.24,.2,.22,'#c9d1dc');el(0,.46,0,.22,.18,.2,'#e8edf3');el(0,.47,.15,.17,.07,.06,H4('#39c2ff',.8));E(gCyl(.02,.02,.16,6),M4.T(0,.62,0),'#9aa3b2');el(0,.8,0,.05,.05,.05,H4('#e94b4b',.7));E(gCyl(.1,0,.16,8),M4.c(M4.T(0,-.04,0),M4.RX(Math.PI)),H4('#ffb020',1),1)}
 else if(ty==='ufo'){const sp=M4.RY(t*2.5);E(S,M4.c(sp,M4.S(.46,.1,.46)),'#c9d1dc');E(gSS(1,14,6,Math.PI*.5),M4.c(M4.T(0,.04,0),M4.S(.22,.24,.22)),H4('#7fe9ff',.55));
  for(let i=0;i<5;i++){const a=t*2.5+i*TAU/5;el(Math.cos(a)*.36,0,Math.sin(a)*.36,.05,.05,.05,H4(['#ff5a6a','#ffd23a','#35d07f','#39c2ff','#ff7ac8'][i],.9),0,1)}}
 else if(ty==='dragon'){el(0,.15,0,.26,.24,.4,'#3fbf6a');el(0,.12,.08,.19,.18,.3,'#ffe08a');el(0,.42,.32,.24,.22,.24,'#3fbf6a');el(0,.36,.52,.14,.1,.12,'#58d684');eyes(.48,.5,.1,.055);
  for(const s of[-1,1]){E(S,M4.c(M4.T(.15*s,.32,-.04),M4.RZ((.4+Math.sin(t*10)*.6)*s),M4.T(.22*s,0,0),M4.S(.26,.03,.18)),'#ff8a3c');E(gCyl(0,.05,.15,6),M4.c(M4.T(.1*s,.6,.3),M4.RX(-.4)),'#ffe08a')}
  E(gCapD(.08,.36),M4.c(M4.T(0,.15,-.36),M4.RY(Math.sin(t*4)*.4),M4.RX(-1.9)),'#3fbf6a')}}

/* ===================== ショップのカタログ ===================== */
/* きせかえ：[id, なまえ, ねだん, アイコン or 色] */
const SKIN6=['#f9dcc0','#f6d5b5','#eebd92','#d39b6e','#a8724a','#7a4f30'];
const WEAR=[
 {k:'hat',n:'ぼうし',it:[['none','なし',0,'🚫'],['cap','キャップ',5,'🧢'],['band','ハチマキ',5,'🎗️'],['beanie','ニットぼう',6,'🧶'],['straw','むぎわら',8,'👒'],['phones','ヘッドホン',12,'🎧'],['cat','ねこみみ',12,'🐱'],['bunny','うさみみ',12,'🐰'],['wizard','まほうぼうし',15,'🔮'],['halo','てんしのわ',25,'😇'],['crown','おうかん',40,'👑']]},
 {k:'back',n:'せなか',it:[['none','なし',0,'🚫'],['pack','リュック',8,'🎒'],['cape','マント',15,'🦸'],['wingA','てんしのはね',30,'🕊️','おちるとき、ジャンプ長おしでふわっと'],['wingD','ドラゴンのはね',35,'🐲','おちるとき、ジャンプ長おしでふわっと'],['jet','ジェットパック',45,'🚀','空中でもう1回ジャンプできる']]},
 {k:'pet',n:'ペット',it:[['none','なし',0,'🚫'],['chick','ひよこ',12,'🐥'],['slime','スライム',15,'🟢'],['dog','こいぬ',20,'🐶'],['cat','ねこ',20,'🐈'],['robo','ミニロボ',30,'🤖'],['ufo','UFO',45,'🛸'],['dragon','ドラゴン',60,'🐉']]},
 {k:'fx',n:'エフェクト',it:[['none','なし',0,'🚫'],['spark','キラキラ',15,'✨'],['heart','ハート',15,'💖'],['rainbow','にじ',30,'🌈'],['fire','ほのお',30,'🔥']]},
 {k:'face',n:'かお',it:[['smile','にっこり',0,'🙂'],['grin','げんき',0,'😄'],['wink','ウインク',6,'😉'],['cat','ねこ',10,'😺'],['star','キラキラ',10,'🤩'],['cool','クール',12,'😎']]},
 {k:'shirt',n:'シャツ',col:1,it:[['#2b5bd7','ブルー',0],['#e94b4b','レッド',0],['#ffd23a','イエロー',0],['#35d07f','グリーン',0],['#f4f4f4','ホワイト',0],['#22262f','ブラック',0],['#ff7a1a','オレンジ',0],['#ff7ac8','ピンク',3],['#9b59d0','パープル',3],['#39c2ff','スカイ',3],['gold','ゴールド',25],['rainbow','レインボー',40]]},
 {k:'design',n:'マーク',it:[['num','ばんごう',0,'7️⃣'],['none','むじ',0,'⬜'],['star','ほし',5,'⭐'],['heart','ハート',5,'💗'],['bolt','いなずま',8,'⚡'],['act','部活マーク',8,'🏅'],['fire','ほのお',10,'🔥'],['crown','おうかん',15,'👑']]},
 {k:'pants',n:'ズボン',col:1,it:[['#16204a','ネイビー',0],['#22262f','ブラック',0],['#f4f4f4','ホワイト',0],['#6b7586','グレー',0],['#8a5a2b','ブラウン',0],['#e94b4b','レッド',0],['#2b5bd7','ブルー',0],['#35d07f','グリーン',0]]},
 {k:'shoes',n:'くつ',col:1,it:[['#ffffff','ホワイト',0],['#22262f','ブラック',0],['#e94b4b','レッド',0],['#3c7be0','ブルー',0],['#ffd23a','イエロー',0],['gold','ゴールド',15],['rainbow','レインボー',25]]},
 {k:'hairStyle',n:'かみがた',it:[[0,'ショート',0,'💇'],[4,'ボウズ',0,'🧑‍🦲'],[3,'ロング',0,'👩'],[1,'ツンツン',5,'🦔'],[2,'もこもこ',5,'🐑'],[5,'ポニーテール',8,'🎀'],[6,'ツインテール',8,'🎀']]},
 {k:'hair',n:'かみの色',col:1,it:[['#1b1b1b','くろ',0],['#5a3b22','ちゃいろ',0],['#c98b3a','あかるい茶',0],['#eeeeee','シルバー',5],['#e94b4b','レッド',5],['#3c7be0','ブルー',5],['#ff7ac8','ピンク',5],['#35d07f','グリーン',5],['#9b59d0','パープル',5],['rainbow','レインボー',30]]},
 {k:'skin',n:'はだ',col:1,it:SKIN6.map(c=>[c,'',0])}];
/* 家づくり：n は保存用の番号（かえないこと）。furn は [幅,高さ,奥行, x,y,z, 色, 光り方] の箱のあつまり */
const BL=[
 {n:1,id:'wood',nm:'木',c:'#b9803f',p:0,t:0},{n:2,id:'wall',nm:'しろかべ',c:'#f1ede4',p:0,t:0},{n:3,id:'roof',nm:'やね',c:'#d9483b',p:0,t:0,wedge:1},
 {n:4,id:'glass',nm:'ガラス',c:'#9fdcff',p:0,t:0,glass:1},{n:6,id:'grass',nm:'しばふ',c:'#56b947',p:0,t:0},
 {n:7,id:'brick',nm:'レンガ',c:'#b5533c',p:5,t:0},{n:8,id:'stone',nm:'いし',c:'#8f969e',p:5,t:0},{n:18,id:'roofB',nm:'あおいやね',c:'#3c7be0',p:5,t:0,wedge:1},
 {n:9,id:'red',nm:'あか',c:'#e94b4b',p:3,t:0},{n:10,id:'blue',nm:'あお',c:'#3c7be0',p:3,t:0},{n:11,id:'yellow',nm:'きいろ',c:'#ffd23a',p:3,t:0},{n:12,id:'pink',nm:'ピンク',c:'#ff8fc0',p:3,t:0},{n:13,id:'black',nm:'くろ',c:'#2a2e38',p:3,t:0},
 {n:14,id:'ice',nm:'こおり',c:'#c8f1ff',p:10,t:0,glass:1},{n:16,id:'neon',nm:'ネオン',c:'#39ffb0',em:.9,p:15,t:0},{n:15,id:'gold',nm:'ゴールド',c:'#ffcc1a',em:.3,p:25,t:0},{n:17,id:'rainbow',nm:'レインボー',c:'#ffffff',em:2,p:30,t:0},
 {n:5,id:'door',nm:'ドア',ic:'🚪',p:0,t:1,solid:0,furn:[[.1,2,.16,-.45,0,0,'#6b4423'],[.1,2,.16,.45,0,0,'#6b4423'],[1,.12,.16,0,1.88,0,'#6b4423'],[.07,1.86,.78,-.4,0,.42,'#a86a35'],[.06,.08,.08,-.34,.95,.7,'#ffd23a',.3]]},
 {n:22,id:'chair',nm:'いす',ic:'🪑',p:5,t:1,h:.5,furn:[[.6,.1,.6,0,.4,0,'#c58a4a'],[.6,.5,.08,0,.5,-.26,'#c58a4a'],[.08,.4,.08,-.24,0,-.24,'#8a5a2b'],[.08,.4,.08,.24,0,-.24,'#8a5a2b'],[.08,.4,.08,-.24,0,.24,'#8a5a2b'],[.08,.4,.08,.24,0,.24,'#8a5a2b']]},
 {n:21,id:'table',nm:'つくえ',ic:'🪵',p:8,t:1,h:.7,furn:[[.96,.1,.96,0,.6,0,'#c58a4a'],[.1,.6,.1,-.38,0,-.38,'#8a5a2b'],[.1,.6,.1,.38,0,-.38,'#8a5a2b'],[.1,.6,.1,-.38,0,.38,'#8a5a2b'],[.1,.6,.1,.38,0,.38,'#8a5a2b']]},
 {n:24,id:'lamp',nm:'ランプ',ic:'💡',p:8,t:1,solid:0,furn:[[.3,.06,.3,0,0,0,'#6b7586'],[.07,1.2,.07,0,.06,0,'#6b7586'],[.42,.32,.42,0,1.2,0,'#fff1a8',.95]]},
 {n:37,id:'rug',nm:'じゅうたん',ic:'🟥',p:5,t:1,solid:0,furn:[[.98,.04,.98,0,0,0,'#e0566b'],[.7,.045,.7,0,0,0,'#ffd9a0']]},
 {n:26,id:'shelf',nm:'本だな',ic:'📚',p:10,t:1,furn:[[.96,1,.36,0,0,-.3,'#8a5a2b'],[.86,.3,.04,0,.12,-.11,'#e94b4b'],[.5,.28,.04,-.16,.55,-.11,'#3c7be0'],[.3,.24,.04,.26,.55,-.11,'#ffd23a']]},
 {n:23,id:'sofa',nm:'ソファ',ic:'🛋️',p:12,t:1,h:.45,furn:[[.96,.4,.8,0,0,.05,'#4f8fe6'],[.96,.5,.2,0,.4,-.37,'#3c7be0'],[.14,.24,.8,-.41,.4,.05,'#3c7be0'],[.14,.24,.8,.41,.4,.05,'#3c7be0']]},
 {n:20,id:'bed',nm:'ベッド',ic:'🛏️',p:15,t:1,h:.5,furn:[[.96,.3,.96,0,0,0,'#8a5a2b'],[.9,.18,.9,0,.3,0,'#f4f4f4'],[.6,.12,.24,0,.48,-.3,'#ffffff'],[.92,.07,.56,0,.48,.17,'#ff7a1a'],[.96,.5,.08,0,.3,-.46,'#6b4423']]},
 {n:25,id:'tv',nm:'テレビ',ic:'📺',p:15,t:1,h:.4,furn:[[.86,.4,.4,0,0,0,'#6b4423'],[.92,.56,.07,0,.44,0,'#16181f'],[.82,.46,.02,0,.49,.04,'#5ad1ff',.9],[.2,.06,.14,0,.4,0,'#16181f']]},
 {n:29,id:'trophy',nm:'トロフィー',ic:'🏆',p:30,t:1,solid:0,furn:[[.4,.12,.4,0,0,0,'#6b4423'],[.12,.2,.12,0,.12,0,'#ffcc1a',.3],[.36,.3,.36,0,.32,0,'#ffcc1a',.3],[.08,.16,.06,-.24,.4,0,'#ffcc1a',.3],[.08,.16,.06,.24,.4,0,'#ffcc1a',.3]]},
 {n:33,id:'fence',nm:'さく',ic:'🚧',p:0,t:2,furn:[[.12,.9,.12,-.44,0,0,'#f4f4f4'],[.12,.9,.12,.44,0,0,'#f4f4f4'],[1,.1,.07,0,.62,0,'#f4f4f4'],[1,.1,.07,0,.3,0,'#f4f4f4']]},
 {n:27,id:'flower',nm:'はな',ic:'🌷',p:5,t:2,solid:0,furn:[[.3,.22,.3,0,0,0,'#b5533c'],[.05,.34,.05,0,.22,0,'#3fae49'],[.22,.2,.22,0,.52,0,'#ff5a8a',.15],[.08,.08,.08,0,.72,0,'#ffd23a',.3]]},
 {n:28,id:'tree',nm:'にわの木',ic:'🌳',p:8,t:2,solid:0,furn:[[.22,.7,.22,0,0,0,'#8b5a2b'],[.9,.7,.9,0,.6,0,'#3fae49'],[.6,.4,.6,0,1.3,0,'#56c24a']]},
 {n:32,id:'flag',nm:'はた',ic:'🚩',p:10,t:2,solid:0,furn:[[.3,.08,.3,0,0,0,'#6b7586'],[.07,2.3,.07,0,.08,0,'#d9dde3'],[.7,.44,.03,.38,1.9,0,'#ff7a1a',.1]]},
 {n:35,id:'ball',nm:'ボール',ic:'🏀',p:10,t:2,solid:0,furn:[['s',.3,0,.3,0,'#ff8a1e']]},
 {n:36,id:'pool',nm:'プールの水',ic:'💧',c:'#3aa7ff',p:10,t:2,glass:1,solid:0,low:1},
 {n:30,id:'hoop',nm:'バスケゴール',ic:'⛹️',p:20,t:2,solid:0,furn:[[.12,2.7,.12,0,0,-.4,'#6b7586'],[.96,.66,.06,0,2.1,-.3,'#ffffff'],[.3,.24,.02,0,2.16,-.26,'#e94b4b'],[.44,.04,.06,0,2.08,.14,'#ff7a1a'],[.06,.04,.4,-.2,2.08,-.06,'#ff7a1a'],[.06,.04,.4,.2,2.08,-.06,'#ff7a1a']]},
 {n:31,id:'tramp',nm:'トランポリン',ic:'🤸',p:25,t:2,h:.35,bounce:1,furn:[[.98,.3,.98,0,0,0,'#2a2e38'],[.82,.06,.82,0,.3,0,'#39c2ff',.35]]}];
const BLN={};for(const b of BL)BLN[b.n]=b;
const BTABS=['ブロック','かぐ','にわ・あそび'];
const owns=key=>!!(D.own&&D.own[key]);
function avFix(){const o=D.av||{};if(!o.v2){D.av=Object.assign({v2:1},AV0,{skin:o.skin||AV0.skin,hairStyle:typeof o.hair==='number'?o.hair:0,num:o.num??7})}D.own=D.own||{};D.coins=D.coins||0;
 for(const c of WEAR){const cur=D.av[c.k],it=c.it.find(i=>i[0]===cur);if(!it||(it[2]>0&&!owns(c.k+':'+cur)))D.av[c.k]=AV0[c.k]}}
const avCfg=av=>Object.assign({name:D.name||'プレイヤー'},av);
