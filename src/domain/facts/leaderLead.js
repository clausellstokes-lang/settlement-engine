/**
 * domain/facts/leaderLead.js — THE LEADER'S LEAD (W2-A-LEAVES, 2026-11-12; the class table §5.1's homeless
 * condition "a leader's lead", pattern 4: "three powers stand almost level" beside a ruler far ahead).
 *
 * Who leads, and by how much. The standing sentences (`generators/power/factionStanding.js`) compare a power
 * with its neighbours and never with the leader; this leaf is the one reading of the margins against the
 * leader (and between neighbours), so a line that says "level" reads the leader's margin too. The leaf states
 * margins and decides nothing: the threshold a sentence holds is that sentence's own (the standings' step).
 *
 * Layer 3 (it reads the powers, stored at layer 2). Pure: no randomness, no clock, no write.
 */

/**
 * @param {unknown} factions the record's `powerStructure.factions` (or the list a step holds)
 * @returns {{ leader: string|null, powers: number[], leadOverSecond: number|null, leadOverThird: number|null, gaps: number[] }}
 *   `gaps[i]` is the margin between the i-th and the (i+1)-th power, strongest first
 */
export function leaderLeadOf(factions) {
  const rows = (Array.isArray(factions) ? factions : [])
    .map((f) => (f && typeof f === 'object' ? /** @type {{ power?: unknown, faction?: unknown, name?: unknown }} */ (f) : {}))
    .filter((f) => typeof f.power === 'number' && Number.isFinite(f.power))
    .sort((a, b) => /** @type {number} */ (b.power) - /** @type {number} */ (a.power));
  const powers = rows.map((f) => /** @type {number} */ (f.power));
  const leadOverSecond = powers.length >= 2 ? powers[0] - powers[1] : null;
  const leadOverThird = powers.length >= 3 ? powers[0] - powers[2] : null;
  return {
    leader: rows.length ? String(rows[0].faction ?? rows[0].name ?? '') || null : null,
    powers,
    leadOverSecond,
    leadOverThird,
    gaps: powers.slice(1).map((p, i) => powers[i] - p),
  };
}

/**
 * The record's form.
 * @param {unknown} record @returns {ReturnType<typeof leaderLeadOf>}
 */
export function leaderLeadOfRecord(record) {
  const ps = record && typeof record === 'object' ? /** @type {{ powerStructure?: { factions?: unknown } }} */ (record).powerStructure : null;
  return leaderLeadOf(ps?.factions);
}
