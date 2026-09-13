/**
 * factionBacking.test.js — A POWER EXISTS ONLY WHERE AN INSTITUTION CAN REPRESENT IT
 * (brief ADDENDUM 18 ruling 16; car 8b-W-18e).
 *
 * Three families of pin:
 *   1. THE TABLE IS ENUMERATED, NEVER GUESSED — every listed row is a real catalogue row,
 *      every catalogue row's verdict is pinned (a row added to the catalogue lands here
 *      as a visible diff, never as a silent verdict), and the strict rule's named
 *      refusals hold (a person, a service, a burial ground, a wall back nothing).
 *   2. THE MINT IS GATED — for each standing archetype, a fixed-seed town from the rate
 *      grid that carries NO backing row does not mint the power, and the SAME seed with
 *      the backing row forced by toggle does; the crisis factions are stamped and exempt.
 *   3. THE MARK IN PLAY — the pulse leaf stamps `unbacked: true` when the last backing
 *      row is ruined, clears it when a row stands again, never touches the governing
 *      seat or a crisis faction, and returns its inputs by reference when nothing moves.
 */
import { describe, it, expect } from 'vitest';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import {
  BACKING_ROW_NAMES,
  CRISIS_FACTIONS,
  FACTION_BACKING,
  GATED_ARCHETYPES,
  INSTITUTION_CLASSES,
  INSTITUTION_CLASS_KEYS,
  NON_BACKING_ROWS,
  backedArchetypesOf,
  declaredBacksPowers,
  factionIsBacked,
  factionRecordIsBacked,
  gatedArchetypesOf,
  powersBackedByInstitution,
  powersOf,
} from '../../src/domain/factionBacking.js';
import {
  advanceFactionBacking,
  markUnbackedFactions,
} from '../../src/domain/worldPulse/factionBackingKernel.js';
import { densityCandidatePowersFrom } from '../../src/domain/worldPulse/factionDensityKernel.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

/** Every catalogue row name (lowercased) → its section, across all tiers. */
function catalogueRows() {
  /** @type {Map<string, string>} */
  const rows = new Map();
  for (const sections of Object.values(institutionalCatalog)) {
    for (const [section, defs] of Object.entries(sections)) {
      for (const name of Object.keys(defs)) rows.set(name.toLowerCase(), section);
    }
  }
  return rows;
}

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });
const names = (s) => (s.powerStructure?.factions || []).map((f) => f.faction);
const live = (s) => s.institutions.filter((i) => !i._worldPulseInactive).map((i) => i.name);

describe('the table — enumerated from the catalogue, never guessed', () => {
  it('lists no ghost row: every backing row and every named refusal is a catalogue row', () => {
    const rows = catalogueRows();
    const ghosts = [...BACKING_ROW_NAMES, ...Object.keys(NON_BACKING_ROWS)].filter((n) => !rows.has(n));
    expect(ghosts).toEqual([]);
  });

  it('every gated archetype has at least one class, and every class names a gated power', () => {
    for (const power of GATED_ARCHETYPES) expect(FACTION_BACKING[power].length, power).toBeGreaterThan(0);
    for (const cls of INSTITUTION_CLASS_KEYS) {
      for (const p of INSTITUTION_CLASSES[cls].powers) expect(GATED_ARCHETYPES).toContain(p);
    }
  });

  it('pins the verdict of EVERY catalogue row (a new row must be classified consciously)', () => {
    const rows = catalogueRows();
    const verdicts = {};
    for (const name of [...rows.keys()].sort()) {
      verdicts[name] = [...powersBackedByInstitution({ name })];
    }
    // The unclassified rows: neither a backing row nor a named refusal. They map to
    // nothing by the keyword fallback too — a well, a granary, a quarry, a theatre.
    const unclassified = [...rows.keys()].filter((n) => !BACKING_ROW_NAMES.includes(n) && !(n in NON_BACKING_ROWS));
    for (const n of unclassified) expect(verdicts[n], n).toEqual([]);
    expect(unclassified.sort()).toEqual([
      'advanced water infrastructure', 'aqueduct or water system', 'bardic college', 'beekeeper',
      'brothel', 'brothel (red light district)', 'charcoal burner', 'city granaries',
      'common grazing land', 'communal root cellar', 'dairy farmer', 'dragon resident',
      'dwellings (17-80)', 'dwellings (4-16)', 'dwellings (80-180)', 'farmland',
      "fisher's landing", 'fishing community', 'fishmonger', 'healer (divine, 1st level)',
      'housing (1000-5000 structures)',
      'housing (180-1000 structures)', "hunter's lodge", 'large prison', 'maltster',
      'massive prison', 'mine', 'mine (open cast)', 'multiple theaters',
      'multiple water sources', 'opera house', 'peat cutter', 'red light district',
      'salt works', 'sewage system', 'shepherd', 'shepherd collective', 'small prison/stocks',
      'state granary complex', 'stone quarry', 'subsistence farming', 'theaters',
      'town granary', 'water source', 'wildfowler', "woodcutter's camp",
    ]);
    // The strict rule's own examples, by name.
    expect(verdicts['priest (resident)']).toEqual([]);
    expect(verdicts['access to parish church']).toEqual([]);
    expect(verdicts['burial ground']).toEqual([]);
    expect(verdicts['mill']).toEqual([]);
    expect(verdicts['town walls']).toEqual([]);
    expect(verdicts['hedge wizard']).toEqual([]);
    expect(verdicts['local fence']).toEqual([]);
    expect(verdicts['wayside shrine']).toEqual(['religious']);
    expect(verdicts['parish church']).toEqual(['religious']);
    expect(verdicts['weekly market']).toEqual(['merchant']);
    expect(verdicts['merchant guilds (3-8)']).toEqual(['merchant']);
    expect(verdicts['craft guilds (5-15)']).toEqual(['craft']);
    expect(verdicts['blacksmith']).toEqual(['craft']);
    expect(verdicts['citizen militia']).toEqual(['military']);
    expect(verdicts['street gang']).toEqual(['criminal']);
    expect(verdicts["mages' guild"]).toEqual(['arcane']);
    expect(verdicts["lord's steward"]).toEqual(['noble', 'government']);
    expect(verdicts['royal seat']).toEqual(['noble', 'government']);
    expect(verdicts['guild governance']).toEqual(['government', 'craft', 'merchant']);
    expect(verdicts['merchant oligarchy']).toEqual(['government', 'merchant']);
    expect(verdicts['town council']).toEqual(['government']);
  });

  it('a catalogue row is answered by the enumeration alone; the keyword fallback serves non-catalogue names only', () => {
    // 'Black market' contains 'market' — the enumeration files it under the underworld.
    expect(powersBackedByInstitution({ name: 'Black market' })).toEqual(['criminal']);
    // A fixture name that is no catalogue row falls to the keywords.
    expect(powersBackedByInstitution({ name: 'Temple' })).toEqual(['religious']);
    expect(powersBackedByInstitution({ name: 'Market' })).toEqual(['merchant']);
    expect(powersBackedByInstitution({ name: 'Granary' })).toEqual([]);
    expect(powersBackedByInstitution({ name: 'Manor' })).toEqual(['noble', 'government']);
    // A named refusal never comes back through the keywords.
    expect(powersBackedByInstitution({ name: 'Access to parish church' })).toEqual([]);
  });

  it('a custom row answers from its declared class: backsPowers > authority > category > tags > name', () => {
    const custom = (extra) => ({ isCustom: true, source: 'custom', name: 'Hall of the Nine', ...extra });
    expect(powersBackedByInstitution(custom({ backsPowers: ['craft', 'government'] }))).toEqual(['craft', 'government']);
    // An invalid declaration is "not declared", never a partial acceptance.
    expect(declaredBacksPowers(['craft', 'dragons'])).toBeNull();
    expect(powersBackedByInstitution(custom({ backsPowers: ['craft', 'dragons'], authority: 'martial' }))).toEqual(['military']);
    expect(powersBackedByInstitution(custom({ category: 'Religious' }))).toEqual(['religious']);
    expect(powersBackedByInstitution(custom({ category: 'Other', tags: ['banking'] }))).toEqual(['merchant']);
    expect(powersBackedByInstitution(custom({ category: 'Other', name: 'Chapel of the Nine' }))).toEqual(['religious']);
    // A game-master-built chapel backs the religious power with no choice made.
    const backed = backedArchetypesOf({ institutions: [custom({ category: 'Religious', name: 'Chapel of the Nine' })] });
    expect(backed.religious).toEqual(['Chapel of the Nine']);
  });

  it('reads the LIVE roster: a ruined, removed or closed row backs nothing', () => {
    const s = { institutions: [
      { name: 'Parish church', status: 'ruined', _worldPulseInactive: true },
      { name: 'Weekly market', status: 'remnant', _worldPulseInactive: true },
      { name: 'Citizen militia' },
    ] };
    expect(backedArchetypesOf(s)).toEqual({ military: ['Citizen militia'] });
    expect(factionIsBacked('religious', s)).toBe(false);
    expect(factionIsBacked('military', s)).toBe(true);
    expect(factionIsBacked('government', { institutions: [] })).toBe(true);
  });

  it("the engine's own faction names answer by name; the governing seat, a crisis faction and a DM house are exempt", () => {
    expect(gatedArchetypesOf({ faction: 'Craft Guilds', category: 'economy' })).toEqual(['craft']);
    expect(gatedArchetypesOf({ faction: 'Merchant Guilds (dominant)', category: 'economy' })).toEqual(['merchant']);
    expect(gatedArchetypesOf({ faction: 'Rising Merchants', category: 'economy' })).toEqual(['merchant', 'craft']);
    expect(gatedArchetypesOf({ faction: 'Town Council', isGoverning: true })).toBeNull();
    expect(gatedArchetypesOf({ faction: 'War Council' })).toBeNull();
    expect(gatedArchetypesOf({ faction: 'Sworn Companies', category: 'military', crisis: true })).toBeNull();
    expect(gatedArchetypesOf({ faction: 'Temple of Dawn', createdByEventId: 'evt_1' })).toBeNull();
    expect(gatedArchetypesOf({ faction: 'Smugglers of the Reach' })).toEqual(['criminal']);
    // A name of no gated archetype is exempt: the rule reads the engine's powers, not every label.
    expect(gatedArchetypesOf({ faction: 'The Red Hand' })).toBeNull();
    expect(gatedArchetypesOf({ faction: 'Dockside Labourers', category: 'labor' })).toBeNull();
    for (const name of Object.keys(CRISIS_FACTIONS)) expect(gatedArchetypesOf({ faction: name }), name).toBeNull();
  });
});

describe('the mint is gated on the live institution roster (fixed rate-grid seeds)', () => {
  // Each row: the archetype, a rate-grid town that carried the power BEFORE the car and
  // no backing row, the faction it no longer mints, and the row that restores it.
  const PINS = [
    { archetype: 'merchant', faction: 'Merchant Guilds', seed: 'rate-0-1',
      config: { settType: 'thorp', tradeRouteAccess: 'random_trade', monsterThreat: 'random_threat', culture: 'latin', terrainOverride: 'riverside' },
      force: 'thorp::Economy::Periodic market', row: 'Periodic market' },
    { archetype: 'noble', faction: 'Manor Household', seed: 'rate-1-0',
      config: { settType: 'hamlet', tradeRouteAccess: 'random_trade', monsterThreat: 'random_threat', culture: 'latin', terrainOverride: 'hills' },
      force: "hamlet::Government::Lord's steward", row: "Lord's steward" },
    { archetype: 'noble', faction: 'Landed Gentry', seed: 'rate-3-0',
      config: { settType: 'town', tradeRouteAccess: 'random_trade', monsterThreat: 'random_threat', culture: 'arabic', terrainOverride: 'riverside' },
      force: "town::Government::Lord's appointee", row: "Lord's appointee" },
    { archetype: 'noble', faction: 'Noble Families', seed: 'rate-4-0',
      config: { settType: 'city', tradeRouteAccess: 'random_trade', monsterThreat: 'random_threat', culture: 'norse', terrainOverride: 'coastal' },
      force: 'city::Government::Noble governor', row: 'Noble governor' },
    { archetype: 'military', faction: 'Military/Guard', seed: 'rate-7-0',
      config: { settType: 'hamlet', tradeRouteAccess: 'road', monsterThreat: 'random_threat', culture: 'mesoamerican', terrainOverride: 'plains' },
      force: 'hamlet::Defense::Citizen militia', row: 'Citizen militia' },
    { archetype: 'arcane', faction: 'Arcane Orders', seed: 'rate-34-0',
      config: { settType: 'city', tradeRouteAccess: 'isolated', monsterThreat: 'random_threat', culture: 'latin', terrainOverride: 'desert' },
      force: "city::Magic::Mages' guild", row: "Mages' guild" },
    { archetype: 'criminal', faction: "Thieves' Guild", seed: 'rate-141-3',
      config: { settType: 'town', tradeRouteAccess: 'none', monsterThreat: 'frontier', culture: 'latin', terrainOverride: 'riverside' },
      force: 'town::Criminal::Street gang', row: 'Street gang' },
  ];

  for (const pin of PINS) {
    it(`${pin.faction}: no ${pin.archetype} row → not minted; the row forced on the same seed → minted`, () => {
      const bare = gen(pin.config, pin.seed);
      const backed = backedArchetypesOf(bare);
      expect(backed[pin.archetype], `${pin.seed} carries ${JSON.stringify(live(bare))}`).toBeUndefined();
      expect(names(bare)).not.toContain(pin.faction);

      const forced = gen({ ...pin.config, _institutionToggles: { [pin.force]: { allow: true, require: true } } }, pin.seed);
      expect(live(forced)).toContain(pin.row);
      expect(backedArchetypesOf(forced)[pin.archetype]).toContain(pin.row);
      expect(names(forced)).toContain(pin.faction);
    });
  }

  it('a village mints Religious Authorities and Craft Guilds on its church and its workshops, each named as the backer', () => {
    const s = gen({ settType: 'village', tradeRouteAccess: 'random_trade', monsterThreat: 'random_threat', culture: 'celtic', terrainOverride: 'forest' }, 'rate-2-0');
    const backed = backedArchetypesOf(s);
    expect(backed.religious).toContain('Parish church');
    expect(backed.craft.length).toBeGreaterThan(0);
    expect(names(s)).toContain('Religious Authorities');
    expect(names(s)).toContain('Craft Guilds');
    // A resident priest is a person: he is not among the backers even though he stands.
    expect(live(s)).toContain('Priest (resident)');
    expect(backed.religious).not.toContain('Priest (resident)');
  });

  it('every standing power a generated town seats is backed; every crisis faction is stamped and exempt', () => {
    const s = gen({ settType: 'town', tradeRouteAccess: 'crossroads', monsterThreat: 'heartland', culture: 'norse', terrainOverride: 'hills', stressTypes: ['famine', 'under_siege'] }, 'car-18e-crisis');
    const read = powersOf(s);
    expect(read.unbacked).toEqual([]);
    const crisis = s.powerStructure.factions.filter((f) => f.crisis === true).map((f) => f.faction);
    expect(crisis).toEqual(expect.arrayContaining(['Grain Holders', 'War Council']));
    for (const f of s.powerStructure.factions) {
      if (f.crisis) expect(gatedArchetypesOf(f), f.faction).toBeNull();
      if (f.isGoverning) expect(f.crisis).toBeUndefined();
    }
    // The governing seat never carries the stamp and is never gated.
    const gov = read.present.find((p) => p.faction === s.powerStructure.governingName);
    expect(gov.exempt).toBe(true);
  });

  it('the density cadence draws its candidate pool from the same fact', () => {
    const place = (institutions) => ({
      institutions,
      powerStructure: { factions: [{ faction: 'The Crown', category: 'noble', isGoverning: true }] },
      economicState: { compound: {} },
    });
    // A wall alone no longer seats a military power; a shed alone no longer seats a merchant one.
    expect(densityCandidatePowersFrom(place([{ name: 'Town walls', category: 'Defense' }, { name: 'Thatcher', category: 'Crafts' }]))).toEqual([]);
    const pool = densityCandidatePowersFrom(place([{ name: 'Citizen militia', category: 'Defense' }, { name: 'Wayside shrine', category: 'Religious' }]));
    expect(pool.map((p) => p.category).sort()).toEqual(['military', 'religious']);
  });
});

describe('the mark in play — the pulse leaf', () => {
  const town = () => {
    const s = gen({ settType: 'village', tradeRouteAccess: 'random_trade', monsterThreat: 'random_threat', culture: 'celtic', terrainOverride: 'forest' }, 'rate-2-0');
    return { ...s, id: 'ashford' };
  };
  const ruinFaith = (s) => ({
    ...s,
    institutions: s.institutions.map((i) => (
      powersBackedByInstitution(i).includes('religious')
        ? { ...i, status: 'ruined', _worldPulseInactive: true }
        : i
    )),
  });
  const snapOf = (...list) => ({ settlements: list.map((s) => ({ id: s.id, settlement: s })) });
  const updatesOf = (...list) => list.map((s) => ({ saveId: s.id, save: {}, settlement: s }));

  it('returns its inputs BY REFERENCE when no mark moves (dormancy by construction)', () => {
    const s = town();
    const updates = updatesOf(s);
    const out = advanceFactionBacking({ snapshot: snapOf(s), settlementUpdates: updates });
    expect(out.changed).toBe(false);
    expect(out.settlementUpdates).toBe(updates);
    expect(markUnbackedFactions(s).settlement).toBe(s);
  });

  it('stamps `unbacked: true` on the power whose last backing row was ruined, and on nothing else', () => {
    const s = town();
    expect(names(s)).toContain('Religious Authorities');
    const ruined = ruinFaith(s);
    const out = advanceFactionBacking({ snapshot: snapOf(s), settlementUpdates: updatesOf(ruined) });
    expect(out.changed).toBe(true);
    const next = out.settlementUpdates[0].settlement;
    const marked = next.powerStructure.factions.filter((f) => f.unbacked === true).map((f) => f.faction);
    expect(marked).toEqual(['Religious Authorities']);
    // Everything else is the same object — only the moved faction is a new record.
    for (const f of next.powerStructure.factions) {
      if (f.faction !== 'Religious Authorities') expect(s.powerStructure.factions).toContain(f);
    }
    expect(next.powerStructure.factions.length).toBe(s.powerStructure.factions.length);
  });

  it('clears the mark when a backing row stands again (the symmetric half), and never marks the seat or a crisis faction', () => {
    const s = town();
    const marked = markUnbackedFactions(ruinFaith(s)).settlement;
    expect(marked.powerStructure.factions.some((f) => f.unbacked)).toBe(true);
    // A chapel the game master builds: the mark clears.
    const rebuilt = { ...marked, institutions: [...marked.institutions, { name: 'Chapel of the Nine', category: 'Religious', isCustom: true, source: 'custom' }] };
    const cleared = markUnbackedFactions(rebuilt).settlement;
    expect(cleared.powerStructure.factions.some((f) => f.unbacked)).toBe(false);
    expect(cleared.powerStructure.factions.find((f) => f.faction === 'Religious Authorities')).not.toHaveProperty('unbacked');
    // The seat and a crisis faction are never marked, whatever the roster.
    const bare = {
      ...s, institutions: [],
      powerStructure: { ...s.powerStructure, factions: [
        { faction: 'Elder Council', isGoverning: true, power: 50 },
        { faction: 'War Council', crisis: true, power: 30 },
        { faction: 'Military/Guard', power: 20 },
      ] },
    };
    const r = markUnbackedFactions(bare);
    expect(r.marked).toEqual(['Military/Guard']);
    expect(r.settlement.powerStructure.factions.map((f) => f.unbacked === true)).toEqual([false, false, true]);
    expect(factionRecordIsBacked({ faction: 'War Council' }, {})).toBe(true);
  });

  it('writes only onto an existing update entry (the one-writer law), in codepoint order', () => {
    const s = town();
    const out = advanceFactionBacking({ snapshot: snapOf(ruinFaith(s)), settlementUpdates: [] });
    expect(out.changed).toBe(false);
    expect(out.settlementUpdates).toEqual([]);
  });
});
