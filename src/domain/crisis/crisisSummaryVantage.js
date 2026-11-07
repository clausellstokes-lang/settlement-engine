/**
 * domain/crisis/crisisSummaryVantage.js — THE CRISIS SUMMARY, ONE VANTAGE PER SURFACE (W4 PEOPLE,
 * second seat, 2026-11-07; STYLE-RULINGS §1(c), WAVE-RULINGS item 2, the owner's style law,
 * WIRING-RULINGS §5-§8).
 *
 * THE DEFECT IT ENDS. A crisis's summary (`stress[].summary`, written once by
 * `stressNarrative.js :: renderStressSummary`) printed word for word on every surface that names
 * the crisis: four times in one PDF (the cover, the Overview, the crisis page, Defence), twice in
 * the Foundry journal and once more on the Defence tab — STYLE-AUDIT §2a #29, "duplicate-surface".
 *
 * THE RULING. ONE surface keeps the full text: the crisis section (the Crisis tab, the PDF's
 * crisis page, the Foundry crisis page), which reads `entry.summary` untouched. Every other
 * surface prints a DIFFERENT VANTAGE of the same circumstance from this table:
 *   cover = the traveller (what you see arriving) · Overview = the local (how daily life changed)
 *   · Defence = the watch (what it guards against now) · Tonight = the official (what those in
 *   charge must decide).
 * Variants differ in vantage, never in fact: every line states only what its crisis kind (and,
 * for a migration, its declared direction) guarantees — the facts the stored summary itself
 * presumes. No line names a garrison, soldiers, walls or a hospital (those are facts of their
 * own), no line claims hunger the food record may not hold, and a war line holds for a town
 * that profits from the war and one that pays for it (the summary's roll is not kept).
 *
 * A kind this table does not know (an authored custom crisis) keeps its stored summary on every
 * surface: a line written for another crisis is worse than a repeat.
 *
 * Pure; no randomness, no clock. Every line is FOR THE OWNER'S VETO (docs/WIRING_W4_2026-11-07.md,
 * "SECOND SEAT").
 */
import { migrationDirectionOf } from './migrationDirection.js';

/** The four vantages, and the surface each one belongs to. */
export const SUMMARY_VANTAGE_OF_SURFACE = Object.freeze({
  cover: 'traveller',
  overview: 'local',
  defence: 'watch',
  tonight: 'official',
});

/**
 * crisis kind → vantage → line (`{name}` = the settlement's name). `mass_migration` is keyed by
 * its declared direction first (WAVE-RULINGS item 8: both sets written, never one for both).
 * @type {Readonly<Record<string, Readonly<Record<string, any>>>>}
 */
export const CRISIS_SUMMARY_VANTAGES = Object.freeze({
  under_siege: Object.freeze({
    traveller: 'The roads into {name} end at the besiegers\' lines, and nothing goes in or out without their leave.',
    official: '{name} is under siege and its supply roads are cut; every order its leaders give is about lasting another week.',
    local: '{name} is cut off. Food comes from what is already inside, and people ration it a little tighter every day.',
    watch: '{name} is surrounded. Everyone who can keep a lookout is keeping one, and nobody sleeps through the night.',
  }),
  famine: Object.freeze({
    traveller: 'In {name} you see hungry children at the doors, and long queues wherever food is handed out.',
    official: '{name} has lost a second harvest. Its leaders have begun rationing, while the families who can afford it hoard what they have.',
    local: 'The harvest has failed in {name} two years running. Rations are short, the better-off are hoarding, and the children go hungry.',
    watch: 'Hunger has made {name} tense: what food is stored is watched day and night, and every quarrel over food turns ugly fast.',
  }),
  occupied: Object.freeze({
    traveller: 'Foreign officials run {name} now; the locals answer their questions politely and say as little as they can.',
    official: '{name} is governed by an outside power. Its own leaders keep their titles and do as they are told.',
    local: 'People in {name} do what the occupiers ask and nothing more, and some of them are quietly working against them.',
    watch: 'The occupiers watch {name} closely, and the resistance watches them back, careful never to be caught.',
  }),
  politically_fractured: Object.freeze({
    traveller: '{name} has no one in charge: each part of it answers to a different faction, and each tells you a different story about who rules.',
    official: 'Two or three factions each hold part of {name}, and none will give way, so nothing that needs them all gets done.',
    local: 'In {name} even ordinary business means choosing a side, and neighbours notice who you deal with.',
    watch: '{name} is split between rival factions, and a quarrel where their ground meets can turn into a brawl.',
  }),
  indebted: Object.freeze({
    traveller: '{name} owes more than it can ever pay, and the creditor\'s agents are as much at home in its streets as its own people.',
    official: '{name} cannot repay what it owes to an outside power, and its leaders now decide nothing without asking what the creditor will say.',
    local: 'Everything {name} earns goes first to the debt, and people grumble that they now work for the creditor.',
    watch: 'The creditor keeps its own people in {name}, watching where every coin goes.',
  }),
  recently_betrayed: Object.freeze({
    traveller: '{name} is wary of new faces since someone trusted sold it out; questions come before help.',
    official: 'Someone trusted in {name} sold something important, and its leaders still do not know who, or how much was lost.',
    local: 'Since the betrayal, people in {name} keep their own counsel: everyone knows it happened, and no one knows who did it.',
    watch: '{name} is still looking for whoever betrayed it, and every unexplained absence draws a hard look.',
  }),
  infiltrated: Object.freeze({
    traveller: 'Nothing seems wrong in {name} at first; it takes a while to notice how many decisions favour the same outsiders.',
    official: 'Someone outside {name} is quietly shaping its decisions, and its leaders have not noticed.',
    local: 'Life in {name} goes on as usual, but odd decisions keep being made, and nobody can say who wanted them.',
    watch: 'Agents of an outside interest move through {name} unchallenged, because nobody knows to look for them.',
  }),
  plague_onset: Object.freeze({
    traveller: 'A sickness is spreading in {name}: doors are shut, and people keep their distance in the street.',
    official: 'A sickness is spreading in {name}, and its leaders can neither agree where it came from nor get people to accept a quarantine.',
    local: 'The sickness in {name} is spreading, and people would rather argue over where it came from than stay indoors.',
    watch: 'Those trying to keep {name}\'s sick apart from the healthy are being ignored, and the quarantine holds nowhere.',
  }),
  succession_void: Object.freeze({
    traveller: '{name}\'s last leader is dead and nobody has taken their place; everyone you meet has a view on who should.',
    official: '{name}\'s last strong leader died recently and no one has yet taken charge; several rivals are moving to do it first.',
    local: 'With the old leader dead and no one in their place, people in {name} wait to see who comes out on top.',
    watch: 'Rivals for {name}\'s empty seat are gathering followers, and it may come to blows before anyone is chosen.',
  }),
  monster_pressure: Object.freeze({
    traveller: 'The roads around {name} are dangerous now: carts have gone missing, and a farmstead went up in flames last week.',
    official: 'Something around {name} has grown bolder, and the place\'s usual defences were never meant for it.',
    local: 'Nobody in {name} goes out after dark now, and every family has a story of something seen at the edge of the fields.',
    watch: 'Whatever is attacking around {name}, wolves, raiders or worse, is getting bolder, and the lookouts count the days between attacks.',
  }),
  insurgency: Object.freeze({
    traveller: '{name} looks calm, but its offices are half empty and orders go unanswered; a powerful faction has turned against those in charge.',
    official: 'A powerful faction in {name} says the government has no right to rule, and is quietly refusing it every cooperation.',
    local: 'People in {name} are choosing between the government and the faction that defies it, and many have stopped doing what the government asks.',
    watch: 'There is no fighting in {name}\'s streets; the danger is quieter, officials who will not act and orders that go nowhere.',
  }),
  religious_conversion: Object.freeze({
    traveller: '{name}\'s faith is in dispute: you hear two kinds of prayer in its streets, and people are careful which one they join.',
    official: 'Which faith {name} keeps has split its people, and its leaders cannot settle it to everyone\'s satisfaction.',
    local: 'Families in {name} are divided over faith, and old friends now worship apart.',
    watch: 'Arguments over faith in {name} run hot, and a feast day can end in a fight.',
  }),
  slave_revolt: Object.freeze({
    traveller: 'Work has stopped across {name}: the enslaved have downed their tools, and their owners stand by not knowing what to do.',
    official: 'The enslaved of {name} have risen and will not work. Its leaders\' first answer failed, and they have not settled on a second.',
    local: 'Whole work gangs in {name} have downed their tools, and the owners argue over whether to bargain or to crack down.',
    watch: '{name}\'s enslaved are in open defiance, and everyone set to keep order is busy containing them.',
  }),
  wartime: Object.freeze({
    traveller: '{name} is in a kingdom at war: army carts pass through, and the war is all anyone talks about.',
    official: 'The kingdom\'s war makes its demands on {name}, in men, carts and supplies, and its leaders must decide how much to give.',
    local: 'The war is far from {name}, but it touches every household: the prices, the news, the carts going by.',
    watch: 'In wartime {name} watches its roads for deserters, spies and the army\'s own requisition officers alike.',
  }),
  mass_migration: Object.freeze({
    arrivals: Object.freeze({
      traveller: 'Walking into {name}, you pass tents on both sides of the road: newcomers looking for a place to call home.',
      official: '{name}\'s leaders are caught between their duty to the newcomers and a place that cannot house or employ them all.',
      local: 'Families have been arriving all season, more than {name} has roofs or work for. They camp where they can, and the old households keep their distance.',
      watch: 'Newcomers keep arriving in {name}, and with them come quarrels over space and work that the old families expect someone to settle.',
    }),
    departures: Object.freeze({
      traveller: 'Every street in {name} has houses standing empty, their owners gone for good.',
      official: '{name} is losing people faster than it can replace them, and its leaders have fewer hands each season to keep things running.',
      local: 'Families keep leaving {name}, the ones who could afford to first, and those who stay do the work of the ones who went.',
      watch: 'With so many gone, {name}\'s empty houses draw thieves and squatters, and fewer people are left to keep them out.',
    }),
  }),
});

/** @param {unknown} v @returns {string} */
const clean = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * One crisis's summary from one vantage, the settlement's name in its slot; the stored summary
 * where the table has no line for the crisis (an authored custom crisis) or no name is known.
 * @param {{ type?: unknown, summary?: unknown, direction?: unknown }|null|undefined} entry one `stress[]` entry
 * @param {unknown} name the settlement's name
 * @param {string} vantage one of SUMMARY_VANTAGE_OF_SURFACE's values
 * @returns {string|null}
 */
export function crisisSummaryVantage(entry, name, vantage) {
  const stored = clean(entry?.summary) || null;
  const place = clean(name);
  const kind = clean(entry?.type);
  const set = kind ? CRISIS_SUMMARY_VANTAGES[kind] : undefined;
  if (!set || !place) return stored;
  // the census's one reader of W0's field (influx | exodus), the facts' own direction
  const lines = kind === 'mass_migration' ? set[migrationDirectionOf(entry) === 'exodus' ? 'departures' : 'arrivals'] : set;
  const line = lines ? clean(lines[vantage]) : '';
  return line ? line.replace(/\{name\}/g, place) : stored;
}

/**
 * The summary a named SURFACE prints: its vantage (SUMMARY_VANTAGE_OF_SURFACE), else the stored
 * text. The crisis section is not a key here on purpose: it keeps `entry.summary` itself.
 * @param {{ type?: unknown, summary?: unknown, direction?: unknown }|null|undefined} entry
 * @param {unknown} name
 * @param {'cover'|'overview'|'defence'|'tonight'} surface
 * @returns {string|null}
 */
export function crisisSummaryForSurface(entry, name, surface) {
  const vantage = SUMMARY_VANTAGE_OF_SURFACE[surface];
  return vantage ? crisisSummaryVantage(entry, name, vantage) : clean(entry?.summary) || null;
}
