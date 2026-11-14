/**
 * causeConjunctionRole/arcane.js — the ROLE-TIER conjunction lines for
 * arcane — the adept (wards, reagents, commissions, the library).
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
export const ARCANE_ROLE_CONTENT = {
  underfunded: {
    attributed: [
      'The patrons stopped paying, and the adept stopped turning work away. Commissions once refused at any price are taken now, and the clients come after dark.',
      'With no patron paying for the tower, the adept works for whoever pays, and the work has drifted past what the town would call lawful.',
    ],
    're-caused': [
      'The adept\'s first reason is gone, but now no patron pays, and the after-dark commissions pay what daylight work will not.',
    ],
    reformed: [
      'The patronage returned and the adept refused the dark commissions; the waiting clients were named to the council, deposits returned.',
      'With the tower funded again, the adept came clean; the work done in the dry season was cataloged and, where it could be, undone.',
    ],
    historicized: [
      'The patrons pay again, but the after-dark clients still knock, and the adept still takes their work.',
    ],
    'exposed-public': [
      'It is public what the adept sold when the patronage failed, and the commissions are being read out with their buyers attached.',
      "The dark work is out: the adept kept a list of every job taken after dark while no patron paid, and the town is reading it.",
      "The people who bought the adept's after-dark work are hearing their own names read out in the street, next to what they paid for.",
    ],
    're-adjudicated': [
      'Whoever paid the adept before is gone, but now no patron pays for the tower, and the after-dark clients keep the adept in work.',
    ],
  },
  'chain-starved': {
    attributed: [
      'The trade in reagents died with the roads, so the adept buys from grave-robbers and worse. The work goes on, and some things on the shelves were taken from the dead.',
      'What the craft needs no longer comes by caravan, and the adept has stopped asking where it comes from. The suppliers ask no questions in return.',
    ],
    're-caused': [
      "The adept's first reason is gone, but now the roads are closed to the reagent trade, and the grave-robbers keep the work supplied.",
    ],
    reformed: [
      'The reagent trade revived and the adept purged the shelves; what had histories was buried back where it came from, witnessed.',
      'With the caravans running, the adept came clean; the resurrection men lost their best customer and the council gained a list.',
    ],
    historicized: [
      'The caravans are back, but the adept still buys from the grave-robbers.',
    ],
    'exposed-public': [
      'It is public that the adept\'s shelves were stocked by grave-robbers, and the families of the robbed are reading the inventory.',
      "It is out that the adept's work ran on goods from robbed graves while the roads were closed, and the town wants to know whose dead they were.",
      'Families with graves outside the town are asking the adept to their face which of the goods on those shelves came from their own dead.',
    ],
    're-adjudicated': [
      "Whoever supplied the adept before is gone, but the roads are closed now, and whoever robs graves fills the adept's shelves.",
    ],
  },
  depleted: {
    attributed: [
      'The materials ran out, so the adept has been taking parts from the town\'s own wards. The protections still hold, but thinner, and only the adept knows where the gaps are.',
      'The materials are gone, so the adept strips old enchantments to feed new ones, and still bills the town for wards it no longer fully has.',
    ],
    're-caused': [
      "The adept's first reason is gone, but now the stores are empty, and the adept keeps stripping the town's wards for parts.",
    ],
    reformed: [
      'The stores were replenished and the adept restored every stripped ward at his own cost, gap by gap, before confessing the map of them.',
      'With components flowing again, the adept came clean; the thinned protections were rebuilt first and explained after.',
    ],
    historicized: [
      'The stores are full again, but the adept never made the stripped wards whole, and still bills for their upkeep.',
    ],
    'exposed-public': [
      'It is public that the adept cannibalized the town\'s wards and billed for their upkeep, and every household is asking what still protects it.',
      "It is out that the adept knew exactly where the town's wards had gaps, because the adept made them, and charged for the wards all the same.",
      'Households that paid for ward upkeep are walking the lines themselves now, looking for the gaps the adept made.',
    ],
    're-adjudicated': [
      'Whoever paid the adept before is gone, but now the stores are empty, and the adept goes on stripping the wards for parts.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'The embargo\'s inspectors cannot open what the adept has warded, and the smugglers pay the adept by the seal. Business is brisk.',
      'The embargo holds everywhere except where the adept\'s wards hide the cargo. The runners compete to book the adept.',
    ],
    're-caused': [
      'The adept\'s first reason is gone, but now the embargo chokes the trade, and every warded crate brings another payment.',
    ],
    reformed: [
      'The embargo lifted and the adept broke his own seals for the customs house, then published the warding pattern so it could never serve again.',
      'When trade reopened, the adept came clean; the sealed-crate clients were named, and the craft went back to honest locks.',
    ],
    historicized: [
      'The embargo is over, but the adept still seals crates for the smugglers.',
    ],
    'exposed-public': [
      'It is public that the adept\'s wards blinded the customs inspectors, and every crate no one could open is being traced to the adept\'s seal.',
      "It is out that the adept hid smuggled cargo from the law, and the law is learning how much it missed.",
      "The customs inspectors are opening every crate that went through under the adept's seal, and finding what they were kept from seeing.",
    ],
    're-adjudicated': [
      "Whoever paid the adept before is gone, but now an embargo chokes the trade, and whoever smuggles pays for the adept's seals.",
    ],
  },
  'levied-away': {
    attributed: [
      'With the soldiers away at war, the town\'s safety rests on the adept\'s wards, and the adept charges for them: streets that pay stay protected, and streets that cannot are left thin.',
      'The war took the soldiers and left the wards, and the adept sells the protection street by street.',
    ],
    're-caused': [
      "The adept's first reason is gone, but now the soldiers are away at war, and the town depends on wards the adept sells street by street.",
    ],
    reformed: [
      'The companies returned and the adept evened the wards; every street protected alike, and the favor-payments returned to their payers.',
      'When the strength came home, the adept came clean; the tiered protection was confessed to the council and flattened that week.',
    ],
    historicized: [
      'The soldiers are back, but the adept still guards only the streets that pay.',
    ],
    'exposed-public': [
      'It is public that the adept sold the town\'s protection street by street while its soldiers were at war, and the unpaid streets are counting what they suffered.',
      "It is out that the wards guarded purses, not people, and the adept drew the lines between them.",
      'The streets left unguarded while the soldiers were away want to know why the next street was protected and theirs was not.',
    ],
    're-adjudicated': [
      'Whoever paid the adept before is gone, but now the soldiers are away at war, and the adept goes on selling the wards street by street.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'The garrison is hollow, and everyone knows the wards are the town\'s real wall. No one knows the adept has sold the plan of their weak points, twice.',
      'With the garrison emptied, the wards matter more than the gates, and their weak points are worth more than their strength. The adept sells both, to different buyers.',
    ],
    're-caused': [
      "The adept's first reason is gone, but now the garrison is thin, and the adept keeps selling word of where the wards are weak.",
    ],
    reformed: [
      'The garrison was refilled and the adept re-cut every seam he had sold, making the surveys worthless; then he confessed the selling.',
      'With the ranks restored, the adept came clean; the sold surveys were bought back or voided, and the wards made honest.',
    ],
    historicized: [
      'The garrison is back to strength, but the adept still sells the plans of the wards\' weak points.',
    ],
    'exposed-public': [
      'It is public that the adept sold the map of the wards\' weaknesses while the garrison stood empty, and the town knows its wall had a merchant.',
      "The plans are out, with the adept's seal on them: every weak point in the town's wards, priced and sold to outsiders.",
      "Every family by the wall knows now that its weak points were sold to outsiders, and that the seller was the town's own adept.",
    ],
    're-adjudicated': [
      "Whoever paid the adept before is gone, but now the garrison is thin, and the adept sells the plans of the wards' weak points to whoever asks.",
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war buys spells faster than the adept can cast them, and the adept sells to both camps. The wards raised for one side are the ones the adept knows how to break for the other.',
      'With the war pressing, the adept sold to both armies: fire for one, shields for the other.',
    ],
    're-caused': [
      "The adept's first reason is gone, but now the war presses in, and both camps buy from the adept.",
    ],
    reformed: [
      'The war receded and the adept closed both accounts; the workings sold to each side were disclosed to the town that sat between them.',
      'With the pressure lifted, the adept came clean about the double commissions, and spent the proceeds unbreaching what he had breached.',
    ],
    historicized: [
      'The war has moved on, but both camps still hold the adept\'s spells, and the adept still keeps them working.',
    ],
    'exposed-public': [
      'It is public that the adept armed both camps, and each army has learned its shields and its enemy\'s fire share an author.',
      "It is out that the adept sold to both sides of the war, and the town caught between them knows what each side paid.",
      'Both armies now know the same adept made their shields and the fire thrown at them, and neither trusts anything the adept sold.',
    ],
    're-adjudicated': [
      'Whoever paid the adept before is gone, but now the war presses in, and the adept goes on selling to both camps.',
    ],
  },
  occupation: {
    attributed: [
      'The occupier needs eyes, and the adept is the best scryer in town. The adept watches the neighbors for the occupier and is allowed to keep practicing in return.',
      'The occupation keeps a list of the gifted, and the adept writes it: who can do what, and where they sleep, sent each month in return for leaving the adept\'s own name off.',
    ],
    're-caused': [
      "The adept's first reason is gone, but now the occupier's leave is what lets the adept practice, and the scrying pays for it.",
    ],
    reformed: [
      'The occupier withdrew and the adept burned the register, then stood before those it had named and read his own entry first.',
      'With the occupation ended, the adept came clean; the scrying was confessed to the watched, house by house.',
    ],
    historicized: [
      'The occupier is gone, but the adept still keeps the list of the gifted up to date.',
    ],
    'exposed-public': [
      'It is public that the adept scried on the town for the occupier, and every family is working out how the occupation knew what it knew.',
      "The list is out, in the adept's hand: the town's gifted, listed for the occupier, and the adept's own name left off.",
      "The gifted families on the adept's list are asking why the occupier came to their doors first, and the answer is in the adept's hand.",
    ],
    're-adjudicated': [
      "Whoever paid the adept before is gone, but now the occupier is in control, and the adept scries for it.",
    ],
  },
  'conduct-drift': {
    attributed: [
      'A dark patron funds the adept\'s research, and the research has turned toward what the patron craves. What the craft forbids, the patron pays for, and the adept no longer tells the two apart.',
      'The forbidden shelf in the adept\'s library keeps growing, and a patron that rewards forbidden work paid for every book on it.',
    ],
    're-caused': [
      "The adept's first reason is gone, but now a dark patron pays for the forbidden work, and the adept researches what the patron pays for.",
    ],
    reformed: [
      "The patron's shadow lifted and the adept sealed the forbidden shelf; the sponsored research was ended and its notes given to the circle to bury.",
      'With the rewarding patron gone, the adept came clean; the transgressions lost their funding, and he found he had only ever wanted the funding.',
    ],
    historicized: [
      'The patron is gone, but the adept still adds to the forbidden shelf.',
    ],
    'exposed-public': [
      'It is public that the adept\'s research served a dark patron, and everything the adept ever wrote is being read again.',
      "The sponsorship is out: the forbidden work was commissioned, and the town has seen the patron's terms in the adept's own files.",
      'Anyone who ever paid the adept for a working is asking now whether a dark patron had a hand in that too.',
    ],
    're-adjudicated': [
      "Whoever paid the adept before is gone, but now a dark patron rewards the forbidden work, and the adept's research answers to it.",
    ],
  },
  'conversion-pressure': {
    attributed: [
      'The rival faith pays for omens, and the adept\'s readings have learned which answers sell. The stars say what the mission needs.',
      'Conversion goes easier with wonders, so the mission buys them in bulk from the adept and is billed for advice.',
    ],
    're-caused': [
      "The adept's first reason is gone, but now a rival faith pays for omens, and the adept supplies them.",
    ],
    reformed: [
      'The rival faith withdrew and the adept published the true readings beside the sold ones, so the town could see the difference.',
      'When the conversion pressure broke, the adept came clean; the bought omens were recanted, each one, by name.',
    ],
    historicized: [
      'The rival faith has given up on the town, but the adept\'s readings still lean its way.',
    ],
    'exposed-public': [
      'It is public that the mission bought its miracles from the adept, and every sign that won a convert is being looked at again.',
      "It is out that the adept sold false omens to the rival faith, and both congregations want the true readings.",
      'Converts who changed faith over a sign are learning that the sign was bought from the adept.',
    ],
    're-adjudicated': [
      'Whoever paid the adept before is gone, but now a rival faith presses in, and it pays the adept for omens.',
    ],
  },
  secularization: {
    attributed: [
      'The old pact between the craft and the temple limited what an adept may do, and the temple that kept it stands empty. The adept has been working past that limit, because no one enforces it.',
      'With the faith gone cold, the old bans on the craft went with it. The adept now does work that was forbidden for good reason, and charges well for it.',
    ],
    're-caused': [
      "The adept's first reason is gone, but now the faith has gone cold, and with no one enforcing the pact, the forbidden work goes on.",
    ],
    reformed: [
      'The faith revived and the covenant with it; the adept stepped back inside the line unforced, and surrendered the work done beyond it.',
      'When belief returned, the adept came clean; the frontier practice was confessed to the restored temple and set down.',
    ],
    historicized: [
      'The faith has warmed again, but the adept still does the work the pact forbade, and still sells it.',
    ],
    'exposed-public': [
      'It is public what the adept did while no one enforced the pact, and the returning temple has made the craft its first question.',
      "It is out that the adept did and sold what the old pact forbade, and the town is learning why it was forbidden.",
      'The returning priests have made one question their first: what the adept did while the pact went unenforced.',
    ],
    're-adjudicated': [
      "Whoever paid the adept before is gone, but now the faith has gone cold, and nothing limits the adept's work.",
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The temple\'s disgrace left the town hungry for miracles, and the adept sells them. The wonders are made to order, and the offerings now go to the adept\'s door.',
      'With the clergy disgraced, no one trusts the altar\'s wonders, so people buy the adept\'s. They are cheap and real enough, and the sermons never mention them.',
    ],
    're-caused': [
      "The adept's first reason is gone, but now the priesthood is disgraced, and the adept sells wonders in its place.",
    ],
    reformed: [
      'The priesthood was cleansed and the adept closed the miracle stall; the redirected offerings were sent to the altar they had abandoned.',
      "With the clergy's scandal resolved, the adept came clean; the manufactured wonders were disclosed as workings, priced and ordinary.",
    ],
    historicized: [
      'The temple has been set in order, but the adept still sells wonders to the faithful.',
    ],
    'exposed-public': [
      'It is public that the adept sold workings as wonders while the temple was disgraced, and the faithful are asking what they actually knelt to.',
      'It is out that the adept sold made-to-order wonders to a town hungry for the holy, and the faithful want their offerings back.',
      'People who gave offerings for a wonder have learned the adept made it to order, and they want the offerings back.',
    ],
    're-adjudicated': [
      'Whoever paid the adept before is gone, but now the priesthood is disgraced, and the adept sells wonders to whoever wants them.',
    ],
  },
  captured: {
    attributed: [
      'The underworld holds the adept\'s debts, and the adept\'s craft serves it. Locks open oddly around its crews, and trackers follow trails that end at walls.',
      'The underworld collects the adept\'s notes each quarter: what was warded, what was scried, and spells cast to order. The debt never gets smaller, and it is meant not to.',
    ],
    're-caused': [
      "The adept's first reason is gone, but now the underworld holds the town's offices, and it uses the adept's craft.",
    ],
    reformed: [
      'The capture was broken and the adept called in his own debt: every working done for the syndicate was named, and its counterspell filed with the watch.',
      "With the syndicate's grip broken, the adept came clean; the serviced crimes were confessed, and the craft turned to undoing them.",
    ],
    historicized: [
      'The underworld\'s hold is broken and the debt is void, but the adept still opens locks for its crews.',
    ],
    'exposed-public': [
      'It is public that the adept\'s craft served the underworld, and everyone whose lock opened oddly now knows why.',
      "It is out that the underworld held the adept by debt, and the town has learned how the debt was paid.",
      'Households whose locks opened on their own know now that the adept worked for the underworld, paying off a debt.',
    ],
    're-adjudicated': [
      'Whoever held the adept\'s debt before is gone, but the underworld holds the offices now, and whoever runs them found and bought the debt.',
    ],
  },
  scandal: {
    attributed: [
      'The scandal made memory dangerous, and the adept sells it: memories blur for the accused for a high price, and sharpen for their accusers for a higher one.',
      'Since the scandal broke, the adept\'s truth-work goes to whoever fears it most. The craft that could settle the matter is paid to muddy it.',
    ],
    're-caused': [
      "The adept's first reason is gone, but now a scandal has broken, and the adept sells memory-work.",
    ],
    reformed: [
      'The scandal burned out and the adept restored what he had blurred, freely, and filed the true recollections with the court.',
      'When the scandal settled, the adept came clean; the memory work was confessed and undone where undoing was still possible.',
    ],
    historicized: [
      'The scandal is old news, but the adept still blurs memories for those who pay.',
    ],
    'exposed-public': [
      'It is public that the adept blurred memories through the scandal, and no testimony from those months is trusted, including the innocent kind.',
      "It is out who paid the adept to forget, who paid to be believed, and what the adept charged each.",
      "Nobody's word from the scandal months is taken now, because the adept was paid to blur what people remember.",
    ],
    're-adjudicated': [
      'Whoever paid the adept before is gone, but now a scandal has broken, and whoever fears it pays the adept for memory-work.',
    ],
  },
};
