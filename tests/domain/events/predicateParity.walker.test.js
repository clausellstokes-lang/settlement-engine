/**
 * tests/domain/events/predicateParity.walker.test.js — THE PREDICATE-PARITY
 * WALKER (Composer V2 §2, structural prevention).
 *
 * Every in-handler gate in mutateEntities.js / mutateWorld.js is a
 * `vetoMutation('code', …)` call site. This walker source-scans both files for
 * the complete code census (the DENOMINATOR — comment-stripped, so a code in
 * prose never counts) and asserts every code is CLAIMED by some affordance-
 * manifest entry's coversVetoCodes. A new gate cannot ship without a predicate
 * that can keep the composer from offering the doomed action.
 *
 * Template-literal codes (`cult_${reason}`, `power_${error}`) are resolved by
 * PREFIX: the manifest must declare at least one concrete code per scanned
 * prefix, and every declared code with that prefix counts as claimed.
 *
 * EXEMPTION LEDGER: shrink-only, ZERO at foundation (§9's bar) — a gate
 * without a predicate is a build failure, not a note.
 *
 * CANNOT-CATCH (documented evasion gaps): a gate that returns the raw
 * settlement instead of vetoMutation() (the pre-veto idiom) is invisible to
 * this scan — the veto-channel suite + batch eventConsumes remain the
 * behavioral backstop for those; new gates MUST use vetoMutation.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AFFORDANCE_MANIFEST } from '../../../src/domain/events/affordanceManifest.js';

// ── The shrink-only exemption ledger (ZERO at foundation) ───────────────────
const EXEMPT_VETO_CODES = Object.freeze({
  // (empty — every gate has a covering predicate; keep it that way)
});
const EXEMPT_CEILING = 0;

const HANDLER_FILES = [
  'src/domain/events/mutateEntities.js',
  'src/domain/events/mutateWorld.js',
];

function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/** @returns {{ literals: Set<string>, prefixes: Set<string> }} */
function scanVetoCodes() {
  const literals = new Set();
  const prefixes = new Set();
  for (const rel of HANDLER_FILES) {
    const code = stripComments(readFileSync(join(process.cwd(), rel), 'utf-8'));
    for (const m of code.matchAll(/vetoMutation\(\s*'([^']+)'/g)) literals.add(m[1]);
    for (const m of code.matchAll(/vetoMutation\(\s*`([A-Za-z0-9_]+)\$\{/g)) prefixes.add(m[1]);
  }
  return { literals, prefixes };
}

function declaredCodes() {
  const out = new Set();
  for (const entry of Object.values(AFFORDANCE_MANIFEST)) {
    for (const c of entry.coversVetoCodes || []) out.add(c);
  }
  return out;
}

describe('predicate-parity walker (in-handler gates ↔ manifest predicates)', () => {
  const { literals, prefixes } = scanVetoCodes();
  const declared = declaredCodes();

  it('finds a real denominator (the scan is not vacuous)', () => {
    expect(literals.size).toBeGreaterThanOrEqual(15);
    expect(prefixes.size).toBeGreaterThanOrEqual(2); // cult_ + power_
  });

  it('every literal veto code is claimed by a manifest predicate or exempt', () => {
    const unclaimed = [...literals].filter(c => !declared.has(c) && !(c in EXEMPT_VETO_CODES));
    expect(
      unclaimed,
      `gates without a covering predicate: ${unclaimed.join(', ')} — add coversVetoCodes to the verb's manifest entry (and a predicate that keeps the composer from offering the doomed action)`,
    ).toEqual([]);
  });

  it('every template-code prefix has at least one concrete declared code', () => {
    const bare = [...prefixes].filter(pre => ![...declared].some(c => c.startsWith(pre)));
    expect(
      bare,
      `template veto sites with no declared codes: ${bare.join(', ')}`,
    ).toEqual([]);
  });

  it('no manifest entry claims a code that no gate raises (stale coverage)', () => {
    const stale = [...declared].filter(c =>
      !literals.has(c) && ![...prefixes].some(pre => c.startsWith(pre)));
    expect(
      stale,
      `coversVetoCodes entries no handler raises: ${stale.join(', ')}`,
    ).toEqual([]);
  });

  it('the exemption ledger is shrink-only and at its zero foundation', () => {
    expect(Object.keys(EXEMPT_VETO_CODES).length).toBeLessThanOrEqual(EXEMPT_CEILING);
  });
});
