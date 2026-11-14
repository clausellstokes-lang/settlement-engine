// tcmp.js: the printed Tonight sheets (surf-tip/<seed>.tonight.txt) against scan.jsonl's composition
const fs=require('fs'); const D='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/out/surf-tip';
const L=new Map(fs.readFileSync('scan.jsonl','utf8').trim().split('\n').map(l=>{const x=JSON.parse(l);return [x.seed,x];}));
let n=0,diff=0; const ex=[];
for(const f of fs.readdirSync(D)){ if(!f.endsWith('.tonight.txt')) continue; const seed=f.replace('.tonight.txt',''); const t=JSON.parse(fs.readFileSync(D+'/'+f,'utf8')); const x=L.get(seed); n++;
  const a=JSON.stringify([t.people.map(p=>[p.name,p.role,p.castLabel,p.line,p.says]),t.facts]); const b=JSON.stringify([x.tonight.people.map(p=>[p.name,p.role,p.castLabel,p.line,p.says]),x.tonight.facts]);
  if(a!==b){diff++; ex.length<3&&ex.push(seed+'\n  '+a.slice(0,300)+'\n  '+b.slice(0,300));} }
console.log('tonight files',n,'differ',diff); console.log(ex.join('\n'));
