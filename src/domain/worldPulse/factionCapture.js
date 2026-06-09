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
  guildEffectiveSecurity,
} from '../corruption.js';

export function advanceFactionCapture(worldState, snapshot, rng, { tick = 0, guildStrengthBy = null } = {}) {
  const factionStates = { ...(worldState.factionStates || {}) };
  const npcStates = worldState.npcStates || {};
  const climateBy = new Map();
  for (const item of (snapshot?.settlements || [])) {
    climateBy.set(String(item.id), readCorruptionClimate(item.settlement));
  }

  const transitions = [];
  for (const [fid, fs] of Object.entries(factionStates)) {
    const climate = climateBy.get(String(fs.settlementId)) || { security: 0.5, prosperity: 0.5, hasCriminalInst: false };

    // Highest-ranked corrupt seat-holder drives the climb.
    let maxCorruptRank = 0;
    for (const seat of Object.values(fs.internalSeats || {})) {
      const st = seat && seat.npcId ? npcStates[seat.npcId] : null;
      if (st && st.corruption) maxCorruptRank = Math.max(maxCorruptRank, st.dotRank || seat.dotRank || 1);
    }

    // §corruption Phase 3 — guild strength drags effective security down here too.
    const gs = guildStrengthBy ? guildStrengthBy.get(String(fs.settlementId)) : undefined;
    const effSecurity = gs != null ? guildEffectiveSecurity(climate.security, gs) : climate.security;

    const cur = fs.captureState || 'none';
    const local = rng.fork(`cap:${fid}:${tick}`);
    let next = cur;
    if (maxCorruptRank > 0 && climate.hasCriminalInst) {
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
