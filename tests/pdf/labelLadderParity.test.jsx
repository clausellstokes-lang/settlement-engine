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
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import React from 'react';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { statusCase, tokenCase } from '../../src/domain/display/labelCase.js';
import { viabilityVerdict } from '../../src/domain/display/viabilityVerdict.js';
import { scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

// ── THE PRINT SIDE ───────────────────────────────────────────────────────────────────
import { SystemStateSnapshot } from '../../src/pdf/sections/SystemStateSnapshot.jsx';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { EconomicsTrade } from '../../src/pdf/sections/EconomicsTrade.jsx';
import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';
import { Services } from '../../src/pdf/sections/Services.jsx';
// ── THE THREE PER-SITE SUBJECTS (car 5c) ─────────────────────────────────────────
// Each is addressed DIRECTLY rather than through the four-chapter walk above, because
// each carries one word at two different rungs and a by-word verdict cannot tell the
// rungs apart. See the describe block at the foot of this file.
import { ViabilityAssessment } from '../../src/pdf/sections/ViabilityAssessment.jsx';
import { SupplyChainFlow } from '../../src/pdf/sections/SupplyChainFlow.jsx';
import { Institutions } from '../../src/pdf/sections/Institutions.jsx';

// ── THE SCREEN SIDE, rendered as a DM sees it ────────────────────────────────────────
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import ReadSystemStateBar from '../../src/components/settlement/ReadSystemStateBar.jsx';
import ServicesTab from '../../src/components/new/tabs/ServicesTab.jsx';
import PlotHooksTab from '../../src/components/new/tabs/PlotHooksTab.jsx';
import SummaryTab from '../../src/components/new/SummaryTab.jsx';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { ViabilityTab } from '../../src/components/new/tabs/ViabilityTab.jsx';

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

/**
 * ⭐⭐ THE VIABILITY VERDICT READS ONE KEY (2026-09-19, the ODQ §934.9 lane's cure).
 *
 * `domain/display/viabilityVerdict.js` is the label ladder's single derivation for the
 * coherence word, lifted out of `ViabilityAssessment`'s private `verdictOf`. The lift
 * carried `verdict` / `verdictTone` branches with it, and MEASUREMENT killed them: over
 * 1,299 observed shapes a generated `economicViability` carries
 * ["dependencies","issues","metrics","plotHooks","suggestions","summary","viable","warnings"]
 * and nothing in `src/` writes either key onto that record, so 'Fragile' and 'Collapsing'
 * were unreachable on BOTH surfaces. The observed-shape ratchet convicted them as
 * reader-without-writer rows the moment the lift moved them into the scanned tree; the
 * doctrine is cure, not admit, so they are gone.
 *
 * THESE ARMS HOLD BOTH HALVES — what the module MAY READ, and what it MUST RETURN — because
 * either alone rots. A behaviour-only pin passes while a dead key creeps back in beside it;
 * a source-only pin passes while the mapping drifts.
 */
describe('the coherence verdict is derived from `viable` alone', () => {
  const SRC = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../../src/domain/display/viabilityVerdict.js'),
    'utf8',
  );
  /** The module's executable body: the docblocks NAME the retired keys on purpose. */
  const BODY = SRC.slice(SRC.indexOf('export function viabilityVerdict'));

  test('SOURCE: the module reads no key of its argument but `viable`', () => {
    // THE ANCHOR IS THE `viable` READ ITSELF. Without it this arm passes just as well on an
    // empty file, on a renamed export, or on a module that stopped reading its argument at
    // all — which is the exact vacuity `expectAbsentWithAnchor` exists to refuse.
    for (const dead of ['verdictTone', 'verdict']) {
      expectAbsentWithAnchor(
        BODY, dead, 'viable',
        `viabilityVerdict reads \`${dead}\` again — a key MEASURED to have no writer`,
      );
    }
    // And the read set is closed rather than merely missing those two: every `v?.<key>` in
    // the body names `viable`. A new dead key under a new name would red here.
    const read = [...BODY.matchAll(/\bv\?\.([A-Za-z_$][\w$]*)/g)].map((m) => m[1]);
    expect(read.length, 'the body reads nothing off its argument — the walker is blind')
      .toBeGreaterThan(0);
    expect([...new Set(read)]).toEqual(['viable']);
  });

  test('MAPPING: three states, and everything that is not a boolean is the third', () => {
    expect(viabilityVerdict({ viable: true })).toEqual({ tone: 'good', label: 'Viable', glyph: '✓' });
    expect(viabilityVerdict({ viable: false })).toEqual({ tone: 'bad', label: 'Not viable', glyph: '✗' });
    const third = { tone: 'warn', label: 'Uncertain', glyph: '' };
    // ⚠ THE RETIRED KEYS ARE PRESENT IN THESE THREE INPUTS ON PURPOSE. A slice carrying the
    // shapes `pdf/lib/viewModel.js` still synthesises must now be IGNORED, not obeyed — that
    // is what makes the deletion a behaviour pin and not just a source pin.
    expect(viabilityVerdict({ verdict: 'fragile' }), 'a dead token reached the label').toEqual(third);
    expect(viabilityVerdict({ verdict: 'collapsing' }), 'a dead token reached the label').toEqual(third);
    expect(viabilityVerdict({ verdictTone: 'muted' }), 'a dead tone reached the page').toEqual(third);
    for (const empty of [undefined, null, {}, { viable: null }, { viable: 'yes' }]) {
      expect(viabilityVerdict(empty)).toEqual(third);
    }
    // PARITY, WHICH IS THE WHOLE POINT OF THE LEAF: the print slice's synthesised verdict
    // keys are derived from `viable`, so a slice and the raw record agree state for state.
    for (const viable of [true, false, undefined]) {
      const slice = {
        viable,
        verdict: viable === true ? 'viable' : viable === false ? 'notViable' : null,
        verdictTone: viable === true ? 'good' : viable === false ? 'bad' : 'muted',
      };
      expect(viabilityVerdict(slice), `the page and the tab disagree at viable=${viable}`)
        .toEqual(viabilityVerdict({ viable }));
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════════
// CAR 5c — THE THREE ARMS THAT A BY-WORD VERDICT CANNOT REACH
//
// Every arm above judges a leaf BY ITS WORD: it collects the page's text and asks
// whether a frozen vocabulary entry arrived shouting. That is the right question for a
// word that means one thing wherever it lands, and the wrong question for a word the
// dossier uses at TWO DIFFERENT RUNGS — because the vocabulary arm sees only the word
// and would convict the rung that is lawfully capitalised. The deferral recorded at
// SHOUTED_FIELD_NAMES ("resolving this one needs a structural handle on the group
// header") is exactly that shape, and the estate's recorded answer to it is to address
// the ELEMENT rather than to disambiguate by case.
//
// So these three call their subject DIRECTLY and judge PER SITE. Nothing here is added
// to `printLeaves`: the by-word walk keeps its own scope, and these sit beside it.
// ═══════════════════════════════════════════════════════════════════════════════════

/**
 * THE VERDICT VOCABULARY, TRANSCRIBED rather than imported — the same reason
 * SHOUTED_STATUS_WORDS is transcribed. These are the five labels
 * `domain/display/viabilityVerdict.js` can return (its four named branches plus the
 * `tokenCase` fallback, which reads 'Uncertain' for a settlement with no verdict at
 * all). An arm that imported the labels would agree with the module whatever it said,
 * and the point here is what the two SURFACES print.
 * @type {ReadonlyArray<string>}
 */
const VERDICT_WORDS = Object.freeze(['Viable', 'Not viable', 'Fragile', 'Collapsing', 'Uncertain']);

/**
 * A leaf with any leading NON-LETTER run stripped: the screen's verdict heading prints
 * the glyph and the word in ONE element ("✓ Viable"), so `textContent` carries both and
 * a bare equality against the print side would fail on the tick rather than on the word.
 * The glyph is deliberately NOT shared between the surfaces — `viabilityVerdict`'s
 * docblock keeps the glyph and the colour local to each surface and shares only the WORD
 * and the judgement — so stripping it is what puts the comparison on the shared thing.
 * @param {unknown} text
 * @returns {string}
 */
const wordOf = (text) => String(text).trim().replace(/^[^A-Za-z]+/, '').trim();

/** Case-insensitive membership of the verdict vocabulary — the CASE is what is judged. */
const isVerdict = (word) => VERDICT_WORDS.some((w) => w.toUpperCase() === String(word).toUpperCase());

/** How many leaves printed exactly this word. Cardinality is how two rungs are told apart. */
const countOf = (words, needle) => words.filter((w) => w === needle).length;

describe('one fact, two surfaces, two rungs — the per-site arms', () => {
  test('the coherence verdict is the SAME WORD in the same case on screen and in print, on every fixture town', () => {
    // ONE NAMED TEST LOOPING ITS ROWS, never a parameterised table — the each-family
    // park is frozen and a file that parks on it credits NO titles to the lighting census.
    //
    // ⛔ WHY THIS NEEDED AN ARM OF ITS OWN. The verdict used to have TWO VOCABULARIES for
    // one derived fact: the tab forked inline on `viable` and printed '✗ NOT COHERENT' /
    // '✓ COHERENT' / 'MARGINAL COHERENCE', while the paid page ran its own private
    // `verdictOf()` and printed 'Viable' / 'Not Viable' / 'Fragile' / 'Collapsing'. That is
    // not a case divergence the arms above could ever have caught — neither spelling is in
    // any frozen band vocabulary, so no by-word walk was ever looking at them. The cure was
    // `domain/display/viabilityVerdict.js`, one derivation both surfaces read; this is the
    // arm that says the two surfaces still speak it.
    //
    // ⛔ AND IT READS NEITHER `verdict` NOR `verdictTone`. Both fields are on their way out
    // of the derivation, so an arm that pinned them would have to be rewritten the day that
    // lands. What is asserted is only what each surface PRINTS, which is the contract.
    for (const [town] of CASES) {
      const settlement = settlements.get(town);
      const vm = viewModels.get(town);

      const printed = collectStyled(
        ViabilityAssessment({ settlement, narrativeMode: false, vm, stateProse: null }),
      ).map((leaf) => rendered(leaf));

      const { container } = render(<ViabilityTab settlement={settlement} />);
      const screened = screenLeaves(container).map((leaf) => rendered(leaf));
      cleanup();

      // ── ANTI-VACUITY, BOTH SURFACES ──────────────────────────────────────────────
      // The chapter has a polite shell for a settlement it cannot assess, and the tab has
      // an `Empty` early return for a settlement with no `economicViability` at all —
      // every assertion below would pass against either. The Callout's kicker is printed
      // only by the REAL verdict callout, and the tab's own caption only by the real tab.
      expect(printed, `${town}: the viability chapter printed no verdict callout at all`)
        .toContain('VERDICT');
      expect(
        screened.some((w) => w.startsWith('This tab checks whether your settlement makes')),
        `${town}: the viability tab rendered its empty state, so the parity below is vacuous`,
      ).toBe(true);

      // ── THE WORD, FOUND INDEPENDENTLY ON EACH SURFACE ────────────────────────────
      // Each side is searched by the VOCABULARY, not by asking the shared module what to
      // look for. Re-deriving the label and then hunting for it would agree with itself
      // whatever the two renderers did, which is the tautology this file exists to refuse.
      const printVerdicts = [...new Set(printed.filter((w) => isVerdict(wordOf(w))).map(wordOf))];
      const screenVerdicts = [...new Set(screened.filter((w) => isVerdict(wordOf(w))).map(wordOf))];

      expect(printVerdicts.length, `${town}: no verdict word reached the paid page`)
        .toBeGreaterThan(0);
      expect(screenVerdicts.length, `${town}: no verdict word reached the screen`)
        .toBeGreaterThan(0);

      // ONE READING PER SURFACE. Two distinct spellings on one surface is already the
      // defect — 'Viable' beside 'VIABLE' would mean a second, un-descended render site.
      expect(printVerdicts, `${town}: the paid page prints the verdict in more than one spelling`)
        .toHaveLength(1);
      expect(screenVerdicts, `${town}: the screen prints the verdict in more than one spelling`)
        .toHaveLength(1);

      // ── AND THE TWO SPELLINGS ARE ONE SPELLING, CHARACTER FOR CHARACTER ──────────
      // Case-sensitive, deliberately: a case-insensitive compare is the assertion that
      // would have passed all the way through the defect this file exists for.
      expect(
        printVerdicts[0],
        `${town}: the screen reads "${screenVerdicts[0]}" and the document the DM paid for`
        + ` reads "${printVerdicts[0]}" — one derived fact, two words`,
      ).toBe(screenVerdicts[0]);
    }
  });

  test('FOOD SECURITY is two words at two rungs, and each site is judged on its own', () => {
    // ⛔ THE CLASS, AND WHY THE VOCABULARY ARM ABOVE HAD TO DEFER IT. The dossier says
    // "food security" twice in one chapter, and both are correct:
    //   RUNG 1  EconomicsTrade's CHAPTER EYEBROW — a section heading, shouted by the
    //           ruling, and shouted by its STYLE (`type.label` carries the transform).
    //   RUNG 2  SupplyChainFlow's chain-group HEADER — a field name, sentence case
    //           through `tokenCase`, on `type.label_plain` which declares no transform.
    // A by-word arm sees only the string, so admitting 'FOOD SECURITY' to the frozen
    // vocabulary would convict the eyebrow for being right. The two are separated here by
    // ELEMENT instead, which is the estate's recorded answer to exactly this shape.
    const [town] = CASES[0];
    const settlement = settlements.get(town);
    const vm = viewModels.get(town);

    // ── RUNG 2: the group header, called directly with a synthetic chain ─────────
    // Direct, and with a hand-built chain, because grouping only happens at town+ and only
    // when a chain actually carries this needKey — a fixture that happened not to forge a
    // food chain would make the whole arm pass on an absence. `needLabel` is transcribed
    // from `data/supplyChainData.js`, which declares it 'Food Security'.
    const chainLeaves = collectStyled(SupplyChainFlow({
      chains: [{
        chainId: 'ladder-food-chain',
        needKey: 'food_security',
        needLabel: 'Food Security',
        status: 'running',
        resource: 'Grain',
        processingInstitutions: [],
        outputs: ['Bread'],
      }],
      instNames: [],
      primaryExports: [],
      tier: 'town',
    }));
    const chainWords = chainLeaves.map((leaf) => rendered(leaf));
    expect(chainWords.length, 'the chain flow rendered nothing, so the rung-2 arm is vacuous')
      .toBeGreaterThan(4);
    expect(
      chainWords,
      'the chain group header stopped speaking its need label — rung 2 is a FIELD NAME and'
      + ' reads "Food security", not "FOOD SECURITY" and not the raw needKey',
    ).toContain('Food security');
    // …and it is quiet by its STYLE too, not merely by the string it was handed. A
    // regression to `type.label` would leave this word untouched and still shout it.
    const headerLeaf = chainLeaves.find((leaf) => rendered(leaf) === 'Food security');
    expect(headerLeaf.transform, 'the group header sits under an uppercase transform again')
      .not.toBe('uppercase');

    // ── RUNG 1: the chapter eyebrow, from the real chapter ──────────────────────
    const econWords = collectStyled(
      EconomicsTrade({ settlement, narrativeMode: false, vm, stateProse: null }),
    ).map((leaf) => rendered(leaf));
    expect(econWords.length, 'the economics chapter rendered no text at all').toBeGreaterThan(30);
    expect(
      econWords,
      'the FOOD SECURITY chapter eyebrow lost its capitals — rung 1 is a SECTION heading and'
      + ' keeps them by the ruling; it is not the same element as the chain group header',
    ).toContain('FOOD SECURITY');

    // ── THE TWO RUNGS ARE IN THE SAME CHAPTER AND STILL DISAGREE LAWFULLY ───────
    // EconomicsTrade mounts SupplyChainFlow behind `pdfVisualChains`, so on this one page a
    // DM reads the eyebrow shouting and the group header speaking. That is the whole reason
    // a word-level verdict is the wrong instrument here, executed rather than asserted.
    expect(
      econWords.filter((w) => w === 'FOOD SECURITY').length,
      'the chapter lost its eyebrow',
    ).toBe(1);
    expect(
      econWords.filter((w) => w === 'Food security').length,
      'the chain group header no longer reaches the page through its real parent — the two'
      + ' rungs must BOTH be live for this arm to be proving anything',
    ).toBeGreaterThan(0);

    // ── AND THE BY-WORD VOCABULARY STILL CANNOT REACH EITHER OF THEM ────────────
    // The frozen roster must keep refusing these two words, or the arms at the head of this
    // file would start convicting the lawful eyebrow the moment someone "completed" the
    // need-label list. Anchored on a SIBLING from the same declaration site: the other nine
    // need labels do carry the pin, and they travel the identical path.
    expectAbsentWithAnchor(
      LADDER_WORDS,
      'FOOD SECURITY',
      'RAW MATERIALS & FUEL',
      'the need-label roster admitted FOOD SECURITY, which convicts the rung-1 eyebrow',
    );
  });

  test('the institutions chapter says IMPAIRED, REDUCED and VULNERABLE at three registers, each correct', () => {
    // ⛔ THE SAME CLASS, ONE CHAPTER WIDE. `Institutions` prints these words three ways:
    //   RUNG 2  the StatStrip COUNT COLUMNS — 'Impaired' / 'Degraded' / 'Vulnerable' are
    //           the NAMES of the figures beneath them, sentence case on `type.label_plain`.
    //   RUNG 3  the card's STATUS PILL (Institutions.jsx:~213) — `cap(status)` on
    //           `type.pill`, which declares no transform.
    //   COUNT   the category header's tags — "1 impaired", "1 reduced", "1 vulnerable",
    //           lower case inside a phrase. REDUCED lives ONLY here: it is the display
    //           rename of the `degraded` count, which the StatStrip column still calls
    //           'Degraded'. The two are different facts wearing one number.
    // Rungs 2 and 3 print the SAME STRING, so no by-word verdict can separate them. They
    // are separated here by SITE and by CARDINALITY instead.
    const [town] = CASES[1];
    const settlement = settlements.get(town);
    const vm = viewModels.get(town);

    /**
     * The chapter over a hand-built services slice. The fixture towns forge institutions
     * that are uniformly healthy, and the status pill is gated on `status !== 'healthy'` —
     * so on a real view model rung 3 NEVER RENDERS and every assertion about it would pass
     * on an absence. The statuses are transcribed from the chapter's own STATUS_TONE map.
     */
    const chapter = (statuses) => collectStyled(Institutions({
      settlement,
      narrativeMode: false,
      vm: {
        ...vm,
        entityIndex: undefined,
        services: {
          totals: { total: statuses.length, impaired: 1, degraded: 1, vulnerable: 1 },
          detailed: statuses.map((status, i) => ({
            id: `ladder-inst-${i}`, name: `House ${i + 1}`, category: 'economy', status,
          })),
        },
      },
    }));

    // ── PASS A: the rungs made TELLABLE APART, so each can be pinned alone ───────
    // The pill words here are chosen NOT to collide with any StatStrip column name, so a
    // leaf bearing one can only have come from rung 3, and a leaf bearing a column name can
    // only have come from rung 2. The category tally is all-healthy-or-other, so the count
    // tags stay silent and do not muddy the cardinalities.
    const apart = chapter(['critical', 'productive', 'stable', 'healthy']);
    const apartWords = apart.map((leaf) => rendered(leaf));

    expect(apartWords.length, 'the institutions chapter rendered no text at all')
      .toBeGreaterThan(20);
    // RUNG 2, alone: the count columns, once each, as words.
    for (const column of ['Impaired', 'Degraded', 'Vulnerable']) {
      expect(
        countOf(apartWords, column),
        `the StatStrip count column "${column}" is not printing exactly once as a field name`,
      ).toBe(1);
      const leaf = apart.find((l) => rendered(l) === column);
      expect(leaf.transform, `the count column "${column}" is shouting again`).not.toBe('uppercase');
    }
    // RUNG 3, alone: the status pill, once per non-healthy card, through `cap`.
    for (const pill of ['Critical', 'Productive', 'Stable']) {
      expect(
        countOf(apartWords, pill),
        `the card status pill "${pill}" is not printing exactly once as a status value`,
      ).toBe(1);
      const leaf = apart.find((l) => rendered(l) === pill);
      expect(leaf.transform, `the status pill "${pill}" is shouting again`).not.toBe('uppercase');
    }
    // The healthy card is gated out, so the pill really is per-status and not per-card.
    expect(countOf(apartWords, 'Healthy'), 'a healthy card grew a status pill').toBe(0);

    // ── PASS B: THE OVERLAP — the same word at two rungs, which is the whole point ──
    const both = chapter(['impaired', 'degraded', 'vulnerable', 'healthy']);
    const bothWords = both.map((leaf) => rendered(leaf));

    for (const word of ['Impaired', 'Degraded', 'Vulnerable']) {
      expect(
        countOf(bothWords, word),
        `"${word}" should reach this page TWICE — once as a StatStrip count column (rung 2)`
        + ' and once as a card status pill (rung 3). A by-word walker sees one string and'
        + ' cannot tell which is which, which is why both are pinned by site here.',
      ).toBe(2);
    }
    // THE COUNT REGISTER, and REDUCED's only home. 'Degraded' names the column; the tag
    // beside it renames the same number 'reduced' for a reader, in lower case inside a
    // phrase. Both spellings are deliberate and neither is the other's drift.
    for (const tag of ['impaired', 'reduced', 'vulnerable']) {
      expect(
        countOf(bothWords, tag),
        `the category header's "${tag}" count tag is gone — REDUCED in particular lives`
        + ' nowhere else in this chapter, so losing it loses the word entirely',
      ).toBe(1);
    }
    expect(
      countOf(bothWords, 'Reduced'),
      'REDUCED grew a second, sentence-case register — it is a count tag, not a column name',
    ).toBe(0);

    // ── SO THE BY-WORD WALKER COULD JOIN, AND WOULD CONVICT NOTHING ─────────────
    // The roster DOES carry all three words in their shouted form, so a site that regressed
    // to capitals here would be caught the moment this chapter joined `printLeaves`. What
    // the per-site arms above add is the reason none of the live sites is a regression.
    for (const word of ['IMPAIRED', 'REDUCED', 'VULNERABLE']) {
      expect(
        LADDER_WORDS,
        `the frozen roster dropped "${word}" — the arms above would stop catching a shout`,
      ).toContain(word);
    }
    const shouting = [...new Set(bothWords.filter((w) => LADDER_WORDS.includes(w)))];
    expect(
      shouting,
      'the institutions chapter shouts a word the ladder descended — every register above'
      + ' is sentence case or lower case, so this list is the by-word verdict and it is empty',
    ).toEqual([]);
  });
});
