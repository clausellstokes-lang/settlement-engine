/**
 * THE CRISIS PAGE SPEAKS THE PLACE'S OWN NOUN (lane RUNG1-TRUTH unit B, 2026-11-04;
 * docs/SOAK_1000_RUNG1_2026-11-04.md §2 row 4, the kind-8 residue).
 *
 * Rung 1 counted 333 of 1,000 places calling themselves "town" when they are not one; 326 of
 * them are the crisis page's event line, "Religious Conversion, a crisis of the town itself."
 * (`crisisPage.js :: CRISIS_PAGE_COPY.nature.social`), and 8 more the cast's reason vocabulary,
 * "the town's defence, with no one on the roster leading it" (`crisisCast.js`). The page
 * composer now routes its line and every reason it prints through the estate's ONE
 * substitution, `speakTierNoun`, with the place's tier noun, as lane TIER-NOUN-POOLS did for the
 * fixed pools. A town reads exactly as before (the substitution returns the line by identity).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { composeCrisisPage } from '../../src/domain/crisis/crisisPage.js';

/** Every sentence the page composes that this lane routes. */
function routed(sections) {
  return sections.flatMap((s) => [
    s.line,
    ...s.cast.map((r) => r.reason),
    ...s.absent.map((a) => a.reason),
    ...s.stakes.map((k) => k.reason),
  ]).join('\n');
}

describe('the crisis page names a thorp a thorp', () => {
  beforeAll(async () => { await ensureLaws(); });

  // W4 PEOPLE second seat (STYLE-AUDIT row 21): the event line no longer prints the classification
  // ("a crisis of the town itself"), so it carries no place noun at all; the pin is re-keyed to the
  // line the thorp now prints, the kind as its heading.
  it('soak1k-48 (a thorp): the event line is the kind, with no classification', () => {
    const { settlement } = birth(48);
    expect(settlement.tier).toBe('thorp');
    const page = composeCrisisPage(settlement);
    expect(page.length).toBeGreaterThan(0);
    expect(routed(page)).not.toMatch(/\bthe town\b/i); // anchored: page.length > 0 above, and the next line pins the thorp's own event line in this page
    expect(page.map((s) => s.line)).toEqual(page.map((s) => `${s.label}.`));
  });

  it('soak1k-85 (a hamlet): the defender reason reads "the hamlet\'s defence"', () => {
    const { settlement } = birth(85);
    expect(settlement.tier).toBe('hamlet');
    const text = routed(composeCrisisPage(settlement));
    expect(text).not.toMatch(/\bthe town\b/i); // anchored: the next line pins the hamlet's own defender reason in this same text
    expect(text).toMatch(/the hamlet's defence/);
  });

  it('a town keeps its line byte for byte', () => {
    const page = composeCrisisPage({
      tier: 'town',
      name: 'Testholm',
      stress: [{ type: 'succession_void', label: 'Succession Void', cast: { nature: 'social', roles: [], absent: [], stakes: [], levers: [] } }],
    });
    expect(page[0].line).toBe('Succession Void.');
  });
});
