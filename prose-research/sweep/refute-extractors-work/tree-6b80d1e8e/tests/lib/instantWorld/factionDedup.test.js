/**
 * tests/lib/instantWorld/factionDedup.test.js — the world-scoped faction-name dedup.
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
  dedupeWorldFactionNames, candidateNames, hasBannedStack,
  COLLECTIVE_NOUNS, DISTINGUISH_MODIFIERS, FACTION_DESCRIPTORS_EXTRA,
} from '../../../src/lib/instantWorld/factionDedup.js';
import { composeInstantWorld } from '../../../src/lib/instantWorld/composeInstantWorld.js';
import { FACTION_DESCRIPTORS } from '../../../src/data/powerData.js';
import { inferFactionCategory } from '../../../src/generators/power/factionCategories.js';

const facNames = (m) => (m.settlement?.factions || []).map((f) => f.name);
const allFacNames = (members) => members.flatMap(facNames);

describe('dedupeWorldFactionNames — unit', () => {
  const build = () => [
    { id: 's0', _slot: 0, settlement: { factions: [{ name: 'The Trade Compact', category: 'economy' }], conflicts: [] } },
    { id: 's1', _slot: 1, settlement: {
      factions: [{ name: 'The Trade Compact', category: 'economy' }, { name: 'The Garrison Bloc', category: 'military' }],
      conflicts: [{ parties: ['The Trade Compact', 'The Garrison Bloc'], desc: 'The Trade Compact opposes the guard.' }],
    } },
    { id: 's2', _slot: 2, settlement: { factions: [{ name: 'The Trade Compact', category: 'economy' }], conflicts: [] } },
  ];

  it('renames every cross-settlement collision (first occurrence keeps the name)', () => {
    const members = build();
    const renames = dedupeWorldFactionNames(members);
    const names = allFacNames(members);
    expect(new Set(names).size, 'no duplicate faction names world-wide').toBe(names.length);
    expect(members[0].settlement.factions[0].name).toBe('The Trade Compact'); // slot 0 keeps it
    expect(renames.length).toBe(2); // s1 + s2's colliding "Trade Compact"
  });

  it('keeps conflicts references consistent with the renamed faction', () => {
    const members = build();
    dedupeWorldFactionNames(members);
    const s1 = members[1].settlement;
    const newName = s1.factions[0].name; // the renamed one
    expect(newName).not.toBe('The Trade Compact');
    expect(s1.conflicts[0].parties).toContain(newName);
    expect(s1.conflicts[0].parties).not.toContain('The Trade Compact');
    expect(s1.conflicts[0].desc).toContain(newName);
    expect(s1.conflicts[0].desc).not.toContain('The Trade Compact');
  });

  it('is deterministic (same input → same renames)', () => {
    const a = dedupeWorldFactionNames(build());
    const b = dedupeWorldFactionNames(build());
    expect(a).toEqual(b);
  });

  it('gives DISTINCT names to two same-named factions in ONE settlement (local dedup can cap out)', () => {
    // Regression: a name-match rename collapsed both to one string; identity rename must not.
    const members = [
      { id: 's0', _slot: 0, settlement: { factions: [{ name: 'The Free Alliance', category: 'other' }] } },
      { id: 's1', _slot: 1, settlement: { factions: [
        { name: 'The Free Alliance', category: 'other' },
        { name: 'The Free Alliance', category: 'other' },
      ] } },
    ];
    dedupeWorldFactionNames(members);
    const names = allFacNames(members);
    expect(new Set(names).size, `no dup after intra-settlement collision: ${names}`).toBe(names.length);
  });

  it('is a no-op when there are no collisions', () => {
    const members = [
      { id: 'a', _slot: 0, settlement: { factions: [{ name: 'The Merchant Bloc', category: 'economy' }] } },
      { id: 'b', _slot: 1, settlement: { factions: [{ name: 'The Garrison Bloc', category: 'military' }] } },
    ];
    expect(dedupeWorldFactionNames(members)).toEqual([]);
  });
});

describe('composeInstantWorld — no cross-settlement faction collisions + determinism', () => {
  const compose = (seed) => composeInstantWorld({ seed, basicConfig: { realmSize: 'large' } });

  // A full 'large' realm compose runs the whole pipeline for every member and can overrun
  // the default 20s testTimeout on a loaded/parallel runner — a wall-clock false positive,
  // not a correctness fault (the generatorGoldenMaster block uses the same allowance for
  // the same reason). The dedup post-pass itself is O(collisions) and adds negligible time.
  it('a composed realm has zero duplicate faction names across its members', () => {
    const { settlements } = compose('realm-dedup-1');
    const names = allFacNames(settlements);
    expect(names.length, 'the realm has factions to check').toBeGreaterThan(1);
    expect(new Set(names).size, `duplicates: ${names.filter((n, i) => names.indexOf(n) !== i)}`).toBe(names.length);
  }, 120_000);

  it('same seed → identical member faction names (determinism preserved)', () => {
    const a = allFacNames(compose('realm-det').settlements);
    const b = allFacNames(compose('realm-det').settlements);
    expect(a).toEqual(b);
  }, 120_000);
});

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

  it('DESCRIPTOR-SWAP wins first: collisions up to the clean-base count never take a modifier form', () => {
    // Ten economy collisions (4 base + 6 extra = 10 clean bases) must ALL resolve to whole,
    // distinct base names — no "The Greater/Second …" modifier form until bases are spent.
    const members = [];
    for (let i = 0; i < 10; i += 1) members.push({ id: `s${i}`, _slot: i, settlement: { factions: [{ name: 'The Trade Compact', category: 'economy' }], conflicts: [] } });
    dedupeWorldFactionNames(members);
    const names = allFacNames(members);
    expect(new Set(names).size).toBe(names.length);
    for (const n of names) expect(n, `${n} took a modifier form before bases were spent`).not.toMatch(/^The (Greater|Elder|United|Reformed|Grand|Old|New|Lesser|Lower|Upper|Second|Third|Northern|Southern|Eastern|Western) /);
  });

  it('a heavy same-category collision realm stays collision-free AND clunk-free', () => {
    const members = [];
    for (let i = 0; i < 24; i += 1) members.push({ id: `m${i}`, _slot: i, settlement: { factions: [{ name: 'The Trade Compact', category: 'economy' }], conflicts: [] } });
    dedupeWorldFactionNames(members);
    const names = allFacNames(members);
    expect(new Set(names).size, 'collision-free under heavy load').toBe(names.length);
    for (const n of names) expect(hasBannedStack(n), `clunker minted: ${n}`).toBe(false);
  });

  it('IDENTITY-rename law preserved: two same-named factions in one settlement get distinct clean names', () => {
    const members = [
      { id: 's0', _slot: 0, settlement: { factions: [{ name: 'The Devout Circle', category: 'religious' }] } },
      { id: 's1', _slot: 1, settlement: { factions: [
        { name: 'The Devout Circle', category: 'religious' },
        { name: 'The Devout Circle', category: 'religious' },
      ] } },
    ];
    dedupeWorldFactionNames(members);
    const names = allFacNames(members);
    expect(new Set(names).size, `distinct after intra-dup: ${names}`).toBe(names.length);
    for (const n of names) expect(hasBannedStack(n), n).toBe(false);
  });
});
