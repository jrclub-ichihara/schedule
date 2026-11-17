const fs=require('fs'),W=process.argv[2];
const L=fs.readFileSync(W+'/src/base.html','utf8').split('\n');const helpers=L.slice(295,345).join('\n');
const src=helpers+'\n'+fs.readFileSync(W+'/src/u_data1.js','utf8')+fs.readFileSync(W+'/src/u_data2.js','utf8')+fs.readFileSync(W+'/src/u_logic.js','utf8')+';return RU';
const RU=new Function(src)();let bad=0,nq=0,nu=0;
for(const [s,R] of Object.entries(RU))for(const u of R.u){nu++;
 if(u.q){for(const q of u.q){nq++;const[a,...ws]=[q[1],q[2],q[3],q[4]];if(q.length<5||new Set([q[1],q[2],q[3],q[4]]).size!==4||q.some((x,i)=>i<5&&!x)){bad++;console.log('DATA',u.id,q[0])}}}
 else for(const g of u.gen)for(let i=0;i<300;i++){const r=g();const[qq,a,ws,e]=r;const all=[a,...(ws||[]).slice(0,3)];
  if(!ws||ws.length<3||new Set(all).size!==4||all.concat([qq]).some(x=>typeof x!=='string'||/NaN|undefined|Infinity|null/.test(x))){bad++;if(bad<15)console.log('GEN',u.id,JSON.stringify(r));break}}}
console.log('units',nu,'written questions',nq,'problems',bad);
