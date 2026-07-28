/**
 * data/roadsProse.js — THE ROADS chronicle prose pools (ENGINE LIFT #5; DESIGN_THE_ROADS.md
 * §12/§14). A LAZY data leaf (the CONTENT-GT max-lines ratchet rule): pure frozen variant
 * pools, imported only by eventProse.js (which flattens them into EVENT_PROSE_REGISTRY, so
 * the register / canonical-at-zero / reachability guards cover roads for free) and by the
 * lazy roads kernel (which selects via eventProse's pickLine/fnv1a32).
 *
 * THE LAWS (the eventProse constitution, tests/domain/eventProse.test.js +
 * tests/domain/roadsProse.test.js):
 *  1. CANONICAL-AT-ZERO: every pool's index-0 entry is the canonical phrasing; a falsy seed
 *     selects it.
 *  2. FRAMING-NOT-SEMANTICS: variants vary PHRASING only; the interpolated names/purpose are
 *     the world's own, threaded through unchanged.
 *  3. PORTABLE SPECIFICITY: catalog-anchored generics only, never a canon proper noun (the
 *     {npc}/{home}/{dest}/{captor} tokens ARE the world's names).
 *  4. NO CALAMITY SUBSTRINGS (the F24 scan, extended to roads.* in roadsProse.test.js): no
 *     flood/fire/quake/earthquake/storm — travel/capture prose speaks its own vocabulary.
 *
 * Pure leaf: imports nothing. Interpolation tokens: {npc} {home} {dest} {captor} {purpose}.
 */

/** @typedef {import('../domain/worldPulse/eventProse.js').ProseVariant} ProseVariant */

/** @type {Record<string, Record<string, ProseVariant[]>>} */
export const ROADS_NEWS = Object.freeze({
  // ── DEPARTURE (quiet; NOTABLE for a pillar or a tradition-critical journey) ──
  departure: {
    headline: [
      (x) => `${x.npc} sets out from ${x.home} for ${x.dest}`, // canonical
      (x) => `${x.npc} takes the road from ${x.home} to ${x.dest}`,
      (x) => `${x.npc} rides out of ${x.home}, bound for ${x.dest}`,
      (x) => `${x.npc} departs ${x.home} on the ${x.dest} road`,
    ],
    summary: [
      (x) => `${x.npc} has left ${x.home} for ${x.dest} on ${x.purpose} business. It is a journey of the middle ranks.`, // canonical
      (x) => `${x.npc} has taken the ${x.dest} road out of ${x.home}, sent on ${x.purpose} business.`,
      (x) => `An envoy of ${x.home}, ${x.npc}, is abroad toward ${x.dest} on ${x.purpose} business.`,
      (x) => `${x.npc} of ${x.home} is on the road to ${x.dest}, carrying ${x.purpose} business.`,
    ],
  },
  // ── RETURN (NOTABLE — the traveller comes home) ──
  return: {
    headline: [
      (x) => `${x.npc} returns to ${x.home}`, // canonical
      (x) => `${x.npc} comes home to ${x.home}`,
      (x) => `${x.npc} is back within the walls of ${x.home}`,
      (x) => `${x.npc} rides home to ${x.home}`,
    ],
    summary: [
      (x) => `${x.npc} has come home to ${x.home}, the ${x.dest} journey behind them.`, // canonical
      (x) => `${x.npc} is returned to ${x.home} from ${x.dest}, the errand done.`,
      (x) => `The road from ${x.dest} is behind ${x.npc}, who is safely back in ${x.home}.`,
      (x) => `${x.npc} has ridden back into ${x.home} from ${x.dest}.`,
    ],
  },
  // ── CAPTURE (MAJOR — names the road and the captor, §9) ──
  capture: {
    headline: [
      (x) => `${x.npc} of ${x.home} is taken on the ${x.dest} road`, // canonical
      (x) => `${x.npc} is seized by ${x.captor} on the road`,
      (x) => `${x.captor} holds ${x.npc} of ${x.home}`,
      (x) => `${x.npc} is captured making for ${x.dest}`,
    ],
    summary: [
      (x) => `${x.npc}, an envoy of ${x.home} bound for ${x.dest}, has fallen into the hands of ${x.captor}. A ransom will be raised.`, // canonical
      (x) => `On the road to ${x.dest}, ${x.npc} of ${x.home} was taken by ${x.captor}; ${x.home} must ransom them home.`,
      (x) => `${x.captor} has seized ${x.npc} of ${x.home} en route to ${x.dest}; the price of return is being reckoned.`,
      (x) => `${x.npc} of ${x.home} is a captive of ${x.captor}, taken on the ${x.dest} road.`,
    ],
  },
  // ── EXPULSION (NOTABLE — turned back at the gates) ──
  expulsion: {
    headline: [
      (x) => `${x.captor} turns ${x.npc} away at the gates`, // canonical
      (x) => `${x.npc} of ${x.home} is refused entry to ${x.dest}`,
      (x) => `${x.captor} sends ${x.npc} back to ${x.home}`,
      (x) => `${x.npc} is barred from ${x.dest}`,
    ],
    summary: [
      (x) => `${x.captor} would not receive ${x.npc} of ${x.home}; the envoy is turned back on the ${x.dest} road, the errand failed.`, // canonical
      (x) => `Denied at the gates of ${x.dest}, ${x.npc} of ${x.home} rides home with nothing to show.`,
      (x) => `${x.captor} refused ${x.npc} of ${x.home} entry; the mission to ${x.dest} is broken off.`,
      (x) => `${x.npc} of ${x.home} was turned away from ${x.dest} and sent back the way they came.`,
    ],
  },
  // ── ROBBED (texture — journey continues) ──
  robbed: {
    headline: [
      (x) => `${x.npc} is set upon on the ${x.dest} road`, // canonical
      (x) => `Brigands waylay ${x.npc} near ${x.dest}`,
      (x) => `${x.npc} loses baggage on the road to ${x.dest}`,
      (x) => `${x.npc} is harried on the ${x.dest} road`,
    ],
    summary: [
      (x) => `${x.npc} of ${x.home} was set upon on the embattled road to ${x.dest} but pressed on, lighter of purse.`, // canonical
      (x) => `The road to ${x.dest} used ${x.npc} of ${x.home} roughly, though the journey goes on.`,
      (x) => `${x.npc} of ${x.home} came through the ${x.dest} road robbed but unbowed.`,
      (x) => `Waylaid short of ${x.dest}, ${x.npc} of ${x.home} lost baggage but not the road.`,
    ],
  },
  // ── DELAYED (texture — an army on the road holds them a week) ──
  delayed: {
    headline: [
      (x) => `${x.npc} is held up on the ${x.dest} road`, // canonical
      (x) => `${x.npc} loses a week making for ${x.dest}`,
      (x) => `An army on the road delays ${x.npc}`,
      (x) => `${x.npc} is slowed on the ${x.dest} road`,
    ],
    summary: [
      (x) => `A column on the ${x.dest} road forced ${x.npc} of ${x.home} to wait it out. A week was lost, no more.`, // canonical
      (x) => `${x.npc} of ${x.home} lost a week to a marching army on the ${x.dest} road.`,
      (x) => `Held off the ${x.dest} road by soldiers, ${x.npc} of ${x.home} was delayed a week.`,
      (x) => `${x.npc} of ${x.home} waited out a passing army and lost a week to ${x.dest}.`,
    ],
  },
  // ── RANSOM PAID / RELEASE (NOTABLE — the captive is bought home) ──
  ransom: {
    headline: [
      (x) => `${x.home} ransoms ${x.npc} home from ${x.captor}`, // canonical
      (x) => `${x.npc} is freed from ${x.captor}`,
      (x) => `${x.captor} releases ${x.npc} to ${x.home}`,
      (x) => `${x.npc} is bought back from ${x.captor}`,
    ],
    summary: [
      (x) => `The price is paid: ${x.captor} has released ${x.npc}, who now rides home to ${x.home}.`, // canonical
      (x) => `${x.home} has ransomed ${x.npc} out of ${x.captor}'s hands; the road home lies open.`,
      (x) => `${x.npc} is free of ${x.captor} at last, and turns for ${x.home}.`,
      (x) => `With the ransom settled, ${x.captor} lets ${x.npc} go home to ${x.home}.`,
    ],
  },
  // ── PARTY RANSOM (NOTABLE — the party's coin bought the captive home, §11) ──
  partyRansom: {
    headline: [
      (x) => `${x.npc} is bought home to ${x.home} by adventurers`, // canonical
      (x) => `A party pays ${x.captor} to free ${x.npc}`,
      (x) => `${x.npc} is ransomed from ${x.captor} by hired hands`,
      (x) => `Adventurers settle ${x.npc}'s ransom to ${x.captor}`,
    ],
    summary: [
      (x) => `A party of adventurers has paid ${x.captor} the price of ${x.npc}'s release; the envoy of ${x.home} rides home, the treasury untouched.`, // canonical
      (x) => `${x.npc} of ${x.home} is free of ${x.captor}. The coin came from adventurers, not the seat, and the road home lies open.`,
      (x) => `Hired hands met ${x.captor}'s price for ${x.npc}; the captive of ${x.home} turns homeward with the debt paid by others.`,
      (x) => `${x.captor} has released ${x.npc} of ${x.home} to a party that bought them back; ${x.home}'s coffers were spared.`,
    ],
  },
  // ── RESCUE (NOTABLE — the jailbreak; no coin, the captor is left the poorer, §11) ──
  rescue: {
    headline: [
      (x) => `${x.npc} is broken free of ${x.captor}`, // canonical
      (x) => `Adventurers spirit ${x.npc} out of ${x.captor}`,
      (x) => `${x.npc} escapes ${x.captor} with help`,
      (x) => `A rescue frees ${x.npc} from ${x.captor}`,
    ],
    summary: [
      (x) => `A party has broken ${x.npc} of ${x.home} out of ${x.captor}'s hands. No ransom was paid, and ${x.captor} nurses the insult as ${x.npc} rides home.`, // canonical
      (x) => `${x.npc} of ${x.home} is spirited free of ${x.captor} by force; the captor keeps no coin and holds a fresh grudge against ${x.home}.`,
      (x) => `The jailbreak succeeds: ${x.npc} of ${x.home} is gone from ${x.captor}, who is left the poorer and the angrier.`,
      (x) => `Adventurers pulled ${x.npc} of ${x.home} out of ${x.captor} without paying a coin; ${x.captor} will remember the affront.`,
    ],
  },
  // ── TRAPPED / WAIT (texture — the siege or the hostile roads keep them abroad) ──
  trapped: {
    headline: [
      (x) => `${x.npc} is caught in ${x.dest} under siege`, // canonical
      (x) => `${x.npc} cannot leave ${x.dest}`,
      (x) => `${x.npc} waits out the ${x.dest} siege`,
      (x) => `${x.npc} is shut inside ${x.dest}`,
    ],
    summary: [
      (x) => `With ${x.dest} beset, ${x.npc} of ${x.home} cannot take the road home until the lines lift.`, // canonical
      (x) => `${x.npc} of ${x.home} is trapped in ${x.dest} for as long as the siege holds.`,
      (x) => `The siege of ${x.dest} keeps ${x.npc} of ${x.home} abroad, waiting for the road to open.`,
      (x) => `${x.npc} of ${x.home} must wait in ${x.dest} while the siege lasts.`,
    ],
  },
  // ── EMBASSY DEPARTURE (§11b — the wartime peace suit sets out; quiet, but it travels) ──
  embassyDeparture: {
    headline: [
      (x) => `${x.npc} of ${x.home} rides to sue ${x.dest} for peace`, // canonical
      (x) => `${x.home} sends ${x.npc} to treat with ${x.dest}`,
      (x) => `A peace embassy of ${x.home} takes the road to ${x.dest}`,
      (x) => `${x.npc} carries ${x.home}'s suit for peace toward ${x.dest}`,
    ],
    summary: [
      (x) => `${x.home} has dispatched ${x.npc} to sue ${x.dest} for peace. The suit travels down the war road.`, // canonical
      (x) => `${x.npc}, an envoy of ${x.home}, is bound for ${x.dest} to seek terms and an end to the war.`,
      (x) => `The court of ${x.home} sends ${x.npc} to the enemy at ${x.dest}, bearing an overture of peace.`,
      (x) => `${x.npc} of ${x.home} is on the war road to ${x.dest}, sent to plead for peace.`,
    ],
  },
  // ── EMBASSY RECEIVED (§11b — the suit is heard, road parley or court suit; the envoy comes home) ──
  embassyReceived: {
    headline: [
      (x) => `${x.dest} receives the peace suit of ${x.home}`, // canonical
      (x) => `${x.npc} is heard at ${x.dest}; the suit for peace stands`,
      (x) => `${x.dest} hears out ${x.home}'s envoy`,
      (x) => `A peace overture from ${x.home} is received at ${x.dest}`,
    ],
    summary: [
      (x) => `${x.dest} has received ${x.npc} of ${x.home} and heard the suit for peace; the envoy rides home under escort.`, // canonical
      (x) => `The peace suit of ${x.home} was heard at ${x.dest}. ${x.npc} turns homeward, the overture laid before the enemy court.`,
      (x) => `${x.npc} of ${x.home} was received at ${x.dest}; a case for peace now stands with the enemy, and the envoy comes home.`,
      (x) => `${x.dest} took in ${x.home}'s envoy and heard the plea for terms; ${x.npc} is sent home in honour.`,
    ],
  },
  // ── EMBASSY REBUFFED (§11b — turned home; the suit was refused a hearing, never worse) ──
  embassyRebuffed: {
    headline: [
      (x) => `${x.dest} turns ${x.home}'s peace envoy away`, // canonical
      (x) => `${x.npc}'s suit for peace is refused at ${x.dest}`,
      (x) => `${x.dest} will not hear ${x.home}'s overture`,
      (x) => `${x.npc} is sent home from ${x.dest} unheard`,
    ],
    summary: [
      (x) => `${x.dest} refused to hear ${x.npc} of ${x.home}; the peace suit is turned back on the road, the war unabated.`, // canonical
      (x) => `The enemy court at ${x.dest} would not receive ${x.home}'s envoy. ${x.npc} rides home, the overture rebuffed.`,
      (x) => `${x.npc} of ${x.home} was turned away from ${x.dest} unheard; the suit for peace failed at the gates.`,
      (x) => `${x.dest} sent ${x.home}'s peace envoy home with nothing; ${x.npc} carries back only the refusal.`,
    ],
  },
  // ── THIRD-PARTY RANSOM (D-5 §9 — a court OTHER than home buys the captive's freedom; the
  // voice names the PAYER and speaks its motive: a friend's gift, an ally/creditor's favour, or
  // a rival's leash. Never the home-paid line. DARK behind thirdPartyRansomEnabled). Token {payer}
  // is the paying settlement's name; {captor} the captor. ──
  thirdPartyFriend: {
    headline: [
      (x) => `${x.payer} buys ${x.npc} free of ${x.captor} as a friend`, // canonical
      (x) => `A friend in ${x.payer} ransoms ${x.npc} home to ${x.home}`,
      (x) => `${x.payer} pays ${x.captor} to free ${x.npc}, asking nothing`,
      (x) => `${x.npc} is freed from ${x.captor} by a friend's coin from ${x.payer}`,
    ],
    summary: [
      (x) => `${x.payer} met ${x.captor}'s price for ${x.npc} of ${x.home} out of friendship. The gift of freedom binds ${x.home} in gratitude, not debt.`, // canonical
      (x) => `A friendly hand in ${x.payer} bought ${x.npc} out of ${x.captor}'s keeping; ${x.home}'s treasury was spared and a bond of thanks was made.`,
      (x) => `${x.npc} of ${x.home} rides home free of ${x.captor}. ${x.payer} paid the ransom as a friend, and ${x.home} remembers the mercy.`,
      (x) => `Out of goodwill, ${x.payer} settled ${x.npc}'s ransom to ${x.captor}; the envoy of ${x.home} is freed and the friendship deepened.`,
    ],
  },
  thirdPartyAlly: {
    headline: [
      (x) => `${x.payer} ransoms ${x.npc} of ${x.home} from ${x.captor}`, // canonical
      (x) => `${x.payer} pays ${x.captor} to free ${x.home}'s envoy`,
      (x) => `An allied court in ${x.payer} buys ${x.npc} home`,
      (x) => `${x.npc} is bought free of ${x.captor} by ${x.payer}`,
    ],
    summary: [
      (x) => `${x.payer} paid ${x.captor} the price of ${x.npc}'s release. The favour leaves ${x.home} owing a debt of gratitude to ${x.payer}.`, // canonical
      (x) => `An allied purse in ${x.payer} met ${x.captor}'s demand for ${x.npc} of ${x.home}; the envoy comes home owing ${x.payer} the favour.`,
      (x) => `${x.npc} of ${x.home} is free of ${x.captor}, the coin found by ${x.payer}. It is a kindness ${x.home} will be expected to repay.`,
      (x) => `${x.payer} covered ${x.npc}'s ransom to ${x.captor}; ${x.home}'s envoy rides home, the seat now indebted to ${x.payer}.`,
    ],
  },
  thirdPartyRival: {
    headline: [
      (x) => `${x.payer}, no friend to ${x.home}, pays ${x.npc}'s ransom to ${x.captor}`, // canonical
      (x) => `A rival in ${x.payer} buys ${x.npc} out of ${x.captor}'s hands`,
      (x) => `${x.payer} settles ${x.npc}'s ransom and gains a hold over ${x.home}`,
      (x) => `${x.npc} is freed from ${x.captor} by rival coin from ${x.payer}`,
    ],
    summary: [
      (x) => `${x.payer}, ${x.home}'s rival, paid ${x.captor} for ${x.npc}'s freedom. The coin frees the envoy but leaves ${x.home} beholden to an enemy.`, // canonical
      (x) => `A rival purse in ${x.payer} met ${x.captor}'s price for ${x.npc} of ${x.home}; the envoy is home, but the favour is a leash in ${x.payer}'s hand.`,
      (x) => `${x.npc} of ${x.home} is bought free of ${x.captor} by ${x.payer}. It is no kindness, but a debt owed to a rival who will call it in.`,
      (x) => `${x.payer} settled ${x.npc}'s ransom to ${x.captor} for its own ends; ${x.home}'s envoy rides home under obligation to an enemy court.`,
    ],
  },
});

/**
 * The third-party-ransom news pool for a payer motive (D-5 §9 game-feel-3): a friend's gift, a
 * rival's leash, or an ally/creditor's favour. Keeps the roads mover's release beat to one line.
 * @param {string} motive @returns {Record<string, ProseVariant[]>}
 */
export function thirdPartyRansomPool(motive) {
  return motive === 'friendship' ? ROADS_NEWS.thirdPartyFriend
    : motive === 'leverage' ? ROADS_NEWS.thirdPartyRival
      : ROADS_NEWS.thirdPartyAlly;
}
