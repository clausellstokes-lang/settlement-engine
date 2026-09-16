/**
 * enforcedByExists.test.js — [claims-parity-1] the EXISTENCE sibling to the meta-pin.
 *
 * The completeness meta-pin (enforcement-claims.test.js) only validates the tags that
 * sit within ±3 lines of the CLAIM_RE completeness vocabulary — a handful of the
 * 60-odd tags. The rest (dormancy byte-identity, single-writer, lazy-leaf-sentinel,
 * secrets-seam headers) point at real enforcer files, but nothing checked those PATHS
 * still resolve — so a renamed or deleted test could leave a dangling pointer, and the
 * "no header comment can lie" bar would quietly slip.
 *
 * This pin closes that gap with an EXISTENCE-only check (deliberately NOT the broader
 * gate-reachability classification, which is only well-defined for the claim-vocabulary
 * rule tags): gather EVERY tag in the corpus below and assert every PATH-shaped target
 * it names resolves to a real file. Rule ids ('max-lines'), sanctioned self-references
 * ('this test' / 'this rule block'), and free prose are out of scope here — the path
 * pointers are the ones that silently rot on a rename.
 *
 * ── TWO REPAIRS, MEASURED AT 8b07ce45f ───────────────────────────────────────
 *
 * 1. THE CONTINUATION-LINE CORPUS. This pin used to read only the line the marker
 *    itself sits on, and the estate's house style wraps multi-target tags onto the
 *    comment lines below it — with a trailing comma, a trailing `+`/`and`, or a bare
 *    marker that ends its line with every target underneath. 83 of 433 targets lived
 *    past a wrap and were never checked, and TWO of them had been dangling in src/
 *    for months — inside the corpus this header already declared it covered. A pin
 *    that reads one line of a two-line tag is not an existence check, it is a sample.
 *
 * 2. THE CORPUS BEYOND src/. Every tag written by a test, a script, an edge function
 *    or a bundled module was outside the walk. Widening it was free: 331 → 350
 *    tag-line targets with ZERO dangling on either side.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const rel = (p) => path.join(REPO, p);

// A path-shaped target: a repo-relative path ending in a code/config ext.
// Rule ids (jsx-a11y/alt-text) carry no extension and never match; ')' / trailing prose
// bound the match, and \b keeps a trailing '.' out of the capture.
const PATH_RE = /[\w@][\w./@-]*\.(?:js|jsx|ts|tsx|json|mjs|cjs)\b/g;

const MARKER = '@enforced-by';

// The corpus. src/ alone left the tags in tests, scripts, edge functions and the
// bundled modules unchecked; the widening adds 19 targets and no dangling ones.
const CORPUS_DIRS = ['src', 'tests', 'scripts', 'supabase', 'api', 'e2e', 'mcp-server', 'foundry-module'];

// A locally-installed dependency tree or a build output inside one of those dirs is
// not the estate's prose. None exists today; the guard is here because widening past
// src/ is what put user-writable directories inside the walk in the first place.
const SKIP_DIRS = new Set(['node_modules', 'dist', 'coverage', '.vite']);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp, out);
    else if (/\.(?:js|jsx|ts|tsx)$/.test(e.name)) out.push(fp);
  }
  return out;
}

const isCommentLine = (line) => /^\s*(?:\/\/|\*|\/\*)/.test(line);

/**
 * Does this line OPEN with a path-shaped token? That is what separates a wrapped
 * target list from the prose that follows a tag: a continuation line starts with the
 * next target, a prose line starts with a word.
 */
function leadsWithPathToken(line) {
  const first = line.replace(/^\s*(?:\/\/|\*|\/\*)\s*/, '').trim().split(/[\s,]+/)[0] || '';
  const bare = first.replace(/^[`'"(]+/, '').replace(/[`'".,;:)]+$/, '');
  return /\.(?:js|jsx|ts|tsx|json|mjs|cjs)$/.test(bare);
}

/** { file, line, target, where } for every path-shaped target in the corpus. */
function gatherPathTargets() {
  const files = [...CORPUS_DIRS.flatMap((d) => walk(rel(d))), rel('eslint.config.js')];
  const out = [];
  for (const abs of files) {
    if (!fs.existsSync(abs)) continue;
    const file = path.relative(REPO, abs);
    const lines = fs.readFileSync(abs, 'utf8').split('\n');
    const take = (text, i, where) => {
      for (const m of text.matchAll(PATH_RE)) out.push({ file, line: i + 1, target: m[0], where });
    };
    for (let i = 0; i < lines.length; i++) {
      const ti = lines[i].indexOf(MARKER);
      if (ti === -1) continue;
      take(lines[i].slice(ti + MARKER.length), i, 'tag');
      // Walk the wrap. The run ends at the first line that is not a comment, carries
      // a marker of its own (a new tag owns its own targets), or opens with prose.
      for (let j = i + 1; j < lines.length; j++) {
        if (!isCommentLine(lines[j])) break;
        if (lines[j].includes(MARKER)) break;
        if (!leadsWithPathToken(lines[j])) break;
        take(lines[j], j, 'continuation');
      }
    }
  }
  return out;
}

const targets = gatherPathTargets();
const wrapped = targets.filter((t) => t.where === 'continuation');

describe('@enforced-by path targets exist (claims-parity-1)', () => {
  it('scans a non-trivial number of @enforced-by path targets (regex did not silently break)', () => {
    expect(targets.length).toBeGreaterThanOrEqual(30);
    // ANTI-VACUITY FOR THE WRAP READER SPECIFICALLY. The floor above is on the TOTAL,
    // which the tag lines alone clear ten times over — so the continuation walk could
    // stop finding anything at all and this pin would stay green while silently
    // reverting to the one-line blindness it was repaired to fix. Measured 83 at
    // 8b07ce45f; the floor sits far enough below that ordinary prose churn cannot red
    // it and only a structural break can.
    expect(
      wrapped.length,
      'the continuation-line walk found almost nothing — the wrap reader has broken and'
      + ' this pin has quietly gone back to reading one line per tag',
    ).toBeGreaterThanOrEqual(40);
  });

  it('every @enforced-by path target resolves to a real file', () => {
    const dangling = targets
      .filter((t) => !fs.existsSync(rel(t.target)))
      .map((t) => `${t.file}:${t.line} -> ${t.target}${t.where === 'continuation' ? '  (on a continuation line of the tag above)' : ''}`);
    expect(
      dangling,
      `\nDangling @enforced-by path targets (a header names an enforcer that no longer exists — rename the pointer or restore the file):\n${dangling.join('\n')}\n`,
    ).toEqual([]);
  });
});
