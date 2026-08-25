/**
 * harness/instruments/digest.mjs — ⭐ THE KIT · ARTIFACT HASHING (ODQ §634.3).
 *
 * Dormancy proofs, determinism double-runs and restore-after-mutation checks are all the same
 * operation — hash a set of artifacts and compare two sets — and four waves have each written
 * their own version of it. This is the one version.
 *
 * ⛔⛔ **A DOUBLE-RUN COMPARES AN ARM TO ITSELF AND CANNOT TELL DETERMINISTIC FROM NEVER-RAN.**
 * That is not a theoretical caution: a 29/29 "armed" determinism pass at REG-SEAM had rendered
 * the UNARMED corpus four times, because zsh does not word-split an unquoted `$flags` and passed
 * the whole string as ONE argument. `compareDirs` therefore reports the *identical* count AND the
 * *differing* count, and `livenessAgainst()` exists so every armed proof can carry its
 * differs-from-unarmed control in the same measurement rather than in a separate act of faith.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
export const shaFile = (p) => sha256(readFileSync(p));
export const shaShort = (p, n = 16) => shaFile(p).slice(0, n);
/** a stable digest of a plain object — keys sorted, so key order cannot fake a difference */
export const shaObject = (o, n = 16) => sha256(JSON.stringify(o, Object.keys(flatten(o)).sort())).slice(0, n);
function flatten(o, pre = '', out = {}) {
  if (o && typeof o === 'object' && !Array.isArray(o)) for (const k of Object.keys(o)) flatten(o[k], `${pre}${k}.`, out);
  else out[pre.slice(0, -1)] = o;
  return out;
}

/** every artifact of a render directory, name → {sha, bytes} */
export function digestDir(dir, { ext = '.svg', include = null } = {}) {
  const out = {};
  for (const f of readdirSync(dir).sort()) {
    if (ext && !f.endsWith(ext)) continue;
    if (include && !include(f)) continue;
    const p = join(dir, f);
    if (!statSync(p).isFile()) continue;
    out[f] = { sha: shaFile(p), bytes: statSync(p).size };
  }
  return out;
}

/**
 * Compare two render directories. Returns identical/differing/onlyA/onlyB — and the count of
 * IDENTICAL artifacts is the dormancy verdict while the count of DIFFERING ones is the liveness
 * verdict. Both are reported because either alone can be produced by a run that never happened.
 */
export function compareDirs(a, b, opts = {}) {
  const A = digestDir(a, opts), B = digestDir(b, opts);
  const names = [...new Set([...Object.keys(A), ...Object.keys(B)])].sort();
  const identical = [], differing = [], onlyA = [], onlyB = [];
  for (const n of names) {
    if (!B[n]) { onlyA.push(n); continue; }
    if (!A[n]) { onlyB.push(n); continue; }
    (A[n].sha === B[n].sha ? identical : differing).push(n);
  }
  return {
    identical, differing, onlyA, onlyB, A, B,
    n: names.length,
    line: `identical ${identical.length} · differing ${differing.length} · onlyA ${onlyA.length} · onlyB ${onlyB.length} of ${names.length}`,
  };
}

/**
 * ⭐⭐ THE LIVENESS CONTROL, MADE MECHANICAL. An armed run is only a measurement of the armed
 * picture if it DIFFERS from the unarmed one. Pass the armed dir and the unarmed dir; a zero
 * differing count is a FAILED control, not a clean result, and is returned as such.
 */
export function livenessAgainst(armedDir, unarmedDir, opts = {}) {
  const c = compareDirs(unarmedDir, armedDir, opts);
  return {
    live: c.differing.length > 0,
    differing: c.differing.length,
    of: c.n,
    verdict: c.differing.length > 0
      ? `LIVE — the armed arm differs from unarmed on ${c.differing.length} of ${c.n}`
      : `⛔ DEAD CONTROL — the "armed" arm is byte-identical to unarmed on all ${c.n}; the flags did not reach the renderer`,
  };
}

/** determinism: two runs of the SAME arm must agree on every artifact */
export function determinism(runA, runB, opts = {}) {
  const c = compareDirs(runA, runB, opts);
  return {
    deterministic: c.differing.length === 0 && c.onlyA.length === 0 && c.onlyB.length === 0,
    verdict: `${c.identical.length} of ${c.n} byte-identical across the double run`,
    detail: c,
  };
}
