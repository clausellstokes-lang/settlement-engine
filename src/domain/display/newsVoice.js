/**
 * domain/display/newsVoice.js — THE CRIER'S VOICE SIDECAR.
 *
 * A pure DISPLAY read-model, cut from the same cloth as the W2 conjunction
 * ladder (causeConjunctionContent.js): it READS a wizardNews entry and returns
 * one short, speakable, register-appropriate line a herald/town-crier would
 * proclaim about that news — war, faith, or trade. It is byte-inert to the
 * engine:
 *
 *   • It NEVER mutates an entry — it reads a handful of fields and returns a
 *     string (or null for out-of-scope news).
 *   • It is imported ONLY by the lazy news panel
 *     (src/components/map/WizardNewsPanel.jsx, itself lazy(() => import(...))),
 *     so it rides the lazy chunk and adds ZERO first-paint bytes. It must NEVER
 *     be imported by generation or the world-pulse kernel (SAME-SEED / GOLDEN
 *     laws), and wizardNews.js must never import this.
 *   • Variant selection is a PURE FNV-1a hash of a stable string — no rng
 *     stream, no Date, no wall-clock. Same entry ⇒ same line, always; two
 *     entries in the same cell with distinct ids generally get distinct
 *     variants (anti-repetition), exactly as the conjunction ladder seeds off
 *     the npc id.
 *
 * The voice is diegetic and settlement-AGNOSTIC: it says "the town", "the
 * front", "the market roads", "the faithful" — never a place name (the panel
 * already shows settlement pills), which keeps the module a pure (entry) → line.
 */

/** FNV-1a 32-bit — the pure variant-selection hash (no rng, no Date).
 *  A LOCAL copy of the 8-line helper (the conjunction module is deliberately
 *  NOT imported: it drags large content tables into the news chunk).
 *  @param {string} str */
function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** @typedef {'war'|'faith'|'trade'|'pestilence'|'calamity'|'migration'|'authority'|'succor'|'prosperity'|'reframe'} VoiceCategory */
/** @typedef {'onset'|'impact'|'relief'|'fade'} VoiceBucket */

// ── Category vocabularies (the categorization precedence) ────────────────────
// impactKind-PRIMARY: the impact's NATURE classifies first, across all three
// beats (faith → war → trade); channelType is only the fallback when impactKind
// did not classify (bare/persisted entries). Mirrors the impactKind /
// channelType vocabulary in domain/region/wizardNews.js WITHOUT importing it.
// NB: resource_competition is a WAR channel — the engine only ever mints it
// alongside conflict_pressure, never as a bare trade beat.

/** @type {ReadonlySet<string>} */
const WAR_IMPACT_KINDS = new Set(['conflict_pressure', 'protection_gap']);
/** @type {ReadonlySet<string>} */
const WAR_CHANNEL_TYPES = new Set(['war_front', 'military_protection', 'resource_competition']);
/** @type {ReadonlySet<string>} */
const TRADE_IMPACT_KINDS = new Set([
  'import_shortage', 'export_market_loss', 'route_disruption', 'tax_revenue_disruption',
]);
/** @type {ReadonlySet<string>} */
const TRADE_CHANNEL_TYPES = new Set(['trade_dependency', 'trade_route']);

/**
 * THE CONTENT MAP — VOICE_LINES[category][bucket] is a frozen array of >=7
 * distinct, speakable herald lines (the CONTENT-VT variety floor: a busy
 * simulated year can surface many beats of one class, and a per-cell pool of
 * 3-4 visibly cycles). Every category × (onset|impact|relief|fade) cell is
 * authored across the 10 drama-voice classes (war, faith, trade, pestilence,
 * calamity, migration, authority, prosperity, succor, and the reframe layer's
 * reinterpretation beat); VOICE_FLOOR (below) guarantees totality for any
 * future bucket. Each line is self-contained, settlement-AGNOSTIC (portable
 * specificity — the catalog's own barley/harbours/granaries/autumn, never a
 * canon proper noun; person/place names ride the panel's own pills), ends in
 * terminal punctuation, and carries no template tokens.
 *
 * POOL-GROWTH SAFETY (CONTENT-VT, pinned in newsVoice.test.js): growing a cell
 * is safe precisely because selection is VIEW-TIME — newsVoiceLine reads a
 * persisted entry's stable id and returns a string; it writes NOTHING, and this
 * module is imported only by the lazy WizardNewsPanel, never by generation or
 * the pulse kernel. Selection is `variants[fnv(id) % variants.length]`, so a
 * bigger pool changes the divisor: a given entry id may now render a DIFFERENT
 * (equally valid) variant than it did at the old pool size. That is the point of
 * the wave — more variety — and it is byte-inert to the engine: no wizardNews
 * entry, save, or golden holds a crier line (the line is recomputed every
 * render), so no golden or first-paint byte can move. The invariant that still
 * holds is per-pool determinism: same world state + same pool ⇒ the same line
 * for a given entry id, every render.
 * @type {Readonly<Record<VoiceCategory, Readonly<Record<VoiceBucket, ReadonlyArray<string>>>>>}
 */
export const VOICE_LINES = Object.freeze({
  war: Object.freeze({
    onset: Object.freeze([
      'Steel is drawn along the marches — the muster horns have not stopped since dawn.',
      'Hear it and mark it: a war is gathering at the borders, and the levy is called to the walls.',
      'The watchfires are doubled and the roads run thick with soldiers; the town braces for what is coming.',
      'Grievance has hardened into muster, and the drums along the front will not be quieted.',
      'The smiths work through the night at the whetstone, and every household is counted for the levy.',
      'War-banners are unrolled in the market square, and the young men look to the marches with hard eyes.',
      'The granaries are locked against a siege that has not come yet, and the walls are walked twice a night.',
      'A quarrel between neighbours has grown teeth, and the country readies its pikes for the worst.',
    ]),
    impact: Object.freeze([
      'The blow has fallen; smoke stands where the watchfires were.',
      'War has come in earnest — the fighting is upon the front, and the wounded are already carried back.',
      'The clash is joined, and the town counts its dead before it counts the cost.',
      'Steel has met steel at the front; what was feared is now simply true.',
      'The fields are trampled and the barns emptied to feed the muster; the war eats everything it touches.',
      'Fire runs along the border holdings, and the roads are choked with those fleeing the sword.',
      'The levy marches out under grey banners, and the widows are made before the harvest is in.',
      'The ford is held by force and lost by force, and the river runs foul below the crossing.',
    ]),
    relief: Object.freeze([
      'The banners are furled and the wounded carried home — this front, at least, goes quiet.',
      'The fighting has ebbed; the drums are silent and the muster horns hung up at last.',
      'Peace of a kind holds along the marches, and the levy may sleep in its own beds tonight.',
      'The war has spent itself here — the roads are safe again, and the widows begin their mourning.',
      'The gates stand open once more, and the plough is taken up where the pike was laid down.',
      'A truce is cried in the square, and the smiths turn from spearheads back to ploughshares.',
      'The garrison thins as the danger passes, and the walls are given back to the ivy.',
      'The last of the wounded mend by the hearth, and the marches learn the taste of quiet again.',
    ]),
    fade: Object.freeze([
      'The threatened war never came to the sword; the levy stands down, grumbling.',
      'The muster is dismissed — the threatened war never marched, and the horns fall quiet unblooded.',
      'Whatever gathered at the borders has thought better of it; the walls are unmanned and the drums put away.',
      'The alarm came to nothing — no steel was drawn, and the town returns to its plows.',
      'The war-banners are rolled away unstained, and the whetstones go back to their pegs.',
      'The feared army melted from the marches before a blow fell, and the country lets out its breath.',
      'The quarrel cooled without bloodshed, and the pikes are stacked in the tithe-barn once more.',
      'The border holds without a fight, and the young men who dreamed of glory go back to the fields.',
    ]),
  }),
  faith: Object.freeze({
    onset: Object.freeze([
      'The temples stir — a fervor is rising that the priests did not summon and cannot yet name.',
      'Hear the bells rung out of hour: something moves among the faithful, and the pews will not stay empty.',
      'A holy wind is gathering; the pilgrims are on the roads and the prayers grow loud.',
      'The altars are crowded and the incense thick — a great devotion is coming over the people.',
      'Strange dreams are spoken of at the well, and the shrine keeps its lamps burning past the midnight hour.',
      'The processions grow longer each holy day, and the old hymns are sung in the streets unbidden.',
      'A wandering preacher has set the market talking, and the tithe-box overflows for the first time in an age.',
      'Something has kindled in the congregation; the priests hurry to shape a fire they did not light.',
    ]),
    impact: Object.freeze([
      'The fervor has taken the town; every knee is bent and every voice raised to one name.',
      'The faith has broken over the people like a wave — the temples overflow and the doubters have gone silent.',
      'What stirred in the temples now rules the streets; the devout carry their conviction like a torch.',
      'The revival is upon us in full — the priests scarcely lead it, so hard does it pull.',
      'The holy days are kept with a fierce joy, and no craftsman works while the bells are ringing.',
      'Shrines spring up at every crossroad, and the pilgrims come in such numbers the inns cannot hold them.',
      'The whole country has caught the flame; feast and fast alike are observed with a zeal not seen in a lifetime.',
      'Devotion runs through every quarter like floodwater, and the temple coffers have never been so full.',
    ]),
    relief: Object.freeze([
      'The pilgrims disperse; whatever moved the faithful has, for now, moved on.',
      'The fervor has cooled to embers, and the temples keep their ordinary hours once more.',
      'The great devotion has passed its peak; the roads empty and the bells ring on their proper hours.',
      'Calm returns to the altars — the people have prayed their fill and gone back to their labors.',
      'The processions grow shorter, and the crossroad shrines are left to the wind and the sparrows.',
      'The wandering preacher has moved on down the road, and the congregation settles to its old quiet worship.',
      'The holy fire banks down to a steady warmth, and faith becomes a household thing again.',
      'The inns empty of pilgrims, and the priests return, half-relieved, to sermons that no longer catch like tinder.',
    ]),
    fade: Object.freeze([
      'The kindling of faith never caught; the pilgrims turned for home and the pews stand empty again.',
      'The stir at the temples came to little — a season of talk, and the devout no more numerous than before.',
      'Whatever the priests feared or hoped for has guttered out; the altars are as quiet as ever.',
      'The looked-for revival did not come; the incense is packed away and the bells keep their old silence.',
      'The wandering preacher drew a crowd and then a shrug; the tithe-box is as light as it ever was.',
      'The strange dreams stopped as suddenly as they came, and the shrine lamps are trimmed low once more.',
      'The great devotion that was promised never arrived, and the holy days pass as thinly attended as always.',
      'The flame that seemed to catch in the congregation went cold overnight, and the priests speak of it no more.',
    ]),
  }),
  trade: Object.freeze({
    onset: Object.freeze([
      'The caravan-masters trade worried looks — a shortage is riding in ahead of the wagons.',
      'Mark the market roads: a want is coming, and the wise are laying in stores while they can.',
      'The convoys run thin and the guilds mutter; hard bargaining is on the way.',
      'Word runs ahead of the wagons that the goods will not come as they should — best fill the larder now.',
      'The weigh-house clerks frown over their tallies, and the price of barley creeps up by the day.',
      'A closed road upcountry has the merchants uneasy, and the wharves grow quiet before their time.',
      'The last convoy came in light, and the guildhall is thick with talk of a lean season ahead.',
      'Salt and iron grow dear at the stalls, and the careful housewife buys double while she still can.',
    ]),
    impact: Object.freeze([
      'The market has felt it: shelves thin, prices climb, and the guilds count what is left.',
      'The shortage has bitten — the stalls stand half-empty and every coin buys less than it did.',
      'The want is upon the market roads in full; the merchants ration and the poor go without.',
      'Trade has faltered and the town feels the pinch, from the guildhall down to the humblest cart.',
      'The wharves stand idle and the weigh-house scales gather dust; nothing comes and nothing goes.',
      "Bread is dear and dearer, and the queues at the baker's door start before the cocks have crowed.",
      'The guilds have shut their coffers, and honest work goes begging while the storehouses run dry.',
      'The market square, so lately loud, is a thin and anxious place where every bargain is a quarrel.',
    ]),
    relief: Object.freeze([
      'The roads run sweet again — the missing goods came in on the last convoy.',
      'The wagons are rolling once more; the stalls fill and the prices ease back toward reason.',
      'The shortage has broken — the caravans are through and the market breathes again.',
      'Plenty returns to the market roads, and the guilds breathe easy at last.',
      'The wharves are busy from dawn, and the weigh-house scales sing under honest weight once more.',
      "Bread is cheap at the stalls again, and the baker's queue is a place for gossip, not fear.",
      'The reopened road brings the wagons flooding back, and the storehouses fill as fast as they emptied.',
      'Salt and iron are common at the market again, and the housewife tucks her hoarded coin away.',
    ]),
    fade: Object.freeze([
      'The feared shortage never came; the wagons rolled in as they should and the worry was for nothing.',
      'The market held after all — the trouble passed the town by, and the stalls stayed full.',
      "The caravan-masters' fears proved idle; the goods arrived as ever and the prices never stirred.",
      'Whatever threatened the trade roads came to naught; the ledgers close as black as before.',
      'The closed road opened before the larders ran low, and the lean season the guilds dreaded never dawned.',
      'The wharves stayed busy through it all, and the talk of shortage came to nothing but talk.',
      'Barley and salt never did grow dear, and the careful who hoarded them feel a little foolish now.',
      'The threatened want passed the market by entirely, and the weigh-house clerks unknit their brows.',
    ]),
  }),
  // M11a pestilence — a traveling plague, the sim's most dramatic emergent beat.
  pestilence: Object.freeze({
    onset: Object.freeze([
      'A sickness walks the upriver roads, and the wise are already barring their doors against it.',
      'Word comes of plague in the near country; the healers ready their stores and the gates grow watchful.',
      'A pestilence is abroad and drawing nearer, and the market thins as folk shut themselves away.',
      'They speak of fever on the trade roads, and every stranger is met now with a wary eye.',
      'The healers lay in what herbs they can, for the tales from downriver grow worse with every wagon.',
      'A hush falls over the gates as word spreads of the sickness upcountry, and the watch turns travellers back.',
      'The physic-women boil their bitter draughts against a fever that has not yet crossed the ford.',
    ]),
    impact: Object.freeze([
      'The plague has come; the sick lie in their homes and the bells toll for the dead.',
      'Fever burns through the streets in earnest, and the healers labor day and night against it.',
      'The sickness has taken hold, and quarantine falls over the quarter like a shroud.',
      'Pestilence walks openly now; the pyres are lit and the living tend the dying as best they can.',
      'The sick-houses are full to the doors, and the healers have long since run short of herbs and sleep alike.',
      'A red cross is chalked on door after door, and the streets that carried the market now carry the biers.',
      'The fever spares neither the guildmaster nor the beggar, and the gravediggers cannot keep the pace.',
      'The whole quarter is shut behind its own gates, and the only sound abroad is the tolling of the bell.',
    ]),
    relief: Object.freeze([
      'The fever has broken at last; the sick begin to mend and the bells ring for the living.',
      'The plague has spent itself, and the healers who held the line are counted among the saved.',
      'The sickness recedes; the quarantine lifts, and the survivors step blinking into the open air.',
      'The worst has passed, the dying has stopped, and the town begins to bury its grief.',
      'The red crosses are washed from the doors, and the healers sleep at last after their long vigil.',
      'The sick-houses empty by degrees, and the market cautiously reopens its long-shuttered stalls.',
      'The pyres burn out cold, and the survivors count their losses and give thanks for their spared.',
      'The gates swing wide again, and the physic-women pack away their bitter draughts with weary hands.',
    ]),
    fade: Object.freeze([
      'The dreaded sickness never reached the walls; the healers stand down and the doors are unbarred.',
      'The plague turned aside on the roads, and the fever that was feared never came.',
      'The pestilence passed the town by; the watchful gates ease open and the market fills again.',
      'The sickness burned itself out upcountry, and the physic-women set aside the herbs they never needed.',
      'Whatever walked the downriver roads never crossed the ford, and the barred doors are opened one by one.',
      'The feared contagion spared the country entirely, and the watch stands down from the gates unbloodied.',
      'The tales of fever came to nothing here, and the sick-houses that were readied stand empty and swept.',
    ]),
  }),
  // M11b calamity — a great disaster, the land's own reckoning come due. BUCKET-
  // NEUTRAL (W-UPSWING stage 0): the mechanism is type-blind, so the voice never
  // asserts a disaster KIND — a quake must never draw "the waters have gone down".
  // The flavor (flood/fire/quake) is the DM's slot, surfaced only as a suggestion.
  calamity: Object.freeze({
    onset: Object.freeze([
      'The old signs are read and the elders mutter; some great reckoning feels close at hand.',
      'An ill omen sits over the country, and those who remember the last one lay in what they can.',
      'The land itself seems to hold its breath, as though some great misfortune waits just over the horizon.',
      'The oldest folk grow quiet and watchful, and speak of a wrongness in the season they cannot name.',
      'The birds have gone strange and the cattle restless, and the wise lay by stores against a nameless dread.',
      'A weight settles over the country that no one can account for, and the elders eye the horizon uneasily.',
      'The almanacs are consulted and the granaries checked, for something in the air promises hard days.',
      'A hush lies on the land that has nothing to do with the season, and the careful make ready for the worst.',
    ]),
    impact: Object.freeze([
      'Ruin has come to the country; what stood at dawn lies broken by dusk, and the survivors dig through the wreck.',
      'A great disaster has struck, with halls thrown down, families scattered, and the roads choked with those who fled it.',
      'The calamity is upon them in full; the bells are drowned out, and the count of the lost has scarcely begun.',
      'What the elders feared has come to pass, and the land is remade in an hour with nothing quite where it stood.',
      'Disaster has fallen without mercy; the granaries are lost, the roofs are down, and the survivors huddle in the open.',
      'The reckoning has come at last, and the country that stood for generations is undone between one dawn and the next.',
      'Whatever the omens warned of has broken over the land, and the almoners open the stores to a ruin no store can meet.',
      'The worst that was dreaded has arrived, and the survivors wander the wreck of all they built, too stunned to weep.',
    ]),
    relief: Object.freeze([
      'The worst has passed and the wreck is cleared; the rebuilding begins, stone laid on weary stone.',
      'The disaster has run its course, and the survivors turn from mourning to the long work of raising it all again.',
      'The worst is behind them now; the ruin is cleared by degrees, and green things push up through the rubble.',
      'The country steadies at last, and the ring of hammer on stone replaces the silence of the aftermath.',
      'The stricken land finds its feet again; the roofs go back up, and the granaries are slowly refilled.',
      'Order returns by inches to the broken country, and neighbour helps neighbour to raise what fell.',
      'The long clearing of the wreck is done, and the survivors begin, wearily, to call the place home again.',
      'The reckoning is spent, and out of the rubble the country begins the patient business of becoming whole.',
    ]),
    fade: Object.freeze([
      'The dread signs came to nothing; the reckoning held off and the country was spared.',
      'The omen passed without its disaster, and the stores laid by against it are quietly put away.',
      'The calamity that was feared never fell; the land kept its shape, and the watchers stand down at last.',
      'The nameless dread lifted as quietly as it came, and the country lets out a long-held breath.',
      'Whatever the elders read in the old signs did not come to pass, and the granaries stay full and unbroached.',
      'The horizon kept its promise of ruin unfulfilled, and the wise who prepared feel foolish and glad at once.',
      'The weight over the country lifted overnight, and the cattle graze easy where dread lately walked.',
      'The great misfortune that seemed so near passed the land by, and the almanacs are closed with relief.',
    ]),
  }),
  // Migration — a great moving of peoples, drawn in and out of the country.
  migration: Object.freeze({
    onset: Object.freeze([
      'The roads to the country are thick with strangers, and word runs that many more are coming behind them.',
      'A great moving of people is underway somewhere near, and the country readies for the flood of them.',
      'Folk are on the march from the troubled lands, and the country wonders whether to open its gates or bar them.',
      'Dust rises on the far roads where a whole people is on the move, and the gate-wards double their watch.',
      'Word comes of villages emptied upcountry, their folk streaming this way with carts and children and little else.',
      'The country braces for a tide of newcomers, and the council argues welcome against wariness late into the night.',
      'Strangers appear at the gates in ones and twos, the first drops of a flood the roads promise to bring.',
      'A hard season somewhere else has set a whole people walking, and their road runs straight toward the country.',
    ]),
    impact: Object.freeze([
      'The newcomers have arrived in their hundreds; the markets swell, the rents climb, and the old families grumble.',
      'The migration has broken over the country, with every barn full, every well pressed, and the peace strained thin.',
      'The strangers are putting down roots now, and the country must reckon with mouths it did not plan to feed.',
      'The tide of people is upon them; some are welcomed, some resented, and none of it is quiet.',
      'The lanes are crowded with unfamiliar faces, and the price of bread and lodging alike climbs by the week.',
      'The newcomers pitch their tents past the walls, and the country strains at the seams to hold them all.',
      'Fresh hands crowd the fields and fresh mouths crowd the tables, and the old order shifts to make what room it can.',
      'The great moving has washed a whole people up at the gates, and the country learns their names one wary day at a time.',
    ]),
    relief: Object.freeze([
      'The great moving has slowed; the roads empty, and those who stayed are folded, warily, into the country.',
      'The flood of strangers has ebbed at last, and the country eases into the shape it must now keep.',
      'The migration has run its course; the newcomers are neighbours now, for better and for worse.',
      'The last of the carts has come to rest, and the strangers of last season keep this season\'s market stalls.',
      'The tents beyond the walls come down as their folk find roofs, and the country closes quietly around them.',
      'The roads fall silent of travellers, and the newcomers\' children are already indistinguishable at the well.',
      'The great tide has settled into the low country like water finding its level, and the grumbling fades to habit.',
      'The moving is over; the strangers are strangers no longer, and the country is larger and stranger than before.',
    ]),
    fade: Object.freeze([
      'The looked-for flood of people never came; the roads stayed quiet and the barns kept their room.',
      'The great moving turned elsewhere; the country readied for a tide that broke on some other shore.',
      'The expected strangers never arrived, and the gates that were watched so closely swing idle.',
      'The dust on the far roads settled without a soul reaching the walls, and the doubled watch is stood down.',
      'Whatever set the distant villages walking led them another way, and the country\'s braced gates go unbesieged.',
      'The promised multitude dwindled to a handful and then to none, and the extra stores are shared out again.',
      'The tide of newcomers broke elsewhere, and the tents that were readied beyond the walls are never raised.',
      'The great migration passed the country by, and the council\'s long arguments over welcome come to nothing.',
    ]),
  }),
  // Authority — the seat of rule loosening, breaking, and settling anew.
  authority: Object.freeze({
    onset: Object.freeze([
      'The grip of those in power is loosening, and the bolder tongues are heard where once they whispered.',
      'A restlessness moves through the halls of rule; the loyal grow uneasy and the ambitious grow bold.',
      'Word runs that the ones who govern are not as sure of their seat as they were, and the country takes note.',
      'The reeve\'s writs are read more slowly now, and the great houses weigh which way the wind is turning.',
      'Old loyalties fray in the halls of rule, and every ambitious cousin polishes his claim in the shadows.',
      'The seat of power sits a little less easy, and factions that slept are stirring behind closed doors.',
      'Whispers of who might rule next run through the guildhalls, and the wise keep their opinions behind their teeth.',
      'The ruling hand trembles where it once held firm, and the bold begin to test how far they may reach.',
    ]),
    impact: Object.freeze([
      'The rule has cracked open, with factions in the streets, rival banners at the gates, and no clear hand on the reins.',
      'Authority has broken in earnest; the old order is thrown down and the country waits to see who will stand atop the wreck.',
      'The struggle for power is out in the open now, and honest folk keep to their homes until it is decided.',
      'The seat of rule is contested by force; the writs go unheeded and every quarter answers to a different master.',
      'Rival claimants raise their banners in the same square, and the guard splits three ways as the halls of rule burn.',
      'The old order is overturned in a night, and by morning no one is sure whose writ the gate-wards will obey.',
      'Power lies in the street for the taking, and the ambitious fall on it like dogs while the country holds its breath.',
      'The contest for rule spills past the council chamber into the lanes, and every household bars its door against it.',
    ]),
    relief: Object.freeze([
      'A firm hand has closed over the country again; the factions are quieted and the writs once more run true.',
      'Order is restored to the halls of rule; whoever holds the seat now holds it plainly, and the streets grow calm.',
      'The contest for power has settled, and the country breathes easier under a rule that no longer trembles.',
      'The rival banners are furled, one seat is filled, and the reeve\'s writs are read at their proper speed again.',
      'A new hand steadies the halls of rule, and the guild that split three ways closes ranks behind it.',
      'The struggle is decided at last; the gate-wards know whose writ to obey, and the lanes lose their fearful hush.',
      'Whoever won has won, and the country settles gratefully into the plain fact of being ruled once more.',
      'The seat of power sits steady again, and the ambitious who reached too far learn the quiet virtue of patience.',
    ]),
    fade: Object.freeze([
      'The threatened upheaval came to nothing; the ones in power kept their seat and the restless tongues fell quiet.',
      'The challenge to the rule dissolved before it struck, and the halls of power stand as they stood.',
      'The feared reckoning in the halls of rule passed off in muttering alone, and nothing was overturned.',
      'The ambitious cousins thought better of their claims, and the reeve\'s writs run as true as they ever did.',
      'The whispered contest for power never left the shadows, and the ruling hand holds firm after all.',
      'The factions that stirred behind closed doors settled back to sleep, and the seat of rule is unshaken.',
      'The bold who tested the ruling hand found it firmer than they hoped, and slink back to their old loyalties.',
      'The looked-for overturning of the order never came, and the halls of rule keep their unhurried peace.',
    ]),
  }),
  // Prosperity — the W-UPSWING abundance drama class (boom_flourishing): a boom,
  // a flourishing, a town rebuilt. THE ABUNDANCE VOICE (content-immersion-r2-1): the
  // registered upswing class deserves a crier of its own, not the market-shortage
  // line its trade_route channel would otherwise borrow. (Its shadow, bust, routes to
  // 'trade' — a market COLLAPSE genuinely reads as trade-hardship; see newsVoiceCategory.)
  prosperity: Object.freeze({
    onset: Object.freeze([
      'The market roads run thick with laden wagons, and the guilds speak of fat years coming.',
      'A rising tide of trade lifts every stall; coin flows freer than it has in a long age.',
      'Word runs of plenty on the way — the barns fill early and the merchants wear easy smiles.',
      'Good fortune gathers over the country, and the careful lay by against the day it turns.',
      'The harbours crowd with hulls and the sawmills run past dusk, and everyone can smell the coming good years.',
      'The first fat harvest in a lifetime is coming in, and the granary-keepers hardly know where to put it all.',
      'The wharves are stacked to the eaves with goods, and the guildhalls hum with talk of a rising market.',
      'A warmth of good fortune settles over the trade roads, and even the beggars at the gate eat better this season.',
    ]),
    impact: Object.freeze([
      'The boom has come in earnest — the markets swell, the coin runs bright, and every craft finds a buyer.',
      'Plenty is upon the country in full; the granaries groan, the roads are gold with commerce, and the poorest table is not bare.',
      'A golden season has broken over the town — the halls are warm, the temples kept, and no craftsman wants for work.',
      'The good years have arrived; wealth pools along the market roads, and the whole country seems to stand a little taller.',
      'The harbours cannot hold the hulls that crowd them, and the sawmills and forges run day and night to keep the pace.',
      'Every stall turns a profit and every barn is full, and the guilds coin new members faster than they can name them.',
      'The fat years are here in their fullness; the market square glitters, and even lean households know a little comfort.',
      'Trade floods the country like a spring river, and there is honest work and warm bread for every hand that wants it.',
    ]),
    relief: Object.freeze([
      'The boom has eased to a steady plenty; the wild coin settles, and the country keeps the wealth it won.',
      'The golden rush cools to a comfortable warmth — the markets calm, and the good fortune sinks quiet roots.',
      'The fat years mellow into a long ease; the ledgers close black, and prosperity becomes an ordinary thing.',
      'The wild trade steadies into a dependable stream, and the country learns to wear its new wealth lightly.',
      'The harbours find their even rhythm again, and the plenty that flooded in becomes a comfortable, lasting tide.',
      'The rush of coin slows to a warm and steady flow, and the granaries stay full without the frantic bustle.',
      'The boom softens into good sense; the guilds bank their gains, and the market roads keep their easy prosperity.',
      'The golden season settles into a long mild summer of trade, and the country counts itself quietly fortunate.',
    ]),
    fade: Object.freeze([
      'The promised plenty never quite arrived; the barns filled no fuller than most years, and the fat years stayed a rumour.',
      'The looked-for boom came to little — the market roads stayed as they were, and the easy fortune passed the country by.',
      'The golden season that was foretold guttered out; the coin ran no brighter, and the merchants pack away their hopes.',
      'The harbours never did crowd, and the fat years the guilds toasted stayed a toast and nothing more.',
      'The rising tide the merchants promised each other rose no higher than the usual mark, and the sawmills keep their old hours.',
      'Plenty that seemed so near thinned to an ordinary season, and the granary-keepers find room for the harvest after all.',
      'The boom that everyone smelled coming never broke, and the market roads run just as full and just as thin as ever.',
      'The good years the country counted on stayed just over the horizon, and the careful who saved feel wiser than the rest.',
    ]),
  }),
  // Succor — mercy in grain, one town's granary opened for another's hunger.
  succor: Object.freeze({
    onset: Object.freeze([
      'Word runs that the granaries of the fortunate are being asked to open — a neighbour goes hungry, and the plea has reached our gates.',
      'A cry for relief comes up the road from a hungrier country, and the almoners are already counting what can be spared.',
      'The council is put to a hard question: how much mercy can the town afford before its own larder runs thin?',
      'A neighbour\'s harvest has failed, and their messengers stand at the gate asking grain of a country with barely enough.',
      'The plea from the starving country arrives with the first frost, and the almoners weigh charity against a hard winter of their own.',
      'Word of famine in the near lands reaches the market, and the fortunate are asked to measure out their surplus.',
      'A hungry country sends its messengers hat in hand up the road, and the granary-keepers count their sacks with troubled faces.',
      'The bells of a stricken neighbour ring for aid across the marches, and the council must decide how deep to reach.',
    ]),
    impact: Object.freeze([
      'The grain-wagons are rolling to the stricken country — the mercy was weighed, and found affordable.',
      'Relief goes out from our stores to a neighbour in want, and the debt of it is quietly written down.',
      'The granaries have opened for the hungry beyond the walls; the wagons run heavy with charity and calculation both.',
      'Aid is on the road to the famined country, sent with one hand while the other keeps its careful accounts.',
      'The tithe-barn is unlocked for a hungry neighbour, and the laden wagons creak out through the gate at dawn.',
      'Sack after sack of grain goes to the stricken country, mercy and ledger travelling in the same cart.',
      'The almoners send what the harvest allows to the starving marches, and mark the giving down against a future favour.',
      'Relief rolls out from the granaries to the hungry country, and the givers watch it go with pride and calculation both.',
    ]),
    relief: Object.freeze([
      'The sent grain has done its work — the hungry country steadies, and remembers well who fed it.',
      'The relief held; a neighbour is pulled back from the brink, and a bond is deepened by the giving.',
      'The wagons came in time, and a friend saved from famine is a friend for many a long season.',
      'The stricken country finds its feet on borrowed grain, and the debt of mercy binds the two the tighter.',
      'The famine breaks on the strength of the sent stores, and gratitude takes root where hunger lately grew.',
      'The neighbour that starved now stands, and the giving is remembered at every market and every gate.',
      'The relief did its quiet work; a country pulled from famine keeps a long and grateful memory of the hand that fed it.',
      'The hunger is past in the near lands, and the mercy sent up the road ripens into a friendship worth more than grain.',
    ]),
    fade: Object.freeze([
      'The granaries stayed shut against the asking; the hungry country turns away, and the slight is not soon forgotten.',
      'The plea for relief went unanswered, and a grudge takes root where grain did not.',
      'No wagons rolled — the mercy was weighed and refused, and the road home is long for the empty-handed.',
      'The tithe-barn stayed locked while a neighbour starved, and the memory of the closed gate will outlast the famine.',
      'The council counted the cost and kept its stores, and the hungry country marks the refusal down in a colder ledger.',
      'The messengers of the starving marches go home with empty carts, and a bitterness settles where friendship might have.',
      'The asked-for grain never left the granaries, and a neighbour learns the hard limit of what mercy the country will spare.',
      'Relief was pleaded and relief was denied, and the road between the two countries grows longer for the denying.',
    ]),
  }),
  // Reframe — D7 THE REFRAME LAYER (reframeKernel.js): facts frozen, meaning
  // DERIVED. As relationships change, a country re-READS old deeds — a gift of
  // grain in the lean years curdles into a debt (the DARK lane), or an old
  // enemy's hard bargain thaws into unlooked-for kindness (the BRIGHT lane).
  // The crier speaks of the changing MEMORY of past favours, never a new event.
  // Settlement-AGNOSTIC and sign-spanning (both dark souring and bright thaw
  // appear across each bucket). THE 8TH DRAMA CLASS (decisionTier.js `reframe`).
  // FORWARD-LOOKING ROUTING (CONTENT-VT JUDGMENT — see newsVoiceCategory): the
  // reframe kernel writes readings into spatialLedgers.reframes and mints NO
  // wizardNews entry today (advanceReframes returns newsEntries:[]), so this
  // voice is DORMANT until a future wave surfaces a reframe beat in the feed; it
  // is reserved on impactKind 'reframe' so that beat inherits a crier the day it
  // ships, closing the survey's named "reframe routes nowhere" gap.
  reframe: Object.freeze({
    onset: Object.freeze([
      'The old kindnesses are spoken of differently at the well these days, and the meaning of past favours begins to shift.',
      'A doubt creeps into the country\'s memory: was the grain sent in the hungry years a gift, or the first link of a chain?',
      'The elders begin to reread the long peace, and wonder aloud whether an old friend\'s help was ever freely given.',
      'Something sours in how the country recalls its benefactors, and yesterday\'s mercy takes on the look of a debt.',
      'Warmth creeps back into an old grudge, and folk start to wonder whether an enemy\'s hard bargain was kindness in disguise.',
      'The tale of who owes whom is being retold in the market, and the ledger of old favours no longer reads as it did.',
      'A quiet reappraisal moves through the country, and deeds long settled in memory begin to change their colour.',
      'The meaning of an old alliance wavers; what was gratitude cools toward suspicion, or what was spite thaws toward thanks.',
    ]),
    impact: Object.freeze([
      'The country has made up its mind: the grain of the lean years is called a debt now, not a gift, and the giver a creditor.',
      'What was long remembered as protection is spoken of plainly as occupation, and the old gratitude curdles to resentment.',
      'An old enemy is quietly recast as a benefactor, and a bargain once cursed is now blessed as unlooked-for kindness.',
      'The debt is forgiven in the country\'s heart at last; what was carried as an obligation is set down as a plain gift freely given.',
      'Kinship is reread as leverage, and the bonds that bound two houses in love are now weighed as a hold and a hostage.',
      'The shared candor of old is called espionage now, and every past confidence is turned over for the knife it might have hidden.',
      'Commerce that seemed a partnership is renamed a snare, and the country decides it was made dependent by design.',
      'The brokered peace of years past is spoken of as manipulation, and the goodwill that made it is remembered as a trap.',
    ]),
    relief: Object.freeze([
      'The reappraisal has run its course; old friends make their peace with the past, and the ledger of favours is squared at last.',
      'The souring memory sweetens again, and the country lets an old grievance settle back into simple gratitude.',
      'The reckoning of past kindnesses is set to rest, and neighbours agree, wearily, to remember it kindly.',
      'The debt that was resented is quietly forgiven, and two countries lay down the old accounting for good.',
      'The bitter reading loses its hold; what curdled into grievance mellows, and the past is allowed to mean well again.',
      'The country reconciles with its own memory, and the deeds it lately cursed it now recalls without the old sting.',
      'The grudge is set down where it lay so long, and an old friendship is remembered as friendship once more.',
      'The long re-reading of the past comes to a gentle end, and the meaning of old favours settles, warm, into place.',
    ]),
    fade: Object.freeze([
      'The souring of old memories never took; the country recalls its benefactors as it always did, gratitude intact.',
      'The doubt about the grain years came to nothing, and a gift long called a gift is a gift still.',
      'The reappraisal guttered out before it caught, and the ledger of old favours reads exactly as it always has.',
      'The warmth that crept toward an old enemy cooled again, and the grudge is remembered as plainly as ever.',
      'Whatever began to reread the long peace thought better of it, and the past keeps the meaning it was given.',
      'The whispered recasting of an old alliance faded unspoken, and the country\'s memory holds its familiar shape.',
      'The old bargain is neither cursed anew nor blessed at last; the country simply lets it lie as it always lay.',
      'The shifting of old meanings settled back to stillness, and yesterday\'s deeds keep yesterday\'s names.',
    ]),
  }),
});

/**
 * PER-CATEGORY FLOOR — generic lines used only if a (category × bucket) cell is
 * ever missing (guarantees totality for future buckets). >=2 lines each.
 * @type {Readonly<Record<VoiceCategory, ReadonlyArray<string>>>}
 */
export const VOICE_FLOOR = Object.freeze({
  war: Object.freeze([
    'Word of the war moves along the front, and the town listens for the drums.',
    'The matter of arms stands unsettled, and every ear is turned toward the marches.',
    'News of the fighting passes hand to hand, and the watch keeps a wary eye on the road.',
  ]),
  faith: Object.freeze([
    'Word of the faith moves among the temples, and the people turn to hear it.',
    'The matter of devotion stirs the congregation, and the priests weigh what it means.',
    'News from the altars passes pew to pew, and the faithful mark it well.',
  ]),
  trade: Object.freeze([
    'Word of the trade moves along the market roads, and the guilds take note.',
    'The matter of goods and coin stirs the merchants, and the caravan-masters listen close.',
    'News of the markets passes stall to stall, and the town reckons its stores.',
  ]),
  pestilence: Object.freeze([
    'Word of the sickness moves along the roads, and the healers keep their anxious watch.',
    'The matter of the plague hangs over the country, and every household marks it well.',
  ]),
  calamity: Object.freeze([
    'Word of the disaster passes from mouth to mouth, and the country reckons what it has lost.',
    'The matter of the calamity weighs on every hearth, and the elders are asked what it means.',
  ]),
  migration: Object.freeze([
    'Word of the moving of peoples runs along the roads, and the country counts the strangers at its gates.',
    'The matter of the newcomers stirs every quarter, and the elders weigh what welcome to give.',
  ]),
  authority: Object.freeze([
    'Word of the struggle for power moves through the country, and every faction listens for its moment.',
    'The matter of who rules unsettles the halls, and the country watches the seat of power closely.',
  ]),
  succor: Object.freeze([
    'Word of the grain sent to a hungry neighbour moves along the roads, and the town reckons the cost of its mercy.',
    'The matter of relief given and relief refused passes hand to hand, and every larder is counted anew.',
  ]),
  prosperity: Object.freeze([
    "Word of the country's good fortune moves along the market roads, and the guilds reckon their gains.",
    'The matter of the fat years stirs every hearth, and the careful weigh how long the plenty will hold.',
  ]),
  reframe: Object.freeze([
    'Word of the changing memory of old deeds moves through the country, and neighbours reckon the debts of the past anew.',
    'The matter of who owes whom and who was wronged stirs every hearth, and the ledger of old favours is weighed again.',
    'News that the past is being read afresh passes hand to hand, and the country wonders what its old friendships truly meant.',
  ]),
});

/**
 * Categorize a wizardNews entry into the crier's beat. impactKind-PRIMARY;
 * channelType is the fallback. impactKind (the impact's nature) classifies
 * first across all beats (faith → pestilence → calamity → authority →
 * migration → succor → prosperity → reframe → war → trade); only when impactKind
 * did not classify does channelType decide (bare/persisted entries).
 * Deterministic and total.
 *
 * CRITICAL (content-immersion-2): plague_arrival and calamity entries carry a
 * TRADE channelType ('trade_route'/'disaster') for their regional plumbing — so
 * their impactKind MUST classify ahead of the channel fallback, or a plague
 * arrival gets a market-shortage crier line beneath a "Plague reaches X" headline.
 *
 * Out-of-scope entries (crime, information, service, seasonal, …) return null
 * and the panel renders no voice line.
 * @param {{ impactKind?: string|null, channelType?: string|null }|null|undefined} entry
 * @returns {VoiceCategory|null}
 */
export function newsVoiceCategory(entry) {
  if (!entry) return null;
  const impactKind = entry.impactKind || '';
  const channelType = entry.channelType || '';
  // impactKind is the impact's NATURE — it classifies first, across all beats.
  if (impactKind === 'religious_pressure') return 'faith';
  if (impactKind === 'plague_arrival') return 'pestilence';
  if (impactKind === 'calamity') return 'calamity';
  if (impactKind === 'authority_instability') return 'authority';
  if (impactKind === 'migration_pressure') return 'migration';
  // Generosity's GIVE receipt (impactKind-primary, ahead of its 'trade_route' channelType
  // fallback — otherwise a relief headline gets a market-shortage line, the F3a mis-route
  // the doc comment above warns of). A REFUSAL (impactKind 'generosity_refusal', kind
  // 'applied' ⇒ the 'impact' bucket) is left UNCLASSIFIED on purpose: routing it to succor
  // would voice "aid flows" beneath a "turned away" headline; the grudge has its own surface.
  if (impactKind === 'generosity_relief') return 'succor';
  // W-UPSWING abundance drama class (content-immersion-r2-1). boom/flourishing/
  // reconstruction are PROSPERITY (impactKind-primary, ahead of boom's 'trade_route'
  // channel — else the boom borrows a market-shortage line). bust is the shadow: a
  // market COLLAPSE reads as trade-hardship, so it classifies to 'trade' EXPLICITLY
  // (JUDGMENT, vetoable) rather than borrow the channel fallback the guard removes.
  if (impactKind === 'boom' || impactKind === 'flourishing' || impactKind === 'reconstruction') return 'prosperity';
  if (impactKind === 'bust') return 'trade';
  // Reframe — the 8th drama class (decisionTier.js `reframe`), the survey's named
  // "routes nowhere" gap. RESERVED + FORWARD-LOOKING (CONTENT-VT JUDGMENT, vetoable):
  // the reframe kernel writes readings into spatialLedgers.reframes and mints NO
  // wizardNews entry today (advanceReframes → newsEntries:[]), and NO minted impactKind
  // corresponds to it (belief_misjudgment is the epistemics/facts layer, moral_reckoning
  // is moral drift — routing either here would mis-voice its headline, exactly what the
  // set-but-unclassified guard prevents). So this classifier binds no live beat now; it
  // reserves impactKind 'reframe' so that a reinterpretation beat inherits the reframe
  // crier the day a future wave surfaces one in the feed. Kept ABOVE the guard because it
  // is a real (if dormant) category, not a fall-through. This token is NOT in the walker's
  // EXPECTED_VOICE manifest because that manifest binds only MINTED impactKinds.
  if (impactKind === 'reframe') return 'reframe';
  if (WAR_IMPACT_KINDS.has(impactKind)) return 'war';
  if (TRADE_IMPACT_KINDS.has(impactKind)) return 'trade';
  // ── set-but-unclassified guard (content-immersion-r2-1) ─────────────────────
  // A NON-EMPTY impactKind that matched none of the classifiers above gets NO voice
  // — never the channelType fallback below. Without this, any new wave's impactKind
  // (boom, intervention_clash, …) that happens to ride a war/trade channel borrows
  // that channel's crier line beneath a headline it does not fit. Only BARE entries
  // (no impactKind — persisted/legacy records) fall through to channelType.
  if (impactKind) return null;
  // channelType is the fallback ONLY for bare entries (impactKind absent).
  if (WAR_CHANNEL_TYPES.has(channelType)) return 'war';
  if (TRADE_CHANNEL_TYPES.has(channelType)) return 'trade';
  if (channelType === 'political_authority') return 'authority';
  if (channelType === 'disaster') return 'calamity';
  if (channelType === 'migration_pressure') return 'migration';
  return null;
}

/**
 * Map an entry's transition (entry.kind) to its voice bucket. Total: any
 * unknown/missing transition falls back to 'onset'.
 * @param {string|null|undefined} kind
 * @returns {VoiceBucket}
 */
function bucketFor(kind) {
  switch (kind) {
    case 'queued':
    case 'ready':
      return 'onset';
    case 'applied':
      return 'impact';
    case 'resolved':
      return 'relief';
    case 'ignored':
    case 'expired':
      return 'fade';
    default:
      return 'onset';
  }
}

/**
 * THE READ-MODEL — resolve one wizardNews entry to a single speakable crier's
 * line, or null when the entry is out of scope. Deterministic: same entry ⇒
 * same line, always. Distinct entry ids in the same cell generally reach
 * distinct variants (anti-repetition via the FNV seed).
 * @param {{ id?: string|number|null, kind?: string|null, impactKind?: string|null, channelType?: string|null }|null|undefined} entry
 * @returns {string|null}
 */
export function newsVoiceLine(entry) {
  if (!entry) return null;
  const cat = newsVoiceCategory(entry);
  if (cat === null) return null;
  const bucket = bucketFor(entry.kind);
  // Fall through to the category floor on a missing OR empty cell — an empty
  // array is truthy and would yield variants[NaN] === undefined.
  const cell = VOICE_LINES[cat][bucket];
  const variants = (cell && cell.length) ? cell : VOICE_FLOOR[cat];
  const seed = String(entry.id ?? '');
  const h = fnv1a32(`${seed}::${cat}:${bucket}`);
  return variants[h % variants.length];
}
