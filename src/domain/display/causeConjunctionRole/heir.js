/**
 * causeConjunctionRole/heir.js — the ROLE-TIER conjunction lines for
 * heir — the claimant (succession, allowance, backers, the family seat).
 *
 * One authored leaf of the role table assembled in ../causeConjunctionRoleContent.js;
 * see that file for the tier contract, the stage semantics, and the SIDE-CAR LAW
 * (generation never imports this; it is read only through the lazy dossier NPC card).
 * Keyed causeClass → lifecycleStage → lines. Pure data: no imports, no slots, no rng.
 * Deliberately NOT frozen here — the assembled table takes the single shallow
 * Object.freeze, exactly as before the split, so the read surface is unchanged.
 *
 * @type {Record<string, Record<string, ReadonlyArray<string>>>}
 */
export const HEIR_ROLE_CONTENT = {
  underfunded: {
    attributed: [
      'The allowance was cut and the claimant kept the style of an heir anyway; the difference is borrowed against the succession, from people who collect early.',
      'The claimant\'s pockets are empty, so the claimant borrows against the inheritance, which is already pledged twice over.',
    ],
    're-caused': [
      'The claimant\'s first reason is gone, but now the allowance is cut, and the creditors know a short-pursed heir keeps signing.',
    ],
    reformed: [
      'The allowance was restored and the claimant bought the debts back; the succession is pledged to no one, for the first time in memory.',
      'With the family purse reopened, the claimant came clean, named the creditors, and paid them off in front of witnesses.',
    ],
    historicized: [
      'The allowance came back, but the claimant still borrows from the moneylenders against the seat.',
    ],
    'exposed-public': [
      'It is public that the claimant pledged the inheritance to moneylenders, and the family is learning how much of its future is already spent.',
      "The claimant's debts are out, and the worst of it is the security: the succession itself was pledged.",
      "The moneylenders who hold the claimant's pledge are already asking the family when the inheritance will be theirs.",
    ],
    're-adjudicated': [
      "Whoever held the claimant's debts before is gone, but now the allowance runs short, and the claimant borrows from whoever will lend.",
    ],
  },
  'chain-starved': {
    attributed: [
      "The family trade starves on the broken supply lines, and the claimant has kept it breathing with pledged favors; the suppliers hold promises signed against the seat's future.",
      "When the wagons stopped, the claimant paid for today's food with promises of future favor; the house eats, and its next ruler is already in debt.",
    ],
    're-caused': [
      "The claimant's first reason is gone, but now the supply lines are cut, and the favors promised to suppliers keep the house fed.",
    ],
    reformed: [
      'The supply lines were restored and the claimant bought back every pledged favor; the succession owes nothing it did not choose.',
      'With the wagons running again, the claimant came clean to the family about what had been promised, and unwound it piece by piece.',
    ],
    historicized: [
      'The trade routes are mended, but the claimant never took back the favors pledged to the suppliers.',
    ],
    'exposed-public': [
      'It is out that the claimant mortgaged the future of the house to keep its trade alive, and the promised favors are being tallied in public.',
      "The suppliers have shown their paper: the claimant's signature, pledging the seat's favor for wagonloads, and the family is counting the cost.",
      "The family is counting what the claimant promised the suppliers in the seat's name, wagonload by wagonload.",
    ],
    're-adjudicated': [
      'Whoever held the claimant\'s pledges before is gone, but now the supply lines are cut, and whoever moves goods holds the claimant\'s promises.',
    ],
  },
  depleted: {
    attributed: [
      'The estate stores are empty, and the claimant has been quietly selling what the family thinks it still owns; the plate is pewter now, and the vault echoes.',
      "The great house's stores ran short too, and the claimant has been selling heirlooms out the back door and parts of the entailed estate for coin.",
    ],
    're-caused': [
      'The claimant\'s first reason is gone, but now the estate stores are empty, and each heirloom sold buys another season of keeping up appearances.',
    ],
    reformed: [
      'The stores recovered and the claimant stopped the sales; what could be bought back was, and the rest was confessed to the family.',
      'With the estate replenished, the claimant came clean about the emptied vault; the accounting was ugly and complete.',
    ],
    historicized: [
      'The estate recovered, but the claimant still sells the family\'s heirlooms out the back door.',
    ],
    'exposed-public': [
      'It is public that the claimant sold the heirlooms while the stores ran dry, and the family is inventorying a vault it no longer recognizes.',
      "The quiet sales are out: the claimant sold the family's heirlooms for food and kept part of the money.",
      'The family has opened the vault and found the heirlooms gone, sold for food, and less money back than they fetched.',
    ],
    're-adjudicated': [
      "Whoever was buying from the claimant before is gone, but now the stores are empty, and the claimant sells what is left of the house's goods to whoever pays.",
    ],
  },
  'trade-strangled': {
    attributed: [
      "The family fortune lives on trade, and trade is strangled, so the claimant runs the embargo under the family name; the house's caravans are searched by reputation only.",
      'The embargo would have beggared the house, and the claimant declined to be beggared; the family colors now cover cargo the law has banned.',
    ],
    're-caused': [
      "The claimant's first reason is gone, but now an embargo chokes the trade, and contraband under the family colors pays the claimant's way.",
    ],
    reformed: [
      'The embargo lifted and the claimant grounded the night caravans; the family name covers only lawful freight again.',
      'When trade reopened, the claimant came clean; the contraband runs were confessed to the family before any inspector found them.',
    ],
    historicized: [
      'The routes are open again, but the claimant still runs smuggled cargo under the family name.',
    ],
    'exposed-public': [
      "It is public that the family colors covered contraband through the embargo, and the claimant's name is on the manifests.",
      "The house's caravans are being searched at last, and the town knows why they never were before: the claimant used the family name to cover contraband.",
      "Merchants who kept the embargo watched the family's caravans go through unsearched, and now they know what the claimant had in them.",
    ],
    're-adjudicated': [
      'Whoever paid the claimant before is gone, but now an embargo chokes the trade, and whoever runs the family-flagged cargo knows what the claimant signed.',
    ],
  },
  'levied-away': {
    attributed: [
      "The men who would have watched the succession are away at war, and the claimant is moving on it early; witnesses vanish, documents shift, and no one armed is left to mind the claimant's manners.",
      'With the soldiers away at the war, the claimant has been changing the inheritance while no one is watching.',
    ],
    're-caused': [
      "The claimant's first reason is gone, but now the soldiers are away at the war, and the claimant keeps changing the succession unwatched.",
    ],
    reformed: [
      'The companies came home and the claimant undid the quiet moves; the shifted documents were restored before anyone thought to look.',
      'When the strength returned, the claimant came clean to the family; what absence had made easy, presence made shameful.',
    ],
    historicized: [
      'The soldiers are home, but the claimant has not undone a single change made to the succession while they were away.',
    ],
    'exposed-public': [
      'The returned soldiers have learned what the claimant did to the succession while they were gone, and the shifted papers are being unshifted in public.',
      'It is out that the claimant worked the inheritance while the strength was at war, and the family is reading the amended documents aloud.',
      "The soldiers back from the war are hearing the claimant's changes to the succession read aloud, one amended page at a time.",
    ],
    're-adjudicated': [
      "Whoever paid the claimant before is gone, but now the soldiers are away at the war, and with no one watching the succession, the claimant carries on.",
    ],
  },
  'garrison-drained': {
    attributed: [
      'With the garrison hollow, the claimant hired private blades for protection, and pays them in promises: land, office, pardon, whatever the seat may someday grant.',
      'The claimant walks safe through a lawless town because hired steel walks behind, and the hire is written against the inheritance.',
    ],
    're-caused': [
      "The claimant's first reason is gone, but now the garrison is half empty, and the hired blades collect what the claimant promised them.",
    ],
    reformed: [
      'The garrison was refilled and the claimant paid the blades off in honest coin, canceling every promised favor with witnesses present.',
      'With the ranks restored, the claimant came clean; the promissory protection was dissolved and the blades dismissed.',
    ],
    historicized: [
      'The garrison is full again, but the claimant still keeps the hired blades.',
    ],
    'exposed-public': [
      'It is public that the claimant promised offices and pardons to hired steel, and the town is asking what else the succession has already sold.',
      "The claimant's bodyguard contract is out: paid in the seat's future favors, and the seat does not yet belong to the claimant to promise.",
      'The hired guards are waiting to be paid in offices the claimant does not yet hold, and the town wants to know what else was promised.',
    ],
    're-adjudicated': [
      'Whoever paid the claimant before is gone, but now the garrison is half empty, and the hired blades still expect what the claimant promised them.',
    ],
  },
  'siege-scarred': {
    attributed: [
      "The war is pressing, and the claimant has been promising the seat's allegiance in advance, to both sides, in writing; whoever wins, a letter exists.",
      "Under the war's pressure the claimant insures the succession the old way: quiet pledges to every camp, priced in the house's future loyalty.",
    ],
    're-caused': [
      "The claimant's first reason is gone, but now the war presses in, and the letters pledging the house to both sides bind the claimant.",
    ],
    reformed: [
      'The war receded and the claimant burned the pledge letters, both sets, and told the family what had been written.',
      'With the pressure lifted, the claimant came clean; the promised allegiances were recalled before either side could collect.',
    ],
    historicized: [
      'The war has moved on, but the claimant never recalled the pledge letters.',
    ],
    'exposed-public': [
      'It is out that the claimant pledged the seat to both camps during the war, and each side has produced its letter.',
      "The pledge letters are public: the claimant promised the house's allegiance to both sides, and no one now trusts the family's word.",
      "Each side of the war holds a letter pledging the house to it in the claimant's hand, and the family's word is worth little now.",
    ],
    're-adjudicated': [
      "Whoever held the claimant's letters before is gone, but now the war presses in, and whoever holds the letters expects them honored.",
    ],
  },
  occupation: {
    attributed: [
      'The occupier has promised the claimant the succession, and the claimant earns it weekly: names, movements, and the mood of the family table, all reported.',
      "The claimant's path to the seat now runs through the occupation office, and the toll is information about everyone who trusts them.",
    ],
    're-caused': [
      "The claimant's first reason is gone; now the occupier's promise of the seat keeps the claimant informing.",
    ],
    reformed: [
      'The occupier withdrew and the claimant confessed the reports to the family, every one; the promised succession was renounced with them.',
      'With the occupation ended, the claimant came clean about the bargain; the seat was to be the fee, and the family now knows for what.',
    ],
    historicized: [
      'The occupier is gone, but the claimant still watches the family and reports like an informer.',
    ],
    'exposed-public': [
      "It is public that the claimant informed for the occupier against a promise of the seat, and the family is reading the reports with their names in them.",
      'The bargain is out: the succession for surveillance, and every arrest in the household during the occupation now has an author.',
      "Members of the household arrested during the occupation are reading the claimant's reports to the occupier, with their names in them.",
    ],
    're-adjudicated': [
      "Whoever paid the claimant before is gone, but now the occupier is in control, and its officials have renewed the promise of the seat.",
    ],
  },
  'conduct-drift': {
    attributed: [
      "A dark patron favors the claimant's ambition and rewards its shortcuts; each rival quietly ruined comes back as blessing and standing.",
      "The claimant's path to the seat is being cleared by methods a house should refuse, and a patron that loves the methods keeps paying for more.",
    ],
    're-caused': [
      "The claimant's first reason is gone, but now a dark patron rewards the shortcuts, and its favor pays for the claimant's ambition.",
    ],
    reformed: [
      "The patron's shadow lifted and the claimant stopped clearing the path; unblessed, the ruined rivals were made whole where coin could do it.",
      'With the rewarding patron gone, the claimant came clean; the ambition remains, but it walks in daylight now.',
    ],
    historicized: [
      'The patron is gone, but the claimant still uses its methods against rivals.',
    ],
    'exposed-public': [
      "It is public that the claimant's rivals fell to sponsored ruin, and the town is re-reading each misfortune as an offering.",
      "The sponsorship is out: a dark patron paid for the claimant's clear path, and the family is asking what was promised in return.",
      "The claimant's ruined rivals are asking whether a dark patron paid for their ruin, and what the claimant promised it.",
    ],
    're-adjudicated': [
      "Whoever paid the claimant before is gone, but now a dark patron rewards the shortcuts, and the claimant serves it alone.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      "The rival faith backs the claimant's succession, and the price is posted nowhere but understood: the house's altar changes hands with the seat.",
      "The claimant's claim has foreign prayers behind it now; the rival mission funds the lawyers and expects the family chapel in return.",
    ],
    're-caused': [
      "The claimant's first reason is gone; now the rival faith backs the claim, and the promised chapel keeps the claimant bound.",
    ],
    reformed: [
      'The rival faith withdrew and the claimant returned the backing; the chapel stays as it was, and the claim stands on its own.',
      'When the conversion pressure broke, the claimant came clean about the promised altar, and the family reconsecrated it to be sure.',
    ],
    historicized: [
      "The rival faith gave up the town, but the claimant never returned the backing, and still owes it the family chapel.",
    ],
    'exposed-public': [
      "It is out that the rival faith funds the claimant's suit, and what was promised for it; the family altar has become the town's business.",
      "The backing is public: the claimant sold the house's faith for the house's seat, and both congregations have opinions.",
      "The house's own congregation has learned that the rival faith is paying for the claimant's suit.",
    ],
    're-adjudicated': [
      "Whoever paid the claimant before is gone, but now a rival faith presses in, and its money covers the claimant's debts in exchange for the family altar.",
    ],
  },
  secularization: {
    attributed: [
      'The succession oaths were sworn before a god this town has stopped fearing, and the claimant has noticed; witnesses are being bought whom an oath once made unnecessary.',
      'With the faith gone cold, the vows that bound the succession bind no one, and the claimant has been rewriting the family history.',
    ],
    're-caused': [
      "The claimant's first reason is gone, but now the faith has gone cold, and with no oath left to fear, the claimant keeps buying witnesses.",
    ],
    reformed: [
      'The faith revived and the claimant re-swore the succession vows at the altar, and dismissed the bought witnesses unpaid.',
      'When belief returned, the claimant came clean; the amended history was unamended, and the vows given weight again.',
    ],
    historicized: [
      'The faith warmed again, but the claimant still pays the bought witnesses.',
    ],
    'exposed-public': [
      'It is public that the claimant bought witnesses while the oaths meant nothing, and the reviving faith has made the succession its test case.',
      "The changes are out: the claimant rewrote the family papers while the faith was cold, and the returning congregation wants them put back.",
      'The reviving faith wants the family papers put back as they were, and the witnesses the claimant bought named.',
    ],
    're-adjudicated': [
      "Whoever paid the claimant before is gone, but now the faith has gone cold, and no oath shames the claimant into stopping.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The tainted priests will consecrate anything for the right fee, and the claimant has been a steady customer; the succession gathers blessings it did not earn.',
      "The disgraced clergy still hold the seals that make a claim lawful, and the claimant buys their stamp on the house's papers.",
    ],
    're-caused': [
      "The claimant's first reason is gone, but now the priesthood is disgraced, and the blessings bought from it hold the claim up.",
    ],
    reformed: [
      'The priesthood was cleansed and the claimant surrendered the bought blessings; the claim stands now on blood and law alone.',
      "With the clergy's scandal resolved, the claimant came clean; the purchased consecrations were annulled at the claimant's own request.",
    ],
    historicized: [
      'The temple was set in order, but the claimant never gave up the blessings bought from it.',
    ],
    'exposed-public': [
      'It is out that the claimant bought consecrations from the tainted clergy, and every blessing on the succession is being re-examined.',
      "The papers are public: the claimant paid disgraced priests to sanctify the claim, and the town now doubts the holy and the legal parts alike.",
      'The disgraced priests the claimant paid to bless the claim are named, and every blessing they gave the succession is in doubt.',
    ],
    're-adjudicated': [
      "Whoever brokered the claimant's blessings before is gone, but now the priesthood is disgraced, and the claimant buys its blessings directly.",
    ],
  },
  captured: {
    attributed: [
      'The underworld has chosen its candidate, and it is the claimant; the backing is real, the muscle is real, and so will be the collecting, the day the seat is won.',
      "The claimant's suit is financed from below; the syndicate buys the succession the way it bought the offices, and the claimant signed the terms.",
    ],
    're-caused': [
      "The claimant's first reason is gone, but now the underworld holds the town's offices, and it does not let its candidate go.",
    ],
    reformed: [
      "The capture was broken and the claimant tore up the syndicate's terms; the suit continues on lawful money, or not at all.",
      "With the underworld's grip broken, the claimant came clean; the signed terms were handed to the magistrates as evidence.",
    ],
    historicized: [
      'The capture was broken, but the claimant still runs the suit on the underworld\'s terms.',
    ],
    'exposed-public': [
      "It is public that the underworld finances the claimant's suit, and the signed terms are abroad; the seat now comes with a lien attached.",
      "The backing is out: the claimant took the syndicate's silver for the succession, and the town knows who would really have been crowned.",
      "The family has seen the syndicate's terms in the claimant's hand, and the seat comes with the underworld's lien on it.",
    ],
    're-adjudicated': [
      'Whoever backed the claimant before is gone, but now the underworld holds the offices, and whoever holds them has signed the old terms again.',
    ],
  },
  scandal: {
    attributed: [
      'The scandal wounded the incumbent, and the claimant has been feeding it; the dirt arrives fresh and curated, and none of it touches the claimant by accident.',
      "The claimant did not start the scandal, but now supplies its evidence to the loudest voices and buys up anything that harms the claim.",
    ],
    're-caused': [
      "The claimant's first reason is gone, but now a scandal has broken, and the claimant trades in its evidence.",
    ],
    reformed: [
      'The scandal burned out and the claimant came clean; the curated evidence was handed over whole, the flattering and the damning together.',
      'When the scandal settled, the claimant stopped the trade; what had been bought to bury the claim was published by the claimant first.',
    ],
    historicized: [
      'The scandal has settled, but the claimant still feeds it to the loudest voices.',
    ],
    'exposed-public': [
      "It is out that the claimant fed the scandal and bought silence on the claim's own sins, and the town is reading both ledgers.",
      'The scandal has turned on the claimant: it is out that the claimant fed the evidence and hid their own part in it.',
      "The people the scandal ruined know now that the claimant fed it the evidence and kept the claim's own part hidden.",
    ],
    're-adjudicated': [
      "Whoever paid the claimant before is gone, but now a scandal has broken, and whoever holds the claimant's file of bought evidence can use it.",
    ],
  },
};
