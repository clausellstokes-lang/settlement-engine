# EP / EP-3B — the year anchor (stage 4, the final stage of the `ep-1` split promotion)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `d2ea34c196ef9fe724d2c6dbaeca95aa4b662a52`
  (the EP stage-three terminal — EP-2 + EP-3A, ODQ §197.4c)
- **Train:** `ep-1`, family **EP**, member **5** of 5. **This packet is stage 4 and promotes
  ALONE**, which is lawful because EP-3A's LANDED status released `advanceEpochLedger.js`,
  `pulseKernel.js`, `roadsKernel.js` and `npcLadderKernel.js` — the four paths that made the
  five-member train convict duplicate change paths when put co-live. `validate:packets`
  reports **0 READY** at this base, so no packet reserves a path this one needs.
- **Preamble:** none. A family preamble is a chair act and EP still has none.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§197.4c** (stage four dispatched) · **§188.3**
  (the four-stage split promotion) · **§75** (the mutant-control idiom) · **§183.3** (no lane
  inherits `BASE_STATE` figures) · **J-EP-13** (`yearBase` REQUIRED and defaultless) ·
  **J-EP-14** (the slice boundary revision 6 moved).
- **Design authority:** `docs/DESIGN_FP_ARCH_EP.md` §3b.1 (seam edits 7 and 8), §3b.1a (the
  `byYear` writer, the ordering proof, the STAMP-SURVIVAL PIN), §3b.2 (family 2's re-root
  spec), §3b.2a (the RS-9 split-read ruling), §4 (EP-3 slice B), §8.1 row 3.
- **Compile of record:** `laneTC24-EP-PLAN.md` §3.4.
- **THE FLAG:** `advanceEpochEnabled` — a NO-FLAG SLICE. The §49/§50/§148 bill was paid by
  EP-1; this member touches no manifest and mints no key.

---

## §1 · WHAT THIS WAVE DOES

Slice A gave every TICK-VARYING draw the epoch of the tick it runs on. **The nine YEAR-KEYED
draws need a different fact, and giving them the tick's epoch would be the exact inversion of
the feature**: a lived year would change its weather between two ticks. What a year-keyed draw
must read is the epoch of the advance that FIRST ENTERED that year — so the one writer grows a
`byYear` map under FIRST-WINS, a second accessor reads it, and the nine compositions re-root at
their EIGHT read sites plus RS-9's second argument.

The consequences are the product: a lived year keeps its winter, its festivals and its road
rhythms across every tick of that year; an undo that un-lives a year takes that year's epoch
with it, so the re-advanced future is genuinely new; and **a world with history that lights the
flag repaints NOTHING it already lived**, because a year lived dark carries no row at all.

## §2 · THE CURE

**THE WRITER'S SECOND HALF.** `stampAdvanceEpochYear` gains `byYear` in the SAME
`setSpatialLedger` call — still ONE writer, still ONE write site in `src`. FIRST-WINS: a year
already present is never repainted and its map object is RE-USED BY REFERENCE.

**THE ACCESSOR.** `yearStreamSeedOf(worldState, year, { base, yearBase })` — `base` is the
site's own coercion (the `{ base }` shape slice A's §3 established, binding here too), and
`yearBase` is REQUIRED with no default because two sites name the same lived year one lower
than the other seven.

**SEAM EDITS 7 AND 8, BOTH AT +0 LINES.** Edit 7 `;`-joins onto the `seasonClock` line and
reads the POST-advance `worldState`; edit 8 turns `rngSeed: startingWorldState.rngSeed,` into
`rngSeed: seasonSeed,`. The kernel's import line GAINS `yearStreamSeedOf` as a token edit.

**THE NINE RE-ROOTS.** RS-2 (`pulseKernel.js`) · RS-3 (`generosityKernel.js`, `yearBase: 0`) ·
RS-4 + RS-6 (`traditionsKernel.js`) · RS-5 (`roadsKernel.js`, ⚠ a SECOND binding, never a
re-point) · RS-7 (`traditions/politics.js`) · RS-8 (`traditions/relations.js`) · RS-9's SECOND
ARGUMENT (`npcLadderKernel.js` → `npcLadderContest.js`, `yearBase: 0`) · RS-16
(`townMap/mapDress.js`, the display-surface rule).

**Budgets, all measured with eslint's own `Linter`:** the leaf 21 → **37** (≤ 200) ·
`pulseKernel.js` **1581 → 1581, DELTA 0** · `roadsKernel.js` **838 → 838, DELTA 0** ·
`generosityKernel.js` **800 → 800, DELTA 0** · `npcLadderKernel.js` and `npcLadderContest.js`
**+0** · `traditionsKernel.js`, `politics.js`, `relations.js`, `mapDress.js` **+1** each ·
`src/lib/spatialUsage.js` **ZERO EDITS**.

## §3 · ⛔ THREE FINDINGS THAT CHANGED THE CURE

**⛔ A SECOND FILE WAS PRICED SHORT, AND IT IS AT ITS LAYER CEILING RATHER THAN A BASELINE.**
`generosityKernel.js` sits at **EXACTLY 800 effective lines**, which is the `src/domain`
`max-lines` ceiling itself — it carries no `.size-baseline.json` row, so nothing in the volume
or the compile flagged it. An own-line import reds eslint outright. **CURE: the import is
`;`-joined onto an existing import line at +0**, the same technique slice A used at
`roadsKernel.js` for the same reason. *Vetoable: the veto is a chair-signed layer-ceiling
exception.*

**⛔ THE READ-SITE CENSUS COUNTS LINES, NOT OCCURRENCES, AND THAT IS WHAT MAKES SLICE B FIT.**
Every re-root wraps its site's existing expression ON THE SAME LINE, so the census stays at
twenty-two with no roster edit. **The one place it moved is seam edit 8**: the read migrated up
to edit 7's line and the old line became an object-literal `rngSeed:` KEY fed by an
already-classified value — a fourth write-key site. It is dispositioned as a DERIVED HAND-OFF
with its reason rather than absorbed by widening the detector. *Vetoable: the veto is to spell
edit 7 inline at the consumer, which would re-compose the accessor once per settlement inside a
loop whose clock is measured loop-invariant.*

**⛔ `advanceContests` GAINED A REQUIRED SECOND SEED, AND TWO UNIT SUITES CALL IT DIRECTLY.**
Row 20 reads `supportSeed`; rows 17/18/19 keep the tick-anchored `seed`. The two direct-calling
suites are threaded with `supportSeed` spelled EQUAL to `seed`, which is the value the kernel
composes when no epoch is in play — so every draw in those suites is byte-identical to what it
was. **A default was refused**: a defaulted second seed is precisely the silent-vocabulary
defect J-EP-13 exists to foreclose. *Vetoable: the veto is `supportSeed = seed` as a parameter
default.*

## §4 · ACCEPTANCE

| id | case |
|---|---|
| A1 | the nine family-2 rows each observe a call under ONE lit year-crossing advance plus ONE view-time read, and each composes from the ENTERED YEAR's epoch |
| A2 | the returned-world arm: `byYear` carries the entered year's epoch on the world the kernel RETURNS and through a real JSON round-trip |
| A3 | J-EP-13: the `yearBase: 0` sites resolve to the SAME lived year as the `yearBase: 1` sites, with both vocabularies proven present |
| A4 | FIRST-WINS: a second stamp in a lived year leaves `byYear` byte-unchanged and re-using its object reference, while `latest` moves |
| A5 | the already-lived-year pin: a year lived dark carries no row, so lighting the flag repaints nothing |
| A6 | DARK: no `byYear` at all, and every family-2 key is byte-identical across two epochs under four hostile seed inputs |
| A7 | the family-2 classification gate: every YEAR-KEYED composition is fed by a rostered module, every call declares its `yearBase`, and neither anchor reaches the other's roster |
| A8 | the display-surface source pin: `advanceEpoch` reaches the view only through the sanctioned leaf import |

## §5 · CHECKS

```
npx vitest run tests/domain/advanceEpochStampSurvival.test.js \
  tests/lint/entropyRootCensus.walker.test.js \
  tests/lint/advanceEpochSingleWriter.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lib/spatialLedgerCoverage.walker.test.js \
  tests/lint/sizeBaseline.test.js \
  tests/lint/couplingInclusion.walker.test.js \
  tests/domain/npcLadderContest.test.js tests/domain/contestBluffCharge.test.js \
  tests/domain/roadsKernel.test.js tests/domain/npcLadderKernel.test.js \
  tests/domain/traditionsKernel.test.js
```

## §6 · PRICED OBLIGATIONS

| obligation | verdict |
|---|---|
| **size baseline — `pulseKernel.js`** | **INCURRED AND DISCHARGED AT ZERO.** The train's one declared ratchet-up (J-EP-11) was spent by slice A; slice B's import edit adds a SYMBOL to a line that already exists and seam edits 7 and 8 are token edits on existing lines |
| **size baseline — `roadsKernel.js`** | **INCURRED AND DISCHARGED AT ZERO.** Tolerance-zero in both directions; the second binding is `;`-joined onto the first |
| **eslint layer ceiling — `generosityKernel.js`** | ⛔ **INCURRED, AND IT IS §3's FIRST FINDING.** At EXACTLY the 800-line `src/domain` ceiling with no baseline row; the import is `;`-joined at +0 |
| **§102.3 — mutation coverage** | **NOT INCURRED.** No new test file lands: the estate's test census sits at its pinned ceiling, so both instruments extend files EP-3A already registered |
| **test census** | ⛔ **INCURRED.** Files, parked and credited are UNMOVED; titles and suite titles are re-recorded with a per-file decomposition that closes with nothing left over |
| **entropy-root census** | ⛔ **INCURRED IN FOUR PLACES.** Four composition row TEXTS, three hand-off anchors, two new declared receiving identifiers, one new write-key disposition row, and the closure record — every one re-recorded with its cause, none widened |
| **spatial-ledger manifest** | **NOT INCURRED.** `src/lib/spatialUsage.js` gets ZERO edits: slice A landed the `advanceEpoch` EXEMPT row and its written reason already carries the `byYear` note |
| **coupling registry** | **NOT INCURRED at this scope.** The leaf's one new edge is to `worldPulse/worldState.js`, a module `seasons.js` already imports from every consumer of this leaf outside `worldPulse/`; `couplingInclusion.walker.test.js` re-run green rather than argued |
| **§104.4 — edge-shared closures** | **NOT INCURRED.** The one display-side importer (`townMap/mapDress.js`) already reaches `worldState.js` transitively through `seasons.js`, so no closure gains a module |
| **§85.4 — seeded-chooser registry** | **NOT INCURRED.** The accessor COMPOSES seeds and chooses nothing |
| **declared shift** | **NOT INCURRED.** Byte-identical dark by construction — the writer returns the IDENTICAL reference dark and the accessor returns its argument by identity |

## §7 · MUTANTS, ALL EXECUTED ON THE LIVE SUBJECT, EACH RESTORED `cmp`-EXACT

| mutant | plant | result |
|---|---|---|
| **(i)** | seam edit 7 re-aimed at `startingWorldState` (the pre-advance world) | **2 failed \| 17 passed** — the two arms that observe RS-2, and nothing else |
| **(ii)** | the stamp stripped at `pulseKernel`'s `memoryState` seam | **11 failed \| 8 passed** — both families' post-apply rows and both returned-world arms |
| **(iii)** | the same strip ONE FILE OUT, at `applyWorldPulseOutcomes`'s return | **11 failed \| 8 passed** — the identical signature, from a different file |
| **(iv)** ⭐ | the stamp dropped from the RETURNED world, after the last family-2 read | **7 failed \| 12 passed** — the arms and RS-16 ONLY; the eight in-pulse rows and J-EP-13 stay GREEN |
| **(v)** | RS-9's `yearBase` flipped 0 → 1 | **2 failed \| 48 passed** — the row roster and the two-vocabulary pin |
| **(vi)** | the FIRST-WINS `byYear[year] != null` guard dropped | **1 failed \| 18 passed** — the first-wins pin alone |

⭐ **MUTANT (iv) IS THE ONE THAT EARNS THE RETURNED-WORLD ARM ITS OWN RULING**, and the
asymmetry against (ii) and (iii) is the receipt: a stage that drops the stamp AFTER the last
read is invisible to all eight composition rows and to the vocabulary pin, and is caught only
by the arm and by the view-time row that reads the world the advance returned.

## §8 · HAZARDS AND DISPOSITIONS

- **⚠⚠ FIVE OF THE NINE ROWS REPORTED A ZERO AT FIRST WRITE, AND EVERY ONE WAS A REAL GATE.**
  `advancePolitics` RETURNS EARLY at the first-lit mint, so RS-7 is structurally unreachable on
  a world with no tradition ledger — the fixture drives TWO advances, which is also the honest
  shape for a year anchor. RS-4 and RS-6 need the second tick to land inside an observance
  window (the founding set opens at weeks 10, 34 and 51) AND cross a year boundary. RS-8's
  imposition reads `occupierId`, NOT `overlordId`. RS-3 sits behind a three-way conjunction
  whose third term, `beliefsActive`, is false whenever the info mode is the default
  `omniscient`. Each was cured in the FIXTURE and never in an assertion.
- **⭐ THE RESULT IS THE ONE THE VOLUME ASKS FOR:** all nine rows are reached ORGANICALLY by
  one lit year-crossing advance plus one view-time read. Not one row is driven at a door.
- **⚠ THE NINE ROWS CANNOT BE TOLD APART BY THEIR ARGUMENTS** — seven pass an
  argument-identical options bag and two of those seven sit in the SAME module. The spy
  attributes by the CALLING FRAME (module plus function, from the stack), which is test-only
  and costs production nothing.
- **⚠ A MID-YEAR SECOND ADVANCE READS THE FIRST ADVANCE'S EPOCH, AND THAT IS THE FEATURE.**
  Measured during fixture work: with the first advance already inside year 2, the second tick
  left `byYear` untouched and every row composed the FIRST epoch while `latest` carried the
  second. A reader who expects the tick anchor's behaviour here will mis-diagnose it.
- **⚠ THE FAMILY-2 ACCESSOR'S `worldState` IS NULLABLE AND THE FAMILY-1 ACCESSOR'S IS NOT.**
  Family 2 is the only family with a display-surface consumer, and a dresser is legitimately
  handed a world-or-null. The asymmetry is stated at the signature so it is not "tidied".

## §9 · WHAT STAGE FIVE INHERITS

**NOTHING — THE `ep-1` FAMILY CLOSES HERE.** All five members (EP-0, EP-1, EP-2, EP-3A, EP-3B)
are landed, the seam contract's nine enumerated edits are all spent, the flag mint is spent,
the one declared kernel ratchet-up is spent, and both accessor families are re-rooted with a
classification gate over each. What the CI re-premise train inherits instead is recorded in the
lane receipt: the E5 kernel stale-strap (`assertEpochPinnedInTest` fires on two lawful
production states in test runs), the volume's owed amendments at §3b.1a's leaf table and
§3b.3's accessor-pair rule, and the still-stale `docs/implementation/INDEX.md` header.
