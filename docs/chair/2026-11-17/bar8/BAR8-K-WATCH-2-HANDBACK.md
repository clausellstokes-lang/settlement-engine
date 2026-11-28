# BAR8 K-WATCH-2 hand-back

Seat K-WATCH-2 of the round BAR8 (the chair's rulings BR29 and BR30). Base **215f97d29** (point 49: K-WATCH and K-POWERS
merged on the working line's 99ca9ad51); branch `lane/bar8-k-watch-2-2026-11-18`; nothing merged. Each item has its own
commit. Pushes: the title line, item 1, then items 4 and 5 together. After the chair's message of 03:11 UTC I stopped
the item-2 push in its pre-push hook, before it sent anything. Everything else (item 2, the item-1 repair and this
file) goes up in one push.

| item | commit | what |
|---|---|---|
| 1 (BR29 1) | bbcc83967, then f93d6ee60 | the lawless row moves into `serviceRollMaterialization.js`; the repair keeps the row's name in the entry (an older test, below); the entry is 390 lines (test count) |
| 4 (BR30 1) | 9f6466459 | `standingAgainstFigure.test.js` (b) re-anchored by identity (tests only) |
| 5 (BR30 2) | 96530483f | the occupation twin reworded by name |
| 2 (BR29 2) | 8f34a0238 | the atom `force walks by day` reads `orderForceOf`'s houses |
| 2, detector | ed8b3f46a | `law13K.mjs` rule 13e.hours reads the same houses |

## Item 1 · the entry is over its size

- **THE MOVE.** `SLOW_LAW_DESC`, `lawlessRow` and their two comment blocks (BAR6-CRIME, BAR8-K-WATCH) move out of
  `src/generators/servicesGenerator.js` into `src/generators/services/serviceRollMaterialization.js`, after
  `hasCriminalInstitution`. They are exported there and imported by the entry. Nothing in them changes except `export`.
  Their imports move with them (`courtHoldersOf`, `defenceOf`, `lineText`). The overlay's two push sites stay in the entry.
- **THE ROW'S NAME, AND THE OLDER TEST THAT CAUGHT ME.** My first commit (bbcc83967) also moved the row's own two strings,
  because `lawlessRow` returned them: `NO_LAW_BRING_COIN` ("Weak law, bring coin") and its "easily outbid" description.
  The module cannot import from the entry, whose export surface must stay exactly `{ generateAvailableServices }`.
  - **What broke.** My net found an older test red at the tip and green at the base: `tests/components/
    crisisStoppedRows.test.jsx`, the walker "every service name and every catalogue id is declared". It reads the entry's
    own source for its hoisted names, so with the constant gone it read `addCrimeService(NO_LAW_BRING_COIN` as
    `undefined`: "a service with no declaration: expected [ undefined ] to deeply equal []".
  - **The repair (f93d6ee60).** The name and its COHERENCE-PRESUME comment stay in the entry, spelled once. The moved
    `lawlessRow` returns `{ desc }`, and the two push sites write `{ name: NO_LAW_BRING_COIN, ...lawlessRow(institutions,
    buckets), institution: '(lawless)' }`. That is the same keys in the same order, so records are byte-equal.
  - **Only the description moves.** The "easily outbid" string moves with the row and is exported, and the entry's
    crime-type path (`crimeTypes.has('Lawlessness')`) imports it. Neither string is in any register (I grepped `tests/`
    and `scripts/` for both texts and the slow-law text: no register row).
  - **Re-checked at the tip.** `crisisStoppedRows` passes 11 of 11. So do the other tests that read the entry's source:
    `servicesStructure`, `tests/joins/deadCode`, `customContentConsumerEvidence.walker`, `institutionRemoval` and
    `serviceCategoryRegistration.walker`.
- **NOTHING DRAWN MOVES.** I hashed every record at the base (215f97d29) and at bbcc83967, which holds item 1 alone:
  the thirty and the 150 born by PAGE-COPY's `seedcfg.mjs` (180 whole records), and the 525 reference configurations
  (`goldenCorpus()`, `generateSettlementPipeline` exactly as the golden master calls it; whole record and every
  top-level field). **0 of 180 and 0 of 525 differ.** I repeated the hash after the repair, at the final source tree
  (f93d6ee60, which holds items 1, 2 and 5): again 0 of 180 and 0 of 525.
- **THE DOORS.** I diffed the full output of `presumption-classes-door --check` and `presumed-things-door --check`,
  base against item 1, and again at f93d6ee60: byte-identical. Classes `hits 1786 · banked 1938 · fresh 0 · stale 152`; things
  `fresh 38 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0 banked 107`. No row went fresh.

## Item 4 · the re-key had killed its guard (tests only)

- **THE NEW ANCHOR.** (b) now reads **rw3-metropolis-calm-9**, the test's own `born()` shape. There, **The Commercial
  Circle** (`contestsNiche: 'Merchant Guilds'`) is minted from a host whose description is general to its kind
  ("Merchants trade here in number but carry little weight in how the place is run ...", which `rivalDescOf` leaves
  alone). The two standings differ: the host's is "Close enough to the two above that their support is worth buying
  ...", and the rival's own settled one is "They have a say on only a few matters ...".
- **THE ASSERTIONS.** Two premises: the rival is the density law's, and the host carries its sentence. Then the claim,
  as `expectAbsentWithAnchor`: the host's sentence is absent. Its anchor is the shared description, which is present
  whether or not the path is cut. Then a positive: the rival's own sentence is present.
- **THE DATED NOTE (R8).** It names the old anchor (The Garrison Bloc at rw3-metropolis-under_siege-1) and why it left:
  after 14a that rival takes its twin whole and carries no standing.
- **PROOF.** In a scratch worktree at the base I planted `const host = null;` in place of the `hostByStanding` line of
  `rosterText.js :: settleStandingToRoster`.
  - With the mutation, the new (b) is **red by its own claim**: "EXCLUSION [the rival keeps its host's general
    description, never its host's standing]: the member is present ...". The anchor held.
  - Without it, green, both at the base and at the tip (4 of 4).
  - The OLD file under the same mutation is 4 of 4 green, which confirms the reader.
- **HOW I FOUND IT.** I born 252 rw3 seeds (metropolis, city and town × 7 stresses × 12) at the base and at the
  mutation, and compared every rival's description. Other rivals would serve too (for example, the Clergy Alliance at
  rw3-metropolis-under_siege-1). I chose this one because the rival's own sentence is non-empty and differs from its
  host's.

## Item 5 · the occupation twin, reworded by name (vetoable)

- **THE NEW WORDS.** In `applyDensityLaw.js :: RIVAL_DESC_OF_HOST`, the rival of "External administrative body; ..."
  now reads: **"A rival bloc that wants a say over the decisions made here, and disputes the outside administration's
  hold on them."** This is one string; no other line changes.
- **WHERE IT PRINTS.** In the 720 at the tip it is in **r2s-occupied-city-0** (The Shield Compact) and
  **r2s-occupied-metropolis-3** (The Garrison Bloc), the same two towns as the old words at the base. No third town of
  the populations prints it.
- **THE GUARD.** `tests/generators/bar8Powers.test.js` has a new arm, "14a (BR30)". At r2s-occupied-city-0 it checks two
  premises: the administrative body holds a niche, and its rival is The Shield Compact. It then checks the rival's
  description against the new words with `toBe`. Finally it checks, with an anchor, that the old twin is absent from
  every card. It is **red at the base** (Expected the new words, Received "A second body sent in from outside ...") and
  green at the tip (5 of 5).
- **THE DOORS.** Both are byte-identical to the base's output: no FRESH row.
- **WHAT MOVES IN THE 720.** `powerStructure.factions` in those two towns, and nothing else (per-field hashes, below).

## Item 2 · the atom is a second copy of the force

- **THE CURE.** `src/domain/facts/forceHours.js` no longer spells its own name table (`ORDER_FORCE_NAME`), its liveness
  (`INACTIVE`, `_worldPulseInactive`, `status`), or its "Access to" test. `forceWalksByDayOf(houses)` takes the force's
  houses and keeps only its reading of a house's own text (`nightOnlyText`, unchanged). The leaf imports nothing and
  still gives three answers: true, false (every house night-only, or no house stands), and `undefined` when no roster
  is handed in.
- **WHERE THE HOUSES COME FROM.** `factsOf.js`'s one getter hands them in: `orderForceOf({ institutions: roster
  }).houses`, the one partition's garrison, watch and militia on the live roster (the Defense tab's "Standing forces").
  When the record holds no roster, the getter hands in nothing (`undefined`).
- **WHY THE GETTER PASSES THE ROSTER ALONE.** My first draft called `orderForceOf(record)`. That also reads the pay
  (`defenseProfile`) and the cast (`npcs`), so `fact-layers-door.mjs --check` rose by two ("RISE leaves
  forceWalksByDay: defenseProfile", "... npcs"). The houses depend on the roster alone, so the getter passes only the
  roster, and the door's output is byte-identical to the base's. The layer table's row (`forceWalksByDay`, layer 1,
  `['institutions']`) is unchanged.
- **THE DRAW SITE IS UNCHANGED.** `safetyProfile.js` still uses `facts: () => factsOf({ institutions })`. EG1 holds:
  `tests/architecture` passes 347 of 347.
- **MERCENARY QUARTER, NAMED.** The brief lists it among "page yes, atom no". The page prints it under "Contracted
  forces", not "Standing forces", and `orderForceOf().houses` excludes it. So it is still not counted, as the brief's
  cure (the houses of `orderForceOf`) gives. The old leaf did not count it either.
- **"Access to ...", NAMED.** The old leaf refused "Access to <a force>". The partition has no such test, but no
  "Access to" row in the catalogue names a force (only the mill and the parish church). I dropped that unit line.

TO ZERO, with the probe at the base and at the tip (`p1300-*.json`, `p720-*.json`; all 1,300 and 720 born in each tree):

- **bar0-town-calm-rand-437 no longer prints the by-day line.** At the base it printed "You will see the town watch on
  the rounds most hours of the day; ...", with a night-only Town watch and a Warden's Lodge. At the tip it prints "The
  town watch maintains standard patrol coverage. ...".
- **In the reader's 1,300:** the atom goes true → false in **9 towns**, each held true only by a Warden's Lodge: town
  rands 93, 129, 251, 282, 383, 418, 437, 576 and 668. Only rand-437 printed the line. At the tip, **0** towns print the
  by-day line where every house of the partition is night-only, and 0 print it where the atom is not true.
- **Every by-day line of the thirty and the 150 still stands where the atom holds.** No guard line of the 180 moves.

DECLARED MOVES (R5): `economicState.safetyProfile.guardEffectivenessDesc`, base 215f97d29 against tip, every population.

| population | moves | which | reason |
|---|---|---|---|
| the thirty | 0 | — | — |
| the 150 | 0 | — | — |
| the 525 | 0 | — | (whole records byte-equal at the tip, every field) |
| the 720 | **1** | r2r-town-4 | a warden no longer counted. Its Town watch is "Men and women serving part-time, walking the night rounds." plus a Warden's Lodge. "You will see the town watch on the rounds most hours of the day; ..." → "The town watch patrols on a regular round, so petty theft is often caught and planned crime seldom is." |
| the reader's 1,300 | **1** | bar0-town-calm-rand-437 | a warden no longer counted (above) |

- **THE OTHER DIRECTION (a levy or a second garrison now counted): 0 lines move anywhere.** In the 720, 28 towns go
  false → true, every one by a Household levy, and none of them draws the fourth frame.
- **NO OTHER FIELD MOVES BY THIS ITEM.** The 720 is hashed per field, base against tip: besides r2r-town-4's guard line
  (and so its `economicState` and `safetyProfile`), the only moves are `powerStructure.factions` at the two item-5 towns.
  The 180 and the 525 are byte-equal at the tip.

GUARD ARMS (`tests/generators/bar8Watch.test.js`, 10 of 10 green at the tip). I ran the tip's file in a scratch copy of
the base, against the old leaf, and **3 arms are red there**:

- "the atom reads the one partition". Three planted cases, each failure collected (3 of 3 red against the old leaf):
  - a Warden's Lodge beside a night-only watch, refused ("expected true to be false");
  - a Household levy, read ("expected false to be true");
  - Multiple garrisons, read ("expected false to be true").
- "POSITIVE: the night-walking towns keep a patrol line". This arm now collects every seed's failure, and rand-437 has
  joined its seeds. Against the old leaf: 1 of 4 red, rand-437.
- "bar0-town-calm-rand-437: a Warden's Lodge beside a night-only Town watch does not put the watch on its rounds by day".
  It checks two premises (the lodge stands, and so does the watch) and then the atom. The absence of the by-day line is
  anchored on "maintains standard patrol coverage".

The unit arm reads the atom through `factsOf` now; its other cases are unchanged. There is no `test.each`.

THE DETECTOR (`tests/helpers/pageLaws/law13K.mjs`, rule 13e.hours, one small hunk plus its import). It now reads
`orderForceOf(T.record).houses`, not its own name regex, which counted a warden as a force. Results:

- rand-437 and r2r-town-4, rendered at the base: **1 each** under the new rule, 0 under the old one.
- Over the thirty and the 150: **13e.hours is 0 at the base under the old rule, 0 at the base under the new rule, and 0
  at the tip.** K-WATCH's cure had already cleared those 180 towns, and neither the warden town nor r2r-town-4 is among
  them.

## Item 3 · the registers that follow

- **(a) The ruin-filter roster** (`tests/lint/ruinFilterRoster.walker.test.js`, "the scan reads CODE ..."; the stored
  count is 113):
  - live scan: **115 at 99ca9ad51, 116 at the base, 115 at my tip**;
  - the leaf no longer reads `.institutions`, so it no longer enrols, and it needs no row;
  - the getter's one presence test lives in `factsOf.js`, which is already a reader (EXEMPT, file-granular), so the count
    does not move for it;
  - no stored count re-taken.
- **(b) The observed-shape scan** (`tests/lint/observedShapeReaders.walker.test.js`, each run alone; stored `files 438 ·
  identities 1542 · reads 2200 · violations 0`):

| tree | files | identities | reads | violations |
|---|---|---|---|---|
| 99ca9ad51 | 443 | 1553 | 2215 | 7 |
| d1d0c2e28 (K-WATCH, point 48) | 444 | 1554 | 2216 | 8 |
| 215f97d29 (the base) | 444 | 1554 | 2216 | 8 |
| 96530483f (items 1, 4, 5; no item 2) | 444 | 1554 | 2216 | 8 |
| **the tip** | **443** | **1553** | **2215** | **7** |

  The one more is **K-WATCH's**: it arrives at d1d0c2e28, and K-POWERS adds nothing. Items 1, 4 and 5 leave it. Item 2
  removes it: the leaf no longer reads `_worldPulseInactive` or `status`, so the tip is back at 99ca9ad51's figures.
  Never `--write`.
- **(c) NAMED, THE CLOSE'S, NOT TOUCHED.**
  - `tests/lint/poolDominance.walker.test.js`: the un-rowed pool `ledger:safetyProfile:STANDARD_PATROL`.
  - `mutationCoverageManifest`: it lists `tests/generators/bar8Watch.test.js` and `bar8Powers.test.js`.
  - Both are red with the same messages at base and tip (the net, below).

## Measure first and last (`runK.mjs`; the thirty of the seventh read and the 150, rendered by PAGE-COPY at the base and at the tip)

- **IDENTICAL.** The whole `runK.mjs` output is **byte-identical, base against tip**, over the thirty and over the 150: the
  rule table, the by-writer list, the 15b census and the controls. Renders: `census3.sh --count-only`, 180 towns per tree.
- **13a.court · 13e.hours · 13g · 14a · 14d · 15b, base → tip:**
  - the thirty: 2 · 0 · 0 · 1 · 0 · 0 → the same;
  - the 150: 0 · 0 · 0 · 4 · 0 · 0 → the same;
  - 13a.court's 2 in the thirty are the desk's line, C40154 and C34395 (K-DESKS's).
- **No rule of the runner rises.** Totals: the thirty 39 instances in 22 towns; the 150 139 in 64.
- **CONTROLS.** `controls: 43 of 49 as expected` at both, so the runner exits 3 at both. The six misses are the STANDS
  controls K-WATCH and K-POWERS cleared by design (C39616, C42053, C21547, C14226, C44634, C31732), clear at the base and
  clear at the tip. Every STANDS control clear at the base stays clear. Over the 150 the runner exits 0 at both.
- **THE 720 AND THE 1,300.** I did not render them; I hashed and probed them (items 2 and 5).

## The net (each gate alone; base 215f97d29 in a scratch worktree, tip in the checkout)

Run with `vitest --reporter=json`, every gate alone, and compared **by file, test name and failure message**, with paths
normalised (`netcmp.mjs`, scratch).

| gate | base | tip |
|---|---|---|
| `typecheck:ratchet` | — | OK, 167 / ceiling 167 |
| `typecheck:domain:strict` | — | OK, 1113 / ceiling 1113 (a first draft added 1 in `factsOf.js`; fixed) |
| `npx eslint` on the changed files | — | clean |
| `tests/architecture` | 347 / 347 | 347 / 347 |
| all of `tests/lint` | 66 red of 3,226 | 66 red of 3,226, **the same tests**, two messages differing (below) |
| `tests/joins` | green | green |
| `vendorPdfLazy -t "WEAVE ST-2"` | green | green |
| `servicesStructure.test.js` | 1 red ("expected 406 to be less than or equal to 400") | 3 / 3 |
| `bar8Watch.test.js` | 7 / 7 (its own file at the base) | 10 / 10 |
| `bar8Powers.test.js` | 4 / 4 (its own file at the base) | 5 / 5 |
| `standingAgainstFigure.test.js` | 4 / 4 | 4 / 4 |
| N3 `pipelineContract`, `isolatedTrade`, `publicProseEquality` | green | green |
| N3 `pipelinePinnedMode` (3 of 15), `generationForkCensus` (3 of 7) | red | red, **the same tests with the same messages**: no golden row moved by me |
| the older tests (49 files that name one of the brief's words, each alone) | reds: `generatorGoldenMaster` 1 of 3, `writerReach.walker` 9 of 52 | the same tests, the same messages |

THE TWO MESSAGES THAT DIFFER, both mine and both falls (item 3): `ruinFilterRoster` "expected 116 to be 113" → "expected
115 to be 113", and `observedShapeReaders` A1/A7 `{ reads: 2216, identities: 1554, … }` → `{ reads: 2215, identities:
1553, … }`.

THE ONE RED THAT WAS MINE: `crisisStoppedRows.test.jsx`, red at the first tip (bbcc83967's move) and cured by f93d6ee60
(item 1, above). After the repair I re-ran at the final tip: all of `tests/lint`, `tests/joins`, `servicesStructure`, N3,
`crisisStoppedRows`, and every older test that names `servicesGenerator`, `lawlessRow` or `SLOW_LAW_DESC`. Against the base, 25 gates compared by message: **no red at the tip that is not red at the base**. The only
differences are `servicesStructure` (cured) and the two falls above.

Item 3 (c) in the lint reds, red at both with the same messages: `poolDominance.walker` "every drawn pool has a row ..."
(`expected [ 'ledger:rareSecrets:deeds', …(5) ]`), and `mutationCoverageManifest` TOTALITY, which names the two bar8
guards.

## Not mine, by name (left as the prompt says)

- **The watch reader's LOW 3**: a gate held at night read as a day's round (bar0-town-calm-rand-36, -37, -40). The owner
  rules on it at the close. The leaf keeps "a gate is held by day".
- **15d**, the desks' lines, and the one true line lost at bar0-city-under_siege+famine-rand-31 (`rosterText.js:95`).
- **(item 3 c)** the `STANDARD_PATROL` pool's row, and the manifest's two guards. Both are the close's.
- I re-took no stored figure: no reference file, golden, register count, census or ledger.
