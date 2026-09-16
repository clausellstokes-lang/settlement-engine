/**
 * aiSurfaceCensus.js — THE SHARED AI-SURFACE CENSUS (Enforcer E-D, both halves).
 *
 * E-D is ONE law enforced at TWO walls, and both walls need the SAME denominator —
 * which AI surfaces exist:
 *   - part 1, tests/security/aiSurfaceSourceScan.test.js — every AI surface declares HOW
 *     its model output is kept off typed engine state (the finite-semantics wall);
 *   - part 2, tests/domain/aiFallbackTotality.test.js — every AI surface degrades to a
 *     coherent deterministic fallback with AI off (AI is dressing, never load-bearing).
 *
 * WHY THIS MODULE EXISTS (the drift it makes structurally impossible): until 2026-07-26
 * each file carried its OWN verbatim copy of MODEL_CALL + tsFilesUnder, and the copies
 * drifted. Part 1 grew a client-transport pass and discovered 'table-clerk' — a live AI
 * transport whose edge directory has never existed in this tree — while part 2 kept
 * walking only supabase/functions/*, so its census could never require a fallback driver
 * for a surface it could not see. One surface, walled at one wall and invisible at the
 * other. Copy-paste discovery is how a census silently becomes an N-1 census; there is now
 * one census, imported twice.
 *
 * THE CENSUS IS TWO-SIDED, because an AI surface has two halves and either can exist
 * without the other:
 *   - the EDGE side (AI_SURFACES) — every supabase/functions/<fn> whose code calls the
 *     model, found by walking each function's whole .ts tree;
 *   - the CLIENT side (CLIENT_TRANSPORTS) — every edge slug the browser actually invokes,
 *     discovered from src/ INDEPENDENTLY of whether supabase/functions/<slug> is present.
 *     That independence IS the point: a directory walk is blind to a transport whose edge
 *     half was deployed out-of-band or is an owner-gated fold.
 *
 * AI_SURFACE_ROSTER is the union of the two sides, minus the slugs explicitly declared to
 * carry no model output (NON_AI_CLIENT_TRANSPORTS). It is the set of surfaces every E-D
 * wall must account for. The allowlist's own honesty — no stale row, no model-calling
 * surface smuggled through it — is enforced by part 1.
 *
 * Not a `*.test.js` file, so vitest never collects it as a suite — the
 * tests/security/creditLedgerHarness.js + netExecuteGrants.js idiom.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, join, relative, sep } from 'node:path';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const FN_DIR = join(ROOT, 'supabase', 'functions');

// ── The EDGE side: every function whose code calls the model ─────────────────
// Walk each function's whole .ts tree (a call may live in a *Core.ts, not index.ts —
// parley's does). The token set names the provider seam without over-fitting one call
// shape; the guard-the-guard floors below fail if it ever collapses to a vacuous set.
export const MODEL_CALL = /anthropic|runCreditedCall|callAnthropic|messages\.create|createMessage|ANTHROPIC_CLAUDE|resolveModel|providerKey/i;

/** Every non-test .ts file under `dir`, recursively. */
export function tsFilesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return tsFilesUnder(p);
    return /\.ts$/.test(name) && !/\.test\.ts$/.test(name) ? [p] : [];
  });
}

/** Does supabase/functions/<fnName> call the model anywhere in its tree? */
export function callsModel(fnName) {
  const dir = join(FN_DIR, fnName);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
  return tsFilesUnder(dir).some((f) => MODEL_CALL.test(readFileSync(f, 'utf8')));
}

/** Every edge directory present in the tree (model-calling or not) — the deploy denominator. */
export const EDGE_DIRS = new Set(
  readdirSync(FN_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== '_shared')
    .map((d) => d.name),
);

/** The discovered model-calling edge roster, sorted. */
export const AI_SURFACES = [...EDGE_DIRS].filter(callsModel).sort();

// ── The CLIENT side: every edge slug the BROWSER invokes ─────────────────────
//   PASS A (direct) — the slug is a literal at the call site: `invoke('slug')`, or a
//     `functions/v1/<slug>` URL for the streaming surfaces. Precise, so single-word
//     slugs ('interview') are included.
//   PASS B (indirect) — a file that calls `functions.invoke(<variable>)` demonstrably
//     routes slugs through a helper, a const, or a ternary; lib/surveyorWrite.js posts
//     six AI surfaces that way. In THOSE FILES ONLY, every kebab-shaped string literal
//     is taken as a candidate slug, plus any single-word literal naming a real edge
//     directory. Restricting Pass B to indirect routers is what keeps it noise-free.
//
// ACCEPTED GAPS of a regex gate (hand-audited 2026-07-26 — all 23 slugs discovered today
// are real edge targets; zero false positives):
//   - a slug ASSEMBLED from fragments (`'construct-' + scope`) is invisible to both
//     passes. Write the slug as a whole literal, or add the surface to a manifest by hand.
//   - inside an indirect-router file, a single-word slug that has no edge directory is
//     missed — the kebab shape is what keeps Pass B from harvesting ordinary prose.
// Both gaps fail SAFE toward review, never toward a silently-unwalled surface: the
// manifests in both enforcers are exact-set checked, so a hand-added entry cannot go
// stale either.
export const SLUG = '[a-z][a-z0-9]*(?:-[a-z0-9]+)*';
export const DIRECT_INVOKE = new RegExp(`(?:functions\\s*\\.\\s*invoke\\s*\\(\\s*['"\`]|functions/v1/)(${SLUG})`, 'g');
export const INDIRECT_INVOKE = /functions\s*\.\s*invoke\s*\(\s*[A-Za-z_$]/;
export const KEBAB_LITERAL = /['"`]([a-z][a-z0-9]*(?:-[a-z0-9]+)+)['"`]/g;
export const WORD_LITERAL = /['"`]([a-z][a-z0-9]*)['"`]/g;

/** Every client source file under `dir`, recursively. */
export function clientFilesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return clientFilesUnder(p);
    return /\.(js|jsx|ts|tsx)$/.test(name) ? [p] : [];
  });
}

/** slug → the set of client files that invoke it (forward-slashed, so CI agrees on any OS). */
export function discoverClientTransports() {
  const found = new Map();
  const add = (slug, rel) => {
    if (!found.has(slug)) found.set(slug, new Set());
    found.get(slug).add(rel);
  };
  const SRC = join(ROOT, 'src');
  if (!existsSync(SRC)) return found;
  for (const abs of clientFilesUnder(SRC)) {
    const src = readFileSync(abs, 'utf8');
    const rel = relative(ROOT, abs).split(sep).join('/');
    for (const m of src.matchAll(DIRECT_INVOKE)) add(m[1], rel);
    if (INDIRECT_INVOKE.test(src)) {
      for (const m of src.matchAll(KEBAB_LITERAL)) add(m[1], rel);
      for (const m of src.matchAll(WORD_LITERAL)) if (EDGE_DIRS.has(m[1])) add(m[1], rel);
    }
  }
  return found;
}

export const CLIENT_TRANSPORTS = discoverClientTransports();

/** The client files that invoke `slug`, as a readable list for a failure message. */
export function invokersOf(slug) {
  return [...(CLIENT_TRANSPORTS.get(slug) ?? [])].join(', ');
}

// ── The non-AI client transports (the explicit allowlist, each with its reason) ───
// Every client-invoked edge that is NOT an AI surface is named here, so that "this slug
// carries no model output" is a RECORDED claim rather than an absence. A new transport is
// undeclared until someone writes the line — and part 1's reverse check deletes the line
// when the transport goes away, so the allowlist cannot rot into blanket permission.
// A slug may never appear here AND in part 1's AI_SURFACE_WALLS; part 1's honesty test
// enforces that, and part 1's smuggling test forbids a model-calling edge hiding here.
export const NON_AI_CLIENT_TRANSPORTS = Object.freeze({
  'account-actions':         'the account/support desk RPC bus — tickets, preferences, retro-claims. No model call.',
  'admin-actions':           'the operator console RPC bus — rollups, moderation and health rows. No model call.',
  'auth-recovery':           'security-question account recovery. No model call.',
  'create-checkout':         'Stripe checkout session creation. No model call.',
  'create-customer-portal':  'Stripe billing portal link minting. No model call.',
  'founder-transfer':        'the founder-seat transfer/buyback state machine. No model call.',
  'ingest-events':           'the analytics event sink. No model call.',
  'og-image':                'the social share-card renderer. No model call.',
  'send-email':              'transactional lifecycle email dispatch. No model call.',
  'verify-checkout-session': 'post-checkout entitlement verification. No model call.',
  'verify-single-dossier':   'single-dossier purchase verification. No model call.',
});

/** Client-invoked slugs that are NOT declared non-AI — i.e. the client-side AI transports. */
export const AI_CLIENT_TRANSPORTS = [...CLIENT_TRANSPORTS.keys()]
  .filter((s) => !(s in NON_AI_CLIENT_TRANSPORTS))
  .sort();

/**
 * THE ROSTER — the union of both sides: every model-calling edge surface AND every
 * client-invoked AI transport. This is the denominator both E-D walls answer to. A
 * surface present on either side alone (an edge deployed with no client wiring; a client
 * transport whose edge half is an owner-gated fold) is in the roster all the same.
 */
export const AI_SURFACE_ROSTER = [...new Set([...AI_SURFACES, ...AI_CLIENT_TRANSPORTS])].sort();

/**
 * NON-VACUITY FLOORS (guard-the-guard), shared so the two enforcers cannot drift on the
 * bar either. These are LOWER bounds on today's measured sizes — 12 model-calling edge
 * surfaces, 23 client transports, 13 rostered AI surfaces. Adding a surface never touches
 * them. The ONLY legal move is DOWNWARD, and only as a deliberate act when a surface is
 * genuinely retired from the tree; raising one to make a red run green would be raising
 * the bar on a detector that has already collapsed.
 */
export const CENSUS_FLOORS = Object.freeze({
  edgeSurfaces: 11,
  clientTransports: 20,
  roster: 13,
});
