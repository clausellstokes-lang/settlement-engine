// r1lords.mjs <rows.ndjson.gz>... (births4305x rows): R1 — on every lord or claimant minted at the seam (kind 'power', title
// "the lord"): an OFFICE line (a government template's position or constraint) and a governing-side debt row ("Financial
// Dependence" with the lord as its first end, the gov_econ_dependence pool's government side).
import fs from 'node:fs'; import zlib from 'node:zlib';
const OFFICE=/\boffice\b|^Holds the seat|Good work is expected|Every office is after|Waiting to see who wins keeps the office|Being seen to work hard while the food|Any honest inquiry needs|Moving to protect the office/i;
const R={births:0,lords:0,cats:{},officeLines:0,govSide:0,towns:new Set(),ex:[]};
for (const f of process.argv.slice(2)) for (const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) { if(!l) continue; const r=JSON.parse(l); R.births++;
  const lords=r.npcs.filter(p=>p.ik==='power'&&p.title==='the lord'); const ids=new Set(lords.map(p=>p.id));
  for(const p of lords){ R.lords++; R.cats[p.cat]=(R.cats[p.cat]||0)+1; for(const t of [p.sp,p.ac]) if(t&&OFFICE.test(t)){ R.officeLines++; R.towns.add(r.key); if(R.ex.length<8) R.ex.push(`${r.key} ${p.name}: ${t}`);} }
  for(const x of r.rel) if(x[3]==='Financial Dependence'&&ids.has(x[0])){ R.govSide++; R.towns.add(r.key); if(R.ex.length<8) R.ex.push(`${r.key}: ${x[6]}`); } }
R.towns=R.towns.size; console.log(JSON.stringify(R,null,1));
