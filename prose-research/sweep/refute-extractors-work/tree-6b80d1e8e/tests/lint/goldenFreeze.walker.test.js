/**
 * tests/lint/goldenFreeze.walker.test.js — THE ROSTER-COMPLETE WALKER OVER THE FROZEN ESTATE.
 *
 * WHAT IT ENFORCES. tests/fixtures/.golden-freeze-register.json is the one inventory of every
 * same-seed instrument in this repository. This walker is what makes that inventory a claim
 * rather than an archive: it runs on every gate, it derives the roster FROM THE TREE, and it
 * convicts four different ways —
 *
 *   · a manifest edited without its register row, or a register row edited without its manifest
 *     (the byte hash binds both directions);
 *   · a golden instrument present in the tree with neither a register row nor a WRITTEN
 *     exclusion (the roster is closed, so silence is not a disposition);
 *   · a capture arm that writes its own fixture instead of going through the signed door;
 *   · a roster that has silently collapsed — a scan that suddenly finds three goldens must RED,
 *     never pass smaller.
 *
 * ⛔ WHY THIS FILE AND NOT A HOOK OR A CI STEP. §709.5 measured it: the sandbox line carries zero
 * .husky/, zero scripts/ enforcement and zero eslint — the vitest run is its whole gate. An
 * in-tree vitest walker is the ONLY enforcement arm that exists on every line the estate is
 * built on, which is why the load-bearing half of the freeze lives here and the commit-trailer
 * backstop is merely advisory.
 *
 * ⭐ THE DENOMINATOR IS DERIVED, NEVER SPELLED. The defect this design was amended to cure ([A1])
 * was an enumeration keyed to the single spelling `UPDATE_GOLDEN`, under which four same-seed
 * goldens minted under other spellings escaped every arm — and the enforcement's green meant
 * less than it looked. So arm 2 enumerates by PATTERN over the parsed source, and every match is
 * either register-enrolled or on an affirmative, written exclusion roster. A new suite minted
 * tomorrow under a spelling nobody has thought of yet is caught the day it lands.
 *
 * ⭐ COMMENT-STRIPPED SEMANTICS, AND WHY THEY ARE LOAD-BEARING. The enumerator walks the espree
 * AST, not the raw text. A file whose HEADER merely mentions a refresh ritual does not thereby
 * become a golden instrument — the panel's own proof case is the bare `process.env.UPDATE_` hit
 * inside a comment in sovereigntyLightingContract.walker.test.js, which a text scan enrolls and
 * an AST scan correctly ignores. The same discipline runs the other way: a capture arm hidden
 * under an odd spelling is still a MemberExpression on `process.env`, so it cannot hide.
 * PARSE_OPTIONS are eslint.config.js's base languageOptions spelled back, exactly as the lighting
 * walker does it, so a file the lint gate can read is a file this walker can read.
 *
 * ⛔ THE REGISTER IS UNFROZEN TODAY, AND THIS WALKER IS GREEN AGAINST IT ON PURPOSE. `frozenAt`
 * is null until the TE-GOLDEN-1 freeze act cuts the record at L9, on the post-T13 tree. Arms that
 * compare against RECORDED values (byte hashes, row counts, distinct floors, the genesis signed
 * record) are therefore gated on `frozenAt !== null` and state so in their titles. That is not a
 * disarmed arm: while unfrozen, this walker asserts the INVERSE — that no row carries a recorded
 * value at all — so a lane that quietly cut a record before the owner signed convicts here
 * immediately. Everything structural (the roster closure, the exclusion roster, the constant
 * census, the door-import closure, the sentinel floor, the schema, the tri-state closure) is LIVE
 * TODAY and does real work on every gate run before the freeze ever happens.
 *
 * ⭐ EVERY ARM SHIPS A PLANT, AND THE PLANTS RUN ON EVERY GATE. §851.1's second face: a comparator
 * must be proven ABLE to see. A discrimination control that runs once at a landing proves the
 * instrument worked that day; one that runs on every gate proves it still works. All plants
 * operate on IN-MEMORY synthetic inputs — this walker never mutates the repository, and the
 * refused-read discipline is preserved: the plant is kept executable as a control arm, never as
 * the measurement.
 *
 * ⚠ ITS OWN PARK STATE. This file is deliberately written in straight-line `it('literal', …)`
 * form with no `it.each`, no `test.each` and no `for…of` at a describe/test statement position.
 * Any of those PARKS the whole file in the lighting census and takes every literal title in it
 * out of evidence — a shape that has bitten three landings. All iteration happens either at
 * module scope or inside an `it` callback body.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { parse } from 'espree';
import { describe, it, expect } from 'vitest';

import {
  ACTIONS,
  PROOF_FORMS,
  REFUSALS,
  commitTrailerRefusal,
  dirtyPathsFrom,
  isBlankProvenance,
  rowsIn,
  verifyShiftRecord,
} from '../helpers/goldenRecordDoor.js';
import { normalizeForDormancy, rawBitFormOf, stableBitFormOf } from '../helpers/dormancyOracle.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** [A6] SELF-EXCLUSIONS BY IDENTITY. Without these the machinery convicts itself at genesis. */
const SELF_REL = 'tests/lint/goldenFreeze.walker.test.js';
const DOOR_REL = 'tests/helpers/goldenRecordDoor.js';
const REGISTER_REL = 'tests/fixtures/.golden-freeze-register.json';

/** eslint.config.js's base languageOptions, spelled back. See the header. */
const PARSE_OPTIONS = Object.freeze({
  ecmaVersion: 'latest',
  sourceType: 'module',
  ecmaFeatures: { jsx: true },
  range: true,
});

/** The pattern census. NOT the one spelling — see [A1] in the header. */
const GOLDEN_ENV_PATTERN = /^UPDATE_[A-Z_]+$/;
const HEX64 = /^[0-9a-f]{64}$/;

// ── THE TREE, READ ONCE AT MODULE SCOPE ──────────────────────────────────────────────
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const TREE_FILES = walk(join(ROOT, 'tests'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .sort();

const TEST_FILES = TREE_FILES
  .filter((rel) => /\.test\.(js|jsx)$/.test(rel))
  .map((rel) => ({ rel, src: readFileSync(join(ROOT, rel), 'utf8') }));

const REGISTER = JSON.parse(readFileSync(join(ROOT, REGISTER_REL), 'utf8'));
const SURFACES = REGISTER.surfaces ?? [];
const FROZEN = REGISTER.frozenAt !== null && REGISTER.frozenAt !== undefined;

// ── THE AST READERS ──────────────────────────────────────────────────────────────────
function astOf(src) {
  try { return parse(src, PARSE_OPTIONS); } catch { return null; }
}

/** Every node in an espree tree, comments excluded by construction (they are not nodes). */
function nodesOf(node, acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (Array.isArray(node)) {
    for (const child of node) nodesOf(child, acc);
    return acc;
  }
  if (typeof node.type === 'string') acc.push(node);
  for (const key of Object.keys(node)) {
    if (key === 'range' || key === 'loc' || key === 'parent') continue;
    nodesOf(node[key], acc);
  }
  return acc;
}

/**
 * The golden-adjacent env spellings a SOURCE reads, from its syntax tree.
 * `process.env.X` is a MemberExpression over a MemberExpression; a mention in a comment is not
 * a node at all, which is precisely the discrimination this arm needs.
 */
export function envSpellingsIn(src) {
  const ast = astOf(src);
  if (!ast) return [];
  const found = new Set();
  for (const node of nodesOf(ast)) {
    if (node.type !== 'MemberExpression' || node.computed) continue;
    const { object, property } = node;
    if (!property || property.type !== 'Identifier') continue;
    if (!object || object.type !== 'MemberExpression' || object.computed) continue;
    if (object.object?.type !== 'Identifier' || object.object.name !== 'process') continue;
    if (object.property?.type !== 'Identifier' || object.property.name !== 'env') continue;
    if (GOLDEN_ENV_PATTERN.test(property.name)) found.add(property.name);
  }
  return [...found].sort();
}

/** Every 64-hex STRING LITERAL a source pins. A hash in a comment is not a pin. */
export function constantsIn(src) {
  const ast = astOf(src);
  if (!ast) return [];
  const out = [];
  for (const node of nodesOf(ast)) {
    if (node.type === 'Literal' && typeof node.value === 'string' && HEX64.test(node.value)) {
      out.push(node.value);
    }
  }
  return out;
}

/** Does this source route its writes through the signed door? */
export function importsDoor(src) {
  const ast = astOf(src);
  if (!ast) return false;
  for (const node of nodesOf(ast)) {
    if (node.type !== 'ImportDeclaration') continue;
    if (typeof node.source?.value === 'string' && node.source.value.endsWith('/goldenRecordDoor.js')) {
      return true;
    }
  }
  return false;
}

/** Does this source write a file itself? The single-writer law's negative half. */
export function callsWriteFileSync(src) {
  const ast = astOf(src);
  if (!ast) return false;
  for (const node of nodesOf(ast)) {
    if (node.type !== 'CallExpression') continue;
    const callee = node.callee;
    if (callee?.type === 'Identifier' && callee.name === 'writeFileSync') return true;
    if (callee?.type === 'MemberExpression' && callee.property?.name === 'writeFileSync') return true;
  }
  return false;
}

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

// ── THE DERIVED ROSTER ───────────────────────────────────────────────────────────────
const ENROLLED_ENVS = new Set(SURFACES.map((s) => s.recordEnv).filter(Boolean));
const EXCLUDED_ENVS = new Set((REGISTER.excludedEnvSpellings ?? []).map((e) => e.envSpelling));

/** Every test file that reads a golden-adjacent env spelling, excluding this walker itself. */
const ENV_CARRIERS = TEST_FILES
  .filter(({ rel }) => rel !== SELF_REL)
  .map(({ rel, src }) => ({ rel, spellings: envSpellingsIn(src) }))
  .filter(({ spellings }) => spellings.length > 0);

/** Carriers whose spellings are all enrolled — the set the door migration must cover. */
const ENROLLED_CARRIERS = ENV_CARRIERS
  .filter(({ spellings }) => spellings.some((s) => ENROLLED_ENVS.has(s)))
  .map(({ rel }) => rel);

const CONSTANT_CARRIERS = TEST_FILES
  .filter(({ rel }) => rel.startsWith('tests/property/'))
  .map(({ rel, src }) => ({ rel, constants: constantsIn(src) }))
  .filter(({ constants }) => constants.length > 0);

/**
 * ARM 4's FLOOR. The roster may only GROW between refreezes; a shrink demands a register-row
 * retirement through the door, which is owner-signed. Measured at 8b07ce45f, the build base:
 * 43 env-bearing carriers + 3 in-file-constant carriers.
 */
const ROSTER_FLOOR = Object.freeze({ envCarriers: 43, constantCarriers: 3, surfaces: 48 });

// ── IN-MEMORY PLANTS. Synthetic sources; the repository is never mutated. ─────────────
const PLANT_NEW_SPELLING = [
  "import { writeFileSync } from 'node:fs';",
  'const MANIFEST = "tests/fixtures/synthetic-golden.json";',
  'if (process.env.UPDATE_SYNTHETIC_GOLDEN) {',
  '  writeFileSync(MANIFEST, JSON.stringify({}));',
  '}',
].join('\n');

const PLANT_COMMENT_ONLY = [
  '/**',
  ' * Capture/refresh: UPDATE_MENTIONED_GOLDEN=1 npx vitest run this.test.js',
  ' * A header that names a ritual is prose, not an instrument. process.env.UPDATE_',
  ' */',
  'const answer = 1;',
].join('\n');

const PLANT_CONSTANT = [
  "const PRE_SYNTHETIC_SHA = '"
    + '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' + "';",
  'export default PRE_SYNTHETIC_SHA;',
].join('\n');

const PLANT_CONSTANT_IN_COMMENT = [
  '// the pre-feature corpus hashed to',
  '// 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef at the time',
  'const answer = 1;',
].join('\n');

const PLANT_UNMIGRATED_ARM = [
  "import { writeFileSync } from 'node:fs';",
  'if (process.env.UPDATE_GOLDEN) {',
  '  writeFileSync(MANIFEST, bytes);',
  '}',
].join('\n');

const PLANT_MIGRATED_ARM = [
  "import { recordGolden } from '../helpers/goldenRecordDoor.js';",
  'if (process.env.UPDATE_GOLDEN) {',
  "  recordGolden({ surface: 's', path: MANIFEST, produce: () => bytes });",
  '}',
].join('\n');

/** A well-formed signed record, and the surface identity it authorizes. */
const GOOD_RECORD = Object.freeze({
  ownerWords: 'Freeze the same-seed golden estate at the post-TRANS bytes.',
  ownerDate: '2026-09-01',
  odqRow: '§879',
  cause: 'the TE-GOLDEN-1 freeze act',
  seat: 'chair (Fable 5.1)',
  surfaces: [{
    surface: 'plant-surface',
    action: 're-record',
    predictedRows: 525,
    proofForm: 'settlement-hash',
  }],
});
const asked = { surface: 'plant-surface', proofForm: 'settlement-hash' };
const withRecord = (patch) => verifyShiftRecord({ ...GOOD_RECORD, ...patch }, asked);
const withSurface = (patch) => withRecord({ surfaces: [{ ...GOOD_RECORD.surfaces[0], ...patch }] });

// ─────────────────────────────────────────────────────────────────────────────────────
describe('golden freeze register — schema, provenance and the tri-state closure', () => {
  it('the register parses and declares an integer registerVersion', () => {
    expect(Number.isInteger(REGISTER.registerVersion)).toBe(true);
    expect(REGISTER.registerVersion).toBeGreaterThan(0);
  });

  it('the register carries a non-empty _doc block naming its own laws', () => {
    expect(Array.isArray(REGISTER._doc)).toBe(true);
    expect(REGISTER._doc.join(' ')).toContain('NEVER HAND-EDIT');
  });

  it('frozenAt, frozenAtSha and genesis are null together or set together', () => {
    // An interrupted freeze act that reads as a complete one is how a freeze certifies bytes
    // nobody recorded. Three fields, one state.
    const state = [REGISTER.frozenAt, REGISTER.frozenAtSha, REGISTER.genesis]
      .map((v) => (v === null || v === undefined ? 'null' : 'set'));
    expect(new Set(state).size,
      `the freeze block is half-filled: frozenAt=${state[0]} frozenAtSha=${state[1]}`
      + ` genesis=${state[2]}. A partially executed freeze act must convict, not pass.`).toBe(1);
  });

  it('the inventory block names the sha it was measured at, who measured it, when, and why', () => {
    const inv = REGISTER.inventory ?? {};
    for (const key of ['measuredAtSha', 'measuredBy', 'date', 'note']) {
      expect(isBlankProvenance(inv[key]), `inventory.${key} is blank provenance`).toBe(false);
    }
  });

  it('every surface row carries a stable identity, a path and a suite', () => {
    const bad = SURFACES.filter((s) => !s.surface || !s.path || !s.suite);
    expect(bad.map((s) => s.surface ?? '(unnamed)')).toEqual([]);
  });

  it('no two surface rows share an identity', () => {
    const seen = new Map();
    const dupes = [];
    for (const s of SURFACES) {
      if (seen.has(s.surface)) dupes.push(s.surface);
      seen.set(s.surface, true);
    }
    expect(dupes).toEqual([]);
  });

  it('every register-row path exists in the tree', () => {
    const present = new Set(TREE_FILES);
    const missing = SURFACES
      .filter((s) => !present.has(s.path) && !s.path.startsWith('tests/pdf/__snapshots__'))
      .map((s) => `${s.surface} -> ${s.path}`);
    expect(missing).toEqual([]);
  });

  it('the unresolved roster is exactly what the tree still shows', () => {
    // An item on this list cannot be resolved by forgetting it: if a suite named here has been
    // deleted or given a manifest, this arm reds and the list must be re-ruled, not re-typed.
    const listed = REGISTER.unresolvedRoster?.fixturelessDormancyGoldens?.suites ?? [];
    const present = new Set(TREE_FILES);
    const vanished = listed.filter((rel) => !present.has(rel));
    expect(vanished, 'an unresolved-roster entry no longer exists in the tree').toEqual([]);
  });
});

describe('arm 1 — BYTES: the register row and its manifest bind each other', () => {
  it('while the register is UNFROZEN, no row carries a recorded value', () => {
    // The inverse assertion, and it is the one that does work today. The freeze act cuts the
    // record at L9 on the post-T13 tree; a lane that filled one of these fields early has
    // recorded bytes the owner never signed, and this is where that shows.
    if (FROZEN) {
      expect(true, 'register is frozen; this arm is inapplicable').toBe(true);
      return;
    }
    const cut = SURFACES.filter((s) => s.sha256 !== null || s.rows !== null
      || s.ownerRow !== null || s.distinctFloor !== null || s.seedSet !== null
      || (s.frozenConstants ?? null) !== null);
    expect(cut.map((s) => s.surface),
      'the register is unfrozen but these rows carry recorded values').toEqual([]);
  });

  it('every frozen row byte-hashes to its register sha256 (gated on frozenAt)', () => {
    if (!FROZEN) {
      expect(FROZEN, 'unfrozen: the freeze act has not recorded any hash yet').toBe(false);
      return;
    }
    const drift = [];
    for (const s of SURFACES) {
      if (s.sha256 === null) continue;
      const actual = sha256(readFileSync(join(ROOT, s.path), 'utf8'));
      if (actual !== s.sha256) drift.push(`${s.surface}: ${s.sha256} -> ${actual}`);
    }
    expect(drift).toEqual([]);
  });

  it("every frozen row's rows figure closes against its manifest (gated on frozenAt)", () => {
    if (!FROZEN) {
      expect(FROZEN, 'unfrozen: no row count has been recorded yet').toBe(false);
      return;
    }
    const drift = [];
    for (const s of SURFACES) {
      if (s.rows === null || !s.path.endsWith('.json')) continue;
      const actual = rowsIn(JSON.parse(readFileSync(join(ROOT, s.path), 'utf8')));
      if (actual !== s.rows) drift.push(`${s.surface}: ${s.rows} -> ${actual}`);
    }
    expect(drift).toEqual([]);
  });

  it('PLANT: a doctored register hash reds the byte comparison', () => {
    const bytes = '{"a":"b"}\n';
    const honest = sha256(bytes);
    const doctored = `${honest.slice(0, -1)}${honest.endsWith('0') ? '1' : '0'}`;
    expect(honest).not.toBe(doctored);
    expect(sha256(bytes) === doctored,
      'the byte comparator blessed a moved hash — it compares nothing').toBe(false);
  });

  it('PLANT: a doctored manifest byte reds the byte comparison', () => {
    const honest = sha256('{"a":"b"}\n');
    const flipped = sha256('{"a":"c"}\n');
    expect(flipped).not.toBe(honest);
  });
});

describe('arm 2 — ROSTER: every golden instrument is enrolled or affirmatively excluded', () => {
  it('every golden-adjacent env spelling in tests is enrolled or written-excluded', () => {
    const unclaimed = [];
    for (const { rel, spellings } of ENV_CARRIERS) {
      for (const spelling of spellings) {
        if (ENROLLED_ENVS.has(spelling) || EXCLUDED_ENVS.has(spelling)) continue;
        unclaimed.push(`${rel} reads process.env.${spelling}`);
      }
    }
    expect(unclaimed,
      'a same-seed instrument minted under a spelling nobody enrolled — enroll it in the'
      + ' register, or write its exclusion. Silence is not a disposition.').toEqual([]);
  });

  it('every written exclusion spelling still exists somewhere in the tree', () => {
    // The roster rots in both directions: a stale exclusion is a rule protecting nothing, and
    // it quietly widens the set of spellings a reader believes are accounted for.
    const live = new Set(ENV_CARRIERS.flatMap(({ spellings }) => spellings));
    const carriedElsewhere = new Set();
    for (const { rel, src } of TEST_FILES) {
      if (rel === SELF_REL) continue;
      for (const spelling of EXCLUDED_ENVS) {
        if (src.includes(`process.env.${spelling}`)) carriedElsewhere.add(spelling);
      }
    }
    const stale = [...EXCLUDED_ENVS].filter((s) => !live.has(s) && !carriedElsewhere.has(s));
    expect(stale, 'these exclusion spellings no longer exist in the tree').toEqual([]);
  });

  it('a header MENTIONING a refresh ritual does not enroll a file', () => {
    // The panel's own proof case, generalised: the bare `process.env.UPDATE_` hit in
    // sovereigntyLightingContract.walker.test.js is a COMMENT. A text scan enrols it; the AST
    // scan must not.
    expect(envSpellingsIn(PLANT_COMMENT_ONLY)).toEqual([]);
  });

  it('PLANT: a capture arm under an unenrolled spelling reds the enumerator', () => {
    const spellings = envSpellingsIn(PLANT_NEW_SPELLING);
    expect(spellings, 'the enumerator cannot see a new spelling at all')
      .toEqual(['UPDATE_SYNTHETIC_GOLDEN']);
    const claimed = spellings.every((s) => ENROLLED_ENVS.has(s) || EXCLUDED_ENVS.has(s));
    expect(claimed, 'a brand-new golden spelling was treated as already accounted for').toBe(false);
  });

  it('every golden fixture file in tests/fixtures is claimed by a register row', () => {
    const claimed = new Set(SURFACES.map((s) => s.path));
    const orphans = TREE_FILES.filter((rel) => {
      if (!rel.startsWith('tests/fixtures/')) return false;
      if (rel === REGISTER_REL) return false;
      if (!/golden/i.test(rel) || !rel.endsWith('.json')) return false;
      return !claimed.has(rel);
    });
    expect(orphans, 'a golden fixture no register row claims').toEqual([]);
  });

  it('the register and the door exclude themselves by identity', () => {
    // [A6]. Without this the machinery convicts itself at genesis: the register matches the
    // fixture glob it governs, and the door matches the single-writer scan it enforces.
    const claimed = new Set(SURFACES.map((s) => s.path));
    expect(claimed.has(REGISTER_REL), 'the register enrolled itself as a golden').toBe(false);
    expect(SURFACES.some((s) => s.suite === DOOR_REL), 'the door enrolled itself').toBe(false);
    expect(SURFACES.some((s) => s.suite === SELF_REL), 'the walker enrolled itself').toBe(false);
  });

  it('every in-file corpus constant site is accounted for by its register row', () => {
    const byPath = new Map(SURFACES.map((s) => [s.path, s]));
    const drift = [];
    for (const { rel, constants } of CONSTANT_CARRIERS) {
      const row = byPath.get(rel);
      if (!row) { drift.push(`${rel}: ${constants.length} pinned constants, NO register row`); continue; }
      if (row.constantSites !== constants.length) {
        drift.push(`${rel}: register says ${row.constantSites} sites, tree has ${constants.length}`);
      }
    }
    expect(drift,
      'a recorded corpus constant was added, deleted or moved without its register row').toEqual([]);
  });

  it('PLANT: a pinned 64-hex constant with no register row reds the constants arm', () => {
    const found = constantsIn(PLANT_CONSTANT);
    expect(found.length, 'the constants extractor cannot see a pinned hash at all').toBe(1);
    const claimed = new Set(SURFACES.flatMap((s) => s.frozenConstants ?? []));
    expect(claimed.has(found[0]), 'an unregistered constant was treated as claimed').toBe(false);
  });

  it('PLANT: a 64-hex inside a COMMENT is not a pin', () => {
    expect(constantsIn(PLANT_CONSTANT_IN_COMMENT)).toEqual([]);
  });

  it('every enrolled capture arm imports the signed door', () => {
    const notMigrated = ENROLLED_CARRIERS
      .filter((rel) => !importsDoor(TEST_FILES.find((f) => f.rel === rel).src));
    expect(notMigrated,
      'a golden capture arm that does not route through the signed door — this is the'
      + ' second-class re-record path the freeze exists to close').toEqual([]);
  });

  it('no enrolled capture arm still calls writeFileSync itself', () => {
    const selfWriters = ENROLLED_CARRIERS
      .filter((rel) => callsWriteFileSync(TEST_FILES.find((f) => f.rel === rel).src));
    expect(selfWriters, 'one writer, or the bypass returns').toEqual([]);
  });

  it('PLANT: the import-closure arm tells a migrated arm from an unmigrated one', () => {
    expect(importsDoor(PLANT_UNMIGRATED_ARM), 'an unmigrated arm read as migrated').toBe(false);
    expect(importsDoor(PLANT_MIGRATED_ARM), 'a migrated arm read as unmigrated').toBe(true);
    expect(callsWriteFileSync(PLANT_UNMIGRATED_ARM)).toBe(true);
    expect(callsWriteFileSync(PLANT_MIGRATED_ARM)).toBe(false);
  });
});

describe('arm 3 — LIVE: a frozen measurement must not decay into a frozen fiction', () => {
  it('every surface carrying a distinct floor meets it (gated on frozenAt)', () => {
    // [A2] "nonzero" is abolished as a floor: a collapsed pipeline emitting two distinct hashes
    // across six hundred rows passes "nonzero" and proves nothing. The estate's committed
    // standard is the espionage fence's 360/360.
    if (!FROZEN) {
      expect(FROZEN, 'unfrozen: no distinct floor has been recorded yet').toBe(false);
      return;
    }
    const below = [];
    for (const s of SURFACES) {
      if (s.distinctFloor === null || !s.path.endsWith('.json')) continue;
      const parsed = JSON.parse(readFileSync(join(ROOT, s.path), 'utf8'));
      const values = Array.isArray(parsed) ? parsed : Object.values(parsed);
      const distinct = new Set(values.map((v) => JSON.stringify(v))).size;
      if (distinct < s.distinctFloor) below.push(`${s.surface}: ${distinct} < ${s.distinctFloor}`);
    }
    expect(below).toEqual([]);
  });

  it('PLANT: a collapsed distinct count below its floor reds the discrimination arm', () => {
    const collapsed = { a: 'x', b: 'x', c: 'x' };
    const distinct = new Set(Object.values(collapsed)).size;
    expect(distinct).toBe(1);
    expect(distinct >= 3, 'a corpus with one distinct value passed a floor of three').toBe(false);
  });

  it('PLANT: "nonzero" is not a floor — a collapsed corpus passes it', () => {
    // The refutation, kept executable so nobody re-introduces the weaker predicate.
    const collapsed = new Set(['x', 'x', 'x', 'x']).size;
    expect(collapsed > 0, 'the abolished predicate would have passed this corpus').toBe(true);
    expect(collapsed >= 4, 'the ruled predicate correctly refuses it').toBe(false);
  });
});

describe('arm 4 — SENTINEL: the roster may grow, never silently collapse', () => {
  it('the enumerated env-carrier count is at or above its frozen floor', () => {
    expect(ENV_CARRIERS.length,
      `the roster scan found ${ENV_CARRIERS.length} env carriers against a floor of`
      + ` ${ROSTER_FLOOR.envCarriers}. A collapsed scan must RED, never pass smaller —`
      + ' a shrink demands a register-row retirement through the door, which is owner-signed.')
      .toBeGreaterThanOrEqual(ROSTER_FLOOR.envCarriers);
  });

  it('the enumerated constant-carrier count is at or above its frozen floor', () => {
    expect(CONSTANT_CARRIERS.length).toBeGreaterThanOrEqual(ROSTER_FLOOR.constantCarriers);
  });

  it('the register surface count is at or above its frozen floor', () => {
    expect(SURFACES.length).toBeGreaterThanOrEqual(ROSTER_FLOOR.surfaces);
  });

  it('PLANT: a collapsed enumeration reds the sentinel', () => {
    const collapsed = ENV_CARRIERS.slice(0, 3);
    expect(collapsed.length >= ROSTER_FLOOR.envCarriers,
      'a three-file scan passed a floor of forty-three — the sentinel is not floored')
      .toBe(false);
  });
});

describe('arm 5 — SIGNATURE CLOSURE: the record behind the bytes', () => {
  it('while the register is UNFROZEN, there is no genesis record to close over', () => {
    if (FROZEN) {
      expect(true, 'register is frozen; this arm is inapplicable').toBe(true);
      return;
    }
    expect(REGISTER.genesis).toBe(null);
  });

  it('the genesis signed record exists, parses and hashes to its recorded digest (gated)', () => {
    if (!FROZEN) {
      expect(FROZEN, 'unfrozen: the genesis record is the freeze act\'s to cut').toBe(false);
      return;
    }
    const genesis = REGISTER.genesis ?? {};
    const bytes = readFileSync(join(ROOT, genesis.signedRecord), 'utf8');
    expect(sha256(bytes)).toBe(genesis.signedRecordSha256);
    const record = JSON.parse(bytes);
    const verdict = verifyShiftRecord(record, { surface: record.surfaces?.[0]?.surface });
    expect(verdict.ok, verdict.detail ?? '').toBe(true);
  });

  it("every frozen row's ownerRow is non-blank (gated on frozenAt)", () => {
    if (!FROZEN) {
      expect(FROZEN, 'unfrozen: no row has been signed yet').toBe(false);
      return;
    }
    const blank = SURFACES.filter((s) => isBlankProvenance(s.ownerRow)).map((s) => s.surface);
    expect(blank).toEqual([]);
  });
});

describe('the signed door — refusal 1: the record, not the env var', () => {
  it('a well-formed signed record verifies', () => {
    expect(withRecord({}).ok).toBe(true);
  });

  it('a record that is not an object is refused', () => {
    expect(verifyShiftRecord('GOLDEN_SHIFT_SIGNED=1', asked).refusal).toBe(REFUSALS.RECORD_MALFORMED);
  });

  it('blank ownerWords is refused', () => {
    expect(withRecord({ ownerWords: '' }).refusal).toBe(REFUSALS.BLANK_PROVENANCE);
  });

  it('ownerWords of "1" is refused — provenance in shape only', () => {
    expect(withRecord({ ownerWords: '1' }).refusal).toBe(REFUSALS.BLANK_PROVENANCE);
  });

  it('a blank seat is refused', () => {
    expect(withRecord({ seat: '   ' }).refusal).toBe(REFUSALS.BLANK_PROVENANCE);
  });

  it('a blank cause is refused', () => {
    expect(withRecord({ cause: '' }).refusal).toBe(REFUSALS.BLANK_PROVENANCE);
  });

  it('an ownerDate that is not YYYY-MM-DD is refused', () => {
    expect(withRecord({ ownerDate: 'yesterday' }).refusal).toBe(REFUSALS.RECORD_MALFORMED);
  });

  it('an odqRow that does not name a § row is refused — the citation is the authority', () => {
    expect(withRecord({ odqRow: '879' }).refusal).toBe(REFUSALS.RECORD_MALFORMED);
  });

  it('an empty surfaces list is refused', () => {
    expect(withRecord({ surfaces: [] }).refusal).toBe(REFUSALS.RECORD_MALFORMED);
  });

  it('a record that does not name the surface being written is refused', () => {
    expect(verifyShiftRecord(GOOD_RECORD, { surface: 'some-other-golden' }).refusal)
      .toBe(REFUSALS.SURFACE_NOT_IN_RECORD);
  });

  it('a missing predictedRows is refused — predict before you write', () => {
    expect(withSurface({ predictedRows: undefined }).refusal).toBe(REFUSALS.RECORD_MALFORMED);
  });

  it('a proofForm that does not match the register row is refused (§555.8)', () => {
    expect(verifyShiftRecord(GOOD_RECORD, { surface: 'plant-surface', proofForm: 'derived-artefact' })
      .refusal).toBe(REFUSALS.PROOF_FORM_MISMATCH);
  });
});

describe('the signed door — the action verbs and their ruled asymmetry', () => {
  it('the verbs are exactly re-record, enroll and retire', () => {
    expect(Object.keys(ACTIONS).sort()).toEqual(['enroll', 're-record', 'retire']);
  });

  it('re-record and retire are owner-signed — protection shrinks only by the pen', () => {
    expect(ACTIONS['re-record']).toBe('owner');
    expect(ACTIONS.retire).toBe('owner');
  });

  it('enroll is chair-signed — protection may grow without waiting on the pen', () => {
    expect(ACTIONS.enroll).toBe('chair');
  });

  it('an unknown verb is refused', () => {
    expect(withSurface({ action: 'update' }).refusal).toBe(REFUSALS.UNKNOWN_ACTION);
  });

  it('the enroll verb is accepted, so a walk-fix regression golden has a lawful way in', () => {
    expect(withSurface({ action: 'enroll' }).ok).toBe(true);
  });

  it('the retire verb is accepted, so a legitimate suite retirement does not hit a sealed instrument', () => {
    expect(withSurface({ action: 'retire' }).ok).toBe(true);
  });

  it('the proof forms are exactly the three §555.8 admits', () => {
    expect([...PROOF_FORMS].sort())
      .toEqual(['derived-artefact', 'in-file corpus constant', 'settlement-hash']);
  });
});

describe('the signed door — refusal 2 [A3]: the dirty-tree check, written fresh', () => {
  it('POSITIVE PLANT: the register alone dirty on the FIRST line PROCEEDS', () => {
    // ⭐ THE ARM THAT MATTERS. §874.7 measured the ported form's defect: it trims the whole
    // porcelain blob, so the FIRST line loses its leading status space and slice(3) cuts one
    // character INTO the path — after which the register fails to match its own exclusion and
    // the door refuses itself precisely when the register is the only dirty path. The failure
    // mode is a REFUSAL, so no negative test can see it. Only this positive control can.
    expect(dirtyPathsFrom(` M ${REGISTER_REL}\n`, [REGISTER_REL])).toEqual([]);
  });

  it('POSITIVE PLANT: the register alone dirty in STAGED form proceeds', () => {
    expect(dirtyPathsFrom(`M  ${REGISTER_REL}\n`, [REGISTER_REL])).toEqual([]);
  });

  it('POSITIVE PLANT: the register alone dirty in UNTRACKED form proceeds', () => {
    expect(dirtyPathsFrom(`?? ${REGISTER_REL}\n`, [REGISTER_REL])).toEqual([]);
  });

  it('DISCRIMINATION: the ported trimming form refuses the register-only case', () => {
    // The defect kept executable, so a tidy-up cannot reintroduce it unnoticed.
    const ported = (porcelain, allowed) => porcelain.trim().split('\n')
      .map((l) => l.slice(3).trim()).filter(Boolean).filter((p) => !allowed.includes(p));
    const input = ` M ${REGISTER_REL}\n`;
    expect(ported(input, [REGISTER_REL]).length,
      'the ported form no longer mis-slices, so this plant proves nothing').toBeGreaterThan(0);
    expect(dirtyPathsFrom(input, [REGISTER_REL]).length,
      'the fresh form now mis-slices too — the cure has regressed').toBe(0);
  });

  it("a sibling lane's dirty file on the first line IS caught", () => {
    expect(dirtyPathsFrom(' M src/domain/other.js\n', [REGISTER_REL]))
      .toEqual(['src/domain/other.js']);
  });

  it('across several lines only the unpermitted paths return', () => {
    expect(dirtyPathsFrom(` M ${REGISTER_REL}\n M src/a.js\n?? tests/b.js\n`, [REGISTER_REL]))
      .toEqual(['src/a.js', 'tests/b.js']);
  });

  it('a rename entry reports the NEW path', () => {
    expect(dirtyPathsFrom('R  old/a.js -> new/b.js\n', [])).toEqual(['new/b.js']);
  });

  it('a quoted path is unquoted before matching', () => {
    expect(dirtyPathsFrom('?? "a b/c.js"\n', [])).toEqual(['a b/c.js']);
  });

  it('a clean tree yields no dirty paths', () => {
    expect(dirtyPathsFrom('', [])).toEqual([]);
  });
});

describe('the signed door — refusal 4: the prediction, and the commit-level backstop', () => {
  it('a manifest object reports its key count as its row figure', () => {
    expect(rowsIn({ a: 1, b: 2, c: 3 })).toBe(3);
  });

  it('a manifest array reports its length as its row figure', () => {
    expect(rowsIn([1, 2, 3, 4])).toBe(4);
  });

  it('a non-container produces no row figure rather than a misleading one', () => {
    expect(rowsIn('not a manifest')).toBe(null);
  });

  it('a commit message carrying the Owner-Signed trailer is accepted', () => {
    expect(commitTrailerRefusal('subject line\n\nbody\n\nOwner-Signed: §879\n')).toBe(null);
  });

  it('a commit message without the Owner-Signed trailer is named as a refusal', () => {
    expect(typeof commitTrailerRefusal('subject line\n\nbody\n')).toBe('string');
  });
});

describe('the dormancy oracle bit arm — §713.2 made a standing instrument', () => {
  // ⭐ THE ANTI-VACUITY PROOF IS THE DISCRIMINATION *BETWEEN* THE ARMS. §866's lesson is that a
  // comparator must be proven ABLE to see, and a bit hash that always differs proves nothing
  // either. So the standing proof is a table: three synthetic mutations, three comparators, and
  // the pattern of greens and reds is itself the claim.
  //
  //   case                     canonical   raw    stable
  //   key-order churn          GREEN       RED    GREEN
  //   additive EMPTY ledger    GREEN       RED    RED      ← the class §713.2 exists for
  //   a REAL value change      RED         RED    RED
  //
  // The middle row is the whole point: the canonical form BLESSES an additive empty ledger, in
  // its own header's words, and both bit arms convict it.
  const BASE = Object.freeze({ alpha: 1, beta: { x: 1 } });
  const REORDERED = Object.freeze({ beta: { x: 1 }, alpha: 1 });
  const ADDITIVE_EMPTY = Object.freeze({ alpha: 1, beta: { x: 1 }, deployments: {} });
  const REAL_CHANGE = Object.freeze({ alpha: 2, beta: { x: 1 } });
  const canon = (v) => JSON.stringify(normalizeForDormancy(v));

  it('the canonical form blesses key-order churn, and the raw bit arm convicts it', () => {
    expect(canon(REORDERED)).toBe(canon(BASE));
    expect(rawBitFormOf(REORDERED)).not.toBe(rawBitFormOf(BASE));
  });

  it('the stable arm is blind to key order BY DESIGN, which is what localises a drift', () => {
    expect(stableBitFormOf(REORDERED)).toBe(stableBitFormOf(BASE));
  });

  it('the canonical form blesses an additive EMPTY ledger — the known blindness, executed', () => {
    expect(canon(ADDITIVE_EMPTY)).toBe(canon(BASE));
  });

  it('the raw bit arm convicts the additive EMPTY ledger the canonical form blesses', () => {
    expect(rawBitFormOf(ADDITIVE_EMPTY)).not.toBe(rawBitFormOf(BASE));
  });

  it('the stable bit arm also convicts the additive EMPTY ledger', () => {
    expect(stableBitFormOf(ADDITIVE_EMPTY)).not.toBe(stableBitFormOf(BASE));
  });

  it('all three comparators convict a real value change — none is merely permissive', () => {
    expect(canon(REAL_CHANGE)).not.toBe(canon(BASE));
    expect(rawBitFormOf(REAL_CHANGE)).not.toBe(rawBitFormOf(BASE));
    expect(stableBitFormOf(REAL_CHANGE)).not.toBe(stableBitFormOf(BASE));
  });

  it('both bit arms are stable across repeated calls on the same input', () => {
    expect(rawBitFormOf(BASE)).toBe(rawBitFormOf(BASE));
    expect(stableBitFormOf(BASE)).toBe(stableBitFormOf(BASE));
  });

  it('both bit arms return a 64-hex digest, so a register row can pin one', () => {
    expect(rawBitFormOf(BASE)).toMatch(HEX64);
    expect(stableBitFormOf(BASE)).toMatch(HEX64);
  });

  it('the stable form sorts nested levels too, so nesting cannot hide an unsorted level', () => {
    const nestedA = { outer: { b: 1, a: 2 } };
    const nestedB = { outer: { a: 2, b: 1 } };
    expect(stableBitFormOf(nestedA)).toBe(stableBitFormOf(nestedB));
    expect(rawBitFormOf(nestedA)).not.toBe(rawBitFormOf(nestedB));
  });

  it('array ORDER is data, not layout — both arms convict a reordered array', () => {
    expect(stableBitFormOf({ xs: [1, 2] })).not.toBe(stableBitFormOf({ xs: [2, 1] }));
    expect(rawBitFormOf({ xs: [1, 2] })).not.toBe(rawBitFormOf({ xs: [2, 1] }));
  });

  it('no register row pins a bit hash yet — those record at the freeze act', () => {
    if (FROZEN) {
      expect(true, 'register is frozen; the bit hashes are the act\'s to hold').toBe(true);
      return;
    }
    const pinned = SURFACES.filter((s) => s.bitHash != null || s.stableHash != null);
    expect(pinned.map((s) => s.surface),
      'a bit hash was recorded before the freeze act signed for it').toEqual([]);
  });
});

describe('the shift-record home — docs/shift-records/', () => {
  const TEMPLATE_REL = 'docs/shift-records/_TEMPLATE.json';

  it('the shift-record home exists and carries its README', () => {
    expect(readFileSync(join(ROOT, 'docs/shift-records/README.md'), 'utf8'))
      .toContain('GOLDEN_SHIFT_SIGNED');
  });

  it('the README documents all three action verbs', () => {
    const readme = readFileSync(join(ROOT, 'docs/shift-records/README.md'), 'utf8');
    expect(readme).toContain('`re-record`');
    expect(readme).toContain('`enroll`');
    expect(readme).toContain('`retire`');
  });

  it('the template parses as JSON', () => {
    expect(() => JSON.parse(readFileSync(join(ROOT, TEMPLATE_REL), 'utf8'))).not.toThrow();
  });

  it('THE TEMPLATE IS REFUSED BY THE DOOR — it can never quietly become a signature', () => {
    // A blank template sitting beside real records is a loaded gun unless the door refuses it.
    // Asserting the refusal here means the safety is checked on every gate, not assumed.
    const template = JSON.parse(readFileSync(join(ROOT, TEMPLATE_REL), 'utf8'));
    const verdict = verifyShiftRecord(template, { surface: template.surfaces[0].surface });
    expect(verdict.ok).toBe(false);
    expect(verdict.refusal).toBe(REFUSALS.BLANK_PROVENANCE);
  });

  it('no signed record has yet been cut — the genesis record is the freeze act\'s', () => {
    if (FROZEN) {
      expect(true, 'register is frozen; records exist by construction').toBe(true);
      return;
    }
    const records = readdirSync(join(ROOT, 'docs/shift-records'))
      .filter((name) => name.endsWith('.json') && !name.startsWith('_'));
    expect(records, 'a shift record exists but the register is unfrozen').toEqual([]);
  });
});

// ───────────────────────────────────────────────────────────────────────────────────
describe('the lane ritual — scripts/dormancy-bit-compare.mjs', () => {
  // WHY THIS BLOCK EXISTS, AND WHY IT IS NOT A CALLER. The comparator is a MANUAL instrument:
  // it is driven by hand across two trees, and nothing in the suite calls it. That is a
  // legitimate shape for a ritual tool — a committed script does not need a caller to be
  // real. But until this block, "no caller" also meant "no proof it runs at all", and a
  // freeze ritual leaning on a script nobody has executed is exactly the dormancy class this
  // walker exists to refuse: a dark tool and a lit-but-broken tool are indistinguishable from
  // outside. So these arms do NOT drive a generation — that is minutes of work and needs two
  // trees, and it is the ritual's job, not the gate's. They prove the narrower thing a gate
  // can honestly prove: the script LOADS, parses its arguments, and every documented REFUSAL
  // fires with its documented EXIT CODE. A refusal that never fires is the half of a guard
  // that rots invisibly, and the exit codes are load-bearing — 2 means "you called it wrong",
  // 3 means "this arm is not defined yet", and a ritual that cannot tell those apart will
  // read an unbuilt arm as a clean comparison.
  const SCRIPT = 'scripts/dormancy-bit-compare.mjs';
  const run = (...argv) => {
    const result = spawnSync(process.execPath, [join(ROOT, SCRIPT), ...argv], {
      cwd: ROOT, encoding: 'utf8',
    });
    return { code: result.status, out: result.stdout ?? '', err: result.stderr ?? '' };
  };

  it('the script loads and answers --help with its own usage, on exit 0', () => {
    const { code, err } = run('--help');
    expect(code, `--help must exit 0. stderr was: ${err}`).toBe(0);
    expect(err).toContain('usage: node scripts/dormancy-bit-compare.mjs');
    expect(err).toContain('--against');
  });

  it('a bare invocation refuses with the usage rather than defaulting to a tree', () => {
    const { code, err } = run();
    expect(code).toBe(2);
    expect(err).toContain('usage: node scripts/dormancy-bit-compare.mjs');
  });

  it('an unknown argument is refused BY NAME rather than silently ignored', () => {
    // A ritual tool that ignores a typo’d flag runs the wrong comparison and says nothing.
    const { code, err } = run('--tree', ROOT, '--nonsense');
    expect(code).toBe(2);
    expect(err).toContain('unknown argument');
    expect(err).toContain('--nonsense');
  });

  it('THE SELF-COMPARISON GUARD FIRES — the one refusal a real run depends on', () => {
    // Two trees that are the same tree answer "identical" whatever the pipeline does. §713.3
    // recorded that exact false pass. It must REFUSE, not compare.
    const { code, err } = run('--tree', ROOT, '--against', ROOT);
    expect(code).toBe(2);
    expect(err).toContain('refusing a SELF-COMPARISON');
  });

  it('a missing tree is refused before anything is imported from it', () => {
    const { code, err } = run('--tree', join(ROOT, 'no-such-tree-goldenfreeze-probe'));
    expect(code).toBe(2);
    expect(err).toContain('no such tree');
  });

  it('the unbuilt `soak` arm refuses on its OWN exit code rather than inventing a corpus', () => {
    // ARMS declares soak deliberately unbuilt and REC Q2’s to rule. Exit 3 is what keeps
    // "not defined yet" from reading as "you called it wrong".
    const { code, err } = run('--tree', ROOT, '--arm', 'soak');
    expect(code).toBe(3);
    expect(err).toContain('deliberately unbuilt');
  });
});
