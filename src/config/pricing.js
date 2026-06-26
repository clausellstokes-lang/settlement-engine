/**
 * config/pricing.js — Single source of truth for all pricing data.
 *
 * Everything related to "what costs what" lives here:
 *   - Credit pack catalog (legacy + repriced; flag selects active set)
 *   - AI feature credit costs (legacy + repriced; flag selects active set)
 *   - Subscription tiers (Wanderer / Cartographer / Founder Lifetime)
 *   - Single-dossier microtransaction
 *
 * Why a single file: today the same numbers live in
 *   - src/lib/stripe.js PRODUCTS map (client display)
 *   - src/store/creditsSlice.js CREDIT_COSTS (client pre-flight)
 *   - supabase/functions/create-checkout PRICE_MAP (server billing)
 *   - supabase/functions/generate-narrative cost gate (server enforcement)
 *   - the marketing FAQ
 *
 * Five copies = five places to forget when prices change. This file
 * becomes the one place client code reads. Server functions still need
 * to enforce their own canonical costs (defense in depth), but they
 * should match what this file declares. A `pricing.contract.test.js`
 * keeps the drift visible.
 *
 * Stripe is the ultimate source for actual charged prices — we own the
 * metadata (credits per pack, AI cost per feature) and the display
 * strings; Stripe owns the dollar amounts.
 *
 * The repriced schedules, Founder tier, and single-dossier one-shot all
 * shipped unconditionally — their roll-out flags were removed once soaked.
 * The legacy pack + AI-cost maps are retained below: not as a rollback
 * path, but so historical SKUs still resolve (findPackByKey) and the
 * server contract test can pin both schedules independently.
 */

// ── Credit pack catalogs ──────────────────────────────────────────────────
// Each pack has a stable key (= Stripe product id stub used by the
// edge function), a credit count, a display price, and a discount label.
// `perCredit` is derived for the UI tile.

const LEGACY_PACKS = Object.freeze({
  credits_5:  { key: 'credits_5',  name: '5 Narrative Credits',  price: '$4.99',  credits: 5,  perCredit: '$1.00', discount: null,      tier: 'starter' },
  credits_15: { key: 'credits_15', name: '15 Narrative Credits', price: '$9.99',  credits: 15, perCredit: '$0.67', discount: '33% off', tier: 'value'   },
  credits_40: { key: 'credits_40', name: '40 Narrative Credits', price: '$19.99', credits: 40, perCredit: '$0.50', discount: '50% off', tier: 'best'    },
});

// New, more generous packs — designed around the repriced narrative
// costs (3/4/5 per feature). 25 credits ≈ 7 narratives or 5 daily-lifes.
const NEW_PACKS = Object.freeze({
  credits_25:  { key: 'credits_25',  name: '25 Narrative Credits',  price: '$4.99',  credits: 25,  perCredit: '$0.20', discount: null,      tier: 'starter' },
  credits_60:  { key: 'credits_60',  name: '60 Narrative Credits',  price: '$9.99',  credits: 60,  perCredit: '$0.17', discount: '17% off', tier: 'value'   },
  credits_150: { key: 'credits_150', name: '150 Narrative Credits', price: '$19.99', credits: 150, perCredit: '$0.13', discount: '34% off', tier: 'best'    },
});

// ── AI feature cost schedules ─────────────────────────────────────────────
// Mirrored on the server (supabase/functions/generate-narrative/index.ts
// CREDIT_COSTS). Keep server + client in lockstep — a contract test
// catches drift before it ships.

const LEGACY_AI_COSTS = Object.freeze({
  narrative:   8,
  dailyLife:   10,
  progression: 12,
});

const NEW_AI_COSTS = Object.freeze({
  narrative:   3,
  dailyLife:   4,
  progression: 5,
});

const FAST_AI_COSTS = Object.freeze({
  narrative:   2,
  dailyLife:   3,
  progression: 4,
});

// Chronicle is a fixed flat cost, NOT part of the model-tiered narrative
// schedules: the season-chronicle pass always runs on Haiku and charges the
// same 2 credits regardless of the user's model preference. This is the single
// client-side source of truth, pinned in lockstep with three server copies by
// pricing.test.js — the generate-chronicle CHRONICLE_COST constant and the
// spend_credits SQL CASE 'chronicle' branch (migration 057). Drift fails the gate.
// @enforced-by tests/config/pricing.test.js
export const CHRONICLE_CREDIT_COST = 2;

export const DEFAULT_MODEL_PREFERENCE = 'anthropic_claude_opus_4_8';

export const AI_MODEL_OPTIONS = Object.freeze([
  {
    key: 'anthropic_claude_opus_4_8',
    label: 'Claude Opus 4.8',
    provider: 'anthropic',
    model: 'claude-opus-4-8',
    speed: 'premium',
    costTier: 'standard',
  },
  {
    key: 'anthropic_claude_sonnet_4_6',
    label: 'Claude Sonnet 4.6',
    provider: 'anthropic',
    model: 'claude-sonnet-4-6',
    speed: 'balanced',
    costTier: 'standard',
  },
  {
    key: 'anthropic_claude_haiku_4_5',
    label: 'Claude Haiku 4.5',
    provider: 'anthropic',
    model: 'claude-haiku-4-5-20251001',
    speed: 'fast',
    costTier: 'fast',
  },
  {
    key: 'openai_gpt_5_2',
    label: 'OpenAI GPT-5.2',
    provider: 'openai',
    model: 'gpt-5.2',
    speed: 'premium',
    costTier: 'standard',
  },
  {
    key: 'openai_gpt_5_mini',
    label: 'OpenAI GPT-5 mini',
    provider: 'openai',
    model: 'gpt-5-mini',
    speed: 'fast',
    costTier: 'fast',
  },
  {
    key: 'openai_gpt_5_nano',
    label: 'OpenAI GPT-5 nano',
    provider: 'openai',
    model: 'gpt-5-nano',
    speed: 'fastest',
    costTier: 'fast',
  },
  {
    key: 'openai_gpt_4_1',
    label: 'OpenAI GPT-4.1',
    provider: 'openai',
    model: 'gpt-4.1',
    speed: 'legacy',
    costTier: 'standard',
  },
  {
    key: 'openai_gpt_4_1_mini',
    label: 'OpenAI GPT-4.1 mini',
    provider: 'openai',
    model: 'gpt-4.1-mini',
    speed: 'legacy-fast',
    costTier: 'fast',
  },
]);

export const AI_MODEL_ALIASES = Object.freeze({
  claude_best: 'anthropic_claude_opus_4_8',
  claude_fast: 'anthropic_claude_haiku_4_5',
  chatgpt_best: 'openai_gpt_5_2',
  chatgpt_fast: 'openai_gpt_5_mini',
});

export function normalizeModelPreference(value) {
  const key = AI_MODEL_ALIASES[value] || value;
  return AI_MODEL_OPTIONS.some(option => option.key === key) ? key : DEFAULT_MODEL_PREFERENCE;
}

export function isFastModelPreference(value) {
  const key = normalizeModelPreference(value);
  const option = AI_MODEL_OPTIONS.find(item => item.key === key);
  return option?.costTier === 'fast';
}

// ── Subscription tiers ────────────────────────────────────────────────────
// The flag layer controls which name renders (tierRenames). The plan
// shape is stable across both naming schemes — only the label changes.

export const TIERS = Object.freeze({
  wanderer: Object.freeze({
    key:          'wanderer',
    legacyKey:    'free',
    stripeProduct: null,                  // no charge
    priceCents:   0,
    billing:      'forever',
    seatLimit:    null,                   // unlimited seats
    saveLimit:    3,
    maxSize:      'metropolis',           // free ACCOUNTS generate any size up to
                                          // metropolis — size is NOT a paywall. The
                                          // premium product is the living simulation
                                          // (advance-time/campaigns/custom content),
                                          // never settlement size. (Anon still caps
                                          // at town — see authSlice TIER_GATE — so a
                                          // free account is what unlocks full size.)
    features: {
      neighbourhoodSystem: false,
      pdfExport:           true,
      jsonExport:          false,
      supplyChainMap:      false,
      founderBadge:        false,
    },
  }),
  cartographer: Object.freeze({
    key:          'cartographer',
    legacyKey:    'premium',
    stripeProduct: 'premium',             // existing premium SKU
    priceCents:   600,                    // $6/mo
    billing:      'monthly',
    monthlyCredits: 30,
    seatLimit:    null,
    saveLimit:    Infinity,
    maxSize:      'metropolis',           // size is not a premium lever; free reaches it too
    features: {
      neighbourhoodSystem: true,
      pdfExport:           true,
      jsonExport:          true,
      supplyChainMap:      true,
      founderBadge:        false,
    },
  }),
  founder: Object.freeze({
    key:          'founder',
    legacyKey:    'founder',
    stripeProduct: 'founder_lifetime',    // new one-time SKU
    priceCents:   9900,                   // $99 one-time
    billing:      'lifetime',
    oneTimeCredits: 30,
    seatLimit:    500,
    saveLimit:    Infinity,
    maxSize:      'metropolis',           // size is not a premium lever; free reaches it too
    features: {
      neighbourhoodSystem: true,
      pdfExport:           true,
      jsonExport:          true,
      supplyChainMap:      true,
      founderBadge:        true,
    },
  }),
});

// ── Single-dossier microtransaction ───────────────────────────────────────
export const SINGLE_DOSSIER = Object.freeze({
  key:           'single_dossier',
  stripeProduct: 'single_dossier',
  priceCents:    299,                     // $2.99
  priceLabel:    '$2.99',
  deliverables:  ['pdf'],
  requiresAccount: false,                 // can be claimed without signup
});

// ── Active-set selectors ───────────────────────────────────────────────────
// Components and slices call these — they never reach for the raw maps.
// The roll-out flags were removed once soaked; the selectors now return
// the shipped (repriced) set unconditionally. Legacy maps are kept only
// for historical SKU resolution + the server contract test.

// Tier display-name map. Matches the UI Redesign PDF. Accepts both the
// legacy stored keys ('free' / 'premium') and the redesigned keys so the
// helper resolves regardless of how a row was written.
const TIER_LABELS_REDESIGN = Object.freeze({
  free:         'Wanderer',
  wanderer:     'Wanderer',
  premium:      'Cartographer',
  cartographer: 'Cartographer',
  founder:      'Founder Lifetime',
});

/**
 * Pretty display name for a stored tier value. Accepts both the legacy
 * stored values ('free' / 'premium') and the redesigned names so the
 * helper works regardless of how the row got written.
 */
export function getTierDisplayName(rawTier) {
  if (!rawTier) return '';
  return TIER_LABELS_REDESIGN[String(rawTier).toLowerCase()] ?? String(rawTier);
}

/** Active credit pack catalog (the repriced set). */
export function getActivePacks() {
  return NEW_PACKS;
}

/** Active AI cost schedule (the repriced set). */
export function getActiveAiCosts() {
  return NEW_AI_COSTS;
}

/** Cost in credits for a specific AI feature. */
export function getAiCost(feature) {
  // Chronicle is a flat, model-independent cost — it lives outside the tiered
  // narrative schedules but still resolves through the same selector so UI code
  // never reaches for a raw constant.
  if (feature === 'chronicle') return CHRONICLE_CREDIT_COST;
  return getActiveAiCosts()[feature] ?? 0;
}

/** Cost in credits for a feature under the selected AI model preference. */
export function getAiCostForModel(feature, modelPreference) {
  const schedule = isFastModelPreference(modelPreference) ? FAST_AI_COSTS : getActiveAiCosts();
  return schedule[feature] ?? getAiCost(feature);
}

/** Which tiers should appear in pricing UI. */
export function getVisibleTiers() {
  return [TIERS.wanderer, TIERS.cartographer, TIERS.founder];
}

/** Whether the single-dossier microtransaction is offered. */
export function singleDossierEnabled() {
  return true;
}

// ── Stripe product → catalog reverse lookup ───────────────────────────────
// Edge functions key by Stripe product id; the client sometimes needs to
// map back (e.g., webhook handler describing a purchase in the UI).

/**
 * Look up a pack by its stripe key in EITHER catalog (so historical
 * webhooks for legacy SKUs still resolve to a display row).
 */
export function findPackByKey(key) {
  return LEGACY_PACKS[key] || NEW_PACKS[key] || null;
}

// ── Raw maps (testing + admin tooling only) ───────────────────────────────
// Product code should use the selectors above. Exposing the raw maps
// lets the contract test verify both schedules independently and lets
// the admin panel show "all SKUs ever sold" without reaching through
// flags.
export const _internal = Object.freeze({
  LEGACY_PACKS, NEW_PACKS, LEGACY_AI_COSTS, NEW_AI_COSTS, FAST_AI_COSTS, AI_MODEL_ALIASES,
});
