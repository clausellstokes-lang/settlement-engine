const fs=require('fs'); const rd=(f)=>{ const j=JSON.parse(fs.readFileSync(f)); const m=new Map(); for(const r of j.testResults) for(const a of r.assertionResults) m.set(r.name.split('/tests/')[1]+' :: '+a.fullName, a.status); return m; };
const A=rd(process.argv[2]), B=rd(process.argv[3]); let same=0; const out=[];
for(const [k,v] of B){ const a=A.get(k); if(a===v){ same++; if(v==='failed') out.push('  carried red: '+k.slice(0,150)); continue;} out.push(`  ${a||'(new)'} -> ${v}: ${k.slice(0,170)}`); }
for(const [k,v] of A) if(!B.has(k)) out.push(`  ${v} -> (gone): ${k.slice(0,170)}`);
console.log(`titles ${B.size}; identical ${same}`); console.log(out.join('\n'));
