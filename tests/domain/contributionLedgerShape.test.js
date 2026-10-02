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
  it('joins both flags to the manifest and holds the triple bijection at 28', () => {
    for (const flag of FLAGS) expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain(flag);
    // 22 → 23 at EP-1 (2026-08-16), which mints advanceEpochEnabled with its certification
    // row in the same commit. THIS FILE IS A NAMED PATH ON EVERY FLAG-MINTING PACKET for
    // exactly that reason: these two literals are the FOURTH obligation of the flag-mint
    // bill, they live in a WAR-circulation suite no epoch battery would think to name, and
    // a wave that pays the other three finds them at the terminal gate instead.
    // 23 → 24 at WF-1a (2026-08-16), which mints faithUnseatingEnabled with its certification
    // row in the same commit. The title is RENAMED rather than a new one added, so the
    // estate's test census carries no cardinality change for this obligation.
    // 24 → 25 at MF-UC4 (2026-08-23, the undercity train's T-UC2), which mints
    // undercityHighWaterEnabled with its certification row in the same commit. ⚠ THE COMMENT
    // ABOVE IS THE WHOLE REASON THIS OBLIGATION KEEPS BEING FOUND LATE, AND IT WAS FOUND LATE
    // AGAIN: MF-UC4 paid the four surfaces its charter priced and met these two literals at the
    // widened sweep, in a war-circulation suite no undercity battery would have thought to name.
    // The path is in that member's changeManifest for the next reader's sake.
    // 25 → 26 at W-COIN-1a (2026-08-30), which mints treasuryEnabled with its certification
    // row in the same commit. ⚠⚠ AND IT WAS FOUND LATE AGAIN, FOR THE THIRD RECORDED TIME,
    // EXACTLY AS THE COMMENT ABOVE PREDICTS: this lane priced its flag bill across the
    // manifest, the certification row, the roster test, the lit-coverage walker and the
    // soak harness's covering array — and still met THIS pair for the first time at the
    // terminal ratchet, in a war-circulation suite no treasury battery would have thought
    // to name. The habitat is the obligation being spread across suites nobody can
    // enumerate from the mint site; a flag-mint packet that named its surfaces from ONE
    // registry would end it, and that is TE-GUARDS-1's subject rather than this lane's.
    // 26 → 27 at W-SEAT SEAT-1 (2026-08-30), `foreignSeatEnabled`.
    // 27 → 28 at W-SEAT SEAT-2b (2026-08-31, lane T4 · SEAT-B), which mints
    // `legitimacyUpheavalEnabled` with its certification row in the same commit.
    // ⭐ AND THIS TIME THE PAIR WAS FOUND FIRST, NOT LAST, which is the point of the four
    // notes above: the lane read the flag-mint bill off SEAT-1's own commit before writing a
    // line, so this suite was a NAMED surface from the start rather than a terminal-gate
    // surprise. The habitat is unchanged and still belongs to TE-GUARDS-1 — one registry the
    // mint site can enumerate — but the record should show the practice works when a lane
    // reconstructs the bill from the last mint's diff instead of from its own charter.
    // ⛔ AND A LANDING HAZARD THIS LANE MEASURED RATHER THAN MET: T12 · WAR-MEMORY landed
    // `warMemoryEnabled` on the build branch WHILE this car was being built, so at the
    // landing tip these literals are 28 → 29, not 27 → 28. Both sides close arithmetically
    // on their own base, which is exactly the still-closing-lie shape the lighting census
    // forces onto consecutive lines. THE LANDING RE-MEASURES; it never re-applies these.
    // RE-MEASURED AT THE WAR LANDING (§876), exactly as the hazard note above ordered:
    // the coupled union is 29 (T12's warMemoryEnabled + SEAT-2b's legitimacyUpheavalEnabled).
    // 29 → 30 at ENCOUNTERS car ENC-3 (2026-09-03), which mints `chanceEncountersEnabled`
    // with its manifest member, its ONE by-name strict gate read (`chanceEncountersActive`
    // in `worldPulse/envoyChanceMeetingStage.js`) and its authored certification row in
    // `subsystemRowsEncounters.js` — the three-in-one-commit law, met. ⭐ AND THE PAIR WAS
    // FOUND AT THE LANDING, NOT BY THE MINTING LANE: ENC-3 paid the manifest, the row and
    // the gate, and this war-circulation suite met the delta only when the landing ran the
    // whole gate. That is the fifth recorded sighting of the habitat the four notes above
    // describe, and it is unchanged — one registry the mint site can enumerate, still
    // TE-GUARDS-1's subject. The figure is RE-MEASURED here, never re-applied: both
    // literals were read off the live modules (30 and 30) before this line was written.
    // 30 → 31 at SEAT-78 (2026-09-05, `bc3002c55`), which mints `irregularForceEnabled`
    // with its manifest entry, its certification row in `subsystemRowsSeat.js` and its ONE
    // by-name gate read in one commit — the three-in-one-commit law, met. ⛔ AND THIS IS THE
    // SIXTH RECORDED SIGHTING OF THE HABITAT THE FIVE NOTES ABOVE DESCRIBE, exactly as they
    // predict and now with a new worst case: SEAT-78 paid the manifest, the row and the
    // gate, and met NONE of the four downstream surfaces — this pair, the three module-scope
    // edits in subsystemRowsVirtual.test.js, the covering array's flag-domain census, and
    // militaryStrength's importer allowlist. All four were met at the composition by a
    // landing lane running the whole gate, not by any battery the minting lane could have
    // named. The habitat is unchanged and still TE-GUARDS-1's subject — one registry the
    // mint site can enumerate. The figures are RE-MEASURED here, never re-applied: both
    // literals were read off the live modules (31 and 31) before this line was written.
    // 30 → 31 at the lighting wave's L-HOMES car 4 (LGT-P5-WOPS, 2026-09-05), which mints
    // the first W-OPS door with its certification row in the reserved `subsystemRowsOps.js`
    // leaf and its ONE by-name gate read in the espionage family's door module. Both
    // literals were read off the live modules (31 and 31) before this line was moved.
    // literals were read off the live modules (32 and 32) before this line was moved.
    // literals were read off the live modules (33 and 33) before this line was moved.
    // literals were read off the live modules (34 and 34) before this line was moved.
    // 35 → 36 at FP TR-2 (lane FP-D, 2026-09-23): `merchantHousesEnabled`, its row at the tail
    // of VIRTUAL_SUBSYSTEM_ROWS. Both literals were read off the live modules (36 and 36)
    // before this line was moved.
    // 36 → 37 at FP TR-3 (lane FP-D2, 2026-09-24): `believedMarketsEnabled`, its row at the tail
    // of VIRTUAL_SUBSYSTEM_ROWS after TR-2's. Both literals were read off the live modules (37
    // and 37) before this line was moved (SR-1: a count the wave grows by its own law).
    // 36 → 37 at FP IN-2 (lane FP-I, 2026-09-24; SR-1): IN-2 adds `infoLureEnabled`, its row at
    // the tail of VIRTUAL_SUBSYSTEM_ROWS. Both literals were read off the live modules (37 and 37)
    // before this line was moved.
    // 37 → 38 at the FP integration pick (the chair, 2026-09-24): TR-3 and IN-2 each minted one virtual key on a
    // 36-key base; the tip carries both (SR-1, the union).
    // 38 → 39 at the FP integration pick (the chair, 2026-09-24): GR-6 minted a third virtual key (SR-1, the union).
    // 39 → 40 at the FP integration pick (the chair, 2026-09-24): IN-4/1 declared intelTradeEnabled, the fourth tonight (SR-1, the union).
    // 39 → 40 at FP IN-3 (lane FP-I3, 2026-09-24; SR-1): IN-3 adds `counterIntelEnabled`, its row at
    // the tail of VIRTUAL_SUBSYSTEM_ROWS. Both literals were read off the live modules (40 and 40)
    // before this line was moved.
    // 40 → 41 at the FP integration pick (the chair, 2026-09-24): IN-3 minted counterIntelEnabled, the fifth tonight (SR-1, the union).
    // 41 → 42 at the FP integration pick (the chair, 2026-09-24): IN-4/2 minted reputationRaceEnabled, the sixth tonight (SR-1, the union).
    // 42 → 43 at FP CW-1 (lane fp/cw-1, 2026-09-24; SR-1): `cascadeGovernorEnabled`, its row at the
    // tail of VIRTUAL_SUBSYSTEM_ROWS after IN-4's. Both literals were read off the live modules.
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toHaveLength(43);
    expect(VIRTUAL_SUBSYSTEM_ROWS).toHaveLength(43);
    // 36 → 37 at FP GR-6 (lane FP-B2, 2026-09-24): `mediationGeneralizedEnabled`, its row at the
    // tail of VIRTUAL_SUBSYSTEM_ROWS. Both literals were read off the live modules (37 and 37)
    // before this line was moved.
    // 38 → 39 at FP IN-4 commit 1 (lane FP-I2, 2026-09-24; J-INA-4, SR-1): `intelTradeEnabled`,
    // the invisible key declared, its row at the tail of VIRTUAL_SUBSYSTEM_ROWS after IN-2's. Both
    // literals were read off the live modules (39 and 39) before this line was moved.
    // 39 → 40 at FP IN-4 commit 2 (lane FP-I2, 2026-09-24; SR-1): `reputationRaceEnabled`, its row
    // at the tail of VIRTUAL_SUBSYSTEM_ROWS after the intel lane's. Both literals were read off the
    // live modules (40 and 40) before this line was moved.
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

    // ⛔ AND BOTH KEYS ARE VIRTUAL: absent from the defaults, and read off every preset's RESOLVED
    // rules object — not the preset wrapper, which can never own a rule key.
    // ⭐ AMENDED AT LIT-0 (2026-09-24): J-EM-16, the lit law (LGT-C2 `432ff6441` the precedent).
    // This block read "absent from the defaults AND from every preset" (`carriers` had to be
    // `[]`) until the owner's word "shipped lit". VIRTUAL means ABSENT FROM
    // DEFAULT_SIMULATION_RULES, and so from every preset's defaults spread and from the
    // RULE_COMPARISON_KEYS derived from it; a lighting unit may declare a key in the presets it
    // names, and dark stays ABSENT (CR-WR10-C), so every carrier carries a strict `true`.
    expect(Object.keys(DEFAULT_SIMULATION_RULES).length).toBeGreaterThan(10);
    for (const flag of FLAGS) {
      expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, flag)).toBe(false);
      const carriers = Object.entries(SIMULATION_RULE_PRESETS)
        .filter(([, preset]) => preset?.rules
          && Object.prototype.hasOwnProperty.call(preset.rules, flag))
        .map(([id]) => id);
      // anchored: the non-vacuity loop below proves each resolved rules object is readable.
      expect(carriers.filter((id) => SIMULATION_RULE_PRESETS[id].rules[flag] !== true),
        `${flag}: a preset declares it without lighting it`).toEqual([]);
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
