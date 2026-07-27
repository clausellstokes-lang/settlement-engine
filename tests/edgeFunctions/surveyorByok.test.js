/**
 * surveyorByok.test.js — the BYOK MANAGEMENT SURFACE edge contracts (#29).
 *
 *  1. RUNTIME of the pure model-picker helper intersectModels + the adapter's
 *     supported-model / retention exports (the same code the edge runs).
 *  2. STRUCTURAL contracts the surveyor-byok verify handler must satisfy: the trust
 *     gates, verify-by-test-call, list-models on healthy, the key-health write, and —
 *     the load-bearing one — that verifying a key spends NO credits.
 *  3. STRUCTURAL contracts the ai-analyst handler must satisfy for the governors +
 *     graceful refusals: precheck BEFORE the credit flow, a receipted refusal, provider
 *     errors classified into key-health, and refusal_class on the audit row.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import {
  intersectModels, registerProviderAdapter,
  ANTHROPIC_SUPPORTED_MODELS, ANTHROPIC_RETENTION_CLASS,
} from '../../supabase/functions/ai-analyst/analystCore.ts';
import {
  resolveCapturedModel, ANTHROPIC_TIER_CLASS,
} from '../../supabase/functions/ai-analyst/modelResolver.ts';
// Wave L-3b — THE COMPETENCY PROBE. The exam itself, plus the live vocabularies the
// exam is pinned against (the drift wall in Layer 6).
import {
  PROBE_TASK_KEYS, PROBE_TIERS, PROBE_PROMPTS, PROBE_FLOORS, PROBE_REASON_CLASSES,
  PROBE_CONSTRUCT_VOCAB, PROBE_OP_VOCAB, PROBE_CONTENT_FIELDS, PROBE_CONTENT_BUCKETS,
  PROBE_VERSION,
  gradeProbeTask, tierForPasses, tierFromResults, buildProbeProfile, answerTextFromAnthropic,
} from '../../supabase/functions/surveyor-byok/probeCore.ts';
// Wave L-7a — THE FORMATIVE EXAM. The persisted texture and the deterministic renderer
// that turns it into coaching (Layers 8 and 9).
import {
  renderCoachingBlock, COACHING_TABLE, COACHING_HEADER,
} from '../../supabase/functions/_shared/modelCoaching.ts';
import { CUSTOM_CONTENT_MANIFEST } from '../../supabase/functions/_shared/customContentManifest.generated.ts';
import {
  SETTLEMENT_CONFIG_FIELDS, CONSTRAINT_DIMENSIONS, CONSTRAINT_BANDS,
} from '../../src/domain/construct/configVocabulary.js';
import { buildOpVocabulary } from '../../src/domain/intent/opVocabulary.js';

const ROOT = resolve(process.cwd());
const BYOK = readFileSync(join(ROOT, 'supabase/functions/surveyor-byok/index.ts'), 'utf8');
const ANALYST = readFileSync(join(ROOT, 'supabase/functions/ai-analyst/index.ts'), 'utf8');
const PROBE_CORE = readFileSync(join(ROOT, 'supabase/functions/surveyor-byok/probeCore.ts'), 'utf8');
const MODEL_COACHING = readFileSync(join(ROOT, 'supabase/functions/_shared/modelCoaching.ts'), 'utf8');
const MIGRATION_191 = readFileSync(join(ROOT, 'supabase/migrations/191_surveyor_probe_tier.sql'), 'utf8');
/** The probe block of the handler, sliced out so a contract can be asserted about IT
 *  rather than about the whole file (where verify's plumbing would satisfy it). */
const PROBE_BLOCK = BYOK.slice(
  BYOK.indexOf("if (action === 'probe')"),
  BYOK.indexOf('// ── the verify-by-test-call'),
);

// ── Layer 1: the pure model picker ──────────────────────────────────────────
describe('intersectModels — the dynamic model dropdown (key list-models ∩ adapter set)', () => {
  it('family-aware match: a provider id sharing the family stem counts', () => {
    // key ids carry a date/version suffix; the adapter uses aliases.
    const key = ['claude-opus-4-20250514', 'claude-sonnet-4-5-20250101', 'gpt-4o'];
    const out = intersectModels(key, ANTHROPIC_SUPPORTED_MODELS);
    expect(out).toContain('claude-opus-4-8');   // matched claude-opus-4-* by stem
    expect(out).toContain('claude-sonnet-4-5');  // exact-ish family
    expect(out).not.toContain('gpt-4o');         // not an adapter model
  });

  it('exact ids intersect', () => {
    expect(intersectModels(['claude-haiku-4-5'], ANTHROPIC_SUPPORTED_MODELS)).toContain('claude-haiku-4-5');
  });

  it('FAIL-OPEN: an empty/unavailable key list returns the full adapter set (never blank)', () => {
    expect(intersectModels([], ANTHROPIC_SUPPORTED_MODELS)).toEqual([...ANTHROPIC_SUPPORTED_MODELS]);
    expect(intersectModels(null, ANTHROPIC_SUPPORTED_MODELS)).toEqual([...ANTHROPIC_SUPPORTED_MODELS]);
  });

  it('a key that can access NOTHING the adapter supports returns empty (honest)', () => {
    expect(intersectModels(['some-other-model'], ANTHROPIC_SUPPORTED_MODELS)).toEqual([]);
  });
});

describe('adapter model/retention exports (§3e, shared with the picker)', () => {
  it('registerProviderAdapter carries the models set + retention class', () => {
    const a = registerProviderAdapter({ id: 'x', retentionClass: 'bounded', models: ANTHROPIC_SUPPORTED_MODELS, call: async () => new Response('') });
    expect(a.models).toEqual([...ANTHROPIC_SUPPORTED_MODELS]);
    expect(a.retentionClass).toBe('bounded');
  });
  it('the anthropic retention floor is a valid non-training class', () => {
    expect(['zero', 'bounded']).toContain(ANTHROPIC_RETENTION_CLASS);
  });
});

// ── Layer 2: surveyor-byok verify handler contracts ─────────────────────────
describe('surveyor-byok — verify handler contracts', () => {
  it('gates on account_is_active AND the Surveyor entitlement', () => {
    expect(BYOK).toContain("rpc('account_is_active'");
    expect(BYOK).toContain("rpc('has_surveyor_entitlement'");
  });

  it('refuses gracefully when the user has NO key of their own to verify', () => {
    expect(BYOK).toMatch(/if\s*\(\s*!providerKey\.byok\s*\)/);
    expect(BYOK).toMatch(/No key on file to verify/i);
  });

  it('VERIFY-BY-TEST-CALL then persists health via surveyor_byok_set_health', () => {
    expect(BYOK).toContain('pingAnthropic');
    expect(BYOK).toContain("rpc('surveyor_byok_set_health'");
    // healthy is set only after resp.ok — never presented as healthy unverified
    expect(BYOK).toMatch(/resp\.ok[\s\S]{0,120}setHealth\('healthy'/);
  });

  it('on healthy, returns the key list-models ∩ adapter set for the dropdown', () => {
    expect(BYOK).toContain('listAnthropicModels');
    expect(BYOK).toContain('intersectModels');
    expect(BYOK).toContain('retentionClass');
  });

  it('classifies a provider failure into a §3d graceful refusal', () => {
    expect(BYOK).toContain('classifyProviderError');
    expect(BYOK).toContain('classifyProviderThrow');
    expect(BYOK).toContain('refusalForClass');
  });

  it('verifying a key spends NO credits (no spend/reserve/release in this function)', () => {
    expect(BYOK).not.toContain("rpc('spend_credits'");
    expect(BYOK).not.toContain("rpc('reserve_ai_spend'");
    expect(BYOK).not.toContain("rpc('release_ai_spend_reservation'");
  });

  it('rate-limits the test-call (bounds provider-ping abuse)', () => {
    expect(BYOK).toContain("rpc('consume_ai_generate_rate_limit'");
  });
});

// ── Layer 3: ai-analyst governor + refusal wiring ───────────────────────────
describe('ai-analyst — usage governors + graceful refusals (#29)', () => {
  it('runs the usage precheck BEFORE the credit flow (over-cap spends nothing)', () => {
    const preIdx = ANALYST.indexOf("rpc('surveyor_usage_precheck'");
    const flowIdx = ANALYST.indexOf('runCreditedCall(');
    expect(preIdx).toBeGreaterThan(-1);
    expect(flowIdx).toBeGreaterThan(-1);
    expect(preIdx).toBeLessThan(flowIdx);
  });

  it('a blocked precheck receipts a refused turn (no spend) and returns a graceful refusal', () => {
    // the governor block: refused audit row + a refusalForClass response, no spend_id
    const gov = ANALYST.slice(ANALYST.indexOf("rpc('surveyor_usage_precheck'"), ANALYST.indexOf('runCreditedCall('));
    expect(gov).toMatch(/allowed\s*===\s*false/);
    expect(gov).toContain('refusalForClass');
    expect(gov).toContain('p_refused: true');
    expect(gov).toContain('p_spend_id: null');
    expect(gov).toContain('p_refusal_class');
  });

  it('fails OPEN on a precheck RPC error (the global cap still protects the operator)', () => {
    const gov = ANALYST.slice(ANALYST.indexOf("rpc('surveyor_usage_precheck'"), ANALYST.indexOf('runCreditedCall('));
    // only an explicit allowed===false blocks; an error path logs and proceeds
    expect(gov).toMatch(/allowed\s*===\s*false/);
    expect(gov).not.toMatch(/allowed\s*!==\s*true/); // would wrongly block on RPC hiccup
  });

  it('classifies a provider error into key-health (BYOK) and a graceful refusal', () => {
    expect(ANALYST).toContain('classifyProviderError');
    expect(ANALYST).toContain('applyProviderError');
    // health write is gated on the BYOK flag (never for the shared server key)
    expect(ANALYST).toMatch(/providerKey\.byok\s*&&\s*health/);
    expect(ANALYST).toContain("rpc('surveyor_byok_set_health'");
  });

  it('records the refusal_class on the audit row', () => {
    expect(ANALYST).toContain('p_refusal_class: capturedRefusalClass');
  });

  it('honours a BYOK user per-task model override, validated against the adapter set', () => {
    // L-3a: the rule itself moved into the shared resolver (ai-analyst/modelResolver.ts,
    // exercised for real below). What this surface still owes is the WIRING: it passes the
    // BYOK flag and the DB-read preference in, and it calls + meters what comes back.
    expect(ANALYST).toMatch(/capturedModel\s*=\s*resolveCapturedModel\(\{/);
    expect(ANALYST).toMatch(/byok:\s*providerKey\.byok/);
    expect(ANALYST).toMatch(/modelPref:\s*capturedModelPref/);
    expect(ANALYST).toMatch(/surfaceDefault:\s*ANALYST_MODEL/);
    expect(ANALYST).toMatch(/model:\s*capturedModel/);        // the actual provider call uses it
    expect(ANALYST).toContain('model: capturedModel, model_preference: capturedModelPref'); // metered
  });
});

// ── Layer 4: the shared captured-model resolver (wave L-3a) ─────────────────
//
// The nine-surface copy-paste became one function. These run the REAL module, so they
// pin behavior rather than source text: same inputs, same model, whichever surface asks.
// The tree-wide "only one file carries the rule" wall lives in
// tests/edgeFunctions/edgeModelDefaultsCensus.test.js.

describe('resolveCapturedModel - the BYOK preference rule, extracted (L-3a)', () => {
  const DEFAULT = 'claude-opus-4-8';
  const ALLOWED = ANTHROPIC_SUPPORTED_MODELS[ANTHROPIC_SUPPORTED_MODELS.length - 1];

  it('guard the guard: the allowlist is real and the sample pref is not the default', () => {
    expect(ANTHROPIC_SUPPORTED_MODELS.length).toBeGreaterThanOrEqual(3);
    expect(ANTHROPIC_SUPPORTED_MODELS).toContain(DEFAULT);
    expect(ALLOWED).not.toBe(DEFAULT);   // otherwise "pref honoured" would be unobservable
  });

  it('BYOK + an allowlisted preference is HONOURED', () => {
    const out = resolveCapturedModel({ byok: true, modelPref: ALLOWED, surfaceDefault: DEFAULT });
    expect(out.model).toBe(ALLOWED);
    expect(out.source).toBe('pref');
  });

  it('a MANAGED key never honours a preference, however valid', () => {
    for (const id of ANTHROPIC_SUPPORTED_MODELS) {
      const out = resolveCapturedModel({ byok: false, modelPref: id, surfaceDefault: DEFAULT });
      expect(out.model, `managed + ${id}`).toBe(DEFAULT);
      expect(out.source).toBe('default');
    }
  });

  it('BYOK + an off-allowlist preference falls back to the surface default', () => {
    for (const bad of ['gpt-5.2', 'claude-sonnet-4-6', 'claude-opus-4-8-20251001', 'nonsense']) {
      const out = resolveCapturedModel({ byok: true, modelPref: bad, surfaceDefault: DEFAULT });
      expect(out.model, bad).toBe(DEFAULT);
      expect(out.source).toBe('default');
    }
  });

  it('D2 IS PRESERVED, NOT FIXED: membership is plain, never family-aware', () => {
    // intersectModels (the picker) matches a dated build id by family stem; this rule does
    // not, and that gap is the recorded D2 owner decision. If this test ever reds because
    // the dated id resolved, somebody changed which model real users get.
    const dated = 'claude-haiku-4-5-20251001';
    expect(intersectModels([dated], ANTHROPIC_SUPPORTED_MODELS)).toContain('claude-haiku-4-5');
    expect(resolveCapturedModel({ byok: true, modelPref: dated, surfaceDefault: DEFAULT }).model)
      .toBe(DEFAULT);
  });

  it('an absent or empty preference falls back, exactly as the old truthiness test did', () => {
    for (const pref of [null, '']) {
      const out = resolveCapturedModel({ byok: true, modelPref: pref, surfaceDefault: DEFAULT });
      expect(out.model).toBe(DEFAULT);
      expect(out.source).toBe('default');
    }
  });

  it('the surface default is returned VERBATIM and unvalidated (env overrides must survive)', () => {
    // Every surface default is Deno.env.get(...) || '<literal>', so a deployment can serve
    // an id no literal carries (registry class D6). The resolver must not second-guess it.
    const exotic = 'claude-opus-4-8-20990101';
    const out = resolveCapturedModel({ byok: false, modelPref: null, surfaceDefault: exotic });
    expect(out.model).toBe(exotic);
    expect(out.tierClass).toBeNull();     // honest absence, never a guessed ceiling
  });

  it('tierClass reports the rung of the model actually chosen, on both branches', () => {
    const pref = resolveCapturedModel({
      byok: true, modelPref: 'claude-haiku-4-5', surfaceDefault: 'claude-opus-4-8',
    });
    expect(pref.model).toBe('claude-haiku-4-5');
    expect(pref.tierClass).toBe('fast');          // the PREF's rung, not the default's
    const dflt = resolveCapturedModel({
      byok: false, modelPref: 'claude-haiku-4-5', surfaceDefault: 'claude-opus-4-8',
    });
    expect(dflt.model).toBe('claude-opus-4-8');
    expect(dflt.tierClass).toBe('deep');
  });

  it('every allowlisted model has a rung, so a real BYOK choice is never untiered', () => {
    for (const id of ANTHROPIC_SUPPORTED_MODELS) {
      const out = resolveCapturedModel({ byok: true, modelPref: id, surfaceDefault: id });
      expect(out.tierClass, `${id} rung`).toBeTruthy();
      expect(['fast', 'balanced', 'deep']).toContain(out.tierClass);
    }
  });

  it('the mirror is frozen, so no caller can teach it a rung at runtime', () => {
    expect(Object.isFrozen(ANTHROPIC_TIER_CLASS)).toBe(true);
    expect(Object.keys(ANTHROPIC_TIER_CLASS).length).toBeGreaterThanOrEqual(5);
  });

  it('is pure: same inputs, same output, no throw on hostile input', () => {
    const args = { byok: true, modelPref: ALLOWED, surfaceDefault: DEFAULT };
    expect(resolveCapturedModel(args)).toEqual(resolveCapturedModel(args));
    expect(() => resolveCapturedModel({ byok: false, modelPref: null, surfaceDefault: '' })).not.toThrow();
  });
});

// ── Layer 5: THE COMPETENCY PROBE, graded for real (wave L-3b) ──────────────
//
// These do not scan source: they run probeCore's graders over fixed answer fixtures and
// assert the verdict, because the load-bearing claim of the whole ladder is that a tier
// is a DETERMINISTIC FUNCTION OF THE SCHEMA WALL'S VERDICT and of nothing else. A source
// scan cannot prove that; executing the grader can.

/** A correct answer to each task, written against the taught vocabulary. */
const GOOD = Object.freeze({
  construct: JSON.stringify({
    config: {
      settType: 'town', population: 4000, priorityEconomy: 75, priorityMagic: 5,
      magicExists: false, contentProfile: 'grounded',
    },
    constraints: { resourcePressure: 'high', resilience: 'low' },
  }),
  customContent: JSON.stringify({
    entries: [
      { bucket: 'institutions', fields: { name: 'Riverside Grain Mill', category: 'Mill', authority: 'economic', foodImpact: 'produces', economicWeight: 'moderate' } },
      { bucket: 'resources', fields: { name: 'Reed Beds', criticality: 'discretionary', foodImpact: 'none' } },
    ],
  }),
  interpret: JSON.stringify({
    ops: [
      { family: 'canon_event', type: 'DAMAGE_INSTITUTION', params: { targetId: 'inst_granary', payload: { severity: 0.8 } } },
      { family: 'canon_event', type: 'KILL_NPC', params: { targetId: 'npc_marden' } },
      { family: 'canon_event', type: 'CUT_TRADE_ROUTE', params: { targetId: 'route_coast' } },
    ],
  }),
});

describe('probe grading — a correct answer passes each of the three walls', () => {
  it('guard the guard: the exam has three tasks and three tiers, and the fixtures are distinct', () => {
    expect([...PROBE_TASK_KEYS]).toEqual(['construct', 'customContent', 'interpret']);
    expect([...PROBE_TIERS]).toEqual(['scout', 'journeyman', 'master']);
    expect(new Set(Object.values(GOOD)).size).toBe(3);
  });

  for (const key of PROBE_TASK_KEYS) {
    it(`${key}: the model answer clears its wall and its floor`, () => {
      expect(gradeProbeTask(key, GOOD[key])).toEqual({ key, passed: true });
    });
  }

  it('a fenced/markdown-wrapped answer still grades (the parsers unfence, as the live surfaces do)', () => {
    const wrapped = '```json\n' + GOOD.construct + '\n```';
    expect(gradeProbeTask('construct', wrapped).passed).toBe(true);
  });
});

describe('probe grading — every failure mode is a named class, never a silent pass', () => {
  const cases = [
    ['construct', '{"config":{},"constraints":{}}', 'no_output'],
    ['construct', 'I am sorry, I cannot help with that.', 'no_output'],
    ['construct', JSON.stringify({ config: { settType: 'town', population: 4000, priorityEconomy: 75, settlementMood: 'gloomy' }, constraints: { resilience: 'low' } }), 'unsupported_emitted'],
    ['construct', JSON.stringify({ config: { settType: 'town', population: 4000, priorityEconomy: 75 }, constraints: { resourcePressure: 'extreme' } }), 'dropped_at_wall'],
    ['construct', JSON.stringify({ config: { settType: 'town', population: 4000 }, constraints: { resilience: 'low' } }), 'below_floor'],
    ['customContent', '{"entries":[]}', 'no_output'],
    ['customContent', JSON.stringify({ entries: [{ bucket: 'institutions', fields: { name: 'Mill', mood: 'declining' } }, { bucket: 'resources', fields: { name: 'Reeds' } }] }), 'unsupported_emitted'],
    ['customContent', JSON.stringify({ entries: [{ bucket: 'institutions', fields: { name: 'Mill' } }, { bucket: 'resources', fields: { name: 'Reeds' } }, { fields: { name: 'Nameless' } }] }), 'dropped_at_wall'],
    ['customContent', JSON.stringify({ entries: [{ bucket: 'institutions', fields: { name: 'Mill' } }] }), 'below_floor'],
    ['interpret', '{"ops":[]}', 'no_output'],
    ['interpret', JSON.stringify({ ops: [{ family: 'canon_event', type: 'BURN_GRANARY', params: {} }, { family: 'canon_event', type: 'KILL_NPC', params: {} }] }), 'unsupported_emitted'],
    ['interpret', JSON.stringify({ ops: [{ family: 'canon_event', type: 'KILL_NPC', params: {} }, { family: 'canon_event', type: 'CUT_TRADE_ROUTE', params: {} }, { family: 'canon_event', params: {} }] }), 'dropped_at_wall'],
    ['interpret', JSON.stringify({ ops: [{ family: 'canon_event', type: 'KILL_NPC', params: {} }] }), 'below_floor'],
  ];

  for (const [key, answer, reasonClass] of cases) {
    it(`${key}: ${reasonClass}`, () => {
      const out = gradeProbeTask(key, answer);
      expect(out.passed).toBe(false);
      expect(out.reasonClass).toBe(reasonClass);
      expect(PROBE_REASON_CLASSES).toContain(out.reasonClass);
    });
  }

  it('every declared reason class is actually reachable (no decorative vocabulary)', () => {
    const reached = new Set(cases.map(([, , r]) => r));
    expect([...reached].sort()).toEqual([...PROBE_REASON_CLASSES].sort());
  });
});

describe('probe grading — THE CONFLICTED-WITNESS RULE: no model self-tag is ever read', () => {
  it('a correct answer still PASSES while loudly self-declaring failure', () => {
    // Same ops as the passing fixture, plus every self-report shape the surfaces carry:
    // a self-declared unsupported list, low-confidence labels, a rider, and musings.
    const humble = JSON.stringify({
      ops: JSON.parse(GOOD.interpret).ops.map((o) => ({ ...o, label: 'uncertain', rationale: 'I am probably wrong', sourced: false })),
      unsupported: [{ requested: 'literally everything', reason: 'no_primitive' }],
      musings: [{ text: 'I do not think I understood any of this.' }],
      rider: { intent: 'refuse', refusalReason: 'unclear', actionDrafted: false },
    });
    expect(gradeProbeTask('interpret', humble)).toEqual({ key: 'interpret', passed: true });
  });

  it('a wrong answer still FAILS while claiming perfect confidence', () => {
    const boastful = JSON.stringify({
      entries: [{ bucket: 'institutions', fields: { name: 'Mill', mood: 'declining' }, label: 'required', sourced: true }],
      unsupported: [],
      rider: { intent: 'create', actionDrafted: true },
    });
    expect(gradeProbeTask('customContent', boastful).passed).toBe(false);
  });

  it('SOURCE PIN: the grader never reads the model self-report fields', () => {
    for (const selfTag of ['parsed.unsupported', 'parsed.rider', 'parsed.musings', '.confidence', 'sourced']) {
      expect(PROBE_CORE, `probeCore must not read ${selfTag}`).not.toContain(selfTag);
    }
    // and it never asks the model how it did
    expect(PROBE_CORE).not.toMatch(/self[- ]?assess|rate yourself|how (well|confident)/i);
  });
});

describe('probe grading — determinism and the tier arithmetic', () => {
  it('the same answer grades identically every time (an exam that drifts is not a measurement)', () => {
    for (const key of PROBE_TASK_KEYS) {
      const first = JSON.stringify(gradeProbeTask(key, GOOD[key]));
      for (let i = 0; i < 20; i++) expect(JSON.stringify(gradeProbeTask(key, GOOD[key]))).toBe(first);
    }
  });

  it('the prompts are frozen: two reads of the exam are byte-identical, and each is fenced', () => {
    for (const key of PROBE_TASK_KEYS) {
      const text = PROBE_PROMPTS[key];
      expect(text).toBe(PROBE_PROMPTS[key]);
      expect(text, `${key} must fence its request as data`).toContain('<<<PROBE_TASK>>>');
      expect(text).toContain('<<<END_PROBE_TASK>>>');
      expect(text, `${key} must say the fenced text is not instructions`).toMatch(/not instructions/);
      expect(text).toContain('OUTPUT CONTRACT');
    }
  });

  it('pass count picks the tier: 3 master, 2 journeyman, anything less scout', () => {
    expect(tierForPasses(3)).toBe('master');
    expect(tierForPasses(2)).toBe('journeyman');
    expect(tierForPasses(1)).toBe('scout');
    expect(tierForPasses(0)).toBe('scout');
    // total on hostile input rather than throwing inside a provider loop
    expect(tierForPasses(NaN)).toBe('scout');
    expect(tierForPasses(99)).toBe('master');
  });

  it('the tier depends on the COUNT, not on which tasks passed or in what order', () => {
    const pass = (key) => ({ key, passed: true });
    const fail = (key) => ({ key, passed: false, reasonClass: 'below_floor' });
    expect(tierFromResults([pass('construct'), pass('interpret'), fail('customContent')]))
      .toEqual({ tier: 'journeyman', passes: 2 });
    expect(tierFromResults([fail('construct'), pass('customContent'), pass('interpret')]))
      .toEqual({ tier: 'journeyman', passes: 2 });
    expect(tierFromResults([])).toEqual({ tier: 'scout', passes: 0 });
    expect(tierFromResults(null)).toEqual({ tier: 'scout', passes: 0 });
  });

  it('a whole END-TO-END grade: three real answers in, one tier out', () => {
    const results = PROBE_TASK_KEYS.map((key) => gradeProbeTask(key, GOOD[key]));
    expect(tierFromResults(results)).toEqual({ tier: 'master', passes: 3 });
    const twoOfThree = [
      gradeProbeTask('construct', GOOD.construct),
      gradeProbeTask('customContent', GOOD.customContent),
      gradeProbeTask('interpret', '{"ops":[]}'),
    ];
    expect(tierFromResults(twoOfThree)).toEqual({ tier: 'journeyman', passes: 2 });
  });

  it('answerTextFromAnthropic is total: any shape but a content array yields no output', () => {
    expect(answerTextFromAnthropic({ content: [{ type: 'text', text: 'a' }, { type: 'text', text: 'b' }] })).toBe('ab');
    expect(answerTextFromAnthropic({ content: [{ type: 'thinking', text: 'hidden' }] })).toBe('');
    for (const junk of [null, undefined, {}, { content: 'nope' }, { content: [null, 7] }]) {
      expect(answerTextFromAnthropic(junk)).toBe('');
    }
    expect(gradeProbeTask('construct', answerTextFromAnthropic(null)).reasonClass).toBe('no_output');
  });
});

// ── Layer 6: THE DRIFT WALL — the frozen exam must still be legal vocabulary ─
//
// The exam is frozen so tiers stay comparable across months. The cost of freezing is
// that a literal could come to teach a key the live wall no longer registers, which
// would grade every model down for the repo's own change. These bind the frozen exam to
// the LIVE vocabularies, so that drift reds here instead of silently deflating the
// ladder. This is the only place the Deno/src import barrier is crossed, and vitest can
// cross it because it loads both halves.

describe('probe drift wall — the frozen exam is still a subset of the live vocabularies', () => {
  it('every taught construct config key is registered, with a byte-equal spec', () => {
    const taught = Object.keys(PROBE_CONSTRUCT_VOCAB.configFields);
    expect(taught.length).toBeGreaterThanOrEqual(6); // guard-the-guard: not a vacuous loop
    for (const key of taught) {
      const live = SETTLEMENT_CONFIG_FIELDS[key];
      expect(live, `${key} is taught by the probe but no longer a registered config key`).toBeTruthy();
      const mine = PROBE_CONSTRUCT_VOCAB.configFields[key];
      expect(mine.type, `${key} type`).toBe(live.type);
      expect(mine.min, `${key} min`).toBe(live.min);
      expect(mine.max, `${key} max`).toBe(live.max);
      expect(mine.max_len, `${key} max_len`).toBe(live.max_len);
      expect([...(mine.values || [])], `${key} values`).toEqual([...(live.values || [])]);
    }
  });

  it('the taught constraint dimensions and bands are exactly the live ones', () => {
    expect([...PROBE_CONSTRUCT_VOCAB.constraintDimensions].sort()).toEqual([...CONSTRAINT_DIMENSIONS].sort());
    expect([...PROBE_CONSTRUCT_VOCAB.constraintBands].sort()).toEqual([...CONSTRAINT_BANDS].sort());
  });

  it('every taught op type and party kind is still registered', () => {
    const live = buildOpVocabulary();
    expect(PROBE_OP_VOCAB.canonEventTypes.length).toBeGreaterThanOrEqual(10);
    for (const type of PROBE_OP_VOCAB.canonEventTypes) {
      expect(live.canonEventTypes, `${type} is taught by the probe but unregistered`).toContain(type);
    }
    for (const kind of PROBE_OP_VOCAB.partyImpactKinds) {
      expect(live.partyImpactKinds, `${kind} is taught by the probe but unregistered`).toContain(kind);
    }
    for (const type of PROBE_OP_VOCAB.identityEventTypes) {
      expect(live.identityEventTypes, `${type} lost its identity classification`).toContain(type);
    }
    for (const kind of PROBE_OP_VOCAB.identityPartyKinds) {
      expect(live.identityPartyKinds, `${kind} lost its identity classification`).toContain(kind);
    }
  });

  it('every taught content bucket and field is still in the server-owned manifest', () => {
    const byKey = new Map(CUSTOM_CONTENT_MANIFEST.categories.map((c) => [c.key, c]));
    expect(PROBE_CONTENT_BUCKETS.length).toBeGreaterThanOrEqual(2);
    for (const bucket of PROBE_CONTENT_BUCKETS) {
      expect(CUSTOM_CONTENT_MANIFEST.authorableBuckets, `${bucket} is no longer authorable`).toContain(bucket);
      const category = byKey.get(bucket);
      expect(category, `${bucket} has no manifest category`).toBeTruthy();
      const fields = new Map(category.fields.map((f) => [f.key, f]));
      for (const [key, spec] of Object.entries(PROBE_CONTENT_FIELDS[bucket])) {
        const live = fields.get(key);
        expect(live, `${bucket}.${key} is taught by the probe but unregistered`).toBeTruthy();
        expect(live.type, `${bucket}.${key} type`).toBe(spec.type);
        expect(Boolean(live.required), `${bucket}.${key} required`).toBe(spec.required === true);
        for (const value of spec.values || []) {
          expect(live.values, `${bucket}.${key} value ${value}`).toContain(value);
        }
      }
    }
  });

  it('the taught vocabulary is what the PROMPTS actually print (no third spelling)', () => {
    for (const key of Object.keys(PROBE_CONSTRUCT_VOCAB.configFields)) {
      expect(PROBE_PROMPTS.construct, `${key} missing from the construct prompt`).toContain(key);
    }
    for (const type of PROBE_OP_VOCAB.canonEventTypes) {
      expect(PROBE_PROMPTS.interpret, `${type} missing from the interpret prompt`).toContain(type);
    }
    for (const bucket of PROBE_CONTENT_BUCKETS) {
      expect(PROBE_PROMPTS.customContent).toContain(bucket);
      for (const key of Object.keys(PROBE_CONTENT_FIELDS[bucket])) {
        expect(PROBE_PROMPTS.customContent, `${bucket}.${key} missing from the content prompt`).toContain(key);
      }
    }
  });

  it('the floors are reachable by the taught vocabulary (an unpassable exam measures nothing)', () => {
    expect(Object.keys(PROBE_CONSTRUCT_VOCAB.configFields).length).toBeGreaterThanOrEqual(PROBE_FLOORS.constructConfigKeys);
    expect(PROBE_CONSTRUCT_VOCAB.constraintDimensions.length).toBeGreaterThanOrEqual(PROBE_FLOORS.constructConstraints);
    expect(PROBE_CONTENT_BUCKETS.length).toBeGreaterThanOrEqual(PROBE_FLOORS.contentEntries);
    expect(PROBE_OP_VOCAB.canonEventTypes.length).toBeGreaterThanOrEqual(PROBE_FLOORS.interpretOps);
  });
});

// ── Layer 7: the probe HANDLER's structural contracts ───────────────────────

describe('surveyor-byok — probe handler contracts (L-3b)', () => {
  it('guard-the-guard: the probe block was actually found in the handler', () => {
    expect(PROBE_BLOCK.length).toBeGreaterThan(500);
    expect(PROBE_BLOCK).toContain('PROBE_TASK_KEYS');
  });

  it('probe is a served action, and an unknown action is still refused', () => {
    expect(BYOK).toMatch(/ACTIONS\s*=\s*new Set\(\['verify', 'probe'\]\)/);
    expect(BYOK).toMatch(/if\s*\(!ACTIONS\.has\(action\)\)\s*return json\(\{ error: 'unknown action' \}, 400/);
  });

  it('probing spends NO credits (the same load-bearing invariant verify carries)', () => {
    for (const rpc of ["rpc('spend_credits'", "rpc('reserve_ai_spend'", "rpc('release_ai_spend_reservation'", 'runCreditedCall']) {
      expect(BYOK, `${rpc} must not appear in this function`).not.toContain(rpc);
    }
  });

  it('takes one rate-limit unit PER TASK, inside the task loop', () => {
    expect(PROBE_BLOCK).toMatch(/for \(let i = 0; i < PROBE_TASK_KEYS\.length/);
    expect(PROBE_BLOCK).toMatch(/if \(i > 0 && !await consumeRate\(\)\)/);
    expect(PROBE_BLOCK).toMatch(/429/);
  });

  it('bounds every provider call AND the whole probe', () => {
    expect(PROBE_BLOCK).toContain('new AbortController()');
    expect(PROBE_BLOCK).toContain('PROBE_CALL_TIMEOUT_MS');
    expect(PROBE_BLOCK).toContain('PROBE_DEADLINE_MS');
    expect(PROBE_BLOCK).toContain('clearTimeout(timer)');
  });

  it('the measured model is read from the DATABASE, never from the request body', () => {
    expect(PROBE_BLOCK).toContain("rpc('surveyor_settings_get')");
    // L-WIRE retired the inline allowlist spelling for the resolver's shared predicate
    // (edgeModelDefaultsCensus enforces zero exemptions); same check, one spelling.
    expect(PROBE_BLOCK).toContain('isSupportedModelPref(pref)');
    // the body supplies only action + provider; a body-chosen model would be the
    // precedence law broken
    expect(PROBE_BLOCK).not.toMatch(/body[?.]*\.\s*model/);
  });

  it('grades with the shared graders and persists the tier through the service-role setter', () => {
    expect(PROBE_BLOCK).toContain('gradeProbeTask(taskKey, answerTextFromAnthropic(payload))');
    expect(PROBE_BLOCK).toContain('tierFromResults(results)');
    expect(PROBE_BLOCK).toContain("rpc('surveyor_byok_set_probe_tier'");
  });

  it('a provider failure classifies, persists NOTHING, and returns the graceful refusal', () => {
    // every failure exit is a probeRefusal, and probeRefusal cannot reach the setter:
    // the setter call sits after the loop, so a refusal returns before it.
    expect(PROBE_BLOCK).toContain('classifyProviderThrow(fetchErr)');
    expect(PROBE_BLOCK).toMatch(/probeRefusal\(classifyProviderError\(resp\.status/);
    const refusalDef = PROBE_BLOCK.slice(PROBE_BLOCK.indexOf('const probeRefusal'), PROBE_BLOCK.indexOf('const deadline'));
    expect(refusalDef).toContain('refusalForClass');
    expect(refusalDef).toContain('tier: null');
    expect(refusalDef).not.toContain('surveyor_byok_set_probe_tier');
    const beforeSetter = PROBE_BLOCK.slice(0, PROBE_BLOCK.indexOf("rpc('surveyor_byok_set_probe_tier'"));
    expect(beforeSetter).toContain('tierFromResults(results)'); // the tier exists before it is written
  });

  it('the answer carries the tier, the per-task verdicts, and the model that earned them', () => {
    const ok = PROBE_BLOCK.slice(PROBE_BLOCK.indexOf('ok: true'));
    for (const field of ['tier', 'passes', 'model: probeModel', 'tasks: results']) {
      expect(ok, `the probe answer must carry ${field}`).toContain(field);
    }
  });

  // ── wave L-7a: the exam receipt is persisted with the tier ────────────────
  it('persists the exam VERSION and the verdict PROFILE in the SAME write as the tier', () => {
    const call = PROBE_BLOCK.slice(PROBE_BLOCK.indexOf("rpc('surveyor_byok_set_probe_tier'"));
    expect(call).toContain('p_probe_version: PROBE_VERSION');
    expect(call).toContain('p_profile: buildProbeProfile(results)');
    // ONE rpc call, so a profile can never outlive or contradict the tier it summarises
    expect(PROBE_BLOCK.split("rpc('surveyor_byok_set_probe_tier'")).toHaveLength(2);
  });
});

// ── Layer 8: the PERSISTED PROFILE's shape gate (wave L-7a) ─────────────────
//
// The atlas has a gate that reds if an id or a below-floor cell reaches the committed
// artifact (tests/security/intentAtlasIdFree.test.js). This is the same law for the other
// id-free surface: what the probe stores about a run must be VERDICTS and nothing else,
// because the stored blob is later rendered into a prompt. The rule is enforced twice on
// purpose — here on the producing side, and at the database in migration 191's setter —
// since the whole point is that neither side has to be trusted.

/** Every string a profile is allowed to contain: a bare task identifier or a declared
 *  reason class. Anything else is prose, an id, or model output. */
const BARE_IDENTIFIER = /^[A-Za-z][A-Za-z0-9]{0,31}$/;

/** Walk a stored profile and return every value that is not enum, boolean, or count. */
function nonEnumValues(node, path = '$') {
  if (node === null || typeof node === 'boolean') return [];
  if (typeof node === 'number') return Number.isInteger(node) && node >= 0 ? [] : [`${path}=${node}`];
  if (typeof node === 'string') {
    const legal = BARE_IDENTIFIER.test(node) || PROBE_REASON_CLASSES.includes(node);
    return legal ? [] : [`${path}=${JSON.stringify(node)}`];
  }
  if (Array.isArray(node)) return node.flatMap((v, i) => nonEnumValues(v, `${path}[${i}]`));
  if (typeof node === 'object') {
    return Object.entries(node).flatMap(([k, v]) => nonEnumValues(v, `${path}.${k}`));
  }
  return [`${path}=<${typeof node}>`];
}

describe('buildProbeProfile — the stored texture is VERDICTS, never prose (L-7a)', () => {
  const allPass = PROBE_TASK_KEYS.map((key) => gradeProbeTask(key, GOOD[key]));
  const mixed = [
    gradeProbeTask('construct', GOOD.construct),
    gradeProbeTask('customContent', JSON.stringify({ entries: [{ bucket: 'institutions', fields: { name: 'Mill', mood: 'declining' } }] })),
    gradeProbeTask('interpret', '{"ops":[]}'),
  ];

  it('guard the guard: the fixtures really do grade differently', () => {
    expect(tierFromResults(allPass)).toEqual({ tier: 'master', passes: 3 });
    expect(tierFromResults(mixed)).toEqual({ tier: 'scout', passes: 1 });
  });

  it('the top level is exactly {tasks, passes, tasksRun}, with counts that match', () => {
    for (const results of [allPass, mixed]) {
      const profile = buildProbeProfile(results);
      expect(Object.keys(profile).sort()).toEqual(['passes', 'tasks', 'tasksRun']);
      expect(profile.tasksRun).toBe(results.length);
      expect(profile.passes).toBe(results.filter((r) => r.passed).length);
    }
  });

  it('every verdict carries exactly {key, passed, reasonClass}, reason explicit-null on a pass', () => {
    for (const results of [allPass, mixed]) {
      for (const task of buildProbeProfile(results).tasks) {
        expect(Object.keys(task).sort()).toEqual(['key', 'passed', 'reasonClass']);
        expect(typeof task.passed).toBe('boolean');
        expect(PROBE_TASK_KEYS).toContain(task.key);
        if (task.passed) expect(task.reasonClass).toBeNull();
        else expect(PROBE_REASON_CLASSES).toContain(task.reasonClass);
      }
    }
  });

  it('THE SHAPE GATE: every stored value is an enum token, a boolean, or a count', () => {
    for (const results of [allPass, mixed]) {
      expect(nonEnumValues(buildProbeProfile(results))).toEqual([]);
    }
    // guard the guard: the walker really does catch prose and ids
    expect(nonEnumValues({ tasks: [{ key: 'construct', passed: false, reasonClass: 'no_output', note: 'it apologised' }] }))
      .toEqual(['$.tasks[0].note="it apologised"']);
    expect(nonEnumValues({ tasks: [{ key: 'user_88f3-4c21', passed: true, reasonClass: null }] }))
      .toEqual(['$.tasks[0].key="user_88f3-4c21"']);
  });

  it('the profile can never carry a model answer, because the grader never returns one', () => {
    // The end-to-end statement: raw model text in, and none of it survives to storage.
    const chatty = JSON.stringify({ ops: [], commentary: 'The granary burned down, which I found quite moving.' });
    const profile = buildProbeProfile([gradeProbeTask('interpret', chatty)]);
    expect(JSON.stringify(profile)).not.toMatch(/granary|moving|commentary/i);
    expect(profile).toEqual({ tasks: [{ key: 'interpret', passed: false, reasonClass: 'no_output' }], passes: 0, tasksRun: 1 });
  });

  it('HONEST OR ABSENT: anything that would have to be guessed yields no profile at all', () => {
    expect(buildProbeProfile([])).toBeNull();
    expect(buildProbeProfile(null)).toBeNull();
    expect(buildProbeProfile(undefined)).toBeNull();
    // a failure with no declared reason class is unreachable from verdict(), and if it
    // ever arose a default class would put a measurement nobody earned into the database
    expect(buildProbeProfile([{ key: 'construct', passed: false }])).toBeNull();
    expect(buildProbeProfile([{ key: 'construct', passed: false, reasonClass: 'wrong_family' }])).toBeNull();
    expect(buildProbeProfile([{ key: 'a task that failed', passed: true }])).toBeNull();
    expect(buildProbeProfile([null])).toBeNull();
    // and the setter's upper bound is mirrored, so the edge never sends a refused write
    expect(buildProbeProfile(Array.from({ length: 9 }, (_, i) => ({ key: `task${i}`, passed: true })))).toBeNull();
  });

  it('is deterministic and does not alias the results it was handed', () => {
    const first = JSON.stringify(buildProbeProfile(allPass));
    for (let i = 0; i < 10; i++) expect(JSON.stringify(buildProbeProfile(allPass))).toBe(first);
    const profile = buildProbeProfile(allPass);
    profile.tasks[0].key = 'mutated';
    expect(allPass[0].key).toBe('construct');
  });

  it('the version stamped with the profile is the exam version, semver-shaped for the column', () => {
    expect(PROBE_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    expect(MIGRATION_191).toMatch(/probe_version\s+text\s*\n?\s*check \(probe_version is null or probe_version ~/);
  });
});

// ── Layer 9: the COACHING renderer's walls (wave L-7a) ──────────────────────
//
// modelCoaching.ts is executed for real Deno-side (supabase/functions/_shared/
// modelCoaching.test.ts). What lives here is what only this side can see: the binding
// between the renderer's frozen table and the probe's live vocabularies, the binding
// between both and migration 191's SQL, and the source scan that makes the
// conflicted-witness rule structural on the return leg.

describe('modelCoaching — the drift wall binding the table to the live exam (L-7a)', () => {
  it('the table names exactly the exam tasks, in the exam order', () => {
    expect(Object.keys(COACHING_TABLE)).toEqual([...PROBE_TASK_KEYS]);
  });

  it('every task has a sentence for every declared reason class, and no extra ones', () => {
    for (const task of PROBE_TASK_KEYS) {
      expect(Object.keys(COACHING_TABLE[task]).sort(), `${task} row`).toEqual([...PROBE_REASON_CLASSES].sort());
    }
  });

  it('the four reason classes are spelled identically in the module, the exam, and the SQL', () => {
    for (const reason of PROBE_REASON_CLASSES) {
      expect(MODEL_COACHING, `${reason} missing from the coaching table`).toContain(reason);
      expect(MIGRATION_191, `${reason} missing from the setter wall`).toContain(reason);
    }
    // and the SQL admits no fifth class the other two have not heard of
    const sqlClasses = MIGRATION_191.match(/'no_output','unsupported_emitted','dropped_at_wall','below_floor'/);
    expect(sqlClasses, 'the setter must enumerate exactly the declared classes').not.toBeNull();
  });

  it('END TO END: three real answers grade, persist as a profile, and render as coaching', () => {
    const results = [
      gradeProbeTask('construct', GOOD.construct),
      gradeProbeTask('customContent', JSON.stringify({ entries: [{ bucket: 'institutions', fields: { name: 'Mill', mood: 'declining' } }] })),
      gradeProbeTask('interpret', '{"ops":[]}'),
    ];
    const profile = buildProbeProfile(results);
    // Each surface is shown ONLY the verdict its own validators produced, so the block's
    // header claim ("the same validators that will grade this answer") is literally true.
    const content = renderCoachingBlock(profile, 'customContent').split('\n');
    expect(content[0]).toBe(COACHING_HEADER);
    expect(content).toHaveLength(2);
    expect(content[1]).toBe(COACHING_TABLE.customContent.unsupported_emitted);

    const interpret = renderCoachingBlock(profile, 'interpret').split('\n');
    expect(interpret).toHaveLength(2);
    expect(interpret[1]).toBe(COACHING_TABLE.interpret.no_output);

    // the task the model PASSED renders nothing on its own surface...
    expect(renderCoachingBlock(profile, 'construct')).toBe('');
    // ...and no surface anywhere is shown another surface's finding
    for (const surface of ['construct', 'customContent', 'interpret', 'styleOverhaul', 'autonomy']) {
      const block = renderCoachingBlock(profile, surface);
      const foreign = [
        ...(surface === 'customContent' ? [] : [COACHING_TABLE.customContent.unsupported_emitted]),
        ...(surface === 'interpret' ? [] : [COACHING_TABLE.interpret.no_output]),
        COACHING_TABLE.construct.below_floor,
      ];
      for (const line of foreign) expect(block, `${surface} carried a foreign verdict`).not.toContain(line);
    }
  });

  it('a clean sweep and an absent profile are both silence (inert by absence)', () => {
    const allPass = PROBE_TASK_KEYS.map((key) => gradeProbeTask(key, GOOD[key]));
    for (const surface of ['construct', 'customContent', 'interpret', 'styleOverhaul', 'autonomy']) {
      expect(renderCoachingBlock(buildProbeProfile(allPass), surface)).toBe('');
      expect(renderCoachingBlock(buildProbeProfile([]), surface)).toBe('');   // null profile
    }
  });

  it('SOURCE PIN: the renderer never reads a model self-report field', () => {
    // The conflicted-witness rule on the RETURN leg. The graders are already pinned this
    // way above; a self-tag that cannot score is still a self-tag if it gets read back to
    // the model as coaching, so the same wall stands on the way out.
    for (const selfTag of ['rider', 'musings', 'confidence', 'rationale', 'sourced', 'unsupported[']) {
      expect(MODEL_COACHING, `modelCoaching must not mention ${selfTag}`).not.toContain(selfTag);
    }
    expect(MODEL_COACHING).not.toMatch(/self[- ]?assess|rate yourself|how (well|confident)/i);
  });

  it('SOURCE PIN: the block is built only from this module literals (no interpolation)', () => {
    // Every returned line is a table value or the heading. A template literal in the
    // render path would be the one way a stored string could reach a prompt.
    // Comments are stripped first: the pin is about the CODE, and a docblock that quotes an
    // identifier in backticks is prose, not an interpolation site. Without the strip this
    // assertion reds on documentation, which teaches the next author to delete the docs.
    const renderBody = MODEL_COACHING
      .slice(MODEL_COACHING.indexOf('export function renderCoachingBlock'))
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/[^\n]*/g, '');
    expect(renderBody.length, 'guard the guard: the render body was found').toBeGreaterThan(100);
    expect(renderBody, 'no template literal in the render path').not.toContain('`');
    expect(renderBody).toContain('COACHING_TABLE[task][reason]');
    // the model gate is part of the render path and must be equally literal-only
    expect(renderBody, 'renderCoachingFor must be in the scanned region').toContain('export function renderCoachingFor');
  });
});
