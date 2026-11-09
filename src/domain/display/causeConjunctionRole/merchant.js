/**
 * causeConjunctionRole/merchant.js — the ROLE-TIER conjunction lines for
 * merchant — the guildmaster (ledgers, warehouses, caravans, weights).
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
export const MERCHANT_ROLE_CONTENT = {
  underfunded: {
    attributed: [
      "The guild's common fund runs short, and the guildmaster runs two ledgers; dues arrive in one and leave through the other, and the audit never meets both.",
      'The guild\'s fund is short, and the guildmaster has been quietly borrowing from it on terms no member ever sees.',
    ],
    're-caused': [
      'The guildmaster\'s first reason is gone, but now the guild fund runs short, and every gap in the accounts is blamed on hard times.',
    ],
    reformed: [
      'The fund recovered and the guildmaster merged the ledgers; the missing dues were restored with interest, quietly but completely.',
      'With the coffers refilled, the guildmaster came clean to the members; the second ledger was put on the table at the general meeting.',
    ],
    historicized: [
      'The fund recovered, but the guildmaster never closed the second ledger, and dues still leave through it.',
    ],
    'exposed-public': [
      "It is public that the guildmaster kept two books while the fund ran dry, and members are checking every account since the guildmaster's election.",
      'The double ledger is out: the guildmaster borrowed from every member at once without asking any of them, and the guild wants every sum accounted for.',
    ],
    're-adjudicated': [
      "Whoever held the guildmaster before is gone, but now the fund runs short, and the second ledger pays someone else.",
    ],
  },
  'chain-starved': {
    attributed: [
      "The routes are broken and honest freight cannot move, so the guildmaster moves smugglers' cargo under the guild seal and takes a fee.",
      'When the supply lines failed, the guildmaster kept the warehouses full with smuggled goods and false manifests.',
    ],
    're-caused': [
      "The guildmaster's first reason is gone, but now the supply lines have failed, and smuggled cargo under the guild seal keeps the yards busy.",
    ],
    reformed: [
      'The routes were restored and the guildmaster withdrew the seal from the quiet cargo; the manifests describe the freight again.',
      'With the supply lines mended, the guildmaster came clean; the fictional manifests were surrendered to the customs house by his own hand.',
    ],
    historicized: [
      'The routes are mended, but the guildmaster still puts the guild seal on smugglers\' cargo.',
    ],
    'exposed-public': [
      'It is public that the guild seal covered smuggled freight while the routes were down, and every sealed manifest of the period is suspect.',
      "The customs men have the guildmaster's manifests now, and the fiction is plain; the guild's good name moved contraband for a fee.",
    ],
    're-adjudicated': [
      'Whoever partnered the guildmaster before is gone, but now the routes are broken, and the guildmaster moves sealed cargo for whoever pays.',
    ],
  },
  depleted: {
    attributed: [
      "The stores are dry and the guildmaster has cornered what remains; the guild reserve sells out the back of the warehouse at four times the posted price.",
      'The guild reserve shrinks in the books and turns up at night, sold at famine prices by the guildmaster.',
    ],
    're-caused': [
      "The guildmaster's first reason is gone, but now the stores have run dry, and the back door of the reserve does the guild's real business.",
    ],
    reformed: [
      'The stores were replenished and the guildmaster shut the back door; the reserve sells at the posted price, and only at the front.',
      'With the scarcity ended, the guildmaster came clean; the midnight sales were accounted and the profit surrendered to the fund.',
    ],
    historicized: [
      "The stores were refilled, but the guildmaster still sells the reserve out the back door at midnight.",
    ],
    'exposed-public': [
      "It is public that the guildmaster sold the reserve out the back while the town went short, and the buyers' names are as damning as the guildmaster's.",
      'The midnight prices are out: the guildmaster got rich on the shortage, and the hungry are showing what they paid.',
    ],
    're-adjudicated': [
      'Whoever held the guildmaster before is gone, but now the stores are empty, and the guildmaster runs the back-door trade alone.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo forbids the trade the guild lives on, so the guildmaster runs it anyway, under bonded cover; the customs stamps are real, the cargo is not what they say.',
      "The embargo forbids the guild's trade, so the guildmaster ships contraband in bonded crates and signs the bonds.",
    ],
    're-caused': [
      'The guildmaster\'s first reason is gone, but now an embargo chokes off trade, and every bonded run of contraband pays.',
    ],
    reformed: [
      'The embargo lifted and the guildmaster retired the false bonds; the crates carry what the stamps say, every one.',
      'When the routes reopened, the guildmaster came clean; the bonded contraband was declared, and the duties paid with interest.',
    ],
    historicized: [
      'The embargo has lifted, but the guildmaster still ships contraband under false bonds.',
    ],
    'exposed-public': [
      "It is public that the guildmaster's bonded crates dodged the embargo, and the customs house is opening every crate the guildmaster signed for.",
      'The false bonds are out: the guildmaster lied to the customs house crate by crate, and the ruined merchants who obeyed the embargo are keeping count.',
    ],
    're-adjudicated': [
      'Whoever paid the guildmaster before is gone, but now an embargo chokes off trade, and whoever runs the cargo uses the guildmaster\'s bonded channel.',
    ],
  },
  'levied-away': {
    attributed: [
      'The inspectors and escorts marched off with the levy, and the guildmaster has let the weights drift; the scales read light, the tariffs are collected privately, and no one is left to check either.',
      'With the fighters away at the war, no one polices the market but the guildmaster, who charges fees that are written nowhere.',
    ],
    're-caused': [
      "The guildmaster's first reason is gone, but now the levy has taken the market's watchers to war, and the private tariffs keep coming in.",
    ],
    reformed: [
      'The companies came home and the guildmaster trued the scales before the first inspector reached the square; the private tariffs were refunded.',
      'When the strength returned, the guildmaster came clean; the drifted weights were confessed and recalibrated under seal.',
    ],
    historicized: [
      'The inspectors are back, but the guildmaster\'s scales still read light against every buyer.',
    ],
    'exposed-public': [
      'The returned inspectors have weighed the market and found it light; it is public now that the guildmaster taxed the town privately while they were at war.',
      "It is out that the guildmaster's scales drifted the moment the escorts left, and every purchase of the empty season is being reweighed.",
    ],
    're-adjudicated': [
      "Whoever paid the guildmaster before is gone, but now the levy has taken the watchers to war, and the guildmaster's scales read light.",
    ],
  },
  'garrison-drained': {
    attributed: [
      "The roads are unguarded, so the guildmaster pays the bandits a standing toll and banks their takings besides; the caravans pass safe, and one page of the books is shown to no one.",
      'With the garrison hollow, the guildmaster pays the bandits for safe roads, books it as freight costs, and takes a share of their takings.',
    ],
    're-caused': [
      "The guildmaster's first reason is gone, but now the garrison is hollow, and the guildmaster pays the bandits and shares their takings.",
    ],
    reformed: [
      'The garrison was refilled and the guildmaster stopped the toll; the last payment was reported to the new captain with a map of the drop.',
      'With the roads guarded again, the guildmaster came clean; the partnership page was torn out and handed to the magistrates.',
    ],
    historicized: [
      'The roads are patrolled again, but the guildmaster still pays the bandits their toll.',
    ],
    'exposed-public': [
      'It is public that the guildmaster paid the road bandits and banked for them too, and every safe caravan of the period reads differently now.',
      "The hidden page of tolls and takings is out, and the town knows why only the guildmaster's caravans were never robbed.",
    ],
    're-adjudicated': [
      'Whoever shared the toll before is gone, but now the garrison is hollow, and the guildmaster pays the road toll to whoever works the roads.',
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war buys everything the guild can move, and the guildmaster sells to both sides; the manifests say grain, and the crates hold something else.',
      "Under the war's pressure the guildmaster sells to both armies and charges each one extra to keep quiet.",
    ],
    're-caused': [
      "The guildmaster's first reason is gone, but now the war presses in, and the guildmaster supplies both camps.",
    ],
    reformed: [
      'The war receded and the guildmaster closed the second account; one buyer, one manifest, and the crates say what they carry.',
      'With the pressure lifted, the guildmaster came clean about the double custom, and paid the town back its share of the war.',
    ],
    historicized: [
      'The war has moved on, but the guildmaster still keeps both accounts open and sells to either side.',
    ],
    'exposed-public': [
      'It is public that the guildmaster provisioned both camps, and each army has learned it fed its enemy through the guildmaster\'s warehouse.',
      "The double custom is out: the guildmaster's war profits are being counted in the square, against the town's dead.",
    ],
    're-adjudicated': [
      'Whoever paid the guildmaster before is gone, but now the war presses in, and partners the guildmaster did not choose run the trade with both sides.',
    ],
  },
  occupation: {
    attributed: [
      "The occupier issues the trade permits now, and the guildmaster holds the best of them; the price was cooperation, and it is paid in reports on every rival's stock.",
      'Commerce under occupation runs on licenses, and the guildmaster collects them like debts; what the guildmaster gives the occupation office in exchange never appears in the guild minutes.',
    ],
    're-caused': [
      "The guildmaster's first reason is gone, but now the occupier issues the licenses, and the guildmaster's reports on rivals keep them coming.",
    ],
    reformed: [
      'The occupier withdrew and the guildmaster surrendered the privileged permits; the reports he had filed were confessed to the members named in them.',
      'With the occupation ended, the guildmaster came clean; the licenses were burned and the guild elected whether to keep him.',
    ],
    historicized: [
      'The occupier is gone, but the guildmaster still trades on the positions the occupier\'s licenses built, ahead of every rival.',
    ],
    'exposed-public': [
      "It is public that the guildmaster's permits were paid for in reports on the guild's own members, and the members are reading their files.",
      "Collaboration has a ledger now, and it is the guildmaster's: licenses in one column, betrayed rivals in the other.",
    ],
    're-adjudicated': [
      "Whoever paid the guildmaster before is gone, but now the occupier rules, and its officials renewed the guildmaster's licenses unchanged.",
    ],
  },
  'conduct-drift': {
    attributed: [
      "A dark patron rewards sharp dealing, and every cornered market and every broken rival brings the guildmaster its favor.",
      "The guildmaster's greed has a sponsor: a dark patron that rewards grasping and pays in luck and standing.",
    ],
    're-caused': [
      "The guildmaster's first reason is gone, but now a dark patron rewards the sharp dealing, and its favor keeps growing.",
    ],
    reformed: [
      "The patron's shadow lifted and the guildmaster eased his grip; unblessed, the cornered markets were released and the rivals made whole.",
      'With the rewarding patron gone, the guildmaster came clean; the deals it had sponsored were unwound at his own cost.',
    ],
    historicized: [
      'The patron is gone, but the guildmaster still corners markets and breaks rivals as it taught.',
    ],
    'exposed-public': [
      "It is public that the guildmaster's ruthlessness was sponsored devotion, and every ruined competitor is being recounted as an offering.",
      'The sponsorship is out: a dark patron paid the guildmaster to grasp, and the town is going back over every bargain it struck with the guildmaster.',
    ],
    're-adjudicated': [
      "Whoever held the guildmaster before is gone, but now a dark patron rewards the sharp dealing, and the guildmaster serves it alone.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      "The rival faith's mission money passes through the guildmaster's house to pay local converts, and the guildmaster keeps a fee on each exchange.",
      'Conversion runs on coin, and the coin runs through the guildmaster; the rival mission banks with the guildmaster, and silence is part of the service.',
    ],
    're-caused': [
      "The guildmaster's first reason is gone, but now a rival faith presses in, and the guildmaster banks its money for a fee.",
    ],
    reformed: [
      'The rival faith withdrew and the guildmaster closed the accounts; the last mission funds were returned to the border unconverted.',
      'When the conversion pressure broke, the guildmaster came clean; the laundered piety was traced and confessed, deposit by deposit.',
    ],
    historicized: [
      'The rival faith gave up the town, but the guildmaster never closed its accounts and still moves coin through them.',
    ],
    'exposed-public': [
      "It is public that the rival mission's money moved through the guildmaster's house, and both congregations are following the deposits.",
      'The accounts are out: foreign faith in, local converts funded, and the guildmaster\'s fee on every transaction between.',
    ],
    're-adjudicated': [
      'Whoever paid the guildmaster before is gone, but now a rival faith presses in, and the guildmaster banks its mission money for a fee.',
    ],
  },
  secularization: {
    attributed: [
      'The oath on weights and measures was sworn at an altar nobody visits now, and the guildmaster\'s scales no longer read true.',
      "With the faith gone cold, the guildmaster keeps their word only where someone can enforce it, and knows when the checks come.",
    ],
    're-caused': [
      "The guildmaster's first reason is gone, but now the faith has gone cold, and with no oath on the scales, the guildmaster sets the weights.",
    ],
    reformed: [
      'The faith revived and the guildmaster re-swore the market oaths; the scales were trued at the altar, publicly, with the old god watching again.',
      'When belief returned, the guildmaster came clean; the faithless-season dealings were listed and made good.',
    ],
    historicized: [
      'The faith has warmed again, but the guildmaster never re-swore the market oaths, and the scales still read light.',
    ],
    'exposed-public': [
      'It is public what the guildmaster traded while no god watched the scales, and the reviving congregation is auditing the market first.',
      'The cold-season dealings are out: the guildmaster kept honest weights only when someone was watching, and the town knows it.',
    ],
    're-adjudicated': [
      "Whoever paid the guildmaster before is gone, but now the faith has gone cold, and no oath keeps the guildmaster's scales honest.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      "The disgraced temple needed its money moved quietly, and the guildmaster moved it; the tithe walks out as trade goods and comes home as clean coin, minus the guildmaster's commission.",
      "The clergy's shame has a banker: the guildmaster, who launders the temple's hush money and holds the papers as insurance.",
    ],
    're-caused': [
      "The guildmaster's first reason is gone, but now the priesthood is tainted and needs a banker, and the temple's quiet accounts keep the guildmaster paid.",
    ],
    reformed: [
      'The priesthood was cleansed and the guildmaster closed the quiet accounts; the papers went to the new hierarch, not the market.',
      "With the clergy's scandal resolved, the guildmaster came clean; the laundered tithe was traced back and restored to the altar.",
    ],
    historicized: [
      "The temple was set in order, but the guildmaster still keeps its quiet accounts open and moves the old tithe through them.",
    ],
    'exposed-public': [
      "It is public that the guildmaster laundered the temple's hush money, and the tithe's travels are being mapped in the square.",
      "The quiet accounts are out: the clergy's disgrace funded the guildmaster's commissions, and both ledgers are open to the town.",
    ],
    're-adjudicated': [
      "Whoever held the guildmaster before is gone, but now the priesthood is tainted, and the guildmaster moves the temple's money for it directly.",
    ],
  },
  captured: {
    attributed: [
      "The syndicate holds the guild, and the guildmaster's ledgers do its laundry; stolen goods enter as salvage, tribute leaves as dues, and the books balance beautifully.",
      'The underworld bought the guild from within, and the guildmaster keeps its accounts; the real employer is listed nowhere and paid first.',
    ],
    're-caused': [
      "The guildmaster's first reason is gone, but now the underworld holds the offices, and it does not let its bookkeeper resign.",
    ],
    reformed: [
      "The capture was broken and the guildmaster opened the real books; the laundry was documented in his own hand, which is what convicted the launderers.",
      "With the syndicate's grip broken, the guildmaster came clean; the tribute line was struck from the dues and the members repaid.",
    ],
    historicized: [
      'The capture was broken, but the guildmaster still keeps the books the way the underworld wanted, with stolen goods entered as salvage.',
    ],
    'exposed-public': [
      "It is public that the guild's books did the underworld's washing, and the guildmaster's beautiful balances are being taken apart line by line.",
      'The town knows who kept the underworld\'s books: every clean account the guildmaster signed is evidence now.',
    ],
    're-adjudicated': [
      'Whoever owned the guild before is gone, but now the underworld holds the offices, and whoever holds them kept the guildmaster on.',
    ],
  },
  scandal: {
    attributed: [
      'Since the scandal broke, the bribes need banking, and the guildmaster banks them, holding the escrow between the guilty and their silence and charging both sides.',
      "The scandal's economy runs through the guildmaster's strongroom: hush money in trust, evidence in the vault, and a fee schedule for each.",
    ],
    're-caused': [
      "The guildmaster's first reason is gone, but now a scandal has broken, and holding its hush money keeps the guildmaster paid.",
    ],
    reformed: [
      'The scandal burned out and the guildmaster emptied the strongroom into the magistrates\' hands, deposits and depositors both.',
      'When the scandal settled, the guildmaster came clean; the escrow was dissolved and every hush payment returned to sender, publicly.',
    ],
    historicized: [
      "The scandal has settled, but the guildmaster's strongroom still takes deposits from the guilty.",
    ],
    'exposed-public': [
      "It is public that the guildmaster banked the scandal's bribes, and the town is reading the guildmaster's list of depositors.",
      "The strongroom is open: hush money, evidence, and the guildmaster's fees, all itemized, all public now.",
    ],
    're-adjudicated': [
      "Whoever held the guildmaster before is gone, but now a scandal has broken, and the guildmaster's strongroom holds hush money for whoever pays.",
    ],
  },
};
