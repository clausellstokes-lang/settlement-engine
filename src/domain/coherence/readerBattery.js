/**
 * domain/coherence/readerBattery.js — THE READER BATTERY: the plausibility observations a DM
 * makes reading a generated settlement end to end (lane READER-INSTRUMENTS, 2026-11-04).
 *
 * The chair read three settlements as a DM would and found a fault family the soak ladder
 * never counted: pools and validators that never consult the record (the "fine print") —
 * the generator's own validation lines printed as facts, luxury imports in a thorp, a Mentor
 * and Successor across two trades, a living grievance from an occupation three centuries
 * gone, guards in hooks where there is no guard, a Tide Fair on a plains road, "Wants to Was
 * approached…", catalogue threshold notes, "Tailor's'", the Daily Life placeholder. The owner
 * (2026-11-04 ~15:25 UTC): "Add these kinds of observations to your 1000+ runs as well".
 *
 * These are INSTRUMENTS ONLY; nothing here cures anything (the cures are the READER WINDOW).
 * The soak counts them under the `reader:` family, one kind (`KIND_OF`), in a table of their
 * own outside the stop rule (scripts/audit/soak-review/aggregate.mjs).
 *
 * Every check reads RENDERED text (the surfaces `renderHarness.mjs :: renderSurfaces` paints:
 * the twenty tabs, the Tonight sheet, the PDF and the Foundry journal) and consults the RECORD
 * only for what IS (the roster, the institutions, the terrain and route, the tension's source
 * event). A finding has the battery's shape `{ check, surface, quote, detail }`; a sub-case is
 * the detail's leading `[tag]`, which the aggregate counts.
 *
 * Pure.
 */

import { ROLE_CLASS, classOfRole, holdsOffice, shareTradeOrOffice, exemptedVerdict, seatFactions, PRESUMING_KINDS, factionRoleFits } from '../roles/roleClass.js';
import { factsOf } from '../facts/factsOf.js'; // CENSUS-1c unit 6c: the market, watch and guard answers
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { wantRegisterFault } from '../summary/tonightSheet.js';
import { collect, str } from './recordBattery.js';
import { waterOf } from '../facts/water.js';
import { firstRankMembershipOf, powerOrderOf } from '../people/membership.js';
import { terrainClassOf, tradeRouteOf } from '../facts/terrain.js';

/** @typedef {import('./coherenceBattery.js').BatteryFinding} BatteryFinding */

/**
 * The record fields the reader battery consults (everything else is read off the rendered text).
 * Leaves are `unknown` — the readers coerce with `str` / `Number` or guard with `Array.isArray` —
 * except the goods lists `recordHoldsGood` spreads, which are lists when present.
 * @typedef {import('../facts/terrain.js').TerrainRecord & {
 *   tier?: unknown,
 *   config?: { nearbyResources?: unknown, nearbyResourcesDepleted?: unknown } | null,
 *   institutions?: ReadonlyArray<unknown> | null,
 *   npcs?: unknown,
 *   economicState?: {
 *     localProduction?: ReadonlyArray<unknown> | null,
 *     primaryImports?: ReadonlyArray<unknown> | null,
 *     primaryExports?: ReadonlyArray<unknown> | null,
 *     foodSecurity?: { foodRecord?: { foodSources?: ReadonlyArray<unknown> | null, normalImportPct?: unknown } | null } | null,
 *   } | null,
 *   powerStructure?: { governingName?: unknown, factions?: unknown } | null,
 *   history?: { currentTensions?: unknown, historicalEvents?: unknown } | null,
 * } | null | undefined} ReaderRecord
 */
/** @typedef {{ name?: unknown, role?: unknown, memberships?: unknown }} ReaderNpc */
/** @typedef {{ templateType?: unknown, description?: unknown, yearsAgo?: unknown, name?: unknown }} ReaderEvent */

// ───────────────────────────── shared readers ─────────────────────────────

/** @param {string} text @returns {string[]} */
const linesOf = (text) => str(text).split('\n').map((x) => x.trim()).filter(Boolean);

/** The terrain home's one chain (`facts/terrain.js`, CENSUS-1 fact 13). @param {ReaderRecord} s @returns {string} */
export function terrainOf(s) {
  return terrainClassOf(s);
}

/** @param {ReaderRecord} s @returns {string} */
export function routeOf(s) {
  return tradeRouteOf(s);
}

/** Navigable water: the water home (`facts/water.js`, CENSUS-1 fact 4), not a regex of its own.
 * @param {ReaderRecord} s */
export const hasNavigableWater = (s) => waterOf(s).navigable;

// ───────────────────────── 1. validation-on-page ─────────────────────────

const REQUIRES_ACCESS = /\brequires? ([a-z ]+?) access\b/;
const NOT_COMPATIBLE = /\bis not compatible with\b/;
const LACKS_ACCESS = /\bexists but lacks access to\b/;
/** A gap line in either voice: the generator's ("X exists but lacks access to Y") or the house's ("No Y reaches the X."). */
const GAP_LINE = /\bexists but lacks access to (.+?)\.?$|^No (.+?) reach(?:es)? the .+\.$/;
/** Words that name no good of their own. */
const GAP_FILLER = new Set(['from', 'with', 'water', 'that', 'this', 'their', 'ore', 'access']);

/**
 * GAP-VS-RECORD (lane READER-R1): the good a gap line names, read against what the record says
 * the place HAS — the economy's production, imports and exports, the nearby resources that are
 * not depleted, the food record's sources and ordinary supply. Deliberately its own simple
 * reader (a word in common), not the cure's table: an instrument that imported the cure would
 * measure the cure against itself.
 * @param {ReaderRecord} s @param {string} good
 */
function recordHoldsGood(s, good) {
  const es = s?.economicState || {};
  const depleted = new Set(Array.isArray(s?.config?.nearbyResourcesDepleted) ? s.config.nearbyResourcesDepleted : []);
  const nearby = (Array.isArray(s?.config?.nearbyResources) ? s.config.nearbyResources : []).filter((/** @type {unknown} */ k) => !depleted.has(k));
  const food = es.foodSecurity?.foodRecord || {};
  const held = [...(es.localProduction || []), ...(es.primaryImports || []), ...(es.primaryExports || []), ...nearby, ...(food.foodSources || [])]
    // "precious stones" are gems, not a quarry's stone (soak1k-316 at 1,000).
    .map((/** @type {unknown} */ x) => str(x).toLowerCase().replace(/\bprecious stones?\b/g, 'gems').replace(/[_/()\-,.]+/g, ' '));
  const words = held.join(' ').split(/\s+/).filter(Boolean).map((w) => w.replace(/s$/, ''));
  const wanted = good.toLowerCase().replace(/[_/()\-,.]+/g, ' ').split(/\s+/).filter((w) => w.length >= 4 && !GAP_FILLER.has(w)).map((w) => w.replace(/s$/, ''));
  if (wanted.some((w) => words.includes(w))) return true;
  return /\b(?:grain|flour)\b/.test(good.toLowerCase()) && Number(food.normalImportPct) > 0;
}

/**
 * The generator's own consistency checks rendered as facts: "X requires river access", "X is
 * not compatible with port access", "<house> exists but lacks access to <good>", and the
 * Viability page's stated count of critical issues against the Critical Issues it lists.
 * Sub-cases: `[structural]` (requires / not compatible), `[requires-on-water]` (a "requires
 * <water> access" where the terrain IS that water), `[gaps]` (the lacks-access lines A-05
 * counts), `[viability-count]`, and `[gap-vs-record]` (a gap line, in either voice, whose
 * good the record holds: "Mill exists but lacks access to grain" in a village exporting grain).
 * @param {ReaderRecord} s @param {Readonly<Record<string,string>>} surfaces
 */
export function validationOnPageFindings(s, surfaces) {
  /** @type {Array<{surface:string,quote:string,detail:string}>} */
  const out = [];
  const terrain = terrainOf(s);
  for (const [surface, text] of Object.entries(surfaces)) {
    const lines = linesOf(text);
    const structural = lines.find((x) => REQUIRES_ACCESS.test(x) || NOT_COMPATIBLE.test(x));
    if (structural) out.push({ surface, quote: structural, detail: `[structural] ${lines.filter((x) => REQUIRES_ACCESS.test(x) || NOT_COMPATIBLE.test(x)).length} lines` });
    const onWater = lines.find((x) => {
      const m = x.match(REQUIRES_ACCESS);
      if (!m) return false;
      const need = m[1].toLowerCase();
      return (/river/.test(need) && /river/i.test(terrain)) || (/coast|sea|port/.test(need) && /coast/i.test(terrain)) || (/lake/.test(need) && /lake/i.test(terrain));
    });
    if (onWater) out.push({ surface, quote: onWater, detail: `[requires-on-water] terrain ${terrain}, route ${routeOf(s)}` });
    const gap = lines.find((x) => LACKS_ACCESS.test(x));
    if (gap) out.push({ surface, quote: gap, detail: `[gaps] ${lines.filter((x) => LACKS_ACCESS.test(x)).length} lines` });
    const answered = lines.filter((x) => {
      const m = x.match(GAP_LINE);
      return m ? recordHoldsGood(s, str(m[1] ?? m[2])) : false;
    });
    if (answered.length) out.push({ surface, quote: answered[0], detail: `[gap-vs-record] ${answered.length} lines` });
  }
  const viability = str(surfaces.viability);
  const stated = viability.match(/^(\d+) critical issues? prevents? /m);
  if (stated) {
    const listed = viability.match(/^Critical Issues \((\d+)\)/m);
    const n = Number(stated[1]);
    const m = listed ? Number(listed[1]) : 0;
    if (n !== m) out.push({ surface: 'viability', quote: stated[0].trim(), detail: `[viability-count] states ${n}, lists Critical Issues (${m})` });
  }
  return out;
}

// ──────────────────────────── 2. scale-lists ────────────────────────────

/** @param {ReaderRecord} s @returns {string[]} the Institutions tab's rows, by their catalogue name */
const houseNames = (s) => (Array.isArray(s?.institutions) ? s.institutions : []).map((/** @type {unknown} */ i) => nativeSemanticName(i)).filter(Boolean);

// The chair's list, with Q2 (2026-11-04): quality textiles, fine cloth and dyed cloth are luxury-class too.
const LUXURY = /\b(?:luxury goods|fine textiles|quality textiles|fine cloth|dyed cloth|camel herds|spices|silk|exotic goods|gems|gemstones)\b/i;

/**
 * An Economic strength that names a resource trade, mapped to the houses that carry it. Every
 * pattern is held against `institutionalCatalog.js`'s own names (the unit test walks it).
 * Strengths that name no single house (Agriculture, Grain production, Livestock, Hunting, the
 * trade hubs, Maritime and River trade, Exotic goods) are not resource trades and are not read.
 */
/** @type {Readonly<Record<string, RegExp>>} */
export const STRENGTH_HOUSES = Object.freeze({
  'Mining': /^Mine\b/,
  'Stone quarrying': /^Stone quarry$/,
  'Stoneworking': /^Stone quarry$/,
  'Metalworking': /smith|^Smelter$|^Specialized metalworkers$/i,
  'Gemcutting': /^Jeweller$|^Luxury goods quarter$/,
  'Glass and gems': /^Glass(?:makers|blower)$|^Jeweller$/,
  'Fishing industry': /^Fishing community$|^Fishmonger$|^Fish market$|Fisher/,
  'Shipbuilding': /^Shipyard$|^River boatyard$/,
  'Salt production': /^Salt works$/,
  'Salt trade': /^Salt works$/,
  'Milling': /^Mills? \(|^Mill$/,
  'Brewing': /^Brewery$|^Brewer$|^Maltster$/,
  'Timber trade': /^Sawmill|^Carpenters? |^Carpenter$|^Charcoal burner$/,
  'Woodcraft': /^Carpenters? |^Carpenter$|^Woodcarver$|^Cooper$|^Bowyer/,
  'Fur trade': /^Tann(?:er|ery|ers)/,
  'Wool production': /^Shepherd|^Weavers|^Fuller$|^Dyer$/,
  'Wool and textiles': /^Shepherd|^Weavers|^Fuller$|^Dyer$|^Tailor$/,
  'Sheep herding': /^Shepherd|^Common grazing land$/,
});

/**
 * (a) a thorp or hamlet whose Imports list holds luxury-class goods (`[luxury-imports]`);
 * (b) an Economic strength naming a resource trade with no house behind it (`[~strength-no-house]`):
 * informational, a COLUMN only (the chair's ruling Q3: the list is the terrain's fixed potential,
 * which R2 relabels "what the land offers"), never folded into (a)'s line.
 * @param {ReaderRecord} s @param {Readonly<Record<string,string>>} surfaces
 */
export function scaleListsFindings(s, surfaces) {
  /** @type {Array<{surface:string,quote:string,detail:string}>} */
  const out = [];
  const tier = str(s?.tier);
  if (tier === 'thorp' || tier === 'hamlet') {
    const eco = linesOf(surfaces.economics);
    const at = eco.indexOf('Imports');
    const imports = at >= 0 ? str(eco[at + 1]) : '';
    const lux = imports.match(new RegExp(LUXURY.source, 'gi'));
    if (lux) out.push({ surface: 'economics', quote: imports, detail: `[luxury-imports] ${tier}: ${[...new Set(lux.map((x) => x.toLowerCase()))].join(', ')}` });
  }
  const res = linesOf(surfaces.resources);
  const at = res.indexOf('Economic strengths');
  if (at >= 0) {
    const strengths = str(res[at + 1]).split('✓').map((x) => x.trim()).filter(Boolean);
    const houses = houseNames(s);
    const bare = strengths.filter((x) => STRENGTH_HOUSES[x] && !houses.some((h) => STRENGTH_HOUSES[x].test(h)));
    if (bare.length) out.push({ surface: 'resources', quote: res[at + 1], detail: `[~strength-no-house] ${bare.join(', ')}` });
  }
  return out;
}

/**
 * The READER battery's distributions, by tier, never findings:
 *  - `exports`: the Exports line's item count (the Economy tab paints one pill per
 *    `primaryExports` entry; check 2c);
 *  - `dailyLifeLine`: 1 where the Daily Life tab carries the placeholder line at all (check 10,
 *    the chair's ruling 2026-11-04), else 0.
 * @param {ReaderRecord} s @param {Readonly<Record<string,string>>|null} [surfaces]
 * @returns {{ exports: number, dailyLifeLine: number }}
 */
export function readerDistributions(s, surfaces = null) {
  const exports = s?.economicState?.primaryExports;
  return {
    exports: Array.isArray(exports) ? exports.length : 0,
    dailyLifeLine: str(surfaces?.daily_life).includes(PLACEHOLDER) ? 1 : 0,
  };
}

// ──────────────────────────── 3. relation-types ────────────────────────────

// THE ROLE-CLASS RULE lives in `../roles/roleClass.js` (CENSUS-4: one rule, one home, read by the
// generator's tie step and by this instrument); re-exported for this module's readers. Its exempted
// rule reads a card's memberships (PEOPLE-5A, M-1b; composed there at MERGE-CAR).
export { ROLE_CLASS, classOfRole, shareTradeOrOffice, exemptedVerdict };

/**
 * A relationship whose kind presumes a shared trade or office between two roles that share none.
 * Reads the Relationships tab's two-line rows ("<A> <kind> <B>" over "<role A> · <strength> ·
 * <role B>") and the record's people by name (their factions) and seat.
 * - The LINE is the exempted rule (`exemptedVerdict`); its sub-case is the kind.
 * - `[~strict]`, a column only, is the first reading (`shareTradeOrOffice`; Jurisdictional
 *   Tension where NEITHER role holds an office). A row strict alone flags is a column-only
 *   finding, and its detail says which exemption spared it.
 * @param {ReaderRecord} s @param {Readonly<Record<string,string>>} surfaces
 */
export function relationTypesFindings(s, surfaces) {
  /** @type {Array<{surface:string,quote:string,detail:string}>} */
  const out = [];
  const lines = linesOf(surfaces.relationships);
  /** @type {Map<string, ReaderNpc>} */
  const people = new Map((Array.isArray(s?.npcs) ? s.npcs : []).map((/** @type {ReaderNpc} */ n) => [str(n?.name), n]));
  const seat = seatFactions(s);
  for (let i = 0; i + 1 < lines.length; i += 1) {
    const kind = PRESUMING_KINDS.find((k) => lines[i].includes(` ${k} `));
    if (!kind) continue;
    const parts = lines[i + 1].split(' · ');
    if (parts.length !== 3) continue;
    const [ra, , rb] = parts;
    const at = lines[i].indexOf(` ${kind} `);
    const a = { role: ra, npc: people.get(lines[i].slice(0, at)) };
    const b = { role: rb, npc: people.get(lines[i].slice(at + kind.length + 2)) };
    const strict = kind === 'Jurisdictional Tension' ? (!holdsOffice(ra) && !holdsOffice(rb)) : shareTradeOrOffice(ra, rb) === false;
    const exempted = exemptedVerdict(kind, a, b, seat);
    const classes = `${classOfRole(ra)} / ${classOfRole(rb)}`;
    const quote = `${ra} · ${kind} · ${rb}`;
    if (exempted.fires) out.push({ surface: 'relationships', quote, detail: `[${kind.toLowerCase().replace(/ /g, '-')}]${strict ? '[~strict]' : ''} ${classes}` });
    else if (strict) out.push({ surface: 'relationships', quote, detail: `[~strict] ${classes} (exempted: ${exempted.why || 'not judged'})` });
  }
  return out;
}

// ──────────────────────────── 4. tension-memory ────────────────────────────

/** @param {string} x */
const escapeRe = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const OLD_BANDS = /^(?:Ancient|Deep history)$/;
const LIVING = /\b(?:former\b|those who (?:suffered|remember|lost|fought|survived)|survivors?\b|veterans?\b|old loyalists|victims?\b|beneficiaries who kept|(?:collaborators|resisters) (?:and \w+ )?continued)/i;

/**
 * A Current Tension whose source event (the history event of its template, `templateType`)
 * sits in the Ancient or Deep-history band ON THE PAGE, worded with living participants
 * ("Former collaborators", "Those who suffered under the regime"). A tension with no source
 * event is not judged.
 * @param {ReaderRecord} s @param {Readonly<Record<string,string>>} surfaces
 */
export function tensionMemoryFindings(s, surfaces) {
  /** @type {Array<{surface:string,quote:string,detail:string}>} */
  const out = [];
  const page = str(surfaces.history);
  const tensions = Array.isArray(s?.history?.currentTensions) ? s.history.currentTensions : [];
  const events = Array.isArray(s?.history?.historicalEvents) ? s.history.historicalEvents : [];
  for (const t of tensions) {
    const desc = str(t?.description);
    if (!desc || !page.includes(desc)) continue;
    const source = events.find((/** @type {ReaderEvent} */ e) => e?.templateType === t?.type);
    if (!source) continue;
    const band = page.match(new RegExp(`${escapeRe(str(source.description))}\\n${Number(source.yearsAgo)}y ago\\n([^\\n]+)`));
    if (!band || !OLD_BANDS.test(band[1].trim())) continue;
    const wording = [desc, ...(Array.isArray(t?.factions) ? t.factions.map(str) : [])].join(' · ');
    const living = wording.match(LIVING);
    if (living) out.push({ surface: 'history', quote: wording.slice(0, 300), detail: `[${band[1].trim() === 'Ancient' ? 'ancient' : 'deep-history'}] ${str(source.name)}, ${source.yearsAgo}y ago; "${living[0]}"` });
  }
  return out;
}

// ──────────────────────────── 5. hook-pools ────────────────────────────

const GUARD_WORDS = /\b(?:guard captain|guards?|garrison|the watch|watch ?(?:captain|commander|house)|watchm[ae]n|city watch|town watch|soldiers?|sentries|sentry)\b/i;
// CENSUS-1c unit 6c (the vocabulary rulings §6): the enforcement HOUSE is the fact home's composite
// `guardPresence` (watch ∨ garrison ∨ militia ∨ hired company), not this instrument's own regex;
// the people half (a guard-like role on the roster) stays the instrument's. "The old guard" is an
// idiom (a faction's veterans), excluded from the guard sense until the hook lines declare.
const GUARD_IDIOM = /\bthe old guard\b/gi;
const ENFORCEMENT_ROLE = /Guard|Watch|Garrison|Commander|Soldier|Warden|Mercenary|Knight|Master of Arms|Quartermaster|Captain/;
const SEA_HOOK_WORDS = /\b(?:harbou?rs?|ships?|shipbuilding|shipwrights?|shipyards?|shipping|docks?|dockside|dock-side|wharf|wharves|quays?|fleet|sailors?|boats?|seafar\w*|the sea)\b/i;

/**
 * The Plot Hooks tab names an enforcement body the roster lacks (`[guard]`: no watch, guard,
 * garrison, militia or company among the houses, and no guard-like role among the people), or
 * speaks of ships and docks in a place with no navigable water (`[sea]`). The chair's brief names
 * the tension, outlook and history sections; the tab's NPC section carries the same pools
 * ("talking to the guard"), so the whole tab is read.
 * @param {ReaderRecord} s @param {Readonly<Record<string,string>>} surfaces
 */
export function hookPoolsFindings(s, surfaces) {
  /** @type {Array<{surface:string,quote:string,detail:string}>} */
  const out = [];
  const lines = linesOf(surfaces.plot_hooks);
  const enforcement = factsOf(s).guardPresence === true
    || (Array.isArray(s?.npcs) ? s.npcs : []).some((/** @type {ReaderNpc} */ n) => ENFORCEMENT_ROLE.test(str(n?.role)));
  if (!enforcement) {
    const hit = lines.find((x) => GUARD_WORDS.test(x.replace(GUARD_IDIOM, '')));
    if (hit) out.push({ surface: 'plot_hooks', quote: hit, detail: `[guard] "${str(hit.replace(GUARD_IDIOM, '').match(GUARD_WORDS)?.[0])}" with no enforcement body` });
  }
  if (!factsOf(s).water.navigable) {
    const hit = lines.find((x) => SEA_HOOK_WORDS.test(x));
    if (hit) out.push({ surface: 'plot_hooks', quote: hit, detail: `[sea] "${str(hit.match(SEA_HOOK_WORDS)?.[0])}" at terrain ${terrainOf(s)}, route ${routeOf(s)}` });
  }
  return out;
}

// ──────────────────────────── 6. traditions-water ────────────────────────────

const WATER_TRADITION = /\b(?:Tide|Landfall|Landing|Sea|Harbou?r|Fleet)\b/;

/**
 * A Traditions-tab tradition keyed on Tide, Landfall, Landing, Sea, Harbour or Fleet in a place
 * without water access: route road / overland / isolated / none and terrain not coastal,
 * riverside or lake.
 * @param {ReaderRecord} s @param {Readonly<Record<string,string>>} surfaces
 */
export function traditionsWaterFindings(s, surfaces) {
  if (waterOf(s).navigable) return []; // the water home (CENSUS-1 fact 4)
  const hit = linesOf(surfaces.traditions).find((x) => WATER_TRADITION.test(x));
  return hit ? [{ surface: 'traditions', quote: hit, detail: `terrain ${terrainOf(s)}, route ${routeOf(s) || 'none'}` }] : [];
}

// ──────────────────────────── 7. tonight-wants ────────────────────────────

/**
 * Every "Wants to" line on the Tonight sheet read by THE ONE SHAPE RULE (`tonightSheet.js ::
 * wantRegisterFault`, lane R11): `[sentence-not-a-want]` — a sentence pasted after "Wants to"
 * ("Wants to Was approached…", "Wants to The supplies…"); `[abstract-register]` — a want in
 * management prose no DM can say aloud ("Wants to convert governance instability into…"). One
 * finding per sub-case per settlement; the detail counts its lines.
 * @param {ReaderRecord} _s @param {Readonly<Record<string,string>>} surfaces
 */
export function tonightWantsFindings(_s, surfaces) {
  /** @type {Array<{surface:string,quote:string,detail:string}>} */
  const out = [];
  const wants = linesOf(surfaces.tonight).filter((x) => /\bWants to /.test(x));
  for (const tag of /** @type {const} */ (['sentence-not-a-want', 'abstract-register'])) {
    const hits = wants.filter((x) => wantRegisterFault(x.slice(x.indexOf('Wants to ') + 9)) === tag);
    if (!hits.length) continue;
    const lead = str(hits[0].slice(hits[0].indexOf('Wants to ') + 9).match(/^[\w'’-]+/)?.[0]);
    out.push({ surface: 'tonight', quote: hits[0], detail: `[${tag}] ${hits.length} lines; starts "${lead}"` });
  }
  return out;
}

// ──────────────────────────── 8. rule-text ────────────────────────────

const RULE_TEXT = /viable above [0-9,]+ souls|population of [0-9,]+ or more|[0-9,]+-[0-9,]+ population for|cities only|if technology exists|where the magic allows them/;

/**
 * A catalogue threshold note on a DM surface ("viable above 2,000 souls", "a population of
 * 5,000 or more", "2,000-5,000 population for chapter", "cities only", "if technology exists",
 * "where the magic allows them"). One finding per surface.
 * @param {ReaderRecord} _s @param {Readonly<Record<string,string>>} surfaces
 */
export function ruleTextFindings(_s, surfaces) {
  /** @type {Array<{surface:string,quote:string,detail:string}>} */
  const out = [];
  for (const [surface, text] of Object.entries(surfaces)) {
    const hit = linesOf(text).find((x) => RULE_TEXT.test(x));
    if (hit) out.push({ surface, quote: hit, detail: str(hit.match(RULE_TEXT)?.[0]) });
  }
  return out;
}

// ──────────────────────────── 9. possessive-slip ────────────────────────────

const DOUBLED_POSSESSIVE = /\b[A-Za-z][\w-]*['’]s['’](?![a-z])/;

/**
 * A title with a doubled possessive ("Guildmaster of Tailor's'"). One finding per surface.
 * @param {ReaderRecord} _s @param {Readonly<Record<string,string>>} surfaces
 */
export function possessiveSlipFindings(_s, surfaces) {
  /** @type {Array<{surface:string,quote:string,detail:string}>} */
  const out = [];
  for (const [surface, text] of Object.entries(surfaces)) {
    const hit = linesOf(text).find((x) => DOUBLED_POSSESSIVE.test(x));
    if (hit) out.push({ surface, quote: hit, detail: str(hit.match(DOUBLED_POSSESSIVE)?.[0]) });
  }
  return out;
}

// ───────────────────────── 10. daily-life-placeholder ─────────────────────────

const PLACEHOLDER = 'dawn, the market, the tavern, the watch';

/**
 * The Daily Life placeholder line where it names what the place lacks — ONCE per settlement
 * (the chair's ruling, 2026-11-04): it counts when the line renders AND at least one sub-case
 * holds, and the detail names which: `[no-market]` (no market by the engine's predicate,
 * `viability.js :: hasMarketInstitution`; a Periodic market is a market, the chair's ruling on
 * soak1k-313), `[no-watch]` (no watch: `factsOf(record).defence.watch`, CENSUS-1c unit 6c — a
 * garrison is not a watch), or both. How many pages carry
 * the line at all is a distribution (`readerDistributions :: dailyLifeLine`), not a finding.
 * @param {ReaderRecord} s @param {Readonly<Record<string,string>>} surfaces
 */
export function dailyLifePlaceholderFindings(s, surfaces) {
  const hit = linesOf(surfaces.daily_life).find((x) => x.includes(PLACEHOLDER));
  if (!hit) return [];
  const lacks = [
    ...(!factsOf(s).market ? ['no-market'] : []),
    ...(!factsOf(s).defence.watch ? ['no-watch'] : []),
  ];
  if (!lacks.length) return [];
  return [{ surface: 'daily_life', quote: hit, detail: `${lacks.map((x) => `[${x}]`).join('')} ${lacks.map((x) => x.replace('-', ' ')).join(', ')}` }];
}

// ───────────────────────── 11. faction-role-fit ─────────────────────────

/**
 * A faction that seats a member whose role does not fit its kind (R12, the chair's ruling of
 * 2026-11-04: religious → clergy; noble → noble or office; military → military; criminal →
 * criminal; `domain/roles/roleClass.js :: factionRoleFits`, the rule the assembly seam applies).
 * Read on the record: each power faction's category against the roles of the NPCs whose first-rank
 * membership is in it (MERGE-CAR: memberships, M-1b); the factions that hold or contest the seat also seat office-holders and nobles (ruling Q1). One finding per misfit faction; the detail names the misfit roles and their classes.
 * @param {ReaderRecord} s @param {Readonly<Record<string,string>>} _surfaces
 */
export function factionRoleFitFindings(s, _surfaces) {
  /** @type {Array<{surface:string,quote:string,detail:string}>} */
  const out = [];
  const npcs = Array.isArray(s?.npcs) ? s.npcs : [];
  const seat = seatFactions(s);
  const order = powerOrderOf(s);
  for (const f of Array.isArray(s?.powerStructure?.factions) ? s.powerStructure.factions : []) {
    const name = str(f?.faction);
    // MERGE-CAR (the chair's SC-1 ruling): the affiliation is the card's FIRST-RANK membership — the
    // people car's shape (M-1b); the shim's field is gone. A reader only: no generator fits the roster.
    const misfits = npcs.filter((/** @type {ReaderNpc} */ n) => str(firstRankMembershipOf(n, order)?.power) === name && !factionRoleFits(f?.category, n?.role, { seat: seat.has(name) }));
    if (!name || !misfits.length) continue;
    out.push({ surface: 'factions', quote: `${name} (${str(f.category)})`, detail: misfits.map((/** @type {ReaderNpc} */ n) => `${str(n.role)} (${classOfRole(str(n.role))})`).join(', ') });
  }
  return out;
}

// ───────────────────────────── the battery ─────────────────────────────

const RUNS = Object.freeze({
  'validation-on-page': validationOnPageFindings,
  'scale-lists': scaleListsFindings,
  'relation-types': relationTypesFindings,
  'tension-memory': tensionMemoryFindings,
  'hook-pools': hookPoolsFindings,
  'traditions-water': traditionsWaterFindings,
  'tonight-wants': tonightWantsFindings,
  'rule-text': ruleTextFindings,
  'possessive-slip': possessiveSlipFindings,
  'daily-life-placeholder': dailyLifePlaceholderFindings,
  'faction-role-fit': factionRoleFitFindings,
});

/** The checks, in report order (the soak prefixes each with `reader:`). */
export const READER_BATTERY_CHECKS = Object.freeze(Object.keys(RUNS));

/**
 * Every reader finding for one settlement and its rendered surfaces, in report order.
 * @param {unknown} settlement the generated record
 * @param {Readonly<Record<string, string>>} surfaces surface id → text (tabs by id, `tonight`, `pdf`, `foundry`)
 * @param {{ only?: ReadonlyArray<string> }} [options]
 * @returns {BatteryFinding[]}
 */
export function readerBattery(settlement, surfaces, options = {}) {
  if (settlement == null || typeof settlement !== 'object') return [];
  const wanted = Array.isArray(options?.only) ? new Set(options.only) : null;
  const text = Object.fromEntries(Object.entries(surfaces ?? {}).map(([k, v]) => [k, str(v)]));
  /** @type {BatteryFinding[]} */
  const out = [];
  for (const check of READER_BATTERY_CHECKS) {
    if (wanted && !wanted.has(check)) continue;
    const run = RUNS[/** @type {keyof typeof RUNS} */ (check)];
    // recordBattery.js :: collect's contract: an instrument that throws is a finding, never a
    // silent zero. Each reader row names its own surface, so the map runs per row here.
    /** @type {Array<{surface:string,quote:string,detail:string}>} */
    let rows;
    try {
      rows = run(settlement, text);
    } catch (error) {
      collect(check, 'record', () => { throw error; }, () => ({ quote: '', detail: '' }), out);
      continue;
    }
    for (const r of rows) out.push({ check, surface: r.surface, quote: str(r.quote).trim(), detail: str(r.detail) });
  }
  return out;
}
