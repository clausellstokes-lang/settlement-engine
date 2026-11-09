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
      'The treasury is empty, and the ruler has been selling signatures: seats on the council now go to whoever pays.',
    ],
    're-caused': [
      "The ruler's first reason for selling charters is gone, but now the treasury is empty, and every charter sold is called necessity.",
    ],
    reformed: [
      'The treasury recovered and the ruler stopped the sales; the last bought office was revoked publicly, as a promise.',
      'With the coffers refilled, the ruler came clean; what the shortfall had excused was ended, and the sold charters were called in.',
    ],
    historicized: [
      'The treasury has recovered, but the ruler still sells favors under the seal to whoever pays.',
    ],
    'exposed-public': [
      'It is public that the ruler sold offices against the empty treasury, and every appointee now wears a price tag in the town\'s eyes.',
      "The town has learned what the ruler's signature cost during the shortfall, and the men who bought their charters are as exposed as the hand that sold them.",
    ],
    're-adjudicated': [
      'Whoever paid the ruler before is gone, but now the treasury is short, and the ruler sells signatures to fill it.',
    ],
  },
  'chain-starved': {
    attributed: [
      'The supply lines failed, and the ruler granted emergency monopolies to whoever could still deliver; the kickbacks on those contracts never appear in the minutes.',
      'When the wagons stopped, the ruler chose who would feed the town, and chose by tribute; the emergency contracts read like a list of donors.',
    ],
    're-caused': [
      "The ruler's first reason is gone, but now the supply roads are cut, and every shortage in the market is a contract the ruler can sell.",
    ],
    reformed: [
      'The supply lines were restored and the ruler dissolved the emergency monopolies; the contracts went back to open bidding, tribute refused.',
      'With the wagons running again, the ruler came clean and canceled the donor contracts; the emergency that dressed them up was over.',
    ],
    historicized: [
      'The supply lines are mended, but the ruler still sells the emergency monopolies to whoever pays tribute.',
    ],
    'exposed-public': [
      'It is out that the ruler sold the emergency contracts while the town went short, and the donor list is being read against the delivery records.',
      'The town knows now who paid for the right to feed it during the shortage, and knows the ruler set the price.',
    ],
    're-adjudicated': [
      'Whoever held the ruler before is gone, but now the supply roads are cut, and the ruler answers to whoever can fill the emergency contracts.',
    ],
  },
  depleted: {
    attributed: [
      'The reserve is empty and the ruler decides who eats from what remains; the distribution lists read like a register of loyalty.',
      'The stores are nearly empty, and the ruler hands out what is left in trade for favors.',
    ],
    're-caused': [
      "The ruler's first reason is gone, but now the reserve is empty, and every ration the ruler grants is paid back in loyalty.",
    ],
    reformed: [
      'The reserve was refilled and the ruler burned the loyalty lists; relief moves by need again, and the ledgers can prove it.',
      'With the stores replenished, the ruler came clean; the traded rations were accounted, and the seat ate last for a while by way of answer.',
    ],
    historicized: [
      'The stores were refilled, but the ruler still hands out relief to the loyal first.',
    ],
    'exposed-public': [
      'It is public that the ruler fed loyalty first while the reserve ran dry, and the households that went hungry are reading the lists.',
      "The distribution lists are out in the ruler's own hand: rations went to the loyal first, and the town knows who went hungry.",
    ],
    're-adjudicated': [
      'Whoever paid the ruler before is gone, but now the reserve is empty, and the ruler hands out rations for favors.',
    ],
  },
  'trade-strangled': {
    attributed: [
      "The embargo strangles the town's trade, except where the ruler's seal makes exceptions; the exemptions are sold in private audience.",
      'The ruler signed the embargo and now sells exemptions from it in private.',
    ],
    're-caused': [
      "The ruler's first reason is gone, but now the embargo holds, and the ruler sells sealed exemptions from it.",
    ],
    reformed: [
      'The embargo lifted and the exemption trade died with it; the ruler published the old grants unprompted and took the anger standing.',
      'With the routes reopened, the ruler came clean; the sealed exceptions were revoked, and the seal itself changed keepers.',
    ],
    historicized: [
      'The embargo has lifted, but the ruler still sells merchants exemptions from rules that no longer apply.',
    ],
    'exposed-public': [
      'It is public that the ruler sold exemptions from the embargo they enforced, and the merchants who starved lawfully are the loudest in the square.',
      'It is out that the ruler kept the embargo strict so the exemptions would sell high, and the town has the sealed grants to prove it.',
    ],
    're-adjudicated': [
      "Whoever held the ruler before is gone, but now the embargo holds, and the exemption money goes to whoever holds the ruler's debts.",
    ],
  },
  'levied-away': {
    attributed: [
      "The town's strength is at war, and the ruler governs the remainder unwatched; powers the council never granted have been quietly annexed to the seat.",
      'With the fighters levied away to the war, no one is left to refuse the ruler, and seizures are now issued as decrees.',
    ],
    're-caused': [
      "The ruler's first reason is gone, but now the fighters are levied away to the war, and no one is left to object to what the ruler takes.",
    ],
    reformed: [
      'The companies returned and the ruler laid the annexed powers down; what absence had permitted was handed back before it was demanded.',
      'When the strength came home, the ruler came clean; the wartime decrees were repealed in a sitting, and the seizures reversed.',
    ],
    historicized: [
      'The fighters are home, but the ruler still wields the powers seized while they were away.',
    ],
    'exposed-public': [
      'The returned companies have learned what the ruler decreed while they were away, and the wartime seizures are being read out at the cross.',
      "It is public that the ruler governed the empty town for the seat's own gain, and the veterans want back what was taken in their absence.",
    ],
    're-adjudicated': [
      'Whoever paid the ruler before is gone, but now the fighters are away at the war, and the ruler takes powers the council never granted.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'The garrison is too thin to enforce the law, so the ruler uses private muscle, and the law stays away from wherever that muscle works.',
      "With the garrison hollow, hired hands carry out the ruler's decrees, and their pay is that no one asks about their other business.",
    ],
    're-caused': [
      "The ruler's first reason is gone, but now the garrison is half empty, and the hired muscle keeps the ruler in its debt.",
    ],
    reformed: [
      'The garrison was refilled and the ruler dismissed the private muscle; the law stopped looking away, starting with its former lenders.',
      'With the ranks restored, the ruler came clean; the enforcement debts were paid off in coin, not in blindness, and closed.',
    ],
    historicized: [
      'The garrison is full again, but the ruler still pays the hired muscle by looking away from their other business.',
    ],
    'exposed-public': [
      'It is public that the ruler paid for order with legal blindness, and the crimes the law overlooked are being listed beside the decrees it enforced.',
      "The town knows now whose hands carried the ruler's law while the garrison stood empty, and what those hands were allowed in return.",
    ],
    're-adjudicated': [
      'Whoever paid the ruler before is gone, but now the garrison is half empty, and the ruler owes the same debt to whoever does the enforcing.',
    ],
  },
  'siege-scarred': {
    attributed: [
      "The war levies flow through the ruler's hands, and not all of them flow out; the walls are one course lower than the accounts say.",
      "Under the war's pressure the ruler taxes for defense and spends for the seat; the difference is buried in the emergency.",
    ],
    're-caused': [
      "The ruler's first reason is gone, but now the war presses in, and the ruler skims the emergency levies.",
    ],
    reformed: [
      "The war receded and the ruler published the defense accounts entire; the missing course of the wall was rebuilt from the seat's own purse.",
      'With the pressure lifted, the ruler came clean about the levies; what the emergency had hidden was repaid in the open.',
    ],
    historicized: [
      'The war has moved on, but the ruler still collects the emergency levies and keeps part of them for the seat.',
    ],
    'exposed-public': [
      'It is out that the ruler skimmed the war levies, and the town is measuring its walls against what it paid for them.',
      'The defense accounts are public now and they come up short: the ruler spent the war levies on the seat, and the town can see it.',
    ],
    're-adjudicated': [
      'Whoever held the ruler before is gone, but now the war presses in, and the ruler skims the levies alongside whoever collects them.',
    ],
  },
  occupation: {
    attributed: [
      "The ruler keeps the seat by the occupier's leave, and earns the leave daily: requisitions signed, resisters named, appearances kept.",
      'The occupier wants a native ruler, and the ruler keeps the seat by signing what the occupier asks; the town pays the cost.',
    ],
    're-caused': [
      "The ruler's first reason is gone, but now the occupier's leave keeps the ruler in the seat, and the ruler keeps earning it.",
    ],
    reformed: [
      'The occupier withdrew and the ruler ended the accommodation, then laid the whole record of it before the council unasked.',
      'With the occupation ended, the ruler came clean; whatever the seat had signed under the occupier was published, and the town judged it.',
    ],
    historicized: [
      'The occupier is gone, but the ruler still names resisters and signs requisitions as if the occupier were watching.',
    ],
    'exposed-public': [
      'It is public what the ruler signed to keep the seat under the occupier, and each requisition now has families attached to it.',
      "Collaboration is said openly of the ruler now; the occupier's records marched away, but copies stayed, and they are being read.",
    ],
    're-adjudicated': [
      "Whoever paid the ruler before is gone, but now the ruler keeps the seat by the occupier's leave and answers to its officials.",
    ],
  },
  'conduct-drift': {
    attributed: [
      'A dark patron stands behind the ruler and repays each unjust decree with favor and protection.',
      "The ruler's cruelties have a sponsor: a dark patron that pays in power for each one.",
    ],
    're-caused': [
      "The ruler's first reason is gone, but a dark patron that rewards cruelty has taken its place, and its favor now props up the seat.",
    ],
    reformed: [
      "The patron's shadow passed and the ruler set the cruelty down; unsponsored, the decrees read as plainly as crimes, and were repealed.",
      'With the rewarding patron gone, the ruler came clean; the seat renounced the favors and the deeds that had earned them together.',
    ],
    historicized: [
      'The patron is gone, but the ruler still issues decrees as cruel as the ones it paid for.',
    ],
    'exposed-public': [
      "It is public that the ruler's oppressions were offerings to a dark patron, and the town is naming each decree it endured as one.",
      'It is out that the ruler served a dark patron that paid for cruelty, and every judgment from the seat is being heard again.',
    ],
    're-adjudicated': [
      'Whoever held the ruler before is gone, but now a dark patron rewards each cruel decree, and the ruler serves it.',
    ],
  },
  'conversion-pressure': {
    attributed: [
      "The rival faith is buying policy, and the ruler is selling it: edicts tilt toward the converts, and their temple's petitions never wait.",
      "The rival mission's purse reaches the seat, and the seat leans; land, licenses, and rulings drift their way one signature at a time.",
    ],
    're-caused': [
      "The ruler's first reason is gone, but now the rival faith's money keeps the edicts leaning its way.",
    ],
    reformed: [
      'The rival faith withdrew and the ruler straightened the edicts; the bought tilt was repealed measure by measure, in public.',
      'When the conversion pressure broke, the ruler came clean; the patronage was returned and the leaning rulings reversed.',
    ],
    historicized: [
      'The rival faith gave up the town, but the ruler still bends edicts toward its converts.',
    ],
    'exposed-public': [
      'It is out that the rival faith paid the seat for its edicts, and both congregations are re-reading every ruling of the tenure.',
      'The patronage is public: the ruler sold the tilt of the law to the rival mission, and the sold rulings are being listed at the temple doors.',
    ],
    're-adjudicated': [
      "Whoever paid the ruler before is gone, but now the rival faith presses in, and its money buys the ruler's edicts.",
    ],
  },
  secularization: {
    attributed: [
      'The oath of office was sworn before a god no one fears anymore, and the ruler governs accordingly; what the oath forbade is now merely impolite.',
      'With the faith gone cold, nothing holds the ruler to the oath of office but habit, and the ruler has been seeing how far that goes.',
    ],
    're-caused': [
      "The ruler's first reason is gone, but now the faith has gone cold, and nothing sacred is left to stop the ruler.",
    ],
    reformed: [
      'The faith revived and the ruler put the seat back under its oath; what the cold season had loosened was bound again, first.',
      'When belief returned, the ruler came clean; the oath of office was re-sworn at the altar, and this time the town watched.',
    ],
    historicized: [
      'The faith has warmed again, but the ruler still governs as if the oath of office bound nothing.',
    ],
    'exposed-public': [
      'It is public what the ruler did while the god of the oath went unfeared, and the reviving faithful read the tenure as one long trespass.',
      'The town knows now that when the faith went cold the ruler went with it; what the ruler did that season is out.',
    ],
    're-adjudicated': [
      'Whoever held the ruler before is gone, but now the faith has gone cold, and no oath holds the ruler back.',
    ],
  },
  'clergy-scandal': {
    attributed: [
      "The ruler holds the temple's disgrace like a deed of title; the tainted priests keep their pulpits, and the seat keeps a share of the tithe.",
      'What the ruler knows about the clergy would empty the temple, so the temple pays the seat in obedience and silver both.',
    ],
    're-caused': [
      "The ruler's first reason is gone, but now the priesthood is disgraced, and the ruler takes the temple's silver to keep its shame quiet.",
    ],
    reformed: [
      'The priesthood was cleansed and the leverage died; the ruler released the temple and returned the shame-bought tithe.',
      "With the clergy's scandal resolved, the ruler came clean; the hold over the temple was surrendered with the silver.",
    ],
    historicized: [
      'The temple was set in order, but the ruler still holds its disgrace over the priests and takes their silver.',
    ],
    'exposed-public': [
      "It is out that the ruler farmed the temple's disgrace for tithe and obedience, and priest and prince are now disgraced together.",
      "The town has learned the seat blackmailed the altar; the clergy's scandal was the ruler's revenue, and both books are open.",
    ],
    're-adjudicated': [
      'Whoever paid the ruler before is gone, but now the priesthood is disgraced, and whoever trades in its silence has a hold on the ruler too.',
    ],
  },
  captured: {
    attributed: [
      "The underworld owns this seat the way it owns the rest: the ruler's appointments come with names attached, and the names are never the ruler's choice.",
      'The underworld governs from below the seat, and the ruler signs its orders as they arrive.',
    ],
    're-caused': [
      "The ruler's first reason is gone, but now the underworld holds the offices, and it does not let the ruler step down.",
    ],
    reformed: [
      'The capture was broken and the ruler stood out from under it; the attached appointments were dismissed in a single sitting.',
      "With the syndicate's grip broken, the ruler came clean; the sealed instructions were laid before the council as evidence.",
    ],
    historicized: [
      "The underworld's hold was broken, but the ruler still fills offices with the names it used to send.",
    ],
    'exposed-public': [
      'It is public that the seat answered to the underworld, and every appointment of the tenure is being traced to its true author.',
      'The capture has reached the ruler by name: the town knows its decrees were drafted below, and knows whose hand signed them anyway.',
    ],
    're-adjudicated': [
      'Whoever owned the seat before is gone, but now the underworld holds the offices, and the ruler signs for whoever holds them.',
    ],
  },
  scandal: {
    attributed: [
      'Since the scandal broke, the ruler has run the reckoning as a market: prosecutions are priced, pardons are priced higher, and the seat collects both ways.',
      'In the scandal, the ruler takes money from the guilty to forget them and from the innocent to clear them.',
    ],
    're-caused': [
      "The ruler's first reason is gone, but now a scandal has broken, and the ruler sells its pardons and prosecutions.",
    ],
    reformed: [
      'The scandal burned out and the ruler came clean; the priced pardons were annulled and the bought prosecutions dismissed, whatever it cost the seat.',
      'When the scandal settled, the ruler ended the market in mercy; the last payments were returned with the verdicts unbought.',
    ],
    historicized: [
      'The scandal has settled, but the ruler still sells pardons to the guilty.',
    ],
    'exposed-public': [
      'It is out that the ruler sold pardons through the scandal, and the town is matching verdicts to payments in the open.',
      'The scandal has reached the ruler: the trials themselves were for sale, and the ruler sold them.',
    ],
    're-adjudicated': [
      'Whoever paid the ruler before is gone, but now a scandal has broken, and the ruler sells mercy to whoever can pay.',
    ],
  },
};
