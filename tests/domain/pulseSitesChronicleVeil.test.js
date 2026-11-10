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
  arms.hidden = { s: hiddenTown, ...pairIn(hiddenTown, (f) => f.hidden === true) };
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
        const { logEntry } = applyEvent({ settlement: arm.s, event, now: '2026-11-10T00:00:00.000Z' });
        const summary = String(logEntry.narrativeSummary || '');
        expect(summary).toContain(arm.a.name); // anchored: the narration ran on this card
        expect(summary).toContain('their power');
        expect(summary).not.toContain(arm.power);
      });
    }
  }
});
