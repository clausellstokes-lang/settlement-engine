/**
 * defenseDeskRead.js — THE DEFENSE DESK'S ONE CALLER (STYLE-RULINGS-2 B10(a); lane SW-B7b
 * PROJECTION, the fourth seat), in the `economyDeskRead.js` idiom.
 *
 * WHY A MODULE: `tests/lint/dossierMountRegistry.walker.test.js` ARM 2 admits EXACTLY ONE file
 * that calls `defenseStateProse(`, and ARM 3 grades every further producer the desk hands out.
 * The Defense tab's eight reads now have two readers — the tab, and the public prose composer
 * (`publicProseCompose.js`), which draws the owner's player view at the save — so all eight
 * calls move here, each gated in its own statement, and both readers consume drawn lenses.
 *
 * THE PUBLIC BRANCH. A shared page (`publicDossier`) prints each lens the owner's player view
 * drew, shipped as text at the owner's save under `defense:<lens>` (`publicProse.js`); an absent
 * or stale projection is that lens's SILENT shape, never a seedless re-draw. A veiled criminal
 * block (`crimeVeiled`) is SILENT on every page, as the tab always ruled.
 *
 * @enforced-by tests/lint/dossierMountRegistry.walker.test.js (ARM 2 + ARM 3)
 * @enforced-by tests/components/publicProseEquality.test.jsx (`defense:*`)
 */
import {
  defenseCriminalProse, defenseForcesProse, defenseMilitaryStatusProse, defensePostureProse,
  defenseStateProse, defenseSupportingProse, defenseThreatProse, defenseWallRationaleProse,
} from '../../domain/display/stateProse/defenseStateProse.js';
import { tierNounFor } from '../../domain/display/stateProse/weaveBlock.js';
import { publicProseOf } from '../../domain/display/publicProse.js';
import { publicVeiledRecordOf } from '../../domain/display/publicSafe.js';

/**
 * THE SILENT LENSES, written out (the gate never depends on a desk staying silent over garbage).
 * @type {Readonly<Record<string, Readonly<Record<string, null>>>>}
 */
export const SILENT_DEFENSE_DESK = Object.freeze({
  state: Object.freeze({ publicOrder: null, firstSurvey: null }),
  threat: Object.freeze({ beasts: null, invasion: null, internal: null, economic: null, disaster: null }),
  forces: Object.freeze({ fortification: null, force: null, contracted: null, charter: null, arcane: null }),
  posture: Object.freeze({ posture: null, terrain: null, prize: null }),
  status: Object.freeze({ override: null, viability: null }),
  wall: Object.freeze({ rationale: null }),
  supporting: Object.freeze({ logistics: null, naval: null }),
  criminal: Object.freeze({ structure: null, capture: null }),
});

/** The lens names, which are also the site suffixes (`defense:<lens>`). */
export const DEFENSE_LENSES = Object.freeze(Object.keys(SILENT_DEFENSE_DESK));

/**
 * The shipped lens at `defense:<lens>`, every key its SILENT shape names and nothing else.
 * @param {any} settlement @param {string} lens @returns {Readonly<Record<string, any>>}
 */
function publicLens(settlement, lens) {
  const silent = SILENT_DEFENSE_DESK[lens];
  const shipped = publicProseOf(settlement, `defense:${lens}`);
  if (!shipped || typeof shipped !== 'object') return silent;
  const rungs = /** @type {Record<string, unknown>} */ (shipped);
  return Object.freeze(Object.fromEntries(Object.keys(silent).map((key) => [key, rungs[key] ?? null])));
}

/**
 * Read the defense desk's eight lenses for one settlement, gated.
 * @param {object|null|undefined} settlement
 * @param {{publicDossier?: boolean, playerView?: boolean, tier?: unknown,
 *   crimStructure?: string|null, crimeVeiled?: boolean}} [options]
 *   `crimStructure` is the structure key the host's card renders from (`deskHostArgs.js ::
 *   criminalStructureOf`), handed in so the sentence and the card read one classification.
 * @returns {Readonly<Record<string, Readonly<Record<string, any>>>>}
 */
export function defenseDeskRead(settlement, options = {}) {
  if (!settlement) return SILENT_DEFENSE_DESK;
  const r = /** @type {any} */ (settlement);
  // ⭐ THE OPTION BAG, SPELLED ONCE (ODQ §934.22 addendum): the settlement's own noun, the
  // stated audience (kernel law 2's fail-closed default), the stable seed.
  const deskOpts = {
    seed: String(r._seed ?? r.id ?? ''),
    audience: options.playerView ? 'player' : 'dm',
    tierNoun: tierNounFor(options.tier),
  };
  // ⛔ EVERY GATE IS IN ITS READ'S OWN STATEMENT (ARM 3), the economy desk's idiom verbatim.
  const state = options.publicDossier ? publicLens(r, 'state') : defenseStateProse(r, deskOpts);
  const threat = options.publicDossier ? publicLens(r, 'threat') : defenseThreatProse(r, deskOpts);
  const forces = options.publicDossier ? publicLens(r, 'forces') : defenseForcesProse(r, deskOpts);
  const posture = options.publicDossier ? publicLens(r, 'posture') : defensePostureProse(r, deskOpts);
  const status = options.publicDossier ? publicLens(r, 'status') : defenseMilitaryStatusProse(r, deskOpts);
  const wall = options.publicDossier ? publicLens(r, 'wall') : defenseWallRationaleProse(r, deskOpts);
  const supporting = options.publicDossier ? publicLens(r, 'supporting') : defenseSupportingProse(r, deskOpts);
  // AUDIENCE-GATED (VEIL-FIX R2, 2026-11-10; 207's law, the hall-capture state is DM truth): the
  // player view draws the criminal lens from the record AFTER the public strip, so its capture
  // rung says nothing in ANY state (the 'none' sentence reveals the state too); the DM's view
  // reads the record itself.
  const criminal = options.crimeVeiled ? SILENT_DEFENSE_DESK.criminal
    : options.publicDossier ? publicLens(r, 'criminal') : defenseCriminalProse(options.playerView ? publicVeiledRecordOf(r) : r, options.crimStructure ?? null, deskOpts);
  return Object.freeze({ state, threat, forces, posture, status, wall, supporting, criminal });
}

/**
 * THE ORGANIZED-RING NOTE, gated (VEIL-FIX R3, the chair's ruling of 2026-11-10; SW-B7b's idiom).
 * SW-B5 FRAMES picks the note's vantage by the record's `_seed` (defenseDisplay.js ::
 * withRingVantage), which the shared record does not carry; so the owner's save ships the drawn
 * note with the projection under `defense:criminal` (`ringNote`), and a shared page prints that
 * line when present and renders the classification's own note locally, as before, when absent.
 * The owner's view reads its own classification.
 * @param {any} settlement @param {{note?: unknown}|null|undefined} csd the card's classification
 *   (`deskHostArgs.js :: criminalStructureOf`)
 * @param {{publicDossier?: boolean}} [options]
 * @returns {string|null}
 */
export function criminalRingNoteRead(settlement, csd, options = {}) {
  const local = typeof csd?.note === 'string' ? csd.note : null;
  const shipped = options.publicDossier ? /** @type {any} */ (publicProseOf(settlement, 'defense:criminal'))?.ringNote : null;
  return typeof shipped === 'string' && shipped ? shipped : local;
}
