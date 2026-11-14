const L=JSON.parse(require('fs').readFileSync('/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers/lines-7.json'));
const i=+process.argv[2];const f=process.argv[3]||'';
for(const p of L[i].prints){const s=p.tier+' '+p.stress.join('+');if(f&&!new RegExp(f).test(s+' '+p.town))continue;console.log(p.town,'|',p.tier,p.pop,'|',p.stress.join('+')||'calm','|',(p.page[0]||{}).printed);}
