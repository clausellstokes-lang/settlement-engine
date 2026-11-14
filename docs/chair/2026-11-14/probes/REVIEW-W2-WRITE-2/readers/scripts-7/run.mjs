// usage: node run.mjs <lineIdx> <checkfile.mjs>   check exports default (t,p,ctx)=>({ok:bool,why:string})
import fs from 'fs'; import z from 'zlib';
const S='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad';
const L=JSON.parse(fs.readFileSync(S+'/readers/lines-7.json'));
const coup=await import(S+'/wt/tip/src/domain/rulingPowerCoup.js');
const i=+process.argv[2]; const chk=(await import(process.argv[3])).default;
let tr=0,fa=0;const ft=[];
for(const p of L[i].prints){const t=JSON.parse(z.gunzipSync(fs.readFileSync(`${S}/r/tip/records/${p.town}.json.gz`)));
 const page=fs.readFileSync(`${S}/r/tip/dumps/${p.town}.txt`,'utf8');
 let r;try{r=chk(t,p,{coup,page});}catch(e){r={ok:false,why:'ERR '+e.message};}
 if(r.ok)tr++;else{fa++;ft.push(p.town);} if(!r.ok||process.env.V)console.log(r.ok?'T':'F',p.town,p.tier,p.stress.join('+'),'|',r.why);}
console.log(`TRUE ${tr} FALSE ${fa}`);console.log(JSON.stringify(ft));
