// BAR6-AUDIT-C · the overlap with the round in flight: each instance of laws 6 and 7 that sits on a line or a fact a BAR5 seat names.
//   node overlapC.cjs <runC-result.json> ...
const fs=require('fs');
const seat=(x)=>{
 if(/^6a-size/.test(x.rule)) return /neighbou?rhood|district|quarter/i.test(x.line)?'BAR5-THINGS (e) quarters words':null;
 if(/^6b-(denied|nomaker|out)/.test(x.rule)) return /fired clay|Kiln smoke/i.test(x.line)?'BAR5-THINGS (d) kilns':null;
 if(x.rule==='6c-arms') return (x.earlier.length||/gaps/.test(x.against.line))?'BAR5-CHAINS (c) outputs against the gap':null;
 if(x.rule==='6c-halfway') return 'BAR5-CHAINS (a) the finisher by trade';
 if(x.rule==='6c-unworked') return 'BAR5-CHAINS (c) chain state (its file validationOnPage.js)';
 if(x.rule==='6d-force') return 'BAR5-POWERS (b) the force line reads the roster';
 if(x.rule==='6d-blurb') return 'BAR5-POWERS (a) the description drawn from the final power';
 if(x.rule==='6d-court') return 'BAR5-THINGS (e) court words';
 if(x.rule==='6e-sovereign') return /lord's dues/.test(x.line)?'BAR5-MARKS by name':'BAR5-THINGS (e) lord words';
 if(x.rule==='7c-plenty') return /tables|hungry/.test(x.line)?'BAR5-FOOD (c) the page\'s food word':null;
 return null;};
for(const f of process.argv.slice(2)){const xs=JSON.parse(fs.readFileSync(f));const m={};for(const x of xs){if(/-w$|^7w/.test(x.rule))continue;const r=x.rule;m[r]||={n:0,held:0,by:{}};m[r].n++;const s=seat(x);if(s){m[r].held++;m[r].by[s]=(m[r].by[s]||0)+1}}
 let tn=0,th=0;console.log('##',f.split('/').pop());for(const[r,v]of Object.entries(m).sort()){tn+=v.n;th+=v.held;console.log(r,v.n,'held',v.held,JSON.stringify(v.by))}console.log('TOTAL',tn,'held',th)}
