/**
 * NO NPC NAMES A NETWORK WHERE NONE EXISTS (lane RUNG1B-F4 unit 3, 2026-11-04;
 * docs/F4_CRIME_SIGNAL_2026-11-04.md §1).
 *
 * `npcGenerator.js :: mergeNPCLists` runs in the coherence tail, after the density law's trim, on
 * the FINAL roster and estate. It filed an NPC with a criminal secret under a "criminal network"
 * or a "Thieves' Guild" where the place had neither (471 and 17 NPCs in 1,000 soak places), its
 * secret sanitiser's `/thieves guild/` missed the pool's apostrophe (17 places kept "On the payroll
 * of the thieves' guild"), and the Guard Captain's goal "Identify which of their officers is on the
 * thieves' guild payroll" printed on the Tonight tab of a place with no guild (soak1k-531, -579:
 * two of A-06's 16). The three writers now read the crime signal's one home
 * (`domain/crimeSignal.js :: crimeSignalOf`); where none exists the affiliation is not written and
 * the secret and goal take the pool's own "a powerful outside interest". Where a criminal faction
 * exists, the writers are unchanged.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

const NETWORK = /criminal network|thieves['’] guild/i;
const npcsNaming = (s, field) => (s.npcs || []).filter((n) => NETWORK.test(JSON.stringify(n[field] ?? '')));

describe('the NPC writers read the crime signal', () => {
  beforeAll(async () => { await ensureLaws(); });

  it('soak1k-62: no NPC is filed under a criminal network the place does not have', () => {
    const { settlement } = birth(62);
    expect(settlement.powerStructure.factions.some((f) => f.category === 'criminal')).toBe(false);
    expect(npcsNaming(settlement, 'secondaryAffiliation').map((n) => n.secondaryAffiliation)).toEqual([]);
  });

  // 2026-11-07 PEOPLE-1 CAST: re-keyed by identity 22 -> 52 (a city whose cast draws the secret; the probe over the
  // 1,000 at the lane's tip).
  it("soak1k-52: the thieves'-guild secret takes the pool's own substitution", () => {
    const { settlement } = birth(52);
    expect(npcsNaming(settlement, 'secret').map((n) => n.secret.what)).toEqual([]);
    expect(settlement.npcs.some((n) => n.secret?.what === 'On the payroll of a powerful outside interest as a silent informant')).toBe(true);
  });

  // 2026-11-07 PEOPLE-1 CAST: re-keyed by identity 531 -> 20 and 248 -> 5 (the cast draws different goals on the
  // same seeds); found by a probe over the 1,000 at the lane's tip: 20 is a village with no Thieves' Guild on the
  // roster whose cast draws the payroll goal, 5 carries the guild as a power and a card ranked second in it.
  it("soak1k-20: the watch's goal names no thieves' guild", () => {
    const { settlement } = birth(20);
    expect(npcsNaming(settlement, 'goal').map((n) => n.goal.short)).toEqual([]);
    expect(settlement.npcs.some((n) => n.goal?.short === 'Identify which of their officers is on the payroll of a powerful outside interest')).toBe(true);
  });

  // PEOPLE-LAND re-key, cause M-2 (the shim out): a card's powers are its memberships; the shim's
  // `secondaryAffiliation` is no field of a returned card, so the control reads the membership.
  it("control, soak1k-5: beside a roster Thieves' Guild a card's membership still names it", () => {
    const { settlement } = birth(5);
    expect(settlement.powerStructure.factions.some((f) => f.faction === "Thieves' Guild")).toBe(true);
    expect(settlement.npcs.flatMap((n) => (n.memberships || []).map((m) => m.power))).toContain("Thieves' Guild");
  });
});
