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
      'A starved treasury and a trusted keeper: the guildmaster has been lending the common fund to himself, on terms no member ever sees.',
    ],
    're-caused': [
      'What first turned the guildmaster has passed; the short fund turns him now, and every gap in the accounts is called the hard times.',
    ],
    reformed: [
      'The fund recovered and the guildmaster merged the ledgers; the missing dues were restored with interest, quietly but completely.',
      'With the coffers refilled, the guildmaster came clean to the members; the second ledger was put on the table at the general meeting.',
    ],
    historicized: [
      'The fund recovered, but the second ledger never closed; the shortfall that opened it is a story the guildmaster no longer needs.',
    ],
    'exposed-public': [
      "It is public that the guildmaster kept two books while the fund ran dry, and the members are auditing everything back to his election.",
      'The double ledger is out; the guildmaster borrowed from every member at once without asking any of them, and the guild wants the arithmetic.',
    ],
    're-adjudicated': [
      "The syndicate holding the guildmaster is destroyed, but the fund is still short, and the double ledger now balances in someone else's favor.",
    ],
  },
  'chain-starved': {
    attributed: [
      "The routes are broken and honest freight cannot move, so the guildmaster moves the other kind; smugglers' cargo travels under the guild seal, and the seal earns well.",
      'When the supply lines failed, the guildmaster kept the warehouses full the only way left; the manifests are fiction and the fees are real.',
    ],
    're-caused': [
      "The guildmaster's first reason is gone; the broken routes reason for him now, and the sealed contraband keeps the guild's yards busy.",
    ],
    reformed: [
      'The routes were restored and the guildmaster withdrew the seal from the quiet cargo; the manifests describe the freight again.',
      'With the supply lines mended, the guildmaster came clean; the fictional manifests were surrendered to the customs house by his own hand.',
    ],
    historicized: [
      'The routes are mended, but the guild seal still travels on cargo it should not; the broken roads that excused it are paved.',
    ],
    'exposed-public': [
      'It is public that the guild seal covered smuggled freight while the routes were down, and every sealed manifest of the period is suspect.',
      "The customs men have the guildmaster's manifests now, and the fiction is plain; the guild's good name moved contraband for a fee.",
    ],
    're-adjudicated': [
      'The old partner is destroyed, but the routes are still broken, and the sealed cargo trade has found the guildmaster new principals.',
    ],
  },
  depleted: {
    attributed: [
      "The stores are dry and the guildmaster has cornered what remains; the guild reserve sells out the back of the warehouse at four times the posted price.",
      'Scarcity is a market, and the guildmaster owns it: the reserve dwindles in the books and reappears at midnight prices.',
    ],
    're-caused': [
      "The guildmaster's first cause has passed; the dry stores pay him now, and the reserve's back door does the guild's real business.",
    ],
    reformed: [
      'The stores were replenished and the guildmaster shut the back door; the reserve sells at the posted price, and only at the front.',
      'With the scarcity ended, the guildmaster came clean; the midnight sales were accounted and the profit surrendered to the fund.',
    ],
    historicized: [
      "The stores were refilled, but the back door still opens at midnight; the scarcity that built the trade is gone and the trade is not.",
    ],
    'exposed-public': [
      "It is public that the guildmaster sold the reserve out the back while the town went short, and the buyers' names are as damning as his.",
      'The midnight prices are out; the guildmaster made a famine into a franchise, and the hungry are presenting their receipts.',
    ],
    're-adjudicated': [
      'The syndicate is gone, but the stores are still empty, and the back-door trade has passed to new hands with the guildmaster attached.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo forbids the trade the guild lives on, so the guildmaster runs it anyway, under bonded cover; the customs stamps are real, the cargo is not what they say.',
      "Trade is strangled by decree, and the guildmaster has made the decree profitable; contraband moves in bonded crates, and the bond is his signature.",
    ],
    're-caused': [
      'What first held the guildmaster has passed; the embargo holds him now, and each bonded run renews the arrangement.',
    ],
    reformed: [
      'The embargo lifted and the guildmaster retired the false bonds; the crates carry what the stamps say, every one.',
      'When the routes reopened, the guildmaster came clean; the bonded contraband was declared, and the duties paid with interest.',
    ],
    historicized: [
      'The embargo is lifted, but the false-bond channel never closed; the guildmaster keeps it oiled out of habit.',
    ],
    'exposed-public': [
      "It is public that the guildmaster's bonded crates dodged the embargo, and the customs house is opening everything with his signature on it.",
      'The false bonds are out; the guildmaster sold the law a fiction crate by crate, and the ruined merchants who obeyed it are keeping score.',
    ],
    're-adjudicated': [
      'The old paymaster is gone, but the trade is still strangled, and the bonded channel has been inherited by whoever now runs the cargo.',
    ],
  },
  'levied-away': {
    attributed: [
      'The inspectors and escorts marched off with the levy, and the guildmaster has let the weights drift; the scales read light, the tariffs are collected privately, and no one is left to check either.',
      "With the strength levied away, the market polices itself, which is to say the guildmaster polices it; his fees are new, unwritten, and mandatory.",
    ],
    're-caused': [
      "The guildmaster's first cause resolved, but the levy stripped the market of its watchers, and the private tariffs now sustain the arrangement.",
    ],
    reformed: [
      'The companies came home and the guildmaster trued the scales before the first inspector reached the square; the private tariffs were refunded.',
      'When the strength returned, the guildmaster came clean; the drifted weights were confessed and recalibrated under seal.',
    ],
    historicized: [
      'The watchers are back, but the scales never quite trued; the absence that bent them is over and the bend remains.',
    ],
    'exposed-public': [
      'The returned inspectors have weighed the market and found it light; it is public now that the guildmaster taxed the town privately while they were at war.',
      "It is out that the guildmaster's scales drifted the moment the escorts left, and every purchase of the empty season is being reweighed.",
    ],
    're-adjudicated': [
      "The syndicate fell, but the strength is still levied away, and the unwatched market itself now collects the guildmaster's arrangement.",
    ],
  },
  'garrison-drained': {
    attributed: [
      "The roads are unguarded, so the guildmaster pays the bandits a standing toll and banks their takings besides; the caravans pass safe, and his ledger has a page it shows no one.",
      'With the garrison hollow, the guildmaster bought safety from the men who sell it: the road toll goes out as freight costs and comes back as partnership.',
    ],
    're-caused': [
      "The guildmaster's first reason passed, but the garrison hollowed after, and the bandit toll now anchors the arrangement.",
    ],
    reformed: [
      'The garrison was refilled and the guildmaster stopped the toll; the last payment was reported to the new captain with a map of the drop.',
      'With the roads guarded again, the guildmaster came clean; the partnership page was torn out and handed to the magistrates.',
    ],
    historicized: [
      'The roads are patrolled again, but the toll never stopped; the guildmaster pays men he no longer fears out of an arrangement he no longer needs.',
    ],
    'exposed-public': [
      'It is public that the guildmaster paid the road bandits and banked for them too, and every safe caravan of the period reads differently now.',
      "The hidden page is out: tolls, takings, and the guildmaster's tidy hand; the town knows why his freight alone never bled.",
    ],
    're-adjudicated': [
      'The old partners are destroyed, but the garrison is still drained, and the road toll has new collectors who inherited the ledger page.',
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war buys everything the guild can move, and the guildmaster sells to both camps; the manifests say grain, the crates say otherwise, and the profits say nothing at all.',
      "Under the war's pressure the guildmaster has learned the oldest trade arithmetic: two armies pay better than one, and discretion is a line item.",
    ],
    're-caused': [
      "The guildmaster's old cause cleared, but the war pressed in, and provisioning both camps now finances the arrangement.",
    ],
    reformed: [
      'The war receded and the guildmaster closed the second account; one buyer, one manifest, and the crates say what they carry.',
      'With the pressure lifted, the guildmaster came clean about the double custom, and paid the town back its share of the war.',
    ],
    historicized: [
      'The war moved on, but the guildmaster kept both accounts open; the fighting that justified them is done.',
    ],
    'exposed-public': [
      'It is public that the guildmaster provisioned both camps, and each army has learned it fed its enemy through his warehouse.',
      "The double custom is out: the guildmaster's war profits are being counted in the square, against the town's dead.",
    ],
    're-adjudicated': [
      'The syndicate is broken, but the war still presses, and the two-camp trade has been assumed by partners the guildmaster did not choose.',
    ],
  },
  occupation: {
    attributed: [
      "The occupier issues the trade permits now, and the guildmaster holds the best of them; the price was cooperation, and it is paid in reports on every rival's stock.",
      'Commerce under occupation runs on licenses, and the guildmaster collects them like debts; what he gives the occupation office in exchange never appears in the guild minutes.',
    ],
    're-caused': [
      "What first compromised the guildmaster is gone; the occupier's licenses sustain him now, and the reports keep the licenses current.",
    ],
    reformed: [
      'The occupier withdrew and the guildmaster surrendered the privileged permits; the reports he had filed were confessed to the members named in them.',
      'With the occupation ended, the guildmaster came clean; the licenses were burned and the guild elected whether to keep him.',
    ],
    historicized: [
      'The occupier is gone, but the guildmaster still trades on the positions their licenses built; the occupation ended and its advantages compounded.',
    ],
    'exposed-public': [
      "It is public that the guildmaster's permits were paid for in reports on his own members, and the members are reading their files.",
      "Collaboration has a ledger now, and it is the guildmaster's: licenses in one column, betrayed rivals in the other.",
    ],
    're-adjudicated': [
      "The guildmaster's old paymaster is destroyed, but the occupier remains, and the license terms have been reissued unchanged.",
    ],
  },
  'conduct-drift': {
    attributed: [
      "A patron power counts sharp dealing as worship, and the guildmaster has grown devout; every cornered market and broken rival returns to him as blessing.",
      "The guildmaster's greed has a theology now: a patron that rewards the grasping hand, and pays its dividends in luck and standing.",
    ],
    're-caused': [
      "The guildmaster's first cause resolved, but a patron that rewards the deed adopted the arrangement, and its favor compounds like interest.",
    ],
    reformed: [
      "The patron's shadow lifted and the guildmaster eased his grip; unblessed, the cornered markets were released and the rivals made whole.",
      'With the rewarding patron gone, the guildmaster came clean; the deals it had sponsored were unwound at his own cost.',
    ],
    historicized: [
      'The patron is gone, but the guildmaster still deals as it taught; the worship ended and the sharpness stayed.',
    ],
    'exposed-public': [
      "It is public that the guildmaster's ruthlessness was sponsored devotion, and every ruined competitor is being recounted as an offering.",
      'The sponsorship is out: a dark patron paid the guildmaster to grasp, and the town is repricing every bargain it ever struck with him.',
    ],
    're-adjudicated': [
      "The syndicate fell, but the patron that rewards the deed still stands, and the guildmaster's arrangement rolled into its portfolio.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      "The rival faith's mission money moves through the guildmaster's house; it enters as foreign investment and leaves as local piety, and he keeps the exchange fee.",
      'Conversion runs on coin, and the coin runs through the guildmaster; the rival mission banks with him, and his silence is part of the service.',
    ],
    're-caused': [
      "The guildmaster's first reason passed; the rival faith's banking replaced it, and the exchange fees now sustain the arrangement.",
    ],
    reformed: [
      'The rival faith withdrew and the guildmaster closed the accounts; the last mission funds were returned to the border unconverted.',
      'When the conversion pressure broke, the guildmaster came clean; the laundered piety was traced and confessed, deposit by deposit.',
    ],
    historicized: [
      'The rival faith gave up the town, but the accounts never closed; the guildmaster launders for a mission that no longer sends anyone.',
    ],
    'exposed-public': [
      "It is public that the rival mission's money moved through the guildmaster's house, and both congregations are following the deposits.",
      'The accounts are out: foreign faith in, local converts funded, and the guildmaster\'s fee on every transaction between.',
    ],
    're-adjudicated': [
      'The old patron is gone, but the rival faith still presses, and its banking has been transferred to the guildmaster\'s new principals.',
    ],
  },
  secularization: {
    attributed: [
      'The weights-and-measures oath was sworn at an altar nobody visits now, and the guildmaster has recalibrated accordingly; the god who watched the scales has left the market.',
      "With the faith gone cold, the guildmaster's word is worth exactly its enforcement, and he knows the enforcement schedule by heart.",
    ],
    're-caused': [
      "The guildmaster's first cause resolved, but the faith went cold behind it, and with no oath on the scales, the arrangement kept its own weights.",
    ],
    reformed: [
      'The faith revived and the guildmaster re-swore the market oaths; the scales were trued at the altar, publicly, with the old god watching again.',
      'When belief returned, the guildmaster came clean; the faithless-season dealings were listed and made good.',
    ],
    historicized: [
      'The faith warmed again, but the guildmaster never re-swore; the cold market that freed his scales is a memory and the freedom is not.',
    ],
    'exposed-public': [
      'It is public what the guildmaster traded while no god watched the scales, and the reviving congregation is auditing the market first.',
      'The cold-season dealings are out; the guildmaster kept honest weights only for the watched, and the town now knows it was never watched.',
    ],
    're-adjudicated': [
      "The guildmaster's paymaster fell, but the faith is still cold, and no revived oath stands between the arrangement and its habits.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      "The disgraced temple needed its money moved quietly, and the guildmaster moved it; the tithe walks out as trade goods and comes home as clean coin, minus his commission.",
      "The clergy's shame has a banker: the guildmaster, who launders the temple's hush money and holds the receipts as insurance.",
    ],
    're-caused': [
      "The guildmaster's first reason resolved, but the tainted priesthood needed a banker, and the temple's quiet accounts now carry the arrangement.",
    ],
    reformed: [
      'The priesthood was cleansed and the guildmaster closed the quiet accounts; the receipts went to the new hierarch, not the market.',
      "With the clergy's scandal resolved, the guildmaster came clean; the laundered tithe was traced back and restored to the altar.",
    ],
    historicized: [
      "The temple was set in order, but the quiet accounts stayed open; the guildmaster banks a shame that has already been absolved.",
    ],
    'exposed-public': [
      "It is public that the guildmaster laundered the temple's hush money, and the tithe's travels are being mapped in the square.",
      "The quiet accounts are out: the clergy's disgrace funded the guildmaster's commissions, and both ledgers are open to the town.",
    ],
    're-adjudicated': [
      "The syndicate is gone, but the priesthood's taint remains, and the temple's quiet banking has found the guildmaster new oversight.",
    ],
  },
  captured: {
    attributed: [
      "The syndicate holds the guild, and the guildmaster's ledgers do its laundry; stolen goods enter as salvage, tribute leaves as dues, and the books balance beautifully.",
      'The underworld bought the guild from within, and the guildmaster keeps its accounts; his real employer is listed nowhere and paid first.',
    ],
    're-caused': [
      "The guildmaster's old cause resolved, but the underworld holds the guild now, and a bookkeeper it holds does not resign.",
    ],
    reformed: [
      "The capture was broken and the guildmaster opened the real books; the laundry was documented in his own hand, which is what convicted the launderers.",
      "With the syndicate's grip broken, the guildmaster came clean; the tribute line was struck from the dues and the members repaid.",
    ],
    historicized: [
      'The capture was broken, but the guildmaster still keeps the books the way the syndicate liked them; the employer is gone, the method endures.',
    ],
    'exposed-public': [
      "It is public that the guild's books did the underworld's washing, and the guildmaster's beautiful balances are being taken apart line by line.",
      'The capture has a bookkeeper, and the town knows his name; every clean account the guildmaster signed is dirty evidence now.',
    ],
    're-adjudicated': [
      'The syndicate that owned the guild is destroyed, but the offices are still captured, and the new holders kept the guildmaster on the books.',
    ],
  },
  scandal: {
    attributed: [
      'Since the scandal broke, the bribes need banking, and the guildmaster banks them; he holds the escrow between the guilty and their silence, and charges both sides.',
      "The scandal's economy runs through the guildmaster's strongroom: hush money in trust, evidence in the vault, and a fee schedule for each.",
    ],
    're-caused': [
      "The guildmaster's first cause cleared, but the scandal broke behind it, and holding its escrow now sustains the arrangement.",
    ],
    reformed: [
      'The scandal burned out and the guildmaster emptied the strongroom into the magistrates\' hands, deposits and depositors both.',
      'When the scandal settled, the guildmaster came clean; the escrow was dissolved and every hush payment returned to sender, publicly.',
    ],
    historicized: [
      "The scandal is old news, but the strongroom still takes deposits; the panic that opened the service has long since passed.",
    ],
    'exposed-public': [
      "It is public that the guildmaster banked the scandal's bribes, and his depositor list is the town's new reading.",
      "The strongroom is open: hush money, evidence, and the guildmaster's fees, all itemized, all public now.",
    ],
    're-adjudicated': [
      "The syndicate is broken, but the scandal's economy survives, and the escrow business has transferred with the guildmaster inside it.",
    ],
  },
};
