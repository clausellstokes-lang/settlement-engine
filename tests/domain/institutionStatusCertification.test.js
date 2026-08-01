/**
 * institutionStatusCertification.test.js — W-K slice K1, the SUBSYSTEM
 * CERTIFICATION row for `magicEconomyEnabled` (docs/DESIGN_MAGIC_ECONOMY.md §12).
 *
 * The row is registered from this slice's first commit, and this file holds it to the
 * contract in three ways beyond what the totality walker asks:
 *
 *   1. THE ROW IS WELL SHAPED: closed tempo and evidence vocabularies, declared module
 *      paths that exist on disk, at least one aliveness channel, and every invariant
 *      carrying a receipt-expressible check.
 *   2. THE ROW IS HONEST ABOUT WHAT K1 IS: it claims no event type, because the slice
 *      mints no pulse candidate, and it states the non-obvious legitimate zero (a lit
 *      world with nothing wrong with it writes no ledger key at all) that a reader
 *      would otherwise grade as a dead subsystem.
 *   3. THE DECLARATION THAT MAKES REGISTRATION POSSIBLE IS PINNED. `magicEconomyEnabled`
 *      is VIRTUAL, absent from DEFAULT_SIMULATION_RULES, so it is censused ONLY because
 *      the full_simulation preset declares it at FALSE. Delete that declaration and the
 *      row becomes `unknownRows` and the walker reds, which is the coupling this file
 *      makes visible instead of leaving to be rediscovered. It is pinned DECLARED AND
 *      DARK: lighting it is a separate, later decision, and this file reds and says so
 *      if someone flips it early.
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
import { EXEMPT_LEDGER_KEYS, TRACKED_LEDGER_KEYS } from '../../src/lib/spatialUsage.js';
import { INSTITUTION_STATUS_LEDGER } from '../../src/domain/worldPulse/institutionStatusModel.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ROW = WAVE_SUBSYSTEM_ROWS.find(row => row.rule === 'magicEconomyEnabled');

describe('K1 the certification row is registered and well shaped', () => {
  it('is a live member of the wave lane, not a staged constant', () => {
    expect(ROW, 'the magicEconomyEnabled row is missing from WAVE_SUBSYSTEM_ROWS').toBeTruthy();
    expect(SUBSYSTEM_CERTIFICATION_REGISTRY.map(r => r.rule)).toContain('magicEconomyEnabled');
  });

  it('names the rule this slice gates', () => {
    expect(ROW.rule).toBe('magicEconomyEnabled');
    expect(ROW.title.length).toBeGreaterThan(0);
  });

  it('declares tempo and soak evidence from the closed vocabularies', () => {
    expect(SUBSYSTEM_TEMPOS).toContain(ROW.expectedTempo);
    expect(ROW.expectedTempo).toBe('multi_year');
    expect(SUBSYSTEM_SOAK_EVIDENCE).toContain(ROW.soakEvidence);
    // 'indirect', never 'unobserved': the UNOBSERVED escape hatch is a ceilinged,
    // reviewed population, and a sidecar-only row does not need it, because the corpus
    // contract already grades that SHAPE unobserved on a v4 envelope.
    expect(ROW.soakEvidence).toBe('indirect');
  });

  it('every declared module path exists on disk (the row\'s provenance)', () => {
    const paths = ROW.module.split(',').map(p => p.trim());
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(existsSync(join(ROOT, path)), `module path does not exist: ${path}`).toBe(true);
    }
  });

  it('declares K1\'s ledger key among its channels, and every channel is a real one', () => {
    // AMENDED BY K3 (the disaster buffer). This pin originally asserted EXACT equality
    // with K1's single key, on the reading that the lane had one channel. It does not
    // any more: the row is shared by every W-K slice, and K3 writes a second key
    // (spatialLedgers.magicBuffer, the ward reserve). Widening the assertion to
    // CONTAINMENT plus a totality check over the shape keeps what the pin was actually
    // for, which is that every declared channel names a key some slice really writes,
    // and drops only the claim that has become false. K3's own key is pinned from the
    // other side in tests/domain/magicBufferIntegration.test.js, which asserts the row
    // declares it and that a real advance materializes it.
    expect(ROW.aliveness.stateKeys).toContain(`spatialLedgers.${INSTITUTION_STATUS_LEDGER}`);
    for (const key of ROW.aliveness.stateKeys) {
      expect(key, `a declared channel must be a spatialLedgers key: ${key}`)
        .toMatch(/^spatialLedgers\.[A-Za-z][A-Za-z0-9]*$/);
    }
    const channels = ROW.aliveness.eventTypes.length
      + ROW.aliveness.moverFamilies.length
      + ROW.aliveness.stateKeys.length;
    expect(channels).toBeGreaterThan(0);
  });

  it('claims no event type, because K1 mints no pulse candidate (the evidence law)', () => {
    expect(ROW.aliveness.eventTypes).toEqual([]);
    expect(ROW.aliveness.moverFamilies).toEqual([]);
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
    // A lit realm in which every institution is working legitimately carries NO ledger
    // key, because the ledger is a memory of trouble and writeInstitutionStatusLedger
    // drops an empty one. A row that did not say so would invite a false SILENT verdict.
    expect(ROW.aliveness.other).toContain('no-orphan');
    expect(ROW.aliveness.other).toContain('NO ledger key');
  });

  it('says out loud that the slice is unwired, so a zero is not read as a broken write', () => {
    expect(ROW.aliveness.other).toContain('NO PULSE WIRING');
  });
});

describe('K1 the declaration that makes the row registrable', () => {
  it('the key is DECLARED in a preset spread, which is why the census sees it', () => {
    const keys = simulationRuleKeys();
    expect(keys.length).toBeGreaterThanOrEqual(40);
    // settlementLifecycleEnabled is the anchor: a VIRTUAL flag exactly like this one,
    // censused only through a preset spread, so its presence proves the census genuinely
    // reaches virtual flags rather than only the defaults.
    expect(keys).toContain('settlementLifecycleEnabled');
    expect(keys).toContain('magicEconomyEnabled');
  });

  it('the key stays VIRTUAL: absent from the defaults, so preset identity is untouched', () => {
    // stressorsEnabled is a real DEFAULT boolean travelling the same key list, so it
    // anchors the collection as live rather than emptied or re-shaped.
    expectAbsentWithAnchor(
      Object.keys(DEFAULT_SIMULATION_RULES), 'magicEconomyEnabled', 'stressorsEnabled',
      'magicEconomyEnabled must not enter DEFAULT_SIMULATION_RULES: that would serialize'
      + ' new bytes into every legacy save and enlist the key in RULE_COMPARISON_KEYS,'
      + ' collapsing preset identity',
    );
  });

  it('and it is declared DARK: exactly one preset declares it, at false', () => {
    const declaring = Object.entries(SIMULATION_RULE_PRESETS)
      .filter(([, preset]) => 'magicEconomyEnabled' in (preset.rules || {}));
    expect(declaring.length).toBe(1);
    for (const [id, preset] of declaring) {
      expect(
        preset.rules.magicEconomyEnabled,
        `preset ${id} LIT magicEconomyEnabled. W-K is not ready to be lit: K1 is not`
        + ' wired into the pulse at all, and K2\'s regimes, K3\'s buffer and K4\'s'
        + ' substitution are not built, so a lit world would derive a status ledger that'
        + ' nothing reads. Lighting belongs at the declared golden boundary, with a'
        + ' re-recorded dormancy golden and a stated cause.',
      ).toBe(false);
    }
  });

  it('DELETING the declaration would red the totality walker (the coupling, executed)', () => {
    const withoutKey = simulationRuleKeys().filter(k => k !== 'magicEconomyEnabled');
    const audit = auditSubsystemCoverage({
      ruleKeys: withoutKey,
      registry: SUBSYSTEM_CERTIFICATION_REGISTRY,
      pendingKeys: SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
    });
    expect(audit.ok).toBe(false);
    expect(audit.unknownRows).toEqual(['magicEconomyEnabled']);
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
      SUBSYSTEM_CERTIFICATION_PENDING_KEYS, 'magicEconomyEnabled',
      'majorChangesRequireProposal', 'the row is authored, so it may not also be pending',
    );
    expect(SUBSYSTEM_CERTIFICATION_REGISTRY.filter(r => r.rule === 'magicEconomyEnabled'))
      .toHaveLength(1);
  });
});

describe('K1 the spatialLedgers manifest registration', () => {
  it('the ledger key is classified EXEMPT, with a written reason', () => {
    expect(Object.keys(EXEMPT_LEDGER_KEYS)).toContain(INSTITUTION_STATUS_LEDGER);
    expect(EXEMPT_LEDGER_KEYS[INSTITUTION_STATUS_LEDGER].length).toBeGreaterThan(120);
    expect(EXEMPT_LEDGER_KEYS[INSTITUTION_STATUS_LEDGER]).toContain('magicEconomyEnabled');
  });

  it('and it is EXEMPT rather than TRACKED, which is a classification, not a widening', () => {
    // The two lists partition the written-key set; the walker asserts the union is
    // exact. traditions is the anchor: an identically-shaped flag-gated per-settlement
    // state record that is exempt for the same reason.
    expectAbsentWithAnchor(
      TRACKED_LEDGER_KEYS, INSTITUTION_STATUS_LEDGER, 'routeNetwork',
      'a status memory is not an adoption mover; adoption is legible from the flag',
    );
    expect(Object.keys(EXEMPT_LEDGER_KEYS)).toContain('traditions');
  });
});
