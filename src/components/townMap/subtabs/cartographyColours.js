/**
 * townMap/subtabs/cartographyColours.js — THE ROLE → COLOUR BINDING (TC-5b-ii).
 *
 * TC-5a's paint leaf emits ROLES and TONES and no colour at all. This is the one
 * place a role becomes a value, and every value comes from design/tokens.js. Sited
 * in the component layer and importing the token module DIRECTLY (CR-TC5B-2): this
 * is the only home where the forked-token lint enforces the rule STRUCTURALLY
 * rather than by review, and the legacy token shim's own header points new code
 * straight here rather than through it.
 *
 * ⚠ THE WHOLE SOURCE TEXT of this file is scanned for colour notation, prose
 * included. The law is named here and no example of it is spelled anywhere.
 *
 * ── THE PAIR, NOT THE SHADE ──────────────────────────────────────────────────
 * A role owns TWO token values: its INK end and its WASH end. `tonePermille`
 * interpolates between them, and the DIRECTION is forced by landed code rather
 * than chosen here: cartographyPaintRoles.js's condition ladder is monotone
 * non-increasing and states that "a worse rung may never paint brighter than a
 * better one", so a HIGHER tone is BRIGHTER. Tone 0 is the ink end; tone 1000 is
 * the wash end.
 *
 * Naming both ends as TOKENS is what removes the magic number. A single base
 * token plus a tuned wash fraction would put a band in this file that no one
 * could re-derive; a pair of named tokens means a palette change is a token swap
 * and the interpolation owns no tuning at all.
 *
 * ── WHY THE MAP IS BUILT, NOT AUTHORED ───────────────────────────────────────
 * Copied from cartographyPaintRoles.js:66-81. The key set is BUILT by iterating
 * the frozen role vocabulary, so a missing member or a foreign key throws at
 * module load rather than shipping a half-populated binding. Two of the ten roles
 * (`green`, `water`) are unreachable from any ward kind today and are bound
 * anyway — the vocabulary is the contract, not the observed ops.
 *
 * ── FENCED FAMILIES, DELIBERATELY ABSENT ─────────────────────────────────────
 * Three token families may not be borrowed by a map. The slate family is reserved
 * by owner ruling C13 as the single marker for AI-authored surfaces; the two
 * role-ring hues belong to the Founders' Hall and must never read as purchasable
 * prestige; the destructive family is fenced to errors and unread-count chrome.
 * None appears below — which is why `sacred` takes the deeper gold rather than a
 * red, and `industry` takes the deep ink rather than the slate.
 *
 * ⭐ A FOURTH FENCE, FOUND BY MEASUREMENT. The semantic STATUS TINT SURFACES —
 * the pale wash aliases that back a success or information callout — are off
 * limits too: they name a callout's wash, not a material, and the deep-craft
 * kill-list ratchets their spellings across src/components precisely to stop them
 * spreading. An earlier cut of this table used two of them as terrain washes and
 * moved that ratchet by exactly two lines: a true positive about borrowed
 * semantics, not a false alarm. Terrain now takes a real hue at the ink end and
 * BARE PAGE at the wash end, which is both the manuscript idiom and the honest
 * one. ⚠ The ratchet reads PROSE as well as code, so this paragraph names the
 * rule and spells none of the aliases it governs.
 *
 * Pure and headless: no store, no clock, no randomness, no I/O, no module-scope
 * mutable state, and no float in any emitted value.
 *
 * @enforced-by tests/ui/mapCartographySubTab.test.jsx
 */
import { CARTOGRAPHY_PAINT_ROLES } from '../../../domain/townCartography/cartographyPaintRoles.js';
import { color, semantic } from '../../../design/tokens.js';

/** The permille scale the tone, the interpolation and the rounding all speak. */
const TONE_FLOOR_PERMILLE = 0;
const TONE_CEILING_PERMILLE = 1000;
/** Round-half-up bias, so the rounding rule is stated rather than delegated. */
const TONE_ROUNDING_BIAS = 500;

const CHANNEL_RADIX = 16;
const CHANNEL_DIGITS = 2;
/** Not a colour: the one-character prefix an emitted value carries. */
const VALUE_PREFIX = '#';

/**
 * A street is ONE ink. Its class shows in the pen WIDTH — `widthPlan` weighted by
 * `weightPermille`, both already on the op — and never in its tone, so the street
 * role always resolves at its ink end.
 *
 * ⚠ MEASURED, and the reason this constant exists: a street op carries NO
 * `tonePermille` at all (cartographyPaint.js:207-215 and its typedef at :55).
 * Deriving one from `weightPermille` would invert the emphasis, because an
 * arterial weighs 1000 and a higher tone is BRIGHTER — the arterial would paint
 * palest. Named here so the rule has exactly one home and no call site guesses.
 */
export const STREET_TONE_PERMILLE = TONE_FLOOR_PERMILLE;

/**
 * BUILD a map whose key set IS the frozen vocabulary. Both directions are checked,
 * so neither a forgotten member nor a stale key survives module load.
 * @template T
 * @param {ReadonlyArray<string>} vocabulary @param {Record<string, T>} authored
 * @param {string} label @returns {Readonly<Record<string, T>>}
 */
function exhaustiveOver(vocabulary, authored, label) {
  /** @type {Record<string, T>} */
  const built = {};
  for (const member of vocabulary) {
    if (!Object.prototype.hasOwnProperty.call(authored, member)) {
      throw new Error(`${label} has no entry for the frozen vocabulary member '${member}'`);
    }
    built[member] = authored[member];
  }
  for (const key of Object.keys(authored)) {
    if (!vocabulary.includes(key)) {
      throw new Error(`${label} carries '${key}', which the frozen vocabulary does not contain`);
    }
  }
  return Object.freeze(built);
}

/**
 * ROLE → [INK END, WASH END]. Every entry is a pair of token reads; this module
 * declares no value of its own.
 * @type {Readonly<Record<string, string[]>>}
 */
export const ROLE_TONE_ENDS = exhaustiveOver(CARTOGRAPHY_PAINT_ROLES, {
  // The gilded quarters — civic, merchant and noble wards all resolve here.
  civic: [color['gold-700'], color['gold-100']],
  // The workshops' warm ochre, one step off the civic gold.
  craft: [color['amber-700'], color['amber-100']],
  // Foreign and unclassified ground: plain chrome ink on the card surface.
  default: [color['muted-500'], color['parchment-100']],
  // Terrain green, washing to bare page. Unreachable from a ward kind today;
  // bound anyway, because the vocabulary is the contract.
  green: [color['green-700'], color['parchment-100']],
  // Residential and criminal quarters — the town's common earth, and its bulk.
  ground: [color['ink-600'], color['parchment-200']],
  // Soot. The deepest non-structural ink, washing to the chrome tone.
  industry: [color['ink-800'], color['muted-500']],
  // Religious and arcane precincts read as a deeper, more solemn gold than civic.
  sacred: [color['gold-800'], color['parchment-100']],
  // The streets are inked before the roofs, and inked hardest.
  street: [color['ink-900'], color['ink-600']],
  // Military ground and curtain wall: hard stone against bare page.
  wall: [color['ink-900'], color['parchment-200']],
  // Terrain water: the one blue the palette owns, washing to bare page. Also
  // unreachable today, and bound for the same reason as green.
  water: [semantic.info, color['parchment-100']],
}, 'ROLE_TONE_ENDS');

/**
 * A token value's three channels, or a loud failure. A token that stopped being a
 * six-digit value would otherwise emit a plausible-looking wrong colour.
 * @param {unknown} token @param {string} at @returns {number[]}
 */
function channelsOf(token, at) {
  if (typeof token !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(token)) {
    throw new Error(`cartographyColours: the ${at} token is not a six-digit value`);
  }
  return [1, 3, 5].map((start) => Number.parseInt(token.slice(start, start + CHANNEL_DIGITS), CHANNEL_RADIX));
}

/**
 * Interpolate one channel, round half up. Every intermediate is an exact small
 * integer, so NO FLOAT reaches the emitted string.
 * @param {number} ink @param {number} wash @param {number} tone @returns {number}
 */
function mixChannel(ink, wash, tone) {
  const weighted = ink * (TONE_CEILING_PERMILLE - tone) + wash * tone;
  return Math.floor((weighted + TONE_ROUNDING_BIAS) / TONE_CEILING_PERMILLE);
}

/** @param {number} channel @returns {string} */
function channelDigits(channel) {
  return channel.toString(CHANNEL_RADIX).padStart(CHANNEL_DIGITS, '0');
}

/**
 * THE BINDING. A paint role and a permille tone become one token-derived value.
 *
 * An unknown role THROWS rather than falling back: a silent default would paint an
 * unmapped vocabulary member plausibly and invisibly, which is the fail-open shape
 * cartographyPaintRoles.js:24-28 removed from the role half.
 *
 * @param {unknown} role a member of CARTOGRAPHY_PAINT_ROLES
 * @param {unknown} tonePermille an integer 0..1000; 0 is the ink end, 1000 the wash
 * @returns {string} a six-digit value derived wholly from design tokens
 */
export function resolveRoleFill(role, tonePermille) {
  const bound = typeof role === 'string'
    && Object.prototype.hasOwnProperty.call(ROLE_TONE_ENDS, role);
  if (!bound) {
    throw new Error(`cartographyColours: paint role '${String(role)}' has no colour binding;`
      + ' a silent default would paint an unmapped vocabulary member plausibly and invisibly');
  }
  if (!Number.isInteger(tonePermille)
    || /** @type {number} */ (tonePermille) < TONE_FLOOR_PERMILLE
    || /** @type {number} */ (tonePermille) > TONE_CEILING_PERMILLE) {
    throw new Error(`cartographyColours: tone '${String(tonePermille)}' is not a permille`
      + ' scalar in 0..1000');
  }
  const [inkToken, washToken] = ROLE_TONE_ENDS[/** @type {string} */ (role)];
  const ink = channelsOf(inkToken, `${role} ink end`);
  const wash = channelsOf(washToken, `${role} wash end`);
  return VALUE_PREFIX + ink
    .map((channel, index) => channelDigits(
      mixChannel(channel, wash[index], /** @type {number} */ (tonePermille)),
    ))
    .join('');
}
