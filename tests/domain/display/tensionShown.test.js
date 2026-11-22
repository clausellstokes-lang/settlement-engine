/**
 * PAGE-9's SIDES (`docs/chair/2026-11-20/content/page/briefs/SIDES.md`, both amendments): THE SIDES AS SHOWN, one pure reader
 * (`src/domain/display/tensionShown.js :: tensionSidesShown`) over the sides table (`src/data/tensionSideMeanings.js`, its
 * header's rules 0 to 4) and the ONE {power} fill (`src/data/tensionSidePower.js :: solePowerNameOf`). On a MADE-UP roster;
 * every expected side is COMPUTED from the table and the fill, never quoted.
 *   the chair's rule 1: a name only through a row's `named` wording; a row without `named` is never named;
 *   rule 2: only where the document holds EXACTLY ONE power of the kind (the fill's own test);
 *   rule 3: never the same power on two sides of one tension;
 *   rule 4: `presumes` first; a null `without` drops the side;
 *   rule 5: a side the generator wrote over follows the header's rules 2 to 4;
 *   rule 6: every side as shown begins with a capital letter;
 *   rule 7: the reader reads only the document it is given: a served document lacking a withheld power prints what a town
 *           without that power prints, never the name.
 */
import { describe, expect, it } from 'vitest';
import { TENSION_SIDE_MEANINGS } from '../../../src/data/tensionSideMeanings.js';
import { solePowerNameOf } from '../../../src/data/tensionSidePower.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { atomHolds } from '../../../src/domain/facts/factVocabulary.js';
import { toPublicSafe } from '../../../src/domain/display/publicSafe.js';
import { tensionSidesShown } from '../../../src/domain/display/tensionShown.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';

const M = TENSION_SIDE_MEANINGS;
const MARKET = { name: 'Market Square', tags: ['market'] };
/** @param {Array<Record<string, unknown>>} factions @param {Array<Record<string, unknown>>} [institutions] */
const town = (factions, institutions = []) => ({ name: 'Ashford', powerStructure: { factions }, institutions });
/** a `named` wording with its slot filled, as the reader must fill it @param {string} words @param {string} name */
const filled = (words, name) => /** @type {string} */ (M[words].named).split('{power}').join(name);
const capital = (/** @type {string} */ s) => s.charAt(0).toUpperCase() + s.slice(1);

const RULER = { faction: 'Ashford Council', category: 'government', isGoverning: true };
const LEAGUE = { faction: 'Merchant League', category: 'economy' };
const WEAVERS = { faction: 'Weavers Guild', category: 'economy' };
const GUARD = { faction: 'Military/Guard', category: 'military' };

describe('tensionSidesShown: the chair\'s rule 1 (a name only through `named`)', () => {
  it('a `named` row shows its wording with the ONE fill where the document holds the party', () => {
    const rec = town([RULER, GUARD]);
    const t = { type: 'popular_uprising', factions: ['Former rebels', 'The restored order', 'Those who changed sides at the right moment'] };
    const name = solePowerNameOf(rec, 'ruler', true);
    expect(name).toBeTruthy();
    expect(tensionSidesShown(rec, t)).toEqual(['Former rebels', filled('The restored order', /** @type {string} */ (name)), 'Those who changed sides at the right moment']);
  });
  it('a row WITHOUT `named` is never named, whatever its `means` (the ruler)', () => {
    const rec = town([RULER, GUARD]);
    expect(M['Corrupt officials'].means).toBe('ruler');
    expect(M['Corrupt officials'].named).toBeUndefined();
    const t = { type: 'corruption_scandal', factions: ['Corrupt officials', 'Reformers', 'Complicit beneficiaries'] };
    expect(tensionSidesShown(rec, t)).toEqual(['Corrupt officials', 'Reformers', 'Complicit beneficiaries']);
  });
  it('a `named` row whose fill answers null (no governing power) shows the row\'s own words', () => {
    const rec = town([GUARD]);
    expect(solePowerNameOf(rec, 'ruler', true)).toBeNull();
    const t = { type: 'legitimacy_crisis', factions: ['The sitting authority', 'Those who deny its mandate', 'Pragmatists who want any stable answer'] };
    expect(tensionSidesShown(rec, t)).toEqual(t.factions);
  });
});

describe('tensionSidesShown: rule 2 (EXACTLY ONE power of the kind meant)', () => {
  const t = { type: 'population_friction', factions: ['Old families', 'Newcomers', 'Merchants who benefit from cheap newcomer labour'] };
  it('one merchant power and a market: the named wording, filled', () => {
    const rec = town([RULER, LEAGUE], [MARKET]);
    expect(atomHolds('market', factsOf(rec))).toBe(true);
    const name = solePowerNameOf(rec, 'economy', true);
    expect(name).toBeTruthy();
    expect(tensionSidesShown(rec, t)[2]).toBe(filled(t.factions[2], /** @type {string} */ (name)));
  });
  it('two powers of the kind: the row\'s own words', () => {
    const rec = town([RULER, LEAGUE, WEAVERS], [MARKET]);
    expect(solePowerNameOf(rec, 'economy', true)).toBeNull();
    expect(tensionSidesShown(rec, t)[2]).toBe(t.factions[2]);
  });
  it('none of the kind: the row\'s own words', () => {
    const rec = town([RULER, GUARD], [MARKET]);
    expect(tensionSidesShown(rec, t)[2]).toBe(t.factions[2]);
  });
});

// THE CRAFT RULING (the chair, 20:30 UTC): 'craft power' is NEVER named by the economy mark; no craft mark exists on the
// roster, so the side keeps its own words. 'merchant power' keeps the economy mark (rule 2's arms above). The red: the three
// born towns of the census's 720 (`build/SIDES/craftCases.before.txt`) whose sole economy power was cast as the guild members.
describe('tensionSidesShown: THE CRAFT RULING (a craft side is never named by the economy mark)', () => {
  const BORN = ['r2s-famine-town-2', 'r2s-famine-city-3', 'r2r-city-25'];
  // One plain test looping over the three towns in its body (the lighting walker's each-family park debt only shrinks).
  it('the three born towns: their guild members keep their own words beside a sole economy power', async () => {
    const { generateSettlementPipeline } = await import('../../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../../src/store/configSlice.js');
    const { censusPlan, configOf } = await import('../../components/pageCensusWalk.shared.mjs');
    await loadGenerationLawPayloads();
    for (const seed of BORN) {
      const row = censusPlan('r2').find((/** @type {{ seed: string }} */ r) => r.seed === seed);
      expect(row, seed).toBeTruthy();
      const doc = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
      const crafts = (doc.history?.currentTensions || []).flatMap((/** @type {any} */ t) => (t.factions || [])
        .map((/** @type {string} */ s, /** @type {number} */ i) => ({ t, s, i }))
        .filter((/** @type {{ s: string }} */ x) => M[x.s]?.means === 'craft power'));
      expect(crafts.length, seed).toBeGreaterThan(0);
      // the precondition the economy mark would have named: exactly one economy power on the roster
      expect(solePowerNameOf(doc, 'economy', true), seed).toBeTruthy();
      for (const { t, s, i } of crafts) expect(tensionSidesShown(doc, t)[i], seed).toBe(s);
    }
  }, 360000);
  it('a made-up roster whose one economy power is a craft guild: still the row\'s own words', () => {
    const rec = town([RULER, { faction: 'Craft Guilds', category: 'economy' }]);
    const t = { type: 'guild_conflict', factions: ['Guild members', 'Those who would trade outside the guild', 'Non-guild workers'] };
    expect(solePowerNameOf(rec, 'economy', true)).toBeTruthy();
    expect(tensionSidesShown(rec, t)).toEqual(t.factions);
  });
});

describe('tensionSidesShown: rule 3 (never the same power on two sides of one tension)', () => {
  it('a side already showing the ruler keeps the later named side in its own words', () => {
    const rec = town([RULER, GUARD]);
    // a stored side that IS the ruler's name, then a named row that the fill would give the ruler
    const t = { type: 'popular_uprising', factions: [RULER.faction, 'The restored order', 'Those who changed sides at the right moment'] };
    expect(solePowerNameOf(rec, 'ruler', true)).toBeTruthy();
    expect(tensionSidesShown(rec, t)).toEqual([RULER.faction, 'The restored order', 'Those who changed sides at the right moment']);
  });
});

describe('tensionSidesShown: rule 4 (`presumes` first; a null `without` drops the side)', () => {
  it('a town lacking the house shows `without`, before any name (one merchant power, no market)', () => {
    const rec = town([RULER, LEAGUE]);
    expect(atomHolds('market', factsOf(rec))).not.toBe(true);
    expect(solePowerNameOf(rec, 'economy', true)).toBeTruthy();
    const t = { type: 'population_friction', factions: ['Old families', 'Newcomers', 'Merchants who benefit from cheap newcomer labour'] };
    expect(tensionSidesShown(rec, t)[2]).toBe(M[t.factions[2]].without);
  });
  it('a null `without` drops the side (a table row made null for the test; the shipped table carries none)', () => {
    const rec = town([RULER]);
    const words = 'Legal class profiting from ambiguity';
    expect(M[words].presumes).toEqual(['legal house']);
    expect(atomHolds('legal house', factsOf(rec))).not.toBe(true);
    const table = { ...M, [words]: Object.freeze({ ...M[words], without: null }) };
    const t = { type: 'disputed_land', factions: ['Original claimants', 'Current occupants', words] };
    expect(tensionSidesShown(rec, t, table)).toEqual(['Original claimants', 'Current occupants']);
    expect(tensionSidesShown(rec, t)).toEqual(['Original claimants', 'Current occupants', capital(/** @type {string} */ (M[words].without))]);
  });
});

describe('tensionSidesShown: rule 5 (a side the generator wrote over: the header\'s rules 2 to 4)', () => {
  it('a power of ANOTHER kind written at a merchant slot shows the slot row\'s `without` (never a power in another\'s part)', () => {
    const rec = town([RULER, GUARD], [MARKET]);
    const t = { type: 'economic_disparity', factions: [GUARD.faction, 'Poor workers', 'Moderate reformers'] };
    expect(tensionSidesShown(rec, t)).toEqual([M['Wealthy merchants'].without, 'Poor workers', 'Moderate reformers']);
  });
  it('a power OF the kind written there is shown as stored, never un-named', () => {
    const rec = town([RULER, LEAGUE], [MARKET]);
    const t = { type: 'economic_disparity', factions: [LEAGUE.faction, 'Poor workers', 'Moderate reformers'] };
    expect(tensionSidesShown(rec, t)).toEqual(t.factions);
  });
  it('a fixed word: the slot row\'s `without` first, the fixed word\'s own only where the slot row has none', () => {
    const rec = town([RULER, GUARD]);
    const atDivide = { type: 'economic_disparity', factions: ['the merchant class', 'Poor workers', 'Moderate reformers'] };
    expect(tensionSidesShown(rec, atDivide)[0]).toBe(M['Wealthy merchants'].without);
    const atSuccession = { type: 'succession_crisis', factions: [RULER.faction, 'Popular candidate', 'the merchant class'] };
    expect(M['Power behind throne'].without).toBeUndefined();
    expect(tensionSidesShown(rec, atSuccession)[2]).toBe(capital(/** @type {string} */ (M['the merchant class'].without)));
  });
  it('a fixed word whose party and house the town holds is shown as stored (capitalised)', () => {
    const rec = town([RULER, LEAGUE], [MARKET]);
    const t = { type: 'succession_crisis', factions: [RULER.faction, 'Popular candidate', 'the merchant class'] };
    expect(tensionSidesShown(rec, t)[2]).toBe('The merchant class');
  });
  it('a side dropped from the stored list (the roster settled it) does not shift the slots behind it', () => {
    const rec = town([RULER, GUARD]);
    // crime_wave's unanchored form with its criminal side gone: the second side is the form's own words at slot 1
    const t = { type: 'crime_wave', factions: [GUARD.faction, 'Those who would take the law into their own hands'] };
    expect(tensionSidesShown(rec, t)).toEqual(t.factions);
  });
});

describe('tensionSidesShown: rule 6 (every side as shown begins with a capital letter)', () => {
  it('the generator\'s lower-case fixed words open with a capital', () => {
    const rec = town([GUARD]);
    const t = { type: 'succession_crisis', factions: ['the governing authority', 'Popular candidate', 'the merchant class'] };
    const shown = tensionSidesShown(rec, t);
    expect(shown[0]).toBe('The governing authority');
    for (const s of shown) expect(s.charAt(0)).toBe(s.charAt(0).toUpperCase());
  });
});

describe('tensionSidesShown: rule 7 (the document in hand, and no second source)', () => {
  const HIDDEN = { faction: 'Shadow Hand', category: 'criminal', hidden: true };
  const t = { type: 'crime_wave', factions: ['The watch', 'Vigilantes', HIDDEN.faction] };
  const owner = { ...town([RULER, GUARD, HIDDEN]), history: { currentTensions: [t] } };
  it('the owner\'s document shows the criminal power it holds, as stored', () => {
    expect(tensionSidesShown(owner, t)).toEqual(['The watch', 'Vigilantes', HIDDEN.faction]);
  });
  it('a served document in which that power is withheld prints the row\'s words, never the name', () => {
    const served = toPublicSafe(owner);
    const ts = served.history?.currentTensions?.[0];
    expect(ts).toBeTruthy();
    const shown = tensionSidesShown(served, ts);
    expect(shown).toEqual(['The watch', 'Vigilantes', M['Criminal organisations'].without]);
    expectAbsentWithAnchor(shown, HIDDEN.faction, 'Vigilantes', 'the served sides never carry the withheld power\'s name');
  });
});

// ── THE GUARD (SIDES.md point 5): no surface in this lane's files prints a tension's side except through the reader ──
// Every `.factions` read under src/components, src/domain/display, src/pdf and src/foundry is on a receiver that is NOT a
// tension (the power roster and its kin), pinned file by file below; a tension's sides are read in `tensionShown.js` only.
// A new `.factions` read anywhere in these directories reds here until it is either the reader's call or a roster read
// added to this list by name.
const LANE_DIRS = ['src/components', 'src/domain/display', 'src/pdf', 'src/foundry'];
const READER_FILE = 'src/domain/display/tensionShown.js';
/** The power roster's own receivers, in any file: `powerStructure.factions`, `ps.factions`, `power.factions`. */
const ROSTER_RECEIVERS = Object.freeze(['powerStructure', 'ps', 'power']);
/** @type {Readonly<Record<string, ReadonlyArray<string>>>} file → its other `.factions` receivers, each read (none a tension) */
const ROSTER_READS = Object.freeze({
  'src/pdf/sections/PowerStructure.jsx': ['p'], // the power slice of the export's view model
  'src/foundry/journalPages.js': ['p'], // the same slice
  'src/components/map/NpcTrailSection.jsx': ['npcLadder'],
  'src/components/settlement/EventComposer.jsx': ['customContent'],
  'src/domain/display/parityContract.js': ['headcounts'],
  'src/components/compendium/FactionEventBanner.jsx': ['CATEGORY_BY_KEY'],
  'src/components/dossier/CascadePreviewPanel.jsx': ['downstreamCounts'],
  'src/components/home/HomeSampleDossier.jsx': ['SAMPLE_DOSSIER'],
  'src/components/new/tabs/PowerTab.jsx': ['r'], // the power lens's own row
  'src/components/settlementDetail/SettlementDetailEditNames.jsx': ['settlement'], // a comment naming the old roster read
  'src/domain/display/publicSafe.js': [')'], // `(ps).factions`, the root pass's roster
});

describe('THE GUARD: a tension\'s side is printed only through tensionShown.js', () => {
  it('every `.factions` read in the lane\'s files is a roster read pinned by file, or the reader\'s own', async () => {
    const { readFileSync, readdirSync, statSync } = await import('node:fs');
    const { join, relative } = await import('node:path');
    const root = process.cwd();
    /** @param {string} d @returns {string[]} */
    const walk = (d) => readdirSync(d).flatMap((f) => {
      const p = join(d, f);
      return statSync(p).isDirectory() ? walk(p) : /\.(m?js|jsx)$/.test(f) ? [p] : [];
    });
    const read = /([A-Za-z_$][\w$]*(?:\[[^\]]*\])?|\))\s*\??\.factions\b/g;
    /** @type {string[]} */ const strays = [];
    let readerReads = 0;
    for (const dir of LANE_DIRS) for (const abs of walk(join(root, dir))) {
      const file = relative(root, abs).split('\\').join('/');
      readFileSync(abs, 'utf-8').split('\n').forEach((line, i) => {
        for (const m of line.matchAll(read)) {
          if (file === READER_FILE) { readerReads += 1; continue; }
          if (!ROSTER_RECEIVERS.includes(m[1]) && !(ROSTER_READS[file] || []).includes(m[1])) strays.push(`${file}:${i + 1} ${m[1]}.factions`);
        }
      });
    }
    expect(strays, 'a tension\'s sides read outside the reader').toEqual([]);
    expect(readerReads).toBeGreaterThan(0);
  });
});

describe('tensionSidesShown: no sides', () => {
  it('a tension with no sides, or none at all, shows none', () => {
    expect(tensionSidesShown(town([]), { type: 'crime_wave' })).toEqual([]);
    expect(tensionSidesShown(null, null)).toEqual([]);
  });
});
