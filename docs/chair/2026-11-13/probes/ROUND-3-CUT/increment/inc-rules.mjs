// ROUND-3-CUT increment: composed rows whose flattened shape the traced forms do not match: by tab and shape, to the
// writer the cut traced for the same row (traced forms S6, S17, S18, S31, S19, S78, NPCInlineCard, ConflictCard), or
// to the tab's component (PLAUSIBLE). node inc-rules.mjs <ww-w.json> <pf-w.json>
import fs from 'node:fs';
const T='src/components/new/tabs/', N='src/components/new/';
const RULES=[
 [/Systems\/Power/,/^Breakdown\b/,T+'PowerTab.jsx','PowerTab','traced form S6 (the legitimacy breakdown)'],
 [/Systems\/Power/,/^(The power|Contender)|^↳\d+ members/,T+'power/PowerStrata.jsx','ThePowers','traced form S17 family (PLAUSIBLE)'],
 [/Systems\/Power/,/fronts for .*handled by|handled by .*\(/,T+'WhoRunsThisTownPanel.jsx','WhoRunsThisTownPanel','traced form S78 family'],
 [/World\/History/,/(minor|major)(major|catastrophic)$/,T+'HistoryTab.jsx','TensionRow','traced form S18'],
 [/World\/History/,/^Founded by:/,T+'HistoryTab.jsx','HistoryTab (the founding row)','traced by hand (cut #488)'],
 [/Systems\/Economics/,/(Food security|Raw materials|Religion & civic|Service)[^ ]*(✓|○)/,T+'EconomicsTab.jsx','EconomicFlowsSection','traced form S19 family'],
 [/Systems\/Economics/,/^Production: .*Need:/,T+'EconomicsTab.jsx','EconomicsTab (the food balance row)','PLAUSIBLE'],
 [/Systems\/Economics/,/^Needs imported .*: no local source|^Upstream .* chain is impaired/,'src/generators/computeActiveChains.js','computeActiveChains','as cut #796'],
 [/Systems\/Economics/,/[a-z][A-Z]|^[a-z][a-z ]+[a-z]{3,}[a-z]+$/,T+'EconomicsTab.jsx','EconomicsTab (the goods pills)','traced form S31 family'],
 [/Systems\/Economics/,/^[A-Z][\w'’ ]+$/,T+'EconomicsTab.jsx','EconomicFlowsSection (a house name)','PLAUSIBLE'],
 [/World\/NPCs/,/./,N+'npcComponents.jsx','NPCInlineCard','traced form S1 family (PLAUSIBLE for a bare role word)'],
 [/World\/Relationships/,/tension|·/,N+'npcComponents.jsx','ConflictCard / the relationship row','as cut #389 (PLAUSIBLE)'],
 [/Table\/Tonight/,/./,'src/domain/summary/tonightSheet.js','composeTonightSheet','PLAUSIBLE (the Tonight sheet)'],
 [/Summary\/Overview/,/./,T+'OverviewTab.jsx','OverviewTab','PLAUSIBLE'],
 [/Systems\/Magic/,/./,T+'MagicTab.jsx','MagicTab','as cut #1086'],
];
let n=0; for(const f of process.argv.slice(2)){ const W=JSON.parse(fs.readFileSync(f,'utf8')); for(const x of W){ if(x.writer) continue; const r=RULES.find(([t,re])=>t.test(x.tab)&&re.test(x.sentence)); if(r){ x.writer={file:r[2],fn:r[3],evidence:'form rule: '+r[4]}; n++; } } fs.writeFileSync(f,JSON.stringify(W,null,1)); console.log(f.split('/').pop(),'still none:',W.filter(x=>!x.writer).map(x=>x.list+'#'+x.i+' '+x.tab+' | '+x.sentence.slice(0,50)).join(' || ')); }
console.log('assigned',n);
