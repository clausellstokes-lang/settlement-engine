/**
 * pdf/lib/liveWorld.js — the PDF's LIVE-CAMPAIGN-WORLD view-model slice.
 *
 * This is the PDF's mirror of the screen's WarFaithSection + the Realm
 * Pantheon depth: it reads the LIVE campaign ledgers through the SAME pure
 * display selectors the screen consumes — NEVER recomputing anything — so the
 * printed artifact and the screen can never disagree (no screen↔PDF drift):
 *
 *   - settlementWarStatus / liveSieges / activeDeployments  (warStatus.js)
 *   - liveTradeWars / dispositionStandings                  (warStatus.js)
 *   - settlementWarExhaustion / warExhaustionBand           (warStatus.js)
 *   - occupiedSettlements                                   (warStatus.js)
 *   - pantheonStandings                                     (pantheonDepth.js)
 *   - realmArcLines                                         (realmArcSummary.js)
 *   - describeDeityEffects                                  (deityEffects.js)
 *   - computeAggressiveness                                 (disposition.js)
 *
 * THE DEITY SNAPSHOT FIELDS ARE `rankAxis` / `alignmentAxis` / `temperamentAxis`
 * (the embedded `config.primaryDeitySnapshot`). We READ those `*Axis` fields —
 * NEVER a legacy `tier` / `alignment` (a known prior bug). describeDeityEffects
 * already enforces this; the deity descriptor below carries the axis fields
 * through verbatim.
 *
 * DORMANCY / BYTE-IDENTITY GUARANTEE. The slice is `null` whenever there is no
 * live geopolitical status AND no assigned deity. Because every selector already
 * returns `[]`/`null` for an absent/dormant ledger, a settlement with no campaign
 * (campaign === null), an empty worldState, peacetime, or a deity-free save all
 * collapse to the same `null` ⇒ the Faith & War chapter renders nothing and the
 * additive section enrichments stay off ⇒ the PDF is byte-identical to today.
 *
 * PREMIUM DATA GATE. The caller passes `campaign` ONLY for premium exports
 * (SettlementDetail's export path). A free/anon export passes `campaign: null`
 * ⇒ no worldState reaches here ⇒ `liveWorld` is `null`. The gate is at the data
 * layer, not in this module.
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
 * @param {any} [args.campaign]   { worldState, regionalGraph, settlements?, nameFor? }
 *                                or null for a non-campaign / free / anon export.
 * @returns {null | {
 *   hasLive: boolean,
 *   atWar: boolean,
 *   besiegingTargets: string[],
 *   besiegedBy: string[],
 *   occupied: { occupier: string, sinceTick: number|null } | null,
 *   posture: { label: string, value: number, deityWeight: number },
 *   exhaustion: { value: number, band: string } | null,
 *   standing: { wins: number, losses: number, score: number } | null,
 *   tradeWars: Array<{ prizeId: string, role: 'supplier'|'displaced'|'contesting', commodityLabel: string, buyer: string }>,
 *   mobilization: { phrase: string, ticksToDeploy: number } | null,
 *   army: { targetName: string, remainingPhrase: string, conditionPhrase: string } | null,
 *   occupationLive: { occupierName: string, statePhrase: string, resistancePhrase: string } | null,
 *   holdings: { holds: string[], stretchedThin: boolean, strengthened: boolean } | null,
 *   tradePressure: Array<{ partnerName: string, phrase: string, role: 'dependent'|'supplier'|'partner' }>,
 *   deity: { name: string, rankAxis: string|null, alignmentAxis: string|null, temperamentAxis: string|null, lawAxis: string|null, domain: string|null, effects: string[] } | null,
 *   pantheon: Array<{ id: string, name: string, seats: number, tier: string, wins: number, losses: number, fromMajor: number }>,
 *   realmArcs: string[],
 *   livePantheon: Array<{ name: string, share: number, standing: string, legitimacy: number, isPatron: boolean }>,
 *   contestOdds: Array<{ deityRef: string, name: string, odds: number, isPatron: boolean }> | null,
 *   mandate: { propping: boolean, phrase: string } | null,
 *   cults: Array<{ name: string, rankAxis: string|null, alignmentAxis: string|null, temperamentAxis: string|null }>,
 * }}
 */
export function buildPdfLiveWorld({ settlement, campaign } = /** @type {any} */ ({})) {
  const s = settlement || null;
  const worldState = campaign?.worldState || null;
  const regionalGraph = campaign?.regionalGraph || campaign?.worldState?.regionalGraph || null;
  const id = resolveSettlementId(s, campaign);

  /** @type {(rawId: any) => string} */
  const nameFor = typeof campaign?.nameFor === 'function'
    ? campaign.nameFor
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
  // visibility convention as the screen's WarFaithSection + the gallery sanitizer.
  const mobilization = id ? settlementMobilization({ settlementId: id, worldState }) : null;
  const army = id ? deployedArmyStatus({ settlementId: id, worldState, nameFor }) : null;
  const occupationLive = id ? settlementOccupation({ settlementId: id, worldState, nameFor }) : null;
  const holdings = id ? occupierHoldings({ settlementId: id, worldState, nameFor }) : null;
  const tradeTies = id
    ? settlementTradePressure({ settlementId: id, regionalGraph, settlements: occItems, worldState, includeCovert: false, nameFor })
    : [];

  // ── Settlement-local aggressiveness (meaningful even without a campaign) ──
  const aggrItem = { id: id || s?.id, settlement: s };
  const aggressiveness = computeAggressiveness(aggrItem, worldState || {});

  // ── Deity (axis fields, NEVER tier/alignment) ────────────────────────────
  const snap = s?.config?.primaryDeitySnapshot || null;
  const deity = snap
    ? {
        name: snap.name || 'Unnamed deity',
        // READ the *Axis fields — the snapshot carries rankAxis/alignmentAxis/
        // temperamentAxis, NOT a legacy tier/alignment. (Known prior bug.)
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
  const hasLive = !!status || exhaustionRaw > 0 || !!standing || tradeWarsRaw.length > 0 || !!occupiedRow
    || !!mobilization || !!army || !!occupationLive || !!holdings || tradeTies.length > 0;
  if (!hasLive && !deity && !cults.length && !livePantheon.length) return null;

  const tradeWars = tradeWarsRaw.map(t => {
    const role = t.winnerId === id ? 'supplier'
      : t.incumbentId === id ? 'displaced'
        : 'contesting';
    return {
      prizeId: t.prizeId,
      role: /** @type {'supplier'|'displaced'|'contesting'} */ (role),
      commodityLabel: t.commodityLabel,
      buyer: nameFor(t.buyerId),
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
    // ── B-track heuristic surfaces (player-safe; mirror WarFaithSection) ──────
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
  };
}

export default buildPdfLiveWorld;
