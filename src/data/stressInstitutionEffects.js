// stressInstitutionEffects.js — NPC institutional-secret narrative content.
//
// FIRST-PAINT LAW (@enforced-by tests/build/vendorPdfLazy.test.js): this table is
// LAZY-ONLY. Its sole consumer is the NPC generator (generators/npcGenerator.js),
// reached only via loadEngine's dynamic import() — never at first paint. It was
// split out of stressTypes.js (whose STRESS_TYPE_MAP IS eagerly reached by the
// generation spine — domain/stressorPicker — which dragged this ~24 KB secret
// table into the first-paint 'data' chunk for nothing) and off helpers.js's
// pass-through re-export (an EAGER seed, which re-dragged it back). Kept here it
// rides 'data-lazy' with the (lazy) npcGenerator that needs it. DO NOT re-export
// this from stressTypes.js or helpers.js — an eager re-export would re-drag it
// into first paint. (resourceChains / npcTraitWeights idiom.) PURE DATA (A+ Track
// H / data-schema.3): no runtime imports — covered by the src/data purity lint +
// tests/domain/dataPurity.test.js. De-minified from original minified identifiers.

export const STRESS_INSTITUTION_EFFECTS = {
  under_siege: [
    {
      secret: "Secretly negotiating surrender terms with the besieging force, without the council's knowledge",
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
      secret: "Is in contact with the besieging commander (not as a spy, as a former colleague)",
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
      secret: "Knows who is hoarding and has made a private arrangement to share the information, for a price",
      stakes: "Both the hoarder and {faction} would move against them if either found out",
    },
    {
      secret:
        "Their family has been eating normally throughout the famine (not from stores, from a private source they will not name)",
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
        "Has documentation proving the famine was caused by export decisions made by {faction}, and has been paid to lose it",
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
        "Their position under the occupation exists because they helped legitimise the takeover (a public statement they made in the first week)",
      stakes: "They were told it was just paperwork. They knew it wasn't",
    },
    {
      secret: "Is smuggling people out, but only those who can pay, and the price has been rising",
      stakes: "{npc} can't pay. They've been waiting for weeks. The next group leaves in two days",
    },
    {
      secret: "Knows the occupation commander's real orders (not the stated ones), and those orders include a date",
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
        "Knows where the settlement's founding documents are (documents that would legally invalidate the current governing structure entirely)",
      stakes: "They've been sitting on this information for eighteen months, waiting for the right moment",
    },
    {
      secret:
        "Their public neutrality is a cover. They are actively funding one faction's operations through a third party",
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
        "Knows the debt contains a clause that transfers significant civic assets to the creditor on default (a clause that was buried in the original document)",
      stakes: "{npc} is a notary who helped draft it. They've been avoiding eye contact for six months",
    },
    {
      secret:
        "Has been embezzling from civic funds to make personal debt payments, using the same creditor network for both",
      stakes: "The two debts are about to merge in a way that will be impossible to explain separately",
    },
    {
      secret:
        "Sold privileged commercial information to a foreign merchant house to cover an interest payment (information that {faction} considers proprietary)",
      stakes: "The merchant house used the information publicly. The source will be traced",
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
        "Their correspondence has been read (by whom, they don't know), but the evidence is there for anyone paying attention",
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
      stakes: "Three of the people who paid are now symptomatic. They know where they got through",
    },
    {
      secret:
        "Falsified the initial case count to prevent panic, and now the actual count is far higher than the official record",
      stakes: "{faction} is about to do their own independent count as part of a resource audit",
    },
    {
      secret:
        "Is hoarding medicinal {commodity} that should have been distributed, rationing it for their own use and close associates",
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
        "Has a document that would legally resolve the succession, in a direction that would require them to give up their current position",
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
        "The attacks are not random. They sent a patrol into that territory three weeks ago and provoked something. No one came back. They filed a false report",
      stakes: "The survivors' families believe their people died in an accident. They've been asking questions",
    },
    {
      secret:
        "Has been negotiating with the creature threat on their own authority, and the terms they've offered include access rights the settlement doesn't know they gave",
      stakes: "{npc} intercepted one communication. They don't fully understand what they read",
    },
    {
      secret:
        "The {commodity} operation they authorised six months ago disturbed a nesting site. The attacks started three weeks later",
      stakes: "The connection is in the geographic data. Someone with the right maps will make it",
    },
    {
      secret:
        "Has been selling information about patrol schedules to an outside party who claims to be a monster hunter, and may not be",
      stakes: "The last three ambushes hit patrols on days that weren't in the standard rotation",
    },
    {
      secret:
        "Their private property (inherited land outside the walls) is part of the territory being contested. They've been subtly steering the garrison away from it",
      stakes: "Two soldiers died in an area they should have been sent to protect",
    },
  ],
  insurgency: [
    {
      secret: "Has been quietly forwarding a share of the taxes they collect to the insurgency (as insurance, not conviction)",
      stakes: "If the authority survives, this is treason. If the insurgency wins, it is not enough. They bet on neither side and owe both",
    },
    {
      secret: "Wrote the anonymous manifesto that gave the insurgency its language, and has since publicly condemned it more than once",
      stakes: "{npc} recognised the phrasing. They have said nothing, but they read the condemnation with a strange expression",
    },
    {
      secret: "Is the insurgency's contact inside the council, and has been feeding it exactly the information that keeps the fighting away from their own district",
      stakes: "Three other districts have suffered. Theirs has not. Someone is beginning to notice the pattern",
    },
    {
      secret: "Ordered a crackdown that killed people who had nothing to do with the insurgency, then falsified the reports to record them as insurgents",
      stakes: "The families know their dead were innocent. One of them has kept everything",
    },
    {
      secret: "Has already negotiated their own safe passage with the insurgency's leadership in exchange for opening a gate on a night yet to be named",
      stakes: "The night is close. {faction} still believes this person is loyal",
    },
    {
      secret: "Knows the insurgency is being funded from outside the settlement, by a party the authority itself has been quietly dealing with",
      stakes: "Exposing the funding exposes the deal. They have been sitting on both halves for months",
    },
    {
      // [D6 THE UNDERWAYS] the insurgency uses the tunnels — content integration.
      secret: "Has been moving insurgent fighters and sealed messages through the underways (the dug tunnels beneath the settlement), one cellar-mouth at a time",
      stakes: "The warren has no map, but {npc} has walked it. If the authority ever forces one, this person's own route becomes the confession",
    },
  ],
  mass_migration: [
    {
      secret: "Has been selling residency papers and gate-passes to newcomers who cannot legally settle, at a price that rises with their desperation",
      stakes: "The register is falsified in a pattern anyone auditing arrivals would find. An audit has been requested",
    },
    {
      secret: "Diverted the relief meant for the newcomer camp into a private arrangement, and the shortfall is being blamed on the newcomers themselves",
      stakes: "People in the camp are dying of the shortfall. The blame is holding, for now",
    },
    {
      secret: "Is themselves a newcomer, arrived a decade ago under a false history that the current upheaval is threatening to expose",
      stakes: "The people they would rule against for lying are lying no more than they once did",
    },
    {
      secret: "Has been quietly buying up the emptied properties of those who fled, through a third party, at a fraction of their worth",
      stakes: "Some of the departed intend to return. The purchases will not survive their claims, or their questions",
    },
    {
      secret: "Knows the migration was triggered by something upstream (a failed harvest, a war, a purge) that {faction} helped cause and has been concealing",
      stakes: "The newcomers carry the proof in their own stories, if anyone here thinks to listen",
    },
    {
      secret: "Signed the order closing the settlement to further arrivals, then made a paid exception for one group now already inside the walls",
      stakes: "{npc} was turned away the same week. They saw the paid group admitted. They have not forgotten a face",
    },
  ],
  wartime: [
    {
      secret: "Has been under-declaring the settlement's stores to the requisition officers and selling the concealed {commodity} to both armies",
      stakes: "The next requisition will physically count what the ledgers claim. The ledgers are wrong by a wagon-train",
    },
    {
      secret: "Falsified the conscription rolls to keep their own household's men home, filling the quota with the names of the poor and the friendless",
      stakes: "Several of those men are dead. Their families were told it was an honour",
    },
    {
      secret: "Took a private share of the war contracts that made the settlement rich, routed through a merchant house that does not exist on paper",
      stakes: "The house's accounts exist somewhere. A rival contractor has been looking for exactly this",
    },
    {
      secret: "Knows the war is going worse than the settlement has been told, and has been quietly moving their family and their wealth ahead of the news",
      stakes: "{npc} helped load the last cart. They asked no questions then. They are asking them now",
    },
    {
      secret: "Authorised the seizure of a rival's property as a 'war measure', on evidence they invented",
      stakes: "The rival's heir survived the war the seizure was meant to fund, and has come home with the original documents",
    },
    {
      secret: "Has been feeding the enemy's quartermasters the same false supply figures they feed their own, playing both requisitions for the skim",
      stakes: "When the war ends, both sides will reconcile their books. The discrepancy points one direction",
    },
  ],
  religious_conversion: [
    {
      secret: "Converted publicly to the ascendant faith while still practising the old one in private, and has been informing on other secret adherents to prove their sincerity",
      stakes: "The people they named trusted them. Some are already ruined. One has not yet been named",
    },
    {
      secret: "Holds the deeds and endowments of the old religious institution, which they were meant to transfer, and has been quietly keeping them in the confusion",
      stakes: "Both faiths claim the properties. Only this person knows the documents never actually moved",
    },
    {
      secret: "Engineered the 'miracle' that tipped the settlement toward the new faith, and knows exactly how it was done",
      stakes: "The apparatus still exists, hidden. Anyone who found it would unmake the conversion and every career built on it",
    },
    {
      secret: "Was a senior figure in the old faith and surrendered its secrets (its finances, its sanctuary lists, its private sins) to the new one to secure a place",
      stakes: "The sanctuary lists named people now being hunted. {npc} was on a list this person handed over",
    },
    {
      secret: "Has been forging records to erase the old faith's marriages, oaths, and legitimacies, retroactively unmaking inheritances and alliances",
      stakes: "One of the unmade legitimacies belongs to a family with the means to check the originals",
    },
    {
      secret: "Knows the conversion was arranged for reasons that had nothing to do with faith (a debt, a marriage, a foreign hand) and holds the correspondence that proves it",
      stakes: "{faction} would pay to bury it. The other faith would pay more to reveal it",
    },
  ],
  slave_revolt: [
    {
      secret: "Has been in secret contact with the revolt's leadership, brokering terms the governing faction has refused to authorise",
      stakes: "If the negotiation is discovered they hang as a traitor; if it fails the settlement burns. They have told no one",
    },
    {
      secret: "Owned a share of the slave market and has been destroying the records of exactly whom they owned before those records can be turned against them",
      stakes: "{npc} kept a copy. They have not yet decided what to do with it",
    },
    {
      secret: "Freed and armed a group of the enslaved themselves, quietly, before the revolt began, for reasons they have not disclosed and cannot now defend",
      stakes: "Those they armed are among the revolt's leaders. If it is known who gave them steel, the answer implicates this person entirely",
    },
    {
      secret: "Knows the revolt began because of a specific atrocity the authorities ordered and then denied",
      stakes: "The order exists in writing. This person filed it. They have been trying to make it disappear for six days",
    },
    {
      secret: "Has already arranged to flee with their wealth the moment the walls are breached, abandoning the defence they are publicly organising",
      stakes: "The garrison is holding partly on faith in this person's leadership. That faith is misplaced",
    },
    {
      secret: "Is protecting one specific enslaved person for private reasons, at the cost of intelligence that would help contain the revolt",
      stakes: "The person they are protecting is close to the revolt's leadership. The connection would ruin them if it were traced",
    },
    {
      // [D6 THE UNDERWAYS] the revolt uses the tunnels — content integration.
      secret: "Has been running the enslaved out through the underways for weeks before the revolt broke, using smugglers' tunnels no census ever recorded",
      stakes: "Those they moved are now among the revolt's fighters, and the tunnel-keepers know exactly who paid for the passage",
    },
  ],
};
