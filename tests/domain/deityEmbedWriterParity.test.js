/**
 * deityEmbedWriterParity.test.js — the FOUR deity-embed writers, pinned against
 * one canonical field set (Wave R-5b, item 13c; closed out by the T4 ONE-REGEN
 * batch, which both restored the missing axis and retired the premade-pool writer;
 * widened at W-FAITH F3c, ODQ §866, when the authored-character keys entered).
 *
 * THE CLASS THIS CLOSES: "embed writers drift apart." Separate places build a
 * settlement's frozen deity record, each by hand-picking fields (never a spread,
 * so no wall-clock or foreign key can leak in). Nothing structural kept them
 * agreeing, and they had already parted: the conversion writer silently dropped
 * the law axis, and it minted its ref down a chain nothing else spoke. The
 * writers:
 *
 *   1. setPrimaryDeity        src/domain/events/mutateEntities.js — the DM assign
 *   2. imposeCult             src/domain/events/mutateEntities.js — the DM cult
 *   3. reEmbedPrimaryDeity    src/domain/worldPulse/applyWorldPulse.js — the
 *                             organic conversion commit (module-private, so it is
 *                             driven here through applyWorldPulseOutcomes, the
 *                             only door the kernel itself uses)
 *   4. deitySnapshotFrom      src/domain/deitySnapshot.js — the INTENT builder the
 *                             store dispatches through, and the SAME function the
 *                             restore-from-world lane re-picks a persisted patron
 *                             through. Writers 1–3 commit; this one is what the
 *                             commit is handed, and what a restore rebuilds.
 *
 * ⛔ WHY THE FOURTH MATTERS MORE THAN ITS ORDINAL. A key added to writers 1–3 and
 * NOT to writer 4 survives every assign and every conversion and is then silently
 * STRIPPED the first time a DM restores an ousted patron from the living world —
 * a data-loss path with no error, no receipt, and a green parity test if the
 * parity test only knew about the commit writers. F3c's carry therefore lands
 * atomically across all four, and the sweep plants its regression at writer 4.
 *
 * A FIFTH writer once existed: `poolDeityEmbed`, the premade-pool embed builder
 * in the generation step that baked a starting pantheon into every seed. The T4
 * batch retired the premade pool under the deity doctrine (no premade deities —
 * custom content only), and the builder went with it. Nothing replaced it: the
 * activation seam copies a persisted latent record VERBATIM, so it mints no
 * embed of its own and there is no fourth key set left to drift. The seam's own
 * behavior is pinned by tests/domain/latentPantheon.test.js.
 *
 * WHAT IS PINNED
 *   • each writer's exact produced key set against the canonical list;
 *   • `_deityRef` truthy on every writer's output — an embed always carries its
 *     own identity, so no reader has to guess one from a name;
 *   • the conversion writer's committed `config.primaryDeityRef` equals
 *     `deityIdOf(snapshot)` — the SAME id the pantheon ledger keys that snapshot
 *     by — so the config and the ledger can never split a deity in two;
 *   • the two rots removed with it: the ousted patron's ref is never inherited
 *     by the incoming deity, and the `converted:` namespace no longer exists;
 *   • that the restored `lawAxis` is REACHABLE — it changes the coordinate the
 *     engine actually reads, not merely a stored field (the last describe block);
 *   • F3c's carry: all four writers agree on the six authored-character keys, the
 *     restore ROUND-TRIP preserves them, a list-valued key survives as a list, and
 *     a deity carrying none of them still produces a byte-identical embed.
 */

import { describe, expect, test } from 'vitest';

import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
// The consumer leaf the restored axis feeds — imported so the reachability pin
// reads the axis the way the engine does, never by re-deriving the mapping here.
import { chaos01, deityTemper } from '../../src/domain/worldPulse/deityAxes.js';
import { deityIdOf } from '../../src/domain/worldPulse/pantheon.js';
// Writer 4 and its shared picker. `deitySnapshotFrom` is BOTH the intent builder
// the store dispatches through and the restore-from-world path, which is why the
// carry had to reach it in the same act as the three commit-time writers.
// ⚠ TWO ADDRESSES SINCE SUBSTRATE WAVE 6, and the split is the point: the ROSTER lives
// in the zero-import commit leaf (the eager mutation router imports only that), while
// writer 4 stays in the read-side module. Importing the roster from its one home rather
// than through a re-export is what keeps `deityTemperConsumerCensus`'s "exactly one src
// module names these six keys" arm true.
import { DEITY_AUTHORED_CHARACTER_KEYS } from '../../src/domain/deityCommitEmbed.js';
import { deitySnapshotFrom } from '../../src/domain/deitySnapshot.js';

/** The field set every disciplined deity embed carries. */
const CANONICAL_KEYS = ['_deityRef', 'name', 'alignmentAxis', 'temperamentAxis', 'rankAxis', 'lawAxis'];

/**
 * The CONDITIONAL keys — carried only when the authored record has them. `domain`
 * is the long-standing precedent; the six authored-character keys joined it at
 * W-FAITH F3c (ODQ §866), which is why this list and `DEITY_AUTHORED_CHARACTER_KEYS`
 * are pinned against each other below rather than both restated by hand.
 */
const CONDITIONAL_KEYS = ['domain', ...DEITY_AUTHORED_CHARACTER_KEYS];

/**
 * A fully-specified source deity — every optional field present, so an omission is
 * visible. ⚠ This fixture is the file's DISCOVERY instrument: a writer that forgot
 * one of the six authored-character keys is invisible to a fixture that does not
 * author them, so every new conditional key must land here in the same act that
 * lands it in the writers.
 *
 * `characterAxes` is a LIST on purpose — it is the one string-or-string-list field,
 * and a writer that coerced it with `String()` would silently join it into one
 * corrupt token that every downstream splitter would then mis-read.
 */
const SOURCE = {
  name: 'Vael',
  alignmentAxis: 'good',
  temperamentAxis: 'warlike',
  rankAxis: 'major',
  lawAxis: 'lawful',
  domain: 'war',
  authoredTemper: 'peacelike',
  characterAxes: ['MERCY:virtue:marked', 'TRUST:vice:a_touch'],
  boonChannel: 'harvest',
  boonStrength: 'firm',
  baneChannel: 'sea',
  baneStrength: 'faint',
};

const withRef = (ref, extra = {}) => ({ _deityRef: ref, ...SOURCE, ...extra });

function baseSettlement(config = {}) {
  return {
    name: 'Test Hold',
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road', ...config },
    institutions: [],
    activeConditions: [],
    npcs: [],
    powerStructure: {},
  };
}

/** Writer 1 — the DM assign, through the pure event handler. */
function assign(settlement, deityRef, snapshot) {
  return mutateSettlement({
    settlement,
    event: { type: 'SET_PRIMARY_DEITY', targetId: deityRef, payload: { deityRef, snapshot } },
  });
}

/** Writer 2 — the DM cult imposition, through the pure event handler. */
function impose(settlement, deityRef, snapshot) {
  return mutateSettlement({
    settlement,
    event: { type: 'IMPOSE_CULT', targetId: deityRef, payload: { deityRef, snapshot } },
  });
}

/**
 * Writer 4 — the organic conversion commit. reEmbedPrimaryDeity is module-private
 * by design (the kernel is its only caller), so this drives it the way the kernel
 * does: one conversion outcome carrying the winning neighbour's snapshot, applied
 * through applyWorldPulseOutcomes.
 */
function reEmbedViaPulse(settlement, snapshot) {
  const item = {
    id: 'target',
    name: settlement.name,
    settlement,
    activeConditions: [],
    causal: { scores: {} },
    system: { resourcePressure: { value: 50 } },
  };
  const worldState = { tick: 4 };
  const result = applyWorldPulseOutcomes({
    snapshot: { worldState, regionalGraph: { channels: [], edges: [] }, settlements: [item], byId: new Map([['target', item]]) },
    worldState,
    regionalGraph: { channels: [], edges: [] },
    settlementMap: new Map([['target', { saveId: 'target', settlement }]]),
    outcomes: [{ id: 'conv-1', targetSaveId: 'target', deityReembed: { snapshot, fromSettlementId: 'src' } }],
    tick: 4,
    now: '2026-01-01T00:00:00.000Z',
  });
  const update = result.settlementUpdates.find((u) => String(u.saveId) === 'target');
  return update ? update.settlement : settlement;
}

describe('deity embed writers — one canonical field set', () => {
  test('setPrimaryDeity (DM assign) writes the canonical keys plus the optional domain', () => {
    const next = assign(baseSettlement(), 'custom:lu_vael', SOURCE);
    expect(Object.keys(next.config.primaryDeitySnapshot).sort())
      .toEqual([...CANONICAL_KEYS, ...CONDITIONAL_KEYS].sort());
    expect(next.config.primaryDeitySnapshot._deityRef).toBeTruthy();
  });

  test('imposeCult (DM cult) writes the same canonical keys plus the optional domain', () => {
    const next = impose(baseSettlement(), 'custom:lu_vael', SOURCE);
    const entry = next.config.cultDeitySnapshots[0];
    expect(Object.keys(entry).sort()).toEqual([...CANONICAL_KEYS, ...CONDITIONAL_KEYS].sort());
    expect(entry._deityRef).toBeTruthy();
  });

  test('reEmbedPrimaryDeity (organic conversion) writes the FULL canonical key set — parity restored at T4', () => {
    const next = reEmbedViaPulse(baseSettlement(), withRef('deity:core:vael'));
    const embed = next.config.primaryDeitySnapshot;
    expect(embed._deityRef).toBeTruthy();
    // The T4 ONE-REGEN batch restored lawAxis here. The conversion writer now
    // produces the same key set as the DM assign, on every axis.
    expect(Object.keys(embed).sort()).toEqual([...CANONICAL_KEYS, ...CONDITIONAL_KEYS].sort());
    expect(embed.lawAxis).toBe('lawful');           // carried from SOURCE, not defaulted
  });

  test('a lawAxis-less snapshot still embeds the documented `neutral` — absence tolerance survives parity', () => {
    const { lawAxis, ...legacy } = SOURCE;
    expect(lawAxis).toBe('lawful');                 // the field really was dropped from the input
    const next = reEmbedViaPulse(baseSettlement(), { _deityRef: 'deity:core:old', ...legacy });
    expect(next.config.primaryDeitySnapshot.lawAxis).toBe('neutral');
  });

  test('deitySnapshotFrom (the intent builder) carries the same conditional keys, minus the ref it does not mint', () => {
    // Writer 4. It is the one writer that does NOT stamp `_deityRef` — the store
    // dispatches the ref alongside the snapshot — so its key set is the canonical
    // list without that one, plus every conditional key present on the source.
    const built = deitySnapshotFrom(SOURCE);
    expect(Object.keys(built).sort())
      .toEqual([...CANONICAL_KEYS.filter((k) => k !== '_deityRef'), ...CONDITIONAL_KEYS].sort());
  });
});

describe('W-FAITH F3c · THE CARRY — four writers, one act (ODQ §866)', () => {
  test('all four writers carry every authored-character key, and the list is not restated by hand', () => {
    // ⭐ THE ATOMICITY PROOF. Four writers are driven through their REAL doors and
    // their outputs intersected: a key missing from any one of them fails here, and
    // the expected list is the module's own exported roster rather than a fixture
    // copy of it, so a key added to the roster with no writer support also fails.
    const built = deitySnapshotFrom(SOURCE);
    const assigned = assign(baseSettlement(), 'custom:lu_vael', SOURCE).config.primaryDeitySnapshot;
    const culted = impose(baseSettlement(), 'custom:lu_vael', SOURCE).config.cultDeitySnapshots[0];
    const converted = reEmbedViaPulse(baseSettlement(), withRef('deity:core:vael')).config.primaryDeitySnapshot;

    expect(DEITY_AUTHORED_CHARACTER_KEYS.length).toBe(6);
    for (const key of DEITY_AUTHORED_CHARACTER_KEYS) {
      for (const [writer, embed] of [
        ['deitySnapshotFrom', built], ['setPrimaryDeity', assigned],
        ['imposeCult', culted], ['reEmbedPrimaryDeity', converted],
      ]) {
        expect(key in embed, `${writer} dropped ${key} — the carry is not atomic`).toBe(true);
        expect(embed[key], `${writer} altered ${key}`).toEqual(SOURCE[key]);
      }
    }
  });

  test('⛔ THE RESTORE ROUND-TRIP — a persisted embed re-picked through the builder loses nothing', () => {
    // The sharper half of the same bug, executed. A DM restores an ousted patron by
    // handing its PERSISTED snapshot back through `deitySnapshotFrom`; before the
    // carry reached writer 4, every authored-character key died silently on that
    // path while surviving every other one.
    const committed = assign(baseSettlement(), 'custom:lu_vael', SOURCE).config.primaryDeitySnapshot;
    const restored = deitySnapshotFrom(committed);
    for (const key of DEITY_AUTHORED_CHARACTER_KEYS) {
      expect(restored[key], `${key} was stripped on restore`).toEqual(SOURCE[key]);
    }
    // …and a SECOND round-trip is a fixed point, so a restore of a restore is safe.
    expect(deitySnapshotFrom(restored)).toEqual(restored);
  });

  test('the list-valued key survives as a LIST — no writer coerces it to a joined string', () => {
    // ⚠ The failure this forbids is quiet and total: `String(['A:virtue:marked'])`
    // yields 'A:virtue:marked', and with two entries a comma-joined token no reader
    // can split back. The fixture authors two entries precisely so a coercion shows.
    expect(SOURCE.characterAxes).toHaveLength(2);
    for (const embed of [
      deitySnapshotFrom(SOURCE),
      assign(baseSettlement(), 'custom:lu_vael', SOURCE).config.primaryDeitySnapshot,
      impose(baseSettlement(), 'custom:lu_vael', SOURCE).config.cultDeitySnapshots[0],
      reEmbedViaPulse(baseSettlement(), withRef('deity:core:vael')).config.primaryDeitySnapshot,
    ]) {
      expect(Array.isArray(embed.characterAxes)).toBe(true);
      expect(embed.characterAxes).toEqual(['MERCY:virtue:marked', 'TRUST:vice:a_touch']);
    }
  });

  test('a LEGACY deity carrying none of the six mints none of the six — the byte-identity ground', () => {
    // ⭐ WHY THE CARRY IS SAFE, stated as a key set rather than as a promise. Every
    // deity authored before W-FAITH F1c carries none of these fields, so every one
    // of them still produces exactly the embed it produced before this car.
    const legacy = {
      name: 'Old Vael', alignmentAxis: 'good', temperamentAxis: 'warlike',
      rankAxis: 'major', lawAxis: 'lawful', domain: 'war',
    };
    const embeds = [
      deitySnapshotFrom(legacy),
      assign(baseSettlement(), 'custom:lu_old', legacy).config.primaryDeitySnapshot,
      impose(baseSettlement(), 'custom:lu_old', legacy).config.cultDeitySnapshots[0],
      reEmbedViaPulse(baseSettlement(), { _deityRef: 'deity:core:old', ...legacy }).config.primaryDeitySnapshot,
    ];
    for (const embed of embeds) {
      for (const key of DEITY_AUTHORED_CHARACTER_KEYS) {
        expect(key in embed, `${key} appeared on a deity that never authored it`).toBe(false);
      }
      // The anchor: the embed is real and fully built, so the six absences above are
      // a measurement rather than the shape of an empty object.
      expect(embed.domain).toBe('war');
      expect(embed.lawAxis).toBe('lawful');
    }
  });

  test('the authored word now REACHES the engine — the gap F2c measured is closed', () => {
    // EFFECT-REACHABILITY, the same discipline the lawAxis pin above applies. A key
    // set alone would pass even if every reader ignored the field; this drives the
    // committed embed through the actual consumer seam. The deity's axes derive
    // 'peacelike' on their own, so the fixture authors the CONTRADICTING word to
    // make the arm's answer unambiguous.
    const contradicting = { ...SOURCE, alignmentAxis: 'evil', lawAxis: 'chaotic', authoredTemper: 'peacelike' };
    expect(deityTemper({ alignmentAxis: 'evil', lawAxis: 'chaotic' })).toBe('warlike');
    const committed = assign(baseSettlement(), 'custom:lu_vael', contradicting).config.primaryDeitySnapshot;
    expect(deityTemper(committed)).toBe('peacelike');
    const converted = reEmbedViaPulse(baseSettlement(), { _deityRef: 'deity:core:vael', ...contradicting })
      .config.primaryDeitySnapshot;
    expect(deityTemper(converted)).toBe('peacelike');
  });
});

describe('the restored axis is REACHABLE — it changes what the engine reads (T4)', () => {
  /**
   * Drive a conversion with the given lawAxis and read the committed embed.
   *
   * ⚠ `authoredTemper` is dropped from the source here, and that is the point of
   * the whole block rather than a convenience: this pin measures the DERIVATION
   * from the two alignment axes, and after F3c's carry an authored word reaches the
   * embed and legitimately silences that derivation (W-FAITH D1 — authored wins).
   * A fixture that authored a temper would make `deityTemper` answer the author on
   * both ends of the axis, and the pin would then report "the lift is not armed"
   * when in truth it was reading a different arm. Measuring the derivation requires
   * a deity that derives.
   */
  const convertWith = (/** @type {string} */ axis) => {
    const { authoredTemper, ...derives } = SOURCE;
    expect(authoredTemper).toBeTruthy();            // the field really was dropped
    return reEmbedViaPulse(
      baseSettlement(),
      { _deityRef: 'deity:core:vael', ...derives, lawAxis: axis },
    ).config.primaryDeitySnapshot;
  };

  // EFFECT-REACHABILITY (EP discipline): a parity pin alone would pass even if
  // every reader ignored the field. This drives the axis through the ACTUAL
  // consumer leaf — deityAxes.chaos01, the coordinate ~14 pulse modules read —
  // and proves the two ends of the axis produce DIFFERENT engine input. Before
  // the restore both of these read 0.5, so this pin fails on the old writer:
  // it is the executable witness that the lift is armed, not merely stored.
  test('lawful vs chaotic converts produce DIFFERENT chaos01 — the lift is armed', () => {
    const lawful = convertWith('lawful');
    const chaotic = convertWith('chaotic');
    expect(chaos01(lawful)).toBe(0);
    expect(chaos01(chaotic)).toBe(1);
    expect(chaos01(lawful)).not.toBe(chaos01(chaotic));
  });

  test('the difference carries all the way into a derived temper', () => {
    // deityTemper reads chaos01; with alignment held fixed at 'good', the law
    // axis alone decides whether the derivation clears the peacelike band.
    const good = { alignmentAxis: 'good' };
    expect(deityTemper({ ...good, ...convertWith('lawful') })).toBe('peacelike');
    expect(deityTemper({ ...convertWith('chaotic'), alignmentAxis: 'neutral' })).toBe('neutral');
    // And the absent-axis convert still lands on the documented midpoint.
    const { lawAxis, ...legacy } = SOURCE;
    expect(lawAxis).toBe('lawful');
    const legacyEmbed = reEmbedViaPulse(baseSettlement(), { _deityRef: 'deity:core:old', ...legacy })
      .config.primaryDeitySnapshot;
    expect(chaos01(legacyEmbed)).toBe(0.5);
  });
});

describe('the conversion commit keeps ONE identity (item 13c)', () => {
  test('the committed ref equals deityIdOf(snapshot) — config and pantheon ledger agree', () => {
    const snapshot = withRef('deity:core:vael');
    const next = reEmbedViaPulse(baseSettlement(), snapshot);
    expect(next.config.primaryDeityRef).toBe(deityIdOf(snapshot));
    expect(next.config.primaryDeitySnapshot._deityRef).toBe(deityIdOf(snapshot));
  });

  test('the OUSTED patron’s ref is never inherited by the incoming deity', () => {
    // The old chain fell back to config.primaryDeityRef whenever the incoming
    // snapshot carried no ref of its own — stamping the LOSER's id onto the
    // WINNER's record, two gods wearing one identity. The winner keys by its own
    // name instead.
    const seated = baseSettlement({ primaryDeityRef: 'deity:lu_old:ousted' });
    const { _deityRef, ...reflessWinner } = withRef('unused', { name: 'Winner' });
    const next = reEmbedViaPulse(seated, reflessWinner);
    expect(next.config.primaryDeityRef).toBe('deity:Winner');
    expect(next.config.primaryDeityRef).not.toBe('deity:lu_old:ousted');
  });

  test('no `converted:` namespace is ever minted; a ref-less snapshot keys by name', () => {
    const { _deityRef, ...refless } = withRef('unused');
    expect(_deityRef).toBe('unused');
    const next = reEmbedViaPulse(baseSettlement(), refless);
    expect(next.config.primaryDeityRef).toBe('deity:Vael');
    expect(next.config.primaryDeityRef.startsWith('converted:')).toBe(false);
  });

  test('a snapshot with no identity at all is REFUSED, not committed under an invented ref', () => {
    const before = baseSettlement();
    const next = reEmbedViaPulse(before, { alignmentAxis: 'good' });
    expect(next.config.primaryDeityRef).toBeUndefined();
    expect(next.config.primaryDeitySnapshot).toBeUndefined();
  });
});
