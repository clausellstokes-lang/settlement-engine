/**
 * routeNetworkCertification.test.js — W-J slice J1, the SUBSYSTEM CERTIFICATION
 * row for `routeLifecycleEnabled` (docs/DESIGN_ROUTE_LIFECYCLE.md §13).
 *
 * THE ROW IS REGISTERED FROM THIS SLICE'S FIRST COMMIT, and this file holds it to
 * the contract in three ways beyond what the totality walker asks:
 *
 *   1. THE ROW IS WELL SHAPED: the tempo and evidence vocabularies, the declared
 *      module paths existing on disk, at least one aliveness channel, and every
 *      invariant carrying a receipt-expressible check.
 *   2. THE ROW IS HONEST ABOUT WHAT J1 IS: it claims no event type, because the
 *      slice emits none, and it states the non-obvious legitimate zero (an
 *      isolated realm writes no ledger key at all) that a reader would otherwise
 *      grade as a dead subsystem.
 *   3. THE DECLARATION THAT MAKES REGISTRATION POSSIBLE IS PINNED. `routeLifecycleEnabled`
 *      is a VIRTUAL flag, absent from DEFAULT_SIMULATION_RULES, so it is censused
 *      ONLY because the full_simulation preset declares it at FALSE. Delete that
 *      declaration and the row becomes `unknownRows` and the walker reds — which
 *      is the coupling this file makes visible instead of leaving to be rediscovered.
 *      It is pinned DECLARED AND DARK: lighting it is a separate, later decision,
 *      and this file reds and says so if someone flips it early.
 */
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
  SUBSYSTEM_CERTIFICATION_REGISTRY,
  SUBSYSTEM_SOAK_EVIDENCE,
  SUBSYSTEM_TEMPOS,
  auditSubsystemCoverage,
  simulationRuleKeys,
} from '../../src/domain/certification/subsystemCertification.js';
import { WAVE_SUBSYSTEM_ROWS } from '../../src/domain/certification/subsystemRowsWaves.js';
import { BEHAVIORAL_MOVER_FAMILIES } from '../../src/domain/certification/behavioralContract.js';
import { DEFAULT_SIMULATION_RULES, SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ROW = WAVE_SUBSYSTEM_ROWS.find(row => row.rule === 'routeLifecycleEnabled');

describe('J1 the certification row is registered and well shaped', () => {
  it('is a live member of the wave lane, not a staged constant', () => {
    expect(ROW, 'the routeLifecycleEnabled row is missing from WAVE_SUBSYSTEM_ROWS').toBeTruthy();
    expect(SUBSYSTEM_CERTIFICATION_REGISTRY.map(r => r.rule)).toContain('routeLifecycleEnabled');
  });

  it('names the rule this slice gates', () => {
    expect(ROW.rule).toBe('routeLifecycleEnabled');
    expect(ROW.title.length).toBeGreaterThan(0);
  });

  it('declares tempo and soak evidence from the closed vocabularies', () => {
    expect(SUBSYSTEM_TEMPOS).toContain(ROW.expectedTempo);
    expect(ROW.expectedTempo).toBe('multi_year');
    expect(SUBSYSTEM_SOAK_EVIDENCE).toContain(ROW.soakEvidence);
    // 'indirect', never 'unobserved': the UNOBSERVED escape hatch is a ceilinged,
    // reviewed population (subsystemCertificationCorpus), and a sidecar-only row
    // does not need it, because the corpus contract already grades that SHAPE
    // UNOBSERVED on a v4 envelope. Claiming the hatch here would spend a slot this
    // row has not earned and red that ceiling.
    expect(ROW.soakEvidence).toBe('indirect');
  });

  it('every declared module path exists on disk (the row\'s provenance)', () => {
    const paths = ROW.module.split(',').map(p => p.trim());
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(existsSync(join(ROOT, path)), `module path does not exist: ${path}`).toBe(true);
    }
  });

  it('declares at least one aliveness channel', () => {
    const channels = ROW.aliveness.eventTypes.length
      + ROW.aliveness.moverFamilies.length
      + ROW.aliveness.stateKeys.length;
    expect(channels).toBeGreaterThan(0);
  });

  it('the ONE declared channel is the ledger key this slice actually writes', () => {
    expect(ROW.aliveness.stateKeys).toEqual(['spatialLedgers.routeNetwork']);
  });

  it('claims no event type, because J1 emits none (the evidence law)', () => {
    expect(ROW.aliveness.eventTypes).toEqual([]);
    expect(ROW.aliveness.moverFamilies).toEqual([]);
  });

  it('any family it ever claims must be a real behavioural family', () => {
    for (const family of ROW.aliveness.moverFamilies) {
      expect(BEHAVIORAL_MOVER_FAMILIES).toContain(family);
    }
  });

  it('every invariant is named and carries a receipt-expressible check', () => {
    expect(ROW.invariants.length).toBeGreaterThanOrEqual(1);
    for (const invariant of ROW.invariants) {
      expect(invariant.name.length).toBeGreaterThan(0);
      expect(invariant.description.length).toBeGreaterThan(0);
      expect(invariant.check.length).toBeGreaterThan(0);
      expect(invariant.check).toMatch(/[Ee]xpressible/);
    }
  });

  it('states the non-obvious zero a reader would otherwise misread as death', () => {
    // A lit realm whose members are all isolated legitimately carries NO ledger
    // key, because writeRouteNetwork drops an empty network. A certification row
    // that did not say so would invite a false SILENT verdict.
    expect(ROW.aliveness.other).toContain('isolation');
  });
});

describe('J1 the declaration that makes the row registrable', () => {
  it('the key is DECLARED in a preset spread, which is why the census sees it', () => {
    const keys = simulationRuleKeys();
    expect(keys.length).toBeGreaterThanOrEqual(40);
    // The census reads DEFAULT_SIMULATION_RULES plus the preset override spreads.
    // settlementLifecycleEnabled is the anchor: a VIRTUAL flag exactly like this
    // one, censused only through a preset spread, so its presence proves the
    // census genuinely reaches virtual flags.
    expect(keys).toContain('settlementLifecycleEnabled');
    expect(keys).toContain('routeLifecycleEnabled');
  });

  it('the key stays VIRTUAL: absent from the defaults, so preset identity is untouched', () => {
    // stressorsEnabled is a real DEFAULT boolean travelling the same key list, so
    // it anchors the collection as live rather than emptied or re-shaped.
    expectAbsentWithAnchor(
      Object.keys(DEFAULT_SIMULATION_RULES), 'routeLifecycleEnabled', 'stressorsEnabled',
      'routeLifecycleEnabled must not enter DEFAULT_SIMULATION_RULES: that would serialize'
      + ' new bytes into every legacy save and enlist the key in RULE_COMPARISON_KEYS,'
      + ' collapsing preset identity',
    );
  });

  it('and it is declared DARK: exactly one preset declares it, at false', () => {
    const declaring = Object.entries(SIMULATION_RULE_PRESETS)
      .filter(([, preset]) => 'routeLifecycleEnabled' in (preset.rules || {}));
    expect(declaring.length).toBe(1);
    for (const [id, preset] of declaring) {
      expect(
        preset.rules.routeLifecycleEnabled,
        `preset ${id} LIT routeLifecycleEnabled. W-J is not ready to be lit: J2's`
        + ' flows, J3\'s charter and decay events and J4\'s consumers are not built,'
        + ' so a lit world would carry a genesis network that nothing ever reads or'
        + ' updates. Lighting belongs at the declared golden boundary, with a'
        + ' re-recorded dormancy golden and a stated cause.',
      ).toBe(false);
    }
  });

  it('DELETING the declaration would red the totality walker (the coupling, executed)', () => {
    const withoutKey = simulationRuleKeys().filter(k => k !== 'routeLifecycleEnabled');
    const audit = auditSubsystemCoverage({
      ruleKeys: withoutKey,
      registry: SUBSYSTEM_CERTIFICATION_REGISTRY,
      pendingKeys: SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
    });
    expect(audit.ok).toBe(false);
    expect(audit.unknownRows).toEqual(['routeLifecycleEnabled']);
  });

  it('the live partition is exact, so this slice broke nothing', () => {
    const audit = auditSubsystemCoverage({
      ruleKeys: simulationRuleKeys(),
      registry: SUBSYSTEM_CERTIFICATION_REGISTRY,
      pendingKeys: SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
    });
    expect(audit).toMatchObject({
      ok: true, missing: [], unknownRows: [], unknownPending: [], claimedTwice: [], duplicatedRows: [],
    });
    expect(audit.covered + audit.pending).toBe(simulationRuleKeys().length);
  });

  it('the row is claimed exactly once, never both authored and pending', () => {
    // majorChangesRequireProposal is the lane-wide pending list's live member, so it
    // anchors that list as populated rather than silently emptied.
    expectAbsentWithAnchor(
      SUBSYSTEM_CERTIFICATION_PENDING_KEYS, 'routeLifecycleEnabled',
      'majorChangesRequireProposal', 'the row is authored, so it may not also be pending',
    );
    expect(SUBSYSTEM_CERTIFICATION_REGISTRY.filter(r => r.rule === 'routeLifecycleEnabled'))
      .toHaveLength(1);
  });
});
