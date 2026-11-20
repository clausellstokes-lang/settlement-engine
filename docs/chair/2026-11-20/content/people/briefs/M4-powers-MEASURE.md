# PEOPLE-1 measuring seat M4: how the powers stand to one another (written 2026-11-20T16:01Z)

Read `docs/chair/2026-11-20/content/people/briefs/MEASURE-COMMON.md` first: it binds you.

THESE FIELDS ARE HELD BY OTHER LANES (the fortune lane; the who-rules lane awaits it): you measure and propose on the base your worktree starts on; the build waits for the commit the chair names, and your proposal must say which of its findings a change by the holding lanes could move. Not yours to touch, ever: `src/generators/power/governanceNarrative.js` (the recent conflict), anything under `supabase/`, `src/domain/veil/`, `tests/security/`.

YOUR FIELDS:
- `powerStructure.factionRelationships[].narrative`, written in `src/generators/factionDynamics.js` (read the writer WHOLE).
- `powerStructure.factions[].desc` at the smallest sizes (thorp, hamlet, village), written in `src/generators/power/rulingStructure.js` and/or `src/generators/power/claimStanding.js` (find which writes which; read each writer WHOLE). Measure the larger sizes too; propose for the sizes that break the bar.

WHAT THE CHAIR MEASURED (50 places a size, base 43ab0f5eb; re-confirmed by the integrator the same hour):
- `factionRelationships[].narrative`: "The money of the # pays for the charity of the #, and the charity keeps the poor quiet…" in 36 of 50 cities and 46 of 50 metropolises; "The # holds the seat and collects the taxes; the # tell people that th…" in 29 of 50 towns; at village "People take their marriages, inheritances and hard times to the #, not…" in 33 of 50.
- `factions[].desc`: "The oldest heads of the community decide things together; people follo…" in 27 of 50 thorps, 24 of 50 villages; at metropolis "Magical practitioners are consulted but not formally empowered…" in 45 of 50.

DIRECTION: a relationship between two powers is said from what the two actually are and hold in THIS place (the merchants' trade read from the place's exports and market; the faith's charity read from its houses: a hospital, an almshouse, a temple; the seat's kind from `rulerKindOf`/`rulingBodyOf`), never a quarrel the record does not hold, and a calm pair stays calm. A council of elders at a thorp may be said from who the elders are (the place's own trades, its houses, its families' number) — the owner: "a king does not wear a dual hat": the seat's holder holds one office. Report how the pair kind and the pair's line are chosen today (a draw? an index?), and whether a new pool changes the draw's consumption.

YOUR OUTPUTS: `docs/chair/2026-11-20/content/people/PROPOSAL-factionRelationships-narrative.md`, `docs/chair/2026-11-20/content/people/PROPOSAL-factions-desc.md`, your script(s) under `docs/chair/2026-11-20/content/people/measures/` (named `m4-*.mjs`), each run's output beside its script as `.out.txt`.
