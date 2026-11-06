/**
 * F1 DEFENCE-WORDS, UNIT 3 — THE CATALOGUE BELOW TOWN (soak 1000 rung 1B; PLACE-NOT-TIER unit 5:
 * "a village may raise a watch" needs a watch row in the village catalogue).
 *
 * The Village watch is a rolled village row, never required, weighted by the military slider
 * like every defence row (`institutionProbability.js :: getBaseChance`), and the one defence
 * reader (`defenseFacts.js :: defenseFactsOf`) reads it as a watch, so a watch village keeps its
 * Guard Captain. The hamlet's militia row already stands (the `Citizen militia` hamlet rung).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { cellFor, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { birthConfig } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { getBaseChance } from '../../src/generators/institutionProbability.js';
import { defenseFactsOf } from '../../src/domain/defense/defenseFacts.js';
import { INSTITUTION_DESC_VARIANTS } from '../../src/data/institutionDescVariants.js';

/** @param {string} tier @returns {any} */
const watchRowAt = (tier) => /** @type {any} */ (institutionalCatalog)[tier]?.Defense?.['Village watch'];

describe('the Village watch row', () => {
  it('stands in the village catalogue only, rolled and never required', () => {
    const row = watchRowAt('village');
    expect(row).toBeTruthy();
    expect(row.required).not.toBe(true);
    expect(row.baseChance).toBeGreaterThan(0);
    for (const tier of ['thorp', 'hamlet', 'town', 'city', 'metropolis']) expect(watchRowAt(tier)).toBeUndefined();
  });

  it('is weighted by the military slider ×slider/50', () => {
    const at = (/** @type {number} */ m) => getBaseChance(0.2, 'Defense', 'Village watch', { priorityMilitary: m, priorityEconomy: 50, priorityReligion: 50, priorityCriminal: 50, priorityMagic: 50 }, null);
    expect([at(0), at(50), at(100)]).toEqual([0, 0.2, 0.4]);
  });

  it('reads as a watch on the defence record', () => {
    const f = defenseFactsOf({ institutions: [{ name: 'Village watch' }] });
    expect([f.hasWatch, f.hasGarrison, f.hasMilitia]).toEqual([true, false, false]);
  });
});

describe('a village at slider 100 that raises a watch (f1u3-village-100-6)', () => {
  /** @type {any} */ let s;
  beforeAll(async () => {
    await ensureLaws();
    const cell = cellFor(6 * 6 + 2);
    s = generateSettlementPipeline(birthConfig({ ...cell.input, settType: 'village', priorityMilitary: 100 }), null, { seed: 'f1u3-village-100-6' });
  });

  it('holds the Village watch and a Guard Captain to lead it', () => {
    expect(s.institutions.map((/** @type {any} */ i) => i.name)).toContain('Village watch');
    expect(defenseFactsOf(s).hasWatch).toBe(true);
    expect(s.npcs.map((/** @type {any} */ n) => n.role)).toContain('Guard Captain');
  });
});

/**
 * THE ROTA PRESUMES NO GOVERNOR (LANDING-7 lane H, FIX-6, 2026-11-06). The watch's catalogue line and both
 * desc variants said the HEADMAN keeps the rota, while the record seats another governor in 7 of the 14
 * villages of `soak1k-0..999` that raise a watch (the verifier's governance probe, re-measured: Headman's
 * Authority 7, Elected Reeve 2, Feudal Stewardship 2, Elder Council 1, Priestly Guidance 1, Household
 * Council 1). The three lines now say who keeps the rota without naming an office. The corpus arm reads every
 * printed sentence that speaks of the rota on those 14 records; the catalogue arm reads the three lines.
 */
const WATCH_VILLAGES = Object.freeze([38, 56, 134, 164, 176, 344, 476, 494, 596, 608, 662, 758, 764, 872]);
const OFFICE = /\b(headman|reeve|steward|elders?|priests?)\b/i;

/** @param {unknown} node @param {string[]} out @returns {string[]} Every sentence in the record that speaks of the rota. */
const rotaSentences = (node, out = []) => {
  if (typeof node === 'string') {
    if (/\brota\b/i.test(node)) out.push(...node.split(/(?<=[.;!?])\s+/).filter((t) => /\brota\b/i.test(t)));
  } else if (node && typeof node === 'object') {
    for (const value of Object.values(node)) rotaSentences(value, out);
  }
  return out;
};

describe('the watch line names no governor the record does not seat (FIX-6)', () => {
  it('the catalogue line and both variants presume no particular office', () => {
    const lines = [watchRowAt('village').desc, ...INSTITUTION_DESC_VARIANTS['village|Defense|Village watch']];
    expect(lines).toHaveLength(3);
    for (const line of lines) {
      expect(line).toMatch(/\brota\b/);
      expect(line).not.toMatch(OFFICE); // anchored: the positive toMatch above pins this same line
    }
  });

  it('on the 14 watch villages of soak1k-0..999, no printed rota sentence names a headman the record does not seat', async () => {
    await ensureLaws();
    const offenders = [];
    let otherGovernor = 0;
    for (const i of WATCH_VILLAGES) {
      const cell = cellFor(i);
      const s = /** @type {any} */ (generateSettlementPipeline(birthConfig(cell.input), null, { seed: cell.seed }));
      expect(s.institutions.map((/** @type {any} */ x) => x.name), `soak1k-${i}`).toContain('Village watch');
      const governor = String(s.powerStructure?.governingName ?? '');
      const sentences = rotaSentences(s);
      expect(sentences.length, `soak1k-${i} prints no rota sentence`).toBeGreaterThan(0);
      if (/headman/i.test(governor)) continue;
      otherGovernor += 1;
      for (const t of sentences) if (/headman/i.test(t)) offenders.push(`soak1k-${i} (${governor}): ${t}`);
    }
    expect(otherGovernor, 'the corpus no longer seats another governor beside a watch').toBeGreaterThan(0);
    expect(offenders, `\n${offenders.join('\n')}\n`).toEqual([]);
  }, 300_000);
});
