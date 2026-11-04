/**
 * Step: resolveCrisisCast — the crisis record's derived cast (docs/DESIGN_CRISIS_TAB.md).
 *
 * Runs after the settlement is assembled: the NPCs, the one faction set and the legitimacy
 * pass all exist only once `assembleSettlement` has bundled them. Each active stress entry
 * gains `cast`, derived by `src/domain/crisis/crisisCast.js :: deriveCrisisCast` over the
 * whole town, worst crisis first in the engine's severity order
 * (`STRESS_SEVERITY_WEIGHT`, the order `generateStress` already ranks by).
 *
 * ⛔ ONE DRAW AT MOST, AND ONLY FOR A TEMPORARY PERSON. The cast takes no draw; the occasional
 * roles are ranked over a hash of seed and crisis id. A temporary person is minted only when a
 * natural crisis's lever has neither a house nor an office-holder on the roster, at most one per
 * town, named by the NPC generator's own name helper on this step's own forked stream, so no
 * other step's stream moves. Under a held roster (`chooseOrPin(pins, 'npcs')`) nothing is
 * appended (EM-R2's producer gate, the same key assembleSettlement's appender honours); a
 * temporary person already on the held roster is reused by kind.
 *
 * `crisisResolve` (src/domain/crisisLifecycle.js) removes a resolved crisis's temporary person.
 */
import { chooseOrPin, registerStep } from '../pipeline.js';
import { STRESS_SEVERITY_WEIGHT } from '../stressGenerator.js';
import { pickFirst } from '../npcGenerator.js';
import { deriveCrisisCast, castHash } from '../../domain/crisis/crisisCast.js';

/** The role a temporary person carries on the roster, by the kind of lever it holds. */
const TEMPORARY_ROLE = Object.freeze(/** @type {Record<string, string>} */ ({
  healer: 'Healer',
  grain: 'Grain Steward',
  warden: 'Warden',
}));

const UNPINNED = Symbol('unpinned');

/**
 * The stress container as a list of entries, in place (the same objects the record holds).
 * @param {unknown} stress
 * @returns {Array<Record<string, unknown>>}
 */
function entriesOf(stress) {
  if (Array.isArray(stress)) return stress.filter((e) => !!e && typeof e === 'object');
  return stress && typeof stress === 'object' ? [/** @type {Record<string, unknown>} */ (stress)] : [];
}

registerStep('resolveCrisisCast', {
  deps: ['assembleSettlement'],
  reads: ['settlement'],
  provides: ['crisisCast'],
  // writes `cast` onto each stress entry of the assembled record, and may append ONE temporary
  // person to its roster
  mutates: ['settlement'],
  phase: 'assembly',
}, (ctx, rng) => {
  const settlement = /** @type {Record<string, unknown> | undefined} */ (ctx.settlement);
  if (!settlement) return { crisisCast: {} };
  const entries = entriesOf(settlement.stress);
  if (!entries.length) return { crisisCast: {} };
  const ranked = entries
    .map((e, at) => ({ e, at }))
    .sort((a, b) => ((/** @type {Record<string, number>} */ (STRESS_SEVERITY_WEIGHT))[String(b.e.type)] || 0)
      - ((/** @type {Record<string, number>} */ (STRESS_SEVERITY_WEIGHT))[String(a.e.type)] || 0) || (a.at - b.at))
    .map(({ e }) => e);
  const seed = String(ctx._seed ?? settlement._seed ?? '');
  const held = chooseOrPin(ctx.__pins || null, 'npcs', () => UNPINNED) !== UNPINNED;
  const npcs = Array.isArray(settlement.npcs) ? /** @type {Array<Record<string, unknown>>} */ (settlement.npcs) : [];
  const config = /** @type {Record<string, unknown>} */ (settlement.config || {});

  /** @type {Array<Record<string, unknown>>} */
  const minted = [];
  const casts = deriveCrisisCast(/** @type {never} */ (settlement), /** @type {never} */ (ranked), seed, {
    mintTemporary: held ? undefined : (kind, crisisId) => {
      const gender = castHash(seed, crisisId, 'temporary-gender') < 1 / 2 ? 'female' : 'male';
      const name = pickFirst(String(config.culture || 'germanic'), gender, true, String(settlement.tier || 'town'));
      if (!name) return null;
      const id = `npc_temp_${kind}`;
      minted.push({
        id, name, gender, role: TEMPORARY_ROLE[kind] || 'Steward', category: 'civic',
        power: 1, influence: 'low', factionAffiliation: null,
        temporary: true, temporaryKind: kind, crisisIds: [crisisId],
      });
      return { id, name };
    },
  });

  /** @type {Record<string, unknown>} */
  const crisisCast = {};
  for (const entry of entries) {
    const cast = casts.get(String(entry.type));
    if (!cast) continue;
    entry.cast = cast;
    crisisCast[String(entry.type)] = cast;
  }
  // The stressors alias (normalizeSettlement) may be a separate container: keep it in step.
  if (settlement.stressors !== settlement.stress) {
    for (const twin of entriesOf(settlement.stressors)) {
      const cast = casts.get(String(twin.type));
      if (cast) twin.cast = cast;
    }
  }
  // A temporary person serves every crisis whose lever it holds.
  for (const person of minted) {
    const serves = Object.entries(crisisCast)
      .filter(([, c]) => (/** @type {{ roles: Array<{ id: string }> }} */ (c)).roles.some((r) => r.id === person.id))
      .map(([k]) => k);
    person.crisisIds = serves;
    npcs.push(person);
  }
  if (minted.length && !Array.isArray(settlement.npcs)) settlement.npcs = npcs;
  void rng;
  return { crisisCast };
});
