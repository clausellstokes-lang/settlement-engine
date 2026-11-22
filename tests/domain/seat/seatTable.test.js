/**
 * tests/domain/seat/seatTable.test.js — U2 (CS6, CS4): THE ONE TABLE OF FORMS BY HOLDER KIND, AND THE
 * ONE READER OF A POWER'S KIND FOR THE CONTEST (SEAT-1 train 1; brief
 * docs/chair/2026-11-20/content/seat/briefs/U2-TABLE.md).
 *
 * The arms, in the brief's order:
 *   (1) every form name the two emitters can emit (`rulingStructure.js :: generatePowerStructure`
 *       and `rulingPower.js :: transferRulingPower`) has a kind in the one table; the names are this
 *       file's own fixture, and a source-scan / executed-enumeration arm reds when an emitter gains a
 *       name the fixture does not hold;
 *   (2) today's `governmentLabelFor` strings, every kind x every tier, pinned as LITERALS, and today's
 *       alternates through the real `transferRulingPower`, under both laws; the old table lives in
 *       the one home and nowhere else;
 *   (3) the three kinds the two old tables disagreed on (craft, outsider, occupation) take the
 *       table's family, and today's id stays pinned, per kind, in the competition layer's one writer
 *       of a NEW faction state (`factionCompetition.js :: ensureFactionStates`) under the old law.
 *       The seat-law branch of that writer landed with the CURE, below;
 *   (4) the kind reader (criminal and veiled FIRST, then craft off the name, civic folded), with its
 *       veil read pinned equal to `cardVeil.js :: isVeiledPower` and its craft read to
 *       `powerSupport.js :: backingArchetypeOf` on every row of a born pool;
 *   (5) the pair check.
 *
 * THE CURE (briefs/U2-CURE.md: the chair's rulings of 09:26Z on U2's stops, and SEAT-2's own):
 *   (a) the old law's competition id, per archetype, lives in the one table (`oldLawFamilyOf`), each
 *       pinned as the literal `factionCompetition.js :: GOVERNMENT_BY_ARCHETYPE` held at 0ab034531;
 *   (b) a NEW faction state's `governmentPreference`: today's id under the old law, the table's
 *       family under the seat law, a stored preference first under both;
 *   (c) that family is read off the power's OWN kind (`ownKindOf`), never its veil: a hidden
 *       non-criminal power keeps its own kind's family, a criminal power reads criminal;
 *   (d) born worlds at every tier, a town-size case among them.
 *
 * THE SECOND CURE (briefs/U2-CURE2.md, SEAT-2's red at the merge: the line's titles test reads
 * `rulingPower.js :: GOVERNMENT_PREFERENCES`, which U2 removed):
 *   (e) `rulingPower.js` exports `GOVERNMENT_PREFERENCES` again, as the one table's frozen VIEW
 *       (`seatTable.js :: TRANSFER_FORMS_VIEW`, re-exported, never re-spelled): today's literal object,
 *       key for key and in today's key order, each cell the transfer's own form, frozen to its leaves.
 */
import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { commentsOnly } from '../../helpers/codeOnlySource.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import {
  SEAT_TABLE, SEAT_BANDS, SEAT_CIRCUMSTANCES, seatBandOf, seatRowOf, preferredFormOf, alternateFormOf,
  governmentFamilyOf, formKindOf, pairLicense, isVeiledRow, contestKindOf, ownKindOf, oldLawFamilyOf,
  TRANSFER_FORMS_VIEW,
} from '../../../src/domain/seat/seatTable.js';
import { governmentLabelFor, transferRulingPower, GOVERNMENT_PREFERENCES } from '../../../src/domain/rulingPower.js';
import { ensureFactionStates } from '../../../src/domain/worldPulse/factionCompetition.js';
import { FACTION_ARCHETYPES as A, factionArchetype } from '../../../src/domain/factionArchetypes.js';
import { isVeiledPower } from '../../../src/domain/people/cardVeil.js';
import { backingArchetypeOf } from '../../../src/domain/dossier/powerSupport.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { createPRNG } from '../../../src/kernel/prng.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const source = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const KINDS = Object.values(A);

// ── (1) THE EMITTERS' NAMES (this file's own fixture) ────────────────────────────────────────────

/** Every governing name `generatePowerStructure` can emit (its `governanceLabelMap` and its
 *  `chooseGoverning`), with the kind the one table reads it as. */
const BIRTH_FORMS = Object.freeze({
  'Elder Consensus': 'government', 'Household Council': 'government', 'Free Elder Council': 'government',
  'Elder Council': 'government', 'Elected Reeve': 'government', 'Grand Council': 'government',
  'City Council': 'government', 'Town Council': 'government', 'Democratic assembly': 'government',
  'City-State Council': 'government', "Headman's Authority": 'government', 'Town Mayor': 'government',
  'Feudal Stewardship': 'noble', 'Feudal Appointee': 'noble', 'Ducal Governorship': 'noble',
  'Noble Governorship': 'noble', 'Royal Authority': 'noble',
  'Grand Guild Council': 'merchant', 'Guild Authority': 'merchant', 'Guild Council': 'merchant',
  'Grand Guild Consortium': 'merchant', 'Merchant Guild Council': 'merchant', 'Grand Merchant Oligarchy': 'merchant',
  'Merchant oligarchy': 'merchant', 'Grand Merchant Senate': 'merchant', 'Merchant City Council': 'merchant',
  'Merchant Council': 'merchant',
  'Grand Military Council': 'military', 'Military City Council': 'military', 'Military Council': 'military',
  'High Theocratic Council': 'religious', 'Ecclesiastical Council': 'religious', 'Church Council': 'religious',
  'Priestly Guidance': 'religious',
  'Shadow Senate': 'criminal', 'Corrupt City Council': 'criminal', 'Corrupt Council': 'criminal',
  'Arcane Senate': 'arcane', 'Arcane Council': 'arcane',
});

/** Every form `transferRulingPower` can crown (its preferred form per kind and band, and its
 *  alternate), with the kind the one table reads it as. A taken alternate falls to "<form> Ascendant". */
const TRANSFER_FORMS = Object.freeze({
  'Militia Command': 'military', 'Military Council': 'military', 'Grand Military Council': 'military', 'Garrison Command': 'military',
  'Church Council': 'religious', 'Theocratic Council': 'religious', 'High Theocratic Council': 'religious', 'Ecclesiastical Council': 'religious',
  'Merchant Council': 'merchant', 'Merchant City Council': 'merchant', 'Grand Merchant Senate': 'merchant', 'Merchant oligarchy': 'merchant',
  'Feudal Stewardship': 'noble', 'Ducal Governorship': 'noble', 'Royal Authority': 'noble', 'Noble Regency': 'noble',
  'Circle of Adepts': 'arcane', 'Arcane Council': 'arcane', 'Grand Arcane Council': 'arcane',
  "Guildmasters' Moot": 'craft', 'Guildhall Council': 'craft', 'Grand Guild Assembly': 'craft',
  'Commons Assembly': 'labor', "Workers' Assembly": 'labor', 'Grand Commons Assembly': 'labor',
  'Elder Council': 'government', 'Town Council': 'government', 'City Council': 'government',
  'Foreign Stewardship': 'outsider', 'Foreign Administration': 'outsider',
  'Occupation Authority': 'occupation', 'Martial Administration': 'occupation',
  'Corrupt Council': 'criminal', 'Corrupt City Council': 'criminal', 'Shadow Senate': 'criminal',
});

/** The birth's governing names, read off its source: every capitalised string literal between the
 *  `governanceLabelMap` and the `drawCouncilOfAKind` call that consumes `chooseGoverning`. */
function birthNamesFromSource() {
  const text = commentsOnly(source('src/generators/power/rulingStructure.js'));
  const start = text.indexOf('governanceLabelMap = {');
  const end = text.indexOf('drawCouncilOfAKind(chooseGoverning');
  expect(start, 'the birth chooser moved: re-read rulingStructure.js').toBeGreaterThan(0);
  expect(end, 'the birth chooser moved: re-read rulingStructure.js').toBeGreaterThan(start);
  const names = new Set();
  for (const m of text.slice(start, end).matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g)) {
    const literal = (m[1] ?? m[2]).replace(/\\'/g, "'");
    if (/^[A-Z]/.test(literal)) names.add(literal);
  }
  return names;
}

/** Every form the transfer can crown, enumerated by EXECUTING its two reads over every kind and tier. */
function transferNamesExecuted() {
  const names = new Set();
  for (const kind of [...KINDS, 'not-a-kind']) {
    for (const tier of [...TIERS, undefined]) names.add(governmentLabelFor(kind, tier));
    if (alternateFormOf(kind)) names.add(alternateFormOf(kind));
  }
  return names;
}

describe('(1) every form the two emitters can emit has a kind in the one table', () => {
  test('the birth source emits exactly the fixture\'s names (a new name reds here)', () => {
    expect([...birthNamesFromSource()].sort()).toEqual(Object.keys(BIRTH_FORMS).sort());
  });

  test('the transfer, executed over every kind and tier, crowns exactly the fixture\'s names', () => {
    expect([...transferNamesExecuted()].sort()).toEqual(Object.keys(TRANSFER_FORMS).sort());
  });

  test('every emitted name reads as its fixture kind, and "<form> Ascendant" reads as its form', () => {
    for (const [form, kind] of Object.entries({ ...BIRTH_FORMS, ...TRANSFER_FORMS })) {
      expect(`${form} -> ${formKindOf(form)}`).toBe(`${form} -> ${kind}`);
      expect(`${form} Ascendant -> ${formKindOf(`${form} Ascendant`)}`).toBe(`${form} Ascendant -> ${kind}`);
    }
  });

  test('a name the table does not hold reads null', () => {
    for (const name of ['Mixed Council', 'Corrupt Oligarchy', 'Shadowed Council', '', null, undefined, 'Ascendant']) {
      expect(formKindOf(name)).toBeNull();
    }
  });

  test('the only forms two rows hold are the guild-governance trio, and they read merchant', () => {
    const holders = new Map();
    for (const [kind, row] of Object.entries(SEAT_TABLE)) {
      const own = new Set([row.alt, ...SEAT_BANDS.flatMap((b) => Object.keys(row.bands[b]))].filter(Boolean));
      for (const form of own) holders.set(form, [...(holders.get(form) || []), kind]);
    }
    const shared = [...holders].filter(([, kinds]) => kinds.length > 1).map(([form, kinds]) => `${form}: ${kinds.join(',')}`);
    expect(shared.sort()).toEqual(['Grand Guild Council: merchant,craft', 'Guild Authority: merchant,craft', 'Guild Council: merchant,craft']);
  });

  test('every weight is a whole number, and the transfer\'s own form leads every band at 2', () => {
    for (const row of Object.values(SEAT_TABLE)) {
      for (const band of SEAT_BANDS) {
        expect(Object.values(row.bands[band])[0]).toBe(2);
        for (const weight of Object.values(row.bands[band])) expect(Number.isInteger(weight) && weight >= 1).toBe(true);
      }
    }
  });
});

// ── (2) TODAY'S STRINGS, LITERALLY ───────────────────────────────────────────────────────────────

/** `rulingPower.js :: GOVERNMENT_PREFERENCES` as it stood before U2 (base fd5323d05), copied as text. */
const TODAY = Object.freeze({
  military:   { small: 'Militia Command',        town: 'Military Council',       large: 'Grand Military Council' },
  religious:  { small: 'Church Council',         town: 'Theocratic Council',     large: 'High Theocratic Council' },
  merchant:   { small: 'Merchant Council',       town: 'Merchant City Council',  large: 'Grand Merchant Senate' },
  noble:      { small: 'Feudal Stewardship',     town: 'Ducal Governorship',     large: 'Royal Authority' },
  arcane:     { small: 'Circle of Adepts',       town: 'Arcane Council',         large: 'Grand Arcane Council' },
  craft:      { small: "Guildmasters' Moot",     town: 'Guildhall Council',      large: 'Grand Guild Assembly' },
  labor:      { small: 'Commons Assembly',       town: "Workers' Assembly",      large: 'Grand Commons Assembly' },
  civic:      { small: 'Elder Council',          town: 'Town Council',           large: 'City Council' },
  government: { small: 'Elder Council',          town: 'Town Council',           large: 'City Council' },
  outsider:   { small: 'Foreign Stewardship',    town: 'Foreign Administration', large: 'Foreign Administration' },
  occupation: { small: 'Occupation Authority',   town: 'Occupation Authority',   large: 'Occupation Authority' },
  criminal:   { small: 'Corrupt Council',        town: 'Corrupt City Council',   large: 'Shadow Senate' },
  other:      { small: 'Elder Council',          town: 'Town Council',           large: 'City Council' },
});
/** `rulingPower.js :: ALT_GOVERNMENT_LABELS` as it stood before U2. */
const TODAY_ALT = Object.freeze({
  merchant: 'Merchant oligarchy', noble: 'Noble Regency', military: 'Garrison Command',
  religious: 'Ecclesiastical Council', occupation: 'Martial Administration',
});
const BAND_OF_TIER = Object.freeze({ thorp: 'small', hamlet: 'small', village: 'small', town: 'town', city: 'large', metropolis: 'large' });
/** The one line `rulingPower.js` may hold the old name on: the re-export of the one table's view. */
const REEXPORT_RE = /export\s*\{\s*TRANSFER_FORMS_VIEW\s+as\s+GOVERNMENT_PREFERENCES\s*\}\s*from\s*'\.\/seat\/seatTable\.js'/;
/** A second DECLARATION of the old name: a binding (`const|let|var|function|class`) or an assignment. */
const DECLARATION_RE = /\b(?:const|let|var|function|class)\s+GOVERNMENT_PREFERENCES\b|\bGOVERNMENT_PREFERENCES\s*=(?!=)/;

/** A seat whose new holder of `kind` finds its preferred form (and optionally its alternate) taken. */
function crownedForm(kind, tier, { altTaken = false, law = null } = {}) {
  const preferred = TODAY[kind][BAND_OF_TIER[tier]];
  const factions = [
    { faction: 'The Old Seat', isGoverning: true, power: 30, category: 'government' },
    { faction: 'The Contender', category: kind, power: 20 },
    { faction: preferred, power: 5 },
    ...(altTaken && TODAY_ALT[kind] ? [{ faction: TODAY_ALT[kind], power: 4 }] : []),
  ];
  const settlement = { tier, ...(law ? { config: { _seatLawVersion: law } } : {}), powerStructure: { factions } };
  return transferRulingPower(settlement, 'The Contender', { cause: 'coup' });
}

describe('(2) under every law, the transfer reads today\'s strings', () => {
  test('governmentLabelFor(every kind, every tier) is today\'s literal', () => {
    for (const kind of Object.keys(TODAY)) {
      for (const tier of TIERS) expect(`${kind}@${tier}: ${governmentLabelFor(kind, tier)}`).toBe(`${kind}@${tier}: ${TODAY[kind][BAND_OF_TIER[tier]]}`);
      expect(`${kind}@none: ${governmentLabelFor(kind, undefined)}`).toBe(`${kind}@none: ${TODAY[kind].town}`);
      expect(`${kind}@CITY: ${governmentLabelFor(kind, 'CITY')}`).toBe(`${kind}@CITY: ${TODAY[kind].large}`);
    }
  });

  test('an unknown kind reads the `other` row, as it did', () => {
    for (const tier of TIERS) expect(governmentLabelFor('not-a-kind', tier)).toBe(TODAY.other[BAND_OF_TIER[tier]]);
  });

  test('the band reader is today\'s tierBand', () => {
    for (const tier of TIERS) expect(seatBandOf(tier)).toBe(BAND_OF_TIER[tier]);
    for (const other of [undefined, null, '', 'megalopolis']) expect(seatBandOf(other)).toBe('town');
  });

  test('a taken form falls to today\'s alternate, then to Ascendant, for every kind and tier', () => {
    for (const kind of Object.keys(TODAY).filter((k) => k !== 'other')) {
      for (const tier of TIERS) {
        const at = `${kind}@${tier}`;
        const preferred = TODAY[kind][BAND_OF_TIER[tier]];
        const alt = TODAY_ALT[kind];
        const once = crownedForm(kind, tier);
        expect(once.error, at).toBeNull();
        expect(`${at}: ${once.transfer.toGovernment}`).toBe(`${at}: ${alt || `${preferred} Ascendant`}`);
        expect(`${at}: ${crownedForm(kind, tier, { altTaken: true }).transfer.toGovernment}`).toBe(`${at}: ${preferred} Ascendant`);
        // the seat law does not move the transfer (U5's, later): byte-identical under law 2
        expect(JSON.stringify(crownedForm(kind, tier, { law: 2 }).transfer), at).toBe(JSON.stringify(once.transfer));
        expect(JSON.stringify(crownedForm(kind, tier, { law: 2 }).settlement.powerStructure), at)
          .toBe(JSON.stringify(once.settlement.powerStructure));
      }
    }
  });

  test('the old table lives in the one home: rulingPower.js spells none of its forms', () => {
    const code = commentsOnly(source('src/domain/rulingPower.js'));
    const spelled = Object.keys(TRANSFER_FORMS).filter((form) => code.includes(`'${form}'`) || code.includes(`"${form}"`));
    expect(spelled).toEqual([]);
    // the one-table read is the live anchor: the code holds it, and holds neither old table
    expectAbsentWithAnchor(code, 'ALT_GOVERNMENT_LABELS', 'alternateFormOf(', 'rulingPower.js reads the alternate from the one table');
    // U2-CURE2: the old name is EXPORTED again, as the one table's view re-exported, so this half
    // forbids a second DECLARATION of the forms (a binding, an assignment) and no longer the name.
    expect(code, 'rulingPower.js re-exports the one table\'s view').toMatch(REEXPORT_RE);
    expect(code).not.toMatch(DECLARATION_RE); // anchored: REEXPORT_RE above proves this same source holds the name's one live line, the re-export
  });
});

// ── (3) THE COMPETITION LAYER'S FAMILY ───────────────────────────────────────────────────────────

/** Today's id per canonical kind (`CANONICAL_TO_COMPETITION` -> `GOVERNMENT_BY_ARCHETYPE`), as text. */
const TODAY_FAMILY = Object.freeze({
  government: 'council_rule', noble: 'noble_patronage', military: 'military_order', merchant: 'merchant_charter',
  religious: 'temple_authority', criminal: 'criminal_shadow_rule', arcane: 'arcane_magocracy', craft: 'merchant_charter',
  labor: 'communal_assembly', outsider: 'noble_patronage', occupation: 'military_order', civic: 'council_rule', other: 'council_rule',
});
const SEAT_FAMILY = Object.freeze({
  ...TODAY_FAMILY, craft: 'guild_charter', outsider: 'foreign_administration', occupation: 'occupation_rule',
});

/** The faction states a fresh world mints for one settlement holding `factions`, under `config`. */
function mintedStates(factions, config) {
  const snapshot = { settlements: [{ id: 's1', settlement: { tier: 'town', ...(config ? { config } : {}), powerStructure: { factions } } }] };
  return ensureFactionStates({ factionStates: {} }, snapshot, createPRNG('seat-table-u2').fork('init')).factionStates;
}
const prefOf = (states, name) => Object.values(states).find((s) => s.name === name).governmentPreference;

describe('(3) the competition family: the table\'s under the seat law, today\'s id under the old', () => {
  const rows = KINDS.map((kind) => ({ faction: `Power of ${kind}`, category: kind, power: 10 }));

  test('every kind: the table\'s family for the power\'s contest kind', () => {
    for (const kind of KINDS) {
      const power = rows.find((r) => r.faction === `Power of ${kind}`);
      expect(`${kind}: ${governmentFamilyOf(contestKindOf(power))}`).toBe(`${kind}: ${SEAT_FAMILY[kind]}`);
    }
  });

  test('the three kinds the old tables disagreed on take the table\'s own families', () => {
    expect(['craft', 'outsider', 'occupation'].map((k) => [TODAY_FAMILY[k], governmentFamilyOf(k)])).toEqual([
      ['merchant_charter', 'guild_charter'],
      ['noble_patronage', 'foreign_administration'],
      ['military_order', 'occupation_rule'],
    ]);
    expect(governmentFamilyOf(contestKindOf({ faction: 'Craft Guilds', category: 'economy' })), 'the born Craft Guilds').toBe('guild_charter');
  });

  test('every kind: a NEW faction state takes today\'s id under the old law and with no law', () => {
    const none = mintedStates(rows, null);
    const law1 = mintedStates(rows, { _seatLawVersion: 1 });
    for (const kind of KINDS) {
      const name = `Power of ${kind}`;
      expect(`${kind}: ${prefOf(none, name)}`).toBe(`${kind}: ${TODAY_FAMILY[kind]}`);
      expect(`${kind}: ${prefOf(law1, name)}`).toBe(`${kind}: ${TODAY_FAMILY[kind]}`);
    }
  });

  test('a preference the roster row already carries wins', () => {
    const held = [{ faction: 'Craft Guilds', category: 'economy', power: 12, governmentPreference: 'council_rule' }];
    expect(prefOf(mintedStates(held, null), 'Craft Guilds')).toBe('council_rule');
  });

  test('the old law is byte-identical to no law on every minted state', () => {
    expect(JSON.stringify(mintedStates(rows, { _seatLawVersion: 1 }))).toBe(JSON.stringify(mintedStates(rows, null)));
  });
});

// ── (4) THE KIND READER ──────────────────────────────────────────────────────────────────────────

/** A small born pool: every tier, plain and with the hidden infiltrator and a criminal priority.
 *  BORN keeps each world whole (the cure's arm (d) reads them so); POOL is their rows. */
const BORN = (() => {
  const worlds = [];
  for (const tier of TIERS) {
    for (const [i, extra] of [{}, { stressTypes: ['infiltrated'], priorityCriminal: 85 }, { priorityEconomy: 80 }].entries()) {
      const s = generateSettlementPipeline({ settType: tier, culture: 'germanic', ...extra }, null, { seed: `u2-seat-table-${tier}-${i}`, customContent: {} });
      worlds.push({ tier, i, factions: s?.powerStructure?.factions || [] });
    }
  }
  return worlds;
})();
const POOL = BORN.flatMap((w) => w.factions);
const EDGE_ROWS = [
  null, undefined, 'Merchant Guilds', 42, [], [{ hidden: true }], {},
  { faction: 'A', hidden: 'true' }, { faction: 'B', hidden: 1 }, { faction: 'C', hidden: true },
  { faction: 'D', category: 'Criminal' }, { faction: 'E', category: ' criminal' }, { faction: 'F', category: 7 },
  { faction: 'G', category: 'criminal', hidden: false },
];

describe('(4) the kind reader', () => {
  test('the pool holds what the arms need', () => {
    expect(POOL.length).toBeGreaterThan(60);
    expect(POOL.some((r) => r.hidden === true)).toBe(true);
    expect(POOL.some((r) => r.category === 'criminal')).toBe(true);
    expect(POOL.some((r) => /craft/i.test(r.faction || ''))).toBe(true);
  });

  test('Craft Guilds (category economy) -> craft', () => {
    expect(contestKindOf({ faction: 'Craft Guilds', category: 'economy' })).toBe('craft');
  });

  test('an artisan-named criminal row -> criminal, never craft', () => {
    expect(contestKindOf({ faction: "Artisans' Syndicate", category: 'criminal' })).toBe('criminal');
    expect(contestKindOf({ faction: "Artisans' Syndicate" })).toBe('criminal');
    expect(contestKindOf({ faction: 'Craft Guild Smugglers' })).toBe('criminal');
    expect(backingArchetypeOf({ faction: "Artisans' Syndicate" }), 'the trap the reader closes').toBe('craft');
  });

  test('a hidden row -> its veil (criminal), whatever its name and category say', () => {
    expect(contestKindOf({ faction: 'Merchant Guilds', category: 'economy', hidden: true })).toBe('criminal');
    expect(contestKindOf({ faction: 'Craft Guilds', category: 'economy', hidden: true })).toBe('criminal');
  });

  test('Town Council -> government, and civic folds into government', () => {
    expect(contestKindOf({ faction: 'Town Council', category: 'government' })).toBe('government');
    expect(contestKindOf({ faction: 'Town Council' })).toBe('government');
    expect(contestKindOf({ faction: 'The Burghers', category: 'civic' })).toBe('government');
  });

  test('the veil read equals cardVeil.js :: isVeiledPower on every row of the pool and the edge rows', () => {
    const differ = [...POOL, ...EDGE_ROWS].filter((r) => isVeiledRow(r) !== isVeiledPower(r));
    expect(differ).toEqual([]);
  });

  test('on every open, non-criminal row of the pool the kind is backingArchetypeOf\'s', () => {
    const open = POOL.filter((r) => !isVeiledPower(r) && factionArchetype(r) !== 'criminal');
    expect(open.length).toBeGreaterThan(50);
    expect(open.filter((r) => contestKindOf(r) !== backingArchetypeOf(r)).map((r) => r.faction)).toEqual([]);
  });

  test('every veiled or criminal row of the pool reads criminal', () => {
    const shut = POOL.filter((r) => isVeiledPower(r) || factionArchetype(r) === 'criminal');
    expect(shut.length).toBeGreaterThan(0);
    expect(shut.filter((r) => contestKindOf(r) !== 'criminal').map((r) => r.faction)).toEqual([]);
  });

  test('total over any input', () => {
    for (const r of EDGE_ROWS) expect(KINDS).toContain(contestKindOf(r));
  });
});

// ── (5) THE PAIR CHECK ───────────────────────────────────────────────────────────────────────────

describe('(5) the pair check', () => {
  const PAIRS = [
    ['merchant', 'City Council', 'civic', null],
    ['merchant', 'Royal Authority', 'licensed', 'trade_wealth'],
    ['military', 'Elder Council', 'fallback', null],
    ['criminal', 'Town Council', 'none', null],
    ['noble', 'Ducal Governorship', 'own', null],
    ['merchant', 'Ducal Governorship', 'licensed', 'trade_wealth'],
    ['craft', 'Guild Council', 'own', null],
    ['merchant', 'Guild Council', 'own', null],
    ['noble', 'Town Mayor', 'civic', null],
    ['craft', "Headman's Authority", 'civic', null],
    ['religious', 'Town Mayor', 'fallback', null],
    ['government', 'Town Mayor', 'own', null],
    ['civic', 'Elder Council', 'own', null],
    ['criminal', 'Shadow Senate', 'own', null],
    ['military', 'Royal Authority', 'none', null],
    ['merchant', 'Feudal Stewardship', 'none', null],
    ['noble', 'Royal Authority Ascendant', 'own', null],
    ['noble', 'Noble Regency', 'own', null],
    ['noble', 'Mixed Council', 'none', null],
  ];

  test('the brief\'s five pairs and their neighbours', () => {
    for (const [kind, form, pair, circumstance] of PAIRS) {
      expect({ kind, form, ...pairLicense(kind, form) }).toEqual({ kind, form, pair, circumstance });
    }
  });

  test('the circumstances are CS5\'s closed list, frozen, and every license cites one', () => {
    expect(SEAT_CIRCUMSTANCES).toEqual(['craft_led', 'trade_wealth', 'strong_faith', 'martial_pressure',
      'hunger', 'mandate', 'outside_debt', 'occupation']);
    expect(Object.isFrozen(SEAT_CIRCUMSTANCES)).toBe(true);
    for (const row of Object.values(SEAT_TABLE)) {
      for (const circumstance of Object.values(row.licenses)) expect(SEAT_CIRCUMSTANCES).toContain(circumstance);
    }
  });

  test('the civic holder kinds are representatives.js :: CIVIC_HOUSE_KINDS', () => {
    const m = source('src/generators/people/representatives.js').match(/const CIVIC_HOUSE_KINDS = Object\.freeze\(\[([^\]]*)\]\)/);
    expect(m).not.toBeNull();
    const kinds = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]).sort();
    expect(kinds).toEqual(['craft', 'merchant', 'noble']);
    for (const kind of KINDS) {
      const pair = pairLicense(kind, 'Elder Council').pair;
      const expected = kinds.includes(kind) ? 'civic' : ['government', 'civic', 'other'].includes(kind) ? 'own' : kind === 'criminal' ? 'none' : 'fallback';
      expect(`${kind}:${pair}`).toBe(`${kind}:${expected}`);
    }
  });

  test('the table is frozen to its leaves, and `civic`, `other` and an unknown kind read the government row', () => {
    expect(Object.isFrozen(SEAT_TABLE)).toBe(true);
    for (const row of Object.values(SEAT_TABLE)) {
      expect(Object.isFrozen(row) && Object.isFrozen(row.bands) && Object.isFrozen(row.licenses)).toBe(true);
      for (const band of SEAT_BANDS) expect(Object.isFrozen(row.bands[band])).toBe(true);
    }
    for (const kind of ['civic', 'other', 'not-a-kind', 'toString']) expect(seatRowOf(kind)).toBe(SEAT_TABLE.government);
    expect(preferredFormOf('noble', 'city')).toBe('Royal Authority');
  });
});

// ── THE CURE (briefs/U2-CURE.md) ─────────────────────────────────────────────────────────────────

/** `factionCompetition.js :: GOVERNMENT_BY_ARCHETYPE` as it stood at U2 (0ab034531), copied as text:
 *  keyed by the competition layer's own archetypes (`CANONICAL_TO_COMPETITION`'s values). */
const OLD_LAW_IDS = Object.freeze({
  noble: 'noble_patronage',
  merchant: 'merchant_charter',
  military: 'military_order',
  religious: 'temple_authority',
  criminal: 'criminal_shadow_rule',
  civic: 'council_rule',
  arcane: 'arcane_magocracy',
  labor: 'communal_assembly',
  outsider: 'noble_patronage',
});
const SEAT = Object.freeze({ _seatLawVersion: 2 });
const prefsByName = (states) => Object.fromEntries(Object.values(states).map((s) => [s.name, s.governmentPreference]));
const withoutPref = (states) => JSON.stringify(Object.values(states).map(({ governmentPreference: _p, ...rest }) => rest));

describe('(a) the old law\'s competition id lives in the one table', () => {
  test('every archetype: the old law\'s id read through the one table is the id GOVERNMENT_BY_ARCHETYPE held', () => {
    for (const [archetype, id] of Object.entries(OLD_LAW_IDS)) {
      expect(`${archetype}: ${oldLawFamilyOf?.(archetype)}`).toBe(`${archetype}: ${id}`);
    }
  });

  test('every canonical kind reads the old id of the archetype the competition layer folds it to', () => {
    for (const kind of KINDS) expect(`${kind}: ${oldLawFamilyOf?.(kind)}`).toBe(`${kind}: ${TODAY_FAMILY[kind]}`);
  });

  test('factionCompetition.js keeps no table of its own', () => {
    const code = commentsOnly(source('src/domain/worldPulse/factionCompetition.js'));
    expectAbsentWithAnchor(code, 'GOVERNMENT_BY_ARCHETYPE', 'oldLawFamilyOf(', 'factionCompetition.js reads the old id from the one table');
  });
});

describe('(b) a NEW faction state\'s preference: today\'s id under the old law, the table\'s family under the seat law', () => {
  const rows = KINDS.map((kind) => ({ faction: `Power of ${kind}`, category: kind, power: 10 }));

  test('every kind under the seat law: the table\'s family', () => {
    const law2 = mintedStates(rows, SEAT);
    for (const kind of KINDS) expect(`${kind}: ${prefOf(law2, `Power of ${kind}`)}`).toBe(`${kind}: ${SEAT_FAMILY[kind]}`);
  });

  test('craft, outsider, occupation and the born Craft Guilds, under each law', () => {
    const four = [
      { faction: 'Power of craft', category: 'craft', power: 12 },
      { faction: 'Power of outsider', category: 'outsider', power: 11 },
      { faction: 'Power of occupation', category: 'occupation', power: 10 },
      { faction: 'Craft Guilds', category: 'economy', power: 9 },
    ];
    expect(prefsByName(mintedStates(four, SEAT))).toEqual({
      'Power of craft': 'guild_charter', 'Power of outsider': 'foreign_administration',
      'Power of occupation': 'occupation_rule', 'Craft Guilds': 'guild_charter',
    });
    for (const config of [null, { _seatLawVersion: 1 }]) {
      expect(prefsByName(mintedStates(four, config))).toEqual({
        'Power of craft': 'merchant_charter', 'Power of outsider': 'noble_patronage',
        'Power of occupation': 'military_order', 'Craft Guilds': 'merchant_charter',
      });
    }
  });

  test('a stored preference wins under both laws', () => {
    const held = [{ faction: 'Craft Guilds', category: 'economy', power: 12, governmentPreference: 'council_rule' }];
    for (const config of [null, { _seatLawVersion: 1 }, SEAT]) expect(prefOf(mintedStates(held, config), 'Craft Guilds')).toBe('council_rule');
  });

  test('the seat law moves the preference and nothing else on a minted state', () => {
    expect(withoutPref(mintedStates(rows, SEAT))).toBe(withoutPref(mintedStates(rows, null)));
  });
});

describe('(c) the stated preference reads the power\'s OWN kind, never its veil', () => {
  test('ownKindOf: a hidden non-criminal power keeps its own kind; a criminal power reads criminal', () => {
    expect(ownKindOf?.({ faction: 'Merchant Guilds', category: 'economy', hidden: true })).toBe('merchant');
    expect(ownKindOf?.({ faction: 'Craft Guilds', category: 'economy', hidden: true })).toBe('craft');
    expect(ownKindOf?.({ faction: 'The Independent Bloc', category: 'other', hidden: true })).toBe('other');
    expect(ownKindOf?.({ faction: 'The Burghers', category: 'civic', hidden: true })).toBe('government');
    expect(ownKindOf?.({ faction: "Thieves' Guild", category: 'criminal' })).toBe('criminal');
    expect(ownKindOf?.({ faction: 'Merchant Guilds', category: 'criminal', hidden: true })).toBe('criminal');
    expect(ownKindOf?.({ faction: "Artisans' Syndicate" })).toBe('criminal');
  });

  test('contestKindOf is the veil step over ownKindOf, on every row of the pool and every edge row', () => {
    const differ = [...POOL, ...EDGE_ROWS].filter((r) => contestKindOf(r) !== (isVeiledRow(r) ? 'criminal' : ownKindOf?.(r)));
    expect(differ).toEqual([]);
  });

  test('a minted state under the seat law: hidden non-criminal -> its own family; criminal and hidden-criminal -> criminal', () => {
    const law2 = mintedStates([
      { faction: 'Merchant Guilds', category: 'economy', hidden: true, power: 12 },
      { faction: 'Temple of the Dawn', category: 'religious', hidden: true, power: 11 },
      { faction: "Thieves' Guild", category: 'criminal', power: 10 },
      { faction: 'Velvet Hand', category: 'criminal', hidden: true, power: 9 },
    ], SEAT);
    expect(prefsByName(law2)).toEqual({
      'Merchant Guilds': 'merchant_charter', 'Temple of the Dawn': 'temple_authority',
      "Thieves' Guild": 'criminal_shadow_rule', 'Velvet Hand': 'criminal_shadow_rule',
    });
  });
});

describe('(d) born worlds at every tier, a town-size case among them', () => {
  test('the born infiltrated TOWN: today\'s ids under the old law; under the seat law the Craft Guilds move and the hidden bloc keeps its own', () => {
    const town = BORN.find((w) => w.tier === 'town' && w.i === 1).factions;
    expect(town.some((r) => r.hidden === true && r.category !== 'criminal'), 'the town holds a hidden non-criminal power').toBe(true);
    const today = {
      'Merchant oligarchy': 'merchant_charter', 'Merchant Guilds': 'merchant_charter', "Thieves' Guild": 'criminal_shadow_rule',
      'Military/Guard': 'military_order', 'Religious Authorities': 'temple_authority', 'Craft Guilds': 'merchant_charter',
      'The Independent Bloc': 'council_rule', 'Landed Gentry': 'noble_patronage',
    };
    expect(prefsByName(mintedStates(town, null))).toEqual(today);
    expect(prefsByName(mintedStates(town, { _seatLawVersion: 1 }))).toEqual(today);
    expect(prefsByName(mintedStates(town, SEAT))).toEqual({ ...today, 'Craft Guilds': 'guild_charter' });
  });

  test('every born world: the old law is no law, byte for byte; the seat law gives each power its own kind\'s family, and no non-criminal power the criminal one', () => {
    for (const { tier, i, factions } of BORN) {
      const at = `${tier}-${i}`;
      expect(JSON.stringify(mintedStates(factions, { _seatLawVersion: 1 })), at).toBe(JSON.stringify(mintedStates(factions, null)));
      const law2 = mintedStates(factions, SEAT);
      expect(withoutPref(law2), at).toBe(withoutPref(mintedStates(factions, null)));
      for (const r of factions) {
        const own = ownKindOf?.(r);
        expect(`${at} ${r.faction}: ${prefOf(law2, r.faction)}`).toBe(`${at} ${r.faction}: ${governmentFamilyOf(own)}`);
        if (own !== 'criminal') expect(prefOf(law2, r.faction), `${at} ${r.faction}`).not.toBe('criminal_shadow_rule');
      }
    }
  });
});

describe('(e) U2-CURE2: rulingPower.js :: GOVERNMENT_PREFERENCES is the one table\'s view, today\'s object byte for byte', () => {
  test('it deep-equals today\'s literal object, key for key and in today\'s key order', () => {
    expect(GOVERNMENT_PREFERENCES).toEqual(TODAY);
    expect(JSON.stringify(GOVERNMENT_PREFERENCES)).toBe(JSON.stringify(TODAY));
  });

  test('it is the one table\'s own view, re-exported (one object, not a second spelling)', () => {
    expect(TRANSFER_FORMS_VIEW).toBeDefined();
    expect(GOVERNMENT_PREFERENCES).toBe(TRANSFER_FORMS_VIEW);
    for (const [kind, bands] of Object.entries(GOVERNMENT_PREFERENCES)) {
      for (const tier of TIERS) expect(`${kind}@${tier}: ${bands[BAND_OF_TIER[tier]]}`).toBe(`${kind}@${tier}: ${preferredFormOf(kind, tier)}`);
    }
  });

  test('it is frozen to its leaves', () => {
    expect(Object.isFrozen(GOVERNMENT_PREFERENCES)).toBe(true);
    for (const [kind, bands] of Object.entries(GOVERNMENT_PREFERENCES)) expect(`${kind}: ${Object.isFrozen(bands)}`).toBe(`${kind}: true`);
  });

  test('the narrowed pin still reds on a second declaration of the forms', () => {
    const planted = `export const GOVERNMENT_PREFERENCES = Object.freeze({ [A.MILITARY]: { small: 'Militia Command' } });`;
    expect(planted).toMatch(DECLARATION_RE);
    expect('GOVERNMENT_PREFERENCES = {};').toMatch(DECLARATION_RE);
    expect(`export { TRANSFER_FORMS_VIEW as GOVERNMENT_PREFERENCES } from './seat/seatTable.js';`).toMatch(REEXPORT_RE);
    expect(`export { TRANSFER_FORMS_VIEW as GOVERNMENT_PREFERENCES } from './seat/seatTable.js';`).not.toMatch(DECLARATION_RE); // anchored: the same literal matches REEXPORT_RE on the line above
    expect(`if (x === GOVERNMENT_PREFERENCES) {}`).not.toMatch(DECLARATION_RE); // anchored: a literal built here; the two plants above prove DECLARATION_RE fires
  });
});
