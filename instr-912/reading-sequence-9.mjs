// reading-sequence-9.mjs — CURE 18: the composed dossier reading, with EVERY reading the
// shipped caller passes and the general desk's bare strings HARVESTED.
//
// What car 8's firings.mjs did and did not do (checked before this was written): it composes
// the six-desk 200-town sequence and walks every rung for its (blockId, poolKey) provenance —
// but it passes NO `politics` reading to the power desk, and it harvests only provenance-
// bearing objects, so `generalDeskLines`' finished STRINGS were invisible to it. Cure 18 is
// therefore NOT discharged by citation; this is the sequence with both closed.
//
// READ-ONLY except its own JSON. Nothing here is a product byte or a seed input.
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
const { classifyMoves, orderIdOf } = await imp('src/domain/prose/moveGrammar.js');

const DORMANT = 'layer DORMANT (no ledger materialized)';

/**
 * A MATERIALIZED politics ledger, built to the shipped reader's own declared shape
 * (`politicsRead.politicsLedgers` → `{ [settlementId]: { blocs: [...] } }`). It exists so the
 * DORMANT limb is EXECUTABLE: a headless generated town carries no politics ledger — the
 * layer is written during play — so `settlementBlocs` returns null on a fresh world and
 * `politicsPresencePoolKey(null, …)` answers the DORMANT key whatever the caller passes.
 * That is a fact about the WORLD, not about the probe, and the only way to show the pool key
 * moves is to give the world the ledger it is missing.
 */
const materialisedWorld = (settlementId) => ({
  politicsLedgers: {
    [String(settlementId)]: {
      blocs: [{
        id: 'bloc-guilds',
        members: ['the weavers', 'the carters'],
        end: 'tax',
        strain: 0.2,
        sinceTick: 4,
        glue: [{ type: 'trade' }],
        covert: false,
      }],
    },
  },
});

/** Walk a desk return for every rung carrying provenance AND its sentence. */
function walkRungs(node, found, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 10) return;
  const prov = (typeof node.blockId === 'string' && typeof node.poolKey === 'string') ? node
    : (node.provenance && typeof node.provenance.blockId === 'string' && typeof node.provenance.poolKey === 'string' ? node.provenance : null);
  if (prov) {
    found.push({ block: prov.blockId, pool: prov.poolKey, text: String(node.sentence || node.text || '') });
    return;
  }
  for (const v of Object.values(node)) walkRungs(v, found, depth + 1);
}

/** Harvest the general desk's BARE SENTENCE STRINGS — the half no provenance walk can see. */
function harvestBareStrings(node, out, depth = 0) {
  if (typeof node === 'string') {
    const s = node.trim();
    // A finished sentence, not a glance word or a label: at least four words and a terminator.
    if (s.split(/\s+/).length >= 4 && /[.?!]$/.test(s)) out.push(s);
    return;
  }
  if (!node || typeof node !== 'object' || depth > 8) return;
  for (const v of Object.values(node)) harvestBareStrings(v, out, depth + 1);
}

const N = Number(process.argv[2] || 3);
const MATERIALISE = process.argv[3] === '--materialise';
const CONFIG = { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' };

const towns = [];
const deskThrows = new Map();
let genThrows = 0;
let dormantDraws = 0;
const composersReached = new Set();

for (let i = 0; i < N; i++) {
  const SEED = `instr-912-car9-${i}`;
  let s;
  try { s = generateSettlementPipeline(CONFIG, null, { seed: SEED, customContent: {} }); } catch { genThrows++; continue; }
  const seed = String(s._seed ?? s.id ?? SEED);
  const opts = { seed, audience: 'dm' };
  const found = [];
  const bare = [];
  const desk = (name, fn) => {
    try {
      const r = fn();
      const before = found.length;
      walkRungs(r, found);
      if (found.length > before) composersReached.add(name);
      return r;
    } catch (e) { deskThrows.set(name, (deskThrows.get(name) || 0) + 1); return null; }
  };

  const eco = s.economicState || {};
  const dp = s.defenseProfile || {};
  const via = s.economicViability || {};
  const generalReadings = {
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
  };
  desk('general', () => general.generalStateProse(s, generalReadings, opts));
  // ⭐ THE GENERAL DESK'S BARE STRINGS, HARVESTED — the half car 8's provenance walk could
  // not see. `generalDeskLines` is the desk's ONE shipped caller shape and it returns
  // finished sentences with no rung around them.
  try {
    const lines = generalDeskLines(s, { publicDossier: false, playerView: false });
    harvestBareStrings(lines, bare);
    if (bare.length) composersReached.add('generalDeskLines (bare strings)');
  } catch (e) { deskThrows.set('generalDeskLines', (deskThrows.get('generalDeskLines') || 0) + 1); }

  desk('economy', () => economyDeskRead(s, opts));
  desk('power', () => {
    let contenders = null;
    try { contenders = coupContenders(s); } catch { /* the tab reads null too */ }
    // ⭐ THE FOURTH READING, WHICH CAR 8's PROBE OMITTED. PowerTab.jsx:208 passes
    // `politics: settlementBlocs({...})`; omitting it is not "no politics" — it is the
    // DORMANT pool key, drawn on every seed.
    const worldState = MATERIALISE ? materialisedWorld(s.id) : null;
    return power.powerStateProse(s, {
      ...(contenders ? { contenders, riskLabel: coupRiskLabel(contenders) } : {}),
      structuralLens: structuralLensOf(s),
      politics: settlementBlocs({
        worldState, settlementId: s.id, includeGroundTruth: true, includeCovert: true,
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

  dormantDraws += found.filter((f) => f.pool === DORMANT).length;
  towns.push({ seed: SEED, rungs: found, bare });
}

const all = towns.flatMap((t) => t.rungs);
const bareAll = towns.flatMap((t) => t.bare);
const blocks = new Set(all.map((f) => f.block));
const lines = [...all.map((f) => f.text), ...bareAll].filter((t) => t && t.length > 3);
const orders = lines.map((t) => orderIdOf(classifyMoves(t)) || classifyMoves(t).join('→'));
const tally = new Map();
for (const o of orders) tally.set(o, (tally.get(o) || 0) + 1);
let repeats = 0;
for (let i = 1; i < orders.length; i++) if (orders[i] === orders[i - 1]) repeats += 1;
const v1 = orders.filter((o) => String(o).split('|').includes('V1')).length;

console.log(`towns ${towns.length} of ${N} (generator throws ${genThrows})${MATERIALISE ? ' [politics ledger MATERIALISED]' : ' [fresh world — no politics ledger]'}`);
console.log(`desk throws: ${deskThrows.size ? [...deskThrows].map(([k, n]) => `${k} ${n}`).join(' · ') : 'none'}`);
console.log(`composers reached: ${composersReached.size} — ${[...composersReached].sort().join(', ')}`);
console.log(`provenance rungs ${all.length} · bare general-desk sentences ${bareAll.length} · LINES ${lines.length}`);
console.log(`distinct blocks fired: ${blocks.size}`);
console.log(`draws from the DORMANT pool key: ${dormantDraws}`);
console.log(`distinct orders n = ${tally.size}`);
console.log(`V1 share ${(v1 / Math.max(lines.length, 1)).toFixed(4)} (${v1} of ${lines.length}) · run rate ${(repeats / Math.max(orders.length - 1, 1)).toFixed(4)} (${repeats} of ${orders.length - 1} pairs)`);
console.log(`top orders: ${[...tally].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([o, k]) => `${o} ${(k / lines.length * 100).toFixed(1)}%`).join(' · ')}`);
writeFileSync(`reading-sequence-9${MATERIALISE ? '-materialised' : ''}.json`, JSON.stringify({
  towns: towns.length, lines: lines.length, blocks: [...blocks].sort(), dormantDraws,
  composers: [...composersReached].sort(), v1Share: v1 / Math.max(lines.length, 1),
  runRate: repeats / Math.max(orders.length - 1, 1), n: tally.size,
}, null, 1));
