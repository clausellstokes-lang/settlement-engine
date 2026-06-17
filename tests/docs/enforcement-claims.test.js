/**
 * enforcement-claims.test.js — A+ P1.1 (the meta-pin / "the spine that holds the spine").
 *
 * The #1 meta-finding of every review: prevention infrastructure outruns
 * adoption, and "promoted to ERROR / burned to zero / machine-enforced" claims
 * silently overstate what the gate actually proves. A claim is a liability the
 * moment it can drift from reality unnoticed.
 *
 * This pin converts every completeness claim from prose-honor-system into a
 * gate-checked contract. It scans a fixed corpus for claim vocabulary; each hit
 * MUST carry a co-located `@enforced-by <target[, target...]>` tag, and every
 * target must resolve to a LIVE enforcer reachable from `npm run check`:
 *   - an eslint rule id (plugin/rule or core) currently at ERROR severity, OR
 *   - a test file under tests/ ending in .test.js (vitest runs it), OR
 *   - a config/script file referenced by a `check` sub-script (e.g. tsconfig).
 *
 * You cannot write "promoted to ERROR" without naming the rule that is actually
 * at error severity; you cannot delete that rule or downgrade it to warn without
 * this pin going red. It is self-applying — it would have caught every overstated
 * claim in the A+ roadmap at authorship time.
 *
 * Excluded by construction: docs that DEFINE or QUOTE the convention as examples
 * (CONTRIBUTING.md's operating standard, docs/A_PLUS_ROADMAP.md) — they are not
 * standing assertions about current state, so they are not in the corpus.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { ESLint } from 'eslint';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const rel = (p) => path.join(REPO, p);

// The completeness-claim vocabulary (spec: A_PLUS_ROADMAP enforcement.1).
const CLAIM_RE = /promoted (?:from warn )?to (?:ERROR|error)|burned (?:down )?to zero|0 problems|machine-enforced|the gate now (?:covers|type-checks)|fails the gate|zero violations/;

// Standing-claim corpus. Meta-docs that merely QUOTE the vocabulary
// (CONTRIBUTING.md, docs/A_PLUS_ROADMAP.md) are deliberately absent.
const DOC_FILES = [
  'ARCHITECTURE.md',
  'docs/critique-implementation-status.md',
  'docs/COHESION_REMEDIATION_PLAN.md',
  'eslint.config.js',
];

// Representative files whose resolved eslint config we inspect for rule
// severities. One JSX (component layer: jsx-a11y + visual-budget jsx rules)
// and one plain JS (general block: analytics, visual-budget, jsx-hygiene).
const REPRESENTATIVE_FILES = [
  'src/components/AccountMenu.jsx',
  'src/lib/analyticsQueue.js',
];

const WINDOW = 3; // a claim's @enforced-by tag must sit within ±3 lines (same comment block / paragraph)

const isCommentLine = (line, idx) =>
  /^\s*(\/\/|\*|\/\*)/.test(line) || line.slice(0, idx).includes('//');

// ── target classification ────────────────────────────────────────────────────
const FILE_EXT_RE = /\.(?:js|mjs|cjs|ts|json)$/;
const isPathTarget = (t) => FILE_EXT_RE.test(t);
const isRuleTarget = (t) => /^[a-z0-9@-]+\/[a-z0-9-]+$/.test(t) && !FILE_EXT_RE.test(t);
const CORE_RULES = new Set(['max-lines', 'no-restricted-syntax', 'no-restricted-imports', 'no-console']);
const isCoreRule = (t) => CORE_RULES.has(t);
const isTarget = (t) => isPathTarget(t) || isRuleTarget(t) || isCoreRule(t);

/** Parse the leading run of resolvable targets after an `@enforced-by` marker. */
function parseTargets(rest) {
  const out = [];
  for (let tok of rest.trim().split(/[\s,]+/)) {
    tok = tok.replace(/^[`'"(]+/, '').replace(/[`'".,;:)]+$/, '');
    if (!tok) continue;
    if (isTarget(tok)) out.push(tok);
    else break; // hit prose (e.g. the `-->` of an HTML comment) — stop consuming
  }
  return out;
}

function walkJs(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walkJs(fp, out);
    else if (/\.(?:js|jsx|ts)$/.test(e.name)) out.push(fp);
  }
  return out;
}

function gatherClaims() {
  const files = DOC_FILES.map(rel);
  const srcDir = rel('src');
  if (fs.existsSync(srcDir)) files.push(...walkJs(srcDir)); // src header-comment claims too
  const claims = [];
  for (const abs of files) {
    if (!fs.existsSync(abs)) continue; // DOC_FILES existence asserted separately
    const isJs = /\.(?:js|jsx|ts)$/.test(abs);
    const lines = fs.readFileSync(abs, 'utf8').split('\n');
    for (let i = 0; i < lines.length; i++) {
      const m = CLAIM_RE.exec(lines[i]);
      if (!m) continue;
      if (isJs && !isCommentLine(lines[i], m.index)) continue; // skip string-literal matches in code
      const lo = Math.max(0, i - WINDOW);
      const hi = Math.min(lines.length - 1, i + WINDOW);
      const targets = [];
      let tagged = false;
      for (let j = lo; j <= hi; j++) {
        const ti = lines[j].indexOf('@enforced-by');
        if (ti === -1) continue;
        tagged = true;
        targets.push(...parseTargets(lines[j].slice(ti + '@enforced-by'.length)));
      }
      claims.push({
        file: path.relative(REPO, abs),
        line: i + 1,
        text: lines[i].trim().slice(0, 120),
        match: m[0],
        tagged,
        targets,
      });
    }
  }
  return claims;
}

// ── gate reachability ────────────────────────────────────────────────────────
const pkg = JSON.parse(fs.readFileSync(rel('package.json'), 'utf8'));
const CHECK = pkg.scripts.check || '';
const CHECK_SUBNAMES = [...CHECK.matchAll(/npm run ([\w:-]+)/g)].map((m) => m[1]);
const CHECK_CMDS = CHECK_SUBNAMES.map((n) => pkg.scripts[n] || '').join('\n');

const claims = gatherClaims();

describe('enforcement-claims meta-pin (A+ P1.1)', () => {
  /** rule id -> highest severity (0 off / 1 warn / 2 error) seen across representative files */
  const ruleSeverity = new Map();

  beforeAll(async () => {
    const eslint = new ESLint();
    for (const f of REPRESENTATIVE_FILES) {
      const cfg = await eslint.calculateConfigForFile(rel(f));
      for (const [ruleId, val] of Object.entries(cfg.rules || {})) {
        const raw = Array.isArray(val) ? val[0] : val;
        const n = raw === 'error' ? 2 : raw === 'warn' ? 1 : raw === 'off' ? 0 : Number(raw) || 0;
        ruleSeverity.set(ruleId, Math.max(ruleSeverity.get(ruleId) ?? 0, n));
      }
    }
  });

  function resolveTarget(t) {
    if (isPathTarget(t)) {
      if (!fs.existsSync(rel(t))) return { ok: false, why: `path does not exist: ${t}` };
      if (t.startsWith('tests/') && t.endsWith('.test.js')) {
        return CHECK_SUBNAMES.includes('test')
          ? { ok: true }
          : { ok: false, why: 'check chain has no `test` step — vitest not reachable' };
      }
      return CHECK_CMDS.includes(t)
        ? { ok: true }
        : { ok: false, why: `${t} is not referenced by any \`npm run check\` sub-script` };
    }
    if (isRuleTarget(t) || isCoreRule(t)) {
      const sev = ruleSeverity.get(t);
      return sev === 2
        ? { ok: true }
        : { ok: false, why: `eslint rule "${t}" is not at error severity (resolved: ${sev ?? 'absent'})` };
    }
    return { ok: false, why: `unrecognized @enforced-by target: ${t}` };
  }

  it('scans a non-trivial number of completeness claims (regex did not silently break)', () => {
    expect(claims.length).toBeGreaterThanOrEqual(5);
  });

  it('every corpus file exists (a rename must update the corpus list, not silently drop coverage)', () => {
    for (const f of DOC_FILES) expect(fs.existsSync(rel(f)), `${f} missing`).toBe(true);
  });

  it('`npm run check` includes typecheck, lint, and test (the three enforcer classes)', () => {
    expect(CHECK_SUBNAMES).toEqual(expect.arrayContaining(['typecheck', 'lint', 'test']));
  });

  it('every completeness claim carries an @enforced-by tag with ≥1 target', () => {
    const naked = claims
      .filter((c) => !c.tagged || c.targets.length === 0)
      .map((c) => `${c.file}:${c.line}  "${c.text}"  (matched: ${c.match})`);
    expect(naked, `\nClaims with no resolvable @enforced-by tag:\n${naked.join('\n')}\n`).toEqual([]);
  });

  it('every @enforced-by target resolves to a live enforcer reachable from the gate', () => {
    const failures = [];
    for (const c of claims) {
      for (const t of c.targets) {
        const r = resolveTarget(t);
        if (!r.ok) failures.push(`${c.file}:${c.line} -> ${t}: ${r.why}`);
      }
    }
    expect(failures, `\nUnresolvable @enforced-by targets:\n${failures.join('\n')}\n`).toEqual([]);
  });

  // ── detector self-tests: prove the resolver discriminates, so a green result
  //    means something. A warn-severity rule, a missing file, and an unknown
  //    rule must all be REJECTED; a real error-rule / referenced script ACCEPTED.
  describe('resolver discriminates (negative + positive controls)', () => {
    it('rejects an eslint rule that is only at warn severity', () => {
      // max-lines is warn (not error) for the component layer — a downgrade must not pass.
      expect(resolveTarget('max-lines').ok).toBe(false);
    });
    it('rejects a missing test/file path', () => {
      expect(resolveTarget('tests/__does_not_exist__/missing.test.js').ok).toBe(false);
    });
    it('rejects an unknown eslint rule id', () => {
      expect(resolveTarget('made-up/never-registered').ok).toBe(false);
    });
    it('accepts a real error-severity rule', () => {
      expect(resolveTarget('visual-budget/no-raw-color').ok).toBe(true);
    });
    it('accepts a script file referenced by a check sub-script', () => {
      // validate:data runs `node scripts/find-duplicate-keys.js`.
      expect(resolveTarget('scripts/find-duplicate-keys.js').ok).toBe(true);
    });
  });
});
