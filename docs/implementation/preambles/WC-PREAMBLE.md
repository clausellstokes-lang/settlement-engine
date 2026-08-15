# WC FAMILY PACKET PREAMBLE — the invariants signed once per volume

> **Authored by lane TC14 at the code of record `fc8451c4`, RE-BASED by lane TC17 at
> `4f2d37d1`, and LANDED at this path by lane TE17 at the `wc-0` train's opening commit `D0`,
> under `OWNER_DECISION_QUEUE.md` §59.1 (the four-member shape signed) and §100.4 (this
> executor's dispatch).** Per `docs/DESIGN_BUILD_EFFICIENCY.md` §4 one family preamble per
> volume lives at `docs/implementation/preambles/WC-PREAMBLE.md`; each member packet then
> carries only its own scope, contract, manifest, acceptance, mutants and hazards, plus a line
> citing this file **BY SHA-256**. An edit here re-stamps every citing packet, so drift between
> the family's members and their shared law is structural rather than merely discouraged.
>
> ⚠ **THE FORMAL FAMILY SIGNATURE IS THE §73.1 ROUND STAMP, AND IT IS ALREADY GRANTED.** Unlike
> the INT preamble's batched question, WC carries a §70.4 Fable-round stamp accepted at §73.1,
> so this file lands as the stamped family's law rather than as a candidate for one. ⛔ What the
> stamp does NOT do is widen `wc-0`: §59.1 signed the four-member shape on executed evidence and
> §74.2's cap of eight applies to FUTURE WC trains only (re-affirmed by lane TC17 §4.6).
>
> ⚠ **THE BASE FIGURES BELOW ARE TC14's AND ARE SUPERSEDED WHERE TC17 RE-DERIVED THEM.** This
> file carries no per-wave figure by design (see the closing bullet of this header), but §P9's
> substrate rows are stamped facts about `fc8451c4`. Six of them moved across the twenty-nine
> commits to `4f2d37d1` and were re-derived by lane TC17; a further landing (`eff-1b`) carried
> the base to `98c7872e` docs-only. ⛔ **A WC compile re-executes every row it touches at its own
> verified base and inherits no absolute from this file.**

- **Status:** LANDED at `D0` of the `wc-0` train. Compiled by Lane TC14, re-based by Lane TC17.
- **First citing members:** `WC-0A`, `WC-0B`, `WC-0C`, `WC-0D` — the four members of the `wc-0`
  train, each of which carries this file's landed SHA-256 in its header.
- **Volume:** WC — the war-circulation owner-amendment program (`docs/DESIGN_FP_ARCH_WC.md`,
  17 declared waves WC-0..WC-16, plus `WC-0E` split out by the `wc-0` train plan).
- **Extraction source:** `docs/DESIGN_FP_ARCH_WC.md` blob **`c5305a82`**, 6,973 lines, read at
  code-of-record `fc8451c4`; as CORRECTED by the graded substrate annex `laneWV-WC-SUBSTRATE.md`
  (238 claims, 36 refuted) and the architected cures `laneWCC-cures.md`, both signed at
  `OWNER_DECISION_QUEUE.md` §52. Every law below is a quotation or a compression of those three;
  this file invents nothing.
- **Compiled against base:** `claude/composite-r4` @ `fc8451c4` (capsule
  `docs/implementation/BASE_STATE.json` stamped `e93376ec`, admissible — §P8).
  **Re-based** by Lane TC17 at `4f2d37d1` (capsule `85712a1f`), and **landed** by Lane TE17 at
  `98c7872e` (capsule `6b822540`, a docs-only descendant with every measured path
  byte-identical, so the capsule is citable as executed under its own `consumptionLaw`).
- **Citation law:** a member packet cites this file BY SHA-256 in its header. An edit here
  re-stamps every citing packet, so drift between the family's members and their shared law is
  structural rather than merely discouraged.
- ⛔ **THIS FILE CARRIES NO PER-WAVE FIGURE.** Every census tuple, effective-line count, seal and
  denominator lives in the member packet and is re-executed there. §P9's substrate rows are
  stamped facts about the base, not budgets.

---

## §P0 · THE VOLUME'S OWN STANDING WARNING, RESTATED FIRST

> ⚠⚠ **"LANDED 2026-08-07" IN THE WC VOLUME'S HEADER NAMES THE *DOCUMENT*, NOT THE CODE.**

The WAR-CIRCULATION volume is **ARCHITECTED, NOT BUILT: zero code has landed.** Measured by Lane
WV by module census over all twenty-six declared leaves — not by commit subject, which is the
recorded ES-4/EP false-positive law. Module PRESENCE never promotes a wave; several modules the
volume names are already in `src/` because they are pre-existing MODIFY targets
(`migration.js`, `peaceTermsCatalog.js`, `treatyDocument.js`, `simulationRules.js`).

**THE VOLUME'S MEASUREMENT BASE IS `cbd348a5` AND ITS OWN HEADER SAYS SO:**

> ⚠⚠ *"THE MEASUREMENT BASE IS `cbd348a5` AND IS MANY COMMITS STALE. RE-MEASURE AT BUILD; DO NOT
> INHERIT."*

Measured: `git rev-list --count cbd348a5..HEAD` = **316** at the substrate sweep. The volume's own
§8.4 staleness note ("37 commits past it") was itself 279 commits stale when it was read.

⛔ **LIVE CODE OUTRANKS EVERY TABLE IN THE VOLUME. NAVIGATE BY SYMBOL, NEVER BY LINE NUMBER.**
Every line number in the volume is an evidence anchor, not an address. Executed corroboration from
the substrate sweep: the volume cites `TERM_FAMILIES` at `peaceTermsCatalog.js:192` (it is at
`:294`), `enumerateMoves` at `settlementStrategy.js:634` (`:638`), its bare re-export at `:1360`
(`:1366`), `TAP_LEVELS` at `espionageMath.js:96` (`:104`), `ERRAND_CONSUMERS` at `:276` (`:295`),
and the `joinLedger` single-anchor guard at `warCoalitionLedger.js:95` (`:285` — an address the
volume itself uses correctly 500 lines earlier). **Addresses moved; symbols did not.**

⭐ **THE ONE CLUSTER THAT DID NOT ROT IS THE ONE THE VOLUME NAMED TWICE.** Every address in the
`migration.js` release-fork cluster is still exact at `fc8451c4` — `:474`, `:483`, `:520`, `:545`,
`:553`, `:578`, `:598` — and the volume's own reason is the lesson: it names the FUNCTION and its
GUARD at two separate addresses, *"because a single number here is exactly the hand-keyed
line-address rot 5.7 forbids."* **Every WC packet that cites an address cites two.**

## §P1 · THE FOUR WC-ERA REFUTATIONS THIS PREAMBLE ADDS — each STOP-class, each executed

Beyond the substrate annex's 36 and the cure pass's 7, the `wc-0` compile found four more. Each
was invisible to reading and visible only to execution; each binds **every** WC wave, not just the
one that found it.

**R-WC0-1 · A REGISTRATION WAVE CANNOT MINT A FLAG.** `auditEngineGatedKeys`
(`tests/lint/engineGatedRuleKeys.walker.test.js`) is a two-way audit whose direction 1 is
`manifest.filter((key) => !readSet.has(key))`. A key in `ENGINE_GATED_VIRTUAL_RULE_KEYS` with no
by-name `=== true` gate read **reds**; a gate read accounted for by nothing **also** reds
(direction 2); and directions 3a/3b add `manifestWithoutRow` / `manifestStillPending`. ⇒ **the
manifest row, the first gate read, and the AUTHORED certification row are ONE ATOMIC ACT.** No WC
wave may declare a flag ahead of the door it gates. ⛔ **A wave whose closing line reads "DORMANCY:
total" has no door and therefore mints no flag.**

**R-WC0-2 · A `spatialUsage` TRACKED ROW IS AN EXACT-EQUALITY CLAIM ABOUT A LIVE WRITER.**
`tests/lib/spatialLedgerCoverage.walker.test.js:116` is `expect(classified).toEqual(written)`,
where `written` is source-scanned from the `setSpatialLedger` call sites. ⇒ **`spatialLedgers`
registration rows land with their WRITER, never ahead of it.** WC declares three
(`warContributions`, `freeUnits`, `residentCohorts`); each rides the wave that writes it.

**R-WC0-3 · EVERY NEW WC LEAF UNDER `src/domain/worldPulse/**` OR `src/domain/spatial/**` OWES A
LAYER HOME OR A WRITTEN ARGUMENT IN THE COMMIT THAT CREATES IT.** Both escape doors sit at exact
ceilings (`.toBe`, never `<=`) and the third is forbidden outright by `DESIGN_FP_ARCHITECTURE.md`:
*"the unlayered baseline MAY NEVER GROW; such a file takes a NEW `ARGUED_UNLAYERED` entry with a
written reason in the same commit, never a baseline row."*

⚠ **THIS IS NOT A UNIFORM COST — THE WC FAMILY IS SPLIT DOWN THE MIDDLE BY ONE REGEX.**
`LAYER_PATTERNS.WAR` carries `/^src\/domain\/worldPulse\/war[A-Z]/`, so a leaf named `war…` is
claimed the day it lands and costs **nothing**, while an identically-scoped leaf named anything
else costs a pattern or an argument. Measured over the volume's declared leaves:

| Claimed free by `war[A-Z]` | Homeless — owes a home or an argument |
|---|---|
| `warStance.js`, `warBlockRoster.js` | `peopleLedger.js`, `contributionLedger.js`, `contributionReads.js`, `contributionDispatch.js`, `lawBandModulation.js`, `callInErrand.js`, `joinPreference.js`, `relayNetwork.js`, `blockForks.js`, `serviceIntegrals.js`, `enduranceEnvelope.js`, `freeUnits.js`, `freeUnitKernel.js`, `brigandContest.js`, `moverAbsorption.js` |

⛔ **THE NAMES ARE LOAD-BEARING AND A RENAME IS A STOP.** ⭐ **AND THE CHOICE IS NOT "PICK THE
CHEAP NAME"**: the roster's own comment reserves the argued door for *"modules that own NO subject
and are spoken by every port"*. A WC leaf that owns a subject takes a **family home**, and a family
home is what forces the next volume's consumer to register its coupling instead of reading across
a port in silence. Renaming a subject-owning leaf to `war…` to dodge the pattern edit would buy the
cheap green and lose exactly the coverage the census exists for.

⚠ **A `LAYER_PATTERNS` addition is safe while its target is absent** — checked, not assumed. No arm
requires a pattern to match anything: the family arms are
`expect(Object.keys(LAYER_PATTERNS)).toHaveLength(7)` (a regex joins an existing family's array and
mints no key), per-family `LAYER_FLOORS` lower bounds, and `expect(DOUBLE_CLAIMED).toEqual([])`.
⛔ **An `ARGUED_UNLAYERED` addition is NOT safe while its target is absent**: that arm asserts
`expect(DOMAIN_MODULES, '<module> vanished — re-aim the exclusion').toContain(module)`, so an
argued entry **must** land in the same commit as its leaf.

**R-WC0-4 · THE DEFAULT HARD SCOPE BUDGET REFUSES SEVERAL WC WAVES AS CHARTERED.** WC-0 charters
four leaves and two flags against caps of two and one; `contributionLedger.js` (~300 eff),
`warBlockRoster.js` (~320), `freeUnits.js` (~370), `blockForks.js` (~300), `serviceIntegrals.js`
(~290), `moverAbsorption.js` (~270) each exceed the **250 eff per new production leaf** cap on the
volume's own §2.2 budgets. ⛔ **EVERY WC WAVE PRICES ITS §2.2 BUDGET AGAINST THE CAP BEFORE IT
COMPILES**, and where it does not fit, `PACKET_STANDARD` binds: *"the agent stops and proposes the
smallest split. The agent may not quietly renegotiate the budget."*

## §P2 · THE HAZARD DISPOSITIONS THAT ALWAYS APPLY

1. **THE C1 SEAM IS DISCHARGED, NOT OWED — AND THE VOLUME'S TEXT IS WRONG ABOUT WHICH HALF.**
   HABIT built first. `src/domain/worldPulse/strategyMoves.js` exists (`STRATEGY_MOVES` at `:61`,
   `ALL_MOVE_TOKENS` derived by spread at `:82`), and HB-1 already shipped
   `tests/lint/strategyMoveVocabulary.walker.test.js` — its own manifest row 8 says it ships
   *"WC-0's at-most-one-exporter scan itself"*. ⛔ **NO WC PACKET MAY CARRY A `CREATE` ROW ON THAT
   PATH**: `validate:packets` existence-checks `CREATE` rows only at `LANDED`, so such a packet
   promotes cleanly and dies at the flip — the most expensive place to find it. **WC-4 AMENDS; it
   never mints.**
2. **AND WC-4 IS BOXED AT THIS BASE — DOCKETED, NOT WC-0's.** Both lawful widening directions of
   the landed fence are closed (`ALL_MOVE_TOKENS` is spread-derived, so widening the union leaves
   no array literal spelling it and four arms read `[]`; widening `STRATEGY_MOVES` instead reds the
   emitter pins). ODQ §52.3 dockets the fence-key defect as its own §48 cure. ⛔ **WC-4 DOES NOT
   COMPILE UNTIL THAT CURE LANDS**, and no other WC wave inherits the block.
3. **`strategyMoves.js` IS DEPENDENCY-FREE BY CONTRACT** — an argued-unlayered coupling row with
   `reads: Object.freeze([])`, a source-scan pin, and **no head re-export** (HB-1 §5.1: *"the
   absence is the argument"*). WC-4's amendment may add **no import** to it and may not route it
   through the `warDeployment.js:158-162` re-export block.
4. **THE C3 CONTRACT IS ALREADY BREACHED AT HEAD, TWICE, AND THE NAME-KEYED FENCE IS BLIND TO
   BOTH.** `habitCurve.js` (the *first named consumer family*) carries `HABIT_TUNING.LEARN_RATE` /
   `.HALF_LIFE`, law-word-keyed, in a module with three imports; `espionageDoctrine.js` carries
   `ORDER_EDGES` and `FREQ_BY_ORDER` and re-exports `LAW_WORDS`. Both predate WC. ODQ §52.2 rules
   them **FROZEN LEGACY ROWS, shrink-only, enumerated by exact identity** — the class is closed at
   two and never grandfathered silently.
5. **A SHAPE DETECTOR FOR C3 IS PROVABLY BLIND AND A LITERAL DETECTOR OVER-MATCHES** — measured:
   modules declaring an object literally keyed by ≥ 2 law words = **2**, and `habitCurve.js` is
   *not among them* because it builds its map by `fromEntries`; modules spelling any law word as a
   literal = **29**. ⛔ **Only the import-keyed register is both non-blind and tractable.** No WC
   wave may propose a key-shape or literal-spelling detector for this class.
6. **THE TERM-CATALOG NO-PRODUCER RECIPE DOES NOT REACH A DERIVED LIST.** `TERM_FAMILIES` is
   derived from `TERM_TYPES` at module scope, so registering a producer-less row **mutates an
   exported array** with no producer involved. ⛔ **Any WC wave adding a catalog row runs the FULL
   consumer census over `src/` AND `tests/` before it compiles** — the sweep named eight consumers
   and the cure pass measured **32 references across 9 files**.
7. **NEVER WIDEN `WR10_FAMILIES_AT_LANDING`.** `sovereigntyBundle.js:74` and `:113-115` forbid it
   in writing (*"IT IS DELIBERATELY NOT WIDENED. It is named a LANDING RECORD rather than a
   policy … widening it would erase the fact the tripwire exists to preserve"*), and it reds
   `expect(WR10_FAMILIES_AT_LANDING.length).toBe(8)`. **The lawful move is the NAMED GROWN SET**,
   widened in the same commit with the reason quoted. The volume's obligation (b) at L3628-3630 is
   **STRUCK**.
8. **AN INERTNESS PIN MUST ASSERT THE REASON THAT IS TRUE.** The volume's stated ground for the
   catalog registration's inertness is refuted: `sovereigntyMarketStage.js` stacks the *available*
   family set, not the *produced* one. The inertness survives because `sovereigntyTradeEnabled` is
   an engine-gated **VIRTUAL** key, dark on every default and preset. ⛔ **A pin asserting the
   false reason is a green that proves nothing** — the WC family's canonical instance of the
   vacuity class.
9. **THE RELEASE FORK IS THE VOLUME'S OWN NAMED "MOST LIKELY TO HAVE SHIPPED GREEN" DEFECT.**
   `releaseArrivals` keeps demographic columns and **releases everything else** into M4's arrival
   pass; `isDemographicColumn`'s own docstring says it *"FAILS CLOSED toward M4"*. A military
   column stamped exactly as designed would have been released by M4, crediting a settlement's
   census instead of a block — outside `arrival` / `arrive_home` / `shed`, invisible to WC-6's
   conservation walker. ⛔ **The discriminator is THREE-WAY, and the `:598` guard widens in the
   SAME commit as the vocabulary, PINNED BOTH DIRECTIONS.**
10. **THE PIN-VACUITY FAMILY, ALL FOUR ARMS.** No WC pin may: assert a list against itself; mirror
    the deriver in its fixture (a fixture built by the deriver can never see a dead arm); assert
    over a surface that never rendered; or sit under an unreachable arm. Every negative carries a
    **positive control in the same test** — the WC form of §48's re-sweep loop.
11. **A COUNT MUTANT ON A LITERAL GOES VACUOUS**, and a redundant guard subsumes the one it
    duplicates (a live-flag cleanup once made a deleted generation counter undetectable through
    seven mutants). WC mutants convict a **branch**, never a constant.
12. **CR-WC-9 (THE FIELD BATCH) IS ⛔ OWNER-ESCALATED ON PERSISTED SHAPE.** It blocks WAVES, not
    the fold. ⛔ **No WC wave adds a persisted field, a catalog-row property, or a schema surface
    until it is ruled.** A predicate-and-key widening over an existing record is *not* in this
    class; a new row property **is** — that is precisely why the catalog registration's Arm 2 was
    refused and Arm 1 signed.

## §P3 · THE §31 ANCHOR PREFLIGHT — MANDATORY, PER NEW TEST FILE

OWNER_DECISION_QUEUE §31 ruling 2 is law: *"every new acceptance file runs the negative-assertion
anchor walker focusedly BEFORE its member proof is declared green."* ⛔ **A NEW TEST FILE HAS
CEILING ZERO IN EVERY TREE**, `tests/domain/` and `tests/lint/` alike; the scanned matchers are
`not.toContain` / `not.toMatch` / `not.toHaveProperty`.

**TO COMPLY**, one of:
1. route through `tests/helpers/anchoredNegatives.js` (`expectPresentThenAbsent` /
   `expectAbsentWithAnchor`) **called by name on the same line** — an alias or wrapper is not
   recognised; or
2. carry `// anchored: <why this cannot go vacuous>` on the assertion line **or the line
   immediately above it**. ⚠ For a multi-line comment only the **LAST** line counts.

⚠ **THIS BITES THE WC FAMILY HARDER THAN MOST**, because the volume's signature pins are
absences: *a military column is NOT released*, *the family is NOT drafted*, *no second module
exports the table*. Every one of those is a negative and every one owes an anchor.

**THE PREFLIGHT COMMAND** (bare, in-shell, never piped):

```
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?
```

## §P4 · THE REGISTRATION TEMPLATE — MANDATORY AT FULL STRENGTH (ODQ §35.3)

Every WC packet that mints a row in a registration file names, **EXPLICITLY AND BY PATH**: the
ROW, the HEAD RE-EXPORT (or the reason none exists), the EXACT-LIST / EXACT-COUNT PIN, and the
REGISTRY TEST PATH. **A packet that names fewer than four is defective on its face.**

**THE WC-SPECIFIC INSTANCES, MEASURED AT `fc8451c4`.** Six registers fire on WC work; each is an
**exact** assertion, and three of the six sit at their ceilings:

| Register | Instrument | Form |
|---|---|---|
| the unlayered census | `tests/lint/couplingInclusion.walker.test.js` | `UNLAYERED_BASELINE_CEILING` `.toBe`, and `expect([...UNLAYERED_BASELINE].sort()).toEqual([...LIVE_UNLAYERED].sort())` |
| the argued roster | same file | `ARGUED_ROSTER_CEILING` `.toBe` — **EXACT in both directions**: *"a bound that only forbids growth lets a shrink go unbanked and leaves free slots behind it"* |
| the engine-gated flag manifest | `tests/lint/engineGatedRuleKeys.walker.test.js` + `tests/domain/subsystemRowsVirtual.test.js` | the two-way audit (§P1 R-WC0-1) + the ordered-equality pin |
| `spatialLedgers` coverage | `tests/lib/spatialLedgerCoverage.walker.test.js` | `expect(classified).toEqual(written)` |
| the term-catalog producer law | `tests/domain/peaceTermsGrantTerms.test.js` | every row is produced, a documented `executor:'seam'`, or on the owed register |
| the lighting census | `tests/lint/sovereigntyLightingContract.walker.test.js` | the five-figure tuple, **SEQUENCED** (§P5) |

## §P5 · THE GATE-READING LAW, AND THE CENSUS LAW FOR THIS FAMILY

- ⛔⛔ **NEVER WRAP `npm run check*` IN `gate-mutex.sh --run`.** `test:ratchet` re-acquires and
  self-deadlocks; **exit 3 is the mutex giving up, not a red.** Run `check:tail` **bare**, from a
  fresh shell, with `; echo TRUE_EXIT=$?`, and **outlast it in your own turn.**
- ⚠ **AN EXIT NOT READ FROM THE GATE'S OWN TAIL IS NO RECEIPT** (ODQ §50.4, the re-confirmed
  lying-exit class: a backgrounded ratchet outlasted its window and the harness reported the
  WRAPPER's exit 0 over a red gate). **Trust no exit status you did not capture.**
- ⚠⚠ **THE LIGHTING CENSUS IS SEQUENCED AND STOPS AT ITS FIRST RED FIGURE.** When `files` reds,
  `parked` / `credited` / `titles` / `suiteTitles` **never execute** — a green there is a green
  that never ran. In a multi-member train, `suiteTitles` is proved **separately**: grep the WHOLE
  train diff over `tests/` for added `describe(` lines and require the exact predicted count.
- ⚠ **`credited` IS THE FIGURE THAT LIES.** A `test.each()` case is invisible to the census by
  construction and a `describe.runIf()` parks a file WHOLE; either keeps the arithmetic closing
  while `credited` silently does not move. ⛔ **Every WC acceptance file is ONE literal `describe`
  with straight-line `it` calls and string-literal titles. No `.each`, no `runIf`, no nesting.**
- **A census re-record re-derives ALL FIVE figures together** and names the cause; it never patches
  one figure at a time.
- **The runtime-test count is a FLOOR, not a pin** — transcribed into the capsule from the
  terminal's own executed `test:ratchet` receipt, never predicted.
- ⭐ **THE TEST CENSUS CANNOT ABSORB DEBT.** `scripts/.test-ratchet-baseline.json` is monotone-down
  against a literal `CEILING`; *"you may burn it; you may never pad it."* ⛔ **A WC wave whose
  honest cure is gated leaves the identity red-with-attribution and ESCALATES; it never censuses
  it.** And a failing WALKER is a DISABLED GUARD, never census debt.

## §P6 · MUTANT HYGIENE

- Every mutant is **planted, convicted, and restored digest-exact** — the restore is proved by
  digest, never by eye.
- **A mutant convicts a BRANCH**, never a literal count (§P2.11).
- **The volume's own red-capability inventory (§7.E) is the floor, not the ceiling**: every
  structural guard lands with its executed red proof at the wave that mints it — *"a guard that
  cannot be reddened cannot be proven"*, the door-3 law.
- ⚠ **A REDUNDANT SECOND GUARD SUBSUMES THE FIRST.** Where two guards can each independently hold
  an invariant, the mutant must delete the one under test **and** prove the other does not cover
  for it, or the conviction is vacuous.
- **A defence-in-depth pair pinned only at the outcome is blind to either door** — the volume says
  this itself for the exact-once close; it generalizes to every WC pair.

## §P7 · STANDING STOP CONDITIONS

A WC wave STOPS — and reports rather than repairs — on any of:

1. A `CREATE` row whose path already exists at HEAD (the C1 lesson, §P2.1).
2. A flag declared without its first by-name gate read in the same commit (§P1 R-WC0-1).
3. A `spatialLedgers` registration row without a live `setSpatialLedger` writer (§P1 R-WC0-2).
4. A new leaf without a layer home or a written argument in the same commit (§P1 R-WC0-3).
5. A §2.2 budget exceeding any `PACKET_STANDARD` cap (§P1 R-WC0-4).
6. Any movement of a hot file's measured effective count.
7. A new OSR finding (**verify-at-build; never a `--write`**), or any detector change, which would
   require a schema mint.
8. A persisted field, catalog-row property, or schema surface — CR-WC-9's escalated class (§P2.12).
9. A tuning constant of any kind. ⛔ **`lawBandModulation.js` CARRIES NO CURVE VALUES**: a curve is
   a constant, constants are owner-signature surface under THE PROMISE, and each curve lands with
   its MOVER in that wave's §7.B block. The volume corrected an earlier drafting that landed four
   curves in the wave whose closing line reads *"TUNING: none"*.
10. Two members of one train promoted together while sharing any `changeManifest` path (`R35`;
    `DRAFT` reserves exactly as `READY` does, so demotion is not an escape). The cure is
    `CR-HB2B-SPLITP` staged promotion, never a validator edit.
11. An interior red that was not NAMED in the train plan before it existed.
12. A further overstatement in the volume beyond the annex's 36 and the cure pass's 7: **STOP
    before building on it**, and add it to the family's refutation register.

## §P8 · CAPSULE ADMISSIBILITY AND THE RE-EXECUTION LAW

`docs/implementation/BASE_STATE.json` is citable as executed **only** by a compiler whose verified
base is exactly `stampedAt`, **or** whose base is a DOCS-ONLY descendant of it with every measured
path byte-identical across that window (chair judgment **J-T1**). ⛔ **The discharge is an
EXECUTED `git diff --name-only`, quoted in the packet — never an assertion that the window "looks
docs-only".** And regardless: **every row a manifest touches is re-executed by the member that
touches it.**

⚠ **`package.json` AND `package-lock.json` ARE GOVERNED PATHS.** A dependency bump is a schema
mint trigger; no WC wave takes one.

## §P9 · THE FAMILY'S MEASURED SUBSTRATE (executed at `fc8451c4`; re-execute what you touch)

- **The volume blob** is `c5305a82` (6,973 lines, build copy). The **ledger** copy is `eabb06a0`
  (6,957 lines) — the same document minus the 16-line TE3 banner. ⚠ **Rows keyed to volume line
  numbers differ by −16 between the two copies**; the substrate annex's numbers are BUILD-copy
  numbers.
- **The 22 chair rulings are STANDING AUTHORITY and they are now IN THE TREE.** WV found
  `WC_CHAIR_RULINGS.md` in no ref; it is present at
  `review-fixes-2026-07-08:docs/architected-volumes-pending-fold/WC_CHAIR_RULINGS.md` (1,788 lines,
  landed at `4aae432f`) and byte-identical to the recovered copy the cure pass composed against.
  **WV's R32 is CURED.** ⛔ **CR-WC-9 remains owner-escalated and untouchable.**
- **Rulings every WC wave consumes rather than re-argues:** **CR-WC-1** (build-order decides; the
  ruling is the FENCE, not the preference) · **CR-WC-2** (the people ledger is COUNTS, not names) ·
  **CR-WC-8(i)** (read the estate's default law word; WC signs no program pair) · **CR-WC-8(iii)**
  (`WORSE-OF(sender, stager, receiver)`; and the discipline that governs this whole family — *a
  narrowing made by SILENCE is what the estate refuses; a narrowing RECORDED is fine*) ·
  **CR-WC-10** (mint the SECOND counts-mover manifest; do not widen law M) · **CR-WC-12** (WC-0's
  two producer-less catalog rows wait for nothing) · **CR-WC-19** ⚠ **RULING FLIPPED ON A CORRECTED
  PREMISE**: the credit band **BORROWS `SOVEREIGNTY_VALUE_BANDS` and mints nothing** —
  `bandFamilies.js` declares itself closed at two families and magnitude is not one of them ·
  **CR-WC-20** (a cohort is a TAG on census, never a disjoint pool — the disjoint arm would change
  the MEANING of `settlement.population` for every existing consumer) · **CR-WC-21** (Position B;
  unblocks WC-15).
- **The one artifact still owed, inbound (WV R35, ODQ §52).** The C1 arbitration's INBOUND half is
  undischarged: no row in `docs/FABLE_VALIDATION_QUEUE.md`, none in the habit-directive memory
  file. By §4.1.1's own words the arbitration remains *"a RECOMMENDATION WITH A FENCE, NOT A
  CONTRACT."* The paste-ready row, so the obligation is legible from the family's own law:
  > **C1 / CR-WC-1 — the move-vocabulary mint, INBOUND HALF.** HB-1 minted
  > `src/domain/worldPulse/strategyMoves.js` (two exports, dependency-free) and shipped the
  > single-exporter fence, discharging WC-0's structural half. WC-4 AMENDS the same leaf: its
  > dispatched-but-unemitted moves join `ALL_MOVE_TOKENS` and the fence's `DISPATCHED_NOT_EMITTED`
  > list, never `STRATEGY_MOVES`, and the leaf takes no import. Chair-signed at the WC cure
  > collection.
- **The volume-text corrections owed as a prose micro-act (the `CR-HB1′-VOL` class), NOT done by
  any wave:** the C1 addresses (R01–R02), the `TERM_FAMILIES` census (R09–R14), the ceiling ledger
  (R16–R19), the self-referential counts (R20–R23), R25–R28, R33–R34. ⭐ **R28 is the most
  urgent**: WC-5's and §1.9.1's body text still asserts `errandMint.js` is absent, a premise the
  volume's own header refutes — a compiler reading the wave block inherits the false premise.

## §P10 · BINDING DESIGN-LAW CITATIONS

| Source | What it binds |
|---|---|
| `docs/DESIGN_FP_ARCH_WC.md` @ `c5305a82` | the volume: §0.2 the conservation constitution, §0.3 the law checklist, §2.2 the leaf budgets, §3 the wave split, §4 the coordination contracts, §5 hazard compliance, §7.A the closed vocabularies, §7.E the walker inventory, §8 the seam table |
| `laneWV-WC-SUBSTRATE.md` | **the 36 refutations BIND.** Where the volume and this annex disagree, the annex wins and the volume is docketed |
| `laneWCC-cures.md` + ODQ **§52** | the four signed cures; the two `NEEDS-CHAIR` arms as ruled |
| `docs/architected-volumes-pending-fold/WC_CHAIR_RULINGS.md` (ledger branch) | CR-WC-1..22 |
| `docs/implementation/PACKET_STANDARD.md` | statuses, dispatch lifecycle, scope budget, hot-file law, edge-case budget, STOP conditions, completion receipt, train landings, preamble citation |
| `DESIGN_BUILD_EFFICIENCY.md` §2/§3/§4 | train topology, the capsule, this preamble's own authority |
| `DESIGN_PREVERIFICATION.md` §1/§2 | SPV consumption + staleness; **TTS §2.2 — a plan asserting an unexecuted validator sequence is DEFECTIVE at promotion** |
| ODQ **§28** · **§44** · **§49/§50** · **§52** · **§53.6** | the efficiency law · `CR-HB2B-SPLITP` staged promotion · the three-obligation flag-mint law · the WC cures · this preamble and the standard's amendment |
| `THE PROMISE` | a seed is a starting world forever; lived history immutable; **tuning owner-SIGNED** |

## §P11 · WHAT EVERY WC PACKET STILL CARRIES ON ITS OWN

Scope and boundary (with the non-goals named affirmatively, never by silence) · the behaviour and
identity contract · the exact change manifest with its §2.2 budget priced against the
`PACKET_STANDARD` caps · the executed hot-file and coupling preflights · at most eight acceptance
cases · its wave-specific mutants with their executed red proofs · its own predicted census
motion · and the header line citing this file **by SHA-256**.
