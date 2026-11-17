const {chromium}=require('playwright');
(async()=>{const W=process.argv[2];const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const p=await (await b.newContext({viewport:{width:900,height:600}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{localStorage.setItem('sougei_drill_v1',JSON.stringify({v:1,unlocked:true,name:'けい',settings:{sound:false,grade:'中1',subj:'en'},vocab:{},hist:[],practice:[],badges:{},coins:0}))});
 await p.goto('file://'+W+'/dist/world_test.html');await p.waitForTimeout(800);
 await p.evaluate(()=>{const looks=[{},{hat:'cap',face:'grin'},{hairStyle:6,hair:'#ff7ac8',hat:'cat',face:'cat',shirt:'#ff7ac8'},{hairStyle:1,hair:'#ffd23a',face:'cool',shirt:'#22262f',back:'cape'},{hairStyle:3,hair:'#5a3b22',hat:'bunny',face:'wink',shirt:'#ffd23a',pet:'dog'},{hat:'wizard',face:'star',shirt:'#9b59d0',back:'wingA',hairStyle:2,hair:'#eeeeee'},{hat:'robo',face:'robo',skin:'#d9dde3',shirt:'#ff7a1a'},{hat:'crown',hairStyle:5,hair:'#e94b4b',back:'jet',pet:'dragon',shirt:'gold'}];
  const wrap=document.createElement('div');wrap.style.cssText='position:fixed;inset:0;z-index:99;background:#3a63f0;display:grid;grid-template-columns:repeat(4,1fr)';document.body.appendChild(wrap);
  const base=Object.assign({},D.av);for(const l of looks){D.av=Object.assign({},base,{hat:'none',back:'none',pet:'none',face:'smile',hairStyle:0,hair:'#1b1b1b',shirt:'#2b5bd7',skin:'#eebd92'},l);D.own={};const c=document.createElement('canvas');c.width=c.height=420;c.style.width='100%';wrap.appendChild(c);
   // bypass avFix ownership reset
   const f=avFix;avFix=()=>{};lobbyAvatar(c);avFix=f}});
 await p.waitForTimeout(300);await p.screenshot({path:W+'/dist/shots/sheet.png'});console.log(errs.join('\n')||'ok');await b.close()})();
