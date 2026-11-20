# CL1: the causes' lines, batch 1 (crime_wave, guild_conflict). PAGE-7's brief, written 2026-11-20 14:4x UTC

You WRITE ONE FILE: `docs/chair/2026-11-20/content/page/lines/CAUSES-LINES-batch1.md`. You edit nothing else, commit
nothing, push nothing, run no gate. Your reply to PAGE-7 is at most 150 words: the file's path, its count lines
(wordings per kind, causes dropped and why), and every field you could not find.

READ FIRST: `briefs/BUILDER-RULES.md` (the style law binds every line); `PAGE-5-HANDBACK.md` section 4 (the chair's
four rulings); `measures/page-5/sim.mjs` (the ruled tables: cause, rank, predicate; `WORDS` gives the wordings a cause:
3 where listed, else 2; three plain wordings a kind); the first two lines of `measures/page-5/causes.ranks.150.out.txt`
(each cause's rate). Then, in source: the stored description sentence(s) of crime_wave and guild_conflict
(`src/data/historyData.js` and whatever `historyGenerator.js :: buildHistoricalEvent` writes into a current tension's
`description`), and `src/domain/facts/factsOf.js` for EVERY field a predicate reads (`lawBand`, `rivalRings`,
`orderForce.*`, `rivalPower`, `water.navigable`, `route`), plus the institution names the regexes match
(`src/data/` institution catalogue). A predicate whose field does not exist BY THAT NAME is reported, not guessed.

THE CHAIR'S RULINGS THAT SHAPE THE TABLE (vetoable by the owner):
- crime_wave: `old_crime_wave` is DROPPED (a past crime wave never stands). `no_force` stays rank 1. `force_unpaid_or_cut`
  stands ONLY IF the record holds it by a NAMED FIELD (find it in factsOf: e.g. a volunteer watch, a pay that is short or
  cut); if no such field exists, drop the row and say so. The hideable rows (criminal_power, rival_rings, thieves_house,
  contraband_water, underground, assassins, black_market, whisper_market, outlaws_near) hold only where the document in
  hand shows the house: mark each `HIDEABLE` in the table.
- guild_conflict: no "craft and merchant powers both" row. Rank 2's `trade_center` and `luxury_quarter` are worded each as
  a place where trade passes OUTSIDE the guild; no new party is named or implied.

EVERY LINE:
1. Says ONLY what its predicate holds. Never a new fact, a secret, a crime, a person, a number or an event the record lacks.
   A house's line may say the house is there and what kind of house it is; never what it has done.
2. Is ONE sentence in the PRESENT tense that still names the SAME trouble the kind's stored sentence names (crime rising;
   the guild against outside traders), so a DM reading it alone knows the trouble AND why it is here.
3. Names a power only through the slot `{power}` (the name of the one faction the predicate holds: criminal_power,
   guilds_rule, rival_power), never by a made-up name, and never follows `{power}` with a pronoun (no he/she/they/it/its
   referring back to it; repeat a noun or restructure).
4. A town of any size can carry it (no "city", "streets" unless every size has streets: prefer neutral words).
5. Within a cause, the wordings differ in their WORDS, not only their order (the cap: none above ~15% of the kind).
6. Plain wordings (no cause holds) name the trouble and give no cause; they still differ from the stored sentence.

THE FILE'S SHAPE, per kind: the stored sentence(s) quoted; then for each kept cause in rank order a block:
`cause · rank · HIDEABLE? · predicate in words (the field, quoted) · rate (from causes.ranks) ` and its wordings numbered
`0..n-1`; then the plain wordings `0..2`; then a short list of dropped causes with the reason.
