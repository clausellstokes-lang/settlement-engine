/**
 * TCD-1 — THE GOVERNING SEAT'S NEWS ADDRESS, pinned against REAL generator output.
 *
 * The defect this guards: every `.id` read over a `powerStructure.factions` row is
 * inert. Measured through the full generateSettlementPipeline, 0 of 2,175 faction
 * rows across 360 settlements carry `id`. So `readWarSeatBooks` emitted no
 * `factionId`, `warTermination` never spread one into its receipt, and
 * `warRulingsNews` omitted `factionIds` from every WR-5 entry — a gap in the
 * address chain the NEWS ADDRESS LAW requires, and one that also made
 * `warRulingsNews.factionName`'s third arm (`${settlementId}:${stablePart(name)}`)
 * a reader with no writer.
 *
 * ⚠ THESE PINS MUST NOT BE MOVED ONTO A FIXTURE. Every `.id`-shaped faction
 * fixture in this repo (`{ id: 'fac.crown', ... }`) is a record no generator
 * makes, and fixtures of exactly that shape are what hid the four earlier
 * members of this defect class. Expectations here are DERIVED from the
 * settlement under test, never transcribed, and the corpus is multi-seed so no
 * single lucky world can carry the suite.
 */
import { describe, expect, it, vi } from 'vitest';

/**
 * ⚠ THE ROUTING PROBE (see PIN-2's "the writer really CALLS the shared helper").
 *
 * `seatTransitionGoverningFactionId` is value-identical to `ladderFactionKey`
 * over this corpus, so NO equality assertion on the persisted value can tell a
 * call to the shared helper apart from an inline reimplementation — the pin that
 * claimed "routes through the shared helper, byte-for-byte" proved only that the
 * two agree. This wrapper makes routing decidable: with `sentinel` null it
 * DELEGATES to the real helper (so the corpus and every other pin below see
 * unchanged values), and with `sentinel` set it returns a value the real helper
 * could never produce. If that value reaches the persisted row, the writer
 * called THIS export; if it does not, the writer resolved the id some other way.
 *
 * `vi.hoisted` is required: `vi.mock` factories are hoisted above the module
 * body, so a plain `const` here would be in its TDZ when the factory runs.
 * The mock spreads the original module, so `appendNpcLadderSeatTransition` and
 * every other export are the real ones, and the kernel's own internal call to
 * its module-local binding is untouched.
 */
const routingProbe = vi.hoisted(() => ({ sentinel: /** @type {string|null} */ (null) }));
vi.mock('../../src/domain/worldPulse/npcLadderKernel.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    seatTransitionGoverningFactionId: (/** @type {unknown} */ faction) => (
      routingProbe.sentinel === null
        ? actual.seatTransitionGoverningFactionId(faction)
        : routingProbe.sentinel
    ),
  };
});

import { gen } from '../simulation/simHelpers.js';
import { governingFactionOf, nameOf } from '../../src/domain/rulingPower.js';
import { realmFactionPulseId } from '../../src/domain/dossier/realmEntityWeb.js';
import { getSpatialLedger, setSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { factionCompetitionId } from '../../src/domain/worldPulse/factionCompetition.js';
import { ladderFactionKey } from '../../src/domain/worldPulse/npcLadderState.js';
import { seatTransitionGoverningFactionId } from '../../src/domain/worldPulse/npcLadderKernel.js';
import { stablePart } from '../../src/domain/worldPulse/stablePart.js';
import {
  authoritySignatureFor,
  readWarSeatBooks,
} from '../../src/domain/worldPulse/warSeatBooks.js';
import { warRulingNewsEntry } from '../../src/domain/worldPulse/warRulingsNews.js';

const TIERS = Object.freeze(['hamlet', 'village', 'town', 'city', 'metropolis']);
const SEEDS = Object.freeze([7100, 7101, 7102, 7103, 7104, 7105]);

/**
 * Real worlds, several seeds and every tier — never one lucky settlement.
 *
 * ⚠⚠ THE CALL SHAPE IS LOAD-BEARING AND WAS WRONG UNTIL 2026-08-07. This corpus
 * was built by `generateSettlementPipeline({ tier }, seed)`, which is the RECORDED
 * CONFIG-SLOT SILENT KEY TRAP firing twice in one call:
 *
 *   (a) `tier` IS NOT A CONFIG KEY. The generator reads `settType`; `tier` is the
 *       field it WRITES onto the finished settlement. An unrecognized config key
 *       is not rejected, so all 30 rows generated at the default and
 *       `settlement.tier` was `'village'` on every one of them — measured. The
 *       header's "every tier" and the commit's "5 tiers" were both false, and the
 *       four tier-sensitive shapes (a hamlet's three-faction roster, a
 *       metropolis's dozen) were never once exercised.
 *
 *   (b) THE SEED LANDED IN THE `importedNeighbour` SLOT. The pipeline's signature
 *       is (config, importedNeighbour, options), and its fail-closed guard only
 *       rejects an OBJECT carrying a recognized option key — a bare number sails
 *       through. `options.seed` was therefore absent, generation fell through to
 *       `generateSeed()`, and every run produced 30 DIFFERENT random worlds.
 *       Measured: 0 of 30 rows carried any of the seeds 7100–7105, and `_seed`
 *       read as a fresh clock-derived token each run. The corpus was not merely
 *       un-varied, it was NON-REPRODUCIBLE — a pin over it is a lottery, and a
 *       flake would have been unreproducible by construction.
 *
 * Both cures are below, and both are GUARDED rather than asserted in a comment:
 * `the corpus is real…` re-measures the distinct-tier set against TIERS and
 * re-measures that every asked-for seed ARRIVED as `settlement._seed`. A corpus
 * that silently collapses to one tier and one lucky world is a lottery wearing a
 * denominator, and nothing in the old file could have said so.
 *
 * ⚠ AND THE CALL GOES THROUGH THE ESTATE'S ONE SPELLING, `gen` — not a hand-rolled
 * `generateSettlementPipeline(...)`. `gen` passes `customContent: {}`, which is
 * not decoration: with that option ABSENT, dependencyEngine's `_override` stays
 * null and the registry falls through to `getCustomContentSource()()` — the LIVE
 * STORE SEAM (src/lib/dependencyEngine.js:128). The default source returns `{}`
 * today, so both spellings generate BYTE-IDENTICAL worlds here (verified, 30/30,
 * every tier/seed/name/roster/ladder-key equal). But the hand-rolled form leaves
 * this corpus reading AMBIENT state, so anything that ever wires a source — an
 * app boot, another test in the same worker — would silently move these worlds.
 * A pin whose corpus can be moved from outside the pin is the same lottery in a
 * second costume; `customContent: {}` pins it headless.
 */
function corpus() {
  const rows = [];
  for (const seed of SEEDS) {
    for (const tier of TIERS) {
      // `settType` is the config key; the seed is `gen`'s second argument, which
      // routes it to options.seed. A string seed keyed by tier+seed keeps the 30
      // worlds independent rather than making one seed's world reappear at five
      // tiers.
      const askedSeed = `tcd1:${tier}:${seed}`;
      let generated;
      try {
        generated = gen({ settType: tier }, askedSeed);
      } catch {
        continue;
      }
      const settlement = generated?.settlement || generated;
      const governing = governingFactionOf(settlement);
      if (!governing) continue;
      const id = `${tier}-${seed}`;
      rows.push({
        id,
        askedTier: tier,
        askedSeed,
        settlement,
        governing,
        item: { id, name: settlement?.name || id, settlement },
      });
    }
  }
  return rows;
}

function snapshotOf(rows) {
  return {
    settlements: rows.map((row) => row.item),
    byId: new Map(rows.map((row) => [row.id, row.item])),
  };
}

const ROWS = corpus();
const SNAPSHOT = snapshotOf(ROWS);

/**
 * ⚠⚠ ANTI-VACUITY FLOORS DO NOT TRAVEL — the rule this file now obeys everywhere.
 *
 * A loop body asserts NOTHING over an empty collection, and no comment makes it
 * true. Until 2026-08-07 the floors in this file lived in TWO tests — the corpus
 * pin's `ROWS.length >= 20` and PIN-2's `WRITTEN.length >= 20` — and NINE
 * loop-bearing or `ROWS[0]`-bearing pins across three describes borrowed their
 * non-vacuity from those SIBLINGS. Delete, rename or `.skip` either sibling and
 * nine pins go silently green over nothing, which is exactly how the pin-vacuity
 * class propagates. Counting the collection inside the same test is not enough
 * either: `expect(checked).toBe(ROWS.length)` reads `0 === 0` on an empty corpus.
 *
 * So EVERY pin below that walks a collection, or indexes `ROWS[0]`, now carries
 * its OWN denominator assertion in its OWN body. The floors are deliberately
 * redundant with each other — that redundancy IS the property: no single deletion
 * can silence more than the pin it lives in.
 */
describe('TCD-1 governing-seat faction address', () => {
  it('the corpus is real, non-empty, and carries no faction .id at all', () => {
    // The denominator. If this ever shrinks to nothing the pins below go
    // vacuous silently, which is exactly how this defect class propagates.
    //
    // ⚠ CORRECTED CENSUS, 2026-08-07 (receipt-correction lane). TCD-1's commit
    // messages (65ed49fd, 79419449) and its lane report state "196 faction rows"
    // for this corpus. THE MEASURED FIGURE IS 203, and three independent
    // environments agree on 203. Re-measured at HEAD e37f9495 on a clean tree by
    // rebuilding this exact corpus outside vitest — `gen({ settType: tier },
    // askedSeed)` for the same TIERS × SEEDS as the loop above, then summing
    // `powerStructure.factions.length` — which gives 203 rows over 30 worlds,
    // distributed hamlet 26 / village 35 / town 38 / city 49 / metropolis 55, and
    // 0 of the 203 carrying `.id`. The "0 carry `.id`" half of the receipt is
    // therefore correct; only the denominator was wrong. The commit messages are
    // history and still say 196 — quote THIS line, not them.
    //
    // The assertions stay FLOORS, deliberately. A hand-restated exact census goes
    // stale the moment the generator's roster sizes move, and a stale derivable
    // is the defect class this very lane is repairing; the figure above is dated
    // and attributed instead of frozen into an expectation.
    expect(ROWS.length).toBeGreaterThanOrEqual(20);
    const factionRows = ROWS.flatMap((row) => row.settlement?.powerStructure?.factions || []);
    expect(factionRows.length).toBeGreaterThanOrEqual(60);
    // The premise of the whole repair, re-measured every run rather than quoted.
    expect(factionRows.filter((faction) => faction?.id != null)).toEqual([]);

    // ── THE TWO GUARDS THE CONFIG-SLOT TRAP DEMANDS (see corpus()'s header) ──
    // NOT "at least a few tiers": the CARDINALITY this file's own header claims,
    // asserted against the same TIERS list the loop walks, so the claim and the
    // check cannot drift apart. Under the old `{ tier }` spelling this read
    // `['village']` — one tier, cardinality 1 — and nothing said so.
    const distinctTiers = [...new Set(ROWS.map((row) => row.settlement?.tier))].sort();
    expect(distinctTiers).toEqual([...TIERS].sort());
    expect(distinctTiers).toHaveLength(TIERS.length);
    // Every asked-for tier is really represented, not merely present somewhere.
    for (const tier of TIERS) {
      expect(ROWS.filter((row) => row.settlement?.tier === tier).length).toBeGreaterThan(0);
    }

    // ASSERT THE SEED ACTUALLY ARRIVED — the guard the recorded hazard
    // prescribes, and the one thing that distinguishes a seeded corpus from a
    // fresh random draw. `_seed` is the pipeline's own record of the seed it
    // RAN with, so this compares what we asked for against what the generator
    // says it used, rather than trusting the call site's spelling.
    for (const row of ROWS) {
      expect(row.settlement?._seed).toBe(row.askedSeed);
    }
    // …and the 30 worlds are 30 DIFFERENT worlds, so no single seed carries the
    // suite. Both counts are derived from ROWS, never transcribed.
    expect(new Set(ROWS.map((row) => row.settlement?._seed)).size).toBe(ROWS.length);
    expect(new Set(ROWS.map((row) => row.settlement?.name)).size).toBe(ROWS.length);
  });

  it('readWarSeatBooks emits the settlement-scoped address id for every real governing seat', () => {
    // OWN FLOOR. `checked === ROWS.length` alone is `0 === 0` on an empty corpus.
    expect(ROWS.length).toBeGreaterThanOrEqual(20);
    let checked = 0;
    for (const row of ROWS) {
      const books = readWarSeatBooks({
        worldState: {},
        snapshot: SNAPSHOT,
        actorId: row.id,
        opponentId: 'elsewhere',
      });
      const expected = `${row.id}:${stablePart(nameOf(row.governing))}`;
      expect(books.factionId).toBe(expected);
      expect(books.factionName).toBe(nameOf(row.governing));
      checked += 1;
    }
    expect(checked).toBe(ROWS.length);
    expect(checked).toBeGreaterThanOrEqual(20);
  });

  it('the address id is byte-identical to realmFactionPulseId, so the link web can follow it', () => {
    // The link web's resolveFaction indexes factions by realmFactionPulseId and
    // returns null outright on a colonless id, so an address that is merely
    // "present" but differently spelled is a dead rung. warSeatBooks cannot
    // import realmEntityWeb (a dossier-layer module would re-parent this lazy
    // worldPulse leaf's closure), so the single-source guarantee is THIS pin.
    expect(ROWS.length).toBeGreaterThanOrEqual(20); // OWN FLOOR
    let compared = 0;
    for (const row of ROWS) {
      const books = readWarSeatBooks({
        worldState: {},
        snapshot: SNAPSHOT,
        actorId: row.id,
        opponentId: 'elsewhere',
      });
      const factions = row.settlement.powerStructure.factions;
      const index = factions.indexOf(row.governing);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(books.factionId).toBe(realmFactionPulseId(row.id, row.governing, index));
      expect(books.factionId).toContain(':');
      compared += 1;
    }
    expect(compared).toBe(ROWS.length);
  });

  it('that id RESOLVES against the real roster — a war ruling that needs the faction rung survives', () => {
    // war_party_overturns_peacemaker REQUIRES the faction identity, and the
    // supplied-name evidence path is deliberately withheld here, so the entry
    // exists if and only if warRulingsNews.factionName resolved the id against
    // the settlement's own generated roster. With the old `.id`-only spelling
    // the id was absent, faction resolved to '', and the entry failed closed.
    let resolved = 0;
    let skippedUnreaderly = 0;
    for (const row of ROWS) {
      const books = readWarSeatBooks({
        worldState: {},
        snapshot: SNAPSHOT,
        actorId: row.id,
        opponentId: 'elsewhere',
      });
      // A faction display name carrying a digit or underscore is not reader
      // text and is legitimately unspeakable; count it rather than hide it.
      if (/[\d%×_{}[\]]/u.test(nameOf(row.governing))) {
        skippedUnreaderly += 1;
        continue;
      }
      const entry = warRulingNewsEntry({
        evidence: {
          kind: 'war_party_overturns_peacemaker',
          id: `tcd1:${row.id}`,
          tick: 12,
          settlementId: row.id,
          npcId: `${row.id}:seat`,
          npcName: 'The Seated Holder',
          factionId: books.factionId,
        },
        snapshot: SNAPSHOT,
        now: '2026-08-07T00:00:00.000Z',
      });
      expect(entry).not.toBeNull();
      expect(entry.factionIds).toEqual([books.factionId]);
      // The address rung must actually name the faction in the prose the
      // reader sees, not merely occupy a slot.
      const spoken = `${entry.headline} ${entry.summary}`;
      expect(spoken).toContain(nameOf(row.governing));
      resolved += 1;
    }
    expect(resolved).toBeGreaterThanOrEqual(ROWS.length - skippedUnreaderly);
    expect(resolved).toBeGreaterThanOrEqual(20);
  });

  it('a NEGATIVE CONTROL id resolves to nothing, so the pin above is not passing on the name alone', () => {
    // OWN FLOOR — this pin indexes ROWS[0] and would otherwise inherit its
    // liveness from a sibling test's denominator.
    expect(ROWS.length).toBeGreaterThanOrEqual(20);
    const row = ROWS[0];
    const entry = warRulingNewsEntry({
      evidence: {
        kind: 'war_party_overturns_peacemaker',
        id: `tcd1:neg:${row.id}`,
        tick: 12,
        settlementId: row.id,
        npcId: `${row.id}:seat`,
        npcName: 'The Seated Holder',
        factionId: `${row.id}:a_faction_this_world_does_not_have`,
      },
      snapshot: SNAPSHOT,
      now: '2026-08-07T00:00:00.000Z',
    });
    expect(entry).toBeNull();
  });

  it('the AUTHORITY SIGNATURE stays blind to the display name — a rename is not a succession', () => {
    // Guards the two sites this repair deliberately did NOT change
    // (warSeatBooks.authoritySignatureFor and rulingPower.authorityTransferEpochFor).
    // Feeding the address id into either would make every faction rename read
    // as a legitimate authority transfer.
    expect(ROWS.length).toBeGreaterThanOrEqual(20); // OWN FLOOR
    const row = ROWS[0];
    const before = authoritySignatureFor({ worldState: {}, snapshot: SNAPSHOT, actorId: row.id });
    const renamedFactions = row.settlement.powerStructure.factions.map((faction) => (
      faction === row.governing
        ? { ...faction, faction: 'The Renamed Body', name: undefined }
        : faction
    ));
    const renamedSettlement = {
      ...row.settlement,
      powerStructure: {
        ...row.settlement.powerStructure,
        governingName: 'The Renamed Body',
        factions: renamedFactions,
      },
    };
    const renamedItem = { id: row.id, name: row.item.name, settlement: renamedSettlement };
    const renamedSnapshot = {
      settlements: [renamedItem],
      byId: new Map([[row.id, renamedItem]]),
    };
    const after = authoritySignatureFor({
      worldState: {}, snapshot: renamedSnapshot, actorId: row.id,
    });
    expect(after).toBe(before);
    // …while the ADDRESS id does move with the name, which is what makes it an
    // address rather than a continuity key.
    const renamedBooks = readWarSeatBooks({
      worldState: {}, snapshot: renamedSnapshot, actorId: row.id, opponentId: 'elsewhere',
    });
    expect(renamedBooks.factionId).toBe(`${row.id}:${stablePart('The Renamed Body')}`);
  });

  it('both seat-transition writers spell governingFactionId the same way', () => {
    // applyWorldPulse's approved-transfer path and npcLadderKernel's organic
    // succession path compose the same persisted row. They had drifted: one
    // resolved the ladder key, the other fell back to the INSTALLER's id.
    expect(ROWS.length).toBeGreaterThanOrEqual(20); // OWN FLOOR
    for (const row of ROWS) {
      const spelled = seatTransitionGoverningFactionId(row.governing);
      expect(spelled).toBe(ladderFactionKey(row.governing));
      expect(spelled).toMatch(/^fac\./);
      expect(spelled).not.toBe('');
    }
    expect(seatTransitionGoverningFactionId(null)).toBe('');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PIN-2 — THE SINGLE-WRITER CLAIM, ENFORCED OVER THE REAL WRITER'S REAL OUTPUT
//
// TCD-1 asserted that applyWorldPulse's approved-transfer path and
// npcLadderKernel's organic-succession path "cannot drift again" because both
// route through `seatTransitionGoverningFactionId`. That was a CLAIM, not a
// GUARD. A verifier planted the exact pre-fix spelling back at the call site —
//
//     src/domain/worldPulse/applyWorldPulse.js:966
//     const governingFactionId = String(governingFaction?.id || installerFactionId || '');
//
// — left the helper untouched, and ran NINE suites: ALL GREEN. The one pin that
// mentioned the helper (`both seat-transition writers spell governingFactionId
// the same way`, above) calls `seatTransitionGoverningFactionId` DIRECTLY, so it
// proves the helper is correct and says nothing at all about whether the writer
// still calls it. A drift the repair removed could be reintroduced tomorrow with
// the whole gate green.
//
// ⚠ THE ANCHOR IS THE WRITER'S OUTPUT, NEVER A FIXTURE. These pins drive the
// REAL `applyWorldPulseOutcomes` over the REAL generated worlds of the corpus
// above and read the row it actually persisted onto the npcLadder ledger. A
// fixture of the READER's shape is precisely what hid the four earlier members
// of this defect class, and a fixture here would hide the fifth.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Drive ONE approved `government_change` through the production apply mouth over
 * a real generated world, and return what was actually persisted.
 *
 * Everything the pulse needs is derived from the world under test:
 *   • the CHALLENGER is a real non-governing faction off that settlement's own
 *     roster, and `installerFactionId` is MINTED BY THE REAL PRODUCER —
 *     `factionCompetitionId`, factionCompetition's own exported spelling of the
 *     id it puts in `proposalPayload.factionId`. It used to be hand-spelled here
 *     as `${row.id}:${stablePart(nameOf(challenger))}` under a comment asserting
 *     the copy matched the producer, which is exactly the restated-derivable
 *     class this file's own lane reported (STOP-PR-1): a hand copy of a
 *     derivable goes stale silently the day the producer changes its mint, and
 *     the pin would then be testing a spelling nothing writes. Calling the
 *     producer cannot drift from the producer;
 *   • the ladder's rungs are real npc ids from that same world. They are not
 *     decoration: `normalizeSeatTransitions` DROPS a row with no seat on either
 *     side, so without a resolvable seat the writer runs and persists NOTHING
 *     and every assertion below would pass vacuously. The `expect(rows.length)`
 *     check is what makes that failure loud.
 */
function driveApprovedGovernmentChange(row) {
  const factions = row.settlement?.powerStructure?.factions || [];
  const challenger = factions.find((faction) => faction !== row.governing);
  const npcs = (row.settlement?.npcs || []).filter((npc) => npc?.id);
  if (!challenger || npcs.length < 2) return null;

  // THE REAL PRODUCER, called — never a copy of its spelling. `factionCompetitionId`
  // is the exported mint factionCompetition itself uses for `proposalPayload.factionId`,
  // and it takes the roster INDEX because the settlement scope is load-bearing.
  const installerFactionId = factionCompetitionId(row.id, challenger, factions.indexOf(challenger));
  const ladder = {
    [row.id]: {
      factions: {
        [ladderFactionKey(row.governing)]: { rungs: [npcs[0].id] },
        [ladderFactionKey(challenger)]: { rungs: [npcs[1].id] },
      },
    },
  };
  const worldState = setSpatialLedger(
    { tick: 3, simulationRules: { warLayerEnabled: true, warTerminationEnabled: true } },
    'npcLadder',
    ladder,
  );
  const result = applyWorldPulseOutcomes({
    snapshot: { settlements: [row.item], byId: new Map([[row.id, row.item]]) },
    worldState,
    settlementMap: new Map([[row.id, { saveId: row.id, settlement: row.settlement }]]),
    outcomes: [{
      id: `tcd1:gc:${row.id}`,
      type: 'faction',
      targetSaveId: row.id,
      factionId: installerFactionId,
      proposalPayload: {
        kind: 'government_change',
        factionId: installerFactionId,
        settlementId: row.id,
      },
      metadata: { factionName: nameOf(challenger) },
    }],
    tick: 3,
    now: '2026-08-07T00:00:00.000Z',
  });

  const record = getSpatialLedger(result.worldState, 'npcLadder')?.[row.id];
  const transition = (record?.seatTransitions || [])
    .find((seat) => seat?.cause === 'government_change');
  if (!transition) return null;
  const nextSettlement = result.settlementUpdates
    .find((update) => update.saveId === row.id)?.settlement;
  const governingAfter = nextSettlement ? governingFactionOf(nextSettlement) : null;
  return {
    id: row.id, transition, installerFactionId, challenger, governingAfter,
    governingBefore: row.governing,
  };
}

const WRITTEN = ROWS.map(driveApprovedGovernmentChange).filter(Boolean);

describe('TCD-1 PIN-2 — the seat-transition writer, over real worlds', () => {
  it('every corpus world really produced a persisted transition (no vacuous denominator)', () => {
    // A TOTAL POSITIVE PREDICATE, not "some rows survived". An enumeration on
    // the credit side fails OPEN: were the drive to stop persisting rows — a
    // renamed cause, a dropped seat, a gating rule change — every per-row
    // assertion below would iterate an empty list and report green.
    expect(WRITTEN).toHaveLength(ROWS.length);
    expect(WRITTEN.length).toBeGreaterThanOrEqual(20);
    for (const written of WRITTEN) {
      expect(written.governingAfter).toBeTruthy();
      expect(written.installerFactionId).not.toBe('');
      expect(String(written.transition.governingFactionId || '')).not.toBe('');
    }
  });

  it('the persisted governingFactionId is the HOLDER\'s ladder key — the exact plant reds here', () => {
    // THIS is the assertion the planted pre-fix spelling
    // `String(governingFaction?.id || installerFactionId || '')` fails: with no
    // `.id` on any generated faction row (re-measured above), that expression
    // evaluates to installerFactionId on 100% of real worlds.
    expect(WRITTEN.length).toBeGreaterThanOrEqual(20); // OWN FLOOR
    for (const written of WRITTEN) {
      expect(written.transition.governingFactionId)
        .toBe(ladderFactionKey(written.governingAfter));
      // …and it is NOT the installer. Stated as its own assertion rather than
      // left implicit, because this is the drift itself, in one line.
      expect(written.transition.governingFactionId)
        .not.toBe(written.installerFactionId);
    }
  });

  it('the persisted value AGREES with the shared helper (agreement only — not routing)', () => {
    // ⚠ CORRECTED CLAIM, 2026-08-07. This pin used to be titled "the writer
    // routes through the shared helper, byte-for-byte" and it DID NOT TEST
    // ROUTING. `seatTransitionGoverningFactionId` is value-identical to
    // `ladderFactionKey` over this corpus (the pin above asserts exactly that),
    // so an inline reimplementation in applyWorldPulse would satisfy every
    // assertion here. A header that overstates its pin is the recorded
    // doc-overstatement class; the title now names what the body proves, and the
    // routing claim is discharged by the sentinel pin below instead.
    expect(WRITTEN.length).toBeGreaterThanOrEqual(20);
    for (const written of WRITTEN) {
      expect(written.transition.governingFactionId)
        .toBe(seatTransitionGoverningFactionId(written.governingAfter));
    }
  });

  it('the writer really CALLS the shared helper — a sentinel return lands in the persisted row', () => {
    // THE ROUTING PROOF the old title claimed. The probe makes the shared export
    // return a value the real resolver cannot produce; the writer is then driven
    // for real. If applyWorldPulse resolved the id inline, the sentinel could not
    // appear and this reds — which is precisely the drift the repair removed.
    const row = ROWS[0];
    expect(row).toBeTruthy();
    const SENTINEL = 'fac.__routing_sentinel__';
    let probed;
    try {
      routingProbe.sentinel = SENTINEL;
      probed = driveApprovedGovernmentChange(row);
    } finally {
      routingProbe.sentinel = null;
    }
    expect(probed).not.toBeNull();
    expect(probed.transition.governingFactionId).toBe(SENTINEL);

    // THE NEGATIVE CONTROL, so the pin cannot pass by the probe being stuck on:
    // the same drive with the probe released writes the real resolver's answer,
    // which is NOT the sentinel. Without this, a probe that never reset would
    // make the assertion above true for the wrong reason.
    const released = driveApprovedGovernmentChange(row);
    expect(released).not.toBeNull();
    expect(released.transition.governingFactionId).not.toBe(SENTINEL);
    expect(released.transition.governingFactionId)
      .toBe(ladderFactionKey(released.governingAfter));
  });

  it('installerFactionId survives under its own honest name, in its own id space', () => {
    // The repair MOVED a value; it must not have DELETED one. The installer is
    // still recorded — under the field that actually names it — and the two
    // fields inhabit disjoint id spaces, which is why the old value could never
    // have been a merely-differently-spelled right answer.
    expect(WRITTEN.length).toBeGreaterThanOrEqual(20); // OWN FLOOR
    for (const written of WRITTEN) {
      expect(written.transition.installerFactionId).toBe(written.installerFactionId);
      expect(written.transition.governingFactionId).toMatch(/^fac\./);
      expect(written.transition.installerFactionId).toContain(':');
      expect(written.transition.installerFactionId).not.toMatch(/^fac\./);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PIN-3 — THE PERSISTED-VALUE SHIFT, MEASURED AND DECLARED
//
// TCD-1's "DECLARED GOLDEN SHIFT" section named the `war_continued_for_the_seat`
// prose-variant move and "two new field appearances" — and OMITTED this: on every
// approved `government_change` that produces a transition, the EXISTING persisted
// field `seatTransitions[].governingFactionId` CHANGES VALUE. That is not a new
// field appearing; it is a different string landing in a field that was already
// being written, and a behaviour shift that rides silently is the one thing this
// program forbids outright.
//
// MEASURED at this tree over the 30-world corpus above, 30 of 30 rows. The
// declared row below is ONE REAL WORLD end to end — `village-7100` — never an
// example assembled from several:
//   before   `village-7100:merchant_guilds`  (installerFactionId — the INSTALLER,
//                                             in factionCompetition's settlement-
//                                             scoped `${saveId}:${slug}` space)
//   after    `fac.merchant_council`          (ladderFactionKey of the body that
//                                             HOLDS the seat, in the ladder's
//                                             `fac.<slug>` space)
//
// ⚠ CORRECTION, 2026-08-07 (receipt-correction lane) — READ THIS BEFORE QUOTING
// ANY FIGURE ABOVE. Until today this record declared the row as
// `hamlet-7100:merchant_guilds` ⇒ `fac.merchant_council` and illustrated it as
// "Feudal Stewardship" + installer "Merchant Guilds" ⇒ "Merchant Council". THAT
// WAS A COMPOSITE OF TWO DIFFERENT WORLDS: on `hamlet-7100` the prior holder is
// "Free Elder Council"; "Feudal Stewardship" is `village-7100`'s prior holder.
// The id pair came from one row and the name illustration from another, and a
// fabricated-looking example in a golden-shift record poisons every real figure
// beside it. Re-measured off the live corpus by driving `driveApprovedGovern-
// mentChange` over all 30 rows: `village-7100` carries prior holder, installer
// and post-transfer holder together, so the record is RE-POINTED at a real row
// rather than re-illustrated. The two SURVIVING per-row figures below (0/30 and
// 0/30) were re-measured and are unchanged. The same composite rode in
// applyWorldPulse.js's declared-shift comment (corrected there too) and in
// TCD-1's commit messages, which are history and cannot be edited.
//
// The change is TOTAL (30/30, never 0/30 or a subset) and it is doubly a change:
//   • THE SUBJECT MOVES. `transferRulingPower` seats a NEW governing body derived
//     from the challenger's government preference — re-measured 2026-08-07, the
//     post-transfer holder shares a name with NEITHER the prior holder (0/30) NOR
//     the installer (0/30). On the declared row `village-7100`, all in one world:
//     prior holder "Feudal Stewardship", installer "Merchant Guilds", post-
//     transfer holder "Merchant Council". So the old value named a body that does
//     not hold the seat.
//   • THE ID SPACE MOVES. `${saveId}:${slug}` and `fac.<slug>` are disjoint, so no
//     reader could have accepted both. The ladder's own organic writer already
//     wrote the `fac.` space; applyWorldPulse was the one composer disagreeing.
// ═══════════════════════════════════════════════════════════════════════════

describe('TCD-1 PIN-3 — the declared persisted-value shift', () => {
  it('the shift is TOTAL: the old spelling produced the installer on every world', () => {
    // Re-derives the PRE-FIX expression rather than quoting its result, so this
    // stays true against the live corpus instead of rotting into a stale figure.
    // OWN FLOOR — `moved === WRITTEN.length` alone is `0 === 0` on an empty drive.
    expect(WRITTEN.length).toBeGreaterThanOrEqual(20);
    let moved = 0;
    for (const written of WRITTEN) {
      const preFix = String(written.governingAfter?.id || written.installerFactionId || '');
      // The `.id` arm never rescued it: no generated faction row carries `id`.
      expect(preFix).toBe(written.installerFactionId);
      expect(written.transition.governingFactionId).not.toBe(preFix);
      moved += 1;
    }
    expect(moved).toBe(WRITTEN.length);
  });

  it('the shift is a different SUBJECT, not a re-spelling of the same body', () => {
    expect(WRITTEN.length).toBeGreaterThanOrEqual(20); // OWN FLOOR
    for (const written of WRITTEN) {
      expect(nameOf(written.governingAfter)).not.toBe(nameOf(written.challenger));
      expect(nameOf(written.governingAfter)).not.toBe(nameOf(written.governingBefore));
    }
  });
});
