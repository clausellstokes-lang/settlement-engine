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

// ⭐ THE FOUR MIRRORS, imported LIVE for the mirror census. A test may import what a
// production leaf may not: the census is the whole point of the coupling, and reading
// the VALUES is what turns four declarations into four cross-checks.
import { AXIS_LEVELS as DRIFT_AXIS_LEVELS } from '../../../src/domain/npc/characterDrift.js';
import {
  PARADIGM_AXIS_IDS as FUNNEL_AXIS_IDS,
  EXPERIENCE_TABLE,
  LIVED_EXPERIENCE_KINDS,
} from '../../../src/domain/npc/livedExperienceCatalog.js';
import {
  CORRUPTIBLE_AXIS_VECTORS,
  RISK_CENTER_AXES,
} from '../../../src/domain/npc/characterConsumers.js';

// The live tables — the authorities this catalog must agree with.
import { TRAIT_ALIGNMENT, TRAIT_AGGRESSION } from '../../../src/data/npcTraitWeights.js';
import { TRAIT_PLANE } from '../../../src/domain/worldPulse/clergyTraitPlane.js';
import { CORRUPTIBLE_FLAWS, corruptionVectorForFlaw } from '../../../src/domain/corruption.js';
import { NPC_PERSONALITY_TRAITS } from '../../../src/data/npcData.js';
import { NPC_TEMPERAMENTS } from '../../../src/domain/npc/npcFacetContract.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';

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

/**
 * ⛔⛔ THE NARROWED CLAIM (chair ruling R-TAILF-1, 2026-09-01, DECLARED in the ledger).
 *
 * The claim this suite used to make — "the catalog is consumed by nothing in src/ that
 * production can reach" — was TOO BROAD, not false in spirit, and W-FAITH F7c is what
 * proved it too broad. It is narrowed here, never retired, and the narrowing is drawn
 * exactly where the design draws it:
 *
 *   LIT, BY DESIGN — the catalog's VOCABULARY (`axisById`, `wordForAxisPosition`,
 *   `AXIS_LEVELS`) reaches the screen through the faith tab's authored deity display.
 *   W-LIVES puts gods on the same chart IMMUTABLY, with the same level words, and F7c
 *   act 2 resolves a deity's AUTHORED chart positions through this catalog into T11's
 *   reserved seat — no new flag, no second vocabulary. ⭐ THE LIT HALF MOVES NO
 *   GENERATED BYTE: it DISPLAYS authored fields, which is why the espionage fence's
 *   360-settlement corpus did not shift by one byte across this composition. And the
 *   words are IMPORTED rather than mirrored on purpose — a second copy of a closed
 *   vocabulary that can drift is the finite-semantics violation, so mirroring them into
 *   the display leaf is FORBIDDEN, not merely unnecessary.
 *
 *   DARK, UNTIL THE LIGHTING DAY — the NPC read model and the lived-experience chain
 *   (`characterReadModel`, `livedExperience*`, `characterConsumers`). Whether those
 *   light is the lighting day's question and nobody else's; this suite is where the
 *   answer stays "not yet" until it is asked.
 *
 * ⛔ AND THE PROOF IS NOW DERIVED FROM THE ROSTERS, NOT HAND-WRITTEN BESIDE THEM.
 * Before this ruling the roster and the darkness proof were two lists that merely
 * happened to agree: the reachability rows were written per file, so enrolling a new
 * name satisfied the roster arm while no arm ever checked that name's reachability. A
 * consumer production could reach could therefore be added in two lines and the whole
 * suite would go GREEN with the darkness claim false — measured, not feared (the TAIL-F
 * rehearsal executed exactly that cure and got 51/51). The rows below are now DERIVED
 * from `DARK_CLOSURE`, so that cure is structurally unavailable: a dark consumer moved
 * into the lit set reds, and a module outside the closure reaching into it reds.
 */
describe('THE NPC READ MODEL STAYS DARK — the vocabulary is lit ONLY through the faith tab\'s authored deity display', () => {
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
   * THE TWO ROSTERS — split by chair ruling R-TAILF-1, because "enrolled" was one word
   * doing two incompatible jobs.
   *
   * `DARK_CONSUMERS` keeps the old contract exactly: a consumer production must NOT be
   * able to reach, proven below by a closure that is CLOSED rather than by a row per
   * file. `LIT_CONSUMERS` is the new, narrower door: a consumer production IS meant to
   * reach, whose designed path must therefore be proven to EXIST — a lit consumer whose
   * chain has quietly broken is as much a defect as a dark one that has quietly lit.
   *
   * ⚠ THE ASYMMETRY IS THE POINT. A dark consumer is proven by a NEGATIVE (nobody
   * outside reaches it) and a lit one by a POSITIVE (this exact chain does). Neither
   * roster can absorb the other's members without reddening, which is what makes the
   * split a tightening rather than an opening.
   */
  const DARK_CONSUMERS = Object.freeze([
    // The funnel catalog's axis roster, DERIVED from `PARADIGM_AXES[].id` instead of
    // hand-kept — the one mirror of four where the import costs no darkness, because
    // this leaf's own importers are themselves imported by nobody.
    'src/domain/npc/livedExperienceCatalog.js',
    // W-FAITH's witness adapter: `AXIS_LEVELS`, to map a deity's authored
    // `AXIS:pole:level` token rung-for-rung onto the funnel's band ladder
    // (§806/F14; W-LIVES §6). Reached by NOBODY.
    'src/domain/worldPulse/faithWitnessSource.js',
    // ⛔⛔ FORWARD POINTER — ENC-1's CHANCE-MEETING LEAF LEFT THIS ROSTER ON 2026-09-03.
    // It sat here as the THIRD dark consumer on the strength of one measured fact: "the
    // leaf itself is reached by NOBODY under src/ (its stage is ENC-3, unbuilt)". ENC-3 is
    // built, `envoyPulse.js` mounts the stage, and that fact is now false — so the row is
    // MOVED to LIT_CONSUMERS below rather than kept, because a dark roster that holds a
    // reachable member is the one failure this split was created to make impossible. The
    // ruling, its measured chain and the reason it is a re-classification rather than a
    // widening are written on the new row; nothing about the leaf's OWN read changed and
    // it was never a defect. This stub exists so a reader who greps this roster for the
    // leaf finds the withdrawal instead of a silence.
  ].sort());

  /**
   * THE LIT ROSTER — one row, and it is the faith tab's authored deity display.
   * `chains` are asserted hop by hop, in the direction of the import, so the arm proves
   * the DESIGNED PATH EXISTS rather than merely tolerating it.
   * ⚠ THE LAST MODULE HOP IS A DYNAMIC IMPORT (`dossierLazyTabs.js:57`,
   * `lazy(() => import('../new/tabs/FaithTab.jsx'))`) and the old `from '…'` matcher
   * could not see it — a lazily-imported leaf read as "reached by NOBODY". The edge
   * matcher below sees both forms, which is why this chain terminates at the real door
   * instead of appearing to die one hop short of it.
   */
  const LIT_CONSUMERS = Object.freeze([
    Object.freeze({
      rel: 'src/domain/display/faithDeepening.js',
      // W-FAITH F7c act 2: a deity's AUTHORED chart positions rendered as the catalog's
      // own words — top-3 character, boon and bane. Display of authored fields only.
      symbols: Object.freeze(['faithDeepeningOf', 'characterTop3', 'boonBaneRows', 'fieldEffectRows']),
      chains: Object.freeze([
        Object.freeze([
          'src/components/settlement/faithPanelModel.js',
          'src/components/new/tabs/FaithTab.jsx',
          'src/components/dossier/dossierLazyTabs.js',
          'src/components/OutputContainer.jsx',
        ]),
        Object.freeze([
          'src/components/settlement/faithPanelModel.js',
          'src/components/settlement/FaithSection.jsx',
          'src/components/new/tabs/FaithTab.jsx',
          'src/components/dossier/dossierLazyTabs.js',
          'src/components/OutputContainer.jsx',
        ]),
      ]),
    }),
    // ⭐⭐ ENC-1's CHANCE-MEETING LEAF, RE-CLASSIFIED FROM DARK TO LIT ON 2026-09-03, AND
    // THIS IS A PRODUCT STATEMENT RATHER THAN BOOKKEEPING. Until ENC-3 the leaf was read
    // by nobody, so the catalog stayed dark through it and the dark closure below said so.
    // ENC-3 built `envoyChanceMeetingStage.js` and `envoyPulse.js` mounts it, so the
    // vocabulary is now reachable from the production door — MEASURED as the chain below,
    // hop by hop, not inferred. The honest home for a reachable consumer is this roster,
    // whose obligation is a POSITIVE (this exact path exists) rather than a negative.
    //
    // ⚠ THE SECOND LIT ROW IS AN ENGINE CHAIN, NOT A DISPLAY CHAIN, and the difference is
    // stated rather than smuggled. `faithDeepening.js` above is reached because a player
    // opens a tab; this leaf is reached because the world takes a tick. Both terminate at
    // the same production door, which is what this roster's contract actually asks, but a
    // reader must not take the two rows to mean the same thing about what is on screen:
    // the catalog's WORDS reach a reader here only as far as a chance-meeting receipt is
    // rendered, and ENC-4 — which owns the Herald beats — is unbuilt and owner-blocked.
    //
    // ⛔ AND WHAT IS STILL TRUE, WHICH THIS ROW MUST NOT BE READ AS DENYING: at RUNTIME the
    // lane is dark in every world that exists. `chanceEncountersEnabled` is a VIRTUAL key,
    // MEASURED absent from DEFAULT_SIMULATION_RULES and from all 7 presets, and the stage's
    // one strict `=== true` gate sits ABOVE every call into this leaf, so `resolveChanceMeeting`
    // is invoked zero times in a shipped world (the dormancy fence's FENCE 3 is a
    // pass-through spy that asserts exactly that). What changed is STATIC reachability,
    // which is what this file measures and what the L5 inversion cares about. THE LIGHTING
    // WAVE, when it puts the key in the presets, changes the runtime half — and it will not
    // red this file, so the runtime claim lives in the certification row, not here.
    //
    // ⚠ WHY THE L5 HAZARD DOES NOT TRAVEL THIS PATH, because that is the risk the darkness
    // existed to hold off: the leaf consumes `axisPositionForWord`, `wordForAxisPosition`
    // and `traitColumns` — catalog-NATIVE accessors with no second home — and none of the
    // four MIRRORED tables car L5 will invert. A catalog/legacy divergence therefore cannot
    // change engine behaviour through this chain before L5 lands its byte-identity proof.
    Object.freeze({
      rel: 'src/domain/worldPulse/envoyChanceMeeting.js',
      symbols: Object.freeze(['resolveChanceMeeting', 'censusChanceMeetingCandidates', 'selectChanceMeetings', 'CHANCE_MEETING_TUNING']),
      chains: Object.freeze([
        Object.freeze([
          'src/domain/worldPulse/envoyChanceMeetingStage.js',
          'src/domain/worldPulse/envoyPulse.js',
          'src/domain/worldPulse/pulseKernel.js',
          'src/domain/worldPulse/advanceCampaignWorld.js',
          'src/domain/worldPulse/index.js',
          'src/components/OutputContainer.jsx',
        ]),
      ]),
    }),
  ]);

  /** The production door the lit chains must terminate at, and the tag it must render. */
  const PRODUCTION_DOOR = 'src/components/OutputContainer.jsx';

  /**
   * ⛔ THE DARK CLOSURE — every module the catalog must stay dark THROUGH, with the
   * symbols that identify a reach into it. The darkness proof is one law over this
   * table: NOTHING OUTSIDE THE CLOSURE REACHES ANYTHING INSIDE IT. That is strictly
   * stronger than the per-file rows it replaces, because it cannot be satisfied by
   * adding a name — a new member drags its own reachers into the check with it.
   */
  const DARK_CLOSURE = Object.freeze([
    Object.freeze({ rel: 'src/domain/worldPulse/faithWitnessSource.js',
      symbols: Object.freeze(['faithWitnessEntries', 'exposureDemotion', 'FAITH_WITNESS_KIND', 'FAITH_WITNESS_TUNING']) }),
    Object.freeze({ rel: 'src/domain/npc/livedExperienceCatalog.js',
      symbols: Object.freeze(['EXPERIENCE_TABLE', 'LIVED_EXPERIENCE_KINDS', 'AMBIENT_EXPERIENCE_KINDS', 'experienceKindOf', 'experienceRowOf']) }),
    Object.freeze({ rel: 'src/domain/npc/livedExperienceFunnel.js',
      symbols: Object.freeze(['foldLivedExperience', 'effectiveChartOf', 'decayCharacterDrift', 'characterLegacyRecord']) }),
    Object.freeze({ rel: 'src/domain/npc/livedExperienceSources.js',
      symbols: Object.freeze(['collectLivedExperience', 'LIVED_EXPERIENCE_SOURCES', 'SOURCE_ADAPTER_OF']) }),
    // ⭐ CAR L7's third member on the funnel hop: the read model reaches the catalog's
    // kind roster and the funnel's band words, and is itself reached by NOBODY. It is
    // the lighting day's subject, and this closure is where it stays dark until then.
    Object.freeze({ rel: 'src/domain/npc/characterReadModel.js',
      symbols: Object.freeze(['characterDossier', 'biographyOf', 'characterArticles', 'readingOf', 'leadLine']) }),
    // ⛔⛔ ENC-1's chance-meeting leaf LEFT THIS CLOSURE ON 2026-09-03, AND THE ROW THAT
    // STOOD HERE PREDICTED THE DAY IT WOULD: "so a stage wired early reds HERE rather than
    // lighting the vocabulary unannounced. ENC-3 is the car that lights it, and it arrives
    // with the flag door and the dormancy proof." ENC-3 landed, this law red, and the red
    // was the instrument working exactly as designed — the single outside reacher it named
    // was `envoyChanceMeetingStage.js` and nothing else. Both conditions the row demanded
    // arrived with it: the flag door (`chanceEncountersActive`, ONE strict `=== true` read)
    // and the dormancy proof (tests/property/chanceEncountersDormancyFence.test.js).
    //
    // ⚠ AND IT WAS NOT ANSWERED BY WIDENING THIS CLOSURE, WHICH IS STRUCTURALLY IMPOSSIBLE
    // — MEASURED, not asserted. Admitting the stage as a seventh member drags its own
    // reachers in: `envoyPulse.js` at depth 1, `pulseKernel.js` at 2,
    // `advanceCampaignWorld.js` + `advanceInterval.js` at 3, and seven more at 4 including
    // `worldPulse/index.js`, two store slices and a worker — thirteen modules and still
    // climbing, terminating at the production door itself. A closure that must contain the
    // pulse is not a darkness claim. The leaf is therefore RE-CLASSIFIED as lit, and its
    // proof obligation inverts from a negative to a positive: see LIT_CONSUMERS above.
  ]);

  const ENROLLED_CONSUMERS = [...DARK_CONSUMERS, ...LIT_CONSUMERS.map(({ rel }) => rel)].sort();

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

  /** Every src file, read once by the arm that needs it. */
  const srcTexts = () => jsFilesUnder(join(REPO_ROOT, 'src'))
    .map((file) => [relative(REPO_ROOT, file).replace(/\\/g, '/'), readFileSync(file, 'utf8')]);

  /**
   * Who reaches `rel`, ignoring the modules already known to be inside the dark
   * closure. Two-stage read, exactly as `dependsOnCatalog` — and it is owed here for
   * a reason car L7 measured on itself: `livedExperienceCatalog.js`'s `faith_milieu`
   * row carries the RECEIPT STRING `'faithWitnessSource.js:faithWitnessEntries (...)'`,
   * and a comment-only strip convicted the catalog of CALLING the adapter. A quoted
   * name is a citation exactly as a commented one is.
   *
   * ⭐ AMENDED BY R-TAILF-1, and the amendment closes a real blind spot rather than a
   * theoretical one. The old matcher read `from '…/x.js'` only, so it could not see a
   * `.jsx` target at all (`'FaithTab.jsx'.replace('.js','')` yields `FaithTabx`) and
   * could not see a DYNAMIC `import('…')` either. A leaf reached only by
   * `lazy(() => import(…))` therefore read as reached by NOBODY — which is exactly how
   * production reaches the faith tab. Both forms and both extensions are matched now,
   * and the dark closure below was re-measured under the wider matcher rather than
   * assumed to be unaffected: it is unchanged, because no member has a lazy edge.
   * @param {readonly [string, string][]} texts @param {string} rel
   * @param {readonly string[]} symbols @param {readonly string[]} ignore
   */
  const reachersOf = (texts, rel, symbols, ignore) => {
    const base = rel.split('/').pop().replace(/\.(jsx|js|mjs)$/, '');
    const moduleRe = new RegExp(`(?:from\\s+|import\\s*\\(\\s*)'[^']*/${base}\\.(?:js|jsx|mjs)'`);
    const symbolRe = new RegExp(`\\b(${symbols.join('|')})\\s*[([.]`);
    return texts
      .filter(([name]) => name !== rel && !ignore.includes(name))
      .filter(([, text]) => moduleRe.test(stripComments(text)) || symbolRe.test(codeWithoutCitations(text)))
      .map(([name]) => name);
  };

  test('⭐ THE CATALOG IS STILL DARK THROUGH EVERY DARK CONSUMER — one law over a CLOSED closure', () => {
    // ⭐⭐ THE HALF THAT KEEPS THE ROSTER HONEST, AND IT IS WHAT DECIDED WHICH MIRRORS
    // BECAME IMPORTS. A DARK consumer production could reach would have opened the
    // catalog by proxy. Measured on this tree:
    //
    //   `faithWitnessSource.js`      imported by NOBODY                       ⇒ free
    //   `livedExperienceCatalog.js`  imported by the funnel, the sources leaf and the
    //                                read model, and each of those by nobody   ⇒ free
    //   `characterDrift.js`          imported by `characterConsumers.js`, which
    //                                `personaSlicer` / `clergyTraitPlane` /
    //                                `espionageTap` import                     ⇒ NOT free
    //   `characterConsumers.js`      the production door itself                ⇒ NOT free
    //
    // So two mirrors became imports and two did not, and the two that did not are
    // proven EQUAL instead, live, by the mirror census below. That is not a weaker
    // outcome — a declared mirror is not a cross-check, and a proven one is.
    const texts = srcTexts();
    const closureRels = DARK_CLOSURE.map(({ rel }) => rel);

    // ⛔ THE LAW, DERIVED: nothing OUTSIDE the closure reaches anything INSIDE it.
    // Every hop is asserted because every member is asserted; a claim that stopped at
    // the first hop would be a darkness proof one link short of the light.
    for (const { rel, symbols } of DARK_CLOSURE) {
      expect(
        reachersOf(texts, rel, symbols, []).filter((name) => !closureRels.includes(name)),
        `${rel} is reached from OUTSIDE the dark closure — the catalog is no longer dark`
        + ' through it. This is the lighting day\'s question, and it is not answered by'
        + ' widening a roster.',
      ).toEqual([]);
    }

    // ⛔ AND THE TWO ROSTERS MAY NOT TRADE MEMBERS. A dark consumer moved into the lit
    // set reds here, so the cure that turned this suite green while the darkness claim
    // went false is structurally unavailable.
    for (const rel of DARK_CONSUMERS) {
      expect(closureRels, `${rel} is a DARK consumer but is not inside the dark closure`).toContain(rel);
    }
    for (const { rel } of LIT_CONSUMERS) {
      // Through the helper, not as a bare exclusion: a collection that had drifted away
      // entirely would satisfy a plain absence check just as happily as a correct one.
      // The anchor is a closure member, so it travels the identical code path.
      // ⚠ THE ANCHOR IS CHOSEN TO DIFFER FROM THE MEMBER, and that is not pedantry: with
      // a fixed anchor, planting the FIRST closure member trips the helper's
      // anchor-equals-member misuse guard instead of its exclusion arm — a red, but for
      // the wrong reason, and a guard that convicts for the wrong reason is a guard whose
      // real arm has still never fired. Measured on plant A, then fixed here.
      const anchor = closureRels.find((name) => name !== rel);
      expectAbsentWithAnchor(closureRels, rel, anchor,
        `${rel} is enrolled as LIT, so it may not sit inside the dark closure`);
    }

    // anchored: both dark consumers really are on the tree and really do reach the
    // catalog, so none of the assertions above passed by matching nothing.
    for (const rel of DARK_CONSUMERS) {
      const row = texts.find(([name]) => name === rel);
      expect(row, `${rel} is missing from src/`).toBeTruthy();
      expect(dependsOnCatalog(row[1]), `${rel} must really consume the catalog`).toBe(true);
    }
    // …and the reacher scan itself finds things when there ARE things to find.
    expect(reachersOf(texts, 'src/domain/npc/characterConsumers.js',
      ['riskRegister', 'vettingTemperBand', 'effectiveDescriptors'], []).length).toBeGreaterThan(2);
  });

  // ⚠ RE-TITLED 2026-09-03: the roster gained a SECOND lit row (ENC-3's engine chain), so a
  // title naming only the faith tab described one of two chains this arm now walks. The
  // number of chains is deliberately NOT in the title — that figure lives in the roster.
  test('⭐ AND THE LIT PATHS REALLY EXIST — every lit consumer reaches the door, hop by hop', () => {
    // The POSITIVE half of R-TAILF-1. A lit consumer whose designed chain has quietly
    // broken is as much a defect as a dark one that has quietly lit — and this arm is
    // also what refuses a dark consumer smuggled into the lit roster, because such a
    // consumer has no production chain to show.
    const texts = srcTexts();
    /** @param {string} rel */
    const textOf = (rel) => {
      const row = texts.find(([name]) => name === rel);
      expect(row, `${rel} is missing from src/`).toBeTruthy();
      return row[1];
    };
    /** @param {string} importerRel @param {string} importeeRel */
    const importsModule = (importerRel, importeeRel) => {
      const base = importeeRel.split('/').pop().replace(/\.(jsx|js|mjs)$/, '');
      return new RegExp(`(?:from\\s+|import\\s*\\(\\s*)'[^']*/${base}\\.(?:js|jsx|mjs)'`)
        .test(stripComments(textOf(importerRel)));
    };

    let hops = 0;
    for (const { rel, chains } of LIT_CONSUMERS) {
      expect(dependsOnCatalog(textOf(rel)), `${rel} must really consume the catalog`).toBe(true);
      for (const chain of chains) {
        let downstream = rel;
        for (const hop of chain) {
          expect(
            importsModule(hop, downstream),
            `the lit chain is BROKEN: ${hop} no longer reaches ${downstream}. Either the`
            + ' designed display path moved, or this roster is stale — both are defects.',
          ).toBe(true);
          downstream = hop;
          hops += 1;
        }
        expect(chain[chain.length - 1], 'every lit chain must terminate at the production door')
          .toBe(PRODUCTION_DOOR);
      }
    }
    // The door itself: the tab is RENDERED, not merely imported — the last link between
    // a module graph and a thing a player can see.
    expect(codeWithoutCitations(textOf(PRODUCTION_DOOR)),
      'the faith tab is no longer rendered at the production door').toMatch(/<FaithTab\b/);
    // anchored: the chains really ran, so an empty roster could not pass this vacuously.
    expect(hops).toBeGreaterThan(6);
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
    // ⚠ THE EXPORTER COUNT ANCHORS THE TREE, NOT THE ROSTER, and the loop above passes
    // vacuously on an empty one. `axisById` is the roster's own anchor — the catalog's
    // reader must still be enrolled, or the two-owner name is kept out of nothing.
    expectAbsentWithAnchor(CATALOG_SYMBOLS, 'AXIS_LEVELS', 'axisById', 'the two-owner name stays out');
  });

  /**
   * ⭐⭐⭐ THE MIRROR CENSUS — ONE WALKER, AND IT IS WHAT TURNS FOUR DECLARATIONS INTO
   * FOUR CROSS-CHECKS (L6's law: a declared mirror is not a cross-check).
   *
   * Four L-line leaves restated this catalog's axis ids, band words, poles and
   * corruption vectors, each with a comment saying it MIRRORS rather than imports
   * because L1 was unlanded. L1 is landed. Two of the four became imports (see the
   * darkness measurement above); the remaining restatements are proven here.
   *
   * ⚠⚠ AND EVERY PIN THIS REPLACES WAS A SOURCE-TEXT REGEX SCRAPE OF THIS FILE. The
   * old reconcile pins parsed the catalog's own source with expressions like
   * `/id: '([A-Z]+)',[\s\S]*?corruptionVector: (null|'[a-z_]+')/g` — lazy quantifiers
   * pairing an id with whatever `corruptionVector:` came next — and each carried a
   * dead `existsSync` arm for a file that is now permanently present. They passed,
   * but they asserted a claim about TEXT, which is precisely the class this coupling
   * spent four walkers curing everywhere else. Every row below reads the LIVE value.
   *
   * ⭐ THE CENSUS IS TOTAL BY CONSTRUCTION, not by anyone remembering to extend it:
   * the last test asserts that EVERY src file naming this catalog at all is either an
   * enrolled consumer or an enrolled mirror. A fifth leaf cannot quietly restate the
   * chart.
   */
  describe('THE MIRROR CENSUS — every restatement of this catalog, proven against the live value', () => {
    const catalogIds = PARADIGM_AXES.map((axis) => axis.id).sort();

    test('MIRROR 1/4 — characterDrift.AXIS_LEVELS (retained: an import would light the catalog through L5\'s door)', () => {
      expect([...DRIFT_AXIS_LEVELS]).toEqual([...AXIS_LEVELS]);
      // Both directions AND non-trivially: two empty ladders would agree.
      expect(AXIS_LEVELS.length).toBe(3);
      expect(DRIFT_AXIS_LEVELS.length).toBe(AXIS_LEVELS.length);
    });

    test('MIRROR 2/4 — livedExperienceCatalog.PARADIGM_AXIS_IDS (now DERIVED, so the fork is gone)', () => {
      expect([...FUNNEL_AXIS_IDS]).toEqual(catalogIds);
      expect(catalogIds.length).toBe(17);
      // …and it is derived rather than restated: no second literal roster survives in
      // that leaf. The claim is asserted on the CODE, comments and strings blanked.
      const leaf = readFileSync(join(REPO_ROOT, 'src/domain/npc/livedExperienceCatalog.js'), 'utf8');
      expect(leaf).toContain('PARADIGM_AXES.map((axis) => axis.id)');
      const code = codeWithoutCitations(leaf);
      // The DERIVATION is the anchor, and it must survive the same strip the ids are judged
      // by — otherwise a strip that blanked the whole file would report all seventeen ids
      // correctly absent from nothing.
      for (const id of catalogIds) {
        expectAbsentWithAnchor(code, id, 'PARADIGM_AXES.map((axis) => axis.id)', `${id} is still hand-kept here`);
      }
    });

    test('MIRROR 3/4 — characterConsumers.CORRUPTIBLE_AXIS_VECTORS equals the corruptionVector column', () => {
      const fromCatalog = Object.fromEntries(PARADIGM_AXES
        .filter((axis) => axis.corruptionVector)
        .map((axis) => [axis.id, axis.corruptionVector]));
      expect({ ...CORRUPTIBLE_AXIS_VECTORS }).toEqual(fromCatalog);
      // L1 MEASURED the reach at seven of seventeen; a census that agreed on an empty
      // column would prove nothing, so the count is pinned live at both ends.
      expect(Object.keys(fromCatalog).length).toBe(7);
      expect(PARADIGM_AXES.filter((axis) => axis.corruptionVector === null).length).toBe(10);
    });

    test('MIRROR 4/4 — characterConsumers.RISK_CENTER_AXES names REAL axes (a selection, not a copy)', () => {
      // ⚠ THIS ONE COULD NEVER HAVE BEEN AN IMPORT, AND THAT IS A PROPERTY OF THE
      // VALUE RATHER THAN OF THE LAYERING. F15 fixed WHICH two axes R6's centre reads;
      // an import cannot express a choice, only the things chosen from. So the mirror
      // stays and what is proven is that both names resolve — which is the whole of
      // what could go wrong with it.
      for (const axisId of [RISK_CENTER_AXES.nerve, RISK_CENTER_AXES.restraint]) {
        expect(catalogIds, `${axisId} is read by R6 but unknown to the chart`).toContain(axisId);
        expect(axisById(axisId), `${axisId} must resolve through the catalog's own reader`).toBeTruthy();
      }
      // ⚠ THE ANNOTATION THAT USED TO SIT HERE WAS INVISIBLE: it ran to a SECOND line, and
      // the walker reads only the line immediately above the assertion, so this site was
      // un-anchored in fact while reading as annotated. Anchored mechanically instead —
      // R6's own `nerve` axis must still be in the roster for the refusal to mean anything.
      expectAbsentWithAnchor(catalogIds, 'AMBITION', RISK_CENTER_AXES.nerve, 'a phantom axis resolves nowhere');
      expect(axisById('AMBITION')).toBeFalsy();
    });

    test('⭐ AND THE POLE WORDS EVERY FUNNEL PULL NAMES RESOLVE — live, not scraped', () => {
      // The old pin built a regex per pull and matched it against this file's SOURCE.
      // Same claim, asked of the objects.
      const byId = new Map(PARADIGM_AXES.map((axis) => [axis.id, axis]));
      let checked = 0;
      for (const kind of LIVED_EXPERIENCE_KINDS) {
        for (const pull of EXPERIENCE_TABLE[kind].pulls) {
          const axis = byId.get(pull.axisId);
          expect(axis, `${kind}: ${pull.axisId} is not a chart axis`).toBeTruthy();
          expect(['virtue', 'vice'], `${kind}: ${pull.pole}`).toContain(pull.pole);
          expect(axis[pull.pole].word.length, `${kind}: ${pull.axisId}.${pull.pole} has no word`).toBeGreaterThan(2);
          checked += 1;
        }
      }
      // anchored: the loop really ran over a substantial table.
      expect(checked).toBeGreaterThan(40);
    });

    test('⛔⛔ THE CENSUS IS TOTAL — every src file naming this catalog is enrolled somewhere', () => {
      // The ratchet that makes the four rows above a census rather than a list. A
      // fifth leaf that restates the chart must join one of the two rosters or red
      // here — it cannot arrive unnoticed the way these four did.
      const MIRROR_LEAVES = [
        'src/domain/customContentSchema.js',   // poles/levels/chart ids — proven in deityAuthoredCharacter.test.js
        'src/domain/npc/characterConsumers.js',
        'src/domain/npc/characterDrift.js',
      ];
      // ⭐ CITATION LEAVES — files that name the catalog ONLY in prose (a comment or a JSDoc
      // block citing car L1's PARADIGM_WORD_PROJECTION_SEAM), never in code. Enrolled so the
      // census stays TOTAL without amputating a correct citation; the control below proves
      // each names it in ZERO code positions, so an import or a dereference arriving in any
      // of them reds this arm rather than hiding behind the roster. The estate's own citation
      // law (this file's `:477`: comments AND strings are citations), applied to its own
      // census. W-LIVES L7 cites the seam at characterReadModel.js:24/:29; W-LIVES L8 at
      // characterEdit.js:118 and characterEditView.js:44.
      const CITATION_LEAVES = [
        // W-FAITH F5c's flaw register: it names the catalog three times in PROSE only
        // (measured with this file's own `codeWithoutCitations` — zero code positions),
        // declaring `DEITY_FLAW_LEVELS` a MIRROR of `AXIS_LEVELS`. The mirror is not
        // merely declared: `deityFlaws.test.js:116` proves it equal to the live value,
        // so the restatement is cross-checked where the census would otherwise trust it.
        'src/domain/worldPulse/deityFlaws.js',
        'src/domain/npc/characterEdit.js',
        'src/domain/npc/characterEditView.js',
        'src/domain/npc/characterReadModel.js',
      ];
      for (const rel of CITATION_LEAVES) {
        const raw = readFileSync(join(REPO_ROOT, rel), 'utf8');
        expect(raw, `${rel} must really name the catalog`).toMatch(/paradigmAxisCatalog/);
        // anchored: the positive on the line above proves this file's raw text really names the catalog, so the strip below is doing work rather than matching an empty subject
        expect(codeWithoutCitations(raw), `${rel} must cite the catalog in prose only`).not.toMatch(/paradigmAxisCatalog/);
      }
      const namers = jsFilesUnder(join(REPO_ROOT, 'src'))
        .filter((file) => !file.endsWith('paradigmAxisCatalog.js'))
        .filter((file) => /paradigmAxisCatalog/.test(readFileSync(file, 'utf8')))
        .map((file) => relative(REPO_ROOT, file).replace(/\\/g, '/'))
        .sort();
      expect(namers).toEqual([...ENROLLED_CONSUMERS, ...MIRROR_LEAVES, ...CITATION_LEAVES].sort());
      // anchored: the scan is over a real tree and really found the enrolled set,
      // so an empty or renamed roster could not pass this vacuously.
      // ⭐ TEN BECAME ELEVEN AT ENC-1, and the count moves with the roster on purpose:
      // it is the arm that refuses a roster grown to swallow whatever the tree happens to
      // hold, so it is edited by the car that names the eleventh file and by nobody else.
      expect(namers.length).toBe(11);
    });
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
