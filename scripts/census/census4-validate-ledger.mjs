// CENSUS-4 phase A: the declaration ledger against the pools (census4-extract-pools.mjs output) and
// the atom words of docs/census/declarations/VOCABULARY.md. Prints per-pool counts, the atom
// histogram and every violation (BAD n).
import fs from 'node:fs';
const D = new URL('../../docs/census/declarations/', import.meta.url).pathname, RAW = process.argv[2];
const PRES=['walls','palisade','gate','watch','militia','garrison','hospital','healer','market','water','coast','river','other-npc','magic','famine','crime'];
const KINDS=['hospital','healer','monastery','mill','smith','bathhouse','docks','quarry','mine','tavern','school','temple','granary','guild'];
const VAL={ruler:['elder','lord','priest','mayor','occupier','council'],migration:['influx','exodus'],war:['front','aggressor','at war','peace'],population:['small','middling','large'],terrain:['plains','hills','forest','riverside','coastal','mountain','desert']};
const CK='under_siege famine occupied politically_fractured indebted recently_betrayed infiltrated plague_onset succession_void monster_pressure insurgency religious_conversion slave_revolt wartime mass_migration'.split(' ');
const FAM=['threat','hunger','succession','unrest','any'];
const TIERS=['thorp','hamlet','village','town','city','metropolis'];
const ok=(a)=>{ if(PRES.includes(a)) return true; let m=a.match(/^institution: (.+)$/); if(m) return KINDS.includes(m[1]); m=a.match(/^(ruler|migration|war|population|terrain): (.+)$/); if(m) return m[2].split(', ').every(v=>VAL[m[1]].includes(v)); m=a.match(/^tier: (>=|<=|=) (\w+)$/); if(m) return TIERS.includes(m[2]); if(/^stores: [<>]=? \d+$/.test(a)) return true; if(CK.includes(a)||FAM.includes(a)) return true; return false; };
const hist={}, bad=[]; let lines=0, declaring=0, colourPools=[], scoped=[], files=0, pend={guild:0,crime:0,tier:0};
const sum=[];
for (const f of fs.readdirSync(D).filter(f=>f.endsWith('.json'))) {
  files++; const j=JSON.parse(fs.readFileSync(D+f)); const id=f.replace(/\.json$/,'');
  const raw=JSON.parse(fs.readFileSync(RAW+id+'.json')).rows;
  if (raw.length!==j.rows.length) bad.push(`${id}: rows ${j.rows.length} vs raw ${raw.length}`);
  raw.forEach((r,i)=>{ if(j.rows[i]?.id!==r.id||j.rows[i]?.text!==r.text) bad.push(`${id}: row ${i} id/text mismatch`); });
  if (j.pool?.id!==id) bad.push(`${id}: pool.id ${j.pool?.id}`);
  for (const atoms of Object.values(j.pool.keyDeclares||{})) for (const a of atoms) if(!ok(a)) bad.push(`${id}: keyDeclares atom '${a}'`);
  let d=0;
  for (const r of j.rows) {
    for (const k of ['needs','excludes']) { if(!Array.isArray(r[k])) bad.push(`${id}:${r.id} ${k} not array`); for (const a of r[k]||[]) { if(!ok(a)) bad.push(`${id}:${r.id} atom '${a}'`); hist[a]=(hist[a]||0)+1; if(a==='institution: guild')pend.guild++; if(a==='crime')pend.crime++; if(a.startsWith('tier'))pend.tier++; } }
    const c=r.crisis; if(!(c==='calm'||c==='any'||Array.isArray(c))) bad.push(`${id}:${r.id} crisis ${JSON.stringify(c)}`); if(Array.isArray(c)) for(const a of c){ if(!CK.includes(a)&&!FAM.includes(a)) bad.push(`${id}:${r.id} crisis atom ${a}`); hist['crisis:'+a]=(hist['crisis:'+a]||0)+1;} else hist['crisis:'+c]=(hist['crisis:'+c]||0)+1;
    const dec=(r.needs?.length||0)+(r.excludes?.length||0)+((c==='calm'||c==='any'||c?.length)?1:0)>0; if(dec) d++;
    if (dec && r.colour) bad.push(`${id}:${r.id} colour but declares`);
  }
  if (j.pool.declaring!==d) bad.push(`${id}: pool.declaring ${j.pool.declaring} vs ${d}`);
  lines+=j.rows.length; declaring+=d; if(j.pool.colour) colourPools.push(id); if(j.pool.crisisScoped) scoped.push(id);
  sum.push([id, j.pool.drawKind, j.rows.length, d, j.rows.filter(r=>r.colour).length]);
}
for (const s of sum) console.log(s.join('\t'));
console.log({files,lines,declaring,colourPools:colourPools.length,scoped,pend});
console.log(Object.entries(hist).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k} ${v}`).join(' · '));
console.log('BAD', bad.length, bad.slice(0,40));
