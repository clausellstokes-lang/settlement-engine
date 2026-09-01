/**
 * domain/display/faithDeepening.js — THE FAITH TAB'S DEEPENING ROWS (W-FAITH F7c).
 *
 * The pure read-model behind the three row families the T11 faith-tab shell
 * reserved a seat for ("THESE ROWS are where the per-deity personality TOP-3,
 * boon & bane, and the cumulative-field sentences slot in when those trains
 * land" — FaithTab.jsx, T11 car 2):
 *
 *   • THE TOP-3 CHARACTER — a deity's authored chart positions
 *     (`characterAxes` tokens, `AXIS:pole:level`, W-FAITH F1c), read in the
 *     W-LIVES L7 pinned total order re-expressed for authored positions: level
 *     rank descending, then codepoint axis id, then virtue before vice. A
 *     deity's positions carry no drift magnitudes, so the authored LEVEL is the
 *     magnitude, exactly as the flaw kernel already reads it.
 *   • BOON AND BANE — the authored channel picks, displayed as the BAND WORDS
 *     they are authored in (D3: strength is a banded word, never a float). The
 *     jealous marker rides the boon row as a typed cause, DERIVED through
 *     `deityFlaws.FLAW_EFFECTS` + `viceLevelOf` so the flaw register stays the
 *     single decision point (D2: herald colour rides the flaw token).
 *   • THE CUMULATIVE FIELD — the tick-END projection (`faithProfile.field`,
 *     W-FAITH F4c) rendered in band words. Every threshold DERIVES from the
 *     F6c tuning surface: the display floor is the substrate's own audibility
 *     (`faithChannelLift` — a total the causal substrate rounds to nothing is
 *     not spoken of), and the band ladder is `FAITH_FIELD_TUNING.STRENGTH`
 *     read back as words. No value is forked; a re-tune moves this display
 *     with the engine.
 *
 * EVERY FUNCTION TAKES A RECORD, NEVER A SETTLEMENT. The observed-shape wall
 * scans `src/domain` exactly (components are the excluded scope), so the
 * component hands the embed and the projection down and this leaf stays off the
 * ratchet — the F4c decomposition, kept on purpose.
 *
 * Honest absence throughout: no positions, no picks, no projection, or a
 * malformed token all answer EMPTY rather than a fabricated row. Band words
 * only; no numeral ever reaches a display string.
 *
 * PRESENTATION ONLY. Pure, rng-free, no mutation, no store, no React.
 */

import { axisById, wordForAxisPosition, AXIS_LEVELS } from '../npc/paradigmAxisCatalog.js';
import { FAITH_CHANNELS, FAITH_STRENGTHS } from '../worldPulse/faithField.js';
// `faithChannelLift` lives in the zero-import bindings leaf, not in the field: SUBSTRATE
// wave 6 moved the pricing pair there with the CAUSAL_SWING it reads, and `faithField.js`
// deliberately does not re-export it (the no-re-export ruling). Both files are members of
// FAITH_FIELD_SET and this module is already a DECLARED consumer in the dormancy fence's
// FENCE 1 roster, whose own entry says it reads the bindings — `importersOf` counts an
// importing file once, so this second set-member edge is census-neutral by construction.
import { faithChannelLift } from '../worldPulse/faithChannelBindings.js';
import { FAITH_FIELD_TUNING } from '../worldPulse/faithTuningSurface.js';
import { FLAW_EFFECTS, DEITY_FLAWS, viceLevelOf } from '../worldPulse/deityFlaws.js';

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');

/** A closed level word → its display spelling (`a_touch` is authored with an
 *  underscore; a reader is owed the plain words). @param {string} level
 *  @returns {string} */
const levelWords = (level) => level.replace(/_/g, ' ');

/** A channel key → its display spelling (`war_readiness` → `war readiness`).
 *  The channel VOCABULARY is the owner's candidate register; display humanizes
 *  the spelling and mints no second word list. @param {string} channel
 *  @returns {string} */
const channelWords = (channel) => channel.replace(/_/g, ' ');

/**
 * The boon-side flaw word and its axis, derived from the register so the
 * register stays the single decision point: re-homing or striking the
 * `boon_term` row in `FLAW_EFFECTS` moves or silences this marker with it.
 */
const BOON_FLAW_AXIS = Object.keys(FLAW_EFFECTS)
  .find((axisId) => FLAW_EFFECTS[axisId].modulates === 'boon_term') ?? '';
const BOON_FLAW_WORD = DEITY_FLAWS
  .find((row) => row.mechanics === 'modulates' && row.axisId === BOON_FLAW_AXIS)?.word ?? '';

/**
 * A snapshot's authored chart positions, both admitted shapes — the
 * `deityFlaws.positionsOf` reading restated (`characterAxes` is
 * string-or-string-list, F1c act 1's J1).
 * @param {Record<string, unknown> | null | undefined} snapshot
 * @returns {string[]}
 */
function positionsOf(snapshot) {
  const raw = snapshot?.characterAxes;
  if (typeof raw === 'string') return raw ? [raw] : [];
  if (Array.isArray(raw)) return raw.filter((t) => typeof t === 'string' && t);
  return [];
}

/**
 * @typedef {Object} CharacterTopRow
 * @property {string} axisId   the chart axis
 * @property {'virtue'|'vice'} pole
 * @property {string} level    the authored level token (`a_touch` | `marked` | `defining`)
 * @property {string} levelWord the level in display words (`a touch` | `marked` | `defining`)
 * @property {string} word     the catalog word for that pole
 */

/**
 * THE TOP-3 — up to three authored positions in the pinned total order.
 *
 * Set membership on every part: a malformed token, an unknown axis, a pole
 * outside virtue/vice, or a level outside the closed ladder reads as ABSENT
 * rather than being coerced. Exact duplicate tokens collapse to one row.
 *
 * @param {Record<string, unknown> | null | undefined} snapshot
 * @returns {CharacterTopRow[]} at most three rows; [] when nothing is authored
 */
export function characterTop3(snapshot) {
  /** @type {CharacterTopRow[]} */
  const rows = [];
  const seen = new Set();
  for (const token of positionsOf(snapshot)) {
    if (seen.has(token)) continue;
    seen.add(token);
    const parts = token.split(':');
    if (parts.length !== 3) continue;
    const [axisId, pole, level] = parts;
    if (pole !== 'virtue' && pole !== 'vice') continue;
    if (!AXIS_LEVELS.includes(level)) continue;
    if (!axisById(axisId)) continue;
    const word = wordForAxisPosition({ axisId, pole: /** @type {'virtue'|'vice'} */ (pole), level, word: null });
    if (!word) continue;
    rows.push({ axisId, pole: /** @type {'virtue'|'vice'} */ (pole), level, levelWord: levelWords(level), word });
  }
  rows.sort((a, b) => {
    const byLevel = AXIS_LEVELS.indexOf(b.level) - AXIS_LEVELS.indexOf(a.level);
    if (byLevel !== 0) return byLevel;
    if (a.axisId !== b.axisId) return a.axisId < b.axisId ? -1 : 1;
    if (a.pole !== b.pole) return a.pole === 'virtue' ? -1 : 1;
    return 0;
  });
  return rows.slice(0, 3);
}

/**
 * @typedef {Object} BoonBaneRow
 * @property {'boon'|'bane'} kind
 * @property {string} channel      the authored channel key
 * @property {string} channelWord  the channel in display words
 * @property {string} strengthWord the authored band word (`faint` | `firm` | `heavy`). ⚠ NAMED
 *                                 WITH THE `…Word` SUFFIX DELIBERATELY: a binding whose last
 *                                 camel token is a FLOAT_TOKEN reads as a scalar to the prose-
 *                                 numerics detector even when it provably holds a word, and
 *                                 `tests/lint/proseNumerics.test.js` has already ruled that
 *                                 exact shape once (`settlementPolitics.js:358`, a binding
 *                                 named `strength` holding a word): the cure is the RENAME and
 *                                 nothing else. It also matches the two siblings on this very
 *                                 record, `channelWord` and the top-3 rows' `levelWord`.
 * @property {string|null} flaw    the boon-side flaw word when the deity holds the
 *                                 modulating vice position; null otherwise, and
 *                                 always null on the bane (the charter: the BOON
 *                                 weakens)
 */

/**
 * BOON AND BANE, as authored — band words, never floats, and only when BOTH the
 * channel and the strength are members of their closed vocabularies (an authored
 * value outside them contributes no row rather than being coerced into a band).
 *
 * The rows show the AUTHORED pick for every channel, bound or unbound: authored
 * faith is cultural emphasis wherever the magic dial sits (D3), and whether the
 * three unbound words gain variables or leave the register is the pen's open
 * row, not a display caption's.
 *
 * @param {Record<string, unknown> | null | undefined} snapshot
 * @returns {BoonBaneRow[]} zero, one or two rows; boon before bane
 */
export function boonBaneRows(snapshot) {
  /** @type {BoonBaneRow[]} */
  const rows = [];
  if (!snapshot) return rows;
  const jealous = BOON_FLAW_AXIS !== '' && viceLevelOf(snapshot, BOON_FLAW_AXIS) !== null
    ? BOON_FLAW_WORD || null : null;
  const boonChannel = str(snapshot.boonChannel);
  const boonStrength = str(snapshot.boonStrength);
  if (FAITH_CHANNELS.includes(boonChannel) && FAITH_STRENGTHS.includes(boonStrength)) {
    rows.push({
      kind: 'boon', channel: boonChannel, channelWord: channelWords(boonChannel),
      strengthWord: boonStrength, flaw: jealous,
    });
  }
  const baneChannel = str(snapshot.baneChannel);
  const baneStrength = str(snapshot.baneStrength);
  if (FAITH_CHANNELS.includes(baneChannel) && FAITH_STRENGTHS.includes(baneStrength)) {
    rows.push({
      kind: 'bane', channel: baneChannel, channelWord: channelWords(baneChannel),
      strengthWord: baneStrength, flaw: null,
    });
  }
  return rows;
}

/**
 * @typedef {Object} FieldEffectRow
 * @property {string} channel      the projected channel key
 * @property {string} channelWord  the channel in display words
 * @property {'blessed'|'burdened'} direction
 * @property {string} band         a member of FAITH_STRENGTHS, read back as the
 *                                 magnitude band the total falls in
 */

/**
 * THE CUMULATIVE FIELD in band words, off a projection record
 * (`faithProfile.field` — bound channels with non-zero signed totals, F4c).
 *
 * TWO DERIVED GATES, ZERO FORKED VALUES:
 *   • THE FLOOR IS THE SUBSTRATE'S OWN AUDIBILITY — a channel speaks here
 *     exactly when `faithChannelLift` moves its causal variable by a nonzero
 *     step. A total the engine rounds to silence is not spoken of, so the
 *     display can never claim an effect the world does not feel.
 *   • THE BANDS ARE THE STRENGTH LADDER READ BACK — a total at or past the
 *     kernel's reading of `heavy` says `heavy`, past `firm` says `firm`, and
 *     anything audible below that says `faint`. A pen re-tune of
 *     `FAITH_FIELD_TUNING.STRENGTH` moves these words with the engine.
 *
 * @param {{ channels?: Record<string, unknown> } | null | undefined} field
 * @returns {FieldEffectRow[]} codepoint-ordered by channel; [] when silent
 */
export function fieldEffectRows(field) {
  /** @type {FieldEffectRow[]} */
  const rows = [];
  const channels = field && typeof field === 'object' && field.channels && typeof field.channels === 'object'
    ? field.channels : null;
  if (!channels) return rows;
  const mag = /** @type {Record<string, number>} */ (
    /** @type {unknown} */ (FAITH_FIELD_TUNING.STRENGTH));
  for (const channel of Object.keys(channels).sort()) {
    if (!FAITH_CHANNELS.includes(channel)) continue;
    if (faithChannelLift(field, channel) === 0) continue;
    const total = Number(channels[channel]);
    if (!Number.isFinite(total) || total === 0) continue;
    const size = Math.abs(total);
    const band = size >= mag.heavy ? 'heavy' : size >= mag.firm ? 'firm' : 'faint';
    rows.push({
      channel, channelWord: channelWords(channel),
      direction: total > 0 ? 'blessed' : 'burdened', band,
    });
  }
  return rows;
}

/**
 * @typedef {Object} FaithDeepening
 * @property {Record<string, { top3: CharacterTopRow[], gifts: BoonBaneRow[] }>} byName
 *           per-deity depth, keyed by the embed's own name; a deity with nothing
 *           authored simply has no entry
 * @property {FieldEffectRow[]} fieldRows
 */

/**
 * The whole deepening model for one settlement's faith surface, off the records
 * the component already holds: the patron embed, the cult embeds, and the
 * tick-END field projection. The patron wins a name collision (first write).
 *
 * @param {{ patron?: Record<string, unknown> | null,
 *           cults?: ReadonlyArray<Record<string, unknown> | null | undefined> | null,
 *           field?: { channels?: Record<string, unknown> } | null }} records
 * @returns {FaithDeepening}
 */
export function faithDeepeningOf({ patron = null, cults = null, field = null } = {}) {
  /** @type {Record<string, { top3: CharacterTopRow[], gifts: BoonBaneRow[] }>} */
  const byName = {};
  const enroll = (/** @type {Record<string, unknown> | null | undefined} */ snapshot) => {
    const name = str(snapshot?.name);
    if (!name || Object.prototype.hasOwnProperty.call(byName, name)) return;
    const top3 = characterTop3(snapshot);
    const gifts = boonBaneRows(snapshot);
    if (top3.length === 0 && gifts.length === 0) return;
    byName[name] = { top3, gifts };
  };
  enroll(patron);
  for (const cult of Array.isArray(cults) ? cults : []) enroll(cult);
  return { byName, fieldRows: fieldEffectRows(field) };
}
