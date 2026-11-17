
/* ---------- 数学（単元ごとに問題を自動でつくる） ---------- */
const lin=(a,v='x')=>a===1?v:a===-1?M+v:sn(a)+v;
function poly(terms){let s='';for(const[c,v]of terms){if(!c)continue;const ab=Math.abs(c),body=(ab===1&&v?'':ab)+v;s+=s?(c<0?' '+M+' ':' ＋ ')+body:(c<0?M:'')+body}return s||'0'}
const piS=(n,d=1)=>{const f=fr(n,d);return f==='1'?'π':f==='0'?'0':f.includes('/')?`${f}π`:`${f}π`};
function rpick(a){return a[ri(0,a.length-1)]}
function three(ans,cands,mk){const out=uniq(ans,cands);let t=0;while(out.length<3&&t++<50){const v=mk();if(v!==ans&&!out.includes(v))out.push(v)}return out.slice(0,3)}
function simp(n){let k=1,m=n;for(let i=2;i*i<=m;i++)while(m%(i*i)===0){m/=i*i;k*=i}return[k,m]}
const rt=(k,m)=>m===1?String(k):(k===1?'':k)+'√'+m;
UG('ma','m1','中1','正負の数（たし算・ひき算）',[
 ()=>{const a=ri(-9,9)||-4,b=ri(-9,9)||6,op=ri(0,1),r=op?a-b:a+b,o=op?M:'＋';return[`${sn(a)} ${o} ${pn(b)} ＝ ？`,sn(r),three(sn(r),[sn(-r),sn(op?a+b:a-b),sn(r+1),sn(r-1)],()=>sn(r+ri(-6,6))),`${sn(a)}${o}${pn(b)}＝${sn(r)}`]},
 ()=>{const a=ri(-9,9)||3,b=ri(-9,9)||-5,c=ri(1,9),r=a+b-c;return[`${sn(a)} ＋ ${pn(b)} ${M} ${c} ＝ ？`,sn(r),three(sn(r),[sn(a+b+c),sn(-r),sn(r+2),sn(r-2)],()=>sn(r+ri(-6,6))),`左から順に計算：${sn(a+b)}${M}${c}＝${sn(r)}`]}]);
UG('ma','m2','中1','正負の数（かけ算・わり算・累乗）',[
 ()=>{const a=ri(-9,9)||-3,b=ri(-9,9)||4,r=a*b;return[`${pn(a)} × ${pn(b)} ＝ ？`,sn(r),three(sn(r),[sn(-r),sn(a+b),sn(r+a)],()=>sn(r+ri(-9,9))),`符号：同じなら＋、ちがえば${M}。${sn(r)}`]},
 ()=>{const b=ri(2,9)*(ri(0,1)?1:-1),q=ri(2,9)*(ri(0,1)?1:-1),a=b*q;return[`${pn(a)} ÷ ${pn(b)} ＝ ？`,sn(q),three(sn(q),[sn(-q),sn(q+1),sn(q-1)],()=>sn(q+ri(-5,5))),`${pn(a)}÷${pn(b)}＝${sn(q)}`]},
 ()=>{const k=ri(2,7),t=ri(0,1);const q=t?`(${M}${k})² ＝ ？`:`${M}${k}² ＝ ？`,r=t?k*k:-k*k;return[q,sn(r),three(sn(r),[sn(-r),sn(t?-2*k:2*k),sn(2*k)],()=>sn(r+ri(-5,5))),t?`(${M}${k})×(${M}${k})＝${k*k}`:`${M}(${k}×${k})＝${M}${k*k}。${M}は2乗されない`]}]);
UG('ma','m3','中1','文字と式',[
 ()=>{const k=ri(2,5),p=ri(1,4),q0=ri(-6,6)||3,m=ri(1,5)*(ri(0,1)?1:-1),A=k*p+m,B=k*q0;const qs=`${k}(${poly([[p,'x'],[q0,'']])}) ${m<0?M:'＋'} ${Math.abs(m)===1?'':Math.abs(m)}x`;
  const ans=poly([[A,'x'],[B,'']]);return[`${qs} を計算すると？`,ans,three(ans,[poly([[A,'x'],[q0,'']]),poly([[k*p-m,'x'],[B,'']]),poly([[p+m,'x'],[B,'']])],()=>poly([[A+ri(-3,3),'x'],[B,'']])),`分配法則：${k}×${p}x＋${k}×${pn(q0)}、xの項をまとめる`]},
 ()=>{const x=ri(-5,5)||2,a=ri(2,6),b=ri(-8,8),r=a*x+b;return[`x ＝ ${sn(x)} のとき、${exprLin(a,b)} の値は？`,sn(r),three(sn(r),[sn(-r),sn(a+x+b),sn(a*(-x)+b)],()=>sn(r+ri(-5,5))),`${a}×${pn(x)}${b>=0?'＋':M}${Math.abs(b)}＝${sn(r)}`]},
 ()=>{const a=ri(2,9),b=ri(2,9);const ans=`${a*b}x`;return[`${a}x × ${b} を計算すると？`,ans,three(ans,[`${a+b}x`,`${a*b}x²`,`${a*b}`],()=>`${a*b+ri(1,5)}x`),`数どうしをかける：${a}×${b}＝${a*b}`]}]);
UG('ma','m4','中1','一次方程式',[
 ()=>{const x=ri(-6,9),a=ri(2,9),b=ri(-9,9)||5,c=a*x+b;const A=`x ＝ ${sn(x)}`;return[`${exprLin(a,b)} ＝ ${sn(c)}　x ＝ ？`,A,three(A,[x+1,x-1,-x,x+2].map(v=>`x ＝ ${sn(v)}`),()=>`x ＝ ${sn(x+ri(-5,5))}`),`${a}x ＝ ${sn(c-b)}、x ＝ ${sn(x)}`]},
 ()=>{const x=ri(-5,6),a=ri(3,9);let c=ri(1,a-1);const b=ri(-9,9),d=a*x+b-c*x;const A=`x ＝ ${sn(x)}`;return[`${exprLin(a,b)} ＝ ${exprLin(c,d)}　x ＝ ？`,A,three(A,[x+1,-x,x-1,x+3].map(v=>`x ＝ ${sn(v)}`),()=>`x ＝ ${sn(x+ri(-5,5))}`),`xを左、数を右に移項：${a-c}x ＝ ${sn(d-b)}`]}]);
UG('ma','m5','中1','比例と反比例',[
 ()=>{const a=(ri(1,5))*(ri(0,1)?1:-1),x0=ri(1,6)*(ri(0,1)?1:-1),y0=a*x0;const A=`y ＝ ${lin(a)}`;return[`y は x に比例し、x＝${sn(x0)} のとき y＝${sn(y0)}。式は？`,A,three(A,[`y ＝ ${lin(-a)}`,`y ＝ ${sn(x0*y0)}/x`,`y ＝ ${lin(a+1)}`],()=>`y ＝ ${lin(a+ri(2,5))}`),`y＝ax に代入：${sn(y0)}＝a×${pn(x0)}、a＝${sn(a)}`]},
 ()=>{const x0=ri(1,6)*(ri(0,1)?1:-1),y0=ri(1,6)*(ri(0,1)?1:-1),a=x0*y0;const A=`y ＝ ${sn(a)}/x`;return[`y は x に反比例し、x＝${sn(x0)} のとき y＝${sn(y0)}。式は？`,A,three(A,[`y ＝ ${sn(-a)}/x`,`y ＝ ${lin(a)}`,`y ＝ ${sn(a+1)}/x`],()=>`y ＝ ${sn(a+ri(2,6))}/x`),`y＝a/x より a＝xy＝${sn(x0)}×${pn(y0)}＝${sn(a)}`]},
 ()=>{const a=ri(2,6),x=ri(-5,5)||3,r=a*x;return[`y ＝ ${a}x で、x ＝ ${sn(x)} のときの y は？`,`y ＝ ${sn(r)}`,three(`y ＝ ${sn(r)}`,[`y ＝ ${sn(-r)}`,`y ＝ ${sn(a+x)}`,`y ＝ ${sn(r+a)}`],()=>`y ＝ ${sn(r+ri(-6,6))}`),`${a}×${pn(x)}＝${sn(r)}`]}]);
UG('ma','m6','中1','平面図形（おうぎ形）',[
 ()=>{const[r,t]=rpick([[6,60],[6,120],[9,40],[12,30],[4,90],[8,45],[10,72],[3,120],[6,150],[12,60]]);const A=piS(r*t,180)+' cm';return[`半径${r}cm、中心角${t}°のおうぎ形の弧の長さは？`,A,three(A,[piS(r*r*t,360)+' cm',piS(r*t,360)+' cm',piS(2*r*t,180)+' cm'],()=>piS(r*t+ri(1,5)*30,180)+' cm'),`2π×${r}×${t}/360 ＝ ${piS(r*t,180)}`]},
 ()=>{const[r,t]=rpick([[6,60],[6,120],[4,90],[8,45],[3,120],[12,30],[10,36],[9,80]]);const A=piS(r*r*t,360)+' cm²';return[`半径${r}cm、中心角${t}°のおうぎ形の面積は？`,A,three(A,[piS(r*t,180)+' cm²',piS(r*r,1)+' cm²',piS(r*r*t,180)+' cm²'],()=>piS(r*r*t+360*ri(1,4),360)+' cm²'),`π×${r}²×${t}/360 ＝ ${piS(r*r*t,360)}`]},
 ()=>{const r=ri(2,9);const A=piS(2*r)+' cm';return[`半径${r}cmの円の周の長さは？`,A,three(A,[piS(r*r)+' cm',piS(r)+' cm',piS(4*r)+' cm'],()=>piS(2*r+ri(1,4))+' cm'),`2πr＝2π×${r}`]}]);
UG('ma','m7','中1','空間図形（体積・表面積）',[
 ()=>{const r=ri(2,6),h=ri(2,9);const A=piS(r*r*h)+' cm³';return[`底面の半径${r}cm、高さ${h}cmの円柱の体積は？`,A,three(A,[piS(r*r*h,3)+' cm³',piS(2*r*h)+' cm³',piS(r*h)+' cm³'],()=>piS(r*r*h+ri(1,9))+' cm³'),`底面積×高さ＝π×${r}²×${h}`]},
 ()=>{const r=ri(2,6),h=3*ri(1,4);const A=piS(r*r*h,3)+' cm³';return[`底面の半径${r}cm、高さ${h}cmの円すいの体積は？`,A,three(A,[piS(r*r*h)+' cm³',piS(r*h,3)+' cm³',piS(r*r*h,2)+' cm³'],()=>piS(r*r*h/3+ri(1,9))+' cm³'),`円すい＝底面積×高さ×1/3`]},
 ()=>{const a=ri(2,8),b=ri(2,8),h=ri(2,9),v=a*b*h;return[`縦${a}cm、横${b}cm、高さ${h}cmの直方体の体積は？`,`${v} cm³`,three(`${v} cm³`,[`${a+b+h} cm³`,`${2*(a*b+b*h+a*h)} cm³`,`${a*b} cm³`],()=>`${v+ri(1,20)} cm³`),`${a}×${b}×${h}＝${v}`]},
 ()=>{const r=rpick([3,6]);const A=piS(4*r*r*r,3)+' cm³';return[`半径${r}cmの球の体積は？`,A,three(A,[piS(4*r*r)+' cm³',piS(r*r*r)+' cm³',piS(2*r*r*r)+' cm³'],()=>piS(4*r*r*r/3+ri(1,9)*3)+' cm³'),`球の体積＝4/3πr³`]}]);
UG('ma','m8','中1','データの活用',[
 ()=>{const xs=[...Array(7)].map(()=>ri(1,20)),s=xs.slice().sort((a,b)=>a-b),med=s[3];return[`次のデータの中央値は？　${xs.join('、')}`,String(med),three(String(med),[String(s[2]),String(s[4]),String(xs[3])],()=>String(med+ri(-4,4))),`小さい順：${s.join('、')}。まん中は${med}`]},
 ()=>{const xs=[...Array(6)].map(()=>ri(3,30)),mx=Math.max(...xs),mn=Math.min(...xs),r=mx-mn;return[`次のデータの範囲は？　${xs.join('、')}`,String(r),three(String(r),[String(mx),String(mx+mn),String(mn)],()=>String(r+ri(-4,4))),`範囲＝最大値${M}最小値＝${mx}${M}${mn}`]},
 ()=>{const m=ri(5,15),d=[ri(-3,3),ri(-3,3),ri(-3,3)];d.push(-(d[0]+d[1]+d[2]));const xs=d.map(v=>m+v);return[`${xs.join('、')} の平均値は？`,String(m),three(String(m),[String(m+1),String(m-1),String(xs[0])],()=>String(m+ri(-4,4))),`合計${4*m}÷4＝${m}`]}]);
UG('ma','m9','中2','式の計算',[
 ()=>{const a=ri(1,7),b=ri(-6,6)||2,c=ri(1,7),d=ri(-6,6)||-3;const ans=poly([[a-c,'x'],[b-d,'y']]);return[`(${poly([[a,'x'],[b,'y']])}) ${M} (${poly([[c,'x'],[d,'y']])}) を計算すると？`,ans,three(ans,[poly([[a+c,'x'],[b+d,'y']]),poly([[a-c,'x'],[b+d,'y']]),poly([[a+c,'x'],[b-d,'y']])],()=>poly([[a-c+ri(1,3),'x'],[b-d,'y']])),`かっこをはずすと、うしろの式の符号が変わる`]},
 ()=>{const a=ri(2,6),b=ri(2,6);const ans=`${a*b}a²b`;return[`${a}a × ${b}ab を計算すると？`,ans,three(ans,[`${a+b}a²b`,`${a*b}ab`,`${a*b}a²b²`],()=>`${a*b+ri(1,4)}a²b`),`数どうし、文字どうしをかける`]},
 ()=>{const k=ri(2,6),q=ri(2,6);const ans=`${q}y`;return[`${k*q}xy ÷ ${k}x を計算すると？`,ans,three(ans,[`${q}xy`,`${k*q-k}y`,`${q}x`],()=>`${q+ri(1,4)}y`),`${k*q}÷${k}＝${q}、xy÷x＝y`]}]);
UG('ma','m10','中2','連立方程式',[
 ()=>{const x=ri(-4,9),y=ri(-4,9),s=x+y,d=x-y,A=`x＝${sn(x)}, y＝${sn(y)}`;return[`x ＋ y ＝ ${sn(s)}、x ${M} y ＝ ${sn(d)} を解くと？`,A,three(A,[`x＝${sn(y)}, y＝${sn(x)}`,`x＝${sn(x+1)}, y＝${sn(y-1)}`,`x＝${sn(-x)}, y＝${sn(-y)}`],()=>`x＝${sn(x)}, y＝${sn(y+ri(1,4))}`),`2式をたして 2x＝${sn(s+d)}`]},
 ()=>{const x=ri(-3,6),y=ri(-3,6),a=ri(1,4),b=ri(1,4),c=ri(1,4),e=ri(-3,-1);const A=`x＝${sn(x)}, y＝${sn(y)}`;return[`${poly([[a,'x'],[b,'y']])} ＝ ${sn(a*x+b*y)}、${poly([[c,'x'],[e,'y']])} ＝ ${sn(c*x+e*y)} を解くと？`,A,three(A,[`x＝${sn(y)}, y＝${sn(x)}`,`x＝${sn(x+1)}, y＝${sn(y)}`,`x＝${sn(x)}, y＝${sn(-y)}`],()=>`x＝${sn(x+ri(1,3))}, y＝${sn(y-1)}`),`加減法か代入法で1文字を消す`]}]);
UG('ma','m11','中2','一次関数',[
 ()=>{const a=ri(-4,5)||2,b=ri(-6,6),k=ri(-4,4),r=a*k+b;return[`y ＝ ${exprLin(a,b)} で、x ＝ ${sn(k)} のときの y は？`,`y ＝ ${sn(r)}`,three(`y ＝ ${sn(r)}`,[`y ＝ ${sn(-r)}`,`y ＝ ${sn(a+b+k)}`,`y ＝ ${sn(r+a)}`],()=>`y ＝ ${sn(r+ri(-5,5))}`),`y＝${a}×${pn(k)}${b>=0?'＋':M}${Math.abs(b)}＝${sn(r)}`]},
 ()=>{const a=ri(-4,4)||3,x1=ri(-4,3),dx=ri(1,4),b=ri(-5,5),y1=a*x1+b,x2=x1+dx,y2=a*x2+b;return[`2点 (${sn(x1)}, ${sn(y1)})、(${sn(x2)}, ${sn(y2)}) を通る直線の傾きは？`,sn(a),three(sn(a),[sn(-a),fr(dx,a*dx),sn(a+1)],()=>sn(a+ri(2,5))),`傾き＝yの増加量÷xの増加量＝${sn(a*dx)}÷${dx}`]},
 ()=>{const a=ri(-5,5)||2,b=ri(-6,6);return[`一次関数 y ＝ ${exprLin(a,b)} の変化の割合は？`,sn(a),three(sn(a),[sn(b),sn(-a),sn(a+b)],()=>sn(a+ri(2,5))),`一次関数の変化の割合＝傾き＝${sn(a)}`]}]);
UG('ma','m12','中2','平行と合同（角・多角形）',[
 ()=>{const n=ri(5,10),s=180*(n-2);return[`${n}角形の内角の和は？`,`${s}°`,three(`${s}°`,[`${180*n}°`,`${180*(n-1)}°`,'360°'],()=>`${s+180*ri(1,2)}°`),`180×(n${M}2)＝180×${n-2}`]},
 ()=>{const n=rpick([3,4,5,6,8,9,10,12]),e=360/n;return[`正${n}角形の1つの外角は？`,`${e}°`,three(`${e}°`,[`${180-e}°`,`${180*(n-2)}°`,`${e*2}°`],()=>`${e+ri(1,10)}°`),`外角の和は360°：360÷${n}`]},
 ()=>{const a=ri(30,80),b=ri(20,70);return[`三角形の2つの内角が${a}°と${b}°のとき、残りの角の外角は？`,`${a+b}°`,three(`${a+b}°`,[`${180-a-b}°`,`${360-a-b}°`,`${Math.abs(a-b)}°`],()=>`${a+b+ri(5,15)}°`),`外角＝となりにない2つの内角の和`]}]);
UG('ma','m13','中2','三角形と四角形',[
 ()=>{const a=2*ri(10,60),b=(180-a)/2;return[`二等辺三角形の頂角が${a}°のとき、1つの底角は？`,`${b}°`,three(`${b}°`,[`${180-a}°`,`${a}°`,`${b+10}°`],()=>`${b+ri(1,15)}°`),`(180${M}${a})÷2＝${b}`]},
 ()=>{const a=ri(50,130);return[`平行四辺形ABCDで、∠A＝${a}°のとき∠B は？`,`${180-a}°`,three(`${180-a}°`,[`${a}°`,`${360-a}°`,`${90}°`],()=>`${180-a+ri(5,20)}°`),`となり合う角の和は180°`]},
 ()=>{const a=ri(50,130);return[`平行四辺形ABCDで、∠A＝${a}°のとき∠C は？`,`${a}°`,three(`${a}°`,[`${180-a}°`,`${360-a}°`,`${a/2}°`],()=>`${a+ri(5,20)}°`),`向かい合う角は等しい`]}]);
UG('ma','m14','中2','確率',[
 ()=>{const s=ri(3,11),c=s<=7?s-1:13-s,A=fr(c,36);return[`2つのさいころを投げて、目の和が${s}になる確率は？`,A,three(A,[fr(c+1,36),fr(1,6),fr(c,12)],()=>fr(ri(1,10),36)),`36通りのうち${c}通り`]},
 ()=>{const r=ri(1,6),w=ri(1,6),A=fr(r,r+w);return[`赤玉${r}個、白玉${w}個の袋から1個取り出すとき、赤玉の確率は？`,A,three(A,[fr(w,r+w),fr(r,w),fr(1,r+w)],()=>fr(ri(1,5),r+w+1)),`全部で${r+w}個、赤は${r}個`]},
 ()=>{const[q,a]=rpick([['1つのさいころで、偶数の目が出る確率は？','1/2'],['1つのさいころで、3の倍数の目が出る確率は？','1/3'],['1つのさいころで、6の目が出る確率は？','1/6'],['2枚の硬貨を投げて、2枚とも表になる確率は？','1/4'],['2枚の硬貨を投げて、1枚が表、1枚が裏になる確率は？','1/2'],['1つのさいころで、5以上の目が出る確率は？','1/3']]);return[q,a,three(a,['1/2','1/3','1/4','1/6','2/3'],()=>'1/'+ri(5,9)),'起こりうる場合の数のうち、あてはまる場合の数']}]);
UG('ma','m15','中3','式の展開',[
 ()=>{const a=ri(-7,7)||2,b=ri(-7,7)||-3,A=quadStr(a+b,a*b);return[`${fac(a)}${fac(b)} を展開すると？`,A,three(A,[quadStr(a+b,-(a*b)),quadStr(a*b,a+b),quadStr(-(a+b),a*b)],()=>quadStr(a+b+ri(1,3),a*b)),`(x＋a)(x＋b)＝x²＋(a＋b)x＋ab`]},
 ()=>{const a=ri(1,8)*(ri(0,1)?1:-1),A=quadStr(2*a,a*a);return[`${fac(a)}² を展開すると？`,A,three(A,[quadStr(0,a*a),quadStr(a,a*a),quadStr(2*a,2*a)],()=>quadStr(2*a,a*a+ri(1,5))),`(x＋a)²＝x²＋2ax＋a²`]},
 ()=>{const a=ri(1,9),A=quadStr(0,-a*a);return[`(x ＋ ${a})(x ${M} ${a}) を展開すると？`,A,three(A,[quadStr(0,a*a),quadStr(2*a,-a*a),quadStr(-2*a,a*a)],()=>quadStr(0,-a*a-ri(1,5))),`(x＋a)(x${M}a)＝x²${M}a²`]}]);
UG('ma','m16','中3','因数分解',[
 ()=>{let a=ri(-7,7)||2,b=ri(-7,7)||-3;if(a>b)[a,b]=[b,a];const A=fac(a)+fac(b);return[`${quadStr(a+b,a*b)} を因数分解すると？`,A,three(A,[fac(-a)+fac(-b),fac(a)+fac(-b),fac(-a)+fac(b)],()=>fac(a+ri(1,3))+fac(b)),`たして${sn(a+b)}、かけて${sn(a*b)}の2数`]},
 ()=>{const a=ri(1,9),A=`(x ＋ ${a})(x ${M} ${a})`;return[`x² ${M} ${a*a} を因数分解すると？`,A,three(A,[`(x ${M} ${a})²`,`(x ＋ ${a})²`,`(x ＋ ${a*a})(x ${M} 1)`],()=>`(x ＋ ${a+1})(x ${M} ${a+1})`),`x²${M}a²＝(x＋a)(x${M}a)`]},
 ()=>{const a=ri(1,8)*(ri(0,1)?1:-1),A=fac(a)+'²';return[`${quadStr(2*a,a*a)} を因数分解すると？`,A,three(A,[fac(-a)+'²',fac(a)+fac(-a),fac(2*a)+fac(a)],()=>fac(a+ri(1,2))+'²'),`x²＋2ax＋a²＝(x＋a)²`]}]);
UG('ma','m17','中3','平方根',[
 ()=>{const k=ri(2,5),m=rpick([2,3,5,6,7]);const A=`${k}√${m}`;return[`√${k*k*m} を a√b の形にすると？`,A,three(A,[`${m}√${k}`,`${k*k}√${m}`,`${k+1}√${m}`],()=>`${k}√${m+1}`),`√${k*k*m}＝√(${k}²×${m})`]},
 ()=>{const m=rpick([2,3,5,6,7]),a=ri(1,6),b=ri(1,6),A=rt(a+b,m);return[`${rt(a,m)} ＋ ${rt(b,m)} を計算すると？`,A,three(A,[`${a+b}√${2*m}`,rt(a*b,m),`√${(a+b)*m}`],()=>rt(a+b+ri(1,3),m)),`√${m} をひとまとまりと見てたす`]},
 ()=>{const p=rpick([2,3,5,6,7]),t=ri(2,6),A=rt(t,p);return[`${p*t}/√${p} の分母を有理化すると？`,A,three(A,[`${p*t}√${p}`,rt(p*t,1)+'/'+p,`${t}`],()=>rt(t+1,p)),`分母と分子に√${p}をかける：${p*t}√${p}/${p}`]},
 ()=>{const[a,b]=rpick([[2,8],[3,12],[2,18],[5,20],[3,27],[2,32]]),A=String(Math.sqrt(a*b));return[`√${a} × √${b} ＝ ？`,A,three(A,[`√${a+b}`,`${a*b}`,`√${a*b*2}`],()=>String(+A+ri(1,3))),`√${a}×√${b}＝√${a*b}＝${A}`]}]);
UG('ma','m18','中3','二次方程式',[
 ()=>{let r1=ri(-6,6),r2=ri(-6,6);while(r1===r2||!r1||!r2){r1=ri(-6,6);r2=ri(-6,6)}const lo=Math.min(r1,r2),hi=Math.max(r1,r2),S=(a,b)=>`x ＝ ${sn(a)}, ${sn(b)}`;
  return[`${quadStr(-(r1+r2),r1*r2)} ＝ 0 を解くと？`,S(lo,hi),three(S(lo,hi),[S(-hi,-lo),S(lo,-hi),S(-lo,hi)],()=>S(lo+ri(1,3),hi)),`${fac(-r1)}${fac(-r2)}＝0`]},
 ()=>{const k=ri(1,9),A=`x ＝ ±${k}`;return[`x² ＝ ${k*k} を解くと？`,A,three(A,[`x ＝ ${k}`,`x ＝ ±${k*k}`,`x ＝ ${k*2}`],()=>`x ＝ ±${k+1}`),`2乗して${k*k}になる数は ±${k}`]},
 ()=>{const n=rpick([2,3,5,6,7,8,12,18]),[k,m]=simp(n),A=`x ＝ ±${rt(k,m)}`;return[`x² ＝ ${n} を解くと？`,A,three(A,[`x ＝ ${rt(k,m)}`,`x ＝ ±${n/2}`,`x ＝ ±${n}`],()=>`x ＝ ±√${n+1}`),`x＝±√${n}${k>1?'＝±'+rt(k,m):''}`]}]);
UG('ma','m19','中3','関数 y＝ax²',[
 ()=>{const a=rpick([1,2,3,-1,-2]),x=ri(-4,4)||2,r=a*x*x;return[`y ＝ ${a===1?'':a===-1?M:sn(a)}x² で、x ＝ ${sn(x)} のときの y は？`,`y ＝ ${sn(r)}`,three(`y ＝ ${sn(r)}`,[`y ＝ ${sn(-r)}`,`y ＝ ${sn(a*x*2)}`,`y ＝ ${sn(a*x)}`],()=>`y ＝ ${sn(r+ri(1,5))}`),`${sn(a)}×${pn(x)}²＝${sn(r)}`]},
 ()=>{const a=rpick([1,2,3,4,-1,-2,-3]),x=rpick([1,2,3]),y=a*x*x;return[`y ＝ ax² のグラフが点 (${x}, ${sn(y)}) を通るとき、a は？`,sn(a),three(sn(a),[sn(-a),sn(y),sn(y/x)],()=>sn(a+ri(1,4))),`${sn(y)}＝a×${x}²`]},
 ()=>{const a=rpick([1,2,3,-1,-2]),p=ri(1,3),q=p+ri(1,3),r=a*(p+q);return[`y ＝ ${a===1?'':a===-1?M:sn(a)}x² で、x が ${p} から ${q} まで増加するときの変化の割合は？`,sn(r),three(sn(r),[sn(a*(q-p)),sn(a*q*q),sn(-r)],()=>sn(r+ri(1,4))),`(${sn(a*q*q)}${M}${pn(a*p*p)})÷(${q}${M}${p})＝${sn(r)}`]}]);
UG('ma','m20','中3','相似な図形',[
 ()=>{const m=ri(1,4),n=m+ri(1,3);const A=`${m*m}:${n*n}`;return[`相似比が ${m}:${n} の2つの図形の面積比は？`,A,three(A,[`${m}:${n}`,`${m*m*m}:${n*n*n}`,`${2*m}:${2*n}`],()=>`${m*m}:${n*n+1}`),`面積比は相似比の2乗`]},
 ()=>{const m=ri(1,3),n=m+ri(1,2);const A=`${m**3}:${n**3}`;return[`相似比が ${m}:${n} の2つの立体の体積比は？`,A,three(A,[`${m}:${n}`,`${m*m}:${n*n}`,`${3*m}:${3*n}`],()=>`${m**3}:${n**3+1}`),`体積比は相似比の3乗`]},
 ()=>{const m=ri(2,4),n=m+ri(1,3),k=ri(2,4),s=m*k,t=n*k;return[`△ABC∽△DEFで相似比は ${m}:${n}。AB＝${s}cm のとき DE は？`,`${t} cm`,three(`${t} cm`,[`${s+n-m} cm`,`${s*n} cm`,`${m*n} cm`],()=>`${t+ri(1,4)} cm`),`${m}:${n}＝${s}:x → x＝${t}`]}]);
UG('ma','m21','中3','円周角',[
 ()=>{const c=2*ri(20,80);return[`中心角が${c}°の弧に対する円周角は？`,`${c/2}°`,three(`${c/2}°`,[`${c}°`,`${2*c}°`,`${180-c}°`],()=>`${c/2+ri(5,15)}°`),`円周角は中心角の半分`]},
 ()=>{const a=ri(20,80);return[`円周角が${a}°のとき、同じ弧に対する中心角は？`,`${2*a}°`,three(`${2*a}°`,[`${a}°`,`${a/2}°`,`${180-a}°`],()=>`${2*a+ri(5,15)}°`),`中心角は円周角の2倍`]},
 ()=>['半円の弧に対する円周角は？','90°',['180°','45°','60°'],'直径に対する円周角は90°']]);
UG('ma','m22','中3','三平方の定理',[
 ()=>{const[a,b,c]=rpick([[3,4,5],[6,8,10],[5,12,13],[9,12,15],[8,15,17],[12,16,20]]);return[`直角をはさむ2辺が ${a}cm と ${b}cm の直角三角形の斜辺は？`,`${c} cm`,three(`${c} cm`,[`${a+b} cm`,`${c+1} cm`,`${Math.abs(b-a)} cm`],()=>`${c+ri(2,4)} cm`),`${a}²＋${b}²＝${c}²`]},
 ()=>{const[a,b,c]=rpick([[3,4,5],[6,8,10],[5,12,13],[8,15,17]]);return[`斜辺が${c}cm、1辺が${a}cmの直角三角形の、残りの辺は？`,`${b} cm`,three(`${b} cm`,[`${c-a} cm`,`${c+a} cm`,`${b+1} cm`],()=>`${b+ri(2,4)} cm`),`${c}²${M}${a}²＝${b}²`]},
 ()=>{const[a,b]=rpick([[1,1],[1,2],[2,3],[1,3],[2,2],[3,3]]),[k,m]=simp(a*a+b*b),A=rt(k,m)+' cm';return[`直角をはさむ2辺が ${a}cm と ${b}cm の直角三角形の斜辺は？`,A,three(A,[`${a+b} cm`,`√${a+b} cm`,`${a*a+b*b} cm`],()=>`√${a*a+b*b+ri(1,7)} cm`),`√(${a}²＋${b}²)＝√${a*a+b*b}`]}]);
UG('ma','m23','中3','標本調査',[
 ()=>{const k=rpick([2,4,5,8,10]),n=rpick([20,30,40,50]),m=rpick([30,40,50,60]),T=m*n/k;if(!Number.isInteger(T))return['全数調査と標本調査のうち、テレビの視聴率調査は？','標本調査',['全数調査','国勢調査','どちらでもない'],'一部を調べて全体を推定する＝標本調査'];
  return[`池の魚${m}匹に印をつけて放した。後日${n}匹とると、印つきが${k}匹いた。池の魚はおよそ何匹？`,`${T}匹`,three(`${T}匹`,[`${m+n}匹`,`${m*k}匹`,`${n*k}匹`],()=>`${T+10*ri(1,5)}匹`),`${k}:${n}＝${m}:x → x＝${T}`]},
 ()=>{const[q,a,w]=rpick([['国勢調査は、全数調査と標本調査のどちら？','全数調査',['標本調査','抽出調査','世論調査']],['工場の電池の寿命を調べるのに適した調査は？','標本調査',['全数調査','国勢調査','家庭調査']],['学校の健康診断は、全数調査と標本調査のどちら？','全数調査',['標本調査','世論調査','抽出調査']]]);return[q,a,w,'全部を調べる＝全数調査、一部を調べる＝標本調査']}]);
