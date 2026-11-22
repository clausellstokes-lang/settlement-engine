/**
 * pulseKernelLineAddress.walker.test.js — habitat removal for the HAND-KEYED
 * LINE-ADDRESS class (LANE KR, 2026-08-03; cycle-16 K-2 verifier finding).
 *
 * THE CLASS. src/domain/certification/ documents each subsystem row's gate by
 * quoting where the pulse kernel reads it. Fifteen of those citations were spelled
 * as LINE NUMBERS — `pulseKernel.js:<n>` — inside comments and inside the rows'
 * own `other` prose. A line number is not an assertion: it is text about source
 * that no machine compares to source, so ANY edit above the cited line silently
 * re-points it at unrelated code while every test stays green. That is not a
 * hypothetical. Every one of the fifteen was measured stale when this walker
 * landed, the worst by ~107 lines: `allyIntelSharingEnabled`'s row cited :1838
 * (a `settlementIds: thawDigest?.settlementIds || []` line) for a gate that lives
 * at 1945 — and tests/domain/subsystemRowsWar.test.js PINNED that rotted string,
 * comparing doc text to doc text and therefore proving nothing about the kernel.
 *
 * THE CURE, and what this walker enforces:
 *   RULE 1 — ZERO hand-keyed `pulseKernel.js:<digits>` literals anywhere under
 *     src/ or tests/. Frozen at zero, no allowlist: the cure is always available,
 *     so a burn-down ledger would only license the next one.
 *   RULE 2 — CONTENT ANCHORS RESOLVE. The replacement spelling is the estate's
 *     existing content-anchor idiom, `pulseKernel.js` followed by a backticked
 *     source token, and every such token must be literally CONTAINED in
 *     src/domain/worldPulse/pulseKernel.js. A rename or a deleted seam therefore
 *     REDS here, which is exactly what a line number could never do.
 *   RULE 3 — NON-VACUITY. Rule 2 is satisfied trivially if the marker scan finds
 *     nothing (a moved certification tree, a broken walk, a changed spelling), so
 *     the anchor population is floored and the kernel is asserted non-empty.
 *
 * SCOPE, stated so the next reader does not over-read this guard. It governs the
 * pulseKernel citation family only. The wider `<module>.js:<n>` habit is live
 * across the estate (seasons.js, candidateEvents.js, warDeployment.js,
 * navalKernel.js, generosityKernel.js, roadsKernel.js, informationStatecraft.js,
 * stressors.js, moralInstitutionPressure.js, flows.js … in these same files) and
 * is DELIBERATELY DEFERRED — documented, not a bug to re-find: pulseKernel is the
 * file THE DECOMPOSITION WAVE keeps churning, so its addresses rot fastest, and a
 * repo-wide sweep of ~45 mixed literal/glob markers is its own lane. Widen
 * MODULES below when that lane runs; the machinery already takes a set.
 *
 * SELF-EXEMPTION. This file necessarily discusses the banned shape, so it is
 * excluded from the RULE 1 scan — and, because a path exclusion is itself a hole,
 * the guard-the-guard cases build the banned literal by CONCATENATION at runtime
 * (it never appears verbatim in these bytes) and prove both detector directions.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SELF = relative(ROOT, fileURLToPath(import.meta.url)).replace(/\\/g, '/');
const SCAN_ROOTS = ['src', 'tests'];
const SCAN_EXT = /\.(js|jsx|mjs|cjs)$/;

/**
 * The modules whose citations are governed. Key = the basename used in prose,
 * value = the repo-relative module the anchor must be contained in.
 */
const MODULES = Object.freeze({
  'pulseKernel.js': 'src/domain/worldPulse/pulseKernel.js',
});

/** `<module>.js:<digits>` — the banned hand-keyed address. */
const lineAddressRe = (base) => new RegExp(`${base.replace('.', '\\.')}:\\d+`, 'g');
/** `<module>.js \`<token>\`` — the sanctioned content anchor. */
const contentAnchorRe = (base) => new RegExp(`${base.replace('.', '\\.')}[ \\t]+\`([^\`\\n]+)\``, 'g');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Every scanned source file as { rel, src }, self excluded. */
function scannedFiles() {
  const files = [];
  for (const root of SCAN_ROOTS) {
    const abs = join(ROOT, root);
    if (!existsSync(abs)) continue;
    for (const p of walk(abs)) {
      const rel = relative(ROOT, p).replace(/\\/g, '/');
      if (!SCAN_EXT.test(rel) || rel === SELF) continue;
      files.push({ rel, src: readFileSync(p, 'utf8') });
    }
  }
  return files;
}

/** Hand-keyed line addresses, as `${rel}:${line} — ${match}` strings. */
function findLineAddresses(files) {
  const hits = [];
  for (const { rel, src } of files) {
    for (const base of Object.keys(MODULES)) {
      const re = lineAddressRe(base);
      for (const m of src.matchAll(re)) {
        hits.push(`${rel}:${src.slice(0, m.index).split('\n').length} — ${m[0]}`);
      }
    }
  }
  return hits.sort();
}

/** Content anchors, as { rel, line, base, token }. */
function findContentAnchors(files) {
  const found = [];
  for (const { rel, src } of files) {
    for (const base of Object.keys(MODULES)) {
      const re = contentAnchorRe(base);
      for (const m of src.matchAll(re)) {
        found.push({ rel, line: src.slice(0, m.index).split('\n').length, base, token: m[1] });
      }
    }
  }
  return found;
}

const files = scannedFiles();
const lineAddresses = findLineAddresses(files);
const anchors = findContentAnchors(files);
const moduleSource = Object.fromEntries(
  Object.entries(MODULES).map(([base, rel]) => [base, readFileSync(join(ROOT, rel), 'utf8')]),
);

describe('pulseKernel line-address walker (habitat removal)', () => {
  test('RULE 1: no hand-keyed pulseKernel line address survives in src/ or tests/', () => {
    expect(
      lineAddresses,
      '\nHand-keyed kernel line address(es). A line number is text ABOUT source that no test '
      + 'compares TO source: every edit above it re-points the citation at unrelated code and '
      + 'nothing reds. Cite the seam instead — the module basename, a space, and the source '
      + 'expression in backticks (e.g. the kernel\'s own `const seasonsOn = …` line). RULE 2 '
      + 'below then proves that expression still exists. This inventory is FROZEN AT ZERO and '
      + 'takes no allowlist.\n',
    ).toEqual([]);
  });

  test('RULE 2: every content anchor is literally contained in the module it names', () => {
    const rotted = [];
    for (const { rel, line, base, token } of anchors) {
      if (!moduleSource[base].includes(token)) {
        rotted.push(`${rel}:${line} — ${base} does not contain \`${token}\``);
      }
    }
    expect(
      rotted,
      '\nContent anchor(s) naming source that no longer exists. Either the seam moved (re-quote '
      + 'it from the module, and re-read the surrounding claim — a moved seam often means the '
      + 'claim moved too) or the citation was mistyped. Never soften the anchor to a line '
      + 'number to make this pass.\n',
    ).toEqual([]);
  });

  test('RULE 3: the scan is not vacuous — the anchor population and the modules are real', () => {
    // Floors, not budgets: they TIGHTEN toward reality and are never lowered to
    // admit a deletion. 20 anchors landed with the cure (15 replacing the rotted
    // addresses, 5 more where one citation named two seams).
    expect(files.length, 'the src/tests walk collapsed').toBeGreaterThanOrEqual(1000);
    expect(anchors.length, 'the content-anchor population collapsed — did the marker spelling change?').toBeGreaterThanOrEqual(20);
    for (const [base, rel] of Object.entries(MODULES)) {
      expect(existsSync(join(ROOT, rel)), `${rel} (cited as ${base}) does not exist`).toBe(true);
      expect(moduleSource[base].length, `${rel} read as empty — containment would pass on nothing`).toBeGreaterThan(1000);
    }
  });

  // ── GUARD-THE-GUARD ───────────────────────────────────────────────────────
  // A detector regression reads as "no offenders". Both directions are proved on
  // fixtures. The banned literal is CONCATENATED so this file never contains it.
  const BANNED = `pulseKernel.js:${1838}`;

  test('the line-address detector fires on the banned shape and only on it', () => {
    const probe = (text) => [...text.matchAll(lineAddressRe('pulseKernel.js'))].length;
    expect(probe(`Wired at ${BANNED}, which passes a closure.`), 'bare hand-keyed address').toBe(1);
    expect(probe(`see ${BANNED} and ${`pulseKernel.js:${883}`}`), 'two addresses on one line').toBe(2);
    expect(probe('Wired at pulseKernel.js `allyIntel: rules.x === true`'), 'the content anchor is not an address').toBe(0);
    expect(probe('applyWorldPulse.js:941 is a different module'), 'another module is out of scope').toBe(0);
    expect(probe('pulseKernel.js carries the stage markers'), 'a bare module mention').toBe(0);
  });

  test('the content-anchor detector extracts the token, and containment discriminates', () => {
    const grab = (text) => [...text.matchAll(contentAnchorRe('pulseKernel.js'))].map((m) => m[1]);
    expect(grab('gate: pulseKernel.js `const seasonsOn = simulationRules.seasonsEnabled === true` reads it lit'))
      .toEqual(['const seasonsOn = simulationRules.seasonsEnabled === true']);
    expect(grab('pulseKernel.js `a` and pulseKernel.js `b`'), 'two anchors on one line').toEqual(['a', 'b']);
    expect(grab('pulseKernel.js\n * `split across lines`'), 'a marker broken by a comment prefix is NOT recognised — keep it on one line').toEqual([]);
    // The containment check must discriminate: a real seam passes, a plausible
    // fiction fails. Without this, RULE 2 could pass by comparing nothing.
    const kernel = moduleSource['pulseKernel.js'];
    expect(kernel.includes('const seasonsOn = simulationRules.seasonsEnabled === true'), 'a real kernel seam').toBe(true);
    expect(kernel.includes('const seasonsOn = simulationRules.seasonsDisabled === true'), 'a plausible fiction must NOT be contained').toBe(false);
  });
});
