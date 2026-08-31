/**
 * paradigmAxisCatalog.test.js — THE CONSOLIDATION PROOFS (W-LIVES car L1).
 *
 * The catalog's whole claim is that it AGREES, word for word and value for value,
 * with the four shipped tables it consolidates. This file is that claim executed.
 *
 * ── WHY THE PINS ARE BOTH-WAYS ──────────────────────────────────────────────
 * A one-way pin ("every legacy key is in the catalog") passes for a catalog that
 * has silently grown an extra key, and the extra key is exactly what would change
 * behaviour the day car L5 inverts the source. A one-way pin the other direction
 * ("every catalog key is in the table") passes for a catalog that has silently
 * DROPPED one. So each of the four tables is compared in both directions on keys
 * AND on values — that is what "reproduce exactly" has to mean to be worth
 * anything. The comparison is against the LIVE modules, never a transcribed copy:
 * a fixture of the expected values would only prove the catalog matches the
 * fixture.
 *
 * ── AND WHY THE DARKNESS WALKER ─────────────────────────────────────────────
 * Car L1 lands the substrate consumed by NOTHING. That is a claim about the tree,
 * not an intention, so it is walked: if any src/ file imports the catalog before
 * car L5 re-points consumers deliberately, this reds and says so.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  PARADIGM_AXES, TRAIT_COLUMNS, AXIS_LEVELS, LEGACY_WORD_LEVEL,
  CAPABILITY_WORDS, MODIFIER_WORDS, UNPOOLED_LEGACY_WORDS, POOL_DUPLICATE_WORDS,
  CATALOG_PROVENANCE,
  derivedTraitPlane, derivedTraitAlignment, derivedTraitAggression, derivedFlawVector,
  axisPositionForWord, wordForAxisPosition, axisById, traitColumns,
  axisHomedWords, mintedWords,
} from '../../../src/domain/npc/paradigmAxisCatalog.js';

// The live tables — the authorities this catalog must agree with.
import { TRAIT_ALIGNMENT, TRAIT_AGGRESSION } from '../../../src/data/npcTraitWeights.js';
import { TRAIT_PLANE } from '../../../src/domain/worldPulse/clergyTraitPlane.js';
import { CORRUPTIBLE_FLAWS, corruptionVectorForFlaw } from '../../../src/domain/corruption.js';
import { NPC_PERSONALITY_TRAITS } from '../../../src/data/npcData.js';
import { NPC_TEMPERAMENTS } from '../../../src/domain/npc/npcFacetContract.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const sorted = (/** @type {Iterable<string>} */ xs) => [...xs].sort();

/** FLAW_VECTOR is module-private in corruption.js, so it is reconstructed through
 *  the exact accessors its consumers use — a stronger comparator than the literal,
 *  because it proves the catalog agrees with the SEAM and not just with a const. */
const liveFlawVector = Object.fromEntries(
  CORRUPTIBLE_FLAWS.map((flaw) => [flaw, corruptionVectorForFlaw(flaw)]),
);

// The three arms every reproduce-exactly pin runs. They are helpers called from
// STATICALLY REGISTERED tests rather than a `for` loop around `test()`: a
// loop-registered test parks the whole file under
// tests/lint/sovereigntyLightingContract.walker.test.js (TEST_UNREGISTERED —
// a test that is not statically registered may never be invoked at all), and a
// parked file's titles count as no evidence anywhere in the estate. The
// repetition below is the price of the file's titles being real.

/** Both directions, as two separately-named expectations, so a failure says WHICH
 *  direction broke: a catalog row the table lacks is a different bug from a table
 *  row the catalog dropped.
 * @param {Record<string, unknown>} derived @param {Record<string, unknown>} live */
function expectSameKeysBothWays(derived, live) {
  const extra = sorted(Object.keys(derived)).filter((k) => !(k in live));
  const missing = sorted(Object.keys(live)).filter((k) => !(k in derived));
  expect({ extraInCatalog: extra }).toEqual({ extraInCatalog: [] });
  expect({ missingFromCatalog: missing }).toEqual({ missingFromCatalog: [] });
}

/** A dormancy/identity proof over two empty objects is a TOTAL FALSE PASS, so
 *  every comparator states its subject is real before it claims agreement.
 * @param {Record<string, unknown>} derived @param {Record<string, unknown>} live */
function expectNonTrivial(derived, live) {
  expect(Object.keys(live).length).toBeGreaterThan(10);
  expect(Object.keys(derived).length).toBe(Object.keys(live).length);
}

describe('reproduce-exactly: TRAIT_PLANE', () => {
  test('the derived view has EXACTLY the live table keys, neither more nor fewer', () => {
    expectSameKeysBothWays(derivedTraitPlane(), { ...TRAIT_PLANE });
  });
  test('every value is reproduced exactly', () => {
    expect(derivedTraitPlane()).toEqual({ ...TRAIT_PLANE });
  });
  test('the live table is non-trivial (the comparator cannot pass by comparing nothing)', () => {
    expectNonTrivial(derivedTraitPlane(), { ...TRAIT_PLANE });
  });
});

describe('reproduce-exactly: TRAIT_ALIGNMENT', () => {
  test('the derived view has EXACTLY the live table keys, neither more nor fewer', () => {
    expectSameKeysBothWays(derivedTraitAlignment(), { ...TRAIT_ALIGNMENT });
  });
  test('every value is reproduced exactly', () => {
    expect(derivedTraitAlignment()).toEqual({ ...TRAIT_ALIGNMENT });
  });
  test('the live table is non-trivial (the comparator cannot pass by comparing nothing)', () => {
    expectNonTrivial(derivedTraitAlignment(), { ...TRAIT_ALIGNMENT });
  });
});

describe('reproduce-exactly: TRAIT_AGGRESSION', () => {
  test('the derived view has EXACTLY the live table keys, neither more nor fewer', () => {
    expectSameKeysBothWays(derivedTraitAggression(), { ...TRAIT_AGGRESSION });
  });
  test('every value is reproduced exactly', () => {
    expect(derivedTraitAggression()).toEqual({ ...TRAIT_AGGRESSION });
  });
  test('the live table is non-trivial (the comparator cannot pass by comparing nothing)', () => {
    expectNonTrivial(derivedTraitAggression(), { ...TRAIT_AGGRESSION });
  });
});

describe('reproduce-exactly: FLAW_VECTOR (through corruption.js own accessors)', () => {
  test('the derived view has EXACTLY the live table keys, neither more nor fewer', () => {
    expectSameKeysBothWays(derivedFlawVector(), liveFlawVector);
  });
  test('every value is reproduced exactly', () => {
    expect(derivedFlawVector()).toEqual(liveFlawVector);
  });
  test('the live table is non-trivial (the comparator cannot pass by comparing nothing)', () => {
    expectNonTrivial(derivedFlawVector(), liveFlawVector);
  });
});

describe('the views are safe copies, and null is never flattened into zero', () => {
  test('the derived views are FRESH objects, never the frozen originals handed back', () => {
    expect(derivedTraitPlane()).not.toBe(TRAIT_PLANE);
    expect(derivedTraitAlignment()).not.toBe(TRAIT_ALIGNMENT);
    expect(derivedTraitPlane()).not.toBe(derivedTraitPlane());
  });

  test('the plane view deep-copies its cells (a caller cannot mutate the catalog through it)', () => {
    const view = derivedTraitPlane();
    expect(view.cruel).not.toBe(TRAIT_COLUMNS.cruel.plane);
    view.cruel.e = 999;
    expect(TRAIT_COLUMNS.cruel.plane?.e).toBe(0.85);
  });

  test('null and zero are kept distinct — an explicit legacy zero survives, an absence does not appear', () => {
    // disciplined is { e: 0, c: -0.7 } in TRAIT_PLANE and ABSENT from TRAIT_AGGRESSION.
    // Flattening null to 0 would invent an aggression key and break byte-identity.
    expect(TRAIT_COLUMNS.disciplined.plane).toEqual({ e: 0, c: -0.7 });
    expect(TRAIT_COLUMNS.disciplined.aggression).toBeNull();
    expect('disciplined' in derivedTraitPlane()).toBe(true);
    expect('disciplined' in derivedTraitAggression()).toBe(false);
  });
});

describe('the F1 evidence — why consolidation, not derivation (the pins that would have failed)', () => {
  test('pole pairs are ASYMMETRIC across columns, so no per-axis magnitude reproduces both', () => {
    // Symmetric on the plane…
    expect(TRAIT_COLUMNS.cruel.plane?.e).toBe(0.85);
    expect(TRAIT_COLUMNS.merciful.plane?.e).toBe(-0.85);
    // …but NOT on alignment. A single MERCY magnitude cannot yield both.
    expect(TRAIT_COLUMNS.cruel.alignment).toBe(-0.9);
    expect(TRAIT_COLUMNS.merciful.alignment).toBe(0.85);
    expect(Math.abs(Number(TRAIT_COLUMNS.cruel.alignment)))
      .not.toBe(Math.abs(Number(TRAIT_COLUMNS.merciful.alignment)));
  });

  test('two words on the SAME pole disagree, so a pole+level scheme cannot reproduce them either', () => {
    // compassionate and merciful are both MERCY-virtue and agree on two columns…
    expect(TRAIT_COLUMNS.compassionate.alignment).toBe(TRAIT_COLUMNS.merciful.alignment);
    expect(TRAIT_COLUMNS.compassionate.plane?.e).toBe(TRAIT_COLUMNS.merciful.plane?.e);
    // …and differ on the third.
    expect(TRAIT_COLUMNS.compassionate.aggression).not.toBe(TRAIT_COLUMNS.merciful.aggression);
  });

  test('F2 — corruptibility is per WORD, not per axis: `cruel` is not corruptible, `callous` is', () => {
    expect(TRAIT_COLUMNS.cruel.corrupts).toBeNull();
    expect(TRAIT_COLUMNS.callous.corrupts).toBe('greed');
    // Both are MERCY-vice words, so an axis-grained vector would have to lie about one.
    expect(axisPositionForWord('cruel')?.axisId).toBe('MERCY');
    expect(axisPositionForWord('callous')?.axisId).toBe('MERCY');
  });
});

describe('the legacy word ↔ (axis, pole, level) round trip', () => {
  test('EVERY axis-homed word projects back to the IDENTICAL word (the byte-identity anchor)', () => {
    /** @type {string[]} */
    const broken = [];
    for (const word of axisHomedWords()) {
      const position = axisPositionForWord(word);
      if (!position || wordForAxisPosition(position) !== word) broken.push(word);
    }
    expect(broken).toEqual([]);
  });

  test('the round trip covers every axis-homed word — no silent shrinkage of the denominator', () => {
    const words = axisHomedWords();
    expect(words.length).toBe(76);
    expect(new Set(words).size).toBe(words.length); // no word is homed twice
  });

  test('reading is tolerant of case and surrounding space, exactly as the legacy lookups are', () => {
    expect(axisPositionForWord('  CRUEL ')).toEqual({
      axisId: 'MERCY', pole: 'vice', level: LEGACY_WORD_LEVEL, word: 'cruel',
    });
  });

  test('a word the chart does not home reads as null rather than guessing an axis', () => {
    for (const word of ['methodical', 'wise', 'stubborn', 'dutiful', '', 'not-a-word']) {
      expect(axisPositionForWord(word)).toBeNull();
    }
  });

  test('a legacy word reads at the default level, and that level is a real band word', () => {
    expect(AXIS_LEVELS).toContain(LEGACY_WORD_LEVEL);
    expect(axisPositionForWord('honest')?.level).toBe(LEGACY_WORD_LEVEL);
  });

  test('a DRIFTED position (no source word) projects to the pole word, not to nothing', () => {
    expect(wordForAxisPosition({ axisId: 'MERCY', pole: 'vice', level: 'defining', word: null }))
      .toBe('cruel');
    expect(wordForAxisPosition({ axisId: 'MERCY', pole: 'virtue', level: 'a_touch', word: null }))
      .toBe('compassionate');
  });

  test('a source word that does not belong to the named side falls back to the pole word', () => {
    // Guards against a drifted position carrying a stale word across a reversal.
    expect(wordForAxisPosition({ axisId: 'MERCY', pole: 'virtue', level: 'marked', word: 'cruel' }))
      .toBe('compassionate');
  });

  test('an unknown axis or pole projects to null rather than to a plausible-looking word', () => {
    expect(wordForAxisPosition({ axisId: 'NOPE', pole: 'vice', level: 'marked', word: null })).toBeNull();
    expect(wordForAxisPosition(null)).toBeNull();
    expect(axisById('NOPE')).toBeNull();
  });
});

describe('the candidate register — structure, and the arithmetic the pack asked to be auditable', () => {
  test('17 axes, each with two named poles and a codepoint-stable id', () => {
    expect(PARADIGM_AXES.length).toBe(17);
    for (const axis of PARADIGM_AXES) {
      expect(axis.id).toMatch(/^[A-Z]+$/);
      expect(axis.virtue.word.length).toBeGreaterThan(0);
      expect(axis.vice.word.length).toBeGreaterThan(0);
    }
    expect(new Set(PARADIGM_AXES.map((a) => a.id)).size).toBe(17);
  });

  test('the register is declared OWNER-UNSIGNED in the module itself', () => {
    expect(CATALOG_PROVENANCE.signedBy).toBeNull();
    expect(CATALOG_PROVENANCE.status).toContain('OWNER-UNSIGNED');
  });

  test('THE COUNT CHECK — every pool word is dispositioned, none silently dropped', () => {
    const homed = new Set(axisHomedWords());
    const capability = new Set(CAPABILITY_WORDS);
    const modifier = new Set(MODIFIER_WORDS);
    /** @param {readonly string[]} pool */
    const split = (pool) => ({
      total: pool.length,
      homed: pool.filter((w) => homed.has(w)).length,
      capabilities: pool.filter((w) => capability.has(w)).length,
      modifiers: pool.filter((w) => !homed.has(w) && !capability.has(w)).length,
      undispositioned: pool.filter((w) => !homed.has(w) && !capability.has(w) && !modifier.has(w)),
    });

    // MEASURED at build tip 7ce5ca61. These three rows are the pack's "count
    // check (panel-auditable)" made executable — and two of them CORRECT the
    // pack's arithmetic (see the L1 receipt): the pack read positive as
    // 32 homed + 10 capabilities + 3 "shared-expression words", and neutral as
    // 8 reassigned + 22 modifiers. Neither decomposition survives measurement.
    expect(split(NPC_PERSONALITY_TRAITS.positive))
      .toMatchObject({ total: 45, homed: 34, capabilities: 10, modifiers: 1, undispositioned: [] });
    expect(split(NPC_PERSONALITY_TRAITS.negative))
      .toMatchObject({ total: 30, homed: 29, capabilities: 0, modifiers: 1, undispositioned: [] });
    expect(split(NPC_PERSONALITY_TRAITS.neutral))
      .toMatchObject({ total: 30, homed: 7, capabilities: 0, modifiers: 23, undispositioned: [] });
  });

  test('no word is homed on two axes, and no word is both homed and a modifier/capability', () => {
    const homed = axisHomedWords();
    expect(new Set(homed).size).toBe(homed.length);
    const overlap = [...CAPABILITY_WORDS, ...MODIFIER_WORDS].filter((w) => homed.includes(w));
    expect(overlap).toEqual([]);
  });

  test('the six MINTED words are named, and NONE of them has been slipped into a pool', () => {
    // The mints are the pen's business. A pool edit would move the LOCKSTEP mirror
    // AND change a seeded draw array's length; the catalog names them instead.
    expect(mintedWords()).toEqual([
      'treacherous', 'trusting', 'forgiving', 'indulgent', 'contented', 'worldly',
    ]);
    const pools = new Set([
      ...NPC_PERSONALITY_TRAITS.positive,
      ...NPC_PERSONALITY_TRAITS.negative,
      ...NPC_PERSONALITY_TRAITS.neutral,
    ]);
    for (const word of mintedWords()) expect(pools.has(word)).toBe(false);
    // …and no minted word carries a legacy column, so it can move nothing.
    for (const word of mintedWords()) expect(traitColumns(word)).toBeNull();
  });

  test('DEVOTION is flagged as an open owner ruling, and it is the only one', () => {
    expect(PARADIGM_AXES.filter((a) => a.ownerRulingPending).map((a) => a.id)).toEqual(['DEVOTION']);
  });
});

describe('the leans are drawn from measured values, never invented', () => {
  test("each axis's drift leans equal its VICE POLE word's own legacy column, or are null", () => {
    for (const axis of PARADIGM_AXES) {
      const col = traitColumns(axis.vice.word);
      expect({ id: axis.id, plane: axis.planeLean }).toEqual({ id: axis.id, plane: col?.plane ?? null });
      expect({ id: axis.id, agg: axis.aggressionLean }).toEqual({ id: axis.id, agg: col?.aggression ?? null });
    }
  });

  test('a null lean means the legacy tables never scored that pole — an honest gap, not a zero', () => {
    const unscored = PARADIGM_AXES.filter((a) => a.planeLean === null).map((a) => a.id);
    expect(unscored).toEqual([
      'COURAGE', 'HUMILITY', 'FIDELITY', 'INDUSTRY', 'CHEER',
      'PROTECTION', 'TEMPERANCE', 'CONTENT', 'DEVOTION',
    ]);
    for (const id of unscored) expect(traitColumns(axisById(id)?.vice.word)?.plane ?? null).toBeNull();
  });

  test("each axis's drifted-vice corruption vector is one its own vice words already carry", () => {
    for (const axis of PARADIGM_AXES) {
      const viceWords = [axis.vice.word, ...axis.vice.expressions];
      const available = viceWords.map((w) => traitColumns(w)?.corrupts ?? null).filter((v) => v !== null);
      if (axis.corruptionVector === null) expect({ id: axis.id, available }).toEqual({ id: axis.id, available: [] });
      else expect(available).toContain(axis.corruptionVector);
    }
  });

  test('drifted-vice corruption reaches only 7 of 17 axes on the shipped data (owner row 13a input)', () => {
    const withVector = PARADIGM_AXES.filter((a) => a.corruptionVector !== null).map((a) => a.id);
    expect(withVector).toEqual([
      'CANDOR', 'MERCY', 'COURAGE', 'GENEROSITY', 'HUMILITY', 'JUSTICE', 'TRUST',
    ]);
  });
});

describe('the unpooled legacy keys — a table key the corpus can never produce', () => {
  test('all nine are real legacy keys that belong to NO live pool', () => {
    const pools = new Set([
      ...NPC_PERSONALITY_TRAITS.positive,
      ...NPC_PERSONALITY_TRAITS.negative,
      ...NPC_PERSONALITY_TRAITS.neutral,
    ]);
    expect(UNPOOLED_LEGACY_WORDS.length).toBe(9);
    for (const word of UNPOOLED_LEGACY_WORDS) {
      expect(traitColumns(word)).not.toBeNull();   // it IS in a shipped table…
      expect(pools.has(word)).toBe(false);          // …and no draw can reach it
      expect(axisPositionForWord(word)).toBeNull(); // …and the chart does not home it
    }
  });

  test('the inventory is COMPLETE — a tenth such key cannot appear silently', () => {
    const pools = new Set([
      ...NPC_PERSONALITY_TRAITS.positive,
      ...NPC_PERSONALITY_TRAITS.negative,
      ...NPC_PERSONALITY_TRAITS.neutral,
    ]);
    const homed = new Set(axisHomedWords());
    const measured = sorted(
      Object.keys(TRAIT_COLUMNS).filter((w) => !pools.has(w) && !homed.has(w)),
    );
    expect(measured).toEqual(sorted(UNPOOLED_LEGACY_WORDS));
  });
});

describe('the LOCKSTEP mirror and the one pool duplication (untouched by this car)', () => {
  test('the mirror still holds at its true home — this car moved no pool', () => {
    // ODQ §806 F15: npcFacetContract.js is the lockstep home, not npcBank.js.
    expect([...NPC_TEMPERAMENTS]).toEqual([...NPC_PERSONALITY_TRAITS.positive]);
  });

  test('`methodical` is still in BOTH pools — declared as a deferral, not deduped', () => {
    expect(POOL_DUPLICATE_WORDS).toEqual(['methodical']);
    expect(NPC_PERSONALITY_TRAITS.positive).toContain('methodical');
    expect(NPC_PERSONALITY_TRAITS.neutral).toContain('methodical');
    // The measured cost of a dedup is a seeded-draw remap: both arrays are
    // length-indexed draw sources, so this pin is the guard on the deferral.
    expect(NPC_PERSONALITY_TRAITS.positive.length).toBe(45);
    expect(NPC_PERSONALITY_TRAITS.neutral.length).toBe(30);
  });

  test('the duplication inventory is complete — it is the ONLY cross-pool duplicate', () => {
    const counts = new Map();
    for (const w of [
      ...NPC_PERSONALITY_TRAITS.positive,
      ...NPC_PERSONALITY_TRAITS.negative,
      ...NPC_PERSONALITY_TRAITS.neutral,
    ]) counts.set(w, (counts.get(w) ?? 0) + 1);
    const duplicates = sorted([...counts].filter(([, n]) => n > 1).map(([w]) => w));
    expect(duplicates).toEqual(sorted(POOL_DUPLICATE_WORDS));
  });
});

describe('DARK BY CONSTRUCTION — the catalog is consumed by nothing in src/', () => {
  /** @param {string} dir @returns {string[]} */
  function jsFilesUnder(dir) {
    /** @type {string[]} */
    const out = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) out.push(...jsFilesUnder(full));
      else if (/\.(js|jsx|ts|tsx|mjs)$/.test(entry.name)) out.push(full);
    }
    return out;
  }

  /**
   * ⚠⚠ COMMENTS ARE STRIPPED, AND A FROZEN SEAM STRING IS A CITATION TOO. This
   * walker never received L5's amendment, and the substrate coupling is what
   * exposed it: FOUR of the five files it convicted do not import this catalog at
   * all. Classified by hand, code vs comment vs data:
   *
   *   `customContentSchema.js`    line 208, a COMMENT explaining why it mirrors
   *   `characterDrift.js`         line 123, a COMMENT explaining why it mirrors
   *   `livedExperienceCatalog.js` lines 43 and 146, COMMENTS, same reason
   *   `characterConsumers.js`     line 52 a comment, and line 98 the frozen constant
   *                               `PARADIGM_WORD_PROJECTION_SEAM =
   *                               'paradigmAxisCatalog.js#wordForAxisPosition'` — a
   *                               SEAM NAME held as data so the landing car can find
   *                               its address by symbol instead of by search. Naming
   *                               the import you have NOT yet made is the opposite of
   *                               having made it.
   *
   * The four leaves each explain, in prose, that they MIRROR rather than import —
   * so the old detector convicted them for documenting the very restraint the
   * closure is asserting.
   * @param {string} text
   */
  const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

  /**
   * ⛔ `AXIS_LEVELS` IS NOT ON THIS ROSTER, AND THAT IS MEASURED, NOT STYLISTIC:
   * `characterDrift.js` exports the same name, so a dereference arm carrying it
   * would convict every reader of the DRIFT module of reading the CATALOG. The
   * control below proves each entry is owned by exactly one module.
   */
  const CATALOG_SYMBOLS = Object.freeze([
    'PARADIGM_AXES', 'TRAIT_COLUMNS', 'CATALOG_PROVENANCE', 'LEGACY_WORD_LEVEL',
    'CAPABILITY_WORDS', 'MODIFIER_WORDS', 'UNPOOLED_LEGACY_WORDS', 'POOL_DUPLICATE_WORDS',
    'axisById', 'traitColumns', 'derivedTraitPlane', 'derivedTraitAlignment',
    'derivedTraitAggression', 'derivedFlawVector', 'axisPositionForWord',
    'wordForAxisPosition', 'axisHomedWords', 'mintedWords',
  ]);


  /**
   * ⛔⛔⛔ AND A SYMBOL INSIDE A STRING LITERAL IS A CITATION TOO — THE SIXTH SIGHTING
   * OF THIS ESTATE'S LAW, AND IT CONVICTED THE VERY CAR THAT WROTE THE CURE.
 *
   * The dereference arm above was added to catch an aliased import plus a call. On its
   * first run it convicted `livedExperienceCatalog.js` of depending on the witness
   * adapter — on the strength of the RECEIPT STRING that names it:
   * `'faithWitnessSource.js:faithWitnessEntries (religionState pantheon ...)'`. A quoted
   * name followed by a space and a paren is indistinguishable from a call to a scanner
   * that only strips comments.
 *
   * ⭐ THE GENERALISATION, and it is the one this whole family has been converging on:
   * COMMENTS AND STRING LITERALS ARE BOTH CITATIONS. Only two things are dependencies —
   * an import specifier, and a dereference in CODE. So the module arm is asked BEFORE
   * strings are blanked (an import specifier IS a string literal), and the symbol arm is
   * asked AFTER. Ban lists, seam-name constants, `home:` paths and receipt strings all
   * fall out of the detector at once, because they were always the same shape.
   * @param {string} text
   */
  const codeWithoutCitations = (text) => stripComments(text)
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``');

  /** @param {string} text */
  const dependsOnCatalog = (text) => (
    /from\s+'[^']*\/paradigmAxisCatalog\.js'/.test(stripComments(text))
      || new RegExp(`\\b(${CATALOG_SYMBOLS.join('|')})\\s*[([.]`).test(codeWithoutCitations(text))
  );

  /**
   * THE ENROLLED CONSUMER ROSTER — one row, and it is the coupling itself.
   *
   * ⭐ THIS IS A TIGHTENING, NOT AN OPENING, AND THE TEST BELOW IS WHERE THE
   * DIFFERENCE IS PAID. The old claim was "nobody", which the coupling made false:
   * W-FAITH's `faithWitnessSource.js` imports `AXIS_LEVELS` to map a deity's
   * authored `AXIS:pole:level` token rung-for-rung onto the funnel's band ladder —
   * the one import that makes the witness adapter possible with zero invented
   * vocabulary (§806/F14; W-LIVES §6). The new claim is STRICTLY MORE: the set is
   * pinned exactly, so a stray consumer still reds, AND the enrolled consumer must
   * itself be unreachable from production, so the catalog is still dark THROUGH it.
   * "Car L5 owns the re-pointing" is unchanged — no legacy-word seam moved here.
   */
  const ENROLLED_CONSUMERS = ['src/domain/worldPulse/faithWitnessSource.js'];

  test('the src consumers of paradigmAxisCatalog are the enrolled coupling roster, and nothing else', () => {
    const importers = jsFilesUnder(join(REPO_ROOT, 'src'))
      .filter((file) => !file.endsWith('paradigmAxisCatalog.js'))
      .filter((file) => dependsOnCatalog(readFileSync(file, 'utf8')))
      .map((file) => relative(REPO_ROOT, file).replace(/\\/g, '/'))
      .sort();
    // If this reds with a NEW name, a consumer was re-pointed early. That is car
    // L5's act, and it must arrive WITH the byte-identity proof for the seam it moves.
    expect(importers).toEqual(ENROLLED_CONSUMERS);
  });

  test('⭐ AND THE CATALOG IS STILL DARK THROUGH ITS ONE CONSUMER', () => {
    // The half that keeps the roster honest: an enrolled consumer that production
    // could reach would have opened the catalog by proxy. Nothing imports the
    // witness adapter, so the dormancy claim survives the enrolment intact.
    const files = jsFilesUnder(join(REPO_ROOT, 'src'));
    const reachers = files
      .filter((file) => !file.endsWith('faithWitnessSource.js'))
      .filter((file) => {
        const text = readFileSync(file, 'utf8');
        // ⛔ THE SAME TWO-STAGE READ AS `dependsOnCatalog`, AND IT IS OWED HERE FOR A
        // REASON THIS CAR MEASURED ON ITSELF: `livedExperienceCatalog.js`'s
        // `faith_milieu` row carries the RECEIPT STRING
        // `'faithWitnessSource.js:faithWitnessEntries (...)'`, and a comment-only
        // strip convicted the catalog of calling the adapter. A quoted name is a
        // citation exactly as a commented one is.
        return /from\s+'[^']*\/faithWitnessSource\.js'/.test(stripComments(text))
          || /\b(faithWitnessEntries|exposureDemotion|FAITH_WITNESS_KIND|FAITH_WITNESS_TUNING)\s*[([.]/
            .test(codeWithoutCitations(text));
      })
      .map((file) => relative(REPO_ROOT, file).replace(/\\/g, '/'));
    expect(reachers).toEqual([]);
    // anchored: the enrolled consumer really is on the tree and really does import
    // the catalog, so neither list above passed by matching nothing.
    const witness = readFileSync(join(REPO_ROOT, ENROLLED_CONSUMERS[0]), 'utf8');
    expect(witness).toContain("from '../npc/paradigmAxisCatalog.js'");
    expect(dependsOnCatalog(witness)).toBe(true);
  });

  test('⭐⭐ THE DETECTOR IS ANTI-VACUOUS, AND ITS SYMBOLS ARE UNIQUELY OWNED', () => {
    expect(dependsOnCatalog("import { AXIS_LEVELS } from '../npc/paradigmAxisCatalog.js';")).toBe(true);
    expect(dependsOnCatalog('const a = axisById("MERCY");')).toBe(true);
    expect(dependsOnCatalog('const n = PARADIGM_AXES.length;')).toBe(true);
    // …and the four citation shapes that were convicted before the cure.
    expect(dependsOnCatalog('/** MIRRORED NOT IMPORTED from paradigmAxisCatalog.js */\nconst a = 1;')).toBe(false);
    expect(dependsOnCatalog('// the authority is paradigmAxisCatalog.wordForAxisPosition\nconst a = 1;')).toBe(false);
    expect(dependsOnCatalog("export const SEAM = 'paradigmAxisCatalog.js#wordForAxisPosition';")).toBe(false);
    expect(dependsOnCatalog("const row = { home: 'src/domain/npc/paradigmAxisCatalog.js' };")).toBe(false);
    // ⛔ AND THE STRING-LITERAL CITATION — the shape that convicted this very car's
    // own catalog row. A quoted symbol followed by a space and a paren is not a call.
    expect(dependsOnCatalog("const receipt = 'paradigmAxisCatalog.js:axisById (the authority)';")).toBe(false);
    // ⭐ THE UNIQUE-OWNERSHIP CONTROL and the anchor that makes it discriminating.
    // ⚠ READ EACH FILE ONCE. The first cut re-read all of `src/` PER SYMBOL and
    // timed out at 20s — an O(files x symbols) walk dressed as a one-line helper.
    const texts = jsFilesUnder(join(REPO_ROOT, 'src')).map((file) => readFileSync(file, 'utf8'));
    /** @param {string} symbol */
    const exportersOf = (symbol) => texts
      .filter((text) => new RegExp(`^export (const|function) ${symbol}\\b`, 'm').test(text));
    for (const symbol of CATALOG_SYMBOLS) {
      expect(exportersOf(symbol), `${symbol} must be owned by exactly one module`).toHaveLength(1);
    }
    expect(exportersOf('AXIS_LEVELS').length).toBe(2);
    expect(CATALOG_SYMBOLS).not.toContain('AXIS_LEVELS');
  });

  test('the catalog imports nothing — the true-leaf law that keeps it first-paint safe', () => {
    const source = readFileSync(join(REPO_ROOT, 'src/domain/npc/paradigmAxisCatalog.js'), 'utf8');
    // The vacuity risk for a source-text negative is an empty or unread file, so
    // the subject is anchored positively first: the text really is the catalog.
    expect(source.length).toBeGreaterThan(5000);
    expect(source).toContain('export const PARADIGM_AXES');
    // anchored: the subject is pinned non-empty and identified two lines above, so this cannot pass by reading nothing
    expect(source).not.toMatch(/^\s*import\s/m);
    // anchored: same anchored subject as the line above
    expect(source).not.toMatch(/\brequire\s*\(/);
  });
});
