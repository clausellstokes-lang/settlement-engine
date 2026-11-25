#!/usr/bin/env node
/**
 * D6 MEASURE (WORDS-1; intake item 11; SCOPE-LINE decision 2): on a plan (C or V), the places whose Power tab prints a
 * contender, and those whose contender is the ruler's own bargain partner in the web. A MEASURE: it changes nothing.
 * The method is CLOSE-2's `contender/measure.mjs` (lane/close-2-2026-11-22) over a plan file instead of its own seeds:
 * what the tab prints (`derivePowerStrata` → `powers`, role 'contender') against the typed ties
 * (`powerStructure.factionRelationships`) between the printed ruler and each contender.
 *   N (narrow, "dependent or partner"): dependent, symbiotic.   W (wide): N + subordinate.
 * Usage: node d6-measure.mjs <tree> <plan.json> <out.json>
 * Writes per seed: { seed, size, ruler, contenders: [{ name, ties: [type…] }] }; prints the counts by size.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [T, PLAN, OUT] = process.argv.slice(2);
const { generateSettlementPipeline } = await import(`${T}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${T}/src/domain/density/densityCreateBoundary.js`);
const { derivePowerStrata } = await import(`${T}/src/domain/dossier/powerStrata.js`);
await loadGenerationLawPayloads();
const NARROW = new Set(['dependent', 'symbiotic']);
const WIDE = new Set(['subordinate', 'dependent', 'symbiotic']);
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

const plan = JSON.parse(readFileSync(PLAN, 'utf8'));
const rows = []; const by = {};
for (const p of plan) {
  const s = generateSettlementPipeline(birthConfig(p.config), null, { seed: p.seed, customContent: {} });
  const ps = s.powerStructure || {};
  const rels = Array.isArray(ps.factionRelationships) ? ps.factionRelationships : [];
  const { powers } = derivePowerStrata(s);
  const ruler = powers.find((x) => x.role === 'ruler');
  const contenders = powers.filter((x) => x.role === 'contender');
  const R = ruler?.name || '';
  const tiesWith = (o) => rels.filter((r) => Array.isArray(r?.pair) && r.pair.includes(R) && r.pair.includes(o) && r.pair[0] !== r.pair[1]).map((r) => r.type);
  const row = { seed: p.seed, size: p.size, ruler: R, contenders: contenders.map((c) => ({ name: c.name, ties: tiesWith(c.name) })) };
  rows.push(row);
  const b = (by[p.size] ||= { n: 0, withC: 0, firstN: 0, firstW: 0, anyN: 0, anyW: 0, cardsN: 0, cardsW: 0 });
  b.n++;
  if (!row.contenders.length) continue;
  b.withC++;
  const inN = (c) => c.ties.some((t) => NARROW.has(t)); const inW = (c) => c.ties.some((t) => WIDE.has(t));
  b.firstN += +inN(row.contenders[0]); b.firstW += +inW(row.contenders[0]);
  b.anyN += +row.contenders.some(inN); b.anyW += +row.contenders.some(inW);
  b.cardsN += row.contenders.filter(inN).length; b.cardsW += row.contenders.filter(inW).length;
}
writeFileSync(OUT, JSON.stringify(rows));
const tot = {};
console.log('size        n  withC  firstN firstW  anyN  anyW  cardsN cardsW');
for (const z of SIZES) {
  const b = by[z] || {}; for (const [k, v] of Object.entries(b)) tot[k] = (tot[k] || 0) + v;
  console.log(`${z.padEnd(10)} ${[b.n, b.withC, b.firstN, b.firstW, b.anyN, b.anyW, b.cardsN, b.cardsW].map((v) => String(v ?? 0).padStart(6)).join('')}`);
}
console.log(`${'all'.padEnd(10)} ${[tot.n, tot.withC, tot.firstN, tot.firstW, tot.anyN, tot.anyW, tot.cardsN, tot.cardsW].map((v) => String(v ?? 0).padStart(6)).join('')}`);
