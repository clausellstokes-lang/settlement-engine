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
      'The tribute runs thin when the town runs poor, and the boss found a patron uptown; the crews still answer to him, but he answers to a purse he will not name.',
      'Hard times starved the rackets, and the boss took a stipend to keep his crews fed; whoever pays it now picks some of the jobs.',
    ],
    're-caused': [
      'What first leashed the boss has passed; the thin tribute leashes him now, and the uptown stipend arrives as regularly as the rent.',
    ],
    reformed: [
      'The money came back to the streets and the boss bought out his stipend; the crews answer to him alone again, and the last picked job was refused.',
      'With the rackets earning again, the boss cut the patron off; the debt was paid in full, in public, so every crew could see it.',
    ],
    historicized: [
      'The tribute recovered, but the boss kept the stipend; the hunger that signed him is long fed.',
    ],
    'exposed-public': [
      'It is out on the streets that the boss ran on uptown money through the lean stretch, and the crews are asking who really picked the jobs.',
      "The stipend is public now, and the boss's own people learned it last; a leashed boss is a short-lived kind.",
    ],
    're-adjudicated': [
      'The paymaster who held the boss is destroyed, but the streets are still poor, and the stipend has been reissued from a new purse.',
    ],
  },
  'chain-starved': {
    attributed: [
      'The contraband lines broke with the roads, and only one supplier still delivers; the boss takes their terms because there are no others, and the terms grow teeth.',
      'The trade needs goods and the goods stopped moving, so the boss deals with the single hand that can still move them, on that hand\'s terms.',
    ],
    're-caused': [
      "The boss's first hold has passed; the dead supply lines hold him now, and the only supplier left writes the terms.",
    ],
    reformed: [
      'The routes reopened and the boss walked from the exclusive terms; with three suppliers to choose from, he chose to owe none of them.',
      'When goods moved freely again, the boss broke the arrangement; the monopoly that held him died the day the second wagon arrived.',
    ],
    historicized: [
      'The routes are open again, but the boss never left the old supplier; the monopoly that gripped him is a courtesy now.',
    ],
    'exposed-public': [
      'It is known in every den that the boss ran on one supplier\'s sufferance, and rivals are courting that supplier by name.',
      "The terms are out: the boss's trade belonged to whoever fed it, and the streets have learned who was feeding.",
    ],
    're-adjudicated': [
      'The old supplier is destroyed, but the lines are still dead, and whoever moves goods now inherited the boss with the route.',
    ],
  },
  depleted: {
    attributed: [
      'There is nothing left to steal and less to fence, and the boss holds his seat the cheap way: by selling names. His people fall one by one, always the ones who questioned him.',
      'The trade starved when the town did, and the boss kept his chair on informant\'s wages; each name he gives buys another month at the table.',
    ],
    're-caused': [
      "The boss's first hold passed; the starved trade holds him now, and the names keep the chair beneath him.",
    ],
    reformed: [
      'The trade came back and the boss stopped selling names; the last list was burned unsent, and he told the crews what he had been.',
      'With the streets earning again, the boss came clean to his own; whoever was owed vengeance got to choose it, and the chair survived by honesty alone.',
    ],
    historicized: [
      'The trade recovered, but the boss still trades a name now and then; the famine that taught him the habit has passed.',
    ],
    'exposed-public': [
      'It is out that the boss sold his own people through the lean stretch, and the fallen crews\' kin are done asking politely.',
      "The names have been counted and they all point to the chair; the boss fed his people to the law and called it hard times.",
    ],
    're-adjudicated': [
      'The syndicate above the boss is destroyed, but the trade is still starved, and the name-selling has found a new buyer already.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo made the boss rich and the cartel that runs it made him theirs; he holds his territory as a tenant now, and the rent is obedience.',
      'Strangled trade is the best trade the boss ever had, and the worst bargain; the cartel that owns the routes owns him with them.',
    ],
    're-caused': [
      "The boss's first hold has passed; the embargo holds him now, and the cartel that runs it holds the lease on his streets.",
    ],
    reformed: [
      'The embargo lifted and the cartel\'s grip lifted with it; the boss bought his territory back outright and returned to trades that are merely illegal.',
      'When honest cargo moved again, the boss walked from the cartel; the tenancy ended the day their monopoly did.',
    ],
    historicized: [
      'The embargo is done, but the boss still pays the cartel\'s rent; the monopoly that set it has dissolved and the habit has not.',
    ],
    'exposed-public': [
      'It is out that the boss held his streets as the cartel\'s tenant, and every crew in town is rereading its oaths to him.',
      "The lease is public: the embargo's cartel owned the boss's territory, and the boss signed the terms with his own mark.",
    ],
    're-adjudicated': [
      'The cartel is destroyed, but the trade is still strangled, and the tenancy has passed to whoever inherited the routes.',
    ],
  },
  'levied-away': {
    attributed: [
      'The levy pressed half his muscle into uniform, and a boss without muscle takes orders; he became somebody\'s creature the week his enforcers marched.',
      'With his strength levied away to war, the boss cannot hold what he claims, so he holds it by permission; the permission has conditions, and he meets them.',
    ],
    're-caused': [
      "The boss's first hold passed; the levy that emptied his crews holds him now, and permission is the only muscle he has left.",
    ],
    reformed: [
      'The crews came home from the war and the boss stood back up; the permissions were returned unthanked, and the conditions with them.',
      'When his muscle marched back, the boss ended the arrangement; a boss who can hold his own streets again did.',
    ],
    historicized: [
      'The enforcers are home, but the boss still works by permission; the weakness that begged it has healed over.',
    ],
    'exposed-public': [
      'It is out that the boss ran his streets on borrowed leave while his muscle was at war, and the returned enforcers know whose leave it was.',
      "The conditions are public: the boss knelt when the levy emptied his crews, and the streets remember who he knelt to.",
    ],
    're-adjudicated': [
      'The patron who held the boss is destroyed, but the muscle is still levied away, and the permission has been reissued by other hands.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'The hollow garrison should have been the boss\'s harvest, but the vacuum drew bigger crews from outside; he keeps his patch by paying tribute up to strangers.',
      'When the garrison drained, the real predators arrived, and the boss made his peace early; his take flows upward now, and his orders flow down from men he has never met.',
    ],
    're-caused': [
      "The boss's first hold passed; the drained garrison holds him now, for the vacuum it left filled with crews he cannot fight.",
    ],
    reformed: [
      'The garrison was refilled and the outside crews thinned out; the boss stopped the upward tribute and held his patch as his own again.',
      'With the watch restored, the boss ended the arrangement; the strangers lost their leverage the day the patrols resumed.',
    ],
    historicized: [
      'The garrison stands again and the outside crews are gone, but the boss still sends the tribute up; no one has told him to stop, so he has not.',
    ],
    'exposed-public': [
      'It is out that the boss paid tribute to outside crews for his own streets, and his people are asking what exactly he was boss of.',
      "The upward payments are public: the boss rented his patch from strangers while the garrison stood empty, and the receipts went uptown.",
    ],
    're-adjudicated': [
      'The outside syndicate is destroyed, but the garrison is still drained, and the vacuum has already priced the boss\'s patch for new landlords.',
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war closed the roads to everyone but his runners, and the boss carried messages through the lines for both armies; each side holds his receipts, which makes him twice owned.',
      'Under the war\'s pressure the boss found the best margin of his life: courier for both camps. The pay was heavy, and so is what they each know about the other runs.',
    ],
    're-caused': [
      "The boss's first hold cleared, but the war pressed in, and the two-camp courier trade now holds him tighter than any oath.",
    ],
    reformed: [
      'The war receded and the boss burned both sets of receipts in front of witnesses from both camps; the courier trade closed with the lines.',
      'With the pressure lifted, the boss ended it; the last messages were delivered unread, and the retainers returned to both paymasters.',
    ],
    historicized: [
      'The war moved on, but both armies still hold the receipts; the boss works his streets with two swords over his head, by habit now.',
    ],
    'exposed-public': [
      'It is out that the boss couriered for both camps through the fighting, and each army has published the other\'s receipts.',
      "The double courier trade is public: the boss sold passage to enemies of each other, and the whole town knows who else he would sell.",
    ],
    're-adjudicated': [
      'The syndicate is broken, but the war still presses, and the courier receipts have passed to hands that intend to collect on them.',
    ],
  },
  occupation: {
    attributed: [
      'The occupier tolerates the boss\'s rackets, and the toleration is billed monthly: names of resisters, safe houses, and whoever asked his crews for help.',
      'The occupation could have crushed the trade in a week, and did not; the boss pays for the mercy in informations, and his crews do not know they carry it.',
    ],
    're-caused': [
      "What first held the boss is gone; the occupier's tolerance holds him now, and the informations are the rent.",
    ],
    reformed: [
      'The occupier withdrew and the boss stood before the crews with the whole account: what was traded, who was named, and his throat offered with it.',
      'With the occupation ended, the boss came clean to his own; the informing stopped with the occupation, and the amends did not.',
    ],
    historicized: [
      'The occupier is gone, but the boss still keeps the informer\'s discipline: careful lists, careful silences; the master who required them has marched.',
    ],
    'exposed-public': [
      'It is out that the boss informed for the occupier, and the resistance\'s survivors have longer memories than the law ever did.',
      "The rent is public: the boss's rackets ran on betrayed neighbors, and the neighbors' families are keeping the ledger now.",
    ],
    're-adjudicated': [
      'The boss\'s old paymaster is destroyed, but the occupier remains, and the toleration has been re-billed at the same address.',
    ],
  },
  'conduct-drift': {
    attributed: [
      'A dark patron has adopted the boss\'s cruelty and begun to steer it; the beatings and burnings still look like business, but the targets are chosen elsewhere now.',
      'The boss\'s worst instincts found a sponsor: a patron that pays for pain, and the crews have noticed the jobs getting stranger and the take getting easier.',
    ],
    're-caused': [
      "The boss's first hold resolved, but a patron that rewards the deed adopted him, and its sponsorship now steers the crews.",
    ],
    reformed: [
      "The patron's shadow lifted and the boss took his crews back to plain crime; the strange jobs ended, and the sponsored cruelty with them.",
      'With the rewarding patron gone, the boss came clean to the crews; the steered targets were named, and what was owed them paid.',
    ],
    historicized: [
      'The patron is gone, but the boss still runs the strange jobs; the sponsorship ended and the taste for it did not.',
    ],
    'exposed-public': [
      'It is out that the boss\'s violence was steered by a dark patron, and the town has learned its beatings were somebody\'s offerings.',
      "The sponsorship is public: the boss hurt to order for a power that paid in favor, and even his own crews want distance now.",
    ],
    're-adjudicated': [
      "The syndicate fell, but the patron that rewards the deed still stands, and the boss's crews now serve its calendar of targets.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith hires muscle like anyone else, and the boss supplies it; his crews break up the old congregation\'s meetings and are paid from a mission purse.',
      'Doctrine came to the streets with money behind it: the boss\'s toughs clear rooms for the rival preachers, and the boss pretends it is just work.',
    ],
    're-caused': [
      "The boss's first hold passed; the rival faith's purse holds him now, and the mission work keeps his crews on its payroll.",
    ],
    reformed: [
      'The rival faith withdrew and the boss pulled his crews off the doctrine work; the mission purse went back half full.',
      'When the conversion pressure broke, the boss ended the contract; breaking bones for belief had made even his toughs uneasy.',
    ],
    historicized: [
      'The rival faith gave up the town, but the boss keeps the muscle contract on the books; the mission that signed it is gone.',
    ],
    'exposed-public': [
      'It is out that the boss\'s crews cleared the way for the rival mission, and both congregations know whose fists did the converting.',
      "The mission payroll is public, and the boss's crews are on it by name; the town has learned its change of heart was contracted.",
    ],
    're-adjudicated': [
      'The old paymaster is gone, but the rival faith still presses, and its purse has picked up the muscle contract intact.',
    ],
  },
  secularization: {
    attributed: [
      'The old code was sworn on things this town no longer believes, and the boss noticed first; he sells his own people now, because nothing he swore binds him not to.',
      'Even thieves had a catechism here once. It went cold with the rest of the faith, and the boss has been spending the trust it used to guarantee.',
    ],
    're-caused': [
      "The boss's first hold resolved, but the faith went cold behind it, and with the code unsworn, the arrangement simply had no reason to stop.",
    ],
    reformed: [
      'The faith revived and the code with it; the boss re-swore the old oaths before the crews and put right what breaking them had cost.',
      'When belief returned to the streets, the boss came clean; the sold trust was bought back at whatever price its owners set.',
    ],
    historicized: [
      'The faith warmed and the code was re-sworn by everyone but the boss; the cold season that freed him is over and he stayed free.',
    ],
    'exposed-public': [
      'It is out that the boss broke the code while nothing held it, and the crews that kept it anyway are deciding his sentence.',
      "The betrayals are public now, dated to the season the faith went cold; the boss sold what the code protected, and the streets keep older laws than the town.",
    ],
    're-adjudicated': [
      "The boss's paymaster fell, but the faith is still cold, and no revived code stands between him and the habit.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The boss holds the temple\'s sins in a strongbox and collects on them monthly, but extortion cuts both ways; he needs those priests standing, so he protects what he bleeds.',
      'The tainted clergy pay the boss for silence, and the payments have become his best racket; he is now the disgraced temple\'s banker, bodyguard, and jailer at once.',
    ],
    're-caused': [
      "The boss's first hold resolved, but the tainted priesthood offered a steadier income, and the temple's silence money now anchors the arrangement.",
    ],
    reformed: [
      'The priesthood was cleansed and the racket died; the boss handed the strongbox to the synod unopened, which no one believed until it was inventoried.',
      "With the clergy's scandal resolved, the boss ended the collections; a racket built on sins already confessed collects nothing.",
    ],
    historicized: [
      'The temple was set in order, but the payments never stopped; the boss collects on a disgrace the town has already forgiven.',
    ],
    'exposed-public': [
      'It is out that the boss bled the tainted temple and guarded it too, and neither the faithful nor the crews like what that made him.',
      "The strongbox is public: the clergy's sins, itemized, with the boss's collection schedule stapled to them.",
    ],
    're-adjudicated': [
      "The syndicate is gone, but the priesthood's taint remains, and the temple's silence money now routes through the boss to new hands.",
    ],
  },
  captured: {
    attributed: [
      'The town thinks the boss owns the offices; the offices know better. He is the syndicate\'s steward here, holding the streets in trust for men who audit him quarterly.',
      'The capture of this town runs through the boss, but not to him; he administers the arrangement for the syndicate above, and his own crews are collateral in it.',
    ],
    're-caused': [
      "The boss's old hold resolved, but the underworld's capture of the offices swallowed him with them; a steward is not consulted about his stewardship.",
    ],
    reformed: [
      'The capture was broken and the boss broke with it; he handed the stewardship ledgers to the magistrates and took his chances with both sides.',
      "With the syndicate's grip broken, the boss came clean; the audited streets were released, and he answers to his own crews again.",
    ],
    historicized: [
      'The capture was broken, but the boss still runs the streets like a steward awaiting audit; the auditors are gone and the posture is not.',
    ],
    'exposed-public': [
      'It is out that the boss held the town for the syndicate, not himself, and every crew that swore to him is renegotiating.',
      "The stewardship is public: the boss's empire was a franchise, and the town has seen the franchise terms.",
    ],
    're-adjudicated': [
      'The syndicate that owned the stewardship is destroyed, but the offices are still captured, and the new holders confirmed the boss in his post.',
    ],
  },
  scandal: {
    attributed: [
      'The scandal made testimony the most valuable thing in town, and the boss sells it both ways: to the law by the name, to the named by the omission.',
      'Half the town would pay to know what the boss knows about the scandal, and the other half pays so no one does; he collects from both halves.',
    ],
    're-caused': [
      "The boss's first hold cleared, but the scandal broke behind it, and dealing its testimony now anchors the arrangement.",
    ],
    reformed: [
      'The scandal burned out and the boss retired the testimony trade; what remained unsold went to the magistrates without a price.',
      'When the scandal settled, the boss ended it; the last buyer of silence got his coin back, and the law got the rest.',
    ],
    historicized: [
      'The scandal is old news, but the boss still deals in its testimony; the market that made it valuable has half-closed.',
    ],
    'exposed-public': [
      'It is out that the boss traded scandal testimony to both sides, and the buyers and the named are comparing invoices.',
      "The testimony ledger is public: the boss priced the town's guilt in both directions, and everyone finds themselves in one column.",
    ],
    're-adjudicated': [
      "The syndicate is broken, but the scandal's economy survives, and the testimony trade has been consolidated under new ownership.",
    ],
  },
};
