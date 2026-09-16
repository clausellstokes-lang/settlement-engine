/**
 * causeConjunctionRole/laborResource.js — the ROLE-TIER conjunction lines for
 * labor_resource — the foreman (crews, quotas, tallies, the yards).
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
export const LABOR_RESOURCE_ROLE_CONTENT = {
  underfunded: {
    attributed: [
      'The wages come up short every count, so the foreman grew the count; names on the crew tally that swing no hammer, and their pay packets come to him unopened.',
      'A starved payroll and a creative tally: the foreman bills for crews the yard has never seen, and the difference between paper and men is his margin.',
    ],
    're-caused': [
      'What first bent the foreman has passed; the short wages bend him now, and the ghost names on the tally are called making payroll.',
    ],
    reformed: [
      'The wages were funded and the foreman struck the ghost names himself; the pocketed packets were worked off in unpaid overtime, publicly.',
      'With the payroll made whole, the foreman came clean; the tally was corrected and the real crews repaid what the ghosts had eaten.',
    ],
    historicized: [
      'The wages recovered, but the ghosts still swing no hammers and still draw pay; the shortfall that hired them is old news.',
    ],
    'exposed-public': [
      'It is public that the foreman drew pay for phantom crews, and the yard is counting hands against the tally in front of witnesses.',
      'The ghost tally is out: the foreman padded the count while real wages ran short, and the real crews know whose pockets the difference filled.',
    ],
    're-adjudicated': [
      'The syndicate holding the foreman is destroyed, but the wages are still short, and the ghost tally now pays out to the shortfall\'s new owners.',
    ],
  },
  'chain-starved': {
    attributed: [
      'The materials stopped arriving, but the invoices did not; the foreman bills work against timber and iron that never reached the yard, and splits the fiction with the supplier who signs it.',
      'The supply lines died and the foreman\'s paperwork survived; goods are received on paper, worked on paper, and paid in coin, and the yard\'s real shelves stay bare.',
    ],
    're-caused': [
      "The foreman's first reason is gone; the dead supply lines reason for him now, and the paper deliveries keep the yard's accounts breathing.",
    ],
    reformed: [
      'The supply lines were restored and the foreman canceled the paper deliveries; the split invoices were confessed and the fiction unwound.',
      'With materials flowing again, the foreman came clean; the billed-but-bare shelves were inventoried honestly, and the difference repaid.',
    ],
    historicized: [
      'The wagons run again, but the paper deliveries never stopped; the shortage that invented them is supplied.',
    ],
    'exposed-public': [
      'It is public that the foreman billed for materials that never arrived, and the auditors are matching invoices to empty shelves.',
      'The paper deliveries are out: the yard paid for fiction while the work stalled, and the foreman countersigned every page of it.',
    ],
    're-adjudicated': [
      'The old partners are destroyed, but the supply lines are still cut, and the invoice fiction has found the foreman new co-signers.',
    ],
  },
  depleted: {
    attributed: [
      'The stockpile ran down to remnants, and the remnants have been leaking; the foreman marks the losses to spoilage and rot, and the spoilage sells remarkably well across town.',
      'What is left in the stores moves out by night and is written off by day; the foreman\'s spoilage column has become the busiest line in the ledger.',
    ],
    're-caused': [
      "The foreman's first cause has passed; the emptied stockpile reasons for him now, and the spoilage column carries the arrangement.",
    ],
    reformed: [
      'The stockpile was replenished and the foreman closed the spoilage trade; the written-off goods were traced, recovered, and restocked.',
      'With the stores rebuilt, the foreman came clean; the night leakage was confessed, and the spoilage column audited back to honesty.',
    ],
    historicized: [
      'The stores were rebuilt, but the spoilage column still runs busy; the scarcity that opened the trade has ended.',
    ],
    'exposed-public': [
      'It is public that the stockpile\'s spoilage was sold, not spoiled, and the buyers across town are as identifiable as the handwriting.',
      'The spoilage trade is out: the foreman wrote off what he carried off, and the town went short while the ledger balanced.',
    ],
    're-adjudicated': [
      'The syndicate is gone, but the stockpile is still bare, and the write-off trade has been inherited by whoever now moves the remnants.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo closed the export markets, but the yard\'s product still leaves town; the foreman runs it out by night through the old drove roads, and the buyers pay in coin that never sees the books.',
      'The trade ban should have idled the yard, and did not; the foreman found night buyers beyond the line, and the day tally never mentions what the night wagons carry.',
    ],
    're-caused': [
      'What first held the foreman has passed; the embargo holds him now, and each night run down the drove roads renews the arrangement.',
    ],
    reformed: [
      'The embargo lifted and the foreman grounded the night wagons; the off-book coin was surrendered and the drove roads left to the drovers.',
      'When the markets reopened, the foreman came clean; the night buyers were named, and the yard\'s product travels by day again.',
    ],
    historicized: [
      'The markets are open, but the night wagons still roll; the embargo that made them profitable is repealed.',
    ],
    'exposed-public': [
      'It is public that the yard\'s product ran the embargo by night, and the customs men are walking the drove roads with lanterns.',
      'The night runs are out: the foreman sold across the line while the town obeyed it, and the off-book coin is being counted in daylight.',
    ],
    're-adjudicated': [
      'The old buyers are destroyed, but the trade is still strangled, and the night-run route has new customers holding the foreman\'s schedule.',
    ],
  },
  'levied-away': {
    attributed: [
      'The levy rolls are drafted from the foreman\'s crew lists, and the lists have become negotiable; a name left off costs a month\'s wages, and someone else\'s name goes on in its place.',
      'With the muster taking workers by the list, the foreman\'s pen decides who marches; the pen has a price, and the poorest crews cannot pay it.',
    ],
    're-caused': [
      "The foreman's first cause resolved, but the levy keeps drafting from his lists, and the negotiable names now sustain the arrangement.",
    ],
    reformed: [
      'The companies came home and the foreman confessed the traded names to the muster office and to the men who marched wrongly.',
      'When the levy ended, the foreman came clean; the list-money was returned, and the substituted men compensated from his own wages.',
    ],
    historicized: [
      'The levy is disbanded, but the foreman\'s lists are still negotiable; the muster that priced them is over.',
    ],
    'exposed-public': [
      'It is public that the levy lists were sold at the yard, and the families of the substituted are reading the true draft order.',
      'The pen\'s price is out: the foreman decided who marched by payment, and the men who went in a buyer\'s place have come home asking.',
    ],
    're-adjudicated': [
      'The syndicate fell, but the levy still drafts from the lists, and the name trade has been re-let with the foreman\'s pen included.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'With the garrison hollow, the yards are robbed on schedule, and the schedule is the foreman\'s; he arranges the thefts, discovers them loudly, and splits the goods with the thieves he describes badly to the watch.',
      'The unguarded yards lose cargo every week, and the foreman\'s descriptions never catch anyone; the losses are real, the investigations are theater, and the split is forty-sixty.',
    ],
    're-caused': [
      "The foreman's first reason passed, but the garrison hollowed after, and the scheduled thefts now anchor the arrangement.",
    ],
    reformed: [
      'The garrison was refilled and the foreman ended the schedule; the last arranged theft was reported accurately, accomplices and all.',
      'With the watch restored, the foreman came clean; the forty-sixty splits were confessed, and the recovered goods returned to the yard.',
    ],
    historicized: [
      'The garrison stands full again, but the yards still lose cargo on schedule; the hollowness that started it is repaired.',
    ],
    'exposed-public': [
      'It is public that the yard\'s thefts were arranged by the man who reported them, and the watch is re-reading the foreman\'s bad descriptions.',
      'The schedule is out: the foreman robbed his own yards by appointment, and the town knows why nothing was ever recovered.',
    ],
    're-adjudicated': [
      'The old accomplices are destroyed, but the garrison is still drained, and the theft schedule has new partners holding the foreman\'s share.',
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war orders come with quotas, and the foreman shorts them; every hundredweight of materiel weighs ninety, and the missing tenth sells to whoever the war has made desperate.',
      'Under the war\'s pressure the yard works double and delivers short; the foreman skims the quota at the weighbridge, and the armies count what the paper says.',
    ],
    're-caused': [
      "The foreman's old cause cleared, but the war pressed in, and the shorted quotas now finance the arrangement.",
    ],
    reformed: [
      'The war receded and the foreman made the tonnage whole; the skimmed tenth was delivered late and free, with the confession attached.',
      'With the pressure lifted, the foreman came clean; the weighbridge was recalibrated in public and the shortfall repaid.',
    ],
    historicized: [
      'The war moved on, but the weighbridge still reads light; the quotas that taught it are canceled.',
    ],
    'exposed-public': [
      'It is public that the war materiel left the yard short-weighted, and the soldiers who fought with the missing tenth are home to hear it.',
      'The skim is out: the foreman shaved the quotas while the walls shook, and the armies are auditing every delivery of the period.',
    ],
    're-adjudicated': [
      'The syndicate is broken, but the war still presses, and the quota skim has been assumed by new hands at the weighbridge.',
    ],
  },
  occupation: {
    attributed: [
      'The occupier requisitions labor by the head, and the foreman supplies the heads; who is taken and who is spared is his list to draft, and sparing has a rate.',
      'The labor drafts come through the yard, and the foreman has made them a business; the occupier gets its count, and the count is composed of whoever could not pay him.',
    ],
    're-caused': [
      "What first compromised the foreman is gone; the occupier's labor drafts sustain the arrangement now, and the sparing rate keeps collecting.",
    ],
    reformed: [
      'The occupier withdrew and the foreman confessed the draft lists to the taken and their families, and worked their plots himself.',
      'With the occupation ended, the foreman came clean; the sparing fees were returned, and the composed counts owned before the town.',
    ],
    historicized: [
      'The occupier is gone, but the foreman still keeps the draft lists current; the requisitions they fed have ended.',
    ],
    'exposed-public': [
      'It is public that the labor drafts were composed by ability to pay, and the taken are home with the foreman\'s list in hand.',
      'The sparing rate is out: the foreman sold exemption from the occupier\'s drafts, and the poorest carried the count.',
    ],
    're-adjudicated': [
      "The foreman's old paymaster is destroyed, but the occupier remains, and the draft lists have a new requisitioner and the same clerk.",
    ],
  },
  'conduct-drift': {
    attributed: [
      'A dark patron has taken an interest in the yard\'s accidents; scaffolds fail under the foreman\'s rivals with a regularity the patron rewards, and the rewards keep coming.',
      'The foreman\'s obstacles meet with misfortune, and the misfortune is sponsored; a patron that prizes the arranged accident pays out in luck and standing.',
    ],
    're-caused': [
      "The foreman's first cause resolved, but a patron that rewards the deed adopted the accidents, and its favor now schedules them.",
    ],
    reformed: [
      "The patron's shadow lifted and the accidents stopped; the foreman confessed the arranged ones and rebuilt what they had broken.",
      'With the rewarding patron gone, the foreman came clean; the sponsored misfortunes were named, and their survivors compensated first.',
    ],
    historicized: [
      'The patron is gone, but the yard\'s accidents still choose their victims; the sponsorship ended and the scheduling did not.',
    ],
    'exposed-public': [
      'It is public that the yard\'s accidents were arranged offerings, and every failed scaffold is being re-inspected as a crime scene.',
      'The sponsorship is out: a dark patron paid for the foreman\'s misfortunes, and the maimed are recounting their luck.',
    ],
    're-adjudicated': [
      "The syndicate fell, but the patron that rewards the deed still stands, and the accident calendar passed into its keeping.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith pays a placement fee per convert hired, and the foreman hires accordingly; the crew lists tilt toward the mission\'s people, and the tilt is invoiced monthly.',
      'Work is scarce and the foreman sells it twice: once as wages, once as souls; the rival mission pays him for every hire who attends their preaching, and attendance is checked.',
    ],
    're-caused': [
      "The foreman's first reason passed; the rival faith's placement fees replaced it, and the tilted crew lists keep earning them.",
    ],
    reformed: [
      'The rival faith withdrew and the foreman flattened the lists; hiring went back to the queue, and the placement fees to the poor box.',
      'When the conversion pressure broke, the foreman came clean; the per-soul invoices were confessed and the passed-over hired first.',
    ],
    historicized: [
      'The rival faith gave up the town, but the crew lists still tilt; the fees that tilted them stopped arriving.',
    ],
    'exposed-public': [
      'It is public that hiring at the yard was priced per soul, and the passed-over are comparing their skills to the hired\'s attendance.',
      'The placement fees are out: the foreman retailed the crew lists to the mission, and both congregations are reading the hires.',
    ],
    're-adjudicated': [
      'The old patron is gone, but the rival faith still presses, and the placement fees have been re-funded through new intermediaries.',
    ],
  },
  secularization: {
    attributed: [
      'The craft oaths were sworn at an altar the town has abandoned, and the foreman has abandoned what they bound; the safety rites are skipped, the materials adulterated, and nothing watches the difference.',
      'With the faith gone cold, the old building oaths bind no one; the foreman mixes short lime and calls it faith enough, and the walls will keep the secret for a generation.',
    ],
    're-caused': [
      "The foreman's first cause resolved, but the faith went cold behind it, and with the craft oaths dead, the shortcuts simply continued.",
    ],
    reformed: [
      'The faith revived and the foreman re-swore the craft oaths; the adulterated work was torn out and redone at his cost.',
      'When belief returned, the foreman came clean; the skipped rites were confessed, and the short-lime walls rebuilt honest.',
    ],
    historicized: [
      'The faith warmed again, but the shortcuts stayed; the cold season that excused them has passed and the walls stand as they were built.',
    ],
    'exposed-public': [
      'It is public what the foreman skipped while the oaths meant nothing, and the town is sounding its own walls.',
      'The short lime is out: the foreman built cheap under a cold heaven, and the reviving congregation is inspecting every course he laid.',
    ],
    're-adjudicated': [
      "The foreman's paymaster fell, but the faith is still cold, and no revived oath stands between the yard and its shortcuts.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The disgraced temple built in a hurry once, and the foreman kept the delivery records; the stone that went missing from that job is his silence to sell, and the temple buys it quarterly.',
      'The foreman knows where the temple\'s building fund actually went, and the tainted clergy know he knows; his invoices to them run double, and are paid without reading.',
    ],
    're-caused': [
      "The foreman's first reason resolved, but the tainted priesthood offered a steadier income, and the double invoices now carry the arrangement.",
    ],
    reformed: [
      'The priesthood was cleansed and the foreman surrendered the delivery records; the double invoices were refunded to the altar.',
      "With the clergy's scandal resolved, the foreman came clean; the quarterly silence was confessed, and the missing stone accounted.",
    ],
    historicized: [
      'The temple was set in order, but the double invoices still go out; the disgrace they billed against is absolved.',
    ],
    'exposed-public': [
      'It is public that the foreman billed the temple double for silence about its stone, and both sets of records are being read together.',
      'The delivery records are out: the temple\'s missing stone, the foreman\'s knowledge of it, and the invoices that priced the knowing.',
    ],
    're-adjudicated': [
      "The syndicate is gone, but the priesthood's taint remains, and the silence invoices have been assumed by new collectors.",
    ],
  },
  captured: {
    attributed: [
      'The syndicate moves its goods through the yard, and the foreman\'s tallies make room; cargo enters, is counted, and leaves lighter, and the count never changes.',
      'The underworld holds the yards the way it holds the offices; the foreman\'s manifest says what they need it to say, and the difference travels in their wagons.',
    ],
    're-caused': [
      "The foreman's old cause resolved, but the underworld holds the yards now, and a tally-keeper it holds counts what he is told.",
    ],
    reformed: [
      'The capture was broken and the foreman produced the true tallies; the vanished cargo was traced through his own corrected count.',
      "With the syndicate's grip broken, the foreman came clean; the accommodating manifests were confessed and the yard's books trued.",
    ],
    historicized: [
      'The capture was broken, but the tallies still leave room; the wagons that used it have new owners and the habit waits for them.',
    ],
    'exposed-public': [
      'It is public that the yard\'s counts covered the syndicate\'s cargo, and the manifests are being reconciled in front of the town.',
      'The accommodating tallies are out: the foreman counted for the underworld, and the vanished freight has a paper trail at last.',
    ],
    're-adjudicated': [
      'The syndicate that used the yard is destroyed, but the offices are still captured, and the new holders found the tallies already accommodating.',
    ],
  },
  scandal: {
    attributed: [
      'Since the scandal broke, things need moving that must not be seen moving, and the foreman\'s wagons move them; crates travel under the yard\'s ordinary freight, and the fee travels in advance.',
      'The scandal\'s evidence, its valuables, and once or twice its witnesses have all ridden the foreman\'s wagons; his freight is beyond suspicion, which is exactly what the frightened are paying for.',
    ],
    're-caused': [
      "The foreman's first cause cleared, but the scandal broke behind it, and the discreet freight now sustains the arrangement.",
    ],
    reformed: [
      'The scandal burned out and the foreman grounded the discreet freight; the carried crates were named to the court, routes and all.',
      'When the scandal settled, the foreman came clean; the advance fees were surrendered, and the wagons went back to ordinary loads.',
    ],
    historicized: [
      'The scandal is old news, but the discreet freight still rides; the fear that shipped it has faded.',
    ],
    'exposed-public': [
      'It is public that the scandal\'s secrets traveled in the yard\'s wagons, and the routes are being retraced crate by crate.',
      'The discreet freight is out: the foreman hauled what the frightened needed vanished, and the manifests never once lied plainly enough to catch.',
    ],
    're-adjudicated': [
      "The syndicate is broken, but the scandal's economy survives, and the discreet freight has new shippers holding the foreman's rates.",
    ],
  },
};
