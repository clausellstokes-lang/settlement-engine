/**
 * tests/helpers/goldenRecordDoor.js — THE ONE SIGNED DOOR every golden capture arm writes through.
 *
 * WHAT IT IS. Before this file, forty-odd suites each carried their own
 * `if (process.env.UPDATE_GOLDEN) { … writeFileSync(MANIFEST, …) }` block. An env var was the
 * whole armament: set it, and any lane could move a same-seed fingerprint with nothing left in
 * the tree to say who, when, or why. This helper replaces every one of those writes with one
 * call, and that call REFUSES unless a signed shift record on disk authorizes exactly the move
 * being made. THE PROMISE — a seed is a starting world forever — stops being discipline and
 * becomes machinery at this file.
 *
 * WHY ONE WRITER AND NOT FORTY. The single-writer pattern, enforced by source scan: the
 * companion walker (tests/lint/goldenFreeze.walker.test.js) convicts any pattern-census file
 * that does not import from here. Forty copies of a refusal are forty places for one of them to
 * quietly not have it — and the one that does not is the one that gets used.
 *
 * ⛔ PURITY AT IMPORT. This module does NOTHING at import time: no fs, no git, no env reads.
 * Forty-plus test files import it at module load on every gate run, so an import-time side
 * effect here would be paid by the whole estate. Every effect lives inside `recordGolden`.
 * Do NOT add a describe/test to this file — that is the re-registration coupling
 * dormancyOracle.js was extracted to break.
 *
 * ⭐ AND A SUCCESSFUL WRITE THROWS, BY DESIGN. A mode that both rewrites a golden and reports a
 * green test is a mode that can silently disarm this guard for a whole gate run. Re-recording
 * therefore always fails loudly, printing old→new per surface; the VERIFICATION is a separate,
 * ordinary run of the suite plus the walker, and THAT green is the receipt. This is the lighting
 * census refreeze's own law, carried here deliberately.
 *
 * THE HONEST LIMIT, NAMED (charter §4.5). The machine verifies the record's FORM, its
 * completeness, its internal consistency, and that the fixture/register/record triplet closes in
 * one act. It CANNOT verify that the owner truly spoke `ownerWords` — that half is human by
 * nature. The ODQ §-row the record cites is the authority and the ledger is the veto surface;
 * what this door buys is that a forged authorization is a LOUD, durable, attributable artifact
 * committed to the tree rather than a silent environment variable in someone's shell.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative, resolve } from 'node:path';

/** The register this door writes in the same act as every fixture. */
export const REGISTER_REL = 'tests/fixtures/.golden-freeze-register.json';

/** The env var that must name a signed shift-record FILE. Its presence is not armament. */
export const SIGNATURE_ENV = 'GOLDEN_SHIFT_SIGNED';

/** The action verbs a signed record may carry, and who may sign each (charter §4.2 [A4]). */
export const ACTIONS = Object.freeze({
  're-record': 'owner',
  retire: 'owner',
  enroll: 'chair',
});

/** What a signed record must prove against, per surface (ODQ §555.8). */
export const PROOF_FORMS = Object.freeze([
  'settlement-hash',
  'derived-artefact',
  'in-file corpus constant',
]);

/** Refusal codes. Stable strings so a plant can assert WHICH refusal fired, not merely that one did. */
export const REFUSALS = Object.freeze({
  NO_SIGNATURE: 'NO_SIGNATURE',
  RECORD_UNREADABLE: 'RECORD_UNREADABLE',
  RECORD_MALFORMED: 'RECORD_MALFORMED',
  BLANK_PROVENANCE: 'BLANK_PROVENANCE',
  SURFACE_NOT_IN_RECORD: 'SURFACE_NOT_IN_RECORD',
  UNKNOWN_ACTION: 'UNKNOWN_ACTION',
  PROOF_FORM_MISMATCH: 'PROOF_FORM_MISMATCH',
  DIRTY_TREE: 'DIRTY_TREE',
  PREDICTION_MISS: 'PREDICTION_MISS',
  SURFACE_NOT_REGISTERED: 'SURFACE_NOT_REGISTERED',
});

/**
 * REFUSAL 2, WRITTEN FRESH — the per-line porcelain parse (charter §4.2 [A3]).
 *
 * ⛔ THIS IS DELIBERATELY NOT A PORT. ODQ §874.7 measured the defect in the ritual this
 * replaces, verbatim: "`gitOut` trims the whole porcelain blob, so the FIRST line mis-slices and
 * the register is not excluded from its own dirty-path check — the refreeze refuses itself
 * precisely when the register is the only dirty path."
 *
 * The mechanism, so it cannot be reintroduced by a tidy-up: a porcelain v1 line is
 * `XY<space>PATH`, and for a tracked-but-modified file X is a SPACE (` M path`). Trimming the
 * whole blob eats that leading space from the first line only, after which `slice(3)` cuts one
 * character INTO the path (`ath`), which then matches no allowlist entry. The failure mode is a
 * REFUSAL, so no negative test can see it — only a POSITIVE control, asserting the door PROCEEDS
 * when the register is the sole dirty path, catches it. The walker ships exactly that plant.
 *
 * Therefore: the blob is never trimmed, each line is sliced independently, and empty lines are
 * skipped by identity rather than by trimming.
 *
 * @param {string} porcelain RAW `git status --porcelain` output. Do not trim it.
 * @param {string[]} allowed repo-relative paths permitted to be dirty.
 * @returns {string[]} the dirty paths that are not allowed.
 */
export function dirtyPathsFrom(porcelain, allowed = []) {
  const allowedSet = new Set(allowed);
  const out = [];
  for (const line of String(porcelain).split('\n')) {
    if (line === '') continue;
    if (line.length < 4) continue;
    let path = line.slice(3);
    // Rename/copy entries read `R  old -> new`; the NEW path is the one that is dirty.
    const arrow = path.indexOf(' -> ');
    if (arrow !== -1) path = path.slice(arrow + 4);
    // Paths with spaces or non-ASCII arrive quoted.
    if (path.startsWith('"') && path.endsWith('"')) path = path.slice(1, -1);
    if (path === '') continue;
    if (allowedSet.has(path)) continue;
    out.push(path);
  }
  return out;
}

/** Provenance is an input, not a formality: blank, whitespace, and "1" are all absent. */
export function isBlankProvenance(value) {
  const text = typeof value === 'string' ? value.trim() : '';
  return text === '' || text === '1';
}

/**
 * REFUSALS 1 and 3 — the record's FORM, verified from parsed CONTENT.
 *
 * The dress-page law applies with full force here: an env var's presence is not armament. The
 * door reads the FILE the env var names and verifies what is inside it. `GOLDEN_SHIFT_SIGNED=1`
 * authorizes nothing, and neither does a record whose `ownerWords` is "1".
 *
 * `predictedRows` is required BEFORE the write — ODQ §858's predicted-then-held discipline made
 * a machine-checked field, so a re-record that moves a different number of rows than its author
 * expected writes nothing at all.
 *
 * @returns {{ok: true, surface: object} | {ok: false, refusal: string, detail: string}}
 */
export function verifyShiftRecord(record, { surface, proofForm } = {}) {
  const fail = (refusal, detail) => ({ ok: false, refusal, detail });
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return fail(REFUSALS.RECORD_MALFORMED, 'the signed record is not a JSON object');
  }
  for (const field of ['ownerWords', 'ownerDate', 'odqRow', 'cause', 'seat']) {
    if (isBlankProvenance(record[field])) {
      return fail(REFUSALS.BLANK_PROVENANCE,
        `the signed record's '${field}' is blank, whitespace, or "1" —`
        + ' provenance is an input, not a formality');
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.ownerDate)) {
    return fail(REFUSALS.RECORD_MALFORMED,
      `the signed record's 'ownerDate' is ${JSON.stringify(record.ownerDate)}, not YYYY-MM-DD`);
  }
  if (!/^§/.test(record.odqRow)) {
    return fail(REFUSALS.RECORD_MALFORMED,
      `the signed record's 'odqRow' is ${JSON.stringify(record.odqRow)};`
      + ' the citation is the authority, so it must name a § row');
  }
  if (!Array.isArray(record.surfaces) || record.surfaces.length === 0) {
    return fail(REFUSALS.RECORD_MALFORMED, "the signed record's 'surfaces' is not a non-empty array");
  }
  const entry = record.surfaces.find((s) => s && s.surface === surface);
  if (!entry) {
    return fail(REFUSALS.SURFACE_NOT_IN_RECORD,
      `the signed record does not name surface '${surface}'. A record authorizes the surfaces it`
      + ' lists and no others — one cause per record is the law, not one record per sitting.');
  }
  if (!Object.hasOwn(ACTIONS, entry.action)) {
    return fail(REFUSALS.UNKNOWN_ACTION,
      `surface '${surface}' carries action ${JSON.stringify(entry.action)};`
      + ` the verbs are ${Object.keys(ACTIONS).join(', ')}`);
  }
  if (!Number.isInteger(entry.predictedRows) || entry.predictedRows < 0) {
    return fail(REFUSALS.RECORD_MALFORMED,
      `surface '${surface}' has predictedRows ${JSON.stringify(entry.predictedRows)},`
      + ' not a non-negative integer. Predict before you write.');
  }
  if (!PROOF_FORMS.includes(entry.proofForm)) {
    return fail(REFUSALS.RECORD_MALFORMED,
      `surface '${surface}' has proofForm ${JSON.stringify(entry.proofForm)};`
      + ` the forms are ${PROOF_FORMS.join(', ')}`);
  }
  if (proofForm != null && entry.proofForm !== proofForm) {
    return fail(REFUSALS.PROOF_FORM_MISMATCH,
      `surface '${surface}' is registered with proofForm '${proofForm}' but the signed record`
      + ` proves with '${entry.proofForm}'. A map-family surface may not prove with a`
      + ' settlement-record hash (ODQ §555.8).');
  }
  return { ok: true, surface: entry };
}

/** How many rows a produced manifest carries. Arrays by length, objects by key count. */
export function rowsIn(parsed) {
  if (Array.isArray(parsed)) return parsed.length;
  if (parsed && typeof parsed === 'object') return Object.keys(parsed).length;
  return null;
}

const sha256 = (text) => createHash('sha256').update(text).digest('hex');

/**
 * THE COMMIT-LEVEL BACKSTOP (charter §4.3), as a pure checker rather than an installed hook.
 *
 * ⚠ NO GIT HOOK IS INSTALLED BY THIS LANE, and that is deliberate rather than unfinished.
 * §709.5 measured the reason: the sandbox line carries zero `.husky/` and zero `scripts/`
 * enforcement, so a hook is absent from exactly the line where an unsupervised re-record is most
 * likely. The in-tree walker is the load-bearing half BECAUSE hooks do not exist on every line.
 * Installing one would also mutate a shared config surface other lanes commit against. So the
 * rule is exported here for chair tooling to call where chair tooling runs, and the walker
 * enforces the same closure in-tree where it always runs.
 */
export function commitTrailerRefusal(message) {
  const text = typeof message === 'string' ? message : '';
  return /^Owner-Signed: §\S+/m.test(text)
    ? null
    : 'a golden re-record commit must carry an `Owner-Signed: §NNN` trailer naming the ODQ row';
}

function gitPorcelain(root) {
  // NOT trimmed — see dirtyPathsFrom. `encoding` gives a string; the raw blob is the input.
  return execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' });
}

/**
 * THE DOOR. Every golden capture arm calls this instead of writing its fixture directly.
 *
 * Refusals fire in order, and NOTHING is written until all of them have passed:
 *   1. no signature, or a record whose CONTENT does not authorize this surface
 *   2. a dirty tree beyond the permitted paths
 *   3. blank provenance (folded into 1 — the record is where provenance lives)
 *   4. a prediction miss: the produced row count differs from `predictedRows`
 *   5. atomic write of fixture AND register row together, then a deliberate throw
 *
 * @param {object} args
 * @param {string} args.surface stable register identity.
 * @param {string} args.path absolute path of the manifest to write.
 * @param {() => string} args.produce returns the exact BYTES to write.
 * @param {string} [args.root] repo root; defaults to process.cwd().
 */
export function recordGolden({ surface, path, produce, root = process.cwd() }) {
  const refuse = (code, detail) => {
    throw new Error(`golden re-record REFUSED [${code}] for surface '${surface}': ${detail}`);
  };

  const signaturePath = (process.env[SIGNATURE_ENV] ?? '').trim();
  if (signaturePath === '' || signaturePath === '1') {
    refuse(REFUSALS.NO_SIGNATURE,
      `setting a capture env var no longer writes anything. ${SIGNATURE_ENV} must name a signed`
      + ' shift-record FILE under docs/shift-records/, and this door reads that file and verifies'
      + " its CONTENT — an env var's presence is not armament, only the parsed record is.");
  }

  const recordAbs = resolve(root, signaturePath);
  let recordText;
  try {
    recordText = readFileSync(recordAbs, 'utf8');
  } catch (error) {
    refuse(REFUSALS.RECORD_UNREADABLE,
      `${SIGNATURE_ENV} names ${signaturePath}, which is missing or unreadable (${error.message}).`);
  }
  let record;
  try {
    record = JSON.parse(recordText);
  } catch (error) {
    refuse(REFUSALS.RECORD_MALFORMED, `${signaturePath} is not valid JSON (${error.message}).`);
  }

  const registerAbs = join(root, REGISTER_REL);
  let register;
  try {
    register = JSON.parse(readFileSync(registerAbs, 'utf8'));
  } catch (error) {
    refuse(REFUSALS.RECORD_UNREADABLE,
      `the freeze register ${REGISTER_REL} is missing or unreadable (${error.message}).`
      + ' It is not optional: without it this door cannot know what it is authorized to move.');
  }
  const row = (register.surfaces ?? []).find((s) => s && s.surface === surface);
  if (!row) {
    refuse(REFUSALS.SURFACE_NOT_REGISTERED,
      `no register row claims it. An unregistered golden cannot be written through this door —`
      + ' enroll it first (action "enroll"), which is how protection grows.');
  }

  const verdict = verifyShiftRecord(record, { surface, proofForm: row.proofForm ?? null });
  if (!verdict.ok) refuse(verdict.refusal, verdict.detail);

  const registerRel = REGISTER_REL;
  const manifestRel = relative(root, path);
  const recordRel = relative(root, recordAbs);
  const dirty = dirtyPathsFrom(gitPorcelain(root), [registerRel, manifestRel, recordRel]);
  if (dirty.length) {
    refuse(REFUSALS.DIRTY_TREE,
      'the tree is dirty beyond the paths this act may touch. In a shared tree those paths may'
      + ' belong to another lane, and a re-record taken over them is not reproducible from any'
      + ` commit. Commit first, then re-record at the clean tip. Dirty: ${dirty.join(', ')}`);
  }

  const bytes = produce();
  let parsed;
  try { parsed = JSON.parse(bytes); } catch { parsed = null; }
  const actualRows = rowsIn(parsed);
  if (actualRows !== null && actualRows !== verdict.surface.predictedRows) {
    refuse(REFUSALS.PREDICTION_MISS,
      `predicted ${verdict.surface.predictedRows} rows, produced ${actualRows}. NOTHING was`
      + ' written — this is all-or-none. Either the prediction was wrong or the change is larger'
      + ' than its cause; both are worth knowing before bytes move.');
  }

  const previousSha = row.sha256 ?? null;
  const previousRows = row.rows ?? null;
  const nextSha = sha256(bytes);

  row.sha256 = nextSha;
  row.rows = actualRows;
  row.ownerRow = record.odqRow;
  register.frozenAt = register.frozenAt ?? null;

  if (!existsSync(dirname(path))) mkdirSync(dirname(path), { recursive: true });
  const manifestTmp = `${path}.door-${process.pid}`;
  const registerTmp = `${registerAbs}.door-${process.pid}`;
  writeFileSync(manifestTmp, bytes, 'utf8');
  writeFileSync(registerTmp, `${JSON.stringify(register, null, 2)}\n`, 'utf8');
  renameSync(manifestTmp, path);
  renameSync(registerTmp, registerAbs);

  throw new Error(
    `golden RE-RECORDED through the signed door: surface '${surface}',`
    + ` action '${verdict.surface.action}', cause '${record.cause}', row ${record.odqRow}.`
    + ` sha256 ${previousSha ?? '(unset)'} -> ${nextSha};`
    + ` rows ${previousRows ?? '(unset)'} -> ${actualRows}.`
    + ' This run fails BY DESIGN so a re-record can never be mistaken for a passing gate —'
    + ' re-run the suite and the freeze walker plainly, and THAT green is the receipt.');
}
