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
 * hook with no hospital, "town" for a city) printed the line before this lane; soak1k-33
 * (a town the battery finds clean) prints it still.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';

const VOUCH = /contradicts anything else in it|finds no seam|holds together regardless/;

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

  it('soak1k-40: the battery finds the contradictions and the page does not vouch', () => {
    const { settlement } = birth(40);
    expect(settlement.economicViability.metrics.criticalIssueCount).toBe(0);
    const judgment = battery(settlement);
    expect(judgment.status).toBe('needs_review');
    expect(judgment.findings.map((f) => f.path)).toEqual(expect.arrayContaining([
      'battery.food-words', 'battery.defense-words', 'battery.tier-noun',
    ]));
    expect(verdict(settlement)).not.toMatch(VOUCH);
    expect(verdict(settlement)).toMatch(/cannot all be true/);
  });

  it('soak1k-33: a record the battery finds clean still prints the line', () => {
    const { settlement } = birth(33);
    expect(battery(settlement)).toMatchObject({ status: 'pass', findings: [] });
    expect(verdict(settlement)).toMatch(/contradicts anything else in it/);
  });

  it('a receipt without the judgment (a save older than it) is not vouched for', () => {
    const { settlement } = birth(33);
    const older = {
      ...settlement,
      generationCoherenceReceipt: {
        ...settlement.generationCoherenceReceipt,
        judgments: settlement.generationCoherenceReceipt.judgments
          .filter((entry) => entry.id !== 'record_coherence_battery'),
      },
    };
    expect(verdict(older)).not.toMatch(VOUCH);
  });
});
