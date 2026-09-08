/**
 * causeConjunctionRole/dissident.js — the ROLE-TIER conjunction lines for
 * dissident — the agitator (the movement, pamphlets, crowds).
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
export const DISSIDENT_ROLE_CONTENT = {
  underfunded: {
    attributed: [
      'The movement went broke, and the agitator found a patron; the crowds still gather at the agitator\'s call, but the call comes when the patron\'s interests need a crowd.',
      'Outrage is expensive to organize, and someone else pays for it now; the agitator\'s targets have narrowed, oddly, to the patron\'s rivals.',
    ],
    're-caused': [
      'What first leashed the agitator has passed; the empty movement chest leashes them now, and the patron\'s coin decides where the anger points.',
    ],
    reformed: [
      'The movement\'s funds recovered and the agitator returned the patron\'s money; the next speech named the patron and the targets bought, in order.',
      'With the chest refilled, the agitator came clean before the crowd; the aimed rallies were confessed, and the aim taken back.',
    ],
    historicized: [
      'The movement can fund itself now, but the patron\'s coin still arrives and the targets still narrow; the poverty that excused it is over.',
    ],
    'exposed-public': [
      'It is public that the crowds were aimed for a patron\'s coin, and the people who marched are learning whose errand they ran.',
      'The funding is out: the agitator\'s outrage had an owner, and the owner\'s rivals have the receipts of every rally.',
    ],
    're-adjudicated': [
      'The patron who held the movement is destroyed, but the chest is still empty, and a new purse has already reached the agitator.',
    ],
  },
  'chain-starved': {
    attributed: [
      'Paper and ink stopped arriving with everything else, and the movement\'s press runs on a stranger\'s supply; the pamphlets print what they always printed, minus whatever the supplier strikes out.',
      'The press cannot run without stock, and only one hand still provides it; the agitator\'s sentences have been growing careful in places, and the places map to the supplier\'s interests.',
    ],
    're-caused': [
      "The agitator's first leash has passed; the starved press leashes them now, and the supplier's pencil edits what the movement may say.",
    ],
    reformed: [
      'The supply lines reopened and the agitator bought stock at market; the struck passages were reprinted first, in their original words.',
      'With paper flowing again, the agitator came clean; the edited pamphlets were listed, and the censored lines read aloud at the next gathering.',
    ],
    historicized: [
      'The supply lines are mended, but the pamphlets still avoid the old places; the supplier\'s pencil is gone and the caution stayed.',
    ],
    'exposed-public': [
      'It is public that the movement\'s pamphlets were edited by their paper supplier, and the readers are comparing editions.',
      'The struck passages are out: the agitator traded the movement\'s voice for its ink, and the strikeouts spell the supplier\'s name.',
    ],
    're-adjudicated': [
      'The old supplier is destroyed, but the lines are still cut, and the press\'s new stock arrives with a new pencil attached.',
    ],
  },
  depleted: {
    attributed: [
      'The strike fund ran dry, and the agitator settled with the masters in a back room; the strike continues in public, theatrical and doomed, while the settlement pays its leader privately.',
      'There is nothing left to sustain the resistance, so the agitator sold its ending; the masters know the strike\'s last day already, because they bought the date.',
    ],
    're-caused': [
      "The agitator's first leash passed; the empty fund leashes them now, and the sold settlement keeps paying its private installments.",
    ],
    reformed: [
      'The fund was replenished and the agitator tore up the private settlement in front of the crowd it had betrayed, and named the masters who bought it.',
      'With the movement funded again, the agitator came clean; the sold ending was unsold, and the strike became real again at its leader\'s cost.',
    ],
    historicized: [
      'The fund recovered, but the private settlement stands; the desperation that signed it has passed and the installments continue.',
    ],
    'exposed-public': [
      'It is public that the strike\'s ending was sold in a back room, and the strikers who starved for it know the date their leader set.',
      'The settlement is out: the agitator was paid to lose, and the movement is reading the terms of its own defeat.',
    ],
    're-adjudicated': [
      'The buyers are destroyed, but the fund is still empty, and the settlement\'s installments have new payers and the same payee.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo\'s misery feeds the movement, and the embargo\'s profiteers feed the agitator; the rage is real, and it is aimed, carefully, at everyone except the men running the blockade market.',
      'Someone profits from the strangled trade, and that someone pays the agitator; the speeches burn the council, the merchants, the neighbors, and never once the blockade\'s beneficiaries.',
    ],
    're-caused': [
      "The agitator's first leash passed; the embargo's profiteers hold it now, and their coin keeps the crowd's anger pointed elsewhere.",
    ],
    reformed: [
      'The embargo lifted and the agitator named the paymasters from the platform; the aimed-away speeches were confessed with the aim.',
      'When trade reopened, the agitator came clean; the profiteers lost their deflector, and the movement heard where its anger should have gone.',
    ],
    historicized: [
      'The embargo is over, but the speeches still swerve around certain names; the coin that taught the swerve stopped coming.',
    ],
    'exposed-public': [
      'It is public that the embargo\'s profiteers paid the agitator to aim the anger away, and the crowd is recalculating its old targets.',
      'The deflection is out: the movement\'s rage was rented by the men it should have burned, and the rental receipts are circulating.',
    ],
    're-adjudicated': [
      'The old profiteers are destroyed, but the trade is still strangled, and the blockade\'s new beneficiaries have re-rented the deflection.',
    ],
  },
  'levied-away': {
    attributed: [
      'The agitator hides the levy\'s runaways and reports them too; the hiding earns the movement\'s trust and the reporting earns the muster\'s bounty, and the same names appear in both ledgers.',
      'Every draft-dodger in town knows the agitator\'s safe houses, and so does the muster office; the agitator collects gratitude from one side and bounties from the other, in strict rotation.',
    ],
    're-caused': [
      "The agitator's first leash passed; the levy's bounties hold them now, and the safe houses keep filling with what the muster office pays for.",
    ],
    reformed: [
      'The companies came home and the agitator confessed both ledgers; the collected bounties went to the betrayed, whatever mercy followed.',
      'When the levy ended, the agitator came clean; the reported runaways were named an apology each, and the safe houses made safe in fact.',
    ],
    historicized: [
      'The levy is over, but the agitator still keeps both ledgers by habit; the bounties that filled one have stopped.',
    ],
    'exposed-public': [
      'It is public that the safe houses reported to the muster office, and the runaways who trusted them are back and asking questions.',
      'The double ledger is out: the agitator sold the hidden to the hunters, and the movement is reading its own casualty list.',
    ],
    're-adjudicated': [
      'The syndicate fell, but the levy still musters, and the safe-house bounties have been re-funded by the new collectors.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'With the garrison hollow, nothing stops a riot but the agitator\'s word, and the word is for sale; calm is invoiced to the frightened, and unrest to their rivals, at separate rates.',
      'The watch cannot hold the square, so the agitator holds it instead, and rents it out; whether the town burns on any given night is a transaction now.',
    ],
    're-caused': [
      "The agitator's first leash passed, but the garrison hollowed after, and the riot-or-calm trade now anchors the arrangement.",
    ],
    reformed: [
      'The garrison was refilled and the agitator retired the trade; the invoiced calm was refunded, and the square went back to belonging to no one.',
      'With the watch restored, the agitator came clean; the priced riots were confessed, and the movement chose its nights freely again.',
    ],
    historicized: [
      'The garrison stands full again, but the agitator still prices the square; the vacuum that set the rates is filled.',
    ],
    'exposed-public': [
      'It is public that the town\'s riots and calms were invoiced, and the buyers of both are as exposed as the seller.',
      'The rate card is out: the agitator sold unrest by the night while the garrison stood empty, and the burned streets have the dates.',
    ],
    're-adjudicated': [
      'The old clients are destroyed, but the garrison is still drained, and the riot trade has new customers holding the agitator\'s calendar.',
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war has the town on edge, and the agitator\'s speeches tip it on schedule; the schedule belongs to a paymaster whose grain and land deals ripen exactly when the panics do.',
      'Fear moves markets, and the agitator moves fear; the war supplies the kindling, the speeches supply the spark, and a quiet purse supplies the timing.',
    ],
    're-caused': [
      "The agitator's first leash cleared, but the war pressed in, and the timed panics now finance the arrangement.",
    ],
    reformed: [
      'The war receded and the agitator published the schedule beside the paymaster\'s purchases; the correlation was the confession.',
      'With the pressure lifted, the agitator came clean; the timed speeches were owned, and the movement\'s voice unhitched from the market.',
    ],
    historicized: [
      'The war moved on, but the speeches still track someone\'s ledger; the panics that paid have quieted.',
    ],
    'exposed-public': [
      'It is public that the wartime panics were scheduled, and the town is matching the agitator\'s speeches to the paymaster\'s purchases.',
      'The timing is out: fear was produced to order while the war pressed, and the order forms carry the agitator\'s dates.',
    ],
    're-adjudicated': [
      'The syndicate is broken, but the war still presses, and the panic schedule has been re-commissioned by new speculators.',
    ],
  },
  occupation: {
    attributed: [
      'The resistance follows the agitator, and the occupier follows the resistance, because the agitator draws them both the map; the movement is real, its leader is theirs, and the raids always come the night after the planning.',
      'The occupation tolerates exactly one resistance, the agitator\'s, and the tolerance is not charity; controlled opposition is a service, and the fee is every serious plan reported before it ripens.',
    ],
    're-caused': [
      "What first leashed the agitator is gone; the occupier's tolerance leashes them now, and the reported plans are the rent.",
    ],
    reformed: [
      'The occupier withdrew and the agitator stood before the movement with the whole account; the reported plans, the tolerated rallies, and the resignation offered with them.',
      'With the occupation ended, the agitator came clean; the movement learned why its boldest nights had always failed, from the one who sold them.',
    ],
    historicized: [
      'The occupier is gone, but the agitator still leads as if reporting upward; the reader of the reports has marched away.',
    ],
    'exposed-public': [
      'It is public that the resistance\'s plans reached the occupier before they ripened, and the survivors of the failed nights know the courier now.',
      'The controlled opposition is out: the movement was the occupier\'s instrument with the agitator\'s hand on it, and the movement has read the fee schedule.',
    ],
    're-adjudicated': [
      "The agitator's old paymaster is destroyed, but the occupier remains, and the tolerance has been re-extended on the standing terms.",
    ],
  },
  'conduct-drift': {
    attributed: [
      'A dark patron loves the mob\'s work, and the agitator supplies it; the fires are called justice from the platform, and the patron pays for each one in favor and following.',
      'The movement\'s violence has a sponsor now; a patron that counts the burnings as offerings rewards the agitator, and the targets have started serving the theology more than the cause.',
    ],
    're-caused': [
      "The agitator's first cause resolved, but a patron that rewards the deed adopted the mob, and its favor now picks the nights.",
    ],
    reformed: [
      "The patron's shadow lifted and the agitator called off the fires; unsponsored, they read as arson, and the platform said so.",
      'With the rewarding patron gone, the agitator came clean; the offered burnings were confessed, and the movement\'s anger unhitched from the altar.',
    ],
    historicized: [
      'The patron is gone, but the mob still burns on the old calendar; the theology lapsed and the appetite did not.',
    ],
    'exposed-public': [
      'It is public that the mob\'s fires were offerings, and the town is re-reading each burning as liturgy with the agitator presiding.',
      'The sponsorship is out: a dark patron paid for the riots\' worst nights, and the movement has learned what its justice was feeding.',
    ],
    're-adjudicated': [
      "The syndicate fell, but the patron that rewards the deed still stands, and the mob's calendar passed into its keeping.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith funds the dissent, and the dissent has learned its donor\'s accent; the grievances are local, the pamphlets\' doctrine is not, and the agitator is paid to not notice the difference.',
      'The movement\'s money crosses the border with its new ideas; the rival mission underwrites the agitator, and the sermons inside the speeches grow less subtle by the month.',
    ],
    're-caused': [
      "The agitator's first leash passed; the rival faith's underwriting replaced it, and the imported doctrine keeps arriving with the funds.",
    ],
    reformed: [
      'The rival faith withdrew and the agitator returned the underwriting; the borrowed doctrine was cut from the pamphlets, publicly, page by page.',
      'When the conversion pressure broke, the agitator came clean; the funded sermons were confessed, and the movement\'s grievances spoke in their own accent again.',
    ],
    historicized: [
      'The rival faith gave up the town, but the pamphlets still carry its accent; the underwriting ended and the doctrine settled in.',
    ],
    'exposed-public': [
      'It is public that the dissent was underwritten by the rival mission, and the marchers are re-reading their own slogans for the foreign hand.',
      'The underwriting is out: the movement\'s voice was rented to a conversion, and both congregations recognize the phrasing now.',
    ],
    're-adjudicated': [
      'The old patron is gone, but the rival faith still presses, and the underwriting has resumed from a successor purse.',
    ],
  },
  secularization: {
    attributed: [
      'The movement swears its members on things no one believes anymore, and the agitator counts on it; the common purse leaks toward its keeper, because the oath over it is furniture now.',
      'With the faith gone cold, the movement\'s vows bind no one, least of all its leader; the agitator spends the common fund like a private one, and the accounting is rhetorical.',
    ],
    're-caused': [
      "The agitator's first cause resolved, but the faith went cold behind it, and with the vows dead, the purse simply kept leaking.",
    ],
    reformed: [
      'The faith revived and the vows with it; the agitator restored the leaked funds and re-swore the oath over the purse, witnessed.',
      'When belief returned, the agitator came clean; the private spending was confessed to the movement, and the purse given a second keeper.',
    ],
    historicized: [
      'The faith warmed again, but the purse still leaks; the cold season that excused the keeper has passed.',
    ],
    'exposed-public': [
      'It is public that the movement\'s funds fed its leader while the vows meant nothing, and the members are auditing the years of speeches about greed.',
      'The leak is out: the agitator preached sacrifice and practiced allowance, and the reviving congregation counts the movement\'s purse among its inquiries.',
    ],
    're-adjudicated': [
      "The agitator's paymaster fell, but the faith is still cold, and no revived vow guards the purse from its keeper.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The clergy\'s scandal is the agitator\'s best material, and the temple pays to keep it material only; the attacks stay rhetorical by arrangement, and the arrangement is priced monthly.',
      'The agitator leads the outrage against the tainted priests and moderates it too; the temple pays for the moderation, and the crowd never learns why the marches stop at the temple square.',
    ],
    're-caused': [
      "The agitator's first leash resolved, but the tainted priesthood offered a steadier one, and the moderation fees now hold the arrangement.",
    ],
    reformed: [
      'The priesthood was cleansed and the agitator confessed the moderation; the fees were returned, and the last march went all the way to the doors.',
      "With the clergy's scandal resolved, the agitator came clean; the priced restraint was owned before the crowd that had wondered at it.",
    ],
    historicized: [
      'The temple was set in order, but the moderation fees still arrive; the outrage they blunted has burned out on its own.',
    ],
    'exposed-public': [
      'It is public that the temple paid the agitator to blunt the marches, and the crowd knows now why its anger always stopped at the square.',
      'The moderation is out: the agitator sold the movement\'s restraint to its target, and both invoice books are open.',
    ],
    're-adjudicated': [
      "The syndicate is gone, but the priesthood's taint remains, and the moderation retainer has been assumed by new hands.",
    ],
  },
  captured: {
    attributed: [
      'The syndicate owns the mob the way it owns the offices; the agitator\'s riots bloom wherever the crews need the watch looking elsewhere, and the timing is never the movement\'s idea.',
      'The movement believes it chooses its nights; the syndicate chooses them, and pays the agitator for the belief; every march is a diversion first and a cause second.',
    ],
    're-caused': [
      "The agitator's old leash resolved, but the underworld holds the town now, and a crowd it can aim is not an asset it releases.",
    ],
    reformed: [
      'The capture was broken and the agitator confessed the diversions; the movement learned which of its nights had been cover, and for what.',
      "With the syndicate's grip broken, the agitator came clean; the aimed marches were named, and the movement's calendar returned to its own hands.",
    ],
    historicized: [
      'The capture was broken, but the marches still bloom on useful nights; the crews that used them are gone and the pattern persists.',
    ],
    'exposed-public': [
      'It is public that the riots were diversions for the syndicate\'s work, and the movement is matching its proudest nights to the burglaries.',
      'The aimed crowd is out: the agitator rented the movement to the underworld by the night, and the town has both calendars.',
    ],
    're-adjudicated': [
      'The syndicate that aimed the crowds is destroyed, but the offices are still captured, and the new holders have already booked a march.',
    ],
  },
  scandal: {
    attributed: [
      'The scandal handed the agitator a sword, and the agitator sells the not-swinging; the implicated pay to stay out of the speeches, and the speeches grow strangely selective.',
      'Exposure is the movement\'s weapon, and its leader has priced it; the scandal\'s names come out of the agitator\'s mouth or stay in the agitator\'s strongbox, depending on the week\'s receipts.',
    ],
    're-caused': [
      "The agitator's first leash cleared, but the scandal broke behind it, and the not-naming trade now sustains the arrangement.",
    ],
    reformed: [
      'The scandal burned out and the agitator emptied the strongbox from the platform; every withheld name, and the fee that had withheld it.',
      'When the scandal settled, the agitator came clean; the selective speeches were confessed, and the protected names read at last.',
    ],
    historicized: [
      'The scandal is old news, but the strongbox still takes deposits; the fear that filled it has thinned.',
    ],
    'exposed-public': [
      'It is public that the scandal\'s names were priced out of the speeches, and the crowd is learning who paid for its ignorance.',
      'The not-naming trade is out: the agitator monetized the movement\'s silence, and the protected are as furious as the deceived.',
    ],
    're-adjudicated': [
      "The syndicate is broken, but the scandal's economy survives, and the strongbox has new depositors and the same keeper.",
    ],
  },
};
