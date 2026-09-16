/**
 * enforcedByExists.test.js — [claims-parity-1] the EXISTENCE sibling to the meta-pin.
 *
 * The completeness meta-pin (enforcement-claims.test.js) only validates @enforced-by
 * targets that sit within ±3 lines of the CLAIM_RE completeness vocabulary — a handful
 * of the 60-odd tags. The rest (dormancy byte-identity, single-writer, lazy-leaf-sentinel,
 * secrets-seam headers) point at real enforcer files, but nothing checked those PATHS
 * still resolve — so a renamed or deleted test could leave a dangling @enforced-by
 * pointer, and the "no header comment can lie" bar would quietly slip.
 *
 * This pin closes that gap with an EXISTENCE-only check (deliberately NOT the broader
 * gate-reachability classification, which is only well-defined for the claim-vocabulary
 * rule tags): gather EVERY @enforced-by tag across src/ + eslint.config.js and assert
 * every PATH-shaped target it names resolves to a real file. Rule ids ('max-lines'),
 * sanctioned self-references ('this test' / 'this rule block'), and free prose are out of
 * scope here — the path pointers are the ones that silently rot on a rename.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const rel = (p) => path.join(REPO, p);

// A path-shaped @enforced-by target: a repo-relative path ending in a code/config ext.
// Rule ids (jsx-a11y/alt-text) carry no extension and never match; ')' / trailing prose
// bound the match, and \b keeps a trailing '.' out of the capture.
const PATH_RE = /[\w@][\w./@-]*\.(?:js|jsx|ts|tsx|json|mjs|cjs)\b/g;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp, out);
    else if (/\.(?:js|jsx|ts|tsx)$/.test(e.name)) out.push(fp);
  }
  return out;
}

/** { file, line, target } for every path-shaped @enforced-by target in the corpus. */
function gatherPathTargets() {
  const files = [...walk(rel('src')), rel('eslint.config.js')];
  const out = [];
  for (const abs of files) {
    if (!fs.existsSync(abs)) continue;
    const lines = fs.readFileSync(abs, 'utf8').split('\n');
    for (let i = 0; i < lines.length; i++) {
      const ti = lines[i].indexOf('@enforced-by');
      if (ti === -1) continue;
      const rest = lines[i].slice(ti + '@enforced-by'.length);
      for (const m of rest.matchAll(PATH_RE)) {
        out.push({ file: path.relative(REPO, abs), line: i + 1, target: m[0] });
      }
    }
  }
  return out;
}

const targets = gatherPathTargets();

describe('@enforced-by path targets exist (claims-parity-1)', () => {
  it('scans a non-trivial number of @enforced-by path targets (regex did not silently break)', () => {
    expect(targets.length).toBeGreaterThanOrEqual(30);
  });

  it('every @enforced-by path target resolves to a real file', () => {
    const dangling = targets
      .filter((t) => !fs.existsSync(rel(t.target)))
      .map((t) => `${t.file}:${t.line} -> ${t.target}`);
    expect(
      dangling,
      `\nDangling @enforced-by path targets (a header names an enforcer that no longer exists — rename the pointer or restore the file):\n${dangling.join('\n')}\n`,
    ).toEqual([]);
  });
});
