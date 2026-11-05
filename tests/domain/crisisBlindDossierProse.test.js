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
import { declarationAdmits } from '../../src/domain/facts/factVocabulary.js';
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
    for (const [blockId, block] of Object.entries(LEAVES)) {
      if (UNMOUNTED_BLOCKS.includes(blockId)) continue;
      for (const [poolKey, pool] of Object.entries(block.pools || {})) {
        for (const [family, type] of Object.entries(UNDER)) {
          const read = poolReadOf(block, poolKey);
          if (!poolDeniesFamily(pool, family, placeUnder(type), read)) continue;
          const slots = Object.fromEntries(pool.flatMap((v) => v.slots || []).map((slot) => [slot, 'X']));
          // Every other dimension the pool partitions by is answered at both values in turn.
          const dims = { walls: 'no walls', ...crisisDimensionsOf(placeUnder(type)) };
          const eligible = eligibleVariants(pool, { slots, audience: 'dm', dimensions: dims, facts: factsOf(placeUnder(type)), ...read });
          if (eligible.length === 0) mute.push(`${blockId} :: ${poolKey} :: ${family}`);
          for (const v of eligible) if (claimsOf(v.text, placeUnder(type)).length) blind.push(`${blockId} :: ${poolKey} :: v${v.vid}`);
        }
      }
    }
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
