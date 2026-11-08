/**
 * scripts/audit/soak-review/checks.mjs — the per-settlement battery ("each in depth").
 *
 * One call, `reviewSettlement`, over the record and its rendered surfaces, returning findings
 * `{ check, surface, quote, detail }`. Four families, each named so the report can count it:
 *
 *   cert:*   the certification soak's own receipts (`generation-certification-soak.mjs ::
 *            inspectSettlement`: unresolved receipt, broken reference, conservation, non-finite).
 *   coh:*    the seven coherence instruments behind `src/domain/coherence/coherenceBattery.js ::
 *            coherenceBattery`, over every rendered surface; and two record checks of this
 *            module's own, `coh:roster-duplicate-secret` / `-goal` (`rosterDuplicate`).
 *   X-nn:*   the owner's experience rulings (docs/UX_CONSOLIDATION_2026-10-30.md X-46..X-52).
 *   reader:* the READER battery (`src/domain/coherence/readerBattery.js :: readerBattery`): the
 *            plausibility observations a DM makes reading end to end — validators and pools that
 *            never consult the record (the owner, 2026-11-04: "Add these kinds of observations to
 *            your 1000+ runs as well"). One kind, 9; counted in a table of their own, outside the
 *            stop rule, until the READER WINDOW lands (aggregate.mjs).
 *   A-nn:*   the coherence audit's numbered failure items (docs/GENERATION_COHERENCE_AUDIT_2026-11-02.md
 *            §2, items 1-15, as observed in its eighteen hand readings), each turned into a check
 *            where a machine can read it. The items no machine reads honestly are listed in
 *            `CHAIR_READINGS` and left to the chair's sample read.
 *
 * Every check maps to one of the root-cause doc's eight failure kinds
 * (docs/GENERATION_ROOT_CAUSES_2026-11-02.md, appendix: 1 food, 2 faith, 3 magic, 4 defence,
 * 5 rulers, 6 repetition, 7 unnamed, 8 small places as towns) or to none (`KIND_OF`), which the
 * stop rule reads. Kind 9 (reader) is the READER battery's, which the stop rule does not read.
 * Kind 10 (crisis; lane F12, rung 2, 2026-11-04) is a contradiction the stop rule reads: a calm
 * sentence printed under an active crisis it denies (`coh:crisis-blind-prose`).
 */
import { inspectSettlement } from '../generation-certification-soak.mjs';
import { normalizeRenderedSentence } from '../phrase-repetition.mjs';
import { coherenceBattery } from '../../../src/domain/coherence/coherenceBattery.js';
import { isDefenceClaim } from './defenceReach.mjs';
import { magicWorksAt } from '../../../src/domain/worldPulse/magicWorksAt.js';
import { institutionCatalogMagicLicence } from '../../../src/domain/arcaneInstitutionIdentity.js';
import { hasMarketInstitution } from '../../../src/domain/facts/market.js';
import { READER_BATTERY_CHECKS, readerBattery } from '../../../src/domain/coherence/readerBattery.js';
import { crisisEntries } from '../../../src/domain/facts/crisisKind.js';
import { storesMonthsOf } from '../../../src/domain/facts/storesMonths.js';
import { allegianceOf, criminalHousesOf, criminalPowersOf } from '../../../src/domain/people/allegiance.js';
import { famineOf } from '../../../src/domain/facts/famine.js';
import { terrainClassOf, tradeRouteOf } from '../../../src/domain/facts/terrain.js';
import { waterAccessKind } from '../../../src/domain/tradeRouteSemantics.js';
import { PATTERN_DENIES_ORGANISATION } from '../../../src/domain/display/defenseDisplay.js';

/** The owner's bands (X-46, docs/UX_CONSOLIDATION_2026-10-30.md; car 1 is parked, not on this tip). */
export const OWNER_BANDS = Object.freeze({
  thorp: [5, 30], hamlet: [20, 100], village: [75, 400], town: [300, 2500], city: [2000, 15000], metropolis: [15000, Infinity],
});

/** Root-cause kind of each check (0 = none of the eight; -2 = informational tally, outside the stop rule). */
export const KIND_OF = Object.freeze({
  'coh:food-words': 1, 'coh:grade-vs-food': 1, 'coh:hook-truth-page': 1, 'X-49:stores-not-once': 1, 'X-52:endurance-not-once': 1, 'X-52:endurance-disagrees': 1, 'A-01:starving-fed': 1,
  'coh:faith-denial': 2,
  'coh:magic-words': 3, 'coh:magic-absent-prose': 3, 'A-04:dragon-magic-off': 3, 'A-04:alchemist-magic-off': 3,
  'coh:defense-words': 4, 'A-05:hospital-absent': 4, 'A-05:arena-absent': 4,
  'coh:seat-holder': 5, 'A-08:hidden-ruler-note': 5,
  'X-50:boilerplate-twice': 6, 'A-09:behaviour-line-share': 6,
  'A-10:role-only-npc': 7, 'A-10:placeholder-faction': 7, 'A-03:tonight-they': 7,
  // REVIEW-INTAKE-3 R10: two people of one roster carrying one secret or one goal is a
  // contradiction about WHO (the chair: a contradiction kind the stop rule reads, not repetition
  // 6); keyed with the people family, 7.
  'coh:roster-duplicate-secret': 7, 'coh:roster-duplicate-goal': 7,
  // ALLEGIANCE-CAR1 (2026-11-08; the allegiance design I-2, I-3): a hidden allegiance whose handler is missing, off the
  // roster, itself, an agent, or no criminal face — a contradiction about WHO, keyed with the people family.
  'coh:allegiance-handler': 7,
  // ALLEGIANCE-CAR2 (2026-11-08; the allegiance design I-1, J-13): a hall read 'capture' or 'corrupted' with no agent in
  // the ruling three and no criminal governing power (or a 'capture' hall whose lord is no agent) — the strengths-only
  // state the derivation retired. A certification failure: STOP from the first.
  'coh:capture-without-agent': -1,
  'A-05:lacks-access-lines': -2,
  // CENSUS-1b wave 1 (2026-11-04): the runtime self-check (`facts/presumptionCheck.js`) — a drawn
  // line's declared atom the FINAL record contradicts. A certification failure: STOP from the
  // first declared pool (the chair's ruling 5).
  'cert:false-presumption': -1,
  // I2: the advisory battery judgment's verdict — "records the battery would not vouch for" — informational.
  'info:battery-would-not-vouch': -2,
  // F9 (2026-11-04): crime denied beside a listed operation, A-06 in reverse; A-06's own kind
  // (unlisted, so 0, the stop rule's wording kind) — stated, not defaulted.
  'coh:crime-denied-and-listed': 0,
  // Kind 10, crisis (lane RUNG2-F13, 2026-11-04; the chair's CONTRADICTION kinds of rung 2 §3c, shared
  // with lane F12's calm-prose check): a crisis fact the page contradicts. Inside the stop rule.
  // MERGE-R2: 'coh:migration-direction' has TWO producers, one kind — WIRING-W0's surface reader
  // (migrationDirectionFindings below, R-W7 e: arrivals on one surface and departures on another; the
  // chair's referee) and F13's crisis-fact reader (domain/coherence/crisisFactFindings.js). W0 keyed it
  // 0 (the wording kind) and F13 10 (inside the stop rule); a contradiction, so 10 is kept.
  'coh:famine-stores': 10, 'coh:migration-direction': 10, 'coh:crisis-cast-sense': 10,
  'coh:tier-noun': 8, 'A-14:guild-power-small': 8, 'A-14:lord-mayor-small': 8,
  // Kind 9, reader (lane READER-INSTRUMENTS, 2026-11-04): outside the stop rule until the READER WINDOW lands.
  ...Object.fromEntries(READER_BATTERY_CHECKS.map((c) => [`reader:${c}`, 9])),
  // Kind 10, crisis (lane F12, rung 2, 2026-11-04): a calm line under the crisis it denies; a contradiction, read by the stop rule.
  'coh:crisis-blind-prose': 10,
});

/** Kind 9: the READER battery's plausibility observations (aggregate.mjs counts them apart). */
export const READER_KIND = 9;
/** @param {string} check */
export const isReaderCheck = (check) => String(check).startsWith('reader:');

/** Audit items no machine reads honestly here; the chair's sample read carries them. */
export const CHAIR_READINGS = Object.freeze([
  'A-02 beyond the denial phrases: a Faith tab that names no god while the record has a High Priest (judged prose)',
  'A-03 "a weaker hook than the active crisis" (a judgment of strength)',
  'A-05 "X exists but lacks access to Y" lines that contradict the Institutions tab (needs a catalogue of goods-to-houses)',
  'A-06 crime organised, petty and absent at once (counted here only as the bare phrase pair; the reading is the chair\'s)',
  'A-11 culture only skin deep: generic medieval institutions under a non-European culture (judged)',
  'A-13 what the generator knows and does not show (ruled case by case: X-47 struck places, X-48 struck looks)',
  'A-15 people filed under a faction of another kind; relationship lines that ignore rank (needs a role-to-archetype table)',
  'the audit\'s "reads as one place" verdict itself',
]);

const SENTENCE_SPLIT = /(?<=[.!?])\s+(?=[A-Z"“‘'(])|\n+/;
/** @param {string} text */
export const sentencesOf = (text) => String(text || '').split(SENTENCE_SPLIT).map((x) => x.trim()).filter(Boolean);

const SEA_WORDS = /\b(?:harbou?r|fish(?:ing|ermen|erman|monger)?s?|fish market|ship(?:s|wright|yard|ping)?|docks?|wharf|wharves|quays?|fleet|sailors?|boats?)\b/i;

/**
 * Fish the catalog designs for an inland place (chair ruling 4a/4c, 2026-11-04; round 3, 3a/3c):
 * the salted, salt-cured, dried, smoked or pickled trade, the Fish market's and the Fishmonger's
 * own names (the catalogue designs both inland: "the week's salted barrels"; "inland, dried or
 * salted"), and — where the record itself imports fish
 * (`resourceAnalysis.imports.critical`) — the bare "Fish" item of a goods list. Licensed text is
 * removed before the sea words are read.
 */
const INLAND_FISH = /\b(?:preserved|salted|salt-cured|salt|dried|smoked|pickled)[ -]fish\b|\bfish market\b|\bfishmonger\b/gi;
const LISTED_FISH = /\bFish\b(?= [A-Z]|$)/g;
/** The cooper's reference line, "barrels for ale, wine, salted meat, and fish": what the barrels hold, not a
 *  catch landed here (the chair's ruling I6, 2026-11-04, on TERRAIN-POOLS' finding). */
const COOPER_BARRELS = /\bbarrels? for [^.]*\bfish\b/gi;
/** A disjunction naming the harbour as one route among others is no claim of one (round 4, 2). */
const ROUTE_DISJUNCTION = /\b(?:by )?(?:road|land|river) or (?:by )?(?:harbou?r|sea|port)\b/gi;
// Round 4, 4: the airship docks' own service texts ("between ship and shore", "harbour approaches").
// F5 ruling (1), 2026-11-04 (soak1k-377, -755): an airship city has shipwrights — the ship words
// (ship, ships, shipwright, shipyard, shipping) are licensed where the override seats the docks.
const AIRSHIP_PORT = /\b(?:docks?(?:\/port facilities)?|port facilities|harbou?r master(?:'s|’s)?(?: office)?|berths?|anchorage|(?:between )?ship and shore|harbou?r approach(?:es)?|ship(?:s|wrights?|yards?|ping)?)\b/gi;
/** F5 (2026-11-04): an A-05 gap line, "<chain>: <house> exists but lacks access to <good>". */
const LACKS_ACCESS_LINE = /^[^:\n]{1,60}: (.+?) exists but lacks access to .+$/;
/** READER-R1 (2026-11-05): the same lack in the house voice, "No <good> reaches the <house>." — F5's licence, read alike. */
const NO_INPUT_LINE = /^No .+? reach(?:es)? the (.+?)\.$/;

/**
 * A-11 reads prose, not ledgers of LACKS (lane F5, 2026-11-04, on rung 1B's soak1k-992 and
 * soak1k-353). A ledger line that names what the place LACKS is no claim that it has it:
 *  - an A-05 gap line keeps only the house it says exists (a Shipwright there is still read);
 *    its chain label and the good it lacks are removed;
 *  - a Services needs row, "Needs <need> <impact> · covers <need>, …" (`serviceComponents.jsx ::
 *    ServiceItem`, the X-50 impact plan in `ServicesTab.jsx`), names severed needs: the
 *    "covers" list (on whichever sentence carries it) and the row's own need (one of that list)
 *    are removed; the impact sentence between them is prose and is still read. A bare
 *    "Needs <need>" line is a need alone.
 * @param {string} x one screen sentence
 * @returns {string}
 */
export function withoutLackLedger(x) {
  const gap = x.match(LACKS_ACCESS_LINE) || x.match(NO_INPUT_LINE);
  if (gap) return gap[1];
  // The "covers" list ends the row; it is stripped wherever the sentence split put it (an impact
  // of two sentences leaves it on the second, soak1k-605).
  const covers = x.match(/\s·\scovers\s(.+)$/);
  let body = covers ? x.slice(0, x.length - covers[0].length) : x;
  if (!body.startsWith('Needs ')) return body;
  body = body.slice('Needs '.length);
  if (covers) {
    const own = covers[1].split(', ').filter((need) => body.startsWith(need)).sort((a, b) => b.length - a.length)[0];
    return own ? body.slice(own.length) : body;
  }
  return /[.!?]/.test(body) ? body : '';
}

/**
 * A-11's sentence: the first screen sentence that speaks of sea or catch, after the inland
 * fish trade is licensed.
 * @param {string[]} sentences
 * @param {any} s the record
 * @returns {string|undefined}
 */
export function seaWordSentence(sentences, s) {
  const importsFish = (s?.resourceAnalysis?.imports?.critical || []).map((x) => String(x).toLowerCase()).includes('fish');
  // Chair ruling (round 3, 1): where the record holds airship docking, the cascade's override
  // (src/generators/steps/cascadePass.js) admits aerial docks and a harbour master's office
  // regardless of route; their words are not sea words there.
  const airship = (s?.institutions || []).some((i) => /airship/i.test(String(i?.name || '')));
  // Round 4 (final), 1: a description that says in its own words that inland its fish is dried
  // or salted is designed inland text; every sentence of it is licensed.
  const inlandText = new Set((s?.institutions || [])
    .map((i) => String(i?.desc || ''))
    .filter((desc) => /\binland\b[^.]*\b(?:dried|salted)\b/i.test(desc))
    .flatMap((desc) => sentencesOf(desc)));
  return sentences.find((x) => {
    if (inlandText.has(x)) return false;
    let text = withoutLackLedger(x).replace(INLAND_FISH, '').replace(COOPER_BARRELS, '').replace(ROUTE_DISJUNCTION, '');
    if (importsFish) text = text.replace(LISTED_FISH, '');
    if (airship) text = text.replace(AIRSHIP_PORT, '');
    return SEA_WORDS.test(text);
  });
}

/**
 * A-05's sentence: a spectacle held HERE (chair ruling 1, 2026-11-04) — gladiatorial combat,
 * games or fights. A Gladiatorial school's own rows ("Gladiator hire", "Gladiator training")
 * feed the regional arena circuit and are not counted.
 * @param {string[]} sentences
 * @returns {string|undefined}
 */
export function arenaSpectacleSentence(sentences) {
  return sentences.find((x) => /\bgladiatorial (?:combat|games|fights?)\b/i.test(x));
}

/**
 * A-04's alchemist (2026-11-04, under the owner's delegation): one the catalogue licenses 'none'
 * (a chemical trade the dead-magic world keeps, MF-CH2B) is no contradiction; only an alchemist
 * whose licence needs magic, or an unlicensed one, counts.
 * @param {any[]|undefined} institutions
 */
export function magicAlchemist(institutions) {
  return (institutions || []).find((i) => /alchem/i.test(i?.name || '')
    && institutionCatalogMagicLicence(i.name) !== 'none');
}

/** The guild powers the engine seats in a small place on a real market (rulingStructure.js, R6 and SIZE-3). */
const MARKET_GUILD = /\bmerchant|\bthie(?:f|ves)['’]?s?\b/i;

/**
 * A-14's guild: a guild power in a thorp or hamlet. Licensed (lane F5, 2026-11-04; the chair's
 * ruling on soak1k-313, "a Periodic market is a market"): a Merchant Guilds or Thieves' Guild
 * where the record holds a real market by the engine's own predicate
 * (`src/generators/economy/viability.js :: hasMarketInstitution`, the gate R6 and SIZE-3 put on
 * those two seats). A small place with no market at all, or any other guild, still counts.
 * @param {{ tier?: string, institutions?: unknown[], factions?: Array<{ name?: string, faction?: string }>, powerStructure?: { factions?: Array<{ name?: string, faction?: string }> } }} s
 * @returns {string|undefined}
 */
export function guildPowerSmall(s) {
  if (s?.tier !== 'thorp' && s?.tier !== 'hamlet') return undefined;
  const market = hasMarketInstitution(s.institutions);
  return [...(s.factions || []), ...(s.powerStructure?.factions || [])]
    .map((f) => String(f?.name ?? f?.faction ?? ''))
    .find((n) => /guild/i.test(n) && !(market && MARKET_GUILD.test(n)));
}

/** The vocabulary a migration surface uses for each direction (coh:migration-direction). */
const MIGRATION_DEPARTS = /\b(?:families left|departures?|departed|the people leaving|people leaving|losing people|is emptying|shuttered houses|fewer hearths|fled|emigrat\w*|exodus|left (?:this|last) week)\b/i;
const MIGRATION_ARRIVES = /\b(?:arriv\w*|newcomers?|influx|receiving more people|absorbing more people|taking in more people)\b/i;

/** @param {string} text @returns {'arrivals'|'departures'|null} the one direction a text names, or null (both or neither). */
export function migrationDirectionOfText(text) {
  const departs = MIGRATION_DEPARTS.test(String(text || ''));
  const arrives = MIGRATION_ARRIVES.test(String(text || ''));
  if (departs === arrives) return null;
  return departs ? 'departures' : 'arrivals';
}

/**
 * Every migration surface of a settlement under `mass_migration`, read for the direction it names;
 * one finding per surface whose direction differs from the first direction read (the record's own
 * `stress[].direction` first, where it carries one).
 * @param {any} s @param {any} r
 * @returns {Array<{surface:string,quote:string,detail:string}>}
 */
export function migrationDirectionFindings(s, r) {
  const rows = Array.isArray(s?.stress) ? s.stress : s?.stress ? [s.stress] : [];
  const migration = rows.find((x) => x?.type === 'mass_migration');
  if (!migration) return [];
  const primary = rows[0]?.type === 'mass_migration';
  /** @type {Array<[string, string|null, string]>} [surface, direction, quote] */
  const read = [];
  if (migration.direction === 'arrivals' || migration.direction === 'departures') read.push(['record:stress.direction', migration.direction, migration.direction]);
  const said = (surface, text) => { const d = migrationDirectionOfText(text); if (d) read.push([surface, d, String(text)]); };
  said('record:stress.summary', migration.summary);
  if (primary) said('record:pressureSentence', s.pressureSentence);
  said('record:powerStructure.recentConflict', s.powerStructure?.recentConflict);
  said('record:powerStructure.stability', s.powerStructure?.stability);
  if (primary && r?.tonightSheet?.opening) said('tonight', r.tonightSheet.opening);
  if (read.length < 2) return [];
  const first = read[0];
  return read.filter(([, d]) => d !== first[1]).map(([surface, d, quote]) => ({ surface, quote, detail: `${d} beside ${first[0]} ${first[1]}` }));
}

/** DS-DEF-4's `structure null` variants and the Defense tab's static no-organised-crime line. */
const DS_DEF4_DENIAL = /No criminal infrastructure has been identified|goes wrong one thing at a time and belongs to whoever did it|met with genuine incomprehension|No organized criminal infrastructure detected\./;
/** The Defense block's "Active crime patterns" heading. */
const CRIME_PATTERNS_HEADING = 'Active crime patterns';
/** A screen line that closes a sentence (a pattern's description); a pattern's name does not. */
const CLOSES_SENTENCE = /[.!?…]["”’)]?$/;

/**
 * The Defense block's "Active crime patterns" rows read off the tab text (`DefenseTab.jsx`: each
 * row is its name, then its description), up to DS-DEF-4's lens or the next section heading.
 * @param {string} tab the Defense tab
 * @returns {Array<{ type: string, desc: string }>}
 */
export function crimePatternRows(tab) {
  const at = tab.indexOf(CRIME_PATTERNS_HEADING);
  if (at < 0) return [];
  /** @type {Array<{ type: string, desc: string }>} */
  const rows = [];
  for (const line of tab.slice(at + CRIME_PATTERNS_HEADING.length).split('\n').map((x) => x.trim()).filter(Boolean)) {
    if (DS_DEF4_DENIAL.test(line) || /[▲▼]$/.test(line)) break;
    if (!CLOSES_SENTENCE.test(line)) rows.push({ type: line, desc: '' });
    else if (rows.length) rows[rows.length - 1].desc += `${rows[rows.length - 1].desc ? ' ' : ''}${line}`;
  }
  return rows;
}

/**
 * A-06's reading: the phrase pair (the bare denial anywhere on the screen beside an organised
 * network's words), and (RUNG-2 LANDING phase D, R-D2; soak1k-1801) the Defense tab's denial
 * under the block's own "Active crime patterns". The survival pattern's own "No criminal
 * infrastructure: …" is a pattern, not the denial, so the second arm reads DS-DEF-4's sentences.
 * Phase E (R-E1), the display's exemption mirrored: a list whose every row denies organisation
 * in its own text (`defenseDisplay.js :: PATTERN_DENIES_ORGANISATION`: "Background crime", the
 * no-network "Survival crime") is no crime the denial contradicts.
 * @param {string} screenText every screen surface, joined
 * @param {string} defense the Defense tab
 * @returns {string|null} the finding's detail, or null
 */
export function crimeAbsentAndOrganised(screenText, defense) {
  if (/No criminal infrastructure/i.test(screenText) && /criminal network|thieves['’] guild|crime boss|kingpin/i.test(screenText)) return 'and an organised network elsewhere';
  const tab = String(defense || '');
  if (!DS_DEF4_DENIAL.test(tab)) return null;
  const rows = crimePatternRows(tab);
  if (rows.some((row) => !PATTERN_DENIES_ORGANISATION.test(row.desc))) return 'beside the block\'s own crime patterns';
  return null;
}

/** Does the place have water a boat or a net could use? */
function hasWater(s, config) {
  // The terrain home's one chain (CENSUS-1 fact 13), the birth config as the last fallback.
  const terrain = terrainClassOf(s) || String(config?.terrainOverride ?? '');
  const route = tradeRouteOf(s) || String(config?.tradeRouteAccess ?? '');
  return waterAccessKind(terrain.toLowerCase(), route || null) !== 'none'; // the water home's rule (CENSUS-1 fact 4)
}

/**
 * THE SAME TEXT ON TWO NPCs OF ONE ROSTER (REVIEW-INTAKE-3 R10; X-50's defect inside one dossier —
 * across dossiers a shared line is a feature, the owner's word of 2026-11-04). An instrument only:
 * the draw sites belong to the census compose, which owns the cure.
 * @param {ReadonlyArray<any>} npcs
 * @param {(npc: any) => unknown} textOf
 * @returns {{text: string, first: string, second: string, repeated: number}|null} the first text
 *   two NPCs share, who carries it, and how many distinct texts repeat on the roster
 */
export function rosterDuplicate(npcs, textOf) {
  /** @type {Map<string, string>} */
  const seen = new Map();
  /** @type {Set<string>} */
  const repeated = new Set();
  /** @type {{text: string, first: string, second: string}|null} */
  let hit = null;
  for (const npc of Array.isArray(npcs) ? npcs : []) {
    const raw = textOf(npc);
    const text = typeof raw === 'string' ? raw.trim() : '';
    if (!text) continue;
    if (!seen.has(text)) { seen.set(text, String(npc?.name ?? '')); continue; }
    repeated.add(text);
    hit ??= { text, first: seen.get(text) || '', second: String(npc?.name ?? '') };
  }
  return hit ? { ...hit, repeated: repeated.size } : null;
}
/**
 * ALLEGIANCE-CAR1 (I-2, I-3): every hidden allegiance holds exactly one handler — a roster card, not itself, holding no
 * allegiance, a member of `allegiance.power` or the face of a roster criminal house (or a criminal power's mint).
 * @param {object} s @returns {Array<{ card: string, detail: string }>}
 */
export function allegianceHandlerFindings(s) {
  const cast = (s?.npcs || []).filter((n) => n && n.id != null);
  const byId = new Map(cast.map((n) => [String(n.id), n]));
  const crim = new Set(criminalHousesOf(s).map((i) => String(i.name)));
  const crimPowers = new Set(criminalPowersOf(s).map((p) => String(p.faction || p.name)));
  const crimFace = (n) => (n?.institution?.kind === 'house' && crim.has(String(n.institution.key)))
    || (n?.institution?.kind === 'power' && crimPowers.has(String(n.institution.key)));
  const out = [];
  for (const card of cast) {
    const a = allegianceOf(card);
    if (!a) continue;
    const h = a.handler ? byId.get(a.handler) : null;
    let why = null;
    if (!a.handler) why = 'no handler';
    else if (!h) why = `handler ${a.handler} is not on the roster`;
    else if (h === card) why = 'its own handler';
    else if (allegianceOf(h)) why = `handler ${h.id} holds an allegiance itself`;
    else if (!(a.power && (h.memberships || []).some((m) => m?.power === a.power)) && !crimFace(h)) why = `handler ${h.id} is no criminal face`;
    if (why) out.push({ card: String(card.id), detail: why });
  }
  return out;
}
/**
 * ALLEGIANCE-CAR2 (I-1): a captured or corrupted hall has a criminal in the ruling three — an agent (a card holding an
 * allegiance, ranked 1–3 in the governing power) or a criminal governing power; a 'capture' hall's lord is an agent.
 * Reads the record's raw fields.
 * @param {object} s @returns {Array<{ state: string, detail: string }>}
 */
export function captureWithoutAgentFindings(s) {
  const state = s?.powerStructure?.criminalCaptureState;
  if (state !== 'capture' && state !== 'corrupted') return [];
  const gov = (s?.powerStructure?.factions || []).find((f) => f?.isGoverning) || null;
  const ruler = gov ? String(gov.faction || gov.name || '') : '';
  const ranks = (s?.npcs || []).filter((n) => allegianceOf(n))
    .map((n) => (n.memberships || []).find((m) => m?.power === ruler && [1, 2, 3].includes(m?.rank))?.rank)
    .filter(Boolean);
  const rulerCriminal = !!gov && (String(gov.category || '').toLowerCase() === 'criminal' || /thie/i.test(ruler));
  if (state === 'capture' && !ranks.includes(1)) return [{ state, detail: `a 'capture' hall whose lord (${ruler}) is no agent` }];
  if (!ranks.length && !rulerCriminal) return [{ state, detail: `a '${state}' hall with no agent in ${ruler}'s ruling three and no criminal governing power` }];
  return [];
}
const secretTextOf = (npc) => (typeof npc?.secret === 'string' ? npc.secret : npc?.secret?.what);
const goalTextOf = (npc) => (typeof npc?.goal === 'string' ? npc.goal : npc?.goal?.short);

/**
 * The full per-settlement review.
 * @param {object} s the generated record
 * @param {object} config the config it was born from
 * @param {{ tabs: Record<string,string>, tonight: string, tonightSheet: any, pdf: string, foundry: string, errors: Record<string,string> }|null} r
 * @returns {Array<{check:string,surface:string,quote:string,detail:string}>}
 */
export function reviewSettlement(s, config, r) {
  const out = [];
  const add = (check, surface, quote, detail = '') => out.push({ check, surface, quote: String(quote ?? '').slice(0, 400), detail: String(detail ?? '').slice(0, 300) });

  // ── cert: the certification soak's own receipts
  for (const f of inspectSettlement(s, config)) add(`cert:${f.code}`, 'record', f.path, f.detail);
  const batteryVerdict = (s?.generationCoherenceReceipt?.judgments || []).find((j) => j?.id === 'record_coherence_battery');
  if (batteryVerdict?.status === 'needs_review') add('info:battery-would-not-vouch', 'record', 'generationCoherenceReceipt.judgments.record_coherence_battery', (batteryVerdict.findings || []).map((f) => f?.path).filter(Boolean).join(', '));

  // ── X-46 car 1: population inside the owner's band for its tier
  const band = OWNER_BANDS[s.tier];
  if (band && !(s.population >= band[0] && s.population <= band[1])) add('X-46:population-outside-band', 'record', String(s.population), `${s.tier} band ${band[0]}–${band[1]}`);

  // ── R10: one roster, the same secret or goal on two NPCs (record checks; no render needed)
  for (const [check, textOf] of [['coh:roster-duplicate-secret', secretTextOf], ['coh:roster-duplicate-goal', goalTextOf]]) {
    const dup = rosterDuplicate(s.npcs, textOf);
    if (dup) add(check, 'record', dup.text, `${dup.first} and ${dup.second}; ${dup.repeated} text(s) repeat on this roster`);
  }
  for (const f of allegianceHandlerFindings(s)) add('coh:allegiance-handler', 'record', f.card, f.detail);
  for (const f of captureWithoutAgentFindings(s)) add('coh:capture-without-agent', 'record', f.state, f.detail);

  // ── coh:migration-direction (lane WIRING-W0, 2026-11-07, R-W7 e): a mass migration runs ONE way.
  // The crisis text, the pressure line (the Tonight opening when no crisis line exists), the Power
  // vignette and the stability label each say which way people move; the record's own
  // `stress[].direction` (where present) is the one fact they read. Two directions on one
  // settlement is the finding. A surface that names both directions (a hedge) or neither is silent.
  for (const finding of migrationDirectionFindings(s, r)) add('coh:migration-direction', finding.surface, finding.quote, finding.detail);

  if (!r) return out;
  for (const [surface, error] of Object.entries(r.errors || {})) add('render:error', surface, '', error);

  const surfaces = { ...r.tabs, tonight: r.tonight, pdf: r.pdf, foundry: r.foundry };
  const screen = { ...r.tabs, tonight: r.tonight };
  const screenText = Object.values(screen).join('\n');
  const allText = Object.values(surfaces).join('\n');

  // ── coh: the seven instruments, every surface
  // F1 unit 4: the defence-words check counts defence CLAIMS; a soldier who is one person, a walled
  // plot, a trade's customers or a hedged hospital is reach, licensed by rule (`defenceReach.mjs`).
  for (const f of coherenceBattery(s, surfaces)) if (isDefenceClaim(f, s)) add(`coh:${f.check}`, f.surface, f.quote, f.detail);

  // ── X-47: no district or tavern names on any text surface
  const quarters = (s.spatialLayout?.quarters || []).flatMap((q) => [q?.name]).filter((n) => typeof n === 'string' && n.length > 3);
  for (const [surface, text] of Object.entries(surfaces)) {
    for (const name of quarters) if (text.includes(name)) { add('X-47:district-name', surface, name); break; }
    const tavern = text.match(/\b(?:The|the) [A-Z][a-z]+(?: (?:and|&) [A-Z][a-z]+| [A-Z][a-z]+)? (?:Inn|Tavern|Alehouse|Taproom)\b/);
    if (tavern) add('X-47:tavern-name', surface, tavern[0]);
  }

  // ── X-48: no look, voice or tell in any export (and the screen card never did)
  const looks = [];
  for (const npc of s.npcs || []) {
    const p = npc?.physical || {};
    for (const k of ['feature', 'build', 'clothes']) if (typeof p[k] === 'string' && p[k].length > 8) looks.push([k, p[k]]);
    for (const k of ['tell', 'speech', 'voice', 'mannerism']) { const v = npc?.personality?.[k] ?? npc?.[k]; if (typeof v === 'string' && v.length > 8) looks.push([k, v]); }
  }
  for (const [surface, text] of Object.entries(surfaces)) {
    const hit = looks.find(([, v]) => text.includes(v));
    if (hit) add('X-48:look-voice-tell', surface, hit[1], hit[0]);
  }

  // ── X-49: the stores figure printed once, on the Economy tab
  // RUNG2-F13: the held famine granary is the same stores row ("Stores: a granary of N months that the hall will not open.").
  const STORE = /\b(?:Stores: a granary, [^.]+ of grain|Stores: a granary of [^.]+ that the hall will not open|No granary; [^.]+ in (?:household stores|the larder))\./g;
  const storeHits = Object.entries(r.tabs).flatMap(([tab, text]) => (text.match(STORE) || []).map((q) => [tab, q]));
  const record = s.economicState?.foodSecurity?.foodRecord;
  const stored = record ? Number(storesMonthsOf(s)) : NaN;
  const ecoHits = storeHits.filter(([tab]) => tab === 'economics');
  if (Number.isFinite(stored) && stored > 0 && ecoHits.length !== 1) add('X-49:stores-not-once', 'economics', ecoHits.map((h) => h[1]).join(' | '), `${ecoHits.length} stores rows on the Economy tab; record holds ${stored} months`);
  for (const [tab, q] of storeHits.filter(([tab]) => tab !== 'economics')) add('X-49:stores-not-once', tab, q, 'the stores figure off its home tab');

  // ── X-50: no boilerplate sentence twice on one surface
  for (const [surface, text] of Object.entries(screen)) {
    const counts = new Map();
    for (const sent of sentencesOf(text)) {
      if (sent.split(/\s+/).length < 8 || !/[.!?]["”’)]?$/.test(sent)) continue;
      const k = normalizeRenderedSentence(sent);
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    for (const [k, n] of counts) if (n > 1) add('X-50:boilerplate-twice', surface, k, `${n} times`);
  }

  // ── X-51: one Tonight sheet whose first line names the crisis
  const stressTypes = crisisEntries(s).map((x) => x?.label).filter(Boolean);
  // The sheet's own opening line (`composeTonightSheet(...).opening`), which the page prints first
  // under its eyebrow; the eyebrow label itself ("Active crisis", "What is urgent") is not the line.
  const firstLine = String(r.tonightSheet?.opening ?? '').trim();
  if (stressTypes.length && !stressTypes.some((label) => firstLine.toLowerCase().includes(String(label).toLowerCase()))) add('X-51:first-line-not-crisis', 'tonight', firstLine, `crisis: ${stressTypes.join(', ')}`);
  if (/^(?:Where play begins: )?They\b/.test(firstLine)) add('A-03:tonight-they', 'tonight', firstLine, 'opens on an unnamed "they"');

  // ── X-52: the Food endurance line once on Defense, agreeing with the stores row
  const endurance = (r.tabs.defense.match(/Food endurance/g) || []).length;
  if (Number.isFinite(stored) && stored > 0 && endurance !== 1) add('X-52:endurance-not-once', 'defense', '', `${endurance} Food endurance lines; record holds ${stored} months`);
  if (endurance > 0 && record?.hasGranary === false && /the granary\b/.test(r.tabs.defense.split('Food endurance')[1]?.slice(0, 300) || '')) add('X-52:endurance-disagrees', 'defense', r.tabs.defense.split('Food endurance')[1].slice(0, 200), 'names a granary the record does not hold');

  // ── A-01: "starving" in the record's hooks where the food record is fed
  if (record && !famineOf(s).starvingAllowed) { // CENSUS-1 fact 6: the famine home's one rule
    const starving = sentencesOf(screenText).find((x) => /\bstarving\b/i.test(x));
    if (starving) add('A-01:starving-fed', 'screen', starving, `band ${record.band}, gap ${record.gapPct}%`);
  }

  // ── A-04: magic off, yet a dragon or an alchemist
  const magicOn = (() => { try { return magicWorksAt({ settlement: s }); } catch { return true; } })();
  if (!magicOn) {
    const dragon = sentencesOf(screenText).find((x) => /\bdragons?\b/i.test(x));
    if (dragon) add('A-04:dragon-magic-off', 'screen', dragon);
    const alch = magicAlchemist(s.institutions);
    if (alch) add('A-04:alchemist-magic-off', 'record', alch.name);
  }

  // ── A-05: a house named in prose that the Institutions tab does not hold
  const instNames = (s.institutions || []).map((i) => String(i?.name || '').toLowerCase()).join(' | ');
  const hosp = sentencesOf(screenText).find((x) => /\bHospital present\b/i.test(x));
  if (hosp && !/hospital/.test(instNames)) add('A-05:hospital-absent', 'screen', hosp);
  const arena = arenaSpectacleSentence(sentencesOf(screenText));
  if (arena && !/arena|amphithea|colosse|fighting pit/.test(instNames)) add('A-05:arena-absent', 'screen', arena);
  const lacks = (screenText.match(/exists but lacks access to/g) || []).length;
  if (lacks) add('A-05:lacks-access-lines', 'screen', '', `${lacks} lines`);

  // ── A-06: crime said absent beside an organised network, or beside the block's own crime patterns
  const crimeAbsent = crimeAbsentAndOrganised(screenText, r.tabs.defense);
  if (crimeAbsent) add('A-06:crime-absent-and-organised', 'screen', 'No criminal infrastructure', crimeAbsent);

  // ── A-08: the fixed hidden-ruler note that never says who
  const hidden = sentencesOf(screenText).find((x) => /appears to govern is not the faction that governs/i.test(x));
  if (hidden) add('A-08:hidden-ruler-note', 'screen', hidden);

  // ── A-09: one behaviour line covering much of a roster
  const roster = (s.npcs || []).length;
  if (roster >= 4) {
    const lines = new Map();
    for (const npc of s.npcs) { const k = npc?.personality?.dominant ?? npc?.personality?.behaviour ?? npc?.personality?.trait; if (typeof k === 'string') lines.set(k, (lines.get(k) || 0) + 1); }
    const top = Math.max(0, ...lines.values());
    if (top / roster >= 0.4) add('A-09:behaviour-line-share', 'record', [...lines].find(([, n]) => n === top)?.[0], `${top} of ${roster}`);
  }

  // ── A-10: role-only NPCs, placeholder factions
  for (const npc of s.npcs || []) if (/^The [A-Z]/.test(String(npc?.name || ''))) { add('A-10:role-only-npc', 'record', npc.name, npc.role || ''); break; }
  const factionNames = [...(s.factions || []), ...(s.powerStructure?.factions || [])].map((f) => String(f?.name ?? f?.faction ?? ''));
  const placeholder = factionNames.find((n) => /\b(?:Bloc|Faction) [A-Z]\b|Unknown Faction/.test(n));
  if (placeholder) add('A-10:placeholder-faction', 'record', placeholder);

  // ── A-11: sea words where there is no water
  if (!hasWater(s, config)) {
    const sea = seaWordSentence(sentencesOf(screenText), s);
    if (sea) add('A-11:sea-words-landlocked', 'screen', sea);
  }

  // ── A-12: the page vouches for itself while the battery finds a contradiction
  const vouch = sentencesOf(screenText).find((x) => /contradicts anything else in it/i.test(x));
  const contradictions = out.filter((f) => (KIND_OF[f.check] || 0) >= 1 && KIND_OF[f.check] !== 6).length;
  if (vouch && contradictions) add('A-12:self-vouch-false', 'screen', vouch, `${contradictions} contradiction findings`);

  // ── A-14: town furnishings in small places
  const guild = guildPowerSmall(s);
  if (guild) add('A-14:guild-power-small', 'record', guild, s.tier);
  if ((s.tier === 'thorp' || s.tier === 'hamlet') && /\bLord Mayor\b/.test(allText)) add('A-14:lord-mayor-small', 'screen', 'Lord Mayor', s.tier);

  // ── reader: the READER battery, every surface — LAST, so no check above (A-12's contradiction
  // count) reads a reader finding.
  for (const f of readerBattery(s, surfaces)) add(`reader:${f.check}`, f.surface, f.quote, f.detail);
  return out;
}
