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
  // RE-KEYED BY IDENTITY AND CAUSE (ALLEGIANCE-CAR4, eabc93dfe ITEM 15): soak1k-52 -> soak1k-255. A face whose title the
  // title table writes now draws its secret from its title's own lines (poolMap.js :: titleLinesFor), so far fewer faces
  // draw the category pool's payroll row (a probe over the 1,000: the substituted secret in 3 places at the car's tip,
  // ~45 at the base f6209c0c5) and 52's cast no longer does. 255 is the first: a town with no criminal power whose senior
  // craft-guild master draws the row and takes the substitution. The title lines themselves pass the same writer
  // (mergeNPCLists, after birth) and none names a network. The claim is unchanged.
  it("soak1k-255: the thieves'-guild secret takes the pool's own substitution", () => {
    const { settlement } = birth(255);
    expect(settlement.powerStructure.factions.some((f) => f.category === 'criminal')).toBe(false);
    expect(npcsNaming(settlement, 'secret').map((n) => n.secret.what)).toEqual([]);
    expect(settlement.npcs.some((n) => n.secret?.what === 'On the payroll of a powerful outside interest as a silent informant')).toBe(true);
  });

  // 2026-11-07 PEOPLE-1 CAST: re-keyed by identity 531 -> 20 and 248 -> 5 (the cast draws different goals on the
  // same seeds); found by a probe over the 1,000 at the lane's tip: 20 is a village with no Thieves' Guild on the
  // roster whose cast draws the payroll goal, 5 carries the guild as a power and a card ranked second in it.
  // RE-KEYED BY CAUSE (ALLEGIANCE-CAR4, 03ff59084 THE GOALS REBUILT): the payroll goal was a row of the role pool
  // (NPC_FACTION_GOALS, rewritten by mergeNPCLists' crime-signal writer), and that draw is retired: every card's goal is
  // now drawn at A9 (people/goals.js) from lines whose {power} / {rival} / {guild} slots are filled ONLY from the record,
  // after mergeNPCLists. The same law on the new writer: no goal names a thieves' guild where the place has none
  // (soak1k-20, a village with no criminal power), and the writer is not blind — beside a roster Thieves' Guild
  // (soak1k-5) the goals do name it (the anti-vacuity the retired substitution gave). A probe over the 1,000 at the car's
  // tip: 0 places without a crime signal print such a goal; 214 places with one print at least one.
  it("soak1k-20: the watch's goal names no thieves' guild", () => {
    const { settlement } = birth(20);
    expect(settlement.powerStructure.factions.some((f) => f.category === 'criminal')).toBe(false);
    expect(npcsNaming(settlement, 'goal').map((n) => n.goal.short)).toEqual([]);
    const { settlement: control } = birth(5);
    expect(control.powerStructure.factions.some((f) => f.faction === "Thieves' Guild")).toBe(true);
    expect(npcsNaming(control, 'goal').length, "soak1k-5: the A9 goals name the roster's Thieves' Guild").toBeGreaterThan(0);
  });

  // PEOPLE-LAND re-key, cause M-2 (the shim out): a card's powers are its memberships; the shim's
  // `secondaryAffiliation` is no field of a returned card, so the control reads the membership.
  it("control, soak1k-5: beside a roster Thieves' Guild a card's membership still names it", () => {
    const { settlement } = birth(5);
    expect(settlement.powerStructure.factions.some((f) => f.faction === "Thieves' Guild")).toBe(true);
    expect(settlement.npcs.flatMap((n) => (n.memberships || []).map((m) => m.power))).toContain("Thieves' Guild");
  });
});
