# GOALS-1 · builder 5 · the 13 approved tie pairs into the reserves, and the reserve arms of the tie test

Written 2026-11-20 11:26 UTC by GOALS-1 (the integrator), on `lane/goals-1-2026-11-20` (GR3 for ties landed at 94493d1fd: `pairProse`'s fifth argument, the reserve; the head frozen). You build; GOALS-1 reads your diff line by line and re-runs your red and green.

## Read first, and no more
`CLAUDE.md`; in `src/data/npcData.js`: `pairProse` and the comment block above it, and the five archetypes `mutual_leverage`, `old_debt`, `peer_rivalry`, `wary_alliance`, `mentor_legacy` WHOLE (how each `pairProse` call is written: its salt, `order`, `debt` arguments; the row shape `{ line: (r, s) => …, colour: true }`); `src/generators/power/relationshipArchetypes.js :: createTieProseDraw`; `tests/generators/tieReserveHead.test.js`; `tests/generators/tieDrawDeclared.test.js`, `tieDrawUnprinted.test.js`. READ ONLY: `drawDeclared.js`, `factVocabulary.js`. Do NOT change line 1686 of `npcData.js` or any line above the first archetype (`tests/generators/generationForkCensus.test.js` pins a line there by number): the reserves go INSIDE the five archetypes, below it.

## 1. The pairs: EXACTLY these (the chair approved them at 10:48 and 10:58 UTC; not one word changes)
`{A}` is `r.name`, `{B}` is `s.name`, written as the archetype's own lines write them (`${r.name}`). Each row `{ line: (r, s) => `…`, colour: true }`: none states a trust, a vote or a shared place. Each archetype's `desc` gets the D lines and its `tension` the T lines, as the fifth argument of its `pairProse` call, in this order, so reserve index k picks D[k] and T[k]. Where the archetype's call has no `order`/`debt` arguments, pass `null`/`false` as their defaults are.
- mutual_leverage:
  1. D "{A} cannot finish what they have started without {B}'s help, and {B} cannot finish theirs without {A}'s. Neither lets the other forget it." T "{A} wants the arrangement with {B} written down and witnessed. {B} would rather keep it a matter of word."
  2. D "{A} needs {B}'s goodwill this year, and {B} will need {A}'s the next. Both of them have counted the years." T "{A}'s year of need has come early, and {B} has not yet decided how generous to be."
  3. D "{A} hears of trouble early and {B} hears of opportunity early, and each passes the word to the other a day before anyone else." T "{A} learned of something last week and told {B} a day late. {B} has noticed the day."
  4. D "{A} and {B} know exactly what each would refuse the other, and so neither ever asks for it." T "{B} needs something this season that lies just past what {A} has always refused."
  5. D "{A} can open doors for {B} that {B} could never open alone, and {B} does the same for {A} in other places. Each uses the other sparingly." T "{A} has asked {B} for an introduction {B} would rather keep to themselves."
- old_debt ({A} owes {B}):
  1. D "{B} once spoke up for {A} when it cost {B} something to do it. {A} has never been asked for anything in return." T "{B} has asked {A} to speak up for someone else, as {B} once spoke up for {A}."
  2. D "{B} stood surety for {A} once, and {A} has kept every term since so that {B} would never have to pay." T "{B}'s surety for {A} still stands, and {B} would like to be released from it."
- peer_rivalry:
  1. D "{A} and {B} have made each other better by the contest, and each would admit it, though never to the other." T "{B} has come out ahead three times running. {A} has said nothing and started earlier each morning."
  2. D "{A} and {B} were friends before they were rivals, and still are on the days the contest rests." T "{A} needs {B}'s help with something outside the contest, and has not yet found a way to ask."
- wary_alliance:
  1. D "{A} and {B} want the same thing for the settlement, for different reasons, and keep their reasons to themselves." T "{B} has asked {A} for those reasons at last, and {A} has not decided how much to say."
  2. D "{A} and {B} are allies on one matter only, agreed in plain terms, and never stretch it to anything else." T "{B} has asked {A} to stretch the alliance to a second matter. {A} has not said yes or no."
- mentor_legacy ({A} the teacher):
  1. D "{A} still gives {B} advice now and then, unasked, and {B} still hears out every word of it." T "{B} has stopped answering {A}'s advice, though {B} still follows most of it."
  2. D "{A} taught {B} patience, which {A} never managed to learn." T "{B} means to take a pupil this year and has not yet asked {A}'s blessing."
If an archetype's existing `debt`/`order` handling would put a pair's ends in an order these lines do not mean (old_debt: {A} owes {B}), stop and tell GOALS-1 rather than reword.

## 2. The reserve arms of `tests/generators/tieReserveHead.test.js` (deferred from builder 3: they need a real reserve)
- (a) with the real reserve: for each of the five archetypes, `head` is the variants' count, `size` = head + its reserve, and the first `head` ties of the archetype in a planted town deal exactly the indices the head-only cycle deals (compute the cycle; never quote a line).
- (b) a planted repeat past the head takes the reserve's first free admitted index (from the cycle's place past the head), each reserve index at most once until the reserve is spent; then rung (ii).
- Red on 94493d1fd (no reserve there), green after. Compute every sentence through the archetype (`archetype.desc(r, s, i)`), never quote it (`tests/lint/proseDrawnAnchors.walker.test.js`).

## Gates (to files, read by count lines, never through a pipe: `sh scripts/gate-tail.sh <cmd>`)
The arms red then green; `tests/generators/tieReserveHead.test.js tieDrawDeclared tieDrawUnprinted blocLineSharedPower tests/domain/bar4PeopleKinds.test.js tests/generators/people tests/data/npcData*` (whatever exists), `tests/lint/proseDrawnAnchors.walker.test.js`, `tests/lint/namesInSentences.walker.test.js`; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`. Never the whole suite.

## Your files
`src/data/npcData.js` (the five archetypes' `pairProse` calls only), `tests/generators/tieReserveHead.test.js`. No rename. Do NOT commit or push; report back (files, any difference from this brief, red and green with counts and log paths, anything undone).
