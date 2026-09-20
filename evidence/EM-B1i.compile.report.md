# EM-B1i — COMPILE LANE REPORT (Opus COMPILE lane, session a9df403c, 2026-09-20)

**Verdict: `DRAFT`, READY-able.** Compiled whole at `32602dc607b7423838249cf57d73baf08feb047d`,
`git status --short` **EMPTY** before, mid-lane and after. Nothing was implemented, edited, staged
or committed anywhere; no gate, no vitest, no eslint CLI, no tsc, no build, no npm script.

**Files** (all under
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-B1i-scratch/`):

```
EM-B1i.md · EM-B1i.manifest.json · EM-B1i.evidence.md · EM-B1i.compile.report.md
```

The dead lane's partial `out/` and `tools/` were treated as HINTS. Every figure quoted here was
re-executed at this tip; re-pointed copies live in `t/` and fresh outputs in `o/`.
⚠ **One prior-lane figure was FALSE at this tip and is corrected:** `tests/domain/ruinInstitution.test.js`
was PARKED at `e5bdfd031` and is **CREDITED** here — CURE-C (`145acdb75`) landed between the tips.

---

## 1. ⭐ THE HEADLINE: NO GOLDEN MOVES, AND THE OWNER'S DOOR IS NOT OWED

| question | executed answer |
|---|---|
| the **preset witness** (`tests/fixtures/preset-lighting-witness-golden.json`) | ⛔ **DOES NOT MOVE — 0 of 104 fields, 0 of 8 records.** Driven three times (unpatched / probed / cured) through the estate's own single writer `tests/simulation/presetLightingWitnessRun.js` |
| the harness is real | ⭐ the unpatched run reproduced the **committed golden with 0 field diffs** over all 8 rows × 14 fields |
| the cure really loaded | ⭐ the run's own `patched` list: `causeLifecycle.js` 38,111 → **39,046** bytes in memory |
| `generator-golden-master.json`, `dossier-prose-manifest-golden.json` | ⛔ **CANNOT MOVE** — `causeLifecycle.js` is not in the generation worker's 220-module closure; both digests equal EM-B1e's LANDED A4 pins today |
| **every dormancy golden and every fixture** | ⛔ **CANNOT MOVE** — `worldPulseFate` appears in **0** committed `.json` files under `tests/`, `src/`, `public/`; the three non-`closure` words appear in `tests/` in exactly **one** file, an assertion about what the WRITER stamps |
| **`tests/helpers/goldenRecordDoor.js`** | ⛔ **NOT OPENED.** No shift record, no `predictedRows`, no `ownerWords`. The door is not a row of this packet |

⚠ **THE HONEST LIMIT, NAMED IN THE PACKET (§0 and N11):** the witness realm carries no
`corrupt: true` NPC, so `institutionDestroyed` is never called inside it (`calls=0`, all eight
rows). The witness proves the golden unmoved; it is a **vacuous control for the cure itself**.
That half is carried by §2 and §3 below, and N11 slots a witness row with a compromised NPC as a
question for the chair.

---

## 2. The defect, reproduced and cured through the REAL `advanceCauseLifecycle`

```
EM_B1I_MODE=probe   standing demoted_by_disaster → severed=true    ⛔ WRONG
                    rise     upgraded_by_reconstruction → true     ⛔ WRONG
                    rise     founded_by_flourishing → true         ⛔ WRONG
                    closure  destroyed_by_disaster → true          ✅ CONTROL
                    UNKNOWN  razed_by_the_gods → true              ✅ conservative
                    none     (no fate) → false                     ✅ NEGATIVE CONTROL
                    readerCalls=6 divergences=3

EM_B1I_MODE=cure    the three standing/rise → severed=FALSE, record KEPT
                    closure + UNKNOWN → still severed; no-fate → still false
```

⇒ **exactly three of six verdicts move, and they are exactly the three the charter names.**
The population is **THREE**, re-confirmed at this tip by reading each write site's record literal
(ODQ §934.47 addendum 30).

**The DM's words today, for a tower that is still standing** (from the probe's own `reasons`):

> **"Aldra Vane is cut loose"** — *Sustaining institution "Wizard's Tower" destroyed; the
> compromise resolved (no live patron remained).*

After the cure that tick produces **nothing**: the arrangement continues, because the paymaster is
alive. A genuinely destroyed paymaster still cuts the leash, in the same words.

---

## 3. How often the bug fires — 2,080 pulse ticks, and the number is ZERO

Eight settlements in the shape of the estate's own `upswingRecoverySoak` realm, driven through the
real `simulateCampaignWorldInterval` year by year with `settlementUpdates` threaded forward, every
NPC leashed to a local institution:

| run | ticks | non-`closure` stamps | reader calls | **divergences** |
|---|---:|---:|---:|---:|
| 10y, full_simulation, 4 leash names | 520 | 10 | 238 | **0** |
| 10y, leashes aimed only at the rise-fated institutions | 520 | 6 | 120 | **0** |
| **20y × 2 presets** | **2,080** | **16** | **804** | ⭐ **0** |

⭐ **WHY, MEASURED:** every compromise resolved inside years 1–2; every rise fate landed in years
2–4; `endCorruptNpcs: 0`. The reader is also unreachable for a compromise that has reached
`exposed-public` (`:386`) or `readjudicated` (`:404`). The coincidence window is narrow by
construction.

⛔ **BUT THE MIS-READ IS PERMANENT, NOT MOMENTARY.** Each twenty-year world ended with **sixteen
standing, active academies** (`founded_by_flourishing | status=active | inactive=false`) that
`institutionDestroyed` reads as *destroyed* for the rest of that world's life. The first
compromise ever leashed to one of them severs instantly.

⇒ **This is a correctness fix whose measured lived-behaviour motion today is zero and whose latent
population is sixteen records per twenty-year world.** R6 puts the DM-facing half to the chair.

---

## 4. The budget table

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families · named state writers · flags · surfaces | `0` each | ≤1 each |
| Direct production consumers | `1` (`causeLifecycle.js:397`, the only call site in the tree) | ≤2 |
| **New logic-bearing production leaves** | **`0`** | ≤2 |
| **Existing logic-bearing production files modified** | **`1`** (`causeLifecycle.js`) | ≤3 |
| New TEST leaves | `1` | n/a |
| **Additional registration-only files** | **`2`** | ≤3 |
| **Handwritten files total** | **`4`** | ≤12 |
| Effective lines in the new test leaf | ≈170 projected | ≤250 |
| **New/changed effective production lines** | **`+5`; cap ≤10** | ≤400 |
| Delta in a shared/hot file | `0` — **no edited file is hot** | ≤15 |
| **Acceptance cases** | **`7`** | ≤8 |

Overrides: `NONE`. `causeLifecycle.js` measures **376 of 800** effective lines (eslint's own
`Linter`; the `roadsKernel.js` control reproduced its frozen `.size-baseline` value of 838
exactly), carries no per-file override and no baseline entry, and is on **no** hot list.
Post-edit prediction: **381 of 800**.

---

## 5. §7 ↔ JSON change manifest — PROVED SET-EQUAL, with `PACKET_ACTIONS` printed

```
PACKET_ACTIONS = ["CREATE","DOC","MODIFY","REGISTER","TEST"]

§7 table rows  ( 4 ):            JSON manifest  ( 4 ):
   CREATE|tests/domain/institutionDestroyedByKind.test.js        (same 4)
   MODIFY|src/domain/worldPulse/causeLifecycle.js
   REGISTER|tests/lint/vocabularyTotality.walker.test.js
   TEST|tests/lint/worldPulseFateTotality.walker.test.js

in §7 but not JSON: []      in JSON but not §7: []      SET-EQUAL BOTH WAYS: true
actions not in PACKET_ACTIONS: []
acceptanceCases: 7 objects; shape {id, case} ok: true (<=8: true)
requiredSymbols: 10 rows; retiredSymbols: []
```

**The four rows:**

| Action | Path | what it does |
|---|---|---|
| `MODIFY` | `src/domain/worldPulse/causeLifecycle.js` | the cure: one import, one frozen `DESTROYED_BY_FATE_KIND`, `:139` replaced by two kind-aware lines. `:137`, `:138` and the status line byte-identical and in the same ORDER |
| `CREATE` | `tests/domain/institutionDestroyedByKind.test.js` | A1–A7, one literal `describe`, seven straight-line `it` |
| ⭐ `TEST` | `tests/lint/worldPulseFateTotality.walker.test.js` | EM-B1h's no-reader arm NARROWED to a one-file reader roster (set-equal both ways) — never deleted |
| ⭐ `REGISTER` | `tests/lint/vocabularyTotality.walker.test.js` | one `it` binding `DESTROYED_BY_FATE_KIND`'s keys to `WORLD_PULSE_FATE_KINDS`, both ways |

## 6. `checks` — order, and the generator rule

Eight arrays. Each `vitest` array names exactly **one** test directory (`tests/domain`,
`tests/lint`, `tests/property`, `tests/simulation`); the fifth is `eslint` over the four edited
files; the last three are `node` readers plus `implementation-packets.mjs validate`.

⭐ **NO GENERATOR APPEARS AMONG `checks`**, so step 14(a)'s "a generator goes LAST" rule is
satisfied vacuously — edge-shared INPUT membership is **0 of 307** across all five committed
metas, so `npm run build:edge-shared` is absent and none of §P2 row 12's **seven** generated paths
is owed. Both `check-*` scripts run in their documented READER mode (their write doors are
`--write`); eslint carries no `--fix`. ⇒ **no undeclared path is written by the packet's own seal.**

⚠ `tests/lint/sovereigntyLightingContract.walker.test.js` is deliberately **NOT** in `checks`: it
is an EXPECTED INTERIOR RED until the train's terminal, and a `checks` entry must exit 0. It is in
§10 as a separate once-run.

All twenty paths named in `checks` and §10 were existence-checked; every one printed `OK`. The
CREATE target is **absent on disk and unknown to git** (`git ls-files … | wc -l` → `0`).

---

## 7. Register moves — ⭐ EVERY ONE STATED AS A DELTA

| register | DELTA |
|---|---|
| ⭐ **sovereignty lighting census** | **`+1 files / +0 parked / +1 credited / +8 titles / +1 suiteTitles`** — the CREATE contributes `+1 file / +1 credited / +7 titles / +1 suiteTitles`; the `REGISTER` row adds **one `it`** to `tests/lint/vocabularyTotality.walker.test.js`, measured **CREDITED** by the walker's own `parkReasonsFor` at this tip (26 titles, 6 suite titles) ⇒ `+1 title`; the `TEST` row adds **no** title. ⚠ **Stated against a tree in which EM-B1h HAS LANDED** (its own `+1 files / +4 titles / +1 suiteTitles` is separate and prior). ⛔ No absolute is quoted; the refreeze is the chair's terminal act |
| ⭐ **mutation coverage** | ⛔ **NO MOVE — NOT OWED.** Proved by importing the enforcer's own module: `institutionDestroyedByKind.test.js` → `NAME_PATTERN: false`; `tests/domain/…` → `in ENFORCER_DIRS: false`. ⇒ **NO contention with EM-B1d[READY]** |
| **coupling inclusion** | **NO MOVE.** No new `src/` module; `causeLifecycle.js` is already a bare-path row in `.coupling-unlayered-baseline.json:39`; both ends of the new edge are unlayered ⇒ no pair minted, neither baseline JSON moves, `ARGUED_ROSTER_CEILING` unchanged |
| **observed-shape readers** | **NO MOVE.** Baseline EXECUTED read-only: **1,964 findings, exactly matching the frozen inventory**, exit 0, tree clean both sides. Motion is a STOP |
| **writer-reach** | **NO MOVE.** Baseline EXECUTED: `judged 6537 · LIT 572 · LIT-NAME 4671 · DARK 1294 (reviewable 495)`. Growth is a STOP |
| **prose-numerics** | **NO MOVE, and no line-addressed row is disturbed** — `causeLifecycle.js` carries **zero** baseline rows (the baseline names six `worldPulse` files; not this one) |
| **wiring-census `stamp.files`** | **NO MOVE** — 7 stamped files, none is `causeLifecycle.js` |
| **edge-shared metas** | **NO MOVE** — 0 of 307 inputs |
| **byte budgets** | generation worker (zero slack) **NOT REACHABLE** · first paint **NO** · lazy `engine` **NO** (its rule is `id.includes('/src/generators/')`) · `advanceInterval.worker` **YES, no ceiling today**: ⭐ **≤194 B, and ZERO new modules in any chunk** |

## 8. Collision group

⭐ **`tests/lint/worldPulseFateTotality.walker.test.js` — EM-B1h's CREATE, edited here.** EM-B1h
built its A6/T3 arm to refuse the first reader of the kind and **named EM-B1i in the message a
violation prints**; its §11 makes such a reader its own STOP, *"that is EM-B1i's."* This packet is
that reader, so it carries the arm's narrowing as a declared row. Serialized by the train
(EM-B1h lands first, EM-T6); no other packet names that path.

`tests/lint/vocabularyTotality.walker.test.js` — checked FREE at compile; confirm at placement.

⭐ **`scripts/mutation-coverage-manifest.json` IS NOT IN THIS PACKET'S GROUP** — so EM-B1d's READY
reservation of that path, which gates EM-B1h's dispatch, **does not gate this one.**

⚠ One shared path with whichever train this joins: `tests/lint/.lighting-census-baseline.json`
(that train's terminal act; never this packet's).

## 9. requiredSymbols — 10 rows, each `grep -cF` → 1, with the post-edit simulation

All ten proved present at this tip (evidence §16). ⭐ **The post-edit simulation passes for every
row and `retiredSymbols` is EMPTY**: the packet adds one import line, adds one `const` above
`institutionDestroyed`, and replaces lines INSIDE that function's body — it re-spells **no** symbol
text. No other LANDED packet's rows for these (path, symbol) pairs need discharging.

⛔ **THREE ROWS THIS PACKET CANNOT PROVE AND THEREFORE DOES NOT CLAIM.**
`WORLD_PULSE_FATE_KIND`, `WORLD_PULSE_FATE_KINDS` and `isWorldPulseFate` live in EM-B1h's CREATE
target, which does not exist at this tip (`ls` → *No such file or directory*). The standard admits
only symbols present at the verified base. **The chair adds them at promotion**, after EM-B1h has
LANDED, with the three `grep -cF` commands printed in evidence §16 and repeated in the manifest's
`_verifiedBaseNote`.

## 10. `causeLifecycle.js`'s bundle membership, priced

| budget | verdict |
|---|---|
| generation worker (`WORKER_BUNDLE_CEILING_BYTES = 1401208`, EXACT, zero slack) | ⭐ **NOT REACHABLE** — absent from the 220-module closure |
| eager first paint (the config's own 268-module export) | **NO** |
| lazy `engine` (`< 679_000`) | **NO** — `vite.config.js:862` routes only `/src/generators/` |
| `advanceInterval.worker` | **YES** (549-module closure), **no byte ceiling today** |
| edge-shared closure | **NONE of 307 inputs** ⇒ ⛔ **not owed, and the SEVEN generated paths are not owed** |

⭐ **THE NEW IMPORT EDGE COSTS ZERO MODULES.** `causeLifecycle.js` has exactly one static importer
in `src/` — `pulseKernel.js` — which also imports `calamityKernel.js`, EM-B1h's importer of the
leaf. Every closure containing this reader already contains `worldPulseFates.js` once EM-B1h
lands. The whole cost is the packet's own **≤194 B** (esbuild `--minify`, per-module, an upper
bound). With EM-B1e's +437 B and EM-B1h's ≤1,008 B that is **≈1.64 KB of TOOL-3's declared 4 KB
per-train headroom** (R2).

---

## 11. ⭐ THE FINDING THAT CHANGED THE CURE'S SHAPE

The obvious shape — a `CLOSURE_FATES` Set plus `(fate in WORLD_PULSE_FATE_KIND)` for membership —
**introduces a new defect.** Executed:

```
constructor            (word in KIND)=true  SET.has(word)=false  KIND[word]=undefined
toString               (word in KIND)=true  SET.has(word)=false  KIND[word]=undefined
valueOf                (word in KIND)=true  SET.has(word)=false  KIND[word]=undefined
__proto__              (word in KIND)=true  SET.has(word)=false  KIND[word]={}
```

A save carrying `worldPulseFate: 'constructor'` would be judged a KNOWN member with no kind and
would read **NOT destroyed** — inverting the conservative contract for exactly the words it exists
to protect. The cure therefore uses the leaf's **`Set`-based `isWorldPulseFate`**, never `in`; A2
pins all four words and M3 plants the `in` mutant.

And the shape chosen is a **total kind→verdict map**, not a closure-fate Set:

| shape | minified | hides a fourth kind? |
|---|---:|---|
| today (the defect) | 184 B | — |
| `CLOSURE_FATES` Set + `isWorldPulseFate` | 387 B (+203) | ⛔ **yes — a silent default** |
| ⭐ **`DESTROYED_BY_FATE_KIND` + `isWorldPulseFate` (CHOSEN)** | **378 B (+194)** | ⭐ **no — `vocabularyTotality` reds** |

The map is **9 B cheaper** and its keys are readable by `vocabularyTotality.walker.test.js`'s own
`objectLiteralKeys` helper, which is what makes the register row non-vacuous.

---

## 12. `LIFECYCLE_CLOSE_FATES` — the chair's Q4, MEASURED and NOT derived

⛔ **Nowhere in the tree or its history is the 3-word restriction argued as a deliberate semantic
choice.** Five findings:

1. **Born as a MIRROR.** `git log -S LIFECYCLE_CLOSE_FATES` gives three commits; the introducing
   one is **`3e1763de8`, 2026-06-10, "Stressor dynamics"**. Its diff adds the set and
   `closureFateForInstitution` **in the same hunk, eleven lines apart**, and the set is **exactly
   that deriver's three returns**.
2. **Silent authorities.** The commit message never mentions the restriction; the only comment
   above the counter explains history-vs-booleans and the 24-entry cap, and says nothing about
   which fates count.
3. **It is a different vocabulary.** `priorLifecycleCounts` reads `entry?.fate` from
   `settlement.institutionHistory`, and its sibling `LIFECYCLE_BUILD_FATES` holds `built` and
   `reopened` — **not `worldPulseFate` members at all**. "3 of the 15 closure fates" compares
   across two vocabularies; EM-B1j owns the second.
4. **FROZEN by an exact both-ways pin**, `831ba5c0c` (2026-07-27):
   `expect(setOf('LIFECYCLE_CLOSE_FATES')).toEqual(['bankrupt','closed_for_want_of_custom','shuttered'])`
   in `tests/lint/provenanceStampSingleWriter.walker.test.js:293`.
5. **The freeze's STATED reason is drift, not completeness** — its own prose: *"Widening this read
   makes every such addition a golden mover under THE PROMISE — take it to the T4 batch with an
   owner-signed shift, never here."* And `scripts/mutation-coverage-manifest.json` records an
   executed mutant proving the arm live.

⇒ **the honest reading is "a mirror, never re-examined", not "a decision".** Widening it is a
lived-behaviour change (3 counted words → 15 begins damping rebuild odds where nothing damps them)
**and** reds a landed lint walker. ⛔ **This packet does not touch it.** R3 asks the chair to slot
it (EM-B1j, or a named follow-on with an owner-signed shift).

---

## 13. ⛔ NOTICED AND NOT TOUCHED — every item with its fate (the owner's law: nothing is deferred)

| # | item | fate |
|---|---|---|
| **N1** | ⛔ **EM-B1h's A6 no-reader arm reds the moment this cure is written** — it was built to, and names EM-B1i in its message. | **IN SCOPE — §7 row 3:** narrowed to a one-file reader roster, both ways, never deleted. |
| **N2** | ⛔ **`LIFECYCLE_CLOSE_FATES` is not deliberate as a semantic choice** (§12). | **OWNER/CHAIR DECISION POINT — R3.** Slot: EM-B1j or a named follow-on; it needs an owner-signed shift because it moves lived behaviour and reds a landed walker. |
| **N3** | ⚠ **The `vocabularyTotality` row EM-B1h predicted would have been VACUOUS** (a consumer that imports its producer cannot fail an equality with it). | **IN SCOPE, RESHAPED — §7 row 4** binds the KINDS, which convicts a future fourth kind. **R4** asks the chair to confirm the subject. |
| **N4** | ⭐ **The `in`-operator prototype hazard is an estate-wide shape**, not just this packet's: `X in <frozen object literal>` with unvalidated `X` reads four `Object.prototype` members as present. | **IN SCOPE here** (§6.1 forbids it, A2 pins it, M3 convicts it). **SLOT: R8 — does the chair want a lint arm** over that pattern tree-wide? |
| **N5** | ⚠ **`tests/domain/causeConjunctionContent.test.js:29` cites `causeLifecycle.js:165` for `bearerSituation`, which is at `:176`** — **already wrong by 11 lines at this tip**, before this packet moves anything. No walker reads it. | **SLOT: the chair's citation sweep** (FIX-D1 is already measuring 7,399 names), or CLOSE as prose. ⛔ Not a row here — fixing an already-stale address inside this packet would mix causes. |
| **N6** | ⚠ **The reader is reachable at most once per compromise**: a record at `exposed-public` (`:386`) or `readjudicated` (`:404`) returns before TERMINAL 2 forever after. | **CLOSED — not work**, but it is why §3's number is 0. Recorded so "0 divergences" is never read as "no defect". |
| **N7** | ⭐ **A demotion RENAMES the institution** (`calamityKernel.js:300`), so a leash naming the GREATER stops resolving, while a leash naming the LESSER starts resolving to a `demoted_by_disaster` record. The `standing` arm fires through the tolerant name match, not through identity. | **CLOSED — measured**, and A1 drives the real resolver rather than constructing the institution by identity. |
| **N8** | ⚠ **A `rise`/`standing` fate is never cleared.** The four CLEAR sites write `null` only on reopen/re-raise/reactivation; nothing clears a fate from a standing institution, so the stamp — and today the mis-read — is permanent (§3's sixteen records). | **SLOT: an owner decision point if "a rise fate should age out" is ever wanted.** ⛔ Not a defect: the fate is provenance, and after this packet a standing institution's provenance no longer implies death. |
| **N9** | ⓘ **TOOL-3 sequencing:** EM-B1e's +437 B, EM-B1h's ≤1,008 B and this packet's ≤194 B all land in the uncapped `advanceInterval.worker` — **≈1.64 KB of the declared 4 KB per-train headroom.** | **SLOT: TOOL-3's first per-train attribution**, naming all three. **R2.** |
| **N10** | ⓘ `scripts/audit/cause-lifecycle-soak.mjs:171` hand-builds `worldPulseFate: 'captured_by_local_powers'` — a `closure` member, so its verdicts are unchanged by this cure. | **CLOSED — not work.** Recorded so the audit's numbers are not read as a regression after this lands. |
| **N11** | ⚠ **The preset witness never reaches this reader** (0 calls across 8 rows × 52 ticks). Its green proves the golden unmoved and **not** coverage. | **SLOT: R9 — does the chair want a witness row carrying a compromised NPC?** A new instrument, not this packet's. |
| **N12** | ⚠ **The dead lane's `park.json` was FALSE at this tip** (`ruinInstitution.test.js` parked → credited via CURE-C `145acdb75`). Any other lane resuming from a dead lane's `out/` inherits the same trap. | **CLOSED — the hazard is already the standing law** ("hints, never facts"). Recorded because it bit here in a measurable way. |

---

## 14. Questions only the chair can answer — numbered, listed, not waited on

1. ⭐ **R1 — CONFIRM THE SHAPE:** a TOTAL kind→verdict map (`DESTROYED_BY_FATE_KIND`), not a
   `CLOSURE_FATES` Set. Measured: the map is **9 B cheaper** AND it makes a future fourth kind red
   instead of defaulting silently to "standing". If the chair prefers the Set, §6.1, §6.5, A5 and
   §7 row 4 change together.
2. **R2 — TOOL-3 sequencing.** Name EM-B1e's +437 B, EM-B1h's ≤1,008 B and this packet's ≤194 B in
   TOOL-3's first per-train attribution (≈1.64 KB of 4 KB). Not adjudicated here.
3. ⭐⭐ **R3 — `LIFECYCLE_CLOSE_FATES`: Q4 IS ANSWERED AND NEEDS A RULING.** The 3-of-15 restriction
   is nowhere argued as deliberate (§12): a mirror of one deriver, frozen later for a different
   reason, in a different vocabulary. Widening it is a lived-behaviour change AND reds a landed
   walker. **Slot it (EM-B1j or a named follow-on with an owner-signed shift), or close it with
   the reason.**
4. ⭐ **R4 — CONFIRM THE `vocabularyTotality` ROW'S SUBJECT.** EM-B1h's N9 predicted a row over the
   eighteen WORDS; measured, that would be self-referential and vacuous. This packet binds the
   KINDS instead. It is the difference between a guard and a tautology.
5. **R5 — CONFIRM THE CONSERVATIVE UNKNOWN-FATE CONTRACT, or slot the migration.** An unknown
   truthy fate keeps reading as destroyed forever. No retired spelling exists in this repo's
   history and `worldPulseFate` appears in 0 committed JSON files — **but a user's saved world is
   not in this repo.** The cost is one-sided (an unknown word can only read *too destroyed*, which
   is today's behaviour). Closing the READ side needs a migration and a different packet.
6. ⭐ **R6 — THE LIVED-BEHAVIOUR PRICE, FOR THE OWNER'S EYES.** No golden moves and no measured
   pulse run diverged in 2,080 ticks, so **no signed door is owed by the machinery**. But the
   change IS lived: a DM who would have been told *"Aldra Vane is cut loose — Sustaining
   institution 'Wizard's Tower' destroyed"* about a standing tower will now be told nothing, and
   the reeve stays compromised. **Does the chair want the owner to see §0.1 before the train
   closes?**
7. **R7 — A6 and EM-B1h's narrowed arm assert the same fact from two sides.** Deliberate (the
   walker guards the estate; A6 guards the packet) but duplicative. **Confirm, or drop A6 and
   spend the eighth acceptance slot elsewhere.**
8. **R8 — does the chair want an estate-wide lint arm** for `X in <frozen object literal>` with
   unvalidated `X` (N4)? Measured here, not adjudicated.
9. **R9 — does the chair want a preset-witness row carrying a compromised NPC** (N11), so the
   pulse's corruption path is byte-witnessed at all? A new instrument, not this packet's.

---

## 15. What this lane did NOT do

Implemented nothing. Ran no gate, no vitest, no eslint CLI, no tsc, no build, no npm script
(eslint's `Linter` imported as a LIBRARY; esbuild run on scratch fragments only;
`check-observed-shape-readers.mjs` and `check-writer-reach.mjs` run in their documented READER
mode with `git status --short` quoted EMPTY on both sides). Edited, staged or committed nothing
anywhere; the read tree is unchanged at `32602dc607b7423838249cf57d73baf08feb047d` with an empty
`git status --short` at open, mid-lane and close. Wrote only under
`$SP/lane-em-compile-EM-B1i-scratch/`, always through absolute paths. Did not touch `$SP/consist`,
`$SP/slot-2`, any other `$SP/lane-*`, any other `$SP/read-tip-*`, the ledger checkout's working
tree or the kit; the ledger was read only through
`git -C /Users/cstokes/Desktop/settlement-engine show review-fixes-2026-07-08:<path>`. Adjudicated
nothing: every correction is a measurement with its command, and every choice the chair reserved is
a numbered question in §14.
