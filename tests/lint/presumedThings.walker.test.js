/**
 * presumedThings.walker.test.js — THE WORD-TO-THING WALKER (COHERENCE-PRESUME; the chair's charter
 * `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §1, "a line names a thing the town does
 * not have"). The rule book is `tests/lint/presumedThings.shared.mjs`; the register is
 * `tests/lint/presumedThings.register.json`, shrink-only.
 *
 * THIS FILE REDS WHEN:
 *   • ARM 1: a source literal (or a component's JSX text) under src/data, src/generators, src/domain or
 *     src/components (the last two since W2-B-DECLARE item 3) names a thing, declares no atom that
 *     answers it through a carrier a draw door enforces (W2-B-DECLARE item 1), and has no row in the
 *     register or the widened register (`presumedThings.widened.register.json`) (a new undeclared line);
 *   • the tagged tables the walker credits differ from the `tagged: true` sites in src;
 *   • THE STRIP BAN (W2-B-DECLARE item 3): a call that unwraps lines to their text (`.map(textOf)`,
 *     `.map(lineText)`, `.map((l) => l.text)`) stands nowhere in src without its row in the widened
 *     register's `strips` (`strip-before-draw`, to cure; `not-a-draw`), and no strip row is stale;
 *   • ARM 2: a sentence of the corpus (360 births, the browser's configuration, seeds
 *     presume-<tier>-<i>) names a thing the town lacks by the vocabulary's own readers, and no row
 *     of the register covers it (a new false presumption, or a cured line come back);
 *   • either arm: a register row matches nothing (stale: a cure removes its row in its own commit);
 *   • a row's reason is not one of the register's named reasons;
 *   • ARM 1's one out-of-reach site (`ARM1_NOT_PRINTED`: the `detail` argument of
 *     `generationCoherence.js :: finding`, the receipt's diagnostic) reaches a reader — a printing file
 *     reads a finding's detail — or the exemption widens past its file, callee and argument position.
 * Every failure path is EXECUTED against planted source and a planted record in memory.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, test } from 'vitest';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { liveInstitutionNames } from '../../src/domain/facts/institutions.js';
import { FACT_DIMENSIONS, parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { REGISTERED_WORDS } from '../../src/domain/facts/registeredWords.js';
import {
  ARM1_NOT_PRINTED, ARM1_ROOTS, ARM1_RULE_BOOK, DOOR_ARGS, drawnRanges, keyedDeclarations, COURT_HOUSES, stripKey, stripSites, stripTree, REGISTER_REL, TAGGED_TABLE_FILES, THINGS, THING_IDS, WIDENED_REGISTER_REL, bankedKeys, corpusConfig, corpusSeeds,
  deniesExistence, hitKey, listFiles, negates, printedAbsent, printedOutOfTime, rowCovers, scanSource, scanTree, unlicensedServiceRows,
} from './presumedThings.shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** Arm 1 over a planted tree of files, read together as `scanTree` reads the real one. @param {Array<[string, string]>} files */
function scanTreeOf(files) {
  const drawn = drawnRanges(files);
  const keyed = new Map();
  for (const [rel, src] of files) for (const [k, v] of keyedDeclarations(rel, src, drawn)) keyed.set(k, v);
  return files.flatMap(([rel, src]) => scanSource(rel, src, keyed, drawn)).map((h) => `${h.thing} :: ${h.text}`);
}
const register = JSON.parse(readFileSync(join(ROOT, REGISTER_REL), 'utf8'));
const REASONS = Object.keys(register.reasons);
const widened = JSON.parse(readFileSync(join(ROOT, WIDENED_REGISTER_REL), 'utf8'));

describe('the rule book', () => {
  test('every thing\'s atoms are atoms of the vocabulary', () => {
    const bad = THING_IDS.flatMap((id) => THINGS[id].atoms.filter((a) => parseAtom(a) === null).map((a) => `${id}: ${a}`));
    expect(bad).toEqual([]);
  });

  test('planted: an undeclared literal is a hit; a declared one, a negated one and a table key are not', () => {
    const src = [
      "const declaredSet = (text, needs, twin) => Object.freeze([{ text, needs }, { text: twin, twinOf: text, excludes: needs }]);",
      "export const A = ['The militia drills on the green every week.'];",
      "export const B = [{ text: 'The militia drills on the green every week.', needs: ['militia'] }];",
      "export const C = [{ text: 'The quiet town has no militia at all.', excludes: ['militia'] }];",
      "export const D = { 'The militia musters at the gate each spring.': declaredSet('The militia musters at the gate each spring.', ['militia'], 'The quiet green waits for no one.') };",
      "export const E = [{ text: 'Grain is sold at the weekly market here.', needs: ['market'] }];",
      "export const F = ['Cheese goes to the weekly market in summer.'];",
      "export const G = { 'Cheese goes to the weekly market in summer.': Object.freeze({ needs: Object.freeze(['market']) }) };",
      "drawDeclared([...B, ...C, ...E], { facts, draw }); resolveSibling(line, D, {}); resolveSibling(line, G, {});",
    ].join('\n');
    const hits = scanSource('planted.js', src);
    expect(hits).toEqual([{ file: 'planted.js', thing: 'militia', text: 'The militia drills on the green every week.' }]);
  });

  /**
   * W2-B-DECLARE item 1 (record 294, ruling 5): a carrier counts only where a draw door reads it. Red at the
   * base rule book (1930cec6e), whose DECL_PROPS credited `cast`, `requires`, every `marks` and every `tags`.
   */
  test('planted: a carrier no door enforces declares nothing; the doors\' carriers still do', () => {
    const src = [
      "export const A = [{ text: 'The militia drills on the green every week.', cast: ['militia'] }];",
      "export const B = { x: { requires: ['militia'], reason: 'A militia needs a muster field near the green.' } };",
      "export const C = [{ marks: ['militia'], text: 'The militia drills on the green in the causal arm.' }];",
      "export const D = [{ vid: 3, marks: ['militia'], text: 'The militia drills on the green in a state pool.' }];",
      "export const E = [{ tags: ['militia'], position: 'Leads the militia drill on the green each week.' }];",
      "export const F = [{ text: 'The militia drills on the green when a crisis looms.', excludes: ['militia'] }];",
      "export const G = [{ text: 'The militia drills on the green by a pool rule.', poolDeclares: ['militia'] }];",
      "drawDeclared([...A, ...C, ...D, ...F, ...G], { facts, draw }); resolveDeclared(B.x, {}); resolveDeclared(E, { tagged: true });",
    ].join('\n');
    // F's `excludes` now answers nothing on a naming line (F3: an exclusion does not imply the thing), and D's marks
    // declare only in a kernel pool file
    expect(scanSource('src/data/planted.js', src).map((h) => h.text)).toEqual([
      'The militia drills on the green every week.',
      'A militia needs a muster field near the green.',
      'The militia drills on the green in the causal arm.',
      'The militia drills on the green in a state pool.',
      'Leads the militia drill on the green each week.',
      'The militia drills on the green when a crisis looms.',
    ]);
    expect(scanSource('src/data/dossierStateProse/planted.generated.js', src).map((h) => h.text)).not.toContain('The militia drills on the green in a state pool.');
    // the same source, read as a table drawn `{ tagged: true }`: its `tags` declare, so the line it flagged elsewhere is answered
    expectPresentThenAbsent(
      scanSource('src/data/planted.js', src).map((h) => h.text),
      scanSource('src/generators/npcStructure.js', src).map((h) => h.text),
      'Leads the militia drill on the green each week.',
      'tags credited only in a tagged table',
    );
  });

  /**
   * W2-B-DECLARE item 3 (record 288, ruling 1, B (i)): the display and the components are roots, and a component's
   * JSX text is read as a line. Red at e55ede7d2's rule book (two roots, no JSX text): every `root` row stale.
   */
  test('the roots are the four trees that hold lines, and a component\'s JSX text is read', () => {
    expect([...ARM1_ROOTS]).toEqual(['src/data', 'src/generators', 'src/domain', 'src/components']);
    const jsx = 'export const P = () => <p>The militia drills on the green every week.</p>;';
    expect(scanSource('src/components/planted.jsx', jsx).map((h) => `${h.thing} :: ${h.text}`)).toEqual(['militia :: The militia drills on the green every week.']);
  });

  /**
   * W2-B-DECLARE item 3 (record 288, ruling 1, B (ii); record 290, ruling 3: "a line that uses a registered word must
   * carry that word's disqualifier"). Red at 21a27e035's rule book, which read the sixteen things alone.
   */
  test('planted: a state, a size or a count with no declaration is a hit; the door\'s carriers answer it', () => {
    const src = [
      "export const A = ['The town has been under siege since the thaw.'];",
      "export const B = [{ text: 'The town has been under siege since the thaw, still.', crisis: ['siege'] }];",
      "export const C = [{ vid: 1, marks: ['threat'], text: 'The town has been under siege since the thaw, again.' }];",
      "export const D = ['Smoke rises from the poorest quarters at dusk.'];",
      "export const E = [{ text: 'Smoke rises from the poorest quarters at dusk, still.', needs: ['population: ≥ middling'] }];",
      "export const F = ['The ruling three meet each spring at the hall.'];",
      "drawDeclared([...A, ...B, ...C, ...D, ...E, ...F], { facts, draw });",
    ].join('\n');
    // C: a kernel variant marked `threat` is a siege OR an occupation OR monsters — it does not imply a siege (F3)
    expect(scanSource('src/data/dossierStateProse/planted.generated.js', src).map((h) => `${h.thing} :: ${h.text}`)).toEqual([
      'siege :: The town has been under siege since the thaw.',
      'siege :: The town has been under siege since the thaw, again.',
      'quarters :: Smoke rises from the poorest quarters at dusk.',
      'rulingFaces :: The ruling three meet each spring at the hall.', // F2: the ruler's faces, its own word
    ]);
  });

  test('every registered word carries its disqualifier: atoms of the vocabulary, or the leaf its atom waits for', () => {
    const bad = [];
    for (const [id, w] of Object.entries(REGISTERED_WORDS)) {
      if (w.atoms.length === 0 && !w.leaf) bad.push(`${id}: no atom and no leaf`);
      for (const a of w.atoms) if (!(a.endsWith(':') ? FACT_DIMENSIONS[a.slice(0, -1)] : parseAtom(a))) bad.push(`${id}: ${a}`);
    }
    expect(bad).toEqual([]);
  });

  test('the tagged tables are exactly the files a door draws `{ tagged: true }`', () => {
    const files = [];
    const walk = (rel) => {
      for (const e of readdirSync(join(ROOT, rel)).sort()) {
        const p = `${rel}/${e}`;
        if (statSync(join(ROOT, p)).isDirectory()) walk(p);
        else if (/\.(?:js|jsx|mjs)$/.test(e) && p !== 'src/domain/facts/drawDeclared.js' && p !== 'src/domain/facts/factVocabulary.js') files.push(p);
      }
    };
    walk('src');
    const tagged = files.filter((f) => /\btagged:\s*true\b/.test(readFileSync(join(ROOT, f), 'utf8')));
    expect(tagged).toEqual(Object.keys(TAGGED_TABLE_FILES).sort());
  });

  test('planted: a finding\'s detail in generationCoherence.js is out of reach; the same words anywhere else are read', () => {
    const line = 'A planted detail that names a market for this test.';
    const src = [
      `push(finding('economicState.situationDesc', '${line}'));`,
      `push(finding('${line}', 'x'));`,
      `push(other('economicState.situationDesc', '${line.replace('this test', 'that test')}'));`,
    ].join('\n');
    expect(scanSource('src/generators/generationCoherence.js', src).map((h) => h.text)).toEqual([line, line.replace('this test', 'that test')]);
    expect(scanSource('src/generators/elsewhere.js', `push(finding('p', '${line}'));`).map((h) => h.text)).toEqual([line]);
    expect(ARM1_NOT_PRINTED.map((s) => `${s.file} :: ${s.callee} :: ${s.argument}`)).toEqual(['src/generators/generationCoherence.js :: finding :: 1']);
  });

  /**
   * W2-B-DECLARE second seat, F10: the rule book's own data is exempt by its SITE, not banked row by row (the four rows
   * the first seat banked against its own commit e55ede7d2 are gone). Its pin: only the checks read the rule book — no
   * file under src imports it but the page check, so no string of it reaches a page. Red at 9d5d6e091, whose walker read
   * `registeredWords.js` as lines and banked four of them.
   */
  test('planted: the rule book\'s own strings are not lines; the same words in any other file are read', () => {
    const src = "export const W = { leaf: 'crisisKind.js (occupied) · rulerKind.js (occupier) under occupation' };";
    expect(scanSource('src/domain/facts/registeredWords.js', src)).toEqual([]);
    expect(scanSource('src/domain/facts/elsewhere.js', src).map((h) => h.thing)).toEqual(['occupation']);
    expect(Object.keys(ARM1_RULE_BOOK)).toEqual(['src/domain/facts/registeredWords.js']);
    const importers = [];
    const walk = (rel) => {
      for (const e of readdirSync(join(ROOT, rel)).sort()) {
        const p = `${rel}/${e}`;
        if (statSync(join(ROOT, p)).isDirectory()) walk(p);
        else if (/\.(?:js|jsx|mjs)$/.test(e) && /from '[^']*facts\/registeredWords\.js'/.test(readFileSync(join(ROOT, p), 'utf8'))) importers.push(p);
      }
    };
    walk('src');
    expect(importers, 'a printing file imports the rule book').toEqual(['src/domain/coherence/vocabularyPageFindings.js']);
  });

  /**
   * THE EXEMPTION IS AS TRUE AS THIS PIN (the chair's condition, 2026-11-12): "a component reads its verdict, never its
   * findings" is checked, not said. A printing file — the components, the display, prose and dossier modules, the PDF,
   * the Foundry export — that names the coherence receipt never reads a finding's `.detail`. The one reader today is the
   * PDF view-model's projection (`generationContracts.js :: coherenceFindingView`), which carries the receipt's shape and
   * which no PDF section reads; the second arm holds that.
   */
  test('no reader prints a finding\'s words: no printing file reads a receipt finding\'s detail', () => {
    const PRINTING = ['src/components', 'src/domain/display', 'src/domain/prose', 'src/domain/dossier', 'src/pdf', 'src/foundry'];
    const files = [];
    const walk = (rel) => {
      for (const e of readdirSync(join(ROOT, rel)).sort()) {
        const p = `${rel}/${e}`;
        if (statSync(join(ROOT, p)).isDirectory()) walk(p);
        else if (/\.(?:js|jsx|mjs)$/.test(e)) files.push(p);
      }
    };
    for (const r of PRINTING) walk(r);
    expect(files.length).toBeGreaterThan(300);
    const src = (f) => readFileSync(join(ROOT, f), 'utf8');
    const namesReceipt = (text) => /generationCoherenceReceipt|\bgenerationCoherence\b|coherenceFindingView/.test(text);
    const readers = files.filter((f) => namesReceipt(src(f)) && /\.detail\b/.test(src(f)));
    expect(readers, 'a printing file reads a receipt finding\'s detail').toEqual(['src/pdf/lib/generationContracts.js']);
    const pdfViewReaders = files.filter((f) => f.startsWith('src/pdf/') && f !== 'src/pdf/lib/generationContracts.js'
      && /\bgenerationCoherence\s*\??\.\s*(?:checks|judgments|findings)/.test(src(f)));
    expect(pdfViewReaders, 'a PDF page reads the receipt\'s findings').toEqual([]);
  });

  test('planted: the negation reader', () => {
    expect(negates('Without prison or courts, the risk is low.', THINGS.prison.words)).toBe(true);
    expect(negates('the large operations no militia could handle.', THINGS.militia.words)).toBe(true);
    expect(negates('never says how many are in the garrison.', THINGS.garrison.words)).toBe(false);
    expect(negates('Town watch and militia; enforce ordinances.', THINGS.militia.words)).toBe(false);
  });

  test('planted: a record printing a thing it lacks is listed; one that has it is not', () => {
    const record = { powerStructure: { factions: [{ desc: 'Town watch and militia; enforce ordinances.' }] } };
    const lacking = { defence: { militia: false, watch: true } };
    const having = { defence: { militia: true, watch: true } };
    expect(printedAbsent(record, lacking, [])).toEqual([{ thing: 'militia', path: '.powerStructure.factions[].desc', sentence: 'Town watch and militia;' }]);
    expect(printedAbsent(record, having, [])).toEqual([]);
  });
});

/**
 * W2-B-DECLARE second seat, F3 (REVIEW-W2B §4: "the guard accepts declarations no door reads and disqualifiers that do
 * not disqualify"). Every plant of the review's table is kept here. Red at 9d5d6e091, whose walker credited `needs`,
 * `excludes`, `poolDeclares` and `crisis` on any object within five parents, any array handed to any call, and any atom
 * of a word's list on either side.
 */
describe('F3 — a declaration counts only on an object a door draws, and only where it implies the word', () => {
  const hitsOf = (rel, lines) => scanSource(rel, lines.join('\n')).map((h) => `${h.thing} :: ${h.text}`);

  test('planted: a declared object no door reads declares nothing; the same object drawn does', () => {
    const blurb = "const X = { needs: ['militia'], blurb: 'The militia drills on the green every week.' }; print(X.blurb);";
    expect(hitsOf('src/data/planted.js', [blurb])).toEqual(['militia :: The militia drills on the green every week.']);
    expect(hitsOf('src/data/planted.js', [blurb, 'drawDeclared([X], { facts, draw });'])).toEqual([]);
  });

  test('planted: a door\'s pool followed through a local, a parameter, a function\'s return and an import', () => {
    const lines = [
      "const P = [{ text: 'The militia drills on the green every week.', needs: ['militia'] }];",
      "const Q = [{ text: 'The militia drills on the green every month.', needs: ['militia'] }];",
      "const R = [{ text: 'The militia drills on the green every year.', needs: ['militia'] }];",
      'function poolOf() { return R; }',
      'function pickFrom(pool) { return drawDeclared(pool, { facts, draw }).text; }',
      'export const one = () => { const local = P.filter(Boolean); return drawDeclared(local, { facts, draw }); };',
      'export const two = () => pickFrom(Q);',
      'export const three = () => filterDeclared(poolOf(), { facts });',
    ];
    expect(hitsOf('src/data/planted.js', lines)).toEqual([]);
    const shared = scanTreeOf([
      ['src/data/a.js', "export const T = [{ text: 'The militia drills on the green every week.', needs: ['militia'] }];"],
      ['src/generators/b.js', "import { T } from '../data/a.js';\nexport const draw1 = () => drawDeclared(T, { facts, draw });"],
      ['src/data/c.js', "export const U = [{ text: 'The militia drills on the green every month.', needs: ['militia'] }];"],
    ]);
    expect(shared).toEqual(['militia :: The militia drills on the green every month.']);
  });

  test('planted: a disqualifier that does not imply the word answers nothing', () => {
    const draw = 'drawDeclared([A, B], { facts, draw });';
    // a siege is not answered by any crisis
    expect(hitsOf('src/data/planted.js', ["const A = { text: 'The town is under siege again this spring.', needs: ['crisis: threat'] };", "const B = { text: 'The town is under siege again this summer.', crisis: ['hunger'] };", draw]))
      .toEqual(['siege :: The town is under siege again this spring.', 'siege :: The town is under siege again this summer.']);
    expect(hitsOf('src/data/planted.js', ["const A = { text: 'The town is under siege again this spring.', crisis: ['under_siege'] };", "const B = { text: 'The town is under siege again this summer.', needs: ['crisis: siege'] };", draw])).toEqual([]);
    // quarters are not answered by a small population or a tier
    expect(hitsOf('src/data/planted.js', ["const A = { text: 'Smoke rises from the poorest quarters at dusk.', needs: ['population: small'] };", "const B = { text: 'Smoke rises from the poorest quarters at dawn.', needs: ['tier: thorp'] };", draw]))
      .toEqual(['quarters :: Smoke rises from the poorest quarters at dusk.', 'quarters :: Smoke rises from the poorest quarters at dawn.']);
    expect(hitsOf('src/data/planted.js', ["const A = { text: 'Smoke rises from the poorest quarters at dusk.', needs: ['population: large'] };", "const B = { text: 'Smoke rises from the poorest quarters at dawn.', needs: ['population: ≥ middling'] };", draw])).toEqual([]);
    // a thing is not answered by its own negation, nor famine by any food band
    expect(hitsOf('src/data/planted.js', ["const A = { text: 'The town walls are patched with timber.', needs: ['no walls'] };", "const B = { text: 'The famine has reached the outer farms.', needs: ['food: deficit'] };", draw]))
      .toEqual(['walls :: The town walls are patched with timber.', 'famine :: The famine has reached the outer farms.']);
    expect(hitsOf('src/data/planted.js', ["const A = { text: 'The town walls are patched with timber.', needs: ['walls'] };", "const B = { text: 'The famine has reached the outer farms.', needs: ['food: famine'] };", draw])).toEqual([]);
  });

  test('planted: a line that denies needs the negation; the positive atom does not answer it', () => {
    const lines = (decl) => [`const A = { text: 'The quiet town has no militia at all.', ${decl} };`, 'drawDeclared([A], { facts, draw });'];
    expect(hitsOf('src/data/planted.js', lines("needs: ['militia']"))).toEqual(['militia :: The quiet town has no militia at all.']);
    expect(hitsOf('src/data/planted.js', lines("excludes: ['militia']"))).toEqual([]);
  });

  test('planted: an array handed to any call, a carrier on any object, a tag outside the drawn table, a mark outside a kernel pool — none declares', () => {
    expect(hitsOf('src/data/planted.js', ["export const A = String(['militia'], 'The militia drills on the green every week.');"])).toEqual(['militia :: The militia drills on the green every week.']);
    expect(hitsOf('src/data/planted.js', [
      "export const B = { crisis: ['under_siege'], line: 'The town is under siege again this spring.' };",
      "export const C = { poolDeclares: ['militia'], line: 'The militia drills on the green every week.' };",
    ])).toEqual(['siege :: The town is under siege again this spring.', 'militia :: The militia drills on the green every week.']);
    expect(hitsOf('src/generators/npcStructure.js', ["export const D = { tags: ['militia'], position: 'Leads the militia drill on the green each week.' };"])).toEqual(['militia :: Leads the militia drill on the green each week.']);
    expect(hitsOf('src/data/planted.js', ["export const E = [{ vid: 4, marks: ['militia'], text: 'The militia drills on the green every week.' }]; drawDeclared(E, {});"]))
      .toEqual(['militia :: The militia drills on the green every week.']);
  });

  test('the doors the walker follows are the draw module\'s exported doors', () => {
    const src = readFileSync(join(ROOT, 'src/domain/facts/drawDeclared.js'), 'utf8');
    const exported = [...src.matchAll(/^export function (\w+)/gm)].map((m) => m[1]).filter((n) => n !== 'lineText' && n !== 'hasUnheldCandidate');
    expect(Object.keys(DOOR_ARGS).sort()).toEqual(exported.sort());
  });
});

describe('the court reading (the chair\'s correction of 2026-11-12)', () => {
  test('planted: a house whose own service tries disputes is a court; mediation is not', () => {
    expect([...COURT_HOUSES].sort()).toEqual(['city administration', 'city hall', 'city-state government', 'courthouse', 'mayor and council', 'multiple court buildings', 'town council', 'town hall']);
    expect(THINGS.court.absent({}, ['Town hall'])).toBe(false);
    expect(THINGS.court.absent({}, ['Courthouse'])).toBe(false);
    expect(THINGS.court.absent({}, ['Village headman', 'Village reeve', 'Craft guilds (5-15)'])).toBe(true);
  });
});

describe('the denial side (the chair\'s ruling A of 2026-11-11)', () => {
  test('planted: the existence-denial reader', () => {
    expect(deniesExistence('No law, bring coin', THINGS.law.words)).toBe(true);
    expect(deniesExistence('There is no official recourse here.', THINGS.law.words)).toBe(true);
    expect(deniesExistence('Fragile (private security, no public law)', THINGS.law.words)).toBe(true);
    expect(deniesExistence('It has no wharf of its own.', THINGS.docks.words)).toBe(true);
    expect(deniesExistence('It is not a prison, though the distinction is thin.', THINGS.prison.words)).toBe(false);
    expect(deniesExistence('no single barracks could secure a city this size.', THINGS.garrison.words)).toBe(false);
    expect(deniesExistence('The adventurers\' charter hall handles threats the watch cannot.', THINGS.watch.words)).toBe(false);
    expect(deniesExistence('The owners would not call the law;', THINGS.law.words)).toBe(false);
    expect(deniesExistence('stalls that pay no market dues.', THINGS.market.words)).toBe(false);
    expect(deniesExistence('services no law permits.', THINGS.law.words)).toBe(false);
  });

  test('planted: a record denying a thing it HAS is listed; one that lacks it is not; the law is read only where denied', () => {
    const record = { availableServices: { criminal: [{ name: 'No law, bring coin', desc: 'There is no official recourse here.', institution: '(lawless)' }] }, note: 'The law here keeps the market quiet enough.' };
    const watched = { defence: { watch: true, garrison: false }, market: true };
    const lawless = { defence: { watch: false, garrison: false }, market: true };
    expect(printedAbsent(record, watched, ['Town watch'])).toEqual([
      { thing: 'law', path: '.availableServices.criminal[].name', sentence: 'No law, bring coin', denies: true },
      { thing: 'law', path: '.availableServices.criminal[].desc', sentence: 'There is no official recourse here.', denies: true },
    ]);
    expect(printedAbsent(record, lawless, ['Tavern'])).toEqual([]);
    expect(rowCovers({ thing: 'law', path: '.availableServices.criminal[].name', text: 'No law' }, { thing: 'law', path: '.availableServices.criminal[].name', sentence: 'No law, bring coin', denies: true })).toBe(false);
  });
});

describe('time (the chair\'s ruling B of 2026-11-11)', () => {
  test('planted: a witness line under an old event, a named old event, and an echoed tension are listed; recent ones are not', () => {
    const record = { history: {
      historicalEvents: [
        { name: 'The Siege', yearsAgo: 182, description: 'The walls held for a whole winter against the host.', plotHooks: ['Families who lived through it tell it this way: the gate was opened.'] },
        { name: 'The Flood', yearsAgo: 23, description: 'The river came up in a night and took the low streets.', plotHooks: ['Families who lived through it tell it this way: the dam was cut.'] },
      ],
      currentTensions: [{ description: 'The river came up in a night and took the low streets.' }],
      historicalCharacter: 'The Siege is this place\'s defining story, and the people who lived through it are still here to tell it',
      note: 'The Flood is still present in living memory: the low streets were never rebuilt.',
    } };
    expect(printedOutOfTime(record).map((h) => `${h.why} ${h.path}`)).toEqual([
      'witness .history.historicalEvents[].plotHooks[]',
      'witness .history.historicalCharacter',
      'echo .history.currentTensions[].description',
    ]);
  });
});

describe('the register', () => {
  test('every row carries a named reason', () => {
    const bad = [
      ...register.arm2.filter((r) => !REASONS.includes(r.reason)).map((r) => `arm2 ${r.thing} ${r.text}`),
      ...Object.entries(register.arm1).flatMap(([f, rows]) => rows.filter((r) => !REASONS.includes(r[1])).map((r) => `arm1 ${f} ${r[2]}`)),
      ...Object.entries(widened.arm1).flatMap(([f, rows]) => rows.filter((r) => !Object.keys(widened.reasons).includes(r[1])).map((r) => `widened ${f} ${r[2]}`)),
    ];
    expect(bad).toEqual([]);
  });

  test('no row is banked twice: the widened register holds nothing the first one holds, nor any key twice', () => {
    const first = bankedKeys(register);
    expect([...bankedKeys(widened)].filter((k) => first.has(k))).toEqual([]);
    const rows = Object.entries(widened.arm1).flatMap(([f, rs]) => rs.map((r) => hitKey(f, r[0], r[2])));
    expect(rows.length).toBe(new Set(rows).size);
  });
});

describe('ARM 1 — the source', () => {
  const hits = scanTree(ROOT);
  const key = hitKey;
  const banked = new Set([...bankedKeys(register), ...bankedKeys(widened)]);
  const found = new Set(hits.map((h) => key(h.file, h.thing, h.text)));

  test('anti-vacuity: the walk reads its roots', () => {
    expect(listFiles(ROOT).length).toBeGreaterThan(150);
  });

  test('⛔ every source literal that names a thing declares it, or has its row', () => {
    const fresh = hits.filter((h) => !banked.has(key(h.file, h.thing, h.text)));
    expect(fresh.map((h) => `${h.file} :: ${h.thing} :: ${JSON.stringify(h.text.slice(0, 120))}`),
      'declare the thing on the line (needs or excludes, with its twin), never add a row').toEqual([]);
  });

  test('⛔ no stale row: a cured line leaves the register in its own commit', () => {
    expect([...banked].filter((k) => !found.has(k))).toEqual([]);
  });
});

describe('ARM 3 — the strip ban (W2-B-DECLARE item 3; record 288, ruling 1, B (iii))', () => {
  const sites = stripTree(ROOT);
  const banked = new Map((widened.strips || []).map((r) => [stripKey(r[0], r[1]), r[2]]));

  test('planted: each unwrap shape is a strip; a door\'s own draw and a map to another field are not', () => {
    const src = [
      "const a = POOL.map(textOf);",
      "const b = [{ text: 'x', needs: ['river'] }].map(lineText);",
      "const c = rows.map((l) => l.text);",
      "const d = drawDeclared(POOL, { draw, key }).text;",
      "const e = rows.map((l) => l.name);",
    ].join('\n');
    expect(stripSites('src/generators/planted.js', src).map((x) => x.receiver)).toEqual(['POOL', "[{ text: 'x', needs: ['river'] }]", 'rows']);
  });

  test('anti-vacuity: the strip walk finds the twelve sites of the class table', () => {
    expect(sites.length).toBeGreaterThanOrEqual(12);
  });

  test('⛔ no strip without its row: a new unwrap of a pool is red (draw it through a door)', () => {
    const fresh = sites.filter((x) => !banked.has(stripKey(x.file, x.receiver)));
    expect(fresh.map((x) => stripKey(x.file, x.receiver)), 'draw a declared pool through drawDeclared / filterDeclared; never unwrap it first').toEqual([]);
  });

  test('⛔ no stale strip row, and every row names one of the two reasons', () => {
    const found = new Set(sites.map((x) => stripKey(x.file, x.receiver)));
    expect([...banked.keys()].filter((k) => !found.has(k))).toEqual([]);
    expect([...banked.values()].filter((r) => r !== 'strip-before-draw' && r !== 'not-a-draw')).toEqual([]);
  });
});

describe('ARM 2 — the printed corpus', () => {
  /** @type {Array<{ thing: string, path: string, sentence: string, seed: string }>} */
  const listed = [];
  /** @type {string[]} */ const unlicensed = [];
  /** @type {string[]} */ const outOfTime = [];
  beforeAll(() => {
    for (const { tier, seed } of corpusSeeds()) {
      const record = generateSettlementPipeline({ ...corpusConfig(tier) }, null, { seed, customContent: {} });
      const names = liveInstitutionNames(record);
      for (const h of printedAbsent(record, factsOf(record), names)) listed.push({ ...h, seed });
      for (const row of unlicensedServiceRows(record, names)) unlicensed.push(`${seed} :: ${row}`);
      for (const h of printedOutOfTime(record)) outOfTime.push(`${h.why} :: ${h.path} :: ${JSON.stringify(h.sentence.slice(0, 120))}`);
    }
  }, 600_000);

  test('anti-vacuity: the corpus is the charter\'s (360 births) and arm 2 lists what the register names', () => {
    expect(corpusSeeds().length).toBe(360);
    expect(listed.length).toBeGreaterThan(0);
  });

  test('⛔ every line printed where its thing is absent has its row', () => {
    const fresh = listed.filter((h) => !register.arm2.some((r) => rowCovers(r, h)));
    const shown = [...new Set(fresh.map((h) => `${h.thing} :: ${h.path} :: ${JSON.stringify(h.sentence.slice(0, 140))}`))];
    expect(shown, 'declare the thing (the draw refuses the line where it is absent) and write its twin').toEqual([]);
  });

  test('⛔ TIME: no witness line on an event older than its bearers, and no current tension in a past event\'s words (no register: every row is cured)', () => {
    expect([...new Set(outOfTime)]).toEqual([]);
  });

  test('⛔ a service row stands only with its own institution (the chair\'s licensing rule)', () => {
    expect(unlicensed).toEqual([]);
  });

  test('⛔ no stale row: every arm-2 row still covers a printed line', () => {
    const stale = register.arm2.filter((r) => !listed.some((h) => rowCovers(r, h)));
    expect(stale.map((r) => `${r.thing} :: ${r.path} :: ${r.text}`)).toEqual([]);
  });
});
