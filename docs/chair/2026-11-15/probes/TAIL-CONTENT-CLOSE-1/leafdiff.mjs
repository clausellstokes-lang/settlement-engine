import fs from 'node:fs';
const [a,b]=process.argv.slice(2).map(f=>JSON.parse(fs.readFileSync(f,'utf8')));
let n=0, moved=[], nonstr=0, keys=0;
const walk=(x,y,p)=>{ if (x&&y&&typeof x==='object'&&typeof y==='object'){ const ks=new Set([...Object.keys(x),...Object.keys(y)]); for(const k of ks){ if(!(k in x)||!(k in y)){keys++;moved.push(p+'.'+k+' (key)');continue;} walk(x[k],y[k],p+'.'+k);} return;} n++; if(x!==y){ if(typeof x!=='string'||typeof y!=='string') nonstr++; moved.push(p.replace(/\.\d+/g,'[]')+' :: '+JSON.stringify(x)?.slice(0,90)+' -> '+JSON.stringify(y)?.slice(0,90)); } };
walk(a,b,'');
console.log('leaves',n,'moved',moved.length,'nonstring',nonstr,'keys',keys);
const c={}; for(const m of moved){const k=m.split(' :: ')[0]; c[k]=(c[k]||0)+1;} console.log(c); console.log(moved.slice(0,3).join('\n'));
