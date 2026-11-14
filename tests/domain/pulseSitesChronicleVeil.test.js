/**
 * PULSE-SITES P1, as changed by the owner's word (2026-11-10, verbatim: "Forgo or isolated the simulation. My main focus
 * is the generator and dossier. Because the simulation is not fully built yet and requires PLAT."): THE NARRATION CURE
 * IS FORGONE. PROMOTE_NPC / DEMOTE_NPC narration names NO power for any card and reads no retired field — the base's
 * own words, "their power", for everyone.
 *
 * Why: the narration is the log entry's `narrativeSummary` (events/applyEvent.js), which migration 032's
 * `_gallery_chronicle_entry` publishes verbatim to anon; the reviewer showed the re-point (a09f2593e) naming hidden and
 * criminal powers there. Naming a power in these lines is deferred to the simulation's own program.
 *
 * The pin: a PROMOTE and a DEMOTE committed through the REAL `applyEvent` for a member of a HIDDEN power (soak1k-113,
 * the infiltrator `hidden: true`), of a CRIMINAL power (soak1k-3, Thieves' Guild) and of an OPEN power (soak1k-3):
 * in all three the `narrativeSummary` names the person and not the power.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { firstRankMembershipOf, powerOrderOf } from '../../src/domain/people/membership.js';
import { isVeiledPower } from '../../src/domain/people/cardVeil.js';
import { applyEvent } from '../../src/domain/events/applyEvent.js';

/** A first-rank member of a power picked by a predicate on its row, and a swap peer (a second member of the same
 *  power where there is one, else any other named card: the narration reads only the target). */
function pairIn(settlement, pick) {
  const order = powerOrderOf(settlement);
  const power = settlement.powerStructure.factions.find((f) => pick(f)
    && settlement.npcs.some((n) => n.id && firstRankMembershipOf(n, order)?.power === f.faction));
  if (!power) return {};
  const members = settlement.npcs.filter((n) => n.id && firstRankMembershipOf(n, order)?.power === power.faction);
  const peer = members[1] || settlement.npcs.find((n) => n.id && n !== members[0]);
  return { power: power.faction, a: members[0], b: peer };
}

/** @type {Record<string, any>} */
const arms = {};

beforeAll(async () => {
  await ensureLaws();
  const hiddenTown = birth(113).settlement;
  const town = birth(3).settlement;
  // THE HIDDEN ARM'S PAIR IS BUILT, NOT OBSERVED (RESIDUE, the chair's ruling of 2026-11-10 on item 8). soak1k 0-199 carry
  // three hidden powers, each with exactly ONE first-rank member, so `pairIn` can only pair the hidden member with a card
  // of another power — a swap the handler refuses since GREEN-TIP ae8dc98b1 (`swap_cross_faction`, below). To keep a
  // COMMITTED hidden swap under this pin, the peer of soak1k-113's pair is given a rank-2 membership in the hidden power
  // (its only one) on a clone of the town: a same-power pair the composer would offer. Built, not observed.
  const observed = pairIn(hiddenTown, (f) => f.hidden === true);
  arms.crossHidden = { s: hiddenTown, ...observed };
  const built = structuredClone(hiddenTown);
  const peer = built.npcs.find((n) => n.id === observed.b.id);
  peer.memberships = [{ power: observed.power, rank: 2 }];
  arms.hidden = { s: built, power: observed.power, a: built.npcs.find((n) => n.id === observed.a.id), b: peer };
  arms.criminal = { s: town, ...pairIn(town, (f) => String(f.category || '').toLowerCase() === 'criminal') };
  arms.open = { s: town, ...pairIn(town, (f) => !isVeiledPower(f)) };
}, 180_000);

describe('PROMOTE/DEMOTE narration names no power (P1 as changed by the owner: the narration cure is forgone)', () => {
  it('the three arms stand on real records: a hidden, a criminal and an open power, each with a first-rank member', () => {
    for (const which of ['hidden', 'criminal', 'open']) {
      expect(arms[which].power, which).toBeTruthy();
      expect(arms[which].a?.name, which).toBeTruthy();
    }
  });

  for (const which of ['hidden', 'criminal', 'open']) {
    for (const type of ['PROMOTE_NPC', 'DEMOTE_NPC']) {
      it(`(${which}) ${type}: the committed narrativeSummary names the person and not the power`, () => {
        const arm = arms[which];
        const event = { id: `ev-${type}-${arm.a.id}`, type, targetId: arm.a.id, payload: { swapWithNpcId: arm.b.id }, cause: 'dm_direct' };
        const { logEntry, veto } = applyEvent({ settlement: arm.s, event, now: '2026-11-10T00:00:00.000Z' });
        expect(veto).toBeNull();
        const summary = String(logEntry.narrativeSummary || '');
        expect(summary).toContain('their power');
        // anchored: the person's name travels the same narration as the power's would
        expectAbsentWithAnchor(summary, arm.power, arm.a.name, `${which} ${type} narrativeSummary`);
      });
    }
  }
});

// A CROSS-POWER SWAP ON A HIDDEN POWER IS REFUSED AND COMMITS NOTHING (RESIDUE, the chair's ruling of 2026-11-10 on item 8).
// The cause: GREEN-TIP ae8dc98b1 re-pointed mutateEntities.js :: swapNpcStanding's cross-faction guard to each card's
// first-rank membership; it read the retired `factionAffiliation`, which no current card carries, so it never fired and
// the cross-power pair committed (with the hidden power's key in its undo snapshot). The veto channel commits no deltas
// and no narration (eventPipeline.js), and callers persist nothing on a veto. The pair is soak1k-113's observed one.
describe('a cross-power swap on a hidden power is refused and commits nothing (the guard live since ae8dc98b1)', () => {
  for (const type of ['PROMOTE_NPC', 'DEMOTE_NPC']) {
    it(`(hidden, cross-power) ${type}: vetoed swap_cross_faction, no deltas, no narration, the power named nowhere`, () => {
      const arm = arms.crossHidden;
      const event = { id: `ev-${type}-${arm.a.id}`, type, targetId: arm.a.id, payload: { swapWithNpcId: arm.b.id }, cause: 'dm_direct' };
      const { logEntry, veto } = applyEvent({ settlement: arm.s, event, now: '2026-11-10T00:00:00.000Z' });
      expect(veto?.code).toBe('swap_cross_faction');
      expect(logEntry.narrativeSummary).toBe('');
      expect(logEntry.deltas).toEqual([]);
      // anchored: the target's id travels the committed entry as the power's name would
      expectAbsentWithAnchor(JSON.stringify(logEntry), arm.power, arm.a.id, `cross-power ${type} logEntry`);
    });
  }
});
