// npcData.js — NPC table data extracted from npcGenerator.js
// All constants exported for use by npcGenerator.js

import { pickVariant } from '../kernel/proseHash.js';
import { HANDLER_TIE_LINES } from './people/handlerTieLines.js';

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
  'Makes every point as a question they do not expect answered',
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
      impression: 'Relaxed and sure of themselves, and not careless with it.',
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
      impression: 'Cautious with newcomers, because the work requires it; it is nothing personal.',
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
    { text: 'formal robes of office', colour: true },
    { text: 'expensive but conservative merchant dress', colour: true },
    { text: 'a chain of office worn even off-duty', colour: true },
    { text: 'court attire with discreet personal touches', colour: true },
    { text: 'robes cut for a taller predecessor, never altered', colour: true },
    { text: 'official dress one grade above their actual station', colour: true },
    { text: 'sombre official black with a jewelled clasp nobody asks about', colour: true },
    { text: 'immaculate formal wear that has clearly never seen weather', colour: true },
  ],
  military: [
    { text: 'functional armour with personal sigils', colour: true },
    { text: 'guard uniform kept immaculate', colour: true },
    { text: "soldier's practical dress with officer's insignia", colour: true },
    { text: "battle-worn plate they haven't replaced", colour: true },
    { text: 'a dress uniform kept for funerals, worn thin at the elbows', colour: true },
    { text: 'mismatched armour pieces, each from a different campaign', colour: true },
    { text: 'a field coat carrying the insignia of a disbanded company', colour: true },
    { text: 'civilian dress worn like a uniform: pressed, squared, joyless', colour: true },
  ],
  religious: [
    { text: 'religious vestments layered over travelling clothes', colour: true },
    { text: 'simple robes of their order', colour: true },
    { text: 'ceremonial attire worn at all times', colour: true },
    { text: 'plain devotional dress with one opulent accessory', colour: true },
    { text: 'vestments a size too grand for the shrine they serve', needs: ['sacredHouse'] }, // CENSUS-4f: the ledger's declaration, re-read under R-AE (a shrine is a sacred house)
    { text: 'threadbare robes patched with fabric from finer ones', colour: true },
    { text: 'a formal habit with a travel-stained hem never cleaned', colour: true },
    { text: 'lay clothes with the collar of the order left visible', colour: true },
  ],
  economy: [
    { text: 'merchant dress: practical but signalling wealth through material', colour: true },
    { text: 'guild colours worn with pride', needs: ['guild'] }, // CENSUS-4f: the ledger's declaration
    { text: 'clothes that once cost a fortune and now show the miles', colour: true },
    { text: 'well-cut but understated trading clothes', colour: true },
    { text: 'sober broadcloth with buttons worth more than the coat', colour: true },
    { text: 'foreign-cut clothes from a market they want to be asked about', colour: true },
    { text: "a ledger-keeper's plain dress with ink at the right cuff", colour: true },
    { text: "last season's fashion maintained with visible determination", colour: true },
  ],
  criminal: [
    { text: 'nondescript working clothes chosen specifically to be forgettable', colour: true },
    { text: 'fine clothes worn ironically over rougher garments', colour: true },
    { text: 'guard or clergy disguise worn as a habit', colour: true },
    { text: 'whatever is clean (they move frequently)', colour: true },
    { text: "a dockhand's oilskins over hands too clean for the work", needs: ['docks'] }, // CENSUS-4f: the ledger's declaration
    { text: 'respectable dress exactly average for the street they work', colour: true },
    { text: 'good boots and cheap everything else', colour: true },
    { text: 'a heavy coat worn indoors, contents unexamined', colour: true },
  ],
  magic: [
    { text: 'scholarly robes with heavy pockets', colour: true },
    { text: "travelling mage's coat covered in small pouches", colour: true },
    { text: 'deceptively plain clothes that crackle faintly with residual energy', colour: true },
    { text: 'formal academic dress worn with absent-minded disregard', colour: true },
    { text: 'robes singed at one cuff and never mended', colour: true },
    { text: 'practical dress with chalk dust in every seam', colour: true },
    { text: "a scholar's gown two institutions out of date", colour: true },
    { text: 'ordinary clothes with a lining that clinks faintly', colour: true },
  ],
  other: [
    { text: 'clothes practical for their work with one personal flourish', colour: true },
    { text: 'travel-worn but well-maintained gear', colour: true },
    { text: "second-hand fine clothes that don't quite fit", colour: true },
    { text: "whatever was available (they don't care about dress)", colour: true },
    { text: 'work clothes patched by someone who loved them', colour: true },
    { text: 'a good coat inherited from a larger relative', colour: true },
    { text: 'dress entirely without signal (deliberately so)', colour: true },
    { text: 'weathered gear maintained past the point of economy', colour: true },
  ],
};

export const NPC_FACTION_GOALS = {
  Mayor: [
    {
      needs: ['guild'], short: "Navigate a dispute between two powerful guilds without losing either's support", // CENSUS-4b: the ledger's declaration (docs/census/declarations/npcData.NPC_FACTION_GOALS.json)
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
      colour: true,
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
      colour: true,
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
      colour: true,
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
      colour: true,
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
      colour: true,
    },
  ],
  'Guard Captain': [
    {
      short: 'Find the person responsible for three unsolved dock-side killings',
      long: 'Rebuild guard morale after years of under-funding and low prestige',
      driven_by: 'protection',
    },
    {
      short: "Identify which of their officers is on the thieves' guild payroll", // CENSUS-4b: NOT declared — F4's writer (npcGenerator, crimeSignalOf) rewrites the guild to 'a powerful outside interest' where no crime signal stands, so the printed line presumes nothing (tests/generators/npcCrimeSignalWriters.test.js soak1k-531)
      long: 'Die old, in their own bed (an unusual ambition for the role)',
      driven_by: 'personal',
    },
  ],
  'Garrison Commander': [
    {
      needs: ['walls'], short: 'Secure emergency funding to repair the east wall before it becomes a crisis', // CENSUS-4b: the ledger's declaration (docs/census/declarations/npcData.NPC_FACTION_GOALS.json)
      long: 'Be remembered as the commander who made this settlement truly defensible',
      driven_by: 'military',
    },
    {
      short: 'Contain a near-mutiny caused by months of unpaid wages',
      long: 'Obtain a noble title through military distinction (the only path left open)',
      driven_by: 'power',
      colour: true,
    },
  ],
  'Mercenary Captain': [
    {
      short: 'Collect a debt from a client who keeps finding reasons to delay payment',
      long: 'Save enough to buy land and retire before this work kills them',
      driven_by: 'wealth',
      colour: true,
    },
    {
      short: 'Evaluate whether the next contract is worth the risk to their crew',
      long: 'Build a company so well-regarded that princes compete to hire them',
      driven_by: 'power',
      colour: true,
    },
  ],
  'High Priest': [
    {
      needs: ['temple'], short: 'Restore a desecrated shrine before the annual festival (quietly, without scandal)', // CENSUS-4b: the ledger's declaration (docs/census/declarations/npcData.NPC_FACTION_GOALS.json)
      long: 'Unite the fractious local clergy under a single doctrinal standard',
      driven_by: 'spiritual',
    },
    {
      short: 'Identify who among their junior clergy is accepting bribes from merchants',
      long: 'Found an institution (a hospital, a school) that will outlast them by centuries',
      driven_by: 'reform',
      colour: true,
    },
  ],
  Priest: [
    {
      short: 'Mediate a land dispute between two families before it turns violent',
      long: 'Simply keep the community together: feed them, marry them, bury them with dignity',
      driven_by: 'protection',
      colour: true,
    },
    {
      needs: ['temple'], short: 'Convince their superior in the faith to fund repairs to the temple roof', // CENSUS-4b: the ledger's declaration (docs/census/declarations/npcData.NPC_FACTION_GOALS.json)
      long: 'Leave a detailed record of the congregation so future priests know who this community was',
      driven_by: 'knowledge',
    },
  ],
  'Abbot/Abbess': [
    {
      short: 'Investigate rumours that a novice has been leaving the grounds at night',
      long: 'Expand the scriptorium into a library open to all who can read',
      driven_by: 'knowledge',
      colour: true,
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
      colour: true,
    },
    {
      short: 'Navigate political pressure from both the church hierarchy and the civil authorities',
      long: 'Retire before the work corrupts them entirely',
      driven_by: 'personal',
      colour: true,
    },
  ],
  'Wealthiest Merchant': [
    {
      short: 'Corner the market on a specific commodity before a rival does',
      long: 'Fund a trading dynasty that their grandchildren will run',
      driven_by: 'wealth',
      colour: true,
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
      colour: true,
    },
  ],
  Moneylender: [
    {
      short: 'Collect on a large overdue debt from a borrower who has suddenly disappeared',
      long: 'Accumulate enough leverage over enough people to be untouchable',
      driven_by: 'power',
      colour: true,
    },
    {
      short: 'Identify which of their clients is about to default and act first',
      long: 'Transform the lending business into a proper banking institution: legitimate, respectable',
      driven_by: 'wealth',
      colour: true,
    },
  ],
  'Master Craftsman': [
    {
      needs: ['tier: ≥ city'], short: 'Complete a prestigious commission that will make their reputation in the city', // CENSUS-4b: the ledger's declaration (docs/census/declarations/npcData.NPC_FACTION_GOALS.json)
      long: 'Train an apprentice who surpasses them: the greatest achievement of any craftsman',
      driven_by: 'personal',
    },
    {
      short: "Acquire a rare material to solve a technical problem they've never cracked",
      long: 'Document every technique they know before the knowledge dies with them',
      driven_by: 'knowledge',
      colour: true,
    },
  ],
  "Thieves' Guild Master": [
    {
      short: 'Identify which of their lieutenants is planning to branch out independently',
      long: 'Achieve enough legitimate business to step back from direct criminal exposure',
      driven_by: 'power',
      colour: true,
    },
    {
      short: 'Negotiate a non-aggression pact with a new criminal faction moving into their territory',
      long: 'Ensure no one ever proves the connection between them and their operations',
      driven_by: 'personal',
      colour: true,
    },
  ],
  'Crime Lord': [
    {
      short: 'Suppress a rival operation that has begun cutting into smuggling revenue',
      long: 'Build an empire that survives their death: succession planning for criminals',
      driven_by: 'power',
      colour: true,
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
      colour: true,
    },
    {
      short: 'Determine whether the recent cargo losses are coincidence or betrayal',
      long: 'Expand into a trade that requires less hiding: spice or cloth, not people',
      driven_by: 'wealth',
      colour: true,
    },
  ],
  'Tower Wizard': [
    {
      short: 'Identify the source of unexplained magical disturbances in the northern district',
      long: 'Complete a research project that will earn peer recognition: not power, just acknowledgement',
      driven_by: 'knowledge',
      colour: true,
    },
    {
      short: 'Find an apprentice worth investing time in before they become too old to train anyone',
      long: 'Solve one genuinely unsolved theoretical question before they die',
      driven_by: 'knowledge',
      colour: true,
    },
  ],
  'Guild Archmage': [
    {
      short: "Resolve a dispute between two factions of the mages' guild without taking sides",
      long: 'Establish a magical institution that outlasts their own life and power',
      driven_by: 'power',
      colour: true,
    },
    {
      short: 'Track down a former student who has been using restricted magic',
      long: 'Complete the great work (whatever that means to them specifically)',
      driven_by: 'knowledge',
      colour: true,
    },
  ],
  'Hedge Wizard': [
    {
      short: 'Find reliable income for the next three months (magical services barely pay)',
      long: 'Be taken seriously by the formal magical establishment, just once',
      driven_by: 'personal',
      colour: true,
    },
    {
      short: 'Identify what is wrong with the crops in the northern fields (it smells magical)',
      long: 'Understand their own unusual ability well enough to pass it on',
      driven_by: 'knowledge',
      colour: true,
    },
  ],
  Alchemist: [
    {
      short: 'Source a specific reagent that has been mysteriously unavailable for six weeks',
      long: "Crack the theoretical basis for a transmutation they've been circling for years",
      driven_by: 'knowledge',
      colour: true,
    },
    {
      short: 'Fulfil a large dangerous commission while minimising the chance of explosion',
      long: "Publish findings that will outlast the potions they've spent their life brewing",
      driven_by: 'knowledge',
      colour: true,
    },
  ],
  'Tavern Owner': [
    {
      needs: ['hospital'], short: 'Manage the fallout from a brawl last week that left a local merchant hospitalised', // CENSUS-4b: the ledger's declaration (docs/census/declarations/npcData.NPC_FACTION_GOALS.json)
      long: "Pay off the building and own it outright before they're too old to work it",
      driven_by: 'wealth',
    },
    {
      short: 'Figure out who has been watering down their barrels before it reaches customers',
      long: 'Build a place where everyone (not just the wealthy) can feel welcome',
      driven_by: 'personal',
      colour: true,
    },
  ],
  'Sage/Scholar': [
    {
      short: 'Verify a specific historical claim before publishing it (one source contradicts all others)',
      long: "Complete the comprehensive work they've spent thirty years building toward",
      driven_by: 'knowledge',
      colour: true,
    },
    {
      short: 'Find funding to continue research after their patron cut support without explanation',
      long: 'Mentor someone who will care about truth more than they care about credit',
      driven_by: 'reform',
      colour: true,
    },
  ],
  Healer: [
    {
      needs: ['tier: ≥ town'], short: 'Identify the source of a cluster of unusual illnesses in the western quarter', // CENSUS-4b: the ledger's declaration (docs/census/declarations/npcData.NPC_FACTION_GOALS.json)
      long: 'Train enough local healers that the settlement can cope without them',
      driven_by: 'protection',
    },
    {
      short: 'Obtain a specific medicinal compound that has been unavailable for months',
      long: "Document everything they know so the knowledge survives if they don't",
      driven_by: 'knowledge',
      colour: true,
    },
  ],
};

// CENSUS-4g (R-AX, the chair's ruling of 2026-11-05 08:3x): THE CRIMINAL SECRETS, KEYED BY THEIR
// HOLDER'S ROLE. A religious secret that makes its holder a churchman ("maintains the role", "a
// colleague's heretical activities", "falsifying miracle reports", "their religious order", "a
// relic … declared destroyed" that was theirs to destroy) sits under `clergy`; a military one that
// makes its holder a soldier or an officer (an order given in battle, patrol routes to sell, the
// military supply budget, an atrocity ordered by the organisation they rose in) under `military`;
// every other secret is role-free (`any`). The key is the holder's role class
// (`domain/roles/roleClass.js :: classOfRole`), the fact's own reader (R-AP): no settlement atom
// expresses a holder's role and none is added (no NPC-scoped atom enters the vocabulary).
//
// KEYED (CENSUS-1i unit 3): the draw (`generators/npc/factionLeaderSecret.js`) reads
// `criminalSecretsForHolder(type, holderClass)` — the historic order with only the rows keyed to
// another role left out, so a clergy holder's religious pool and a soldier's military pool are
// unchanged and only a mismatched holder's draw moves — and its type roll re-maps a type the
// holder's key empties (R-AX refined). The flat view `NPC_CRIMINAL_SECRETS` below is no longer what
// the draw reads; it stays the table's census export (`tablePools`) and the unkeyed reading.
//
// @enforced-by tests/data/criminalSecretsByHolder.test.js
export const NPC_CRIMINAL_SECRETS_BY_HOLDER = {
  any: {
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
        secret: 'Has a second family elsewhere that neither family knows about',
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
        secret: 'Has been feeding strategic intelligence to outsiders who pay for it',
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
        secret: 'Secretly receives what they believe are genuine divine visions, which terrifies them',
        stakes: 'Acting on the visions would be seen as madness; ignoring them may be worse',
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
        secret: 'Was captured and released under terms they have never disclosed',
        stakes: "The terms may mean they owe something to an enemy that they haven't paid yet",
      },
      {
        secret: 'Knows that the decisive victory everyone celebrates was won through treachery, not skill',
        stakes: 'Several people built careers on that victory; they would not appreciate the truth',
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
  },
  clergy: {
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
  },
  military: {
    military: [
      {
        secret: 'Gave an order during a battle that caused friendly casualties. It was covered up as enemy action',
        stakes: 'The families of the dead believe a lie that this person actively maintains',
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
  },
};

/** The historic position of every keyed type's rows: the holder key each slot drew from, in order. */
export const CRIMINAL_SECRET_LEGACY_ORDER = {
  religious: ['clergy', 'clergy', 'any', 'clergy', 'clergy', 'clergy'],
  military: ['military', 'any', 'any', 'military', 'military', 'military'],
};

/**
 * One secret type's rows for a holder, in the historic order; a row keyed to another role is left out.
 * `holderClass` null keeps every row (the flat view the unkeyed draw reads).
 * @param {string} type @param {string | null} holderClass
 * @returns {Array<{ secret: string, stakes: string }>}
 */
export function criminalSecretsForHolder(type, holderClass) {
  const order = CRIMINAL_SECRET_LEGACY_ORDER[type];
  const free = NPC_CRIMINAL_SECRETS_BY_HOLDER.any[type];
  if (!order) return free ? [...free] : undefined;
  /** @type {Record<string, number>} */ const at = {};
  const rows = [];
  for (const key of order) {
    const i = at[key] ?? 0; at[key] = i + 1;
    if (holderClass === null || key === 'any' || key === holderClass) rows.push(NPC_CRIMINAL_SECRETS_BY_HOLDER[key][type][i]);
  }
  return rows;
}

/** The flat view the unkeyed draw reads (byte-identical to the table before R-AX). */
export const NPC_CRIMINAL_SECRETS = Object.fromEntries(
  Object.keys(NPC_CRIMINAL_SECRETS_BY_HOLDER.any).map((type) => [type, criminalSecretsForHolder(type, null)]),
);

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
    'A merchant they spoke against has started praising them in public, and will not say why.',
    "Their most trusted advisor hasn't been seen in four days. The official story changes each time it's told.",
    { text: "They know who committed a crime the guard is currently investigating. They're not telling the guard.", needs: ['guardPresence'] }, // CENSUS-3e: the ledger's declaration
    "Someone has been leaving anonymous notes in their office pointing to a colleague's corruption. The notes are accurate.",
    "They've been meeting privately with someone from outside the settlement whose identity they won't disclose.",
    'A routine appointment they made three weeks ago has been rescheduled four times. Each time they initiated the change.',
    'Someone who publicly supports them is being paid by someone who opposes them. They know this.',
    'They received a deposition in a civil case that, if acted on, would be correct, and would ruin someone they need.',
  ],
  military: [
    { text: 'Three guards have gone missing in the same district on night patrol. The report filed says they deserted.', needs: ['guardPresence'] }, // CENSUS-3e: the ledger's declaration
    { text: 'Weapons from the armoury have been disappearing in small quantities for months. The inventory matches, somehow.', needs: ['guardPresence'] }, // CENSUS-3e: the ledger's declaration
    "They received orders from above that contradict what they know to be right. They haven't acted on either yet.",
    { text: 'A prisoner in their custody knows something valuable. So does someone with reason to ensure they never speak.', needs: ['guardPresence'] }, // CENSUS-3e: the ledger's declaration
    "They've noticed the same group of faces at multiple locations where incidents occurred. No one else has.",
    { text: "Someone is paying their soldiers more than their salary. The soldiers aren't saying who.", needs: ['guardPresence'] }, // CENSUS-3e: the ledger's declaration
    'A spy they turned is now being turned back, and feeding information in both directions.',
    { text: "The ambush that killed two of their best people wasn't random. Someone knew the patrol route.", needs: ['guardPresence'] }, // CENSUS-3e: the ledger's declaration
    'A recruit they turned away has since joined a different outfit. The different outfit is now paying them to monitor this one.',
    'They are carrying out orders they believe are wrong. They have not yet decided at what point they stop carrying them out.',
    { text: "A weapons cache they were responsible for is smaller than it should be. They haven't reported it yet.", needs: ['guardPresence'] }, // CENSUS-3e: the ledger's declaration
  ],
  religious: [
    'A parishioner confessed something to them three months ago. The information is dangerous. They cannot act on it.',
    'The holy relic in their keeping is not what everyone believes it is. Only they know this.',
    { text: "Someone has been leaving offerings at the shrine that shouldn't be possible. The site has been sealed.", needs: ['institution: temple'] }, // CENSUS-3e: the ledger's declaration
    "A novice has the gift. They know what that means for the novice. They're not sure what to do.",
    'They received a directive from the hierarchy that contradicts their own theology. Compliance is expected.',
    "A healing they performed was successful in a way they cannot explain. It's happened twice now.",
    "Their predecessor left a sealed letter to be opened at their death; it never was, and it is still where it was left.",
    'A member of their congregation is systematically working against the faith. From inside it.',
    'They have been asked to perform a ceremony they have theological objections to. The person asking has leverage.',
    "A donation was made to the institution under conditions the donor didn't disclose publicly. The conditions are becoming relevant.",
    'They know which of the current leadership will be the next to fall from grace. They are waiting.',
  ],
  economy: [
    "A shipment they weren't expecting arrived and is now in their warehouse. They don't know who sent it or what to do.",
    "A business rival has offered them a partnership with terms so good it must be a trap. They can't find the trap.",
    'One of their most reliable suppliers has gone dark. The goods are still arriving. Someone else is sending them.',
    { text: 'They have evidence of price-fixing across the whole market. Publishing it helps their competition as much as their customers.', needs: ['market'] }, // CENSUS-3e: the ledger's declaration
    "A young trader has been undercutting them in ways that shouldn't be possible on their claimed capital.",
    "Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in.",
    'A valuable cargo was reported lost at sea. The manifest has reappeared in a market two settlements away.',
    "Their master craftsman is talking to a rival. They haven't confronted them. They're not sure what they'd do.",
    "A contract they signed in difficult times has a clause they didn't fully read. Someone has read it.",
    "They have been slowly acquiring a controlling interest in a competitor through intermediaries. The competitor hasn't noticed yet.",
    'A supplier is providing goods of uncertain provenance. The price is too good to ask questions. People have started asking questions.',
  ],
  criminal: [
    { text: "One of their people is talking to the guard. They don't know which one yet. They're watching.", needs: ['guardPresence'] }, // CENSUS-3e: the ledger's declaration
    'A valuable item came through their network recently. Three different parties have asked about it quietly.',
    "Someone in the government takes their money and someone else's, and they do not know which side will be sold first.",
    'A job went wrong in a way that suggests information was leaked. They have three suspects.',
    "They're protecting someone from something worse. The someone doesn't know and wouldn't thank them.",
    'The same new face has turned up at three of their jobs, and they have put someone on to follow the newcomer.',
    { text: 'The guard captain has a file. They know because someone who works for the guard captain also works for them.', needs: ['guardPresence'] }, // CENSUS-3e: the ledger's declaration
    "Someone tried to rob one of their fronts, and did it like a professional: no noise, the lock picked, nothing touched but the strongbox.",
  ],
  magic: [
    "An experiment failed in a way that shouldn't be possible. The results have been sealed. They're still thinking.",
    "A student asked them a question three weeks ago that they still cannot answer, and the student has not asked again.",
    { text: 'Something in the settlement is absorbing ambient magical energy. The readings are increasing.', needs: ['magic'] }, // CENSUS-3e: the ledger's declaration
    "They've been approached by someone who knows things about their research that were never made public.",
    'An old colleague has sent a message asking for a meeting. The colleague was declared dead six years ago.',
    { text: 'The ward on their vaults was not broken but bypassed, which only someone who knew how it was made could do.', needs: ['magic'] }, // CENSUS-3e: the ledger's declaration
    { text: 'They have two competing theories about what is happening to magic in this region. Both are alarming.', needs: ['magic'] }, // CENSUS-3e: the ledger's declaration
    'Someone has been making inquiries about their past research. Not the published work, the unpublished work.',
  ],
  other: [
    "They overheard two people they know settle a bribe, and do not know whom to tell.",
    "A regular customer has stopped coming. The reason they've been given doesn't make sense.",
    "Someone left an item in their care and hasn't returned. The item is valuable. The absence is now suspicious.",
    'Three different people have asked them the same unusual question. None of them knew each other.',
    "They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone.",
    'A traveller passed through asking which nights their door is left unbarred, and was gone by morning.',
    'Something they were told had been burned has turned up for sale.',
    "They have seen the same unmarked cart pass their door three nights running, and have not wondered why.",
    "Their oldest friend has started paying for drinks with new silver and will not say where it came from.",
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
      long: 'Put enough by that going straight is a choice they can make',
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
  welcoming: 'Offers information freely, and asks questions that sound like interest, not prying.',
  transactional: 'Cooperative within clear limits; every exchange has an implicit value.',
  cautious: 'Answers questions without volunteering; watches who you talk to next.',
  dismissive: 'Polite but brief; makes clear their time is limited.',
};

/**
 * STYLE-2 SW-7 (STYLE-RULINGS-2 B10(b)): "How they deal" keyed to the card's OWN traits. Three
 * disposition lines covered 371 of 405 cards on the twelve; the line now reads the disposition AND
 * the card's personality (`npcGenerator.js :: generateReligionType` — the flaw first, then the
 * dominant trait, then the modifier), each trait word mapped to the family of dealing it names. Draw-free:
 * no roll is added or moved; a card whose traits name no family keeps its disposition line above.
 * Every line states only what the disposition and the trait word say; nothing else is presumed.
 */
export const DEALING_TRAIT_FAMILY = Object.freeze({
  honest: 'straight', candid: 'straight', forthright: 'straight', 'plain-dealing': 'straight', principled: 'straight', incorruptible: 'straight', 'fair-minded': 'straight', equitable: 'straight',
  compassionate: 'warm', generous: 'warm', 'warm-hearted': 'warm', hospitable: 'warm', merciful: 'warm', magnanimous: 'warm', 'good-humoured': 'warm', gracious: 'warm', courteous: 'warm', charismatic: 'warm', optimistic: 'warm', humble: 'warm',
  patient: 'careful', methodical: 'careful', prudent: 'careful', 'level-headed': 'careful', temperate: 'careful', diligent: 'careful', conscientious: 'careful', dependable: 'careful', steadfast: 'careful', stalwart: 'careful', tenacious: 'careful', unflappable: 'careful', perfectionist: 'careful',
  clever: 'sharp', astute: 'sharp', discerning: 'sharp', perceptive: 'sharp', intuitive: 'sharp', wise: 'sharp', scholarly: 'sharp', resourceful: 'sharp', diplomatic: 'sharp',
  loyal: 'dutiful', protective: 'dutiful', brave: 'dutiful', pious: 'dutiful', traditionalist: 'dutiful', zealous: 'dutiful',
  greedy: 'price', 'self-serving': 'price', corrupt: 'price', hedonistic: 'price',
  arrogant: 'lofty', vain: 'lofty', imperious: 'lofty', domineering: 'lofty', overbearing: 'lofty', dismissive: 'lofty', proud: 'lofty', theatrical: 'lofty',
  suspicious: 'guarded', paranoid: 'guarded', secretive: 'guarded', cautious: 'guarded', reserved: 'guarded', inscrutable: 'guarded', detached: 'guarded',
  deceitful: 'slippery', manipulative: 'slippery', mendacious: 'slippery', hypocritical: 'slippery',
  cruel: 'hard', callous: 'hard', 'cold-blooded': 'hard', ruthless: 'hard', vindictive: 'hard', vengeful: 'hard', wrathful: 'hard', bitter: 'hard',
  lazy: 'shirking', cowardly: 'shirking', reckless: 'shirking', envious: 'shirking', stubborn: 'shirking', petty: 'shirking', volatile: 'shirking',
  pragmatic: 'dealmaker', ambitious: 'dealmaker', calculating: 'dealmaker', opportunistic: 'dealmaker',
});

/** disposition → trait family → the "How they deal" line (FOR THE OWNER'S VETO; SW-7's record §7). */
export const NPC_DEALING_BY_TRAIT = Object.freeze({
  welcoming: Object.freeze({
    straight: "Glad to talk, and says plainly what they know and what they don't.",
    warm: 'Makes you welcome, finds you a seat, and helps without counting the cost.',
    careful: 'Friendly, but takes their time; hears the whole question before answering it.',
    sharp: 'Friendly and quick; by the end of the talk they know more about you than you do about them.',
    dutiful: 'Open with you until your business touches the people they answer for; then they close up.',
    price: 'Free with talk and small favours, and remembers every one when they want something back.',
    lofty: 'Gracious in the way of someone doing you a kindness, and expects to be thanked for it.',
    guarded: 'Friendly on the surface, but soon asks where you are staying and who sent you.',
    slippery: 'Tells you what you want to hear, and the story changes with who else is listening.',
    hard: 'Pleasant until crossed; then the warmth goes at once and does not come back.',
    shirking: 'Promises help easily, and is hard to find when the time comes to give it.',
    dealmaker: 'Friendly and useful, and already working out what you might be worth to them.',
  }),
  transactional: Object.freeze({
    straight: 'Names a fair price, keeps to it, and expects you to keep to yours.',
    warm: 'Strikes a bargain, then gives a little more than was agreed.',
    careful: 'Wants every term settled before anything changes hands, and writes it down.',
    sharp: 'Bargains well, and spots a weak offer before you finish making it.',
    dutiful: 'Deals fairly with you, but never against the people they serve.',
    price: 'Everything has a price, and the price rises the more you seem to need it.',
    lofty: 'Deals with you as a favour, and lets you know the terms are theirs to set.',
    guarded: 'Trades in coin, not talk; asks nothing about you and says nothing of their own business.',
    slippery: 'Agrees quickly, and the terms are never quite what you remember agreeing to.',
    hard: 'Holds you to every word of a deal and collects in full, whatever it costs you.',
    shirking: 'Takes the deal, then does as little as the deal allows.',
    dealmaker: 'Helps you as far as it pays them to, and no further.',
  }),
  cautious: Object.freeze({
    straight: 'Answers what you ask truthfully, and offers nothing beyond it.',
    warm: 'Kind but careful; helps once they know who you are and why you came.',
    careful: 'Answers slowly, checks what you say against what they know, and gives little at a first meeting.',
    sharp: 'Says little, watches closely, and notices what you leave out.',
    dutiful: 'Asks your business first, and weighs it against the people they look after.',
    price: 'Says little until it is clear what you can offer.',
    lofty: 'Keeps you at a distance, and makes you prove you are worth their time.',
    guarded: 'Answers questions without volunteering anything, and watches who you talk to next.',
    slippery: 'Gives careful answers that are true as far as they go, and they never go far.',
    hard: 'Treats every question as a possible threat, and remembers who asked it.',
    shirking: 'Keeps out of trouble by keeping away from you, and sends you to someone else when they can.',
    dealmaker: 'Holds back until they see what knowing you might get them.',
  }),
  dismissive: Object.freeze({
    straight: 'Brief and blunt; tells you what they think of your request and goes back to work.',
    warm: 'Busy, but not unkind; points you to someone who can help.',
    careful: 'Polite, brief and busy; asks you to come back when they have time.',
    sharp: 'Hears you out for a moment, decides you are not worth more, and says so.',
    dutiful: 'Has no time for strangers while their own people need them.',
    price: 'Has no time for you unless you are buying.',
    lofty: 'Barely looks up; you are plainly beneath their notice.',
    guarded: 'Cuts the talk short and gives no reason.',
    slippery: 'Agrees with everything you say, to be rid of you sooner.',
    hard: 'Curt to the point of rudeness, and does not care how it lands.',
    shirking: 'Waves you off; whatever you need is somebody else\'s job.',
    dealmaker: 'Polite but brief, until you mention something they want.',
  }),
});

/**
 * The card's "How they deal" line: the disposition's line for the first of the card's traits (flaw,
 * dominant, modifier) that names a family, else the disposition's own line. Pure; no draw.
 * @param {string} disposition
 * @param {{ flaw?: string|null, dominant?: string|null, modifier?: string|null } | null | undefined} personality
 * @returns {string}
 */
export function dealingLineFor(disposition, personality) {
  const byFamily = NPC_DEALING_BY_TRAIT[disposition];
  const base = NPC_PLOT_HOOKS_DATA[disposition] || NPC_PLOT_HOOKS_DATA.transactional;
  if (!byFamily || !personality) return base;
  for (const trait of [personality.flaw, personality.dominant, personality.modifier]) {
    const family = trait ? DEALING_TRAIT_FAMILY[trait] : null;
    if (family && byFamily[family]) return byFamily[family];
  }
  return base;
}

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
// (people/ties.js :: drawTies) and passes the drawn index as the third argument;
// the tie stores it as `proseVariant`, so a re-render (refreshRelationshipProjections) keeps the
// same line under new names. With no index (a legacy edge, a seedless caller) the closure falls
// back to the pure fnv hash of the DIRECTED pair key, salted per field. ZERO rng draws either
// way, and the archetype OBJECTS are unchanged (consumers compare them with === and
// Object.entries().find: identity is load-bearing). `size` hands the pool length to the draw.
// Index 0 of every pool is the pre-existing canonical closure, verbatim.
// CENSUS-4c (R-C, the table-consumer rule): a variant that presumes a record fact is declared IN
// PLACE as `{ line: closure, needs?, excludes?, crisis? }` (the ledger's 30 rows,
// docs/census/declarations/npcData.STRESS_ECONOMIC_EFFECTS.json); a bare closure declares nothing.
// `closureOf` is the consumer's tolerance (byte-identical: the same closure is called), and `lines`
// hands the declared variants, read-only and in index order, to the tie draw's resolution
// (Appendix B site 19, `relationshipArchetypes.js :: createTieProseDraw`: CENSUS-1d's to wire).
// ⚠ ONE index picks the desc AND the tension line: a refusal of either row refuses the pair.
const closureOf = variant => (typeof variant === 'function' ? variant : variant.line);
const pairProse = (salt, variants, order = null) => Object.assign((r, s, variant, force) => closureOf(isTieIndex(variant) ? variants[variant % variants.length]
  : pickVariant(variants, `${r?.name ?? ''}>${s?.name ?? ''}::${salt}`))(...(order ? endsOf(r, s, order[0], order[1]) : [r, s]), force || TIE_FORCE_WORDS), { size: variants.length, lines: Object.freeze([...variants]) }); // F1: the force words, garrison's by default (`defenseFacts.js :: forceWordsOf`)
const TIE_FORCE_WORDS = Object.freeze({ body: 'garrison', members: 'soldiers', member: 'soldier' });
/** A drawn tie index is a non-negative integer; anything else takes the pair-hash fallback. */
const isTieIndex = variant => Number.isInteger(variant) && variant >= 0;
/**
 * W5 HIS (the chair's ruling of 2026-11-08, a logic cure): the tie is DIRECTED (people/ties.js :: drawTies), so
 * `r` is the `from` card and `s` the `to` card whatever their categories. Every line of a CATEGORY-KEYED kind
 * gives each end a part (the merchant's books, the crew's money, the pulpit, the soldiers) in the kind's own
 * order, so `pairProse` hands its lines the two cards in that order (its third argument), read from the cards'
 * categories; it swaps only when BOTH cards say so, and a card without a category (the ledger's stand-ins, a
 * legacy edge) keeps the drawn order. The draw (the index, the pair-hash fallback) still keys on the drawn pair.
 * The one orientation in the estate: no other site orients a tie of its own.
 */
const endsOf = (r, s, first, second) => (r?.category === second && s?.category === first ? [s, r] : [r, s]);

export const STRESS_ECONOMIC_EFFECTS = {
  econ_crim_blur: {
    label: 'Commercial Complicity',
    desc: pairProse('d', [
      { line: (r, s) =>
        `${r.name} lends ${s.name}'s business an honest name, and ${s.name} gets ${r.name}'s goods into markets the law keeps closed.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s account books look clean because ${s.name} keeps certain sales out of them. Both of them grow richer for it.`, colour: true },
      { line: (r, s) =>
        `${s.name} pays ${r.name} for a respectable name, and ${s.name}'s goods travel under it, past inspectors who never look inside.`, colour: true },
      (r, s) =>
        `${r.name} signs the import papers and ${s.name} decides what is actually in the crates. The warehouse keeps two inventories, and only one is shown to the customs house.`,
      { line: (r, s) =>
        `${s.name}'s money buys ${r.name}'s stock at full price and sells it back through stalls that pay no market dues. Both of them call it a partnership.`, needs: ["market"] },
      { line: (r, s) =>
        `${r.name}'s shop front is real, the trade is real, and a third of the coin that passes through it belongs to ${s.name}.`, colour: true },
      { line: (r, s) =>
        `${r.name} vouches for ${s.name}'s people at the guild hall. In return, ${s.name}'s people keep ${r.name}'s carts moving on roads where other carts are stopped.`, colour: true },
      { line: (r, s) =>
        `${r.name} holds the licence, ${s.name} supplies the goods, and the profit is split in a back room on the first of every month.`, colour: true },
    ], ['economy', 'criminal']),
    tension: pairProse('t', [
      { line: (r, s) => `If ${r.name} is investigated, ${s.name} is implicated, and the other way round. Both know it, and neither mentions it.`, colour: true },
      { line: (r, s) => `A clerk has begun checking ${r.name}'s ledgers against each other. Neither ${r.name} nor ${s.name} has decided what to do about it.`, colour: true },
      { line: (r, s) => `One profitable season more, ${r.name} keeps saying. The seasons keep being profitable.`, colour: true },
      { line: (r, s) =>
        `${s.name} wants to move a larger cargo through ${r.name}'s warehouse next month. ${r.name} has not agreed and has not refused.`, colour: true },
      (r, s) =>
        `A customs officer has asked ${r.name} for the names of every supplier. ${s.name}'s name is missing from the list, and the officer has noticed the gap.`,
      { line: (r, s) =>
        `${r.name} has started paying off the guild debts that tied the two of them together. ${s.name} reads it as a plan to leave.`, colour: true },
      { line: (r, s) =>
        `${s.name} has been seen at ${r.name}'s counting-house in daylight. That was never part of the arrangement.`, colour: true },
      { line: (r, s) => `${r.name}'s eldest has found the second ledger and asked what ${s.name}'s initials mean.`, colour: true },
    ], ['economy', 'criminal']),
    type: 'patron_client',
  },
  econ_crim_exploitation: {
    label: 'Protection Arrangement',
    desc: pairProse('d', [
      { line: (r, s) =>
        `${s.name}'s operation charges ${r.name} a "security fee" that is, in practice, a protection racket. ${r.name} pays without complaint because the alternative is worse.`, colour: true },
      { line: (r, s) =>
        `Every month ${r.name} pays ${s.name} for protection against dangers that would, on inspection, trace back to ${s.name}. Both sides account for it as a cost of doing business.`, colour: true },
      { line: (r, s) =>
        `${s.name} collects a "security fee" from ${r.name}, and what it buys is that ${s.name}'s people stay away. ${r.name} pays on the day it falls due.`, colour: true },
      { line: (r, s) =>
        `${r.name} pays ${s.name} a tenth of every sale. The one season ${r.name} paid late, a storehouse burned.`, colour: true },
      { line: (r, s) =>
        `${s.name}'s collectors visit ${r.name} on the same day each month and leave with a sealed purse. Nobody in the street watches them go.`, colour: true },
      { line: (r, s) =>
        `${r.name} owes ${s.name} for protection that was never asked for and cannot be cancelled. The debt is renewed in person, at the door.`, colour: true },
      { line: (r, s) =>
        `${s.name} sets the fee, ${r.name} pays it, and the price goes on every customer's bill without a line of its own.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s premises are the only ones on the row that have never been robbed. ${s.name} reminds ${r.name} of this when the fee is due.`, colour: true },
    ], ['economy', 'criminal']),
    tension: pairProse('t', [
      { line: (r, s) => `${r.name} is quietly documenting every payment. Someone is being prepared for a fall.`, colour: true },
      { line: (r, s) => `The fee went up this quarter without explanation. ${r.name}'s patience is a finite ledger.`, colour: true },
      { line: (r, s) => `A rival crew has offered ${r.name} a better rate. Accepting would be a declaration of war on ${s.name}.`, colour: true },
      { line: (r, s) => `${r.name} has hired two guards of their own. ${s.name} has asked, politely, what they are for.`, colour: true },
      { line: (r, s) =>
        `${s.name} wants a cut of ${r.name}'s new venture before it opens. The fee was never meant to grow with the business.`, colour: true },
      { line: (r, s) =>
        `${r.name} missed this month's payment by three days. ${s.name} has not sent anyone yet, and that is worse.`, colour: true },
      (r, s) =>
        `${r.name} has written to the magistrate about ${s.name}'s collectors. The letter sits unsent in ${r.name}'s desk.`,
      { line: (r, s) =>
        `${s.name}'s collector was found drunk with ${r.name}'s purse still sealed. Someone will have to explain the delay to ${s.name}.`, colour: true },
    ], ['economy', 'criminal']),
    type: 'debtor_creditor',
  },
  mil_crim_corruption: {
    label: 'Corrupt Arrangement',
    desc: pairProse('d', [
      { line: (r, s) =>
        `${r.name} receives regular payments from ${s.name}'s organization in exchange for patrol schedules and advance notice of raids. Both maintain professional courtesy in public.`, colour: true },
      { line: (r, s) =>
        `${s.name}'s operation runs on a schedule ${r.name} provides: patrols that turn a street early, raids announced a day in advance. In public the two exchange formal nods.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s arrest record looks good because ${s.name} chooses which crimes get solved, and ${s.name}'s silver pays for the favour.`, colour: true },
      { line: (r, s) =>
        `${r.name} takes ${s.name}'s silver every quarter day and keeps certain doors unwatched in return. Each treats the other as a reliable colleague.`, colour: true },
      { line: (r, s) =>
        `${s.name}'s people are never searched on ${r.name}'s watch. The arrangement is three years old and has never been put in writing.`, colour: true },
      { line: (r, s) =>
        `${r.name} warns ${s.name} before every raid and arrests the competitors ${s.name} names. The watch reports show a fine record of arrests.`, needs: ["watch"] },
      { line: (r, s) =>
        `When ${s.name}'s crew needs a prisoner released, ${r.name} signs the order. When ${r.name} needs an arrest, ${s.name} supplies the culprit.`, colour: true },
      { line: (r, s) =>
        `${r.name} commands the patrols and ${s.name} pays for their routes. The streets ${s.name} uses are the quietest in the settlement.`, colour: true },
    ], ['military', 'criminal']),
    tension: pairProse('t', [
      { line: (r, s) =>
        `A new superior has started asking ${r.name} awkward questions about how few arrests are made. ${r.name} or ${s.name} will have to act before the other does.`, colour: true },
      { line: (r, s) => `An honest sergeant has been transferred into ${r.name}'s command. Both parties consider this a problem.`, colour: true },
      { line: (r, s) => `${s.name}'s payments to ${r.name} have started arriving late. In this trade, late is a message.`, colour: true },
      { line: (r, s) =>
        `${r.name} was promoted last month, and ${s.name} expects the price of silence to stay the same. ${r.name} does not.`, colour: true },
      { line: (r, s) =>
        `One of ${s.name}'s runners was arrested by a patrol ${r.name} did not assign. The runner knows both their names.`, colour: true },
      { line: (r, s) =>
        `${s.name} has asked ${r.name} to lose a piece of evidence that three other officers have already seen.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s quarter-day payment from ${s.name} arrived with a name attached: someone ${s.name} wants arrested.`, colour: true },
      { line: (r, s, f) =>
        `An auditor from the ${f.body} is counting ${r.name}'s arrest records against the coin in ${r.name}'s house. ${s.name} is watching the count.`, colour: true },
    ], ['military', 'criminal']),
    type: 'ally',
  },
  mil_crim_suppression: {
    label: 'Active Suppression',
    desc: pairProse('d', [
      { line: (r, s) => `${r.name} has made dismantling ${s.name}'s operation a personal priority. The feeling is mutual.`, colour: true },
      { line: (r, s) => `${r.name} keeps a file on ${s.name}'s operation that grows by the week; ${s.name} keeps one on ${r.name} that is already complete.`, colour: true },
      { line: (r, s) => `The war between ${r.name} and ${s.name} is fought in raids, informants, and paperwork. Neither side counts it as winnable; neither will stop.`, colour: true },
      { line: (r, s) => `${r.name} has closed three of ${s.name}'s houses this year. ${s.name} has opened four.`, colour: true },
      { line: (r, s) =>
        `${r.name} wants ${s.name} in a cell and has said so before the council. ${s.name} has answered by paying two of ${r.name}'s informants.`, excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) =>
        `${s.name}'s people know ${r.name}'s patrol routes by heart, and ${r.name}'s people know which taverns ${s.name} uses. Neither side has made the arrest that counts.`, needs: ["institution: tavern"] },
      { line: (r, s) =>
        `${r.name} and ${s.name} are open enemies. Every raid ${r.name} orders costs ${s.name} money, and every month ${s.name} survives costs ${r.name} standing.`, colour: true },
      { line: (r, s) =>
        `${r.name} hunts ${s.name}'s operation street by street, and ${s.name} moves it one street ahead. The chase has lasted two winters.`, colour: true },
    ], ['military', 'criminal']),
    tension: pairProse('t', [
      { line: (r, s) => `${s.name} has leverage on someone close to ${r.name}. It hasn't been used yet.`, colour: true },
      { line: (r, s) => `${r.name} is one warrant away from a raid that would end it. The warrant keeps not being signed.`, colour: true },
      { line: (r, s) => `Someone in ${r.name}'s command reports to ${s.name}. The file says so; it does not say who.`, colour: true },
      (r, s) =>
        `${r.name} has a witness willing to name ${s.name} before a magistrate. ${s.name} knows where the witness lives.`,
      { line: (r, s) =>
        `${s.name} has offered ${r.name} a truce and a purse. ${r.name} has not answered, which ${s.name} counts as progress.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s best informant inside ${s.name}'s crew has stopped reporting. Nobody has seen the informant for nine days.`, colour: true },
      { line: (r, s) =>
        `${s.name} has hired an advocate to sue ${r.name} over the last raid. The case comes before the council this season.`, excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) =>
        `${r.name} has been ordered to stand down against ${s.name} by someone above ${r.name}. The order did not say why.`, colour: true },
    ], ['military', 'criminal']),
    type: 'enemy',
  },
  econ_mil_contract: {
    label: 'Security Contract',
    desc: pairProse('d', [
      (r, s) =>
        `${r.name} pays ${s.name}'s fighters to guard ${r.name}'s goods and nobody else's. It has gone on so long that no one in authority asks about it any more.`,
      { line: (r, s) =>
        `${r.name} pays ${s.name}'s company well and exclusively, and in return certain cargoes move unescorted and uninspected. The arrangement predates every official who might question it.`, colour: true },
      { line: (r, s) =>
        `The contract between ${r.name} and ${s.name} is renewed annually with a handshake; what it actually covers has never been written down anywhere.`, colour: true },
      { line: (r, s) =>
        `${s.name}'s company guards ${r.name}'s warehouses and wagons for a fixed fee each season. ${r.name} pays on time and asks for nothing in writing.`, colour: true },
      { line: (r, s) =>
        `${r.name} is ${s.name}'s largest client and ${s.name} is ${r.name}'s only protection. Each would be badly hurt by losing the other.`, colour: true },
      { line: (r, s, f) =>
        `${s.name}'s ${f.members} wear ${r.name}'s colours on the road and take ${r.name}'s orders without question. No magistrate has a say over them.`, colour: true },
      { line: (r, s) =>
        `${r.name} hired ${s.name}'s company after the last caravan was lost. No caravan has been lost since, and ${s.name}'s fee has doubled.`, colour: true },
      { line: (r, s) =>
        `${s.name} answers to ${r.name}'s purse before any other authority. Everyone in the settlement knows which way ${s.name}'s company would march.`, colour: true },
    ], ['economy', 'military']),
    tension: pairProse('t', [
      { line: (r, s) =>
        `The contract is up for renewal. ${s.name} has been approached by a competitor. ${r.name} doesn't know yet.`, colour: true },
      { line: (r, s) => `${s.name}'s men have started asking what exactly they are guarding. ${r.name} prefers them incurious.`, colour: true },
      { line: (r, s) => `The last shipment was short, and ${r.name} and ${s.name} each privately blame the other. The next one will settle the question.`, colour: true },
      { line: (r, s) =>
        `${r.name} has cut ${s.name}'s fee by a fifth. ${s.name}'s company still guards the wagons, but more slowly.`, colour: true },
      { line: (r, s) => `${s.name}'s company has taken on a second client, and ${r.name} has learned the client's name.`, colour: true },
      { line: (r, s) =>
        `A guard from ${s.name}'s company was killed protecting ${r.name}'s cargo. ${s.name} wants compensation the contract does not mention.`, colour: true },
      { line: (r, s) =>
        `The council wants ${s.name}'s company under the watch's command. ${r.name} loses the contract's whole value if it agrees.`, needs: ["watch"], excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) => `${r.name} has asked ${s.name} to escort a cargo with no manifest. ${s.name} has named a price.`, colour: true },
    ], ['economy', 'military']),
    type: 'patron_client',
  },
  rel_mil_crusader: {
    label: 'Sacred Commission',
    desc: pairProse('d', [
      { line: (r, s) =>
        `${r.name} preaches and ${s.name} enforces, so whoever crosses one of them answers to both.`, colour: true },
      { line: (r, s, f) =>
        `What ${r.name} preaches from the pulpit on the holy day, ${s.name}'s ${f.body} enforces in the street that week.`, colour: true },
      { line: (r, s, f) =>
        `${r.name} blesses whatever ${s.name}'s ${f.body} enforces, and nobody dares ask which of the two has the final word.`, colour: true },
      { line: (r, s, f) =>
        `${r.name} preaches the cause and ${s.name} raises the men. The shrine's coffers pay for the ${f.body}'s swords.`, needs: ["institution: temple"] },
      { line: (r, s, f) =>
        `${s.name}'s ${f.members} take their oaths before ${r.name}'s altar. To ${r.name}'s faithful, ${s.name}'s orders carry the weight of scripture.`, colour: true },
      { line: (r, s) =>
        `${r.name} names the settlement's enemies from the pulpit, and ${s.name} rides against them within the week.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} hold the settlement between faith and force. The two of them meet after every service to agree the week's orders.`, colour: true },
      { line: (r, s) =>
        `${s.name} carries ${r.name}'s banner on every patrol. Crossing ${s.name} is treated as heresy, and heresy is punished by ${s.name}.`, colour: true },
    ], ['religious', 'military']),
    tension: pairProse('t', [
      { line: (r, s) => `${r.name} and ${s.name} disagree on a question of method that neither will put into writing.`, colour: true },
      { line: (r, s) => `A penitent has brought ${r.name} a case that pits doctrine against ${s.name}'s order. It has not been resolved, and it will not stay private.`, colour: true },
      { line: (r, s) => `The crowd that obeys them both has begun to notice it is one crowd. So has ${s.name}.`, colour: true },
      { line: (r, s, f) =>
        `${r.name} has declared a holy day on which no ${f.member} may bear arms. ${s.name} has a patrol scheduled for it.`, colour: true },
      { line: (r, s) =>
        `${s.name}'s men have started praying at a different shrine. ${r.name} counts the empty places at every service.`, needs: ["institution: temple"] },
      { line: (r, s) =>
        `${r.name} wants an armed march against a rival sect. ${s.name} has counted the cost in men and wants to wait a year.`, colour: true },
      (r, s, f) =>
        `A ${f.member} under ${s.name} stands accused of sacrilege. ${r.name} demands a church trial; ${s.name} wants a court-martial.`,
      { line: (r, s) => `${s.name} has started giving orders in the name of the faith without consulting ${r.name}.`, colour: true },
    ], ['religious', 'military']),
    type: 'ally',
  },
  rel_crim_fraud: {
    label: 'Institutional Cover',
    desc: pairProse('d', [
      { line: (r, s) =>
        `${r.name}'s good name gives ${s.name}'s crew a respectable face, a room to meet in, and a reason for money nobody could otherwise explain.`, colour: true },
      { line: (r, s) =>
        `${s.name}'s money goes into ${r.name}'s alms box and comes out clean, and nobody checks ${r.name}'s accounts.`, colour: true },
      { line: (r, s) =>
        `${r.name} lends the holiness and ${s.name} brings the money, and the faithful, knowing nothing, provide the cover.`, colour: true },
      { line: (r, s) =>
        `${s.name}'s crew meets in the crypt beneath ${r.name}'s shrine after evening prayers. ${r.name} keeps the only key.`, needs: ["institution: temple"] },
      { line: (r, s) =>
        `${r.name} records ${s.name}'s payments as gifts from a pious donor. The donor has never attended a service.`, colour: true },
      { line: (r, s) =>
        `${s.name} funds ${r.name}'s alms, and ${r.name} vouches for ${s.name}'s good character to anyone who asks. Both are paid in the same coin.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s charity runs the soup kitchen, and ${s.name}'s couriers collect their parcels from the kitchen's back door.`, colour: true },
      { line: (r, s) =>
        `${r.name} hears ${s.name}'s confession each week and keeps ${s.name}'s accounts each month. Neither duty is written down.`, colour: true },
    ], ['religious', 'criminal']),
    tension: pairProse('t', [
      { line: (r, s) => `${r.name} has a genuine crisis of conscience that ${s.name} is not prepared to accommodate.`, colour: true },
      { line: (r, s) => `A visiting cleric has asked to audit the shrine's books. ${s.name} has offered to handle it.`, needs: ["institution: temple"] },
      { line: (r, s) => `${r.name} has started keeping a second set of records. Confession, of a kind.`, colour: true },
      { line: (r, s) =>
        `A member of ${r.name}'s congregation saw ${s.name}'s men carrying crates out of the shrine at night, and has asked ${r.name} about it twice.`, needs: ["institution: temple"] },
      { line: (r, s) =>
        `${s.name} wants to store weapons beneath ${r.name}'s altar. ${r.name} has refused once and been asked again.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s superior is coming to inspect the shrine's accounts. ${s.name}'s gifts make up half the income.`, needs: ["institution: temple"] },
      { line: (r, s) => `${r.name} preached a sermon on theft last week. ${s.name} took it personally.`, colour: true },
      { line: (r, s) =>
        `${s.name} has asked ${r.name} to marry two of the crew under false names. ${r.name} has not set a date.`, colour: true },
    ], ['religious', 'criminal']),
    type: 'ally',
  },
  mag_crim_market: {
    label: 'Arcane Supplier',
    desc: pairProse('d', [
      { line: (r, s) =>
        `${r.name} supplies ${s.name}'s people with reagents, false papers and the odd forgery only a trained hand could make.`, colour: true },
      { line: (r, s) =>
        `When ${s.name}'s network needs a seal copied, a face forgotten, or a document aged thirty years, the work arrives through ${r.name} and is never signed.`, colour: true },
      { line: (r, s) =>
        `${r.name} takes commissions from ${s.name} that no guild register records: small workings, expertly done, each one deniable and none of them innocent.`, colour: true },
      { line: (r, s) =>
        `${r.name} brews what ${s.name} sells: sleeping draughts, truth-tinctures, and inks that vanish after a day.`, colour: true },
      { line: (r, s) =>
        `${s.name} brings ${r.name} the jobs and the payment, and ${r.name} asks no questions about who the work is for.`, colour: true },
      { line: (r, s) => `${r.name}'s workshop has a back door, and ${s.name}'s couriers are the only ones who use it.`, colour: true },
      { line: (r, s) =>
        `${r.name} supplies ${s.name}'s network with wards against detection. Each ward is sold at triple the guild price.`, needs: ["guild"] },
      { line: (r, s) =>
        `${s.name} pays ${r.name} a retainer to be ready at any hour. Twice this year, ${r.name} has been called out before dawn.`, colour: true },
    ], ['magic', 'criminal']),
    tension: pairProse('t', [
      { line: (r, s) =>
        `The last commission left traces that a determined investigator might find. ${r.name} is reconsidering the relationship.`, colour: true },
      { line: (r, s) => `${s.name} has begun asking for workings of a different order: the kind with witnesses. ${r.name} has not yet said no.`, colour: true },
      { line: (r, s) => `Another practitioner has noticed ${r.name}'s signature in the residue. Professional courtesy has limits.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s apprentice has started asking where the night commissions go. ${s.name} has noticed the apprentice.`, colour: true },
      { line: (r, s) => `${s.name} owes ${r.name} for three months of work and has offered information instead of coin.`, colour: true },
      { line: (r, s) =>
        `A ward ${r.name} made for ${s.name} failed during a robbery. ${s.name} blames the ward; ${r.name} blames the thief.`, colour: true },
      { line: (r, s) =>
        `The guild has summoned ${r.name} to explain a shortfall in licensed components. ${s.name}'s orders account for the missing stock.`, needs: ["guild"] },
      { line: (r, s) =>
        `${r.name} has been offered a guild post that requires a clean record. ${s.name} has a list of everything ${r.name} has made.`, needs: ["guild"] },
    ], ['magic', 'criminal']),
    type: 'patron_client',
  },
  gov_econ_dependence: {
    label: 'Financial Dependence',
    desc: pairProse('d', [
      { line: (r, s) =>
        `${r.name} pays for the common works with money borrowed from ${s.name}. ${r.name} cannot cross ${s.name}, and ${s.name} makes sure ${r.name} remembers it.`, colour: true },
      { line: (r, s) =>
        `${s.name} holds the debts ${r.name} has run up, and so ${s.name} decides what ${r.name} can afford to do.`, colour: true },
      { line: (r, s) =>
        `Every civic project ${r.name} announces has first been costed, quietly, in ${s.name}'s counting-room. The public believes the order is the other way around.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s treasury borrowed from ${s.name} to cover a bad harvest and has borrowed every year since. The interest is paid before the wages.`, colour: true },
      { line: (r, s) =>
        `${s.name} holds the settlement's tax rolls as security for its loans. ${r.name} cannot raise a levy without ${s.name}'s clerks counting it first.`, colour: true },
      { line: (r, s) =>
        `${r.name} owes ${s.name} more than the settlement collects in two years of taxes. ${s.name} is paid first, every quarter.`, colour: true },
      { line: (r, s) =>
        `${s.name} lends and ${r.name} spends. The council's decisions are made in ${r.name}'s chamber and approved in ${s.name}'s counting-house.`, excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) => `${r.name} governs on ${s.name}'s credit. Every loan renewed adds one more condition to the next.`, colour: true },
    ], ['government', 'economy']),
    tension: pairProse('t', [
      { line: (r, s) => `${r.name} has identified an alternative creditor. ${s.name} has heard the same rumour.`, colour: true },
      { line: (r, s) => `The interest falls due at midsummer and the treasury will not cover it. ${s.name} has already drafted the terms of the extension.`, colour: true },
      { line: (r, s) => `A faction on the council wants the debt repudiated outright. ${r.name} has stopped disagreeing in public.`, excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) =>
        `${s.name} has asked for a seat on the council as a condition of the next loan. ${r.name} has three weeks to answer.`, excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) =>
        `${r.name} has proposed a new tax to clear the debt. ${s.name}'s friends on the council will vote against it.`, excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) =>
        `${s.name} is calling in a third of the debt at once. ${r.name} has until the next quarter day to find it.`, colour: true },
      { line: (r, s) =>
        `${r.name} has started borrowing small sums from ${s.name}'s rivals. ${s.name}'s clerks have seen the receipts.`, colour: true },
      { line: (r, s) =>
        `${s.name} has refused credit for the winter grain stores. ${r.name} must choose between the creditor and the granary.`, needs: ["institution: granary"] },
    ], ['government', 'economy']),
    type: 'debtor_creditor',
  },
  gov_mil_friction: {
    label: 'Jurisdictional Tension',
    desc: pairProse('d', [
      { line: (r, s) =>
        `${r.name} and ${s.name} have argued for years over where ${r.name}'s authority ends and ${s.name}'s begins, and neither has given ground.`, colour: true },
      { line: (r, s) =>
        `${r.name} gives orders that ${s.name} treats as advice, and ${s.name} acts in ways ${r.name} calls disobedience.`, colour: true },
      { line: (r, s) =>
        `The line between ${r.name}'s authority and ${s.name}'s has been redrawn four times, and each of them still follows whichever version suits them.`, colour: true },
      { line: (r, s, f) =>
        `${r.name} controls the ${f.body}'s pay and ${s.name} controls its swords. Each uses their half to bargain for the other's.`, colour: true },
      { line: (r, s) =>
        `${s.name} reports to ${r.name} on paper and to no one in practice. ${r.name} has three letters of complaint unanswered.`, colour: true },
      { line: (r, s) =>
        `${r.name} wants the watch under civil command; ${s.name} wants the council out of the barracks. They meet monthly and settle nothing.`, needs: ["watch","garrison"], excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) =>
        `${r.name} sets the curfew and ${s.name} decides whether to enforce it. The two have not agreed on a curfew in a year.`, colour: true },
      { line: (r, s) =>
        `${s.name} answers ${r.name}'s summons late and leaves early. ${r.name} now issues them in writing so the delays are on record.`, colour: true },
    ], ['government', 'military']),
    tension: pairProse('t', [
      { line: (r, s) => `An incident is coming that will force the issue between ${r.name} and ${s.name}, and both are positioning for it.`, colour: true },
      { line: (r, s) => `A prisoner is held under ${r.name}'s authority and ${s.name}'s at once, and neither will release the paperwork first.`, colour: true },
      (r, s) => `${s.name} has begun drilling in the square without asking. ${r.name} has begun writing letters to the capital.`,
      { line: (r, s, f) =>
        `${r.name} has cut the ${f.body}'s pay to fund the market repairs. ${s.name} has told the ${f.members} who signed the order.`, needs: ["market"] },
      { line: (r, s) =>
        `${s.name} arrested a councillor's son without ${r.name}'s warrant. ${r.name} has demanded his release by tomorrow.`, excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) =>
        `${r.name} has asked the capital to replace ${s.name}. ${s.name} has asked the capital to dissolve ${r.name}'s council.`, excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) =>
        `A riot is expected on the next market day, and ${r.name} and ${s.name} have issued opposite orders for it.`, needs: ["market"] },
      { line: (r, s, f) =>
        `${s.name} has begun collecting a road toll for the ${f.body}. ${r.name} calls it theft from the treasury.`, colour: true },
    ], ['government', 'military']),
    type: 'political',
  },
  peer_rivalry: {
    label: 'Professional Rivalry',
    desc: pairProse('d', [
      { line: (r, s) =>
        `${r.name} and ${s.name} want the same thing and compete hard for it, but neither has let it turn into hatred.`, colour: true },
      { line: (r, s) =>
        `Only one of ${r.name} and ${s.name} can come out ahead, and both know it. They stay polite and give no ground.`, colour: true },
      { line: (r, s) =>
        `Every gain ${r.name} makes, ${s.name} answers within the season, and people here have learned to expect it.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} bid for the same contracts and sit at the same tables. Each counts the other's wins more carefully than their own.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} trained together and have competed ever since. The settlement keeps score, and so do they.`, colour: true },
      { line: (r, s) =>
        `${r.name} wants ${s.name}'s position, and ${s.name} wants ${r.name}'s reputation. They are civil in public and unforgiving in private.`, colour: true },
      { line: (r, s) =>
        `Every client ${r.name} wins is one ${s.name} lost, and the reverse. The two keep a polite distance and an exact tally.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} are rivals for the same patron's favour. Each has spent the year trying to be first through the patron's door.`, colour: true },
    ]),
    tension: pairProse('t', [
      { line: (r, s) => `A decision coming next season will favour ${r.name} or ${s.name} heavily, and both of them know it.`, colour: true },
      { line: (r, s) => `A patron they share has let it be known there is room for only ${r.name} or ${s.name} at the next table.`, colour: true },
      { line: (r, s) => `${r.name} has recently broken an unwritten rule of the contest. ${s.name} is deciding what that permits.`, colour: true },
      { line: (r, s) => `${r.name} has hired away ${s.name}'s best assistant. ${s.name} has said nothing about it, to anyone.`, colour: true },
      { line: (r, s) => `A post opens at midsummer, and only ${r.name} or ${s.name} can fill it.`, colour: true },
      { line: (r, s) =>
        `${s.name} has been telling clients that ${r.name}'s work is slipping. Two of the clients have repeated it to ${r.name}.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} will both present proposals at the next council session. Only one will be accepted.`, excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) => `${r.name} lost the last contract to ${s.name} by a single vote, and has learned who cast it.`, colour: true },
    ]),
    type: 'rival',
  },
  mentor_legacy: {
    label: 'Mentor and Successor',
    desc: pairProse('d', [
      { line: (r, s) => `${r.name} made ${s.name}'s career, and ${s.name} rarely says so.`, colour: true },
      { line: (r, s) =>
        `${s.name} owes their place to ${r.name} and has kept others from climbing the same way. The two of them remember it differently.`, colour: true },
      { line: (r, s) => `${r.name} taught ${s.name} everything, including how to get the better of ${r.name}.`, colour: true },
      { line: (r, s) =>
        `${r.name} took ${s.name} in as an apprentice and taught them the trade, the clients, and the names worth knowing.`, colour: true },
      { line: (r, s) =>
        `${s.name} learned the work at ${r.name}'s side for seven years. Half of ${s.name}'s clients first came through ${r.name}'s door.`, colour: true },
      { line: (r, s) => `${r.name} vouched for ${s.name} when nobody else would. ${s.name}'s first post came from that word.`, colour: true },
      { line: (r, s) =>
        `${s.name} still uses ${r.name}'s methods and ${r.name}'s ledger format. Everyone who sees ${s.name}'s work recognises the teacher.`, colour: true },
      { line: (r, s) => `${r.name} named ${s.name} as successor in front of witnesses. The formal handover has not happened.`, colour: true },
    ]),
    tension: pairProse('t', [
      { line: (r, s) =>
        `${s.name} now operates in ways ${r.name} would not approve of. Neither discusses the divergence directly.`, colour: true },
      { line: (r, s) => `${r.name} has one favour left to call in, and is saving it. ${s.name} knows, and is watching for it.`, colour: true },
      { line: (r, s) => `A third party has asked ${r.name}, quietly, whether ${s.name} can be trusted. The answer took too long.`, colour: true },
      { line: (r, s) => `${s.name} has taken on a client ${r.name} turned away on principle.`, colour: true },
      { line: (r, s) =>
        `${r.name} has taken a new apprentice, and ${s.name} has heard the apprentice is being taught things ${s.name} never was.`, colour: true },
      { line: (r, s) => `${s.name} corrected ${r.name} in public last month, and was right.`, colour: true },
      { line: (r, s) =>
        `${r.name} has asked ${s.name} for a loan. It is the first time a debt between teacher and student has run that way.`, colour: true },
      { line: (r, s) => `${s.name} has begun teaching ${r.name}'s methods as ${s.name}'s own.`, colour: true },
    ]),
    type: 'mentor_student',
  },
  mutual_leverage: {
    label: 'Mutual Leverage',
    desc: pairProse('d', [
      { line: (r, s) =>
        `${r.name} and ${s.name} each hold information or resources the other needs. They cooperate efficiently and neither trusts the other at all.`, colour: true },
      { line: (r, s) =>
        `${r.name} knows enough to ruin ${s.name}, and ${s.name} holds enough to finish ${r.name}, so the two of them work together very carefully.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} deal with each other slowly and politely, each knowing one slip could ruin them both.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} trade favours on a strict count. Neither has ever been more than one favour ahead.`, colour: true },
      { line: (r, s) =>
        `${r.name} controls a vote ${s.name} needs, and ${s.name} controls a supply ${r.name} needs. Their meetings are short and their bargains hold.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} each have something to trade and nothing to give away. They meet in private, bargain hard, and keep every bargain.`, colour: true },
      { line: (r, s) =>
        `${s.name} needs ${r.name}'s seal on certain papers; ${r.name} needs ${s.name}'s silence about certain others. Neither has asked for more than the other could pay.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} sit on opposite sides of most questions and vote together on the few that touch their shared interests.`, colour: true },
    ]),
    tension: pairProse('t', [
      { line: (r, s) => `The balance between ${r.name} and ${s.name} has recently shifted. ${s.name} has noticed; ${r.name} has not, yet.`, colour: true },
      { line: (r, s) => `A document ${r.name} and ${s.name} each believed only they possessed has turned up in someone else's hands.`, colour: true },
      { line: (r, s) => `${s.name} has recently secured something that makes ${r.name}'s hold obsolete. The politeness continues, for now.`, colour: true },
      { line: (r, s) => `${r.name} has asked ${s.name} for a second favour before repaying the first.`, colour: true },
      { line: (r, s) => `${s.name} has found a new source for what ${r.name} supplies. ${r.name} has not been told.`, colour: true },
      { line: (r, s) => `The vote ${s.name} needs from ${r.name} comes up next week, and ${r.name} has named a new price.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s secret is about to come out by other means. Once it does, ${s.name} holds nothing over ${r.name}.`, colour: true },
      { line: (r, s) => `${s.name} has written down what ${r.name} owes and left a copy with a notary.`, colour: true },
    ]),
    type: 'political',
  },
  wary_alliance: {
    label: 'Pragmatic Alliance',
    desc: pairProse('d', [
      { line: (r, s) =>
        `${r.name} and ${s.name} work together because fighting each other would cost them both more, and both of them know it.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} are allies because each has reckoned what the other would cost as an enemy. The friendship is warm and public, and it lasts only while that reckoning holds.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} joined against a threat that has since passed, and each is now asking what the alliance is still for.`, colour: true },
      { line: (r, s) => `${r.name} and ${s.name} share a council bloc and a list of enemies. They do not share their plans.`, excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) => `${r.name} and ${s.name} back each other in public and check each other's work in private.`, colour: true },
      { line: (r, s) =>
        `${r.name} brings the votes and ${s.name} brings the money. The alliance is three years old and has won every vote it needed.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} signed a pact after their last quarrel cost them both. They keep to its terms exactly.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} are allies with separate interests. They meet to coordinate and leave by different doors.`, colour: true },
    ]),
    tension: pairProse('t', [
      { line: (r, s) => `Someone else is working to pull ${r.name} and ${s.name} apart.`, colour: true },
      { line: (r, s) => `The threat that brought ${r.name} and ${s.name} together is gone. Neither has said so aloud.`, colour: true },
      { line: (r, s) => `${r.name} has taken a precaution against ${s.name} that ${s.name} was not meant to discover. ${s.name} has discovered it.`, colour: true },
      { line: (r, s) => `${s.name} has been dining with ${r.name}'s rivals. ${r.name} heard about it from a servant.`, colour: true },
      { line: (r, s) =>
        `${r.name} wants to bring a third member into the alliance. ${s.name} thinks the newcomer would take ${s.name}'s place.`, colour: true },
      { line: (r, s) =>
        `${s.name} voted against ${r.name} on a small matter last week. ${r.name} is waiting to see whether it was small.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} both want the same office, and the alliance cannot survive one of them winning it.`, colour: true },
      { line: (r, s) =>
        `${s.name} has asked ${r.name} to back a candidate ${r.name} distrusts. Refusing would cost the alliance its majority.`, colour: true },
    ]),
    type: 'ally',
  },
  genuine_respect: {
    label: 'Genuine Respect',
    desc: pairProse('d', [
      { line: (r, s) =>
        `${r.name} and ${s.name} have each watched the other do good work. They argue, but each trusts the other's judgment in their own field.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} disagree often and trust completely. Each has watched the other be right at cost, and neither forgets it.`, colour: true },
      { line: (r, s) =>
        `There is no arrangement between ${r.name} and ${s.name}, only a long record of kept words; in this settlement that makes them remarkable.`, colour: true },
      { line: (r, s) =>
        `${r.name} sends difficult cases to ${s.name}, and ${s.name} sends them back solved. Neither has ever charged the other a fee.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} have stood on opposite sides of three disputes and praised each other after every one.`, colour: true },
      { line: (r, s) =>
        `${s.name} once told the council that ${r.name} was right and ${s.name} was wrong. ${r.name} has not forgotten it.`, excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) =>
        `${r.name} and ${s.name} consult each other before any decision that matters. The advice is honest and is always taken seriously.`, colour: true },
      { line: (r, s) =>
        `${r.name} trusts ${s.name}'s word over any written contract. ${s.name} has never given a reason to regret it.`, colour: true },
    ]),
    tension: pairProse('t', [
      { line: (r, s) => `${r.name} and ${s.name} are about to be on opposite sides of an important decision.`, colour: true },
      { line: (r, s) => `${r.name} is being pressed to act against ${s.name}, and has not mentioned it.`, colour: true },
      { line: (r, s) => `${r.name} and ${s.name} still respect each other, but what each of them wants is pulling apart, and both can see it.`, colour: true },
      { line: (r, s) => `${r.name} has learned something about ${s.name}'s family that ${s.name} does not know.`, colour: true },
      { line: (r, s) => `${s.name} has been offered ${r.name}'s post by people who want ${r.name} gone.`, colour: true },
      { line: (r, s) => `${r.name} has made a mistake that ${s.name} is bound to report. ${s.name} has not reported it.`, colour: true },
      { line: (r, s) =>
        `The council has asked ${r.name} and ${s.name} to audit each other's accounts. Both agreed, and neither is comfortable.`, excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) =>
        `${s.name} has publicly backed a plan that ${r.name} thinks will fail. ${r.name} has said so once, in private.`, colour: true },
    ]),
    type: 'respect',
  },
  old_debt: {
    label: 'Outstanding Debt',
    desc: pairProse('d', [
      { line: (r, s) => `${r.name} owes ${s.name} a great deal, and neither has ever said so aloud.`, colour: true },
      { line: (r, s) =>
        `Years ago ${s.name} did ${r.name} a favour too large to repay, and ${r.name} has been paying it back in small ways ever since.`, colour: true },
      { line: (r, s) =>
        `${r.name} owes ${s.name} for an old kindness. Neither mentions it, and both know exactly how much is still owed.`, colour: true },
      { line: (r, s) =>
        `${s.name} paid ${r.name}'s bail eleven years ago and has never mentioned it. ${r.name} mentions it to no one.`, colour: true },
      { line: (r, s) =>
        `${r.name} owes ${s.name} a large sum in coin, borrowed in a bad year and repaid in small amounts ever since.`, colour: true },
      { line: (r, s) =>
        `${s.name} kept ${r.name}'s name out of a scandal that ruined two others. ${r.name} has voted with ${s.name} ever since.`, colour: true },
      { line: (r, s) =>
        `${s.name} nursed ${r.name} through a winter fever when no one else would come. ${r.name} still owes the debt and still knows it.`, colour: true },
      { line: (r, s) => `${r.name} borrowed ${s.name}'s good name to win a post. ${s.name} has never asked for it back.`, colour: true },
    ]),
    tension: pairProse('t', [
      { line: (r, s) => `${s.name} is about to call it in.`, colour: true },
      { line: (r, s) => `${r.name} has begun to act like someone who considers the debt paid. ${s.name} does not.`, colour: true },
      { line: (r, s) => `Someone else has learned what favour ${r.name} owes ${s.name}, and now has a hold on ${r.name} too.`, colour: true },
      { line: (r, s) =>
        `${s.name} has asked ${r.name} for a vote against ${r.name}'s own interests. It is the first payment ${s.name} has asked for.`, colour: true },
      { line: (r, s) => `${r.name} has started repaying the debt in coin. ${s.name} wants it repaid in favours.`, colour: true },
      { line: (r, s) => `${s.name} has mentioned the debt aloud, at a dinner, in front of ${r.name}'s partners.`, colour: true },
      { line: (r, s) => `${r.name} has refused ${s.name} a small favour for the first time in years.`, colour: true },
      { line: (r, s) => `${s.name} has fallen on hard times, and the debt ${r.name} owes is now the only asset ${s.name} has.`, colour: true },
    ]),
    type: 'debtor_creditor',
  },
  family_complication: {
    label: 'Family Complication',
    desc: pairProse('d', [
      { line: (r, s) =>
        `${r.name} and ${s.name} are family, which suits neither of their careers. Everyone knows it, and nobody mentions it.`, colour: true },
      { line: (r, s) =>
        `Blood ties ${r.name} to ${s.name} in a way that neither career can afford; they meet at funerals and weddings and pretend the rest of the year does not exist.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} are family, but in business they deal with each other as if they were not related.`, colour: true },
      { line: (r, s) =>
        `${r.name} married into ${s.name}'s family. ${s.name} opposed the match and still calls ${r.name} by surname.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} are cousins on opposite sides of the settlement's politics. Their grandmother still seats them together.`, colour: true },
      { line: (r, s) => `${s.name} is ${r.name}'s half-sibling, raised in the same house and left out of the same will.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} are in-laws. They are polite at family dinners and avoid each other everywhere else.`, colour: true },
      { line: (r, s) =>
        `${r.name} is godparent to ${s.name}'s eldest child. The tie was made before their careers set them against each other.`, colour: true },
    ]),
    tension: pairProse('t', [
      { line: (r, s) => `An inheritance, a title or a secret is about to make the tie between ${r.name} and ${s.name} impossible to ignore.`, colour: true },
      { line: (r, s) => `A younger relative has begun trading on the connection ${r.name} and ${s.name} both refuse to use.`, colour: true },
      { line: (r, s) => `The family has taken a side in a quarrel between ${r.name} and ${s.name}, and both of them think it is the wrong side.`, colour: true },
      { line: (r, s) => `${r.name}'s child wants to marry into ${s.name}'s household. Neither parent has given an answer.`, colour: true },
      { line: (r, s) =>
        `${s.name} has gone into business against ${r.name}'s partners, and the family expects ${r.name} to keep the peace.`, colour: true },
      { line: (r, s) =>
        `A family property must be sold, and ${r.name} and ${s.name} each want the money for a different purpose.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s rivals have learned that ${s.name} is family, and have started asking ${s.name} questions.`, colour: true },
      { line: (r, s) =>
        `The family has asked ${r.name} and ${s.name} to end their quarrel before the next feast. Neither will apologise first.`, colour: true },
    ]),
    type: 'family',
  },
  bitter_history: {
    label: 'Unresolved History',
    desc: pairProse('d', [
      { line: (r, s) =>
        `Something happened between ${r.name} and ${s.name} years ago that neither has forgotten. They function professionally. They do not forgive.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} were close once, and whatever broke between them is the one subject neither will discuss.`, colour: true },
      { line: (r, s) =>
        `The quarrel between ${r.name} and ${s.name} is old enough that no one else remembers the cause. They remember. They have simply stopped explaining.`, colour: true },
      (r, s) =>
        `${r.name} testified against ${s.name} in a case ten years ago. ${s.name} lost a fortune and has not spoken to ${r.name} since.`,
      { line: (r, s) =>
        `${s.name} took the post ${r.name} had been promised. ${r.name} has treated ${s.name} as an enemy from that day.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} were partners until one of them emptied the shared account. Each says it was the other.`, colour: true },
      { line: (r, s) => `${r.name} blames ${s.name} for a death in ${r.name}'s family. ${s.name} has never denied it.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} fought a duel in their youth. Both survived, and the scar is on ${s.name}'s face.`, colour: true },
    ]),
    tension: pairProse('t', [
      { line: (r, s) => `What first broke ${r.name} and ${s.name} apart is happening again, and both of them know it.`, colour: true },
      { line: (r, s) => `${r.name} and ${s.name} each think the other owes the apology.`, colour: true },
      { line: (r, s) => `A newcomer keeps trying to reconcile ${r.name} and ${s.name}, and is about to learn why nobody else does.`, colour: true },
      (r, s) => `${s.name} has been appointed to judge a case in which ${r.name} is a party.`,
      { line: (r, s) => `${r.name} has found the document that proves what ${s.name} did, and has kept it locked away.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} have been placed on the same council committee. The first meeting is next week.`, excludes: ["ruler: lord","ruler: occupier"] },
      { line: (r, s) => `${s.name}'s child has asked to apprentice with ${r.name}. ${r.name} has not refused.`, colour: true },
      { line: (r, s) => `${r.name} has learned that ${s.name} is in debt and could be ruined by one call on a loan.`, colour: true },
    ]),
    type: 'enemy',
  },
};

// THE HANDLER TIE'S ARCHETYPES (the allegiance train, car 1, ALLEGIANCE-CAR1, 2026-11-08; the design §1.5): an
// agent's one outgoing tie runs to its handler, its kind from the vector on the card (never re-rolled; fear's four
// leverage sub-kinds drawn on the agent's tie fork). WRITE-PEOPLE's lines (data/people/handlerTieLines.js, every
// one for the owner's veto) wrapped in THIS file's own pairProse, so the one-index draw
// (relationshipArchetypes.js :: createTieProseDraw) holds unchanged; each styles as an existing
// RELATIONSHIP_STRENGTHS type. A table BESIDE STRESS_ECONOMIC_EFFECTS, never inside it: the stress table's roll
// (computeRelTension) and its census declarations stay exactly as they were.
export const HANDLER_TIE_ARCHETYPES = Object.freeze(Object.fromEntries(Object.entries(HANDLER_TIE_LINES).map(([key, row]) => [key, Object.freeze({
  label: row.label,
  desc: pairProse('d', row.desc),
  tension: pairProse('t', row.tension),
  type: row.type,
})])));

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

/**
 * DECLARED SIBLINGS (CENSUS-1c unit 1; `docs/DESIGN_POOL_CENSUS.md` §3.1, the twin tables
 * dissolved): the inland twins of this file's goal and loyalty-hook lines (F5). Each set is the original line, declaring what it presumes, and beside it its
 * twin with the complementary atom (`twinOf` the original). The original stays where this table's
 * string consumers read it; the draw site resolves a drawn key through
 * `domain/facts/drawDeclared.js :: resolveSibling` (the original if the record admits it, else the
 * twin). Retired from the text-keyed tables `defenceTwinLines.js` / `inlandHookLines.js` (F5, F10),
 * every twin to the byte. VETOABLE wording, as before (the owner's).
 */
export const NPC_HOOK_SIBLINGS = Object.freeze({
  // NPC_FACTION_GOALS — the Guard Captain's goal.
  'Find the person responsible for three unsolved dock-side killings': Object.freeze([
    Object.freeze({ text: 'Find the person responsible for three unsolved dock-side killings', needs: Object.freeze(['navigable']) }),
    Object.freeze({ text: 'Find the person responsible for three unsolved killings', twinOf: 'Find the person responsible for three unsolved dock-side killings', excludes: Object.freeze(['navigable']) }),
  ]),
  // NPC_FACTION_LOYALTY — the economy loyalty hook.
  'A valuable cargo was reported lost at sea. The manifest has reappeared in a market two settlements away.': Object.freeze([
    Object.freeze({ text: 'A valuable cargo was reported lost at sea. The manifest has reappeared in a market two settlements away.', needs: Object.freeze(['navigable']) }),
    Object.freeze({ text: 'A valuable cargo was reported lost on the road. The manifest has reappeared in a market two settlements away.', twinOf: 'A valuable cargo was reported lost at sea. The manifest has reappeared in a market two settlements away.', excludes: Object.freeze(['navigable']) }),
  ]),
});
