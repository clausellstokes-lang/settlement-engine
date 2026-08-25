/**
 * faithPanelModel.js — the pure, player-safe read-model for the dossier FAITH
 * surface (Phase 4 W-F6). Turns a settlement's LANDED faith outputs
 * (config.primaryDeitySnapshot / cultDeitySnapshots + the pulse-projected
 * config.faithProfile) into a display model the FaithSection renders — including
 * THE CAUSE CHAINS AS SENTENCES (the legibility law: every faith mechanism
 * explains itself in plain prose).
 *
 * Reads ONLY the settlement's own config + powerStructure — no worldState, no
 * store — so it works standalone (the "alive on day one" static state, embeds
 * only) AND live (post-pulse, with ranks / piety / legitimacy / the unaffiliated
 * sink). It NEVER reads config.latentPantheon: the unrevealed seed is private
 * (stripped by publicSafe.js / migration 128) and this model is what a FREE or
 * shared render consumes, so by construction it can never name a latent deity.
 *
 * Pure; no rng; no mutation.
 */

import { describeDeityEffects } from '../../domain/display/deityEffects.js';
import { divineMandateStatus } from '../../domain/worldPulse/religionState.js';

/** @param {unknown} x @param {number} [fallback] @returns {number} */
function num(x, fallback = 0) {
  return Number.isFinite(x) ? Number(x) : fallback;
}
/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

/**
 * A 0..1 legitimacy (a faith's rightful claim) → a band label + a tone key the
 * component maps to a theme colour. Matches the WarFaithSection bands.
 * @param {number} v @returns {{ label: string, tone: 'good'|'gold'|'bad' }}
 */
export function legitimacyBand(v) {
  if (v >= 0.75) return { label: 'secure', tone: 'good' };
  if (v >= 0.5) return { label: 'established', tone: 'gold' };
  if (v >= 0.25) return { label: 'tenuous', tone: 'gold' };
  return { label: 'contested', tone: 'bad' };
}

/** A 0..1 lagged piety reading → a devotion band label. @param {number} local01 @returns {string} */
export function pietyBandLabel(local01) {
  if (local01 >= 0.75) return 'devout';
  if (local01 >= 0.55) return 'faithful';
  if (local01 >= 0.38) return 'observant';
  if (local01 >= 0.2) return 'lukewarm';
  return 'secular';
}

/** The piety ARC: where the lagged reading is HEADING (structuralTarget vs local01).
 *  @param {number} local01 @param {number} target @returns {'rising'|'falling'|'steady'} */
export function pietyTrend(local01, target) {
  const d = target - local01;
  if (d > 0.02) return 'rising';
  if (d < -0.02) return 'falling';
  return 'steady';
}

// ── THE CAUSE CHAINS AS SENTENCES (the legibility law) ────────────────────────
// The faithProfile.piety.causes[] name the drivers; W-F6 renders them as prose.
// The three STRUCTURAL inputs (authority / institutions / devotion) render as
// bars, not sentences; these are the ARC drivers — why devotion is moving.
const CAUSE_SENTENCE = Object.freeze({
  conduct_drift: 'The town no longer lives like its god — devotion is ebbing.',
  conduct_alignment: 'The town lives by its god’s creed — devotion runs deep.',
  clergy_distortion: 'A compromised priesthood distorts the faith’s reach — the god arrives through bad priests.',
  opposed_rivals: 'The patron’s word is muted — an opposed rival presses close behind the seat.',
});
const STRUCTURAL_SOURCES = new Set(['religious_authority', 'institutions', 'devotion']);
const STRUCTURAL_LABEL = Object.freeze({
  religious_authority: 'Religious authority',
  institutions: 'Temples & orders',
  devotion: 'Patron devotion',
});

/**
 * The piety sub-model: the lagged reading + its arc, the amplifier receipt (owner:
 * "name both multipliers with causes"), the structural cause bars, and the cause
 * SENTENCES. Null when the settlement carries no projected piety record.
 * @param {any} piety a faithProfile.piety record @returns {object|null}
 */
function pietyModel(piety) {
  if (!piety || typeof piety !== 'object') return null;
  const local01 = clamp01(num(piety.local01));
  const target = clamp01(num(piety.structuralTarget, local01));
  const composite = num(piety.composite, 1);
  const localMult = num(piety.localMult, 1);
  const realmMult = num(piety.realmMult, 1);
  const causes = Array.isArray(piety.causes) ? piety.causes : [];
  // The amplifier RECEIPT: name the composite multiplier and its two factors.
  let amplifier = null;
  if (composite > 1.05) {
    amplifier = { dir: 'up', mult: composite, sentence: `Faith runs strong here — the gods’ influence is amplified ×${composite.toFixed(2)}.` };
  } else if (composite < 0.95) {
    amplifier = { dir: 'down', mult: composite, sentence: `Faith is thin here — the gods’ influence is dampened ×${composite.toFixed(2)}.` };
  }
  const bars = causes
    .filter((c) => STRUCTURAL_SOURCES.has(c?.source))
    .map((c) => ({ source: c.source, label: STRUCTURAL_LABEL[c.source] || c.source, value: clamp01(num(c.value)) }));
  const sentences = causes
    .filter((c) => CAUSE_SENTENCE[c?.source] && num(c.value) > 0.04)
    .map((c) => CAUSE_SENTENCE[c.source]);
  return {
    local01, target, trend: pietyTrend(local01, target), band: pietyBandLabel(local01),
    localMult, realmMult, composite, realmActive: Math.abs(realmMult - 1) > 0.001,
    amplifier, bars, sentences,
  };
}

/**
 * Build the faith display model for a settlement. Returns `{ hasEmbed: false }`
 * when the settlement carries no active patron (the free/latent/deity-free case —
 * the caller shows the generic true-neutral line or nothing). Otherwise a full
 * model: the patron + cults (static, always), plus the LIVE fields (ranks, piety,
 * unaffiliated, legitimacy, mandate) when a faithProfile has been projected.
 * @param {any} settlement
 * @returns {any}
 */
export function faithPanelModel(settlement) {
  const config = settlement?.config || {};
  const patronSnap = config.primaryDeitySnapshot || null;
  if (!patronSnap || typeof patronSnap !== 'object') return { hasEmbed: false };

  const cultsSnap = Array.isArray(config.cultDeitySnapshots) ? config.cultDeitySnapshots : [];
  const profile = config.faithProfile && typeof config.faithProfile === 'object' ? config.faithProfile : null;
  const live = !!(profile && Array.isArray(profile.deities) && profile.deities.length);

  const ranks = live
    ? profile.deities.map((d) => {
        const legitimacy = clamp01(num(d.legitimacy));
        return {
          name: d.name, share: Math.round(num(d.share)), standing: d.standing,
          legitimacy, isPatron: !!d.isPatron, band: legitimacyBand(legitimacy),
        };
      })
    : [];
  const unaffiliated = live && Number.isFinite(profile.unaffiliated) ? Math.round(profile.unaffiliated) : null;
  const contested = !!(profile && profile.contested);
  const patronSecurity = profile && Number.isFinite(profile.patronSecurity) ? clamp01(profile.patronSecurity) : null;
  const piety = pietyModel(profile && profile.piety);
  const mandate = divineMandateStatus(settlement);
  const effects = describeDeityEffects(patronSnap);

  // SECULARIZATION / REVIVAL: the unaffiliated sink, read through the piety arc
  // (the engine does not project the sink's own direction, so the piety trend is
  // the legible proxy — comfort drains, crisis reclaims). Owner's named phrases.
  let sinkSentence = null;
  if (unaffiliated != null && unaffiliated > 0 && piety) {
    if (piety.trend === 'falling') sinkSentence = `Comfort drains the pews — ${unaffiliated}% of the town keeps no god now.`;
    else if (piety.trend === 'rising') sinkSentence = `Crisis calls the faithful home — the unaffiliated (${unaffiliated}%) drift back to the temples.`;
  }

  return {
    hasEmbed: true, live,
    patron: {
      name: patronSnap.name,
      rankAxis: patronSnap.rankAxis || null,
      lawAxis: patronSnap.lawAxis && patronSnap.lawAxis !== 'neutral' ? patronSnap.lawAxis : null,
      domain: patronSnap.domain || patronSnap.portfolio || null,
      alignmentAxis: patronSnap.alignmentAxis || null,
    },
    cults: cultsSnap.map((c) => ({ name: c?.name, rankAxis: c?.rankAxis || null, domain: c?.domain || c?.portfolio || null })),
    effects, ranks, unaffiliated, contested, patronSecurity, piety, mandate, sinkSentence,
  };
}
