/**
 * traditionCorpus.test.js — THE TRADITIONS wave (T-1). Locks the vocabulary
 * invariants the design + eventProse laws depend on, so a later promotion of any
 * pool into the news registry (T-5) is safe:
 *   • NO calamity substrings anywhere (flood/fire/quake/storm) — bucket-neutrality.
 *   • CANONICAL-AT-ZERO shape — index 0 of every pool is a plain non-empty string.
 *   • the six design acts exactly; trappings cover every act; four flavoured seasons.
 */
import { describe, it, expect } from 'vitest';
import {
  TRADITION_ELEMENTS, TRADITION_ACTS, TRADITION_NAME_TEMPLATES, TRADITION_ADJECTIVES,
  TRADITION_CULTURE_FLAVOR, TRADITION_TRAPPINGS, TRADITION_EPITHETS,
  TRADITION_SEASON_LABELS, WEEK_ORDINALS,
} from '../../src/data/traditionCorpus.js';

const CALAMITY = /flood|fire|quake|storm/i;
const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
const ACT_IDS = ['feast', 'procession', 'vigil', 'contest', 'fair', 'offering'];

/** Every string reachable in the corpus, for the substring scan. */
function allStrings() {
  const out = [];
  const push = (v) => { if (typeof v === 'string') out.push(v); };
  for (const e of TRADITION_ELEMENTS) { push(e.id); push(e.glyph); push(e.noun); push(e.genitive); push(e.adjective); }
  for (const a of TRADITION_ACTS) { push(a.id); push(a.noun); }
  TRADITION_NAME_TEMPLATES.forEach(push);
  TRADITION_ADJECTIVES.forEach(push);
  Object.values(TRADITION_CULTURE_FLAVOR).forEach((list) => list.forEach(push));
  Object.values(TRADITION_TRAPPINGS).forEach((list) => list.forEach(push));
  TRADITION_EPITHETS.forEach(push);
  Object.values(TRADITION_SEASON_LABELS).forEach(push);
  WEEK_ORDINALS.forEach(push);
  return out;
}

describe('traditionCorpus — bucket-neutrality (no calamity substrings)', () => {
  it('carries no flood/fire/quake/storm substring anywhere', () => {
    const offenders = allStrings().filter((s) => CALAMITY.test(s));
    expect(offenders).toEqual([]);
  });
});

describe('traditionCorpus — canonical-at-zero shape', () => {
  const pools = {
    TRADITION_NAME_TEMPLATES, TRADITION_ADJECTIVES, TRADITION_EPITHETS, WEEK_ORDINALS,
    ...Object.fromEntries(Object.entries(TRADITION_CULTURE_FLAVOR).map(([k, v]) => [`flavor:${k}`, v])),
    ...Object.fromEntries(Object.entries(TRADITION_TRAPPINGS).map(([k, v]) => [`trappings:${k}`, v])),
  };
  for (const [name, pool] of Object.entries(pools)) {
    it(`${name}[0] is a plain non-empty string`, () => {
      expect(Array.isArray(pool)).toBe(true);
      expect(pool.length).toBeGreaterThan(0);
      expect(typeof pool[0]).toBe('string');
      expect(pool[0].length).toBeGreaterThan(0);
    });
  }
});

describe('traditionCorpus — vocabulary contract', () => {
  it('acts are exactly the six design acts', () => {
    expect(TRADITION_ACTS.map((a) => a.id).sort()).toEqual([...ACT_IDS].sort());
  });
  it('every act has a trappings pool', () => {
    for (const id of ACT_IDS) {
      expect(Array.isArray(TRADITION_TRAPPINGS[id]), `trappings missing for ${id}`).toBe(true);
      expect(TRADITION_TRAPPINGS[id].length).toBeGreaterThan(0);
    }
  });
  it('every element declares a valid season', () => {
    for (const e of TRADITION_ELEMENTS) expect(SEASONS).toContain(e.season);
  });
  it('every element carries a non-empty register glyph (T-5)', () => {
    for (const e of TRADITION_ELEMENTS) {
      expect(typeof e.glyph, `glyph missing for ${e.id}`).toBe('string');
      expect(e.glyph.length).toBeGreaterThan(0);
    }
  });
  it('exactly one founding-era origin is preferred but several are eligible', () => {
    const foundingFit = TRADITION_ELEMENTS.filter((e) => e.foundingFit).map((e) => e.id);
    expect(foundingFit).toContain('founding');
    expect(foundingFit.length).toBeGreaterThanOrEqual(2);
  });
  it('season labels cover all four seasons; ordinals cover a 13-week season', () => {
    for (const s of SEASONS) expect(typeof TRADITION_SEASON_LABELS[s]).toBe('string');
    expect(WEEK_ORDINALS.length).toBe(13);
  });
  it('culture flavour has a default fallback', () => {
    expect(Array.isArray(TRADITION_CULTURE_FLAVOR.default)).toBe(true);
    expect(TRADITION_CULTURE_FLAVOR.default.length).toBeGreaterThan(0);
  });
});
