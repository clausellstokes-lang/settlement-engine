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
import { caseFold, rosterHouses } from './gallerySecondHomes.js';

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
/** Each crime type by the house flags that raise it (safetyProfile.js; priorityHelpers.js :: getStressFlags). */
const CRIME_TYPE_RAISERS = Object.freeze(/** @type {Record<string, string[]>} */ ({ Smuggling: ['hasSmuggling'], 'Organized guild crime': ['hasThievesGuild', 'hasCriminalInst'],
  'Street gang activity': ['hasGangInfra'], 'Criminal governance': ['hasCriminalInst'], 'Arcane black market': ['hasCriminalInst'],
  'Religious fraud': ['hasCriminalInst'], 'Commercial crime': ['hasCriminalInst'], 'Survival crime': ['hasCriminalInst'],
  'Magical crime': ['hasCriminalInst'], 'Background crime': ['hasCriminalInst'], Lawlessness: ['hasCriminalInst'] }));
const AUTHORITY_HOOK = 'Someone approached the party seeking legitimate authority to settle a dispute. The only "authority" here is ';
/** Each hook of the safety profile's closed pool by the flags that raise it ([]: raised by no house). */
const SAFETY_HOOK_RAISERS = Object.freeze(/** @type {Record<string, string[]>} */ ({
  'A local family wants evidence of tax extortion gathered quietly, but the extorter wears an official badge.': [],
  'The garrison chaplain and the commander are the same person, who is authorizing military action for reasons that sound theological.': [],
  [`${AUTHORITY_HOOK}the guild.`]: ['hasCriminalInst'],
  [`${AUTHORITY_HOOK}whoever holds this quarter.`]: ['hasCriminalInst'],
  [`${AUTHORITY_HOOK}whoever holds this stretch of road.`]: ['hasCriminalInst'],
  "A part from the wizard's tower has gone missing, and the black market has it; the fence wants a price the wizard will not pay.": ['hasCriminalInst'],
  'A pilgrim paid a fortune for a holy relic that is obviously fake. They want the fraud exposed without losing their faith in the process.': ['hasCriminalInst'],
  'A guild merchant hired the party, then asked for something the guild forbids; the pay is good, and someone else in the guild already knows.': ['hasCriminalInst'],
  "The merchant guild's private security force just detained someone, with no legal authority to do so. The watch is looking the other way.": ['hasGangInfra'],
  'The smuggling network is moving something unusual this week, not the normal contraband. Someone wants to know what it is before it arrives.': ['hasSmuggling'],
  'A smuggler wants one crate moved quietly and will pay well, but will not say what is in it.': ['hasSmuggling'],
  'The smugglers have stopped moving their usual goods this week, and nobody can say why.': ['hasSmuggling'],
  'A smuggled load went missing on the way in, and the people who paid for it are asking questions.': ['hasSmuggling'],
  'The smugglers have gone quiet since the siege closed the roads, and someone wants to know what their last load was.': ['hasSmuggling'],
  'The last smuggled load before the siege went missing, and the people who paid for it are asking questions.': ['hasSmuggling'],
}));
/** The three declared pairs the roster-moved fact 'rival power' chooses between (institutionDescVariants.js, TAIL-HOUSES-5 batch 8). */
const RIVAL_POWER_DESCS = Object.freeze([
  'Wealthy merchant families hold exclusive civic power; political office is effectively purchased.',
  'Wealthy merchant families hold the civic offices; political office is effectively purchased.',
  'Civic power belongs solely to the wealthy merchant families, and office is bought in all but name.',
  'Civic power rests with the wealthy merchant families, and office is bought in all but name.',
  'A handful of rich merchant houses monopolise power here; a political post is, in practice, something one purchases.',
  'A handful of rich merchant houses hold the seat of power here; a political post is, in practice, something one purchases.',
]);
const ROSTER_FLAGS = Object.freeze(['hasCriminalInst', 'hasSmuggling', 'hasThievesGuild', 'hasGangInfra', 'hasMarket']);
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
  if (whole && ps && Array.isArray(ps.factions)) {
    ps.factions = ps.factions.filter(f => !(isRec(f) && f.isGoverning !== true
      && (asciiLowerOf(f.category) === 'criminal' || /thie/i.test(str(f.faction !== undefined ? f.faction : f.name)))));
  }
  // registry: power.share (VR11, VR31: wherever any power is withheld, re-derived to 100 by largest remainder from `power`)
  const n0 = objectsOf(recAt(pub, 'powerStructure')?.factions).length;
  const n1 = objectsOf(ps?.factions).length;
  // (VR31: a power the projection itself withheld, a hidden one off a Reveal-DM read, leaves the shares short of 100)
  // (a share set: every served power carries a number; an old record whose powers carry none has none to re-derive)
  const shares = n1 > 0 && objectsOf(ps?.factions).every(f => typeof f.power === 'number');
  const withheld = n1 < n0 || (shares && objectsOf(ps?.factions).reduce((a, f) => a + Number(f.power), 0) !== 100);
  if (ps && withheld && shares && Array.isArray(ps.factions)) {
    let basis = objectsOf(ps.factions).map(f => shareBasis(f.power) ?? 0);
    let total = 0;
    for (const b of basis) total += b;
    if (!(total > 0)) { basis = basis.map(() => 1); total = basis.length; }
    const q = basis.map(b => (b / total) * 100);
    const shares = q.map(v => Math.floor(v));
    let give = 100 - shares.reduce((a, v) => a + v, 0);
    const order = q.map((_v, i) => i).sort((a, b) => ((q[b] - shares[b]) - (q[a] - shares[a])) || (a - b));
    for (const i of order) { if (give <= 0) break; shares[i] += 1; give -= 1; }
    let k = 0;
    ps.factions = /** @type {unknown[]} */ (ps.factions).map(f => (isRec(f) ? { ...f, power: shares[k++] } : f));
  }
  // registry: power.relation.entry
  // registry: power.relation.direction (VR37 (b): the word goes with its relation)
  if (ps && withheld && Array.isArray(ps.factionRelationships)) {
    const names = new Set(objectsOf(ps.factions).flatMap(f => [f.faction, f.name].filter(v => typeof v === 'string')));
    ps.factionRelationships = ps.factionRelationships.filter(r => isRec(r) && Array.isArray(r.pair) && r.pair.length > 0
      && r.pair.every(n => typeof n === 'string' && names.has(n)));
  }
  if (!whole) return;

  const instOf = (/** @type {Rec} */ d) => recAt(recAt(recAt(recAt(d, 'economicState') || {}, 'safetyProfile') || {}, 'compound') || {}, 'inst')
    || recAt(recAt(recAt(d, 'economicState') || {}, 'compound') || {}, 'inst') || {};
  const fl = instOf(pub);
  const sfl = instOf(s);
  /** @type {Record<string, boolean>} */
  const raised = Object.fromEntries(ROSTER_FLAGS.map(k => [k, sfl[k] !== true && fl[k] !== false]));
  const beneath = houses.some(h => BENEATH_THE_WALLS.test(str(h.name)));
  const es = recAt(s, 'economicState');

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
    // registry: safety.economicDragDesc ((b): where a hidden house raised hasCriminalInst or hasMarket, or carried an organised name; VR42)
    if ('economicDragDesc' in sp && (raised.hasCriminalInst || raised.hasMarket || gone.some(g => ORGANISED_HOUSE_WORDS.some(w => g.includes(w))))) delete sp.economicDragDesc;
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
    // registry: safety.crimeTypes ((b) by attribution, VR39; no type: unsure, withheld; VR29: still an array)
    if (Array.isArray(sp.crimeTypes)) {
      sp.crimeTypes = sp.crimeTypes.filter(c => isRec(c) && typeof c.type === 'string'
        && !(Object.prototype.hasOwnProperty.call(CRIME_TYPE_RAISERS, c.type) ? CRIME_TYPE_RAISERS[c.type] : []).some(f => raised[f]));
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

/** The SQL twin's _gallery_veil_truthy. @param {unknown} v @returns {boolean} */
function truthy(v) {
  if (typeof v === 'string') return v !== '';
  if (typeof v === 'number') return v !== 0 && !Number.isNaN(v);
  if (typeof v === 'boolean') return v;
  return isRec(v) || Array.isArray(v);
}

