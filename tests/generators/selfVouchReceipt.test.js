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

// Re-keyed at W5 HIS's style pass (2026-11-07): the three vouch lines of DS-GEN-11 `criticalIssueCount zero`, plainly worded.
const VOUCH = /contradicts anything else|nothing about it fails to add up|account of itself (?:is|stays) clean/;

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
  it('soak1k-178: the battery finds the contradictions and the page does not vouch', () => {
    const { settlement } = birth(178);
    expect(settlement.economicViability.metrics.criticalIssueCount).toBe(0);
    const judgment = battery(settlement);
    expect(judgment.status).toBe('needs_review');
    expect(judgment.findings.map((f) => f.path)).toEqual(expect.arrayContaining([
      'battery.food-words', 'battery.defense-words', 'battery.tier-noun',
    ]));
    expect(verdict(settlement)).not.toMatch(VOUCH); // anchored: the next line pins the live contradiction verdict
    expect(verdict(settlement)).toMatch(/cannot all be true/);
  });

  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (a record the battery finds clean that prints this line): was soak1k-278. Re-picked 2026-11-04 after x46-1b and x46-3 composed (the budget moved the corpus again).
  it('soak1k-6: a record the battery finds clean still prints the line', () => {
    const { settlement } = birth(6);
    expect(battery(settlement)).toMatchObject({ status: 'pass', findings: [] });
    expect(verdict(settlement)).toMatch(VOUCH);
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
