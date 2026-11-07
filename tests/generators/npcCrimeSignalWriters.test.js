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

  it("soak1k-22: the thieves'-guild secret takes the pool's own substitution", () => {
    const { settlement } = birth(22);
    expect(npcsNaming(settlement, 'secret').map((n) => n.secret.what)).toEqual([]);
    expect(settlement.npcs.some((n) => n.secret?.what === 'On the payroll of a powerful outside interest as a silent informant')).toBe(true);
  });

  it("soak1k-531: the Guard Captain's goal names no thieves' guild", () => {
    const { settlement } = birth(531);
    expect(npcsNaming(settlement, 'goal').map((n) => n.goal.short)).toEqual([]);
    expect(settlement.npcs.some((n) => n.goal?.short === 'Identify which of their officers is on the payroll of a powerful outside interest')).toBe(true);
  });

  it("control, soak1k-248: beside a roster Thieves' Guild the affiliation still names it", () => {
    const { settlement } = birth(248);
    expect(settlement.powerStructure.factions.some((f) => f.faction === "Thieves' Guild")).toBe(true);
    expect(npcsNaming(settlement, 'secondaryAffiliation').map((n) => n.secondaryAffiliation)).toContain("Thieves' Guild");
  });
});
