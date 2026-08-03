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
      'The pay chest has run short too long, and the captain quietly makes up the difference with outside coin; the patrol rosters now bend around who pays.',
      'Ask why the watch still musters at full strength on a starved budget: the captain found a paymaster, and the gate rota is what was sold.',
    ],
    're-caused': [
      'Whatever first bent the captain has passed; it is the short pay that keeps the arrangement alive now, and the shortfall in the ledgers is real.',
    ],
    reformed: [
      'The pay came through and held, and the captain ended the arrangement; the last favors were repaid and the rosters run straight again.',
      "With the garrison funded again, the captain closed the side ledger for good; whoever bought the watch's blindness will find it is no longer for sale.",
    ],
    historicized: [
      "The pay was restored, but the captain kept the second income; what began as covering the men's wages is now just how the gate is run.",
    ],
    'exposed-public': [
      "It is out: the captain covered the garrison's short pay with bought coin, and the town now knows which doors the watch was paid not to guard.",
      "The captain's second paymaster is public. The shortfall was real, which is the defense; the men are asking what else went with the gate rota.",
    ],
    're-adjudicated': [
      "The syndicate that held the captain's debt is destroyed, but the pay is still short, and the shortfall has carried the arrangement to whoever will fund it.",
    ],
  },
  'chain-starved': {
    attributed: [
      "The garrison's supply line failed, so the captain buys stores from smugglers and escorts their runs in payment; the quartermaster's books no longer add.",
      'Boots, grain, bowstrings: none of it arrives by the road anymore, and the captain gets it where it can be got. The suppliers collect in favors.',
    ],
    're-caused': [
      "The captain's first reason is gone; now it is the dead supply line that justifies the arrangement, and the smugglers' wagons that keep the garrison fed.",
    ],
    reformed: [
      'The supply line was restored and the captain cut the smugglers off; the last favor owed them was refused at the gate.',
      "With the wagons running again, the captain went back to honest requisitions and put the quartermaster's books in order himself.",
    ],
    historicized: [
      'The supply line has long been mended, but the captain still buys from the quiet men; the emergency ended and the habit did not.',
    ],
    'exposed-public': [
      'It is public that the captain provisioned the garrison through smugglers and paid them in escort duty; every run they made under guard is being counted.',
      'The town knows now why the garrison never went hungry while the roads were dead: the captain dealt with smugglers, and the smugglers kept receipts.',
    ],
    're-adjudicated': [
      "The captain's old paymaster is destroyed, but the supply line is still cut, and whoever moves goods along it now holds the garrison's debt.",
    ],
  },
  depleted: {
    attributed: [
      'The stores are empty and the captain decides what is left in the armory; requisitions move for coin, and the militia drills with worse steel than it should.',
      'With the reserves gone, a signature from the captain became the scarcest good in town, and it has not been given away free.',
    ],
    're-caused': [
      'The old pressure lifted, but the stores ran dry since, and the captain has found that scarcity pays a wage the garrison cannot.',
    ],
    reformed: [
      'The stores were refilled and the captain stopped selling access to them; the armory door opens by rank again, not by purse.',
      'Replenished stores ended it. The captain came clean, and the requisition slips are worth only what they say again.',
    ],
    historicized: [
      'The stores were restocked, but the captain still prices his signature; the scarcity that taught him is over.',
    ],
    'exposed-public': [
      'It is known now that the captain sold armory requisitions while the stores ran dry, and the militiamen who drilled with rust want the tally read.',
      'The empty stores have a scandal attached: the captain collected on every issued blade, and the town is asking where the coin went.',
    ],
    're-adjudicated': [
      'The syndicate holding the captain fell, but the stores are still empty, and command of what remains has picked up the arrangement.',
    ],
  },
  'trade-strangled': {
    attributed: [
      "The trade routes are strangled, and cargo that cannot pass lawfully passes the captain's gate at night; the search rota skips certain wagons.",
      'Since the embargo closed the roads, the captain has kept one open after dark, and the toll on it is his alone.',
    ],
    're-caused': [
      'What first turned the captain has passed; it is the strangled trade that pays him now, one unsearched wagon at a time.',
    ],
    reformed: [
      'The embargo lifted and the captain closed the night gate; every wagon is searched again, including the ones that used to pay.',
      'When trade reopened, the captain ended the arrangement; contraband lost its margin and the gate its second price.',
    ],
    historicized: [
      'Trade runs free again, but the captain still keeps his night gate; the embargo that excused it is history.',
    ],
    'exposed-public': [
      'It is public: while trade was strangled, the captain sold passage past his own gate, and the merchants who obeyed the embargo know what obedience cost them.',
      "The night traffic through the gate has come out, and the captain's name is on it; the embargo was the reason, the toll was the crime.",
    ],
    're-adjudicated': [
      "The captain's old patron is gone, but the routes are still choked, and the night trade through the gate has found him new creditors.",
    ],
  },
  'levied-away': {
    attributed: [
      'The companies marched to war and left the captain the only armed authority in town; what he permits after curfew, he permits for a price.',
      'With the strength levied away, no officer outranks the captain here, and he has been renting out the absence: exemptions, escorts, silences.',
    ],
    're-caused': [
      "The captain's first cause is resolved; now it is the empty barracks that sustain the arrangement, since no one is left who could object.",
    ],
    reformed: [
      'The companies came home and the captain gave up what the empty season had let him take; his accounts were in order before the first column reached the gate.',
      'When the strength returned, the captain came clean; command shared is command watched, and he chose to be found in order.',
    ],
    historicized: [
      'The companies are back, but the captain never gave up the habits of the empty season; the absence that excused them is over.',
    ],
    'exposed-public': [
      'The returning companies have heard what the captain did while they were at war, and the exemptions he sold after curfew are being read out by name.',
      'It is out that the captain governed the empty town for his own purse; the men who marched away are home, and they are the angriest.',
    ],
    're-adjudicated': [
      "The syndicate is destroyed, but the strength is still away at war, and the unwatched town itself now keeps the captain's arrangement.",
    ],
  },
  'garrison-drained': {
    attributed: [
      'The garrison is hollow, and the captain keeps it looking full: names on the roster that answer no muster, and their pay drawn all the same.',
      'Half the posts stand empty, and the captain bills for all of them; the dead and the deserted still eat, on paper.',
    ],
    're-caused': [
      "The captain's first reason passed, but the ranks have hollowed since, and the ghost roster pays better than the real one ever did.",
    ],
    reformed: [
      'The ranks were refilled and the captain struck the ghosts from the roster himself, before an inspection could do it for him.',
      'With the garrison restored, the captain came clean: the false names are gone, and the pay chest matches the muster at last.',
    ],
    historicized: [
      'The garrison stands at strength again, but the captain never retired all the ghosts; the drain that invented them is past.',
    ],
    'exposed-public': [
      'It is public that the captain drew pay for soldiers who do not exist, and the muster roll is being read against the pay chest line by line.',
      'The hollow garrison broke open as a scandal: the captain kept dead men on the books and their wages in his coat.',
    ],
    're-adjudicated': [
      "The captain's paymaster fell, but the garrison is still drained, and the ghost roster has quietly changed hands with the rest of the arrangement.",
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war is at the walls, and the captain sells the only thing scarcer than bread: passage. Safe-conducts leave his desk that no council authorized.',
      "Under the war's pressure the captain has priced the postern gate; who leaves this town, and when, is a transaction now.",
    ],
    're-caused': [
      "The captain's old cause cleared, but the war pressed in behind it, and the emergency now carries the arrangement he never put down.",
    ],
    reformed: [
      'The war receded and the captain tore up the trade in safe-conducts; the postern is a gate again, not a tollbooth.',
      'With the pressure lifted, the captain unwound the wartime bargains and reported the worst of them himself.',
    ],
    historicized: [
      'The war moved on, but the captain still runs the postern as a business; the siege that taught him is over.',
    ],
    'exposed-public': [
      'It is out that the captain sold passage while the town stood under the war, and the families of those who could not pay are at the front of the crowd.',
      'The safe-conduct trade is public: the captain priced escape during the fighting, and the survivors are pricing his honor accordingly.',
    ],
    're-adjudicated': [
      'The syndicate is broken, but the war still presses, and the trade in passage has simply found the captain a new set of partners.',
    ],
  },
  occupation: {
    attributed: [
      "The occupier holds the town, and the captain's patrols never trouble them; the schedules reach the occupation office before the watch house.",
      'The captain kept his command under the occupation, and the price is standing: names, routes, and the occasional door left unbarred.',
    ],
    're-caused': [
      "What first compromised the captain is gone; the occupier's favor sustains him now, and their protection is the wage.",
    ],
    reformed: [
      'The occupier withdrew and the captain ended the accommodation; what he had passed to them marched away in their baggage, and he has answered for it since.',
      'With the occupation ended, the captain came clean about the accommodation; he kept the watch alive under it, and the town can weigh that as it likes.',
    ],
    historicized: [
      'The occupier is gone, but the captain still runs his patrols the way they liked them; the occupation that arranged it is over.',
    ],
    'exposed-public': [
      'It is public that the captain fed patrol schedules to the occupier, and every arrest made on those nights is being laid at his door.',
      "The word is collaboration now, said in the open: the captain served the occupier's order, and the town remembers whose doors were left unbarred.",
    ],
    're-adjudicated': [
      "The captain's old paymaster is destroyed, but the occupier remains, and their garrison has inherited the arrangement intact.",
    ],
  },
  'conduct-drift': {
    attributed: [
      "A patron power in this town rewards a hard hand, and the captain's hand has grown hard; each cruelty on duty comes back to him as favor.",
      "The captain's worst work is called devotion now; a patron that prizes the deed has been paying him in standing and shelter.",
    ],
    're-caused': [
      "The captain's first cause resolved, but a patron that rewards the deed adopted the arrangement, and its blessing pays steadier than coin.",
    ],
    reformed: [
      "The patron's shadow passed from the town, and the captain set the hard hand down; without a power calling it service, it was only brutality.",
      'With the rewarding patron gone, the captain came clean; the deeds lost their sanction, and he stopped wanting them.',
    ],
    historicized: [
      "The patron that blessed the captain's hand is gone, but the hand stayed hard; the doctrine is dead and the habit is not.",
    ],
    'exposed-public': [
      "It is public that the captain's cruelties were paid devotion to a dark patron, and the town is deciding which is worse, the faith or the fee.",
      'The arrangement is out: a patron rewarded what the captain did on duty, and the beatings the town called excess are being recounted as offerings.',
    ],
    're-adjudicated': [
      "The syndicate fell, but the patron that rewards the deed still stands over the town, and the captain's arrangement passed to its keeping whole.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      "A rival faith presses on the town, and its missionaries walk safe streets; the captain's patrols are paid to look elsewhere while they work.",
      'The rival faith buys protection like anyone else, and the captain sells it; conversion moves quietly through the wards he has thinned.',
    ],
    're-caused': [
      "The captain's first reason passed; the rival faith's retainer replaced it, and their missionaries still walk his safest streets.",
    ],
    reformed: [
      'The rival faith withdrew and the captain ended the retainer; the patrols cover every ward again, whoever preaches in them.',
      'When the conversion pressure broke, the captain came clean; there was no one left paying for the thin patrols, and he stopped running them thin.',
    ],
    historicized: [
      'The rival faith gave up the town, but the captain still keeps certain wards lightly walked; the retainer ended and the habit outlived it.',
    ],
    'exposed-public': [
      "It is out that the captain took the rival faith's coin to clear their path, and both congregations count him a traitor to something.",
      'The retainer is public: the rival mission paid the captain for empty streets, and every conversion in those wards is being re-read as bought ground.',
    ],
    're-adjudicated': [
      "The captain's old patron is gone, but the rival faith still presses, and its purse has assumed the arrangement without missing a payment.",
    ],
  },
  secularization: {
    attributed: [
      'The watch oath used to mean something in this town; with the faith gone cold it binds nothing, and the captain takes what the oath once forbade.',
      "Nothing is sworn on anything here anymore, and the captain was the first to test it; the line he held for the god's sake he no longer holds.",
    ],
    're-caused': [
      "The captain's first cause resolved, but the faith went cold behind it, and with nothing left watching, the arrangement simply kept its own company.",
    ],
    reformed: [
      'The faith revived, and the captain put himself back under the oath; what the cold season permitted, he gave up unasked.',
      'When belief returned to the town, the captain came clean; he re-swore the watch oath and this time meant it.',
    ],
    historicized: [
      'The faith warmed again, but the captain never went back under the oath; the cold that freed him has passed and the freedom stayed.',
    ],
    'exposed-public': [
      'It is public what the captain did while the altars stood empty, and the reviving congregation reads his name in the accounting.',
      'The town knows now that when the faith went cold the captain went with it; what he took in that season is out, and the oath he broke is remembered.',
    ],
    're-adjudicated': [
      "The captain's paymaster fell, but the faith is still cold, and no oath has revived that might have ended the arrangement with it.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      "The temple's disgrace has a guardian: the captain, whose men never seem to knock on the vestry door. The silence is paid for monthly.",
      'There is an investigation the watch will never open, and the tainted priesthood pays the captain to keep it so.',
    ],
    're-caused': [
      "The captain's first reason resolved, but the tainted priesthood offered a new one, and the vestry's silence money now carries the arrangement.",
    ],
    reformed: [
      'The priesthood was cleansed and the retainer ended; the captain opened the old case himself and let it read what it read.',
      "With the clergy's scandal resolved, the captain came clean about the silence he had sold; the vestry door knocks like any other now.",
    ],
    historicized: [
      'The temple was set in order, but the captain still collects from it; the disgrace that started the payments is past, and the payments are not.',
    ],
    'exposed-public': [
      "It is out that the captain was paid to keep the watch away from the temple, and both disgraces, the priests' and his, are being read together.",
      'The town knows now why the vestry was never searched: the captain priced the not-searching, and the tainted clergy paid it gladly.',
    ],
    're-adjudicated': [
      "The syndicate is gone, but the priesthood's taint remains, and the silence trade around it has found the captain new paymasters.",
    ],
  },
  captured: {
    attributed: [
      "The underworld holds this town's offices, and it holds the captain with them; raids arrive late, warrants go missing, and no one is ever caught twice.",
      'Every crackdown the captain leads finds an empty room. The syndicate knows his orders before his sergeants do, because he sells them first.',
    ],
    're-caused': [
      "The captain's old cause resolved, but the underworld holds the offices now, and a captain it holds does not get to simply stop.",
    ],
    reformed: [
      'The capture was broken, and the captain walked out from under it; the first true raid in memory was his, and it was thorough.',
      "With the syndicate's grip broken, the captain came clean; the missing warrants were found in his desk, where he said they would be.",
    ],
    historicized: [
      'The capture was broken, but the captain still runs the watch the way the syndicate trained it; the leash is gone and the gait remains.',
    ],
    'exposed-public': [
      "It is public that the captain's raids were sold in advance, and every empty room the watch ever broke into is being counted against him.",
      'The capture has the captain\'s face on it now: the town knows its watch answered to the underworld, and knows who carried the answers.',
    ],
    're-adjudicated': [
      'The syndicate that owned the captain is destroyed, but the offices are still captured, and their new holders inherited him with the furniture.',
    ],
  },
  scandal: {
    attributed: [
      'Since the corruption scandal broke, the captain has been its broker: evidence surfaces or sinks depending on who pays the watch house a visit.',
      'The scandal put half the town in fear of a knock at the door, and the captain sells the not-knocking; his evidence room has become a market.',
    ],
    're-caused': [
      "The captain's first cause cleared, but the scandal broke behind it, and its trade in cover and silence has adopted his arrangement.",
    ],
    reformed: [
      'The scandal burned out and the captain came clean; the evidence room was inventoried, and what had sunk was raised and handed over.',
      'When the scandal settled, the captain ended the trade; the last man paying for silence got his coin back and his name read out.',
    ],
    historicized: [
      'The scandal is old news, but the captain still runs the evidence room as a market; the panic that opened it is over.',
    ],
    'exposed-public': [
      'It is out that the captain sold silence through the scandal, and the town has learned that its evidence room had a price list.',
      'The scandal has reached the captain by name: what surfaced and what sank in the watch house is being audited, and the pattern points one way.',
    ],
    're-adjudicated': [
      "The syndicate is broken, but the scandal's economy of silence survives, and the captain's ledger of favors moved with it to new owners.",
    ],
  },
};
