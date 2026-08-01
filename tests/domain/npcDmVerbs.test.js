/**
 * tests/domain/npcDmVerbs.test.js — the three DM verbs (W-H4, design
 * DESIGN_NPC_CONSEQUENCES.md §7).
 *
 * What is pinned, and why each one is here rather than assumed:
 *   1. DORMANCY (law 5) — dark, every verb returns the CALLER'S OWN worldState
 *      reference and writes no key at all.
 *   2. SOVEREIGNTY WITH A RECEIPT (§7) — ASSIGN refuses a shut door, the SAME
 *      fixture at the SAME tick succeeds when the DM overrides, and the receipt
 *      NAMES the edge it set aside. The refusal and the override are asserted
 *      together so the refusal is proved SPECIFIC rather than universal.
 *   3. THE ONLY DEATH (law 1) — KILL removes the soul and its edges, is undoable
 *      to the byte, and NO ENGINE LANE can reach the removal door (an anchored
 *      negative over the source, with the DM module as the liveness anchor).
 *   4. MERCY (§7) — PARDON lifts the edicts, releases a jail hold, emits, and its
 *      inverse re-shuts the door with its ORIGINAL window rather than a fresh
 *      indefinite one.
 *   5. THE RULING REGISTER — appended, id-idempotent, capped, and DROPPED whole
 *      when the last ruling is withdrawn, so a fully-undone session serializes
 *      byte-identically to one that never ruled on anybody.
 *   6. AUDIENCE PROJECTION (law 7) — the verbs' news carries its receipt under the
 *      one `dmTruth` key, and a player projection of the pool carries none.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import {
  graduateNpc,
  npcLedgerOf,
  addExclusionEdge,
  hasNpcLedger,
} from '../../src/domain/worldPulse/npcLedger.js';
import {
  assignRoamer,
  killNamedNpc,
  pardonNpc,
  undoDmVerb,
  DM_VERBS,
  ASSIGN_NEWS_TYPE,
  DEATH_NEWS_TYPE,
  PARDON_NEWS_TYPE,
} from '../../src/domain/worldPulse/npcDmVerbs.js';
import {
  npcRulingsOf,
  NPC_RULINGS_CAP,
  recordNpcRuling,
} from '../../src/domain/worldPulse/npcRulingRegister.js';
import {
  projectNpcPool,
  findDmTruthPaths,
} from '../../src/domain/worldPulse/npcLedgerProjection.js';
import { NPC_CONSEQUENCE_KEY } from '../../src/domain/worldPulse/npcVerdictApply.js';
import { isExplicitlyRouted } from '../../src/domain/realm/heraldRouting.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** A live world with one graduated roamer out of Kelder, banished from it. */
function fixture({ lit = true, compromise = 'rival_power' } = {}) {
  const base = { simulationRules: lit ? { npcConsequencesEnabled: true } : {}, tick: 20 };
  const g = graduateNpc({
    worldState: base,
    settlementSeed: 'seed-kelder',
    settlementId: 'sav_kelder',
    rosterIdentity: { rosterId: 'npc_3', name: 'Maera Voss', role: 'harbourmaster' },
    tick: 4,
    verdictCause: 'banished',
    reputation: { notorietyBand: 'notorious', edictMark: 'banishment_edict', scandalClass: 'venality' },
    dmTruth: { compromiseSource: compromise },
  });
  return { worldState: g.worldState, wnpcId: g.wnpcId };
}

/** The same world with the Kelder door shut by edict. */
function banished(opts) {
  const f = fixture(opts);
  const shut = addExclusionEdge(f.worldState, f.wnpcId, {
    settlementId: 'sav_kelder', kind: 'banishment_edict', untilTick: 60,
  });
  return { worldState: shut.worldState, wnpcId: f.wnpcId };
}

/** A settlement carrying the H2 jail mark on the roster record. */
function jailedSettlement() {
  return {
    id: 'sav_kelder',
    name: 'Kelder',
    npcs: [
      { id: 'npc_1', name: 'Someone Else' },
      { id: 'npc_3', name: 'Maera Voss', [NPC_CONSEQUENCE_KEY]: { verdictCause: 'jailed', tick: 4, jailUntilTick: 40 } },
    ],
  };
}

describe('W-H4 — DORMANCY (law 5)', () => {
  test('every verb is a whole-entry-point no-op returning the caller\'s own worldState', () => {
    const dark = { simulationRules: {}, tick: 3 };
    for (const call of [
      () => assignRoamer({ worldState: dark, wnpcId: 'wnpc_x', settlementId: 'sav_a', tick: 3 }),
      () => killNamedNpc({ worldState: dark, wnpcId: 'wnpc_x', tick: 3 }),
      () => pardonNpc({ worldState: dark, wnpcId: 'wnpc_x', tick: 3 }),
    ]) {
      const r = call();
      expect(r.changed).toBe(false);
      expect(r.refusal).toBe('dormant');
      expect(r.worldState).toBe(dark);
    }
    expect(hasNpcLedger(dark)).toBe(false);
    expect(JSON.stringify(dark)).toBe(JSON.stringify({ simulationRules: {}, tick: 3 }));
  });
});

describe('W-H4 — ASSIGN is sovereign, and its override is named', () => {
  test('a shut door refuses WITHOUT an override, and the SAME call succeeds WITH one', () => {
    const { worldState, wnpcId } = banished();
    const refusedRun = assignRoamer({
      worldState, wnpcId, settlementId: 'sav_kelder', settlementName: 'Kelder', tick: 20,
    });
    expect(refusedRun.refusal).toBe('excluded_without_override');
    expect(refusedRun.changed).toBe(false);
    expect(refusedRun.worldState).toBe(worldState);

    const forced = assignRoamer({
      worldState, wnpcId, settlementId: 'sav_kelder', settlementName: 'Kelder', tick: 20,
      overrideExclusions: true,
    });
    expect(forced.changed).toBe(true);
    // THE OVERRIDE, NAMED — the whole point of §7's clause.
    expect(forced.receipt.overrodeExclusions).toEqual(['banishment_edict at sav_kelder']);
    expect(npcLedgerOf(forced.worldState).placed[wnpcId].hostSettlementId).toBe('sav_kelder');
    // The edict SURVIVES the override: an assignment is not a pardon.
    expect(npcLedgerOf(forced.worldState).exclusions[wnpcId]).toHaveLength(1);
  });

  test('an UNSHUT door needs no override, which is what makes the refusal specific', () => {
    const { worldState, wnpcId } = banished();
    const elsewhere = assignRoamer({
      worldState, wnpcId, settlementId: 'sav_thorn', settlementName: 'Thornreach', tick: 20,
    });
    expect(elsewhere.changed).toBe(true);
    expect(elsewhere.receipt.overrodeExclusions).toEqual([]);
    expect(elsewhere.news.headline).toBe('Maera Voss takes up residence in Thornreach.');
  });

  test('a REHOST COOLDOWN is bookkeeping, not a door, and never gates the DM', () => {
    const { worldState, wnpcId } = fixture();
    const cooled = addExclusionEdge(worldState, wnpcId, {
      settlementId: 'sav_kelder', kind: 'rehost_cooldown', untilTick: 60,
    }).worldState;
    const r = assignRoamer({ worldState: cooled, wnpcId, settlementId: 'sav_kelder', tick: 20 });
    expect(r.changed).toBe(true);
    expect(r.refusal).toBeNull();
  });

  test('the inverse puts them back exactly where they were, roaming', () => {
    const { worldState, wnpcId } = fixture();
    const before = JSON.stringify(npcLedgerOf(worldState));
    const placed = assignRoamer({ worldState, wnpcId, settlementId: 'sav_thorn', tick: 20 });
    const back = undoDmVerb({ worldState: placed.worldState, undo: placed.undo });
    expect(back.changed).toBe(true);
    expect(JSON.stringify(npcLedgerOf(back.worldState))).toBe(before);
  });
});

describe('W-H4 — KILL is the only death, and it is undoable', () => {
  test('the soul and its edges leave the ledger, and the inverse restores both to the byte', () => {
    const { worldState, wnpcId } = banished();
    const beforeLedger = JSON.stringify(npcLedgerOf(worldState));
    const killed = killNamedNpc({ worldState, wnpcId, tick: 21, settlementName: 'Kelder' });
    expect(killed.changed).toBe(true);
    expect(killed.news.candidateType).toBe(DEATH_NEWS_TYPE);
    expect(killed.news.headline).toBe('Maera Voss is dead.');
    const drained = npcLedgerOf(killed.worldState);
    expect(Object.keys(drained.roamers)).toEqual([]);
    expect(Object.keys(drained.placed)).toEqual([]);
    expect(Object.keys(drained.exclusions)).toEqual([]);

    const revived = undoDmVerb({ worldState: killed.worldState, undo: killed.undo });
    expect(revived.changed).toBe(true);
    expect(JSON.stringify(npcLedgerOf(revived.worldState))).toBe(beforeLedger);
  });

  test('the restore FAILS CLOSED when the id has been taken back in the meantime', () => {
    const { worldState, wnpcId } = fixture();
    const killed = killNamedNpc({ worldState, wnpcId, tick: 21 });
    // The original world still holds them; replaying the inverse against it must not
    // clobber the living record.
    const clash = undoDmVerb({ worldState, undo: killed.undo });
    expect(clash.changed).toBe(false);
    expect(JSON.stringify(npcLedgerOf(clash.worldState))).toBe(JSON.stringify(npcLedgerOf(worldState)));
  });

  test('the roster record is marked when the caller supplies the settlement', () => {
    const { worldState, wnpcId } = fixture();
    const settlement = jailedSettlement();
    const killed = killNamedNpc({ worldState, wnpcId, tick: 21, settlement });
    const marked = killed.settlement.npcs.find((n) => n.id === 'npc_3');
    expect(marked[NPC_CONSEQUENCE_KEY].deceasedByDm).toBe(true);
    expect(marked[NPC_CONSEQUENCE_KEY].deceasedAtTick).toBe(21);
    // Untouched neighbours keep their identity (no wholesale roster rebuild).
    expect(killed.settlement.npcs[0]).toBe(settlement.npcs[0]);
  });

  test('ANCHORED NEGATIVE: no engine lane can reach the removal door; only the DM verbs do', () => {
    // The collection: every module in the ENGINE LANE HOME (src/domain/worldPulse) and
    // in the store that NAMES the removal symbol. The scan is deliberately scoped to
    // those two trees rather than all of src: src/domain/certification is authored PROSE
    // about this very invariant, and a scan that counted a sentence describing the rule
    // as a violation of it would be measuring its own documentation.
    const files = [];
    for (const root of ['src/domain/worldPulse', 'src/store']) {
      (function walk(dir) {
        for (const entry of readdirSync(dir)) {
          const p = join(dir, entry);
          if (statSync(p).isDirectory()) walk(p);
          else if (/\.js$/.test(entry)) files.push(p);
        }
      })(join(ROOT, root));
    }
    const mentions = files
      .filter((p) => /\bremoveNpcRecord\b/.test(readFileSync(p, 'utf8')))
      .map((p) => relative(join(ROOT, 'src'), p).replace(/\\/g, '/'))
      .sort();

    // EXACT SET: the definition site and the one sanctioned caller. Anything else is a
    // second death path, which law 1 forbids outright.
    expect(mentions).toEqual(['domain/worldPulse/npcDmVerbs.js', 'domain/worldPulse/npcLedger.js']);

    // And per-lane, anchored by the DM module so the absence cannot go vacuous if the
    // scan ever stops finding anything at all.
    for (const lane of [
      'domain/worldPulse/npcVerdictApply.js',
      'domain/worldPulse/npcVerdictTable.js',
      'domain/worldPulse/npcCirculation.js',
      'domain/worldPulse/npcCirculationTransit.js',
      'domain/worldPulse/npcReplacement.js',
      'domain/worldPulse/npcResidency.js',
      'domain/worldPulse/pulseKernel.js',
    ]) {
      expectAbsentWithAnchor(mentions, lane, 'domain/worldPulse/npcDmVerbs.js', `engine lane ${lane}`);
    }
  });
});

describe('W-H4 — PARDON lifts, releases, and emits', () => {
  test('every edict falls, the news says so, and the inverse re-shuts the ORIGINAL window', () => {
    const { worldState, wnpcId } = banished();
    const pardoned = pardonNpc({ worldState, wnpcId, tick: 22, settlementName: 'Kelder' });
    expect(pardoned.changed).toBe(true);
    expect(pardoned.news.candidateType).toBe(PARDON_NEWS_TYPE);
    expect(pardoned.receipt.doorsOpened).toEqual(['sav_kelder']);
    expect(npcLedgerOf(pardoned.worldState).exclusions[wnpcId]).toBeUndefined();

    const reShut = undoDmVerb({ worldState: pardoned.worldState, undo: pardoned.undo });
    // The window, not a fresh indefinite sentence: a re-shut door serves the same term.
    expect(npcLedgerOf(reShut.worldState).exclusions[wnpcId])
      .toEqual([{ settlementId: 'sav_kelder', kind: 'banishment_edict', untilTick: 60 }]);
  });

  test('nothing to lift is a typed refusal, not a silent success', () => {
    const { worldState, wnpcId } = fixture();
    const r = pardonNpc({ worldState, wnpcId, tick: 22 });
    expect(r.refusal).toBe('nothing_to_lift');
    expect(r.changed).toBe(false);
    expect(r.worldState).toBe(worldState);
  });

  test('a cooldown is NOT swept away by a mercy the DM did not ask for', () => {
    const { worldState, wnpcId } = banished();
    const withCooldown = addExclusionEdge(worldState, wnpcId, {
      settlementId: 'sav_thorn', kind: 'rehost_cooldown', untilTick: 30,
    }).worldState;
    const pardoned = pardonNpc({ worldState: withCooldown, wnpcId, tick: 22 });
    expect(npcLedgerOf(pardoned.worldState).exclusions[wnpcId])
      .toEqual([{ settlementId: 'sav_thorn', kind: 'rehost_cooldown', untilTick: 30 }]);
  });

  test('the release half clears the jail hold and leaves the rest of the mark standing', () => {
    const { worldState, wnpcId } = fixture();
    const settlement = jailedSettlement();
    const released = pardonNpc({ worldState, wnpcId, tick: 22, settlement });
    expect(released.changed).toBe(true);
    expect(released.receipt.releasedFromHold).toBe(true);
    const mark = released.settlement.npcs.find((n) => n.id === 'npc_3')[NPC_CONSEQUENCE_KEY];
    expect(mark.jailUntilTick).toBeUndefined();
    // The disgrace happened; only the sentence is over.
    expect(mark.verdictCause).toBe('jailed');
    expect(released.news.headline).toContain('walks free');
  });
});

describe('W-H4 — the ruling register', () => {
  test('a ruling is recorded, is id-idempotent, and the key DROPS when the last is withdrawn', () => {
    const { worldState, wnpcId } = fixture();
    const beforeBytes = JSON.stringify(worldState);
    const placed = assignRoamer({ worldState, wnpcId, settlementId: 'sav_thorn', tick: 20 });
    expect(npcRulingsOf(placed.worldState)).toHaveLength(1);
    expect(npcRulingsOf(placed.worldState)[0].candidateType).toBe(ASSIGN_NEWS_TYPE);
    // Re-recording the same item is a no-op returning the caller's own reference.
    expect(recordNpcRuling(placed.worldState, placed.news)).toBe(placed.worldState);

    const back = undoDmVerb({ worldState: placed.worldState, undo: placed.undo });
    expect(npcRulingsOf(back.worldState)).toHaveLength(0);
    // DROP-WHEN-EMPTY, all the way back to the original bytes.
    expect(JSON.stringify(back.worldState)).toBe(beforeBytes);
  });

  test('the register is capped, oldest evicted first', () => {
    let ws = { simulationRules: { npcConsequencesEnabled: true }, tick: 1 };
    for (let i = 0; i < NPC_RULINGS_CAP + 5; i += 1) {
      ws = recordNpcRuling(ws, { id: `r${i}`, headline: `ruling ${i}` });
    }
    const kept = npcRulingsOf(ws);
    expect(kept).toHaveLength(NPC_RULINGS_CAP);
    expect(kept[0].id).toBe('r5');
    expect(kept[kept.length - 1].id).toBe(`r${NPC_RULINGS_CAP + 4}`);
  });

  test('a ledger written by a verb survives a JSON round trip unchanged', () => {
    const { worldState, wnpcId } = banished();
    const forced = assignRoamer({
      worldState, wnpcId, settlementId: 'sav_kelder', tick: 20, overrideExclusions: true,
    });
    const reloaded = JSON.parse(JSON.stringify(forced.worldState));
    expect(JSON.stringify(npcLedgerOf(reloaded))).toBe(JSON.stringify(npcLedgerOf(forced.worldState)));
    expect(JSON.stringify(npcRulingsOf(reloaded))).toBe(JSON.stringify(npcRulingsOf(forced.worldState)));
  });
});

describe('W-H4 — the address chain, and law 7', () => {
  test('every minted candidate type is EXPLICITLY routed (never the silent catch-all)', () => {
    for (const type of [ASSIGN_NEWS_TYPE, DEATH_NEWS_TYPE, PARDON_NEWS_TYPE]) {
      expect(isExplicitlyRouted(type), `${type} must be filed in heraldRouting.js`).toBe(true);
    }
    expect(DM_VERBS).toEqual(['assign', 'kill', 'pardon']);
  });

  test('a news item addresses its settlements, and its receipt rides the ONE covert key', () => {
    const { worldState, wnpcId } = banished();
    const forced = assignRoamer({
      worldState, wnpcId, settlementId: 'sav_kelder', settlementName: 'Kelder', tick: 20,
      overrideExclusions: true,
    });
    expect(forced.news.targetSaveId).toBe('sav_kelder');
    expect(forced.news.settlementIds).toContain('sav_kelder');
    // The covert half is under dmTruth and NOWHERE else in the item.
    expect(findDmTruthPaths(forced.news)).toEqual(['$.dmTruth']);
    expect(forced.news.dmTruth.receipt.overrodeExclusions).toEqual(['banishment_edict at sav_kelder']);
  });

  test('a PLAYER projection of the pool a verb wrote carries ZERO dmTruth keys', () => {
    const { worldState, wnpcId } = fixture();
    const placed = assignRoamer({ worldState, wnpcId, settlementId: 'sav_thorn', tick: 20 });
    const dm = projectNpcPool({ worldState: placed.worldState, tick: 20, includeCovert: true });
    const player = projectNpcPool({ worldState: placed.worldState, tick: 20 });
    // LIVENESS ANCHOR: the DM view of the SAME world must report the covert path through
    // the SAME helper, or the empty player result proves nothing about the helper.
    expect(findDmTruthPaths(dm).length).toBeGreaterThan(0);
    expect(findDmTruthPaths(player)).toEqual([]);
  });
});
