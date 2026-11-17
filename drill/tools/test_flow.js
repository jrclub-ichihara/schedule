const {chromium}=require('playwright');
(async()=>{const W=process.argv[2];const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await c.newPage();const errs=[];
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('pageerror',e=>errs.push('PAGEERR: '+e.message));
 await p.addInitScript(()=>{localStorage.setItem('sougei_drill_v1',JSON.stringify({v:1,unlocked:true,name:'けい',settings:{sound:false,grade:'中1',subj:'en'},vocab:{},hist:[],practice:[],badges:{},coins:3}))});
 await p.goto('file://'+W+'/dist/world_test.html');await p.waitForTimeout(500);await p.click('#hW');await p.waitForTimeout(2000);
 await p.screenshot({path:W+'/dist/shots/f1-welcome.png'});await p.click('#mB .btn');await p.waitForTimeout(300);
 await p.evaluate(()=>zoneTalk('ma'));await p.waitForTimeout(200);await p.click('#mB .btn.go');
 for(let i=0;i<3;i++){await p.waitForTimeout(250);await p.click('#cs .ch >> nth=0');await p.waitForTimeout(200);await p.click('#nx .btn')}
 await p.waitForTimeout(300);await p.screenshot({path:W+'/dist/shots/f2-result.png'});await p.click('#mB .btn');await p.waitForTimeout(1200);
 const r1=await p.evaluate(()=>({coins:D.coins,own:D.own,house:Object.keys(D.house.b).length}));
 await p.evaluate(()=>{P.x=0;P.z=1.8});await p.waitForTimeout(300);const act=await p.evaluate(()=>curI&&curI.label);
 await p.click('#bAct');await p.waitForTimeout(800);const r2=await p.evaluate(()=>D.coins);
 await p.screenshot({path:W+'/dist/shots/f3-world.png'});
 // build: erase + undo
 await p.click('#bHome');await p.waitForTimeout(1500);await p.click('[data-tl="erase"]');const n0=await p.evaluate(()=>Object.keys(D.house.b).length);
 await p.mouse.click(195,330);await p.waitForTimeout(300);const n1=await p.evaluate(()=>Object.keys(D.house.b).length);await p.click('#bU');const n2=await p.evaluate(()=>Object.keys(D.house.b).length);
 await p.screenshot({path:W+'/dist/shots/f4-build.png'});await p.click('#bX');await p.waitForTimeout(400);await p.click('#bExit');await p.waitForTimeout(400);
 const r3=await p.evaluate(()=>document.querySelector('#home .pill').textContent);
 console.log(JSON.stringify({r1,act,r2,n0,n1,n2,homePill:r3}),'\n',errs.join('\n')||'no errors');await b.close()})();
