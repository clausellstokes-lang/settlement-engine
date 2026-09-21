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
const CONNECTION_MOUNT = 'overview.notableConnection';
const POPULATION_MOUNT = 'overview.populationDirection';

/** The general desk's HISTORY positions. */
const IDENTITY_MOUNT = 'history.identity';
const FOUNDED_MOUNT = 'history.founded';
const RECORD_MOUNT = 'history.record';

/** The VIABILITY and PLOT-HOOKS positions. */
const VERDICT_MOUNT = 'viability.verdict';
const FRAMING_MOUNT = 'plot_hooks.framing';

/** The ECONOMICS position — DS-GEN-18, beside the supply-chain rows it explains. */
const CRAFT_REASON_MOUNT = 'economics.craftReason';

/** The STEADINGS position — DS-GEN-8, at the section that already renders those three facts. */
const STEADINGS_MOUNT = 'overview.steadings';

/**
 * The NEIGHBOUR-NETWORK position — DS-REL-1.
 * ⚠ `relationships` and `neighbours` are TWO router cases rendering ONE component, so this
 * single row draws on both. That is still ONE position on the page-set: the registry says
 * where a fact speaks, not how many routes reach it — the `power.factionLadder` precedent.
 */
const NETWORK_MOUNT = 'relationships.network';

/** The shape every consumer gets, silent. Frozen so a caller cannot fill it in. */
const SILENT_OVERVIEW = Object.freeze({
  healthLines: Object.freeze([]),
  conflictLines: Object.freeze([]),
  warningLines: Object.freeze([]),
  originLines: Object.freeze([]),
  siteLines: Object.freeze([]),
  situationLine: null,
  connectionLines: Object.freeze([]),
  populationLine: null,
});

/** The same, for the history chapter. */
const SILENT_HISTORY = Object.freeze({
  identityLines: Object.freeze([]),
  foundedLine: null,
  recordLine: null,
});

/** The same, for the viability verdict and the plot-hook framing. */
const SILENT_VIABILITY = Object.freeze({ verdictLines: Object.freeze([]) });
const SILENT_HOOKS = Object.freeze({ framingLines: Object.freeze([]) });
/** The same, for the craft-reason line. */
const SILENT_ECONOMICS = Object.freeze({ craftReasonLine: null });
/** The same, for the neighbour cards and the cross-settlement engagements. */
const SILENT_RELATIONSHIPS = Object.freeze({
  networkLines: Object.freeze([]), engagementLines: Object.freeze([]),
});
/** The same, for the remnant banner, the ancient-ruin banner and the steading cards. */
const SILENT_STEADINGS = Object.freeze({
  remnantLine: null, ruinLine: null, steadingLines: Object.freeze([]),
});

/**
 * ⚠ THIS IS THE READER'S RETURN CONTRACT, exactly as `GENERAL_STATE_PROSE_SILENT` is the
 * desk's: `generalDeskLines` declares `@returns {typeof GENERAL_DESK_SILENT}`, so a position
 * missing here is a position this reader is not allowed to hand back.
 * @type {Readonly<{overview: typeof SILENT_OVERVIEW, history: typeof SILENT_HISTORY,
 *   viability: typeof SILENT_VIABILITY, hooks: typeof SILENT_HOOKS,
 *   economics: typeof SILENT_ECONOMICS, steadings: typeof SILENT_STEADINGS,
 *   relationships: typeof SILENT_RELATIONSHIPS}>}
 */
export const GENERAL_DESK_SILENT = Object.freeze({
  overview: SILENT_OVERVIEW,
  history: SILENT_HISTORY,
  viability: SILENT_VIABILITY,
  hooks: SILENT_HOOKS,
  economics: SILENT_ECONOMICS,
  steadings: SILENT_STEADINGS,
  relationships: SILENT_RELATIONSHIPS,
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
 * @param {{tierNoun?: string|null, publicDossier?: boolean, playerView?: boolean,
 *   stresses?: ReadonlyArray<{type?: unknown}|null>,
 *   hookCategories?: ReadonlyArray<unknown>|null,
 *   clockIds?: ReadonlyArray<unknown>|null,
 *   steadings?: ReadonlyArray<unknown>|null,
 *   lifecycleStatus?: unknown,
 *   ancientRuin?: {name?: unknown, yearsAgo?: unknown}|null,
 *   neighbours?: ReadonlyArray<unknown>|null,
 *   crossEngagements?: ReadonlyArray<unknown>|null,
 *   populationTrend?: {band?: unknown, window?: unknown}|null}} [options]
 *   `stresses` is the caller's OWN normalized stress list — DS-GEN-5 suppresses itself where
 *   a primary stress resolves, and it must key on the SAME ladder the arrival scene above it
 *   keys on or the page prints an ordinary market day underneath a siege banner.
 *   ⛔ `hookCategories` and `clockIds` ARE PASSED IN RATHER THAN REACHED FOR, and the reason
 *   is bytes, not taste: `collectPlotHooks` and `deriveEscalationClocks` drag the supply
 *   chain, faction-profile and hook-retention leaves behind them, and this module is
 *   imported by EVERY tab that draws this desk. PlotHooksTab already pays for the first and
 *   is the one page the second is about, so the derivation stays there and only the two
 *   closed token lists cross this boundary.
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
      prominentRelationship: r.prominentRelationship,
      relationships: r.relationships,
      // DS-GEN-11's contradiction count. ⚠ `.metrics.` IS LOAD-BEARING: the corpus title
      // abbreviates the path and the abbreviated one is `undefined` on every settlement.
      criticalIssueCount: via.metrics?.criticalIssueCount,
      hookCategories: options.hookCategories,
      clockIds: options.clockIds,
      governingName: r.powerStructure?.governingName,
      // DS-GEN-18's four antecedents, all read off the record the tab already holds. The
      // exploitation ledger is `resourceAnalysis`'s, NOT `economicState`'s — the two carry
      // different resource vocabularies and this desk keys the join on the canonical token.
      activeChains: eco.activeChains,
      exploitation: r.resourceAnalysis?.exploitation,
      primaryImports: eco.primaryImports,
      // ⛔ DS-GEN-8's GRADE IS PASSED IN, AND THE REASON IS A MEASURED RATCHET RED RATHER
      // THAN TASTE. Spelling the read here (`r.lifecycleStatus || r.config?.lifecycleStatus`)
      // put TWO NEW identities into `check-observed-shape-readers.mjs` against this file —
      // `lifecycleStatus on settlement` and `lifecycleStatus on config` — because the
      // scanner's corpus is generated worlds and this field is written by a WORLDPULSE
      // kernel during a played one. The scan is right that no generated town carries it and
      // wrong that nothing writes it, which is the observation ratchet's known shape; the
      // cure is not to widen a baseline but to read the field where the estate has already
      // accepted the read. `SteadingsSection.jsx` carries frozen rows for both identities
      // and already spells this exact fallback at its own line 35.
      lifecycleStatus: options.lifecycleStatus,
      // ⛔ THE STEADINGS ARE PASSED IN RATHER THAN REACHED FOR, on the `hookCategories`
      // reasoning: they live in the CAMPAIGN's `spatialLedgers.satellites` ledger, not on the
      // settlement, and only the section that already resolves that ledger from the store
      // can hand them over. A reader that resolved the store itself would be a second
      // opinion about which campaign owns this town.
      steadings: options.steadings,
      // Same reasoning as the grade above, and the same accepted site: the opt-in ancient
      // ruin is read where a frozen row already covers it.
      ancientRuin: options.ancientRuin,
      // DS-REL-1. The links and the typed engagement rows are the tab's OWN assembled lists
      // — it merges `neighbourNetwork`, the live `neighborRelationship` and two conflict
      // ledgers before it renders a card — so the desk reads what the page actually shows
      // rather than re-deriving a second, quietly different list.
      neighbours: options.neighbours,
      crossEngagements: options.crossEngagements,
      // ⛔ DS-POP-3's BAND IS HANDED OVER WHOLE, never recomputed and never reached for.
      // `populationTrendBand` (domain/display/trendLens.js) is the annex's named reader and
      // the sibling POP block's, and it imports `AXIS_TUNING` out of a WORLDPULSE module —
      // reaching for it here would drag the belief-axis chain into every tab chunk that
      // draws this desk. Passing `{band, window}` whole also makes it impossible for a
      // caller to supply a band without the window the gate depends on.
      populationTrend: options.populationTrend,
    },
    {
      seed: String(r?._seed ?? r?.id ?? ''),
      audience: options.playerView ? 'player' : 'dm',
      // FORWARDED, NEVER DERIVED — the sibling economy reader's note carries the reason.
      tierNoun: options.tierNoun ?? null,
    },
  );

  // ⚠ THE HISTORY GROUP IS DESTRUCTURED RATHER THAN CHAINED, and the reason is a measured
  // FALSE POSITIVE rather than style. `check-observed-shape-readers.mjs` grounds an
  // ungrounded receiver by the SINGLE-HOME rule, and `history` has exactly one home in the
  // corpus — the settlement history container. So `prose.history.identity` was read as
  // "a key no writer produces on the settlement's history", when `prose` is this desk's own
  // frozen return value and `generalStateProse` is demonstrably its writer. It is the same
  // defect that scan already documents for `window.history.replaceState`, with `prose` in
  // the receiver slot; the exclusion there is a host-global list this name cannot join, and
  // the baseline refuses to absorb a NEW identity, so the cure is at the read.
  const { identity, founded, record } = prose.history;
  return Object.freeze({
    overview: Object.freeze({
      // ⛔ ALWAYS EMPTY SINCE OWNER ORDER 2026-09-17: `overview.systemsHealth` is a GLANCE row,
      // so `line()` draws no sentence here and no tab renders this field. It stays routed
      // through the registry (the position still exists and still shows its rows); re-homing
      // the sentences is a later registry act, and this reader stays their one call site.
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
      connectionLines: Object.freeze(prose.overview.notableConnection
        .map((rung) => line(CONNECTION_MOUNT, rung)).filter(Boolean)),
      populationLine: line(POPULATION_MOUNT, prose.overview.populationDirection),
    }),
    history: Object.freeze({
      identityLines: Object.freeze(identity
        .map((rung) => line(IDENTITY_MOUNT, rung)).filter(Boolean)),
      foundedLine: line(FOUNDED_MOUNT, founded),
      recordLine: line(RECORD_MOUNT, record),
    }),
    viability: Object.freeze({
      verdictLines: Object.freeze(prose.viability.verdict
        .map((rung) => line(VERDICT_MOUNT, rung)).filter(Boolean)),
    }),
    hooks: Object.freeze({
      framingLines: Object.freeze(prose.hooks.framing
        .map((rung) => line(FRAMING_MOUNT, rung)).filter(Boolean)),
    }),
    economics: Object.freeze({
      craftReasonLine: line(CRAFT_REASON_MOUNT, prose.economics.craftReason),
    }),
    relationships: Object.freeze({
      // One inner pair per link — the standing, then the named-people line — index-paired
      // with the caller's own neighbour cards, nulls kept in place.
      networkLines: Object.freeze(prose.relationships.network
        .map((pair) => Object.freeze(pair.map((rung) => line(NETWORK_MOUNT, rung))))),
      engagementLines: Object.freeze(prose.relationships.engagements
        .map((rung) => line(NETWORK_MOUNT, rung))),
    }),
    steadings: Object.freeze({
      remnantLine: line(STEADINGS_MOUNT, prose.steadings.remnant),
      ruinLine: line(STEADINGS_MOUNT, prose.steadings.ruin),
      // INDEX-PAIRED with the caller's own cards: a null stays in place.
      steadingLines: Object.freeze(prose.steadings.rows
        .map((rung) => line(STEADINGS_MOUNT, rung))),
    }),
  });
}
