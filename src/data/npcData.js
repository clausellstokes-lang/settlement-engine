// npcData.js — NPC table data extracted from npcGenerator.js
// All constants exported for use by npcGenerator.js

export const MANNERISMS = [
  "drums fingers on surfaces when thinking",
  "never makes direct eye contact with inferiors",
  "touches a specific piece of jewellery when stressed",
  "quotes scripture or proverbs in casual conversation",
  "keeps meticulous written records of every meeting",
  "always stands when others sit, or vice versa",
  "laughs loudly at their own jokes, silently at others'",
  "cleans or fidgets with their hands constantly",
  "addresses everyone by full name, never shortened",
  "pauses for exactly three seconds before answering any question",
  "carries food or sweets, offers them as social lubricant",
  "unconsciously mimics the posture of whoever they're speaking to",
  "refuses to sit with their back to a door",
  "hums under their breath when concentrating",
  "keeps a coin or token that they flip when making decisions",
  "never volunteers information — only answers what is asked",
  "speaks of themselves in the third person when angry",
  "checks exits in every new room before speaking",
  "maintains an unnervingly fixed smile during conflict",
  "takes written notes during conversations, even casual ones",
  "taps their foot in a complex rhythm when bored",
  "never eats or drinks anything offered by a stranger without watching others first",
  "uses elaborate, florid greetings regardless of context",
  "deflects personal questions with a counter-question",
  "keeps their hands clasped behind their back when displeased",
  "always arrives fifteen minutes early — and comments when others do not",
  "repeats the last word of a sentence spoken to them before responding",
  "traces patterns on flat surfaces absentmindedly",
  "flinches slightly at raised voices even when calm",
  "makes deliberate, theatrical eye contact to assert dominance"
];

export const SPEECH_PATTERNS = [
  "Speaks in short, clipped sentences — every word intentional",
  "Verbose and elaborate; takes three sentences where one would do",
  "Peppers speech with trade or craft jargon even in unrelated contexts",
  "Speaks softly, forcing others to lean in",
  "Asks rhetorical questions to make points rather than stating them",
  "Uses the formal royal 'we' — old habit from a previous station",
  "Pauses mid-sentence to choose words with visible care",
  "Deflects personal questions with philosophical tangents",
  "Speaks as if dictating a letter — formal even in crisis",
  "Tells anecdotes that never quite reach the point",
  "Uses understatement and dry humour as a defence mechanism",
  "Defaults to numbers and specifics — 'three days', never 'some days'",
  "Refers to past events as though they're common knowledge",
  "Uses softening phrases that make every statement sound like a question",
  "Swears colourfully but apologises immediately after",
  "Speaks in analogies and metaphors, even when clarity would serve better",
  "Drops to a near-whisper when saying something important",
  "Repeats key words for emphasis: 'The contract. The contract is clear'",
  "Addresses strangers formally and familiars by diminutives",
  "Uses long pauses as punctuation — sits comfortably in silence"
];

export const NPC_RELIGION_DATA = {
  positive: [
    "honest",
    "brave",
    "compassionate",
    "wise",
    "loyal",
    "generous",
    "patient",
    "humble",
    "diligent",
    "fair-minded",
    "optimistic",
    "charismatic",
    "clever",
    "principled",
    "protective",
    "diplomatic",
    "resourceful",
    "scholarly",
    "pious",
    "merciful",
    "tenacious",
    "methodical",
    "intuitive",
    "perceptive",
    "steadfast",
    "magnanimous",
    "incorruptible",
    "warm-hearted",
    "level-headed",
    "forthright"
  ],
  negative: [
    "greedy",
    "arrogant",
    "cruel",
    "cowardly",
    "deceitful",
    "wrathful",
    "lazy",
    "envious",
    "suspicious",
    "stubborn",
    "vain",
    "ruthless",
    "manipulative",
    "vengeful",
    "corrupt",
    "paranoid",
    "callous",
    "hypocritical",
    "petty",
    "domineering",
    "reckless",
    "bitter",
    "vindictive",
    "self-serving",
    "dismissive",
    "volatile",
    "overbearing",
    "mendacious",
    "cold-blooded",
    "imperious"
  ],
  neutral: [
    "pragmatic",
    "ambitious",
    "calculating",
    "secretive",
    "eccentric",
    "melancholic",
    "stoic",
    "cynical",
    "cautious",
    "proud",
    "reserved",
    "methodical",
    "traditionalist",
    "iconoclast",
    "opportunistic",
    "perfectionist",
    "fatalistic",
    "idealistic",
    "zealous",
    "hedonistic",
    "detached",
    "mercurial",
    "inscrutable",
    "superstitious",
    "brooding",
    "theatrical",
    "nostalgic",
    "contrarian",
    "restless",
    "obsessive"
  ]
};

export const NPC_AGE_DATA = {young:["early twenties","mid-twenties","late twenties"],middle:["early thirties","mid-thirties","late thirties","early forties","mid-forties"],mature:["late forties","early fifties","mid-fifties","late fifties"],elder:["early sixties","mid-sixties","late sixties","seventies"]};

export const NPC_PLOT_HOOKS={
  government: [
    {
      impression: "Efficient, slightly distracted — someone with too many things in their head and a practised way of not showing it.",
      disposition: "transactional"
    },
    {
      impression: "Warmer than their office suggests. They have the gift of making people feel briefly important.",
      disposition: "welcoming"
    },
    {
      impression: "Formally polite. Every sentence is measured before it leaves their mouth.",
      disposition: "cautious"
    },
    {
      impression: "Tired. Not rudely, but visibly — this is a person who has been doing a hard job for a long time.",
      disposition: "cautious"
    }
  ],
  military: [
    {
      impression: "Direct. They assess you in the first three seconds and their expression tells you they've reached a provisional conclusion.",
      disposition: "cautious"
    },
    {
      impression: "Professionally cordial — the manner of someone who deals with strangers all day and has a system for it.",
      disposition: "transactional"
    },
    {
      impression: "Relaxed in a way that reads as confidence rather than carelessness.",
      disposition: "welcoming"
    },
    {
      impression: "Alert. Not hostile, but attentive in a way that doesn't quite switch off.",
      disposition: "cautious"
    }
  ],
  religious: [
    {
      impression: "Genuinely glad to see you — or performs it so well the difference doesn't matter at first.",
      disposition: "welcoming"
    },
    {
      impression: "Composed. The particular stillness of someone who has practised being still.",
      disposition: "cautious"
    },
    {
      impression: "Interested in you as a person, or at least in what you might need. The attention feels real.",
      disposition: "welcoming"
    },
    {
      impression: "Watchful, in a religious way — not suspicious, but as though taking a reading.",
      disposition: "cautious"
    }
  ],
  economy: [
    {
      impression: "Quick to smile, quick to calculate. Both things are happening simultaneously.",
      disposition: "welcoming"
    },
    {
      impression: "Busy, or presenting as busy. The first impression is of someone who doesn't waste time.",
      disposition: "transactional"
    },
    {
      impression: "Affable. The manner of someone for whom friendliness is both genuine and useful.",
      disposition: "welcoming"
    },
    {
      impression: "Cautious with newcomers — the wariness is professional rather than personal.",
      disposition: "cautious"
    }
  ],
  criminal: [
    {
      impression: "Unremarkable, deliberately. The kind of person you would walk past twice.",
      disposition: "transactional"
    },
    {
      impression: "Helpful in a way that asks for nothing obvious in return. Yet.",
      disposition: "welcoming"
    },
    {
      impression: "Friendly, easy, slightly too interested in where you're from.",
      disposition: "welcoming"
    },
    {
      impression: "Quiet. They let other people fill the silence.",
      disposition: "dismissive"
    }
  ],
  magic: [
    {
      impression: "Elsewhere, mentally. The conversation is happening in the foreground while something else has most of their attention.",
      disposition: "dismissive"
    },
    {
      impression: "Precise — words chosen carefully, pauses before answering, a slight sense of being assessed.",
      disposition: "cautious"
    },
    {
      impression: "Unexpectedly approachable. Whatever you expected, this isn't it.",
      disposition: "welcoming"
    },
    {
      impression: "Polite but removed. Not unfriendly — just operating at a different register.",
      disposition: "dismissive"
    }
  ],
  other: [
    {
      impression: "Ordinary in a way that is itself a kind of presence.",
      disposition: "transactional"
    },
    {
      impression: "Open. The impression of someone with nothing in particular to hide, or who has decided not to hide it.",
      disposition: "welcoming"
    },
    {
      impression: "Tired, but alert. The combination of someone who works hard and pays attention.",
      disposition: "transactional"
    },
    {
      impression: "Reserved. Not hostile — just private.",
      disposition: "cautious"
    }
  ]
};

export const NPC_BUILDS = ["lean and wiry","stocky and broad-shouldered","tall with a slight stoop","average height, unremarkable frame","heavyset and solid","slight — smaller than expected for the role","imposingly tall","compact and powerful","willowy","barrel-chested"];

export const NPC_FEATURES = [
  "a scar cutting through one eyebrow",
  "ink-stained fingers",
  "surprisingly soft hands",
  "eyes that are slightly different colours",
  "a jaw set permanently as if biting back words",
  "hair prematurely grey for their apparent age",
  "an old injury that affects their gait",
  "a ring on every finger",
  "a branded mark they keep covered",
  "laugh lines that run deep",
  "a voice that carries further than intended",
  "teeth that have been replaced with metal",
  "a prosthetic hand, finely crafted",
  "heavy-lidded eyes that suggest either wisdom or exhaustion",
  "a network of small scars on their knuckles",
  "a habit of standing very still",
  "a slight accent",
  "sun-darkened skin that suggests years outdoors",
  "a perpetual half-smile",
  "a cough they suppress with visible effort",
  "unusually long fingers",
  "close-cropped hair",
  "a full beard maintained with military precision",
  "a shaved head with old tattoos",
  "ink-work visible at the collar and cuffs",
  "a sealed letter always tucked in their belt",
  "a cloak clasped with an unusual brooch",
  "eyes that never stop moving"
];

export const NPC_WANTS={
  government: [
    "formal robes of office",
    "expensive but conservative merchant dress",
    "a chain of office worn even off-duty",
    "court attire with discreet personal touches"
  ],
  military: [
    "functional armour with personal sigils",
    "guard uniform kept immaculate",
    "soldier's practical dress with officer's insignia",
    "battle-worn plate they haven't replaced"
  ],
  religious: [
    "religious vestments layered over travelling clothes",
    "simple robes of their order",
    "ceremonial attire worn at all times",
    "plain devotional dress with one opulent accessory"
  ],
  economy: [
    "merchant dress — practical but signalling wealth through material",
    "guild colours worn with pride",
    "clothes that once cost a fortune and now show the miles",
    "well-cut but understated trading clothes"
  ],
  criminal: [
    "nondescript working clothes chosen specifically to be forgettable",
    "fine clothes worn ironically over rougher garments",
    "guard or clergy disguise worn as a habit",
    "whatever is clean — they move frequently"
  ],
  magic: [
    "scholarly robes with heavy pockets",
    "travelling mage's coat covered in small pouches",
    "deceptively plain clothes that crackle faintly with residual energy",
    "formal academic dress worn with absent-minded disregard"
  ],
  other: [
    "clothes practical for their work with one personal flourish",
    "travel-worn but well-maintained gear",
    "second-hand fine clothes that don't quite fit",
    "whatever was available — they don't care about dress"
  ]
};

export const NPC_FACTION_GOALS = {
  Mayor: [
    {
      short: "Navigate a dispute between two powerful guilds without losing either's support",
      long: "Die in office having kept the peace — legacy matters more than wealth",
      driven_by: "protection"
    },
    {
      short: "Cover up a minor corruption scandal before the regional lord hears of it",
      long: "Transform this settlement into a city-state with real independence",
      driven_by: "power"
    },
    {
      short: "Find funding for desperately needed infrastructure repairs",
      long: "Build a political dynasty — their children will inherit influence, not just money",
      driven_by: "power"
    },
    {
      short: "Discredit a council rival before the annual election",
      long: "Write laws that outlast them — real reform, not political theatre",
      driven_by: "reform"
    }
  ],
  Governor: [
    {
      short: "Secure enough grain reserves before winter to prevent unrest",
      long: "Become indispensable to the crown — irreplaceable, never exposed",
      driven_by: "power"
    },
    {
      short: "Root out the faction leaking tax figures to rivals",
      long: "Retire with a fortune and a clean name — in that order",
      driven_by: "wealth"
    }
  ],
  "Council Member": [
    {
      short: "Block a proposal that would undermine their patron's interests",
      long: "Build a coalition that can outvote the merchant bloc on anything",
      driven_by: "power"
    },
    {
      short: "Expose a colleague's corruption without implicating themselves",
      long: "Champion a reform that future councils will still cite by name",
      driven_by: "reform"
    }
  ],
  "Tax Collector": [
    {
      short: "Meet this quarter's collection target without triggering another riot",
      long: "Accumulate enough to buy out of this hated post — any post but this",
      driven_by: "wealth"
    },
    {
      short: "Find a missing merchant whose taxes haven't been filed in six months",
      long: "Build enough goodwill that the settlement mourns them when they go",
      driven_by: "protection"
    }
  ],
  "Chief Magistrate": [
    {
      short: "Close a murder case that has made the merchants nervous",
      long: "Establish a legal precedent that constrains what the nobility can do to commoners",
      driven_by: "justice"
    },
    {
      short: "Resist pressure from a powerful patron to deliver a specific verdict",
      long: "Train a successor who will carry on their judicial philosophy",
      driven_by: "reform"
    }
  ],
  "Guard Captain": [
    {
      short: "Find the person responsible for three unsolved dock-side killings",
      long: "Rebuild guard morale after years of under-funding and low prestige",
      driven_by: "protection"
    },
    {
      short: "Identify which of their officers is on the thieves' guild payroll",
      long: "Die in bed rather than in the street — unusual ambition for the role",
      driven_by: "personal"
    }
  ],
  "Garrison Commander": [
    {
      short: "Secure emergency funding to repair the east wall before it becomes a crisis",
      long: "Be remembered as the commander who made this settlement truly defensible",
      driven_by: "military"
    },
    {
      short: "Contain a near-mutiny caused by months of unpaid wages",
      long: "Obtain a noble title through military distinction — the only path left open",
      driven_by: "power"
    }
  ],
  "Mercenary Captain": [
    {
      short: "Collect a debt from a client who keeps finding reasons to delay payment",
      long: "Save enough to buy land and retire before this work kills them",
      driven_by: "wealth"
    },
    {
      short: "Evaluate whether the next contract is worth the risk to their crew",
      long: "Build a company so well-regarded that princes compete to hire them",
      driven_by: "power"
    }
  ],
  "High Priest": [
    {
      short: "Restore a desecrated shrine before the annual festival — quietly, without scandal",
      long: "Unite the fractious local clergy under a single doctrinal standard",
      driven_by: "spiritual"
    },
    {
      short: "Identify who among their junior clergy is accepting bribes from merchants",
      long: "Found an institution — a hospital, a school — that will outlast them by centuries",
      driven_by: "reform"
    }
  ],
  "Parish Priest": [
    {
      short: "Mediate a land dispute between two families before it turns violent",
      long: "Simply keep the community together — feed them, marry them, bury them with dignity",
      driven_by: "protection"
    },
    {
      short: "Convince their bishop to fund repairs to the church roof",
      long: "Leave a detailed parish record so future priests know who this community was",
      driven_by: "knowledge"
    }
  ],
  "Abbot/Abbess": [
    {
      short: "Investigate rumours that a novice has been leaving the grounds at night",
      long: "Expand the scriptorium into a library open to all who can read",
      driven_by: "knowledge"
    },
    {
      short: "Negotiate a tithe reduction with the local lord without compromising principle",
      long: "Leave the monastery in better condition — spiritually and structurally — than they found it",
      driven_by: "spiritual"
    }
  ],
  Inquisitor: [
    {
      short: "Confirm or deny specific heresy accusations against a prominent citizen",
      long: "Dismantle an actual organised heretical network — not chase rumours",
      driven_by: "justice"
    },
    {
      short: "Navigate political pressure from both the church hierarchy and the civil authorities",
      long: "Retire before the work corrupts them entirely",
      driven_by: "personal"
    }
  ],
  "Wealthiest Merchant": [
    {
      short: "Corner the market on a specific commodity before a rival does",
      long: "Fund a trading dynasty that their grandchildren will run",
      driven_by: "wealth"
    },
    {
      short: "Determine who has been bribing their warehouse staff",
      long: "Convert wealth into political power — a seat on the council, then more",
      driven_by: "power"
    }
  ],
  "Guild Master": [
    {
      short: "Prevent a rival guild from undercutting their members' prices",
      long: "Codify guild law so strongly that future masters can't easily corrupt it",
      driven_by: "power"
    },
    {
      short: "Place a talented apprentice in a role that increases guild influence",
      long: "Be remembered as the master who expanded the guild into new trades",
      driven_by: "wealth"
    }
  ],
  Moneylender: [
    {
      short: "Collect on a large overdue debt from a borrower who has suddenly disappeared",
      long: "Accumulate enough leverage over enough people to be untouchable",
      driven_by: "power"
    },
    {
      short: "Identify which of their clients is about to default and act first",
      long: "Transform the lending business into a proper banking institution — legitimate, respectable",
      driven_by: "wealth"
    }
  ],
  "Master Craftsman": [
    {
      short: "Complete a prestigious commission that will make their reputation in the city",
      long: "Train an apprentice who surpasses them — the greatest achievement of any craftsman",
      driven_by: "personal"
    },
    {
      short: "Acquire a rare material to solve a technical problem they've never cracked",
      long: "Document every technique they know before the knowledge dies with them",
      driven_by: "knowledge"
    }
  ],
  "Thieves' Guild Master": [
    {
      short: "Identify which of their lieutenants is planning to branch out independently",
      long: "Achieve enough legitimate business to step back from direct criminal exposure",
      driven_by: "power"
    },
    {
      short: "Negotiate a non-aggression pact with a new criminal faction moving into their territory",
      long: "Ensure no one ever proves the connection between them and their operations",
      driven_by: "personal"
    }
  ],
  "Crime Lord": [
    {
      short: "Suppress a rival operation that has begun cutting into smuggling revenue",
      long: "Build an empire that survives their death — succession planning for criminals",
      driven_by: "power"
    },
    {
      short: "Identify the guard captain who is no longer co-operative — and why",
      long: "Launder enough wealth to fund a legitimate legacy",
      driven_by: "wealth"
    }
  ],
  "Smuggler Chief": [
    {
      short: "Find a new route after the customs increase made the old one uneconomical",
      long: "Retire to somewhere no one knows their name with enough to live comfortably",
      driven_by: "personal"
    },
    {
      short: "Determine whether the recent cargo losses are coincidence or betrayal",
      long: "Expand into a trade that requires less hiding — spice or cloth, not people",
      driven_by: "wealth"
    }
  ],
  "Tower Wizard": [
    {
      short: "Identify the source of unexplained magical disturbances in the northern district",
      long: "Complete a research project that will earn peer recognition — not power, just acknowledgement",
      driven_by: "knowledge"
    },
    {
      short: "Find an apprentice worth investing time in before they become too old to train anyone",
      long: "Solve one genuinely unsolved theoretical question before they die",
      driven_by: "knowledge"
    }
  ],
  "Guild Archmage": [
    {
      short: "Resolve a dispute between two factions of the mages' guild without taking sides",
      long: "Establish a magical institution that outlasts their own life and power",
      driven_by: "power"
    },
    {
      short: "Track down a former student who has been using restricted magic",
      long: "Complete the great work — whatever that means to them specifically",
      driven_by: "knowledge"
    }
  ],
  "Hedge Wizard": [
    {
      short: "Find reliable income for the next three months — magical services barely pay",
      long: "Be taken seriously by the formal magical establishment, just once",
      driven_by: "personal"
    },
    {
      short: "Identify what is wrong with the crops in the northern fields — it smells magical",
      long: "Understand their own unusual ability well enough to pass it on",
      driven_by: "knowledge"
    }
  ],
  Alchemist: [
    {
      short: "Source a specific reagent that has been mysteriously unavailable for six weeks",
      long: "Crack the theoretical basis for a transmutation they've been circling for years",
      driven_by: "knowledge"
    },
    {
      short: "Fulfil a large dangerous commission while minimising the chance of explosion",
      long: "Publish findings that will outlast the potions they've spent their life brewing",
      driven_by: "knowledge"
    }
  ],
  "Tavern Owner": [
    {
      short: "Manage the fallout from a brawl last week that left a local merchant hospitalised",
      long: "Pay off the building and own it outright before they're too old to work it",
      driven_by: "wealth"
    },
    {
      short: "Figure out who has been watering down their barrels before it reaches customers",
      long: "Build a place where everyone — not just the wealthy — can feel welcome",
      driven_by: "personal"
    }
  ],
  "Sage/Scholar": [
    {
      short: "Verify a specific historical claim before publishing it — one source contradicts all others",
      long: "Complete the comprehensive work they've spent thirty years building toward",
      driven_by: "knowledge"
    },
    {
      short: "Find funding to continue research after their patron cut support without explanation",
      long: "Mentor someone who will care about truth more than they care about credit",
      driven_by: "reform"
    }
  ],
  Healer: [
    {
      short: "Identify the source of a cluster of unusual illnesses in the western quarter",
      long: "Train enough local healers that the settlement can cope without them",
      driven_by: "protection"
    },
    {
      short: "Obtain a specific medicinal compound that has been unavailable for months",
      long: "Document everything they know so the knowledge survives if they don't",
      driven_by: "knowledge"
    }
  ]
};

export const NPC_CRIMINAL_SECRETS={
  criminal: [
    {
      secret: "Has been embezzling from the organisation they oversee for three years",
      stakes: "Exposure means disgrace, legal prosecution, and enemies who feel personally betrayed"
    },
    {
      secret: "Secretly directs a fencing operation through a trusted intermediary",
      stakes: "Criminal liability and the end of any political or social standing"
    },
    {
      secret: "Ordered what was officially ruled an accident — and sleeps fine about it",
      stakes: "Murder charge, loss of everything, and the victim's family who suspects the truth"
    },
    {
      secret: "On the payroll of the thieves' guild as a silent informant",
      stakes: "Exposure would cost them their post and likely their safety"
    },
    {
      secret: "Has been systematically bribing multiple officials for preferential treatment",
      stakes: "A cascade of confessions from any single one of the bribed parties"
    },
    {
      secret: "Runs a protection scheme targeting the very merchants they're supposed to serve",
      stakes: "Civil and criminal liability; the merchants have been keeping records"
    },
    {
      secret: "Has been falsifying inspection records for a fee",
      stakes: "The next disaster caused by the uninspected goods will be traced back to them"
    },
    {
      secret: "Their legitimate business is a front for moving contraband",
      stakes: "Seizure of everything; the legitimacy is thin and investigators are circling"
    }
  ],
  personal: [
    {
      secret: "Has a second family in another settlement that neither family knows about",
      stakes: "Both relationships collapse, along with any claim to moral authority"
    },
    {
      secret: "Their identity is fabricated — they fled a different life entirely",
      stakes: "The person they became would be destroyed; the person they were might be wanted"
    },
    {
      secret: "Suffering from an illness they expect to kill them within two years",
      stakes: "Rivals would move against them immediately if they knew; dependents would panic"
    },
    {
      secret: "Deeply in debt to a creditor who owns the debt as leverage, not income",
      stakes: "The creditor will call it in at the worst possible moment — and has leverage to do so"
    },
    {
      secret: "Was directly responsible for a death that was ruled an accident",
      stakes: "Criminal liability and the complete destruction of their reputation"
    },
    {
      secret: "Has been funding a forbidden relationship with embezzled money",
      stakes: "Both the relationship and the embezzlement would become public simultaneously"
    },
    {
      secret: "Their celebrated achievement was stolen — they took credit for another's work",
      stakes: "The real author has evidence; they've been sitting on it for years"
    },
    {
      secret: "Has been slowly poisoning a rival with something that looks like natural illness",
      stakes: "A competent healer or investigator would find the evidence almost immediately"
    }
  ],
  political: [
    {
      secret: "Has been feeding strategic intelligence to a rival settlement",
      stakes: "Treason charges; execution or exile in most jurisdictions"
    },
    {
      secret: "Their appointment was secured through forged credentials",
      stakes: "Discovery ends their career and discredits every decision they've made"
    },
    {
      secret: "Knows the settlement's most important legal document was fraudulently created",
      stakes: "Revealing it destabilises everything; not revealing it makes them complicit"
    },
    {
      secret: "Has been delaying vital information from reaching the decision-makers",
      stakes: "When the consequences emerge, the delay will be investigated and traced"
    },
    {
      secret: "Is the illegitimate heir to a title currently held by someone who doesn't know they exist",
      stakes: "Could claim it — or could be seen as a threat by those who benefit from the status quo"
    },
    {
      secret: "Has agreed to hand over authority to an external power in exchange for personal safety",
      stakes: "Treason. Those they've sold out would not be forgiving"
    }
  ],
  magical: [
    {
      secret: "Possesses a magical ability they've hidden for their entire career",
      stakes: "In some jurisdictions, concealment is itself a crime; in all of them, it changes everything"
    },
    {
      secret: "Made a binding pact with an entity they now cannot name without consequence",
      stakes: "The pact will come due — soon — and the terms are worse than they appeared at signing"
    },
    {
      secret: "Has been using magic to alter memories of specific events",
      stakes: "The alterations are imperfect; some victims already sense something is wrong"
    },
    {
      secret: "Knows the location of a sealed magical site that others have been searching for",
      stakes: "Everyone who wants it would kill for the information; none of them should have it"
    },
    {
      secret: "Is under a compulsion placed by someone who is now dead — and it's getting harder to resist",
      stakes: "The compulsion will eventually force an action that exposes everything"
    },
    {
      secret: "Has been studying a forbidden school of magic under a false research pretext",
      stakes: "The research has progressed to the point where hiding it grows harder each week"
    }
  ],
  religious: [
    {
      secret: "Lost their faith completely but maintains the role — it's just a job now",
      stakes: "Discovery destroys their flock's trust and their own standing; some would call it heresy"
    },
    {
      secret: "Has been covering for a colleague's heretical activities out of personal loyalty",
      stakes: "When the colleague is exposed — and they will be — this secret comes with them"
    },
    {
      secret: "Secretly receives what they believe are genuine divine visions — which terrifies them",
      stakes: "Acting on the visions would be seen as madness; ignoring them may be worse"
    },
    {
      secret: "Has been systematically falsifying miracle reports for decades",
      stakes: "A sceptical investigator with the right access could unravel it all in a week"
    },
    {
      secret: "Knows their religious order was founded on a historical lie",
      stakes: "The truth would shatter the institution they've dedicated their life to"
    },
    {
      secret: "Possesses a relic that was officially declared destroyed — and kept it because they couldn't face destroying something real",
      stakes: "Possession is heresy; surrender means explaining how they had it"
    }
  ],
  family: [
    {
      secret: "Has been sending money to a disowned family member in secret for years",
      stakes: "The family member knows enough to burn them; the payments are leverage"
    },
    {
      secret: "Knows their celebrated family history is fabricated — and helped fabricate it",
      stakes: "The real history is much worse; discovery would shame all who share the name"
    },
    {
      secret: "One of their children is not theirs biologically — and they know it",
      stakes: "Every inheritance, every decision, made differently if this becomes known"
    },
    {
      secret: "Owes a life-debt to someone whose interests directly conflict with their current role",
      stakes: "The debt will eventually be called in at the worst possible moment"
    },
    {
      secret: "Has been protecting a sibling's crime for years — a serious one",
      stakes: "Discovery makes them an accessory; the sibling has reason to pre-empt exposure"
    }
  ],
  historical: [
    {
      secret: "Was present at — and did nothing to prevent — an atrocity that is now history",
      stakes: "Complicity charges; the moral weight has been crushing them for years"
    },
    {
      secret: "Knows the actual truth behind a founding event that the settlement reveres",
      stakes: "The truth would delegitimise current power structures; powerful people prefer the myth"
    },
    {
      secret: "Survived something everyone believes killed them — under a different name",
      stakes: "The original identity, if revealed, carries baggage that would end the current one"
    },
    {
      secret: "Has been maintaining a cover-up of a past institutional failure that cost lives",
      stakes: "Exposure means accountability for something that happened a long time ago, to real people"
    },
    {
      secret: "Was the informant whose report triggered a purge that destroyed innocent lives",
      stakes: "The report was accurate in some ways but deliberately misleading in others"
    },
    {
      secret: "Possesses an original copy of a document that was officially declared destroyed",
      stakes: "The document changes the legitimacy of something very important to very powerful people"
    },
    {
      secret: "The person who raised them was not their parent — and that parent is someone significant",
      stakes: "The revelation would disrupt inheritance, property, and several people's sense of identity"
    }
  ],
  military: [
    {
      secret: "Gave an order during a battle that caused friendly casualties — it was covered up as enemy action",
      stakes: "The families of the dead believe a lie that this person actively maintains"
    },
    {
      secret: "Was captured and released under terms they have never disclosed",
      stakes: "The terms may mean they owe something to an enemy that they haven't paid yet"
    },
    {
      secret: "Knows that the decisive victory everyone celebrates was won through treachery, not skill",
      stakes: "Several people built careers on that victory; they would not appreciate the truth"
    },
    {
      secret: "Has been selling patrol routes and schedules to someone outside the settlement",
      stakes: "People have already died as a result; they are rationalising this as survivable"
    },
    {
      secret: "Has been skimming from military supply budgets for years through a trusted subordinate",
      stakes: "The subordinate now knows enough to destroy them — and is becoming expensive"
    },
    {
      secret: "Was ordered to commit an atrocity and complied — and has since risen in the organisation that ordered it",
      stakes: "The order came from someone senior; exposure implicates both of them"
    }
  ],
  economic_betrayal: [
    {
      secret: "Has been quietly shorting investments they publicly recommend, profiting from collapse",
      stakes: "Civil fraud liability and the permanent destruction of a reputation built over decades"
    },
    {
      secret: "The goods they sell as locally produced are sourced from somewhere with exploitative labour practices",
      stakes: "The premium they charge depends entirely on the lie holding"
    },
    {
      secret: "Has been paying a health official to suppress a finding about their product",
      stakes: "People are being harmed; the official is growing nervous; the finding is documented"
    },
    {
      secret: "Has information about a competitor that would ruin them — obtained through clearly illegal means",
      stakes: "Using the information exposes how it was obtained; not using it means watching an advantage expire"
    },
    {
      secret: "Their business partner died of natural causes that weren't entirely natural",
      stakes: "An investigation would find ambiguous evidence — enough to ruin, maybe enough to prosecute"
    }
  ],
  identity: [
    {
      secret: "Is a member of a group that faces serious persecution — and passes for something else entirely",
      stakes: "Discovery ends everything they have built; some of the people closest to them would turn on them"
    },
    {
      secret: "Their celebrated origin story is a fabrication they created to escape an intolerable past",
      stakes: "The real past includes people who are still alive and who remember"
    },
    {
      secret: "Has been corresponding with someone they are publicly required to treat as an enemy",
      stakes: "The correspondence is genuine and affectionate; it would be read as treason"
    },
    {
      secret: "Lives a second life under a different name in another part of the settlement or a nearby town",
      stakes: "The two lives have begun to approach each other geographically"
    },
    {
      secret: "Is not who their documents say they are — the real person died years ago and they took the identity",
      stakes: "The real person's family recently moved to the area"
    }
  ]
};

export const FACTION_CONFLICT_TYPES={government:["military","economy","religious"],military:["government","criminal"],economy:["government","criminal","magic"],religious:["government","magic"],magic:["economy","criminal","religious"],criminal:["economy","military","magic"],other:["economy","government"]};

export const NPC_FACTION_LOYALTY = {
  government: [
    "A sealed letter arrived for them three weeks ago. They haven't opened it. They won't say why.",
    "They've been quietly buying up property in a district that hasn't been announced as a development site. Yet.",
    "One of their staff has started asking questions about records from seven years ago. They've been reassigned twice already.",
    "A merchant they publicly opposed is now publicly supporting them. No explanation offered.",
    "Their most trusted advisor hasn't been seen in four days. The official story changes each time it's told.",
    "They know who committed a crime the guard is currently investigating. They're not telling the guard.",
    "Someone has been leaving anonymous notes in their office pointing to a colleague's corruption. The notes are accurate.",
    "They've been meeting privately with someone from outside the settlement whose identity they won't disclose.",
    "A routine appointment they made three weeks ago has been rescheduled four times. Each time they initiated the change.",
    "Someone who publicly supports them is being paid by someone who opposes them. They know this.",
    "They received a deposition in a civil case that, if acted on, would be correct — and would ruin someone they need."
  ],
  military: [
    "Three guards have gone missing in the same district on night patrol. The report filed says they deserted.",
    "Weapons from the armoury have been disappearing in small quantities for months. The inventory matches, somehow.",
    "They received orders from above that contradict what they know to be right. They haven't acted on either yet.",
    "A prisoner in their custody knows something valuable. So does someone with reason to ensure they never speak.",
    "They've noticed the same group of faces at multiple locations where incidents occurred. No one else has.",
    "Someone is paying their soldiers more than their salary. The soldiers aren't saying who.",
    "A spy they turned is now being turned back — and feeding information in both directions.",
    "The ambush that killed two of their best people wasn't random. Someone knew the patrol route.",
    "A recruit they turned away has since joined a different outfit. The different outfit is now paying them to monitor this one.",
    "They are carrying out orders they believe are wrong. They have not yet decided at what point they stop carrying them out.",
    "A weapons cache they were responsible for is smaller than it should be. They haven't reported it yet."
  ],
  religious: [
    "A parishioner confessed something to them three months ago. The information is dangerous. They cannot act on it.",
    "The holy relic in their keeping is not what everyone believes it is. Only they know this.",
    "Someone has been leaving offerings at the shrine that shouldn't be possible — the site has been sealed.",
    "A novice has the gift. They know what that means for the novice. They're not sure what to do.",
    "They received a directive from the hierarchy that contradicts their own theology. Compliance is expected.",
    "A healing they performed was successful in a way they cannot explain. It's happened twice now.",
    "The previous holder of their position left a letter, sealed, to be opened after their death. It wasn't.",
    "A member of their congregation is systematically working against the faith. From inside it.",
    "They have been asked to perform a ceremony they have theological objections to. The person asking has leverage.",
    "A donation was made to the institution under conditions the donor didn't disclose publicly. The conditions are becoming relevant.",
    "They know which of the current leadership will be the next to fall from grace. They are waiting."
  ],
  economy: [
    "A shipment they weren't expecting arrived and is now in their warehouse. They don't know who sent it or what to do.",
    "A business rival has offered them a partnership with terms so good it must be a trap. They can't find the trap.",
    "One of their most reliable suppliers has gone dark. The goods are still arriving. Someone else is sending them.",
    "They have evidence of price-fixing across the whole market. Publishing it helps their competition as much as their customers.",
    "A young trader has been undercutting them in ways that shouldn't be possible on their claimed capital.",
    "Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in.",
    "A valuable cargo was reported lost at sea. The manifest has reappeared in a market two settlements away.",
    "Their master craftsman is talking to a rival. They haven't confronted them. They're not sure what they'd do.",
    "A contract they signed in difficult times has a clause they didn't fully read. Someone has read it.",
    "They have been slowly acquiring a controlling interest in a competitor through intermediaries. The competitor hasn't noticed yet.",
    "A supplier is providing goods of uncertain provenance. The price is too good to ask questions. People have started asking questions."
  ],
  criminal: [
    "One of their people is talking to the guard. They don't know which one yet. They're watching.",
    "A valuable item came through their network recently. Three different parties have asked about it quietly.",
    "Someone in the legitimate government is playing both sides. That's useful — until it isn't.",
    "A job went wrong in a way that suggests information was leaked. They have three suspects.",
    "They're protecting someone from something worse. The someone doesn't know and wouldn't thank them.",
    "A new face has appeared in three separate incidents involving their operations. Coincidence or surveillance?",
    "The guard captain has a file. They know because someone who works for the guard captain also works for them.",
    "Someone tried to rob one of their fronts. The attempt was professional. That's more worrying than amateur."
  ],
  magic: [
    "An experiment failed in a way that shouldn't be possible. The results have been sealed. They're still thinking.",
    "A student asked a question three weeks ago that they haven't been able to answer. That's new.",
    "Something in the settlement is absorbing ambient magical energy. The readings are increasing.",
    "They've been approached by someone who knows things about their research that were never made public.",
    "An old colleague has sent a message asking for a meeting — the colleague was declared dead six years ago.",
    "The magical ward they placed on the vaults was bypassed. Not broken. Bypassed. That requires inside knowledge.",
    "They have two competing theories about what is happening to magic in this region. Both are alarming.",
    "Someone has been making inquiries about their past research. Not the published work — the unpublished work."
  ],
  other: [
    "They overheard something they shouldn't have and don't know what to do with the information.",
    "A regular customer has stopped coming. The reason they've been given doesn't make sense.",
    "Someone left an item in their care and hasn't returned. The item is valuable. The absence is now suspicious.",
    "Three different people have asked them the same unusual question. None of them knew each other.",
    "They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone.",
    "A stranger passed through, asked specific questions, and left before they could follow up.",
    "Something they were told was destroyed is apparently not destroyed.",
    "They know something small that connects to something much larger. They haven't realised the connection. Yet.",
    "Someone they trust completely has started behaving in ways that don't add up.",
    "They've been offered money to not ask questions about something they hadn't even started asking about.",
    "A document they were asked to witness contained a clause they noticed at the time and said nothing about.",
    "Their predecessor left something behind — in a place where it shouldn't have been — and they haven't reported finding it."
  ],
  small_settlement: [
    "Everyone in the settlement is behaving slightly differently toward a visitor from outside. Not unfriendly — careful.",
    "There is a building no one talks about, goes into, or mentions. It is clearly maintained. No one will say by whom.",
    "The oldest resident refuses to speak about a specific year. Others confirm the year exists. No one remembers what happened.",
    "Something is left at the crossroads each new moon. No one admits to leaving it. It is always gone by morning.",
    "Two families who should be feuding are recently, unexpectedly civil. Neither will explain why.",
    "A child has been asking questions about a person no one has heard of — insisting this person lived here recently.",
    "The well gives good water. The spring above it dried up three years ago. No one mentions this.",
    "They buried someone last season that they refer to only as 'the traveller'. They will not say more."
  ]
};

export const NPC_SECRETS={
  government: [
    {
      short: "Survive the current political season without a major scandal",
      long: "Build lasting institutional reform that outlives their tenure",
      driven_by: "power"
    },
    {
      short: "Consolidate their position before rivals can organise",
      long: "Die having made this place meaningfully better",
      driven_by: "reform"
    }
  ],
  military: [
    {
      short: "Train the next cohort to a standard that might actually keep people alive",
      long: "Build a force that doesn't need them — sustainable, not dependent",
      driven_by: "protection"
    },
    {
      short: "Identify the weak link before the weak link identifies itself in a crisis",
      long: "Achieve enough distinction to be remembered without being mourned too soon",
      driven_by: "military"
    }
  ],
  religious: [
    {
      short: "Settle a theological dispute that has divided the congregation for months",
      long: "Strengthen the faith — not the institution, the actual living faith",
      driven_by: "spiritual"
    },
    {
      short: "Obtain the resources needed for a desperately needed charitable project",
      long: "Be worthy of the role they hold — which turns out to be the harder task",
      driven_by: "spiritual"
    }
  ],
  economy: [
    {
      short: "Close the deal that will determine this year's profitability",
      long: "Build something that doesn't need them to keep running",
      driven_by: "wealth"
    },
    {
      short: "Identify the leak in their supply chain before it empties the accounts",
      long: "Leverage money into influence — that's where security actually lives",
      driven_by: "power"
    }
  ],
  criminal: [
    {
      short: "Eliminate the threat before it becomes a bigger threat",
      long: "Build insulation between themselves and consequences",
      driven_by: "power"
    },
    {
      short: "Find who betrayed them before they do it again",
      long: "Accumulate enough to make legitimacy a choice rather than an aspiration",
      driven_by: "wealth"
    }
  ],
  magic: [
    {
      short: "Solve the magical problem that has been festering for three weeks",
      long: "Advance understanding of something that was genuinely unknown",
      driven_by: "knowledge"
    },
    {
      short: "Find someone capable enough to not endanger others",
      long: "Leave magic in a better state than they found it",
      driven_by: "knowledge"
    }
  ],
  other: [
    {
      short: "Get through this particular difficulty without it becoming a catastrophe",
      long: "Build enough stability that they have choices",
      driven_by: "personal"
    },
    {
      short: "Figure out what is actually going on before it affects them directly",
      long: "Matter to the people immediately around them — small scale, real",
      driven_by: "personal"
    }
  ]
};

export const NPC_PLOT_HOOKS_DATA = {welcoming:"Offers information freely; asks questions that seem like interest rather than interrogation.",transactional:"Cooperative within clear limits; every exchange has an implicit value.",cautious:"Answers questions without volunteering; watches who you talk to next.",dismissive:"Polite but brief; makes clear their time is limited."};

export const NPC_PRESENTATION_MODES = {
  dangerous_presents_safe: [
    {
      impression: "Genuinely helpful — or indistinguishable from it. Knowledgeable, generous with information, nothing that raises concern.",
      disposition: "welcoming",
      behaviour: "Volunteers information before you ask. Seems invested in your success here."
    },
    {
      impression: "Friendly and community-minded. The kind of person other residents speak well of.",
      disposition: "welcoming",
      behaviour: "Knows everyone, introduces you to people, seems like the natural first contact for newcomers."
    },
    {
      impression: "Warm, a little effusive. The first person to make you feel you've arrived somewhere safe.",
      disposition: "welcoming",
      behaviour: "Asks good questions about your journey. Remembers the answers."
    }
  ],
  compromised_presents_professional: [
    {
      impression: "Efficient and correct in every interaction. The manner of someone following procedure.",
      disposition: "transactional",
      behaviour: "Processes requests quickly. Doesn't ask about things that aren't their business."
    },
    {
      impression: "Reserved. Appropriately cautious with strangers — you would be too, in their position.",
      disposition: "cautious",
      behaviour: "Asks reasonable questions. Gives reasonable answers. Nothing out of the ordinary."
    },
    {
      impression: "Busy. The impression of someone with real responsibilities who is giving you an appropriate portion of their attention.",
      disposition: "transactional",
      behaviour: "Helpful within the limits of their role. Refers you to others for anything outside it."
    }
  ],
  significant_presents_ordinary: [
    {
      impression: "Unremarkable. The particular invisible quality of someone who has spent years not being noticed.",
      disposition: "transactional",
      behaviour: "Answers questions. Asks nothing. Remembers more than they show."
    },
    {
      impression: "Tired and ordinary. The manner of someone who is carrying less than they are.",
      disposition: "transactional",
      behaviour: "Cooperative. Unassuming. Easy to overlook."
    },
    {
      impression: "Quiet, neighbourly. The impression of someone with a small life and modest concerns.",
      disposition: "welcoming",
      behaviour: "Helpful in the small practical ways that don't invite scrutiny."
    }
  ]
};


// ── Original npcData.js constants (preserved from pre-extraction) ──────────────

export const NPC_ROLES={Mayor:[{short:"Navigate a dispute between two powerful guilds without losing either's support",long:"Die in office having kept the peace — legacy matters more than wealth",driven_by:"protection"},{short:"Cover up a minor corruption scandal before the regional lord hears of it",long:"Transform this settlement into a city-state with real independence",driven_by:"power"},{short:"Find funding for desperately needed infrastructure repairs",long:"Build a political dynasty — their children will inherit influence, not just money",driven_by:"power"},{short:"Discredit a council rival before the annual election",long:"Write laws that outlast them — real reform, not political theatre",driven_by:"reform"}],Governor:[{short:"Secure enough grain reserves before winter to prevent unrest",long:"Become indispensable to the crown — irreplaceable, never exposed",driven_by:"power"},{short:"Root out the faction leaking tax figures to rivals",long:"Retire with a fortune and a clean name — in that order",driven_by:"wealth"}],"Council Member":[{short:"Block a proposal that would undermine their patron's interests",long:"Build a coalition that can outvote the merchant bloc on anything",driven_by:"power"},{short:"Expose a colleague's corruption without implicating themselves",long:"Champion a reform that future councils will still cite by name",driven_by:"reform"}],"Tax Collector":[{short:"Meet this quarter's collection target without triggering another riot",long:"Accumulate enough to buy out of this hated post — any post but this",driven_by:"wealth"},{short:"Find a missing merchant whose taxes haven't been filed in six months",long:"Build enough goodwill that the settlement mourns them when they go",driven_by:"protection"}],"Chief Magistrate":[{short:"Close a murder case that has made the merchants nervous",long:"Establish a legal precedent that constrains what the nobility can do to commoners",driven_by:"justice"},{short:"Resist pressure from a powerful patron to deliver a specific verdict",long:"Train a successor who will carry on their judicial philosophy",driven_by:"reform"}],"Guard Captain":[{short:"Find the person responsible for three unsolved dock-side killings",long:"Rebuild guard morale after years of under-funding and low prestige",driven_by:"protection"},{short:"Identify which of their officers is on the thieves' guild payroll",long:"Die in bed rather than in the street — unusual ambition for the role",driven_by:"personal"}],"Garrison Commander":[{short:"Secure emergency funding to repair the east wall before it becomes a crisis",long:"Be remembered as the commander who made this settlement truly defensible",driven_by:"military"},{short:"Contain a near-mutiny caused by months of unpaid wages",long:"Obtain a noble title through military distinction — the only path left open",driven_by:"power"}],"Mercenary Captain":[{short:"Collect a debt from a client who keeps finding reasons to delay payment",long:"Save enough to buy land and retire before this work kills them",driven_by:"wealth"},{short:"Evaluate whether the next contract is worth the risk to their crew",long:"Build a company so well-regarded that princes compete to hire them",driven_by:"power"}],"High Priest":[{short:"Restore a desecrated shrine before the annual festival — quietly, without scandal",long:"Unite the fractious local clergy under a single doctrinal standard",driven_by:"spiritual"},{short:"Identify who among their junior clergy is accepting bribes from merchants",long:"Found an institution — a hospital, a school — that will outlast them by centuries",driven_by:"reform"}],"Parish Priest":[{short:"Mediate a land dispute between two families before it turns violent",long:"Simply keep the community together — feed them, marry them, bury them with dignity",driven_by:"protection"},{short:"Convince their bishop to fund repairs to the church roof",long:"Leave a detailed parish record so future priests know who this community was",driven_by:"knowledge"}],"Abbot/Abbess":[{short:"Investigate rumours that a novice has been leaving the grounds at night",long:"Expand the scriptorium into a library open to all who can read",driven_by:"knowledge"},{short:"Negotiate a tithe reduction with the local lord without compromising principle",long:"Leave the monastery in better condition — spiritually and structurally — than they found it",driven_by:"spiritual"}],Inquisitor:[{short:"Confirm or deny specific heresy accusations against a prominent citizen",long:"Dismantle an actual organised heretical network — not chase rumours",driven_by:"justice"},{short:"Navigate political pressure from both the church hierarchy and the civil authorities",long:"Retire before the work corrupts them entirely",driven_by:"personal"}],"Wealthiest Merchant":[{short:"Corner the market on a specific commodity before a rival does",long:"Fund a trading dynasty that their grandchildren will run",driven_by:"wealth"},{short:"Determine who has been bribing their warehouse staff",long:"Convert wealth into political power — a seat on the council, then more",driven_by:"power"}],"Guild Master":[{short:"Prevent a rival guild from undercutting their members' prices",long:"Codify guild law so strongly that future masters can't easily corrupt it",driven_by:"power"},{short:"Place a talented apprentice in a role that increases guild influence",long:"Be remembered as the master who expanded the guild into new trades",driven_by:"wealth"}],Moneylender:[{short:"Collect on a large overdue debt from a borrower who has suddenly disappeared",long:"Accumulate enough leverage over enough people to be untouchable",driven_by:"power"},{short:"Identify which of their clients is about to default and act first",long:"Transform the lending business into a proper banking institution — legitimate, respectable",driven_by:"wealth"}],"Master Craftsman":[{short:"Complete a prestigious commission that will make their reputation in the city",long:"Train an apprentice who surpasses them — the greatest achievement of any craftsman",driven_by:"personal"},{short:"Acquire a rare material to solve a technical problem they've never cracked",long:"Document every technique they know before the knowledge dies with them",driven_by:"knowledge"}],"Thieves' Guild Master":[{short:"Identify which of their lieutenants is planning to branch out independently",long:"Achieve enough legitimate business to step back from direct criminal exposure",driven_by:"power"},{short:"Negotiate a non-aggression pact with a new criminal faction moving into their territory",long:"Ensure no one ever proves the connection between them and their operations",driven_by:"personal"}],"Crime Lord":[{short:"Suppress a rival operation that has begun cutting into smuggling revenue",long:"Build an empire that survives their death — succession planning for criminals",driven_by:"power"},{short:"Identify the guard captain who is no longer co-operative — and why",long:"Launder enough wealth to fund a legitimate legacy",driven_by:"wealth"}],"Smuggler Chief":[{short:"Find a new route after the customs increase made the old one uneconomical",long:"Retire to somewhere no one knows their name with enough to live comfortably",driven_by:"personal"},{short:"Determine whether the recent cargo losses are coincidence or betrayal",long:"Expand into a trade that requires less hiding — spice or cloth, not people",driven_by:"wealth"}],"Tower Wizard":[{short:"Identify the source of unexplained magical disturbances in the northern district",long:"Complete a research project that will earn peer recognition — not power, just acknowledgement",driven_by:"knowledge"},{short:"Find an apprentice worth investing time in before they become too old to train anyone",long:"Solve one genuinely unsolved theoretical question before they die",driven_by:"knowledge"}],"Guild Archmage":[{short:"Resolve a dispute between two factions of the mages' guild without taking sides",long:"Establish a magical institution that outlasts their own life and power",driven_by:"power"},{short:"Track down a former student who has been using restricted magic",long:"Complete the great work — whatever that means to them specifically",driven_by:"knowledge"}],"Hedge Wizard":[{short:"Find reliable income for the next three months — magical services barely pay",long:"Be taken seriously by the formal magical establishment, just once",driven_by:"personal"},{short:"Identify what is wrong with the crops in the northern fields — it smells magical",long:"Understand their own unusual ability well enough to pass it on",driven_by:"knowledge"}],Alchemist:[{short:"Source a specific reagent that has been mysteriously unavailable for six weeks",long:"Crack the theoretical basis for a transmutation they've been circling for years",driven_by:"knowledge"},{short:"Fulfil a large dangerous commission while minimising the chance of explosion",long:"Publish findings that will outlast the potions they've spent their life brewing",driven_by:"knowledge"}],"Tavern Owner":[{short:"Manage the fallout from a brawl last week that left a local merchant hospitalised",long:"Pay off the building and own it outright before they're too old to work it",driven_by:"wealth"},{short:"Figure out who has been watering down their barrels before it reaches customers",long:"Build a place where everyone — not just the wealthy — can feel welcome",driven_by:"personal"}],"Sage/Scholar":[{short:"Verify a specific historical claim before publishing it — one source contradicts all others",long:"Complete the comprehensive work they've spent thirty years building toward",driven_by:"knowledge"},{short:"Find funding to continue research after their patron cut support without explanation",long:"Mentor someone who will care about truth more than they care about credit",driven_by:"reform"}],Healer:[{short:"Identify the source of a cluster of unusual illnesses in the western quarter",long:"Train enough local healers that the settlement can cope without them",driven_by:"protection"},{short:"Obtain a specific medicinal compound that has been unavailable for months",long:"Document everything they know so the knowledge survives if they don't",driven_by:"knowledge"}]};;

export const STRESS_ECONOMIC_EFFECTS={econ_crim_blur:{label:"Commercial Complicity",desc:(r,s)=>`${r.name} and ${s.name} maintain a relationship that exists in legal grey territory — ${r.name} provides legitimate cover, ${s.name} ensures market access that official channels wouldn't permit.`,tension:(r,s)=>"If either is investigated, the other is implicated. Both know this. Neither mentions it.",type:"patron_client"},econ_crim_exploitation:{label:"Protection Arrangement",desc:(r,s)=>`${s.name}'s operation charges ${r.name} a "security fee" that is, in practice, a protection racket. ${r.name} pays without complaint because the alternative is worse.`,tension:(r,s)=>`${r.name} is quietly documenting every payment. Someone is being prepared for a fall.`,type:"debtor_creditor"},mil_crim_corruption:{label:"Corrupt Arrangement",desc:(r,s)=>`${r.name} receives regular payments from ${s.name}'s organization in exchange for patrol schedules and advance notice of raids. Both maintain professional courtesy in public.`,tension:(r,s)=>"A new superior has started asking uncomfortable questions about clearance rates. One of them will have to act before the other does.",type:"ally"},mil_crim_suppression:{label:"Active Suppression",desc:(r,s)=>`${r.name} has made dismantling ${s.name}'s operation a personal priority. The feeling is mutual.`,tension:(r,s)=>`${s.name} has leverage on someone close to ${r.name}. It hasn't been used yet.`,type:"enemy"},econ_mil_contract:{label:"Security Contract",desc:(r,s)=>`${s.name}'s company is retained by ${r.name}'s interests on an exclusive basis. The arrangement works well enough that official channels have stopped asking questions.`,tension:(r,s)=>`The contract is up for renewal. ${s.name} has been approached by a competitor. ${r.name} doesn't know yet.`,type:"patron_client"},rel_mil_crusader:{label:"Sacred Commission",desc:(r,s)=>`${r.name} and ${s.name} operate as a unified authority — temporal and spiritual power reinforcing each other. Dissent against one is dissent against both.`,tension:(r,s)=>"They disagree on a fundamental question of method that neither will put into writing.",type:"ally"},rel_crim_fraud:{label:"Institutional Cover",desc:(r,s)=>`${r.name}'s religious position provides ${s.name}'s operation with legitimacy, meeting spaces, and an excuse for financial flows that would otherwise attract scrutiny.`,tension:(r,s)=>`${r.name} has a genuine crisis of conscience that ${s.name} is not prepared to accommodate.`,type:"ally"},mag_crim_market:{label:"Arcane Supplier",desc:(r,s)=>`${r.name} provides ${s.name}'s network with components, identification services, and the occasional forged document that only a skilled practitioner could produce.`,tension:(r,s)=>`The last commission left traces that a determined investigator might find. ${r.name} is reconsidering the relationship.`,type:"patron_client"},gov_econ_dependence:{label:"Financial Dependence",desc:(r,s)=>`The settlement's civic functions run on credit extended by ${s.name}. ${r.name} cannot take any action that seriously threatens ${s.name}'s interests — and ${s.name} does not let this be forgotten.`,tension:(r,s)=>`${r.name} has identified an alternative creditor. ${s.name} has heard the same rumour.`,type:"debtor_creditor"},gov_mil_friction:{label:"Jurisdictional Tension",desc:(r,s)=>`${r.name} and ${s.name} disagree fundamentally about where civil authority ends and military authority begins. The argument has been running for years and occasionally generates paperwork.`,tension:(r,s)=>"An incident is coming that will force the issue. Both are positioning for it.",type:"political"},peer_rivalry:{label:"Professional Rivalry",desc:(r,s)=>`${r.name} and ${s.name} compete for the same resource, position, or reputation. The competition is vigorous but bounded — neither has crossed the line into genuine enmity. Yet.`,tension:(r,s)=>"A decision coming in the next season will advantage one significantly. The other knows this.",type:"rival"},mentor_legacy:{label:"Mentor and Successor",desc:(r,s)=>`${r.name} shaped ${s.name}'s career in ways that ${s.name} has not fully acknowledged. The debt is real; the gratitude is complicated.`,tension:(r,s)=>`${s.name} now operates in ways ${r.name} would not approve of. Neither discusses the divergence directly.`,type:"mentor_student"},mutual_leverage:{label:"Mutual Leverage",desc:(r,s)=>`${r.name} and ${s.name} each hold information or resources the other needs. They cooperate efficiently and neither trusts the other at all.`,tension:(r,s)=>"The balance of leverage has recently shifted. One party has noticed; the other hasn't yet.",type:"political"},wary_alliance:{label:"Pragmatic Alliance",desc:(r,s)=>`${r.name} and ${s.name} work together because the alternative — working against each other — is worse for both. The alliance holds as long as the calculation holds.`,tension:(r,s)=>"A third party is actively working to change that calculation.",type:"ally"},genuine_respect:{label:"Genuine Respect",desc:(r,s)=>`${r.name} and ${s.name} have earned each other's regard through demonstrated competence. They don't agree on everything but they trust each other's judgment within their respective domains.`,tension:(r,s)=>"They are about to be on opposite sides of a significant decision.",type:"respect"},old_debt:{label:"Outstanding Debt",desc:(r,s)=>`${r.name} owes ${s.name} something significant — a favour, a secret kept, a crisis managed. The debt has never been formally acknowledged. It doesn't need to be.`,tension:(r,s)=>`${s.name} is about to call it in.`,type:"debtor_creditor"},family_complication:{label:"Family Complication",desc:(r,s)=>`${r.name} and ${s.name} are connected by blood or marriage in a way that neither finds professionally convenient. The connection is known; its implications are not discussed.`,tension:(r,s)=>"An inheritance, title, or secret is about to make the connection impossible to ignore.",type:"family"},bitter_history:{label:"Unresolved History",desc:(r,s)=>`Something happened between ${r.name} and ${s.name} years ago that neither has forgotten. They function professionally. They do not forgive.`,tension:(r,s)=>"The circumstances that caused the original rupture are repeating. Both of them know it.",type:"enemy"}};;
