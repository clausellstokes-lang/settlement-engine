/**
 * causeConjunctionRole/civic.js — the ROLE-TIER conjunction lines for
 * civic — the official (court, records, permits, fines).
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
export const CIVIC_ROLE_CONTENT = {
  underfunded: {
    attributed: [
      'The office fees stopped covering the office, so the official found the margin: the permit queue moves for coin, and the fines collected do not all reach the strongbox.',
      'The office is short of money, so every stamp from the official can be had faster for a price, and the prices are never written down.',
    ],
    're-caused': [
      "The official's first reason is gone, but now the office is short of money, and the official calls the queue money keeping the office open.",
    ],
    reformed: [
      'The bureau was funded and the official trued the queue; the skimmed fines were restored to the strongbox with an accounting nobody demanded.',
      'With the fees covering the office again, the official came clean; the unwritten price list was written down at last, as a confession.',
    ],
    historicized: [
      'The office has its money again, but the official still moves the permit queue for whoever pays.',
    ],
    'exposed-public': [
      'It is public that the permit queue was auctioned while the bureau starved, and everyone who waited honestly knows now what the waiting bought.',
      'It is out that the official pocketed fines while wages ran short, and people in the square are counting what went missing from the strongbox.',
      'Those who stood in the permit queue without paying know now why they waited, and where the fines went while the office went short.',
    ],
    're-adjudicated': [
      'Whoever paid the official before is gone, but now the office is short of money, and the queue money keeps coming.',
    ],
  },
  'chain-starved': {
    attributed: [
      'The requisitions come back stamped and empty, so the official forges the papers the black market needs. Goods appear, the files agree, and none of it happened.',
      'When the supply lines failed, the official found that papers can move goods too. The forms now move contraband as smoothly as wagons once moved grain.',
    ],
    're-caused': [
      'Whatever first drew the official in is over, but now the requisitions come back empty, and the forged forms keep the office supplied.',
    ],
    reformed: [
      'The supply lines were restored and the official pulped the forged forms; the files were corrected to say what actually happened, all of it.',
      'With the wagons running, the official came clean; the paper channel was closed and its architecture handed to the auditors.',
    ],
    historicized: [
      'The supply lines are open again, but the official still forges papers for the black market.',
    ],
    'exposed-public': [
      'It is public that the official forged the requisition papers, and every file with that stamp is being checked against what happened.',
      'It is out that the official made contraband look lawful on paper, and the auditors are undoing it form by form.',
      "Merchants holding papers with the official's stamp are waiting to hear whether their goods were ever lawful.",
    ],
    're-adjudicated': [
      'Whoever paid the official before is gone, but now the supply lines are cut, and the official forges papers for whoever brings goods in.',
    ],
  },
  depleted: {
    attributed: [
      'The relief stores are empty and the dole list is not. The official decides who is on it now, and a place costs whatever the desperate can pay.',
      'Since the stores ran dry, the official decides who is fed. Names go on and come off the list for payment, and the list never shows what was struck out.',
    ],
    're-caused': [
      "The official's first reason is gone, but now the relief stores are empty, and the official goes on selling places on the dole list.",
    ],
    reformed: [
      'The stores were refilled and the official restored the true list; the paid placements were struck, and the fees returned in front of the queue.',
      'With relief flowing again, the official came clean; the erasures were confessed, and the register rewritten by need alone.',
    ],
    historicized: [
      'The stores are full again, but the official still sells places on the dole list to whoever can pay.',
    ],
    'exposed-public': [
      'It is public that the dole list was sold by the name while the stores ran dry, and the struck-off are reading the register aloud.',
      'It is out that the official sold places on the dole list, and the town is matching the names struck off to the graves.',
      'Families struck off the dole list while the stores ran dry are standing in the square with the names of those who bought their places.',
    ],
    're-adjudicated': [
      'Whoever held the official before is gone, but now the relief stores are empty, and the official sells places on the dole list to whoever pays.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo allows nothing through, except on paper: the official stamps exemptions for coin, and the stamped wagons roll past inspectors who trust the stamp.',
      'The embargo is law, and the official sells the ways around it. Each exemption is lawful on paper, which is what the buyers pay for.',
    ],
    're-caused': [
      'Whatever first drew the official in is over, but now the embargo holds, and each stamped exemption brings another fee.',
    ],
    reformed: [
      'The embargo lifted and the official published the exemption record entire, buyers and fees included, before any auditor asked.',
      'When trade reopened, the official came clean; the stamp went back to meaning what it says, and the fees went to the treasury.',
    ],
    historicized: [
      'The embargo is over, but the official still sells exemption stamps to any merchant who pays.',
    ],
    'exposed-public': [
      'It is public that the embargo had a price list in the clerk\'s office, and the merchants who obeyed the law are reading the buyers\' names.',
      'It is out that the official sold exemptions from the embargo, and every stamped exemption is being checked again.',
      'Merchants who kept the embargo and lost trade by it are reading out who bought an exemption from the official.',
    ],
    're-adjudicated': [
      'Whoever paid the official before is gone, but now the embargo holds, and whoever pays gets the same stamp.',
    ],
  },
  'levied-away': {
    attributed: [
      'The auditors marched with the levy, and the files have been changing ever since: deeds altered, debts gone, and the official\'s hand behind every change.',
      'With the levy away at war, no one checks the files against the facts. The official sells changes to them, and the archive no longer matches what happened.',
    ],
    're-caused': [
      "The official's first reason is gone, but now the auditors are away with the levy, and the official sells changes to the files.",
    ],
    reformed: [
      'The companies came home and the official restored the archive first; every sold correction was reversed before the auditors sat down.',
      'When the strength returned, the official came clean; the fluid records were confessed, and the true copies produced from a locked drawer.',
    ],
    historicized: [
      'The auditors are back, but the official still alters deeds and debts for whoever pays.',
    ],
    'exposed-public': [
      'The returned auditors have compared the files to the facts, and it is public: the official sold corrections the whole time the town stood unwatched.',
      'It is now known that the archive was for sale during the levy, and every deed and debt from that time is being proved again from scratch.',
      'Anyone who bought, borrowed or inherited while the levy was away must prove it again, because the official sold the archive.',
    ],
    're-adjudicated': [
      'Whoever paid the official before is gone, but now the auditors are away at war, and the official goes on selling changes to the files.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'The garrison cannot enforce a ruling, so the official sells judgments that will never be carried out. Everyone involved knows it.',
      'With no one to enforce them, the official\'s rulings are for show. The guilty pay for verdicts against them that will never be enforced, and call it settling.',
    ],
    're-caused': [
      'Whatever first drew the official in is over, but now the garrison is thin, and the official sells rulings that no one will enforce.',
    ],
    reformed: [
      'The garrison was refilled and the shelved judgments came down; the official executed every one, beginning with the paid-for.',
      'With enforcement restored, the official came clean; the theater was confessed, and the fees refunded on the courthouse steps.',
    ],
    historicized: [
      'The garrison is back to strength, but the official still takes money from the guilty to leave their judgments unenforced.',
    ],
    'exposed-public': [
      'It is now known that the official sold verdicts nobody would enforce, and the shelved judgments are being read out.',
      "It is out that the official's justice was for show, and the official took money for keeping it that way.",
      'People whose cases were decided and never enforced are learning the official was paid to keep it that way.',
    ],
    're-adjudicated': [
      'Whoever paid the official before is gone, but now the garrison is thin, and whoever wants a ruling left unenforced pays the official.',
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war brought rationing, and the official keeps the ration books. A household\'s share depends on how generous it is to the official.',
      'With the war pressing, the ration books are worth money, and the official keeps them: extra for those who pay, short weight for those who argue.',
    ],
    're-caused': [
      "The official's first reason is gone, but now the war presses in, and the official sells the ration books page by page.",
    ],
    reformed: [
      'The war receded and the official trued the ration books; the short-weighted were repaid in full from the office\'s own stores.',
      'With the pressure lifted, the official came clean; the sold pages were confessed, and the rationing records opened to every household.',
    ],
    historicized: [
      "The war has moved on, but a household's ration still depends on what it gives the official.",
    ],
    'exposed-public': [
      'It is public that the ration books were kept crooked through the war, and the short-weighted households are presenting their pages.',
      'It is out that the official sold the war\'s bread by the signature, and the town has kept every stub.',
      "Households that went short through the war are bringing their ration pages to the square to set beside the official's books.",
    ],
    're-adjudicated': [
      'Whoever paid the official before is gone, but now the war presses in, and the official sells the ration books to whoever pays.',
    ],
  },
  occupation: {
    attributed: [
      'The occupier asked for the census, and the official handed it over with notes: who resists, who complies, who has sons of fighting age.',
      'Under the occupation the official kept every office and earned it. The town\'s files serve the occupier now, and the official chooses what it sees.',
    ],
    're-caused': [
      "Whatever first drew the official in is over, but now the official serves the occupier, and the noted census keeps the office in the official's hands.",
    ],
    reformed: [
      'The occupier withdrew and the official produced the annotations for the town to read, their own entries first.',
      'With the occupation ended, the official came clean; what the census had carried to the occupier was confessed to those it named.',
    ],
    historicized: [
      'The occupier is gone, but the official still marks in the census who resists and who complies.',
    ],
    'exposed-public': [
      'It is public that the census went to the occupier annotated, and every family the occupation visited is finding its entry.',
      'It is out, in the official\'s own hand: the town\'s households, graded by how far they complied, and the collections that followed each grade.',
      "Families the occupier visited are finding their own names in the official's census, each with a mark beside it.",
    ],
    're-adjudicated': [
      'Whoever paid the official before is gone, but now the occupier rules, and the official hands the noted census to the occupier.',
    ],
  },
  'conduct-drift': {
    attributed: [
      "A dark patron rewards the official's cruel verdicts, and the official is paid for each one handed down.",
      'The official\'s rulings have grown cruel, and a patron that delights in a twisted verdict rewards each one.',
    ],
    're-caused': [
      "The official's first reason is gone, but now a dark patron rewards the cruel verdicts, and its favor keeps them coming.",
    ],
    reformed: [
      "The patron's shadow lifted and the official re-heard every sponsored case; unpaid, the verdicts came out the way the law reads.",
      'With the rewarding patron gone, the official came clean; the twisted rulings were vacated, and the bench asked to be judged by them.',
    ],
    historicized: [
      'The patron is gone, but the official still hands down cruel verdicts to whoever stands before the bench.',
    ],
    'exposed-public': [
      'It is now known that the bench\'s cruel verdicts were offerings to a dark patron, and every one is being heard again.',
      'The sponsorship is out: a dark patron paid for injustice from this office, and the wronged are lining up with their case numbers.',
      'Everyone the bench treated cruelly can now bring the case back, because a dark patron paid for those verdicts.',
    ],
    're-adjudicated': [
      'Whoever paid the official before is gone, but now a dark patron rewards the cruel verdicts, and the bench answers to it.',
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith needs deeds, licenses and registrations, and the official hurries them through. Temple land changes hands easily where the mission works, and the fees reach the official at home.',
      'The official handles the rival faith\'s paperwork. Its purchases clear in days while everything else waits a month.',
    ],
    're-caused': [
      'Whatever first drew the official in is over, but now the rival faith presses in, and its filing fees put its deeds first in the queue.',
    ],
    reformed: [
      'The rival faith withdrew and the official re-examined the expedited transfers; the improper ones were voided, fees returned.',
      'When the conversion pressure broke, the official came clean; the home-paid fees were surrendered, and the registry re-dated honestly.',
    ],
    historicized: [
      'The rival faith has given up the town, but the official still hurries deeds through for whoever pays the fee.',
    ],
    'exposed-public': [
      'It is public that the rival mission\'s paperwork jumped every queue for a fee, and the registry\'s dates tell the story plainly.',
      'It is out that the official sold the rival faith faster filings, and both congregations are checking the deeds.',
      "The town's own families who waited months at the registry are learning the rival mission paid to go ahead of them.",
    ],
    're-adjudicated': [
      "Whoever paid the official before is gone, but now the rival faith presses in, and its fees reach the official's desk.",
    ],
  },
  secularization: {
    attributed: [
      'Testimony here is sworn before a god no one fears, and the official has noticed: sworn statements are written to order, and the oath is a formality.',
      'With the faith gone cold, the court\'s oath means nothing, and the official sells testimony. Witnesses say what the paying side needs, with a hand on the book and a straight face.',
    ],
    're-caused': [
      "The official's first reason is gone, but now the faith has gone cold, and with the oath meaning nothing, the official goes on selling testimony.",
    ],
    reformed: [
      'The faith revived and the oath got its teeth back; the official confessed the drafted testimony and re-opened every case built on it.',
      'When belief returned, the official came clean; the to-order statements were withdrawn, and the book sworn on meant something again.',
    ],
    historicized: [
      'The faith has warmed again, but the official still sells sworn testimony to whichever side pays.',
    ],
    'exposed-public': [
      'It is now known that sworn testimony was sold while the oath meant nothing, and every verdict from that time is being appealed.',
      'It is out that the official sold the court\'s testimony while the faith was cold, and the returning congregation wants answers.',
      'Anyone judged on sworn testimony while the faith was cold is appealing, because the official sold that testimony.',
    ],
    're-adjudicated': [
      'Whoever paid the official before is gone, but now the faith has gone cold, and the testimony trade goes on with no oath to stop it.',
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The temple\'s troubles are in the town\'s files, and the official keeps them. Files about the clergy go missing for a regular fee, and the fee is paid up.',
      'The archive holds enough about the priesthood to feed the scandal for a year, and the official is paid to keep it locked. The money arrives with the tithe.',
    ],
    're-caused': [
      'Whatever first drew the official in is over, but now the priesthood is disgraced, and its money keeps the drawers locked.',
    ],
    reformed: [
      'The priesthood was cleansed and the official unlocked the drawers; the withheld files went to the synod complete, retainers returned.',
      "With the clergy's scandal resolved, the official came clean; the subscription was confessed, and the archive made whole.",
    ],
    historicized: [
      "The temple has been set in order, but the official still keeps the clergy's files locked away for the temple's money.",
    ],
    'exposed-public': [
      'It is now known that the official hid the clergy\'s files for pay, and the drawers are being opened in front of witnesses.',
      "It is out that the official took the temple's money for silence, and the town is reading what was hidden.",
      "The clergy's hidden files are being read out before witnesses, and the official who kept them for pay is being asked why.",
    ],
    're-adjudicated': [
      'Whoever paid the official before is gone, but now the priesthood is disgraced, and whoever fears the files pays to keep the drawers locked.',
    ],
  },
  captured: {
    attributed: [
      'The underworld holds the offices, and the official\'s desk is one of them. Warrants leak before they are served, and the cases that matter go into the third drawer and stay there.',
      'The underworld reads everything the official files before the magistrate does. The office runs on its schedule, and the third drawer is where cases go to wait.',
    ],
    're-caused': [
      "The official's first reason is gone, but now the underworld holds the offices, and the official does as it says.",
    ],
    reformed: [
      'The capture was broken and the official emptied the third drawer onto the magistrate\'s bench; every buried case, dated and intact.',
      "With the syndicate's grip broken, the official came clean; the leaked warrants were listed, and the leaks sealed by testimony.",
    ],
    historicized: [
      "The underworld's hold on the offices is broken, but the official still buries the cases that matter in the third drawer.",
    ],
    'exposed-public': [
      'It is public that warrants leaked from this desk and cases died in it, and the third drawer has been opened in front of the town.',
      "It is out that the official ran the office on the underworld's schedule, and the cases left in the third drawer are being opened.",
      "People whose cases went quiet at the official's desk are coming to see what was left in the third drawer.",
    ],
    're-adjudicated': [
      'Whoever ran the desk before is gone, but now the underworld holds the offices, and the third drawer swallows cases for whoever holds the desk.',
    ],
  },
  scandal: {
    attributed: [
      'The scandal filled the archive with dangerous papers, and the official keeps them. A document can damn someone or clear them, depending on the fee, and the fee is never written down.',
      'Everyone named in the scandal needs something from the archive, and the official has made the most of it: the files are sorted by what the people in them will pay.',
    ],
    're-caused': [
      'Whatever first drew the official in is over, but now a scandal has broken, and the official sells the files to the frightened.',
    ],
    reformed: [
      'The scandal burned out and the official published the index; every fee taken was listed beside the file it moved.',
      'When the scandal settled, the official came clean; the dangerous paper went to the court intact, and the payments to the treasury.',
    ],
    historicized: [
      'The scandal is old news, but the official still sells files to whoever is afraid of them.',
    ],
    'exposed-public': [
      "It is now known that the scandal's papers were sold at the archive, and people are reading the list of fees.",
      'It is out that the official sold the archive\'s files to the frightened, and the town is reading who paid to be left out.',
      'The frightened who paid the official to keep their names out of the archive are finding their names on the list of fees.',
    ],
    're-adjudicated': [
      'Whoever paid the official before is gone, but now a scandal has broken, and the official sells the files to whoever is named in them.',
    ],
  },
};
