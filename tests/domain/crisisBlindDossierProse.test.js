/**
 * F12 CRISIS-BLIND PROSE (rung 2, 2026-11-04), unit 2: the cure through the desks' state
 * selection.
 *
 * A dossier-state variant that asserts a calm an active crisis denies carries the family's
 * `no …` mark (`crisis/crisisFacts.js :: CRISIS_FAMILIES`; the kernel's five crisis
 * dimensions, `stateProseKernel.js :: STATE_MARK_DIMENSIONS`), and every desk answers the five
 * at its entry (`crisisAnswered`). A pool the marks would leave mute under a crisis gains a
 * crisis-safe variant carrying the crisis word, so no state goes silent and the eligible set
 * of a crisis-free place is untouched (its draw is index-stable, law 6).
 *
 * The births are rung 2's §3c seeds, born the soak's way (`scripts/audit/soak-review/corpus.mjs
 * :: birth`): `soak1k-5404` (city, under siege) printed DS-DEF-1's "nothing presses" line,
 * `soak1k-3600` (thorp, under siege) DS-DEF-11's "safety is its neighbours" line, `soak1k-2`
 * (village, occupied) DS-DEF-2's "never needed to think about what is outside it" line. The
 * claims are read by the instrument itself (`coherence/crisisBlindFindings.js`), never quoted
 * (`tests/lint/proseDrawnAnchors.walker.test.js`).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { crisisBlindFindings } from '../../src/domain/coherence/crisisBlindFindings.js';
import { CRISIS_FAMILIES, crisisAnswered, crisisDimensionsOf } from '../../src/domain/crisis/crisisFacts.js';
import { eligibleVariants, STATE_MARK_DIMENSIONS, variantFactDeclaration } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { atomHolds, declarationAdmits, declarationOfTags, FACT_DIMENSIONS, parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import {
  defensePostureProse, defenseThreatProse, defenseWallRationaleProse,
} from '../../src/domain/display/stateProse/defenseStateProse.js';
import { UNMOUNTED_BLOCKS } from '../../src/domain/display/stateProse/dossierMounts.js';
import { tierNounFor } from '../../src/domain/display/stateProse/weaveBlock.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';

const LEAVES = Object.freeze({
  ...DOSSIER_STATE_PROSE_POWER, ...DOSSIER_STATE_PROSE_GENERAL, ...DOSSIER_STATE_PROSE_ECONOMY,
  ...DOSSIER_STATE_PROSE_STRESSORS, ...DOSSIER_STATE_PROSE_WAR_FAITH, ...DOSSIER_STATE_PROSE_DEFENSE,
});

/** Every family's crisis types, one representative each, for a place under it. */
const UNDER = Object.freeze({
  threat: 'under_siege', hunger: 'famine', succession: 'succession_void', unrest: 'insurgency', crisis: 'indebted',
});

/** @param {string} type */
const placeUnder = (type) => ({ stress: [{ type }] });

/** Every string a desk returned, flattened. @param {unknown} v @returns {string[]} */
function stringsOf(v) {
  if (typeof v === 'string') return [v];
  if (!v || typeof v !== 'object') return [];
  return Object.values(v).flatMap(stringsOf);
}

/**
 * The pool's own brace group (CENSUS-5): a pool opted into the crisis dimension reads silence as
 * calm, and its pool-level atoms gate it, exactly as the composer hands them to the kernel.
 * @param {any} block @param {string} poolKey
 */
const poolReadOf = (block, poolKey) => {
  const meta = (block.poolMeta || {})[poolKey] || {};
  return { crisisScoped: meta.crisisScoped === true, ...(Array.isArray(meta.declares) && meta.declares.length ? { poolDeclares: meta.declares } : {}) };
};

/**
 * Does this variant carry its denial of the family? Either F12's kernel mark (`no threat`, …),
 * or (CENSUS-5) a census crisis declaration the ONE rule refuses under a place in that family —
 * `no crisis: threat, unrest`, or silence in a `{crisis-scoped}` pool. A refusal for a non-crisis
 * atom (a gate the minimal place lacks) is not a denial of the family.
 */
const deniesFamily = (variant, family, place, read) => (variant.marks || []).includes(CRISIS_FAMILIES[family].off)
  || declarationAdmits(variantFactDeclaration(variant), factsOf(place), { crisisScoped: read.crisisScoped })
    .refused.some((atom) => /^(no )?crisis/.test(atom));

/** Does this pool carry a crisis denial in either channel? */
const poolDeniesFamily = (pool, family, place, read) => read.crisisScoped || pool.some((v) => deniesFamily(v, family, place, read));

/**
 * ⭐ THE POOL'S OWN RECORD (the chair's ruling (2) of 2026-11-07 06:1x, ODQ §934.105): the place
 * under test is the stress PLUS every fact the pool declares it reads, made to hold — each
 * presence atom a line or the pool's brace group NEEDS made true (the institution on the roster,
 * the value set), each presence atom it EXCLUDES and no line needs answered false (fail-closed:
 * an unanswered exclusion refuses) — so "mute" means mute on a record where every fact the pool
 * declares holds, which is a real finding, and never "the minimal place lacked a gate".
 * The crisis dimension is the stress under test and is never touched.
 *
 * One setter per FACT HOME (`factsOf.js`), each checked by the vocabulary's own reader
 * (`atomHolds`) after it writes: a setter that cannot make its atom read as wanted is a bug here,
 * and reds by name. A COMPOUND fact — a composite of other homes (`guardPresence`, `soldiers`,
 * `commander`, `sacredHouse`, `clergy`, `guild`) or a per-line context fact (`other npc`) — has
 * no setter: which constituent holds is a choice the record would make, not the pool, so it is
 * not synthesised generically and the pool that reads one is SET ASIDE below, by name.
 */
const BAND_FIELD = Object.freeze({
  tier: (f, v) => ({ ...f, tier: v }),
  population: (f, v) => ({ ...f, populationBand: v }),
  'magic level': (f, v) => ({ ...f, magic: { ...f.magic, level: v } }),
  food: (f, v) => ({ ...f, famine: { ...f.famine, band: v } }),
  prosperity: (f, v) => ({ ...f, prosperity: v }),
  crime: (f, v) => ({ ...f, crime: v }),
  stores: (f, v) => ({ ...f, storesMonths: v }),
});
const withInstitution = (f, kind, want) => {
  const prior = f.hasInstitution;
  return { ...f, hasInstitution: (k) => (k === kind ? want : prior(k)) };
};
const otherKey = (keys, key) => keys.find((k) => k !== key);
/** @type {Record<string, (f: any, atom: any, want: boolean) => any>} */
const PRESENCE_SETTER = {
  ...Object.fromEntries(['walls', 'palisade', 'gate', 'watch', 'militia', 'garrison', 'hospital', 'healer', 'mercenary']
    .map((k) => [k, (f, _a, want) => ({ ...f, defence: { ...f.defence, [k]: want } })])),
  market: (f, _a, want) => ({ ...f, market: want }),
  ...Object.fromEntries(['navigable', 'coast', 'river'].map((k) => [k, (f, _a, want) => ({ ...f, water: { ...f.water, [k]: want } })])),
  port: (f, _a, want) => ({ ...f, route: want ? 'port' : 'road' }),
  magic: (f, _a, want) => ({ ...f, magic: { ...f.magic, functions: want } }),
  temple: (f, _a, want) => withInstitution(f, 'temple', want),
  docks: (f, _a, want) => withInstitution(f, 'docks', want),
  institution: (f, a, want) => withInstitution(f, a.key, want),
  famine: (f, _a, want) => ({ ...f, famine: { ...f.famine, famine: want } }),
  starving: (f, _a, want) => ({ ...f, famine: { ...f.famine, starvingAllowed: want } }),
  ...Object.fromEntries(['fish', 'grain', 'game', 'livestock'].map((k) => [k, (f, _a, want) => ({
    ...f, foodSources: [...(f.foodSources || []).filter((x) => x !== k), ...(want ? [k] : [])] })])),
  imports: (f, _a, want) => ({ ...f, imports: want ? ['X'] : [] }),
  exports: (f, _a, want) => ({ ...f, exports: want ? ['X'] : [] }),
  priest: (f, _a, want) => ({ ...f, faith: { ...f.faith, seniorCleric: want ? { name: 'X' } : null } }),
  'organised crime': (f, _a, want) => ({ ...f, crime: want ? 'organized' : 'none' }),
  culture: (f, a, want) => ({ ...f, culture: want ? a.key : otherKey(FACT_DIMENSIONS.culture.keys, a.key) }),
  ruler: (f, a, want) => ({ ...f, rulerKind: want ? a.key : otherKey(FACT_DIMENSIONS.ruler.keys, a.key) }),
  war: (f, a, want) => ({ ...f, warState: want ? a.key : otherKey(FACT_DIMENSIONS.war.keys, a.key) }),
  migration: (f, a, want) => ({ ...f, migration: want ? { active: true, direction: a.key } : { active: false } }),
  terrain: (f, a, want) => ({ ...f, terrain: want ? a.key : otherKey(FACT_DIMENSIONS.terrain.keys, a.key) }),
  route: (f, a, want) => ({ ...f, route: want ? a.key : otherKey(FACT_DIMENSIONS.route.keys, a.key) }),
};
/** The compound facts: no setter, by the ruling's own exception. */
const COMPOUND_FACTS = Object.freeze(['guardPresence', 'soldiers', 'commander', 'sacredHouse', 'clergy', 'guild', 'other npc']);

/** Every non-crisis atom the pool declares it reads: its brace group's and each line's. @returns {{ needs: Set<string>, excludes: Set<string> }} */
const poolReads = (pool, read) => {
  const needs = new Set(); const excludes = new Set();
  const decls = [declarationOfTags(read.poolDeclares || []), ...pool.map((v) => variantFactDeclaration(v))];
  for (const d of decls) {
    for (const a of d.needs) if (parseAtom(a)?.dimension !== 'crisis') needs.add(a);
    for (const a of d.excludes) if (parseAtom(a)?.dimension !== 'crisis') excludes.add(a);
  }
  return { needs, excludes };
};

/** The compound reads a pool declares, as written. */
const compoundReadsOf = (pool, read) => {
  const { needs, excludes } = poolReads(pool, read);
  return [...needs, ...[...excludes].map((a) => `no ${a}`)].filter((w) => COMPOUND_FACTS.includes(parseAtom(w.replace(/^no /, ''))?.dimension));
};

/**
 * The facts of the place under `type` with every synthesisable read of the pool made to hold.
 * Needs win over excludes (a pool whose lines need X and exclude X across two lines is given X).
 */
const factsForPool = (pool, read, type) => {
  const base = factsOf(placeUnder(type));
  /** @type {any} */ let f = { ...base, hasInstitution: base.hasInstitution, hasOtherNpc: base.hasOtherNpc };
  const { needs, excludes } = poolReads(pool, read);
  const set = (word, want) => {
    const atom = parseAtom(word);
    if (!atom || COMPOUND_FACTS.includes(atom.dimension)) return;
    const dim = FACT_DIMENSIONS[atom.dimension];
    if (dim.shape === 'band') {
      const write = BAND_FIELD[atom.dimension];
      const values = dim.numeric ? [atom.value - 1, atom.value, atom.value + 1] : dim.order;
      const hit = values.find((v) => atomHolds(word, write(f, v)) === true);
      if (hit !== undefined) f = write(f, hit);
    } else {
      f = PRESENCE_SETTER[atom.dimension](f, atom, want);
    }
    expect(atomHolds(word, f), `the synthesised record must answer \`${word}\` ${want}`).toBe(want);
  };
  for (const a of excludes) if (!needs.has(a)) set(a, false);
  for (const a of needs) set(a, true);
  return f;
};

/**
 * THE POOLS SET ASIDE, each with the read the synthesis cannot make hold, counted: 1. The
 * ruling's mechanism is the sibling arms' (`UNMOUNTED_BLOCKS`): a named list skipped by `continue`,
 * never a predicate that could widen silently; and the arm reds if a listed pool stops being mute.
 * At the ruling (2026-11-07) NO pool is mute for want of a COMPOUND read (the synthesis measured
 * 46 mute cells -> 8 with every declared fact held; none of the 8 reads a compound fact). The one
 * entry is not a compound read and is listed for the chair's veto: DS-STR-1's no-banner rung is
 * KEYED on the crisis's own absence (the owner's order of 2026-09-17: it composes only on a town
 * with NO crisis banner, R-DST-K), so no record holds its key and a stress together.
 * @type {Readonly<Record<string, string>>}
 */
const SET_ASIDE = Object.freeze({
  "DS-STR-1 :: Overview's own section framing": 'the empty `stress[]` (the no-banner rung; R-DST-K)',
});

/** The instrument's claims about one variant's text under one place. */
const claimsOf = (text, place) => crisisBlindFindings(place, { page: text });

/** @type {Record<number, any>} */
const BIRTHS = {};
beforeAll(async () => {
  await ensureLaws();
  for (const i of [5404, 3600, 2]) BIRTHS[i] = birth(i).settlement;
}, 180_000);

describe('F12 · the crisis dimensions on the state-prose desks', () => {
  it('the five crisis families are the kernel\'s five crisis dimensions, word for word', () => {
    for (const [family, def] of Object.entries(CRISIS_FAMILIES)) {
      expect(STATE_MARK_DIMENSIONS[family]).toEqual([def.on, def.off]);
    }
  });

  it('crisisAnswered keeps every dimension the caller answered and adds the five', () => {
    const answered = crisisAnswered(placeUnder('under_siege'), { seed: 's', dimensions: { walls: 'no walls' } });
    expect(answered).toMatchObject({ seed: 's', dimensions: { walls: 'no walls', ...crisisDimensionsOf(placeUnder('under_siege')) } });
  });

  it('every mounted variant that makes a calm claim carries the mark of the family it denies', () => {
    const unmarked = [];
    let claims = 0;
    for (const [blockId, block] of Object.entries(LEAVES)) {
      if (UNMOUNTED_BLOCKS.includes(blockId)) continue;
      for (const [poolKey, pool] of Object.entries(block.pools || {})) {
        for (const variant of pool) {
          for (const [family, type] of Object.entries(UNDER)) {
            const hit = claimsOf(variant.text, placeUnder(type)).find((f) => f.family === family);
            if (!hit) continue;
            claims += 1;
            if (!deniesFamily(variant, family, placeUnder(type), poolReadOf(block, poolKey))) unmarked.push(`${blockId} :: ${poolKey} :: v${variant.vid} :: ${family}`);
          }
        }
      }
    }
    expect(unmarked).toEqual([]);
    // Non-vacuity, measured at the cure: 29 variants carry a claim (some read by more than one family's representative).
    expect(claims).toBeGreaterThanOrEqual(29);
  });

  it('a pool the marks partition is never mute under a crisis, and never draws a calm claim there', () => {
    const mute = [];
    const blind = [];
    const setAsideHeard = [];
    for (const [blockId, block] of Object.entries(LEAVES)) {
      if (UNMOUNTED_BLOCKS.includes(blockId)) continue;
      for (const [poolKey, pool] of Object.entries(block.pools || {})) {
        for (const [family, type] of Object.entries(UNDER)) {
          const read = poolReadOf(block, poolKey);
          if (!poolDeniesFamily(pool, family, placeUnder(type), read)) continue;
          const slots = Object.fromEntries(pool.flatMap((v) => v.slots || []).map((slot) => [slot, 'X']));
          // Every other dimension the pool partitions by is answered at both values in turn.
          const dims = { walls: 'no walls', ...crisisDimensionsOf(placeUnder(type)) };
          const eligible = eligibleVariants(pool, { slots, audience: 'dm', dimensions: dims, facts: factsForPool(pool, read, type), ...read });
          if (`${blockId} :: ${poolKey}` in SET_ASIDE) {
            if (eligible.length > 0) setAsideHeard.push(`${blockId} :: ${poolKey} :: ${family}`);
            continue;
          }
          const compound = compoundReadsOf(pool, read);
          if (eligible.length === 0) mute.push(`${blockId} :: ${poolKey} :: ${family}${compound.length ? ` (reads the compound ${compound.join(' · ')}: set it aside by name)` : ''}`);
          for (const v of eligible) if (claimsOf(v.text, placeUnder(type)).length) blind.push(`${blockId} :: ${poolKey} :: v${v.vid}`);
        }
      }
    }
    // The set-aside pools are each MUTE under every family they deny, or the entry is stale.
    expect(setAsideHeard, 'a set-aside pool now yields a line: lift it from SET_ASIDE').toEqual([]);
    // Measured at the ruling (2026-11-07): on the minimal place 46 mute cells, all but DS-STR-1's
    // and DS-CND-1's the fixture's lie (a market, a temple, a watch, a value the pool reads, absent);
    // on the pool's own record 8, of which DS-STR-1's 5 are set aside above and DS-CND-1 boom's 3
    // (threat, hunger, crisis: every line denies all three, and the key reads only the archetype)
    // were a REAL finding, owed a crisis-safe line. 8 -> 5 at the chair's ruling of 2026-11-07
    // 06:5x (ODQ §934.105): the boom pool's v4 `[street · crisis: any]`, which reads only the
    // archetype and the name, prints under every crisis; the 5 left are DS-STR-1's, set aside.
    expect({ mute, blind }).toEqual({ mute: [], blind: [] });
  });

  it('the §3c births print no calm claim under their crisis, and still print the block', () => {
    const read = {
      5404: (s, o) => defensePostureProse(s, o),
      3600: (s, o) => defenseWallRationaleProse(s, o),
      2: (s, o) => defenseThreatProse(s, o),
    };
    const blind = {};
    const crises = {};
    for (const [i, desk] of Object.entries(read)) {
      const s = BIRTHS[Number(i)];
      const opts = { seed: String(s._seed ?? s.id ?? ''), audience: 'dm', tierNoun: tierNounFor(s.tier) };
      const text = stringsOf(desk(s, opts)).join('\n');
      expect(text.length, `soak1k-${i} printed nothing`).toBeGreaterThan(0);
      blind[`soak1k-${i}`] = crisisBlindFindings(s, { defense: text }).map((f) => f.sentence);
      crises[`soak1k-${i}`] = (Array.isArray(s.stress) ? s.stress : [s.stress]).map((x) => x?.type);
    }
    // The births are what §3c read: an occupation, a siege (with a betrayal), a siege.
    expect(crises).toEqual({ 'soak1k-2': ['occupied'], 'soak1k-3600': ['under_siege', 'recently_betrayed'], 'soak1k-5404': ['under_siege'] });
    expect(blind).toEqual({ 'soak1k-2': [], 'soak1k-3600': [], 'soak1k-5404': [] });
  });
});
