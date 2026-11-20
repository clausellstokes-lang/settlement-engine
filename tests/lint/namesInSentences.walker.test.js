/**
 * namesInSentences.walker.test.js — A POWER IN A SENTENCE TAKES ITS ARTICLE; A PERSON'S SECOND MENTION IS NOT THEIR FULL
 * NAME; THE SHARE VEIL'S NAME SEARCH STILL FINDS EVERY NAME (NAMES-1, the seventh chair's rulings CN1, CN2 and CN3 of
 * 2026-11-20, each vetoable by the owner; the owner, 2026-11-20: "Do it pre deploy. I like it.").
 *
 * ── THE CLASS ─────────────────────────────────────────────────────────────────────────────────────────────────────
 * The prose a DM reads aloud named a power by its category label as a bare proper noun ("Feudal Appointee has been
 * debating market levies for three months.", "Wants to stop Religious Authorities from taking anything more from Elder
 * Council this season.") and repeated a person's full name where a pronoun belongs ("Valentina Fedorov has asked Nikoleta
 * Lebedev for a vote against Nikoleta Lebedev's own interests."). Measured at 85fccf898 on the census's 720
 * (docs/chair/2026-11-20/content/NAMES-1-CENSUS.md): 13,992 sentences with a bare label in 617 towns, 1,802 mid-sentence
 * capital "The", 9,853 sentences repeating a full name in 584 towns.
 *
 * ── THE ARMS (a born pool: the census's plan, every twentieth row, so every tier, calm and under crisis) ──────────────
 *   CN1   no stored prose sentence names a power of its town by a bare label, nor by a prose form's capital "The" in
 *         the middle of a sentence (a lone label line, a chip, a heading and a key are not sentences);
 *   CN3i  the prose form of every power and every house the veil can hide holds that power's or house's NAME as the
 *         veil folds it (`gallerySecondHomes.js :: nameFold` on the security lane: lower-cased, every run of separators
 *         one "_"; a trailing qualifier's bare form counts), so the name search still finds it;
 *   CN2   a person's full name stands at most once in a sentence (THE CEILING below, the figure the hand-back states);
 *   CN3ii no stored prose string speaks of a person by a gendered pronoun without naming a person of that gender in
 *         the same string (the veil judges string by string: a string that says only "She has bought two magistrates"
 *         would outlive the withholding of the string that named her).
 *
 * Each arm's detector is proven to catch a planted case (the CONTROLS) before it is read on the pool.
 * @enforcement-walker
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { censusPlan, configOf } from '../components/pageCensusWalk.shared.mjs';
import { powerNameInProse } from '../../src/domain/display/governanceAccount.js';
import { powerNameAfterArticle, powerSentenceName } from '../../src/domain/display/powerSentenceName.js';
import { houseSentenceName } from '../../src/data/houseSentenceName.js';
import { isHideableHouse, isVeiledPower } from '../../src/domain/people/cardVeil.js';
import {
  bareLabelsIn, foldHolds, midSentenceTheIn, partialNameIn, proseStringsOf, repeatedNamesIn, sentencesOf, unnamedPronounIn,
} from '../helpers/namesInSentences.mjs';

/** the pool: every twentieth row of the census's 720 (36 births: six tiers, calm and under crisis) */
const POOL = censusPlan('r2').filter((_, i) => i % 20 === 0);
/**
 * THE CEILING (CN2): full names repeated in one sentence over the pool's stored prose. The base's figure
 * (85fccf898) is recorded in the hand-back; the figure here is what the build leaves.
 */
const REPEATED_NAME_CEILING = 0;

/** @type {Array<{ seed: string, town: any }>} */ const born = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const row of POOL) born.push({ seed: row.seed, town: generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} }) });
}, 300_000);

/** @param {any} town @returns {string[]} the town's powers by their roster names */
const powersOf = (town) => [...new Set((town.powerStructure?.factions || []).map((/** @type {any} */ f) => String(f?.faction || f?.name || '').trim()).filter(Boolean))];
/**
 * The town's people by the name a sentence carries: a card's name with its trailing qualifier struck ("Sujin Sasaki (the
 * grove elder)" is "Sujin Sasaki" in prose), a full name of two words or more.
 * @param {any} town @returns {Array<{ name: string, gender: unknown }>}
 */
const peopleOf = (town) => (town.npcs || []).filter((/** @type {any} */ n) => typeof n?.name === 'string')
  .map((/** @type {any} */ n) => ({ name: n.name.replace(/\s*\([^)]*\)\s*$/, '').trim(), gender: n.gender }))
  .filter((p) => p.name.split(/\s+/).length >= 2);
/** @param {string} name @returns {string[]} every spelling of a power a sentence can carry */
const formsOf = (name) => [...new Set([name, powerSentenceName(name), powerNameAfterArticle(name)])].filter(Boolean);

describe('the CONTROLS: each detector catches its planted case', () => {
  const forms = formsOf('Feudal Appointee');
  it('CN1: a bare label is caught; its article form and a lone label line are not', () => {
    expect(bareLabelsIn('Feudal Appointee has been debating market levies for three months.', forms)).toEqual(['Feudal Appointee']);
    expect(bareLabelsIn('Wants to stop Religious Authorities from taking anything more.', formsOf('Religious Authorities'))).toEqual(['Religious Authorities']);
    expect(bareLabelsIn('The Feudal Appointee has been debating market levies for three months.', forms)).toEqual([]);
    expect(bareLabelsIn('Feudal Appointee', forms)).toEqual([]);
  });
  it('CN1: a prose form\'s capital "The" is caught in the middle of a sentence, never at its head', () => {
    expect(midSentenceTheIn('Take one piece of business from The Guard and bring it home.', formsOf('Military/Guard'))).toEqual(['The Guard']);
    expect(midSentenceTheIn('The Guard carries out the orders it is given.', formsOf('Military/Guard'))).toEqual([]);
  });
  it('CN2: a full name twice in one sentence is caught; once in each of two sentences is not', () => {
    const people = [{ name: 'Nikoleta Lebedev', gender: 'female' }];
    expect(repeatedNamesIn('Valentina Fedorov has asked Nikoleta Lebedev for a vote against Nikoleta Lebedev\'s own interests.', people)).toEqual(['Nikoleta Lebedev']);
    expect(sentencesOf('Nikoleta Lebedev votes against it. Nikoleta Lebedev leaves the hall.').flatMap((s) => repeatedNamesIn(s, people))).toEqual([]);
  });
  it('CN3ii: a string that speaks of her with no woman named is caught; one that names her is not', () => {
    const people = [{ name: 'Nikoleta Lebedev', gender: 'female' }, { name: 'Ivo Berger', gender: 'male' }];
    expect(unnamedPronounIn('Ivo Berger has bought two of her magistrates.', people)).toEqual(['her']);
    expect(unnamedPronounIn('Ivo Berger has bought two magistrates. She has bought the rest.', people)).toEqual(['she']);
    expect(unnamedPronounIn('Stand by Ning He in their next quarrel, whoever it is with.', [{ name: 'Ning He', gender: 'female' }])).toEqual([]);
    expect(unnamedPronounIn('Nikoleta Lebedev has bought two magistrates, and she keeps them.', people)).toEqual([]);
  });
  it('CN3ii: a person spoken of by half a name, with no one of that name named in full, is caught', () => {
    const people = [{ name: 'Eilif Dagsson' }, { name: 'Sigvald Ljotsson' }];
    expect(partialNameIn('Sigvald Ljotsson wants the position, and Dagsson wants the reputation.', people)).toEqual(['Dagsson']);
    expect(partialNameIn('Sigvald Ljotsson wants Eilif Dagsson\'s position, and Dagsson wants Ljotsson\'s reputation.', people)).toEqual([]);
  });
  it('CN3i: a prose form that drops its label\'s fold is caught; "the" + the name is not', () => {
    expect(foldHolds('the Guard', 'Military/Guard')).toBe(false);
    expect(foldHolds("the Thieves' Guild's", "Thieves' Guild")).toBe(true);
    expect(foldHolds('the Independent Bloc', 'The Independent Bloc')).toBe(true);
    expect(foldHolds('Crown Creditors', 'Crown Creditors (Noble Coalition)')).toBe(true);
  });
});

describe('the pool (every twentieth row of the census\'s 720)', () => {
  it('births every tier, calm and under crisis', () => {
    expect(new Set(POOL.map((r) => r.size)).size).toBe(6);
    expect(POOL.some((r) => r.crisis === null) && POOL.some((r) => r.crisis !== null)).toBe(true);
  });

  it('CN1: no stored prose sentence names a power of its town by a bare label', () => {
    /** @type {string[]} */ const found = [];
    for (const { seed, town } of born) {
      const forms = powersOf(town).flatMap(formsOf);
      for (const { path, text } of proseStringsOf(town)) for (const s of sentencesOf(text)) {
        for (const label of bareLabelsIn(s, forms)) found.push(`${seed} ${path} [${label}] ${s}`);
      }
    }
    expect(found.slice(0, 20), `${found.length} bare labels`).toEqual([]);
  });

  it('CN1: no stored prose sentence carries a prose form\'s capital "The" in its middle', () => {
    /** @type {string[]} */ const found = [];
    for (const { seed, town } of born) {
      const forms = powersOf(town).flatMap(formsOf);
      for (const { path, text } of proseStringsOf(town)) for (const s of sentencesOf(text)) {
        for (const label of midSentenceTheIn(s, forms)) found.push(`${seed} ${path} [${label}] ${s}`);
      }
    }
    expect(found.slice(0, 20), `${found.length} mid-sentence capitals`).toEqual([]);
  });

  // NAMES-2: the title in the negative form of its sibling arms (CN1, CN3ii); the claim is unchanged and its pool is born, not
  // pinned (`hideable` > 0 below): the anti-vacuity walker's Rule 2 reads `const born = []` as a literal list
  it('CN3i: no power or house the veil can hide has a prose form that drops its name as the veil folds it', () => {
    /** @type {string[]} */ const found = [];
    let hideable = 0;
    for (const { seed, town } of born) {
      for (const f of town.powerStructure?.factions || []) {
        if (!isVeiledPower(f)) continue;
        hideable++;
        const name = String(f.faction || f.name || '');
        for (const form of [powerNameInProse(name), powerNameInProse(name, true)]) if (!foldHolds(form, name)) found.push(`${seed} power ${name} -> ${form}`);
      }
      for (const inst of town.institutions || []) {
        if (!isHideableHouse(inst)) continue;
        hideable++;
        const name = String(inst.name || '');
        if (name && !foldHolds(houseSentenceName(name), name)) found.push(`${seed} house ${name} -> ${houseSentenceName(name)}`);
      }
    }
    expect(hideable, 'the pool holds hideable powers and houses').toBeGreaterThan(0);
    expect(found).toEqual([]);
  });

  it(`CN2: a full name stands twice in one sentence at most ${REPEATED_NAME_CEILING} times over the pool`, () => {
    /** @type {string[]} */ const found = [];
    for (const { seed, town } of born) {
      const people = peopleOf(town);
      const seen = new Set();
      for (const { path, text } of proseStringsOf(town)) for (const s of sentencesOf(text)) {
        if (seen.has(s)) continue; // a copy (prominentRelationship, the conflict's two homes) is one sentence
        seen.add(s);
        for (const name of repeatedNamesIn(s, people)) found.push(`${seed} ${path} [${name}] ${s}`);
      }
    }
    expect(found.length, found.slice(0, 20).join('\n')).toBeLessThanOrEqual(REPEATED_NAME_CEILING);
  });

  it('CN3ii: no stored prose string speaks of a person by a gendered pronoun without naming a person of that gender', () => {
    /** @type {string[]} */ const found = [];
    for (const { seed, town } of born) {
      const people = peopleOf(town);
      for (const { path, text } of proseStringsOf(town)) for (const p of unnamedPronounIn(text, people)) found.push(`${seed} ${path} [${p}] ${text}`);
    }
    expect(found.slice(0, 20), `${found.length} unnamed pronouns`).toEqual([]);
  });

  it('CN3ii: no stored prose string speaks of a person by half a name without naming in full a person of that name', () => {
    /** @type {string[]} */ const found = [];
    for (const { seed, town } of born) {
      const people = peopleOf(town);
      for (const { path, text } of proseStringsOf(town)) for (const p of partialNameIn(text, people)) found.push(`${seed} ${path} [${p}] ${text}`);
    }
    expect(found.slice(0, 20), `${found.length} half names`).toEqual([]);
  });
});
