/**
 * domain/display/stateProse/economyStateProse.js — LANE P: THE ECONOMY DESK.
 *
 * The reference desk. Four corpus blocks, four rendered surfaces, and the shape every
 * other desk copies:
 *
 *   DS-ECO-1  Economics › Prosperity header — the rung read AGAINST the approach
 *   DS-ECO-8  LADDER › the prosperity rung read on its own
 *   DS-ECO-2  Economics › the food and season tiles
 *   DS-ECO-9  LADDER › the food-security rung, and the two blockade states
 *   DS-ECO-12 Economics › the commercial profile — how the town earns, and what it trades
 *   DS-ECO-6  Economics › the shadow economy, by capture tier
 *   DS-ECO-3  Economics › the LIVE trade-flow drift, read against trade dependency
 *   DS-ECO-10 Economics › the export posture (DESK-ECON2)
 *   DS-ECO-11 Resources › the ground, the strengths, the worth and the workings (DESK-ECON2)
 *   DS-SUP-3  Services › the tier-expected catalog and its absences (DESK-ECON2)
 *
 * ── WHAT THIS DESK DELIBERATELY DOES NOT SERVE, AND THE MEASUREMENT ──────────────────
 * DS-ECO-5, DS-SUP-1 and DS-SUP-2 are the SUPPLY-CHAIN family, and all three are DARK for
 * one measured reason rather than three: `{chain}`, `{resource}` and `{good}` are declared
 * `bare-common` in §0c, and the only producer for them on those blocks is
 * `economicState.activeChains[]`, whose `label`, `resource` and `outputs` are TITLE-CASED
 * DISPLAY strings. Measured over 24 generated settlements: `{chain}` conformant 0 of 318,
 * `{resource}` 0 of 123, `{good}` 0 of 314. Thirty-eight of this leaf's variants name
 * `{chain}` and every one of them is unreachable while that holds. The same fact darkens
 * `{good}` on the blocks this desk DOES serve: `leadingGoodNoun` fills 0 of 48 generated
 * settlements, because all 99 distinct export labels the generator writes are capitalised.
 * THE ONE ACT THAT LIGHTS THEM is the §0c-3 act applied to those slots — either an authored
 * bare-common form per canonical token, or an annex ruling that the slot's shape is wrong —
 * and both are reader-facing word decisions, so neither is a wiring lane's.
 * DS-ECO-4 and DS-ECO-7 are dark for their own reasons; see the receipt and the mount
 * registry's dark half.
 *
 * ── DS-ECO-12: THREE LENSES AT ONE POSITION (the DS-POW-1 shape, not an exception) ────
 * DS-ECO-12 is one block over one record — `economicState`'s commercial identity — read
 * through three lenses: the INCOME CONCENTRATION, the CRIMINAL LINE, and the OUTWARD /
 * INWARD trade read. One position draws all three, because the C3 law is one SENTENCE
 * RUNG per block per page-set and a second mount would be the same block speaking twice.
 * `power.criminalUnderside` already draws three lenses at one position for exactly this
 * reason; this is that shape, not a new one.
 *
 * ⚠ THE CRIMINAL LENS IS `dm-only` IN THE CORPUS, ALL FIVE VARIANTS. It therefore draws
 * NOTHING on a player's page, by law 2 of the kernel, and that is the intended reading
 * rather than a dead lens: a player's dossier must be byte-identical over a town with an
 * underworld and a town without one. It reaches a reader through the DM's own audience,
 * which the caller supplies — so a desk called with no audience can never draw it.
 *
 * ── WHAT A DESK IS RESPONSIBLE FOR ───────────────────────────────────────────────────
 *
 * A desk maps LIVE STATE to a POOL KEY, and nothing else. It does not select prose (the
 * kernel draws), it does not compose sections (the panel does), and it never derives a
 * number a canonical reader already owns — `deriveFoodBalance` and `deriveGranaryOutlook`
 * stay the view model's, and their readings arrive here as arguments. A second
 * derivation of the same fact is a fork that drifts, and this file would be the place it
 * started.
 *
 * ── R-DST-A, HELD ────────────────────────────────────────────────────────────────────
 * A SURFACE block frames a section; a LADDER block reads a band value. A composed page
 * draws at most one of each and never both about the same fact. So the prosperity HEADER
 * takes DS-ECO-1 (rung × approach) and the economy TILE takes DS-ECO-8 (the rung alone) —
 * the census's own pairing, and the reason the two blocks are non-redundant.
 *
 * ── R-DST-B, THE FILE'S CENTRAL LAW, HELD BY THE CORPUS AND NOT BY THIS FILE ──────────
 * A prosperity rung is a DERIVED READING with no provenance trail, so no variant in
 * these pools carries a historical clause and this desk supplies no cause. Where a cause
 * exists it belongs to a JOIN family and comes through causalDossierProse.js, which
 * renders only joins with records behind them.
 *
 * ── §0d, THE DIGIT BAN ───────────────────────────────────────────────────────────────
 * The tile keeps its `Deficit 12% of need`; the prose bands the same fact. Nothing this
 * desk puts in a slot is ever a figure, and the kernel rejects a numeric fill outright.
 *
 * @enforced-by tests/domain/economyStateProseDesk.test.js
 */
import { prosperityRank } from '../../../data/constants.js';
import { compareCodepoint } from '../../deterministicSort.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../../data/dossierStateProse/economy.generated.js';
import { composeStateProse } from './composeStateProse.js';
import { economyStateProseCandidates } from './economyStateProseCandidates.js';
import { legibilityRung } from './legibilityRung.js';
import { COMPLEXITY_LABEL } from '../labelBands.js';

/**
 * The desk's corpus, typed at the import boundary. The generated leaves stay PURE DATA
 * with no import of any kind — including a JSDoc type import, which would couple
 * src/data to a domain module path — so the shape assertion lives here, once, where the
 * reader that depends on it can be read beside it.
 * @type {import('./stateProseKernel.js').StateProseCorpus}
 */
const CORPUS = /** @type {import('./stateProseKernel.js').StateProseCorpus} */ (
  /** @type {unknown} */ (DOSSIER_STATE_PROSE_ECONOMY)
);

/**
 * The narrow slice of a settlement this desk reads. Declared rather than cast: the
 * any-cast ratchet is right that a desk which types its input `any` has given up the
 * one check that would catch a renamed field, and every field below is a real read.
 * @typedef {object} FoodSecurityView
 * @property {string} [label]
 * @property {{blockaded?: unknown, blockadeBypass?: unknown}|null} [stockpile]
 */
/**
 * @typedef {object} IncomeSourceView
 * @property {unknown} [percentage]
 * @property {unknown} [isCriminal]
 */
/**
 * @typedef {object} EconomicStateView
 * @property {string|{tier?: string}} [prosperity]
 * @property {string} [tradeAccess]
 * @property {string} [economicComplexity]
 * @property {FoodSecurityView|null} [foodSecurity]
 * @property {ReadonlyArray<IncomeSourceView>} [incomeSources]
 * @property {ReadonlyArray<unknown>} [primaryExports]
 * @property {ReadonlyArray<unknown>} [primaryImports]
 * @property {ReadonlyArray<unknown>} [localProduction]
 * @property {unknown} [isEntrepot]
 * @property {{blackMarketCapture?: unknown}|null} [safetyProfile]
 */
/**
 * One row of `resourceAnalysis.exploitation.*`, as the resource generator writes it.
 * @typedef {object} ExploitationRow
 * @property {string} [rawResource]
 * @property {string} [exportValue]
 * @property {ReadonlyArray<string>} [processingInstitutions]
 * @property {ReadonlyArray<string>} [finalProducts]
 */
/** @typedef {'unexploited'|'partiallyExploited'|'fullyExploited'} ExploitationBucket */
/**
 * @typedef {object} ResourceAnalysisView
 * @property {string} [terrain]
 * @property {string} [error]
 * @property {string} [strategicValue]
 * @property {ReadonlyArray<string>} [economicStrengths]
 * @property {{unexploited?: ReadonlyArray<ExploitationRow>,
 *   partiallyExploited?: ReadonlyArray<ExploitationRow>,
 *   fullyExploited?: ReadonlyArray<ExploitationRow>}|null} [exploitation]
 */
/**
 * @typedef {object} EconomyDeskSettlement
 * @property {string} [name]
 * @property {EconomicStateView|null} [economicState]
 * @property {{metrics?: {tradeAccess?: string}|null}|null} [economicViability]
 * @property {ResourceAnalysisView|null} [resourceAnalysis]
 * @property {{terrainType?: string}|null} [config]
 * @property {string} [tier]
 */
/**
 * The two canonical derived readings, as the view model returns them.
 * @typedef {object} FoodBalanceView
 * @property {unknown} [available]
 * @property {unknown} [deficit]
 * @property {unknown} [surplus]
 * @property {string} [display]
 * @property {string} [detail]
 */
/**
 * @typedef {object} GranaryOutlookView
 * @property {unknown} [available]
 * @property {string|null} [band]
 * @property {string|null} [season]
 */

/**
 * `tradeAccess` → the `{access}` fill: a BARE noun, the shape §0c declares for this slot.
 *
 * `isolated` HAS NO FILL, deliberately and per the annex: a town nothing reaches has no
 * approach to name, so every variant needing `{access}` becomes ineligible on it and the
 * pool degrades to the variants that never needed one. This is the anchored-liveness law
 * doing its work on a real enum rather than on a missing record.
 * @type {Readonly<Record<string, string>>}
 */
export const ACCESS_NOUN = Object.freeze({
  road: 'road',
  river: 'river',
  port: 'port',
  crossroads: 'crossroads',
  mountain_pass: 'pass',
});

/**
 * `economicComplexity` → the `{complexity}` fill: a BARE common-noun phrase (§0c-3, CLOSED
 * 2026-09-05). THE WORDS ARE THE CHAIR'S, authored against the eleven producer values and
 * transcribed here byte-for-byte; the owner's veto is open by name.
 *
 * WHY A TABLE AND NOT A TRANSFORM. `deriveEconomicComplexity` emits eleven TITLE-CASED
 * display strings, five of them em-dashed glosses, and §0c-3 refused both mechanical routes
 * on evidence: lower-casing yields *"a agricultural surplus with trade links"*, and
 * splitting at the em dash yields adjectives (*highly diversified*, *concentrated*) that no
 * seam can take. So the vocabulary is AUTHORED, and this is its one home.
 *
 * KEYED ON THE PRODUCER'S OWN STRING, TAKEN FROM `labelBands.js`'s `COMPLEXITY_LABEL`
 * RATHER THAN TRANSCRIBED A SECOND TIME. That leaf already had to name all eleven for
 * `COMPLEXITY_BAND_BY_LABEL`, and two independent transcriptions of eleven authored strings
 * are the duplicated-constant hazard in its exact shape: a re-wording of one producer label
 * desynchronises them silently, each side still passing its own totality arm. It stays a
 * DOMAIN leaf read and not a generator read, for this file's own reason recorded below.
 * The key rule itself is unchanged, and is this file's own label-trap rule applied to
 * the one case where the producer HAS no token: `economicState.economicComplexity` is the
 * display string and there is no coarser enum behind it, so the string IS the canonical
 * value. The desk test imports `deriveEconomicComplexity`, exhausts its input space, and
 * asserts this map TOTAL IN BOTH DIRECTIONS — every producer value has a fill and every
 * fill has a producer — so a branch added to the producer reds here rather than going
 * silently prose-less. The desk does NOT import the generator: a display leaf that reached
 * into src/generators would drag the economy generator into every tab chunk that draws.
 *
 * EVERY PHRASE BEGINS WITH A CONSONANT (the seams say both *"a {complexity}"* and
 * *"the {complexity}"*), has a singular head noun (*"the {complexity} keeps"*), and names no
 * place, people or creed. The map is INJECTIVE, so a reader can tell the eleven rungs apart.
 * @type {Readonly<Record<string, string>>}
 */
export const COMPLEXITY_NOUN = Object.freeze({
  [COMPLEXITY_LABEL.HIGHLY_DIVERSIFIED]: 'spread of trades',
  [COMPLEXITY_LABEL.DIVERSIFIED]: 'broad base of trades',
  [COMPLEXITY_LABEL.CONCENTRATED]: 'handful of trades',
  [COMPLEXITY_LABEL.MARKET_ECONOMY]: 'market trade',
  [COMPLEXITY_LABEL.SPECIALIZED]: 'specialist trade',
  [COMPLEXITY_LABEL.LIMITED]: 'narrow trade',
  [COMPLEXITY_LABEL.MIXED]: 'mix of field and market',
  [COMPLEXITY_LABEL.AGRICULTURAL]: 'surplus farm trade',
  [COMPLEXITY_LABEL.MINOR_SURPLUS]: 'small farm surplus',
  [COMPLEXITY_LABEL.SURPLUS]: 'farm surplus',
  [COMPLEXITY_LABEL.SUBSISTENCE]: 'subsistence living',
});

/**
 * THE SHAPES THIS DESK BELIEVES ITS SLOTS HAVE, mirroring §0c's Shape column.
 *
 * The ANNEX is the authority and this is a checked mirror, not a second home: the
 * projection contract test asserts this map equals the register parsed out of the annexes,
 * slot for slot, so a desk that drifts from the corpus reds rather than rendering. A
 * runtime module cannot read markdown, and the alternative — no declaration at all — is
 * exactly the hole `{access}` fell through.
 * @type {Readonly<Record<string, string>>}
 */
export const SLOT_FILL_SHAPES = Object.freeze({
  settlement: 'proper',
  access: 'bare-common',
  complexity: 'bare-common',
  season: 'bare-common',
  good: 'bare-common',
  resource: 'bare-common',
  institution: 'proper',
});

/**
 * Every LITERAL fill table this desk owns, by the slot it fills. The guard walks this
 * directory, treats every exported string map as a candidate fill table, and refuses one
 * that is not declared here — so the next desk cannot land a table the shape check has
 * never seen, which is how a one-table check becomes a one-of-six check.
 * @type {Readonly<Record<string, Readonly<Record<string, string>>>>}
 */
export const SLOT_FILL_TABLES = Object.freeze({
  access: ACCESS_NOUN,
  complexity: COMPLEXITY_NOUN,
});

/**
 * A `bare-common` fill, or `undefined` — the desk's own half of the shape contract.
 *
 * The refusal is scoped to the BARE-COMMON class on purpose. That is the class whose
 * violation produces broken English at every seam that carries it ("the Highly diversified
 * — multiple major revenue streams keeps more hands busy"), and refusing is the correct
 * behaviour under R-DST-K: the kernel's anchored liveness drops the variants that name the
 * slot and the pool degrades to the ones that never needed it. A `proper` fill is NOT
 * refused — a name is a name, an odd one still reads, and blanking a whole page over a
 * generator quirk would trade a small wrong for a large silence.
 *
 * The rules mirror `fillShapeViolation` in scripts/lib/dossier-slot-shapes.mjs, and the
 * contract test proves the two agree over a probe corpus rather than trusting that they do.
 * @param {string|undefined} value
 * @returns {string|undefined}
 */
function bareCommonFill(value) {
  if (!value) return undefined;
  if (/^(?:the|a|an|its|his|her|their|our|this|that|these|those)\b/i.test(value)) return undefined;
  if (/[—–]/.test(value)) return undefined;
  if (/[.!?]\s|[.!?]$/.test(value)) return undefined;
  if (/[0-9]/.test(value)) return undefined;
  if (/[a-z]+_[a-z]+/.test(value)) return undefined;
  return /^[a-z]/.test(value) ? value : undefined;
}

/**
 * A `bare-common` fill that must also take a SINGULAR verb and a singular pronoun.
 *
 * ⛔ FOUND IN THE RENDERED SENTENCE, NOT IN REASONING, AND IT IS THE REASON THIS EXISTS.
 * Every `{resource}` seam in DS-ECO-11 was authored around a mass noun — *"The {resource}
 * SITS at the edge…"*, *"…can point at the {resource}, and nobody in this town is working
 * IT"*, *"A stranger who knows what {resource} FETCHES elsewhere"* — and
 * `exploitation[].rawResource` writes plurals beside its mass nouns. The first render over
 * real settlements printed *"The animal hides sits at the edge of being worth a great deal"*
 * and *"point at the medicinal herbs, and nobody in this town is working it"*: fluent,
 * grammatical-looking, and wrong about number in front of a reader.
 *
 * THE SCREEN IS A TRAILING `s`, AND ITS REACH IS STATED RATHER THAN ASSUMED. Measured over
 * 48 generated settlements, `rawResource` takes 13 shape-conformant values: `medicinal
 * herbs`, `gemstones` and `animal hides` end in `s` and are the three plurals; the other ten
 * (`timber`, `glass sand`, `fish`, `iron ore`, `grain`, `clay`, `wool`, `livestock`,
 * `stone`, `gold/silver ore`) do not. So over the shipped vocabulary the screen is exact.
 * It is a HEURISTIC beyond that vocabulary and would also refuse a mass noun ending in `s`
 * (`grass`, `moss`) — which is the SAFE direction: a refusal is silence under anchored
 * liveness, and the alternative is a false sentence. A producer that adds one of those reds
 * nothing and costs one variant; a producer that adds a plural is caught.
 *
 * THE OTHER HALF OF THE FINDING IS THE CORPUS'S AND IS RAISED, NOT PATCHED: four of
 * DS-ECO-11's `{resource}` variants could be authored number-neutral, at which point this
 * screen could go. That is a reader-facing word decision and not a wiring lane's.
 * @param {string|undefined} value
 * @returns {string|undefined}
 */
function singularBareCommonFill(value) {
  const fill = bareCommonFill(value);
  if (!fill) return undefined;
  return /s$/i.test(fill) ? undefined : fill;
}

/**
 * A `proper` fill, or `undefined`. The sibling of `bareCommonFill` for the one slot class
 * this desk now supplies a NAME to (`{institution}` — a house on the settlement's roster).
 *
 * THE FILE'S OWN OLD NOTE SAID A PROPER FILL IS NOT REFUSED, and this narrows it rather
 * than reversing it. A name being odd is still a name and still reads; what is refused here
 * is a value that is not a name at all — §0d's digit ban and VOICE_AND_TONE's dash ban apply
 * at the FILL for EVERY shape, which is what `fillShapeViolation` says and what the register
 * §0c states above its own table. MEASURED at this tip over 24 generated settlements: of the
 * 25 distinct `processingInstitutions` values the resource generator writes, exactly ONE is
 * refused — `Bakers (5-15)`, which carries the roster's own count range — so the refusal
 * costs one variant on one row rather than a class.
 * @param {string|undefined} value
 * @returns {string|undefined}
 */
function properFill(value) {
  if (!value) return undefined;
  if (/[—–]/.test(value)) return undefined;
  if (/[.!?]\s|[.!?]$/.test(value)) return undefined;
  if (/[0-9]/.test(value)) return undefined;
  if (/[a-z]+_[a-z]+/.test(value)) return undefined;
  return /^[A-Z]/.test(value) ? value : undefined;
}

/** The two approaches DS-ECO-1 calls narrow. */
const NARROW_ACCESS = Object.freeze(['isolated', 'mountain_pass']);

/**
 * DS-ECO-1's five combinations, by rung band and approach width.
 *
 * JUDGMENT (vetoable): the annex names the bands — "a high rung", "the middle rungs", "a
 * low rung" — and leaves the cut to the implementer. The cut here is
 * low = Subsistence/Struggling/Poor · middle = Moderate/Comfortable · high =
 * Prosperous/Wealthy, chosen because the annex says "the middle rungs" in the plural and
 * because C3's variants ("manages", "a thin margin", "nothing striking in either
 * direction") read as Moderate and Comfortable rather than as Moderate alone. Say
 * "veto" to move it.
 */
const HIGH_RUNG_FROM = 5;
const LOW_RUNG_TO = 2;

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * The DS-ECO-1 pool key for a rung and an approach, or null when the rung is unknown —
 * an unrecognised prosperity spelling must render NOTHING rather than fall into a band.
 * @param {number} rank
 * @param {string} access
 * @returns {string|null}
 */
export function prosperityHeaderPoolKey(rank, access) {
  if (rank < 0) return null;
  const narrow = NARROW_ACCESS.includes(access);
  if (rank >= HIGH_RUNG_FROM) {
    return narrow
      ? 'COMBINATION C2: a high rung on a narrow approach (isolated / mountain_pass)'
      : 'COMBINATION C1: a high rung on a working approach';
  }
  if (rank <= LOW_RUNG_TO) {
    return narrow
      ? 'COMBINATION C5: a low rung on a narrow approach'
      : 'COMBINATION C4: a low rung on a working approach';
  }
  return 'COMBINATION C3: the middle rungs';
}

/**
 * DS-ECO-9's pool key. The blockade states OVERRIDE the ladder: a blockaded town's food
 * story is the blockade, and the rung underneath it is the wrong sentence to tell.
 * @param {unknown} foodSecurityLabel
 * @param {{blockaded?: unknown, blockadeBypass?: unknown}|null|undefined} stockpile
 * @returns {string|null}
 */
export function foodSecurityPoolKey(foodSecurityLabel, stockpile) {
  if (stockpile?.blockadeBypass) return 'BLOCKADE BYPASSED';
  if (stockpile?.blockaded) return 'BLOCKADED';
  const label = text(foodSecurityLabel);
  if (!label) return null;
  const key = label.toUpperCase();
  return CORPUS['DS-ECO-9'].pools[key] ? key : null;
}

/**
 * DS-ECO-2's food-tile key from the canonical food balance. `available: false` means the
 * tile itself does not render, and R-DST-K says the absence of a surface is the absence
 * of a sentence.
 * @param {{available?: unknown, deficit?: unknown, surplus?: unknown}|null|undefined} foodBalance
 * @returns {string|null}
 */
export function foodTilePoolKey(foodBalance) {
  if (!foodBalance?.available) return null;
  if (Number(foodBalance.deficit) > 0) return 'FOOD: deficit';
  if (Number(foodBalance.surplus) > 0) return 'FOOD: surplus';
  return 'FOOD: balanced';
}

/**
 * DS-ECO-2's granary key. Seasons off ⇒ no tile ⇒ no sentence (R-DST-K).
 * @param {{available?: unknown, band?: unknown}|null|undefined} granaryOutlook
 * @returns {string|null}
 */
export function granaryPoolKey(granaryOutlook) {
  if (!granaryOutlook?.available) return null;
  const band = text(granaryOutlook.band);
  return band ? `GRANARY: ${band}` : null;
}

/**
 * DS-ECO-12's income-concentration bands.
 *
 * JUDGMENT (vetoable). The annex names the three states in words — "one source carries
 * the town", "two or three sources between them", "a broad spread, no leader" — and
 * leaves the cut to the implementer. The cut here reads the LEADER'S SHARE, because that
 * is what every variant in the three pools is actually about: C1's ledger line says "well
 * past half", C2's says "no one of them could carry the town alone", C3's says "nothing
 * earns a real portion of the whole". Say "veto" to move either number.
 */
const SOLE_EARNER_FROM = 50;
const LEADER_FROM = 20;

/** @param {unknown} value @returns {number} */
function share(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * DS-ECO-12 lens A — how concentrated the town's earnings are. Null on a settlement with
 * no income roster at all: an unrecorded income mix is silence, not "a broad spread",
 * which would be a fail-soft default wearing a reading's clothes.
 * @param {ReadonlyArray<{percentage?: unknown, isCriminal?: unknown}>|null|undefined} incomeSources
 * @returns {string|null}
 */
export function incomeMixPoolKey(incomeSources) {
  if (!Array.isArray(incomeSources) || incomeSources.length === 0) return null;
  const leader = incomeSources.reduce((best, row) => Math.max(best, share(row?.percentage)), 0);
  if (leader >= SOLE_EARNER_FROM) return 'INCOME MIX: one source carries the town';
  if (leader >= LEADER_FROM) return 'INCOME MIX: two or three sources between them';
  return 'INCOME MIX: a broad spread, no leader';
}

/**
 * DS-ECO-12 lens B — the criminal line, when the roster carries one.
 *
 * Keyed on the record's own `isCriminal` FLAG, never on the source LABEL. The generator
 * spells that line five different ways ("Criminal Syndicate Revenue", "Thieves' Guild
 * Revenue", "Smuggling Network Revenue", "Shadow Economy (untaxed)", "Black Market
 * Revenue"), so a label route would drop four of five and do it without an error
 * anywhere — the label trap, one layer up from the value.
 *
 * "LEADS" means the criminal line is the largest single earner, which is what the pool's
 * own variants say ("The largest single earner at {settlement} is the one that is not
 * written down"). A tie is NOT a lead: the strict comparison is deliberate, because a
 * criminal line level with a lawful one is the "present" reading, not the "leads" one.
 * @param {ReadonlyArray<{percentage?: unknown, isCriminal?: unknown}>|null|undefined} incomeSources
 * @returns {string|null}
 */
export function criminalIncomePoolKey(incomeSources) {
  if (!Array.isArray(incomeSources)) return null;
  const criminal = incomeSources.filter((row) => row?.isCriminal);
  if (criminal.length === 0) return null;
  const dirtiest = criminal.reduce((best, row) => Math.max(best, share(row?.percentage)), 0);
  const cleanest = incomeSources
    .filter((row) => !row?.isCriminal)
    .reduce((best, row) => Math.max(best, share(row?.percentage)), 0);
  return dirtiest > cleanest
    ? 'INCOME MIX: the criminal line leads'
    : 'INCOME MIX: a criminal line is present';
}

/**
 * DS-ECO-12 lens C — the OUTWARD / INWARD read, as a total partition of the
 * (exports, imports) cross with the entrepôt override on top.
 *
 *   entrepôt with transit goods marked   → the transit pool
 *   nothing out, something in            → imports only, nothing outward
 *   nothing out, nothing in              → no significant exports
 *   something out, something in          → both present
 *   something out, nothing in            → local production listed, IF there is local
 *                                          production to point at
 *
 * THE ONE HOLE, DECLARED RATHER THAN FILLED. A town that exports, imports nothing and
 * lists no local production has NO pool in this block, and this returns null. The corpus
 * authored five states and that is the sixth; routing it into "local production listed"
 * would print "a good portion of what the town consumes is made inside its own walls"
 * over a settlement with no recorded local production, which is a sentence with no
 * evidence under it. Silence is R-DST-K and is the true statement here.
 *
 * The transit marker is the generator's own ` (transit)` suffix
 * (`economicState.js` builds it), not a re-derivation of entrepôt status from the route.
 * @param {{primaryExports?: unknown, primaryImports?: unknown, localProduction?: unknown,
 *   isEntrepot?: unknown}|null|undefined} eco
 * @returns {string|null}
 */
export function tradeProfilePoolKey(eco) {
  // NO RECORD IS NOT AN EMPTY RECORD, and the difference is the whole of law 2. A
  // settlement whose economicState carries none of the three trade rosters has not been
  // measured as trading nothing — it has not been measured. Reading that as "no
  // significant exports" would print a confident sentence about a town off the back of an
  // absent field, which is the fail-soft default this subsystem exists to refuse. An
  // EMPTY array is a real reading and keeps its pool.
  if (!Array.isArray(eco?.primaryExports) && !Array.isArray(eco?.primaryImports)
    && !Array.isArray(eco?.localProduction)) return null;
  const exports_ = Array.isArray(eco?.primaryExports) ? eco.primaryExports : [];
  const imports_ = Array.isArray(eco?.primaryImports) ? eco.primaryImports : [];
  const local = Array.isArray(eco?.localProduction) ? eco.localProduction : [];
  const transit = exports_.some((good) => typeof good === 'string' && good.includes('(transit)'));
  if (eco?.isEntrepot && transit) {
    return 'TRADE PROFILE: isEntrepot, transit goods marked among the exports';
  }
  if (exports_.length === 0) {
    return imports_.length > 0
      ? 'TRADE PROFILE: imports only, nothing outward'
      : 'TRADE PROFILE: no significant exports';
  }
  if (imports_.length > 0) return 'TRADE PROFILE: exports and imports both present';
  return local.length > 0 ? 'TRADE PROFILE: local production listed' : null;
}

/**
 * DS-ECO-6's capture tiers. THE NUMBERS ARE THE ANNEX'S OWN, spelled in the pool keys
 * themselves (`≥30`, `≥15`, `≥3`), so there is no implementer's cut to veto here — only a
 * transcription, and the desk test walks 0..100 against the corpus to prove it is faithful.
 *
 * BELOW THREE IS NOT A TIER, IT IS NO SURFACE. `EconomicsTab` renders no Shadow Economy
 * section under 3 % capture, and R-DST-K says the absence of a surface is the absence of a
 * sentence — so this returns null there rather than reaching for the minor pool.
 *
 * A MISSING `blackMarketCapture` IS ALSO NULL, and that is the sharper of the two. A
 * settlement with no safety profile has not been measured as having no shadow economy; it
 * has not been measured. `Number(undefined)` is NaN and every comparison against it is
 * false, so a bare ladder would have fallen through to null by luck rather than by
 * decision — this says it out loud so a later `|| 0` cannot quietly turn "unmeasured" into
 * "clean".
 * @param {{blackMarketCapture?: unknown}|null|undefined} safetyProfile
 * @returns {string|null}
 */
export function shadowEconomyPoolKey(safetyProfile) {
  const capture = Number(safetyProfile?.blackMarketCapture);
  if (!Number.isFinite(capture)) return null;
  if (capture >= 30) return 'TIER: a large share off the books (≥30)';
  if (capture >= 15) return 'TIER: significant off-book activity (≥15)';
  if (capture >= 3) return 'TIER: minor shadow activity (≥3)';
  return null;
}

/**
 * DS-ECO-3's pool key, from the canonical live-flow reading.
 *
 * A DRIFT IS A MEASUREMENT OR IT IS NOTHING. `flowDerivedDependency` returns null on
 * every world with no measured throughput — dormant, isolated, decayed away, or below the
 * kernel's own epsilon — and this returns null with it. There is deliberately no "assume
 * adequate" arm: a town whose roads were never measured has not been measured as busy,
 * and "Caravans keep to their rounds" over an unmeasured world is a default wearing a
 * reading's clothes. `LiveTradeFlowSection` does not render there either, so R-DST-K makes
 * the same answer twice.
 *
 * KEYED ON THE PRODUCER'S OWN BAND TOKEN, never on its `label` ("Trade choked", "Trade
 * steady", "Trade brisk"), which is the display word and not the datum — the label trap.
 * An unrecognised band is null rather than a fall into `ADEQUATE`, on the same reasoning
 * `prosperityHeaderPoolKey` refuses an unknown rung.
 *
 * ⛔ ONE OF THE FIVE POOLS IS UNREACHABLE IN EVERY WORLD THE ENGINE CAN BUILD, and this
 * is a FINDING declared here rather than a hole papered over. `throughputBand`'s
 * non-dependent branch is `throughput > ABUNDANT_CEIL ? SURPLUS : ADEQUATE` — it has no
 * shortage arm at all — so `SHORTAGE × not trade-dependent` can never be keyed. MEASURED
 * by exhaustion over the producer: of 361 (inflow, outflow) points, 63 reach a shortage
 * band WITH dependency and 0 reach one without.
 *
 * THE CORPUS IS NOT WRONG, AND NEITHER IS THE PRODUCER — they disagree about one word.
 * The corpus wrote for empty roads on a town that does not need them ("in a town that
 * lives off its own fields, quiet roads are a matter of company rather than supply"); the
 * producer folds that state into `ADEQUATE` alongside ordinary traffic. THE ONE ACT THAT
 * LIGHTS IT is a shortage arm on the non-dependent branch of `throughputBand`, which
 * moves a shipped band distribution and is a tuning call, not a desk's. It is pinned in
 * the desk test as an EXPOSURE of the producer's shape, so the day that arm lands the pin
 * reds and someone reads this paragraph instead of rediscovering it.
 *
 * ONLY THE TWO EXTREME BANDS SPLIT BY DEPENDENCY. That is the corpus's shape, not a
 * simplification: a town's dependency changes what quiet roads MEAN and does not change
 * what ordinary ones mean, so `ADEQUATE` is one pool and the other two are two each.
 * @param {{band?: unknown, tradeDependent?: unknown}|null|undefined} drift
 * @returns {string|null}
 */
export function tradeFlowPoolKey(drift) {
  const band = text(drift?.band);
  if (band === 'adequate') return 'ADEQUATE';
  if (band !== 'shortage' && band !== 'surplus') return null;
  return drift?.tradeDependent
    ? `${band.toUpperCase()} \u00d7 trade-dependent`
    : `${band.toUpperCase()} \u00d7 not trade-dependent`;
}

/**
 * DS-ECO-10 lens A — the EXPORT POSTURE, keyed on `deriveExportPosture`'s own status token.
 *
 * KEYED ON THE TOKEN, never on the label. `deriveExportPosture` returns both, and its labels
 * are display sentences ("Exports exist but trade routes are vulnerable"); the corpus pools
 * are named for the tokens. The desk test walks the producer's whole input space and asserts
 * the map total, so a status added there reds rather than going silently prose-less.
 *
 * ⛔ ONE OF THE SIX POOLS HAS NO PRODUCER AT ALL, and this is a FINDING rather than a hole.
 * `POSTURE: import_dependent` is authored, and `deriveExportPosture`'s ladder never assigns
 * that status: `import_dependent` exists in that module ONLY as a key of its
 * `EXPORT_STATUS_LABEL` table, and the if-chain that sets `status` has five arms
 * (none / entrepot / vulnerable / limited / established) and no sixth. So the label is
 * reachable by a caller that constructs the status by hand and unreachable by the derivation.
 * THE ONE ACT THAT LIGHTS IT is an import-dependence arm on that ladder, which changes a
 * shipped read-model's output on every import-heavy settlement and is therefore a product
 * call, not a desk's. It is pinned in the desk test as an EXPOSURE of the producer's shape.
 * @param {{status?: unknown}|null|undefined} posture
 * @returns {string|null}
 */
export function exportPosturePoolKey(posture) {
  const status = text(posture?.status);
  if (!status) return null;
  const key = `POSTURE: ${status}`;
  return CORPUS['DS-ECO-10'].pools[key] ? key : null;
}

/**
 * The seven terrains the generator can build, by the token, to the corpus's own pool word.
 * PRIVATE: an exported string map in this directory is a candidate FILL TABLE to the
 * projection guard, and this is a pool ROUTE — nothing in it ever reaches a `{slot}`.
 * @type {Readonly<Record<string, string>>}
 */
const TERRAIN_POOL_BY_KEY = Object.freeze({
  coastal: 'TERRAIN: Coastal',
  riverside: 'TERRAIN: River',
  mountain: 'TERRAIN: Mountains',
  forest: 'TERRAIN: Forest',
  plains: 'TERRAIN: Plains',
  hills: 'TERRAIN: Hills',
  desert: 'TERRAIN: Desert',
});

/**
 * DS-ECO-11 lens A — the TERRAIN accent, keyed on the producer's canonical terrain TOKEN.
 *
 * ⭐ THE LABEL TRAP, MEASURED, AND IT IS LIVE IN THE TREE ALREADY. `resourceAnalysis.terrain`
 * is `TERRAIN_DATA[key].name` — a DISPLAY name — and the seven names it can hold are
 * `Coastal · Riverside · Mountain · Forest · Plains · Hills · Desert/Arid`, while the corpus
 * authored its pools as `Coastal · Plains · Forest · Hills · Mountains · River · Desert ·
 * Swamp · Tundra`. Three of the seven names do not equal their pool (`Riverside`/`River`,
 * `Mountain`/`Mountains`, `Desert/Arid`/`Desert`), so a route on the display name would
 * darken three terrains of seven WITHOUT AN ERROR ANYWHERE. `ResourcesTab.jsx`'s own
 * `terrainColor` map already keys on the corpus words and already loses those three to its
 * default accent; that shipped defect is this trap in the same file this block draws in.
 *
 * TWO POOLS HAVE NO PRODUCER: `TERRAIN: Swamp` and `TERRAIN: Tundra` are authored and
 * `TERRAIN_DATA` has seven keys, none of them swamp or tundra. A config naming one produces
 * `resourceAnalysis.error: 'Invalid terrain type'` and no terrain at all, so the surface
 * shows `Unknown` and this desk stays silent rather than reaching for the default accent —
 * which is why `TERRAIN: anything else (the default accent)` is unreachable too.
 * @param {unknown} terrainKey `config.terrainType`, the canonical token
 * @returns {string|null}
 */
export function terrainPoolKey(terrainKey) {
  const key = TERRAIN_POOL_BY_KEY[text(terrainKey)];
  return key && CORPUS['DS-ECO-11'].pools[key] ? key : null;
}

/**
 * DS-ECO-11 lens B — whether the town has a recorded speciality.
 *
 * NO ROSTER IS NOT AN EMPTY ROSTER. A settlement whose `resourceAnalysis` failed carries no
 * `economicStrengths` array at all, and "nothing about this town stands out as a strength"
 * over an unmeasured record is a fail-soft default wearing a reading's clothes. An EMPTY
 * array is a real reading and keeps its pool.
 * @param {unknown} strengths
 * @returns {string|null}
 */
export function economicStrengthsPoolKey(strengths) {
  if (!Array.isArray(strengths)) return null;
  return strengths.length > 0
    ? 'ECONOMIC STRENGTHS: the roster is populated'
    : 'ECONOMIC STRENGTHS: none recorded';
}

/**
 * DS-ECO-11 lens C — the strategic-value framing. The pool FRAMES the generator's own
 * assessment and never restates it, so the only question is whether an assessment exists.
 * @param {unknown} strategicValue
 * @returns {string|null}
 */
export function strategicValuePoolKey(strategicValue) {
  return text(strategicValue) ? "STRATEGIC VALUE: the generator's assessment, framed" : null;
}

/**
 * DS-ECO-11 lens D — the exploitation ladder, over ONE selected line.
 *
 * JUDGMENT (vetoable), and it is a SELECTION rather than a filter. `resourceAnalysis
 * .exploitation` holds three buckets and a real town can carry rows in all three; the block
 * has one position, so one row speaks. The order is UNEXPLOITED first (ResourcesTab's own
 * comment calls that bucket "most interesting for DMs" and renders it first), then
 * partially, then fully — the reader's own top-to-bottom order on the page. Within a bucket
 * the row is the FIRST after the tab's own `rawResource` sort, so the sentence is about the
 * line the reader's eye reaches first rather than about an arbitrary one.
 *
 * THE HIGH/LOW SPLIT IS THE CORPUS'S. `exportValue` is a generator word (`very high`,
 * `high`, `medium`, `low`); the two unexploited pools are "high" and "medium or low", so
 * anything beginning `high`/`very high` takes the first and everything else takes the second.
 * @param {ExploitationRow|null|undefined} row
 * @param {'unexploited'|'partiallyExploited'|'fullyExploited'} bucket
 * @returns {string|null}
 */
export function exploitationPoolKey(row, bucket) {
  if (!row) return null;
  if (bucket === 'partiallyExploited') return 'EXPLOITATION: partiallyExploited';
  if (bucket === 'fullyExploited') return 'EXPLOITATION: fullyExploited';
  if (bucket !== 'unexploited') return null;
  return /^(?:very )?high\b/i.test(text(row.exportValue))
    ? 'EXPLOITATION: unexploited, exportValue: high'
    : 'EXPLOITATION: unexploited, exportValue: medium or low';
}

/**
 * The one exploitation line that speaks, with the bucket it came from. Returns null on a
 * settlement whose three buckets are all empty — which is most of them (MEASURED: 19 of 48
 * generated settlements carry an unexploited row, 15 a partial one, 11 a full one), and the
 * tab renders no Resource Exploitation section there either (R-DST-K).
 * @param {ResourceAnalysisView|null|undefined} analysis
 * @returns {{row: ExploitationRow, bucket: ExploitationBucket}|null}
 */
export function leadingExploitation(analysis) {
  /** @type {ReadonlyArray<[ExploitationBucket, ReadonlyArray<ExploitationRow>|undefined]>} */
  const buckets = [
    ['unexploited', analysis?.exploitation?.unexploited],
    ['partiallyExploited', analysis?.exploitation?.partiallyExploited],
    ['fullyExploited', analysis?.exploitation?.fullyExploited],
  ];
  for (const [bucket, rows] of buckets) {
    if (!Array.isArray(rows) || rows.length === 0) continue;
    // The tab sorts by rawResource before rendering; the row that speaks is the row the
    // reader meets first, so the ORDER is taken from the surface rather than invented here.
    // ⚠ THE COMPARATOR IS NOT the surface's. `ResourcesTab.jsx` sorts with `localeCompare`,
    // which collates through the host's ICU tables and is banned in src/domain by the
    // determinism guard — THE PROMISE is that the same seed reads the same on every device.
    // So this sorts by CODEPOINT. Over the thirteen lowercase-ASCII `rawResource` values the
    // generator writes the two orders are identical; they could part on a non-ASCII resource
    // name, and if they ever do it is the TAB that is wrong, not this.
    const sorted = [...rows].sort((a, b) => compareCodepoint(text(a?.rawResource), text(b?.rawResource)));
    return { row: sorted[0], bucket };
  }
  return null;
}

/**
 * DS-SUP-3 lens A — the tier-expected catalog and its absences.
 *
 * THE ABSENCES ARRIVE AS A READING. `deriveNotableAbsences(tier, availableServices)` in
 * domain/display/servicesDisplay.js is the canonical answer and ServicesTab already renders
 * it; a second derivation here would be the fork that drifts, and this desk derives nothing
 * a canonical reader owns.
 *
 * A NAMED GAP OUTRANKS THE COUNT, and the order inside that is a JUDGMENT (vetoable): FOOD
 * first, because the corpus itself says a town with nowhere to buy a meal is "unusual at any
 * size", then HEALING, whose pool says "at a size where one is assumed" and is therefore the
 * tier-conditional one of the two.
 * @param {ReadonlyArray<{key?: string}>|null|undefined} absences
 * @param {unknown} tier
 * @returns {string|null}
 */
export function serviceCatalogPoolKey(absences, tier) {
  if (!Array.isArray(absences)) return null;
  const keys = absences.map((row) => text(row?.key));
  if (keys.includes('food')) return 'THE FOOD GAP';
  if (keys.includes('healing')) return 'THE HEALING GAP';
  if (keys.length === 0) {
    return text(tier) === 'metropolis'
      ? 'A METROPOLIS-TIER CATALOG, COMPLETE'
      : 'COMPLETE FOR ITS TIER';
  }
  return keys.length === 1
    ? 'ONE EXPECTED CATEGORY MISSING'
    : 'SEVERAL EXPECTED CATEGORIES MISSING';
}

/**
 * DS-SUP-3 lens B — a category that is PRESENT and whose supply line is short. The house is
 * named, so the lens is silent without a name: all three variants of that pool are about a
 * particular building being open and unable to do its work, and a nameless version of that
 * sentence would be about nothing.
 * @param {unknown} impairedInstitution the house ServicesTab's own impairment sets name
 * @returns {string|null}
 */
export function impairedServicePoolKey(impairedInstitution) {
  return properFill(text(impairedInstitution))
    ? 'A CATEGORY PRESENT BUT ITS CHAIN IMPAIRED'
    : null;
}

/**
 * One DS-ECO-12 lens as a rung, or NOTHING.
 *
 * A sentence-less rung is NULL here, and that is a departure from the file's other four
 * surfaces rather than an inconsistency. `legibilityRung`'s asymmetry — "a rung with no
 * sentence is still a rung" — is earned by the glance and the detail standing on their
 * own, and the prosperity header has both. These three lenses have NEITHER: the position
 * is a paragraph under a heading the page already prints, so a rung whose corpus went
 * silent has nothing at any depth, and handing the component an object that renders
 * nothing invites it to render an empty paragraph. Silence is R-DST-K, and `null` is how
 * this subsystem spells it.
 *
 * This is also what keeps the criminal lens honest on a player's page: the pool's five
 * variants are all `dm-only`, the kernel returns null for the player audience, and this
 * returns null rather than a hollow rung a caller could mistake for a covert seam.
 * @param {{blockId: string, poolKey: string, angle: string, text: string}|null} line
 * @returns {object|null}
 */
function commercialRung(line) {
  return line ? legibilityRung('', line, []) : null;
}

/**
 * The `{good}` fill: the town's own leading export as a BARE noun.
 *
 * The transit suffix is stripped because a transit good is not the town's own trade, and
 * the seam says "sends {good} out" — so the fill is taken from the first export the
 * generator did NOT mark as passing through. Everything else is the shared bare-common
 * refusal: an export the generator spelled with a capital, a digit, an em dash or a
 * snake_case token is not a noun phrase, so the slot goes unfilled and anchored liveness
 * drops the one variant that names it rather than rendering broken English.
 * @param {unknown} exports_
 * @returns {string|undefined}
 */
export function leadingGoodNoun(exports_) {
  if (!Array.isArray(exports_)) return undefined;
  const own = exports_.find((good) => typeof good === 'string' && good !== ''
    && !good.includes('(transit)'));
  return typeof own === 'string' ? bareCommonFill(own.trim()) : undefined;
}

/**
 * THE DESK. Returns one legibility rung per surface, or null where the surface itself
 * does not render.
 *
 * @param {EconomyDeskSettlement|null|undefined} settlement
 * @param {{foodBalance?: FoodBalanceView|null, granaryOutlook?: GranaryOutlookView|null,
 *   flowDrift?: {band?: unknown, tradeDependent?: unknown}|null,
 *   exportPosture?: {status?: unknown}|null,
 *   notableAbsences?: ReadonlyArray<{key?: string}>|null,
 *   impairedInstitution?: string|null}} [readings] the canonical
 *   derived readings, as their own owners return them — this desk derives none of them.
 *   `exportPosture` is `deriveExportPosture`'s, `notableAbsences` is
 *   `deriveNotableAbsences`'s, and `impairedInstitution` is one name out of the impairment
 *   sets `computeChainSets` builds for ServicesTab.
 * @param {{seed?: string, audience?: string, tierNoun?: string|null}} [options]
 * The last key is `foodSecurityRung`, NOT `foodSecurity`, and the difference is load
 * bearing rather than cosmetic. Every other key here names a SURFACE or a RUNG; that one
 * named an ENGINE RECORD — `economicState.foodSecurity`, a real container with `label`
 * and `stockpile` and no `sentence` anywhere on it. The reader-with-no-writer walker
 * binds a shape by member-access name and follows it through a function's return into
 * its callers, so the old spelling handed every consumer of this desk a value whose NAME
 * promised a record it is not, and the first consumer to read `.sentence` off it was
 * convicted for it. A key that lies about its own shape is a defect at the seam, not at
 * the call site.
 * @returns {Readonly<{prosperityHeader: object|null, prosperityRung: object|null, foodTile: object|null, granaryTile: object|null, foodSecurityRung: object|null, incomeMix: object|null, criminalLine: object|null, tradeProfile: object|null, shadowEconomy: object|null, tradeFlow: object|null, exportPosture: object|null, terrainIdentity: object|null, economicStrengths: object|null, strategicValue: object|null, exploitation: object|null, catalogStanding: object|null, impairedService: object|null}>}
 */
export function economyStateProse(settlement, readings = {}, options = {}) {
  const eco = settlement?.economicState || {};
  const name = text(settlement?.name);
  const prosperity = typeof eco.prosperity === 'string' ? eco.prosperity : text(eco.prosperity?.tier);
  // The CANONICAL ladder reader, never a hand-rolled band match: a second spelling of
  // the rung ladder in this file is exactly the fork that drifts.
  const rank = prosperityRank(eco.prosperity);
  const access = text(eco.tradeAccess)
    || text(settlement?.economicViability?.metrics?.tradeAccess);
  const granary = readings.granaryOutlook;
  const foodBalance = readings.foodBalance;

  // The generator's display string is the right thing for a LABEL ROW and the wrong thing
  // for a SEAM: its eleven values are title-cased and five carry an em-dashed gloss. The
  // row keeps the datum; the seam takes the authored bare-common form from COMPLEXITY_NOUN.
  const complexityDisplay = text(eco.economicComplexity);

  const slots = {
    settlement: name,
    // `isolated` deliberately contributes no fill — see ACCESS_NOUN.
    access: ACCESS_NOUN[access],
    // §0c-3, CLOSED. The producer's own string is the KEY, never the fill: an unrecognised
    // spelling contributes NOTHING rather than falling into a neighbouring phrase, so a
    // producer branch this table has not been told about goes silent under anchored
    // liveness instead of stating something false. `bareCommonFill` still stands behind
    // the table — the shape contract is enforced at the FILL, not at the lookup.
    complexity: bareCommonFill(COMPLEXITY_NOUN[complexityDisplay]),
    season: bareCommonFill(text(granary?.season)),
    good: leadingGoodNoun(eco.primaryExports),
    // `{faction}` IS DELIBERATELY UNFILLED, and this is the finding rather than an
    // omission. DS-ECO-12's one criminal `counterforce` variant names it, and the acting
    // party there is a criminal organisation — but the raw settlement's factions carry
    // `{faction, power, desc}` and NO archetype: `archetype` exists only on the DERIVED
    // FactionProfile that `deriveFactionProfile` builds. A desk never derives what a
    // canonical reader owns, and reading `.archetype` off the raw roster would be a read
    // of a key no writer produces — the reader-with-no-writer defect, which is removed
    // rather than shipped. Filling it from the income LABEL instead ("Thieves' Guild
    // Revenue") would name a revenue LINE where the sentence names a HOUSE: the label
    // trap, one layer up. So the slot stays empty, anchored liveness drops that single
    // variant, and its pool keeps 2 of 3 — MEASURED in the desk test, not assumed.
  };

  /**
   * ⭐ ROUTED THROUGH THE COMPOSER (SEAM car 3c). The spine key is this desk's own key
   * function and the per-lens `extra` override still reaches the kernel unchanged; the
   * candidates leaf offers the modifier pools the state earned, and is EMPTY until car 9
   * authors them. An empty list composes to the kernel's own draw, which is why the
   * manifest cannot move on this routing.
   * @param {string} blockId
   * @param {string|null} poolKey
   * @param {Record<string, string|undefined>|null} [extra] a PER-LENS slot override
   * @returns {import('./composeStateProse.js').ComposedUnit|null}
   */
  const line = (blockId, poolKey, extra = null) => (poolKey
    ? composeStateProse(CORPUS, blockId, {
      ...options,
      slots: extra ? { ...slots, ...extra } : slots,
      spineKey: poolKey,
      candidates: economyStateProseCandidates(blockId, readings),
    })
    : null);

  // The ROW composes its own article from the one noun table rather than a second table
  // carrying its own. Byte-identical to what this row has always rendered: the SEAM form
  // and the LABEL-ROW form are different facts and one table was serving both.
  const accessRow = access
    ? {
      label: 'Approach',
      value: ACCESS_NOUN[access] ? `the ${ACCESS_NOUN[access]}` : 'nothing that reaches it easily',
    }
    : null;

  /** @type {Array<{label: string, value: string}>} */
  const headerDetail = [];
  if (accessRow) headerDetail.push(accessRow);
  if (complexityDisplay) headerDetail.push({ label: 'Economy', value: complexityDisplay });

  const headerKey = prosperityHeaderPoolKey(rank, access);
  const foodKey = foodTilePoolKey(foodBalance);
  const granaryKey = granaryPoolKey(granary);
  const securityKey = foodSecurityPoolKey(eco.foodSecurity?.label, eco.foodSecurity?.stockpile);
  const mixKey = incomeMixPoolKey(eco.incomeSources);
  const crimeKey = criminalIncomePoolKey(eco.incomeSources);
  const tradeKey = tradeProfilePoolKey(eco);
  const shadowKey = shadowEconomyPoolKey(eco.safetyProfile);
  const flowKey = tradeFlowPoolKey(readings.flowDrift);
  const exportKey = exportPosturePoolKey(readings.exportPosture);

  // ── DS-ECO-11, the ground and its workings ─────────────────────────────────────────
  // The TOKEN routes and the DISPLAY NAME gates. `config.terrainType` is the canonical
  // value; `resourceAnalysis.terrain` is the word the Resources tab prints. A settlement
  // whose analysis failed carries the token and NO name, and the tab shows `Unknown` there
  // — so the sentence is withheld rather than asserting a terrain the page does not name.
  const analysis = settlement?.resourceAnalysis || null;
  const terrainNamed = !analysis?.error && !!text(analysis?.terrain);
  const terrainKey = terrainNamed ? terrainPoolKey(settlement?.config?.terrainType) : null;
  const strengthsKey = terrainNamed ? economicStrengthsPoolKey(analysis?.economicStrengths) : null;
  const strategicKey = strategicValuePoolKey(analysis?.strategicValue);
  const leading = leadingExploitation(analysis);
  const exploitKey = leading ? exploitationPoolKey(leading.row, leading.bucket) : null;
  // ⚠ THE EXPLOITATION LENS CARRIES ITS OWN SLOT BAG, and that is the whole of finding
  // R-DST-ROLE. `{good}` in the shared bag means THE TOWN'S LEADING EXPORT (DS-ECO-12's
  // seams say "sends {good} out"); here it means the finished article at the far end of one
  // resource line. One bag serving both would put a chain's output into a sentence about
  // the export column — a proper-name slot filled from the wrong ROLE, which reads fluent
  // and is false. So the row's fills override the bag for this lens and for no other.
  const exploitSlots = leading
    ? {
      resource: singularBareCommonFill(text(leading.row?.rawResource)),
      good: bareCommonFill(text(leading.row?.finalProducts?.[0])),
      institution: properFill(text(leading.row?.processingInstitutions?.[0])),
    }
    : null;

  // ── DS-SUP-3, the catalog and its absences ──────────────────────────────────────────
  const catalogKey = serviceCatalogPoolKey(readings.notableAbsences, settlement?.tier);
  const impairedKey = impairedServicePoolKey(readings.impairedInstitution);
  const impairedSlots = impairedKey
    ? { institution: properFill(text(readings.impairedInstitution)) }
    : null;

  return Object.freeze({
    prosperityHeader: headerKey
      ? legibilityRung(prosperity, line('DS-ECO-1', headerKey), headerDetail)
      : null,
    prosperityRung: rank >= 0
      ? legibilityRung(prosperity, line('DS-ECO-8', prosperity.toUpperCase()), [])
      : null,
    foodTile: foodKey
      ? legibilityRung(text(foodBalance?.display), line('DS-ECO-2', foodKey),
        [{ label: 'Produced against need', value: text(foodBalance?.detail) }])
      : null,
    granaryTile: granaryKey
      ? legibilityRung(text(granary?.band), line('DS-ECO-2', granaryKey),
        [{ label: 'Season', value: text(slots.season) }])
      : null,
    foodSecurityRung: securityKey
      ? legibilityRung(text(eco.foodSecurity?.label) || securityKey,
        line('DS-ECO-9', securityKey), [])
      : null,
    // THE COMMERCIAL PROFILE — three lenses over one record, drawn at ONE position. The
    // GLANCE is empty on all three on purpose: the position is a paragraph under a
    // section heading the page already prints, not a band tile, and `rungSpeaks` is
    // satisfied by the sentence. The detail rows stay with the bars and the chips the
    // section already renders; a rung that repeated them would be the page saying one
    // fact twice at one position.
    incomeMix: commercialRung(line('DS-ECO-12', mixKey)),
    criminalLine: commercialRung(line('DS-ECO-12', crimeKey)),
    tradeProfile: commercialRung(line('DS-ECO-12', tradeKey)),
    // THE SHADOW ECONOMY. Same shape as the three above and for the same reason: the
    // position is a paragraph inside a section that already prints the capture figure and
    // its band, so the rung has no glance and no detail of its own to stand on.
    //
    // ⚠ THE `canonical` ANGLE IS THE LIVE STRING. Two of this block's variants are
    // byte-identical hand copies of EconomicsTab's own `scaleNote`, which is why the tab
    // draws this sentence INSTEAD OF that one rather than under it — a corpus line and its
    // own twin an inch apart is the page saying one thing twice. The tab keeps `scaleNote`
    // as the standing text for every reader this desk does not draw for, so the public
    // dossier is byte-identical.
    shadowEconomy: commercialRung(line('DS-ECO-6', shadowKey)),
    // THE LIVE FLOW. Same `canonical`-angle hazard as the shadow economy above: three of
    // this block's variants are copies of tradeFlowEconomics.js's own BAND_COPY headlines,
    // and they have ALREADY drifted (the corpus spells a period where the live string has
    // an em dash). The section draws this line instead of that one, never under it.
    tradeFlow: commercialRung(line('DS-ECO-3', flowKey)),
    // THE EXPORT POSTURE (DS-ECO-10). A paragraph inside the Trade Profile section, which
    // already prints the export chips and the entrepôt legend, so the rung has no glance
    // and no detail of its own — the `commercialRung` shape, for the same reason.
    exportPosture: commercialRung(line('DS-ECO-10', exportKey)),
    // THE GROUND AND ITS WORKINGS (DS-ECO-11), four lenses over one record at ONE position:
    // what the country is, what the town is good at, what the ground is worth to somebody
    // else, and the one resource line the reader's eye reaches first. The DS-ECO-12 shape.
    terrainIdentity: commercialRung(line('DS-ECO-11', terrainKey)),
    economicStrengths: commercialRung(line('DS-ECO-11', strengthsKey)),
    strategicValue: commercialRung(line('DS-ECO-11', strategicKey)),
    exploitation: commercialRung(line('DS-ECO-11', exploitKey, exploitSlots)),
    // THE CATALOG AND ITS ABSENCES (DS-SUP-3), two lenses at one position: where the town
    // stands against what its rung is expected to keep, and the one house that is open and
    // short of what it works with.
    catalogStanding: commercialRung(line('DS-SUP-3', catalogKey)),
    impairedService: commercialRung(line('DS-SUP-3', impairedKey, impairedSlots)),
  });
}
