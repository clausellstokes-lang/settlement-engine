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
      'The wages come up short every count, so the foreman grew the count; names on the crew tally that swing no hammer, and their pay packets come to the foreman unopened.',
      'The payroll is short, and the foreman bills for crews the yard has never seen and keeps their pay.',
    ],
    're-caused': [
      'The foreman\'s first reason is gone, but now the wages run short, and the ghost names on the tally are called making payroll.',
    ],
    reformed: [
      'The wages were funded and the foreman struck the ghost names himself; the pocketed packets were worked off in unpaid overtime, publicly.',
      'With the payroll made whole, the foreman came clean; the tally was corrected and the real crews repaid what the ghosts had eaten.',
    ],
    historicized: [
      'The wages recovered, but the ghost names are still on the tally, and their pay still goes into the foreman\'s pocket.',
    ],
    'exposed-public': [
      'It is public that the foreman drew pay for phantom crews, and the yard is counting hands against the tally in front of witnesses.',
      'The ghost tally is out: the foreman padded the count while real wages ran short, and the real crews know whose pockets the difference filled.',
      "The crews who went short on wages have counted themselves against the foreman's tally, and the extra names were never there.",
    ],
    're-adjudicated': [
      'Whoever held the foreman before is gone, but now the wages run short, and the ghost names draw pay for whoever runs the payroll.',
    ],
  },
  'chain-starved': {
    attributed: [
      'The materials stopped arriving, but the invoices did not; the foreman bills work against timber and iron that never reached the yard, and splits the fiction with the supplier who signs it.',
      'The supply lines died, but the foreman\'s paperwork did not: goods are received and paid for on paper, and the yard\'s shelves stay bare.',
    ],
    're-caused': [
      "The foreman's first reason is gone, but now the supply lines have failed, and the paper deliveries keep the yard's accounts looking healthy.",
    ],
    reformed: [
      'The supply lines were restored and the foreman canceled the paper deliveries; the split invoices were confessed and the fiction unwound.',
      'With materials flowing again, the foreman came clean; the billed-but-bare shelves were inventoried honestly, and the difference repaid.',
    ],
    historicized: [
      'The wagons run again, but the foreman still bills for deliveries that never come, with the same supplier signing.',
    ],
    'exposed-public': [
      'It is public that the foreman billed for materials that never arrived, and the auditors are matching invoices to empty shelves.',
      'The paper deliveries are out: the yard paid for fiction while the work stalled, and the foreman countersigned every page of it.',
      'The workers who stood idle waiting for materials know now that the foreman signed for deliveries that never came.',
    ],
    're-adjudicated': [
      'Whoever paid the foreman before is gone, but now the supply lines have failed, and the foreman signs false invoices with whoever supplies the yard.',
    ],
  },
  depleted: {
    attributed: [
      'The stockpile is down to its last remnants, and those are leaking; the foreman writes them off as spoiled and sells them across town.',
      'What is left in the stores goes out by night, and the foreman writes it off by day as spoilage.',
    ],
    're-caused': [
      "The foreman's first reason is gone, but now the stores have run dry, and the spoilage write-offs keep the foreman in business.",
    ],
    reformed: [
      'The stockpile was replenished and the foreman closed the spoilage trade; the written-off goods were traced, recovered, and restocked.',
      'With the stores rebuilt, the foreman came clean; the night leakage was confessed, and the spoilage column audited back to honesty.',
    ],
    historicized: [
      'The stores were rebuilt, but the foreman still writes off goods as spoiled and sells them on.',
    ],
    'exposed-public': [
      'It is public that the stockpile\'s spoilage was sold, not spoiled, and the buyers across town are as identifiable as the handwriting.',
      'The spoilage trade is out: the foreman carried off what was written off, and the town went short while the tally balanced.',
      "Families who went short while the stockpile 'spoiled' can see their own food sold across town, in the foreman's hand.",
    ],
    're-adjudicated': [
      'Whoever paid the foreman before is gone, but now the stores have run dry, and the foreman writes off the remnants and sells them to whoever pays.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo closed the export markets, but the yard\'s product still leaves town; the foreman runs it out by night through the old drove roads, and the buyers pay in coin that never sees the books.',
      'The trade ban should have idled the yard, and did not; the foreman found night buyers beyond the line, and the day tally never mentions what the night wagons carry.',
    ],
    're-caused': [
      'The foreman\'s first reason is gone, but now an embargo chokes the markets, and the wagons keep running down the drove roads by night.',
    ],
    reformed: [
      'The embargo lifted and the foreman grounded the night wagons; the off-book coin was surrendered and the drove roads left to the drovers.',
      'When the markets reopened, the foreman came clean; the night buyers were named, and the yard\'s product travels by day again.',
    ],
    historicized: [
      'The markets are open, but the foreman\'s night wagons still roll down the drove roads to the same buyers.',
    ],
    'exposed-public': [
      'It is public that the yard\'s product ran the embargo by night, and the customs men are walking the drove roads with lanterns.',
      'The night runs are out: the foreman sold across the line while the town obeyed it, and the off-book coin is being counted in daylight.',
      "People who obeyed the embargo and lost by it are watching the foreman's off-book coin counted in daylight.",
    ],
    're-adjudicated': [
      "Whoever paid the foreman before is gone, but now an embargo strangles trade, and whoever buys the night runs keeps to the foreman's schedule.",
    ],
  },
  'levied-away': {
    attributed: [
      'The levy rolls are drafted from the foreman\'s crew lists, and the lists have become negotiable; a name left off costs a month\'s wages, and someone else\'s name goes on in its place.',
      'With the muster taking workers by the list, the foreman\'s pen decides who marches; the pen has a price, and the poorest crews cannot pay it.',
    ],
    're-caused': [
      "What first drew the foreman in has passed, but now the levy drafts from the crew lists, and the foreman sells the names on them.",
    ],
    reformed: [
      'The companies came home and the foreman confessed the traded names to the muster office and to the men who marched wrongly.',
      'When the levy ended, the foreman came clean; the list-money was returned, and the substituted men compensated from his own wages.',
    ],
    historicized: [
      'The levy is over, but the foreman still takes money to keep names off the crew lists.',
    ],
    'exposed-public': [
      'It is public that the levy lists were sold at the yard, and the families of the substituted are reading the true draft order.',
      'The pen\'s price is out: the foreman decided who marched by payment, and the men who went in a buyer\'s place have come home asking.',
      "The men who marched in a buyer's place are home and reading the true draft order, with the foreman's price beside it.",
    ],
    're-adjudicated': [
      'Whoever paid the foreman before is gone, but now the levy drafts from the crew lists, and the foreman sells the names to whoever pays now.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'With the garrison hollow, the yards are robbed on a schedule the foreman sets; the foreman arranges the thefts, discovers them loudly, and splits the goods with thieves described badly to the watch.',
      'The unguarded yards lose cargo every week, and the foreman\'s descriptions never catch anyone; the thieves pay the foreman a share.',
    ],
    're-caused': [
      "The foreman's first reason is gone, but now the garrison is hollowed out, and the thefts the foreman arranges keep paying.",
    ],
    reformed: [
      'The garrison was refilled and the foreman ended the schedule; the last arranged theft was reported accurately, accomplices and all.',
      'With the watch restored, the foreman came clean; the forty-sixty splits were confessed, and the recovered goods returned to the yard.',
    ],
    historicized: [
      'The garrison is full again, but the yards still lose cargo on the foreman\'s schedule, and the thieves still pay the foreman a share.',
    ],
    'exposed-public': [
      'It is public that the yard\'s thefts were arranged by the man who reported them, and the watch is re-reading the foreman\'s bad descriptions.',
      'The schedule is out: the foreman had the yards robbed by appointment, and the town knows why nothing was ever recovered.',
      'The watch has learned the foreman who reported each theft from the yard set it up, which is why nothing came back.',
    ],
    're-adjudicated': [
      "Whoever paid the foreman before is gone, but now the garrison is hollowed out, and the yard is still robbed on the foreman's schedule.",
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war orders come with quotas, and the foreman shorts them; every hundredweight of materiel weighs ninety, and the missing tenth sells to whoever the war has made desperate.',
      'Under the war\'s pressure the yard works double and delivers short; the foreman skims the quota at the weighbridge, and the armies count what the paper says.',
    ],
    're-caused': [
      "The foreman's first reason is gone, but now the war presses in, and the short-weighted war orders keep paying the foreman.",
    ],
    reformed: [
      'The war receded and the foreman made the tonnage whole; the skimmed tenth was delivered late and free, with the confession attached.',
      'With the pressure lifted, the foreman came clean; the weighbridge was recalibrated in public and the shortfall repaid.',
    ],
    historicized: [
      'The war has moved on, but the foreman\'s weighbridge still reads light, and the missing tenth still sells.',
    ],
    'exposed-public': [
      'It is public that the war materiel left the yard short-weighted, and the soldiers who fought with the missing tenth are home to hear it.',
      'The skim is out: the foreman shaved the quotas while the walls shook, and the armies are auditing every delivery of the period.',
      'The soldiers who fought short a tenth of their supplies are home, and they know now where that tenth went.',
    ],
    're-adjudicated': [
      "Whoever paid the foreman before is gone, but now the war presses in, and the foreman's weighbridge still reads light on the war orders.",
    ],
  },
  occupation: {
    attributed: [
      'The occupier requisitions labor by the head, and the foreman draws up the list of who is taken and who is spared, and charges to spare a name.',
      'The labor drafts come through the yard, and the foreman has made them a business; the occupier gets its count, and the count is composed of whoever could not pay the foreman.',
    ],
    're-caused': [
      "The foreman's first reason is gone, but now the occupier drafts labor through the yard, and families pay the foreman to be spared.",
    ],
    reformed: [
      'The occupier withdrew and the foreman confessed the draft lists to the taken and their families, and worked their plots himself.',
      'With the occupation ended, the foreman came clean; the sparing fees were returned, and the composed counts owned before the town.',
    ],
    historicized: [
      'The occupier is gone, but the foreman still keeps the draft lists ready, and families still pay to stay off them.',
    ],
    'exposed-public': [
      'It is public that the labor drafts were composed by ability to pay, and the taken are home with the foreman\'s list in hand.',
      'The sparing rate is out: the foreman sold exemption from the occupier\'s drafts, and the poorest carried the count.',
      "The poorest families, who carried the occupier's labour drafts, know now that others paid the foreman to be spared.",
    ],
    're-adjudicated': [
      "Whoever paid the foreman before is gone, but now the occupier drafts the labor, and its officials take the heads from the foreman's lists.",
    ],
  },
  'conduct-drift': {
    attributed: [
      'A dark patron has taken an interest in the yard\'s accidents; scaffolds fail under the foreman\'s rivals with a regularity the patron rewards, and the rewards keep coming.',
      'People who stand in the foreman\'s way meet with accidents, and a dark patron pays the foreman in luck and standing for each one.',
    ],
    're-caused': [
      "The foreman's first reason is gone, but now a patron that rewards the deed has taken up the accidents, and its favor keeps them coming.",
    ],
    reformed: [
      "The patron's shadow lifted and the accidents stopped; the foreman confessed the arranged ones and rebuilt what they had broken.",
      'With the rewarding patron gone, the foreman came clean; the sponsored misfortunes were named, and their survivors compensated first.',
    ],
    historicized: [
      'The patron is gone, but accidents at the yard still fall on the foreman\'s rivals.',
    ],
    'exposed-public': [
      'It is public that the yard\'s accidents were arranged offerings, and every failed scaffold is being re-inspected as a crime scene.',
      'It is out that a dark patron paid for the foreman\'s accidents, and the maimed are telling what happened to them.',
      'The workers maimed at the yard are telling what happened, now that a dark patron is known to have paid for those accidents.',
    ],
    're-adjudicated': [
      "Whoever paid the foreman before is gone, but now a dark patron rewards the deed, and the accidents at the yard happen for its favor.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith pays a placement fee per convert hired, and the foreman hires accordingly; the crew lists tilt toward the mission\'s people, and the tilt is invoiced monthly.',
      'Work is scarce, and the rival mission pays the foreman for every hire who attends its preaching; the foreman checks attendance.',
    ],
    're-caused': [
      "The foreman's first reason is gone, but now a rival faith presses in, and it pays the foreman a fee for each convert hired.",
    ],
    reformed: [
      'The rival faith withdrew and the foreman flattened the lists; hiring went back to the queue, and the placement fees to the poor box.',
      'When the conversion pressure broke, the foreman came clean; the per-soul invoices were confessed and the passed-over hired first.',
    ],
    historicized: [
      'The rival faith has left the town, but the foreman still hires its people first.',
    ],
    'exposed-public': [
      'It is public that hiring at the yard was priced per soul, and the passed-over are comparing their skills to the hired\'s attendance.',
      'The placement fees are out: the foreman retailed the crew lists to the mission, and both congregations are reading the hires.',
      'Workers passed over at the yard are learning that the jobs went to whoever the mission paid the foreman to hire.',
    ],
    're-adjudicated': [
      'Whoever paid the foreman before is gone, but now a rival faith presses in, and it pays the foreman a fee for each convert hired.',
    ],
  },
  secularization: {
    attributed: [
      'The craft oaths were sworn at an altar the town has abandoned, and the foreman has abandoned what they bound; the safety rites are skipped, the materials adulterated, and nothing watches the difference.',
      'With the faith gone cold, the old building oaths bind no one; the foreman mixes short lime and calls it faith enough, and the walls will keep the secret for a generation.',
    ],
    're-caused': [
      "The foreman's first reason is gone, but now the faith has gone cold, the craft oaths bind no one, and the foreman mixes short lime.",
    ],
    reformed: [
      'The faith revived and the foreman re-swore the craft oaths; the adulterated work was torn out and redone at his cost.',
      'When belief returned, the foreman came clean; the skipped rites were confessed, and the short-lime walls rebuilt honest.',
    ],
    historicized: [
      'The faith has warmed again, but the foreman still skips the rites and mixes short lime into every wall.',
    ],
    'exposed-public': [
      'It is public what the foreman skipped while the oaths meant nothing, and the town is sounding its own walls.',
      'The short lime is out: the foreman built cheap while the faith was cold, and the reviving congregation is inspecting every course the foreman laid.',
      'Households are sounding their own walls, because the foreman built cheap while no oath held the work.',
    ],
    're-adjudicated': [
      "Whoever paid the foreman before is gone, but now the faith has gone cold, and no oath stops the foreman's short work.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The disgraced temple built in a hurry once, and the foreman kept the delivery records; the stone that went missing from that job is the foreman\'s silence to sell, and the temple buys it quarterly.',
      'The foreman knows where the temple\'s building fund actually went, and the tainted clergy know it; the foreman\'s invoices to them run double, and are paid without reading.',
    ],
    're-caused': [
      "The foreman's first reason is gone, but now the priesthood is tainted, and the double invoices to the temple keep the foreman's income steady.",
    ],
    reformed: [
      'The priesthood was cleansed and the foreman surrendered the delivery records; the double invoices were refunded to the altar.',
      "With the clergy's scandal resolved, the foreman came clean; the quarterly silence was confessed, and the missing stone accounted.",
    ],
    historicized: [
      'The temple was set in order, but the foreman still sends it double invoices, and they are still paid without reading.',
    ],
    'exposed-public': [
      'It is public that the foreman billed the temple double for silence about its stone, and both sets of records are being read together.',
      'The delivery records are out: the temple\'s missing stone, the foreman\'s knowledge of it, and the invoices that priced the knowing.',
      "The congregation has seen the temple's missing stone in the foreman's delivery records, and what the foreman charged to stay quiet.",
    ],
    're-adjudicated': [
      "Whoever paid the foreman before is gone, but now the priesthood is tainted, and the temple pays the foreman's double invoices.",
    ],
  },
  captured: {
    attributed: [
      'The syndicate moves its goods through the yard, and the foreman\'s tallies make room; cargo enters, is counted, and leaves lighter, and the count never changes.',
      'The underworld holds the yards the way it holds the offices; the foreman\'s manifest says what they need it to say, and the difference travels in their wagons.',
    ],
    're-caused': [
      "The foreman's first reason is gone, but now the underworld holds the offices, and the foreman counts what the underworld says to count.",
    ],
    reformed: [
      'The capture was broken and the foreman produced the true tallies; the vanished cargo was traced through his own corrected count.',
      "With the syndicate's grip broken, the foreman came clean; the accommodating manifests were confessed and the yard's books trued.",
    ],
    historicized: [
      'The underworld\'s hold is broken, but the foreman\'s tallies still leave room for cargo no one counts.',
    ],
    'exposed-public': [
      'It is public that the yard\'s counts covered the syndicate\'s cargo, and the manifests are being reconciled in front of the town.',
      'The accommodating tallies are out: the foreman counted for the underworld, and the vanished freight has a paper trail at last.',
      "Merchants whose freight vanished through the yard are reading the manifests and finding the underworld's cargo in the counts.",
    ],
    're-adjudicated': [
      "Whoever used the yard before is gone, but now the underworld holds the offices, and the foreman's tallies leave room for its cargo.",
    ],
  },
  scandal: {
    attributed: [
      'Since the scandal broke, things need moving that must not be seen moving, and the foreman\'s wagons move them; crates travel under the yard\'s ordinary freight, and the fee travels in advance.',
      "The scandal's evidence, its valuables, and once or twice its witnesses have all ridden the foreman's wagons, because no one searches them, and the frightened pay the foreman for that.",
    ],
    're-caused': [
      "The foreman's first reason is gone, but now a scandal has broken, and moving its secrets in the foreman's wagons pays well.",
    ],
    reformed: [
      'The scandal burned out and the foreman grounded the discreet freight; the carried crates were named to the court, routes and all.',
      'When the scandal settled, the foreman came clean; the advance fees were surrendered, and the wagons went back to ordinary loads.',
    ],
    historicized: [
      'The scandal has settled, but the foreman\'s wagons still carry crates that must not be seen.',
    ],
    'exposed-public': [
      'It is public that the scandal\'s secrets traveled in the yard\'s wagons, and the routes are being retraced crate by crate.',
      'It is out that the foreman hauled away whatever the frightened needed gone, under manifests that never looked false.',
      "The people the scandal frightened paid to have things hauled away in the foreman's wagons, and the routes are being followed now.",
    ],
    're-adjudicated': [
      "Whoever paid the foreman before is gone, but now a scandal has broken, and whoever needs something hidden pays the foreman's rates.",
    ],
  },
};
