/**
 * economyDeskRead.js — THE ECONOMY DESK'S ONE CALLER, and the one place §885.3 is answered.
 *
 * ── WHY THIS FILE EXISTS, AND IT IS STRUCTURAL RATHER THAN TIDINESS ──────────────────
 * `tests/lint/dossierMountRegistry.walker.test.js` ARM 2 admits EXACTLY ONE component file
 * that both imports `stateProse/economyStateProse.js` and calls `economyStateProse(`:
 *
 *     "Exactly one caller is what keeps the gate auditable: two call sites are two places
 *      to forget, and would also break the one-position reading the registry assumes."
 *
 * The economy desk was born inside `EconomicsTab.jsx`, which was correct while every one of
 * its positions sat on the economics tab. It no longer does: DS-ECO-11 renders on
 * `resources`, DS-SUP-3 on `services` and DS-ECO-8 on `daily_life`. Four tabs cannot each
 * call the desk, so the call moves here and the tabs consume drawn rungs. The
 * `WarFaithDesk.jsx` and `generalDeskRead.js` cars took the same act for the same reason.
 *
 * ── THE PAID SURFACE, ANSWERED ONCE ──────────────────────────────────────────────────
 * §885.3 rules dossier corpus prose a PAID surface, and `publicDossier` is
 * `readOnly && !saveId` — a free, anonymous gallery viewer. That gate was hand-fitted twice
 * (economics, then power) and the walker's own docblock records that as the point at which
 * the third ships broken. Here it is answered ONCE, for every tab, by returning the SILENT
 * desk: every rung null, so `drawnAtMount` answers null at every position and no corpus
 * sentence renders anywhere. The DATUM is untouched — every tile, chip, figure and
 * generator-authored paragraph is the tab's own and never reads this module.
 *
 * ── WHAT THIS MODULE MAY AND MAY NOT DERIVE ──────────────────────────────────────────
 * It calls CANONICAL readers and hands their answers to the desk; it derives nothing of its
 * own. `deriveExportPosture` (the §1d export read-model) and `deriveNotableAbsences` (the
 * services gap reader that ServicesTab and the PDF already share) are both zero-import
 * leaves, so calling them here costs no chunk weight. Everything a host already computes —
 * the food balance, the granary outlook, the live trade-flow drift, the impaired house —
 * arrives as an argument rather than being derived a second time, which is the desk's own
 * "a second derivation of the same fact is a fork that drifts".
 *
 * NOT IN `OutputContainer.jsx`: that would drag the 90 KB economy corpus leaf into the
 * eager dossier chunk. Each tab imports this leaf lazily, the way it imports its own tab.
 *
 * @enforced-by tests/lint/dossierMountRegistry.walker.test.js (ARM 2 + the reachability arm)
 * @enforced-by tests/ui/economicsTabFlow.test.js (the rendered text and the public negative)
 */
import { economyStateProse } from '../../domain/display/stateProse/economyStateProse.js';
import { deriveExportPosture } from '../../domain/display/exportPosture.js';
import { deriveNotableAbsences } from '../../domain/display/servicesDisplay.js';

/**
 * THE SILENT DESK — what a free, anonymous viewer gets, and what a host gets before it has
 * a settlement. Every key the desk returns, all null.
 *
 * WRITTEN OUT RATHER THAN BUILT FROM THE DESK'S OWN KEYS, deliberately: deriving it by
 * calling the desk with an empty settlement would make the gate depend on the desk staying
 * silent over garbage, which is a property nothing enforces. A frozen literal is a promise
 * the desk-key arm in the UI suite can check against the real return shape.
 * @type {Readonly<Record<string, null>>}
 */
export const SILENT_ECONOMY_DESK = Object.freeze({
  prosperityHeader: null,
  prosperityRung: null,
  foodTile: null,
  granaryTile: null,
  foodSecurityRung: null,
  incomeMix: null,
  criminalLine: null,
  tradeProfile: null,
  shadowEconomy: null,
  tradeFlow: null,
  exportPosture: null,
  terrainIdentity: null,
  economicStrengths: null,
  strategicValue: null,
  exploitation: null,
  catalogStanding: null,
  impairedService: null,
});

/**
 * Read the economy desk for one settlement, gated.
 *
 * THE SEED IS THE SETTLEMENT'S OWN STABLE IDENTITY, so THE PROMISE holds: same seed + same
 * state ⇒ same sentence, forever, and the same sentence on every tab that draws the block.
 *
 * THE AUDIENCE IS THE PowerTab TERM EXACTLY (`playerView ? 'player' : 'dm'`). DS-ECO-12's
 * criminal lens is `dm-only` on all five variants, so a desk called without an audience
 * could never draw it. Two tabs disagreeing about who is reading would be the real defect.
 *
 * @param {object|null|undefined} settlement
 * @param {{publicDossier?: boolean, playerView?: boolean,
 *   foodBalance?: object|null, granaryOutlook?: object|null, flowDrift?: object|null,
 *   impairedInstitution?: string|null}} [options]
 *   `impairedInstitution` is ONE house out of the impairment sets ServicesTab already builds
 *   with `computeChainSets`; it is passed in rather than re-derived here because that
 *   derivation is the services surface's and a second copy of it would drift from the chips.
 * @returns {Readonly<Record<string, object|null>>}
 */
export function economyDeskRead(settlement, options = {}) {
  if (!settlement) return SILENT_ECONOMY_DESK;
  // ⛔ THE GATE IS IN THE READ'S OWN STATEMENT, not a guard clause above it — the
  // `warFaithDeskRungs` idiom verbatim. A preceding `if` gates correctly and is INVISIBLE to
  // the mount registry's ARM 3, which reads the statement the corpus call sits in: a gate a
  // walker cannot see is a gate the next edit can delete without anything reddening. Same
  // truth table, one statement.
  return options.publicDossier ? SILENT_ECONOMY_DESK : economyStateProse(
    settlement,
    {
      foodBalance: options.foodBalance ?? null,
      granaryOutlook: options.granaryOutlook ?? null,
      flowDrift: options.flowDrift ?? null,
      exportPosture: deriveExportPosture(settlement),
      notableAbsences: deriveNotableAbsences(settlement.tier, settlement.availableServices),
      impairedInstitution: options.impairedInstitution ?? null,
    },
    {
      seed: String(settlement._seed ?? settlement.id ?? ''),
      audience: options.playerView ? 'player' : 'dm',
    },
  );
}
