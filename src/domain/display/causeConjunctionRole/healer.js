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
      'The infirmary\'s funding failed, and the healer\'s oath quietly re-priced itself; the medicine goes to the paying beds first, and the donated supplies are resold out the side door.',
      'Care costs what the healer says it costs now; since the funding dried, the sliding scale slides one way, and the charity beds stand empty for want of paperwork.',
    ],
    're-caused': [
      'What first bent the healer has passed; the starved infirmary bends them now, and the side-door sales are called keeping the doors open.',
    ],
    reformed: [
      'The funding returned and the healer re-opened the charity beds first; the resold supplies were bought back at a loss taken personally.',
      'With the infirmary funded, the healer came clean; the one-way scale was confessed and the overcharged repaid, bed by bed.',
    ],
    historicized: [
      'The funding recovered, but the side door still does business; the shortfall that opened it is long since closed.',
    ],
    'exposed-public': [
      'It is public that the healer sold donated medicine while the charity beds stood empty, and the town is matching graves to the price list.',
      'The side door is out: the infirmary\'s poverty was real, and so was the healer\'s margin on it, and the sick paid both.',
    ],
    're-adjudicated': [
      'The syndicate holding the healer is destroyed, but the infirmary is still starved, and the side-door trade now answers to the shortfall alone.',
    ],
  },
  'chain-starved': {
    attributed: [
      'The medicine stopped arriving when the roads died, so the healer buys from the men who rob the dead; the sick recover on stolen physic, and the suppliers hold the healer\'s open account.',
      'Every remedy in the infirmary has a history now; the supply lines failed, and the healer sources from hands that work by night, and owes them daylight favors.',
    ],
    're-caused': [
      "The healer's first reason is gone; the dead supply lines reason for them now, and the night suppliers keep the sickroom shelves filled.",
    ],
    reformed: [
      'The medicine came back by honest roads and the healer closed the night account; the last favor owed was refused, in writing.',
      'With the supply lines restored, the healer came clean; the sourced-by-night remedies were disclosed, and the debts settled in coin instead of favors.',
    ],
    historicized: [
      'The roads are open, but the healer still buys from the night men; the shortage that introduced them has ended.',
    ],
    'exposed-public': [
      'It is public that the infirmary ran on grave-robbers\' goods, and the families of the robbed are inventorying the shelves.',
      'The night account is out: the healer\'s remedies were plundered, and the town is weighing its recoveries against its opened graves.',
    ],
    're-adjudicated': [
      'The old suppliers are destroyed, but the supply lines are still dead, and whoever works by night now holds the infirmary\'s account.',
    ],
  },
  depleted: {
    attributed: [
      'The remedies are gone, so the healer rations what remains by favor and fills the gap with colored water; the poor drink hope, the connected drink medicine, and the ledger calls both treatment.',
      'Scarcity reached the sickroom, and the healer adapted: true physic for those who bring something, tonics of nothing for those who do not, and the same fee for both.',
    ],
    're-caused': [
      "The healer's first cause has passed; the empty medicine chest reasons for them now, and the favor-rationing pays its keeper.",
    ],
    reformed: [
      'The stores were replenished and the healer poured out the colored water in front of the queue; the true physic goes by sickness now, not standing.',
      'With the chest refilled, the healer came clean; the nothing-tonics were confessed, and their buyers treated free until the debt was worked off.',
    ],
    historicized: [
      'The chest was refilled, but the favor-rationing continues; the scarcity that taught it has passed.',
    ],
    'exposed-public': [
      'It is public that the healer sold colored water to the poor while rationing true medicine by favor, and the bereaved are re-reading their bills.',
      'The two-shelf sickroom is out: physic for the connected, hope-water for the rest, and the healer\'s fee identical on every receipt.',
    ],
    're-adjudicated': [
      'The syndicate is gone, but the chest is still empty, and the rationing power has assumed the healer\'s arrangement with it.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo banned the physic imports with everything else, so the healer runs a pharmacy of contraband; the medicine is real, the channel is criminal, and the markup covers the risk three times over.',
      'Medicine still reaches this town because the healer deals with the embargo-runners; the sick pay smugglers\' prices for their lives, and the healer keeps the difference between mercy and market.',
    ],
    're-caused': [
      'What first held the healer has passed; the embargo holds them now, and each contraband consignment renews the margin.',
    ],
    reformed: [
      'The embargo lifted and the healer posted honest prices the same week; the smuggler margin was refunded to every patient who could be found.',
      'When the imports flowed again, the healer came clean; the contraband channel was closed and its accounts opened.',
    ],
    historicized: [
      'The embargo is lifted, but the healer still charges the running price; the risk that justified it is retired.',
    ],
    'exposed-public': [
      'It is public that the healer priced contraband medicine at three times the risk, and the town has learned what its survival was billed at.',
      'The pharmacy\'s channel is out: the medicine came by night and the markup stayed at noon, and the healer pocketed the difference.',
    ],
    're-adjudicated': [
      'The old runners are destroyed, but the trade is still strangled, and the medicine channel has new carriers holding the healer\'s account.',
    ],
  },
  'levied-away': {
    attributed: [
      'The levy takes the able-bodied, and the healer\'s certificate says who is able; unfitness is for sale at the infirmary, and the price rises with each muster.',
      'With the recruiters working the town, the healer\'s signature became armor; sons stay home for coin, and the poor march in place of the paying.',
    ],
    're-caused': [
      "The healer's first cause resolved, but the levy keeps mustering, and the unfitness trade now sustains the arrangement.",
    ],
    reformed: [
      'The companies came home and the healer stopped the certificate trade; the bought exemptions were confessed to the muster office unprompted.',
      'When the levy ended, the healer came clean; the fees were returned to the buyers and the apology made to those who marched instead.',
    ],
    historicized: [
      'The levy is over, but the healer still sells the signature; the muster that priced it is disbanded.',
    ],
    'exposed-public': [
      'It is public that unfitness was for sale at the infirmary, and the families of those who marched in a buyer\'s place are outside.',
      'The certificate trade is out: the healer\'s signature kept the paying home, and the town\'s dead are the counter-ledger.',
    ],
    're-adjudicated': [
      'The syndicate fell, but the levy still musters, and the certificate trade has been re-let to hands that kept the healer\'s pen.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'With the garrison hollow, the gangs keep their own order, and the healer patches their wounded off the books; the pay is protection, and the infirmary\'s night entries appear in no register.',
      'The watch cannot protect the infirmary, so the healer bought protection the available way: knife wounds stitched without questions, and the stitching never reported.',
    ],
    're-caused': [
      "The healer's first reason passed, but the garrison hollowed after, and the off-book stitching now buys the protection the watch cannot.",
    ],
    reformed: [
      'The garrison was refilled and the healer closed the night practice; the unreported wounds were reported, dated, and named.',
      'With the watch restored, the healer came clean; the protection arrangement ended, and the night ledger went to the captain.',
    ],
    historicized: [
      'The garrison stands full again, but the night entries continue; the danger that began them is patrolled now.',
    ],
    'exposed-public': [
      'It is public that the healer stitched the gangs\' wounded off the books, and every unexplained recovery in town has found its explanation.',
      'The night ledger is out: the infirmary treated violence and hid it, and the healer\'s protection was the fee.',
    ],
    're-adjudicated': [
      'The old protectors are destroyed, but the garrison is still drained, and the off-book practice has new patients holding the old terms.',
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war fills the sickrooms past capacity, and the healer\'s triage has developed a price; who is seen first is negotiable, and the negotiating happens at the door while the wounded wait.',
      'Under the war\'s pressure the healer sells the queue itself; the gravely hurt hold their place with coin or lose it to lighter wounds with heavier purses.',
    ],
    're-caused': [
      "The healer's old cause cleared, but the war pressed in, and the priced queue now carries the arrangement.",
    ],
    reformed: [
      'The war receded and the healer restored triage by wound alone; the queue fees were poured into beds for those the pricing had cost.',
      'With the pressure lifted, the healer came clean; the sold places were confessed, and the sickroom door opened by need again.',
    ],
    historicized: [
      'The war moved on, but the queue still has a price; the crowding that excused it has emptied.',
    ],
    'exposed-public': [
      'It is public that the healer sold places in the war queue, and the families of those who waited and died have the receipts of those who did not.',
      'The door price is out: the healer auctioned urgency itself through the fighting, and the town is reading the sequence of its dead.',
    ],
    're-adjudicated': [
      'The syndicate is broken, but the war still presses, and the queue trade has been assumed by new hands at the same door.',
    ],
  },
  occupation: {
    attributed: [
      'The occupier\'s officers are treated first and best, and the healer\'s reports travel with the medicine; which households hide wounded men is a diagnosis now, delivered weekly.',
      'The infirmary stays open by the occupier\'s grace, and the grace is earned; the healer heals whoever comes, and notes for the occupation whoever should not have been hurt that way.',
    ],
    're-caused': [
      "What first compromised the healer is gone; the occupier's grace sustains the infirmary now, and the weekly notes sustain the grace.",
    ],
    reformed: [
      'The occupier withdrew and the healer confessed the notes to the households they had named, one visit at a time.',
      'With the occupation ended, the healer came clean; the first-and-best treatment was owned, and the infirmary\'s books opened to the town.',
    ],
    historicized: [
      'The occupier is gone, but the healer still keeps the diagnostic notes; the reader who required them has marched.',
    ],
    'exposed-public': [
      'It is public that the healer\'s house calls fed the occupier\'s lists, and every raid that followed a treatment now has its informant.',
      'The notes are out, in the healer\'s hand: wounds described, households named, and the occupation\'s visits mapped to both.',
    ],
    're-adjudicated': [
      "The healer's old paymaster is destroyed, but the occupier remains, and the weekly notes have a new recipient at the same address.",
    ],
  },
  'conduct-drift': {
    attributed: [
      'A dark patron prizes the healer\'s quiet endings; certain deaths in the sickroom arrive early and gently, and each one returns to the healer as blessing and gift.',
      'The healer\'s mercy has developed a sponsor: a patron that rewards the eased passing, chosen or not, and the sickroom\'s worst nights are its best offerings.',
    ],
    're-caused': [
      "The healer's first cause resolved, but a patron that rewards the deed adopted the practice, and its gifts now retain the quiet endings.",
    ],
    reformed: [
      "The patron's shadow lifted and the quiet endings stopped; the healer confessed each one to the families, and let them choose the reckoning.",
      'With the rewarding patron gone, the healer came clean; unsponsored, the eased passings were seen plainly, and forsworn.',
    ],
    historicized: [
      'The patron is gone, but the sickroom\'s quiet endings continue; the sponsorship lapsed and the hand did not.',
    ],
    'exposed-public': [
      'It is public that certain deaths in the sickroom were offerings, and the town is exhuming its trust in every gentle passing.',
      'The sponsorship is out: a dark patron paid for the healer\'s mercy, and the families are re-reading each early death.',
    ],
    're-adjudicated': [
      "The syndicate fell, but the patron that rewards the deed still stands, and the sickroom's arrangement passed into its keeping.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith pays a bounty on miracles, and the healer supplies them; cures are staged, credited to the mission\'s god, and invoiced as witness fees.',
      'Conversion follows recovery, the mission has learned, so it buys recoveries; the healer times the cures to the preaching, and the preaching pays.',
    ],
    're-caused': [
      "The healer's first reason passed; the rival faith's miracle bounty replaced it, and the staged cures keep earning it.",
    ],
    reformed: [
      'The rival faith withdrew and the healer recanted the staged cures publicly, naming the medicine that had done the work.',
      'When the conversion pressure broke, the healer came clean; the witness fees were returned, and the cures re-credited to the craft.',
    ],
    historicized: [
      'The rival faith gave up the town, but the healer still stages the occasional wonder; the bounty that trained it is closed.',
    ],
    'exposed-public': [
      'It is public that the mission\'s miracles were the healer\'s staged cures, and every conversion that followed one is unraveling.',
      'The bounty is out: recoveries were sold as signs, and the healer collected per soul persuaded.',
    ],
    're-adjudicated': [
      'The old patron is gone, but the rival faith still presses, and its miracle bounty has been re-funded through new hands.',
    ],
  },
  secularization: {
    attributed: [
      'The healing vow was sworn to a power this town has stopped feeding, and the healer has stopped honoring it; the charity beds closed quietly, and the oath\'s hard duties lapsed with the faith.',
      'With the faith gone cold, no one audits mercy; the healer treats by profit now, and the vow that once forbade it is a decoration on the wall.',
    ],
    're-caused': [
      "The healer's first cause resolved, but the faith went cold behind it, and with the vow unwatched, the arrangement simply persisted.",
    ],
    reformed: [
      'The faith revived and the healer re-took the vow at the altar; the charity beds reopened the same day, first.',
      'When belief returned, the healer came clean; the lapsed duties were resumed, and the profit-years\' takings endowed the free ward.',
    ],
    historicized: [
      'The faith warmed again, but the charity beds never reopened; the cold season that closed them is over.',
    ],
    'exposed-public': [
      'It is public what the healer let lapse while the vow went unwatched, and the reviving congregation is reading the infirmary\'s ledgers as confession.',
      'The lapsed vow is out: the healer kept the fees and dropped the duties the moment no god was counting, and the town has counted instead.',
    ],
    're-adjudicated': [
      "The healer's paymaster fell, but the faith is still cold, and no revived vow stands between the practice and its prices.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The tainted clergy need their history certified natural, and the healer signs; old injuries become accidents, old deaths become fevers, and the retainer arrives with the tithe.',
      'The healer\'s signature launders the temple\'s harms; whatever the disgraced priests did, the medical record now says otherwise, at a page rate.',
    ],
    're-caused': [
      "The healer's first reason resolved, but the tainted priesthood needed a certifier, and the laundered records now carry the arrangement.",
    ],
    reformed: [
      'The priesthood was cleansed and the healer withdrew the false certificates; the true records were filed with the synod, whatever they convicted.',
      "With the clergy's scandal resolved, the healer came clean; the page-rate signatures were confessed and the retainer returned.",
    ],
    historicized: [
      'The temple was set in order, but the false certificates still stand; the healer never withdrew what the mended clergy no longer need.',
    ],
    'exposed-public': [
      'It is public that the healer certified the temple\'s harms as accidents, and the true injuries are being re-read from the false pages.',
      'The laundering is out: the medical record covered the clergy\'s sins at a page rate, and the healer\'s hand is on every page.',
    ],
    're-adjudicated': [
      "The syndicate is gone, but the priesthood's taint remains, and the certification trade has found the healer new clients.",
    ],
  },
  captured: {
    attributed: [
      'The syndicate runs its wounded through the infirmary after dark, and the healer\'s certificates run the other way; deaths that need explaining get natural causes, and the ledger stays innocent.',
      'The underworld holds the infirmary the way it holds the offices: bullets come out quietly, names go down wrong, and the healer\'s honest reputation is the service being used.',
    ],
    're-caused': [
      "The healer's old cause resolved, but the underworld holds the town's offices now, and an infirmary it uses is not released from use.",
    ],
    reformed: [
      'The capture was broken and the healer corrected every certificate; the natural causes were unnaturaled, and the magistrates given the true dates.',
      "With the syndicate's grip broken, the healer came clean; the after-dark patients were named, and the innocent ledger confessed guilty.",
    ],
    historicized: [
      'The capture was broken, but the after-dark door still opens; the master who required it is gone and the habit answers the knock.',
    ],
    'exposed-public': [
      'It is public that the infirmary served the syndicate after dark, and every natural death it certified is being re-examined.',
      'The innocent ledger is out: the healer\'s certificates buried the underworld\'s work, and the town is exhuming the paperwork.',
    ],
    're-adjudicated': [
      'The syndicate that used the infirmary is destroyed, but the offices are still captured, and the after-dark practice has new patients already.',
    ],
  },
  scandal: {
    attributed: [
      'Since the scandal broke, the healer\'s diagnoses have become alibis; the implicated are certified bedridden on the relevant dates, and the certification is priced by the danger.',
      'The scandal made health a legal matter, and the healer bills accordingly; illness appears where testimony is inconvenient, and recovery follows acquittal.',
    ],
    're-caused': [
      "The healer's first cause cleared, but the scandal broke behind it, and the alibi practice now sustains the arrangement.",
    ],
    reformed: [
      'The scandal burned out and the healer withdrew the convenient diagnoses; the court was told which illnesses had been real.',
      'When the scandal settled, the healer came clean; the alibi certificates were confessed, and the fees surrendered to the court.',
    ],
    historicized: [
      'The scandal is old news, but the convenient diagnoses continue; the danger that priced them has passed.',
    ],
    'exposed-public': [
      'It is public that the healer\'s diagnoses tracked the scandal\'s court dates, and the certified illnesses are being re-examined by the calendar.',
      'The alibi practice is out: sickness for sale on the relevant dates, and the healer\'s certificates timed like clockwork.',
    ],
    're-adjudicated': [
      "The syndicate is broken, but the scandal's economy survives, and the alibi trade has new underwriters holding the healer's pen.",
    ],
  },
};
