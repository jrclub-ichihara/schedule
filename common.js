/* Jr.CLUB市原 新サイト共通 */
var JR=(function(){
  var EXEC='https://script.google.com/macros/s/AKfycbwB-_TuXQhHCfWU0GYXXQq9Fm8mdG7bFzOEHE3CJLB3LoYam0eGmSPQlHNJHY49stKs/exec';
  function load(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function pass(v){if(v===undefined){try{return localStorage.getItem('jrclub_team_pass')||''}catch(e){return ''}}try{localStorage.setItem('jrclub_team_pass',v)}catch(e){}}
  // GASの関数を呼ぶ（POSTはtext/plainで送るのでCORSの事前確認が不要）
  function rpc(fn,args){return fetch(EXEC,{method:'POST',body:JSON.stringify({rpc:fn,args:args||[]})}).then(function(r){return r.json()}).then(function(d){if(!d.ok)throw new Error(d.e||'エラー');return d.r})}
  // 写真の小さい画像を端末に保存（2回目からすぐ出る）
  var dbp=null;function db(){if(dbp)return dbp;dbp=new Promise(function(res){try{var r=indexedDB.open('jrclub',1);r.onupgradeneeded=function(){r.result.createObjectStore('th')};r.onsuccess=function(){res(r.result)};r.onerror=function(){res(null)}}catch(e){res(null)}});return dbp}
  function idbGet(ids){return db().then(function(d){if(!d)return {};return new Promise(function(res){var out={},t=d.transaction('th','readonly'),st=t.objectStore('th'),n=ids.length;if(!n)return res(out);
    ids.forEach(function(id){var q=st.get(id);q.onsuccess=function(){if(q.result)out[id]=q.result;if(--n===0)res(out)};q.onerror=function(){if(--n===0)res(out)}})})}).catch(function(){return {}})}
  function idbPut(map){db().then(function(d){if(!d)return;try{var t=d.transaction('th','readwrite'),st=t.objectStore('th');Object.keys(map).forEach(function(k){if(map[k])st.put(map[k],k)})}catch(e){}})}
  // 開いた瞬間に前回の中身を出して、裏で新しいのを取り直す
  var SWR={getAlbumIndex:{key:'jrc_albidx',again:function(){var lb=document.getElementById('lb');return !window.CUR&&!(lb&&lb.classList.contains('on'))}},
    getUpInit:{key:'jrc_upinit',again:function(){return false}},getRosterData:{key:'jrc_roster2',again:function(){return true}}};
  function call(k,a,s,f){
    if(k==='getAlbumThumbs'){var ids=(a[1]||[]).map(String);idbGet(ids).then(function(have){var miss=ids.filter(function(i){return !have[i]});
        if(!miss.length)return s&&s(have);rpc(k,[a[0],miss]).then(function(r){idbPut(r||{});s&&s(Object.assign(have,r||{}))},function(e){if(Object.keys(have).length)s&&s(have);else f?f(e):console.error(e)})});return}
    var w=SWR[k];if(w){var c=load(w.key);var sk=JSON.stringify(a);var hit=c&&c.a===sk?c.r:null;if(hit&&!hit.needPass)setTimeout(function(){s&&s(hit)},0);
      rpc(k,a).then(function(r){save(w.key,{a:sk,r:r});if(!hit||hit.needPass)return s&&s(r);if(JSON.stringify(r)!==JSON.stringify(hit)&&w.again())s&&s(r)},function(e){if(!hit)f?f(e):console.error(e)});return}
    rpc(k,a).then(function(r){s&&s(r)},function(e){f?f(e):console.error(e)})}
  function shim(){var mk=function(){var s=null,f=null,o={withSuccessHandler:function(cb){s=cb;return p},withFailureHandler:function(cb){f=cb;return p}};
      var p=new Proxy(o,{get:function(t,k){if(k in t)return t[k];return function(){call(k,[].slice.call(arguments),s,f)}}});return p};
    window.google={script:{get run(){return mk()}}}}
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px'}):null;
  function reveal(root,sel){var n=0;[].forEach.call(root.querySelectorAll(sel),function(el){if(el.classList.contains('rv'))return;el.classList.add('rv');var r=el.getBoundingClientRect();
    if(r.top<innerHeight){el.style.transitionDelay=Math.min(n++*70,560)+'ms';requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add('in')})});setTimeout(function(){el.style.transitionDelay=''},1300)}
    else if(io)io.observe(el);else el.classList.add('in')})}
  [].forEach.call(document.querySelectorAll('[data-split]'),function(h){var t=h.textContent;h.innerHTML=t.split('').map(function(c,i){return '<span style="animation-delay:'+(0.12+i*0.05)+'s">'+(c===' '?'&nbsp;':c)+'</span>'}).join('')});
  return {EXEC:EXEC,load:load,save:save,pass:pass,rpc:rpc,shim:shim,reveal:reveal};
})();
