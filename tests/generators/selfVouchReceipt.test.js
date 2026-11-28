/**
 * THE PAGE MAY NOT VOUCH FOR A RECORD THE BATTERY CONTRADICTS (lane SELF-VOUCH, 2026-11-04;
 * docs/SOAK_1000_2026-11-03.md §2 row 9 and §4b R5).
 *
 * The dry run found DS-GEN-11's zero pool ("Nothing in {settlement}'s record contradicts
 * anything else in it…") printed over 250 of 1,000 contradicted records: the line keyed on
 * viability's critical-issue count alone, and the receipt never read the battery's joins.
 * The receipt now carries `record_coherence_battery` (the battery over the stored record,
 * never a render), and the zero pool is chosen only when that judgment passed.
 *
 * soak1k-40 (a city: surplus exports on a place that grows less than it eats, a hospital
 * hook with no hospital, "town" for a city) printed the line before this lane; soak1k-278
 * (a village clean on every soak check, kind 7 included) prints it still.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';
import { poolMemberTexts } from '../helpers/drawnProse.js';
import { criticalIssuesOf } from '../../src/domain/display/validationOnPage.js';

// Re-keyed at W5 HIS's style pass (2026-11-07): the three vouch lines of DS-GEN-11 `criticalIssueCount zero`, plainly worded.
const VOUCH = /contradicts anything else|nothing contradicting anything else|nothing about it fails to add up|account of itself (?:is|stays) clean/;

function battery(settlement) {
  return settlement.generationCoherenceReceipt.judgments
    .find((entry) => entry.id === 'record_coherence_battery');
}
function verdict(settlement) {
  return generalDeskLines(settlement).viability.verdictLines
    .map((line) => line?.sentence ?? String(line)).join(' ');
}

describe('the self-vouch line follows the receipt\'s battery judgment', () => {
  beforeAll(async () => { await ensureLaws(); });

  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (no critical issue, and the battery finds food-words, defense-words and tier-noun): was soak1k-40. Re-picked 2026-11-04 after x46-1b and x46-3 composed (the budget moved the corpus again).
  // RE-KEYED BY IDENTITY (URBAN-FIX C-1): soak1k-178's last finding was the culture's raw foodways sentence, which the
  // record no longer stores (the food record's line is the one home); its receipt passes. Re-pointed to the first seed
  // of the 1,000 with no critical issue whose battery still finds a contradiction (probed at the cure): was soak1k-178.
  // RE-KEYED BY CAUSE (MATCHER, 2026-11-20): soak1k-7's only findings were false matches of the defence-words check (a
  // walls or soldier word that claims nothing about the place), which the check no longer reads as claims; its receipt
  // passes. Re-pointed to the first seed of the 1,000 with no critical issue whose battery still finds a contradiction
  // the check keeps (probed 0..119 at the MATCHER tip): soak1k-8, a village whose stored record says "town"
  // (`battery.tier-noun`, "town" for a village). Its findings are re-measured EXACTLY, as before.
  it('soak1k-8: the battery finds the contradiction and the page does not vouch', () => {
    const { settlement } = birth(8);
    expect(settlement.economicViability.metrics.criticalIssueCount).toBe(0);
    const judgment = battery(settlement);
    expect(judgment.status).toBe('needs_review');
    // RE-KEYED BY CAUSE (ALLEGIANCE-CAR4, 03ff59084 THE GOALS REBUILT): the record's `battery.defense-words` finding was
    // "hospital without a hospital" on the goal "Found an institution (a hospital, a school) …" — a row of the retired role
    // pool (npcData.js :: NPC_FACTION_GOALS), read at the base f6209c0c5; A9 no longer prints it. No seed of the 1,000 at the
    // car's tip carries all three findings with no critical issue (probed), so the identity is kept and its findings are
    // re-measured EXACTLY (an exact list, not a superset): the battery still finds two contradictions, and the page still
    // does not vouch (below).
    // RE-KEYED BY CAUSE (URBAN-FIX B-P1, 1b3436acd): the tier-noun finding was the Shadows District's "Old town or
    // slums" on this city, the instrument's false positive the licence row cured; one contradiction remains.
    expect(judgment.findings.map((f) => f.path)).toEqual(['battery.tier-noun']);
    expect(verdict(settlement)).not.toMatch(VOUCH); // anchored: the verdict is pinned exactly at the end of this case
    // RE-KEYED BY CAUSE (point 89, e7096fe96: BUILD-1 appended DS-GEN-11's contradiction members v4..v7, and the draw is a hash
    // over the eligible members): the anchor was one member's wording (/cannot all be true/, v1 and v3) and the page now
    // prints v4. It is COMPUTED from the pool's own members, filled with the record's own name (`{band}` stays reserved,
    // so v1 and v2 never fill): the page prints one of them, and none of the vouching lines (above).
    const contradiction = poolMemberTexts({
      leaf: 'general', blockId: 'DS-GEN-11', poolKey: 'criticalIssueCount: critical contradictions on the record',
      slots: { settlement: settlement.name },
    });
    expect(contradiction.length, 'the contradiction members the page can fill').toBeGreaterThan(0);
    // RE-KEYED BY R7 (RULING-R, the eleventh chair, 2026-11-27): the battery's "needs review" alone (its findings print only on
    // the staff panel; the Outlook tab lists no contradiction here) no longer prints the contradiction pool: the page neither
    // vouches (above) nor claims a contradiction it does not name. The members are computed above, so this is not vacuous.
    expect(contradiction.some((line) => verdict(settlement).includes(line)), `the verdict prints a contradiction member: ${verdict(settlement)}`).toBe(false);
    // THE POSITIVE ANCHOR (RULING 122-B-2, F6, UNIT 2 (d)): both expects above are negatives, so an empty verdict passes them.
    // What the verdict DOES print for this town at the tip is nothing: the battery says "needs review", the receipt is not
    // clean, and the Outlook lists no critical issue by title (R7's key, generalStateProse.js :: criticalIssuePoolKey), so
    // the contradiction lens is silent. Pinned exactly: a verdict that ever prints here, vouching or not, reds.
    expect(criticalIssuesOf(settlement.economicViability).filter((i) => i?.type !== 'stress_consequence' && i?.title)).toEqual([]);
    expect(generalDeskLines(settlement).viability.verdictLines).toEqual([]);
  });

  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (a record the battery finds clean that prints this line): was soak1k-278. Re-picked 2026-11-04 after x46-1b and x46-3 composed (the budget moved the corpus again).
  // STYLE-2 FIRST-IMPRESSIONS (B·#28, 2026-11-09): the vouching zero pool LEAVES (STYLE-RULINGS-2
  // B1(c), "the line reads the battery's verdict or leaves"): a clean record prints no vouch.
  it('soak1k-6: a record the battery finds clean prints no vouching line', () => {
    const { settlement } = birth(6);
    expect(battery(settlement)).toMatchObject({ status: 'pass', findings: [] });
    expect(verdict(settlement)).not.toMatch(VOUCH); // anchored: the battery passes on the line above, and the next case proves the same seed's verdict path is live
  });

  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (the clean record above): was soak1k-278.
  it('a receipt without the judgment (a save older than it) is not vouched for', () => {
    const { settlement } = birth(6);
    const older = {
      ...settlement,
      generationCoherenceReceipt: {
        ...settlement.generationCoherenceReceipt,
        judgments: settlement.generationCoherenceReceipt.judgments
          .filter((entry) => entry.id !== 'record_coherence_battery'),
      },
    };
    expect(typeof verdict(older)).toBe('string');
    expect(verdict(older)).not.toMatch(VOUCH); // anchored: the line above pins the verdict read; an older receipt prints no vouch line at all (empty), the claim itself
  });
});
