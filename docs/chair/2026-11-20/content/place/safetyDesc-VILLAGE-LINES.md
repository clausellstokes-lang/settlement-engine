# PLACE-1 · safetyDesc · the village lines and the classes walker's four rows (lines only, no code)

Written 2026-11-20 for the chair's ruling of 18:10 UTC on the reds of `232c8d3e4` (branch `place-1/safetyDesc-build`).
Nothing under `src/` or `tests/` changed. The projection ran on a scratch export of `232c8d3e4` (`git archive`) with the six
rows below added to its copy of `src/data/safetyDescLines.js`. The scripts are in the session scratchpad, not committed.

## (A) Six more rows

The rules for every row: one plain sentence; a mixed reading (safe here, risk after dark there); no "town"; no force named;
no hideable house and no crime or clandestine fact. No row denies another row of its slot, and none needs a new atom or a
fact the record lacks. Every new row declares nothing (`needs: []`). Checked against the walkers' lexicons on this tree:
`presumptionClasses.shared.mjs :: classesOf` finds no class word in any of the six, and `registeredWords.js :: thingsNamedIn`
finds no named thing.

### `MIXED_FORCE.none` (appended as rows 8, 9, 10)

| # | wording | needs |
|---|---|---|
| 8 | Most comings and goings on the main paths are seen by someone; the quieter spots after dark are less safe. | — |
| 9 | Doors and windows face the main paths, and someone is usually looking out; the dark spots off them are another matter. | — |
| 10 | By day little passes on the main paths unseen; after dark, the quieter spots carry real risk. | — |

**Rows eligible at a village with no force: 8.** These are rows 0–3 and 8–10, which need nothing, plus row 4
(`tier: village`). Today it is 5. Row 5 (`market`) and row 6 (`route: road`) are added where the record holds them.

### `MIXED_OPENING` (appended as rows 8, 9, 10)

| # | wording | needs |
|---|---|---|
| 8 | Daylight here is one thing; the hours after dark are another. | — |
| 9 | The well-used parts of the place are the better kept; the outskirts less so. | — |
| 10 | Most trouble here keeps to the edges and the hours after dark. | — |

**Rows eligible at a village: 9.** These are rows 0–4 and 7–10. Today it is 6. Row 6 (`market`) is added where a market
stands. Row 5 (`tier: ≥ town`) is never eligible at a village. If the three "safe enough" rows (3, 4, 6) were ever dropped,
seven rows would still be eligible at a village.

### The projection

The method is the spread test's (a): the chair's census births and mask, on 150 places a size (`hxd-<size>-0..149`). The bar
is more than 15% of the places, which on 150 is more than 22. Each cell gives the top count of any sentence, its share of all
150 places, and its share among the places that print a composed line (Moderate, or Unsafe with a garrison: the places that
print these pools).

| size | 232c8d3e4 as built | with the six rows | top sentence with the six rows |
|---|---|---|---|
| thorp | 16 · 10.7% · 17.6% of 91 | 16 · 10.7% · 17.6% of 91 | "The households look out for one another, …" (TINY_MODERATE, untouched) |
| hamlet | **23 · 15.3%** · 24.0% of 96 | **23 · 15.3%** · 24.0% of 96 | "The neighbours keep an eye on one another, …" (TINY_MODERATE index 0, untouched) |
| village | 22 · 14.7% · 21.4% of 103 | 21 · 14.0% · 20.4% of 103 | "People who live here know where not to go." (MIXED_CORNERS) |
| town | 22 · 14.7% · 20.2% of 109 | 22 · 14.7% · 20.2% of 109 | "The watch keeps to the main streets; …" (MIXED_FORCE.watch) |
| city | 15 · 10.0% · 13.2% of 114 | 15 · 10.0% · 13.2% of 114 | "The walls keep the trouble inside, …" (MODERATE_WALLS index 0) |
| metropolis | **25 · 16.7%** · 23.6% of 106 | **25 · 16.7%** · 23.6% of 106 | "People who live here know where not to go." (MIXED_CORNERS) |

Three things follow:
- On 150 places, the village's no-force row ("Neighbours look out …", 22) leaves the top, and so does the opening. The
  village's top becomes the corners slot, at 21.
- The six rows move no other size.
- Two sizes are over the bar of 150, from pools the six rows do not touch: the hamlet, at 23 (TINY_MODERATE, 10 rows, most
  of them needing nothing), and the metropolis, at 25 (MIXED_CORNERS row 1). On the test's 100 a size (`hxd-<size>-0..99`),
  both read under the bar (hamlet 12, metropolis 14). The 150 read is the chair's to weigh.

## (A2) The two sizes still over the bar on 150 (the coordinator's order after the read of (A))

These rows follow the same rules as (A), with two pool-specific ones:
- TINY_MODERATE keeps a small place's calm, with the neighbours watching, and uses no "streets" or "quarters".
- MIXED_CORNERS says that residents know where not to go.

No row has `needs`. The classes lexicon (`classesOf`) finds no class word in any of them, and `thingsNamedIn` finds no named thing.

### `TINY_MODERATE` (appended as rows 10–15; eligible at a thorp or hamlet: 14 of 16, against 8 of 10 before)

| # | wording | needs |
|---|---|---|
| 10 | A wrong done here is a wrong done to neighbours, and it is not soon forgotten. | — |
| 11 | Every household knows the others' business, which keeps most quarrels small. | — |
| 12 | Little here goes unnoticed for long; the neighbours see to that. | — |
| 13 | Trouble here is settled among neighbours, mostly before it grows. | — |
| 14 | Folk here look in on one another, and what one household sees, the next soon hears. | — |
| 15 | There are few places here to do wrong unseen. | — |

### `MIXED_CORNERS` (appended as rows 8–12; eligible everywhere it prints: 13, against 8 before)

| # | wording | needs |
|---|---|---|
| 8 | Locals can tell a newcomer which places to steer clear of. | — |
| 9 | Those born here know which turnings to leave alone after dark. | — |
| 10 | Residents keep to the places they know once night falls. | — |
| 11 | Ask anyone who lives here, and they will name the spots to avoid. | — |
| 12 | Long-time residents know the risky spots, and keep away from them. | — |

### Re-projection, all six sizes, with every new row of (A) and (A2)

The method is the same as above (150 places a size). Each cell gives the top count of any sentence, its share of all places,
and its share among the places that print a composed line.

| size | top count · share of all · share of printers | top sentence |
|---|---|---|
| thorp | 10 · 6.7% · 11.0% of 91 | "Strangers are noticed here, and so is anything that goes missing." |
| hamlet | 12 · 8.0% · 12.5% of 96 | "The households look out for one another, and a quarrel or a theft is soon talked of." |
| village | 15 · 10.0% · 14.6% of 103 | "Safety here depends on where you are, and when." |
| town | 22 · 14.7% · 20.2% of 109 | "The watch keeps to the main streets; the side lanes after dark are another matter." (MIXED_FORCE.watch) |
| city | 15 · 10.0% · 13.2% of 114 | "The walls keep the trouble inside, off the roads beyond." |
| metropolis | 21 · 14.0% · 19.8% of 106 | "The garrison holds the gates and patrols the main streets; …" (MIXED_FORCE.garrison) |

Every size is now at most 22 of 150. The town (22) and the metropolis (21) are still above the 18 margin. Their top
sentences come from the force pools (watch, 7 rows; garrison, 8 rows), which this order did not open. A row or two more
in each would give the margin, if the chair wants it. The Travelers line in this run: printed 13, refused 0 under
`excludes: ['crisis: threat']`.

## (B) The presumption-classes walker

I read both files whole: `tests/lint/presumptionClasses.walker.test.js` and its rule book, `tests/lint/presumptionClasses.shared.mjs`.

### (i) "Travelers are advised to move in groups and keep valuables hidden." keeps today's classes

**Today**, at `a331a4a19`, the line is not a literal of its own. It sits inside the Unsafe branch's template literal in
`src/generators/safetyProfile.js`. The scanner `presumptionClasses.shared.mjs :: literals` reads a template literal as one
literal and skips its `${…}` content. So the walker reads the whole template ("Crime is a persistent and visible
problem. ${lawRef} ${hasStress('under_siege') ? lineText({ … }) : lineText({ text: 'Travelers …', … })}${wallNote}").

That template's class is `outside` (`CLASSES.outside :: travell?ers?`). `scanSource` takes the declaration from the enclosing
object, which here is the branch's own block. That block holds both `needs: ['crisis: siege']` (the siege twin) and
`excludes: ['crisis: siege']`.

Run on that file, the walker gives this row: line 344, atoms `["crisis: siege", "no crisis: siege"]`, `{"outside":"declared"}`.
The positive siege atom closes the family (`crisisCoversFamilies`), so the status is "declared". **No register row ever held
the line**, and no row has to move with it.

**In the pool** (`232c8d3e4`), the line is its own literal with `excludes: ['crisis: siege']`. That one kind leaves the threat
family (`CRISIS_FAMILY_KINDS.threat` = under_siege, occupied, monster_pressure) open, so the status is `outside:one-kind`.

**How it keeps today's class, outside:declared, with no register growth: a declaration on the row.** Write UNSAFE_ADVICE[0]
as `excludes: ['crisis: threat']` (the family) in place of `excludes: ['crisis: siege']`:
- Measured with the walker's own `scanSource` + `hitsOf` on the planted row: `[]` (declared). With today's
  `crisis: siege`, it reads `outside:one-kind`.
- The branch already guarantees this. The Unsafe branch runs only when `safetyStrains` is empty, and each of under_siege,
  occupied and monster_pressure pushes a strain (`safetyProfile.js :: generateSafetyProfile`).
- On the final record: of 900 births (150 a size), the line printed in 13, and `excludes: ['crisis: threat']` was refused
  in 0.
- The family atom also excludes the siege, so the siege twin's reading is unchanged.

### (ii) The three "safe enough" openings, against the walker's `threat`

The definition, `tests/lint/presumptionClasses.shared.mjs :: CLASSES.threat`:

```
threat: W(String.raw`\b(nothing (threatens|presses|troubles|disturbs)|no (one|body) (fears|threatens)|nothing to fear|without fear|no threat|safe (enough|here|place|roads?)|(is|feels|stays|remains) (safe|quiet|peaceful|calm)|peaceful|untroubled|in the ordinary way|the usual trouble|in (good|working) order|fresh repairs|kept up|raiders and rivals look elsewhere|would make any attack costly|nobody (worries|bothers))\b`),
```

Its sense is given in the walker test's header: a line whose words fall in a class "presumes the town has … no threat".
Its family is `threat` (`CLASS_FAMILIES.threat`): under_siege, occupied, monster_pressure.

| row | wording | walker today | does `threat` FIT? |
|---|---|---|---|
| MIXED_OPENING[3] | Most of the place is safe enough, though not all of it. | threat:none | **Fits.** "safe enough" is the class's own word. The sentence says most of the place stands under no threat; under a siege, an occupation or a monster's pressure it would be false. |
| MIXED_OPENING[4] | The busy ways are safe enough; the edges less so. | threat:none | **Fits**, for the same reason: the busy ways are said to be under no threat. The mixed reading does not lift it, because the edges are "less safe", not under threat. |
| MIXED_OPENING[6] | The market and the busy streets are safe enough; other parts less so. | threat:other (it declares `market` and `tier: ≥ village`, neither of which answers threat) | **Fits.** Same words, same presumption. |

All three print only in the Moderate branch, which runs only with no strain. That branch already guarantees no
threat-family crisis. So the truthful answer, if the chair wants one, is the same declaration as in (i):
`excludes: ['crisis: threat']`. Measured with the walker's `scanSource` + `hitsOf` on the planted rows (row 6 keeping its
`market` and `tier: ≥ village`), all three read `[]`. The other choice is to drop the rows, which still leaves seven eligible
at a village if the six rows of (A) go in. Nothing was exempted or edited.
