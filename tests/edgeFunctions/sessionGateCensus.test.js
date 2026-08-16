/**
 * sessionGateCensus.test.js — THE SINGLE-SESSION CENSUS (161/§7.2, M-9b).
 *
 * A structural-prevention manifest. REQUEST-LAYER COVERAGE IS NOW TOTAL (the M-9 census
 * upgrade): EVERY paid edge surface must carry the request-layer gate — it imports
 * _shared/sessionGate.ts and calls isSessionSuperseded after resolving the caller, so a
 * superseded device is evicted with an instant 401 BEFORE any spend or generation. The
 * credit-spending AI surfaces ALSO run the DB BELT (spend_credits → assert_current_session,
 * 161/M-9c) as defense-in-depth — a superseded JWT can neither reach the generation nor
 * move a credit.
 *
 * This test is the wall against an N-1 sweep: adding a new paid function without the
 * request-layer gate fails here loudly, rather than shipping a silent ungated surface.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

const FN_DIR = resolve(process.cwd(), 'supabase', 'functions');
const read = (name) => {
  const p = join(FN_DIR, name, 'index.ts');
  return existsSync(p) ? readFileSync(p, 'utf8') : '';
};

// The §7.2 paid-surface roster. Each must be gated by request-layer OR belt.
// interview (V-1 THE INTERVIEW) joins as the 9th credit-spending AI surface — a
// citation-grounded read answer metered under the 'analysis' feature.
const REQUIRED = [
  'ai-analyst', 'interview', 'generate-narrative', 'generate-chronicle', 'custom-content',
  'style-overhaul', 'interpret-session', 'parley', 'surveyor-autonomy',
  // construct-realm + construct-settlement (S6/S5 AI construction) — credit-spending AI
  // surfaces that were LIVE without the request-layer gate (C4 hardening): they spend
  // through spend_credits + meter ai_usage_events, so they join the TOTAL roster.
  'construct-realm', 'construct-settlement',
  'surveyor-byok', 'create-checkout', 'create-customer-portal', 'account-actions',
  'founder-transfer',
];

// DELIBERATELY DEFERRED (documented, not a gap to re-find): verify-checkout-session
// is a READ-ONLY post-checkout confirmation — it moves no money and grants no
// entitlement (it only confirms a Stripe session belongs to the caller; the actual
// entitlement is polled separately through gated surfaces). Its request-layer wiring
// is a low-value follow-up, tracked here so it is visible rather than silently missed.
const DEFERRED = ['verify-checkout-session'];

// ── THE GATE IS BOUND TO ITS CONSEQUENCE, NEVER MERELY PRESENT ─────────────────────
// ⛔ THE DEFECT THIS REPLACES. The census used to ask two presence questions —
// "does the file import _shared/sessionGate.ts" AND "does the token
// `isSessionSuperseded(` appear anywhere" — and call that coverage. Presence is not
// enforcement: `if (false && await isSessionSuperseded(...))` satisfies BOTH halves
// and evicts nobody, and the five money surfaces at the roster's tail have NO belt
// behind them, so this scan is their only enforcement. A guard that can be satisfied
// by a call whose result is discarded is asserting that someone typed a name.
//
// THE CURE. The call must sit in the CONDITION of an `if` whose consequent answers
// 401, and the condition must be live. Shapes are enumerated here by name; a shape
// that is not in this list is a RED, never a new allowlist row.
//
//   SHAPE 1 — braced:    if (await isSessionSuperseded(...)) { return json(..., 401, cors); }
//   SHAPE 2 — unbraced:  if (await isSessionSuperseded(...)) return json(..., 401, cors);
//   SHAPE 3 — guarded:   if (!x && await isSessionSuperseded(...)) { …audit…; return …401…; }
//   SHAPE 4 — raw Response: the consequent builds `new Response(..., { status: 401, … })`
//
// All four are LIVE in the tree today and every one of them is admitted by the same
// rule rather than by four special cases: the consequent — block or single statement
// — must carry the 401, and no conjunct of the condition may be a falsy literal.

/** Offsets of every `isSessionSuperseded(` CALL (the import mention is not a call). */
const gateCallOffsets = (src) => [...src.matchAll(/isSessionSuperseded\s*\(/g)].map((m) => m.index);

/** Balanced-scan from an opening bracket to its partner; -1 when unbalanced. */
function matchBracket(src, open, openCh, closeCh) {
  let depth = 0;
  for (let i = open; i < src.length; i += 1) {
    if (src[i] === openCh) depth += 1;
    else if (src[i] === closeCh) { depth -= 1; if (depth === 0) return i; }
  }
  return -1;
}

/** Split a condition on top-level `&&`, so a falsy conjunct can be seen. */
function conjuncts(condition) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < condition.length; i += 1) {
    const ch = condition[i];
    if (ch === '(' || ch === '[' || ch === '{') depth += 1;
    else if (ch === ')' || ch === ']' || ch === '}') depth -= 1;
    else if (depth === 0 && ch === '&' && condition[i + 1] === '&') {
      parts.push(condition.slice(start, i)); start = i + 2; i += 1;
    }
  }
  parts.push(condition.slice(start));
  return parts.map((p) => p.trim());
}

const DEAD_LITERAL = /^(?:false|0|null|undefined|''|""|``)$/;

/**
 * Why this source does or does not ENFORCE the single-session gate. Returns the
 * problems by name — an empty array is enforcement, and every non-empty result says
 * which of the four shapes the file failed to present.
 */
function gateEnforcementProblems(src) {
  if (!/_shared\/sessionGate\.ts/.test(src)) return ['does not import _shared/sessionGate.ts'];
  const calls = gateCallOffsets(src);
  if (calls.length === 0) return ['imports the gate but never CALLS isSessionSuperseded'];
  const problems = [];
  for (const at of calls) {
    const before = src.slice(0, at);
    // the nearest `if (` whose condition still encloses this call
    let ifAt = -1;
    for (const m of before.matchAll(/\bif\s*\(/g)) ifAt = m.index;
    if (ifAt === -1) { problems.push('a gate call sits outside any `if` condition'); continue; }
    const openParen = src.indexOf('(', ifAt);
    const closeParen = matchBracket(src, openParen, '(', ')');
    if (closeParen === -1 || closeParen < at) {
      problems.push('a gate call is evaluated outside the `if` condition that precedes it');
      continue;
    }
    const dead = conjuncts(src.slice(openParen + 1, closeParen)).filter((c) => DEAD_LITERAL.test(c));
    if (dead.length > 0) {
      problems.push(`the gate condition carries a dead literal conjunct (${dead.join(', ')}) — it can never evict`);
      continue;
    }
    let cursor = closeParen + 1;
    while (cursor < src.length && /\s/.test(src[cursor])) cursor += 1;
    let consequent;
    if (src[cursor] === '{') {
      const end = matchBracket(src, cursor, '{', '}');
      consequent = end === -1 ? '' : src.slice(cursor, end + 1);
    } else {
      const semi = src.indexOf(';', cursor);
      consequent = src.slice(cursor, semi === -1 ? src.length : semi + 1);
    }
    if (!/\b401\b/.test(consequent)) {
      problems.push('a gate call is made but its consequent never answers 401 — the result is unconsumed');
      continue;
    }
    return []; // one lawful, live, 401-answering shape is enforcement
  }
  return problems;
}

const importsGate = (src) => gateEnforcementProblems(src).length === 0;
const usesSpendBelt = (src) => /rpc\(\s*['"]spend_credits['"]/.test(src);

// The 11 credit-spending AI surfaces — they carry BOTH the request-layer gate AND the
// spend_credits belt (defense-in-depth) after the M-9 census upgrade. interview (V-1)
// joined as the 9th; construct-realm + construct-settlement are the 10th/11th (C4
// hardening — they were live spending credits without the request-layer gate).
const AI_SPENDING = [
  'ai-analyst', 'interview', 'generate-narrative', 'generate-chronicle', 'custom-content',
  'style-overhaul', 'interpret-session', 'parley', 'surveyor-autonomy',
  'construct-realm', 'construct-settlement',
];

describe('single-session census — request-layer coverage is TOTAL (every paid surface)', () => {
  it.each(REQUIRED)('%s carries the REQUEST-LAYER single-session gate (instant eviction)', (name) => {
    const src = read(name);
    expect(src.length, `${name}/index.ts is present`).toBeGreaterThan(0);
    expect(
      importsGate(src),
      `${name} must import _shared/sessionGate.ts and call isSessionSuperseded — request-layer `
      + `coverage is TOTAL across the paid roster (instant 401 eviction; the belt is defense-in-depth)`,
    ).toBe(true);
  });

  it('the credit-spending AI surfaces ALSO run the spend_credits belt (defense-in-depth)', () => {
    // Both layers: the request-layer gate (above) AND assert_current_session inside
    // spend_credits — a superseded JWT can neither reach the generation nor move a credit.
    for (const name of AI_SPENDING) {
      const src = read(name);
      expect(importsGate(src), `${name} needs the request-layer gate`).toBe(true);
      expect(usesSpendBelt(src), `${name} also spends through spend_credits (the DB belt)`).toBe(true);
    }
  });

  it('the money surfaces that do NOT spend credits are gated at the request layer', () => {
    // These move money / manage billing without a spend_credits call, so the request-layer
    // gate is their only enforcement.
    for (const name of ['surveyor-byok', 'create-checkout', 'create-customer-portal', 'account-actions', 'founder-transfer']) {
      expect(importsGate(read(name)), `${name} needs the request-layer gate (no spend_credits belt)`).toBe(true);
    }
  });

  it('the deferred set is explicitly recorded (documented, not a silent gap)', () => {
    expect(DEFERRED).toContain('verify-checkout-session');
  });

  // ── ANTI-VACUITY CONTROLS (§75 idiom) ────────────────────────────────────────────
  // ⛔ The census above asserts a universally quantified POSITIVE over a roster, which
  // is green both when every surface enforces and when the predicate has stopped
  // discriminating. These arms fix the predicate's meaning to fixtures whose verdicts
  // are known, so "all sixteen pass" says something.
  it('MUTANT CONTROL — the neutered `false &&` form is REFUSED, not counted as coverage', () => {
    // The exact shape a probe planted to prove the old presence-scan was vacuous: it
    // imports the gate, calls it, and evicts nobody. The old conjunction passed it.
    const neutered = [
      "import { isSessionSuperseded } from '../_shared/sessionGate.ts';",
      'if (false && await isSessionSuperseded(admin, user.id, authHeader, label)) {',
      "  return json({ error: 'session_superseded' }, 401, cors);",
      '}',
    ].join('\n');
    const problems = gateEnforcementProblems(neutered);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/dead literal conjunct/);
    expect(importsGate(neutered)).toBe(false);
  });

  it('MUTANT CONTROL — a call whose RESULT IS NEVER CONSUMED is refused', () => {
    const unconsumed = [
      "import { isSessionSuperseded } from '../_shared/sessionGate.ts';",
      'const superseded = await isSessionSuperseded(admin, user.id, authHeader, label);',
      'return json({ ok: true }, 200, cors);',
    ].join('\n');
    expect(gateEnforcementProblems(unconsumed)).toEqual(
      expect.arrayContaining([expect.stringMatching(/outside any `if` condition/)]),
    );
  });

  it('MUTANT CONTROL — a gate whose consequent does not answer 401 is refused', () => {
    const wrongAnswer = [
      "import { isSessionSuperseded } from '../_shared/sessionGate.ts';",
      'if (await isSessionSuperseded(admin, user.id, authHeader, label)) {',
      "  return json({ error: 'session_superseded' }, 200, cors);",
      '}',
    ].join('\n');
    expect(gateEnforcementProblems(wrongAnswer)).toEqual(
      expect.arrayContaining([expect.stringMatching(/never answers 401/)]),
    );
  });

  it('POSITIVE CONTROLS — all four shapes the tree actually uses are ADMITTED', () => {
    // The rule is not "reject everything". Each of these is live in the roster above,
    // and each is named in the shape list at the top of this file.
    const IMPORT = "import { isSessionSuperseded } from '../_shared/sessionGate.ts';";
    const braced = `${IMPORT}\nif (await isSessionSuperseded(a, b, c, d)) {\n  return json({ error: 'session_superseded' }, 401, cors);\n}`;
    const unbraced = `${IMPORT}\nif (await isSessionSuperseded(a, b, c, d)) return json({ error: 'session_superseded' }, 401, cors);`;
    const guarded = `${IMPORT}\nif (!wantsTokenAbort && await isSessionSuperseded(a, b, c, d)) {\n  if (caseId) { await admin.rpc('_log', {}); }\n  return json({ error: 'session_superseded' }, 401);\n}`;
    const rawResponse = `${IMPORT}\nif (await isSessionSuperseded(a, b, c, d)) {\n  return new Response(JSON.stringify({ error: 'session_superseded' }), { status: 401, headers: {} });\n}`;
    expect(gateEnforcementProblems(braced)).toEqual([]);
    expect(gateEnforcementProblems(unbraced)).toEqual([]);
    expect(gateEnforcementProblems(guarded)).toEqual([]);
    expect(gateEnforcementProblems(rawResponse)).toEqual([]);
  });

  // Tier 0.5 trust-boundary extension (§6.3/LAW 2): founder-transfer is a NEW
  // Stripe-session-creating entry point. Its session must bind to server-validated
  // state — the case id + the JWT user id — never a client assertion.
  it('founder-transfer binds its checkout session to the validated case + verified user id', () => {
    const src = read('founder-transfer');
    expect(src.length).toBeGreaterThan(0);
    // The session metadata carries the server-controlled purpose + the validated case.
    expect(/purpose:\s*'founder_seat_transfer'/.test(src)).toBe(true);
    expect(/transfer_case_id:\s*caseId/.test(src)).toBe(true);
    // supabase_user_id comes from the verified user (user.id), NOT the request body.
    expect(/supabase_user_id:\s*user\.id/.test(src)).toBe(true);
    // The master switch gates every action before any work.
    expect(/founder_transfer_enabled/.test(src)).toBe(true);
  });
});
