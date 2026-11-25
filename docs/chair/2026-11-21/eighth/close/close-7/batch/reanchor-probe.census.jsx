/** @vitest-environment node */
/**
 * BATCH item 1 (2) (R24e (2)): the re-anchor finder. Births the census's own families (`r2s-<crisis>-<size>-<i>`, the dials of
 * `tests/components/bar3ServicesRows.test.jsx :: born`, which `crisisStoppedRows` and `bar4MarkPromise` spell alike) in index
 * order on a tree and reports, per birth, its terrain and whether it holds each case the eight reds anchor: a hunter's lodge
 * (`hunter_s_lodge`), an "Inn (multiple)" offering "Meals and drink", the row "Devotional figures, holy images, and reliquaries.",
 * and a "Street food" row. A test then takes the FIRST birth of its own family that is not a desert's and holds its case,
 * verified by running the test itself.
 * Env: RP_TREE, RP_OUT, RP_N (births per family, default 12).
 */
import { test } from 'vitest';
import { writeFileSync } from 'node:fs';

const T = String(process.env.RP_TREE); const OUT = String(process.env.RP_OUT); const N = Number(process.env.RP_N || 12);
const FAMILIES = process.env.RP_FAMILIES ? process.env.RP_FAMILIES.split(',').map((f) => f.split(':')) : [['under_siege', 'town'], ['famine', 'city']];
const START = Number(process.env.RP_START || 0);

test('re-anchor finder', async () => {
  const pipe = await import(/* @vite-ignore */ `${T}/src/generators/generateSettlementPipeline.js`);
  const dens = await import(/* @vite-ignore */ `${T}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(/* @vite-ignore */ `${T}/src/store/configSlice.js`);
  const { catalogIdForName } = await import(/* @vite-ignore */ `${T}/src/data/institutionalCatalog.js`);
  const { houseDependenceIn } = await import(/* @vite-ignore */ `${T}/src/domain/display/crisisStoppedRow.js`);
  const { markedOnPage } = await import(/* @vite-ignore */ `${T}/src/pdf/lib/crisisMarksOnPage.js`);
  await dens.loadGenerationLawPayloads();
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  const out = [];
  for (const [crisis, size] of FAMILIES) for (let i = START; i < N; i++) {
    const seed = `r2s-${crisis}-${size}-${i}`;
    const s = pipe.generateSettlementPipeline(dens.birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [crisis], selectedStressesRandom: false, settType: size }), null, { seed, customContent: {} });
    const insts = s.institutions || [];
    const rows = Object.values(s.availableServices || {}).flat().filter(Boolean);
    out.push(JSON.stringify({ seed, terrain: s.config?.terrainType, route: s.config?.tradeRouteAccess, culture: s.config?.culture,
      hunter: insts.some((h) => (h.catalogId || catalogIdForName(h.name)) === 'hunter_s_lodge'),
      // SV8b's own reading of the lodge's work in this place (`crisisStoppedRow.js :: houseDependenceIn`): 'field work' = curtailed
      // what the PDF prints for the lodge (the test's own reader, `pdf/lib/crisisMarksOnPage.js :: markedOnPage`), its first 60 characters
      hunterPrint: insts.filter((h) => (h.catalogId || catalogIdForName(h.name)) === 'hunter_s_lodge').map((h) => String(markedOnPage(s, 'house', h, String(h.desc || '')) || '').slice(0, 60)),
      hunterDep: insts.filter((h) => (h.catalogId || catalogIdForName(h.name)) === 'hunter_s_lodge').map((h) => [...houseDependenceIn(s, h)]),
      innMeals: insts.some((h) => h.name === 'Inn (multiple)') && rows.some((r) => r.institution === 'Inn (multiple)' && r.name === 'Meals and drink'),
      devotional: rows.filter((r) => r.desc === 'Devotional figures, holy images, and reliquaries.').map((r) => `${r.name} @ ${r.institution}`),
      streetFood: rows.filter((r) => r.name === 'Street food').map((r) => r.institution) }));
  }
  writeFileSync(OUT, `${out.join('\n')}\n`);
}, 1200000);
