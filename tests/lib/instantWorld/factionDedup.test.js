/**
 * tests/lib/instantWorld/factionDedup.test.js — the faction-name de-clunk guard.
 *
 * PEOPLE-5A (2026-11-07, the chair's ruling M-2) RE-WIRED THIS FILE: the world-scoped dedup pass
 * is DELETED with the NPC grouping it renamed (a no-op since GS-2: every group was named for one
 * of its own powers, which the pass never renamed). Its unit, compose and swap arms leave with it;
 * the de-clunk guard over the candidate space (AMENDMENT A) stays. History of the pass below.
 *
 * Guards the CONTENT-GT-DOSSIER fix for the survey's worst thin-content surface: a
 * composed realm must not show the same FACTION_DESCRIPTORS name on two members. The
 * pass is a pure, rng-free rename over the already-minted bundle, so it must (a) leave
 * no cross-settlement collisions, (b) keep every reference consistent (conflicts parties/
 * desc), (c) be deterministic per seed, and (d) touch NOTHING in a single-settlement
 * (non-composed) generation.
 */
import { describe, it, expect } from 'vitest';
import {
  candidateNames, hasBannedStack,
  COLLECTIVE_NOUNS, DISTINGUISH_MODIFIERS, FACTION_DESCRIPTORS_EXTRA,
} from '../../../src/lib/instantWorld/factionDedup.js';
// ⭐ THE CREATE BOUNDARY'S ASYNC PRELUDE — A TEST IS A CALLER LIKE ANY OTHER
// (2026-09-08, lane LIGHT car 1b). `composeInstantWorld` is a classified BIRTH and
// is SYNCHRONOUS by design, so it cannot load the lazy payload the law it mints
// needs: since the living-content dial was lit, every world it mints is a v2 world,
// and the seam THROWS rather than degrading when the roster payload was never
// loaded. Production awaits `loadGenerationLawPayloads()` on the async edge of each
// of the composer's three callers; this file awaits it at module scope, which is
// where it has to be because this family composes outside a hook.
import { loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';

await loadGenerationLawPayloads();

import { FACTION_DESCRIPTORS } from '../../../src/data/powerData.js';
import { inferFactionCategory } from '../../../src/generators/power/factionCategories.js';


describe('AMENDMENT A — the faction de-clunk rule', () => {
  const CATEGORIES = Object.keys(FACTION_DESCRIPTORS);

  const COLLECTIVE = COLLECTIVE_NOUNS;
  const collectiveTokens = (name) => name.replace(/^The\s+/, '').split(/\s+/).filter((t) => COLLECTIVE.has(t));

  it('hasBannedStack catches the repeated-noun clunk (a collective repeated / an adjacent dup)', () => {
    // "…Circle Inner Circle" repeats Circle; the amendment's "no repeated noun bigram" clause.
    expect(hasBannedStack('The Commercial Circle Inner Circle'), 'Circle repeated').toBe(true);
    expect(hasBannedStack('The Trade Compact Compact'), 'adjacent dup').toBe(true);
  });

  it('legitimate base descriptors with two DISTINCT collectives are NOT banned', () => {
    for (const ok of ['The Guild Alliance', 'The Order of the Watch', "The Makers' Guild-Alliance"]) {
      expect(hasBannedStack(ok), ok).toBe(false);
    }
  });

  it('the historical suffix-stack clunkers are UNREACHABLE — no candidate space can mint them', () => {
    // The doubled-collective clunk ("Free Alliance" + "Coalition") is prevented structurally,
    // not by the string guard: the generator only ever emits a whole clean base or an
    // adjectival-PREFIX form, never an appended collective. So none of these can be produced.
    const HISTORICAL = new Set([
      'The Commercial Circle Inner Circle', 'The Free Alliance Coalition',
      'The Devout Circle League', 'The Merchant Bloc Combine',
      'The Faithful Assembly League', 'The Common Interest League',
    ]);
    for (const cat of CATEGORIES) {
      for (const name of candidateNames(cat)) expect(HISTORICAL.has(name), `${cat} can mint "${name}"`).toBe(false);
    }
  });

  it('no disambiguation ADDS a collective noun — the doubled-honorific clunk is structurally impossible', () => {
    // Every modifier form "The <mod> <base-rest>" carries EXACTLY its base\'s collectives:
    // the adjectival prefix contributes none, so a second honorific can never be stacked.
    for (const cat of CATEGORIES) {
      const bases = [...FACTION_DESCRIPTORS[cat], ...(FACTION_DESCRIPTORS_EXTRA[cat] || [])];
      for (const base of bases) {
        const baseCollectives = collectiveTokens(base).sort().join('|');
        for (const mod of DISTINGUISH_MODIFIERS) {
          const name = `The ${mod} ${base.replace(/^The\s+/, '')}`;
          expect(collectiveTokens(name).sort().join('|'), `"${name}" added a collective`).toBe(baseCollectives);
        }
      }
    }
  });

  it('every distinguishing modifier is adjectival (never a collective noun)', () => {
    for (const m of DISTINGUISH_MODIFIERS) expect(COLLECTIVE_NOUNS.has(m), m).toBe(false);
  });

  it('the ENTIRE candidate space of every category is guard-clean (no clunker is reachable)', () => {
    for (const cat of CATEGORIES) {
      const space = candidateNames(cat);
      expect(space.length, `${cat} has a non-trivial space`).toBeGreaterThan(FACTION_DESCRIPTORS[cat].length);
      for (const name of space) {
        expect(hasBannedStack(name), `${cat}: "${name}" is a banned stack`).toBe(false);
        // No candidate repeats a NOUN as an adjacent bigram (the amendment's first clause).
        const toks = name.replace(/^The\s+/, '').split(/\s+/);
        for (let i = 0; i < toks.length - 1; i += 1) {
          expect(toks[i] === toks[i + 1], `${cat}: "${name}" repeats "${toks[i]}"`).toBe(false);
        }
      }
    }
  });

  it('every ADDED extra descriptor infers to its own category (or the neutral fallback)', () => {
    // The pre-existing base descriptors already infer imperfectly ("The Shield Compact"
    // → economy) — that is untouched here. This pins only MY authoring: an extra must not
    // mis-assign its faction to a WRONG specific category.
    const allowed = { crafts: ['economy', 'other'], other: ['other'] };
    for (const [cat, arr] of Object.entries(FACTION_DESCRIPTORS_EXTRA)) {
      const ok = allowed[cat] || [cat, 'other'];
      for (const name of arr) {
        expect(ok, `${cat}: "${name}" infers ${inferFactionCategory(name)}`).toContain(inferFactionCategory(name));
      }
    }
  });

  it('a distinguishing modifier PREFIX never changes a base descriptor\'s inferred category', () => {
    // The real rename guarantee: "The Greater Shield Compact" classifies exactly as "The
    // Shield Compact" does — the adjectival prefix carries no category keyword of its own.
    for (const cat of CATEGORIES) {
      const bases = [...FACTION_DESCRIPTORS[cat], ...(FACTION_DESCRIPTORS_EXTRA[cat] || [])];
      for (const base of bases) {
        const baseCat = inferFactionCategory(base);
        for (const mod of DISTINGUISH_MODIFIERS) {
          const name = `The ${mod} ${base.replace(/^The\s+/, '')}`;
          expect(inferFactionCategory(name), `"${name}" drifted from "${base}"`).toBe(baseCat);
        }
      }
    }
  });
});
