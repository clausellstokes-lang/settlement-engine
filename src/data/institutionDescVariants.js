/**
 * institutionDescVariants.js — CONTENT-GT-DOSSIER lane: extra description variants for
 * a representative cross-tier sample of institutions. Keyed by the exact
 * `${tier}|${category}|${name}` catalog path. These are the NON-canonical variants ONLY;
 * the catalog's own `desc` stays the canonical index-0 entry, and assembleInstitutions
 * selects among [canonicalDesc, ...variants] with a pure fnv hash of (settlement seed +
 * institution name) — ZERO rng draws (kernel/proseHash.pickVariant, canonical-at-zero).
 * A settlement without a matching key keeps its single catalog desc unchanged.
 *
 * Representative sample (mechanism + taste-sample); the exhaustive 301 is deferred to the
 * owner taste-approval per docs/GENERATION_TIME_SHIFT_MAP_DOSSIER.md.
 */
export const INSTITUTION_DESC_VARIANTS = Object.freeze({
  "city|Criminal|Thieves' guild chapter": [
    "A chapter of organised crime, workable only past 10,000 people. Thirty to a hundred members.",
    "An arm of the wider criminal order, 30 to 100 strong. It needs a city of 10,000 or more to survive.",
  ],
  "city|Defense|City walls and gates": [
    "Towered stone walls. Several gatehouses along their length.",
    "Masonry ramparts studded with towers and pierced by many gates.",
  ],
  "city|Defense|Professional city watch": [
    "A standing force of the law, roughly one in a hundred residents.",
    "Full-time keepers of order, numbering about 1% of the city.",
  ],
  "city|Economy|Banking houses": [
    "Loans, coin exchange, and letters of credit. The beginnings of banking, viable above 5,000 souls.",
    "Lending, currency exchange, and credit by letter. Rudimentary banking, and only past 5,000 population.",
  ],
  "city|Economy|Daily markets": [
    "Trade that never closes, spread across several sites.",
    "Standing markets in more than one quarter, open every day.",
  ],
  "city|Entertainment|Theaters": [
    "Fixed houses for performance.",
    "Standing venues for the stage.",
  ],
  "city|Government|Mayor and council": [
    "An elected council backed by a complete administrative staff.",
    "A civic council put in by vote, with the full apparatus of office beneath it.",
  ],
  "city|Infrastructure|City hall": [
    "A commanding seat of civic government.",
    "An imposing hall for the city's affairs.",
  ],
  "city|Magic|Mages' guild": [
    "A body of spellcasters organised together. A chapter needs 2,000 to 5,000 people.",
    "An association of magic-workers. Sustaining a chapter takes 2,000-5,000 population.",
  ],
  "city|Magic|Wizard's tower": [
    "Home to a powerful spellcaster. A city may hold more than one.",
    "The seat of a high-level mage. Several may stand in a single city.",
  ],
  "city|Religious|Cathedral (10,000+ only)": [
    "The bishop's seat. It wants at least 10,000 people to sustain it, and its presence marks a city as a major one.",
    "Seat of a bishop, and the mark of a first-rank city. Nothing under 10,000 population carries one.",
  ],
  "hamlet|Crafts|Resident smith (part-time)": [
    "Mends tools, shoes horses. Also works a plot.",
    "Tool repair and horseshoeing. Farms on the side.",
  ],
  "hamlet|Criminal|Fence (word of mouth)": [
    "Stolen property passes through the hamlet without fuss. You would know the go-between by sight, never by name.",
    "Lifted goods change hands here discreetly. The contact has a face people recognise and a name they don't use.",
  ],
  "hamlet|Defense|Citizen militia": [
    "Fit residents train and turn out when trouble comes near. Service is part-time.",
    "The able-bodied drill together and assemble against local danger. Nobody does it full-time.",
  ],
  "hamlet|Economy|Alehouse": [
    "Ale brewed at home and sold out of a back room. It doubles as the hamlet's common room — every rumour, quarrel, and bargain passes through it.",
    "Somebody's back room, a barrel of home brew, and a bench. It is where the hamlet hears its news, airs its grievances, and strikes its deals.",
  ],
  "hamlet|Government|Lord's steward": [
    "A lord's man runs the hamlet's holdings, gathers the rents, and speaks for noble authority.",
    "Acting for the lord, he administers the land, takes in rent, and imposes the noble's will.",
  ],
  "hamlet|Government|Village headman": [
    "One well-regarded resident holds sway without a mandate — nobody voted, nobody appointed, everybody accepts it. What gets decided is practical, never ceremonial.",
    "A single trusted figure runs things by common agreement rather than any office. The rulings are matters of sense, not procedure.",
  ],
  "hamlet|Religious|Wayside shrine": [
    "A plain spot for prayer. No clergy.",
    "Modest prayer marker. Unattended.",
  ],
  "metropolis|Criminal|Assassins' guild": [
    "Killing to order, done as a trade. It works through intermediaries and is never owned to in public.",
    "A professional trade in murder, screened behind cutouts and admitted by no one.",
  ],
  "metropolis|Defense|Massive walls and fortifications": [
    "Walls within walls — an outer line, an inner line, and the citadel ring. Garrison districts and gatehouses at every stage.",
    "A defence built in layers: outer wall, inner wall, and the ring about the citadel, with garrisons and gatehouses throughout.",
  ],
  "metropolis|Economy|Banking district": [
    "A whole quarter given to money — banking across borders, credit by letter, and speculation in coin at scale.",
    "The city's finance gathered into one district: international houses, letters of credit, and currency dealing on a grand scale.",
  ],
  "metropolis|Government|Palace/government complex": [
    "The heart of metropolitan or state rule — a palace with its ministries, audience halls, and clerks' bureaux.",
    "Where the metropolis or the state governs from: palace, ministries, halls of audience, and offices without number.",
  ],
  "metropolis|Magic|Academy of magic": [
    "A chartered school of the arcane, with a full course of study, laboratories, and scholars come from abroad.",
    "A formal college of magic — a complete curriculum, rooms for research, and a stream of visiting adepts.",
  ],
  "metropolis|Religious|Great cathedral": [
    "The metropolitan cathedral, seat of the region's highest prelate and a draw for pilgrims.",
    "The great church of the metropolis — the region's chief religious authority sits here, and the faithful travel to it.",
  ],
  "thorp|Criminal|Local fence": [
    "Someone here takes goods and never asks their history. The name is common knowledge. It is simply not spoken aloud.",
    "There is a person who pays for things and skips the question of where they came from. Everyone can point to the house. No one points out loud.",
  ],
  "thorp|Economy|Subsistence farming": [
    "Every household works some 12-16 acres, enough to stay alive and no more.",
    "Each family tills roughly 12-16 acres, all of it for the table.",
  ],
  "thorp|Government|Household elder": [
    "A single household head speaks for the settlement without ever being chosen to — no office, no title, no vote. Simply the door people knock on when a thing has to be settled.",
    "One head of household carries the settlement's voice by common habit rather than any appointment. Nobody named them to it; everybody defers to it anyway.",
  ],
  "thorp|Government|Lord's reeve": [
    "A distant lord's man, set here to watch the settlement and remit what it owes. His writ is legitimate; his welcome is not.",
    "Placed by a lord who never visits, he holds official charge of the settlement. The paperwork backs him. The neighbours do not.",
  ],
  "thorp|Infrastructure|Palisade": [
    "A ring of sharpened stakes around the settlement. Little real defence, but enough to turn away an idle raider.",
    "Pointed stakes driven in a rough circle. They stop nothing determined, yet enough to discourage the casual thief.",
  ],
  "thorp|Religious|Wayside shrine": [
    "A modest prayer marker. No clergy in residence.",
    "Plain wayside shrine for prayer. Unstaffed.",
  ],
  "town|Crafts|Bakers (5-15)": [
    "The town's bread. Prices fixed by the guild.",
    "Bread baked for sale, with the guild setting the price.",
  ],
  "town|Crafts|Blacksmiths (3-10)": [
    "Several smiths, each to his specialty.",
    "A number of smiths, work divided by trade.",
  ],
  "town|Criminal|Street gang": [
    "Pickpockets and bruisers working together. Ten to thirty strong.",
    "An organised crew of cutpurses and toughs, some 10 to 30 of them.",
  ],
  "town|Defense|Town walls": [
    "Gated stone defences. Costly to raise and no cheaper to keep up.",
    "Masonry walls pierced by gates. Dear to build, dearer to maintain.",
  ],
  "town|Defense|Town watch": [
    "Part-time guards who walk the night and hold the gates.",
    "Watchmen serving part-time. Night patrols and gate duty.",
  ],
  "town|Economy|Inn (multiple)": [
    "Beds for merchants on the road.",
    "Lodging for the travelling trade.",
  ],
  "town|Economy|Market square": [
    "The central plaza where the weekly market and the fairs are held. Fifty to a hundred yards to a side.",
    "A broad open square, 50 to 100 yards across, given over to market days and fairs.",
  ],
  "town|Economy|Taverns (5-20)": [
    "Houses for drink. And for company.",
    "Drinking houses, and the town's gathering places.",
  ],
  "town|Economy|Weekly market": [
    "Held by royal charter. The town's chief economic engine.",
    "Requires a charter from the crown. A principal source of the town's trade.",
  ],
  "town|Entertainment|Brothel": [
    "Prostitution, tolerated or licensed.",
    "A house of prostitution, suffered or regulated.",
  ],
  "town|Government|Mayor and council": [
    "The town's leadership, whether elected or named to office.",
    "A mayor and council, come to office by vote or appointment.",
  ],
  "town|Government|Town council": [
    "With no formal government in place, a loose council of leading citizens runs the town. It answers to no one in particular, but it beats having no one at all.",
    "Where nothing official exists, the town's notable men gather and govern by consensus. Less answerable than an elected body, and steadier than the void it fills.",
  ],
  "town|Infrastructure|Town hall": [
    "Where the town meets and its business is done.",
    "The seat of assembly and administration.",
  ],
  "town|Religious|Parish churches (2-5)": [
    "Several parishes, each with its church.",
    "The town divided among a handful of parishes.",
  ],
  "village|Crafts|Blacksmith": [
    "A full-time smith. Indispensable for tools and shoeing.",
    "Works metal full-time. Tools and horseshoes depend on him.",
  ],
  "village|Crafts|Cobbler": [
    "Makes and mends shoes and boots. Everyone needs something on their feet, which keeps this among the steadiest trades going.",
    "Cuts and repairs footwear of every kind. Since no one goes unshod, the work never dries up.",
  ],
  "village|Crafts|Midwife": [
    "Attends births, handles the hard labours, and gives what women's care there is. No medical service in a settlement is called upon more.",
    "Sees mothers through childbirth, works the difficult deliveries, and tends the ordinary complaints of women. The most-used healer anywhere.",
  ],
  "village|Crafts|Mill": [
    "A water- or wind-driven mill holding the sole right to grind. The miller tends to be the richest man in the village, and the least loved.",
    "Milling here is a monopoly, water or wind powered. Its keeper is usually the wealthiest villager and, for that reason, the most begrudged.",
  ],
  "village|Defense|Citizen militia": [
    "A community drawn up for its own defence. It turns out for raids and monster attacks, and holds together better than any hamlet levy.",
    "Organised local defence, mustered against raiders and monsters alike. Steadier than the levies a hamlet can raise.",
  ],
  "village|Economy|Ale house": [
    "Run from the home. The brewing and selling of ale is women's work.",
    "A household trade. Women brew the ale and sell it.",
  ],
  "village|Economy|Travelers' inn": [
    "The village's one inn for the traders, pilgrims, and wayfarers who pass. Beds, a stable, and a shared table.",
    "A lone inn catering to whoever the road brings — merchants, pilgrims, travellers. It offers a room, stabling, and the common meal.",
  ],
  "village|Economy|Weekly market": [
    "Local produce and wares. Held under royal or noble charter.",
    "A weekly sale of local goods. A charter from crown or lord is required.",
  ],
  "village|Government|Village reeve": [
    "Chosen from among the peasants, he arranges the work owed, settles quarrels, and stands for the village before any outside power.",
    "A peasant elected by his own — he parcels out the labour dues, mediates disputes, and speaks for the village to those above it.",
  ],
  "village|Magic|Hedge wizard": [
    "A modest resident spellcaster. 1st to 3rd level spells.",
    "A minor caster who lives here. Spells of 1st through 3rd level.",
  ],
  "village|Religious|Parish church": [
    "The hub of village life. Built in stone. Tithes are compulsory.",
    "Stone-built and central to everything. Tithing is not optional.",
  ],
  "village|Religious|Priest (resident)": [
    "Administers the sacraments and gathers the tithe. Frequently the sole person here who can read.",
    "Says the sacraments, takes the tithe. Usually the one literate soul in the village.",
  ],
});
