// AGREE-FOLLOW-UP probe 3 — the sewer's HONEST FOUNDING arm, PROSPERITY_BAND, at one tree.
// usage: node sewerProsperity.mjs <tree root> <out.json>
// Births the arm's own 42 (six tiers x seven terrains, seed `uc1-acc-<tier>-<terrain>`,
// germanic, the terrain-honest route), strips the sanitation roster exactly as the test's
// withoutSanitation does, and for each birth records: the printed prosperity label, what
// readCorruptionClimate reads, the PROSPERITY_BAND cause value, score, rung and rungSource at
// the arm's two extremes (economicState.prosperity 'Destitute' and 'Wealthy'), the tier's
// ladder bounds, and the same pair WITH the roster kept. Asserts nothing.
import { join, resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const root = resolve(process.argv[2]);
const imp = (p) => import(pathToFileURL(join(root, p)).href);
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { TIER_ORDER } = await imp('src/data/constants.js');
const { SANITATION_LADDER, sanitationRosterOf } = await imp('src/domain/undercity/strataExistence.js');
const { deriveSewerLadder, sewerCauses, SEWER_DERIVATION_TUNING, TIER_LADDER_BOUNDS } = await imp('src/domain/undercity/sewerDerivation.js');
const { readCorruptionClimate } = await imp('src/domain/corruption.js');
const TERRAIN_ROUTE = { plains: 'road', hills: 'road', forest: 'isolated', riverside: 'river', coastal: 'port', mountain: 'road', desert: 'road' };
const world = (settType, terrain, seed) => generateSettlementPipeline(
  { settType, culture: 'germanic', terrainOverride: terrain, tradeRouteAccess: TERRAIN_ROUTE[terrain], monsterThreat: 'civilized' }, null, { seed, customContent: {} });
const strip = (s) => ({ ...s, institutions: s.institutions.filter((i) => !sanitationRosterOf([i]).length) });
const withP = (s, p) => ({ ...s, economicState: { ...s.economicState, prosperity: p } });
const read = (s) => {
  const l = deriveSewerLadder(s);
  const c = sewerCauses(s, { population: s.population });
  return { rung: l.rung, idx: SANITATION_LADDER.indexOf(l.rung), score: Number(l.score?.toFixed?.(4) ?? l.score), src: l.rungSource,
    pros: c.find((x) => x.cause === 'PROSPERITY_BAND')?.value, causes: Object.fromEntries(c.map((x) => [x.cause, x.value])) };
};
const rows = [];
for (const tier of TIER_ORDER) for (const terrain of Object.keys(TERRAIN_ROUTE)) {
  const s = world(tier, terrain, `uc1-acc-${tier}-${terrain}`);
  const f = strip(s);
  rows.push({ id: `${tier}/${terrain}`, tier: s.tier, pop: s.population, label: s.economicState?.prosperity,
    climateProsperity: readCorruptionClimate(s).prosperity, hasRoster: sanitationRosterOf(s.institutions).length > 0,
    asIs: read(f), lo: read(withP(f, 'Destitute')), hi: read(withP(f, 'Wealthy')),
    rosterLo: read(withP(s, 'Destitute')), rosterHi: read(withP(s, 'Wealthy')) });
}
const up = rows.filter((r) => r.hi.idx > r.lo.idx).length, down = rows.filter((r) => r.hi.idx < r.lo.idx).length;
const upR = rows.filter((r) => r.rosterHi.idx > r.rosterLo.idx).length;
writeFileSync(process.argv[3], JSON.stringify({ root, tuning: SEWER_DERIVATION_TUNING, bounds: TIER_LADDER_BOUNDS, rows }, null, 1));
console.log(`births=${rows.length} free: up=${up} down=${down} | roster kept: up=${upR}`);
