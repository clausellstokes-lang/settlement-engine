/**
 * factionCapture — §corruption Phase 2. Per-tick faction capture along the
 * engine's existing criminalCaptureState ladder (none → adversarial →
 * equilibrium → corrupted → capture).
 *
 *  • A faction with a corrupt seat-holder climbs toward 'capture' — FASTER the
 *    higher that member's seat (a corrupt leader pulls the faction down quicker
 *    than a corrupt agent). Security + prosperity damp the climb.
 *  • A faction with NO corrupt seat-holders recedes toward 'none' (faction-level
 *    self-cleaning, rising with security + prosperity).
 *
 * Pure transform over worldState.factionStates: reads npcStates (who's corrupt +
 * their seat) and the snapshot (per-settlement climate). rng forked per
 * (faction, tick) for deterministic replays. Must run AFTER seatNpcsIntoFactions
 * so internalSeats reflect the current corrupt roster.
 *
 * @returns {{ worldState: object, transitions: Array<object> }}
 */
import {
  readCorruptionClimate, captureAdvanceChance, captureRecoverChance, advanceCaptureState,
  guildEffectiveSecurity, hasCorruptingDeity,
} from '../corruption.js';

/**
 * The PARALLEL onset-style gate (a corrupt seat-holder climbs
 * the capture ladder only with `hasCriminalInst`) is relaxed the SAME way as
 * the corruption.js onset gate — an embedded EVIL deity also enables the climb
 * in a crime-free town, so the evil-deity effect is NOT half-applied. Gated
 * behind `religionActive` (the caller's religionDynamicsEnabled +
 * isSubsystemActive). false (default) ⇒ gate unrelaxed ⇒ byte-identical.
 *
 * @param {object} worldState
 * @param {any} snapshot
 * @param {{ fork: (k:string)=>{ random: ()=>number } }} rng
 * @param {{ tick?: number, guildStrengthBy?: Map<string, number>|null, religionActive?: boolean }} [opts]
 * @returns {{ worldState: object, transitions: Array<object> }}
 */
export function advanceFactionCapture(worldState, snapshot, rng, { tick = 0, guildStrengthBy = null, religionActive = false } = {}) {
  const factionStates = { ...(worldState.factionStates || {}) };
  const npcStates = worldState.npcStates || {};
  const climateBy = new Map();
  /** @type {Map<string, boolean>} */
  const corruptingDeityBy = new Map();
  for (const item of (snapshot?.settlements || [])) {
    climateBy.set(String(item.id), readCorruptionClimate(item.settlement));
    // Per-settlement evil-deity presence (only when the religion layer is
    // ACTIVE). Absent ⇒ false ⇒ the gate behaves exactly as before.
    corruptingDeityBy.set(String(item.id), religionActive && hasCorruptingDeity(item.settlement));
  }

  const transitions = [];
  for (const [fid, fs] of Object.entries(factionStates)) {
    const climate = climateBy.get(String(fs.settlementId)) || { security: 0.5, prosperity: 0.5, hasCriminalInst: false };
    // Relax the parallel gate with the same additive evil-deity term.
    const onsetEnabled = climate.hasCriminalInst || corruptingDeityBy.get(String(fs.settlementId)) === true;

    // Highest-ranked corrupt seat-holder drives the climb.
    let maxCorruptRank = 0;
    for (const seat of Object.values(fs.internalSeats || {})) {
      const st = seat && seat.npcId ? npcStates[seat.npcId] : null;
      if (st && st.corruption) maxCorruptRank = Math.max(maxCorruptRank, st.dotRank || seat.dotRank || 1);
    }

    // Guild strength drags effective security down here too.
    const gs = guildStrengthBy ? guildStrengthBy.get(String(fs.settlementId)) : undefined;
    const effSecurity = gs != null ? guildEffectiveSecurity(climate.security, gs) : climate.security;

    const cur = fs.captureState || 'none';
    const local = rng.fork(`cap:${fid}:${tick}`);
    let next = cur;
    if (maxCorruptRank > 0 && onsetEnabled) {
      if (local.random() < captureAdvanceChance({ rank: maxCorruptRank, security: effSecurity, prosperity: climate.prosperity })) {
        next = advanceCaptureState(cur, true);
      }
    } else if (cur !== 'none') {
      if (local.random() < captureRecoverChance({ security: effSecurity, prosperity: climate.prosperity })) {
        next = advanceCaptureState(cur, false);
      }
    }

    if (next !== cur) {
      factionStates[fid] = { ...fs, captureState: next };
      transitions.push({ factionId: fid, settlementId: fs.settlementId, name: fs.name, from: cur, to: next });
    }
  }
  return { worldState: { ...worldState, factionStates }, transitions };
}

/**
 * Settlement-level rollup: the worst (highest-ladder) faction capture in a
 * settlement, for mirroring onto settlement.powerStructure.criminalCaptureState
 * (which npcStructure + the dossier already read). Pure.
 */
export function settlementCaptureState(factionStates, settlementId) {
  const LADDER = ['none', 'adversarial', 'equilibrium', 'corrupted', 'capture'];
  let worst = 0;
  for (const fs of Object.values(factionStates || {})) {
    if (String(fs.settlementId) !== String(settlementId)) continue;
    const i = LADDER.indexOf(fs.captureState || 'none');
    if (i > worst) worst = i;
  }
  return LADDER[worst];
}

// ── Capture transitions reach the DM ────────────────────────────────────────
// advanceFactionCapture's transitions were recorded in the pulseRecord
// (factionCaptureEvents) and consumed by NOBODY: the underworld could capture
// the City Watch and the DM would never hear of it. The two builders below
// follow the stressorAftermath idiom — a Wizard-News entry for the Chronicle
// feed, and a permanent settlement.history.historicalEvents stamp for the
// transitions that cross into/out of full 'capture'.

const CAPTURED_RUNGS = new Set(['corrupted', 'capture']);

function newsworthyTransition(t) {
  // The institutional-corruption boundary and above: rung moves wholly below
  // 'corrupted' (none ↔ adversarial ↔ equilibrium) are posture, not news.
  return CAPTURED_RUNGS.has(t.to) || CAPTURED_RUNGS.has(t.from);
}

function transitionHeadline(t, settlementName) {
  if (t.to === 'capture') return `${t.name} of ${settlementName} falls under criminal control`;
  if (t.from === 'capture') return `${t.name} of ${settlementName} breaks the underworld's grip`;
  if (t.to === 'corrupted') return `${t.name} of ${settlementName} is compromised by the underworld`;
  return `${t.name} of ${settlementName} pushes the underworld back`;
}

function transitionSummary(t, settlementName) {
  if (t.to === 'capture') {
    return `${t.name} now answers to criminal interests; its formal authority in ${settlementName} is a front.`;
  }
  if (t.from === 'capture') {
    return `${t.name} is no longer run by criminal interests, though arrangements linger (${t.to.replace(/_/g, ' ')}).`;
  }
  if (t.to === 'corrupted') {
    return `Criminal interests hold systematic arrangements inside ${t.name}; decisions in ${settlementName} are being purchased.`;
  }
  return `${t.name} has loosened the underworld's arrangements (now ${t.to.replace(/_/g, ' ')}).`;
}

/**
 * Wizard-News entries for this tick's faction-capture transitions. Factual
 * headlines; 'major' significance for full capture and liberation (crossing
 * the 'capture' rung), 'notable' for the corrupted boundary. Pure;
 * timestamps threaded, never minted.
 *
 * @param {Array}    transitions  from advanceFactionCapture
 * @param {Function} nameFor      settlementId → display name
 * @param {number}   tick
 * @param {string}   [now]
 */
export function captureTransitionNewsEntries(transitions = [], nameFor = id => String(id), tick = 0, now = null) {
  const LADDER = ['none', 'adversarial', 'equilibrium', 'corrupted', 'capture'];
  return transitions.filter(newsworthyTransition).map(t => {
    const major = t.to === 'capture' || t.from === 'capture';
    const settlementName = nameFor(t.settlementId);
    return {
      id: `wizard_news.${tick}.faction_capture.${t.factionId}`,
      tick,
      scope: 'settlement',
      significance: major ? 'major' : 'notable',
      score: major ? 74 : 52,
      headline: transitionHeadline(t, settlementName),
      summary: transitionSummary(t, settlementName),
      kind: 'applied',
      impactKind: 'faction_capture',
      channelType: null,
      severity: Math.max(0, LADDER.indexOf(t.to)) / (LADDER.length - 1),
      settlementIds: [String(t.settlementId)],
      impactIds: [],
      channelIds: [],
      sourceEventId: t.factionId,
      tags: ['world_pulse', 'faction', 'capture', t.to],
      reasons: [`${t.name} moved ${t.from.replace(/_/g, ' ')} → ${t.to.replace(/_/g, ' ')} on the capture ladder.`],
      createdAt: now,
    };
  });
}

const MAX_CAMPAIGN_HISTORY_EVENTS = 20;

/**
 * Stamp a full-capture transition (into or out of 'capture') into the
 * settlement's permanent history — the historicalEvents record historyBeats
 * derives "defining crisis" / "recent disruption" from, same vocabulary and
 * caps as stressorAftermath's graduation stamp. Idempotent per
 * (faction, tick). Returns the same reference when nothing changed.
 */
export function withCaptureHistoryEvent(settlement, transition, tick) {
  if (!settlement || !transition) return settlement;
  const fell = transition.to === 'capture';
  if (!fell && transition.from !== 'capture') return settlement;
  const history = settlement.history || {};
  const events = Array.isArray(history.historicalEvents) ? history.historicalEvents : [];
  const eventId = `campaign.faction_capture.${transition.factionId}.${tick}`;
  if (events.some(e => e?.campaignEventId === eventId)) return settlement;

  const event = {
    campaignEventId: eventId,
    campaignEra: true,
    tick,
    yearsAgo: 0,
    name: fell ? `The Capture of ${transition.name}` : `The Liberation of ${transition.name}`,
    type: 'corruption_scandal',
    description: fell
      ? `${transition.name} fell under criminal control during the campaign — its formal authority became a front for the underworld.`
      : `${transition.name} broke from criminal control during the campaign, though the arrangements it operated under are remembered.`,
    severity: fell ? 'major' : 'moderate',
    lastingEffects: fell
      ? ['institutional corruption', 'selective enforcement']
      : ['lingering criminal arrangements'],
    plotHooks: [],
    anchored: true,
  };

  const campaignEvents = events.filter(e => e?.campaignEra);
  let nextEvents = [...events, event];
  if (campaignEvents.length + 1 > MAX_CAMPAIGN_HISTORY_EVENTS) {
    // Drop the OLDEST campaign-era entry (generation history is never pruned).
    const oldest = campaignEvents
      .slice()
      .sort((a, b) => (a.tick ?? 0) - (b.tick ?? 0))[0];
    nextEvents = nextEvents.filter(e => e !== oldest);
  }
  return { ...settlement, history: { ...history, historicalEvents: nextEvents } };
}

/**
 * Apply capture history to every affected settlement in a local map
 * (advanceCampaignWorld's settlement working set). Mirrors
 * recordGraduationsIntoHistory. Returns the count of settlements written.
 */
export function recordCaptureTransitionsIntoHistory(localSettlements, transitions = [], tick = 0) {
  let written = 0;
  for (const transition of transitions) {
    const key = String(transition.settlementId);
    const settlement = localSettlements.get(key);
    if (!settlement) continue;
    const next = withCaptureHistoryEvent(settlement, transition, tick);
    if (next !== settlement) {
      localSettlements.set(key, next);
      written += 1;
    }
  }
  return written;
}
