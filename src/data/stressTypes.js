// stressTypes.js — PURE DATA (A+ Track H / data-schema.3).
//
// The executable `summary: (r) => …` closures (which captured rngContext.random
// and a runtime-global getInstFlags) were extracted to
// src/generators/stressNarrative.js (stressSummary). This file now holds only
// pure stressor fields — no runtime imports, no RNG capture — and is covered by
// the src/data purity lint (eslint.config.js) + tests/domain/dataPurity.test.js.
// De-minified from original minified identifiers.

export const STRESS_TYPE_MAP = {
  under_siege: {
    label: "Under Siege",
    icon: "",
    colour: "#8b1a1a",
    probability: 0.025,
    requiresTier: null,
    crisisHook:
      "The settlement is surrounded. Someone in the leadership is considering terms. Someone else is considering a desperate sortie. The players arrive as this decision is being forced.",
    viabilityNote:
      "Land-based economic activity is suspended. Port access (if present) provides a partial lifeline. The only metric that matters is how long food, water, and ammunition hold out.",
    historyColour: "military",
  },
  famine: {
    label: "Famine",
    icon: "",
    colour: "#8b5a1a",
    probability: 0.027,
    requiresTier: null,
    crisisHook:
      "A grain merchant has food, enough to matter. They will sell it, but their price is not money. The party can decide how that bargain ends.",
    viabilityNote: "Short-term economic viability is critically compromised. Normal income projections do not apply.",
    historyColour: "economic",
  },
  occupied: {
    label: "Under Occupation",
    icon: "",
    colour: "#4a3a6b",
    probability: 0.021,
    requiresTier: null,
    crisisHook:
      "A resistance cell needs outside help: people who aren't known faces. The occupation's local collaborators include someone the players will recognise.",
    viabilityNote: "Revenue flows to the occupying authority. Local institutions continue under oversight.",
    historyColour: "political",
  },
  politically_fractured: {
    label: "Politically Fractured",
    icon: "️",
    colour: "#5a4a1a",
    probability: 0.034,
    requiresTier: null,
    crisisHook:
      "Something important (a resource, a prisoner, a decision) falls into the contested space between factions. The players can't avoid taking a side.",
    viabilityNote:
      "Decision-making is paralysed. Infrastructure maintenance is being neglected. Crisis is deferred, not resolved.",
    historyColour: "political",
  },
  indebted: {
    label: "Indebted to Outside Power",
    icon: "",
    colour: "#1a4a5a",
    probability: 0.036,
    requiresTier: null,
    crisisHook:
      "The creditor has sent a representative to collect: not money, but something specific. Locals are divided between compliance and resistance, and neither option is clean.",
    viabilityNote:
      "A significant portion of revenue is being extracted by the creditor. Capital investment has stopped.",
    historyColour: "economic",
  },
  recently_betrayed: {
    label: "Recently Betrayed",
    icon: "️",
    colour: "#6b1a2a",
    probability: 0.027,
    requiresTier: null,
    crisisHook:
      "The betrayal had consequences that are still unfolding. The betrayer may still be here. The players know something that could help identify them, or they are the only people who don't have a motive.",
    viabilityNote: "Trust in institutions is low. Some key systems are not operating at full capacity as a result.",
    historyColour: "political",
  },
  infiltrated: {
    label: "Infiltrated",
    icon: "",
    colour: "#1a3a4a",
    probability: 0.023,
    requiresTier: null,
    crisisHook:
      "Something is slightly wrong: a decision that doesn't make sense, a face seen in too many places, a piece of information that reached the wrong hands. The players can notice if they pay attention.",
    viabilityNote: "No economic impact yet. The infiltration is strategic, not extractive. So far.",
    historyColour: "political",
  },
  plague_onset: {
    label: "Disease Outbreak",
    icon: "",
    colour: "#2a5a2a",
    probability: 0.027,
    requiresTier: null,
    crisisHook:
      "The healer who identified the outbreak first has gone quiet. Their last message suggested the disease is not natural. Accessing them means navigating a quarantine that is not being enforced consistently.",
    viabilityNote: "Market activity is reduced. Travel is being discouraged. Some supply chains are disrupted.",
    historyColour: "disaster",
  },
  succession_void: {
    label: "Succession Void",
    icon: "",
    colour: "#5a3a1a",
    probability: 0.03,
    requiresTier: null,
    crisisHook:
      "Three different factions have approached the players for support, each believing they represent the legitimate or best claim. All three are partly right.",
    viabilityNote: "Major decisions are deferred. Some institutions are operating autonomously, for better or worse.",
    historyColour: "political",
  },
  monster_pressure: {
    label: "Beast & Raider Threat",
    icon: "",
    colour: "#3a1a1a",
    probability: 0.03,
    requiresTier: null,
    crisisHook:
      "The attacks are following a pattern that suggests coordination, not desperation. Someone is directing this: a rival lord, a beast of unusual cunning, or something stranger. The evidence is there for anyone who looks carefully.",
    viabilityNote:
      "Trade disruption is reducing income. Defensive expenditure is increasing. Population anxiety is rising.",
    historyColour: "military",
  },
  insurgency: {
    label: "Insurgency",
    icon: "",
    colour: "#6b1a3a",
    probability: 0.029,
    requiresTier: null,
    crisisHook:
      "The governing faction knows what is happening but cannot admit it publicly without legitimising the insurgency. They need something done that cannot be official.",
    viabilityNote:
      "Tax collection is contested. Several institutions have stopped forwarding revenue to the central authority. Normal governance is functioning on momentum.",
    historyColour: "political",
  },
  religious_conversion: {
    label: "Religious Conversion",
    icon: "️",
    colour: "#3a1a5a",
    probability: 0.023,
    requiresTier: null,
    crisisHook:
      "The contested religious authority has left a gap in the institutions that depended on it: records, oaths, property, sanctuary. Someone is about to exploit that gap.",
    viabilityNote:
      "Tithing income splits or redirects. Religious market days and fairs are contested or duplicated. Properties of the old institution are in legal ambiguity. Cross-faith trade is complicated.",
    historyColour: "religious",
  },
  slave_revolt: {
    label: "Slave Revolt",
    icon: "️",
    colour: "#6b1a1a",
    probability: 0.012,
    requiresTier: "town",
    crisisHook:
      "The revolt's leadership has demands. Some of them are negotiable. The governing faction has not admitted this publicly, and one of them is attempting to open a back channel.",
    viabilityNote:
      "The slave market's commercial operations are suspended. Labour-dependent production is disrupted. The security apparatus is entirely focused on containment.",
    historyColour: "political",
  },
  wartime: {
    label: "Wartime",
    icon: "",
    colour: "#5a2a0a",
    probability: 0.026,
    requiresTier: null,
    crisisHook:
      "A crown officer has arrived with requisition orders that will strip the settlement of something it cannot spare. The governing faction must decide whether to comply, negotiate, or find a third option.",
    viabilityNote:
      "Military expenditure dominates the economy. Trade disruption is significant but offset by war contracts for some. Labour shortage from conscription affects agricultural and craft output.",
    historyColour: "military",
  },
  mass_migration: {
    label: "Mass Migration",
    icon: "",
    colour: "#2a4a6b",
    probability: 0.025,
    requiresTier: null,
    crisisHook:
      "The question is not whether things will change, but who will shape the change and what they will want in return.",
    viabilityNote:
      "Immigration: food balance stressed, labour market disrupted, criminal opportunity elevated. Emigration: tax base shrinking, institutions hollowing, labour shortage emerging.",
    historyColour: "demographic",
  },
};

// ── Stress institution narrative effects (moved from helpers.js) ─────────────
export const STRESS_INSTITUTION_EFFECTS = {
  under_siege: [
    {
      secret: "Secretly negotiating surrender terms with the besieging force without the council's knowledge",
      stakes: "Treason. The garrison would execute them on the spot if they found out",
    },
    {
      secret: "Has been rationing their own private food stores while publicly enforcing the communal rationing order",
      stakes: "The garrison knows about the stores; they've been paid to look the other way",
    },
    {
      secret: "Passed information about the settlement's water supply to someone outside the walls three weeks ago",
      stakes: "People have already died because of it; they've been living with that knowledge",
    },
    {
      secret: "Knows a section of the outer wall is structurally compromised and has told no one",
      stakes: "Telling the council means explaining why they knew and said nothing for two weeks",
    },
    {
      secret: "Has already made personal arrangements to leave before the final assault. Their family left last week",
      stakes: "{npc} saw them loading the cart. They don't know what {npc} understood",
    },
    {
      secret: "The supplies they declared destroyed in a fire are actually hidden in a location only they know",
      stakes: "People are starving. The supplies could last another month",
    },
    {
      secret: "Is in contact with the besieging commander, not as a spy but as a former colleague",
      stakes:
        "The relationship predates the siege. They've been using it to buy time, but the council would not accept the distinction",
    },
    {
      secret: "Authorised an illegal sortie that failed. Five people died and no record was kept",
      stakes: "{npc} survived it. They know, and they've been drinking heavily ever since",
    },
    {
      secret: "Has been skimming from the {commodity} reserves to pay a personal debt that predates the siege",
      stakes:
        "The shortage will be noticed when the final accounting is done. They're hoping they die before that happens",
    },
  ],
  famine: [
    {
      secret: "Controls a hidden cache of {commodity} reserves that could feed the settlement for two more weeks",
      stakes: "{faction} suspects it. They've been watching the property",
    },
    {
      secret:
        "Sold the settlement's emergency grain reserves three months ago at peak price and reported them destroyed in a flood",
      stakes: "The flood was real. The reserves were already gone. The paperwork is missing one date",
    },
    {
      secret:
        "Has been reporting false harvest figures to the regional authority to suppress aid that would undercut their price control",
      stakes: "People have died. The regional inspector arrives in six days",
    },
    {
      secret: "Knows who is hoarding and has made a private arrangement to share the information for a price",
      stakes: "Both the hoarder and {faction} would move against them if either found out",
    },
    {
      secret:
        "Their family has been eating normally throughout the famine, not from stores but from a private source they will not name",
      stakes: "{npc} has noticed. They asked once. They were told to forget it",
    },
    {
      secret:
        "Helped engineer the original supply disruption that triggered the famine, believing it would only last a week",
      stakes: "It has lasted six. They did not anticipate this. They cannot undo it. They cannot admit it",
    },
    {
      secret:
        "Is receiving {commodity} shipments through a covert route and selling them at triple the official price after dark",
      stakes: "Three people know. One of them is already dead. The other two don't know about each other",
    },
    {
      secret:
        "Has documentation proving the famine was caused by export decisions made by {faction}. Has been paid to lose it",
      stakes: "The documentation exists in another form. Somewhere",
    },
  ],
  occupied: [
    {
      secret: "Has been feeding information to the occupation authority since the first week, not under duress",
      stakes: "{npc} is part of the resistance. They trust this person completely",
    },
    {
      secret:
        "Made a private arrangement with the occupation commander that ensures their safety and their family's at the cost of three others' names",
      stakes: "Those three people don't know why they were arrested",
    },
    {
      secret:
        "Was part of the original resistance but surrendered their entire cell's identities to avoid imprisonment",
      stakes:
        "Some of them are still alive in the occupation's custody. They believe they were betrayed by someone else",
    },
    {
      secret:
        "Has been documenting occupation atrocities in secret, but for sale to the highest bidder, not for justice",
      stakes: "{faction} would pay well. So would the occupation authority, to suppress it",
    },
    {
      secret:
        "Their position under the occupation exists because they helped legitimise the takeover. A public statement they made in the first week",
      stakes: "They were told it was just paperwork. They knew it wasn't",
    },
    {
      secret: "Is smuggling people out, but only those who can pay, and the price has been rising",
      stakes: "{npc} can't pay. They've been waiting for weeks. The next group leaves in two days",
    },
    {
      secret: "Knows the occupation commander's real orders, not the stated ones. Those orders include a date",
      stakes: "The date is soon. Telling anyone means explaining how they know",
    },
  ],
  politically_fractured: [
    {
      secret: "Has been playing both factions simultaneously, feeding each the other's plans",
      stakes: "{faction} just sent someone to verify information that won't check out. The meeting is tomorrow",
    },
    {
      secret: "The vote that split the council was not actually close. They falsified the count",
      stakes: "The original tallies still exist somewhere. {npc} was in the room",
    },
    {
      secret:
        "Has already agreed to support whichever faction wins in exchange for a specific appointment they have not disclosed",
      stakes: "They've made this offer to both sides. Both sides believe they have an exclusive commitment",
    },
    {
      secret:
        "Was responsible for the incident that triggered the fracture: an act of deliberate sabotage they've successfully blamed on the other faction",
      stakes: "One member of the faction they framed knows the truth and has been building a case",
    },
    {
      secret:
        "Knows where the settlement's founding documents are. Documents that would legally invalidate the current governing structure entirely",
      stakes: "They've been sitting on this information for eighteen months, waiting for the right moment",
    },
    {
      secret:
        "Their public neutrality is a cover: they are actively funding one faction's operations through a third party",
      stakes:
        "{npc} traced one payment. They came to ask about it. They accepted the explanation. They didn't believe it",
    },
  ],
  indebted: [
    {
      secret:
        "The debt was not authorised by the council. They signed alone under pressure and have been hiding it for two years",
      stakes: "{faction} is about to discover this in the accounts they requested",
    },
    {
      secret:
        "Has been making personal side payments to the creditor's representative in exchange for delay notices that look official",
      stakes: "The representative's records will be audited when the contract matures. In three months",
    },
    {
      secret:
        "Knows the debt contains a clause that transfers significant civic assets to the creditor on default. A clause that was buried in the original document",
      stakes: "{npc} is a notary who helped draft it. They've been avoiding eye contact for six months",
    },
    {
      secret:
        "Has been embezzling from civic funds to make personal debt payments, using the same creditor network for both",
      stakes: "The two debts are about to merge in a way that will be impossible to explain separately",
    },
    {
      secret:
        "Sold privileged commercial information to a foreign merchant house to cover an interest payment. Information that {faction} considers proprietary",
      stakes: "The merchant house used the information publicly, and the source will be traced",
    },
    {
      secret:
        "The original {commodity} contract that created the debt was based on projections they knew were false at the time of signing",
      stakes:
        "The creditor's representative has begun asking questions that suggest they've found the original projection documents",
    },
    {
      secret:
        "Has already transferred personal assets out of the settlement to a safe location, anticipating default and the personal liability that follows",
      stakes:
        "{npc} helped with the transfer. They've said nothing. They're waiting to see what they get for their silence",
    },
  ],
  recently_betrayed: [
    {
      secret: "They were the betrayer, not the person the investigation has been pursuing",
      stakes:
        "The evidence against the other person is circumstantial but strong. Letting it proceed is the easiest thing in the world",
    },
    {
      secret: "Knows who did it and has said nothing. The betrayer is someone they owe a significant debt to",
      stakes:
        "The debt is called in if they speak. The settlement suffers if they don't. They've been choosing themselves for six weeks",
    },
    {
      secret:
        "Participated in the original betrayal in a minor capacity and has been helping frame someone else ever since",
      stakes: "{npc} saw them at a meeting they claimed not to attend. {npc} has not yet understood what they saw",
    },
    {
      secret:
        "Has the actual evidence of who committed the betrayal. They found it accidentally and immediately hid it",
      stakes:
        "The evidence also implicates {faction}, which means the fallout would be much larger than anyone currently expects",
    },
    {
      secret:
        "Was approached before the betrayal and said no, but also said nothing to warn anyone, for reasons they still believe were defensible",
      stakes:
        "If the investigation reaches them, the question of what they knew and when will end their career even if they're not charged",
    },
  ],
  infiltrated: [
    {
      secret:
        "Has been meeting with someone whose affiliation they now suspect. They didn't know at the time, and stopping the meetings would confirm they suspect something",
      stakes: "The information passed was minor. Or seemed minor. They're no longer certain",
    },
    {
      secret:
        "Noticed an inconsistency in {npc}'s behaviour three weeks ago and said nothing, deciding it was probably nothing",
      stakes: "It was not nothing. And now they've waited too long to raise it without explaining why they waited",
    },
    {
      secret:
        "Their correspondence has been read, by whom they don't know, but the evidence is there for anyone paying attention",
      stakes:
        "The correspondence contains something that would end their career if taken out of context. It will be taken out of context",
    },
    {
      secret:
        "Is the infiltrator, placed by an outside interest before the settlement's current leadership took power",
      stakes:
        "Their handler has not made contact in four months. They don't know if that means the operation is over or if something has changed",
    },
    {
      secret:
        "Was recruited by the infiltrating party a year ago and has been passing low-level information, telling themselves it doesn't matter",
      stakes: "They were recently asked for something that does matter. They said yes",
    },
  ],
  plague_onset: [
    {
      secret: "Knows the disease's origin and has been suppressing that information to protect someone they care about",
      stakes: "The outbreak has spread to three more households since they made that decision",
    },
    {
      secret: "Has already been exposed and is symptomatic, presenting publicly as unaffected",
      stakes: "{npc} stands close to them every day. They've said nothing",
    },
    {
      secret:
        "The quarantine order they're enforcing doesn't apply to shipments from a specific merchant they have a financial relationship with",
      stakes: "That merchant's last shipment arrived four days ago",
    },
    {
      secret:
        "Has been selling access to unquarantined routes for cash. The price goes up as the desperation increases",
      stakes: "Three of the people who paid are now symptomatic, and they know where they got through",
    },
    {
      secret:
        "Falsified the initial case count to prevent panic. Now the actual count is far higher than the official record",
      stakes: "{faction} is about to do their own independent count as part of a resource audit",
    },
    {
      secret:
        "Is hoarding medicinal {commodity} that should have been distributed. Rationing it for their own use and close associates",
      stakes: "The official stores are now visibly insufficient. Someone will investigate where the gap is",
    },
  ],
  succession_void: [
    {
      secret:
        "Has already committed to supporting a specific claimant in private, while publicly presenting as neutral",
      stakes: "They made the same commitment to the other claimant last week",
    },
    {
      secret:
        "Knows the deceased's actual wishes regarding succession. They were told privately and have chosen not to share them",
      stakes:
        "The wishes favour neither of the current claimants. Sharing them would destabilise everything and serve justice simultaneously",
    },
    {
      secret:
        "Has a document that would legally resolve the succession in a direction that would require them to give up their current position",
      stakes: "They've been sitting on it for three weeks. The longer they wait, the harder the explanation",
    },
    {
      secret:
        "Was promised a specific appointment by one claimant in exchange for a public endorsement they have not yet delivered",
      stakes:
        "The claimant is now asking why the endorsement hasn't come. The answer is that the other claimant offered more",
    },
    {
      secret:
        "Has been quietly removing records from the archive that would complicate the succession in ways they prefer not to see complicated",
      stakes: "{npc} manages the archive and has noticed the gaps. They've raised it with {faction}",
    },
  ],
  monster_pressure: [
    {
      secret:
        "The attacks are not random. They sent a patrol into that territory three weeks ago and provoked something. No one came back, so they filed a false report",
      stakes: "The survivors' families believe their people died in an accident. They've been asking questions",
    },
    {
      secret:
        "Has been negotiating with the creature threat on their own authority. The terms they've offered include access rights the settlement doesn't know they gave",
      stakes: "{npc} intercepted one communication. They don't fully understand what they read",
    },
    {
      secret:
        "The {commodity} operation they authorised six months ago disturbed a nesting site. The attacks started three weeks later",
      stakes: "The connection is in the geographic data. Someone with the right maps will make it",
    },
    {
      secret:
        "Has been selling information about patrol schedules to an outside party who claims to be a monster hunter. They may not be",
      stakes: "The last three ambushes hit patrols on days that weren't in the standard rotation",
    },
    {
      secret:
        "Their private property (inherited land outside the walls) is part of the territory being contested. They've been subtly steering the garrison away from it",
      stakes: "Two soldiers died in an area they should have been sent to protect",
    },
  ],
};
