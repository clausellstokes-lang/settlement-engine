/**
 * edgeModelDefaultsCensus.test.js — THE MODEL-DEFAULT DRIFT WALL (bar-7 AI-cost, C4).
 *
 * Model ids are duplicated across ~15 env-overridable edge constants of the shape
 *   Deno.env.get('ANTHROPIC_CLAUDE_<FAMILY>_<VER>_MODEL') || '<default id>'
 * with nothing binding a constant's NAME to its DEFAULT. A copy-paste that pairs the
 * SONNET env name with an 'claude-opus-…' default (or vice-versa) silently misroutes
 * the tier — a costlier model resolves while the ledger's hardcoded price + the cost
 * estimate keep assuming the cheaper class. aiTaskConfig.test.js pins only the CLIENT
 * routing table; the edge defaults had no census at all.
 *
 * THE WALL: enumerate every ANTHROPIC_CLAUDE_<FAMILY>_…_MODEL default across the edge
 * tree and require the default id's family to MATCH the env-var name's family
 * (SONNET name ⇒ 'claude-sonnet-…' default). Catches source-level tier drift.
 *
 * SCOPE (honest): this binds the SOURCE DEFAULTS. A runtime env override to a wrong
 * snapshot, and logging the provider-RESOLVED data.model rather than the requested
 * alias, are a deeper operational concern (flagged in the C4 report) — a source census
 * cannot observe a deploy-time env value.
 *
 * @enforced-by this test
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const FN_DIR = resolve(process.cwd(), 'supabase', 'functions');

function walkTs(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walkTs(p, out);
    else if (/\.ts$/.test(e) && !/\.test\.ts$/.test(e)) out.push(p);
  }
  return out;
}

const KNOWN_FAMILIES = new Set(['opus', 'sonnet', 'haiku']);

// Match: Deno.env.get('ANTHROPIC_CLAUDE_<FAMILY>_<ver>_MODEL') || '<default>'
const RE = /ANTHROPIC_CLAUDE_([A-Z]+)_[0-9A-Z_]*MODEL'\)\s*\|\|\s*'([^']+)'/g;

function collectDefaults() {
  const found = [];
  for (const file of walkTs(FN_DIR)) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(RE)) {
      found.push({ file: file.replace(FN_DIR + '/', ''), family: m[1].toLowerCase(), def: m[2] });
    }
  }
  return found;
}

const DEFAULTS = collectDefaults();

describe('edge model-default census — env-var family must match its default id', () => {
  it('the scan found the model constants (guard-the-guard: not a vacuous pass)', () => {
    // ~15 constants today across ai-analyst/construct-*/generate-narrative/etc.
    expect(DEFAULTS.length).toBeGreaterThanOrEqual(10);
  });

  it.each(DEFAULTS.map((d) => [`${d.file} :: ${d.family}`, d]))(
    '%s — default resolves to its own family',
    (_label, d) => {
      expect(KNOWN_FAMILIES.has(d.family), `${d.file}: unknown model family '${d.family}'`).toBe(true);
      expect(
        d.def.startsWith(`claude-${d.family}`),
        `${d.file}: ANTHROPIC_CLAUDE_${d.family.toUpperCase()}_*_MODEL defaults to '${d.def}', which is `
        + `NOT a claude-${d.family} id — the env name and its default disagree (tier misroute).`,
      ).toBe(true);
    },
  );

  it('the family/default matcher rejects a mismatch (self-check)', () => {
    const sample = "const M = Deno.env.get('ANTHROPIC_CLAUDE_SONNET_4_5_MODEL') || 'claude-opus-4-8';";
    RE.lastIndex = 0;
    const m = [...sample.matchAll(RE)][0];
    expect(m[1].toLowerCase()).toBe('sonnet');
    expect(m[2]).toBe('claude-opus-4-8');
    expect(m[2].startsWith('claude-sonnet')).toBe(false); // the wall would red this
  });
});

// ── THE CHOKEPOINT CENSUS (wave L-3a) ───────────────────────────────────────
//
// The census above binds a model constant's NAME to its DEFAULT. This one binds the
// RULE that chooses between a user's stored preference and that default. Nine Surveyor
// surfaces each carried a byte-identical copy of
//   capturedModel = (providerKey.byok && capturedModelPref
//     && ANTHROPIC_SUPPORTED_MODELS.includes(capturedModelPref)) ? capturedModelPref : DEFAULT
// until L-3a extracted it into supabase/functions/ai-analyst/modelResolver.ts. Nine copies
// of one rule is nine places for it to drift, and a drifted copy is invisible: the surface
// still resolves A model, just not the same one its siblings would.
//
// THE WALL, two-sided:
//   1. the inline allowlist membership test exists ONLY in the resolver, plus any carrier
//      written down in EXEMPT_CARRIERS with a reason (shrink-only, compared exactly);
//   2. every file that resolves a captured model imports the shared resolver.
// A tenth surface pasting the old expression reds (1); a tenth surface hand-rolling a
// different membership test reds (2).
//
// @enforced-by this test

const TS_FILES = walkTs(FN_DIR).map((p) => p.replace(FN_DIR + '/', ''));
const readFn = (rel) => readFileSync(join(FN_DIR, rel), 'utf8');

/** The one file allowed to carry the rule. */
const RESOLVER = 'ai-analyst/modelResolver.ts';

/**
 * Carriers OTHER than the resolver, each with a written reason. SHRINK-ONLY: the set is
 * compared exactly, so an exemption that disappears reds and asks for the win to be banked,
 * and a new carrier reds and asks for a fix or a deliberate entry. Never widen this to make
 * a red go away without writing down why the file is genuinely not the nine-surface rule.
 *
 * EMPTY AS OF WAVE L-WIRE, and the emptiness is the finding. L-3a left exactly one written
 * exemption — surveyor-byok's probe-model pick, which is a different SHAPE (first
 * allowlisted preference across several task keys, no byok gate) but was still spelling the
 * same MEMBERSHIP TEST a second time. Its fold obligation was to route through
 * isSupportedModelPref(), and L-WIRE did. The allowlist rule now has exactly one home, and
 * this wall enforces zero exemptions: a file that reintroduces the inline test reds, and so
 * does an entry added here without a real reason, because the shrink-only assertion below
 * compares the set exactly in both directions.
 */
const EXEMPT_CARRIERS = Object.freeze({});
const ALLOWED_CARRIERS = [RESOLVER, ...Object.keys(EXEMPT_CARRIERS)].sort();
/** The inline membership test the nine copies all shared. */
const INLINE_MEMBERSHIP = /ANTHROPIC_SUPPORTED_MODELS\.includes\(/;
/** A surface that resolves a per-request model declares this capture. */
const CAPTURES_MODEL = /\blet capturedModel\b/;

describe('captured-model chokepoint census - the copy-paste cannot regrow', () => {
  it('the scan sees the tree and the resolver (guard-the-guard: not a vacuous pass)', () => {
    expect(TS_FILES.length).toBeGreaterThanOrEqual(30);
    expect(TS_FILES, 'the resolver file itself must be in the scan').toContain(RESOLVER);
    // Negative control: the pattern really is present somewhere, so an "exactly one
    // carrier" pass can never be a pass over zero carriers.
    expect(INLINE_MEMBERSHIP.test(readFn(RESOLVER))).toBe(true);
  });

  it('only the resolver and the written-down exemptions carry the inline allowlist test', () => {
    const carriers = TS_FILES.filter((rel) => INLINE_MEMBERSHIP.test(readFn(rel))).sort();
    const unexplained = carriers.filter((rel) => !ALLOWED_CARRIERS.includes(rel));
    const vanished = ALLOWED_CARRIERS.filter((rel) => !carriers.includes(rel));
    expect(
      unexplained,
      `\nThe BYOK model-preference rule belongs in ${RESOLVER}. These files spell it inline:\n`
      + `${unexplained.join('\n')}\n`
      + `Call resolveCapturedModel({ byok, modelPref, surfaceDefault }) for the full rule, or\n`
      + `isSupportedModelPref(pref) for the bare predicate. If a file genuinely is not the\n`
      + `nine-surface rule, add it to EXEMPT_CARRIERS with a written reason.\n`,
    ).toEqual([]);
    expect(
      vanished,
      `\nA carrier this wall expected is gone. If an exemption was routed through the shared\n`
      + `resolver, that is a win: SHRINK EXEMPT_CARRIERS to match. If the resolver itself\n`
      + `stopped carrying the rule, this whole wall just went vacuous:\n${vanished.join('\n')}\n`,
    ).toEqual([]);
  });

  it('every surface that resolves a captured model calls the shared resolver', () => {
    const surfaces = TS_FILES.filter((rel) => CAPTURES_MODEL.test(readFn(rel))).sort();
    // Nine surfaces today: ai-analyst, custom-content, style-overhaul, interpret-session,
    // surveyor-autonomy, construct-realm, construct-settlement, interview, parley.
    expect(surfaces.length, 'model-resolving surfaces found').toBeGreaterThanOrEqual(9);
    const notDelegating = surfaces.filter((rel) => !readFn(rel).includes('resolveCapturedModel'));
    expect(
      notDelegating,
      `\nThese surfaces resolve a captured model without the shared resolver, so their\n`
      + `preference rule can drift from the other surfaces' silently:\n${notDelegating.join('\n')}\n`,
    ).toEqual([]);
  });

  it('every exemption is written down with a real reason and names its fold obligation', () => {
    // Asserted as a COUNT first, so this case cannot go vacuously green now that the set is
    // empty: a loop over nothing proves nothing, and the whole point of the L-WIRE
    // retirement is that the count is zero rather than that the documentation is good.
    expect(
      Object.keys(EXEMPT_CARRIERS).length,
      '\nThe allowlist rule has exactly one home as of wave L-WIRE. A new exemption is a\n'
      + 'deliberate act: add it with a written reason that names how to retire it, and update\n'
      + 'this expectation in the same change.\n',
    ).toBe(0);
    for (const [rel, reason] of Object.entries(EXEMPT_CARRIERS)) {
      expect(TS_FILES, `exempt file ${rel} no longer exists`).toContain(rel);
      expect(reason.length, `${rel} reason`).toBeGreaterThan(80);
      expect(reason, `${rel} must say how to retire the exemption`).toContain('isSupportedModelPref');
    }
  });

  it('the retired carrier now routes through the shared predicate (the win, banked)', () => {
    // The mirror image of the shrink-only assertion above: proving the inline test is GONE
    // is not the same as proving the file still resolves a probe model, and a silent
    // deletion of the whole loop would satisfy the first without satisfying the second.
    const probe = readFn('surveyor-byok/index.ts');
    expect(probe).toContain('isSupportedModelPref');
    expect(INLINE_MEMBERSHIP.test(probe), 'surveyor-byok reintroduced the inline test').toBe(false);
    expect(probe, 'the probe still picks a model from the stored preferences')
      .toMatch(/for \(const task of PROBE_PREF_KEYS\)/);
  });

  it('the carrier detector would catch a pasted copy (self-check)', () => {
    const pasted = 'capturedModel = (providerKey.byok && capturedModelPref '
      + '&& ANTHROPIC_SUPPORTED_MODELS.includes(capturedModelPref)) ? capturedModelPref : X_MODEL;';
    expect(INLINE_MEMBERSHIP.test(pasted)).toBe(true);
    expect(CAPTURES_MODEL.test('    let capturedModel = X_MODEL;')).toBe(true);
    expect(CAPTURES_MODEL.test('    capturedModel = resolveCapturedModel({}).model;')).toBe(false);
  });
});
