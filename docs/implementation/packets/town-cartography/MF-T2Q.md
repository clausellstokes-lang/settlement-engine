# Town cartography / MF-T2Q — the institution founding year: a dated stamp at the lifecycle seam, and a pure reader whose absence is a typed value

- **Status:** READY
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `b10ed1a1f5a0f2acd00bbfc9b5d0a41931697c3d`
  — read with `git rev-parse` at this lane's opening, never extended from a quoted prefix
  (§381's fabricated-SHA law) and never taken from the dispatch text.
  ⚠ **THE COMPILE'S BASE HAS MOVED.** `draft-PRODUCERS-PLAN.md` was compiled at `1a437bca`; CT-3
  has landed since. Every base-dependent figure in this packet was **re-derived here** and none is
  carried from the charter — including the census tuple, which moved by +4 titles.
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Depends on:** nothing. MF-T2N and MF-T2R are this train's siblings and share no production
  path with this member; the only shared path is the test census walker (see the deferral below).
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — recomputed from the file at
  THIS base by this lane, identical to the value MF-T2Bf and MF-T2G carry, so no re-stamp occurred
  in the window. Its §P1 refutations, §P2 hazard dispositions, §P3 anchor preflight, §P5 census
  law, §P6 mutant hygiene, §P7 STOP set and §P8 capsule law bind this packet and are not restated.
- **Charter:** `draft-PRODUCERS-PLAN.md` §4, under ODQ **§306.4(a)** · **§312.2(c)** · **§421(2)** ·
  **§423/§423.1** (the domain-door ruling) · chair ruling **§433** (which pre-authorized the
  typed-qualifier fallback for the calendar seam — **NOT INVOKED**; see §2).
- **Collision group:** `d3a-producers`. At this base **all 148 registered packets are terminal**
  (measured by execution against `PACKET_MANIFEST.json`), so no other packet reserves any path
  this member names.
- **Commit authority:** this lane commits on its own detached worktree ref. **No ref was moved.**

> **`censusAuthorization`:** this member moves the test census by
> **`+1 files / +0 parked / +1 credited / +7 titles / +1 suiteTitles`** — one new credited test
> file carrying exactly seven straight-line `it` titles under one literal `describe`.
> **Base tuple, RE-DERIVED at `b10ed1a1`: `2497 / 364 / 2133 / 20723 / 5785`**
> (`tests/lint/sovereigntyLightingContract.walker.test.js`, the live `CENSUS` object).
> **After tuple, convicted at this member's tip: `2498 / 364 / 2134 / 20730 / 5786`.**
> Its authorizing decisions are **ODQ §306.4(a)**, **§421(2)** and the chair ruling at **§433**.
> The family's stamp is **GRANTED** at ODQ §312.2b (eight members per engine train; this train
> carries three).

> ⛔ **THE SHARED CENSUS ROW IS DEFERRED TO THE CHAIR'S LANDING ACT (§417, the T2J shape).**
> All three members of this train add a test file, so all three owe the same census walker
> re-record, and `scripts/implementation-packets.mjs` refuses one `changeManifest` path claimed by
> more than one NON-TERMINAL packet — `DRAFT` reserves exactly as `READY` does, so demoting is no
> escape and no amount of building discharges the row. This member therefore makes the code edit,
> proves the delta at its own tip (above), and writes the row's EXACT TEXT here for the chair to
> insert at the landing slot. **This lane did not add the row to `PACKET_MANIFEST.json` and did not
> edit the validator or any sibling's status (§299.5).**
>
> ```json
>         {
>           "action": "TEST",
>           "path": "tests/lint/sovereigntyLightingContract.walker.test.js"
>         }
> ```
>
> ⚠ **INTERIOR RED, NAMED IN ADVANCE (§P7.12 / charter §6).** Until the chair re-records the tuple
> at the train terminal, `tests/lint/sovereigntyLightingContract.walker.test.js` reds at this
> member's tip on the census arm, with the exact message
> `the estate's file count moved — re-measure, do not re-word: expected 2498 to be 2497`.
> This is one of the three interior reds the charter names; a fourth would be a STOP.

---

## §1 · WHAT THIS MEMBER IS

Two acts in ONE commit, because the producer law is family law: **a vocabulary member and its
producer land together** (WF-1A / GR-5A / INT-3B verbatim; re-ruled at §400).

1. **THE STAMP (Shape 2 — the pulse-seam writer).** `applyInstitutionLifecycleOutcome` writes
   `foundedAt: { year, tick }` onto the two constructions that bring a NEW institution into
   existence, and every `institutionHistory` entry it appends gains the same dated pair.
2. **THE READER (Shape 1 — the pure deriver).** `src/domain/institutionFounding.js` —
   `institutionFoundingOf(inst)` returns one of three typed kinds. **Nothing is written at
   generation, ever**, so a founding-era institution carries no stamp and reads `PRE_SEED`.

Neither act writes one byte on the generation path, so the generator golden — which hashes
`sha256(JSON.stringify(settlement))` WHOLE — cannot move. That claim is EXECUTED in §4, not argued.

---

## §2 · THE SEAM RULING — which year the stamp MEANS

**The stamp means: the calendar year in which the founding outcome was APPLIED to the settlement.**

The charter ordered S0 to trace both apply paths and rule the semantic, and pre-authorized a typed
`datedAt: 'PROPOSAL'` qualifier at §433 **if the apply seam provably cannot see the calendar**.
It can, and the fallback is therefore **NOT INVOKED** — a measured answer beat a hedged one.

`applyInstitutionLifecycleOutcome(settlement, outcome)` holds no `worldState` and cannot read the
calendar itself. Its **caller** holds both, on **both** apply paths:

| apply path | route | clock in scope |
|---|---|---|
| immediate outcome | `applyWorldPulseOutcomes` → `applyOutcomeToSettlement` (`applyWorldPulse.js:716`) | `worldState`, `tick` |
| the stored proposal, re-applied *"possibly ticks later"* | `applyWorldPulseProposal` (`:1165`) → the SAME `applyWorldPulseOutcomes`, with `worldState: campaign.worldState` and `tick: campaign.worldState?.tick` | the **apply-time** clock |

Because the deferred path re-enters through the same door carrying the CURRENT clock, threading
`{ year, tick }` from the caller dates every founding by when it actually stood — never by when it
was proposed. Stamping at candidate mint (the charter's first sketch) would have dated a deferred
proposal by its proposal year and would have required editing a second producer
(`moralInstitutionPressure.js`, which mints the `found` patches); one seam edit covers every
minter instead.

⚠ **THE TWO CLOCKS ARE NOT ONE CLOCK, and this bit at S0.** `pulseKernel.js:187` advances
`tick = current.tick + 1` while the calendar advances by `INTERVAL_WEEKS[interval]` weeks, so
**`worldState.tick` is a pulse counter, not a week count** and `seasonForTick(worldState.tick)`
would return a fabricated year. `year` is read from `worldState.calendar.year` — the field
`calendarFromWeeks` writes and `ensureWorldState` normalizes. The `{ year, tick }` pair is the
house dating idiom: `calamityHistory` stamps have carried exactly it since `calamityKernel.js:77`.

**WRITE-ONCE.** The two constructions that CREATE a record stamp it; the two that RE-ACTIVATE one
(a reopen, a re-founding) preserve whatever it carries and never write. An institution's founding
is its FIRST founding; a later re-founding is a separate dated event and lands, dated, in
`institutionHistory`. This is what keeps the Shape-3 line intact: **a founding-era institution
raised from remnant in year 19 is never handed year 19 as its founding.**

---

## §3 · §423 / §0a COMPLIANCE — the door check, executed first

**VERDICT: PASS. No registry verb is minted, and no third vocabulary home is created.**

Every founding path this member stamps is applied inside `applyInstitutionLifecycleOutcome`,
reached through the **already-registered** `outcome.institutionPatch` envelope. The store-side
proposal envelope (`proposalPayload { kind: 'institution_build' | 'institution_closure' | … }`) is
untouched. The stamp is a typed **payload enrichment on an existing verb's outcome** — the ruled
second home under §423.1. No registry row moves.

The four constructions inside the seam, at this base:

| # | construction | patch action | creates | stamps `foundedAt`? |
|---|---|---|---|---|
| K1 | `built` | `build` | a NEW record | **YES** |
| K2 | `restored` | `build`, existing + inactive | re-activates | no — preserves |
| K3 | `founded` | `found` | a NEW record | **YES** |
| K4 | `raised` | `found`, existing + not standing | re-activates | no — preserves |

All six `appendInstitutionHistory` call sites (reopen, build, close, abolish, re-found, found) gain
the dated pair.

⚠ **FOUNDING PATHS OUTSIDE THIS MEMBER, ENUMERATED AND DELIBERATELY NOT STAMPED** —
`entrepotKernel.js:73` (the M6b transshipment institution, with its own inline history append) and
`tierOutcomeApply.js:368` (promotion additions / demotion fates). Both are already-registered pulse
minters, so neither needs a door verb either; both sit outside this member's manifest. **They are
not a lie**, because the reader types their records `FOUNDED_UNDATED` rather than `PRE_SEED` — see
DEFERRAL-1.

---

## §4 · THE INSTRUMENT TABLE — predicted BEFORE the first edit, then measured

The predictions below were written into `scratchpad/laneTET2Q-receipt.md` **before any file was
touched**, as the charter requires. **Every prediction held. No golden re-recorded, so no
declared-shift proof is owed.**

| # | instrument | PREDICTED | MEASURED |
|---|---|---|---|
| I1 | `tests/property/generatorGoldenMaster.test.js` + its manifest fixture | UNMOVED | **UNMOVED — bytewise identical** (below) |
| I2 | the whole `tests/property` tree, ~30 dormancy goldens included | UNMOVED | see §4.1 |
| I3 | `tests/domain/worldPulseSoak.test.js` | AT RISK | **green, unmoved** |
| I4 | `tests/domain/evaluateInstitutionLifecycle.test.js` | AT RISK | **green, unmoved** |
| I5 | `tests/domain/entrepots.kernel.integration.test.js` | UNMOVED | **green, unmoved** |
| I6 | `tests/domain/worldPulseExpansion.test.js` | AT RISK | **green, unmoved** |
| I7 | `tests/lint/provenanceStampSingleWriter.walker.test.js` | UNMOVED | **green, unmoved** |
| I8 | `institutionLifecycle` / `moralInstitutionFounding` / `martialMoralWF8` / `rosterProvenance` / `institutionProvenanceBadges` | UNMOVED (2-arg callers ⇒ no context ⇒ no stamp) | **green, unmoved** |
| I9 | the census walker | INTERIOR RED by design | **red exactly as predicted** (the tuple, above) |

**I1, the dormancy proof, EXECUTED both ways — the same manifest digest before the first edit and
at the member tip:**

```
29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8  tests/fixtures/generator-golden-master.json   (BASE, before any edit)
 Test Files  1 passed (1)
      Tests  3 passed (3)
TRUE_EXIT=0

29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8  tests/fixtures/generator-golden-master.json   (member tip)
INSTRUMENTS TRUE_EXIT=0
 Test Files  12 passed (12)
      Tests  173 passed (173)
```

⭐ **I7 IS THE INSTRUMENT THAT PRE-AUTHORIZED THIS MEMBER IN ITS OWN PROSE.**
`provenanceStampSingleWriter.walker.test.js`'s DAMPING FREEZE section says a dating key may join
`institutionHistory` entries precisely because the damping reads `fate` and nothing else:
*"a future lane adding a `tick` (or any other key) to those entries can do so without changing a
single damping decision"*. `priorLifecycleCounts` is untouched by this member, and the freeze arm
that pins its entry reads to exactly `['fate']` is green.

⚠ **NO `*ByWorldPulseOutcomeId` MINT IS ADDED.** `foundedAt` does not match that walker's
`PULSE_MINT` pattern (which requires the verb be followed by `ByWorldPulseOutcomeId`), and the
declared minter EXACT SET is unchanged.

---

## §5 · ACCEPTANCE — seven arms, all executed

`tests/domain/institutionFounding.test.js`, one literal `describe`, seven straight-line `it`
titles, no `.each` / `runIf` / nesting. The arms drive the **real seam**
(`applyWorldPulseOutcomes` → the applier) rather than the applier alone, because the whole seam
question is whether the calendar reaches it: an arm that hand-passed the context would prove the
applier works and nothing about the wiring.

| # | arm | proves |
|---|---|---|
| A1 | dates a pulse-built institution by the calendar year it came to stand | the positive control, on a real outcome, for BOTH new-record constructions |
| A2 | never re-dates on the re-founded path — a founding is its FIRST founding | write-once; and (b) a founding-era record re-founded in year 19 is NOT handed year 19 — the Shape-3 line, structurally |
| A3 | dates a deferred outcome by when it landed, not by when it was proposed | the seam ruling of §2, executed: one frozen outcome, two clocks, two datings |
| A4 | types every institution, and absence is the typed value | all three kinds, positive control FIRST (§P3); the marker-set correctness pin; a half-written stamp reads as absence |
| A5 | dates `institutionHistory` entries without moving the 24-entry ring cap | the `slice(-24)` ring pinned before AND after |
| A6 | stays unreachable from generation, so the generator golden cannot move | a reachability scan over `src/generators/**` + `src/data/**`, with a guard-the-guard arm on both the walk and the matcher |
| A7 | leaves the already-standing no-op a same-reference no-op | the house idempotence contract survives the stamp (`toBe`, same reference) |

```
 Test Files  1 passed (1)
      Tests  7 passed (7)
TRUE_EXIT=0
```

Every negative carries its anchor (§P3); `tests/lint/negativeAssertionAnchor.walker.test.js` was
run focusedly against this new file and is green.

---

## §6 · MUTANTS — three planted, three convicted, all restored digest-exact

| # | mutant | predicted | measured |
|---|---|---|---|
| m1 | the re-found path RE-DATES (`foundedAt: stamp` added to the `raised` construction) — the write-once BRANCH broken, not a literal | A2 red, A1 green | **A2 red, 6 passed** ✓ |
| m2 | the reader's `PRE_SEED` arm deleted (final return retyped `FOUNDED_UNDATED`) | A4 red | **A4 red, 6 passed** ✓ |
| m3 | the history entry stamp dropped (`stamp ? { ...entry, ...stamp } : entry` → `entry`) | A5 red | **A5 red + A2 red, 5 passed** ✓ |

m3 convicts A2 as well as A5, correctly: A2 pins that the re-founding is itself dated in history.

**Digest-exact restoration, executed after the last mutant:**

```
src/domain/worldPulse/institutionLifecycle.js: OK
src/domain/institutionFounding.js: OK
tests/domain/institutionFounding.test.js: OK
src/domain/worldPulse/applyWorldPulse.js: OK
post-restore TRUE_EXIT=0
      Tests  7 passed (7)
```

---

## §7 · CHANGE MANIFEST

| path | action | effective |
|---|---|---|
| `src/domain/institutionFounding.js` | CREATE | the reader leaf |
| `src/domain/worldPulse/institutionLifecycle.js` | MODIFY | the stamp helper, the history-append stamp, two constructions, six call sites |
| `src/domain/worldPulse/applyWorldPulse.js` | MODIFY | the calendar thread: one context read, one parameter, one argument |
| `tests/domain/institutionFounding.test.js` | CREATE | acceptance (a NEW test file is a `CREATE` row, never `TEST` — the validator asserts a `TEST` path exists at EVERY status) |
| `tests/lint/sovereigntyLightingContract.walker.test.js` | **DEFERRED to the chair's landing act** | §417; exact row text quoted above |

Existing logic modified: **2 files** (charter predicted 1; the second is the calendar thread the
seam ruling required, and it remains inside `PACKET_STANDARD`'s ≤3 cap). Coupling census: **0
motion** — `institutionLifecycle.js` and `applyWorldPulse.js` are already INTERIOR-familied inside
`src/domain/worldPulse`, and the new leaf sits at the `src/domain/` root, outside the census scope
by the census's own standing cannot-catch note.

---

## §8 · JUDGMENTS — each vetoable

| # | JUDGMENT | chose | over | because |
|---|---|---|---|---|
| **J1** | The stamp's FIELD NAME is `foundedAt`, not the charter's `founded` | `foundedAt: { year, tick }` | `founded: { year, tick }` as written in §4 of the charter | ⛔ **MEASURED COLLISION.** `inst.founded` is ALREADY a live display field: `src/pdf/sections/Institutions.jsx:184` renders it as the `EST` row and expects a scalar (`typeof inst.founded === 'number' ? … : inst.founded`), and `src/pdf/lib/viewModelBodySlices.js:217` reads `inst?.founded \|\| inst?.foundedYear`. Writing an object there would put `[object Object]` on a paid PDF surface. `foundedAt` has zero occurrences anywhere in `src/` or `tests/` and matches the house `triggeredAt: { tick, … }` idiom |
| **J2** | The stamp is applied at the APPLY seam, threaded from the caller | one edit in `applyWorldPulse.js` covering every minter | stamping the patch at candidate mint, per the charter's sketch | the deferred proposal path would carry its PROPOSAL year — the exact imprecision §433's fallback exists to avoid; and mint-side stamping needs a second producer file edited (`moralInstitutionPressure.js`). The measurement showed the seam CAN see the calendar through its caller, so the honest answer was also the cheaper one |
| **J3** | The reader has THREE kinds, not the charter's two | `FOUNDED` \| `FOUNDED_UNDATED` \| `PRE_SEED` | `FOUNDED` \| `PRE_SEED` | ⛔ **NEVER A LIE.** A save pulsed BEFORE this member landed carries institutions the pulse itself created, with no stamp. Two kinds would type them `PRE_SEED` — asserting they have stood since the founding, which is false on live saves. The third kind is a typed qualifier that invents no year, exactly the shape §433 pre-authorized for the seam. It costs nothing at generation: a generated institution carries no pulse marker and reads `PRE_SEED` |
| **J4** | `foundedAt` is WRITE-ONCE | the re-activation constructions preserve and never write | stamping the re-found path with the current year (the charter's A2 wording, read literally) | stamping it would hand a founding-era cathedral raised from remnant in year 19 a founding year of 19 — a given-past fact INVENTED, which is a member STOP (§9.3). A2 still convicts the second writer: it pins that the path preserves the old stamp AND dates its own history entry, and m1 proves the branch |
| **J5** | `_worldPulseEconomyBuilt` is EXCLUDED from the reader's marker set | key on `createdByWorldPulseOutcomeId` + `_worldPulseFounded` | including every pulse marker | the reopen construction sets `_worldPulseEconomyBuilt` on a record it merely RE-ACTIVATED, so including it would retype every founding-era institution the pulse ever reopened as a pulse founding — the same lie in the other direction. Pinned by A4's marker-set arm |

---

## §9 · STOP CONDITIONS — every one checked, none tripped

| charter §9 STOP | status |
|---|---|
| 1. the generator-golden manifest moves | **CLEAR** — bytewise identical, executed both ways (§4) |
| 2. a write lands on the generation path | **CLEAR** — no file under `src/generators/**` or `src/data/**` is touched; A6 pins the reachability |
| 3. a given-past fact INVENTED | **CLEAR** — J4's write-once rule is the structural guarantee; A2(b) executes it |
| 4. `parked` moves off 364, or a census figure moves by other than the predicted delta | **CLEAR** — `+1/0/+1/+7/+1` exactly, convicted |
| 5. a census move without its `censusAuthorization` | **CLEAR** — §306.4(a), §421(2), §433 named above |
| 6. any tuning constant | **CLEAR** — no constant of any kind is added; the kinds are closed vocabulary |
| 7. two members holding the shared census path non-terminally | **CLEAR** — the row is DEFERRED (§417), not claimed |
| 9. a pinned post-pulse artifact whose motion cannot be attributed | **CLEAR** — nothing moved; no re-record, so no attribution is owed |
| 11. a hard scope cap exceeded, or a ratchet/ceiling raised | **CLEAR** — 2 modified of ≤3, 2 created, 4 paths of ≤12, no ratchet or ceiling touched |
| 12. §423.1 — a registry verb minted, or vocabulary outside the two ruled homes | **CLEAR** — §3's verdict |

---

## §10 · DEFERRALS — recorded, not re-findable gaps

- **DEFERRAL-1 — the two founding paths outside this member stay unstamped.**
  `entrepotKernel.js:73` and `tierOutcomeApply.js:368` create or re-activate institutions without
  routing through `applyInstitutionLifecycleOutcome`, so their records carry no `foundedAt`.
  Stamping them would take the member to four modified files, past `PACKET_STANDARD`'s ≤3 cap.
  **This is deliberately deferred — documented, not a bug to re-find.** It is not a lie today:
  the entrepôt path's records carry `createdByWorldPulseOutcomeId` and therefore read
  `FOUNDED_UNDATED`, never `PRE_SEED`. A follow-on member can stamp both by passing the same
  context, with no change to the reader.
- **DEFERRAL-2 — the residual ambiguity in the `found` lane's markers.** `_worldPulseFounded` is
  set by BOTH the new-record and the re-founding arm of the patron lane, with no distinguishing
  mark, so a founding-era institution re-founded by that lane BEFORE this member landed reads
  `FOUNDED_UNDATED` rather than `PRE_SEED`. The kind's meaning is written to cover it and no year
  is claimed either way. Recorded in the leaf's own header, where the next reader will find it.
- **DEFERRAL-3 — the consumer.** This member lands DARK. `DS-GEN-14` ("Founded once, grown since")
  is record-gated and already authored (CT-1a, LANDED), so it will speak the moment a content-train
  car joins it to this reader; that car is CONTENT-TRAIN work, not this train's.

---

## §11 · RAISED

| # | item | for |
|---|---|---|
| R1 | **J1's field-name change from the charter's `founded` to `foundedAt`.** The charter names the field; the collision is measured. | Chair — ratify the rename, or direct a different spelling |
| R2 | **J3's third reader kind.** The charter's reader contract is two kinds; honesty on legacy saves needs three. | Chair — ratify, or accept the legacy lie and take it back to two |
| R3 | **J4's write-once rule**, which re-reads the charter's acceptance arm 2 from "the re-found path stamps" to "the re-found path preserves and dates its history entry". | Chair — ratify the reading |
| R4 | **DEFERRAL-1's two unstamped founding paths.** | Chair — docket a follow-on member, or rule the `FOUNDED_UNDATED` reading sufficient |
