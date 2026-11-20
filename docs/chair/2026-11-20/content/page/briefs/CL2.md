# CL2: the causes' lines, the six other kinds. PAGE-7's brief, written 2026-11-20 14:42 UTC. IT REPLACES CL1.

THE CHAIR, 14:42 UTC: crime_wave and guild_conflict are PAGE-5's builder's (`briefs/CAUSE-LINES-1.md`, origin
lane/page-5-2026-11-20 at 4f48cd6e4). YOU WRITE NONE OF THEM. You write TWO files, in this order:
- `docs/chair/2026-11-20/content/page/lines/CAUSES-LINES-A.md`: resource_scarcity, external_threat, succession_crisis.
- `docs/chair/2026-11-20/content/page/lines/CAUSES-LINES-B.md`: outside_debt, legitimacy_crisis, great_flood.
If you already wrote crime_wave/guild_conflict lines, delete that file (CAUSES-LINES-batch1.md); it is not used.

Everything in `briefs/CL1.md` binds (read it; its rules 1-6 and the file's shape), EXCEPT its kinds. The ruled tables,
rates and the 14:33 ruling are in the hand-back at 4f48cd6e4, section 5:
`git show 4f48cd6e4:docs/chair/2026-11-20/content/page/PAGE-5-HANDBACK.md`. RE-RUN NO MEASURE.

FOR THESE SIX KINDS:
- Wordings: THREE for a cause listed in that section's `WORDS` (resource_scarcity:war_levy, external_threat:old_threat,
  external_threat:war, legitimacy_crisis:rival_power, outside_debt:creditors_sit, great_flood:river,
  succession_crisis:old_succession), TWO for every other cause; THREE plain wordings a kind, FOUR for great_flood.
- A past event of the same kind (old_scarcity, old_threat, old_succession, old_debt, old_flood) is rank 1 and its line
  says the trouble has come before and is here again, naming no date, no count, no person and no detail of that past
  the record does not give (look at what `history.historicalEvents` entries carry: if a field gives the time ago or a
  name, you may use only that, through a slot you declare, e.g. `{yearsAgo}`; otherwise use none).
- great_flood: its plain wordings name NO river and NO coast and no rising sea (half its towns have no water: PAGE-5's
  surprise); they speak of floodwater/rain/the low ground only if every town has some, else of the flood as a trouble
  the town fears or is recovering from as the stored sentence frames it. Read the stored sentence first and keep its tense
  and trouble.
- Slots: `{power}` only for a predicate that holds one faction (merchants_rule; rival_power where factsOf gives that
  power's name: check `rivalPower`'s shape and say what fills it). No pronoun after `{power}`.
- Check every field each predicate reads in `src/domain/facts/factsOf.js` (warState, famine, leadingSourceSpent,
  failedSource, route, defence, monsterFrontier, rulerKind, seatOutranked, rivalPower, legitimacyCrisis, water) and the
  stress types in `t.stress`; a field that does not exist BY THAT NAME is reported and its row dropped, not guessed.
- succession_crisis `outranked` speaks for 0.0% after the ranks (raw 21.6%): write its two wordings anyway and say in
  your reply whether you see why (one sentence; do not measure).

Reply to PAGE-7 after BOTH files: at most 200 words: both paths, wordings per kind, dropped rows, missing fields, slots.
