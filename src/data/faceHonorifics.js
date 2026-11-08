/**
 * faceHonorifics.js — THE HONORIFIC OF EVERY FACE'S TITLE (PEOPLE-6 LINKS step 2, the owner's word
 * of 2026-11-07: "can you give appropriate weighty titles/roles to each NPC based on their
 * institution? Like the NPC of a village church is Pastor Robert Thomas. And that's how it's
 * presented on the institution card. Whereas the NPC card says their full name. Without the title
 * but underneath the link to institution it shows their role in another row").
 *
 * THE POOL (the owner's refinement, 16:5x UTC: "a pool of weighty leadership/ownership titles per
 * each institution to choose from"): every title holds the weighty forms that mean leading or
 * owning its institution, index 0 the canonical one; a title with nothing weightier holds its role
 * capitalised alone. The PICK is display-only and deterministic: `pickVariant` (the kernel's
 * zero-draw FNV-1a, src/kernel/proseHash.js) over a seed of the card's id and its institution key,
 * so one card reads one form on every surface and no draw, field or golden moves.
 *
 * A REGISTRY-ONLY mark, the census's sibling: keyed by the face's TITLE (the census's `face`, and
 * the two mints' titles in generators/people/mintTitles.js), so one title has one honorific at every
 * tier and the minted faces, which have no catalog row, are reached by the same table. Never written
 * onto a card or a save: the surfaces resolve it at render from the card's `institution.title`, so
 * no generator byte moves. A form is the weighty period one where the institution holds it
 * ("Pastor", "Castellan", "Master Smith"); else the role capitalised, as the street knows them
 * ("Innkeeper", "Fence"). A gendered form is `{ male, female }`, read by the card's `gender`
 * (the masculine where the card states none). Pure data and one resolver; no draw.
 */

import { pickVariant } from '../kernel/proseHash.js';

/** @typedef {string | { male: string, female: string }} Honorific */

/** title → the pool of honorifics; the walker (tests/data/faceHonorifics.test.js) pins every face and mint title. @type {Readonly<Record<string, readonly Honorific[]>>} */
export const FACE_HONORIFICS = Object.freeze({
  "the boat-headman": ["Headman", "Boat-Master", "Skipper"],
  "the head shepherd": ["Head Shepherd", "Master Shepherd"],
  "the camp foreman": ["Foreman", "Camp Master"],
  "the eldest": ["Elder", "Eldest"],
  "the eldest householder": ["Elder", "Goodman"],
  "the reeve": ["Reeve"],
  "the household elder": ["Elder", "Head of the Household"],
  "the fence": ["Fence"],
  "the outlaw host": ["Captain", "Outlaw Chief"],
  "the dairy farmer": ["Dairyman", "Dairy Farmer"],
  "the collier": ["Collier", "Master Collier"],
  "the peat-reeve": ["Peat-Reeve", "Reeve"],
  "the mine captain": ["Mine Captain", "Captain", "Mine-Master"],
  "the quarry master": ["Quarrymaster", "Master Quarrier"],
  "the salt master": ["Saltmaster", "Master of the Saltworks"],
  "the master of the hunt": ["Huntmaster", "Master of the Hunt"],
  "the pawnbroker": ["Pawnbroker", "Pawnmaster"],
  "the innkeeper": ["Innkeeper", "Landlord", "Host"],
  "the alewife": ["Alewife", "Brewster"],
  "the caravanserai keeper": ["Caravanserai Keeper", "Host"],
  "the horse-coper": ["Horse-Coper", "Horse-Dealer"],
  "the stable keeper": ["Stablekeeper", "Ostler"],
  "the maltster": ["Maltster", "Master Maltster"],
  "the smith": ["Smith", "Blacksmith"],
  "the carpenter": ["Carpenter", "Wright"],
  "the steward": ["Steward", "Seneschal"],
  "the headman": ["Headman", "Chief"],
  "the militia captain": ["Captain", "Captain of the Militia"],
  "the hedge wizard": ["Hedge Wizard", "Cunning-Man"],
  "the charter master": ["Chartermaster", "Master of the Charter"],
  "the bandit contact": ["Go-Between"],
  "the smuggler": ["Smuggler"],
  "the fishmonger": ["Fishmonger"],
  "the master fishmonger": ["Master Fishmonger", "Fishmonger"],
  "the beekeeper": ["Beekeeper", "Beemaster"],
  "the wildfowler": ["Fowler", "Wildfowler"],
  "the waystation keeper": ["Waystation Keeper", "Host"],
  "the carriers' master": ["Master Carrier", "Carriers' Master"],
  "the ferryman": ["Ferryman", "Ferry-Master"],
  "the boatwright": ["Boatwright", "Master Boatwright"],
  "the toll-keeper": ["Toll-Keeper", "Tollman"],
  "the miller": ["Miller", "Master Miller"],
  "the thatcher": ["Thatcher", "Master Thatcher"],
  "the cooper": ["Cooper", "Master Cooper"],
  "the apothecary": ["Apothecary", "Master Apothecary"],
  "the bowyer": ["Bowyer", "Master Bowyer"],
  "the sawyer": ["Sawyer", "Master Sawyer"],
  "the brewer": ["Brewer", "Master Brewer"],
  "the tanner": ["Tanner", "Master Tanner"],
  "the fuller": ["Fuller", "Master Fuller"],
  "the dyer": ["Dyer", "Master Dyer"],
  "the potter": ["Potter", "Master Potter"],
  "the brickmaker": ["Brickmaker", "Master Brickmaker"],
  "the cobbler": ["Cobbler", "Master Cobbler"],
  "the tailor": ["Tailor", "Master Tailor"],
  "the midwife": ["Midwife", "Goodwife"],
  "the woodcarver": ["Woodcarver", "Master Carver"],
  "the scribe": ["Scribe", "Clerk"],
  "the cartographer": ["Cartographer", "Mapmaker"],
  "the priest": ["Pastor", { male: "Father", female: "Mother" }, "Vicar", "Reverend"],
  "the archdruid": ["Archdruid"],
  "the village elder": ["Elder", "Village Elder"],
  "the watch sergeant": ["Sergeant", "Sergeant of the Watch"],
  "the lodge master": ["Lodgemaster", "Master of the Lodge"],
  "the healer": ["Healer", "Leech"],
  "the network's spider": ["Spider"],
  "the musician": ["Minstrel", "Bard"],
  "the senior guild master": ["Guildmaster", "Master of the Guild", "Warden of the Guild"],
  "the banker": ["Banker", "Master of the House"],
  "the tavern keeper": ["Taverner", "Landlord", "Host"],
  "the coaching-inn keeper": ["Innkeeper", "Landlord", "Host"],
  "the post's master": ["Postmaster", "Master of the Post"],
  "the stable master": ["Stablemaster", "Master of Horse"],
  "the beast master": ["Beastmaster", "Master of Beasts"],
  "the postmaster": ["Postmaster", "Master of the Post"],
  "the master shipwright": ["Master Shipwright", "Shipwright"],
  "the barge master": ["Bargemaster", "Master of Barges"],
  "the wharfinger": ["Wharfinger", "Wharfmaster"],
  "the harbour master": ["Harbourmaster", "Master of the Harbour"],
  "the customs collector": ["Collector", "Searcher", "Collector of Customs"],
  "the granary reeve": ["Granary Reeve", "Granger"],
  "the warehouse factor": ["Factor", "Warehouse Master"],
  "the bath-keeper": ["Bath-Keeper", "Bathmaster"],
  "the slaver": ["Slaver"],
  "the auctioneer": ["Auctioneer", "Master of the Block"],
  "the assayer": ["Assayer", "Master Assayer"],
  "the mint master": ["Mintmaster", "Master of the Mint"],
  "the watcher": ["Watcher"],
  "the master smith": ["Master Smith", "Smith-master"],
  "the jeweller": ["Jeweller", "Master Jeweller"],
  "the master carpenter": ["Master Carpenter", "Master Wright"],
  "the vintner": ["Vintner", "Master Vintner"],
  "the master tanner": ["Master Tanner", "Tanner"],
  "the master weaver": ["Master Weaver", "Weaver-master"],
  "the master butcher": ["Master Butcher", "Butcher"],
  "the master baker": ["Master Baker", "Baker"],
  "the smelt master": ["Smeltmaster", "Master Smelter"],
  "the chandler": ["Chandler", "Master Chandler"],
  "the glassmaker": ["Glassmaker", "Master Glazier"],
  "the ropemaker": ["Ropemaker", "Master Roper"],
  "the printer": ["Printer", "Master Printer"],
  "the senior craft-guild master": ["Guildmaster", "Master of the Guild"],
  "the alchemist": ["Alchemist", "Master Alchemist"],
  "the dean": ["Dean"],
  "the abbot": [{ male: "Abbot", female: "Abbess" }, { male: "Father Abbot", female: "Mother Abbess" }],
  "the hospitaller": ["Hospitaller", "Brother Hospitaller"],
  "the almoner": ["Almoner"],
  "the foundling-mother": ["Mother", "Matron"],
  "the grove elder": ["Elder", "Grove-Warden"],
  "the lord's appointee": ["Bailiff", "Lord's Bailiff"],
  "the first councillor": ["First Councillor", "Councillor"],
  "the mayor": ["Mayor", "Lord Mayor"],
  "the consortium speaker": ["Speaker", "Speaker of the Consortium"],
  "the first magnate": ["Magnate", "First Magnate"],
  "the crier": ["Crier", "Town Crier"],
  "the magistrate": ["Magistrate", "Justice"],
  "the gaoler": ["Gaoler", "Keeper"],
  "the workhouse master": ["Workhouse Master", "Master of the Workhouse"],
  "the watch captain": ["Captain", "Captain of the Watch"],
  "the garrison commander": ["Commander", "Captain"],
  "the castellan": ["Castellan", "Constable"],
  "the company captain": ["Captain", "Company Captain"],
  "the warden": ["Warden"],
  "the wizard": ["Wizard", "Magus"],
  "the guild archmage": ["Archmage", "Master of the Guild"],
  "the scroll scribe": ["Scribe", "Master Scribe"],
  "the circle-keeper": ["Circle-Keeper", "Keeper"],
  "the hiring master": ["Hiring Master"],
  "the blade captain": ["Captain", "Blade-Captain"],
  "the gang boss": ["Boss"],
  "the front man": ["Frontman"],
  "the rookery boss": ["Boss"],
  "the troupe leader": ["Troupe Leader", "Troupe Master"],
  "the theatre manager": ["Theatre Manager", "Manager"],
  "the house boss": ["Boss"],
  "the madam": ["Madam"],
  "the pit boss": ["Pit Boss"],
  "the lanista": ["Lanista"],
  "the fortune teller": ["Fortune-Teller", "Seer"],
  "the master furrier": ["Master Furrier", "Furrier"],
  "the exchange's steward": ["Steward", "Steward of the Exchange"],
  "the master of granaries": ["Master of Granaries", "Granger"],
  "the slave-market master": ["Slavemaster"],
  "the chronicler": ["Chronicler"],
  "the master metalworker": ["Master Metalworker"],
  "the luxury merchant": ["Merchant", "Merchant Prince"],
  "the senior abbot": [{ male: "Lord Abbot", female: "Lady Abbess" }, { male: "Abbot", female: "Abbess" }],
  "the bishop": ["Bishop", "Lord Bishop"],
  "the hospital's master": ["Master", "Master of the Hospital"],
  "the governor": ["Governor", "Lord Governor"],
  "the chief administrator": ["Chief Administrator", "Administrator"],
  "the doge": ["Doge"],
  "the speaker of the assembly": ["Speaker", "Speaker of the Assembly"],
  "the monarch": [{ male: "King", female: "Queen" }, { male: "Sovereign", female: "Sovereign" }],
  "the chief magistrate": ["Chief Magistrate", "Chief Justice"],
  "the prison warden": ["Warden", "Keeper"],
  "the watch commander": ["Commander", "Commander of the Watch"],
  "the enchanter": ["Enchanter", "Master Enchanter"],
  "the senior charter master": ["Chartermaster", "Master of the Charter"],
  "the outfitter": ["Outfitter"],
  "the sage": ["Sage"],
  "the network's head": ["Spymaster"],
  "the guildmaster of thieves": ["Guildmaster"],
  "the whisper broker": ["Broker"],
  "the black marketeer": ["Black Marketeer"],
  "the killer": ["Killer"],
  "the ringleader": ["Ringleader"],
  "the trafficker": ["Trafficker"],
  "the college master": ["Master", "Master of the College"],
  "the district madam": ["Madam"],
  "the golem-master": ["Golem-Master"],
  "the necromancer-overseer": ["Overseer"],
  "the exchange master": ["Exchange Master", "Master of the Exchange"],
  "the librarian": ["Librarian", "Keeper of the Books"],
  "the chancellor": ["Chancellor", "Lord Chancellor"],
  "the envoy": ["Envoy", "Emissary"],
  "the undercity boss": ["Boss"],
  "the guild's master": ["Guildmaster", "Master of the Guild"],
  "the impresario": ["Impresario"],
  "the arena master": ["Arena Master", "Master of the Games"],
  "the planar factor": ["Factor"],
  "the dragon": ["Dragon"],
  "the dream-keeper": ["Dream-Keeper"],
  "the skydock master": ["Dockmaster", "Skydock Master"],
  "the message-master": ["Message-Master"],
  "the royal governor": ["Royal Governor", "Governor"],
  "the commander": ["Commander", "Captain"],
  "the war-leader": ["War-Leader", "Warlord"],
  "the occupying governor": ["Governor", "Military Governor"],
  "the high priest": [{ male: "High Priest", female: "High Priestess" }],
  "the elder priest": ["Elder Priest", { male: "Father", female: "Mother" }],
  "the guildmaster": ["Guildmaster", "Master of the Guild"],
  "the council's fixer": ["Fixer"],
  "the guild master": ["Guildmaster", "Master of the Guild"],
  "the craft-guild master": ["Guildmaster", "Master of the Guild"],
  "the grain factor": ["Factor", "Grain Factor"],
  "the lord": [{ male: "Lord", female: "Lady" }],
  "the circle's first": [{ male: "Lord", female: "Lady" }],
  "the magister": ["Magister"],
  "the council's archmage": ["Archmage"],
  "the revolt's leader": ["Leader of the revolt"],
  "the creditor's agent": ["Agent"],
  "the reformer": ["Reformer"],
  "the investigator": ["Investigator"],
  "the bloc's speaker": ["Speaker"],
  "the newcomers' spokesman": ["Spokesman"],
  "the alliance's convenor": ["Convenor"],
  "the commoners' tribune": ["Tribune"],
  "the neutrals' broker": ["Broker"],
  "the peacemaker": ["Peacemaker"],
  "the abolitionist": ["Abolitionist"],
  "the journeymen's warden": ["Warden"],
});

/**
 * THE HARBOUR'S WORDS GUARDED BY THE COAST (the chair's ruling of 2026-11-08 on the soak's A-11
 * sea-words-landlocked mover at the people car's tip, MERGE-CAR): a harbour master's office on a
 * settlement with NO COAST — inland, or a river port — is a dock, not a harbour, so its pool there
 * is this one; on a coastal settlement (and where the place is not known) the registry's own pool
 * above stands. The coast is the fact the generator already holds (domain/facts/water.js ::
 * waterOf, from the terrain and the trade route); display-only, no draw, no golden moves.
 * @type {Readonly<Record<string, readonly Honorific[]>>}
 */
export const FACE_HONORIFICS_INLAND = Object.freeze({
  "the harbour master": ["Dockmaster", "Wharfinger"],
});

/**
 * THE CULTURE'S OWN WORD FOR THE OFFICE (WAVE-RULINGS item 14, the owner's word of 2026-11-08: "Yeah do
 * those before deploy"): the cultural honorific ('Jarl', 'Druid', the old role vocabulary of
 * data/namingData.js) that fell off the card when role became title returns HERE, as a culture-keyed
 * pool beside the registry's — never a second role field, never written onto a card. Keyed by the
 * canonical culture (data/worldFactOptions.js :: CULTURES), then by the face's title; for the
 * LEADERSHIP, FAITH and WARDEN titles only, and only where the culture holds a real period form of
 * that office (in the old role vocabulary or in standard English usage). A culture's pool REPLACES the
 * registry's for that title on a settlement of that culture; a culture or title not named here reads
 * the registry ('mixed' and an unknown culture included). East-Asian names none: no form of its offices
 * passes the rule, so the registry stands. Display-only, no draw, no golden moves.
 * @type {Readonly<Record<string, Readonly<Record<string, readonly Honorific[]>>>>}
 */
export const FACE_HONORIFICS_BY_CULTURE = Object.freeze({
  germanic: Object.freeze({
    "the mayor": ["Burgomaster"],
  }),
  latin: Object.freeze({
    "the lord": [{ male: "Dominus", female: "Domina" }],
    "the high priest": ["Pontifex"],
    "the watch captain": ["Tribune"],
    "the watch commander": ["Prefect"],
    "the garrison commander": ["Prefect"],
  }),
  celtic: Object.freeze({
    "the headman": ["Chieftain"],
    "the priest": ["Druid"],
    "the elder priest": ["Druid"],
    "the high priest": ["Druid"],
  }),
  arabic: Object.freeze({
    "the eldest": ["Sheikh"],
    "the village elder": ["Sheikh"],
    "the headman": ["Sheikh"],
    "the lord": ["Emir"],
    "the governor": ["Wali"],
    "the royal governor": ["Wali"],
    "the priest": ["Imam"],
    "the elder priest": ["Imam"],
    "the garrison commander": ["Qaid"],
  }),
  norse: Object.freeze({
    "the lord": ["Jarl"],
    "the headman": ["Jarl"],
    "the priest": [{ male: "Godi", female: "Gydja" }],
    "the elder priest": [{ male: "Godi", female: "Gydja" }],
    "the high priest": [{ male: "Godi", female: "Gydja" }],
  }),
  slavic: Object.freeze({
    "the eldest": ["Starosta"],
    "the village elder": ["Starosta"],
    "the headman": ["Starosta"],
    "the lord": [{ male: "Boyar", female: "Boyarina" }],
    "the war-leader": ["Voivode"],
    "the commander": ["Voivode"],
    "the garrison commander": ["Voivode"],
    "the governor": ["Voivode"],
  }),
  mesoamerican: Object.freeze({
    "the lord": ["Tlatoani"],
    "the monarch": ["Huey Tlatoani"],
    "the priest": ["Tlamacazqui"],
  }),
  south_asian: Object.freeze({
    "the headman": ["Mukhiya"],
    "the lord": [{ male: "Raja", female: "Rani" }],
    "the monarch": [{ male: "Maharaja", female: "Maharani" }],
    "the priest": ["Purohit"],
  }),
  steppe: Object.freeze({
    "the lord": [{ male: "Khan", female: "Khatun" }],
    "the war-leader": ["Noyan"],
    "the occupying governor": ["Darughachi"],
    "the priest": ["Shaman"],
  }),
  greek: Object.freeze({
    "the mayor": ["Archon"],
    "the commander": ["Strategos"],
    "the high priest": ["Hierophant"],
  }),
});

/** The seat mint's fallback title, "the head of <power>" (mintTitles.js :: headOf). */
const HEAD_OF = /^the head of (.+)$/i;

/**
 * THE HONORIFIC OF A TITLE: the form `seed` picks from the title's pool (index 0 for no seed), by
 * gender; "the head of X" → "Head of X"; a title the registry does not name (a DM's own, a future
 * row) → the title without its article, capitalised. '' for no title. `place.coastal === false` (a
 * settlement with no coast) reads FACE_HONORIFICS_INLAND first; any other place reads the registry.
 * @param {unknown} title @param {unknown} [gender] @param {string} [seed]
 * @param {{ coastal?: boolean | null }} [place] @returns {string}
 */
export function honorificOfTitle(title, gender, seed, place = {}) {
  const t = String(title ?? '').trim();
  if (!t) return '';
  const pool = (place?.coastal === false && FACE_HONORIFICS_INLAND[t]) || FACE_HONORIFICS[t];
  if (pool) {
    const h = /** @type {Honorific} */ (pickVariant(pool, seed));
    return typeof h === 'string' ? h : gender === 'female' ? h.female : h.male;
  }
  const head = HEAD_OF.exec(t);
  if (head) return `Head of ${head[1]}`;
  const bare = t.replace(/^the\s+/i, '');
  return bare.charAt(0).toUpperCase() + bare.slice(1);
}
