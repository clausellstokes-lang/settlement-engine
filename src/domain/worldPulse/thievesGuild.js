/**
 * thievesGuild — §corruption Phase 3. The macro feedback loop.
 *
 * The thieves-guild's STRENGTH accrues from the factions it has captured (those
 * at 'corrupted' or 'capture'): their POWER and their DIVERSITY. The strength
 * formula SATURATES (see guildStrength) so it can never run away. A stronger
 * guild then:
 *   • drags effective security DOWN in the corruption + capture ticks (the loop
 *     that "perpetuates things worse") — but bounded, never to zero; and
 *   • floors the criminal faction's POWER (it out-ranks rivals) while its
 *     LEGITIMACY is hard-capped — it can dominate power, never become legitimate.
 *
 * Pure data transforms — no rng/Date.
 */
import { stablePart } from './worldState.js';
import { guildStrength, GUILD_TUNING } from '../corruption.js';

const CRIMINAL_NAME_RE = /thieves|criminal|gang|smuggl|fence|black\s*market|underworld|assassin|syndicate|racket|shadow|hidden\s*hand/i;
const CAPTURED = new Set(['corrupted', 'capture']);

/**
 * Per-settlement guild strength (0..1), from the captured factions in that
 * settlement (power joined from the snapshot, diversity = distinct factions).
 * @returns {Map<string, number>} settlementId → strength
 */
export function computeGuildStrengthBy(worldState, snapshot) {
  const factionStates = worldState?.factionStates || {};

  // Index faction power per settlement from the snapshot's power structures.
  const powerBy = new Map(); // `${sid}:${stablePart(name)}` → power(0..100)
  for (const item of (snapshot?.settlements || [])) {
    const facs = item.settlement?.powerStructure?.factions || item.settlement?.factions || [];
    for (const f of facs) {
      powerBy.set(`${item.id}:${stablePart(f.name || f.faction || '')}`, Number(f.power) || 0);
    }
  }

  const captured = new Map(); // sid → { powers:[], archetypes:Set }
  for (const fs of Object.values(factionStates)) {
    if (!CAPTURED.has(fs.captureState)) continue;
    const sid = String(fs.settlementId);
    const entry = captured.get(sid) || { powers: [], archetypes: new Set() };
    entry.powers.push(powerBy.get(`${fs.settlementId}:${stablePart(fs.name)}`) ?? 40);
    entry.archetypes.add(fs.archetype || fs.name);
    captured.set(sid, entry);
  }

  const out = new Map();
  for (const [sid, e] of captured) {
    out.set(sid, guildStrength({ capturedPowers: e.powers, distinctArchetypes: e.archetypes.size }));
  }
  return out;
}

/**
 * Mirror the guild's strength onto a settlement: floor the criminal faction's
 * power and hard-cap its legitimacy, and stamp settlement.thievesGuildStrength
 * for the dossier. Pure; returns the same reference when nothing changed.
 */
export function applyGuildToSettlement(settlement, strength) {
  if (!settlement) return settlement;
  const s = Number(strength) || 0;
  const facs = settlement.powerStructure?.factions;
  let nextPower = null;
  if (Array.isArray(facs) && s > 0) {
    const floor = GUILD_TUNING.powerFloorBase + s * GUILD_TUNING.powerFloorRange;
    let changed = false;
    const mapped = facs.map((f) => {
      if (!CRIMINAL_NAME_RE.test(String(f.name || f.faction || ''))) return f;
      const power = Math.max(Number(f.power) || 0, floor);
      const legitimacy = Math.min(Number.isFinite(f.legitimacy) ? f.legitimacy : 50, GUILD_TUNING.legitimacyCap);
      if (power === f.power && legitimacy === f.legitimacy) return f;
      changed = true;
      return { ...f, power, legitimacy };
    });
    if (changed) nextPower = mapped;
  }
  if (settlement.thievesGuildStrength === s && !nextPower) return settlement;
  return {
    ...settlement,
    thievesGuildStrength: s,
    ...(nextPower ? { powerStructure: { ...settlement.powerStructure, factions: nextPower } } : {}),
  };
}
