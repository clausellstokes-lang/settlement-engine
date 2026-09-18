/** @vitest-environment jsdom */
/**
 * statBandsOverDigits.test.jsx — Wave R-5b item #20 (docs/CAPABILITY_REMEDIATION_PLAN.md).
 *
 * THE CONTRACT: every stat bar built on a 0-100 `defenseProfile.scores.*` value
 * shows the score's BAND WORD, never the digit, and every surface reads that
 * word from the ONE ladder in src/domain/display/defenseScoreBands.js.
 *
 * Three retirements are pinned here, one per surface:
 *   1. OverviewTab "Systems Health" — the five ScoreRow bars printed a bare
 *      rounded 0-100 beside the bar.
 *   2. DefenseTab — (a) the Internal Security banner printed the raw
 *      `safetyRatio` float as "ratio 1.23x" (the sibling of the Enforcement
 *      Ratio the owner retired from OverviewTab on 2026-07-22); (b) the
 *      Supporting Capabilities rows printed a bare rounded 0-100 beside their
 *      bars.
 *   3. SummaryTab — the Defense situation tile's sub-line printed
 *      "Avg. score N/100", the raw mean of the same five scores.
 *
 * These are BEHAVIOUR pins (render a real generated settlement, read the DOM),
 * deliberately outside tests/lint and named without invariant nomenclature, so
 * the E-A enumeration rule (tests/lint/mutationCoverage.shared.mjs) does not
 * pick them up and no mutation-manifest entry is owed — the same split the
 * terrain lane used (behaviour half at tests/lib/terrainReaderRouting.test.jsx,
 * structural half carrying the manifest entry).
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { scoreBand, scoreColor } from '../../src/domain/display/defenseScoreBands.js';
import { deriveSupportingCapabilities } from '../../src/domain/display/defenseDisplay.js';
import { statusCase } from '../../src/components/new/labelLadder.js';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import SummaryTab from '../../src/components/new/SummaryTab.jsx';

// TWO SPELLINGS OF ONE LADDER, and the difference is the point. BANDS is the vocabulary
// `defenseScoreBands.js` FREEZES ("the frozen four; never extend") and the PDF prints;
// BAND_RE is what the dossier RENDERS, which since the label ladder landed is rung 3's
// sentence case (components/new/labelLadder.js `statusCase`). The domain arm below reads
// the first, every render arm reads the second.
const BANDS = ['STRONG', 'ADEQUATE', 'WEAK', 'CRITICAL'];
const BAND_RE = /^(Strong|Adequate|Weak|Critical)$/;

/** The five Systems Health rows and the score key each one reads. */
const SCORE_ROWS = [
  ['Military Might', 'military'],
  ['Monster Defense', 'monster'],
  ['Internal Security', 'internal'],
  ['Economic Resilience', 'economic'],
  ['Magical Capability', 'magical'],
];

/** Seeds chosen to land different bands; every one is a FRESH generation. */
const CASES = [
  ['thorp', { settType: 'thorp', culture: 'germanic', terrain: 'forest', tradeRouteAccess: 'isolated' }, 'bands-thorp'],
  ['village', { settType: 'village', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' }, 'bands-village'],
  ['city', { settType: 'city', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' }, 'bands-city'],
  ['metropolis', { settType: 'metropolis', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' }, 'bands-metro'],
];

/** @type {Array<[string, any]>} */
const settlements = [];

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((query) => ({
    media: query, matches: false,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {},
  }));
  for (const [name, config, seed] of CASES) {
    settlements.push([name, generateSettlementPipeline(config, null, { seed, customContent: {} })]);
  }
});

afterEach(() => { cleanup(); });

// ── The ladder itself ────────────────────────────────────────────────────────

describe('defenseScoreBands — the one ladder', () => {
  test('the four band words are the frozen readiness vocabulary at 65/40/20', () => {
    expect(scoreBand(100)).toBe('STRONG');
    expect(scoreBand(65)).toBe('STRONG');
    expect(scoreBand(64)).toBe('ADEQUATE');
    expect(scoreBand(40)).toBe('ADEQUATE');
    expect(scoreBand(39)).toBe('WEAK');
    expect(scoreBand(20)).toBe('WEAK');
    expect(scoreBand(19)).toBe('CRITICAL');
    expect(scoreBand(0)).toBe('CRITICAL');
    // TOTALITY: no fifth word can appear for any score in range.
    for (let n = 0; n <= 100; n += 1) expect(BANDS).toContain(scoreBand(n));
  });

  test('the colour ladder changes at exactly the same three thresholds as the words', () => {
    for (let n = 1; n <= 100; n += 1) {
      const wordMoved = scoreBand(n) !== scoreBand(n - 1);
      const colourMoved = scoreColor(n) !== scoreColor(n - 1);
      expect(colourMoved, `score ${n}: word and colour must move together`).toBe(wordMoved);
    }
  });
});

// ── Surface 1: OverviewTab Systems Health ────────────────────────────────────

describe('OverviewTab Systems Health — bands, not digits', () => {
  test.each(CASES.map(([n]) => n))('%s: each score row shows its band word and no number', (name) => {
    const settlement = settlements.find(([n]) => n === name)[1];
    const { container } = render(<OverviewTab settlement={settlement} />);
    const scores = settlement.defenseProfile?.scores || {};

    for (const [label, key] of SCORE_ROWS) {
      const labelEl = [...container.querySelectorAll('span')].find((el) => el.textContent === label);
      expect(labelEl, `${label} row must render`).toBeTruthy();
      const row = labelEl.parentElement;
      const value = row.lastElementChild.textContent;

      // The band renders...
      expect(value).toMatch(BAND_RE);
      // ...and it is the band of THIS row's score, not a neighbour's.
      const n = Math.min(100, Math.max(0, scores[key] || 0));
      // DERIVED, not retyped: rung 3 re-cases the frozen vocabulary at the render site
      // (components/new/labelLadder.js), and the pin reads the same two functions the
      // component does, so the band still cannot drift to a neighbour's score.
      expect(value).toBe(statusCase(scoreBand(n)));
      // ...and the retired digit is gone from the whole row.
      expect(row.textContent).toBe(`${label}${value}`);
      expect(row.textContent).not.toMatch(/\d/);
    }
  });

  test('the bar still carries the magnitude (band replaced the digit, not the bar)', () => {
    const settlement = settlements.find(([n]) => n === 'city')[1];
    const { container } = render(<OverviewTab settlement={settlement} />);
    const labelEl = [...container.querySelectorAll('span')].find((el) => el.textContent === 'Military Might');
    const bar = labelEl.parentElement.nextElementSibling.firstElementChild;
    const n = Math.min(100, Math.max(0, settlement.defenseProfile.scores.military || 0));
    expect(bar.style.width).toBe(`${n}%`);
  });
});

// ── Surface 2: DefenseTab ────────────────────────────────────────────────────

describe('DefenseTab — the raw safetyRatio display is retired', () => {
  test.each(CASES.map(([n]) => n))('%s: no "ratio N.NNx" chip survives anywhere on the tab', (name) => {
    const settlement = settlements.find(([n]) => n === name)[1];
    const { container } = render(<DefenseTab settlement={settlement} />);
    const text = container.textContent;

    expect(text).not.toMatch(/ratio\s*[\d.]+/i);
    expect(text).not.toContain('×');
    // The typed reads that carry the same fact are still there.
    expect(text).toMatch(/Internal security · first survey/);
    expect(text).toMatch(/(Strong|Adequate|Weak) Public Order|Critical: Order Failing/);
  });

  test('the ratio is retired from DISPLAY only — safetyProfile.safetyRatio is still derived', () => {
    for (const [, settlement] of settlements) {
      expect(typeof settlement.economicState?.safetyProfile?.safetyRatio).toBe('number');
    }
  });
});

describe('DefenseTab Supporting Capabilities — bands, not digits', () => {
  test.each(CASES.map(([n]) => n))('%s: every scored capability row says its grade exactly once', (name) => {
    const settlement = settlements.find(([n]) => n === name)[1];
    render(<DefenseTab settlement={settlement} />);
    fireEvent.click(screen.getByRole('button', { name: /Supporting Capabilities/ }));

    // Both scored rows (Economic Backing, Magical Capability) are present; the unscored
    // ones (no bar) carry no band and are untouched.
    const caps = deriveSupportingCapabilities(settlement);
    for (const label of ['Economic Backing', 'Magical Capability']) {
      const labelEl = screen.getByText(label);
      const row = labelEl.closest('div').parentElement;
      const cap = caps.find((c) => c.label === label);
      expect(cap, `${label} must be derived`).toBeTruthy();

      // ADDRESSED, NOT DISAMBIGUATED BY CASE. The band used to be the row's only word in
      // capitals, so matching the vocabulary found it and nothing else. Since rung 3 reads
      // in sentence case (components/new/labelLadder.js) the band and the row's own STATUS
      // word can be the SAME string — Economic Backing's status ladder is
      // Well-funded/Adequate/Underfunded/Critical and it overlaps the band's Adequate and
      // Critical — so both elements are named and the rule is checked between them.
      const bands = row.querySelectorAll('[data-sf-cap-band]');
      const statusEl = row.querySelector('[data-sf-cap-status]');
      expect(statusEl, `${label} must render its status`).toBeTruthy();
      expect(bands.length, `${label} must never render a second band`).toBeLessThanOrEqual(1);

      // A PRESENCE READ HAS NO MAGNITUDE, so it has no bar and no band: `score: null` is
      // how this list spells "there is nothing here to grade" (Legal Infrastructure,
      // Medical Readiness, Logistics & Supply — and, since the magic row stopped borrowing
      // the engine's magical score, Magical Capability when the town has no arcane
      // institution). Such a row must show its status and nothing else.
      if (cap.score === null) {
        expect(bands.length, `${label} is a presence read and must carry no band`).toBe(0);
        expect(statusEl.textContent, `${label} must still say what is there`).toBeTruthy();
        continue;
      }

      const implied = statusCase(scoreBand(Math.min(100, Math.max(0, cap.score || 0))));
      if (bands.length === 1) {
        expect(bands[0].textContent, `${label}'s band must read a band word`).toMatch(BAND_RE);
        expect(bands[0].textContent, `${label} prints one word twice`).not.toBe(statusEl.textContent);
        expect(bands[0].textContent, `${label}'s band must be THIS row's score`).toBe(implied);
      } else {
        // The band may be dropped for ONE reason: the status already says that word. A row
        // that lost its grade for any other reason is the defect this arm exists to catch.
        expect(statusEl.textContent, `${label} dropped its band without the status saying it`).toBe(implied);
      }
    }
    // The retired digits: no bare 1-3 digit run survives in the capability rows.
    const bars = screen.getByText('Economic Backing').closest('div').parentElement;
    expect(bars.textContent).not.toMatch(/\b\d{1,3}\b/);
  });

  // REACHABILITY, deterministically rather than through whatever the fixtures happen to
  // roll: the fold above is dead code unless the two ladders really can produce the same
  // word. Economic Backing grades econScore at 65/40/25 into the first list;
  // `scoreBand` grades the SAME number at 65/40/20 into the second.
  test('Economic Backing\'s status ladder and the band ladder overlap, so the fold is reachable', () => {
    const statuses = ['Well-funded', 'Adequate', 'Underfunded', 'Critical'];
    const bandWords = [100, 65, 40, 20, 0].map((n) => statusCase(scoreBand(n)));
    expect(
      statuses.filter((w) => bandWords.includes(w)),
      'the ladders stopped overlapping — the fold in DefenseTab is now dead code, remove it',
    ).toEqual(['Adequate', 'Critical']);
    // ...and they are not the SAME ladder, so the band still says something of its own.
    expect(statuses).not.toEqual(bandWords);
  });
});

describe('DefenseTab Threat Assessment — one score, one word, both tabs', () => {
  test('the badge for a shared score matches the OverviewTab band for that score', () => {
    const settlement = settlements.find(([n]) => n === 'metropolis')[1];
    const { container: overview } = render(<OverviewTab settlement={settlement} />);
    const overviewWord = [...overview.querySelectorAll('span')]
      .find((el) => el.textContent === 'Internal Security').parentElement.lastElementChild.textContent;
    cleanup();

    const { container: defense } = render(<DefenseTab settlement={settlement} />);
    const threatLabel = [...defense.querySelectorAll('span')]
      .find((el) => el.textContent === 'Internal Security');
    const badge = [...threatLabel.parentElement.querySelectorAll('span')]
      .find((el) => BAND_RE.test(el.textContent));

    expect(badge, 'the threat row must carry a band badge').toBeTruthy();
    expect(badge.textContent).toBe(overviewWord);
  });
});

// ── Surface 3: SummaryTab defence tile ───────────────────────────────────────

describe('SummaryTab defence tile — the averaged raw score is retired', () => {
  test.each(CASES.map(([n]) => n))('%s: the sub-line is a band word, not "Avg. score N/100"', (name) => {
    const settlement = settlements.find(([n]) => n === name)[1];
    const { container } = render(<SummaryTab settlement={settlement} />);
    const text = container.textContent;

    expect(text).not.toMatch(/Avg\. score/);
    expect(text).not.toMatch(/\/100/);

    const s = settlement.defenseProfile.scores;
    const avg = Math.round((s.military + s.monster + s.internal + s.economic + s.magical) / 5);
    expect(text).toContain(`Systems average: ${scoreBand(avg)}`);
  });
});
