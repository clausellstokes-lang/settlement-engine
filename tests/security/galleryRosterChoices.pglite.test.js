/**
 * galleryRosterChoices.pglite.test.js — R3 (VEIL-22's builder; SUB-BRIEF-VR7 point 5; the chairs' VR7, VR11/VR31, VR21,
 * VR29, VR39, VR42 and the power observable of 03:15 UTC, each vetoable by the owner): THE DRAWN CONDITIONAL ROWS, where a
 * house is hidden whole, on every non-owner read.
 *
 * THROUGH THE SERVER (VR15): born towns stored on a pglite chain of every migration on disk, each shared with the three
 * family groupings and the plot-hooks tab OPENED by hand and every hideable house hidden whole (the default veil's houses),
 * Reveal DM off and on; a CONTROL share whose DM SHOWS every hideable house by hand; and the default veil (the groupings
 * shut). Read as a non-owner by the gallery read, the party link, the import and the campaign map's member. Each row of the
 * roster-choice registry whose server is 212 :: _gallery_veil_roster_choices holds there:
 *   VR39: no served crime type that no town of the hidden-free pool has (the counterfactual births with every hideable
 *     house taken out, and the born towns that hold none); a town whose criminal house the DM SHOWS keeps its types;
 *     VR29: crimeTypes stays an array, absent only where block:defense.criminalStructure is shut.
 *   THE POWER OBSERVABLE / VR42: no served criminal power but the governing one; the governing row IS served.
 *   VR11 / VR31: the served shares sum to 100 wherever any power is withheld; no served relation names an unserved power.
 *   (a) economy.complexity: the engine's own ladder over the served rows; the gates tail and the foothold word as the
 *     engine writes them for the served houses. (b) the rest absent where a hidden house could have chosen them.
 * The owner's record keeps every row. The client twin (projectShareVeil over galleryPayloadFor) sends what the server
 * sends at every R3 path. RED at R3's base (d136940c3): docs/chair/2026-11-20/veil/out/v21/r3/red.txt.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { appendFileSync, readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { bootChain, BIRTH_DIALS, OWNER } from './veilChain.shared.mjs';
import { buildNameSearch } from '../../src/domain/display/gallerySecondHomes.js';

const ARM_TIMEOUT_MS = 600_000; // deadlock guard for the twin arm (it projects every read again), not a perf budget
const PGLITE_BOOT_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget — never tune to a measured boot (see pgliteHookTimeoutRatchet.test.js)
const READER = '22222222-2222-2222-2222-222222222222';
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const J = (v) => JSON.stringify(v);
/** The measures the hand-back quotes, to R3_MEASURES where it is set (the config silences the console). */
const note = (...a) => { if (process.env.R3_MEASURES) appendFileSync(process.env.R3_MEASURES, `${a.join(' ')}\n`); };
/** A stable spelling (keys sorted): a jsonb column gives keys back in its own order. */
const canon = (v) => JSON.stringify(v, (_k, x) => (isRec(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));
// the measure's seeds (out/v21/r3/measure.txt): each row's case among them, and four towns with no hideable house
const SEEDS = ['town-infiltrated-0-12', 'city-insurgency-1-104', 'city-infiltrated-0-32', 'city-politically_fractured-0-40', 'city-none-1-113',
  'metropolis-infiltrated-0-62', 'city-infiltrated-1-112', 'metropolis-none-0-61', 'city-insurgency-0-44', 'metropolis-indebted-0-56',
  'town-indebted-0-16', 'city-under_siege-0-48', 'village-insurgency-0-4', 'town-politically_fractured-0-20', 'city-indebted-0-36', 'metropolis-insurgency-0-64'];
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const BENEATH = /smuggling (?:network|operation)|underground (?:network|city)/i;
const RIVAL_TEXTS = ['Wealthy merchant families hold exclusive civic power; political office is effectively purchased.',
  'Wealthy merchant families hold the civic offices; political office is effectively purchased.',
  'Civic power belongs solely to the wealthy merchant families, and office is bought in all but name.',
  'Civic power rests with the wealthy merchant families, and office is bought in all but name.',
  'A handful of rich merchant houses monopolise power here; a political post is, in practice, something one purchases.',
  'A handful of rich merchant houses hold the seat of power here; a political post is, in practice, something one purchases.'];
const SMUGGLING_HOOK = /smuggl/i;
// R3-CURE (VEIL-23's builder; the chair's rulings of 07:31 and 07:39 UTC): THE HAND TOWN. The house "Thieves' guild chapter"
// (hideable: the default veil hides it whole) raises the power "Thieves' Guild"; the power has a copy at every structured
// place the born measure found one, and an id; the safety profile holds a crime type no map holds.
const TG = "Thieves' Guild";
const TG_ID = 'faction.thieves-guild-7q';
const HAND = Object.freeze({
  name: 'Hollowmere', tier: 'town',
  institutions: [{ id: 'inst-tgc', name: "Thieves' guild chapter", category: 'Criminal', desc: 'A chapter of the guild.' },
    { id: 'inst-fish', name: 'Fish market', category: 'Economy', desc: 'Fish, salted and fresh.' }],
  powerStructure: {
    factions: [{ faction: 'Town Council', category: 'civic', power: 50, isGoverning: true, desc: 'The council sits weekly.' },
      { id: TG_ID, faction: TG, category: 'criminal', power: 30, desc: 'The guild takes its cut.' },
      { faction: 'Fishers', category: 'economic', power: 20, desc: 'The fishers keep the quay.', contestsNiche: TG }],
    factionRelationships: [{ pair: ['Town Council', TG], type: 'rival', direction: 'mutual' }, { pair: ['Town Council', 'Fishers'], type: 'ally' }],
    conflicts: [{ parties: ['Town Council', TG], desc: `Town Council and ${TG} are in high conflict over the quay.` }, { parties: ['Town Council', 'Fishers'], desc: 'Town Council and Fishers argue over tolls.' }],
  },
  conflicts: [{ parties: ['Town Council', TG], desc: `Town Council and ${TG} are in high conflict over the quay.` }],
  npcs: [{ id: 'npc.ada', name: 'Ada Vell', role: 'Fishwife', memberships: [{ power: TG, role: 'member' }, { power: 'Fishers', role: 'member' }], factionAffiliation: TG_ID,
    goal: { short: `Be the one ${TG} sends.`, long: 'Own a boat.', intent: { short: { target: { id: TG_ID, kind: 'faction' } } } } },
  { id: 'npc.bo', name: 'Bo Tarn', role: 'Councillor', memberships: [{ power: 'Town Council', role: 'member' }], goal: { short: 'Keep the tolls.', long: 'Hold the chair.' } }],
  history: { currentTensions: [{ type: 'rivalry', factions: ['Town Council', TG], desc: 'Old grudges.' }, { type: 'trade', factions: ['Fishers'], desc: 'Tolls.' }] },
  economicState: { safetyProfile: { crimeTypes: [{ type: 'Planted unknown crime', desc: 'An entry whose type no map holds.' }, { type: 'debt evasion', desc: 'Debts dodged.' }] } },
});
// R3-CURE unit 1 (the chair, 07:31: VR42 beside THE POWER RULE): a town whose GOVERNING power the hidden house raised (no
// born town of 140 has one: out/v23/r3c/unit1-vr42-counterfactual.txt). VR42 holds: the governing row stays, with its name,
// its share and its relations; nothing is withheld, so the copies' search has nothing to look for (the rule that took it is said).
const HAND_GOVERNS = Object.freeze({
  name: 'Gallowsby', tier: 'town',
  institutions: [{ id: 'inst-tgc2', name: "Thieves' guild chapter", category: 'Criminal', desc: 'The chapter that runs the town.' },
    { id: 'inst-fish2', name: 'Fish market', category: 'Economy', desc: 'Fish.' }],
  powerStructure: {
    factions: [{ faction: TG, category: 'criminal', power: 60, isGoverning: true, desc: 'The guild governs.' }, { faction: 'Fishers', category: 'economic', power: 40, desc: 'The quay.' }],
    factionRelationships: [{ pair: [TG, 'Fishers'], type: 'rival', direction: 'mutual' }],
  },
  economicState: { safetyProfile: { crimeTypes: [] } },
});
// R3-CURE-2 (VEIL-24's builder, unit 1; the chair's ruling 28 of 08:22 and 09:04): THE FOLD. A withheld power whose name
// carries a bracketed qualifier, "Thieves' Guild (powerful)", named everywhere by its BARE form ("Thieves' Guild"), with a
// NUMBER id (unit 4 (i)): a membership { id: 7 } and a goal whose target id is 7 and whose sentences do not name it.
const TGP = "Thieves' Guild (powerful)";
const HAND_FOLD = Object.freeze({
  name: 'Brinewick', tier: 'town',
  institutions: [{ id: 'inst-tgc3', name: "Thieves' guild chapter", category: 'Criminal', desc: 'A chapter of the guild.' },
    { id: 'inst-rope', name: 'Ropewalk', category: 'Economy', desc: 'Rope, laid long.' }],
  powerStructure: {
    factions: [{ faction: 'Harbour Board', category: 'civic', power: 55, isGoverning: true, desc: 'The board sits at the tide.' },
      { id: 7, faction: TGP, category: 'criminal', power: 25, desc: 'The guild takes its cut.' },
      { faction: 'Ropers', category: 'economic', power: 20, desc: 'The ropers keep the walk.', contestsNiche: TG }],
    factionRelationships: [{ pair: ['Harbour Board', 'Ropers'], type: 'ally' }],
    conflicts: [{ parties: ['Harbour Board', TG], desc: 'A quarrel over the tide-tolls.' }, { parties: ['Harbour Board', 'Ropers'], desc: 'Rope prices.' }],
  },
  conflicts: [{ parties: [{ name: TG }, { name: 'Harbour Board' }], desc: 'A quarrel over the tide-tolls.' }],
  npcs: [{ id: 'npc.cass', name: 'Cass Orrin', role: 'Roper', memberships: [{ power: TG, role: 'member' }, { power: 'Ropers', role: 'member' }], factionAffiliation: TG,
    goal: { short: `Be the one the ${TG} sends.`, long: 'Own a walk.' } },
  { id: 'npc.dun', name: 'Dun Hale', role: 'Clerk', memberships: [{ id: 7, role: 'informer' }, { power: 'Harbour Board', role: 'member' }],
    goal: { short: 'Settle a debt.', long: 'Keep the ledger straight.', intent: { long: { target: { id: 7, kind: 'faction' } } } } },
  { id: 'npc.eli', name: 'Eli Marr', role: 'Harbourmaster', memberships: [{ power: 'Harbour Board', role: 'member' }],
    goal: { short: 'Win the board a vote.', long: 'Seat the board for good.', intent: { long: { target: { id: 'Harbour Board', kind: 'faction' } } } } }],
  history: { currentTensions: [{ type: 'rivalry', factions: ['Harbour Board', TG], desc: 'Old grudges.' }, { type: 'trade', factions: ['Ropers'], desc: 'Tolls.' }] },
  economicState: { safetyProfile: { crimeTypes: [] } },
});
// R3-CURE-3 (VEIL-24's builder; the chair's ruling A of 10:21 UTC): THE NAME'S FORMS IN A GOAL SENTENCE. The search is
// case-blind and counts a possessive and a plural ending as a boundary: one plant for each form ("the Thieves' Guild's", "thieves'
// guilds", "THE THIEVES' GUILD"), each sentence naming the withheld power and aiming nowhere. THE OTHER DIRECTION: a goal naming a
// SERVED power whose name contains the withheld one ("Old Thieves' Guild Watch") stays served byte for byte, its exemption the
// containing served name (the ONLY exemption: a hit lying wholly inside the name of a power the same document serves).
const TG_WATCH = "Old Thieves' Guild Watch";
const HAND_FORMS = Object.freeze({
  name: 'Saltmarch', tier: 'town',
  institutions: [{ id: 'inst-tgc4', name: "Thieves' guild chapter", category: 'Criminal', desc: 'A chapter of the guild.' },
    { id: 'inst-rope4', name: 'Ropewalk', category: 'Economy', desc: 'Rope, laid long.' }],
  powerStructure: {
    factions: [{ faction: 'Harbour Board', category: 'civic', power: 50, isGoverning: true, desc: 'The board sits at the tide.' },
      { faction: TG, category: 'criminal', power: 25, desc: 'The guild takes its cut.' },
      { faction: TG_WATCH, category: 'civic', power: 25, desc: 'Lamps and rounds.' }],
  },
  npcs: [{ id: 'npc.fen', name: 'Fen Aster', role: 'Boatwright', goal: { short: "Become the Thieves' Guild's fixer on the quay.", long: 'Own a boat.' } },
    { id: 'npc.gil', name: 'Gil Brack', role: 'Carter', goal: { short: "Pay off the thieves' guilds of the coast, one by one.", long: 'Buy a cart.' } },
    { id: 'npc.ivo', name: 'Ivo Tamsin', role: 'Net-mender', goal: { short: "Never cross THE THIEVES' GUILD again.", long: 'Mend nets.' } },
    { id: 'npc.hal', name: 'Hal Wenning', role: 'Lamplighter', goal: { short: `Stand a night shift with the ${TG_WATCH}.`, long: 'Keep the lamps lit.',
      intent: { long: { target: { id: TG_WATCH, kind: 'faction' } } } } },
    { id: 'npc.jon', name: 'Jon Pell', role: 'Cooper', goal: { short: 'Finish the barrels by the fair.', long: 'Train an apprentice.' } }],
  economicState: { safetyProfile: { crimeTypes: [] } },
});
// R3-CURE-5 (the chair's ruling of 14:21 UTC, from the lane's owner's read of dbff7eeb3: A GAP TOWARD SENDING): the pre-sweep
// person was found by id ONLY WHERE THE ID IS A STRING. Two plants: a person whose id is a NUMBER and a person with NO id, each
// with a goal aimed at and naming the withheld guild and a membership of it. The hidden house's catalogue name folds BARE to
// the guild's ("Thieves' guild (powerful)" -> "Thieves' guild", as on metropolis-7), so the house sweep strips the guild's
// name from the goal's sentence and target id and from the membership's `power`, BEFORE the copy pass: the husk to leave whole.
const HAND_IDS = Object.freeze({
  name: 'Tollhaven', tier: 'town',
  institutions: [{ id: 'inst-tgp5', name: "Thieves' guild (powerful)", category: 'Criminal', desc: 'The guild house.' },
    { id: 'inst-fish5', name: 'Fish market', category: 'Economy', desc: 'Fish.' }],
  powerStructure: {
    factions: [{ faction: 'Town Council', category: 'civic', power: 60, isGoverning: true, desc: 'The council sits weekly.' },
      { faction: TG, category: 'criminal', power: 25, desc: 'The guild takes its cut.' },
      { faction: 'Fishers', category: 'economic', power: 15, desc: 'The fishers keep the quay.' }],
  },
  npcs: [{ id: 41, name: 'Ida Numer', role: 'Fishwife', memberships: [{ power: TG, role: 'member' }, { power: 'Fishers', role: 'member' }],
    goal: { short: `Pay off ${TG} by spring.`, long: 'Keep the stall.', intent: { short: { target: { id: TG, kind: 'power' } } } } },
  { name: 'Nell Noid', role: 'Porter', memberships: [{ power: TG, role: 'fence' }],
    goal: { short: `Run errands for ${TG}.`, long: 'Save a dowry.', intent: { short: { target: { id: TG, kind: 'power' } } } } },
  { id: 'npc.ott', name: 'Ott Mere', role: 'Councillor', memberships: [{ power: 'Town Council', role: 'member' }],
    goal: { short: 'Keep the tolls.', long: 'Hold the chair.', intent: { short: { target: { id: 'Town Council', kind: 'power' } } } } },
  // R3-CURE-7 (ruling 53, condition 1: THE TOOTH): three more people, whose ids are `true`, `false` and the empty string, each
  // with a goal aimed at and naming the withheld guild and a membership of it (the sweep strips the husk first, as above). The
  // two boolean-id people also hold a SHOWN membership of the Fishers; the empty-id person holds a Fishers membership recorded
  // under the guild's id (the sweep drops it whole): a judgment by containment against every person (the no-id rule) would
  // take the boolean people's Fishers membership with it, a judgment by the id as text keeps it, so the twin and 212 part
  // wherever one engine reads a boolean id as no id and the other as its text
  { id: true, name: 'Tam Verity', role: 'Netmaker', memberships: [{ power: TG, role: 'member' }, { power: 'Fishers', role: 'member' }],
    goal: { short: `Win a place in ${TG}.`, long: 'Mend the nets.', intent: { short: { target: { id: TG, kind: 'power' } } } } },
  { id: false, name: 'Fay Falsen', role: 'Salter', memberships: [{ power: TG, role: 'lookout' }, { power: 'Fishers', role: 'member' }],
    goal: { short: `Keep watch for ${TG}.`, long: 'Salt the catch.', intent: { short: { target: { id: TG, kind: 'power' } } } } },
  { id: '', name: 'Em Blank', role: 'Carter', memberships: [{ power: TG, role: 'runner' }, { power: 'Fishers', role: 'member', id: TG }],
    goal: { short: `Carry the takings to ${TG}.`, long: 'Buy a mule.', intent: { short: { target: { id: TG, kind: 'power' } } } } }],
  economicState: { safetyProfile: { crimeTypes: [] } },
});
/** R3-CURE-7: the three people of the tooth, by name, with the memberships each keeps (a shown one, byte for byte). */
const HAND_IDS_TOOTH = Object.freeze([['the true-id person', 'Tam Verity', [{ power: 'Fishers', role: 'member' }]],
  ['the false-id person', 'Fay Falsen', [{ power: 'Fishers', role: 'member' }]], ['the empty-id person', 'Em Blank', []]]);
// R3-CURE-2 (unit 4 (ii)): THE SHARE SUM. Fractional shares whose exact decimal sum is 100 but whose double sum is not
// (0.1 + 64.1 + 35.8), and thirds whose double sum is 100 but whose exact decimal sum is not: the exact comparison in
// both engines (212: numeric; the twin: the decimal spelling). No hideable house; no power withheld.
const HAND_SHARES_A = Object.freeze({ name: 'Tollmere', tier: 'village', institutions: [{ id: 'inst-mill', name: 'Mill', category: 'Economy', desc: 'Grain.' }],
  powerStructure: { factions: [{ faction: 'Reeve', category: 'civic', power: 0.1, isGoverning: true }, { faction: 'Millers', category: 'economic', power: 64.1 }, { faction: 'Carters', category: 'economic', power: 35.8 }],
    factionRelationships: [{ pair: ['Reeve', 'Millers'], type: 'ally' }] } });
const HAND_SHARES_B = Object.freeze({ name: 'Threeways', tier: 'village', institutions: [{ id: 'inst-well', name: 'Well', category: 'Civic', desc: 'Water.' }],
  powerStructure: { factions: [{ faction: 'Elders', category: 'civic', power: 33.333333333333336, isGoverning: true }, { faction: 'Herders', category: 'economic', power: 33.333333333333336 }, { faction: 'Weavers', category: 'economic', power: 33.33333333333333 }],
    factionRelationships: [{ pair: ['Elders', 'Herders'], type: 'ally' }] } });
// R3-CURE-2 (unit 2; the chair's ruling 2: R3 IS NOT GREEN WHILE ANY TOWN DIFFERS): the 14 towns whose served Defense key
// differed from the house-free counterfactual's at the first cure (out/v23/r3c/unit4-counterfactual.txt), each born with
// its counterfactual and read through the open veil (Reveal DM off and on), both engines
const KEY_SEEDS = ['town-indebted-0-16', 'town-under_siege-1-88', 'metropolis-insurgency-1-124', 'city-none-0-37', 'city-wartime-0-49', 'town-under_siege-0-18',
  'town-insurgency-1-94', 'town-under_siege-1-98', 'city-under_siege-1-118', 'town-wartime-0-19', 'town-none-0-23', 'city-none-0-31', 'metropolis-wartime-0-59', 'town-none-1-91'];
const KEY_RANK = Object.freeze({ organized: 3, 'semi-organized': 2, diffuse: 1, null: 0 });
// R3-CURE-8 (ruling 55, the chair 16:45: THE TWIN SENDS MORE): the ten born towns of R3-TELL's STOP 1 (out/v27/tell/run2/
// tell-table.txt "PARITY BY TOWN"), on which the twin served `availableServices.criminal` rows carrying NO `institution` key
// (the hidden-house name sweep took '(street gang)' and '(thieves guild)' out of them) that 212 did not serve
const SVC_SEEDS = ['metropolis-politically_fractured-0-60', 'metropolis-insurgency-1-124', 'city-infiltrated-0-42', 'metropolis-politically_fractured-0-70',
  'metropolis-wartime-1-139', 'town-none-0-21', 'town-insurgency-0-14', 'town-under_siege-0-18', 'town-infiltrated-0-22', 'town-under_siege-1-98'];
/** R3-CURE-8: a family no catalogue writes, as custom content writes one (economyReconcilePass.js: `availableServices[typeKey]`). */
const SVC_CUSTOM_FAMILY = 'curiosities';
/** R3-CURE-8: THE HAND PLANT PER FAMILY, for each family the generator writes (servicesGenerator.js, read in beforeAll) and the
 * custom one: a row born with NO `institution` key; a row whose `institution` the hidden-house sweep takes ('(street gang)'
 * holds the hidden "Street gang"), so it reaches the roster pass with no key; a served house's row; the hidden house's row. */
const svcRowsOf = (fam) => [{ name: `Keyless ${fam}`, desc: 'A row born with no institution key.' },
  { name: `Swept ${fam}`, desc: 'A row the sweep leaves with no institution key.', institution: '(street gang)' },
  { name: `Served ${fam}`, desc: 'A served house offers it.', institution: 'Fish market' },
  { name: `Hidden ${fam}`, desc: 'The hidden house offers it.', institution: 'Street gang' }];
const handSvcOf = (families) => ({
  name: 'Keelmouth', tier: 'town',
  institutions: [{ id: 'inst-sg8', name: 'Street gang', category: 'Criminal', desc: 'The gang works the docks.' },
    { id: 'inst-fish8', name: 'Fish market', category: 'Economy', desc: 'Fish.' }],
  powerStructure: { factions: [{ faction: 'Town Council', category: 'civic', power: 70, isGoverning: true }, { faction: 'Fishers', category: 'economic', power: 30 }] },
  availableServices: Object.fromEntries(families.map((f) => [f, svcRowsOf(f)])),
  economicState: { safetyProfile: { crimeTypes: [] } },
});
const SVC_CRIM = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside'];
/** A record's own rows that reach the roster pass with no `institution` key, by family (an object without the key). */
const keylessOf = (d) => Object.entries(isRec(d?.availableServices) ? d.availableServices : {})
  .flatMap(([f, rows]) => (Array.isArray(rows) ? rows : []).filter((x) => isRec(x) && !Object.prototype.hasOwnProperty.call(x, 'institution')).map((x) => `${f}:${x.name}`));
/** The fields the Defense key reads (criminalStructureKey.js), each as a getter and a setter: the attribution swaps one. */
const KEY_FIELDS = {
  institutions: [(d) => d?.institutions, (d, v) => { d.institutions = v; }],
  powers: [(d) => d?.powerStructure?.factions, (d, v) => { d.powerStructure = { ...(d.powerStructure || {}), factions: v }; }],
  criminalInstitutions: [(d) => d?.economicState?.safetyProfile?.criminalInstitutions, (d, v) => { d.economicState = d.economicState || {}; d.economicState.safetyProfile = { ...(d.economicState.safetyProfile || {}), criminalInstitutions: v }; }],
  activeChains: [(d) => d?.economicState?.activeChains, (d, v) => { d.economicState = { ...(d.economicState || {}), activeChains: v }; }],
  incomeSources: [(d) => d?.economicState?.incomeSources, (d, v) => { d.economicState = { ...(d.economicState || {}), incomeSources: v }; }],
  servicesCriminal: [(d) => d?.availableServices?.criminal, (d, v) => { d.availableServices = { ...(d.availableServices || {}), criminal: v }; }],
};
/** The withheld powers of a read: every power name and id the stored lists hold that neither served list holds (R3-CURE-2,
 * unit 4 (i): an id that is a number, by its String()). */
function withheldOf(stored, d) {
  const lists = (x) => [...(Array.isArray(x?.powerStructure?.factions) ? x.powerStructure.factions : []), ...(Array.isArray(x?.factions) ? x.factions : [])].filter(isRec);
  const servedNames = new Set(lists(d).flatMap((f) => [f.faction, f.name, f.id].filter((v) => typeof v === 'string')));
  const out = new Set();
  for (const f of lists(stored)) {
    const names = [f.faction, f.name].filter((v) => typeof v === 'string' && v);
    if (names.length && !names.some((n) => servedNames.has(n))) for (const v of [...names, typeof f.id === 'number' ? String(f.id) : f.id]) if (typeof v === 'string' && v) out.add(v);
  }
  return [...out];
}
/** THE SEARCH (the chair, 07:39 UTC; R3-CURE-2: the ruling 28 of 08:22 and 09:04): every served string VALUE and every
 * object KEY that holds a token, by normalised path. A token that is not all digits is searched by THE LANE'S OWN FOLD
 * (gallerySecondHomes.js :: buildNameSearch: itself and its bare form, without its bracketed qualifier, folded, at the
 * name boundary); a number id (all digits) as its String(): a whole string value, a whole key, or a number at an `id`. */
function searchHits(doc, tokens, exempted = null) {
  const out = [];
  const nums = new Set(tokens.filter((t) => /^\d+$/.test(t)));
  // R3-CURE-5 (the chair's ruling 37 (a), the ONLY exemption): the served powers' and houses' names are the search's OPEN
  // names, and the exemption is POSITIVE: a string the bare search hits and the open search does not is exempt only where
  // the hit lies wholly inside a containing name this same document serves (cut that name out and the bare search finds
  // nothing); the containing name is said (`exempted`). Anything else the bare search hits is a hit (it fails closed).
  const opens = servedNamesOf(doc);
  const words = tokens.filter((t) => !nums.has(t));
  const bare = buildNameSearch(words, []);
  const search = buildNameSearch(words, opens);
  const hit = (t) => {
    if (nums.has(t)) return true;
    if (!bare || !bare.hit(t)) return false;
    if (search && search.hit(t)) return true;
    const holders = opens.filter((n) => t.includes(n) && bare.hit(n));
    if (!holders.length || bare.hit(holders.reduce((x, n) => x.split(n).join(' '), t))) return true;
    if (exempted) exempted.push({ text: t.slice(0, 80), holders });
    return false;
  };
  const stack = [[doc, '', '']];
  while (stack.length) {
    const [v, p, k0] = stack.pop();
    const norm = p.replace(/\[\d+\]/g, '[]');
    if (typeof v === 'string') { if (hit(v)) out.push({ path: norm, at: p, text: v.slice(0, 80) }); }
    else if (typeof v === 'number') { if (k0 === 'id' && nums.has(String(v))) out.push({ path: norm, at: p, text: String(v) }); }
    else if (Array.isArray(v)) v.forEach((x, i) => stack.push([x, `${p}[${i}]`, '']));
    else if (isRec(v)) for (const k of Object.keys(v)) {
      if (hit(k)) out.push({ path: `${norm}.{KEY}`, at: `${p}.${k}`, text: k });
      stack.push([v[k], p ? `${p}.${k}` : k, k]);
    }
  }
  return out;
}
/** The names of the powers (either stored list: `faction`, `name`) and the houses (`institutions[].name`) a document serves,
 * once each (R3-CURE-5: the search's open names; ruling 37 (a): "a power or house the SAME document serves"). */
function servedNamesOf(doc) {
  const powers = [...(Array.isArray(doc?.powerStructure?.factions) ? doc.powerStructure.factions : []), ...(Array.isArray(doc?.factions) ? doc.factions : [])].filter(isRec).flatMap((f) => [f.faction, f.name]);
  const houses = (Array.isArray(doc?.institutions) ? doc.institutions : []).filter(isRec).map((h) => h.name);
  return [...new Set([...powers, ...houses].filter((v) => typeof v === 'string' && v))];
}
/** R3-CURE-4 (VEIL-25's builder; the chair, 11:12 UTC: "a husk is a tell"): jsonb containment (`a @> b`) as PostgreSQL reads
 * it below the top level: an object holds every key of `b` with a value that holds `b`'s; an array holds each element of `b`
 * in some element of its own; a scalar is equal. `skip` names keys of `b` not read at this level. */
function holdsJ(a, b, skip = []) {
  // (R3-CURE-5: a skipped key is skipped only where its value is a NUMBER: a trace's `ts`, a power's re-derived share. A
  // membership's `power` is a NAME: skipped, it paired the served { power: 'Fishers', role: 'member' } with the withheld
  // { power: "Thieves' Guild", role: 'member' } beside it and read the served one as its husk: the hand-raised Reveal-DM
  // "npcs[].memberships[].power" of R3-CURE-4, in both engines, was this instrument's pairing, not a served husk)
  if (isRec(a) && isRec(b)) return Object.keys(b).every((k) => (skip.includes(k) && typeof b[k] === 'number') || (Object.prototype.hasOwnProperty.call(a, k) && holdsJ(a[k], b[k])));
  if (Array.isArray(a) && Array.isArray(b)) return b.every((y) => a.some((x) => holdsJ(x, y)));
  return !isRec(a) && !Array.isArray(a) && !isRec(b) && !Array.isArray(b) && a === b;
}
/** R3-CURE-4 unit 1, THE CLASS (the brief: "the search cannot see a husk because the name is gone, so compare the projection
 * with the served body by path"): every served OBJECT whose counterpart in the PRE-SWEEP projection `pub` held, in one of its
 * fields, a withheld power's name (the lane's fold, the served powers' names its open names) or id (a string, a number by its
 * String()), and which is served with that field removed or blanked. Counterparts: a record by key; a person by `id`; any
 * other list's element by containment (the served element held by an unused projection element, `ts` and `power` aside: the
 * trace is renumbered and the shares re-derived). A field whose whole value IS the name or id (or an array holding it) is
 * STRUCTURED; a sentence naming it is PROSE. Returns { compared, husks: [{ path, kind }] }. */
/** An id as text: a string as itself, a finite number or a boolean by its String(); anything else '' (no id). */
const idKey = (v) => (typeof v === 'string' ? v : (typeof v === 'number' && Number.isFinite(v)) || typeof v === 'boolean' ? String(v) : '');
function husksOf(pub, doc, withheld, opens) {
  const nums = new Set(withheld.filter((t) => /^\d+$/.test(t)));
  const ids = new Set(withheld);
  const search = buildNameSearch(withheld.filter((t) => !nums.has(t)), opens);
  const exact = (v) => (typeof v === 'number' && ids.has(String(v))) || (typeof v === 'string' && v !== '' && ids.has(v));
  const named = (v) => exact(v) || (typeof v === 'string' && v !== '' && !!search && search.hit(v));
  const out = { compared: 0, husks: [] };
  const walk = (x, y, p) => {
    if (isRec(x) && isRec(y)) {
      out.compared += 1;
      for (const k of Object.keys(x)) {
        const v = x[k]; const at = p ? `${p}.${k}` : k;
        if (typeof v === 'string' || typeof v === 'number') {
          if (named(v) && !(Object.prototype.hasOwnProperty.call(y, k) && y[k] === v)) out.husks.push({ path: at, kind: exact(v) ? 'structured' : 'prose' });
        } else if (Array.isArray(v) && v.some((e) => (typeof e === 'string' || typeof e === 'number') && named(e))) {
          const yl = Array.isArray(y[k]) ? y[k] : null;
          for (const e of v) if ((typeof e === 'string' || typeof e === 'number') && named(e) && !(yl && yl.includes(e))) out.husks.push({ path: `${at}[]`, kind: exact(e) ? 'structured' : 'prose' });
        } else if (Object.prototype.hasOwnProperty.call(y, k)) walk(v, y[k], at);
      }
    } else if (Array.isArray(x) && Array.isArray(y)) {
      const used = new Set();
      for (const e of y) {
        if (!isRec(e)) continue;
        // (R3-CURE-5, the chair 14:21: a person by its id AS TEXT for any scalar id; a person with none by containment)
        const i = idKey(e.id) !== '' && /(^|\.)npcs$/.test(p)
          ? x.findIndex((z, j) => !used.has(j) && isRec(z) && idKey(z.id) === idKey(e.id))
          : x.findIndex((z, j) => !used.has(j) && isRec(z) && holdsJ(z, e, ['ts', 'power']));
        if (i < 0) continue;
        used.add(i);
        walk(x[i], e, `${p}[]`);
      }
    }
  };
  walk(pub, doc, '');
  return out;
}
/** R5's, NAMED (the chair, 07:39 UTC): a withheld power's name inside a composed sentence of a SERVED power's description
 * (registry power.desc, R5's composed rows) and its top-level copy. Nothing else may hold one. */
const R5_PROSE = Object.freeze(['powerStructure.factions[].desc', 'factions[].desc']);
// R3-CURE-4 (unit 2; the chair's ruling 37 (a)): power.entry's own test, as the engines now read it: the category; a thieves'
// name only where the power carries no category string (the plant's civic "Old Thieves' Guild Watch" is not a criminal power)
const crim = (f) => isRec(f) && (String(f.category || '').toLowerCase() === 'criminal' || (typeof f.category !== 'string' && /thie/i.test(String(f.faction ?? f.name ?? ''))));
const spOf = (d) => d?.economicState?.safetyProfile || {};
const R3_PATHS = [/^powerStructure\.factions\[\]\.(faction|power|category|isGoverning)$/, /^powerStructure\.factionRelationships\[\]\.(pair\[\]|type|direction)$/,
  /^economicState\.economicComplexity$/, /^economicState\.safetyProfile\.(economicDragDesc|guardEffectivenessDesc|safetyDesc)$/,
  /^economicState\.safetyProfile\.crimeTypes\[\]\.type$/, /^economicState\.safetyProfile\.plotHooks\[\]$/, /^history\.currentTensions\[\]\.type$/,
  /^history\.(historicalEvents|eventsTimeline)\[\]\.type$/, /^institutions\[\]\.desc$/,
  // R3-CURE: master's top-level list and every structured copy of a withheld power
  /^factions\[\]\.(faction|name|power|category|isGoverning|contestsNiche)$/, /^(powerStructure\.)?conflicts\[\]\.(parties\[\]|desc)$/,
  /^history\.currentTensions\[\]\.factions\[\]$/, /^npcs\[\]\.(memberships\[\]\.power|goal\.(short|long)|factionAffiliation)$/];

/** Every value whose normalised path the regex matches, keyed by its indexed path. */
function valuesAt(doc, re) {
  const out = new Map();
  const walk = (v, norm, exact) => {
    if (norm && re.test(norm)) { out.set(exact, J(v)); return; }
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${norm}[]`, `${exact}[${i}]`));
    else if (isRec(v)) for (const k of Object.keys(v)) walk(v[k], norm ? `${norm}.${k}` : k, exact ? `${exact}.${k}` : k);
  };
  walk(doc, '', '');
  return out;
}

describe('R3: the drawn conditional rows where a house is hidden whole (through the server; the twin beside it)', () => {
  let towns;
  let reads;
  let veil;
  let pool;
  let derive;
  let keyTowns;

  beforeAll(async () => {
    const db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    const { isHideableHouse } = await import('../../src/domain/people/cardVeil.js');
    const { deriveEconomicComplexity } = await import('../../src/generators/economy/prosperity.js');
    const { criminalStructureKeyOf } = await import('../../src/domain/facts/criminalStructureKey.js');
    derive = { deriveEconomicComplexity, criminalStructureKeyOf };
    veil = await import('../../src/domain/display/galleryVeil.js');
    await loadGenerationLawPayloads();
    const birth = (size, crisis, seed, drop) => {
      const cut = (list) => { if (!Array.isArray(list)) return; for (let i = list.length - 1; i >= 0; i -= 1) if (drop(list[i])) list.splice(i, 1); };
      const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
      let t = generateSettlementPipeline(cfg, null, { seed, customContent: {}, onStep: drop ? (_n, ctx) => { cut(ctx.institutions); if (isRec(ctx.settlement)) cut(ctx.settlement.institutions); } : undefined });
      if (drop) cut(t.institutions);
      t = { ...t }; delete t.publicProse;
      return clone(withPublicProse(t, composePublicProse(t)));
    };
    towns = SEEDS.map((k) => {
      const [size, crisis] = k.split('-');
      const seed = `r3m-${k}`;
      const stored = birth(size, crisis, seed, null);
      const hideable = (stored.institutions || []).filter((h) => isHideableHouse(h));
      return { seed: k, stored, hideable, B: hideable.length ? birth(size, crisis, seed, (h) => isHideableHouse(h)) : null };
    });
    // R3-CURE (VEIL-23's builder): THE HAND TOWN, a power a hidden house raised with a copy at every structured place the
    // measure found one (out/v23/r3c/unit2-measure-copies-base.txt), and a crime type no map holds (unit 3)
    towns.push({ seed: 'hand-raised', stored: clone(HAND), hideable: HAND.institutions.filter((h) => isHideableHouse(h)), B: null });
    towns.push({ seed: 'hand-governs', stored: clone(HAND_GOVERNS), hideable: HAND_GOVERNS.institutions.filter((h) => isHideableHouse(h)), B: null });
    // R3-CURE-2 (units 1, 4 (i) and 4 (ii)): the fold's plant, the number id's, and the two share sums
    towns.push({ seed: 'hand-fold', stored: clone(HAND_FOLD), hideable: HAND_FOLD.institutions.filter((h) => isHideableHouse(h)), B: null });
    for (const [seed, town] of [['hand-shares-a', HAND_SHARES_A], ['hand-shares-b', HAND_SHARES_B]]) towns.push({ seed, stored: clone(town), hideable: [], B: null });
    // R3-CURE-3 (the chair's ruling A): the name's forms in a goal sentence, and a served power whose name contains the withheld one
    towns.push({ seed: 'hand-forms', stored: clone(HAND_FORMS), hideable: HAND_FORMS.institutions.filter((h) => isHideableHouse(h)), B: null });
    // R3-CURE-5 (the chair, 14:21): a person with a NUMBER id and a person with NO id, each holding a husk the sweep cuts
    towns.push({ seed: 'hand-ids', stored: clone(HAND_IDS), hideable: HAND_IDS.institutions.filter((h) => isHideableHouse(h)), B: null });
    // THE HIDDEN-FREE POOL (VR39): the crime types of every town that holds no hideable house (the counterfactual births
    // and the born towns with none)
    pool = new Set(towns.flatMap((t) => [t.B, t.hideable.length ? null : t.stored]).filter(Boolean)
      .flatMap((d) => (Array.isArray(spOf(d).crimeTypes) ? spOf(d).crimeTypes.map((c) => c?.type) : [])));
    const at = '2026-11-01T00:00:00.000Z';
    const idOf = (h) => veil.CARD_KINDS.institution.idOf(h);
    reads = [];
    let n = 0;
    // R3-CURE-2 (unit 2): the key towns, each with its counterfactual birth; read through the open veil only (kinds 'key'
    // and, for the counterfactual, 'keyB'), outside `towns` so no earlier arm's pool or tally moves
    keyTowns = KEY_SEEDS.map((k) => {
      const [size, crisis] = k.split('-');
      const seed = `r3m-${k}`;
      const stored = birth(size, crisis, seed, null);
      const hideable = (stored.institutions || []).filter((h) => isHideableHouse(h));
      return { seed: k, stored, hideable, B: birth(size, crisis, seed, (h) => isHideableHouse(h)) };
    });
    const keyRuns = keyTowns.flatMap((t) => [[t, 'key', t.stored], [t, 'keyB', t.B]]);
    for (const [t, only, keyDoc] of [...towns.map((x) => [x, null, null]), ...keyRuns]) {
      const shows = t.hideable.flatMap((h) => [`card:institution:${idOf(h)}`, ...['description', 'function', 'services', 'people'].map((f) => `field:institution:${idOf(h)}:${f}`)]);
      const veils = [['open', [...OPEN].map((a) => ({ address: a, hidden: false })), [false, true]],
        // R3-CURE: master's stored shape (the powers ALSO in the top-level factions[], R4's twins), the same veil
        ['openM', [...OPEN].map((a) => ({ address: a, hidden: false })), [false, true]],
        ['shown', [...OPEN, ...shows].map((a) => ({ address: a, hidden: false })), [false]],
        ['default', [], [false]], ['unmarked', null, [false]]];
      for (const [kind, deltas, dms] of only ? [[only, [...OPEN].map((a) => ({ address: a, hidden: false })), [false, true]]] : veils) for (const dm of dms) {
        n += 1;
        const stored = kind === 'openM' ? { ...t.stored, factions: clone(t.stored.powerStructure?.factions || []) } : keyDoc || t.stored;
        const ov = deltas === null ? {} : veil.writeShareVeil({}, deltas, { mode: 'live', at });
        const id = `7e530000-0000-0000-0000-${String(n).padStart(12, '0')}`;
        const slug = `rc${n}`;
        await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
          values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(stored.name || 'T'), String(stored.tier || 'town'), J(stored), slug, `${slug}-link`, J(ov), dm]);
        await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
          values (gen_random_uuid(), $1, 'm', $2, true, $3, $4, 'unlisted', 'map_with_campaign', true, true)`, [OWNER, J({ campaign: { settlementIds: [id] } }), `${slug}-map`, `${slug}-mapl`]);
        await db.exec(`set test.uid = '';`);
        const docs = {
          gallery: (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d,
          map: (await db.query('select public.get_gallery_map($1) #> \'{members,0,settlement}\' d', [`${slug}-map`])).rows[0]?.d,
        };
        if (!dm) docs.link = (await db.query('select public.get_unlisted_dossier($1) -> \'dossier\' d', [`${slug}-link`])).rows[0]?.d;
        await db.exec(`set test.uid = '${READER}';`);
        docs.import = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [slug])).rows[0]?.d;
        await db.exec(`set test.uid = '${OWNER}';`);
        const own = (await db.query('select data from public.settlements where id = $1', [id])).rows[0]?.data;
        await db.exec(`set test.uid = '';`);
        reads.push({ t, kind, dm, ov, docs, own, stored });
      }
    }
    await db.close();
  }, PGLITE_BOOT_TIMEOUT_MS);

  const hiddenReads = () => reads.filter((r) => r.kind === 'open' && r.t.hideable.length);
  /** Every non-owner document of a read that serves one. */
  const docsOf = (r) => Object.entries(r.docs).filter(([, d]) => isRec(d));

  it('the births cover each row (the measure\'s cases are reached)', () => {
    const H = towns.filter((t) => t.hideable.length);
    expect(H.length).toBeGreaterThanOrEqual(10);
    expect(towns.filter((t) => !t.hideable.length).length).toBeGreaterThanOrEqual(3);
    expect(H.some((t) => (t.stored.powerStructure?.factions || []).some((f) => crim(f) && f.isGoverning === true))).toBe(true);
    expect(H.some((t) => (t.stored.powerStructure?.factions || []).some((f) => crim(f) && f.isGoverning !== true))).toBe(true);
    expect(H.some((t) => /beneath the walls/.test(spOf(t.stored).guardEffectivenessDesc || ''))).toBe(true);
    expect(H.some((t) => /limited foothold/.test(spOf(t.stored).safetyDesc || ''))).toBe(true);
    expect(H.some((t) => (spOf(t.stored).crimeTypes || []).some((c) => c?.type === 'Smuggling'))).toBe(true);
    expect(H.some((t) => (t.stored.history?.currentTensions || []).some((x) => x?.type === 'crime_wave'))).toBe(true);
    expect(H.some((t) => (t.stored.institutions || []).some((h) => RIVAL_TEXTS.includes(h?.desc)))).toBe(true);
  });

  it('VR39: no served crime type that no town of the hidden-free pool has; VR29: the key stays an array, absent only where its grouping is shut', () => {
    const bad = [];
    for (const r of hiddenReads()) for (const [read, d] of docsOf(r)) {
      const ct = spOf(d).crimeTypes;
      if (!Array.isArray(ct)) { bad.push(`${r.t.seed} dm=${r.dm} ${read}: crimeTypes ${J(ct)}`); continue; }
      for (const c of ct) if (!pool.has(c?.type)) bad.push(`${r.t.seed} dm=${r.dm} ${read}: ${J(c?.type ?? c)}`);
    }
    for (const r of reads.filter((x) => x.kind === 'default')) for (const [read, d] of docsOf(r)) if ('crimeTypes' in spOf(d)) bad.push(`${r.t.seed} default ${read}: the shut grouping sent crimeTypes`);
    expect(bad).toEqual([]);
  });

  it('VR39 CONTROL: a town whose criminal houses the DM SHOWS keeps its crime types, as stored', () => {
    const bad = [];
    for (const r of reads.filter((x) => x.kind === 'shown' && x.t.hideable.length)) {
      const want = (spOf(r.t.stored).crimeTypes || []).map((c) => c?.type);
      const got = (spOf(r.docs.gallery).crimeTypes || []).map((c) => c?.type);
      if (J(got) !== J(want)) bad.push(`${r.t.seed}: ${J(got)} != ${J(want)}`);
    }
    expect(bad).toEqual([]);
  });

  it('THE POWER OBSERVABLE / VR42: no served criminal power but the governing one, which IS served; the shares sum to 100 where any power is withheld (VR11/VR31); no relation names an unserved power', () => {
    const bad = [];
    for (const r of hiddenReads()) for (const [read, d] of docsOf(r)) {
      const fs = d.powerStructure?.factions || [];
      for (const f of fs) if (crim(f) && f.isGoverning !== true) bad.push(`${r.t.seed} dm=${r.dm} ${read}: criminal power ${f.faction ?? f.name}`);
      const gov = (r.t.stored.powerStructure?.factions || []).find((f) => f?.isGoverning === true);
      if (gov && !fs.some((f) => f?.isGoverning === true && f.faction === gov.faction)) bad.push(`${r.t.seed} ${read}: the governing row ${gov.faction} not served`);
      if (fs.length < (r.t.stored.powerStructure?.factions || []).length) {
        const sum = fs.reduce((a, f) => a + Number(f.power), 0);
        if (sum !== 100 || fs.some((f) => !Number.isInteger(f.power))) bad.push(`${r.t.seed} dm=${r.dm} ${read}: shares ${J(fs.map((f) => f.power))}`);
      }
      const names = new Set(fs.map((f) => f.faction ?? f.name));
      for (const x of d.powerStructure?.factionRelationships || []) if (!Array.isArray(x?.pair) || x.pair.some((p) => !names.has(p))) bad.push(`${r.t.seed} dm=${r.dm} ${read}: relation ${J(x?.pair)}`);
    }
    expect(bad).toEqual([]);
  });

  it('VR31 on EVERY read (marked and unmarked, towns with no hidden house too): wherever a power is withheld, whatever withheld it, the served shares sum to 100', () => {
    const bad = [];
    let judged = 0;
    let judgedTop = 0;
    for (const r of reads) for (const [read, d] of docsOf(r)) {
      // R3-CURE (the seat's lead (2), REVIEW-VEIL-12: 92 and 93 where a power left): BOTH LISTS, both stored shapes, Reveal
      // DM off and on; and every share an integer
      for (const [key, fs, st] of [['powerStructure.factions', d.powerStructure?.factions, r.stored.powerStructure?.factions], ['factions', d.factions, r.stored.factions]]) {
        if (!Array.isArray(fs) || !Array.isArray(st) || fs.length >= st.length || !fs.length) continue;
        if (key === 'factions') judgedTop += 1; else judged += 1;
        const sum = fs.reduce((a, f) => a + Number(f?.power), 0);
        if (sum !== 100 || fs.some((f) => !Number.isInteger(f?.power))) bad.push(`${r.t.seed} ${r.kind} dm=${r.dm} ${read} ${key}: ${J(fs.map((f) => f?.power))}`);
      }
    }
    note('R3-CURE VR31: reads with a power withheld from the top-level factions[] (master\'s shape), judged:', judgedTop);
    expect(judgedTop).toBeGreaterThan(0);
    note('R3 VR31: reads with a power withheld, judged:', judged);
    expect(judged).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  it('THE POWER OBSERVABLE: the Defense key a visitor derives from the served document is "organized" only by the governing power (VR42)', () => {
    const tally = {};
    const bad = [];
    for (const r of hiddenReads().filter((x) => !x.dm)) {
      const key = derive.criminalStructureKeyOf(r.docs.gallery);
      tally[String(key)] = (tally[String(key)] || 0) + 1;
      if (key === 'organized' && !(r.docs.gallery.powerStructure?.factions || []).some((f) => crim(f) && f.isGoverning === true)) bad.push(`${r.t.seed}: organized`);
    }
    const control = {};
    for (const r of reads.filter((x) => x.kind === 'open' && !x.dm && !x.t.hideable.length)) { const k = String(derive.criminalStructureKeyOf(r.docs.gallery)); control[k] = (control[k] || 0) + 1; }
    note('R3 derived Defense keys, groupings open: hidden towns', J(tally), '| control (no hideable house)', J(control));
    expect(bad).toEqual([]);
  });

  it('(a) economy.complexity is the engine\'s own ladder over the served rows; the gates tail and the foothold word as the engine writes them for the served houses', () => {
    const bad = [];
    for (const r of hiddenReads()) for (const [read, d] of docsOf(r)) {
      const es = d.economicState || {};
      if ('economicComplexity' in es) {
        const want = derive.deriveEconomicComplexity(es.tier, (es.incomeSources || []).length, (es.primaryExports || []).length,
          (d.institutions || []).some((h) => ['market', 'trading', 'merchant', 'guild'].some((w) => String(h?.name || '').toLowerCase().includes(w))),
          es.foodSecurity?.foodRecord ?? null, es.incomeSources || []);
        if (es.economicComplexity !== want) bad.push(`${r.t.seed} ${read}: complexity ${es.economicComplexity} != ${want}`);
      }
      const beneath = (d.institutions || []).some((h) => BENEATH.test(String(h?.name || '')));
      const sp = spOf(d);
      if (!beneath && /beneath the walls/.test(String(sp.guardEffectivenessDesc || ''))) bad.push(`${r.t.seed} ${read}: gates tail`);
      if (!beneath && /beneath the walls/.test(String(sp.safetyDesc || ''))) bad.push(`${r.t.seed} ${read}: Very Safe gates line`);
      const org = (d.institutions || []).some((h) => /thieves|criminal|gang|smuggler|fence|gambl/i.test(`${h?.name || ''} ${h?.catalogId || ''}`));
      if (!org && /limited foothold/.test(String(sp.safetyDesc || ''))) bad.push(`${r.t.seed} ${read}: foothold word`);
    }
    expect(bad).toEqual([]);
  });

  it('(b) a smuggling hook, a crime-wave tension or event, a rival-power description and the criminal desk leave where no served house or power accounts for them', () => {
    const bad = [];
    for (const r of hiddenReads()) for (const [read, d] of docsOf(r)) {
      const houses = d.institutions || [];
      const smug = houses.some((h) => /smuggling network|smuggling operation/i.test(String(h?.name || '')));
      for (const h of spOf(d).plotHooks || []) if (SMUGGLING_HOOK.test(String(h)) && !smug) bad.push(`${r.t.seed} ${read}: hook ${String(h).slice(0, 40)}`);
      const signal = (d.powerStructure?.factions || []).some((f) => String(f?.category || '').toLowerCase() === 'criminal')
        || houses.some((h) => String(h?.category || '').toLowerCase() === 'criminal' || String(h?.priorityCategory || '').toLowerCase() === 'criminal');
      if (!signal && (d.history?.currentTensions || []).some((x) => x?.type === 'crime_wave')) bad.push(`${r.t.seed} ${read}: crime-wave tension`);
      for (const h of houses) if (RIVAL_TEXTS.includes(h?.desc)) bad.push(`${r.t.seed} ${read}: rival-power desc ${h.name}`);
      if (d.publicProse?.blocks && 'defense:criminal' in d.publicProse.blocks) bad.push(`${r.t.seed} ${read}: defense:criminal`);
    }
    expect(bad).toEqual([]);
  });

  it('safety.economicDragDesc leaves where a hidden house raised it (the criminal-house flag or the organised name it raised); VR42: where only the governing body stands it stays', () => {
    const bad = [];
    const vr42 = [];
    for (const r of hiddenReads().filter((x) => !x.dm)) {
      const inst = (d) => d?.economicState?.safetyProfile?.compound?.inst || {};
      const flipped = inst(r.t.stored).hasCriminalInst === true && !(r.t.hideable.length === 0)
        && !(r.t.stored.institutions || []).some((h) => !r.t.hideable.includes(h) && /thieves' guild|black market|smuggling|assassins|street gang|front business|gambling den|underground city|multiple criminal/i.test(String(h?.name || '')));
      const served = spOf(r.docs.gallery).economicDragDesc;
      if (flipped && served != null) bad.push(`${r.t.seed}: drag served`);
      if ((r.t.stored.powerStructure?.factions || []).some((f) => crim(f) && f.isGoverning === true)) vr42.push(`${r.t.seed}: ${served == null ? 'withheld' : 'served'} (B: ${spOf(r.t.B).economicDragDesc == null ? 'none' : 'drawn'})`);
    }
    note('R3 VR42 towns, economicDragDesc:', J(vr42));
    expect(bad).toEqual([]);
  });

  it('the owner\'s own record keeps every row', () => {
    const bad = [];
    for (const r of reads) if (canon(r.own) !== canon(r.stored)) bad.push(`${r.t.seed} ${r.kind}`);
    expect(bad).toEqual([]);
  });

  // ── R3-CURE (VEIL-23's builder; R3-CURE-BRIEF units 1 to 3; the chair's rulings of 07:31 and 07:39 UTC) ──────────────
  /** The reads that judge a hidden house's powers: the open veil, both stored shapes, Reveal DM off and on. */
  const cureReads = () => reads.filter((r) => (r.kind === 'open' || r.kind === 'openM') && r.t.hideable.length);
  /** Which rule took a town (lane shape, gallery, Reveal off): a power withheld, VR42 (the governing criminal power stays), or no criminal power. */
  const ruleOf = (r) => {
    const fs = (r.stored.powerStructure?.factions || []).filter(isRec);
    if (withheldOf(r.stored, r.docs.gallery).length) return 'withheld (power.entry)';
    if (fs.some((f) => crim(f) && f.isGoverning === true)) return fs.some((f) => crim(f) && f.isGoverning !== true) ? 'VR42 + ?' : 'VR42 (the governing criminal power stays; nothing withheld)';
    return fs.some((f) => crim(f)) ? '? (a criminal power served)' : 'no criminal power';
  };

  it('R3-CURE unit 1 (the chair, 07:31): a power raised by a hidden house is withheld WHOLE on every read (gallery, link, import, map member; both stored shapes; Reveal DM off and on): no row with no name, none left with only its share or category, in powerStructure.factions or the top-level factions[]', () => {
    const bad = [];
    let judged = 0;
    for (const r of cureReads()) for (const [read, d] of docsOf(r)) {
      for (const key of ['powerStructure.factions', 'factions']) {
        const list = key === 'factions' ? d.factions : d.powerStructure?.factions;
        if (list === undefined) continue;
        for (const f of Array.isArray(list) ? list : [list]) {
          judged += 1;
          if (!isRec(f) || !(typeof f.faction === 'string' && f.faction) && !(typeof f.name === 'string' && f.name)) bad.push(`${r.t.seed} ${r.kind} dm=${r.dm} ${read}: ${key} row with no name ${J(f).slice(0, 80)}`);
          else if (crim(f) && f.isGoverning !== true) bad.push(`${r.t.seed} ${r.kind} dm=${r.dm} ${read}: ${key} criminal power ${f.faction ?? f.name}`);
        }
      }
      if (r.t.seed === 'hand-raised') {
        const all = [...(d.powerStructure?.factions || []), ...(Array.isArray(d.factions) ? d.factions : [])];
        if (all.some((f) => isRec(f) && (f.faction === TG || f.name === TG || f.id === TG_ID || f.power === 30))) bad.push(`hand ${r.kind} dm=${r.dm} ${read}: the raised power's row (or its share) served`);
      }
    }
    expect(judged).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  it('R3-CURE unit 1, VR42 BESIDE IT: where the governing power is criminal the row, its name, its share and its relations are served, and the two rules never collide (executed; the towns listed)', () => {
    const bad = [];
    const told = [];
    for (const r of cureReads().filter((x) => x.kind === 'open')) {
      const gov = (r.stored.powerStructure?.factions || []).find((f) => isRec(f) && f.isGoverning === true);
      if (!gov || !crim(gov)) continue;
      for (const [read, d] of docsOf(r)) {
        const fs = d.powerStructure?.factions || [];
        const row = fs.find((f) => isRec(f) && f.isGoverning === true);
        if (!row || row.faction !== gov.faction) { bad.push(`${r.t.seed} dm=${r.dm} ${read}: the governing row is not served whole`); continue; }
        if (typeof row.power !== 'number') bad.push(`${r.t.seed} dm=${r.dm} ${read}: the governing row has no share`);
        if (fs.reduce((a, f) => a + Number(f?.power), 0) !== 100 && fs.length < (r.stored.powerStructure?.factions || []).length) bad.push(`${r.t.seed} dm=${r.dm} ${read}: shares do not sum to 100`);
        const rels = (d.powerStructure?.factionRelationships || []).filter((x) => Array.isArray(x?.pair) && x.pair.includes(gov.faction));
        if (read === 'gallery') told.push(`${r.t.seed} dm=${r.dm}: governing "${row.faction}" (category ${row.category}) served, share ${row.power} (stored ${gov.power}); its relations served ${rels.length} of ${(r.stored.powerStructure?.factionRelationships || []).filter((x) => Array.isArray(x?.pair) && x.pair.includes(gov.faction)).length} [${rels.map((x) => `${x.pair.join(' / ')}: ${x.type}`).join('; ')}]; powers withheld ${J(withheldOf(r.stored, d))}`);
      }
    }
    const hg = cureReads().filter((x) => x.t.seed === 'hand-governs');
    expect(hg.length).toBeGreaterThan(0);
    for (const r of hg) for (const [read, d] of docsOf(r)) {
      const row = (d.powerStructure?.factions || []).find((f) => f?.faction === TG);
      if (!row || row.isGoverning !== true || row.power !== 60 || row.category !== 'criminal') bad.push(`hand-governs ${r.kind} dm=${r.dm} ${read}: the governing row ${J(row)}`);
      if (!(d.powerStructure?.factionRelationships || []).some((x) => J(x?.pair) === J([TG, 'Fishers']))) bad.push(`hand-governs ${r.kind} dm=${r.dm} ${read}: its relation lost`);
      if (withheldOf(r.stored, d).length) bad.push(`hand-governs ${r.kind} dm=${r.dm} ${read}: withheld ${J(withheldOf(r.stored, d))}`);
      if (r.kind === 'open' && read === 'gallery') told.push(`hand-governs dm=${r.dm}: rule ${ruleOf(r)}; served powers ${J((d.powerStructure?.factions || []).map((f) => [f.faction, f.power, f.category, f.isGoverning === true]))}; relations ${J(d.powerStructure?.factionRelationships)}; crime types ${J(spOf(d).crimeTypes)}`);
    }
    note('R3-CURE VR42 towns (lane shape, open veil):', told.length ? `\n  ${told.join('\n  ')}` : 'none');
    expect(told.length).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  it('R3-CURE unit 2 (the chair, 07:39): "LEAVES WHOLE" MEANS EVERY COPY: after the read, a withheld power\'s NAME and ID are in no served string and are no object key, outside R5\'s named prose; both stored shapes, gallery, link, import and map, Reveal DM off and on; the rule that took each town is said', () => {
    const outside = [];
    const r5 = {};
    const rules = {};
    const exempted = [];
    for (const r of cureReads()) {
      if (r.kind === 'open' && !r.dm) { const k = ruleOf(r); (rules[k] = rules[k] || []).push(r.t.seed); }
      for (const [read, d] of docsOf(r)) {
        const W = withheldOf(r.stored, d);
        if (!W.length) continue;
        for (const h of searchHits(d, W, exempted)) {
          if (R5_PROSE.includes(h.path)) { r5[h.path] = (r5[h.path] || 0) + 1; continue; }
          outside.push(`${r.t.seed} ${r.kind} dm=${r.dm} ${read}: ${h.path} = ${J(h.text)}`);
        }
      }
    }
    note('R3-CURE unit 2, the rule that took each town (lane shape, open veil, Reveal off):', Object.entries(rules).map(([k, v]) => `\n  ${k}: ${v.length} [${v.join(', ')}]`).join(''));
    note('R3-CURE unit 2, R5\'s named prose hits (path: count):', J(r5));
    note('R3-CURE unit 2, hits outside the named list:', outside.length, outside.length ? `\n  ${outside.slice(0, 400).join('\n  ')}` : '');
    // R3-CURE-5: the ruled exemption, POSITIVELY: each exempt string with its containing served name (by containing name: count)
    const byHolder = {};
    for (const e of exempted) for (const n of e.holders) byHolder[n] = (byHolder[n] || 0) + 1;
    note('R3-CURE-5, the exemption (ruling 37 (a)): strings exempt by a containing SERVED name:', exempted.length, J(byHolder));
    expect(rules['withheld (power.entry)']?.length || 0).toBeGreaterThan(0);
    expect(outside).toEqual([]);
  });

  it('R3-CURE unit 2, THE SEARCH HAS TEETH: a withheld power\'s name planted inside a sentence and its id used as an object key are found; the clean document is not', () => {
    const r = cureReads().find((x) => x.t.seed === 'hand-raised' && x.kind === 'open' && !x.dm);
    const d = clone(r.docs.gallery);
    const outsideOf = (doc) => searchHits(doc, [TG, TG_ID]).map((h) => h.path).filter((p) => !R5_PROSE.includes(p));
    const clean = outsideOf(d);
    const planted = clone(d);
    planted.overview = { line: `The quay is quiet since ${TG.toUpperCase()} moved in.`, byPower: { [TG_ID]: 3 } };
    const found = outsideOf(planted);
    expect(found.length - clean.length).toBe(2);
    expect(found).toEqual(expect.arrayContaining(['overview.line', 'overview.byPower.{KEY}']));
    expect(clean).not.toContain('overview.line');
  });

  it('R3-CURE unit 3: a crime type no map holds FAILS CLOSED where a house is hidden whole (withheld), on every read, both shapes; a crisis type the engine writes stays', () => {
    const bad = [];
    for (const r of cureReads().filter((x) => x.t.seed === 'hand-raised')) for (const [read, d] of docsOf(r)) {
      const types = (spOf(d).crimeTypes || []).map((c) => c?.type);
      if (types.includes('Planted unknown crime')) bad.push(`${r.kind} dm=${r.dm} ${read}: the unknown type served`);
      if (!types.includes('debt evasion')) bad.push(`${r.kind} dm=${r.dm} ${read}: the crisis type lost`);
    }
    expect(bad).toEqual([]);
  });

  // ── R3-CURE-2 (VEIL-24's builder; R3-CURE-2-BRIEF units 1, 2 and 4; the chair's rulings of 08:22 and 09:04 UTC) ────────
  it('R3-CURE-2 unit 1 and unit 4 (i): THE FOLD AND THE NUMBER ID: a withheld "Thieves\' Guild (powerful)" named by its BARE form, and its number id 7, leave every structured copy (conflicts both lists, the tension, contestsNiche, memberships, the affiliation key, the goal named by sentence and the goal aimed by id), both shapes, every read, Reveal DM off and on; its tooth: a goal aimed at a SHOWN power and a membership of a shown power are served byte for byte', () => {
    const bad = [];
    const rs = cureReads().filter((x) => x.t.seed === 'hand-fold');
    expect(rs.length).toBe(4);
    let tooth = 0; let noGoal = 0;
    for (const r of rs) for (const [read, d] of docsOf(r)) {
      const tag = `hand-fold ${r.kind} dm=${r.dm} ${read}`;
      if (!withheldOf(r.stored, d).includes(TGP) || !withheldOf(r.stored, d).includes('7')) bad.push(`${tag}: the power is not withheld ${J(withheldOf(r.stored, d))}`);
      for (const h of searchHits(d, [TGP, '7'])) if (!R5_PROSE.includes(h.path)) bad.push(`${tag}: ${h.at} = ${J(h.text)}`);
      const npc = (id) => (d.npcs || []).find((x) => x?.id === id);
      const eli = HAND_FOLD.npcs[2];
      // THE TOOTH, UNCONDITIONAL (ruling 72 (c), ruling 53's last paragraph; V33-Q): it is judged wherever the READ'S OWN
      // PROJECTION holds the person's goal (galleryPayloadFor before the veil's passes, at the read's Reveal setting: the map's
      // member and the link are read Reveal off), never by what the veil served: there the shown power's goal and membership
      // are served byte for byte (canonical key order: jsonb orders an object's keys), and a person served WITHOUT the goal,
      // or not served, is a fault, not a skip
      const pubEli = (veil.galleryPayloadFor(clone(r.stored), { shareDm: read === 'map' || read === 'link' ? false : r.dm, memberOverrides: r.ov }).npcs || []).find((x) => x?.id === 'npc.eli');
      if (isRec(pubEli) && 'goal' in pubEli) {
        tooth += 1;
        if (!npc('npc.eli') || !('goal' in npc('npc.eli'))) bad.push(`${tag}: the goal aimed at the shown Harbour Board withheld (${npc('npc.eli') ? 'the person served without it' : 'the person not served'})`);
        else if (canon(npc('npc.eli').goal) !== canon(eli.goal)) bad.push(`${tag}: the goal aimed at the shown Harbour Board ${J(npc('npc.eli')?.goal)}`);
        if (canon(npc('npc.eli')?.memberships) !== canon(eli.memberships)) bad.push(`${tag}: a shown power's membership ${J(npc('npc.eli')?.memberships)}`);
        if (!(npc('npc.cass')?.memberships || []).some((m) => m?.power === 'Ropers')) bad.push(`${tag}: the Ropers membership lost`);
      } else {
        noGoal += 1;
        if (npc('npc.eli') && 'goal' in npc('npc.eli')) bad.push(`${tag}: a goal served where the read's own projection holds none ${J(npc('npc.eli').goal)}`);
      }
      if (!(d.powerStructure?.conflicts || []).some((c) => J(c?.parties) === J(['Harbour Board', 'Ropers']))) bad.push(`${tag}: the shown conflict lost`);
    }
    note('R3-CURE-2 unit 1, the tooth, UNCONDITIONAL (reads whose own projection holds the shown power\'s goal, each judged byte for byte):', tooth, '| reads whose projection holds no goal for the person:', noGoal);
    expect(tooth).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  it('R3-CURE-3 (the chair\'s ruling A): a goal naming a withheld power by a POSSESSIVE, a PLURAL or in CAPITALS leaves, both engines, every read, Reveal DM off and on; a goal naming a SERVED power whose name contains the withheld one stays byte for byte, its exemption the containing served name', () => {
    const bad = [];
    const rs = cureReads().filter((x) => x.t.seed === 'hand-forms');
    expect(rs.length).toBe(4);
    const FORMS = { 'npc.fen': 'a possessive', 'npc.gil': 'a plural', 'npc.ivo': 'capitals' };
    let tooth = 0; let judged = 0;
    for (const r of rs) {
      const twin = veil.projectShareVeil(veil.galleryPayloadFor(clone(r.stored), { shareDm: r.dm, memberOverrides: r.ov }), r.ov);
      for (const [read, d] of [...docsOf(r), ['twin', twin]]) {
        const tag = `hand-forms ${r.kind} dm=${r.dm} ${read}`;
        if (!withheldOf(r.stored, d).includes(TG)) bad.push(`${tag}: the power is not withheld ${J(withheldOf(r.stored, d))}`);
        // (R3-CURE-5: once each: on master's shape the Watch is served in both lists, and the containing name is ONE name)
        const served = [...new Set([...(d.powerStructure?.factions || []), ...(d.factions || [])].flatMap((f) => [f?.faction, f?.name]).filter((v) => typeof v === 'string'))];
        if (!served.includes(TG_WATCH)) bad.push(`${tag}: the Watch not served ${J(served)}`);
        const npc = (id) => (d.npcs || []).find((x) => x?.id === id);
        for (const [id, form] of Object.entries(FORMS)) {
          if (!npc(id)) continue;
          judged += 1;
          if ('goal' in npc(id)) bad.push(`${tag}: ${form}: the goal naming the withheld power served ${J(npc(id).goal)}`);
        }
        const hal = npc('npc.hal');
        if (hal && 'goal' in hal) {
          tooth += 1;
          if (canon(hal.goal) !== canon(HAND_FORMS.npcs[3].goal)) bad.push(`${tag}: the goal naming the served Watch changed ${J(hal.goal)}`);
          // THE EXEMPTION, positively: the bare search (no open names) hits the sentence, and the hit lies wholly inside a name
          // this same document serves: that containing served name is the Watch, and with it cut out nothing is left to hit
          const bare = buildNameSearch([TG], []);
          const holders = served.filter((n) => hal.goal.short.includes(n) && bare.hit(n));
          if (!bare.hit(hal.goal.short) || J(holders) !== J([TG_WATCH]) || bare.hit(hal.goal.short.split(TG_WATCH).join(' '))) bad.push(`${tag}: the exemption is not the containing served name ${J(holders)}`);
        } else if (npc('npc.jon') && 'goal' in npc('npc.jon')) bad.push(`${tag}: the goal naming the served Watch withheld where a plain goal is served`);
      }
    }
    note('R3-CURE-3 ruling A: the three forms judged on', judged, 'people-reads; the Watch goal served byte for byte on', tooth, 'reads');
    expect(judged).toBeGreaterThan(0);
    expect(tooth).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  it('R3-CURE-5 (the chair, 14:21: A GAP TOWARD SENDING): a person whose id is a NUMBER, and a person with NO id, keep no husk: the goal aimed at and naming the withheld guild leaves WHOLE and the guild membership leaves WHOLE, both engines, both shapes, every read, Reveal DM off and on; a shown power\'s goal and membership stay byte for byte', () => {
    const bad = [];
    const rs = cureReads().filter((x) => x.t.seed === 'hand-ids');
    expect(rs.length).toBe(4);
    let judged = 0;
    for (const r of rs) {
      const twin = veil.projectShareVeil(veil.galleryPayloadFor(clone(r.stored), { shareDm: r.dm, memberOverrides: r.ov }), r.ov);
      for (const [read, d] of [...docsOf(r), ['twin', twin]]) {
        const tag = `hand-ids ${r.kind} dm=${r.dm} ${read}`;
        if (!withheldOf(r.stored, d).includes(TG)) bad.push(`${tag}: the guild is not withheld`);
        const ppl = (d.npcs || []).filter(isRec);
        const ida = ppl.find((n) => n.name === 'Ida Numer'); const nell = ppl.find((n) => n.name === 'Nell Noid'); const ott = ppl.find((n) => n.name === 'Ott Mere');
        for (const [who, n, keep] of [['the number-id person', ida, [{ power: 'Fishers', role: 'member' }]], ['the no-id person', nell, []]]) {
          if (!n || !('memberships' in n || 'goal' in n)) continue;
          judged += 1;
          if ('goal' in n) bad.push(`${tag}: ${who}'s goal served as a husk ${J(n.goal)}`);
          if (canon(n.memberships || []) !== canon(keep)) bad.push(`${tag}: ${who}'s memberships ${J(n.memberships)}`);
        }
        if (ott && 'goal' in ott && canon(ott.goal) !== canon(HAND_IDS.npcs[2].goal)) bad.push(`${tag}: the shown power's goal changed ${J(ott.goal)}`);
        if (ott && 'memberships' in ott && canon(ott.memberships) !== canon(HAND_IDS.npcs[2].memberships)) bad.push(`${tag}: the shown power's membership changed`);
      }
    }
    note('R3-CURE-5 (14:21): the number-id and no-id people judged on', judged, 'people-reads');
    expect(judged).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  it('R3-CURE-7 (ruling 53, condition 1: THE TOOTH): a person whose id is `true`, one whose id is `false`, one whose id is the empty string: (a) no stripped goal or membership of the withheld guild survives for any of the three (no husk; a shown membership stays byte for byte); (b) the twin and 212 serve the SAME result for each (byte for byte, by name, presence included); every read, both shapes, Reveal DM off and on', () => {
    const bad = [];
    const rs = cureReads().filter((x) => x.t.seed === 'hand-ids');
    expect(rs.length).toBe(4);
    let judged = 0; let compared = 0;
    for (const r of rs) {
      const twinOf = (dm) => veil.projectShareVeil(veil.galleryPayloadFor(clone(r.stored), { shareDm: dm, memberOverrides: r.ov }), r.ov);
      const twin = twinOf(r.dm);
      // (the campaign map's member is read with Reveal DM OFF whatever the share says: 211 :: get_gallery_map calls
      // _gallery_veil(pub.j, overrides, false); its twin is the Reveal-off projection. tooth-first.txt: the first run compared
      // the map's Reveal-off people with the Reveal-on twin, 6 of 6 faults there, an instrument fault, not the engines')
      const twinOff = twinOf(false);
      const byName = (d, name) => (Array.isArray(d?.npcs) ? d.npcs : []).filter((n) => isRec(n) && n.name === name);
      for (const [read, d] of [...docsOf(r), ['twin', twin]]) {
        const tag = `hand-ids ${r.kind} dm=${r.dm} ${read}`;
        if (!withheldOf(r.stored, d).includes(TG)) bad.push(`${tag}: the guild is not withheld`);
        for (const [who, name, keep] of HAND_IDS_TOOTH) {
          const ns = byName(d, name);
          // (b) THE TWIN AND 212 AGREE: each server read's copy of the person against the twin's, by name, presence included
          if (read !== 'twin') {
            compared += 1;
            const tw = byName(read === 'map' ? twinOff : twin, name);
            if (canon(ns) !== canon(tw)) bad.push(`${tag}: ${who} differs from the twin: server ${J(ns)} | twin ${J(tw)}`);
          }
          // (a) NO HUSK: no goal (it named and aimed at the guild), no membership but the shown one
          for (const n of ns) {
            if (!('memberships' in n || 'goal' in n)) continue;
            judged += 1;
            if ('goal' in n) bad.push(`${tag}: ${who}'s goal served as a husk ${J(n.goal)}`);
            if (canon(n.memberships || []) !== canon(keep)) bad.push(`${tag}: ${who}'s memberships ${J(n.memberships)}`);
          }
        }
      }
    }
    note('R3-CURE-7 (ruling 53): the true-, false- and empty-id people judged on', judged, 'people-reads; compared with the twin on', compared, 'person-reads');
    expect(judged).toBeGreaterThan(0);
    expect(compared).toBeGreaterThan(0);
    expect(bad).toEqual([]);
  });

  // KEY-LEVEL ON A SERVED HOLDER, NOT CURED HERE (STOPPED to the seat, R3C4-HANDBACK.md): R3-CURE's ruled rules take the KEY,
  // not its holder: a SHOWN power's `contestsNiche` naming a withheld one, and a served person's affiliation key. To take the
  // holder whole would withhold a shown power or a served person; that is a ruling, not a cure. Listed by path and count.
  const KEY_LEVEL = /^(powerStructure\.)?factions\[\]\.contestsNiche$|^npcs\[\]\.(faction|factionAffiliation|affiliation|factionId)$/;
  it('R3-CURE-4 unit 1, THE HUSK CLASS (the chair, 11:12: "a husk is a tell"): no served object whose pre-sweep counterpart held a withheld power\'s name or id as a STRUCTURED field is served with that field removed or blanked (it leaves whole); every read, both engines, both shapes, gallery, link, import and map, Reveal DM off and on; prose husks are listed by path and count (R5\'s)', () => {
    const tally = { structured: {}, prose: {} };
    let compared = 0; let judged = 0;
    const bad = [];
    for (const r of reads) {
      const pub = veil.galleryPayloadFor(clone(r.stored), { shareDm: r.dm, memberOverrides: r.ov });
      const twin = veil.projectShareVeil(clone(pub), r.ov);
      for (const [read, d] of [...docsOf(r), ['twin', twin]]) {
        const w = withheldOf(r.stored, d);
        if (!w.length) continue;
        judged += 1;
        const opens = [...(d.powerStructure?.factions || []), ...(d.factions || [])].filter(isRec).flatMap((f) => [f.faction, f.name]).filter((v) => typeof v === 'string' && v);
        const h = husksOf(pub, d, w, opens);
        compared += h.compared;
        for (const x of h.husks) {
          const key = `${x.path} [${read === 'twin' ? 'twin' : 'server'}]`;
          tally[x.kind][key] = (tally[x.kind][key] || 0) + 1;
          if (x.kind === 'structured' && !KEY_LEVEL.test(x.path)) bad.push(`${r.t.seed} ${r.kind} dm=${r.dm} ${read}: ${x.path}`);
        }
      }
    }
    const lines = (o) => Object.entries(o).sort().map(([k, v]) => `\n  ${k}: ${v}`).join('');
    note('R3-CURE-4 unit 1, THE HUSK CLASS: documents judged (a power withheld):', judged, '| objects compared:', compared);
    note('R3-CURE-4 unit 1, STRUCTURED husks (path [engine]: count):', Object.keys(tally.structured).length ? lines(tally.structured) : 'none');
    note('R3-CURE-4 unit 1, PROSE husks, R5\'s (path [engine]: count):', Object.keys(tally.prose).length ? lines(tally.prose) : 'none');
    expect(judged).toBeGreaterThan(0);
    expect(compared).toBeGreaterThan(0);
    expect(bad.slice(0, 60)).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('R3-CURE-2 unit 4 (ii): THE SHARE SUM is compared EXACTLY in both engines: shares whose decimal sum is 100 stay as stored (0.1, 64.1, 35.8), shares whose decimal sum is not are re-derived to 100 (the thirds), every read, the server and the twin alike', () => {
    const bad = [];
    for (const r of reads.filter((x) => x.t.seed === 'hand-shares-a' || x.t.seed === 'hand-shares-b')) {
      const twin = veil.projectShareVeil(veil.galleryPayloadFor(clone(r.stored), { shareDm: r.dm, memberOverrides: r.ov }), r.ov);
      const want = r.t.seed === 'hand-shares-a' ? J([0.1, 64.1, 35.8]) : null;
      for (const [eng, d] of [['server', r.docs.gallery], ['twin', twin]]) {
        const got = (d?.powerStructure?.factions || []).map((f) => f?.power);
        if (want !== null && J(got) !== want) bad.push(`${r.t.seed} ${r.kind} dm=${r.dm} ${eng}: ${J(got)} (an exact 100 re-derived)`);
        if (want === null && (got.reduce((a, v) => a + v, 0) !== 100 || got.some((v) => !Number.isInteger(v)))) bad.push(`${r.t.seed} ${r.kind} dm=${r.dm} ${eng}: ${J(got)} (not re-derived)`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('R3-CURE-2 unit 4 (iii): where NO house is hidden whole and a power is withheld anyway (the projection, a Reveal-off read, a shut grouping), no served string or key names it by the fold, outside R5\'s named prose', () => {
    const outside = [];
    let judged = 0;
    for (const r of reads.filter((x) => !['open', 'openM', 'key', 'keyB'].includes(x.kind) || !x.t.hideable.length).filter((x) => x.kind === 'unmarked' || x.kind === 'shown' || !x.t.hideable.length)) {
      for (const [read, d] of docsOf(r)) {
        const W = withheldOf(r.stored, d);
        if (!W.length) continue;
        judged += 1;
        for (const h of searchHits(d, W)) if (!R5_PROSE.includes(h.path)) outside.push(`${r.t.seed} ${r.kind} dm=${r.dm} ${read}: ${h.at} = ${J(h.text)}`);
      }
    }
    note('R3-CURE-2 unit 4 (iii): reads with no house hidden whole and a power withheld, judged:', judged, '| hits outside R5\'s list:', outside.length, outside.length ? `\n  ${outside.slice(0, 200).join('\n  ')}` : '');
    // MEASURED (out/v24/r3c2/born-red.full.log): at 06e9e64b3 the only hits were the hand town's PARTY LINK with no veil
    // record (3: its conflicts both lists and its tension, by the BARE form); the link's own default hides the hand town's
    // criminal house whole, so they were unit 1's (the literal-label match), and the fold cures them (born-green.full.log).
    // Where no house is hidden whole and a power is withheld, nothing names it: the copy pass's gate (`whole`) stands.
    expect(outside).toEqual([]);
  });

  it('R3-CURE-2 unit 2 (the chair\'s ruling 2): PER TOWN, the Defense key a visitor derives from the served document equals the house-free counterfactual\'s, or is LOWER with its cause named (the field whose counterfactual value alone closes the gap); ZERO towns HIGHER; "Magical crime" served only where the counterfactual serves it; both engines, Reveal DM off and on', () => {
    const bad = [];
    const told = [];
    const tally = {};
    const keyOf = (d) => derive.criminalStructureKeyOf(d);
    const causeOf = (a, b, want) => {
      const one = Object.entries(KEY_FIELDS).filter(([, [get, set]]) => { const x = clone(a); set(x, get(b) === undefined ? undefined : clone(get(b))); return keyOf(x) === want; }).map(([f]) => f);
      return one;
    };
    for (const t of keyTowns) for (const dm of [false, true]) {
      const ra = reads.find((x) => x.t === t && x.kind === 'key' && x.dm === dm);
      const rb = reads.find((x) => x.t === t && x.kind === 'keyB' && x.dm === dm);
      const tw = (r) => veil.projectShareVeil(veil.galleryPayloadFor(clone(r.stored), { shareDm: dm, memberOverrides: r.ov }), r.ov);
      for (const [eng, a, b] of [['server', ra.docs.gallery, rb.docs.gallery], ['twin', tw(ra), tw(rb)]]) {
        const ka = keyOf(a); const kb = keyOf(b);
        const cmp = KEY_RANK[String(ka)] === KEY_RANK[String(kb)] ? 'EQUAL' : KEY_RANK[String(ka)] > KEY_RANK[String(kb)] ? 'HIGHER' : 'LOWER';
        tally[`${eng} dm=${dm}`] = tally[`${eng} dm=${dm}`] || { EQUAL: 0, LOWER: 0, HIGHER: 0 };
        tally[`${eng} dm=${dm}`][cmp] += 1;
        const cause = cmp === 'EQUAL' ? [] : causeOf(a, b, kb);
        told.push(`${t.seed} ${eng} dm=${dm}: served ${ka} | counterfactual ${kb} | ${cmp}${cause.length ? ` | cause: ${cause.join(', ')}` : ''}`);
        if (cmp === 'HIGHER') bad.push(`${t.seed} ${eng} dm=${dm}: served ${ka} above the counterfactual's ${kb} (${cause.join(', ') || 'no single field'})`);
        if (cmp === 'LOWER' && !cause.length) bad.push(`${t.seed} ${eng} dm=${dm}: served ${ka} below ${kb} with no cause named`);
        const magic = (d) => (d?.economicState?.safetyProfile?.crimeTypes || []).some((c) => c?.type === 'Magical crime');
        if (magic(a) && !magic(b)) bad.push(`${t.seed} ${eng} dm=${dm}: "Magical crime" served, not in the counterfactual`);
      }
    }
    note('R3-CURE-2 unit 2, the Defense key per town (open veil, gallery):', J(tally), `\n  ${told.join('\n  ')}`);
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);

  it('the twin (projectShareVeil over galleryPayloadFor) sends what the server sends at every R3 path of the gallery read', () => {
    const differ = [];
    for (const r of reads) {
      const twin = veil.projectShareVeil(veil.galleryPayloadFor(clone(r.stored), { shareDm: r.dm, memberOverrides: r.ov }), r.ov);
      for (const re of R3_PATHS) {
        const a = [...valuesAt(r.docs.gallery, re)].sort(); const b = [...valuesAt(twin, re)].sort();
        if (J(a) !== J(b)) differ.push(`${re} @ ${r.t.seed} ${r.kind} dm=${r.dm}`);
      }
      // the criminal desk by its presence: its wording differs between the engines at R3's base on every read (red.txt: a
      // twin-laxer class of R7's, VR15 (b)); R3's rule decides whether it is sent
      const has = (d) => !!d?.publicProse?.blocks && 'defense:criminal' in d.publicProse.blocks;
      if (has(r.docs.gallery) !== has(twin)) differ.push(`defense:criminal presence @ ${r.t.seed} ${r.kind} dm=${r.dm}`);
    }
    expect(differ).toEqual([]);
  }, ARM_TIMEOUT_MS);

});

// ── R3-CURE-7 (ruling 53, condition 2: THE WALKER) ───────────────────────────────────────────────────────────────────────
// Until the fold owed in R4-CURE-2 (one id-as-text helper in 212, revoked by name, the six sites repointed), 212 writes "a
// person's id as text" INLINE, six times, in _gallery_veil_roster_choices's people pass (R3-CURE-5). This walker reads 212's
// own text, finds every expression of the shape
//   coalesce(case when jsonb_typeof(<x> -> 'id') <...> then <x> ->> 'id' end, '')
// (any body between `jsonb_typeof(<x> -> 'id')` and `end, ''`, so a drifted occurrence is found and compared, not missed),
// normalizes <x> and the whitespace, and holds EXACTLY SIX occurrences, all ONE text, that text the scalar's own. Its own
// describe: it needs no database, so it runs without the pglite boot above.
const MIGRATION_212_URL = new URL('../../supabase/migrations/212_share_veil_later_cures.sql', import.meta.url);
const ID_TEXT_SHAPE = /coalesce\(\s*case\s+when\s+jsonb_typeof\(\s*([a-z_][a-z0-9_]*)\s*->\s*'id'\s*\)([\s\S]*?)\bend\s*,\s*''\s*\)/gi;
const ID_TEXT_ONE = "coalesce(case when jsonb_typeof(<x> -> 'id') in ('string', 'number', 'boolean') then <x> ->> 'id' end, '')";
/** Every inline id-as-text expression of a SQL text, normalized: { at: line, x, text }. */
function idTextSitesOf(sql) {
  return [...sql.matchAll(ID_TEXT_SHAPE)].map((m) => {
    const x = m[1];
    const text = m[0].replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
      .replace(new RegExp(`\\b${x}\\b(?=\\s*-)`, 'g'), '<x>');
    return { at: sql.slice(0, m.index).split('\n').length, x, text };
  });
}
describe('R3-CURE-7 (ruling 53, condition 2): THE WALKER over 212\'s inline id-as-text expressions', () => {
  it('212 writes a person\'s id as text EXACTLY SIX times, all ONE text (ruling 53: one helper owed; the fold owed in R4-CURE-2 retires this walker)', () => {
    const sql = readFileSync(MIGRATION_212_URL, 'utf8');
    const sites = idTextSitesOf(sql);
    const texts = [...new Set(sites.map((s) => s.text))];
    const said = `ruling 53 (the chair, 15:10): until the fold owed in R4-CURE-2 retires this walker (one id-as-text helper in 212, the six sites repointed), 212's inline id-as-text expressions are six and ONE text; found ${sites.length}: ${J(sites.map((s) => `line ${s.at} (${s.x}): ${s.text}`))}`;
    note('R3-CURE-7 walker (ruling 53): inline id-as-text expressions in 212:', sites.length, J(sites.map((s) => `${s.at}:${s.x}`)), '| texts:', texts.length);
    expect(sites.length, said).toBe(6);
    expect(texts, said).toEqual([ID_TEXT_ONE]);
  });
});

// ── R3-CURE-8 (VEIL-27's builder; ruling 55, the chair 16:45: THE TWIN SENDS MORE) ──────────────────────────────────────────
// Its own chain and its own boot (the R3 describe's boot hook is at its deadlock guard): the hook boots and births only; each
// town's reads run in that town's own arm. Every setting of the owner's switches (the gate's own; the seven other mixes
// g:<bits> of the three criminal groupings, each open 1 or shut 0, the hooks tab open; "Show everything criminal" with every
// hideable house at its default; the switch OFF), Reveal DM off and on: the gallery read at every setting; at the gate's own
// the party link, the import and the campaign map's member too. Each server read against the twin's projection of the same
// share (the map's member is read with Reveal DM OFF whatever the share says, 211 :: get_gallery_map; the link is always the
// player view): the served `availableServices` compared WITHOUT REGARD TO KEY ORDER, array order exact (VR45).
describe('R3-CURE-8 (ruling 55): a services row with no `institution` key, the twin against 212', () => {
  let db;
  let veil;
  let sw;
  let towns;
  let families;
  let m = 0;
  const at = '2026-11-01T00:00:00.000Z';
  const opened = (as) => as.map((a) => ({ address: a, hidden: false }));
  /** The owner's switch settings, each computed on the record read (out/v27/tell/measure/tell-common.mjs :: settings). */
  const settingsOf = (stored, dm) => {
    const pub = veil.galleryPayloadFor(clone(stored), { shareDm: dm, memberOverrides: null });
    const model = veil.curateModelFor(pub, []);
    const present = sw.presentCriminalGroupings(pub);
    const out = { own: opened(OPEN) };
    for (let b = 0; b < 7; b += 1) {
      const bits = [4, 2, 1].map((x) => ((b & x) ? '1' : '0')).join('');
      out[`g:${bits}`] = opened(['tab:plot_hooks', ...SVC_CRIM.filter((_g, i) => bits[i] === '1')]);
    }
    out.allOpen = sw.setCriminalVeil(opened(OPEN), model.defaults, false, present, model).filter((d) => !String(d.address).startsWith('card:institution:'));
    out.off = sw.setCriminalVeil(opened(OPEN), model.defaults, true, present, model);
    return out;
  };
  /** Every read of one town, every setting, Reveal DM off and on. */
  const readTown = async (t) => {
    const out = [];
    for (const dm of [false, true]) for (const [setting, deltas] of Object.entries(settingsOf(t.stored, dm))) {
      m += 1;
      const ov = veil.writeShareVeil({}, deltas, { mode: 'live', at });
      const id = `7e5c0000-0000-0000-0000-${String(m).padStart(12, '0')}`;
      const slug = `sv${m}`;
      await db.query(`insert into public.settlements (id,user_id,name,tier,data,is_public,public_slug,published_at,unlisted_slug,visibility,gallery_member_overrides,gallery_share_dm,gallery_importable)
        values ($1,$2,$3,$4,$5::jsonb,true,$6,now(),$7,'unlisted',$8::jsonb,$9,true)`, [id, OWNER, String(t.stored.name || 'T'), String(t.stored.tier || 'town'), J(t.stored), slug, `${slug}-link`, J(ov), dm]);
      await db.exec(`set test.uid = '';`);
      const docs = { gallery: (await db.query('select to_jsonb(g.data) d from public.get_gallery_dossier($1) g', [slug])).rows[0]?.d };
      if (setting === 'own') {
        await db.query(`insert into public.saved_maps (id, user_id, name, map_data, is_public, public_slug, unlisted_slug, visibility, share_kind, gallery_share_campaign, gallery_importable)
          values (gen_random_uuid(), $1, 'm', $2, true, $3, $4, 'unlisted', 'map_with_campaign', true, true)`, [OWNER, J({ campaign: { settlementIds: [id] } }), `${slug}-map`, `${slug}-mapl`]);
        docs.map = (await db.query('select public.get_gallery_map($1) #> \'{members,0,settlement}\' d', [`${slug}-map`])).rows[0]?.d;
        if (!dm) docs.link = (await db.query('select public.get_unlisted_dossier($1) -> \'dossier\' d', [`${slug}-link`])).rows[0]?.d;
        await db.exec(`set test.uid = '${READER}';`);
        docs.import = (await db.query('select to_jsonb(g.data) d from public.import_gallery_dossier($1) g', [slug])).rows[0]?.d;
        await db.exec(`set test.uid = '';`);
      }
      out.push({ t, setting, dm, ov, docs });
    }
    return out;
  };
  /** Per read: the two engines' `availableServices` (VR45), and every row with no `institution` key each serves, by family. */
  const parity = (rs) => {
    const bad = []; const keyless = { server: {}, twin: {} }; let compared = 0;
    for (const r of rs) {
      const twinOf = (dm) => veil.projectShareVeil(veil.galleryPayloadFor(clone(r.t.stored), { shareDm: dm, memberOverrides: r.ov }), r.ov);
      const twin = twinOf(r.dm); const twinOff = r.dm ? twinOf(false) : twin;
      for (const [read, d] of Object.entries(r.docs).filter(([, x]) => isRec(x))) {
        const tw = read === 'map' || read === 'link' ? twinOff : twin;
        compared += 1;
        if (canon(d.availableServices ?? null) !== canon(tw.availableServices ?? null)) {
          const a = new Set(keylessOf(d)); const b = new Set(keylessOf(tw));
          bad.push(`${r.t.seed} ${r.setting} dm=${r.dm} ${read}: server more ${J([...a].filter((x) => !b.has(x)))} | twin more ${J([...b].filter((x) => !a.has(x)))}${canon([...a]) === canon([...b]) ? ' (the keyed rows differ)' : ''}`);
        }
        for (const [eng, doc] of [['server', d], ['twin', tw]]) for (const x of keylessOf(doc)) { const f = x.split(':')[0]; keyless[eng][f] = (keyless[eng][f] || 0) + 1; }
      }
    }
    return { bad, keyless, compared };
  };

  beforeAll(async () => {
    db = new PGlite({ extensions: { pgcrypto } });
    expect(await bootChain(db)).toEqual([]);
    await db.exec(`insert into auth.users (id) values ('${READER}') on conflict do nothing; insert into public.profiles (id) values ('${READER}') on conflict do nothing;
      create or replace function public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`);
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
    const { generateAvailableServices } = await import('../../src/generators/servicesGenerator.js');
    veil = await import('../../src/domain/display/galleryVeil.js');
    sw = await import('../../src/domain/display/criminalVeilSwitch.js');
    await loadGenerationLawPayloads();
    // THE FAMILY LIST, FROM THE GENERATOR (never a hand list): the buckets it writes for a town of every size, and the custom one
    families = [...new Set([...['village', 'town', 'city', 'metropolis'].flatMap((tier) => Object.keys(generateAvailableServices(tier, [], {}, {}))), SVC_CUSTOM_FAMILY])];
    const birth = (size, crisis, seed) => {
      const cfg = birthConfig({ ...DEFAULT_CONFIG, ...BIRTH_DIALS, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) });
      const t = { ...generateSettlementPipeline(cfg, null, { seed, customContent: {} }) }; delete t.publicProse;
      return clone(withPublicProse(t, composePublicProse(t)));
    };
    towns = [...SVC_SEEDS.map((k) => { const [size, crisis] = k.split('-'); return { seed: k, stored: birth(size, crisis, `r3m-${k}`) }; }),
      { seed: 'hand-services', stored: handSvcOf(families) }];
  }, PGLITE_BOOT_TIMEOUT_MS);
  afterAll(async () => { if (db) await db.close(); });

  for (const seed of SVC_SEEDS) {
    it(`R3-CURE-8 THE TEN TOWNS of R3-TELL's STOP 1, ${seed}: the twin serves EXACTLY the \`availableServices\` 212 serves (VR45), rows with no \`institution\` key included; every setting, gallery, link, import and map, Reveal DM off and on`, async () => {
      const t = towns.find((x) => x.seed === seed);
      // the town holds what STOP 1 named: a criminal row and a house the default veil hides whole
      expect(t.stored.availableServices?.criminal?.length).toBeGreaterThan(0);
      const rs = await readTown(t);
      const { bad, keyless, compared } = parity(rs);
      note(`R3-CURE-8 ${seed}: reads compared`, compared, '| rows with no institution key served, by family (server | twin):', J(keyless.server), '|', J(keyless.twin), '| differing reads:', bad.length, bad.length ? `\n  ${bad.join('\n  ')}` : '');
      expect(rs.length).toBe(2 * 10);
      expect(compared).toBe(2 * 10 + 5);
      expect(bad).toEqual([]);
    }, ARM_TIMEOUT_MS);
  }

  it('R3-CURE-8 THE HAND PLANT PER FAMILY (every family the generator writes, and a custom one): a row born with no `institution` key and a row the hidden-house sweep leaves with none are treated ALIKE by the twin and 212, every setting, every read, Reveal DM off and on; the served house\'s row stays and the hidden house\'s row leaves, both engines', async () => {
    const t = towns.find((x) => x.seed === 'hand-services');
    const rs = await readTown(t);
    const { bad, keyless, compared } = parity(rs);
    const rows = [];
    for (const r of rs) for (const [read, d] of Object.entries(r.docs).filter(([, x]) => isRec(x))) {
      const av = isRec(d.availableServices) ? d.availableServices : {};
      for (const f of families) {
        const names = (Array.isArray(av[f]) ? av[f] : []).map((x) => x?.name);
        if (names.includes(`Hidden ${f}`)) rows.push(`${r.setting} dm=${r.dm} ${read} ${f}: the hidden house's row served`);
        if (f in av && !names.includes(`Served ${f}`)) rows.push(`${r.setting} dm=${r.dm} ${read} ${f}: the served house's row withheld`);
      }
    }
    note('R3-CURE-8 the hand plant: reads compared', compared, '| families', J(families), '| rows with no institution key served, by family (server | twin):', J(keyless.server), '|', J(keyless.twin), '| differing reads:', bad.length, bad.length ? `\n  ${bad.join('\n  ')}` : '');
    expect(compared).toBe(2 * 10 + 5);
    expect(rows).toEqual([]);
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);

  // R3-CURE-8 unit 5 (ruling 55): THE PARITY WALKER. The family list is the GENERATOR'S (servicesGenerator.js ::
  // generateAvailableServices, every size; the custom family as economyReconcilePass.js writes one), never a hand list, and
  // every family a born town of the ten wrote is in it. For each family, a row born with no `institution` key and a row the
  // hidden-house sweep leaves with none are each SERVED BY BOTH ENGINES or WITHHELD BY BOTH, every setting, every read, Reveal
  // DM off and on; each family judged where a read serves it. Its teeth (out/v27/r3c8/walker-scratch-red.txt, never
  // committed): the twin's rule (c) taken back out of galleryRosterChoices.js reds it on the criminal family.
  it('R3-CURE-8 unit 5, THE PARITY WALKER: for EVERY `availableServices` family the generator writes (and a custom one), a row with no `institution` key is served or withheld ALIKE by the twin and 212, every setting, every read, Reveal DM off and on; the outcome per family is said', async () => {
    const born = new Set(towns.filter((t) => t.seed !== 'hand-services').flatMap((t) => Object.keys(t.stored.availableServices || {})));
    expect([...born].filter((f) => !families.includes(f))).toEqual([]);
    expect(families).toContain('criminal');
    expect(families.length).toBeGreaterThanOrEqual(born.size);
    const rs = await readTown({ seed: 'walker-services', stored: handSvcOf(families) });
    const bad = []; const table = {};
    for (const r of rs) {
      const twinOf = (dm) => veil.projectShareVeil(veil.galleryPayloadFor(clone(r.t.stored), { shareDm: dm, memberOverrides: r.ov }), r.ov);
      const twin = twinOf(r.dm); const twinOff = r.dm ? twinOf(false) : twin;
      for (const [read, d] of Object.entries(r.docs).filter(([, x]) => isRec(x))) {
        const tw = read === 'map' || read === 'link' ? twinOff : twin;
        for (const f of families) {
          const rowsOf = (doc) => (isRec(doc.availableServices) && Array.isArray(doc.availableServices[f]) ? doc.availableServices[f] : null);
          const a = rowsOf(d); const b = rowsOf(tw);
          if ((a === null) !== (b === null)) { bad.push(`${f} ${r.setting} dm=${r.dm} ${read}: the family served by ${a ? 'the server' : 'the twin'} alone`); continue; }
          if (a === null) continue;
          if (canon(a) !== canon(b)) bad.push(`${f} ${r.setting} dm=${r.dm} ${read}: server ${J(a.map((x) => x?.name))} | twin ${J(b.map((x) => x?.name))}`);
          for (const kind of ['Keyless', 'Swept']) {
            const has = (rows) => rows.some((x) => isRec(x) && x.name === `${kind} ${f}` && !Object.prototype.hasOwnProperty.call(x, 'institution'));
            const k = `${has(a) ? 'server' : '-'}/${has(b) ? 'twin' : '-'}`;
            const cell = ((table[f] = table[f] || {})[kind] = table[f][kind] || {});
            cell[k] = (cell[k] || 0) + 1;
            if (has(a) !== has(b)) bad.push(`${f} ${r.setting} dm=${r.dm} ${read}: the ${kind.toLowerCase()} row served by ${has(a) ? 'the server' : 'the twin'} alone`);
          }
        }
      }
    }
    note('R3-CURE-8 unit 5, THE PARITY WALKER: families (from the generator)', J(families), '| born families', J([...born].sort()), '| per family, the row with no key (served by server/twin: reads):', Object.entries(table).map(([f, v]) => `\n  ${f}: ${J(v)}`).join(''), '| faults:', bad.length, bad.length ? `\n  ${bad.slice(0, 60).join('\n  ')}` : '');
    for (const f of families) expect(table[f], `${f}: judged on no read`).toBeTruthy();
    expect(bad).toEqual([]);
  }, ARM_TIMEOUT_MS);
});
