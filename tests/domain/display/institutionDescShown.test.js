/**
 * institutionDescShown.test.js — SURVEY S-A, print site 1 (the chair's ruling S-A-1): a house's description drawn at birth
 * and stored is re-answered on the FINAL record where it prints (the Institutions tab, the PDF's services slice), by the
 * door's own rule; no birth moves. Named towns of `docs/chair/2026-11-27/eleventh/survey/final/MEASURE.md` (B):
 *   V:dp-metropolis-4  the customs house drawn "by road" before `cascadePass` added the docks;
 *   V:dp-hamlet-12     the charcoal burner drawn for a place with no forest, the terrain written after (forest);
 *   C:dp-town-36       a CONTROL: the toll bridge's siege twin, already stored at the close (`readHouseDescsLate`), unchanged.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import TOWNS from '../../fixtures/surveyFinalTowns.json';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { withPublicProse } from '../../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../../src/components/new/publicProseCompose.js';
import { institutionDescShown } from '../../../src/domain/display/institutionDescShown.js';
import { institutionDescription } from '../../../src/components/new/tabs/InstitutionsTab.jsx';
import { buildViewModel } from '../../../src/pdf/lib/viewModel.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';

/** @param {string} seed */
const bornTown = (seed) => {
  const row = TOWNS.find((t) => t.seed === seed);
  const town = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
  return withPublicProse(town, composePublicProse(town));
};
/** @param {any} town @param {string} name */
const houseOf = (town, name) => town.institutions.find((i) => i.name === name);
/** @param {any} town @param {string} name */
const pdfDescOf = (town, name) => buildViewModel({ settlement: town }).services.detailed.find((i) => i.name === name || i.name?.includes(name))?.description;

describe('S-A site 1: a stored house description re-answered on the final record', () => {
  /** @type {Record<string, any>} */ const t = {};
  /** @type {Record<string, string>} */ const before = {};
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const seed of ['dp-metropolis-4', 'dp-hamlet-12', 'dp-town-36']) { t[seed] = bornTown(seed); before[seed] = JSON.stringify(t[seed]); }
  }, 120000);

  it('NOT VACUOUS: each named town stores the line the final record refuses', () => {
    const m = t['dp-metropolis-4'];
    expect(factsOf(m).hasInstitution('docks')).toBe(true);
    expect(houseOf(m, 'Customs house').desc).toMatch(/by road,|by the main roads|main roads\./);
    expect(houseOf(m, 'Customs house').desc).not.toMatch(/harbour|port/);
    expect(factsOf(t['dp-hamlet-12']).terrain).toBe('forest');
    expect(houseOf(t['dp-hamlet-12'], 'Charcoal burner').desc).toMatch(/whenever wood can be had/);
    expect(houseOf(t['dp-town-36'], 'Toll bridge').desc).toMatch(/though no one has crossed since the roads were cut\.$/); // the control: right as stored
  });

  it('THE OWNER\'s PAGE (the Institutions tab) prints the line the final record admits', () => {
    expect(institutionDescription(houseOf(t['dp-metropolis-4'], 'Customs house'), t['dp-metropolis-4'])).toBe('Levies charged on all trade in and out by road or harbour, collected by officials of crown or town.');
    expect(institutionDescription(houseOf(t['dp-hamlet-12'], 'Charcoal burner'), t['dp-hamlet-12'])).toMatch(/^Kiln crews in the surrounding woodland supply charcoal/);
    expect(institutionDescription(houseOf(t['dp-town-36'], 'Toll bridge'), t['dp-town-36'])).toBe(houseOf(t['dp-town-36'], 'Toll bridge').desc.trim()); // the control: unchanged
  });

  it('THE PDF prints the same line as the tab', () => {
    for (const [seed, name] of [['dp-metropolis-4', 'Customs house'], ['dp-hamlet-12', 'Charcoal burner'], ['dp-town-36', 'Toll bridge']]) {
      expect(pdfDescOf(t[seed], name), `${seed} ${name}`).toBe(institutionDescription(houseOf(t[seed], name), t[seed]));
    }
  });

  it('THE SHARED PAGE: a set that reads the roster (the docks) prints AS STORED; a terrain set is re-answered', () => {
    const customs = houseOf(t['dp-metropolis-4'], 'Customs house');
    expect(institutionDescShown(customs, t['dp-metropolis-4'], { reader: true })).toBe(customs.desc.trim());
    expect(institutionDescShown(houseOf(t['dp-hamlet-12'], 'Charcoal burner'), t['dp-hamlet-12'], { reader: true })).toMatch(/^Kiln crews in the surrounding woodland/);
    expect(institutionDescShown(houseOf(t['dp-town-36'], 'Toll bridge'), t['dp-town-36'], { reader: true })).toBe(houseOf(t['dp-town-36'], 'Toll bridge').desc.trim());
  });

  it('a DM\'s edited description (the DM\'s own words, which no table holds) prints as written', () => {
    expect(institutionDescShown({ name: 'Customs house', desc: 'Our own words.', _userEdits: { desc: { originalValue: 'x' } } }, t['dp-metropolis-4'])).toBe('Our own words.');
    expect(institutionDescShown({ name: 'Customs house', desc: 'Our own words.' }, t['dp-metropolis-4'])).toBe('Our own words.');
  });

  it('S-A-3: A DM\'s WORDS ARE NEVER RE-ANSWERED: a table line the DM typed verbatim, for a house the final record refuses, prints as the DM wrote it', () => {
    const m = t['dp-metropolis-4'];
    const typed = 'Levies charged on all trade in and out by road, collected by officials of crown or town.'; // the docks-less twin, verbatim
    const edited = { ...m, institutions: m.institutions.map((i) => (i.name === 'Customs house' ? { ...i, desc: typed, _userEdits: { desc: { originalValue: i.desc, editedAt: '2026-11-28T00:00:00Z' } } } : i)) };
    const house = houseOf(edited, 'Customs house');
    expect(institutionDescShown({ ...house, _userEdits: undefined }, edited)).not.toBe(typed); // CONTROL: unmarked, the final record re-answers it
    expect(institutionDescShown(house, edited)).toBe(typed);
    expect(institutionDescription(house, edited)).toBe(typed);
  });

  it('NO BIRTH MOVES: the records are untouched by the print', () => {
    for (const seed of Object.keys(t)) expect(JSON.stringify(t[seed]), seed).toBe(before[seed]);
  });
});
