/**
 * domain/worldPulse/blockadeTransport.js — siege vs magical transport.
 *
 * While a blockade (siege/occupation) grips a settlement, its airship
 * infrastructure operates IMPAIRED: blockade runs still land cargo, but
 * against constant countermeasures — a severity-scaled 'access' impairment
 * stamped on the dock, lifted when the blockade ends. Teleportation circles
 * are untouched: point-to-point transit cannot be interdicted from outside
 * the walls (foodStockpile's blockadeBypass implements the matching food
 * math; this module makes the institution state visible to the dossier).
 *
 * Stamping is idempotent per (type, causeEventId) via withImpairment, and a
 * no-op equality check keeps the settlement object stable when nothing
 * changed — the soak loop stays bounded. Pure + deterministic; `now` must be
 * threaded by the caller (the world pulse bans wall clocks).
 */

import { withImpairment, withoutEventImpairments } from '../entities/status.js';

const AIRSHIP_RE = /airship/i;
const CAUSE_PREFIX = 'stressor-blockade:';

function blockadeSeverityToImpairment(severity) {
  // 0.4 (gate) → 0.46, 1.0 → 0.7: impaired, never inoperable — the dock
  // keeps flying, the math of HOW MUCH lands lives in foodStockpile.
  return Math.min(0.7, 0.3 + (severity ?? 0) * 0.4);
}

/**
 * @param {Object} settlement
 * @param {any} blockade - active siege/occupation stressor gripping this settlement, or null
 * @param {{ now?: string }} [options]
 */
export function applyBlockadeTransportImpairment(settlement, blockade, { now } = {}) {
  const institutions = settlement?.institutions;
  if (!Array.isArray(institutions) || institutions.length === 0) return settlement;

  let changed = false;
  const next = institutions.map((inst) => {
    if (!AIRSHIP_RE.test(String(inst?.name || ''))) return inst;

    if (blockade) {
      const causeEventId = `${CAUSE_PREFIX}${blockade.id}`;
      const severity = blockadeSeverityToImpairment(blockade.severity);
      const existing = (inst.impairments || []).find(
        (im) => im?.type === 'access' && im?.causeEventId === causeEventId
      );
      if (existing && existing.severity === severity) return inst; // already stamped at this grip
      changed = true;
      return withImpairment(inst, {
        type: 'access',
        severity,
        causeEventId,
        description:
          'Blockade running: airship traffic operates under siege countermeasures at reduced throughput.',
        appliedAt: now,
      });
    }

    // No active blockade: lift every impairment this module ever stamped.
    const stale = (inst.impairments || []).filter(
      (im) => String(im?.causeEventId || '').startsWith(CAUSE_PREFIX)
    );
    if (!stale.length) return inst;
    changed = true;
    let cleared = inst;
    for (const im of stale) cleared = withoutEventImpairments(cleared, im.causeEventId);
    return cleared;
  });

  return changed ? { ...settlement, institutions: next } : settlement;
}
