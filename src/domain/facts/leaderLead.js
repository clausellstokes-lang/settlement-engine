/**
 * domain/facts/leaderLead.js — THE LEADER'S LEAD (W2-A-LEAVES, 2026-11-12; the class table §5.1's homeless
 * condition "a leader's lead", pattern 4: "three powers stand almost level" beside a ruler far ahead).
 *
 * Who leads, and by how much. The standing sentences (`generators/power/factionStanding.js`) compare a power
 * with its neighbours and never with the leader; this leaf is the one reading of the margins against the
 * leader, so "level" means level with the leader too. `LEVEL_STEP` is the standings' own "almost level" step
 * (a gap of five points or less between neighbours); THREE ARE LEVEL when each neighbouring gap among the top
 * three is within the step, so the third sits within two steps of the leader.
 *
 * Layer 3 (it reads the powers, stored at layer 2). Pure: no randomness, no clock, no write.
 */

/** The standings' own "almost level" step between neighbouring powers. */
export const LEVEL_STEP = 5;

/**
 * @param {unknown} factions the record's `powerStructure.factions` (or the list a step holds)
 * @returns {{ leader: string|null, powers: number[], leadOverSecond: number|null, leadOverThird: number|null, threeLevel: boolean, twoLevel: boolean }}
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
    twoLevel: leadOverSecond !== null && leadOverSecond <= LEVEL_STEP,
    threeLevel: leadOverSecond !== null && leadOverThird !== null && leadOverSecond <= LEVEL_STEP && powers[1] - powers[2] <= LEVEL_STEP,
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
