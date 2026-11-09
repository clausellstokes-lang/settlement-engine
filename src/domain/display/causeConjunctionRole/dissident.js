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
      'The movement ran out of money, and the agitator found a patron. The crowds still come when the agitator calls, but the calls now come when the patron needs a crowd.',
      'A patron pays for the movement\'s rallies now, and the agitator\'s targets have narrowed to the patron\'s rivals.',
    ],
    're-caused': [
      'The agitator\'s first reason is gone, but now the movement\'s chest runs empty, and the patron\'s coin decides where the anger points.',
    ],
    reformed: [
      'The movement\'s funds recovered and the agitator returned the patron\'s money; the next speech named the patron and the targets bought, in order.',
      'With the chest refilled, the agitator came clean before the crowd; the aimed rallies were confessed, and the aim taken back.',
    ],
    historicized: [
      'The movement can pay its own way again, but the agitator still takes the patron\'s coin and still aims the crowds at the patron\'s rivals.',
    ],
    'exposed-public': [
      'It is public that the crowds were aimed for a patron\'s coin, and the people who marched are learning whose errand they ran.',
      'It is out that the agitator\'s outrage was paid for, and the patron\'s rivals know every rally that was aimed at them.',
    ],
    're-adjudicated': [
      "Whoever paid the agitator before is gone, but now the movement's chest runs empty, and the agitator takes money from whoever offers it.",
    ],
  },
  'chain-starved': {
    attributed: [
      'Paper and ink stopped coming with everything else, and the movement\'s press now runs on one outside supplier. The pamphlets print what they always did, minus whatever the supplier strikes out.',
      'The press cannot run without paper, and only one supplier still provides it. The agitator\'s pamphlets have grown careful in places, and those places are the supplier\'s business.',
    ],
    're-caused': [
      "The agitator's first reason is gone, but now the press runs short of paper, and the supplier cuts what the movement may print.",
    ],
    reformed: [
      'The supply lines reopened and the agitator bought stock at market; the struck passages were reprinted first, in their original words.',
      'With paper flowing again, the agitator came clean; the edited pamphlets were listed, and the censored lines read aloud at the next gathering.',
    ],
    historicized: [
      'The supply roads are open again, but the agitator\'s pamphlets still steer around the supplier\'s business.',
    ],
    'exposed-public': [
      'It is public that the movement\'s pamphlets were edited by their paper supplier, and the readers are comparing editions.',
      'It is out that the agitator let the paper supplier cut the movement\'s pamphlets in exchange for ink, and the cut passages all point to the supplier.',
    ],
    're-adjudicated': [
      'Whoever supplied the agitator before is gone, but now the supply roads are cut, and whoever sells the paper decides what the pamphlets leave out.',
    ],
  },
  depleted: {
    attributed: [
      'The strike fund ran dry, and the agitator settled with the masters in a back room. The strike goes on in public, and it will fail, while the settlement pays its leader in private.',
      'With nothing left to keep the strike going, the agitator sold its ending. The masters already know the strike\'s last day, because they bought it.',
    ],
    're-caused': [
      "The agitator's first reason is gone, but now the strike fund runs dry, and the masters' private payments keep coming.",
    ],
    reformed: [
      'The fund was replenished and the agitator tore up the private settlement in front of the crowd it had betrayed, and named the masters who bought it.',
      'With the movement funded again, the agitator came clean; the sold ending was unsold, and the strike became real again at its leader\'s cost.',
    ],
    historicized: [
      'The strike fund has recovered, but the private settlement stands, and the masters still pay the agitator to lose.',
    ],
    'exposed-public': [
      'It is public that the strike\'s ending was sold in a back room, and the strikers who starved for it know the date their leader set.',
      'It is out that the agitator was paid to lose the strike, and the strikers are reading the terms of their own defeat.',
    ],
    're-adjudicated': [
      "Whoever paid the agitator before is gone, but now the strike fund runs dry, and the masters' settlement money keeps coming.",
    ],
  },
  'trade-strangled': {
    attributed: [
      "The embargo's hardship feeds the movement, and the embargo's profiteers pay the agitator. The anger is real, and it is aimed at everyone except those running the blockade market.",
      'Someone profits from the embargo, and that someone pays the agitator. The speeches attack the council, the merchants and the neighbors, and never those profiting from the blockade.',
    ],
    're-caused': [
      "The agitator's first reason is gone, but now the embargo chokes the trade, and its profiteers pay to keep the crowd's anger pointed elsewhere.",
    ],
    reformed: [
      'The embargo lifted and the agitator named the paymasters from the platform; the aimed-away speeches were confessed with the aim.',
      'When trade reopened, the agitator came clean; the profiteers lost their deflector, and the movement heard where its anger should have gone.',
    ],
    historicized: [
      'The embargo is over, but the agitator\'s speeches still steer around the profiteers\' names.',
    ],
    'exposed-public': [
      'It is now known that the embargo\'s profiteers paid the agitator to aim the anger away from them, and the crowd is looking again at its old targets.',
      'It is out that the people the movement should have turned on paid the agitator for its anger, and the word is going round the town.',
    ],
    're-adjudicated': [
      'Whoever paid the agitator before is gone, but now the embargo chokes the trade, and whoever profits from it pays the agitator to steer the anger away.',
    ],
  },
  'levied-away': {
    attributed: [
      'The agitator hides the levy\'s runaways and reports them too. The hiding earns the movement\'s trust, the reporting earns the muster\'s bounty, and the same names are in both books.',
      'Every draft-dodger in town knows the agitator\'s safe houses, and so does the muster office. The agitator is thanked by one and paid bounties by the other.',
    ],
    're-caused': [
      "The agitator's first reason is gone, but now the levy calls the young away, and the safe houses fill with runaways the muster office pays for.",
    ],
    reformed: [
      'The companies came home and the agitator confessed both ledgers; the collected bounties went to the betrayed, whatever mercy followed.',
      'When the levy ended, the agitator came clean; the reported runaways were named an apology each, and the safe houses made safe in fact.',
    ],
    historicized: [
      'The levy is over, but the agitator still keeps a list of every runaway who hid in the safe houses.',
    ],
    'exposed-public': [
      'It is public that the safe houses reported to the muster office, and the runaways who trusted them are back and asking questions.',
      'It is out that the agitator sold hidden runaways to the muster office, and the movement is counting who was taken.',
    ],
    're-adjudicated': [
      'Whoever paid the agitator before is gone, but now the levy calls the young away, and the muster office pays the bounties on the safe houses.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'With the garrison emptied, nothing stops a riot but the agitator\'s word, and the word is for sale: calm to the frightened, unrest against their rivals, each at its own price.',
      'The watch cannot hold the square, so the agitator holds it and rents it out. Whether the town burns on a given night depends on who has paid.',
    ],
    're-caused': [
      "The agitator's first reason is gone, but now the garrison is hollowed out, and the agitator sells riots and calm by the night.",
    ],
    reformed: [
      'The garrison was refilled and the agitator retired the trade; the invoiced calm was refunded, and the square went back to belonging to no one.',
      'With the watch restored, the agitator came clean; the priced riots were confessed, and the movement chose its nights freely again.',
    ],
    historicized: [
      'The garrison is back to strength, but the agitator still sells riots and calm in the square.',
    ],
    'exposed-public': [
      'It is public that the town\'s riots and calms were invoiced, and the buyers of both are as exposed as the seller.',
      'It is out that the agitator sold riots by the night while the garrison stood empty, and the people of the burned streets have the dates.',
    ],
    're-adjudicated': [
      "Whoever bought the agitator's riots before is gone, but now the garrison is hollowed out, and the agitator sells riots by the night to whoever pays.",
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war has the town on edge, and the agitator\'s speeches set off panics on a schedule. A paymaster sets the schedule, and the paymaster\'s grain and land deals come due when the panics do.',
      'The war gives the town reason to be afraid, and a quiet paymaster tells the agitator which days to stir the fear.',
    ],
    're-caused': [
      "The agitator's first reason is gone, but now the war presses in, and a paymaster pays for each panic the speeches set off.",
    ],
    reformed: [
      'The war receded and the agitator published the schedule beside the paymaster\'s purchases; the correlation was the confession.',
      'With the pressure lifted, the agitator came clean; the timed speeches were owned, and the movement\'s voice unhitched from the market.',
    ],
    historicized: [
      'The war has moved on, but the agitator\'s speeches still stir panics on the days the paymaster\'s deals need them.',
    ],
    'exposed-public': [
      'It is public that the wartime panics were scheduled, and the town is matching the agitator\'s speeches to the paymaster\'s purchases.',
      'It is out that the panics were stirred up to order while the war pressed, and the agitator\'s speeches match the dates.',
    ],
    're-adjudicated': [
      'Whoever paid for the panics before is gone, but now the war presses in, and whoever gains from a panic pays the agitator to set one off.',
    ],
  },
  occupation: {
    attributed: [
      'The resistance follows the agitator, and the occupier follows the resistance, because the agitator tells it where to look. The raids always come the night after the planning.',
      'The occupation allows one resistance, the agitator\'s, and not out of kindness: the agitator reports every serious plan before it can happen.',
    ],
    're-caused': [
      "The agitator's first reason is gone, but now the occupier holds the town and lets the movement stand, and the reported plans pay for it.",
    ],
    reformed: [
      'The occupier withdrew and the agitator stood before the movement with the whole account; the reported plans, the tolerated rallies, and the resignation offered with them.',
      'With the occupation ended, the agitator came clean; the movement learned why its boldest nights had always failed, from the one who sold them.',
    ],
    historicized: [
      'The occupier is gone, but the agitator still writes down every serious plan the movement makes, as if for the occupier.',
    ],
    'exposed-public': [
      'It is public that the resistance\'s plans reached the occupier before they ripened, and the survivors of the failed nights know the courier now.',
      'It is out that the movement was the occupier\'s tool with the agitator in charge, and the members now know what the agitator was paid.',
    ],
    're-adjudicated': [
      "Whoever paid the agitator before is gone, but now the occupier holds the town, and it lets the movement stand for the same reported plans.",
    ],
  },
  'conduct-drift': {
    attributed: [
      'A dark patron rewards the mob\'s fires, and the agitator supplies them. From the platform they are called justice, and the patron pays for each one in favor and followers.',
      'A patron that counts the burnings as offerings rewards the agitator, and the targets now suit the patron more than the movement\'s grievances.',
    ],
    're-caused': [
      "The agitator's first reason is gone, but now a dark patron rewards the fires, and its favor picks the nights.",
    ],
    reformed: [
      "The patron's shadow lifted and the agitator called off the fires; unsponsored, they read as arson, and the platform said so.",
      'With the rewarding patron gone, the agitator came clean; the offered burnings were confessed, and the movement\'s anger unhitched from the altar.',
    ],
    historicized: [
      'The dark patron is gone, but the agitator still sends the mob out to burn on the patron\'s nights.',
    ],
    'exposed-public': [
      'It is now known that the mob\'s fires were offerings, with the agitator leading them, and the town is looking again at every burning.',
      "It is out that a dark patron paid for the riots' worst nights, and the movement knows now who it was burning for.",
    ],
    're-adjudicated': [
      "Whoever paid the agitator before is gone, but now a dark patron rewards the fires, and the agitator sends the mob out on its nights.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith funds the movement. The grievances are local, the pamphlets\' doctrine is the mission\'s, and the agitator is paid not to mention it.',
      'The movement\'s money comes from across the border with new ideas. The rival mission pays the agitator, and the speeches sound more like sermons each month.',
    ],
    're-caused': [
      "The agitator's first reason is gone, but now a rival faith presses in, and its money comes with its doctrine.",
    ],
    reformed: [
      'The rival faith withdrew and the agitator returned the underwriting; the borrowed doctrine was cut from the pamphlets, publicly, page by page.',
      'When the conversion pressure broke, the agitator came clean; the funded sermons were confessed, and the movement\'s grievances spoke in their own accent again.',
    ],
    historicized: [
      'The rival faith has given up on the town, but the agitator\'s pamphlets still preach its doctrine to the movement.',
    ],
    'exposed-public': [
      'It is now known that the rival mission paid for the movement, and the marchers see that their slogans were its words.',
      'It is out that the movement spoke for a foreign faith for pay, and both congregations now recognize the words.',
    ],
    're-adjudicated': [
      'Whoever paid the agitator before is gone, but now a rival faith presses in, and its money for the movement has started coming.',
    ],
  },
  secularization: {
    attributed: [
      'The movement swears its members on a faith no one keeps anymore, and the agitator counts on it: the common purse leaks into the agitator\'s pocket, because the oath over it means nothing now.',
      'With the faith gone cold, the movement\'s vows bind no one, least of all its leader. The agitator spends the common fund as a private one, and no one keeps count.',
    ],
    're-caused': [
      "The agitator's first reason is gone, but now the faith has gone cold, the vows mean nothing, and the agitator keeps taking from the purse.",
    ],
    reformed: [
      'The faith revived and the vows with it; the agitator restored the leaked funds and re-swore the oath over the purse, witnessed.',
      'When belief returned, the agitator came clean; the private spending was confessed to the movement, and the purse given a second keeper.',
    ],
    historicized: [
      'The faith has warmed again, but the agitator still takes from the movement\'s purse.',
    ],
    'exposed-public': [
      'It is now known that the movement\'s money fed its leader while the vows meant nothing, and the members are going back over all those speeches about greed.',
      'It is out that the agitator preached sacrifice and lived well on the movement\'s purse, and the returning congregation is asking questions.',
    ],
    're-adjudicated': [
      "Whoever paid the agitator before is gone, but now the faith has gone cold, and no vow keeps the agitator out of the purse.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The clergy scandal is the agitator\'s best material, and the temple pays each month to keep the attacks to speeches.',
      'The agitator leads the outrage against the disgraced priests and holds it back too. The temple pays for that, and the crowd never learns why the marches stop at the temple square.',
    ],
    're-caused': [
      "The agitator's first reason is gone, but now the priesthood is tainted, and the temple pays the agitator to stop the marches short of its doors.",
    ],
    reformed: [
      'The priesthood was cleansed and the agitator confessed the moderation; the fees were returned, and the last march went all the way to the doors.',
      "With the clergy's scandal resolved, the agitator came clean; the priced restraint was owned before the crowd that had wondered at it.",
    ],
    historicized: [
      'The temple has been set in order and the outrage has burned out, but the temple\'s payments to the agitator still come.',
    ],
    'exposed-public': [
      'It is public that the temple paid the agitator to blunt the marches, and the crowd knows now why its anger always stopped at the square.',
      'It is out that the agitator took the temple\'s money to hold the movement back, and both sets of accounts are open.',
    ],
    're-adjudicated': [
      'Whoever paid the agitator before is gone, but now the priesthood is tainted, and the temple pays the agitator to keep the unrest small.',
    ],
  },
  captured: {
    attributed: [
      'The underworld owns the mob as it owns the offices. The agitator\'s riots break out wherever the crews need the watch looking elsewhere.',
      'The movement believes it chooses its nights. The underworld chooses them and pays the agitator, and every march covers a crime first.',
    ],
    're-caused': [
      "The agitator's first reason is gone, but now the underworld holds the offices, and it will not let go of a crowd it can aim.",
    ],
    reformed: [
      'The capture was broken and the agitator confessed the diversions; the movement learned which of its nights had been cover, and for what.',
      "With the syndicate's grip broken, the agitator came clean; the aimed marches were named, and the movement's calendar returned to its own hands.",
    ],
    historicized: [
      'The underworld\'s hold on the offices is broken, but the agitator still calls marches on nights that suit a thief.',
    ],
    'exposed-public': [
      'It is public that the riots were diversions for the syndicate\'s work, and the movement is matching its proudest nights to the burglaries.',
      'It is out that the agitator rented the movement to the underworld by the night, and the town can match the marches to the crimes.',
    ],
    're-adjudicated': [
      "Whoever aimed the agitator's crowds before is gone, but now the underworld holds the offices, and the agitator calls marches on its nights.",
    ],
  },
  scandal: {
    attributed: [
      'The scandal gave the agitator names to shout, and the agitator sells silence instead. Those implicated pay to stay out of the speeches.',
      'The agitator decides whose names from the scandal are spoken from the platform, and whose stay locked in the agitator\'s strongbox, by who has paid that week.',
    ],
    're-caused': [
      "The agitator's first reason is gone, but now a scandal has broken, and the agitator sells silence to the names in it.",
    ],
    reformed: [
      'The scandal burned out and the agitator emptied the strongbox from the platform; every withheld name, and the fee that had withheld it.',
      'When the scandal settled, the agitator came clean; the selective speeches were confessed, and the protected names read at last.',
    ],
    historicized: [
      'The scandal has died down, but people still pay the agitator to keep their names out of the speeches.',
    ],
    'exposed-public': [
      'It is public that the scandal\'s names were priced out of the speeches, and the crowd is learning who paid for its ignorance.',
      'It is out that the agitator sold the movement\'s silence, and those who paid are as angry as those who were fooled.',
    ],
    're-adjudicated': [
      'Whoever paid the agitator before is gone, but now a scandal has broken, and whoever is named in it pays the agitator to keep their names unspoken.',
    ],
  },
};
