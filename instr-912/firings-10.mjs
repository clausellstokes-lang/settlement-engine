// firings-10.mjs — CURE 22: car 8's firings probe RE-RUN at the car-10 tip, on CAR 9'S
// CORRECTED SEQUENCE. Two things car 8's `firings.mjs` did not do and car 9 found:
//   1. its power call passed no `politics` reading (PowerTab.jsx:208 passes one), and
//   2. its provenance walk could not see `generalDeskLines`' finished STRINGS.
// Both are closed here. The SEEDS ARE CAR 8's, unchanged (`instr-912-wiring-<i>`), so the
// only thing that moved between 181 and the figure below is the sequence.
//
// ⚠ THE BARE STRINGS CARRY NO (block, pool) KEY, so they cannot move the firing count. They
// are harvested and COUNTED here rather than left invisible, because "car 9's corrected
// sequence" means the sequence, and a reader must be able to see what the correction did and
// did not reach.
//
// READ-ONLY except its own JSON.
import { pathToFileURL } from 'node:url';
import { writeFileSync } from 'node:fs';

const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneINSTR';
const imp = (p) => import(pathToFileURL(`${D}/${p}`).href);

const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const general = await imp('src/domain/display/stateProse/generalStateProse.js');
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
const { settlementBlocs } = await imp('src/domain/display/politicsRead.js');

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

/** Harvest the general desk's BARE SENTENCE STRINGS — the half no provenance walk can see. */
function harvestBareStrings(node, out, depth = 0) {
  if (typeof node === 'string') {
    const s = node.trim();
    if (s.split(/\s+/).length >= 4 && /[.?!]$/.test(s)) out.push(s);
    return;
  }
  if (!node || typeof node !== 'object' || depth > 8) return;
  for (const v of Object.values(node)) harvestBareStrings(v, out, depth + 1);
}

const towns = [];
const deskThrows = new Map();
let genThrows = 0;
let bareTotal = 0;
for (let i = 0; i < N; i++) {
  const SEED = `instr-912-wiring-${i}`;
  let s;
  try { s = generateSettlementPipeline(CONFIG, null, { seed: SEED, customContent: {} }); } catch { genThrows++; continue; }
  const seed = String(s._seed ?? s.id ?? SEED);
  const opts = { seed, audience: 'dm' };
  const found = [];
  const desk = (name, fn) => {
    try { walk(fn(), found); } catch { deskThrows.set(name, (deskThrows.get(name) || 0) + 1); }
  };
  const eco = s.economicState || {};
  const dp = s.defenseProfile || {};
  const via = s.economicViability || {};
  desk('general', () => general.generalStateProse(s, {
    scores: dp.scores,
    prosperity: eco.prosperity,
    safetyLabel: eco.safetyProfile?.safetyLabel,
    viable: via.viable,
    readinessLabel: dp.readiness?.label,
    foodSecurityLabel: eco.foodSecurity?.label,
    terrainType: s.config?.terrainType,
    institutions: s.institutions,
    tradeRouteAccess: s.config?.tradeRouteAccess,
    isEntrepot: eco.isEntrepot,
    inst: eco.compound?.inst,
    conflicts: s.conflicts,
    structuralViolations: s.structuralViolations,
    structuralSuggestions: s.structuralSuggestions,
    coherenceNotes: s.coherenceNotes,
    govFaction: (s.powerStructure?.factions || []).find((f) => f?.isGoverning)?.faction,
    tier: s.tier,
    foodBalance: via.metrics?.foodBalance,
    history: s.history,
    prominentRelationship: s.prominentRelationship,
    relationships: s.relationships,
    criticalIssueCount: via.metrics?.criticalIssueCount,
    governingName: s.powerStructure?.governingName,
    activeChains: eco.activeChains,
    exploitation: s.resourceAnalysis?.exploitation,
    primaryImports: eco.primaryImports,
  }, opts));
  try {
    const bare = [];
    harvestBareStrings(generalDeskLines(s, { publicDossier: false, playerView: false }), bare);
    bareTotal += bare.length;
  } catch { deskThrows.set('generalDeskLines', (deskThrows.get('generalDeskLines') || 0) + 1); }
  desk('economy', () => economyDeskRead(s, opts));
  desk('power', () => {
    let contenders = null;
    try { contenders = coupContenders(s); } catch { /* the tab reads null too */ }
    return power.powerStateProse(s, {
      ...(contenders ? { contenders, riskLabel: coupRiskLabel(contenders) } : {}),
      structuralLens: structuralLensOf(s),
      // ⭐ CAR 9's CORRECTION: the fourth reading the shipped caller passes.
      politics: settlementBlocs({
        worldState: null, settlementId: s.id, includeGroundTruth: true, includeCovert: true,
      }),
    }, opts);
  });
  for (const name of ['defenseStateProse', 'defenseThreatProse', 'defenseForcesProse', 'defensePostureProse',
    'defenseWallRationaleProse', 'defenseMilitaryStatusProse', 'defenseSupportingProse', 'defenseMagicDependencyProse']) {
    desk(name, () => defense[name](s, opts));
  }
  desk('stressors', () => stressors.stressorsStateProse(s, {
    banners: Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : []),
    conditions: deriveAllActiveConditions(s),
    worldStressor: null,
  }, opts));
  desk('warFaith', () => {
    const model = faithPanelModel(s);
    return warFaith.warFaithStateProse(s, { faith: model, hasPatron: !!model.hasEmbed }, opts);
  });
  towns.push({ seed: SEED, fired: found });
}

const all = towns.flatMap((t) => t.fired);
const blocks = new Set(all.map((f) => f.block));
const keys = new Map();
for (const t of towns) for (const k of new Set(t.fired.map((f) => `${f.block} :: ${f.pool}`))) keys.set(k, (keys.get(k) || 0) + 1);
console.log(`towns ${towns.length} of ${N} (generator throws ${genThrows}) | firings ${all.length} | mean ${(all.length / Math.max(towns.length, 1)).toFixed(1)}/town`);
console.log(`desk throws: ${deskThrows.size ? [...deskThrows].map(([k, n]) => `${k} ${n}`).join(' · ') : 'none'}`);
console.log(`distinct (block,pool) keys fired: ${keys.size} of 708`);
console.log(`distinct blocks fired: ${blocks.size} of 68`);
console.log(`general-desk BARE sentences harvested (no (block,pool) key, so not in the count above): ${bareTotal}`);
const always = [...keys].filter(([, n]) => n === towns.length).map(([k]) => k).sort();
const ABSENCE = /DORMANT|ABSENT|\bnone\b|no ledger|not recorded|unclassified|absent/i;
console.log(`keys firing on EVERY town: ${always.length} — of which ABSENCE/none/DORMANT pools: ${always.filter((k) => ABSENCE.test(k)).length}`);
for (const k of always) console.log(`  ${ABSENCE.test(k) ? 'ABSENCE ' : '        '}${k}`);
writeFileSync('firings-10.json', JSON.stringify({ towns: towns.length, firings: towns.map((t) => t.fired) }));
console.log('wrote firings-10.json');
