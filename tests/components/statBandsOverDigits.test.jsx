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
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

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

/**
 * THE CORPUS the "None beside a bar" arm walks: 102 settlements, SEVENTEEN PER TIER, each
 * with its own seed. The tier is what moves the defect — `defenseGenerator` zeroes
 * `scores.magical` for a thorp or hamlet with no magic presence and lets the world slider
 * alone drive it from village up — so the split is per tier rather than a flat slice, which
 * would have run out before it reached a metropolis. The culture and terrain cycle underneath
 * so the institution rosters (and with them `hasMagicInst`) differ across the seventeen.
 * @type {Array<[object, string]>}
 */
const CORPUS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].flatMap(
  (settType, t) => ['germanic', 'latin', 'celtic', 'arabic', 'norse', 'slavic', 'east_asian',
    'mesoamerican', 'south_asian', 'steppe', 'greek']
    .flatMap((culture, c) => ['forest', 'grassland', 'coastal'].map((terrain, x) => [
      { settType, culture, terrain, tradeRouteAccess: ['road', 'port', 'isolated'][x] },
      `corpus-${t}-${c}-${x}`,
    ]))
    .slice(0, 17),
);

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

      // ONE NAME, ONE FACT, AND NO EXCEPTION (review 10). Magical Capability used to be
      // skipped here, because it printed the Defense tab's PRESENCE word instead of its own
      // grade. The two rows now carry two names for their two facts, so every row in this
      // list bands its own score and this loop judges all five.

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

    // Both scored rows (Economic Backing, Arcane Support) are present; the unscored
    // ones (no bar) carry no band and are untouched.
    const caps = deriveSupportingCapabilities(settlement);
    for (const label of ['Economic Backing', 'Arcane Support']) {
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
      expect(bands.length, `${label} must never render a second band`).toBeLessThanOrEqual(1);

      // THE GRADE HAS THREE PLACES IT CAN LAND — the status pill, the band beside the bar,
      // and the opening word of the note — and the rule is that it lands in exactly one of
      // them. The pill stands down when the PROSE opens on the grade, because a sentence
      // that says the word and then says what it means is the better carrier.
      const opensOnStatus = new RegExp(`^${cap.status.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
        .test(String(cap.note || '').trim());
      expect(Boolean(statusEl), `${label}: the pill must stand down exactly when the prose opens on the grade`)
        .toBe(!opensOnStatus);

      const said = [statusEl?.textContent, bands[0]?.textContent, opensOnStatus ? cap.status : null].filter(Boolean);
      expect(said.length, `${label} says its grade more than once: ${said.join(' / ')}`).toBe(new Set(said).size);

      // A PRESENCE READ HAS NO MAGNITUDE, so it has no bar and no band: `score: null` is
      // how this list spells "there is nothing here to grade" (Legal Infrastructure,
      // Medical Readiness, Logistics & Supply — and, since the magic row stopped borrowing
      // the engine's magical score, Arcane Support when the town has no arcane
      // institution). Such a row must still say what IS there.
      if (cap.score === null) {
        expect(bands.length, `${label} is a presence read and must carry no band`).toBe(0);
        expect(said.length, `${label} must still say what is there`).toBeGreaterThan(0);
        continue;
      }

      const implied = statusCase(scoreBand(Math.min(100, Math.max(0, cap.score || 0))));
      if (bands.length === 1) {
        expect(bands[0].textContent, `${label}'s band must read a band word`).toMatch(BAND_RE);
        expect(bands[0].textContent, `${label}'s band must be THIS row's score`).toBe(implied);
      } else {
        // The band may be dropped for ONE reason: the grade is already said elsewhere in
        // the row. A row that lost its grade for any other reason is the defect this catches.
        expect(said, `${label} dropped its band without the row saying that word`).toContain(implied);
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

/**
 * ── TWO NAMES, TWO FACTS (review 10, 2026-09-18) ────────────────────────────────────
 *
 * The arm this replaces asserted that the Overview row and the Defense capability row "say
 * the same word", which they did — because the Overview row had been made to PRINT the
 * Defense row's word. The claim was therefore vacuous by construction: it compared a value
 * against the derivation it was copied from, and it stayed green while the page printed
 * "None" in amber beside a half-full bar on 27 of 144 large settlements.
 *
 * The two rows read two different facts. `scores.magical` is the WORLD MAGIC SLIDER over a
 * wide presence (healer, monastery, cathedral, druid, divine, healing all count), so a town
 * with no arcane institution can score 49; `compound.inst.hasMagicInst` is the narrow arcane
 * roster. So they carry two names now, and the two arms below are what that costs:
 * a UNIQUENESS pin, so neither name can drift back onto the other tab, and a CORPUS pin on
 * the defect itself, which no naming rule can guarantee on its own.
 */
describe('Two names, two facts — the Overview score and the Defense presence read', () => {
  /** Every label-ish leaf word rendered in a container, for a membership question. */
  const labelsIn = (container) => [...container.querySelectorAll('span')]
    .filter((el) => el.children.length === 0)
    .map((el) => el.textContent.trim());

  test('the two label vocabularies are DISJOINT, so no name can answer two questions', () => {
    // Derived from the shipped producers, not retyped: the Systems Health row list this
    // file already drives, and the Defense tab's own capability list for a real town.
    const systemsHealth = [...SCORE_ROWS.map(([label]) => label), 'Food Security'];
    const capabilities = deriveSupportingCapabilities(settlements.find(([n]) => n === 'city')[1])
      .map((c) => c.label);
    expect(capabilities.length, 'the capability list is empty, so the overlap check is vacuous')
      .toBeGreaterThan(3);
    expect(
      systemsHealth.filter((label) => capabilities.includes(label)),
      'a label appears in BOTH lists — one name now answers two different questions',
    ).toEqual([]);
    // …and both names really are in play, so the disjointness is not the absence of one side.
    expect(systemsHealth).toContain('Magical Capability');
    expect(capabilities).toContain('Arcane Support');
  });

  test.each(CASES.map(([n]) => n))('%s: each magic name renders on exactly ONE tab', (name) => {
    const settlement = settlements.find(([n]) => n === name)[1];

    const { container: overview } = render(<OverviewTab settlement={settlement} />);
    const overviewLabels = labelsIn(overview);
    // 'Military Might' is the sibling ScoreRow: it proves the Systems Health block rendered,
    // so the exclusion below is a name that is not here rather than a section that is not.
    expectAbsentWithAnchor(overviewLabels, 'Arcane Support', 'Military Might',
      `${name}: the Defense tab's presence-read name on the Overview`);
    expect(overviewLabels, `${name}: the Overview's own magic row must render`)
      .toContain('Magical Capability');
    cleanup();

    const { container: defense } = render(<DefenseTab settlement={settlement} />);
    fireEvent.click(screen.getByRole('button', { name: /Supporting Capabilities/ }));
    const defenseLabels = labelsIn(defense);
    // 'Economic Backing' is the sibling capability row: it proves the fold is open and the
    // list rendered, which is exactly the drift that would make a bare exclusion vacuous.
    expectAbsentWithAnchor(defenseLabels, 'Magical Capability', 'Economic Backing',
      `${name}: the Overview's score-row name on the Defense tab`);
    expect(defenseLabels, `${name}: the Defense tab's presence row must render`)
      .toContain('Arcane Support');
  });
});

/**
 * ── THE DEFECT ITSELF, OVER A CORPUS ────────────────────────────────────────────────
 *
 * A naming rule cannot promise this. What review 10 actually measured is a RENDERED
 * CONTRADICTION: the word "None" — an absence — printed beside a bar with width, which is a
 * magnitude. Whatever names the rows carry, that pairing is always a lie, so it is pinned
 * as itself, over a corpus wide enough that the tiers and the magic slider both move.
 *
 * ⛔ THE WALK IS BOUNDED AT TWO ANCESTORS, and the bound is the whole reason the probe is
 * honest. The two shapes put the bar at different distances — the Overview's ScoreRow holds
 * its word in the header `div` and its bar in the NEXT sibling (two levels up from the
 * word), while the Defense capability row holds the word and the bar in the SAME header
 * (one level). Three levels would reach the Overview's score GRID and the Defense tab's caps
 * COLUMN, where every OTHER row's bar lives — and the probe would then convict a bar-less
 * "None" row of a neighbour's magnitude. Two levels is the largest reach that cannot leave
 * the row, and it covers both shapes.
 */
describe('No rendered row says "None" beside a bar that has width', () => {
  /** A bar, as BOTH renderers spell one: a filled inner div sized by inline percent. */
  const barsIn = (el) => [...el.querySelectorAll('div')].filter(
    (d) => d.style?.height === '100%' && /^\d+(\.\d+)?%$/.test(d.style?.width || ''),
  );

  /**
   * Every "None" in this container that sits beside a bar with width, as
   * `<row text> :: <bar width>`. Empty is the passing answer.
   */
  function nonesBesideABar(container) {
    const offenders = [];
    for (const el of container.querySelectorAll('span, div')) {
      if (el.children.length !== 0) continue;
      if (el.textContent.trim() !== 'None') continue;
      let scope = el.parentElement;
      for (let up = 0; up < 2 && scope; up += 1, scope = scope.parentElement) {
        const wide = barsIn(scope).filter((b) => parseFloat(b.style.width) > 0);
        if (barsIn(scope).length === 0) continue; // no bar at this reach — widen once
        if (wide.length > 0) offenders.push(`${scope.textContent.trim()} :: ${wide[0].style.width}`);
        break; // the NEAREST reach that holds a bar is this word's row; never leave it
      }
    }
    return offenders;
  }

  test('THE PROBE IS LIVE: it convicts the defect as review 10 found it on the page', () => {
    // The positive control, in the exact markup ScoreRow produced when it took a status
    // word: an absence beside a two-thirds bar. A probe that cannot see this proves nothing
    // about the corpus below, however green that corpus runs.
    const { container } = render(
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span>Magical Capability</span><span>None</span>
        </div>
        <div style={{ height: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '66%' }} />
        </div>
      </div>,
    );
    expect(nonesBesideABar(container)).toEqual(['Magical CapabilityNone :: 66%']);
    cleanup();
    // …and a bar-less "None" row beside a SIBLING that has one is NOT convicted, which is
    // the false positive the two-level bound exists to refuse.
    const { container: sibling } = render(
      <div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex' }}><span>Legal Infrastructure</span><span>None</span></div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex' }}><span>Economic Backing</span><span>Adequate</span></div>
          <div style={{ height: 6 }}><div style={{ height: '100%', width: '71%' }} /></div>
        </div>
      </div>,
    );
    expect(nonesBesideABar(sibling)).toEqual([]);
  });

  test('over a generated corpus, neither tab ever pairs the word with a width', () => {
    const offenders = [];
    let nones = 0;
    let barred = 0;
    for (const [config, seed] of CORPUS) {
      const settlement = generateSettlementPipeline(config, null, { seed, customContent: {} });
      const { container: overview } = render(<OverviewTab settlement={settlement} />);
      nones += [...overview.querySelectorAll('span')].filter((el) => el.textContent.trim() === 'None').length;
      barred += barsIn(overview).filter((b) => parseFloat(b.style.width) > 0).length;
      for (const hit of nonesBesideABar(overview)) offenders.push(`${seed} overview :: ${hit}`);
      cleanup();

      const { container: defense } = render(<DefenseTab settlement={settlement} />);
      fireEvent.click(screen.getByRole('button', { name: /Supporting Capabilities/ }));
      nones += [...defense.querySelectorAll('span')].filter((el) => el.textContent.trim() === 'None').length;
      barred += barsIn(defense).filter((b) => parseFloat(b.style.width) > 0).length;
      for (const hit of nonesBesideABar(defense)) offenders.push(`${seed} defense :: ${hit}`);
      cleanup();
    }
    // NON-VACUITY, both halves: the corpus really printed the word, and really drew bars
    // with width. Without these the arm passes on a page-set that rendered nothing at all.
    expect(nones, 'no settlement printed "None" anywhere — the corpus cannot show the defect')
      .toBeGreaterThan(0);
    expect(barred, 'no settlement drew a bar with width — the pairing is unreachable')
      .toBeGreaterThan(0);
    expect(offenders, `an absence is printed beside a magnitude on ${offenders.length} row(s)`)
      .toEqual([]);
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
    // THROUGH THE LADDER, NOT A LITERAL. `scoreBand` still returns the frozen capitals —
    // that is the vocabulary, and re-casing it at the SOURCE would move the public
    // projection with it. The tile re-cases at the RENDER rung, so the pin reads the same
    // two functions the tile does and cannot drift from either one.
    expect(text).toContain(`Systems average: ${statusCase(scoreBand(avg))}`);
  });
});
