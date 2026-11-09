/**
 * causeConjunctionRole/military.js — the ROLE-TIER conjunction lines for
 * military — the captain (watch, garrison, gate, armory, rosters).
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
export const MILITARY_ROLE_CONTENT = {
  underfunded: {
    attributed: [
      'The pay chest has run short, and the captain makes up the difference with outside coin; the patrols now keep clear of whoever pays.',
      'Ask why the watch still musters at full strength on a starved budget: the captain found a paymaster, and the gate rota is what was sold.',
    ],
    're-caused': [
      'The captain\'s first reason is gone, but now the pay chest runs short, and the outside coin keeps coming.',
    ],
    reformed: [
      'The pay came through and held, and the captain ended the arrangement; the last favors were repaid and the rosters run straight again.',
      "With the garrison funded again, the captain closed the side ledger for good; whoever bought the watch's blindness will find it is no longer for sale.",
    ],
    historicized: [
      "The pay was restored, but the captain still takes the outside coin, and the patrols still keep clear of whoever pays.",
    ],
    'exposed-public': [
      "It is out: the captain covered the garrison's short pay with bought coin, and the town now knows which doors the watch was paid not to guard.",
      "The captain's second paymaster is public. The shortfall was real, which is the defense; the men are asking what else went with the gate rota.",
    ],
    're-adjudicated': [
      "Whoever paid the captain before is gone, but now the pay runs short, and the captain takes coin from whoever will cover it.",
    ],
  },
  'chain-starved': {
    attributed: [
      "The garrison's supply line failed, so the captain buys stores from smugglers and escorts their runs in payment; the quartermaster's books no longer add.",
      'Boots, grain, bowstrings: none of it arrives by the road anymore, and the captain gets it where it can be got. The suppliers collect in favors.',
    ],
    're-caused': [
      "The captain's first reason is gone, but now the supply line has failed, and the smugglers' wagons keep the garrison fed.",
    ],
    reformed: [
      'The supply line was restored and the captain cut the smugglers off; the last favor owed them was refused at the gate.',
      "With the wagons running again, the captain went back to honest requisitions and put the quartermaster's books in order himself.",
    ],
    historicized: [
      'The supply line is mended, but the captain still buys from the smugglers and still escorts their runs.',
    ],
    'exposed-public': [
      'It is public that the captain provisioned the garrison through smugglers and paid them in escort duty; every run they made under guard is being counted.',
      'The town knows now why the garrison never went hungry while the roads were dead: the captain dealt with smugglers, and the smugglers wrote it all down.',
    ],
    're-adjudicated': [
      "Whoever supplied the captain before is gone, but now the supply line is cut, and whoever moves goods on it now holds the garrison's debt.",
    ],
  },
  depleted: {
    attributed: [
      'The stores are empty and the captain decides what is left in the armory; requisitions move for coin, and the militia drills with worse steel than it should.',
      'With the reserves gone, nothing leaves the armory without the captain\'s signature, and the captain charges for it.',
    ],
    're-caused': [
      'The captain\'s first reason is gone, but now the stores have run dry, and selling what is left pays the captain better than the garrison does.',
    ],
    reformed: [
      'The stores were refilled and the captain stopped selling access to them; the armory door opens by rank again, not by purse.',
      'Replenished stores ended it. The captain came clean, and the requisition slips are worth only what they say again.',
    ],
    historicized: [
      'The stores were restocked, but the captain still charges for every signature on a requisition.',
    ],
    'exposed-public': [
      'It is known now that the captain sold armory requisitions while the stores ran dry, and the militiamen who drilled with rust want the tally read.',
      'The empty stores have a scandal attached: the captain collected on every issued blade, and the town is asking where the coin went.',
    ],
    're-adjudicated': [
      'Whoever bought from the captain before is gone, but now the stores are empty, and the captain sells what is left in the armory to whoever pays.',
    ],
  },
  'trade-strangled': {
    attributed: [
      "The trade routes are strangled, and cargo that cannot pass lawfully passes the captain's gate at night; the search rota skips certain wagons.",
      'Since the embargo closed the roads, the captain has kept one open after dark, and the captain alone takes the toll on it.',
    ],
    're-caused': [
      'The captain\'s first reason is gone, but now the embargo chokes the roads, and every unsearched wagon pays the captain.',
    ],
    reformed: [
      'The embargo lifted and the captain closed the night gate; every wagon is searched again, including the ones that used to pay.',
      'When trade reopened, the captain ended the arrangement; contraband lost its margin and the gate its second price.',
    ],
    historicized: [
      'Trade runs free again, but the captain still opens the night gate to the wagons that pay.',
    ],
    'exposed-public': [
      'It is public: while trade was strangled, the captain sold passage through the night gate, and the merchants who obeyed the embargo know what obedience cost them.',
      "The night traffic through the gate has come out with the captain's name on it, and so has the toll the captain took on every wagon.",
    ],
    're-adjudicated': [
      'Whoever backed the captain before is gone, but now the embargo chokes the routes, and the captain opens the night gate to whoever pays the toll.',
    ],
  },
  'levied-away': {
    attributed: [
      'The companies marched to war and left the captain the only armed authority in town; what the captain permits after curfew comes at a price.',
      'With the strength levied away, no officer outranks the captain here, and the captain sells exemptions, escorts and silences.',
    ],
    're-caused': [
      "The captain's first reason is gone, but now the companies are levied away, and no one is left in the barracks who could object.",
    ],
    reformed: [
      'The companies came home and the captain gave up what the empty season had let him take; his accounts were in order before the first column reached the gate.',
      'When the strength returned, the captain came clean; command shared is command watched, and he chose to be found in order.',
    ],
    historicized: [
      'The companies are back, but the captain still sells exemptions after curfew to whoever pays.',
    ],
    'exposed-public': [
      'The returning companies have heard what the captain did while they were at war, and the exemptions the captain sold after curfew are being read out by name.',
      'It is out that the captain ran the empty town for profit, and the companies that marched away are home and angriest of all.',
    ],
    're-adjudicated': [
      "Whoever paid the captain before is gone, but now the strength is levied away, and with no one watching, the captain carries on.",
    ],
  },
  'garrison-drained': {
    attributed: [
      'The garrison is hollow, and the captain keeps it looking full: names on the muster list that never answer it, and their pay drawn all the same.',
      'Half the posts stand empty, and the captain bills for all of them; the dead and the deserted still eat, on paper.',
    ],
    're-caused': [
      "The captain's first reason is gone, but now the garrison is hollow, and the pay drawn for missing soldiers keeps the captain at it.",
    ],
    reformed: [
      'The ranks were refilled and the captain struck the ghosts from the roster himself, before an inspection could do it for him.',
      'With the garrison restored, the captain came clean: the false names are gone, and the pay chest matches the muster at last.',
    ],
    historicized: [
      'The garrison stands at strength again, but the captain still draws pay for some soldiers who do not exist.',
    ],
    'exposed-public': [
      'It is public that the captain drew pay for soldiers who do not exist, and the muster roll is being read against the pay chest line by line.',
      'The hollow garrison broke open as a scandal: the captain kept dead men on the muster and pocketed their wages.',
    ],
    're-adjudicated': [
      "Whoever split the missing soldiers' pay with the captain is gone, but now the garrison is hollow, and the captain draws the pay alone.",
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war is at the walls, and the captain sells the only thing scarcer than bread: passage. Safe-conducts leave the captain\'s desk that no council authorized.',
      "Under the war's pressure the captain has priced the postern gate; who leaves this town, and when, is a transaction now.",
    ],
    're-caused': [
      "The captain's first reason is gone, but now the war presses in, and the captain sells safe-conducts through the postern.",
    ],
    reformed: [
      'The war receded and the captain tore up the trade in safe-conducts; the postern is a gate again, not a tollbooth.',
      'With the pressure lifted, the captain unwound the wartime bargains and reported the worst of them himself.',
    ],
    historicized: [
      'The war moved on, but the captain still charges for passage through the postern.',
    ],
    'exposed-public': [
      'It is out that the captain sold passage while the town stood under the war, and the families of those who could not pay are at the front of the crowd.',
      'The safe-conduct trade is public: the captain charged for escape during the fighting, and the survivors no longer trust the captain\'s word.',
    ],
    're-adjudicated': [
      'Whoever traded passage with the captain before is gone, but now the war presses in, and the captain sells safe-conducts to whoever can pay.',
    ],
  },
  occupation: {
    attributed: [
      "The occupier holds the town, and the captain's patrols never trouble them; the schedules reach the occupation office before the watch house.",
      'The captain kept the command under the occupation, and the price is standing: names, routes, and the occasional door left unbarred.',
    ],
    're-caused': [
      "The captain's first reason is gone; now the occupier's favor keeps the captain in command, and their protection is the pay.",
    ],
    reformed: [
      'The occupier withdrew and the captain ended the accommodation; what he had passed to them marched away in their baggage, and he has answered for it since.',
      'With the occupation ended, the captain came clean about the accommodation; he kept the watch alive under it, and the town can weigh that as it likes.',
    ],
    historicized: [
      'The occupier is gone, but the captain still runs the patrols the way the occupier wanted them.',
    ],
    'exposed-public': [
      'It is public that the captain fed patrol schedules to the occupier, and every arrest made on those nights is being laid at the captain\'s door.',
      "The word is collaboration now, said in the open: the captain served the occupier's order, and the town remembers whose doors were left unbarred.",
    ],
    're-adjudicated': [
      "Whoever paid the captain before is gone, but now the occupier holds the gates, and its garrison gives the captain orders.",
    ],
  },
  'conduct-drift': {
    attributed: [
      "A patron power in this town rewards a hard hand, and the captain's hand has grown hard; each cruelty on duty comes back to the captain as favor.",
      "The captain's worst work is called devotion now; a patron that prizes the deed has been paying the captain in standing and shelter.",
    ],
    're-caused': [
      "The captain's first reason is gone, but now a patron rewards cruelty on duty, and its favor pays steadier than coin.",
    ],
    reformed: [
      "The patron's shadow passed from the town, and the captain set the hard hand down; without a power calling it service, it was only brutality.",
      'With the rewarding patron gone, the captain came clean; the deeds lost their sanction, and he stopped wanting them.',
    ],
    historicized: [
      "The patron that blessed the captain's hand is gone, but the captain is still as hard on duty as before.",
    ],
    'exposed-public': [
      "It is public that the captain's cruelties were paid devotion to a dark patron, and the town is deciding which is worse, the faith or the fee.",
      'It is out that a patron rewarded what the captain did on duty, and the town knows now that the beatings were paid for.',
    ],
    're-adjudicated': [
      "Whoever paid the captain before is gone, but now the patron that rewards the deed stands over the town, and it pays for the captain's cruelty in favor.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      "A rival faith presses on the town, and its missionaries walk safe streets; the captain's patrols are paid to look elsewhere while they work.",
      'The rival faith buys protection like anyone else, and the captain sells it; conversion moves quietly through the wards the captain has thinned.',
    ],
    're-caused': [
      "The captain's first reason is gone; now the rival faith pays the captain a retainer, and its missionaries walk the safest streets.",
    ],
    reformed: [
      'The rival faith withdrew and the captain ended the retainer; the patrols cover every ward again, whoever preaches in them.',
      'When the conversion pressure broke, the captain came clean; there was no one left paying for the thin patrols, and he stopped running them thin.',
    ],
    historicized: [
      'The rival faith gave up the town, but the captain still keeps certain wards lightly patrolled.',
    ],
    'exposed-public': [
      "It is out that the captain took the rival faith's coin to clear their path, and neither congregation trusts the captain now.",
      'The retainer is public: the rival mission paid the captain for empty streets, and every conversion in those wards is being re-read as bought ground.',
    ],
    're-adjudicated': [
      "Whoever ran the retainer before is gone, but now the rival faith presses in, and its money pays the captain directly.",
    ],
  },
  secularization: {
    attributed: [
      'The watch oath used to mean something in this town; with the faith gone cold it binds nothing, and the captain takes what the oath once forbade.',
      'Nothing is sworn on anything here anymore, and the captain was the first to test it, crossing lines the oath once held.',
    ],
    're-caused': [
      "The captain's first reason is gone, but now the faith has gone cold, and with nothing watching, the captain carries on.",
    ],
    reformed: [
      'The faith revived, and the captain put himself back under the oath; what the cold season permitted, he gave up unasked.',
      'When belief returned to the town, the captain came clean; he re-swore the watch oath and this time meant it.',
    ],
    historicized: [
      'The faith warmed again, but the captain never went back under the oath and still takes what it forbade.',
    ],
    'exposed-public': [
      'It is public what the captain did while the altars stood empty, and the reviving congregation names the captain aloud.',
      'The town knows now that when the faith went cold the captain went with it; what the captain took in that season is out, and the broken oath is remembered.',
    ],
    're-adjudicated': [
      "Whoever paid the captain before is gone, but now the faith has gone cold, and no oath stands that could stop the captain.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      "The temple's disgrace has a guardian: the captain, whose men never seem to knock on the vestry door. The silence is paid for monthly.",
      'There is an investigation the watch will never open, and the tainted priesthood pays the captain to keep it so.',
    ],
    're-caused': [
      "The captain's first reason is gone, but now the priesthood is tainted, and the vestry's silence money keeps the captain paid.",
    ],
    reformed: [
      'The priesthood was cleansed and the retainer ended; the captain opened the old case himself and let it read what it read.',
      "With the clergy's scandal resolved, the captain came clean about the silence he had sold; the vestry door knocks like any other now.",
    ],
    historicized: [
      'The temple was set in order, but the captain still collects from it and still keeps the watch off the vestry door.',
    ],
    'exposed-public': [
      "It is out that the captain was paid to keep the watch away from the temple, and both disgraces, the priests' and the captain's, are being read together.",
      'The town knows now why the vestry was never searched: the captain priced the not-searching, and the tainted clergy paid it gladly.',
    ],
    're-adjudicated': [
      'Whoever held the captain before is gone, but now the priesthood is tainted, and the temple pays the captain to keep the watch away.',
    ],
  },
  captured: {
    attributed: [
      "The underworld holds this town's offices, and it holds the captain with them; raids arrive late, warrants go missing, and no one is ever caught twice.",
      'Every crackdown the captain leads finds an empty room. The underworld knows the captain\'s orders before the sergeants do, because the captain sells them first.',
    ],
    're-caused': [
      "The captain's first reason is gone, but now the underworld holds the offices, and it does not let the captain stop.",
    ],
    reformed: [
      'The capture was broken, and the captain walked out from under it; the first true raid in memory was his, and it was thorough.',
      "With the syndicate's grip broken, the captain came clean; the missing warrants were found in his desk, where he said they would be.",
    ],
    historicized: [
      'The capture was broken, but the captain still runs the watch the way the underworld trained it: raids that arrive late, warrants that go missing.',
    ],
    'exposed-public': [
      "It is public that the captain's raids were sold in advance, and every empty room the watch ever broke into is being counted against the captain.",
      'The capture has the captain\'s face on it now: the town knows its watch answered to the underworld, and knows who carried the answers.',
    ],
    're-adjudicated': [
      'Whoever owned the captain before is gone, but now the underworld holds the offices, and whoever holds them now kept the captain on.',
    ],
  },
  scandal: {
    attributed: [
      'Since the corruption scandal broke, the captain has been its broker: evidence surfaces or sinks depending on who pays the watch house a visit.',
      'The scandal put half the town in fear of a knock at the door, and the captain sells the not-knocking; the watch\'s evidence room has become a market.',
    ],
    're-caused': [
      "The captain's first reason is gone, but now the scandal has broken, and selling cover and silence inside it pays the captain.",
    ],
    reformed: [
      'The scandal burned out and the captain came clean; the evidence room was inventoried, and what had sunk was raised and handed over.',
      'When the scandal settled, the captain ended the trade; the last man paying for silence got his coin back and his name read out.',
    ],
    historicized: [
      'The scandal has settled, but the captain still sells what is in the evidence room.',
    ],
    'exposed-public': [
      'It is out that the captain sold silence through the scandal, and the town has learned that its evidence room had a price list.',
      'The scandal has reached the captain by name: what surfaced and what sank in the watch house is being audited, and the pattern points one way.',
    ],
    're-adjudicated': [
      'Whoever paid the captain before is gone, but now the scandal has broken, and the captain sells silence to whoever is afraid.',
    ],
  },
};
