# PEOPLE-1 measuring seat M1: the person's place in the order (written 2026-11-20T15:59Z)

Read `docs/chair/2026-11-20/content/people/briefs/MEASURE-COMMON.md` first: it binds you.

YOUR FIELDS: `npcs[].activeConstraint` and `npcs[].structuralPosition`, both written in `src/generators/npcStructure.js` (read the file WHOLE, once). Both print on the people cards.

WHAT THE CHAIR MEASURED (50 places a size, base 43ab0f5eb; re-confirmed by the integrator the same hour):
- `activeConstraint`: "With nothing pressing, it is hard to win support for mending the weak spots before they break." on a card in 28 of 49 thorps, 33 of 48 towns, 35 of 37 cities, 34 of 40 metropolises. It is the default of a calm place.
- `structuralPosition`: "Leads the faith in quiet times, whatever it thinks of the seat beside it." in 31 of 50 towns; "Commands those under arms in quiet times; the work is keeping trouble from starting." in 32 of 46 cities and 34 of 46 metropolises.

THE QUESTION THE CHAIR PUT, which your `activeConstraint` proposal must answer with numbers: should a calm place's card print a constraint AT ALL, or print one read from the person's OWN OFFICE (what they hold: their institution, their role) and the place's OWN STATE (what it has and lacks, read from its facts' homes)? Lay out both, each with its projected share and its readers' cost (a card that prints no constraint: which surfaces show an empty slot or a dangling label?), and say which you recommend and the crux it turns on. A calm place stays calm: a constraint for a calm place is a plain limit of the office (what the post cannot do, what it must ask of whom), never a looming trouble.

For `structuralPosition`: the "in quiet times" lines are per-office defaults of a calm place. A wording may be read from what the person's own house or institution holds and from who sits beside them in the order (the seat's holder, the other powers present, each by its fact home) — never a second office for the ruler (the owner: "a king does not wear a dual hat"). Note the holder branch (`HOLDS_THE_SEAT`, `holderHouseLineOf`) and `positionForStanding`: measure them, propose only where a sentence breaks the bar.

YOUR OUTPUTS: `docs/chair/2026-11-20/content/people/PROPOSAL-activeConstraint.md`, `docs/chair/2026-11-20/content/people/PROPOSAL-structuralPosition.md`, your script(s) under `docs/chair/2026-11-20/content/people/measures/` (named `m1-*.mjs`), each run's output beside its script as `.out.txt` (the count lines, not the births).
