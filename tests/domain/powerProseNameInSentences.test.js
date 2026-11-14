/**
 * powerProseNameInSentences.test.js — A FACTION NAMED IN A SENTENCE TAKES ITS PROSE FORM, FROM ONE LEAF (POWERS-16; the
 * chair's ruling (r2) of 2026-11-14 on the no-lane seat's row: "Military/Guard" inside a sentence).
 *
 * The catalogue label "Military/Guard" (and the stress powers' bracketed labels, "Noble Claimant (Senior Line)",
 * "Third Bloc (Neutrals)", "Crown Creditors (Noble Coalition)") printed raw inside this lane's sentences: an NPC's goal
 * ("Wants to bring Military/Guard a piece of news"), a quarrel ("Military/Guard and Merchant Guilds are in high conflict
 * over ..."), a power's standing ("they play Military/Guard and Elder Council against each other"), the ruling power's
 * crisis note ("the decisions that matter are made by Military/Guard."). On the census's 720 born at 30b03024f, 235 towns
 * print such a name in a sentence (POWERS-16 probe pname.mjs). Every one of those sentences now names the power through
 * display/powerSentenceName.js :: powerSentenceName ("The Guard").
 *
 * Arms: (1) the leaf: every slashed or bracketed power name the generators write has its prose form, and no prose form
 * carries a slash or a bracket; (2) the births, each town born as the census's 720 are: every goal, quarrel, quarrel hook,
 * standing, crisis note, DM-view patron line and the people headline (PDF, Foundry) names its power in the prose form (taken off: the label; kept: the line, anchored by count);
 * (3) KEEP: a town whose powers carry no slash prints its powers' names as the record holds them.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { powerSentenceName, PROSE_FORMS } from '../../src/domain/display/powerSentenceName.js';
import { crisisNoteFor } from '../../src/domain/dossier/powerStrata.js';
import { governingFactionOf } from '../../src/domain/rulingPower.js';
import { dmPowerViewOf } from '../../src/domain/people/patronage.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { npcsHeadline } from '../../src/pdf/lib/headlines.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own configuration of a seed (CENSUS-2 seedcfg.mjs: r2r-<size>-n calm-random, r2s-<stress>-<size>-n). @param {string} seed */
const cfgOf = (seed) => {
  const m = /^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] });
};

/** A label a sentence cannot hold: the catalogue's slashed and bracketed power names. */
const LABELS = ['Military/Guard', 'Monster Hunters / Adventurers', 'Noble Claimant (Senior Line)', 'Noble Claimant (Reform Line)',
  'Third Bloc (Neutrals)', 'Crown Creditors (Noble Coalition)'];
const LABEL = /Military\/Guard|Monster Hunters \/ Adventurers|\((?:Senior Line|Reform Line|Neutrals|Noble Coalition)\)/;

/** seed -> what the town printed at 30b03024f with the label: [goal, quarrel, quarrel hook, standing, crisis note] lines. */
const TOWNS = {
  'r2r-town-39': 'goal, quarrel, standing',
  'r2s-wartime-metropolis-1': 'goal, quarrel, quarrel hook, standing (a war)',
  'r2r-metropolis-8': 'goal, quarrel (Noble Claimant (Senior Line) / (Reform Line))',
  'r2r-metropolis-33': 'goal (Crown Creditors (Noble Coalition))',
  'r2s-politically_fractured-metropolis-0': 'goal, standing (Third Bloc (Neutrals))',
  'r2r-hamlet-27': 'crisis note (a hamlet)',
  'r2s-famine-village-1': 'crisis note (a famine)',
  'r2r-hamlet-18': 'a patron line and the people headline (the PDF and the Foundry lede: "..., second of ..., carries the most weight"); the DM view: "holds a third share in ..., and that lends ..."; 56 souls, the smallest)',
  'r2r-city-18': 'a patron line (the DM view)',
};
const KEEP = 'r2r-hamlet-4'; // no slashed or bracketed power: names print as the record holds them
/** No guard stands: the label close renames Military/Guard to its twin "Military Party" (factionLabelClose.js), and the
 * rename cascade moves the prose form with the label (domain/factionRename.js :: substituteName): no sentence says "The Guard". */
const TWIN = 'r2r-village-18';

/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...Object.keys(TOWNS), KEEP, TWIN]) births[seed] = generateSettlementPipeline(cfgOf(seed), null, { seed, customContent: {} });
}, 300000);

/** Every `line` a DM-view object holds (data/people/dmPowerLines.js's sentences). @param {unknown} o @returns {string[]} */
const linesOf = (o) => (Array.isArray(o) ? o.flatMap(linesOf) : o && typeof o === 'object'
  ? Object.entries(o).flatMap(([k, v]) => (k === 'line' && typeof v === 'string' ? [v] : linesOf(v))) : []);

/** Every sentence of this lane that names a power, in one town. @param {any} s @returns {string[]} */
const sentencesOf = (s) => {
  const ps = s.powerStructure || {};
  const ruler = governingFactionOf(s);
  return [
    ...(s.npcs || []).flatMap((/** @type {any} */ n) => [n.goal?.short, n.goal?.long]),
    ...(ps.conflicts || []).flatMap((/** @type {any} */ c) => [c.desc, ...(c.plotHooks || [])]),
    ...(ps.factions || []).map((/** @type {any} */ f) => f.desc),
    ruler ? crisisNoteFor(s, ruler) : '',
    ...linesOf(dmPowerViewOf(s)),
    npcsHeadline(buildViewModel({ settlement: s }).npcs) || '',
  ].filter((t) => typeof t === 'string' && t);
};

describe('the leaf: every slashed or bracketed power name has its prose form', () => {
  it('each prints its form, and no form carries a slash or a bracket', () => {
    expect(Object.keys(PROSE_FORMS || {}).sort(), 'the table names the catalogue\'s six').toEqual([...LABELS].sort());
    for (const label of LABELS) expect(powerSentenceName(label), label).not.toMatch(/[/()[\]\d]/);
    expect(powerSentenceName('Military/Guard')).toBe('The Guard');
    expect(powerSentenceName('Elder Council'), 'a plain name is itself').toBe('Elder Council');
    expect(powerSentenceName('The Independent Bloc')).toBe('The Independent Bloc');
  });
});

describe('the births: every sentence of this lane names its power in the prose form', () => {
  for (const [seed, what] of Object.entries(TOWNS)) {
    it(`${seed} (${what}): no sentence prints the label, and the prose form prints`, () => {
      const s = births[seed];
      const labels = (s.powerStructure.factions || []).map((/** @type {any} */ f) => String(f.faction)).filter((n) => LABELS.includes(n));
      expect(labels.length, 'anchored: the town has a slashed or bracketed power').toBeGreaterThan(0);
      const lines = sentencesOf(s);
      expect(lines.filter((t) => LABEL.test(t)), 'no sentence prints a catalogue label').toEqual([]);
      const forms = labels.map((n) => powerSentenceName(n));
      expect(lines.filter((t) => forms.some((f) => t.includes(f))).length, 'kept: the sentences still name the power').toBeGreaterThan(0);
    });
  }
  it(`${KEEP} (KEEP): a town with no slashed power prints its powers' names as the record holds them`, () => {
    const s = births[KEEP];
    const names = (s.powerStructure.factions || []).map((/** @type {any} */ f) => String(f.faction));
    expect(names.filter((n) => LABELS.includes(n)), 'anchored: no slashed power').toEqual([]);
    const lines = sentencesOf(s);
    expect(lines.filter((t) => names.some((n) => t.includes(n))).length, 'the names print as they are').toBeGreaterThan(0);
  });
  it(`${TWIN} (KEEP, the twin): where no guard stands the power is "Military Party" in every sentence, never "The Guard"`, () => {
    const s = births[TWIN];
    const names = (s.powerStructure.factions || []).map((/** @type {any} */ f) => String(f.faction));
    expect(names, 'anchored: the twin label').toContain('Military Party');
    const lines = sentencesOf(s);
    expect(lines.filter((t) => t.includes('Military Party')).length, 'anchored: the sentences name the twin').toBeGreaterThan(0);
    expect(lines.filter((t) => /The Guard|Military\/Guard/.test(t)), 'no sentence names a guard the town lacks').toEqual([]);
  });
});
