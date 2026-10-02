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
// EXPORTED (2026-09-19, ODQ §934.24): the refusal sentences name the size a reader
// asked for and the ceiling their account reaches, and both must be the DISPLAY
// label, never the raw token — `capital` reads as "Metropolis". Total over every
// token TIER_GATE can hold, so a refusal can never print a bare tier id at a reader.
// ⚠ `thorp` READS AS "Thorpe" (2026-09-19). The wizard's own size list has always said
// so (copy/en.js `generate.sizes.thorp`), and this table said "Thorp" — two spellings of
// one rung, one of them on the refusal sentences lane 28 wired. The reader-facing label
// is the wizard's, so the two now agree; the TOKEN is untouched.
export const SIZE_LABEL = Object.freeze({
  thorp: 'Thorpe', hamlet: 'Hamlet', village: 'Village',
  town: 'Town', city: 'City', capital: 'Metropolis', metropolis: 'Metropolis',
});

// Anonymous (no-account) size ceiling. The gate's source is TIER_GATE.anon.maxTier
// ('town'); held here for the display layer and pinned to it by the contract test.
export const ANON_MAX_TIER = 'town';
export const ANON_MAX_SIZE_LABEL = SIZE_LABEL[ANON_MAX_TIER];

/**
 * THE SIZE LADDER, in the order the wizard offers it and spells it — the SAME six tokens
 * as copy/en.js `generate.sizes` and the hero's gauge, which is why the display layer can
 * read one ladder instead of three. (`capital` is the pricing catalog's synonym for the
 * top rung and resolves to the same label; it is not a seventh size.)
 * @type {ReadonlyArray<string>}
 */
export const SIZE_LADDER = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);

/**
 * ⛔ THE SIZES AN ANONYMOUS VISITOR ACTUALLY GETS (the owner, 2026-09-19: "a free account
 * unlocks THORPE as well — the anonymous tiers are hamlet, village, town").
 *
 * THIS IS A FACT THE GATE DOES NOT CARRY, AND THAT IS WHY IT IS WRITTEN DOWN HERE.
 * store/authSlice.js TIER_GATE expresses the anon cap as a CEILING — `maxTier: 'town'`
 * against a rank table where thorp is rank 0 — so by the gate alone an anonymous visitor
 * could pick a thorpe. The product does not offer them one: the at-cap line has said
 * "You've explored hamlet, village, town." since it was written, and the owner has now
 * stated the rule. A ceiling cannot express "a floor as well", so the offered SET lives
 * here, beside the other display facts, rather than being inferred from a number that
 * cannot mean it.
 *
 * ✅ THE GATE HAS SINCE BEEN TIGHTENED TO MATCH (car e7c85a66b, §934.34): TIER_GATE.anon
 * carries `minTier: 'hamlet'` and `isTierAllowed` refuses a RANGE, so a thorpe really is
 * refused for an anonymous visitor rather than merely unoffered. This row stays the
 * DISPLAY-side spelling of the same fact — a set the sentences can name, where the gate
 * holds two bounds — and tests/config/tierFacts.contract.test.js pins the two together.
 * (The paragraph that used to sit here recorded the gap as an open decision for the
 * chair; it outlived the car that closed it.)
 * @type {ReadonlyArray<string>}
 */
export const ANON_SIZES = Object.freeze(['hamlet', 'village', 'town']);

/**
 * WHAT SIGNING IN ADDS: the ladder minus what an anonymous visitor already had. Derived,
 * so a ceiling that moves rewrites every sentence that names it instead of stranding one.
 * @type {ReadonlyArray<string>}
 */
export const SIGN_IN_UNLOCKS = Object.freeze(SIZE_LADDER.filter((key) => !ANON_SIZES.includes(key)));

/**
 * The estate's list joiner, with the Oxford comma: "a", "a and b", "a, b, and c".
 * Written here because the tree had no shared one — the only other joiner
 * (domain/display/warRemembrance.js) joins on ", and " and so drops the comma at two
 * items, which is a different rule for a different voice.
 * @param {ReadonlyArray<string>} parts
 * @returns {string}
 */
export function oxfordList(parts) {
  const items = parts.filter(Boolean);
  if (items.length <= 1) return items[0] || '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/**
 * The sentence fragment naming the sizes a free account unlocks, in the running voice
 * those sentences use (lower case, Oxford-joined): "thorpe, city, and metropolis".
 * @returns {string}
 */
export function signInUnlocksSizes() {
  return oxfordList(SIGN_IN_UNLOCKS.map((key) => SIZE_LABEL[key].toLowerCase()));
}

/**
 * ⛔ WHOSE FORGE IS BEING DESCRIBED, IN THE READER'S OWN TERMS (REVIEW-P F13).
 *
 * Two refusal sentences said "past what THIS ACCOUNT forges" to a visitor who has no
 * account — measured on the 2026-09-20 anonymous walk, on the Black Crag fork, one
 * clause before the same sentence invites them to make one. The two phrasings live
 * HERE, in one home, for the reason every other fact on this module does: they are
 * derived from the tier, they are said on more than one surface, and a second copy
 * would agree on the day it was written and drift by the month.
 *
 * Deliberately NOT a tier-by-tier table. The only distinction the sentences draw is
 * "has an account" versus "does not", and inventing a row per tier would invite a
 * future sentence to name a tier where it means an entitlement — which is the class
 * this whole module exists against.
 *
 * @param {string} [tier] the stored auth tier ('anon' | 'free' | 'premium'); omitted
 *   means the raiser measured no tier, and the phrase then reads exactly as it read
 *   before this cure. That is deliberately the STATUS QUO and not a new claim: the
 *   only raiser in the tree is the generation lane, which always has the tier in
 *   hand, so the fallback is reached by a hand-built record and by nothing shipped.
 * @returns {string}
 */
export function accountHolderPhrase(tier) {
  return tier === 'anon' ? 'an account-less visit' : 'this account';
}

/**
 * Does signing in unlock the PRE-GENERATION OPTIONS? Derived from the two rows rather
 * than asserted, so the sentence stops claiming it the day an anonymous visitor gets
 * them — or the day a free account loses them.
 * @returns {boolean}
 */
export function signInUnlocksCustomize() {
  return PRE_GEN_OPTIONS.free === true && PRE_GEN_OPTIONS.anon === false;
}

/**
 * ⭐ THE WHOLE "WHAT SIGNING IN UNLOCKS" CLAUSE, composed from the facts and joined by
 * the estate's Oxford joiner: "thorpe, city, and metropolis, to customize, and save up
 * to 3 drafts". The three parts are separate FACTS — a size range, a capability and a
 * save cap — and each drops out of the sentence on its own if the facts stop carrying
 * it, which is what stops a sentence promising something the gate refuses.
 * @returns {string}
 */
export function signInUnlocksClause() {
  return oxfordList([
    signInUnlocksSizes(),
    signInUnlocksCustomize() ? 'to customize' : '',
    TIER_FACTS.free.saveLimit > 0 ? `save up to ${TIER_FACTS.free.saveLimit} drafts` : '',
  ]);
}

// PDF-export posture (owner ruling 2026-07-13): only premium exports FREELY and
// without limit ('unlimited'); anon + free pay per dossier ($2.99, the single-
// dossier ladder) — 'per_dossier'. Pinned to TIER_GATE.{tier}.export by the
// contract test (unlimited ⇔ export:true, per_dossier ⇔ export:false).
const EXPORT_MODE = Object.freeze({ anon: 'per_dossier', free: 'per_dossier', premium: 'unlimited' });

// Custom Compendium content is a premium (Cartographer) capability — never free.
// Pinned to TIER_GATE.{tier}.customContent by the contract test.
const CUSTOM_CONTENT = Object.freeze({ anon: false, free: false, premium: true });

// ⛔ PRE-GENERATION CONFIGURATION IS FREE WITH AN ACCOUNT, AND ONLY WITH ONE (the owner,
// §934.34: "only hamlet, village, and town can be accessed without signing in and only
// with everything on random"). This is the wizard's own options — name, terrain, culture,
// priorities, magic, the constraint grids — and it is NOT `customContent` above, which is
// the Compendium's authored content and stays premium. The owner ruled the two on
// opposite sides, so they are two facts. Pinned to TIER_GATE.{tier}.preGenOptions by the
// contract test.
const PRE_GEN_OPTIONS = Object.freeze({ anon: false, free: true, premium: true });

// The settlement editor is a premium (Cartographer) capability — never free, never anonymous.
// Pinned to TIER_GATE.{tier}.settlementEditor by the contract test.
// ⛔ THE GATE IS NOT THE WHOLE ANSWER: the enforcement predicate carries a second, staff-only
// conjunct while the door is DARK (authSlice.js#canEditSettlement). These facts describe the
// TIER's entitlement, which is what the ladder and the copy surfaces will read when it opens.
const SETTLEMENT_EDITOR = Object.freeze({ anon: false, free: false, premium: true });

/**
 * Per-tier display facts, keyed by the stored auth tier value ('anon' | 'free' |
 * 'premium'). saveLimit / maxSizeLabel derive straight from the pricing catalog;
 * exportMode + customContent from the ruling above. The contract test asserts each
 * agrees with the authSlice enforcement gate.
 *
 * @typedef {{ key: string, saveLimit: number, maxSizeLabel: string, exportMode: 'unlimited'|'per_dossier', customContent: boolean, preGenOptions: boolean, settlementEditor: boolean }} TierFacts
 * @type {Readonly<Record<'anon'|'free'|'premium', TierFacts>>}
 */
export const TIER_FACTS = Object.freeze({
  anon: Object.freeze({
    key: 'anon',
    saveLimit: 0,                                    // no account ⇒ no saves
    maxSizeLabel: ANON_MAX_SIZE_LABEL,
    exportMode: EXPORT_MODE.anon,
    customContent: CUSTOM_CONTENT.anon,
    settlementEditor: SETTLEMENT_EDITOR.anon,
    preGenOptions: PRE_GEN_OPTIONS.anon,
  }),
  free: Object.freeze({
    key: 'free',
    saveLimit: TIERS.wanderer.saveLimit,             // 3
    maxSizeLabel: SIZE_LABEL[TIERS.wanderer.maxSize], // Metropolis (every size)
    exportMode: EXPORT_MODE.free,
    customContent: CUSTOM_CONTENT.free,
    settlementEditor: SETTLEMENT_EDITOR.free,
    preGenOptions: PRE_GEN_OPTIONS.free,
  }),
  premium: Object.freeze({
    key: 'premium',
    saveLimit: TIERS.cartographer.saveLimit,         // Infinity (unlimited)
    maxSizeLabel: SIZE_LABEL[TIERS.cartographer.maxSize],
    exportMode: EXPORT_MODE.premium,
    customContent: CUSTOM_CONTENT.premium,
    settlementEditor: SETTLEMENT_EDITOR.premium,
    preGenOptions: PRE_GEN_OPTIONS.premium,
  }),
});

/** Free-tier save cap (3) — the single number the "3 saves" surfaces render. */
export const FREE_SAVE_LIMIT = TIER_FACTS.free.saveLimit;

/**
 * Founder chair count (30). Sourced from the pricing catalog's
 * TIERS.founder.seatLimit; the contract test pins it equal to
 * lib/founderSeats.FOUNDER_SEAT_CAP (the RPC-clamp constant), so every surface
 * that renders "N of 30 chairs held" reads one number.
 *
 * ⚠ It is no longer a SCARCITY claim and there is no longer a server-side sale
 * to keep it honest against: create-checkout sells no chair at all (ODQ §118),
 * so its FOUNDER_SEAT_LIMIT is gone with the seat gate it guarded. The cap is
 * now a fact about the Hall — how many chairs exist — not a countdown on an
 * offer, and the contract test pins the two remaining homes accordingly.
 */
export const FOUNDER_SEATS = TIERS.founder.seatLimit;

/** Single-dossier PDF price label ('$2.99') — the free-tier per-dossier export. */
export const SINGLE_DOSSIER_PRICE = SINGLE_DOSSIER.priceLabel;
