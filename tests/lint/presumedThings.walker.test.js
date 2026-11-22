/**
 * presumedThings.walker.test.js — THE WORD-TO-THING WALKER (COHERENCE-PRESUME; the chair's charter
 * `docs/chair/2026-11-11/CHARTERS-COHERENCE-2026-11-11.md` §1, "a line names a thing the town does
 * not have"). The rule book is `tests/lint/presumedThings.shared.mjs`; the register is
 * `tests/lint/presumedThings.register.json`, shrink-only.
 *
 * THIS FILE REDS WHEN:
 *   • ARM 1: a source literal under src/data or src/generators names a thing, declares no atom that
 *     answers it, and has no row in the register (a new undeclared line);
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

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { liveInstitutionNames } from '../../src/domain/facts/institutions.js';
import { parseAtom } from '../../src/domain/facts/factVocabulary.js';
import {
  ARM1_NOT_PRINTED, COURT_HOUSES, REGISTER_REL, THINGS, THING_IDS, corpusConfig, corpusSeeds, deniesExistence, listFiles, negates, printedAbsent, printedOutOfTime,
  rowCovers, scanSource, scanTree, unlicensedServiceRows,
} from './presumedThings.shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const register = JSON.parse(readFileSync(join(ROOT, REGISTER_REL), 'utf8'));
const REASONS = Object.keys(register.reasons);

describe('the rule book', () => {
  test('every thing\'s atoms are atoms of the vocabulary', () => {
    const bad = THING_IDS.flatMap((id) => THINGS[id].atoms.filter((a) => parseAtom(a) === null).map((a) => `${id}: ${a}`));
    expect(bad).toEqual([]);
  });

  test('planted: an undeclared literal is a hit; a declared one, a negated one and a table key are not', () => {
    const src = [
      "export const A = ['The militia drills on the green every week.'];",
      "export const B = [{ text: 'The militia drills on the green every week.', needs: ['militia'] }];",
      "export const C = [{ text: 'The quiet town has no militia at all.', crisis: ['any'] }];",
      "export const D = { 'The militia musters at the gate each spring.': declaredSet('The militia musters at the gate each spring.', ['militia']) };",
      "export const E = [{ text: 'Grain is sold at the weekly market here.', excludes: ['market'] }];",
      "export const F = ['Cheese goes to the weekly market in summer.'];",
      "export const G = { 'Cheese goes to the weekly market in summer.': Object.freeze({ needs: Object.freeze(['market']) }) };",
    ].join('\n');
    const hits = scanSource('planted.js', src);
    expect(hits).toEqual([{ file: 'planted.js', thing: 'militia', text: 'The militia drills on the green every week.' }]);
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
    ];
    expect(bad).toEqual([]);
  });
});

describe('ARM 1 — the source', () => {
  const hits = scanTree(ROOT);
  const key = (file, thing, text) => `${file}\t${thing}\t${text.slice(0, 120)}`;
  const banked = new Set(Object.entries(register.arm1).flatMap(([f, rows]) => rows.map((r) => key(f, r[0], r[2]))));
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
