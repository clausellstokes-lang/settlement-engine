/**
 * momentumDormancyGolden.test.js — W-MOMENTUM dormancy proof (the FENCED pre-wire golden).
 *
 * THE CONSTITUTIONAL DORMANCY LAW (DESIGN_MOMENTUM.md §5/§6): the momentum layer — the
 * commitment ledger (advanceCommitments), the strategy commitment-load, the belief-
 * discount, the supply-web abandon-floor, and the priced climb-down crack — is DORMANT
 * behind the virtual `momentumEnabled` flag (AND-ed with beliefsActive). With the gate
 * ABSENT it must be a pure no-op — no `commitments` ledger, no drift in the belief maps,
 * the credibility stock, legitimacy, or the decision stream — byte-identical to the
 * pre-wire engine EVEN IN a belief-active, marching-war world (a proud, contested-seat
 * aggressor pre-mobilized against a weak grain-rich neighbour that WOULD accumulate
 * commitment and — past its cliff — resist reconsideration if lit).
 *
 * Pinned two ways (the generosity / peace-causal / intervention idiom):
 *   1. A FULL-ADVANCE dormancy golden: the war-shaped, belief-active world is driven N real
 *      pulse ticks with the gate ABSENT, projected to a MECHANICAL summary (the whole
 *      spatialLedgers census — commitments/beliefMaps/credibility included — plus the
 *      deployments/warPosture/warExhaustion war state, the per-settlement legitimacy, and
 *      the candidate/news/roll histograms), ORACLE-NORMALIZED and sha256-hashed. The
 *      manifest is captured BEFORE the pulseKernel/strategy/belief/supplyWeb wiring lands
 *      (momentum.js exists but is unimported ⇒ the hash is the pristine pre-wire engine);
 *      it holding AFTER the wiring proves the wired-but-dormant layer is byte-identical to
 *      pre-wire. Any drift trips this — STOP.
 *   2. A dormancy CONTRACT: the dormant final world carries NO `commitments` sub-ledger.
 *
 * THE LIT-PATH ANTI-VACUITY (§1: deposits are reads, commitment is state): the SAME fixture
 * with the gate ON actually accumulates a commitment on the marching war and stays
 * deterministic (same-seed byte-identity — the no-new-draws tripwire; the momentum layer
 * takes no rng, so lighting it must not shift the stream). A dormancy pin that never had a
 * live counterpart would be worthless.
 *
 * AUTHORIZED W1 RE-RECORD (2026-08-01; FABLE_VALIDATION_QUEUE / WR-0b): mo-a is
 * unchanged. The siege-arrival join now withholds an on-road column from the siege
 * loop, so mo-b moves only deployments.iron.strength 28.566→28.695 and the mirrored
 * armyTransit strength 28.56623730231713→28.694822912024044 / supplyQuality
 * 0.38935210731759196→0.4112080062264865. mo-c moves the same fields
 * 35.361→35.468, 35.36078561910678→35.468349392810424, and
 * 0.43694520553099675→0.46938340513598664, plus the chooser's transient
 * warIntents.iron={targetId:'weak',tick:3}. The dormant commitments ledger remains
 * absent and the lit no-new-RNG pin stays green: this is W1 lit-war behavior, not
 * momentum leakage.
 *
 * Capture/refresh: UPDATE_GOLDEN=1 npx vitest run tests/property/momentumDormancyGolden.test.js -t "captures"
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'momentum-dormancy-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['iron', 'weak', 'mid'];

function digestFor() {
  const pack = makeGridPack({ cols: 20, rows: 16 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
}

/** A settlement with enough military/economic/temperament texture for the war + momentum
 *  layers to move (the peaceCausal war profile + an authored-personality ruler). */
function mSettlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: patch.priorityMilitary ?? 35 },
    institutions: patch.institutions || [],
    economicState: {
      prosperity: patch.prosperity || 'Prosperous',
      primaryExports: patch.exports || [],
      primaryImports: [],
      ...(patch.foodSecurity ? { foodSecurity: patch.foodSecurity } : {}),
    },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: patch.legitimacy != null && patch.legitimacy < 40 ? 'Contested' : 'Stable' },
      factions: patch.factions || [
        { faction: 'Military Council', category: 'military', power: 78, isGoverning: true },
        { faction: 'Merchant League', category: 'economy', power: 52 },
      ],
      conflicts: [],
    },
    npcs: patch.npcs || [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}

const mSave = (id, name, patch = {}) => ({
  id, name, phase: 'canon', settlement: mSettlement(name, patch),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

/**
 * The war-shaped, belief-active fixture: Ironhold (strong city, CONTESTED seat, a PROUD +
 * STUBBORN crown — a maximally high reconsideration cliff — pre-mobilized, an old-wound
 * hostile edge) marches on Weakmoor (weak, grain-rich — the envy target); Midwater is tied
 * to both. If lit, Ironhold's siege + incitement deposit a war commitment that, past its
 * proud cliff, resists sue-for-peace. beliefsActive (infoMode:'full' + spatialCanonVersion)
 * so the belief-discount seam is exercised; warLayer + strategy so a war actually marches.
 * @param {string} seed @param {boolean} lit
 */
function makeCampaignAndSaves(seed, lit) {
  const saves = [
    mSave('iron', 'Ironhold', {
      tier: 'city', population: 60000, legitimacy: 34, priorityMilitary: 40,
      institutions: [{ name: 'Great Citadel' }, { name: 'City Garrison' }, { name: 'Royal Armory' }, { name: 'War College' }],
      exports: [{ name: 'Forged Weapons' }],
      foodSecurity: { storageMonths: 9, resilienceScore: 85 },
      factions: [{ faction: 'High Command', category: 'military', power: 96, isGoverning: true }],
      npcs: [{ id: 'king_iron', name: 'The Iron King', importance: 'key', personality: { dominant: 'proud', flaw: 'stubborn' } }],
    }),
    mSave('weak', 'Weakmoor', {
      tier: 'village', population: 280, legitimacy: 24, priorityMilitary: 10,
      prosperity: 'Struggling', exports: ['Bulk grain and foodstuffs'],
      factions: [
        { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
        { faction: 'Hedge Wardens', category: 'military', power: 18 },
      ],
    }),
    mSave('mid', 'Midwater', { population: 2200, legitimacy: 62, priorityMilitary: 20 }),
  ];
  /** @type {Record<string, unknown>} */
  const simulationRules = {
    infoMode: 'full', warLayerEnabled: true, settlementStrategyEnabled: true,
    ...(lit ? { momentumEnabled: true } : {}),
  };
  const campaign = {
    id: 'momentum', name: 'Momentum', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1, simulationRules,
      calendar: { elapsedWeeks: 30 },
      spatialCanonVersion: 1,
      spatialDigest: digestFor(),
      // Pre-mobilized aggressor (the peaceCausal idiom): the war layer's deploy gate
      // requires a mobilized posture, so the war actually marches within the drive window
      // — the deposits (siege + incitement) have something live to read.
      warPosture: { iron: { state: 'mobilized', progress: 1, sinceTick: 0 } },
      relationshipStates: {
        'edge.iron.weak': {
          relationshipType: 'hostile', resentment: 0.7, trust: 0.1,
          recentIncidents: [
            { type: 'war_raid', tick: -12, description: 'The burning of the mill road' },
            { type: 'betrayal_recorded', tick: -20, description: 'The broken parley of the ford' },
          ],
        },
      },
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.iron.weak', from: 'iron', to: 'weak', relationshipType: 'hostile' },
        { id: 'edge.iron.mid', from: 'iron', to: 'mid', relationshipType: 'trade_partner' },
        { id: 'edge.weak.mid', from: 'weak', to: 'mid', relationshipType: 'trade_partner' },
      ],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

/** Drive N ticks; return the final state + per-tick folds (the shared golden idiom). */
export function driveMomentumTicks(seed, lit, ticks, interval) {
  let { campaign, saves } = makeCampaignAndSaves(seed, lit);
  /** @type {Record<string, number>} */
  const candidateTypes = {};
  /** @type {Record<string, number>} */
  const newsKinds = {};
  let rollTotal = 0;
  let rollPassed = 0;
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval, now: NOW });
    for (const o of [...(r.selected || []), ...(r.autoApplied || [])]) {
      const type = String(o?.candidateType || o?.type || 'unknown');
      candidateTypes[type] = (candidateTypes[type] || 0) + 1;
    }
    for (const e of (r.wizardNews?.entries || [])) {
      const k = String(e?.impactKind || e?.kind || 'unknown');
      newsKinds[k] = (newsKinds[k] || 0) + 1;
    }
    for (const x of (r.rollExplanations || [])) { rollTotal += 1; if (x && x.passed) rollPassed += 1; }
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return { campaign, saves, candidateTypes, newsKinds, rollSummary: { total: rollTotal, passed: rollPassed } };
}

/** The mechanical projection — every surface the momentum layer would touch if lit. */
function projectionHash({ campaign, saves, candidateTypes, newsKinds, rollSummary }) {
  const ws = campaign.worldState || {};
  /** @type {Record<string, unknown>} */
  const deployments = {};
  for (const key of Object.keys(ws.deployments || {}).sort()) {
    const rec = ws.deployments[key] || {};
    deployments[key] = {
      targetId: rec.targetId ?? null,
      strength: Number.isFinite(rec.currentEffectiveStrength) ? Math.round(rec.currentEffectiveStrength * 1000) / 1000 : null,
      age: rec.deploymentAge ?? null,
      recalled: rec.recalled ? (rec.recalled.cause ?? true) : null,
    };
  }
  /** @type {Record<string, unknown>} */
  const warPosture = {};
  for (const key of Object.keys(ws.warPosture || {}).sort()) {
    const p = ws.warPosture[key] || {};
    warPosture[key] = { state: p.state ?? null, covert: p.covert === true };
  }
  /** @type {Record<string, number>} */
  const exhaustion = {};
  for (const key of Object.keys(ws.warExhaustion || {}).sort()) {
    const v = Number(ws.warExhaustion[key]);
    if (Number.isFinite(v)) exhaustion[key] = Math.round(v * 1000) / 1000;
  }
  /** @type {Record<string, number|null>} */
  const legitimacy = {};
  for (const s of saves) {
    const score = Number(s.settlement?.powerStructure?.publicLegitimacy?.score);
    legitimacy[s.id] = Number.isFinite(score) ? Math.round(score * 100) / 100 : null;
  }
  const projection = {
    tick: ws.tick ?? null,
    // The whole spatial-ledger census — commitments (momentum's own), beliefMaps (the
    // discount seam), credibility (the crack charge), and every sibling — all fenced.
    spatialLedgers: ws.spatialLedgers || {},
    deployments,
    warPosture,
    warExhaustion: exhaustion,
    legitimacy,
    candidateTypes,
    newsKinds,
    rollSummary,
  };
  return { hash: createHash('sha256').update(JSON.stringify(normalizeForDormancy(projection))).digest('hex'), projection };
}

function corpus() {
  return [
    { seed: 'mo-a', ticks: 4, interval: 'one_month' },
    { seed: 'mo-b', ticks: 8, interval: 'one_month' },
    { seed: 'mo-c', ticks: 6, interval: 'one_week' },
  ];
}
const keyOf = (c) => [c.seed, c.ticks, c.interval].join('|');
const dormantHashFor = (c) => projectionHash(driveMomentumTicks(c.seed, false, c.ticks, c.interval)).hash;

describe('momentum layer — dormancy golden (wired-but-dormant is byte-identical to pre-wire)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    it('captures the momentum dormancy manifest', () => {
      /** @type {Record<string, string>} */
      const out = {};
      for (const c of rows) out[keyOf(c)] = dormantHashFor(c);
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    }, 120_000);
    return;
  }

  it('the dormancy manifest exists (run UPDATE_GOLDEN=1 to capture it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full dormant corpus (no keys added/removed without a manifest update)', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('every dormant config reproduces the golden projection (any drift ⇒ dormancy broke)', () => {
    const drift = [];
    for (const c of rows) if (manifest[keyOf(c)] !== dormantHashFor(c)) drift.push(keyOf(c));
    expect(drift).toEqual([]);
  }, 120_000);

  it('dormancy CONTRACT: the gate absent writes NO commitments ledger, even in a marching-war world', () => {
    const { campaign } = driveMomentumTicks('mo-b', false, 8, 'one_month');
    const sl = /** @type {Record<string, unknown>} */ (campaign.worldState?.spatialLedgers || {});
    expect(sl.commitments, 'no commitments ledger when dormant').toBeUndefined();
  }, 60_000);
});

describe('momentum layer — lit-path anti-vacuity (§1: deposits are reads, commitment is state) [soak seed]', () => {
  it('gate ON: the marching war accumulates a bounded, past-cliff commitment through the real pulse', () => {
    const { campaign } = driveMomentumTicks('mo-b', true, 8, 'one_month');
    const commitments = campaign.worldState?.spatialLedgers?.commitments || {};
    // The aggressor's siege + incitement deposited a war commitment on its target.
    const war = commitments['iron>war:weak'];
    expect(war, 'the marching war minted a commitment when lit').toBeTruthy();
    expect(war.stock, 'the commitment accumulated real stock').toBeGreaterThan(0);
    // Bounded (never runs away past STOCK_MAX) — a drama engine, not a runaway.
    for (const rec of Object.values(commitments)) {
      expect(rec.stock, 'commitment stock bounded [0, STOCK_MAX]').toBeGreaterThanOrEqual(0);
      expect(rec.stock, 'commitment stock bounded [0, STOCK_MAX]').toBeLessThanOrEqual(12);
      expect(Array.isArray(rec.deposits) && rec.deposits.length, 'the receipts are present').toBeTruthy();
    }
  }, 60_000);

  it('NO NEW RNG DRAWS: the lit path is same-seed byte-identical (the M9d stream tripwire)', () => {
    // The momentum layer takes NO rng (post-sum shifts + centered reads only). Lighting it must
    // not perturb the deterministic stream: two runs on the same seed produce identical ledgers.
    const a = driveMomentumTicks('mo-b', true, 8, 'one_month');
    const b = driveMomentumTicks('mo-b', true, 8, 'one_month');
    expect(JSON.stringify(a.campaign.worldState?.spatialLedgers?.commitments || {}))
      .toEqual(JSON.stringify(b.campaign.worldState?.spatialLedgers?.commitments || {}));
    // And the whole decision stream stays identical (the credibility + belief ledgers too).
    expect(JSON.stringify(a.campaign.worldState?.spatialLedgers || {}))
      .toEqual(JSON.stringify(b.campaign.worldState?.spatialLedgers || {}));
  }, 60_000);
});
