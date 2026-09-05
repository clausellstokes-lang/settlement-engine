/**
 * components/new/generalDeskRead.js — THE GENERAL DESK'S ONE CALLER.
 *
 * WHAT THIS IS AND WHY IT IS NOT A TAB. `generalStateProse.js` is the only corpus leaf whose
 * blocks do not live on one page: its 23 blocks address overview, history, viability,
 * relationships, population, power and economics. The mount registry's ARM 2
 * (tests/lint/dossierMountRegistry.walker.test.js) requires EXACTLY ONE caller per desk —
 * two call sites are two places to forget the `publicDossier` gate, and that gate has
 * shipped broken twice — so a leaf that spans seven tabs cannot be called by its tabs.
 *
 * `generalStateProse.js` costed this act out in writing and named it as its own rather than
 * smuggling it into a desk car: "a single reader under src/components, rendered by each
 * owning tab, keeps ARM 2 satisfied while letting DS-GEN-9, DS-GEN-11, DS-GEN-18 and the
 * relations blocks land on THEIR pages". This is that reader. It carries NO new mount and
 * lights NO new block; it moves the existing eight Overview positions behind one door so the
 * cars after it can add positions on other tabs without a second call site.
 *
 * ⛔ WHY A PLAIN MODULE AND NOT A COMPONENT. The tabs' layouts are their own — the systems
 * health lines run beside score bars, the conflict lines are INDEX-PAIRED with the caller's
 * own conflict rows, the origin overlay sits under the frozen settlement reason. A component
 * that rendered them would have to own that layout for every tab at once. This returns the
 * drawn SENTENCES and each tab renders them where they belong, which is also what keeps the
 * draws real: the reachability arm can only see a literal, and the UI flow tests assert the
 * corpus sentence in the rendered DOM.
 *
 * ⛔ AND NOT IN `OutputContainer.jsx`, which was the third option and is the wrong one: the
 * router is in the eager 457 kB dossier chunk, and calling the desk there would pull the
 * 182 KB corpus leaf into it instead of a tab's own lazy chunk.
 *
 * ⛔ THE PAID SURFACE (§885.3). A public gallery dossier is `readOnly && !saveId` — a free,
 * anonymous viewer — and corpus prose is a PAID surface. The gate is HERE, once, in the same
 * expression as the desk call, which is the whole point of there being one caller: a tab
 * cannot forget it, because a tab cannot reach the desk.
 *
 * @enforced-by tests/lint/dossierMountRegistry.walker.test.js (ARM 2, one caller + the gate)
 */
import { generalStateProse, GENERAL_STATE_PROSE_SILENT } from '../../domain/display/stateProse/generalStateProse.js';
import { drawnAtMount } from '../../domain/display/stateProse/dossierMounts.js';
import { resolvePrimaryStress } from '../../generators/stressPriority.js';

/**
 * The general desk's OVERVIEW positions. Bound once each: the registry's reachability arm
 * counts string LITERALS under src/components and refuses a position named twice, so the ids
 * live here rather than in the tabs that render what comes back.
 */
const CONFLICTS_MOUNT = 'overview.conflicts';
const WARNINGS_MOUNT = 'overview.warnings';
const SITUATION_MOUNT = 'overview.situation';
const ORIGIN_MOUNT = 'overview.origin';
const HEALTH_MOUNT = 'overview.systemsHealth';
const GROUND_MOUNT = 'overview.ground';
const MARKET_MOUNT = 'overview.market';
const INSTITUTIONS_MOUNT = 'overview.institutions';

/** The general desk's HISTORY positions. */
const IDENTITY_MOUNT = 'history.identity';
const FOUNDED_MOUNT = 'history.founded';
const RECORD_MOUNT = 'history.record';

/** The shape every consumer gets, silent. Frozen so a caller cannot fill it in. */
const SILENT_OVERVIEW = Object.freeze({
  healthLines: Object.freeze([]),
  conflictLines: Object.freeze([]),
  warningLines: Object.freeze([]),
  originLines: Object.freeze([]),
  siteLines: Object.freeze([]),
  situationLine: null,
});

/** The same, for the history chapter. */
const SILENT_HISTORY = Object.freeze({
  identityLines: Object.freeze([]),
  foundedLine: null,
  recordLine: null,
});

/**
 * ⚠ THIS IS THE READER'S RETURN CONTRACT, exactly as `GENERAL_STATE_PROSE_SILENT` is the
 * desk's: `generalDeskLines` declares `@returns {typeof GENERAL_DESK_SILENT}`, so a position
 * missing here is a position this reader is not allowed to hand back.
 * @type {Readonly<{overview: typeof SILENT_OVERVIEW, history: typeof SILENT_HISTORY}>}
 */
export const GENERAL_DESK_SILENT = Object.freeze({
  overview: SILENT_OVERVIEW,
  history: SILENT_HISTORY,
});

/**
 * The sentence one rung draws at one position, or null. The registry's own depth ruling is
 * applied here and nowhere else: flip a row from `sentence` to `glance` in
 * `dossierMounts.js` and the position falls silent with no edit at any call site.
 * @param {string} mount @param {object|null|undefined} rung @returns {string|null}
 */
function line(mount, rung) {
  return drawnAtMount(mount, rung)?.sentence ?? null;
}

/**
 * THE READ. One desk call per render, gated, with every position's lines drawn.
 *
 * @param {object|null|undefined} settlement the record the tab already holds
 * @param {{publicDossier?: boolean, playerView?: boolean,
 *   stresses?: ReadonlyArray<{type?: unknown}|null>}} [options]
 *   `stresses` is the caller's OWN normalized stress list — DS-GEN-5 suppresses itself where
 *   a primary stress resolves, and it must key on the SAME ladder the arrival scene above it
 *   keys on or the page prints an ordinary market day underneath a siege banner.
 * @returns {typeof GENERAL_DESK_SILENT}
 */
export function generalDeskLines(settlement, options = {}) {
  const r = settlement || {};
  const eco = r.economicState || {};
  const dp = r.defenseProfile || {};
  const via = r.economicViability || {};
  const stresses = (Array.isArray(options.stresses) ? options.stresses : []).filter(Boolean);
  const publicDossier = options.publicDossier === true;
  // The audience follows kernel law 2's fail-closed default: an unstated audience reads as
  // the player's, so it is stated.
  const prose = publicDossier ? GENERAL_STATE_PROSE_SILENT : generalStateProse(
    r,
    {
      scores: dp.scores,
      prosperity: eco.prosperity,
      safetyLabel: eco.safetyProfile?.safetyLabel,
      viable: via.viable,
      readinessLabel: dp.readiness?.label,
      foodSecurityLabel: eco.foodSecurity?.label,
      terrainType: r.config?.terrainType,
      institutions: r.institutions,
      tradeRouteAccess: r.config?.tradeRouteAccess,
      isEntrepot: eco.isEntrepot,
      // ⚠ THE INSTITUTION BOOLEANS LIVE AT `economicState.compound.inst`, NOT at
      // `settlement.compound.inst`. The corpus title abbreviates the path, and a reader that
      // believed the abbreviation would resolve BARE on every settlement ever generated.
      inst: eco.compound?.inst,
      conflicts: r.conflicts,
      structuralViolations: r.structuralViolations,
      structuralSuggestions: r.structuralSuggestions,
      coherenceNotes: r.coherenceNotes,
      govFaction: (r.powerStructure?.factions || []).find((f) => f?.isGoverning)?.faction,
      tier: r.tier,
      primaryStress: resolvePrimaryStress(stresses.map((v) => v?.type).filter(Boolean)),
      // The food arithmetic DS-GEN-6's demoted `deficit` dimension is derived from. It lives
      // under economicViability.METRICS — ViabilityTab reads the same record — and an absent
      // one reads as an unmeasured town rather than a fed one.
      foodBalance: via.metrics?.foodBalance,
      // The history chapter: DS-GEN-9's identity and marker event, DS-GEN-14's founding age,
      // DS-GEN-16's verdict on the record. Passed whole because all three read the same
      // record and a desk that reached for it itself would be a second opinion about which
      // record the caller meant.
      history: r.history,
    },
    { seed: String(r?._seed ?? r?.id ?? ''), audience: options.playerView ? 'player' : 'dm' },
  );

  return Object.freeze({
    overview: Object.freeze({
      healthLines: Object.freeze(prose.overview.systemsHealth
        .map((rung) => line(HEALTH_MOUNT, rung)).filter(Boolean)),
      // ONE LINE PER CONFLICT, index-paired with the caller's own rows: the desk keeps a null
      // IN PLACE for a quarrel it cannot key on, so the pairing cannot slip.
      conflictLines: Object.freeze(prose.overview.conflicts
        .map((rung) => line(CONFLICTS_MOUNT, rung))),
      warningLines: Object.freeze(prose.overview.warnings
        .map((rung) => line(WARNINGS_MOUNT, rung)).filter(Boolean)),
      originLines: Object.freeze(prose.overview.origin
        .map((rung) => line(ORIGIN_MOUNT, rung)).filter(Boolean)),
      siteLines: Object.freeze([
        line(GROUND_MOUNT, prose.overview.ground),
        line(MARKET_MOUNT, prose.overview.market),
        line(INSTITUTIONS_MOUNT, prose.overview.institutions),
      ].filter(Boolean)),
      situationLine: line(SITUATION_MOUNT, prose.overview.situation),
    }),
    history: Object.freeze({
      identityLines: Object.freeze(prose.history.identity
        .map((rung) => line(IDENTITY_MOUNT, rung)).filter(Boolean)),
      foundedLine: line(FOUNDED_MOUNT, prose.history.founded),
      recordLine: line(RECORD_MOUNT, prose.history.record),
    }),
  });
}
