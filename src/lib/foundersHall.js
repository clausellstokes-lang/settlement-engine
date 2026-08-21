/**
 * lib/foundersHall.js — THE FOUNDERS' HALL: the law of the roll, in one module.
 *
 * The Hall (docs/DESIGN_FOUNDERS_HALL.md) is thirty numbered chairs, I–XXX, ALL
 * BY INVITATION and NONE EVER SOLD. This module holds every rule the Hall's
 * surfaces must obey, as pure functions, so the ceremony in the components can
 * never quietly disagree with the truth:
 *
 *   §2  DISPLAY LAW      — the roll renders HELD CHAIRS ONLY. An unfilled chair
 *                          does not appear at all; a hall of three is a hall of
 *                          three, never a hall of twenty-seven vacancies.
 *                          Order is ALPHABETICAL by display name; numeral-only
 *                          chairs follow the named, in numeral order.
 *   §2  PERMANENCE       — a chair is bound to its founder permanently. Nothing
 *                          here reassigns a holder; the projection is read-only
 *                          and this module exposes no writer at all.
 *   §5b PRESENCE LAW     — when thirty chairs are held the Request control is
 *                          ABSENT, not disabled, and the completed truth renders
 *                          in its place. Presence derives from the SAME ledger
 *                          read as the counter, so a freed chair reopens the
 *                          letterbox with zero code changes.
 *   §6  CONSENT          — a name renders only with its opt-in. A chair without
 *                          one is not a lesser chair: it stands as its numeral,
 *                          set just as formally.
 *   §7  COUNTER TRUTH    — held + open = thirty, exactly, always. Both numbers
 *                          come from one ledger read; neither is ever hardcoded.
 *
 * FAIL-CLOSED. The public projection is a MIGRATION THAT IS NOT DEPLOYED (the
 * chair/invite schema is owner-gated, DESIGN_FOUNDERS_HALL §8). Every read path
 * therefore returns an EMPTY hall on any error — not-configured, missing RPC,
 * transient hiccup — and the Hall renders its dignified pre-launch state: the
 * covenant, an honest counter, and the letterbox. Nothing about a holder is ever
 * surfaced except what the server projection already deemed public.
 *
 * NO PURCHASE VOCABULARY LIVES HERE. There is no price, no seat-for-sale, no
 * "remaining" phrasing — the purchase class was abolished before it ever sold
 * (§1). tests/lib/foundersHall.test.js pins the absence.
 *
 * ZERO EAGER: imported only from inside the lazy Hall route.
 */

import { supabase, isConfigured } from './supabase.js';
import { FOUNDER_SEAT_CAP } from './founderSeats.js';

/**
 * Thirty chairs. Deliberately an ALIAS of the existing seat cap rather than a
 * second constant: the pricing counter, the server's grant lane, and the Hall
 * must all mean the same thirty. One truth, one place to change it.
 */
export const HALL_CHAIR_COUNT = FOUNDER_SEAT_CAP;

// ── Numerals ────────────────────────────────────────────────────────────────

const ROMAN_STEPS = Object.freeze([
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
]);

/**
 * Integer → Roman numeral. Serves both the chair mark (I–XXX) and the seating
 * year in the covenant's own tense ("Seated MMXXVI").
 *
 * @param {number} n  a positive integer below 4000
 * @returns {string|null} the numeral, or null when `n` is not representable
 */
export function romanNumeral(n) {
  if (!Number.isInteger(n) || n <= 0 || n >= 4000) return null;
  let rest = n;
  let out = '';
  for (const [value, glyph] of ROMAN_STEPS) {
    while (rest >= value) {
      out += glyph;
      rest -= value;
    }
  }
  return out;
}

/**
 * The chair mark. A chair number outside 1..thirty is not a chair — it returns
 * null so a malformed projection row can never mint a thirty-first plate.
 *
 * @param {number} chair
 * @returns {string|null}
 */
export function chairNumeral(chair) {
  if (!Number.isInteger(chair) || chair < 1 || chair > HALL_CHAIR_COUNT) return null;
  return romanNumeral(chair);
}

/**
 * The seating line, in the covenant's register: "Seated MMXXVI". Year only —
 * the honor is dated to its year, not minuted like a receipt.
 *
 * @param {string|null|undefined} iso
 * @returns {string|null} null when the date is absent or unparseable
 */
export function seatedLabel(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const year = romanNumeral(d.getUTCFullYear());
  return year ? `Seated ${year}` : null;
}

// ── Role rings (§2: roles and chairs COEXIST) ───────────────────────────────

/**
 * The two staff roles that wear a ring around the plate. A role is what you are
 * to the product; the chair is an honor you hold. They compose — the ring is the
 * composition made visible — and neither is ever rendered as the other.
 *
 * The ring TONES are named design tokens (founderRingDeveloper /
 * founderRingAdmin); this module names only WHICH ring, never a color, so the
 * no-raw-color law holds without the law reaching into a lib.
 */
export const CHAIR_RING_ROLES = Object.freeze(['developer', 'admin']);

/**
 * @param {string|null|undefined} role
 * @returns {'developer'|'admin'|null} null for a founder who is not staff
 */
export function chairRingRole(role) {
  return CHAIR_RING_ROLES.includes(role) ? role : null;
}

// ── The public projection (fail-closed) ─────────────────────────────────────

/**
 * A chair as the Hall consumes it. Every field but `chair` is optional: a chair
 * is held whether or not its founder opted into a name, a bio, or a role.
 *
 * @typedef {Object} HallChair
 * @property {number}  chair        1..thirty — permanent, minted in seating order
 * @property {string=} displayName  the holder's opt-in display name (absent ⇒ numeral-only)
 * @property {string=} bio          the holder's opt-in bio, rides the SAME identity consent
 * @property {string=} seatedAt     ISO date the chair was taken
 * @property {'developer'|'admin'=} ringRole  staff ring, when the founder is also staff
 */

/**
 * Map a raw projection row (snake_case) to a HallChair, dropping anything
 * unexpected. A row whose chair number is not a real chair returns null.
 *
 * The projection lists HELD CHAIRS ONLY — its presence in the result IS the
 * held-ness. Held-ness is deliberately NOT derived from `displayName`: doing so
 * would erase every numeral-only chair from the roll and from the counter, which
 * is exactly the consent-punishing bug §6 forbids.
 *
 * @param {unknown} row
 * @returns {HallChair|null}
 */
export function normalizeChairRow(row) {
  if (!row || typeof row !== 'object') return null;
  const chair = Number(/** @type {any} */ (row).chair_number);
  if (!Number.isInteger(chair) || chair < 1 || chair > HALL_CHAIR_COUNT) return null;
  const r = /** @type {any} */ (row);
  const displayName = cleanStr(r.display_name);
  const bio = cleanStr(r.bio);
  const seatedAt = cleanStr(r.seated_at);
  const ringRole = chairRingRole(cleanStr(r.role));
  return {
    chair,
    ...(displayName ? { displayName } : {}),
    // A bio without a name is still consented text (one identity opt-in covers
    // name, image, and bio alike — §2's "one consent, everywhere"), so it is NOT
    // conditioned on displayName here. The server projection is the consent
    // authority; this function only shapes what it already released.
    ...(bio ? { bio } : {}),
    ...(seatedAt ? { seatedAt } : {}),
    ...(ringRole ? { ringRole } : {}),
  };
}

function cleanStr(v) {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length ? t : null;
}

/**
 * Fetch the held chairs. Never throws; returns [] on any failure so the Hall
 * always renders (fail-closed to the pre-launch state).
 *
 * Duplicate chair numbers in a malformed projection collapse to the FIRST row —
 * a chair has one holder, ever (§2 permanence), and the roll refuses to render
 * the same numeral twice even if the backend hands it over twice.
 *
 * @returns {Promise<HallChair[]>}
 */
export async function fetchFounderChairs() {
  if (!isConfigured) return [];
  try {
    const { data, error } = await supabase.rpc('list_founder_chairs_public');
    if (error) {
      // Pre-deploy the RPC is absent; that is the expected state, not an incident.
      console.debug('[foundersHall] projection unavailable', error?.message ?? error);
      return [];
    }
    if (!Array.isArray(data)) return [];
    return dedupeByChair(data.map(normalizeChairRow).filter(Boolean));
  } catch (e) {
    console.debug('[foundersHall] unexpected error', e);
    return [];
  }
}

function dedupeByChair(chairs) {
  const seen = new Set();
  const out = [];
  for (const c of chairs) {
    if (seen.has(c.chair)) continue;
    seen.add(c.chair);
    out.push(c);
  }
  return out;
}

// ── THE DISPLAY LAW (§2) ────────────────────────────────────────────────────

/**
 * Order the roll for rendering: NAMED chairs first, alphabetically by display
 * name; numeral-only chairs after, in numeral order.
 *
 * ALPHABETICAL, BUT NOT THROUGH localeCompare. Collation via ICU orders
 * non-ASCII names DIFFERENTLY on different devices and locales, and a public roll
 * that reorders itself depending on who is looking is the same broken promise as
 * a world that regenerates differently — the house's determinism law reaches this
 * list too (the ban is pinned in tests/lint/localeCompareGuard.test.js for the
 * seeded trees; the reasoning applies here by choice, not by rule).
 *
 * So names are FOLDED first — case-lowered and diacritic-stripped via NFD — and
 * then compared by codepoint. "Élodie" lands beside "Elodie" instead of after
 * every ASCII name, and every device agrees. Equal folds tie-break on the chair
 * number, so the order is TOTAL and the same ledger always renders identically.
 *
 * Returns a NEW array; the input is never mutated.
 *
 * @param {HallChair[]} chairs  held chairs (unfilled chairs must not be passed)
 * @returns {HallChair[]}
 */
export function buildHallRoll(chairs) {
  const held = dedupeByChair(
    (Array.isArray(chairs) ? chairs : [])
      .filter((c) => c && Number.isInteger(c.chair) && c.chair >= 1 && c.chair <= HALL_CHAIR_COUNT),
  );
  return held.sort(compareChairs);
}

/**
 * Case- and diacritic-insensitive fold used for the roll's alphabetical order.
 * Exported so a pin can prove the fold rather than infer it from a sorted list.
 *
 * @param {string} name
 * @returns {string}
 */
// The Unicode combining-mark block, built from a STRING so the class is written
// in ASCII escapes and can never be silently normalized into literal combining
// bytes by an editor (the recorded authored-odd-byte hazard — a literal range
// here is invisible in a diff and indistinguishable from corruption).
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

export function foldName(name) {
  return String(name)
    .normalize('NFD')
    // Strip the combining marks NFD exposed. Written as codepoint ESCAPES, not
    // as literal combining characters: a literal here would be an invisible,
    // copy-paste-fragile byte range in source (the recorded authored-odd-byte
    // hazard), and no reviewer could tell a correct range from a corrupted one.
    .replace(COMBINING_MARKS, '')
    .toLowerCase();
}

function compareChairs(a, b) {
  const an = a.displayName || null;
  const bn = b.displayName || null;
  if (an && !bn) return -1;
  if (!an && bn) return 1;
  if (an && bn) {
    const fa = foldName(an);
    const fb = foldName(bn);
    if (fa < fb) return -1;
    if (fa > fb) return 1;
  }
  return a.chair - b.chair;
}

/**
 * THE COUNTER (§7): held + open = thirty, exactly, always. Both numbers derive
 * from one ledger read, and `open` is computed rather than counted so the two
 * can never drift apart.
 *
 * @param {HallChair[]} roll
 * @returns {{ held: number, open: number, total: number, full: boolean }}
 */
export function hallCount(roll) {
  const held = Math.max(0, Math.min(HALL_CHAIR_COUNT, Array.isArray(roll) ? roll.length : 0));
  return Object.freeze({
    held,
    open: HALL_CHAIR_COUNT - held,
    total: HALL_CHAIR_COUNT,
    full: held >= HALL_CHAIR_COUNT,
  });
}

/**
 * THE PRESENCE LAW (§5b): the Request control EXISTS only while a chair is open.
 * At thirty held it is absent — not disabled, absent — everywhere it renders,
 * and the completed truth takes its place.
 *
 * Callers pass the same count object the counter renders, so the letterbox and
 * the counter can never disagree.
 *
 * @param {{ full: boolean }} count
 * @returns {boolean}
 */
export function showsRequestControl(count) {
  return !(count && count.full);
}

// ── AUTHORED PUBLIC TEXT: the bands + the civility seam ─────────────────────

/**
 * THE BIO BAND (§2: "an authored length band keeps plates from becoming blogs").
 * A bio is OPTIONAL; when written it must say something (a two-word bio is
 * noise on a ceremonial plate) and must stop well short of an essay.
 *
 * CHAIR RULING, vetoable: 20..600 characters after trimming.
 */
export const HALL_BIO_MIN = 20;
export const HALL_BIO_MAX = 600;

/**
 * THE LETTER BANDS (§5b). Two prompts, each a real answer rather than a form
 * field. CHAIR RULING, vetoable: 40..1500 characters each.
 */
export const HALL_LETTER_MIN = 40;
export const HALL_LETTER_MAX = 1500;

/**
 * THE PROMPTS (§5b), written in the covenant's register and framed around what
 * a founder IS, never what a founder GETS. Authored here so the letter surface
 * and its pins read the same words.
 */
export const HALL_LETTER_PROMPTS = Object.freeze([
  Object.freeze({
    key: 'why',
    label: 'Why do you wish to be a founder?',
    help: 'A founder is a patron whose name the Hall keeps for as long as SettlementForge runs.',
  }),
  Object.freeze({
    key: 'meaning',
    label: 'What would holding a chair mean to you?',
    help: 'Write it as a letter. There is nothing to apply for and nothing to qualify on.',
  }),
]);

/** The pre-typed subject that carries the request tag into the one support queue. */
export const HALL_REQUEST_TAG = 'founders_request';
export const HALL_REQUEST_SUBJECT = "Founders' Hall — a request for a chair";

/**
 * THE CIVILITY SEAM — the ONE place the Hall consults the guard.
 *
 * ⚠️ NOT YET WIRED, DELIBERATELY AND VISIBLY. The civility guard (blocklist +
 * normalizer, one validator with a client mirror and a server mirror) is
 * specified in docs/DESIGN_PROFILE_IMAGE.md §9 and belongs to the profile-identity
 * lane, not this one. Building a second normalizer here would fork the validator
 * the whole point of which is that it cannot fork.
 *
 * So this module takes the guard as an INJECTED function and reports honestly
 * whether one ran. `civilityChecked:false` in a result means the text was
 * length-checked ONLY — no surface may claim a civility guarantee it did not get.
 * When the guard module lands, its client mirror is passed in at the two call
 * sites (the bio editor and the letter) and this constant is the seam that names
 * them; nothing else in the Hall changes.
 *
 * @typedef {(text: string) => { blocked: boolean }} CivilityGuard
 */
export const HALL_CIVILITY_GUARD = null;

/**
 * @typedef {Object} AuthoredTextResult
 * @property {boolean} ok
 * @property {'empty'|'short'|'long'|'blocked'|null} reason
 * @property {boolean} civilityChecked  false ⇒ length-checked only, no guard ran
 * @property {string} value  the trimmed text
 */

/**
 * Validate a piece of authored public text against a band, then (when a guard is
 * supplied) against the civility guard's BLOCK mode.
 *
 * @param {unknown} text
 * @param {{ min: number, max: number, required?: boolean, civility?: CivilityGuard|null }} opts
 * @returns {AuthoredTextResult}
 */
export function validateAuthoredHallText(text, opts) {
  const { min, max, required = false, civility = HALL_CIVILITY_GUARD } = opts || {};
  const value = typeof text === 'string' ? text.trim() : '';
  const civilityChecked = typeof civility === 'function';
  if (!value) {
    return { ok: !required, reason: required ? 'empty' : null, civilityChecked, value };
  }
  if (value.length < min) return { ok: false, reason: 'short', civilityChecked, value };
  if (value.length > max) return { ok: false, reason: 'long', civilityChecked, value };
  if (civilityChecked && civility(value)?.blocked) {
    return { ok: false, reason: 'blocked', civilityChecked, value };
  }
  return { ok: true, reason: null, civilityChecked, value };
}

/**
 * The bio's own band. Optional by design — an unwritten bio is not a failure.
 *
 * @param {unknown} text
 * @param {{ civility?: CivilityGuard|null }} [opts]
 * @returns {AuthoredTextResult}
 */
export function validateChairBio(text, opts) {
  return validateAuthoredHallText(text, {
    min: HALL_BIO_MIN,
    max: HALL_BIO_MAX,
    required: false,
    civility: opts?.civility,
  });
}

/**
 * The letter's own band. Both prompts are required — a letter with a blank half
 * is not a letter.
 *
 * @param {unknown} text
 * @param {{ civility?: CivilityGuard|null }} [opts]
 * @returns {AuthoredTextResult}
 */
export function validateChairLetterAnswer(text, opts) {
  return validateAuthoredHallText(text, {
    min: HALL_LETTER_MIN,
    max: HALL_LETTER_MAX,
    required: true,
    civility: opts?.civility,
  });
}

/**
 * Compose the two answers into the letter body that lands in the support queue,
 * prompts included so the operator reads a letter rather than two orphan
 * paragraphs.
 *
 * @param {Record<string, string>} answers  keyed by HALL_LETTER_PROMPTS[].key
 * @returns {string}
 */
export function composeChairLetter(answers) {
  return HALL_LETTER_PROMPTS
    .map((p) => `${p.label}\n\n${String(answers?.[p.key] ?? '').trim()}`)
    .join('\n\n---\n\n');
}
