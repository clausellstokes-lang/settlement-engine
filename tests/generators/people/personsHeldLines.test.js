/**
 * personsHeldLines.test.js — POWERS-9 (ROUND-3-CUT-INCREMENT HIGH ww#449, MEDIUM ww#178 ww#1137; the chair's ruling of
 * 2026-11-13): A LINE THAT SPEAKS OF SLAVERY, OR OF PERSONS BOUGHT, SOLD OR HELD, IS NOT DEALT WHERE THE TOWN'S OWN
 * CONTENT SETTINGS EXCLUDE SLAVERY OR TRAFFICKING. The lanista's and the pit boss's "Buys fighters who were taken against
 * their will, and keeps them in chains between bouts" printed on cards in towns whose settings (the grounded profile:
 * slavery false, trafficking false) exclude both: rww-metropolis-wartime-1, rww-metropolis-calm-1,
 * rww-metropolis-under_siege-1. The row reads the setting through the governed content topics
 * (domain/generationContentProfile.js :: GENERATED_CONTENT_TOPICS) declared beside the title table
 * (data/people/titleSecretsPresentations.js :: TITLE_LINE_DECLARATIONS); a refused line takes the title's next admitted
 * line (a twin true of the town), draw-free (people/poolMap.js :: settleTitleLines).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { GENERATED_CONTENT_TOPICS, resolveGenerationContentProfile } from '../../../src/domain/generationContentProfile.js';
import { TITLE_LINE_DECLARATIONS, TITLE_PRESENTATIONS, TITLE_SECRETS } from '../../../src/data/people/titleSecretsPresentations.js';
import { settleTitleLines } from '../../../src/generators/people/poolMap.js';

const CHAINS = 'Buys fighters who were taken against their will, and keeps them in chains between bouts';
const LOCKED = 'Buys fighters who were taken against their will and keeps them locked up between bouts';
const PEOPLE = 'Thick-necked and scarred, with the eye of someone who buys and sells people.';
const APPRENTICE = 'Has kept an apprentice on for years past the indenture by holding back the papers that would free them';
const HELD = /against their will|in chains|locked up between bouts|buys and sells people|papers that would free them/;

/** @param {string} seed */
function born(seed) {
  const m = seed.match(/^rww-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-\d+$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
}
const asTopics = (/** @type {unknown} */ t) => (/** @type {string[]} */ ([])).concat(/** @type {any} */ (t) || []);

describe('POWERS-9 · persons bought, sold or held: the declarations', () => {
  it('each such line declares BOTH governed topics, and its title keeps an undeclared line of each kind', () => {
    for (const line of [CHAINS, LOCKED, APPRENTICE]) {
      expect(asTopics(TITLE_LINE_DECLARATIONS.secret[line]?.topic).sort(), line).toEqual(['human_trafficking', 'slavery']);
    }
    expect(asTopics(TITLE_LINE_DECLARATIONS.presentation[PEOPLE]?.topic).sort()).toEqual(['human_trafficking', 'slavery']);
    for (const d of [...Object.values(TITLE_LINE_DECLARATIONS.secret), ...Object.values(TITLE_LINE_DECLARATIONS.presentation)]) {
      for (const t of asTopics(d.topic)) expect(GENERATED_CONTENT_TOPICS).toContain(t);
    }
    for (const title of ['the lanista', 'the pit boss', 'the master carpenter']) {
      expect(TITLE_SECRETS[title].some((r) => !TITLE_LINE_DECLARATIONS.secret[r.secret]), title).toBe(true);
      expect(TITLE_PRESENTATIONS[title].some((r) => !TITLE_LINE_DECLARATIONS.presentation[r.impression]), title).toBe(true);
    }
  });

  it('settleTitleLines: refused under either exclusion, kept (the guard) where the settings admit both', () => {
    const card = () => ({ secret: { what: CHAINS, stakes: 'x' }, presentation: { impression: PEOPLE } });
    const both = { slavery: true, human_trafficking: true, torture: false, hard_drugs: false };
    const kept = settleTitleLines(card(), 'the lanista', { facts: null, boundaries: both, held: null });
    expect(kept.secret.what).toBe(CHAINS);
    expect(kept.presentation.impression).toBe(PEOPLE);
    for (const boundaries of [{ ...both, slavery: false }, { ...both, human_trafficking: false }, resolveGenerationContentProfile({}).boundaries]) {
      const c = settleTitleLines(card(), 'the lanista', { facts: null, boundaries, held: null });
      expect(TITLE_SECRETS['the lanista'].map((r) => r.secret)).toContain(c.secret.what);
      expect(c.secret.what).not.toMatch(HELD); // anchored: the line above asserts this secret is a live row of the lanista's own pool
      expect(TITLE_PRESENTATIONS['the lanista'].map((r) => r.impression)).toContain(c.presentation.impression);
      expect(c.presentation.impression).not.toMatch(HELD); // anchored: the line above asserts this impression is a live row of the lanista's own pool
    }
  });
});

describe('POWERS-9 · the readers\' towns print no line of persons held under the grounded settings', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it.each(['rww-metropolis-wartime-1', 'rww-metropolis-calm-1', 'rww-metropolis-under_siege-1'])('%s', (seed) => {
    const s = born(seed);
    expect(resolveGenerationContentProfile(s.config).boundaries.slavery).toBe(false);
    const held = s.npcs.filter((c) => HELD.test(c.secret?.what || '') || HELD.test(c.presentation?.impression || ''))
      .map((c) => `${c.title}: ${c.secret?.what} / ${c.presentation?.impression}`);
    expect(held).toEqual([]);
  }, 60_000);
});
