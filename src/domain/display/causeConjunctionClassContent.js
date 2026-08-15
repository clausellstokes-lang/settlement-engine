/**
 * domain/display/causeConjunctionClassContent.js — W2: the CLASS-TIER conjunction
 * content table (rung 3 of the selection ladder in causeConjunctionContent.js).
 *
 * One authored cell per (causeClass × lifecycleStage): role-agnostic lines with a
 * {role} slot the ladder fills with the bearer's role noun. This tier is the
 * safety rung UNDER the role tier — with the role tier total over the 12 built
 * archetypes it serves unknown/future roles — and the rung ABOVE the W-C5
 * template floor (causeLifecycleVocabulary.causeLifecyclePhrase), which remains
 * the final fallback.
 *
 * SIDE-CAR LAW (institutionVocabulary.js precedent): generation NEVER imports
 * this file; it is read only by the lazy dossier NPC card, so authoring here is
 * byte-inert to every golden and adds nothing to the first-paint entry closure.
 *
 * VOICE: causal receipts a DM can speak aloud — plain, concrete, derived
 * (who/why/what-now). Band-neutral: no line may claim an age ("years ago",
 * "the lean years" — the temporal constitution's register belongs to the floor,
 * which reads the age band). High-frequency stages (attributed, exposed-public,
 * reformed) carry two variants; the rest carry one.
 *
 * STAGE SEMANTICS (causeLifecycle.js): at re-caused and re-adjudicated the key's
 * causeClass is the NEW sustaining cause — the line must present it as what
 * carries the arrangement NOW, never as the origin.
 */

/** @type {Readonly<Record<string, Readonly<Record<string, ReadonlyArray<string>>>>>} */
export const CLASS_CONTENT = Object.freeze({
  underfunded: {
    attributed: [
      'The office has been starved of coin for too long, and this {role} has made up the shortfall in ways the books do not show.',
      'Somewhere between the short pay and the standing obligations, this {role} began taking money that is not owed; the shortfall is real, which is what makes it easy.',
    ],
    're-caused': [
      'The first reason has passed, but short pay has taken its place; the arrangement survives because the coin is genuinely not there.',
    ],
    reformed: [
      'The coin came through and held, and the {role} ended the arrangement with it; what the shortfall excused, the funding closed.',
      'Funded again, the {role} gave up the side income. It was the empty purse that opened the door, and the full one shut it.',
    ],
    historicized: [
      'The pay was restored, yet the arrangement never closed; what began as covering a shortfall now runs on habit.',
    ],
    'exposed-public': [
      'It is public now: the shortfall was covered with bought coin, and the town is learning what the {role} sold to cover it.',
      'The empty purse was the excuse, and now everyone has heard it; the {role} took outside money against short pay, and the reckoning has started.',
    ],
    're-adjudicated': [
      'The paymaster behind the old arrangement is gone, but the coin is still short, and the shortfall itself has picked up the debt.',
    ],
  },
  'chain-starved': {
    attributed: [
      'The supply lines have failed, and what the office needs no longer arrives by honest channels; this {role} buys through the ones that do not bear looking at.',
      'When the wagons stopped coming, this {role} found other suppliers. The goods arrive, and no one asks by which road.',
    ],
    're-caused': [
      'The first pressure eased, but now it is the broken supply lines that hold the arrangement together; the need is real even if the remedy is not clean.',
    ],
    reformed: [
      'The roads reopened and the wagons came back, and the {role} cut the quiet suppliers loose; the need that excused them is gone.',
      'With the supply lines restored, the {role} closed the back channel and returned to honest freight, and the ledgers bear it out.',
    ],
    historicized: [
      'The wagons roll again, but the back channel stayed open; what began as necessity is now simply preference.',
    ],
    'exposed-public': [
      'It is known now: when the supply lines failed, the {role} bought from hands no office should touch, and the receipts are being read aloud.',
      'The broken roads were the reason and the smugglers were the remedy; both are public now, and the {role} answers for the difference.',
    ],
    're-adjudicated': [
      'The old patron is destroyed, but the supply lines are still cut, and whoever can move goods along them holds the {role} instead.',
    ],
  },
  depleted: {
    attributed: [
      'The stores have run dry, and this {role} controls what little remains; scarcity has a price, and it is being collected quietly.',
      'Empty stores made this {role} powerful in the worst way: what remains moves by favor, and the favors are being sold.',
    ],
    're-caused': [
      "The first cause has gone, but the stores are dry now, and rationing what remains has become the arrangement's new excuse.",
    ],
    reformed: [
      'The stores were replenished and the {role} let the arrangement die with the scarcity; nothing moves by favor any longer.',
      'Full stores ended it: with nothing left to ration, the {role} gave up the trade in favors and came clean.',
    ],
    historicized: [
      'The stores were refilled, but the habit of selling favor survived the scarcity that bred it.',
    ],
    'exposed-public': [
      'The town now knows the {role} sold access to the reserve while the stores ran dry; hunger keeps a sharp memory for such things.',
      'It has come out that scarcity was traded for coin, and every household that went short is counting what the {role} collected.',
    ],
    're-adjudicated': [
      'The syndicate that held the arrangement is gone, but the stores are still empty, and control of what remains has taken over the debt.',
    ],
  },
  'trade-strangled': {
    attributed: [
      'Trade is choked off and lawful commerce is starving, so this {role} takes a cut of the commerce that is not lawful.',
      'With the trade routes strangled, everything that still moves, moves around the law, and this {role} is paid to hold the door.',
    ],
    're-caused': [
      'The old reason passed, but the embargo is the new one; while trade stays strangled, the arrangement pays better than the office does.',
    ],
    reformed: [
      'The embargo lifted and trade breathed again, and the {role} gave up the contraband cut with it; the door is no longer held.',
      'When the routes reopened, the {role} ended the arrangement; smuggling loses its argument the day honest cargo pays.',
    ],
    historicized: [
      'The routes reopened, yet the contraband cut never stopped; the strangled trade that excused it is history.',
    ],
    'exposed-public': [
      'It is public: while trade was strangled, the {role} took a share of what slipped past the law, and the ruined merchants know it now.',
      "The embargo was real, and so was the {role}'s cut of everything that dodged it; both facts are now common knowledge.",
    ],
    're-adjudicated': [
      'The old paymaster is gone, but the routes are still choked, and the contraband trade that survives them has claimed the arrangement.',
    ],
  },
  'levied-away': {
    attributed: [
      'The strength of this place marched away to war, and this {role} does quietly what no one is left to check.',
      'With the fighting strength levied away, oversight went with it; this {role} has been trading on the absence ever since.',
    ],
    're-caused': [
      'The first cause resolved, but the levy has emptied the town of anyone who might object, and the arrangement continues because no one is left to see it.',
    ],
    reformed: [
      'The companies came home and the eyes returned, and the {role} set the arrangement down before anyone had to name it.',
      'When the strength marched back, the {role} came clean; what absence permitted, the return ended.',
    ],
    historicized: [
      'The levy came home, but the habits learned in the empty season stayed; the absence that bred them is past.',
    ],
    'exposed-public': [
      'Now it is known what the {role} did while the strength was away at war; the returning columns have brought the reckoning with them.',
      'The town has learned what absence bought: while its soldiers were levied away, the {role} sold what they were not there to guard.',
    ],
    're-adjudicated': [
      'The syndicate is destroyed, but the strength is still levied away, and the unwatched season itself now sustains the arrangement.',
    ],
  },
  'garrison-drained': {
    attributed: [
      'The garrison is hollowed out and cannot do its work, so this {role} contracts the gap to people who ask for favors instead of pay.',
      'A drained garrison leaves duties no one performs; this {role} has been selling the neglect piece by piece.',
    ],
    're-caused': [
      "The old pressure eased, but the garrison is hollow now, and covering for what it cannot do has become the arrangement's new footing.",
    ],
    reformed: [
      'The garrison was refilled and the {role} ended the covering arrangement; the gaps it excused are manned again.',
      'With the ranks restored, the {role} cut the irregulars loose and came clean; there was nothing left to cover for.',
    ],
    historicized: [
      'The ranks were refilled, but the side arrangement outlived the gap it was built to fill.',
    ],
    'exposed-public': [
      "It is public now that the {role} sold the garrison's weakness while it stood hollow, and the men who filled the gap are naming names.",
      'The hollow garrison is a scandal with a face on it: the {role} profited from every unmanned post, and the town has the tally.',
    ],
    're-adjudicated': [
      'The old patron fell, but the garrison is still drained, and the unmanned posts have found the {role} a new set of creditors.',
    ],
  },
  'siege-scarred': {
    attributed: [
      'The war is pressing on this place, and this {role} has learned that fear pays; the compromise runs on what the emergency excuses.',
      'Under the pressure of the war, rules bent for survival stayed bent for profit, and this {role} holds the bend.',
    ],
    're-caused': [
      'The first cause cleared, but the war is at the walls now, and the emergency has adopted the arrangement as its own.',
    ],
    reformed: [
      'The war receded and the {role} let the wartime arrangement go; what the emergency excused, the peace ended.',
      'With the pressure lifted, the {role} unwound the bargains struck under the walls and came clean.',
    ],
    historicized: [
      'The war moved on, but the wartime bargains did not; the {role} keeps them out of habit now, not need.',
    ],
    'exposed-public': [
      'It has come out what the {role} sold while the war pressed in, and a town that bled through it is not forgiving.',
      'The wartime profiteering is public: the {role} priced survival while the walls shook, and the survivors remember paying.',
    ],
    're-adjudicated': [
      'The syndicate is broken, but the war still presses, and the emergency itself has assumed the arrangement.',
    ],
  },
  occupation: {
    attributed: [
      'An occupier holds this place, and this {role} has made an accommodation; the occupier finds it useful and pays in protection.',
      'Under occupation everything runs through the occupier, and this {role} runs errands for them that the town cannot see.',
    ],
    're-caused': [
      'The old reason has gone, but the occupier is here now, and their favor sustains the arrangement in its place.',
    ],
    reformed: [
      'The occupation ended and the {role} ended the accommodation with it; whatever was owed to the occupier left with them.',
      'When the occupier withdrew, the {role} came clean; the accommodation had no life of its own once its protection marched away.',
    ],
    historicized: [
      'The occupier is gone, but the habits of accommodation remain; the {role} still works the way the occupation taught.',
    ],
    'exposed-public': [
      "The town now knows the {role} served the occupier's interest against its own; collaboration is a word no one says quietly.",
      "It is public that the {role} took the occupier's protection and paid for it in the town's secrets; the word for that is in the streets already.",
    ],
    're-adjudicated': [
      'The old paymaster is destroyed, but the occupier remains, and their administration has quietly inherited the arrangement.',
    ],
  },
  'conduct-drift': {
    attributed: [
      'A patron power here rewards exactly the deeds an office should refuse, and this {role} has been collecting the reward.',
      'The deed and the doctrine have drifted together: what this {role} does corruptly, a patron counts as service, and pays accordingly.',
    ],
    're-caused': [
      "The first cause resolved, but a patron that rewards the deed has taken its place, and the arrangement now wears the patron's blessing.",
    ],
    reformed: [
      "The patron's shadow lifted and the {role} came clean; without a power blessing the deed, it was only a crime again.",
      'With the rewarding patron gone, the {role} ended the arrangement; the deed lost its sanction and then its appeal.',
    ],
    historicized: [
      'The patron that blessed the deed is gone, but the deed remains; the {role} keeps the practice without the theology.',
    ],
    'exposed-public': [
      "It is public now that the {role} did the patron's dark work for reward, and the town is deciding whether it was faith or greed.",
      'The arrangement is out: a patron rewarded what the {role} should have refused, and the whole exchange is being weighed in daylight.',
    ],
    're-adjudicated': [
      'The syndicate fell, but the patron that rewards the deed still stands, and its favor has absorbed the arrangement whole.',
    ],
  },
  'conversion-pressure': {
    attributed: [
      'A rival faith is pressing in with money behind it, and this {role} has been taking the money to ease the pressing.',
      'The rival faith needed doors opened, and this {role} has been opening them; conversion is patient work, and it pays retainers.',
    ],
    're-caused': [
      'The old cause cleared, but the rival faith is here now, and its patience and its purse have taken over the arrangement.',
    ],
    reformed: [
      'The rival faith withdrew and the {role} closed the door it had been paid to hold open; the retainer died with the pressure.',
      'When the conversion pressure broke, the {role} came clean; there was no one left to pay for the opened doors.',
    ],
    historicized: [
      'The rival faith gave up this ground, but the {role} kept the habit of selling access; the buyer changed, the practice did not.',
    ],
    'exposed-public': [
      "It is known now that the {role} took the rival faith's coin while it pressed on the town, and both congregations want an answer.",
      'The retainer is public: the rival faith paid the {role} for quiet help, and the faithful are re-reading every accommodation in that light.',
    ],
    're-adjudicated': [
      'The old patron is gone, but the rival faith still presses, and its purse has quietly assumed the debt.',
    ],
  },
  secularization: {
    attributed: [
      'The faith has gone cold here, and with it went a restraint everyone counted on; this {role} was among the first to notice that nothing pushes back.',
      'Nobody swears by anything here any longer, and this {role} found that oaths were the only thing holding certain doors shut.',
    ],
    're-caused': [
      'The first cause passed, but the faith has gone cold since, and in the absence of anything watching, the arrangement simply continued.',
    ],
    reformed: [
      'The faith revived and its weight returned, and the {role} set the arrangement down under it; some things need watching to stop.',
      'When belief came back to this place, the {role} came clean; the cold season that excused everything was over.',
    ],
    historicized: [
      'The faith warmed again, but the {role} kept the habits learned in the cold; the empty pews that bred them are filled now.',
    ],
    'exposed-public': [
      'It is public now what the {role} did while the faith slept, and the reviving congregation has made it their first sermon.',
      'What the {role} did while the altars stood empty is out in the open, and the town wants more than an apology.',
    ],
    're-adjudicated': [
      'The old paymaster fell, but the faith is still cold, and nothing has yet revived that might make the arrangement ashamed of itself.',
    ],
  },
  'clergy-scandal': {
    attributed: [
      'The priesthood here is publicly tainted, and this {role} has been trading on the taint: silence bought, silence sold.',
      'When the clergy fell into scandal, this {role} was close enough to profit from the fall, and did.',
    ],
    're-caused': [
      "The first reason has resolved, but the tainted priesthood offers a new one, and the arrangement now runs through the temple's disgrace.",
    ],
    reformed: [
      'The priesthood was cleansed and the trade in its disgrace ended; the {role} came clean along with the altar.',
      "With the clergy's scandal resolved, the {role} gave up the arrangement built on it; there was no more silence worth buying.",
    ],
    historicized: [
      "The clergy's disgrace was mended, but the {role} kept the machinery built around it; the scandal is past, the practice is not.",
    ],
    'exposed-public': [
      "It is out that the {role} profited from the temple's disgrace, and a town already sore about its priests has found a second target.",
      "The {role} traded on the clergy's scandal, and now that trade is a scandal of its own; the two disgraces are being read together.",
    ],
    're-adjudicated': [
      "The syndicate is gone, but the priesthood's taint remains, and the trade in its silence has found the {role} new partners.",
    ],
  },
  captured: {
    attributed: [
      'The offices of this place answer to the underworld, and this {role} is one of the reasons; the capture holds because people like this hold it.',
      'When the underworld took the institutions from within, this {role} came with the furniture, and has been paid like it ever since.',
    ],
    're-caused': [
      'The old cause resolved, but the underworld holds the offices now, and no one it holds is permitted to simply stop.',
    ],
    reformed: [
      'The capture was broken and the {role} walked out from under it; whatever the syndicate held over this office, it holds no longer.',
      "With the underworld's grip broken, the {role} ended the arrangement; obedience was the whole of it, and there is no one left to obey.",
    ],
    historicized: [
      'The capture was broken, but the {role} kept working the way the syndicate taught; the master is gone and the method remains.',
    ],
    'exposed-public': [
      "It is public now that the {role} answered to the underworld while holding the town's trust, and the town is weighing what that trust signed away.",
      'The capture has a face on it now: the {role} served the syndicate from inside the office, and everyone knows which orders came from where.',
    ],
    're-adjudicated': [
      'The syndicate that owned the arrangement is destroyed, but the offices are still captured, and whoever holds them now inherited the {role} with the rest.',
    ],
  },
  scandal: {
    attributed: [
      'A corruption scandal has broken over this place, and this {role} is inside its economy: buying cover, selling it, or both.',
      'The scandal taught everyone here what silence is worth, and this {role} has been dealing in it since the price was set.',
    ],
    're-caused': [
      'The first cause cleared, but the scandal broke since, and its economy of cover and silence has adopted the arrangement.',
    ],
    reformed: [
      'The scandal burned out and the {role} came clean in the quiet after it; the market for silence closed and took the arrangement with it.',
      'When the scandal was finally settled, the {role} ended the arrangement; there was nothing left to hide and no one left paying.',
    ],
    historicized: [
      'The scandal that started it is old news, but the {role} never left the habits it taught.',
    ],
    'exposed-public': [
      'The scandal has reached the {role} by name now, and the cover that was bought and sold is being priced in public.',
      "What the {role} did inside the scandal's economy is out; the town learned one disgrace and found another folded inside it.",
    ],
    're-adjudicated': [
      "The syndicate is broken, but the scandal's economy of silence survives it, and the {role} has been carried along to its new owners.",
    ],
  },
});
