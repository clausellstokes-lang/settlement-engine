/**
 * causeConjunctionRole/religious.js — the ROLE-TIER conjunction lines for
 * religious — the priest (altar, tithes, rites, congregation).
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
export const RELIGIOUS_ROLE_CONTENT = {
  underfunded: {
    attributed: [
      'The tithes stopped covering the temple, so the priest put the rites to work; blessings have prices now, burials have tiers, and the altar plate is thinner than it was.',
      'A starved temple and a resourceful priest: the sacraments earn their keep these days, and the poorest wait longest at the font.',
    ],
    're-caused': [
      'What first bent the priest has passed; the starved tithe box bends him now, and every priced sacrament is called keeping the roof on.',
    ],
    reformed: [
      'The tithes recovered and the priest struck the price list; the rites are free again, and the pawned plate was redeemed first.',
      'With the temple funded, the priest came clean from the pulpit; what the empty box had excused was named and ended.',
    ],
    historicized: [
      'The tithes recovered, but the price list never came down; the shortfall that wrote it is long since made good.',
    ],
    'exposed-public': [
      'It is public that the priest priced the sacraments against the empty tithe box, and the families who paid for grace want it back.',
      "The temple's fee schedule is out, in the priest's own hand, and the congregation is learning what its souls were billed.",
    ],
    're-adjudicated': [
      'The syndicate holding the priest is destroyed, but the tithes are still short, and the priced rites now answer to the shortfall alone.',
    ],
  },
  'chain-starved': {
    attributed: [
      'Incense, oil, candles, wine: the sacred stores travel roads that no longer exist, so the priest buys from men who never use roads, and owes them accordingly.',
      'The altar cannot go dark, the priest reasons, and so it does not; the supplies arrive by night, and the suppliers take their payment in the temple\'s discretion.',
    ],
    're-caused': [
      "The priest's first reason is gone; the dead supply roads reason for him now, and the night suppliers keep the altar lit on their own terms.",
    ],
    reformed: [
      'The supply roads reopened and the priest paid the night men off in coin, refused their discount, and bought at the market like anyone.',
      'With the routes restored, the priest came clean; the debts to the quiet suppliers were confessed and settled in the open.',
    ],
    historicized: [
      'The roads are open again, but the night deliveries continue; the shortage that began them is a story the priest tells no one.',
    ],
    'exposed-public': [
      'It is public that the altar was provisioned by smugglers, and what the temple paid them in discretion is being guessed at loudly.',
      "The night deliveries are out; the priest kept the candles lit with contraband, and the congregation is asking what else came in those crates.",
    ],
    're-adjudicated': [
      'The old suppliers are destroyed, but the roads are still dead, and whoever moves goods by night now holds the temple\'s account.',
    ],
  },
  depleted: {
    attributed: [
      'The alms store is empty, and the priest decides who starves slowest; relief follows loyalty now, and the loyal are learning to advertise.',
      'Charity ran dry, and what trickles still trickles by favor; the priest keeps the list, and the list has a price of admission.',
    ],
    're-caused': [
      "The priest's first cause has passed; the empty alms store reasons for him now, and every favored ration buys the temple something back.",
    ],
    reformed: [
      'The alms store was refilled and the priest burned the list; relief goes by need again, beginning with those the list had skipped.',
      'With the stores replenished, the priest came clean; the favored rations were confessed at service, and the temple fasted in answer.',
    ],
    historicized: [
      'The alms recovered, but the list survived; the priest still feeds by favor in a town that no longer starves.',
    ],
    'exposed-public': [
      'It is public that the priest fed the loyal first while the alms ran dry, and the hungry remember the sermons about charity.',
      "The list is out, in the priest's hand: who ate, who waited, and what the eating cost them in obedience.",
    ],
    're-adjudicated': [
      'The syndicate is gone, but the alms are still dry, and stewardship of the little that remains has assumed the priest\'s arrangement.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo made smuggling a sin the whole town commits, and the priest sells the absolution; the night runners are blessed before they ride, for a share of the cargo.',
      'Trade is strangled and the temple has adapted: contraband leaves town under a benediction, and the priest\'s cellar holds his percentage.',
    ],
    're-caused': [
      'What first held the priest has passed; the embargo holds him now, and each blessed run renews the temple\'s share.',
    ],
    reformed: [
      'The embargo lifted and the priest stopped blessing the night runs; the cellar\'s percentage went to the poor box, all of it.',
      'When trade reopened, the priest came clean; the benedictions over contraband were confessed, and the runners lost their chaplain.',
    ],
    historicized: [
      'The embargo is lifted, but the night runners still get their blessing; the strangled trade that excused it is done.',
    ],
    'exposed-public': [
      'It is public that the priest blessed the smugglers and took his tithe of the cargo, and the customs men are quoting his benedictions back to him.',
      "The temple's share of the contraband is out, and the congregation has learned what the night riders paid for their god's goodwill.",
    ],
    're-adjudicated': [
      'The old partners are destroyed, but the trade is still strangled, and the blessing trade has found the priest new riders.',
    ],
  },
  'levied-away': {
    attributed: [
      'The men are away at war and their families pray hard; the priest has priced the praying, and the estates of those who fall pass through his hands with fees attached.',
      'With the strength levied away, the temple is fuller and richer than ever; the priest bills the fear, and probate for the fallen has become his best season.',
    ],
    're-caused': [
      "The priest's first cause resolved, but the levy filled his pews with the fearful, and their fees now sustain the arrangement.",
    ],
    reformed: [
      'The companies came home and the priest returned the fear-bought fees; the prayers for the absent are free again, said daily, unbilled.',
      'When the strength returned, the priest came clean; the probate fees were restored to the widows, with the accounting read aloud.',
    ],
    historicized: [
      'The men are home, but the priest still bills the praying; the war that filled the fee box has ended.',
    ],
    'exposed-public': [
      'It is public that the priest priced prayers for the levied and skimmed the estates of the fallen, and the returned soldiers are at his door.',
      "The probate ledger is out: the priest fed on the war's widows, and the town has the itemized grief.",
    ],
    're-adjudicated': [
      'The syndicate fell, but the strength is still levied away, and the trade in fear and probate now runs to new beneficiaries.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'With the garrison hollow, the temple hired its own protection, and the protectors were not chosen for their piety; the priest pays them in sanctuary, and asks nothing about their days.',
      'The temple needed guarding and the watch could not guard it, so the priest found men who could; their wages are silence and a locked crypt no one inspects.',
    ],
    're-caused': [
      "The priest's first reason passed, but the garrison hollowed after, and the temple's dubious guardians now hold the arrangement in place.",
    ],
    reformed: [
      'The garrison was refilled and the priest dismissed the hired men; the crypt was opened for inspection the same day.',
      'With the ranks restored, the priest came clean; the sanctuary debts were confessed and the guardians handed to the law.',
    ],
    historicized: [
      'The garrison stands full again, but the hired men still keep the temple; the danger that engaged them has passed.',
    ],
    'exposed-public': [
      'It is public that the temple\'s guards were bought with sanctuary and silence, and the crypt they kept locked has been opened.',
      "The arrangement is out: the priest sheltered armed men from the law in exchange for their protection, and the congregation is counting the nights it prayed beside them.",
    ],
    're-adjudicated': [
      'The old paymaster is destroyed, but the garrison is still drained, and the temple\'s protection has been re-let to harder men.',
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war fills the pews with the frightened, and the priest has raised his prices to match; salvation is a seller\'s market, and the offertory has never been heavier.',
      'Under the war\'s pressure the temple sells certainty: indulgences for soldiers, guarantees for mothers, and the priest banks the fear nightly.',
    ],
    're-caused': [
      "The priest's old cause cleared, but the war pressed in, and the fear-fattened offertory now feeds the arrangement.",
    ],
    reformed: [
      'The war receded and the priest emptied the fear-money into relief for the town it was taken from.',
      'With the pressure lifted, the priest came clean; the wartime guarantees were renounced from the pulpit, and the offerings returned.',
    ],
    historicized: [
      'The war moved on, but the wartime prices stayed on the rites; the fear that set them has gone quiet.',
    ],
    'exposed-public': [
      'It is public that the priest priced salvation by the war\'s fear, and the families who bought guarantees for their dead are outside.',
      "The wartime offertory is out: the priest harvested the siege, and the survivors are comparing what they paid against what they got.",
    ],
    're-adjudicated': [
      'The syndicate is broken, but the war still presses, and the trade in fear has continued under new management with the priest retained.',
    ],
  },
  occupation: {
    attributed: [
      'The occupier lets the temple stand, and the sermons pay the rent; the priest preaches patience, submission, and the sinfulness of resistance, on schedule.',
      'The temple is open because the priest is useful; the occupier writes no sermons, but somehow the sermons always suit them.',
    ],
    're-caused': [
      "What first compromised the priest is gone; the occupier's tolerance sustains the temple now, and the sermons keep earning it.",
    ],
    reformed: [
      'The occupier withdrew and the priest preached the sermon he had swallowed the whole occupation, and named what the others had cost.',
      'With the occupation ended, the priest came clean; the scheduled sermons were confessed as the price of the open door.',
    ],
    historicized: [
      'The occupier is gone, but the priest still preaches as if they were listening; the tolerance that shaped the sermons expired.',
    ],
    'exposed-public': [
      'It is public that the pulpit preached to the occupier\'s order, and the congregation is re-hearing every sermon about patience.',
      "The arrangement is out: the temple stayed open on submission preached as scripture, and the town knows whose scripture it was.",
    ],
    're-adjudicated': [
      "The priest's old paymaster is destroyed, but the occupier remains, and the pulpit's terms have been renewed by their administration.",
    ],
  },
  'conduct-drift': {
    attributed: [
      'The patron the priest serves rewards what the office should forbid; the corruption is not despite the faith but through it, and the offerings keep arriving.',
      'Somewhere the doctrine bent, and the priest bent with it; what he does in the shadows is counted as devotion by the power he does it for.',
    ],
    're-caused': [
      "The priest's first cause resolved, but a patron that rewards the deed has adopted him, and its blessing now consecrates the arrangement.",
    ],
    reformed: [
      "The patron's shadow passed and the priest recanted; without a power calling the deeds worship, they were only sins, and he confessed them as such.",
      'With the rewarding patron gone, the priest came clean; the dark offerings ended and the altar was reconsecrated over them.',
    ],
    historicized: [
      'The patron that blessed the deed is gone, but the priest keeps its practices; the theology died and the ritual survives.',
    ],
    'exposed-public': [
      'It is public that the priest\'s corruptions were devotions to a darker patron, and the congregation is unsure which betrayal cuts deeper.',
      "The double altar is out: the priest served what he preached against, and every rite he performed is being weighed for what it really honored.",
    ],
    're-adjudicated': [
      "The syndicate fell, but the patron that rewards the deed still stands, and the priest's arrangement passed into its liturgy whole.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith pays the priest by the sermon: doctrine softens where their mission works, and the hard lines of the creed have gone quietly negotiable.',
      'The mission could not beat the temple, so it bought a piece of it; the priest edits the liturgy in small ways that add up, and is compensated for each.',
    ],
    're-caused': [
      "The priest's first reason passed; the rival faith's retainer replaced it, and the softened doctrine is the receipt.",
    ],
    reformed: [
      'The rival faith withdrew and the priest restored the creed entire; the softened passages were preached hard again, first.',
      'When the conversion pressure broke, the priest came clean; the edited liturgy was confessed and corrected line by line.',
    ],
    historicized: [
      'The rival faith gave up the town, but the softened doctrine was never hardened back; the retainer ended and the edits stayed.',
    ],
    'exposed-public': [
      'It is public that the rival mission paid for the temple\'s softening doctrine, and the congregation is comparing old sermons to new.',
      "The retainer is out: the priest sold the creed by the clause, and both faiths now doubt everything he ever preached.",
    ],
    're-adjudicated': [
      "The old patron is gone, but the rival faith still presses, and its purse has assumed the priest's retainer without renegotiation.",
    ],
  },
  secularization: {
    attributed: [
      'The pews emptied and the tithes followed, so the priest sells what still moves: fortunes told, relics of doubtful provenance, and blessings for whatever is paid for.',
      'The faith went cold and the priest went commercial; the temple now retails wonder to a town that stopped believing in it, and the margins are his.',
    ],
    're-caused': [
      "The priest's first cause resolved, but the faith went cold around him, and the trade in manufactured wonder now sustains the arrangement.",
    ],
    reformed: [
      'The faith revived and the priest smashed the false relics himself, at service, and named each one\'s price and buyer.',
      'When belief returned, the priest came clean; the retail wonder was confessed, and the temple went back to the real and unprofitable thing.',
    ],
    historicized: [
      'The faith warmed again, but the relic trade never closed; the cold pews that opened it are full and the counter is still busy.',
    ],
    'exposed-public': [
      'It is public that the priest sold false relics and hired-out blessings while the faith slept, and the awakened faithful want their money and their god back.',
      "The inventory is out: manufactured relics, priced miracles, and the priest's markup on each; the town is deciding what, if anything, was ever real.",
    ],
    're-adjudicated': [
      "The priest's paymaster fell, but the faith is still cold, and the wonder trade has simply changed distributors.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The priesthood\'s disgrace is the priest\'s income; he knows which brothers sinned and how, and their silence fees arrive as regularly as matins.',
      'When the scandal broke over the clergy, this priest was clean enough to judge and greedy enough not to; absolution of the record has a price, and he sets it.',
    ],
    're-caused': [
      "The priest's first reason resolved, but the tainted priesthood offered a steadier one, and his brothers' silence fees now carry the arrangement.",
    ],
    reformed: [
      'The priesthood was cleansed and the priest returned the silence fees, then confessed his own trade in them before the synod.',
      "With the clergy's scandal resolved, the priest came clean; the extortion ended and the extorted were released from every hold.",
    ],
    historicized: [
      'The clergy\'s disgrace was mended, but the fees never stopped; the priest collects on sins that have already been absolved.',
    ],
    'exposed-public': [
      'It is public that the priest farmed his brothers\' sins for silver, and the synod is reading his collection book.',
      "The trade is out: absolution of the record, priced and sold inside the temple itself, and the priest's hand on every receipt.",
    ],
    're-adjudicated': [
      "The syndicate is gone, but the priesthood's taint remains, and the silence-fee collection has passed to hands that keep the priest collecting.",
    ],
  },
  captured: {
    attributed: [
      'The syndicate found a use for holiness: the temple hides their goods, their men, and their meetings, and the priest reports what the confessional hears.',
      'Sanctuary is for sale here, and the underworld holds the season tickets; the priest opens the crypt for their cargo and closes his memory for their sake.',
    ],
    're-caused': [
      "The priest's old cause resolved, but the underworld holds the town's offices now, and a temple it uses is not released from use.",
    ],
    reformed: [
      'The capture was broken and the priest opened the crypt to the magistrates; the hidden cargo and the reported confessions were laid out together.',
      "With the syndicate's grip broken, the priest came clean; the sold sanctuary was confessed, and the confessional sealed again for good.",
    ],
    historicized: [
      'The capture was broken, but the priest still keeps the crypt the syndicate\'s way: empty on inspection days, and never quite empty.',
    ],
    'exposed-public': [
      'It is public that the confessional reported to the underworld, and the congregation is remembering everything it ever whispered there.',
      "The temple's second business is out: stored contraband, sheltered men, and sold confessions, all under the priest's seal.",
    ],
    're-adjudicated': [
      'The syndicate that used the temple is destroyed, but the offices are still captured, and the new holders kept the crypt keys and the priest.',
    ],
  },
  scandal: {
    attributed: [
      'The scandal drove the guilty to confession, and the priest has been selling what they said; contrition enters the box and leaves as leverage.',
      'Half the town confessed its part in the scandal, and the priest kept notes; the notes have buyers, and the buyers have enemies.',
    ],
    're-caused': [
      "The priest's first cause cleared, but the scandal broke behind it, and the confessional's harvest now sustains the arrangement.",
    ],
    reformed: [
      'The scandal burned out and the priest burned the notes, unsold; then he confessed the keeping of them to the ones they named.',
      'When the scandal settled, the priest came clean; the traded confessions were owned from the pulpit, and the box stood empty for a season after.',
    ],
    historicized: [
      'The scandal is old news, but the priest still keeps notes on the box; the market that taught him has closed.',
    ],
    'exposed-public': [
      'It is public that the confessional leaked for money through the scandal, and no one in this town will kneel at that grate again.',
      "The notes are out: the priest inventoried the town's contrition and retailed it, and the town is reading its own whispers.",
    ],
    're-adjudicated': [
      "The syndicate is broken, but the scandal's economy survives, and the confessional's harvest now routes to new buyers.",
    ],
  },
};
