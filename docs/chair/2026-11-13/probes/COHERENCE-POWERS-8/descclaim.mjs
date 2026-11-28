// descclaim.mjs <corpus...>: a power's description that claims a high standing ("Dominant commercial class", "hold direct
// temporal power", "substantial political leverage", "genuine political weight", "Significant military presence", ...)
// beside a FINAL label of Minor or Suppressed (the label the page prints beside it).
import { recs } from './rd.mjs';
const CLAIM=[/^International merchant houses controlling/,/^Dominant commercial class/,/^Church institutions hold direct temporal power/,/^Church holds substantial temporal power/,/^Standing army with genuine political weight/,/^Significant military (?:force|presence)/,/^Arcane institutions hold substantial political leverage/,/^Wizard towers and mage guilds hold genuine political weight/,/^Underworld effectively controls/,/^Criminal organisations have captured significant influence/,/^Major church institutions hold structural influence/,/^Hereditary landowners whose land rights and military obligations are structurally embedded/,/^Landed noble families whose hereditary rights/,/^Well-organised craft guilds with established trade monopolies/];
const R={towns:0,townsHit:0,rows:0,byClaim:{},byLabel:{},ex:[]};
for (const f of process.argv.slice(2)) for await (const {seed,s} of recs(f)) { R.towns++; let hit=false;
  for (const p of s.powerStructure?.factions||[]) { const d=String(p.desc||''); const c=CLAIM.find(re=>re.test(d)); if(!c) continue;
    if(!/^(Minor|Suppressed)$/.test(p.powerLabel)) continue; R.rows++; hit=true; const k=c.source.slice(1,40); R.byClaim[k]=(R.byClaim[k]||0)+1; R.byLabel[p.powerLabel]=(R.byLabel[p.powerLabel]||0)+1; if(R.ex.length<4) R.ex.push(`${seed} ${p.faction} ${p.power} ${p.powerLabel}: ${d.slice(0,80)}`); }
  if(hit) R.townsHit++; }
console.log(JSON.stringify(R,null,1));
