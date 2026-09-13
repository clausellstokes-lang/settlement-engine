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
  CUSTOM_ROLE_FIELD, INSTITUTION_ROLES, PUBLIC_ROLES_BY_TIER, ROSTER_OFFICE_TITLES,
  SOURCE_FALLBACK_ROLES,
} from '../../src/data/institutionRoles.js';
import {
  rolesOf, sourcesOf, sourcesOfRowName, withFaceSources,
} from '../../src/domain/display/stateProse/faceSources.js';
import {
  FACE_SOURCES, PUBLIC_SOURCE, ROLE_SLOTS, agreeVerb, drawRole, fillRoleSlots,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { composeStateProse } from '../../src/domain/display/stateProse/composeStateProse.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';

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

  it('⭐⭐ A ROW THAT LENDS TWO SOURCES SPLITS ITS ROLES, and only those two rows do', () => {
    // ⛔ FOUND BY RENDERING THE FIRST RE-CUT POOL, not by reasoning: a `[court]` face drew
    // 'a clerk in the hall', because `COURT_NAMES` seats the court wherever the town's meeting
    // hall stands and the row's roles went to BOTH words. Every entry of a two-source row now
    // declares `for`, and this arm holds both halves of that: which rows are two-source, and
    // that each of their entries is scoped.
    const twoSource = Object.keys(INSTITUTION_ROLES)
      .filter((row) => sourcesOfRowName(row.toLowerCase()).length > 1).sort();
    expect(twoSource, 'the rows that lend two source words').toEqual(['City hall', 'Town hall']);
    for (const row of twoSource) {
      expect(sourcesOfRowName(row.toLowerCase()).sort()).toEqual(['court', 'hall']);
      const unscoped = INSTITUTION_ROLES[row].filter((entry) => !Array.isArray(entry.for));
      expect(unscoped.map((e) => e.role), `${row}: an entry with no \`for\``).toEqual([]);
      // Both halves are really populated, or the split is a filter that empties one source.
      for (const source of ['hall', 'court']) {
        expect(INSTITUTION_ROLES[row].filter((e) => e.for.includes(source)).length,
          `${row} → ${source}`).toBeGreaterThanOrEqual(4);
      }
    }
    // A one-source row declares no `for` at all: scoping where nothing forks is dead syntax.
    const overScoped = Object.entries(INSTITUTION_ROLES)
      .filter(([row]) => !twoSource.includes(row))
      .flatMap(([row, roles]) => roles.filter((e) => Array.isArray(e.for)).map((e) => `${row}: ${e.role}`));
    expect(overScoped, 'a `for` on a row that lends one source or none').toEqual([]);
    // AND THE COURT REALLY DOES SPEAK AS THE COURT on a town whose only court row is the hall.
    const town = { tier: 'town', institutions: [{ name: 'Town hall' }], npcs: [] };
    const roles = rolesOf(/** @type {never} */ (town));
    expect(roles.get('court').map((r) => r.role)).toContain('a clerk of the court');
    expect(roles.get('court').map((r) => r.role)).not.toContain('a clerk in the hall');
    expect(roles.get('hall').map((r) => r.role)).toContain('a clerk in the hall');
    expect(roles.get('hall').map((r) => r.role)).not.toContain('a bailiff');
  });

  it('⛔ THE INSTRUMENT\'S RE-SPELLING IS HELD TO THE KERNEL BY NAME (arm D, entryWalker.js)', () => {
    // The wave gate's arm D asks "does the variant declare this slot?" — a question the
    // attribution slots have no answer to, because the spine has no source and cannot declare
    // one. Un-amended it convicted all nine re-cut faces and turned the pool's verdict from
    // WITHHELD to FAIL. `entryWalker.js` is the prose ISLAND and may not import a display
    // leaf, so its list is RE-SPELLED — and held here, the same cure faceSources.js keeps for
    // the generator's keyword lists.
    const walker = read('src/domain/prose/entryWalker.js');
    const missing = ROLE_SLOTS.filter((slot) => !walker.includes(`'${slot}'`));
    expect(missing, 'an attribution slot the walker\'s re-spelling does not carry').toEqual([]);
    expect(walker).toMatch(/ATTRIBUTION_SLOTS/);
    // ⭐ RE-FROZEN AT CAR 8b-W-18n: thirteen, the public joining the twelve (ADDENDUM 18
    // ruling 28). This count is the whole point of the arm — it is what turns 'the walker
    // carries every word' from a check into a RATCHET, so a fourteenth added to the kernel
    // and forgotten here reds by number even if the walker happened to spell it.
    expect(ROLE_SLOTS.length, 'and the kernel list is the thirteen seatable sources').toBe(13);
  });

  it('the fallback roster covers every seatable source, and only those', () => {
    const covered = SOURCE_FALLBACK_ROLES.map((row) => row.source).sort();
    // ⭐ RE-FROZEN AT CAR 8b-W-18n (ADDENDUM 18 ruling 28). The PUBLIC is a role slot like any
    // other and it is NOT in the fallback roster, on purpose: the fallback is where a source
    // lands when the catalogue rows that back it carry no entry, and the public has no
    // catalogue row to fall through FROM. What it is called is a fact about the TIER, so it is
    // seated from `PUBLIC_ROLES_BY_TIER` in `rolesOf` directly. The arm below proves the
    // seating actually happened, which is the thing this arm was protecting.
    expect(covered).toEqual([...ROLE_SLOTS].filter((w) => w !== PUBLIC_SOURCE).sort());
    expect(ROLE_SLOTS).toContain(PUBLIC_SOURCE);
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
    // ⭐ RE-FROZEN AT CAR 8b-W-18o-r. `fillRoleSlots` no longer MUTATES the page's set — it
    // REPORTS what it drew through `claimed` and the caller commits when its piece lands (the
    // research reconciliation's slice E). The page behaviour this arm protects is unchanged;
    // what moved is who commits, and the arm below is the reason it had to.
    for (let i = 0; i < 3; i += 1) {
      const claimed = [];
      seen.push(fillRoleSlots('{hall} {v:say} so.', { roles, printed, claimed, key: `k${i}` }));
      for (const role of claimed) printed.add(role);
    }
    // Three draws, three DIFFERENT roles — the set emptied the roster exactly once.
    expect(new Set(seen).size, `three draws gave ${JSON.stringify(seen)}`).toBe(3);
    expect(printed.size).toBe(3);
    // The fourth must still speak: an exhausted roster repeats rather than silencing the face.
    const fourth = fillRoleSlots('{hall} {v:say} so.', { roles, printed, key: 'k3' });
    expect(fourth).not.toBe(null);
    expect(seen).toContain(fourth);
  });

  it('⛔⛔ A DRAW THAT IS NOT COMMITTED CONSUMES NOTHING — the dropped piece defect, driven', () => {
    // THE DEFECT THIS ENDS. `fillRoleSlots` used to add each role to `printed` as it drew, so a
    // face whose piece was then DROPPED (an unfilled `{slot}` elsewhere makes `fillSlots` answer
    // null) still consumed a person from the page's roster. The next face, on another desk of
    // the same page, drew somebody else because of a sentence the reader never saw.
    const roster = [
      { role: 'a clerk in the hall', n: 'sg' },
      { role: 'one of the aldermen', n: 'sg' },
    ];
    const roles = new Map([['hall', roster]]);
    const printed = new Set();
    const dropped = [];
    const first = fillRoleSlots('{hall} {v:say} so.', { roles, printed, claimed: dropped, key: 'k0' });
    expect(first).not.toBe(null);
    expect(dropped.length, 'the call reports what it drew').toBe(1);
    expect(printed.size, 'and commits NOTHING on its own').toBe(0);
    // The caller drops this piece, so it commits nothing. The next face draws as if the first
    // had never happened — same key, same role, every time.
    const again = [];
    expect(fillRoleSlots('{hall} {v:say} so.', { roles, printed, claimed: again, key: 'k0' }))
      .toBe(first);
    expect(again).toEqual(dropped);
  });

  it('⛔ but a FACE naming two sources still cannot draw one person twice', () => {
    // The one thing the old mutation gave for free and that had to be kept: the candidate
    // filter is `printed` UNION what THIS call has claimed so far.
    const roster = [
      { role: 'a clerk in the hall', n: 'sg' },
      { role: 'one of the aldermen', n: 'sg' },
    ];
    const roles = new Map([['hall', roster]]);
    const claimed = [];
    const out = fillRoleSlots('{hall} {v:say} so, and {hall} {v:agree}.', {
      roles, printed: new Set(), claimed, key: 'k',
    });
    expect(out).not.toBe(null);
    expect(claimed.length).toBe(2);
    expect(new Set(claimed).size, `two slots drew ${JSON.stringify(claimed)}`).toBe(2);
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
      // ⭐ RE-FROZEN AT CAR 8b-W-18n: the public is seated by nothing, so a settlement that IS
      // nothing still seats it — and it still has a roster, because `tiers: null` matches.
      expect([...sourcesOf(/** @type {never} */ (nothing))]).toEqual(['stranger', PUBLIC_SOURCE]);
      expect(roles.get(PUBLIC_SOURCE).length, 'the public roster is total').toBeGreaterThanOrEqual(3);
      expect(roles.get(PUBLIC_SOURCE).every((r) => r.n === 'pl'), 'plural only').toBe(true);
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

describe('⛔⛔ THE READ CARRIES THE ROLES — the trap this car fell into, driven end to end', () => {
  const KEY = 'Invasion & War: walls with NO force';

  /** The shipped pool, composed through the real composer on a town that seats every source. */
  const compose = (seed, options) => composeStateProse(DOSSIER_STATE_PROSE_DEFENSE, 'DS-DEF-2', {
    slots: { settlement: 'Thornwall' },
    seed,
    audience: 'dm',
    spineKey: KEY,
    candidates: [],
    turns: [],
    ...options,
  });
  const TOWN = {
    tier: 'town',
    institutions: [
      { name: 'Town hall' }, { name: 'Taverns (5-20)' }, { name: 'Craft guilds (5-15)' },
      { name: 'Parish church' }, { name: 'Town walls' }, { name: 'Weekly market' },
      { name: 'Courthouse' }, { name: 'Town watch' },
    ],
    npcs: [],
  };

  it('⛔⛔ A FACE THAT DRAWS REALLY SPEAKS: the pool renders a ROLE, and never a silence', () => {
    // ⛔ THE DEFECT THIS ARM EXISTS FOR, recorded because it was nearly shipped. The composer's
    // `read` is a CLOSED object built key by key, not a spread of `options`, so `roles` and
    // `printedRoles` — added to `withFaceSources` in this same car — were dropped on the floor.
    // Every face that drew then failed closed: `fillRoleSlots` returned null, `fillSlots` turned
    // the empty raw into silence, and the WHOLE RUNG vanished. It looked like nothing was wrong,
    // because the towns that survived were exactly the towns whose draw landed on the spine, and
    // a page of spine lines reads perfectly well. Found by RENDERING the pool, not by a test.
    const read = withFaceSources(/** @type {never} */ (TOWN), {});
    let spoke = 0;
    let silent = 0;
    const roles = new Set();
    for (let i = 0; i < 120; i += 1) {
      const unit = compose(`role-seed-${i}`, read);
      if (unit === null) { silent += 1; continue; }
      for (const piece of unit.pieces) if (piece.face > 0) spoke += 1;
      // A rendered attribution slot is the failure this whole mechanism exists to prevent.
      expect(unit.text).not.toMatch(/\{[a-z]/);
      // The role is drawn, so the SAME face on two seeds is two different sentences: count
      // the distinct openings of the faces that drew, which is the variance ruling 25 is for.
      if (unit.pieces.some((piece) => piece.face > 0)) {
        roles.add(unit.text.split(/\s+/).slice(0, 5).join(' '));
      }
    }
    expect(silent, 'a seed on which the pool went silent').toBe(0);
    expect(spoke, 'the faces that drew past the spine').toBeGreaterThan(30);
    expect(roles.size, `the distinct role openings seen: ${[...roles].join(' | ')}`)
      .toBeGreaterThanOrEqual(6);
  });

  it('⛔ AND WITHOUT THE ROLES IT FAILS CLOSED rather than printing a slot', () => {
    // The other half of the same fact: a read that skipped `withFaceSources` must SILENCE a
    // face that names a slot, never render `{hall}`. Handed the roster but no roles, the pool
    // goes quiet on exactly the seeds whose draw lands on a sourced face — which is the
    // behaviour that hid the defect above, asserted here so it can never hide it again.
    const sources = new Set(['stranger', 'hall', 'guild', 'tavern', 'gate', 'watch', 'court', 'market', 'register']);
    let silent = 0;
    for (let i = 0; i < 120; i += 1) {
      const unit = compose(`role-seed-${i}`, { sources });
      if (unit === null) { silent += 1; continue; }
      expect(unit.text, 'a raw attribution slot reached the page').not.toMatch(/\{[a-z]/);
    }
    expect(silent, 'the seeds a roles-less read silences').toBeGreaterThan(20);
  });
});

describe('⭐ WHERE THE ATTRIBUTION SLOTS SHIP — one pool, named; everywhere else inert', () => {
  it('⭐⭐ ONLY DS-DEF-2\'s NINE RE-CUT FACES name an attribution slot; the other five leaves carry none', () => {
    // The mechanism landed at car 8b-W-18l with a global zero-shift arm, because no shipped
    // sentence named a slot. The re-cut of `Invasion & War: walls with NO force` lawfully
    // ended that, so the arm is RE-PINNED rather than deleted: the faces are counted, the
    // other five leaves are asserted empty, and one more landing reds here by name.
    // ⭐ RE-FROZEN AGAIN AT CARS 8b-W-18n/18o: TEN, not nine. The pool gained TWO faces and
    // only ONE of them names a slot — the `[public]` face carries `{public}` like any source,
    // and the `[archiver · observed]` face carries NONE, because the archiver is not a source
    // and has no roster to draw a person from (ruling 27). The count moving by one where two
    // faces landed is the observation's defining property, measured.
    const LEAVES = ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith'];
    const slotRe = new RegExp(`\\{(?:${ROLE_SLOTS.join('|')})\\}|\\{v:[a-z]+\\}`);
    /** @type {string[]} */
    const carrying = [];
    let texts = 0;
    for (const leaf of LEAVES) {
      const src = read(`src/data/dossierStateProse/${leaf}.generated.js`);
      for (const line of src.split('\n')) {
        if (!/^\s*"/.test(line)) continue;
        texts += 1;
        if (slotRe.test(line)) carrying.push(`${leaf}: ${line.trim()}`);
      }
    }
    // The five leaves that carry nothing at all — the zero-shift arm that survives.
    expect(carrying.filter((row) => !row.startsWith('defense: ')),
      'an attribution slot outside the defense leaf').toEqual([]);
    // And the defense leaf carries EXACTLY the nine re-cut faces, one per source.
    const faces = carrying.map((row) => row.replace(/^defense: /, '').replace(/^"|",?$/g, ''));
    expect(faces.length, 'the re-cut faces that name a slot').toBe(10);
    const bySlot = ROLE_SLOTS.filter((slot) => faces.some((f) => f.includes(`{${slot}}`)));
    // ⭐ THE PUBLIC JOINS THEM AT CARS 8b-W-18n/18o (ruling 28) — a source in every mechanical
    // respect, so it names a slot like the other eight. The ARCHIVER does not appear here and
    // cannot: it is not in `ROLE_SLOTS` at all.
    expect(bySlot.sort(), 'the sources the re-cut gave a voice')
      .toEqual(['court', 'elders', 'gate', 'guild', 'hall', 'public', 'stranger', 'tavern', 'watch']);
    // Every one of them carries at least one verb slot, or the attribution has no verb to
    // agree with and the re-cut left a class word standing somewhere.
    expect(faces.filter((f) => !/\{v:[a-z]+\}/.test(f)), 'a re-cut face with no verb slot')
      .toEqual([]);
    expect(texts, 'and the sweep really read the leaves').toBeGreaterThan(2000);
  });
});
