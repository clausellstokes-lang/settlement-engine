/** @vitest-environment node */
/**
 * BATCH item 1 (B1(i), R24e (1)): the houses of every birth of a plan, with what the land says of each. Births each row
 * (`generateSettlementPipeline(config, null, { seed, customContent: {} })` after `loadGenerationLawPayloads()`, the page battery's
 * own birth) and writes per seed: the land (terrain, route, the native nearby resources), each house (name, source,
 * cascadeAdded), and, read on the CHECK tree (the batch tip, which holds `landWithholding.js`): whether the land withholds the house,
 * and for a cascade house the chain neighbours (two steps, `cascadeGenerator.js :: _buildCascadeMap`'s own reading of
 * `SUPPLY_CHAIN_NEEDS`) that stand on the roster.
 * Env: BB_TREE (births), BB_CHECK (the tree whose readers judge), BB_PLAN, BB_OUT (jsonl).
 */
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';

const TREE = String(process.env.BB_TREE); const CHECK = String(process.env.BB_CHECK || process.env.BB_TREE);
const PLAN = String(process.env.BB_PLAN); const OUT = String(process.env.BB_OUT);

test('houses of a plan, with the land', async () => {
  const pipe = await import(/* @vite-ignore */ `${TREE}/src/generators/generateSettlementPipeline.js`);
  const dens = await import(/* @vite-ignore */ `${TREE}/src/domain/density/densityCreateBoundary.js`);
  const { landWithholdsHouse } = await import(/* @vite-ignore */ `${CHECK}/src/domain/landWithholding.js`);
  const { nativeSemanticResourceKeys } = await import(/* @vite-ignore */ `${CHECK}/src/domain/content/customContentSemanticAuthority.js`);
  const { SUPPLY_CHAIN_NEEDS } = await import(/* @vite-ignore */ `${CHECK}/src/data/goods/chains.js`);
  await dens.loadGenerationLawPayloads();
  // the cascade's neighbour map, read as `_buildCascadeMap` reads it (match key: lower case, first 16 characters; two steps)
  const mk = (n) => String(n).toLowerCase().slice(0, 16);
  /** @type {Map<string, Set<string>>} */ const near = new Map();
  for (const need of Object.values(SUPPLY_CHAIN_NEEDS)) for (const chain of need.chains || []) {
    const procs = chain.processingInstitutions || []; if (procs.length < 2) continue;
    procs.forEach((p, i) => { for (let d = 1; d <= 2; d++) for (const j of [i - d, i + d]) if (j >= 0 && j < procs.length) {
      if (!near.has(mk(p))) near.set(mk(p), new Set()); near.get(mk(p)).add(mk(procs[j])); } });
  }
  const plan = JSON.parse(readFileSync(PLAN, 'utf8'));
  const out = [];
  for (const row of plan) {
    const town = pipe.generateSettlementPipeline(row.config, null, { seed: row.seed, customContent: {} });
    const cfg = town.config || {};
    const land = { terrainType: String(cfg.terrainType || ''), tradeRoute: String(cfg.tradeRouteAccess || ''), nearbyResources: nativeSemanticResourceKeys(cfg) };
    const insts = Array.isArray(town.institutions) ? town.institutions : [];
    const standing = new Set(insts.map((h) => mk(h?.name || '')));
    out.push(JSON.stringify({ seed: row.seed, size: row.size, land,
      houses: insts.map((h) => ({ name: h?.name, source: h?.source ?? null, cascade: h?.cascadeAdded === true,
        withheld: landWithholdsHouse(land, h), pullersStanding: h?.cascadeAdded === true ? [...(near.get(mk(h?.name || '')) || [])].filter((n) => standing.has(n)) : null })) }));
  }
  writeFileSync(OUT, `${out.join('\n')}\n`);
}, 1200000);
