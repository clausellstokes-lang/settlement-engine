# Brief: WRITE-HOOKS (DEPTH-1's writer; written 2026-11-20 14:40 UTC)

You write 60 NEW PERSON HOOKS as two review files. You change NO source file, run no test, take no census, commit nothing
(DEPTH-1 reads your files line by line, commits them and sends them to the chair; nothing is built before the chair's word).

## Why
The owner (2026-11-20, verbatim): "Sameness between settlements shrinks but stays." and "A calm town should be as it currently
is… Don't invent drama capitalize on what's already there if it's there… We are not creating the campaign." Two cities repeat
47% of each other's person hooks. New hooks APPENDED to the pools below lower that (measured: to about 32% at city size).

## Where the lines go (read, do not edit)
`src/data/npcData.js :: NPC_FACTION_LOYALTY` (the hook pools; a row is a string, or `{ text, needs/excludes }` — yours are all plain
strings). Each new hook needs a theme tag from `src/domain/hookThemes.js :: HOOK_THEMES`, chosen among the themes its group's
existing rows already carry (`themeOfText(row)` gives an existing row's theme; run it with node). How a hook is drawn:
`src/generators/hookVariety.js :: drawUnique` (prefers a theme the town has not spoken yet). Who draws which pool:
`src/generators/people/poolMap.js :: hookPoolFor`.

| group | rows now | write |
|---|---|---|
| `other` (the catch-all: ANY face whose title keys no pool: a farmer, a sailor, a weaver, a scholar, a widow) | 40 | 30 |
| `government` (an official, a clerk, a councillor, a steward, the seat's people) | 24 | 8 |
| `economy` (a merchant, a trader, a shopkeeper, a craftsman: it presumes a TRADE) | 24 | 14 |
| `criminal` (a fence, a smuggler, a thief-taker's informer: the person stands in the criminal category) | 18 | 8 |

## The rules (the chair's, binding every line)
1. A hook is a SMALL THING A DM CAN USE TONIGHT, never a plot: a present situation of this one person (something they know,
   owe, want, fear, noticed, keep, were asked), in the house voice: "They …", present tense, one or two short sentences.
2. TRUE OF ANY HOLDER of that group in ANY town: no court, market, temple, guild, harbour, wall, garrison, council or criminal
   house presumed (a town may lack it); no weather, season, sea, river or crisis presumed; no magic outside `magic`.
3. NOTHING THAT READS AS AN EVENT OR A CRIME: no murder, theft, fire, raid, disappearance, attack, plague or riot; a `criminal`
   hook is about the person (a debt of favour, a habit, a person they avoid, a thing they will not sell), never a crime done.
   "Calm" is the default: most towns are calm, and the line must sit in a calm town without inventing drama.
4. No pronoun after a power's name (name no power at all); no proper names, no numerals (words, sparingly), no slots `{x}`.
5. Not a near-copy of an existing row or of another new line (a different situation, not the same sentence re-worded).
6. Themes: spread each group's new lines over the themes it already speaks, roughly in its own proportion; prefer the quieter
   themes (hidden_debt, rivalry, divided_loyalty, ambition, old_wound, outsider_suspicion, forbidden_knowledge, grief,
   secret_identity, betrayal) over smuggling, crime_ring, blackmail, vanished_person, looming_threat.

## Output (two files, in `docs/chair/2026-11-20/content/depth/lines/`)
- `HOOKS-1.md`: `other` 30 + `government` 8 (38 lines). `HOOKS-2.md`: `economy` 14 + `criminal` 8 (22 lines).
- Per group a heading, then per new line one block:
  `N. NEW [theme] "the line"` then two indented lines `beside: [theme] "an existing row of the group"` (two DIFFERENT
  existing rows, verbatim, the nearest in theme), so a reader sees the new line in its group's voice.
- End each file with a table: theme -> count of new lines, beside the group's existing count.
- Then STOP and answer in at most 120 words: the two paths, the counts, any rule you found hard to keep and where.
