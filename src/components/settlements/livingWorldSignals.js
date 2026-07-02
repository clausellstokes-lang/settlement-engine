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
  activeDeployments,
} from '../../domain/display/warStatus.js';
import { computeAggressiveness } from '../../domain/worldPulse/disposition.js';
import { deriveSystemState } from '../../domain/state/deriveSystemState.js';
import { BAND_COLOR } from '../../domain/state/bands.js';

// Alignment glyph + color for the faith pip. The deity snapshot carries
// `alignmentAxis` (good|evil|neutral) — we color the pip by it, matching the
// dossier's Faith Effects palette intent (good leans green, evil red, neutral
// gold). NEVER reads a legacy `tier`/`alignment` field. The neutral hue reuses
// the already-AA-vetted Strained band step (#8a5e10, 5.52:1 on card cream); the
// stale #a0762a copy was the same value the bands migrated AWAY from (3.98:1).
const ALIGNMENT_STYLE = Object.freeze({
  good:    { color: BAND_COLOR.Stable,   glyph: '☼' },   // #1a5a28
  evil:    { color: BAND_COLOR.Critical, glyph: '☽' },   // #8b1a1a
  neutral: { color: BAND_COLOR.Strained, glyph: '✦' },   // #8a5e10 (AA-vetted)
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
    color: BAND_COLOR[worst.band] || BAND_COLOR.Strained,
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
  // Hues reuse the AA-vetted band steps: belligerent/aggressive lean the war
  // reds/aged-gold (the 'Aggressive' gold was a stale 3.98:1 #a0762a copy →
  // Strained's 5.52:1 step), pacifist/cautious lean the Stable green.
  if (mult > 1.18) return { label: 'Belligerent', color: BAND_COLOR.Critical };  // #8b1a1a
  if (mult > 1.04) return { label: 'Aggressive', color: BAND_COLOR.Strained };   // #8a5e10 (AA-vetted)
  if (mult < 0.82) return { label: 'Pacifist', color: BAND_COLOR.Stable };       // #1a5a28
  if (mult < 0.96) return { label: 'Cautious', color: BAND_COLOR.Stable };       // #1a5a28
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
  // Occupation is read off the persistent occupation ledger, NOT conjoined with
  // an active siege. A regime-changed settlement stays in worldState.occupations
  // across ticks even after its siege front is torn down (conquest deletes the
  // war_front, so settlementWarStatus goes null), so gating occupation on an
  // active siege would wrongly hide the "Occupied" pip for a settlement that is
  // occupied but no longer besieged. Occupation therefore also OPENS the war
  // model on its own when there is no live front.
  const occupied = !!(id && worldState) && occupationOf(worldState, id);
  const war = (status || occupied)
    ? {
        besiegedBy: status ? status.besiegedBy : [],
        besiegingTargets: status ? status.besiegingTargets : [],
        occupied,
      }
    : null;

  // ── Change signal (P3: emphasize movement, not static state) ──────────────
  // A FRESH war out-shouts a long-standing one. The only delta with a real data
  // source on a Library card is siege ONSET freshness: a deployment targeting
  // (or launched by) this settlement whose `sinceTick` equals the world's
  // current tick is brand-new THIS tick. We expose `war.fresh` so the row can
  // mark a just-declared siege. Per-meter numeric deltas (food -2) have no
  // prior-tick snapshot in the save model and are deferred to the dossier.
  const currentTick = Number.isFinite(worldState?.tick) ? worldState.tick : null;
  let warFresh = false;
  if (war && currentTick != null && id && worldState) {
    const onsets = activeDeployments(worldState)
      .filter(d => d.targetId === id || d.homeId === id)
      .map(d => d.sinceTick);
    warFresh = onsets.length > 0 && Math.max(...onsets) >= currentTick;
  }
  if (war) war.fresh = warFresh;

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
