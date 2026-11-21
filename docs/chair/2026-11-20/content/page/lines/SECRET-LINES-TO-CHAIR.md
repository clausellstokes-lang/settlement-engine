# SECRET-LINES, to the chair: the secret on nearly every place's cards (PAGE-8; written 2026-11-20 19:30 UTC by `date -u`)

> **APPROVED TO BUILD (the chair, 20:02): "40 APPROVED TO BUILD, with five cures (no season, no echo)".** The five cures are
> applied below in place, each marked **[CURE n]**; the built table is `src/data/people/crimeKnowledgeSiblings.js ::
> CRIME_KNOWLEDGE_WORDINGS`, indexed by the frame's index K0–K3 (COMMON-RULES rule 2 and the chair's word of 20:50: no table
> keyed by a sentence), the pool composed at the site as [the drawn row, ...its ten siblings] and handed to `drawDeclared`
> with the keyed pick as its draw (SECRET-LINES-BUILD).

DRAFT LINES ONLY. Nothing under `src/` or `tests/` was written. Measured on the lane commit a614d7664 (L2 and S9 merged).
Script: `docs/chair/2026-11-20/content/page/measures/page-8/secret/secretLines.mjs` (it holds the forge, the measure, the
lines' lint and the projection, and the 40 lines below as data). From the tree's root:
`sh scripts/gate-mutex.sh --run -- node <script> forge "$PWD" <cache.json> 150` (900 places, 120 s), then
`node <script> measure "$PWD" <cache.json>` (reads the cache only). Seeds `hxd-<size>-<i>`, i < 150, untouched settings:
the first 50 of each size are the chair's 300.

## 1. It prints (by symbol)

- **secret.what**: `src/components/new/npcComponents.jsx :: NPCInlineCard`. `secretText` is `npc.secret.what`, printed
  under "Secret:" on every card that has a secret (an `EditableText` when the card can be authored, else a `span`).
- **secret.stakes**: not on the web card. `src/pdf/lib/viewModel.js`, the `npcs` slice (the PDF's NPC chapters and the
  Foundry journal), pushes `` `${what}: ${stakes}` `` into the card's secrets.
- **Receipt**: on the same seeds the record count matches SAME-1's rendered count exactly. "Neither has acknowledged the
  other was there" is on town 43/50 and village 25/50, the same as `OFF-LIST.md` hxd (origin `lane/same-1-2026-11-20`).

## 2. The pool

`src/generators/npcGenerator.js :: generateCrimeLevel`, its first branch (`random01(0.25)`, roster > 1). The pool
is FOUR inline rows `{ what, stakes }` (poolId `npcGenerator:CRIME_KNOWLEDGE`). None of them declares anything, so all
four are admitted everywhere:

| family | what (`#` = the other card) | stakes |
|---|---|---|
| K0 | Knows something about # that # believes no one else knows, and has been deciding for months whether to use it | # would move against them immediately if they suspected |
| K1 | Was present when # did something they've never accounted for publicly. Neither has acknowledged the other was there | The situation they're both ignoring is becoming relevant again |
| K2 | Owes # a debt from before either of them held their current position: one that # has never formally called in | The silence feels like patience, and it is not forgiveness |
| K3 | Has been reading #'s correspondence through an intermediary. Nothing damaging yet. But they keep looking | The intermediary has recently started asking for more money |

- **`#`**: `otherNpc.name`, with `otherNpc = pickRandom2(roster less the card)`. This is a DRAW.
- **The row is a DRAW**: `drawDeclared(…, { draw: pickRandom2, held: heldFrames, heldKey: frameOf(s.what) })`, which
  becomes `rngContext.js :: pick`: ONE roll, index `floor(r × n)` over the rows NOT held.
- **The held set** is the FRAMES (every roster name masked, `npc/rosterFrame.js`) that the rest of the roster already
  carries (STYLE-2 SW-7: "no frame twice in one dossier"). When every frame is held, no roll is made and the card keeps
  its own secret.
- **This is why the four frames saturate.** A frame stands at most once in a place: measured, a frame twice in one
  place 0 times on the 900. A place whose roster sends four or more cards into the 25% branch carries ALL FOUR frames.
  A town has a mean of 23.6 cards, a city 57.8 and a metropolis 83.9.
- **"Has been reading…" is K3 of this pool.**
- **The named stakes "Treason. Those they've sold out would not be forgiving" is NOT this pool.** It is
  `npcData.js NPC_CRIMINAL_SECRETS_BY_HOLDER.any.political[5]`, drawn by `npc/factionLeaderSecret.js`. Places carrying
  it: thorp 0, hamlet 0, village 0, town 6.0%, city 8.0%, metropolis 23.3% (35/150). See §7.

## 3. The bar, before (the chair's: by the sentence, over ALL places of a size, 150 a size)

**secret.what**: the five commonest sentences of each size. `#` is normalised; a frame's second and third sentences
count apart.

| size | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| thorp | 12.7% "Has been selling a few sheep from every flock…" | 10.7% "Has been landing goods that are not fish…" | 10.0% "Let a sick flock graze…" | 8.7% "Let a boat go out in weather…" | 8.7% "Keeps the best fishing waters…" (frames: K0 4.0%, K1 2.7%, K2 4.0%, K3 1.3%) |
| hamlet | 22.0% K0 | 20.0% K2 | 18.0% K3 "Has been reading…" | 18.0% K3 "Nothing damaging yet" | 18.0% K3 "But they keep looking" (K1 14.7%) |
| village | 50.7% K0 | 46.0% K1 "Was present when…" | 46.0% K1 "Neither has acknowledged…" | 44.7% K3 | 44.7% K3 (K2 44.7%) |
| town | 88.7% K1 "Was present when…" | 88.7% K1 "Neither has acknowledged…" | 87.3% K3 | 87.3% K3 | 87.3% K3 (K0 87.3%, K2 84.7%) |
| city | 100.0% K1 | 100.0% K1 | 99.3% K0 | 98.7% K3 | 98.7% K3 (K2 98.7%) |
| metropolis | 99.3% K1 | 99.3% K1 | 99.3% K0 | 98.7% K3 | 98.7% K3 (K2 97.3%) |

**secret.stakes**: the four frames' stakes at the same shares (hamlet 22.0 / 20.0 / 18.0 / 14.7; village
50.7 / 46.0 / 44.7 / 44.7; town 88.7 / 87.3 / 87.3 / 84.7; city 100 / 99.3 / 98.7 / 98.7; metropolis
99.3 / 99.3 / 98.7 / 97.3). The commonest stakes OUTSIDE the four frames: thorp 12.7% "The owners have started
counting…"; village 26.0% "The bakers would turn on the miller…"; town 42.0%, city 64.0%, metropolis 70.7% "Acting on
the visions would be seen as madness; ignoring them may be worse".

**THE FINDING.** The fault is not one line. It is all four frames of one pool, each at 85–100% of towns, cities and
metropolises, and its stakes with it. Curing "Was present…" alone would leave K0 at 99.3% in a metropolis.

## 4. How many lines, given the mechanism

**ADDING ROWS TO THE DRAWN LIST WILL NOT DO.** The roll count stays the same (one `pick`), but `floor(r × n)` re-maps
every winner's index once n changes. That moves the secret of every card on a frame. It moves more:

- `narrativeGenerator.js :: buildPoliticalNarrative` hands the secret to `npcGenerator.js :: getStressHistory`. K0's
  word "knows" takes its `isSignificant` arm, which rolls `random01(0.5)` and may `pick`. A card that enters or leaves
  K0 adds or removes rolls, so the place's whole stream after it moves.
- The held domain of every later card changes too.
- It would not reach the bar anyway. Each place's winners take DISTINCT frames, so a frame's share is about W/F
  (winners over frames). A metropolis has about 21 winners (84 × 0.25), which would need about 140 frames.

**THE FRAME MUST BECOME A KEYED PICK.** The family stays drawn exactly as now: the same roll over the same four rows and
the same held refusal. Its WORDING is then chosen draw-free among k wordings, the base row being wording 0:
`pickVariantMixed(FAMILY[j], key)`, taken from origin `lane/kernel-mix-2026-11-20` bd42d63c7 (`src/kernel/proseHash.js`:
`mix32(fnv1a32(seed)) % n`, zero PRNG draws). Projected key: `` `${seed}::npcGenerator:CRIME_KNOWLEDGE:${j}::${npcIndex}` ``,
with the seed that `drawDeclared`'s own key reads.

The pick reaches the bar only at about 11 wordings a family. Each wording's share is binomial over the 150, so the
commonest of 44 wordings runs above the expected `share / k`. Here is the commonest single wording's share, all four
families at k each, under TEN different keys (median / worst):

| k (new lines) | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| 7 (24) | 1.3 / 2.7 | 5.3 / 8.0 | 10.7 / 12.7 | 17.3 / 22.0 | 20.0 / 22.7 | 19.3 / 22.0 |
| 8 (28) | 2.0 / 2.0 | 5.3 / 6.0 | 10.7 / 12.0 | 16.0 / 16.7 | 18.0 / 20.7 | 18.0 / 20.0 |
| 9 (32) | 1.3 / 2.0 | 4.7 / 7.3 | 10.0 / 10.7 | 14.7 / 16.7 | 15.3 / 18.0 | 18.0 / 20.7 |
| 10 (36) | 1.3 / 2.0 | 4.7 / 6.0 | 8.7 / 10.7 | 13.3 / 18.0 | 16.0 / 18.7 | 15.3 / 18.0 |
| **11 (40)** | 1.3 / 2.7 | 4.0 / 6.0 | 8.0 / 11.3 | 12.7 / 15.3 | **13.3 / 16.0** | **14.0 / 17.3** |
| 12 (44) | 1.3 / 2.0 | 4.0 / 4.7 | 8.0 / 9.3 | 12.0 / 13.3 | 13.3 / 15.3 | 13.3 / 15.3 |

**k = 11 is the smallest k whose median is under 15% at every size: 10 new lines a family, 40 in all.**

**WHAT A NEW LINE COSTS IN STORED-FIELD MOVEMENT.** Only `secret.what` and `secret.stakes`, on the frame cards whose
wording is not the base. Projected: thorp 16/18, hamlet 103/112, village 252/279, town 485/522, city 533/595,
metropolis 542/592 (1,931 cards on the 900). That holds ONLY IF the builder keeps five conditions. Each is a stored
field that moves otherwise:

1. **THE HELD KEY READS THE FAMILY.** A sibling on another card must count as its family's frame in `heldFrames`.
   Otherwise a later card's domain grows, and its roll picks a different row.
2. **THE STRESS-HISTORY CLASS IS KEPT.** K0 siblings carry "knows" and nothing else from `getStressHistory`'s lists.
   K1–K3 siblings carry none of them (linted). Otherwise the presentation roll moves.
3. **K2 SIBLINGS OPEN "Owes # a debt".** `npcData.js :: secretOwes` reads it to write the pair's debt tie the right way
   round. Otherwise the tie text moves.
4. **EVERY SIBLING NAMES # IN `what`, as its base does.** `people/rareSecrets.js :: exclusionOf` refuses a card "named
   in another card's secret". Otherwise the rare deal moves.
5. **NO WORD THAT `npcGenerator.js :: mergeNPCLists` REWRITES** (merchant, thieves, guild), and none of F5's venal list
   (S9's post-pass and PAGE-1's `f5.mjs` read it).

**Measures need the wordings.** PAGE-1's `f5.mjs :: sourceOf` and the census tools recognise the frames by their base
regex. They will need the wordings exported to recognise a sibling.

## 5. The lines (40: ten beside each existing line; `#` used as the base uses it)

**DECLARATIONS for every line below: NONE**, as its base row. A line names no house, no place-feature, no crime fact,
no age and no household. It needs no atom and no house, so silence admits it everywhere, as the four rows are admitted
now. The script's lint checks every line for:

- `getStressHistory`'s word class (K0 "knows" only; K1–K3 none);
- F5's venal list;
- the merge's rewritten words;
- a list of house, place-feature, crime, age and household words;
- `#` in `what`, and K2's "Owes # a debt" opening;
- no closing stop.

It also checks that no sentence is shared by two lines. Result: 40 lines, 0 failing, 0 shared sentences.

### K0: beside "Knows something about # that # believes no one else knows, and has been deciding for months whether to use it" / "# would move against them immediately if they suspected"

| # | what | stakes |
|---|---|---|
| 1 | Knows that # broke a promise that everyone believes was kept, and has not yet decided what to do about it **[CN2, the chair 22:34: was "Knows that # broke a promise everyone believes # kept, and has not yet decided what to do about it"]** | # has been praised for keeping that promise, and would not take the truth well |
| 2 | Knows what # really said in a quarrel that everyone else remembers differently, and has let the other version stand | # has repeated the other version often enough to be caught out by it |
| 3 | Knows why # turned back from a journey last year, and has kept the reason to themselves | # told everyone the weather turned them back, and would not like the true reason heard |
| 4 | Knows that # once took the blame for something they did not do, and has never asked them why **[CN2, the chair 22:34: was "Knows that # once took the blame for something they did not do, and has never asked # why"]** | If it came out, # would have to say whom they were shielding |
| 5 | Knows that # once made ready to go away for good and was talked into staying, and has never brought it up | # has since spoken as if going had never crossed their mind |
| 6 | Knows where # really goes on the evenings they say they are out walking, and has kept it quiet **[CN2, the chair 22:34: was "Knows whom # goes to see on the evenings # says they are out walking, and has kept it quiet"]** | # has never given a reason for those walks, and would not want to be asked for one |
| 7 | Knows that # lost something they were trusted to keep, and has watched them hide the loss ever since **[CN2, the chair 22:34: was "Knows that # lost something they were trusted to keep, and has watched # hide the loss ever since"]** | # has never owned to the loss, and could not make it good now |
| 8 | Knows that the choice everyone blames on someone else was #'s, and has never said a word | # has let another carry the blame for it, and would have that to answer for as well |
| 9 | Knows that # started a rumour that did someone real harm, and has never told the one it hurt | # would lose a friend over it, and perhaps more than one |
| 10 | Knows that # turned down help when it was offered, then told everyone none was offered | # has made much of being left to manage alone, and would look small if the truth came out |

### K1: beside "Was present when # did something they've never accounted for publicly. Neither has acknowledged the other was there" / "The situation they're both ignoring is becoming relevant again"

| # | what | stakes |
|---|---|---|
| 1 | Was still up when # came by very late one night, and saw the state they were in. Neither has spoken of it since **[CN2, the chair 22:34: was "Was still up when # came by very late one night, and saw the state # was in. Neither has spoken of it since"]** | Someone has started asking where everyone was that night |
| 2 | Overheard # make a promise to someone who has since been turned away. Neither has mentioned it **[CN2, the chair 22:34: was "Overheard # make a promise to someone # has since turned away from. Neither has mentioned it"]** | The one the promise was made to has begun to talk about it |
| 3 | Stood by while # turned away someone who badly needed help. They have not spoken of it since | The one turned away has come back, and remembers who was there |
| 4 | Was there when # lost their temper and broke something that was not theirs. Neither has brought it up | The owner still wonders what became of it, and has started asking |
| 5 | Watched # put something in the fire that others have been looking for ever since. Neither has said a word | The search for it has started up again |
| 6 | Saw # meet someone at first light. # claims never to have met them. They have never talked about it **[CN2, the chair 22:34: was "Saw # meet someone at first light whom # claims never to have met. They have never talked about it"]** | That someone has come back, and greeted them both like old acquaintances |
| 7 | Was with # the day they said something cruel to a friend, and has never repeated it. Neither has raised it **[CN2, the chair 22:34: was "Was with # the day # said something cruel to a friend, and has never repeated it. Neither has raised it"]** | The friend has heard part of it from someone else, and wants the rest |
| 8 | Saw # weep after a meeting that everyone else thinks went well. Neither has let on | Another such meeting is coming, and they will both be in the room |
| 9 | Was close by when # made a choice that cost someone else dearly, and kept still. Both have kept still since | The one who bore the cost has begun to wonder who else was there |
| 10 | Heard # tell a lie that settled a quarrel in their favour, and said nothing. The two of them have left it there **[CURE 5, the chair 20:02: not "let it lie" after "tell a lie"]** **[CN2, the chair 22:34: was "Heard # tell a lie that settled a quarrel in #'s favour, and said nothing. The two of them have left it there"]** | The quarrel has started up again, and the lie will not hold a second time |

### K2: beside "Owes # a debt from before either of them held their current position: one that # has never formally called in" / "The silence feels like patience, and it is not forgiveness"

| # | what | stakes |
|---|---|---|
| 1 | Owes # a debt for lodging given when they had nowhere to go. # has never once mentioned it **[CURE 1, the chair 20:02: no season]** **[CN2, the chair 22:34: was "Owes # a debt for lodging given when they had nowhere to go, and # has never once mentioned it"]** | Being let off so lightly sits worse with them every year |
| 2 | Owes # a debt for a word put in at the right moment, and they have never asked for anything in return **[CN2, the chair 22:34: was "Owes # a debt for a word put in at the right moment, and # has never asked for anything in return"]** | A favour of that size is bound to be asked for one day |
| 3 | Owes # a debt for keeping quiet about a mistake, and they have never said what it will cost **[CN2, the chair 22:34: was "Owes # a debt for keeping quiet about a mistake, and # has never said what it will cost"]** | They have begun to dread the day # names a price |
| 4 | Owes # a debt from a bad year. # carried them through it and has never asked for it back **[CURE 2: "a bad year", not "season"]** **[CN2, the chair 22:34: was "Owes # a debt from a bad year, when # carried them through, and # has never asked for it back"]** | Others have noticed how readily they side with # on every question |
| 5 | Owes # a debt on a promise made in a hard hour. # has never held them to it **[CURE 3, the chair 20:02: no echo]** **[CN2, the chair 22:34: was "Owes # a debt on a promise made in a hard hour, and # has never held them to it"]** | A promise left lying that long is only waiting for its moment |
| 6 | Owes # a debt that neither of them ever wrote down. # has never once raised it **[CN2, the chair 22:34: was "Owes # a debt that neither of them ever wrote down, and that # has never once raised"]** | With nothing written, # may ask for whatever they please |
| 7 | Owes # a debt for a loan made in friendship, and they have never asked for it back **[CN2, the chair 22:34: was "Owes # a debt for a loan made in friendship, and # has never asked for it back"]** | The friendship has cooled, and the loan has not been forgotten |
| 8 | Owes # a debt for taking their side when no one else would. # has never said so aloud **[CN2, the chair 22:34: was "Owes # a debt for taking their side when no one else would, and # has never said so aloud"]** | If # ever needs someone to stand up for them, they will be expected to |
| 9 | Owes # a debt for a kindness done in secret, and they have never let on who did it **[CN2, the chair 22:34: was "Owes # a debt for a kindness done in secret, and # has never let on who did it"]** | They have only lately learned whose kindness it was, and cannot tell what is expected of them |
| 10 | Owes # a debt for an introduction that made their name. # has never called it in **[CN2, the chair 22:34: was "Owes # a debt for an introduction that made their name, and # has never called it in"]** | Everyone assumes they rose on their own, and # is aware it is not so |

### K3: beside "Has been reading #'s correspondence through an intermediary. Nothing damaging yet. But they keep looking" / "The intermediary has recently started asking for more money"

| # | what | stakes |
|---|---|---|
| 1 | Has been keeping a note of every visitor to #'s door for most of a year. Nothing has come of it. The note grows longer | Someone has noticed them watching the door |
| 2 | Has been asking after #'s comings and goings through a friend of a friend. Little has turned up. They have not stopped asking | The friend of a friend has begun to wonder why |
| 3 | Has been lingering within earshot whenever # thinks no one is near. Most of it is dull. They linger all the same | # has started choosing quieter corners |
| 4 | Has been piecing together #'s past from what visitors let slip. The pieces do not fit yet. They go on gathering them | One of those visitors has mentioned the questions to # directly |
| 5 | Has set someone to trail # on errands for months. The reports are dull. They keep the trailing up **[CURE 4: "for months", not "for a season"]** | The one doing the trailing has grown fond of #, and may say something |
| 6 | Has been reading the letters # leaves lying about, whenever the chance comes. There has been nothing worth having. They read on regardless | # has begun to put the letters away |
| 7 | Has been keeping count of the hours # spends away and where they say they went. The accounts mostly match. Mostly is not enough for them **[CN2, the chair 22:34: was "Has been keeping count of the hours # spends away and where # says they went. The accounts mostly match. Mostly is not enough for them"]** | # has noticed that the questions always come from the same direction |
| 8 | Has been making a friend of #'s closest friend in the hope of hearing something useful. Nothing useful yet. The friendship goes on | The friend has begun to repeat the questions to # |
| 9 | Has been noting every promise # makes in front of others and checking which are kept. So far most are. The tally goes on | A tally like that would be hard to explain if it were found |
| 10 | Has been watching who sits with # and who is kept at a distance, and drawing conclusions. None of them is firm yet. The watching goes on **[CN2, the chair 22:34: was "Has been watching whom # sits with and whom # avoids, and drawing conclusions. None of them is firm yet. The watching goes on"]** | Someone has asked them, half in jest, why they always seem to be wherever # is |

**Judgment calls for the chair's eye:**

- K0 6 and K1 8 hint at a private life. Each states nothing a card records.
- K2 1 ("a winter's lodging") says # once gave the holder a roof. It is not a household.
- K3 6 keeps the base's letters. Every line presumes letters no more than the base row does.

## 6. Projected share per size, after

These figures assume the 40 lines, k = 11, and the key above. They are projected with the drafted sentences in place on
the same 900.

| size | the commonest frame sentence (what), before → after | its stakes, before → after |
|---|---|---|
| thorp | 4.0% → 1.3% (2/150) | 4.0% → 1.3% |
| hamlet | 22.0% → 4.7% (7/150) | 22.0% → 4.7% |
| village | 50.7% → 8.0% (12/150) | 50.7% → 8.0% |
| town | 88.7% → 11.3% (17/150) | 88.7% → 11.3% |
| city | 100.0% → 12.7% (19/150) | 100.0% → 12.7% |
| metropolis | 99.3% → 13.3% (20/150) | 99.3% → 13.3% |

The builder's exact key will move these within the §4 band: k = 11 has a median of 13.3–14.0% and a worst case of
16.0–17.3% at city and metropolis.

## 7. Noticed, not this brief's

- **The frame cure does not bring every sentence of a size under 15%.** After it, the sentences at or above 15% of a
  size's places OUTSIDE the four frames are:

  | size | what | stakes |
  |---|---|---|
  | village | 3 | 3 |
  | town | 16 | 16 |
  | city | 169 | 167 |
  | metropolis | 259 | 256 |

  The commonest is "Secretly receives what they believe are genuine divine visions, which terrifies them" (with its
  stakes): town 42.0%, city 64.0%, metropolis 70.7%. It is `npcData.js NPC_CRIMINAL_SECRETS_BY_HOLDER.any.religious`,
  a ONE-row pool. Next come the title rows (`titleSecretsPresentations.js`, three a title: "Built a roof with green
  timber…" at 64.7% of metropolises) and the catch-all's rows ("Has been embezzling…" 53.3%).
- **The named stakes "Those they've sold out…" (metropolis 23.3%) is one row of that catch-all.** Its `what` stands at
  the same share. A stakes sibling alone would not move the sentence bar.

Those are the catch-all pools' and the title pools' faults. They need their own brief.

## 8. BUILT (SECRET-LINES-BUILD), MEASURED on the built tree

Forged on the built tree, 150 places a size (`secretLines.mjs forge`, then `measure` §7), beside the projection of §6.
The commonest frame sentence, any wording, of `what` (the stakes ride with it and read the same):

| size | before | projected (§6) | MEASURED |
|---|---|---|---|
| thorp | 4.0% | 1.3% | 1.3% (2/150) |
| hamlet | 22.0% | 4.7% | 3.3% (5/150) |
| village | 50.7% | 8.0% | 8.0% (12/150) |
| town | 88.7% | 11.3% | 12.0% (18/150) |
| city | 100.0% | 12.7% | 12.7% (19/150) |
| metropolis | 99.3% | 13.3% | 18.0% (27/150) |

The metropolis top is K0's tenth sibling ("Knows that # turned down help…"), 27/150. The next wording there stands at
13.3%. The built key differs from the projection's key, and §4's band at k = 11 reaches 17.3% at its worst. The chair's
COMMON-RULES rule 3 lets a top up to 20% pass as sampling.

The records changed this way:
- On the chair's 300, comparing the two trees, only `npcs[].secret.what` and `npcs[].secret.stakes` differ: 645 cards
  in 219 places, and nothing that is not a string.
- Every other secret sentence is as it was. §3d's counts outside the four frames are equal on both caches, except at
  metropolis: what 259 → 260 and stakes 256 → 257. That one extra is the K0 sibling above, which §3d does not count as
  a frame sentence.
