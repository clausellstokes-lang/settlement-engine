/**
 * causeConjunctionRole/criminal.js — the ROLE-TIER conjunction lines for
 * criminal — the boss (crews, tribute, territory, the trade's own code).
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
export const CRIMINAL_ROLE_CONTENT = {
  underfunded: {
    attributed: [
      'Tribute runs thin when the town runs poor, and the boss has found a patron uptown. The crews still answer to the boss, and the boss answers to a purse that goes unnamed.',
      'Hard times starved the rackets, and the boss took a stipend to keep the crews fed; whoever pays it now picks some of the jobs.',
    ],
    're-caused': [
      'The boss\'s first reason is gone, but now the tribute runs thin, and the uptown stipend keeps arriving like the rent.',
    ],
    reformed: [
      'The money came back to the streets and the boss bought out his stipend; the crews answer to him alone again, and the last picked job was refused.',
      'With the rackets earning again, the boss cut the patron off; the debt was paid in full, in public, so every crew could see it.',
    ],
    historicized: [
      'The tribute has recovered, but the boss still takes the uptown stipend.',
    ],
    'exposed-public': [
      'It is out on the streets that the boss ran on uptown money through the lean stretch, and the crews are asking who really picked the jobs.',
      "The stipend is public now, and the boss's own crews were the last to learn of it; they are not taking it well.",
    ],
    're-adjudicated': [
      "Whoever paid the boss before is gone, but now the streets run poor, and whoever pays the stipend now has the boss's ear.",
    ],
  },
  'chain-starved': {
    attributed: [
      'The smuggling lines broke with the roads, and only one supplier still delivers. The boss takes that supplier\'s terms because there is no one else, and the terms keep getting harder.',
      'The trade needs goods and the goods stopped moving, so the boss deals with the single hand that can still move them, on that hand\'s terms.',
    ],
    're-caused': [
      "The boss's first reason is gone, but now the supply lines are dead, and the only supplier left sets the terms.",
    ],
    reformed: [
      'The routes reopened and the boss walked from the exclusive terms; with three suppliers to choose from, he chose to owe none of them.',
      'When goods moved freely again, the boss broke the arrangement; the monopoly that held him died the day the second wagon arrived.',
    ],
    historicized: [
      'The routes are open again, but the boss still buys only from the old supplier.',
    ],
    'exposed-public': [
      'It is known in every den that the boss ran on one supplier\'s sufferance, and rivals are courting that supplier by name.',
      "The terms are out: the boss's trade belonged to the one supplier who kept it fed, and the streets know who that is.",
    ],
    're-adjudicated': [
      'Whoever fed the boss\'s trade before is gone, but now the supply lines are dead, and whoever moves goods on them holds the boss\'s trade.',
    ],
  },
  depleted: {
    attributed: [
      'There is nothing left to steal and less to fence, so the boss keeps the chair by selling names. The boss\'s people are taken one by one, always the ones who asked questions.',
      'The trade starved when the town did, and the boss keeps the chair on an informer\'s wages; each name given buys another month at the table.',
    ],
    're-caused': [
      "The boss's first reason is gone, but now the trade is starved, and selling names keeps the boss in the chair.",
    ],
    reformed: [
      'The trade came back and the boss stopped selling names; the last list was burned unsent, and he told the crews what he had been.',
      'With the streets earning again, the boss came clean to his own; whoever was owed vengeance got to choose it, and the chair survived by honesty alone.',
    ],
    historicized: [
      'The trade has recovered, but the boss still sells a name now and then.',
    ],
    'exposed-public': [
      'It is out that the boss sold the crews\' own people while the trade starved, and the kin of the fallen are done asking politely.',
      "Every name the law was given has been traced back to the boss, who fed the crews to it and called it hard times.",
    ],
    're-adjudicated': [
      "Whoever bought the boss's names before is gone, but now the trade is starved, and the boss sells names to whoever will buy.",
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo made the boss rich, and the smugglers who run its routes made the boss their tenant. The boss holds the territory by doing as the smugglers say.',
      'The embargo gave the boss the best trade the boss ever had, but the smugglers who own the routes own the boss with them.',
    ],
    're-caused': [
      "The boss's first reason is gone, but now the embargo chokes the trade, and the smugglers who run it hold the lease on the boss's streets.",
    ],
    reformed: [
      'The embargo lifted and the cartel\'s grip lifted with it; the boss bought his territory back outright and returned to trades that are merely illegal.',
      'When honest cargo moved again, the boss walked from the cartel; the tenancy ended the day their monopoly did.',
    ],
    historicized: [
      'The embargo is over, but the boss still pays rent to the smugglers who ran its routes.',
    ],
    'exposed-public': [
      'It is out that the boss held the streets as the smugglers\' tenant, and every crew in town is thinking again about its oaths to the boss.',
      "The lease is public: the smugglers who ran the embargo owned the boss's territory, and the boss signed the terms.",
    ],
    're-adjudicated': [
      'Whoever held the boss\'s lease before is gone, but now the embargo chokes the trade, and whoever took the routes holds the boss\'s streets.',
    ],
  },
  'levied-away': {
    attributed: [
      'The levy pressed half the boss\'s muscle into uniform, and a boss without muscle takes orders; the boss has belonged to someone since the week the enforcers marched.',
      'With the crews levied away to war, the boss cannot hold the streets alone and holds them by someone\'s leave; the leave has conditions, and the boss meets them.',
    ],
    're-caused': [
      "The boss's first reason is gone, but now the levy has emptied the crews, and someone's leave is all that keeps the boss in charge.",
    ],
    reformed: [
      'The crews came home from the war and the boss stood back up; the permissions were returned unthanked, and the conditions with them.',
      'When his muscle marched back, the boss ended the arrangement; a boss who can hold his own streets again did.',
    ],
    historicized: [
      'The enforcers are home, but the boss still runs the streets by someone else\'s leave.',
    ],
    'exposed-public': [
      'It is out that the boss ran the streets on borrowed leave while the muscle was at war, and the returned enforcers know whose leave it was.',
      "The conditions are public: the boss bowed to someone when the levy emptied the crews, and the streets remember who.",
    ],
    're-adjudicated': [
      "Whoever granted the boss leave before is gone, but now the crews are levied away, and the boss holds the streets by whoever's leave can be had.",
    ],
  },
  'garrison-drained': {
    attributed: [
      'The empty garrison should have been the boss\'s chance, but it drew bigger crews from outside. The boss keeps the patch by paying tribute up to them.',
      'When the garrison emptied, bigger crews arrived, and the boss made peace early. The boss\'s take goes up to them, and orders come down from people the boss has never met.',
    ],
    're-caused': [
      "The boss's first reason is gone, but now the garrison is hollow, and the outside crews it let in are too strong for the boss to fight.",
    ],
    reformed: [
      'The garrison was refilled and the outside crews thinned out; the boss stopped the upward tribute and held his patch as his own again.',
      'With the watch restored, the boss ended the arrangement; the strangers lost their leverage the day the patrols resumed.',
    ],
    historicized: [
      'The garrison stands again and the outside crews are gone, but the boss still sends the tribute up.',
    ],
    'exposed-public': [
      'It is out that the boss paid tribute to outside crews for the patch, and the boss\'s own people are asking what exactly the boss ran.',
      "The upward payments are public: the boss rented the patch from outside crews while the garrison stood empty.",
    ],
    're-adjudicated': [
      "Whoever took the boss's tribute before is gone, but now the garrison is hollow, and the boss pays tribute to whoever holds the streets around the patch.",
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war closed the roads to everyone but the boss\'s runners, and the boss carried messages through the lines for both armies. Each side holds proof of it, so the boss answers to both.',
      'With the war pressing in, the boss carried messages for both camps. The pay was good, and each camp knows what the boss carried for the other.',
    ],
    're-caused': [
      "The boss's first reason is gone, but now the war presses in, and both camps use the boss as their courier.",
    ],
    reformed: [
      'The war receded and the boss burned both sets of receipts in front of witnesses from both camps; the courier trade closed with the lines.',
      'With the pressure lifted, the boss ended it; the last messages were delivered unread, and the retainers returned to both paymasters.',
    ],
    historicized: [
      'The war has moved on, but both armies still hold proof of the boss\'s runs, and the boss still takes orders from both.',
    ],
    'exposed-public': [
      'It is out that the boss couriered for both camps through the fighting, and each army has published the other\'s receipts.',
      "The double courier trade is public: the boss carried messages for both sides, and the whole town wonders who else the boss would sell.",
    ],
    're-adjudicated': [
      'Whoever paid the boss before is gone, but now the war presses in, and the proof of the boss\'s courier runs is in hands that mean to use it.',
    ],
  },
  occupation: {
    attributed: [
      'The occupier lets the boss\'s rackets run, and the boss pays for it each month in names: resisters, safe houses, and anyone who asked the crews for help.',
      'The occupation could have crushed the trade in a week and did not; the boss pays for that in information, and the crews do not know they carry it.',
    ],
    're-caused': [
      "The boss's first reason is gone, but now the occupier tolerates the rackets, and the boss pays the rent in names.",
    ],
    reformed: [
      'The occupier withdrew and the boss stood before the crews with the whole account: what was traded, who was named, and his throat offered with it.',
      'With the occupation ended, the boss came clean to his own; the informing stopped with the occupation, and the amends did not.',
    ],
    historicized: [
      'The occupier is gone, but the boss still keeps an informer\'s habits: careful lists of neighbors, careful silences.',
    ],
    'exposed-public': [
      'It is out that the boss informed for the occupier, and the resistance\'s survivors have longer memories than the law ever did.',
      "The rent is public: the boss's rackets ran on betrayed neighbors, and the neighbors' families are keeping count.",
    ],
    're-adjudicated': [
      'Whoever held the boss before is gone, but now the occupier lets the rackets run, and the boss pays for that in names and safe houses.',
    ],
  },
  'conduct-drift': {
    attributed: [
      'A dark patron has taken up the boss\'s cruelty and begun to steer it; the beatings and burnings still look like business, but someone else picks the targets now.',
      'A patron that pays for pain now backs the boss, and the crews have noticed the jobs getting stranger and the take getting easier.',
    ],
    're-caused': [
      "The boss's first reason is gone, but now a dark patron rewards the cruelty, and it picks the crews' targets.",
    ],
    reformed: [
      "The patron's shadow lifted and the boss took his crews back to plain crime; the strange jobs ended, and the sponsored cruelty with them.",
      'With the rewarding patron gone, the boss came clean to the crews; the steered targets were named, and what was owed them paid.',
    ],
    historicized: [
      'The patron is gone, but the boss still sends the crews out on the strange jobs.',
    ],
    'exposed-public': [
      "It is out that a dark patron steered the boss's violence, and the town knows now who picked the targets.",
      "The sponsorship is public: the boss hurt people to order for a power that paid in favor, and even the boss's own crews want distance now.",
    ],
    're-adjudicated': [
      "Whoever paid the boss before is gone, but now a patron that rewards the deed backs the boss, and it picks the crews' targets.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith hires muscle like anyone else, and the boss supplies it; the crews break up the old congregation\'s meetings and are paid from a mission purse.',
      'Doctrine came to the streets with money behind it: the boss\'s toughs clear rooms for the rival preachers, and the boss calls it just work.',
    ],
    're-caused': [
      "The boss's first reason is gone, but now the rival faith presses in and pays, and the mission work keeps the crews on its payroll.",
    ],
    reformed: [
      'The rival faith withdrew and the boss pulled his crews off the doctrine work; the mission purse went back half full.',
      'When the conversion pressure broke, the boss ended the contract; breaking bones for belief had made even his toughs uneasy.',
    ],
    historicized: [
      'The rival faith gave up the town, but the boss still keeps its muscle contract and the crews that work it.',
    ],
    'exposed-public': [
      'It is out that the boss\'s crews cleared the way for the rival mission, and both congregations know whose fists did the converting.',
      "The mission payroll is public, and the boss's crews are on it by name; the town has learned its conversions were paid for.",
    ],
    're-adjudicated': [
      'Whoever held the boss\'s contract before is gone, but now the rival faith presses in, and its purse has taken on the boss\'s crews.',
    ],
  },
  secularization: {
    attributed: [
      'The old thieves\' code was sworn on a faith this town no longer keeps, and the boss noticed first; the boss sells the crews\' own people now, because the oath no longer holds.',
      'Even the thieves here once swore by the faith. It went cold, and the boss has been spending the trust that oath used to keep.',
    ],
    're-caused': [
      "The boss's first reason is gone, but now the faith has gone cold, and with the code meaning nothing, the boss has no reason to stop.",
    ],
    reformed: [
      'The faith revived and the code with it; the boss re-swore the old oaths before the crews and put right what breaking them had cost.',
      'When belief returned to the streets, the boss came clean; the sold trust was bought back at whatever price its owners set.',
    ],
    historicized: [
      'The faith warmed and everyone but the boss swore the code again; the boss still sells out the crews\' own people.',
    ],
    'exposed-public': [
      'It is out that the boss broke the code while nothing held it, and the crews that kept it anyway are deciding what the boss is owed.',
      "The boss's betrayals are public now, dated to the season the faith went cold, and the streets mean to settle them by their own law.",
    ],
    're-adjudicated': [
      "Whoever paid the boss before is gone, but now the faith has gone cold, and no code holds the boss back.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The boss holds the temple\'s sins in a strongbox and collects on them monthly, but needs those priests standing, so the boss guards the priests the boss bleeds.',
      'The tainted clergy pay the boss for silence, and the payments have become the boss\'s best racket; the boss is now the disgraced temple\'s banker, bodyguard, and jailer at once.',
    ],
    're-caused': [
      "The boss's first reason is gone, but now the priesthood is tainted, and the temple's silence money keeps the strongbox racket going.",
    ],
    reformed: [
      'The priesthood was cleansed and the racket died; the boss handed the strongbox to the synod unopened, which no one believed until it was inventoried.',
      "With the clergy's scandal resolved, the boss ended the collections; a racket built on sins already confessed collects nothing.",
    ],
    historicized: [
      'The temple was set in order and the town has forgiven it, but the boss still collects from the priests.',
    ],
    'exposed-public': [
      'It is out that the boss bled the tainted temple and guarded it too, and neither the faithful nor the crews like what that makes the boss.',
      "The strongbox is public: every sin of the clergy, listed, with the boss's dates for collecting on each.",
    ],
    're-adjudicated': [
      "Whoever held the boss before is gone, but now the priesthood is tainted, and the temple's silence money goes through the boss's hands.",
    ],
  },
  captured: {
    attributed: [
      'The town thinks the boss owns the offices; the offices know better. The boss is the underworld\'s steward here, holding the streets for it and handing over the take each quarter.',
      'The underworld\'s hold on this town runs through the boss but does not belong to the boss; the boss runs it for those above, and the crews are what the boss stands to lose.',
    ],
    're-caused': [
      "The boss's first reason is gone, but now the underworld holds the offices, and the boss runs things for it without a say.",
    ],
    reformed: [
      'The capture was broken and the boss broke with it; he handed the stewardship ledgers to the magistrates and took his chances with both sides.',
      "With the syndicate's grip broken, the boss came clean; the audited streets were released, and he answers to his own crews again.",
    ],
    historicized: [
      'The underworld\'s hold was broken, but the boss still runs the streets as its steward and still sets the quarter\'s take aside.',
    ],
    'exposed-public': [
      'It is out that the boss held the town for the underworld, not for the boss\'s own sake, and every crew sworn to the boss is rethinking its oath.',
      "The stewardship is public: the boss's empire belonged to the underworld, and the town has seen the terms.",
    ],
    're-adjudicated': [
      'Whoever owned the boss before is gone, but now the underworld holds the offices, and whoever holds them now kept the boss in place.',
    ],
  },
  scandal: {
    attributed: [
      'The scandal made testimony the most valuable thing in town, and the boss sells it both ways: names to the law, and silence to the named.',
      'Half the town would pay to know what the boss knows about the scandal, and the other half pays so no one does; the boss collects from both halves.',
    ],
    're-caused': [
      "The boss's first reason is gone, but now the scandal has broken, and the boss sells its testimony.",
    ],
    reformed: [
      'The scandal burned out and the boss retired the testimony trade; what remained unsold went to the magistrates without a price.',
      'When the scandal settled, the boss ended it; the last buyer of silence got his coin back, and the law got the rest.',
    ],
    historicized: [
      'The scandal has died down, but the boss still sells its testimony to both sides.',
    ],
    'exposed-public': [
      'It is out that the boss traded scandal testimony to both sides, and the buyers and the named are comparing invoices.',
      "It is out that the boss sold the town's guilt in both directions, and everyone finds their own name on one side.",
    ],
    're-adjudicated': [
      "Whoever held the boss before is gone, but now the scandal has broken, and whoever buys testimony deals with the boss directly.",
    ],
  },
};
