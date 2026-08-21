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
      'An heir with empty pockets is a door waiting to be knocked on, and the claimant has answered it; the inheritance is pledged twice over already.',
    ],
    're-caused': [
      'What first entangled the claimant has passed; it is the cut allowance that holds them now, and the creditors know a starved heir keeps signing.',
    ],
    reformed: [
      'The allowance was restored and the claimant bought the debts back; the succession is pledged to no one, for the first time in memory.',
      'With the family purse reopened, the claimant came clean, named the creditors, and paid them off in front of witnesses.',
    ],
    historicized: [
      'The allowance came back, but the claimant kept borrowing against the seat; the shortage that began it is old history.',
    ],
    'exposed-public': [
      'It is public that the claimant pledged the inheritance to moneylenders, and the family is learning how much of its future is already spent.',
      "The claimant's debts are out, and their shape is worse than their size: the succession itself was the collateral.",
    ],
    're-adjudicated': [
      "The syndicate holding the claimant's paper is destroyed, but the allowance is still short, and the debt has found its way to new and patient hands.",
    ],
  },
  'chain-starved': {
    attributed: [
      "The family trade starves on the broken supply lines, and the claimant has kept it breathing with pledged favors; the suppliers hold promises signed against the seat's future.",
      'When the wagons stopped, the claimant promised tomorrow to pay for today; the house eats, and its next ruler is already spoken for.',
    ],
    're-caused': [
      "The claimant's first entanglement resolved, but the supply lines broke after, and the promised favors that fill the gap now carry the arrangement.",
    ],
    reformed: [
      'The supply lines were restored and the claimant bought back every pledged favor; the succession owes nothing it did not choose.',
      'With the wagons running again, the claimant came clean to the family about what had been promised, and unwound it piece by piece.',
    ],
    historicized: [
      'The trade routes are mended, but the pledged favors were never redeemed; the claimant lets them stand like old fenceposts.',
    ],
    'exposed-public': [
      'It is out that the claimant mortgaged the future of the house to keep its trade alive, and the promised favors are being tallied in public.',
      "The suppliers have shown their paper: the claimant's signature, pledging the seat's favor for wagonloads, and the family is counting the cost.",
    ],
    're-adjudicated': [
      'The old creditor is destroyed, but the supply lines are still cut, and the pledged favors have passed to whoever moves goods now.',
    ],
  },
  depleted: {
    attributed: [
      'The estate stores are empty, and the claimant has been quietly selling what the family thinks it still owns; the plate is pewter now, and the vault echoes.',
      "Scarcity reached the great house too, and the claimant met it the quiet way: heirlooms out the back door, and the entail's edges trimmed for coin.",
    ],
    're-caused': [
      'What first held the claimant has passed; the empty stores hold them now, and each sold heirloom buys another season of appearances.',
    ],
    reformed: [
      'The stores recovered and the claimant stopped the sales; what could be bought back was, and the rest was confessed to the family.',
      'With the estate replenished, the claimant came clean about the emptied vault; the accounting was ugly and complete.',
    ],
    historicized: [
      'The estate recovered, but the claimant never stopped the quiet sales; the scarcity that excused them is long past need.',
    ],
    'exposed-public': [
      'It is public that the claimant sold the heirlooms while the stores ran dry, and the family is inventorying a vault it no longer recognizes.',
      "The quiet sales are out: the claimant traded the house's memory for its meals, and kept the difference.",
    ],
    're-adjudicated': [
      "The syndicate is gone, but the stores are still empty, and the trade in the house's remnants has found the claimant new buyers.",
    ],
  },
  'trade-strangled': {
    attributed: [
      "The family fortune lives on trade, and trade is strangled, so the claimant runs the embargo under the family name; the house's caravans are searched by reputation only.",
      'The embargo would have beggared the house, and the claimant declined to be beggared; the family colors now cover cargo the law has banned.',
    ],
    're-caused': [
      "The claimant's first cause resolved, but the embargo followed it, and the family-flagged contraband now pays for the arrangement's keep.",
    ],
    reformed: [
      'The embargo lifted and the claimant grounded the night caravans; the family name covers only lawful freight again.',
      'When trade reopened, the claimant came clean; the contraband runs were confessed to the family before any inspector found them.',
    ],
    historicized: [
      'The routes are open again, but the claimant still runs the quiet cargo; the embargo that justified it is a story now.',
    ],
    'exposed-public': [
      "It is public that the family colors covered contraband through the embargo, and the claimant's name is on the manifests.",
      "The house's caravans are being searched at last, and the town knows why they never were before; the claimant spent the family's honor as freely as its seal.",
    ],
    're-adjudicated': [
      'The old partner is destroyed, but the trade is still strangled, and the family-flagged runs have new handlers who know what the claimant signed.',
    ],
  },
  'levied-away': {
    attributed: [
      "The men who would have watched the succession are away at war, and the claimant is moving on it early; witnesses vanish, documents shift, and no one armed is left to mind the claimant's manners.",
      'With the strength levied away, the claimant has been rearranging the inheritance unobserved; the war took every eye that mattered.',
    ],
    're-caused': [
      "The claimant's first cause resolved, but the levy emptied the house of watchers, and the arrangement continues on the absence alone.",
    ],
    reformed: [
      'The companies came home and the claimant undid the quiet moves; the shifted documents were restored before anyone thought to look.',
      'When the strength returned, the claimant came clean to the family; what absence had made easy, presence made shameful.',
    ],
    historicized: [
      'The watchers are home, but the moves the claimant made in the empty season were never unmade; the absence has ended and its winnings stand.',
    ],
    'exposed-public': [
      'The returned soldiers have learned what the claimant did to the succession while they were gone, and the shifted papers are being unshifted in public.',
      'It is out that the claimant worked the inheritance while the strength was at war, and the family is reading the amended documents aloud.',
    ],
    're-adjudicated': [
      "The syndicate fell, but the strength is still levied away, and the unwatched succession itself now keeps the claimant's arrangement alive.",
    ],
  },
  'garrison-drained': {
    attributed: [
      'With the garrison hollow, the claimant hired private blades for protection, and pays them in promises: land, office, pardon, whatever the seat may someday grant.',
      'The claimant walks safe through a lawless town because hired steel walks behind, and the hire is written against the inheritance.',
    ],
    're-caused': [
      "The claimant's first entanglement passed, but the garrison hollowed after, and the hired blades now collect the arrangement's dues.",
    ],
    reformed: [
      'The garrison was refilled and the claimant paid the blades off in honest coin, canceling every promised favor with witnesses present.',
      'With the ranks restored, the claimant came clean; the promissory protection was dissolved and the blades dismissed.',
    ],
    historicized: [
      'The garrison stands full again, but the claimant keeps the private blades; the danger that hired them is past.',
    ],
    'exposed-public': [
      'It is public that the claimant promised offices and pardons to hired steel, and the town is asking what else the succession has already sold.',
      "The claimant's bodyguard contract is out: paid in the seat's future favors, and the seat does not yet belong to the claimant to promise.",
    ],
    're-adjudicated': [
      'The old paymaster is destroyed, but the garrison is still drained, and the hired blades have simply presented their promises to new management.',
    ],
  },
  'siege-scarred': {
    attributed: [
      "The war is pressing, and the claimant has been promising the seat's allegiance in advance, to both sides, in writing; whoever wins, a letter exists.",
      "Under the war's pressure the claimant insures the succession the old way: quiet pledges to every camp, priced in the house's future loyalty.",
    ],
    're-caused': [
      "The claimant's first cause cleared, but the war pressed in, and the insurance letters now hold the arrangement in place.",
    ],
    reformed: [
      'The war receded and the claimant burned the pledge letters, both sets, and told the family what had been written.',
      'With the pressure lifted, the claimant came clean; the promised allegiances were recalled before either side could collect.',
    ],
    historicized: [
      'The war moved on, but the pledge letters were never recalled; the claimant keeps them the way gamblers keep old markers.',
    ],
    'exposed-public': [
      'It is out that the claimant pledged the seat to both camps during the war, and each side has produced its letter.',
      "The insurance is public: the claimant's signature promising allegiance twice over, and the house's word now trades at a discount.",
    ],
    're-adjudicated': [
      'The syndicate is broken, but the war still presses, and the pledge letters have found their way into new hands that expect honoring.',
    ],
  },
  occupation: {
    attributed: [
      'The occupier has promised the claimant the succession, and the claimant earns it weekly: names, movements, and the mood of the family table, all reported.',
      "The claimant's path to the seat now runs through the occupation office, and the toll is information about everyone who trusts them.",
    ],
    're-caused': [
      "What first compromised the claimant is gone; the occupier's promise of the seat sustains the arrangement now, and the reports keep flowing.",
    ],
    reformed: [
      'The occupier withdrew and the claimant confessed the reports to the family, every one; the promised succession was renounced with them.',
      'With the occupation ended, the claimant came clean about the bargain; the seat was to be the fee, and the family now knows for what.',
    ],
    historicized: [
      'The occupier is gone, but the claimant still keeps the informer\'s habits; the promise that trained them expired with the occupation.',
    ],
    'exposed-public': [
      "It is public that the claimant informed for the occupier against a promise of the seat, and the family is reading the reports with their names in them.",
      'The bargain is out: the succession for surveillance, and every arrest in the household during the occupation now has an author.',
    ],
    're-adjudicated': [
      "The claimant's old paymaster is destroyed, but the occupier remains, and the promise of the seat has been reissued by their administration.",
    ],
  },
  'conduct-drift': {
    attributed: [
      "A dark patron favors the claimant's ambition and rewards its shortcuts; each rival quietly ruined comes back as blessing and standing.",
      "The claimant's path to the seat is being cleared by methods a house should refuse, and a patron that loves the methods keeps paying for more.",
    ],
    're-caused': [
      "The claimant's first cause resolved, but a patron that rewards the deed took up the arrangement, and its favor now finances the ambition.",
    ],
    reformed: [
      "The patron's shadow lifted and the claimant stopped clearing the path; unblessed, the ruined rivals were made whole where coin could do it.",
      'With the rewarding patron gone, the claimant came clean; the ambition remains, but it walks in daylight now.',
    ],
    historicized: [
      'The patron is gone, but the claimant kept its methods; the blessing lapsed and the shortcuts stayed open.',
    ],
    'exposed-public': [
      "It is public that the claimant's rivals fell to sponsored ruin, and the town is re-reading each misfortune as an offering.",
      "The sponsorship is out: a dark patron paid for the claimant's clear path, and the family is asking what was promised in return.",
    ],
    're-adjudicated': [
      "The syndicate fell, but the patron that rewards the deed still stands, and the claimant's ambition passed into its keeping.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      "The rival faith backs the claimant's succession, and the price is posted nowhere but understood: the house's altar changes hands with the seat.",
      "The claimant's claim has foreign prayers behind it now; the rival mission funds the lawyers and expects the family chapel in return.",
    ],
    're-caused': [
      "The claimant's first cause passed; the rival faith's backing replaced it, and the promised chapel keeps the arrangement standing.",
    ],
    reformed: [
      'The rival faith withdrew and the claimant returned the backing; the chapel stays as it was, and the claim stands on its own.',
      'When the conversion pressure broke, the claimant came clean about the promised altar, and the family reconsecrated it to be sure.',
    ],
    historicized: [
      "The rival faith gave up the town, but the claimant never returned the backing; the promised chapel is a debt nobody has collected.",
    ],
    'exposed-public': [
      "It is out that the rival faith funds the claimant's suit, and what was promised for it; the family altar has become the town's business.",
      "The backing is public: the claimant sold the house's faith for the house's seat, and both congregations have opinions.",
    ],
    're-adjudicated': [
      "The old patron is gone, but the rival faith still presses, and its purse has assumed the claimant's debts along with the promised altar.",
    ],
  },
  secularization: {
    attributed: [
      'The succession oaths were sworn before a god this town has stopped fearing, and the claimant has noticed; witnesses are being bought whom an oath once made unnecessary.',
      'With the faith gone cold, the old vows binding the succession bind nothing, and the claimant has been amending history accordingly.',
    ],
    're-caused': [
      "The claimant's first cause resolved, but the faith went cold behind it, and with no oath left standing, the arrangement simply persisted.",
    ],
    reformed: [
      'The faith revived and the claimant re-swore the succession vows at the altar, and dismissed the bought witnesses unpaid.',
      'When belief returned, the claimant came clean; the amended history was unamended, and the vows given weight again.',
    ],
    historicized: [
      'The faith warmed again, but the bought witnesses were never dismissed; the cold season that hired them is over.',
    ],
    'exposed-public': [
      'It is public that the claimant bought witnesses while the oaths meant nothing, and the reviving faith has made the succession its test case.',
      "The amendments are out: the claimant reworked the family record in the faithless season, and the restored congregation wants it reworked back.",
    ],
    're-adjudicated': [
      "The claimant's paymaster fell, but the faith is still cold, and no oath has revived that might shame the arrangement into ending.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The tainted priests will consecrate anything for the right fee, and the claimant has been a steady customer; the succession gathers blessings it did not earn.',
      "A disgraced clergy still holds the seals of legitimacy, and the claimant buys impressions of them; the house's papers grow holier by the month.",
    ],
    're-caused': [
      "The claimant's first reason resolved, but the tainted priesthood offered its services, and the bought consecrations now hold the arrangement up.",
    ],
    reformed: [
      'The priesthood was cleansed and the claimant surrendered the bought blessings; the claim stands now on blood and law alone.',
      "With the clergy's scandal resolved, the claimant came clean; the purchased consecrations were annulled at the claimant's own request.",
    ],
    historicized: [
      'The temple was set in order, but the bought blessings were never surrendered; the disgrace that sold them is mended and the claimant kept the goods.',
    ],
    'exposed-public': [
      'It is out that the claimant bought consecrations from the tainted clergy, and every blessing on the succession is being re-examined.',
      "The receipts are public: the claimant paid disgraced priests to sanctify the claim, and the town now doubts the holy and the legal parts alike.",
    ],
    're-adjudicated': [
      "The syndicate is gone, but the priesthood's taint remains, and the trade in bought blessings has found the claimant new brokers.",
    ],
  },
  captured: {
    attributed: [
      'The underworld has chosen its candidate, and it is the claimant; the backing is real, the muscle is real, and so will be the collecting, the day the seat is won.',
      "The claimant's suit is financed from below; the syndicate buys the succession the way it bought the offices, and the claimant signed the terms.",
    ],
    're-caused': [
      "The claimant's old cause resolved, but the underworld holds the town's offices now, and a candidate it holds is not released, only advanced.",
    ],
    reformed: [
      "The capture was broken and the claimant tore up the syndicate's terms; the suit continues on lawful money, or not at all.",
      "With the underworld's grip broken, the claimant came clean; the signed terms were handed to the magistrates as evidence.",
    ],
    historicized: [
      'The capture was broken, but the claimant still owes the habits of that backing; the syndicate is gone and its manners remain.',
    ],
    'exposed-public': [
      "It is public that the underworld finances the claimant's suit, and the signed terms are abroad; the seat now comes with a lien attached.",
      "The backing is out: the claimant took the syndicate's silver for the succession, and the town knows who would really have been crowned.",
    ],
    're-adjudicated': [
      'The syndicate that backed the claimant is destroyed, but the offices are still captured, and the new holders have re-signed the old terms.',
    ],
  },
  scandal: {
    attributed: [
      'The scandal wounded the incumbent, and the claimant has been feeding it; the dirt arrives fresh and curated, and none of it touches the claimant by accident.',
      "The claimant did not start the scandal, but has become its quartermaster: supplying evidence to the loudest mouths and buying up whatever implicates the claim.",
    ],
    're-caused': [
      "The claimant's first cause cleared, but the scandal broke behind it, and trading in its evidence now sustains the arrangement.",
    ],
    reformed: [
      'The scandal burned out and the claimant came clean; the curated evidence was handed over whole, the flattering and the damning together.',
      'When the scandal settled, the claimant stopped the trade; what had been bought to bury the claim was published by the claimant first.',
    ],
    historicized: [
      'The scandal is old news, but the claimant still curates it; the wound it opened in the incumbent has scarred over.',
    ],
    'exposed-public': [
      "It is out that the claimant fed the scandal and bought silence on the claim's own sins, and the town is reading both ledgers.",
      'The scandal has turned on its quartermaster: the claimant supplied the fire and hid from the smoke, and everyone can smell it now.',
    ],
    're-adjudicated': [
      "The syndicate is broken, but the scandal's economy survives, and the claimant's file of bought evidence has changed custodians.",
    ],
  },
};
