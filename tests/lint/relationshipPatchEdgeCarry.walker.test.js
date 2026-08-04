/**
 * relationshipPatchEdgeCarry.walker.test.js — THE GHOST-WRITE CLASS HAS NO HABITAT.
 *
 * `applyRelationshipPatch` is the relationship plane's ONE sanctioned writer, and
 * it rebuilt its baseline from an EMPTY edge: for a key whose state record had
 * never been written, the type resolved to `neutral` and every axis to NEUTRAL's
 * defaults, so the write silently RE-TYPED an authored hostile or allied edge on
 * its way past. WZ-4 found it and closed it AT ONE CALL SITE (the razing). WZ-5
 * measured the rest: a probe over the domain suite recorded 36 absent-record
 * writes across SEVEN writer sites — including the mainline `applyWorldPulse`
 * path reached through the real kernel. It was never a razing-shaped bug.
 *
 * The cure is in the writer: it takes the edge as a fourth argument and derives
 * the baseline from it. THIS WALKER IS THE OTHER HALF OF THE CURE — the fix alone
 * closes the seven instances, and only a census keeps the EIGHTH from being
 * written next month. Every call site must hand over an edge or be registered as
 * an exemption with a reason, and both directions red:
 *
 *   1. A CALL SITE WITH NO FOURTH ARGUMENT that is not registered ⇒ RED.
 *   2. A REGISTERED EXEMPTION THAT NO LONGER EXISTS ⇒ RED (a stale exemption is
 *      a licence nobody is using and the next author will inherit it).
 *   3. THE CENSUS IS NON-EMPTY AND ANCHORED. The recorded filename-anchored
 *      vacuity class: a walker whose scan set silently empties on a relocation
 *      stays green while guarding nothing. The module set is asserted non-empty
 *      AND the writer's own file is proved to still define the parameter.
 *
 * WHY A SOURCE SCAN: what is under guard is AUTHORSHIP. An edge-less call works
 * perfectly at runtime — it just quietly lies about one relationship in a corner
 * of one save — which is exactly why nothing else catches it.
 *
 * @enforced-by this file
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The writer's own home — the one file allowed to DEFINE the parameter. */
const OWNER = 'src/domain/worldPulse/relationshipEvolution.js';

/**
 * THE EXEMPTION REGISTRY. Empty, and that is the finding: after the WZ-5 sweep
 * every runtime call site in the tree holds a real graph edge at the moment it
 * writes. An entry here must name the site AND why no edge can reach it; the
 * staleness check below makes a lapsed entry red rather than linger.
 * @type {Readonly<Record<string, string>>}
 */
const EXEMPT = Object.freeze({});

/** Every .js under src/, excluding tests. */
function sourceFiles(dir = join(ROOT, 'src'), out = []) {
  for (const name of readdirSync(dir).sort()) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) { sourceFiles(abs, out); continue; }
    if (abs.endsWith('.js') && !abs.endsWith('.test.js')) out.push(abs);
  }
  return out;
}

/**
 * The call sites, as `rel:line` keys with the argument count of each call.
 *
 * Counts top-level commas by walking the call with a MODE STACK. The outcome
 * argument is a multi-line object literal full of commas, so a regex cannot do
 * this — and the first cut of this scanner, which tracked a single `quote`
 * character, MIS-READ the razing's call as three-argument and reported a false
 * positive. The reason is worth keeping: that call's `id` is a template literal
 * containing a NESTED template literal inside a `${...}` substitution, and a
 * flat quote flag treats the inner backtick as the outer one's terminator, after
 * which every brace and comma is counted in the wrong mode. Template
 * substitutions therefore re-enter CODE mode explicitly.
 */
function callSites() {
  /** @type {Array<{ key: string, args: number }>} */
  const sites = [];
  for (const abs of sourceFiles()) {
    const rel = relative(ROOT, abs).split('\\').join('/');
    const src = readFileSync(abs, 'utf8');
    const marker = 'applyRelationshipPatch(';
    for (let i = src.indexOf(marker); i !== -1; i = src.indexOf(marker, i + 1)) {
      // Skip the definition itself and any occurrence inside a comment line.
      const lineStart = src.lastIndexOf('\n', i) + 1;
      const linePrefix = src.slice(lineStart, i);
      if (/(^|\s)(export\s+)?function\s+$/.test(linePrefix)) continue;
      if (/^\s*(\*|\/\/)/.test(linePrefix)) continue;

      /** Mode stack: openers in code mode, quote chars in string mode. */
      const stack = [];
      const inString = () => ['"', "'", '`'].includes(stack[stack.length - 1]);
      let args = 1;
      let j = i + marker.length - 1;
      for (; j < src.length; j += 1) {
        const ch = src[j];
        if (inString()) {
          const quote = stack[stack.length - 1];
          if (ch === '\\') { j += 1; continue; }
          if (quote === '`' && ch === '$' && src[j + 1] === '{') { stack.push('{'); j += 1; continue; }
          if (ch === quote) stack.pop();
          continue;
        }
        // ⚠️ COMMENTS ARE SKIPPED IN CODE MODE, and that is the second defect this
        // scanner had. Argument lists in this tree carry heavy prose, and that
        // prose quotes identifiers in BACKTICKS — so a scanner that only knew
        // about strings entered template mode on a comment's `pair.edge` and
        // mis-read the razing call as three-argument. (Same class as the recorded
        // prose-counting-detectors-must-strip-comments finding.)
        if (ch === '/' && src[j + 1] === '/') { j = src.indexOf('\n', j); if (j === -1) break; continue; }
        if (ch === '/' && src[j + 1] === '*') { j = src.indexOf('*/', j) + 1; if (j === 0) break; continue; }
        if (ch === '"' || ch === "'" || ch === '`') { stack.push(ch); continue; }
        if (ch === '(' || ch === '[' || ch === '{') { stack.push(ch); continue; }
        if (ch === ')' || ch === ']' || ch === '}') {
          stack.pop();
          if (stack.length === 0) break;
          continue;
        }
        if (ch === ',' && stack.length === 1) args += 1;
      }
      // An empty call `applyRelationshipPatch()` has no arguments at all.
      if (src.slice(i + marker.length, j).trim() === '') args = 0;
      sites.push({ key: `${rel}:${src.slice(0, i).split('\n').length}`, args });
    }
  }
  return sites;
}

describe('the relationship writer is never handed a key it cannot type', () => {
  test('the census is NON-EMPTY and the writer still defines the carried edge', () => {
    const sites = callSites();
    // Anti-vacuity, both halves: a relocation that emptied this scan would
    // otherwise leave every assertion below trivially true.
    expect(sites.length).toBeGreaterThanOrEqual(10);
    expect(sourceFiles().length).toBeGreaterThan(100);
    const owner = readFileSync(join(ROOT, OWNER), 'utf8');
    expect(owner).toContain('export function applyRelationshipPatch(');
    // The parameter itself, and the derivation that uses it. Either one going
    // missing means the cure was undone at the source rather than at a caller.
    expect(owner).toContain('edge = null');
    // ⚠️ THE DERIVATION READS `typedEdge`, NOT `edge` (CR-WZ5-A). The first cut
    // of the cure spelled this `ensureRelationshipState(edge || {}` and handed
    // the raw graph edge straight in — which let `channel_inferred` (a
    // graph-plane token with no RELATIONSHIP_DEFAULTS row) be PERSISTED as a
    // relationship's type while its axes fell back to neutral's numbers. The
    // vocabulary closure that produces `typedEdge` is therefore part of the
    // cure, and this anchor is what makes deleting it red instead of silent.
    expect(owner).toContain('ensureRelationshipState(typedEdge,');
    expect(owner).toContain('RELATIONSHIP_DEFAULTS[edgeType] ? edge : {}');
  });

  test('EVERY call site carries the edge, or is a registered exemption', () => {
    const blind = callSites().filter((site) => site.args < 4).map((site) => site.key);
    const unregistered = blind.filter((key) => !Object.prototype.hasOwnProperty.call(EXEMPT, key));
    expect(unregistered, [
      'A relationship write was handed a key with no edge. For a state record that',
      'does not exist yet the writer resolves the type to `neutral`, and an authored',
      'hostile or allied edge is silently re-typed on the way past. Pass the graph',
      'edge as the fourth argument, or register the site in EXEMPT with a reason.',
    ].join(' ')).toEqual([]);
  });

  test('no exemption outlives the call site it excuses', () => {
    const present = new Set(callSites().map((site) => site.key));
    const stale = Object.keys(EXEMPT).filter((key) => !present.has(key));
    expect(stale, 'a registered exemption no longer matches any call site — delete it').toEqual([]);
  });
});
