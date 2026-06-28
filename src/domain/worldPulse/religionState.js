/**
 * domain/worldPulse/religionState.js — the per-settlement PANTHEON core.
 *
 * The religion rework (see docs/RELIGION_REWORK.md): a settlement holds MULTIPLE
 * deities, each with an adherent SHARE (0..100, summing to 100 like faction power),
 * a NICHE (temperament × alignment — one deity per niche), a STANDING
 * (cult → established → ascendant), and exactly ONE PATRON (the chief creed). Faith
 * grows GRADUALLY: a deity arrives as a cult and climbs by winning adherents,
 * instead of the old binary winner-take-all flip.
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
  STANDING_ASCENDANT: 30,     // share to be "ascendant" (patron-eligible top tier)
  STANDING_HYSTERESIS: 4,     // band to avoid standing flicker
  PATRON_HOLD: 0.35,          // patron's downward-share defense (resists losing share); large enough to register through integer renorm, erodable so not perpetual
  PATRON_HOLD_DECAY: 0.02,    // erosion per tick while seriously contested (not perpetual)
  PATRON_FLIP_MARGIN: 6,      // a challenger must lead the patron by this share…
  PATRON_FLIP_TICKS: 3,       // …for this many consecutive ticks to seize the patron seat
  // Legitimacy seeds (the *rightful claim* axis; dynamics live in religionLegitimacy.js).
  LEGIT_SEED_PATRON: 0.55,    // a founding/legacy patron starts moderately legitimate
  LEGIT_SEED_CULT: 0.08,      // an arriving/imposed cult starts near-illegitimate
  LEGIT_STAIN_IMPOSED: 0.45,  // heresy stain on a force-installed faith (DM impose / occupation)
  // Patron CONTEST (fires when a rival shares the patron's niche — a schism).
  CONTEST_LEGIT_W: 0.78,      // legitimacy DOMINATES the seeded patron roll (rightful > popular)…
  CONTEST_SHARE_W: 0.22,      // …with adherent share only a secondary pull
  CONTEST_PATRON_AMP: 1.7,    // standing patron's roll weight ×(1 + AMP × legitimacy²) — a LEGITIMATE
                              // patron is near-unbeatable, but a discredited one (low legit) keeps almost
                              // no shield, so a more-rightful rival can topple it (e.g. under a rotten regime)
});

/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** A deity's niche key — its temperament × alignment. @param {any} d @returns {string} */
export function nicheOf(d) {
  return `${d?.temperamentAxis || 'neutral'}:${d?.alignmentAxis || 'neutral'}`;
}

/** Slot capacity for a settlement tier (how many faiths the populace sustains). @param {string} tier */
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

/** Standing from share, with hysteresis against the previous standing. @param {number} share @param {string} prev */
function standingFor(share, prev) {
  const { STANDING_ESTABLISHED: E, STANDING_ASCENDANT: A, STANDING_HYSTERESIS: H } = RELIGION_TUNING;
  if (prev === 'ascendant') return share >= A - H ? 'ascendant' : (share >= E - H ? 'established' : 'cult');
  if (prev === 'established') return share >= A ? 'ascendant' : (share >= E - H ? 'established' : 'cult');
  return share >= A ? 'ascendant' : (share >= E ? 'established' : 'cult');
}

/**
 * Normalize / migrate a settlement's religion state. Seeds from the embedded
 * `primaryDeitySnapshot` (the PATRON, at 100% in its niche) and any DM-imposed
 * `cultDeitySnapshots` (each entering at cult standing in its own free niche,
 * capped by tier capacity) when no state exists yet.
 * @param {any} state @param {any} settlement @param {string} tier
 */
export function ensureReligionState(state, settlement, tier) {
  const capacity = capacityForTier(tier);
  // Clone each deity ENTRY (not just the map) so evolving this tick never mutates the
  // prior tick's state (snapshots are immutable, so sharing the ref is safe).
  /** @type {Record<string, any>} */
  const clonedDeities = {};
  if (state && state.deities) for (const k of Object.keys(state.deities)) clonedDeities[k] = { ...state.deities[k] };
  const s = (state && typeof state === 'object' && state.deities)
    ? { ...state, deities: clonedDeities, capacity }
    : { deities: {}, patronRef: null, patronHeld: 0, patronChallengeTicks: 0, contestedTicks: 0, capacity };
  // First-seed: the embedded patron + imposed cults become the initial pantheon.
  if (!Object.keys(s.deities).length) {
    // legacy migration: a single embedded patron becomes the patron at 100%.
    const legacy = settlement?.config?.primaryDeitySnapshot;
    if (legacy) {
      const ref = String(legacy._deityRef || legacy.name || 'patron');
      s.deities[ref] = { deityRef: ref, snapshot: legacy, niche: nicheOf(legacy), share: 100, standing: 'ascendant', standingHeld: 0, suppressed: false, legitimacy: RELIGION_TUNING.LEGIT_SEED_PATRON, tenure: 0, heresyStain: 0 };
      s.patronRef = ref;
    }
    // DM-imposed cults: each enters at cult standing in its own (free) niche, capped
    // by tier capacity; we then renorm so the patron + cults sum to 100. A settlement
    // with no patron but imposed cults seeds a cult-led pantheon (selectPatron picks
    // the strongest). Absent both, s.deities stays empty (the dormancy oracle).
    const cultSnaps = Array.isArray(settlement?.config?.cultDeitySnapshots) ? settlement.config.cultDeitySnapshots : [];
    const patronNiche = s.patronRef && s.deities[s.patronRef] ? s.deities[s.patronRef].niche : null;
    let seededCult = false;
    for (const cultSnap of cultSnaps) {
      if (!cultSnap) continue;
      const ref = String(cultSnap._deityRef || cultSnap.name || '');
      if (!ref || s.deities[ref]) continue;                                   // skip blanks + dedupe (patron / already seeded)
      const niche = nicheOf(cultSnap);
      // One deity per niche — EXCEPT the patron's niche, which tolerates a single
      // contestant (an imposed cult that challenges the patron in its own domain).
      const nicheCount = Object.values(s.deities).filter((d) => d.niche === niche && !d.suppressed).length;
      if (nicheCount >= (niche === patronNiche ? 2 : 1)) continue;
      if (activeRefs(s.deities).length >= capacity) break;                    // respect tier capacity
      // An imposed cult carries the heresy stain (it rose by DM fiat, not conversion).
      s.deities[ref] = { deityRef: ref, snapshot: cultSnap, niche, share: RELIGION_TUNING.CULT_SEED_SHARE, standing: 'cult', standingHeld: 0, suppressed: false, legitimacy: RELIGION_TUNING.LEGIT_SEED_CULT, tenure: 0, heresyStain: RELIGION_TUNING.LEGIT_STAIN_IMPOSED };
      seededCult = true;
    }
    if (seededCult) {
      // Only when cults were actually seeded do we renorm/refresh — a patron-only
      // settlement stays byte-identical to the pre-cult seed (single deity at 100%).
      renormShares(s.deities);
      for (const k of activeRefs(s.deities)) s.deities[k].standing = standingFor(s.deities[k].share, s.deities[k].standing);
      if (!s.patronRef) selectPatron(s);
    }
  }
  return s;
}

/**
 * Reconcile a DM-imposed CULT into a settlement's persistent cult list, honoring
 * tier capacity (the patron reserves one slot) and the one-deity-per-niche rule
 * (temperament × alignment). A large settlement (more slots) hosts cults across the
 * full niche grid; a small one (few slots) reconciles by refusing or evicting the
 * weakest existing cult. PURE: returns the next cult array + an outcome tag; never
 * touches the patron. The incoming `deity` must already be embed-shaped + frozen
 * (the handler owns the field discipline, mirroring setPrimaryDeity).
 * @param {{ patron?: any, cults?: any[], tier?: string, deity: any }} args
 * @returns {{ cults: any[], action: 'added'|'replaced'|'evicted'|'refused', reason: string, evicted: (string|null) }}
 */
export function reconcileCultImposition({ patron = null, cults = [], tier = 'village', deity }) {
  const list = Array.isArray(cults) ? cults.filter(Boolean) : [];
  const ref = String(deity?._deityRef || deity?.name || '');
  if (!ref) return { cults: list, action: 'refused', reason: 'invalid', evicted: null };
  // A deity cannot be both patron and cult.
  if (patron && String(patron._deityRef || patron.name || '') === ref) {
    return { cults: list, action: 'refused', reason: 'is_patron', evicted: null };
  }
  const niche = nicheOf(deity);
  // NOTE: a cult imposed in the PATRON's niche is NOT refused — it enters as a
  // contestant and triggers the seeded patron contest (resolvePatronContest) in the
  // pulse. It still occupies a cult slot, so capacity/eviction below applies.
  // Same-niche existing cult → replace it (idempotent refresh, or a niche swap).
  const sameNicheIdx = list.findIndex((c) => nicheOf(c) === niche);
  if (sameNicheIdx >= 0) {
    const replaced = String(list[sameNicheIdx]?._deityRef || list[sameNicheIdx]?.name || '');
    const next = list.slice();
    next[sameNicheIdx] = deity;
    return { cults: next, action: 'replaced', reason: replaced === ref ? 'refresh' : 'niche_swap', evicted: replaced === ref ? null : replaced };
  }
  // Capacity: total deities (patron + cults) ≤ tier slots ⇒ cult slots = slots − patron.
  const cultCapacity = Math.max(0, capacityForTier(tier) - (patron ? 1 : 0));
  if (list.length < cultCapacity) {
    return { cults: [...list, deity], action: 'added', reason: 'open_slot', evicted: null };
  }
  if (cultCapacity === 0) {
    return { cults: list, action: 'refused', reason: 'no_cult_slots', evicted: null };
  }
  // Capacity full → evict the WEAKEST existing cult (lowest global rank; codepoint
  // tiebreak) so the imposition seats (a small settlement reconciles by displacement).
  const weakest = list.slice().sort((a, b) =>
    (deityRankStrength(a) - deityRankStrength(b)) || codepoint(String(a?._deityRef || a?.name || ''), String(b?._deityRef || b?.name || '')))[0];
  const weakestRef = String(weakest?._deityRef || weakest?.name || '');
  const next = list.filter((c) => String(c?._deityRef || c?.name || '') !== weakestRef);
  return { cults: [...next, deity], action: 'evicted', reason: 'capacity_full', evicted: weakestRef };
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
  const seed = (existingShare = 0) => ({ deityRef: ref, snapshot: deity, niche, share: Math.max(RELIGION_TUNING.CULT_SEED_SHARE, Math.round(existingShare * 0.5)), standing: 'cult', standingHeld: 0, suppressed: false, legitimacy: RELIGION_TUNING.LEGIT_SEED_CULT, tenure: 0, heresyStain: opts.force ? RELIGION_TUNING.LEGIT_STAIN_IMPOSED : 0 });
  /** @param {any} rec @param {string} path @param {string|null} [evicted] */
  const enter = (rec, path, evicted = null) => { deities[ref] = rec; return { entered: true, path, evicted }; };

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
 * Move every active deity's share toward its target (gradual), apply the patron's
 * erodable downward-defense buffer, renorm to 100, and refresh standings.
 * @param {any} state @param {Record<string, number>} strengthByRef  0..1 per active deity
 */
export function advanceShares(state, strengthByRef) {
  const deities = state.deities;
  const keys = activeRefs(deities);
  if (!keys.length) return;
  const totalStrength = keys.reduce((t, k) => t + clamp01(strengthByRef[k] ?? 0), 0) || 1;
  // patron buffer erodes while a rival is within striking distance.
  const patronRef = state.patronRef;
  const patronShare = patronRef && deities[patronRef] ? deities[patronRef].share : 0;
  const topRival = keys.filter((k) => k !== patronRef).reduce((m, k) => Math.max(m, deities[k].share), 0);
  // The patron's downward-defense buffer erodes the longer it stays seriously
  // contested (a rival within PATRON_FLIP_MARGIN), so the hold is NOT perpetual.
  const contested = Boolean(patronRef) && (patronShare - topRival) < RELIGION_TUNING.PATRON_FLIP_MARGIN;
  state.contestedTicks = contested ? (state.contestedTicks || 0) + 1 : 0;
  const hold = Math.max(0, RELIGION_TUNING.PATRON_HOLD - RELIGION_TUNING.PATRON_HOLD_DECAY * (state.contestedTicks || 0));

  for (const k of keys) {
    const target = (clamp01(strengthByRef[k] ?? 0) / totalStrength) * 100;
    let delta = target - deities[k].share;
    delta = Math.max(-RELIGION_TUNING.SHARE_STEP_MAX, Math.min(RELIGION_TUNING.SHARE_STEP_MAX, delta));
    if (delta < 0 && k === patronRef) delta *= (1 - hold);                // patron resists the (clamped) loss
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
 * Select the patron with the incumbency buffer: the top-share active deity becomes
 * patron, but an incumbent is only displaced by a challenger that leads by
 * PATRON_FLIP_MARGIN for PATRON_FLIP_TICKS consecutive ticks. Returns the patron ref.
 * @param {any} state
 */
export function selectPatron(state) {
  const keys = activeRefs(state.deities);
  if (!keys.length) { state.patronRef = null; return null; }
  // Patron selection is by adherent SHARE — ORGANIC turnover stays popularity-driven, so
  // a clearly-stronger faith consolidates (the world keeps changing). Legitimacy governs
  // the SCHISM contest (resolvePatronContest), not this organic flip: weighting it here
  // froze legitimate incumbents and stalled faith change (validated in religion-soak).
  // Corruption still drives evil to power organically via the GROWTH amplifier (it
  // out-grows weaker patrons), not by overriding adherence.
  const byShare = keys.slice().sort((a, b) => (state.deities[b].share - state.deities[a].share) || codepoint(a, b));
  const top = byShare[0];
  const cur = state.patronRef && state.deities[state.patronRef] && !state.deities[state.patronRef].suppressed ? state.patronRef : null;
  if (!cur) { state.patronRef = top; state.patronChallengeTicks = 0; return top; }
  if (top === cur) { state.patronChallengeTicks = 0; return cur; }
  // a challenger leads — only flips with a decisive, SUSTAINED lead (the buffer).
  const lead = state.deities[top].share - state.deities[cur].share;
  if (lead >= RELIGION_TUNING.PATRON_FLIP_MARGIN) {
    state.patronChallengeTicks = (state.patronChallengeTicks || 0) + 1;
    if (state.patronChallengeTicks >= RELIGION_TUNING.PATRON_FLIP_TICKS) { state.patronRef = top; state.patronChallengeTicks = 0; return top; }
  } else {
    state.patronChallengeTicks = 0;
  }
  return cur; // patron holds (buffered)
}

/** The contest roll weight of a deity: legitimacy (primary) + share (secondary), patron amplified by its own legitimacy. @param {any} state @param {string} k @param {string} patronRef */
function contestWeightOf(state, k, patronRef) {
  const T = RELIGION_TUNING;
  const d = state.deities[k];
  const legit = clamp01(Number(d.legitimacy) || 0);
  let w = T.CONTEST_LEGIT_W * legit + T.CONTEST_SHARE_W * (Math.max(0, Number(d.share) || 0) / 100);
  if (k === patronRef) w *= (1 + T.CONTEST_PATRON_AMP * legit * legit);   // legitimacy² ⇒ a discredited patron loses its shield
  return Math.max(1e-6, w);
}

/** Whether the patron's niche is contested (a rival shares it). @param {any} state @returns {boolean} */
export function patronNicheContested(state) {
  const active = activeRefs(state.deities);
  const patronRef = state.patronRef && state.deities[state.patronRef] && !state.deities[state.patronRef].suppressed ? state.patronRef : null;
  if (!patronRef) return false;
  const niche = state.deities[patronRef].niche;
  return active.some((k) => k !== patronRef && state.deities[k].niche === niche);
}

/**
 * The DETERMINISTIC odds the patron contest would resolve by — the normalized
 * top-three weights (the same weighting resolvePatronContest rolls on). Returns null
 * when the patron niche is NOT contested. This is the "what happens next" forecast a
 * preview surfaces; the seeded roll in the pulse decides the actual outcome.
 * @param {any} state
 * @returns {Array<{ deityRef: string, name: string, odds: number, isPatron: boolean }> | null}
 */
export function patronContestOdds(state) {
  if (!patronNicheContested(state)) return null;
  const active = activeRefs(state.deities);
  const patronRef = state.patronRef;
  const top3 = active.slice().sort((a, b) => (contestWeightOf(state, b, patronRef) - contestWeightOf(state, a, patronRef)) || codepoint(a, b)).slice(0, 3);
  const ws = top3.map((k) => contestWeightOf(state, k, patronRef));
  const total = ws.reduce((s, w) => s + w, 0) || 1;
  return top3.map((k, i) => ({ deityRef: k, name: state.deities[k].snapshot?.name || k, odds: ws[i] / total, isPatron: k === patronRef }));
}

/**
 * Resolve a CONTESTED patron niche — a rival shares the patron's niche (e.g. a
 * DM-imposed cult planted in the patron's own domain, a schism). The top-three
 * faiths re-contest the patron seat via a SEEDED weighted roll: weight = legitimacy
 * (primary) blended with adherent share (secondary), the standing patron amplified
 * by its OWN legitimacy (a commanding patron almost always holds; a shaky one faces
 * a real fight). A decisive winner must take the roll for PATRON_FLIP_TICKS ticks
 * running (the siege) before it resolves — then it holds the patron seat and the
 * losing same-niche rival(s) are suppressed, clearing the schism. Until then the
 * patron seat holds and the rival keeps climbing. Mutates state.
 *
 * Returns true if it OWNED the patron seat this tick (caller skips selectPatron);
 * false when the niche is uncontested (caller runs the deterministic flip).
 * @param {any} state
 * @param {{ weightedPick: (items: any[], weights: number[]) => any }} rng
 */
export function resolvePatronContest(state, rng) {
  const active = activeRefs(state.deities);
  const patronRef = state.patronRef && state.deities[state.patronRef] && !state.deities[state.patronRef].suppressed ? state.patronRef : null;
  const patronNiche = patronRef ? state.deities[patronRef].niche : null;
  const contested = patronRef && active.some((k) => k !== patronRef && state.deities[k].niche === patronNiche);
  if (!contested) { state.patronSiegeRef = null; state.patronSiegeTicks = 0; return false; }

  const T = RELIGION_TUNING;
  const weightOf = (/** @type {string} */ k) => contestWeightOf(state, k, patronRef);
  const top3 = active.slice().sort((a, b) => (weightOf(b) - weightOf(a)) || codepoint(a, b)).slice(0, 3);
  const winner = String(rng.weightedPick(top3, top3.map(weightOf)));

  // Siege hysteresis: a faith must win the roll PATRON_FLIP_TICKS ticks running.
  if (winner === state.patronSiegeRef) state.patronSiegeTicks = (state.patronSiegeTicks || 0) + 1;
  else { state.patronSiegeRef = winner; state.patronSiegeTicks = 1; }

  if (state.patronSiegeTicks >= T.PATRON_FLIP_TICKS) {
    // Resolve: the winner holds its niche; same-niche rivals are suppressed (latent).
    const winnerNiche = state.deities[winner].niche;
    for (const k of active) {
      if (k !== winner && state.deities[k].niche === winnerNiche) {
        state.deities[k] = { ...state.deities[k], suppressed: true, share: 0, standing: 'cult' };
      }
    }
    state.patronRef = winner;
    state.patronChallengeTicks = 0;
    state.patronSiegeRef = null;
    state.patronSiegeTicks = 0;
    renormShares(state.deities);
    for (const k of activeRefs(state.deities)) state.deities[k].standing = standingFor(state.deities[k].share, state.deities[k].standing);
  }
  return true;
}

/** The patron deity's snapshot, for the derived `primaryDeitySnapshot` compat mirror. @param {any} state */
export function patronSnapshot(state) {
  const ref = state?.patronRef;
  return ref && state.deities?.[ref] ? state.deities[ref].snapshot : null;
}
