/**
 * livingWorldSignals.js — the pure presentation model behind the Library's
 * living-world card pips + the campaign "state of the realm" strip (UX overhaul
 * Phase 3, plan §4.2).
 *
 * REUSES THE SAME READ-MODELS the dossier's WarFaithSection / SummaryTab already
 * consume — it does NOT recompute geopolitical/faith state a second, divergent
 * way. The whole module is a thin projection over:
 *   - settlementWarStatus / liveSieges    (war / siege / occupied)
 *   - settlementWarExhaustion + band      (war-weary pip)
 *   - dispositionStandings                (W/L disposition chip)
 *   - computeAggressiveness               (aggressive / pacifist chip)
 *   - the embedded config.primaryDeitySnapshot (faith pip — glyph + rank,
 *     alignment-colored, via describeDeityEffects-adjacent axis fields)
 *   - deriveSystemState                   (4-dim resilience → health pip)
 *
 * SELF-GATING — the sacred invariant. `settlementSignals()` returns a model whose
 * `hasLiveWorld` is FALSE for a peaceful, non-campaign, deity-free settlement, so
 * the row renders NOTHING and the card looks exactly as it does today. The health
 * pip is always derivable (it is a pure function of the settlement, like the
 * dossier's promoted ReadSystemStateBar) but only floats a card up under the
 * "Needs attention" sort when a dimension is strained/critical.
 *
 * PRESENTATION ONLY. Pure, rng-free, no store, no React, no wall clock. Tolerates
 * a null/absent settlement, worldState, or graph and never throws.
 */

import {
  settlementWarStatus,
  settlementWarExhaustion,
  warExhaustionBand,
  dispositionStandings,
} from '../../domain/display/warStatus.js';
import { computeAggressiveness } from '../../domain/worldPulse/disposition.js';
import { deriveSystemState } from '../../domain/state/deriveSystemState.js';
import { BAND_COLOR } from '../../domain/state/bands.js';

// Alignment glyph + color for the faith pip. The deity snapshot carries
// `alignmentAxis` (good|evil|neutral) — we color the pip by it, matching the
// dossier's Faith Effects palette intent (good leans green, evil red, neutral
// gold). NEVER reads a legacy `tier`/`alignment` field.
const ALIGNMENT_STYLE = Object.freeze({
  good:    { color: '#1a5a28', glyph: '☼' },
  evil:    { color: '#8b1a1a', glyph: '☽' },
  neutral: { color: '#a0762a', glyph: '✦' },
});

/** The bands that mean "this settlement needs a DM's attention". Resilience is
 *  higher-is-better, so a low-resilience band is bad; volatility / externalThreat
 *  / resourcePressure are lower-is-better, so a HIGH band on those is bad. We map
 *  every dimension to a single "worst band" so the sort + dot read one scale. */
const ATTENTION_BANDS = new Set(['Vulnerable', 'Critical']);

/**
 * The worst (most-attention-needing) health band across the 4 dimensions, with a
 * numeric severity so the "Needs attention" sort can order strained-vs-critical.
 * For lower-is-better dims a HIGH value is the threat; deriveSystemState already
 * bands each dim on its own polarity-naive 0..100 score, so we invert the band for
 * the three "lower is better" dims before ranking.
 *
 * @param {any} settlement
 * @returns {{ band: string, color: string, severity: number, label: string } | null}
 */
export function healthPip(settlement) {
  let systemState;
  try {
    systemState = settlement ? deriveSystemState(settlement) : null;
  } catch {
    systemState = null;
  }
  if (!systemState) return null;

  // Polarity-aware: resilience is good-when-high; the other three are
  // bad-when-high. We translate each into a shared "health badness" 0..3 rank so
  // one dot + one sort key cover the card.
  const dims = [
    { key: 'resilience', higherIsBetter: true, dim: systemState.resilience },
    { key: 'volatility', higherIsBetter: false, dim: systemState.volatility },
    { key: 'externalThreat', higherIsBetter: false, dim: systemState.externalThreat },
    { key: 'resourcePressure', higherIsBetter: false, dim: systemState.resourcePressure },
  ];

  // Rank: Stable(0) < Strained(1) < Vulnerable(2) < Critical(3). For a
  // lower-is-better dim, a Stable band actually means LOW pressure = good, so the
  // band already reads correctly off bandFor (a low score → Critical band there
  // would mean "low pressure" which is GOOD). To avoid double-negation we instead
  // read each dim's own band but FLIP the badness for lower-is-better dims.
  const BAND_RANK = { Stable: 0, Strained: 1, Vulnerable: 2, Critical: 3 };
  let worst = null;
  for (const d of dims) {
    if (!d.dim || typeof d.dim.band !== 'string') continue;
    // deriveSystemState bands resilience so high score = Stable (good). For the
    // lower-is-better dims, a high score = Critical band already means "high
    // pressure = bad", so the band is the correct badness for ALL four dims.
    const rank = BAND_RANK[d.dim.band] ?? 1;
    if (!worst || rank > worst.rank) {
      worst = { rank, band: d.dim.band, key: d.key };
    }
  }
  if (!worst) return null;
  return {
    band: worst.band,
    color: BAND_COLOR[worst.band] || '#a0762a',
    severity: worst.rank,
    label: worst.band,
  };
}

/** Whether a settlement's health warrants the "Needs attention" float. */
export function needsAttention(settlement) {
  const pip = healthPip(settlement);
  return !!pip && ATTENTION_BANDS.has(pip.band);
}

/**
 * Resolve the embedded primary-deity faith pip for a settlement (the glyph + rank
 * + alignment color). Null when the settlement carries no assigned deity (the
 * byte-identical off-state — a deity-free card shows no faith pip).
 * @param {any} settlement
 * @returns {{ name: string, rank: string, color: string, glyph: string } | null}
 */
export function faithPip(settlement) {
  const deity = settlement?.config?.primaryDeitySnapshot || null;
  if (!deity || !deity.name) return null;
  const style = ALIGNMENT_STYLE[deity.alignmentAxis] || ALIGNMENT_STYLE.neutral;
  return {
    name: String(deity.name),
    rank: deity.rankAxis ? String(deity.rankAxis) : '',
    color: style.color,
    glyph: style.glyph,
  };
}

/**
 * Human posture for a centered-on-1.0 aggressiveness multiplier — the SAME bands
 * the dossier's WarFaithSection uses, condensed to the two ends the library pip
 * names (aggressive / pacifist). Returns null for an even-handed (≈1.0) town so
 * the chip self-gates: computeAggressiveness returns EXACTLY 1.0 when there is no
 * signal anywhere (no government tilt, no aggressive NPC, no deity, empty ledger).
 * @param {number} mult
 * @returns {{ label: string, color: string } | null}
 */
export function aggressionChip(mult) {
  if (!Number.isFinite(mult) || mult === 1.0) return null;
  if (mult > 1.18) return { label: 'Belligerent', color: '#8b1a1a' };
  if (mult > 1.04) return { label: 'Aggressive', color: '#a0762a' };
  if (mult < 0.82) return { label: 'Pacifist', color: '#1a5a28' };
  if (mult < 0.96) return { label: 'Cautious', color: '#1a4a2a' };
  return null; // inside the even-handed dead-band ⇒ no chip
}

/**
 * The full living-world signal model for ONE library card. Composes the war /
 * siege / occupied status, the faith pip, the disposition + aggression chips, and
 * the war-weary pip from the EXISTING read-models. `hasLiveWorld` is the gate the
 * row renders behind: FALSE ⇒ render nothing (a peaceful, deity-free, non-campaign
 * card is byte-identical to today). The health pip is returned separately because
 * it is always derivable and is not, by itself, "living world" (it shows for every
 * card via the Needs-attention sort, not the gated row).
 *
 * @param {Object} args
 * @param {any} args.settlement   the save's settlement object.
 * @param {string|null} args.settlementId  the save id (the campaign roster key).
 * @param {any} [args.worldState]  the owning campaign's live worldState, or null.
 * @param {any} [args.regionalGraph]  the owning campaign's regional graph, or null.
 * @param {(id:any)=>string} [args.nameFor]  id → display name resolver.
 * @returns {{
 *   hasLiveWorld: boolean,
 *   war: { besiegedBy: string[], besiegingTargets: string[], occupied: boolean } | null,
 *   faith: { name: string, rank: string, color: string, glyph: string } | null,
 *   aggression: { label: string, color: string } | null,
 *   standing: { wins: number, losses: number, score: number } | null,
 *   warWeary: { band: string, value: number } | null,
 *   names: { besiegedBy: string[], besiegingTargets: string[] },
 * }}
 */
export function settlementSignals({ settlement, settlementId, worldState = null, regionalGraph = null, nameFor = (id) => String(id) } = {}) {
  const id = settlementId != null ? String(settlementId) : (settlement?.id != null ? String(settlement.id) : null);

  // ── LIVE geopolitical state (only meaningful inside a campaign world) ──────
  const status = id && worldState
    ? settlementWarStatus({ settlementId: id, worldState, regionalGraph })
    : null;
  const occupied = !!status && status.besiegedBy.length > 0
    && occupationOf(worldState, id);
  const war = status
    ? { besiegedBy: status.besiegedBy, besiegingTargets: status.besiegingTargets, occupied }
    : null;

  const exhaustionRaw = id && worldState
    ? settlementWarExhaustion({ settlementId: id, worldState })
    : 0;
  const warWeary = exhaustionRaw > 0
    ? { band: warExhaustionBand(exhaustionRaw), value: exhaustionRaw }
    : null;

  const standing = id && worldState
    ? dispositionStandings(worldState).find(s => s.id === id) || null
    : null;

  // ── Settlement-local + deity (meaningful even without a campaign) ──────────
  const faith = faithPip(settlement);
  const item = { id: id || settlement?.id, settlement };
  const aggMult = computeAggressiveness(item, worldState || {});
  const aggression = aggressionChip(aggMult);

  // The gate. War status, exhaustion scar, disposition record, or an assigned
  // deity opens the row. A settlement-local "aggressive" disposition WITHOUT a
  // campaign or deity is NOT enough on its own — it mirrors the dossier
  // WarFaithSection gate (only LIVE state or a deity renders the block), keeping
  // a peaceful, non-campaign, deity-free card byte-identical. Aggression only
  // surfaces as an ADD-ON chip once the row is already open.
  const hasLiveWorld = !!war || !!warWeary || !!standing || !!faith;

  return {
    hasLiveWorld,
    war,
    faith,
    aggression: hasLiveWorld ? aggression : null,
    standing,
    warWeary,
    names: {
      besiegedBy: war ? war.besiegedBy.map(nameFor) : [],
      besiegingTargets: war ? war.besiegingTargets.map(nameFor) : [],
    },
  };
}

/**
 * Whether the besieged settlement has been OCCUPIED (regime change) by its
 * besieger — read off the worldState occupation ledger when present. Tolerant of
 * an absent ledger (returns false ⇒ "under siege" rather than "occupied").
 * @param {any} worldState @param {string|null} id @returns {boolean}
 */
function occupationOf(worldState, id) {
  if (!worldState || id == null) return false;
  const occ = worldState.occupations || worldState.conquest || null;
  if (occ && typeof occ === 'object') {
    const entry = occ[String(id)];
    if (entry && (entry.occupierId || entry.occupier || entry === true)) return true;
  }
  return false;
}
