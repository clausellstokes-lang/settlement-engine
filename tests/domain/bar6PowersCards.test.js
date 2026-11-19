// BAR6-POWERS (BRIEF-BAR6, 2026-11-16): LAW 10's rules 10f (a power's card for its own kind, tier and weight; the ruler's own seat
// backs the ruler only) and 10h (a power inside a sentence takes its prose form), and LAW 6's 6d-members (a line of "its members"
// needs two members), kept as a guard with the auditors' own detectors (tests/helpers/pageLaws/law10.mjs :: law10f, law10h, F's;
// the 6d-members fact through its atom, C's). The printed lines are the record's own (`recordTabs`): each power's stored
// description as the Power tab prints it; each house with the powers it backs as the page reads them (`houseBacksShownOf`);
// the plot hooks as the dossier collects them. Each arm: (a) THE ZERO over the towns in which the rule fired at afa46d644 (the
// census's 720 and the fresh 300: the measure in docs/chair/2026-11-16/bar6/BAR6-POWERS-HANDBACK.md), every town run and
// every failure collected; (b) A POSITIVE CONTROL, a record built here from the wide read's own rows (C121364, C128237,
// C110252, C102099, C1980, C91256), on which the detector or the atom MUST still fire.
import { execSync } from 'node:child_process';
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { law10f, law10h } from '../helpers/pageLaws/law10.mjs';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveFactionSupport, formatBacksValue, houseBacksOf, houseBacksShownOf, institutionBackers, seatHouseName } from '../../src/domain/dossier/powerSupport.js';
import { applyUserEdit } from '../../src/domain/userEdits.js';
import { institutionsWithServices } from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';
import { seatMembersOf } from '../../src/domain/facts/seatMembers.js';
import { COUNCIL_BODIES, MERCHANTS_OF_LITTLE_WEIGHT_LARGE, marketDayLineOf } from '../../src/generators/power/militaryForceLine.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';

/** the census's dials (CENSUS-3 :: seedcfg.mjs, verbatim) */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** the census's shapes and the bar's read shape (CENSUS-3 :: seedcfg.mjs, its r2r-, r2s- and bar0- arms) @param {string} seed */
function born(seed) {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-\\d+$`));
  let cfg = m ? { ...DEFAULT_CONFIG, ...DIALS, settType: m[1] } : null;
  if (!cfg && (m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-\\d+$`)))) cfg = { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  if (!cfg && (m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-\\d+$`)))) {
    cfg = { ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true };
  }
  if (!cfg) throw new Error(`no shape for ${seed}`);
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

/** The record's own printed lines for 10f and 10h: the Power tab's descriptions; each house's head and the powers it backs as the
 * Institutions tab prints them ("<house> · <shelf>", then "Backs · a · b"); the plot hooks. @param {any} s */
function recordTabs(s) {
  const power = (s?.powerStructure?.factions || []).map((/** @type {any} */ f) => String(f?.desc || ''));
  const backs = houseBacksShownOf(s);
  const houses = (s?.institutions || []).flatMap((/** @type {any} */ i) => {
    const list = backs.get(String(i?.name || '')) || [];
    return list.length ? [`${i.name} · ${i.category}`, `Backs · ${list.map((b) => b.faction).join(' · ')}`] : [];
  });
  const hooks = collectPlotHooks(s).map((h) => String(h?.text || ''));
  return { 'Systems/Power': power, 'Systems/Institutions': houses, 'Summary/Plot Hooks': hooks };
}
/** every variant of a generated state leaf (computed at test time, never a literal) @param {unknown} o @returns {any[]} */
const variantsOf = (o) => (Array.isArray(o) ? o.flatMap(variantsOf) : o && typeof o === 'object'
  ? [...(typeof (/** @type {any} */ (o)).text === 'string' ? [o] : []), ...Object.values(o).flatMap(variantsOf)] : []);

/** MY RULES (F's and C's names): 10f-kind, 10f-tier, 10f-weight, 10f-backs, 10h; 6d-members through its atom */
const RULES = new Set(['10f-kind', '10f-tier', '10f-weight', '10f-backs', '10h']);
/** the census's towns (and the fresh 300's) in which 10f or 10h fired at afa46d644 (runF.mjs over PAGE-COPY renders) */
const FIRED_10 = Object.freeze([
  'bar0-city-under_siege+famine-rand-103', 'bar0-city-under_siege+famine-rand-106', 'bar0-city-under_siege+famine-rand-109', 'bar0-city-under_siege+famine-rand-110',
  'bar0-city-under_siege+famine-rand-113', 'bar0-city-under_siege+famine-rand-115', 'bar0-city-wartime-rand-102', 'bar0-city-wartime-rand-104',
  'bar0-city-wartime-rand-107', 'bar0-city-wartime-rand-108', 'bar0-city-wartime-rand-114', 'bar0-city-wartime-rand-115',
  'bar0-city-wartime-rand-119', 'bar0-city-wartime-rand-122', 'bar0-metropolis-calm-rand-106', 'bar0-metropolis-calm-rand-109',
  'bar0-metropolis-calm-rand-120', 'bar0-metropolis-calm-rand-129', 'bar0-town-occupied-rand-109', 'bar0-town-occupied-rand-124',
  'r2r-city-11', 'r2r-city-13', 'r2r-city-20', 'r2r-city-29',
  'r2r-city-40', 'r2r-city-41', 'r2r-city-42', 'r2r-city-55',
  'r2r-city-7', 'r2r-city-9', 'r2r-metropolis-11', 'r2r-metropolis-17',
  'r2r-metropolis-18', 'r2r-metropolis-3', 'r2r-metropolis-31', 'r2r-metropolis-4',
  'r2r-metropolis-40', 'r2r-metropolis-45', 'r2r-metropolis-47', 'r2r-metropolis-49',
  'r2r-metropolis-5', 'r2r-metropolis-53', 'r2r-town-34', 'r2s-famine-town-0',
  'r2s-famine-town-1', 'r2s-infiltrated-metropolis-3', 'r2s-insurgency-metropolis-1', 'r2s-insurgency-metropolis-3',
  'r2s-mass_migration-metropolis-1', 'r2s-monster_pressure-city-0', 'r2s-occupied-metropolis-0', 'r2s-plague_onset-city-2',
  'r2s-politically_fractured-metropolis-2', 'r2s-religious_conversion-metropolis-0', 'r2s-religious_conversion-metropolis-1', 'r2s-religious_conversion-metropolis-3',
  'r2s-slave_revolt-city-3', 'r2s-under_siege-city-1', 'r2s-wartime-city-0', 'r2s-wartime-city-1',
  'r2s-wartime-metropolis-1', 'r2s-wartime-metropolis-3',
]);
/** the census's towns (and the fresh 300's) in which 6d-members fired at afa46d644 (runC.mjs): one member, "its members" */
const FIRED_MEMBERS = Object.freeze([
  'bar0-hamlet-calm-rand-105', 'bar0-hamlet-calm-rand-106', 'bar0-hamlet-calm-rand-108', 'bar0-hamlet-calm-rand-125',
  'bar0-hamlet-under_siege-rand-107', 'bar0-hamlet-under_siege-rand-112', 'bar0-hamlet-under_siege-rand-119', 'bar0-thorp-calm-rand-103',
  'bar0-thorp-calm-rand-114', 'bar0-thorp-calm-rand-126', 'bar0-thorp-calm-rand-127', 'bar0-thorp-calm-rand-128',
  'r2r-hamlet-28', 'r2r-hamlet-29', 'r2r-hamlet-35', 'r2r-hamlet-37',
  'r2r-hamlet-39', 'r2r-thorp-10', 'r2r-thorp-12', 'r2r-thorp-15',
  'r2r-thorp-20', 'r2r-thorp-23', 'r2r-thorp-27', 'r2r-thorp-3',
  'r2r-thorp-37', 'r2r-thorp-56', 'r2r-thorp-59', 'r2r-thorp-7',
  'r2r-thorp-9', 'r2s-famine-thorp-1', 'r2s-infiltrated-thorp-0', 'r2s-mass_migration-thorp-2',
  'r2s-monster_pressure-thorp-1', 'r2s-occupied-hamlet-0', 'r2s-plague_onset-thorp-1', 'r2s-politically_fractured-hamlet-3',
  'r2s-politically_fractured-village-3', 'r2s-recently_betrayed-thorp-2', 'r2s-recently_betrayed-thorp-3', 'r2s-religious_conversion-hamlet-1',
  'r2s-religious_conversion-thorp-1', 'r2s-religious_conversion-thorp-2', 'r2s-succession_void-thorp-1', 'r2s-under_siege-thorp-0',
  'r2s-wartime-thorp-0',
]);

/** the wide read's C102099: the ruler's own seat (Guild consortium) printed backing the ruler and its high rival at afa46d644 */
const SEAT_TOWN = 'bar0-metropolis-calm-rand-28';
/** @type {Record<string, any>} */
const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...FIRED_10, ...FIRED_MEMBERS, SEAT_TOWN])) towns[seed] = born(seed);
}, 900000);

/** @param {string} seed */
const instancesOf = (seed) => {
  const record = towns[seed]; const tabs = recordTabs(record);
  return [...law10f({ record, tabs, town: seed }), ...law10h({ record, tabs, town: seed })].filter((x) => RULES.has(x.rule));
};

describe('BAR6-POWERS · 10f, 10h and 6d-members (detectors: law10f, law10h over the record\'s printed lines; the atom `seat members`)', () => {
  it('(a) the zero: in every town where a card, a seat\'s backing or a hook broke the rule at afa46d644', () => {
    const failures = collectSeedFailures(FIRED_10, (seed) => {
      expect(instancesOf(seed).map((x) => `${x.rule}: ${String(x.line).slice(0, 90)}`), seed).toEqual([]);
    });
    expectNoSeedFailures(failures, '10f and 10h: zero in the towns where they printed at afa46d644');
  });
  it('(a) the zero: every one-member seat that printed "its members cannot agree" reads `seat members` false, and the line declares it', () => {
    const declaring = variantsOf(DOSSIER_STATE_PROSE_POWER).filter((v) => /members cannot agree/.test(v.text));
    expect(declaring.length).toBeGreaterThan(0);
    for (const v of declaring) expect(v.marks).toContain('seat members');
    const twins = variantsOf(DOSSIER_STATE_PROSE_POWER).filter((v) => Array.isArray(v.marks) && v.marks.includes('no seat members'));
    expect(twins.length).toBeGreaterThan(0);
    const failures = collectSeedFailures(FIRED_MEMBERS, (seed) => { expect(seatMembersOf(towns[seed]), seed).toBe(false); });
    expectNoSeedFailures(failures, '6d-members: the one-member seats read false');
  });
  it('(b) positive control: records built from the wide read\'s rows, each found by the detector', () => {
    const council = { faction: 'High Theocratic Council', category: 'religious', isGoverning: true, power: 40, desc: 'A grand council of senior officials, guild masters, and appointed magnates governs.' };
    const traders = { faction: 'Merchant Guilds', category: 'economy', power: 6, desc: 'A small group of traders who come on market days; they carry little weight.' };
    const nobles = { faction: 'Noble Houses', category: 'noble', power: 20, desc: 'The merchant guilds now have more say: the money has moved.' };
    const guilds = { faction: 'Craft Guilds', category: 'craft', power: 10, desc: 'Craftsmen.' };
    const guard = { faction: 'Military/Guard', category: 'military', power: 12, desc: 'The guard.' };
    const record = { tier: 'metropolis', powerStructure: { factions: [council, nobles, guilds, traders, guard], conflicts: [{ parties: ['High Theocratic Council', 'Craft Guilds'], intensity: 'high' }] }, npcs: [] };
    const tabs = {
      'Systems/Power': [council.desc, traders.desc, nobles.desc],
      'Systems/Institutions': ['Guild consortium · Government', 'Backs · Craft Guilds · High Theocratic Council'],
      'Summary/Plot Hooks': ['Military/Guard has posted guards on what it says is its own.'],
    };
    const found = new Set([...law10f({ record, tabs, town: 'control' }), ...law10h({ record, tabs, town: 'control' })].map((x) => x.rule));
    for (const rule of RULES) expect(found, rule).toContain(rule);
    // the atom: one member reads false, two read true; none cast reads the government's label
    const seat = (/** @type {number} */ n, government = "Headman's Authority") => ({
      powerStructure: { government, factions: [{ faction: government, isGoverning: true }] },
      npcs: Array.from({ length: n }, (_, i) => ({ name: `n${i}`, memberships: [{ power: government, rank: i ? null : 1 }] })) });
    expect(seatMembersOf(seat(1))).toBe(false);
    expect(seatMembersOf(seat(2))).toBe(true);
    expect(seatMembersOf({})).toBeUndefined();
  });
  it('(b) the two cards read their kind and their tier (the leaf the step reads)', () => {
    expect(COUNCIL_BODIES).toEqual(['Town Council', 'City Council', 'Grand Council']);
    const small = () => 'the market-day line';
    const shown = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].map((t) => marketDayLineOf(t, small));
    expectAbsentWithAnchor(shown.slice(4), 'the market-day line', MERCHANTS_OF_LITTLE_WEIGHT_LARGE, 'a city and a metropolis take the twin');
    expect(shown.slice(0, 4)).toEqual(['the market-day line', 'the market-day line', 'the market-day line', 'the market-day line']);
  });
});

describe('BAR6-POWERS · the chair\'s ruling IT1: the page reads the seat\'s backing from one print-only leaf', () => {
  it('the seat drops the ruler\'s high rival on the page; the birth\'s arithmetic (`houseBacksOf`) is untouched', () => {
    const town = towns[SEAT_TOWN]; const seat = /** @type {string} */ (seatHouseName(town.institutions));
    const ruler = town.powerStructure.factions.find((/** @type {any} */ f) => f.isGoverning).faction;
    const raw = houseBacksOf(town).get(seat).map((/** @type {any} */ b) => b.faction);
    expect(raw).toContain('Craft Guilds');
    expect(houseBacksShownOf(town).get(seat).map((b) => b.faction)).toEqual([ruler]);
  });
  it('(KEEP, the chair\'s narrowing of 2026-11-16) a second power the ruler has NO high quarrel with stays on the seat\'s line', () => {
    const town = structuredClone(towns[SEAT_TOWN]); const seat = /** @type {string} */ (seatHouseName(town.institutions));
    town.powerStructure.conflicts = (town.powerStructure.conflicts || []).filter((/** @type {any} */ c) => !(c.parties || []).includes('Craft Guilds'));
    expect(houseBacksShownOf(town).get(seat)).toEqual(houseBacksOf(town).get(seat));
    expect(houseBacksShownOf(town).get(seat).map((b) => b.faction)).toContain('Craft Guilds');
  });
  it('(the chair\'s ruling PL1) the power desk is drawn at print only: no generator imports it', () => {
    const importers = execSync("git grep -l -E \"from '[^']*(powerStateProse|dossierStateProse/power\\.generated|powerDeskRead|dossierMounts|printProse)\\.js'\" -- src/generators || true", { encoding: 'utf8' }).trim();
    const desk = execSync("git grep -l -E \"from '[^']*dossierStateProse/power\\.generated\\.js'\" -- src || true", { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
    expect(desk.length).toBeGreaterThan(0);
    expect(importers).toBe('');
  });
  it('(1) a list the DM authored (X-45) prints as authored: the shown reading narrows only the derived list', () => {
    const town = structuredClone(towns[SEAT_TOWN]); const seat = /** @type {string} */ (seatHouseName(town.institutions));
    const both = houseBacksOf(town).get(seat).map((/** @type {any} */ b) => b.faction);
    applyUserEdit(town.institutions.find((/** @type {any} */ i) => i.name === seat), 'backs', formatBacksValue(both));
    expect(houseBacksShownOf(town).get(seat).map((b) => [b.faction, b.basis])).toEqual(both.map((/** @type {string} */ f) => [f, 'authored']));
    const row = institutionsWithServices(town).find((r) => r.inst.name === seat);
    expect(row?.authored).toBe(true);
    expect(row?.backs.map((/** @type {any} */ b) => b.faction)).toEqual(both);
  });
  it('(2) every house keeps its key and its roster order, and every house but the seat keeps its list, so the editor addresses the same house', () => {
    const town = towns[SEAT_TOWN]; const seat = seatHouseName(town.institutions);
    const raw = houseBacksOf(town); const shown = houseBacksShownOf(town);
    expect([...shown.keys()]).toEqual([...raw.keys()]);
    for (const [name, list] of raw) if (name !== seat) expect(shown.get(name), name).toEqual(list);
    const rows = institutionsWithServices(town);
    // the tab sorts its rows for print; each row still holds its roster object (the editor's address) and that house's list
    for (const r of rows) expect(town.institutions.includes(r.inst), String(r.inst.name)).toBe(true);
    for (const r of rows) expect(r.backs, String(r.inst.name)).toEqual(shown.get(String(r.inst.name)) || []);
  });
  it('(3) the Institutions tab, the Power tab\'s web and the PDF read the one leaf', () => {
    const town = towns[SEAT_TOWN]; const seat = /** @type {string} */ (seatHouseName(town.institutions));
    const shown = houseBacksShownOf(town).get(seat).map((b) => b.faction);
    expect(institutionsWithServices(town).find((r) => r.inst.name === seat)?.backs.map((/** @type {any} */ b) => b.faction)).toEqual(shown);
    expect(institutionBackers(town).get(seat)).toEqual(shown);
    const onWeb = [...deriveFactionSupport(town)].filter(([, bucket]) => bucket.some((x) => x.name === seat)).map(([f]) => f);
    expect(new Set(onWeb)).toEqual(new Set(shown));
  });
});
