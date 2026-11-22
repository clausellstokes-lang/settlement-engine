/**
 * simulate-religion.mjs — Phase 2c: deity competition + religion spread.
 *
 * Religion is double-gated (simulationRules.religionDynamicsEnabled AND ≥1 member
 * carrying config.primaryDeitySnapshot) and contests run along allied/trade_partner
 * faith carriers — so the Phase-2/2b probes (religion off, no faith carriers) never
 * exercised it. This builds a religion-ACTIVE region: strong faith centres bearing
 * rival MAJOR deities, weak-faith converts, and edges so ≥2 deities reach each
 * convert. Then it advances across week/month/season/year and tracks the pantheon
 * ledger (wins/losses/seats/tier per deity), conversions (faith spread), deity tier
 * shifts, conversion-fracture stressors, and the religious_authority mint.
 *
 * Usage: npx vite-node scripts/audit/simulate-religion.mjs -- --reps 3 --ticks 30 --out <path.json>
 */
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { writeFileSync } from 'node:fs';

function arg(name, def) { const i = process.argv.indexOf(`--${name}`); return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def; }
const REPS = parseInt(arg('reps', '3'), 10);
const TICKS = parseInt(arg('ticks', '30'), 10);
const OUT = arg('out', 'scratchpad/simulate-religion.json');
const INTERVALS = ['one_week', 'one_month', 'one_season', 'one_year'];
const ID = (i) => String.fromCharCode(97 + (i % 26)) + (i >= 26 ? Math.floor(i / 26) : '');

// Three rival MAJOR deities (matches the test's deitySnapshot shape).
const DEITIES = [
  { _deityRef: 'custom:lu_vael', name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike', rankAxis: 'major' },
  { _deityRef: 'custom:lu_korl', name: 'Korl', alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major' },
  { _deityRef: 'custom:lu_aurum', name: 'Aurum', alignmentAxis: 'neutral', temperamentAxis: 'peaceful', rankAxis: 'major' },
];
const cultDeity = (i) => ({ _deityRef: `custom:lu_faded${i}`, name: `Faded${i}`, alignmentAxis: 'neutral', temperamentAxis: 'neutral', rankAxis: 'cult' });

function stamp(s, deity, weak) {
  s.config = { ...s.config, primaryDeityRef: deity._deityRef, primaryDeitySnapshot: deity };
  if (weak) s.powerStructure = { ...s.powerStructure, publicLegitimacy: { score: 28, label: 'Contested' } };
  return s;
}

// 6 faith centres (2 per major deity) + 8 weak-faith converts (cult rank, low legitimacy).
function buildRegion(seedBase) {
  const SOURCES = 6, CONVERTS = 8, n = SOURCES + CONVERTS;
  const ids = Array.from({ length: n }, (_, i) => ID(i));
  const saves = ids.map((id, i) => {
    const s = generateSettlementPipeline({ settType: i < SOURCES ? 'city' : 'town', culture: 'germanic' }, null, { seed: `${seedBase}-${i}`, customContent: {} });
    if (i < SOURCES) stamp(s, DEITIES[i % DEITIES.length], false);          // strong major-deity centre
    else stamp(s, cultDeity(i), true);                                       // weak cult convert
    return { id, name: s.name || `S-${i}`, phase: 'canon', settlement: s, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
  });
  // Each convert linked to 3 sources spanning different deities, so ≥2 rival deities reach it.
  const edges = [];
  for (let c = SOURCES; c < n; c++) {
    for (let k = 0; k < 3; k++) {
      const src = (c + k * 2) % SOURCES;
      edges.push({ id: `edge.${ids[src]}.${ids[c]}`, from: ids[src], to: ids[c], relationshipType: k % 2 ? 'allied' : 'trade_partner' });
    }
  }
  // a couple of source-source links too (rival centres adjacent)
  edges.push({ id: `edge.${ids[0]}.${ids[1]}`, from: ids[0], to: ids[1], relationshipType: 'trade_partner' });
  edges.push({ id: `edge.${ids[2]}.${ids[3]}`, from: ids[2], to: ids[3], relationshipType: 'allied' });
  return { ids, saves, edges };
}

const faithName = (s) => s?.settlement?.config?.primaryDeitySnapshot?.name || null;

const report = { meta: { reps: REPS, ticks: TICKS }, cells: {} };

for (const interval of INTERVALS) {
  const cell = {
    ranTicks: 0, conversions: 0, fractures: 0, authorityChannelsPeak: 0,
    deityTierChanges: 0, deityPromotions: 0, deityDemotions: 0,
    winsTotal: 0, lossesTotal: 0, seatsMoved: 0,
    distinctFaithsStart: 0, distinctFaithsEnd: 0, pantheonFinal: {},
  };
  for (let r = 0; r < REPS; r++) {
    const { ids, saves: saves0, edges } = buildRegion(`relig-${interval}-${r}`);
    let saves = saves0;
    let campaign = {
      id: `relig-${interval}-${r}`, name: 'religion', settlementIds: ids,
      worldState: { rngSeed: `relig-${interval}-${r}`, tick: 0, simulationRules: { religionDynamicsEnabled: true } },
      regionalGraph: ensureRegionalGraph({ edges }),
      wizardNews: { currentTick: 0, entries: [] },
    };
    let faithById = new Map(saves.map(s => [s.id, faithName(s)]));
    const TIER_RANK = { cult: 0, minor: 1, major: 2 };
    let prevTiers = {};
    if (r === 0) cell.distinctFaithsStart = new Set(saves.map(faithName).filter(Boolean)).size;
    for (let t = 0; t < TICKS; t++) {
      let result;
      try { result = advanceCampaignWorld({ campaign, saves, interval, now: `2026-03-01T00:00:${String(t % 60).padStart(2, '0')}.000Z` }); }
      catch (e) { cell.throw = String(e).slice(0, 120); break; }
      if (!result) break;
      cell.ranTicks++;
      campaign = { ...campaign, worldState: result.worldState, regionalGraph: result.regionalGraph, wizardNews: result.wizardNews };
      saves = saves.map(s => { const u = result.settlementUpdates?.find(x => String(x.saveId) === String(s.id)); return u ? { ...s, settlement: u.settlement } : s; });
      // conversions = a settlement's embedded faith changed
      for (const s of saves) { const prev = faithById.get(s.id), now = faithName(s); if (prev !== now) { cell.conversions++; faithById.set(s.id, now); } }
      // conversion-fracture stressors
      cell.fractures += (result.worldState.stressors || []).filter(x => /religious_conversion_fracture/.test(x?.type || x?.id || '')).length ? 1 : 0;
      // religious_authority mints
      const auth = (result.regionalGraph?.channels || []).filter(c => c?.type === 'religious_authority').length;
      cell.authorityChannelsPeak = Math.max(cell.authorityChannelsPeak, auth);
      // pantheon ledger: wins/losses/seats/tier per deity
      const pan = result.worldState?.pantheon || {};
      for (const [did, led] of Object.entries(pan)) {
        const tier = led?.tier; const prevT = prevTiers[did];
        if (prevT && tier && prevT !== tier) { cell.deityTierChanges++; (TIER_RANK[tier] > TIER_RANK[prevT] ? cell.deityPromotions++ : cell.deityDemotions++); }
        prevTiers[did] = tier;
      }
    }
    // accrue final ledger
    const pan = campaign.worldState?.pantheon || {};
    for (const [did, led] of Object.entries(pan)) {
      cell.winsTotal += led?.wins || 0; cell.lossesTotal += led?.losses || 0;
      if (r === 0) cell.pantheonFinal[did] = { wins: led?.wins || 0, losses: led?.losses || 0, seats: led?.seats || 0, tier: led?.tier };
    }
    if (r === 0) cell.distinctFaithsEnd = new Set(saves.map(faithName).filter(Boolean)).size;
  }
  report.cells[interval] = cell;
  process.stderr.write(`  ${interval}: conversions=${cell.conversions} fractures=${cell.fractures} authChanPeak=${cell.authorityChannelsPeak} deityTierΔ=${cell.deityTierChanges} (promo=${cell.deityPromotions} demo=${cell.deityDemotions}) wins=${cell.winsTotal} losses=${cell.lossesTotal} faiths ${cell.distinctFaithsStart}→${cell.distinctFaithsEnd}${cell.throw ? ' THROW:' + cell.throw : ''}\n`);
}
writeFileSync(OUT, JSON.stringify(report, null, 2));
process.stderr.write(`DONE → ${OUT}\n`);
