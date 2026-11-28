/**
 * Lane DEFENSE-2 (2026-11-03): the culture, stress and wartime lines check the roster before
 * they speak.
 *
 * Three generation-time lines spoke of a garrison, soldiers or walls on places that have none:
 * the culture's Defense row (`cultureProfiles.js` defensePattern, printed by the PDF's culture
 * rows), the NPC stress secrets (`stressInstitutionEffects.js`) and the wartime summary
 * (`stressNarrative.js`). None of their draw sites holds the roster (the identity is drawn in
 * resolveConfig before any institution exists; the secret and the summary are drawn from the
 * stress type alone), so each line must be true on EVERY roster: it names no garrison, soldiers
 * or walls, and says what the tradition or the crisis does instead. The proof is therefore
 * exhaustive over the data rather than a corpus: every variant is checked against an EMPTY
 * roster, which is the hardest roster there is.
 *
 * And the thorp's "Household levy" is a militia: the bucket vocabulary did not match it, so the
 * engine and the Defense tab read a levy thorp as having no force at all.
 */
import { textOf } from '../../src/domain/facts/textOf.js';
import { beforeAll, describe, expect, it } from 'vitest';

import { CULTURE_PROFILES } from '../../src/data/cultureProfiles.js';
import { STRESS_INSTITUTION_EFFECTS } from '../../src/data/stressInstitutionEffects.js';
import { renderStressSummary } from '../../src/generators/stressNarrative.js';
import { defenseWordsFindings } from '../../src/domain/coherence/defenseWordsFindings.js';
import { defenseFactsOf } from '../../src/domain/defense/defenseFacts.js';
import { standingDefenseForces } from '../../src/domain/institutions/defenseInstitutionBuckets.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

/** A place with nothing on its roster: no walls, no force, no hospital. */
const BARE = Object.freeze({ institutions: [] });

/** The checker's terms, plus the singular "wall", which makes the same claim. */
const SINGULAR_WALL_RE = /\b(?:outer |town |city )?wall\b/i;

/** @param {string} text @returns {string[]} what the text claims that a bare roster lacks */
const claimsOnBareRoster = (text) => [
  ...defenseWordsFindings(BARE, text).map((f) => f.term),
  ...(SINGULAR_WALL_RE.test(text) ? ['wall'] : []),
];

describe('the culture Defense row is true on every roster', () => {
  it('no defensePattern variant of any culture names a garrison, soldiers or walls', () => {
    const offenders = Object.entries(CULTURE_PROFILES).flatMap(([key, profile]) =>
      profile.defensePattern
        .map(textOf).map((line) => [key, line, claimsOnBareRoster(line)])
        .filter(([, , terms]) => terms.length > 0));
    expect(offenders, 'culture lines that claim a defence the roster may lack').toEqual([]);
  });
});

describe('the NPC stress secrets are true on every roster', () => {
  it('no stress secret or its stakes names a garrison, soldiers or walls', () => {
    const offenders = Object.entries(STRESS_INSTITUTION_EFFECTS).flatMap(([stress, effects]) =>
      effects
        .map((e) => [stress, `${e.secret} / ${e.stakes}`, claimsOnBareRoster(`${e.secret}. ${e.stakes}.`)])
        .filter(([, , terms]) => terms.length > 0));
    expect(offenders, 'stress secrets that claim a defence the roster may lack').toEqual([]);
  });
});

describe('the wartime summary is true on every roster', () => {
  it('neither wartime summary names a garrison, soldiers or walls', () => {
    for (const roll of [{ profit: true }, { profit: false }]) {
      const text = renderStressSummary('wartime', 'Ashford', roll);
      expect(claimsOnBareRoster(text), `wartime summary (profit ${roll.profit})`).toEqual([]);
    }
  });
});

describe('the Household levy is a militia', () => {
  it('a roster of one Household levy stands a militia, and the facts name it as the force', () => {
    const levy = { institutions: [{ name: 'Household levy', category: 'Defense' }] };
    expect(standingDefenseForces(levy).militia.names, 'the militia bucket').toEqual(['Household levy']);
    const facts = defenseFactsOf(levy);
    expect(facts.hasMilitia, 'hasMilitia').toBe(true);
    expect(facts.forceName, 'forceName').toBe('Household levy');
  });

  describe('on the generated thorp that carries one (seed defense-thorp-0)', () => {
    /** @type {any} */
    let thorp;
    beforeAll(async () => {
      await loadGenerationLawPayloads();
      thorp = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'thorp' }), null,
        { seed: 'defense-thorp-0' });
    });
    it('the record carries a Household levy and the facts read it as the militia', () => {
      expect((thorp.institutions || []).map((i) => i.name), 'the roster').toContain('Household levy');
      expect(defenseFactsOf(thorp).hasMilitia, 'hasMilitia on the generated thorp').toBe(true);
    });
  });
});
