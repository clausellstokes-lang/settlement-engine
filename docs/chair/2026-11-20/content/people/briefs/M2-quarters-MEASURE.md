# PEOPLE-1 measuring seat M2: the quarters of a place (written 2026-11-20T15:59Z)

Read `docs/chair/2026-11-20/content/people/briefs/MEASURE-COMMON.md` first: it binds you.

YOUR FIELD: `spatialLayout.quarters[].desc`, written in `src/generators/spatialGenerator.js` (read the file WHOLE, once; note its own rule, in its comments: "a settlement is described by what it HOLDS", and its `textOf({ text, needs, excludes, crisis })` declarations, which a census reads).

WHAT THE CHAIR MEASURED (50 places a size, base 43ab0f5eb; re-confirmed by the integrator the same hour): ten texts serve every city's seven quarters; a second city repeats 91% of a city's quarter texts, a second town 77%. "Houses of worship, cloisters, quiet streets with priests and pilgrims" is in 50 of 50 hamlets, villages, towns, cities and metropolises and 38 of 44 thorps. Here the bar reads per QUARTER TYPE as well as per sentence: report, for each quarter type, the share of the places holding that quarter that print its commonest sentence.

THE DIRECTION THE CHAIR GAVE: a quarter may be said from what stands in it: the place's own houses (its institutions, by the live roster, each by its fact home: `src/domain/facts/institutions.js`, `hasInstitution`, `liveInstitutionNames`; and the other homes `factsOf.js` names: faith, market, defence, guild, water, terrain). A quarter of worship in a place whose faith is one village shrine is not "cloisters … priests and pilgrims"; a place with a cathedral and a monastery may say so. Find first how the generator chooses which quarters a place has and from what (the institutions? the tier?): a quarter whose description names a house the place lacks is a false presumption, and your readers' census must say whether one already guards it. Never a new trouble: the crisis-scoped texts (`crisis`, `excludes`) keep their law; measure them, do not widen them.

YOUR OUTPUT: `docs/chair/2026-11-20/content/people/PROPOSAL-quarters-desc.md`, your script(s) under `docs/chair/2026-11-20/content/people/measures/` (named `m2-*.mjs`), each run's output beside its script as `.out.txt` (the count lines, not the births).
