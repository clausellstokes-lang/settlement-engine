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
import { GUILD_TUNING } from '../corruption.js';
import { detExp } from '../../kernel/detMath.js';
import { clamp01 } from '../../kernel/math.js';

const CRIMINAL_NAME_RE = /thieves|criminal|gang|smuggl|fence|black\s*market|underworld|assassin|syndicate|racket|shadow|hidden\s*hand/i;
const CAPTURED = new Set(['corrupted', 'capture']);

/**
 * Guild strength (0..1) from the factions it has captured. Saturating in total
 * captured power (so it asymptotes, never runs away) and lifted by diversity
 * (crime spread across many factions is harder to root out than one).
 *
 * Lives HERE rather than beside GUILD_TUNING in domain/corruption because
 * computeGuildStrengthBy below is its only caller and corruption is an eager
 * first-paint module: this is the whole reason the deterministic-kernel
 * saturation call stays out of the first-paint closure. `clamp01` is the kernel
 * primitive for corruption's private unit clamp — identical on every value this
 * function can produce, which is always finite.
 * @param {{capturedPowers?:number[], distinctArchetypes?:number}} args
 */
export function guildStrength({ capturedPowers = [], distinctArchetypes = 0 } = {}) {
  const totalShare = (Array.isArray(capturedPowers) ? capturedPowers : [])
    .reduce((a, p) => a + clamp01((Number(p) || 0) / 100), 0);
  const base = 1 - detExp(-totalShare * GUILD_TUNING.powerRate); // saturating
  const diversityMult = 0.6 + 0.4 * Math.min(1, (Number(distinctArchetypes) || 0) / GUILD_TUNING.diversityFull);
  return clamp01(base * diversityMult);
}

/**
 * Per-settlement guild strength (0..1), from the captured factions in that
 * settlement (power joined from the snapshot, diversity = distinct factions).
 * @param {any} worldState
 * @param {any} snapshot
 * @returns {Map<string, number>} settlementId → strength
 */
export function computeGuildStrengthBy(worldState, snapshot) {
  const factionStates = worldState?.factionStates || {};

  // Index faction power per settlement from the snapshot's power structures.
  const powerBy = new Map(); // `${sid}:${stablePart(name)}` → power(0..100)
  for (const item of (snapshot?.settlements || [])) {
    const facs = item.settlement?.powerStructure?.factions || item.settlement?.factions || [];
    for (const f of facs) {
      powerBy.set(`${item.id}:${stablePart(f.faction || f.name || '')}`, Number(f.power) || 0);
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
 * @param {any} settlement
 * @param {any} strength
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
      if (!CRIMINAL_NAME_RE.test(String(f.faction || f.name || ''))) return f;
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
