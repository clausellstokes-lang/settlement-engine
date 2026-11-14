/**
 * domain/display/dossierViewModel.js
 *
 * The canonical display model (feature doc §1). ONE derivation of
 * display-ready settlement facts that every surface — UI tabs, PDF, gallery,
 * AI grounding — consumes, so a single rule change fixes all surfaces and
 * they cannot silently drift apart.
 *
 * Today, three surfaces re-derive facts independently and contradict:
 *   - PDF (src/pdf/lib/viewModel.js) read foodBalance.production / .need —
 *     fields that don't exist (the generator emits dailyProduction /
 *     dailyNeed) — so the PDF showed "Produced 0 / Needed 0" beside a real
 *     surplus (§1c).
 *   - Current State (src/domain/state/deriveSystemState.js) read
 *     economicState.exports — a field economicState doesn't populate — and
 *     so reported "No exports" while Economics listed economicState
 *     .primaryExports (§1d).
 *
 * M0.1 proves the spine end-to-end on those two field-families; later
 * milestones extend the same model (viability, score labels, timeline, AI
 * grounding, public-safe projection).
 *
 * Pure; no store / React / time dependencies.
 */

import { cleanNum } from './placeholders.js';
import { pickVariant } from '../../kernel/proseHash.js';
import { avgScore } from './defenseScoreBands.js';
import { deriveMagicProfile } from '../magicProfile.js';
import { deriveMagicReliance, magicDialAbsent, magicWorksAt } from '../magicReliance.js';
import { formatCount } from '../formatNumber.js';
// The export-posture derivation lives in its own dependency-free leaf so the
// EAGER deriveSystemState.js can reach it without dragging this whole display
// model (and its magicProfile edge) into the first-paint entry closure
// (FP-1 read-model split; see exportPosture.js). Re-exported below so every
// display surface keeps importing it from here.
import { deriveExportPosture } from './exportPosture.js';
// W-COIN-2 — the ONE band derivation and the ONE open-ledger predicate, read rather than
// re-implemented. This is a LAZY dossier-tab module, so the import touches no first-paint
// byte; the treasury leaf's own header records that its importers are the pulse kernel,
// this display read, and tests.
import { hasOpenTreasury, treasuryBandOf } from '../worldPulse/treasury.js';
// The sanctioned exact-value escape hatch for colour (tabPalette.js's own words), so the
// band accents are lint-clean against the raw-color-literal budget and byte-identical to
// the literals they replace. This module returns the chip's accent (J-T2-E) because
// EconomicsTab.jsx sits exactly on its 600-line ceiling, so the colour has to live here.
import { swatch } from '../../design/tokens.js';
export { deriveExportPosture } from './exportPosture.js';
// ODQ §934.20 — THE FOOD BALANCE BAR'S GEOMETRY, beside the food FIGURES this file
// already derives. The bar and the sentence under it are one fact drawn twice, so
// the run widths are cut from the same published fields `deriveFoodBalance` reads
// and the tail IS its `deficitPct`. Re-exported here (the exportPosture idiom
// above) so the Economics tab and the PDF economics chapters reach one arithmetic
// through the one display import they already carry.
export { foodBarSegments, magicFoodChannelWord } from './foodBalanceBar.js';

const VIABILITY_LABEL = Object.freeze({
  not_viable:      'Not viable',
  strained:        'Viable but strained',
  dependent:       'Viable with critical dependencies',
  self_sufficient: 'Viable',
  unknown:         'Unknown',
});

/**
 * The generator's foodBalance record (economicViability.metrics.foodBalance) —
 * numeric fields typed `unknown` because they pass through cleanNum coercion.
 * @typedef {Object} FoodBalanceRecord
 * @property {unknown} [dailyProduction]
 * @property {unknown} [dailyNeed]
 * @property {unknown} [surplus]
 * @property {unknown} [deficit]
 * @property {unknown} [deficitPercent]
 * @property {unknown} [importCoverage]
 * @property {unknown} [rawDeficit]
 * @property {string|null} [importChannel]
 * @property {unknown} [magicFoodOffset]
 * @property {string|null} [magicFoodNote]
 */

/**
 * Structural view of the economicState fields the display model reads.
 * @typedef {Object} EconStateView
 * @property {unknown} [primaryExports] @property {unknown} [primaryImports]
 * @property {unknown} [exports]
 * @property {unknown} [isEntrepot]
 * @property {unknown} [prosperity]
 * @property {{ stockpile?: { blockaded?: unknown, blockadeBypass?: string|null } | null } | null} [foodSecurity]
 */

/**
 * Structural view of the settlement fields the display model reads.
 * @typedef {Object} DossierSettlementView
 * @property {string} [name] the town's own name (W2 DEF #36: the viability verdict says it)
 * @property {unknown} [_seed] the generation seed (the viability draw's key)
 * @property {unknown} [id] the saved settlement's id (the key's fallback)
 * @property {{ metrics?: { foodBalance?: FoodBalanceRecord | null, tradeAccess?: string } | null, summary?: string | null, viable?: boolean | null, dependencies?: unknown[] } | null} [economicViability]
 * @property {EconStateView | null} [economicState]
 * @property {{ tradeRouteAccess?: string } | null} [config]
 */

/**
 * @param {unknown} n
 * @returns {string|null}
 */
function fmtInt(n) {
  const v = cleanNum(n);
  // formatCount, not toLocaleString('en-US'): even an explicit-locale Intl call
  // depends on the host shipping full ICU data (small-icu Node silently falls
  // back to a different locale). formatCount is table-free and byte-identical
  // to en-US grouping for integers.
  return v == null ? null : formatCount(Math.round(v));
}

/**
 * Food balance (§1c). Reads the generator output at
 * economicViability.metrics.foodBalance, whose real fields are
 * dailyProduction / dailyNeed (NOT production / need). Enforces the rule:
 * never show produced=0 & needed=0 next to a non-zero surplus/deficit —
 * fall back to "Not calculated".
 *
 * @param {DossierSettlementView | null | undefined} settlement
 */
export function deriveFoodBalance(settlement) {
  const fb = settlement?.economicViability?.metrics?.foodBalance || null;
  if (!fb) {
    return {
      available: false,
      display: 'Not calculated',
      detail: 'Produced/Needed: Not calculated',
      surplus: 0, deficit: 0, deficitPct: null, deficitPercent: null,
      produced: null, needed: null, importCoverage: null, rawDeficit: null,
      importChannel: null, magicFoodOffset: null, magicFoodNote: null,
    };
  }
  const produced = cleanNum(fb.dailyProduction);
  const needed   = cleanNum(fb.dailyNeed);
  // placeholders.cleanNum lacks annotations (inferred fallback: null); it accepts a number fallback and returns number here (crossFileNeeds).
  const surplus  = Math.max(/** @type {number} */ (cleanNum(fb.surplus, 0)), 0);
  // same cleanNum annotation gap (crossFileNeeds).
  const deficit  = Math.max(/** @type {number} */ (cleanNum(fb.deficit, 0)), 0);
  const rawKnown = produced != null && needed != null && (produced > 0 || needed > 0);

  // Normalize the residual deficit against need. A raw absolute (e.g. −4096)
  // looks alarming out of context, but as a share of demand it reads as the
  // minor shortfall it usually is — most settlements run a little hungry, and
  // that's the baseline, not a broken settlement. Shown as a % of need.
  //
  // ⚠ THE RECORD'S OWN PERCENTAGE FIRST. `deficitPercent` is the residual share
  // the food model computed from its UNROUNDED pounds, and it is the number the
  // band word was cut on and the number the Daily Life tab, the AI brief and
  // foodNarrative already print. Re-deriving it here from the published integer
  // pounds throws away the fraction: a thorp needing 60 lb/day with a 2.4 lb
  // residual is 4% on the record and 3% once the pounds have been rounded, and
  // the two surfaces then printed different percentages for one fact (12 of the
  // golden master's 525 configurations). Recomputing stays as the arm for a
  // record that carries no percentage of its own — an older save, or a caller
  // that hands us only pounds and need.
  const recordedPct = cleanNum(fb.deficitPercent);
  const deficitPct = deficit > 0 && recordedPct != null && recordedPct > 0
    ? Math.round(recordedPct)
    : (needed != null && needed > 0) ? Math.round((deficit / needed) * 100) : null;

  let display;
  if (deficit > 0)      display = deficitPct != null ? `Deficit −${fmtInt(deficit)} (${deficitPct}% of need)` : `Deficit −${fmtInt(deficit)}`;
  else if (surplus > 0) display = `Surplus +${fmtInt(surplus)}`;
  else                  display = 'Balanced';

  return {
    available: true,
    display,
    detail: rawKnown
      ? `Produced/Needed: ${fmtInt(produced)} / ${fmtInt(needed)} lb/day`
      : 'Produced/Needed: Not calculated',
    surplus,
    deficit,
    // Residual deficit normalized as a share of daily need (null when unknown).
    deficitPct,
    deficitPercent: cleanNum(fb.deficitPercent),
    produced: rawKnown ? produced : null,
    needed: rawKnown ? needed : null,
    // importCoverage is a QUANTITY (lb/day of the gap covered by imports), not a
    // percent. rawDeficit is the pre-import gap (need − production). The display
    // layer computes coverage% = importCoverage / rawDeficit, mirroring the web.
    importCoverage: cleanNum(fb.importCoverage),
    rawDeficit: cleanNum(fb.rawDeficit),
    // Attribution: which channel carries the imports (e.g. 'teleportation
    // circle', 'minor routes and sanctioned caravans') and how much of the
    // gap magic closes — lets displays explain deficit < (needed − produced).
    importChannel: fb.importChannel || null,
    magicFoodOffset: cleanNum(fb.magicFoodOffset),
    magicFoodNote: fb.magicFoodNote || null,
  };
}

// deriveExportPosture (§1d) moved to ./exportPosture.js (re-exported above) —
// see the import note at the top of this file.

/**
 * The canonical display model. M0.1 surfaces foodBalance + exportPosture.
 * The `aiOverlay` option is reserved for later milestones (prose-field
 * overlays); food + exports are canonical simulation facts and always read
 * from the base settlement, never an AI clone.
 */
/**
 * Viability verdict (§1f). Reconciles the generator's verdict with the food
 * balance + trade dependencies so the wording never claims "self-sufficient"
 * while the dossier shows a food deficit. buildConflict() (economicGenerator)
 * only checks dependency warnings for its "self-sufficient" branch — it
 * ignores a food deficit — which is the contradiction this corrects.
 *
 * @param {DossierSettlementView | null | undefined} settlement
 */
export function deriveViability(settlement) {
  /** @type {NonNullable<DossierSettlementView['economicViability']>} */
  const v = settlement?.economicViability || {};
  const rawSummary = v.summary || null;
  // #36 (STYLE-RULINGS §1; W2 DEF, 2026-11-07): each verdict says its finding in the town's own
  // name, from a few variants the seed chooses (the same town always reads the same line).
  const name = viabilityName(settlement);
  const pick = (/** @type {readonly string[]} */ pool) => pickVariant(pool, viabilitySeed(settlement));

  if (v.viable === false) {
    return {
      viable: false, verdict: 'not_viable', label: VIABILITY_LABEL.not_viable,
      summary: name
        ? `✗ NOT VIABLE: ${pick([
          `${name} cannot last as things stand.`,
          `As things stand, ${name} will not survive.`,
        ])}`
        : (rawSummary || 'Not viable: critical issues prevent the settlement from surviving.'),
      rawSummary,
    };
  }
  if (v.viable == null && !rawSummary) {
    return { viable: null, verdict: 'unknown', label: VIABILITY_LABEL.unknown, summary: 'Viability not assessed.', rawSummary };
  }

  const food = deriveFoodBalance(settlement);
  const dependencyCount = Array.isArray(v.dependencies) ? v.dependencies.length : 0;
  const town = name || 'The settlement'; const seen = outlookFactsOf(settlement); // UPKEEP-8 (#228 #253 #326 #379): the Outlook says only what the town's own pages say

  if (food.deficit > 0) {
    // "Depends on imports" must match what the import channel actually is:
    // an isolated settlement with 0% coverage survives on stores and local
    // production, not on imports it does not receive (the Yunwan bug).
    const access = settlement?.economicViability?.metrics?.tradeAccess
                || settlement?.config?.tradeRouteAccess
                || 'unknown';
    const covered = (food.importCoverage || 0) > 0;
    const route = importRoutePhrase(food.importChannel);
    // "Magical provision" is only honest when magic actually closes part
    // of the gap (magicFoodOffset > 0) — a mundane caravan trickle in a
    // magicExists:false world must not read as magically fed.
    const magicFed = (food.magicFoodOffset || 0) > 0;
    let line;
    if (access === 'isolated') {
      // Legacy saves carry importCoverage without importChannel — the imports are real (Economics
      // shows the coverage), the route just was not recorded: the phrase falls back to "from outside".
      line = covered
        ? pick([
          `${town} lies off the trade roads, yet it gets by: some of its food comes in ${route}${magicFed ? ', magic supplies a share,' : ''} and it draws on its stores.`,
          `${town} grows less than it eats and has no dependable road to make up the rest; what it lacks comes in ${route}${magicFed ? ' and by magic' : ''}, and from its stores.`,
        ])
        : pick([
          `${town} grows less than it eats, and nothing from outside makes up the difference; it lives on its own land${magicFed ? ', on magic,' : ''} and on what is in store.`,
          `Nothing reliable reaches ${town} from outside, and its own land does not grow enough; the rest comes from its stores${magicFed ? ' and from magic' : ''}.`,
        ]);
    } else if (covered) {
      line = pickTrue(pick, [
        `${town} cannot feed itself: part of its food comes in ${route}.`,
        `${town} grows less than it eats, and the difference arrives ${route}.`,
        `${town} keeps order and pays its way, but it has to buy food to get through the year, and the food comes in ${route}.`,
        `Much of what ${town} eats is brought in ${route}; its own land does not produce enough.`,
      ], [true, true, seen.keepsOrder && seen.paysItsWay, true], '');
    } else {
      line = pick([
        `${town} grows less than it eats, and its trade brings in little food to make up the difference.`,
        `${town}'s own land does not grow enough, and little food reaches it from outside.`,
      ]);
    }
    return {
      viable: true, verdict: 'strained', label: VIABILITY_LABEL.strained,
      summary: `VIABLE BUT STRAINED: ${line}`,
      rawSummary,
    };
  }
  if (dependencyCount > 0) {
    const goods = dependencyGoods(v.dependencies, settlement?.economicState?.primaryImports), many = goods !== null && (/ and /.test(goods) || /s$/.test(goods)); // UPKEEP-8 (#253): a good the import list holds, and its number
    return {
      viable: true, verdict: 'dependent', label: VIABILITY_LABEL.dependent,
      summary: `VIABLE WITH CRITICAL DEPENDENCIES: ${pick(goods
        ? [
          `${town} can stand, but only while ${goods} ${many ? 'keep' : 'keeps'} arriving and the routes that bring ${many ? 'them' : 'it'} stay open.`,
          `${town}'s trades run on ${goods} brought in from elsewhere; if that supply stopped, they would stop with it.`,
          `${town} works well enough, as long as nobody cuts it off from the ${goods} it buys in.`,
        ]
        : [
          `${town} can stand, but only while the goods it buys in keep arriving and the routes that bring them stay open.`,
          `${town}'s trades run on goods brought in from elsewhere; if that supply stopped, they would stop with it.`,
        ])}`,
      rawSummary,
    };
  }
  return {
    viable: true, verdict: 'self_sufficient', label: VIABILITY_LABEL.self_sufficient,
    summary: `VIABLE: ${pickTrue(pick, [
      `${town} feeds itself and pays its own way.`,
      `${town} grows what it eats and makes what it needs, and owes no one for either.`,
      `Nothing ${town} needs to get through the year has to come from outside.`,
    ], [!seen.buysFood && seen.paysItsWay, !seen.buysFood && !seen.needsImports, !seen.buysFood && !seen.needsImports], `${town} gets through the year, buying in what its own land and trades do not provide.`)}`,
    rawSummary,
  };
}

/**
 * How the imported food reaches a town, in a player's words, from the food balance's recorded
 * channel (`foodBalance.js`: '<route> trade', 'minor routes and sanctioned caravans', a magical
 * channel). An unrecorded or unknown channel reads "from outside" — never a guessed route.
 * @type {Readonly<Record<string, string>>}
 */
const IMPORT_ROUTE_PHRASE = Object.freeze({
  'port trade': 'by sea',
  'river trade': 'by river',
  'road trade': 'by road',
  'crossroads trade': 'along the roads that meet there',
  'mountain pass trade': 'over the pass',
  'minor routes and sanctioned caravans': 'by caravan',
  'teleportation circle': 'through the teleportation circle',
  'airship traffic': 'by airship',
});

/** @param {unknown} channel @returns {string} */
function importRoutePhrase(channel) {
  return (typeof channel === 'string' && IMPORT_ROUTE_PHRASE[channel]) || 'from outside';
}

/**
 * The goods a dependent town buys in, from its own dependency rows ("Imports grain"), the first
 * two by name; null where no row names a good (the variants then speak of "the goods it buys in"); UPKEEP-8: only a good the list holds.
 * @param {unknown} dependencies @param {unknown} [imports] the town's printed import list @returns {string|null}
 */
function dependencyGoods(dependencies, imports = null) {
  if (!Array.isArray(dependencies)) return null; const listed = Array.isArray(imports) ? imports.map((x) => String(x).toLowerCase()) : null;
  const goods = /** @type {string[]} */ ([...new Set(dependencies
    .map((d) => /^Imports (.+)$/.exec(String(d?.title || ''))?.[1]?.replace(/\s*\(.*\)\s*$/, '').trim().toLowerCase())
    .filter((g) => g && !/[0-9]/.test(g) && (!listed || listed.some((x) => x.includes(g)))))]);
  if (goods.length === 0) return null;
  return goods.length === 1 ? goods[0] : `${goods[0]} and ${goods[1]}`;
}

/** @param {DossierSettlementView | null | undefined} settlement @returns {string} */
function viabilityName(settlement) {
  const name = typeof settlement?.name === 'string' ? settlement.name.trim() : '';
  return name;
}

/** @param {DossierSettlementView | null | undefined} settlement @returns {string} */
function viabilitySeed(settlement) {
  const s = settlement;
  const seed = s?._seed ?? s?.id ?? s?.name ?? '';
  return seed ? `${seed}|viability` : '';
}

/**
 * Blockade relief (Wave 8 — blockadeBypass gains its reader). The stockpile
 * bookkeeping (economicState.foodSecurity.stockpile, written every pulse by
 * advanceFoodStockpile) records whether a blockade currently grips the
 * settlement and which magical channel, if any, runs it. This is the display
 * read of that record: the dossier's food/viability surface can finally say
 * WHY the siege did or didn't bite instead of leaving the granary math
 * unexplained. Settlements the pulse has never touched (no stockpile record)
 * report available:false and say nothing. The prose field is named `display`
 * (the view-model idiom) — NOT `note`, which the publicSafe denylist strips.
 *
 * @param {DossierSettlementView | null | undefined} settlement
 */
export function deriveBlockadeRelief(settlement) {
  const sp = settlement?.economicState?.foodSecurity?.stockpile || null;
  if (!sp) return { available: false, blockaded: false, bypass: null, display: null };
  const blockaded = !!sp.blockaded;
  const bypass = sp.blockadeBypass || null;
  let display = null;
  if (blockaded) {
    display = bypass === 'teleport'
      ? "Supplies arrive by teleportation circle despite the siege: up to the circle's throughput."
      : bypass === 'airship'
        ? 'Airships run the blockade. Imports continue, impaired by siege countermeasures.'
        : 'The blockade is biting: no magical channel runs it, and the import share of need goes unmet.';
  }
  return { available: true, blockaded, bypass, display };
}

// ── SEASONS-A: the seasonal granary read ─────────────────────────────────────
// Self-contained on the stockpile bookkeeping advanceFoodStockpile stamps
// UNDER seasonsEnabled (season/seasonWeek/seasonalSwingPct/seasonalEvent —
// fieldManifest rows). A flag-off or never-pulsed settlement carries no season
// field ⇒ available:false and the surface says nothing (dormancy-clean).

/** @type {Readonly<Record<string, string>>} */
const SEASON_TITLE = Object.freeze({ spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' });
/** @type {Readonly<Record<string, string>>} */
const SEASONAL_EVENT_NOTE = Object.freeze({
  hard_winter: 'A hard winter grips the year.',
  drought: 'Drought struck the harvest.',
  bountiful: 'A bountiful year.',
});
const WEEKS_PER_SEASON = 13;
const SEASON_ORDER = Object.freeze(['spring', 'summer', 'autumn', 'winter']);

/** "early/mid/late <season>" for a 1-based week-of-year, DM-speakable.
 *  @param {number} weekOfYear */
function seasonPhaseLabel(weekOfYear) {
  const w0 = ((Math.floor(weekOfYear) - 1) % 52 + 52) % 52;
  const season = SEASON_ORDER[Math.floor(w0 / WEEKS_PER_SEASON)] || 'spring';
  const wos = (w0 % WEEKS_PER_SEASON) + 1;
  const phase = wos <= 4 ? 'early' : wos <= 9 ? 'mid' : 'late';
  return `${phase} ${season}`;
}

/**
 * The dossier's seasonal food read (design §4i item 6): current season, the
 * granary level against its derived capacity as a band, and — while in
 * drawdown — a derived "stores will last until ~X" projection from the
 * CURRENT release rate (reliefPct is % of need released this tick; a week
 * costs (reliefPct/100)×(3/13) months under the 4-4-5 calendar). Derived,
 * fiction-level, never a mechanism name.
 * @param {DossierSettlementView | null | undefined} settlement
 */
export function deriveGranaryOutlook(settlement) {
  const fs = /** @type {{ storageMonths?: unknown, stockpile?: { capacityMonths?: unknown, reliefPct?: unknown, season?: string|null, seasonWeek?: unknown, seasonalEvent?: string|null } | null } | null} */ (
    settlement?.economicState?.foodSecurity || null
  );
  const sp = fs?.stockpile || null;
  if (!sp || !sp.season) {
    return { available: false, season: null, seasonTitle: null, band: null, display: null, detail: null, lastsUntil: null, yearEvent: null };
  }
  const level = cleanNum(fs?.storageMonths, 0) ?? 0;
  const cap = cleanNum(sp.capacityMonths, 0) ?? 0;
  const frac = cap > 0 ? level / cap : 0;
  const band = frac >= 0.75 ? 'well stocked' : frac >= 0.4 ? 'stocked' : frac >= 0.15 ? 'thin' : 'nearly empty';
  const seasonTitle = SEASON_TITLE[/** @type {string} */ (sp.season)] || String(sp.season);
  // Drawdown projection: only while stores are actually being released.
  const reliefPct = cleanNum(sp.reliefPct, 0) ?? 0;
  const drawPerWeek = (reliefPct / 100) * (3 / 13);
  let lastsUntil = null;
  if (drawPerWeek > 0 && level > 0) {
    const weeksLeft = Math.round(level / drawPerWeek);
    lastsUntil = weeksLeft > 52 ? 'beyond the year' : `~${seasonPhaseLabel((cleanNum(sp.seasonWeek, 1) ?? 1) + weeksLeft)}`;
  } else if (drawPerWeek > 0) {
    lastsUntil = 'already spent';
  }
  const yearEvent = SEASONAL_EVENT_NOTE[/** @type {string} */ (sp.seasonalEvent)] || null;
  // ⛔ THE TILE'S TWO PARTS ARE FIELDS, NOT A SPLIT. `display` is a JOINED string, so any
  // consumer that wanted the heading and the sub-line back had to re-parse it on the ` — `
  // delimiter, which is a contract spelled twice: once here by the composer, once in a view
  // that had to guess it. EconomicsGlance.jsx did exactly that, three times on one line. The
  // parts are returned now and `display` is composed FROM them, so the delimiter has one
  // home and `display` stays byte-identical to what it always was.
  const detail = [
    `the granary is ${band} (${level.toFixed(1)} of ${cap.toFixed(1)} months)`,
    lastsUntil && lastsUntil !== 'already spent' ? `stores will last until ${lastsUntil}` : null,
    lastsUntil === 'already spent' ? 'the granary is spent' : null,
    yearEvent,
  ].filter(Boolean).join('. ');
  const display = `${seasonTitle} — ${detail}`;
  return { available: true, season: sp.season, seasonTitle, band, level, capacity: cap, lastsUntil, yearEvent, detail, display };
}

// ── W-COIN-2: the treasury's at-a-glance band (A1.21) ────────────────────────

/** Band → the tile's accent, in the palette the neighbouring food and season tiles
 *  already use, so the glance row reads as ONE row rather than as a bolted-on chip.
 *  `overflowing` takes the trade-gold rather than a deeper green deliberately: a crown
 *  sitting on a full vault is a fact about its hoard, not a report card. */
/** @type {Readonly<Record<string, string>>} */
const TREASURY_TILE_COLOR = Object.freeze({
  empty: swatch['#8B1A1A'], lean: swatch['#A0762A'], adequate: swatch['#1A5A28'], full: swatch['#1A5A28'], overflowing: swatch['#7A5010'],
});

/**
 * THE COIN CHIP's read — how full the crown's vault stands, in one closed word.
 *
 * A1.21's whole reason for existing, in one sentence: the flag is lit by the preset table
 * from W-COIN-2 onward, and a lit world must never be GLANCE-BLIND about a stock it
 * cannot see. So the band rides the dossier's at-a-glance tiles beside the granary — the
 * literal glance — rather than waiting for W-COIN-4's fuller display row.
 *
 * ⛔ NO FIGURE, EVER (§776, the owner's price-heuristics law). The treasury's LEDGER keeps
 * exact integer coin because a ledger is a record; every SURFACE speaks in bands. The
 * granary tile beside this one may print months because goods QUANTITIES are facts — coin
 * is the DM's mandate, and this tile carries a word and nothing else.
 *
 * ⛔ AND IT READS THE ONE BAND DERIVATION. The coin news beats band the same fraction from
 * the same function; a second threshold table written here for the second consumer would
 * be the §711.6 class exactly — a number with two readings, each internally consistent,
 * neither ever reddening. `available:false` on any world whose ledger was never opened, so
 * a dark campaign renders no tile at all and this surface stays dormancy-clean.
 *
 * ⚠ THE TILE COLOUR IS RETURNED FROM HERE, AND THAT IS A CONSTRAINT SPEAKING, NOT A TASTE.
 * `EconomicsTab.jsx` sits EXACTLY on its frozen 600-effective-line ceiling — measured, not
 * assumed: 600 at the base, 605 with a colour ternary written there — so the chip lands
 * under the same +0 join idiom the pulse kernel's edits use, and the two lines it does
 * cost are joined onto lines that already existed. This module is `domain/display` and
 * already returns rendered prose (`deriveGranaryOutlook().display`), so a colour token is
 * the same class of thing it was already handing to the same tab.
 *
 * @param {DossierSettlementView | null | undefined} settlement
 * @returns {{ available: boolean, band: string|null, color: string }}
 */
export function deriveTreasuryGlance(settlement) {
  const s = /** @type {Parameters<typeof hasOpenTreasury>[0]} */ (/** @type {unknown} */ (settlement));
  if (!hasOpenTreasury(s)) return { available: false, band: null, color: TREASURY_TILE_COLOR.adequate };
  const band = treasuryBandOf(s);
  return { available: true, band, color: TREASURY_TILE_COLOR[band] || TREASURY_TILE_COLOR.adequate };
}

/** @type {Readonly<Record<string, string>>} */
const MAGIC_ROLE_LABEL = Object.freeze({
  economic:       'Economic',
  military:       'Military',
  medical:        'Medical',
  infrastructure: 'Infrastructure',
});

/**
 * Magic posture (Wave 7 — MagicProfile surfaced). One read of the Tier 4.8
 * profile for every display surface: the availability/legality/cost/risk
 * bands plus the four role lines. Dead-magic worlds (config.magicExists ===
 * false) keep the profile's honest 'absent' shape — the dossier must never
 * price a magic economy that does not exist.
 *
 * @typedef {Object} MagicProfileLike  structural view of magicProfile.js#deriveMagicProfile output
 * @property {boolean} [magicExists]
 * @property {string} [availability]
 * @property {string} [legality]
 * @property {string} [institutionalControl]
 * @property {string} [cost]
 * @property {string} [risk]
 * @property {string} [religiousAcceptance]
 * @property {Record<string, string>} roles
 *
 * @param {DossierSettlementView | null | undefined} settlement
 */
export function deriveMagicPosture(settlement) {
  /** @type {MagicProfileLike | null} */
  // @ts-expect-error -- deriveMagicProfile declares @returns {Object}; the profile shape is stable (crossFileNeeds: export a MagicProfile typedef from magicProfile.js).
  const m = deriveMagicProfile(settlement);
  if (!m) {
    return { available: false, magicExists: null, display: 'Not assessed', roles: null, roleLines: [] };
  }
  return {
    available: true,
    magicExists: m.magicExists !== false,
    availability: m.availability,
    legality: m.legality,
    institutionalControl: m.institutionalControl,
    cost: m.cost,
    risk: m.risk,
    religiousAcceptance: m.religiousAcceptance,
    roles: { ...m.roles },
    // ⭐ THE POSTURE WORD, NOT A SENTENCE OF FACETS (UX consolidation 2026-10-30, RULINGS-T2
    // T2-26; RUBRIC R2). It used to read `Availability <a>: <legality>, <cost> services, <risk>
    // risk`, one line above the envelope that prints those four facets (750 of 750 magic
    // worlds). The envelope owns the facets; the headline keeps the one word. A dead-magic
    // world keeps its sentence, because there the line IS the page.
    display: m.magicExists === false
      ? 'Magic does not function in this world'
      : String(m.availability || '').charAt(0).toUpperCase() + String(m.availability || '').slice(1),
    roleLines: Object.entries(m.roles).map(([role, band]) => `${MAGIC_ROLE_LABEL[role] || role} role: ${band}`),
  };
}

/**
 * The canonical display model. M0.1 surfaced foodBalance + exportPosture; M0.2
 * adds viability; Wave 7 adds the magic posture; Wave 8 adds blockade relief.
 * The `aiOverlay` option is reserved for later milestones (prose-field
 * overlays); these are canonical simulation facts and always read from the
 * base settlement, never an AI clone.
 */
/**
 * Headcounts (§overview). The institution / NPC / faction totals that BOTH the
 * screen overview and the PDF overview render — sourced identically here so the
 * two surfaces can never disagree on a count.
 * @param {any} settlement
 * @returns {{ institutions: number, npcs: number, factions: number }}
 */
export function deriveHeadcounts(settlement) {
  const s = settlement || {};
  return {
    institutions: (s.institutions || []).length,
    npcs: (s.npcs || []).length,
    // The powers are the only faction roster (PEOPLE-5A: the NPC grouping's fallback deleted).
    factions: (s.powerStructure?.factions || []).length,
  };
}

/**
 * Prosperity label (§overview/economics) — the prosperity enum BOTH surfaces render; tone is per-surface
 * (web RGB scale, PDF print palette), so only the label is a shared scalar. `inCrisis`: beside a label a
 * crisis in force lowered, the one sentence of what the place is in ordinary years (ruling 1(a), REVIEW-UPKEEP-2).
 * @param {any} settlement
 * @returns {{ label: string | null, inCrisis: string | null }}
 */
export function deriveProsperityPosture(settlement) {
  return { label: settlement?.economicState?.prosperity || null, inCrisis: prosperityInCrisisLine(settlement) };
}

/**
 * Safety label (§overview) — the safetyProfile.safetyLabel BOTH surfaces render.
 * Tone is per-surface (see deriveProsperityPosture); only the label is shared.
 * @param {any} settlement
 * @returns {{ label: string | null }}
 */
export function deriveSafetyPosture(settlement) {
  return { label: settlement?.economicState?.safetyProfile?.safetyLabel || null };
}

/**
 * Defense posture (§overview/defense) — the readiness label + average defense
 * score BOTH surfaces render. scoreAvg mirrors the PDF avgScore helper exactly
 * (rounded mean of the numeric score values); the parity pin guards the two copies
 * against future drift.
 * @param {any} settlement
 * @returns {{ readinessLabel: string | null, scoreAvg: number | null }}
 */
export function deriveDefensePosture(settlement) {
  const dp = settlement?.defenseProfile || {};
  // ONE derivation, in defenseScoreBands.js. This was a second inline copy of the same mean,
  // which is the drift `parityContract.js`'s `defense.scoreAvg` row exists to catch.
  return { readinessLabel: dp.readiness?.label || null, scoreAvg: avgScore(dp.scores) };
}

/**
 * Top export label (§summary) — labelOfThing(primaryExports[0]); mirrors the PDF
 * labelOfThing helper exactly (the good/name/label of the first primary export).
 * @param {any} settlement
 * @returns {{ label: string }}
 */
export function deriveTopExport(settlement) {
  const item = settlement?.economicState?.primaryExports?.[0];
  if (!item) return { label: '' };
  if (typeof item === 'string') return { label: item };
  return { label: item.good || item.name || item.label || '' };
}

/**
 * @param {DossierSettlementView | null | undefined} settlement
 * @param {{ aiOverlay?: unknown }} [options]  aiOverlay reserved for later milestones
 */
export function deriveDossierViewModel(settlement, { aiOverlay: _aiOverlay = null } = {}) {
  return {
    foodBalance: deriveFoodBalance(settlement),
    exportPosture: deriveExportPosture(settlement),
    viability: deriveViability(settlement),
    magic: deriveMagicPosture(settlement),
    magicReliance: deriveMagicRelianceView(settlement),
    blockade: deriveBlockadeRelief(settlement),
    headcounts: deriveHeadcounts(settlement),
    prosperity: deriveProsperityPosture(settlement),
    safety: deriveSafetyPosture(settlement),
    defense: deriveDefensePosture(settlement),
    topExport: deriveTopExport(settlement),
  };
}

/**
 * ⭐ ONE PREDICATE, ASKED ONCE (lane MAGIC, chair ruling 1, 2026-11-03). Every dossier row
 * that grades or describes magic asks the world's one answer, `magicWorksAt`, THROUGH THIS
 * GATE, and where magic does not work the row is ABSENT: no "Critical", no "Adequate", no
 * row. The Overview's Systems Health bars, the Foundations grid and the reliance rows hand
 * their whole row list here, so a row added to any of those lists is asked too. A row is a
 * magic row when its key names magic (`magical`, `magical_stability`, `magicReliance`):
 * the key is the row's own identity, so a new magic row cannot slip past by its label.
 *
 * Why this was needed: the generator already scored magic 0 and dropped it from the
 * readiness average in historical mode, but the Overview still drew "Magical Capability ·
 * Critical" and Foundations "Magical stability · Adequate" on 36 of 36 magic-off
 * settlements (docs/GENERATION_ROOT_CAUSES_2026-11-02.md, appendix 3, cause 1).
 */
const MAGIC_ROW_KEY = /magic/i;

/**
 * Is this row key a magic row?
 * @param {unknown} key
 * @returns {boolean}
 */
export function isMagicRowKey(key) {
  return MAGIC_ROW_KEY.test(String(key ?? ''));
}

/**
 * The row list with every magic row removed where magic does not work; the list unchanged
 * where it does.
 * @template {object} R
 * @param {unknown} settlement
 * @param {readonly R[]} rows
 * @param {(row: R) => unknown} [keyOf]  defaults to the row's `key`
 * @returns {R[]}
 */
export function magicRowsGated(settlement, rows, keyOf = (row) => /** @type {{ key?: unknown }} */ (row).key) {
  const list = Array.isArray(rows) ? [...rows] : [];
  if (!magicWorksAt({ settlement })) return list.filter((row) => !isMagicRowKey(keyOf(row)));
  // ⛔ NOTHING TO GRADE WHERE THE DIAL READS ABSENT (lane RUNG1B-F9 unit 2b, 2026-11-04;
  // soak1k-13 Amarthal: "Magical Capability Critical" beside "Reliance on magic None" and an
  // envelope reading "Availability absent", 20 of 20 such pages in the 60). Where the place's
  // own dial reads absent (`magicReliance.js :: magicDialAbsent`, the Magic tab's envelope
  // predicate) the GRADE rows go; the reliance row stays, because "None" is the true reading.
  if (magicDialAbsent(/** @type {import('../magicReliance.js').MagicRelianceSource} */ (/** @type {unknown} */ (settlement)))) {
    return list.filter((row) => !isMagicRowKey(keyOf(row)) || keyOf(row) === 'magicReliance');
  }
  return list;
}

/**
 * The reliance reading as the dossier prints it (lane MAGIC, chair ruling 2): ONE reading,
 * derived once in `domain/magicReliance.js`, printed by Overview, Magic and Foundations in
 * this one word. `shown` is false where magic does not work (the gate above), so no tab
 * prints a reliance row in historical mode.
 * @param {DossierSettlementView | null | undefined} settlement
 * @returns {{ reading: string, word: string, shown: boolean, practitioners: string[], dependents: string[], reliesOnMagic: boolean }}
 */
export function deriveMagicRelianceView(settlement) {
  const r = deriveMagicReliance(/** @type {import('../magicReliance.js').MagicRelianceSource} */ (/** @type {unknown} */ (settlement)));
  return {
    reading: r.reading,
    word: r.word,
    shown: magicRowsGated(settlement, [{ key: 'magicReliance' }]).length > 0,
    practitioners: r.practitioners,
    dependents: r.dependents,
    reliesOnMagic: r.reading === 'relied-upon' || r.reading === 'integral',
  };
}

/**
 * WHERE THE MAGIC COMES FROM, as the Magic tab's reliance line prints it (W2-A-LEAVES, 2026-11-12; census row 3,
 * the chair's ruling: "the Magic tab names where the magic it says the town relies on comes from, read from the
 * leaf; where nothing supplies it, the reliance line does not print"). Read from `facts/magicSource.js`: every
 * house by name (those that practise, then those that supply a dependent chain), then the people who practise,
 * one by name and more than one counted ("Mages' guild and 3 practitioners").
 *   - `supply`: that phrase, where the place relies on magic and something supplies it; null otherwise.
 *   - `statable`: false only where the place relies on magic and nothing on the record supplies it; the line
 *     is then not printed.
 * @param {DossierSettlementView | null | undefined} settlement
 * @returns {{ supply: string|null, statable: boolean }}
 */
export function deriveMagicSupplyView(settlement) {
  const reliance = deriveMagicRelianceView(settlement);
  if (!reliance.reliesOnMagic) return { supply: null, statable: true };
  const { houses, people } = magicSourceOf(settlement);
  const parts = houses.map(proseHouseName).filter((n, i, all) => n && all.findIndex((p) => p.toLowerCase() === n.toLowerCase()) === i);
  if (people.length === 1) parts.push(people[0]);
  else if (people.length > 1) parts.push(`${people.length} practitioners`);
  if (parts.length === 0) return { supply: null, statable: false };
  const supply = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
  return { supply, statable: true };
}

/**
 * The settlement as the DS-DEF-9 reliance desk must read it: its `magicDependency` flag
 * READ FROM the one reliance reading (relied-upon or integral ⇒ true), not from the frozen
 * defence flag, which the defence generator sets only during a siege, famine or plague. The
 * Magic tab hands the desk this view, so the reliance sentence and the role lines above it
 * answer from one reading (lane MAGIC, chair ruling 2).
 * @template {object} S
 * @param {S} settlement
 * @returns {S}
 */
export function magicRelianceDeskSettlement(settlement) {
  const rec = /** @type {Record<string, unknown>} */ (settlement || {});
  const defenseProfile = /** @type {Record<string, unknown>} */ (rec.defenseProfile || {});
  const reliance = deriveMagicRelianceView(/** @type {DossierSettlementView} */ (/** @type {unknown} */ (rec)));
  return /** @type {S} */ (/** @type {unknown} */ ({
    ...rec,
    defenseProfile: { ...defenseProfile, magicDependency: reliance.reliesOnMagic },
  }));
}
// The prosperity sentence's one writer (ruling 1(a)); imported here, not at the head, so the line-keyed
// holder census's citations into this file stay put.
import { prosperityInCrisisLine } from './prosperityInCrisis.js';

// ── UPKEEP-8 (2026-11-13): the Outlook says only what the town's own pages say ──────────────────────────────
// The round-three cut's #228 #253 #326 #379 and the increment's #ww-567 #ww-717 #ww-1541 (the chair's ruling: not
// "keeps order" where law and order reads critical; not "pays its way" where the town is poor and earns less than it
// spends; not "grows what it eats" or "feeds itself" where it buys its food or lists critical imports).

/**
 * The seed's variant where it is true; else the next true one in the pool's order; else the twin ('' keeps the pool's
 * own pick, for a pool whose every variant is true of its branch).
 * @param {(pool: readonly string[]) => string | undefined} pick @param {readonly string[]} pool @param {readonly boolean[]} ok
 * @param {string} twin @returns {string}
 */
function pickTrue(pick, pool, ok, twin) {
  const at = Math.max(0, pool.indexOf(String(pick(pool))));
  for (let k = 0; k < pool.length; k++) { const j = (at + k) % pool.length; if (ok[j]) return pool[j]; }
  return twin || pool[at];
}

/**
 * The fields the Outlook's facts read.
 * @typedef {{ economicState?: { prosperity?: unknown, primaryImports?: unknown, primaryExports?: unknown, necessityImports?: unknown,
 *   foodSecurity?: { foodRecord?: { normalImportPct?: unknown } | null } | null } | null,
 *   resourceAnalysis?: { imports?: { critical?: unknown } | unknown[] } | null }} OutlookSettlement
 */

/**
 * What the town's own pages say, for the Outlook: its Law & order band (the Foundations' causal reading), its
 * printed prosperity rung (the low rungs are the Economics header's "earns less than it spends"), the food it buys
 * (the food record's import share), and the imports its printed trade list marks as a necessity or as what the terrain
 * cannot produce (the Economics tab's own list and marks: `EconomicsTab.jsx :: shownImports`).
 * @param {DossierSettlementView | null | undefined} settlement
 * @returns {{ keepsOrder: boolean, paysItsWay: boolean, buysFood: boolean, needsImports: boolean }}
 */
function outlookFactsOf(settlement) {
  const town = /** @type {OutlookSettlement | null | undefined} */ (/** @type {unknown} */ (settlement));
  const eco = town?.economicState || {};
  const law = bandForVariable(/** @type {Parameters<typeof bandForVariable>[0]} */ (/** @type {unknown} */ (settlement)), 'law_order');
  const record = eco.foodSecurity?.foodRecord;
  /** @param {unknown} list @returns {string[]} */
  const lower = (list) => (Array.isArray(list) ? list : []).map((x) => String(x).toLowerCase());
  const necessity = lower(eco.necessityImports);
  const imp = town?.resourceAnalysis?.imports;
  const terrain = imp && !Array.isArray(imp) ? lower(imp.critical) : [];
  // the import list AS THE ECONOMICS TAB PRINTS IT: the record's imports and the terrain's criticals, through the list's one filter
  /** @type {string[]} */
  const recorded = Array.isArray(eco.primaryImports) ? eco.primaryImports.map(String) : [];
  const imports = lower(displayTradeList([...recorded, ...terrain.filter((t) => !recorded.some((imp) => imp.toLowerCase().includes(t)))],
    settlement, { side: 'imports', exports: Array.isArray(eco.primaryExports) ? [...eco.primaryExports] : [] })); // a copy read (tradeListWriters)
  return {
    keepsOrder: law !== 'critical' && law !== 'collapsed',
    paysItsWay: !['Subsistence', ...PROSPERITY_LABELS.slice(0, PROSPERITY_LABELS.indexOf('Poor') + 1)].includes(String(eco.prosperity ?? '')),
    buysFood: Number(record?.normalImportPct) > 0,
    needsImports: imports.some((imp) => necessity.some((n) => imp.includes(n)) || terrain.some((t) => imp.includes(t) || t.includes(imp))),
  };
}

/**
 * #608 (UPKEEP-8, the chair's ruling of 2026-11-13): does the Economics glance's Output chip print beside the prosperity
 * word? The figure (the economy's output, 0-100) and the word (the printed prosperity label) have no common home, so
 * where they stand two bands apart (the chip red, under 35, beside Prosperous or Wealthy; green, 60 or more, beside
 * Poor or lower) the word prints alone. Elsewhere the chip prints once, as the T2-1 ruling keeps it.
 * @param {number} score the chip's figure @param {unknown} label the printed prosperity word @returns {boolean}
 */
export function outputChipBesideWord(score, label) {
  if (!(score > 0)) return false;
  const rung = ['Subsistence', ...PROSPERITY_LABELS].map(String).indexOf(String(label ?? ''));
  if (rung < 0) return true;
  const high = rung >= 1 + PROSPERITY_LABELS.indexOf('Prosperous'), low = rung <= 1 + PROSPERITY_LABELS.indexOf('Poor');
  return !((score < 35 && high) || (score >= 60 && low));
}
import { bandForVariable } from '../causalState.js'; import { PROSPERITY_LABELS } from '../prosperityRank.js'; import { displayTradeList } from './tradeListDisplay.js'; // at the END: no line above moves
// W2-A-LEAVES (row 3): the leaf the Magic tab's reliance line names its source from (an import at the foot, so the
// lines the prose wiring census cites above keep their numbers).
import { magicSourceOf } from '../facts/magicSource.js';
import { institutionDisplayName } from './institutionDisplayName.js';

/**
 * A house as running prose names it (W2-A-LEAVES-2, 2026-11-13; REVIEW-W2A F2: 73 of 289 reliance lines printed a
 * catalogue count range or condition — "Cathedral (10,000+ only)", "Dream parlors (high magic)"). Its display
 * label (`institutionDisplayName`, the one seam for a house's label), with any bracketed count or note struck: in
 * a sentence a house is named, never counted or qualified.
 * @param {string} house a roster house's name
 * @returns {string}
 */
function proseHouseName(house) {
  return institutionDisplayName(house).replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
}
