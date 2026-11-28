# S1, S2, S3: a secret that fits its holder (brief written 2026-11-20 11:30 UTC; read BUILDER-RULES.md first; THREE units, THREE commits, in order)

**THE FAULT (measured by PAGE-2, base 0c9069489, the chair's 300 towns; a FLOOR, hand-tagged).** A card titled the dean (pool
role High Priest) held "Runs a protection scheme targeting the very merchants they're supposed to serve". Misfit secrets
(another calling's wrong): clergy 48 of 491 cards (9.8%; city 20/141, metropolis 15/221), justice 9.9%, watch 1.1%. The
clergy titles with NO row in `src/data/people/titleSecretsPresentations.js :: TITLE_SECRETS`, by cards: the dean 150, the
bishop 60, the priest 50, the senior abbot 39, the senior abbess 35, the foundling-keeper 9, the abbess 5, the abbot 2. Such a
card falls to `src/generators/npc/factionLeaderSecret.js :: generateFactionLeaderSecret`, whose holder key
(`domain/roles/roleClass.js :: classOfRole`) leaves the role-free pool `src/data/npcData.js ::
NPC_CRIMINAL_SECRETS_BY_HOLDER.any` open to clergy; that pool holds lines that presume an office or a trade (seen on clergy and
justice cards: the protection scheme on merchants, falsified inspection records, a legitimate business that fronts
contraband, goods sold as locally produced, a product's health finding, a competitor, a business partner, ventures talked into).

## S1: title rows (commit 1)
THREE secrets each (`S(secret, stakes)`, the row shape) for the dean, the bishop, the priest and the abbot, and the same for
every other clergy title in the list above that a card carries (the senior abbot, the senior abbess, the abbess: either their
own rows or the SAME three as the abbot under their keys, your call, say which; the foundling-keeper too). PRESENTATIONS: `[]`
(the card keeps its category presentation path, `npcGenerator.js :: pickTitle`); if the wiring refuses an empty list, stop and
report. THE VOICE: the rows beside them (the almoner, the foundling-mother, the hospitaller, the circle-keeper): small, human,
true to the calling, about the holder's OWN office and house (the alms, the tithe, the parish register, the bell, the
confession, the relic, the burial ground, a favour in the rota, a doubt kept quiet); a secret says what is hidden and what
exposure would cost; no murder, no named person, no institution, power, tier word or magic the place may not have (the table's
law in its header). PAGE-2 and the chair read every line before the unit merges, and the owner sees them: put them all in
`docs/chair/2026-11-20/content/page/S1-LINES.md` too, each title's three beside the line its cards drew most at the base.
THE DRAW: a titled card draws its secret with ONE `pickFromArray` where `generateFactionLeaderSecret` drew TWO, so on that
card's own stream the draws after it move. BEFORE building, read `src/generators/people/representatives.js` and say whether
each card draws on its own keyed fork (so no other card moves). Then measure and name EXACTLY which fields of those cards move
besides `secret` (expected: `power` within the same band, `presentation`); any other field or any other card moving is a
finding: stop and report.

## S2: the role-free pool's office lines, tagged (commit 2)
Every row of `NPC_CRIMINAL_SECRETS_BY_HOLDER.any` (every type) that presumes an office, a duty or a trade the holder may not
have is tagged with the holders it fits, by role class (`ROLE_CLASS` values: office, clergy, trade, military, merchant,
criminal, arcane, noble, other), declared BESIDE the table (keyed by the row's secret text, as `TITLE_LINE_DECLARATIONS` is;
never on the row object, which is copied onto the card). A row that fits every holder is untagged. After the draw in
`generateFactionLeaderSecret` (and its held-refusal chain), a row whose tag does not admit the holder's class takes the NEXT
admitted row of the same chain in the pool's order, wrapping, skipping held rows: NO NEW DRAW (the pattern of
`people/poolMap.js :: settleTitleLines`); if none is admitted, the personal bucket's next admitted row, then the safe line.
List every tag in `docs/chair/2026-11-20/content/page/S2-TAGS.md` (row, tag, why) for PAGE-2 and the chair. Moves only the
secret of the cards whose drawn row is refused (and nothing after it: the draw count is unchanged); report how many.

## S3: the census, with a guard (commit 3)
A guard test (it owes a registry row if the lint suite keeps one for walkers; find it and add the row): (a) every title a card
can carry at birth (enumerate from the pool map, `people/poolMap.js :: POOL_BY_TITLE`, its shelves and the seat pools, and the
titles the 300 towns actually print) either has its own `TITLE_SECRETS` row or draws through a class pool that admits it, and
(b) no untagged row of the role-free pool names a duty (a word list: serve, inspect, inspection, business, sell, goods, product,
customers, competitor, partner, ventures, patrol, court, verdict, case, ledger …; tune it on the pool so it holds today after
S2, and show it red on the base). Red first on the base for both arms.

**MEASURE, BEFORE AND AFTER EACH UNIT:** the misfit share by calling and size (PAGE-2's script:
`/tmp/claude-0/-home-user-settlement-engine/b32e5e92-3f8b-5763-bbcf-00373445fe98/scratchpad/m/measure.mjs <tree> 50`, its
"S." lines).

**FILES YOU OWN.** `src/data/people/titleSecretsPresentations.js` (S1), `src/data/npcData.js` (S2: the tag table only) and
`src/generators/npc/factionLeaderSecret.js` (S2), new tests under `tests/data/` or `tests/generators/`, the three docs above,
and a walker registry row if S3 owes one.
