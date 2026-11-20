# HOOKS-1: new person hooks for `other` and `government`

DEPTH-1's hook writer, 2026-11-20, for the brief `docs/chair/2026-11-20/content/depth/briefs/WRITE-HOOKS.md`. Review lines only: nothing here is in a source file. Every new line is a plain string to APPEND to `src/data/npcData.js :: NPC_FACTION_LOYALTY.<group>`, tagged with the bracketed theme in `src/domain/hookThemes.js :: AUTHORED_HOOK_THEMES`; each theme is one the group's existing rows already carry (`themeOfText`). Each `beside` row is an existing row of the same group, verbatim, the nearest in theme.

Groups: `other` 30, `government` 8.

## `other` (40 existing rows; 30 new)

1. NEW [hidden_debt] "They still owe a neighbour for a favour done years ago, and the neighbour has just mentioned it for the first time."
   beside: [hidden_debt] "A document they were asked to witness contained a clause they noticed at the time and said nothing about."
   beside: [hidden_debt] "They lent their savings to a friend who has since left, and the friend's family says there was no loan."

2. NEW [hidden_debt] "They borrowed a good coat for an occasion and never gave it back, and its owner has taken to wearing a worse one."
   beside: [hidden_debt] "An inheritance they did not expect has arrived from a relative they never met, along with that relative's debts."
   beside: [hidden_debt] "Their best customer owes them a year's takings and has started avoiding their street."

3. NEW [hidden_debt] "They promised to pay back a small sum when things were easier, and things are easier now."
   beside: [hidden_debt] "A purse they found and kept has a rightful owner, and that owner has started asking around."
   beside: [hidden_debt] "A document they were asked to witness contained a clause they noticed at the time and said nothing about."

4. NEW [hidden_debt] "They took a loan from a neighbour on the promise of a hand at busy times, and keep finding reasons to be busy themselves."
   beside: [hidden_debt] "They lent their savings to a friend who has since left, and the friend's family says there was no loan."
   beside: [hidden_debt] "An inheritance they did not expect has arrived from a relative they never met, along with that relative's debts."

5. NEW [hidden_debt] "They owe an old friend a day's work they keep putting off, and the friend has stopped asking, which is worse."
   beside: [hidden_debt] "Their best customer owes them a year's takings and has started avoiding their street."
   beside: [hidden_debt] "A purse they found and kept has a rightful owner, and that owner has started asking around."

6. NEW [old_wound] "They have not spoken to someone who lives a short walk away for years, and neither of them remembers exactly why."
   beside: [old_wound] "Something they were told had been burned has turned up for sale."
   beside: [old_wound] "Their predecessor left something behind (in a place where it shouldn't have been), and they haven't reported finding it."

7. NEW [old_wound] "They keep a thing that belonged to someone they once wronged, and can bring themselves neither to return it nor to throw it away."
   beside: [old_wound] "A child they took in as a favour has family who want the child back, and want paying for the years."
   beside: [old_wound] "They have been invited to the wedding of someone who once ruined their family, and refusing would be noticed."

8. NEW [old_wound] "Someone they once made a fool of in front of others has come back to live nearby, and is perfectly polite."
   beside: [old_wound] "An old letter of theirs, written in anger years ago, has been shown to the person it was about."
   beside: [old_wound] "Something they were told had been burned has turned up for sale."

9. NEW [old_wound] "They were blamed long ago for a mistake that was not theirs, and the one who made it is still well thought of."
   beside: [old_wound] "Their predecessor left something behind (in a place where it shouldn't have been), and they haven't reported finding it."
   beside: [old_wound] "A child they took in as a favour has family who want the child back, and want paying for the years."

10. NEW [rivalry] "They and a neighbour have been trying to outdo each other's generosity, and it has stopped being friendly."
   beside: [rivalry] "A neighbour has accused them of moving a fence, and the neighbour has witnesses who were not there."
   beside: [rivalry] "A tool they lent out came back broken, and the borrower insists it was broken when it left."

11. NEW [rivalry] "Someone keeps telling the same story they tell, a little better, to the same listeners."
   beside: [rivalry] "A neighbour's quarrel with them has gone before the people who settle disputes, and the hearing is next week."
   beside: [rivalry] "A neighbour has accused them of moving a fence, and the neighbour has witnesses who were not there."

12. NEW [rivalry] "They lost a small wager years ago, and the winner still brings it up whenever others are listening."
   beside: [rivalry] "A tool they lent out came back broken, and the borrower insists it was broken when it left."
   beside: [rivalry] "A neighbour's quarrel with them has gone before the people who settle disputes, and the hearing is next week."

13. NEW [divided_loyalty] "Two old friends have fallen out, and each has asked them, separately, to stop seeing the other."
   beside: [divided_loyalty] "Two neighbours have each asked them to stand witness in the same dispute, on opposite sides."
   beside: [betrayal] "Their oldest friend has started paying for drinks with new silver and will not say where it came from."

14. NEW [divided_loyalty] "They know who is really behind a small embarrassment someone else is being teased for, and they like both people."
   beside: [divided_loyalty] "Two neighbours have each asked them to stand witness in the same dispute, on opposite sides."
   beside: [betrayal] "A letter addressed to them was opened before it arrived, and the sender says it carried money."

15. NEW [divided_loyalty] "They have been asked to keep a confidence that someone they love has a right to hear."
   beside: [divided_loyalty] "Two neighbours have each asked them to stand witness in the same dispute, on opposite sides."
   beside: [betrayal] "They told a lie to protect a friend, and the friend is now repeating it to people who matter."

16. NEW [ambition] "They have been quietly saving toward something they have never told anyone they want."
   beside: [ambition] "Their apprentice has been talking to a rival, and came back with an offer to buy them out."
   beside: [rivalry] "A neighbour has accused them of moving a fence, and the neighbour has witnesses who were not there."

17. NEW [ambition] "They have been offered a better place somewhere else, and have told no one they are thinking of going."
   beside: [ambition] "Their apprentice has been talking to a rival, and came back with an offer to buy them out."
   beside: [rivalry] "A tool they lent out came back broken, and the borrower insists it was broken when it left."

18. NEW [ambition] "They want a say in something they have always been left out of, and have begun turning up wherever it is talked over."
   beside: [ambition] "Their apprentice has been talking to a rival, and came back with an offer to buy them out."
   beside: [rivalry] "A neighbour's quarrel with them has gone before the people who settle disputes, and the hearing is next week."

19. NEW [forbidden_knowledge] "They can read an old hand that nobody else nearby can, and have been asked to read something they wish they had not."
   beside: [forbidden_knowledge] "They overheard two people they know settle a bribe, and do not know whom to tell."
   beside: [forbidden_knowledge] "They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone."

20. NEW [forbidden_knowledge] "They remember how a certain old agreement was really made, and are the last who do."
   beside: [forbidden_knowledge] "They have seen the same unmarked cart pass their door three nights running, and have not wondered why."
   beside: [forbidden_knowledge] "They overheard two people they know settle a bribe, and do not know whom to tell."

21. NEW [forbidden_knowledge] "They know why a certain door nearby is always kept shut, and change the subject whenever it comes up."
   beside: [forbidden_knowledge] "They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone."
   beside: [forbidden_knowledge] "They have seen the same unmarked cart pass their door three nights running, and have not wondered why."

22. NEW [outsider_suspicion] "A stranger has taken lodging nearby and is far too interested in their old stories."
   beside: [outsider_suspicion] "Three different people have asked them the same unusual question. None of them knew each other."
   beside: [outsider_suspicion] "A traveller passed through asking which nights their door is left unbarred, and was gone by morning."

23. NEW [outsider_suspicion] "They came here from elsewhere long ago, and some of their neighbours still lower their voices when they pass."
   beside: [outsider_suspicion] "A cousin has arrived to stay without warning, and spends every day watching one particular house."
   beside: [outsider_suspicion] "Three different people have asked them the same unusual question. None of them knew each other."

24. NEW [outsider_suspicion] "They have taken a liking to a visitor nobody else trusts, and their neighbours have noticed."
   beside: [outsider_suspicion] "A traveller passed through asking which nights their door is left unbarred, and was gone by morning."
   beside: [outsider_suspicion] "A cousin has arrived to stay without warning, and spends every day watching one particular house."

25. NEW [secret_identity] "They go by a different name than the one they were born with, and someone has just called them by the old one."
   beside: [secret_identity] "Someone keeps paying off their small debts around the place before they can, and has left no name."
   beside: [forbidden_knowledge] "They overheard two people they know settle a bribe, and do not know whom to tell."

26. NEW [secret_identity] "They are better schooled than they let on, and have twice caught themselves correcting someone."
   beside: [secret_identity] "Someone keeps paying off their small debts around the place before they can, and has left no name."
   beside: [forbidden_knowledge] "They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone."

27. NEW [betrayal] "They repeated something told them in confidence, and it has come back round to the person who told them."
   beside: [betrayal] "Their partner in a small venture has disappeared with the takings and left the debts in their name."
   beside: [betrayal] "Their savings were hidden in a place only one other person knew, and the savings are gone."

28. NEW [betrayal] "A friend they vouched for has let them down in a small way, and others remember whose word it was."
   beside: [betrayal] "Their oldest friend has started paying for drinks with new silver and will not say where it came from."
   beside: [betrayal] "A letter addressed to them was opened before it arrived, and the sender says it carried money."

29. NEW [vanished_person] "They have stopped hearing from a friend who moved away, and seem to be the only one who has noticed."
   beside: [vanished_person] "A regular customer has stopped coming. The reason they've been given doesn't make sense."
   beside: [vanished_person] "Someone left an item in their care and hasn't returned. The item is valuable. The absence is now suspicious."

30. NEW [corruption] "They were given a little extra to put in a good word for someone, and have not yet put the word in."
   beside: [corruption] "They've been offered money to not ask questions about something they hadn't even started asking about."
   beside: [hidden_debt] "A document they were asked to witness contained a clause they noticed at the time and said nothing about."

## `government` (24 existing rows; 8 new)

1. NEW [corruption] "They have quietly favoured one household in small matters for years, out of an old kindness, and others have started to notice."
   beside: [corruption] "They've been quietly buying up property in a district that hasn't been announced as a development site. Yet."
   beside: [corruption] "Someone has been leaving anonymous notes in their office pointing to a colleague's corruption. The notes are accurate."

2. NEW [old_wound] "They made a decision early in their post that they still think was wrong, and nobody else seems to remember it."
   beside: [old_wound] "One of their staff has started asking questions about records from seven years ago. They've been reassigned twice already."
   beside: [old_wound] "They signed an order last month on bad information, and the family it ruined has learned whose seal is on it."

3. NEW [divided_loyalty] "They have been asked to decide a small matter in which the one in the right is someone they cannot stand."
   beside: [divided_loyalty] "They know who committed a crime the guard is currently investigating. They're not telling the guard."
   beside: [divided_loyalty] "They received a deposition in a civil case that, if acted on, would be correct, and would ruin someone they need."

4. NEW [hidden_debt] "They owe their place partly to the word of someone now out of favour, and have never said so."
   beside: [hidden_debt] "A routine appointment they made three weeks ago has been rescheduled four times. Each time they initiated the change."
   beside: [hidden_debt] "They owe their post to a patron who has started asking for repayment in favours they cannot grant openly."

5. NEW [rivalry] "They and a colleague remember the same old agreement differently, and both have begun to say so in front of others."
   beside: [rivalry] "A petition they set aside has gathered names from half their street, and the people who signed it want an answer this week."
   beside: [rivalry] "They promised the same post to two people, and both have already told their families."

6. NEW [ambition] "They have been drafting, in private, the changes they would make if they had a free hand."
   beside: [ambition] "Their deputy has started answering questions meant for them, and people have begun going to the deputy first."
   beside: [rivalry] "A petition they set aside has gathered names from half their street, and the people who signed it want an answer this week."

7. NEW [forbidden_knowledge] "They know of a promise their predecessor made that was never written down, and are deciding whether to keep it."
   beside: [forbidden_knowledge] "A sealed letter arrived for them three weeks ago. They haven't opened it. They won't say why."
   beside: [old_wound] "An old ruling of theirs is being used to take a widow's house, and they cannot undo it without admitting the mistake."

8. NEW [betrayal] "A colleague they taught has started taking credit for their work, politely and in front of the right people."
   beside: [betrayal] "Someone who publicly supports them is being paid by someone who opposes them. They know this."
   beside: [betrayal] "A clerk in their office has been copying letters at night, and the copies have turned up in a rival's hands."

## Themes: new lines beside each group's existing rows

### `other`

| theme | new | existing |
|---|---|---|
| hidden_debt | 5 | 5 |
| secret_identity | 2 | 1 |
| divided_loyalty | 3 | 1 |
| smuggling | 0 | 2 |
| blackmail | 0 | 2 |
| rivalry | 3 | 3 |
| betrayal | 2 | 5 |
| corruption | 1 | 1 |
| vanished_person | 1 | 3 |
| forbidden_knowledge | 3 | 3 |
| old_wound | 4 | 5 |
| looming_threat | 0 | 4 |
| crime_ring | 0 | 1 |
| outsider_suspicion | 3 | 3 |
| ambition | 3 | 1 |
| **total** | **30** | **40** |

### `government`

| theme | new | existing |
|---|---|---|
| hidden_debt | 1 | 2 |
| divided_loyalty | 1 | 2 |
| blackmail | 0 | 1 |
| rivalry | 1 | 2 |
| betrayal | 1 | 3 |
| corruption | 1 | 6 |
| vanished_person | 0 | 2 |
| forbidden_knowledge | 1 | 1 |
| old_wound | 1 | 3 |
| outsider_suspicion | 0 | 1 |
| ambition | 1 | 1 |
| **total** | **8** | **24** |



INTEGRATOR'S EDITS (DEPTH-1, read line by line before sending): "They agreed to look after a neighbour's animals in return for a loan, and have been doing it badly." -> "They took a loan from a neighbour on the promise of a hand at busy times, and keep finding reasons to be busy themselves."; "They got their post partly on the word of someone now out of favour, and have never said so." -> "They owe their place partly to the word of someone now out of favour, and have never said so.".
