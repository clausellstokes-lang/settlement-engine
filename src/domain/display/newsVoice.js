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

/** @typedef {'war'|'faith'|'trade'|'pestilence'|'calamity'|'migration'|'authority'|'succor'|'prosperity'} VoiceCategory */
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
 * THE CONTENT MAP — VOICE_LINES[category][bucket] is a frozen array of >=3
 * distinct, speakable herald lines. Every (war|faith|trade) × (onset|impact|
 * relief|fade) = 12 cells is authored; VOICE_FLOOR (below) guarantees totality
 * for any future bucket. Each line is self-contained, settlement-agnostic,
 * ends in terminal punctuation, and carries no template tokens.
 * @type {Readonly<Record<VoiceCategory, Readonly<Record<VoiceBucket, ReadonlyArray<string>>>>>}
 */
export const VOICE_LINES = Object.freeze({
  war: Object.freeze({
    onset: Object.freeze([
      'Steel is drawn along the marches — the muster horns have not stopped since dawn.',
      'Hear it and mark it: a war is gathering at the borders, and the levy is called to the walls.',
      'The watchfires are doubled and the roads run thick with soldiers; the town braces for what is coming.',
      'Grievance has hardened into muster, and the drums along the front will not be quieted.',
    ]),
    impact: Object.freeze([
      'The blow has fallen; smoke stands where the watchfires were.',
      'War has come in earnest — the fighting is upon the front, and the wounded are already carried back.',
      'The clash is joined, and the town counts its dead before it counts the cost.',
      'Steel has met steel at the front; what was feared is now simply true.',
    ]),
    relief: Object.freeze([
      'The banners are furled and the wounded carried home — this front, at least, goes quiet.',
      'The fighting has ebbed; the drums are silent and the muster horns hung up at last.',
      'Peace of a kind holds along the marches, and the levy may sleep in its own beds tonight.',
      'The war has spent itself here — the roads are safe again, and the widows begin their mourning.',
    ]),
    fade: Object.freeze([
      'The threatened war never came to the sword; the levy stands down, grumbling.',
      'The muster is dismissed — the threatened war never marched, and the horns fall quiet unblooded.',
      'Whatever gathered at the borders has thought better of it; the walls are unmanned and the drums put away.',
      'The alarm came to nothing — no steel was drawn, and the town returns to its plows.',
    ]),
  }),
  faith: Object.freeze({
    onset: Object.freeze([
      'The temples stir — a fervor is rising that the priests did not summon and cannot yet name.',
      'Hear the bells rung out of hour: something moves among the faithful, and the pews will not stay empty.',
      'A holy wind is gathering; the pilgrims are on the roads and the prayers grow loud.',
      'The altars are crowded and the incense thick — a great devotion is coming over the people.',
    ]),
    impact: Object.freeze([
      'The fervor has taken the town; every knee is bent and every voice raised to one name.',
      'The faith has broken over the people like a wave — the temples overflow and the doubters have gone silent.',
      'What stirred in the temples now rules the streets; the devout carry their conviction like a torch.',
      'The revival is upon us in full — the priests scarcely lead it, so hard does it pull.',
    ]),
    relief: Object.freeze([
      'The pilgrims disperse; whatever moved the faithful has, for now, moved on.',
      'The fervor has cooled to embers, and the temples keep their ordinary hours once more.',
      'The great devotion has passed its peak; the roads empty and the bells ring on their proper hours.',
      'Calm returns to the altars — the people have prayed their fill and gone back to their labors.',
    ]),
    fade: Object.freeze([
      'The kindling of faith never caught; the pilgrims turned for home and the pews stand empty again.',
      'The stir at the temples came to little — a season of talk, and the devout no more numerous than before.',
      'Whatever the priests feared or hoped for has guttered out; the altars are as quiet as ever.',
      'The looked-for revival did not come; the incense is packed away and the bells keep their old silence.',
    ]),
  }),
  trade: Object.freeze({
    onset: Object.freeze([
      'The caravan-masters trade worried looks — a shortage is riding in ahead of the wagons.',
      'Mark the market roads: a want is coming, and the wise are laying in stores while they can.',
      'The convoys run thin and the guilds mutter; hard bargaining is on the way.',
      'Word runs ahead of the wagons that the goods will not come as they should — best fill the larder now.',
    ]),
    impact: Object.freeze([
      'The market has felt it: shelves thin, prices climb, and the guilds count what is left.',
      'The shortage has bitten — the stalls stand half-empty and every coin buys less than it did.',
      'The want is upon the market roads in full; the merchants ration and the poor go without.',
      'Trade has faltered and the town feels the pinch, from the guildhall down to the humblest cart.',
    ]),
    relief: Object.freeze([
      'The roads run sweet again — the missing goods came in on the last convoy.',
      'The wagons are rolling once more; the stalls fill and the prices ease back toward reason.',
      'The shortage has broken — the caravans are through and the market breathes again.',
      'Plenty returns to the market roads, and the guilds breathe easy at last.',
    ]),
    fade: Object.freeze([
      'The feared shortage never came; the wagons rolled in as they should and the worry was for nothing.',
      'The market held after all — the trouble passed the town by, and the stalls stayed full.',
      "The caravan-masters' fears proved idle; the goods arrived as ever and the prices never stirred.",
      'Whatever threatened the trade roads came to naught; the ledgers close as black as before.',
    ]),
  }),
  // M11a pestilence — a traveling plague, the sim's most dramatic emergent beat.
  pestilence: Object.freeze({
    onset: Object.freeze([
      'A sickness walks the upriver roads, and the wise are already barring their doors against it.',
      'Word comes of plague in the near country; the healers ready their stores and the gates grow watchful.',
      'A pestilence is abroad and drawing nearer, and the market thins as folk shut themselves away.',
      'They speak of fever on the trade roads, and every stranger is met now with a wary eye.',
    ]),
    impact: Object.freeze([
      'The plague has come; the sick lie in their homes and the bells toll for the dead.',
      'Fever burns through the streets in earnest, and the healers labor day and night against it.',
      'The sickness has taken hold, and quarantine falls over the quarter like a shroud.',
      'Pestilence walks openly now; the pyres are lit and the living tend the dying as best they can.',
    ]),
    relief: Object.freeze([
      'The fever has broken at last; the sick begin to mend and the bells ring for the living.',
      'The plague has spent itself, and the healers who held the line are counted among the saved.',
      'The sickness recedes; the quarantine lifts, and the survivors step blinking into the open air.',
      'The worst has passed, the dying has stopped, and the town begins to bury its grief.',
    ]),
    fade: Object.freeze([
      'The dreaded sickness never reached the walls; the healers stand down and the doors are unbarred.',
      'The plague turned aside on the roads, and the fever that was feared never came.',
      'The pestilence passed the town by; the watchful gates ease open and the market fills again.',
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
    ]),
    impact: Object.freeze([
      'Ruin has come to the country; what stood at dawn lies broken by dusk, and the survivors dig through the wreck.',
      'A great disaster has struck, with halls thrown down, families scattered, and the roads choked with those who fled it.',
      'The calamity is upon them in full; the bells are drowned out, and the count of the lost has scarcely begun.',
      'What the elders feared has come to pass, and the land is remade in an hour with nothing quite where it stood.',
    ]),
    relief: Object.freeze([
      'The worst has passed and the wreck is cleared; the rebuilding begins, stone laid on weary stone.',
      'The disaster has run its course, and the survivors turn from mourning to the long work of raising it all again.',
      'The worst is behind them now; the ruin is cleared by degrees, and green things push up through the rubble.',
    ]),
    fade: Object.freeze([
      'The dread signs came to nothing; the reckoning held off and the country was spared.',
      'The omen passed without its disaster, and the stores laid by against it are quietly put away.',
      'The calamity that was feared never fell; the land kept its shape, and the watchers stand down at last.',
    ]),
  }),
  // Migration — a great moving of peoples, drawn in and out of the country.
  migration: Object.freeze({
    onset: Object.freeze([
      'The roads to the country are thick with strangers, and word runs that many more are coming behind them.',
      'A great moving of people is underway somewhere near, and the country readies for the flood of them.',
      'Folk are on the march from the troubled lands, and the country wonders whether to open its gates or bar them.',
    ]),
    impact: Object.freeze([
      'The newcomers have arrived in their hundreds; the markets swell, the rents climb, and the old families grumble.',
      'The migration has broken over the country, with every barn full, every well pressed, and the peace strained thin.',
      'The strangers are putting down roots now, and the country must reckon with mouths it did not plan to feed.',
      'The tide of people is upon them; some are welcomed, some resented, and none of it is quiet.',
    ]),
    relief: Object.freeze([
      'The great moving has slowed; the roads empty, and those who stayed are folded, warily, into the country.',
      'The flood of strangers has ebbed at last, and the country eases into the shape it must now keep.',
      'The migration has run its course; the newcomers are neighbours now, for better and for worse.',
    ]),
    fade: Object.freeze([
      'The looked-for flood of people never came; the roads stayed quiet and the barns kept their room.',
      'The great moving turned elsewhere; the country readied for a tide that broke on some other shore.',
      'The expected strangers never arrived, and the gates that were watched so closely swing idle.',
    ]),
  }),
  // Authority — the seat of rule loosening, breaking, and settling anew.
  authority: Object.freeze({
    onset: Object.freeze([
      'The grip of those in power is loosening, and the bolder tongues are heard where once they whispered.',
      'A restlessness moves through the halls of rule; the loyal grow uneasy and the ambitious grow bold.',
      'Word runs that the ones who govern are not as sure of their seat as they were, and the country takes note.',
    ]),
    impact: Object.freeze([
      'The rule has cracked open, with factions in the streets, rival banners at the gates, and no clear hand on the reins.',
      'Authority has broken in earnest; the old order is thrown down and the country waits to see who will stand atop the wreck.',
      'The struggle for power is out in the open now, and honest folk keep to their homes until it is decided.',
      'The seat of rule is contested by force; the writs go unheeded and every quarter answers to a different master.',
    ]),
    relief: Object.freeze([
      'A firm hand has closed over the country again; the factions are quieted and the writs once more run true.',
      'Order is restored to the halls of rule; whoever holds the seat now holds it plainly, and the streets grow calm.',
      'The contest for power has settled, and the country breathes easier under a rule that no longer trembles.',
    ]),
    fade: Object.freeze([
      'The threatened upheaval came to nothing; the ones in power kept their seat and the restless tongues fell quiet.',
      'The challenge to the rule dissolved before it struck, and the halls of power stand as they stood.',
      'The feared reckoning in the halls of rule passed off in muttering alone, and nothing was overturned.',
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
    ]),
    impact: Object.freeze([
      'The boom has come in earnest — the markets swell, the coin runs bright, and every craft finds a buyer.',
      'Plenty is upon the country in full; the granaries groan, the roads are gold with commerce, and the poorest table is not bare.',
      'A golden season has broken over the town — the halls are warm, the temples kept, and no craftsman wants for work.',
      'The good years have arrived; wealth pools along the market roads, and the whole country seems to stand a little taller.',
    ]),
    relief: Object.freeze([
      'The boom has eased to a steady plenty; the wild coin settles, and the country keeps the wealth it won.',
      'The golden rush cools to a comfortable warmth — the markets calm, and the good fortune sinks quiet roots.',
      'The fat years mellow into a long ease; the ledgers close black, and prosperity becomes an ordinary thing.',
    ]),
    fade: Object.freeze([
      'The promised plenty never quite arrived; the barns filled no fuller than most years, and the fat years stayed a rumour.',
      'The looked-for boom came to little — the market roads stayed as they were, and the easy fortune passed the country by.',
      'The golden season that was foretold guttered out; the coin ran no brighter, and the merchants pack away their hopes.',
    ]),
  }),
  // Succor — mercy in grain, one town's granary opened for another's hunger.
  succor: Object.freeze({
    onset: Object.freeze([
      'Word runs that the granaries of the fortunate are being asked to open — a neighbour goes hungry, and the plea has reached our gates.',
      'A cry for relief comes up the road from a hungrier country, and the almoners are already counting what can be spared.',
      'The council is put to a hard question: how much mercy can the town afford before its own larder runs thin?',
    ]),
    impact: Object.freeze([
      'The grain-wagons are rolling to the stricken country — the mercy was weighed, and found affordable.',
      'Relief goes out from our stores to a neighbour in want, and the debt of it is quietly written down.',
      'The granaries have opened for the hungry beyond the walls; the wagons run heavy with charity and calculation both.',
      'Aid is on the road to the famined country, sent with one hand while the other keeps its careful accounts.',
    ]),
    relief: Object.freeze([
      'The sent grain has done its work — the hungry country steadies, and remembers well who fed it.',
      'The relief held; a neighbour is pulled back from the brink, and a bond is deepened by the giving.',
      'The wagons came in time, and a friend saved from famine is a friend for many a long season.',
    ]),
    fade: Object.freeze([
      'The granaries stayed shut against the asking; the hungry country turns away, and the slight is not soon forgotten.',
      'The plea for relief went unanswered, and a grudge takes root where grain did not.',
      'No wagons rolled — the mercy was weighed and refused, and the road home is long for the empty-handed.',
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
});

/**
 * Categorize a wizardNews entry into the crier's beat. impactKind-PRIMARY;
 * channelType is the fallback. impactKind (the impact's nature) classifies
 * first across all seven beats (faith → pestilence → calamity → authority →
 * migration → war → trade); only when impactKind did not classify does
 * channelType decide (bare/persisted entries). Deterministic and total.
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
