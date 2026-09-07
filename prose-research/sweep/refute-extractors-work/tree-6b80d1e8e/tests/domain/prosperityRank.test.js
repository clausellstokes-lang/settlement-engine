/**
 * prosperityRank.test.js — the ONE prosperity ladder, and the habitat it removes.
 *
 * `economicState.prosperity` is a six-label categorical with no declared unit, and four
 * consumers re-quantified it privately on three different scales (ODQ §759.3, the §711.6
 * same-field-different-meaning family). `src/domain/prosperityRank.js` is the single leaf
 * they now share. This suite exists to keep it single: the divergence did not survive
 * because anyone defended it, it survived because nothing was watching.
 *
 * FOUR THINGS ARE ASSERTED, and the last two are the ones that matter in a year:
 *   1. the ladder is TOTAL and MONOTONE over the emitted vocabulary;
 *   2. the vocabulary is CLOSED, walked BOTH DIRECTIONS against `prosperity.js`'s own LABELS
 *      array — so a seventh label cannot be minted without this suite noticing;
 *   3. ALL FOUR consumers read the canonical ladder, and NO consumer keeps a private ladder
 *      (a source scan for the shape);
 *   4. the pre-T8 corruption holdout is GONE — neither the export nor an importer of it
 *      survives anywhere. T8 flipped `corruption.js` onto the canonical ladder (J-T7-C,
 *      ODQ §809) and re-recorded the generator goldens that moved; this arm is what stops
 *      the divergence being re-minted under its old name.
 *
 * @enforced-by this file
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import * as prosperityRankLeaf from '../../src/domain/prosperityRank.js';
import {
  PROSPERITY_LABELS,
  PROSPERITY_RANK,
  PROSPERITY_RANK_NEUTRAL,
  prosperityLabelOf,
  prosperityRank01,
} from '../../src/domain/prosperityRank.js';
import { deriveProsperityLabel } from '../../src/generators/economy/prosperity.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** Every .js/.jsx under src/, repo-relative, codepoint-sorted. */
function srcFiles(dir = path.join(ROOT, 'src'), out = []) {
  for (const entry of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) srcFiles(full, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(path.relative(ROOT, full).replace(/\\/g, '/'));
  }
  return out;
}
const SRC = srcFiles();
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

describe('the ladder itself', () => {
  test('TOTAL and MONOTONE over the emitted vocabulary, and bounded 0..1', () => {
    const ranks = PROSPERITY_LABELS.map((label) => prosperityRank01(label));
    for (const [i, rank] of ranks.entries()) {
      expect(Number.isFinite(rank), `${PROSPERITY_LABELS[i]} is not a number`).toBe(true);
      expect(rank).toBeGreaterThanOrEqual(0);
      expect(rank).toBeLessThanOrEqual(1);
    }
    // STRICTLY increasing: two adjacent bands that score the same are the interior/townV2
    // defect (Moderate and Comfortable collapsing) reappearing in the leaf.
    for (let i = 1; i < ranks.length; i += 1) {
      expect(ranks[i], `${PROSPERITY_LABELS[i]} must outrank ${PROSPERITY_LABELS[i - 1]}`)
        .toBeGreaterThan(ranks[i - 1]);
    }
  });

  test('TOTAL over junk: every input returns the neutral rather than throwing', () => {
    for (const junk of [undefined, null, '', '   ', 0, 42, NaN, true, [], {}, { label: '' },
      { nope: 'Wealthy' }, 'not-a-prosperity-label']) {
      expect(prosperityRank01(junk), `junk input ${JSON.stringify(junk)}`)
        .toBe(PROSPERITY_RANK_NEUTRAL);
    }
  });

  test('reads all three shapes the four prior consumers between them saw', () => {
    // A bare string (corruption, neighbourGenerator), `{label}`/`{tier}` (interiorModel,
    // townLayoutV2) and `{level}` (neighbourGenerator's object arm).
    for (const shape of ['Wealthy', { label: 'Wealthy' }, { tier: 'Wealthy' }, { level: 'Wealthy' }]) {
      expect(prosperityRank01(shape), JSON.stringify(shape)).toBe(PROSPERITY_RANK.Wealthy);
    }
    expect(prosperityLabelOf({ label: 'Poor', tier: 'Wealthy' })).toBe('Poor'); // label wins
    expect(prosperityLabelOf(42)).toBe('');
  });

  test('case-folded, whitespace-tolerant, and decorated labels resolve by substring', () => {
    expect(prosperityRank01('  wealthy  ')).toBe(PROSPERITY_RANK.Wealthy);
    expect(prosperityRank01('WEALTHY')).toBe(PROSPERITY_RANK.Wealthy);
    // The tolerance corruption.js already had, carried over deliberately.
    expect(prosperityRank01('Poor (declining)')).toBe(PROSPERITY_RANK.Poor);
  });
});

describe('the vocabulary is closed, walked both directions', () => {
  test("every label deriveProsperityLabel can emit has a rank, and PROSPERITY_LABELS is exactly that set", () => {
    // FORWARD: the leaf's own declared six all rank.
    for (const label of PROSPERITY_LABELS) {
      expect(PROSPERITY_RANK[label], `${label} has no rank`).toBeTypeOf('number');
    }
    // BACKWARD, and this is the arm that catches a seventh label: drive the REAL deriver
    // across its whole input space and assert every label it returns is one this leaf knows.
    // The base rungs are computeBaseProsperity's own vocabulary; the config space is swept so
    // the small-tier floors, the crime drag and every stress row are exercised.
    const bases = ['Subsistence', 'Poor', 'Moderate', 'Comfortable', 'Prosperous', 'Wealthy'];
    const configs = [
      {}, { tier: 'thorp', tradeRouteAccess: 'none' }, { tier: 'thorp', tradeRouteAccess: 'road' },
      { tier: 'hamlet', tradeRouteAccess: 'none' }, { tier: 'city' },
      { stressTypes: ['under_siege'] }, { stressTypes: ['famine'] }, { stressTypes: ['occupied'] },
      { stressTypes: ['indebted', 'wartime', 'insurgency'] }, { stressType: 'plague_onset' },
      { stressTypes: ['slave_revolt'] },
    ];
    // `deriveProsperityLabel`'s Subsistence branch draws from the ambient PRNG, and the
    // kernel FAILS CLOSED rather than falling back to Math.random — so the sweep is seeded.
    const emitted = new Set();
    const previous = setActiveRng(createPRNG('prosperity-vocabulary-sweep'));
    try {
      for (const base of bases) {
        for (const config of configs) emitted.add(deriveProsperityLabel(base, config, []));
      }
    } finally {
      clearActiveRng(previous);
    }
    for (const label of emitted) {
      expect(PROSPERITY_RANK[label], `deriveProsperityLabel emits '${label}' and the leaf has no rank for it`)
        .toBeTypeOf('number');
      expect(PROSPERITY_LABELS, `'${label}' is emitted but not declared in PROSPERITY_LABELS`)
        .toContain(label);
    }
    // ANTI-VACUITY: the sweep must actually reach most of the ladder, or the arm above is a
    // check over a set of one.
    expect(emitted.size).toBeGreaterThanOrEqual(5);
  });

  test('every alias is genuinely an alias — not an emitted label wearing a second spelling', () => {
    const aliases = Object.keys(PROSPERITY_RANK).filter((k) => !PROSPERITY_LABELS.includes(k));
    expect(aliases.length).toBeGreaterThan(0);
    for (const alias of aliases) {
      // ANCHORED: a bare `not.toContain` here would pass just as happily if PROSPERITY_LABELS
      // drifted to empty as it does when the alias is correctly excluded. 'Moderate' is a
      // member of the emitted six asserted above, so the collection is proved live in the
      // same breath as the exclusion.
      expectAbsentWithAnchor(
        PROSPERITY_LABELS, alias, 'Moderate',
        `${alias} is declared an alias but is also an emitted label`,
      );
    }
  });
});

describe('the habitat is gone', () => {
  // THE DETECTOR, and its shape is the finding. Both private spellings this leaf replaced —
  // a frozen `label: 0.x` map and a `/label|label/.test(t) ? 0.x` regex probe — put TWO OR
  // MORE distinct labels of the closed vocabulary within a line's reach of a 0..1 literal.
  // The "two or more" is not decoration: the first draft convicted
  // `institutionLifecycle.js`, whose `thresholds: { prosperous: 0.62, declining: 0.4 }` is a
  // band on a 0..1 economy-health COMPOSITE and not a label ladder at all. One vocabulary
  // word beside a number is a threshold; several are a ladder.
  const VOCABULARY = Object.keys(PROSPERITY_RANK).map((k) => k.toLowerCase());
  const NEAR = 60;

  // Comments are STRIPPED before the scan (the fieldManifest walker's precedent). Prose that
  // merely names two bands beside a coefficient is not a ladder, and the header of the leaf
  // itself is the densest such prose in the repo.
  const strip = (source) => source
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

  /** @param {string} source @returns {string[]} the distinct ladder labels found */
  function privateLadderLabels(source) {
    const code = strip(source);
    /** @type {Set<string>} */
    const found = new Set();
    for (const match of code.matchAll(/0?\.\d+/g)) {
      const from = Math.max(0, (match.index ?? 0) - NEAR);
      const window = code.slice(from, (match.index ?? 0) + NEAR).toLowerCase();
      // The label must be DELIMITED — a quoted key, a regex alternand, a bare property name —
      // so a band word inside a longer identifier is not a hit.
      for (const label of VOCABULARY) {
        if (new RegExp(`['"\`|/\\s({,]${label}['"\`|/\\s:,)}]`).test(window)) found.add(label);
      }
    }
    return [...found].sort();
  }
  const isPrivateLadder = (source) => privateLadderLabels(source).length >= 2;

  // ── THE TYPED EXEMPTIONS, each with the reason it is NOT this defect class ──────────────
  // A bare skip list rots into a place defects hide, so every row is asserted to STILL FIRE
  // below: an exemption whose file stopped matching is a stale exemption and reds.
  const EXEMPT = Object.freeze([
    ['src/domain/prosperityRank.js', 'the leaf itself — this IS the one ladder'],
    ['src/domain/conditionPromotion.js',
      '⚠ THE FIFTH CONSUMER, found by this walker and NOT in §759.3\'s roster of four. It '
      + 'reads the same categorical but produces a DIFFERENT QUANTITY — a ±0.06 promotion '
      + 'modifier, banded {Subsistence,Struggling,Poor} / {Prosperous,Wealthy} — not a 0..1 '
      + 'rank, and its banding is monotone in the canonical order, so it is not the '
      + 'same-field-different-meaning defect. Its hard-coded labels ARE held to the closed '
      + 'vocabulary by the arm below, which is the live risk here'],
    ['src/domain/spatial/spatialSubstrate.js',
      'a DIFFERENT SIX-BAND VOCABULARY on a different subject: WEALTH_BANDS is quarter '
      + 'wealth (destitute…opulent), not settlement prosperity. Homonym-adjacent, genuinely '
      + 'not the same field'],
    ['src/data/geographyData.js', 'authored CONTENT strings that contain band words'],
    ['src/data/institutionServices.js', 'authored CONTENT strings that contain band words'],
    ['src/data/institutionalCatalog.js', 'authored CONTENT strings that contain band words'],
  ]);
  const EXEMPT_FILES = new Set(EXEMPT.map(([rel]) => rel));

  test('no unexempted file carries a private prosperity ladder', () => {
    const offenders = SRC
      .filter((rel) => !EXEMPT_FILES.has(rel) && isPrivateLadder(read(rel)))
      .map((rel) => `${rel} [${privateLadderLabels(read(rel)).join(', ')}]`);
    expect(
      offenders,
      'a private prosperity→0..1 ladder is back; import prosperityRank01 instead — the four '
      + 'that existed before this leaf scored the same Comfortable settlement 0.6, 0.5 and '
      + '0.65 (§759.3). If it is genuinely a different quantity, add a typed EXEMPT row with '
      + 'the reason, never a bare skip',
    ).toEqual([]);
  });

  test('every exemption still fires — a stale exemption is a place a defect can hide', () => {
    const dead = EXEMPT
      .filter(([rel]) => !isPrivateLadder(read(rel)))
      .map(([rel, reason]) => `${rel} (${reason})`);
    expect(dead, 'these files no longer match the detector — delete their EXEMPT rows').toEqual([]);
  });

  test("the fifth consumer's hard-coded labels are all in the closed vocabulary", () => {
    // THE LIVE RISK at conditionPromotion.js is not its banding, it is that the band names
    // are string literals: rename a label in prosperity.js and its arms silently stop
    // selecting — the dead-culture-bias-key class (§759.5) in a new home.
    const source = strip(read('src/domain/conditionPromotion.js'));
    const quoted = [...source.matchAll(/pros(?:perity)?\s*===\s*'([^']+)'/g)].map((m) => m[1]);
    expect(quoted.length, 'the probe found no prosperity comparisons — it has drifted off its subject')
      .toBeGreaterThanOrEqual(5);
    for (const label of quoted) {
      expect(PROSPERITY_RANK[label], `conditionPromotion compares against '${label}', which the leaf does not know`)
        .toBeTypeOf('number');
    }
  });

  test('the detector is not vacuous — it convicts BOTH spellings it was built from', () => {
    // The frozen-map spelling (corruption.js's).
    expect(isPrivateLadder('const P = { comfortable: 0.6, prosperous: 0.8, wealthy: 1.0 };')).toBe(true);
    // The regex-probe spelling (interiorModel/townLayoutV2's), verbatim from the file it came from.
    expect(isPrivateLadder('if (/opulent|wealthy|rich|prosperous/.test(t)) return 0.9;')).toBe(true);
    // The neighbourGenerator spelling.
    expect(isPrivateLadder("{ 'Struggling':0.1,'Poor':0.25,'Moderate':0.5 }")).toBe(true);
    // NEGATIVE CONTROLS — the false positive that taught the two-label rule, and prose.
    expect(isPrivateLadder('thresholds: Object.freeze({ prosperous: 0.62, declining: 0.4 }),')).toBe(false);
    expect(isPrivateLadder('// a comfortable settlement is not a wealthy one')).toBe(false);
  });

  test('ALL FOUR consumers import the canonical ladder', () => {
    for (const rel of ['src/generators/neighbourGenerator.js', 'src/domain/interior/interiorModel.js',
      'src/domain/townMap/townLayoutV2.js', 'src/domain/corruption.js']) {
      expect(read(rel), `${rel} no longer reads the one ladder`).toMatch(/prosperityRank01\b/);
    }
  });
});

describe('the pre-T8 corruption holdout is GONE, and cannot be re-minted under its name', () => {
  // T7 could not flip `corruption.js` onto this ladder: its climate adapter feeds
  // `corruptionPass`, a GENERATION step, so the flip was same-seed load-bearing and ODQ
  // §773.1 holds every golden-moving wave for T8's single shift window. T7 therefore
  // REGISTERED the divergence as an export here, held to one importer by a walker, with the
  // disagreeing labels pinned by value (J-T7-C). T8 executed the flip and re-recorded the
  // generator-golden rows it moved under a SHIFT RECORD naming this cause.
  //
  // These arms are what the registration turns into once it is discharged: the walker that
  // permitted EXACTLY ONE importer now permits NONE, so the removal is a property of the
  // tree rather than a fact about one commit.
  test('the leaf exports no pre-T8 ladder — not the table, not the reader, not the consumer pin', () => {
    for (const name of ['PROSPERITY_RANK_PRE_T8_CORRUPTION',
      'PROSPERITY_RANK_PRE_T8_CORRUPTION_CONSUMER', 'prosperityRank01PreT8Corruption']) {
      expect(
        prosperityRankLeaf[name],
        `${name} is exported again — the one-ladder class has re-opened under its old name`,
      ).toBeUndefined();
    }
    // ANCHOR: the same namespace read still finds the canonical reader, so the three
    // undefineds above measure removal and not a failed import.
    expect(prosperityRankLeaf.prosperityRank01).toBeTypeOf('function');
  });

  test('NO file under src/ names the pre-T8 reader, and the scan that says so is live', () => {
    // ANCHOR FIRST: the identical scan for the CANONICAL reader must find the four
    // consumers. That proves SRC is populated and the regex machinery works, so the empty
    // result below is a selection and not a vacuous green (tests/helpers/anchoredNegatives).
    const canonical = SRC.filter((rel) => rel !== 'src/domain/prosperityRank.js'
      && /prosperityRank01\b/.test(read(rel)));
    expect(canonical).toEqual(expect.arrayContaining([
      'src/domain/corruption.js', 'src/domain/interior/interiorModel.js',
      'src/domain/townMap/townLayoutV2.js', 'src/generators/neighbourGenerator.js',
    ]));

    const holdouts = SRC.filter((rel) => /prosperityRank01PreT8Corruption|PRE_T8_CORRUPTION/.test(read(rel)));
    expect(
      holdouts,
      'a pre-T8 prosperity ladder is back. It existed ONLY because flipping corruption.js '
      + 'moved generator-golden rows and §773.1 coupled that into T8\'s shift window. That '
      + 'window has closed: there is one ladder now, and a second one is a defect.',
    ).toEqual([]);
  });

  test('the five labels that moved are pinned at the values corruption.js now reads', () => {
    // The T7 registration pinned this table as a DISAGREEMENT (pre-T8 -> canonical). The
    // disagreement is discharged, so the same five labels are pinned here at their new
    // values — the record of what the shift actually did to the corruption climate.
    expect(PROSPERITY_LABELS.map((label) => [label, prosperityRank01(label)])).toEqual([
      // label            was (pre-T8)   is (canonical)
      ['Struggling', 0.1], //   0.2
      ['Poor', 0.25], //        0.2
      ['Moderate', 0.5], //     0.4
      ['Comfortable', 0.65], // 0.6
      ['Prosperous', 0.8], //   0.8 — the one that never disagreed
      ['Wealthy', 0.95], //     1.0
    ]);
    // The unknown default moved with them: the pre-T8 reader answered 0.4, the canonical
    // ladder answers its declared neutral.
    expect(prosperityRank01('nothing recognisable')).toBe(PROSPERITY_RANK_NEUTRAL);
    expect(PROSPERITY_RANK_NEUTRAL).toBe(0.5);
  });
});
