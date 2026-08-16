/**
 * contributionLedgerShape.test.js — WC-0E acceptance E1..E8: the two war-circulation flags,
 * the contribution ledger's shapes and normalizer, and the ungated `blocks[]` arm.
 *
 * ⚠ ANCHOR DISCIPLINE (negativeAssertionAnchor.walker): a NEW tests/domain file starts at
 * ceiling ZERO against the frozen roster, so this file writes none of the three negated
 * membership forms that walker scans for, and this notice is WORDED rather than quoting
 * them — quoting them to say they are absent is itself a violation, as the wc-0 train
 * learned by being convicted for it.
 *
 * ⭐ THE LITERAL FLAG DRIVE IS LOAD-BEARING MACHINERY, NOT STYLE (ODQ §50 obligation c).
 * `mechanismLitCoverage` grants a flag AUTO credit only on a LITERAL `<flag>: true` in a
 * test; a computed member attributes to no key, so a fully wired and genuinely gated flag
 * can read as uncovered — the code right and only the machinery blind. Every drive below is
 * written out literally for that reason.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  DEFAULT_SIMULATION_RULES,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';
import { VIRTUAL_SUBSYSTEM_ROWS } from '../../src/domain/certification/subsystemRowsVirtual.js';
import {
  CONTRIBUTION_KINDS,
  CONTRIBUTION_RECORD_FIELDS,
  contributionLedgerActive,
  contributionKind,
  isContributionKind,
  normalizeContribution,
  normalizeContributionLedger,
} from '../../src/domain/worldPulse/contributionLedger.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';

const LEDGER_SOURCE = fileURLToPath(
  new URL('../../src/domain/worldPulse/contributionLedger.js', import.meta.url),
);
const FLAGS = Object.freeze(['warCirculationEnabled', 'contributionLedgerEnabled']);

/** Blank every comment, line count preserved, so a comment can neither satisfy nor break a scan. */
function codeOnly(source) {
  const blank = (match) => match.replace(/[^\n]/g, ' ');
  return source.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/^[ \t]*\/\/.*$/gm, blank);
}

describe('WC-0E · the war-circulation flags, the contribution ledger shape, and the blocks[] arm', () => {
  it('joins both flags to the manifest and holds the triple bijection at 23', () => {
    for (const flag of FLAGS) expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain(flag);
    // 22 → 23 at EP-1 (2026-08-16), which mints advanceEpochEnabled with its certification
    // row in the same commit. THIS FILE IS A NAMED PATH ON EVERY FLAG-MINTING PACKET for
    // exactly that reason: these two literals are the FOURTH obligation of the flag-mint
    // bill, they live in a WAR-circulation suite no epoch battery would think to name, and
    // a wave that pays the other three finds them at the terminal gate instead.
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toHaveLength(23);
    expect(VIRTUAL_SUBSYSTEM_ROWS).toHaveLength(23);
    // ⭐ THE BIJECTION IS A TRIPLE, NOT A PAIR. The ordered-equality pin in
    // subsystemRowsVirtual.test.js couples the manifest to VIRTUAL_RULES; direction 3 of
    // engineGatedRuleKeys couples the manifest to the certification rows. A flag mint moves
    // all three together or reds two walkers.
    expect([...ENGINE_GATED_VIRTUAL_RULE_KEYS].sort())
      .toEqual([...VIRTUAL_SUBSYSTEM_ROWS.map((row) => row.rule)].sort());
    expect(new Set(ENGINE_GATED_VIRTUAL_RULE_KEYS).size).toBe(ENGINE_GATED_VIRTUAL_RULE_KEYS.length);
  });

  it('gives each flag a by-name strict gate read in this same commit', () => {
    // ⭐⭐ DIRECTION 1. A manifest key the engine does not actually gate on reds
    // engineGatedRuleKeys at this member's own commit. The reads are asserted over the
    // LANDED SOURCE with comments stripped, so a mention inside a comment cannot satisfy it.
    const masked = codeOnly(readFileSync(LEDGER_SOURCE, 'utf8'));
    for (const flag of FLAGS) {
      expect(masked).toContain(`${flag} === true`);
    }
    // The mask preserves line count, so any address this arm reported would still be live.
    const raw = readFileSync(LEDGER_SOURCE, 'utf8');
    expect(masked.split('\n')).toHaveLength(raw.split('\n').length);

    // And the read is a CONJUNCTION: both keys strictly true, or the lane is dark.
    expect(contributionLedgerActive({ warCirculationEnabled: true, contributionLedgerEnabled: true })).toBe(true);
    for (const bad of [null, undefined, {}, 'rules', 42]) {
      expect(contributionLedgerActive(bad)).toBe(false);
    }
  });

  it('carries an authored certification row per flag and stands in no pending list', () => {
    // DIRECTION 3: manifesting a key is what puts it into the certification census, so the
    // row comes due in the same commit — and "manifested here, pending over there" satisfies
    // the totality partition while breaking the virtual contract.
    for (const flag of FLAGS) {
      const row = VIRTUAL_SUBSYSTEM_ROWS.find((candidate) => candidate.rule === flag);
      expect(row, `${flag} owes an authored certification row`).toBeTruthy();
      expect(row.module).toBe('src/domain/worldPulse/contributionLedger.js');
      expect(row.title.length).toBeGreaterThan(0);
      // The prose is the row's whole value for a cohort no receipt can grade.
      expect(row.aliveness.other.length).toBeGreaterThan(400);
      expect(row.invariants.length).toBeGreaterThan(0);
      // ⭐ NOTHING IS DECLARED ALIVE, and that is a measurement: the wave writes no byte, so
      // there is no container to declare and no soak that could grade it.
      expect(row.aliveness.eventTypes).toEqual([]);
      expect(row.aliveness.moverFamilies).toEqual([]);
      expect(row.aliveness.stateKeys).toEqual([]);
      expect(row.soakEvidence).toBe('unobserved');
    }
  });

  it('freezes the contribution vocabulary and throws on an unknown kind', () => {
    expect(CONTRIBUTION_KINDS).toEqual(['supplies_delivered', 'troops_lent']);
    expect([...CONTRIBUTION_KINDS]).toEqual([...CONTRIBUTION_KINDS].sort());
    expect(Object.isFrozen(CONTRIBUTION_KINDS)).toBe(true);
    expect(CONTRIBUTION_RECORD_FIELDS).toEqual(['amount', 'kind', 'sinceTick', 'toPartyId']);
    expect(Object.isFrozen(CONTRIBUTION_RECORD_FIELDS)).toBe(true);

    for (const kind of CONTRIBUTION_KINDS) {
      expect(isContributionKind(kind)).toBe(true);
      expect(contributionKind(kind)).toBe(kind);
    }
    for (const bad of ['troops', 'Troops_Lent', '', null, undefined, 7]) {
      expect(isContributionKind(bad)).toBe(false);
      expect(() => contributionKind(bad)).toThrow(TypeError);
    }
  });

  it('fails closed on every malformed record rather than letting one survive', () => {
    const good = { amount: 40, kind: 'troops_lent', sinceTick: 3, toPartyId: 'Ahold' };
    // ANCHOR FIRST: a well-shaped record DOES normalize, so the refusals below are refusals
    // rather than a normalizer that rejects everything.
    expect(normalizeContribution(good)).toEqual(good);

    for (const bad of [
      null, undefined, 'record', 42, [],
      { ...good, kind: 'gold_sent' },        // unknown kind
      { ...good, kind: '' },                 // empty kind
      { ...good, toPartyId: '' },            // no counterparty
      { ...good, amount: -1 },               // negative
      { ...good, amount: Number.NaN },       // non-finite
      { ...good, amount: Number.POSITIVE_INFINITY },
      { ...good, sinceTick: 1.5 },           // fractional tick
      { ...good, sinceTick: -1 },            // negative tick
    ]) {
      expect(normalizeContribution(bad)).toBe(null);
    }

    // Only the four declared fields survive — an unknown field cannot ride in on a spread.
    const withExtra = { ...good, secretBackdoor: 'x', drawnCohorts: [1, 2] };
    expect(Object.keys(normalizeContribution(withExtra)).sort()).toEqual([...CONTRIBUTION_RECORD_FIELDS]);

    // The ledger normalizer drops exactly the rows the record normalizer refuses.
    const ledger = { keep: good, drop: { ...good, kind: 'gold_sent' }, alsoDrop: null };
    expect(Object.keys(normalizeContributionLedger(ledger))).toEqual(['keep']);
    for (const bad of [null, undefined, 'ledger', []]) {
      expect(normalizeContributionLedger(bad)).toEqual({});
    }
  });

  it('normalizes blocks[] on every load with both flags dark, which is what proves it ungated', () => {
    // ⭐⭐ THE ARM IS UNGATED ON PURPOSE. Persistence hygiene runs whether or not the layer
    // is lit: an arm that cleaned malformed saves only while the flag was true would leave a
    // dark world's saves un-normalized and hand a later lit tick a ledger it never
    // validated — the fail-OPEN direction. This drives it with NO rules at all.
    const world = {
      deployments: {
        d1: {
          targetId: 'Bhold',
          blocks: [
            { originId: 'Ahold', headcount: 40 },   // keeps
            { originId: '', headcount: 10 },        // no origin
            { originId: 'Chold', headcount: -1 },   // negative
            { originId: 'Dhold', headcount: 2.5 },  // fractional
            null, 'block', [],
          ],
        },
        d2: { targetId: 'Chold', blocks: [{ originId: '', headcount: 1 }] },
        d3: { targetId: 'Dhold', blocks: 'not-an-array' },
      },
    };
    const out = ensureWorldState(world);
    // ANCHOR FIRST: the well-shaped block SURVIVED, so the arm ran and the drops below are
    // drops rather than a normalizer that emptied everything.
    expect(out.deployments.d1.blocks).toEqual([{ originId: 'Ahold', headcount: 40 }]);
    // A list that empties out disappears rather than surviving as an empty artifact.
    expect(out.deployments.d2.blocks ?? null).toBe(null);
    expect(out.deployments.d3.blocks ?? null).toBe(null);
    // The neighbouring fields are untouched, so the arm is scoped to blocks[].
    expect(out.deployments.d1.targetId).toBe('Bhold');
  });

  it('drives each flag with a literal true and stays dark unless both are lit', () => {
    // ⭐ THE LITERAL DRIVE (§50 obligation c). mechanismLitCoverage grants credit only on a
    // literal `<flag>: true`; a computed member attributes to no key.
    expect(contributionLedgerActive({ warCirculationEnabled: true, contributionLedgerEnabled: true })).toBe(true);
    // Each flag alone leaves the lane dark — the conjunction, driven from both sides.
    expect(contributionLedgerActive({ warCirculationEnabled: true })).toBe(false);
    expect(contributionLedgerActive({ contributionLedgerEnabled: true })).toBe(false);
    expect(contributionLedgerActive({ warCirculationEnabled: true, contributionLedgerEnabled: false })).toBe(false);
    expect(contributionLedgerActive({ warCirculationEnabled: false, contributionLedgerEnabled: true })).toBe(false);
    // Strictly true, never merely truthy — a truthiness read is invisible to the gate walker.
    expect(contributionLedgerActive({ warCirculationEnabled: 1, contributionLedgerEnabled: 1 })).toBe(false);
    expect(contributionLedgerActive({ warCirculationEnabled: 'true', contributionLedgerEnabled: 'true' })).toBe(false);

    // ⛔ AND BOTH KEYS ARE STRUCTURALLY DARK: absent from the defaults and from every preset's
    // RESOLVED rules object — not the preset wrapper, which can never own a rule key.
    for (const flag of FLAGS) {
      expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, flag)).toBe(false);
      const carriers = Object.entries(SIMULATION_RULE_PRESETS)
        .filter(([, preset]) => preset?.rules
          && Object.prototype.hasOwnProperty.call(preset.rules, flag))
        .map(([id]) => id);
      expect(carriers).toEqual([]);
    }
    // Non-vacuity: the probe is reading real resolved rule objects and can see a key in them.
    for (const id of Object.keys(SIMULATION_RULE_PRESETS)) {
      expect(Object.prototype.hasOwnProperty.call(SIMULATION_RULE_PRESETS[id].rules, 'presetId')).toBe(true);
    }
  });

  it('writes no spatial ledger, so it is owed no spatialUsage row', () => {
    // ⭐⭐ THE F-1 MEASUREMENT, ASSERTED AT ITS SOURCE. spatialLedgerCoverage is exact-set in
    // BOTH directions over a live scan of setSpatialLedger calls, so a TRACKED row for a key
    // nothing writes reds. The volume charters rows for warContributions, freeUnits and
    // residentCohorts at this wave AND says in the same sentence that the wave makes no
    // writer calls; §73.3's F-1 is the correction, and the rows travel to WC-1, WC-11 and
    // WC-13 with their writers.
    const masked = codeOnly(readFileSync(LEDGER_SOURCE, 'utf8'));
    expect(masked.split('setSpatialLedger').length - 1).toBe(0);
    expect(masked.split('spatialLedgers').length - 1).toBe(0);
    // Non-vacuity: the mask is reading live code, and the detector can see the token.
    expect(masked).toContain('export function contributionLedgerActive');
    expect('setSpatialLedger(next, \'warContributions\''.split('setSpatialLedger').length - 1).toBe(1);
  });
});
