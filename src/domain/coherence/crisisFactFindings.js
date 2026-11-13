/**
 * domain/coherence/crisisFactFindings.js — THREE CRISIS FACTS THE PAGE MAY CONTRADICT (lane
 * RUNG2-F13, 2026-11-04; docs/SOAK_10000_RUNG2_2026-11-04.md §3c, the chair's CONTRADICTION
 * kinds that join the stop rule under kind 10, "crisis").
 *
 *   famine-stores        an ACTIVE famine (the food record's band) beside a printed stores line
 *                        of six months or more that does not say the stores are held back
 *                        ("Food Deficit — Active Famine. Stores: a granary, 15 months of grain.",
 *                        soak1k-3605). Per surface.
 *   migration-direction  a migration line whose direction is not the crisis record's: an
 *                        exodus sentence ("Three families left this week…") under an influx, or
 *                        an arrival sentence under an exodus (soak1k-0, soak1k-4204). The
 *                        direction is one fact on the mass_migration entry
 *                        (`migrationDirectionOf`). Per surface.
 *   crisis-cast-sense    the crisis cast contradicting itself, read from the one Tonight sheet
 *                        (`composeTonightSheet`) and the cast it reads:
 *                          want_not_own:<role>   a cast person whose card carries a goal voiced with
 *                                                another want (ROUND THREE: the card's goal is the one home);
 *                          want_not_role:<role>  a cast person with no goal: the want is not drawn from that
 *                                                role's own pool (`CAST_WANTS`): the instigator
 *                                                wanting to identify the infiltrator (soak1k-1805),
 *                                                the split's instigator wanting no political
 *                                                pressure (soak1k-2404, -3005);
 *                          target_runs_plot      a crisis's target voiced with that crisis's own
 *                                                secret, so the target runs the plot (soak1k-4200);
 *                          plotter_governs       the instigator is the governing house, or the house
 *                                                that already holds the seat by capture (soak1k-4203);
 *                                                or a page sentence names the governing house as
 *                                                the one meeting against the governing house
 *                                                (soak1k-3000). Once, surface 'tonight' / the page.
 *
 * Page-only (coherenceBattery.js, like the F9 reader checks): the record battery the generation
 * receipt runs never sees them, so no receipt moves. Pure: no clock, no seed, no draw.
 */

import { composeTonightSheet, castWantOf, hasOwnGoal, DAYS_PER_MONTH } from '../summary/tonightSheet.js';
import { governingFactionOf } from '../rulingPower.js';
import { isSeatVacant } from '../people/seatKeeper.js';

/** A want compared in one form: lower-cased, unclosed, spaces folded. @param {unknown} v @returns {string} */
const bareWant = (v) => (typeof v === 'string' ? v : '').replace(/\s+/g, ' ').trim().replace(/[.!?]$/, '').toLowerCase();
import { STRESS_INSTITUTION_EFFECTS } from '../../data/stressInstitutionEffects.js';
import { migrationDirectionOf } from '../crisis/migrationDirection.js';
import { firstRankMembershipOf, powerOrderOf } from '../people/membership.js';

/** @typedef {{ quote: string, detail: string }} CrisisFactFinding */
/**
 * A stress entry as this module reads it: the Tonight sheet's own entry, plus the migration
 * direction `migrationDirectionOf` reads off a mass_migration entry.
 * @typedef {import('../summary/tonightSheet.js').TonightStress & { direction?: unknown }} CrisisStress
 */
/**
 * A stress entry that carries its crisis cast: the `entries` filter in `crisisCastSenseFindings`
 * keeps only these (`cast` present, `cast.roles` an array), and its cast narrows to this.
 * @typedef {CrisisStress & { cast: import('../crisis/crisisCast.js').CrisisCast }} CastCrisisStress
 */
/**
 * A cast person as this module reads it: the Tonight sheet's npc plus the house it sits in.
 * @typedef {import('../summary/tonightSheet.js').TonightNpc & { memberships?: unknown }} CrisisNpc
 */
/**
 * The settlement fields this module reads, shaped so the record still goes, unwidened, to the
 * two typed readers it is handed to (`composeTonightSheet`, `governingFactionOf`). Every leaf
 * read is checked where it is read (`str`, `Array.isArray`), so the open fields stay `unknown`.
 * @typedef {object} CrisisSettlement
 * @property {CrisisStress | CrisisStress[] | null} [stress]
 * @property {CrisisNpc[]} [npcs]
 * @property {{ foodSecurity?: { foodRecord?: { band?: unknown, storageMonths?: unknown } | null } | null }} [economicState]
 * @property {CrisisPowerStructure} [powerStructure]
 */
/**
 * The power structure as this module reads it: the ruling-power shape, its factions carrying the
 * `category` `isCriminal` reads, and the capture state.
 * @typedef {Omit<import('../rulingPower.js').PowerStructure, 'factions'> & {
 *   factions?: Array<import('../rulingPower.js').RulingFaction & { category?: unknown }>,
 *   criminalCaptureState?: unknown }} CrisisPowerStructure
 */

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');

const SENTENCES = /(?<=[.!?])\s+(?=[A-Z"“‘'(])|\n+/;
/** @param {string} text */
const sentencesOf = (text) => text.split(SENTENCES).map((x) => x.trim()).filter(Boolean);

/** @param {CrisisSettlement | null | undefined} s @returns {CrisisStress[]} */
const stressesOf = (s) => {
  const raw = s?.stress;
  return (Array.isArray(raw) ? raw : raw ? [raw] : []).filter((e) => !!e && typeof e === 'object');
};

// ── famine-stores ────────────────────────────────────────────────────────────────────────

const NUMBER_WORDS = Object.freeze(['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']);
/**
 * The stores sentence `foodStoresWords` writes, in its granary forms: the span is read whole and
 * turned back into months (`monthsOfSpan`), in every unit the writer prints (R2-CODE-B item 3:
 * `tonightSheet.js :: storesSpanWords` speaks days and weeks under a month; "a few weeks" is the
 * older form, still read for a page written before it).
 */
const STORES_LINE = /Stores: a granary(?:,| of) (a few weeks|(?:about |less than )?(?:a|[a-z]+|\d+) (?:months?|weeks?|days?))\b[^.]*\./gi;
/** The words that say the stores are held back, not in hand. */
const HELD = /\bwill not open\b|\bwithh(?:eld|olds?)\b|\bhoard/i;
/** The months a famine's stores line may print without saying they are held. */
export const FAMINE_STORES_HELD_MONTHS = 6;

/** The months 'a few weeks' reads back as (ODQ §934.105). */
const FEW_WEEKS_AS_MONTHS = 0.5;

/** The months one of each unit the stores line speaks in is worth (the writer's own days per month). */
const UNIT_MONTHS = Object.freeze({ month: 1, week: 7 / DAYS_PER_MONTH, day: 1 / DAYS_PER_MONTH });

/** @param {string} span the stores line's span ("six months", "about a month", "about three days") @returns {number} */
function monthsOfSpan(span) {
  const lower = span.toLowerCase();
  if (lower === 'a few weeks') return FEW_WEEKS_AS_MONTHS;
  const m = lower.match(/^(?:about |less than )?(\S+) (month|week|day)s?$/);
  if (!m) return NaN;
  const at = NUMBER_WORDS.indexOf(m[1]);
  const n = m[1] === 'a' ? 1 : at >= 0 ? at : Number(m[1]);
  return n * UNIT_MONTHS[/** @type {'month'|'week'|'day'} */ (m[2])];
}

/**
 * famine-stores: one finding per stores line of six months or more, on a surface, while the food
 * record's band is an active famine, unless the line says the stores are held.
 * @param {CrisisSettlement | null | undefined} settlement @param {string} text
 * @returns {CrisisFactFinding[]}
 */
export function famineStoresFindings(settlement, text) {
  const record = settlement?.economicState?.foodSecurity?.foodRecord;
  if (str(record?.band) !== 'famine') return [];
  /** @type {CrisisFactFinding[]} */
  const out = [];
  for (const m of str(text).matchAll(STORES_LINE)) {
    const months = monthsOfSpan(m[1]);
    if (!(months >= FAMINE_STORES_HELD_MONTHS) || HELD.test(m[0])) continue;
    out.push({ quote: m[0], detail: `active famine; the line prints ${months} months in hand (record ${/** @type {{ storageMonths?: unknown }} */ (record).storageMonths})` });
  }
  return out;
}

// ── migration-direction ──────────────────────────────────────────────────────────────────

/** A sentence telling this place's people leaving. */
const EXODUS = /\b(?:families|households|people) (?:left|have left|are leaving|leaving)\b|\bThe departure is\b|\bDeparture Committee\b|\bemigration crisis\b|\bthose who fled\b|\bnumbers here are falling\b/i;
/** A sentence telling people arriving. */
const INFLUX = /\bnew arrivals\b|\bnewcomers?\b|\breceiving more people\b|\btaking in more people\b|\bhave arrived\b|\barrived this year\b/i;

/**
 * migration-direction: one finding per sentence on a surface that tells the other direction
 * from the mass_migration entry's own.
 * @param {CrisisSettlement | null | undefined} settlement @param {string} text
 * @returns {CrisisFactFinding[]}
 */
export function migrationDirectionFindings(settlement, text) {
  const entry = stressesOf(settlement).find((e) => e.type === 'mass_migration');
  if (!entry) return [];
  const direction = migrationDirectionOf(entry);
  const wrong = direction === 'exodus' ? INFLUX : EXODUS;
  return sentencesOf(str(text)).filter((x) => wrong.test(x))
    .map((quote) => ({ quote, detail: `the crisis record's migration is an ${direction}` }));
}

// ── crisis-cast-sense ────────────────────────────────────────────────────────────────────

/** @param {string} text @returns {RegExp} */
function templatePattern(text) {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[a-z]+\\\}/g, '.+?');
  return new RegExp(`^${escaped}\\.?$`);
}

/** The cast role behind a printed label (`CRISIS_ROLE_LABEL`, read back). */
const ROLE_OF_LABEL = Object.freeze(/** @type {Record<string, string>} */ ({
  'bears the brunt': 'brunt', 'holds the lever': 'lever', 'exploits it': 'exploiter', 'takes the fall': 'scapegoat',
  instigator: 'instigator', target: 'target', wavers: 'waverer', collaborates: 'collaborator', defends: 'defender',
  'would treat': 'treater', "the occupier's local face": 'face', profits: 'profiteer',
}));

/** The governing house's own plotting sentence (the Power desk's institutional-insurgency vignette). */
const MEETING_AGAINST = / is conducting meetings with people who should not be meeting privately\./;

/**
 * crisis-cast-sense: the Tonight sheet's cast read against the roles it names.
 * @param {CrisisSettlement | null | undefined} settlement
 * @param {Readonly<Record<string, string>>} [surfaces]
 * @returns {Array<CrisisFactFinding & { surface: string }>}
 */
export function crisisCastSenseFindings(settlement, surfaces = {}) {
  const entries = /** @type {CastCrisisStress[]} */ (stressesOf(settlement).filter((e) => e.cast && Array.isArray(e.cast.roles)));
  /** @type {Array<CrisisFactFinding & { surface: string }>} */
  const out = [];
  const governing = governingFactionOf(settlement);
  const govName = str(governing?.faction) || str(governing?.name);
  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  /** @param {string} id */
  const npcById = (id) => npcs.find((n) => !!n && (str(n.id) || str(n.name)) === id);
  const captured = str(settlement?.powerStructure?.criminalCaptureState) === 'capture';
  const factions = Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  /** @param {string} fname */
  const isCriminal = (fname) => {
    const f = factions.find((x) => (str(x?.faction) || str(x?.name)) === fname);
    return !!f && (str(f.category) === 'criminal' || /thie(?:f|ves)|smuggl|syndicate|underworld|crime/i.test(fname));
  };

  if (entries.length) {
    const sheet = composeTonightSheet(settlement);
    // want_not_own / want_not_role: every cast-voiced person's want. ROUND THREE (the chair's ruling: one home for what
    // a person wants, the card's own goal): a person whose card carries a goal wants that goal, never a role's line
    // (want_not_own); a person with none wants their role's line, re-derived through the writer's own fill (the role,
    // the person, the crisis, the person's house, the seat) and compared by EXACT equality (want_not_role, SW-6 #40).
    // A secret or a temperament (`says`) is not a want and is not read here.
    const seatEmpty = isSeatVacant(settlement);
    for (const p of sheet.people || []) {
      if (p.why !== 'cast' || p.sameAs || (p.says && p.says !== 'want') || !str(p.line)) continue;
      const role = ROLE_OF_LABEL[str(p.castLabel)] || str(p.castLabel);
      const npc = npcById(str(p.castId));
      if (npc && hasOwnGoal(npc)) {
        const goal = str(typeof npc.goal === 'object' && npc.goal ? (npc.goal.short || npc.goal.long) : npc.goal).replace(/^to\s+/i, '');
        if (bareWant(p.line) !== bareWant(goal)) out.push({ surface: 'tonight', quote: `${p.name} (${p.castLabel}): ${p.line}`, detail: `want_not_own:${role}` });
        continue;
      }
      const house = str(firstRankMembershipOf(npc, powerOrderOf(settlement))?.power);
      const want = castWantOf(role, str(p.castId), str(p.castKind), '', house, { seatEmpty });
      if (!want || str(p.line) !== want) out.push({ surface: 'tonight', quote: `${p.name} (${p.castLabel}): ${p.line}`, detail: `want_not_role:${role}` });
    }
    // target_runs_plot: a crisis's target voiced with that crisis's own secret.
    for (const e of entries) {
      const pool = /** @type {Record<string, ReadonlyArray<{ secret: string }>>} */ (STRESS_INSTITUTION_EFFECTS)[str(e.type)] || [];
      const patterns = pool.map((x) => templatePattern(x.secret));
      for (const row of e.cast.roles.filter((r) => r.role === 'target' && r.kind === 'npc')) {
        const voiced = (sheet.people || []).find((p) => p.name === str(row.name));
        if (voiced && patterns.some((re) => re.test(str(voiced.line)))) {
          out.push({ surface: 'tonight', quote: `${voiced.name}: ${voiced.line}`, detail: `target_runs_plot: the ${str(e.type)} target carries its own secret` });
        }
      }
    }
    // plotter_governs: the instigator is the governing house, or the house holding it by capture.
    const order = powerOrderOf(settlement);
    for (const e of entries) {
      for (const row of e.cast.roles.filter((r) => r.role === 'instigator')) {
        // MERGE-CAR: a person's house is its FIRST-RANK power (the people car's memberships, M-1b; as crisisCast reads the brunt)
        const fname = row.kind === 'faction' ? str(row.id) : str(firstRankMembershipOf(npcById(str(row.id)), order)?.power);
        if (!fname) continue;
        if (govName && fname === govName) out.push({ surface: 'record', quote: `${row.name} of ${fname}`, detail: `plotter_governs: the ${str(e.type)} instigator is the governing house` });
        else if (captured && isCriminal(fname)) out.push({ surface: 'record', quote: `${row.name} of ${fname}`, detail: `plotter_governs: the ${str(e.type)} instigator's house already holds the seat by capture` });
      }
    }
  }
  // plotter_governs on the page: the governing house named as the one meeting against itself.
  if (govName) {
    for (const [surface, text] of Object.entries(surfaces || {})) {
      const hit = sentencesOf(str(text)).find((x) => x.startsWith(govName) && MEETING_AGAINST.test(x));
      if (hit) out.push({ surface, quote: hit, detail: 'plotter_governs: the governing house meets against the governing house' });
    }
  }
  return out;
}
