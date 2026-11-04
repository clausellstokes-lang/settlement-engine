/**
 * readerBattery.test.js — the READER battery's ten checks (lane READER-INSTRUMENTS, 2026-11-04).
 *
 * Each check is held on a short hand-built rendered text (the line shapes the soak's 60-settlement
 * sample prints, artifacts/reader-base/sample at 64aeda87) and a record holding only what the check
 * consults: one arm where the fault is on the page, one negative control where it is not.
 */
import { describe, expect, test } from 'vitest';

import { institutionalCatalog } from '../../../src/data/institutionalCatalog.js';
import * as R from '../../../src/domain/coherence/readerBattery.js';

/** @param {Record<string, unknown>} over */
const rec = (over = {}) => ({ name: 'Testholm', tier: 'town', config: { terrainType: 'plains', tradeRouteAccess: 'road' }, institutions: [], npcs: [], ...over });

// ── 1. validation-on-page
describe('reader:validation-on-page', () => {
  const overview = 'Structural Issues\nRiver Fisheries: River fisheries require river access.\nAncient Grove: Ancient Grove is not compatible with port access.';
  test('the validator lines on the page fire; on a riverside terrain the requires-river line is its own sub-case', () => {
    const s = rec({ config: { terrainType: 'riverside', tradeRouteAccess: 'port' } });
    const rows = R.validationOnPageFindings(s, { overview, resources: 'Gaps & Opportunities ▲\nStone: Stone quarry exists but lacks access to stone' });
    expect(rows.map((r) => r.detail.split(']')[0])).toEqual(['[structural', '[requires-on-water', '[gaps']);
    expect(rows[1].quote).toBe('River Fisheries: River fisheries require river access.');
  });
  test('the stated count of critical issues against the Critical Issues listed', () => {
    const viability = '✗ Not viable\n2 critical issues prevent settlement survival.\nCritical Issues (1) ▲\nFood production';
    expect(R.validationOnPageFindings(rec(), { viability }).map((r) => r.detail)).toEqual(['[viability-count] states 2, lists Critical Issues (1)']);
    expect(R.validationOnPageFindings(rec(), { viability: '1 critical issue prevents settlement survival.\nStructural Crises (7) ▲' })[0].detail).toBe('[viability-count] states 1, lists Critical Issues (0)');
  });
  test('negative control: a viable page with no validator line is silent', () => {
    expect(R.validationOnPageFindings(rec(), { overview: 'The place\nThe water was here before the town.', viability: '✓ Viable\nCritical Issues (1) ▲' })).toEqual([]);
    expect(R.validationOnPageFindings(rec(), { viability: '1 critical issue prevents settlement survival.\nCritical Issues (1) ▲' })).toEqual([]);
  });
});

// ── 2. scale-lists
describe('reader:scale-lists', () => {
  const economics = 'Trade Profile ▲\nExports\nNo significant exports.\nImports\nIncense and votive candles Camel herds Fine textiles Luxury goods Spices\nTerrain cannot produce';
  test('(a) a hamlet importing luxury-class goods', () => {
    const rows = R.scaleListsFindings(rec({ tier: 'hamlet' }), { economics });
    expect(rows).toHaveLength(1);
    expect(rows[0].detail).toBe('[luxury-imports] hamlet: camel herds, fine textiles, luxury goods, spices');
  });
  test('(a) negative control: the same list in a city, and a hamlet importing salt', () => {
    expect(R.scaleListsFindings(rec({ tier: 'city' }), { economics })).toEqual([]);
    expect(R.scaleListsFindings(rec({ tier: 'hamlet' }), { economics: 'Imports\nSalt Iron tools' })).toEqual([]);
  });
  test('(a) Quality textiles, fine cloth and dyed cloth are luxury-class in a thorp (the chair\'s ruling Q2)', () => {
    expect(R.scaleListsFindings(rec({ tier: 'thorp' }), { economics: 'Imports\nCharcoal and fuel Grain Quality textiles Salt' })[0].detail).toBe('[luxury-imports] thorp: quality textiles');
    expect(R.scaleListsFindings(rec({ tier: 'hamlet' }), { economics: 'Imports\nFine cloth Dyed cloth and quality textiles' })[0].detail).toBe('[luxury-imports] hamlet: fine cloth, dyed cloth, quality textiles');
  });
  test('(b) a resource-trade strength with no house behind it, a column only (the chair\'s ruling Q3); a house behind it is silent', () => {
    const resources = 'Terrain\nMountains\nEconomic strengths\n✓ Gemcutting ✓ Metalworking ✓ Mining ✓ Stoneworking\nResource Exploitation ▲';
    const rows = R.scaleListsFindings(rec({ institutions: [{ name: 'Blacksmiths (3-10)' }, { name: 'Stone quarry' }] }), { resources });
    expect(rows.map((r) => r.detail)).toEqual(['[~strength-no-house] Gemcutting, Mining']);
    expect(R.scaleListsFindings(rec({ institutions: [{ name: 'Mine' }, { name: 'Jeweller' }, { name: 'Blacksmith' }, { name: 'Stone quarry' }] }), { resources })).toEqual([]);
  });
  test('(b) every house pattern names a house the catalogue holds', () => {
    const names = Object.values(institutionalCatalog).flatMap((shelves) => Object.values(shelves).flatMap((rows) => Object.keys(rows)));
    for (const [strength, re] of Object.entries(R.STRENGTH_HOUSES)) expect(names.some((n) => re.test(n)), strength).toBe(true);
  });
  test('(c) the Exports count is a distribution, not a finding', () => {
    expect(R.readerDistributions({ economicState: { primaryExports: ['Raw wool', 'Live sheep'] } })).toEqual({ exports: 2, dailyLifeLine: 0 });
    expect(R.readerDistributions({})).toEqual({ exports: 0, dailyLifeLine: 0 });
    // check 10's distribution: the pages carrying the Daily Life line at all (the chair's ruling)
    expect(R.readerDistributions({}, { daily_life: 'Ordinary life here in prose: dawn, the market, the tavern, the watch.' })).toEqual({ exports: 0, dailyLifeLine: 1 });
  });
});

// ── 3. relation-types
describe('reader:relation-types', () => {
  const page = (kind, a, b) => `NPC Relationships (2) ▲\nAoife Brennan ${kind} Brigid Ward\n${a} · stable · ${b}\n▼`;
  test('Mentor and Successor across two trades, and across arcane and clergy', () => {
    expect(R.relationTypesFindings(rec(), { relationships: page('Mentor and Successor', 'Armourer', 'Gravedigger') })[0].detail).toBe('[mentor-and-successor][~strict] military / trade');
    expect(R.relationTypesFindings(rec(), { relationships: page('Mentor and Successor', 'Artificer', 'High Priest') })).toHaveLength(1);
    expect(R.relationTypesFindings(rec(), { relationships: page('Mentor and Successor', 'Miller', 'Blacksmith') }).map((f) => f.detail)).toEqual(['[~strict] trade / trade (exempted: same class)']);
  });
  test('Professional Rivalry across a trade and a seat; Jurisdictional Tension where neither holds an office', () => {
    expect(R.relationTypesFindings(rec(), { relationships: page('Professional Rivalry', 'Gravedigger', 'Baron/Baroness') })[0].detail).toBe('[professional-rivalry][~strict] trade / noble');
    expect(R.relationTypesFindings(rec(), { relationships: page('Jurisdictional Tension', 'Smuggler', 'Miller') })[0].detail).toBe('[jurisdictional-tension][~strict] criminal / trade');
  });
  test('negative control: a shared trade or office, an office on one side, and the kinds that presume nothing', () => {
    expect(R.relationTypesFindings(rec(), { relationships: page('Mentor and Successor', 'Blacksmith', 'Master Blacksmith') })).toEqual([]);
    expect(R.relationTypesFindings(rec(), { relationships: page('Professional Rivalry', 'Blacksmith', 'Master Blacksmith') })).toEqual([]);
    expect(R.relationTypesFindings(rec(), { relationships: page('Jurisdictional Tension', 'Garrison Commander', 'Reeve') })).toEqual([]);
    expect(R.relationTypesFindings(rec(), { relationships: page('Outstanding Debt', 'Armourer', 'Gravedigger') })).toEqual([]);
    expect(R.relationTypesFindings(rec(), { relationships: page('Mentor and Successor', 'Sage/Scholar', 'Mayor') })).toEqual([]);
  });
  // The chair's ruling Q1 (2026-11-04): the exempted rule is the line, the strict one a column.
  const roster = (spec) => rec({
    npcs: spec.map(([name, role, factionAffiliation]) => ({ name, role, factionAffiliation })),
    powerStructure: { governingName: 'Guild Council', factions: [{ faction: 'Guild Council', isGoverning: true }, { faction: 'Merchant Rivals', contestsNiche: 'Guild Council' }, { faction: 'Military/Guard' }] },
  });
  const row = (a, kind, b, ra, rb) => `${a} ${kind} ${b}\n${ra} · stable · ${rb}\n▼`;
  test('exempted: a Guild Master mentoring the Mayor of a guild-council town is silent; strict keeps a column', () => {
    const s = roster([['Aoife Brennan', 'Guild Master', 'Guild Council'], ['Brigid Ward', 'Mayor', 'Guild Council']]);
    expect(R.relationTypesFindings(s, { relationships: row('Aoife Brennan', 'Mentor and Successor', 'Brigid Ward', 'Guild Master', 'Mayor') }).map((f) => f.detail)).toEqual(['[~strict] merchant / office (exempted: same faction)']);
  });
  test('exempted: the seat holder and a member of the body that holds the seat, a contesting faction as one office', () => {
    const s = roster([['Aoife Brennan', 'Master Weaver', 'Merchant Rivals'], ['Brigid Ward', 'Mayor', 'Guild Council']]);
    expect(R.relationTypesFindings(s, { relationships: row('Aoife Brennan', 'Mentor and Successor', 'Brigid Ward', 'Master Weaver', 'Mayor') }).map((f) => f.detail)).toEqual(["[~strict] trade / office (exempted: the seat's factions, one office)"]);
    const unaffiliated = roster([['Aoife Brennan', 'Master Weaver', 'Guild Council'], ['Brigid Ward', 'Mayor', '']]);
    expect(R.relationTypesFindings(unaffiliated, { relationships: row('Aoife Brennan', 'Mentor and Successor', 'Brigid Ward', 'Master Weaver', 'Mayor') }).map((f) => f.detail)).toEqual(['[~strict] trade / office (exempted: seat and its body)']);
  });
  test('exempted still fires: a Gravedigger mentoring a Baron, and a Professional Rivalry with no shared trade or market', () => {
    const s = roster([['Aoife Brennan', 'Gravedigger', 'Guild Council'], ['Brigid Ward', 'Baron/Baroness', 'Military/Guard']]);
    expect(R.relationTypesFindings(s, { relationships: row('Aoife Brennan', 'Mentor and Successor', 'Brigid Ward', 'Gravedigger', 'Baron/Baroness') }).map((f) => f.detail)).toEqual(['[mentor-and-successor][~strict] trade / noble']);
    // Unit 12 (the chair's ruling): rivals for standing pass — two offices, noble and office, noble and noble.
    expect(R.relationTypesFindings(roster([]), { relationships: row('A B', 'Professional Rivalry', 'C D', 'Mayor', 'Council Member') })).toEqual([]);
    expect(R.relationTypesFindings(roster([]), { relationships: row('A B', 'Professional Rivalry', 'C D', 'Mayor', 'Baron/Baroness') })).toEqual([]);
    expect(R.relationTypesFindings(roster([]), { relationships: row('A B', 'Professional Rivalry', 'C D', 'Baron/Baroness', 'Knight/Dame') })).toEqual([]);
    expect(R.relationTypesFindings(roster([]), { relationships: row('A B', 'Professional Rivalry', 'C D', 'Armourer', 'High Priest') }).map((f) => f.detail)).toEqual(['[professional-rivalry][~strict] military / clergy']);
    expect(R.relationTypesFindings(roster([]), { relationships: row('A B', 'Professional Rivalry', 'C D', 'Wealthiest Merchant', 'Guild Master') })).toEqual([]);
  });
  test('exempted: two members of one faction in a Professional Rivalry are silent (unit 12)', () => {
    const s = roster([['Aoife Brennan', 'Gravedigger', 'Military/Guard'], ['Brigid Ward', 'Baron/Baroness', 'Military/Guard']]);
    expect(R.relationTypesFindings(s, { relationships: row('Aoife Brennan', 'Professional Rivalry', 'Brigid Ward', 'Gravedigger', 'Baron/Baroness') }).map((f) => f.detail)).toEqual(['[~strict] trade / noble (exempted: same faction)']);
  });
  test('exempted Jurisdictional Tension needs two office-holders; strict fires only where neither holds one', () => {
    expect(R.relationTypesFindings(roster([]), { relationships: row('A B', 'Jurisdictional Tension', 'C D', 'Garrison Commander', 'Miller') }).map((f) => f.detail)).toEqual(['[jurisdictional-tension] military / trade']);
    expect(R.relationTypesFindings(roster([]), { relationships: row('A B', 'Jurisdictional Tension', 'C D', 'Garrison Commander', 'Reeve') })).toEqual([]);
  });
  test('the role map classes every role the generator draws', () => {
    expect(R.classOfRole('Guild Master')).toBe('merchant');
    expect(R.classOfRole('Baron/Baroness')).toBe('noble');
    expect(R.classOfRole('Mayor')).toBe('office');
    expect(R.classOfRole('Gravedigger')).toBe('trade');
    expect(R.classOfRole('Unheard-of Role')).toBe('other');
  });
});

// ── 4. tension-memory
describe('reader:tension-memory', () => {
  const desc = 'A previous occupation ended, but collaborators and resisters continued to live side by side, their history unresolved';
  const s = (yearsAgo) => rec({ history: {
    currentTensions: [{ type: 'occupation_legacy', description: desc, factions: ['Former collaborators', 'Former resistance'] }],
    historicalEvents: [{ yearsAgo, name: 'The Occupation', description: desc, templateType: 'occupation_legacy' }],
  } });
  const page = (yearsAgo, band) => `Current Tensions (1) ▲\nOccupation Legacy major\n${desc}\nFormer collaborators Former resistance\nMajor Historical Events (1) ▲\nThe Occupation Exile & Return major\n${desc}\n${yearsAgo}y ago\n${band}\n▼`;
  test('a living grievance from an event in Deep history', () => {
    const rows = R.tensionMemoryFindings(s(299), { history: page(299, 'Deep history') });
    expect(rows).toHaveLength(1);
    expect(rows[0].detail).toMatch(/^\[deep-history\] The Occupation, 299y ago/);
  });
  test('negative control: the same tension from an event in living memory', () => {
    expect(R.tensionMemoryFindings(s(26), { history: page(26, 'Living memory') })).toEqual([]);
  });
});

// ── 5. hook-pools
describe('reader:hook-pools', () => {
  const plot = 'NPCs\nSatish Balan\nOne of their people is talking to the guard. They don\'t know which one yet. They\'re watching.\nHistory\nA guard captain is on the payroll of the criminal network';
  test('a guard in the hooks where the roster has no enforcement body', () => {
    const rows = R.hookPoolsFindings(rec({ config: { terrainType: 'hills', tradeRouteAccess: 'port' }, institutions: [{ name: 'Bandit affiliate' }], npcs: [{ role: 'Elder' }] }), { plot_hooks: plot });
    expect(rows.map((r) => r.detail)).toEqual(['[guard] "guard" with no enforcement body']);
  });
  test('ships in the hooks of a place with no water', () => {
    const rows = R.hookPoolsFindings(rec({ institutions: [{ name: 'Town watch' }] }), { plot_hooks: 'Economics\nIf the siege holds, the shipbuilding trades stall within the month.' });
    expect(rows.map((r) => r.detail)).toEqual(['[sea] "shipbuilding" at terrain plains, route road']);
  });
  test('negative control: a watch on the roster, water on the route, and "watching" is no watch', () => {
    expect(R.hookPoolsFindings(rec({ config: { terrainType: 'hills', tradeRouteAccess: 'port' }, institutions: [{ name: 'Village watch' }] }), { plot_hooks: `${plot}\nThe docks are quiet.` })).toEqual([]);
    expect(R.hookPoolsFindings(rec(), { plot_hooks: 'NPCs\nThey\'re watching the well.' })).toEqual([]);
  });
});

// ── 6. traditions-water
describe('reader:traditions-water', () => {
  const traditions = 'The founding traditions of Innissike.\n⚓\nThe Landfall Procession\nFirst Landing\nKept in Seedtime, the tenth week.\n∿\nThe Tide Fair\nTide';
  test('a Landfall and a Tide Fair on a plains road', () => {
    expect(R.traditionsWaterFindings(rec(), { traditions })).toEqual([{ surface: 'traditions', quote: 'The Landfall Procession', detail: 'terrain plains, route road' }]);
  });
  test('negative control: the same traditions by a river, and land traditions on the road', () => {
    expect(R.traditionsWaterFindings(rec({ config: { terrainType: 'riverside', tradeRouteAccess: 'road' } }), { traditions })).toEqual([]);
    expect(R.traditionsWaterFindings(rec({ config: { terrainType: 'plains', tradeRouteAccess: 'port' } }), { traditions })).toEqual([]);
    expect(R.traditionsWaterFindings(rec(), { traditions: 'The Great Vigil\nMarket\nThe Long Sun Contest\nLong Sun' })).toEqual([]);
  });
});

// ── 7. tonight-wants
describe('reader:tonight-wants', () => {
  test('"Wants to" followed by a sentence', () => {
    const rows = R.tonightWantsFindings(rec(), { tonight: 'People to voice\nLalita Acharya\nElder · Holds the seat\nWants to Was approached before the betrayal and said no.' });
    expect(rows).toHaveLength(1);
    expect(rows[0].detail).toBe('1 lines; starts "Was"');
  });
  test('negative control: a want with its verb', () => {
    expect(R.tonightWantsFindings(rec(), { tonight: 'Wants to extend the institution\'s civic role.' })).toEqual([]);
  });
});

// ── 8. rule-text
describe('reader:rule-text', () => {
  test('catalogue threshold notes on a DM surface, one per surface', () => {
    const rows = R.ruleTextFindings(rec(), {
      institutions: 'Golem workforce: Constructed servants, where the magic allows them.',
      foundry: "Mages' guild: Organization of magic users. 2,000-5,000 population for chapter.",
      pdf: 'Artificer: Magic items made to order. It wants a population of 5,000 or more, as a rule.',
    });
    expect(rows.map((r) => `${r.surface}: ${r.detail}`)).toEqual(['institutions: where the magic allows them', 'foundry: 2,000-5,000 population for', 'pdf: population of 5,000 or more']);
  });
  test('negative control: a population figure that is no rule', () => {
    expect(R.ruleTextFindings(rec(), { overview: 'Al-karez town · 1,327 pop. · port', viability: 'A city of 9,541 souls.' })).toEqual([]);
  });
});

// ── 9. possessive-slip
describe('reader:possessive-slip', () => {
  test('a doubled possessive in a title', () => {
    expect(R.possessiveSlipFindings(rec(), { power: "Nóinín O'Neill Guildmaster of Tailor's' ●" })).toEqual([{ surface: 'power', quote: "Nóinín O'Neill Guildmaster of Tailor's' ●", detail: "Tailor's'" }]);
  });
  test("negative control: a plain possessive and a plural possessive", () => {
    expect(R.possessiveSlipFindings(rec(), { power: "Guildmaster of the Tailors' Guild · the Tailor's shop" })).toEqual([]);
  });
});

// ── 10. daily-life-placeholder
describe('reader:daily-life-placeholder', () => {
  const daily_life = 'Food\nStrained\nOrdinary life here in prose: dawn, the market, the tavern, the watch.';
  test('the line, once, where it names a market or a watch the Institutions tab lacks', () => {
    // The chair's ruling (2026-11-04): the LINE once per settlement; the detail names the sub-case(s).
    expect(R.dailyLifePlaceholderFindings(rec({ institutions: [{ name: 'Burial ground' }] }), { daily_life }).map((r) => r.detail)).toEqual(['[no-market][no-watch] no market, no watch']);
    expect(R.dailyLifePlaceholderFindings(rec({ institutions: [{ name: 'Periodic market' }] }), { daily_life }).map((r) => r.detail)).toEqual(['[no-watch] no watch']);
    expect(R.dailyLifePlaceholderFindings(rec({ institutions: [{ name: 'Town watch' }] }), { daily_life }).map((r) => r.detail)).toEqual(['[no-market] no market']);
  });
  test('negative control: a market and a watch on the roster, and a Daily Life tab without the line', () => {
    expect(R.dailyLifePlaceholderFindings(rec({ institutions: [{ name: 'Market square' }, { name: 'Town watch' }] }), { daily_life })).toEqual([]);
    expect(R.dailyLifePlaceholderFindings(rec(), { daily_life: 'Food\nSecure' })).toEqual([]);
  });
});

// ── the battery
describe('readerBattery', () => {
  test('runs the ten checks in order, in the battery shape, and a throwing check is a finding', () => {
    expect(R.READER_BATTERY_CHECKS).toHaveLength(10);
    const rows = R.readerBattery(rec({ tier: 'hamlet' }), { tonight: 'Wants to The supplies.', power: "Tailor's'" });
    expect(rows.map((f) => f.check)).toEqual(['tonight-wants', 'possessive-slip']);
    for (const f of rows) expect(Object.keys(f).sort()).toEqual(['check', 'detail', 'quote', 'surface']);
    expect(R.readerBattery(null, {})).toEqual([]);
    const thrown = R.readerBattery(rec({ history: { get currentTensions() { throw new Error('boom'); } } }), { history: 'x' }, { only: ['tension-memory'] });
    expect(thrown).toEqual([{ check: 'tension-memory', surface: 'record', quote: '', detail: 'instrument threw: boom' }]);
  });
});
