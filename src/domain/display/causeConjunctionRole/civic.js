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
      'A starved bureau and a patient official: every stamp has a speed, every speed has a price, and the price list exists nowhere in writing.',
    ],
    're-caused': [
      'What first bent the official has passed; the starved bureau bends them now, and the queue-money is called making the office work.',
    ],
    reformed: [
      'The bureau was funded and the official trued the queue; the skimmed fines were restored to the strongbox with an accounting nobody demanded.',
      'With the fees covering the office again, the official came clean; the unwritten price list was written down at last, as a confession.',
    ],
    historicized: [
      'The bureau recovered, but the queue still moves for coin; the shortfall that started the practice is old accounting.',
    ],
    'exposed-public': [
      'It is public that the permit queue was auctioned while the bureau starved, and everyone who waited honestly knows now what the waiting bought.',
      'The skimming is out: the official pocketed fines against short wages, and the strongbox arithmetic is being done in the square.',
    ],
    're-adjudicated': [
      'The syndicate holding the official is destroyed, but the bureau is still starved, and the queue-money now flows to the shortfall itself.',
    ],
  },
  'chain-starved': {
    attributed: [
      'The requisitions come back stamped and empty, so the official forges the paperwork the black channel needs; goods appear, files agree, and none of it happened.',
      'When the supply lines failed, the official discovered that paper is a supply line too; the forms move contraband as smoothly as wagons ever moved grain.',
    ],
    're-caused': [
      "The official's first reason is gone; the dead requisition channel reasons for them now, and the forged forms keep the office stocked.",
    ],
    reformed: [
      'The supply lines were restored and the official pulped the forged forms; the files were corrected to say what actually happened, all of it.',
      'With the wagons running, the official came clean; the paper channel was closed and its architecture handed to the auditors.',
    ],
    historicized: [
      'The supply lines are mended, but the paper channel stays open; the shortage that drew it is long resupplied.',
    ],
    'exposed-public': [
      'It is public that the official forged the requisition record, and every file with their stamp is being re-read against reality.',
      'The paper channel is out: the official made contraband bureaucratically true, and the auditors are unwinding the fiction form by form.',
    ],
    're-adjudicated': [
      'The old partners are destroyed, but the supply lines are still cut, and the paper channel has new cargo and the same clerk.',
    ],
  },
  depleted: {
    attributed: [
      'The relief stores are empty and the dole list is not; the official curates it now, and a place on it costs exactly what the desperate can pay.',
      'Scarcity gave the official a new power: the list of who is fed. Names appear and vanish for consideration, and the register never shows the erasures.',
    ],
    're-caused': [
      "The official's first cause has passed; the empty relief stores reason for them now, and the curated list pays its keeper.",
    ],
    reformed: [
      'The stores were refilled and the official restored the true list; the paid placements were struck, and the fees returned in front of the queue.',
      'With relief flowing again, the official came clean; the erasures were confessed, and the register rewritten by need alone.',
    ],
    historicized: [
      'The stores recovered, but the list is still curated; the famine that made it valuable has ended.',
    ],
    'exposed-public': [
      'It is public that the dole list was sold by the name while the stores ran dry, and the struck-off are reading the register aloud.',
      'The erasures are out: the official priced hunger, and the town is matching the vanished names to the graves.',
    ],
    're-adjudicated': [
      'The syndicate is gone, but the stores are still empty, and the curated list has passed to new curators with the official attached.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo is absolute, except on paper; the official stamps exemptions for coin, and the stamped wagons roll past inspectors who trust the stamp.',
      'Trade is strangled by decree, and the official sells the loopholes; each exemption is technically lawful, which is the service being purchased.',
    ],
    're-caused': [
      'What first held the official has passed; the embargo holds them now, and each stamped exemption renews the fee.',
    ],
    reformed: [
      'The embargo lifted and the official published the exemption record entire, buyers and fees included, before any auditor asked.',
      'When trade reopened, the official came clean; the stamp went back to meaning what it says, and the fees went to the treasury.',
    ],
    historicized: [
      'The embargo is lifted, but the official still sells the stamp; the decree that priced it is repealed.',
    ],
    'exposed-public': [
      'It is public that the embargo had a price list at the records office, and the merchants who obeyed the law are reading the buyers\' names.',
      'The exemption record is out: the official retailed the law\'s exceptions, and the law is deciding what its stamp is worth now.',
    ],
    're-adjudicated': [
      'The old paymaster is gone, but the trade is still strangled, and the exemption trade has new principals holding the same stamp.',
    ],
  },
  'levied-away': {
    attributed: [
      'The auditors marched with the levy, and the records have been fluid since; deeds amend themselves, debts vanish, and the official\'s hand is behind every helpful correction.',
      'With the strength levied away, no one checks the files against the facts; the official has been retailing corrections, and the archive is becoming a work of fiction with subscribers.',
    ],
    're-caused': [
      "The official's first cause resolved, but the levy emptied the town of auditors, and the correction trade now rests on the absence alone.",
    ],
    reformed: [
      'The companies came home and the official restored the archive first; every sold correction was reversed before the auditors sat down.',
      'When the strength returned, the official came clean; the fluid records were confessed, and the true copies produced from a locked drawer.',
    ],
    historicized: [
      'The auditors are back, but the sold corrections stand; the absence that permitted them has ended and its fictions are load-bearing now.',
    ],
    'exposed-public': [
      'The returned auditors have compared the files to the facts, and it is public: the official sold corrections the whole time the town stood unwatched.',
      'It is out that the archive was for sale during the levy, and every deed and debt of the period is being re-proved from scratch.',
    ],
    're-adjudicated': [
      'The syndicate fell, but the strength is still levied away, and the correction trade continues on the absence it always ran on.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'The garrison cannot serve a warrant, so the official sells judgments that will never be enforced; justice is pronounced, priced, and shelved, and everyone involved knows the sequence.',
      'With enforcement hollow, the official\'s rulings are theater with fees; the guilty pay for verdicts against them that will never be executed, and call it settling out.',
    ],
    're-caused': [
      "The official's first reason passed, but the garrison hollowed after, and the unenforceable-judgment trade now anchors the arrangement.",
    ],
    reformed: [
      'The garrison was refilled and the shelved judgments came down; the official executed every one, beginning with the paid-for.',
      'With enforcement restored, the official came clean; the theater was confessed, and the fees refunded on the courthouse steps.',
    ],
    historicized: [
      'The garrison stands full again, but the judgments stay shelved; the hollowness that excused it is repaired.',
    ],
    'exposed-public': [
      'It is public that the official priced verdicts nobody would enforce, and the shelved judgments are being read like a menu.',
      'The theater is out: justice here was pronounced for show and paid for quiet, and the official ran the box office.',
    ],
    're-adjudicated': [
      'The old paymaster is destroyed, but the garrison is still drained, and the judgment trade has re-opened under new patrons.',
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war brought rationing, and rationing brought the books; the official keeps them, and a household\'s allotment tracks its generosity to the keeper.',
      'Under the war\'s pressure the ration books became currency, and the official is the mint; extra pages for the accommodating, short weights for the difficult.',
    ],
    're-caused': [
      "The official's old cause cleared, but the war pressed in, and the ration books now carry the arrangement page by page.",
    ],
    reformed: [
      'The war receded and the official trued the ration books; the short-weighted were repaid in full from the office\'s own stores.',
      'With the pressure lifted, the official came clean; the sold pages were confessed, and the rationing records opened to every household.',
    ],
    historicized: [
      'The war moved on, but the ration books still track generosity; the emergency that opened them is closed.',
    ],
    'exposed-public': [
      'It is public that the ration books were kept crooked through the war, and the short-weighted households are presenting their pages.',
      'The mint is out of business publicly: the official sold the war\'s bread by the signature, and the town has kept every stub.',
    ],
    're-adjudicated': [
      'The syndicate is broken, but the war still presses, and the ration books have been transferred, keeper and all.',
    ],
  },
  occupation: {
    attributed: [
      'The occupier asked for the census, and the official provided it annotated: who resists, who complies, who has sons of fighting age; the administration runs smoothly, as does the collecting.',
      'Under the occupation the official kept every office and earned the keeping; the town\'s records serve the occupier now, and the official curates what they see.',
    ],
    're-caused': [
      "What first compromised the official is gone; the occupier's administration sustains the office now, and the annotated files sustain the official.",
    ],
    reformed: [
      'The occupier withdrew and the official produced the annotations for the town to read, their own entries first.',
      'With the occupation ended, the official came clean; what the census had carried to the occupier was confessed to those it named.',
    ],
    historicized: [
      'The occupier is gone, but the official still annotates the census; the reader it was curated for has marched away.',
    ],
    'exposed-public': [
      'It is public that the census went to the occupier annotated, and every family the occupation visited is finding its entry.',
      'The annotations are out, in the official\'s hand: the town\'s compliance, graded and delivered, and the collections that followed each grade.',
    ],
    're-adjudicated': [
      "The official's old paymaster is destroyed, but the occupier remains, and the annotated census has a new and equally attentive reader.",
    ],
  },
  'conduct-drift': {
    attributed: [
      'A dark patron reads the official\'s verdicts like offerings, and pays for the reading; injustice from this bench has a sponsor, and the sponsor has taste.',
      'The official\'s rulings have drifted toward cruelty, and the drift is subsidized; a patron that delights in the twisted verdict rewards each one.',
    ],
    're-caused': [
      "The official's first cause resolved, but a patron that rewards the deed adopted the bench, and its favor now retains the verdicts.",
    ],
    reformed: [
      "The patron's shadow lifted and the official re-heard every sponsored case; unpaid, the verdicts came out the way the law reads.",
      'With the rewarding patron gone, the official came clean; the twisted rulings were vacated, and the bench asked to be judged by them.',
    ],
    historicized: [
      'The patron is gone, but the verdicts still bend the way it liked; the sponsorship ended and the bench never noticed itself.',
    ],
    'exposed-public': [
      'It is public that the bench\'s cruelties were sponsored devotions, and every twisted verdict is being re-read as a receipt.',
      'The sponsorship is out: a dark patron paid for injustice from this office, and the wronged are lining up with their case numbers.',
    ],
    're-adjudicated': [
      "The syndicate fell, but the patron that rewards the deed still stands, and the bench's arrangement was assumed into its keeping.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith needs deeds, licenses, and registrations, and the official expedites; temple land changes hands smoothly where their mission works, and the fees find the official at home.',
      'Conversion is paperwork in the end, and the official does the paperwork; the rival faith\'s acquisitions clear in days while everything else waits its month.',
    ],
    're-caused': [
      "The official's first reason passed; the rival faith's filing fees replaced it, and the expedited deeds are the record of it.",
    ],
    reformed: [
      'The rival faith withdrew and the official re-examined the expedited transfers; the improper ones were voided, fees returned.',
      'When the conversion pressure broke, the official came clean; the home-paid fees were surrendered, and the registry re-dated honestly.',
    ],
    historicized: [
      'The rival faith gave up the town, but the expedited transfers stand; the fees that moved them are spent and unremembered.',
    ],
    'exposed-public': [
      'It is public that the rival mission\'s paperwork jumped every queue for a fee, and the registry\'s dates tell the story plainly.',
      'The expediting is out: the official sold the speed of the law to the rival faith, and both congregations are auditing the deeds.',
    ],
    're-adjudicated': [
      'The old patron is gone, but the rival faith still presses, and its filing fees now route through new hands to the same desk.',
    ],
  },
  secularization: {
    attributed: [
      'Testimony here is sworn before a god no one fears, and the official has drawn the conclusion; sworn statements are drafted to order now, and the oath is part of the stationery.',
      'With the faith gone cold, the courtroom oath became a formality, and the official trades in formalities; witnesses say what the paying party needs, hands on the book, straight-faced.',
    ],
    're-caused': [
      "The official's first cause resolved, but the faith went cold behind it, and with the oath toothless, the testimony trade simply continued.",
    ],
    reformed: [
      'The faith revived and the oath got its teeth back; the official confessed the drafted testimony and re-opened every case built on it.',
      'When belief returned, the official came clean; the to-order statements were withdrawn, and the book sworn on meant something again.',
    ],
    historicized: [
      'The faith warmed again, but the testimony trade never closed; the cold oath that opened it has been rewarmed without effect.',
    ],
    'exposed-public': [
      'It is public that sworn testimony was drafted for sale while the oath meant nothing, and every verdict of the period is appealing itself.',
      'The trade is out: the official sold the court\'s truth while no god watched it, and the reviving congregation watched instead.',
    ],
    're-adjudicated': [
      "The official's paymaster fell, but the faith is still cold, and the testimony trade runs on with no oath in its way.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The temple\'s troubles live in the town records, and the official is their landlord; files about the clergy go missing by subscription, and the subscription is current.',
      'What the archive knows about the priesthood would feed the scandal for a year, and the official rents the not-knowing; the relevant drawers stay locked and the retainer arrives on the tithe schedule.',
    ],
    're-caused': [
      "The official's first reason resolved, but the tainted priesthood offered a subscription, and the locked drawers now carry the arrangement.",
    ],
    reformed: [
      'The priesthood was cleansed and the official unlocked the drawers; the withheld files went to the synod complete, retainers returned.',
      "With the clergy's scandal resolved, the official came clean; the subscription was confessed, and the archive made whole.",
    ],
    historicized: [
      'The temple was set in order, but the drawers stay locked and the retainer still arrives; the scandal it hides is already absolved.',
    ],
    'exposed-public': [
      'It is public that the archive hid the clergy\'s record for a retainer, and the drawers are being opened in front of witnesses.',
      'The subscription is out: the official rented silence to the temple, and the town is reading what the rent concealed.',
    ],
    're-adjudicated': [
      "The syndicate is gone, but the priesthood's taint remains, and the locked-drawer retainer has been assumed by new subscribers.",
    ],
  },
  captured: {
    attributed: [
      'The underworld holds the offices, and the official\'s desk is one of them; warrants leak before they are served, and the cases that matter die quietly in the third drawer.',
      'The syndicate reads everything the official files, before the magistrate does; the office runs on their schedule, and the third drawer is where justice goes to wait forever.',
    ],
    're-caused': [
      "The official's old cause resolved, but the underworld holds the offices now, and a desk it holds keeps its drawers the way it is told.",
    ],
    reformed: [
      'The capture was broken and the official emptied the third drawer onto the magistrate\'s bench; every buried case, dated and intact.',
      "With the syndicate's grip broken, the official came clean; the leaked warrants were listed, and the leaks sealed by testimony.",
    ],
    historicized: [
      'The capture was broken, but the third drawer still swallows cases; the master who required it has gone and the drawer has not noticed.',
    ],
    'exposed-public': [
      'It is public that warrants leaked from this desk and cases died in it, and the third drawer has been opened in front of the town.',
      'The capture has a filing system, and it is out: the official kept the underworld\'s calendar, and justice waited on it.',
    ],
    're-adjudicated': [
      'The syndicate that ran the desk is destroyed, but the offices are still captured, and the third drawer has a new and identical patron.',
    ],
  },
  scandal: {
    attributed: [
      'The scandal filled the archive with dangerous paper, and the official owns the filing; documents implicate or exonerate depending on the fee, and the fee is never in writing.',
      'Everyone named in the scandal needs something from the records office, and the official has organized the needing; the files everyone fears are indexed by what their subjects will pay.',
    ],
    're-caused': [
      "The official's first cause cleared, but the scandal broke behind it, and the fear-indexed files now sustain the arrangement.",
    ],
    reformed: [
      'The scandal burned out and the official published the index; every fee taken was listed beside the file it moved.',
      'When the scandal settled, the official came clean; the dangerous paper went to the court intact, and the payments to the treasury.',
    ],
    historicized: [
      'The scandal is old news, but the files are still indexed by fear; the panic that priced them has subsided.',
    ],
    'exposed-public': [
      'It is public that the scandal\'s paper was priced at the records office, and the index of fees is the new scandal.',
      'The filing is out: the official sold the archive\'s memory to the frightened, and the town is reading who paid to be forgotten.',
    ],
    're-adjudicated': [
      "The syndicate is broken, but the scandal's economy survives, and the fear-indexed files have been re-shelved under new ownership.",
    ],
  },
};
