/* ===== 3D ===== */
/* ブロックワールド — 依存なしの WebGL1 ミニエンジン（かげ・空・水・パーティクルつき） */
const TAU=Math.PI*2,D2R=Math.PI/180,FOV=42*D2R;
const isTouch=('ontouchstart' in window)||navigator.maxTouchPoints>0;
if(isTouch)document.body.classList.add('touch');
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let R=rng(11);
function hex(h){const n=parseInt(h.slice(1),16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255]}
function hex4(h,em=0){return[...hex(h),em]}
const HC_={};const H4=(h,em=0)=>HC_[h+em]||(HC_[h+em]=hex4(h,em));
function hsv(h,s,v){const f=n=>{const k=(n+h*6)%6;return v-v*s*Math.max(0,Math.min(k,4-k,1))};return[f(5),f(3),f(1)]}
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
function lerpAng(a,b,t){let d=((b-a+Math.PI)%TAU+TAU)%TAU-Math.PI;return a+d*t}

/* ---------- mat4 (column-major) ---------- */
const M4={
 I(){const m=new Float32Array(16);m[0]=m[5]=m[10]=m[15]=1;return m},
 mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++){const b0=b[c*4],b1=b[c*4+1],b2=b[c*4+2],b3=b[c*4+3];
  for(let r=0;r<4;r++)o[c*4+r]=a[r]*b0+a[4+r]*b1+a[8+r]*b2+a[12+r]*b3}return o},
 c(...ms){let m=ms[0];for(let i=1;i<ms.length;i++)m=M4.mul(m,ms[i]);return m},
 T(x,y,z){const m=M4.I();m[12]=x;m[13]=y;m[14]=z;return m},
 S(x,y,z){const m=M4.I();m[0]=x;m[5]=y;m[10]=z;return m},
 RY(a){const m=M4.I(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[2]=-s;m[8]=s;m[10]=c;return m},
 RX(a){const m=M4.I(),c=Math.cos(a),s=Math.sin(a);m[5]=c;m[6]=s;m[9]=-s;m[10]=c;return m},
 RZ(a){const m=M4.I(),c=Math.cos(a),s=Math.sin(a);m[0]=c;m[1]=s;m[4]=-s;m[5]=c;return m},
 persp(f,asp,n,fa){const t=1/Math.tan(f/2),m=new Float32Array(16);m[0]=t/asp;m[5]=t;m[10]=(fa+n)/(n-fa);m[11]=-1;m[14]=2*fa*n/(n-fa);return m},
 ortho(l,r,b,t,n,f){const m=new Float32Array(16);m[0]=2/(r-l);m[5]=2/(t-b);m[10]=-2/(f-n);m[12]=-(r+l)/(r-l);m[13]=-(t+b)/(t-b);m[14]=-(f+n)/(f-n);m[15]=1;return m},
 lookAt(e,t,u){let zx=e[0]-t[0],zy=e[1]-t[1],zz=e[2]-t[2];let l=Math.hypot(zx,zy,zz)||1;zx/=l;zy/=l;zz/=l;
  let xx=u[1]*zz-u[2]*zy,xy=u[2]*zx-u[0]*zz,xz=u[0]*zy-u[1]*zx;l=Math.hypot(xx,xy,xz)||1;xx/=l;xy/=l;xz/=l;
  const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;const m=new Float32Array(16);
  m[0]=xx;m[4]=xy;m[8]=xz;m[1]=yx;m[5]=yy;m[9]=yz;m[2]=zx;m[6]=zy;m[10]=zz;
  m[12]=-(xx*e[0]+xy*e[1]+xz*e[2]);m[13]=-(yx*e[0]+yy*e[1]+yz*e[2]);m[14]=-(zx*e[0]+zy*e[1]+zz*e[2]);m[15]=1;return m}
};
const IDENT=M4.I();

/* ---------- geometry (flat-shaded low poly) ---------- */
function finish(t,cx,cy,cz){const n=new Array(t.length);
 for(let i=0;i<t.length;i+=9){const ax=t[i],ay=t[i+1],az=t[i+2],bx=t[i+3]-ax,by=t[i+4]-ay,bz=t[i+5]-az,qx=t[i+6]-ax,qy=t[i+7]-ay,qz=t[i+8]-az;
  let nx=by*qz-bz*qy,ny=bz*qx-bx*qz,nz=bx*qy-by*qx;const l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;
  const mx=(t[i]+t[i+3]+t[i+6])/3-cx,my=(t[i+1]+t[i+4]+t[i+7])/3-cy,mz=(t[i+2]+t[i+5]+t[i+8])/3-cz;
  if(nx*mx+ny*my+nz*mz<0){nx=-nx;ny=-ny;nz=-nz}
  for(let k=0;k<3;k++){n[i+k*3]=nx;n[i+k*3+1]=ny;n[i+k*3+2]=nz}}
 const o=new Array(t.length),C=[cx,cy,cz];for(let i=0;i<t.length;i++){const v=Math.round((t[i]-C[i%3])*1e4);o[i]=v>0?1:v<0?-1:0}
 return{p:t,n,o,count:t.length/3}}
function qp(t,a,b,c,d){t.push(...a,...b,...c,...a,...c,...d)}
const GC={};
function memo(k,f){return GC[k]||(GC[k]=f())}
function gBox(w,h,d,ox=0,oy=0,oz=0){return memo(`b${w},${h},${d},${ox},${oy},${oz}`,()=>{const x=w/2,y=h/2,z=d/2,t=[];const v=(i,j,k)=>[ox+i*x,oy+j*y,oz+k*z];
 qp(t,v(-1,-1,1),v(1,-1,1),v(1,1,1),v(-1,1,1));qp(t,v(1,-1,-1),v(-1,-1,-1),v(-1,1,-1),v(1,1,-1));
 qp(t,v(-1,1,1),v(1,1,1),v(1,1,-1),v(-1,1,-1));qp(t,v(-1,-1,-1),v(1,-1,-1),v(1,-1,1),v(-1,-1,1));
 qp(t,v(1,-1,1),v(1,-1,-1),v(1,1,-1),v(1,1,1));qp(t,v(-1,-1,-1),v(-1,-1,1),v(-1,1,1),v(-1,1,-1));return finish(t,ox,oy,oz)})}
function gCyl(rt,rb,h,seg=8,oy=0,ox=0,oz=0){return memo(`c${rt},${rb},${h},${seg},${oy},${ox},${oz}`,()=>{const t=[];
 for(let i=0;i<seg;i++){const a0=i/seg*TAU,a1=(i+1)/seg*TAU,c0=Math.cos(a0),s0=Math.sin(a0),c1=Math.cos(a1),s1=Math.sin(a1);
  const b0=[ox+c0*rb,oy,oz+s0*rb],b1=[ox+c1*rb,oy,oz+s1*rb],t0=[ox+c0*rt,oy+h,oz+s0*rt],t1=[ox+c1*rt,oy+h,oz+s1*rt];
  if(rt>0&&rb>0)qp(t,b0,b1,t1,t0);else if(rt<=0)t.push(...b0,...b1,...t0);else t.push(...b0,...t1,...t0);
  if(rt>0)t.push(ox,oy+h,oz,...t0,...t1);if(rb>0)t.push(ox,oy,oz,...b1,...b0)}
 return finish(t,ox,oy+h/2,oz)})}
function gSph(r,ws=8,hs=6,oy=0,ox=0,oz=0){return memo(`s${r},${ws},${hs},${oy},${ox},${oz}`,()=>{const t=[];
 const P=(i,j)=>{const th=j/hs*Math.PI,ph=i/ws*TAU;return[ox+r*Math.sin(th)*Math.cos(ph),oy+r*Math.cos(th),oz+r*Math.sin(th)*Math.sin(ph)]};
 for(let j=0;j<hs;j++)for(let i=0;i<ws;i++){const a=P(i,j),b=P(i+1,j),c=P(i+1,j+1),d=P(i,j+1);if(j>0)t.push(...a,...b,...c);if(j<hs-1)t.push(...a,...c,...d)}
 return finish(t,ox,oy,oz)})}
/* なめらかな丸い部品（キャラ用）：法線をなめらかにして、フチの向きも法線と同じにする */
function finS(t,n){return{p:t,n,o:n.slice(),count:t.length/3}}
function gSS(r=1,ws=16,hs=12,t1=Math.PI){return memo(`ss${r},${ws},${hs},${t1}`,()=>{const t=[],n=[];const V=(i,j)=>{const th=j/hs*t1,ph=i/ws*TAU;return[Math.sin(th)*Math.cos(ph),Math.cos(th),Math.sin(th)*Math.sin(ph)]};
 for(let j=0;j<hs;j++)for(let i=0;i<ws;i++){const a=V(i,j),b=V(i+1,j),c=V(i+1,j+1),d=V(i,j+1);for(const q of[a,b,c,a,c,d]){t.push(q[0]*r,q[1]*r,q[2]*r);n.push(q[0],q[1],q[2])}}return finS(t,n)})}
function gCapD(r,len,ws=12,k=4){return memo(`cap${r},${len},${ws},${k}`,()=>{const R_=[];for(let j=0;j<=k;j++)R_.push([j/k*Math.PI/2,0]);for(let j=0;j<=k;j++)R_.push([Math.PI/2+j/k*Math.PI/2,-len]);
 const t=[],n=[];const V=(i,q)=>{const[th,oy]=q,ph=i/ws*TAU,x=Math.sin(th)*Math.cos(ph),y=Math.cos(th),z=Math.sin(th)*Math.sin(ph);return[[x*r,y*r+oy,z*r],[x,y,z]]};
 for(let j=0;j<R_.length-1;j++)for(let i=0;i<ws;i++){const a=V(i,R_[j]),b=V(i+1,R_[j]),c=V(i+1,R_[j+1]),d=V(i,R_[j+1]);for(const q of[a,b,c,a,c,d]){t.push(...q[0]);n.push(...q[1])}}return finS(t,n)})}
function gRing(r,h,ws=22){return memo(`ring${r},${h},${ws}`,()=>{const t=[],n=[];for(let i=0;i<ws;i++){const a0=i/ws*TAU,a1=(i+1)/ws*TAU,c0=Math.cos(a0),s0=Math.sin(a0),c1=Math.cos(a1),s1=Math.sin(a1);
 const q=[[c0*r,0,s0*r,c0,0,s0],[c1*r,0,s1*r,c1,0,s1],[c1*r,h,s1*r,c1,0,s1],[c0*r,h,s0*r,c0,0,s0]];for(const k of[0,1,2,0,2,3]){t.push(q[k][0],q[k][1],q[k][2]);n.push(q[k][3],q[k][4],q[k][5])}}return finS(t,n)})}
/* 法線用の行列（拡大・縮小しても陰影がくずれないように） */
function nm3(m){const c0=[m[0],m[1],m[2]],c1=[m[4],m[5],m[6]],c2=[m[8],m[9],m[10]],X=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];return new Float32Array([...X(c1,c2),...X(c2,c0),...X(c0,c1)])}
const NM_I=new Float32Array([1,0,0,0,1,0,0,0,1]);
/* やねブロック：うしろ(-z)が高い三角の柱 */
function gWedge(){return memo('wedge',()=>{const t=[],a=[-.5,0,.5],b=[.5,0,.5],c=[.5,1,-.5],d=[-.5,1,-.5],e=[-.5,0,-.5],f=[.5,0,-.5];
 qp(t,a,b,c,d);qp(t,e,f,c,d);qp(t,a,b,f,e);t.push(...a,...e,...d,...b,...f,...c);return finish(t,0,.33,-.17)})}

/* ---------- WebGL ---------- */
const cv=$('#gl');
let gl=null;
try{gl=cv.getContext('webgl',{antialias:true,alpha:false,powerPreference:'high-performance'})||cv.getContext('experimental-webgl')}catch(e){}
const HP_='#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';
/* 本体：半球ライト＋太陽＋かげ＋ブロックのポッチ＋プラスチックのつや */
const VS=`attribute vec3 aP;attribute vec3 aN;attribute vec4 aC;attribute vec3 aO;uniform mat4 uVP;uniform mat4 uM;uniform mat4 uLVP;uniform float uOut;uniform float uPush;uniform float uAsp;uniform vec3 uCam;uniform float uTv;uniform mat3 uNM;
varying vec3 vN;varying vec4 vC;varying vec3 vW;varying vec4 vL;
void main(){vec4 w=uM*vec4(aP,1.0);if(aC.a<-0.5){float h=max(w.y-0.15,0.0);float s=sin(uTv*1.7+w.x*0.37+w.z*0.29);w.x+=s*(0.05*h+0.03)*step(0.01,h);w.z+=cos(uTv*1.3+w.x*0.21)*(0.03*h)*step(0.01,h);}w.xyz+=normalize(w.xyz-uCam)*uPush*distance(w.xyz,uCam);gl_Position=uVP*w;if(uOut>0.0){vec2 nn=(uVP*(uM*vec4(aO,0.0))).xy;float l=length(nn);if(l>1e-5){float fc=abs(dot(normalize(uNM*aN),normalize(uCam-w.xyz)));gl_Position.xy+=nn/l*vec2(1.0/uAsp,1.0)*uOut*gl_Position.w*(1.0-smoothstep(0.5,0.92,fc));}}
 vN=uNM*aN;vC=aC;vW=w.xyz;vL=uLVP*(w+vec4(normalize(vN)*0.07,0.0));}`;
const FS=HP_+`varying vec3 vN;varying vec4 vC;varying vec3 vW;varying vec4 vL;
uniform vec3 uLD;uniform vec3 uFogC;uniform vec3 uCam;uniform vec2 uFog;uniform sampler2D uSh;uniform float uShOn;uniform float uShT;uniform float uStud;uniform float uA;uniform float uT;uniform float uInk;uniform float uSnap;
float unp(vec4 c){return dot(c,vec4(1.0,1.0/255.0,1.0/65025.0,1.0/16581375.0));}
float shd(){if(uShOn<0.5)return 1.0;vec3 p=vL.xyz/vL.w*0.5+0.5;if(p.x<=0.0||p.x>=1.0||p.y<=0.0||p.y>=1.0||p.z>=1.0)return 1.0;float s=0.0;
 for(int i=0;i<4;i++){vec2 o=vec2(mod(float(i),2.0)-0.5,floor(float(i)/2.0)-0.5)*uShT*1.7;s+=step(p.z-0.0016,unp(texture2D(uSh,p.xy+o)));}
 float e=max(abs(p.x-0.5),abs(p.y-0.5));return mix(s*0.25,1.0,smoothstep(0.43,0.5,e));}
void main(){vec3 N=normalize(vN);float dist=distance(vW,uCam);float vF=clamp((dist-uFog.x)/(uFog.y-uFog.x),0.0,1.0);
 if(uInk>0.5){gl_FragColor=vec4(mix(vec3(0.05,0.05,0.16),uFogC,vF),uSnap);return;}
 vec3 base=vC.rgb;float em=max(vC.a,0.0);float ga=vC.a>1.5?0.5:smoothstep(0.28,0.95,em);
 if(em>1.5){base=0.55+0.45*cos(6.2832*((vW.x+vW.y+vW.z)*0.11+uT*0.25+vec3(0.0,0.33,0.67)));em=0.35;}
 if(uStud>0.5&&N.y>0.9){vec2 f=fract(vW.xz)-0.5;float r=length(f);float k=(1.0-smoothstep(26.0,58.0,dist))*(1.0-clamp(em*1.5,0.0,1.0));
  float inS=1.0-smoothstep(0.27,0.30,r);float ring=smoothstep(0.29,0.32,r)*(1.0-smoothstep(0.32,0.40,r));
  float dir=dot(f/max(r,0.001),normalize(uLD.xz));base*=1.0+k*(inS*0.06+inS*smoothstep(0.17,0.29,r)*dir*0.16-ring*(0.11-dir*0.09));}
 float d=dot(N,uLD);float sh=shd();float lit=smoothstep(0.0,0.09,d)*sh;
 vec3 amb=mix(vec3(0.48,0.50,0.82),vec3(0.84,0.90,1.0),N.y*0.5+0.5);
 vec3 shL=amb*vec3(0.80,0.80,1.06)*0.80;vec3 liL=amb*0.66+vec3(1.0,0.92,0.76)*0.56;
 vec3 L=mix(shL,liL,lit)+vec3(1.0,0.95,0.85)*smoothstep(0.62,0.70,d)*sh*0.07;
 vec3 V=normalize(uCam-vW);vec3 H=normalize(V+uLD);
 float sp=smoothstep(0.955,0.965,dot(N,H))*0.20*lit*(1.0-em);float rim=smoothstep(0.66,0.72,1.0-max(dot(N,V),0.0))*0.16*(N.y*0.5+0.5);
 vec3 c=base*mix(L,vec3(1.0),em)+sp+rim*amb;float lu=dot(c,vec3(0.299,0.587,0.114));c=mix(vec3(lu),c,1.12);
 gl_FragColor=vec4(mix(c,uFogC,vF),uSnap>0.5?uA:(uA<0.999?uA:ga*(1.0-vF)));}`;
/* かげ用：太陽から見た深さをRGBAにつめる */
const VD=`attribute vec3 aP;uniform mat4 uVP;uniform mat4 uM;void main(){gl_Position=uVP*uM*vec4(aP,1.0);}`;
const FD=HP_+`void main(){vec4 e=fract(gl_FragCoord.z*vec4(1.0,255.0,65025.0,16581375.0));e-=e.yzww*vec4(1.0/255.0,1.0/255.0,1.0/255.0,0.0);gl_FragColor=e;}`;
/* 空 */
const VK=`attribute vec3 aP;varying vec2 vP;void main(){vP=aP.xy*2.0;gl_Position=vec4(aP.xy*2.0,0.999,1.0);}`;
const FK=HP_+`varying vec2 vP;uniform vec3 uR;uniform vec3 uU;uniform vec3 uF;uniform vec3 uLD;uniform vec2 uTan;uniform float uShow;uniform float uT;uniform vec2 uC;
void main(){if(uShow>0.5){vec2 q=vec2((vP.x-uC.x)*uTan.x/uTan.y,vP.y-uC.y);float a=atan(q.y,q.x);float r=step(0.5,fract(a*14.0/6.2832+uT*0.05));
 vec3 c=mix(vec3(0.13,0.27,0.80),vec3(0.20,0.40,0.98),r);c*=1.15-0.45*length(q);c+=vec3(0.35,0.45,0.9)*smoothstep(0.9,0.0,length(q))*0.35;gl_FragColor=vec4(c,0.0);return;}
 vec3 d=normalize(uF+uR*vP.x*uTan.x+uU*vP.y*uTan.y);float h=d.y;
 vec3 c=mix(vec3(0.86,0.95,1.0),vec3(0.50,0.79,1.0),smoothstep(0.0,0.22,h));c=mix(c,vec3(0.17,0.48,0.96),smoothstep(0.18,0.9,h));
 float s=max(dot(d,uLD),0.0);float sun=pow(s,420.0);c+=vec3(1.0,0.92,0.65)*(sun*1.3+pow(s,14.0)*0.16);gl_FragColor=vec4(c,sun*0.9);}`;
/* 海 */
const VW=`attribute vec3 aP;uniform mat4 uVP;uniform vec3 uCam;varying vec3 vW;void main(){vec3 w=vec3(aP.x*900.0+uCam.x,-0.42,aP.y*900.0+uCam.z);vW=w;gl_Position=uVP*vec4(w,1.0);}`;
const FW=HP_+`varying vec3 vW;uniform vec3 uCam;uniform vec3 uFogC;uniform vec2 uFog;uniform float uT;
void main(){vec2 p=vW.xz;float w=sin(p.x*0.35+uT*1.2)*0.5+sin(p.y*0.42-uT*0.9)*0.5+sin((p.x+p.y)*0.18+uT*0.6);
 vec3 c=mix(vec3(0.09,0.40,0.86),vec3(0.24,0.66,0.98),w*0.2+0.5);
 vec2 q=floor(p/1.5);float hs=fract(sin(dot(q,vec2(12.9898,78.233)))*43758.5453);float spk=step(0.975,fract(hs+uT*0.12));c+=spk*0.3;
 float e=max(abs(p.x),abs(p.y))-62.0;c=mix(c,vec3(0.36,0.86,0.93),smoothstep(11.0,0.0,e)*0.6);
 float foam=smoothstep(3.2,0.0,e)*(0.55+0.45*sin(e*2.6-uT*2.2));c=mix(c,vec3(1.0),clamp(foam,0.0,1.0)*0.6);
 float vF=clamp((distance(vW,uCam)-uFog.x)/(uFog.y-uFog.x),0.0,1.0);gl_FragColor=vec4(mix(c,uFogC,vF),spk*0.7*(1.0-vF));}`;
/* 文字やマークの板・パーティクル */
const VT=`attribute vec3 aP;attribute vec2 aU;uniform mat4 uVP;uniform mat4 uM;uniform vec3 uCam;uniform vec2 uFog;varying vec2 vU;varying float vF;
void main(){vec4 w=uM*vec4(aP,1.0);gl_Position=uVP*w;vU=aU;float d=distance(w.xyz,uCam);vF=clamp((d-uFog.x)/(uFog.y-uFog.x),0.0,1.0);}`;
const FT=`precision mediump float;varying vec2 vU;varying float vF;uniform sampler2D uT;uniform vec3 uFogC;uniform vec4 uCol;
void main(){vec4 t=texture2D(uT,vU)*uCol;if(t.a<0.03)discard;gl_FragColor=vec4(mix(t.rgb,uFogC,vF),t.a);}`;
function mkProg(vs,fs,attrs){const p=gl.createProgram();
 for(const[s,ty]of[[vs,gl.VERTEX_SHADER],[fs,gl.FRAGMENT_SHADER]]){const sh=gl.createShader(ty);gl.shaderSource(sh,s);gl.compileShader(sh);
  if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));gl.attachShader(p,sh)}
 attrs.forEach((a,i)=>gl.bindAttribLocation(p,i,a));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));
 const u={};const n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);for(let i=0;i<n;i++){const inf=gl.getActiveUniform(p,i);u[inf.name]=gl.getUniformLocation(p,inf.name)}return{p,u}}
let PC,PT,PD,PK,PW,PQB,PQL,PQC;
const VQ=`attribute vec3 aP;varying vec2 vU;void main(){vU=aP.xy+0.5;gl_Position=vec4(aP.xy*2.0,0.0,1.0);}`;
const FQB=HP_+`varying vec2 vU;uniform sampler2D uS;uniform vec2 uPx;void main(){vec4 a=texture2D(uS,vU+uPx*vec2(-1.0,-1.0)),b=texture2D(uS,vU+uPx*vec2(1.0,-1.0)),c=texture2D(uS,vU+uPx*vec2(-1.0,1.0)),d=texture2D(uS,vU+uPx*vec2(1.0,1.0));
 gl_FragColor=vec4((a.rgb*a.a+b.rgb*b.a+c.rgb*c.a+d.rgb*d.a)*0.25,1.0);}`;
const FQL=HP_+`varying vec2 vU;uniform sampler2D uS;uniform vec2 uD;void main(){vec3 c=texture2D(uS,vU).rgb*0.227;c+=(texture2D(uS,vU+uD*1.385).rgb+texture2D(uS,vU-uD*1.385).rgb)*0.316;c+=(texture2D(uS,vU+uD*3.23).rgb+texture2D(uS,vU-uD*3.23).rgb)*0.07;gl_FragColor=vec4(c,1.0);}`;
const FQC=HP_+`varying vec2 vU;uniform sampler2D uS;uniform sampler2D uB;uniform vec2 uPx;uniform float uBl;
float lu(vec3 c){return dot(c,vec3(0.299,0.587,0.114));}
vec3 tx(vec2 o){return texture2D(uS,vU+o).rgb;}
void main(){vec3 nw=tx(-uPx),ne=tx(vec2(uPx.x,-uPx.y)),sw=tx(vec2(-uPx.x,uPx.y)),se=tx(uPx),m=tx(vec2(0.0));
 float lNW=lu(nw),lNE=lu(ne),lSW=lu(sw),lSE=lu(se),lM=lu(m),lMin=min(lM,min(min(lNW,lNE),min(lSW,lSE))),lMax=max(lM,max(max(lNW,lNE),max(lSW,lSE)));
 vec2 dir=vec2(-((lNW+lNE)-(lSW+lSE)),((lNW+lSW)-(lNE+lSE)));float rd=max((lNW+lNE+lSW+lSE)*0.03125,0.0078125);float rc=1.0/(min(abs(dir.x),abs(dir.y))+rd);dir=clamp(dir*rc,-8.0,8.0)*uPx;
 vec3 a=0.5*(tx(dir*(-0.1667))+tx(dir*0.1667));vec3 b=a*0.5+0.25*(tx(dir*-0.5)+tx(dir*0.5));float lb=lu(b);vec3 c=(lb<lMin||lb>lMax)?a:b;
 c+=texture2D(uB,vU).rgb*uBl;vec2 q=vU-0.5;c*=1.0-dot(q,q)*0.6;float l=lu(c);c=mix(vec3(l),c,1.06);c=c*vec3(1.01,1.0,0.985);gl_FragColor=vec4(c,1.0);}`;
function buf(arr){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,arr instanceof Float32Array?arr:new Float32Array(arr),gl.STATIC_DRAW);return b}
const GPU=new Map();
function gpu(g){let o=GPU.get(g);if(!o){o={pb:buf(g.p),nb:buf(g.n),ob:buf(g.o),count:g.count};GPU.set(g,o)}return o}
let QP,QU;
const SHM={ok:false,size:1024,fb:null,tex:null};
function initGL(){PC=mkProg(VS,FS,['aP','aN','aC','aO']);try{PQB=mkProg(VQ,FQB,['aP']);PQL=mkProg(VQ,FQL,['aP']);PQC=mkProg(VQ,FQC,['aP'])}catch(e){PQB=null}PT=mkProg(VT,FT,['aP','aU']);PD=mkProg(VD,FD,['aP']);PK=mkProg(VK,FK,['aP']);PW=mkProg(VW,FW,['aP']);
 QP=buf([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,-.5,0,.5,.5,0,-.5,.5,0]);QU=buf([0,1,1,1,1,0,0,1,1,0,0,0]);
 try{const S=SHM.size=isTouch?1024:2048;const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,S,S,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const rb=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,rb);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16,S,S);
  const fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,rb);
  SHM.ok=gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;SHM.fb=fb;SHM.tex=t;gl.bindFramebuffer(gl.FRAMEBUFFER,null)}catch(e){SHM.ok=false}}

/* ---------- メッシュをまとめる（島ぜんたい／家） ---------- */
const ST={p:[],n:[],c:[],o:[]};let STG=null,OUTL=true;
function emit(T,g,m,col,em=0,jit=0.07){const c=typeof col==='string'?hex(col):col;const P=T.p,N=T.n,C=T.c,O=T.o,ol=OUTL,q=nm3(m);
 for(let i=0;i<g.p.length;i+=9){const f=1+(R()-.5)*jit;const cr=c[0]*f,cg=c[1]*f,cb=c[2]*f;
  for(let k=0;k<3;k++){const o=i+k*3,x=g.p[o],y=g.p[o+1],z=g.p[o+2],nx=g.n[o],ny=g.n[o+1],nz=g.n[o+2];
   P.push(m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14]);
   {const a=q[0]*nx+q[3]*ny+q[6]*nz,b=q[1]*nx+q[4]*ny+q[7]*nz,d=q[2]*nx+q[5]*ny+q[8]*nz,l=Math.hypot(a,b,d)||1;N.push(a/l,b/l,d/l)}C.push(cr,cg,cb,em);
   if(ol){const ox=g.o[o],oy=g.o[o+1],oz=g.o[o+2];O.push(m[0]*ox+m[4]*oy+m[8]*oz,m[1]*ox+m[5]*oy+m[9]*oz,m[2]*ox+m[6]*oy+m[10]*oz)}else O.push(0,0,0)}}}
const addS=(g,m,col,em,jit)=>emit(ST,g,m,col,em,jit);
function mkMesh(T){return{pb:buf(T.p),nb:buf(T.n),cb:buf(T.c),ob:buf(T.o),count:T.p.length/3}}
function freeMesh(m){if(m){gl.deleteBuffer(m.pb);gl.deleteBuffer(m.nb);gl.deleteBuffer(m.cb);gl.deleteBuffer(m.ob)}}
function uploadStatic(){STG=mkMesh(ST);ST.p=ST.n=ST.c=ST.o=null}

/* ---------- あたり判定 ---------- */
const BOXES=[],CIRS=[];const PR=.42,STEP=.42,TALL=1.9;
function addBox(cx,cz,w,d,top,bot=-99){BOXES.push({x0:cx-w/2,x1:cx+w/2,z0:cz-d/2,z1:cz+d/2,top,bot})}
function addCircle(x,z,r,top){CIRS.push({x,z,r,top})}
function hitBox(b,x,z){const cx=x<b.x0?b.x0:x>b.x1?b.x1:x,cz=z<b.z0?b.z0:z>b.z1?b.z1:z;const dx=x-cx,dz=z-cz;return dx*dx+dz*dz<PR*PR}
function hitCir(c,x,z){const dx=x-c.x,dz=z-c.z,r=c.r+PR;return dx*dx+dz*dz<r*r}
let extraBlock=null,voxEach=null;
function groundAt(x,z,y){let h=0;for(const b of BOXES)if(b.top>h&&b.top<=y+STEP&&hitBox(b,x,z))h=b.top;for(const c of CIRS)if(c.top>h&&c.top<=y+STEP&&hitCir(c,x,z))h=c.top;
 if(voxEach)voxEach(x,z,(b,t)=>{if(t>h&&t<=y+STEP)h=t});return h}
function blocked(x,z,y){if(extraBlock&&extraBlock(x,z))return true;
 for(const b of BOXES)if(b.top>y+STEP&&b.bot<y+TALL&&hitBox(b,x,z))return true;for(const c of CIRS)if(c.top>y+STEP&&hitCir(c,x,z))return true;
 let hit=false;if(voxEach)voxEach(x,z,(b,t)=>{if(t>y+STEP&&b<y+TALL)hit=true});return hit}
function ceilAt(x,z,y){let c=1e9;for(const b of BOXES)if(b.bot>y+.9&&b.bot<c&&hitBox(b,x,z))c=b.bot;if(voxEach)voxEach(x,z,(b)=>{if(b>y+.9&&b<c)c=b});return c}

/* ---------- 島をつくる道具 ---------- */
function box(x,y0,z,w,h,d,col,o={}){const m=o.rot?M4.mul(M4.T(x,y0,z),M4.RY(o.rot)):M4.T(x,y0,z);if(o.ol===false)OUTL=false;addS(gBox(w,h,d,0,h/2,0),m,col,o.em||0,o.jit??.07);OUTL=true;
 if(o.col)addBox(x,z,w,d,o.top??y0+h,o.bot)}
function cyl(x,y0,z,rt,rb,h,col,seg=8,o={}){addS(gCyl(rt,rb,h,seg),M4.T(x,y0,z),col,o.em||0,o.jit??.07);if(o.col)addCircle(x,z,o.cr??Math.max(rt,rb),o.top??y0+h)}
function sph(x,y,z,r,col,o={}){addS(gSph(r,o.ws||8,o.hs||6),o.m||M4.T(x,y,z),col,o.em||0,o.jit??.07)}
/* むきのあるグループ（たてもの用）：手前(+z)が広場のほうを向く */
function grp(x,z,rot){const base=M4.mul(M4.T(x,0,z),M4.RY(rot)),s=Math.sin(rot),c=Math.cos(rot);const G={
 w:(lx,lz)=>[x+lx*c+lz*s,z-lx*s+lz*c],
 b(lx,ly,lz,w,h,d,col,em=0,jit=.05){addS(gBox(w,h,d,0,h/2,0),M4.mul(base,M4.T(lx,ly,lz)),col,em,jit)},
 c(lx,ly,lz,rt,rb,h,col,seg=8,em=0){addS(gCyl(rt,rb,h,seg),M4.mul(base,M4.T(lx,ly,lz)),col,em)},
 s(lx,ly,lz,r,col,em=0){addS(gSph(r,8,6),M4.mul(base,M4.T(lx,ly,lz)),col,em)},
 m:(m,g,col,em=0)=>addS(g,M4.mul(base,m),col,em),
 q(tex,lx,ly,lz,w,h,ro=0){const p=G.w(lx,lz);quad(tex,p[0],ly,p[1],w,h,rot+ro)},
 col(lx,lz,r,top=99){const p=G.w(lx,lz);addCircle(p[0],p[1],r,top)}};return G}

/* ---------- 絵をかいてテクスチャにする ---------- */
const FJP='"M PLUS Rounded 1c","Hiragino Maru Gothic ProN","Hiragino Sans","Yu Gothic",sans-serif';
function glTex(c){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t}
function ctex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);return{t:glTex(c),w,h,aspect:w/h}}
function rrect(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
const _mc=document.createElement('canvas').getContext('2d');
function labelTex(text,style='player'){const fs=40;_mc.font=`900 ${fs}px ${FJP}`;const tw=Math.ceil(_mc.measureText(text).width);const w=tw+48,h=66;
 return ctex(w,h,(g)=>{const S={player:['#3ee07a','#0a1240','#0a1240'],npc:['#ffd21f','#ffffff','#0a1240'],bot:['rgba(10,18,64,.55)','#ffffff','rgba(10,18,64,.0)'],home:['#ff7a1a','#ffffff','#ffffff']}[style];
  rrect(g,3,3,w-6,h-6,30);g.fillStyle=S[0];g.fill();g.lineWidth=5;g.strokeStyle=S[2];g.stroke();g.font=`900 ${fs}px ${FJP}`;g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.lineWidth=9;g.strokeStyle='#0a1240';if(style!=='player')g.strokeText(text,w/2,h/2+2);g.fillStyle=S[1];g.fillText(text,w/2,h/2+2)})}
function signTex(main,sub,o={}){const w=o.w||1024,h=o.h||220;return ctex(w,h,(g)=>{
 rrect(g,6,6,w-12,h-12,38);g.fillStyle=o.bg||'#16204a';g.fill();
 g.save();g.clip();g.globalAlpha=.13;g.fillStyle='#fff';for(let y=22,r=0;y<h+30;y+=60,r++)for(let x=20;x<w+40;x+=60){g.beginPath();g.arc(x+(r%2)*30,y,13,0,TAU);g.fill()}g.restore();
 g.lineWidth=12;g.strokeStyle='#0a1240';rrect(g,6,6,w-12,h-12,38);g.stroke();g.lineWidth=5;g.strokeStyle='rgba(255,255,255,.55)';rrect(g,16,16,w-32,h-32,28);g.stroke();
 g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
 let fs=sub?h*.44:h*.54;g.font=`900 ${fs}px ${FJP}`;const mw=g.measureText(main).width;if(mw>w*.84){fs*=w*.84/mw;g.font=`900 ${fs}px ${FJP}`}
 const y=sub?h*.4:h*.53;g.lineWidth=fs*.26;g.strokeStyle='#0a1240';g.fillStyle='#0a1240';g.strokeText(main,w/2,y+fs*.09);g.fillText(main,w/2,y+fs*.09);g.strokeText(main,w/2,y);g.fillStyle=o.fg||'#fff';g.fillText(main,w/2,y);
 if(sub){let ss=h*.17;g.font=`800 ${ss}px ${FJP}`;const sw=g.measureText(sub).width;if(sw>w*.84){ss*=w*.84/sw;g.font=`800 ${ss}px ${FJP}`}g.fillStyle='#fff3c4';g.fillText(sub,w/2,h*.78)}})}
function letterTex(L,bg){return ctex(128,128,(g)=>{g.fillStyle=bg;g.fillRect(0,0,128,128);g.lineWidth=10;g.strokeStyle='#fff';g.strokeRect(5,5,118,118);
 g.fillStyle='#fff';g.font=`900 84px ${FJP}`;g.textAlign='center';g.textBaseline='middle';g.fillText(L,64,70)})}
function bubbleTex(s){const big=[...s].length<=2;_mc.font=`900 40px ${FJP}`;const w=big?140:Math.ceil(_mc.measureText(s).width)+56,h=big?140:84;
 return ctex(w,h,(g)=>{rrect(g,4,4,w-8,h-8,34);g.fillStyle='#fff';g.fill();g.lineWidth=6;g.strokeStyle='#16204a';g.stroke();
 g.textAlign='center';g.textBaseline='middle';g.fillStyle='#16204a';g.font=big?`80px ${FJP}`:`900 40px ${FJP}`;g.fillText(s,w/2,h/2+4)})}
function glyphTex(s,col){return ctex(64,64,g=>{g.font=`900 50px ${FJP}`;g.textAlign='center';g.textBaseline='middle';g.fillStyle=col;g.fillText(s,32,36)})}
let SHADOW,DOT,SQR,HEART,STAR;
function initTex(){
 SHADOW=ctex(64,64,g=>{const gr=g.createRadialGradient(32,32,2,32,32,31);gr.addColorStop(0,'rgba(0,0,0,.4)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,64,64)});
 DOT=ctex(64,64,g=>{const gr=g.createRadialGradient(32,32,1,32,32,31);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.5,'rgba(255,255,255,.75)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64)});
 SQR=ctex(8,8,g=>{g.fillStyle='#fff';g.fillRect(0,0,8,8)});HEART=glyphTex('♥','#fff');STAR=glyphTex('★','#fff')}

/* ---------- パーティクル ---------- */
const PARTS=[];
function part(o){if(PARTS.length>220)PARTS.shift();PARTS.push(Object.assign({vx:0,vy:0,vz:0,g:0,life:.8,age:0,s:.25,c:[1,1,1],tex:DOT,grow:0},o))}
function burst(x,y,z,n,cols,o={}){for(let i=0;i<n;i++){const a=R2()*TAU,sp=(o.sp||3)*(.4+R2()*.8);
 part({x,y,z,vx:Math.cos(a)*sp,vy:(o.up??3)*(.5+R2()),vz:Math.sin(a)*sp,g:o.g??9,life:(o.life||.8)*(.6+R2()*.6),s:(o.s||.22)*(.7+R2()*.6),c:cols[i%cols.length],tex:o.tex||DOT,grow:o.grow||0})}}
const R2=Math.random;
function stepParts(dt){for(let i=PARTS.length-1;i>=0;i--){const p=PARTS[i];p.age+=dt;if(p.age>=p.life){PARTS.splice(i,1);continue}p.vy-=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.s+=p.grow*dt}}
const CONF=[[1,.35,.4],[1,.75,.2],[.25,.8,.5],[.25,.55,1],[.8,.4,1],[1,1,1]];

/* ---------- 効果音（音ありのときだけ） ---------- */
let AC=null;
function sfx(k){if(!D.settings.sound)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();const t=AC.currentTime;
 const N=(f,d,ty='sine',v=.1,at=0,f2=0)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.setValueAtTime(f,t+at);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+at+d);
  g.gain.setValueAtTime(v,t+at);g.gain.exponentialRampToValueAtTime(.001,t+at+d);o.connect(g);g.connect(AC.destination);o.start(t+at);o.stop(t+at+d+.03)};
 const S={jump:()=>N(300,.16,'sine',.09,0,640),jet:()=>N(160,.3,'sawtooth',.05,0,520),land:()=>N(120,.07,'sine',.07,0,70),
  coin:()=>{N(988,.08,'square',.05);N(1319,.26,'square',.05,.08)},buy:()=>[523,659,784,1047].forEach((f,i)=>N(f,.18,'triangle',.1,i*.08)),
  place:()=>N(240,.07,'square',.06,0,150),erase:()=>N(190,.1,'sawtooth',.045,0,90),boing:()=>N(170,.32,'sine',.13,0,760),no:()=>N(150,.14,'square',.04,0,110),tap:()=>N(700,.05,'triangle',.06)};
 S[k]&&S[k]()}catch(e){}}
