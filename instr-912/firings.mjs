// firings.mjs — WHICH KEY FIRED ON WHICH TOWN, composed through the SHIPPED desk-read
// callers with REAL readings (never `{}` — a composer called with empty readings selects its
// ABSENCE pools for every seed and manufactures a finding). READ-ONLY except its own JSON.
import { pathToFileURL } from 'node:url';
import { writeFileSync } from 'node:fs';

const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneINSTR';
const imp = (p) => import(pathToFileURL(`${D}/${p}`).href);

const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { generalDeskLines } = await imp('src/components/new/generalDeskRead.js');
const { economyDeskRead } = await imp('src/components/new/economyDeskRead.js');
const power = await imp('src/domain/display/stateProse/powerStateProse.js');
const defense = await imp('src/domain/display/stateProse/defenseStateProse.js');
const stressors = await imp('src/domain/display/stateProse/stressorsStateProse.js');
const warFaith = await imp('src/domain/display/stateProse/warFaithStateProse.js');
const { structuralLensOf } = await imp('src/domain/spatial/cohesionWeave.js');
const { coupContenders, coupRiskLabel } = await imp('src/domain/rulingPowerCoup.js');
const { deriveAllActiveConditions } = await imp('src/domain/activeConditions.js');
const { faithPanelModel } = await imp('src/components/settlement/faithPanelModel.js');

const N = Number(process.argv[2] || 200);
const CONFIG = {
  settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road',
};

/** Walk a desk return for every rung carrying its (blockId, poolKey) provenance. */
function walk(o, found, depth = 0) {
  if (!o || typeof o !== 'object' || depth > 10) return;
  if (typeof o.blockId === 'string' && typeof o.poolKey === 'string') { found.push({ block: o.blockId, pool: o.poolKey }); return; }
  if (o.provenance && typeof o.provenance.blockId === 'string' && typeof o.provenance.poolKey === 'string') {
    found.push({ block: o.provenance.blockId, pool: o.provenance.poolKey });
    return;
  }
  for (const v of Object.values(o)) walk(v, found, depth + 1);
}

const towns = [];
const deskThrows = new Map();
let genThrows = 0;
for (let i = 0; i < N; i++) {
  const SEED = `instr-912-wiring-${i}`;
  let s;
  try { s = generateSettlementPipeline(CONFIG, null, { seed: SEED, customContent: {} }); } catch { genThrows++; continue; }
  const seed = String(s._seed ?? s.id ?? SEED);
  const opts = { seed, audience: 'dm' };
  const found = [];
  /** @param {string} name @param {() => unknown} fn */
  const desk = (name, fn) => {
    try { walk(fn(), found); } catch (e) { deskThrows.set(name, (deskThrows.get(name) || 0) + 1); }
  };
  desk('general', () => generalDeskLines(s, opts));
  desk('economy', () => economyDeskRead(s, opts));
  // POWER: the tab's own readings recipe, built from the shipped canonical readers
  // (PowerTab.jsx:198-202) — a desk derives none of its own.
  desk('power', () => {
    let contenders = null;
    try { contenders = coupContenders(s); } catch { /* absent on some towns; the tab reads null too */ }
    return power.powerStateProse(s, {
      ...(contenders ? { contenders, riskLabel: coupRiskLabel(contenders) } : {}),
      structuralLens: structuralLensOf(s),
    }, opts);
  });
  // DEFENSE: every entry point takes (settlement, options) — no readings object exists to
  // get wrong (DefenseTab.jsx:94-120 calls them exactly like this).
  for (const name of ['defenseStateProse', 'defenseThreatProse', 'defenseForcesProse', 'defensePostureProse',
    'defenseWallRationaleProse', 'defenseMilitaryStatusProse', 'defenseSupportingProse', 'defenseMagicDependencyProse']) {
    desk(name, () => defense[name](s, opts));
  }
  // STRESSORS: OverviewTab.jsx:148-175's recipe. `worldStressor` is null because no
  // generator writes worldState — the block's own declared dark-at-birth case.
  desk('stressors', () => stressors.stressorsStateProse(s, {
    banners: Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : []),
    conditions: deriveAllActiveConditions(s),
    worldStressor: null,
  }, opts));
  // WAR/FAITH: FaithTab.jsx:218-225's recipe. The WAR half needs a worldState the generator
  // does not write, so it is absent here and its pools cannot fire — measured, not assumed.
  desk('warFaith', () => {
    const model = faithPanelModel(s);
    return warFaith.warFaithStateProse(s, { faith: model, hasPatron: !!model.hasEmbed }, opts);
  });
  towns.push({ seed: SEED, fired: found });
}

const all = towns.flatMap((t) => t.fired);
const blocks = new Set(all.map((f) => f.block));
console.log(`towns ${towns.length} of ${N} (generator throws ${genThrows}) | firings ${all.length} | distinct blocks fired ${blocks.size}`);
console.log(`mean firings/town ${(all.length / Math.max(towns.length, 1)).toFixed(1)}`);
if (deskThrows.size) console.log('desk throws:', [...deskThrows].map(([k, n]) => `${k} ${n}`).join(' · '));
else console.log('desk throws: none');
console.log(`distinct (block,pool) keys fired: ${new Set(all.map((f) => `${f.block} :: ${f.pool}`)).size}`);
console.log('blocks fired:', [...blocks].sort().join(' '));
writeFileSync('firings.json', JSON.stringify({ towns: towns.length, firings: towns.map((t) => t.fired) }));
console.log('wrote firings.json');
