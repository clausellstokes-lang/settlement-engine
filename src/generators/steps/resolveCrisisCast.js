/**
 * Step: resolveCrisisCast — the crisis record's derived cast (docs/DESIGN_CRISIS_TAB.md).
 *
 * Runs after the settlement is assembled: the NPCs, the one faction set and the legitimacy
 * pass all exist only once `assembleSettlement` has bundled them. Each active stress entry
 * on the record is replaced by a copy carrying `cast` (copy-on-write: see below), derived by
 * `src/domain/crisis/crisisCast.js :: deriveCrisisCast` over the whole town, worst crisis
 * first in the engine's severity order (`STRESS_SEVERITY_WEIGHT`, the order `generateStress`
 * already ranks by).
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
 *
 * THE CRISIS HOOKS ARE NOT WRITTEN HERE (the HOOKS-UNDER-STRESS lane; the chair's ruling 4): the
 * plot hooks a crisis adds and the `{holder}` name in its `crisisHook` are both read off the cast
 * where they are shown (`src/domain/crisis/crisisHooks.js :: crisisHooksOf`, `crisisHookFor`), so
 * the entry keeps the catalog's sentence as its template and a DM's cast edit is never stale.
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
 * The stress container as a list of entries (the same objects the record holds; read only).
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
        power: 1, influence: 'low', memberships: [],
        temporary: true, temporaryKind: kind, crisisIds: [crisisId],
      });
      return { id, name };
    },
  });

  /** @type {Record<string, unknown>} */
  const crisisCast = {};
  for (const entry of entries) {
    const cast = casts.get(String(entry.type));
    if (cast) crisisCast[String(entry.type)] = cast;
  }
  // ⛔ COPY-ON-WRITE, NEVER IN PLACE. The record's stress entries are the SAME objects
  // `ctx.stress` holds (assembleSettlement places the array by reference) and, on a
  // regeneration, the authored `config.stressorEdits.added` entries themselves (frozen store
  // state). Writing `cast` onto them in place was an undeclared write of `ctx.stress` (the
  // strict data-flow contract) and a TypeError on a frozen entry (undo → regenerate). So the
  // record gets a NEW container of entry copies carrying `cast`; the inputs are left untouched.
  const withCast = (/** @type {unknown} */ e) => {
    if (!e || typeof e !== 'object') return e;
    const cast = casts.get(String((/** @type {Record<string, unknown>} */ (e)).type));
    return cast ? { .../** @type {Record<string, unknown>} */ (e), cast } : e;
  };
  const recast = (/** @type {unknown} */ container) => (Array.isArray(container)
    ? container.map(withCast)
    : withCast(container));
  // The stressors alias (normalizeSettlement) may be the same container or a separate one.
  const aliased = settlement.stressors === settlement.stress;
  const hasTwin = Object.prototype.hasOwnProperty.call(settlement, 'stressors');
  settlement.stress = recast(settlement.stress);
  if (hasTwin) settlement.stressors = aliased ? settlement.stress : recast(settlement.stressors);
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
