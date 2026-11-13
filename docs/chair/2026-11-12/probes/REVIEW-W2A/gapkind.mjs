import fs from 'node:fs';
const {town}=await import(process.env.S+'/tools/probe2.mjs');
const C=process.env.S+'/cold'; const out={};
for(const seed of fs.readFileSync(C+'/seeds40.txt','utf8').trim().split('\n')){
  const b=fs.readFileSync(`${C}/base/dumps/${seed}.txt`,'utf8').split('\n'), t=new Set(fs.readFileSync(`${C}/tip/dumps/${seed}.txt`,'utf8').split('\n'));
  const removed=b.filter(l=>/^No .* reach(es)? the .*\.$/.test(l)&&!t.has(l)); if(!removed.length) continue;
  const rec=town(seed); const gaps=(rec.resourceAnalysis?.gaps||[]).filter(g=>g.institution); const pi=(rec.economicState.primaryImports||[]).join(' | ').toLowerCase(); const crit=rec.resourceAnalysis?.imports?.critical||[];
  for(const l of removed){ const house=l.match(/reach(?:es)? the (.+)\.$/)[1]; const gs=gaps.filter(g=>g.institution.toLowerCase().startsWith(house.split(' ')[0].slice(0,5)));
    const kinds=gs.map(g=>`${g.chain}:${g.kind}`).join(','); const good=l.match(/^No (.+?) reach/)[1];
    const inPI=good.split(/, | or /).some(n=>pi.includes(n.split(' ')[0])); const inCrit=crit.some(c=>good.split(/, | or /).some(n=>c.includes(n.split(' ')[0])));
    const k=`${good}→${house} | gapkinds=${kinds} | inPrimaryImports=${inPI} | inCritical=${inCrit}`; out[k]=(out[k]||0)+1; }
}
for(const [k,n] of Object.entries(out).sort((a,b)=>b[1]-a[1])) console.log(n,k);
