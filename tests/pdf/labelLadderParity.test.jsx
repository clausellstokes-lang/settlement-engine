/** @vitest-environment jsdom */
/**
 * labelLadderParity.test.jsx — ONE WORD, ONE SPELLING, ON BOTH SURFACES.
 *
 * ── THE DEFECT THIS EXISTS FOR (owner order "impliment every fix", 2026-09-18) ────────
 * The label ladder descended the screen's rung-2 and rung-3 labels to sentence case. The
 * paid PDF did not follow for one day, and in that day a DM read "Strong" on the Defense
 * tab and "STRONG" in the document they had paid for — the same settlement, the same
 * derivation, two spellings. Screen and print are projections of ONE model; a divergence in
 * the WORD is the estate's oldest law broken in its most expensive place.
 *
 * ── WHY THE CAPITALS HID IT ──────────────────────────────────────────────────────────
 * Two different mechanisms, and only one of them greps:
 *
 *   BY CALL   `.toUpperCase()` at the render site, or a `type.label` spread whose
 *             `textTransform: 'uppercase'` shouted a word the call had already cased.
 *   BY SOURCE the frozen vocabularies are DECLARED in capitals — `scoreBand` returns
 *             'STRONG' / 'ADEQUATE' / 'WEAK' / 'CRITICAL' and `defenseScoreBands.js` says
 *             of them "the frozen four; never extend". `DefenseSecurity` printed
 *             `{row.status}` through a style with no transform at all, so the page shouted
 *             with no `.toUpperCase()` anywhere in the expression to find.
 *
 * The second class is why this file asserts the RENDERED word rather than scanning source
 * for a transform: a source scan finds the first class and is blind to the second.
 *
 * ── WHAT IT ASSERTS, AND WHY IT IS NOT A TAUTOLOGY ───────────────────────────────────
 *   PARITY    for every fixture town, every band/status word the PDF prints is the word the
 *             SCREEN prints, CHARACTER FOR CHARACTER — compared case-sensitively, because
 *             a case-insensitive compare is precisely the assertion that would have passed
 *             all through the defect.
 *   SILENCE   no rendered PDF text leaf that is a band/status word equals its own
 *             `toUpperCase()`, anchored on the section having rendered real text.
 *   SOURCE    the frozen vocabularies are still frozen — `scoreBand` still returns capitals.
 *             The ladder re-cases at the RENDER rung and never at the source, and an arm
 *             that did not check this would pass just as happily if someone "fixed" it by
 *             editing the constant, which would silently move the public projection and the
 *             engine with it.
 *
 * The screen side is a REAL RENDER through `@testing-library/react`, not a re-derivation:
 * the point is what the two surfaces print, so asking the model twice would agree with
 * itself whatever the renderers did.
 *
 * ⛔ THE TREE, NEVER THE BYTES, on the print side — the estate's recorded law for this
 * question (`tests/pdf/pdfFieldManifest.walker.test.js`: react-pdf's `renderToBuffer` is
 * non-deterministic at the byte level). Every chapter is a plain hook-free function of its
 * props, so executing one IS rendering it. The walker below does not swallow: a chapter
 * that throws fails the arm that walked it, because a crashed chapter and a silent one must
 * never look alike.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { statusCase, tokenCase } from '../../src/domain/display/labelCase.js';
import { scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

// ── THE PRINT SIDE ───────────────────────────────────────────────────────────────────
import { SystemStateSnapshot } from '../../src/pdf/sections/SystemStateSnapshot.jsx';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { EconomicsTrade } from '../../src/pdf/sections/EconomicsTrade.jsx';
import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';
import { Services } from '../../src/pdf/sections/Services.jsx';

// ── THE SCREEN SIDE, rendered as a DM sees it ────────────────────────────────────────
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import ReadSystemStateBar from '../../src/components/settlement/ReadSystemStateBar.jsx';
import ServicesTab from '../../src/components/new/tabs/ServicesTab.jsx';
import PlotHooksTab from '../../src/components/new/tabs/PlotHooksTab.jsx';
import SummaryTab from '../../src/components/new/SummaryTab.jsx';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';

/**
 * Towns chosen to light different band ladders; every one is a FRESH generation, so no
 * fixture can go stale against a generator that moved.
 * @type {ReadonlyArray<readonly [string, Record<string, string>, string]>}
 */
const CASES = Object.freeze([
  ['town', { settType: 'town', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road' }, 'ladder-parity-town'],
  ['city', { settType: 'city', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' }, 'ladder-parity-city'],
]);

/**
 * THE FROZEN STATUS VOCABULARIES, transcribed rather than imported wherever transcribing
 * is possible.
 *
 * ⭐ TWO SPELLINGS OF ONE LADDER IS THE POINT. `scoreBand`'s four are imported through the
 * function (the SOURCE arm below proves the constant still shouts), but the words are also
 * written out here, from `defenseScoreBands.js`'s own "the frozen four". An arm that only
 * imported would agree with the module whatever it said.
 * @type {ReadonlyArray<string>}
 */
const SHOUTED_STATUS_WORDS = Object.freeze([
  'STRONG', 'ADEQUATE', 'WEAK', 'CRITICAL',          // scoreBand — the frozen four
  'STABLE', 'STRAINED', 'VULNERABLE',                 // domain/state/bands.js BAND_COLOR keys
  'COLLAPSED', 'SURPLUS',                             // causalState CAUSAL_BANDS
  'RAMPANT', 'ACUTE', 'ELEVATED', 'CONTAINED', 'NEGLIGIBLE', // the lower-is-better terms
]);

/**
 * THE RUNG-2 FIELD-NAME VOCABULARIES, in the case they used to reach the page in.
 *
 * Three group-header families that were shouting on BOTH surfaces, transcribed from their
 * own declaration sites: `tabConstants.Ts` / `Services.jsx`'s `SERVICE_CAT_LABEL` (the two
 * differ in WORDS as well as case, so both spellings are listed), `supplyChainData.js`'s
 * need labels, and `PlotHooks.jsx`'s `SOURCE_LABELS`.
 * @type {ReadonlyArray<string>}
 */
const SHOUTED_FIELD_NAMES = Object.freeze([
  // Service categories — screen (`Ts`) then the PDF's own shorter map.
  'LODGING', 'FOOD & DRINK', 'EQUIPMENT', 'INFORMATION', 'HEALING', 'ENTERTAINMENT',
  'EMPLOYMENT', 'MAGICAL SERVICES', 'TRANSPORTATION', 'LEGAL & FINANCIAL',
  'CRIMINAL SERVICES', 'MAGIC', 'TRANSPORT', 'LEGAL', 'CRIMINAL',
  // Supply-chain need groups.
  //
  // ⛔ 'FOOD SECURITY' IS DELIBERATELY ABSENT, and the reason is a defect class rather than
  // an oversight. The dossier uses those two words at TWO DIFFERENT RUNGS: as the chain
  // group header cured here, and as `EconomicsTrade:199`'s CHAPTER EYEBROW, which is rung 1
  // and keeps its capitals by the ruling. A vocabulary arm judges a leaf by its word alone,
  // so it cannot tell the two apart and would convict the eyebrow for being correct. The
  // estate has met this before — the screen ladder's DefenseTab row "passed only because
  // the band shouted" once two ladders overlapped — and its answer was to address the
  // ELEMENT rather than disambiguate by case. The other nine need labels carry the pin;
  // resolving this one needs a structural handle on the group header, which is recorded
  // rather than bodged.
  'RAW MATERIALS & FUEL', 'MANUFACTURING & CRAFTS', 'DEFENSE & SECURITY',
  'TRADE & ENTREPÔT', 'KNOWLEDGE & INFORMATION', 'RELIGION & CIVIC',
  'ENTERTAINMENT & CULTURE', 'ARCANE & MAGICAL', 'CRIMINAL ECONOMY',
  // Plot-hook source chips. 'NPC' is deliberately in this list and is deliberately NOT a
  // defect — see LADDER_WORDS.
  'NPC', 'CONFLICT', 'UNDERWORLD', 'CRISIS', 'TENSION', 'RELATIONSHIP', 'HISTORY',
  // The service-row status pill (`serviceComponents.jsx`), whose print twin
  // (`Services.jsx`) already spoke these words while the screen shouted them.
  'IMPAIRED', 'REDUCED',
]);

/**
 * EVERY WORD THIS LADDER GOVERNS THAT IS ACTUALLY SHOUTING — and the filter is the point.
 *
 * ⛔ AN INITIALISM IS NOT A SHOUT. `tokenCase('NPC')` is 'NPC': the ladder preserves it on
 * purpose, and an arm that convicted every all-caps leaf would red on the one word the
 * ladder exists to protect. So a vocabulary entry counts as shouting only where the ladder
 * would actually change it. This is computed rather than hand-maintained, so adding an
 * initialism to `labelCase.js` cannot leave a stale exception behind in this file.
 * @type {ReadonlyArray<string>}
 */
const LADDER_WORDS = Object.freeze(
  [...SHOUTED_STATUS_WORDS, ...SHOUTED_FIELD_NAMES].filter((w) => tokenCase(w) !== w),
);

/**
 * Every text leaf of a react-pdf element tree WITH THE CASE TRANSFORM THAT WILL BE APPLIED
 * TO IT, each chapter EXECUTED.
 *
 * ⛔ WHY THE TRANSFORM IS CARRIED AND NOT JUST THE TEXT. This lane's defect had two classes
 * and a plain leaf walk can only see one. `{r.label.toUpperCase()}` changes the STRING, so a
 * text-only walker catches it. `{r.label}` inside a style that carries
 * `textTransform: 'uppercase'` leaves the string alone and shouts at render time — invisible
 * to a walker that reads children and ignores styles, which is exactly how nine such sites
 * sat unnoticed under `type.label`. So the effective transform is threaded down the tree and
 * asserted beside the word.
 *
 * Transform INHERITS: react-pdf resolves it like CSS, so a nested Text under a transformed
 * parent is transformed too. `textTransform: 'none'` at a child cancels it, which is how
 * `StateProse` already overrides the `type.label` kicker.
 *
 * Deliberately NOT wrapped in a try: a chapter that throws must fail the arm that walked it,
 * never look like a chapter that printed nothing.
 *
 * @param {unknown} node
 * @param {string} inherited the transform in force at this depth
 * @param {Array<{ text: string, transform: string }>} [out]
 * @returns {Array<{ text: string, transform: string }>}
 */
function collectStyled(node, inherited = 'none', out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') {
    out.push({ text: String(node), transform: inherited });
    return out;
  }
  if (Array.isArray(node)) { for (const n of node) collectStyled(n, inherited, out); return out; }
  if (typeof node !== 'object') return out;
  const el = /** @type {{ type?: unknown, props?: Record<string, unknown> }} */ (node);
  if (typeof el.type === 'function') {
    return collectStyled(/** @type {(p: unknown) => unknown} */ (el.type)(el.props), inherited, out);
  }
  const next = transformOf(el.props?.style, inherited);
  return collectStyled(/** @type {{ children?: unknown }} */ (el.props ?? {}).children, next, out);
}

/**
 * The transform a style declares, or the inherited one. A react-pdf style may be a single
 * object or an array of them, and the LAST declaration wins.
 * @param {unknown} style
 * @param {string} inherited
 * @returns {string}
 */
function transformOf(style, inherited) {
  const parts = Array.isArray(style) ? style : [style];
  let out = inherited;
  for (const part of parts) {
    if (part && typeof part === 'object') {
      const t = /** @type {{ textTransform?: unknown }} */ (part).textTransform;
      if (typeof t === 'string') out = t;
    }
  }
  return out;
}

/** The word as the page will actually print it. */
function rendered(/** @type {{ text: string, transform: string }} */ leaf) {
  const t = leaf.text.trim();
  if (leaf.transform === 'uppercase') return t.toUpperCase();
  if (leaf.transform === 'lowercase') return t.toLowerCase();
  return t;
}

/**
 * Every visible leaf of a rendered SCREEN tree, WITH THE CASE TRANSFORM THAT WILL BE
 * PAINTED OVER IT.
 *
 * ⛔ WHY THE TRANSFORM IS CLIMBED AND `textContent` IS NOT TRUSTED ALONE. `text-transform`
 * is a PAINT-TIME effect: jsdom leaves `textContent` as the AUTHORED string, so a screen
 * element styled `textTransform:'uppercase'` around the word "Lodging" reports "Lodging"
 * while a DM sees "LODGING". An arm that read `textContent` alone would therefore call the
 * two surfaces equal at the exact moment they diverge — which is how the screen half of
 * this ladder stayed shouting after the print half had descended. The declaration is
 * INHERITED in CSS, so the nearest ancestor that declares one wins; these components style
 * inline, so `el.style.textTransform` is where it lives.
 *
 * @param {HTMLElement} root
 * @returns {Array<{ text: string, transform: string }>}
 */
function screenLeaves(root) {
  const out = [];
  for (const el of root.querySelectorAll('*')) {
    if (el.children.length > 0) continue;
    const text = (el.textContent || '').trim();
    if (!text) continue;
    let transform = 'none';
    for (let node = /** @type {HTMLElement|null} */ (el); node; node = node.parentElement) {
      const declared = node.style?.textTransform;
      if (declared) { transform = declared; break; }
      if (node === root) break;
    }
    out.push({ text, transform });
  }
  return out;
}

/** @type {Map<string, Record<string, unknown>>} */
const settlements = new Map();
/** @type {Map<string, Record<string, unknown>>} */
const viewModels = new Map();

beforeAll(() => {
  for (const [name, config, seed] of CASES) {
    const s = normalizeSettlement(generateSettlementPipeline(config, null, { seed, customContent: {} }));
    settlements.set(name, s);
    // ⛔ THE SYSTEM STATE IS SUPPLIED, AND THE ARM IS WORTHLESS WITHOUT IT. `buildViewModel`
    // defaults `systemState` to null and `SystemStateSnapshot` then renders its polite
    // "snapshot unavailable" shell — so a view model built without it walks a chapter with
    // no dimension cards in it, and every arm below passes on an absence. The screen strip
    // (`ReadSystemStateBar`) DERIVES the same four dimensions from the settlement when the
    // store has none, so deriving here is also what puts both surfaces on one input.
    viewModels.set(name, buildViewModel({
      settlement: s, phase: 'canon', eventLog: [], systemState: deriveSystemState(s),
    }));
  }
});
afterEach(cleanup);

/** The four print chapters this lane descended, executed against the real view model. */
function printLeaves(/** @type {string} */ town) {
  const settlement = settlements.get(town);
  const vm = viewModels.get(town);
  const props = { settlement, narrativeMode: false, vm, stateProse: null };
  return [
    ...collectStyled(SystemStateSnapshot({ settlement, narrativeMode: false, vm, causalDetail: true })),
    ...collectStyled(DefenseSecurity(props)),
    ...collectStyled(EconomicsTrade(props)),
    ...collectStyled(IdentityDailyLife(props)),
    // `SupplyChainFlow` is NOT called here on purpose: `EconomicsTrade:213` already mounts
    // it (behind `pdfVisualChains`), so it arrives through its real parent. Calling it
    // directly would need a hand-built `chains` prop and would prove less.
    ...collectStyled(Services(props)),
  ];
}

/** The screen surfaces that render the same vocabularies the four print chapters do. */
function screenText(/** @type {string} */ town) {
  const s = settlements.get(town);
  const out = [];
  for (const el of [
    <OverviewTab settlement={s} />,
    <DefenseTab settlement={s} />,
    <SubstrateTab settlement={s} />,
    <ReadSystemStateBar settlement={s} />,
    // The three surfaces car 3 descended, each mounted as OutputContainer mounts it.
    // EconomicsTab is what carries SupplyChainsPanel, so the need headers arrive the way
    // a DM meets them rather than through a hand-built prop bundle.
    <ServicesTab services={s.availableServices} settlement={s} />,
    <EconomicsTab economicState={s.economicState} settlement={s} />,
    <PlotHooksTab settlement={s} />,
    // The flag-off summary. It is behind `summaryMagazineV2`, but it is the surface that
    // proved leaf-equality alone is not enough: it interpolates a band word into a SENTENCE.
    <SummaryTab settlement={s} />,
  ]) {
    const { container } = render(el);
    out.push(...screenLeaves(container));
    cleanup();
  }
  return out;
}

describe('the paid document descends the same label ladder as the screen', () => {
  test('no band or status word reaches the page shouting, on every fixture town', () => {
    // ONE NAMED TEST LOOPING ITS ROWS, never a parameterised table: a file that parks on the
    // each-family credits NO titles to the lighting census, which made these pins
    // invisible to it. Every row and every assertion is unchanged, and each message
    // already names its town, so a failure still says which row broke.
    for (const [town] of CASES) {
      const leaves = printLeaves(town);
      // ANTI-VACUITY FIRST: an empty walk would pass every absence below.
      expect(leaves.length, 'the four chapters rendered no text at all, so absence proves nothing')
        .toBeGreaterThan(50);
      // AND THE BAND CHAPTER SPECIFICALLY LIT. `SystemStateSnapshot` has a polite
      // "snapshot unavailable" shell that renders when `vm.systemState` is null, and every
      // band assertion in this file would pass against it. The anchor is a word only the
      // REAL chapter prints, so this cannot pass on an empty page either.
      const words = leaves.map((leaf) => rendered(leaf));
      expectAbsentWithAnchor(
        words,
        'State snapshot unavailable for this settlement (load and re-save to populate).',
        'Resilience',
        `${town}: the state chapter rendered its empty shell, so the band arms are vacuous`,
      );

      // LEAF EQUALITY, NOT SUBSTRING. A status value is its own leaf; "CRITICAL
      // DEPENDENCIES" is a rung-1 eyebrow that legitimately keeps its capitals, and a
      // substring arm would convict it for containing the word CRITICAL.
      const shouting = leaves
        .map((leaf) => rendered(leaf))
        .filter((word) => LADDER_WORDS.includes(word));
      expect(
        [...new Set(shouting)],
        `${town}: the paid document shouts a status word the screen speaks`,
      ).toEqual([]);

      // AND THE ARM IS NOT PASSING ON A PAGE WITH NO STATUS WORDS ON IT AT ALL.
      const spoken = leaves
        .map((leaf) => rendered(leaf))
        .filter((word) => LADDER_WORDS.includes(word.toUpperCase()));
      expect(spoken.length, `${town}: no status word reached the page, so the arm is vacuous`)
        .toBeGreaterThan(0);
    }
  });

  test('every status word the screen prints, the print prints IDENTICALLY, on every fixture town', () => {
    // ONE NAMED TEST LOOPING ITS ROWS, never a parameterised table: a file that parks on the
    // each-family credits NO titles to the lighting census, which made these pins
    // invisible to it. Every row and every assertion is unchanged, and each message
    // already names its town, so a failure still says which row broke.
    for (const [town] of CASES) {
      const printed = printLeaves(town).map((leaf) => rendered(leaf));
      const screened = screenText(town).map((leaf) => rendered(leaf));
      expect(screened.length, 'the screen rendered nothing, so parity proves nothing')
        .toBeGreaterThan(50);

      /** A leaf that IS a status word, whatever its case, on either surface. */
      const statusOf = (/** @type {string[]} */ leaves) => new Set(
        leaves.filter((w) => LADDER_WORDS.includes(String(w).toUpperCase())),
      );
      const onScreen = statusOf(screened);
      const onPrint = statusOf(printed);

      // ANTI-VACUITY: the two surfaces must really share this vocabulary, or the
      // comparison below is a comparison of two empty sets.
      const shared = [...onScreen].filter((w) => [...onPrint]
        .some((p) => String(p).toUpperCase() === String(w).toUpperCase()));
      expect(shared.length, `${town}: no status vocabulary reached BOTH surfaces — the arm is vacuous`)
        .toBeGreaterThan(0);

      // CASE-SENSITIVE, deliberately. A case-insensitive compare is exactly the assertion
      // that passed all the way through the defect this file exists for.
      for (const word of shared) {
        expect(
          [...onPrint],
          `${town}: the screen prints "${word}" and the document prints it differently`,
        ).toContain(word);
      }
    }
  });


  test('a band word SMUGGLED INTO A SENTENCE is caught on both surfaces, on every fixture town', () => {
    // ONE NAMED TEST LOOPING ITS ROWS, never a parameterised table: a file that parks on the
    // each-family credits NO titles to the lighting census, which made these pins
    // invisible to it. Every row and every assertion is unchanged, and each message
    // already names its town, so a failure still says which row broke.
    for (const [town] of CASES) {
      // ⛔ WHY LEAF EQUALITY IS NOT ENOUGH. `SummaryTab` printed
      // `Systems average: ${scoreBand(defScore)}` — the frozen 'STRONG' interpolated into a
      // sentence, so NO leaf ever equalled it and every arm above walked straight past. A
      // shouted word hides just as well inside a template as it does behind a style.
      //
      // The rule is exact rather than a substring scan: a ladder word as a WHOLE WORD, in a
      // leaf that is LONGER than the word, whose element is NOT uppercasing. That last
      // clause is what spares rung 1 — an eyebrow like "CRITICAL DEPENDENCIES" is shouted BY
      // ITS STYLE and keeps its capitals lawfully, while a word that arrives already in
      // capitals inside ordinary-case text can only have come from the data.
      const offenders = [];
      for (const leaf of [...printLeaves(town), ...screenText(town)]) {
        if (leaf.transform === 'uppercase') continue;
        const text = leaf.text.trim();
        // ⛔ AND THE LEAF MUST BE A SENTENCE, NOT A SHOUT. A rung-1 eyebrow is sometimes
        // written as an ALL-CAPS LITERAL with no transform at all ("ACTIVE CRISIS"), and it
        // keeps its capitals by the ruling. What this arm is hunting is a capitalised word
        // sitting INSIDE ordinary-case text, where the caps can only have come from the
        // data — so the leaf has to carry a lower-case letter somewhere to qualify.
        if (!/[a-z]/.test(text)) continue;
        for (const word of LADDER_WORDS) {
          if (text === word) continue;
          if (new RegExp(`(^|[^A-Za-z])${word}([^A-Za-z]|$)`).test(text)) {
            offenders.push(`${word} in "${text.slice(0, 70)}"`);
          }
        }
      }
      expect([...new Set(offenders)],
        `${town}: a frozen band word reached a sentence in capitals`).toEqual([]);
    }
  });

  test('the frozen vocabularies are re-cased at the RENDER rung, never at the source', () => {
    // If someone "cures" the shout by editing the constant, the public projection and the
    // engine move with it. `scoreBand` must still shout; only the renderers may be quiet.
    expect(scoreBand(80), 'the frozen four stopped being frozen — the cure moved to the source')
      .toBe('STRONG');
    expect(scoreBand(10)).toBe('CRITICAL');
    // And the shared leaf both surfaces call is what makes them agree.
    expect(statusCase('STRONG')).toBe('Strong');
    expect(tokenCase('STANDING FORCES')).toBe('Standing forces');
    expect(tokenCase('NPC'), 'tokenCase stopped preserving initialisms').toBe('NPC');
  });

  test('the style rung is pinned too: a rung-2/3 word is never under an uppercase transform', () => {
    // THE SECOND DEFECT CLASS, held directly. `type.label` carries
    // `textTransform: 'uppercase'`; `type.label_plain` is its non-shouting sibling. A site
    // that regresses to `type.label` reds here even though its STRING never changed.
    const [town] = CASES[0];
    const leaves = printLeaves(town);
    const transformed = leaves.filter(
      (leaf) => leaf.transform === 'uppercase'
        && LADDER_WORDS.includes(leaf.text.trim().toUpperCase()),
    );
    expect(
      transformed.map((leaf) => leaf.text.trim()),
      'a status word sits under textTransform:uppercase — use type.label_plain',
    ).toEqual([]);

    // The walker really can see a transform, or the arm above is blind rather than clean.
    const anyUpper = leaves.filter((leaf) => leaf.transform === 'uppercase');
    expect(anyUpper.length, 'the walker saw no uppercase style at all — it is not reading styles')
      .toBeGreaterThan(0);
  });
});
