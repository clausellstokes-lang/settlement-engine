#!/usr/bin/env node
/**
 * E8 CHECK OVER EVERY BIRTH (WORDS-1). On a tree and a plan: every stored line of the hand-classed BOUND rows that the slot
 * covers must carry the bound card's own reflexive, read from the RAW RECORD (the card's `gender`): the wants (the card that
 * holds them) and the tie (its asked card, found by the name the line prints). THE ORACLE IS INDEPENDENT OF THE SLOT'S CODE:
 * the lines are found by their own words (`e8-classes.mjs`'s table), the person by the record. The BOUND rows the slot does
 * not cover yet are counted, not checked (named in the report).
 * Usage: node e8-check.mjs <tree> <plan.json>    exit 1 if any covered line disagrees.
 */
import { readFileSync } from 'node:fs';

const [T, PLAN] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
await loadGenerationLawPayloads();
const OWN = { male: 'himself', female: 'herself' };
const WANTS = [/^Find a patron among those who lead .+, and make (\w+) useful to them\.$/, /^Set the terms between .+ and .+ (\w+), and stop taking them from others\.$/];
const TIE = /^(.+?) has asked (.+?) for an introduction (.+?) would rather keep to (\w+)\.$/;
const plan = JSON.parse(readFileSync(PLAN, 'utf8'));
let checked = 0; const wrong = []; const placesChecked = new Set();
for (const p of plan) {
  const s = generateSettlementPipeline(birthConfig(p.config), null, { seed: p.seed, customContent: {} });
  const byName = new Map((s.npcs || []).map((c) => [c.name, c]));
  for (const c of s.npcs || []) for (const v of ['short', 'long']) for (const re of WANTS) {
    const m = re.exec(String(c.goal?.[v] ?? '')); if (!m) continue;
    checked++; placesChecked.add(p.seed);
    if (m[1] !== (OWN[c.gender] || 'themselves')) wrong.push(`${p.seed} ${c.name} (${c.gender}) goal.${v}: ${c.goal[v]}`);
  }
  for (const r of s.relationships || []) {
    const m = TIE.exec(String(r.tension ?? '')); if (!m) continue;
    const asked = byName.get(m[2]);
    checked++; placesChecked.add(p.seed);
    if (m[4] !== (OWN[asked?.gender] || 'themselves')) wrong.push(`${p.seed} tie (${m[2]}: ${asked?.gender}): ${r.tension}`);
  }
}
console.log(`e8-check ${T} ${PLAN}: births ${plan.length}; covered lines checked ${checked} in ${placesChecked.size} places; disagreeing ${wrong.length}`);
for (const w of wrong.slice(0, 10)) console.log(`  ${w}`);
process.exit(wrong.length ? 1 : 0);
