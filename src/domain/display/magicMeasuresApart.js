/**
 * domain/display/magicMeasuresApart.js — WHAT EACH MAGIC WORD COUNTS, WHERE THE TWO DISAGREE (PAGE-1 MAGIC, F3c; the
 * chair's 300 at ff51769f7, B's f3.out.txt §c: "Reliance on magic: Relied upon" beside "Magical Capability: Weak" or
 * "Critical", 26 of 300 towns two steps or more apart).
 *
 * TWO HONEST MEASURES, NOT ONE MISREAD (measured first, the build's own MEASURE.out.txt):
 *   • Reliance on magic (`magicReliance.js :: deriveMagicReliance`, as the page prints it, `deriveMagicRelianceView`)
 *     counts what DEPENDS on magic: an active chain the generator itself gates on magic (`chainNeedsMagic`, so the
 *     clergy's "Divine & Magical Healing" counts), a chain magic holds up, and food made by magic.
 *   • Magical Capability (the Overview's Systems Health bar, `defenseProfile.scores.magical`) is the defence's magic
 *     part alone: the magic presence (`priorityHelpers.js :: computeEffectiveMagicPresence`: the magic dial, the magic
 *     houses, the land), nothing at all in a thorp, hamlet or village where no arcane house stands.
 * So a village whose parish church heals by magic relies on magic while its arcane strength is nil, and a town under
 * a middling dial holds some magic that nothing there depends on. Both words stay; the Overview says, in one line under
 * the reliance word, what each counts where they sit on opposite sides (relied upon or integral beside Weak or
 * Critical; none or present beside Adequate or Strong: exactly the pairs two steps or more apart on B's scale).
 *
 * AND THE MAGIC TAB'S HEADLINE (`magicProvisionShown.js :: magicHeadlineWord`) IS THE DIAL'S BAND, the same in all of
 * the chair's 300 ("Medium"): the magic around the town, which the town's own houses and people do not move. The word
 * stays one word (T2-26); a caption above it says whose measure it is (`magicHeadlineScope`).
 *
 * Pure: reads the record, writes nothing, draws nothing. Every clause is read from the record.
 */
import { scoreBand } from './defenseScoreBands.js';
import { deriveMagicRelianceView, magicRowsGated } from './dossierViewModel.js';
import { foodAmongMagicDependents, magicDependentChainsShown } from './magicProvisionShown.js';
import { chainPrintName } from './chainPrintName.js';
import { magicFoodChannelWord } from './foodBalanceBar.js';
import { foodRowShown } from './foodRowShown.js';
import { magicOf } from '../facts/magic.js';

/** The readings that say something here depends on magic. */
const RELIES = Object.freeze(['relied-upon', 'integral']);

/** The two Overview rows the line stands between, by the keys the shared magic gate reads (`magicRowsGated`). */
const RELIANCE_ROW = 'magicReliance';
const CAPABILITY_ROW = 'magical';

/** The record's level bands, whose word the Magic tab's headline prints (`magicProvisionShown.js :: magicHeadlineWord`). */
const LEVEL_BANDS = Object.freeze(['low', 'medium', 'high']);

/** @typedef {Parameters<typeof deriveMagicRelianceView>[0]} RelianceTown */
/** @typedef {Parameters<typeof chainPrintName>[0]} PrintedChain */
/** @typedef {Parameters<typeof chainPrintName>[1]} PrintTown */
/** @typedef {Parameters<typeof foodRowShown>[0]} FoodTown */

/** The Overview bar's words (`defenseScoreBands.js :: scoreBand`) in the line's plain words. */
const STRENGTH_WORD = Object.freeze({ CRITICAL: 'very weak', WEAK: 'weak', ADEQUATE: 'fair', STRONG: 'strong' });

/**
 * WHAT THE TOWN LEANS ON MAGIC FOR, as the Magic tab's reliance line names it: each dependent chain under the name it
 * prints (`chainPrintName`), then the food as the food row names its provision. Empty where nothing relies on magic.
 * @param {unknown} settlement
 * @returns {string[]}
 */
export function magicRelyNames(settlement) {
  const reliance = deriveMagicRelianceView(/** @type {RelianceTown} */ (settlement));
  if (!reliance.reliesOnMagic) return [];
  return [...new Set([
    ...magicDependentChainsShown(settlement).map((c) => chainPrintName(/** @type {PrintedChain} */ (c), /** @type {PrintTown} */ (settlement)).label)
      .filter((l) => typeof l === 'string' && l !== ''),
    ...(foodAmongMagicDependents(settlement)
      ? [`food (${magicFoodChannelWord(foodRowShown(/** @type {FoodTown} */ (settlement), false)?.fb.magicFoodNote)} provision)`]
      : []),
  ])].map(String);
}

/**
 * The names joined as a list is spoken: "a", "a and b", "a, b and c".
 * @param {readonly string[]} names
 * @returns {string}
 */
export function spokenList(names) {
  return names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/** The settlement's kind as the lines name it ("village", "city"), or "place" where the record holds none. @param {unknown} settlement */
function placeOf(settlement) {
  const tier = /** @type {{ tier?: unknown }} */ (settlement).tier;
  return typeof tier === 'string' && tier ? tier : 'place';
}

/**
 * THE MAGIC TAB'S HEADLINE CAPTION, "Magic in the world at large, not the village's own:", where the headline word is
 * the dial's band (the record holds a level: low, medium or high), else null (a dead-magic world's sentence, or the envelope's availability word).
 * @param {unknown} settlement
 * @returns {string | null}
 */
export function magicHeadlineScope(settlement) {
  if (!settlement || typeof settlement !== 'object') return null;
  if (/** @type {{ config?: { magicExists?: unknown } }} */ (settlement).config?.magicExists === false) return null;
  const level = magicOf(/** @type {Parameters<typeof magicOf>[0]} */ (settlement)).level;
  if (!LEVEL_BANDS.includes(level)) return null;
  return `Magic in the world at large, not the ${placeOf(settlement)}'s own:`;
}

/**
 * THE ONE LINE: where the Overview prints both "Reliance on magic" and "Magical Capability" and they sit on opposite
 * sides, what each counts, read from the record; else null.
 *   - relied upon or integral beside Weak or Critical:
 *       "The village leans on magic for Divine & Magical Healing, but its arcane strength is very weak."
 *   - none or present beside Adequate or Strong:
 *       "Nothing in the town depends on magic, though its arcane strength is fair."
 * @param {unknown} settlement
 * @returns {string | null}
 */
export function magicMeasuresApartLine(settlement) {
  if (!settlement || typeof settlement !== 'object') return null;
  // Both rows must print: the shared magic gate keeps the reliance tag and the capability bar, or neither line is here.
  const shown = new Set(magicRowsGated(settlement, [{ key: RELIANCE_ROW }, { key: CAPABILITY_ROW }]).map((row) => row.key));
  if (!shown.has(RELIANCE_ROW) || !shown.has(CAPABILITY_ROW)) return null;
  const rec = /** @type {{ defenseProfile?: { scores?: { magical?: unknown } | null } | null }} */ (settlement);
  const score = Number(rec.defenseProfile?.scores?.magical);
  if (!Number.isFinite(score)) return null;
  const band = /** @type {keyof typeof STRENGTH_WORD} */ (scoreBand(Math.min(100, Math.max(0, score))));
  const strength = STRENGTH_WORD[band];
  const reliance = deriveMagicRelianceView(/** @type {RelianceTown} */ (settlement));
  const place = placeOf(settlement);
  const strong = band === 'ADEQUATE' || band === 'STRONG';
  if (RELIES.includes(reliance.reading) && !strong) {
    const names = magicRelyNames(settlement);
    if (names.length === 0) return null;
    return `The ${place} leans on magic for ${spokenList(names)}, but its arcane strength is ${strength}.`;
  }
  if (!RELIES.includes(reliance.reading) && strong) {
    return `Nothing in the ${place} depends on magic, though its arcane strength is ${strength}.`;
  }
  return null;
}
