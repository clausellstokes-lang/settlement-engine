/**
 * domain/dossier/faithReading.js — ONE FAITH READING (lane FAITH, 2026-11-03).
 *
 * THE FAILURE IT CURES (docs/GENERATION_ROOT_CAUSES_2026-11-02.md, failure 2, "Faith denies
 * its own church"). The Faith tab asked one question, "has this place been given a patron
 * god?", and generation never gives one: the gods are the DM's custom content. So the tab
 * always took its no-faith branch and printed "keeps no named faith" / "No single creed holds
 * sway" beside the parish churches, the cathedral, the Religious Authorities, the High Priest
 * and the tithe that generation DID write. Two parts of the program each owned "does this
 * place have a church", and the tab read the one that is always empty.
 *
 * THIS LEAF DERIVES THE CHURCH ONCE, from what generation writes:
 *   - the houses of worship (the Religious shelf: parish church, cathedral, monastery, temple,
 *     chapel, wayside shrine) and "Access to parish church", which is a place WITHOUT a church
 *     whose people walk to a neighbour's;
 *   - the strongest religious faction (powerStructure.factions, category `religious`);
 *   - the senior cleric (the NPC roster's priestly roles, highest first);
 *   - the tithe (economicState.incomeSources' "Church Tithes" row);
 *   - the religion dial (config.priorityReligion, 0..100);
 *   - the DM's deity embed, HANDED IN rather than read here: the key it lives under is one the
 *     generator never writes, so the observed-shape instrument admits its read only where it
 *     is already banked (faithPanelModel), which reads it once and passes the value down.
 * Every faith surface (the Faith tab in both views, FaithSection, the War & Faith desk's
 * faith half, the print chapter) reads this one record through `faithPanelModel`.
 *
 * AND IT SAYS WHAT EXISTS (`faithLinesOf`). Beside a church: the church, plainly; that its god
 * and its name are the DM's to set is the HINT (`faithHintOf`), printed under the line, never
 * in it (SW-6, R5). Access only: the people walk to the next
 * village's church. Nothing at all: the quiet-observances line. The dial is read in every case.
 * The god and the church are never named here: by the owner's rule they are the DM's.
 *
 * Pure; no rng; no mutation; no digits in any sentence.
 */

import { liveInstitutions } from '../institutions/institutionRoster.js';

/**
 * @typedef {'cathedral'|'parish'|'monastery'|'temple'|'chapel'|'shrine'} ChurchKind
 */

/**
 * @typedef {object} ChurchHouse
 * @property {ChurchKind} kind
 * @property {boolean} plural the catalogue row stands for several houses ("Parish churches (2-5)")
 * @property {boolean} great the row is the great house of its kind ("Great cathedral")
 */

/**
 * @typedef {object} SeniorCleric
 * @property {string|null} name the NPC's personal name, or null when the roster gives none
 * @property {string} role the role as the prose speaks it ("High Priest", "Archbishop")
 */

/**
 * @typedef {object} ReligiousFaction
 * @property {string} name
 * @property {number} power
 * @property {boolean} governs the faction holds the seat
 */

/**
 * @typedef {object} Tithe
 * @property {number} share the income row's percentage, as written (never printed)
 */

/**
 * @typedef {object} FaithDeity
 * @property {string} name
 */

/**
 * @typedef {object} FaithReading
 * @property {boolean} hasChurch a house of worship that is a church stands here (a wayside
 *   shrine alone is not one)
 * @property {string} churchWords the houses in plain words ("a great cathedral, parish
 *   churches and monasteries"); empty when there are none
 * @property {boolean} accessOnly no church here, and the people have access to a neighbour's
 * @property {boolean} shrine a wayside shrine stands here
 * @property {SeniorCleric|null} seniorCleric
 * @property {ReligiousFaction|null} religiousFaction
 * @property {Tithe|null} tithe
 * @property {number} dial the religion dial, 0..100
 * @property {FaithDeity|null} deity the DM's deity embed, when one exists
 */

/**
 * The slice of a settlement this reading consults.
 * @typedef {object} FaithReadingSettlement
 * @property {ReadonlyArray<{ name?: unknown, category?: unknown }>} [institutions]
 * @property {{ factions?: ReadonlyArray<{ faction?: unknown, name?: unknown, category?: unknown, power?: unknown, isGoverning?: unknown }> }} [powerStructure]
 * @property {ReadonlyArray<{ name?: unknown, role?: unknown, gender?: unknown }>} [npcs]
 * @property {{ incomeSources?: ReadonlyArray<{ source?: unknown, percentage?: unknown }> }} [economicState]
 * @property {{ priorityReligion?: unknown }} [config]
 * @property {unknown} [tier]
 */

/** @param {unknown} x @returns {string} */
const text = (x) => (typeof x === 'string' ? x.trim() : '');

/** @param {unknown} x @param {number} fallback @returns {number} */
const num = (x, fallback) => (typeof x === 'number' && Number.isFinite(x) ? x : fallback);

/** "Access to parish church": the place has no church; its people use a neighbour's. */
const ACCESS_RE = /^access to\b/i;

/**
 * The houses of worship, in the order the prose names them (the greatest first). A row
 * matches the FIRST kind whose pattern it carries.
 * @type {ReadonlyArray<{ kind: ChurchKind, re: RegExp }>}
 */
const KINDS = Object.freeze([
  { kind: 'cathedral', re: /cathedral/i },
  { kind: 'parish', re: /parish church/i },
  { kind: 'monastery', re: /monaster|friary|abbey|priory|convent/i },
  { kind: 'temple', re: /\btemple\b/i },
  { kind: 'chapel', re: /\bchapel\b/i },
  { kind: 'shrine', re: /\bshrine\b/i },
]);

/** @type {Readonly<Record<ChurchKind, readonly [string, string]>>} singular · plural */
const KIND_WORDS = Object.freeze({
  cathedral: /** @type {const} */ (['cathedral', 'cathedrals']),
  parish: /** @type {const} */ (['parish church', 'parish churches']),
  monastery: /** @type {const} */ (['monastery', 'monasteries']),
  temple: /** @type {const} */ (['temple', 'temples']),
  chapel: /** @type {const} */ (['chapel', 'chapels']),
  shrine: /** @type {const} */ (['wayside shrine', 'wayside shrines']),
});

/**
 * The priestly roles, most senior first. The roster's own spellings; a slashed role
 * ("Archbishop/Patriarch") is spoken by its first half.
 * @type {ReadonlyArray<RegExp>}
 */
const CLERIC_RANKS = Object.freeze([
  /^archbishop|patriarch/i,
  /^high priest/i,
  /^head of the faithful$/i,
  /^abbot|abbess/i,
  /^(village )?priest(ess)?$/i,
  /chaplain$/i,
]);

/** @param {string} name @returns {ChurchKind|null} */
function kindOf(name) {
  for (const { kind, re } of KINDS) if (re.test(name)) return kind;
  return null;
}

/**
 * @param {FaithReadingSettlement} s
 * @returns {{ houses: ChurchHouse[], access: boolean }}
 */
function housesOf(s) {
  /** @type {Map<ChurchKind, ChurchHouse>} */
  const byKind = new Map();
  let access = false;
  // The LIVE roster: a church ruined by calamity or closed is not a church that keeps the
  // faith (domain/institutions/institutionRoster.js, the ruin filter).
  /** @type {ReadonlyArray<{ name?: unknown }>} */
  const live = liveInstitutions(s);
  for (const inst of live) {
    const name = text(inst?.name);
    if (!name) continue;
    if (ACCESS_RE.test(name)) { access = true; continue; }
    const kind = kindOf(name);
    if (!kind) continue;
    // A count RANGE ("(2-5)", "(50-100+)") or a plural noun marks several houses; a
    // population note ("Cathedral (10,000+ only)") does not.
    const plural = /\(\s*\d+\s*-|multiple|network|churches|monasteries|shrines|chapels|temples/i.test(name);
    const great = /^great\b/i.test(name);
    const prior = byKind.get(kind);
    byKind.set(kind, {
      kind,
      plural: plural || !!prior,
      great: great || !!prior?.great,
    });
  }
  const houses = KINDS.map(({ kind }) => byKind.get(kind)).filter(
    /** @returns {h is ChurchHouse} */ (h) => !!h);
  return { houses, access };
}

/** @param {ReadonlyArray<string>} parts @returns {string} "a, b and c" */
function series(parts) {
  if (parts.length <= 1) return parts[0] || '';
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

/** @param {ReadonlyArray<ChurchHouse>} houses @returns {string} */
function wordsFor(houses) {
  return series(houses.map((h) => {
    const [one, many] = KIND_WORDS[h.kind];
    if (h.plural) return many;
    const noun = h.great ? `great ${one}` : one;
    return `a ${noun}`;
  }));
}

/** @param {FaithReadingSettlement} s @returns {SeniorCleric|null} */
function seniorClericOf(s) {
  /** @type {{ rank: number, cleric: SeniorCleric }|null} */
  let best = null;
  for (const npc of Array.isArray(s.npcs) ? s.npcs : []) {
    const role = text(npc?.role);
    if (!role) continue;
    const rank = CLERIC_RANKS.findIndex((re) => re.test(role));
    if (rank < 0 || (best && best.rank <= rank)) continue;
    const spoken = role.split('/')[0].trim();
    const name = text(npc?.name);
    // A roster row that carries the role where a name belongs ("The High Priestess") has
    // no personal name to print.
    const personal = name && !/^the\s/i.test(name) && name.toLowerCase() !== role.toLowerCase() ? name : null;
    best = { rank, cleric: { name: personal, role: spoken } };
  }
  return best ? best.cleric : null;
}

/** @param {FaithReadingSettlement} s @returns {ReligiousFaction|null} */
function religiousFactionOf(s) {
  /** @type {ReligiousFaction|null} */
  let best = null;
  for (const f of Array.isArray(s.powerStructure?.factions) ? s.powerStructure.factions : []) {
    if (text(f?.category) !== 'religious') continue;
    const name = text(f?.faction) || text(f?.name);
    if (!name) continue;
    const power = num(f?.power, 0);
    if (best && best.power >= power) continue;
    best = { name, power, governs: f?.isGoverning === true };
  }
  return best;
}

/** @param {FaithReadingSettlement} s @returns {Tithe|null} */
function titheOf(s) {
  const rows = Array.isArray(s.economicState?.incomeSources) ? s.economicState.incomeSources : [];
  const row = rows.find((r) => /tithe/i.test(text(r?.source)));
  return row ? { share: num(row.percentage, 0) } : null;
}

/** @param {FaithReadingSettlement} s @returns {number} */
function dialOf(s) {
  const d = num(s.config?.priorityReligion, 50);
  return d < 0 ? 0 : d > 100 ? 100 : d;
}

/**
 * THE ONE FAITH READING.
 * @param {FaithReadingSettlement|null|undefined} settlement
 * @param {{ deity?: { name?: unknown }|null }} [embed] the DM's deity embed, as
 *   `faithPanelModel` read it (`config.primaryDeitySnapshot`); absent ⇒ no deity
 * @returns {Readonly<FaithReading>}
 */
export function faithReadingOf(settlement, { deity = null } = {}) {
  const s = settlement || {};
  const { houses, access } = housesOf(s);
  const churches = houses.filter((h) => h.kind !== 'shrine');
  const deityName = text(deity?.name);
  return Object.freeze({
    hasChurch: churches.length > 0,
    churchWords: wordsFor(churches),
    accessOnly: churches.length === 0 && access,
    shrine: houses.some((h) => h.kind === 'shrine'),
    seniorCleric: seniorClericOf(s),
    religiousFaction: religiousFactionOf(s),
    tithe: titheOf(s),
    dial: dialOf(s),
    deity: deityName ? { name: deityName } : null,
  });
}

/**
 * Is there any church to speak of: a house, access to a neighbour's, a religious faction,
 * a priest or a tithe. The coherence check's evidence test, and the line's case split.
 * @param {FaithReading} reading
 * @returns {boolean}
 */
export function faithHasChurchEvidence(reading) {
  return !!(reading.hasChurch || reading.accessOnly || reading.religiousFaction
    || reading.seniorCleric || reading.tithe);
}

// ── THE LINE ─────────────────────────────────────────────────────────────────────────────

/** The god and the name are the DM's: said once, plainly, never as an apology. */
export const FAITH_YOURS_LINE = 'The faith’s god and the church’s name are yours to set.';

/** The quiet-observances line, carried verbatim from the teaser it replaces. */
export const QUIET_OBSERVANCES_LINE = 'The people keep their own quiet observances. No single creed holds sway, and the shrines answer to no named god.';

/** @param {string} s @returns {string} */
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/**
 * The religion dial as the people's observance, in five bands. Read in every case, so the
 * dial at 0 and at 100 never read alike.
 * @param {number} dial
 * @returns {string}
 */
function observanceOf(dial) {
  if (dial <= 15) return 'Few folk keep the rites beyond weddings and burials.';
  if (dial <= 40) return 'Folk attend on the great feast days and keep the lesser rites at home.';
  if (dial <= 60) return 'Most folk attend the rites through the year.';
  if (dial <= 85) return 'Devotion runs deep, and the rites set the rhythm of the week.';
  return 'Devotion runs through every part of life here, and few miss a rite.';
}

/**
 * The religion dial as a phrase for DS-FTH-2's `{observance}` slot (lane FAITH-POOLS,
 * 2026-11-04): how often the people keep their observances, on `observanceOf`'s five bands.
 * The reading's own words, so the desk carries no fill table of its own. Lowercase, no
 * stop, no digit (§0c `phrase`).
 * @param {number} dial
 * @returns {string}
 */
export function observancePhraseOf(dial) {
  if (dial <= 15) return 'seldom, beyond weddings and burials';
  if (dial <= 40) return 'on the great feast days';
  if (dial <= 60) return 'through the year';
  if (dial <= 85) return 'week by week';
  return 'in every part of life';
}

/** @param {number} dial @returns {string} the quiet line, banded by the dial */
function quietOf(dial) {
  if (dial <= 25) return 'The people keep their own quiet observances, seldom and lightly. No single creed holds sway, and the shrines answer to no named god.';
  if (dial >= 75) return 'The people keep their own quiet observances, and keep them faithfully. No single creed holds sway, and the shrines answer to no named god.';
  return QUIET_OBSERVANCES_LINE;
}

/** @param {SeniorCleric} c @returns {string} */
function clericLead(c) {
  // M-1b (PEOPLE-1 CAST): a card's role carries its article ('the priest'); the line supplies its own.
  const noun = String(c.role || '').replace(/^the\s+/i, '');
  return c.name ? `${c.name}, the ${noun}, leads its clergy.` : `A ${noun} leads its clergy.`;
}

/**
 * @param {ReligiousFaction} f
 * @param {string} place "the town"
 * @returns {string}
 */
function factionLine(f, place) {
  if (f.governs) return `${cap(place)} is governed by the ${f.name}.`;
  if (f.power >= 30) return `Real political weight rests with the ${f.name}.`;
  if (f.power >= 15) return `A voice in ${place}’s affairs belongs to the ${f.name}.`;
  return `A small voice in ${place}’s affairs belongs to the ${f.name}.`;
}

/**
 * THE FAITH LINE: what the page says about this place's faith when no god has been set.
 * Sentences, in order; the caller joins them. The DM's hint is not among them (`faithHintOf`).
 * @param {FaithReading} reading
 * @param {{ tierNoun?: string|null }} [opts] the settlement's own tier noun ("thorp")
 * @returns {ReadonlyArray<string>}
 */
export function faithLinesOf(reading, { tierNoun = null } = {}) {
  const place = tierNoun ? `the ${tierNoun}` : 'the settlement';
  const out = [];
  const cleric = reading.seniorCleric;
  const faction = reading.religiousFaction;

  if (reading.hasChurch) {
    const single = !/ and |,|churches|monasteries|cathedrals|temples|chapels/.test(reading.churchWords);
    out.push(`${cap(reading.churchWords)} ${single ? 'keeps' : 'keep'} the faith in ${place}.`);
    if (cleric) out.push(clericLead(cleric));
  } else if (reading.accessOnly) {
    out.push(`${cap(place)} has no church of its own; its people walk to the next village’s parish church for the rites.`);
    const clericNoun = String(cleric?.role || '').replace(/^the\s+/i, ''); // M-1b: the role carries its article
    if (cleric) out.push(cleric.name ? `${cleric.name}, the ${clericNoun}, lives here.` : `A ${clericNoun} lives here.`);
  } else if (faithHasChurchEvidence(reading)) {
    out.push(`No church building stands in ${place}, but the faith is organised here.`);
    if (cleric) out.push(clericLead(cleric));
  } else {
    return Object.freeze([quietOf(reading.dial)]);
  }
  if (faction) out.push(factionLine(faction, place));
  if (reading.tithe) out.push('Tithes are collected.');
  out.push(observanceOf(reading.dial));
  return Object.freeze(out);
}

/**
 * THE LAYOUT HINT (SW-6 CRISIS-SURFACES, STYLE-RULINGS-2 A1 R5): that the faith's god and the
 * church's name are the DM's to set. It is a note to the DM, not a fact about the place, so it
 * is never joined into the faith line: `faithPanelModel` carries it as `hint` and each reader
 * prints it UNDER the paragraph (the Faith tab, the teaser, the print position `faith.hint`).
 * Said wherever the line speaks of a church or an organised faith; the quiet-observances town,
 * which has no church to name, gets none.
 * @param {FaithReading} reading
 * @returns {string|null}
 */
export function faithHintOf(reading) {
  return faithHasChurchEvidence(reading) ? FAITH_YOURS_LINE : null;
}
