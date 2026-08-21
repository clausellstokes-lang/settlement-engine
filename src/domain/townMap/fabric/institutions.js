/**
 * domain/townMap/fabric/institutions.js — THE INSTITUTION GRAMMAR (§6, §161c, §161l,
 * §161n) plus the §165 atlas laws and the §167 affinity sampler.
 *
 * NOT 57 BESPOKE RULES — A TYPED GRAMMAR. Every institution category carries (a) a SHAPE
 * ARCHETYPE, (b) PLACEMENT AFFINITIES and adjacency constraints, (c) a PROMINENCE rule,
 * (d) a §161c SITING RING, and (e) a §161n SCALE LADDER. Every institution keeps its data
 * anchor — clickable, searchable — so the truth layer is never diluted.
 *
 * ⭐⭐ TOTALITY BY CONSTRUCTION (§6's totality law). The table keys on the LANDED
 * two-level taxonomy: the 12 real `priorityCategory` values measured at 6b337fb1
 * (economy 75 · government 57 · crafts 31 · military 30 · criminal 27 · infrastructure 26
 * · religion 18 · magic 13 · entertainment 13 · exotic 11 · adventuring 7 · defense 1),
 * refined by name rules. EVERY one has a row, and any future unlisted category renders
 * the default hall archetype — so a category with no archetype is IMPOSSIBLE, rather than
 * being a gap someone has to notice.
 *
 * ⭐ THE UNDERWORLD RULE, kept exactly: a criminal institution renders as ORDINARY FABRIC
 * on the default lens. A smugglers' front business looks like a shop, deliberately, and
 * lights only on the DM/hazard lens through the landed audienceProjection. The default
 * lens must never be the thing that gives it away.
 *
 * ⭐⭐ THE ATLAS IS THE AUTHORITY (§174), AND IT OUTRANKS `priorityCategory`.
 * `src/data/institutionAtlas.js` carries all 276 catalog entries with their family, ring,
 * dispersion, variant count, founding disposition and adjacency-edge counts. Placement
 * reads it FIRST. That is not a preference — 42 craft and commerce entries are MIS-KEYED
 * 'government' in the catalog at head, so a fabric that placed from `priorityCategory`
 * would site the TANNERY AT THE CIVIC CORE, beside the town hall, on every map forever.
 * The upstream cure is chartered separately; this fabric is immune from birth because the
 * precedence below puts `priorityCategory` LAST and records when it was used at all.
 *
 * ⭐ THE NON-BUILDING CLASS (§174.3). Sixty transcribed entries are not architecture:
 * household elders, access-to-external-services, land use, distributed networks, the wall
 * circuit itself, the residential matrix. They render NOTHING, or a truth-layer service
 * marker — never an invented building. Rendering `Household elder` as a civic hall would
 * give a 27-soul thorp a town hall.
 *
 * ⭐ RUNGS ARE CITED, NOT INVENTED (§174.4). `src/data/institutionLadders.js` already
 * carries the landed ladder — UPGRADE_CHAINS (43 pairs, "the greater replaces the lesser")
 * plus SUBSUMPTION_RULES — and it is the rung source wherever it defines one. The
 * archetype ladders below are the FALLBACK for archetypes the landed chains do not
 * name, and each one is marked as such.
 *
 * PURITY: no Date, no Math.random, no runtime trig, no localeCompare.
 */

import { hashUnit, hashInt } from './fabricRng.js';
import { institutionKey, instanceKey, compareKeys } from './lineage.js';
import { atlasRow } from '../../../data/institutionAtlas.js';
import { UPGRADE_CHAINS } from '../../../data/institutionLadders.js';

/**
 * THE SITING RINGS (§161c) — an institution's INSIDE/OUTSIDE disposition, derived from
 * FUNCTION, never from whim. "Some belong beyond the settlement's main fabric, and the
 * map must say so."
 *
 *  intramural       the core's own: temple, hall, market, inns, crafts
 *  edge             the fringe by necessity: noxious trades downwind and downstream,
 *                   stockyards, the poorest fabric
 *  extramural-near  just outside the gates because custom or prudence pushed them out:
 *                   the fairground, the mustering green, kilns and brickworks (FIRE), the
 *                   lazaretto at its careful distance, the gallows at the crossroad,
 *                   burial grounds where the culture profile places them
 *  outlying         apart by function or resource, reached by their own lane: the mill AT
 *                   its water or wind-height, mine adits and quarries AT their stone, the
 *                   monastery apart BY DESIGN, the watchtower on the height, the ferry
 *                   landing, the roadside inn at the junction
 *
 * ⭐ THE CONSEQUENCE IS THAT THE COUNTRYSIDE STOPS BEING DRESSING: it gains TRUE OUTLYING
 * ANCHORS, every one clickable and searchable like the town's own, and their lanes join
 * the road web. An outlying institution strong enough can even become a §5.-1 SECOND
 * NUCLEUS — the abbey the town later grew toward, historically common and now
 * mechanically possible.
 * @type {ReadonlyArray<'intramural'|'edge'|'extramural-near'|'outlying'>}
 */
export const SITING_RINGS = Object.freeze(['intramural', 'edge', 'extramural-near', 'outlying']);

/**
 * ARCHETYPE ROWS. `ring` is the §161c default; `rungs` is the §161n SCALE LADDER;
 * `variants` is the §165.1 seeded-variant count; `clustered` is the §165.3 dispersion
 * class; `power` marks the archetypes a ruling faction's identity can amplify (§161l).
 *
 * ⭐ §161n THE INSTITUTION-SCALE LAW: "a village's port is not a metropolis's port."
 * Each rung is A REAL COMPOSITION, not a scaled sprite — the harbour district has MORE
 * PIERS, not bigger ones. That distinction is why the ladder lives in the fabric layer
 * rather than in the landed silhouette vocabulary, whose `SILHOUETTE_BY_KIND` maps each
 * kind to ONE frozen part list with a single scalar `foot`: raising `foot` renders a
 * bigger sprite, which is exactly what the law forbids.
 *
 * ⛔ AND THE RUNG IS A FUNCTION OF THE HIGH-WATER CONTEXT, NOT THE CURRENT POPULATION.
 * §161g's demotion grammar deliberately does NOT recompute it downward: the cathedral
 * built for a city stands over-scale in the town that remains, and that oversized
 * survivor is the single most legible demotion tell on the whole map. This is the one
 * place in the family where "same facts, same output" is deliberately relaxed to "same
 * HISTORY, same output".
 * @type {Readonly<Record<string, any>>}
 */
export const ARCHETYPES = Object.freeze({
  worship:   { ring: 'intramural', rungs: ['wayside-shrine', 'chapel', 'parish-church', 'cathedral-precinct'], variants: 3, clustered: true,  power: 'religion',    weight: 1.85 },
  cloister:  { ring: 'outlying',   rungs: ['cell', 'priory', 'abbey-precinct'],                                 variants: 2, clustered: true,  power: 'religion',    weight: 1.80 },
  hall:      { ring: 'intramural', rungs: ['moot-house', 'guild-hall', 'town-hall', 'civic-precinct'],           variants: 3, clustered: true,  power: 'government',  weight: 1.95 },
  garrison:  { ring: 'intramural', rungs: ['watch-house', 'barracks-yard', 'citadel'],                           variants: 2, clustered: true,  power: 'military',    weight: 2.05 },
  market:    { ring: 'intramural', rungs: ['cross-and-green', 'stall-rows', 'covered-market', 'exchange'],       variants: 3, clustered: true,  power: 'economy',     weight: 1.60 },
  warehouse: { ring: 'intramural', rungs: ['store', 'warehouse-range', 'bonded-yards'],                          variants: 2, clustered: true,  power: 'economy',     weight: 1.55 },
  port:      { ring: 'intramural', rungs: ['jetty-and-shed', 'quay-with-warehouses', 'working-docks', 'harbour-district'], variants: 3, clustered: true, power: 'economy', weight: 1.70 },
  mill:      { ring: 'outlying',   rungs: ['hand-mill', 'water-mill', 'mill-range'],                             variants: 3, clustered: false, power: null,          weight: 1.25 },
  granary:   { ring: 'intramural', rungs: ['store-loft', 'granary', 'granary-range'],                            variants: 2, clustered: true,  power: 'economy',     weight: 1.45 },
  craft:     { ring: 'intramural', rungs: ['workshop', 'workshop-and-yard', 'craft-range'],                      variants: 4, clustered: false, power: null,          weight: 1.15 },
  noxious:   { ring: 'edge',       rungs: ['pit-and-shed', 'tannery-yard', 'trade-quarter'],                     variants: 3, clustered: true,  power: null,          weight: 1.10 },
  kiln:      { ring: 'extramural-near', rungs: ['clamp', 'kiln-yard', 'brickworks'],                             variants: 2, clustered: true,  power: null,          weight: 1.10 },
  hospitality:{ ring: 'intramural', rungs: ['alehouse', 'inn-with-yard', 'coaching-inn'],                        variants: 4, clustered: false, power: null,          weight: 1.30 },
  water:     { ring: 'intramural', rungs: ['well-head', 'cistern-yard', 'waterworks'],                           variants: 2, clustered: false, power: null,          weight: 1.05 },
  cloisterQuad:{ ring: 'intramural', rungs: ['school-room', 'cloister-quad', 'college'],                         variants: 2, clustered: true,  power: null,          weight: 1.80 },
  arcane:    { ring: 'intramural', rungs: ['study', 'tower', 'tower-and-quad'],                                  variants: 3, clustered: true,  power: 'magic',       weight: 1.70 },
  extraction:{ ring: 'outlying',   rungs: ['adit', 'workings', 'quarry-field'],                                  variants: 2, clustered: true,  power: null,          weight: 1.20 },
  fairground:{ ring: 'extramural-near', rungs: ['green', 'fairground', 'fair-precinct'],                         variants: 2, clustered: true,  power: null,          weight: 1.15 },
  playhouse: { ring: 'intramural', rungs: ['yard-stage', 'hall-and-stage', 'playhouse'],                         variants: 3, clustered: false, power: null,          weight: 1.30 },
  caravan:   { ring: 'extramural-near', rungs: ['picket', 'caravan-yard', 'caravanserai'],                       variants: 2, clustered: true,  power: 'economy',     weight: 1.45 },
  waystation:{ ring: 'outlying',   rungs: ['signpost-house', 'lodge-and-trophy-yard', 'chapter-house'],          variants: 3, clustered: false, power: null,          weight: 1.25 },
  wallwork:  { ring: 'intramural', rungs: ['tower', 'gatehouse', 'bastion'],                                     variants: 2, clustered: true,  power: 'military',    weight: 1.50 },
  ordinary:  { ring: 'intramural', rungs: ['shopfront'],                                                          variants: 4, clustered: false, power: null,          weight: 1.00 },
});

/**
 * ⭐ CATEGORY → ARCHETYPE, over the 12 REAL priorityCategory values. This is the totality
 * table's first level; the name rules below refine it. Note `criminal → ordinary`: the
 * underworld rule, applied at the table rather than remembered at the call site.
 * @type {Readonly<Record<string, string>>}
 */
export const CATEGORY_ARCHETYPE = Object.freeze({
  economy: 'market',
  government: 'hall',
  crafts: 'craft',
  military: 'garrison',
  criminal: 'ordinary',
  infrastructure: 'water',
  religion: 'worship',
  magic: 'arcane',
  entertainment: 'playhouse',
  exotic: 'caravan',
  adventuring: 'waystation',
  defense: 'wallwork',
});

/**
 * NAME RULES — the second level of the landed taxonomy, mirroring NAMED_GLYPH_RULES.
 * Anchored, ordered, and each one earns its place by naming a shape the category alone
 * cannot reach (a mill is not a generic craft workshop; a tannery is not a generic one
 * either, and putting it downwind is a truth obligation).
 * @type {ReadonlyArray<{ re: RegExp, archetype: string }>}
 */
export const NAME_RULES = Object.freeze([
  { re: /tanner|dyer|slaughter|knacker|charnel|midden|lime\s?kiln|smelt|fuller|glue|soap/i, archetype: 'noxious' },
  { re: /brick|pottery|kiln|glassworks|charcoal/i, archetype: 'kiln' },
  { re: /\bmill\b|watermill|windmill|millrace/i, archetype: 'mill' },
  { re: /granar|silo|grain\s?store|corn\s?store/i, archetype: 'granary' },
  { re: /dock|wharf|quay|harbou?r|pier|shipyard|boatyard|ferry/i, archetype: 'port' },
  { re: /warehouse|storehouse|depot|bond(ed)?\s?yard/i, archetype: 'warehouse' },
  { re: /caravanserai|caravan|camel|trade\s?post/i, archetype: 'caravan' },
  { re: /market|bazaar|stall|exchange|shambles/i, archetype: 'market' },
  { re: /\bfair(ground)?\b|muster|common\s?green/i, archetype: 'fairground' },
  { re: /inn\b|tavern|alehouse|lodging|hostel|brothel|public\s?house/i, archetype: 'hospitality' },
  { re: /temple|church|shrine|cathedral|chapel|sanctuar|basilica/i, archetype: 'worship' },
  { re: /monaster|abbey|priory|convent|hermitage|cloister/i, archetype: 'cloister' },
  { re: /librar|academy|school|univers|scriptor|college|lyceum/i, archetype: 'cloisterQuad' },
  { re: /tower|arcane|wizard|mage|alchem|conjur|astrolog/i, archetype: 'arcane' },
  { re: /mine|adit|quarry|pit\s?head|workings|dig/i, archetype: 'extraction' },
  { re: /wall|gate(house)?|bastion|rampart|watchtower/i, archetype: 'wallwork' },
  { re: /barrack|garrison|citadel|keep|armou?ry|drill/i, archetype: 'garrison' },
  { re: /hall|court|council|guildhall|chancer|mint|archive|prison|gaol|moot/i, archetype: 'hall' },
  { re: /well\b|bath|aqueduct|fountain|cistern|sewer|conduit/i, archetype: 'water' },
  { re: /theat|playhouse|arena|amphitheat|gambling|gaming|bear\s?pit/i, archetype: 'playhouse' },
  { re: /smith|forge|workshop|carpent|mason|weav|cooper|potter|bakehouse|baker|brewer/i, archetype: 'craft' },
]);

/**
 * ⚠ THE DISPERSION LAW (§165.3) — clustered or dispersed, with a historical warrant.
 *
 * CLUSTERED trades concentrated for real reasons: tanners share a watercourse and a
 * smell, goldsmiths share a guarded street, dyers share their vats. Those may FOUND a
 * district (§161l's founding rule).
 *
 * DISPERSED trades existed on every street because everyone needed them daily and their
 * catchment was a walk, not a city: bakers, taverns, smithies. They live in the
 * residential matrix ALL AROUND the settlement and MAY NOT auto-found a district — a
 * "bakers' quarter" derived from five bakeries would be a fabrication with a straight
 * face. The founding rule applies to clustered classes only.
 * @type {ReadonlyArray<RegExp>}
 */
export const DISPERSED_NAMES = Object.freeze([
  /\bbaker|bakehouse|bread/i,
  /\btavern|alehouse|inn\b|public\s?house/i,
  /\bsmith(y|ies)?\b|farrier/i,
  /\bbutcher|grocer|chandler|cobbler|tailor|barber/i,
  /\bwell\b|conduit|fountain/i,
]);

/** Names with an explicit clustering warrant, overriding the dispersed default. */
export const CLUSTERED_NAMES = Object.freeze([
  /tanner|dyer|fuller|smelt/i,
  /goldsmith|silversmith|jewel/i,
  /weaver|cloth|wool\s?hall/i,
]);

/**
 * ⚠ THE FANTASTICAL LAW (§165.4): fantasy entries obey the SAME functional derivations,
 * world-law gated. A dragon-post is a waystation; a mana-forge is a craft with an arcane
 * amplifier; a beast-market is a market. What makes them fantastical is their NAME and
 * their world-law gate, never a private geometry — so a setting that has no magic simply
 * renders fewer arcane amplifiers, and nothing else in the grammar changes.
 * @param {string} name @returns {boolean}
 */
export function isFantastical(name) {
  return /rune|arcane|mana|dragon|beast|spirit|fey|astral|planar|golem|elemental/i.test(String(name || ''));
}

/**
 * ⭐ THE ATLAS FAMILY → ARCHETYPE map. The atlas's 26 families are a placement vocabulary;
 * this projects them onto the shape archetypes above. Where a family has no distinct
 * shape it lands on the nearest one that does, and the projection is stated rather than
 * hidden — an atlas family is never silently dropped.
 * @type {Readonly<Record<string, string>>}
 */
export const FAMILY_ARCHETYPE = Object.freeze({
  WORSHIP: 'worship', LEARNING: 'cloisterQuad', ARCANE: 'arcane',
  CIVIC: 'hall', POLITY: 'hall', MARTIAL: 'garrison', CIRCUIT: 'wallwork',
  COMMERCE: 'market', FINANCE: 'hall', LUXURY: 'market', 'STREET-TRADE': 'craft',
  WATERFRONT: 'port', HEAVY: 'extraction', NOXIOUS: 'noxious', INFRA: 'water',
  HOSPITALITY: 'hospitality', VICE: 'playhouse', UNDERWORLD: 'ordinary',
  CARE: 'cloisterQuad', ADVENTURING: 'waystation', 'EXOTIC-GEO': 'caravan',
  EXOTIC: 'caravan', PERSON: 'ordinary', MATRIX: 'ordinary', GROUND: 'ordinary',
  'OFF-MAP': 'ordinary', ORDINARY: 'ordinary',
});

/**
 * Classify one institution. Totality: never returns undefined.
 *
 * ⛔ PRECEDENCE IS THE WHOLE POINT (§174.1):
 *   1. THE ATLAS, by exact catalog name — the authority.
 *   2. The NAME RULES — a derivation, for custom institutions the atlas cannot know.
 *   3. `priorityCategory` — LAST, and the `via` string says so, because 42 entries are
 *      mis-keyed at head and anything reached this way is suspect by construction.
 * @param {any} inst
 * @returns {{ archetype: string, via: string, ring: string|null, dispersion: string|null,
 *             nonBuilding: boolean, founds: boolean, variants: number|null,
 *             physical: number, logistical: number, atlas: boolean }}
 */
export function classify(inst) {
  const name = String((inst && inst.name) || '');
  const row = atlasRow(name);
  if (row) {
    const archetype = FAMILY_ARCHETYPE[row.family] || 'ordinary';
    return {
      archetype,
      via: `ATLAS family '${row.family}'`,
      ring: row.ring === 'I' ? 'intramural' : row.ring === 'E' ? 'edge'
        : row.ring === 'N' ? 'extramural-near' : row.ring === 'O' ? 'outlying'
          : row.ring === 'W' ? 'circuit' : null,
      dispersion: row.disp === 'D' ? 'dispersed' : row.disp === 'C' ? 'clustered'
        : row.disp === 'U' ? 'unique' : null,
      nonBuilding: row.nonBuilding,
      founds: row.founds,
      variants: row.variants,
      physical: row.physical,
      logistical: row.logistical,
      atlas: true,
    };
  }

  const catalogId = String((inst && inst.catalogId) || '');
  const probe = `${name} ${catalogId}`;
  for (const rule of NAME_RULES) {
    if (rule.re.test(probe)) {
      return withDefaults(rule.archetype, `name rule ${rule.re.source.slice(0, 28)} (NOT in the atlas — a derivation)`);
    }
  }
  const pri = String((inst && (inst.priorityCategory || inst.category)) || '').toLowerCase();
  const byCat = CATEGORY_ARCHETYPE[pri];
  if (byCat) {
    return withDefaults(byCat, `⚠ priorityCategory '${pri}' — LAST RESORT; 42 catalog entries are mis-keyed 'government' at head, so this route is suspect and is recorded`);
  }
  // THE FALLBACK THAT MAKES TOTALITY STRUCTURAL: an unlisted category renders the
  // default hall archetype and is RECORDED as having done so.
  return withDefaults('hall', `UNLISTED category '${pri || '(none)'}' — default hall archetype (totality fallback)`);
}

/** Fill the atlas-shaped fields from the archetype row when the atlas had no entry. */
function withDefaults(archetype, via) {
  const row = ARCHETYPES[archetype] || ARCHETYPES.ordinary;
  return {
    archetype,
    via,
    ring: row.ring,
    dispersion: row.clustered ? 'clustered' : 'dispersed',
    nonBuilding: false,
    founds: false,
    variants: row.variants,
    physical: 0,
    logistical: 0,
    atlas: false,
  };
}

/** Is this institution a DISPERSED class (§165.3)? The atlas answers where it can. */
export function isDispersed(inst) {
  const c = classify(inst);
  if (c.dispersion) return c.dispersion === 'dispersed';
  const probe = `${(inst && inst.name) || ''} ${(inst && inst.catalogId) || ''}`;
  for (const re of CLUSTERED_NAMES) if (re.test(probe)) return false;
  for (const re of DISPERSED_NAMES) if (re.test(probe)) return true;
  const row = ARCHETYPES[c.archetype];
  return row ? !row.clustered : true;
}

/**
 * ⭐ §174.4 — THE LANDED LADDER IS THE RUNG SOURCE. `UPGRADE_CHAINS` states, by name,
 * which institution is a scale tier of which other ("the greater replaces the lesser").
 * Where an entry appears in a chain, its rung is its POSITION IN THAT CHAIN, and the
 * archetype's own fallback ladder is not consulted. Building a second, hand-invented
 * chain beside a landed one is the five-homes defect.
 * @param {string} name @returns {{ index: number, of: number, chain: string[] } | null}
 */
export function landedRung(name) {
  const target = String(name || '');
  if (!target) return null;
  // Build the maximal chain through this name by following the pair edges both ways.
  const up = new Map();
  const down = new Map();
  for (const [lesser, greater] of UPGRADE_CHAINS) {
    if (!up.has(lesser)) up.set(lesser, greater);
    if (!down.has(greater)) down.set(greater, lesser);
  }
  if (!up.has(target) && !down.has(target)) return null;
  const chain = [target];
  let cur = target;
  const seenDown = new Set([target]);
  while (down.has(cur) && !seenDown.has(down.get(cur))) { cur = down.get(cur); seenDown.add(cur); chain.unshift(cur); }
  cur = target;
  const seenUp = new Set([target]);
  while (up.has(cur) && !seenUp.has(up.get(cur))) { cur = up.get(cur); seenUp.add(cur); chain.push(cur); }
  return { index: chain.indexOf(target), of: chain.length, chain };
}

/**
 * ⭐ §161n THE RUNG. A function of the HIGH-WATER context (never the current population)
 * × the institution's own weight in the dossier. The ladder is walked, not scaled.
 * @param {string} archetype @param {import('./tierGrammar.js').TierScale} scale
 * @param {number} instWeight 0..1 the institution's own importance
 * @returns {{ index: number, name: string, of: number }}
 */
export function scaleRung(archetype, scale, instWeight, name) {
  // ⭐ §174.4: the LANDED chain wins wherever it names this entry. Its rung is a FACT
  // about the catalog, not a derivation, so it needs no context term at all.
  const landed = landedRung(name);
  if (landed) {
    return { index: landed.index, name: `${landed.chain[landed.index]} (rung ${landed.index + 1}/${landed.of})`, of: landed.of, sourced: true };
  }
  const row = ARCHETYPES[archetype] || ARCHETYPES.ordinary;
  const rungs = row.rungs;
  // THE HIGH-WATER TIER, deliberately: §161g's outlived monument depends on it.
  const context = TIER_RANK[scale.extentTier] == null ? 0.4 : TIER_RANK[scale.extentTier];
  // The institution's own weight in the dossier buys about one rung either way — §161n's
  // "the settlement's population/tier × the institution's own weight".
  const t = context + (instWeight - 0.5) * 0.22;

  // ⭐⭐ §16.4 / §161n — THE LADDER IS TIER-ANCHORED WHERE THE CHARTER ANCHORS IT.
  //
  // ⛔⛔ THE DEFECT, MEASURED BEFORE THE CURE AND WORSE THAN IT LOOKED. MF-B2 spread the
  // rung as `floor((context × 0.72 + weight × 0.28) × rungs.length)`, and the reachable
  // set that produces is:
  //     thorp 0–1 of 4 · hamlet 0–1 · VILLAGE 0–1 · town 1–2 · city 2–3 · metropolis 2–3
  //     and on a THREE-rung ladder a TOWN can only ever be rung 1 — its own weight buys
  //     NOTHING at all, so the input is dead at that tier.
  // So a village's church could never be more than a CHAPEL, whatever its weight: rung 2 of
  // the worship ladder — "parish church with yard", the single most legible building in an
  // English village — was UNREACHABLE at four of the six tiers. §16.4 asks for exactly that
  // building, and no amount of tuning the constants could have produced it, because the
  // fault was the SHAPE of the mapping and not its coefficients.
  //
  // ⭐ THE CURE IS THE CHARTER'S OWN WORDING TAKEN LITERALLY. §161n gives its ladders BY
  // EXAMPLE against tiers ("worship = wayside shrine → chapel → parish church with yard →
  // cathedral precinct"), which is a statement about WHICH TIER EARNS WHICH RUNG — not
  // about an even division of a scalar. `rungAt` is that statement, per archetype: the tier
  // rank at which each rung is first earned. Where an archetype declares one, the ladder is
  // ANCHORED; where it does not, the smooth spread remains and the row SAYS SO
  // (`rungSource`), which is the estate's sourced-or-defaulted-with-rationale idiom.
  const at = RUNG_AT[archetype];
  if (at && at.length === rungs.length) {
    let index = 0;
    for (let k = 0; k < at.length; k++) if (t >= at[k]) index = k;
    return { index, name: rungs[index], of: rungs.length, sourced: false, rungSource: 'anchored' };
  }
  const idx = Math.max(0, Math.min(rungs.length - 1, Math.floor(Math.max(0, Math.min(0.999, t)) * rungs.length)));
  return { index: idx, name: rungs[idx], of: rungs.length, sourced: false, rungSource: 'spread' };
}

/**
 * THE TIER RANK — where each tier sits on the §161n ladder scale.
 * ⚠ RE-SPACED AT MF-B3 alongside `RUNG_AT`: the old row put a village at 0.28 of the scale,
 * which is where a hamlet belongs. A village is the tier at which the parish church, the
 * water mill and the inn all appear, and the scale has to say so for `rungAt` to mean
 * anything. ⚠ UNSOAKED; rides the tuning signature.
 * @type {Readonly<Record<string, number>>}
 */
export const TIER_RANK = Object.freeze({
  thorp: 0.06, hamlet: 0.22, village: 0.45, town: 0.68, city: 0.86, metropolis: 1,
});

/**
 * ⭐⭐ §161n's LADDERS, TIER-ANCHORED — the tier rank at which each rung is first earned.
 * Every row is a reading of the charter's own example ladder against §5's tier table:
 *   • worship — §5 gives the village "church, mill, inn, smithy LEGIBLE", so the parish
 *     church lands AT village; the cathedral precinct is a city's building.
 *   • market — §5 gives the village "green or market cross" in terms, the town "market
 *     square", the city "squares plural"; so the cross holds to town and the exchange is
 *     the metropolis's.
 *   • hall — a village has a moot house, a town its guild hall, a city its town hall.
 *   • mill — the water mill is the village's defining outlying building and a hamlet with
 *     a mill has a water mill; only a town supports a mill RANGE.
 *   • hospitality — the inn with its yard is a village building (the coaching inn wants a
 *     road worth coaching on, which is a town's).
 *   • port / garrison / water — the same reading against §5's own columns.
 * An archetype absent from this table keeps the smooth spread and declares it.
 * ⚠ UNSOAKED; rides the tuning signature.
 * @type {Readonly<Record<string, number[]>>}
 */
export const RUNG_AT = Object.freeze({
  worship:     [0, 0.20, 0.42, 0.82],
  market:      [0, 0.50, 0.72, 0.94],
  hall:        [0, 0.50, 0.72, 0.94],
  mill:        [0, 0.20, 0.80],
  hospitality: [0, 0.40, 0.76],
  port:        [0, 0.44, 0.72, 0.93],
  garrison:    [0, 0.56, 0.86],
  water:       [0, 0.62, 0.90],
  granary:     [0, 0.46, 0.80],
  craft:       [0, 0.44, 0.80],
  warehouse:   [0, 0.52, 0.84],
  cloister:    [0, 0.42, 0.84],
});

/**
 * ⚠ §165.1 THE VARIANT LAW — landmark-capable entries carry 2–4 seeded shape variants,
 * picked PER INSTANCE and INERTIA-STABLE. Two forges in one city never render identical,
 * and the same forge renders identically in every year that has it, because the pick is
 * a hash of the INSTANCE KEY and nothing else.
 * @param {string} archetype @param {string} instKey @returns {number}
 */
export function shapeVariant(archetype, instKey, atlasVariants) {
  const row = ARCHETYPES[archetype] || ARCHETYPES.ordinary;
  const n = Number.isFinite(atlasVariants) && atlasVariants > 0 ? atlasVariants : row.variants;
  // ⭐ ORDINAL-STABLE UNDER N-DRIFT (§175.5). The pick hashes the INSTANCE KEY — which
  // carries the ordinal and nothing about how many siblings exist — so growing the roster
  // from three forges to five leaves the first three rendering exactly as they did.
  return hashInt(`${instKey}|variant`, 0, Math.max(1, n) - 1);
}

/**
 * ⚠ §165.2 THE SUCCESS LAW — every INSTANCE carries its own prosperity expression: the
 * thriving forge larger with a busy yard, the struggling one small and bare.
 *
 * Dossier-derived where the institution records its own condition; otherwise seeded
 * WITHIN THE SETTLEMENT'S BAND, so a poor town's best forge is still a poor town's forge.
 * That banding is what stops the law degenerating into decorative noise.
 * @param {any} inst @param {string} instKey @param {number} prosperityRank 0..5
 * @returns {{ success: number, band: string, sourced: boolean }}
 */
export function instanceSuccess(inst, instKey, prosperityRank) {
  const stated = inst && (inst.condition || inst.status || inst.prosperity);
  if (typeof stated === 'string' && stated) {
    const s = stated.toLowerCase();
    const v = /thriv|boom|busy|rich|renown/.test(s) ? 0.88
      : /fail|struggl|declin|derelict|shutter|abandon/.test(s) ? 0.16
        : 0.5;
    return { success: v, band: s, sourced: true };
  }
  // The settlement's own band: centre on its prosperity, spread half a band each way.
  const centre = 0.12 + prosperityRank * 0.155;
  const spread = 0.17;
  const v = Math.max(0.04, Math.min(0.96, centre + (hashUnit(`${instKey}|success`) - 0.5) * 2 * spread));
  return { success: v, band: 'seeded within the settlement band', sourced: false };
}

/**
 * ⭐ §161l THE SPECIFIC-POWER LAW — not just THAT power rules, but WHICH power rules.
 *
 * "The dossier's own sentence — 'ruled by a council, real power with the Merchant Guilds'
 * — must be READABLE IN THE DRAWING: the exchange out-scaling the hall it nominally
 * answers to." The ruling power's SEAT anchors its district; ALLIED institutions cluster
 * toward the seat and share its prominence; RIVALS sit distant, diminished, or
 * ordinary-by-day.
 *
 * ⛔ MEASURED LIMIT, stated rather than papered over: THERE IS NO FACTION→INSTITUTION
 * EDGE at head. `controlledBy` exists only on the custom-content shape and holds what
 * that file itself calls "likely faction ARCHETYPE". So alignment derives at ARCHETYPE
 * level through the faction's own category, not at instance level — a CLASS, not a set.
 * ⭐ The real-vs-formal split, however, IS fully derivable, and it is the law's best
 * line: the formal ruler and the strongest faction are separate reads, and when they
 * disagree the map says so by out-scaling the informal power's seat.
 *
 * @param {any} settlement
 * @returns {{ formal: string|null, real: string|null, split: boolean, allied: Set<string>, rival: Set<string>, reason: string }}
 */
export function powerWeb(settlement) {
  const ps = (settlement && settlement.powerStructure) || {};
  const factions = Array.isArray(ps.factions) ? ps.factions.slice() : [];
  factions.sort((a, b) => (Number(b && b.power) || 0) - (Number(a && a.power) || 0)
    || compareKeys(String((a && a.name) || ''), String((b && b.name) || '')));

  const formalName = typeof ps.governingFactionName === 'string' ? ps.governingFactionName
    : typeof ps.governingName === 'string' ? ps.governingName : null;
  const strongest = factions[0] || null;
  const realName = strongest ? String(strongest.name || strongest.archetype || '') : null;

  const catOf = (f) => String((f && (f.category || f.archetype)) || '').toLowerCase();
  const allied = new Set();
  const rival = new Set();
  if (strongest) allied.add(catOf(strongest));
  // The formal ruler is allied when it IS the strongest, and a RIVAL when it is not —
  // which is precisely the split the law wants legible.
  const formalFaction = factions.find((f) => String((f && f.name) || '') === formalName) || null;
  const split = !!(formalFaction && strongest && formalFaction !== strongest);
  if (formalFaction) (split ? rival : allied).add(catOf(formalFaction));
  for (const f of factions.slice(1)) {
    const c = catOf(f);
    if (!allied.has(c)) rival.add(c);
  }

  return {
    formal: formalName,
    real: realName,
    split,
    allied,
    rival,
    reason: split
      ? `formal authority '${formalName}' is out-powered by '${realName}' — the informal power's seat out-scales the hall it nominally answers to`
      : `authority and power agree (${formalName || realName || 'unrecorded'}) — one seat, one skyline`,
  };
}

/**
 * @typedef {Object} Landmark
 * @property {string} anchorKey     the LANDED anchor (one clickable identity)
 * @property {string} identityKey   the fabric's own identity key (address-independent)
 * @property {string} instanceKey   this BODY's key (N bodies, one identity)
 * @property {string} name
 * @property {string} archetype
 * @property {string} ring
 * @property {number} rung
 * @property {string} rungName
 * @property {number} variant
 * @property {number} success
 * @property {boolean} monumental
 * @property {boolean} prominent
 * @property {boolean} dispersed
 * @property {boolean} fantastical
 * @property {number} x
 * @property {number} y
 * @property {number} size
 * @property {number} rot
 * @property {string} districtId
 * @property {string} via
 */

/**
 * Build the landmark records for a settlement's institutions.
 *
 * ⭐ THE MONUMENTAL BUDGET (§5's Landmarks column, read correctly per MF-A2) is a
 * SILHOUETTE budget, never an institution cap. The engine emits 8 institutions for a
 * 27-soul thorp and 40+ for a city; §8.1 (truth > tier) says every one keeps its anchor.
 * So the surplus is DEMOTED TO ORDINARY FABRIC — house-shaped, house-toned, still
 * searchable and still clickable — rather than dropped. The map never drops a truth
 * anchor to satisfy a tier prior.
 *
 * @param {Object} args @returns {Landmark[]}
 */
export function buildLandmarks(args) {
  const { institutions, anchorFor, placements, tierScale: scale, prosperityRank, power, seeding } = args;
  // ⭐⭐⭐ THE SILHOUETTE IS MEASURED IN PLOT FRONTAGES, AND UNTIL NOW IT WAS MEASURED IN
  // NOTHING AT ALL — which is the largest single defect MF-B2 found in inherited code.
  //
  // ⛔ MEASURED at this base: `size` was the archetype's relative WEIGHT (1.0–2.05) used
  // DIRECTLY as a view-unit dimension by the lens (`rect(x, y, s * 2.1, s * 1.15)`), so a
  // monumental HALL was drawn at **14 square view units against a median ordinary house of
  // 117** — the cathedral rendered at a TENTH THE AREA OF A COTTAGE. Every consequence
  // follows from that one missing multiplication: §9.1's ink hierarchy puts landmark
  // silhouettes second only to the wall and they were invisible; §161n's scale ladder
  // climbed rungs no one could see; and §15.3's compound reservation, when it arrived,
  // reserved discs 2–3 units across on a leaf whose plots are 9.
  //
  // ⭐ THE CLASS, and it is the ink pass's own lesson arriving in a second place: A
  // DIMENSIONLESS WEIGHT USED AS A DIMENSION IS AN ORDER-OF-MAGNITUDE BUG THAT LOOKS LIKE A
  // STYLE CHOICE. MF-B1b caught it for stroke widths ("ink weight was an order out") and
  // cured it by expressing the whole ink scale in PLOT FRONTAGES. The same cure applies
  // here for exactly the same reason: the module the town was laid out in is the module its
  // buildings are drawn in.
  //
  // SIZE_MODULE is set so a hall (weight 1.95) comes out about two frontages across, which
  // is what a moot hall was; a cathedral precinct (worship 1.85 at a high rung with a
  // prominent faction) reaches four to five. ⚠ UNSOAKED; rides the tuning signature.
  const frontage = Number.isFinite(args.frontage) && args.frontage > 0 ? args.frontage : 9;
  /** @type {Landmark[]} */ const out = [];

  /** @type {Array<{ name: string, class: string, via: string }>} */ const nonBuilding = [];
  const ordered = institutions.slice().sort((a, b) => compareKeys(anchorFor(a), anchorFor(b)));
  for (const inst of ordered) {
    const c = classify(inst);
    const row = ARCHETYPES[c.archetype] || ARCHETYPES.ordinary;
    const identity = institutionKey(inst);
    const anchorKey = anchorFor(inst);

    // ⛔ §174.3 THE NON-BUILDING CLASS. These entries are not architecture. They keep
    // their truth anchor (search still finds them) and render NOTHING here — the wall
    // circuit is drawn by the wall member, the matrix IS the fabric, land use is drawn
    // by the ground dress, an off-map service is an exit-road affordance, and a village
    // headman is a house with a person in it. Inventing a building for any of them would
    // contradict the dossier's own text.
    if (c.nonBuilding) {
      nonBuilding.push({ name: String(inst.name || ''), class: c.via, via: 'NON-BUILDING — anchor kept, no silhouette drawn' });
      continue;
    }

    // Multiplicity: one catalog record can be N bodies ('Bakers (5-15)'). All N share the
    // single anchor — N glyphs, ONE clickable identity, no phantom anchors.
    const bodies = multiplicityBodies(inst, scale);
    for (let b = 0; b < bodies; b++) {
      const ik = instanceKey(identity, b);
      const success = instanceSuccess(inst, ik, prosperityRank);
      const alignedCat = row.power;
      const prominent = !!(alignedCat && power.allied.has(alignedCat));
      const diminished = !!(alignedCat && power.rival.has(alignedCat));
      const rung = scaleRung(c.archetype, scale, success.success, inst.name);

      out.push({
        anchorKey,
        identityKey: identity,
        instanceKey: ik,
        name: String(inst.name || ''),
        archetype: c.archetype,
        ring: c.ring || row.ring,
        rung: rung.index,
        rungName: rung.name,
        rungSourced: rung.sourced,
        // ⭐ §165.1 / §175.5: the variant is a COMPONENT ARRANGEMENT within the entry's
        // own spec — zero new glyph kinds — and it is ORDINAL-STABLE under N-drift,
        // because the pick hashes the instance ordinal and nothing about the roster size.
        variant: shapeVariant(c.archetype, ik, c.variants),
        success: success.success,
        monumental: false,                       // decided by the budget pass below
        prominent,
        dispersed: c.dispersion ? c.dispersion === 'dispersed' : isDispersed(inst),
        founds: c.founds,
        fantastical: isFantastical(inst.name),
        x: 0, y: 0,                              // filled by the SEATING pass
        size: row.weight * (0.80 + success.success * 0.44) * (prominent ? 1.26 : diminished ? 0.84 : 1)
          * frontage * SIZE_MODULE,
        rot: Math.floor(hashUnit(`${ik}|rot`) * 1024),
        districtId: String((placements && placements.get(anchorKey)) || ''),
        atlasSourced: c.atlas,
        via: c.via,
      });
    }
  }
  out.nonBuilding = nonBuilding;

  // ── THE SILHOUETTE BUDGET. Rank by drawn weight, then by key for a total order.
  const ranked = out.slice().sort((a, b) => (b.size - a.size) || compareKeys(a.instanceKey, b.instanceKey));
  for (let i = 0; i < ranked.length; i++) ranked[i].monumental = i < scale.monumentalBudget;
  void seeding;
  return out;
}

/**
 * View units of drawn silhouette per unit of archetype weight, per PLOT FRONTAGE.
 * See the note in buildLandmarks for the order-of-magnitude defect this constant fixes.
 */
export const SIZE_MODULE = 0.50;

/**
 * How many BODIES one institution record renders as. The catalog idiom is a NAME —
 * 'Bakers (5-15)' is one record with one anchor — so the count is parsed from the name's
 * own band where it states one, and otherwise is 1.
 * @param {any} inst @param {import('./tierGrammar.js').TierScale} scale @returns {number}
 */
export function multiplicityBodies(inst, scale) {
  const m = /\((\d+)\s*[-–]\s*(\d+)\)/.exec(String((inst && inst.name) || ''));
  if (!m) return 1;
  const lo = Number(m[1]), hi = Number(m[2]);
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi < lo) return 1;
  // Within the band by the settlement's own scale — a village's "Bakers (5-15)" is five
  // bakers, a metropolis's is fifteen. Continuous (§161f), never quantized to the tier.
  const TIER_T = { thorp: 0, hamlet: 0.1, village: 0.25, town: 0.5, city: 0.78, metropolis: 1 };
  const t = TIER_T[scale.tier] == null ? 0.4 : TIER_T[scale.tier];
  // ⭐ CAPPED FOR THE DRAWING, not for the truth: the anchor still names the whole band,
  // and the cartouche's representativeness ratio already tells the reader the fabric is
  // representative above village. Rendering fifteen identical bakeries would spend the
  // op budget on a fact the dossier states better in one line.
  return Math.max(1, Math.min(6, Math.round(lo + (hi - lo) * t)));
}
