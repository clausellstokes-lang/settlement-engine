/**
 * domain/display/causeConjunctionRoleContent.js — W2: the ROLE-TIER conjunction
 * content table (rung 2 of the selection ladder in causeConjunctionContent.js).
 *
 * TIER-1 COVERAGE: every affinity-reachable (role × causeClass) pair — and the
 * built roleCauseAffinity has a nonzero floor for every family, so that is ALL
 * 12 × 14 = 168 pairs — at every lifecycle stage. Per pair: two variants on the
 * high-frequency stages (attributed, exposed-public, reformed), one on the rest
 * (re-caused, historicized, re-adjudicated); nine authored lines per pair.
 *
 * Each pair is ONE concrete arrangement (what this bearer actually sold, given
 * this pressure) viewed at six moments of the W-C5 lifecycle, so the stages of a
 * pair corroborate each other and no two pairs share a receipt. Role personas
 * are the established archetype nouns (causeLifecycleVocabulary.ROLE_LABEL):
 * captain / ruler / claimant / guildmaster / priest / boss / adept / official /
 * healer / foreman / envoy / agitator.
 *
 * SIDE-CAR LAW (institutionVocabulary.js precedent): generation NEVER imports
 * this file. It is read only through the lazy dossier NPC card, so authoring
 * here is byte-inert to every golden and adds nothing to the first-paint entry
 * closure. Pure data: no imports, no slots (personas are written in), no rng.
 *
 * STAGE SEMANTICS (causeLifecycle.js): at re-caused and re-adjudicated the
 * key's causeClass is the NEW sustaining cause. Those lines present it as what
 * carries the arrangement NOW; the prior cause is never named (it is not in the
 * key). Lines are AGE-BAND-NEUTRAL: no "years ago" / "lean years" register
 * (that belongs to the floor, which reads the band), and no fresh-age claims,
 * because a stamp renders at any age.
 *
 * @type {Readonly<Record<string, Record<string, Record<string, ReadonlyArray<string>>>>>}
 */
export const ROLE_CONTENT = Object.freeze({
  // ── military — the captain (watch, garrison, gate, armory, rosters) ─────────
  military: {
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
  },
  // ── ruler — the ruler (charter, seal, council, treasury) ────────────────────
  ruler: {
    underfunded: {
      attributed: [
        'The treasury is short and the ruler has been selling what the seat controls: offices, charters, and the right to farm taxes have all quietly gone to market.',
        "A starved treasury taught the ruler arithmetic: a signature costs nothing to give and sells dear. The council's seats have started changing hands accordingly.",
      ],
      're-caused': [
        'Whatever first bent the ruler has passed; the empty treasury bends them now, and every sold charter is called necessity.',
      ],
      reformed: [
        'The treasury recovered and the ruler stopped the sales; the last bought office was revoked publicly, as a promise.',
        'With the coffers refilled, the ruler came clean; what the shortfall had excused was ended, and the sold charters were called in.',
      ],
      historicized: [
        "The treasury recovered, but the ruler still sells the seal's favors; the shortfall that began it is a memory.",
      ],
      'exposed-public': [
        'It is public that the ruler sold offices against the empty treasury, and every appointee now wears a price tag in the town\'s eyes.',
        "The town has learned what the ruler's signature cost during the shortfall, and the men who bought their charters are as exposed as the hand that sold them.",
      ],
      're-adjudicated': [
        "The syndicate behind the old arrangement is destroyed, but the treasury is still short, and the shortfall now owns the ruler's signature instead.",
      ],
    },
    'chain-starved': {
      attributed: [
        'The supply lines failed, and the ruler granted emergency monopolies to whoever could still deliver; the kickbacks on those contracts never appear in the minutes.',
        'When the wagons stopped, the ruler chose who would feed the town, and chose by tribute; the emergency contracts read like a list of donors.',
      ],
      're-caused': [
        "The ruler's first cause is resolved; the broken supply lines justify the arrangement now, and every gap in the market is a favor waiting to be granted.",
      ],
      reformed: [
        'The supply lines were restored and the ruler dissolved the emergency monopolies; the contracts went back to open bidding, tribute refused.',
        'With the wagons running again, the ruler came clean and canceled the donor contracts; the emergency that dressed them up was over.',
      ],
      historicized: [
        'The supply lines are mended, but the emergency monopolies were never dissolved; the ruler keeps them as furniture now.',
      ],
      'exposed-public': [
        'It is out that the ruler sold the emergency contracts while the town went short, and the donor list is being read against the delivery records.',
        'The town knows now who paid for the right to feed it during the shortage, and knows the ruler set the price.',
      ],
      're-adjudicated': [
        'The old paymaster fell, but the supply lines are still cut, and the emergency contracts have delivered the ruler to whoever can fill them.',
      ],
    },
    depleted: {
      attributed: [
        'The reserve is empty and the ruler decides who eats from what remains; the distribution lists read like a register of loyalty.',
        "Scarcity has made the ruler's favor the only store still stocked, and it is not given, it is traded.",
      ],
      're-caused': [
        "The ruler's first reason has passed; the empty reserve reasons for them now, and every ration granted buys something back.",
      ],
      reformed: [
        'The reserve was refilled and the ruler burned the loyalty lists; relief moves by need again, and the ledgers can prove it.',
        'With the stores replenished, the ruler came clean; the traded rations were accounted, and the seat ate last for a while by way of answer.',
      ],
      historicized: [
        'The stores were refilled, but the ruler still runs relief by favor; the famine arithmetic outlived the famine.',
      ],
      'exposed-public': [
        'It is public that the ruler fed loyalty first while the reserve ran dry, and the households that went hungry are reading the lists.',
        "The distribution lists are out, and the ruler's hand is plain in them: scarcity was spent like coin, and the town knows on whom.",
      ],
      're-adjudicated': [
        "The syndicate is destroyed, but the reserve is still empty, and command of the ration has taken up the ruler's arrangement in its place.",
      ],
    },
    'trade-strangled': {
      attributed: [
        "The embargo strangles the town's trade, except where the ruler's seal makes exceptions; the exemptions are sold in private audience.",
        'Trade is forbidden by decree and permitted by purchase: the ruler signs the embargo with one hand and its exceptions with the other.',
      ],
      're-caused': [
        'What first held the ruler has passed; the embargo holds them now, and each sealed exemption renews the arrangement.',
      ],
      reformed: [
        'The embargo lifted and the exemption trade died with it; the ruler published the old grants unprompted and took the anger standing.',
        'With the routes reopened, the ruler came clean; the sealed exceptions were revoked, and the seal itself changed keepers.',
      ],
      historicized: [
        'The embargo is lifted, but the ruler still sells exceptions to rules that no longer bind; the practice survived its purpose.',
      ],
      'exposed-public': [
        'It is public that the ruler sold exemptions from the embargo they enforced, and the merchants who starved lawfully are the loudest in the square.',
        'The double game is out: the ruler kept the embargo strict to keep the exemptions dear, and the town has the sealed proof.',
      ],
      're-adjudicated': [
        "The old patron is gone, but the trade is still strangled, and the exemption market has passed to the ruler's new creditors with the rest.",
      ],
    },
    'levied-away': {
      attributed: [
        "The town's strength is at war, and the ruler governs the remainder unwatched; powers the council never granted have been quietly annexed to the seat.",
        'With the fighting men levied away, no one is left to refuse the ruler anything, and the seizures have started dressing themselves as decrees.',
      ],
      're-caused': [
        "The ruler's first cause resolved, but the levy emptied the town of objection, and the arrangement now rests on the absence alone.",
      ],
      reformed: [
        'The companies returned and the ruler laid the annexed powers down; what absence had permitted was handed back before it was demanded.',
        'When the strength came home, the ruler came clean; the wartime decrees were repealed in a sitting, and the seizures reversed.',
      ],
      historicized: [
        'The strength is home, but the annexed powers were never returned; the empty season ended and the seat kept its winnings.',
      ],
      'exposed-public': [
        'The returned companies have learned what the ruler decreed while they were away, and the wartime seizures are being read out at the cross.',
        "It is public that the ruler governed the empty town for the seat's own gain, and the veterans want back what was taken in their absence.",
      ],
      're-adjudicated': [
        "The syndicate fell, but the strength is still levied away, and the unwatched seat itself now sustains the ruler's arrangement.",
      ],
    },
    'garrison-drained': {
      attributed: [
        'The garrison cannot enforce the law, so the ruler borrows enforcement from private muscle; the law now looks away wherever its lenders work.',
        "With the garrison hollow, the ruler's decrees are carried out by hired hands, and the hire is paid in blindness to their other business.",
      ],
      're-caused': [
        "The ruler's first reason passed, but the garrison hollowed behind it, and the borrowed muscle now holds the arrangement in place.",
      ],
      reformed: [
        'The garrison was refilled and the ruler dismissed the private muscle; the law stopped looking away, starting with its former lenders.',
        'With the ranks restored, the ruler came clean; the enforcement debts were paid off in coin, not in blindness, and closed.',
      ],
      historicized: [
        'The garrison stands full again, but the private muscle was never dismissed; the ruler keeps them the way one keeps old debts.',
      ],
      'exposed-public': [
        'It is public that the ruler paid for order with legal blindness, and the crimes the law overlooked are being listed beside the decrees it enforced.',
        "The town knows now whose hands carried the ruler's law while the garrison stood empty, and what those hands were allowed in return.",
      ],
      're-adjudicated': [
        "The old paymaster is destroyed, but the garrison is still drained, and the enforcement gap has simply assigned the ruler's debt to new muscle.",
      ],
    },
    'siege-scarred': {
      attributed: [
        "The war levies flow through the ruler's hands, and not all of them flow out; the walls are one course lower than the accounts say.",
        "Under the war's pressure the ruler taxes for defense and spends for the seat; the difference is buried in the emergency.",
      ],
      're-caused': [
        "The ruler's old cause cleared, but the war pressed in, and the emergency levies now feed the arrangement they did not start.",
      ],
      reformed: [
        "The war receded and the ruler published the defense accounts entire; the missing course of the wall was rebuilt from the seat's own purse.",
        'With the pressure lifted, the ruler came clean about the levies; what the emergency had hidden was repaid in the open.',
      ],
      historicized: [
        'The war has moved on, but the emergency levies were never retired; the ruler collects for walls that no longer need them.',
      ],
      'exposed-public': [
        'It is out that the ruler skimmed the war levies, and the town is measuring its walls against its receipts.',
        "The defense accounts are public now, and short: the ruler spent the town's fear on the seat, and the town has done the subtraction.",
      ],
      're-adjudicated': [
        "The syndicate is broken, but the war still presses, and the levy stream has carried the ruler's arrangement to new hands.",
      ],
    },
    occupation: {
      attributed: [
        "The ruler keeps the seat by the occupier's leave, and earns the leave daily: requisitions signed, resisters named, appearances kept.",
        'The occupier prefers a native hand on the seal, and the ruler prefers keeping the seal; the town pays for the preference of both.',
      ],
      're-caused': [
        "What first compromised the ruler is gone; the occupier's leave sustains the seat now, and the seat sustains the arrangement.",
      ],
      reformed: [
        'The occupier withdrew and the ruler ended the accommodation, then laid the whole record of it before the council unasked.',
        'With the occupation ended, the ruler came clean; whatever the seat had signed under the occupier was published, and the town judged it.',
      ],
      historicized: [
        'The occupier is gone, but the ruler still governs as if reporting to them; the habit of leave-asking survived its master.',
      ],
      'exposed-public': [
        'It is public what the ruler signed to keep the seat under the occupier, and each requisition now has families attached to it.',
        "Collaboration is said openly of the ruler now; the occupier's records marched away, but copies stayed, and they are being read.",
      ],
      're-adjudicated': [
        "The ruler's old paymaster is destroyed, but the occupier remains, and their administration holds the seat's debt now.",
      ],
    },
    'conduct-drift': {
      attributed: [
        "A dark patron stands behind the seat, and it rewards the ruler's worst instincts; each unjust decree returns as favor, protection, and quiet.",
        "The ruler's cruelties have a sponsor: a patron that counts oppression as offering, and settles accounts in power.",
      ],
      're-caused': [
        "The ruler's first cause resolved, but a patron that rewards the deed adopted the arrangement, and its favor now underwrites the seat.",
      ],
      reformed: [
        "The patron's shadow passed and the ruler set the cruelty down; unsponsored, the decrees read as plainly as crimes, and were repealed.",
        'With the rewarding patron gone, the ruler came clean; the seat renounced the favors and the deeds that had earned them together.',
      ],
      historicized: [
        "The patron is gone, but the ruler's decrees kept its flavor; the sponsorship ended and the style stayed.",
      ],
      'exposed-public': [
        "It is public that the ruler's oppressions were offerings to a dark patron, and the town is naming each decree it endured as one.",
        "The sponsorship is out: the seat served a patron that paid for cruelty, and the ruler's justice is being re-read as liturgy.",
      ],
      're-adjudicated': [
        "The syndicate fell, but the patron that rewards the deed still stands, and the seat's arrangement passed into its keeping entire.",
      ],
    },
    'conversion-pressure': {
      attributed: [
        "The rival faith is buying policy, and the ruler is selling it: edicts tilt toward the converts, and their temple's petitions never wait.",
        "The rival mission's purse reaches the seat, and the seat leans; land, licenses, and rulings drift their way one signature at a time.",
      ],
      're-caused': [
        "The ruler's first reason passed; the rival faith's patronage replaced it, and the tilt of the edicts is the receipt.",
      ],
      reformed: [
        'The rival faith withdrew and the ruler straightened the edicts; the bought tilt was repealed measure by measure, in public.',
        'When the conversion pressure broke, the ruler came clean; the patronage was returned and the leaning rulings reversed.',
      ],
      historicized: [
        'The rival faith gave up the town, but the edicts still lean where its purse once pointed; the ruler never straightened them.',
      ],
      'exposed-public': [
        'It is out that the rival faith paid the seat for its edicts, and both congregations are re-reading every ruling of the tenure.',
        'The patronage is public: the ruler sold the tilt of the law to the rival mission, and the sold rulings are being listed at the temple doors.',
      ],
      're-adjudicated': [
        "The old patron is gone, but the rival faith still presses, and its purse has taken up the seat's arrangement without a pause.",
      ],
    },
    secularization: {
      attributed: [
        'The oath of office was sworn before a god no one fears anymore, and the ruler governs accordingly; what the oath forbade is now merely impolite.',
        'With the faith gone cold, nothing consecrates the seat but habit, and the ruler has been testing what habit alone will bear.',
      ],
      're-caused': [
        "The ruler's first cause resolved, but the faith went cold around the seat, and the arrangement continued because nothing sacred remained to object.",
      ],
      reformed: [
        'The faith revived and the ruler put the seat back under its oath; what the cold season had loosened was bound again, first.',
        'When belief returned, the ruler came clean; the oath of office was re-sworn at the altar, and this time the town watched.',
      ],
      historicized: [
        'The faith warmed again, but the ruler never re-swore the oath; the cold that freed the seat has passed, and the seat stayed free.',
      ],
      'exposed-public': [
        'It is public what the ruler did while the god of the oath went unfeared, and the reviving faithful read the tenure as one long trespass.',
        'The town knows now that when the faith went cold the seat went with it; the record of that season is out, and the ruler is in it.',
      ],
      're-adjudicated': [
        "The ruler's paymaster fell, but the faith is still cold, and no revived oath exists that might have ended the seat's arrangement.",
      ],
    },
    'clergy-scandal': {
      attributed: [
        "The ruler holds the temple's disgrace like a deed of title; the tainted priests keep their pulpits, and the seat keeps a share of the tithe.",
        'What the ruler knows about the clergy would empty the temple, so the temple pays the seat in obedience and silver both.',
      ],
      're-caused': [
        "The ruler's first reason resolved, but the tainted priesthood offered another, and the seat now farms the temple's shame like revenue.",
      ],
      reformed: [
        'The priesthood was cleansed and the leverage died; the ruler released the temple and returned the shame-bought tithe.',
        "With the clergy's scandal resolved, the ruler came clean; the hold over the temple was surrendered with the silver.",
      ],
      historicized: [
        'The temple was set in order, but the ruler never released it; the disgrace lapsed and the leverage was kept.',
      ],
      'exposed-public': [
        "It is out that the ruler farmed the temple's disgrace for tithe and obedience, and priest and prince are now disgraced together.",
        "The town has learned the seat blackmailed the altar; the clergy's scandal was the ruler's revenue, and both books are open.",
      ],
      're-adjudicated': [
        "The syndicate is gone, but the priesthood's taint remains, and the trade in its silence now runs through hands that hold the ruler too.",
      ],
    },
    captured: {
      attributed: [
        "The underworld owns this seat the way it owns the rest: the ruler's appointments come with names attached, and the names are never the ruler's choice.",
        "The town is governed twice, once from the seat and once from below it, and the ruler signs for both; the syndicate's writ arrives already sealed.",
      ],
      're-caused': [
        "The ruler's old cause resolved, but the underworld holds the offices now, and a seat it holds is not resigned, only serviced.",
      ],
      reformed: [
        'The capture was broken and the ruler stood out from under it; the attached appointments were dismissed in a single sitting.',
        "With the syndicate's grip broken, the ruler came clean; the sealed instructions were laid before the council as evidence.",
      ],
      historicized: [
        'The capture was broken, but the ruler still governs as the syndicate taught; the instructions stopped and the pattern did not.',
      ],
      'exposed-public': [
        'It is public that the seat answered to the underworld, and every appointment of the tenure is being traced to its true author.',
        'The capture has reached the ruler by name: the town knows its decrees were drafted below, and knows whose hand signed them anyway.',
      ],
      're-adjudicated': [
        'The syndicate that owned the seat is destroyed, but the offices are still captured, and the ruler passed to the new holders with the town.',
      ],
    },
    scandal: {
      attributed: [
        'Since the scandal broke, the ruler has run the reckoning as a market: prosecutions are priced, pardons are priced higher, and the seat collects both ways.',
        'The scandal gave the ruler a new revenue: the guilty pay to be forgotten and the innocent pay to be believed, and the seat books it all.',
      ],
      're-caused': [
        "The ruler's first cause cleared, but the scandal broke behind it, and its economy of pardons and prosecutions has adopted the seat's arrangement.",
      ],
      reformed: [
        'The scandal burned out and the ruler came clean; the priced pardons were annulled and the bought prosecutions dismissed, whatever it cost the seat.',
        'When the scandal settled, the ruler ended the market in mercy; the last payments were returned with the verdicts unbought.',
      ],
      historicized: [
        'The scandal is old news, but the seat still prices mercy; the panic that set the market is long settled.',
      ],
      'exposed-public': [
        'It is out that the ruler sold pardons through the scandal, and the town is matching verdicts to payments in the open.',
        'The scandal has circled back to the seat: the reckoning itself was for sale, and the ruler was the seller.',
      ],
      're-adjudicated': [
        "The syndicate is broken, but the scandal's economy survives it, and the seat's market in mercy has new silent partners.",
      ],
    },
  },
  // ── heir — the claimant (succession, allowance, backers, the family seat) ───
  heir: {
    underfunded: {
      attributed: [
        'The allowance was cut and the claimant kept the style of an heir anyway; the difference is borrowed against the succession, from people who collect early.',
        'An heir with empty pockets is a door waiting to be knocked on, and the claimant has answered it; the inheritance is pledged twice over already.',
      ],
      're-caused': [
        'What first entangled the claimant has passed; it is the cut allowance that holds them now, and the creditors know a starved heir keeps signing.',
      ],
      reformed: [
        'The allowance was restored and the claimant bought the debts back; the succession is pledged to no one, for the first time in memory.',
        'With the family purse reopened, the claimant came clean, named the creditors, and paid them off in front of witnesses.',
      ],
      historicized: [
        'The allowance came back, but the claimant kept borrowing against the seat; the shortage that began it is old history.',
      ],
      'exposed-public': [
        'It is public that the claimant pledged the inheritance to moneylenders, and the family is learning how much of its future is already spent.',
        "The claimant's debts are out, and their shape is worse than their size: the succession itself was the collateral.",
      ],
      're-adjudicated': [
        "The syndicate holding the claimant's paper is destroyed, but the allowance is still short, and the debt has found its way to new and patient hands.",
      ],
    },
    'chain-starved': {
      attributed: [
        "The family trade starves on the broken supply lines, and the claimant has kept it breathing with pledged favors; the suppliers hold promises signed against the seat's future.",
        'When the wagons stopped, the claimant promised tomorrow to pay for today; the house eats, and its next ruler is already spoken for.',
      ],
      're-caused': [
        "The claimant's first entanglement resolved, but the supply lines broke after, and the promised favors that fill the gap now carry the arrangement.",
      ],
      reformed: [
        'The supply lines were restored and the claimant bought back every pledged favor; the succession owes nothing it did not choose.',
        'With the wagons running again, the claimant came clean to the family about what had been promised, and unwound it piece by piece.',
      ],
      historicized: [
        'The trade routes are mended, but the pledged favors were never redeemed; the claimant lets them stand like old fenceposts.',
      ],
      'exposed-public': [
        'It is out that the claimant mortgaged the future of the house to keep its trade alive, and the promised favors are being tallied in public.',
        "The suppliers have shown their paper: the claimant's signature, pledging the seat's favor for wagonloads, and the family is counting the cost.",
      ],
      're-adjudicated': [
        'The old creditor is destroyed, but the supply lines are still cut, and the pledged favors have passed to whoever moves goods now.',
      ],
    },
    depleted: {
      attributed: [
        'The estate stores are empty, and the claimant has been quietly selling what the family thinks it still owns; the plate is pewter now, and the vault echoes.',
        "Scarcity reached the great house too, and the claimant met it the quiet way: heirlooms out the back door, and the entail's edges trimmed for coin.",
      ],
      're-caused': [
        'What first held the claimant has passed; the empty stores hold them now, and each sold heirloom buys another season of appearances.',
      ],
      reformed: [
        'The stores recovered and the claimant stopped the sales; what could be bought back was, and the rest was confessed to the family.',
        'With the estate replenished, the claimant came clean about the emptied vault; the accounting was ugly and complete.',
      ],
      historicized: [
        'The estate recovered, but the claimant never stopped the quiet sales; the scarcity that excused them is long past need.',
      ],
      'exposed-public': [
        'It is public that the claimant sold the heirlooms while the stores ran dry, and the family is inventorying a vault it no longer recognizes.',
        "The quiet sales are out: the claimant traded the house's memory for its meals, and kept the difference.",
      ],
      're-adjudicated': [
        "The syndicate is gone, but the stores are still empty, and the trade in the house's remnants has found the claimant new buyers.",
      ],
    },
    'trade-strangled': {
      attributed: [
        "The family fortune lives on trade, and trade is strangled, so the claimant runs the embargo under the family name; the house's caravans are searched by reputation only.",
        'The embargo would have beggared the house, and the claimant declined to be beggared; the family colors now cover cargo the law has banned.',
      ],
      're-caused': [
        "The claimant's first cause resolved, but the embargo followed it, and the family-flagged contraband now pays for the arrangement's keep.",
      ],
      reformed: [
        'The embargo lifted and the claimant grounded the night caravans; the family name covers only lawful freight again.',
        'When trade reopened, the claimant came clean; the contraband runs were confessed to the family before any inspector found them.',
      ],
      historicized: [
        'The routes are open again, but the claimant still runs the quiet cargo; the embargo that justified it is a story now.',
      ],
      'exposed-public': [
        "It is public that the family colors covered contraband through the embargo, and the claimant's name is on the manifests.",
        "The house's caravans are being searched at last, and the town knows why they never were before; the claimant spent the family's honor as freely as its seal.",
      ],
      're-adjudicated': [
        'The old partner is destroyed, but the trade is still strangled, and the family-flagged runs have new handlers who know what the claimant signed.',
      ],
    },
    'levied-away': {
      attributed: [
        "The men who would have watched the succession are away at war, and the claimant is moving on it early; witnesses vanish, documents shift, and no one armed is left to mind the claimant's manners.",
        'With the strength levied away, the claimant has been rearranging the inheritance unobserved; the war took every eye that mattered.',
      ],
      're-caused': [
        "The claimant's first cause resolved, but the levy emptied the house of watchers, and the arrangement continues on the absence alone.",
      ],
      reformed: [
        'The companies came home and the claimant undid the quiet moves; the shifted documents were restored before anyone thought to look.',
        'When the strength returned, the claimant came clean to the family; what absence had made easy, presence made shameful.',
      ],
      historicized: [
        'The watchers are home, but the moves the claimant made in the empty season were never unmade; the absence has ended and its winnings stand.',
      ],
      'exposed-public': [
        'The returned soldiers have learned what the claimant did to the succession while they were gone, and the shifted papers are being unshifted in public.',
        'It is out that the claimant worked the inheritance while the strength was at war, and the family is reading the amended documents aloud.',
      ],
      're-adjudicated': [
        "The syndicate fell, but the strength is still levied away, and the unwatched succession itself now keeps the claimant's arrangement alive.",
      ],
    },
    'garrison-drained': {
      attributed: [
        'With the garrison hollow, the claimant hired private blades for protection, and pays them in promises: land, office, pardon, whatever the seat may someday grant.',
        'The claimant walks safe through a lawless town because hired steel walks behind, and the hire is written against the inheritance.',
      ],
      're-caused': [
        "The claimant's first entanglement passed, but the garrison hollowed after, and the hired blades now collect the arrangement's dues.",
      ],
      reformed: [
        'The garrison was refilled and the claimant paid the blades off in honest coin, canceling every promised favor with witnesses present.',
        'With the ranks restored, the claimant came clean; the promissory protection was dissolved and the blades dismissed.',
      ],
      historicized: [
        'The garrison stands full again, but the claimant keeps the private blades; the danger that hired them is past.',
      ],
      'exposed-public': [
        'It is public that the claimant promised offices and pardons to hired steel, and the town is asking what else the succession has already sold.',
        "The claimant's bodyguard contract is out: paid in the seat's future favors, and the seat does not yet belong to the claimant to promise.",
      ],
      're-adjudicated': [
        'The old paymaster is destroyed, but the garrison is still drained, and the hired blades have simply presented their promises to new management.',
      ],
    },
    'siege-scarred': {
      attributed: [
        "The war is pressing, and the claimant has been promising the seat's allegiance in advance, to both sides, in writing; whoever wins, a letter exists.",
        "Under the war's pressure the claimant insures the succession the old way: quiet pledges to every camp, priced in the house's future loyalty.",
      ],
      're-caused': [
        "The claimant's first cause cleared, but the war pressed in, and the insurance letters now hold the arrangement in place.",
      ],
      reformed: [
        'The war receded and the claimant burned the pledge letters, both sets, and told the family what had been written.',
        'With the pressure lifted, the claimant came clean; the promised allegiances were recalled before either side could collect.',
      ],
      historicized: [
        'The war moved on, but the pledge letters were never recalled; the claimant keeps them the way gamblers keep old markers.',
      ],
      'exposed-public': [
        'It is out that the claimant pledged the seat to both camps during the war, and each side has produced its letter.',
        "The insurance is public: the claimant's signature promising allegiance twice over, and the house's word now trades at a discount.",
      ],
      're-adjudicated': [
        'The syndicate is broken, but the war still presses, and the pledge letters have found their way into new hands that expect honoring.',
      ],
    },
    occupation: {
      attributed: [
        'The occupier has promised the claimant the succession, and the claimant earns it weekly: names, movements, and the mood of the family table, all reported.',
        "The claimant's path to the seat now runs through the occupation office, and the toll is information about everyone who trusts them.",
      ],
      're-caused': [
        "What first compromised the claimant is gone; the occupier's promise of the seat sustains the arrangement now, and the reports keep flowing.",
      ],
      reformed: [
        'The occupier withdrew and the claimant confessed the reports to the family, every one; the promised succession was renounced with them.',
        'With the occupation ended, the claimant came clean about the bargain; the seat was to be the fee, and the family now knows for what.',
      ],
      historicized: [
        'The occupier is gone, but the claimant still keeps the informer\'s habits; the promise that trained them expired with the occupation.',
      ],
      'exposed-public': [
        "It is public that the claimant informed for the occupier against a promise of the seat, and the family is reading the reports with their names in them.",
        'The bargain is out: the succession for surveillance, and every arrest in the household during the occupation now has an author.',
      ],
      're-adjudicated': [
        "The claimant's old paymaster is destroyed, but the occupier remains, and the promise of the seat has been reissued by their administration.",
      ],
    },
    'conduct-drift': {
      attributed: [
        "A dark patron favors the claimant's ambition and rewards its shortcuts; each rival quietly ruined comes back as blessing and standing.",
        "The claimant's path to the seat is being cleared by methods a house should refuse, and a patron that loves the methods keeps paying for more.",
      ],
      're-caused': [
        "The claimant's first cause resolved, but a patron that rewards the deed took up the arrangement, and its favor now finances the ambition.",
      ],
      reformed: [
        "The patron's shadow lifted and the claimant stopped clearing the path; unblessed, the ruined rivals were made whole where coin could do it.",
        'With the rewarding patron gone, the claimant came clean; the ambition remains, but it walks in daylight now.',
      ],
      historicized: [
        'The patron is gone, but the claimant kept its methods; the blessing lapsed and the shortcuts stayed open.',
      ],
      'exposed-public': [
        "It is public that the claimant's rivals fell to sponsored ruin, and the town is re-reading each misfortune as an offering.",
        "The sponsorship is out: a dark patron paid for the claimant's clear path, and the family is asking what was promised in return.",
      ],
      're-adjudicated': [
        "The syndicate fell, but the patron that rewards the deed still stands, and the claimant's ambition passed into its keeping.",
      ],
    },
    'conversion-pressure': {
      attributed: [
        "The rival faith backs the claimant's succession, and the price is posted nowhere but understood: the house's altar changes hands with the seat.",
        "The claimant's claim has foreign prayers behind it now; the rival mission funds the lawyers and expects the family chapel in return.",
      ],
      're-caused': [
        "The claimant's first cause passed; the rival faith's backing replaced it, and the promised chapel keeps the arrangement standing.",
      ],
      reformed: [
        'The rival faith withdrew and the claimant returned the backing; the chapel stays as it was, and the claim stands on its own.',
        'When the conversion pressure broke, the claimant came clean about the promised altar, and the family reconsecrated it to be sure.',
      ],
      historicized: [
        "The rival faith gave up the town, but the claimant never returned the backing; the promised chapel is a debt nobody has collected.",
      ],
      'exposed-public': [
        "It is out that the rival faith funds the claimant's suit, and what was promised for it; the family altar has become the town's business.",
        "The backing is public: the claimant sold the house's faith for the house's seat, and both congregations have opinions.",
      ],
      're-adjudicated': [
        "The old patron is gone, but the rival faith still presses, and its purse has assumed the claimant's debts along with the promised altar.",
      ],
    },
    secularization: {
      attributed: [
        'The succession oaths were sworn before a god this town has stopped fearing, and the claimant has noticed; witnesses are being bought whom an oath once made unnecessary.',
        'With the faith gone cold, the old vows binding the succession bind nothing, and the claimant has been amending history accordingly.',
      ],
      're-caused': [
        "The claimant's first cause resolved, but the faith went cold behind it, and with no oath left standing, the arrangement simply persisted.",
      ],
      reformed: [
        'The faith revived and the claimant re-swore the succession vows at the altar, and dismissed the bought witnesses unpaid.',
        'When belief returned, the claimant came clean; the amended history was unamended, and the vows given weight again.',
      ],
      historicized: [
        'The faith warmed again, but the bought witnesses were never dismissed; the cold season that hired them is over.',
      ],
      'exposed-public': [
        'It is public that the claimant bought witnesses while the oaths meant nothing, and the reviving faith has made the succession its test case.',
        "The amendments are out: the claimant reworked the family record in the faithless season, and the restored congregation wants it reworked back.",
      ],
      're-adjudicated': [
        "The claimant's paymaster fell, but the faith is still cold, and no oath has revived that might shame the arrangement into ending.",
      ],
    },
    'clergy-scandal': {
      attributed: [
        'The tainted priests will consecrate anything for the right fee, and the claimant has been a steady customer; the succession gathers blessings it did not earn.',
        "A disgraced clergy still holds the seals of legitimacy, and the claimant buys impressions of them; the house's papers grow holier by the month.",
      ],
      're-caused': [
        "The claimant's first reason resolved, but the tainted priesthood offered its services, and the bought consecrations now hold the arrangement up.",
      ],
      reformed: [
        'The priesthood was cleansed and the claimant surrendered the bought blessings; the claim stands now on blood and law alone.',
        "With the clergy's scandal resolved, the claimant came clean; the purchased consecrations were annulled at the claimant's own request.",
      ],
      historicized: [
        'The temple was set in order, but the bought blessings were never surrendered; the disgrace that sold them is mended and the claimant kept the goods.',
      ],
      'exposed-public': [
        'It is out that the claimant bought consecrations from the tainted clergy, and every blessing on the succession is being re-examined.',
        "The receipts are public: the claimant paid disgraced priests to sanctify the claim, and the town now doubts the holy and the legal parts alike.",
      ],
      're-adjudicated': [
        "The syndicate is gone, but the priesthood's taint remains, and the trade in bought blessings has found the claimant new brokers.",
      ],
    },
    captured: {
      attributed: [
        'The underworld has chosen its candidate, and it is the claimant; the backing is real, the muscle is real, and so will be the collecting, the day the seat is won.',
        "The claimant's suit is financed from below; the syndicate buys the succession the way it bought the offices, and the claimant signed the terms.",
      ],
      're-caused': [
        "The claimant's old cause resolved, but the underworld holds the town's offices now, and a candidate it holds is not released, only advanced.",
      ],
      reformed: [
        "The capture was broken and the claimant tore up the syndicate's terms; the suit continues on lawful money, or not at all.",
        "With the underworld's grip broken, the claimant came clean; the signed terms were handed to the magistrates as evidence.",
      ],
      historicized: [
        'The capture was broken, but the claimant still owes the habits of that backing; the syndicate is gone and its manners remain.',
      ],
      'exposed-public': [
        "It is public that the underworld finances the claimant's suit, and the signed terms are abroad; the seat now comes with a lien attached.",
        "The backing is out: the claimant took the syndicate's silver for the succession, and the town knows who would really have been crowned.",
      ],
      're-adjudicated': [
        'The syndicate that backed the claimant is destroyed, but the offices are still captured, and the new holders have re-signed the old terms.',
      ],
    },
    scandal: {
      attributed: [
        'The scandal wounded the incumbent, and the claimant has been feeding it; the dirt arrives fresh and curated, and none of it touches the claimant by accident.',
        "The claimant did not start the scandal, but has become its quartermaster: supplying evidence to the loudest mouths and buying up whatever implicates the claim.",
      ],
      're-caused': [
        "The claimant's first cause cleared, but the scandal broke behind it, and trading in its evidence now sustains the arrangement.",
      ],
      reformed: [
        'The scandal burned out and the claimant came clean; the curated evidence was handed over whole, the flattering and the damning together.',
        'When the scandal settled, the claimant stopped the trade; what had been bought to bury the claim was published by the claimant first.',
      ],
      historicized: [
        'The scandal is old news, but the claimant still curates it; the wound it opened in the incumbent has scarred over.',
      ],
      'exposed-public': [
        "It is out that the claimant fed the scandal and bought silence on the claim's own sins, and the town is reading both ledgers.",
        'The scandal has turned on its quartermaster: the claimant supplied the fire and hid from the smoke, and everyone can smell it now.',
      ],
      're-adjudicated': [
        "The syndicate is broken, but the scandal's economy survives, and the claimant's file of bought evidence has changed custodians.",
      ],
    },
  },
  // ── merchant — the guildmaster (ledgers, warehouses, caravans, weights) ─────
  merchant: {
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
  },
  // ── religious — the priest (altar, tithes, rites, congregation) ─────────────
  religious: {
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
  },
  // ── criminal — the boss (crews, tribute, territory, the trade's own code) ───
  criminal: {
    underfunded: {
      attributed: [
        'The tribute runs thin when the town runs poor, and the boss found a patron uptown; the crews still answer to him, but he answers to a purse he will not name.',
        'Hard times starved the rackets, and the boss took a stipend to keep his crews fed; whoever pays it now picks some of the jobs.',
      ],
      're-caused': [
        'What first leashed the boss has passed; the thin tribute leashes him now, and the uptown stipend arrives as regularly as the rent.',
      ],
      reformed: [
        'The money came back to the streets and the boss bought out his stipend; the crews answer to him alone again, and the last picked job was refused.',
        'With the rackets earning again, the boss cut the patron off; the debt was paid in full, in public, so every crew could see it.',
      ],
      historicized: [
        'The tribute recovered, but the boss kept the stipend; the hunger that signed him is long fed.',
      ],
      'exposed-public': [
        'It is out on the streets that the boss ran on uptown money through the lean stretch, and the crews are asking who really picked the jobs.',
        "The stipend is public now, and the boss's own people learned it last; a leashed boss is a short-lived kind.",
      ],
      're-adjudicated': [
        'The paymaster who held the boss is destroyed, but the streets are still poor, and the stipend has been reissued from a new purse.',
      ],
    },
    'chain-starved': {
      attributed: [
        'The contraband lines broke with the roads, and only one supplier still delivers; the boss takes their terms because there are no others, and the terms grow teeth.',
        'The trade needs goods and the goods stopped moving, so the boss deals with the single hand that can still move them, on that hand\'s terms.',
      ],
      're-caused': [
        "The boss's first hold has passed; the dead supply lines hold him now, and the only supplier left writes the terms.",
      ],
      reformed: [
        'The routes reopened and the boss walked from the exclusive terms; with three suppliers to choose from, he chose to owe none of them.',
        'When goods moved freely again, the boss broke the arrangement; the monopoly that held him died the day the second wagon arrived.',
      ],
      historicized: [
        'The routes are open again, but the boss never left the old supplier; the monopoly that gripped him is a courtesy now.',
      ],
      'exposed-public': [
        'It is known in every den that the boss ran on one supplier\'s sufferance, and rivals are courting that supplier by name.',
        "The terms are out: the boss's trade belonged to whoever fed it, and the streets have learned who was feeding.",
      ],
      're-adjudicated': [
        'The old supplier is destroyed, but the lines are still dead, and whoever moves goods now inherited the boss with the route.',
      ],
    },
    depleted: {
      attributed: [
        'There is nothing left to steal and less to fence, and the boss holds his seat the cheap way: by selling names. His people fall one by one, always the ones who questioned him.',
        'The trade starved when the town did, and the boss kept his chair on informant\'s wages; each name he gives buys another month at the table.',
      ],
      're-caused': [
        "The boss's first hold passed; the starved trade holds him now, and the names keep the chair beneath him.",
      ],
      reformed: [
        'The trade came back and the boss stopped selling names; the last list was burned unsent, and he told the crews what he had been.',
        'With the streets earning again, the boss came clean to his own; whoever was owed vengeance got to choose it, and the chair survived by honesty alone.',
      ],
      historicized: [
        'The trade recovered, but the boss still trades a name now and then; the famine that taught him the habit has passed.',
      ],
      'exposed-public': [
        'It is out that the boss sold his own people through the lean stretch, and the fallen crews\' kin are done asking politely.',
        "The names have been counted and they all point to the chair; the boss fed his people to the law and called it hard times.",
      ],
      're-adjudicated': [
        'The syndicate above the boss is destroyed, but the trade is still starved, and the name-selling has found a new buyer already.',
      ],
    },
    'trade-strangled': {
      attributed: [
        'The embargo made the boss rich and the cartel that runs it made him theirs; he holds his territory as a tenant now, and the rent is obedience.',
        'Strangled trade is the best trade the boss ever had, and the worst bargain; the cartel that owns the routes owns him with them.',
      ],
      're-caused': [
        "The boss's first hold has passed; the embargo holds him now, and the cartel that runs it holds the lease on his streets.",
      ],
      reformed: [
        'The embargo lifted and the cartel\'s grip lifted with it; the boss bought his territory back outright and returned to trades that are merely illegal.',
        'When honest cargo moved again, the boss walked from the cartel; the tenancy ended the day their monopoly did.',
      ],
      historicized: [
        'The embargo is done, but the boss still pays the cartel\'s rent; the monopoly that set it has dissolved and the habit has not.',
      ],
      'exposed-public': [
        'It is out that the boss held his streets as the cartel\'s tenant, and every crew in town is rereading its oaths to him.',
        "The lease is public: the embargo's cartel owned the boss's territory, and the boss signed the terms with his own mark.",
      ],
      're-adjudicated': [
        'The cartel is destroyed, but the trade is still strangled, and the tenancy has passed to whoever inherited the routes.',
      ],
    },
    'levied-away': {
      attributed: [
        'The levy pressed half his muscle into uniform, and a boss without muscle takes orders; he became somebody\'s creature the week his enforcers marched.',
        'With his strength levied away to war, the boss cannot hold what he claims, so he holds it by permission; the permission has conditions, and he meets them.',
      ],
      're-caused': [
        "The boss's first hold passed; the levy that emptied his crews holds him now, and permission is the only muscle he has left.",
      ],
      reformed: [
        'The crews came home from the war and the boss stood back up; the permissions were returned unthanked, and the conditions with them.',
        'When his muscle marched back, the boss ended the arrangement; a boss who can hold his own streets again did.',
      ],
      historicized: [
        'The enforcers are home, but the boss still works by permission; the weakness that begged it has healed over.',
      ],
      'exposed-public': [
        'It is out that the boss ran his streets on borrowed leave while his muscle was at war, and the returned enforcers know whose leave it was.',
        "The conditions are public: the boss knelt when the levy emptied his crews, and the streets remember who he knelt to.",
      ],
      're-adjudicated': [
        'The patron who held the boss is destroyed, but the muscle is still levied away, and the permission has been reissued by other hands.',
      ],
    },
    'garrison-drained': {
      attributed: [
        'The hollow garrison should have been the boss\'s harvest, but the vacuum drew bigger crews from outside; he keeps his patch by paying tribute up to strangers.',
        'When the garrison drained, the real predators arrived, and the boss made his peace early; his take flows upward now, and his orders flow down from men he has never met.',
      ],
      're-caused': [
        "The boss's first hold passed; the drained garrison holds him now, for the vacuum it left filled with crews he cannot fight.",
      ],
      reformed: [
        'The garrison was refilled and the outside crews thinned out; the boss stopped the upward tribute and held his patch as his own again.',
        'With the watch restored, the boss ended the arrangement; the strangers lost their leverage the day the patrols resumed.',
      ],
      historicized: [
        'The garrison stands again and the outside crews are gone, but the boss still sends the tribute up; no one has told him to stop, so he has not.',
      ],
      'exposed-public': [
        'It is out that the boss paid tribute to outside crews for his own streets, and his people are asking what exactly he was boss of.',
        "The upward payments are public: the boss rented his patch from strangers while the garrison stood empty, and the receipts went uptown.",
      ],
      're-adjudicated': [
        'The outside syndicate is destroyed, but the garrison is still drained, and the vacuum has already priced the boss\'s patch for new landlords.',
      ],
    },
    'siege-scarred': {
      attributed: [
        'The war closed the roads to everyone but his runners, and the boss carried messages through the lines for both armies; each side holds his receipts, which makes him twice owned.',
        'Under the war\'s pressure the boss found the best margin of his life: courier for both camps. The pay was heavy, and so is what they each know about the other runs.',
      ],
      're-caused': [
        "The boss's first hold cleared, but the war pressed in, and the two-camp courier trade now holds him tighter than any oath.",
      ],
      reformed: [
        'The war receded and the boss burned both sets of receipts in front of witnesses from both camps; the courier trade closed with the lines.',
        'With the pressure lifted, the boss ended it; the last messages were delivered unread, and the retainers returned to both paymasters.',
      ],
      historicized: [
        'The war moved on, but both armies still hold the receipts; the boss works his streets with two swords over his head, by habit now.',
      ],
      'exposed-public': [
        'It is out that the boss couriered for both camps through the fighting, and each army has published the other\'s receipts.',
        "The double courier trade is public: the boss sold passage to enemies of each other, and the whole town knows who else he would sell.",
      ],
      're-adjudicated': [
        'The syndicate is broken, but the war still presses, and the courier receipts have passed to hands that intend to collect on them.',
      ],
    },
    occupation: {
      attributed: [
        'The occupier tolerates the boss\'s rackets, and the toleration is billed monthly: names of resisters, safe houses, and whoever asked his crews for help.',
        'The occupation could have crushed the trade in a week, and did not; the boss pays for the mercy in informations, and his crews do not know they carry it.',
      ],
      're-caused': [
        "What first held the boss is gone; the occupier's tolerance holds him now, and the informations are the rent.",
      ],
      reformed: [
        'The occupier withdrew and the boss stood before the crews with the whole account: what was traded, who was named, and his throat offered with it.',
        'With the occupation ended, the boss came clean to his own; the informing stopped with the occupation, and the amends did not.',
      ],
      historicized: [
        'The occupier is gone, but the boss still keeps the informer\'s discipline: careful lists, careful silences; the master who required them has marched.',
      ],
      'exposed-public': [
        'It is out that the boss informed for the occupier, and the resistance\'s survivors have longer memories than the law ever did.',
        "The rent is public: the boss's rackets ran on betrayed neighbors, and the neighbors' families are keeping the ledger now.",
      ],
      're-adjudicated': [
        'The boss\'s old paymaster is destroyed, but the occupier remains, and the toleration has been re-billed at the same address.',
      ],
    },
    'conduct-drift': {
      attributed: [
        'A dark patron has adopted the boss\'s cruelty and begun to steer it; the beatings and burnings still look like business, but the targets are chosen elsewhere now.',
        'The boss\'s worst instincts found a sponsor: a patron that pays for pain, and the crews have noticed the jobs getting stranger and the take getting easier.',
      ],
      're-caused': [
        "The boss's first hold resolved, but a patron that rewards the deed adopted him, and its sponsorship now steers the crews.",
      ],
      reformed: [
        "The patron's shadow lifted and the boss took his crews back to plain crime; the strange jobs ended, and the sponsored cruelty with them.",
        'With the rewarding patron gone, the boss came clean to the crews; the steered targets were named, and what was owed them paid.',
      ],
      historicized: [
        'The patron is gone, but the boss still runs the strange jobs; the sponsorship ended and the taste for it did not.',
      ],
      'exposed-public': [
        'It is out that the boss\'s violence was steered by a dark patron, and the town has learned its beatings were somebody\'s offerings.',
        "The sponsorship is public: the boss hurt to order for a power that paid in favor, and even his own crews want distance now.",
      ],
      're-adjudicated': [
        "The syndicate fell, but the patron that rewards the deed still stands, and the boss's crews now serve its calendar of targets.",
      ],
    },
    'conversion-pressure': {
      attributed: [
        'The rival faith hires muscle like anyone else, and the boss supplies it; his crews break up the old congregation\'s meetings and are paid from a mission purse.',
        'Doctrine came to the streets with money behind it: the boss\'s toughs clear rooms for the rival preachers, and the boss pretends it is just work.',
      ],
      're-caused': [
        "The boss's first hold passed; the rival faith's purse holds him now, and the mission work keeps his crews on its payroll.",
      ],
      reformed: [
        'The rival faith withdrew and the boss pulled his crews off the doctrine work; the mission purse went back half full.',
        'When the conversion pressure broke, the boss ended the contract; breaking bones for belief had made even his toughs uneasy.',
      ],
      historicized: [
        'The rival faith gave up the town, but the boss keeps the muscle contract on the books; the mission that signed it is gone.',
      ],
      'exposed-public': [
        'It is out that the boss\'s crews cleared the way for the rival mission, and both congregations know whose fists did the converting.',
        "The mission payroll is public, and the boss's crews are on it by name; the town has learned its change of heart was contracted.",
      ],
      're-adjudicated': [
        'The old paymaster is gone, but the rival faith still presses, and its purse has picked up the muscle contract intact.',
      ],
    },
    secularization: {
      attributed: [
        'The old code was sworn on things this town no longer believes, and the boss noticed first; he sells his own people now, because nothing he swore binds him not to.',
        'Even thieves had a catechism here once. It went cold with the rest of the faith, and the boss has been spending the trust it used to guarantee.',
      ],
      're-caused': [
        "The boss's first hold resolved, but the faith went cold behind it, and with the code unsworn, the arrangement simply had no reason to stop.",
      ],
      reformed: [
        'The faith revived and the code with it; the boss re-swore the old oaths before the crews and put right what breaking them had cost.',
        'When belief returned to the streets, the boss came clean; the sold trust was bought back at whatever price its owners set.',
      ],
      historicized: [
        'The faith warmed and the code was re-sworn by everyone but the boss; the cold season that freed him is over and he stayed free.',
      ],
      'exposed-public': [
        'It is out that the boss broke the code while nothing held it, and the crews that kept it anyway are deciding his sentence.',
        "The betrayals are public now, dated to the season the faith went cold; the boss sold what the code protected, and the streets keep older laws than the town.",
      ],
      're-adjudicated': [
        "The boss's paymaster fell, but the faith is still cold, and no revived code stands between him and the habit.",
      ],
    },
    'clergy-scandal': {
      attributed: [
        'The boss holds the temple\'s sins in a strongbox and collects on them monthly, but extortion cuts both ways; he needs those priests standing, so he protects what he bleeds.',
        'The tainted clergy pay the boss for silence, and the payments have become his best racket; he is now the disgraced temple\'s banker, bodyguard, and jailer at once.',
      ],
      're-caused': [
        "The boss's first hold resolved, but the tainted priesthood offered a steadier income, and the temple's silence money now anchors the arrangement.",
      ],
      reformed: [
        'The priesthood was cleansed and the racket died; the boss handed the strongbox to the synod unopened, which no one believed until it was inventoried.',
        "With the clergy's scandal resolved, the boss ended the collections; a racket built on sins already confessed collects nothing.",
      ],
      historicized: [
        'The temple was set in order, but the payments never stopped; the boss collects on a disgrace the town has already forgiven.',
      ],
      'exposed-public': [
        'It is out that the boss bled the tainted temple and guarded it too, and neither the faithful nor the crews like what that made him.',
        "The strongbox is public: the clergy's sins, itemized, with the boss's collection schedule stapled to them.",
      ],
      're-adjudicated': [
        "The syndicate is gone, but the priesthood's taint remains, and the temple's silence money now routes through the boss to new hands.",
      ],
    },
    captured: {
      attributed: [
        'The town thinks the boss owns the offices; the offices know better. He is the syndicate\'s steward here, holding the streets in trust for men who audit him quarterly.',
        'The capture of this town runs through the boss, but not to him; he administers the arrangement for the syndicate above, and his own crews are collateral in it.',
      ],
      're-caused': [
        "The boss's old hold resolved, but the underworld's capture of the offices swallowed him with them; a steward is not consulted about his stewardship.",
      ],
      reformed: [
        'The capture was broken and the boss broke with it; he handed the stewardship ledgers to the magistrates and took his chances with both sides.',
        "With the syndicate's grip broken, the boss came clean; the audited streets were released, and he answers to his own crews again.",
      ],
      historicized: [
        'The capture was broken, but the boss still runs the streets like a steward awaiting audit; the auditors are gone and the posture is not.',
      ],
      'exposed-public': [
        'It is out that the boss held the town for the syndicate, not himself, and every crew that swore to him is renegotiating.',
        "The stewardship is public: the boss's empire was a franchise, and the town has seen the franchise terms.",
      ],
      're-adjudicated': [
        'The syndicate that owned the stewardship is destroyed, but the offices are still captured, and the new holders confirmed the boss in his post.',
      ],
    },
    scandal: {
      attributed: [
        'The scandal made testimony the most valuable thing in town, and the boss sells it both ways: to the law by the name, to the named by the omission.',
        'Half the town would pay to know what the boss knows about the scandal, and the other half pays so no one does; he collects from both halves.',
      ],
      're-caused': [
        "The boss's first hold cleared, but the scandal broke behind it, and dealing its testimony now anchors the arrangement.",
      ],
      reformed: [
        'The scandal burned out and the boss retired the testimony trade; what remained unsold went to the magistrates without a price.',
        'When the scandal settled, the boss ended it; the last buyer of silence got his coin back, and the law got the rest.',
      ],
      historicized: [
        'The scandal is old news, but the boss still deals in its testimony; the market that made it valuable has half-closed.',
      ],
      'exposed-public': [
        'It is out that the boss traded scandal testimony to both sides, and the buyers and the named are comparing invoices.',
        "The testimony ledger is public: the boss priced the town's guilt in both directions, and everyone finds themselves in one column.",
      ],
      're-adjudicated': [
        "The syndicate is broken, but the scandal's economy survives, and the testimony trade has been consolidated under new ownership.",
      ],
    },
  },
  // ── arcane — the adept (wards, reagents, commissions, the library) ──────────
  arcane: {
    underfunded: {
      attributed: [
        'The patronage dried up, and the adept\'s scruples dried with it; commissions are taken now that were once refused at any price, and the clients come after dark.',
        'An unfunded tower is an available one: the adept works for whoever pays, and the work has drifted from what the town would recognize as lawful.',
      ],
      're-caused': [
        'What first bent the adept has passed; the dry patronage bends the work now, and the after-dark commissions pay what daylight will not.',
      ],
      reformed: [
        'The patronage returned and the adept refused the dark commissions; the waiting clients were named to the council, deposits returned.',
        'With the tower funded again, the adept came clean; the work done in the dry season was cataloged and, where it could be, undone.',
      ],
      historicized: [
        'The patronage recovered, but the after-dark clients still knock; the poverty that first opened the door is a memory.',
      ],
      'exposed-public': [
        'It is public what the adept sold when the patronage failed, and the commissions are being read out with their buyers attached.',
        "The dark work is out: the adept's dry-season catalog is in the council's hands, and the town is learning what its coin refused to fund.",
      ],
      're-adjudicated': [
        'The syndicate holding the adept is destroyed, but the patronage is still dry, and the dark commissions now settle to a new account.',
      ],
    },
    'chain-starved': {
      attributed: [
        'The reagent trade died with the roads, so the adept buys from resurrection men and worse; the work continues, and the shelves hold things with histories.',
        'What the craft needs no longer arrives by caravan, and the adept has stopped asking where it arrives from; the suppliers ask no questions either, which is the price of theirs.',
      ],
      're-caused': [
        "The adept's first reason is gone; the dead reagent trade reasons for him now, and the grave-goods suppliers keep the work alive.",
      ],
      reformed: [
        'The reagent trade revived and the adept purged the shelves; what had histories was buried back where it came from, witnessed.',
        'With the caravans running, the adept came clean; the resurrection men lost their best customer and the council gained a list.',
      ],
      historicized: [
        'The caravans returned, but the adept still buys from the quiet men; the shortage that introduced them is long supplied.',
      ],
      'exposed-public': [
        'It is public that the adept\'s shelves were stocked by grave-robbers, and the families of the robbed are reading the inventory.',
        "The supply chain is out: the adept's work ran on plundered graves while the roads were dead, and the town wants its dead accounted.",
      ],
      're-adjudicated': [
        'The old suppliers are destroyed, but the reagent trade is still dead, and whoever robs graves now inherited the adept\'s custom.',
      ],
    },
    depleted: {
      attributed: [
        'The components ran out, so the adept has been mining the town\'s own wards for parts; the protections still hum, but thinner, and only he knows where the gaps are.',
        'Every working needs materials, and the materials are gone; the adept strips older enchantments to feed newer ones, and bills the town for wards it no longer fully has.',
      ],
      're-caused': [
        "The adept's first cause has passed; the empty component stores reason for him now, and the town's wards keep paying the difference.",
      ],
      reformed: [
        'The stores were replenished and the adept restored every stripped ward at his own cost, gap by gap, before confessing the map of them.',
        'With components flowing again, the adept came clean; the thinned protections were rebuilt first and explained after.',
      ],
      historicized: [
        'The stores recovered, but the stripped wards were never made whole; the shortage that excused the mining has passed.',
      ],
      'exposed-public': [
        'It is public that the adept cannibalized the town\'s wards and billed for their upkeep, and every household is asking what still protects it.',
        "The gap map is out: the adept knew exactly where the town stood naked, because he had undressed it, and charged for the clothing.",
      ],
      're-adjudicated': [
        'The syndicate is gone, but the components are still exhausted, and the ward-stripping trade has new beneficiaries.',
      ],
    },
    'trade-strangled': {
      attributed: [
        'The embargo cannot search what it cannot open, and the adept\'s warded crates open for no customs man; the smugglers pay him per seal, and business is brisk.',
        'Trade is strangled except where the adept seals it shut; his wards make cargo invisible to inspection, and the runners bid for his calendar.',
      ],
      're-caused': [
        'What first held the adept has passed; the embargo holds him now, and every warded crate renews the retainer.',
      ],
      reformed: [
        'The embargo lifted and the adept broke his own seals for the customs house, then published the warding pattern so it could never serve again.',
        'When trade reopened, the adept came clean; the sealed-crate clients were named, and the craft went back to honest locks.',
      ],
      historicized: [
        'The embargo is lifted, but the warded crates still move; the strangled trade that commissioned them is done.',
      ],
      'exposed-public': [
        'It is public that the adept\'s wards blinded the customs house, and every unopenable crate of the period is being traced to his seal.',
        "The seals are out: the adept sold invisibility to the contraband trade, and the law is learning how much it never saw.",
      ],
      're-adjudicated': [
        'The old clients are destroyed, but the trade is still strangled, and the warded-crate business has been re-commissioned by their successors.',
      ],
    },
    'levied-away': {
      attributed: [
        'With the soldiers levied away, the town\'s safety hangs on the adept\'s wards, and the adept has priced accordingly; protection continues for those who pay, and thins for those who cannot.',
        'The war took the swords and left the spells, and the adept has been renting the difference; the wards play favorites now, street by street.',
      ],
      're-caused': [
        "The adept's first cause resolved, but the levy left the town leaning on his wards, and the leaning is now the arrangement's whole weight.",
      ],
      reformed: [
        'The companies returned and the adept evened the wards; every street protected alike, and the favor-payments returned to their payers.',
        'When the strength came home, the adept came clean; the tiered protection was confessed to the council and flattened that week.',
      ],
      historicized: [
        'The soldiers are back, but the wards still play favorites; the absence that taught them is over.',
      ],
      'exposed-public': [
        'It is public that the adept tiered the town\'s protection while its soldiers were at war, and the unpaid streets are counting what they suffered.',
        "The favor map is out: the wards guarded purses, not people, and the adept drew the boundaries himself.",
      ],
      're-adjudicated': [
        'The syndicate fell, but the strength is still levied away, and the ward-rents now collect to the arrangement\'s new holders.',
      ],
    },
    'garrison-drained': {
      attributed: [
        'The garrison is hollow, and everyone knows the wards are the town\'s real wall; what no one knows is that the adept has sold the survey of their weak seams, twice.',
        'With the garrison drained, the adept\'s wards matter more than the gates, and their flaws are worth more than their strength; he retails both, to different customers.',
      ],
      're-caused': [
        "The adept's first reason passed, but the garrison hollowed after, and the market for the wards' weak seams now sustains the arrangement.",
      ],
      reformed: [
        'The garrison was refilled and the adept re-cut every seam he had sold, making the surveys worthless; then he confessed the selling.',
        'With the ranks restored, the adept came clean; the sold surveys were bought back or voided, and the wards made honest.',
      ],
      historicized: [
        'The garrison stands full again, but the sold surveys still circulate; the drain that priced them has ended.',
      ],
      'exposed-public': [
        'It is public that the adept sold the map of the wards\' weaknesses while the garrison stood empty, and the town knows its wall had a merchant.',
        "The surveys are out, with the adept's seal on them: every weak seam in the town's protection, priced and sold to strangers.",
      ],
      're-adjudicated': [
        'The old buyers are destroyed, but the garrison is still drained, and the weak-seam trade has found the adept new customers.',
      ],
    },
    'siege-scarred': {
      attributed: [
        'The war buys workings faster than the adept can cast them, and he sells to both camps; the wards he raises for one side are the ones he knows how to breach for the other.',
        'Under the war\'s pressure the adept\'s craft went to market: fire for one army, shields for the other, and the invoices in different inks.',
      ],
      're-caused': [
        "The adept's old cause cleared, but the war pressed in, and the two-camp commissions now finance the arrangement.",
      ],
      reformed: [
        'The war receded and the adept closed both accounts; the workings sold to each side were disclosed to the town that sat between them.',
        'With the pressure lifted, the adept came clean about the double commissions, and spent the proceeds unbreaching what he had breached.',
      ],
      historicized: [
        'The war moved on, but both camps still hold the adept\'s workings; he serviced the arsenals of a fight that has ended.',
      ],
      'exposed-public': [
        'It is public that the adept armed both camps, and each army has learned its shields and its enemy\'s fire share an author.',
        "The double invoices are out: the adept sold the war to itself, and the town caught between the camps has read the totals.",
      ],
      're-adjudicated': [
        'The syndicate is broken, but the war still presses, and the two-camp trade has been assumed by parties who knew the invoices first.',
      ],
    },
    occupation: {
      attributed: [
        'The occupier needs eyes, and the adept\'s scrying is the best in town; he watches his neighbors for them, and the watching is paid in license to practice.',
        'The occupation registers the talented, and the adept keeps the register; who can do what, and where they sleep, delivered monthly in exchange for his own name\'s omission.',
      ],
      're-caused': [
        "What first compromised the adept is gone; the occupier's license sustains the practice now, and the scrying pays the license.",
      ],
      reformed: [
        'The occupier withdrew and the adept burned the register, then stood before those it had named and read his own entry first.',
        'With the occupation ended, the adept came clean; the scrying was confessed to the watched, house by house.',
      ],
      historicized: [
        'The occupier is gone, but the adept still keeps the register current; the master who required it has marched away.',
      ],
      'exposed-public': [
        'It is public that the adept scried on the town for the occupier, and every family is recalculating what the occupation somehow knew.',
        "The register is out, in the adept's hand: the town's talented, cataloged for the occupier, with his own name absent.",
      ],
      're-adjudicated': [
        "The adept's old paymaster is destroyed, but the occupier remains, and the scrying contract has been renewed on their letterhead.",
      ],
    },
    'conduct-drift': {
      attributed: [
        'A dark patron funds the adept\'s research, and the research has bent toward the patron\'s appetites; what the craft forbids, the funding rewards, and the adept has stopped distinguishing.',
        'The forbidden shelf in the adept\'s library grows, and every volume was paid for; a patron that prizes transgression sponsors the collection, and collects in kind.',
      ],
      're-caused': [
        "The adept's first cause resolved, but a patron that rewards the deed took up the funding, and the research follows the reward.",
      ],
      reformed: [
        "The patron's shadow lifted and the adept sealed the forbidden shelf; the sponsored research was ended and its notes given to the circle to bury.",
        'With the rewarding patron gone, the adept came clean; the transgressions lost their funding, and he found he had only ever wanted the funding.',
      ],
      historicized: [
        'The patron is gone, but the forbidden shelf still grows; the sponsorship ended and the appetite it trained did not.',
      ],
      'exposed-public': [
        'It is public that the adept\'s research served a dark patron\'s appetites, and the circle is auditing everything he ever published.',
        "The sponsorship is out: the forbidden work was commissioned, and the town has seen the patron's terms in the adept's own files.",
      ],
      're-adjudicated': [
        "The syndicate fell, but the patron that rewards the deed still stands, and the adept's research grants were simply re-signed.",
      ],
    },
    'conversion-pressure': {
      attributed: [
        'The rival faith pays for omens, and the adept\'s auguries have learned which answers sell; the stars say what the mission needs them to, at standard rates.',
        'Conversion goes easier with signs and wonders, so the mission buys them wholesale; the adept supplies the wonders and invoices as consulting.',
      ],
      're-caused': [
        "The adept's first reason passed; the rival faith's omen budget replaced it, and the auguries keep earning it.",
      ],
      reformed: [
        'The rival faith withdrew and the adept published the true readings beside the sold ones, so the town could see the difference.',
        'When the conversion pressure broke, the adept came clean; the bought omens were recanted, each one, by name.',
      ],
      historicized: [
        'The rival faith gave up the town, but the adept\'s auguries still lean; the omen budget closed and the habit of leaning did not.',
      ],
      'exposed-public': [
        'It is public that the mission bought its miracles from the adept, and every sign that moved a convert is being re-read as an invoice.',
        "The omen trade is out: the adept sold the sky's opinions to the rival faith, and both congregations want the real readings.",
      ],
      're-adjudicated': [
        'The old patron is gone, but the rival faith still presses, and the omen budget has been reassigned to the adept\'s new principals.',
      ],
    },
    secularization: {
      attributed: [
        'The old covenant between the craft and the temple limited what an adept may do, and the temple that enforced it stands empty; the adept has been practicing past the line, because no one holds the line.',
        'With the faith gone cold, the proscriptions on the craft went with it; the adept works freely in territory that was fenced for good reasons, and charges frontier prices.',
      ],
      're-caused': [
        "The adept's first cause resolved, but the faith went cold behind it, and with the covenant unenforced, the work simply continued past the line.",
      ],
      reformed: [
        'The faith revived and the covenant with it; the adept stepped back inside the line unforced, and surrendered the work done beyond it.',
        'When belief returned, the adept came clean; the frontier practice was confessed to the restored temple and set down.',
      ],
      historicized: [
        'The faith warmed again, but the adept never came back inside the line; the cold season that opened the frontier has closed behind him.',
      ],
      'exposed-public': [
        'It is public what the adept practiced while the covenant slept, and the reviving temple has made the craft its first inquiry.',
        "The frontier work is out: what the old line forbade, the adept did and sold, and the town is learning why the line was drawn.",
      ],
      're-adjudicated': [
        "The adept's paymaster fell, but the faith is still cold, and no covenant has revived that might fence the work again.",
      ],
    },
    'clergy-scandal': {
      attributed: [
        'The temple\'s disgrace left the town hungry for the miraculous, and the adept caters; manufactured wonders fill the gap the priests vacated, and the offerings redirect to his door.',
        'With the clergy tainted, no one trusts the altar\'s wonders, so they buy the adept\'s; his miracles are competitively priced and technically real, which the sermons never mention.',
      ],
      're-caused': [
        "The adept's first reason resolved, but the tainted priesthood left a market gap, and filling it with paid wonders now sustains the arrangement.",
      ],
      reformed: [
        'The priesthood was cleansed and the adept closed the miracle stall; the redirected offerings were sent to the altar they had abandoned.',
        "With the clergy's scandal resolved, the adept came clean; the manufactured wonders were disclosed as workings, priced and ordinary.",
      ],
      historicized: [
        'The temple was set in order, but the miracle stall never closed; the disgrace that opened the market is mended.',
      ],
      'exposed-public': [
        'It is public that the adept sold workings as wonders while the temple was disgraced, and the faithful are asking what they actually knelt to.',
        "The stall's books are out: the adept billed the town's hunger for the holy, and the hunger was real even if the wonders were retail.",
      ],
      're-adjudicated': [
        "The syndicate is gone, but the priesthood's taint remains, and the wonder trade has been re-capitalized by new backers.",
      ],
    },
    captured: {
      attributed: [
        'The syndicate holds the adept\'s debts, and his craft services theirs; locks open oddly around their crews, and the watch\'s trackers follow trails that end at walls.',
        'The underworld collects the adept\'s notes quarterly: what was warded, what was scried, and workings to order; the debt never shrinks, which is the design.',
      ],
      're-caused': [
        "The adept's old cause resolved, but the underworld holds the town's offices now, and a craft it holds is a tool, not a tenant.",
      ],
      reformed: [
        'The capture was broken and the adept called in his own debt: every working done for the syndicate was named, and its counterspell filed with the watch.',
        "With the syndicate's grip broken, the adept came clean; the serviced crimes were confessed, and the craft turned to undoing them.",
      ],
      historicized: [
        'The capture was broken, but the adept still works to the syndicate\'s old patterns; the debt is void and the habits are not.',
      ],
      'exposed-public': [
        'It is public that the adept\'s craft served the underworld, and every oddly opened lock in memory has found its locksmith.',
        "The debt ledger is out: the syndicate held the adept by his notes, and the town has learned what the interest was paid in.",
      ],
      're-adjudicated': [
        'The syndicate holding the debt is destroyed, but the offices are still captured, and the notes were found, bought, and re-presented.',
      ],
    },
    scandal: {
      attributed: [
        'The scandal made memory dangerous, and the adept trades in it; recollections blur for the implicated at premium rates, and sharpen for their accusers at higher ones.',
        'Since the scandal broke, the adept\'s truth-work has been for hire to whoever fears it most; the same craft that could settle the matter is paid to unsettle it.',
      ],
      're-caused': [
        "The adept's first cause cleared, but the scandal broke behind it, and the memory trade now finances the arrangement.",
      ],
      reformed: [
        'The scandal burned out and the adept restored what he had blurred, freely, and filed the true recollections with the court.',
        'When the scandal settled, the adept came clean; the memory work was confessed and undone where undoing was still possible.',
      ],
      historicized: [
        'The scandal is old news, but the memory trade continues; the panic that priced recollection has faded.',
      ],
      'exposed-public': [
        'It is public that the adept blurred memories through the scandal, and no testimony from those months is trusted, including the innocent kind.',
        "The memory invoices are out: who paid to forget, who paid to be believed, and the adept's rates for each.",
      ],
      're-adjudicated': [
        "The syndicate is broken, but the scandal's economy survives, and the memory trade has re-contracted with the adept retained.",
      ],
    },
  },
  // ── civic — the official (court, records, permits, fines) ───────────────────
  civic: {
    underfunded: {
      attributed: [
        'The office fees stopped covering the office, so the official found the margin: the permit queue moves for coin, and the fines collected do not all reach the strongbox.',
        'A starved bureau and a patient official: every stamp has a speed, every speed has a price, and the price list exists nowhere in writing.',
      ],
      're-caused': [
        'What first bent the official has passed; the starved bureau bends them now, and the queue-money is called making the office work.',
      ],
      reformed: [
        'The bureau was funded and the official trued the queue; the skimmed fines were restored to the strongbox with an accounting nobody demanded.',
        'With the fees covering the office again, the official came clean; the unwritten price list was written down at last, as a confession.',
      ],
      historicized: [
        'The bureau recovered, but the queue still moves for coin; the shortfall that started the practice is old accounting.',
      ],
      'exposed-public': [
        'It is public that the permit queue was auctioned while the bureau starved, and everyone who waited honestly knows now what the waiting bought.',
        'The skimming is out: the official pocketed fines against short wages, and the strongbox arithmetic is being done in the square.',
      ],
      're-adjudicated': [
        'The syndicate holding the official is destroyed, but the bureau is still starved, and the queue-money now flows to the shortfall itself.',
      ],
    },
    'chain-starved': {
      attributed: [
        'The requisitions come back stamped and empty, so the official forges the paperwork the black channel needs; goods appear, files agree, and none of it happened.',
        'When the supply lines failed, the official discovered that paper is a supply line too; the forms move contraband as smoothly as wagons ever moved grain.',
      ],
      're-caused': [
        "The official's first reason is gone; the dead requisition channel reasons for them now, and the forged forms keep the office stocked.",
      ],
      reformed: [
        'The supply lines were restored and the official pulped the forged forms; the files were corrected to say what actually happened, all of it.',
        'With the wagons running, the official came clean; the paper channel was closed and its architecture handed to the auditors.',
      ],
      historicized: [
        'The supply lines are mended, but the paper channel stays open; the shortage that drew it is long resupplied.',
      ],
      'exposed-public': [
        'It is public that the official forged the requisition record, and every file with their stamp is being re-read against reality.',
        'The paper channel is out: the official made contraband bureaucratically true, and the auditors are unwinding the fiction form by form.',
      ],
      're-adjudicated': [
        'The old partners are destroyed, but the supply lines are still cut, and the paper channel has new cargo and the same clerk.',
      ],
    },
    depleted: {
      attributed: [
        'The relief stores are empty and the dole list is not; the official curates it now, and a place on it costs exactly what the desperate can pay.',
        'Scarcity gave the official a new power: the list of who is fed. Names appear and vanish for consideration, and the register never shows the erasures.',
      ],
      're-caused': [
        "The official's first cause has passed; the empty relief stores reason for them now, and the curated list pays its keeper.",
      ],
      reformed: [
        'The stores were refilled and the official restored the true list; the paid placements were struck, and the fees returned in front of the queue.',
        'With relief flowing again, the official came clean; the erasures were confessed, and the register rewritten by need alone.',
      ],
      historicized: [
        'The stores recovered, but the list is still curated; the famine that made it valuable has ended.',
      ],
      'exposed-public': [
        'It is public that the dole list was sold by the name while the stores ran dry, and the struck-off are reading the register aloud.',
        'The erasures are out: the official priced hunger, and the town is matching the vanished names to the graves.',
      ],
      're-adjudicated': [
        'The syndicate is gone, but the stores are still empty, and the curated list has passed to new curators with the official attached.',
      ],
    },
    'trade-strangled': {
      attributed: [
        'The embargo is absolute, except on paper; the official stamps exemptions for coin, and the stamped wagons roll past inspectors who trust the stamp.',
        'Trade is strangled by decree, and the official sells the loopholes; each exemption is technically lawful, which is the service being purchased.',
      ],
      're-caused': [
        'What first held the official has passed; the embargo holds them now, and each stamped exemption renews the fee.',
      ],
      reformed: [
        'The embargo lifted and the official published the exemption record entire, buyers and fees included, before any auditor asked.',
        'When trade reopened, the official came clean; the stamp went back to meaning what it says, and the fees went to the treasury.',
      ],
      historicized: [
        'The embargo is lifted, but the official still sells the stamp; the decree that priced it is repealed.',
      ],
      'exposed-public': [
        'It is public that the embargo had a price list at the records office, and the merchants who obeyed the law are reading the buyers\' names.',
        'The exemption record is out: the official retailed the law\'s exceptions, and the law is deciding what its stamp is worth now.',
      ],
      're-adjudicated': [
        'The old paymaster is gone, but the trade is still strangled, and the exemption trade has new principals holding the same stamp.',
      ],
    },
    'levied-away': {
      attributed: [
        'The auditors marched with the levy, and the records have been fluid since; deeds amend themselves, debts vanish, and the official\'s hand is behind every helpful correction.',
        'With the strength levied away, no one checks the files against the facts; the official has been retailing corrections, and the archive is becoming a work of fiction with subscribers.',
      ],
      're-caused': [
        "The official's first cause resolved, but the levy emptied the town of auditors, and the correction trade now rests on the absence alone.",
      ],
      reformed: [
        'The companies came home and the official restored the archive first; every sold correction was reversed before the auditors sat down.',
        'When the strength returned, the official came clean; the fluid records were confessed, and the true copies produced from a locked drawer.',
      ],
      historicized: [
        'The auditors are back, but the sold corrections stand; the absence that permitted them has ended and its fictions are load-bearing now.',
      ],
      'exposed-public': [
        'The returned auditors have compared the files to the facts, and it is public: the official sold corrections the whole time the town stood unwatched.',
        'It is out that the archive was for sale during the levy, and every deed and debt of the period is being re-proved from scratch.',
      ],
      're-adjudicated': [
        'The syndicate fell, but the strength is still levied away, and the correction trade continues on the absence it always ran on.',
      ],
    },
    'garrison-drained': {
      attributed: [
        'The garrison cannot serve a warrant, so the official sells judgments that will never be enforced; justice is pronounced, priced, and shelved, and everyone involved knows the sequence.',
        'With enforcement hollow, the official\'s rulings are theater with fees; the guilty pay for verdicts against them that will never be executed, and call it settling out.',
      ],
      're-caused': [
        "The official's first reason passed, but the garrison hollowed after, and the unenforceable-judgment trade now anchors the arrangement.",
      ],
      reformed: [
        'The garrison was refilled and the shelved judgments came down; the official executed every one, beginning with the paid-for.',
        'With enforcement restored, the official came clean; the theater was confessed, and the fees refunded on the courthouse steps.',
      ],
      historicized: [
        'The garrison stands full again, but the judgments stay shelved; the hollowness that excused it is repaired.',
      ],
      'exposed-public': [
        'It is public that the official priced verdicts nobody would enforce, and the shelved judgments are being read like a menu.',
        'The theater is out: justice here was pronounced for show and paid for quiet, and the official ran the box office.',
      ],
      're-adjudicated': [
        'The old paymaster is destroyed, but the garrison is still drained, and the judgment trade has re-opened under new patrons.',
      ],
    },
    'siege-scarred': {
      attributed: [
        'The war brought rationing, and rationing brought the books; the official keeps them, and a household\'s allotment tracks its generosity to the keeper.',
        'Under the war\'s pressure the ration books became currency, and the official is the mint; extra pages for the accommodating, short weights for the difficult.',
      ],
      're-caused': [
        "The official's old cause cleared, but the war pressed in, and the ration books now carry the arrangement page by page.",
      ],
      reformed: [
        'The war receded and the official trued the ration books; the short-weighted were repaid in full from the office\'s own stores.',
        'With the pressure lifted, the official came clean; the sold pages were confessed, and the rationing records opened to every household.',
      ],
      historicized: [
        'The war moved on, but the ration books still track generosity; the emergency that opened them is closed.',
      ],
      'exposed-public': [
        'It is public that the ration books were kept crooked through the war, and the short-weighted households are presenting their pages.',
        'The mint is out of business publicly: the official sold the war\'s bread by the signature, and the town has kept every stub.',
      ],
      're-adjudicated': [
        'The syndicate is broken, but the war still presses, and the ration books have been transferred, keeper and all.',
      ],
    },
    occupation: {
      attributed: [
        'The occupier asked for the census, and the official provided it annotated: who resists, who complies, who has sons of fighting age; the administration runs smoothly, as does the collecting.',
        'Under the occupation the official kept every office and earned the keeping; the town\'s records serve the occupier now, and the official curates what they see.',
      ],
      're-caused': [
        "What first compromised the official is gone; the occupier's administration sustains the office now, and the annotated files sustain the official.",
      ],
      reformed: [
        'The occupier withdrew and the official produced the annotations for the town to read, their own entries first.',
        'With the occupation ended, the official came clean; what the census had carried to the occupier was confessed to those it named.',
      ],
      historicized: [
        'The occupier is gone, but the official still annotates the census; the reader it was curated for has marched away.',
      ],
      'exposed-public': [
        'It is public that the census went to the occupier annotated, and every family the occupation visited is finding its entry.',
        'The annotations are out, in the official\'s hand: the town\'s compliance, graded and delivered, and the collections that followed each grade.',
      ],
      're-adjudicated': [
        "The official's old paymaster is destroyed, but the occupier remains, and the annotated census has a new and equally attentive reader.",
      ],
    },
    'conduct-drift': {
      attributed: [
        'A dark patron reads the official\'s verdicts like offerings, and pays for the reading; injustice from this bench has a sponsor, and the sponsor has taste.',
        'The official\'s rulings have drifted toward cruelty, and the drift is subsidized; a patron that delights in the twisted verdict rewards each one.',
      ],
      're-caused': [
        "The official's first cause resolved, but a patron that rewards the deed adopted the bench, and its favor now retains the verdicts.",
      ],
      reformed: [
        "The patron's shadow lifted and the official re-heard every sponsored case; unpaid, the verdicts came out the way the law reads.",
        'With the rewarding patron gone, the official came clean; the twisted rulings were vacated, and the bench asked to be judged by them.',
      ],
      historicized: [
        'The patron is gone, but the verdicts still bend the way it liked; the sponsorship ended and the bench never noticed itself.',
      ],
      'exposed-public': [
        'It is public that the bench\'s cruelties were sponsored devotions, and every twisted verdict is being re-read as a receipt.',
        'The sponsorship is out: a dark patron paid for injustice from this office, and the wronged are lining up with their case numbers.',
      ],
      're-adjudicated': [
        "The syndicate fell, but the patron that rewards the deed still stands, and the bench's arrangement was assumed into its keeping.",
      ],
    },
    'conversion-pressure': {
      attributed: [
        'The rival faith needs deeds, licenses, and registrations, and the official expedites; temple land changes hands smoothly where their mission works, and the fees find the official at home.',
        'Conversion is paperwork in the end, and the official does the paperwork; the rival faith\'s acquisitions clear in days while everything else waits its month.',
      ],
      're-caused': [
        "The official's first reason passed; the rival faith's filing fees replaced it, and the expedited deeds are the record of it.",
      ],
      reformed: [
        'The rival faith withdrew and the official re-examined the expedited transfers; the improper ones were voided, fees returned.',
        'When the conversion pressure broke, the official came clean; the home-paid fees were surrendered, and the registry re-dated honestly.',
      ],
      historicized: [
        'The rival faith gave up the town, but the expedited transfers stand; the fees that moved them are spent and unremembered.',
      ],
      'exposed-public': [
        'It is public that the rival mission\'s paperwork jumped every queue for a fee, and the registry\'s dates tell the story plainly.',
        'The expediting is out: the official sold the speed of the law to the rival faith, and both congregations are auditing the deeds.',
      ],
      're-adjudicated': [
        'The old patron is gone, but the rival faith still presses, and its filing fees now route through new hands to the same desk.',
      ],
    },
    secularization: {
      attributed: [
        'Testimony here is sworn before a god no one fears, and the official has drawn the conclusion; sworn statements are drafted to order now, and the oath is part of the stationery.',
        'With the faith gone cold, the courtroom oath became a formality, and the official trades in formalities; witnesses say what the paying party needs, hands on the book, straight-faced.',
      ],
      're-caused': [
        "The official's first cause resolved, but the faith went cold behind it, and with the oath toothless, the testimony trade simply continued.",
      ],
      reformed: [
        'The faith revived and the oath got its teeth back; the official confessed the drafted testimony and re-opened every case built on it.',
        'When belief returned, the official came clean; the to-order statements were withdrawn, and the book sworn on meant something again.',
      ],
      historicized: [
        'The faith warmed again, but the testimony trade never closed; the cold oath that opened it has been rewarmed without effect.',
      ],
      'exposed-public': [
        'It is public that sworn testimony was drafted for sale while the oath meant nothing, and every verdict of the period is appealing itself.',
        'The trade is out: the official sold the court\'s truth while no god watched it, and the reviving congregation watched instead.',
      ],
      're-adjudicated': [
        "The official's paymaster fell, but the faith is still cold, and the testimony trade runs on with no oath in its way.",
      ],
    },
    'clergy-scandal': {
      attributed: [
        'The temple\'s troubles live in the town records, and the official is their landlord; files about the clergy go missing by subscription, and the subscription is current.',
        'What the archive knows about the priesthood would feed the scandal for a year, and the official rents the not-knowing; the relevant drawers stay locked and the retainer arrives on the tithe schedule.',
      ],
      're-caused': [
        "The official's first reason resolved, but the tainted priesthood offered a subscription, and the locked drawers now carry the arrangement.",
      ],
      reformed: [
        'The priesthood was cleansed and the official unlocked the drawers; the withheld files went to the synod complete, retainers returned.',
        "With the clergy's scandal resolved, the official came clean; the subscription was confessed, and the archive made whole.",
      ],
      historicized: [
        'The temple was set in order, but the drawers stay locked and the retainer still arrives; the scandal it hides is already absolved.',
      ],
      'exposed-public': [
        'It is public that the archive hid the clergy\'s record for a retainer, and the drawers are being opened in front of witnesses.',
        'The subscription is out: the official rented silence to the temple, and the town is reading what the rent concealed.',
      ],
      're-adjudicated': [
        "The syndicate is gone, but the priesthood's taint remains, and the locked-drawer retainer has been assumed by new subscribers.",
      ],
    },
    captured: {
      attributed: [
        'The underworld holds the offices, and the official\'s desk is one of them; warrants leak before they are served, and the cases that matter die quietly in the third drawer.',
        'The syndicate reads everything the official files, before the magistrate does; the office runs on their schedule, and the third drawer is where justice goes to wait forever.',
      ],
      're-caused': [
        "The official's old cause resolved, but the underworld holds the offices now, and a desk it holds keeps its drawers the way it is told.",
      ],
      reformed: [
        'The capture was broken and the official emptied the third drawer onto the magistrate\'s bench; every buried case, dated and intact.',
        "With the syndicate's grip broken, the official came clean; the leaked warrants were listed, and the leaks sealed by testimony.",
      ],
      historicized: [
        'The capture was broken, but the third drawer still swallows cases; the master who required it has gone and the drawer has not noticed.',
      ],
      'exposed-public': [
        'It is public that warrants leaked from this desk and cases died in it, and the third drawer has been opened in front of the town.',
        'The capture has a filing system, and it is out: the official kept the underworld\'s calendar, and justice waited on it.',
      ],
      're-adjudicated': [
        'The syndicate that ran the desk is destroyed, but the offices are still captured, and the third drawer has a new and identical patron.',
      ],
    },
    scandal: {
      attributed: [
        'The scandal filled the archive with dangerous paper, and the official owns the filing; documents implicate or exonerate depending on the fee, and the fee is never in writing.',
        'Everyone named in the scandal needs something from the records office, and the official has organized the needing; the files everyone fears are indexed by what their subjects will pay.',
      ],
      're-caused': [
        "The official's first cause cleared, but the scandal broke behind it, and the fear-indexed files now sustain the arrangement.",
      ],
      reformed: [
        'The scandal burned out and the official published the index; every fee taken was listed beside the file it moved.',
        'When the scandal settled, the official came clean; the dangerous paper went to the court intact, and the payments to the treasury.',
      ],
      historicized: [
        'The scandal is old news, but the files are still indexed by fear; the panic that priced them has subsided.',
      ],
      'exposed-public': [
        'It is public that the scandal\'s paper was priced at the records office, and the index of fees is the new scandal.',
        'The filing is out: the official sold the archive\'s memory to the frightened, and the town is reading who paid to be forgotten.',
      ],
      're-adjudicated': [
        "The syndicate is broken, but the scandal's economy survives, and the fear-indexed files have been re-shelved under new ownership.",
      ],
    },
  },
  // ── healer — the healer (infirmary, remedies, sickbeds) ─────────────────────
  healer: {
    underfunded: {
      attributed: [
        'The infirmary\'s funding failed, and the healer\'s oath quietly re-priced itself; the medicine goes to the paying beds first, and the donated supplies are resold out the side door.',
        'Care costs what the healer says it costs now; since the funding dried, the sliding scale slides one way, and the charity beds stand empty for want of paperwork.',
      ],
      're-caused': [
        'What first bent the healer has passed; the starved infirmary bends them now, and the side-door sales are called keeping the doors open.',
      ],
      reformed: [
        'The funding returned and the healer re-opened the charity beds first; the resold supplies were bought back at a loss taken personally.',
        'With the infirmary funded, the healer came clean; the one-way scale was confessed and the overcharged repaid, bed by bed.',
      ],
      historicized: [
        'The funding recovered, but the side door still does business; the shortfall that opened it is long since closed.',
      ],
      'exposed-public': [
        'It is public that the healer sold donated medicine while the charity beds stood empty, and the town is matching graves to the price list.',
        'The side door is out: the infirmary\'s poverty was real, and so was the healer\'s margin on it, and the sick paid both.',
      ],
      're-adjudicated': [
        'The syndicate holding the healer is destroyed, but the infirmary is still starved, and the side-door trade now answers to the shortfall alone.',
      ],
    },
    'chain-starved': {
      attributed: [
        'The medicine stopped arriving when the roads died, so the healer buys from the men who rob the dead; the sick recover on stolen physic, and the suppliers hold the healer\'s open account.',
        'Every remedy in the infirmary has a history now; the supply lines failed, and the healer sources from hands that work by night, and owes them daylight favors.',
      ],
      're-caused': [
        "The healer's first reason is gone; the dead supply lines reason for them now, and the night suppliers keep the sickroom shelves filled.",
      ],
      reformed: [
        'The medicine came back by honest roads and the healer closed the night account; the last favor owed was refused, in writing.',
        'With the supply lines restored, the healer came clean; the sourced-by-night remedies were disclosed, and the debts settled in coin instead of favors.',
      ],
      historicized: [
        'The roads are open, but the healer still buys from the night men; the shortage that introduced them has ended.',
      ],
      'exposed-public': [
        'It is public that the infirmary ran on grave-robbers\' goods, and the families of the robbed are inventorying the shelves.',
        'The night account is out: the healer\'s remedies were plundered, and the town is weighing its recoveries against its opened graves.',
      ],
      're-adjudicated': [
        'The old suppliers are destroyed, but the supply lines are still dead, and whoever works by night now holds the infirmary\'s account.',
      ],
    },
    depleted: {
      attributed: [
        'The remedies are gone, so the healer rations what remains by favor and fills the gap with colored water; the poor drink hope, the connected drink medicine, and the ledger calls both treatment.',
        'Scarcity reached the sickroom, and the healer adapted: true physic for those who bring something, tonics of nothing for those who do not, and the same fee for both.',
      ],
      're-caused': [
        "The healer's first cause has passed; the empty medicine chest reasons for them now, and the favor-rationing pays its keeper.",
      ],
      reformed: [
        'The stores were replenished and the healer poured out the colored water in front of the queue; the true physic goes by sickness now, not standing.',
        'With the chest refilled, the healer came clean; the nothing-tonics were confessed, and their buyers treated free until the debt was worked off.',
      ],
      historicized: [
        'The chest was refilled, but the favor-rationing continues; the scarcity that taught it has passed.',
      ],
      'exposed-public': [
        'It is public that the healer sold colored water to the poor while rationing true medicine by favor, and the bereaved are re-reading their bills.',
        'The two-shelf sickroom is out: physic for the connected, hope-water for the rest, and the healer\'s fee identical on every receipt.',
      ],
      're-adjudicated': [
        'The syndicate is gone, but the chest is still empty, and the rationing power has assumed the healer\'s arrangement with it.',
      ],
    },
    'trade-strangled': {
      attributed: [
        'The embargo banned the physic imports with everything else, so the healer runs a pharmacy of contraband; the medicine is real, the channel is criminal, and the markup covers the risk three times over.',
        'Medicine still reaches this town because the healer deals with the embargo-runners; the sick pay smugglers\' prices for their lives, and the healer keeps the difference between mercy and market.',
      ],
      're-caused': [
        'What first held the healer has passed; the embargo holds them now, and each contraband consignment renews the margin.',
      ],
      reformed: [
        'The embargo lifted and the healer posted honest prices the same week; the smuggler margin was refunded to every patient who could be found.',
        'When the imports flowed again, the healer came clean; the contraband channel was closed and its accounts opened.',
      ],
      historicized: [
        'The embargo is lifted, but the healer still charges the running price; the risk that justified it is retired.',
      ],
      'exposed-public': [
        'It is public that the healer priced contraband medicine at three times the risk, and the town has learned what its survival was billed at.',
        'The pharmacy\'s channel is out: the medicine came by night and the markup stayed at noon, and the healer pocketed the difference.',
      ],
      're-adjudicated': [
        'The old runners are destroyed, but the trade is still strangled, and the medicine channel has new carriers holding the healer\'s account.',
      ],
    },
    'levied-away': {
      attributed: [
        'The levy takes the able-bodied, and the healer\'s certificate says who is able; unfitness is for sale at the infirmary, and the price rises with each muster.',
        'With the recruiters working the town, the healer\'s signature became armor; sons stay home for coin, and the poor march in place of the paying.',
      ],
      're-caused': [
        "The healer's first cause resolved, but the levy keeps mustering, and the unfitness trade now sustains the arrangement.",
      ],
      reformed: [
        'The companies came home and the healer stopped the certificate trade; the bought exemptions were confessed to the muster office unprompted.',
        'When the levy ended, the healer came clean; the fees were returned to the buyers and the apology made to those who marched instead.',
      ],
      historicized: [
        'The levy is over, but the healer still sells the signature; the muster that priced it is disbanded.',
      ],
      'exposed-public': [
        'It is public that unfitness was for sale at the infirmary, and the families of those who marched in a buyer\'s place are outside.',
        'The certificate trade is out: the healer\'s signature kept the paying home, and the town\'s dead are the counter-ledger.',
      ],
      're-adjudicated': [
        'The syndicate fell, but the levy still musters, and the certificate trade has been re-let to hands that kept the healer\'s pen.',
      ],
    },
    'garrison-drained': {
      attributed: [
        'With the garrison hollow, the gangs keep their own order, and the healer patches their wounded off the books; the pay is protection, and the infirmary\'s night entries appear in no register.',
        'The watch cannot protect the infirmary, so the healer bought protection the available way: knife wounds stitched without questions, and the stitching never reported.',
      ],
      're-caused': [
        "The healer's first reason passed, but the garrison hollowed after, and the off-book stitching now buys the protection the watch cannot.",
      ],
      reformed: [
        'The garrison was refilled and the healer closed the night practice; the unreported wounds were reported, dated, and named.',
        'With the watch restored, the healer came clean; the protection arrangement ended, and the night ledger went to the captain.',
      ],
      historicized: [
        'The garrison stands full again, but the night entries continue; the danger that began them is patrolled now.',
      ],
      'exposed-public': [
        'It is public that the healer stitched the gangs\' wounded off the books, and every unexplained recovery in town has found its explanation.',
        'The night ledger is out: the infirmary treated violence and hid it, and the healer\'s protection was the fee.',
      ],
      're-adjudicated': [
        'The old protectors are destroyed, but the garrison is still drained, and the off-book practice has new patients holding the old terms.',
      ],
    },
    'siege-scarred': {
      attributed: [
        'The war fills the sickrooms past capacity, and the healer\'s triage has developed a price; who is seen first is negotiable, and the negotiating happens at the door while the wounded wait.',
        'Under the war\'s pressure the healer sells the queue itself; the gravely hurt hold their place with coin or lose it to lighter wounds with heavier purses.',
      ],
      're-caused': [
        "The healer's old cause cleared, but the war pressed in, and the priced queue now carries the arrangement.",
      ],
      reformed: [
        'The war receded and the healer restored triage by wound alone; the queue fees were poured into beds for those the pricing had cost.',
        'With the pressure lifted, the healer came clean; the sold places were confessed, and the sickroom door opened by need again.',
      ],
      historicized: [
        'The war moved on, but the queue still has a price; the crowding that excused it has emptied.',
      ],
      'exposed-public': [
        'It is public that the healer sold places in the war queue, and the families of those who waited and died have the receipts of those who did not.',
        'The door price is out: the healer auctioned urgency itself through the fighting, and the town is reading the sequence of its dead.',
      ],
      're-adjudicated': [
        'The syndicate is broken, but the war still presses, and the queue trade has been assumed by new hands at the same door.',
      ],
    },
    occupation: {
      attributed: [
        'The occupier\'s officers are treated first and best, and the healer\'s reports travel with the medicine; which households hide wounded men is a diagnosis now, delivered weekly.',
        'The infirmary stays open by the occupier\'s grace, and the grace is earned; the healer heals whoever comes, and notes for the occupation whoever should not have been hurt that way.',
      ],
      're-caused': [
        "What first compromised the healer is gone; the occupier's grace sustains the infirmary now, and the weekly notes sustain the grace.",
      ],
      reformed: [
        'The occupier withdrew and the healer confessed the notes to the households they had named, one visit at a time.',
        'With the occupation ended, the healer came clean; the first-and-best treatment was owned, and the infirmary\'s books opened to the town.',
      ],
      historicized: [
        'The occupier is gone, but the healer still keeps the diagnostic notes; the reader who required them has marched.',
      ],
      'exposed-public': [
        'It is public that the healer\'s house calls fed the occupier\'s lists, and every raid that followed a treatment now has its informant.',
        'The notes are out, in the healer\'s hand: wounds described, households named, and the occupation\'s visits mapped to both.',
      ],
      're-adjudicated': [
        "The healer's old paymaster is destroyed, but the occupier remains, and the weekly notes have a new recipient at the same address.",
      ],
    },
    'conduct-drift': {
      attributed: [
        'A dark patron prizes the healer\'s quiet endings; certain deaths in the sickroom arrive early and gently, and each one returns to the healer as blessing and gift.',
        'The healer\'s mercy has developed a sponsor: a patron that rewards the eased passing, chosen or not, and the sickroom\'s worst nights are its best offerings.',
      ],
      're-caused': [
        "The healer's first cause resolved, but a patron that rewards the deed adopted the practice, and its gifts now retain the quiet endings.",
      ],
      reformed: [
        "The patron's shadow lifted and the quiet endings stopped; the healer confessed each one to the families, and let them choose the reckoning.",
        'With the rewarding patron gone, the healer came clean; unsponsored, the eased passings were seen plainly, and forsworn.',
      ],
      historicized: [
        'The patron is gone, but the sickroom\'s quiet endings continue; the sponsorship lapsed and the hand did not.',
      ],
      'exposed-public': [
        'It is public that certain deaths in the sickroom were offerings, and the town is exhuming its trust in every gentle passing.',
        'The sponsorship is out: a dark patron paid for the healer\'s mercy, and the families are re-reading each early death.',
      ],
      're-adjudicated': [
        "The syndicate fell, but the patron that rewards the deed still stands, and the sickroom's arrangement passed into its keeping.",
      ],
    },
    'conversion-pressure': {
      attributed: [
        'The rival faith pays a bounty on miracles, and the healer supplies them; cures are staged, credited to the mission\'s god, and invoiced as witness fees.',
        'Conversion follows recovery, the mission has learned, so it buys recoveries; the healer times the cures to the preaching, and the preaching pays.',
      ],
      're-caused': [
        "The healer's first reason passed; the rival faith's miracle bounty replaced it, and the staged cures keep earning it.",
      ],
      reformed: [
        'The rival faith withdrew and the healer recanted the staged cures publicly, naming the medicine that had done the work.',
        'When the conversion pressure broke, the healer came clean; the witness fees were returned, and the cures re-credited to the craft.',
      ],
      historicized: [
        'The rival faith gave up the town, but the healer still stages the occasional wonder; the bounty that trained it is closed.',
      ],
      'exposed-public': [
        'It is public that the mission\'s miracles were the healer\'s staged cures, and every conversion that followed one is unraveling.',
        'The bounty is out: recoveries were sold as signs, and the healer collected per soul persuaded.',
      ],
      're-adjudicated': [
        'The old patron is gone, but the rival faith still presses, and its miracle bounty has been re-funded through new hands.',
      ],
    },
    secularization: {
      attributed: [
        'The healing vow was sworn to a power this town has stopped feeding, and the healer has stopped honoring it; the charity beds closed quietly, and the oath\'s hard duties lapsed with the faith.',
        'With the faith gone cold, no one audits mercy; the healer treats by profit now, and the vow that once forbade it is a decoration on the wall.',
      ],
      're-caused': [
        "The healer's first cause resolved, but the faith went cold behind it, and with the vow unwatched, the arrangement simply persisted.",
      ],
      reformed: [
        'The faith revived and the healer re-took the vow at the altar; the charity beds reopened the same day, first.',
        'When belief returned, the healer came clean; the lapsed duties were resumed, and the profit-years\' takings endowed the free ward.',
      ],
      historicized: [
        'The faith warmed again, but the charity beds never reopened; the cold season that closed them is over.',
      ],
      'exposed-public': [
        'It is public what the healer let lapse while the vow went unwatched, and the reviving congregation is reading the infirmary\'s ledgers as confession.',
        'The lapsed vow is out: the healer kept the fees and dropped the duties the moment no god was counting, and the town has counted instead.',
      ],
      're-adjudicated': [
        "The healer's paymaster fell, but the faith is still cold, and no revived vow stands between the practice and its prices.",
      ],
    },
    'clergy-scandal': {
      attributed: [
        'The tainted clergy need their history certified natural, and the healer signs; old injuries become accidents, old deaths become fevers, and the retainer arrives with the tithe.',
        'The healer\'s signature launders the temple\'s harms; whatever the disgraced priests did, the medical record now says otherwise, at a page rate.',
      ],
      're-caused': [
        "The healer's first reason resolved, but the tainted priesthood needed a certifier, and the laundered records now carry the arrangement.",
      ],
      reformed: [
        'The priesthood was cleansed and the healer withdrew the false certificates; the true records were filed with the synod, whatever they convicted.',
        "With the clergy's scandal resolved, the healer came clean; the page-rate signatures were confessed and the retainer returned.",
      ],
      historicized: [
        'The temple was set in order, but the false certificates still stand; the healer never withdrew what the mended clergy no longer need.',
      ],
      'exposed-public': [
        'It is public that the healer certified the temple\'s harms as accidents, and the true injuries are being re-read from the false pages.',
        'The laundering is out: the medical record covered the clergy\'s sins at a page rate, and the healer\'s hand is on every page.',
      ],
      're-adjudicated': [
        "The syndicate is gone, but the priesthood's taint remains, and the certification trade has found the healer new clients.",
      ],
    },
    captured: {
      attributed: [
        'The syndicate runs its wounded through the infirmary after dark, and the healer\'s certificates run the other way; deaths that need explaining get natural causes, and the ledger stays innocent.',
        'The underworld holds the infirmary the way it holds the offices: bullets come out quietly, names go down wrong, and the healer\'s honest reputation is the service being used.',
      ],
      're-caused': [
        "The healer's old cause resolved, but the underworld holds the town's offices now, and an infirmary it uses is not released from use.",
      ],
      reformed: [
        'The capture was broken and the healer corrected every certificate; the natural causes were unnaturaled, and the magistrates given the true dates.',
        "With the syndicate's grip broken, the healer came clean; the after-dark patients were named, and the innocent ledger confessed guilty.",
      ],
      historicized: [
        'The capture was broken, but the after-dark door still opens; the master who required it is gone and the habit answers the knock.',
      ],
      'exposed-public': [
        'It is public that the infirmary served the syndicate after dark, and every natural death it certified is being re-examined.',
        'The innocent ledger is out: the healer\'s certificates buried the underworld\'s work, and the town is exhuming the paperwork.',
      ],
      're-adjudicated': [
        'The syndicate that used the infirmary is destroyed, but the offices are still captured, and the after-dark practice has new patients already.',
      ],
    },
    scandal: {
      attributed: [
        'Since the scandal broke, the healer\'s diagnoses have become alibis; the implicated are certified bedridden on the relevant dates, and the certification is priced by the danger.',
        'The scandal made health a legal matter, and the healer bills accordingly; illness appears where testimony is inconvenient, and recovery follows acquittal.',
      ],
      're-caused': [
        "The healer's first cause cleared, but the scandal broke behind it, and the alibi practice now sustains the arrangement.",
      ],
      reformed: [
        'The scandal burned out and the healer withdrew the convenient diagnoses; the court was told which illnesses had been real.',
        'When the scandal settled, the healer came clean; the alibi certificates were confessed, and the fees surrendered to the court.',
      ],
      historicized: [
        'The scandal is old news, but the convenient diagnoses continue; the danger that priced them has passed.',
      ],
      'exposed-public': [
        'It is public that the healer\'s diagnoses tracked the scandal\'s court dates, and the certified illnesses are being re-examined by the calendar.',
        'The alibi practice is out: sickness for sale on the relevant dates, and the healer\'s certificates timed like clockwork.',
      ],
      're-adjudicated': [
        "The syndicate is broken, but the scandal's economy survives, and the alibi trade has new underwriters holding the healer's pen.",
      ],
    },
  },
  // ── labor_resource — the foreman (crews, quotas, tallies, the yards) ────────
  labor_resource: {
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
  },
  // ── diplomat_outsider — the envoy (dispatches, patrons abroad, protocol) ────
  diplomat_outsider: {
    underfunded: {
      attributed: [
        'The mission\'s funding stopped arriving, and the envoy found other readers for the dispatches; the reports still go home, but copies go wherever the retainer comes from.',
        'An unfunded embassy is a stall in a market, and the envoy has learned to trade; the dispatches are sold by the page, and the buyers are never the addressee.',
      ],
      're-caused': [
        'What first bent the envoy has passed; the unfunded mission bends them now, and the sold dispatches are called keeping the embassy open.',
      ],
      reformed: [
        'The funding resumed and the envoy stopped the copies; the buyers were named in the next dispatch home, above the envoy\'s own confession.',
        'With the mission funded again, the envoy came clean; the sold pages were listed, and the retainers returned through channels everyone could see.',
      ],
      historicized: [
        'The funding recovered, but the copies still go out; the poverty that excused them is old accounting.',
      ],
      'exposed-public': [
        'It is public that the envoy\'s dispatches had subscribers, and every government that read them is re-reading its decisions.',
        'The subscription list is out: the envoy retailed the mission\'s eyes, and the town has learned who watched through them.',
      ],
      're-adjudicated': [
        'The syndicate paying the envoy is destroyed, but the mission is still unfunded, and the dispatch trade has found new subscribers already.',
      ],
    },
    'chain-starved': {
      attributed: [
        'The courier lines are cut, so the envoy\'s letters travel with smugglers, and the smugglers read as they carry; the envoy knows, and is paid handsomely for the not-minding.',
        'Correspondence still moves because the envoy hired the only carriers left; the seals arrive broken and re-pressed, and the envoy\'s silence about it has a monthly rate.',
      ],
      're-caused': [
        "The envoy's first reason is gone; the dead courier lines reason for them now, and the read-in-transit letters keep paying the rate.",
      ],
      reformed: [
        'The courier lines were restored and the envoy dropped the smuggler carriers; the read letters were re-sent sealed, with an accounting of what had leaked.',
        'With honest couriers riding again, the envoy came clean; the not-minding fees were surrendered, and the correspondents warned of every broken seal.',
      ],
      historicized: [
        'The courier lines are mended, but the letters still ride with the quiet carriers; the necessity that hired them is over.',
      ],
      'exposed-public': [
        'It is public that the mission\'s letters were read in transit with the envoy\'s paid consent, and every correspondent is burning old assumptions.',
        'The broken seals are out: the envoy sold the mail\'s privacy to its carriers, and the town is guessing what traveled unsealed.',
      ],
      're-adjudicated': [
        'The old carriers are destroyed, but the courier lines are still cut, and whoever moves letters now inherited the envoy\'s rate.',
      ],
    },
    depleted: {
      attributed: [
        'The mission has nothing left to offer, so the envoy offers what does not exist; concessions are promised that no one authorized, and the consideration for them stays with the promiser.',
        'Diplomacy runs on gifts, and the gift chest is empty; the envoy trades in promises instead, and pockets what the promises fetch, knowing none will ever be honored.',
      ],
      're-caused': [
        "The envoy's first cause has passed; the empty gift chest reasons for them now, and the unauthorized promises keep fetching their price.",
      ],
      reformed: [
        'The mission was resupplied and the envoy recalled the false promises, each with its compensation; the fetched consideration was returned first.',
        'With the gift chest refilled, the envoy came clean; the unauthorized concessions were disavowed by the envoy before any injured party asked.',
      ],
      historicized: [
        'The mission recovered, but the false promises still circulate; the emptiness that coined them has been resupplied.',
      ],
      'exposed-public': [
        'It is public that the envoy sold concessions no one authorized, and the holders of those promises are presenting them for payment.',
        'The promise trade is out: the envoy pocketed the consideration for a future that was never coming, and the buyers have arrived in it.',
      ],
      're-adjudicated': [
        'The syndicate is gone, but the mission is still empty-handed, and the promise trade has new brokers holding the envoy\'s signature.',
      ],
    },
    'trade-strangled': {
      attributed: [
        'The embargo terms pass across the envoy\'s desk before they are announced, and certain merchants are never surprised; foreknowledge has a price, and the envoy collects it in advance of every proclamation.',
        'Trade policy is the envoy\'s trade now; who will be embargoed, when, and for what, sold quietly to those whose fortunes turn on the timing.',
      ],
      're-caused': [
        'What first held the envoy has passed; the embargo holds them now, and each advance sale of its terms renews the arrangement.',
      ],
      reformed: [
        'The embargo lifted and the envoy disclosed the advance sales; the forewarned merchants were named to the ones who were not.',
        'When the trade war ended, the envoy came clean; the timing fees were surrendered, and the desk sealed against the habit.',
      ],
      historicized: [
        'The embargo is lifted, but the desk still leaks; the terms that made the leaking valuable are repealed.',
      ],
      'exposed-public': [
        'It is public that the embargo\'s terms were sold in advance from the envoy\'s desk, and the ruined are matching their losses to the forewarned\'s gains.',
        'The advance sales are out: the envoy retailed the future of the town\'s trade, and the buyers\' fortunes date the deliveries.',
      ],
      're-adjudicated': [
        'The old buyers are destroyed, but the trade is still strangled, and the foreknowledge trade continues to new subscribers.',
      ],
    },
    'levied-away': {
      attributed: [
        'With the town\'s strength at war, the reports the envoy sends home decide what help comes and when; the reports are edited now, and the editor is paid by those who prefer the help delayed.',
        'The envoy\'s dispatches are the town\'s voice abroad while its men are away fighting, and the voice has been bought; what home hears is curated by interests home has never met.',
      ],
      're-caused': [
        "The envoy's first cause resolved, but the levy made the dispatches decisive, and the editing fees now sustain the arrangement.",
      ],
      reformed: [
        'The companies came home and the envoy sent the uncut record after the cut one, with the differences marked and the fees enclosed.',
        'When the strength returned, the envoy came clean; the curated dispatches were confessed, and the curators named to both capitals.',
      ],
      historicized: [
        'The strength is home, but the dispatches are still curated; the war that made them decisive is over.',
      ],
      'exposed-public': [
        'It is public that the town\'s voice abroad was edited for pay while its men fought, and the withheld paragraphs are being read aloud.',
        'The editing is out: the envoy sold silence in the dispatches, and the help that never came now has an explanation.',
      ],
      're-adjudicated': [
        'The syndicate fell, but the strength is still levied away, and the dispatch-editing has been re-commissioned by new interests.',
      ],
    },
    'garrison-drained': {
      attributed: [
        'The envoy\'s foreign patrons pay well for honest assessments, and the honest assessment is that this town cannot defend itself; the envoy files it abroad monthly, itemized, with the gate rotations attached.',
        'A hollow garrison is valuable intelligence, and the envoy is its exporter; the weakness travels abroad in diplomatic language, and the finder\'s fee travels back.',
      ],
      're-caused': [
        "The envoy's first reason passed, but the garrison hollowed after, and the weakness reports now earn the arrangement's keep.",
      ],
      reformed: [
        'The garrison was refilled and the envoy corrected the record abroad; the weakness reports were retracted, and the retraction cost the fees.',
        'With the ranks restored, the envoy came clean; the exported assessments were confessed to the council with the patrons\' names.',
      ],
      historicized: [
        'The garrison stands full again, but the assessments still go abroad; the weakness they described has been repaired without their notice.',
      ],
      'exposed-public': [
        'It is public that the envoy exported the town\'s weakness with the gate rotations attached, and the town is changing the rotations first and the locks second.',
        'The weakness reports are out: the envoy sold the hollow garrison abroad by the month, and the buyers are the town\'s new anxiety.',
      ],
      're-adjudicated': [
        'The old patrons are destroyed, but the garrison is still drained, and the weakness trade has found the envoy new readers.',
      ],
    },
    'siege-scarred': {
      attributed: [
        'The envoy carries the peace terms between the camps, and each camp reads the other\'s first; the carrying is the office, the pre-reading is the income.',
        'War diplomacy runs through the envoy\'s satchel, and the satchel leaks by appointment; both sides negotiate against terms they have already bought.',
      ],
      're-caused': [
        "The envoy's old cause cleared, but the war pressed in, and the satchel's leaks now finance the arrangement.",
      ],
      reformed: [
        'The war receded and the envoy confessed the pre-readings to both camps at once, which is the only safe order to do it in.',
        'With the pressure lifted, the envoy came clean; the leak fees were surrendered, and the satchel carried its last terms sealed.',
      ],
      historicized: [
        'The war moved on, but the satchel still leaks by appointment; the negotiations that priced it have concluded.',
      ],
      'exposed-public': [
        'It is public that both camps bought each other\'s terms from the envoy\'s satchel, and the peace they signed is being re-read for what the leaking bought.',
        'The pre-readings are out: the envoy sold the negotiation to itself, and both signatories want the difference refunded.',
      ],
      're-adjudicated': [
        'The syndicate is broken, but the war still presses, and the satchel\'s appointments have been rebooked by new clients.',
      ],
    },
    occupation: {
      attributed: [
        'The envoy is accredited to the occupier now, and the accreditation is earned; the protests filed are hollow by agreement, and the townsfolk who ask for intercession are reported for asking.',
        'The mission survives the occupation by serving it; the envoy\'s official complaints arrive pre-softened, and the occupier\'s answers arrive pre-approved, and the theater fools only the town.',
      ],
      're-caused': [
        "What first compromised the envoy is gone; the occupier's accreditation sustains the mission now, and the hollow protests keep the accreditation.",
      ],
      reformed: [
        'The occupier withdrew and the envoy published the agreement that had hollowed the protests, with every reported name and an unsoftened apology.',
        'With the occupation ended, the envoy came clean; the pre-approved theater was confessed, and the reported petitioners sought out one by one.',
      ],
      historicized: [
        'The occupier is gone, but the envoy still files protests shaped for a censor; the agreement that shaped them expired with the occupation.',
      ],
      'exposed-public': [
        'It is public that the envoy\'s protests were theater by agreement, and the petitioners who were reported for asking help are the first to speak.',
        'The accreditation\'s price is out: hollow complaints and reported names, and the envoy\'s signature on the arrangement.',
      ],
      're-adjudicated': [
        "The envoy's old paymaster is destroyed, but the occupier remains, and the accreditation has been renewed on the standing terms.",
      ],
    },
    'conduct-drift': {
      attributed: [
        'A dark patron prizes betrayal above all offerings, and the envoy\'s office is made of trusts to betray; each broken confidence returns as favor, and the envoy has grown rich in favor.',
        'The envoy\'s treacheries have acquired a theology; a patron that rewards the betrayed trust sponsors them, and the diplomatic pouch has become a reliquary of other people\'s secrets.',
      ],
      're-caused': [
        "The envoy's first cause resolved, but a patron that rewards the deed adopted the treacheries, and its favor now retains them.",
      ],
      reformed: [
        "The patron's shadow lifted and the envoy stopped the betrayals; the broken confidences were confessed to their owners, unprompted and complete.",
        'With the rewarding patron gone, the envoy came clean; the sponsored treacheries lost their wages, and the envoy found nothing else in them.',
      ],
      historicized: [
        'The patron is gone, but the envoy still breaks confidences by habit; the sponsorship that trained the hand is over.',
      ],
      'exposed-public': [
        'It is public that the envoy\'s betrayals were devotions to a dark patron, and every broken trust is being recounted as an offering.',
        'The sponsorship is out: treachery from this mission was paid worship, and the capitals that trusted the envoy have been told.',
      ],
      're-adjudicated': [
        "The syndicate fell, but the patron that rewards the deed still stands, and the envoy's treacheries passed into its service whole.",
      ],
    },
    'conversion-pressure': {
      attributed: [
        'The rival faith funds the mission\'s expenses now, and the mission carries their people; missionaries travel in the envoy\'s baggage as clerks and translators, and the credentials are real because the envoy signs them.',
        'The envoy\'s diplomatic immunity has become a corridor; the rival faith moves its preachers and its purse through it, and the tolls fund the embassy.',
      ],
      're-caused': [
        "The envoy's first reason passed; the rival faith's funding replaced it, and the credentialed missionaries keep the corridor open.",
      ],
      reformed: [
        'The rival faith withdrew and the envoy voided the false credentials; the corridor closed, and the funded expenses were repaid.',
        'When the conversion pressure broke, the envoy came clean; the baggage-clerks were named as preachers, and the immunity restored to its purpose.',
      ],
      historicized: [
        'The rival faith gave up the town, but the corridor is still open; the mission it carried has stopped sending.',
      ],
      'exposed-public': [
        'It is public that the mission\'s baggage carried the rival faith\'s preachers under real credentials, and the signing hand is known.',
        'The corridor is out: the envoy rented diplomatic immunity to the conversion, and both congregations are auditing the clerks.',
      ],
      're-adjudicated': [
        'The old patron is gone, but the rival faith still presses, and the corridor\'s tolls have been re-funded by its successors.',
      ],
    },
    secularization: {
      attributed: [
        'A diplomatic seal is only as sacred as the oath under it, and the oaths here died with the faith; the envoy opens what should stay sealed and resells safe-conducts that were sworn, once, before a god.',
        'With the faith gone cold, the envoy\'s sworn instruments became paper; safe-conducts are reissued to second buyers, and the original holders learn at the gate.',
      ],
      're-caused': [
        "The envoy's first cause resolved, but the faith went cold behind it, and with the oaths dead, the resold instruments simply multiplied.",
      ],
      reformed: [
        'The faith revived and the envoy re-swore the office\'s oaths; the double-issued safe-conducts were honored twice over at the mission\'s cost.',
        'When belief returned, the envoy came clean; the opened seals were confessed, and the instruments made single and sacred again.',
      ],
      historicized: [
        'The faith warmed again, but the instruments still ride double; the cold season that loosened the seals is past.',
      ],
      'exposed-public': [
        'It is public that the envoy resold sworn safe-conducts while the oaths meant nothing, and the stranded holders are presenting both copies.',
        'The opened seals are out: the envoy treated the sacred instruments as stationery, and the reviving faith is reading the wax.',
      ],
      're-adjudicated': [
        "The envoy's paymaster fell, but the faith is still cold, and no revived oath seals the instruments against the habit.",
      ],
    },
    'clergy-scandal': {
      attributed: [
        'The temple\'s disgrace must not reach the foreign courts, and the envoy is paid to see it does not; the containment is professional, the retainer is generous, and the leverage compounds monthly.',
        'Abroad, the clergy\'s scandal is a rumor, and the envoy keeps it one; dispatches are trimmed, inquiries misdirected, and the temple pays the mission\'s best salary for the service.',
      ],
      're-caused': [
        "The envoy's first reason resolved, but the tainted priesthood needed containment abroad, and the retainer now carries the arrangement.",
      ],
      reformed: [
        'The priesthood was cleansed and the envoy ended the containment; the trimmed dispatches were completed and re-sent, with the retainer returned.',
        "With the clergy's scandal resolved, the envoy came clean; the misdirected inquiries were answered honestly, however late.",
      ],
      historicized: [
        'The temple was set in order, but the containment retainer still arrives; the scandal it suppresses is already absolved.',
      ],
      'exposed-public': [
        'It is public that the envoy was the scandal\'s customs officer, and the foreign courts are reading the untrimmed record at last.',
        'The containment is out: the temple\'s disgrace was managed abroad for a retainer, and the manager\'s name is on the receipts.',
      ],
      're-adjudicated': [
        "The syndicate is gone, but the priesthood's taint remains, and the containment retainer has been assumed by new principals.",
      ],
    },
    captured: {
      attributed: [
        'The syndicate discovered what the envoy always knew: diplomatic baggage is never searched; their goods travel under the mission\'s seals now, and the envoy\'s allowance reflects the tonnage.',
        'The underworld holds the offices, and the mission\'s immunity is its favorite; the envoy\'s pouches ride heavy, and the weight is never diplomatic.',
      ],
      're-caused': [
        "The envoy's old cause resolved, but the underworld holds the offices now, and an immunity it uses is not returned to its owner.",
      ],
      reformed: [
        'The capture was broken and the envoy opened the baggage to the magistrates; the tonnage records were produced from the envoy\'s own files.',
        "With the syndicate's grip broken, the envoy came clean; the heavy pouches were confessed, and the immunity surrendered until trust returned.",
      ],
      historicized: [
        'The capture was broken, but the pouches still ride heavy; the customer is gone and the route remembers itself.',
      ],
      'exposed-public': [
        'It is public that the mission\'s baggage moved the syndicate\'s goods, and every unsearched crossing is being reweighed from the records.',
        'The tonnage is out: the envoy rented the seals to the underworld by weight, and the allowance books kept honest track of the dishonesty.',
      ],
      're-adjudicated': [
        'The syndicate that filled the pouches is destroyed, but the offices are still captured, and the new holders have re-booked the route.',
      ],
    },
    scandal: {
      attributed: [
        'The town\'s scandal is valuable abroad, and the envoy is its exporter; the disgrace travels out as intelligence briefs, priced by the name, and the foreign buyers file it for later.',
        'Every capital wants to know which of this town\'s hands are dirty, and the envoy sells the manicure records; the scandal\'s details leave in the dispatch case and the fees come back in it.',
      ],
      're-caused': [
        "The envoy's first cause cleared, but the scandal broke behind it, and exporting its details now sustains the arrangement.",
      ],
      reformed: [
        'The scandal burned out and the envoy recalled the briefs where recalling was possible, and confessed the rest to the council by name.',
        'When the scandal settled, the envoy came clean; the export fees were surrendered, and the buyers\' identities filed with the magistrates.',
      ],
      historicized: [
        'The scandal is old news at home, but the envoy still exports it; the foreign appetite outlived the local one.',
      ],
      'exposed-public': [
        'It is public that the envoy sold the town\'s disgrace abroad by the name, and the named are learning which capitals hold their files.',
        'The export trade is out: the scandal\'s details crossed the border in the dispatch case, and the town\'s shame has foreign shareholders now.',
      ],
      're-adjudicated': [
        "The syndicate is broken, but the scandal's economy survives, and the export trade has been re-brokered to new buyers.",
      ],
    },
  },
  // ── dissident — the agitator (the movement, pamphlets, crowds) ──────────────
  dissident: {
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
  },
});
