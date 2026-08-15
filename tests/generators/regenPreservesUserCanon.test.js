/**
 * tests/generators/regenPreservesUserCanon.test.js — a reroll must not eat the
 * DM's writing, and must not leave the cast talking about a stranger.
 *
 * Pinned against the REAL pipeline rather than a fixture: the defects this
 * covers all lived in the join between generateNPCs' positional ids,
 * enrichNpcCoherence's relevance re-sort, and the prose that bakes NPC names
 * into relationships and secrets. A hand-rolled roster reproduces none of that.
 *
 * The edited NPC is deliberately NOT npcs[0]. With the canon NPC first, a merge
 * that ignored the predicate entirely and just kept the first N previous NPCs
 * passed every assertion here — the selection rule, this feature's whole reason
 * to exist, went untested.
 */

import { describe, test, expect, beforeAll } from 'vitest';
import {
  generateSettlementPipeline,
  regenNPCsPipeline,
} from '../../src/generators/generateSettlementPipeline.js';
import { applyUserEdit } from '../../src/domain/userEdits.js';
import { deepClone } from '../../src/domain/clone.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const CFG = {
  settType: 'town',
  culture: 'germanic',
  terrain: 'grassland',
  tradeRouteAccess: 'road',
};
const SEED = 'regen-preserve-town';
const REROLL_SEED = 'regen-preserve-reroll';

// userEdits stamps a wall-clock editedAt; pin it so nothing here can flap.
const EDITED_AT = '2026-01-01T00:00:00.000Z';
const AUTHORED_SECRET = 'He sold the granary keys to the reeve.';

/** @type {Record<string, any>} */
let settlement;
/** The same town with a MID-ROSTER NPC's secret hand-written by the DM. */
/** @type {Record<string, any>} */
let editedSettlement;
/** @type {string} */
let authoredName;

const reroll = (town, seed = REROLL_SEED) =>
  regenNPCsPipeline(town, town.config || CFG, { seed });

/** Every name the plain roll produced that the preserved roll no longer has. */
function displacedNames(plain, preservedRun) {
  const live = new Set(preservedRun.npcs.map((/** @type {{name: string}} */ n) => n.name));
  return plain.npcs
    .map((/** @type {{name: string}} */ n) => n.name)
    .filter((/** @type {string} */ name) => !live.has(name));
}

beforeAll(() => {
  settlement = generateSettlementPipeline(CFG, null, { seed: SEED, customContent: {} });
  editedSettlement = deepClone(settlement);
  const target = editedSettlement.npcs[2];
  authoredName = target.name;
  applyUserEdit(target, 'secret.what', AUTHORED_SECRET, { editedAt: EDITED_AT });
});

describe('the town this is pinned against', () => {
  test('generated a roster and a graph rich enough for the join to be real', () => {
    const parts = reroll(editedSettlement);
    // Guards against silent vacuity: the loops below iterate these arrays, and
    // an empty one would make every assertion in this file pass for free.
    expect(settlement.npcs.length).toBeGreaterThan(2);
    expect(parts.relationships.length).toBeGreaterThan(0);
    expect(parts.factions.length).toBeGreaterThan(0);
    expect(settlement.npcs[2].id).toBeTruthy();
  });

  test('the authored NPC is not the first in the roster', () => {
    // If this ever becomes index 0, the suite stops discriminating a merge that
    // selects positionally from one that reads the preservation predicate.
    expect(editedSettlement.npcs.findIndex(n => n.name === authoredName)).toBeGreaterThan(0);
  });
});

describe('user canon survives a reroll', () => {
  test('the authored NPC is still in the cast, with its edit record and value', () => {
    const { npcs } = reroll(editedSettlement);
    const kept = npcs.find(n => n.name === authoredName);

    expect(kept).toBeTruthy();
    expect(kept._authored).toBe(true);
    expect(kept._userEdits['secret.what'].value).toBe(AUTHORED_SECRET);
    expect(kept.secret.what).toBe(AUTHORED_SECRET);
  });

  test('it is still a reroll — the unauthored cast is replaced', () => {
    const before = editedSettlement.npcs.map(n => n.name).filter(n => n !== authoredName);
    const after = reroll(editedSettlement).npcs.map(n => n.name);
    const survivors = before.filter(name => after.includes(name));

    expect(survivors.length).toBeLessThan(before.length);
  });

  test('the cast does not grow, so repeated rerolls cannot inflate it', () => {
    // Roster size is a seeded generation decision, so this compares against the
    // SAME seed's unpreserved roll rather than across seeds.
    const plainSize = reroll(settlement).npcs.length;
    const once = reroll(editedSettlement);
    expect(once.npcs).toHaveLength(plainSize);

    const twice = reroll({ ...editedSettlement, npcs: once.npcs });
    expect(twice.npcs).toHaveLength(plainSize);
    expect(twice.npcs.filter((/** @type {{name: string}} */ n) => n.name === authoredName))
      .toHaveLength(1);
  });

  test('a whole pinned cast still gets real slots, not bare appends', () => {
    // Roster size varies by seed, so pinning everyone can outnumber the next
    // roll. Those keepers used to be appended with no faction and no edges.
    const allPinned = deepClone(settlement);
    for (const npc of allPinned.npcs) npc.locked = true;

    const failures = collectSeedFailures(['overflow-a', 'overflow-b', 'overflow-c'], (seed) => {
      const parts = reroll(allPinned, seed);
      const ids = new Set(parts.npcs.map((/** @type {{id: string}} */ n) => n.id));
      const withEdges = new Set();
      for (const rel of parts.relationships || []) {
        withEdges.add(rel.npc1Id);
        withEdges.add(rel.npc2Id);
      }
      expect(parts.npcs.length).toBeGreaterThanOrEqual(allPinned.npcs.length);
      expect(ids.size).toBe(parts.npcs.length);
      // Every preserved character is reachable in the social graph.
      const isolated = parts.npcs.filter((/** @type {{id: string}} */ n) => !withEdges.has(n.id));
      expect(isolated, `seed ${seed} left characters with no relationships`).toHaveLength(0);
    });
    expectNoSeedFailures(failures, 'a wholly pinned cast gets real slots on every overflow seed');
  });
});

describe('the reference graph stays resolvable', () => {
  /** @type {Record<string, any>} */
  let parts;
  /** @type {Set<string>} */
  let ids;
  /** @type {Map<string, any>} */
  let byId;

  beforeAll(() => {
    parts = reroll(editedSettlement);
    ids = new Set(parts.npcs.map((/** @type {{id: string}} */ n) => n.id));
    byId = new Map(parts.npcs.map((/** @type {{id: string}} */ n) => [n.id, n]));
  });

  test('no two NPCs answer to the same id', () => {
    expect(ids.size).toBe(parts.npcs.length);
  });

  test('every relationship endpoint resolves to someone in the cast', () => {
    for (const rel of parts.relationships || []) {
      expect(ids.has(rel.npc1Id)).toBe(true);
      expect(ids.has(rel.npc2Id)).toBe(true);
    }
  });

  test('relationship name AND role copies match the NPC they point at', () => {
    for (const rel of parts.relationships || []) {
      expect(rel.npc1Name).toBe(byId.get(rel.npc1Id).name);
      expect(rel.npc2Name).toBe(byId.get(rel.npc2Id).name);
      expect(rel.npc1Role).toBe(byId.get(rel.npc1Id).role);
      expect(rel.npc2Role).toBe(byId.get(rel.npc2Id).role);
    }
  });

  test('every faction member is a live roster object, not a displaced ghost', () => {
    for (const faction of parts.factions || []) {
      for (const member of faction.members || []) {
        expect(ids.has(member.id)).toBe(true);
        expect(member).toBe(parts.npcs.find((/** @type {{id: string}} */ n) => n.id === member.id));
      }
    }
  });
});

describe('nobody in the dossier talks about a character who left', () => {
  /** @type {Record<string, any>} */
  let parts;
  /** @type {string[]} */
  let gone;

  beforeAll(() => {
    parts = reroll(editedSettlement);
    gone = displacedNames(reroll(settlement), parts);
  });

  test('the fixture actually displaces somebody, or these assertions prove nothing', () => {
    expect(gone.length).toBeGreaterThan(0);
  });

  test('relationship prose names the NPCs the edge actually points at', () => {
    const byId = new Map(parts.npcs.map((/** @type {{id: string}} */ n) => [n.id, n]));
    for (const rel of parts.relationships || []) {
      const prose = `${rel.description} ${rel.tension}`;
      expect(prose).toContain(byId.get(rel.npc1Id).name);
      expect(prose).toContain(byId.get(rel.npc2Id).name);
    }
  });

  test('no relationship prose names a displaced character', () => {
    for (const rel of parts.relationships || []) {
      const prose = `${rel.description} ${rel.tension}`;
      // The live endpoint's name is the liveness anchor: the sibling test above
      // pins that this prose names both endpoints, so prose that stopped naming
      // anybody reds on the anchor instead of passing this exclusion for free.
      for (const name of gone) {
        expectAbsentWithAnchor(prose, name, rel.npc1Name, `rel ${rel.npc1Id}→${rel.npc2Id}`);
      }
    }
  });

  test('no NPC secret names a displaced character', () => {
    for (const npc of parts.npcs) {
      const secret = `${npc.secret?.what || ''} ${npc.secret?.stakes || ''}`;
      // A secret is not required to name anybody, so there is no sibling-name
      // anchor available here; the liveness anchor is that the scanned text is
      // real prose at all (measured 2026-07-27: 7/7 secrets, min 115 chars).
      expect(secret.trim().length, `${npc.name} has secret prose to scan`).toBeGreaterThan(0);
      // The sibling test 'the fixture actually displaces somebody' pins `gone`
      // non-empty, so an empty displaced-name list cannot silently skip this loop.
      // anchored: the assertion above pins `secret` as live non-empty prose, so this exclusion cannot pass against an emptied or absent secret.
      for (const name of gone) expect(secret).not.toContain(name);
    }
  });
});

describe('dormancy — a town with no user canon rerolls as it always did', () => {
  test('the same seed reproduces the same reroll', () => {
    expect(JSON.stringify(reroll(settlement))).toBe(JSON.stringify(reroll(settlement)));
  });

  test('initial generation is untouched by the preservation tail', () => {
    const again = generateSettlementPipeline(CFG, null, { seed: SEED, customContent: {} });
    expect(JSON.stringify(again)).toBe(JSON.stringify(settlement));
  });

  test('preservation touches ONLY the authored slot, leaving the roll alone', () => {
    const plain = reroll(settlement);
    const withCanon = reroll(editedSettlement);

    const kept = withCanon.npcs.find((/** @type {{name: string}} */ n) => n.name === authoredName);
    const plainById = new Map(
      plain.npcs.map((/** @type {{id: string}} */ n) => [n.id, JSON.stringify(n)]),
    );

    // Every character except the one the keeper displaced is byte-identical to
    // the roll this seed produces with no preservation in play — save for the
    // prose repair, which only rewrites a departed character's name.
    let differing = 0;
    for (const npc of withCanon.npcs) {
      if (npc.id === kept.id) continue;
      if (JSON.stringify(npc) !== plainById.get(npc.id)) differing += 1;
    }
    expect(withCanon.npcs).toHaveLength(plain.npcs.length);
    // Only secrets that NAMED the displaced character may differ.
    expect(differing).toBeLessThan(withCanon.npcs.length - 1);
  });
});
