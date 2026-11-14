/**
 * powerDescClaimLabel.test.js — COHERENCE-POWERS-8 (the lane's rows #111 #639; round three's #374 #563-class #567 #597
 * #251): A POWER'S DESCRIPTION CLAIMS NO STANDING ITS FINAL LABEL DENIES. The base roster's descriptions are chosen in
 * power/rulingStructure.js from each power's RAW figure, before the renormalisation and the legitimacy multipliers move
 * it; the page prints the description beside the FINAL label. "Church institutions hold direct temporal power; tithes,
 * land, and courts are all ecclesiastical." printed beside "Religious Authorities 12 · Minor" in rw3-city-infiltrated-1.
 * The cure (rulingStructure.js :: settleClaimsToLabel, after the labels are set): a commanding claim beside a Minor or
 * Suppressed label takes its own ladder's rung for that label, the line the ladder already prints for a power of that
 * weight; the coda after it is kept. No new words, no draw.
 * Measured on the census's 720 at 91a3a9623: 462 such descriptions in 195 towns, 342 of them in the families this
 * cure covers; 0 of those after, and every changed description sits beside a Minor (295) or Suppressed (47) label.
 * The military family's "Standing army" / "Significant military" (21) and the moderate "Major church institutions"
 * (40) and "Well-organised craft guilds" (59) are not covered here (listed in the hand-back).
 * Every expected word is a literal.
 */
import { describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { settleClaimsToLabel } from '../../src/generators/power/rulingStructure.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const CLAIMS = [/^International merchant houses controlling/, /^Dominant commercial class/, /^Church institutions hold direct temporal power/,
  /^Church holds substantial temporal power/, /^Arcane institutions hold substantial political leverage/, /^Wizard towers and mage guilds hold genuine political weight/,
  /^Underworld effectively controls/, /^Criminal organisations have captured significant influence/,
  /^Hereditary landowners whose land rights and military obligations are structurally embedded/, /^Landed noble families whose hereditary rights/];
/** The app's own shape (REVIEW-W2A-3 render.rw3.jsx :: cfgFor). @param {string} seed */
function born(seed) {
  const m = seed.match(/^[a-z0-9]+-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/);
  if (!m) throw new Error(seed);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} }));
}

describe('COHERENCE-POWERS-8 · the claim read against the label', () => {
  it('a claim beside Minor takes its ladder\'s Minor rung, beside Suppressed its Suppressed rung; a coda is kept', () => {
    const f = [
      { faction: 'Religious Authorities', powerLabel: 'Minor', desc: 'Church institutions hold direct temporal power; tithes, land, and courts are all ecclesiastical. Behind the ruler.' },
      { faction: 'Arcane Orders', powerLabel: 'Suppressed', desc: 'Wizard towers and mage guilds hold genuine political weight; their services are structurally irreplaceable and they know it.' },
      { faction: "Thieves' Guild", powerLabel: 'Suppressed', desc: 'Criminal organisations have captured significant influence; corruption is systemic, not exceptional.' },
      { faction: 'Merchant Guilds', powerLabel: 'Strong', desc: 'Dominant commercial class; their capital and networks give them leverage even formal institutions must respect.' },
    ];
    settleClaimsToLabel(f, 'village');
    expect(f[0].desc).toBe('The local clergy serve a real pastoral role; their moral authority has limited political reach but is genuinely respected. Behind the ruler.');
    expect(f[1].desc).toBe('Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly resented.');
    expect(f[2].desc).toBe('A local protection operation tolerated because the alternative is open conflict with people who know the terrain better.');
    expect(f[3].desc).toBe('Dominant commercial class; their capital and networks give them leverage even formal institutions must respect.');
  });
  it('rw3-city-infiltrated-1 (#639): Religious Authorities, Minor, no longer "hold direct temporal power"', async () => {
    await loadGenerationLawPayloads();
    const s = born('rw3-city-infiltrated-1');
    const r = s.powerStructure.factions.find((/** @type {any} */ f) => f.faction === 'Religious Authorities');
    expect(r.powerLabel).toBe('Minor');
    expect(r.desc.startsWith('Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited.')).toBe(true);
  }, 60000);
  it('rw3-metropolis-politically_fractured-1 (#111) and fresh births: no covered claim beside a Minor or Suppressed label', async () => {
    await loadGenerationLawPayloads();
    let low = 0;
    const failures = collectSeedFailures(['rw3-metropolis-politically_fractured-1', 'p8-city-calm-1', 'p8-city-calm-2', 'p8-town-calm-1', 'p8-metropolis-calm-1', 'p8-town-indebted-1', 'p8-city-famine-1'], (seed) => {
      const lows = born(seed).powerStructure.factions.filter((/** @type {any} */ f) => f.powerLabel === 'Minor' || f.powerLabel === 'Suppressed');
      low += lows.length;
      const claiming = lows.filter((/** @type {any} */ f) => CLAIMS.some((re) => re.test(String(f.desc)))).map((/** @type {any} */ f) => `${f.faction}: ${f.desc}`);
      expect(claiming, seed).toEqual([]);
    });
    expectNoSeedFailures(failures, 'no covered claim beside a Minor or Suppressed label');
    expect(low).toBeGreaterThan(10);
  }, 120000);
});
