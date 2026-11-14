import * as L from './lib.mjs';
const i=+process.argv[2]; const re=new RegExp(process.argv[3],'i'); let n=0;
for(const p of L.LINES[i].prints){ const f=L.facts(p.town); const s=L.sec(L.page(p.town),'Systems/Defense').split('\n'); const a=s.findIndex(x=>/^Guard assessment/.test(x)); const post=s[a+2]||''; const hit=re.test(post);
 if(hit){n++; console.log(p.town, f.crisis.types.join('+')||'none', 'stores='+f.stores, '|', post.slice(0,200));}}
console.log('hits',n,'of',L.LINES[i].prints.length);
