import { DOSSIER_STATE_PROSE_POWER as L } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW/src/data/dossierStateProse/power.generated.js';
const words = ['hall','watch','wall','gate','granary','customs','market','clearinghouse','workshop','council','court','table','guard','garrison','militia','muster','clerk','official','ruler','operator','leader','captain','reeve','mayor','priest','headman','steward','magistrate','constable','sheriff','bailiff','elder','office','treasury','temple','church','shrine','guild','prison','gaol','house','bloc','combination','majority','interest','seat','chamber','assembly','crown','lord','king','duke','senate','tribunal','judge','jury','minute','roll','record','account','book','return','manifest','ledger','patron','sheriff','bench','assize','writ','charter','tax','toll','tithe','levy','harvest','soldier','men','army','war'];
let total=0; const counts={}; const varsWithBody=new Set(); const perBlock={};
const bodyWords=['hall','watch','wall','gate','granary','customs','market','clearinghouse','workshop','council','court','table','guard','garrison','militia'];
for (const [block,def] of Object.entries(L)) { for (const [pool,p] of Object.entries(def.pools||{})) { const vs = p.variants||p; for (let i=0;i<vs.length;i++){ const v=vs[i]; const t=(typeof v==='string'?v:v.text||v.t||JSON.stringify(v)).toLowerCase(); total++;
 for (const w of words){ const m=t.match(new RegExp('\\b'+w+'(s|es|\\b)','g')); if(m){counts[w]=(counts[w]||0)+m.length;} }
 if (bodyWords.some(w=>new RegExp('\\bthe '+w+'(s|es)?\\b').test(t))) varsWithBody.add(`${block}::${pool}#${i}`);
}}}
console.log('variants', total, 'withBodyWord', varsWithBody.size);
console.log(JSON.stringify(Object.fromEntries(Object.entries(counts).sort((a,b)=>b[1]-a[1]))));
const sample=Object.values(L)[0]; const pool=Object.values(sample.pools)[0]; console.log('shape', JSON.stringify(Array.isArray(pool)?pool[0]:pool).slice(0,300));
