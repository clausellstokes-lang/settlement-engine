import { DOSSIER_STATE_PROSE_POWER as L } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW/src/data/dossierStateProse/power.generated.js';
const re = /\b(watch|guard|army|office|writ|harvest|clerk|official|leader|ruler|operator|muster|soldier|men|council|court|market|granary|customs|gate|wall|table|workshop|clearinghouse|elder|reeve|mayor|priest|captain|magistrate|sheriff|constable|steward)s?\b/i;
let dm=0; const dmBlock={};
for (const [block,def] of Object.entries(L)) for (const [pool,p] of Object.entries(def.pools||{})) for (const v of (Array.isArray(p)?p:(p.variants||[]))) {
  const marks = v.marks||[]; if (marks.includes('dm-only')) { dm++; dmBlock[block]=(dmBlock[block]||0)+1; }
  const m = v.text.match(re); if (m) { const i=v.text.search(re); console.log(`${block} :: ${pool} v${v.vid} [${v.angle}${marks.length?' · '+marks.join(','):''}] <${m[1]}> …${v.text.slice(Math.max(0,i-60), i+50).replace(/\n/g,' ')}…`); }
}
console.log('dm-only total', dm, JSON.stringify(dmBlock));
