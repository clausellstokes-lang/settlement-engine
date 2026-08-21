/**
 * causeConjunctionRole/ruler.js — the ROLE-TIER conjunction lines for
 * ruler — the ruler (charter, seal, council, treasury).
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
export const RULER_ROLE_CONTENT = {
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
};
