# HOOKS-4: the third tranche of person hooks (DEPTH-3's line writer, 2026-11-20)

For the brief `docs/chair/2026-11-20/content/depth/briefs/WRITE-HOOKS-4.md`, under the writing rules 1-6 of `../briefs/WRITE-HOOKS.md` word for word, the chair's rule of what a hook is (`HOOKS-3B.md`: a lead a DM can use tonight; something has just happened or is about to) and the rules the brief adds since tranche 1 (no hideable house, no crime, nothing the record may contradict, the `religious` / `succession` / `forbidden_love` / `vanished_person` / `looming_threat` limits, no `corruption` / `crime_ring` / `smuggling` / `blackmail`). The placement is MEASURE-3's proposal E (`../measure-3/MEASURE-3.md`, `placeE.json`), 60 hooks, each line in EXACTLY the theme its slot names, in the brief's order: `other` 20 (divided_loyalty 3, old_wound 3, hidden_debt 3, looming_threat 2, vanished_person 2, secret_identity 2, forbidden_knowledge 2, ambition 2, outsider_suspicion 1), `government` 12 (divided_loyalty 3, vanished_person 2, forbidden_knowledge 2, old_wound 2, outsider_suspicion 2, ambition 1), `economy` 10 (scarcity_pressure 3, ambition 2, hidden_debt 2, rivalry 2, betrayal 1), `religious` 10 (succession 3, forbidden_love 3, faith_crisis 2, secret_identity 1, looming_threat 1), `magic` 8 (looming_threat 2, forbidden_knowledge 3, vanished_person 1, outsider_suspicion 1, betrayal 1); none to `criminal`. Review lines only: nothing here is in a source file. Every line is a plain string to APPEND to `src/data/npcData.js :: NPC_FACTION_LOYALTY.<pool>`, tagged with its bracketed theme in `src/domain/hookThemes.js :: AUTHORED_HOOK_THEMES`. Each `beside` row is a row of the same pool as it stands in the source at `54d6787e0` (the line plus tranche 1; tranche 2's 36 approved lines are not yet in the source), verbatim, with the theme `themeOfText` gives it; where the pool holds a single row of the slot's theme, the second `beside` is the nearest other theme.

## `other` (70 rows in the source, 30 more approved in tranche 2; 20 new)

1. NEW [divided_loyalty] "Someone they owe a great kindness has asked them to carry word to a friend that the friend will not want to hear, and wants it carried tonight."
   beside: [divided_loyalty] "Two neighbours have each asked them to stand witness in the same dispute, on opposite sides."
   beside: [divided_loyalty] "Two old friends have fallen out, and each has asked them, separately, to stop seeing the other."

2. NEW [divided_loyalty] "A friend has asked them to come along to a meeting tomorrow and simply sit at the friend's side, and the meeting is with another friend of theirs."
   beside: [divided_loyalty] "Two old friends have fallen out, and each has asked them, separately, to stop seeing the other."
   beside: [divided_loyalty] "They know who is really behind a small embarrassment someone else is being teased for, and they like both people."

3. NEW [divided_loyalty] "Someone they have lately grown fond of has asked them plainly whom to be wary of nearby, and the honest answer is an old friend."
   beside: [divided_loyalty] "They have been asked to keep a confidence that someone they love has a right to hear."
   beside: [divided_loyalty] "Two neighbours have each asked them to stand witness in the same dispute, on opposite sides."

4. NEW [old_wound] "Someone they parted from on bitter terms long ago has sent back a thing they once gave, with no word attached."
   beside: [old_wound] "They keep a thing that belonged to someone they once wronged, and can bring themselves neither to return it nor to throw it away."
   beside: [old_wound] "Something they were told had been burned has turned up for sale."

5. NEW [old_wound] "An apology they have waited years for has finally arrived, and it gets the reason for the quarrel wrong."
   beside: [old_wound] "They have not spoken to someone who lives a short walk away for years, and neither of them remembers exactly why."
   beside: [old_wound] "An old letter of theirs, written in anger years ago, has been shown to the person it was about."

6. NEW [old_wound] "Someone has just repeated to them, word for word, a cruel thing they said long ago, without knowing who first said it."
   beside: [old_wound] "Someone they once made a fool of in front of others has come back to live nearby, and is perfectly polite."
   beside: [old_wound] "An old letter of theirs, written in anger years ago, has been shown to the person it was about."

7. NEW [hidden_debt] "Someone who once nursed them through a bad illness has just asked them for a week of their time, at the worst possible moment."
   beside: [hidden_debt] "They still owe a neighbour for a favour done years ago, and the neighbour has just mentioned it for the first time."
   beside: [hidden_debt] "They owe an old friend a day's work they keep putting off, and the friend has stopped asking, which is worse."

8. NEW [hidden_debt] "A friend has just repaid them a debt they had long forgotten, and asked in the same breath to borrow a much larger sum."
   beside: [hidden_debt] "They lent their savings to a friend who has since left, and the friend's family says there was no loan."
   beside: [hidden_debt] "They promised to pay back a small sum when things were easier, and things are easier now."

9. NEW [hidden_debt] "They pledged a sum toward something the neighbours are making together, and the one collecting the pledges is coming round tomorrow."
   beside: [hidden_debt] "They promised to pay back a small sum when things were easier, and things are easier now."
   beside: [hidden_debt] "They were asked to put in a good word for someone, said yes, and have not yet put the word in."

10. NEW [looming_threat] "A note was left under their door warning them not to sign anything this week, and they have been asked to sign something tomorrow."
   beside: [looming_threat] "Someone has been asking the neighbours what time they leave in the morning and when they come home."
   beside: [looming_threat] "They found a name scratched into their door overnight, and it belongs to someone who died last winter."

11. NEW [looming_threat] "A rumour has reached them that the ground beside their home is to be sold, and the buyer is said to be coming to look at it this week."
   beside: [looming_threat] "Someone has been asking the neighbours what time they leave in the morning and when they come home."
   beside: [looming_threat] "They saw an accident that was no accident, and the person responsible knows they saw it."

12. NEW [vanished_person] "A letter has come from someone they last heard from many years ago, sent from a place the writer always swore never to set foot in."
   beside: [vanished_person] "They have stopped hearing from a friend who moved away, and seem to be the only one who has noticed."
   beside: [vanished_person] "A regular customer has stopped coming. The reason they've been given doesn't make sense."

13. NEW [vanished_person] "A friend who went away years ago without a goodbye has been seen nearby by two different people, and has not yet come to their door."
   beside: [vanished_person] "They have stopped hearing from a friend who moved away, and seem to be the only one who has noticed."
   beside: [vanished_person] "Someone left an item in their care and hasn't returned. The item is valuable. The absence is now suspicious."

14. NEW [secret_identity] "A parcel has come for them addressed in a way only people from a very different life would know to use."
   beside: [secret_identity] "They go by a different name than the one they were born with, and someone has just called them by the old one."
   beside: [secret_identity] "Someone keeps paying off their small debts around the place before they can, and has left no name."

15. NEW [secret_identity] "An old portrait has come to light nearby, and the face in it is plainly theirs, in clothes they could never have afforded here."
   beside: [secret_identity] "They are better schooled than they let on, and have twice caught themselves correcting someone."
   beside: [secret_identity] "They go by a different name than the one they were born with, and someone has just called them by the old one."

16. NEW [forbidden_knowledge] "A map they bought for its frame has notes in the margin about a place nearby, in a hand they recognise."
   beside: [forbidden_knowledge] "They can read an old hand that nobody else nearby can, and have been asked to read something they wish they had not."
   beside: [forbidden_knowledge] "They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone."

17. NEW [forbidden_knowledge] "A friend has asked them to destroy a bundle of old letters unread, and the top one fell open before they could."
   beside: [forbidden_knowledge] "They know why a certain door nearby is always kept shut, and change the subject whenever it comes up."
   beside: [forbidden_knowledge] "They remember how a certain old agreement was really made, and are the last who do."

18. NEW [ambition] "Someone has offered to put up half the cost of something they have long wanted to start, if they can find the other half by the next new moon."
   beside: [ambition] "They have been quietly saving toward something they have never told anyone they want."
   beside: [ambition] "They have been offered a better place somewhere else, and have told no one they are thinking of going."

19. NEW [ambition] "They have been invited to a gathering where they know almost no one, and mean to leave with a promise from one of the guests."
   beside: [ambition] "They want a say in something they have always been left out of, and have begun turning up wherever it is talked over."
   beside: [ambition] "Their apprentice has been talking to a rival, and came back with an offer to buy them out."

20. NEW [outsider_suspicion] "Someone nobody knows has been writing down the names of everyone living nearby, and stopped at their door to ask how their name is spelled."
   beside: [outsider_suspicion] "Three different people have asked them the same unusual question. None of them knew each other."
   beside: [outsider_suspicion] "A stranger has taken lodging nearby and is far too interested in their old stories."

## `government` (32 rows; 12 new)

1. NEW [divided_loyalty] "The person who first spoke up for them has asked for their support on a matter coming before them tomorrow, and they think the matter should fail."
   beside: [divided_loyalty] "They have been asked to decide a small matter in which the one in the right is someone they cannot stand."
   beside: [divided_loyalty] "They received a deposition in a civil case that, if acted on, would be correct, and would ruin someone they need."

2. NEW [divided_loyalty] "Those who have always backed them have asked them to take their side tomorrow against people they have come to respect."
   beside: [divided_loyalty] "They have been asked to decide a small matter in which the one in the right is someone they cannot stand."
   beside: [divided_loyalty] "They know who committed a crime the guard is currently investigating. They're not telling the guard."

3. NEW [divided_loyalty] "They have been asked for an honest account of a colleague's work, and the colleague is the one who steadied them through their first months."
   beside: [divided_loyalty] "They received a deposition in a civil case that, if acted on, would be correct, and would ruin someone they need."
   beside: [divided_loyalty] "They have been asked to decide a small matter in which the one in the right is someone they cannot stand."

4. NEW [vanished_person] "Someone who did their work before them, and has not been heard from since leaving, has written to ask whether certain old papers were kept."
   beside: [vanished_person] "Their most trusted advisor hasn't been seen in four days. The official story changes each time it's told."
   beside: [vanished_person] "They were seen leaving a house they had no business in, on the night its owner disappeared."

5. NEW [vanished_person] "Someone who used to come to them with requests, and stopped after one answer they gave, has been seen nearby asking after them by name."
   beside: [vanished_person] "Their most trusted advisor hasn't been seen in four days. The official story changes each time it's told."
   beside: [vanished_person] "They were seen leaving a house they had no business in, on the night its owner disappeared."

6. NEW [forbidden_knowledge] "Among old papers passed to them for keeping, they have found a page that settles an old argument against a friend."
   beside: [forbidden_knowledge] "They know of a promise their predecessor made that was never written down, and are deciding whether to keep it."
   beside: [forbidden_knowledge] "A sealed letter arrived for them three weeks ago. They haven't opened it. They won't say why."

7. NEW [forbidden_knowledge] "They know, ahead of everyone, of a decision to be announced next week, and someone they owe a kindness has just asked them straight out whether it is coming."
   beside: [forbidden_knowledge] "A sealed letter arrived for them three weeks ago. They haven't opened it. They won't say why."
   beside: [forbidden_knowledge] "They know of a promise their predecessor made that was never written down, and are deciding whether to keep it."

8. NEW [old_wound] "Someone they once turned away, by the rules as they stood then, has come back to ask again now that the rules have changed."
   beside: [old_wound] "They made a decision early in their post that they still think was wrong, and nobody else seems to remember it."
   beside: [old_wound] "They signed an order last month on bad information, and the family it ruined has learned whose seal is on it."

9. NEW [old_wound] "Someone they once overruled has been going through their old decisions, one by one, and has asked to speak with them tomorrow."
   beside: [old_wound] "An old ruling of theirs is being used to take a widow's house, and they cannot undo it without admitting the mistake."
   beside: [old_wound] "They made a decision early in their post that they still think was wrong, and nobody else seems to remember it."

10. NEW [outsider_suspicion] "A visitor has asked to watch them at their work for a few days, carrying a letter of introduction from someone they have never heard of."
   beside: [outsider_suspicion] "They've been meeting privately with someone from outside the settlement whose identity they won't disclose."
   beside: [forbidden_knowledge] "A sealed letter arrived for them three weeks ago. They haven't opened it. They won't say why."

11. NEW [outsider_suspicion] "Someone new to the place has been asking the people they serve how they came to their role, and writing down the answers."
   beside: [outsider_suspicion] "They've been meeting privately with someone from outside the settlement whose identity they won't disclose."
   beside: [ambition] "Their deputy has started answering questions meant for them, and people have begun going to the deputy first."

12. NEW [ambition] "Someone of standing has hinted that a wider charge could be theirs if a matter now in their hands is settled well, and it is to be settled this week."
   beside: [ambition] "They have been drafting, in private, the changes they would make if they had a free hand."
   beside: [ambition] "Their deputy has started answering questions meant for them, and people have begun going to the deputy first."

## `economy` (38 rows in the source, 6 more approved in tranche 2; 10 new)

1. NEW [scarcity_pressure] "A buyer has just asked for twice their usual order, to be ready within the week, and they have the means for half of it."
   beside: [scarcity_pressure] "They have promised the same order to two buyers, and both are due to collect on the same morning."
   beside: [scarcity_pressure] "The only supplier of something they cannot work without has been slow lately, and they have no second source."

2. NEW [scarcity_pressure] "Something their work cannot do without has broken, and the only person who could mend it has quoted a month."
   beside: [scarcity_pressure] "The only supplier of something they cannot work without has been slow lately, and they have no second source."
   beside: [scarcity_pressure] "They are running low on something they always keep, and have started turning away small orders without saying why."

3. NEW [scarcity_pressure] "Someone has offered to buy their whole stock at a fair price tomorrow, which would leave nothing for the regulars who come next week."
   beside: [scarcity_pressure] "They are running low on something they always keep, and have started turning away small orders without saying why."
   beside: [scarcity_pressure] "They have promised the same order to two buyers, and both are due to collect on the same morning."

4. NEW [ambition] "They have been asked to supply a gift to pass between people of standing, and the one who asked hinted that more such orders would follow."
   beside: [ambition] "They want to be asked to supply someone important, and have been placing their best work where that person will see it."
   beside: [ambition] "They have been pricing up a second premises and have told no one, not even the people who work for them."

5. NEW [ambition] "Someone long in the same trade, ready to stop, has offered to pass them the best of that business, and wants an answer before the month is out."
   beside: [ambition] "They have been slowly acquiring a controlling interest in a competitor through intermediaries. The competitor hasn't noticed yet."
   beside: [ambition] "They have been pricing up a second premises and have told no one, not even the people who work for them."

6. NEW [hidden_debt] "They paid a supplier with a promise of goods instead of coin, and the supplier has just come to choose what to take."
   beside: [hidden_debt] "They took an advance on work they have not yet started, and the buyer has begun stopping by to look."
   beside: [hidden_debt] "They bought their best tools on credit from a rival, and the rival has been very patient."

7. NEW [hidden_debt] "Someone settled a bill of theirs unasked when times were lean, and has just asked them for a sizeable piece of work, at no charge."
   beside: [hidden_debt] "They still owe the person who set them up in trade for their first stock, and that person has never once asked."
   beside: [hidden_debt] "A partner died owing them money, and the partner's heir says the debt was paid in a letter nobody can find."

8. NEW [rivalry] "A rival has asked them, just this once, for the name of their best supplier, and it is for the very buyer they hoped to win."
   beside: [rivalry] "Someone newly set up in the same trade asked them for advice, and they gave it, and are beginning to regret it."
   beside: [rivalry] "A rival keeps sending them the customers the rival cannot serve, and they cannot work out whether it is kindness."

9. NEW [rivalry] "A buyer has shown them a rival's work and asked them to match it for less, and has let slip that the rival was asked the same about theirs."
   beside: [rivalry] "They and a rival quietly agreed not to undercut each other, and they suspect the rival has stopped keeping to it."
   beside: [rivalry] "A business rival has offered them a partnership with terms so good it must be a trap. They can't find the trap."

10. NEW [betrayal] "Someone who went halves with them on a large order has sold that half on to a rival without a word, and the rival has written to say so."
   beside: [betrayal] "They passed a trade secret to a friend years ago, and the friend now sells it as their own."
   beside: [betrayal] "A hand they trust has been taking work on the side from their own customers."

## `religious` (18 rows; 10 new)

1. NEW [succession] "The one the faithful have long gone to for counsel has asked them privately to be ready to take that place, and has told no one else."
   beside: [succession] "They know which of the current leadership will be the next to fall from grace. They are waiting."
   beside: [old_wound] "Their predecessor left a sealed letter to be opened at their death; it never was, and it is still where it was left."

2. NEW [succession] "Someone the faithful have long relied on to settle their disagreements is growing frail, and has just asked them to name who should take that on."
   beside: [succession] "They know which of the current leadership will be the next to fall from grace. They are waiting."
   beside: [old_wound] "Their predecessor left a sealed letter to be opened at their death; it never was, and it is still where it was left."

3. NEW [succession] "One of the younger faithful has asked to be taught all they know, so as to follow them one day, and others have heard of the request."
   beside: [succession] "They know which of the current leadership will be the next to fall from grace. They are waiting."
   beside: [secret_identity] "A novice has the gift. They know what that means for the novice. They're not sure what to do."

4. NEW [forbidden_love] "A letter has come from someone they cared for long ago, asking to meet once more, quietly, though those they serve would frown on it."
   beside: [forbidden_love] "They married a couple in secret at one family's request, and the other family has just found out."
   beside: [blackmail] "Someone has been reading the private letters kept in their care, and two of those letters were confessions."

5. NEW [forbidden_love] "Someone outside their faith has asked to walk with them when their duties are done, and some of the faithful have begun to notice the walks."
   beside: [forbidden_love] "They married a couple in secret at one family's request, and the other family has just found out."
   beside: [rivalry] "A preacher from outside has been drawing their congregation away, and saying things about them that are partly true."

6. NEW [forbidden_love] "They have kept a fond letter they ought to have returned unread, and its writer has asked to hear their answer tomorrow."
   beside: [forbidden_love] "They married a couple in secret at one family's request, and the other family has just found out."
   beside: [blackmail] "Someone has been reading the private letters kept in their care, and two of those letters were confessions."

7. NEW [faith_crisis] "Someone they counselled through a loss has written to thank them for words they no longer believe, and asks them to say the same to a friend."
   beside: [faith_crisis] "They have stopped believing, have told no one, and still lead the prayers every week."
   beside: [faith_crisis] "A healing they performed was successful in a way they cannot explain. It's happened twice now."

8. NEW [faith_crisis] "One of the faithful has put to them a matter that nothing their faith has taught them can answer, and is coming back tomorrow for the answer."
   beside: [faith_crisis] "They received a directive from the hierarchy that contradicts their own theology. Compliance is expected."
   beside: [faith_crisis] "A child in their care claims to hear the god speak, and the child has been right three times."

9. NEW [secret_identity] "Someone who knew them long before they served the faithful has recognised them, and has asked to speak with them alone."
   beside: [secret_identity] "A novice has the gift. They know what that means for the novice. They're not sure what to do."
   beside: [forbidden_knowledge] "A parishioner confessed something to them three months ago. The information is dangerous. They cannot act on it."

10. NEW [looming_threat] "An unsigned warning has reached them that something they said to the faithful has been repeated where it will be held against them."
   beside: [looming_threat] "Someone has been leaving offerings at the shrine that shouldn't be possible. The site has been sealed."
   beside: [betrayal] "A member of their congregation is systematically working against the faith. From inside it."

## `magic` (8 rows; 8 new)

1. NEW [looming_threat] "A colleague has written to warn them off a working they mean to attempt next week, without saying why, and promises the reasons in person."
   beside: [looming_threat] "They have two competing theories about what is happening to magic in this region. Both are alarming."
   beside: [looming_threat] "Something in the settlement is absorbing ambient magical energy. The readings are increasing."

2. NEW [looming_threat] "A date they marked in their notes long ago, for reasons they only half remember, falls next week."
   beside: [looming_threat] "Something in the settlement is absorbing ambient magical energy. The readings are increasing."
   beside: [looming_threat] "They have two competing theories about what is happening to magic in this region. Both are alarming."

3. NEW [forbidden_knowledge] "A book they bought for a single page turns out to hold a second page sewn into its binding that no one was meant to find."
   beside: [forbidden_knowledge] "An experiment failed in a way that shouldn't be possible. The results have been sealed. They're still thinking."
   beside: [forbidden_knowledge] "A student asked them a question three weeks ago that they still cannot answer, and the student has not asked again."

4. NEW [forbidden_knowledge] "A fellow practitioner has offered to trade them a working that the practitioner says nobody else knows, and the offer stands until tomorrow."
   beside: [forbidden_knowledge] "A student asked them a question three weeks ago that they still cannot answer, and the student has not asked again."
   beside: [forbidden_knowledge] "An experiment failed in a way that shouldn't be possible. The results have been sealed. They're still thinking."

5. NEW [forbidden_knowledge] "Someone has brought them an old charm to name, and they knew it at once as a thing they were taught never to make."
   beside: [forbidden_knowledge] "An experiment failed in a way that shouldn't be possible. The results have been sealed. They're still thinking."
   beside: [forbidden_knowledge] "A student asked them a question three weeks ago that they still cannot answer, and the student has not asked again."

6. NEW [vanished_person] "A practitioner they studied beside long ago and lost touch with has been seen nearby, asking quietly whether they still practise."
   beside: [vanished_person] "An old colleague has sent a message asking for a meeting. The colleague was declared dead six years ago."
   beside: [outsider_suspicion] "Someone has been making inquiries about their past research. Not the published work, the unpublished work."

7. NEW [outsider_suspicion] "A visitor has asked them to perform a small working in front of witnesses, saying only that someone far away wishes to know whether they are genuine."
   beside: [outsider_suspicion] "Someone has been making inquiries about their past research. Not the published work, the unpublished work."
   beside: [blackmail] "They've been approached by someone who knows things about their research that were never made public."

8. NEW [betrayal] "A working they taught one friend in confidence has just been shown off by someone else, who says the friend taught it freely."
   beside: [betrayal] "The ward on their vaults was not broken but bypassed, which only someone who knew how it was made could do."
   beside: [outsider_suspicion] "Someone has been making inquiries about their past research. Not the published work, the unpublished work."

## Themes: the new lines beside each pool's rows

### `other`

| theme | source now (line + tranche 1) | tranche 2 (approved, unbuilt) | new here | after |
|---|---|---|---|---|
| hidden_debt | 11 | 4 | 3 | 18 |
| old_wound | 9 | 4 | 3 | 16 |
| betrayal | 7 | 2 | 0 | 9 |
| forbidden_knowledge | 6 | 3 | 2 | 11 |
| outsider_suspicion | 6 | 3 | 1 | 10 |
| rivalry | 6 | 3 | 0 | 9 |
| divided_loyalty | 4 | 3 | 3 | 10 |
| looming_threat | 4 | 1 | 2 | 7 |
| vanished_person | 4 | 1 | 2 | 7 |
| ambition | 4 | 3 | 2 | 9 |
| secret_identity | 3 | 3 | 2 | 8 |
| blackmail | 2 | 0 | 0 | 2 |
| smuggling | 2 | 0 | 0 | 2 |
| corruption | 1 | 0 | 0 | 1 |
| crime_ring | 1 | 0 | 0 | 1 |
| **total** | **70** | **30** | **20** | **120** |

### `government`

| theme | source now | new here | after |
|---|---|---|---|
| corruption | 7 | 0 | 7 |
| old_wound | 4 | 2 | 6 |
| betrayal | 4 | 0 | 4 |
| divided_loyalty | 3 | 3 | 6 |
| hidden_debt | 3 | 0 | 3 |
| rivalry | 3 | 0 | 3 |
| forbidden_knowledge | 2 | 2 | 4 |
| vanished_person | 2 | 2 | 4 |
| ambition | 2 | 1 | 3 |
| outsider_suspicion | 1 | 2 | 3 |
| blackmail | 1 | 0 | 1 |
| **total** | **32** | **12** | **44** |

### `economy`

| theme | source now (line + tranche 1) | tranche 2 (approved, unbuilt) | new here | after |
|---|---|---|---|---|
| hidden_debt | 9 | 2 | 2 | 13 |
| rivalry | 7 | 1 | 2 | 10 |
| smuggling | 6 | 0 | 0 | 6 |
| betrayal | 5 | 1 | 1 | 7 |
| corruption | 4 | 0 | 0 | 4 |
| ambition | 3 | 1 | 2 | 6 |
| scarcity_pressure | 3 | 1 | 3 | 7 |
| crime_ring | 1 | 0 | 0 | 1 |
| **total** | **38** | **6** | **10** | **54** |

### `religious`

| theme | source now | new here | after |
|---|---|---|---|
| faith_crisis | 6 | 2 | 8 |
| blackmail | 2 | 0 | 2 |
| hidden_debt | 2 | 0 | 2 |
| succession | 1 | 3 | 4 |
| forbidden_love | 1 | 3 | 4 |
| secret_identity | 1 | 1 | 2 |
| looming_threat | 1 | 1 | 2 |
| forbidden_knowledge | 1 | 0 | 1 |
| old_wound | 1 | 0 | 1 |
| betrayal | 1 | 0 | 1 |
| rivalry | 1 | 0 | 1 |
| **total** | **18** | **10** | **28** |

### `magic`

| theme | source now | new here | after |
|---|---|---|---|
| forbidden_knowledge | 2 | 3 | 5 |
| looming_threat | 2 | 2 | 4 |
| vanished_person | 1 | 1 | 2 |
| outsider_suspicion | 1 | 1 | 2 |
| betrayal | 1 | 1 | 2 |
| blackmail | 1 | 0 | 1 |
| **total** | **8** | **8** | **16** |

## SELF-CHECK

`other`: 1 ok; 2 ok; 3 ok; 4 ok; 5 ok; 6 ok; 7 ok (an illness long past, no event now); 8 ok; 9 ok; 10 looming_threat limit (an unsigned warning is the line's whole lead; nothing befalls them); 11 ok (a rumour and a date; "their home" presumes a dwelling, not a household); 12 ok; 13 ok; 14 ok; 15 ok; 16 ok; 17 ok; 18 ok ("new moon" is a time, not magic or weather); 19 ok; 20 ok.

`government`: 1 ok; 2 ok; 3 ok ("colleague", as tranche 1's approved government rows); 4 ok; 5 ok; 6 ok; 7 ok; 8 ok; 9 ok; 10 ok; 11 ok; 12 ok.

`economy`: 1 ok; 2 rule 2 strain (a "tool" presumes a working trade; a pure dealer keeps scales, not tools; tranche 1's approved "best tools" carries the same presumption); 3 ok; 4 ok; 5 ok; 6 ok; 7 ok; 8 ok ("design" presumes a made thing); 9 ok; 10 ok.

`religious`: 1 ok; 2 ok; 3 ok; 4 forbidden_love limit ("before they took their vows" presumes vows; the brief names their vows); 5 ok; 6 ok; 7 ok; 8 ok; 9 ok ("before they came to their faith" presumes a coming to it, not a birthplace or kin); 10 ok.

`magic`: 1 ok; 2 ok; 3 ok; 4 ok; 5 ok; 6 ok; 7 ok; 8 ok.

INTEGRATOR'S EDITS (DEPTH-3, 18:26 UTC by `date -u`, all sixty read line by line; themes unchanged, so MEASURE-3 stands):
economy 2 "Their best tool has cracked…" -> "Something their work cannot do without has broken…" (a trader holds no tool; rule 2).
economy 8 "…to borrow a design of theirs once…" -> "…to borrow one of their designs just this once…" (grammar).
religious 4 "…cared for before they took their vows…" -> "…cared for long ago, asking to meet once more, quietly, though those they serve
would frown on it." (vows are a fact the record may contradict). religious 9 "…knew them before they came to their faith…" -> "…knew them
long before they served the faithful…" (a conversion the record may contradict). Watched, kept: other 10 (a warning, nothing happens);
other 18 "by the next new moon" (a date, not a season); government 9 (a review of old decisions, not an inquiry into a crime).

THE CHAIR'S VERDICT (18:39 UTC; applied in place at 18:38 UTC by `date -u`): ALL 60 APPROVED; the placement by theme stands; the integrator's four
edits stand, except economy 8, which the chair rewords. Four reworded by the chair (a line must not presume a rank, an overseer or a trade the
card may not have): other 19 "They have been invited to a gathering where they know almost no one, and mean to leave with a promise from one
of the guests."; government 7 begins "They know, ahead of everyone, of a decision to be announced next week, ..."; government 9 "Someone they
once overruled has been going through their old decisions, one by one, and has asked to speak with them tomorrow."; economy 8 "A rival has
asked them, just this once, for the name of their best supplier, and it is for the very buyer they hoped to win." The economy/crime_ring
single line stays as it is: a named survivor (about one point of a metropolis's repeats).
