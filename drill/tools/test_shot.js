const {chromium}=require('playwright');
(async()=>{const W=process.argv[2];const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 const errs=[];const out=W+'/dist/shots/';require('fs').mkdirSync(out,{recursive:true});
 for(const [name,vp,touch] of [['pc',{width:1280,height:800},false],['sp',{width:390,height:844},true]]){
 const c=await b.newContext({viewport:vp,hasTouch:touch,isMobile:touch,deviceScaleFactor:1});const p=await c.newPage();
 p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(name+': '+m.text())});p.on('pageerror',e=>errs.push(name+' PAGEERR: '+e.message));
 await p.addInitScript(()=>{if(!localStorage.getItem('sougei_drill_v1'))localStorage.setItem('sougei_drill_v1',JSON.stringify({v:1,unlocked:true,name:'けい',act:'basket',settings:{sound:false,grade:'中1',subj:'en'},vocab:{},hist:[],practice:[],badges:{},coins:120,w3seen2:true,created:'2026-11-01'}))});
 await p.goto('file://'+W+'/dist/world_test.html');await p.waitForTimeout(800);await p.screenshot({path:out+name+'-1home.png',fullPage:false});
 await p.click('#hW');await p.waitForTimeout(2500);await p.screenshot({path:out+name+'-2world.png'});
 // walk a bit
 if(!touch){await p.keyboard.down('KeyW');await p.waitForTimeout(900);await p.keyboard.up('KeyW');await p.waitForTimeout(400);await p.screenshot({path:out+name+'-3walk.png'})}
 await p.click('#bShop');await p.waitForTimeout(1500);await p.screenshot({path:out+name+'-4shop.png'});
 await p.click('.it:nth-child(2)');await p.waitForTimeout(300);await p.click('.tab[data-t="1"]');await p.waitForTimeout(200);await p.click('.it:nth-child(4)');await p.waitForTimeout(400);await p.click('#buy');await p.waitForTimeout(900);await p.screenshot({path:out+name+'-5bought.png'});
 await p.click('#shX');await p.waitForTimeout(300);await p.click('#bHome');await p.waitForTimeout(1800);await p.screenshot({path:out+name+'-6build.png'});
 const box=await p.evaluate(()=>{const r=cv.getBoundingClientRect();return[r.width,r.height]});
 for(let i=0;i<5;i++){await p.mouse.click(box[0]*(.35+i*.05),box[1]*.35);await p.waitForTimeout(150)}
 await p.waitForTimeout(500);await p.screenshot({path:out+name+'-7placed.png'});
 await c.close()}
 await b.close();console.log(errs.slice(0,30).join('\n')||'no errors')})();
