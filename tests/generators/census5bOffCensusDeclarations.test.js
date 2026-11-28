/**
 * CENSUS-5b (2026-11-05), unit 2 — the off-census Power, Defense and Faith pools declared
 * (`docs/DESIGN_POOL_CENSUS.md` §3.1: a line declares the atoms it presumes BEYOND its branch's
 * key; the twins stand beside their originals as declared sibling sets, CENSUS-1c's shape).
 *
 * TWO KINDS OF SITE (R-C):
 *   - WIRED: `governanceNarrative.js :: BASELINE_CONFLICT_SIBLINGS`, which CENSUS-1c already
 *     resolves through `resolveSibling` at the baseline conflict. A key added there is enforced
 *     at once; its twin moves exactly the births whose record refuses the original (a T site has
 *     no draw, so a twin adds no 1/(n+1) share). Measured on the 1,000 before the change: the
 *     church's "market day activities" line printed in 15 places and was false in 13 (no market,
 *     soak1k-18); "sells the most at market" in 1, false in 1 (soak1k-252).
 *   - NOT WIRED (CENSUS-1d's): the safety profile, the faction descriptions, the faction names,
 *     the threat templates and the transfer-of-power tables. Their declarations are CARRIED
 *     beside the originals (byte-identical: no consumer reads them yet) so 1d's wiring enforces
 *     them; this file pins that they are well formed and that each twin answers its original.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { resolveSibling } from '../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { FACT_DIMENSIONS, assertDeclarable, declarationOf, declarationAdmits, parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { BASELINE_CONFLICT_SIBLINGS } from '../../src/generators/power/governanceNarrative.js';
import { SAFETY_LINE_SIBLINGS } from '../../src/generators/safetyProfile.js';
import { FACTION_DESC_SIBLINGS } from '../../src/generators/power/rulingStructure.js';
import { FACTION_NAME_SIBLINGS } from '../../src/data/powerData.js';
import { THREAT_TEXT_SIBLINGS } from '../../src/domain/threatProfile.js';
import { RULING_POWER_SIBLINGS } from '../../src/domain/rulingPower.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';

const SOURCES = Object.freeze({
  'src/generators/power/governanceNarrative.js': BASELINE_CONFLICT_SIBLINGS,
  'src/generators/safetyProfile.js': SAFETY_LINE_SIBLINGS,
  'src/generators/power/rulingStructure.js': FACTION_DESC_SIBLINGS,
  'src/data/powerData.js': FACTION_NAME_SIBLINGS,
  'src/domain/threatProfile.js': THREAT_TEXT_SIBLINGS,
  'src/domain/rulingPower.js': RULING_POWER_SIBLINGS,
});

/** The five baseline conflicts this lane declares at the wired site: [original, the atom]. */
const WIRED = Object.freeze([
  ['The village militia captain is pushing for authority over disputes that the reeve used to handle.', 'militia'],
  ['The miller and the largest farming household are in dispute over prices and access.', 'institution: mill'],
  ['The household that sells the most at market has been throwing its weight around in community decisions.', 'market'],
  ["Two households have been undercutting each other on market day for months. Last week someone's cart was damaged. No one saw anything.", 'market'],
  ['The church wants approval rights over market day activities. The village reeve disagrees.', 'market'],
]);

/**
 * "LAWFUL SOMEWHERE" FOR A BAND ATOM (COHERENCE-UPKEEP, 2026-11-12). The calm admit-all double
 * holds every PRESENCE atom; a BAND atom is an ordered fact that no one fixed value answers for
 * every line (`prosperity: ≥ moderate` and `prosperity: ≤ poor` cannot both hold at one rung), so
 * the double carries none, and a band-declared original read as never lawful. Such an original is
 * lawful somewhere when the same calm record, at some rung of the band's OWN ladder
 * (`FACT_DIMENSIONS[dim].order`), admits it. A presence atom is read exactly as before.
 * @param {ReturnType<typeof declarationOf>} decl
 */
function lawfulSomewhere(decl) {
  if (declarationAdmits(decl, CALM_FACTS_ADMIT_ALL).admitted) return true;
  const bands = [...new Set(decl.needs.map((a) => parseAtom(a)).filter((a) => a && FACT_DIMENSIONS[a.dimension].shape === 'band' && Array.isArray(FACT_DIMENSIONS[a.dimension].order)).map((a) => a.dimension))];
  return bands.some((dim) => FACT_DIMENSIONS[dim].order.some((rung) => declarationAdmits(decl, { ...CALM_FACTS_ADMIT_ALL, [FACT_DIMENSIONS[dim].home]: rung }).admitted));
}

/** A names-only record, the shape the baseline-conflict site hands `factsOf`. */
const namesFacts = (/** @type {string[]} */ names) => factsOf({ institutions: names.map((name) => ({ name })) });
const OPTS = (/** @type {any} */ facts) => ({ facts, poolId: 'test', drawKind: /** @type {'T'} */ ('T') });

/** Every string the record stores, depth-first. @param {unknown} v @param {string[]} [out] */
function strings(v, out = []) {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out));
  return out;
}

/** @type {Record<number, string[]>} */
const TEXT = {};
beforeAll(async () => {
  await ensureLaws();
  for (const i of [18, 252]) TEXT[i] = strings(birth(i).settlement);
}, 120_000);

describe('CENSUS-5b unit 2 · the wired baseline conflicts', () => {
  for (const [line, atom] of WIRED) {
    it(`"${line.slice(0, 48)}…" declares ${atom} and resolves to its twin where the record lacks it`, () => {
      const set = BASELINE_CONFLICT_SIBLINGS[line];
      expect(set, 'a declared sibling set keyed by the original').toBeTruthy();
      expect(declarationOf(set[0]).needs).toContain(atom);
      const twin = set.find((l) => l.twinOf === line);
      expect(twin, 'its twin').toBeTruthy();
      // the record that holds the atom keeps the original; the one that lacks it reads the twin
      expect(resolveSibling(line, BASELINE_CONFLICT_SIBLINGS, OPTS(namesFacts(['citizen militia', 'water mill', 'market square'])))).toBe(line);
      expect(resolveSibling(line, BASELINE_CONFLICT_SIBLINGS, OPTS(namesFacts(['village shrine'])))).toBe(twin.text);
    });
  }

  it('soak1k-18 (a thorp with no market) no longer stores the church\'s "market day activities"', () => {
    expect(TEXT[18].some((s) => s.includes('market day activities'))).toBe(false);
    expect(TEXT[18].some((s) => s.includes('want a say over who may trade and when'))).toBe(true); // R2-CODE-A item 5 (the chair's P3): the twin, re-keyed by identity, names no church and no reeve the thorp lacks
  });

  it('soak1k-252 (no market) no longer stores "sells the most at market"', () => {
    expect(TEXT[252].some((s) => s.includes('sells the most at market'))).toBe(false);
    expect(TEXT[252].some((s) => s.includes('sells the most beyond the settlement'))).toBe(true);
  });
});

/**
 * THE COMPLEMENT RULE, NARROWED (COHERENCE-AGREE-6, the chair's ruling of 2026-11-12, on the upkeep lane's four lines
 * that name the garrison or the hired company): a twin is the complement of its original on the ONE atom the pair is
 * KEYED on, and on no other. An atom both lines name, both declare, the same way (a denial is declared as a denial).
 * The old rule (the twin excludes exactly what the original needs) made a twin refuse a second atom it still names.
 * The key is the one atom whose polarity flips (the original's need the twin refuses, or its refusal the twin needs);
 * every other atom the twin declares, the original declares the same way.
 * @param {{ needs: string[], excludes: string[] }} original @param {{ needs: string[], excludes: string[] }} twin
 */
function twinAnswersOnItsKey(original, twin) {
  const flipped = [...original.needs.filter((a) => twin.excludes.includes(a)), ...original.excludes.filter((a) => twin.needs.includes(a))];
  if (flipped.length !== 1) return false;
  const [key] = flipped;
  return twin.needs.every((a) => a === key || original.needs.includes(a))
    && twin.excludes.every((a) => a === key || original.excludes.includes(a));
}

describe('CENSUS-5b · the complement rule is keyed on one atom (the chair\'s ruling of 2026-11-12)', () => {
  it('a pair keyed on the walls, both naming the garrison: the twin refuses the walls and declares the garrison too', () => {
    const original = { needs: ['walls', 'garrison'], excludes: [] };
    expect(twinAnswersOnItsKey(original, { needs: ['garrison'], excludes: ['walls'] })).toBe(true);
    // the old rule's twin, refusing the garrison it still names, is not the complement on its key
    expect(twinAnswersOnItsKey(original, { needs: [], excludes: ['walls', 'garrison'] })).toBe(false);
    // a twin that flips nothing, or declares against the original off its key, does not answer it
    expect(twinAnswersOnItsKey(original, { needs: ['walls', 'garrison'], excludes: [] })).toBe(false);
    expect(twinAnswersOnItsKey(original, { needs: ['garrison'], excludes: ['walls', 'market'] })).toBe(false);
    // a denial keyed pair: the original refuses the market, its twin needs it
    expect(twinAnswersOnItsKey({ needs: ['garrison'], excludes: ['market'] }, { needs: ['garrison', 'market'], excludes: [] })).toBe(true);
  });
});

/**
 * The well-formedness rows of one sibling table against the source that prints it (the check
 * below, lifted whole into a function on 2026-11-12 so the planted controls run the SAME code).
 * @param {Record<string, ReadonlyArray<any>>} table @param {string} source @returns {string[]}
 */
function malformedRows(table, source) {
  const bad = [];
  for (const key of Object.keys(table)) {
    const set = table[key];
    // the key's opening words stand in the source (a concatenated literal is keyed whole)
    const head = key.trim().slice(0, 32).replace(/'/g, "\\'");
    if (!source.includes(key.trim().slice(0, 32)) && !source.includes(head)) bad.push(`not in source: ${key.slice(0, 60)}`);
    if (set[0].text !== key) bad.push(`the first member is not the original: ${key.slice(0, 60)}`);
    for (const line of set) {
      const d = declarationOf(line);
      for (const atom of [...d.needs, ...d.excludes]) {
        try { assertDeclarable(atom); } catch (e) { bad.push(String(e)); }
      }
      if (line.twinOf !== undefined && line.twinOf !== key) bad.push(`twin of another line: ${line.text.slice(0, 60)}`);
    }
    const original = declarationOf(set[0]);
    expect(original.needs.length + original.excludes.length + original.crisis.length, key).toBeGreaterThan(0);
    // the original is admitted by the calm admit-all record (it is lawful somewhere)
    if (!lawfulSomewhere(original) && !original.crisis.length) bad.push(`never lawful: ${key.slice(0, 60)}`);
    // a twin is the complement of its original on the atom the pair is keyed on, and on no other
    // (COHERENCE-AGREE-6's narrowed rule); an original declared on the crisis dimension carries its
    // crisis disjunction as ONE atom on the needs side (`stressNarrative.js`' idiom, the upkeep
    // lane's crisis lines), so a crisis-keyed pair flips on that atom
    const twin = set.find((l) => l.twinOf === key);
    if (twin) {
      const keyed = { needs: [...original.needs, ...(original.crisis.length ? [`crisis: ${original.crisis.join(', ')}`] : [])], excludes: [...original.excludes] };
      if (!twinAnswersOnItsKey(keyed, declarationOf(twin))) bad.push(`twin is not the complement on its key: ${key.slice(0, 60)}`);
    }
  }
  return bad;
}

describe('CENSUS-5b unit 2 · every declared sibling set is well formed', () => {
  for (const [file, table] of Object.entries(SOURCES)) {
    it(`${file}: each key is a line the source prints, each atom is declarable, each twin answers its original`, () => {
      const source = readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');
      expect(Object.keys(table).length).toBeGreaterThan(0);
      expect(malformedRows(table, source)).toEqual([]);
    });
  }
});

/**
 * THE BAND ARM STILL CONVICTS (the chair's condition of 2026-11-12 on 944d2d28f). Planted one-set
 * tables run through the same check: a line whose band atoms no rung of its ladder satisfies
 * together, and a line on a ladder rung or a ladder that does not exist, are each "never lawful";
 * a line lawful on exactly one rung passes. A presence-declared line is read as before.
 */
describe('CENSUS-5b unit 2 · the lawful-somewhere arm, planted', () => {
  /** A one-set table whose source prints its key. @param {string} text @param {string[]} needs */
  const planted = (text, needs) => {
    const table = { [text]: Object.freeze([Object.freeze({ text, needs }), Object.freeze({ text: `${text} (twin)`, twinOf: text, excludes: needs })]) };
    return malformedRows(table, `'${text}'`);
  };

  it('RED: a line needing at least Moderate AND at most Poor is lawful on no rung', () => {
    expect(planted('Planted line one, both ends of the purse.', ['prosperity: ≥ moderate', 'prosperity: ≤ poor']))
      .toContain('never lawful: Planted line one, both ends of the purse.');
  });

  it('RED: a line on a rung its ladder lacks, or on a ladder that does not exist, is never lawful', () => {
    expect(planted('Planted line two, an opulent rung.', ['prosperity: ≥ opulent'])).toContain('never lawful: Planted line two, an opulent rung.');
    expect(planted('Planted line three, no such ladder.', ['opulence: ≥ high'])).toContain('never lawful: Planted line three, no such ladder.');
  });

  it('GREEN: a line lawful on exactly one rung passes, and a presence line reads as before', () => {
    const one = declarationOf({ text: 'x', needs: ['prosperity: = poor'] });
    const rungs = FACT_DIMENSIONS.prosperity.order.filter((rung) => declarationAdmits(one, { ...CALM_FACTS_ADMIT_ALL, prosperity: rung }).admitted);
    expect(rungs, 'anchored: exactly one rung admits it').toEqual(['poor']);
    expect(planted('Planted line four, one rung.', ['prosperity: = poor'])).toEqual([]);
    expect(planted('Planted line five, walls.', ['walls'])).toEqual([]);
  });
});
