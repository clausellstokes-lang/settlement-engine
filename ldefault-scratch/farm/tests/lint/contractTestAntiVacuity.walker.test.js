/**
 * contractTestAntiVacuity.walker.test.js — the STANDING guard against "tests that lie"
 * (cycle-3 Wave 1 prevention; assertion-level sibling of scripts/check-e2e-not-vacuous.mjs,
 * which guards the Playwright gate against green-on-nothing at the SUITE level).
 *
 * THE CLASS. A contract/security/lint test that reads source and asserts on a slice of it
 * can go DARK without reddening: a silent extractor returns '' after a rename and the
 * `.not.toMatch` runs against emptiness; a per-iteration `if (!x) continue` skips the only
 * assertion when nothing was produced; an "every X" claim iterates a hardcoded literal that
 * silently drifts from the producer it claims to mirror. The cycle-3 review found four of
 * these (H8/M6/M7/M8); this walker keeps the fifth from shipping. It is the FACTION-KEY
 * defect one level up — a per-consumer hand-rolled derivation hidden by a silent default.
 *
 * THE SCOPE. The high-trust families where a vacuous pass is most dangerous:
 *   tests/security/**\/*.test.*  ·  tests/**\/*.contract.test.*  ·  tests/lint/*.test.js
 * (self-excluded, so this file's own adversarial snippets are never scanned as real tests).
 *
 * THE RULES (all fail-closed; every allowlist below is EMPTY at birth — H8/M6/M7/M8 were
 * fixed first, so nothing legitimate trips these today).
 *   Rule 1a — a BARE skip-guard (`if (!x) continue;` / `if (!x) return;`, no return value)
 *     whose immediately-following statement is `expect(` — the M6 shape. A value-returning
 *     guard (`return null`), a helper/hook guard, and a guard with real work before the
 *     assertion are all excluded by construction.
 *   Rule 1b — an EXTRACTOR result (a binding assigned from functionBody / sqlFunctionBody /
 *     mustExtract / bodyOf* / a *Body/*Block/*Def helper) used in a NEGATIVE matcher
 *     (`.not.toMatch/.not.toContain/.not.toBe/.not.toEqual`) with NO non-empty guard on it
 *     (`toBeTruthy` / `.not.toBe('')` / `.length`) — the M7 shape. Route extraction through
 *     tests/helpers/sourceContract.js (which THROWS on absence) and assert the body truthy.
 *   Rule 2 — an exhaustive-claim test (title says "every/exhaustive/…", and NOT a
 *     self-referential "documented/required/listed/…" curated list) that iterates a LOCAL
 *     PURE LITERAL to back the claim, IN A FILE THAT DERIVES NOTHING FROM SOURCE (no
 *     readFileSync/matchAll/PGlite/imported-union/… anywhere) — the M6/H8 shape. Files that
 *     genuinely derive from a producer union pass; the fix is to derive the set, not pin it.
 *
 * ACCEPTED GAPS (regex/skeleton walker, hand-audited 2026-07-21; a guard that names its
 * gaps is trustworthy). Rule 2 is FILE-gated on "derives something from source", so a file
 * that DOES derive elsewhere can still hardcode one exhaustive set undetected — the
 * per-test probes catch those. Rule 1b keys on extractor-NAME heuristics; a silent
 * extractor with an unconventional name is uncaught (prefer sourceContract, which throws).
 * The code skeleton blanks strings/comments/regex; a pathological division mis-parsed as a
 * regex could blank following code (division is near-absent in these test files). The ARROW
 * case of that gap is CLOSED — see the '>' note in codeSkeleton — after it was found blanking
 * the `&&` in `line => /a/.test(line) && /b/.test(line)`, the exact shape Rule 3 hunts.
 *
 * TO COMPLY (a new violation): route extraction through sourceContract; assert the extract
 * non-empty before a `.not.` matcher; drop the skip-guard and assert the item posted;
 * derive an exhaustive set from its producer. Never delete this guard to pass.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SELF = relative(ROOT, fileURLToPath(import.meta.url)).replace(/\\/g, '/');

// ── Empty allowlists (all instances fixed before this guard landed). Each future entry
// must carry a reason and a plan to remove it — never a silencer. ──────────────────────
const SKIP_GUARD_EXEMPT = Object.freeze({});        // Rule 1a
const UNGUARDED_EXTRACT_EXEMPT = Object.freeze({}); // Rule 1b  (key: `${rel}::${binding}`)
const LITERAL_UNION_EXEMPT = Object.freeze({});     // Rule 2   (key: `${rel}::${title}`)

// ── Scope enumeration ──────────────────────────────────────────────────────────────────
function inScope(rel) {
  if (rel === SELF) return false;
  if (/^tests\/security\/.*\.test\.(js|jsx|ts|tsx)$/.test(rel)) return true;
  if (/^tests\/.*\.contract\.test\.(js|jsx|ts|tsx)$/.test(rel)) return true;
  if (/^tests\/lint\/[^/]*\.test\.(js|jsx)$/.test(rel)) return true;
  return false;
}
/**
 * THE FOLD SCOPE — Rules 3 and 4 ONLY (§116.3), widened past `inScope` to the three
 * directories where the folded class demonstrably lived.
 *
 * WHY THE TWO SCOPES ARE NOT THE SAME SET. Five guards were convicted of the two shapes
 * Rules 3 and 4 fold in. Three of them — sessionGateCensus (tests/edgeFunctions),
 * ciCheckParity (tests/build) and spatialLedgerCoverage (tests/lib) — live OUTSIDE
 * `inScope`. A prevention rule that cannot see the directories where its own class has
 * actually occurred is vacuity one level up, so the fold rules are given a scope that
 * covers them. MEASURED at this commit's base: 270 files narrow, 517 fold-scope (+247),
 * and the widening adds ZERO convictions for either new rule — it buys future coverage,
 * not a debt discovery.
 *
 * ⛔ WHY RULES 1a/1b/2 WERE **NOT** WIDENED WITH THEM, AND WHY THIS IS NOT AN ALLOWLIST.
 * The three older rules were landed against a TRIAGED population: every instance inside
 * `inScope` was fixed before they went in, which is why all three allowlists above are
 * empty. The +247 fold-scope files were never triaged for them, and running them there at
 * this base reports SEVEN pre-existing hits — Rule 1a x2 (tests/lib/emailTemplates.test.js
 * :169 and :185, each a bare `if (!edgeSource) return;` directly before the only assertion,
 * both genuine), Rule 1b x1 (tests/edgeFunctions/surveyorByok.test.js::block, a renderer
 * whose name ends in "Block" — the extractor-NAME heuristic this file's own ACCEPTED GAPS
 * note already admits), and Rule 2 x4 (tests/edgeFunctions/providerErrors, tests/lib/
 * founderChairRequest, tests/lib/importScrub, tests/lib/townMapExport). Widening all five
 * rules at once would force a choice between a red gate and exemption rows this file's own
 * header calls silencers. The seven are RECORDED here by name and by rule as a scope
 * boundary with a measured census; NOTHING is exempted, because these three rules simply do
 * not scan there yet. Triaging them is its own act, and the fold does not get to smuggle it in.
 */
function inFoldScope(rel) {
  if (inScope(rel)) return true;
  if (rel === SELF) return false;
  if (/^tests\/edgeFunctions\/[^/]*\.test\.(js|jsx)$/.test(rel)) return true;
  if (/^tests\/build\/[^/]*\.test\.(js|jsx)$/.test(rel)) return true;
  if (/^tests\/lib\/[^/]*\.test\.(js|jsx)$/.test(rel)) return true;
  return false;
}
function filesMatching(pred) {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else {
        const rel = relative(ROOT, p).replace(/\\/g, '/');
        if (pred(rel)) out.push(rel);
      }
    }
  };
  walk(join(ROOT, 'tests'));
  return out.sort();
}
function scopedFiles() { return filesMatching(inScope); }
function foldScopedFiles() { return filesMatching(inFoldScope); }

// ── Code skeleton: blank comment + string/template/regex CONTENTS (preserve length/lines)
// so text inside strings/comments can never satisfy a code pattern. ─────────────────────
export function codeSkeleton(src) {
  let out = ''; let i = 0; const n = src.length; let prev = '';
  while (i < n) {
    const c = src[i]; const c2 = src[i + 1];
    if (c === '/' && c2 === '/') { while (i < n && src[i] !== '\n') { out += ' '; i++; } continue; }
    if (c === '/' && c2 === '*') {
      out += '  '; i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { out += src[i] === '\n' ? '\n' : ' '; i++; }
      if (i < n) { out += '  '; i += 2; }
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      const q = c; out += c; i++;
      while (i < n) {
        if (src[i] === '\\') { out += '  '; i += 2; continue; }
        if (q === '`' && src[i] === '$' && src[i + 1] === '{') {
          out += '  '; i += 2; let d = 1;
          while (i < n && d > 0) { if (src[i] === '{') d++; else if (src[i] === '}') d--; out += src[i] === '\n' ? '\n' : ' '; i++; }
          continue;
        }
        if (src[i] === q) { out += q; i++; break; }
        out += src[i] === '\n' ? '\n' : ' '; i++;
      }
      prev = q; continue;
    }
    // '>' is here for the ARROW: in `line => /re/.test(line)` the last non-space char before
    // the '/' is '>', so without it the opening slash was read as DIVISION and the NEXT slash
    // opened a phantom regex that blanked the real code after it — including the `&&` Rule 3
    // looks for. A '/' can never be division after '>', because '>' cannot end an expression.
    // Adding it was measured over all 517 in-scope files: zero convictions gained or lost by
    // any of the five rules, and one blind spot closed.
    if (c === '/' && (prev === '' || '(,=:[!&|?{;}>'.includes(prev))) {
      out += '/'; i++; let cls = false;
      while (i < n) {
        if (src[i] === '\\') { out += '  '; i += 2; continue; }
        if (src[i] === '[') cls = true; else if (src[i] === ']') cls = false;
        else if (src[i] === '/' && !cls) { out += '/'; i++; break; }
        out += src[i] === '\n' ? '\n' : ' '; i++;
      }
      while (i < n && /[a-z]/i.test(src[i])) { out += src[i]; i++; }
      prev = '/'; continue;
    }
    out += c; if (!/\s/.test(c)) prev = c; i++;
  }
  return out;
}

const EXHAUSTIVE_RE = /\b(every|exhaustive|exactly these|no silent default|nothing else|total over|each of|all of the|covers every)\b/i;
const SELF_REF_RE = /\b(documented|required|pinned|listed|named|enumerated|allowlist|allow-list|catalog|manifest|the four|these|known adopter|exemption|frozen|sentinel)\b/i;
const DERIV_RE = /readFileSync|readdirSync|globSync|matchAll|new PGlite|PGlite\(|\bdb\.|\.rpc\(|Object\.(keys|entries|values)\(|\.query\(|\.exec\(|mustExtract|functionBody|sqlFunctionBody|jsRegexTokens|sqlRegexAlternation/;
const EXTRACTOR_CALLEE_RE = /^(functionBody|sqlFunctionBody|mustExtract|bodyOf[A-Z]\w*|braceBody|extractFn|[A-Za-z]\w*(?:Body|Block|Def))$/;

// ── Rule 1a — bare skip immediately before expect( ─────────────────────────────────────
export function findSkipBeforeExpect(rawSrc) {
  const lines = rawSrc.split('\n');
  const isComment = (t) => t === '' || t.startsWith('//') || t.startsWith('*') || t.startsWith('/*');
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!/^if\s*\(\s*!\s*[\w.$]+\s*\)\s*(continue|return)\s*;?\s*$/.test(t)) continue;
    let k = i + 1;
    while (k < lines.length && isComment(lines[k].trim())) k++;
    if (k < lines.length && /^expect\s*\(/.test(lines[k].trim())) hits.push(i + 1);
  }
  return hits;
}

// ── Rule 1b — extractor result in a negative matcher without a non-empty guard ─────────
export function findUnguardedExtractNegations(skel) {
  const bindings = new Set();
  for (const m of skel.matchAll(/\b(?:const|let|var)\s+([\w$]+)\s*=\s*(?:await\s+)?([\w$.]+)\s*\(/g)) {
    if (EXTRACTOR_CALLEE_RE.test(m[2].split('.').pop())) bindings.add(m[1]);
  }
  const hits = [];
  for (const name of bindings) {
    const neg = new RegExp(`expect\\(\\s*${name}\\b[\\s\\S]{0,40}?\\)\\s*\\.\\s*not\\s*\\.\\s*(?:toMatch|toContain|toBe|toEqual)\\b`);
    if (!neg.test(skel)) continue;
    const guard = new RegExp(
      `expect\\(\\s*${name}\\b[\\s\\S]{0,80}?\\)\\s*\\.\\s*(?:toBeTruthy|toHaveLength)`
      + `|expect\\(\\s*${name}\\b[\\s\\S]{0,80}?\\)\\s*\\.\\s*not\\s*\\.\\s*toBe\\(\\s*(?:''|"")`
      + `|\\b${name}\\.length\\b`,
    );
    if (!guard.test(skel)) hits.push(name);
  }
  return hits;
}

// ── Rule 2 helpers — test blocks, binding classification, iterated sets ────────────────
export function testBlocks(rawSrc, skel) {
  const blocks = [];
  const re = /\b(it|test)(?:\.each\s*\(([\s\S]*?)\))?\s*\(\s*(['"`])/g;
  let m;
  while ((m = re.exec(rawSrc))) {
    const q = m[3]; let j = m.index + m[0].length; let title = '';
    while (j < rawSrc.length && rawSrc[j] !== q) { if (rawSrc[j] === '\\') { title += rawSrc[j + 1]; j += 2; continue; } title += rawSrc[j]; j++; }
    let body = ''; const bo = skel.indexOf('{', j);
    if (bo >= 0) {
      let d = 0; let e = bo;
      for (; e < skel.length; e++) { if (skel[e] === '{') d++; else if (skel[e] === '}') { d--; if (d === 0) { e++; break; } } }
      body = skel.slice(bo, e);
    }
    blocks.push({ eachArg: m[2] ? m[2].trim() : null, title, body });
  }
  return blocks;
}
function classifyBinding(name, skel) {
  if (new RegExp(`import\\b[^;]*\\b${name}\\b[^;]*from`, 'm').test(skel)) return 'IMPORTED';
  const dm = new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*`).exec(skel);
  if (!dm) return 'UNKNOWN';
  let init = skel.slice(dm.index + dm[0].length).replace(/^Object\.freeze\s*\(/, '').trim();
  if (init[0] === '[' || init[0] === '{') {
    const open = init[0]; const close = open === '[' ? ']' : '}';
    let d = 0; let e = 0;
    for (; e < init.length; e++) { if (init[e] === open) d++; else if (init[e] === close) { d--; if (d === 0) { e++; break; } } }
    return /\(/.test(init.slice(0, e)) ? 'DERIVED' : 'LITERAL';
  }
  return 'DERIVED';
}
function iteratedNames(body) {
  const names = new Set(); let inline = false;
  for (const m of body.matchAll(/\bfor\s*\(\s*(?:const|let|var)\s+[\w{}[\],\s]+\s+of\s+([\w$]+|\[)/g)) {
    if (m[1] === '[') inline = true; else names.add(m[1]);
  }
  for (const m of body.matchAll(/\b([\w$]+)\s*\.\s*(?:map|forEach|filter|flatMap|reduce|some|every)\s*\(/g)) names.add(m[1]);
  return { names, inline };
}
/** Rule 2: exhaustive-claim tests, in a NON-deriving file, that back the claim with a
 *  local pure literal. Returns [{title}]. */
export function findLiteralUnionClaims(rawSrc, skel) {
  if (DERIV_RE.test(skel)) return []; // file derives from a real source somewhere
  const hits = [];
  for (const b of testBlocks(rawSrc, skel)) {
    if (!EXHAUSTIVE_RE.test(b.title) || SELF_REF_RE.test(b.title)) continue;
    const { names, inline } = iteratedNames(b.body);
    let literal = inline;
    if (!literal && b.eachArg) {
      if (/^\[/.test(b.eachArg)) literal = !/\(/.test(b.eachArg);
      else if (/^[\w$]+$/.test(b.eachArg)) names.add(b.eachArg);
    }
    if (!literal) for (const nm of names) if (classifyBinding(nm, skel) === 'LITERAL') { literal = true; break; }
    if (literal) hits.push({ title: b.title });
  }
  return hits;
}

// ── Rules 3 and 4 — the §116.3 class fold ───────────────────────────────────────────────
// Both fold a shape that let a guard assert something TRUE while the property it existed to
// protect was already broken. Both are detected on the SKELETON (so a shape quoted inside a
// string or comment can never be convicted) and REPORTED from the raw source at the same
// offsets, which the skeleton's length-preserving blanking keeps aligned.

/** `A.test(v) && B.test(v)` — two distinct probes conjoined over ONE subject. */
const CONJUNCTION_RE = /(\/[^/\n]*\/[a-z]*|[A-Za-z_$][\w$.]*)\s*\.\s*test\s*\(\s*([\w$]+)\s*\)\s*&&\s*(\/[^/\n]*\/[a-z]*|[A-Za-z_$][\w$.]*)\s*\.\s*test\s*\(\s*([\w$]+)\s*\)/gd;
/** the file chops its source into physical lines somewhere */
const LINE_SPLIT_RE = /\.split\s*\(\s*(['"`])\\n\1\s*\)/;
/** a bare "this symbol is called somewhere" probe: /foo\s*\(/ */
const CALL_PRESENCE_RE = /^\/[A-Za-z_$][\w$]*\\s\*\\\(\/[a-z]*$/;
/** a probe that looks like it is testing for an import/module path rather than a call */
const PATH_PROBE_RE = /\\\/|\.ts|\.js|_shared|\bfrom\b/;

function lineOf(text, index) { return text.slice(0, index).split('\n').length; }

/** Names bound as a per-element iteration variable anywhere in the file. */
export function iterationVars(skel) {
  const names = new Set();
  for (const m of skel.matchAll(/\.\s*(?:forEach|map|some|every|filter|flatMap)\s*\(\s*\(?\s*([\w$]+)/g)) names.add(m[1]);
  for (const m of skel.matchAll(/\bfor\s*\(\s*(?:const|let|var)\s+([\w$]+)\s+of\b/g)) names.add(m[1]);
  return names;
}

/** Every `A.test(v) && B.test(v)` in the file, with A and B recovered from the RAW source. */
export function conjunctionProbes(raw, skel) {
  const out = [];
  for (const m of skel.matchAll(CONJUNCTION_RE)) {
    if (m[2] !== m[4]) continue; // different subjects: not one property being over-constrained
    const left = raw.slice(m.indices[1][0], m.indices[1][1]);
    const right = raw.slice(m.indices[3][0], m.indices[3][1]);
    out.push({ left, right, subject: m[2], line: lineOf(skel, m.index) });
  }
  return out;
}

/**
 * Rule 3 — SAME-LINE CONJUNCTION. Two DISTINCT source-derived probes required to match the
 * same PHYSICAL LINE. Prettier splits any call whose arguments do not fit on one line, which
 * is exactly the shape a long secret travels in, so the sink lands on one line and the value
 * on the next and the conjunction goes silently blind. THE CURE: widen the window to the
 * statement (tests/helpers/sourceContract.js `sinkStatementOffenders`), never widen the regex.
 */
export function findSameLineConjunctions(raw, skel) {
  if (!LINE_SPLIT_RE.test(raw)) return []; // nothing here is per-physical-line
  const iter = iterationVars(skel);
  return conjunctionProbes(raw, skel)
    .filter((c) => iter.has(c.subject) && c.left !== c.right)
    .map((c) => ({ line: c.line, text: `${c.left} && ${c.right} over \`${c.subject}\`` }));
}

/**
 * Rule 4 — UNCONSUMED GATE CALL. A guard that proves a symbol is IMPORTED and that its name
 * APPEARS followed by `(`, and stops there. Presence is not enforcement: `if (false &&
 * await isSessionSuperseded(...))` satisfies both probes while the gate is disarmed. THE
 * CURE: assert the SHAPE that binds the call to its consequence — the call is the condition
 * of a branch that returns or throws — and enumerate the accepted shapes in-file.
 */
export function findUnconsumedGateCalls(raw, skel) {
  const iter = iterationVars(skel);
  return conjunctionProbes(raw, skel)
    .filter((c) => {
      if (iter.has(c.subject)) return false; // a per-line subject is Rule 3's business
      return (CALL_PRESENCE_RE.test(c.right) && PATH_PROBE_RE.test(c.left))
        || (CALL_PRESENCE_RE.test(c.left) && PATH_PROBE_RE.test(c.right));
    })
    .map((c) => ({ line: c.line, text: `${c.left} && ${c.right} over \`${c.subject}\`` }));
}

// ── The scan ────────────────────────────────────────────────────────────────────────────
describe('contract-test anti-vacuity walker', () => {
  const files = scopedFiles();

  it('scans a non-empty scope (the walker itself is not vacuous)', () => {
    // If the glob ever discovers nothing, this guard would silently pass on zero files.
    expect(files.length, 'scoped contract/security/lint test files').toBeGreaterThanOrEqual(100);
  });

  it('Rule 1a — no bare skip-guard sits immediately before its only assertion', () => {
    const violations = [];
    for (const rel of files) {
      const raw = readFileSync(join(ROOT, rel), 'utf8');
      for (const line of findSkipBeforeExpect(raw)) {
        const key = `${rel}:${line}`;
        if (!(key in SKIP_GUARD_EXEMPT)) violations.push(`${key} — if(!x)continue/return directly before expect()`);
      }
    }
    expect(violations, `skip-then-assert vacuity:\n${violations.join('\n')}`).toEqual([]);
  });

  it('Rule 1b — no extractor result is negated without a non-empty guard', () => {
    const violations = [];
    for (const rel of files) {
      const skel = codeSkeleton(readFileSync(join(ROOT, rel), 'utf8'));
      for (const name of findUnguardedExtractNegations(skel)) {
        const key = `${rel}::${name}`;
        if (!(key in UNGUARDED_EXTRACT_EXEMPT)) violations.push(`${key} — extract result used in .not.* with no toBeTruthy/length guard`);
      }
    }
    expect(violations, `unguarded-extract vacuity:\n${violations.join('\n')}`).toEqual([]);
  });

  it('Rule 2 — no exhaustive claim is backed by a local literal in a non-deriving file', () => {
    const violations = [];
    for (const rel of files) {
      const raw = readFileSync(join(ROOT, rel), 'utf8');
      const skel = codeSkeleton(raw);
      for (const { title } of findLiteralUnionClaims(raw, skel)) {
        const key = `${rel}::${title}`;
        if (!(key in LITERAL_UNION_EXEMPT)) violations.push(`${key} — "every…" claim over a hardcoded literal; derive it from its producer`);
      }
    }
    expect(violations, `literal-union vacuity:\n${violations.join('\n')}`).toEqual([]);
  });

  // ── The §116.3 fold. These two run over inFoldScope, not inScope — see the note there. ──
  const foldFiles = foldScopedFiles();

  it('the fold scope is strictly wider than the base scope (the widening is real)', () => {
    // Without this, a regression that quietly collapsed inFoldScope back onto inScope would
    // leave Rules 3 and 4 passing over a corpus that no longer contains the three directories
    // they were widened to cover, and nothing would say so.
    expect(foldFiles.length).toBeGreaterThan(files.length);
    for (const dir of ['tests/edgeFunctions/', 'tests/build/', 'tests/lib/']) {
      expect(foldFiles.some((rel) => rel.startsWith(dir)), `fold scope covers ${dir}`).toBe(true);
    }
  });

  it('Rule 3 — no guard requires two distinct probes to match the same physical line', () => {
    const violations = [];
    for (const rel of foldFiles) {
      const raw = readFileSync(join(ROOT, rel), 'utf8');
      for (const hit of findSameLineConjunctions(raw, codeSkeleton(raw))) {
        violations.push(`${rel}:${hit.line} — ${hit.text}; widen the window to the statement (sourceContract.sinkStatementOffenders), never the regex`);
      }
    }
    expect(violations, `same-line-conjunction vacuity:\n${violations.join('\n')}`).toEqual([]);
  });

  it('Rule 4 — no guard proves a gate is called without proving its result is consumed', () => {
    const violations = [];
    for (const rel of foldFiles) {
      const raw = readFileSync(join(ROOT, rel), 'utf8');
      for (const hit of findUnconsumedGateCalls(raw, codeSkeleton(raw))) {
        violations.push(`${rel}:${hit.line} — ${hit.text}; assert the SHAPE that binds the call to its consequence`);
      }
    }
    expect(violations, `unconsumed-gate-call vacuity:\n${violations.join('\n')}`).toEqual([]);
  });
});

// ── Adversarial self-tests: prove each rule FIRES on a planted vacuous shape, and does NOT
// fire on the corresponding fixed shape (negative control). ─────────────────────────────
describe('contract-test anti-vacuity walker — adversarial self-tests (not vacuous)', () => {
  it('Rule 1a fires on a skip-before-expect and clears the fixed form', () => {
    const vacuous = [
      "test('every command emits', () => {",
      '  for (const c of cmds) {',
      '    const msg = sent[0];',
      '    if (!msg) continue;',
      '    expect(msg.type).toBe(c.type);',
      '  }',
      '});',
    ].join('\n');
    const fixed = vacuous.replace('if (!msg) continue;', 'expect(msg).toBeTruthy();');
    expect(findSkipBeforeExpect(vacuous).length).toBeGreaterThan(0);
    expect(findSkipBeforeExpect(fixed)).toEqual([]);
  });

  it('Rule 1b fires on an unguarded extract negation and clears the guarded form', () => {
    const vacuous = codeSkeleton([
      "const detail = functionBody(js, 'fetchPublicDossier');",
      "expect(detail).not.toMatch(/from settlements/);", // anchored: detector fixture, not an assertion
    ].join('\n'));
    const fixed = codeSkeleton([
      "const detail = functionBody(js, 'fetchPublicDossier');",
      "expect(detail).toBeTruthy();",
      "expect(detail).not.toMatch(/from settlements/);", // anchored: detector fixture, not an assertion
    ].join('\n'));
    expect(findUnguardedExtractNegations(vacuous)).toContain('detail');
    expect(findUnguardedExtractNegations(fixed)).toEqual([]);
  });

  it('Rule 2 fires on a literal-backed exhaustive claim in a non-deriving file, clears the derived form', () => {
    const vacuous = [
      "import { createThing } from '../../src/lib/thing.js';",
      "const CANON = [{ m: 'a' }, { m: 'b' }];",
      "test('every canonical command works', () => {",
      '  for (const c of CANON) { expect(bridge[c.m]).toBeDefined(); }',
      '});',
    ].join('\n');
    const derived = [
      "import { readFileSync } from 'node:fs';",
      "const CANON = [...readFileSync('x').matchAll(/y/g)];",
      "test('every canonical command works', () => {",
      '  for (const c of CANON) { expect(bridge[c.m]).toBeDefined(); }',
      '});',
    ].join('\n');
    expect(findLiteralUnionClaims(vacuous, codeSkeleton(vacuous)).length).toBeGreaterThan(0);
    expect(findLiteralUnionClaims(derived, codeSkeleton(derived))).toEqual([]);
  });

  it('Rule 3 fires on a same-line conjunction and clears the statement-window form', () => {
    const vacuous = [
      "const offenders = SRC.split('\\n')",
      '  .map(line => line.trim())',
      '  .filter(line => /console\\.\\w+\\(/.test(line) && /\\btoken\\b/.test(line));',
      'expect(offenders).toEqual([]);',
    ].join('\n');
    const fixed = [
      "const lines = SRC.split('\\n');",
      "const offenders = sinkStatementOffenders(SRC, /console\\.\\w+\\(/, /\\btoken\\b/, 'src');",
      'expect(offenders).toEqual([]);',
    ].join('\n');
    expect(findSameLineConjunctions(vacuous, codeSkeleton(vacuous))).toHaveLength(1);
    expect(findSameLineConjunctions(fixed, codeSkeleton(fixed))).toEqual([]);
  });

  it('Rule 3 does not fire on a whole-source conjunction (that subject is not per-line)', () => {
    // The discriminating negative: the rule is about the WINDOW, not about conjunction. A
    // file with no per-line split has no same-line blindness to report.
    const wholeSource = [
      'const src = read("x.ts");',
      'expect(/a/.test(src) && /b/.test(src)).toBe(true);',
    ].join('\n');
    expect(findSameLineConjunctions(wholeSource, codeSkeleton(wholeSource))).toEqual([]);
  });

  it('Rule 4 fires on an import-plus-call presence probe and clears the shape assertion', () => {
    const vacuous = [
      'const importsGate = (src) =>',
      '  /_shared\\/sessionGate\\.ts/.test(src) && /isSessionSuperseded\\s*\\(/.test(src);',
    ].join('\n');
    const fixed = [
      'const importsGate = (src) =>',
      '  GATE_SHAPES.some((shape) => shape.test(src));',
    ].join('\n');
    expect(findUnconsumedGateCalls(vacuous, codeSkeleton(vacuous))).toHaveLength(1);
    expect(findUnconsumedGateCalls(fixed, codeSkeleton(fixed))).toEqual([]);
  });

  it('neither new rule can be forged from a shape quoted inside a string or a comment', () => {
    // Both rules run on the skeleton, so prose that merely DESCRIBES the defect — including
    // this file's own header — must never be convicted as an instance of it.
    const quoted = [
      "const doc = \"/a/.test(line) && /b/.test(line)\";",
      "// /_shared\\/sessionGate\\.ts/.test(src) && /isSessionSuperseded\\s*\\(/.test(src)",
      "const rows = SRC.split('\\n').map(line => line.trim());",
    ].join('\n');
    expect(findSameLineConjunctions(quoted, codeSkeleton(quoted))).toEqual([]);
    expect(findUnconsumedGateCalls(quoted, codeSkeleton(quoted))).toEqual([]);
  });

  it('the code skeleton blanks strings/comments so they cannot forge a match', () => {
    // A skip-guard buried in a STRING literal must not be seen as code.
    const src = "expect(re.test(\"if (!ts) return ', ';\")).toBe(true);";
    expect(findSkipBeforeExpect(src)).toEqual([]);
    // LIVENESS ANCHOR: the skeleton keeps the CODE it was handed (so it is not simply
    // returning an empty string, which would satisfy the exclusion below for free).
    expect(codeSkeleton(src)).toContain('expect(');
    // anchored: the surviving `expect(` above proves the skeleton is non-empty
    expect(codeSkeleton(src)).not.toContain('return');
  });
});
