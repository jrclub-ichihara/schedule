/* Jr.CLUB市原 新サイト共通 */
var JR=(function(){
  var EXEC='https://script.google.com/macros/s/AKfycbwB-_TuXQhHCfWU0GYXXQq9Fm8mdG7bFzOEHE3CJLB3LoYam0eGmSPQlHNJHY49stKs/exec';
  function load(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function pass(v){if(v===undefined){try{return localStorage.getItem('jrclub_team_pass')||''}catch(e){return ''}}try{localStorage.setItem('jrclub_team_pass',v)}catch(e){}}
  // GASの関数を呼ぶ（POSTはtext/plainで送るのでCORSの事前確認が不要）
  function rpc(fn,args){return fetch(EXEC,{method:'POST',body:JSON.stringify({rpc:fn,args:args||[]})}).then(function(r){return r.json()}).then(function(d){if(!d.ok)throw new Error(d.e||'エラー');return d.r})}
  // 既存ページ用：google.script.run と同じ書き方で呼べるようにする
  function shim(){var mk=function(){var s=null,f=null,o={withSuccessHandler:function(cb){s=cb;return p},withFailureHandler:function(cb){f=cb;return p}};
      var p=new Proxy(o,{get:function(t,k){if(k in t)return t[k];return function(){var a=[].slice.call(arguments);rpc(k,a).then(function(r){s&&s(r)},function(e){f?f(e):console.error(e)})}}});return p};
    window.google={script:{get run(){return mk()}}}}
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px'}):null;
  function reveal(root,sel){var n=0;[].forEach.call(root.querySelectorAll(sel),function(el){if(el.classList.contains('rv'))return;el.classList.add('rv');var r=el.getBoundingClientRect();
    if(r.top<innerHeight){el.style.transitionDelay=Math.min(n++*70,560)+'ms';requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add('in')})});setTimeout(function(){el.style.transitionDelay=''},1300)}
    else if(io)io.observe(el);else el.classList.add('in')})}
  [].forEach.call(document.querySelectorAll('[data-split]'),function(h){var t=h.textContent;h.innerHTML=t.split('').map(function(c,i){return '<span style="animation-delay:'+(0.12+i*0.05)+'s">'+(c===' '?'&nbsp;':c)+'</span>'}).join('')});
  return {EXEC:EXEC,load:load,save:save,pass:pass,rpc:rpc,shim:shim,reveal:reveal};
})();
