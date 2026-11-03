// npcData.js — NPC table data extracted from npcGenerator.js
// All constants exported for use by npcGenerator.js

import { pickVariant } from '../kernel/proseHash.js';

export const MANNERISMS = [
  'drums fingers on surfaces when thinking',
  'never makes direct eye contact with inferiors',
  'touches a specific piece of jewellery when stressed',
  'quotes scripture or proverbs in casual conversation',
  'keeps meticulous written records of every meeting',
  'always stands when others sit, or vice versa',
  "laughs loudly at their own jokes, silently at others'",
  'cleans or fidgets with their hands constantly',
  'addresses everyone by full name, never shortened',
  'pauses for exactly three seconds before answering any question',
  'carries food or sweets, offers them as social lubricant',
  "unconsciously mimics the posture of whoever they're speaking to",
  'refuses to sit with their back to a door',
  'hums under their breath when concentrating',
  'keeps a coin or token that they flip when making decisions',
  'never volunteers information, only answers what is asked',
  'speaks of themselves in the third person when angry',
  'checks exits in every new room before speaking',
  'maintains an unnervingly fixed smile during conflict',
  'takes written notes during conversations, even casual ones',
  'taps their foot in a complex rhythm when bored',
  'never eats or drinks anything offered by a stranger without watching others first',
  'uses elaborate, florid greetings regardless of context',
  'deflects personal questions with a counter-question',
  'keeps their hands clasped behind their back when displeased',
  'always arrives fifteen minutes early, and comments when others do not',
  'repeats the last word of a sentence spoken to them before responding',
  'traces patterns on flat surfaces absentmindedly',
  'flinches slightly at raised voices even when calm',
  'makes deliberate, theatrical eye contact to assert dominance',
];

export const SPEECH_PATTERNS = [
  'Speaks in short, clipped sentences: every word intentional',
  'Verbose and elaborate; takes three sentences where one would do',
  'Peppers speech with trade or craft jargon even in unrelated contexts',
  'Speaks softly, forcing others to lean in',
  'Asks rhetorical questions to make points rather than stating them',
  "Uses the formal royal 'we' (old habit from a previous station)",
  'Pauses mid-sentence to choose words with visible care',
  'Deflects personal questions with philosophical tangents',
  'Speaks as if dictating a letter, formal even in crisis',
  'Tells anecdotes that never quite reach the point',
  'Uses understatement and dry humour as a defence mechanism',
  "Defaults to numbers and specifics: 'three days', never 'some days'",
  "Refers to past events as though they're common knowledge",
  'Uses softening phrases that make every statement sound like a question',
  'Swears colourfully but apologises immediately after',
  'Speaks in analogies and metaphors, even when clarity would serve better',
  'Drops to a near-whisper when saying something important',
  "Repeats key words for emphasis: 'The contract. The contract is clear'",
  'Addresses strangers formally and familiars by diminutives',
  'Uses long pauses as punctuation, sits comfortably in silence',
  // CONTENT-GT-FINAL (Charge 3): +10 — the survey's thinnest personality slot (was 20).
  // Single-pick draw site (generateReligionType), draw-count invariant.
  'Never interrupts, waits out even the longest speaker, then answers the first point only',
  "Answers questions with inventories: 'Three reasons. First.'",
  'Trails off mid-sentence when approaching something they regret knowing',
  'Speaks quickly when lying, slowly when bargaining. The local traders know the tell',
  'Quotes their own past pronouncements as though citing law',
  'Talks to everyone in the room except the person the answer is for',
  'Prefaces bad news with elaborate courtesy, good news with none',
  'Wields professional titles with surgical precision. Rank omitted is rank denied',
  "Says 'as you know' before telling people things they do not know",
  'Ends disagreements by restating the other position, slightly wrong',
];

// Personality-trait pools (positive / negative / neutral adjectives). The NPC
// generator draws one dominant trait, one flaw, and one modifier from these.
// (Formerly mis-exported as NPC_RELIGION_DATA — nothing here is about religion.)
export const NPC_PERSONALITY_TRAITS = {
  positive: [
    'honest',
    'brave',
    'compassionate',
    'wise',
    'loyal',
    'generous',
    'patient',
    'humble',
    'diligent',
    'fair-minded',
    'optimistic',
    'charismatic',
    'clever',
    'principled',
    'protective',
    'diplomatic',
    'resourceful',
    'scholarly',
    'pious',
    'merciful',
    'tenacious',
    'methodical',
    'intuitive',
    'perceptive',
    'steadfast',
    'magnanimous',
    'incorruptible',
    'warm-hearted',
    'level-headed',
    'forthright',
    // CONTENT-GT-FINAL (Charge 3): +15. Single-pick draw site (draw-count invariant);
    // no code branches on positive-trait VALUES (corruption checks presence only).
    // LOCKSTEP LAW: domain/npc/npcBank.js NPC_TEMPERAMENTS mirrors this pool EXACTLY
    // (same entries, same order) — append there too; the npcBank counterpart pin
    // (tests/domain/npc/npcBank.test.js) enforces it.
    'prudent',
    'candid',
    'gracious',
    'stalwart',
    'discerning',
    'equitable',
    'temperate',
    'courteous',
    'dependable',
    'astute',
    'conscientious',
    'good-humoured',
    'unflappable',
    'plain-dealing',
    'hospitable',
  ],
  negative: [
    'greedy',
    'arrogant',
    'cruel',
    'cowardly',
    'deceitful',
    'wrathful',
    'lazy',
    'envious',
    'suspicious',
    'stubborn',
    'vain',
    'ruthless',
    'manipulative',
    'vengeful',
    'corrupt',
    'paranoid',
    'callous',
    'hypocritical',
    'petty',
    'domineering',
    'reckless',
    'bitter',
    'vindictive',
    'self-serving',
    'dismissive',
    'volatile',
    'overbearing',
    'mendacious',
    'cold-blooded',
    'imperious',
  ],
  neutral: [
    'pragmatic',
    'ambitious',
    'calculating',
    'secretive',
    'eccentric',
    'melancholic',
    'stoic',
    'cynical',
    'cautious',
    'proud',
    'reserved',
    'methodical',
    'traditionalist',
    'iconoclast',
    'opportunistic',
    'perfectionist',
    'fatalistic',
    'idealistic',
    'zealous',
    'hedonistic',
    'detached',
    'mercurial',
    'inscrutable',
    'superstitious',
    'brooding',
    'theatrical',
    'nostalgic',
    'contrarian',
    'restless',
    'obsessive',
  ],
};

export const NPC_AGE_DATA = {
  young: ['early twenties', 'mid-twenties', 'late twenties'],
  middle: ['early thirties', 'mid-thirties', 'late thirties', 'early forties', 'mid-forties'],
  mature: ['late forties', 'early fifties', 'mid-fifties', 'late fifties'],
  elder: ['early sixties', 'mid-sixties', 'late sixties', 'seventies'],
};

export const NPC_PLOT_HOOKS = {
  government: [
    {
      impression:
        'Efficient, slightly distracted: someone with too many things in their head and a practised way of not showing it.',
      disposition: 'transactional',
    },
    {
      impression: 'Warmer than their office suggests. They have the gift of making people feel briefly important.',
      disposition: 'welcoming',
    },
    {
      impression: 'Formally polite. Every sentence is measured before it leaves their mouth.',
      disposition: 'cautious',
    },
    {
      impression: 'Tired. Not rudely, but visibly. This is a person who has been doing a hard job for a long time.',
      disposition: 'cautious',
    },
  ],
  military: [
    {
      impression:
        "Direct. They assess you in the first three seconds and their expression tells you they've reached a provisional conclusion.",
      disposition: 'cautious',
    },
    {
      impression:
        'Professionally cordial: the manner of someone who deals with strangers all day and has a system for it.',
      disposition: 'transactional',
    },
    {
      impression: 'Relaxed in a way that reads as confidence rather than carelessness.',
      disposition: 'welcoming',
    },
    {
      impression: "Alert. Not hostile, but attentive in a way that doesn't quite switch off.",
      disposition: 'cautious',
    },
  ],
  religious: [
    {
      impression: "Genuinely glad to see you, or performs it so well the difference doesn't matter at first.",
      disposition: 'welcoming',
    },
    {
      impression: 'Composed. The particular stillness of someone who has practised being still.',
      disposition: 'cautious',
    },
    {
      impression: 'Interested in you as a person, or at least in what you might need. The attention feels real.',
      disposition: 'welcoming',
    },
    {
      impression: 'Watchful, in a religious way: not suspicious, but as though taking a reading.',
      disposition: 'cautious',
    },
  ],
  economy: [
    {
      impression: 'Quick to smile, quick to calculate. Both things are happening simultaneously.',
      disposition: 'welcoming',
    },
    {
      impression: "Busy, or presenting as busy. The first impression is of someone who doesn't waste time.",
      disposition: 'transactional',
    },
    {
      impression: 'Affable. The manner of someone for whom friendliness is both genuine and useful.',
      disposition: 'welcoming',
    },
    {
      impression: 'Cautious with newcomers. The wariness is professional rather than personal.',
      disposition: 'cautious',
    },
  ],
  criminal: [
    {
      impression: 'Unremarkable, deliberately. The kind of person you would walk past twice.',
      disposition: 'transactional',
    },
    {
      impression: 'Helpful in a way that asks for nothing obvious in return. Yet.',
      disposition: 'welcoming',
    },
    {
      impression: "Friendly, easy, slightly too interested in where you're from.",
      disposition: 'welcoming',
    },
    {
      impression: 'Quiet. They let other people fill the silence.',
      disposition: 'dismissive',
    },
  ],
  magic: [
    {
      impression:
        'Elsewhere, mentally. The conversation is happening in the foreground while something else has most of their attention.',
      disposition: 'dismissive',
    },
    {
      impression: 'Precise: words chosen carefully, pauses before answering, a slight sense of being assessed.',
      disposition: 'cautious',
    },
    {
      impression: "Unexpectedly approachable. Whatever you expected, this isn't it.",
      disposition: 'welcoming',
    },
    {
      impression: 'Polite but removed. Not unfriendly, just operating at a different register.',
      disposition: 'dismissive',
    },
  ],
  other: [
    {
      impression: 'Ordinary in a way that is itself a kind of presence.',
      disposition: 'transactional',
    },
    {
      impression:
        'Open. The impression of someone with nothing in particular to hide, or who has decided not to hide it.',
      disposition: 'welcoming',
    },
    {
      impression: 'Tired, but alert. The combination of someone who works hard and pays attention.',
      disposition: 'transactional',
    },
    {
      impression: 'Reserved. Not hostile, just private.',
      disposition: 'cautious',
    },
  ],
};

export const NPC_BUILDS = [
  'lean and wiry',
  'stocky and broad-shouldered',
  'tall with a slight stoop',
  'average height, unremarkable frame',
  'heavyset and solid',
  'slight: smaller than expected for the role',
  'imposingly tall',
  'compact and powerful',
  'willowy',
  'barrel-chested',
];

export const NPC_FEATURES = [
  'a scar cutting through one eyebrow',
  'ink-stained fingers',
  'surprisingly soft hands',
  'eyes that are slightly different colours',
  'a jaw set permanently as if biting back words',
  'hair prematurely grey for their apparent age',
  'an old injury that affects their gait',
  'a ring on every finger',
  'a branded mark they keep covered',
  'laugh lines that run deep',
  'a voice that carries further than intended',
  'teeth that have been replaced with metal',
  'a prosthetic hand, finely crafted',
  'heavy-lidded eyes that suggest either wisdom or exhaustion',
  'a network of small scars on their knuckles',
  'a habit of standing very still',
  'a slight accent',
  'sun-darkened skin that suggests years outdoors',
  'a perpetual half-smile',
  'a cough they suppress with visible effort',
  'unusually long fingers',
  'close-cropped hair',
  'a full beard maintained with military precision',
  'a shaved head with old tattoos',
  'ink-work visible at the collar and cuffs',
  'a sealed letter always tucked in their belt',
  'a cloak clasped with an unusual brooch',
  'eyes that never stop moving',
];

// CONTENT-GT-FINAL (Charge 3): each category 4→8 — the survey's thinnest cells. The
// entries are CLOTHING descriptions consumed as the appearance `clothes` field
// (npcGenerator.js:286); the constant NAME is the recorded mislabel (flagged in the
// shift map, deliberately not renamed — the wiring is correct). Single-pick draw site.
export const NPC_WANTS = {
  government: [
    'formal robes of office',
    'expensive but conservative merchant dress',
    'a chain of office worn even off-duty',
    'court attire with discreet personal touches',
    'robes cut for a taller predecessor, never altered',
    'official dress one grade above their actual station',
    'sombre official black with a jewelled clasp nobody asks about',
    'immaculate formal wear that has clearly never seen weather',
  ],
  military: [
    'functional armour with personal sigils',
    'guard uniform kept immaculate',
    "soldier's practical dress with officer's insignia",
    "battle-worn plate they haven't replaced",
    'a dress uniform kept for funerals, worn thin at the elbows',
    'mismatched armour pieces, each from a different campaign',
    'a field coat carrying the insignia of a disbanded company',
    'civilian dress worn like a uniform: pressed, squared, joyless',
  ],
  religious: [
    'religious vestments layered over travelling clothes',
    'simple robes of their order',
    'ceremonial attire worn at all times',
    'plain devotional dress with one opulent accessory',
    'vestments a size too grand for the shrine they serve',
    'threadbare robes patched with fabric from finer ones',
    'a formal habit with a travel-stained hem never cleaned',
    'lay clothes with the collar of the order left visible',
  ],
  economy: [
    'merchant dress: practical but signalling wealth through material',
    'guild colours worn with pride',
    'clothes that once cost a fortune and now show the miles',
    'well-cut but understated trading clothes',
    'sober broadcloth with buttons worth more than the coat',
    'foreign-cut clothes from a market they want to be asked about',
    "a ledger-keeper's plain dress with ink at the right cuff",
    "last season's fashion maintained with visible determination",
  ],
  criminal: [
    'nondescript working clothes chosen specifically to be forgettable',
    'fine clothes worn ironically over rougher garments',
    'guard or clergy disguise worn as a habit',
    'whatever is clean (they move frequently)',
    "a dockhand's oilskins over hands too clean for the work",
    'respectable dress exactly average for the street they work',
    'good boots and cheap everything else',
    'a heavy coat worn indoors, contents unexamined',
  ],
  magic: [
    'scholarly robes with heavy pockets',
    "travelling mage's coat covered in small pouches",
    'deceptively plain clothes that crackle faintly with residual energy',
    'formal academic dress worn with absent-minded disregard',
    'robes singed at one cuff and never mended',
    'practical dress with chalk dust in every seam',
    "a scholar's gown two institutions out of date",
    'ordinary clothes with a lining that clinks faintly',
  ],
  other: [
    'clothes practical for their work with one personal flourish',
    'travel-worn but well-maintained gear',
    "second-hand fine clothes that don't quite fit",
    "whatever was available (they don't care about dress)",
    'work clothes patched by someone who loved them',
    'a good coat inherited from a larger relative',
    'dress entirely without signal (deliberately so)',
    'weathered gear maintained past the point of economy',
  ],
};

export const NPC_FACTION_GOALS = {
  Mayor: [
    {
      short: "Navigate a dispute between two powerful guilds without losing either's support",
      long: 'Die in office having kept the peace (legacy matters more than wealth)',
      driven_by: 'protection',
    },
    {
      short: 'Cover up a minor corruption scandal before the regional lord hears of it',
      long: 'Transform this settlement into a city-state with real independence',
      driven_by: 'power',
    },
    {
      short: 'Find funding for desperately needed infrastructure repairs',
      long: 'Build a political dynasty (their children will inherit influence, not just money)',
      driven_by: 'power',
    },
    {
      short: 'Discredit a council rival before the annual election',
      long: 'Write laws that outlast them: real reform, not political theatre',
      driven_by: 'reform',
    },
  ],
  Governor: [
    {
      short: 'Secure enough grain reserves before winter to prevent unrest',
      long: 'Become indispensable to the crown: irreplaceable, never exposed',
      driven_by: 'power',
    },
    {
      short: 'Root out the faction leaking tax figures to rivals',
      long: 'Retire with a fortune and a clean name (in that order)',
      driven_by: 'wealth',
    },
  ],
  'Council Member': [
    {
      short: "Block a proposal that would undermine their patron's interests",
      long: 'Build a coalition that can outvote the merchant bloc on anything',
      driven_by: 'power',
    },
    {
      short: "Expose a colleague's corruption without implicating themselves",
      long: 'Champion a reform that future councils will still cite by name',
      driven_by: 'reform',
    },
  ],
  'Tax Collector': [
    {
      short: "Meet this quarter's collection target without triggering another riot",
      long: 'Accumulate enough to buy out of this hated post (any post but this)',
      driven_by: 'wealth',
    },
    {
      short: "Find a missing merchant whose taxes haven't been filed in six months",
      long: 'Build enough goodwill that the settlement mourns them when they go',
      driven_by: 'protection',
    },
  ],
  'Chief Magistrate': [
    {
      short: 'Close a murder case that has made the merchants nervous',
      long: 'Establish a legal precedent that constrains what the nobility can do to commoners',
      driven_by: 'justice',
    },
    {
      short: 'Resist pressure from a powerful patron to deliver a specific verdict',
      long: 'Train a successor who will carry on their judicial philosophy',
      driven_by: 'reform',
    },
  ],
  'Guard Captain': [
    {
      short: 'Find the person responsible for three unsolved dock-side killings',
      long: 'Rebuild guard morale after years of under-funding and low prestige',
      driven_by: 'protection',
    },
    {
      short: "Identify which of their officers is on the thieves' guild payroll",
      long: 'Die in bed rather than in the street (unusual ambition for the role)',
      driven_by: 'personal',
    },
  ],
  'Garrison Commander': [
    {
      short: 'Secure emergency funding to repair the east wall before it becomes a crisis',
      long: 'Be remembered as the commander who made this settlement truly defensible',
      driven_by: 'military',
    },
    {
      short: 'Contain a near-mutiny caused by months of unpaid wages',
      long: 'Obtain a noble title through military distinction (the only path left open)',
      driven_by: 'power',
    },
  ],
  'Mercenary Captain': [
    {
      short: 'Collect a debt from a client who keeps finding reasons to delay payment',
      long: 'Save enough to buy land and retire before this work kills them',
      driven_by: 'wealth',
    },
    {
      short: 'Evaluate whether the next contract is worth the risk to their crew',
      long: 'Build a company so well-regarded that princes compete to hire them',
      driven_by: 'power',
    },
  ],
  'High Priest': [
    {
      short: 'Restore a desecrated shrine before the annual festival (quietly, without scandal)',
      long: 'Unite the fractious local clergy under a single doctrinal standard',
      driven_by: 'spiritual',
    },
    {
      short: 'Identify who among their junior clergy is accepting bribes from merchants',
      long: 'Found an institution (a hospital, a school) that will outlast them by centuries',
      driven_by: 'reform',
    },
  ],
  Priest: [
    {
      short: 'Mediate a land dispute between two families before it turns violent',
      long: 'Simply keep the community together: feed them, marry them, bury them with dignity',
      driven_by: 'protection',
    },
    {
      short: 'Convince their superior in the faith to fund repairs to the temple roof',
      long: 'Leave a detailed record of the congregation so future priests know who this community was',
      driven_by: 'knowledge',
    },
  ],
  'Abbot/Abbess': [
    {
      short: 'Investigate rumours that a novice has been leaving the grounds at night',
      long: 'Expand the scriptorium into a library open to all who can read',
      driven_by: 'knowledge',
    },
    {
      short: 'Negotiate a tithe reduction with the local lord without compromising principle',
      long: 'Leave the monastery in better condition (spiritually and structurally) than they found it',
      driven_by: 'spiritual',
    },
  ],
  Inquisitor: [
    {
      short: 'Confirm or deny specific heresy accusations against a prominent citizen',
      long: 'Dismantle an actual organised heretical network, not chase rumours',
      driven_by: 'justice',
    },
    {
      short: 'Navigate political pressure from both the church hierarchy and the civil authorities',
      long: 'Retire before the work corrupts them entirely',
      driven_by: 'personal',
    },
  ],
  'Wealthiest Merchant': [
    {
      short: 'Corner the market on a specific commodity before a rival does',
      long: 'Fund a trading dynasty that their grandchildren will run',
      driven_by: 'wealth',
    },
    {
      short: 'Determine who has been bribing their warehouse staff',
      long: 'Convert wealth into political power: a seat on the council, then more',
      driven_by: 'power',
    },
  ],
  'Guild Master': [
    {
      short: "Prevent a rival guild from undercutting their members' prices",
      long: "Codify guild law so strongly that future masters can't easily corrupt it",
      driven_by: 'power',
    },
    {
      short: 'Place a talented apprentice in a role that increases guild influence',
      long: 'Be remembered as the master who expanded the guild into new trades',
      driven_by: 'wealth',
    },
  ],
  Moneylender: [
    {
      short: 'Collect on a large overdue debt from a borrower who has suddenly disappeared',
      long: 'Accumulate enough leverage over enough people to be untouchable',
      driven_by: 'power',
    },
    {
      short: 'Identify which of their clients is about to default and act first',
      long: 'Transform the lending business into a proper banking institution: legitimate, respectable',
      driven_by: 'wealth',
    },
  ],
  'Master Craftsman': [
    {
      short: 'Complete a prestigious commission that will make their reputation in the city',
      long: 'Train an apprentice who surpasses them: the greatest achievement of any craftsman',
      driven_by: 'personal',
    },
    {
      short: "Acquire a rare material to solve a technical problem they've never cracked",
      long: 'Document every technique they know before the knowledge dies with them',
      driven_by: 'knowledge',
    },
  ],
  "Thieves' Guild Master": [
    {
      short: 'Identify which of their lieutenants is planning to branch out independently',
      long: 'Achieve enough legitimate business to step back from direct criminal exposure',
      driven_by: 'power',
    },
    {
      short: 'Negotiate a non-aggression pact with a new criminal faction moving into their territory',
      long: 'Ensure no one ever proves the connection between them and their operations',
      driven_by: 'personal',
    },
  ],
  'Crime Lord': [
    {
      short: 'Suppress a rival operation that has begun cutting into smuggling revenue',
      long: 'Build an empire that survives their death: succession planning for criminals',
      driven_by: 'power',
    },
    {
      short: 'Identify the guard captain who is no longer co-operative, and why',
      long: 'Launder enough wealth to fund a legitimate legacy',
      driven_by: 'wealth',
    },
  ],
  'Smuggler Chief': [
    {
      short: 'Find a new route after the customs increase made the old one uneconomical',
      long: 'Retire to somewhere no one knows their name with enough to live comfortably',
      driven_by: 'personal',
    },
    {
      short: 'Determine whether the recent cargo losses are coincidence or betrayal',
      long: 'Expand into a trade that requires less hiding: spice or cloth, not people',
      driven_by: 'wealth',
    },
  ],
  'Tower Wizard': [
    {
      short: 'Identify the source of unexplained magical disturbances in the northern district',
      long: 'Complete a research project that will earn peer recognition: not power, just acknowledgement',
      driven_by: 'knowledge',
    },
    {
      short: 'Find an apprentice worth investing time in before they become too old to train anyone',
      long: 'Solve one genuinely unsolved theoretical question before they die',
      driven_by: 'knowledge',
    },
  ],
  'Guild Archmage': [
    {
      short: "Resolve a dispute between two factions of the mages' guild without taking sides",
      long: 'Establish a magical institution that outlasts their own life and power',
      driven_by: 'power',
    },
    {
      short: 'Track down a former student who has been using restricted magic',
      long: 'Complete the great work (whatever that means to them specifically)',
      driven_by: 'knowledge',
    },
  ],
  'Hedge Wizard': [
    {
      short: 'Find reliable income for the next three months (magical services barely pay)',
      long: 'Be taken seriously by the formal magical establishment, just once',
      driven_by: 'personal',
    },
    {
      short: 'Identify what is wrong with the crops in the northern fields (it smells magical)',
      long: 'Understand their own unusual ability well enough to pass it on',
      driven_by: 'knowledge',
    },
  ],
  Alchemist: [
    {
      short: 'Source a specific reagent that has been mysteriously unavailable for six weeks',
      long: "Crack the theoretical basis for a transmutation they've been circling for years",
      driven_by: 'knowledge',
    },
    {
      short: 'Fulfil a large dangerous commission while minimising the chance of explosion',
      long: "Publish findings that will outlast the potions they've spent their life brewing",
      driven_by: 'knowledge',
    },
  ],
  'Tavern Owner': [
    {
      short: 'Manage the fallout from a brawl last week that left a local merchant hospitalised',
      long: "Pay off the building and own it outright before they're too old to work it",
      driven_by: 'wealth',
    },
    {
      short: 'Figure out who has been watering down their barrels before it reaches customers',
      long: 'Build a place where everyone (not just the wealthy) can feel welcome',
      driven_by: 'personal',
    },
  ],
  'Sage/Scholar': [
    {
      short: 'Verify a specific historical claim before publishing it (one source contradicts all others)',
      long: "Complete the comprehensive work they've spent thirty years building toward",
      driven_by: 'knowledge',
    },
    {
      short: 'Find funding to continue research after their patron cut support without explanation',
      long: 'Mentor someone who will care about truth more than they care about credit',
      driven_by: 'reform',
    },
  ],
  Healer: [
    {
      short: 'Identify the source of a cluster of unusual illnesses in the western quarter',
      long: 'Train enough local healers that the settlement can cope without them',
      driven_by: 'protection',
    },
    {
      short: 'Obtain a specific medicinal compound that has been unavailable for months',
      long: "Document everything they know so the knowledge survives if they don't",
      driven_by: 'knowledge',
    },
  ],
};

export const NPC_CRIMINAL_SECRETS = {
  criminal: [
    {
      secret: 'Has been embezzling from the organisation they oversee for three years',
      stakes: 'Exposure means disgrace, legal prosecution, and enemies who feel personally betrayed',
    },
    {
      secret: 'Secretly directs a fencing operation through a trusted intermediary',
      stakes: 'Criminal liability and the end of any political or social standing',
    },
    {
      secret: 'Ordered what was officially ruled an accident, and sleeps fine about it',
      stakes: "Murder charge, loss of everything, and the victim's family who suspects the truth",
    },
    {
      secret: "On the payroll of the thieves' guild as a silent informant",
      stakes: 'Exposure would cost them their post and likely their safety',
    },
    {
      secret: 'Has been systematically bribing multiple officials for preferential treatment',
      stakes: 'A cascade of confessions from any single one of the bribed parties',
    },
    {
      secret: "Runs a protection scheme targeting the very merchants they're supposed to serve",
      stakes: 'Civil and criminal liability; the merchants have been keeping records',
    },
    {
      secret: 'Has been falsifying inspection records for a fee',
      stakes: 'The next disaster caused by the uninspected goods will be traced back to them',
    },
    {
      secret: 'Their legitimate business is a front for moving contraband',
      stakes: 'Seizure of everything; the legitimacy is thin and investigators are circling',
    },
  ],
  personal: [
    {
      secret: 'Has a second family in another settlement that neither family knows about',
      stakes: 'Both relationships collapse, along with any claim to moral authority',
    },
    {
      secret: 'Their identity is fabricated. They fled a different life entirely',
      stakes: 'The person they became would be destroyed; the person they were might be wanted',
    },
    {
      secret: 'Suffering from an illness they expect to kill them within two years',
      stakes: 'Rivals would move against them immediately if they knew; dependents would panic',
    },
    {
      secret: 'Deeply in debt to a creditor who owns the debt as leverage, not income',
      stakes: 'The creditor will call it in at the worst possible moment, and has leverage to do so',
    },
    {
      secret: 'Was directly responsible for a death that was ruled an accident',
      stakes: 'Criminal liability and the complete destruction of their reputation',
    },
    {
      secret: 'Has been funding a forbidden relationship with embezzled money',
      stakes: 'Both the relationship and the embezzlement would become public simultaneously',
    },
    {
      secret: "Their celebrated achievement was stolen. They took credit for another's work",
      stakes: "The real author has evidence; they've been sitting on it for years",
    },
    {
      secret: 'Has been slowly poisoning a rival with something that looks like natural illness',
      stakes: 'A competent healer or investigator would find the evidence almost immediately',
    },
  ],
  political: [
    {
      secret: 'Has been feeding strategic intelligence to a rival settlement',
      stakes: 'Treason charges; execution or exile in most jurisdictions',
    },
    {
      secret: 'Their appointment was secured through forged credentials',
      stakes: "Discovery ends their career and discredits every decision they've made",
    },
    {
      secret: "Knows the settlement's most important legal document was fraudulently created",
      stakes: 'Revealing it destabilises everything; not revealing it makes them complicit',
    },
    {
      secret: 'Has been delaying vital information from reaching the decision-makers',
      stakes: 'When the consequences emerge, the delay will be investigated and traced',
    },
    {
      secret: "Is the illegitimate heir to a title currently held by someone who doesn't know they exist",
      stakes: 'Could claim it, or could be seen as a threat by those who benefit from the status quo',
    },
    {
      secret: 'Has agreed to hand over authority to an external power in exchange for personal safety',
      stakes: "Treason. Those they've sold out would not be forgiving",
    },
  ],
  magical: [
    {
      secret: "Possesses a magical ability they've hidden for their entire career",
      stakes: 'In some jurisdictions, concealment is itself a crime; in all of them, it changes everything',
    },
    {
      secret: 'Made a binding pact with an entity they now cannot name without consequence',
      stakes: 'The pact will come due (soon), and the terms are worse than they appeared at signing',
    },
    {
      secret: 'Has been using magic to alter memories of specific events',
      stakes: 'The alterations are imperfect; some victims already sense something is wrong',
    },
    {
      secret: 'Knows the location of a sealed magical site that others have been searching for',
      stakes: 'Everyone who wants it would kill for the information; none of them should have it',
    },
    {
      secret: "Is under a compulsion placed by someone who is now dead, and it's getting harder to resist",
      stakes: 'The compulsion will eventually force an action that exposes everything',
    },
    {
      secret: 'Has been studying a forbidden school of magic under a false research pretext',
      stakes: 'The research has progressed to the point where hiding it grows harder each week',
    },
  ],
  religious: [
    {
      secret: "Lost their faith completely but maintains the role. It's just a job now",
      stakes: "Discovery destroys their flock's trust and their own standing; some would call it heresy",
    },
    {
      secret: "Has been covering for a colleague's heretical activities out of personal loyalty",
      stakes: 'When the colleague is exposed (and they will be), this secret comes with them',
    },
    {
      secret: 'Secretly receives what they believe are genuine divine visions, which terrifies them',
      stakes: 'Acting on the visions would be seen as madness; ignoring them may be worse',
    },
    {
      secret: 'Has been systematically falsifying miracle reports for decades',
      stakes: 'A sceptical investigator with the right access could unravel it all in a week',
    },
    {
      secret: 'Knows their religious order was founded on a historical lie',
      stakes: "The truth would shatter the institution they've dedicated their life to",
    },
    {
      secret:
        "Possesses a relic that was officially declared destroyed, and kept it because they couldn't face destroying something real",
      stakes: 'Possession is heresy; surrender means explaining how they had it',
    },
  ],
  family: [
    {
      secret: 'Has been sending money to a disowned family member in secret for years',
      stakes: 'The family member knows enough to burn them; the payments are leverage',
    },
    {
      secret: 'Knows their celebrated family history is fabricated, and helped fabricate it',
      stakes: 'The real history is much worse; discovery would shame all who share the name',
    },
    {
      secret: 'One of their children is not theirs biologically, and they know it',
      stakes: 'Every inheritance, every decision, made differently if this becomes known',
    },
    {
      secret: 'Owes a life-debt to someone whose interests directly conflict with their current role',
      stakes: 'The debt will eventually be called in at the worst possible moment',
    },
    {
      secret: "Has been protecting a sibling's crime for years (a serious one)",
      stakes: 'Discovery makes them an accessory; the sibling has reason to pre-empt exposure',
    },
  ],
  historical: [
    {
      secret: 'Was present at (and did nothing to prevent) an atrocity that is now history',
      stakes: 'Complicity charges; the moral weight has been crushing them for years',
    },
    {
      secret: 'Knows the actual truth behind a founding event that the settlement reveres',
      stakes: 'The truth would delegitimise current power structures; powerful people prefer the myth',
    },
    {
      secret: 'Survived something everyone believes killed them, under a different name',
      stakes: 'The original identity, if revealed, carries baggage that would end the current one',
    },
    {
      secret: 'Has been maintaining a cover-up of a past institutional failure that cost lives',
      stakes: 'Exposure means accountability for something that happened a long time ago, to real people',
    },
    {
      secret: 'Was the informant whose report triggered a purge that destroyed innocent lives',
      stakes: 'The report was accurate in some ways but deliberately misleading in others',
    },
    {
      secret: 'Possesses an original copy of a document that was officially declared destroyed',
      stakes: 'The document changes the legitimacy of something very important to very powerful people',
    },
    {
      secret: 'The person who raised them was not their parent, and that parent is someone significant',
      stakes: "The revelation would disrupt inheritance, property, and several people's sense of identity",
    },
  ],
  military: [
    {
      secret: 'Gave an order during a battle that caused friendly casualties. It was covered up as enemy action',
      stakes: 'The families of the dead believe a lie that this person actively maintains',
    },
    {
      secret: 'Was captured and released under terms they have never disclosed',
      stakes: "The terms may mean they owe something to an enemy that they haven't paid yet",
    },
    {
      secret: 'Knows that the decisive victory everyone celebrates was won through treachery, not skill',
      stakes: 'Several people built careers on that victory; they would not appreciate the truth',
    },
    {
      secret: 'Has been selling patrol routes and schedules to someone outside the settlement',
      stakes: 'People have already died as a result; they are rationalising this as survivable',
    },
    {
      secret: 'Has been skimming from military supply budgets for years through a trusted subordinate',
      stakes: 'The subordinate now knows enough to destroy them, and is becoming expensive',
    },
    {
      secret:
        'Was ordered to commit an atrocity and complied, and has since risen in the organisation that ordered it',
      stakes: 'The order came from someone senior; exposure implicates both of them',
    },
  ],
  economic_betrayal: [
    {
      secret: 'Has been quietly shorting investments they publicly recommend, profiting from collapse',
      stakes: 'Civil fraud liability and the permanent destruction of a reputation built over decades',
    },
    {
      secret: 'The goods they sell as locally produced are sourced from somewhere with exploitative labour practices',
      stakes: 'The premium they charge depends entirely on the lie holding',
    },
    {
      secret: 'Has been paying a health official to suppress a finding about their product',
      stakes: 'People are being harmed; the official is growing nervous; the finding is documented',
    },
    {
      secret: 'Has information about a competitor that would ruin them, obtained through clearly illegal means',
      stakes: 'Using the information exposes how it was obtained; not using it means watching an advantage expire',
    },
    {
      secret: "Their business partner died of natural causes that weren't entirely natural",
      stakes: 'An investigation would find ambiguous evidence: enough to ruin, maybe enough to prosecute',
    },
  ],
  identity: [
    {
      secret: 'Is a member of a group that faces serious persecution, and passes for something else entirely',
      stakes: 'Discovery ends everything they have built; some of the people closest to them would turn on them',
    },
    {
      secret: 'Their celebrated origin story is a fabrication they created to escape an intolerable past',
      stakes: 'The real past includes people who are still alive and who remember',
    },
    {
      secret: 'Has been corresponding with someone they are publicly required to treat as an enemy',
      stakes: 'The correspondence is genuine and affectionate; it would be read as treason',
    },
    {
      secret: 'Lives a second life under a different name in another part of the settlement or a nearby town',
      stakes: 'The two lives have begun to approach each other geographically',
    },
    {
      secret: 'Is not who their documents say they are. The real person died years ago and they took the identity',
      stakes: "The real person's family recently moved to the area",
    },
  ],
};

export const FACTION_CONFLICT_TYPES = {
  government: ['military', 'economy', 'religious'],
  military: ['government', 'criminal'],
  economy: ['government', 'criminal', 'magic'],
  religious: ['government', 'magic'],
  magic: ['economy', 'criminal', 'religious'],
  criminal: ['economy', 'military', 'magic'],
  other: ['economy', 'government'],
};

export const NPC_FACTION_LOYALTY = {
  government: [
    "A sealed letter arrived for them three weeks ago. They haven't opened it. They won't say why.",
    "They've been quietly buying up property in a district that hasn't been announced as a development site. Yet.",
    "One of their staff has started asking questions about records from seven years ago. They've been reassigned twice already.",
    'A merchant they publicly opposed is now publicly supporting them. No explanation offered.',
    "Their most trusted advisor hasn't been seen in four days. The official story changes each time it's told.",
    "They know who committed a crime the guard is currently investigating. They're not telling the guard.",
    "Someone has been leaving anonymous notes in their office pointing to a colleague's corruption. The notes are accurate.",
    "They've been meeting privately with someone from outside the settlement whose identity they won't disclose.",
    'A routine appointment they made three weeks ago has been rescheduled four times. Each time they initiated the change.',
    'Someone who publicly supports them is being paid by someone who opposes them. They know this.',
    'They received a deposition in a civil case that, if acted on, would be correct, and would ruin someone they need.',
  ],
  military: [
    'Three guards have gone missing in the same district on night patrol. The report filed says they deserted.',
    'Weapons from the armoury have been disappearing in small quantities for months. The inventory matches, somehow.',
    "They received orders from above that contradict what they know to be right. They haven't acted on either yet.",
    'A prisoner in their custody knows something valuable. So does someone with reason to ensure they never speak.',
    "They've noticed the same group of faces at multiple locations where incidents occurred. No one else has.",
    "Someone is paying their soldiers more than their salary. The soldiers aren't saying who.",
    'A spy they turned is now being turned back, and feeding information in both directions.',
    "The ambush that killed two of their best people wasn't random. Someone knew the patrol route.",
    'A recruit they turned away has since joined a different outfit. The different outfit is now paying them to monitor this one.',
    'They are carrying out orders they believe are wrong. They have not yet decided at what point they stop carrying them out.',
    "A weapons cache they were responsible for is smaller than it should be. They haven't reported it yet.",
  ],
  religious: [
    'A parishioner confessed something to them three months ago. The information is dangerous. They cannot act on it.',
    'The holy relic in their keeping is not what everyone believes it is. Only they know this.',
    "Someone has been leaving offerings at the shrine that shouldn't be possible. The site has been sealed.",
    "A novice has the gift. They know what that means for the novice. They're not sure what to do.",
    'They received a directive from the hierarchy that contradicts their own theology. Compliance is expected.',
    "A healing they performed was successful in a way they cannot explain. It's happened twice now.",
    "The previous holder of their position left a letter, sealed, to be opened after their death. It wasn't.",
    'A member of their congregation is systematically working against the faith. From inside it.',
    'They have been asked to perform a ceremony they have theological objections to. The person asking has leverage.',
    "A donation was made to the institution under conditions the donor didn't disclose publicly. The conditions are becoming relevant.",
    'They know which of the current leadership will be the next to fall from grace. They are waiting.',
  ],
  economy: [
    "A shipment they weren't expecting arrived and is now in their warehouse. They don't know who sent it or what to do.",
    "A business rival has offered them a partnership with terms so good it must be a trap. They can't find the trap.",
    'One of their most reliable suppliers has gone dark. The goods are still arriving. Someone else is sending them.',
    'They have evidence of price-fixing across the whole market. Publishing it helps their competition as much as their customers.',
    "A young trader has been undercutting them in ways that shouldn't be possible on their claimed capital.",
    "Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in.",
    'A valuable cargo was reported lost at sea. The manifest has reappeared in a market two settlements away.',
    "Their master craftsman is talking to a rival. They haven't confronted them. They're not sure what they'd do.",
    "A contract they signed in difficult times has a clause they didn't fully read. Someone has read it.",
    "They have been slowly acquiring a controlling interest in a competitor through intermediaries. The competitor hasn't noticed yet.",
    'A supplier is providing goods of uncertain provenance. The price is too good to ask questions. People have started asking questions.',
  ],
  criminal: [
    "One of their people is talking to the guard. They don't know which one yet. They're watching.",
    'A valuable item came through their network recently. Three different parties have asked about it quietly.',
    "Someone in the legitimate government is playing both sides. That's useful, until it isn't.",
    'A job went wrong in a way that suggests information was leaked. They have three suspects.',
    "They're protecting someone from something worse. The someone doesn't know and wouldn't thank them.",
    'A new face has appeared in three separate incidents involving their operations. Coincidence or surveillance?',
    'The guard captain has a file. They know because someone who works for the guard captain also works for them.',
    "Someone tried to rob one of their fronts. The attempt was professional. That's more worrying than amateur.",
  ],
  magic: [
    "An experiment failed in a way that shouldn't be possible. The results have been sealed. They're still thinking.",
    "A student asked a question three weeks ago that they haven't been able to answer. That's new.",
    'Something in the settlement is absorbing ambient magical energy. The readings are increasing.',
    "They've been approached by someone who knows things about their research that were never made public.",
    'An old colleague has sent a message asking for a meeting. The colleague was declared dead six years ago.',
    'The magical ward they placed on the vaults was bypassed. Not broken. Bypassed. That requires inside knowledge.',
    'They have two competing theories about what is happening to magic in this region. Both are alarming.',
    'Someone has been making inquiries about their past research. Not the published work, the unpublished work.',
  ],
  other: [
    "They overheard something they shouldn't have and don't know what to do with the information.",
    "A regular customer has stopped coming. The reason they've been given doesn't make sense.",
    "Someone left an item in their care and hasn't returned. The item is valuable. The absence is now suspicious.",
    'Three different people have asked them the same unusual question. None of them knew each other.',
    "They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone.",
    'A stranger passed through, asked specific questions, and left before they could follow up.',
    'Something they were told was destroyed is apparently not destroyed.',
    "They know something small that connects to something much larger. They haven't realised the connection. Yet.",
    "Someone they trust completely has started behaving in ways that don't add up.",
    "They've been offered money to not ask questions about something they hadn't even started asking about.",
    'A document they were asked to witness contained a clause they noticed at the time and said nothing about.',
    "Their predecessor left something behind (in a place where it shouldn't have been), and they haven't reported finding it.",
  ],
  small_settlement: [
    'Everyone in the settlement is behaving slightly differently toward a visitor from outside. Not unfriendly, careful.',
    'There is a building no one talks about, goes into, or mentions. It is clearly maintained. No one will say by whom.',
    'The oldest resident refuses to speak about a specific year. Others confirm the year exists. No one remembers what happened.',
    'Something is left at the crossroads each new moon. No one admits to leaving it. It is always gone by morning.',
    'Two families who should be feuding are recently, unexpectedly civil. Neither will explain why.',
    'A child has been asking questions about a person no one has heard of, insisting this person lived here recently.',
    'The well gives good water. The spring above it dried up three years ago. No one mentions this.',
    "They buried someone last season that they refer to only as 'the traveller'. They will not say more.",
  ],
};

export const NPC_SECRETS = {
  government: [
    {
      short: 'Survive the current political season without a major scandal',
      long: 'Build lasting institutional reform that outlives their tenure',
      driven_by: 'power',
    },
    {
      short: 'Consolidate their position before rivals can organise',
      long: 'Die having made this place meaningfully better',
      driven_by: 'reform',
    },
  ],
  military: [
    {
      short: 'Train the next cohort to a standard that might actually keep people alive',
      long: "Build a force that doesn't need them: sustainable, not dependent",
      driven_by: 'protection',
    },
    {
      short: 'Identify the weak link before the weak link identifies itself in a crisis',
      long: 'Achieve enough distinction to be remembered without being mourned too soon',
      driven_by: 'military',
    },
  ],
  religious: [
    {
      short: 'Settle a theological dispute that has divided the congregation for months',
      long: 'Strengthen the faith: not the institution, the actual living faith',
      driven_by: 'spiritual',
    },
    {
      short: 'Obtain the resources needed for a desperately needed charitable project',
      long: 'Be worthy of the role they hold, which turns out to be the harder task',
      driven_by: 'spiritual',
    },
  ],
  economy: [
    {
      short: "Close the deal that will determine this year's profitability",
      long: "Build something that doesn't need them to keep running",
      driven_by: 'wealth',
    },
    {
      short: 'Identify the leak in their supply chain before it empties the accounts',
      long: "Leverage money into influence: that's where security actually lives",
      driven_by: 'power',
    },
  ],
  criminal: [
    {
      short: 'Eliminate the threat before it becomes a bigger threat',
      long: 'Build insulation between themselves and consequences',
      driven_by: 'power',
    },
    {
      short: 'Find who betrayed them before they do it again',
      long: 'Accumulate enough to make legitimacy a choice rather than an aspiration',
      driven_by: 'wealth',
    },
  ],
  magic: [
    {
      short: 'Solve the magical problem that has been festering for three weeks',
      long: 'Advance understanding of something that was genuinely unknown',
      driven_by: 'knowledge',
    },
    {
      short: 'Find someone capable enough to not endanger others',
      long: 'Leave magic in a better state than they found it',
      driven_by: 'knowledge',
    },
  ],
  other: [
    {
      short: 'Get through this particular difficulty without it becoming a catastrophe',
      long: 'Build enough stability that they have choices',
      driven_by: 'personal',
    },
    {
      short: 'Figure out what is actually going on before it affects them directly',
      long: 'Matter to the people immediately around them: small scale, real',
      driven_by: 'personal',
    },
  ],
};

export const NPC_PLOT_HOOKS_DATA = {
  welcoming: 'Offers information freely; asks questions that seem like interest rather than interrogation.',
  transactional: 'Cooperative within clear limits; every exchange has an implicit value.',
  cautious: 'Answers questions without volunteering; watches who you talk to next.',
  dismissive: 'Polite but brief; makes clear their time is limited.',
};

export const NPC_PRESENTATION_MODES = {
  dangerous_presents_safe: [
    {
      impression:
        'Genuinely helpful, or indistinguishable from it. Knowledgeable, generous with information, nothing that raises concern.',
      disposition: 'welcoming',
      behaviour: 'Volunteers information before you ask. Seems invested in your success here.',
    },
    {
      impression: 'Friendly and community-minded. The kind of person other residents speak well of.',
      disposition: 'welcoming',
      behaviour: 'Knows everyone, introduces you to people, seems like the natural first contact for newcomers.',
    },
    {
      impression: "Warm, a little effusive. The first person to make you feel you've arrived somewhere safe.",
      disposition: 'welcoming',
      behaviour: 'Asks good questions about your journey. Remembers the answers.',
    },
  ],
  compromised_presents_professional: [
    {
      impression: 'Efficient and correct in every interaction. The manner of someone following procedure.',
      disposition: 'transactional',
      behaviour: "Processes requests quickly. Doesn't ask about things that aren't their business.",
    },
    {
      impression: 'Reserved. Appropriately cautious with strangers. You would be too, in their position.',
      disposition: 'cautious',
      behaviour: 'Asks reasonable questions. Gives reasonable answers. Nothing out of the ordinary.',
    },
    {
      impression:
        'Busy. The impression of someone with real responsibilities who is giving you an appropriate portion of their attention.',
      disposition: 'transactional',
      behaviour: 'Helpful within the limits of their role. Refers you to others for anything outside it.',
    },
  ],
  significant_presents_ordinary: [
    {
      impression: 'Unremarkable. The particular invisible quality of someone who has spent years not being noticed.',
      disposition: 'transactional',
      behaviour: 'Answers questions. Asks nothing. Remembers more than they show.',
    },
    {
      impression: 'Tired and ordinary. The manner of someone who is carrying less than they are.',
      disposition: 'transactional',
      behaviour: 'Cooperative. Unassuming. Easy to overlook.',
    },
    {
      impression: 'Quiet, neighbourly. The impression of someone with a small life and modest concerns.',
      disposition: 'welcoming',
      behaviour: "Helpful in the small practical ways that don't invite scrutiny.",
    },
  ],
};

// ── Original npcData.js constants (preserved from pre-extraction) ──────────────

// [data-tables-6] A role→goal map that was a byte-identical dead duplicate of
// NPC_FACTION_GOALS (above) was removed here — it had zero importers (only stale
// comment mentions in npcGenerator.js). Deletion is behavior-inert: no consumer,
// so goldens are byte-identical. Disposition: docs/DEAD_CODE_DISPOSITION.md. The
// purged symbol is pinned absent by tests/joins/deadCode.test.js (do not re-name
// it here — the ratchet greps this file for the literal name).

// CONTENT-GT-FINAL (Charge 3) + GS-1 (ODQ §934.101): draw-free variety for the relationship
// archetype prose. The generator draws each tie's line WITHOUT REPLACEMENT per settlement
// (npcGenerator.js :: generateRelationships) and passes the drawn index as the third argument;
// the tie stores it as `proseVariant`, so a re-render (refreshRelationshipProjections) keeps the
// same line under new names. With no index (a legacy edge, a seedless caller) the closure falls
// back to the pure fnv hash of the DIRECTED pair key, salted per field. ZERO rng draws either
// way, and the archetype OBJECTS are unchanged (consumers compare them with === and
// Object.entries().find: identity is load-bearing). `size` hands the pool length to the draw.
// Index 0 of every pool is the pre-existing canonical closure, verbatim.
const pairProse = (salt, variants) => Object.assign((r, s, variant) => (isTieIndex(variant) ? variants[variant % variants.length]
  : pickVariant(variants, `${r?.name ?? ''}>${s?.name ?? ''}::${salt}`))(r, s), { size: variants.length });
/** A drawn tie index is a non-negative integer; anything else takes the pair-hash fallback. */
const isTieIndex = variant => Number.isInteger(variant) && variant >= 0;

export const STRESS_ECONOMIC_EFFECTS = {
  econ_crim_blur: {
    label: 'Commercial Complicity',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name} and ${s.name} maintain a relationship that exists in legal grey territory. ${r.name} provides legitimate cover, ${s.name} ensures market access that official channels wouldn't permit.`,
      (r, s) =>
        `The books of ${r.name} are clean because ${s.name} keeps certain entries off them; the arrangement benefits both parties and would survive scrutiny by neither.`,
      (r, s) =>
        `What ${r.name} sells is respectability, and ${s.name} is a steady customer. Goods move through channels no inspector has thought to draw on a map.`,
      (r, s) =>
        `${r.name} signs the import papers and ${s.name} decides what is actually in the crates. The warehouse keeps two inventories, and only one is shown to the customs house.`,
      (r, s) =>
        `${s.name}'s money buys ${r.name}'s stock at full price and sells it back through stalls that pay no market dues. Both of them call it a partnership.`,
      (r, s) =>
        `${r.name}'s shop front is real, the trade is real, and a third of the coin that passes through it belongs to ${s.name}.`,
      (r, s) =>
        `${r.name} vouches for ${s.name}'s people at the guild hall. In return, ${s.name}'s people keep ${r.name}'s carts moving on roads where other carts are stopped.`,
      (r, s) =>
        `${r.name} holds the licence, ${s.name} supplies the goods, and the profit is split in a back room on the first of every month.`,
    ]),
    tension: pairProse('t', [
      (r, s) => 'If either is investigated, the other is implicated. Both know this. Neither mentions it.',
      (r, s) => 'A clerk has begun cross-referencing the ledgers. Neither party has decided what to do about it.',
      (r, s) => `One profitable season more, ${r.name} keeps saying. The seasons keep being profitable.`,
      (r, s) =>
        `${s.name} wants to move a larger cargo through ${r.name}'s warehouse next month. ${r.name} has not agreed and has not refused.`,
      (r, s) =>
        `A customs officer has asked ${r.name} for the names of every supplier. ${s.name}'s name is missing from the list, and the officer has noticed the gap.`,
      (r, s) =>
        `${r.name} has started paying off the guild debts that tied the two of them together. ${s.name} reads it as a plan to leave.`,
      (r, s) =>
        `${s.name} has been seen at ${r.name}'s counting-house in daylight. That was never part of the arrangement.`,
      (r, s) => `${r.name}'s eldest has found the second ledger and asked what ${s.name}'s initials mean.`,
    ]),
    type: 'patron_client',
  },
  econ_crim_exploitation: {
    label: 'Protection Arrangement',
    desc: pairProse('d', [
      (r, s) =>
        `${s.name}'s operation charges ${r.name} a "security fee" that is, in practice, a protection racket. ${r.name} pays without complaint because the alternative is worse.`,
      (r, s) =>
        `Every month ${r.name} pays ${s.name} for protection against dangers that would, on inspection, trace back to ${s.name}. Both sides account for it as a cost of doing business.`,
      (r, s) =>
        `The "security fee" ${s.name} collects from ${r.name} buys exactly one thing: the absence of ${s.name}. It is paid punctually.`,
      (r, s) =>
        `${r.name} pays ${s.name} a tenth of every sale. The one season ${r.name} paid late, a storehouse burned.`,
      (r, s) =>
        `${s.name}'s collectors visit ${r.name} on the same day each month and leave with a sealed purse. Nobody in the street watches them go.`,
      (r, s) =>
        `${r.name} owes ${s.name} for protection that was never asked for and cannot be cancelled. The debt is renewed in person, at the door.`,
      (r, s) =>
        `${s.name} sets the fee, ${r.name} pays it, and the price goes on every customer's bill without a line of its own.`,
      (r, s) =>
        `${r.name}'s premises are the only ones on the row that have never been robbed. ${s.name} reminds ${r.name} of this when the fee is due.`,
    ]),
    tension: pairProse('t', [
      (r, s) => `${r.name} is quietly documenting every payment. Someone is being prepared for a fall.`,
      (r, s) => `The fee went up this quarter without explanation. ${r.name}'s patience is a finite ledger.`,
      (r, s) => `A rival crew has offered ${r.name} a better rate. Accepting would be a declaration of war on ${s.name}.`,
      (r, s) => `${r.name} has hired two guards of their own. ${s.name} has asked, politely, what they are for.`,
      (r, s) =>
        `${s.name} wants a cut of ${r.name}'s new venture before it opens. The fee was never meant to grow with the business.`,
      (r, s) =>
        `${r.name} missed this month's payment by three days. ${s.name} has not sent anyone yet, and that is worse.`,
      (r, s) =>
        `${r.name} has written to the magistrate about ${s.name}'s collectors. The letter sits unsent in ${r.name}'s desk.`,
      (r, s) =>
        `${s.name}'s collector was found drunk with ${r.name}'s purse still sealed. Someone will have to explain the delay to ${s.name}.`,
    ]),
    type: 'debtor_creditor',
  },
  mil_crim_corruption: {
    label: 'Corrupt Arrangement',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name} receives regular payments from ${s.name}'s organization in exchange for patrol schedules and advance notice of raids. Both maintain professional courtesy in public.`,
      (r, s) =>
        `${s.name}'s operation runs on a schedule ${r.name} provides: patrols that turn a street early, raids announced a day in advance. In public the two exchange formal nods.`,
      (r, s) =>
        `${r.name}'s clearance record looks respectable because ${s.name} decides which crimes get cleared. The price of the arrangement is itemised and paid on time.`,
      (r, s) =>
        `${r.name} takes ${s.name}'s silver every quarter day and keeps certain doors unwatched in return. Each treats the other as a reliable colleague.`,
      (r, s) =>
        `${s.name}'s people are never searched on ${r.name}'s watch. The arrangement is three years old and has never been put in writing.`,
      (r, s) =>
        `${r.name} warns ${s.name} before every raid and arrests the competitors ${s.name} names. The watch reports show a fine record of arrests.`,
      (r, s) =>
        `When ${s.name}'s crew needs a prisoner released, ${r.name} signs the order. When ${r.name} needs an arrest, ${s.name} supplies the culprit.`,
      (r, s) =>
        `${r.name} commands the patrols and ${s.name} pays for their routes. The streets ${s.name} uses are the quietest in the settlement.`,
    ]),
    tension: pairProse('t', [
      (r, s) =>
        'A new superior has started asking uncomfortable questions about clearance rates. One of them will have to act before the other does.',
      (r, s) => `An honest sergeant has been transferred into ${r.name}'s command. Both parties consider this a problem.`,
      (r, s) => 'The payments have started arriving late. In this trade, late is a message.',
      (r, s) =>
        `${r.name} was promoted last month, and ${s.name} expects the price of silence to stay the same. ${r.name} does not.`,
      (r, s) =>
        `One of ${s.name}'s runners was arrested by a patrol ${r.name} did not assign. The runner knows both their names.`,
      (r, s) =>
        `${s.name} has asked ${r.name} to lose a piece of evidence that three other officers have already seen.`,
      (r, s) =>
        `${r.name}'s quarter-day payment from ${s.name} arrived with a name attached: someone ${s.name} wants arrested.`,
      (r, s) =>
        `An auditor from the garrison is counting ${r.name}'s arrest records against the coin in ${r.name}'s house. ${s.name} is watching the count.`,
    ]),
    type: 'ally',
  },
  mil_crim_suppression: {
    label: 'Active Suppression',
    desc: pairProse('d', [
      (r, s) => `${r.name} has made dismantling ${s.name}'s operation a personal priority. The feeling is mutual.`,
      (r, s) => `${r.name} keeps a file on ${s.name}'s operation that grows by the week; ${s.name} keeps one on ${r.name} that is already complete.`,
      (r, s) => `The war between ${r.name} and ${s.name} is fought in raids, informants, and paperwork. Neither side counts it as winnable; neither will stop.`,
      (r, s) => `${r.name} has closed three of ${s.name}'s houses this year. ${s.name} has opened four.`,
      (r, s) =>
        `${r.name} wants ${s.name} in a cell and has said so before the council. ${s.name} has answered by paying two of ${r.name}'s informants.`,
      (r, s) =>
        `${s.name}'s people know ${r.name}'s patrol routes by heart, and ${r.name}'s people know which taverns ${s.name} uses. Neither side has made the arrest that counts.`,
      (r, s) =>
        `${r.name} and ${s.name} are open enemies. Every raid ${r.name} orders costs ${s.name} money, and every month ${s.name} survives costs ${r.name} standing.`,
      (r, s) =>
        `${r.name} hunts ${s.name}'s operation street by street, and ${s.name} moves it one street ahead. The chase has lasted two winters.`,
    ]),
    tension: pairProse('t', [
      (r, s) => `${s.name} has leverage on someone close to ${r.name}. It hasn't been used yet.`,
      (r, s) => `${r.name} is one warrant away from a raid that would end it. The warrant keeps not being signed.`,
      (r, s) => `Someone in ${r.name}'s command reports to ${s.name}. The file says so; it does not say who.`,
      (r, s) =>
        `${r.name} has a witness willing to name ${s.name} before a magistrate. ${s.name} knows where the witness lives.`,
      (r, s) =>
        `${s.name} has offered ${r.name} a truce and a purse. ${r.name} has not answered, which ${s.name} counts as progress.`,
      (r, s) =>
        `${r.name}'s best informant inside ${s.name}'s crew has stopped reporting. Nobody has seen the informant for nine days.`,
      (r, s) =>
        `${s.name} has hired an advocate to sue ${r.name} over the last raid. The case comes before the council this season.`,
      (r, s) =>
        `${r.name} has been ordered to stand down against ${s.name} by someone above ${r.name}. The order did not say why.`,
    ]),
    type: 'enemy',
  },
  econ_mil_contract: {
    label: 'Security Contract',
    desc: pairProse('d', [
      (r, s) =>
        `${s.name}'s company is retained by ${r.name}'s interests on an exclusive basis. The arrangement works well enough that official channels have stopped asking questions.`,
      (r, s) =>
        `${r.name} pays ${s.name}'s company well and exclusively, and in return certain cargoes move unescorted and uninspected. The arrangement predates every official who might question it.`,
      (r, s) =>
        `The contract between ${r.name} and ${s.name} is renewed annually with a handshake; what it actually covers has never been written down anywhere.`,
      (r, s) =>
        `${s.name}'s company guards ${r.name}'s warehouses and wagons for a fixed fee each season. ${r.name} pays on time and asks for nothing in writing.`,
      (r, s) =>
        `${r.name} is ${s.name}'s largest client and ${s.name} is ${r.name}'s only protection. Each would be badly hurt by losing the other.`,
      (r, s) =>
        `${s.name}'s soldiers wear ${r.name}'s colours on the road and take ${r.name}'s orders without question. No magistrate has a say over them.`,
      (r, s) =>
        `${r.name} hired ${s.name}'s company after the last caravan was lost. No caravan has been lost since, and ${s.name}'s fee has doubled.`,
      (r, s) =>
        `${s.name} answers to ${r.name}'s purse before any other authority. Everyone in the settlement knows which way ${s.name}'s company would march.`,
    ]),
    tension: pairProse('t', [
      (r, s) =>
        `The contract is up for renewal. ${s.name} has been approached by a competitor. ${r.name} doesn't know yet.`,
      (r, s) => `${s.name}'s men have started asking what exactly they are guarding. ${r.name} prefers them incurious.`,
      (r, s) => 'The last shipment was short, and each side privately blames the other. The next one will settle the question.',
      (r, s) =>
        `${r.name} has cut ${s.name}'s fee by a fifth. ${s.name}'s company still guards the wagons, but more slowly.`,
      (r, s) => `${s.name}'s company has taken on a second client, and ${r.name} has learned the client's name.`,
      (r, s) =>
        `A guard from ${s.name}'s company was killed protecting ${r.name}'s cargo. ${s.name} wants compensation the contract does not mention.`,
      (r, s) =>
        `The council wants ${s.name}'s company under the watch's command. ${r.name} loses the contract's whole value if it agrees.`,
      (r, s) => `${r.name} has asked ${s.name} to escort a cargo with no manifest. ${s.name} has named a price.`,
    ]),
    type: 'patron_client',
  },
  rel_mil_crusader: {
    label: 'Sacred Commission',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name} and ${s.name} operate as a unified authority: temporal and spiritual power reinforcing each other. Dissent against one is dissent against both.`,
      (r, s) =>
        `Between ${r.name}'s pulpit and ${s.name}'s garrison, the settlement is governed twice over; the sermons and the patrol routes have a way of agreeing.`,
      (r, s) =>
        `${r.name} blesses what ${s.name} enforces, and ${s.name} enforces what ${r.name} blesses. Where one authority ends and the other begins is a question neither permits.`,
      (r, s) =>
        `${r.name} preaches the cause and ${s.name} raises the men. The shrine's coffers pay for the garrison's swords.`,
      (r, s) =>
        `${s.name}'s soldiers take their oaths before ${r.name}'s altar. To ${r.name}'s faithful, ${s.name}'s orders carry the weight of scripture.`,
      (r, s) =>
        `${r.name} names the settlement's enemies from the pulpit, and ${s.name} rides against them within the week.`,
      (r, s) =>
        `${r.name} and ${s.name} hold the settlement between faith and force. The two of them meet after every service to agree the week's orders.`,
      (r, s) =>
        `${s.name} carries ${r.name}'s banner on every patrol. Crossing ${s.name} is treated as heresy, and heresy is punished by ${s.name}.`,
    ]),
    tension: pairProse('t', [
      (r, s) => 'They disagree on a fundamental question of method that neither will put into writing.',
      (r, s) => 'A penitent has brought a case that pits doctrine against order. It has not been resolved. It will not stay private.',
      (r, s) => `The crowd that obeys them both has begun to notice it is one crowd. So has ${s.name}.`,
      (r, s) =>
        `${r.name} has declared a holy day on which no soldier may bear arms. ${s.name} has a patrol scheduled for it.`,
      (r, s) =>
        `${s.name}'s men have started praying at a different shrine. ${r.name} counts the empty places at every service.`,
      (r, s) =>
        `${r.name} wants an armed march against a rival sect. ${s.name} has counted the cost in men and wants to wait a year.`,
      (r, s) =>
        `A soldier under ${s.name} stands accused of sacrilege. ${r.name} demands a church trial; ${s.name} wants a court-martial.`,
      (r, s) => `${s.name} has started giving orders in the name of the faith without consulting ${r.name}.`,
    ]),
    type: 'ally',
  },
  rel_crim_fraud: {
    label: 'Institutional Cover',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name}'s religious position provides ${s.name}'s operation with legitimacy, meeting spaces, and an excuse for financial flows that would otherwise attract scrutiny.`,
      (r, s) =>
        `${s.name}'s money passes through ${r.name}'s offertory and comes out consecrated; the meeting rooms are sanctified, the accounts are not examined.`,
      (r, s) =>
        `${r.name} provides the sanctity, ${s.name} provides the income, and the congregation provides the cover (unknowingly), which is what makes it work.`,
      (r, s) =>
        `${s.name}'s crew meets in the crypt beneath ${r.name}'s shrine after evening prayers. ${r.name} keeps the only key.`,
      (r, s) =>
        `${r.name} records ${s.name}'s payments as gifts from a pious donor. The donor has never attended a service.`,
      (r, s) =>
        `${s.name} funds ${r.name}'s alms, and ${r.name} vouches for ${s.name}'s good character to anyone who asks. Both are paid in the same coin.`,
      (r, s) =>
        `${r.name}'s charity runs the soup kitchen, and ${s.name}'s couriers collect their parcels from the kitchen's back door.`,
      (r, s) =>
        `${r.name} hears ${s.name}'s confession each week and keeps ${s.name}'s accounts each month. Neither duty is written down.`,
    ]),
    tension: pairProse('t', [
      (r, s) => `${r.name} has a genuine crisis of conscience that ${s.name} is not prepared to accommodate.`,
      (r, s) => `A visiting cleric has asked to audit the shrine's books. ${s.name} has offered to handle it.`,
      (r, s) => `${r.name} has started keeping a second set of records. Confession, of a kind.`,
      (r, s) =>
        `A member of ${r.name}'s congregation saw ${s.name}'s men carrying crates out of the shrine at night, and has asked ${r.name} about it twice.`,
      (r, s) =>
        `${s.name} wants to store weapons beneath ${r.name}'s altar. ${r.name} has refused once and been asked again.`,
      (r, s) =>
        `${r.name}'s superior is coming to inspect the shrine's accounts. ${s.name}'s gifts make up half the income.`,
      (r, s) => `${r.name} preached a sermon on theft last week. ${s.name} took it personally.`,
      (r, s) =>
        `${s.name} has asked ${r.name} to marry two of the crew under false names. ${r.name} has not set a date.`,
    ]),
    type: 'ally',
  },
  mag_crim_market: {
    label: 'Arcane Supplier',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name} provides ${s.name}'s network with components, identification services, and the occasional forged document that only a skilled practitioner could produce.`,
      (r, s) =>
        `When ${s.name}'s network needs a seal copied, a face forgotten, or a document aged thirty years, the work arrives through ${r.name} and is never signed.`,
      (r, s) =>
        `${r.name} takes commissions from ${s.name} that no guild register records: small workings, expertly done, each one deniable and none of them innocent.`,
      (r, s) =>
        `${r.name} brews what ${s.name} sells: sleeping draughts, truth-tinctures, and inks that vanish after a day.`,
      (r, s) =>
        `${s.name} brings ${r.name} the jobs and the payment, and ${r.name} asks no questions about who the work is for.`,
      (r, s) => `${r.name}'s workshop has a back door, and ${s.name}'s couriers are the only ones who use it.`,
      (r, s) =>
        `${r.name} supplies ${s.name}'s network with wards against detection. Each ward is sold at triple the guild price.`,
      (r, s) =>
        `${s.name} pays ${r.name} a retainer to be ready at any hour. Twice this year, ${r.name} has been called out before dawn.`,
    ]),
    tension: pairProse('t', [
      (r, s) =>
        `The last commission left traces that a determined investigator might find. ${r.name} is reconsidering the relationship.`,
      (r, s) => `${s.name} has begun asking for workings of a different order: the kind with witnesses. ${r.name} has not yet said no.`,
      (r, s) => `Another practitioner has noticed ${r.name}'s signature in the residue. Professional courtesy has limits.`,
      (r, s) =>
        `${r.name}'s apprentice has started asking where the night commissions go. ${s.name} has noticed the apprentice.`,
      (r, s) => `${s.name} owes ${r.name} for three months of work and has offered information instead of coin.`,
      (r, s) =>
        `A ward ${r.name} made for ${s.name} failed during a robbery. ${s.name} blames the ward; ${r.name} blames the thief.`,
      (r, s) =>
        `The guild has summoned ${r.name} to explain a shortfall in licensed components. ${s.name}'s orders account for the missing stock.`,
      (r, s) =>
        `${r.name} has been offered a guild post that requires a clean record. ${s.name} has a list of everything ${r.name} has made.`,
    ]),
    type: 'patron_client',
  },
  gov_econ_dependence: {
    label: 'Financial Dependence',
    desc: pairProse('d', [
      (r, s) =>
        `The settlement's civic functions run on credit extended by ${s.name}. ${r.name} cannot take any action that seriously threatens ${s.name}'s interests, and ${s.name} does not let this be forgotten.`,
      (r, s) =>
        `${s.name} holds the settlement's debts and therefore, in every way that matters, its agenda; ${r.name} governs within the margin ${s.name} allows.`,
      (r, s) =>
        `Every civic project ${r.name} announces has first been costed, quietly, in ${s.name}'s counting-room. The public believes the order is the other way around.`,
      (r, s) =>
        `${r.name}'s treasury borrowed from ${s.name} to cover a bad harvest and has borrowed every year since. The interest is paid before the wages.`,
      (r, s) =>
        `${s.name} holds the settlement's tax rolls as security for its loans. ${r.name} cannot raise a levy without ${s.name}'s clerks counting it first.`,
      (r, s) =>
        `${r.name} owes ${s.name} more than the settlement collects in two years of taxes. ${s.name} is paid first, every quarter.`,
      (r, s) =>
        `${s.name} lends and ${r.name} spends. The council's decisions are made in ${r.name}'s chamber and approved in ${s.name}'s counting-house.`,
      (r, s) => `${r.name} governs on ${s.name}'s credit. Every loan renewed adds one more condition to the next.`,
    ]),
    tension: pairProse('t', [
      (r, s) => `${r.name} has identified an alternative creditor. ${s.name} has heard the same rumour.`,
      (r, s) => `The interest falls due at midsummer and the treasury will not cover it. ${s.name} has already drafted the terms of the extension.`,
      (r, s) => `A faction on the council wants the debt repudiated outright. ${r.name} has stopped disagreeing in public.`,
      (r, s) =>
        `${s.name} has asked for a seat on the council as a condition of the next loan. ${r.name} has three weeks to answer.`,
      (r, s) =>
        `${r.name} has proposed a new tax to clear the debt. ${s.name}'s friends on the council will vote against it.`,
      (r, s) =>
        `${s.name} is calling in a third of the debt at once. ${r.name} has until the next quarter day to find it.`,
      (r, s) =>
        `${r.name} has started borrowing small sums from ${s.name}'s rivals. ${s.name}'s clerks have seen the receipts.`,
      (r, s) =>
        `${s.name} has refused credit for the winter grain stores. ${r.name} must choose between the creditor and the granary.`,
    ]),
    type: 'debtor_creditor',
  },
  gov_mil_friction: {
    label: 'Jurisdictional Tension',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name} and ${s.name} disagree fundamentally about where civil authority ends and military authority begins. The argument has been running for years and occasionally generates paperwork.`,
      (r, s) =>
        `${r.name} issues orders ${s.name} regards as suggestions, and ${s.name} takes actions ${r.name} regards as insubordination; the settlement runs in the gap between.`,
      (r, s) =>
        `The line between ${r.name}'s authority and ${s.name}'s has been redrawn four times and honoured never. Each keeps the map that favours them.`,
      (r, s) =>
        `${r.name} controls the garrison's pay and ${s.name} controls its swords. Each uses their half to bargain for the other's.`,
      (r, s) =>
        `${s.name} reports to ${r.name} on paper and to no one in practice. ${r.name} has three letters of complaint unanswered.`,
      (r, s) =>
        `${r.name} wants the watch under civil command; ${s.name} wants the council out of the barracks. They meet monthly and settle nothing.`,
      (r, s) =>
        `${r.name} sets the curfew and ${s.name} decides whether to enforce it. The two have not agreed on a curfew in a year.`,
      (r, s) =>
        `${s.name} answers ${r.name}'s summons late and leaves early. ${r.name} now issues them in writing so the delays are on record.`,
    ]),
    tension: pairProse('t', [
      (r, s) => 'An incident is coming that will force the issue. Both are positioning for it.',
      (r, s) => 'A prisoner is currently held by both jurisdictions at once. Neither will release the paperwork first.',
      (r, s) => `${s.name} has begun drilling in the square without asking. ${r.name} has begun writing letters to the capital.`,
      (r, s) =>
        `${r.name} has cut the garrison's pay to fund the market repairs. ${s.name} has told the soldiers who signed the order.`,
      (r, s) =>
        `${s.name} arrested a councillor's son without ${r.name}'s warrant. ${r.name} has demanded his release by tomorrow.`,
      (r, s) =>
        `${r.name} has asked the capital to replace ${s.name}. ${s.name} has asked the capital to dissolve ${r.name}'s council.`,
      (r, s) =>
        `A riot is expected on the next market day, and ${r.name} and ${s.name} have issued opposite orders for it.`,
      (r, s) =>
        `${s.name} has begun collecting a road toll for the garrison. ${r.name} calls it theft from the treasury.`,
    ]),
    type: 'political',
  },
  peer_rivalry: {
    label: 'Professional Rivalry',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name} and ${s.name} compete for the same resource, position, or reputation. The competition is vigorous but bounded. Neither has crossed the line into genuine enmity. Yet.`,
      (r, s) =>
        `${r.name} and ${s.name} want the same thing and cannot both have it. The contest is conducted with scrupulous courtesy and total commitment.`,
      (r, s) =>
        `Every advance ${r.name} makes is answered by ${s.name} within the season; the rivalry has become its own institution, with rules neither wrote and both obey.`,
      (r, s) =>
        `${r.name} and ${s.name} bid for the same contracts and sit at the same tables. Each counts the other's wins more carefully than their own.`,
      (r, s) =>
        `${r.name} and ${s.name} trained together and have competed ever since. The settlement keeps score, and so do they.`,
      (r, s) =>
        `${r.name} wants ${s.name}'s position, and ${s.name} wants ${r.name}'s reputation. They are civil in public and unforgiving in private.`,
      (r, s) =>
        `Every client ${r.name} wins is one ${s.name} lost, and the reverse. The two keep a polite distance and an exact tally.`,
      (r, s) =>
        `${r.name} and ${s.name} are rivals for the same patron's favour. Each has spent the year trying to be first through the patron's door.`,
    ]),
    tension: pairProse('t', [
      (r, s) => 'A decision coming in the next season will advantage one significantly. The other knows this.',
      (r, s) => 'A mutual patron has let it be known there is room for only one of them at the next table.',
      (r, s) => 'One of them has recently broken an unwritten rule of the contest. The other is deciding what that permits.',
      (r, s) => `${r.name} has hired away ${s.name}'s best assistant. ${s.name} has said nothing about it, to anyone.`,
      (r, s) => `A post opens at midsummer, and only ${r.name} or ${s.name} can fill it.`,
      (r, s) =>
        `${s.name} has been telling clients that ${r.name}'s work is slipping. Two of the clients have repeated it to ${r.name}.`,
      (r, s) =>
        `${r.name} and ${s.name} will both present proposals at the next council session. Only one will be accepted.`,
      (r, s) => `${r.name} lost the last contract to ${s.name} by a single vote, and has learned who cast it.`,
    ]),
    type: 'rival',
  },
  mentor_legacy: {
    label: 'Mentor and Successor',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name} shaped ${s.name}'s career in ways that ${s.name} has not fully acknowledged. The debt is real; the gratitude is complicated.`,
      (r, s) =>
        `${s.name} stands where ${r.name} put them, by a ladder ${r.name} built and ${s.name} has since pulled up. Both remember it differently.`,
      (r, s) =>
        `What ${s.name} knows, ${r.name} taught (including, inconveniently, how to outmanoeuvre a teacher).`,
      (r, s) =>
        `${r.name} took ${s.name} in as an apprentice and taught them the trade, the clients, and the names worth knowing.`,
      (r, s) =>
        `${s.name} learned the work at ${r.name}'s side for seven years. Half of ${s.name}'s clients first came through ${r.name}'s door.`,
      (r, s) => `${r.name} vouched for ${s.name} when nobody else would. ${s.name}'s first post came from that word.`,
      (r, s) =>
        `${s.name} still uses ${r.name}'s methods and ${r.name}'s ledger format. Everyone who sees ${s.name}'s work recognises the teacher.`,
      (r, s) => `${r.name} named ${s.name} as successor in front of witnesses. The formal handover has not happened.`,
    ]),
    tension: pairProse('t', [
      (r, s) =>
        `${s.name} now operates in ways ${r.name} would not approve of. Neither discusses the divergence directly.`,
      (r, s) => `${r.name} has one favour left to call in, and is saving it. ${s.name} knows, and is watching for it.`,
      (r, s) => `A third party has asked ${r.name}, quietly, whether ${s.name} can be trusted. The answer took too long.`,
      (r, s) => `${s.name} has taken on a client ${r.name} turned away on principle.`,
      (r, s) =>
        `${r.name} has taken a new apprentice, and ${s.name} has heard the apprentice is being taught things ${s.name} never was.`,
      (r, s) => `${s.name} corrected ${r.name} in public last month, and was right.`,
      (r, s) =>
        `${r.name} has asked ${s.name} for a loan. It is the first time a debt between teacher and student has run that way.`,
      (r, s) => `${s.name} has begun teaching ${r.name}'s methods as ${s.name}'s own.`,
    ]),
    type: 'mentor_student',
  },
  mutual_leverage: {
    label: 'Mutual Leverage',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name} and ${s.name} each hold information or resources the other needs. They cooperate efficiently and neither trusts the other at all.`,
      (r, s) =>
        `What ${r.name} knows would ruin ${s.name}; what ${s.name} holds would finish ${r.name}. On this foundation they have built an excellent working relationship.`,
      (r, s) =>
        `${r.name} and ${s.name} deal with each other like men carrying lit lanterns in a powder store, carefully, and with great mutual politeness.`,
      (r, s) =>
        `${r.name} and ${s.name} trade favours on a strict count. Neither has ever been more than one favour ahead.`,
      (r, s) =>
        `${r.name} controls a vote ${s.name} needs, and ${s.name} controls a supply ${r.name} needs. Their meetings are short and their bargains hold.`,
      (r, s) =>
        `${r.name} and ${s.name} each have something to trade and nothing to give away. They meet in private, bargain hard, and keep every bargain.`,
      (r, s) =>
        `${s.name} needs ${r.name}'s seal on certain papers; ${r.name} needs ${s.name}'s silence about certain others. Neither has asked for more than the other could pay.`,
      (r, s) =>
        `${r.name} and ${s.name} sit on opposite sides of most questions and vote together on the few that touch their shared interests.`,
    ]),
    tension: pairProse('t', [
      (r, s) => "The balance of leverage has recently shifted. One party has noticed; the other hasn't yet.",
      (r, s) => 'A document each believed only they possessed has surfaced in a third set of hands.',
      (r, s) => `${s.name} has recently secured something that makes ${r.name}'s hold obsolete. The politeness continues, for now.`,
      (r, s) => `${r.name} has asked ${s.name} for a second favour before repaying the first.`,
      (r, s) => `${s.name} has found a new source for what ${r.name} supplies. ${r.name} has not been told.`,
      (r, s) => `The vote ${s.name} needs from ${r.name} comes up next week, and ${r.name} has named a new price.`,
      (r, s) =>
        `${r.name}'s secret is about to come out by other means. Once it does, ${s.name} holds nothing over ${r.name}.`,
      (r, s) => `${s.name} has written down what ${r.name} owes and left a copy with a notary.`,
    ]),
    type: 'political',
  },
  wary_alliance: {
    label: 'Pragmatic Alliance',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name} and ${s.name} work together because the alternative (working against each other) is worse for both. The alliance holds as long as the calculation holds.`,
      (r, s) =>
        `${r.name} and ${s.name} are allies by arithmetic: each has counted the cost of the other as an enemy and found it too high. The friendship is warm, public, and entirely conditional.`,
      (r, s) =>
        `The alliance between ${r.name} and ${s.name} was born of a shared threat and has outlived it; both are quietly recalculating what it is now for.`,
      (r, s) => `${r.name} and ${s.name} share a council bloc and a list of enemies. They do not share their plans.`,
      (r, s) => `${r.name} and ${s.name} back each other in public and check each other's work in private.`,
      (r, s) =>
        `${r.name} brings the votes and ${s.name} brings the money. The alliance is three years old and has won every vote it needed.`,
      (r, s) =>
        `${r.name} and ${s.name} signed a pact after their last quarrel cost them both. They keep to its terms exactly.`,
      (r, s) =>
        `${r.name} and ${s.name} are allies with separate interests. They meet to coordinate and leave by different doors.`,
    ]),
    tension: pairProse('t', [
      (r, s) => 'A third party is actively working to change that calculation.',
      (r, s) => 'The threat that made the alliance necessary is gone. Neither has said so aloud.',
      (r, s) => `${r.name} has taken a precaution against ${s.name} that ${s.name} was not meant to discover. ${s.name} has discovered it.`,
      (r, s) => `${s.name} has been dining with ${r.name}'s rivals. ${r.name} heard about it from a servant.`,
      (r, s) =>
        `${r.name} wants to bring a third member into the alliance. ${s.name} thinks the newcomer would take ${s.name}'s place.`,
      (r, s) =>
        `${s.name} voted against ${r.name} on a small matter last week. ${r.name} is waiting to see whether it was small.`,
      (r, s) =>
        `${r.name} and ${s.name} both want the same office, and the alliance cannot survive one of them winning it.`,
      (r, s) =>
        `${s.name} has asked ${r.name} to back a candidate ${r.name} distrusts. Refusing would cost the alliance its majority.`,
    ]),
    type: 'ally',
  },
  genuine_respect: {
    label: 'Genuine Respect',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name} and ${s.name} have earned each other's regard through demonstrated competence. They don't agree on everything but they trust each other's judgment within their respective domains.`,
      (r, s) =>
        `${r.name} and ${s.name} disagree often and trust completely. Each has watched the other be right at cost, and neither forgets it.`,
      (r, s) =>
        `There is no arrangement between ${r.name} and ${s.name}, only a long record of kept words; in this settlement that makes them remarkable.`,
      (r, s) =>
        `${r.name} sends difficult cases to ${s.name}, and ${s.name} sends them back solved. Neither has ever charged the other a fee.`,
      (r, s) =>
        `${r.name} and ${s.name} have stood on opposite sides of three disputes and praised each other after every one.`,
      (r, s) =>
        `${s.name} once told the council that ${r.name} was right and ${s.name} was wrong. ${r.name} has not forgotten it.`,
      (r, s) =>
        `${r.name} and ${s.name} consult each other before any decision that matters. The advice is honest and is always taken seriously.`,
      (r, s) =>
        `${r.name} trusts ${s.name}'s word over any written contract. ${s.name} has never given a reason to regret it.`,
    ]),
    tension: pairProse('t', [
      (r, s) => 'They are about to be on opposite sides of a significant decision.',
      (r, s) => 'One of them is being pressured to act against the other, and has not yet mentioned it.',
      (r, s) => 'The respect is real and the interests are diverging. Both can read a map.',
      (r, s) => `${r.name} has learned something about ${s.name}'s family that ${s.name} does not know.`,
      (r, s) => `${s.name} has been offered ${r.name}'s post by people who want ${r.name} gone.`,
      (r, s) => `${r.name} has made a mistake that ${s.name} is bound to report. ${s.name} has not reported it.`,
      (r, s) =>
        `The council has asked ${r.name} and ${s.name} to audit each other's accounts. Both agreed, and neither is comfortable.`,
      (r, s) =>
        `${s.name} has publicly backed a plan that ${r.name} thinks will fail. ${r.name} has said so once, in private.`,
    ]),
    type: 'respect',
  },
  old_debt: {
    label: 'Outstanding Debt',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name} owes ${s.name} something significant: a favour, a secret kept, a crisis managed. The debt has never been formally acknowledged. It doesn't need to be.`,
      (r, s) =>
        `Years ago ${s.name} did for ${r.name} the kind of favour that cannot be repaid, only serviced. ${r.name} has been servicing it ever since.`,
      (r, s) =>
        `Between ${r.name} and ${s.name} stands an old kindness with the structure of a mortgage. Neither names it; both know the balance to the penny.`,
      (r, s) =>
        `${s.name} paid ${r.name}'s bail eleven years ago and has never mentioned it. ${r.name} mentions it to no one.`,
      (r, s) =>
        `${r.name} owes ${s.name} a large sum in coin, borrowed in a bad year and repaid in small amounts ever since.`,
      (r, s) =>
        `${s.name} kept ${r.name}'s name out of a scandal that ruined two others. ${r.name} has voted with ${s.name} ever since.`,
      (r, s) =>
        `${s.name} nursed ${r.name} through a winter fever when no one else would come. ${r.name} still owes the debt and still knows it.`,
      (r, s) => `${r.name} borrowed ${s.name}'s good name to win a post. ${s.name} has never asked for it back.`,
    ]),
    tension: pairProse('t', [
      (r, s) => `${s.name} is about to call it in.`,
      (r, s) => `${r.name} has begun to act like someone who considers the debt paid. ${s.name} does not.`,
      (r, s) => 'A third party has learned what the original favour was. The debt just changed hands.',
      (r, s) =>
        `${s.name} has asked ${r.name} for a vote against ${r.name}'s own interests. It is the first payment ${s.name} has asked for.`,
      (r, s) => `${r.name} has started repaying the debt in coin. ${s.name} wants it repaid in favours.`,
      (r, s) => `${s.name} has mentioned the debt aloud, at a dinner, in front of ${r.name}'s partners.`,
      (r, s) => `${r.name} has refused ${s.name} a small favour for the first time in years.`,
      (r, s) => `${s.name} has fallen on hard times, and the debt ${r.name} owes is now the only asset ${s.name} has.`,
    ]),
    type: 'debtor_creditor',
  },
  family_complication: {
    label: 'Family Complication',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name} and ${s.name} are connected by blood or marriage in a way that neither finds professionally convenient. The connection is known; its implications are not discussed.`,
      (r, s) =>
        `Blood ties ${r.name} to ${s.name} in a way that neither career can afford; they meet at funerals and weddings and pretend the rest of the year does not exist.`,
      (r, s) =>
        `${r.name} and ${s.name} share a family and avoid sharing anything else; every professional dealing between them is conducted as though the relation were a rumour.`,
      (r, s) =>
        `${r.name} married into ${s.name}'s family. ${s.name} opposed the match and still calls ${r.name} by surname.`,
      (r, s) =>
        `${r.name} and ${s.name} are cousins on opposite sides of the settlement's politics. Their grandmother still seats them together.`,
      (r, s) => `${s.name} is ${r.name}'s half-sibling, raised in the same house and left out of the same will.`,
      (r, s) =>
        `${r.name} and ${s.name} are in-laws. They are polite at family dinners and avoid each other everywhere else.`,
      (r, s) =>
        `${r.name} is godparent to ${s.name}'s eldest child. The tie was made before their careers set them against each other.`,
    ]),
    tension: pairProse('t', [
      (r, s) => 'An inheritance, title, or secret is about to make the connection impossible to ignore.',
      (r, s) => 'A younger relative has begun trading on the connection both of them refuse to use.',
      (r, s) => 'The family has taken a side in a dispute between them. It is the wrong side, in both their opinions.',
      (r, s) => `${r.name}'s child wants to marry into ${s.name}'s household. Neither parent has given an answer.`,
      (r, s) =>
        `${s.name} has gone into business against ${r.name}'s partners, and the family expects ${r.name} to keep the peace.`,
      (r, s) =>
        `A family property must be sold, and ${r.name} and ${s.name} each want the money for a different purpose.`,
      (r, s) =>
        `${r.name}'s rivals have learned that ${s.name} is family, and have started asking ${s.name} questions.`,
      (r, s) =>
        `The family has asked ${r.name} and ${s.name} to end their quarrel before the next feast. Neither will apologise first.`,
    ]),
    type: 'family',
  },
  bitter_history: {
    label: 'Unresolved History',
    desc: pairProse('d', [
      (r, s) =>
        `Something happened between ${r.name} and ${s.name} years ago that neither has forgotten. They function professionally. They do not forgive.`,
      (r, s) =>
        `${r.name} and ${s.name} were something to each other once (partners, friends, perhaps more), and the wreck of it is the one subject on which both are permanently silent.`,
      (r, s) =>
        `The quarrel between ${r.name} and ${s.name} is old enough that no one else remembers the cause. They remember. They have simply stopped explaining.`,
      (r, s) =>
        `${r.name} testified against ${s.name} in a case ten years ago. ${s.name} lost a fortune and has not spoken to ${r.name} since.`,
      (r, s) =>
        `${s.name} took the post ${r.name} had been promised. ${r.name} has treated ${s.name} as an enemy from that day.`,
      (r, s) =>
        `${r.name} and ${s.name} were partners until one of them emptied the shared account. Each says it was the other.`,
      (r, s) => `${r.name} blames ${s.name} for a death in ${r.name}'s family. ${s.name} has never denied it.`,
      (r, s) =>
        `${r.name} and ${s.name} fought a duel in their youth. Both survived, and the scar is on ${s.name}'s face.`,
    ]),
    tension: pairProse('t', [
      (r, s) => 'The circumstances that caused the original rupture are repeating. Both of them know it.',
      (r, s) => 'An apology is owed in one direction and expected in the other, and they disagree about which.',
      (r, s) => 'A newcomer keeps trying to reconcile them, and is about to learn why nobody else does.',
      (r, s) => `${s.name} has been appointed to judge a case in which ${r.name} is a party.`,
      (r, s) => `${r.name} has found the document that proves what ${s.name} did, and has kept it locked away.`,
      (r, s) =>
        `${r.name} and ${s.name} have been placed on the same council committee. The first meeting is next week.`,
      (r, s) => `${s.name}'s child has asked to apprentice with ${r.name}. ${r.name} has not refused.`,
      (r, s) => `${r.name} has learned that ${s.name} is in debt and could be ruined by one call on a loan.`,
    ]),
    type: 'enemy',
  },
};

// TRAIT_AGGRESSION (belligerent↔pacific) and TRAIT_ALIGNMENT (good↔evil) — the two light
// signed-weight maps over the AUTHORED personality vocabulary — now live in the zero-import
// leaf data/npcTraitWeights.js so the EAGER domain/corruption.js consumer (which reads only
// TRAIT_ALIGNMENT) no longer drags this 64 kB module into the first-paint static closure
// (FP-G3 reclaim). Re-exported here VERBATIM so npcData.js stays the single source for its
// lazy consumers (generators, disposition) + the tests. Data is byte-identical to its former
// inline home — only the module home moved. @see data/npcTraitWeights.js
export { TRAIT_AGGRESSION, TRAIT_ALIGNMENT } from './npcTraitWeights.js';

/**
 * TRAIT_PRESENCE_DISTRIBUTION — seeded, tunable weights deciding which of an
 * NPC's two corruption-relevant personality slots survive generation:
 *   • `dominant` (a steady TEMPERAMENT) makes an NPC harder for the world-pulse
 *     sim to turn.
 *   • `flaw` (greed, ambition, a vice) is the weakness organized crime leverages
 *     to turn an NPC. No flaw ⇒ nothing to leverage ⇒ the sim can never turn them.
 *
 * The four buckets are independent presence outcomes (weights sum to 1.0). A
 * solid majority keep a flaw (both + flawOnly = 70%) so the background sim still
 * has people to turn; only 10% have neither slot. The roll is drawn from the
 * seeded PRNG so generation stays reproducible. This governs ONLY trait
 * presence — it does NOT touch the manual "Impose corruption" DM override, which
 * works on any NPC with no flaw check.
 * @type {Readonly<{both:number, flawOnly:number, temperamentOnly:number, neither:number}>}
 */
export const TRAIT_PRESENCE_DISTRIBUTION = Object.freeze({
  both: 0.40,
  flawOnly: 0.30,
  temperamentOnly: 0.20,
  neither: 0.10,
});
