/**
 * domain/modelRegistry.js — THE ONE MODEL REGISTRY (wave L-2a of
 * docs/DESIGN_AI_CAPABILITY_LADDER.md §3, piece 1).
 *
 * One frozen entry per DISTINCT MODEL ID reachable from any of the three model lists this
 * repo carries today. This module is ADDITIVE ONLY: it reads nothing, it is read by nothing
 * yet, and it edits none of the three lists. Wave L-2b rewires those lists (and their
 * mirror-drift tests) to assert against this registry; until then the registry's job is to
 * state, in one place and in writing, what the three lists actually say and exactly where
 * they disagree.
 *
 * WHY A REGISTRY AT ALL: `registerProviderAdapter` (ai-analyst/analystCore.ts) refuses to
 * register an adapter without a `retentionClass`, and the capability ladder needs a
 * `tierClass` per model so an Opus is not capped to a Fable's ceiling. Both facts are
 * per-MODEL facts, and today neither is stated anywhere that covers every model the tree can
 * actually serve. This module is that statement.
 *
 * PURITY / BUDGET: no transport, no React, no store, no side effects at import time, no
 * clock, no rng. This module must ONLY ever be LAZY-imported and must NEVER be statically
 * imported by any boot / first-paint module (the near-zero-eager posture that aiCharter.js,
 * correctionTypology.js, and opVocabulary.js carry). It is a frozen data leaf: it imports
 * nothing, so a static edge would cost only its own bytes, but the rule is uniform and the
 * lane it is destined for (the Surveyor dynamic-import lane, plus the generated edge bundle)
 * is a lazy one.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE THREE LISTS, AS MEASURED 2026-07-27
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   A. ANTHROPIC_SUPPORTED_MODELS + ANTHROPIC_RETENTION_CLASS
 *      supabase/functions/ai-analyst/analystCore.ts
 *      4 ids: claude-opus-4-8, claude-sonnet-4-6, claude-sonnet-4-5,
 *      claude-haiku-4-5.
 *      Retention posture is declared ONCE for the whole adapter: 'bounded'.
 *
 *   B. ROUTING_CLASS_MODEL
 *      src/config/aiTaskConfig.js
 *      3 ids, one per routing class: fast=claude-haiku-4-5, balanced=claude-sonnet-4-5,
 *      deep=claude-opus-4-8.
 *
 *   C. MODEL_PROFILES (+ MODEL_ALIASES)
 *      supabase/functions/generate-narrative/index.ts
 *      8 profiles, 3 Anthropic and 5 OpenAI, each carrying provider + costTier and three
 *      per-phase model ids (thesis / refinement / dailyLife).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE DISAGREEMENTS, RECORDED VERBATIM (each is a fact about the tree, not a fix)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   D1. SONNET GENERATION SPLIT — RESOLVED 2026-07-28. List A now accepts both
 *       'claude-sonnet-4-5' (the balanced routing default) and 'claude-sonnet-4-6'
 *       (the model list C actually serves). The BYOK picker no longer refuses a
 *       model the narrative endpoint can serve. The two literal versions remain
 *       distinct registry entries because their routing sources still differ.
 *
 *   D2. HAIKU DATED VERSUS UNDATED. Lists A and B say 'claude-haiku-4-5'. List C defaults
 *       to 'claude-haiku-4-5-20251001'. Same family, two literal ids. analystCore's
 *       `intersectModels` is family-aware and would match them, but the copy-pasted
 *       chokepoint expression is a plain `ANTHROPIC_SUPPORTED_MODELS.includes(pref)`,
 *       which would not. Both ids get their own entry here rather than being collapsed:
 *       collapsing would hide the exact seam L-2b has to close.
 *
 *   D3. OPENAI IS INVISIBLE TO THE RETENTION CONTRACT. `registerProviderAdapter` demands a
 *       retentionClass and THROWS without one, yet every registration in the tree passes
 *       ANTHROPIC_RETENTION_CLASS. No OpenAI adapter is registered anywhere. List C records
 *       provider and costTier for its five OpenAI profiles and records NO retention posture.
 *       The five OpenAI entries below therefore carry 'bounded' as the conservative floor,
 *       flagged TODO-OWNER: the real posture must be read off OpenAI's current terms at
 *       deploy, never from memory, exactly as list A's own comment instructs for Anthropic.
 *
 *   D4. TIER IS DECLARED IN ONE LIST ONLY, AND THE FALLBACK UNDER-DETERMINES IT. List B is
 *       the only tier statement in the tree, and it names exactly three ids. List C's
 *       costTier has two values ('standard', 'fast') and so cannot express a three-rung
 *       ladder: 'claude-opus-4-8' is costTier 'standard' and yet routes 'deep'. costTier
 *       can therefore identify the BOTTOM rung and never the top one.
 *
 *   D5. LIST C IS KEYED BY PREFERENCE KEY, NOT BY MODEL ID. Its keys are preference tokens
 *       (anthropic_claude_opus_4_8, openai_gpt_5_mini, and so on), with MODEL_ALIASES
 *       mapping claude_best / claude_fast / chatgpt_best / chatgpt_fast onto those keys. The
 *       model id is a VALUE inside the profile. This registry is keyed by MODEL ID; the
 *       preference-key layer stays where it is until L-2b.
 *
 *   D6. LIST C IDS ARE ENVIRONMENT-OVERRIDABLE. Every phase id is
 *       `Deno.env.get('...') || '<literal>'`. This registry records the LITERAL DEFAULT. A
 *       deployment that sets one of those variables can serve a model id this registry does
 *       not carry. Recorded, not resolved: closing it needs a deploy-time check, which is
 *       L-3 territory.
 *
 *   D7. NO LIST IMPORTS ANOTHER. The Deno-to-src import barrier is the root cause; today
 *       cross-list agreement is convention, enforced by no test. That is the whole reason
 *       this file is generated into an edge bundle rather than merely written down.
 *
 *   D8. THREE PHASES, ONE ID. List C declares thesis / refinement / dailyLife separately,
 *       and all eight profiles currently set the same id for all three phases. If they ever
 *       diverge, the divergent id needs its own entry here.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW tierClass WAS ASSIGNED (the inference is recorded, never silent)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   Rule 1 (MEASURED): an id named in ROUTING_CLASS_MODEL takes that routing class
 *           verbatim. Covers claude-opus-4-8 (deep), claude-sonnet-4-5 (balanced),
 *           claude-haiku-4-5 (fast).
 *   Rule 2 (INFERRED): otherwise, costTier 'fast' becomes tierClass 'fast'. Covers
 *           claude-haiku-4-5-20251001, gpt-5-mini, gpt-5-nano, gpt-4.1-mini.
 *   Rule 3 (INFERRED, CONSERVATIVE): otherwise, costTier 'standard' becomes 'balanced' and
 *           never 'deep', because of D4: costTier cannot see the top rung, and reading
 *           'deep' out of it would hand an unearned ceiling to a model nobody measured.
 *           Covers claude-sonnet-4-6, gpt-5.2, gpt-4.1.
 *
 *   Rule 3 is deliberately blunt, and the ladder design says why it is safe to be blunt: a
 *   tier is a CEILING, and the demonstrated-not-declared law (design §1.2) means the real
 *   assignment comes from the L-4 probe's measured pass-rate. A conservative floor here is
 *   corrected upward by evidence later; a generous guess here would never be corrected at
 *   all, because nothing would look wrong.
 *
 * WAVE SCOPE (L-2a, recorded): the registry and its bundle only. Rewiring lists A, B, and C
 * to import from here, and extending their mirror-drift tests to assert against it, is wave
 * L-2b, held until after the remediation fold because it touches tracked files across many
 * surfaces. Deliberately deferred, documented here, not a gap.
 */

/**
 * @typedef {'zero'|'bounded'|'training'} RetentionClass
 * @typedef {'fast'|'balanced'|'deep'} TierClass
 * @typedef {'anthropic'|'openai'} ProviderId
 * @typedef {'ANTHROPIC_SUPPORTED_MODELS'|'ROUTING_CLASS_MODEL'|'MODEL_PROFILES'} RegistrySource
 * @typedef {{ id: string, provider: ProviderId, retentionClass: RetentionClass,
 *             tierClass: TierClass, sources: readonly RegistrySource[] }} ModelRegistryEntry
 */

/** Bump when the registry's SHAPE or its assignment rules change. Adding or removing a model
 *  entry is a content change and moves the sourceHash of the generated bundle instead. */
export const REGISTRY_VERSION = '1.0.0';

/**
 * @param {string} id
 * @param {ProviderId} provider
 * @param {RetentionClass} retentionClass
 * @param {TierClass} tierClass
 * @param {RegistrySource[]} sources
 * @returns {ModelRegistryEntry}
 */
function entry(id, provider, retentionClass, tierClass, sources) {
  return Object.freeze({
    id,
    provider,
    retentionClass,
    tierClass,
    sources: Object.freeze([...sources].sort(byText)),
  });
}

/** Code-unit ordering, never locale-aware collation: the registry is destined for a
 *  byte-stable prompt prefix, and a locale-sensitive comparator would make its bytes depend
 *  on the runtime's locale data.
 *  @param {string} a @param {string} b @returns {number} */
function byText(a, b) {
  if (a < b) return -1;
  return a > b ? 1 : 0;
}

/** @type {ModelRegistryEntry[]} */
const ENTRIES = [
  // ── Anthropic ──────────────────────────────────────────────────────────────
  // retentionClass for all five: ANTHROPIC_RETENTION_CLASS ('bounded'), declared once for
  // the whole adapter in analystCore.ts. Its own comment requires re-verification against
  // Anthropic's current terms at deploy; 'bounded' is the conservative floor, not a reading.
  entry('claude-opus-4-8', 'anthropic', 'bounded', 'deep', [
    'ANTHROPIC_SUPPORTED_MODELS', 'ROUTING_CLASS_MODEL', 'MODEL_PROFILES',
  ]),
  entry('claude-sonnet-4-5', 'anthropic', 'bounded', 'balanced', [
    'ANTHROPIC_SUPPORTED_MODELS', 'ROUTING_CLASS_MODEL',
  ]),
  // D1 resolved: list C's Sonnet is also accepted by the BYOK picker.
  entry('claude-sonnet-4-6', 'anthropic', 'bounded', 'balanced', [
    'ANTHROPIC_SUPPORTED_MODELS', 'MODEL_PROFILES',
  ]),
  entry('claude-haiku-4-5', 'anthropic', 'bounded', 'fast', [
    'ANTHROPIC_SUPPORTED_MODELS', 'ROUTING_CLASS_MODEL',
  ]),
  // D2: the dated literal list C actually defaults to. Same family as claude-haiku-4-5.
  entry('claude-haiku-4-5-20251001', 'anthropic', 'bounded', 'fast', ['MODEL_PROFILES']),

  // ── OpenAI ─────────────────────────────────────────────────────────────────
  // D3, TODO-OWNER on every entry below: no OpenAI provider adapter is registered anywhere
  // in the tree, and MODEL_PROFILES records no retention posture. 'bounded' here is the
  // conservative floor pending an owner reading of OpenAI's current terms. Until that
  // reading lands, treat these as UNVERIFIED for any decision the retention class gates,
  // including the intent atlas ride-along rule (DESIGN_AI_INTENT_ATLAS.md §4.4).
  entry('gpt-5.2', 'openai', 'bounded', 'balanced', ['MODEL_PROFILES']),
  entry('gpt-5-mini', 'openai', 'bounded', 'fast', ['MODEL_PROFILES']),
  entry('gpt-5-nano', 'openai', 'bounded', 'fast', ['MODEL_PROFILES']),
  entry('gpt-4.1', 'openai', 'bounded', 'balanced', ['MODEL_PROFILES']),
  entry('gpt-4.1-mini', 'openai', 'bounded', 'fast', ['MODEL_PROFILES']),
];

/** @type {Record<string, ModelRegistryEntry>} */
const byId = {};
for (const e of [...ENTRIES].sort((a, b) => byText(a.id, b.id))) {
  byId[e.id] = e;
}

/**
 * Every distinct model id the three lists can reach, keyed by id, insertion-ordered by
 * code-unit sort so any rendering of this object is byte-stable.
 * @type {Readonly<Record<string, ModelRegistryEntry>>}
 */
export const MODEL_REGISTRY = Object.freeze(byId);

/**
 * Look one model id up. THROWS on an unknown id rather than returning undefined: a caller
 * that silently got no entry would fall through to whatever default sits behind it, which is
 * precisely the flattening the ladder exists to prevent, and it would do so invisibly.
 *
 * @param {string} id a model id, exactly as one of the three lists spells it
 * @returns {ModelRegistryEntry}
 */
export function registryEntry(id) {
  const key = typeof id === 'string' ? id : '';
  const found = MODEL_REGISTRY[key];
  if (!found) {
    throw new Error(
      `registryEntry: unknown model id "${String(id)}". Known ids: `
      + `${Object.keys(MODEL_REGISTRY).join(', ')}`,
    );
  }
  return found;
}
