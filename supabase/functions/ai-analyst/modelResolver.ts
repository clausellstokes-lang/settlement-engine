/**
 * ai-analyst/modelResolver.ts - THE CAPTURED-MODEL RESOLVER (wave L-3a of
 * docs/DESIGN_AI_CAPABILITY_LADDER.md §3, piece 3: "the ladder").
 *
 * WHAT THIS REPLACES. Nine Surveyor edge surfaces each carried a byte-identical copy of
 * one expression:
 *
 *   capturedModel = (providerKey.byok && capturedModelPref
 *     && ANTHROPIC_SUPPORTED_MODELS.includes(capturedModelPref))
 *     ? capturedModelPref : <SURFACE>_MODEL;
 *
 * Nine copies of a rule is nine places for it to drift, and the design survey named it
 * "one extraction away from a shared tier resolver". This module is that extraction and
 * nothing more: same inputs, same model, on every surface. The copy-paste cannot regrow -
 * tests/edgeFunctions/edgeModelDefaultsCensus.test.js asserts that no other file under
 * supabase/functions carries the inline membership test.
 *
 * STRICTLY BEHAVIOR-NEUTRAL (the whole point of L-3a):
 *   - The preference is honoured ONLY when the key is the user's own (byok) AND the
 *     preference is a member of ANTHROPIC_SUPPORTED_MODELS by PLAIN Array.includes.
 *   - Membership stays plain, NOT family-aware. `intersectModels` (analystCore.ts) is
 *     family-aware and this is not, and that difference is the D2 seam recorded in
 *     src/domain/modelRegistry.js: a dated build id such as claude-haiku-4-5-20251001
 *     is refused here and offered by the picker. Closing D2 changes which model a real
 *     user gets, so it is an OWNER decision, deliberately NOT taken by this extraction.
 *   - Anything else - a managed (server-key) request, an absent preference, an empty
 *     string, an unknown id - falls back to the surface's own default, verbatim and
 *     unvalidated, exactly as the nine copies did.
 *
 * WHERE THE PREFERENCE COMES FROM (precedence law, preserved): each surface reads it from
 * `model_prefs` on the `surveyor_usage_precheck` RPC result, which is DATABASE state. It is
 * never read from the request body. This module takes the already-read value and decides
 * nothing about its provenance.
 *
 * TIER CLASS IS READ-ONLY EXPOSURE. `tierClass` is returned so the ladder's later waves
 * (and any audit surface that grows a home for it) can see which rung a call actually ran
 * on. Nothing in this module or in any caller gates on it today. `null` for an id the
 * mirror does not carry is deliberate: a model nobody has classified has no ceiling to
 * report, and inventing one would be exactly the flattening the ladder exists to prevent.
 * An unknown id can genuinely occur - every surface default is
 * `Deno.env.get('...') || '<literal>'`, so a deployment can serve an id no literal carries
 * (the D6 class in the registry docblock).
 */
import { ANTHROPIC_SUPPORTED_MODELS } from './analystCore.ts';

/** The ladder's three rungs, matching src/domain/modelRegistry.js TierClass. */
export type TierClass = 'fast' | 'balanced' | 'deep';

/** The ladder's three rungs in the SPEC's vocabulary (L-3b working names; naming is an
 *  owner taste pick). `TierClass` is what the registry calls a model; `LadderTier` is what
 *  the ladder calls the rung it sits on. */
export type LadderTier = 'scout' | 'journeyman' | 'master';

/**
 * class → rung, declared ONCE. It lived in _shared/repairLoop.ts through wave L-6, which
 * was the only consumer; L-WIRE adds a second (the thinking dial below), and two literal
 * copies of a three-row map is exactly the drift this module exists to prevent. repairLoop
 * re-exports it, so every existing importer and pin is unaffected.
 */
export const TIER_BY_CLASS: Readonly<Record<TierClass, LadderTier>> = Object.freeze({
  deep: 'master',
  balanced: 'journeyman',
  fast: 'scout',
});

/**
 * HOW MUCH DELIBERATION ROOM EACH RUNG GETS. ALL ZEROS ON PURPOSE.
 *
 * THE SHAPE THE OWNER RULED FOR (§4c ↻, 2026-07-27): thinking room is a TIER PROPERTY, not
 * a per-request negotiation. The budget applies on every call at that rung and the provider
 * bills only the thinking tokens actually spent, so a rung that rarely needs to deliberate
 * costs what it always did. The rejected alternative was a two-pass shape where the model
 * flags its own request as deep, which spends a probe call and edges toward the
 * self-assessment the conflicted-witness rule forbids.
 *
 * Shipping at zero makes this wave inert: `thinkingClause` (_shared/aiOutputTool.ts) emits
 * NO key at a zero budget, so the serialized request body is byte-identical to the
 * pre-L-WIRE one. INTENDED at activation: { scout: 0, journeyman: 4000, master: 16000 }.
 * Activation is OWNER-GATED and batched with M5 and REPAIR_ROUNDS_BY_TIER, because all
 * three spend the user's provider tokens and are therefore one decision, not three.
 *
 * ⚠⚠ ACTIVATION BLOCKER, FOUND WHILE BUILDING THIS AND RECORDED RATHER THAN LEFT AS A
 * LANDMINE. The request shape the clause emits, `thinking: {type:'enabled', budget_tokens}`,
 * is NOT accepted by every model ANTHROPIC_TIER_CLASS above can resolve:
 *   - the Sonnet and Haiku ids ('claude-sonnet-4-5', 'claude-haiku-4-5' and its dated
 *     twin) take it as written;
 *   - 'claude-opus-4-8' REJECTS it with a 400. A fixed thinking budget was withdrawn on
 *     that class in favour of adaptive thinking plus an effort level, and the withdrawal
 *     is an error rather than a silent no-op.
 * The rung that would be hit is 'master' (deep → master), which is the single rung the
 * whole escalation exists to serve, so activating this dial as-is would 400 exactly the
 * calls it was meant to improve. Nothing is broken today: at zero the key is never sent,
 * and an executed pin holds the request byte-identical.
 * WHAT ACTIVATION OWES, in order: (1) decide the per-model shape, which is an owner call
 * because adaptive thinking has no token budget at all and so re-opens the ladder's
 * "budget per rung" premise; (2) re-verify that a forced `tool_choice` and thinking are
 * accepted together on each model, since the two features constrain each other on some
 * providers and this wave forces a tool on every compile call; (3) only then raise these
 * numbers. Recorded so nobody re-finds it as a bug.
 */
export const THINKING_BUDGET_BY_TIER: Readonly<Record<LadderTier, number>> = Object.freeze({
  scout: 0,
  journeyman: 0,
  master: 0,
});

/**
 * Thinking budget for a resolved tier class. A NULL class (a model id the registry mirror
 * does not carry, which a `Deno.env.get(...) || literal` default can genuinely produce)
 * gets ZERO, exactly as repairRoundsForTierClass does: an unclassified model has not earned
 * a ceiling, and inventing one is the flattening the ladder exists to prevent.
 */
export function thinkingBudgetForTierClass(tierClass: TierClass | null | undefined): number {
  if (!tierClass) return 0;
  const tier = TIER_BY_CLASS[tierClass];
  if (!tier) return 0;
  return THINKING_BUDGET_BY_TIER[tier] ?? 0;
}

/** Which side of the rule produced the model: the user's stored preference, or the
 *  surface's own default. 'default' covers BOTH "no preference" and "preference refused". */
export type ModelSource = 'pref' | 'default';

export interface ResolvedModel {
  /** The model id to call. Identical to what the copy-pasted expression produced. */
  model: string;
  source: ModelSource;
  /** The mirror's rung for `model`, or null when the mirror does not carry that id. */
  tierClass: TierClass | null;
}

/**
 * A LITERAL MIRROR of the anthropic-provider projection of src/domain/modelRegistry.js
 * (`{ id: tierClass }` for every entry whose provider is 'anthropic').
 *
 * WHY A MIRROR AND NOT AN IMPORT: Deno edge functions cannot import from src/. The repo
 * sanctions exactly two workarounds for that barrier - a generated bundle, or a literal
 * mirror plus a drift test - and this is the second. The drift test is
 * tests/config/modelRegistryAgreement.test.js, which parses this object out of this file
 * and asserts it equals the registry projection in BOTH directions, so a new anthropic
 * registry entry, a removed one, or a changed tierClass all red until this map follows.
 *
 * OpenAI ids are deliberately absent: no OpenAI adapter is registered anywhere in the tree
 * and MODEL_PROFILES records no retention posture for them (the D3 class, TODO-OWNER), and
 * none of them is reachable through this chokepoint in any case.
 */
export const ANTHROPIC_TIER_CLASS: Readonly<Record<string, TierClass>> = Object.freeze({
  'claude-haiku-4-5': 'fast',
  'claude-haiku-4-5-20251001': 'fast',
  'claude-opus-4-8': 'deep',
  'claude-sonnet-4-5': 'balanced',
  'claude-sonnet-4-6': 'balanced',
});

/**
 * Is this stored preference a model the adapter will actually accept? The ONE place the
 * allowlist membership test is written, so no surface has to spell it again.
 *
 * Membership is PLAIN, never family-aware (the D2 seam above). A null, undefined, or empty
 * preference is not a preference, which reproduces the truthiness test the nine copies used.
 *
 * Exported for surfaces that need the predicate WITHOUT the default-fallback shape, for
 * example picking the first acceptable preference out of several task keys.
 */
export function isSupportedModelPref(modelPref: string | null | undefined): boolean {
  const pref = typeof modelPref === 'string' ? modelPref : '';
  return pref.length > 0 && ANTHROPIC_SUPPORTED_MODELS.includes(pref);
}

/**
 * Resolve the model a request actually calls, plus how it was chosen and which rung it
 * sits on. Pure: no clock, no rng, no IO, no throw.
 *
 * @param args.byok           true when the provider key is the USER's own decrypted key
 * @param args.modelPref      the user's stored per-feature preference, or null
 * @param args.surfaceDefault the surface's own model constant (env-overridable literal)
 */
export function resolveCapturedModel(
  args: { byok: boolean; modelPref: string | null; surfaceDefault: string },
): ResolvedModel {
  const { byok, modelPref, surfaceDefault } = args;
  const honoured = byok === true && isSupportedModelPref(modelPref);
  const model = honoured ? String(modelPref) : surfaceDefault;
  return {
    model,
    source: honoured ? 'pref' : 'default',
    tierClass: ANTHROPIC_TIER_CLASS[model] ?? null,
  };
}
