/**
 * config/tierFacts.js — the ONE derived source of tier ENTITLEMENT FACTS the
 * conversion surfaces render.
 *
 * Why this exists: the same tier claims (save caps, anon size ceiling, PDF-export
 * rules, custom-content gate, Founder seat count) were hand-written into six
 * places — AuthModal, the HomeHero at-cap upsell, HowToUse, AccountSubscription-
 * Section, the pricing copy, and the gallery/GenerateWizard upsells — and drifted:
 * "10 saves" vs 3, "unlimited drafts" vs 3, custom content billed as free, PDF
 * export billed as premium-only, "500" Founder seats vs 30. Every one of those is
 * a paid-surface honesty bug on the exact screen where a visitor decides to pay.
 *
 * This module holds each fact ONCE, derived from the established single sources —
 * config/pricing.js (TIERS + SINGLE_DOSSIER) and lib/founderSeats.js — so a
 * surface can never restate a number the catalog didn't. A contract test
 * (tests/config/tierFacts.contract.test.js) pins these facts to the ENFORCEMENT
 * gate (store/authSlice.js TIER_GATE) so display and enforcement can never split,
 * and walks the surface files to forbid a raw tier-fact literal creeping back in.
 *
 * Kept dependency-light on purpose: it imports only config/pricing.js, so pulling
 * it into a first-paint surface (AuthModal / HomeHero) adds no new module to the
 * closure.
 */

import { TIERS, SINGLE_DOSSIER } from './pricing.js';

// Size-token → display label. `capital` is the catalog's top size token; it reads
// as "Metropolis" to the reader (the size ladder's last rung). Anon alone is
// capped at Town (the no-account funnel ceiling); a free account unlocks every
// size. Pinned to TIER_GATE.{tier}.maxTier by the contract test.
const SIZE_LABEL = Object.freeze({
  thorp: 'Thorp', hamlet: 'Hamlet', village: 'Village',
  town: 'Town', city: 'City', capital: 'Metropolis', metropolis: 'Metropolis',
});

// Anonymous (no-account) size ceiling. The gate's source is TIER_GATE.anon.maxTier
// ('town'); held here for the display layer and pinned to it by the contract test.
export const ANON_MAX_TIER = 'town';
export const ANON_MAX_SIZE_LABEL = SIZE_LABEL[ANON_MAX_TIER];

// PDF-export posture (owner ruling 2026-07-13): only premium exports FREELY and
// without limit ('unlimited'); anon + free pay per dossier ($2.99, the single-
// dossier ladder) — 'per_dossier'. Pinned to TIER_GATE.{tier}.export by the
// contract test (unlimited ⇔ export:true, per_dossier ⇔ export:false).
const EXPORT_MODE = Object.freeze({ anon: 'per_dossier', free: 'per_dossier', premium: 'unlimited' });

// Custom Compendium content is a premium (Cartographer) capability — never free.
// Pinned to TIER_GATE.{tier}.customContent by the contract test.
const CUSTOM_CONTENT = Object.freeze({ anon: false, free: false, premium: true });

/**
 * Per-tier display facts, keyed by the stored auth tier value ('anon' | 'free' |
 * 'premium'). saveLimit / maxSizeLabel derive straight from the pricing catalog;
 * exportMode + customContent from the ruling above. The contract test asserts each
 * agrees with the authSlice enforcement gate.
 *
 * @typedef {{ key: string, saveLimit: number, maxSizeLabel: string, exportMode: 'unlimited'|'per_dossier', customContent: boolean }} TierFacts
 * @type {Readonly<Record<'anon'|'free'|'premium', TierFacts>>}
 */
export const TIER_FACTS = Object.freeze({
  anon: Object.freeze({
    key: 'anon',
    saveLimit: 0,                                    // no account ⇒ no saves
    maxSizeLabel: ANON_MAX_SIZE_LABEL,
    exportMode: EXPORT_MODE.anon,
    customContent: CUSTOM_CONTENT.anon,
  }),
  free: Object.freeze({
    key: 'free',
    saveLimit: TIERS.wanderer.saveLimit,             // 3
    maxSizeLabel: SIZE_LABEL[TIERS.wanderer.maxSize], // Metropolis (every size)
    exportMode: EXPORT_MODE.free,
    customContent: CUSTOM_CONTENT.free,
  }),
  premium: Object.freeze({
    key: 'premium',
    saveLimit: TIERS.cartographer.saveLimit,         // Infinity (unlimited)
    maxSizeLabel: SIZE_LABEL[TIERS.cartographer.maxSize],
    exportMode: EXPORT_MODE.premium,
    customContent: CUSTOM_CONTENT.premium,
  }),
});

/** Free-tier save cap (3) — the single number the "3 saves" surfaces render. */
export const FREE_SAVE_LIMIT = TIER_FACTS.free.saveLimit;

/**
 * Founder Lifetime seat count (30). Sourced from the pricing catalog's
 * TIERS.founder.seatLimit; the contract test pins it equal to
 * lib/founderSeats.FOUNDER_SEAT_CAP (the RPC-clamp constant) and to the server's
 * create-checkout FOUNDER_SEAT_LIMIT, so the "X of 30 seats" scarcity claim can
 * never drift from what the server actually enforces.
 */
export const FOUNDER_SEATS = TIERS.founder.seatLimit;

/** Single-dossier PDF price label ('$2.99') — the free-tier per-dossier export. */
export const SINGLE_DOSSIER_PRICE = SINGLE_DOSSIER.priceLabel;
