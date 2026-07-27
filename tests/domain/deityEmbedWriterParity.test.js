/**
 * deityEmbedWriterParity.test.js — the FOUR deity-embed writers, pinned against
 * one canonical field set (Wave R-5b, item 13c; the executable form of item 13a's
 * deferral).
 *
 * THE CLASS THIS CLOSES: "embed writers drift apart." Four separate places build
 * a settlement's frozen deity record, each by hand-picking fields (never a
 * spread, so no wall-clock or foreign key can leak in). Nothing structural kept
 * them agreeing, and they had already parted: the conversion writer silently
 * dropped the law axis, and it minted its ref down a chain nothing else spoke.
 * The writers:
 *
 *   1. setPrimaryDeity        src/domain/events/mutateEntities.js — the DM assign
 *   2. imposeCult             src/domain/events/mutateEntities.js — the DM cult
 *   3. poolDeityEmbed         src/generators/steps/seedStartingPantheon.js — the
 *                             generated latent pantheon (activation copies it verbatim)
 *   4. reEmbedPrimaryDeity    src/domain/worldPulse/applyWorldPulse.js — the
 *                             organic conversion commit (module-private, so it is
 *                             driven here through applyWorldPulseOutcomes, the
 *                             only door the kernel itself uses)
 *
 * WHAT IS PINNED
 *   • each writer's exact produced key set against the canonical list;
 *   • `_deityRef` truthy on every writer's output — an embed always carries its
 *     own identity, so no reader has to guess one from a name;
 *   • the conversion writer's committed `config.primaryDeityRef` equals
 *     `deityIdOf(snapshot)` — the SAME id the pantheon ledger keys that snapshot
 *     by — so the config and the ledger can never split a deity in two;
 *   • the two rots removed with it: the ousted patron's ref is never inherited
 *     by the incoming deity, and the `converted:` namespace no longer exists.
 *
 * THE ONE DELIBERATE ASYMMETRY: reEmbedPrimaryDeity omits `lawAxis`. That is
 * TODAY'S TRUTH, asserted as such rather than left unnoticed — restoring the axis
 * moves every conversion-bearing seeded advance (the law_order lift in
 * deriveSystemState plus fourteen chaos01-reading pulse modules), so it belongs to
 * the T4 ONE-REGEN batch, not here. See the loud marker on that assertion.
 */

import { describe, expect, test } from 'vitest';

import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { deityIdOf } from '../../src/domain/worldPulse/pantheon.js';
// The generated-pantheon writer. (This module also carries the premade pool the
// deity doctrine retires at T4; the import here is of the EMBED BUILDER, which
// survives that removal.)
import { poolDeityEmbed } from '../../src/generators/steps/seedStartingPantheon.js';

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

  test('poolDeityEmbed (generated pantheon) writes the canonical keys plus domain and the ratified portfolio', () => {
    const bare = poolDeityEmbed({ slug: 'vael', ...SOURCE });
    expect(Object.keys(bare).sort()).toEqual([...CANONICAL_KEYS, 'domain'].sort());
    expect(bare._deityRef).toBeTruthy();
    // `portfolio` is the owner-ratified free-text flavor field — additive, zero
    // mechanics — and appears only when the pool record carries one.
    const flavored = poolDeityEmbed({ slug: 'vael', ...SOURCE, portfolio: 'the broken spear' });
    expect(Object.keys(flavored).sort()).toEqual([...CANONICAL_KEYS, 'domain', 'portfolio'].sort());
  });

  test('reEmbedPrimaryDeity (organic conversion) writes the canonical keys EXCEPT lawAxis — today’s truth, flipped at T4', () => {
    const next = reEmbedViaPulse(baseSettlement(), withRef('deity:core:vael'));
    const embed = next.config.primaryDeitySnapshot;
    expect(embed._deityRef).toBeTruthy();
    // ⚠️ T4 FLIPS THIS LINE — see the T4 ONE-REGEN batch note (item 13a).
    // Restoring lawAxis here is DRIFT-BEARING: it re-arms the law_order lift and
    // every chaos01 reader, so a conversion-bearing seeded advance moves. When
    // that batch lands, change the expectation to the full CANONICAL_KEYS set
    // and delete this comment.
    expect(Object.keys(embed).sort()).toEqual([...CANONICAL_KEYS.filter((k) => k !== 'lawAxis'), 'domain'].sort());
    expect(embed.lawAxis).toBeUndefined();
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
