/**
 * tests/copy/landingProseGrounding.test.js — THE LANDING'S PROSE IS BOUND TO THE
 * FIXTURE IT QUOTES.
 *
 * ── THE CLASS THIS CURES ────────────────────────────────────────────────────
 * On 2026-09-19 the landing's frozen fixture was found EIGHT FIELDS STALE: the
 * engine had moved under it and the page had gone on printing the old town's
 * facts under the shipped engine's version markers. tests/build/landing
 * FixtureFreshness.test.js is the cure for that — it re-derives and diffs bytes.
 *
 * It cannot see THIS defect. Once the copy started quoting the fixture (ODQ
 * §934.30 item 3, the one-narrative rewrite the owner approved), a regenerated
 * fixture reds the freshness suite, someone re-emits it, the suite goes green —
 * and the PROSE still says four hundred and twelve people in a village that now
 * has six hundred. Bytes agreeing is not the same as sentences agreeing.
 *
 * ⛔ SO THIS FILE READS THE COPY AND THE FIXTURE AND REFUSES TO LET THEM DRIFT.
 * Every arm names the exact field it binds. The rule for adding one: if a landing
 * sentence states a fact that came out of the engine, it is bound here or it is
 * not stated.
 *
 * ⚠ WHAT IT DELIBERATELY DOES NOT DO: it does not check that the prose is GOOD,
 * or that it still reads as one narrative. That is the owner's, and no suite's.
 * It checks only that the quoted facts are still the engine's facts.
 *
 * ⚠ AND IT IS NOT A SUBSTRING SWEEP OVER THE WHOLE REGISTRY. A test that merely
 * asserted "412 appears somewhere" would pass on a page that had dropped the
 * sentence entirely, which is the rendered-surface vacuity (§320.3) in its copy
 * form. Each arm names the KEY whose sentence carries the fact, so a deleted or
 * reworded sentence reds here and is revisited on purpose.
 */
import { describe, it, expect } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { landing } from '../../src/copy/landing.js';
import { fixture } from '../../src/components/home/landingFixture.js';

/** 412 → "four hundred and twelve". Bounded: the landing quotes one figure. */
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/** @param {number} n @returns {string} */
function spellUnderThousand(n) {
  if (n < 20) return ONES[n];
  if (n < 100) {
    const tens = TENS[Math.floor(n / 10)];
    const rest = n % 10;
    return rest ? `${tens}-${ONES[rest]}` : tens;
  }
  const hundreds = `${ONES[Math.floor(n / 100)]} hundred`;
  const rest = n % 100;
  return rest ? `${hundreds} and ${spellUnderThousand(rest)}` : hundreds;
}

describe('the landing prose quotes the fixture it is about', () => {
  it('spells a population the way the copy does (the helper itself is sound)', () => {
    // ⛔ ANTI-VACUITY FOR THE ARM BELOW. If this helper were wrong, the
    // population assertion would be comparing the copy against a wrong string
    // and would red for the wrong reason — or, worse, a helper that returned ''
    // would make `toContain('')` true forever.
    expect(spellUnderThousand(412)).toBe('four hundred and twelve');
    expect(spellUnderThousand(900)).toBe('nine hundred');
    expect(spellUnderThousand(61)).toBe('sixty-one');
    expect(spellUnderThousand(12)).toBe('twelve');
  });

  it('the brief body states the fixture town, its population and its two dials', () => {
    const body = landing.brief.body;
    expect(body, 'the brief body no longer names the fixture town').toContain(fixture.town.name);
    expect(
      body,
      `the brief body says a population the fixture does not carry (fixture: ${fixture.town.population}).`
      + ' Re-ground the sentence, or take the figure out of it.',
    ).toContain(spellUnderThousand(fixture.town.population));
    // The eyebrow is "<route> <tier> · <terrain>"; the sentence says the same two
    // dials in words, so both halves are bound rather than the phrase as a whole.
    const [route, tier] = fixture.town.eyebrow.split(' ');
    const terrain = fixture.town.eyebrow.split('· ')[1];
    expect(body, `the town is no longer a ${terrain} settlement`).toContain(terrain);
    expect(body, `the town is no longer a ${tier}`).toContain(tier);
    expect(body, `the ${route} is no longer what reaches it`).toContain(route);
  });

  it('the closer states the run the fixture actually performed', () => {
    expect(
      landing.closer.sub,
      `the closer says a span the fixture does not carry (fixture.weeks: ${fixture.weeks}).`,
    ).toContain(spellUnderThousand(fixture.weeks));
    expect(landing.closer.sub).toContain(fixture.town.name);
  });

  it('the realm body names the town and the span the advance card shows', () => {
    expect(landing.realm.body1, 'body1 no longer names the fixture town').toContain(fixture.town.name);
    expect(landing.realm.body2, 'body2 no longer names the fixture town').toContain(fixture.town.name);
    expect(landing.realm.body2, `body2's span disagrees with fixture.weeks (${fixture.weeks})`)
      .toContain(spellUnderThousand(fixture.weeks));
  });

  // ── THE SIX EVENTS, WEEK BY WEEK AND NOUN BY NOUN ─────────────────────────
  // realm.body2 narrates the same rows the advance card renders. This is the
  // most fragile prose on the page: a regenerated fixture can keep the SHAPE
  // (six events, real weeks) while changing every beat, and nothing else in the
  // estate would notice the paragraph had become fiction.
  it('the realm body narrates the advance timeline the fixture carries', () => {
    const advance = fixture.realm.advance;
    // ANTI-VACUITY: the loop below proves nothing over an empty timeline.
    expect(advance.length, 'the fixture carries no advance events').toBeGreaterThanOrEqual(3);

    const body = landing.realm.body2.toLowerCase();
    // The two weeks the sentence calls out BY NUMBER.
    const weeks = advance.map((entry) => Number(String(entry.week).replace(/\D/g, '')));
    for (const spoken of [10, 12]) {
      expect(
        weeks,
        `the prose calls out week ${spoken}, which the fixture's advance timeline no longer contains`
        + ` (it has weeks ${weeks.join(', ')}).`,
      ).toContain(spoken);
      expect(body, `the prose stopped naming week ${spoken}`).toContain(`week ${spellUnderThousand(spoken)}`);
    }

    // THE NOUNS, AS PAIRS, because the engine and the table do not use the same
    // word for the same thing and pretending they do would make this suite lie.
    // The engine writes "criminal pressure" and "trade route strain"; the prose
    // says "there was crime" and "the road itself was strained". Each pair binds
    // BOTH sides at once: a fixture that stopped producing the beat reds on the
    // first expect, and a paragraph that stopped narrating it reds on the second,
    // and neither can pass alone.
    const headlines = advance.map((entry) => `${entry.headline} ${entry.text}`.toLowerCase()).join(' | ');
    for (const [inProse, inFixture] of [
      ['creed', 'creed'],
      ['wartime', 'wartime'],
      ['fracture', 'fracture'],
      ['crime', 'criminal'],
      ['strain', 'trade'],
    ]) {
      expect(
        headlines,
        `the fixture's advance timeline no longer carries a "${inFixture}" beat, so the landing`
        + ' paragraph that narrates one is fiction. Re-ground realm.body2 against the regenerated'
        + ' timeline — do not relax this pair to get green.',
      ).toContain(inFixture);
      expect(body, `realm.body2 stopped narrating the "${inFixture}" beat (it read "${inProse}")`).toContain(inProse);
    }
  });

  it('the 01 body previews the receipts §02 prints, in the engine\'s own terms', () => {
    const body = landing.forge.body.toLowerCase();
    const receipts = Object.fromEntries(fixture.voice.receipts.map((r) => [r.label, r.text.toLowerCase()]));
    // ANTI-VACUITY: the receipts the sentence is built from must still exist.
    for (const label of ['route', 'resource', 'conflict']) {
      expect(receipts[label], `the fixture no longer emits a "${label}" receipt`).toBeTruthy();
    }
    expect(body, 'the road clause lost its receipt').toContain('road');
    expect(receipts.route, 'the fixture town is no longer road-reached').toContain('road');
    expect(body, 'the market clause lost its receipt').toContain('market');
    expect(receipts.conflict, 'the fixture conflict is no longer about the market').toContain('market');
  });

  it('the 02 body names the three receipts the card shows', () => {
    const body = landing.voice.body.toLowerCase();
    expect(body).toContain(fixture.town.name.toLowerCase());
    for (const word of ['road', 'timber', 'licence']) {
      expect(body, `the voice body stopped naming the "${word}" receipt`).toContain(word);
    }
    const receipts = fixture.voice.receipts.map((r) => r.text.toLowerCase()).join(' | ');
    for (const word of ['road', 'timber']) {
      expect(receipts, `the fixture no longer carries a "${word}" receipt for the voice card`).toContain(word);
    }
    // The card prints FOUR receipt lines and the sentence says so.
    expect(fixture.voice.receipts).toHaveLength(4);
    expect(body, 'the voice body counts a number of facts the card does not print').toContain('four facts');
  });

  it('the commons body offers a town the curated trio actually carries', () => {
    // The last clause of commons.body is only true because Cnocby became a
    // curated sample in the same act (ODQ §934.30 item 5).
    expect(landing.commons.body).toContain(fixture.town.name);
  });

  it('the region lead-in belongs to the REGION card, not the town card', () => {
    // The chronicle beside the realm map is region-scoped; the advance card is
    // town-scoped. The line exists to keep a reader from reading one as the other.
    expect(landing.realm.regionLine).toContain(fixture.town.name);
    const regionNames = fixture.realm.chronicle.map((entry) => entry.text).join(' ');
    const neighbourNamed = fixture.realm.neighbors.some((n) => regionNames.includes(n.name));
    expect(
      neighbourNamed,
      'the realm chronicle no longer mentions a single neighbour, so calling it "the region" is wrong',
    ).toBe(true);
  });
});

describe('the keys the rewrite retired stay retired', () => {
  it('no landing section carries a copy key that nothing renders', () => {
    // ⛔ THE ROT THIS ACT CURED, HELD SHUT. `realm.whyTraceTag` outlived the card
    // that rendered it; `brief.cta` and `brief.link` were never rendered at all.
    // An unresolvable key prints its own dotted path to a reader (ODQ §934.22);
    // an UNREAD key is quieter and rots into the next writer's assumption.
    // Each exclusion is anchored on a SIBLING KEY IN THE SAME BLOCK, so none of
    // them can pass because a whole copy block was emptied or renamed — which is
    // exactly how a "the key is gone" assertion outlives the thing it guards.
    expectAbsentWithAnchor(Object.keys(landing.realm), 'whyTraceTag', 'whyTraceTitle', 'landing.realm copy block');
    expectAbsentWithAnchor(Object.keys(landing.brief), 'cta', 'forgeExact', 'landing.brief copy block');
    expectAbsentWithAnchor(Object.keys(landing.brief), 'link', 'forgeExact', 'landing.brief copy block');
    expectAbsentWithAnchor(Object.keys(landing.forge), 'cta', 'readOn', 'landing.forge copy block');
    expectAbsentWithAnchor(Object.keys(landing.commons), 'cta', 'readOn', 'landing.commons copy block');
    // The keys the rewrite KEPT, named so a reader of this file can see what the
    // anchors above are standing on.
    expect(landing.realm.derivedLine, 'the advance card lost its footer key').toBeTruthy();
    expect(landing.forge.readOn, 'the forge hand-off is missing').toBeTruthy();
    expect(landing.commons.readOn, 'the commons hand-off is missing').toBeTruthy();
  });

  it('the realm keeps its launch-locked ask (a lane may not delete a lock instrument)', () => {
    // ⛔ THE ONE MIDDLE ASK THAT SURVIVED THE REWRITE, AND WHY. 'See Cartographer'
    // is control #5 of the 2026-09-16 purchase lockout and is pinned in both the
    // closed and the open state by
    // tests/components/launchLock.libraryHeaderLanding.test.jsx, which reads THIS
    // KEY by name. Cutting it to a read-on link means rewriting that census, which
    // is owner-gated (paid-surface behaviour) and was left to the chair.
    expect(landing.realm.cta, 'the launch-locked realm ask was removed — see .lane-resume.md').toBe('See Cartographer');
    // …and no read-on link shipped BESIDE it: the section has one control, not two.
    expectAbsentWithAnchor(Object.keys(landing.realm), 'readOn', 'cta', 'landing.realm copy block');
  });
});
