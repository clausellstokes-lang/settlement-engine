# CLOSE-SWEEP · the repair seat's hand-back (the close of 2026-11-18)

Seat CLOSE-SWEEP, the repair seat of the close (session `session_01FbPLbfAnjrmBeKNYMtTLWq`; parent: the chair,
`session_01FbPLbcLDSJzZFzb5B7EjxR`). Base: the working line `lane/join-2026-11-14` at **70e557d5b** (the tip read back
equal to the one the prompt named). Branch `lane/close-sweep-2026-11-18`, cut from 70e557d5b; nothing merged. Read
under BRIEF-CLOSE (C1 to C10) and the chair's rulings CL11 (landed points over `600b7683a..HEAD`; S3 compared with
6483322cc), CL13 (S5), CL15 (S3 ruled) and S4 item 1.

| item | commit | test · arm | class (C1) | at 70e557d5b → at the tip |
| --- | --- | --- | --- | --- |
| S1 | 6e15a77ea | `tests/lint/domainAnyCastBaseline.test.js`, 4 arms | (c) a law: new debt | 4 failed / 15 passed → **19 passed** |
| S2 | c266e0dc4 | `tests/lint/factLayers.walker.test.js`, arms (a), LEAVES, POOLS | (c) a law: the table wrong; POOLS (a) a shrink | 3 failed / 12 → 2 failed / 13: **LEAVES green**; (a) red on two instrument gaps, closed by S4.2 (below); POOLS = the door's shrink, CLOSE-DOORS-1B's |
| S3 | none (CL15) | `tests/lint/siteCoherenceRatchet.test.js` C1 | (a) a declared move, re-taken by its door: CLOSE-DOORS-1B's | analysis only, unchanged |
| S4.1 | ae0af7ca9 | `tests/domain/worldFactRederive.test.js` A4 | (b) a stale roster | A4 red → **A4 green** (A7 red at both, same message: CLOSE-DOORS-2's) |
| S4.2 | 890296904 | `tests/lint/factLayers.walker.test.js` arm (a): the instrument | (c) a law: a guard blind to two leaves | arm (a) **green**; the table unchanged |
| S4.3 | 1039b8c26 | the same: `hasInstitution`'s probe | (c) the same gap | green; the table unchanged |
| S4.4 | none (withdrawn) | the presumed-things door's four fresh lines | recorded by the owner's word (CLOSE-DOORS-1B) | nothing changed here |
| S4.5 | 8ecd7c61b | observed-shape readers: `custom`, `isCustom` on `incomeSources` (`tradeListDisplay.js :: harvestScarceHere`) | (c) a law: a reader with no writer | both identities gone at the source |
| S5 | a970ef865 | `vercel.json` (CL13) | not a red: the chair's item | every reader the same at both ends |

No stored figure (register, baseline, census, ledger, golden, ceiling, bundle) was written by this seat. No `DECLARED_OVERRUN`
row, no register row, no ceiling, no test of another seat touched.

## S1 · the 21 new any-holes (6e15a77ea)

**Cause, by landed point** (the four files over an allowance of 0; the counter's own `countText` on each first-parent point of
600b7683a..70e557d5b): `economicsCrisisMarks.js` 0 → 1 at JOIN-17 point 7 (e4b2955f0, BAR6-ECON: the `chainPrintName` cast), 1 → 2
at point 23 (40a6b0a22, BAR7-ECON: `ordinaryOf`'s `town: any`); `factsOf.js` 0 → 1 at point 10 (cd40ad0e0, BAR6-CULTURE: the
`courtSits` getter); `seatMembers.js` 0 → 9 at point 11 (570e3c351, BAR6-POWERS: a new file); `sovereign.js` 0 → 9 at point 2
(e7b6897fd, BAR6-HOUSES, ruling SV1: a new file).

**The hunk: a real type at each hole, comments only.**
- `seatMembers.js`: four local typedefs of the record slices it reads (`SeatPowers`, `SeatPower`, `SeatPerson`, `SeatMembership`),
  kept local (the file stays import-free, EG1).
- `sovereign.js`: local typedefs `SovereignRecord`, `StressEntry`, `RosterHouse`, `SovereignPower`, `SovereignPerson`; the private
  `stressorsOf` returns `StressEntry[]` (an object of the container is read for its `type`), so the `.some` callback can be typed.
- `factsOf.js`: `courtHoldersOf`'s own parameter type, `import('./defence.js').CourtRecord` (a type import; `defence.js` is already a
  runtime import).
- `economicsCrisisMarks.js`: `Parameters<typeof chainPrintName>[0]` for the chain; `ordinaryOf`'s `town` typed as the generator's own
  signature (`incomeLineSiblings.js :: ordinaryIncomeLineOf`: `{ institutions?: unknown } | null | undefined`).

**Proof it is comment-only.** Each file parsed with espree (`ecmaVersion: 'latest'`, module, jsx, `comment: true, range: true`), every
comment's byte range removed, the rest written out (`/tmp/claude-0/probe/strip.mjs`): byte-equal (`cmp`) between the blob at
70e557d5b and the committed blob, all four. (Each new typedef block takes the place of a blank line, so no code-side newline moves.)
`typecheck:ratchet` 167 (ceiling 167) at both ends; `typecheck:domain:strict` 1113 (ceiling 1113) at both; raw `tsc --noEmit` on both
configs, the 70e557d5b archive (11,167 files = `git ls-tree`) against the tree, diagnostics normalised for line/column: **0 introduced,
0 removed** on `tsconfig.full.json` (167) and `tsconfig.domain-strict.json` (1904 raw). No ratchet fell, so nothing for CLOSE-DOORS-1B's
`:update`. `npx eslint` on the four: 0. The baseline file, the ledger and the ceiling are untouched; all four arms green against them.

## S2 · facts that read a part of the record their layer does not declare (c266e0dc4)

**Who reads the table:** `grep -rn factLayers src/ scripts/ tests/`: under `src/` only a comment (`criminalStructureKey.js:68`) and
the table itself. Nothing reads a leaf's layer at run time (it is imported by tests and by `scripts/fact-layers-door.mjs` only).

**ARM (a) MASKED FOUR MORE.** Its loop asserts leaf by leaf and stops at the first failure. Measured whole (every leaf's verdict, the
walker's own `leafArm` on its own grid, `/tmp/claude-0/probe/fl/leaves.probe.test.js`), 70e557d5b holds SEVEN red leaves:

| leaf | at 70e557d5b | landed point that made it (first-parent bisect over every point, 6c117344f..70e557d5b; CL11's range 600b7683a..HEAD) | cure here |
| --- | --- | --- | --- |
| `legalHouse` | reads `availableServices`, declares `institutions`, layer 1 | BAR5-THINGS c74829e25 (the notary's services, `legalHouse.js:48`), JOIN-16 point 9 (db62ab299) | declared; placed at **2** (the form of `courtSits`) |
| `timberAtHand` | reads `resourceAnalysis` (layer 3), at layer 2 | BIRTH-3, the sixth chair's point 33 (e0242a12a: `supplyStory.js` / `houseKinds.js` under `houseInputAtHand.js`) | declared; placed at **4** (as `tradeAtWork`) |
| `timberReachesSawmill` | the same | the same | the same |
| `tradeAtWork` | reads `economicViability` (layer 3), undeclared, at layer 4 | JOIN-17 point 5 (a010f4f9c, BAR6-MARKS) | declared; stays at 4 |
| `importsAsPrinted` | reads `economicViability`, undeclared, at layer 4 | JOIN-17 point 23 (40a6b0a22, BAR7-ECON) | declared; stays at 4 |
| `goodExported` | declares `economicState`, the walker sees no read | JOIN-17 point 9 (d8997b193, BAR6-SCENES) | **LEFT** |
| `seatHeld` | declares `npcs`, `powerStructure`, the walker sees no read | JOIN-17 point 8 (57a3bda67, BAR6-PEOPLE) | **LEFT** |

**(Closed afterwards by S4 items 2 and 3, on the chair's word: below.) Named at S2, for the chair:** `goodExported` and `seatHeld` are `factsCall` getters (they take an argument), and the walker's
instrument `tests/lint/factLayers.shared.mjs :: leafTouches` has a call branch for `hasInstitution`, `hasOtherNpc`, `sharesPower`,
`sharesPlace`/`loneTie` and `tradeAtWork` only: it never calls these two, so their honest declarations read as "unread". The cure is in
the walker's instrument (a branch calling each, as `tradeAtWork`'s), not in the table; striking the declarations would make the table
lie. Not this seat's file: named. At c266e0dc4 arm (a) stood red on `goodExported` (first in order).

**The pools arm after the move:** `r.violations` differs from `REGISTER.pools` by the one shrink row only
(`DS-ECO-6::TIER: minor shadow activity (≥3)`, "declares organised crime (layer 3)"): **no pool or line that declares `legal house`,
`timber at hand` or `timber reaches the saws` reads at or above its own layer**; no ordering fault. The shrink is CLOSE-DOORS-1B's door
(`node scripts/fact-layers-door.mjs --shrink`), not taken. "POOLS by their KEY" and every other arm green at the tip.
eslint 0; both type gates at their ceilings; the any-count of the table 0.

## S3 · the site-coherence row that grew (analysis only; ruled by the chair, CL15)

THE FINDING, as sent to the chair (word for word):

> CLOSE-SWEEP S3 (site coherence, `desert|mountain-flank|coal` 7 → 9; `desert|dunes|(biome)` 30 → 28): analysis only, nothing changed. THE TWO: Arm A `desert/thorp/road/latin@scw0-a5` and `desert/hamlet/road/arabic@scw0-a5` (the ratchet's own derivation, per row). Resources are the same at 6c117344f and 70e557d5b. Their exports at 6c117344f were [Raw sand, Water rights, Oasis provisions, Sacred wood, Ritual components] → dunes (biome). Now: Raw sand gone, Coal in → mountain-flank|coal. BISECTED over first-parent: point 5 a010f4f9c reads dunes; point 6 0ecd003d6 (BAR6-RECORD at 04ef95b44) reads flank. THE CAUSE: BAR6-RECORD (b) e9b36b024, its declared move "primaryExports 75: Raw sand 48" of the 525: `GOOD_WORKING_HOUSES['Raw sand'] = ['glass']`, so raw sand leaves only where a glasshouse stands. Neither town has one, so ungated Coal fills the fifth slot. The flank itself is `siteGenesis.js:252`'s old arm order (cbbf04c55, 2026-07-17): a coal/ore/stone export → mountain-flank, tested before the dry-biome dunes arm. The same arm gives the seven rows already there. VERDICT: not a fault of the birth's ground reading, and no seat cured it on purpose. A declared export cure exposed a pre-existing flank-on-flat reading on two more towns. Curing the arm moves pages (C5); the row only shrinks (C4). Yours to rule. I wait on S3 and go on with S2.

**The two towns' exports** (`canonExports`, the ratchet's own bag), at 6483322cc (the last close's tip, CL11) and at 70e557d5b:

| row | at 6483322cc (= at 6c117344f) | at 70e557d5b |
| --- | --- | --- |
| `desert/thorp/road/latin@scw0-a5` | Raw sand, Water rights, Oasis provisions, Sacred wood, Ritual components (each "taxed by occupation") → `desert\|dunes\|(biome)` | Water rights, Oasis provisions, Sacred wood, Ritual components, **Coal** → `desert\|mountain-flank\|coal` |
| `desert/hamlet/road/arabic@scw0-a5` | the same → `desert\|dunes\|(biome)` | the same → `desert\|mountain-flank\|coal` |

Their `config.nearbyResources` are the same at both ends (glass_sand, oasis_water, grain_fields, ancient_grove, coal_deposits).
**flank-on-flat: 39 at 6483322cc** (= the stored `totals.flankOnFlat` 39) **→ 41 at 70e557d5b**; `desert|mountain-flank|coal` 7 → 9,
`desert|dunes|(biome)` 30 → 28, every other row the same (462 of 462 rows compared, 6c117344f against 70e557d5b: exactly these two moved).
The chair's ruling (CL15): no cure at the close (re-ordering `siteGenesis.js:252` re-sites every dry town that exports coal, ore or stone:
C5); a wave of the site-coherence plan, after the deploy, on the pull request's list of known faults by name; the inventory re-recorded
through its own door by CLOSE-DOORS-1B.

## S4 item 1 · A4's culture-reader roster (ae0af7ca9)

A4 alone at 70e557d5b: red, "the culture reader set under src/generators is EXACT in BOTH directions … expected [ …(27) ] to deeply
equal [ …(26) ]", the one unlisted reader `src/generators/economy/foodBaseNumbers.js`. **The cause confirmed:** DEBT-1 part C,
4f57f0c46 (`foodBalance.js` 21 lines out, `foodBaseNumbers.js` 24 in, `servicesGenerator.js` 4; landed at JOIN-17 point 31,
c935f2e23): the 18 lines after the FOOD-2 section heading are **byte-equal** where they stood (the removed side of the diff) and where
they stand (`foodBaseNumbers.js` from line 7; unchanged since). A4's reader is a substring test, `includes('culture')`: the new file
matches through "agricultureCapacity" in `grownShareOf`'s doc, and reads no culture (the `foodLand.js` precedent, "reported, not
filtered"). The file it LEFT, `foodBalance.js`, still holds "agriculture" in its own code, so its row stays. **The re-derive's reach:**
nothing under `src/` or `scripts/` reads the roster; `rederive` (`dmLayer.js:911`) re-runs the whole pipeline (the test's
`ENGINE.run = generateSettlementPipeline`), not a set of files, and `foodGenerator.js:178,237-238` and `foodBalance.js:253-254` call both
moved readers through `foodBalance.js`'s re-export: the hunk is inside the re-derive's reach. **The hunk:** one roster row with its dated
reason. A4 alone at the tip: green. The whole file: base 2 failed / 5 passed (A4, A7), tip 1 failed / 6 passed (A7, the same message:
"the stride is non-empty, or the absence above is vacuous: expected 5 to be +0"): A7 is CLOSE-DOORS-2's.

## S4 item 2 · the walker's instrument sees every key (890296904); item 3, `hasInstitution` (1039b8c26)

The chair's word (S4.2): the gap named under S2 is this seat's to close (a test instrument; no `src/` behaviour). **The cause:**
`tests/lint/factLayers.shared.mjs :: leafTouches` had call branches for five `factsCall` getters and none for `goodExported` (JOIN-17 point 9)
or `seatHeld` (point 8); its `tradeAtWork` branch probed four typed keys of the seventeen the vocabulary declares (point 45 added
`ironwork in full`, `fish taken here`); `hasInstitution` probed ten typed kinds of the fourteen declared (no bathhouse, quarry, mine,
school). **The hunk:** `vocabularyKeysOf(getter)`, the keys of every `FACT_DIMENSIONS` row homed at the getter, derived; `tradeAtWork`
(17), `goodExported` (5) and `hasInstitution` (14) probed with all of them; `seatHeld` with every pair of the roster (i < j); a
`factsCall` getter with no branch now THROWS ("has no call here, so the walker would never see it read"); the typed lists are gone. And
arm (a) of the walker COLLECTS every failing leaf (`expect(failing).toEqual([])`) instead of stopping at the first. **What the fuller
instrument sees:** `goodExported` reads `economicState`, `seatHeld` `npcs` and `powerStructure`, `hasInstitution` `institutions`, exactly
as declared; `tradeAtWork` reads nothing beyond its row. **The table needs no change.** Arm (a) green, LEAVES green, "POOLS by their KEY"
green; POOLS differs from the register by the one shrink only (the door's read-only report, `node scripts/fact-layers-door.mjs`: "0
rise(s), 1 fall(s)"): no pool or line reads at or above its layer; no ordering fault. **Controls** (a scratch copy of the tree): the base
table (70e557d5b's `factLayers.js`) under the collecting loop lists all five red leaves at once (legalHouse, timberAtHand,
timberReachesSawmill, tradeAtWork, importsAsPrinted; goodExported and seatHeld now read); a planted `plantX` `factsCall` row throws "the
factsCall getter 'plantX' has no call here". eslint 0; both type gates at their ceilings (167; 1113).

## S4 item 4 · the presumed-things door's four fresh lines (PREPARED IN SCRATCH; WITHDRAWN)

Withdrawn by the chair at the owner's word (2026-11-18 04:41:48 UTC, "record the four": the four sentences stand; CLOSE-DOORS-1B writes
the rows). Nothing of it was committed: the scratch trees were discarded. What it taught, for the next seat that writes a twin:
- **What the walker credits** (`tests/lint/presumedThings.shared.mjs :: scanSource`): a literal of 3+ words naming a registered thing is
  declared only by `needs` / `excludes` / `crisis` / `poolDeclares` (and a pool variant's `marks`, a tagged table's `tags`) on an object
  literal the tree's trace marks DRAWN (`drawnRanges`: reached from a door's argument, `DOOR_ARGS`), within five levels up, by a builder
  row's `needs` / `excludes`, or by a drawn table keyed by the line's own text; a bare `const` twin, or a table no door is handed
  (`GUARD_LAW_SIBLINGS`), declares nothing. The form that does, at no runtime cost: `lineText({ text, needs: [...] })` (it hands back the
  string; `guardLineUnderTheLaw.js :: MILITIA_TURNS_OUT` is the precedent).
- **A rewording mints a new literal**, so every thing it still names becomes a fresh, UNBANKABLE hit (the door banks only a literal that
  stood at `--base`): the hired company's twins, rid of "garrison", still named `armedForce` through their first sentence ("professional
  soldiers", "a band of soldiers"); "hired swords" names nothing, "free company" names `mercenary`; `armedForce` also counts `mercenary`
  among its sufficient atoms (`registeredWords.js :: armedForce`), so `needs: ['mercenary']` on a Free company hall's own row would
  declare it.
- **Measured in scratch against the door's `--check`:** the bowyers' "defenders" → "defence", the two "garrison …" clauses dropped, the
  two first sentences' "soldiers" → "hired swords", and the court-and-prison twin wrapped in `lineText({ …, needs: ['court', 'prison'] })`
  took the four lines' six keys out of the fresh list (38 → 32) and touched no other row.

## S4 item 5 · two dead reads on an income share (8ecd7c61b)

**S4.5 (8ecd7c61b):** `harvestScarceHere`'s filter read `sh.custom` and `sh.isCustom`, written on no income share under `src/` (the birth's `incomeBuild`, custom goods' `{ source: <good> + ' Trade' }`, the pulse, the editor, an import: none; those keys are written on services, houses, resources, content items); both conjuncts out, `sh.source !== 'custom'` kept (a share's `source` is its line's title, never the bare word, so it is always true). Cause: JOIN-17 point 14 (93eb061ff).
**Proof:** the observed-shape scan (`--scan-only --scan-mode=legacy-leaf`, clean HEAD before and after) 2,215 → 2,213 findings, exactly those two identities gone, none new, no other inventory row moved; 525/525 hashes and 30/30 dumps equal; the file's 22 importing test files alone, 22/22 identical at both ends; both type gates at ceiling (167; 1113); eslint 0.

## S5 · lane pushes create no deployment (a970ef865)

`vercel.json`: one new top-level key, `"git": { "deploymentEnabled": { "lane/*": false, "lane/**": false } }`; nothing else in the file
moved; `master` not named, no bare `false`, no `*` key. `docs/DEPLOY.md`, the post-push checklist's Vercel item: one dated sentence (pushes
to `lane/*` create no deployment; the daily allowance). **The file list of the commit: `vercel.json`, `docs/DEPLOY.md`: no file under
`src/`, so no town and no page can move.** Every reader of `vercel.json` (`grep -rl vercel.json tests scripts`), each alone, base and
tip, the same by name and count: `buildHeapPinned` 2/2, `ciGateHardening` 32/32, `metaShell` 20 passed + 1 skipped of 21 at both,
`deployRunbookFreshness` 15/15, `testRatchet` 86/86, `cspForkIsolation` 12/12, `cspHeaderShape` 17/17, `mapForkXssChain` 65/65. No test
pins the file's keys. `npm run validate:edge` green at both; no other `validate:*` script names the file (`scripts/vercel-ignore-build.mjs`
names it in a comment only).

## THE PROOF THAT NO TOWN AND NO PAGE MOVES

The commits that touch `src/` are S1 (6e15a77ea, comments only) and S2 (c266e0dc4, a data table no `src/` file reads); S4.1, S4.2,
S4.3 and S5 touch no file under `src/`. Each proof at the base 70e557d5b and at the commit, each tree a `git archive` (integrity-counted).

1. **The 525 reference configurations, hashed whole** (`sha256(JSON.stringify(settlement))`, the golden master's own `goldenCorpus()` and
   `keyOf`, its own `generateSettlementPipeline(cfg, null, { seed, customContent: {} })`, from an untracked probe outside every tree,
   `/tmp/claude-0/probe/gm/gm.probe.test.js`; never `UPDATE_GOLDEN`): **525 of 525 equal** (`cmp` of the two manifests) at 6e15a77ea, at
   c266e0dc4 and at the tip 1039b8c26.
2. **The thirty towns of the seventh read** (`seeds.bar7.txt`, `lane/read7-prep-2026-11-17`) rendered by PAGE-COPY (`census3.sh … 4
   --seeds … --count-only`, `HOLDERS=holders.tipA.json`): **30 of 30 dumps byte-equal** (`diff -r`) at 6e15a77ea and at the tip 1039b8c26.
   At c266e0dc4, rendered while the net and a bisect loaded the machine, ONE dump differed (below, (B)); re-rendered 3 times it equalled the
   base, and the tip's quiet run is 30 of 30.
3. **`npx vitest run tests/architecture`**: 347 / 347 at the base (from a clean path) and at the tip.
4. **Every test file that imports a changed file** (directly: `economicsCrisisMarks.js`, `factsOf.js`, `seatMembers.js`, `sovereign.js`,
   `factLayers.js`; 122 test files), each alone, base and tip, by name and by whole message: **121 of 122 identical**; the one that differs is
   `tests/lint/factLayers.walker.test.js`, by the two arms this branch cures (base 12/15, tip 14/15; the third, POOLS, is the door's
   shrink). Red at both ends with the same message (none of mine): `bar3CorpusGuards` 1, `bar6PowersCards` 1, `census2dTables` 3,
   `houseDescLateReRead` 1, `presumedThings.walker` 2, `ruinFilterRoster.walker` 1.

**(B) THE SEED THAT DIFFERED ONCE UNDER LOAD** (the chair's word, word for word). Seed **`bar0-thorp-calm-rand-45`**; tab **`Systems/Power`**
(the dump's heading `== Systems/Power ==`, line 183); the base dump holds, as its last two lines of that tab (lines 222-223), and the run
under load at c266e0dc4 lacks:

    Patron deity
    Assign a patron god to awaken the settlement’s religion layer. Upgrade to premium · Available at launch to author and assign deities.

(every other line of the 1,178 the same; both files kept: `/tmp/claude-0/keep/bar0-thorp-calm-rand-45.base.txt`,
`/tmp/claude-0/keep/bar0-thorp-calm-rand-45.s2-under-load.txt`). **The cause: the probe captured before a lazy part mounted, not the page.**
That block is `src/components/settlement/DeityAssignmentPanel.jsx`, a `React.lazy` chunk (`src/components/dossier/dossierLazyTabs.js:37`)
mounted under `<Suspense fallback={null}>` (`src/components/OutputContainer.jsx:725`): until the chunk resolves it renders nothing, and
under load it resolved after PAGE-COPY's "the panel's text holds still" window closed. **The six quiet re-renders** (that one seed, one
worker, nothing else running), six at the base and six at the tip: **12 of 12 byte-equal to the base dump**. The page renders one way from one
record. The wait belongs in the probe: `docs/chair/2026-11-16/probes/PAGE-COPY/render.census3.jsx` (on `lane/chair-2026-11-08`), its
snapshot of a tab, should wait for every `Suspense` boundary of the tab to resolve (or for the lazy `DeityAssignmentPanel` to mount) before
the stillness test: an item for the probe's keeper, not changed here.

## THE NET (C7)

Each gate alone, through `sh scripts/gate-tail.sh`, at the base 70e557d5b and at the tip 1039b8c26. The suites ran in `git archive`s of
each commit (integrity-counted: 11,167 and 11,168 files = `git ls-tree -r`), `node_modules` linked in; by message with the JSON reporter.

| gate | 70e557d5b | 1039b8c26 |
| --- | --- | --- |
| `npm run typecheck:ratchet` | OK, 167 (ceiling 167) | OK, 167 (ceiling 167) |
| `npm run typecheck:domain:strict` | ✓, 1113 (ceiling 1113) | ✓, 1113 (ceiling 1113) |
| `npx eslint` on the branch's 8 changed code files | (S1: 0 on the four) | nothing reported (exit 0) |
| `tests/lint` (778 files, 3,211 tests) | 3,123 passed · 72 failed · 16 skipped | **3,129 passed · 66 failed · 16 skipped** |
| `tests/joins` | 425 / 425 | 425 / 425 |
| `tests/architecture` | 347 / 347 | 347 / 347 |
| `tests/build/vendorPdfLazy.test.js -t "WEAVE ST-2"` | 12 passed, 43 skipped | 12 passed, 43 skipped |

**`tests/lint` BY MESSAGE.** Six reds cured, all of my list: the four any-cast arms (S1) and `factLayers.walker`'s arm (a) and LEAVES
(S2, S4.2, S4.3). **The other 66 are the same 66 at both ends, and their WHOLE failure text is identical** (every line of every failure
message, the trees' paths normalised: 66 of 66 equal), so no figure inside them moved by this branch. One of them is the machine's
(class d): `ledgerCitationIntegrity.test.js` reads `refs/heads/review-fixes-2026-07-08` with git, and an archive has no `.git` (the same
at both ends). A probe artefact, also class (d), is named so nobody re-meets it: `tests/architecture/archViewWall.test.js` ("lives outside
the arch/ determinism perimeter") reds in ANY tree whose absolute path contains `/arch/` (it tests `govPath.includes('/arch/')`); my first base
archive sat under `/tmp/claude-0/arch/` and read 346/347; from a clean path, 347/347 at both ends.

## STORED FIGURES MY CURES MOVE (named for the seats that hold them; none taken here)

| figure (file) | reading test | what moves | holder |
| --- | --- | --- | --- |
| the any-cast baseline (`tests/lint/.domain-any-baseline.json`), its ledger and ceiling | `domainAnyCastBaseline` | **nothing**: the four files are at 0 = their allowance; no row, no stale entry | none |
| the fact-layers register (`tests/lint/factLayers.register.json`) | `factLayers.walker` | **nothing by my cures**: the LEAVES register now equals the tree as committed; its POOLS fall (`DS-ECO-6::TIER: minor shadow activity (≥3)`) pre-exists at 70e557d5b | CLOSE-DOORS-1B (`node scripts/fact-layers-door.mjs --shrink`) |
| the site-coherence inventory (`tests/lint/.site-coherence-baseline.json`) | `siteCoherenceRatchet` C1 | not by me (S3, CL15): `desert\|mountain-flank\|coal` 7 → 9, `desert\|dunes\|(biome)` 30 → 28, `totals.flankOnFlat` 39 → 41 | CLOSE-DOORS-1B |
| the observed-shape readers' input stamps (`scripts/.observed-shape-readers-baseline.json`: each `src/` file's `sha256` and `size`) | `observedShapeReaders.walker` | the bytes of five `src/` files move (the four of S1, `factLayers.js`); the stamps were ALREADY stale at 70e557d5b for three of them (`factLayers.js` stored b243507a…, the base edd5258e…) and absent for `seatMembers.js` and `sovereign.js`; the walker's whole failure text is identical at both ends | the doors' seat that re-takes that baseline (its `--write`) |
| the figures that count the tree (C8: the estate file census, byte and size ceilings, the test ratchet, the mutation manifest) | the counting walkers | ONE new file (this hand-back); eleven files' bytes (`git diff --name-only 70e557d5b HEAD`); no test file added, renamed or removed, no test name changed (two test bodies: `factLayers.walker` arm (a), `worldFactRederive`'s roster) | the last seat, on the tree that holds every close commit |

## WHAT I LEFT, BY NAME

- `tests/lint/factLayers.walker.test.js` POOLS: the DS-ECO-6 shrink row, CLOSE-DOORS-1B's door.
- `tests/lint/siteCoherenceRatchet.test.js` C1: CLOSE-DOORS-1B's door (CL15); `siteGenesis.js:252`'s arm order on the pull request's list
  of known faults.
- `tests/domain/worldFactRederive.test.js` A7: CLOSE-DOORS-2's.
- The PAGE-COPY probe's wait for a lazy part (`docs/chair/2026-11-16/probes/PAGE-COPY/render.census3.jsx`, `lane/chair-2026-11-08`):
  for the probe's keeper ((B) above).
- The presumed-things door's four lines (S4.4): recorded by the owner's word; CLOSE-DOORS-1B writes the rows.
