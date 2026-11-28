// THE GUARD OF SECRETS-1 (BRIEF-SECRETS-1, 2026-11-17; the owner's eleven messages, the chair's ruling RS1 and its
// widenings): THE VERY RARE SECRETS ARE DEALT BY THE SEED, WHERE THEY MAY STAND, AND NOWHERE ELSE.
//   - at most one of a family in a place, and never two on one person;
//   - each row only where its table lets it stand (the size, the route, the government, the magic, the superior, the
//     fire, the trade; a hidden master only in a thorp, a hamlet or a village, and only on its own trade), never beside
//     the card's own word that denies it, never on a child;
//   - every person a row names is a real other person of the roster, and the superior a real superior;
//   - a kept person keeps theirs; the same seed gives the same deal; with the deal off the roster is identical but for
//     the dealt cards' secrets (no draw taken); a renamed target is followed; a world without magic holds no magic row;
//   - every row of the data file is reachable by some planted roster (no dead row).
// Table-driven on planted rosters, and a small born sample (a handful of births). Seed loops collect every failure
// (tests/helpers/seedFailures.js); every negative stands beside its anchor (tests/helpers/anchoredNegatives.js).
import { describe, expect, it, vi } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { HOLDER_KEYS, RARE_SECRET_AGE_YEARS, RARE_SECRET_FAMILIES, RARE_SECRET_ODDS, RARE_SECRET_ROWS } from '../../src/data/rareSecrets.js';
import { dealRareSecrets, rareRowOf, rareRowsStandingFor, rareSecretReceiptOf, rareSecretRows, superiorOf } from '../../src/generators/people/rareSecrets.js';
import { NPC_PRESENTATION_MODES } from '../../src/data/npcData.js';
import { STRESS_INSTITUTION_EFFECTS } from '../../src/data/stressInstitutionEffects.js';
import { createGenerationWorldLaw } from '../../src/generators/generationContext.js';
import { refreshRosterProse } from '../../src/generators/generateSettlementPipeline.js';
import { NPC_AGE_DATA, NPC_PERSONALITY_TRAITS } from '../../src/data/npcData.js';

// ── THE PLANTED PLACE AND ROSTER ──────────────────────────────────────────────────────────────────────────────────
const COUNCIL = 'The Hall';
const GUILD = 'The Guild';
/** @param {{ tier?: string, route?: string, terrain?: string, government?: string, magic?: boolean }} [o] */
function plantPlace(o = {}) {
  return {
    tier: o.tier || 'city',
    config: { tradeRouteAccess: o.route || 'road', terrainType: o.terrain || 'coastal', magicExists: o.magic !== false, priorityMagic: o.magic === false ? 0 : 50, contentProfile: 'grounded' },
    powerStructure: { government: o.government || 'Feudal Stewardship', factions: [{ faction: COUNCIL, isGoverning: true }, { faction: GUILD }] },
    institutions: PLANTED_HOUSES.map((name) => ({ name })),
    economicState: { foodSecurity: { foodRecord: { foodSources: ['grain', 'livestock'] } } },
  };
}
/** The houses a planted place holds (each a declared atom a row may need: a tavern, a watch, a healer, a church and a shrine, a mill). */
const PLANTED_HOUSES = ['Tavern', 'Village watch', 'Healer', 'Parish church', 'Village shrine', 'Mill'];
/** @param {Record<string, any>} place @param {...string} names */
const withoutHouse = (place, ...names) => ({ ...place, institutions: place.institutions.filter((/** @type {any} */ i) => !names.includes(i.name)) });
const NEUTRAL = { dominant: 'diligent', flaw: 'envious', modifier: 'pragmatic', disposition: 'transactional' };
/** @param {string} id @param {Record<string, any>} [o] */
function plantCard(id, o = {}) {
  return {
    id, name: o.name || `Person ${id}`, role: o.role || 'the cooper', category: o.category || 'economy',
    personality: { dominant: o.dominant ?? NEUTRAL.dominant, flaw: o.flaw ?? NEUTRAL.flaw, modifier: o.modifier ?? NEUTRAL.modifier, tell: 'taps the table', speech: 'speaks slowly' },
    physical: { age: o.age || 'mid-forties' },
    presentation: { impression: 'A planted impression.', disposition: o.disposition ?? NEUTRAL.disposition, behaviour: 'A planted behaviour.' },
    secret: o.secret === undefined ? { what: `Keeps a second ledger at the house of ${id}`, stakes: 'Nobody has asked for it yet' } : o.secret,
    institution: o.institution || { kind: 'house', key: 'Cooper', family: 'Cooper', title: 'the cooper' },
    memberships: o.memberships || [{ power: GUILD, rank: null, share: 1, veiled: false }],
  };
}
/** A small roster around a candidate `c`: the hall's head, the guild's head, a younger person, an elder. @param {Record<string, any>} [c] */
function plantRoster(c = {}) {
  return [
    plantCard('head', { name: 'Aldo Head', role: 'Elder', memberships: [{ power: COUNCIL, rank: 1, share: 1, veiled: false }], age: 'late sixties' }),
    plantCard('guildhead', { name: 'Bera Guild', role: 'the senior guild master', memberships: [{ power: GUILD, rank: 1, share: 1, veiled: false }], age: 'early fifties' }),
    plantCard('young', { name: 'Ciro Young', role: 'the tailor', age: 'early twenties' }),
    plantCard('other', { name: 'Dana Other', role: 'the potter', age: 'late thirties' }),
    plantCard('cand', { name: 'Eda Cand', ...c }),
  ];
}
const RELS = [{ from: 'head', to: 'guildhead', type: 'ally' }];
/** The keys standing for the candidate, by family. @param {any} place @param {any[]} cards @param {any[]} [rels] */
const standingKeys = (place, cards, rels = RELS) => {
  const by = rareRowsStandingFor(place, cards, rels, 'cand', { seed: 'plant' });
  return RARE_SECRET_FAMILIES.flatMap((f) => by[f].map((r) => r.key));
};

/** The candidate a row is planted for: its trade, its office, its age; the place its table admits. @param {string} family @param {any} row */
function plantFor(family, row) {
  const h = row.holder || {};
  /** @type {Record<string, any>} */
  const c = {};
  if (h.roles) c.role = `the ${h.roles[0]}`;
  if (h.category) { c.category = h.category[0]; c.role = c.role || 'the fence'; }
  if (h.office && h.office.includes('head')) { c.memberships = [{ power: COUNCIL, rank: 1, share: 1, veiled: false }]; }
  if (h.age === 'old') c.age = 'seventies';
  if (h.keepsHouse) c.institution = { kind: 'house', key: 'Cooper', family: 'Cooper', title: 'the cooper' };
  if (row.names === 'superior') c.memberships = [{ power: GUILD, rank: 2, share: 1, veiled: false }];
  const small = family === 'masters' || (row.needs || []).some((/** @type {string} */ a) => /^tier: ≤/.test(a));
  const roster = plantRoster(c);
  if (h.office && h.office.includes('head')) roster[0] = plantCard('head0', { name: 'Aldo Head', role: 'the cooper', age: 'late sixties' });
  const town = (row.needs || []).includes('tier: town');
  return { place: plantPlace({ tier: town ? 'town' : small ? 'village' : 'city', government: 'Feudal Stewardship' }), cards: roster };
}

// ── THE TABLES ─────────────────────────────────────────────────────────────────────────────────────────────────────
describe('SECRETS-1: the rows and the odds are data, in one table each', () => {
  it('five families, every row the card\'s shape, its holder keys closed, its names one of three', () => {
    expect(RARE_SECRET_FAMILIES).toEqual(['deeds', 'natures', 'ties', 'masters', 'outsiders']);
    expect(Object.keys(RARE_SECRET_ODDS).sort()).toEqual([...RARE_SECRET_FAMILIES].sort());
    const failures = collectSeedFailures(rareSecretRows(), ({ family, row }) => {
      expect(typeof row.key).toBe('string');
      expect(row.what).toMatch(/^[A-Z]/);
      expect(row.what).toMatch(/[^.]$/);
      expect(row.stakes).toMatch(/[^.]$/);
      for (const k of Object.keys(row.holder || {})) expect(HOLDER_KEYS).toContain(k);
      if (row.names) expect(['superior', 'other', 'younger']).toContain(row.names);
      expect(/\{superior\}/.test(row.what + row.stakes)).toBe(row.names === 'superior');
      expect(/\{target\}/.test(row.what + row.stakes)).toBe(row.names === 'other' || row.names === 'younger');
      expect(RARE_SECRET_ROWS[family]).toContain(row);
    });
    expectNoSeedFailures(failures, 'every row is in the card\'s shape');
    const keys = rareSecretRows().map((r) => r.row.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
  it('the odds are the chair\'s form: one person in two hundred for each of the first three; a small place in forty; a place in sixty', () => {
    expect(RARE_SECRET_ODDS.deeds.perPerson).toBe(1 / 200);
    expect(RARE_SECRET_ODDS.natures.perPerson).toBe(1 / 200);
    expect(RARE_SECRET_ODDS.ties.perPerson).toBe(1 / 200);
    expect(RARE_SECRET_ODDS.masters).toEqual({ perPlace: 1 / 40, tiers: ['thorp', 'hamlet', 'village'] });
    expect(RARE_SECRET_ODDS.outsiders).toEqual({ perPlace: 1 / 60 });
  });
});

// ── THE WORLD'S LAW ────────────────────────────────────────────────────────────────────────────────────────────────
describe('SECRETS-1: every row passes the generation law\'s filter for secrets, and a magic row only where magic works', () => {
  const LAWS = ['heroic', 'grounded', 'grim'].flatMap((contentProfile) => [true, false].map((magic) => ({ contentProfile, magic })));
  it('for each world law the filter knows', () => {
    const failures = collectSeedFailures(LAWS, ({ contentProfile, magic }) => {
      const law = createGenerationWorldLaw({ magicExists: magic, priorityMagic: magic ? 50 : 0, contentProfile });
      for (const { row } of rareSecretRows()) {
        if (row.magic && !magic) continue;
        expect(law.allowsSecret({ what: row.what, stakes: row.stakes }), `${contentProfile}/${magic}: ${row.key}`).toBe(true);
      }
    });
    expectNoSeedFailures(failures, 'every row passes allowsSecret where it may stand');
  });
  it('a world without magic holds no magic row (planted, every row; and over a hundred seeds of a large roster)', () => {
    const failures = collectSeedFailures(rareSecretRows().filter((r) => r.row.magic), ({ family, row }) => {
      const { place, cards } = plantFor(family, row);
      const on = standingKeys(place, cards);
      const off = standingKeys({ ...place, config: { ...place.config, magicExists: false, priorityMagic: 0 } }, cards);
      expectPresentThenAbsent(on, off, row.key, `magic off refuses ${row.key}`);
    });
    expectNoSeedFailures(failures, 'a magic row stands only where magic works');
    const place = plantPlace({ magic: false });
    const big = bigRoster();
    const seeds = Array.from({ length: 100 }, (_, i) => `nomagic-${i}`);
    const dealtKeys = [];
    const loop = collectSeedFailures(seeds, (seed) => {
      const out = dealRareSecrets(place, big, RELS, { seed });
      for (const d of rareSecretReceiptOf(out)?.dealt || []) {
        dealtKeys.push(d.key);
        expect(rareSecretRows().find((r) => r.row.key === d.key)?.row.magic, `${seed}: ${d.key}`).toBeFalsy();
      }
    });
    expectNoSeedFailures(loop, 'no magic row in a world without magic');
    expect(dealtKeys.length).toBeGreaterThan(0);
  });
});

// ── EVERY ROW REACHABLE, AND EACH ONLY WHERE ITS TABLE LETS IT STAND ───────────────────────────────────────────────
describe('SECRETS-1: every row stands for some planted roster, and only where its table lets it', () => {
  it('no dead row: every row of the data file is reachable', () => {
    const failures = collectSeedFailures(rareSecretRows(), ({ family, row }) => {
      const { place, cards } = plantFor(family, row);
      expect(standingKeys(place, cards), `${family}/${row.key}`).toContain(row.key);
    });
    expectNoSeedFailures(failures, 'every row is reachable');
  });
  it('the size, the route, the government and the coast: a row refused where the place denies what it presumes', () => {
    const failures = collectSeedFailures(rareSecretRows().filter((r) => (r.row.needs || []).length || (r.row.excludes || []).length || r.family === 'masters'), ({ family, row }) => {
      const { place, cards } = plantFor(family, row);
      const before = standingKeys(place, cards);
      for (const a of [...(row.needs || []), ...(row.excludes || [])]) {
        /** @type {Record<string, any>} */ let denied;
        if (a === 'tier: ≥ town') denied = { ...place, tier: 'village' };
        else if (a === 'tier: ≥ village') denied = { ...place, tier: 'hamlet' };
        else if (a === 'tier: ≥ hamlet') denied = { ...place, tier: 'thorp' };
        else if (a === 'tier: ≤ village') denied = { ...place, tier: 'town' };
        else if (a === 'tier: town') { expectPresentThenAbsent(before, standingKeys({ ...place, tier: 'village' }, cards), row.key, `${row.key} never in a village`); denied = { ...place, tier: 'city' }; }
        else if (a === 'route: isolated') denied = { ...place, config: { ...place.config, tradeRouteAccess: 'isolated' } };
        else if (a === 'ruler: lord') denied = { ...place, powerStructure: { ...place.powerStructure, government: 'Town Mayor' } };
        else if (a === 'coast') denied = { ...place, config: { ...place.config, terrainType: 'plains', tradeRouteAccess: 'road' } };
        else if (a === 'navigable') denied = { ...place, config: { ...place.config, terrainType: 'plains', tradeRouteAccess: 'road' } };
        else if (a === 'institution: tavern') denied = withoutHouse(place, 'Tavern');
        else if (a === 'watch') denied = withoutHouse(place, 'Village watch');
        else if (a === 'healer') denied = withoutHouse(place, 'Healer');
        else if (a === 'church' || a === 'sacredHouse') denied = withoutHouse(place, 'Parish church', 'Village shrine');
        else if (a === 'institution: mill') denied = withoutHouse(place, 'Mill');
        else if (a === 'livestock') denied = { ...place, economicState: { foodSecurity: { foodRecord: { foodSources: ['grain', 'fish'] } } } };
        else if (a === 'crisis: threat') denied = { ...place, stress: [{ type: 'under_siege' }], config: { ...place.config, selectedStresses: ['under_siege'] } };
        else if (a === 'crisis: hunger') denied = { ...place, stress: [{ type: 'famine' }], config: { ...place.config, selectedStresses: ['famine'] } };
        else throw new Error(`no planted denial for ${a}`);
        expectPresentThenAbsent(before, standingKeys(denied, cards), row.key, `${row.key} refused where the place denies ${a}`);
      }
      if (family === 'masters') {
        for (const tier of ['town', 'city', 'metropolis']) expectPresentThenAbsent(before, standingKeys({ ...place, tier }, cards), row.key, `${row.key} never in a ${tier}`);
      }
    });
    expectNoSeedFailures(failures, 'a row stands only where the place admits it');
  });
  it('the person: the denying word, the trade, the fire, the age, the office, the house', () => {
    const POS = new Set(NPC_PERSONALITY_TRAITS.positive); const NEG = new Set(NPC_PERSONALITY_TRAITS.negative); const NEU = new Set(NPC_PERSONALITY_TRAITS.neutral);
    const DISP = new Set(['welcoming', 'cautious', 'dismissive', 'transactional']);
    const failures = collectSeedFailures(rareSecretRows().filter((r) => r.row.holder), ({ family, row }) => {
      const h = row.holder;
      const { place, cards } = plantFor(family, row);
      const cand = cards.find((c) => c.id === 'cand');
      const before = standingKeys(place, cards);
      expect(before).toContain(row.key);
      /** @param {Record<string, any>} patch */
      const withCand = (patch) => cards.map((c) => (c.id === 'cand' ? { ...c, ...patch } : c));
      for (const w of h.deniedBy || []) {
        const p = { ...cand.personality }; const pres = { ...cand.presentation };
        if (POS.has(w)) p.dominant = w; else if (NEG.has(w)) p.flaw = w; else if (NEU.has(w)) p.modifier = w; else if (DISP.has(w)) pres.disposition = w;
        else throw new Error(`${row.key}: "${w}" is no word of the engine's temperaments, flaws, modifiers or dispositions`);
        expectPresentThenAbsent(before, standingKeys(place, withCand({ personality: p, presentation: pres })), row.key, `${row.key} never beside "${w}"`);
      }
      for (const w of h.notRoles || []) expectPresentThenAbsent(before, standingKeys(place, withCand({ role: `the ${w}` })), row.key, `${row.key} never on the ${w}`);
      for (const k of h.notCategory || []) expectPresentThenAbsent(before, standingKeys(place, withCand({ category: k })), row.key, `${row.key} never in ${k}`);
      for (const w of h.notHouses || []) expectPresentThenAbsent(before, standingKeys(place, withCand({ institution: { ...cand.institution, key: `The ${w}` } })), row.key, `${row.key} never at a house of ${w}`);
      if (h.age === 'ofYears') for (const a of NPC_AGE_DATA.young) expectPresentThenAbsent(before, standingKeys(place, withCand({ physical: { age: a } })), row.key, `${row.key} never on one in their ${a}`);
      if (h.age === 'old') expectPresentThenAbsent(before, standingKeys(place, withCand({ physical: { age: 'mid-forties' } })), row.key, `${row.key} only on the old`);
      if (h.age === 'notOld') for (const a of NPC_AGE_DATA.elder) expectPresentThenAbsent(before, standingKeys(place, withCand({ physical: { age: a } })), row.key, `${row.key} never on one in their ${a}`);
      if (typeof h.minYears === 'number') for (const [a, y] of Object.entries(RARE_SECRET_AGE_YEARS)) if (y < h.minYears) expectPresentThenAbsent(before, standingKeys(place, withCand({ physical: { age: a } })), row.key, `${row.key} never on one in their ${a}`);
      for (const w of h.notHookWords || []) for (const form of [w, `${w}'s`, `${w}s`]) expectPresentThenAbsent(before, standingKeys(place, withCand({ plotHooks: [`The ${form} owe money to half the street.`] })), row.key, `${row.key} never beside a hook naming "${form}"`);
      for (const w of (h.notHookWords || []).slice(0, 1)) expectPresentThenAbsent(before, standingKeys(place, withCand({ plotHooks: [{ text: `Their ${w} is owed money.`, needs: [] }] })), row.key, `${row.key} reads a hook of the declared shape`);
      if (h.keepsHouse) expectPresentThenAbsent(before, standingKeys(place, withCand({ institution: { kind: 'power', key: COUNCIL } })), row.key, `${row.key} only on a house's keeper`);
      if (h.roles && !h.category) expectPresentThenAbsent(before, standingKeys(place, withCand({ role: 'the cartwright-of-nothing' })), row.key, `${row.key} only on its own trade`);
      if (h.office && h.office.includes('head')) expectPresentThenAbsent(before, standingKeys(place, withCand({ memberships: [{ power: GUILD, rank: null, share: 1, veiled: false }] })), row.key, `${row.key} only on the head`);
      for (const o of h.not || []) {
        /** @type {Record<string, any>} */ let patch;
        if (o === 'head') patch = { memberships: [{ power: COUNCIL, rank: 1, share: 1, veiled: false }] };
        else if (o === 'elder') patch = { role: 'Elder' };
        else if (o === 'hereditary') patch = { role: 'the lord' };
        else if (o === 'knownFromBirth') patch = { role: 'the eldest' };
        else if (o === 'criminalHead') patch = { memberships: [{ power: "Thieves' Guild", rank: 1, share: 1, veiled: true }] };
        else throw new Error(`no planted office for ${o}`);
        const under = o === 'criminalHead' ? { ...place, powerStructure: { ...place.powerStructure, factions: [...place.powerStructure.factions, { faction: "Thieves' Guild", category: 'criminal' }] } } : place;
        if (o === 'criminalHead') expect(standingKeys(under, cards), 'the underworld on the page refuses nothing by itself').toContain(row.key);
        const after = standingKeys(under, withCand(patch).map((c) => (o === 'head' && c.id === 'head' ? { ...c, memberships: [] } : c)));
        expectPresentThenAbsent(before, after, row.key, `${row.key} never on the ${o}`);
        if (o === 'knownFromBirth') expectPresentThenAbsent(before, standingKeys(place, cards, [...RELS, { from: 'cand', to: 'other', type: 'family' }]), row.key, `${row.key} never on one with kin on the page`);
      }
    });
    expectNoSeedFailures(failures, 'a row stands only for a person its table admits');
  });
  it('a master only on its own trade: never on another master\'s trade', () => {
    const masters = rareSecretRows().filter((r) => r.family === 'masters' && r.row.holder?.roles && !r.row.holder?.office);
    const failures = collectSeedFailures(masters, ({ family, row }) => {
      const { place, cards } = plantFor(family, row);
      const before = standingKeys(place, cards);
      for (const other of masters) {
        const role = other.row.holder.roles[0];
        if (other === masters.find((m) => m.row.key === row.key) || row.holder.roles.includes(role)) continue;
        if (row.holder.roles.some((/** @type {string} */ w) => new RegExp(`\\b${w}\\b`).test(role))) continue;
        const after = standingKeys(place, cards.map((c) => (c.id === 'cand' ? { ...c, role: `the ${role}` } : c)));
        expectPresentThenAbsent(before, after, row.key, `${row.key} never on the ${role}`);
      }
    });
    expectNoSeedFailures(failures, 'a hidden master is the counterpart of the person\'s own trade');
  });
});

// ── THE NAMES ──────────────────────────────────────────────────────────────────────────────────────────────────────
describe('SECRETS-1: the superior and the target are real other people of the roster', () => {
  it('the superior is the head of the body the card prints the person a member of; none, and the row is not dealt', () => {
    const row = rareSecretRows().find((r) => r.row.key === 'superior');
    const { place, cards } = plantFor(row.family, row.row);
    const by = rareRowsStandingFor(place, cards, RELS, 'cand', { seed: 'plant' }).deeds.find((r) => r.key === 'superior');
    expect(by?.name).toBe('Bera Guild');
    expect(by?.what).toBe('Means to kill Bera Guild, and has worked out how');
    expect(superiorOf(cards[4], cards, /** @type {any} */ ({ order: [COUNCIL, GUILD], relationships: RELS }))?.name).toBe('Bera Guild');
    // a veiled standing is never read; a card that is first of every body it is in has no superior
    const veiled = cards.map((c) => (c.id === 'guildhead' ? { ...c, memberships: [{ power: GUILD, rank: 1, share: 1, veiled: true }] } : c));
    expectPresentThenAbsent(standingKeys(place, cards), standingKeys(place, veiled), 'superior', 'no superior from a veiled head');
    const first = cards.map((c) => (c.id === 'cand' ? { ...c, memberships: [{ power: GUILD, rank: 1, share: 1, veiled: false }] } : c.id === 'guildhead' ? { ...c, memberships: [] } : c));
    expectPresentThenAbsent(standingKeys(place, cards), standingKeys(place, first), 'superior', 'no superior for the first of the body');
    // the mentor of a tie whose student this person is
    const mentored = first.map((c) => c);
    const withMentor = [...RELS, { from: 'other', to: 'cand', type: 'mentor_student' }];
    expect(rareRowsStandingFor(place, mentored, withMentor, 'cand', { seed: 'plant' }).deeds.find((r) => r.key === 'superior')?.name).toBe('Dana Other');
  });
  it('a target is another named person, never the person, never their superior; a generation younger where the row says so; a pairing the tie denies refused', () => {
    const failures = collectSeedFailures(rareSecretRows().filter((r) => r.row.names === 'other' || r.row.names === 'younger'), ({ family, row }) => {
      const { place, cards } = plantFor(family, row);
      const got = rareRowsStandingFor(place, cards, RELS, 'cand', { seed: 'plant' })[family].find((r) => r.key === row.key);
      expect(got, row.key).toBeTruthy();
      const named = cards.find((c) => c.name === got.name);
      expect(named && named.id !== 'cand', `${row.key} names a real other person`).toBe(true);
      expect(got.name === 'Bera Guild' && row.key === 'hired').toBe(false);
      if (row.names === 'younger') expect(named.physical.age).toBe('early twenties');
    });
    expectNoSeedFailures(failures, 'every target is a real other person');
    // a generation younger: none on the page, and the row is not dealt
    const row = rareSecretRows().find((r) => r.row.key === 'parentOf');
    const { place, cards } = plantFor(row.family, row.row);
    const noYoung = cards.map((c) => (c.id === 'young' ? { ...c, physical: { age: 'early forties' } } : c));
    expectPresentThenAbsent(standingKeys(place, cards), standingKeys(place, noYoung), 'parentOf', 'parentOf needs one a generation younger');
    // a pairing the page's own tie denies: never in love with one's own kin
    const lovesKey = 'lovesNamed';
    const loves = rareSecretRows().find((r) => r.row.key === lovesKey);
    const lp = plantFor(loves.family, loves.row);
    const kin = lp.cards.filter((c) => c.id !== 'cand' && c.id !== 'head' && c.id !== 'guildhead').map((c) => ({ from: 'cand', to: c.id, type: 'family' }));
    const two = lp.cards.filter((c) => c.id === 'cand' || c.id === 'other' || c.id === 'young');
    const free = rareRowsStandingFor(lp.place, two, [], 'cand', { seed: 'plant' }).ties.map((r) => r.key);
    const kinned = rareRowsStandingFor(lp.place, two, kin, 'cand', { seed: 'plant' }).ties.map((r) => r.key);
    expectPresentThenAbsent(free, kinned, lovesKey, 'never in love with their own kin on the page');
  });
});

// ── THE DEAL OVER SEEDS ────────────────────────────────────────────────────────────────────────────────────────────
/** Sixty planted people of mixed trades and ages, in the two bodies. */
function bigRoster() {
  const roles = ['the smith', 'the healer', 'the innkeeper', 'the carpenter', 'the militia captain', 'the tailor', 'the chandler', 'the dairy farmer', 'the ferryman', 'the stable master', 'the priest', 'the musician', 'the potter', 'the miller', 'the apothecary', 'the cooper'];
  const ages = ['early twenties', 'mid-thirties', 'late forties', 'mid-fifties', 'early sixties', 'seventies'];
  return [
    plantCard('head', { name: 'Aldo Head', role: 'Elder', memberships: [{ power: COUNCIL, rank: 1, share: 1, veiled: false }], age: 'late sixties' }),
    plantCard('guildhead', { name: 'Bera Guild', role: 'the senior guild master', memberships: [{ power: GUILD, rank: 1, share: 1, veiled: false }], age: 'early fifties' }),
    ...Array.from({ length: 58 }, (_, i) => plantCard(`p${i}`, { name: `Planted Person${i}`, role: roles[i % roles.length], age: ages[i % ages.length], memberships: [{ power: i % 2 ? GUILD : COUNCIL, rank: i % 7 === 0 ? 2 : null, share: 1, veiled: false }] })),
  ];
}
const SEEDS = Array.from({ length: 300 }, (_, i) => `rare-law-${i}`);

describe('SECRETS-1: the deal over seeds (planted)', () => {
  const cards = bigRoster();
  const cityPlace = plantPlace({ tier: 'city' });
  const villagePlace = plantPlace({ tier: 'village' });
  it('at most one of a family in a place, never two on one person; each dealt row one that may stand for its person; the names real', () => {
    let dealt = 0;
    const failures = collectSeedFailures(SEEDS.flatMap((seed) => [{ seed, place: cityPlace }, { seed, place: villagePlace }]), ({ seed, place }) => {
      const out = dealRareSecrets(place, cards, RELS, { seed });
      const receipt = rareSecretReceiptOf(out);
      const fams = (receipt?.dealt || []).map((d) => d.family);
      expect(new Set(fams).size, `${seed}: one of a family`).toBe(fams.length);
      const ids = (receipt?.dealt || []).map((d) => d.id);
      expect(new Set(ids).size, `${seed}: one a person`).toBe(ids.length);
      for (const d of receipt?.dealt || []) {
        dealt += 1;
        const standing = rareRowsStandingFor(place, cards, RELS, d.id, { seed })[d.family];
        const hit = standing.find((r) => r.key === d.key);
        expect(hit, `${seed}: ${d.key} stands for ${d.id}`).toBeTruthy();
        const card = out.find((c) => c.id === d.id);
        expect(card.secret).toEqual({ what: hit.what, stakes: hit.stakes });
        if (d.names) expect(cards.some((c) => c.name === d.names && c.id !== d.id), `${seed}: ${d.names} is on the roster`).toBe(true);
        if (d.family === 'masters') expect(place.tier).toBe('village');
      }
      // every card not dealt is the same object; a dealt card differs only in its secret
      for (let i = 0; i < cards.length; i += 1) {
        if (ids.includes(cards[i].id)) expect({ ...out[i], secret: null }).toEqual({ ...cards[i], secret: null });
        else expect(out[i]).toBe(cards[i]);
      }
    });
    expectNoSeedFailures(failures, 'the deal holds its law over 600 planted places');
    expect(dealt).toBeGreaterThan(30);
  });
  it('the same seed gives the same deal; a kept person keeps theirs; a card with no age or no secret is never dealt', () => {
    const failures = collectSeedFailures(SEEDS.slice(0, 120), (seed) => {
      const a = dealRareSecrets(cityPlace, cards, RELS, { seed });
      const b = dealRareSecrets(cityPlace, cards, RELS, { seed });
      expect(b).toEqual(a);
      const dealtIds = (rareSecretReceiptOf(a)?.dealt || []).map((d) => d.id);
      if (!dealtIds.length) return;
      const keep = new Set(dealtIds);
      const kept = dealRareSecrets(cityPlace, cards, RELS, { seed, keep });
      for (const id of dealtIds) expect(kept.find((c) => c.id === id)).toBe(cards.find((c) => c.id === id));
    });
    expectNoSeedFailures(failures, 'same seed, same deal; a keeper keeps');
    const child = cards.map((c) => (c.id === 'p3' ? { ...c, physical: { age: 'a child of ten' } } : c.id === 'p5' ? { ...c, secret: null } : c));
    const ever = new Set();
    const loop = collectSeedFailures(SEEDS, (seed) => { for (const d of rareSecretReceiptOf(dealRareSecrets(cityPlace, child, RELS, { seed }))?.dealt || []) ever.add(d.id); });
    expectNoSeedFailures(loop, 'the deal runs');
    expectAbsentWithAnchor([...ever], 'p3', [...ever][0], 'a card with no adult age is never dealt');
    expectAbsentWithAnchor([...ever], 'p5', [...ever][0], 'a card with no secret is never dealt');
  });
  it('a renamed or replaced target is followed by the roster\'s prose refresh (the one substitution point)', () => {
    const named = SEEDS.map((seed) => ({ seed, out: dealRareSecrets(cityPlace, cards, RELS, { seed }) }))
      .map(({ seed, out }) => ({ seed, out, d: (rareSecretReceiptOf(out)?.dealt || []).find((x) => x.names) }))
      .find((x) => x.d);
    expect(named, 'a seed of the 300 deals a row that names a person').toBeTruthy();
    const { out, d } = /** @type {any} */ (named);
    const renamed = out.map((c) => (c.name === d.names ? { ...c, name: 'Newcome Stranger' } : c));
    const refreshed = refreshRosterProse(renamed, [{ from: d.names, to: 'Newcome Stranger' }], new Set());
    const card = refreshed.find((c) => c.id === d.id);
    expect(`${card.secret.what} ${card.secret.stakes}`).toContain('Newcome Stranger');
    expectPresentThenAbsent(`${out.find((c) => c.id === d.id).secret.what} ${out.find((c) => c.id === d.id).secret.stakes}`, `${card.secret.what} ${card.secret.stakes}`, d.names, 'the old name is gone');
  });
  it('who may carry one: never one whose presentation is drawn from the secret, whose secret is a crisis pool\'s, or whom another secret names', () => {
    const r = dealRareSecrets(cityPlace, cards.map((c) => (c.id === 'p7' ? { ...c, secret: { what: 'Has been passing information to Planted Person9', stakes: 'x' } } : c)), RELS, { seed: 'rare-law-0' });
    expect(rareSecretReceiptOf(r)?.excluded["named in another card's secret"]).toBe(1);
  });
});

// ── AMENDMENT 2 (the chair, 2026-11-17): the two exclusions, the re-roll, the small places, the magic list, the cap ──
/** The forty-seven magic-only keys, pinned (the brief's count: 26 of the first hundred, 21 of AMENDMENT 1). */
const MAGIC_KEYS = ['demon', 'cursed', 'raisedDead', 'growsYounger', 'luck', 'foresees', 'beastSpeech', 'ageless', 'hearsLies', 'nightSight', 'deathWatch',
  'ghost', 'godBlood', 'dragonBlood', 'changeling', 'fey', 'moonChanged', 'feyReplaced', 'ghostChild', 'familiar', 'seventhChild', 'selkie', 'grandmother',
  'masterWizard', 'fromThePast', 'fromTheFuture', 'regressor', 'otherWorld', 'realWorld', 'loop', 'returns', 'statSight', 'riddler', 'sameDay',
  'trueName', 'noShadow', 'smallGod', 'deathsClerk', 'wrongEnding', 'madeThing', 'starFallen', 'swappedBodies', 'thousandLives', 'dragonHiding', 'underTheHat', 'narrator', 'prophecy'];
describe('SECRETS-1 AMENDMENT 2: the exclusions, the re-roll, the small places, the magic list, the cap', () => {
  it('the forty-seven magic-only keys are exactly these', () => {
    expect(MAGIC_KEYS.length).toBe(47);
    expect(rareSecretRows().filter((r) => r.row.magic).map((r) => r.row.key).sort()).toEqual([...MAGIC_KEYS].sort());
  });
  it('a face drawn from its secret, and a crisis pool\'s own secret, never carry one', () => {
    const { place, cards } = plantFor('ties', rareSecretRows().find((r) => r.row.key === 'brothersWife').row);
    const before = standingKeys(place, cards);
    const mode = NPC_PRESENTATION_MODES.dangerous_presents_safe[0];
    const faced = cards.map((c) => (c.id === 'cand' ? { ...c, presentation: mode } : c));
    expectPresentThenAbsent(before, standingKeys(place, faced), 'brothersWife', 'a face drawn from the secret');
    const crisis = Object.values(STRESS_INSTITUTION_EFFECTS).flat()[0];
    const crisisCards = cards.map((c) => (c.id === 'cand' ? { ...c, secret: { what: crisis.secret.replace(/\{[a-zA-Z]+\}/g, 'the guild'), stakes: crisis.stakes } } : c));
    expectPresentThenAbsent(before, standingKeys(place, crisisCards), 'brothersWife', "a crisis pool's own secret");
  });
  it('a hidden master stands in a thorp and in a hamlet as in a village', () => {
    const failures = collectSeedFailures(rareSecretRows().filter((r) => r.family === 'masters'), ({ family, row }) => {
      for (const tier of ['thorp', 'hamlet', 'village']) {
        const { place, cards } = plantFor(family, row);
        // the same card, in a town, holds none (AMENDMENT 3: the negative beside its anchor)
        expectPresentThenAbsent(standingKeys({ ...place, tier }, cards), standingKeys({ ...place, tier: 'town' }, cards), row.key, `${row.key} in a ${tier}, never in a town`);
      }
    });
    expectNoSeedFailures(failures, 'every hidden master stands in each small place');
  });
  it('one seed places two candidates of a family, and the cap deals one', () => {
    const cards = bigRoster();
    const hit = SEEDS.map((seed) => ({ seed, r: rareSecretReceiptOf(dealRareSecrets(plantPlace({ tier: 'city' }), cards, RELS, { seed })) }))
      .find(({ r }) => Object.values(r?.standing || {}).some((n) => n >= 2));
    expect(hit, 'a seed of the 300 finds two STANDING candidates of one family (a row stands for each)').toBeTruthy();
    const fam = Object.entries(hit.r.standing).find(([, n]) => n >= 2)[0];
    expect(hit.r.dealt.filter((d) => d.family === fam).length).toBe(1);
  });
  it('AMENDMENT 3: a kept holder whose named person is gone takes a new name for the SAME row; a user\'s own words are never touched', () => {
    const cards = bigRoster();
    const place = plantPlace({ tier: 'city' });
    const holder = { ...cards[5], secret: { what: 'Is in love with Gone Person, and would sooner die than have it known', stakes: 'Gone Person has started to notice' } };
    const roster = cards.map((c, i) => (i === 5 ? holder : c));
    const out = dealRareSecrets(place, roster, RELS, { seed: 'follow-0', keep: new Set([holder.id]) });
    const r = rareSecretReceiptOf(out);
    const now = out.find((c) => c.id === holder.id);
    expect(rareRowOf(holder.secret)?.row.key).toBe('lovesNamed');
    expect(rareRowOf(now.secret)?.row.key).toBe('lovesNamed');
    expect(r.followed.map((x) => x.id)).toEqual([holder.id]);
    expectPresentThenAbsent(holder.secret.what, now.secret.what, 'Gone Person', 'the gone name is followed');
    expect(cards.some((c) => c.name === rareRowOf(now.secret)?.name && c.id !== holder.id)).toBe(true);
    // a user's own words (no row's) are never touched
    const authored = { ...holder, secret: { what: 'Is in love with Gone Person, and says so to the river', stakes: 'Gone Person has started to notice' } };
    const out2 = dealRareSecrets(place, cards.map((c, i) => (i === 5 ? authored : c)), RELS, { seed: 'follow-0', keep: new Set([holder.id]) });
    expect(out2.find((c) => c.id === holder.id)).toBe(authored);
  });
  it('AMENDMENT 3: the superior is never one the card\'s own goal or hook names', () => {
    const row = rareSecretRows().find((r) => r.row.key === 'superior');
    const { place, cards } = plantFor(row.family, row.row);
    const named = cards.map((c) => (c.id === 'cand' ? { ...c, goal: { short: 'Stand by Bera Guild in the next quarrel.', long: '' } } : c));
    expectPresentThenAbsent(standingKeys(place, cards), standingKeys(place, named), 'superior', 'never beside a goal naming the superior');
  });
  it('a kept person\'s rare secret fills its family\'s cap, in the deal and through a re-roll end to end', async () => {
    const cards = bigRoster();
    const place = plantPlace({ tier: 'city' });
    const found = SEEDS.map((seed) => ({ seed, out: dealRareSecrets(place, cards, RELS, { seed }) })).find(({ out }) => (rareSecretReceiptOf(out)?.dealt || []).length);
    expect(found).toBeTruthy();
    const d = rareSecretReceiptOf(found.out).dealt[0];
    // the holder kept, and every seed of the 300 dealt again: no second of that family
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const again = dealRareSecrets(place, found.out, RELS, { seed, keep: new Set([d.id]) });
      const r = rareSecretReceiptOf(again);
      expect(r.kept.map((k) => k.family)).toEqual([d.family]);
      expect(r.dealt.filter((x) => x.family === d.family)).toEqual([]);
    });
    expectNoSeedFailures(failures, 'a kept holder fills the cap');
    // end to end: a born town's holder kept by a user's edit through regenNPCsPipeline
    const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
    const { generateSettlementPipeline, regenNPCsPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { applyUserEdit } = await import('../../src/domain/userEdits.js');
    await boundary.loadGenerationLawPayloads();
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    const town = generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: 'metropolis' }), null, { seed: 'r2r-metropolis-1', customContent: {} });
    const holder = town.npcs.find((n) => rareRowOf(n.secret));
    expect(holder, 'r2r-metropolis-1 is born with a rare secret').toBeTruthy();
    const fam = rareRowOf(holder.secret).family;
    // the anchor: before the re-roll the holder HAS the row, and the town holds exactly one of its family
    expect(rareRowOf(holder.secret).row.key).toBeTruthy();
    expect(town.npcs.filter((n) => rareRowOf(n.secret)?.family === fam).length).toBe(1);
    applyUserEdit(holder, 'goal.short', 'Keep the customs ledgers in order this season.', { editedAt: '2026-01-01T00:00:00.000Z' });
    const rerolls = collectSeedFailures(['rare-reroll-0', 'rare-reroll-1', 'rare-reroll-2'], (seed) => {
      const parts = regenNPCsPipeline(town, town.config, { seed });
      const kept = parts.npcs.find((n) => n.name === holder.name);
      expect(kept?.secret).toEqual(holder.secret);
      expect(parts.npcs.filter((n) => rareRowOf(n.secret)?.family === fam).length, `${seed}: one of the ${fam} family`).toBe(1);
    });
    expectNoSeedFailures(rerolls, 'a re-roll keeps the holder and breaks no cap');
  }, 120000);
});

// ── THE BORN SAMPLE: NO DRAW TAKEN ─────────────────────────────────────────────────────────────────────────────────
// Census seeds (CENSUS-3 seedcfg.mjs's r2r- arm) whose birth deals a rare secret at the tip (measured over the 720).
const BORN_DEALT = ['r2r-metropolis-1', 'r2r-hamlet-36', 'r2r-thorp-35']; // a tie; a hidden master (masterSmith); an outsider (dragonHiding)
describe('SECRETS-1: with the deal off, a birth is identical but for the dealt cards\' secrets (no draw taken)', () => {
  it('a handful of births', async () => {
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    const bornOf = async () => {
      const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
      const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
      const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
      await boundary.loadGenerationLawPayloads();
      return (/** @type {string} */ seed) => generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
    };
    const on = await bornOf();
    const withDeal = BORN_DEALT.map((seed) => on(seed));
    vi.resetModules();
    vi.doMock('../../src/generators/people/rareSecrets.js', async (orig) => ({ ...(await orig()), dealRareSecrets: (/** @type {any} */ _s, /** @type {any[]} */ cards) => cards }));
    const off = await bornOf();
    const withoutDeal = BORN_DEALT.map((seed) => off(seed));
    vi.doUnmock('../../src/generators/people/rareSecrets.js');
    vi.resetModules();
    const { RARE_SECRET_ROWS: ROWS } = await import('../../src/data/rareSecrets.js');
    const texts = Object.values(ROWS).flat().map((r) => new RegExp(`^${r.what.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{(superior|target)\\\}/g, '.+')}$`));
    const failures = collectSeedFailures(BORN_DEALT.map((seed, i) => ({ seed, a: withDeal[i], b: withoutDeal[i] })), ({ seed, a, b }) => {
      const dealtIds = a.npcs.filter((n) => texts.some((re) => re.test(String(n?.secret?.what || '')))).map((n) => n.id);
      expect(dealtIds.length, `${seed} deals one`).toBeGreaterThan(0);
      const strip = (/** @type {any} */ s) => JSON.stringify({ ...s, npcs: s.npcs.map((n) => (dealtIds.includes(n.id) ? { ...n, secret: null } : n)) });
      expect(strip(a)).toBe(strip(b));
    });
    expectNoSeedFailures(failures, 'a birth moves only the dealt cards\' secrets');
  }, 120000);
});
