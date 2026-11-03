/**
 * domain/summary/tonightSheet.js — THE ONE TONIGHT SHEET (X-51, the owner 2026-11-03: "There
 * should be one consolidated dub it tonight sheet").
 *
 * The Quick Guide and "Tonight at the Table" were two sheets of one job, printed side by side on
 * the Table View and Session Mode and a third way in the print chapter. They are one page now,
 * composed here once and rendered by one screen component (components/TonightSheet.jsx), one
 * print chapter (pdf/sections/TonightAtTheTable.jsx) and the Foundry journal's page.
 *
 * The page opens on the ACTIVE CRISIS, then gives:
 *   - the three people to voice: the seat-holder (the ruling chain's named NPC, on
 *     derivePowerStrata's ruler), the NPC whose secret was drawn from the crisis's own pool,
 *     and the senior cleric;
 *   - the two facts the players test first: food (the band and the stores, from the one food
 *     record) and defence (defenseFactsOf);
 *   - the hooks, as the record holds them, highest priority first.
 *
 * ⛔ NOTHING IS INVENTED. Every string on the sheet is a record value or a label from
 * TONIGHT_COPY. An absent person is absent (never "Unnamed NPC"); an absent fact is absent.
 *
 * Pure: same settlement in, same sheet out. Lazy-only: its consumers are the Table View,
 * Session Mode, the PDF and the journal, none of which is first paint.
 */

import { collectPlotHooks } from '../dossier/plotHooks.js';
import { rulingChainOf } from '../dossier/powerStrata.js';
import { defenseFactsOf } from '../defense/defenseFacts.js';
import { institutionDisplayName } from '../display/institutionDisplayName.js';
import { FOOD_SECURITY_BANDS } from '../../data/bandLadders.js';
import { STRESS_INSTITUTION_EFFECTS } from '../../data/stressInstitutionEffects.js';

/**
 * THE ONE COPY CONSTANT for the sheet, on every surface that prints it.
 */
export const TONIGHT_COPY = Object.freeze({
  title: 'Tonight',
  crisis: 'Active crisis',
  urgent: 'What is urgent',
  people: 'People to voice',
  facts: 'What the players test first',
  hooks: 'Hooks',
  food: 'Food',
  defence: 'Defence',
  seat: 'Holds the seat',
  secret: 'Secret',
  cleric: 'Senior cleric',
  wants: 'Wants to',
  open: 'Open Tonight',
  close: 'Close Tonight',
});

/** How many hooks the sheet carries. */
const HOOK_COUNT = 3;

/**
 * @typedef {Object} TonightCrisis
 * @property {string} type          the crisis's own label (e.g. 'Under Siege'), every active one joined
 * @property {string} place         the settlement's name
 * @property {string | null} person the crisis's named person; null until the roster records one
 * @property {string} line          the one line the sheet opens on
 *
 * @typedef {Object} TonightPerson
 * @property {string} name
 * @property {string} role
 * @property {'seat'|'secret'|'cleric'} why
 * @property {string} line          the record's sentence for this person: the crisis secret, or what they want
 * @property {string} sourcePath
 *
 * @typedef {Object} TonightFact
 * @property {'food'|'defence'} id
 * @property {string} label
 * @property {string} text
 * @property {string} sourcePath
 *
 * @typedef {Object} TonightHook
 * @property {string} text
 * @property {string} source
 *
 * @typedef {Object} TonightSheet
 * @property {TonightCrisis | null} crisis
 * @property {string} opening       the first line: the crisis line, or the pressure sentence with no crisis
 * @property {TonightPerson[]} people
 * @property {TonightFact[]} facts
 * @property {TonightHook[]} hooks
 */

/**
 * @typedef {Object} TonightNpc
 * @property {unknown} [name]
 * @property {unknown} [role]
 * @property {unknown} [title]
 * @property {unknown} [category]
 * @property {unknown} [power]
 * @property {unknown} [ousted]
 * @property {{ short?: unknown, long?: unknown } | string | null} [goal]
 * @property {{ what?: unknown } | string | null} [secret]
 *
 * @typedef {Object} TonightStress
 * @property {unknown} [type]
 * @property {unknown} [label]
 *
 * @typedef {Object} TonightSource
 * @property {unknown} [name]
 * @property {TonightStress | TonightStress[] | null} [stress]
 * @property {unknown} [pressureSentence]
 * @property {TonightNpc[]} [npcs]
 * @property {{ foodSecurity?: { foodRecord?: { band?: unknown, storageMonths?: unknown, hasGranary?: unknown } | null } | null }} [economicState]
 */

/**
 * Compose the one Tonight sheet.
 * @param {TonightSource | null | undefined} settlement
 * @returns {TonightSheet}
 */
export function composeTonightSheet(settlement) {
  const source = settlement && typeof settlement === 'object' ? settlement : {};
  const crisis = crisisOf(source);
  return {
    crisis,
    opening: crisis ? crisis.line : sentence(clean(source.pressureSentence)),
    people: peopleOf(source),
    facts: [foodFact(source), defenceFact(source)].filter(/** @returns {f is TonightFact} */ (f) => f !== null),
    hooks: hooksOf(source),
  };
}

/** @param {TonightSource} source @returns {TonightStress[]} */
function stressesOf(source) {
  const raw = source.stress;
  const list = Array.isArray(raw) ? raw : (raw ? [raw] : []);
  return list.filter((s) => !!s && typeof s === 'object');
}

/**
 * The crisis in one line: its label (every active one) and the settlement's name. The person's
 * slot is null until the roster records the crisis's named person.
 * @param {TonightSource} source @returns {TonightCrisis | null}
 */
function crisisOf(source) {
  const labels = stressesOf(source).map((s) => clean(s.label) || clean(s.type)).filter(Boolean);
  if (labels.length === 0) return null;
  const type = labels.join(' and ');
  const place = clean(source.name);
  /** @type {string | null} */
  const person = null;
  const line = place ? `${place}: ${type}` : type;
  return { type, place, person, line };
}

/** @param {TonightNpc} npc @returns {number} */
function powerOf(npc) {
  const n = Number(npc?.power);
  return Number.isFinite(n) ? n : 0;
}

/** @param {TonightNpc} npc @returns {string} */
function secretOf(npc) {
  return clean(typeof npc.secret === 'object' && npc.secret ? npc.secret.what : npc.secret);
}

/** @param {TonightNpc} npc @returns {string} */
function wantOf(npc) {
  const goal = clean(typeof npc.goal === 'object' && npc.goal ? (npc.goal.short || npc.goal.long) : npc.goal);
  if (!goal) return '';
  // read after the label "Wants to": the goal's own words, lower-led, closed once
  const words = goal.replace(/^to\s+/i, '');
  const lower = words[0].toLowerCase() + words.slice(1);
  return /[.!?]$/.test(lower) ? lower : `${lower}.`;
}

/** @param {string} text @returns {RegExp} */
function templatePattern(text) {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{[a-z]+\\\}/g, '.+?');
  return new RegExp(`^${escaped}$`);
}

/**
 * The secrets the crisis's own pool can draw (stressInstitutionEffects.js), as patterns over the
 * filled text. An NPC whose secret matches one carries a secret tied to the crisis.
 * @param {TonightSource} source @returns {RegExp[]}
 */
function crisisSecretPatterns(source) {
  /** @type {Record<string, ReadonlyArray<{ secret: string }>>} */
  const pools = STRESS_INSTITUTION_EFFECTS;
  return stressesOf(source).flatMap((s) => {
    const type = clean(s.type);
    return type && Object.hasOwn(pools, type) ? pools[type].map((e) => templatePattern(e.secret)) : [];
  });
}

/**
 * The three people to voice, each once, in the order seat, secret, cleric.
 * @param {TonightSource} source @returns {TonightPerson[]}
 */
function peopleOf(source) {
  const npcs = (Array.isArray(source.npcs) ? source.npcs : [])
    .map((npc, index) => ({ npc, index }))
    .filter(({ npc }) => !!npc && typeof npc === 'object' && clean(npc.name) && !npc.ousted)
    .sort((a, b) => (powerOf(b.npc) - powerOf(a.npc)) || (a.index - b.index));
  /** @type {TonightPerson[]} */
  const out = [];
  /** @param {{ npc: TonightNpc, index: number }} row @param {'seat'|'secret'|'cleric'} why @param {string} line */
  const add = (row, why, line) => {
    const name = clean(row.npc.name);
    const at = out.findIndex((p) => p.name === name);
    if (at >= 0) {
      // the seat-holder who also holds the crisis secret is voiced once, with the secret
      if (why === 'secret') out[at] = { ...out[at], line };
      return;
    }
    out.push({ name, role: clean(row.npc.role || row.npc.title), why, line, sourcePath: `npcs[${row.index}]` });
  };

  const seatName = rulingChainOf(/** @type {Parameters<typeof rulingChainOf>[0]} */ (source)).npc?.name || '';
  const seat = seatName ? npcs.find(({ npc }) => clean(npc.name) === seatName) : undefined;
  if (seat) add(seat, 'seat', wantOf(seat.npc));

  const patterns = crisisSecretPatterns(source);
  const keeper = patterns.length
    ? npcs.find(({ npc }) => { const s = secretOf(npc); return !!s && patterns.some((re) => re.test(s)); })
    : undefined;
  if (keeper) add(keeper, 'secret', sentence(secretOf(keeper.npc)));

  const cleric = npcs.find(({ npc }) => npc.category === 'religious' && !out.some((p) => p.name === clean(npc.name)));
  if (cleric) add(cleric, 'cleric', wantOf(cleric.npc));
  return out;
}

/**
 * The stores in plain words, from the one food record: the months in store and the granary.
 * The same words as the Economics tab's stores row.
 * @param {{ storageMonths?: unknown, hasGranary?: unknown }} record @returns {string}
 */
export function foodStoresWords(record) {
  const months = Number(record?.storageMonths);
  if (!Number.isFinite(months) || months <= 0) return '';
  const whole = Math.round(months);
  const span = months < 1 ? 'a few weeks' : whole <= 1 ? 'about a month' : `${numberWord(whole)} months`;
  if (record.hasGranary === true) return `Stores: a granary, ${span} of grain.`;
  return months < 1 ? 'No granary; a few weeks in the larder.' : `No granary; ${span} in household stores.`;
}

/** @param {number} n @returns {string} */
function numberWord(n) {
  const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  return n >= 0 && n < words.length ? words[n] : String(n);
}

/** @param {TonightSource} source @returns {TonightFact | null} */
function foodFact(source) {
  const record = source.economicState?.foodSecurity?.foodRecord;
  if (!record || typeof record !== 'object') return null;
  const band = clean(record.band);
  /** @type {Record<string, { label: string }>} */
  const bands = FOOD_SECURITY_BANDS;
  const bandText = band && Object.hasOwn(bands, band) ? `${bands[band].label}.` : '';
  const text = [bandText, foodStoresWords(record)].filter(Boolean).join(' ');
  return text ? { id: 'food', label: TONIGHT_COPY.food, text, sourcePath: 'economicState.foodSecurity.foodRecord' } : null;
}

/** @param {TonightSource} source @returns {TonightFact} */
function defenceFact(source) {
  const facts = defenseFactsOf(/** @type {Parameters<typeof defenseFactsOf>[0]} */ (source));
  const names = facts.defenceNames.map((n) => institutionDisplayName(n)).filter(Boolean);
  const text = names.length ? `${names.join(', ')}.` : 'No walls and no standing force.';
  return { id: 'defence', label: TONIGHT_COPY.defence, text, sourcePath: 'defenseFactsOf' };
}

/** @param {TonightSource} source @returns {TonightHook[]} */
function hooksOf(source) {
  return [...collectPlotHooks(/** @type {Parameters<typeof collectPlotHooks>[0]} */ (source))]
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, HOOK_COUNT)
    .map((h) => ({ text: sentence(clean(h.text)), source: clean(h.source) }))
    .filter((h) => h.text);
}

/** @param {unknown} value @returns {string} */
function clean(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

/** @param {string} text @returns {string} */
function sentence(text) {
  if (!text) return '';
  const lead = text[0].toUpperCase() + text.slice(1);
  return /[.!?]$/.test(lead) ? lead : `${lead}.`;
}
