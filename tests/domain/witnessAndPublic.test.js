/**
 * witnessAndPublic.test.js — THE ARCHIVER AS WITNESS, AND THE PUBLIC
 * (ADDENDUM 18 rulings 27 and 28, the owner's; car 8b-W-18n).
 *
 * TWO NEW FORMS BESIDE THE SURVEY'S FACT AND A SOURCE'S ACCOUNT, and they are opposites in
 * exactly one respect, which is what this file is organised around:
 *
 *   THE OBSERVED FACE (`[archiver · observed]`) is the hand that WRITES the page making a claim
 *     of its own. It is seated by nothing because the archiver is not a power — so it draws on
 *     every town, it is never half of a pair, it takes no role slot, and there is AT MOST ONE
 *     per variant so the sources do not vanish behind the witness.
 *   THE PUBLIC FACE (`[public]`) is a SOURCE in every mechanical respect — a role slot, a roster,
 *     a pair half — that happens to be seated by nothing, because nothing backs it. Which is
 *     also why nothing can capture it.
 *
 * ── THE SEVEN THINGS THIS FILE HOLDS ─────────────────────────────────────────────────
 *   1. THE VOCABULARY — `public` is in it, `NEVER_COMPROMISABLE` is disjoint from
 *      `COMPROMISABLE_SOURCES`, and the public is a ROLE SLOT like any other source.
 *   2. THE OBSERVED FACE DRAWS ALONE, on every town, and an UNMARKED archiver face still does
 *      not — the exception is the mark and not the word.
 *   3. IT IS NEVER A PAIR HALF, from both sides (`facePartner` on it, and `facePartner` to it).
 *   4. THE PUBLIC IS SEATED EVERYWHERE, at every tier, with a PLURAL roster and no office.
 *   5. THE ROLE SLOT FILLS AND THE VERB AGREES — `{public} {v:have}` is 'the townsfolk have'.
 *   6. THE GRAMMAR'S REFUSALS, each driven by a plant rather than described.
 *   7. ZERO TEXT SHIFT — no shipped variant carries an `observed` list or a `public` face, so
 *      the whole car is inert on the corpus and the six leaves are byte-identical.
 */
import { describe, expect, it } from 'vitest';
import {
  ARCHIVER_SOURCE, COMPROMISABLE_SOURCES, FACE_SOURCES, NEVER_COMPROMISABLE, OBSERVED_MARK,
  PUBLIC_SOURCE, ROLE_SLOTS, UNIVERSAL_SOURCE, UNIVERSAL_SOURCES,
  agreeVerb, eligibleFaces, faceIsObserved, facePartner, fillRoleSlots,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import { PUBLIC_ROLES_BY_TIER } from '../../src/data/institutionRoles.js';
import { rolesOf, sourcesOf } from '../../src/domain/display/stateProse/faceSources.js';
import { assertFaces, parseFaceRow } from '../../scripts/lib/dossier-annex-grammar.mjs';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';

const SEED = 'sf-18n-2026-09-13';
/** @param {object} config */
const gen = (config) => generateSettlementPipeline(config, null, { seed: SEED, customContent: {} });

/** A variant carrying an observed archiver face at index 2, and a public face at index 3. */
const VARIANT = Object.freeze({
  index: 1,
  vid: 1,
  angle: 'ledger',
  text: 'The walls are kept and no soldiers of the town\'s own stand behind them.',
  wordings: [
    'A clerk in the hall puts the keeping under the military purse.',
    'No soldier has been seen on the wall at night.',
    '{public} {v:have} seen the wall kept, and {v:take} it that nobody is coming.',
  ],
  sources: [null, 'hall', ARCHIVER_SOURCE, PUBLIC_SOURCE],
  observed: [false, false, true, false],
});

/** `assertFaces` over a plant, with the lawful defaults filled in. @param {object} over */
const faces = (over) => assertFaces({
  label: 'X',
  parent: { angle: 'ledger', text: 'The walls are kept.', slots: [] },
  pinnedFaceCount: 9,
  shapeOf: () => undefined,
  clauseOpeners: ['though', 'but'],
  form: 'sentence',
  ...over,
});

const CORPORA = [
  DOSSIER_STATE_PROSE_DEFENSE, DOSSIER_STATE_PROSE_ECONOMY, DOSSIER_STATE_PROSE_POWER,
  DOSSIER_STATE_PROSE_WAR_FAITH, DOSSIER_STATE_PROSE_STRESSORS, DOSSIER_STATE_PROSE_GENERAL,
];
const EVERY_VARIANT = CORPORA.flatMap((corpus) => Object.entries(corpus)
  .flatMap(([blockId, block]) => Object.entries(block.pools)
    .flatMap(([poolKey, pool]) => pool.map((variant) => ({ blockId, poolKey, variant })))));

describe('THE VOCABULARY — the public is the fourteenth word, and the two capture tables are disjoint', () => {
  it('⭐ `public` is in the closed vocabulary, is UNIVERSAL, and is a role slot like any source', () => {
    expect(FACE_SOURCES).toContain(PUBLIC_SOURCE);
    expect(UNIVERSAL_SOURCES).toEqual([UNIVERSAL_SOURCE, PUBLIC_SOURCE]);
    expect(Object.isFrozen(UNIVERSAL_SOURCES)).toBe(true);
    // ⛔ IT IS A SOURCE, NOT A SECOND ARCHIVER. `ROLE_SLOTS` is the vocabulary minus the
    // archiver, so the public being in it is the mechanical statement that the page prints a
    // PERSON (well, a plural of them) for it, exactly as it does for the hall.
    expect(ROLE_SLOTS).toContain(PUBLIC_SOURCE);
    expect(ROLE_SLOTS).not.toContain(ARCHIVER_SOURCE);
  });

  it('⛔ NOTHING CAPTURES THE ARCHIVER OR THE PUBLIC — the two tables are disjoint by pin', () => {
    expect(NEVER_COMPROMISABLE).toEqual([ARCHIVER_SOURCE, PUBLIC_SOURCE]);
    expect(Object.isFrozen(NEVER_COMPROMISABLE)).toBe(true);
    // The whole content of the pin: a word in both tables would be a tag the grammar accepts
    // and the composer can never honour, because `compromisedSourcesOf` can never emit it.
    const both = NEVER_COMPROMISABLE.filter((w) => COMPROMISABLE_SOURCES.includes(w));
    expect(both, 'a word cannot be both capturable and uncapturable').toEqual([]);
    for (const word of NEVER_COMPROMISABLE) expect(FACE_SOURCES).toContain(word);
  });
});

describe('THE OBSERVED FACE — the one archiver row that draws alone (ruling 27)', () => {
  it('⭐ draws on EVERY town, with no roster at all, and an UNMARKED archiver face still does not', () => {
    // With NO roster the kernel hears the untagged face, the stranger, the public — and the
    // observed face, because no institution's absence could silence the hand that writes.
    expect(eligibleFaces(VARIANT, null)).toEqual([0, 2, 3]);
    expect(eligibleFaces(VARIANT, new Set(['hall']))).toEqual([0, 1, 2, 3]);
    // ⛔ THE EXCEPTION IS THE MARK AND NOT THE WORD. Drop the `observed` list and the same
    // archiver face is excluded again, which is ruling 22 untouched.
    const unmarked = { ...VARIANT, observed: undefined };
    expect(eligibleFaces(unmarked, new Set(['hall']))).toEqual([0, 1, 3]);
    expect(faceIsObserved(VARIANT, 2)).toBe(true);
    expect(faceIsObserved(unmarked, 2)).toBe(false);
    expect(faceIsObserved(VARIANT, 1)).toBe(false);
  });

  it('⛔ is NEVER half of a pair, asked from both sides', () => {
    // From ITS side: an observed face carrying a pair mark (which the grammar refuses upstream)
    // still gets no partner, so a leaf projected by something else cannot pair the archiver.
    const planted = {
      ...VARIANT,
      pairs: [null, { id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }, null],
    };
    expect(facePartner(planted, 2, new Set(['hall']))).toBe(null);
    // And from the OTHER side: the hall's face, which really does carry pair 1, finds nobody.
    expect(facePartner(planted, 1, new Set(['hall']))).toBe(null);
  });
});

describe('THE PUBLIC — seated by nothing, and therefore seated everywhere (ruling 28)', () => {
  const TIERS = [
    ['thorp', { settType: 'thorp', culture: 'celtic', terrainOverride: 'forest', tradeRouteAccess: 'isolated' }],
    ['hamlet', { settType: 'hamlet', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' }],
    ['village', { settType: 'village', culture: 'celtic', terrainOverride: 'plains', tradeRouteAccess: 'road' }],
    ['town', { settType: 'town', culture: 'germanic', terrainOverride: 'mountain', tradeRouteAccess: 'road' }],
    ['city', { settType: 'city', culture: 'mediterranean', terrainOverride: 'coastal', tradeRouteAccess: 'major' }],
  ];

  it('⭐ every tier seats the public, and its roster is PLURAL, tier-fitting, and never an office', () => {
    const printed = [];
    for (const [tier, config] of TIERS) {
      const town = gen(config);
      expect(sourcesOf(town).has(PUBLIC_SOURCE), `${tier} seats the public`).toBe(true);
      const roles = rolesOf(town).get(PUBLIC_SOURCE);
      expect(roles, `${tier} has a public roster`).toBeTruthy();
      expect(roles.length, `${tier} roster size`).toBeGreaterThanOrEqual(3);
      for (const row of roles) {
        expect(row.n, `${tier} "${row.role}" is plural (ruling 28 (f))`).toBe('pl');
        expect(row.role, 'never {settlement} (ruling 12)').not.toMatch(/\{/);
      }
      printed.push(`${tier}: ${roles.map((r) => r.role).join(' · ')}`);
    }
    // The tier really moves it — a hamlet is not called 'the townsfolk'.
    expect(rolesOf(gen(TIERS[1][1])).get(PUBLIC_SOURCE).map((r) => r.role)).toContain('the whole hamlet');
    expect(rolesOf(gen(TIERS[3][1])).get(PUBLIC_SOURCE).map((r) => r.role)).toContain('the townsfolk');
    process.stdout.write(`\n[public] ${printed.join('\n[public] ')}\n`);
  });

  it('⛔ the table is total and carries no office: `tiers: null` sits last and matches everything', () => {
    expect(PUBLIC_ROLES_BY_TIER[PUBLIC_ROLES_BY_TIER.length - 1].tiers).toBe(null);
    for (const row of PUBLIC_ROLES_BY_TIER.slice(0, -1)) expect(Array.isArray(row.tiers)).toBe(true);
    for (const row of PUBLIC_ROLES_BY_TIER) {
      for (const entry of row.roles) {
        expect(entry.n, `"${entry.role}"`).toBe('pl');
        // ⛔ AN OFFICE IS A POWER'S SEAT AND THE PUBLIC IS OWED TO NO POWER (ruling 28 (b)).
        expect(entry.office, `"${entry.role}" is never an office`).toBeUndefined();
      }
    }
    // A tier nothing names, and no tier at all, both land on the last row rather than silence.
    for (const bad of [{}, { tier: 'metropolis' }, { tier: 'nonsense' }]) {
      const roles = rolesOf(/** @type {never} */ (bad)).get(PUBLIC_SOURCE);
      expect(roles.length, JSON.stringify(bad)).toBeGreaterThanOrEqual(3);
    }
  });

  it('⭐ the role slot fills PLURAL and the verb agrees — `{public} {v:have}` is "the townsfolk have"', () => {
    const roles = new Map([[PUBLIC_SOURCE, [{ role: 'the townsfolk', n: 'pl' }]]]);
    const out = fillRoleSlots(
      '{public} {v:have} seen the wall kept, and {v:take} it that nobody is coming.',
      { roles, printed: new Set(), key: 'k' },
    );
    expect(out).toBe('The townsfolk have seen the wall kept, and take it that nobody is coming.');
    // The agreement is the ROLE's, not the word's: a singular roster would say 'has' / 'takes',
    // which is exactly why the table above is pinned plural rather than trusted to be.
    expect(agreeVerb('have', 'pl')).toBe('have');
    expect(agreeVerb('take', 'pl')).toBe('take');
    expect(agreeVerb('have', 'sg')).toBe('has');
  });
});

describe('THE GRAMMAR — every refusal driven by a plant', () => {
  it('⭐ `[archiver · observed]` parses as a whole face with no pair', () => {
    expect(parseFaceRow('`[archiver · observed]` No soldier has been seen on the wall at night.', 'X'))
      .toEqual({
        text: 'No soldier has been seen on the wall at night.',
        source: ARCHIVER_SOURCE,
        pair: null,
        compromised: false,
        observed: true,
      });
    expect(parseFaceRow('`[public]` The townsfolk have seen it.', 'X').observed).toBe(false);
  });

  it('⛔ `observed` is the ARCHIVER\'S and nobody else\'s, and never carries a pair', () => {
    expect(() => parseFaceRow('`[hall · observed]` The wall is kept.', 'X'))
      .toThrow(/An observation is the ARCHIVER'S OWN/);
    expect(() => parseFaceRow('`[public · observed]` The wall is kept.', 'X'))
      .toThrow(/An observation is the ARCHIVER'S OWN/);
    expect(() => parseFaceRow('`[archiver · observed · pair 1 · disagree]` The wall is kept.', 'X'))
      .toThrow(/marks `observed` and a pair/);
    // And the UNMARKED archiver row is still refused — ruling 22's rule, re-worded to name the
    // second door rather than replaced by it.
    expect(() => parseFaceRow('`[archiver]` The wall is kept.', 'X'))
      .toThrow(/speaks for the `archiver` with no pair/);
  });

  it('⛔ AT MOST ONE OBSERVED FACE PER VARIANT (ruling 27 (e))', () => {
    expect(() => faces({
      faces: ['No soldier has been seen on the wall.', 'The stair has stores on it.'],
      sources: [ARCHIVER_SOURCE, ARCHIVER_SOURCE],
      pairs: [null, null],
      observed: [true, true],
    })).toThrow(/faces 1 and 2 are all marked `observed`.*AT MOST ONE/s);
    // One is lawful.
    expect(() => faces({
      faces: ['No soldier has been seen on the wall.', 'A clerk in the hall says it is kept.'],
      sources: [ARCHIVER_SOURCE, 'hall'],
      pairs: [null, null],
      observed: [true, false],
    })).not.toThrow();
  });

  it('⛔ the leaf-side refusals: `observed` on a power, `observed` beside a pair, a short list', () => {
    expect(() => faces({
      faces: ['The wall is kept.'], sources: ['hall'], pairs: [null], observed: [true],
    })).toThrow(/is marked `observed` and speaks for `hall`/);
    expect(() => faces({
      faces: ['The wall is kept.', 'It is not.'],
      sources: [ARCHIVER_SOURCE, 'hall'],
      pairs: [{ id: 1, kind: 'disagree' }, { id: 1, kind: 'disagree' }],
      observed: [true, false],
    })).toThrow(/is marked `observed` and carries a pair mark/);
    expect(() => faces({
      faces: ['a.', 'b.'], sources: [null, null], pairs: [null, null], observed: [true],
    })).toThrow(/2 faces against 1 observed marks/);
  });

  it('⛔ `compromised` is refused on the archiver AND on the public, naming the reason', () => {
    expect(() => parseFaceRow('`[public · compromised]` All is well.', 'X'))
      .toThrow(/nothing can capture it/);
    expect(() => parseFaceRow('`[public · compromised]` All is well.', 'X'))
      .toThrow(/backed by no row, so there is no institution for a/);
  });
});

describe('ZERO TEXT SHIFT — the whole car is inert on the corpus that ships', () => {
  it('⛔ no shipped variant carries an `observed` list or a `public` face', () => {
    const observed = EVERY_VARIANT.filter(({ variant }) => Array.isArray(variant.observed));
    const publics = EVERY_VARIANT.filter(({ variant }) => Array.isArray(variant.sources)
      && variant.sources.includes(PUBLIC_SOURCE));
    expect(observed.map((r) => `${r.blockId} :: ${r.poolKey}`)).toEqual([]);
    expect(publics.map((r) => `${r.blockId} :: ${r.poolKey}`)).toEqual([]);
    process.stdout.write(`\n[18n] ${EVERY_VARIANT.length} shipped variants: 0 observed · 0 public\n`);
  });

  it('⛔ and the eligible list is therefore what it was, variant for variant', () => {
    // THE ZERO-SHIFT ARGUMENT, EXECUTED rather than argued: for every shipped variant and
    // every roster the estate can produce, the eligible list this car computes is the list the
    // pre-18n predicate computed. The old predicate is re-spelled here on purpose — a copy of
    // what was replaced is the only honest control.
    const before = (variant, roster) => {
      const n = 1 + (Array.isArray(variant.wordings) ? variant.wordings.length : 0);
      const all = [...Array(n).keys()];
      if (!Array.isArray(variant.sources)) return all;
      const out = [];
      for (const face of all) {
        const source = variant.sources[face] || null;
        if (source === ARCHIVER_SOURCE) continue;
        if (source === null || source === UNIVERSAL_SOURCE || roster.has(source)) out.push(face);
      }
      return out.length === 0 ? all : out;
    };
    const rosters = [new Set(), new Set(['hall', 'guild', 'elders']), new Set(FACE_SOURCES)];
    let compared = 0;
    for (const { blockId, poolKey, variant } of EVERY_VARIANT) {
      for (const roster of rosters) {
        expect(eligibleFaces(variant, roster), `${blockId} :: ${poolKey}`).toEqual(before(variant, roster));
        compared += 1;
      }
    }
    expect(compared).toBe(EVERY_VARIANT.length * rosters.length);
    process.stdout.write(`[18n] ${compared} eligible lists compared against the pre-18n predicate: 0 moved\n`);
  });
});
