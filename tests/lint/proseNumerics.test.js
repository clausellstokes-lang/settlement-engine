/**
 * Review addendum A-1 — prose-numerics class-kill + legacy ratchet.
 *
 * Reader prose may name quantities in world words, bands, and honest whole
 * counts. It may not expose the engine's float/scalar notation. This scanner
 * covers authored headline/summary/reason/receipt templates in JavaScript under
 * src and
 * the full E-E JSX corpus. Its four detector classes are independently mutant-
 * proven below; live debt is frozen by exact path + line + snippet identity in
 * .prose-numerics-baseline.json and may only shrink.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { scanProseNumericsSource } from '../helpers/proseNumericsWalk.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE_PATH = join(ROOT, 'tests/lint/.prose-numerics-baseline.json');
// CW-0w slice 4 admits the FIFTH detector class with its own ceiling. The four
// above are untouched: the push-indirection walk defers to them, so a leak they
// already see keeps its own category and only what escaped every named prose
// surface becomes a pushIndirection row. Measured at landing: exactly 3, all
// three in relationshipMemory.js's postureReasons, which the scanner had never
// seen at all.
//
// CR-FP-2 — THE ONE RULED RE-RECORD (FP cycle 1 close). 404 -> 413.
//
// This is a DELIBERATE upward move of three ceilings, recorded here because the
// rule elsewhere in this file is that ceilings only fall. It was ruled once, for
// a ratchet that had been RED AT BASE since the war lane, and the measurement
// behind it is this:
//
//   - The instrument is byte-identical to the one that recorded the 404 census
//     (tests/helpers/proseNumericsWalk.js, unchanged since e30770bd). Running it
//     against the e30770bd tree yields 413, not 404: the slice-4 commit banked a
//     baseline its own scanner already disagreed with by nine rows. The
//     PRE-slice-4 walker against that same tree yields 410 — the identical nine
//     rows, minus the three pushIndirection finds. So the gap is NOT instrument
//     reach; slice 4's reach was fully absorbed at 401 -> 404.
//   - The nine rows are war-lane prose authored between WR-2 and CW-0w, which
//     nobody re-recorded: conquestFeasibility.js (WR-8 slice 1, e8354fb9),
//     occupation.js x2 sentences (W8-C slice 3, ab71f940), razing.js (WR-8
//     slice 4, bf731ea6) — four REAL reader-prose float leaks — plus three rows
//     on receipt-SHAPED ledger fields that are not prose at all (the `receipt:`
//     key and the `receiptTick` name pull `Math.floor` ids and integer ticks
//     into the walk: warCoalitionExpenditure.js x2, warCostsNews.js x1).
//   - Everything else that moved is address rot, not debt: 88 pure line moves
//     and 13 WR-7b decomposition relocations (peaceTerms.js ->
//     peaceTermsDrafting.js x6, warDeployment.js -> warHomeCosts.js x6 and
//     warSiegeVerdict.js x1). This discharges SOL-BANK-2's parked line-drift
//     red, whose "line-location drift CONFIRMED, whole-baseline equivalence
//     PLAUSIBLE" is now measured on both counts.
//   - FP cycle 1 authored ZERO prose numerics. Between e30770bd and this
//     commit the live hit set changed by exactly four rows, all four the same
//     two tradeWar.js sentences at shifted line addresses after TR-1's seam.
//
// FOUR SENTENCES ARE THEREFORE FROZEN AS UN-HUMANIZED DEBT, not as clean rows.
// They are owed a humanization wave and are named above so the debt cannot be
// lost in the count. Ceilings are pinned to the EXACT live census rather than
// rounded up, so the next leak of any class is red on arrival.
// HK-1 (ODQ §445.3) — SIX PURE LINE MOVES, NO DEBT MOTION. The clandestine-facet cure adds
// eleven lines to institutionLifecycle.js above its prose block, so the six rows that file
// owns re-address 764 -> 775, 832 -> 843 and 833 -> 844. This is the ADDRESS-ROT shape the
// CR-FP-2 note above already names ("88 pure line moves"), and it is re-addressed rather
// than regenerated or deleted: path, category and snippet are byte-identical on all six,
// the census stays at 413 against a 413 ceiling, and no other row in the file moved (the
// whole diff is twelve lines, six -/+ pairs). No prose numeric was authored by that member.
// TE-CH-4 (ODQ §555) — ONE PURE LINE MOVE, NO DEBT MOTION. The district-profile registry car
// inserts the QUARTER_CATEGORY table, the canonical-routing preference lists and their
// rationale above districtProfile.js's prose block, so the single row that file owns
// re-addresses 238 -> 373. Same shape as CR-FP-2's "88 pure line moves" and HK-1's six above:
// path, category and snippet are byte-identical, the census stays at 413 against a 413
// ceiling, and districtProfile.js owns no other row that could have moved with it.
// ⚠ The car's added COMMENTS are dense with measured figures ("168 of 168", 3,038 factions,
// a 504-settlement corpus). None of them is debt and none is in this baseline: the detector
// reads numerics that FLOW INTO A PROSE KEY, not numbers written in comments. Humanizing
// them would have removed reviewable evidence to satisfy an instrument that never saw it.
// ── LOWERED 2026-08-29 BY TE-STRIP-1 (owner ruling, ODQ §725) ─────────────────────
// 413 → 408, floatInterpolation 236 → 233, percentToken 79 → 77. THE CAUSE IS TWO DELETED
// FILES and nothing else: src/components/townMap/scene3d/TownSceneInspector.jsx (3 rows —
// the severity-permille readouts) and TownSceneViewerControls.jsx (2 rows — the effective-
// percent readout) left with the legacy settlement map's UI. EVERY REMOVED ROW WAS REVIEWED
// against the diff, as this ratchet's own message demands; the only other baseline movement
// is two pure LINE re-addresses (OutputContainer.jsx 983→966, LandingArtifacts.jsx 187→185)
// where path, category and snippet are byte-identical and the shrink came from lines this
// lane deleted above them. multiplier/twoDecimalScore/pushIndirection are untouched.
// ⛔ THE CEILINGS HAD TO COME DOWN WITH THE BASELINE, AND THE GATE PROVED IT. Leaving them
// at 413/236 was tried first: the '+1 leak' control below reds, because with live at 408 a
// planted leak lands at 409 — comfortably UNDER a stale 413 — so the control that exists to
// prove a regenerated baseline cannot launder a leak would itself have gone vacuous. A
// shrink here is not optional bookkeeping; the ceiling IS the control's teeth.
// TE-CAP (WEAVE W-CAP CAP-3, ODQ §758) — TWO PURE LINE MOVES, NO DEBT MOTION, NO CEILING
// CHANGE. The climate-band car adds the `amplitudeByClimate` table, the `climateBandFor`
// reader and their rationale ABOVE seasons.js's prose block, so the two rows that file owns
// — one `floatInterpolation`, one `percentToken`, both on the same hungry-gap reason line —
// re-address 252 -> 318. Same shape as CR-FP-2's "88 pure line moves", HK-1's six and
// TE-CH-4's one above: path, category and snippet are byte-identical on both, the census
// stays at 408 against a 408 ceiling, and seasons.js owns no other row that could have moved
// with them. The whole baseline diff is four lines, two -/+ pairs.
// ⚠ The car's added comments carry measured figures of their own (band cuts −5/25/8/5/4/10,
// amplitudes 38/30/22). None is debt and none is in this baseline: the detector reads
// numerics that FLOW INTO A PROSE KEY, not numbers written in comments — the same
// distinction TE-CH-4's note above had to draw.
// ══ LOWERED BY TE-HERALD-1, THE HUMANIZATION WAVE (owner directive, ODQ §754.3;
//    boundary ruled §763.2) ═══════════════════════════════════════════════════════
// This is the wave the four sentences frozen above were "owed". The debt named in the
// CR-FP-2 note — "FROZEN AS UN-HUMANIZED DEBT, not as clean rows… owed a humanization
// wave" — is being PAID, not re-addressed: the reader prose at each cured site now
// carries the fact the arithmetic used, in world words, and the row leaves this census
// because the leak is gone rather than because it moved.
//
// THE RULED BOUNDARY, so a later reader can tell a cure from an over-cure: honest
// concrete counts in world words STAY and are census-legitimate ("stores below half a
// month", "for three years", a formatCount of survivors). What dies is the ABSTRACT
// ENGINE SCALAR — ratios, probabilities, rolls, indices, percentages of an invisible
// quantity, and `toFixed` anything. No row here was cleared by deleting information:
// each was TRANSLATED, and where the scalar had no world meaning to translate (a roll
// that was never drawn) that is recorded at the site.
//
// EVERY REMOVED ROW WAS REVIEWED AGAINST THE DIFF, as this ratchet's own message
// demands, and each car below reports its own count. No row moved by ADDRESS ROT in
// this wave: the removals are exact-sentence removals and the ADDED count is zero at
// every car, which is asserted by the regeneration report rather than argued.
//
//   car HER-1 (the war verdicts)  408 -> 381  (-27, ADDED 0). Five files, ten sentences:
//     deploymentReturn.js :211/:369/:405/:471 (the returning host's muster share, its
//     success probability, its roll, the coup verdict's hold chance) · warDeployment.js
//     :814/:815/:1190/:1195/:1201 (both siege capacities, the feasibility ratio, the fall
//     chance and its roll, the sizing and deployed-quality multipliers, the casus score)
//     · feasibilityGate.js :197 (the capacity ratio) · warSiegeVerdict.js :230 (the two
//     auto-resolve capacities) · conquestFeasibility.js :417 (the bargaining range's two
//     belief reads). float 233->221, percent 77->73, twoDecimal 71->62, multiplier
//     24->22. pushIndirection untouched.
//     ⚠ ONE ROW WAS AUTHORED AND THEN REMOVED WITHIN THIS CAR, and the lesson is worth
//     more than the row: the first draft of warDeployment's sizing sentence interpolated
//     `seededRec.sizingBias > 1 ? 'over' : 'under'` — a BOOLEAN — and the census counted
//     it, correctly. The detector reads a scalar's NAME inside an interpolation, not the
//     type the expression evaluates to, and that is the right rule: the cure is to decide
//     in code and interpolate WORDS. The regeneration report showed ADDED 1 and the
//     sentence was restructured before anything was banked.
//   car HER-2 (the occupations)  381 -> 365  (-16, ADDED 0). occupation.js :767/:950/
//     :1021/:1118/:1120/:1171/:1173 (the resistance scalar at four sites, the occupation
//     burden, the occupier benefit against its own hard cap, the relief, and the inherited
//     hunger twice) · occupationRecordMode.js :195 (a benefit falling "to 0.00").
//     float 221->213, twoDecimal 62->54. percent and multiplier untouched.
//   car HER-3 (the relationships)  365 -> 338  (-27, ADDED 0). relationshipRulesCore.js
//     :63/:82/:260/:745/:780/:781 · relationshipRulesAdversarial.js :90/:200/:401/:608/:650
//     · relationshipMemory.js :300/:301/:302. Every one of these was a bare readout appended
//     to a reason line that ALREADY said the same thing in world words, which is why the
//     translation reads as an improvement rather than a loss.
//     float 213->201, twoDecimal 54->42.
//     ⛔ pushIndirection FALLS TO ZERO, and the ceiling falls with it. All three rows of
//     that class lived in relationshipMemory's `postureReasons`, and all three were GATED
//     above a threshold (`resentment > 0.5`, `trust > 0.65`, `dependency > 0.6`) — so the
//     word "High" in each sentence was already the honest band and the float only repeated
//     it. The class is NOT deleted and its detector is NOT weakened: the four executed
//     pushIndirection mutants above still prove the walk, and the ceiling of 0 means the
//     next wrapped-return leak is red on arrival rather than absorbed into a stale budget
//     of three. That is the same argument TE-STRIP-1's note makes about a ceiling being the
//     control's teeth, at its limit.
const REVIEWED_TOTAL_CEILING = 338;
const REVIEWED_CATEGORY_CEILINGS = Object.freeze({
  floatInterpolation: 201,
  percentToken: 73,
  multiplier: 22,
  twoDecimalScore: 42,
  pushIndirection: 0,
});

function walkSourceFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walkSourceFiles(abs, out);
    else if (/\.(?:js|jsx)$/.test(entry)) out.push(abs);
  }
  return out;
}

function scanLiveTree() {
  const hits = [];
  const parseErrors = [];
  for (const abs of walkSourceFiles(join(ROOT, 'src')).sort()) {
    const path = relative(ROOT, abs).replace(/\\/g, '/');
    const result = scanProseNumericsSource({ source: readFileSync(abs, 'utf8'), path });
    hits.push(...result.hits);
    if (result.parseError) parseErrors.push(`${path}: ${result.parseError}`);
  }
  return { hits, parseErrors };
}

function ceilingViolations(hits) {
  const counts = Object.fromEntries(
    Object.keys(REVIEWED_CATEGORY_CEILINGS).map((category) => [category, 0]),
  );
  const unknownCategories = new Set();

  for (const hit of hits) {
    if (Object.prototype.hasOwnProperty.call(counts, hit.category)) {
      counts[hit.category] += 1;
    } else {
      unknownCategories.add(String(hit.category));
    }
  }

  const violations = [];
  if (hits.length > REVIEWED_TOTAL_CEILING) {
    violations.push(`total ${hits.length} exceeds reviewed ceiling ${REVIEWED_TOTAL_CEILING}`);
  }
  for (const [category, ceiling] of Object.entries(REVIEWED_CATEGORY_CEILINGS)) {
    if (counts[category] > ceiling) {
      violations.push(`${category} ${counts[category]} exceeds reviewed ceiling ${ceiling}`);
    }
  }
  for (const category of [...unknownCategories].sort()) {
    violations.push(`unknown detector category ${category} has no reviewed ceiling`);
  }
  return violations;
}

const LIVE = scanLiveTree();

describe('prose numerics detector discriminates (executed mutants)', () => {
  const cases = [
    {
      category: 'floatInterpolation',
      clean: "export const beat = { headline: 'The levy gathers.' };",
      mutant: 'export const beat = { headline: `The levy gathers at pressure ${pressure}.` };',
    },
    {
      category: 'percentToken',
      clean: "export const beat = { summary: 'The levy loses nearly half its strength.' };",
      mutant: 'export const beat = { summary: `The levy loses ${Math.round(loss * 100)}% of its strength.` };',
    },
    {
      category: 'multiplier',
      clean: "export const beat = { reasons: ['The levy outmatches the watch.'] };",
      mutant: 'export const beat = { reasons: [`The levy stands at ${depth}× the watch.`] };',
    },
    {
      category: 'twoDecimalScore',
      clean: "export const beat = { reason: 'The court believes the road unsafe.' };",
      mutant: 'export const beat = { reason: `The court reads danger ${score.toFixed(2)}.` };',
    },
  ];

  it.each(cases)('$category: the clean control stays quiet and the mutant is caught', ({ category, clean, mutant }) => {
    expect(scanProseNumericsSource({ source: clean, path: 'src/control.js' }).hits).toEqual([]);
    const found = scanProseNumericsSource({ source: mutant, path: 'src/mutant.js' }).hits;
    expect(found.map((hit) => hit.category)).toContain(category);
  });

  it('allows whole world counts and dates rather than banning all numbers', () => {
    const clean = 'export const beat = { summary: `${wagons} wagons arrived over ${years} years.` };';
    expect(scanProseNumericsSource({ source: clean, path: 'src/counts.js' }).hits).toEqual([]);
  });

  it('catches scalar concatenation as the same leak class as template interpolation', () => {
    const mutant = "export const beat = { headline: 'The court reads danger ' + score + '.' };";
    const found = scanProseNumericsSource({ source: mutant, path: 'src/concat-mutant.js' }).hits;
    expect(found.map((hit) => hit.category)).toContain('floatInterpolation');
  });

  it('follows one unique local binding when it flows into a prose key', () => {
    const mutant = [
      'const opaqueBody = `The court reads danger ${score.toFixed(2)}.`;',
      'export const beat = { headline: opaqueBody };',
    ].join('\n');
    const found = scanProseNumericsSource({ source: mutant, path: 'src/binding-mutant.js' }).hits;
    expect(found.map((hit) => hit.category)).toEqual(['floatInterpolation', 'twoDecimalScore']);
  });

  it('follows a direct local function return when the call flows into a prose key', () => {
    const mutant = [
      'function opaqueComposer() { return `The levy roll was ${roll.toFixed(2)}.`; }',
      'export const beat = { summary: opaqueComposer() };',
    ].join('\n');
    const found = scanProseNumericsSource({ source: mutant, path: 'src/return-mutant.js' }).hits;
    expect(found.map((hit) => hit.category)).toEqual(['floatInterpolation', 'twoDecimalScore']);
  });

  it('follows push arguments on a flowed local sentence array', () => {
    const mutant = [
      'const parts = [];',
      'parts.push(`The levy chance was ${chance.toFixed(2)}.`);',
      'export const beat = { reasons: parts };',
    ].join('\n');
    const found = scanProseNumericsSource({ source: mutant, path: 'src/push-mutant.js' }).hits;
    expect(found.map((hit) => hit.category)).toEqual(['floatInterpolation', 'twoDecimalScore']);
  });

  it('does not guess through reassigned, imported, or second-hop opaque values', () => {
    const clean = [
      "import { externalComposer } from './elsewhere.js';",
      'const firstHop = `The court reads danger ${score.toFixed(2)}.`;',
      'const secondHop = firstHop;',
      'let reassigned = `The levy chance was ${chance.toFixed(2)}.`;',
      "reassigned = 'The levy looks uncertain.';",
      'export const beats = [',
      '  { headline: secondHop },',
      '  { summary: reassigned },',
      '  { reason: externalComposer() },',
      '];',
    ].join('\n');
    expect(scanProseNumericsSource({ source: clean, path: 'src/opaque-control.js' }).hits).toEqual([]);
  });

  it('does not fall through a parameter shadow to an outer binding', () => {
    const clean = [
      'const opaqueBody = `The court reads danger ${score.toFixed(2)}.`;',
      'export function authored(opaqueBody) {',
      '  return { headline: opaqueBody };',
      '}',
    ].join('\n');
    expect(scanProseNumericsSource({ source: clean, path: 'src/shadow-control.js' }).hits).toEqual([]);
  });

  it('pushIndirection: a float reaches the reader through a WRAPPED return', () => {
    // The exact live shape CW-0w was pointed at (relationshipMemory.js's
    // postureReasons): a non-prose-named local array, pushed with a float, then
    // returned through `.slice(...)` from a prose-NAMED function. None of the
    // four detectors above can see it — the array is not prose-named and the
    // return is a call, not the array.
    const mutant = [
      'function postureReasons(relState) {',
      '  const out = [];',
      '  out.push(`High resentment (${relState.resentment.toFixed(2)}) shapes the posture.`);',
      '  return out.slice(0, 4);',
      '}',
    ].join('\n');
    const found = scanProseNumericsSource({ source: mutant, path: 'src/wrapped-return.js' }).hits;
    expect(found.map((hit) => hit.category)).toEqual(['pushIndirection']);
  });

  it('pushIndirection: the array may also travel through a NON-prose-named carrier', () => {
    // The second escape the interior survey named: the array leaves an ordinary
    // function and the CALL is what lands on the prose surface.
    const mutant = [
      'function buildLines(state) {',
      '  const parts = [];',
      '  parts.push(`Danger ${state.score.toFixed(2)} decides it.`);',
      '  return parts;',
      '}',
      'export const beat = { reasons: buildLines(state) };',
    ].join('\n');
    const found = scanProseNumericsSource({ source: mutant, path: 'src/carrier.js' }).hits;
    expect(found.map((hit) => hit.category)).toEqual(['pushIndirection']);
  });

  it('pushIndirection: a wrapped array that reaches NO reader surface stays quiet', () => {
    // The false-positive control. Same array, same float, same `.slice` — but
    // the function is not prose-named and nothing prose-named consumes it, so a
    // detector that fired here would be reporting sentences no reader sees.
    const clean = [
      'function auditTrail(state) {',
      '  const out = [];',
      '  out.push(`Danger ${state.score.toFixed(2)} decides it.`);',
      '  return out.slice(0, 4);',
      '}',
      'export const debugOnly = { trace: auditTrail(state) };',
    ].join('\n');
    expect(scanProseNumericsSource({ source: clean, path: 'src/audit-control.js' }).hits).toEqual([]);
  });

  it('pushIndirection: a TRANSFORMING method is not followed, and banded words stay quiet', () => {
    // `.map` rebuilds every element, so following it would report a sentence
    // that may no longer exist. And the whole point of the estate's rule is that
    // BANDED prose is fine — a wrapped return carrying only words is not a leak.
    const clean = [
      'function reasonsA(state) {',
      '  const out = [];',
      '  out.push(`Danger ${state.score.toFixed(2)} decides it.`);',
      '  return out.map((line) => line.toUpperCase());',
      '}',
      'function reasonsB() {',
      '  const out = [];',
      '  out.push(\'Resentment runs high enough to shape the posture.\');',
      '  return out.slice(0, 4);',
      '}',
      'export const beats = [reasonsA, reasonsB];',
    ].join('\n');
    expect(scanProseNumericsSource({ source: clean, path: 'src/transform-control.js' }).hits).toEqual([]);
  });

  it('does not attribute a future array push to an earlier authored value', () => {
    const clean = [
      'const parts = [];',
      'export const beat = { reasons: parts };',
      'parts.push(`A later diagnostic reads ${score.toFixed(2)}.`);',
    ].join('\n');
    expect(scanProseNumericsSource({ source: clean, path: 'src/future-push-control.js' }).hits).toEqual([]);
  });
});

describe('E-E JSX prose numerics detector discriminates (executed mutants)', () => {
  const cases = [
    ['floatInterpolation', '<p>Pressure {score.toFixed(1)}</p>'],
    ['percentToken', '<p>Chance {Math.round(chance * 100)}%</p>'],
    ['multiplier', '<p>Commitment {depth}× the old mark</p>'],
    ['twoDecimalScore', '<p>Hold chance 0.62, roll 0.41</p>'],
  ];

  it.each(cases)('%s: a JSX mutant is caught', (category, body) => {
    const source = `export function Mutant() { return (${body}); }`;
    const result = scanProseNumericsSource({ source, path: 'src/Mutant.jsx' });
    expect(result.parseError).toBeNull();
    expect(result.hits.map((hit) => hit.category)).toContain(category);
  });

  it('the clean JSX control stays quiet', () => {
    const source = 'export function Clean() { return (<p>The watch is badly outmatched.</p>); }';
    expect(scanProseNumericsSource({ source, path: 'src/Clean.jsx' }).hits).toEqual([]);
  });

  it('follows one local JSX reader binding without scanning unrelated component state', () => {
    const source = [
      'export function Mutant() {',
      '  const opaqueBody = `Hold chance ${chance.toFixed(2)}.`;',
      '  return <p>{opaqueBody}</p>;',
      '}',
    ].join('\n');
    const found = scanProseNumericsSource({ source, path: 'src/Mutant.jsx' }).hits;
    expect(found.map((hit) => hit.category)).toEqual(['floatInterpolation', 'twoDecimalScore']);
  });

  it('layout/control/CSS numerics are not reader prose (negative matrix)', () => {
    const source = [
      "const css = '.meter { width: 100%; opacity: 0.62; }';",
      'export function SummaryTab({ active, cats, keyName }) {',
      '  return (<>',
      '    <style>{css}</style>',
      "    <p>{t('generate.title')}</p>",
      "    <p>{keyName.replace(/_/g, ' ')}</p>",
      "    <p>{cats.join(' / ')}</p>",
      "    <p>{active ? 'The gate is open.' : 'The gate is closed.'}</p>",
      "    <div style={{ width: '100%', opacity: 0.62, transform: 'scale(1.20)' }} />",
      '  </>);',
      '}',
    ].join('\n');
    const result = scanProseNumericsSource({ source, path: 'src/Clean.jsx' });
    expect(result.parseError).toBeNull();
    expect(result.hits).toEqual([]);
  });
});

describe('prose numerics live-tree ratchet (exact legacy identity, shrink-only)', () => {
  it('the complete JS/JSX corpus parses, so a green scan cannot mean skipped files', () => {
    expect(LIVE.parseErrors, LIVE.parseErrors.join('\n')).toEqual([]);
  });

  it('the committed exact baseline exists', () => {
    expect(
      existsSync(BASELINE_PATH),
      'baseline missing; restore the reviewed exact A-1 census rather than creating an empty or anonymous budget',
    ).toBe(true);
  });

  it('path + line + category + snippet debt exactly matches the committed baseline', () => {
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    expect(
      LIVE.hits,
      'A new prose numeric leaked, or legacy debt moved/fell. Humanize additions; when debt falls, regenerate once and review every removed row before committing the lower baseline.',
    ).toEqual(baseline);
  });

  it('the reviewed post-sweep total and per-category ceilings can only move down', () => {
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    const categoryCeilingTotal = Object.values(REVIEWED_CATEGORY_CEILINGS)
      .reduce((sum, ceiling) => sum + ceiling, 0);

    expect(categoryCeilingTotal).toBe(REVIEWED_TOTAL_CEILING);
    expect(
      ceilingViolations(baseline),
      'The committed baseline exceeds the reviewed 338-row census. Remove the leak; never raise a ceiling.',
    ).toEqual([]);
    expect(
      ceilingViolations(LIVE.hits),
      'The live tree exceeds the reviewed 338-row census. Humanize the new leak; never raise a ceiling.',
    ).toEqual([]);
  });

  it('a regenerated exact baseline cannot make an executed +1 leak green', () => {
    const mutant = scanProseNumericsSource({
      source: 'export const beat = { headline: `The court reads pressure ${pressure}.` };',
      path: 'src/governance-mutant.js',
    }).hits;
    expect(mutant.map((hit) => hit.category)).toEqual(['floatInterpolation']);

    const mutatedLive = [...LIVE.hits, ...mutant];
    const temporaryRegeneratedBaseline = JSON.parse(JSON.stringify(mutatedLive));
    expect(mutatedLive).toEqual(temporaryRegeneratedBaseline);
    expect(ceilingViolations(temporaryRegeneratedBaseline)).toEqual([
      'total 339 exceeds reviewed ceiling 338',
      'floatInterpolation 202 exceeds reviewed ceiling 201',
    ]);
  });

  it('the baseline itself has exact, unique, source-verifiable identities', () => {
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    const keys = baseline.map((hit) => `${hit.path}|${hit.line}|${hit.category}|${hit.snippet}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const hit of baseline) {
      expect(typeof hit.path).toBe('string');
      expect(Number.isInteger(hit.line) && hit.line > 0).toBe(true);
      expect(['floatInterpolation', 'percentToken', 'multiplier', 'twoDecimalScore', 'pushIndirection']).toContain(hit.category);
      expect(typeof hit.snippet === 'string' && hit.snippet.length > 0).toBe(true);
      const source = readFileSync(join(ROOT, hit.path), 'utf8');
      const sourceLines = source.split(/\r?\n/);
      expect((sourceLines[hit.line - 1] || '').trim().length, `${hit.path}:${hit.line} is no longer a source line`)
        .toBeGreaterThan(0);
      const frozenSource = hit.snippet.endsWith('...') ? hit.snippet.slice(0, -3) : hit.snippet;
      expect(oneLineForIdentity(source), `${hit.path}:${hit.line} no longer contains its frozen snippet`)
        .toContain(frozenSource);
    }
  });
});

function oneLineForIdentity(text) {
  return text.replace(/\s+/g, ' ').trim();
}
