/**
 * powerVerbAgreement.test.js — A POWER'S VERB TAKES ITS NUMBER (NAMES-2, item 5; the seventh chair's word of 2026-11-20:
 * "BUILD IT, since it is small and the helper exists"). With the article in place (NAMES-1, CN1) "the Merchant Guilds
 * wants" reads wrong aloud. Measured at NAMES-2's tree on the census's 720: 5 stored sentences (a secret's "considers",
 * the fractured town's "controls") and 139 rendered (the Power tab's patron lines: "what the Merchant Guilds wants", "the
 * Merchant Guilds counts for more here than its own members") set a plural power with a singular verb; none the reverse.
 * Each template fills its verb through `pluralPowerName` (the head noun ends in a single s), singular and plural both
 * pinned, so a cure that only flips the verb cannot pass.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { PATRONAGE_LINES } from '../../src/data/people/dmPowerLines.js';
import { PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';
import { pluralPowerName } from '../../src/domain/display/pluralPowerName.js';
import { pluralPowerName as leafPlural, powerVerb, withPowerVerb } from '../../src/data/people/powerSentenceName.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { censusPlan, configOf } from '../components/pageCensusWalk.shared.mjs';

/** @param {'Merchant Guilds'|'Elder Council'} power @param {1|2|3|'steward'} rank */
const patron = (power, rank = 1) => ({ name: 'Ide Doyle', rank, ruler: 'Guild Council', power, share: 1, boost: 0 });
/** @param {unknown} row @returns {string} */
const textOf = (row) => (typeof row === 'string' ? row : String(/** @type {{text?: unknown}} */ (row)?.text ?? ''));

describe('the one helper, in the data leaf and at its domain home', () => {
  it('the domain home answers the leaf\'s body, for every number', () => {
    for (const n of ['Merchant Guilds', 'Religious Authorities', 'Noble Houses', 'Elder Council', 'Military/Guard', 'Thieves\' Guild', 'Third Bloc (Neutrals)', 'the Merchant Guilds']) {
      expect(pluralPowerName(n)).toBe(leafPlural(n));
    }
    expect([leafPlural('Merchant Guilds'), leafPlural('Elder Council'), leafPlural('Third Bloc (Neutrals)')]).toEqual([true, false, true]);
  });
  it('powerVerb picks by number; withPowerVerb changes only the verb after that power', () => {
    expect([powerVerb('Merchant Guilds', 'wants', 'want'), powerVerb('Elder Council', 'wants', 'want')]).toEqual(['want', 'wants']);
    expect(withPowerVerb('so the Merchant Guilds controls one district; a rival controls another', 'Merchant Guilds', 'controls', 'control'))
      .toBe('so the Merchant Guilds control one district; a rival controls another');
    expect(withPowerVerb('so the Elder Council controls one district', 'Elder Council', 'controls', 'control')).toBe('so the Elder Council controls one district');
    expect(withPowerVerb('Next to them, the Merchant Guilds controls nothing', 'Craft Guilds', 'controls', 'control')).toBe('Next to them, the Merchant Guilds controls nothing');
  });
});

describe('the Power tab\'s patron lines (dmPowerLines.js)', () => {
  it('the head\'s asker line: "what the Merchant Guilds want", "what the Elder Council wants"', () => {
    expect(PATRONAGE_LINES.open[1](patron('Merchant Guilds'))).toContain('so what the Merchant Guilds want from the Guild Council goes straight to the top.');
    expect(PATRONAGE_LINES.open[1](patron('Elder Council'))).toContain('so what the Elder Council wants from the Guild Council goes straight to the top.');
  });
  it('the one serving both: "the Merchant Guilds count for more here than their own members"', () => {
    expect(PATRONAGE_LINES.open[2](patron('Merchant Guilds'))).toContain('the Merchant Guilds count for more here than their own members would make them.');
    expect(PATRONAGE_LINES.open[2](patron('Elder Council'))).toContain('the Elder Council counts for more here than its own members would make it.');
  });
});

/** @type {Record<string, any>} */ const born = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of ['r2s-indebted-town-1', 'r2s-politically_fractured-town-1', 'r2s-politically_fractured-city-1']) {
    const row = censusPlan('r2').find((r) => r.seed === seed);
    if (!row) throw new Error(`the census row ${seed} is gone`);
    born[seed] = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
  }
}, 180_000);

describe('the fractured town\'s pressure sentence (narrativeText.js, drawn in narrativeGenerator.js)', () => {
  it('the row stays its literal; the drawn sentence agrees: "the Religious Authorities control", "the Merchant Guilds control"', () => {
    const row = PRESSURE_SENTENCES.politically_fractured({ name: 'Ashford', topFaction: 'Merchant Guilds', govFaction: 'Elder Council' })
      .map(textOf).find((t) => /has no effective government/.test(t)) || '';
    expect(row).toContain('; the Merchant Guilds controls one district'); // the template, untouched (its ledger and census read it)
    expect(born['r2s-politically_fractured-town-1'].pressureSentence).toContain('; the Religious Authorities control one district and the institutions inside it, a rival controls another,');
    expect(born['r2s-politically_fractured-city-1'].pressureSentence).toContain('; the Merchant Guilds control one district and the institutions inside it, a rival controls another,');
  });
});

describe('a secret, as born (stressInstitutionEffects.js, filled in npcGenerator.js)', () => {
  it('"information that the Merchant Guilds consider proprietary" (the town the census measured)', () => {
    const secrets = (born['r2s-indebted-town-1'].npcs || []).map((/** @type {any} */ n) => String(n?.secret?.what ?? '')).filter((t) => /proprietary/.test(t));
    expect(secrets.length, 'the measured secret is still drawn in this town').toBeGreaterThan(0);
    expect(secrets.filter((t) => /Guilds considers/.test(t))).toEqual([]);
    expect(secrets.some((t) => /information that the Merchant Guilds consider proprietary/.test(t))).toBe(true);
  });
});
