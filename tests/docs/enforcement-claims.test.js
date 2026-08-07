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
import os from 'node:os';
import path from 'node:path';
import url from 'node:url';
import { ESLint } from 'eslint';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const rel = (p) => path.join(REPO, p);

// The completeness-claim vocabulary (spec: A_PLUS_ROADMAP enforcement.1).
// "fails the build" joined in fix wave 3: VOICE_AND_TONE.md §7 claimed a
// voiceMechanics guard "fails the build" for months before the guard existed —
// the phantom-claim shape this pin exists to kill.
const CLAIM_RE = /promoted (?:from warn )?to (?:ERROR|error)|burned (?:down )?to zero|0 problems|machine-enforced|the gate now (?:covers|type-checks)|fails the gate|fails the build|zero violations/;

// Standing-claim corpus (SS4: generalized from a fixed 3-doc list). The old
// corpus was enumerated by hand, so a NEW doc making a completeness claim was
// outside the gate BY CONSTRUCTION. Now the corpus is every root-level *.md and
// docs/**/*.md, minus the frozen EXEMPT list below of docs that QUOTE the
// vocabulary rather than assert current state — a new doc is in-corpus by
// default, and exempting one is a visible, reviewed act on this list.
const EXEMPT_DOCS = Object.freeze({
  'CONTRIBUTING.md': 'defines the @enforced-by operating standard (quotes the vocabulary as spec)',
  'docs/A_PLUS_ROADMAP.md': 'the A+ spec — quotes the vocabulary as acceptance criteria',
  'CODEBASE_REVIEW.md': 'historical point-in-time review snapshot (quotes claims as findings)',
  'docs/COMPREHENSIVE_REVIEW_2026-07-13.md': 'historical review snapshot (quotes claims as findings)',
  'docs/COMPREHENSIVE_REVIEW_2026-07-15.md': 'historical review snapshot (quotes claims as findings)',
});

function walkMd(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walkMd(fp, out);
    else if (/\.md$/i.test(e.name)) out.push(fp);
  }
  return out;
}

const DOC_FILES = [
  ...fs.readdirSync(REPO).filter((n) => /\.md$/i.test(n)),
  ...walkMd(rel('docs')).map((abs) => path.relative(REPO, abs).split(path.sep).join('/')),
  'eslint.config.js',
].filter((f) => !(f in EXEMPT_DOCS));

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

// ── executed-text narrowing ──────────────────────────────────────────────────
// A COMMENT IS NOT ENFORCEMENT. The one-hop resolver below concatenates the text
// of every script the check chain names; its first spelling concatenated the
// ENTIRE text, comments included, so an `@enforced-by <path>` could resolve off a
// prose mention rather than executed enforcement. That is not hypothetical in
// this repo: `scripts/check-domain-strict.mjs` names `tsconfig.full.json` exactly
// once, in its header comment ("Step 9 is `typecheck:ratchet` over
// `tsconfig.full.json`"), and executes it never. Under the un-narrowed resolver
// that comment alone kept the full-typecheck config "gate-reachable" even with
// the step that actually runs it deleted from the chain.
//
// So: strip comments, keep code AND string-literal contents — the enforcement a
// script performs lives in its arguments (`'npx tsc --noEmit -p
// tsconfig.full.json'`), which are string literals, not in its prose.
const REGEX_PRECEDER_RE =
  /[([{;,:=?!&|+\-*%~^<>]$|\b(?:return|typeof|instanceof|in|of|new|delete|void|case|do|else|yield|await)$/;

function stripShellComments(src) {
  return src.split('\n').map((line) => {
    let quote = null;
    let out = '';
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '\\' && quote !== "'") { out += line.slice(i, i + 2); i++; continue; }
      if (quote) { out += c; if (c === quote) quote = null; continue; }
      if (c === '"' || c === "'") { quote = c; out += c; continue; }
      // `#` only opens a comment at a word boundary — `$#` and `${#v}` are code.
      if (c === '#' && (i === 0 || /\s/.test(line[i - 1]))) break;
      out += c;
    }
    return out;
  }).join('\n');
}

/**
 * Remove comment spans, preserving code and string/template/regex literals.
 * Regex literals are tracked (via the preceding significant token) so a pattern
 * like `/https:\/\//` is not mistaken for a line comment and does not swallow
 * the rest of its line.
 */
export function executedText(src, file = '') {
  if (/\.sh$/.test(file)) return stripShellComments(src);
  let out = '';
  let tail = ''; // last ≤16 emitted chars — enough for the longest keyword preceder
  const emit = (s) => { out += s; tail = (tail + s).slice(-16); };
  for (let i = 0; i < src.length;) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      emit(c); i++;
      while (i < src.length) {
        const s = src[i];
        if (s === '\\') { emit(src.slice(i, i + 2)); i += 2; continue; }
        emit(s); i++;
        if (s === c) break;
      }
      continue;
    }
    if (c === '/' && REGEX_PRECEDER_RE.test(tail.replace(/\s+$/, ''))) {
      emit(c); i++;
      let inClass = false;
      while (i < src.length) {
        const s = src[i];
        if (s === '\\') { emit(src.slice(i, i + 2)); i += 2; continue; }
        if (s === '[') inClass = true;
        else if (s === ']') inClass = false;
        emit(s); i++;
        if (s === '\n') break;            // unterminated: it was not a regex
        if (s === '/' && !inClass) break;
      }
      continue;
    }
    emit(c); i++;
  }
  return out;
}

// ── gate reachability ────────────────────────────────────────────────────────
const pkg = JSON.parse(fs.readFileSync(rel('package.json'), 'utf8'));

// ONE HOP THROUGH A DELEGATING GATE STEP.
// `resolveTarget` asks "is this enforcer REACHABLE FROM THE GATE?" and answered it
// by string-matching the target against the package.json command text alone. That
// read a gate step as covering only what its own command line spells out — so the
// moment a step delegates to a script, everything the script drives became
// invisible. It broke concretely when `typecheck`
// (`tsc --noEmit -p tsconfig.full.json`) became `typecheck:ratchet`
// (`node scripts/check-full-typecheck.mjs`): the ratchet still runs
// tsconfig.full.json on every gate run, but the literal moved one file away and
// ARCHITECTURE.md's `@enforced-by tsconfig.full.json` stopped resolving.
// A config a gate-run script EXECUTES is gate-reachable, so follow the hop —
// through executed text only. This only ever ADDS resolvable targets; a target
// naming a non-existent path still fails.
const GATE_SCRIPT_RE = /\bscripts\/[\w./-]+\.(?:mjs|js|cjs|sh)\b/g;

/**
 * The gate's reachable ENFORCEMENT surface for a given package `scripts` map,
 * rooted at `root`. Pure in its inputs, so the mutants below drive this exact
 * resolver against a THROWAWAY package.json instead of a hand-simulated copy.
 */
export function gateReach(scripts, root) {
  const check = scripts.check || '';
  const subnames = [...check.matchAll(/npm run ([\w:-]+)/g)].map((m) => m[1]);
  const cmdText = subnames.map((n) => scripts[n] || '').join('\n');
  const hops = [...new Set(cmdText.match(GATE_SCRIPT_RE) || [])]
    .filter((p) => fs.existsSync(path.join(root, p)))
    .map((p) => executedText(fs.readFileSync(path.join(root, p), 'utf8'), p));
  return { subnames, text: [cmdText, ...hops].join('\n') };
}

const GATE = gateReach(pkg.scripts, REPO);
const CHECK_SUBNAMES = GATE.subnames;
const CHECK_CMDS = GATE.text;

// The full typecheck's identity is its CONFIG, not the step's name. See the pin
// below for why the name is not admissible evidence.
const FULL_TYPECHECK_CONFIG = 'tsconfig.full.json';

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
        // The vitest CLASS must be in the chain; which spelling carries it is an
        // implementation detail — same reasoning as the typecheck class below.
        // It is `test:ratchet` since 2026-08-07: the bare boolean step was red,
        // and the chain being `&&`, it took `build` and `verify:dist` dark
        // behind it. A literal `includes('test')` here made EVERY tests/** claim
        // in the corpus unresolvable the moment the step was renamed.
        return CHECK_SUBNAMES.some((n) => /^test(:|$)/.test(n))
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

  it('every EXEMPT doc still exists and the corpus stays non-trivial (walk did not silently collapse)', () => {
    for (const f of Object.keys(EXEMPT_DOCS)) {
      expect(fs.existsSync(rel(f)), `${f} exempt but missing — a rename must update EXEMPT_DOCS`).toBe(true);
    }
    expect(DOC_FILES.length, 'md walk found implausibly few corpus docs').toBeGreaterThanOrEqual(10);
  });

  it('`npm run check` includes typecheck, lint, and test (the three enforcer classes)', () => {
    // The typecheck CLASS must be in the chain; which spelling carries it is an
    // implementation detail. It is `typecheck:ratchet` since 2026-08-07 — the bare
    // boolean step went red on 2026-08-02 and, the chain being `&&`, took lint,
    // test, build and verify:dist dark behind it for four days.
    expect(
      CHECK_SUBNAMES.filter((n) => /^typecheck(:|$)/.test(n)),
      'the check chain runs no typecheck step at all',
    ).not.toEqual([]);
    // Same for the TEST class, and for the same reason: it is `test:ratchet`
    // since 2026-08-07 (scripts/check-test-ratchet.mjs), which RUNS the whole
    // vitest suite and compares the result against a frozen, attributed,
    // per-test census. Asserting the literal name `test` would red on the
    // rename while proving nothing about whether tests actually run.
    expect(CHECK_SUBNAMES).toEqual(expect.arrayContaining(['lint']));
    expect(
      CHECK_SUBNAMES.filter((n) => /^test(:|$)/.test(n)),
      'the check chain runs no test step at all',
    ).not.toEqual([]);
  });

  // A NAME IS NOT EVIDENCE. The pin above is satisfied by ANY step whose name
  // begins `typecheck` — and the chain carries two of them
  // (`typecheck:ratchet` over tsconfig.full.json, `typecheck:domain:strict` over
  // tsconfig.domain-strict.json, which disagree by construction). So deleting
  // the FULL typecheck from the chain entirely leaves that pin green, which is
  // the whole failure it was written to prevent. The full typecheck's identity
  // is its CONFIG; assert the config is reachable through EXECUTED gate text.
  it('`npm run check` still runs the FULL typecheck — the config, not a step name', () => {
    expect(fs.existsSync(rel(FULL_TYPECHECK_CONFIG)), `${FULL_TYPECHECK_CONFIG} is missing`).toBe(true);
    expect(
      GATE.text.includes(FULL_TYPECHECK_CONFIG),
      `no \`npm run check\` step EXECUTES ${FULL_TYPECHECK_CONFIG}. The whole-repo typecheck`
      + ' has left the gate — restore the step that runs it (currently `typecheck:ratchet`,'
      + ' scripts/check-full-typecheck.mjs). A step merely NAMED typecheck does not satisfy this.',
    ).toBe(true);
  });

  // ── the pin's own mutant: a THROWAWAY package.json with the step deleted ────
  describe('the full-typecheck step cannot leave the chain unnoticed', () => {
    /** A throwaway repo root: a mutated package.json plus the REAL scripts/ dir,
     *  so the one-hop resolver reads the live enforcers and only the chain moves. */
    function throwawayRoot(mutate) {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'enforcement-claims-'));
      const scripts = JSON.parse(JSON.stringify(pkg.scripts));
      mutate(scripts);
      fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ scripts }, null, 2));
      fs.symlinkSync(rel('scripts'), path.join(dir, 'scripts'), 'dir');
      const thrown = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
      return gateReach(thrown.scripts, dir);
    }

    const FULL_STEP = 'typecheck:ratchet';
    const dropStep = (s) => {
      s.check = s.check.split(' && ').filter((c) => c.trim() !== `npm run ${FULL_STEP}`).join(' && ');
    };

    it('CONTROL: an untouched throwaway resolves the full-typecheck config', () => {
      expect(throwawayRoot(() => {}).text.includes(FULL_TYPECHECK_CONFIG)).toBe(true);
    });

    it('MUTANT: deleting the full-typecheck step from the chain REDS the pin', () => {
      const mutant = throwawayRoot(dropStep);
      expect(mutant.subnames, 'the mutant did not actually remove the step').not.toContain(FULL_STEP);
      expect(mutant.text.includes(FULL_TYPECHECK_CONFIG)).toBe(false);
    });

    it('the OLD name-prefix pin stays GREEN under that same mutant (why this pin exists)', () => {
      // `typecheck:domain:strict` survives the deletion and satisfies the name
      // filter on its own, so the weakened form proved nothing about the full
      // typecheck. This control fails the day that stops being true — at which
      // point the name filter has become load-bearing again and can be revisited.
      const mutant = throwawayRoot(dropStep);
      expect(mutant.subnames.filter((n) => /^typecheck(:|$)/.test(n))).not.toEqual([]);
    });

    it('and it reds for the RIGHT reason: comments do not keep the config reachable', () => {
      // With `typecheck:ratchet` gone, the only remaining mention of
      // tsconfig.full.json anywhere in the chain's scripts is
      // check-domain-strict.mjs's header COMMENT. Un-narrowed, that comment alone
      // held the pin green; this asserts the raw text still contains it while the
      // executed text does not — the narrowing is what makes the mutant bite.
      const mutant = throwawayRoot(dropStep);
      const rawHops = mutant.subnames
        .map((n) => pkg.scripts[n] || '').join('\n')
        .match(GATE_SCRIPT_RE) || [];
      const rawText = [...new Set(rawHops)]
        .filter((p) => fs.existsSync(rel(p)))
        .map((p) => fs.readFileSync(rel(p), 'utf8')).join('\n');
      expect(rawText.includes(FULL_TYPECHECK_CONFIG), 'the comment mention has gone — update this control').toBe(true);
      expect(mutant.text.includes(FULL_TYPECHECK_CONFIG)).toBe(false);
    });
  });

  // ── the narrowing, proven BOTH ways ────────────────────────────────────────
  describe('one-hop resolution reads EXECUTED text, not comments', () => {
    function probeGate(body) {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'enforcement-probe-'));
      fs.mkdirSync(path.join(dir, 'scripts'));
      fs.writeFileSync(path.join(dir, 'scripts', 'probe.mjs'), body);
      return gateReach({ check: 'npm run probe', probe: 'node scripts/probe.mjs' }, dir).text;
    }
    const TARGET = 'tsconfig.__probe_only__.json';

    it('a target named ONLY in a comment does NOT resolve', () => {
      expect(probeGate(`// runs ${TARGET} eventually\nexport const x = 1;\n`)).not.toContain(TARGET);
      expect(probeGate(`/**\n * step over \`${TARGET}\`\n */\nexport const x = 1;\n`)).not.toContain(TARGET);
    });

    it('a target in an EXECUTED argument string still resolves', () => {
      expect(probeGate(`execSync('npx tsc --noEmit -p ${TARGET}');\n`)).toContain(TARGET);
      expect(probeGate(`const cfg = \`${TARGET}\`;\n`)).toContain(TARGET);
    });

    it('the stripper preserves code that only LOOKS like a comment', () => {
      // A `//` inside a regex literal or a string must not swallow its line —
      // over-stripping would drop real enforcement and fail this guard closed.
      expect(executedText('const u = "https://x/tsconfig.a.json";\n')).toContain('tsconfig.a.json');
      expect(executedText('const r = /https:\\/\\//; const p = "tsconfig.b.json";\n')).toContain('tsconfig.b.json');
      expect(executedText('const s = "/* not a comment */ tsconfig.c.json";\n')).toContain('tsconfig.c.json');
      expect(executedText('# comment tsconfig.d.json\nrun tsconfig.e.json\n', 'x.sh')).not.toContain('tsconfig.d.json');
      expect(executedText('# comment tsconfig.d.json\nrun tsconfig.e.json\n', 'x.sh')).toContain('tsconfig.e.json');
    });

    it('every live @enforced-by path target still resolves through the narrowed text', () => {
      // The narrowing must not have quietly broken the motivating case.
      expect(resolveTarget(FULL_TYPECHECK_CONFIG).ok).toBe(true);
    });
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
      // react-hooks/exhaustive-deps is intentionally warn (not error) — a claim
      // backed only by a warn-severity rule must not pass. (max-lines was promoted
      // to error in components-core, so it is no longer a valid warn example.)
      expect(resolveTarget('react-hooks/exhaustive-deps').ok).toBe(false);
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
