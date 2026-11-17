const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const W=process.argv[2];const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/TUNNEL|ERR_/.test(m.text()))errs.push(m.text())});
 await p.addInitScript(()=>{window.claude={use:async n=>n==='user'?{isOwner:async()=>true}:n==='sample'?Object.assign(async()=>({text:''}),{json:async()=>({questions:[{q:'水の化学式は？',a:'H₂O',w:['CO₂','O₂','NaCl'],e:'水素2つと酸素1つ'},{q:'酸化銅を炭素で還元すると何ができる？',a:'銅',w:['酸素','水素','鉄'],e:'炭素が酸素をうばう'},{q:'同じ',a:'A',w:['A','B','C'],e:''}]})}):n==='artifact'?{publish:async h=>{window.__pub=h;return{version:'v2'}}}:null};
  localStorage.setItem('sougei_drill_v1',JSON.stringify({v:1,unlocked:true,name:'けい',settings:{sound:false,grade:'中2',subj:'en'},vocab:{},hist:[],practice:[],badges:{},coins:0}))});
 await p.goto('file://'+W+'/dist/world_test.html');await p.waitForTimeout(700);await p.screenshot({path:W+'/dist/shots/r1-home.png'});
 await p.click('#hRg');await p.waitForTimeout(300);await p.screenshot({path:W+'/dist/shots/r2-rangehome.png'});
 await p.click('[data-rs="sc"]');await p.waitForTimeout(300);
 await p.selectOption('#rFrom','8');await p.selectOption('#rTo','9');await p.click('#rSet');await p.waitForTimeout(300);await p.screenshot({path:W+'/dist/shots/r3-pick.png'});
 await p.click('#rGo .btn');for(let i=0;i<10;i++){await p.waitForTimeout(120);if(i===0)await p.screenshot({path:W+'/dist/shots/r4-q.png'});await p.click('#cs .ch >> nth=0');await p.click('#nx .btn')}
 await p.waitForTimeout(300);await p.screenshot({path:W+'/dist/shots/r5-result.png',fullPage:false});
 const r1=await p.evaluate(()=>({coins:D.coins,last:D.hist.at(-1)}));
 // math
 await p.click('#mB .btn.go');await p.waitForTimeout(200);await p.click('#mX');await p.click('#hRg');await p.click('[data-rs="ma"]');await p.selectOption('#rFrom','14');await p.selectOption('#rTo','22');await p.click('#rSet');await p.click('#rGo .btn');await p.waitForTimeout(200);await p.screenshot({path:W+'/dist/shots/r6-math.png'});
 await p.click('#mX');
 // coach
 await p.click('#hRg');await p.waitForTimeout(200);await p.click('#coachGo');await p.click('#cdNew');await p.fill('#cTitle','2学期期末 理科');await p.fill('#cRange','化学変化と原子・分子');await p.click('#mB .btn.go');await p.waitForTimeout(500);
 await p.screenshot({path:W+'/dist/shots/r7-coach.png'});const nq=await p.$$eval('.cq',e=>e.length);
 await p.click('#cAdd');await p.waitForTimeout(200);await p.click('#cPub .btn');await p.waitForTimeout(300);const pub1=await p.evaluate(()=>!!window.__pub);
 await p.click('[data-rm="2"]');await p.waitForTimeout(200);await p.click('#cPub .btn');await p.waitForTimeout(300);
 const html=await p.evaluate(()=>window.__pub);fs.writeFileSync(W+'/dist/republished.html',html||'');
 // load republished page as a kid (no claude)
 const p2=await (await b.newContext({viewport:{width:390,height:844}})).newPage();p2.on('pageerror',e=>errs.push('P2 '+e.message));
 await p2.goto('file://'+W+'/dist/republished.html');await p2.waitForTimeout(700);await p2.click('#hRg');await p2.waitForTimeout(300);await p2.screenshot({path:W+'/dist/shots/r8-kid.png'});
 const kid=await p2.evaluate(()=>({sets:SETS.map(s=>s.title+':'+s.qs.length),coach:!!document.querySelector('#coachGo')}));
 await p2.click('[data-set]');await p2.waitForTimeout(200);const q1=await p2.$eval('#mB .q',e=>e.textContent);
 console.log(JSON.stringify({r1,nq,blockedBad:!pub1,pubLen:(html||'').length,starts:(html||'').slice(0,60),kid,q1}));console.log(errs.join('\n')||'no errors');await b.close()})();
