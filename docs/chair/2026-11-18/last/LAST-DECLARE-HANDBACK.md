# LAST-DECLARE hand-back (seat LAST-DECLARE, 2026-11-18)

Base: `b014a7bf3` (`lane/landing-pieces-2026-11-18`: the five pieces and the faults round landed, points 54 to 65).
Branch: `lane/last-declare-2026-11-18`. Commits: e8d7c850f and a3e7c0776 (item 1), d96b9565c (the guard; item 3's patch), 5df57eb26 (item 2), then
the guard and item 3's patch, then this hand-back. Model Opus 5.5, one builder, no sub-agents.

**In one line:** 18 of the 20 rows leave the register by declaration, byte-equal everywhere. The other 2 stay recorded
by the chair's ruling LR1 (the walker reads "garrison work" as a garrison). Item 2 landed under LR3: it cures all 12
false towns of the 900 and all 3 of the 525, and the replacement is true in the 6 towns where a true line was passed
over. Item 3 has a route that needs no `vite.config.js` change (measured, kept as a patch, not applied).

## The populations (each born at the base and at every commit; the tools are in scratch)

The 30 (`seeds.bar7.txt`, lane/read7-prep), the 150 (`docs/chair/2026-11-17/birth/birth3/seeds.w150.txt`), the 720
(PAGE-COPY's `seeds.txt`), born by PAGE-COPY's `births.mjs`/`seedcfg.mjs`. The 525 come from
`docs/chair/2026-11-17/birth/probes/birthsRef.mjs` and are hashed by the golden's own procedure
(`sha256(JSON.stringify(settlement))`); the golden file is never written. Several of the twenty's lines are siege twins
that never print in the 900, so I added **700 besieged births** to the measure: `r2s-under_siege-town-1000..1399`,
`-city-1000..1199`, `-metropolis-1000..1099`, same configuration map.

## Item 1: the twenty rows

### What each line now declares (no new text; each declaration is vetoable)

| row (hash) | file | thing | declared on | where it prints (three towns) |
|---|---|---|---|---|
| a2cdeb4b, the free company's original | institutionDescVariants.js `DESC_LATE_SIBLINGS` | armedForce | `needs: mercenary` (the house is the Free company hall: its roster name answers `defenseFacts.js :: FREE_COMPANY_RE`) | bar0-town-occupied-rand-38, r2r-town-15, r2r-town-30 |
| 38ba15e3, its siege twin | same | armedForce | `needs: mercenary` | r2s-under_siege-town-1001, -1004, -1014 (never in the 900) |
| 743cc96b, the hiring office's siege twin | same | armedForce | `needs: mercenary` | r2s-under_siege-town-1011, -1017, -1025 (never in the 900) |
| b50dee27, the lodging line's siege twin | same | armedForce | `needs: mercenary` | r2s-under_siege-town-1028, -1046, -1085 (never in the 900) |
| d163baaf, the bowyers' twin ("the town's defenders") | same | armedForce | `needs: guardPresence` | bar0-city-under_siege+famine-rand-28, -36, r2s-under_siege-metropolis-2 |
| c57566e5, the bowyers' twin ("the town's defenders") | same | armedForce | `needs: guardPresence` | bar0-city-under_siege+famine-rand-32, -33, -34 |
| c6fded0a, "Metropolitan cathedral … Pilgrimage destination." | same | quarters | `needs: population: ≥ middling` | bar0-metropolis-calm-rand-45, -27, -34 |
| 522f8862, its siege twin | same | temple, quarters | `needs: church, population: ≥ middling` | r2s-under_siege-metropolis-0, -1000, -1002 |
| 5c421f2f, "The metropolitan cathedral …" siege twin | same | temple, quarters | `needs: church, population: ≥ middling` | r2s-under_siege-metropolis-1001, -1005, -1009 (never in the 900) |
| fc8262cb, "The great church of the metropolis …" siege twin | same | temple | `needs: church` | r2r-metropolis-14, r2s-under_siege-metropolis-2, -3 |
| 26ba1043, the garrison chaplain | safetyProfile.js `SAFETY_LINE_SIBLINGS` | garrison, clergy | `needs: garrison, church` (the original); written as rows, see R6 below | bar0-metropolis-calm-rand-36, r2r-city-18, r2r-metropolis-16 |
| ad2781f9, the settlement's chaplain (twin) | same | clergy | `needs: church`, `excludes: garrison` | prints in none of the 900, the 525 or the 700 |
| d0cb0884, "The streets are unusually quiet." | safetyProfile.js | streets | `needs: tier: ≥ village`; twin "The place is unusually quiet." (`excludes`), resolved through `resolveSibling` on `factsOf({ institutions, tier })` in place of the `TINY_PLACES` test | prints in none of the populations (the state-crime branch); the guard pins every tier to the old test's choice |
| 46a67ae0, the roadside origin row | settlementOriginProse.js `ORIGIN_DECLARED` | openTrade | `excludes: crisis: under_siege` (its `noSiege` test), handed to `noteDeclared` where the pick is made | bar0-city-wartime-rand-46, bar0-village-famine-rand-27, -29 |
| 85fc6184, " A court and a prison stand, but few offenders …" | guardLineUnderTheLaw.js | prison | `needs: prison` on the twin row; the held lines resolve through `resolveSibling` on `{ lawBand, defence }` in place of the hand-rolled twin swap | bar0-city-under_siege+famine-rand-30, -31, -32 (11 towns in all) |

Surfaces: each line is a stored field of the record (a house's `desc`, the safety profile's lines, `settlementReason`),
so the tabs, the PDF, the journal and the shared page print it as stored. The guard line is the one display-time
reader (`defenseDisplay.js`, the Defense tab and the printed export). I rendered no page: each line's text is unchanged,
and every place it prints is proved equal below.

### Proof: the line prints exactly where it printed before

- **Measured first**, at the base on the stored records: each atom holds in every town that prints its line. The free
  company's three lines and the original: `mercenary` 8/8 in the 900 and 34+20+18 in the 700. The bowyers' twins:
  `guardPresence` 12/12 and 157/157. The cathedral's lines: `church` and `population: ≥ middling` 33/33 in the 900 and 82/82 in the 700.
  The chaplain: `church` 28/28. The roadside: no siege in 119 of 119 (81 + the 525's 38). The court-and-prison
  originals: `prison` 509/509.
- **Births, base against each commit:** the 30, 150, 720, the 525 and the 700 are byte-equal at e8d7c850f and at
  a3e7c0776 (0 moved in every population).
- **The guard line as printed** (`guardLineUnderTheLaw`, base tree against tip tree, over every record's
  `guardEffectivenessDesc`): 2,125 lines, 0 moved; the twin prints in the same 11 towns at both.
- **The register:** removed only by the door's `--shrink` (`scripts/presumed-things-door.mjs`). Banked arm-1 rows
  4,649 → 4,629: 18 of the twenty, and **2 more nobody listed**: the catalogue's rows of the same two literals
  (`institutionalCatalog.js` armedForce a2cdeb4b and quarters c6fded0a). The walker's keyed reading credits the key's
  declaration to every literal of that text, and the catalogue's description is the stored text the late re-read
  resolves, so those rows went stale in the same commit. The 5 fresh hits and 1 fresh strip `--check` reports stand at
  the base too, byte-for-byte (not mine; named, not chased).

### Left by the chair's ruling LR1: 2 of the 20

`garrison` on the hiring office's siege twin (743cc96b, "… so garrison work and short-term hire go at day-wages here")
and the lodging line's (b50dee27, "… they hire out by the day for garrison duty …"). Neither prints in the 900. In the
700 they print in 20 and 18 towns, and **14 and 12 of those have no garrison** (r2s-under_siege-town-1011, -1017, -1025,
-1031, -1039, -1040, …; -1110, -1146, -1169, -1190, …). `needs: garrison` would refuse the twin there, and its set would
keep the refused original ("Caravan escort …") under the siege. The line speaks of work the company hires out for, not
of the town's garrison: R6, the walker's false reading. No atom in the vocabulary names "a company that does garrison
work". Their armedForce rows are cured (`mercenary`). **RULING LR1 (the chair, 18:29 UTC): leave both rows as they
stand.** They are two of the four recorded by the owner's own word this morning ("record the four", 0af60594a), so they
stay recorded, not declared. The walker's reading of the word goes to the last close's list of detector debts; no
walker is changed.

### R6: a walker's false reading, named

`presumedThings.shared.mjs :: buildersOf` credits a builder's row only where `needs` / `excludes` is a bare parameter.
`safetyProfile.js :: declaredSet` and `guardLineUnderTheLaw.js :: declaredSet` both wrap theirs in `Object.freeze([...])`,
so the walker reads every set they build as undeclared. The header claims they are read ("a sibling set's
`declaredSet(text, needs, twin)`"). That is why the chaplain's `['garrison']` stood as a row. I wrote the chaplain set
and the streets set as explicit rows; I did not touch the builder, because that would stale about a dozen other rows
outside the twenty (the watch, walls and prison `implied` rows of `safetyProfile.js`). One line for the close.

## Item 2: the sawyer's secret: LANDED under the chair's ruling LR3 ("land it as is, with one proof first")

`'Sells green planks as seasoned …': { needs: ['trade at work: building'] }` in `TITLE_LINE_DECLARATIONS.secret`
(titleSecretsPresentations.js), read by `poolMap.js :: settleTitleLines` at birth. Measured against the base:

| population | prints it | false at the final record | cured (moves, now another sawyer secret) | moves where the final record HAS building at work |
|---|---|---|---|---|
| the 30 | 4 | 1 | 1 (bar0-village-calm-rand-45) | 0 |
| the 150 | 15 | 3 | 3 (bar0-village-calm-rand-36, bar0-village-famine-rand-33, bar0-town-occupied-rand-38) | 1 (bar0-city-wartime-rand-28) |
| the 720 | 77 | 8 | 8 (r2r-village-3, -11, -14, r2r-city-44, r2s-occupied-town-3, r2s-indebted-city-1, r2s-religious_conversion-town-1, r2s-slave_revolt-village-2) | 5 (r2r-city-22, r2s-indebted-town-0, r2s-recently_betrayed-city-2, r2s-succession_void-town-3, r2s-monster_pressure-city-2) |
| the 525 | 149 | 3 | 3 | 0 |
| the 700 | 95 | 8 | 8 | 7 |

Only `npcs` moves, and no other field. Every false town is cured, and none is left. The 6 wrong moves in the 900 have
one cause: at birth `housesShortOf` reads the Carpenters (5-15) short of timber the town buys in later
(`shortEarly: timber`, `shortFinal: none`, in each of the four I opened). I stopped on it, and the chair ruled LR3: land
it, proving first that the replacement is true in each of the 6.

**The proof.** I read the sawyer's card in each of the 6 (bar0-city-wartime-rand-28, r2r-city-22, r2s-indebted-town-0,
r2s-recently_betrayed-city-2, r2s-succession_void-town-3, r2s-monster_pressure-city-2). Every one now holds "A sawyer's
boy lost an arm at the blade, and the family was paid to say it happened somewhere else" ("The boy is growing up, and
he does not think the money was enough"). It presumes nothing but the sawyer and the blade the card itself stands for,
so it is true on each page. **The declared move:** `npcs[]`, the sawyer's `secret` only; no other card, field or byte
moves. The 900: 18 towns. The 30: bar0-village-calm-rand-45. The 150: bar0-city-wartime-rand-28,
bar0-village-famine-rand-33, bar0-village-calm-rand-36, bar0-town-occupied-rand-38. The 720: r2r-village-3, -11, -14,
r2r-city-22, -44, r2s-occupied-town-3, r2s-indebted-town-0, r2s-indebted-city-1, r2s-recently_betrayed-city-2,
r2s-succession_void-town-3, r2s-monster_pressure-city-2, r2s-religious_conversion-town-1, r2s-slave_revolt-village-2.
The 525: **3 of 525**: town|germanic|plains|mountain_pass|civilized|golden-master-v3,
town|germanic|plains|none|civilized|golden-master-v3, town|germanic|plains|road|civilized|gm-seed-a. Each moved town
takes the same replacement.

**LOW, for after the deploy (LR3):** the title lines are drawn on the birth's facts before the imports are written, so
a line the final record makes true can be passed over. A late reading of the title lines, as `readHouseDescsLate` does
for the house descriptions, would be new machinery and is not ordered now.

## Item 3: `impairedUnderSiege`, measured (the brief: measure and stop)

- **The reading's moves:** with the shown status (`chainCrisisStateShown(c) === 'impaired'` in place of the stored
  `c.status`), `trade at work: dyed cloth` turns from true to false in **4 towns of the 900**
  (bar0-city-under_siege+famine-rand-28, -31, -38, r2r-village-55), **0 of the 525**, and 70 cases in the 700. No other
  key moves. Stored records: 0 move in the 900 and the 525, and 2 of the 700 move (`arrivalScene`:
  r2s-under_siege-city-1103, -1185). The display reader of the key (`tradeListDisplay.js`) was not rendered.
- **(a1) the direct import** (`tradeAtWork.js` → `display/chainStateShown.js`): `engineCoreLazyEdge` is red with 2
  edges: `chainStateShown.js -> facts/crisisKind.js [coherence-lazy]` and `-> facts/institutions.js [coherence-lazy]`.
  The derivation pulls `chainStateShown.js`, `chainCarrier.js`, `chainWorking.js` and `halfWayGoods.js` from unpinned
  into eager engine-core.
- **(a2) a way without that import, which needs no `vite.config.js` change:** move the crisis-state rule
  (`NO_STATE_SHOWN`, `FOOD_SOURCE_GROUND`, `SHOWN_WORKING`, `chainCrisisStateShown`, `seaOpenTo`, `SEA_GROUNDS`,
  `runsOnlyThroughAccess`, `tradeStoppedHere`) whole into `facts/tradeAtWork.js`, which is already pinned
  coherence-lazy beside `crisisKind.js` and `institutions.js`. `chainStateShown.js` imports the rule from there and
  re-exports its public names, so there is still one home and one rule. **All of `tests/architecture` is green (21 files,
  347 tests).** Route changes: only `chainCarrier.js` (2,294 B raw, import-free) goes from unpinned into engine-core.
  It gives the same 4 / 0 / 70 flips. The patch is `LAST-DECLARE-ITEM3-A2.patch` beside this file (a prototype, not
  applied; it would want its own guard).
- **(b) the chunk sizes** are not taken: (a2) exists, so the pin need not move, and I built nothing.

## The net (each gate alone through `scripts/gate-tail.sh`; base b014a7bf3 and tip)

(filled below)

## Stored figures this branch moves (for the last close; none re-taken by me)

- `tests/lint/presumedThings.widened.register.json`: arm-1 rows banked 4,649 → 4,629 (the 18, and the catalogue's 2).
- The presumption ledger's pools: two new door sites note lines (`settlementOriginProse:ORIGIN_DECLARED`,
  `guardLineUnderTheLaw:GUARD_LAW_SIBLINGS`). The streets line notes into `safetyProfile:SAFETY_LINE_SIBLINGS`. Any
  ledger-derived census (pool table, pool dominance, declared share) may gain these rows: see the net.
- The golden: 0 of 525 move under item 1; **3 of 525 move under item 2** (the sawyer's secret, named above).

## Left, by name

- Left by name, with the ruling: the 2 `garrison` rows (743cc96b, b50dee27): recorded by the owner's word, kept by LR1;
  the walker's reading of "garrison work" goes to the last close's list of detector debts.
- The LOW of LR3 (the title lines' birth-time reading), named above.
- Item 3: the patch, not applied.
- The `declaredSet` builder blindness (R6 above): named, not repaired.
- The base's own reds: named in the net, not chased.
