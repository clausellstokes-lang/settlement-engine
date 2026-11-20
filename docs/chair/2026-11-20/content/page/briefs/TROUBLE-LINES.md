# TROUBLE-LINES: a trouble's own hooks and lasting effects, measure and lines. PAGE-7's brief, 15:55 UTC 2026-11-20

THE OWNER (2026-11-20, verbatim): "So do what you can to comprehensively fix the sameness fault as much as you can".
"A calm town should be as it currently is… Don't invent drama capitalize on what's already there if it's there… We are
not creating the campaign." THE CHAIR (15:54): the crime wave's hook "The crime wave is coordinated. Someone is
directing it to create a pretext" and its lasting effect "An expanded watch and a night curfew survive from the
crackdown" each print in 27 of 50 cities: a kind has three fixed hooks, so two places with one kind share all three.

YOU WRITE DOCS ONLY: a measure under `docs/chair/2026-11-20/content/page/measures/page-7/hooks/` and ONE lines file
`docs/chair/2026-11-20/content/page/lines/TROUBLE-LINES-1.md`. No file under src/ or tests/. Commit nothing; PAGE-7 does.

READ: `briefs/BUILDER-RULES.md` (the style law binds every line); the chair's census of stored sentences if it is on
`origin/lane/chair-2026-11-08` under `docs/chair/2026-11-20/seventh/measures/stored-census/` (fetch; if absent, go on);
where a current tension's `plotHooks` and `lastingEffects` come from (`src/data/historyData.js`, `historyDescVariants.js`,
`src/generators/historyGenerator.js`, and whatever page code prints them: name each by `path :: symbol`); the fact homes
in `src/domain/facts/` (`factsOf.js`'s list: ONE FACT, ONE HOME).

STEP 1, MEASURE (one script, 900 towns `hxd-<size>-0..149` generated as `measures/page-5/sim.mjs` does; output to a file,
read by count lines): the eight commonest tension kinds by count; for each, today's hooks and lasting effects, how many are
printed a town and how they are chosen; the share of three-same-size-in-a-row sharing a hook / a lasting effect (cities and
metropolises named); and, for each fact a new hook or effect might NEED (a watch or garrison, a temple, a guild, a market,
water, a criminal power, a governing power's category, the law band, war state, a stress), its rate among that kind's towns.

STEP 2, LINES (the chair's form): for each of the eight kinds, ABOUT EIGHT HOOKS and ABOUT EIGHT LASTING EFFECTS, each
beside the fact it NEEDS (a key over `(record, factsOf(record))` naming its home, or "none"), its rate from step 1, and the
kind's stored hooks/effects quoted; today's strings stay among the eight unless they claim what the record lacks (then name
the fault). THREE are chosen by keyed hash among those whose need holds, NO NEW DRAW; the stored arrays keep their length,
only strings move. A pool must have at least three lines that need nothing (so every town fills three).
EVERY LINE: says only what its need holds, or poses a QUESTION for the DM about what is already there; never a new person,
house, crime, secret or event as fact; no pronoun after a power's name or a slot; a hook is present tense; a lasting effect
names a standing condition of the place that this kind of trouble leaves, true of any town where its need holds. Within a
pool the lines differ in their words, not only their order. Say for each pool the largest share any one line would print in
(three of eight with all needs holding is 37.5%; say how needs move it).

REPLY to PAGE-7, at most 200 words: the lines file's path, its count lines (kinds, hooks and effects per kind, needs used),
the measure's count lines (today's three-in-a-row sharing, by size), and every stored string you judged false to the record.

## ADDENDUM, 16:20 UTC: THE CHAIR'S FOUR RULINGS OF 16:19 (they govern; output `lines/TROUBLE-LINES-2.md`)
1. LASTING EFFECTS ARE NOT BUILT (no page prints a trouble's `lastingEffects`); the stored field stays. Write no effects.
2. NO QUESTION FORM. A HOOK IS A LEAD A DM CAN USE TONIGHT: something small and concrete that has happened or is about
   to, done or hidden by the KIND of person or house this place holds. It MAY propose a twist the record does not hold
   (that is what a hook is). It may NOT: name a house the place lacks (that is its NEED), contradict the record, or state a
   past event as history. TODAY'S THREE A KIND STAY IN THE POOL, each behind its need (the guard captain's line needs a
   watch AND organised crime). The "false to the record" judgments of TROUBLE-LINES-1 applied the page's STATEMENT rule to
   hooks: withdrawn.
3. NUMBERS: 12 hooks for crime_wave and guild_conflict, 9 for each of the other six; at least FOUR in each pool need
   nothing; three kept by keyed ranking among those whose need holds; the stored array's length unchanged. THE BAR: the top
   share of any one hook among a size's places about 15% or less, and the share of a place's hooks a second place also
   prints under 30% (the chair's census: 22% at city size today); "three in a row share any" is reported, not the bar.
   Re-run the pools measure on the new lines and give both bar figures by size.
4. A HOOK MAY NEED A HIDEABLE FACT (organised crime, rival rings, criminal income...) ONLY BECAUSE HOOKS NEVER REACH A
   READER: check (read only, name `path :: symbol`) whether `currentTensions[].plotHooks` is absent from the shared
   projection and from the veil's served document; say what you find; LIST every hook whose need is hideable.
THE FILE: the lines only, by kind, each beside its need (key and home) and its rate; the stored three marked.
