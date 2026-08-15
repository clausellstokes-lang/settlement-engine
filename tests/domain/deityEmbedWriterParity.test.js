/**
 * deityEmbedWriterParity.test.js — the THREE deity-embed writers, pinned against
 * one canonical field set (Wave R-5b, item 13c; closed out by the T4 ONE-REGEN
 * batch, which both restored the missing axis and retired the fourth writer).
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
 *
 * A FOURTH writer once existed: `poolDeityEmbed`, the premade-pool embed builder
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
 *     engine actually reads, not merely a stored field (the last describe block).
 */

import { describe, expect, test } from 'vitest';

import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
// The consumer leaf the restored axis feeds — imported so the reachability pin
// reads the axis the way the engine does, never by re-deriving the mapping here.
import { chaos01, deityTemper } from '../../src/domain/worldPulse/deityAxes.js';
import { deityIdOf } from '../../src/domain/worldPulse/pantheon.js';

/** The field set every disciplined deity embed carries. */
const CANONICAL_KEYS = ['_deityRef', 'name', 'alignmentAxis', 'temperamentAxis', 'rankAxis', 'lawAxis'];

/** A fully-specified source deity — every optional field present, so an omission is visible. */
const SOURCE = {
  name: 'Vael',
  alignmentAxis: 'good',
  temperamentAxis: 'warlike',
  rankAxis: 'major',
  lawAxis: 'lawful',
  domain: 'war',
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
      .toEqual([...CANONICAL_KEYS, 'domain'].sort());
    expect(next.config.primaryDeitySnapshot._deityRef).toBeTruthy();
  });

  test('imposeCult (DM cult) writes the same canonical keys plus the optional domain', () => {
    const next = impose(baseSettlement(), 'custom:lu_vael', SOURCE);
    const entry = next.config.cultDeitySnapshots[0];
    expect(Object.keys(entry).sort()).toEqual([...CANONICAL_KEYS, 'domain'].sort());
    expect(entry._deityRef).toBeTruthy();
  });

  test('reEmbedPrimaryDeity (organic conversion) writes the FULL canonical key set — parity restored at T4', () => {
    const next = reEmbedViaPulse(baseSettlement(), withRef('deity:core:vael'));
    const embed = next.config.primaryDeitySnapshot;
    expect(embed._deityRef).toBeTruthy();
    // The T4 ONE-REGEN batch restored lawAxis here. The conversion writer now
    // produces the same key set as the DM assign, on every axis.
    expect(Object.keys(embed).sort()).toEqual([...CANONICAL_KEYS, 'domain'].sort());
    expect(embed.lawAxis).toBe('lawful');           // carried from SOURCE, not defaulted
  });

  test('a lawAxis-less snapshot still embeds the documented `neutral` — absence tolerance survives parity', () => {
    const { lawAxis, ...legacy } = SOURCE;
    expect(lawAxis).toBe('lawful');                 // the field really was dropped from the input
    const next = reEmbedViaPulse(baseSettlement(), { _deityRef: 'deity:core:old', ...legacy });
    expect(next.config.primaryDeitySnapshot.lawAxis).toBe('neutral');
  });
});

describe('the restored axis is REACHABLE — it changes what the engine reads (T4)', () => {
  /** Drive a conversion with the given lawAxis and read the committed embed. */
  const convertWith = (/** @type {string} */ axis) =>
    reEmbedViaPulse(baseSettlement(), withRef('deity:core:vael', { lawAxis: axis }))
      .config.primaryDeitySnapshot;

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
