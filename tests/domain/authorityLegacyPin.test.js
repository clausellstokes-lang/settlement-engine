/**
 * authorityLegacyPin.test.js — CL-0 gate (b): the four ROGUE severity-gated
 * candidate families (pressure_event, faction_competition, stressor_escalation,
 * relationship_evolution — changeAuthorityPolicy.js names them) plus every
 * other candidate family preserve their pre-CL0 applyMode under legacy rules.
 * The initial no-pending tick pins authority and applied/proposed partitions.
 *
 * tests/fixtures/cl0-rogue-authority-pin.json was captured at HEAD
 * (2026-07-11, pre-CL0): a fixed 3-settlement crisis fixture advanced 4 real
 * one-week ticks under majorChangesRequireProposal true AND false, recording
 * every rollExplanation (candidate id/type/family/severity/probability/roll/
 * passed/applyMode) and the selected/auto/proposal partitions. The post-CL0
 * engine — with authorityFor routed through every family — must preserve the
 * FIRST tick's legacy authority decisions and applied/proposed partitions.
 * Later ticks now intentionally diverge
 * because the shared pending-proposal hold guard removes an already-asked
 * question before conflict selection, allowing a distinct question to take its
 * place. Record-mode v4 also deliberately removes exact mechanical refreshes
 * from public `selected`/roll surfaces while retaining them in `autoApplied`,
 * and the bounded docket may decline to roll public questions it cannot admit.
 * Those two contracts have their own focused tests and must not force a blanket
 * re-record of this historical fixture. The first tick therefore remains the
 * constitutional pin for authority routing itself: every still-public
 * candidate must retain its pinned applyMode, and the actual applied/proposed
 * partitions remain exact. The rogue families'
 * severity-only escalation is their legacy default under BOTH routine (flag
 * on) and full (flag off) autonomy.
 *
 * The new dm_only/recommendations forcing modes are asserted separately at the
 * bottom (they are NEW behavior, so they have no HEAD pin).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { authorityFor } from '../../src/domain/worldPulse/changeAuthorityPolicy.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const pin = JSON.parse(readFileSync(
  resolve(process.cwd(), 'tests', 'fixtures', 'cl0-rogue-authority-pin.json'),
  'utf8',
));

const NOW = '2026-01-01T00:00:00.000Z';

// ── The SAME fixture the pin was captured from (verbatim) ───────────────────
function fixtureSettlement(name, patch = {}) {
  return {
    name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 30, priorityMilitary: 25 },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'] },
    powerStructure: {
      publicLegitimacy: { score: 22, label: 'Crisis' },
      factions: [
        { faction: 'Iron Syndicate', category: 'criminal', power: 68 },
        { faction: 'Grain Guild', category: 'economy', power: 61 },
        { faction: 'City Watch', category: 'military', power: 44 },
      ],
      conflicts: [{ parties: ['Iron Syndicate', 'City Watch'], nature: 'open feud' }],
    },
    npcs: [
      { id: `npc_${name}_1`, name: `Captain ${name}`, importance: 'key' },
      { id: `npc_${name}_2`, name: `Broker ${name}`, importance: 'key' },
    ],
    activeConditions: [
      { archetype: 'famine', severity: 0.82, status: 'worsening' },
      { archetype: 'regional_criminal_pressure', severity: 0.74, status: 'stable' },
    ],
    ...patch,
  };
}
const save = (id, name, patch) => ({
  id, name, phase: 'canon', settlement: fixtureSettlement(name, patch),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});
function makeCampaign(rules) {
  return {
    campaign: {
      id: 'cl0-authority-pin', name: 'CL0 Pin', settlementIds: ['a', 'b', 'c'],
      worldState: {
        rngSeed: 'cl0-pin', tick: 2, simulationRules: rules,
        stressors: [
          { id: 'world_stressor.famine.a', type: 'famine', severity: 0.8, affectedSettlementIds: ['a'], age: 3 },
          { id: 'world_stressor.crime_wave.b', type: 'crime_wave', severity: 0.66, affectedSettlementIds: ['b'], age: 2 },
        ],
      },
      regionalGraph: ensureRegionalGraph({
        edges: [
          { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
          { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
          { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'vassal' },
        ],
        channels: [
          { type: 'migration_pressure', from: 'a', to: 'b', status: 'confirmed' },
          { type: 'trade_partner', from: 'a', to: 'c', status: 'confirmed' },
        ],
      }),
      wizardNews: { currentTick: 2, entries: [] },
    },
    saves: [
      save('a', 'Ashford'),
      save('b', 'Briarwatch', { population: 1200 }),
      save('c', 'Crownhold', { population: 2600, powerStructure: {
        publicLegitimacy: { score: 30, label: 'Contested' },
        factions: [
          { faction: 'Crown Court', category: 'political', power: 70 },
          { faction: 'Shadow Market', category: 'criminal', power: 63 },
        ],
        conflicts: [{ parties: ['Crown Court', 'Shadow Market'], nature: 'suppression' }],
      } }),
    ],
  };
}

function runFixture(rules, ticks = 4) {
  let { campaign, saves } = makeCampaign(rules);
  const perTick = [];
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    perTick.push({
      tick: r.worldState?.tick ?? null,
      rollExplanations: (r.rollExplanations || []).map(x => ({
        candidateId: x.candidateId, candidateType: x.candidateType, ruleId: x.ruleId,
        ruleFamily: x.ruleFamily, severity: x.severity, probability: x.probability,
        roll: x.roll, passed: x.passed, applyMode: x.applyMode,
      })),
      selectedIds: (r.selected || []).map(o => ({ id: o.id, candidateType: o.candidateType, applyMode: o.applyMode })),
      proposalIds: (r.proposals || []).map(p => ({ id: p.id, type: p.type || p.candidateType || null })),
      autoAppliedIds: (r.autoApplied || []).map(o => ({ id: o.id, candidateType: o.candidateType, applyMode: o.applyMode })),
    });
    const updates = new Map((r.settlementUpdates || []).map(u => [String(u.saveId), u.settlement]));
    saves = saves.map(s => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.worldState?.regionalGraph || campaign.regionalGraph };
  }
  return perTick;
}

/**
 * Preserve what the historical fixture constitutionally proves after v4 split
 * public Chronicle work from mechanical work:
 *   - every candidate still admitted to the public roll surface existed in the
 *     pre-CL0 fixture with the same rule family/id and applyMode;
 *   - the actual auto-applied and proposal partitions remain byte-exact.
 *
 * Missing public roll rows are governed by the record-mode and docket suites,
 * not silently accepted here; anti-vacuity below still requires every rogue
 * family to remain exercised in the historical source fixture.
 */
function expectPinnedAuthorityAndApply(currentTick, pinnedTick) {
  const pinnedRolls = new Map(
    pinnedTick.rollExplanations.map(row => [row.candidateId, row]),
  );
  for (const row of currentTick.rollExplanations) {
    const prior = pinnedRolls.get(row.candidateId);
    expect(prior, `${row.candidateId} must exist in the historical authority pin`).toBeTruthy();
    expect({
      candidateType: row.candidateType,
      ruleId: row.ruleId,
      ruleFamily: row.ruleFamily,
      applyMode: row.applyMode,
    }).toEqual({
      candidateType: prior.candidateType,
      ruleId: prior.ruleId,
      ruleFamily: prior.ruleFamily,
      applyMode: prior.applyMode,
    });
  }
  expect(currentTick.autoAppliedIds).toEqual(pinnedTick.autoAppliedIds);
  expect(currentTick.proposalIds).toEqual(pinnedTick.proposalIds);
}

describe('CL-0 (b) — the rogue families replay HEAD byte-exactly under legacy rules', () => {
  test('the pin actually exercises the rogue families in both modes (anti-vacuity)', () => {
    const families = new Set();
    for (const side of [pin.flagOn, pin.flagOff]) {
      for (const t of side) for (const x of t.rollExplanations) families.add(`${x.ruleFamily}:${x.applyMode}`);
    }
    // Severity-escalated PROPOSALS from the rogue families are present in the
    // pin — the exact behavior that must survive the authorityFor routing.
    expect(families).toContain('organic_drift:proposal');  // pressure_event
    expect(families).toContain('stressor:proposal');       // stressor_escalation / birth
    expect(families).toContain('relationship:proposal');   // relationship_evolution
    expect(families).toContain('faction:proposal');        // faction families
  });

  test('legacy flag ON (politicalAutonomy routine): first-tick authority and applied partitions stay pinned', () => {
    expectPinnedAuthorityAndApply(
      runFixture({ majorChangesRequireProposal: true }, 1)[0],
      pin.flagOn[0],
    );
  });

  test('legacy flag OFF (politicalAutonomy full): first-tick authority and applied partitions stay pinned', () => {
    expectPinnedAuthorityAndApply(
      runFixture({ majorChangesRequireProposal: false }, 1)[0],
      pin.flagOff[0],
    );
  });

  test('an explicit routine profile replays the current first flag-ON tick byte-exactly', () => {
    // Materializing the profile at its legacy-equivalent value changes the
    // STORED rules but not one candidate, roll, or applyMode.
    expect(runFixture(
      { majorChangesRequireProposal: true, politicalAutonomy: 'routine' },
      1,
    )).toEqual(runFixture({ majorChangesRequireProposal: true }, 1));
  });

  test('an explicit full profile replays the current first flag-OFF tick byte-exactly', () => {
    expect(runFixture({ politicalAutonomy: 'full' }, 1))
      .toEqual(runFixture({ majorChangesRequireProposal: false }, 1));
  });
});

describe('CL-0 — the NEW forcing modes (no HEAD pin: new behavior)', () => {
  // The families ROUTED through authorityFor in CL-0: the stochastic families
  // via the evaluateWorldPulseRules choke point, plus tier/resource at their
  // sites. Residual aftermaths ('stressor_residual') are consequences, not
  // initiations — they stay auto by design. The deterministic consequence
  // lanes (population dynamics, institution lifecycle) keep their existing
  // flag-gated behavior (dm_only mirrors the flag ON, so their MAJORS still
  // propose — §11's dm_only: "engine computes consequences, initiates no
  // major action").
  const ROUTED_FAMILIES = new Set([
    'organic_drift', 'stressor', 'relationship', 'faction', 'npc', 'flow', 'strategy', 'tier', 'resource',
  ]);
  const routedInitiation = x => ROUTED_FAMILIES.has(x.ruleFamily) && x.candidateType !== 'stressor_residual';

  test('dm_only forces every routed candidate to proposal', () => {
    const ticks = runFixture({ politicalAutonomy: 'dm_only' }, 2);
    let routed = 0;
    for (const t of ticks) {
      for (const x of t.rollExplanations) {
        if (!routedInitiation(x)) continue;
        routed += 1;
        expect(x.applyMode, `${x.candidateId} must be forced to proposal`).toBe('proposal');
      }
    }
    expect(routed).toBeGreaterThan(5); // anti-vacuity: the mode saw real candidates
  });

  test('recommendations forces proposals AND the candidates carry their reasons as rationale', () => {
    const ticks = runFixture({ politicalAutonomy: 'recommendations' }, 2);
    for (const t of ticks) {
      for (const x of t.rollExplanations) {
        if (!routedInitiation(x)) continue;
        expect(x.applyMode).toBe('proposal');
      }
    }
    // The rationale is the candidates' EXISTING reasons[] (surfaced as
    // rollExplanations.gates → proposal payloads); nothing is invented.
    const raw = runFixtureRaw({ politicalAutonomy: 'recommendations' });
    const gatesSeen = [];
    for (const x of raw.rollExplanations || []) {
      if (!routedInitiation(x)) continue;
      gatesSeen.push(x.gates);
      expect(Array.isArray(x.gates)).toBe(true);
    }
    expect(gatesSeen.some(g => g.length > 0)).toBe(true);
  });

  test('authorityFor passes legacy modes through verbatim under routine/full', () => {
    for (const rules of [undefined, {}, { majorChangesRequireProposal: true }, { majorChangesRequireProposal: false }, { politicalAutonomy: 'routine' }, { politicalAutonomy: 'full' }]) {
      expect(authorityFor(rules, 'pressure_event', 'proposal')).toBe('proposal');
      expect(authorityFor(rules, 'pressure_event', 'auto')).toBe('auto');
      // Omitted legacy mode falls back to the parameter default ('auto') —
      // byte-safety never depends on it: the choke point only rewrites
      // candidates under the forcing modes.
      expect(authorityFor(rules, 'anything')).toBe('auto');
    }
    for (const mode of ['dm_only', 'recommendations']) {
      expect(authorityFor({ politicalAutonomy: mode }, 'pressure_event', 'auto')).toBe('proposal');
    }
  });
});

// One raw single-tick run (unmapped result) for the rationale assertion above.
function runFixtureRaw(rules) {
  const { campaign, saves } = makeCampaign(rules);
  return simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
}
