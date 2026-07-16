/**
 * pdf/lib/liveWorld.js — the PDF's LIVE-CAMPAIGN-WORLD view-model slice.
 *
 * This is the PDF's mirror of the screen's WarFaithTab (the war half's light
 * read-models) + the Realm Pantheon depth: it reads the LIVE campaign ledgers
 * through the SAME pure display selectors the screen consumes — NEVER
 * recomputing anything — so the printed artifact and the screen can never
 * disagree (no screen↔PDF drift):
 *
 *   - settlementWarStatus / liveTradeWars / dispositionStandings  (warStatus.js)
 *   - settlementWarExhaustion / warExhaustionBand / occupiedSettlements
 *   - settlementMobilization                                (mobilizationStatus.js)
 *   - deployedArmyStatus                                    (armyStrength.js)
 *   - settlementOccupation / occupierHoldings               (occupationStatus.js)
 *   - settlementTradePressure                               (tradePressure.js)
 *   - pantheonStandings / deityDisplayName                  (pantheonDepth.js)
 *   - realmArcLines                                         (realmArcSummary.js)
 *   - describeDeityEffects                                  (deityEffects.js)
 *   - computeAggressiveness                                 (disposition.js)
 *   - divineMandateStatus / patronContestOdds               (religionState.js)
 *
 * W4h RE-ADOPTION. `deployedArmyStatus` (armyStrength.js) and
 * `settlementTradePressure` (tradePressure.js) are now present in this tree (the
 * W4h domain-display port brought the two pure read-models the earlier war/faith
 * port dropped), so the two B-track surfaces they feed — the army-in-the-field
 * line and the trade-pressure ties — are WIRED instead of stubbed. Both remain
 * PLAYER-SAFE (includeCovert defaults false ⇒ no covert smuggling / GM state) and
 * self-gating: an army-less / trade-less settlement still collapses to the exact
 * off-state (`army: null`, `tradePressure: []`), so a peacetime save is unchanged.
 *
 * THE DEITY SNAPSHOT FIELDS ARE `rankAxis` / `alignmentAxis` / `temperamentAxis`
 * (the embedded `config.primaryDeitySnapshot`). We READ those `*Axis` fields —
 * NEVER a legacy `tier` / `alignment`. describeDeityEffects already enforces
 * this; the deity descriptor below carries the axis fields through verbatim.
 *
 * DORMANCY / BYTE-IDENTITY GUARANTEE. The slice is `null` whenever there is no
 * live geopolitical status AND no assigned deity. Because every selector already
 * returns `[]`/`null` for an absent/dormant ledger, a settlement with no campaign
 * (campaign === null), an empty worldState, peacetime, or a deity-free save all
 * collapse to the same `null` ⇒ the Faith & War chapter renders nothing.
 *
 * PREMIUM DATA GATE. The caller passes `campaign` ONLY for premium exports, and
 * SettlementPDF gates the FaithWar chapter on a `faithUnlocked` flag on top of
 * this slice (mirroring the screen's FaithSection premium seam). Free/anon export
 * ⇒ no faith chapter, no deity names.
 *
 * WORKER-SAFE NAMING. The PDF renders in a Web Worker (F41); props are
 * structured-cloned, so `campaign` must be plain data — a `nameFor` FUNCTION
 * would fail the clone and force the main-thread fallback. Callers should pass a
 * plain `campaign.nameById` map instead; a legacy `nameFor` function is still
 * honored when present (non-worker callers), falling back to `String(id)`.
 *
 * Pure: no store, no React, no rng, no wall clock, no mutation.
 */

import {
  settlementWarStatus,
  liveTradeWars,
  dispositionStandings,
  settlementWarExhaustion,
  warExhaustionBand,
  occupiedSettlements,
} from '../../domain/display/warStatus.js';
import { settlementMobilization } from '../../domain/display/mobilizationStatus.js';
import { deployedArmyStatus } from '../../domain/display/armyStrength.js';
import { settlementOccupation, occupierHoldings } from '../../domain/display/occupationStatus.js';
import { settlementTradePressure } from '../../domain/display/tradePressure.js';
import { pantheonStandings, deityDisplayName } from '../../domain/display/pantheonDepth.js';
import { realmArcLines } from '../../domain/display/realmArcSummary.js';
import { describeDeityEffects } from '../../domain/display/deityEffects.js';
import { computeAggressiveness, AGGRESSION_TUNING } from '../../domain/worldPulse/disposition.js';
import { divineMandateStatus, patronContestOdds } from '../../domain/worldPulse/religionState.js';
// pdf-1: the living-world reads the on-screen dossier already shows — rumors,
// belief-divergence, M6d trade-flow drift, and pestilence — via the SAME pure
// display selectors, so the premium PDF stops printing a pre-spatial world.
import { settlementRumors } from '../../domain/display/settlementRumors.js';
import { settlementBeliefs } from '../../domain/display/settlementBeliefs.js';
import { settlementPestilence } from '../../domain/display/settlementPestilence.js';
import { flowDerivedDependency } from '../../domain/display/tradeFlowEconomics.js';
// ambition-fit-3: the peace engine's crown deliverable — the treaty table — for
// the campaign_state war-room PDF. renderAllTreaties is pure + self-resolving
// (names live in the doc) and returns null-degrading data when the ledger is dark.
import { renderAllTreaties } from '../../domain/display/treatyDocument.js';

/** Human posture band for a centered-on-1.0 aggressiveness multiplier. Mirrors
 * WarFaithSection.aggressionPosture so the printed posture matches the screen. */
function aggressionPosture(mult) {
  if (mult > 1.18) return 'Belligerent';
  if (mult > 1.04) return 'Assertive';
  if (mult < 0.82) return 'Pacific';
  if (mult < 0.96) return 'Cautious';
  return 'Even-handed';
}

/**
 * Resolve the settlement's id the same way the screen + selectors do — the live
 * ledgers key by save id, with the embedded settlement id as a fallback.
 * @param {any} settlement
 * @param {any} campaign
 * @returns {string|null}
 */
function resolveSettlementId(settlement, campaign) {
  const direct = campaign?.settlementId ?? settlement?.id ?? settlement?.saveId ?? null;
  return direct != null ? String(direct) : null;
}

/**
 * Build the PDF live-world slice for ONE settlement.
 *
 * @param {Object} args
 * @param {any} args.settlement   the raw settlement object (carries the embedded
 *                                primaryDeitySnapshot — meaningful even when
 *                                campaign is null).
 * @param {any} [args.campaign]   { worldState, regionalGraph, settlements?, nameById?, nameFor? }
 *                                or null for a non-campaign / free / anon export.
 * @returns {null | object}
 */
export function buildPdfLiveWorld({ settlement, campaign } = /** @type {any} */ ({})) {
  const s = settlement || null;
  const worldState = campaign?.worldState || null;
  const regionalGraph = campaign?.regionalGraph || campaign?.worldState?.regionalGraph || null;
  const id = resolveSettlementId(s, campaign);

  // Worker-safe naming: prefer a plain nameById map (structured-cloneable);
  // honor a legacy nameFor function for non-worker callers; fall back to String.
  const nameById = campaign?.nameById && typeof campaign.nameById === 'object' ? campaign.nameById : null;
  /** @type {(rawId: any) => string} */
  const nameFor = typeof campaign?.nameFor === 'function'
    ? campaign.nameFor
    : nameById
      ? (rawId) => nameById[String(rawId)] || String(rawId)
      : (rawId) => String(rawId);

  // ── Live military status for THIS settlement ─────────────────────────────
  const status = id ? settlementWarStatus({ settlementId: id, worldState, regionalGraph }) : null;
  const exhaustionRaw = id ? settlementWarExhaustion({ settlementId: id, worldState }) : 0;
  const standing = id
    ? dispositionStandings(worldState).find(d => d.id === id) || null
    : null;
  const tradeWarsRaw = id
    ? liveTradeWars({ worldState, regionalGraph }).filter(
        t => t.winnerId === id || t.incumbentId === id || t.buyerId === id,
      )
    : [];

  // Occupation provenance — read the embedded snapshot only (presentation-only).
  const occItems = Array.isArray(campaign?.settlements) ? campaign.settlements : [];
  const occupiedRow = id
    ? occupiedSettlements(occItems).find(o => o.id === id) || null
    : null;

  // ── B-track surfaces (heuristic, PLAYER-SAFE). The PDF is shareable/exported, so
  // covert state is EXCLUDED (includeCovert defaults false) — same channel-
  // visibility convention as the screen's WarFaithTab + the gallery sanitizer.
  // W4h: deployedArmyStatus + settlementTradePressure are now present ⇒ the army-
  // in-the-field + trade-pressure surfaces are WIRED (each self-gates to null / []).
  const mobilization = id ? settlementMobilization({ settlementId: id, worldState }) : null;
  const army = id ? deployedArmyStatus({ settlementId: id, worldState, nameFor }) : null;
  const occupationLive = id ? settlementOccupation({ settlementId: id, worldState, nameFor }) : null;
  const holdings = id ? occupierHoldings({ settlementId: id, worldState, nameFor }) : null;
  const tradeTies = id
    ? settlementTradePressure({ settlementId: id, regionalGraph, settlements: occItems, worldState, includeCovert: false, nameFor })
    : [];

  // ── pdf-1: the living-world reads the screen dossier already shows ────────
  // Rumors — the PLAYER projection (includeGroundTruth:false ⇒ the shareable-safe
  // ledger: no DM truth block, deity names scrubbed to activated-only). Capped for
  // the print surface. Belief-divergence — the DM projection (includeGroundTruth:
  // true), which surfaces ONLY through this chapter's premium/canon/live three-fold
  // gate (a free/anon export never renders FaithWar, so DM belief truth never reaches
  // a non-premium artifact). Flow-drift + pestilence are qualitative, player-safe.
  const rumors = id
    ? settlementRumors({ worldState, settlementId: id, includeGroundTruth: false, nameFor })
        .slice(0, 8)
        .map(r => ({ id: r.id, headline: r.headline, detail: r.detail, distance: r.distance, freshness: r.freshness, significance: r.significance }))
    : [];
  const beliefs = id
    ? settlementBeliefs({ worldState, observerId: id, includeGroundTruth: true, nameFor })
        .map(b => {
          const believed = /** @type {{ strengthWord?: string, readinessWord?: string }} */ (b.believed || {});
          return {
            subject: b.subjectName,
            strength: believed.strengthWord,
            readiness: believed.readinessWord,
            confidence: b.confidence,
            staleness: b.staleness,
            divergence: Array.isArray(b.divergence) ? b.divergence : [],
          };
        })
    : [];
  const flowDriftRaw = id ? flowDerivedDependency({ worldState, economicState: s?.economicState, settlementId: id }) : null;
  const flowDrift = flowDriftRaw
    ? { band: flowDriftRaw.band, label: flowDriftRaw.label, headline: flowDriftRaw.headline, inbound: flowDriftRaw.inbound, outbound: flowDriftRaw.outbound }
    : null;
  const pestilenceRaw = id ? settlementPestilence({ worldState, settlementId: id, settlement: s, includeGroundTruth: false, nameFor }) : null;
  const pestilence = pestilenceRaw
    ? { phase: pestilenceRaw.phase, presence: pestilenceRaw.presence, severity: pestilenceRaw.severity, originFiction: pestilenceRaw.originFiction, care: pestilenceRaw.care }
    : null;

  // ── Settlement-local aggressiveness (meaningful even without a campaign) ──
  const aggrItem = { id: id || s?.id, settlement: s };
  const aggressiveness = computeAggressiveness(aggrItem, worldState || {});

  // ── Deity (axis fields, NEVER tier/alignment) ────────────────────────────
  const snap = s?.config?.primaryDeitySnapshot || null;
  const deity = snap
    ? {
        name: snap.name || 'Unnamed deity',
        // READ the *Axis fields — the snapshot carries rankAxis/alignmentAxis/
        // temperamentAxis, NOT a legacy tier/alignment.
        rankAxis: snap.rankAxis || null,
        alignmentAxis: snap.alignmentAxis || null,
        temperamentAxis: snap.temperamentAxis || null,
        // lawAxis — a legacy 3-axis snapshot has none ⇒ null ⇒ no law tag.
        lawAxis: snap.lawAxis && snap.lawAxis !== 'neutral' ? snap.lawAxis : null,
        domain: snap.domain || null,
        effects: describeDeityEffects(snap),
      }
    : null;

  // ── Living pantheon (campaign only): the evolved per-settlement faith state —
  //    patron + cults with adherent share, standing, and LEGITIMACY (the rightful
  //    claim). Mirrors WarFaithSection so the printed pantheon matches the screen.
  const religionState = id && worldState?.religionStates ? worldState.religionStates[id] : null;
  const livePantheon = religionState?.deities
    ? Object.values(religionState.deities)
        .filter((/** @type {any} */ d) => !d.suppressed)
        .map((/** @type {any} */ d) => ({
          name: d.snapshot?.name || String(d.deityRef),
          share: Number(d.share) || 0,
          standing: d.standing || 'cult',
          legitimacy: Math.max(0, Math.min(1, Number(d.legitimacy) || 0)),
          isPatron: d.deityRef === religionState.patronRef,
        }))
        .sort((/** @type {any} */ a, /** @type {any} */ b) => b.share - a.share)
    : [];
  // The patron-contest forecast (a schism in the patron's niche), null when uncontested.
  const contestOdds = religionState ? patronContestOdds(religionState) : null;
  // The divine mandate (royal/theocratic regimes only): whether the faith props or weakens
  // the throne. Reads config.faithProfile (pulse-projected) + government ⇒ null off-campaign.
  const mandate = divineMandateStatus(s);
  // DM-imposed cults — minor faiths beneath the patron (present even without a campaign).
  const cults = Array.isArray(s?.config?.cultDeitySnapshots)
    ? s.config.cultDeitySnapshots.filter(Boolean).map((/** @type {any} */ c) => ({
        name: c.name || 'a cult', rankAxis: c.rankAxis || null,
        alignmentAxis: c.alignmentAxis || null, temperamentAxis: c.temperamentAxis || null,
      }))
    : [];

  // ── Self-gating: nothing live AND no faith of any kind ⇒ dormant ⇒ null. ───
  // This is the byte-identity seam: identical result with/without an empty
  // worldState, and identical result for campaign === null.
  // ambition-fit-3: the realm's treaties (war-room table). Realm-wide like the
  // on-screen TreatyPanel; empty when no negotiated peace stands ⇒ byte-inert.
  const treaties = renderAllTreaties(worldState).map(doc => ({
    pairKey: doc.pairKey,
    title: doc.title,
    victorName: doc.victorName,
    loserName: doc.loserName,
    complianceState: doc.complianceState,
    frayingLine: doc.frayingLine,
    summary: doc.summary && typeof doc.summary === 'object' ? doc.summary.line : null,
    terms: (doc.termLines || []).map(t => ({
      label: t.label, yearsRemaining: t.yearsRemaining, complianceState: t.complianceState, strainLine: t.strainLine,
    })),
  }));

  const hasLive = !!status || exhaustionRaw > 0 || !!standing || tradeWarsRaw.length > 0 || !!occupiedRow
    || !!mobilization || !!army || !!occupationLive || !!holdings || tradeTies.length > 0
    // pdf-1: the new living-world reads also count as "live" — a settlement with only
    // rumors / beliefs / trade-drift / pestilence (no war, no deity) still earns the
    // chapter. Dormant worlds return [] / null from every selector ⇒ byte-identical.
    || rumors.length > 0 || beliefs.length > 0 || !!flowDrift || !!pestilence
    // ambition-fit-3: a standing treaty earns the war-room chapter too.
    || treaties.length > 0;
  if (!hasLive && !deity && !cults.length && !livePantheon.length) return null;

  const tradeWars = tradeWarsRaw.map(t => {
    // pdf-export-1: when THIS settlement is the buyer, it is the contested MARKET
    // (the prize), not a combatant — self-referential 'Contesting X (OwnName)' was
    // the bug. Name the winner who now supplies the prize.
    const role = t.buyerId === id ? 'market'
      : t.winnerId === id ? 'supplier'
        : t.incumbentId === id ? 'displaced'
          : 'contesting';
    return {
      prizeId: t.prizeId,
      role: /** @type {'market'|'supplier'|'displaced'|'contesting'} */ (role),
      commodityLabel: t.commodityLabel,
      buyer: nameFor(t.buyerId),
      winner: nameFor(t.winnerId),
    };
  });

  return {
    hasLive,
    atWar: !!status?.atWar,
    besiegingTargets: (status?.besiegingTargets || []).map(nameFor),
    besiegedBy: (status?.besiegedBy || []).map(nameFor),
    occupied: occupiedRow ? { occupier: occupiedRow.occupier, sinceTick: occupiedRow.sinceTick } : null,
    posture: {
      label: aggressionPosture(aggressiveness),
      value: aggressiveness,
      deityWeight: AGGRESSION_TUNING.W_DEITY,
    },
    exhaustion: exhaustionRaw > 0
      ? { value: exhaustionRaw, band: warExhaustionBand(exhaustionRaw) }
      : null,
    standing: standing ? { wins: standing.wins, losses: standing.losses, score: standing.score } : null,
    tradeWars,
    // ── B-track heuristic surfaces (player-safe; mirror WarFaithTab) ──────
    mobilization: mobilization ? { phrase: mobilization.phrase, ticksToDeploy: mobilization.ticksToDeploy } : null,
    army: army ? { targetName: army.targetName, remainingPhrase: army.remainingPhrase, conditionPhrase: army.conditionPhrase } : null,
    occupationLive: occupationLive
      ? { occupierName: occupationLive.occupierName, statePhrase: occupationLive.statePhrase, resistancePhrase: occupationLive.resistancePhrase }
      : null,
    holdings: holdings
      ? { holds: holdings.holds.map(h => h.name), stretchedThin: holdings.stretchedThin, strengthened: holdings.strengthened }
      : null,
    tradePressure: tradeTies.map(t => ({ partnerName: t.partnerName, phrase: t.phrase, role: t.role })),
    deity,
    // Realm-scope context (pantheon + named arcs) — same selectors the Realm
    // surfaces read. Both [] when religion / war is dormant.
    pantheon: pantheonStandings(worldState).map(p => ({
      id: p.id,
      name: deityDisplayName(p.id),
      seats: p.seats,
      tier: p.tier,
      wins: p.wins,
      losses: p.losses,
      fromMajor: p.fromMajor,
    })),
    realmArcs: realmArcLines({ worldState, regionalGraph, settlements: occItems }),
    // ── Per-settlement living pantheon (distinct from realm-scope `pantheon`) ──
    livePantheon,
    contestOdds,
    mandate,
    cults,
    // ── pdf-1: the new living-world reads (parity with the on-screen dossier) ──
    rumors,
    beliefs,
    flowDrift,
    pestilence,
    // ── ambition-fit-3: the realm's treaty table (the war-room's crown page) ──
    treaties,
  };
}

export default buildPdfLiveWorld;
