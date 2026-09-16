/**
 * locksSurviveFullGenerate.test.js — THE PROMISE guard for locks engine PHASE B,
 * pinned against the REAL pipeline.
 *
 * Sibling of locksSurviveReroll.test.js, which pins the same two obligations for a
 * SECTION reroll. This file pins them for a FULL generate, where the stakes are
 * higher because a full roll re-issues every id to a stranger:
 *
 *  1. BYTE-IDENTITY / DORMANCY, and it is the constitutional one. A settlement
 *     whose lock map names no NPC id — absent, `{}`, booleans-only, name-keyed
 *     arrays only, garbage, or ids nobody holds — must come out of the carry as
 *     the SAME OBJECT the pipeline produced. Not deep-equal: the same reference,
 *     because that is the only proof the carry could not have rewritten a byte.
 *     THE PROMISE ("a seed is a world, forever") allows no same-seed drift, and a
 *     lock-free world is the world every existing save is in. If this reds, the
 *     tail has stopped being additive — do NOT re-record anything, find the draw.
 *
 *  2. SURVIVAL + CROSS-SECTION COHERENCE. A locked character comes bodily through
 *     a full generate, takes over a fresh slot, and the rest of the town is
 *     repaired to agree: no relationship, faction roster, secret, pressure
 *     sentence or prominent-relationship line may still name the character the
 *     keeper displaced. Pinned across TWO generates, because the id-remap failure
 *     (the lock silently following whoever took the old slot) is invisible in one.
 *
 * Against the real pipeline, never a hand-rolled roster: substitution, the
 * relevance re-sort, the archetype prose and the faction relink that make ids move
 * only exist there (generator-probe-corpus hazard — bare generators are not the
 * pipeline).
 *
 * seed-loop: collected — the dormancy sweep runs every lock shape through
 * collectSeedFailures, so a partial breakage reports its true size.
 *
 * @enforced-by this test
 */
import { describe, test, expect, beforeAll } from 'vitest';
import {
  generateSettlementPipeline,
  carryLockedRosterThroughGenerate,
} from '../../src/generators/generateSettlementPipeline.js';
import { locksAfterFullGenerate } from '../../src/domain/locksPreservation.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectPresentThenAbsent, expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const CFG = {
  settType: 'town',
  culture: 'germanic',
  terrain: 'grassland',
  tradeRouteAccess: 'road',
};
// A pair chosen by probe, not by hope: world A's roster is strictly larger than
// world B's, several of A's mid-roster characters are absent from B, and at least
// one of them inherits a DIFFERENT id on the way in — which is the only shape that
// can distinguish a working remap from a broken one.
const SEED_A = 'lockb-A-1';
const SEED_B = 'lockb-B-1';
const SEED_C = 'lockb-B-2';

/** @type {Record<string, any>} */
let worldA;
/** @type {Record<string, any>} */
let worldB;

beforeAll(() => {
  worldA = generateSettlementPipeline(CFG, null, { seed: SEED_A, customContent: {} });
  worldB = generateSettlementPipeline(CFG, null, { seed: SEED_B, customContent: {} });
}, 120_000);

/** Names in world B that a plain generate keeps — used to pick a real victim. */
function bNames() {
  return new Set(worldB.npcs.map((/** @type {any} */ n) => String(n.name)));
}

/** A mid-roster character of world A that world B does NOT contain. Deliberately
 *  not index 0: the roster leader can survive for unrelated reasons. */
function victim() {
  const keep = bNames();
  return worldA.npcs.slice(1).find((/** @type {any} */ n) => !keep.has(String(n.name)));
}

/** The A-character whose keeper lands on a DIFFERENT id than it arrived with. */
function idMovingVictim() {
  const keep = bNames();
  for (const cand of worldA.npcs.slice(1)) {
    if (keep.has(String(cand.name))) continue;
    const out = carryLockedRosterThroughGenerate(worldA, worldB, { npcs: [String(cand.id)] });
    const entry = out._preservation?.preserved?.[0];
    if (entry && entry.fromId !== entry.id) return { npc: cand, entry };
  }
  return null;
}

describe('THE PROMISE — a full generate is untouched unless the map names an NPC', () => {
  test('every lock shape that names no NPC id returns the SAME settlement object', () => {
    /** Each entry is a lock map that must leave the roll alone. */
    const shapes = [
      undefined, null, {}, 'locked', 42,
      { identity: true, geography: true, history: true },
      // The whole-section boolean is not an id list; it stays a no-op here (§1c).
      { npcs: true },
      // Name-keyed arrays are kept in the MAP but carry no object into the town.
      { factions: ['faction.the-guild'], institutions: ['the-mint'] },
      { npcs: 'npc_1' }, { npcs: [] }, { npcs: [null, ''] }, { weather: true },
      // An id nobody in the previous roster holds preserves nobody, so the town
      // must come back untouched rather than half-rebuilt.
      { npcs: ['npc_does_not_exist_x'] },
    ];
    const failures = collectSeedFailures(shapes, (locks) => {
      const out = carryLockedRosterThroughGenerate(worldA, worldB, /** @type {any} */ (locks));
      // SAME REFERENCE. Deep-equality would pass over a rebuilt-but-identical
      // object, and a rebuild is exactly where a hidden draw would hide.
      expect(out.settlement).toBe(worldB);
      expect(Object.prototype.hasOwnProperty.call(out, '_preservation')).toBe(false);
    });
    expectNoSeedFailures(failures, 'every NPC-id-free lock shape leaves the fresh town identical');
  });

  test('a missing or empty previous roster is dormant too', () => {
    const locks = { npcs: ['npc_1'] };
    expect(carryLockedRosterThroughGenerate(null, worldB, locks).settlement).toBe(worldB);
    expect(carryLockedRosterThroughGenerate({}, worldB, locks).settlement).toBe(worldB);
    expect(carryLockedRosterThroughGenerate({ npcs: [] }, worldB, locks).settlement).toBe(worldB);
  });
});

describe('a locked character survives the full generate that would have replaced them', () => {
  test('the fixture is not vacuous — a plain full generate really does lose them', () => {
    expect(worldA.npcs.length).toBeGreaterThan(2);
    const target = victim();
    expect(target, 'world B must be missing at least one mid-roster character of world A').toBeTruthy();
    // anchored: the same collection is asserted non-empty and to contain a
    // sibling on the line below, so an emptied roster cannot fake this green.
    expect(bNames().size).toBeGreaterThan(0);
    expect(bNames().has(String(worldB.npcs[0].name))).toBe(true);
    expect(bNames().has(String(target.name))).toBe(false);
  });

  test('locking them by id carries them through, into a fresh slot, cast size held', () => {
    const target = victim();
    const out = carryLockedRosterThroughGenerate(worldA, worldB, { npcs: [String(target.id)] });

    const survivor = out.settlement.npcs.find((/** @type {any} */ n) => String(n.name) === String(target.name));
    expect(survivor, 'the locked character must be in the new town').toBeTruthy();
    // Substitution, not insertion: the cast holds its size, so the roll stays a roll.
    expect(out.settlement.npcs.length).toBe(worldB.npcs.length);
    // The report names both ids — the pair the store needs to rewrite the map.
    const entry = out._preservation.preserved.find((/** @type {any} */ p) => p.name === target.name);
    expect(entry).toBeTruthy();
    expect(entry.fromId).toBe(String(target.id));
    expect(String(survivor.id)).toBe(String(entry.id));
    // A trace, never content: if it entered the blob it would persist and diff forever.
    expect(out.settlement._preservation).toBeUndefined();
  });

  test('the lock follows its subject across TWO full generates (the ghosting cure)', () => {
    // The failure this catches: after generate #1 the keeper holds a DIFFERENT id.
    // A map left un-remapped still names the old id, which now belongs to whoever
    // the roll put there — so generate #2 protects a stranger and drops the
    // character the user locked. One generate cannot see this.
    const moving = idMovingVictim();
    expect(moving, 'the fixture needs a keeper whose id actually MOVES, or the pin is vacuous').toBeTruthy();
    expect(moving.entry.fromId).not.toBe(moving.entry.id);

    let locks = /** @type {Record<string, any>} */ ({ npcs: [String(moving.npc.id)] });
    const first = carryLockedRosterThroughGenerate(worldA, worldB, locks);
    locks = locksAfterFullGenerate(locks, first._preservation.preserved);
    expect(locks.npcs).toEqual([String(moving.entry.id)]);

    const worldC = generateSettlementPipeline(CFG, null, { seed: SEED_C, customContent: {} });
    const second = carryLockedRosterThroughGenerate(first.settlement, worldC, locks);
    const stillThere = second.settlement.npcs.find(
      (/** @type {any} */ n) => String(n.name) === String(moving.npc.name),
    );
    expect(stillThere, 'the locked character must survive the SECOND full generate too').toBeTruthy();
  }, 120_000);

  test('the new town agrees about who is in it — no section still names the departed', () => {
    const target = victim();
    const out = carryLockedRosterThroughGenerate(worldA, worldB, { npcs: [String(target.id)] });
    const survivor = out.settlement.npcs.find((/** @type {any} */ n) => String(n.name) === String(target.name));

    // The keeper resolves in the social factions to the SAME enriched object, not
    // to the stranger whose slot it took.
    for (const faction of out.settlement.factions || []) {
      for (const member of faction.members || []) {
        if (String(member?.id) !== String(survivor.id)) continue;
        expect(String(member.name)).toBe(String(survivor.name));
      }
    }
    // No relationship edge still projects the displaced character's name.
    const live = new Set(out.settlement.npcs.map((/** @type {any} */ n) => String(n.name)));
    for (const rel of out.settlement.relationships || []) {
      if (rel.npc1Name) expect(live.has(String(rel.npc1Name))).toBe(true);
      if (rel.npc2Name) expect(live.has(String(rel.npc2Name))).toBe(true);
    }
    // ACCEPTED STALENESS, pinned so it stays a decision rather than a surprise:
    // the keeper's derived standing is frozen at the world it was preserved from
    // (regenerationPreservation.js deferral 1 — re-enriching would rewrite the
    // authored goal.short the merge exists to protect).
    expect(survivor.factionAffiliation).toEqual(target.factionAffiliation);
  });

  test('NO-GHOST CENSUS — a displaced name survives nowhere but the keeper it named', () => {
    const target = victim();
    const out = carryLockedRosterThroughGenerate(worldA, worldB, { npcs: [String(target.id)] });
    const live = new Set(out.settlement.npcs.map((/** @type {any} */ n) => String(n.name)));
    // Full names only: a substring match against generated fixtures invents ghosts.
    const departed = worldB.npcs
      .map((/** @type {any} */ n) => String(n.name))
      .filter((/** @type {string} */ name) => !live.has(name));
    expect(departed.length, 'somebody must have been displaced, or this proves nothing').toBeGreaterThan(0);

    const before = JSON.stringify(worldB);
    const after = JSON.stringify(out.settlement);
    const failures = collectSeedFailures(departed, (name) => {
      // The TRANSITION shape: the name was in the town this roll produced, and the
      // carry took it out. A green here cannot come from a town that never had it.
      expectPresentThenAbsent(before, after, /** @type {string} */ (name), ' (no-ghost census)');
    });
    expectNoSeedFailures(failures, 'every displaced character is written out of the whole town');
  });

  test('lockedIdsOnly — an unlocked canon character is NOT smuggled through', () => {
    // A full generate mints a new town: its baseline is that nothing survives.
    // The carry performs the lock map and only the lock map, so tagging a
    // character canon must not carry it. (Doing so is a separate, owner-gated
    // capability, not a side effect of this lane.)
    const target = victim();
    const canonIndex = worldA.npcs.findIndex(
      (/** @type {any} */ n) => String(n.id) !== String(target.id) && !bNames().has(String(n.name)),
    );
    expect(canonIndex).toBeGreaterThan(-1);
    const canonName = String(worldA.npcs[canonIndex].name);
    const previous = {
      ...worldA,
      npcs: worldA.npcs.map((/** @type {any} */ n, /** @type {number} */ i) =>
        (i === canonIndex ? { ...n, canonStatus: 'canon' } : n)),
    };

    const out = carryLockedRosterThroughGenerate(previous, worldB, { npcs: [String(target.id)] });
    const names = out.settlement.npcs.map((/** @type {any} */ n) => String(n.name));
    // The anchor is the LOCKED character, who travels the identical code path: if
    // the carry stopped running or the roster drifted away, the anchor vanishes
    // too and this fails loudly instead of going vacuously green.
    expectAbsentWithAnchor(names, canonName, String(target.name), ' (lockedIdsOnly policy)');
  });

  test('OVERFLOW — more locked ids than slots appends the surplus and reports it', () => {
    // Rare and accepted (documented in the tail header): it needs a new town with
    // fewer people than the user has locked. The keepers must still arrive, and the
    // caller must be TOLD, because they land with no relationships and no faction.
    expect(worldA.npcs.length).toBeGreaterThan(worldB.npcs.length);
    const locks = { npcs: worldA.npcs.map((/** @type {any} */ n) => String(n.id)) };
    const out = carryLockedRosterThroughGenerate(worldA, worldB, locks);
    expect(out.settlement.npcs.length).toBe(worldA.npcs.length);
    expect(out._preservation.overflow.length).toBe(worldA.npcs.length - worldB.npcs.length);
  });
});
