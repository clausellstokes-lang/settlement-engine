# HOOKS-2: new person hooks for `economy` and `criminal`

DEPTH-1's hook writer, 2026-11-20, for the brief `docs/chair/2026-11-20/content/depth/briefs/WRITE-HOOKS.md`. Review lines only: nothing here is in a source file. Every new line is a plain string to APPEND to `src/data/npcData.js :: NPC_FACTION_LOYALTY.<group>`, tagged with the bracketed theme in `src/domain/hookThemes.js :: AUTHORED_HOOK_THEMES`; each theme is one the group's existing rows already carry (`themeOfText`). Each `beside` row is an existing row of the same group, verbatim, the nearest in theme.

Groups: `economy` 14, `criminal` 8.

## `economy` (24 existing rows; 14 new)

1. NEW [hidden_debt] "They have been giving one regular customer credit long past what is sensible, because of an old kindness."
   beside: [hidden_debt] "Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in."
   beside: [hidden_debt] "A contract they signed in difficult times has a clause they didn't fully read. Someone has read it."

2. NEW [hidden_debt] "They still owe the person who set them up in trade for their first stock, and that person has never once asked."
   beside: [hidden_debt] "A partner died owing them money, and the partner's heir says the debt was paid in a letter nobody can find."
   beside: [hidden_debt] "A lender has bought the note on their shop and wants it settled by the end of the month."

3. NEW [hidden_debt] "They took an advance on work they have not yet started, and the buyer has begun stopping by to look."
   beside: [hidden_debt] "They have quietly stopped paying a supplier who cannot afford to take them to law."
   beside: [hidden_debt] "Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in."

4. NEW [hidden_debt] "They bought their best tools on credit from a rival, and the rival has been very patient."
   beside: [hidden_debt] "A contract they signed in difficult times has a clause they didn't fully read. Someone has read it."
   beside: [hidden_debt] "A partner died owing them money, and the partner's heir says the debt was paid in a letter nobody can find."

5. NEW [rivalry] "A rival keeps sending them the customers the rival cannot serve, and they cannot work out whether it is kindness."
   beside: [rivalry] "A business rival has offered them a partnership with terms so good it must be a trap. They can't find the trap."
   beside: [rivalry] "A rival has hired away their two best hands in one week, on wages the rival cannot afford for long."

6. NEW [rivalry] "They and a rival quietly agreed not to undercut each other, and they suspect the rival has stopped keeping to it."
   beside: [rivalry] "A family they put out of business has opened again under a new name, two doors down."
   beside: [rivalry] "Someone has been selling cheaper and worse goods under their mark, and customers are blaming them."

7. NEW [rivalry] "Someone newly set up in the same trade asked them for advice, and they gave it, and are beginning to regret it."
   beside: [rivalry] "A business rival has offered them a partnership with terms so good it must be a trap. They can't find the trap."
   beside: [rivalry] "A rival has hired away their two best hands in one week, on wages the rival cannot afford for long."

8. NEW [betrayal] "A hand they trust has been taking work on the side from their own customers."
   beside: [betrayal] "Their master craftsman is talking to a rival. They haven't confronted them. They're not sure what they'd do."
   beside: [betrayal] "Their bookkeeper has been taking a little from every sale for years, and the books balance only because the bookkeeper wrote them."

9. NEW [betrayal] "They passed a trade secret to a friend years ago, and the friend now sells it as their own."
   beside: [betrayal] "Their apprentice has been offered a partnership by a rival, on condition that the apprentice brings the recipes."
   beside: [betrayal] "Their master craftsman is talking to a rival. They haven't confronted them. They're not sure what they'd do."

10. NEW [ambition] "They have been pricing up a second premises and have told no one, not even the people who work for them."
   beside: [ambition] "They have been slowly acquiring a controlling interest in a competitor through intermediaries. The competitor hasn't noticed yet."
   beside: [rivalry] "A family they put out of business has opened again under a new name, two doors down."

11. NEW [ambition] "They want to be asked to supply someone important, and have been placing their best work where that person will see it."
   beside: [ambition] "They have been slowly acquiring a controlling interest in a competitor through intermediaries. The competitor hasn't noticed yet."
   beside: [rivalry] "Someone has been selling cheaper and worse goods under their mark, and customers are blaming them."

12. NEW [scarcity_pressure] "The only supplier of something they cannot work without has been slow lately, and they have no second source."
   beside: [scarcity_pressure] "They have promised the same order to two buyers, and both are due to collect on the same morning."
   beside: [hidden_debt] "A lender has bought the note on their shop and wants it settled by the end of the month."

13. NEW [scarcity_pressure] "They are running low on something they always keep, and have started turning away small orders without saying why."
   beside: [scarcity_pressure] "They have promised the same order to two buyers, and both are due to collect on the same morning."
   beside: [hidden_debt] "They have quietly stopped paying a supplier who cannot afford to take them to law."

14. NEW [corruption] "They give a standing gift to someone whose good word keeps their trade steady, and have stopped thinking of it as a gift."
   beside: [corruption] "They have evidence of price-fixing across the whole market. Publishing it helps their competition as much as their customers."
   beside: [corruption] "They sold a batch they knew was bad, and the customer it sickened is now asking who supplied it."

## `criminal` (18 existing rows; 8 new)

1. NEW [hidden_debt] "They owe a favour to someone who has since gone respectable, and have no idea what a respectable person will ask for."
   beside: [hidden_debt] "A debt they called in was paid by someone they have never met, and that person now wants to meet."
   beside: [betrayal] "One of their people is talking to the guard. They don't know which one yet. They're watching."

2. NEW [divided_loyalty] "They are fond of someone who would cut them off entirely if they knew how they make their living."
   beside: [divided_loyalty] "They're protecting someone from something worse. The someone doesn't know and wouldn't thank them."
   beside: [betrayal] "A job went wrong in a way that suggests information was leaked. They have three suspects."

3. NEW [old_wound] "They keep one thing that passed through their hands that they will not sell at any price, and will not say why."
   beside: [old_wound] "A family they once ruined has a son who has just come of age, and he has started asking where they sleep."
   beside: [betrayal] "A load of theirs was taken on the road by people who knew the day, the route and the password."

4. NEW [ambition] "They have been putting money into something honest, and wonder whether the people they know will let them leave."
   beside: [ambition] "Two of their people have started running jobs of their own, and are telling newer hands that the old boss is finished."
   beside: [rivalry] "A rival crew has offered peace, and the offer arrived on the same day one of their people went missing."

5. NEW [rivalry] "Someone in the same line of work keeps being called better at it, and they have started to take it personally."
   beside: [rivalry] "A rival crew has offered peace, and the offer arrived on the same day one of their people went missing."
   beside: [ambition] "Two of their people have started running jobs of their own, and are telling newer hands that the old boss is finished."

6. NEW [betrayal] "They once gave someone up to save themselves, and that person has never found out and still trusts them."
   beside: [betrayal] "Someone in their own crew has been skimming, and the sum matches exactly what a rival is now spending."
   beside: [betrayal] "One of their people is talking to the guard. They don't know which one yet. They're watching."

7. NEW [betrayal] "An old associate has started being friendly with people they avoid, and has stopped mentioning it."
   beside: [betrayal] "A job went wrong in a way that suggests information was leaked. They have three suspects."
   beside: [betrayal] "A load of theirs was taken on the road by people who knew the day, the route and the password."

8. NEW [outsider_suspicion] "A face they cannot place keeps turning up where they spend their evenings, and they have started taking the long way home."
   beside: [outsider_suspicion] "The same new face has turned up at three of their jobs, and they have put someone on to follow the newcomer."
   beside: [looming_threat] "Someone tried to rob them, and did it like a professional: no noise, the lock picked, nothing touched but the strongbox."

## Themes: new lines beside each group's existing rows

### `economy`

| theme | new | existing |
|---|---|---|
| hidden_debt | 4 | 5 |
| smuggling | 0 | 6 |
| rivalry | 3 | 4 |
| betrayal | 2 | 3 |
| corruption | 1 | 3 |
| scarcity_pressure | 2 | 1 |
| crime_ring | 0 | 1 |
| ambition | 2 | 1 |
| **total** | **14** | **24** |

### `criminal`

| theme | new | existing |
|---|---|---|
| hidden_debt | 1 | 1 |
| divided_loyalty | 1 | 1 |
| smuggling | 0 | 2 |
| rivalry | 1 | 1 |
| betrayal | 2 | 4 |
| corruption | 0 | 2 |
| vanished_person | 0 | 1 |
| old_wound | 1 | 1 |
| looming_threat | 0 | 2 |
| crime_ring | 0 | 1 |
| outsider_suspicion | 1 | 1 |
| ambition | 1 | 1 |
| **total** | **8** | **18** |



INTEGRATOR'S EDITS (DEPTH-1, read line by line before sending): "A hand they trust has been quietly taking work on the side from their own customers." -> "A hand they trust has been taking work on the side from their own customers."; "They are running low on something they always keep, and have quietly started turning away small orders." -> "They are running low on something they always keep, and have started turning away small orders without saying why."; "They have been quietly putting money into something honest, and wonder whether the people they know will let them leave." -> "They have been putting money into something honest, and wonder whether the people they know will let them leave.".
