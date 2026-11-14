import fs from 'fs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const rows=fs.readFileSync('temps.txt','utf8').split('\n').slice(1).filter(Boolean).map(l=>l.split(' | '));
const only=process.argv[2]||'';
const shapes={}; let missing=0;
for(const [seed,tier,pop,name,role,kind,crises] of rows){
  if(only && !seed.startsWith(only)) continue;
  const f=`${S}/out/render-tip/dumps/${seed}.txt`; if(!fs.existsSync(f)){missing++;continue;}
  const L=fs.readFileSync(f,'utf8').split('\n');
  const npcAt=L.findIndex(l=>l==='== World/NPCs ==');
  const end=L.findIndex((l,i)=>i>npcAt&&l.startsWith('== '));
  const at=L.findIndex((l,i)=>i>npcAt&&i<end&&l.startsWith(name+'●'));
  let card=[]; if(at>=0){ for(let i=at;i<end;i++){ if(i>at && /●$/.test(L[i]) ) break; if(i>at && /\(\d+\)▲$/.test(L[i])) break; card.push(L[i]); } }
  const header=L.slice(npcAt+1,npcAt+5).join(' / ');
  const grp=L.slice(npcAt,at).reverse().find(l=>/\(\d+\)▲$/.test(l));
  const mentions=L.map((l,i)=>[i,l]).filter(([i,l])=>l.includes(name)).map(([i,l])=>{const sec=L.slice(0,i).reverse().find(x=>x.startsWith('== '));return sec+': '+l.slice(0,160);});
  const key=card.slice(1).join(' / ').replace(name,'<N>');
  shapes[key]=(shapes[key]||0)+1;
  console.log(`## ${seed} (${tier}, pop ${pop}) ${name} [${role}/${kind}] crises=${crises}\n  header: ${header}\n  group: ${grp}\n  card: ${card.join(' / ')}\n  mentions:\n    ${mentions.join('\n    ')}`);
}
console.error('missing',missing); console.error(shapes);
