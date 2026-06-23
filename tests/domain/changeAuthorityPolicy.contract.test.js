/**
 * changeAuthorityPolicy.contract.test.js — guards the canonical DM change-authority
 * contract (src/domain/worldPulse/changeAuthorityPolicy.js) against silent drift.
 *
 * Two layers:
 *  1. BEHAVIORAL — runs the proposal-gated flow generators with the proposal flag
 *     ON vs OFF and asserts the gate actually flips applyMode. This is the live,
 *     executable half of the contract.
 *  2. SOURCE-ANCHORED — for every documented change-type, asserts the live
 *     generator source still carries the applyMode expression the policy claims.
 *     A future edit that flips an authority (e.g. makes conquest proposal-gated,
 *     or migrates a severity-gated family onto the flag) fails here.
 *
 * The policy reflects REAL current behavior, so this suite passes against today's
 * code. The two FLAGGED tensions are recorded in the policy, not "fixed."
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

import {
  CHANGE_AUTHORITY_POLICY,
  CHANGE_AUTHORITY_FLAGGED,
} from '../../src/domain/worldPulse/changeAuthorityPolicy.js';
import { deriveFlowCandidates } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const wpDir = resolve(here, '../../src/domain/worldPulse');
const sourceFor = (mod) => readFileSync(resolve(wpDir, mod), 'utf8');

// A severe famine that displaces >=8% of the source population: above the
// MIGRATION_PROPOSAL_FRACTION gate, so it escalates to proposal IFF the flag is on.
const migrationSnapshot = (rules) => ({
  worldState: {
    tick: 5,
    simulationRules: rules,
    stressors: [{ id: 'world_stressor.famine.a', type: 'famine', severity: 1, affectedSettlementIds: ['a'] }],
  },
  regionalGraph: ensureRegionalGraph({ channels: [{ type: 'migration_pressure', from: 'a', to: 'b', status: 'confirmed' }] }),
  byId: new Map([
    ['a', { id: 'a', name: 'Ashford', settlement: { population: 2000 }, activeConditions: [] }],
    ['b', { id: 'b', name: 'Briar', settlement: { population: 1500 }, activeConditions: [] }],
  ]),
  settlements: [
    { id: 'a', name: 'Ashford', activeConditions: [], causal: { scores: {} } },
    { id: 'b', name: 'Briar', activeConditions: [], causal: { scores: {} } },
  ],
});

describe('change-authority contract — behavioral (proposal-gated families consult the flag)', () => {
  test('a major migration flow is PROPOSAL when majorChangesRequireProposal is on', () => {
    const flows = deriveFlowCandidates(migrationSnapshot({ majorChangesRequireProposal: true }), { tick: 5 });
    const mig = flows.find(f => f.candidateType === 'flow_migration');
    expect(mig).toBeTruthy();
    expect(mig.applyMode).toBe('proposal');
  });

  test('the SAME migration flow downgrades to AUTO when the flag is off', () => {
    const flows = deriveFlowCandidates(migrationSnapshot({ majorChangesRequireProposal: false }), { tick: 5 });
    const mig = flows.find(f => f.candidateType === 'flow_migration');
    expect(mig).toBeTruthy();
    expect(mig.applyMode).toBe('auto');
  });
});

// For each documented change-type, the exact applyMode expression the live
// generator must still carry. If a generator's gate is rewritten, update BOTH the
// policy and this anchor deliberately — that is the point of the guard.
const SOURCE_ANCHORS = Object.freeze({
  // proposal-gated: gate reads majorChangesRequireProposal.
  flow_migration: "applyMode: requireProposal && fraction >= MIGRATION_PROPOSAL_FRACTION ? 'proposal' : 'auto'",
  flow_trade_scarcity: "applyMode: requireProposal && severity >= TRADE_PROPOSAL_SEVERITY ? 'proposal' : 'auto'",
  population_dynamics: "applyMode: major && rules.majorChangesRequireProposal ? 'proposal' : 'auto'",
  tier_drift_collapse: "applyMode: rules.majorChangesRequireProposal && severity >= 0.78 ? 'proposal' : 'auto'",
  institution_lifecycle: "applyMode: rules.majorChangesRequireProposal && severity >= 0.78 ? 'proposal' : 'auto'",
  // severity-gated: proposal on severity alone, no flag.
  pressure_event: "applyMode: pressure.score >= 0.72 ? 'proposal' : 'auto'",
  faction_competition: "applyMode: severity >= 0.74 ? 'proposal' : 'auto'",
  stressor_escalation: "applyMode: severity >= 0.78 ? 'proposal' : 'auto'",
  relationship_evolution: 'applyMode: severity >= 0.72 ? "proposal" : "auto"',
  // severity-gated, newly-mapped sites (each distinct from the families above).
  faction_institution_capture: "applyMode: severity >= 0.68 || criminalSuppression ? 'proposal' : 'auto'",
  faction_rival_power_contest: "applyMode: severity >= 0.7 ? 'proposal' : 'auto'",
  // A SECOND stressor gate (pressure-born birth), distinct from stressor_escalation.
  stressor_birth: "const major = pressure.score >= 0.78 || ['occupation', 'magic_deadzone', 'siege', 'coup_detat'].includes(type);",
  // always-proposal: unconditional 'proposal', no flag / severity / lock.
  npc_adversarial_action: "const proposal = severity >= action.proposalAt || ['defect', 'sabotage', 'seek_promotion', 'undermine_rival'].includes(actionFamily);",
  faction_government_challenge: "ruleId: `faction_${band}_government_challenge`,\n    severity,\n    probability: (band === 'crisis' ? 0.12 : 0.04) + severity * (band === 'crisis' ? 0.34 : 0.22),\n    applyMode: 'proposal'",
  relationship_label_change: 'candidateType,\n    applyMode: "proposal",',
  tier_change: "ruleFamily: 'tier',\n    targetSaveId: item.id,\n    severity: drift.severity,\n    probability: chance,\n    // Honor majorChangesRequireProposal, consistent with resource_depletion in\n    // this module: a tier change stays a DM proposal under the conservative\n    // default (flag on), and auto-applies only when a campaign opts out of\n    // proposal gating (flag off, e.g. dramatic_campaign).\n    applyMode: rules.majorChangesRequireProposal ? 'proposal' : 'auto',",
  // structural-proposal: auto by default; one branch routes via a proposal-only lever.
  strategy_move: "applyMode: proposal ? 'proposal' : 'auto'",
  // auto: bounded logical consequences. Anchored on the ruleId + applyMode block
  // so a flip AT THE SITE is caught (a bare "applyMode: 'auto'" would match any of
  // the module's other auto outcomes and miss site-local drift).
  conquest: "ruleId: 'war_layer_conquest',\n      ruleFamily: 'stressor',\n      applyMode: 'auto'",
  occupation_transition: "ruleId: `occupation_${archetype}`,\n    ruleFamily: 'stressor',\n    applyMode: 'auto'",
  occupation_vassalized: "ruleId: 'occupation_vassalized',\n      ruleFamily: 'relationship',\n      applyMode: 'auto'",
  npc_goal_culmination: "probability: 0.9,\n    applyMode: 'auto'",
  trade_war: "ruleId: `trade_war_${archetype}`,\n    ruleFamily: 'stressor',\n    applyMode: 'auto'",
  // auto with a separate lock axis (NOT the proposal flag).
  coup_succeeded: "applyMode: locked ? 'proposal' : 'auto'",
});

describe('change-authority contract — source anchors match the policy', () => {
  test('every policy change-type has a source anchor and vice versa', () => {
    expect(Object.keys(SOURCE_ANCHORS).sort()).toEqual(Object.keys(CHANGE_AUTHORITY_POLICY).sort());
  });

  for (const [changeType, entry] of Object.entries(CHANGE_AUTHORITY_POLICY)) {
    test(`${changeType} (${entry.authority}) still carries its live applyMode gate in ${entry.module}`, () => {
      const src = sourceFor(entry.module);
      expect(src.includes(SOURCE_ANCHORS[changeType])).toBe(true);

      // The flag-consulting claim must match the anchor's text.
      const anchorReadsFlag = SOURCE_ANCHORS[changeType].includes('RequireProposal')
        || SOURCE_ANCHORS[changeType].includes('requireProposal');
      expect(anchorReadsFlag).toBe(entry.consultsProposalFlag);

      // Authority-class invariants on the gate's shape.
      if (entry.authority === 'auto') {
        expect(SOURCE_ANCHORS[changeType]).toContain("applyMode: 'auto'");
        expect(SOURCE_ANCHORS[changeType]).not.toContain('proposal');
      }
      if (entry.authority === 'proposal-gated') {
        expect(anchorReadsFlag).toBe(true);
      }
      if (entry.authority === 'severity-gated') {
        expect(anchorReadsFlag).toBe(false);
        expect(SOURCE_ANCHORS[changeType]).toMatch(/'proposal'|"proposal"|major/);
      }
      if (entry.authority === 'always-proposal') {
        // No flag, no severity-driven downgrade path in the gate text.
        expect(anchorReadsFlag).toBe(false);
        expect(SOURCE_ANCHORS[changeType]).toMatch(/'proposal'|"proposal"|\.includes\(actionFamily\)/);
        // An always-proposal anchor must NOT be a bare auto outcome.
        expect(SOURCE_ANCHORS[changeType]).not.toContain("applyMode: 'auto'");
      }
      if (entry.authority === 'structural-proposal') {
        // Auto by default with a single branch routing to proposal.
        expect(anchorReadsFlag).toBe(false);
        expect(SOURCE_ANCHORS[changeType]).toContain("'proposal' : 'auto'");
      }
    });
  }
});

describe('change-authority contract — newly-mapped sites carry their live authority', () => {
  // The npc adversarial families are forced to proposal REGARDLESS of severity.
  // Assert the forcing list is exactly {defect, sabotage, seek_promotion,
  // undermine_rival} so adding/removing a family (which would flip its authority)
  // fails here.
  test('npc adversarial families are forced to proposal independent of severity', () => {
    const src = sourceFor('npcAgency.js');
    expect(src).toContain(
      "severity >= action.proposalAt || ['defect', 'sabotage', 'seek_promotion', 'undermine_rival'].includes(actionFamily)",
    );
  });

  // tierResourceDynamics has TWO distinct applyMode gates, both now flag-gated:
  // the tier change (flag alone) and resource_depletion (flag + severity).
  // Assert BOTH live so a flip at either site is caught despite sharing a module.
  test('tierResourceDynamics keeps both the flag-gated tier gate and the flag-gated depletion gate', () => {
    const src = sourceFor('tierResourceDynamics.js');
    expect(src).toContain("ruleFamily: 'tier',");
    expect(src).toContain("applyMode: rules.majorChangesRequireProposal ? 'proposal' : 'auto'"); // tierCandidate (flag-gated)
    expect(src).toContain(
      "applyMode: rules.majorChangesRequireProposal && severity >= 0.78 ? 'proposal' : 'auto'",
    ); // resource_depletion (flag-gated)
  });

  // relationshipEvolution has TWO distinct gates too: labelProposal (always
  // proposal) and the severity-gated internal-drift path. Assert both live.
  test('relationshipEvolution keeps both the always-proposal label gate and the severity-gated drift gate', () => {
    const src = sourceFor('relationshipEvolution.js');
    expect(src).toContain('applyMode: "proposal",'); // labelProposal (always-proposal)
    expect(src).toContain('applyMode: severity >= 0.72 ? "proposal" : "auto"'); // internal drift (severity-gated)
  });

  // The strategy split must stay structural: only sue_for_peace passes a proposal.
  test('strategyCandidate routes to proposal only when a proposal lever is passed', () => {
    const src = sourceFor('settlementStrategy.js');
    expect(src).toContain("applyMode: proposal ? 'proposal' : 'auto'");
  });
});

describe('change-authority contract — flagged tensions are recorded, not fixed', () => {
  test('the severity-gated-bypass tension stays on the books for a product decision', () => {
    const ids = CHANGE_AUTHORITY_FLAGGED.map(f => f.id);
    expect(ids).toContain('severity-gated-families-bypass-flag');
  });

  test('the resolved tier-authority-split tension is no longer on the books', () => {
    const ids = CHANGE_AUTHORITY_FLAGGED.map(f => f.id);
    expect(ids).not.toContain('tier-authority-split-in-one-module');
  });
});
