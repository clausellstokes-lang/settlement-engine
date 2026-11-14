// rows.mjs <dumpdir> <seed...>: the rows a reader of this cure reads, quoted from the rendered page: the Defense tab's
// posture block and threat rows (to Internal Security), its force row, every line naming a crisis banner, and the
// Plot Hooks/Tonight lines carrying an event label.
import fs from 'node:fs';
const [dir,...seeds]=process.argv.slice(2);
for(const s of seeds){ const t=fs.readFileSync(`${dir}/${s}.txt`,'utf8').split('\n'); console.log(`######## ${s}`);
  let sec=''; let inDef=false, n=0, stop=false;
  for(const l of t){ if(l.startsWith('== ')){ sec=l; inDef=/Defense ==/.test(l); n=0; stop=false; continue; }
    if(inDef){ n++; if(/^Internal Security$|^Economic Survival$/.test(l)) stop=true; if((!stop&&!/^Each bar shows|^Threat Assessment$|^Guard assessment$|^Defensive posture$/.test(l)) || /keeps a watch/.test(l)) console.log('  [Def] '+l.slice(0,300)); }
    if(/occupiers|besieg|under siege|famine/i.test(l) && /Overview|Defense/.test(sec) && !inDef) console.log('  ['+sec.replace(/==/g,'').trim()+'] '+l.slice(0,220));
    if(/Occupation Legacy|Infiltration Fear|Exile & Return|Occupation Event/.test(l)) console.log('  ['+sec.replace(/==/g,'').trim()+'] '+l.slice(0,220)); } }
