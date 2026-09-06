/**
 * config/pricingDisplay.js — W-DOC: the pricing page's display DERIVATIONS,
 * a LAZY-ONLY sibling of config/pricing.js (brief §3).
 *
 * Why a separate module: pricing.js rides the EAGER first-paint chunk
 * (tierFacts → AuthModal / HomeHero import it), so helpers placed there ship
 * to every visitor before a single page renders — measured +~700 B eager when
 * these lived in pricing.js. Only the lazy pricing chunk consumes these
 * derivations, so they live here and the eager closure stays at base.
 * Import law: EAGER surfaces must never import this module.
 *
 * Everything derives from config/pricing.js facts — no number originates here.
 */

import { getActivePacks, TIERS, _internal } from './pricing.js';

const SURVEYOR_AI_COSTS = _internal.SURVEYOR_AI_COSTS;


/** Parse a display price ('$4.99') to integer cents (499). Returns null on a
 *  malformed string rather than guessing — a caller rendering money must fail
 *  visibly, not silently show a wrong number. */
export function parsePriceCents(priceLabel) {
  const m = /^\$(\d+)(?:\.(\d{2}))?$/.exec(String(priceLabel).trim());
  if (!m) return null;
  return Number(m[1]) * 100 + (m[2] ? Number(m[2]) : 0);
}

/**
 * THE CREDIT-DOLLAR ANCHOR (brief §3 band 3): the one conversion sentence's
 * numbers, derived from the STARTER pack (the rate a first-time buyer actually
 * pays — quoting the discounted big-pack rate as "the" rate would be the exact
 * effective-rate gotcha the research corpus documents).
 * @returns {{ perCreditCents: number, perCreditLabel: string, packKey: string } | null}
 */
export function getCreditAnchor() {
  const packs = getActivePacks();
  const starter = Object.values(packs).find(p => p.tier === 'starter') || Object.values(packs)[0];
  if (!starter) return null;
  const cents = parsePriceCents(starter.price);
  if (cents == null || !starter.credits) return null;
  return {
    perCreditCents: cents / starter.credits,
    perCreditLabel: starter.perCredit,
    packKey: starter.key,
  };
}

/** ≈-dollar label for a task's flat credit cost at the anchor rate ("≈ $1.00"). */
export function approxDollarsForCredits(credits) {
  const anchor = getCreditAnchor();
  if (!anchor || !Number.isFinite(credits)) return null;
  const dollars = (credits * anchor.perCreditCents) / 100;
  return `≈ $${dollars.toFixed(2)}`;
}

/**
 * The Founder charter's arithmetic sentence, derived: how many months of
 * Cartographer the one-time price equals (ceil — never overstate the deal).
 */
export function getFounderBreakEvenMonths() {
  const founder = TIERS.founder.priceCents;
  const monthly = TIERS.cartographer.priceCents;
  if (!founder || !monthly) return null;
  return Math.ceil(founder / monthly);
}

/**
 * THE SURVEYOR SURFACE (brief §3 band 2 / ruling #3): the AI lane's display
 * config. Surveyor is NOT a subscription tier (getVisibleTiers stays three-way)
 * — it renders as the walled violet early-access band: task-priced credits +
 * BYOK. The task list derives from SURVEYOR_AI_COSTS (PROVISIONAL — final
 * Surveyor pricing is owner-queued; the page renders current truth).
 */
export const SURVEYOR_SURFACE = Object.freeze({
  key: 'surveyor',
  earlyAccess: true,
  byok: true,                       // bring-your-own-key is first-class (never buried)
  taskCosts: SURVEYOR_AI_COSTS,     // task key → flat credit cost
});
