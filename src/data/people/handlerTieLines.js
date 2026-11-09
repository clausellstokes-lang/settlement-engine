/**
 * src/data/people/handlerTieLines.js — the handler tie's prose, as DATA (WRITE-PEOPLE, 2026-11-08).
 *
 * The allegiance train's handler tie (docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md §1.5): every card
 * that carries a hidden allegiance holds ONE outgoing tie to ONE handler, a real criminal face. The tie
 * is FROM the agent TO the handler, so in every line `r` is the AGENT (the tie's `from` card: an office,
 * a front's face or a retainer) and `s` is the HANDLER (its `to` card), the orientation of the W5
 * rewrite of `npcData.js :: pairProse` (`endsOf`'s note). `f` is the place's force words
 * (`defenseFacts.js :: forceWordsOf`; `pairProse` hands the garrison's by default).
 *
 * The kind follows the vector already on the card (never re-rolled). Fear's four leverage sub-kinds are
 * four archetype keys of their own (the chair's ruling on §1.5), so the estate's one-index-picks-desc-
 * and-tension machinery (`relationshipArchetypes.js :: createTieProseDraw`) holds unchanged: desc[i]
 * and tension[i] are written as a pair. Car 1 wraps these arrays in `pairProse` and composes the
 * archetypes; nothing here imports or is imported by the generator.
 *
 * The tie is covert (`covert: true`), so these lines print on the DM's layer only and may say plainly
 * what the arrangement is. Every line names both cards; every tension line names both (the overflow
 * cycle of `bothNamedTensions` reads only those). Every line is marked `colour: true` (R-AO: read,
 * presumes no record fact): none names a house, a tier or an institution the record might deny; the
 * force words come from the place itself. Every line is listed here FOR THE OWNER'S VETO.
 */

/** @typedef {{ name?: string }} TieCard */
/** @typedef {Readonly<{ body: string, members: string, member: string }>} ForceWords */
/** @typedef {(r: TieCard, s: TieCard, f: ForceWords) => string} TieLine */
/** @typedef {TieLine | Readonly<{ line: TieLine, colour?: boolean, needs?: string[] }>} TieRow */

export const HANDLER_TIE_LINES = Object.freeze({
  // greed · hunger_for_status
  handler_partnership: Object.freeze({
    label: 'Silent Partnership',
    type: 'patron_client',
    desc: Object.freeze([
      { line: (r, s) =>
        `${r.name} does what ${s.name} asks, and ${s.name} pays for it in coin that never passes through a counting-house. In company the two of them speak only of ordinary business.`, colour: true },
      { line: (r, s) =>
        `${s.name} has put money into ${r.name}'s affairs for years and takes a share of everything ${r.name} earns. No contract exists, and neither of them wants one.`, colour: true },
      { line: (r, s) =>
        `${r.name} wanted more than honest work could pay. ${s.name} made up the difference, and now ${r.name} passes on whatever ${s.name} needs to know.`, colour: true },
      { line: (r, s) =>
        `${s.name}'s silver bought the friends who raised ${r.name} to where ${r.name} stands today. ${r.name} repays it in favours, quietly and on time.`, colour: true },
      { line: (r, s) =>
        `Once a month ${r.name} and ${s.name} meet in a back room to split what the month brought in. In the street they pass each other without a nod.`, colour: true },
      { line: (r, s) =>
        `${r.name} opens doors for ${s.name}'s people, and ${s.name} keeps ${r.name}'s purse and good name growing. Both of them think they have the better half of the bargain.`, colour: true },
    ]),
    tension: Object.freeze([
      { line: (r, s) =>
        `${r.name} has started spending ${s.name}'s coin where people can see it: a new roof, a new horse. ${s.name} has noticed, and so have the neighbours.`, colour: true },
      { line: (r, s) =>
        `${s.name} wants a larger share this year. ${r.name} thinks the share is large enough already and has not yet found a way to tell ${s.name} so.`, colour: true },
      { line: (r, s) =>
        `${s.name} has asked ${r.name} for something ${r.name} cannot give without being noticed. ${r.name} asked for time, and ${s.name} gave a week.`, colour: true },
      { line: (r, s) =>
        `${r.name} hopes to rise again this season. ${s.name} expects the favours to grow with ${r.name}'s standing.`, colour: true },
      { line: (r, s) =>
        `A clerk has found a payment to ${r.name} that nobody can explain. ${s.name} wants to know who the clerk talks to.`, colour: true },
      { line: (r, s) =>
        `${r.name} has been seen dining with one of ${s.name}'s rivals. ${s.name} has not mentioned it, and ${r.name} cannot tell whether that is good or bad.`, colour: true },
    ]),
  }),

  // forbidden_patron
  handler_patron: Object.freeze({
    label: 'The Patron No One Names',
    type: 'patron_client',
    desc: Object.freeze([
      { line: (r, s) =>
        `${r.name} owes everything to ${s.name}, and nobody who knows ${r.name} would believe it. ${s.name} has never asked for thanks, only for loyalty.`, colour: true },
      { line: (r, s) =>
        `When ${r.name} was young and had no friends, ${s.name} paid the fees, settled the debts and found the first work. ${r.name} has not said ${s.name}'s name in public since.`, colour: true },
      { line: (r, s) =>
        `${s.name} is the hand behind ${r.name}'s rise: the letters of introduction, the rival who withdrew, the deal that went the right way. ${r.name} answers to ${s.name} and, in truth, to nobody else.`, colour: true },
      { line: (r, s) =>
        `${r.name} visits ${s.name} after dark, by the back way, twice a season. They talk about what ${s.name} wants done next.`, colour: true },
      { line: (r, s) =>
        `${s.name} has kept every scandal away from ${r.name} so far. ${r.name} knows that protection ends the day ${r.name} stops being useful to ${s.name}.`, colour: true },
      { line: (r, s) =>
        `Everyone thinks ${r.name} made their own way. In fact ${s.name} paid for every step, and ${r.name} takes ${s.name}'s instructions without argument.`, colour: true },
    ]),
    tension: Object.freeze([
      { line: (r, s) =>
        `${r.name}'s family has begun asking where the early money came from. ${s.name} has told ${r.name} that the questions must stop.`, colour: true },
      { line: (r, s) =>
        `Someone from ${r.name}'s past has come back and remembers who paid the fees. ${s.name} wants to know what ${r.name} means to do about it.`, colour: true },
      { line: (r, s) =>
        `${s.name} has asked ${r.name} to repay the old help with one large favour, the first in years. ${r.name} has not refused and does not want to agree.`, colour: true },
      { line: (r, s) =>
        `A servant saw ${r.name} leave ${s.name}'s door before dawn. ${s.name} has offered to deal with the servant, and ${r.name} has asked for a day to find another way.`, colour: true },
      { line: (r, s) =>
        `${r.name} has made new friends who could protect ${r.name} without ${s.name}. ${s.name} has heard, and has asked ${r.name} to call this week.`, colour: true },
      { line: (r, s) =>
        `${r.name} is praised in public for speaking out against crime. ${s.name} finds it useful, and expects ${r.name} to remember who chooses which criminals are caught.`, colour: true },
    ]),
  }),

  // fanaticism (the simulation's drifted vector; birth does not mint it, J-6)
  handler_cause: Object.freeze({
    label: 'Sworn to the Cause',
    type: 'ally',
    desc: Object.freeze([
      { line: (r, s) =>
        `${r.name} believes ${s.name}'s people are the only ones who look after the poor here, and serves them for that reason alone. ${s.name} has never had to pay ${r.name} a coin.`, colour: true },
      { line: (r, s) =>
        `${r.name} swore an oath to ${s.name}'s brotherhood years ago and has kept it ever since. The oath comes before ${r.name}'s livelihood, ${r.name}'s family and the law.`, colour: true },
      { line: (r, s) =>
        `${s.name} calls the people who rule here thieves with charters, and ${r.name} agrees with every word. Whatever ${r.name} hears and sees goes to ${s.name} the same day.`, colour: true },
      { line: (r, s) =>
        `${r.name} refuses ${s.name}'s money and does the work anyway, out of belief. ${s.name} trusts ${r.name} more than anyone who is paid.`, colour: true },
      { line: (r, s) =>
        `${r.name} and ${s.name} share an old grievance against the people who run things here. ${s.name} has the crew, ${r.name} has the standing, and both want the same people brought down.`, colour: true },
      { line: (r, s) =>
        `${r.name} meets ${s.name}'s circle by night to hear what the cause needs next. ${r.name} has done every task given without asking what it was for.`, colour: true },
    ]),
    tension: Object.freeze([
      { line: (r, s) =>
        `${s.name} has ordered something that will hurt the very people ${r.name} believes the cause protects. ${r.name} has not decided whether to obey.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s family has learned of the oath and begged ${r.name} to break it. ${s.name} has heard about the begging.`, colour: true },
      { line: (r, s) =>
        `${s.name} wants ${r.name} to act openly this season, and it would cost ${r.name} everything ${r.name} has built here. ${r.name} is ready; ${s.name} has not yet given the word.`, colour: true },
      { line: (r, s) =>
        `${r.name} saw ${s.name} take a purse from a rich merchant, the kind of person the cause is meant to fight. ${r.name} has asked ${s.name} to explain.`, colour: true },
      { line: (r, s) =>
        `A preacher has begun speaking against ${s.name}'s people, and ${r.name} wants the preacher silenced. ${s.name} has told ${r.name} to wait.`, colour: true },
      { line: (r, s) =>
        `${s.name} asked ${r.name} for the names of others who might join. ${r.name} gave one, and the person named has no idea.`, colour: true },
    ]),
  }),

  // fear: a debt
  handler_leverage_debt: Object.freeze({
    label: 'Held Over Them',
    type: 'debtor_creditor',
    desc: Object.freeze([
      { line: (r, s) =>
        `${r.name} owes ${s.name} more than ${r.name} could repay in ten years. ${s.name} does not ask for the money; ${s.name} asks for favours, and each one is marked against the debt.`, colour: true },
      { line: (r, s) =>
        `${s.name} bought up ${r.name}'s debts when the lenders would wait no longer. Now ${r.name} pays in information every week, and the sum never seems to fall.`, colour: true },
      { line: (r, s) =>
        `${r.name} borrowed from ${s.name} to get through a bad year and could not pay it back. Since then ${r.name} does what ${s.name} says, and the interest is counted in favours.`, colour: true },
      { line: (r, s) =>
        `${s.name} keeps ${r.name}'s notes of debt in a locked box. ${r.name} knows that any one of them, shown to the right person, would ruin ${r.name}.`, colour: true },
    ]),
    tension: Object.freeze([
      { line: (r, s) =>
        `${r.name} has found a way to raise the money and pay ${s.name} back in full. ${s.name} has made it clear the debt is not for sale.`, colour: true },
      { line: (r, s) =>
        `${s.name} has asked for a favour worth more than the whole debt. ${r.name} has asked what happens if the answer is no.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s spouse has found the notes and wants to know who ${s.name} is.`, colour: true },
      { line: (r, s) =>
        `Another creditor has offered to buy ${r.name}'s notes from ${s.name}. ${s.name} has made sure ${r.name} knows about the offer.`, colour: true },
    ]),
  }),

  // fear: a secret
  handler_leverage_secret: Object.freeze({
    label: 'Held Over Them',
    type: 'debtor_creditor',
    desc: Object.freeze([
      { line: (r, s) =>
        `${s.name} knows something about ${r.name} that would end ${r.name}'s standing here. ${s.name} has never threatened to tell, and has never needed to.`, colour: true },
      { line: (r, s) =>
        `${s.name} holds letters ${r.name} wrote years ago, in ${r.name}'s own hand. ${r.name} does what ${s.name} asks so the letters stay locked away.`, colour: true },
      { line: (r, s) =>
        `${s.name} learned ${r.name}'s secret by chance and has kept it ever since. The price of keeping it is whatever ${s.name} needs from ${r.name} that month.`, colour: true },
      { line: (r, s) =>
        `${s.name} keeps a witness to ${r.name}'s secret fed and housed. Every few weeks ${s.name} sends ${r.name} a task.`, colour: true },
    ]),
    tension: Object.freeze([
      { line: (r, s) =>
        `Someone else has begun asking questions that come close to ${r.name}'s secret. ${s.name} wants ${r.name} to find out who is asking.`, colour: true },
      { line: (r, s) =>
        `${s.name} has let ${r.name} know that a copy of the letters is held by someone else, in case anything happens to ${s.name}.`, colour: true },
      { line: (r, s) =>
        `${r.name} has started to think the truth coming out would hurt less than ${s.name}'s next request. ${s.name} has noticed the change in ${r.name}.`, colour: true },
      { line: (r, s) =>
        `The witness has started talking where people can hear. ${s.name} says the witness is ${r.name}'s problem now, and ${r.name} knows what ${s.name} means.`, colour: true },
    ]),
  }),

  // fear: a past crime
  handler_leverage_crime: Object.freeze({
    label: 'Held Over Them',
    type: 'debtor_creditor',
    desc: Object.freeze([
      { line: (r, s) =>
        `Years ago ${r.name} killed someone in a fight, and ${s.name}'s people hid the body. ${r.name} has done what ${s.name} asks ever since, because ${s.name} knows where the body lies.`, colour: true },
      { line: (r, s) =>
        `${r.name} once took money that had been left in ${r.name}'s keeping, and ${s.name} helped cover the loss. ${s.name} still has the ledgers that show it.`, colour: true },
      { line: (r, s) =>
        `${s.name} paid off the witnesses to a fire ${r.name} set long ago. The witnesses are still alive, and ${s.name} knows where each of them lives.`, colour: true },
      { line: (r, s) =>
        `${r.name} ran goods for ${s.name}'s crew before ${r.name} was anyone here. ${s.name} remembers every run and the name of everyone who saw it.`, colour: true },
    ]),
    tension: Object.freeze([
      { line: (r, s) =>
        `Someone has started digging near the place where the body was hidden. ${s.name} wants ${r.name} to put a stop to it, and ${r.name} has no reason to give that would not raise questions.`, colour: true },
      { line: (r, s) =>
        `Someone has asked to see the old accounts. ${s.name} has offered to make the ledgers disappear, for a price ${r.name} has not yet heard.`, colour: true },
      { line: (r, s) =>
        `One of the witnesses to the fire wants to confess before dying. ${s.name} has asked ${r.name} what should be done, and ${r.name} has no answer.`, colour: true },
      { line: (r, s, f) =>
        `One of ${r.name}'s old crewmates has been taken by the ${f.body} and may talk to save their own neck. ${s.name} could get the prisoner out if ${r.name} asks, and ${r.name} knows what asking will cost.`, colour: true },
    ]),
  }),

  // fear: someone loved
  handler_leverage_loved: Object.freeze({
    label: 'Held Over Them',
    type: 'debtor_creditor',
    desc: Object.freeze([
      { line: (r, s) =>
        `${r.name}'s eldest child fell in with ${s.name}'s crew and owes them more than the child can ever earn. ${r.name} does what ${s.name} asks, and the child stays safe.`, colour: true },
      { line: (r, s) =>
        `${s.name} knows where ${r.name}'s sister lives, how she earns her keep and what she hides. ${r.name} has never had to be told what would happen if ${r.name} refused ${s.name}.`, colour: true },
      { line: (r, s) =>
        `${r.name} has a lover nobody knows about, and ${s.name} could ruin them both with a word. ${s.name} keeps quiet, and ${r.name} keeps working for ${s.name}.`, colour: true },
      { line: (r, s, f) =>
        `An old friend of ${r.name}'s is held by the ${f.body}, and ${s.name} is the one who keeps that friend fed and safe inside. ${r.name} pays for it in favours.`, colour: true },
    ]),
    tension: Object.freeze([
      { line: (r, s) =>
        `The child wants to leave ${s.name}'s crew. ${s.name} has told ${r.name} that leaving is possible, once ${r.name} has done one more thing.`, colour: true },
      { line: (r, s) =>
        `${r.name}'s sister has been seen talking to ${s.name}'s people. ${r.name} does not know whether she went to them or they came to her.`, colour: true },
      { line: (r, s) =>
        `The lover wants the two of them to leave this place together. ${s.name} has made it clear to ${r.name} that nobody leaves owing what ${r.name} owes.`, colour: true },
      { line: (r, s) =>
        `The friend has fallen ill inside. ${s.name} says a physician can be sent in, once ${r.name} has done what ${s.name} asked last month.`, colour: true },
    ]),
  }),
});

/** The seven archetype keys, in the order of design §1.5's table (the four leverage sub-kinds last). */
export const HANDLER_TIE_KEYS = Object.freeze(Object.keys(HANDLER_TIE_LINES));
