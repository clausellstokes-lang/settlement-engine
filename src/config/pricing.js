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
 * Flags:
 *   `aiRepriced`    — switches AI cost schedule (8/10/12 → 3/4/5)
 *   `packsRepriced` — switches pack catalog (5/15/40 → 25/60/150)
 *   `founderTier`   — exposes the Founder Lifetime tier
 *   `singleDossier` — exposes the $2.99 one-shot
 */

import { flag } from '../lib/flags.js';

// ── Credit pack catalogs ──────────────────────────────────────────────────
// Each pack has a stable key (= Stripe product id stub used by the
// edge function), a credit count, a display price, and a discount label.
// `perCredit` is derived for the UI tile.

const LEGACY_PACKS = Object.freeze({
  credits_5:  { key: 'credits_5',  name: '5 AI Credits',  price: '$4.99',  credits: 5,  perCredit: '$1.00', discount: null,      tier: 'starter' },
  credits_15: { key: 'credits_15', name: '15 AI Credits', price: '$9.99',  credits: 15, perCredit: '$0.67', discount: '33% off', tier: 'value'   },
  credits_40: { key: 'credits_40', name: '40 AI Credits', price: '$19.99', credits: 40, perCredit: '$0.50', discount: '50% off', tier: 'best'    },
});

// New, more generous packs — designed around the repriced AI costs
// (3/4/5 per feature). 25 credits ≈ 7 narratives or 5 daily-lifes.
const NEW_PACKS = Object.freeze({
  credits_25:  { key: 'credits_25',  name: '25 AI Credits',  price: '$4.99',  credits: 25,  perCredit: '$0.20', discount: null,      tier: 'starter' },
  credits_60:  { key: 'credits_60',  name: '60 AI Credits',  price: '$9.99',  credits: 60,  perCredit: '$0.17', discount: '17% off', tier: 'value'   },
  credits_150: { key: 'credits_150', name: '150 AI Credits', price: '$19.99', credits: 150, perCredit: '$0.13', discount: '34% off', tier: 'best'    },
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
    maxSize:      'town',                 // anonymous now also gets town
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
    seatLimit:    null,
    saveLimit:    Infinity,
    maxSize:      'capital',
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
    seatLimit:    500,
    saveLimit:    Infinity,
    maxSize:      'capital',
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

// ── Active-set selectors (flag-driven) ────────────────────────────────────
// Components and slices call these — they never reach for the raw maps.
// When we kill the flags after a successful rollout, the selectors stay
// (returning the new map unconditionally) and the legacy map can be
// deleted in one place.

// Tier display-name maps. The `legacy` map matches what users saw
// before the rename ("Free", "Premium") and lets us flip back via the
// `tierRenames` flag without redeploying. The `redesign` map matches
// the UI Redesign PDF.
const TIER_LABELS_LEGACY = Object.freeze({
  free:    'Free',
  premium: 'Premium',
  founder: 'Founder',
});
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
 *
 * Honors `tierRenames` flag — when off, returns legacy names ("Free",
 * "Premium") so we can roll back the rename without a redeploy.
 */
export function getTierDisplayName(rawTier) {
  if (!rawTier) return '';
  const lookup = flag('tierRenames') ? TIER_LABELS_REDESIGN : TIER_LABELS_LEGACY;
  return lookup[String(rawTier).toLowerCase()] ?? String(rawTier);
}

/** Active credit pack catalog. Honors `packsRepriced` flag. */
export function getActivePacks() {
  return flag('packsRepriced') ? NEW_PACKS : LEGACY_PACKS;
}

/** Active AI cost schedule. Honors `aiRepriced` flag. */
export function getActiveAiCosts() {
  return flag('aiRepriced') ? NEW_AI_COSTS : LEGACY_AI_COSTS;
}

/** Cost in credits for a specific AI feature. */
export function getAiCost(feature) {
  return getActiveAiCosts()[feature] ?? 0;
}

/** Which tiers should appear in pricing UI. Honors `founderTier` flag. */
export function getVisibleTiers() {
  const base = [TIERS.wanderer, TIERS.cartographer];
  return flag('founderTier') ? [...base, TIERS.founder] : base;
}

/** Whether the single-dossier microtransaction is offered. */
export function singleDossierEnabled() {
  return flag('singleDossier');
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
  LEGACY_PACKS, NEW_PACKS, LEGACY_AI_COSTS, NEW_AI_COSTS,
});
