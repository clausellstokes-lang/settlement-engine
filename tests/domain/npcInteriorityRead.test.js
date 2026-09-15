/**
 * npcInteriorityRead.test.js — INTERIORITY-LITE (DESIGN_VISION_WAVE V-24c). The pure derived
 * "disposition & wants" projection: player-safe wants/disposition from existing display state,
 * plus a DM-truth block (bonds/grudges/credibility/covert) gated behind includeGroundTruth. Pins:
 * pure/deterministic · zero-write · SECRETS-SEAM-SAFE (a non-DM audience never sees a covert mark,
 * bond, grudge, or credibility) · renders from a real fixture.
 */
import { describe, it, expect } from 'vitest';
import { npcInteriority, npcCredibilityWord } from '../../src/domain/display/npcInteriorityRead.js';

const NPC = () => ({
  id: 'aldis', name: 'Aldis', role: 'Guildmaster', influence: 'high',
  goal: { short: 'restore the old temple' },
  personality: { dominant: 'stern', ambition: 'reclaim his house', ideal: 'order above all' },
  loyalty: 'the crown', fear: 'the mob',
});
const CORRUPT_NPC = () => ({ ...NPC(), corrupt: true, corruptTies: { criminalInstitution: 'The Coin Rats' }, secret: { what: 'skims the temple alms' } });
// The engine sidecar: bonds/grudges (npcLadder) + credibility — DM truth by construction.
const WORLD = () => ({
  spatialLedgers: {
    npcLadder: { npcs: { n1: {
      bonds: { n2: { sev: 0.7, week: 10, kind: 'loyalty' } },
      grudges: { n3: { sev: 0.5, week: 12, kind: 'contest_loss' } },
    } } },
    npcCredibility: { n1: { score: 8, lastUpdateTick: 100 } },
  },
});

describe('npcInteriority — player-safe disposition & wants', () => {
  it('composes wants (goal + ambition + ideal) and disposition (temperament + standing + loyalty + fear)', () => {
    const view = npcInteriority({ npc: NPC() });
    expect(view.present).toBe(true);
    expect(view.wants).toEqual(['restore the old temple', 'reclaim his house', 'order above all']);
    expect(view.disposition).toEqual(['stern', 'commanding', 'the crown', 'the mob']);
    expect(view.groundTruth, 'no DM-truth block in the player view').toBeUndefined();
  });

  it('returns null for a garbage / empty NPC (inert, no crash)', () => {
    expect(npcInteriority({ npc: null })).toBeNull();
    expect(npcInteriority({ npc: {} })).toBeNull();
    expect(npcInteriority({})).toBeNull();
  });

  it('is deterministic — same inputs, deep-equal output', () => {
    expect(npcInteriority({ npc: NPC() })).toEqual(npcInteriority({ npc: NPC() }));
  });
});

describe('npcInteriority — the secrets seam (covert never surfaces to a non-DM)', () => {
  it('player view (includeGroundTruth=false) HIDES the compromise + secret, even when set', () => {
    const view = npcInteriority({ npc: CORRUPT_NPC(), includeGroundTruth: false });
    expect(view.groundTruth).toBeUndefined();
    // and nothing covert leaks into the player-safe arrays
    const flat = JSON.stringify(view);
    expect(flat).not.toContain('skims the temple alms');
    expect(flat).not.toContain('compromised');
  });

  it('DM view (includeGroundTruth=true) SURFACES the compromise + secret', () => {
    const view = npcInteriority({ npc: CORRUPT_NPC(), includeGroundTruth: true });
    expect(view.groundTruth.compromised).toBe('compromised');
    expect(view.groundTruth.secret).toBe('skims the temple alms');
  });

  it('player view HIDES the relational sidecar (bonds/grudges/credibility), DM view surfaces it', () => {
    const player = npcInteriority({ npc: NPC(), worldState: WORLD(), nid: 'n1', tick: 100, includeGroundTruth: false });
    expect(player.groundTruth, 'no relational truth for a non-DM').toBeUndefined();
    expect(JSON.stringify(player)).not.toContain('n2'); // bonded peer id never leaks

    const dm = npcInteriority({ npc: NPC(), worldState: WORLD(), nid: 'n1', tick: 100, includeGroundTruth: true });
    expect(dm.groundTruth.bonds).toEqual([{ nid: 'n2', kind: 'loyalty', sev: 0.7 }]);
    expect(dm.groundTruth.grudges).toEqual([{ nid: 'n3', kind: 'contest_loss', sev: 0.5 }]);
    expect(dm.groundTruth.credibility).toEqual({ score: 8, band: 'trusted' });
  });

  it('DM view with no sidecar yields no relational block (present covert-only)', () => {
    const dm = npcInteriority({ npc: CORRUPT_NPC(), includeGroundTruth: true });
    expect(dm.groundTruth.bonds).toBeUndefined();
    expect(dm.groundTruth.grudges).toBeUndefined();
    expect(dm.groundTruth.credibility).toBeUndefined();
  });
});

describe('npcInteriority — purity (ZERO persisted writes)', () => {
  it('never mutates its inputs (the read-model contract)', () => {
    const npc = CORRUPT_NPC();
    const world = WORLD();
    const npcBefore = JSON.stringify(npc);
    const worldBefore = JSON.stringify(world);
    npcInteriority({ npc, worldState: world, nid: 'n1', tick: 100, includeGroundTruth: true });
    expect(JSON.stringify(npc)).toBe(npcBefore);
    expect(JSON.stringify(world)).toBe(worldBefore);
  });
});

describe('npcCredibilityWord', () => {
  it('bands a signed score', () => {
    expect(npcCredibilityWord(8)).toBe('trusted');
    expect(npcCredibilityWord(-8)).toBe('doubted');
    expect(npcCredibilityWord(0)).toBe('even');
    expect(npcCredibilityWord(2)).toBe('even');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// LT39 car 5 — THE NPC TRAIL: the ladder's contests and seat transitions.
//
// "Who this NPC betrayed" is the roadmap's other half, and the archive that
// answers it — npcLadder's `contests` and `seatTransitions` — had exactly one
// reader in the whole estate (treatySuccession, for seat transitions) and none at
// all for contests. npcStates carry no history array, which is what the roadmap
// means by "NPCs have a thinner trail", so NOTHING IS MINTED HERE: this renders
// what the engine already wrote down.
//
// ⛔ AND THE FIXTURE IS THE ENGINE'S OWN SHAPE. The suite above uses a FLAT
// `npcLadder: { npcs: … }`, which is not what npcLadderKernel persists: the ledger
// is keyed by SETTLEMENT and each value is `{ factions, npcs, contests?,
// seatTransitions? }`. That mismatch is why the DM bonds/grudges block resolved
// nothing against a real world, and why the arm above was green anyway. Both
// shapes are now admitted, and the arms below use the writer's.
// ═══════════════════════════════════════════════════════════════════════════
const LADDER_WORLD = () => ({
  spatialLedgers: {
    npcLadder: {
      // The ENGINE'S shape: settlement id → record.
      ash: {
        factions: {},
        npcs: { 'ash:aldis': { bonds: { 'ash:mira': { sev: 0.7, week: 10, kind: 'loyalty' } }, grudges: {} } },
        contests: {
          'contest.ash.trade.4': {
            id: 'contest.ash.trade.4', signalVar: 'trade', kind: 'opposed',
            a: { nid: 'ash:aldis' }, b: { nid: 'ash:mira' },
            openedWeek: 4, resolvedWeek: 9, outcome: 'fired', loserNid: 'ash:aldis',
          },
          'contest.ash.walls.12': {
            id: 'contest.ash.walls.12', signalVar: 'walls', kind: 'convergent',
            a: { nid: 'ash:mira' }, b: { nid: 'ash:aldis' },
            openedWeek: 12, resolvedWeek: null, outcome: null, loserNid: null,
          },
        },
        seatTransitions: [
          { id: 'seat.1', fromRulerId: 'ash:mira', toRulerId: 'ash:aldis', cause: 'faction_challenge', tick: 20 },
          { id: 'seat.2', fromRulerId: 'ash:aldis', toRulerId: null, cause: 'death_in_office', tick: 31 },
        ],
      },
    },
  },
});

const LADDER_NAMES = { 'ash:aldis': 'Aldis', 'ash:mira': 'Mira' };
const resolveNpcName = (n) => LADDER_NAMES[n] || null;
const trailOf = (args = {}) => npcInteriority({
  npc: NPC(), worldState: LADDER_WORLD(), nid: 'ash:aldis', tick: 40,
  includeGroundTruth: true, resolveNpcName, ...args,
})?.groundTruth?.trail;

describe('npcInteriority — the NPC trail (LT39 car 5)', () => {
  it('renders the ladder\'s dated contests and seat transitions, oldest first', () => {
    expect(trailOf().map((r) => [r.week, r.kind, r.text])).toEqual([
      [4, 'contest', 'Contested Mira, and lost.'],
      [12, 'contest', 'Pushed the same end as Mira, and it is not settled yet.'],
      [20, 'seat', 'Took the governing seat from Mira (faction challenge).'],
      [31, 'seat', 'Left the governing seat and the seat stood empty (death in office).'],
    ]);
  });

  it('⛔ the trail appears ONLY under includeGroundTruth', () => {
    const player = npcInteriority({
      npc: NPC(), worldState: LADDER_WORLD(), nid: 'ash:aldis', tick: 40, resolveNpcName,
    });
    expect(player.groundTruth).toBeUndefined();
    expect(trailOf()).toHaveLength(4);
    // anchored: the DM call one line above is proved to produce four rows on this same fixture, so the player view's missing sentence is a WITHHOLDING and not an empty fixture.
    expect(JSON.stringify(player)).not.toContain('governing seat');
  });

  it('an NPC with an empty ladder record yields NO trail section rather than an empty heading', () => {
    const empty = npcInteriority({
      npc: NPC(),
      worldState: { spatialLedgers: { npcLadder: { ash: { factions: {}, npcs: {}, contests: {}, seatTransitions: [] } } } },
      nid: 'ash:aldis', tick: 40, includeGroundTruth: true, resolveNpcName,
    });
    expect(empty?.groundTruth).toBeUndefined();
  });

  it('a contest or seat row that does not involve this NPC is not its trail', () => {
    const mira = trailOf({ nid: 'ash:mira' });
    expect(mira.map((r) => r.text)).toEqual([
      'Contested Aldis, and did not lose.',
      'Pushed the same end as Aldis, and it is not settled yet.',
      'Left the governing seat to Aldis (faction challenge).',
    ]);
  });

  it('⛔ NO LADDER KEY REACHES A READER when the name cannot be resolved', () => {
    const anonymous = trailOf({ resolveNpcName: () => null });
    expect(anonymous).toHaveLength(4);
    // anchored: the length assertion one line above proves all four rows were built, so each row's absent key is measured against live prose.
    for (const row of anonymous) expect(row.text, row.id).not.toContain('ash:');
    expect(anonymous[0].text).toBe('Contested a rival, and lost.');
    expect(anonymous[2].text).toBe('Took the governing seat from whoever held it before (faction challenge).');
    // …and the raw key stays on the ROW for a surface that can resolve it.
    expect(anonymous[0].otherNid).toBe('ash:mira');
  });

  it('⛔ THE LEDGER IS KEYED BY SETTLEMENT — the bonds block resolves against the ENGINE\'S shape', () => {
    // The repair's own pin. `ladder.npcs[nid]` (the pre-repair read) finds nothing
    // in this ledger, because npcLadderKernel persists `ladder[settlementId].npcs`.
    const view = trailOf === null ? null : npcInteriority({
      npc: NPC(), worldState: LADDER_WORLD(), nid: 'ash:aldis', tick: 40,
      includeGroundTruth: true, resolveNpcName,
    });
    expect(view.groundTruth.bonds).toEqual([{ nid: 'ash:mira', kind: 'loyalty', sev: 0.7 }]);
  });

  it('the FLAT legacy shape still resolves, so no hand-made ledger broke', () => {
    const flat = npcInteriority({ npc: NPC(), worldState: WORLD(), nid: 'n1', tick: 100, includeGroundTruth: true });
    expect(flat.groundTruth.bonds).toEqual([{ nid: 'n2', kind: 'loyalty', sev: 0.7 }]);
    expect(flat.groundTruth.trail).toBeUndefined();
  });

  it('is deterministic and inert on garbage ledgers', () => {
    expect(trailOf()).toEqual(trailOf());
    for (const bad of [null, 7, 'x', [], { ash: 'nope' }, { ash: { contests: 3, seatTransitions: 'no' } }]) {
      const view = npcInteriority({
        npc: NPC(), worldState: { spatialLedgers: { npcLadder: bad } }, nid: 'ash:aldis',
        tick: 1, includeGroundTruth: true, resolveNpcName,
      });
      expect(view?.groundTruth?.trail, JSON.stringify(bad)).toBeUndefined();
    }
  });
});
