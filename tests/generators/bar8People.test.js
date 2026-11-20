/**
 * tests/generators/bar8People.test.js — BAR8 K-PEOPLE (BRIEF-BAR8 § K-PEOPLE, 2026-11-17; the rulings BR13 and BR14): WHAT A
 * PERSON IS SAID TO HOLD, DO OR BE MUST FIT THAT PERSON'S OWN HOUSE, SEAT AND CARD. Each arm is a law over fixed seeds of the
 * census's 720 (the towns where the base printed the instance), a negative beside a positive anchor, every failure collected.
 *
 * (14f) A CRISIS SECRET THAT PRESUMES A COMMAND OR AN OFFICE IS DEALT ONLY TO ITS HOLDER (`data/stressInstitutionEffects.js ::
 *       holder`, read by its own `crisisHolderAdmits` in `npcGenerator.js :: generateCrimeLevel` in the vocabulary of `rareSecrets.js :: HOLDER_KEYS`). C6865:
 *       "Authorised an illegal sortie" on a guild archmage. At the base: a master butcher's and a miller's sortie, a cobbler's
 *       and a smelt master's sale of the emergency stores, a smelt master's and a warehouse factor's surrender terms. THE
 *       POSITIVE: the watch captain's sortie (r2s-under_siege-town-2) and the granary reeve's stores (r2s-famine-town-1) stand.
 * (13b) A TIE THAT HOLDS SOMEONE INSIDE DECLARES THE PRISON (`data/people/handlerTieLines.js`, the atom `prison`). C37891.
 *       THE POSITIVE: a town with a prison keeps the held friend (r2r-city-10).
 * (14b) THE SWAP (BR13): house A's network handled by B's people while B's is handled by A's, in the houses' pool (C6183;
 *       `domain/people/allegiance.js :: assignHandlers`). THE POSITIVE: a network handled one way by another house's face
 *       (`.cross`, the deal's design, the owner's question) stands (r2r-city-10).
 * (14g) "Emir" on a woman (C36170): the arabic lord is the pair Emir / Emira.
 * (14h) "Win two more people in {power} ... before {above} notices" only where the power holds four (C14564;
 *       `goalFamilies.js :: GOAL_LINE_MIN_MEMBERS`, read by `people/goals.js :: cellCandidates`). THE POSITIVE: the line is
 *       still dealt in a power of four or more (r2r-hamlet-8).
 * The census (the auditor's runner `docs/chair/2026-11-17/bar8/AUDIT/runK.mjs` over the thirty, the 150 and the 720) is the
 * measure: the hand-back's table.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { STRESS_INSTITUTION_EFFECTS, crisisHolderAdmits } from '../../src/data/stressInstitutionEffects.js';
import { HOLDER_KEYS } from '../../src/data/rareSecrets.js';
import { honorificOfTitle } from '../../src/data/faceHonorifics.js';
import { cardHonorificOf } from '../../src/domain/people/cardDoor.js';
import { GOAL_LINE_MIN_MEMBERS } from '../../src/data/people/goalFamilies.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own configuration (PAGE-COPY seedcfg.mjs: its r2r- and r2s- arms). @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-\\d+$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-\\d+$`)));
  return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
};
beforeAll(async () => { await loadGenerationLawPayloads(); });
/** @type {Map<string, any>} */
const births = new Map();
/** @param {string} seed @returns {any} */
const born = (seed) => {
  if (!births.has(seed)) births.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return births.get(seed);
};

/** Every crisis row that carries a holder test, with the words its secret opens with (up to its first slot). */
const HELD_ROWS = Object.entries(STRESS_INSTITUTION_EFFECTS).flatMap(([crisis, rows]) => rows
  .filter((/** @type {any} */ r) => r.holder).map((/** @type {any} */ r) => ({ crisis, row: r, head: String(r.secret).split('{')[0].trim().slice(0, 60) })));
/** The holder-tested row a card's secret was dealt from, or null. @param {any} card */
const heldRowOf = (card) => { const what = String(card?.secret?.what || ''); return HELD_ROWS.find((h) => what.startsWith(h.head)) || null; };

describe('BAR8 K-PEOPLE (14f) · a crisis secret of command is dealt only to its holder', () => {
  it('the ten rows that presume a command or an office carry a holder test, in the very rare rows\' keys; every pool keeps three rows for anyone', () => {
    expect(HELD_ROWS.length).toBe(10);
    const READ = new Set(['roles', 'category', 'notRoles', 'notCategory', 'notHouses', 'keepsHouse']);
    for (const { row } of HELD_ROWS) for (const k of Object.keys(row.holder)) {
      expect(HOLDER_KEYS, `${row.secret}: ${k}`).toContain(k);
      expect(READ.has(k), `${row.secret}: ${k} is read by crisisHolderAdmits`).toBe(true);
    }
    for (const [crisis, rows] of Object.entries(STRESS_INSTITUTION_EFFECTS)) {
      const open = rows.filter((/** @type {any} */ r) => !r.holder && typeof r.twinOf !== 'string').length;
      expect(open, `${crisis}: rows every person may be dealt`).toBeGreaterThanOrEqual(3);
    }
  });

  it('the holder test reads the card (a negative beside a positive)', () => {
    const sortie = HELD_ROWS.find((h) => /illegal sortie/.test(h.head))?.row.holder;
    expect(crisisHolderAdmits(sortie, { role: 'the master butcher', category: 'other', institution: { kind: 'house', key: 'Butchers (3-8)' } })).toBe(false);
    expect(crisisHolderAdmits(sortie, { role: 'the guild archmage', category: 'magic', institution: { kind: 'house', key: "Mages' guild" } })).toBe(false);
    expect(crisisHolderAdmits(sortie, { role: 'the grove elder', category: 'religious', institution: { kind: 'house', key: 'Elder Grove Council' } })).toBe(false);
    expect(crisisHolderAdmits(sortie, { role: 'the watch captain', category: 'military', institution: { kind: 'house', key: 'Town watch' } })).toBe(true);
    expect(crisisHolderAdmits(sortie, { role: 'Headman', category: 'other', institution: { kind: 'house', key: "Fisher's landing" } })).toBe(true);
    expect(crisisHolderAdmits(undefined, { role: 'the miller' })).toBe(true);
  });

  // the towns where the base dealt a sortie, the emergency stores or surrender terms to a person with no command
  const SEEDS = ['r2s-under_siege-town-0', 'r2s-under_siege-town-1', 'r2s-under_siege-city-0', 'r2s-under_siege-city-1', 'r2s-under_siege-metropolis-2',
    'r2s-famine-village-0', 'r2s-famine-town-0', 'r2s-under_siege-town-2', 'r2s-famine-town-1'];
  it('no card of these towns carries a holder-tested secret it fails', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      for (const n of born(seed).npcs || []) {
        const h = heldRowOf(n);
        if (h) expect(crisisHolderAdmits(h.row.holder, n), `${seed}: ${n.name}, ${n.role} (${n.category}) holds "${h.head}"`).toBe(true);
      }
    });
    expectNoSeedFailures(failures, 'a crisis secret of command on its holder');
  });

  it('THE POSITIVE: the watch captain\'s sortie and the granary reeve\'s stores are still dealt', () => {
    const holds = (/** @type {string} */ seed, /** @type {RegExp} */ re, /** @type {RegExp} */ role) => (born(seed).npcs || []).some((/** @type {any} */ n) => re.test(String(n?.secret?.what || '')) && role.test(String(n.role || '')));
    expect(holds('r2s-under_siege-town-2', /illegal sortie/, /watch captain/)).toBe(true);
    expect(holds('r2s-famine-town-1', /emergency stores/, /granary reeve/)).toBe(true);
  });
});

describe('BAR8 K-PEOPLE (13b) · a tie that holds someone inside stands where a prison does', () => {
  const PRISON = /prison|stocks|\bgaol|\bjail/i;
  const HELD = /fed and safe inside|get the prisoner out|fallen ill inside/;
  /** @param {any} s */
  const heldLines = (s) => (s.relationships || []).map((/** @type {any} */ r) => `${r.description || ''} ${r.tension || ''}`).filter((t) => HELD.test(t));
  /** @param {any} s */
  const hasPrison = (s) => (s.institutions || []).some((/** @type {any} */ i) => PRISON.test(String(i?.name || '')));
  const SEEDS = ['r2r-city-43', 'r2r-town-31', 'r2s-infiltrated-town-2', 'r2s-monster_pressure-city-1', 'r2s-mass_migration-city-3'];
  it('no held friend and no prisoner where the town keeps no prison', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const s = born(seed);
      expect(hasPrison(s), `${seed}: the anchor keeps no prison`).toBe(false);
      expect(heldLines(s), seed).toEqual([]);
    });
    expectNoSeedFailures(failures, 'a held tie with no prison');
  });
  it('THE POSITIVE: a town with a prison keeps the held friend (r2r-city-10)', () => {
    const s = born('r2r-city-10');
    expect(hasPrison(s)).toBe(true);
    expect(heldLines(s).some((t) => /fed and safe inside/.test(t))).toBe(true);
  });
});

describe('BAR8 K-PEOPLE (14b) · no house\'s network is handled only by another house whose own network it handles (BR13)', () => {
  /** The houses' pool as the page prints it: per house, the houses of its handlers. @param {any} s */
  const networks = (s) => {
    const npcs = s.npcs || []; const byId = new Map(npcs.map((/** @type {any} */ n) => [String(n.id), n]));
    /** @type {Map<string, Set<string>>} */
    const g = new Map();
    for (const n of npcs) {
      const a = n.allegiance; if (!a || !a.house || a.power || !a.handler) continue;
      const h = byId.get(String(a.handler)); if (!h) continue;
      if (!g.has(a.house)) g.set(a.house, new Set());
      /** @type {Set<string>} */ (g.get(a.house)).add(String(h.institution?.key || ''));
    }
    return g;
  };
  /** @param {any} s */
  const swaps = (s) => { const g = networks(s); const out = []; for (const [a, hs] of g) if (!hs.has(a)) for (const b of hs) { const bh = g.get(b); if (bh && !bh.has(b) && bh.has(a)) out.push(`${a} <-> ${b}`); } return out; };
  const SEEDS = ['r2r-city-0', 'r2r-city-3', 'r2r-city-17', 'r2r-city-52', 'r2r-city-59', 'r2s-under_siege-city-3', 'r2s-under_siege-metropolis-0',
    'r2s-occupied-metropolis-1', 'r2s-occupied-metropolis-3', 'r2s-plague_onset-city-2', 'r2s-succession_void-city-0'];
  it('no swap in the towns where the base dealt one', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => { expect(swaps(born(seed)), seed).toEqual([]); });
    expectNoSeedFailures(failures, 'the swap of two houses\' networks');
  });
  it('THE POSITIVE: a network handled one way by another house\'s face stands (the deal\'s design, r2r-city-10)', () => {
    const g = networks(born('r2r-city-10'));
    expect([...g].some(([a, hs]) => !hs.has(a) && hs.size > 0)).toBe(true);
  });
});

describe('BAR8 K-PEOPLE (14g) · "Emir" is the arabic lord of one sex (BR14, C36170)', () => {
  it('a woman who holds the seat is Emira, a man Emir, on the resolver and on the card door', () => {
    const seeds = Array.from({ length: 12 }, (_, i) => `seed-${i}`);
    expect([...new Set(seeds.map((seed) => honorificOfTitle('the lord', 'female', seed, { culture: 'arabic' })))]).toEqual(['Emira']);
    expect([...new Set(seeds.map((seed) => honorificOfTitle('the lord', 'male', seed, { culture: 'arabic' })))]).toEqual(['Emir']);
    const card = { id: 'npc_x', name: 'Abir al-Qadir', gender: 'female', institution: { kind: 'power', key: 'Landed Gentry', title: 'the lord' } };
    expect(cardHonorificOf(card, { config: { culture: 'arabic' }, institutions: [] })).toBe('Emira');
    expect(cardHonorificOf({ ...card, gender: 'male' }, { config: { culture: 'arabic' }, institutions: [] })).toBe('Emir');
  });
});

describe('BAR8 K-PEOPLE (14h) · "win two more people" in a power that holds them (C14564)', () => {
  const WIN = /^Win two more people in .+ over to their side before (.+) notices\.$/;
  /** The card's goal lines that count two more of their power. @param {any} n @returns {string[]} */
  const wins = (n) => ['short', 'long'].map((v) => String(n?.goal?.[v] ?? '')).filter((t) => WIN.test(t));
  /** Members of each power as the Power tab counts them. @param {any} s */
  const counts = (s) => { /** @type {Map<string, number>} */ const m = new Map(); for (const c of s.npcs || []) for (const x of c.memberships || []) m.set(x.power, (m.get(x.power) || 0) + 1); return m; };
  // the towns where the base printed the line in a power of two or three
  const SEEDS = ['r2r-city-27', 'r2r-village-11', 'r2r-village-27', 'r2s-famine-city-1', 'r2s-insurgency-hamlet-3', 'r2s-slave_revolt-thorp-0', 'r2s-succession_void-town-0', 'r2s-wartime-village-1'];
  it('the line declares four members', () => {
    expect(GOAL_LINE_MIN_MEMBERS['Win two more people in {power} over to their side before {above} notices.']).toBe(4);
  });
  it('the line stands only beside the one above in a power of four or more', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const s = born(seed); const k = counts(s);
      for (const n of s.npcs || []) for (const t of wins(n)) {
        const above = /** @type {RegExpExecArray} */ (WIN.exec(t))[1];
        const a = (s.npcs || []).find((/** @type {any} */ c) => String(c.name).startsWith(above));
        const shared = (n.memberships || []).filter((/** @type {any} */ x) => (a?.memberships || []).some((/** @type {any} */ y) => y.power === x.power)).map((/** @type {any} */ x) => k.get(x.power) || 0);
        expect(Math.max(0, ...shared), `${seed}: ${n.name}: "${t}"`).toBeGreaterThanOrEqual(4);
      }
    });
    expectNoSeedFailures(failures, 'two more people in a power that holds them');
  });
  it('THE POSITIVE: the line is still dealt where the power holds four (r2r-hamlet-8)', () => {
    expect((born('r2r-hamlet-8').npcs || []).some((/** @type {any} */ n) => wins(n).length > 0)).toBe(true);
  });
});
