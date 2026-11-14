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
      'The tithes stopped covering the temple, so the priest started charging for the rites: blessings have prices now, burials come cheap or dear, and the altar plate is thinner than it was.',
      'The temple is short of money and the priest charges for the sacraments now; the poorest wait longest at the font.',
    ],
    're-caused': [
      'The priest\'s first reason is gone, but now the tithes run short, and every sacrament the priest sells is called keeping the roof on.',
    ],
    reformed: [
      'The tithes recovered and the priest struck the price list; the rites are free again, and the pawned plate was redeemed first.',
      'With the temple funded, the priest came clean from the pulpit; what the empty box had excused was named and ended.',
    ],
    historicized: [
      'The tithes have recovered, but the priest still charges families for every rite.',
    ],
    'exposed-public': [
      'It is public that the priest priced the sacraments against the empty tithe box, and the families who paid for grace want it back.',
      "The temple's fee list is out, in the priest's own hand, and the congregation can see what it was charged for every rite.",
      "Families who paid for a wedding or a burial while the tithe box stood empty can read the priest's price for it in the priest's own hand.",
    ],
    're-adjudicated': [
      'Whoever paid the priest before is gone, but now the tithes run short, and the priest charges for the rites.',
    ],
  },
  'chain-starved': {
    attributed: [
      'Incense, oil, candles and wine no longer come by road, so the priest buys them from smugglers and owes them favors.',
      'The priest will not let the altar go dark: the supplies arrive by night, and the suppliers are paid in the temple\'s silence.',
    ],
    're-caused': [
      "The priest's first reason is gone, but now the supply roads have failed, and the night suppliers keep the altar lit on their own terms.",
    ],
    reformed: [
      'The supply roads reopened and the priest paid the night men off in coin, refused their discount, and bought at the market like anyone.',
      'With the routes restored, the priest came clean; the debts to the quiet suppliers were confessed and settled in the open.',
    ],
    historicized: [
      'The roads are open again, but the priest still takes the night deliveries and still owes the smugglers.',
    ],
    'exposed-public': [
      'It is public that the altar was provisioned by smugglers, and what the temple paid them in discretion is being guessed at loudly.',
      "The night deliveries are out; the priest kept the candles lit with contraband, and the congregation is asking what else came in those crates.",
      'The congregation knows now that the candles on its altar came in with the smugglers, and it wants to know what else did.',
    ],
    're-adjudicated': [
      'Whoever held the priest\'s debt before is gone, but now the supply roads have failed, and whoever moves goods by night supplies the temple and holds the debt.',
    ],
  },
  depleted: {
    attributed: [
      'The alms store is empty, and the priest decides who gets what is left; relief goes to the loyal first.',
      'Charity has run dry, and what little is left goes by the priest\'s favor; a place on the priest\'s list has a price.',
    ],
    're-caused': [
      "The priest's first reason is gone, but now the alms store has run dry, and every ration the priest gives out buys the temple something back.",
    ],
    reformed: [
      'The alms store was refilled and the priest burned the list; relief goes by need again, beginning with those the list had skipped.',
      'With the stores replenished, the priest came clean; the favored rations were confessed at service, and the temple fasted in answer.',
    ],
    historicized: [
      'The alms store is full again, but the priest still feeds the loyal first and makes the rest wait.',
    ],
    'exposed-public': [
      'It is public that the priest fed the loyal first while the alms ran dry, and the hungry remember the sermons about charity.',
      "The list is out, in the priest's hand: who ate, who waited, and what the eating cost them in obedience.",
      "The hungry who waited while the priest fed the loyal can see their names on the priest's list, and what the eating cost.",
    ],
    're-adjudicated': [
      'Whoever held the priest before is gone, but now the alms have run dry, and the priest hands out what is left by favor.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo has the whole town smuggling, and the priest blesses the night runners before they ride, for a share of the cargo.',
      'With trade strangled, contraband leaves town with the priest\'s blessing, and the priest\'s cellar holds a share of every load.',
    ],
    're-caused': [
      'The priest\'s first reason is gone, but now the embargo chokes the trade, and every run the priest blesses brings the temple its share.',
    ],
    reformed: [
      'The embargo lifted and the priest stopped blessing the night runs; the cellar\'s percentage went to the poor box, all of it.',
      'When trade reopened, the priest came clean; the benedictions over contraband were confessed, and the runners lost their chaplain.',
    ],
    historicized: [
      'The embargo has lifted, but the priest still blesses the night runners for a share of the cargo.',
    ],
    'exposed-public': [
      'It is public that the priest blessed the smugglers and took a tithe of the cargo, and the customs officers know which runs the priest blessed.',
      "The temple's share of the contraband is out, and the congregation has learned what the night riders paid for their god's goodwill.",
      "The night riders the priest blessed are named to the customs officers, with the temple's share of each run.",
    ],
    're-adjudicated': [
      'Whoever ran the cargo with the priest before is gone, but now the embargo chokes the trade, and the priest blesses whoever smuggles, for a share.',
    ],
  },
  'levied-away': {
    attributed: [
      "The fighters are away at war and their families pray hard; the priest has priced the praying, and the estates of those who fall pass through the priest's hands with fees attached.",
      'With the fighters away at the war, the temple is fuller and richer than ever; the priest charges frightened families for prayers and takes fees on the estates of the dead.',
    ],
    're-caused': [
      "The priest's first reason is gone, but now the levy has taken the fighters away, and their frightened families pay the priest for prayers.",
    ],
    reformed: [
      'The companies came home and the priest returned the fear-bought fees; the prayers for the absent are free again, said daily, unbilled.',
      'When the strength returned, the priest came clean; the probate fees were restored to the widows, with the accounting read aloud.',
    ],
    historicized: [
      'The fighters are home, but the priest still charges their families for prayers.',
    ],
    'exposed-public': [
      'It is public that the priest priced prayers for the levied and skimmed the estates of the fallen, and the returned soldiers are at the priest\'s door.',
      "It is out that the priest took fees from the estates of the town's war dead, and the widows know every one.",
      "The widows of the war dead know every fee the priest took from their husbands' estates, and the returned soldiers are at the priest's door.",
    ],
    're-adjudicated': [
      'Whoever held the priest before is gone, but now the levy has taken the fighters away, and the priest takes fees on prayers and on the estates of the fallen.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'With the garrison hollow, the temple hired its own protection, and the protectors were not chosen for their piety; the priest pays them in sanctuary, and asks nothing about their days.',
      'The temple needed guarding and the watch could not guard it, so the priest found men who could; their wages are silence and a locked crypt no one inspects.',
    ],
    're-caused': [
      "The priest's first reason is gone, but now the garrison is hollowed out, and the hired guards at the temple hold the priest to the bargain.",
    ],
    reformed: [
      'The garrison was refilled and the priest dismissed the hired men; the crypt was opened for inspection the same day.',
      'With the ranks restored, the priest came clean; the sanctuary debts were confessed and the guardians handed to the law.',
    ],
    historicized: [
      'The garrison is full again, but the priest still shelters the hired men in the temple and asks nothing about their days.',
    ],
    'exposed-public': [
      'It is public that the temple\'s guards were bought with sanctuary and silence, and the crypt they kept locked has been opened.',
      "It is out that the priest sheltered armed men from the law in exchange for their protection, and the congregation is counting the nights it prayed beside them.",
      'The congregation is counting the nights it prayed beside the armed men the priest hid in the crypt.',
    ],
    're-adjudicated': [
      'Whoever held the priest before is gone, but now the garrison is hollowed out, and whoever needs sanctuary guards the temple for it.',
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war fills the pews with frightened people, and the priest has raised the price of every rite; the offering plate has never been heavier.',
      'Under the war\'s pressure the priest sells indulgences to soldiers and promises of safety to their mothers, and banks the money every night.',
    ],
    're-caused': [
      "The priest's first reason is gone, but now the war presses in, and frightened people pay the priest for every rite.",
    ],
    reformed: [
      'The war receded and the priest emptied the fear-money into relief for the town it was taken from.',
      'With the pressure lifted, the priest came clean; the wartime guarantees were renounced from the pulpit, and the offerings returned.',
    ],
    historicized: [
      'The war has moved on, but the priest still charges wartime prices for the rites.',
    ],
    'exposed-public': [
      'It is public that the priest priced salvation by the war\'s fear, and the families who bought guarantees for their dead are outside.',
      "The wartime offerings are out: the priest took money from frightened families, and the survivors are comparing what they paid with what they got.",
      'Families who paid the priest for guarantees for their war dead are outside, comparing what they paid with what they got.',
    ],
    're-adjudicated': [
      'Whoever held the priest before is gone, but now the war presses in, and the priest sells promises of safety to the frightened.',
    ],
  },
  occupation: {
    attributed: [
      'The occupier lets the temple stand, and the sermons pay the rent; the priest preaches patience, submission, and the sinfulness of resistance, on schedule.',
      'The occupier lets the temple stay open because the priest is useful, and the sermons always suit the occupier.',
    ],
    're-caused': [
      "The priest's first reason is gone, but now the occupier holds the town and lets the temple stay open, and the priest's sermons pay for it.",
    ],
    reformed: [
      'The occupier withdrew and the priest preached the sermon he had swallowed the whole occupation, and named what the others had cost.',
      'With the occupation ended, the priest came clean; the scheduled sermons were confessed as the price of the open door.',
    ],
    historicized: [
      'The occupier is gone, but the priest still preaches patience and submission to the congregation, as if the occupier were listening.',
    ],
    'exposed-public': [
      'It is public that the pulpit preached to the occupier\'s order, and the congregation is re-hearing every sermon about patience.',
      "It is out that the temple stayed open because the priest preached submission to the occupier, and the town knows who wanted those sermons.",
      "The congregation is hearing the priest's sermons on patience again, knowing now the occupier asked for them.",
    ],
    're-adjudicated': [
      "Whoever paid the priest before is gone, but now the occupier holds the town, and its officials set the terms of the priest's sermons.",
    ],
  },
  'conduct-drift': {
    attributed: [
      'The patron the priest serves rewards what the office should forbid, and the offerings keep arriving.',
      'The priest\'s doctrine has bent, and the dark patron counts every secret deed the priest does as devotion.',
    ],
    're-caused': [
      "The priest's first reason is gone, but now a dark patron rewards the deed, and its favor keeps the priest at it.",
    ],
    reformed: [
      "The patron's shadow passed and the priest recanted; without a power calling the deeds worship, they were only sins, and he confessed them as such.",
      'With the rewarding patron gone, the priest came clean; the dark offerings ended and the altar was reconsecrated over them.',
    ],
    historicized: [
      'The dark patron is gone, but the priest still keeps its rites before the congregation.',
    ],
    'exposed-public': [
      'It is public that the priest\'s corruptions were devotions to a darker patron, and the congregation is unsure which betrayal cuts deeper.',
      "It is out that the priest served the power the priest preached against, and the congregation is asking what each rite really honored.",
      'The faithful are asking what each rite the priest led really honoured, now that a darker patron is known to have paid.',
    ],
    're-adjudicated': [
      "Whoever held the priest before is gone, but now a dark patron rewards the deed, and the priest serves it alone.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith pays the priest by the sermon: doctrine softens where their mission works, and the hard lines of the creed have gone quietly negotiable.',
      'The rival mission could not beat the temple, so it pays the priest to change the liturgy a little at a time.',
    ],
    're-caused': [
      "The priest's first reason is gone, but now a rival faith presses in, and it pays the priest to soften the doctrine.",
    ],
    reformed: [
      'The rival faith withdrew and the priest restored the creed entire; the softened passages were preached hard again, first.',
      'When the conversion pressure broke, the priest came clean; the edited liturgy was confessed and corrected line by line.',
    ],
    historicized: [
      'The rival faith has left the town, but the priest still preaches the softened passages to the congregation.',
    ],
    'exposed-public': [
      'It is public that the rival mission paid for the temple\'s softening doctrine, and the congregation is comparing old sermons to new.',
      "It is out that the rival mission paid the priest for each change to the creed, and now both faiths doubt everything the priest preached.",
      "Older members of the congregation can set the priest's old sermons beside the new and see what the rival mission paid to change.",
    ],
    're-adjudicated': [
      "Whoever paid the priest before is gone, but now a rival faith presses in, and its money pays the priest directly.",
    ],
  },
  secularization: {
    attributed: [
      'The pews emptied and the tithes followed, so the priest sells what still moves: fortunes told, relics of doubtful provenance, and blessings for whatever is paid for.',
      'With the faith gone cold, the priest sells wonders to a town that no longer believes in them, and keeps the money.',
    ],
    're-caused': [
      "The priest's first reason is gone, but now the faith has gone cold, and the priest lives on selling false wonders.",
    ],
    reformed: [
      'The faith revived and the priest smashed the false relics himself, at service, and named each one\'s price and buyer.',
      'When belief returned, the priest came clean; the retail wonder was confessed, and the temple went back to the real and unprofitable thing.',
    ],
    historicized: [
      'The faith has warmed again, but the priest still sells false relics to the faithful.',
    ],
    'exposed-public': [
      'It is public that the priest sold false relics and hired-out blessings while the faith slept, and the awakened faithful want their money and their god back.',
      "The priest's stock is out: false relics, paid miracles, and the priest's price on each, and the town is asking whether any of it was real.",
      "Families who bought the priest's relics and blessings while the faith slept want their money back, and the truth about each one.",
    ],
    're-adjudicated': [
      'Whoever held the priest before is gone, but now the faith has gone cold, and the priest sells false wonders to whoever still pays.',
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The priesthood\'s disgrace is the priest\'s income; the priest knows which brothers sinned and how, and their silence fees arrive as regularly as matins.',
      'When the scandal broke over the clergy, the priest was clean enough to judge the others and chose to sell silence instead.',
    ],
    're-caused': [
      "The priest's first reason is gone, but now the priesthood is tainted, and the tainted brothers pay the priest to keep quiet.",
    ],
    reformed: [
      'The priesthood was cleansed and the priest returned the silence fees, then confessed his own trade in them before the synod.',
      "With the clergy's scandal resolved, the priest came clean; the extortion ended and the extorted were released from every hold.",
    ],
    historicized: [
      'The clergy\'s disgrace was mended, but the priest still collects silence fees from the brothers on sins already absolved.',
    ],
    'exposed-public': [
      'It is public that the priest farmed the brothers\' sins for silver, and the synod is reading the priest\'s collection book.',
      "It is out that the priest sold absolution inside the temple itself, with the priest's own hand on every sale.",
      "The synod is reading the priest's collection book, and the brothers whose sins were sold are in it.",
    ],
    're-adjudicated': [
      'Whoever held the priest before is gone, but now the priesthood is tainted, and the tainted brothers pay the priest silence money.',
    ],
  },
  captured: {
    attributed: [
      'The syndicate found a use for holiness: the temple hides their goods, their men, and their meetings, and the priest reports what the confessional hears.',
      'The underworld pays the priest for sanctuary, and the priest opens the crypt for its cargo and forgets what goes in.',
    ],
    're-caused': [
      "The priest's first reason is gone, but now the underworld holds the town's offices, and it will not let the priest stop.",
    ],
    reformed: [
      'The capture was broken and the priest opened the crypt to the magistrates; the hidden cargo and the reported confessions were laid out together.',
      "With the syndicate's grip broken, the priest came clean; the sold sanctuary was confessed, and the confessional sealed again for good.",
    ],
    historicized: [
      'The underworld\'s hold is broken, but the priest still keeps the crypt empty on inspection days and full on the others.',
    ],
    'exposed-public': [
      'It is public that the confessional reported to the underworld, and the congregation is remembering everything it ever whispered there.',
      "The temple's second business is out: stored contraband, sheltered men, and sold confessions, all under the priest's seal.",
      'Everyone who ever confessed at that temple is remembering what they said, now that the underworld heard it too.',
    ],
    're-adjudicated': [
      "Whoever used the temple before is gone, but now the town's offices are in criminal hands, and whoever holds them kept the crypt keys and the priest.",
    ],
  },
  scandal: {
    attributed: [
      'The scandal drove the guilty to confession, and the priest has been selling what they confessed.',
      'Half the town confessed its part in the scandal, and the priest kept notes; the notes have buyers, and the buyers have enemies.',
    ],
    're-caused': [
      "The priest's first reason is gone, but now a scandal has broken, and the priest sells what the guilty confess.",
    ],
    reformed: [
      'The scandal burned out and the priest burned the notes, unsold; then he confessed the keeping of them to the ones they named.',
      'When the scandal settled, the priest came clean; the traded confessions were owned from the pulpit, and the box stood empty for a season after.',
    ],
    historicized: [
      'The scandal has settled, but the priest still keeps notes on what the penitents say in confession.',
    ],
    'exposed-public': [
      'It is public that the confessional leaked for money through the scandal, and no one in this town will kneel at that grate again.',
      "The notes are out: the priest wrote down what the town confessed and sold it, and the town is reading its own secrets.",
      "People who confessed through the scandal are reading their own secrets, sold out of the priest's notes.",
    ],
    're-adjudicated': [
      'Whoever bought the confessions before is gone, but now a scandal has broken, and the priest sells confessions to whoever pays.',
    ],
  },
};
