/**
 * tests/security/intentAtlasIdFree.test.js — THE ID-FREE GUARANTEE for the AI intent atlas
 * (docs/DESIGN_AI_INTENT_ATLAS.md §3.4, build law §4.2).
 *
 * The atlas ships an aggregate picture of how users build into AI prompts. The design's hard
 * constraint is that the aggregate is provably id-free and k-anonymous, in the spirit of the
 * `payload_redacted` reconstruction posture: not "we intended no ids", but "a gate reads the
 * committed artifact and reds on one".
 *
 * WHAT IS ENFORCED HERE:
 *   1. KEY ALLOWLIST — every key of every cell is in ATLAS_CELL_KEYS. An allowlist, not a
 *      denylist, because a denylist has to predict the shape of the leak.
 *   2. VALUE SHAPE — every string value is a controlled-vocabulary token, and separately
 *      fails every id-shaped pattern (uuid, email, long numeric run, long hex run); every
 *      numeric value (n, effect, weight) is finite and inside its declared range.
 *   3. K-ANONYMITY — every USERS cell's n is an integer at or above ATLAS_K_FLOOR. Soak cells
 *      are EXEMPT, and the exemption is explicit rather than incidental: a soak cell's n counts
 *      generated worlds, and there is no actor behind it to be anonymous. MIN_N still binds on
 *      both, read as worlds rather than authors for the soak half.
 *   4. THE INERT CONTRACT, now per surface — a surface the distillate holds no clearing cell
 *      for yields the empty string, so a caller appends unconditionally and the prompt is
 *      byte-identical either way. The soak prior speaks to `construct` and `customContent`;
 *      `interpret` and `autonomy` remain byte-zero.
 *   5. NO LAUNDERING — the checks run over the RAW committed JSON, and the module's own view
 *      of the cells is asserted to equal it. A module that quietly filtered a bad cell could
 *      otherwise hide one from this gate forever.
 *   6. THE EVIDENCE FLOOR (owner amendment 2026-07-27, design §7) — every cell carries n,
 *      effect and weight; no cell with weight below WEIGHT_FLOOR or n below MIN_N may exist
 *      IN THE FILE AT ALL. The law is that below-floor cells are dropped at generation and
 *      never ship, so this gate proves the artifact obeys it rather than trusting the
 *      renderer to hide them. The renderer's belt is proven separately, on fixtures, because
 *      a belt that only ever runs on an empty list has never been shown to hold.
 *   7. DECLARED PROVENANCE — the distillate states the thresholds it was generated under and
 *      they must equal the module's EVIDENCE_FLOOR. A run under a laxer bar therefore cannot
 *      ship quietly; it has to disagree with the constants in writing first.
 *   8. THE SOURCE TAG (owner ruling 2026-07-27, wave L-8a, design §8) — every cell declares
 *      `source`, it is one of ATLAS_CELL_SOURCES, and no soak cell carries a weight above
 *      SOAK_WEIGHT_CAP. A prior that could speak at full volume would defeat the point of
 *      shipping it as a prior.
 *   9. THE SUPERSESSION LAW — when a users cell and a soak cell name the same
 *      (surface, dimension, bucket, coBucket) key, only the users cell renders. Pinned on a
 *      fixture, because the committed artifact holds no such collision yet and a law nothing
 *      exercises is a comment.
 *  10. THE PROVENANCE SENTENCE — a rendered block that contains a generated line says so, and
 *      a block that does not, does not. Both directions, because a caveat that is always
 *      present is a caveat nobody reads.
 *
 * ANTI-VACUITY: the artifact now carries real soak cells, so checks 1 to 3, 6 and 8 walk
 * something. The positive controls stay load-bearing anyway, and become more so: the users half
 * of every rule is still exercised only by seeded cells, because no users cell exists yet. The
 * same checker that reads the artifact is run against seeded cells carrying each violation
 * class and must reject each one. Without them this file would go on passing the day a real
 * telemetry distillate lands broken.
 *
 * E-A MANIFEST ENTRY: landed in-tree 2026-07-27 by owner order (kind "rationale" in
 * scripts/mutation-coverage-manifest.json — the untracked-target amendment forbids
 * kind "mutation" while this file is untracked). FOLD COUPLING SURVIVES: that manifest
 * hunk must ride the SAME fold commit as this file. Committed without it, the entry keys
 * a path that does not exist at HEAD and reds tests/lint/mutationCoverageManifest.test.js
 * as a stale entry; committed the other way round, TOTALITY reds instead.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  ATLAS_CELL_KEYS,
  ATLAS_CELL_SOURCES,
  ATLAS_K_FLOOR,
  ATLAS_NUMERIC_CELL_KEYS,
  ATLAS_RENDER_CAP,
  ATLAS_SURFACES,
  EVIDENCE_FLOOR,
  SOAK_WEIGHT_CAP,
  buildIntentAtlasSection,
  buildIntentAtlasSectionFrom,
  intentAtlasCells,
  intentAtlasEvidence,
  intentAtlasVersion,
} from '../../src/domain/intentAtlas.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DISTILLATE = join(ROOT, 'src/domain/data/intentAtlas.distillate.json');

const raw = JSON.parse(readFileSync(DISTILLATE, 'utf8'));

// ── the detectors ────────────────────────────────────────────────────────────

/** Id-shaped patterns. Each carries the name it reports under so a failure names the class. */
const ID_SHAPES = [
  { name: 'uuid', re: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i },
  { name: 'email', re: /[^\s@]+@[^\s@]+\.[^\s@]+/ },
  { name: 'long-numeric', re: /\d{6,}/ },
  { name: 'long-hex', re: /\b[0-9a-f]{16,}\b/i },
];

/**
 * The controlled-vocabulary token shape every string value must take. Letters, digits, and
 * the three separators the registered vocabularies already use, 64 characters at most. Free
 * text cannot pass this, which is the point: prose is where an id hides.
 */
const TOKEN = /^[A-Za-z][A-Za-z0-9_.-]{0,63}$/;

const REQUIRED_KEYS = ['surface', 'dimension', 'bucket', 'n', 'effect', 'weight', 'source'];

/**
 * Inspect one cell and return every problem found, as human-readable strings.
 * @param {unknown} cell
 * @param {string} where a label for the failure message
 * @returns {string[]}
 */
function problemsWith(cell, where) {
  /** @type {string[]} */
  const problems = [];
  if (!cell || typeof cell !== 'object' || Array.isArray(cell)) {
    return [`${where}: not an object`];
  }
  const record = /** @type {Record<string, unknown>} */ (cell);

  for (const key of Object.keys(record)) {
    if (!ATLAS_CELL_KEYS.includes(key)) {
      problems.push(`${where}: key "${key}" is outside the declared allowlist [${ATLAS_CELL_KEYS.join(', ')}]`);
    }
  }
  for (const key of REQUIRED_KEYS) {
    if (!(key in record)) problems.push(`${where}: required key "${key}" is missing`);
  }

  if ('surface' in record && !ATLAS_SURFACES.includes(String(record.surface))) {
    problems.push(`${where}: surface "${String(record.surface)}" is not one of [${ATLAS_SURFACES.join(', ')}]`);
  }

  if ('source' in record && !ATLAS_CELL_SOURCES.includes(String(record.source))) {
    problems.push(`${where}: source "${String(record.source)}" is not one of [${ATLAS_CELL_SOURCES.join(', ')}]`);
  }
  // A cell with no readable tag is judged as a users cell, which is the STRICTER reading: it
  // keeps the k-anonymity floor on, so a lost tag can never quietly buy a cell an exemption.
  // The missing-key check above is what actually reports the omission.
  const isSoak = record.source === 'soak';

  const n = record.n;
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    problems.push(`${where}: n must be an integer, got ${JSON.stringify(n)}`);
  } else {
    // TWO FLOORS, REPORTED SEPARATELY. k is a privacy floor and MIN_N is a sample floor; they
    // happen to be checked on the same field because one actor is one observation, but a
    // future ruling could move either without the other, and a failure should name which bar
    // the cell missed.
    //
    // THE SOAK EXEMPTION IS FROM k ONLY. A soak cell's n counts generated worlds, so there is
    // no actor behind it and k-anonymity is INAPPLICABLE rather than satisfied. MIN_N (30)
    // currently exceeds k (10), so the exemption changes no outcome today; it is written
    // anyway, because a future ruling that lowered MIN_N below k would otherwise silently
    // start making an anonymity claim about a population that does not exist.
    if (!isSoak && n < ATLAS_K_FLOOR) {
      problems.push(`${where}: n=${n} is below the k-anonymity floor of ${ATLAS_K_FLOOR}`);
    }
    if (n < EVIDENCE_FLOOR.MIN_N) {
      problems.push(`${where}: n=${n} is below the evidence floor MIN_N of ${EVIDENCE_FLOOR.MIN_N}`);
    }
  }

  const effect = record.effect;
  if (typeof effect !== 'number' || !Number.isFinite(effect)) {
    problems.push(`${where}: effect must be a finite number, got ${JSON.stringify(effect)}`);
  } else if (effect < -1 || effect > 1) {
    problems.push(`${where}: effect=${effect} is outside the phi range of -1 to +1`);
  }

  const weight = record.weight;
  if (typeof weight !== 'number' || !Number.isFinite(weight)) {
    problems.push(`${where}: weight must be a finite number, got ${JSON.stringify(weight)}`);
  } else if (weight > 1) {
    problems.push(`${where}: weight=${weight} is above 1, and no confidence weight can be`);
  } else if (weight < EVIDENCE_FLOOR.WEIGHT_FLOOR) {
    problems.push(
      `${where}: weight=${weight} is below the evidence floor WEIGHT_FLOOR of `
      + `${EVIDENCE_FLOOR.WEIGHT_FLOOR}. Below-floor cells are DROPPED AT GENERATION and must `
      + `never reach the committed file; the renderer's belt is a second line, not the line.`,
    );
  } else if (isSoak && weight > SOAK_WEIGHT_CAP) {
    problems.push(
      `${where}: weight=${weight} is above SOAK_WEIGHT_CAP (${SOAK_WEIGHT_CAP}). A PRIOR MUST `
      + `NEVER OUTSHOUT OBSERVED EVIDENCE: cap it in the DISTILLER, not in the renderer and not `
      + `in this gate.`,
    );
  }

  for (const [key, value] of Object.entries(record)) {
    if (ATLAS_NUMERIC_CELL_KEYS.includes(key)) continue;
    if (typeof value !== 'string') {
      problems.push(`${where}: ${key} must be a string, got ${JSON.stringify(value)}`);
      continue;
    }
    for (const shape of ID_SHAPES) {
      if (shape.re.test(value)) {
        problems.push(`${where}: ${key} carries an id-shaped value (${shape.name}): ${JSON.stringify(value)}`);
      }
    }
    if (!TOKEN.test(value)) {
      problems.push(`${where}: ${key} is not a controlled-vocabulary token: ${JSON.stringify(value)}`);
    }
  }
  return problems;
}

// ── the committed artifact ───────────────────────────────────────────────────

describe('intent atlas distillate — the committed artifact is well formed', () => {
  it('declares an atlasVersion, a generatedFrom, and a cells array', () => {
    expect(typeof raw.atlasVersion).toBe('string');
    expect(raw.atlasVersion).toMatch(/^\d+\.\d+\.\d+$/);
    // ADJUSTED for wave L-8a: `generatedFrom` was string-or-null while the only conceivable
    // provenance was "nothing". The soak prior has a provenance worth reading (what kind of
    // corpus, how many worlds, which generator built them), and a hand-written sentence would
    // be a claim nobody could check. A structured block is checked below.
    expect(raw.generatedFrom === null
      || typeof raw.generatedFrom === 'string'
      || (typeof raw.generatedFrom === 'object' && !Array.isArray(raw.generatedFrom))).toBe(true);
    expect(Array.isArray(raw.cells)).toBe(true);
  });

  it('a structured generatedFrom names its kind, its corpus size, and the generator', () => {
    if (raw.generatedFrom === null || typeof raw.generatedFrom === 'string') return;
    // NO TIMESTAMP, deliberately and checkably. The design forbids anything finer than a week,
    // and this artifact is a pure function of its corpus: carrying no clock at all is both the
    // simplest way to obey that rule and what makes the distiller's determinism test possible.
    expect(typeof raw.generatedFrom.kind).toBe('string');
    expect(raw.generatedFrom.kind).toMatch(/^[a-z][a-z0-9-]*$/);
    expect(Number.isInteger(raw.generatedFrom.seedCount)).toBe(true);
    expect(raw.generatedFrom.seedCount).toBeGreaterThan(0);
    expect(typeof raw.generatedFrom.generatorVersion).toBe('string');
    for (const value of Object.values(raw.generatedFrom)) {
      if (typeof value !== 'string') continue;
      for (const shape of ID_SHAPES) {
        expect(shape.re.test(value), `generatedFrom carries an id-shaped value (${shape.name}): ${value}`).toBe(false);
      }
    }
  });

  it('every cell that says it came from a soak declares the corpus that produced it', () => {
    // A soak cell with no recorded corpus is an unfalsifiable claim: nothing states what was
    // run, so nothing can be re-run to check it. Bind the two together.
    const soak = raw.cells.filter((c) => c.source === 'soak');
    if (soak.length === 0) return;
    expect(raw.generatedFrom, 'soak cells shipped with no generatedFrom block').toBeTruthy();
    expect(String(raw.generatedFrom.kind)).toMatch(/^soak-/);
  });

  it('the module reports the same version the artifact declares', () => {
    expect(intentAtlasVersion()).toBe(raw.atlasVersion);
  });

  it('no cell is laundered: the module view equals the raw committed cells', () => {
    // The gate below reads `raw`. If the module filtered cells on load, a bad cell could sit
    // in the committed file, pass unnoticed into a future generator's assumptions, and never
    // be seen here. Pin the two views together.
    expect(JSON.parse(JSON.stringify(intentAtlasCells()))).toEqual(raw.cells);
  });
});

describe('intent atlas distillate — every cell is id-free, allowlisted, and k-anonymous', () => {
  it('no cell carries an id-shaped value, an unlisted key, or an n below the floor', () => {
    /** @type {string[]} */
    const problems = [];
    raw.cells.forEach((cell, i) => {
      problems.push(...problemsWith(cell, `cells[${i}]`));
    });
    expect(
      problems,
      `\nThe committed intent-atlas distillate violates the id-free guarantee `
      + `(docs/DESIGN_AI_INTENT_ATLAS.md §3.4). Fix the GENERATOR, never the gate:\n`
      + `${problems.join('\n')}\n`,
    ).toEqual([]);
  });
});

// ── the inert contract (Phase A) ─────────────────────────────────────────────

describe('intent atlas — the inert contract, now proven per surface', () => {
  // ADJUSTED for wave L-8a. The two claims this block used to make ("the distillate holds no
  // cells" and "every surface renders the empty string") were the same claim twice, and both
  // were statements about a corpus that no longer is empty. What was actually being protected
  // is that a surface the atlas has nothing to say about costs a prompt nothing, and that is
  // now checked against the artifact rather than asserted about it: a surface with no clearing
  // cell must render '', and a surface with clearing cells must render a section that names
  // itself. Stated this way the contract keeps holding as the corpus fills, instead of having
  // to be rewritten every time it does.
  const clearing = (surface) => raw.cells.filter(
    (c) => c.surface === surface
      && Number(c.n) >= EVIDENCE_FLOOR.MIN_N
      && Number(c.weight) >= EVIDENCE_FLOOR.WEIGHT_FLOOR,
  );

  for (const surface of ATLAS_SURFACES) {
    it(`buildIntentAtlasSection("${surface}") matches what the artifact holds for it`, () => {
      const out = buildIntentAtlasSection(surface);
      if (clearing(surface).length === 0) {
        expect(out, `surface "${surface}" has no clearing cell and must cost the prompt nothing`).toBe('');
      } else {
        expect(out.startsWith(`INTENT ATLAS ${intentAtlasVersion()} (surface: ${surface})`)).toBe(true);
      }
    });
  }

  it('at least one surface is still inert, so the empty-section path stays exercised', () => {
    // Every surface rendering something would silently retire the '' branch that every caller
    // depends on. While the users corpus is empty, `interpret` and `autonomy` are that proof.
    const inert = ATLAS_SURFACES.filter((s) => buildIntentAtlasSection(s) === '');
    expect(inert.length, 'no surface renders the empty string any more').toBeGreaterThan(0);
  });

  it('an unknown surface key also yields the empty string rather than throwing', () => {
    expect(buildIntentAtlasSection('styleOverhaul')).toBe('');
    expect(buildIntentAtlasSection('not-a-surface')).toBe('');
    expect(buildIntentAtlasSection('')).toBe('');
    // @ts-expect-error deliberately wrong type: a non-string caller must not crash a prompt.
    expect(buildIntentAtlasSection(undefined)).toBe('');
  });

  it('the declared vocabulary is frozen and sorted, so a cell schema cannot drift silently', () => {
    expect(Object.isFrozen(ATLAS_CELL_KEYS)).toBe(true);
    expect(Object.isFrozen(ATLAS_SURFACES)).toBe(true);
    expect(Object.isFrozen(ATLAS_CELL_SOURCES)).toBe(true);
    expect([...ATLAS_CELL_KEYS]).toEqual([...ATLAS_CELL_KEYS].sort());
    expect([...ATLAS_SURFACES]).toEqual([...ATLAS_SURFACES].sort());
    expect([...ATLAS_CELL_SOURCES]).toEqual([...ATLAS_CELL_SOURCES].sort());
    expect([...ATLAS_CELL_SOURCES]).toEqual(['soak', 'users']);
    expect(ATLAS_CELL_KEYS).toContain('source');
    expect(ATLAS_K_FLOOR).toBe(10);
  });

  it('the prior ceiling and the render cap hold their manager-set defaults', () => {
    // Owner-vetoable (delegated 2026-07-27). Pinned for the same reason EVIDENCE_FLOOR is: a
    // change to either number changes what a model is told and how loudly, so it should be a
    // deliberate act that reds here and gets read.
    expect(SOAK_WEIGHT_CAP).toBe(0.5);
    expect(ATLAS_RENDER_CAP).toBe(12);
    // The cap must sit strictly inside the weight range, or capping would delete cells by
    // pushing them under the floor, or would not cap anything at all.
    expect(SOAK_WEIGHT_CAP).toBeGreaterThan(EVIDENCE_FLOOR.WEIGHT_FLOOR);
    expect(SOAK_WEIGHT_CAP).toBeLessThan(1);
  });
});

// ── the positive controls (the anti-vacuity half) ────────────────────────────

describe('intent atlas — the id-free checker discriminates (positive controls)', () => {
  /** A cell that must pass every check. */
  const CLEAN = {
    surface: 'construct', dimension: 'settType', bucket: 'town', n: 42, effect: 0.31, weight: 0.85,
    source: 'users',
  };

  it('accepts a clean cell, with and without the optional coBucket', () => {
    expect(problemsWith(CLEAN, 'clean')).toEqual([]);
    expect(problemsWith({ ...CLEAN, coBucket: 'river' }, 'clean2')).toEqual([]);
  });

  const VIOLATIONS = [
    ['a uuid in a value', { ...CLEAN, bucket: '3f2504e0-4f89-11d3-9a0c-0305e82c3301' }, /uuid/],
    ['an email in a value', { ...CLEAN, bucket: 'dm@example.com' }, /email/],
    ['a long numeric run', { ...CLEAN, bucket: 'user1234567' }, /long-numeric/],
    ['a long hex run', { ...CLEAN, bucket: 'a1b2c3d4e5f60718' }, /long-hex/],
    ['free text rather than a token', { ...CLEAN, bucket: 'a gritty trade town' }, /controlled-vocabulary token/],
    ['a key outside the allowlist', { ...CLEAN, userId: 'abc' }, /outside the declared allowlist/],
    ['a session key outside the allowlist', { ...CLEAN, sessionId: 'abc' }, /outside the declared allowlist/],
    ['a timestamp key outside the allowlist', { ...CLEAN, capturedAt: 'abc' }, /outside the declared allowlist/],
    ['an n below the k floor', { ...CLEAN, n: 9 }, /below the k-anonymity floor/],
    ['an n of zero', { ...CLEAN, n: 0 }, /below the k-anonymity floor/],
    ['a non-integer n', { ...CLEAN, n: 12.5 }, /n must be an integer/],
    ['a missing n', { surface: 'construct', dimension: 'settType', bucket: 'town' }, /required key "n" is missing/],
    ['an unregistered surface', { ...CLEAN, surface: 'styleOverhaul' }, /is not one of/],
  ];

  /**
   * The source-tag class (wave L-8a), kept as its OWN list so the E-A manifest's count of the
   * thirteen VIOLATIONS seeds above stays true.
   */
  const SOURCE_VIOLATIONS = [
    ['a missing source tag', { surface: 'construct', dimension: 'settType', bucket: 'town', n: 42, effect: 0.31, weight: 0.85 }, /required key "source" is missing/],
    ['an unregistered source', { ...CLEAN, source: 'vibes' }, /source "vibes" is not one of/],
    ['a source that is not a string', { ...CLEAN, source: 7 }, /source must be a string/],
    ['a soak cell above the prior ceiling', { ...CLEAN, source: 'soak', weight: 0.85 }, /above SOAK_WEIGHT_CAP/],
    ['a soak cell one step above the ceiling', { ...CLEAN, source: 'soak', n: 900, weight: SOAK_WEIGHT_CAP + 0.01 }, /above SOAK_WEIGHT_CAP/],
    ['a soak cell under the sample floor, which no exemption covers', { ...CLEAN, source: 'soak', n: 12, weight: 0.4 }, /below the evidence floor MIN_N/],
  ];

  for (const [label, cell, expected] of SOURCE_VIOLATIONS) {
    it(`rejects ${label}`, () => {
      const found = problemsWith(cell, 'seed');
      expect(found.length, `expected a problem for: ${JSON.stringify(cell)}`).toBeGreaterThan(0);
      expect(found.join('\n')).toMatch(expected);
    });
  }

  it('accepts a soak cell at the ceiling, and a users cell far above it', () => {
    // The cap binds ONE source. A users cell at weight 0.85 is the whole reason the cap exists.
    expect(problemsWith({ ...CLEAN, source: 'soak', n: 400, weight: SOAK_WEIGHT_CAP }, 'soakBar')).toEqual([]);
    expect(problemsWith({ ...CLEAN, source: 'users', weight: 0.99 }, 'usersLoud')).toEqual([]);
  });

  it('exempts a soak cell from the k-anonymity floor without exempting a users cell', () => {
    // MIN_N exceeds k today, so the exemption is only observable below MIN_N. Read both cells
    // through the checker and compare which problems each reports: the users cell must be told
    // about k, the soak cell must not, and both must be told about MIN_N.
    const under = { ...CLEAN, n: 9, weight: 0.3 };
    const usersProblems = problemsWith({ ...under, source: 'users' }, 'u').join('\n');
    const soakProblems = problemsWith({ ...under, source: 'soak' }, 's').join('\n');
    expect(usersProblems).toMatch(/below the k-anonymity floor/);
    expect(soakProblems).not.toMatch(/below the k-anonymity floor/);
    expect(usersProblems).toMatch(/below the evidence floor MIN_N/);
    expect(soakProblems).toMatch(/below the evidence floor MIN_N/);
  });

  it('an untagged cell is judged by the STRICTER users rules, never the soak exemption', () => {
    // A dropped tag must not be a way to buy an exemption. The cell is reported missing its
    // source AND held to the k floor.
    const untagged = { surface: 'construct', dimension: 'settType', bucket: 'town', n: 9, effect: 0.1, weight: 0.3 };
    const found = problemsWith(untagged, 'seed').join('\n');
    expect(found).toMatch(/required key "source" is missing/);
    expect(found).toMatch(/below the k-anonymity floor/);
  });

  for (const [label, cell, expected] of VIOLATIONS) {
    it(`rejects ${label}`, () => {
      const found = problemsWith(cell, 'seed');
      expect(found.length, `expected a problem for: ${JSON.stringify(cell)}`).toBeGreaterThan(0);
      expect(found.join('\n')).toMatch(expected);
    });
  }

  it('rejects a non-object cell rather than passing it through', () => {
    expect(problemsWith(null, 'seed').length).toBeGreaterThan(0);
    expect(problemsWith('a string', 'seed').length).toBeGreaterThan(0);
    expect(problemsWith([CLEAN], 'seed').length).toBeGreaterThan(0);
  });

  it('the checker is the one the artifact is judged by (same function, same call shape)', () => {
    // Guard the guard: if problemsWith ever stopped returning problems (a refactor that
    // returned undefined, say), every assertion above would still read as green because
    // .toEqual([]) would be the only surviving claim. Prove it returns a real array here.
    expect(Array.isArray(problemsWith(CLEAN, 'clean'))).toBe(true);
    expect(Array.isArray(problemsWith({ ...CLEAN, n: 1 }, 'seed'))).toBe(true);
  });
});

// ── the evidence floor (owner amendment 2026-07-27, design §7) ───────────────
//
// NOTE for the E-A manifest: the thirteen seeded violation cells its rationale counts are the
// VIOLATIONS list above, which is unchanged. The evidence-class seeds below are an additional
// list, so that count stays true.

/** A cell that clears every floor, for the weighting seeds to deviate from. */
const ABOVE_FLOOR = Object.freeze({
  surface: 'construct',
  dimension: 'settType',
  bucket: 'town',
  n: 1240,
  effect: 0.31,
  weight: 0.85,
  // A USERS cell, deliberately: weight 0.85 is above SOAK_WEIGHT_CAP, so this fixture doubles
  // as proof that the cap binds one source rather than the schema.
  source: 'users',
});

/** The same association as ABOVE_FLOOR, told by the prior instead. */
const SOAK_CELL = Object.freeze({
  surface: 'construct',
  dimension: 'settType',
  bucket: 'town',
  n: 400,
  effect: 0.31,
  weight: SOAK_WEIGHT_CAP,
  source: 'soak',
});

describe('intent atlas — the evidence constants are frozen, pinned, and mutually consistent', () => {
  it('EVIDENCE_FLOOR is frozen and holds the manager-set defaults the design records', () => {
    // Owner-vetoable defaults (delegated 2026-07-27). Pinned so a change is a deliberate act
    // that reds here and gets read, rather than a number quietly drifting between waves.
    expect(Object.isFrozen(EVIDENCE_FLOOR)).toBe(true);
    expect(EVIDENCE_FLOOR.FDR_Q).toBe(0.05);
    expect(EVIDENCE_FLOOR.MIN_N).toBe(30);
    expect(EVIDENCE_FLOOR.WEIGHT_FLOOR).toBe(0.25);
  });

  it('the sample floor is at least the privacy floor, so statistics can never relax anonymity', () => {
    expect(EVIDENCE_FLOOR.MIN_N).toBeGreaterThanOrEqual(ATLAS_K_FLOOR);
  });

  it('the numeric-key roster is frozen, sorted, and a subset of the cell allowlist', () => {
    expect(Object.isFrozen(ATLAS_NUMERIC_CELL_KEYS)).toBe(true);
    expect([...ATLAS_NUMERIC_CELL_KEYS]).toEqual([...ATLAS_NUMERIC_CELL_KEYS].sort());
    for (const key of ATLAS_NUMERIC_CELL_KEYS) expect(ATLAS_CELL_KEYS).toContain(key);
  });

  it('the documented weight convention maps exactly-threshold evidence to WEIGHT_FLOOR', () => {
    // The distiller implements this mapping; the module documents it; this pins the two
    // endpoints that make `weight >= WEIGHT_FLOOR` and `q <= FDR_Q` the same statement. If a
    // future ruling changes the curve, the identity is what must survive.
    const weightFor = (q) => 1 - (q / EVIDENCE_FLOOR.FDR_Q) * (1 - EVIDENCE_FLOOR.WEIGHT_FLOOR);
    expect(weightFor(EVIDENCE_FLOOR.FDR_Q)).toBeCloseTo(EVIDENCE_FLOOR.WEIGHT_FLOOR, 10);
    expect(weightFor(0)).toBe(1);
    expect(weightFor(EVIDENCE_FLOOR.FDR_Q * 2)).toBeLessThan(EVIDENCE_FLOOR.WEIGHT_FLOOR);
  });
});

describe('intent atlas distillate — the artifact declares the bar it was generated under', () => {
  it('carries an evidence block whose thresholds equal the module constants', () => {
    expect(raw.evidence, 'the distillate must record its generation thresholds').toBeTruthy();
    expect(raw.evidence.fdrQ).toBe(EVIDENCE_FLOOR.FDR_Q);
    expect(raw.evidence.minN).toBe(EVIDENCE_FLOOR.MIN_N);
    expect(raw.evidence.weightFloor).toBe(EVIDENCE_FLOOR.WEIGHT_FLOOR);
  });

  it('a distillate holding soak cells declares the ceiling they were capped at', () => {
    // Same logic as the thresholds above: a run under a laxer ceiling has to say so in writing
    // rather than merely shipping louder cells and hoping the per-cell check is the only one.
    if (!raw.cells.some((c) => c.source === 'soak')) return;
    expect(raw.evidence.soakWeightCap, 'soak cells shipped with no declared cap').toBe(SOAK_WEIGHT_CAP);
  });

  it('records how many cells were tested and how many survived, and the two agree with the file', () => {
    // The FDR correction is meaningless without its denominator, and the shipped cells cannot
    // supply it: everything that failed is gone by construction. Recording the denominator is
    // what makes the correction checkable after the fact rather than merely claimed.
    expect(Number.isInteger(raw.evidence.cellsTested)).toBe(true);
    expect(Number.isInteger(raw.evidence.cellsKept)).toBe(true);
    expect(raw.evidence.cellsKept).toBe(raw.cells.length);
    expect(raw.evidence.cellsKept).toBeLessThanOrEqual(raw.evidence.cellsTested);
  });

  it('the module view of the provenance is the raw block, not a synthesized one', () => {
    // Same no-laundering logic as the cells pin: a module that filled in its own constants for
    // a missing block would make an unchecked artifact read as compliant.
    expect(JSON.parse(JSON.stringify(intentAtlasEvidence()))).toEqual(raw.evidence);
  });
});

describe('intent atlas — no below-floor cell can ship (the structural exclusion law)', () => {
  it('every committed cell carries a valid n, effect, and weight', () => {
    /** @type {string[]} */
    const problems = [];
    raw.cells.forEach((cell, i) => {
      for (const key of ['n', 'effect', 'weight']) {
        if (!(key in cell)) problems.push(`cells[${i}]: missing "${key}"`);
      }
      problems.push(...problemsWith(cell, `cells[${i}]`));
    });
    expect(problems, `\n${problems.join('\n')}\n`).toEqual([]);
  });

  it('no committed cell sits below WEIGHT_FLOOR or below MIN_N', () => {
    // The redundant half of the check above, stated on its own because it is the LAW rather
    // than a shape rule: a cell below either bar must not exist in the file, because a model
    // cannot be trusted to ignore data on instruction. The distiller drops it; this proves it.
    const below = raw.cells.filter(
      (c) => !(Number(c.weight) >= EVIDENCE_FLOOR.WEIGHT_FLOOR) || !(Number(c.n) >= EVIDENCE_FLOOR.MIN_N),
    );
    expect(
      below,
      `\nBelow-floor cells reached the committed distillate. Fix the DISTILLER (drop them at `
      + `generation), never the renderer and never this gate:\n${JSON.stringify(below, null, 2)}\n`,
    ).toEqual([]);
  });

  const EVIDENCE_VIOLATIONS = [
    ['a weight below the floor', { ...ABOVE_FLOOR, weight: 0.24 }, /below the evidence floor WEIGHT_FLOOR/],
    ['a weight of zero', { ...ABOVE_FLOOR, weight: 0 }, /below the evidence floor WEIGHT_FLOOR/],
    ['a weight above 1', { ...ABOVE_FLOOR, weight: 1.4 }, /is above 1/],
    ['a missing weight', { surface: 'construct', dimension: 'settType', bucket: 'town', n: 1240, effect: 0.31, source: 'users' }, /required key "weight" is missing/],
    ['a non-numeric weight', { ...ABOVE_FLOOR, weight: '0.85' }, /weight must be a finite number/],
    ['a NaN weight', { ...ABOVE_FLOOR, weight: Number.NaN }, /weight must be a finite number/],
    ['a missing effect', { surface: 'construct', dimension: 'settType', bucket: 'town', n: 1240, weight: 0.85, source: 'users' }, /required key "effect" is missing/],
    ['an effect above the phi range', { ...ABOVE_FLOOR, effect: 1.2 }, /outside the phi range/],
    ['an effect below the phi range', { ...ABOVE_FLOOR, effect: -1.01 }, /outside the phi range/],
    ['a non-numeric effect', { ...ABOVE_FLOOR, effect: 'strong' }, /effect must be a finite number/],
    ['an n over the k floor but under the sample floor', { ...ABOVE_FLOOR, n: 20 }, /below the evidence floor MIN_N/],
  ];

  for (const [label, cell, expected] of EVIDENCE_VIOLATIONS) {
    it(`rejects ${label}`, () => {
      const found = problemsWith(cell, 'seed');
      expect(found.length, `expected a problem for: ${JSON.stringify(cell)}`).toBeGreaterThan(0);
      expect(found.join('\n')).toMatch(expected);
    });
  }

  it('accepts a cell sitting exactly ON both floors, so the bar is inclusive as documented', () => {
    const onTheBar = { ...ABOVE_FLOOR, n: EVIDENCE_FLOOR.MIN_N, weight: EVIDENCE_FLOOR.WEIGHT_FLOOR };
    expect(problemsWith(onTheBar, 'bar')).toEqual([]);
  });
});

describe('intent atlas — the renderer belt, proven on fixtures the empty corpus cannot reach', () => {
  const BELOW = Object.freeze({
    surface: 'construct', dimension: 'threatPosture', bucket: 'raiders', n: 900, effect: 0.06, weight: 0.19,
    source: 'users',
  });
  const UNDERSAMPLED = Object.freeze({
    surface: 'construct', dimension: 'tradeTie', bucket: 'coastal', n: 12, effect: 0.44, weight: 0.91,
    source: 'users',
  });

  it('a distillate whose cells are ALL below the floor renders the empty string', () => {
    // The inert contract, re-proven for the case that is not "no data" but "no evidence".
    expect(buildIntentAtlasSectionFrom('construct', [BELOW, UNDERSAMPLED])).toBe('');
    for (const surface of ATLAS_SURFACES) {
      expect(buildIntentAtlasSectionFrom(surface, [BELOW, UNDERSAMPLED])).toBe('');
    }
  });

  it('an empty cell list renders the empty string on every surface', () => {
    // ADJUSTED for wave L-8a. This also asserted byte-equality with buildIntentAtlasSection,
    // which was only ever true because the committed atlas was itself empty: it pinned a
    // coincidence rather than a contract, and the real contract (an empty list costs a prompt
    // nothing) is what survives. The committed-artifact side is checked against the artifact
    // in the per-surface inert block above, which stays true as the corpus fills.
    for (const surface of ATLAS_SURFACES) {
      expect(buildIntentAtlasSectionFrom(surface, [])).toBe('');
    }
  });

  it('an above-floor cell renders with its weight, its effect, and the scaling instruction', () => {
    const out = buildIntentAtlasSectionFrom('construct', [ABOVE_FLOOR, BELOW, UNDERSAMPLED]);
    expect(out.startsWith(`INTENT ATLAS ${intentAtlasVersion()} (surface: construct)`)).toBe(true);
    expect(out).toContain('    settType: town (weight 0.85, effect +0.31, n=1240)');
    expect(out).toContain('HOW MUCH TO WEIGH EACH LINE.');
    expect(out).toContain('Scale how far you let a line move your reading by its weight.');
    expect(out).toContain('ABSENCE CARRIES NO INFORMATION');
    expect(out).toContain(`${EVIDENCE_FLOOR.WEIGHT_FLOOR.toFixed(2)} means the pattern only just cleared the bar`);
    expect(out.split('\n\n')).toHaveLength(4);
  });

  it('the belt DROPS the below-floor and undersampled lines from a mixed list', () => {
    // Without this the previous test would pass on a renderer that printed everything.
    const out = buildIntentAtlasSectionFrom('construct', [ABOVE_FLOOR, BELOW, UNDERSAMPLED]);
    expect(out).not.toContain('raiders');
    expect(out).not.toContain('coastal');
    expect(out.split('\n').filter((l) => l.startsWith('    '))).toHaveLength(1);
  });

  it('renders the co-occurrence form, the sign of a negative effect, and no negative zero', () => {
    const out = buildIntentAtlasSectionFrom('construct', [
      { ...ABOVE_FLOOR, coBucket: 'river' },
      { ...ABOVE_FLOOR, dimension: 'zzOrder', bucket: 'keep', effect: -0.27 },
      { ...ABOVE_FLOOR, dimension: 'zzzTiny', bucket: 'hamlet', effect: -0.001 },
    ]);
    expect(out).toContain('    settType: town with river (weight 0.85, effect +0.31, n=1240)');
    expect(out).toContain('    zzOrder: keep (weight 0.85, effect -0.27, n=1240)');
    expect(out).toContain('    zzzTiny: hamlet (weight 0.85, effect +0.00, n=1240)');
  });

  it('cells for another surface never leak into this one', () => {
    expect(buildIntentAtlasSectionFrom('interpret', [ABOVE_FLOOR])).toBe('');
  });

  it('an unknown surface, a non-array cell list, and a non-string key all yield the empty string', () => {
    expect(buildIntentAtlasSectionFrom('not-a-surface', [ABOVE_FLOOR])).toBe('');
    // @ts-expect-error deliberately wrong types: a bad caller must not crash a prompt.
    expect(buildIntentAtlasSectionFrom('construct', null)).toBe('');
    // @ts-expect-error deliberately wrong types.
    expect(buildIntentAtlasSectionFrom(undefined, [ABOVE_FLOOR])).toBe('');
  });

  it('rendering is byte-stable across calls and independent of input order', () => {
    const a = buildIntentAtlasSectionFrom('construct', [ABOVE_FLOOR, { ...ABOVE_FLOOR, bucket: 'city' }]);
    const b = buildIntentAtlasSectionFrom('construct', [{ ...ABOVE_FLOOR, bucket: 'city' }, ABOVE_FLOOR]);
    expect(a).toBe(b);
    expect(a).toBe(buildIntentAtlasSectionFrom('construct', [ABOVE_FLOOR, { ...ABOVE_FLOOR, bucket: 'city' }]));
  });
});

// ── the soak prior: supersession, provenance, ceiling, cap (wave L-8a) ───────

describe('intent atlas — the SUPERSESSION LAW replaces the prior, never averages it', () => {
  it('a users cell and a soak cell on the same key render as ONE line, the users one', () => {
    const out = buildIntentAtlasSectionFrom('construct', [SOAK_CELL, ABOVE_FLOOR]);
    const lines = out.split('\n').filter((l) => l.startsWith('    '));
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe('    settType: town (weight 0.85, effect +0.31, n=1240)');
    // No blend, no average, and no trace of the prior's numbers anywhere in the block. The
    // marker is matched with its punctuation: the bare word also appears in the standing
    // instruction text ("Lines below the bar were never generated"), which is not a marker.
    expect(out).not.toContain(', generated)');
    expect(out).not.toContain('n=400');
  });

  it('supersession is decided by the key, so a soak cell on a DIFFERENT key survives beside it', () => {
    // Without this the previous test would also pass on a renderer that dropped every soak
    // cell the moment any users cell existed, which would throw away the whole prior on first
    // contact with telemetry.
    const elsewhere = { ...SOAK_CELL, bucket: 'city' };
    const out = buildIntentAtlasSectionFrom('construct', [elsewhere, ABOVE_FLOOR]);
    const lines = out.split('\n').filter((l) => l.startsWith('    '));
    expect(lines).toHaveLength(2);
    expect(out).toContain('    settType: city (weight 0.50, effect +0.31, n=400, generated)');
    expect(out).toContain('    settType: town (weight 0.85, effect +0.31, n=1240)');
  });

  it('the coBucket is part of the key: a users cell on one pairing cannot retire another', () => {
    const soakWith = { ...SOAK_CELL, coBucket: 'river' };
    const out = buildIntentAtlasSectionFrom('construct', [soakWith, ABOVE_FLOOR]);
    expect(out).toContain('    settType: town with river (weight 0.50, effect +0.31, n=400, generated)');
    expect(out).toContain('    settType: town (weight 0.85, effect +0.31, n=1240)');
  });

  it('a users cell BELOW the floor still retires the prior it displaced', () => {
    // The echo-risk mitigation at its sharpest. Once a key has been observed at all, the atlas
    // stops speaking the engine's guess about it, even when the observation is too weak to say
    // anything itself. The alternative resurrects the prior exactly when real evidence has
    // started to disagree with it.
    const weakObserved = { ...ABOVE_FLOOR, weight: 0.19 };
    expect(buildIntentAtlasSectionFrom('construct', [SOAK_CELL, weakObserved])).toBe('');
  });

  it('supersession is scoped to a surface: the same pairing on another surface is untouched', () => {
    const soakElsewhere = { ...SOAK_CELL, surface: 'customContent' };
    const out = buildIntentAtlasSectionFrom('customContent', [soakElsewhere, ABOVE_FLOOR]);
    expect(out).toContain('    settType: town (weight 0.50, effect +0.31, n=400, generated)');
  });
});

describe('intent atlas — the prior speaks quietly and says where it came from', () => {
  it('a soak-bearing block carries the provenance paragraph and drops the authorship claim', () => {
    const out = buildIntentAtlasSectionFrom('construct', [SOAK_CELL]);
    expect(out).toContain('WHERE THE GENERATED LINES COME FROM.');
    expect(out).toContain('they describe how generated worlds hang together, not how people build');
    expect(out).toContain('HOW THESE THINGS TEND TO GO TOGETHER.');
    expect(out).not.toContain('distinct authors');
    expect(out).toContain(`${String(EVIDENCE_FLOOR.MIN_N)} independent observations`);
    expect(out.split('\n\n')).toHaveLength(5);
  });

  it('an all-users block carries NO provenance paragraph and keeps the authorship claim', () => {
    // Both directions, because a caveat that is always present is a caveat nobody reads.
    const out = buildIntentAtlasSectionFrom('construct', [ABOVE_FLOOR]);
    expect(out).not.toContain('WHERE THE GENERATED LINES COME FROM.');
    expect(out).not.toContain(', generated)');
    expect(out).toContain('HOW OTHER PEOPLE BUILD.');
    expect(out).toContain(`${String(EVIDENCE_FLOOR.MIN_N)} distinct authors behind every line`);
    expect(out.split('\n\n')).toHaveLength(4);
  });

  it('a mixed block marks the generated lines and only those', () => {
    const out = buildIntentAtlasSectionFrom('construct', [{ ...SOAK_CELL, bucket: 'city' }, ABOVE_FLOOR]);
    const lines = out.split('\n').filter((l) => l.startsWith('    '));
    expect(lines.filter((l) => l.includes(', generated'))).toHaveLength(1);
    expect(lines.find((l) => l.includes('city'))).toMatch(/, generated\)$/);
    expect(lines.find((l) => l.includes('town'))).not.toMatch(/generated/);
  });

  it('the belt CLAMPS an over-loud soak cell to the ceiling rather than shouting it', () => {
    // The gate reds on this cell in the committed file; the belt is what stops a bad artifact
    // reaching a model in the meantime. Clamped and not dropped, because the cap is about
    // standing rather than support: the regularity is real, it just does not get to be loud.
    const tooLoud = { ...SOAK_CELL, weight: 0.98 };
    const out = buildIntentAtlasSectionFrom('construct', [tooLoud]);
    expect(out).toContain(`(weight ${SOAK_WEIGHT_CAP.toFixed(2)}, effect +0.31, n=400, generated)`);
    expect(out).not.toContain('0.98');
  });

  it('a users cell above the ceiling is NOT clamped, which is the whole point of the ceiling', () => {
    const out = buildIntentAtlasSectionFrom('construct', [ABOVE_FLOOR]);
    expect(out).toContain('(weight 0.85, effect +0.31, n=1240)');
  });
});

describe('intent atlas — the render cap is a ranking, not a truncation', () => {
  /** ATLAS_RENDER_CAP + 4 soak cells, each a different bucket, with descending effect. */
  const many = Array.from({ length: ATLAS_RENDER_CAP + 4 }, (_, i) => ({
    ...SOAK_CELL,
    bucket: `b${String(i).padStart(2, '0')}`,
    effect: Number((0.9 - i * 0.02).toFixed(2)),
  }));

  it('renders at most ATLAS_RENDER_CAP lines', () => {
    const out = buildIntentAtlasSectionFrom('construct', many);
    expect(out.split('\n').filter((l) => l.startsWith('    '))).toHaveLength(ATLAS_RENDER_CAP);
  });

  it('keeps the strongest and drops the weakest, rather than keeping whatever came first', () => {
    // The cells arrive in descending-effect order, so a renderer that simply sliced the input
    // would pass the count check above and this one; feed it REVERSED to separate the two.
    const out = buildIntentAtlasSectionFrom('construct', [...many].reverse());
    expect(out).toContain('b00');
    expect(out).toContain(`b${String(ATLAS_RENDER_CAP - 1).padStart(2, '0')}`);
    expect(out).not.toContain(`b${String(ATLAS_RENDER_CAP + 3).padStart(2, '0')}`);
  });

  it('an observed cell outranks every capped prior, whatever their effects say', () => {
    // The cap is what makes this true by construction: a users cell in the upper half of the
    // weight range cannot be crowded out by priors, even a prior with a much larger effect.
    const loudPriors = many.map((c) => ({ ...c, effect: 0.99 }));
    const quietObserved = { ...ABOVE_FLOOR, weight: 0.51, effect: 0.02, bucket: 'zzz' };
    const out = buildIntentAtlasSectionFrom('construct', [...loudPriors, quietObserved]);
    expect(out).toContain('settType: zzz');
  });

  it('the cap selection is order-independent, so two runs choose the same K', () => {
    const a = buildIntentAtlasSectionFrom('construct', many);
    const b = buildIntentAtlasSectionFrom('construct', [...many].reverse());
    expect(a).toBe(b);
  });
});
