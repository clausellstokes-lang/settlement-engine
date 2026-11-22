# PEOPLE-1 measuring seat M3: why the place is here, and who founded it (written 2026-11-20T16:01Z)

Read `docs/chair/2026-11-20/content/people/briefs/MEASURE-COMMON.md` first: it binds you.

THESE FIELDS ARE HELD BY OTHER LANES: you measure and propose on the base your worktree starts on; the build waits for the commit the chair names, and your proposal must say which of its findings a change by the holding lane could move (name the function the holding lane is likely to touch, from what you read).

YOUR FIELDS:
- `settlementReason[]`, written in `src/generators/narrativeGenerator.js` (held by the goals lane until it lands). Read the function that writes it WHOLE.
- `history.founding.foundedBy` and `history.founding.overcoming`, written in `narrativeGenerator.js` and/or `src/domain/facts/founder.js` (find which writes which; read each writer WHOLE). Not yours to change, ever: `historyData.js`, `historyGenerator.js`, `npcData.js`.

WHAT THE CHAIR MEASURED (50 places a size, base 43ab0f5eb; re-confirmed by the integrator the same hour):
- `settlementReason[]`: 17 texts at city, two a place; "Large enough that its appetites outrun its fields…" in 50 of 50 cities; "Everything in the region is bought, sold or decided here." in 49 of 50 metropolises; at thorp "Everyone here knows every household by name, and none has much put by." in 18 of 50.
- `history.founding.foundedBy`: four or five texts a size; the commonest in 14 to 23 of 50 (metropolis: "the slow accretion of three smaller settlements that eventually merged", 23 of 50).
- `history.founding.overcoming`: five to eight texts a size; the commonest in 13 to 19 of 50 ("with help from external allies at a critical moment"; "through good fortune and good decisions in roughly equal measure").

DIRECTION: a reason for being here is the place's own geography and trade (its terrain, its water, its route kind, what it exports, each by its fact home); a size-wide line ("large enough that its appetites outrun its fields") may stay one wording among several only where the record holds it (a city that does import food). A founder is drawn from what the place IS (its terrain, its route, its oldest houses, its faith, its ruler kind): a fishing hamlet's founders are not "a noble granted lands by the crown" unless the record holds a noble seat. Note what decides `foundedBy` today (a draw? a fixed index?): if it is a seeded draw, a new pool there costs the draw's count only when the pool's length changes the draw's consumption — say whether it does; prefer `pickVariant` where the selection is fixed.

YOUR OUTPUTS: `docs/chair/2026-11-20/content/people/PROPOSAL-settlementReason.md`, `docs/chair/2026-11-20/content/people/PROPOSAL-founding.md` (foundedBy and overcoming in one file, a section each), your script(s) under `docs/chair/2026-11-20/content/people/measures/` (named `m3-*.mjs`), each run's output beside its script as `.out.txt`.
