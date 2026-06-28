/**
 * domain/worldPulse/religionState.js — the per-settlement PANTHEON core.
 *
 * The religion rework (see docs/RELIGION_REWORK.md): a settlement holds MULTIPLE
 * deities, each with an adherent SHARE (0..100, summing to 100 like faction power),
 * a NICHE (temperament × alignment — one deity per niche), a STANDING
 * (cult → established → ascendant), and exactly ONE chief (the patron). Faith grows
 * GRADUALLY: a deity arrives as a cult and climbs by winning adherents, instead of
 * the old binary winner-take-all flip.
 *
 * This module is the PURE state core (no kernel/snapshot deps): it takes the
 * religionState plus strengths/inputs the kernel computes, and returns the evolved
 * state. The kernel (religiousContest / pulseKernel) computes the strengths
 * (global rank + prevalence + carrier + receptivity) and drives this each tick.
 *
 * Determinism: codepoint-sorted iteration everywhere; integer shares via
 * largest-remainder renorm (the faction-power idiom); no RNG / wall-clock here.
 */

import { clamp01 } from './relationshipState.js';
import { PANTHEON_TUNING } from './pantheon.js';

const DEITY_RANK_STRENGTH = PANTHEON_TUNING.DEITY_RANK_STRENGTH;

export const RELIGION_TUNING = Object.freeze({
  SLOTS_BY_TIER: Object.freeze({ thorp: 1, hamlet: 2, village: 2, town: 3, city: 5, metropolis: 7 }),
  CULT_SEED_SHARE: 4,         // an arriving cult's seed share
  SHARE_STEP_MAX: 6,          // max adherent-share a deity gains/loses per tick (gradual)
  PUSH_MARGIN: 1.1,           // same-niche push-out: newcomer claim must beat incumbent share ×this
  EVICTION_MARGIN: 1.5,       // cross-niche eviction (capacity full): harder bar
  STANDING_ESTABLISHED: 15,   // share to be "established"
  STANDING_ASCENDANT: 30,     // share to be "ascendant" (chief-eligible top tier)
  STANDING_HYSTERESIS: 4,     // band to avoid standing flicker
  CHIEF_HOLD: 0.35,           // chief's downward-share defense (resists losing share); large enough to register through integer renorm, erodable so not perpetual
  CHIEF_HOLD_DECAY: 0.02,     // erosion per tick while seriously contested (not perpetual)
  CHIEF_FLIP_MARGIN: 6,       // a challenger must lead the chief by this share…
  CHIEF_FLIP_TICKS: 3,        // …for this many consecutive ticks to seize the chief seat
});

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** A deity's niche key — its temperament × alignment. @param {any} d @returns {string} */
export function nicheOf(d) {
  return `${d?.temperamentAxis || 'neutral'}:${d?.alignmentAxis || 'neutral'}`;
}

/** Slot capacity for a settlement tier (how many faiths the populace sustains). @param {any} tier */
export function capacityForTier(tier) {
  return /** @type {Record<string, number>} */ (RELIGION_TUNING.SLOTS_BY_TIER)[tier] ?? 2;
}

/** 0..1 global-rank strength of a deity (major > minor > cult). @param {any} d */
export function deityRankStrength(d) {
  return /** @type {Record<string,number>} */ (DEITY_RANK_STRENGTH)[d?.rankAxis] ?? DEITY_RANK_STRENGTH.minor;
}

/** Active (non-suppressed) deity refs, codepoint-sorted. @param {Record<string, any>} deities */
function activeRefs(deities) {
  return Object.keys(deities).filter((k) => !deities[k].suppressed).sort(codepoint);
}

/**
 * Largest-remainder renorm of ACTIVE deity shares to sum exactly 100 (integer
 * points). File-local mirror of powerGenerator's renormalizeFactionPower so the
 * pantheon and the power system enforce the same conserved-share invariant.
 * @param {Record<string, any>} deities
 */
export function renormShares(deities) {
  const keys = activeRefs(deities);
  if (!keys.length) return;
  const total = keys.reduce((t, k) => t + Math.max(0, Number(deities[k].share) || 0), 0);
  if (total <= 0) { const even = Math.floor(100 / keys.length); keys.forEach((k, i) => { deities[k].share = even + (i < 100 - even * keys.length ? 1 : 0); }); return; }
  let assigned = 0;
  const rows = keys.map((k) => { const exact = Math.max(0, Number(deities[k].share) || 0) / total * 100; const floor = Math.floor(exact); assigned += floor; return { k, floor, rem: exact - floor }; });
  let leftover = 100 - assigned;
  rows.slice().sort((a, b) => (b.rem - a.rem) || codepoint(a.k, b.k)).forEach((r) => { if (leftover > 0) { r.floor++; leftover--; } });
  for (const r of rows) deities[r.k].share = r.floor;
}

/** Standing from share, with hysteresis against the previous standing. @param {number} share @param {any} prev */
function standingFor(share, prev) {
  const { STANDING_ESTABLISHED: E, STANDING_ASCENDANT: A, STANDING_HYSTERESIS: H } = RELIGION_TUNING;
  if (prev === 'ascendant') return share >= A - H ? 'ascendant' : (share >= E - H ? 'established' : 'cult');
  if (prev === 'established') return share >= A ? 'ascendant' : (share >= E - H ? 'established' : 'cult');
  return share >= A ? 'ascendant' : (share >= E ? 'established' : 'cult');
}

/**
 * Normalize / migrate a settlement's religion state. Seeds from a legacy single
 * `primaryDeitySnapshot` (chief at 100% in its niche) when no state exists yet.
 * @param {any} state @param {any} settlement @param {string} tier
 */
export function ensureReligionState(state, settlement, tier) {
  const capacity = capacityForTier(tier);
  // Clone each deity ENTRY (not just the map) so evolving this tick never mutates the
  // prior tick's state (snapshots are immutable, so sharing the ref is safe).
  /** @type {Record<string, any>} */
  const clonedDeities = {};
  if (state && state.deities) for (const k of Object.keys(state.deities)) clonedDeities[k] = { ...state.deities[k] };
  /** @type {any} */
  const s = (state && typeof state === 'object' && state.deities)
    ? { ...state, deities: clonedDeities, capacity }
    : { deities: {}, chiefRef: null, chiefHeld: 0, chiefChallengeTicks: 0, contestedTicks: 0, capacity };
  // Reconcile the DM's assign-deity event (SET_PRIMARY_DEITY writes
  // config.primaryDeitySnapshot directly; it cannot see worldState.religionStates).
  // The DM is AUTHORITATIVE over the chief: a fresh assign seeds the patron as sole
  // chief; a RE-assign onto an existing pantheon installs the new deity as the
  // dominant chief (so the assignment is never overwritten by the stale chief-mirror
  // on the next advance — the bug this guards). In-sync (assigned === chief) is a no-op.
  const legacy = settlement?.config?.primaryDeitySnapshot;
  if (legacy) {
    const ref = String(legacy._deityRef || legacy.name || 'patron');
    if (!Object.keys(s.deities).length) {
      s.deities[ref] = { deityRef: ref, snapshot: legacy, niche: nicheOf(legacy), share: 100, standing: 'ascendant', standingHeld: 0, suppressed: false };
      s.chiefRef = ref;
    } else if (s.chiefRef !== ref) {
      // Make the DM-assigned deity genuinely DOMINANT (more than half the pantheon) so
      // it holds the chief seat after renorm + selectChief, not merely present.
      const others = activeRefs(s.deities).filter((k) => k !== ref).reduce((t, k) => t + (Number(s.deities[k].share) || 0), 0);
      const dominantShare = Math.max(60, others + 10);
      const existing = s.deities[ref];
      if (existing) Object.assign(existing, { snapshot: legacy, niche: nicheOf(legacy), suppressed: false, standing: 'ascendant', share: dominantShare });
      else s.deities[ref] = { deityRef: ref, snapshot: legacy, niche: nicheOf(legacy), share: dominantShare, standing: 'ascendant', standingHeld: 0, suppressed: false };
      s.chiefRef = ref;
      s.chiefChallengeTicks = 0;
      renormShares(s.deities);          // restore the 100-point share after the override
    }
  }
  return s;
}

/**
 * Attempt to bring a newcomer deity into the settlement this tick. Implements the
 * three entry paths (open niche+free slot → cult; same-niche push-out; capacity-full
 * cross-niche eviction). `newcomerStrength` (0..1) is the kernel-computed local pull;
 * `force` (occupation) bypasses the capacity cap. Returns { entered, path, evicted }.
 * Mutates `state.deities` in place; caller renorms after.
 * @param {any} state @param {any} deity @param {number} newcomerStrength
 * @param {{ force?: boolean }} [opts]
 */
export function attemptEntry(state, deity, newcomerStrength, opts = {}) {
  const ref = String(deity?._deityRef || deity?.name || '');
  if (!ref) return { entered: false, path: 'invalid' };
  const deities = state.deities;
  // already present (and active) → no entry (growth handled by advanceShares).
  if (deities[ref] && !deities[ref].suppressed) return { entered: false, path: 'present' };
  const niche = nicheOf(deity);
  const claim = clamp01(newcomerStrength) * 100;
  const seed = (existingShare = 0) => ({ deityRef: ref, snapshot: deity, niche, share: Math.max(RELIGION_TUNING.CULT_SEED_SHARE, Math.round(existingShare * 0.5)), standing: 'cult', standingHeld: 0, suppressed: false });
  const enter = (/** @type {any} */ rec, /** @type {string} */ path, /** @type {any} */ evicted = null) => { deities[ref] = rec; return { entered: true, path, evicted }; };

  // a suppressed copy resurging counts as a fresh entry below (we overwrite it).
  const active = activeRefs(deities).filter((k) => k !== ref);

  // 1/2. same-niche incumbent → push-out contest.
  const sameNiche = active.find((k) => deities[k].niche === niche);
  if (sameNiche) {
    if (opts.force || claim > deities[sameNiche].share * RELIGION_TUNING.PUSH_MARGIN) {
      const evictedShare = deities[sameNiche].share;
      deities[sameNiche] = { ...deities[sameNiche], suppressed: true, share: 0, standing: 'cult' };
      return enter(seed(evictedShare), 'same_niche_pushout', sameNiche);
    }
    return { entered: false, path: 'niche_held' };
  }

  // niche is open. Is there a free slot?
  if (active.length < state.capacity || opts.force) {
    return enter(seed(), opts.force && active.length >= state.capacity ? 'forced_overflow' : 'open_slot');
  }

  // 3. capacity full, niche open → cross-niche eviction of the WEAKEST active deity (harder bar).
  const weakest = active.slice().sort((a, b) => (deities[a].share - deities[b].share) || codepoint(a, b))[0];
  if (weakest && claim > deities[weakest].share * RELIGION_TUNING.EVICTION_MARGIN) {
    const evictedShare = deities[weakest].share;
    deities[weakest] = { ...deities[weakest], suppressed: true, share: 0, standing: 'cult' };
    return enter(seed(evictedShare), 'cross_niche_eviction', weakest);
  }
  return { entered: false, path: 'capacity_full' };
}

/**
 * Move every active deity's share toward its target (gradual), apply the chief's
 * erodable downward-defense buffer, renorm to 100, and refresh standings.
 * @param {any} state @param {Record<string, number>} strengthByRef  0..1 per active deity
 */
export function advanceShares(state, strengthByRef) {
  const deities = state.deities;
  const keys = activeRefs(deities);
  if (!keys.length) return;
  const totalStrength = keys.reduce((t, k) => t + clamp01(strengthByRef[k] ?? 0), 0) || 1;
  // chief buffer erodes while a rival is within striking distance.
  const chiefRef = state.chiefRef;
  const chiefShare = chiefRef && deities[chiefRef] ? deities[chiefRef].share : 0;
  const topRival = keys.filter((k) => k !== chiefRef).reduce((m, k) => Math.max(m, deities[k].share), 0);
  // The chief's downward-defense buffer erodes the longer it stays seriously
  // contested (a rival within CHIEF_FLIP_MARGIN), so the hold is NOT perpetual.
  const contested = Boolean(chiefRef) && (chiefShare - topRival) < RELIGION_TUNING.CHIEF_FLIP_MARGIN;
  state.contestedTicks = contested ? (state.contestedTicks || 0) + 1 : 0;
  const hold = Math.max(0, RELIGION_TUNING.CHIEF_HOLD - RELIGION_TUNING.CHIEF_HOLD_DECAY * (state.contestedTicks || 0));

  for (const k of keys) {
    const target = (clamp01(strengthByRef[k] ?? 0) / totalStrength) * 100;
    let delta = target - deities[k].share;
    delta = Math.max(-RELIGION_TUNING.SHARE_STEP_MAX, Math.min(RELIGION_TUNING.SHARE_STEP_MAX, delta));
    if (delta < 0 && k === chiefRef) delta *= (1 - hold);                 // chief resists the (clamped) loss
    deities[k].share = Math.max(0, deities[k].share + delta);
  }
  renormShares(deities);
  for (const k of keys) deities[k].standing = standingFor(deities[k].share, deities[k].standing);
  pruneSuppressed(state);
}

/** Drop suppressed cults that have fully faded (kept only as latent memory while share 0 a while). @param {any} state */
function pruneSuppressed(state) {
  // keep at most a few suppressed entries (latent revival memory); prune the rest.
  const supp = Object.keys(state.deities).filter((k) => state.deities[k].suppressed).sort(codepoint);
  const KEEP = 3;
  if (supp.length > KEEP) for (const k of supp.slice(KEEP)) delete state.deities[k];
}

/**
 * Select the chief with the incumbency buffer: the top-share active deity becomes
 * chief, but an incumbent is only displaced by a challenger that leads by
 * CHIEF_FLIP_MARGIN for CHIEF_FLIP_TICKS consecutive ticks. Returns the chief ref.
 * @param {any} state
 */
export function selectChief(state) {
  const keys = activeRefs(state.deities);
  if (!keys.length) { state.chiefRef = null; return null; }
  const byShare = keys.slice().sort((a, b) => (state.deities[b].share - state.deities[a].share) || codepoint(a, b));
  const top = byShare[0];
  const cur = state.chiefRef && state.deities[state.chiefRef] && !state.deities[state.chiefRef].suppressed ? state.chiefRef : null;
  if (!cur) { state.chiefRef = top; state.chiefChallengeTicks = 0; return top; }
  if (top === cur) { state.chiefChallengeTicks = 0; return cur; }
  // a challenger leads — only flips with a decisive, SUSTAINED lead (the buffer).
  const lead = state.deities[top].share - state.deities[cur].share;
  if (lead >= RELIGION_TUNING.CHIEF_FLIP_MARGIN) {
    state.chiefChallengeTicks = (state.chiefChallengeTicks || 0) + 1;
    if (state.chiefChallengeTicks >= RELIGION_TUNING.CHIEF_FLIP_TICKS) { state.chiefRef = top; state.chiefChallengeTicks = 0; return top; }
  } else {
    state.chiefChallengeTicks = 0;
  }
  return cur; // chief holds (buffered)
}

/** The chief deity's snapshot, for the derived `primaryDeitySnapshot` compat mirror. @param {any} state */
export function chiefSnapshot(state) {
  const ref = state?.chiefRef;
  return ref && state.deities?.[ref] ? state.deities[ref].snapshot : null;
}

// ── Projection + divine-mandate (read models for the dossier / faith panel / coup) ──

/**
 * Project a settlement's pantheon onto `config.faithProfile` for the dossier, faith
 * panel, and divine-mandate read model: { chief, deities[] (share-sorted), contested,
 * chiefSecurity }. Identity no-op (same reference) when there is no active state.
 * @param {any} settlement @param {any} religionStates @param {any} saveId
 */
export function projectReligionStateOntoSettlement(settlement, religionStates, saveId) {
  const state = religionStates?.[String(saveId)];
  if (!state || !state.deities) return settlement;
  const active = activeRefs(state.deities);
  if (!active.length) return settlement;
  const deities = active
    .map((ref) => { const d = state.deities[ref]; return { deityRef: ref, name: d.snapshot?.name || ref, niche: d.niche, share: d.share, standing: d.standing, isChief: ref === state.chiefRef }; })
    .sort((a, b) => (b.share - a.share) || codepoint(a.deityRef, b.deityRef));
  const chiefShare = state.chiefRef && state.deities[state.chiefRef] ? state.deities[state.chiefRef].share : 0;
  const topRival = active.filter((r) => r !== state.chiefRef).reduce((m, r) => Math.max(m, state.deities[r].share), 0);
  const contested = active.length > 1 && (chiefShare - topRival) < RELIGION_TUNING.CHIEF_FLIP_MARGIN;
  const chief = chiefSnapshot(state);
  const faithProfile = {
    chief: chief ? { name: chief.name, deityRef: state.chiefRef, share: chiefShare } : null,
    deities,
    contested,
    chiefSecurity: clamp01((chiefShare / 100) * (contested ? 0.6 : 1)),
  };
  return { ...settlement, config: { ...settlement.config, faithProfile } };
}

// Divine-mandate legitimacy coupling (decision 13): royal/authoritative governments
// lean on the chief deity + religious authority. Scope by government class.
const MANDATE_GOV_WEIGHT = Object.freeze({ theocracy: 1, royal: 0.45 });
const MANDATE_RANGE = 30;   // how far the mandate TARGET swings from neutral (50) at the security extremes
const MANDATE_PULL = 0.15;  // fraction of the gap to the target closed per tick (gentle, self-limiting)
const MANDATE_STEP = 2;     // hard per-tick clamp

/** @param {any} government @returns {number} */
function mandateGovWeight(government) {
  const g = String(government || '').toLowerCase();
  if (/theocra/.test(g)) return MANDATE_GOV_WEIGHT.theocracy;
  if (/monarch|feudal|autocra|imperial|empire|despot|magocra|kingdom|throne|royal|king|queen|emperor/.test(g)) return MANDATE_GOV_WEIGHT.royal;
  return 0;  // merchant / council / republic / oligarchy / confederation — no divine mandate
}

/** Regime-vs-chief alignment fit (0..1): kindred props more, mismatch props less. @param {any} deity @param {any} government */
function mandateAlignmentFit(deity, government) {
  const g = String(government || '').toLowerCase();
  if (/theocra/.test(g)) return 1;                                  // a theocracy IS its chief's faith
  const temper = deity?.temperamentAxis, align = deity?.alignmentAxis;
  let fit = 0.75;
  if (/despot|autocra|imperial|empire/.test(g)) {                   // martial / authoritarian
    if (temper === 'warlike') fit += 0.25; if (align === 'evil') fit += 0.1;
    if (temper === 'peaceful') fit -= 0.25; if (align === 'good') fit -= 0.1;
  } else if (/monarch|feudal|kingdom|throne|royal|king|queen/.test(g)) {   // traditional order
    if (align === 'good' || align === 'neutral') fit += 0.15;
    if (temper === 'peaceful' || temper === 'neutral') fit += 0.1;
    if (align === 'evil') fit -= 0.15;
  }
  return clamp01(fit);
}

/**
 * Apply the divine-mandate legitimacy term to a settlement (reads config.faithProfile
 * + config.primaryDeitySnapshot + powerStructure.government). A secure, kindred chief
 * PROPS publicLegitimacy; a weak or CONTESTED chief ERODES it (feeding coups). Bounded
 * per tick. Identity no-op for non-royal/non-theocratic governments or no faithProfile.
 * @param {any} settlement
 */
export function applyDivineMandate(settlement) {
  const profile = settlement?.config?.faithProfile;
  const leg = settlement?.powerStructure?.publicLegitimacy;
  if (!profile || !leg || typeof leg !== 'object' || typeof leg.score !== 'number') return settlement;
  const weight = mandateGovWeight(settlement?.powerStructure?.government);
  if (weight <= 0) return settlement;
  const chiefDeity = settlement?.config?.primaryDeitySnapshot;
  const fit = mandateAlignmentFit(chiefDeity, settlement?.powerStructure?.government);
  // centered on 0.45: a dominant uncontested chief (security→1) props; a contested or
  // weak chief (security→0) erodes. fit scales a PROP but never beyond the contested floor.
  const security = clamp01(Number(profile.chiefSecurity) || 0);
  const base = security - 0.45;
  const fitFactor = base >= 0 ? fit : 1;   // a mismatched chief PROPS less; a contested chief gets less prop regardless
  // The mandate pulls legitimacy toward a TARGET band, not by an unbounded delta — so a
  // persistently-contested chief WITHDRAWS its prop (target drifts to ~neutral) rather
  // than crashing legitimacy to zero. Other forces (coups, crises) still move it freely;
  // this is one bounded, self-limiting input. A secure kindred chief targets ~high.
  const target = 50 + weight * base * MANDATE_RANGE * fitFactor;
  const delta = Math.max(-MANDATE_STEP, Math.min(MANDATE_STEP, (target - leg.score) * MANDATE_PULL));
  const nextScore = Math.round(Math.max(0, Math.min(100, leg.score + delta)));
  if (nextScore === leg.score) return settlement;
  return { ...settlement, powerStructure: { ...settlement.powerStructure, publicLegitimacy: { ...leg, score: nextScore } } };
}

/**
 * Player-safe display read-model for the divine mandate, for the faith panel. Returns
 * null when the government carries no mandate or there is no faith profile.
 * @param {any} settlement @returns {{ propping: boolean, phrase: string } | null}
 */
export function divineMandateStatus(settlement) {
  const profile = settlement?.config?.faithProfile;
  if (!profile) return null;
  if (mandateGovWeight(settlement?.powerStructure?.government) <= 0) return null;
  const security = clamp01(Number(profile.chiefSecurity) || 0);
  if (profile.contested || security < 0.4) return { propping: false, phrase: 'A contested faith weakens the ruler’s divine mandate.' };
  if (security > 0.6) return { propping: true, phrase: 'A dominant church shores up the ruler’s divine mandate.' };
  return { propping: true, phrase: 'The faith lends the ruler a measure of divine mandate.' };
}
