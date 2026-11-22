// @ts-check
/**
 * domain/display/galleryRosterChoices.js — R3: THE ROSTER CHOICES, THE DRAWN CONDITIONAL ROWS (VEIL-22's builder;
 * SUB-BRIEF-VR7 point 5; the chairs' VR7, VR11/VR31, VR21, VR29, VR39, VR42 and the power observable of 03:15 UTC, each
 * vetoable by the owner).
 *
 * The client twin of migration 212 :: _gallery_veil_roster_choices, rule for rule, each rule naming its row of the
 * roster-choice registry (src/domain/veil/rosterChoiceRegistry.js). galleryVeil.js :: applyVeil runs it immediately before
 * galleryWithholdAlways.js :: withholdAlways (R2's step), and projectShareVeil on the unmarked path (where nothing is hidden
 * whole, only VR31's shares can move). Its own module, as R2's step is: gallerySecondHomes.js stands at its layer's size
 * ceiling; the houses are read there (gallerySecondHomes.js :: rosterHouses, a name lookup). Pure in kind: works in place
 * on the veil's own copy.
 */
import { buildNameSearch, caseFold, renumberTrace, rosterHouses } from './gallerySecondHomes.js';

/** @typedef {Record<string, unknown>} Rec */

/** @param {unknown} v @returns {v is Rec} */
function isRec(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}
/** @param {unknown} v @returns {string} */
function str(v) {
  return typeof v === 'string' ? v : '';
}
/** @param {Rec} s @param {string} key @returns {Rec | null} */
function recAt(s, key) {
  const v = s[key];
  return isRec(v) ? v : null;
}
/** A share the re-derivation reads (a JSON number a double holds, from 0 to 10^12), or null: gallerySecondHomes.js's income rule. @param {unknown} v @returns {number|null} */
const shareBasis = (v) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 1e12 ? v : null);
/** Each crime type by the house flags that raise it (safetyProfile.js; priorityHelpers.js :: getStressFlags). R3-CURE (unit 3):
 * EVERY type the engine writes is a key (tests/lint/rosterChoicePools.walker.test.js holds it equal to safetyProfile.js's own
 * set); a crisis's type is raised by no house; 'contested property' by a standing religious house. A type it does not hold:
 * unsure, withheld. */
export const CRIME_TYPE_RAISERS = Object.freeze(/** @type {Record<string, string[]>} */ ({ Smuggling: ['hasSmuggling'], 'Organized guild crime': ['hasThievesGuild', 'hasCriminalInst'],
  'Street gang activity': ['hasGangInfra'], 'Criminal governance': ['hasCriminalInst'], 'Arcane black market': ['hasCriminalInst'],
  'Religious fraud': ['hasCriminalInst'], 'Commercial crime': ['hasCriminalInst'], 'Survival crime': ['hasCriminalInst'],
  'Magical crime': ['hasCriminalInst'], 'Background crime': ['hasCriminalInst'], Lawlessness: ['hasCriminalInst'],
  'State predation': [], 'desperation theft': [], 'black market food': [], 'resistance activity': [], 'collaboration fraud': [],
  'quarantine violation': [], 'plague profiteering': [], 'debt evasion': [], 'political violence': [], 'loyalty testing': [],
  'information trade': [], 'revolt violence': [], 'escape networks': [], 'informant pressure': [], 'weapons trade': [],
  'underground worship': [], 'religious fraud': [], 'contested property': ['religiousHouse'], 'informant networks': [],
  'war profiteering': [], 'deserter networks': [], 'conscription fraud': [], 'displacement crime': [], 'cultural friction': [],
  'black market passage': [] }));
const AUTHORITY_HOOK = 'Someone approached the party seeking legitimate authority to settle a dispute. The only "authority" here is ';
/** Each hook of the safety profile's closed pool by the flags that raise it ([]: raised by no house). */
export const SAFETY_HOOK_RAISERS = Object.freeze(/** @type {Record<string, string[]>} */ ({
  'A local family wants evidence of tax extortion gathered quietly, but the extorter wears an official badge.': [],
  'The garrison chaplain and the commander are the same person, who is authorizing military action for reasons that sound theological.': [],
  [`${AUTHORITY_HOOK}the guild.`]: ['hasCriminalInst'],
  [`${AUTHORITY_HOOK}whoever holds this quarter.`]: ['hasCriminalInst'],
  [`${AUTHORITY_HOOK}whoever holds this stretch of road.`]: ['hasCriminalInst'],
  "A part from the wizard's tower has gone missing, and the black market has it; the fence wants a price the wizard will not pay.": ['hasCriminalInst'],
  'A pilgrim paid a fortune for a holy relic that is obviously fake. They want the fraud exposed without losing their faith in the process.': ['hasCriminalInst'],
  'A guild merchant hired the party, then asked for something the guild forbids; the pay is good, and someone else in the guild already knows.': ['hasCriminalInst'],
  "The merchant guild's private security force just detained someone, with no legal authority to do so. The watch is looking the other way.": ['hasGangInfra'],
  // R3-CURE (unit 3): the two tellings safetyProfile.js :: said writes from SAFETY_LINE_SIBLINGS, each by its sibling's flags
  "The merchant guild's private security force just detained someone, with no legal authority to do so. No one with the authority to stop it is trying.": ['hasGangInfra'],
  "The settlement's chaplain also leads its armed men, and is authorizing military action for reasons that sound theological.": [],
  'The smuggling network is moving something unusual this week, not the normal contraband. Someone wants to know what it is before it arrives.': ['hasSmuggling'],
  'A smuggler wants one crate moved quietly and will pay well, but will not say what is in it.': ['hasSmuggling'],
  'The smugglers have stopped moving their usual goods this week, and nobody can say why.': ['hasSmuggling'],
  'A smuggled load went missing on the way in, and the people who paid for it are asking questions.': ['hasSmuggling'],
  'The smugglers have gone quiet since the siege closed the roads, and someone wants to know what their last load was.': ['hasSmuggling'],
  'The last smuggled load before the siege went missing, and the people who paid for it are asking questions.': ['hasSmuggling'],
}));
/** The three declared pairs the roster-moved fact 'rival power' chooses between (institutionDescVariants.js, TAIL-HOUSES-5 batch 8). */
export const RIVAL_POWER_DESCS = Object.freeze([
  'Wealthy merchant families hold exclusive civic power; political office is effectively purchased.',
  'Wealthy merchant families hold the civic offices; political office is effectively purchased.',
  'Civic power belongs solely to the wealthy merchant families, and office is bought in all but name.',
  'Civic power rests with the wealthy merchant families, and office is bought in all but name.',
  'A handful of rich merchant houses monopolise power here; a political post is, in practice, something one purchases.',
  'A handful of rich merchant houses hold the seat of power here; a political post is, in practice, something one purchases.',
]);
/** R3-CURE-2 (unit 2 (a)): the operations list's label table, safetyProfile.js's CRIMINAL_INST_LABELS (a house by its
 * native name, case-folded, to the label the list carries; tests/lint/rosterChoicePools.walker.test.js holds it equal). */
export const CRIMINAL_INST_LABELS = Object.freeze(/** @type {Record<string, string>} */ ({ "thieves' guild chapter": "Thieves' Guild Chapter",
  "thieves' guild (powerful)": "Thieves' Guild (Powerful)", "assassins' guild": "Assassins' Guild", 'multiple criminal factions': 'Rival Gangs',
  'black market': 'Black Market', 'black market bazaar': 'Black Market Bazaar', 'smuggling operation': 'Smuggling Operation',
  'smuggling network': 'Smuggling Network', 'street gang': 'Street Gang', 'front businesses': 'Front Businesses', 'underground city': 'Underground City',
  'gambling den': 'Gambling Den', 'gambling halls': 'Gambling Halls', 'gambling district': 'Gambling District', 'red light district': 'Red Light District' }));
const COVERT = '(covert)';
/** R3-TELL-5 unit (ii): each criminal services tag by the crime types whose row it is (servicesGenerator.js: the stress rows
 * and the crime-type rows); 212's `svctags`, the same literal. */
const SERVICE_TYPE_TAGS = Object.freeze(/** @type {Record<string, string[]>} */ ({ '(street gang)': ['Street gang activity'], '(smuggling)': ['Smuggling'],
  '(arcane underground)': ['Magical crime', 'Arcane black market'], '(state apparatus)': ['State predation'], '(criminal governance)': ['Criminal governance'],
  '(religious fraud)': ['Religious fraud'], '(commercial crime)': ['Commercial crime'] }));
const ROSTER_FLAGS = Object.freeze(['hasCriminalInst', 'hasSmuggling', 'hasThievesGuild', 'hasGangInfra', 'hasMarket']);
const RELIGIOUS_HOUSE = /church|cathedral|temple|monaster|friary|shrine|abbey|chapel/i;
const ACCESS_TO = /^access to/i;
const NPC_AFFILIATION_KEYS = Object.freeze(['faction', 'factionAffiliation', 'affiliation', 'factionId']);
/** The name keys of a power (`faction`, `name`) that are strings. @param {Rec} f @returns {string[]} */
const powerNamesOf = (f) => [f.faction, f.name].filter((v) => typeof v === 'string');
/** Whether a power is withheld by power.entry (VR42: never the governing row): by its seat's mark (category 'criminal'); a
 * thieves' name (factionDynamics.js's isCrim) only where the power carries NO category string (unsure: withheld). R3-CURE-4
 * (unit 2; the chair's ruling 37 (a)): a power whose category says what it is (the plant's civic "Old Thieves' Guild Watch",
 * raised by no house) is not taken by the words of its name; measured on the born pool (out/v25/r3c4/unit2-thie-census.json):
 * 0 of 1,478 born powers read differently, every born "Thieves' Guild" carries category 'criminal'. @param {Rec} f */
const entryOut = (f) => f.isGoverning !== true && (asciiLowerOf(f.category) === 'criminal'
  || (typeof f.category !== 'string' && /thie/i.test(str(f.faction !== undefined ? f.faction : f.name))));
const BENEATH_THE_WALLS = /smuggling (network|operation)|underground (network|city)/i;
const GATES_BENEATH = / The ([^.]+) keeps? the gates, but smugglers have ways in beneath the walls\./;
const VERY_SAFE_BENEATH = ' The guard keeps the gates, but smugglers have ways in beneath the walls.';
const FOOTHOLD = 'organized crime has a limited foothold.';
const ORGANISED_HOUSE_WORDS = Object.freeze(["thieves' guild", 'thieves guild', 'multiple criminal', 'underground city', 'front business']);
const DASH = '—';
/** @param {unknown} v @returns {string} */
const asciiLowerOf = (v) => str(v).replace(/[A-Z]/g, (c) => c.toLowerCase());
/** @param {unknown} list @returns {Rec[]} */
const objectsOf = (list) => (Array.isArray(list) ? list.filter(isRec) : []);

/**
 * VEIL-22 (R3): THE DRAWN CONDITIONAL ROWS, in place on applyVeil's own clone `s`; `pub` is the projection the veil ran on,
 * `idOf` the institution card's id. Wherever a POWER is withheld (fewer than `pub` held), the served shares are re-derived to
 * 100 by largest remainder and a relation naming an unserved power goes (VR31). WHERE A HOUSE IS HIDDEN WHOLE, each row
 * chosen from the roster is (a) rebuilt from what is served or (b) withheld where a hidden house could have chosen it; a
 * flag "a hidden house raised" is one the stored record holds true (or not at all: unsure) that the served houses no longer
 * raise (withholdSecondHomes recomposed them, item C). What is left is dense (VR21). SQL twin: 212 ::
 * _gallery_veil_roster_choices, rule for rule.
 * @param {Rec} s @param {Rec} pub @param {(card: Rec) => string} idOf
 */
export function applyRosterChoices(s, pub, idOf) {
  // registry: power.entry (VR42: the governing power's row is never removed; any other criminal power where a house is hidden whole)
  const { served: houses, gone: goneHouses } = rosterHouses(s, pub, idOf);
  const gone = goneHouses.map(h => caseFold(str(h.name)));
  const whole = gone.length > 0;
  const ps = recAt(s, 'powerStructure');
  // R3-CURE (unit 1, the chair's ruling of 07:31: THE POWER RULE GOVERNS; a power a hidden house raises leaves WHOLE): the
  // governing powers' names (VR42, in either list) and the powers withheld below
  const govNames = new Set(objectsOf(ps?.factions).filter(f => f.isGoverning === true).flatMap(powerNamesOf));
  const psOut = new Set(objectsOf(ps?.factions).filter(entryOut).flatMap(powerNamesOf));
  if (whole && ps && Array.isArray(ps.factions)) {
    ps.factions = ps.factions.filter(f => !(isRec(f) && entryOut(f)));
  }
  // R3-CURE (unit 2): master's stored shape, the top-level factions[]: the same rule, an entry naming a power withheld above
  // leaves too, one naming a governing power stays (VR42)
  if (whole && Array.isArray(s.factions)) {
    const before = objectsOf(s.factions).length;
    s.factions = s.factions.filter(f => !(isRec(f) && f.isGoverning !== true && ![str(f.faction), str(f.name)].some(n => govNames.has(n))
      && (entryOut(f) || [str(f.faction), str(f.name)].some(n => psOut.has(n)))));
    // (VR11/VR31 on this list too: where the rule took an entry, a share set left is re-derived to 100 by largest remainder)
    const left = objectsOf(s.factions);
    if (left.length > 0 && left.length < before && left.every(f => typeof f.power === 'number')) s.factions = largestRemainder(/** @type {unknown[]} */ (s.factions));
  }
  // registry: power.share (VR11, VR31: wherever any power is withheld, re-derived to 100 by largest remainder from `power`)
  const n0 = objectsOf(recAt(pub, 'powerStructure')?.factions).length;
  const n1 = objectsOf(ps?.factions).length;
  // (VR31: a power the projection itself withheld, a hidden one off a Reveal-DM read, leaves the shares short of 100)
  // (a share set: every served power carries a number; an old record whose powers carry none has none to re-derive)
  const shares = n1 > 0 && objectsOf(ps?.factions).every(f => typeof f.power === 'number');
  // (R3-CURE-2, unit 4 (ii): the sum compared EXACTLY, as 212's numeric: each share by its decimal spelling, never a double sum)
  const withheld = n1 < n0 || (shares && !sumIsHundred(objectsOf(ps?.factions).map(f => /** @type {number} */ (f.power))));
  if (ps && withheld && shares && Array.isArray(ps.factions)) ps.factions = largestRemainder(/** @type {unknown[]} */ (ps.factions));
  // registry: power.relation.entry
  // registry: power.relation.direction (VR37 (b): the word goes with its relation)
  if (ps && withheld && Array.isArray(ps.factionRelationships)) {
    const names = new Set(objectsOf(ps.factions).flatMap(f => [f.faction, f.name].filter(v => typeof v === 'string')));
    const unserved = (/** @type {Rec} */ r) => !Array.isArray(r.pair) || r.pair.length === 0 || !r.pair.every(n => typeof n === 'string' && names.has(n));
    // (R3-CURE-4, unit 1: A HUSK IS A TELL: a relation whose PRE-SWEEP counterpart in `pub` named an unserved power leaves
    // whole, though the name sweep took that name out of its pair: heldBy, the containment 212 reads as `@>`)
    const rels0 = objectsOf(recAt(pub, 'powerStructure')?.factionRelationships).filter(unserved);
    ps.factionRelationships = ps.factionRelationships.filter(r => isRec(r) && !unserved(r) && !rels0.some(r0 => heldBy(r0, r)));
  }
  if (!whole) return;

  // R3-CURE (unit 2; the chair's ruling of 07:39: "LEAVES WHOLE" MEANS EVERY COPY): the withheld powers (every power of
  // `pub`'s two lists that neither served list names) leave every STRUCTURED copy (withholdPowerCopies)
  withholdPowerCopies(s, pub, ps);
  // R3-TELL-4 unit (i) (the chair's ruling 73 (2): WHAT NAMES OR DEPENDS ON A WITHHELD HOUSE IS SERVED AS THE HOUSE-FREE TWIN
  // WOULD SERVE IT). registry: people.allegiance. A served person's `allegiance` stays only BY POSITIVE ACCOUNT: its `house` a
  // house this read lists, its `power` null, absent or a power this read serves (both served lists); else THE KEY leaves, the
  // open place's form (ruling 47: no husk; a husk the sweep left names no listed house). SQL twin: 212, the same rule
  // registry: people.allegiance
  if (Array.isArray(s.npcs)) {
    const listed = new Set(houses.map(h => str(h.name)).filter(v => v !== ''));
    const powersServed = new Set([...objectsOf(ps?.factions), ...objectsOf(s.factions)].flatMap(powerNamesOf));
    const accounted = (/** @type {unknown} */ a) => isRec(a) && typeof a.house === 'string' && listed.has(a.house)
      && (a.power === null || a.power === undefined || (typeof a.power === 'string' && powersServed.has(a.power)));
    s.npcs = s.npcs.map(n => (isRec(n) && Object.prototype.hasOwnProperty.call(n, 'allegiance') && !accounted(n.allegiance)
      ? (({ allegiance: _a, ...rest }) => rest)(n) : n));
  }

  const instOf = (/** @type {Rec} */ d) => recAt(recAt(recAt(recAt(d, 'economicState') || {}, 'safetyProfile') || {}, 'compound') || {}, 'inst')
    || recAt(recAt(recAt(d, 'economicState') || {}, 'compound') || {}, 'inst') || {};
  const fl = instOf(pub);
  const sfl = instOf(s);
  /** @type {Record<string, boolean>} */
  const raised = Object.fromEntries(ROSTER_FLAGS.map(k => [k, sfl[k] !== true && fl[k] !== false]));
  // R3-CURE (unit 3): a religious house hidden whole, where no served one stands, raised 'contested property' (safetyProfile.js)
  raised.religiousHouse = gone.some(g => RELIGIOUS_HOUSE.test(g) && !ACCESS_TO.test(g))
    && !houses.some(h => RELIGIOUS_HOUSE.test(str(h.name)) && !ACCESS_TO.test(str(h.name)));
  const beneath = houses.some(h => BENEATH_THE_WALLS.test(str(h.name)));
  const es = recAt(s, 'economicState');

  // R3-CURE-2 (unit 2, the chair's ruling 2: EVERY SERVED FIELD THAT FEEDS A DERIVED KEY IS RE-DERIVED OVER THE HOUSES THE
  // READ SERVES, OR WITHHELD): (a) safety.criminalInstitutions, the operations list the Defense key reads
  // (criminalStructureKey.js, `listed`): re-derived over the SERVED houses by the engine's own label table, an entry kept,
  // in order, only as many times as served houses carry its label (the hidden "Multiple criminal factions" wrote
  // "Rival Gangs", which holds no house's name); (b) a covert criminal service (`institution` '(covert)', the key's
  // covert rung, covertCrimeHeld), drawn from the criminal climate the houses moved (servicesGenerator.js), which no served
  // field re-derives: withheld
  const spOps = es0(s);
  if (spOps && Array.isArray(spOps.criminalInstitutions)) {
    /** @type {Map<string, number>} */
    const left = new Map();
    for (const h of houses) {
      const lbl = CRIMINAL_INST_LABELS[asciiLowerOf(h.name)];
      if (lbl !== undefined) left.set(lbl, (left.get(lbl) || 0) + 1);
    }
    spOps.criminalInstitutions = spOps.criminalInstitutions.filter(e => {
      const k = typeof e === 'string' ? left.get(e) || 0 : 0;
      if (k > 0) left.set(/** @type {string} */ (e), k - 1);
      return k > 0;
    });
  }
  // R3-CURE-8 (ruling 55, the chair 16:45: THE TWIN SENT MORE): (c) a criminal service with NO `institution` key is withheld
  // too (born without one, or left without one by the hidden-house name sweep, which took '(street gang)' or '(thieves guild)'
  // out of it): no served house accounts for it. 212 withheld it already, by its own statement of this rule
  const svc = recAt(s, 'availableServices');
  if (svc && Array.isArray(svc.criminal)) {
    /** @type {unknown[]} */
    const crim = svc.criminal.filter(x => !(isRec(x) && (!Object.prototype.hasOwnProperty.call(x, 'institution') || x.institution === COVERT)));
    // R3-TELL-5 unit (ii) (the chair's ruling 73 (2); ruling 74 (ii)): (e) BY POSITIVE ACCOUNT, a criminal services row stays
    // only where its `institution` is the name of a house this read lists, or the tag of a crime type a shown house or a
    // crisis raises (SERVICE_TYPE_TAGS), the type kept by VR39's attribution over `pub`'s own list (the grouping that shuts
    // the types does not shut the services). Every other row (the climate's '(lawless)', '(informal)'; a non-object) leaves;
    // what is left may be [] (VR29). SQL twin: 212, the same rule
    const types0 = objectsOf(es0(pub)?.crimeTypes);
    const accTypes = new Set(types0.filter(c => typeof c.type === 'string' && Object.prototype.hasOwnProperty.call(CRIME_TYPE_RAISERS, c.type)
      && !CRIME_TYPE_RAISERS[c.type].some(f => raised[f])).map(c => /** @type {string} */ (c.type)));
    const listedNames = new Set(houses.map(h => str(h.name)).filter(v => v !== ''));
    svc.criminal = crim.filter(x => isRec(x) && typeof x.institution === 'string' && (listedNames.has(x.institution)
      || (Object.prototype.hasOwnProperty.call(SERVICE_TYPE_TAGS, x.institution) && SERVICE_TYPE_TAGS[x.institution].some(t => accTypes.has(t)))));
  }
  // R3-TELL-3 unit 4b (ruling 60, R3-CURE-8's STOP 1; the chair's word of 20:03 UTC): (d) A NON-CRIMINAL SERVICES ROW WHOSE
  // `institution` NAMED A HIDDEN HOUSE LEAVES WHOLE (a husk, ruling 42 (1)): the hidden-house name sweep takes the key only
  // where its text names a hidden house in a spelling the fold finds ('(street gang)' beside the hidden "Street gang"), so a
  // served row without the key whose pre-sweep counterpart in `pub` (the same family, heldBy: 212's `@>`) carried a string
  // `institution` is such a row. A row born without the key, and a row whose `institution` named no hidden house (the sweep
  // left it), stay as they are
  if (svc) {
    const svc0 = recAt(pub, 'availableServices') || {};
    for (const fam of Object.keys(svc)) {
      const list = svc[fam];
      if (fam === 'criminal' || !Array.isArray(list)) continue;
      const keyed0 = objectsOf(svc0[fam]).filter(z => typeof z.institution === 'string');
      if (!keyed0.length) continue;
      svc[fam] = list.filter(e => !(isRec(e) && !Object.prototype.hasOwnProperty.call(e, 'institution') && keyed0.some(z => heldBy(z, e))));
    }
  }

  // registry: economy.complexity ((a): prosperity.js :: deriveEconomicComplexity over the served rows; unreadable: withheld)
  if (es && 'economicComplexity' in es) {
    if (typeof es.tier === 'string' && Array.isArray(es.incomeSources) && Array.isArray(es.primaryExports)) {
      const rows = /** @type {unknown[]} */ (es.incomeSources);
      const pct = (/** @type {unknown} */ r) => (isRec(r) && typeof r.percentage === 'number' ? r.percentage : null);
      let cnt = rows.length;
      if (rows.some(r => { const v = pct(r); return v !== null && v * 2 >= 100; })) cnt = Math.min(cnt, 5);
      else if (rows.some(r => { const v = pct(r); return v !== null && v >= 20; })) cnt = Math.min(cnt, 8);
      const mkt = houses.some(h => { const n = caseFold(str(h.name)); return ['market', 'trading', 'merchant', 'guild'].some(w => n.includes(w)); });
      const exp = es.primaryExports.length;
      const tier = es.tier;
      let lbl = tier === 'metropolis' || tier === 'city'
        ? (cnt >= 9 ? `Highly diversified ${DASH} multiple major revenue streams` : cnt >= 6 ? `Diversified ${DASH} broad institutional economic base` : `Concentrated ${DASH} fewer revenue streams than scale suggests`)
        : tier === 'town' ? (mkt && cnt >= 6 ? 'Diversified market economy' : cnt >= 4 ? 'Specialized production and trade' : `Limited ${DASH} narrow economic base for this scale`)
          : tier === 'village' ? (mkt ? 'Mixed subsistence and market' : exp >= 4 ? 'Agricultural surplus with trade links' : 'Subsistence with minor surplus')
            : exp >= 3 ? 'Subsistence with surplus' : `Subsistence ${DASH} survival economy`;
      const food = recAt(es, 'foodSecurity');
      const rec = food ? food.foodRecord : undefined;
      if (truthy(rec) && !truthy(isRec(rec) ? rec.growsMoreThanEats : undefined) && /surplus/i.test(lbl)) lbl = `Subsistence ${DASH} survival economy`;
      es.economicComplexity = lbl;
    } else {
      delete es.economicComplexity;
    }
  }
  const sp = es ? recAt(es, 'safetyProfile') : null;
  if (sp) {
    // registry: safety.economicDragDesc ((b): where a hidden house raised hasCriminalInst or hasMarket, or carried an organised name; VR42).
    // R3-TELL-3 (ruling 62 (2)): SERVED AS null, the empty form nothing-hidden pages show (the generator writes null where the
    // black-market share is low); the key is never deleted and never ''
    if ('economicDragDesc' in sp && (raised.hasCriminalInst || raised.hasMarket || gone.some(g => ORGANISED_HOUSE_WORDS.some(w => g.includes(w))))) sp.economicDragDesc = null;
    // registry: safety.guardEffectivenessDesc ((a): the gates tail for the served houses, safetyLineTruth.js :: gatesSmugglersLine)
    if (!beneath && typeof sp.guardEffectivenessDesc === 'string') {
      sp.guardEffectivenessDesc = sp.guardEffectivenessDesc.replace(GATES_BENEATH, ' Everyone comes and goes by the gates, so smugglers have to get past the $1.');
    }
    // registry: safety.safetyDesc ((a) the foothold word; the Very Safe gates line and a criminal-governance line a hidden house raised: withheld)
    if (typeof sp.safetyDesc === 'string') {
      const sd = sp.safetyDesc;
      if ((!beneath && sd.includes(VERY_SAFE_BENEATH)) || (sd.includes('The criminals are the government here.') && raised.hasCriminalInst)) delete sp.safetyDesc;
      else if (sd.includes(FOOTHOLD) && sfl.hasCriminalInst !== true
        && !houses.some(h => /thieves|criminal|gang|smuggler|fence|gambl/i.test(`${str(h.name)} ${str(h.catalogId)}`))) {
        sp.safetyDesc = sd.split(FOOTHOLD).join('organized crime has found no foothold.');
      }
    }
    // registry: safety.crimeTypes ((b) by attribution, VR39; no type, or a type the map does not hold (R3-CURE unit 3): unsure,
    // withheld; VR29: still an array)
    if (Array.isArray(sp.crimeTypes)) {
      sp.crimeTypes = sp.crimeTypes.filter(c => isRec(c) && typeof c.type === 'string'
        && Object.prototype.hasOwnProperty.call(CRIME_TYPE_RAISERS, c.type) && !CRIME_TYPE_RAISERS[c.type].some(f => raised[f]));
    }
    // registry: safety.plotHooks ((b): a hook of the pool no hidden house raised; a hook the pool does not hold: withheld)
    if (Array.isArray(sp.plotHooks)) {
      sp.plotHooks = sp.plotHooks.filter(h => typeof h === 'string' && Object.prototype.hasOwnProperty.call(SAFETY_HOOK_RAISERS, h)
        && !SAFETY_HOOK_RAISERS[h].some(f => raised[f]));
    }
  }
  // the served crime signal (crimeSignal.js :: crimeSignalOf)
  const crimHouse = houses.some(h => asciiLowerOf(h.category) === 'criminal' || asciiLowerOf(h.priorityCategory) === 'criminal');
  const signal = crimHouse || objectsOf(ps?.factions).some(f => asciiLowerOf(f.category) === 'criminal');
  // R3-TELL-5b unit (iii) (the chair's ruling 73 (2); ruling 74 (iii)): WHERE THE SERVED CRIME SIGNAL IS FALSE (no criminal
  // house and no criminal power this read serves), no served power (either list) and no relation carries `captureState`:
  // the hall's birth seed on the governing row (hallCapture.js :: writeHallCapture) and a capture relation's rung
  // (factionDynamics.js :: withCaptureRelations) leave, THE KEY only (the open place's form: no nothing-hidden page of the
  // pool serves one without a criminal house or power, at any size; ruling 47: no husk). A criminal governing power (VR42) is
  // a served criminal power: its row and its rung stay. `criminalCaptureState` is not touched here. SQL twin: 212, the same rule
  // registry: power.captureState
  if (!signal) {
    const noCapture = (/** @type {unknown} */ x) => (isRec(x) && Object.prototype.hasOwnProperty.call(x, 'captureState') ? (({ captureState: _c, ...rest }) => rest)(x) : x);
    for (const holder of [ps, s]) if (holder && Array.isArray(holder.factions)) holder.factions = holder.factions.map(noCapture);
    if (ps && Array.isArray(ps.factionRelationships)) ps.factionRelationships = ps.factionRelationships.map(noCapture);
  }
  const hist = recAt(s, 'history');
  // registry: history.tension.crimeWave ((b): where the served crime signal is false)
  if (hist && !signal && Array.isArray(hist.currentTensions)) hist.currentTensions = hist.currentTensions.filter(t => !(isRec(t) && t.type === 'crime_wave'));
  // registry: history.event.crimeWave ((b): an event of type crime_wave and its timeline copy, where no served criminal house stands)
  if (hist && !crimHouse) {
    for (const key of ['historicalEvents', 'eventsTimeline']) {
      if (Array.isArray(hist[key])) hist[key] = /** @type {unknown[]} */ (hist[key]).filter(e => !(isRec(e) && e.type === 'crime_wave'));
    }
  }
  // registry: institutions.desc ((b): a description of a declared pair the roster-moved fact 'rival power' chose)
  for (const h of houses) if (typeof h.desc === 'string' && RIVAL_POWER_DESCS.includes(h.desc)) delete h.desc;
  // registry: prose.criminal ((b): the criminal desk, by the house's eye)
  const blocks = recAt(recAt(s, 'publicProse') || {}, 'blocks');
  if (blocks) delete blocks['defense:criminal'];
}

/** @param {Rec} d @returns {Rec | null} the served safety profile */
function es0(d) {
  const es = recAt(d, 'economicState');
  return es ? recAt(es, 'safetyProfile') : null;
}

/**
 * R3-CURE (unit 2) and R3-CURE-2 (units 1, 4 (i); the chair's ruling 28 of 08:22 and 09:04: THE NAME SEARCH), in place:
 * THE WITHHELD POWERS (every power of `pub`'s two lists that neither served list names) leave every STRUCTURED copy: a
 * conflict between powers (both lists) and a tension naming one, whole; a power's contestsNiche naming one; a person's
 * membership of one, an affiliation key naming one, the goal that targets or names one, and (R3-CURE-2, found by the fold:
 * "faction.thieves_guild" under Reveal DM) a simulation-trace entry a top-level string of which names one, whole, the trace
 * renumbered dense after (VR21: renumberTrace, 212's own rule). A NAME is searched FOLDED, as
 * itself AND as its BARE FORM (without its bracketed qualifier), at the name boundary: the lane's own search
 * (gallerySecondHomes.js :: buildNameSearch; the served powers' names its open names); an ID as a STRING (a number id by its
 * String()), the whole value. Prose over the powers is R5's (power.desc). SQL twin: 212 :: _gallery_veil_roster_choices.
 * @param {Rec} s @param {Rec} pub @param {Rec | null} ps
 */
function withholdPowerCopies(s, pub, ps) {
  const servedNames = new Set([...objectsOf(ps?.factions), ...objectsOf(s.factions)].flatMap(powerNamesOf));
  const out = [...objectsOf(recAt(pub, 'powerStructure')?.factions), ...objectsOf(pub.factions)]
    .filter(f => ![str(f.faction), str(f.name)].some(n => servedNames.has(n)));
  const wIds = new Set(out.map(f => idText(f.id)).filter(v => v !== ''));
  const search = buildNameSearch(out.flatMap(powerNamesOf).filter(v => v !== ''), servedNames);
  if (!search && wIds.size === 0) return;
  /** @param {unknown} v @returns {boolean} the value names a withheld power: an id by its String(), a name by the fold */
  const named = (v) => (typeof v === 'number' && wIds.has(idText(v))) || (typeof v === 'string' && v !== '' && (wIds.has(v) || (!!search && search.hit(v))));
  const recNames = (/** @type {Rec} */ x) => [x.faction, x.name, x.id].some(named);
  // R3-CURE-4 (unit 1; the chair, 11:12: "a goal naming a withheld power LEAVES WITH IT: the whole goal, every field of it; a
  // husk is a tell"): each structured copy is judged on what it held BEFORE any pass stripped it. The hidden-house name sweep
  // (withholdSecondHomes :: sweepHiddenNames, before this pass) takes the withheld power's name out of a goal's sentence and
  // its target id, a conflict's parties, a tension's factions, a membership's `power`; the copy then names nothing and was
  // served as a husk. So a served copy also leaves where its counterpart in `pub` (the projection the veil ran on) named a
  // withheld power: a person's goal by the person's id; any other copy where a naming counterpart in the same place holds it
  // (heldBy: jsonb containment, 212's `@>`; a remnant is held by what it was cut from)
  const conflictNames = (/** @type {unknown} */ c) => isRec(c) && Array.isArray(c.parties) && c.parties.some(pn => named(pn) || (isRec(pn) && recNames(pn)));
  const tensionNames = (/** @type {unknown} */ t) => isRec(t) && Array.isArray(t.factions) && t.factions.some(x => typeof x === 'string' && named(x));
  const memberNames = (/** @type {unknown} */ m) => isRec(m) && [m.power, m.faction, m.name, m.id].some(named);
  /** @param {unknown} g */
  const goalNames = (g) => {
    if (!isRec(g)) return false;
    const intent = recAt(g, 'intent') || {};
    const tid = (/** @type {string} */ k) => (recAt(recAt(intent, k) || {}, 'target') || {}).id;
    return named(tid('short')) || named(tid('long')) || (!!search && (search.hit(str(g.short)) || search.hit(str(g.long))));
  };
  /** @param {unknown} list0 @param {(x: unknown) => boolean} names @param {unknown} e */
  const husk = (list0, names, e) => isRec(e) && objectsOf(list0).some(z => names(z) && heldBy(z, e));
  for (const [holder, holder0] of /** @type {Array<[Rec | null, Rec | null]>} */ ([[ps, recAt(pub, 'powerStructure')], [s, pub]])) {
    if (holder && Array.isArray(holder.conflicts)) {
      const c0 = holder0 ? holder0.conflicts : null;
      holder.conflicts = holder.conflicts.filter(c => !(conflictNames(c) || husk(c0, conflictNames, c)));
    }
  }
  const hist0 = recAt(s, 'history');
  if (hist0 && Array.isArray(hist0.currentTensions)) {
    const t0 = recAt(pub, 'history')?.currentTensions;
    hist0.currentTensions = hist0.currentTensions.filter(t => !(tensionNames(t) || husk(t0, tensionNames, t)));
  }
  for (const holder of [ps, s]) {
    if (holder && Array.isArray(holder.factions)) {
      holder.factions = holder.factions.map(f => (isRec(f) && typeof f.contestsNiche === 'string' && named(f.contestsNiche) ? (({ contestsNiche: _c, ...rest }) => rest)(f) : f));
    }
  }
  if (Array.isArray(s.npcs)) {
    s.npcs = s.npcs.map(n => {
      if (!isRec(n)) return n;
      const o = { ...n };
      for (const k of NPC_AFFILIATION_KEYS) if (typeof o[k] === 'string' && named(o[k])) delete o[k];
      // the same person before the sweep: its goal and its memberships as the projection held them. R3-CURE-5 (the chair,
      // 14:21 UTC: A GAP TOWARD SENDING, the id was matched only where it was a string): the person by its id AS TEXT for any
      // scalar id (idKeyOf); a person with NO id is judged against EVERY person of `pub`: its goal or a membership leaves where
      // a naming pre-sweep one holds it (heldBy, 212's `@>`)
      const key = idKeyOf(o.id);
      const before = key !== '' ? objectsOf(pub.npcs).filter(q => idKeyOf(q.id) === key) : [];
      const anyone = key === '' ? objectsOf(pub.npcs) : [];
      if (isRec(o.goal) && (goalNames(o.goal) || before.some(q => goalNames(q.goal)) || anyone.some(q => goalNames(q.goal) && heldBy(q.goal, o.goal)))) delete o.goal;
      if (Array.isArray(o.memberships)) {
        const m0 = (key !== '' ? before : anyone).flatMap(q => objectsOf(q.memberships));
        o.memberships = o.memberships.filter(m => !(memberNames(m) || husk(m0, memberNames, m)));
      }
      return o;
    });
  }
  if (Array.isArray(s.simulationTrace)) {
    const nt = s.simulationTrace.length;
    const kept = s.simulationTrace.filter(e => !(isRec(e) && Object.values(e).some(v => typeof v === 'string' && named(v))));
    s.simulationTrace = kept;
    if (kept.length < nt) renumberTrace(s);
  }
}

/** R3-CURE-4: jsonb containment as 212 reads it (its containment operator) below the top level: an object holds every key of `b` with a value
 * that holds `b`'s; an array holds each element of `b` in some element of its own; a scalar is equal (JSON's own values).
 * @param {unknown} a @param {unknown} b @returns {boolean} */
function heldBy(a, b) {
  if (isRec(a) && isRec(b)) return Object.keys(b).every(k => Object.prototype.hasOwnProperty.call(a, k) && heldBy(a[k], b[k]));
  if (Array.isArray(a) && Array.isArray(b)) return b.every(y => a.some(x => heldBy(x, y)));
  return !isRec(a) && !Array.isArray(a) && !isRec(b) && !Array.isArray(b) && a === b;
}

/** R3-CURE-5: a person's id AS TEXT: a non-empty string as itself, a finite number or a boolean by its String() (212: the
 * jsonb scalar's text, `->>`); anything else, the empty string included, '' (no id). @param {unknown} v @returns {string} */
function idKeyOf(v) {
  return typeof v === 'string' ? v : (typeof v === 'number' && Number.isFinite(v)) || typeof v === 'boolean' ? String(v) : '';
}

/** An id as a string: a string as itself, a finite number by its String() (212: the JSON number's text). @param {unknown} v @returns {string} */
function idText(v) {
  return typeof v === 'string' ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : '';
}

/** Whether the shares' EXACT decimal sum is 100 (212: sum(power::numeric) = 100): each share by its decimal spelling
 * (String(), the spelling JSON writes and 212's numeric reads), summed as integers at one scale. @param {number[]} vals */
function sumIsHundred(vals) {
  /** @type {Array<[bigint, number]>} */
  const parts = [];
  for (const v of vals) {
    const m = /^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i.exec(String(v));
    if (!m) return false;
    const frac = m[3] || '';
    parts.push([BigInt(`${m[1]}${m[2]}${frac}`), Number(m[4] || 0) - frac.length]);
  }
  const e = Math.min(0, ...parts.map(([, x]) => x));
  /** @param {number} k @returns {bigint} ten to the k, by repeated multiplication (k from 0 to a few hundred) */
  const p10 = (k) => { let r = 1n; for (let i = 0; i < k; i += 1) r *= 10n; return r; };
  let sum = 0n;
  for (const [d, x] of parts) sum += d * p10(x - e);
  return sum === 100n * p10(-e);
}

/** The list with each power's share re-derived to 100 by LARGEST REMAINDER from `power` (VR11/VR31; a sum of 0 shares
 * equally; ties by order): the SQL twin's re-derivation. @param {unknown[]} list @returns {unknown[]} */
function largestRemainder(list) {
  let basis = objectsOf(list).map(f => shareBasis(f.power) ?? 0);
  let total = 0;
  for (const b of basis) total += b;
  if (!(total > 0)) { basis = basis.map(() => 1); total = basis.length; }
  const q = basis.map(b => (b / total) * 100);
  const shares = q.map(v => Math.floor(v));
  let give = 100 - shares.reduce((a, v) => a + v, 0);
  const order = q.map((_v, i) => i).sort((a, b) => ((q[b] - shares[b]) - (q[a] - shares[a])) || (a - b));
  for (const i of order) { if (give <= 0) break; shares[i] += 1; give -= 1; }
  let k = 0;
  return list.map(f => (isRec(f) ? { ...f, power: shares[k++] } : f));
}

/** The SQL twin's _gallery_veil_truthy. @param {unknown} v @returns {boolean} */
function truthy(v) {
  if (typeof v === 'string') return v !== '';
  if (typeof v === 'number') return v !== 0 && !Number.isNaN(v);
  if (typeof v === 'boolean') return v;
  return isRec(v) || Array.isArray(v);
}

