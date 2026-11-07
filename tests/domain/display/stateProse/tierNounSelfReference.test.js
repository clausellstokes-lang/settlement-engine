/**
 * tierNounSelfReference.test.js — A SMALL PLACE IS CALLED BY ITS OWN NOUN, NOT "A TOWN"
 * (SIZE lane, coherence program, 2026-11-03, root-cause failure 8 fix shape D).
 *
 * THE DEFECT. The rewriter moved only 'the town' / 'this town', on the belief that an
 * indefinite 'a town' compares this place with somewhere else. Measured over the six
 * dossier corpora, it mostly does not: "This is a town that sells.", "Every town this size
 * has both.", "It is an ordinary town's arithmetic", "the whole town has that directness"
 * all describe the settlement itself. On a thorp they printed "town".
 *
 * THE CURE. `speakTierNoun` also moves an indefinite, quantified or adjectival singular
 * reference ('a town', 'an ordinary town', 'every town', 'a poorly-paid, poorly-policed
 * town', 'the whole town', 'the wrong town'), and keeps the genuine comparisons by an
 * explicit, measured allow-list (`TIER_NOUN_KEPT`). A plural ('towns') is never moved.
 */
import { describe, expect, it } from 'vitest';

import { speakTierNoun, TIER_NOUN_KEPT } from '../../../../src/domain/display/stateProse/stateProseKernel.js';
import { tierNounFindings } from '../../../../src/domain/coherence/tierNounFindings.js';
import { parseAtom } from '../../../../src/domain/facts/factVocabulary.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../../../src/data/dossierStateProse/warFaith.generated.js';

describe('speakTierNoun — the self-references the corpus writes as "a town"', () => {
  // ⚠ INVENTED WORDING, NOT CORPUS LINES: a corpus sentence quoted here would be a literal
  // state-prose anchor (tests/lint/proseDrawnAnchors.walker.test.js). The SHAPES are the
  // corpus's (indefinite, quantified, two hyphenated modifiers, a measured definite modifier);
  // the corpus itself is walked whole in the arm below.
  it.each([
    ['Plainly this is a town that bargains.', 'thorp', 'Plainly this is a thorp that bargains.'],
    ['Its wells are an ancient town\'s pride.', 'thorp', 'Its wells are an ancient thorp\'s pride.'],
    ['Every town of its kind keeps a pound.', 'hamlet', 'Every hamlet of its kind keeps a pound.'],
    ['A town that saves keeps its nerve.', 'village', 'A village that saves keeps its nerve.'],
    ['a well-fed, well-led town is hard to rattle', 'village', 'a well-fed, well-led village is hard to rattle'],
    ['The fair drew the whole town out.', 'thorp', 'The fair drew the whole thorp out.'],
    ['He took the wrong road and found the wrong town.', 'hamlet', 'He took the wrong road and found the wrong hamlet.'],
    ['The town is still a town at heart.', 'village', 'The village is still a village at heart.'],
    ['The well in this town is deep; the town is proud of it.', 'thorp', 'The well in this thorp is deep; the thorp is proud of it.'],
    ['Rations run short in a besieged town.', 'city', 'Rations run short in a besieged city.'],
    ['Nobody yet knows if the outer town counts.', 'hamlet', 'Nobody yet knows if the outer hamlet counts.'],
  ])('%s  (%s)', (line, noun, spoken) => {
    expect(speakTierNoun(line, noun)).toBe(spoken);
  });

  it('every KEPT phrase survives on a thorp (a licensed one on its own tier), and the self-reference beside it still moves', () => {
    for (const { phrase, tiers } of TIER_NOUN_KEPT) {
      const tier = tiers ? tiers[0] : 'thorp';
      const line = `Nobody here minds ${phrase}, and this town says so.`;
      expect(speakTierNoun(line, tier), phrase).toBe(`Nobody here minds ${phrase}, and this ${tier} says so.`);
    }
  });

  it('a plural is never moved', () => {
    const line = 'Other towns trade wool; towns like that rarely starve.';
    expect(speakTierNoun(line, 'thorp')).toBe(line);
  });

  it('a TOWN and an unknown noun return the line by identity', () => {
    const line = 'Plainly this is a town that bargains, and every town of its kind knows it.';
    expect(speakTierNoun(line, 'town')).toBe(line);
    expect(speakTierNoun(line, null)).toBe(line);
  });

  it('a determiner-like word between the article and the noun refuses the indefinite read', () => {
    // anchored: 'the town' inside still moves through the definite rule
    expect(speakTierNoun('It is a margin the town can carry.', 'thorp')).toBe('It is a margin the thorp can carry.');
  });

  it('a refused candidate does not swallow the reference inside it', () => {
    expect(speakTierNoun('He counts the ones a town forgets.', 'hamlet')).toBe('He counts the ones a hamlet forgets.');
  });

  it('every kept phrase carries its reason (no unexplained entries)', () => {
    expect(TIER_NOUN_KEPT.length).toBeGreaterThan(5);
    for (const kept of TIER_NOUN_KEPT) expect(kept.why, kept.phrase).toMatch(/\S/);
  });
});

/**
 * Every string leaf of a corpus object, except a variant's mark that parses as a fact atom.
 *
 * ⚠ MARKS ARE DECLARATIONS, NEVER PRINTED (census-3c unit 4, 586bedd7f). The DS-POP exodus lines
 * declare the band atom `tier: >= town` (factVocabulary.js: `tier: ≥ town`, parsed alike), which
 * names a tier BY DESIGN and is read by the kernel, never spoken; no mark carried "town" before
 * it (this file 24/24 green at 586bedd7f^, the four corpus arms red at 586bedd7f on exactly the
 * three `tier: >= town` marks). Every printed string, and every mark that is not an atom
 * (`dm-only`, `colour`, the kernel's words), is still walked.
 */
function leaves(node, out = []) {
  if (typeof node === 'string') out.push(node);
  else if (Array.isArray(node)) for (const v of node) leaves(v, out);
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      leaves(k === 'marks' && Array.isArray(v) ? v.filter((m) => parseAtom(m) === null) : v, out);
    }
  }
  return out;
}

describe('the whole dossier corpus, spoken as a thorp, carries no "town" outside a kept phrase', () => {
  const corpora = {
    economy: DOSSIER_STATE_PROSE_ECONOMY, general: DOSSIER_STATE_PROSE_GENERAL,
    defense: DOSSIER_STATE_PROSE_DEFENSE, power: DOSSIER_STATE_PROSE_POWER,
    stressors: DOSSIER_STATE_PROSE_STRESSORS, warFaith: DOSSIER_STATE_PROSE_WAR_FAITH,
  };
  it.each(['thorp', 'hamlet', 'village', 'city'])('as a %s', (tier) => {
    const offenders = [];
    let towny = 0;
    for (const [name, corpus] of Object.entries(corpora)) {
      for (const line of leaves(corpus)) {
        if (!/\btown\b/i.test(line)) continue;
        towny += 1;
        for (const f of tierNounFindings({ tier }, speakTierNoun(line, tier))) offenders.push(`${name}: ${f.context}`);
      }
    }
    expect(towny, 'the corpus walk read no "town" line at all; it is testing nothing').toBeGreaterThan(500);
    expect(offenders).toEqual([]);
  });
});

describe('tierNounFindings — the standalone check', () => {
  it('finds "this town" planted on a thorp, and nothing on a town', () => {
    const text = 'The roads into this town are busy.';
    expect(tierNounFindings({ tier: 'thorp' }, text).length).toBeGreaterThanOrEqual(1);
    expect(tierNounFindings({ tier: 'thorp' }, text)[0].phrase).toBe('town');
    expect(tierNounFindings({ tier: 'town' }, text)).toEqual([]);
  });

  it('keeps an allow-listed comparison and a plural, and finds the self-reference beside them', () => {
    const text = 'Nobody envies a larger town; other towns do. Plainly this is a town that bargains.';
    const found = tierNounFindings({ tier: 'hamlet' }, text);
    expect(found).toHaveLength(1);
    expect(found[0].context).toContain('this is a town that bargains');
  });

  it('answers [] for an unknown tier or no text, rather than guessing', () => {
    expect(tierNounFindings({ tier: 'borough' }, 'this town')).toEqual([]);
    expect(tierNounFindings({ tier: 'thorp' }, '')).toEqual([]);
    expect(tierNounFindings(null, 'this town')).toEqual([]);
  });
});
