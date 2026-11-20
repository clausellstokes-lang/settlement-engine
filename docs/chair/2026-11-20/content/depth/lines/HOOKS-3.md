# HOOKS-3: the second tranche of person hooks (DEPTH-2's line writer, 2026-11-20)

For the brief `docs/chair/2026-11-20/content/depth/briefs/WRITE-TRANCHE-2.md` (at `cb201e866`), under the writing rules of
`../briefs/WRITE-HOOKS.md`, word for word. Review lines only: nothing here is in a source file. 36 hooks: `other` 30,
`economy` 6, APPENDED after the first tranche's rows.

## Step 1: the placement and its measured gain (EXECUTED in DEPTH-2's line writer's container, 2026-11-20)

The tree: a detached worktree at `7fdc73bbb` (src identical to the line `43ab0f5eb`), with DEPTH-1's `measure/probe3.patch` (the
placeholder first tranche) committed detached; the chair's `bill.mjs` and `measures.mjs` (origin/lane/chair-2026-11-08
`docs/chair/2026-11-20/seventh/measures/owner-q3/`) beside DEPTH-1's `measure/born.mjs`. `bill.mjs` on the probe3 tree,
section (D), city, AFTER the first tranche (`measure-2/bill.probe3.out.txt`): share of the city's remaining cross-town repeats
by group, and where the second tranche goes.

| group | share of city repeats after tranche 1 (metropolis) | rows: line + tranche 1 | tranche 2 adds | rows after |
|---|---|---|---|---|
| tie: mutual_leverage | 18.7% (16.7%) | 8 + 14 | **17** | 39 |
| tie: peer_rivalry | 17.5% (19.3%) | 8 + 14 | **16** | 38 |
| tie: old_debt | 16.4% (19.8%) | 8 + 14 | **15** | 37 |
| tie: wary_alliance | 15.9% (12.4%) | 8 + 14 | **14** | 36 |
| tie: mentor_legacy | 12.6% (12.8%) | 8 + 12 | **10** | 30 |
| tie: genuine_respect | 8.3% (8.0%) | 8 + 12 | **5** | 25 |
| tie: family_complication · bitter_history | 5.5% · 4.6% (4.5% · 5.6%) | 8 · 8 | 0 | 8 · 8 |
| tie: every other archetype | under 0.5% each | | 0 | |
| hook: `other` | 51.2% (51.0%) | 40 + 30 | **30** | 100 |
| hook: `economy` | 18.1% (17.8%) | 24 + 14 | **6** | 44 |
| hook: `government` · `criminal` | 9.6% · 8.9% (12.2% · 6.7%) | 24 + 8 · 18 + 8 | 0 | 32 · 26 |
| hook: `religious` · `magic` · `military` | 4.9% · 3.6% · 3.5% | 18 · 8 · 24 | 0 | |

HOW PLACED: a group whose town prints `d` of its `n` rows repeats about `d²/n` across two towns, so its repeats fall as
`R·n/(n+k)` when `k` rows are added; the 77 pairs and 36 hooks are spread to equalise the marginal gain `R·n/(n+k)²` over the
groups, from the city's (D) shares above (the metropolis gives the same order). That optimum gives `government` and `criminal`
nothing (their marginal at their present size stays below `other`'s and `economy`'s after the adds; at metropolis it would give
`government` one). `family_complication` and `bitter_history` stand at a few percent (4.5-5.6% at city and metropolis) and are
left out as the brief says; the optimum would have given them 4 pairs each, worth about 0.4 point at city by the same model; and
every `bitter_history` description declares `trust: 'none'`, which WRITE-TIES rule 3 forbids a new line to state.

THE MEASURE: the probe extended with this placement (`measure-2/probe4.patch`, cumulative from `7fdc73bbb`: probe3's block
unchanged, then a second block appending letter-only placeholders, `PROBE second <archetype> d|t <letters>` pairs and
`PROBE second hook <pool> <letters>` hooks, each hook tagged in `AUTHORED_HOOK_THEMES` with EXACTLY the theme its real line
below carries), then `measures.mjs` on it (`measure-2/measures.probe4.out.txt`), section (A), PAIR share:

| size | ties: line -> after tranche 1 -> after tranche 2 | hooks: line -> after tranche 1 -> after tranche 2 |
|---|---|---|
| town | 35.4% -> 16.5% -> **11.1%** | 25.3% -> 17.1% -> **12.3%** |
| city | 62.8% -> 37.2% -> **23.6%** | 46.5% -> 31.5% -> **25.5%** |
| metropolis | 73.4% -> 48.9% -> **32.2%** | 63.5% -> 42.5% -> **35.0%** |

(The line's and probe3's figures are DEPTH-1's `measure/measures.line-43ab0f5eb.out.txt` and `measures.probe3.out.txt`;
REPRODUCED here: `measures.mjs` on the probe3 tree gives `measures.probe3.out.txt` byte for byte bar the timing line; every
other field of `measures.probe4.out.txt` (goals, secrets, the town tensions, section C) is byte-identical to the line's.)
The model above predicted 24.6% (ties) and 25.9% (hooks) at city. Placeholders reach every town (no
`needs`), so the real gain is at most this: PLAUSIBLE, not CONFIRMED, until the built lines are measured.

THE THEMES: each new hook takes a theme its pool already speaks, in about the pool's proportion over the line's rows and the
first tranche together (tables at the foot), never `corruption`, and leaning to the themes a city's OTHER cards rarely hold.
Measured on the probe4 births as first tagged (`measure-2/themetally.probe4.out.txt`, a city's 60 printed hooks; its
`measures.probe4-firsttags.out.txt` gave hooks 12.8 / 25.6 / 35.1% before two `other` tags were moved as below): betrayal 12.2% and
hidden_debt 10.7% are the commonest themes a city prints; secret_identity 2.2%, scarcity_pressure 1.9%, ambition 4.2% among the
rarest the two pools speak. So `other` takes hidden_debt 4 and betrayal 2 (below their weight in the pool, 16% and 10%) and
ambition 3 and secret_identity 3 (above it); none of smuggling, blackmail, crime_ring, corruption. Every line is a plain string
for `NPC_FACTION_LOYALTY.<pool>`, tagged with its bracketed theme in `src/domain/hookThemes.js :: AUTHORED_HOOK_THEMES`. Each
`beside` row is an existing row of the same pool, verbatim, the nearest in theme. No line is a near-copy of a line in the pool or
in HOOKS-1/HOOKS-2 (the first tranche, approved).

## `other` (40 rows in the line, 30 approved in the first tranche; 30 new)

1. NEW [hidden_debt] "They have eaten at a neighbour's table far more often than they have returned the favour, and have started declining with excuses."
   beside: [hidden_debt] "A document they were asked to witness contained a clause they noticed at the time and said nothing about."
   beside: [hidden_debt] "They lent their savings to a friend who has since left, and the friend's family says there was no loan."

2. NEW [old_wound] "They were passed over for something years ago in favour of a friend, and still cannot quite be glad for the friend."
   beside: [old_wound] "Something they were told had been burned has turned up for sale."
   beside: [old_wound] "Their predecessor left something behind (in a place where it shouldn't have been), and they haven't reported finding it."

3. NEW [betrayal] "A friend they once confided in has started making jokes that come a little too close to what they confided."
   beside: [betrayal] "Their oldest friend has started paying for drinks with new silver and will not say where it came from."
   beside: [betrayal] "A letter addressed to them was opened before it arrived, and the sender says it carried money."

4. NEW [rivalry] "A neighbour has begun keeping a better garden than theirs, and they have begun to mind more than they should."
   beside: [rivalry] "A neighbour has accused them of moving a fence, and the neighbour has witnesses who were not there."
   beside: [rivalry] "A tool they lent out came back broken, and the borrower insists it was broken when it left."

5. NEW [forbidden_knowledge] "They know the real reason two well-liked families stopped speaking, and are the only one outside both who does."
   beside: [forbidden_knowledge] "They overheard two people they know settle a bribe, and do not know whom to tell."
   beside: [forbidden_knowledge] "They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone."

6. NEW [outsider_suspicion] "A newcomer keeps asking them the way to places the newcomer has plainly been to already."
   beside: [outsider_suspicion] "Three different people have asked them the same unusual question. None of them knew each other."
   beside: [outsider_suspicion] "A traveller passed through asking which nights their door is left unbarred, and was gone by morning."

7. NEW [divided_loyalty] "A relative has asked them to take the relative's side in a family matter, and they think the relative is in the wrong."
   beside: [divided_loyalty] "Two neighbours have each asked them to stand witness in the same dispute, on opposite sides."
   beside: [betrayal] "Their oldest friend has started paying for drinks with new silver and will not say where it came from."

8. NEW [ambition] "They have started learning something new in private, and are embarrassed by how much they want to be good at it."
   beside: [ambition] "Their apprentice has been talking to a rival, and came back with an offer to buy them out."
   beside: [rivalry] "A neighbour has accused them of moving a fence, and the neighbour has witnesses who were not there."

9. NEW [secret_identity] "They have family elsewhere whom nobody here knows about, and a letter from them has just arrived where others could see it."
   beside: [secret_identity] "Someone keeps paying off their small debts around the place before they can, and has left no name."
   beside: [forbidden_knowledge] "They overheard two people they know settle a bribe, and do not know whom to tell."

10. NEW [hidden_debt] "They promised an old friend to keep an eye on the friend's child, and have not looked in for a long while."
   beside: [hidden_debt] "An inheritance they did not expect has arrived from a relative they never met, along with that relative's debts."
   beside: [hidden_debt] "Their best customer owes them a year's takings and has started avoiding their street."

11. NEW [old_wound] "Someone they once loved lives a few doors away with someone else, and they have not walked past that door in years."
   beside: [old_wound] "A child they took in as a favour has family who want the child back, and want paying for the years."
   beside: [old_wound] "They have been invited to the wedding of someone who once ruined their family, and refusing would be noticed."

12. NEW [betrayal] "They have learned that a friend spoke against them when they were not in the room, and the friend has no idea they know."
   beside: [betrayal] "They told a lie to protect a friend, and the friend is now repeating it to people who matter."
   beside: [betrayal] "Their partner in a small venture has disappeared with the takings and left the debts in their name."

13. NEW [rivalry] "They and a cousin have been quietly competing for an elderly relative's favour, and the relative has started to enjoy it."
   beside: [rivalry] "A neighbour's quarrel with them has gone before the people who settle disputes, and the hearing is next week."
   beside: [rivalry] "A neighbour has accused them of moving a fence, and the neighbour has witnesses who were not there."

14. NEW [forbidden_knowledge] "They know what an old saying around here first referred to, and it is not as harmless as people think."
   beside: [forbidden_knowledge] "They have seen the same unmarked cart pass their door three nights running, and have not wondered why."
   beside: [forbidden_knowledge] "They overheard two people they know settle a bribe, and do not know whom to tell."

15. NEW [outsider_suspicion] "Someone new to the place has asked them for an introduction to someone, and they can think of no good reason either to refuse or to agree."
   beside: [outsider_suspicion] "A cousin has arrived to stay without warning, and spends every day watching one particular house."
   beside: [outsider_suspicion] "Three different people have asked them the same unusual question. None of them knew each other."

16. NEW [divided_loyalty] "They have been asked to recommend a friend to someone they respect, and do not think the friend is up to it."
   beside: [divided_loyalty] "Two neighbours have each asked them to stand witness in the same dispute, on opposite sides."
   beside: [betrayal] "Their oldest friend has started paying for drinks with new silver and will not say where it came from."

17. NEW [ambition] "They have written something they are proud of, and are working up the courage to show it to someone whose opinion matters."
   beside: [ambition] "Their apprentice has been talking to a rival, and came back with an offer to buy them out."
   beside: [rivalry] "A neighbour has accused them of moving a fence, and the neighbour has witnesses who were not there."

18. NEW [secret_identity] "They are a good deal older than they let people think, and someone has just worked it out from a story they told."
   beside: [secret_identity] "Someone keeps paying off their small debts around the place before they can, and has left no name."
   beside: [forbidden_knowledge] "They overheard two people they know settle a bribe, and do not know whom to tell."

19. NEW [hidden_debt] "Someone covered their share of a gift to a mutual friend and has never brought it up, and they have never offered to settle it."
   beside: [hidden_debt] "A purse they found and kept has a rightful owner, and that owner has started asking around."
   beside: [hidden_debt] "A document they were asked to witness contained a clause they noticed at the time and said nothing about."

20. NEW [old_wound] "A harsh word a parent said to them long ago still decides things for them, and they have just caught themselves saying it to someone young."
   beside: [old_wound] "An old letter of theirs, written in anger years ago, has been shown to the person it was about."
   beside: [old_wound] "Something they were told had been burned has turned up for sale."

21. NEW [ambition] "They have been offered a small post of responsibility and want it badly, and are pretending to be undecided."
   beside: [ambition] "Their apprentice has been talking to a rival, and came back with an offer to buy them out."
   beside: [rivalry] "A neighbour has accused them of moving a fence, and the neighbour has witnesses who were not there."

22. NEW [rivalry] "Someone who arrived after them is already better liked by the very people they most wanted to impress."
   beside: [rivalry] "A tool they lent out came back broken, and the borrower insists it was broken when it left."
   beside: [rivalry] "A neighbour's quarrel with them has gone before the people who settle disputes, and the hearing is next week."

23. NEW [forbidden_knowledge] "They read a letter not meant for them, by accident, and now know something about a friend that the friend has not told them."
   beside: [forbidden_knowledge] "They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone."
   beside: [forbidden_knowledge] "They have seen the same unmarked cart pass their door three nights running, and have not wondered why."

24. NEW [outsider_suspicion] "Someone who settled here lately has started copying their hours, their habits and the way they speak, and seems not to know they have noticed."
   beside: [outsider_suspicion] "A traveller passed through asking which nights their door is left unbarred, and was gone by morning."
   beside: [outsider_suspicion] "A cousin has arrived to stay without warning, and spends every day watching one particular house."

25. NEW [divided_loyalty] "Two people they owe a kindness to want the same small thing from them, and only one of them can have it."
   beside: [divided_loyalty] "Two neighbours have each asked them to stand witness in the same dispute, on opposite sides."
   beside: [betrayal] "Their oldest friend has started paying for drinks with new silver and will not say where it came from."

26. NEW [vanished_person] "Someone they used to see in the same place every morning has not been there for some time, and nobody else seems to know the person's name."
   beside: [vanished_person] "A regular customer has stopped coming. The reason they've been given doesn't make sense."
   beside: [vanished_person] "Someone left an item in their care and hasn't returned. The item is valuable. The absence is now suspicious."

27. NEW [looming_threat] "A tree overhanging their roof grows worse each year, and the neighbour who owns it will not hear of cutting it back."
   beside: [looming_threat] "They saw an accident that was no accident, and the person responsible knows they saw it."
   beside: [looming_threat] "Someone has been asking the neighbours what time they leave in the morning and when they come home."

28. NEW [hidden_debt] "They were given a fine present they could not afford to match, and have been avoiding the giver ever since."
   beside: [hidden_debt] "They lent their savings to a friend who has since left, and the friend's family says there was no loan."
   beside: [hidden_debt] "An inheritance they did not expect has arrived from a relative they never met, along with that relative's debts."

29. NEW [old_wound] "They left home angry many years ago and never went back, and a letter has come asking whether they will."
   beside: [old_wound] "Their predecessor left something behind (in a place where it shouldn't have been), and they haven't reported finding it."
   beside: [old_wound] "A child they took in as a favour has family who want the child back, and want paying for the years."

30. NEW [secret_identity] "They speak a language nobody here knows they speak, and have just overheard two visitors talking in it."
   beside: [secret_identity] "Someone keeps paying off their small debts around the place before they can, and has left no name."
   beside: [forbidden_knowledge] "They overheard two people they know settle a bribe, and do not know whom to tell."


## `economy` (24 rows in the line, 14 approved in the first tranche; 6 new)

1. NEW [hidden_debt] "They were paid twice for the same piece of work by mistake, and have not yet found a good moment to say so."
   beside: [hidden_debt] "Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in."
   beside: [hidden_debt] "A contract they signed in difficult times has a clause they didn't fully read. Someone has read it."

2. NEW [rivalry] "Their oldest customer has started buying from a rival as well, and still comes to them for the difficult jobs."
   beside: [rivalry] "A business rival has offered them a partnership with terms so good it must be a trap. They can't find the trap."
   beside: [rivalry] "A rival has hired away their two best hands in one week, on wages the rival cannot afford for long."

3. NEW [betrayal] "A supplier they have dealt with for years has been giving a rival better prices, and they heard it from the rival."
   beside: [betrayal] "Their master craftsman is talking to a rival. They haven't confronted them. They're not sure what they'd do."
   beside: [betrayal] "Their bookkeeper has been taking a little from every sale for years, and the books balance only because the bookkeeper wrote them."

4. NEW [ambition] "They want to take on another pair of hands, and cannot tell whether the work will last or whether they simply want to be the sort who employs someone."
   beside: [ambition] "They have been slowly acquiring a controlling interest in a competitor through intermediaries. The competitor hasn't noticed yet."
   beside: [rivalry] "A business rival has offered them a partnership with terms so good it must be a trap. They can't find the trap."

5. NEW [scarcity_pressure] "They have more orders than they can fill, and have begun deciding whom to disappoint."
   beside: [scarcity_pressure] "They have promised the same order to two buyers, and both are due to collect on the same morning."
   beside: [hidden_debt] "Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in."

6. NEW [hidden_debt] "They owe a fellow worker in the same trade for materials borrowed in a hurry, and the price of those materials has since gone up."
   beside: [hidden_debt] "A partner died owing them money, and the partner's heir says the debt was paid in a letter nobody can find."
   beside: [hidden_debt] "A lender has bought the note on their shop and wants it settled by the end of the month."


## Themes: the new lines beside each pool's rows

### `other`

| theme | line (rows now) | first tranche (approved) | second tranche (new) | after both |
|---|---|---|---|---|
| hidden_debt | 5 | 6 | 4 | 15 |
| old_wound | 5 | 4 | 4 | 13 |
| betrayal | 5 | 2 | 2 | 9 |
| outsider_suspicion | 3 | 3 | 3 | 9 |
| forbidden_knowledge | 3 | 3 | 3 | 9 |
| rivalry | 3 | 3 | 3 | 9 |
| divided_loyalty | 1 | 3 | 3 | 7 |
| looming_threat | 4 | 0 | 1 | 5 |
| vanished_person | 3 | 1 | 1 | 5 |
| ambition | 1 | 3 | 3 | 7 |
| secret_identity | 1 | 2 | 3 | 6 |
| blackmail | 2 | 0 | 0 | 2 |
| smuggling | 2 | 0 | 0 | 2 |
| crime_ring | 1 | 0 | 0 | 1 |
| corruption | 1 | 0 | 0 | 1 |
| **total** | **40** | **30** | **30** | **100** |

### `economy`

| theme | line (rows now) | first tranche (approved) | second tranche (new) | after both |
|---|---|---|---|---|
| hidden_debt | 5 | 4 | 2 | 11 |
| rivalry | 4 | 3 | 1 | 8 |
| smuggling | 6 | 0 | 0 | 6 |
| betrayal | 3 | 2 | 1 | 6 |
| corruption | 3 | 1 | 0 | 4 |
| scarcity_pressure | 1 | 2 | 1 | 4 |
| ambition | 1 | 2 | 1 | 4 |
| crime_ring | 1 | 0 | 0 | 1 |
| **total** | **24** | **14** | **6** | **44** |


INTEGRATOR'S EDITS (DEPTH-2, 16:10 UTC by `date -u`, read line by line): other 15 "A newcomer has asked" -> "Someone new to the place has asked"; other 24 "A newcomer has started copying" -> "Someone who settled here lately has started copying" (three newcomers in one pool). Every other line as written; none tagged corruption.

THE CHAIR'S WORD (2026-11-20 16:22 UTC): 25 APPROVED AS WRITTEN (other 3, 5, 6, 7, 9-16, 21-26, 29, 30; economy 1, 2, 3, 5, 6). ELEVEN SENT BACK (other 1, 2, 4, 8, 17, 18, 19, 20, 27, 28; economy 4): A HOOK IS A LEAD A DM CAN USE TONIGHT (something has happened or is about to); their rewrites are HOOKS-3B.md. Only the 25 are built from this file.
