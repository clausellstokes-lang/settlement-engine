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

import { POWER_ROLES_BY_CATEGORY } from '../../data/historyData.js';
import { NOBLE_ROLES } from '../entities/factionRoleCatalog.js';
import { hasMarketInstitution } from '../marketInstitution.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';
import { collect, str } from './recordBattery.js';

/** @typedef {import('./coherenceBattery.js').BatteryFinding} BatteryFinding */

/**
 * The record fields the reader battery consults (everything else is read off the rendered text).
 * Every leaf is `unknown`: the readers coerce with `str` / `Number` or guard with `Array.isArray`.
 * @typedef {{
 *   config?: { terrainType?: unknown, terrainOverride?: unknown, tradeRouteAccess?: unknown } | null,
 *   terrain?: unknown,
 *   tradeRouteAccess?: unknown,
 *   resourceAnalysis?: { terrain?: unknown } | null,
 *   tier?: unknown,
 *   institutions?: ReadonlyArray<unknown> | null,
 *   npcs?: unknown,
 *   economicState?: { primaryExports?: unknown } | null,
 *   powerStructure?: { governingName?: unknown, factions?: unknown } | null,
 *   history?: { currentTensions?: unknown, historicalEvents?: unknown } | null,
 * } | null | undefined} ReaderRecord
 */
/** @typedef {{ name?: unknown, role?: unknown, factionAffiliation?: unknown }} ReaderNpc */
/** @typedef {{ faction?: unknown, name?: unknown, isGoverning?: unknown, contestsNiche?: unknown }} ReaderFaction */
/** @typedef {{ templateType?: unknown, description?: unknown, yearsAgo?: unknown, name?: unknown }} ReaderEvent */

// ───────────────────────────── shared readers ─────────────────────────────

/** @param {string} text @returns {string[]} */
const linesOf = (text) => str(text).split('\n').map((x) => x.trim()).filter(Boolean);

/** @param {ReaderRecord} s @returns {string} the terrain the Resources tab names */
export function terrainOf(s) {
  return str(s?.config?.terrainType ?? s?.config?.terrainOverride ?? s?.terrain ?? s?.resourceAnalysis?.terrain);
}

/** @param {ReaderRecord} s @returns {string} */
export function routeOf(s) {
  return str(s?.config?.tradeRouteAccess ?? s?.tradeRouteAccess);
}

/** Navigable water by terrain or route (the soak's own `hasWater` reading, checks.mjs). */
const WATER_TERRAIN_WIDE = /coast|river|lake|marsh|swamp|island|delta|fjord|wetland|sea/i;
/** @param {ReaderRecord} s */
export const hasNavigableWater = (s) => WATER_TERRAIN_WIDE.test(terrainOf(s)) || routeOf(s) === 'port' || routeOf(s) === 'river';

// ───────────────────────── 1. validation-on-page ─────────────────────────

const REQUIRES_ACCESS = /\brequires? ([a-z ]+?) access\b/;
const NOT_COMPATIBLE = /\bis not compatible with\b/;
const LACKS_ACCESS = /\bexists but lacks access to\b/;

/**
 * The generator's own consistency checks rendered as facts: "X requires river access", "X is
 * not compatible with port access", "<house> exists but lacks access to <good>", and the
 * Viability page's stated count of critical issues against the Critical Issues it lists.
 * Sub-cases: `[structural]` (requires / not compatible), `[requires-on-water]` (a "requires
 * <water> access" where the terrain IS that water), `[gaps]` (the lacks-access lines A-05
 * counts), `[viability-count]`.
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

/**
 * THE ROLE→CLASS MAP: every role the NPC generator draws (`historyData.js ::
 * POWER_ROLES_BY_CATEGORY`, the noble roles of `factionRoleCatalog.js :: NOBLE_ROLES`) to one of
 * nine classes. Category → class: government → office (its noble roles → noble), religious →
 * clergy, crafts → trade, military → military, economy → merchant, criminal → criminal, magic →
 * arcane; `other` is classed one by one below (a role with no shared trade or office stays
 * `other` and is not judged). A role the map does not know is `other`.
 */
const CATEGORY_CLASS = Object.freeze({ government: 'office', religious: 'clergy', crafts: 'trade', military: 'military', economy: 'merchant', criminal: 'criminal', magic: 'arcane', other: 'other' });
const ROLE_OVERRIDES = Object.freeze({
  // economy roles that are a craft, not a counting-house
  'Master Craftsman': 'trade', 'Master Shipwright': 'trade',
  // `other`, classed one by one
  'Miller': 'trade', 'Blacksmith': 'trade', 'Shepherd': 'trade', 'Woodcutter': 'trade', 'Widowed Farmer': 'trade',
  'Fisherman': 'trade', 'Apothecary': 'trade', 'Master Builder': 'trade', 'Innkeeper': 'trade', 'Tavern Owner': 'trade',
  'Gravedigger': 'trade', 'Rat Catcher': 'trade', 'Cartographer': 'trade', 'Midwife': 'trade', 'Healer': 'trade',
  'Dockworker/Stevedore': 'trade',
  'Village Priest': 'clergy', 'Street Preacher': 'clergy',
  'Hedge Witch': 'arcane',
  'Elder': 'office', 'Disgraced Official': 'office',
  'Mercenary-for-Hire': 'military', 'Wounded Soldier': 'military',
  'Debt-Ridden Noble': 'noble',
  'Wandering Peddler': 'merchant', 'Debt Collector': 'merchant',
  // faction-pool titles (`factionRoles.js :: FACTION_ROLES`)
  'High Priestess': 'clergy', 'Watch Captain': 'military', 'Guildmaster': 'merchant', 'Senior Trader': 'merchant',
  'Kingpin': 'criminal', 'Lieutenant': 'criminal', 'Lord Mayor': 'office', 'Archmagister': 'arcane',
});

/** @returns {Readonly<Record<string,string>>} role → class */
function buildRoleClass() {
  /** @type {Record<string,string>} */
  const map = {};
  const nobles = new Set(NOBLE_ROLES.map((r) => r.role));
  for (const [category, roles] of Object.entries(POWER_ROLES_BY_CATEGORY)) {
    const list = Array.isArray(roles) ? roles : Object.values(roles).flat();
    for (const r of list) {
      const role = typeof r === 'string' ? r : str(r?.role);
      if (!role) continue;
      map[role] = nobles.has(role) ? 'noble' : (CATEGORY_CLASS[/** @type {keyof typeof CATEGORY_CLASS} */ (category)] ?? 'other');
    }
  }
  return Object.freeze({ ...map, ...ROLE_OVERRIDES });
}
export const ROLE_CLASS = buildRoleClass();

/** @param {string} role */
export const classOfRole = (role) => ROLE_CLASS[role] ?? 'other';

/** Classes that share an office or a trade between them (a governance seat; a counting-house and its craft). */
const FAMILY = Object.freeze({ office: 'governance', noble: 'governance', clergy: 'faith', military: 'arms', arcane: 'arcane', criminal: 'crime', merchant: 'commerce', trade: 'commerce', other: 'other' });
/** A craft role that names no one trade (it sits beside any craft). */
const GENERIC_CRAFT = /^(?:Master Craftsman|Guild Warden|Journeyman Overseer|Craft Guild Representative|Guild Master|Guildmaster)$/;
/** @param {string} role the trade a trade role names ("Master Blacksmith" → "blacksmith") */
const tradeOf = (role) => role.replace(/^(?:Master|Head) /, '').toLowerCase();
/** Holds an office: a seat of government or rank, a command, a senior see, a guild's head. */
const HOLDS_OFFICE = /Captain|Commander|Chief|Warden|Marshal|Master of Arms|Quartermaster|High Priest|Archbishop|Abbot|Inquisitor|Head of the Faithful|Guild ?[Mm]aster|Market Overseer|Magister|Archmage/;
/** @param {string} role */
const holdsOffice = (role) => ['office', 'noble'].includes(classOfRole(role)) || HOLDS_OFFICE.test(role);

/**
 * Do two roles share a trade or an office? Unknown (`other`) roles are not judged.
 * @param {string} a @param {string} b @returns {boolean|null} null = not judged
 */
export function shareTradeOrOffice(a, b) {
  const ca = classOfRole(a); const cb = classOfRole(b);
  if (ca === 'other' || cb === 'other') return null;
  if (FAMILY[/** @type {keyof typeof FAMILY} */ (ca)] !== FAMILY[/** @type {keyof typeof FAMILY} */ (cb)]) return false;
  if (ca === 'trade' && cb === 'trade' && !GENERIC_CRAFT.test(a) && !GENERIC_CRAFT.test(b)) return tradeOf(a) === tradeOf(b);
  return true;
}

const PRESUMING_KINDS = /** @type {const} */ (['Mentor and Successor', 'Professional Rivalry', 'Jurisdictional Tension']);

/** The seat's holder: the tier's head role (`npcGenerator.js :: TIER_MANDATORY_ROLES`: Elder, Mayor, Governor) and the Lord Mayor. */
const SEAT_ROLE = /^(?:Elder|Mayor|Lord Mayor|Governor)$/;
/** Classes that share (the chair's ruling Q1): the same class, or noble with office. */
const classesShare = (/** @type {string} */ ca, /** @type {string} */ cb) => ca === cb || (ca === 'noble' && cb === 'office') || (ca === 'office' && cb === 'noble');

/**
 * The factions that hold or contest the seat, which count as ONE office (the chair's ruling Q1):
 * the governing faction and every faction whose `contestsNiche` names it.
 * @param {ReaderRecord} s @returns {Set<string>}
 */
function seatFactions(s) {
  const ps = s?.powerStructure ?? {};
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const governing = new Set([str(ps.governingName), ...factions.filter((/** @type {ReaderFaction} */ f) => f?.isGoverning).map((/** @type {ReaderFaction} */ f) => str(f.faction ?? f.name))].filter(Boolean));
  for (const f of factions) if (governing.has(str(f?.contestsNiche))) governing.add(str(f.faction ?? f.name));
  return governing;
}

/**
 * THE EXEMPTED RULE (the chair's ruling Q1, 2026-11-04, verbatim): "two roles share a class when
 * they are in the same class of your map, OR when both are members of the same faction (the
 * faction that holds or contests the seat counts as one office), OR when one holds the seat and
 * the other sits in the body that holds it. Clergy↔clergy, arcane↔arcane, military↔military,
 * criminal↔criminal, merchant↔merchant, noble↔office share. Professional Rivalry needs a shared
 * trade or a shared market (two merchants, two craft masters), else fires. Jurisdictional Tension
 * needs two office-holders (any two offices), else fires."
 * Unit 12 (the chair's ruling, 2026-11-04): "Professional Rivalry PASSES between two
 * office-holders, between noble and office, and between noble and noble … it also passes within
 * one class … same trade, shared market. It FIRES only across unrelated classes" and "the faction
 * and seat exemptions apply to Professional Rivalry too". Jurisdictional Tension stays (two
 * offices). Read here: merchant with trade is a shared market; `other` roles stay unjudged.
 * @param {string} kind @param {{ role: string, npc: ReaderNpc | undefined }} a @param {{ role: string, npc: ReaderNpc | undefined }} b @param {Set<string>} seat
 * @returns {{ fires: boolean|null, why: string }} null = not judged
 */
export function exemptedVerdict(kind, a, b, seat) {
  const ca = classOfRole(a.role); const cb = classOfRole(b.role);
  if (kind === 'Jurisdictional Tension') return { fires: !(holdsOffice(a.role) && holdsOffice(b.role)), why: 'two office-holders' };
  if (ca === 'other' || cb === 'other') return { fires: null, why: '' };
  if (kind === 'Professional Rivalry') {
    // Unit 12 (the chair's ruling): rivals for standing (two offices, noble and office, noble and
    // noble), one class, a shared trade or a shared market (merchant and trade read as the market).
    if (ca === cb) return { fires: false, why: 'same class' };
    if (['office', 'noble'].includes(ca) && ['office', 'noble'].includes(cb)) return { fires: false, why: 'rivals for standing' };
    if (['merchant', 'trade'].includes(ca) && ['merchant', 'trade'].includes(cb)) return { fires: false, why: 'a shared market' };
  } else if (classesShare(ca, cb)) return { fires: false, why: 'same class' };
  const fa = str(a.npc?.factionAffiliation); const fb = str(b.npc?.factionAffiliation);
  if (fa && fa === fb) return { fires: false, why: 'same faction' };
  if (fa && fb && seat.has(fa) && seat.has(fb)) return { fires: false, why: 'the seat\'s factions, one office' };
  if ((SEAT_ROLE.test(a.role) && seat.has(fb)) || (SEAT_ROLE.test(b.role) && seat.has(fa))) return { fires: false, why: 'seat and its body' };
  return { fires: true, why: '' };
}

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
const ENFORCEMENT_HOUSE = /watch|guard|garrison|barracks|militia|levy|citadel|mercenar|free company|hired blades|warden/i;
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
  const enforcement = houseNames(s).some((h) => ENFORCEMENT_HOUSE.test(h))
    || (Array.isArray(s?.npcs) ? s.npcs : []).some((/** @type {ReaderNpc} */ n) => ENFORCEMENT_ROLE.test(str(n?.role)));
  if (!enforcement) {
    const hit = lines.find((x) => GUARD_WORDS.test(x));
    if (hit) out.push({ surface: 'plot_hooks', quote: hit, detail: `[guard] "${str(hit.match(GUARD_WORDS)?.[0])}" with no enforcement body` });
  }
  if (!hasNavigableWater(s)) {
    const hit = lines.find((x) => SEA_HOOK_WORDS.test(x));
    if (hit) out.push({ surface: 'plot_hooks', quote: hit, detail: `[sea] "${str(hit.match(SEA_HOOK_WORDS)?.[0])}" at terrain ${terrainOf(s)}, route ${routeOf(s)}` });
  }
  return out;
}

// ──────────────────────────── 6. traditions-water ────────────────────────────

/** Water by terrain, the chair's reading: coastal, riverside or lake. */
const WATER_TERRAIN = /coast|river|lake/i;
const WATER_TRADITION = /\b(?:Tide|Landfall|Landing|Sea|Harbou?r|Fleet)\b/;
const NO_WATER_ROUTE = /^(?!port$|river$)/;

/**
 * A Traditions-tab tradition keyed on Tide, Landfall, Landing, Sea, Harbour or Fleet in a place
 * without water access: route road / overland / isolated / none and terrain not coastal,
 * riverside or lake.
 * @param {ReaderRecord} s @param {Readonly<Record<string,string>>} surfaces
 */
export function traditionsWaterFindings(s, surfaces) {
  if (!NO_WATER_ROUTE.test(routeOf(s)) || WATER_TERRAIN.test(terrainOf(s))) return [];
  const hit = linesOf(surfaces.traditions).find((x) => WATER_TRADITION.test(x));
  return hit ? [{ surface: 'traditions', quote: hit, detail: `terrain ${terrainOf(s)}, route ${routeOf(s) || 'none'}` }] : [];
}

// ──────────────────────────── 7. tonight-wants ────────────────────────────

/**
 * On the Tonight sheet, "Wants to" followed by a capitalised word — a sentence, not a want
 * ("Wants to Was approached…", "Wants to The supplies…"). A want's verb is lower-case.
 * @param {ReaderRecord} _s @param {Readonly<Record<string,string>>} surfaces
 */
export function tonightWantsFindings(_s, surfaces) {
  const hits = linesOf(surfaces.tonight).filter((x) => /\bWants to [A-Z]/.test(x));
  return hits.length ? [{ surface: 'tonight', quote: hits[0], detail: `${hits.length} lines; starts "${str(hits[0].match(/\bWants to ([A-Z][\w'’]*)/)?.[1])}"` }] : [];
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
const WATCH_HOUSE = /watch|guard|garrison/i;

/**
 * The Daily Life placeholder line where it names what the place lacks — ONCE per settlement
 * (the chair's ruling, 2026-11-04): it counts when the line renders AND at least one sub-case
 * holds, and the detail names which: `[no-market]` (no market by the engine's predicate,
 * `viability.js :: hasMarketInstitution`; a Periodic market is a market, the chair's ruling on
 * soak1k-313), `[no-watch]` (no watch, guard or garrison house), or both. How many pages carry
 * the line at all is a distribution (`readerDistributions :: dailyLifeLine`), not a finding.
 * @param {ReaderRecord} s @param {Readonly<Record<string,string>>} surfaces
 */
export function dailyLifePlaceholderFindings(s, surfaces) {
  const hit = linesOf(surfaces.daily_life).find((x) => x.includes(PLACEHOLDER));
  if (!hit) return [];
  const lacks = [
    ...(!hasMarketInstitution(s?.institutions) ? ['no-market'] : []),
    ...(!houseNames(s).some((h) => WATCH_HOUSE.test(h)) ? ['no-watch'] : []),
  ];
  if (!lacks.length) return [];
  return [{ surface: 'daily_life', quote: hit, detail: `${lacks.map((x) => `[${x}]`).join('')} ${lacks.map((x) => x.replace('-', ' ')).join(', ')}` }];
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
