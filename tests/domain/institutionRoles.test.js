/**
 * institutionRoles.test.js — ATTRIBUTION BY ROLE, PINNED (ADDENDUM 18 ruling 25; car 8b-W-18l).
 *
 * THE FIVE THINGS THIS FILE HOLDS, in the brief's own order:
 *   1. THE TABLE'S SHAPE — every row non-empty, the ten common rows carried, NO MINTED PROPER
 *      NAME anywhere, and no `office: true` role the NPC roster could never print.
 *   2. THE FILL — sg/pl agreement, the capital at a sentence head and nowhere else, and the
 *      no-repeat exclusion set.
 *   3. THE DRAW'S DETERMINISM — one seed, one role, ten thousand times.
 *   4. THE SEATING — a role exists only where its row does, and an office only where the
 *      town's own roster prints it.
 *   5. THE ZERO-TEXT-SHIFT PROOF — the shipped corpus names no attribution slot, so the whole
 *      mechanism is inert on it and the generated files are byte-identical.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  CUSTOM_ROLE_FIELD, INSTITUTION_ROLES, ROSTER_OFFICE_TITLES, SOURCE_FALLBACK_ROLES,
} from '../../src/data/institutionRoles.js';
import {
  rolesOf, sourcesOf, sourcesOfRowName, withFaceSources,
} from '../../src/domain/display/stateProse/faceSources.js';
import {
  FACE_SOURCES, ROLE_SLOTS, agreeVerb, drawRole, fillRoleSlots,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/** Every entry of the table, flattened with the row it came from. */
const ALL_ENTRIES = Object.entries(INSTITUTION_ROLES)
  .flatMap(([row, roles]) => roles.map((entry) => ({ row, ...entry })));
/** The fallback rosters' entries, flattened the same way. */
const ALL_FALLBACK = SOURCE_FALLBACK_ROLES
  .flatMap(({ source, roles }) => roles.map((entry) => ({ row: `fallback:${source}`, ...entry })));

describe('the role table — its shape (ADDENDUM 18 ruling 25)', () => {
  it('every catalogue row this table names is a REAL row of the catalogue', () => {
    /** @type {Set<string>} */
    const catalogue = new Set();
    for (const tier of Object.values(institutionalCatalog)) {
      for (const category of Object.values(tier)) {
        for (const row of Object.keys(category)) catalogue.add(row.toLowerCase());
      }
    }
    const phantom = Object.keys(INSTITUTION_ROLES)
      .filter((row) => !catalogue.has(row.toLowerCase()));
    expect(phantom, 'a role row that names no catalogue row — a role nothing can ever seat')
      .toEqual([]);
    // ANTI-VACUITY: the catalogue really was read.
    expect(catalogue.size).toBeGreaterThan(200);
  });

  it('⭐ every row carries roles, and the TEN COMMON ROWS the brief names carry four or more', () => {
    const empty = Object.entries(INSTITUTION_ROLES).filter(([, roles]) => roles.length === 0);
    expect(empty.map(([row]) => row), 'a row that lends no role at all').toEqual([]);
    // The ten families the car's brief names, each by one catalogue row that must be carried.
    const COMMON = Object.freeze([
      'Town hall', 'Parish church', 'Craft guilds (5-15)', 'Weekly market', 'Taverns (5-20)',
      'Docks/port facilities', 'Town watch', 'Garrison', 'Courthouse', 'Burial ground',
    ]);
    const thin = COMMON.filter((row) => (INSTITUTION_ROLES[row] || []).length < 4);
    expect(thin, 'a common row with fewer than four roles — the roll would not vary').toEqual([]);
  });

  it('⭐⭐ NO MINTED PROPER NAME, anywhere, in the table or in a fallback roster', () => {
    // THE PROMISE and the product's scope: the engine mints and owns a person's name and a
    // person's fate. A role is a common-noun phrase or an OFFICE TITLE, and both are lowercase
    // — so a capital inside a role is a name that slipped in, and this is a regex rather than
    // a habit. `{`-free too: a role is a finished phrase, never another slot.
    const capitalised = [...ALL_ENTRIES, ...ALL_FALLBACK]
      .filter(({ role }) => /[A-Z]/.test(role) || role.includes('{'))
      .map(({ row, role }) => `${row}: ${role}`);
    expect(capitalised, 'a role carrying a capital or a slot — a minted name, or a nested fill')
      .toEqual([]);
    // And the mechanical bars of §6 hold inside a role as everywhere else.
    const barred = [...ALL_ENTRIES, ...ALL_FALLBACK]
      .filter(({ role }) => /[—–!?0-9]/.test(role))
      .map(({ row, role }) => `${row}: ${role}`);
    expect(barred, 'a role carrying an em dash, a bang, a question mark or a digit').toEqual([]);
    expect(ALL_ENTRIES.length, 'and the sweep found the table').toBeGreaterThan(150);
  });

  it('every entry declares a number, and it is one of the two', () => {
    const bad = [...ALL_ENTRIES, ...ALL_FALLBACK]
      .filter(({ n }) => n !== 'sg' && n !== 'pl')
      .map(({ row, role, n }) => `${row}: ${role} (${String(n)})`);
    expect(bad, 'an entry with no declared number — the verb would have nothing to agree with')
      .toEqual([]);
    // Both numbers are really used, or the agreement machinery below is decoration.
    expect(ALL_ENTRIES.filter((e) => e.n === 'pl').length).toBeGreaterThan(20);
    expect(ALL_ENTRIES.filter((e) => e.n === 'sg').length).toBeGreaterThan(80);
  });

  it('⭐ NO OFFICE IS MARKED THAT THE NPC ROSTER CANNOT PRINT (ruling 25 edge (a))', () => {
    const titles = new Set(ROSTER_OFFICE_TITLES.map((row) => row.title));
    const unlicensed = [...ALL_ENTRIES, ...ALL_FALLBACK]
      .filter(({ office, role }) => office === true && !titles.has(role))
      .map(({ row, role }) => `${row}: ${role}`);
    expect(unlicensed, 'an office title no roster string maps to — an office nothing licenses')
      .toEqual([]);
    // ⛔ AND THE MAP IS HELD TO THE GENERATOR BY NAME, not by memory: every roster string here
    // must appear in npcGenerator.js's own tables, or this table is describing a roster that
    // no longer exists.
    const generator = read('src/generators/npcGenerator.js');
    const missing = ROSTER_OFFICE_TITLES
      .filter(({ roster }) => !generator.includes(`'${roster}'`))
      .map(({ roster }) => roster);
    // Harbour/Harbor Master is spelled by the institution roster rather than the NPC tables,
    // so it is the one row exempted BY NAME rather than by a silent filter.
    expect(missing, 'a roster office this table names that the generator does not print')
      .toEqual(['Harbour Master', 'Harbor Master']);
    // No fallback roster carries an office at all: a fallback fires where the ROWS are silent,
    // and an office belongs to a row.
    expect(ALL_FALLBACK.filter((e) => e.office === true)).toEqual([]);
  });

  it('the fallback roster covers every seatable source, and only those', () => {
    const covered = SOURCE_FALLBACK_ROLES.map((row) => row.source).sort();
    expect(covered).toEqual([...ROLE_SLOTS].sort());
    expect(ROLE_SLOTS).not.toContain('archiver');
    expect(FACE_SOURCES).toContain('archiver');
    for (const { source, roles } of SOURCE_FALLBACK_ROLES) {
      expect(roles.length, `${source} fallback`).toBeGreaterThanOrEqual(3);
    }
  });

  it('⛔ THE OWNER-GATED CUSTOM-CONTENT FIELD IS NAMED AND NOT ADDED', () => {
    // Ruling 25 licenses a custom row to declare roles; the manifest field that would carry it
    // rewrites migration 185's frozen block through the manifest generator, which is a
    // persistence-shape act and the owner's. The TODO is the record that it was seen, decided
    // and left; this arm is what stops the field appearing without the owner.
    expect(CUSTOM_ROLE_FIELD).toBe('roles');
    const table = read('src/data/institutionRoles.js');
    expect(table).toMatch(/TODO\(owner-gated\)/);
    expect(table).toMatch(/MIGRATION 185/);
    const manifest = read('schema/custom-content.manifest.json');
    expect(manifest.includes('"roles"'), 'the manifest field was added without the owner')
      .toBe(false);
  });

  it('⚠ THE TWO ROWS WHOSE SOURCE IS NOT SEATED TODAY are named, not left to look live', () => {
    // `Docks/port facilities` and `Burial ground` are carried because ruling 25 names both by
    // example, and NEITHER lends a source under today's `sourcesOf`: there is no `docks` word
    // and no `ground` word in the kernel's closed vocabulary. Reported OPEN rather than
    // silently dead, and pinned here so the day a car seats one this arm reds by name.
    // The five whose SOURCE does not exist in the kernel's closed vocabulary at all …
    const UNREACHABLE = ['Docks/port facilities', "Harbour master's office", 'Burial ground',
      'Parish burial grounds', 'Burial grounds and charnel house',
      // … and the THREE SEATING GAPS this table's writing found in car 8b-W-18c's keyword
      // lists. `REGISTER_NAMES` spells `monastery` so the plural rows never match, and
      // `TAVERN_NAMES` spells `alehouse` so the catalogue's separate `Ale house` row never
      // matches. Both are a one-word fix that MOVES `sourcesOf` — a declared text shift and a
      // car of its own — so they are pinned here as they stand and reported OPEN. The day
      // either is fixed this arm reds by name, which is the point of pinning them.
      'Multiple monasteries', 'Major monasteries (5-10)', 'Ale house'];
    for (const row of UNREACHABLE) {
      expect(INSTITUTION_ROLES[row], `${row} is carried`).toBeTruthy();
      expect(sourcesOfRowName(row.toLowerCase()), `${row} seats no source today`).toEqual([]);
    }
    // And every OTHER row in the table does lend at least one source, or it is dead weight
    // nobody declared.
    const dead = Object.keys(INSTITUTION_ROLES)
      .filter((row) => !UNREACHABLE.includes(row) && sourcesOfRowName(row.toLowerCase()).length === 0)
      // The force rows are seated by the BUCKETS, not by a name keyword, so they are expected
      // to answer nothing here; they are covered by the seating arm below.
      .filter((row) => !['Citizen militia', 'Household levy', 'Garrison', 'Multiple garrisons',
        'Barracks', 'Town watch', 'Professional city watch'].includes(row))
      // The elder and lordship government rows are seated by TIER and by the fallback.
      .filter((row) => !['Informal elder consensus', 'Head-of-household consensus',
        'Household elder', 'Village elder', 'Village headman', 'Village reeve',
        "Lord's reeve", "Lord's steward", "Lord's appointee", 'Noble governor', 'Royal seat',
        'Palace/government complex', 'Mayor and council', 'Town council', 'City administration',
        'City-state government'].includes(row));
    expect(dead, 'a table row that seats nothing and is not one of the named exceptions')
      .toEqual([]);
  });
});

describe('the fill — number, capital, exclusion (ruling 25 edge (d) and (e))', () => {
  const ROLES = new Map([
    ['hall', [{ role: 'a clerk in the hall', n: 'sg' }]],
    ['guild', [{ role: 'the guilds of the town', n: 'pl' }]],
  ]);

  it('⭐ the verb agrees with the number of the role before it', () => {
    expect(agreeVerb('say', 'sg')).toBe('says');
    expect(agreeVerb('say', 'pl')).toBe('say');
    expect(agreeVerb('hold', 'sg')).toBe('holds');
    expect(agreeVerb('report', 'sg')).toBe('reports');
    expect(agreeVerb('deny', 'sg')).toBe('denies');
    expect(agreeVerb('pay', 'sg')).toBe('pays');
    expect(agreeVerb('push', 'sg')).toBe('pushes');
    expect(agreeVerb('go', 'sg')).toBe('goes');
    expect(agreeVerb('fix', 'sg')).toBe('fixes');
    // The irregulars, both ways.
    expect([agreeVerb('is', 'sg'), agreeVerb('is', 'pl')]).toEqual(['is', 'are']);
    expect([agreeVerb('have', 'sg'), agreeVerb('have', 'pl')]).toEqual(['has', 'have']);
    expect([agreeVerb('do', 'sg'), agreeVerb('do', 'pl')]).toEqual(['does', 'do']);
    // `-ies` only after a CONSONANT + y: 'pay' must not become 'paies'.
    expect(agreeVerb('pay', 'sg')).not.toBe('paies');
  });

  it('⭐ the role is capitalised at a sentence head and nowhere else', () => {
    expect(fillRoleSlots('{hall} {v:put} it so.', { roles: ROLES, printed: new Set(), key: 'k' }))
      .toBe('A clerk in the hall puts it so.');
    expect(fillRoleSlots('At the hall {hall} {v:put} it so.', { roles: ROLES, printed: new Set(), key: 'k' }))
      .toBe('At the hall a clerk in the hall puts it so.');
    // Past a full stop is a head again.
    expect(fillRoleSlots('It is kept. {hall} {v:say} so.', { roles: ROLES, printed: new Set(), key: 'k' }))
      .toBe('It is kept. A clerk in the hall says so.');
    // The plural agrees and capitalises the same way.
    expect(fillRoleSlots('{guild} {v:pay} into it.', { roles: ROLES, printed: new Set(), key: 'k' }))
      .toBe('The guilds of the town pay into it.');
  });

  it('⭐ a text naming NEITHER slot comes back byte-identical — the zero-shift path', () => {
    const plain = 'The survey finds the walls kept and no force under arms behind them.';
    expect(fillRoleSlots(plain, { roles: ROLES, printed: new Set(), key: 'k' })).toBe(plain);
  });

  it('⛔ it FAILS CLOSED: no roles for the source, or a verb with no role in its sentence', () => {
    expect(fillRoleSlots('{watch} {v:say} so.', { roles: ROLES, printed: new Set(), key: 'k' }))
      .toBe(null);
    expect(fillRoleSlots('{hall} {v:say} so. {v:hold} it.', { roles: ROLES, printed: new Set(), key: 'k' }))
      .toBe(null);
    expect(fillRoleSlots('', { roles: ROLES, printed: new Set(), key: 'k' })).toBe(null);
  });

  it('⭐⭐ NO REPEAT ON A PAGE: the exclusion set is carried, and repeats only when exhausted', () => {
    const roster = [
      { role: 'a clerk in the hall', n: 'sg' },
      { role: 'one of the aldermen', n: 'sg' },
      { role: 'the clerks who keep the hall', n: 'pl' },
    ];
    const roles = new Map([['hall', roster]]);
    const printed = new Set();
    const seen = [];
    for (let i = 0; i < 3; i += 1) {
      seen.push(fillRoleSlots('{hall} {v:say} so.', { roles, printed, key: `k${i}` }));
    }
    // Three draws, three DIFFERENT roles — the set emptied the roster exactly once.
    expect(new Set(seen).size, `three draws gave ${JSON.stringify(seen)}`).toBe(3);
    expect(printed.size).toBe(3);
    // The fourth must still speak: an exhausted roster repeats rather than silencing the face.
    const fourth = fillRoleSlots('{hall} {v:say} so.', { roles, printed, key: 'k3' });
    expect(fourth).not.toBe(null);
    expect(seen).toContain(fourth);
  });

  it('⭐ the draw is DETERMINISTIC: one key, one role, over ten thousand repeats', () => {
    const roster = [
      { role: 'a clerk in the hall', n: 'sg' },
      { role: 'one of the aldermen', n: 'sg' },
      { role: 'the clerks who keep the hall', n: 'pl' },
      { role: "the hall's doorkeeper", n: 'sg' },
    ];
    const first = drawRole(roster, null, 'Thornwall::DS-DEF-2::pool::r1::hall::0');
    for (let i = 0; i < 10000; i += 1) {
      expect(drawRole(roster, null, 'Thornwall::DS-DEF-2::pool::r1::hall::0')).toBe(first);
    }
    // And DIFFERENT keys really do spread over the roster, or determinism is just a constant.
    const drawn = new Set();
    for (let i = 0; i < 400; i += 1) drawn.add(drawRole(roster, null, `seed-${i}::hall::0`).role);
    expect(drawn.size, 'the draw reaches every role of a four-role roster').toBe(4);
  });
});

describe('the seating — a role exists only where its row does (ruling 25 edge (b))', () => {
  it('a row lends its roles to exactly the sources that row lends', () => {
    expect(sourcesOfRowName('town hall').sort()).toEqual(['court', 'hall']);
    expect(sourcesOfRowName('craft guilds (5-15)')).toEqual(['guild']);
    expect(sourcesOfRowName('taverns (5-20)')).toEqual(['tavern']);
    expect(sourcesOfRowName('parish church')).toEqual(['register']);
    // The thorp's walk to somebody else's church is not a register that stands here.
    expect(sourcesOfRowName('access to parish church')).toEqual([]);
    expect(sourcesOfRowName('weekly market')).toEqual(['market']);
    expect(sourcesOfRowName('courthouse')).toEqual(['court']);
    expect(sourcesOfRowName('town walls').sort()).toEqual(['gate']);
  });

  it('⭐ a town with no roster at all gets the stranger, with the roads roster behind him', () => {
    for (const nothing of [null, undefined, {}, { institutions: null }]) {
      const roles = rolesOf(/** @type {never} */ (nothing));
      expect([...sourcesOf(/** @type {never} */ (nothing))]).toEqual(['stranger']);
      expect(roles.get('stranger').length, 'the roads roster').toBeGreaterThanOrEqual(6);
      expect(roles.get('stranger').map((r) => r.role)).toContain('a traveller');
      expect(roles.get('stranger').map((r) => r.role)).toContain('a pedlar');
      expect(roles.get('stranger').map((r) => r.role)).toContain('a drover');
    }
  });

  it('⭐⭐ EVERY SEATED SOURCE HAS AT LEAST ONE ROLE — a seated source with none is a silence', () => {
    // The invariant the whole mechanism rests on: `fillRoleSlots` returns null when a named
    // source has no roster, which silences the face. `rolesOf` tops up from the fallback for
    // exactly this reason, and here it is driven over a synthetic town seating all twelve.
    const town = {
      tier: 'village',
      institutions: [
        { name: 'Town hall' }, { name: 'Taverns (5-20)' }, { name: 'Craft guilds (5-15)' },
        { name: 'Parish church' }, { name: 'Town walls' }, { name: 'Weekly market' },
        { name: 'Courthouse' }, { name: 'Town watch' }, { name: 'Garrison' },
        { name: 'Citizen militia' },
      ],
      npcs: [],
    };
    const seated = sourcesOf(/** @type {never} */ (town));
    const roles = rolesOf(/** @type {never} */ (town));
    const silent = [...seated].filter((source) => (roles.get(source) || []).length === 0);
    expect(silent, 'a seated source with no role behind it').toEqual([]);
    expect(seated.size, 'and the synthetic town really did seat most of the vocabulary')
      .toBeGreaterThanOrEqual(8);
  });

  it('⭐ AN OFFICE SPEAKS ONLY WHERE THE TOWN\'S OWN ROSTER PRINTS IT (edge (a))', () => {
    const base = { tier: 'town', institutions: [{ name: 'Town watch' }], npcs: [] };
    const without = rolesOf(/** @type {never} */ (base));
    expect(without.get('watch').map((r) => r.role))
      .not.toContain('the guard captain');
    const withCaptain = rolesOf(/** @type {never} */ (
      { ...base, npcs: [{ role: 'Guard Captain', name: 'Someone' }] }));
    expect(withCaptain.get('watch').map((r) => r.role)).toContain('the guard captain');
    // The indefinite roles are licensed either way — the office is the only gated half.
    expect(without.get('watch').map((r) => r.role)).toContain('one of the watch');
  });

  it('withFaceSources puts the roster, the roles AND the exclusion set on the read', () => {
    const town = { tier: 'town', institutions: [{ name: 'Town hall' }], npcs: [] };
    const read = withFaceSources(/** @type {never} */ (town), { seed: 'x' });
    expect(read.sources instanceof Set).toBe(true);
    expect(/** @type {never} */ (read).roles instanceof Map).toBe(true);
    expect(/** @type {never} */ (read).printedRoles instanceof Set).toBe(true);
    // A read that already carries a roster is left ALONE, exclusion set included, so an inner
    // desk entry shares the outer's page.
    const held = { sources: new Set(['hall']), printedRoles: new Set(['a clerk in the hall']) };
    expect(withFaceSources(/** @type {never} */ (town), held)).toBe(held);
  });
});

describe('⭐ THE ZERO-TEXT-SHIFT PROOF — the mechanism is inert on the shipped corpus', () => {
  it('no shipped variant, spine or face, names an attribution slot', () => {
    const LEAVES = ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith'];
    const slotRe = new RegExp(`\\{(?:${ROLE_SLOTS.join('|')})\\}|\\{v:[a-z]+\\}`);
    /** @type {string[]} */
    const carrying = [];
    let texts = 0;
    for (const leaf of LEAVES) {
      const src = read(`src/data/dossierStateProse/${leaf}.generated.js`);
      for (const line of src.split('\n')) {
        if (!/"(?:text|wordings)"/.test(line) && !/^\s*"/.test(line)) continue;
        texts += 1;
        if (slotRe.test(line)) carrying.push(`${leaf}: ${line.trim().slice(0, 70)}`);
      }
    }
    expect(carrying, 'a shipped sentence naming an attribution slot').toEqual([]);
    expect(texts, 'and the sweep really read the leaves').toBeGreaterThan(2000);
  });
});
