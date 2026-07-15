/**
 * calamity.kernel.integration.test.js — M11b CALAMITY, the full-engine proof.
 *
 * The strike is driven through advanceCalamity with a controlled rng (a real hazard
 * would fire only ~once/15y), so the whole tail is proven deterministically:
 *   - THE STRIKE composes demote + collapse + destroy in one blow; `required` is
 *     NEVER touched; the terrain keys the type; the named stamp is minted;
 *   - THE M2 SEVER SEAM: a destroyed producer's activeChain breaks and its exclusive
 *     export drops (severedExports) — M2's next tick will sever the downstream link;
 *   - THE EXODUS rides M4's REALIZED-DEBIT path (collectRealizedEmigrationEvents →
 *     dispatchMigrations) and CONSERVATION HOLDS THROUGH IT (Σarrivals+Σdeaths ==
 *     Σdepartures); the origin is debited deaths + exodus;
 *   - TIER demotes EMERGENTLY via popToTier; a "disaster response" legitimacy
 *     condition puts the ruler under coup-readable pressure;
 *   - AGGREGATE-ONLY: a named NPC survives the strike;
 *   - DORMANCY: flag off ⇒ a complete no-op (same refs); no year boundary ⇒ no-op;
 *     a FULL-PULSE run with the flag off carries no calamity artifact + re-runs identically.
 */
import { describe, it, expect } from 'vitest';
import { advanceCalamity, forceCalamityStrike, forceCalamityEntry } from '../../src/domain/worldPulse/calamityKernel.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['thornwood', 'midvale', 'faredge'];

function digestFor() {
  const pack = makeGridPack({ cols: 10, rows: 6 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

// A key-aware rng stub: FIRE the strike at THORNWOOD ONLY (its `disaster:thornwood:
// <year>` draw ⇒ 0 < hazard; the others ⇒ 0.99, never fire), take the MAX K
// (`disaster:k:*` ⇒ 0.99), and drive every other draw at 0 (deterministic target
// pick + min loss + a settled migration plan).
function stubRng() {
  const val = (key) => {
    const m = /^disaster:([^:]+):\d+$/.exec(key); // the strike-DECISION key
    if (m) return m[1] === 'thornwood' ? 0 : 0.99;
    if (/^disaster:k:/.test(key)) return 0.99;
    return 0;
  };
  const make = (key) => ({ random: () => val(key), fork: (k) => make(k) });
  return { fork: (k) => make(k) };
}

function struckSettlement() {
  return {
    name: 'Thornwood', tier: 'city', population: 5000,
    config: { terrainType: 'forest' }, // ⇒ fire
    institutions: [
      { name: 'Town hall', required: true, category: 'civic' },       // NEVER struck
      { name: 'Water source', required: true, category: 'infrastructure' },
      { name: 'Blacksmith', category: 'crafts' },                     // singleton producer ⇒ DESTROY + M2 sever
      { name: 'Inn', category: 'lodging' },                           // multi-instance ⇒ COLLAPSE (survivor)
      { name: 'Tavern', category: 'lodging' },                        // multi-instance ⇒ razed
      { name: "Mages' guild", category: 'magic' },                    // upgrade greater ⇒ DEMOTE to Wizard's tower
    ],
    economicState: {
      primaryExports: ['iron tools'], primaryImports: [],
      activeChains: [{ resource: { name: 'iron ore' }, processingInstitutions: ['Blacksmith'], outputs: ['iron tools'] }],
    },
    powerStructure: { publicLegitimacy: { score: 60 }, factions: [], conflicts: [] },
    npcs: [{ id: 'npc1', name: 'Aldric the Elder', role: 'elder' }],
    activeConditions: [],
    populationHistory: [],
  };
}

const plainSettlement = (name) => ({
  name, tier: 'town', population: 1500, config: { terrainType: 'plains' },
  institutions: [{ name: 'Market', category: 'trade' }],
  economicState: { primaryExports: [], primaryImports: ['iron tools'], activeChains: [] },
  activeConditions: [], npcs: [],
});

function fixture({ spatial }) {
  const settlements = [
    { id: 'thornwood', name: 'Thornwood', settlement: struckSettlement() },
    { id: 'midvale', name: 'Midvale', settlement: plainSettlement('Midvale') },
    { id: 'faredge', name: 'Faredge', settlement: plainSettlement('Faredge') },
  ];
  const snapshot = {
    settlements,
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'e.t.m', from: 'thornwood', to: 'midvale', relationshipType: 'trade_partner' },
        { id: 'e.m.f', from: 'midvale', to: 'faredge', relationshipType: 'trade_partner' },
      ],
      channels: [],
    }),
  };
  const settlementUpdates = settlements.map((it) => ({ saveId: it.id, settlement: it.settlement }));
  const worldState = {
    tick: 52,
    simulationRules: { disastersEnabled: true },
    ...(spatial ? { spatialCanonVersion: 1, spatialDigest: digestFor() } : {}),
  };
  return { snapshot, settlementUpdates, worldState, digest: spatial ? worldState.spatialDigest : null };
}

// Cross a year boundary (week 51 → 52 ⇒ year 1 → 2) so the annual draw evaluates.
const YEAR_CROSS = { prevWeeks: 51, weeks: 52 };

function runStrike({ spatial }) {
  const f = fixture({ spatial });
  return advanceCalamity({
    settlementUpdates: f.settlementUpdates,
    worldState: f.worldState,
    snapshot: f.snapshot,
    digest: f.digest,
    pIndex: { get: () => ({ score: 0.4 }) },
    rules: f.worldState.simulationRules,
    rng: stubRng(),
    season: 'spring',
    ...YEAR_CROSS,
    tick: 52,
    now: NOW,
  });
}

const struckOf = (res) => res.settlementUpdates.find((u) => u.saveId === 'thornwood').settlement;
const instByName = (s, name) => (s.institutions || []).find((i) => String(i.name) === name);

describe('M11b calamity kernel — the strike + subsumption', () => {
  it('composes DEMOTE + COLLAPSE + DESTROY, and NEVER touches a required institution', () => {
    const res = runStrike({ spatial: true });
    expect(res.changed).toBe(true);
    const s = struckOf(res);
    // required — byte-untouched, still standing, still required.
    const townHall = instByName(s, 'Town hall');
    expect(townHall.required).toBe(true);
    expect(String(townHall.status || 'active')).toBe('active');
    // DESTROY — the singleton producer razed.
    expect(instByName(s, 'Blacksmith').status).toBe('ruined');
    // COLLAPSE — the lodging category folds to one survivor (Inn kept, Tavern razed).
    expect(String(instByName(s, 'Inn').status || 'active')).toBe('active');
    expect(instByName(s, 'Tavern').status).toBe('ruined');
    // DEMOTE — the mages' guild falls a rung to a wizard's tower.
    expect(instByName(s, "Mages' guild")).toBeUndefined();
    expect(instByName(s, "Wizard's tower")).toBeDefined();
    // The strike receipt names the fates.
    const strike = res.receipts.find((r) => r.kind === 'strike');
    expect(strike.type).toBe('fire');
    expect(strike.targets).not.toContain('Town hall');
    expect(strike.removed.sort()).toEqual(['Blacksmith', 'Tavern']);
  });

  it('mints the BUCKET-NEUTRAL permanent stamp (the cooldown record); flavor hint kept under `type`', () => {
    const s = struckOf(runStrike({ spatial: true }));
    const stamp = s.calamityHistory[s.calamityHistory.length - 1];
    // ONE-TIME SHIFT (owner-ruled): the engine title speaks the BUCKET, not the kind.
    expect(stamp.name).toBe('The Great Calamity of Thornwood, year 2');
    // The persisted key `type` is UNCHANGED (save-shape stable) — the cosmetic flavor hint.
    expect(stamp.type).toBe('fire');
    expect(stamp.year).toBe(2);
  });

  it('THE M2 SEVER SEAM: the destroyed producer breaks its chain + drops its export', () => {
    const res = runStrike({ spatial: true });
    const s = struckOf(res);
    expect(s.economicState.primaryExports).not.toContain('iron tools'); // producer gone ⇒ export severed
    expect(s.economicState.activeChains).toHaveLength(0);               // the broken chain re-reconciled away
    const strike = res.receipts.find((r) => r.kind === 'strike');
    expect(strike.severedExports).toContain('iron tools');
  });

  it('demotes the TIER emergently via popToTier + attaches the "disaster response" legitimacy condition', () => {
    const res = runStrike({ spatial: true });
    const s = struckOf(res);
    // Population fell (deaths + exodus), so the tier can only stay or fall — never rise.
    const order = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    expect(order.indexOf(s.tier)).toBeLessThanOrEqual(order.indexOf('city'));
    // The legitimacy condition — a custom_crisis feeding public_legitimacy/ruling_authority.
    const cond = (s.activeConditions || []).find((c) => c.id?.startsWith('condition.disaster_response'));
    expect(cond).toBeDefined();
    expect(cond.affectedSystems).toContain('public_legitimacy');
  });

  it('AGGREGATE-ONLY: the named NPC survives the strike (product boundary)', () => {
    const s = struckOf(runStrike({ spatial: true }));
    expect((s.npcs || []).find((n) => n.id === 'npc1')).toBeDefined();
    expect(s.population).toBeLessThan(5000); // but the aggregate count fell
  });
});

describe('M11b calamity kernel — the exodus + M4 conservation', () => {
  it('routes the exodus through the realized-debit path and CONSERVATION HOLDS (Σarrivals+Σdeaths==Σdepartures)', () => {
    const res = runStrike({ spatial: true });
    const strike = res.receipts.find((r) => r.kind === 'strike');
    const exodusReceipts = res.receipts.filter((r) => r.kind === 'exodus');
    expect(exodusReceipts.length).toBeGreaterThan(0);
    // Per-dispatch conservation (the M4 invariant, asserted inside dispatchMigrations).
    let sumDepartures = 0; let sumSinks = 0;
    for (const r of exodusReceipts) {
      expect(r.departures).toBe((r.originDeaths || 0) + (r.roadDeaths || 0) + (r.arrivals || 0));
      sumDepartures += r.departures;
      sumSinks += (r.originDeaths || 0) + (r.roadDeaths || 0) + (r.arrivals || 0);
    }
    expect(sumSinks).toBe(sumDepartures);
    expect(sumDepartures).toBe(strike.exodus); // every departed soul is accounted for
    // The origin was debited BOTH the deaths and the exodus (no minting).
    const s = struckOf(res);
    expect(5000 - s.population).toBe(strike.deaths + strike.exodus);
    // The migration ledger materialized (the refugee columns in transit).
    expect(res.worldState.spatialLedgers?.migration).toBeTruthy();
  });

  it('ASPATIAL fallback: the exodus uses the existing population-flight term (no migration ledger)', () => {
    const res = runStrike({ spatial: false });
    const strike = res.receipts.find((r) => r.kind === 'strike');
    expect(strike.exodus).toBeGreaterThan(0);
    // No spatial migration ledger aspatially; the origin still lost deaths + exodus.
    expect(res.worldState.spatialLedgers?.migration).toBeFalsy();
    const s = struckOf(res);
    expect(5000 - s.population).toBe(strike.deaths + strike.exodus);
  });
});

describe('M11b calamity kernel — dormancy (byte-identity seam)', () => {
  it('flag OFF ⇒ a COMPLETE no-op (same references, no artifact)', () => {
    const f = fixture({ spatial: true });
    const res = advanceCalamity({
      settlementUpdates: f.settlementUpdates, worldState: f.worldState, snapshot: f.snapshot,
      digest: f.digest, pIndex: { get: () => ({ score: 0.4 }) },
      rules: {}, // ABSENT flag ⇒ dormant
      rng: stubRng(), season: 'spring', ...YEAR_CROSS, tick: 52, now: NOW,
    });
    expect(res.changed).toBe(false);
    expect(res.settlementUpdates).toBe(f.settlementUpdates); // same ref — untouched
    expect(res.worldState).toBe(f.worldState);
    expect(res.newsEntries).toHaveLength(0);
  });

  it('NO year boundary ⇒ no-op even with the flag on', () => {
    const f = fixture({ spatial: true });
    const res = advanceCalamity({
      settlementUpdates: f.settlementUpdates, worldState: f.worldState, snapshot: f.snapshot,
      digest: f.digest, pIndex: { get: () => ({ score: 0.4 }) },
      rules: f.worldState.simulationRules, rng: stubRng(), season: 'spring',
      prevWeeks: 10, weeks: 11, tick: 11, now: NOW, // same year (year 1) ⇒ no annual draw
    });
    expect(res.changed).toBe(false);
  });
});

describe('M11b calamity — FULL-PULSE dormancy (flag off ⇒ byte-neutral + deterministic)', () => {
  function campaign() {
    const saves = IDS.map((id, i) => ({
      id, name: id, phase: 'canon',
      settlement: i === 0 ? struckSettlement() : plainSettlement(id),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }));
    const worldState = {
      rngSeed: 'm11b-dormancy', tick: 51,
      calendar: { elapsedWeeks: 51, year: 1 },
      simulationRules: { warLayerEnabled: false, propagationMode: 'full', stressorsEnabled: true },
      stressors: [],
    };
    return {
      campaign: {
        id: 'm11b', name: 'Calamity', settlementIds: [...IDS], worldState,
        regionalGraph: ensureRegionalGraph({ edges: [{ id: 'e', from: 'thornwood', to: 'midvale', relationshipType: 'trade_partner' }], channels: [] }),
        wizardNews: { currentTick: 51, entries: [] },
      },
      saves,
    };
  }

  it('a full pulse across a year boundary with the flag OFF mints no calamity + re-runs identically', () => {
    const a = simulateCampaignWorldPulse({ ...campaign(), interval: 'one_month', now: NOW });
    const b = simulateCampaignWorldPulse({ ...campaign(), interval: 'one_month', now: NOW });
    // Deterministic (same-seed byte-identity of the worldState).
    expect(JSON.stringify(a.worldState)).toBe(JSON.stringify(b.worldState));
    // No calamity artifact anywhere (dormant by absence of the flag).
    const struck = (a.settlementUpdates || []).find((u) => String(u.saveId) === 'thornwood')?.settlement;
    expect(struck?.calamityHistory).toBeUndefined();
    expect((a.wizardNews?.entries || []).some((e) => e.impactKind === 'calamity')).toBe(false);
  });
});

// ── W-UPSWING stage 0 — THE CALAMITY BUCKET (kernel pins) ──────────────────────
describe('stage 0 — TYPE-BLIND STAYS TYPE-BLIND (no mechanical branch on the flavor hint)', () => {
  // Two struck settlements identical in EVERYTHING except terrain (fire vs flood hint).
  // The mechanism must be byte-identical — only the cosmetic `type` field differs.
  function struckAt(terrain) {
    const s = struckSettlement();
    s.config = { terrainType: terrain };
    const settlements = [
      { id: 'thornwood', name: 'Thornwood', settlement: s },
      { id: 'midvale', name: 'Midvale', settlement: plainSettlement('Midvale') },
      { id: 'faredge', name: 'Faredge', settlement: plainSettlement('Faredge') },
    ];
    const res = advanceCalamity({
      settlementUpdates: settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })),
      worldState: { tick: 52, simulationRules: { disastersEnabled: true } },
      snapshot: { settlements, regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }) },
      digest: null, pIndex: { get: () => ({ score: 0.4 }) },
      rules: { disastersEnabled: true }, rng: stubRng(), season: 'spring', ...YEAR_CROSS, tick: 52, now: NOW,
    });
    return res;
  }

  it('changing ONLY the terrain changes the flavor hint but NOT one mechanical outcome', () => {
    const fire = struckAt('forest');   // hint: fire
    const flood = struckAt('riverside'); // hint: flood
    const fS = fire.settlementUpdates.find((u) => u.saveId === 'thornwood').settlement;
    const flS = flood.settlementUpdates.find((u) => u.saveId === 'thornwood').settlement;
    const fStrike = fire.receipts.find((r) => r.kind === 'strike');
    const flStrike = flood.receipts.find((r) => r.kind === 'strike');
    // The cosmetic hint DIFFERS (the only difference the terrain makes).
    expect(fStrike.type).toBe('fire');
    expect(flStrike.type).toBe('flood');
    // EVERY mechanical field is identical — the bucket is constitutional.
    expect(fStrike.deaths).toBe(flStrike.deaths);
    expect(fStrike.exodus).toBe(flStrike.exodus);
    expect(fStrike.k).toBe(flStrike.k);
    expect(fStrike.targets).toEqual(flStrike.targets);
    expect(fStrike.removed).toEqual(flStrike.removed);
    expect(fStrike.severedExports).toEqual(flStrike.severedExports);
    expect(fStrike.demotedTier).toBe(flStrike.demotedTier);
    // The post-strike rosters + populations match (institutions, tier, population).
    expect(fS.institutions).toEqual(flS.institutions);
    expect(fS.population).toBe(flS.population);
    expect(fS.tier).toBe(flS.tier);
    // Only the stamp NAME is bucket-neutral (identical) and the `type` hint differs.
    const fStamp = fS.calamityHistory[fS.calamityHistory.length - 1];
    const flStamp = flS.calamityHistory[flS.calamityHistory.length - 1];
    expect(fStamp.name).toBe(flStamp.name); // both "The Great Calamity of Thornwood, year 2"
    expect(fStamp.name).toContain('Great Calamity');
    expect(fStamp.type).not.toBe(flStamp.type); // fire vs flood — cosmetic only
  });
});

describe('stage 0 — FORCE ≡ ORGANIC (FORCE_CALAMITY resolves through the SAME kernel path)', () => {
  it('a forced strike at the natural "moderate" band is byte-identical to the organic strike', () => {
    // The organic strike (thornwood, year 2, the stub firing it).
    const organic = runStrike({ spatial: true });
    const organicS = struckOf(organic);
    const organicStamp = organicS.calamityHistory[organicS.calamityHistory.length - 1];
    const organicStrike = organic.receipts.find((r) => r.kind === 'strike');

    // The SAME strike, resolved through FORCE_CALAMITY at 'moderate' (natural band).
    const item = { id: 'thornwood', name: 'Thornwood', settlement: struckSettlement() };
    const forkFn = (k) => stubRng().fork(k);
    const forced = forceCalamityStrike({
      settlement: struckSettlement(), item, id: 'thornwood', year: 2, tick: 52, forkFn, severity: 'moderate',
    });

    // The strike RESOLUTION is identical (force ≡ organic by construction).
    expect(forced.stamp.name).toBe(organicStamp.name);
    expect(forced.stamp.type).toBe(organicStamp.type);
    expect(forced.stamp.deaths).toBe(organicStamp.deaths);
    expect(forced.stamp.exodus).toBe(organicStamp.exodus);
    expect(forced.stamp.targets).toEqual(organicStamp.targets);
    expect(forced.loss.deaths).toBe(organicStrike.deaths);
    expect(forced.loss.exodus).toBe(organicStrike.exodus);
    expect(forced.receipt.removed).toEqual(organicStrike.removed);
    // The post-strike institution roster is identical (the exodus debit is a downstream
    // apply that does not touch institutions).
    expect(forced.settlement.institutions).toEqual(organicS.institutions);
  });

  it('the severity dial scales the strike WITHIN the frozen walls (severe ≥ moderate ≥ minor)', () => {
    const item = { id: 'thornwood', name: 'Thornwood', settlement: struckSettlement() };
    const forkFn = (k) => stubRng().fork(k);
    const at = (severity) => forceCalamityStrike({
      settlement: struckSettlement(), item, id: 'thornwood', year: 2, tick: 52, forkFn, severity,
    }).loss;
    const minor = at('minor');
    const moderate = at('moderate');
    const severe = at('severe');
    // Monotone by band; never past the population (bounded by construction).
    expect(minor.deaths).toBeLessThanOrEqual(moderate.deaths);
    expect(moderate.deaths).toBeLessThanOrEqual(severe.deaths);
    expect(severe.deaths + severe.exodus).toBeLessThan(5000);
  });

  it('the FORCE_CALAMITY entry is a registrable-shape verb (NOT registered — W-COMPOSER-2 lift)', () => {
    const entry = forceCalamityEntry();
    expect(entry.type).toBe('FORCE_CALAMITY');
    expect(entry.scope).toBe('settlement');
    expect(typeof entry.predicate).toBe('function');
    expect(entry.predicate({}).available).toBe(true);
    // A severity BAND dial + a cosmetic flavor freetext dial (≤4 dials, banded).
    const dials = entry.dials || [];
    expect(dials.find((d) => d.key === 'severity')?.kind).toBe('band');
    expect(dials.find((d) => d.key === 'flavor')?.kind).toBe('text');
  });
});

describe('stage 0 — EXPOSURE receipts name the geography, never a disaster kind', () => {
  it('the strike receipt carries an exposure factor + an "exposed geography" note', () => {
    const res = runStrike({ spatial: true });
    const strike = res.receipts.find((r) => r.kind === 'strike');
    expect(typeof strike.exposure).toBe('number');
    expect(String(strike.exposureNote).toLowerCase()).toContain('exposed');
  });

  it('no strike PROSE (news / condition / population reason) asserts a disaster kind', () => {
    const res = runStrike({ spatial: true });
    const s = struckOf(res);
    const news = res.newsEntries[0];
    const prose = [
      String(news.summary), ...(news.reasons || []).map(String),
      String((s.activeConditions || []).find((c) => c.id?.startsWith('condition.disaster_response'))?.description || ''),
      ...(s.populationHistory || []).map((h) => String(h.reason || '')),
    ].join(' ').toLowerCase();
    for (const kind of ['flood', 'fire', 'quake', 'earthquake', 'storm']) {
      expect(prose, `prose must not assert "${kind}"`).not.toContain(kind);
    }
    // It DOES speak the bucket.
    expect(prose).toContain('calamity');
  });
});
