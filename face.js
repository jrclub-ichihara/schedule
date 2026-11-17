/* Jr.CLUB市原 顔の見分け（すべてこの端末の中だけで計算します。顔や写真を外のサービスに送りません）
   ・顔さがし：SSD MobileNet（読めなければ TinyFaceDetector）
   ・写真を大きいまま（最大2400px）調べ、全体＋分割（タイル）で小さい顔も探す
   ・端末の速さを測って、分割の数を自動で決める（古いスマホは少なめ）
   ・1人ごとに「近い見本いくつか」と「平均」の両方と比べ、自信がないときは候補（◯◯？）にする */
var JRFACE=(function(){
  var MODE='',READY=null,MS=400,TILES=4;
  /* しきい値（距離が小さいほど似ている。face-apiの128次元・ユークリッド距離） */
  var SURE=0.45,CAND=0.55,GAP=0.06,MIN_FACE=24;

  function load(v){if(READY)return READY;
    READY=new Promise(function(res){
      var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@vladmandic/face-api@'+v+'/dist/face-api.js';
      s.onload=function(){var M='https://cdn.jsdelivr.net/npm/@vladmandic/face-api@'+v+'/model/',N=faceapi.nets;
        Promise.all([N.faceLandmark68Net.loadFromUri(M),N.faceRecognitionNet.loadFromUri(M)]).then(function(){
          return N.ssdMobilenetv1.loadFromUri(M).then(function(){MODE='ssd'},function(){return N.tinyFaceDetector.loadFromUri(M).then(function(){MODE='tiny'})})
        }).then(bench).then(function(){res(true)}).catch(function(){MODE='';res(false)})};
      s.onerror=function(){res(false)};document.head.appendChild(s)});
    return READY}

  function opts(){return MODE==='ssd'?new faceapi.SsdMobilenetv1Options({minConfidence:0.4,maxResults:50}):new faceapi.TinyFaceDetectorOptions({inputSize:416,scoreThreshold:0.4})}
  /* 端末の速さを測る（1回目はGPUの準備で遅いので2回目を測る）→ 1枚あたり約2.5秒以内に収まる分割数にする */
  function bench(){var c=document.createElement('canvas');c.width=c.height=320;var x=c.getContext('2d');x.fillStyle='#888';x.fillRect(0,0,320,320);
    return faceapi.detectAllFaces(c,opts()).then(function(){var t=performance.now();return faceapi.detectAllFaces(c,opts()).then(function(){
      MS=Math.max(30,performance.now()-t);TILES=MS<120?6:MS<250?4:MS<1500?2:0;try{localStorage.setItem('jrc_face_ms',String(Math.round(MS)))}catch(e){}})}).catch(function(){TILES=2})}

  function cut(src,x,y,w,h,max){var k=Math.min(1,max/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);
    var g=c.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(src,x,y,w,h,0,0,c.width,c.height);return {c:c,k:k}}
  /* 分割のしかた：縦横比に合わせて n 枚前後のタイル（2割ずつ重ねる） */
  function grid(W,H,n){if(n<2)return [];var cols=W>=H?Math.max(2,Math.round(Math.sqrt(n*W/H))):Math.max(1,Math.round(Math.sqrt(n*W/H)));
    var rows=Math.max(1,Math.round(n/cols));if(cols*rows<2)rows=2;var ov=0.2,tw=W/(cols-(cols-1)*ov),th=H/(rows-(rows-1)*ov),out=[];
    for(var r=0;r<rows;r++)for(var c=0;c<cols;c++)out.push({x:Math.round(c*tw*(1-ov)),y:Math.round(r*th*(1-ov)),w:Math.round(tw),h:Math.round(th)});return out}
  function iou(a,b){var x1=Math.max(a.x,b.x),y1=Math.max(a.y,b.y),x2=Math.min(a.x+a.w,b.x+b.w),y2=Math.min(a.y+a.h,b.y+b.h),i=Math.max(0,x2-x1)*Math.max(0,y2-y1);
    return {u:i/(a.w*a.h+b.w*b.h-i),m:i/Math.min(a.w*a.h,b.w*b.h)}}
  function merge(bs){bs.sort(function(a,b){return b.s-a.s});var keep=[];
    bs.forEach(function(b){if(!keep.some(function(k){var o=iou(k,b);return o.u>0.3||o.m>0.6}))keep.push(b)});return keep}

  /* 写真（canvas、最大2400px）から顔を探して、特徴（128個の数）を出す */
  async function detect(full){if(!MODE)return [];
    var W=full.width,H=full.height,boxes=[];
    var add=function(r,ox,oy,k){r.forEach(function(d){var b=d.box||d;boxes.push({x:ox+b.x/k,y:oy+b.y/k,w:b.width/k,h:b.height/k,s:d.score||0})})};
    var all=cut(full,0,0,W,H,1024);add(await faceapi.detectAllFaces(all.c,opts()),0,0,all.k);
    var tl=grid(W,H,TILES);for(var i=0;i<tl.length;i++){var t=tl[i],tc=cut(full,t.x,t.y,t.w,t.h,800);add(await faceapi.detectAllFaces(tc.c,opts()),t.x,t.y,tc.k)}
    var out=[];for(var j=0,m=merge(boxes);j<m.length;j++){var b=m[j];if(b.w<MIN_FACE)continue;try{
      /* 顔の向きをそろえてから特徴を出す（今までの見本と同じやり方なので、前の見本もそのまま使えます） */
      var pad=b.w*0.25,bx=Math.max(0,b.x-pad),by=Math.max(0,b.y-pad),bw=Math.min(W-bx,b.w+pad*2),bh=Math.min(H-by,b.h+pad*2);
      bx=Math.floor(bx);by=Math.floor(by);bw=Math.floor(bw);bh=Math.floor(bh);
      var crop=(await faceapi.extractFaces(full,[new faceapi.Rect(bx,by,bw,bh)]))[0];
      var lm=(await faceapi.detectFaceLandmarks(crop)).shiftBy(bx,by),P=lm.positions;
      var rect=lm.align(null,{useDlibAlignment:true}).floor();
      var fc=(await faceapi.extractFaces(full,[rect]))[0],d=await faceapi.computeFaceDescriptor(fc);
      /* 横顔の度合い：鼻が両目の真ん中からどれだけずれているか（0=正面・1=真横） */
      var le=P[36],re=P[45],ns=P[30],yaw=Math.min(1,Math.abs((ns.x-le.x)/((re.x-le.x)||1)-0.5)*2.2);
      out.push({box:{x:b.x,y:b.y,w:b.w,h:b.h},score:b.s,d:Array.prototype.map.call(d,function(x){return Math.round(x*1000)/1000}),yaw:Math.round(yaw*100)/100})
    }catch(e){}}
    return out}

  function vec(d){if(typeof d==='string')d=d.split(',');var a=new Float32Array(128);for(var i=0;i<128;i++)a[i]=+d[i]||0;return a}
  function dist(a,b){var s=0;for(var i=0;i<128;i++){var x=a[i]-b[i];s+=x*x}return Math.sqrt(s)}

  /* 見本の束：refs=[{n:名前,d:特徴,how:'手'(人が付けた)|'自'(自動)}] → 1人ごとにまとめ、平均も作る */
  function bank(refs,exclude){var by={},ex={};(exclude||[]).forEach(function(n){ex[n]=1});
    (refs||[]).forEach(function(r){if(!r||!r.n||r.n==='対象外'||!r.d)return;var v=vec(r.d);(by[r.n]=by[r.n]||{n:r.n,v:[],w:[]}).v.push(v);by[r.n].w.push(r.how==='手'?1:0.6)});
    var people=Object.keys(by).map(function(n){var p=by[n],m=new Float32Array(128),sw=0;
      p.v.forEach(function(v,i){for(var j=0;j<128;j++)m[j]+=v[j]*p.w[i];sw+=p.w[i]});for(var j=0;j<128;j++)m[j]/=sw;p.mean=m;p.ex=!!ex[n];return p});
    return {people:people,size:(refs||[]).length}}

  /* 1人ごとの距離：近い見本3つの平均と、平均顔との距離をまぜる（見本が少ない人は少しきびしめ） */
  function score(p,v){var ds=p.v.map(function(r){return dist(r,v)}).sort(function(a,b){return a-b}),k=Math.min(3,ds.length),s=0;for(var i=0;i<k;i++)s+=ds[i];s/=k;
    if(p.v.length>=3)s=0.6*s+0.4*dist(p.mean,v);else s+=0.03*(3-p.v.length);return Math.min(ds[0]+0.04,s)}

  /* 1つの顔の名前を決める → {n:確定した名前, q:候補（◯◯？）, p:自信0〜100} */
  function match(f,B){var v=vec(f.d),best=null,b1=9,b2=9;
    (B&&B.people||[]).forEach(function(p){var s=score(p,v);if(s<b1){b2=b1;b1=s;best=p}else if(s<b2)b2=s});
    if(!best)return {n:'',q:'',p:0};
    var hard=(f.yaw||0)>0.55||(f.box&&f.box.w<40); /* 横顔・とても小さい顔は確定しない */
    var conf=Math.max(0,Math.min(100,Math.round((CAND+0.05-b1)/0.25*100-(hard?15:0))));
    if(best.ex)return {n:'',q:'',p:0}; /* 「自動の見分けから外す」子は、名前も候補も付けない */
    if(!hard&&b1<=SURE&&b2-b1>=GAP)return {n:best.n,q:'',p:conf};
    if(b1<=CAND)return {n:'',q:best.n,p:conf};
    return {n:'',q:'',p:conf}}

  /* 名前のない顔を「たぶん同じ人」でまとめる（古いスマホでも動くよう、代表の顔とだけ比べる） */
  function cluster(faces,th){th=th||0.47;var cs=[];
    faces.slice().sort(function(a,b){return (b.box?b.box.w:0)-(a.box?a.box.w:0)}).forEach(function(f){var v=vec(f.d),bi=-1,bd=9;
      for(var i=0;i<cs.length;i++){var d=dist(cs[i].mean,v);if(d<bd){bd=d;bi=i}}
      if(bi>=0&&bd<=th){var c=cs[bi],n=c.items.length;c.items.push(f);for(var j=0;j<128;j++)c.mean[j]=(c.mean[j]*n+v[j])/(n+1)}
      else cs.push({mean:v,items:[f]})});
    return cs.sort(function(a,b){return b.items.length-a.items.length})}

  return {load:load,detect:detect,bank:bank,match:match,cluster:cluster,vec:vec,dist:dist,
    get mode(){return MODE},get tiles(){return TILES},get ms(){return MS},set tiles(n){TILES=n}}
})();
