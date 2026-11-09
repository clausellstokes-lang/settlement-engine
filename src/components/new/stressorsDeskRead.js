/**
 * stressorsDeskRead.js — THE STRESSORS DESK'S ONE CALLER (STYLE-RULINGS-2 B10(a); lane SW-B7b
 * PROJECTION, the fourth seat), in the `economyDeskRead.js` idiom.
 *
 * WHY A MODULE: `tests/lint/dossierMountRegistry.walker.test.js` ARM 2 admits EXACTLY ONE file
 * that calls `stressorsStateProse(`. The Overview's crisis and condition positions now have two
 * readers — the tab, and the public prose composer (`publicProseCompose.js`), which draws the
 * owner's player view at the save — so the call moves here and both consume drawn rungs. One
 * call is one place the gate can be forgotten.
 *
 * THE PUBLIC BRANCH. A shared page (`publicDossier`) prints the desk the owner's player view drew
 * at this call site, shipped as text at the owner's save (`publicProse.js`); an absent or stale
 * projection is the SILENT desk, never a seedless re-draw. The gate sits IN the read's own
 * statement, so ARM 3 sees it.
 *
 * CAMPAIGN READINGS ARE OWNER-ONLY (the chair's ruling, §7.1 of the lane record): the world
 * stressor (DS-STR-2) is keyed off a played world, which the save boundary does not hold, so the
 * composer passes none and the shared page prints nothing there, never a different reading.
 *
 * @enforced-by tests/lint/dossierMountRegistry.walker.test.js (ARM 2 + ARM 3)
 * @enforced-by tests/components/publicProseEquality.test.jsx (`stressors:overview`)
 */
import { stressorsStateProse } from '../../domain/display/stateProse/stressorsStateProse.js';
import { deriveAllActiveConditions } from '../../domain/activeConditions.js';
import { tierNounFor } from '../../domain/display/stateProse/weaveBlock.js';
import { publicProseOf } from '../../domain/display/publicProse.js';

/**
 * THE SILENT DESK: every key the desk returns, all null. Written out, as the economy desk's is,
 * so the gate never depends on the desk staying silent over garbage.
 * @type {Readonly<Record<string, null>>}
 */
export const SILENT_STRESSORS_DESK = Object.freeze({
  crisisArity: null,
  crisisFraming: null,
  conditionSeverity: null,
  conditionDirection: null,
  conditionArchetype: null,
  conditionProvenance: null,
  conditionDuration: null,
  worldStressorLifecycle: null,
  worldStressorOrigin: null,
});

/**
 * The shipped desk for one call site, every key the SILENT desk names and nothing else.
 * @param {any} settlement @param {unknown} site @returns {Readonly<Record<string, any>>}
 */
function publicStressorsDesk(settlement, site) {
  const shipped = typeof site === 'string' ? publicProseOf(settlement, site) : null;
  if (!shipped || typeof shipped !== 'object') return SILENT_STRESSORS_DESK;
  const rungs = /** @type {Record<string, unknown>} */ (shipped);
  return Object.freeze(Object.fromEntries(Object.keys(SILENT_STRESSORS_DESK).map((key) => [key, rungs[key] ?? null])));
}

/**
 * Read the stressors desk for one settlement, gated.
 * @param {object|null|undefined} settlement
 * @param {{publicDossier?: boolean, playerView?: boolean, publicSite?: string,
 *   stresses?: ReadonlyArray<any>, worldStressor?: object|null, tier?: unknown}} [options]
 *   `stresses` is the host's own normalized banner list (`deskHostArgs.js ::
 *   overviewStressesOf`), handed in rather than re-derived; `worldStressor` is the caller's
 *   selection out of a played world (null at the save boundary).
 * @returns {Readonly<Record<string, object|null>>}
 */
export function stressorsDeskRead(settlement, options = {}) {
  if (!settlement) return SILENT_STRESSORS_DESK;
  const s = /** @type {any} */ (settlement);
  // ⛔ THE GATE IS IN THE READ'S OWN STATEMENT (ARM 3), the economy desk's idiom verbatim.
  return options.publicDossier ? publicStressorsDesk(s, options.publicSite) : stressorsStateProse(
    s,
    {
      banners: options.stresses ?? [],
      conditions: deriveAllActiveConditions(s),
      worldStressor: options.worldStressor ?? null,
    },
    // The audience follows kernel law 2's fail-closed default, stated: the PowerTab term.
    { seed: String(s._seed ?? s.id ?? ''), audience: options.playerView ? 'player' : 'dm', tierNoun: tierNounFor(options.tier) },
  );
}
