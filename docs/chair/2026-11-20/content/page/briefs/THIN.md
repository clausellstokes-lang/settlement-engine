# PAGE-1's brief for L5, THE THIN PAGES (written, NOT DISPATCHED: it starts only on the owner's word through the chair)

Written by PAGE-1, 2026-11-20, on the chair's order of 11:24 UTC ("build nothing of it; but write its brief"). It
binds a builder under the common law of `BUILD.md` beside this file: render only, born documents hashed equal at
base and tip, red first, authored lines to the chair before merge, the gates to files. The measure is helper B's
(`measures/B/f6.out.txt`, re-run by `node docs/chair/2026-11-20/content/page/measures/B/run-render.b.mjs 10` then
`node docs/chair/2026-11-20/content/page/measures/B/f6.b.mjs`): 60 towns rendered, 300 read at record level.

## What each page prints today (EXECUTED, B's f6.out.txt)

- DAILY LIFE: 8 to 11 lines, about 33 words, at every size: the Food, Access and Culture tiles (plus a Secure or an
  Active-stress tile), one prosperity sentence, and the button.
- OUTLOOK (`ViabilityTab.jsx`): 3 to 5 lines (a metropolis averages 3.1): "✓ Viable" and little else.
- MAGIC: 17 lines from thorp to town, 17 to 21 above: the same 15 labels in every town.

## What the record holds that no page prints (EXECUTED fill rates over 300)

| Field | Fill | Distinct texts / 300 | Fit to print as it stands? (INFERRED from the samples) |
|---|---|---|---|
| `deriveDailyLife().slots.food_culture` (`src/domain/dailyLife.js:109,570`) | 300 | 38 | YES |
| `.gathering_places` | 300 | 24 | YES |
| `.child_warnings` | 300 | 20 | YES |
| `.recent_changes` | 300 | 241 | YES (it quotes the town's own history) |
| `.dawn_work` | 300 | **4** | only after its pool is deepened: 4 texts for 300 towns |
| `.commoner_resentments` | 300 | **9** (63 are the generic "the small grievances of any town") | only after its pool is deepened |
| `.outsider_impressions` | 300 | 91 | NO: it splices machine fragments ("civic stability at risk is the obvious unspoken weight") |
| `.unspoken_topics` | 300 | **1** ("the matter referenced as \"the wound\"") | NO: one fixed text, a machine's words |
| `economicViability.warnings[]` | 144 (towns and up) | n/a | YES, by title and text; dropped today by `viabilityFilter.js:15-33` (read WHY each exclusion list exists before un-dropping) |
| `economicViability.dependencies[]` | 167 | n/a | YES as above |
| `economicViability.summary` | 300 | n/a | never printed verbatim (check whether it is reworded somewhere first) |
| `magicProfile.contributors[].reason` (`src/domain/magicProfile.js:404`) | 300 | n/a | partly: "Magic level: medium." is the world dial and says nothing; the town's own reasons are fit |

## The unit (one builder, one commit, when ordered)

1. DAILY LIFE prints the four fit slots (food, gathering places, what children are warned of, what has changed
   lately) under plain headings, from `deriveDailyLife` (called today only by the AI grounding and the comparison
   tools). The four unfit slots are NOT printed; they are named to the chair as pools to deepen (another lane:
   `dailyLife.js` is in `src/domain/`, outside this brief's files unless the chair routes it).
2. OUTLOOK prints the warnings and dependencies the filter drops, ONLY those whose exclusion has no recorded reason
   (each exclusion list's history read first: `git log -S` on it); a kept exclusion is named in the report.
3. MAGIC prints the contributors' reasons that are the town's own (not the world dial's line).
4. A calm town stays calm: nothing is added that the record does not hold, and no sentence is invented: every
   line a DM reads is the record's own text or a heading. Headings are authored lines: to the chair first.
