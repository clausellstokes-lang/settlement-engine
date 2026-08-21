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
};
