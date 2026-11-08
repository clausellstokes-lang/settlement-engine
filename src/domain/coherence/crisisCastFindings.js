/**
 * domain/coherence/crisisCastFindings.js — the crisis cast's self-check (docs/DESIGN_CRISIS_TAB.md,
 * "Goldens, registers and proof": "every cast member's faction stake agrees with the role (an
 * exploiter's faction gains; a scapegoat's loses)"; and "Two or more crises": the contradictory
 * pairs and the per-town caps).
 *
 * Standalone and pure: it reads the settlement's stress entries and the engine's own `cast` on
 * each (crisisCast.js :: deriveCrisisCast, written by the resolveCrisisCast step) and returns one
 * finding per fault. The DM's word (`_userEdits.castRoles`) is not judged: TRUST THE DM. Wired into
 * no gate and no generation step; the SOAK battery calls it, and a caller decides what a finding
 * costs.
 *
 *   stake_disagrees     a cast member's faction holds the wrong stake for the role in that crisis:
 *                       an exploiter's, a profiteer's or an ambitious collaborator's faction does
 *                       not gain; a scapegoat's does not lose; a waverer's is not split.
 *   contradictory_pair  one person or house holds both roles of a contradictory pair across the
 *                       town's crises (crisisCast.js :: CONTRADICTORY_ROLE_PAIRS).
 *   cap_exceeded        more of an occasional role, or more temporary people, than the town's cap
 *                       (crisisCast.js :: CRISIS_CAST_TUNING.townCaps).
 */

import { CONTRADICTORY_ROLE_PAIRS, CRISIS_CAST_TUNING, CAST_REASONS } from '../crisis/crisisCast.js';
import { powerOrderOf, powersByRankOf } from '../people/membership.js';

/**
 * @typedef {import('../crisis/crisisCast.js').CrisisRole} CrisisRole
 * @typedef {import('../crisis/crisisCast.js').CrisisCast} CrisisCast
 *
 * @typedef {Object} CrisisCastFinding
 * @property {'stake_disagrees'|'contradictory_pair'|'cap_exceeded'} code
 * @property {string} crisis   the crisis id (its type), or '' for a town-wide finding
 * @property {string} detail
 *
 * @typedef {{ id?: unknown, name?: unknown, memberships?: unknown, temporary?: unknown }} FindingNpc
 * @typedef {{ type?: unknown, cast?: CrisisCast | null }} FindingEntry
 * @typedef {{ stress?: FindingEntry | FindingEntry[] | null, npcs?: FindingNpc[], powerStructure?: unknown }} FindingSettlement
 */

/** The stake each role's faction must hold in that crisis (rules 5, 6, 9, 10). */
const STAKE_FOR_ROLE = Object.freeze(/** @type {Partial<Record<CrisisRole, 'gains' | 'loses' | 'split'>>} */ ({
  exploiter: 'gains',
  profiteer: 'gains',
  scapegoat: 'loses',
  waverer: 'split',
}));

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');

/**
 * @param {FindingSettlement | null | undefined} settlement
 * @returns {CrisisCastFinding[]}
 */
export function crisisCastFindings(settlement) {
  /** @type {CrisisCastFinding[]} */
  const findings = [];
  const raw = settlement?.stress;
  const entries = (Array.isArray(raw) ? raw : (raw && typeof raw === 'object' ? [raw] : []))
    .filter((e) => !!e && typeof e === 'object' && !!e.cast && Array.isArray(e.cast.roles));
  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  const powerOrder = powerOrderOf(settlement);
  /** A person's powers, its best standing first (its memberships — PEOPLE-2 CAST-DERIVED). @param {string} id @returns {string[]} */
  const powersOfNpc = (id) => powersByRankOf(npcs.find((n) => !!n && (str(n.id) || str(n.name)) === id), powerOrder).map((m) => m.power);

  /** @type {Map<string, Array<{ role: CrisisRole, crisis: string, name: string }>>} */
  const held = new Map();
  /** @type {Record<string, number>} */
  const counts = {};

  for (const entry of entries) {
    const crisis = str(entry.type);
    const cast = /** @type {CrisisCast} */ (entry.cast);
    const stakeOf = new Map((cast.stakes || []).map((k) => [k.factionId, k.stake]));
    for (const row of cast.roles) {
      if (row.reason === CAST_REASONS.dm) continue;
      const key = `${row.kind}:${row.id}`;
      held.set(key, [...(held.get(key) || []), { role: row.role, crisis, name: row.name }]);
      counts[row.role] = (counts[row.role] || 0) + 1;
      // A collaborator chosen for corruption answers to its ties, not its faction's stake (rule 9).
      const want = row.role === 'collaborator'
        ? (row.reason.startsWith(CAST_REASONS.collaboratorAmbition) ? 'gains' : null)
        : STAKE_FOR_ROLE[row.role] || null;
      if (!want) continue;
      // a person answers to the stake of ANY power it holds a membership in (the one that
      // agrees, else its first-rank power's)
      const powers = row.kind === 'faction' ? [row.id] : row.kind === 'npc' ? powersOfNpc(row.id) : [];
      const faction = powers.find((p) => stakeOf.get(p) === want) || powers[0] || '';
      const stake = faction ? stakeOf.get(faction) : undefined;
      if (stake !== want) {
        findings.push({ code: 'stake_disagrees', crisis, detail: `${row.name} ${row.role}s, but ${faction || 'no faction'} ${stake ? `${stake} by it` : 'holds no stake'} (wants ${want})` });
      }
    }
  }

  for (const [key, rows] of held) {
    for (const [a, b] of CONTRADICTORY_ROLE_PAIRS) {
      const ra = rows.find((r) => r.role === a);
      const rb = rows.find((r) => r.role === b);
      if (ra && rb) findings.push({ code: 'contradictory_pair', crisis: (rows.indexOf(ra) > rows.indexOf(rb) ? ra : rb).crisis, detail: `${ra.name || key} is ${a} in ${ra.crisis} and ${b} in ${rb.crisis}` });
    }
  }

  const caps = /** @type {Record<string, number>} */ (CRISIS_CAST_TUNING.townCaps);
  for (const role of Object.keys(caps)) {
    const n = role === 'temporary' ? npcs.filter((x) => !!x && x.temporary === true).length : (counts[role] || 0);
    if (n > caps[role]) findings.push({ code: 'cap_exceeded', crisis: '', detail: `${n} ${role} in one town (cap ${caps[role]})` });
  }
  return findings;
}
