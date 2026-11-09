/**
 * causeConjunctionRole/healer.js — the ROLE-TIER conjunction lines for
 * healer — the healer (infirmary, remedies, sickbeds).
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
export const HEALER_ROLE_CONTENT = {
  underfunded: {
    attributed: [
      'Since the infirmary\'s money ran out, the healer gives medicine to the paying beds first and sells donated supplies out the side door.',
      'Since the funding dried up, care costs whatever the healer says it costs. The charity beds stand empty, and the poor are turned away over paperwork.',
    ],
    're-caused': [
      'The healer\'s first reason is gone, but now the infirmary\'s money runs short, and the healer calls the side-door sales keeping the doors open.',
    ],
    reformed: [
      'The funding returned and the healer re-opened the charity beds first; the resold supplies were bought back at a loss taken personally.',
      'With the infirmary funded, the healer came clean; the one-way scale was confessed and the overcharged repaid, bed by bed.',
    ],
    historicized: [
      'The infirmary has its money again, but the healer still sells donated supplies out the side door.',
    ],
    'exposed-public': [
      'It is public that the healer sold donated medicine while the charity beds stood empty, and families who buried someone from the infirmary want answers.',
      'The side door is out: the infirmary really was short of money, the healer took a profit from it anyway, and the sick paid.',
    ],
    're-adjudicated': [
      'Whoever paid the healer before is gone, but now the infirmary\'s money runs short, and the side-door sales go on.',
    ],
  },
  'chain-starved': {
    attributed: [
      'No medicine has come since the roads failed, so the healer buys from grave-robbers. The sick recover on stolen physic, and the healer owes the sellers.',
      'Since the supply lines failed, the healer buys remedies from night traders and owes them favors in return.',
    ],
    're-caused': [
      "Whatever first drew the healer in is over, but now the supply lines have failed, and the night traders keep the sickroom shelves stocked.",
    ],
    reformed: [
      'The medicine came back by honest roads and the healer closed the night account; the last favor owed was refused, in writing.',
      'With the supply lines restored, the healer came clean; the sourced-by-night remedies were disclosed, and the debts settled in coin instead of favors.',
    ],
    historicized: [
      'The roads are open again, but the healer still buys from the night traders and owes them favors.',
    ],
    'exposed-public': [
      'It is public that the healer stocked the infirmary from robbed graves, and families of the dead are going through the shelves.',
      'It is out that the healer\'s remedies were stolen from the dead. People who recovered on them are asking whose graves were opened.',
    ],
    're-adjudicated': [
      'Whoever held the healer\'s account before is gone, but now the supply lines have failed, and whoever works by night supplies the infirmary.',
    ],
  },
  depleted: {
    attributed: [
      'The remedies are nearly gone, so the healer saves what is left for the well-connected and gives everyone else colored water, for the same fee.',
      'Since the medicine ran short, the healer gives real physic to those who bring something and an empty tonic to those who do not, for the same fee.',
    ],
    're-caused': [
      "The healer's first reason is gone, but now the medicine chest runs empty, and the healer hands out what is left by favor.",
    ],
    reformed: [
      'The stores were replenished and the healer poured out the colored water in front of the queue; the true physic goes by sickness now, not standing.',
      'With the chest refilled, the healer came clean; the nothing-tonics were confessed, and their buyers treated free until the debt was worked off.',
    ],
    historicized: [
      'The chest is full again, but the healer still saves the real medicine for those who bring something.',
    ],
    'exposed-public': [
      'It is now known that the healer sold colored water to the poor and kept real medicine for friends. The bereaved are reading their bills again.',
      'It is out: real medicine for the well-connected, colored water for everyone else, and the healer charged the same fee for both.',
    ],
    're-adjudicated': [
      'Whoever the healer answered to before is gone, but now the medicine chest has run dry, and the rationing by favor goes on.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo stopped the medicine imports, so the healer buys from smugglers. The medicine is real, and the healer charges three times what the risk is worth.',
      'Medicine still reaches this town through the healer\'s deals with the embargo runners. The sick pay smugglers\' prices, and the healer keeps a share.',
    ],
    're-caused': [
      'The healer\'s first reason is gone, but now an embargo chokes the trade, and every smuggled crate keeps the margin coming.',
    ],
    reformed: [
      'The embargo lifted and the healer posted honest prices the same week; the smuggler margin was refunded to every patient who could be found.',
      'When the imports flowed again, the healer came clean; the contraband channel was closed and its accounts opened.',
    ],
    historicized: [
      'The embargo is over, but the healer still charges the sick smugglers\' prices.',
    ],
    'exposed-public': [
      'It is now known that the healer charged three times the risk for smuggled medicine. The town is learning what it paid to stay alive.',
      'It is out that the infirmary\'s medicine came in by night from smugglers, and that the healer kept the extra charged on it.',
    ],
    're-adjudicated': [
      "Whoever paid the healer before has fallen, but now an embargo chokes the trade, and whoever smuggles past it brings the healer's medicine.",
    ],
  },
  'levied-away': {
    attributed: [
      'The levy takes the able-bodied, and the healer\'s certificate says who is able; unfitness is for sale at the infirmary, and the price rises with each muster.',
      'With the recruiters in town, a certificate from the healer keeps a son home for coin, and the poor march in place of those who paid.',
    ],
    're-caused': [
      "The healer's first reason is gone, but now the levy calls people up, and the healer sells unfitness to those who can pay.",
    ],
    reformed: [
      'The companies came home and the healer stopped the certificate trade; the bought exemptions were confessed to the muster office unprompted.',
      'When the levy ended, the healer came clean; the fees were returned to the buyers and the apology made to those who marched instead.',
    ],
    historicized: [
      'The levy is over, but the healer still sells certificates of unfitness to anyone who pays.',
    ],
    'exposed-public': [
      'It is public that unfitness was for sale at the infirmary, and the families of those who marched in a buyer\'s place are outside.',
      'It is out: the healer\'s certificates kept the paying sons home, and the town\'s dead marched in their place.',
    ],
    're-adjudicated': [
      'Whoever held the healer before is gone, but now the levy calls people up, and the healer sells certificates of unfitness to whoever pays.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'With the garrison emptied, the gangs keep their own order, and the healer patches their wounded with nothing written down. In return the gangs protect the infirmary.',
      'The watch cannot protect the infirmary, so the healer stitches knife wounds without questions and never reports them. That is the price of being left alone.',
    ],
    're-caused': [
      "The healer's first reason is gone, but now the garrison is hollowed out, and stitching gang wounds in secret keeps the infirmary safe.",
    ],
    reformed: [
      'The garrison was refilled and the healer closed the night practice; the unreported wounds were reported, dated, and named.',
      'With the watch restored, the healer came clean; the protection arrangement ended, and the night ledger went to the captain.',
    ],
    historicized: [
      'The garrison is back to strength, but the healer still treats gang wounds at night and writes nothing down.',
    ],
    'exposed-public': [
      'It is now known that the healer stitched the gangs\' wounded in secret, and people are putting names to every odd recovery in town.',
      'It is out that the infirmary treated the gangs\' wounds and hid them, and that the gangs\' protection was the healer\'s fee.',
    ],
    're-adjudicated': [
      'Whoever protected the healer before is gone, but now the garrison is hollowed out, and whatever gang holds the streets brings its wounded to the healer on the same terms.',
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war has filled the sickrooms, and being seen first by the healer has a price. The bargaining happens at the door while the wounded wait.',
      'With the war pressing, the healer sells places in the queue. The badly hurt pay to keep their place or lose it to the lightly hurt who can pay more.',
    ],
    're-caused': [
      "The healer's first reason is gone, but now the war presses in, and the healer sells places in the queue.",
    ],
    reformed: [
      'The war receded and the healer restored triage by wound alone; the queue fees were poured into beds for those the pricing had cost.',
      'With the pressure lifted, the healer came clean; the sold places were confessed, and the sickroom door opened by need again.',
    ],
    historicized: [
      'The war has moved on, but the healer still sells places in the sickroom queue.',
    ],
    'exposed-public': [
      'It is public that the healer sold places in the war queue, and the families of those who waited and died have the receipts of those who did not.',
      'It is out that the healer sold places at the sickroom door through the fighting, and families are working out who died waiting.',
    ],
    're-adjudicated': [
      'Whoever paid the healer before is gone, but now the war presses in, and the healer sells places in the queue at the sickroom door.',
    ],
  },
  occupation: {
    attributed: [
      "The occupier's officers are treated first and best, and the healer's reports go to them with the medicine. Each week they learn which households are hiding the wounded.",
      'The infirmary stays open by the occupier\'s leave. The healer treats everyone who comes and reports anyone whose wounds point to a fight with the occupation.',
    ],
    're-caused': [
      "Whatever first drew the healer in is over, but now the occupier decides whether the infirmary stays open, and the weekly reports keep it open.",
    ],
    reformed: [
      'The occupier withdrew and the healer confessed the notes to the households they had named, one visit at a time.',
      'With the occupation ended, the healer came clean; the first-and-best treatment was owned, and the infirmary\'s books opened to the town.',
    ],
    historicized: [
      'The occupier has gone, but the healer still keeps notes on who comes in hurt.',
    ],
    'exposed-public': [
      'It is public that the healer\'s house calls fed the occupier\'s lists, and every raid that followed a treatment now has its informant.',
      'The notes are out, in the healer\'s hand: wounds described, households named, and the occupation\'s visits mapped to both.',
    ],
    're-adjudicated': [
      "Whoever paid the healer before is gone, but now the occupier rules, and the healer's weekly notes on wounded households go to its officers.",
    ],
  },
  'conduct-drift': {
    attributed: [
      'A dark patron rewards the healer for quiet deaths. Some patients in the sickroom die early and gently, and each death brings the healer a gift.',
      'A dark patron rewards the healer for easing the dying, whether they asked for it or not.',
    ],
    're-caused': [
      "The healer's first reason is gone, but now a dark patron rewards the quiet deaths, and its gifts keep them coming.",
    ],
    reformed: [
      "The patron's shadow lifted and the quiet endings stopped; the healer confessed each one to the families, and let them choose the reckoning.",
      'With the rewarding patron gone, the healer came clean; unsponsored, the eased passings were seen plainly, and forsworn.',
    ],
    historicized: [
      'The patron is gone, but the healer still eases patients into early, quiet deaths.',
    ],
    'exposed-public': [
      'It is now known that some deaths in the healer\'s sickroom were offerings. Families are asking again about every gentle passing.',
      'It is out that a dark patron paid the healer for each death, and families are looking again at every early one.',
    ],
    're-adjudicated': [
      "Whoever held the healer before is gone, but now a dark patron rewards the quiet deaths, and the healer's sickroom answers to it alone.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith pays the healer for miracles. Cures are staged, credited to the mission\'s god, and billed as witness fees.',
      'The mission has learned that people convert after they recover, so it pays for recoveries, and the healer times the cures to the preaching.',
    ],
    're-caused': [
      "Whatever first drew the healer in is over, but now a rival faith pays for miracles, and the healer keeps staging cures.",
    ],
    reformed: [
      'The rival faith withdrew and the healer recanted the staged cures publicly, naming the medicine that had done the work.',
      'When the conversion pressure broke, the healer came clean; the witness fees were returned, and the cures re-credited to the craft.',
    ],
    historicized: [
      'The rival faith has given up on the town, but the healer still stages the odd miracle.',
    ],
    'exposed-public': [
      'It is public that the mission\'s miracles were the healer\'s staged cures, and every conversion that followed one is unraveling.',
      'It is out that the recoveries were sold as signs, and the healer was paid for every convert.',
    ],
    're-adjudicated': [
      'Whoever paid the healer before is gone, but now a rival faith presses in, and its mission pays the healer for miracles.',
    ],
  },
  secularization: {
    attributed: [
      'The healer\'s vow was sworn to a god this town no longer keeps, and the healer has stopped keeping it too. The charity beds closed quietly, and the hard duties went with the faith.',
      'With the faith gone cold, no one checks the healer\'s mercy. Patients are treated for profit now, and the old vow hangs on the wall.',
    ],
    're-caused': [
      "The healer's first reason is gone, but now the faith has gone cold, and with no one holding the healer to the vow, the charity beds stay shut.",
    ],
    reformed: [
      'The faith revived and the healer re-took the vow at the altar; the charity beds reopened the same day, first.',
      'When belief returned, the healer came clean; the lapsed duties were resumed, and the profit-years\' takings endowed the free ward.',
    ],
    historicized: [
      'The faith has warmed again, but the healer has never reopened the charity beds.',
    ],
    'exposed-public': [
      'It is now known what the healer let slide while no one held them to the vow, and people are going through the infirmary\'s books.',
      'It is out: the healer kept the fees and dropped the duties as soon as the faith went cold, and the town has noticed.',
    ],
    're-adjudicated': [
      "Whoever paid the healer before is gone, but now the faith has gone cold, and nothing holds the healer to the vow when setting prices.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The disgraced priests need their past called natural, and the healer signs for them: old injuries become accidents, old deaths become fevers, and the healer is paid from the tithe.',
      'The healer\'s signature covers the temple\'s harm: whatever the disgraced priests did, the healer\'s notes say otherwise, and each page is paid for.',
    ],
    're-caused': [
      "Whatever first drew the healer in is over, but now the priesthood is tainted and needs someone to sign for it, and the false certificates go on.",
    ],
    reformed: [
      'The priesthood was cleansed and the healer withdrew the false certificates; the true records were filed with the synod, whatever they convicted.',
      "With the clergy's scandal resolved, the healer came clean; the page-rate signatures were confessed and the retainer returned.",
    ],
    historicized: [
      'The temple has been set in order, but the healer has never withdrawn the false certificates.',
    ],
    'exposed-public': [
      'It is public that the healer certified the temple\'s harms as accidents, and the true injuries are being re-read from the false pages.',
      'It is out that the healer\'s notes hid the clergy\'s sins for a fee, and the healer\'s signature is on every page.',
    ],
    're-adjudicated': [
      'Whoever paid the healer before is gone, but now the priesthood is tainted, and the temple pays the healer to sign for its priests.',
    ],
  },
  captured: {
    attributed: [
      'The underworld brings its wounded to the infirmary after dark, and the healer writes up the deaths it needs explained as natural.',
      'The underworld uses the infirmary as it uses the offices: wounds are closed quietly, names are written down wrong, and the healer\'s good name is what makes it work.',
    ],
    're-caused': [
      "Whatever first drew the healer in is over, but now the underworld holds the town's offices, and it uses the infirmary after dark.",
    ],
    reformed: [
      'The capture was broken and the healer corrected every certificate; the natural causes were unnaturaled, and the magistrates given the true dates.',
      "With the syndicate's grip broken, the healer came clean; the after-dark patients were named, and the innocent ledger confessed guilty.",
    ],
    historicized: [
      'The underworld\'s hold is broken, but the healer still opens the back door after dark to whoever knocks.',
    ],
    'exposed-public': [
      'It is public that the infirmary served the syndicate after dark, and every natural death it certified is being re-examined.',
      'It is out that the healer\'s certificates covered the underworld\'s killings, and the town is going back through the paperwork.',
    ],
    're-adjudicated': [
      'Whoever used the infirmary before is gone, but now the underworld holds the offices, and its wounded come to the healer after dark.',
    ],
  },
  scandal: {
    attributed: [
      'Since the scandal broke, the healer sells alibis: those implicated are certified bedridden on the dates that matter, and the price rises with the danger.',
      'The scandal made sickness a matter for the courts. The healer finds illness wherever testimony would hurt, and the patient recovers once the verdict is in.',
    ],
    're-caused': [
      "The healer's first reason is gone, but now a corruption scandal has broken, and the healer sells false illnesses to the implicated.",
    ],
    reformed: [
      'The scandal burned out and the healer withdrew the convenient diagnoses; the court was told which illnesses had been real.',
      'When the scandal settled, the healer came clean; the alibi certificates were confessed, and the fees surrendered to the court.',
    ],
    historicized: [
      'The scandal has died down, but the healer still writes convenient illnesses for whoever pays.',
    ],
    'exposed-public': [
      'It is now known that the healer\'s illnesses matched the scandal\'s court dates, and every certificate is being checked against the calendar.',
      'It is out: the healer sold sickness for the dates that mattered, and the certificates line up with the trials.',
    ],
    're-adjudicated': [
      "Whoever paid the healer before is gone, but now a scandal has broken, and whoever is implicated pays the healer for false illnesses.",
    ],
  },
};
