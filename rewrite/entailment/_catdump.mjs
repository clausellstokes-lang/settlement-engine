import { institutionalCatalog } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneRW-DEFW/src/data/institutionalCatalog.js';
for (const [tier, cats] of Object.entries(institutionalCatalog)) {
  for (const [cat, rows] of Object.entries(cats)) {
    for (const [name, r] of Object.entries(rows)) {
      console.log(`${tier}\t${cat}\t${name}\treq=${r.required?1:0}\tbc=${r.baseChance ?? '-'}\txg=${r.exclusiveGroup ?? '-'}${r.exclusiveGroupCoexists?'(coexist)':''}\tmin=${r.minTier??'-'}\tex=${(r.exclusionConditions||[]).join('|')||'-'}\t${r.desc ?? ''}`);
    }
  }
}
