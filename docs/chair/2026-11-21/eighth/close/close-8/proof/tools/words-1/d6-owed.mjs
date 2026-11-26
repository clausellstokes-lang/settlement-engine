#!/usr/bin/env node
/**
 * D6 OWED COUNT (WORDS-1; the chair's G7 of 2026-11-25): on a plan and a tree, the contender cards that KEEP "Contender" /
 * "Contests the seat" (not bound to the ruler) and hold a RECORDED CONFLICT with the holder: a conflict of the record
 * (`powerStructure.conflicts`, else `conflicts`) whose two parties are the contender and the printed ruler (or the form whose
 * seat it holds, `seatOf`). Also counted: the bound cards ("Could contend") that hold such a conflict. The bound verdict is
 * read from the raw `factionRelationships` (dependent, symbiotic, subordinate), never the strata's own flag; the strata's
 * flag is compared with it (disagreements printed). A MEASURE: it changes nothing.
 * Usage: node d6-owed.mjs <tree> <plan.json>
 */
import { readFileSync } from 'node:fs';

const [T, PLAN] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { derivePowerStrata } = await import(`${T}/src/domain/dossier/powerStrata.js`);
await loadGenerationLawPayloads();
const BOUND = new Set(['dependent', 'symbiotic', 'subordinate']);
const plan = JSON.parse(readFileSync(PLAN, 'utf8'));
const c = { pagesWithContender: 0, cards: 0, bound: 0, free: 0, freeConflict: 0, freeConflictPlaces: new Set(), boundConflict: 0, boundConflictPlaces: new Set(), pagesBound: new Set(), flagDisagree: [] };
const ex = [];
for (const p of plan) {
  const s = generateSettlementPipeline(birthConfig(p.config), null, { seed: p.seed, customContent: {} });
  const ps = s.powerStructure || {};
  const rels = Array.isArray(ps.factionRelationships) ? ps.factionRelationships : [];
  const conflicts = Array.isArray(ps.conflicts) ? ps.conflicts : Array.isArray(s.conflicts) ? s.conflicts : [];
  const { powers } = derivePowerStrata(s);
  const ruler = powers.find((x) => x.role === 'ruler');
  const RS = [ruler?.name, ruler?.seatOf].filter(Boolean);
  const contenders = powers.filter((x) => x.role === 'contender');
  if (contenders.length) c.pagesWithContender++;
  for (const k of contenders) {
    c.cards++;
    const bound = rels.some((r) => Array.isArray(r?.pair) && r.pair[0] !== r.pair[1] && r.pair.includes(k.name) && RS.some((x) => r.pair.includes(x)) && BOUND.has(r.type));
    if (bound !== !!k.bound) c.flagDisagree.push(`${p.seed} ${k.name}: record ${bound}, strata ${!!k.bound}`);
    const quarrel = conflicts.find((q) => Array.isArray(q?.parties) && q.parties.includes(k.name) && RS.some((x) => q.parties.includes(x)));
    if (bound) { c.bound++; c.pagesBound.add(p.seed); if (quarrel) { c.boundConflict++; c.boundConflictPlaces.add(p.seed); } }
    else {
      c.free++;
      if (quarrel) { c.freeConflict++; c.freeConflictPlaces.add(p.seed); if (ex.length < 3) ex.push(`${p.seed}: ${k.name} vs ${RS.join('/')} — ${quarrel.intensity || ''} ${quarrel.issue || ''}`); }
    }
  }
}
console.log(`d6-owed ${T} ${PLAN}: births ${plan.length}; pages with a contender ${c.pagesWithContender}; contender cards ${c.cards}`);
console.log(`  bound ("Could contend") ${c.bound} cards on ${c.pagesBound.size} pages, of which with a recorded conflict with the holder ${c.boundConflict} (${c.boundConflictPlaces.size} pages)`);
console.log(`  free ("Contender") ${c.free} cards, of which with a recorded conflict with the holder ${c.freeConflict} (${c.freeConflictPlaces.size} pages)  ← THE OWED COUNT`);
console.log(`  strata flag vs record oracle disagreements: ${c.flagDisagree.length}`);
for (const d of c.flagDisagree.slice(0, 5)) console.log(`    ${d}`);
for (const e of ex) console.log(`  e.g. ${e}`);
