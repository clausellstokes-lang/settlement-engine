// cooc.mjs <desk.jsonl> <kA> <rxA> <kB> <rxB>: towns where lens kA matches rxA AND lens kB matches rxB.
import fs from 'node:fs'; const [f,ka,ra,kb,rb]=process.argv.slice(2); const A=new RegExp(ra),B=new RegExp(rb); const hit=[];
for(const o of fs.readFileSync(f,'utf8').trim().split('\n').map(JSON.parse)){ const a=o.lines?.[ka]?.sentence, b=o.lines?.[kb]?.sentence; if(a&&b&&A.test(a)&&B.test(b)) hit.push(o.seed); }
console.log(hit.length, hit.slice(0,8).join(' '));
