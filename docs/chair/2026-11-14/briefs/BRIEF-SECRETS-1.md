# BRIEF-SECRETS-1: a few very rare, dark secrets, dealt by the seed (the owner's word of 2026-11-17)

You are SECRETS-1, a builder seat. This file is your whole assignment and binds you as written. Read it whole, then
rules R1 to R12 at the top of `docs/chair/2026-11-14/briefs/BRIEF-BAR7.md` (the round's standing rules: they bind you
too), then ruling RS1 in `docs/chair/2026-11-17/bar7/RULINGS.md`. Read nothing more on the chair's lane (your context is
your budget).

## THE OWNER'S WORD (2026-11-17, between 08:44 and 08:51 UTC, verbatim)

"Add in some very rare secrets such as is a serial killer and such. Is psychopathic. Wants to murder his boss. Is in
love with his brothers wife. Etc. peppered in at the appropriate amount"

It is an exception, by the owner's own hand, to the owner's rule "no new text until the fixes are done". THE SEVEN ROWS
BELOW ARE THE ONLY NEW WORDS YOU WRITE. The chair told the owner each part of the form below as a default the owner may
overturn: you build the form, you do not improve it; what you think should differ you SAY in your hand-back.

## THE FORM (ruling RS1; the chair's, each part vetoable by the owner)

**1. THE ROWS.** Each is a secret in the shape the card already carries (`secret.what`, `secret.stakes`), in the page's
plain voice, with no closing full stop (as the existing rows of `src/data/npcData.js`). A label that sounds modern
("serial killer", "psychopath") is not printed: the thing is described.

| key | the owner's word | `what` | `stakes` | where it may stand |
|---|---|---|---|---|
| `killer` | "is a serial killer" | Has killed more than once, and no one has connected the deaths | The deaths are still counted as separate misfortunes; one person laying them side by side would end that | a town, a city or a metropolis |
| `cold` | "is psychopathic" | Feels nothing for other people and has learned to act as though they do | Everyone close to them has seen the act slip once, and no two of them have compared what they saw | a village or larger |
| `superior` | "wants to murder his boss" | Means to kill {superior}, and has worked out how | If {superior} learns of it first, only one of them walks away | only a person who HAS a superior on the page (below) |
| `brothersWife` | "is in love with his brothers wife" | Is in love with their brother's wife, and has never said so | A word of it would break the family | any place |
| `spouse` | the chair's | Has been giving their own spouse a little poison each week, and is patient about it | Any healer who looks closely will know the signs | a village or larger |
| `floor` | the chair's | Has a body buried under their own floor | The missing one's kin have never stopped asking | a hamlet or larger |
| `hired` | the chair's | Has taken coin to kill {target}, and has not yet decided to refuse | Whoever paid expects it done, and {target} suspects nothing | a town or larger; another named person stands on the page |

The brother, his wife, the spouse, the missing one and whoever paid are people OFF the page: the engine keeps no
families, and nothing on the page is to contradict them. `{superior}` and `{target}` are people ON the page, by name.

**2. HOW RARE.** About ONE NAMED PERSON IN TWO HUNDRED, and NEVER MORE THAN ONE IN A TOWN. One named table holds the
odds (so the owner can turn it). You MEASURE over the census's 720 and the wide read's 150 what share of towns of each
size then holds one, and give that table FIRST in your hand-back, in words a person who knows no code can read. The
chair told the owner: most thorps and villages none; about one city in four one. If your measure is far from that, say
so and say what odds would meet it: do not tune silently.

**3. THE SEED PICKS, AND NO DRAW IS TAKEN.** Whether a person carries one, and which, is read from a keyed hash of the
town's seed and the person (the engine's own draw-free reading, the one the history's variant selection uses; find it,
do not write a second). The town's stream of draws is untouched: FOR THE SAME SEED EVERY TOWN IS BORN BYTE FOR BYTE AS
BEFORE BUT FOR THAT ONE CARD'S SECRET. You prove it (item 4 of the measures).

**4. WHERE IT IS DEALT.** After the ties and the ranks exist: where the goals are dealt (`src/generators/people/goals.js
:: dealGoals` has two callers: the birth, in `src/generators/narrativeGenerator.js`, and the re-roll, in
`src/generators/generateSettlementPipeline.js`). A person a re-roll KEEPS keeps the secret they have. A saved town is
never touched: nothing runs at load or at print.

**5. WHO MAY CARRY ONE.** An adult (read the card's age vocabulary; a child or a youth never). Never a person whose
present secret another reader depends on: LIST every reader of a card's `secret` in src (the crime level's branch that
bakes a name, the food record's held secrets, the hook registry, the generation law's filter, the roster's prose
refresh, the PDF, the journal) and prove that replacing one card's secret changes nothing but that card's two printed
lines. Where a reader depends on the present secret, that person is not eligible: say how many that excludes.

**6. THE SUPERIOR AND THE TARGET ARE REAL.** `{superior}` is the first (the head) of a body this person is a second or
a member of, as the card prints it ("member of ..."), or the mentor of a tie in which this person is the successor.
Read how ranks and ties are stored; if a superior cannot be read cleanly from the record, LEAVE THE ROW `superior` OUT
BY NAME with what you found: do not invent one. `{target}` is another named person of the same roster, picked by the
seed, never the person, never their superior. Both names ride the engine's ONE substitution point for names baked into
secrets (the pipeline's roster prose refresh): a renamed or replaced person is followed, or the secret is dealt again;
your guard holds it.

**7. IT AGREES WITH THE CARD.** `cold` is written as a mask so that a kind manner on the same card is not denied; check
the seven rows against every other line a card can print (temperament, flaw, disposition, the goal, the hook, "How
they deal") and NAME any pairing a cold reader would call a contradiction; where one exists, the row does not stand for
that person (a declaration, in the vocabulary's own atoms: NO NEW ATOM; if you need one, ASK).

**8. THE WORLD'S LAW.** The rows presume no magic, no god and no institution; they pass the generation law's filter for
secrets as they are (prove it for each world law the filter knows).

## YOUR FILES (your whole list; a file not on it is not yours: R2)

- NEW `src/data/rareSecrets.js`: the seven rows and the one table of odds (data only).
- NEW `src/generators/people/rareSecrets.js`: the deal (who, which, the names), pure, typed, no `any`.
- ONE HUNK in `src/generators/narrativeGenerator.js` and ONE HUNK in `src/generators/generateSettlementPipeline.js`:
  the call beside each call of `dealGoals`. Nothing else in either file.
- NEW `tests/generators/rareSecretsLaw.test.js`: your guard (below).
- By rule R8, any test your change makes untrue, re-keyed by identity with a dated note. YOU RE-TAKE NO STORED FIGURE
  AND NO REFERENCE FILE (R10): a same-seed reference town that now carries a rare secret is NAMED in your hand-back with
  its seed and the card, for the close.
- Your hand-back `docs/chair/2026-11-17/secrets/SECRETS-1-HANDBACK.md`.

NOT YOURS: `src/data/npcData.js`, `src/generators/npcGenerator.js`, `src/generators/npc/*`, every display and PDF
file, `src/generators/steps/assembleSettlement.js`, `vite.config.js`, `package.json`, every file of the seats in flight
(BIRTH-2: `houseKinds.js`, `supplyStory.js`, `houseInputAtHand.js`, `resourceGenerator.js`, `validationOnPage.js`,
`ResourcesTab.jsx`, `crisisStoppedRow.js`, the narratives step; BAR7-ORDER: `guardLineUnderTheLaw.js`). NO NEW FIELD ON
THE SAVED RECORD: a rare secret is known by its words (the rows' texts are its own), never by a marker.

## THE MEASURES (each before and after, by a runner you name; base first)

1. The table of item 2 (towns holding one, by size, over the 720 and the 150), and which row, and three example cards.
2. `fieldDiff` over the 720 and the 150, base against tip: every field identical but the `secret` of the cards dealt.
3. The two doors (`node scripts/presumption-classes-door.mjs --check`, `node scripts/presumed-things-door.mjs --check`):
   NO FRESH ROW. A row the things door reads as fresh is cured by its declaration or its wording within the table
   above; if the table's own words cannot pass, STOP and ASK with the door's line.
4. The people's guards green as at your base: `tests/domain/bar6PeopleLaw10.test.js`, `tests/domain/bar4PeopleKinds.test.js`,
   `tests/components/bar7CardsMarkOnce.test.jsx`, the hook variety's.
5. The auditors' runners over the 150 at your tip (the line holds them under `docs/chair/2026-11-16/bar5/AUDIT`,
   `docs/chair/2026-11-16/bar6/AUDIT`, `docs/chair/2026-11-17/bar7/AUDIT`): no rule's count rises.

## YOUR GUARD (`tests/generators/rareSecretsLaw.test.js`)

On planted rosters and a small born sample (keep it light: no loop over hundreds of births): at most one in a town;
each row only where the table lets it stand; a child never; the superior named is a real superior of that person and
the target a real other person; a kept person keeps theirs; the same seed gives the same deal; with the deal switched
off the roster is identical but for that card's secret (no draw taken); a renamed target is followed. Seed loops
collect every failure (`tests/helpers/seedFailures.js`); every negative stands beside its anchor
(`tests/helpers/anchoredNegatives.js`).

## YOUR NET BEFORE YOUR LAST PUSH (each alone, through `sh scripts/gate-tail.sh`, never a pipe)

The two type gates; eslint on your changed sources; `npx vitest run tests/architecture`; your guard; ALL OF `tests/lint`
AT YOUR BASE AND AT YOUR TIP, COMPARED BY NAME (every test red at your tip and not at your base is yours to cure or to
explain; above all `domainAnyCastBaseline`, `negativeAssertionAnchor.walker`, `seedLoopTotality.walker`,
`mutationCoverageManifest`: a registration your guard owes is NAMED, the manifest is a shared tool); ONE `npm run build`
with `npx vitest run tests/build/vendorPdfLazy.test.js tests/build/bootSmoke.test.js`. Before you hand back: a scratch
merge of the line's tip as it then stands with your tip (local, never pushed; on your own branch you merge nothing):
your guard and the people's guards there.

## HAND-BACK

`docs/chair/2026-11-17/secrets/SECRETS-1-HANDBACK.md`: the table of item 2 FIRST; the seven rows as built (or a row left
out by name, with the reason); the readers of `secret` and what each does; the pairings of item 7; the measures; the
reference towns that move, by seed; the net; what is left by name; for the owner's veto list: the rows and the odds in
plain words. Budget: hand back at 350,000 of your count, then push nothing more. PUSH EARLY AND OFTEN. One line to the
chair at the end, 150 words at most. ASK the chair only where this file says ASK.
