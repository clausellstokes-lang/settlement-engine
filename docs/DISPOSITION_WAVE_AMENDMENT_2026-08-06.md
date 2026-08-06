# THE DISPOSITION WAVE — AMENDMENT AND CHAIR RULINGS, 2026-08-06

## ⏳ OPUS-ERA — FABLE SURVEY OWED
Prepared under **Opus 5, not Fable 5**, under the owner's standing delegation and
the 2026-08-06 marking directive. Every ruling below is **VETOABLE**; each carries
a `J-DISP-*` id so a later Fable session can re-rule it cheaply.

**THIS DOCUMENT AMENDS `docs/DISPOSITION_WAVE_PROPOSAL.md` (@ `534d17f6`, on
`claude/composite-r4`). It does not replace it.** Where the two disagree, this
one governs and the proposal's row stands unedited as history — the estate's
rule that ledger rows are never rewritten. ⚠ THIS FILE LIVES ON THE LEDGER
BRANCH ONLY as a durability copy, written while two build lanes held the build
tree. **It must be folded into `claude/composite-r4` beside the proposal at the
next quiet landing slot, and DELETED from here when it lands** — a stale copy
beside a landed document is the derive-don't-restate hazard this program has
been bitten by repeatedly.

---

## §1 WHY THE PROPOSAL NEEDED AMENDING

**It is 58 commits stale, and it under-scoped the red base.** It censused only
`tests/lint` plus one `tests/property` file; the tree's own records name reds in
`tests/domain` and a second `tests/property` file it never counted.

**The freshest MEASURED figure — CONFIRMED**, quoted from the FP-Cycle-1 close
row in `docs/FABLE_VALIDATION_QUEUE.md` (~:2262): after the proseNumerics
re-record, the whole `tests/lint` tree run sequentially with no other vitest lane
live went **10 failed files / 19 failed tests → 9 files / 15 tests**, at
`88150241` (2026-08-05).

⚠ **THAT IS A FLOOR, NOT CURRENT TRUTH.** 23 commits have landed since,
including two src-adding waves (ES-0, SP-C). The trajectory, all CONFIRMED from
commit bodies and ledger rows:

| Point | tests/lint reds | Source |
|---|---|---|
| WZ-3 base `af1b9d38` (08-03) | 34 rows / 13 files | ledger :190 |
| WZ-5 (08-04) | 32 tests / 11 files | ledger :191 |
| Proposal `534d17f6` (08-04) | 32 tests / 11 files + mechanismLitCoverage 2 | the proposal |
| After D-W1 `398f26bc` | 19 rows / 10 files | WW-G commit body |
| After CR-FP-2 `88150241` (08-05) | **15 tests / 9 files** | ledger ~:2262 |
| HEAD `cbd348a5` | **UNMEASURED** | — |

**The disposition wave is materially SMALLER than the proposal implies**, because
D-W1 and D-W2 already landed. Eight items close by record alone.

---

## §2 THE RULINGS

### J-DISP-1 — THE PROPOSAL IS SUPERSEDED IN PART, NOT WHOLESALE. **CHAIR-RULED.**
D-W1 is EXECUTED (`398f26bc`, Lane WW-G: 32 rows/11 files → 19 rows, exactly the
13 Class-A rows removed, zero added). D-W2's proseNumerics half is EXECUTED
(`88150241`, baseline re-recorded to **413 rows** with ceilings pinned exactly).
D-W2's remainder, D-W3, D-W4 and D-W5 are UNEXECUTED and stand.
**Veto sentence:** flip this if you believe a re-run at HEAD would show the D-W1
or D-W2 rows returned.

### J-DISP-2 — THE CLASS-B KIND-POOL FORK: **TAKE THE CAP-RAISED ARM.** **CHAIR-RULED — AND IT IS A DECLARED GOLDEN SHIFT.**
Four kinds carry annexes wider than their walkers allow: `war_trajectory_winning`
(6), `war_trajectory_losing` (6), `trajectory_misread` (10) and
`succession_demand_inherited` (6), each against a walker asserting
`toHaveLength(5)`.

⚠ **THE MECHANISM, CONFIRMED AT SOURCE** — `src/domain/worldPulse/eventProse.js:95`:
`const templateIndex = seed ? fnv1a32(seed) % pool.length : 0;`. **POOL WIDTH IS
THE MODULUS.** Widening a pool from 5 changes which sentence *every* seed selects
for that kind. This is a same-seed prose shift across four kinds, not a
cosmetic edit.

**RULING: raise the caps; do not trim the corpus.** Four reasons, in order of
weight. (1) The fixed-five is an INSTRUMENT ARTIFACT, not a design law — the
walker encodes a convenience, and encoding a convenience as a constitutional
constraint is how instruments start governing products. (2) The variants are
AUTHORED CONTENT that exists; trimming discards human work irreversibly, while
raising a cap is reversible. (3) **SP-E's architecture already retires this
class** — its charter reads "retiring the fixed-five requiredSlots class per
D-W3's cap-raise arm, Q7" — so trimming now would be building toward an
architecture the program has already decided against. (4) The shift is
PERMISSIBLE NOW AND WILL NOT BE LATER: under §3h nothing that can move an output
may land after the tuning signature, so deferring converts a cheap declared shift
into a blocked one.

⛔ **ORDERING IS BINDING:** this lands in the composition-repairs slot, BEFORE the
owner's walk and well before tuning, with the golden re-record in its own commit
quoting the field-level diff, captured from a proven-clean HEAD.
**Veto sentence:** flip this to "corpus trimmed" if you would rather ship five
variants per kind forever than accept one declared same-seed prose shift now.

### J-DISP-3 — ⚠⚠ D-W4's BLANKET SIGNATURE DOES NOT HOLD. ITS PREMISE IS REFUTED. **RETURNED TO THE CHAIR, MEASUREMENT OWED.**
The proposal's cure routes the `Math.pow` sites through
`bandedStock.decayTowardNeutral`. **That function ITSELF calls
`Math.pow(0.5, age / weeks)` at `bandedStock.js:125` — CONFIRMED at source.** The
cure relocates the site into a second file; it does not remove the cross-engine
exposure it exists to remove.

**THE GOVERNANCE POINT, and it generalizes:** the owner's blanket sign-off signs
each queued item *per the chair's recorded recommendation for that item*. When
the recommendation's premise is later refuted by measurement, **the signature
does not survive it** — a signature ratifies a recommendation, not an outcome.
D-W4 therefore returns to the chair unsigned. ⚠ **Any other blanket-signed item
whose recommendation rested on a measured premise should be re-checked against
this rule before it builds.**

**CHAIR RECOMMENDATION: MEASURE FIRST, DO NOT RATIFY BY DEFAULT.** The two arms
are (a) ratify `Math.pow` as an accepted baselined form — a visible baseline
edit with NO output move, cheap but it converts a determinism guard into a
rubber stamp; (b) reformulate both sites to an exactly-deterministic decay — a
real output move, larger, but it removes a whole class of cross-engine
nondeterminism from a simulator whose core product promise IS determinism.
**Owed before choosing: the blast radius of (b)** — how many outputs move if
`bandedStock`'s decay is reformulated, given it is the SP-5b shared shape that
SP-C's appetite facet was deliberately built on. I decline to rule between two
arms when one of them is cheaply measurable and unmeasured.
**Veto sentence:** flip this if you consider `Math.pow(0.5, x)` acceptably
portable and want arm (a) ratified without the measurement.

### J-DISP-4 — SOL-BANK-3 IS THE GATE BLOCKER AND GOES FIRST. **CHAIR-RULED.**
`npm run check:tail` **stops at typecheck before eslint ever runs**, so every
other disposition is invisible behind it. CONFIRMED at source:
`treatyBreach.js:88` declares `dispositionTransitions?: Array<Record<string,unknown>>`,
`realmVerbExecution.js` passes it into `dispositionNews.js:221`, whose parameter
demands `{kind, id, channel, toBand, tick, …}`. No cast has been added.
**Narrow the `@returns` at the producer** rather than casting at the call site: a
cast silences the checker, the narrowing fixes the contract, and the broad row
type is the actual defect.
**Veto sentence:** flip this if you want the one-line cast to unblock the gate
immediately and the contract fixed in its own later wave.

### J-DISP-5 — SP-A's ATTRIBUTION CLAIM IS CORRECTED. **CHAIR-RULED, RECORDED AGAINST A LANDED WAVE.**
SP-A (`59df13a9`) reported "zero rows are this wave's". **That claim is FALSE.**
It added `bandedStock.js:125` — a second unbaselined transcendental site — and
the claim passed review because attribution was performed by FAILING ROW and the
failing row is byte-identical whether the ratchet's inventory holds one site or
two. This is the recorded invisible-growth hazard, caught live.

⚠ **THIS IS NOT AN ISOLATED SLIP — THREE RATCHETS GREW THE SAME WAY:**
`transcendentalMathBaseline` 1 → 2 sites; `roadsParticipation`'s `.npcs`-reader
census 31 → 38 (eight new un-dispositioned readers, one of them added by GR-1
*after* the proposal was written, plus one stale row); `negativeAssertionAnchor`
61 → 64 → 72.

**THE STANDING CURE, now binding on every wave:** wave-end attribution must
diff the red ratchet's **CONTENTS**, never only its failing-row identity. A
byte-identical fail row proves nothing about the inventory behind it. This was
already written into the cycle-4 verifier briefs; it is hereby general.
**Veto sentence:** flip this if you can show the row-identity diff alone would
have caught `bandedStock.js:125`.

### J-DISP-6 — FIVE SOL-BANK ROWS CLOSE BY RECORD. **CHAIR-RULED.**
SOL-BANK-1 (teardown race — leaf mock present at `navFlowArrows.test.jsx:92-94`;
⚠ **the proposal's attribution is WRONG**: it landed at `66b462e3`, Lane FL-2,
not at `456271ea`/`ac377738`, neither of which touched the file), SOL-BANK-2
(re-recorded 401→404→413), SOL-BANK-5 (both files decomposed under ceiling,
entries deleted from the size baseline), SOL-BANK-9 (`eventProse` 751 < 800;
the pulseKernel half moot under R-BLD-10's permanent 1580 bank), SOL-BANK-10
(re-scoped at `c3411038` — "the dormancy golden was a whole-engine snapshot
wearing one flag's name"). SOL-BANK-8's pulseKernel half also closes as moot.
**Veto sentence:** flip any row if you want it re-verified by execution rather
than closed on the tree's own record.

---

## §3 THE WORK LIST, CORRECTED

**(c) CLOSE BY RECORD — ~0 engineering.** The six above, plus D-W1 with its 13
Class-A rows, plus D-W2's proseNumerics half. ⚠ **Carry forward:** CR-FP-2's
re-record absorbed **4 real reader-prose float leaks + 3 detector false
positives** as declared frozen debt, named in the baseline header. They are
**owed a humanization wave** — deferred and documented, not a bug to re-find.

**(b) REAL DEFECT — fix required.**
1. **SOL-BANK-3 typecheck** (J-DISP-4) — the gate blocker, goes first.
2. **Two transcendental sites** — `dispositionLedger.js:468` and
   `bandedStock.js:125`. Blocked on J-DISP-3's measurement.
3. **`deepCloneHotPath`, 1 site, named:** `lineageMemberBirth.js:38`,
   `return JSON.parse(JSON.stringify(value));` → route through `src/domain/clone.js`.
4. **`inversion01`** — dead initializer at `lineageClaim.js:532`; both branches
   overwrite before any read.
5. **`ruinFilterRoster`, 6 readers, named:** `dispositionNews.js`,
   `envoyNegotiationPictureBuilder.js`, `razingExecution.js`, `warArmyRecord.js`,
   `warCosts.js`, `certification/couplingRegistryWar.js`. ⚠ Each needs a
   live-provider-vs-ruin-agnostic call; **a wrong call counts a razed institution
   as alive**, so these are semantic, not mechanical.
6. **`clampPrimitiveBaseline`, 11 files, named:** `conquestDoctrineStage`,
   `conquestExecution`, `conquestFeasibility`, `conquestIntent`,
   `dispositionLedger`, `dispositionProfile`, `razing`, `razingExecution`,
   `razingWitness`, `warAllianceRisk`, `warCoalitionDecision`. No stale entries.
   ⚠ The chair pre-ruling already records that NONE is byte-identical to the
   kernel (5 NaN-passthrough, 4 Number-coerce, 2 where `+Infinity→1` while the
   kernel yields 0) — every unification is behaviour-touching at the edges.
7. **`roadsParticipation`** — 8 new un-dispositioned readers + 1 stale row.
   **Not in the proposal at all.**
8. **SOL-BANK-6** — wire `evaluatePhraseRepetitionEnvelope` into the maintained
   observation harness; author the scorer-family receipt walker; author the
   ID+name authoring census.
9. **D-W5 doc-pin hardening** — ~9 rows / ~13 sites remain. Green-but-fragile,
   not reds.

**(a) STALE BASELINE — re-record with a declared cause.**
`domainAnyCastBaseline` warDeployment (baseline 16, live 17 — but the proposal's
"type the `worldStatePatch` field rather than widen" makes this a (b), not an
(a)); SOL-BANK-7's location-bound exclusion coordinate (86/87 → 95/96, and
⚠ structurally line-bound **by design** per its own header, so it recurs every
wave — a standing tax, not a one-time fix).

**(d) UNDETERMINABLE WITHOUT EXECUTION — one command each, inside the gate slot.**
The true current red set; `negativeAssertionAnchor`'s live count;
`seedLoopTotality`; `mechanismLitCoverage`'s gap contents; whether proseNumerics
survived ES-0/SP-C; SOL-BANK-3's exit code; and four `tests/domain` walkers
(`generosityReactions` — still `toHaveLength(5)` against a measured 7 —
`guidanceRegistry.walker`, `metronomeCooldownLint`,
`changeAuthorityPolicy.contract`).

⚠⚠ **WHEN RUNNING THESE, ALWAYS `--outputFile=<path outside the repo>`. NEVER the
bare `vitest list --json <path>` form** — it consumes the next positional as its
output path and silently overwrites that file at exit 0. Only `git status` tells
you.

**SIZE ESTIMATE:** ~20 dispositions. 8 record-only. ~6 are one-to-few-line fixes.
Three are genuine burn-downs (`negativeAssertionAnchor` ~72 rows,
`clampPrimitiveBaseline` 11 semantic calls, `roadsParticipation` 8), plus
`seedLoopTotality` (13 sites) and `ruinFilterRoster` (6 calls). **One slice for
the record-only tier, two or three for the burn-downs, one for D-W5.**

---

## §4 ⚠ THE GOLDEN-SHIFT SUBSET — ORDER THESE EARLY

Under §3h nothing that can move an output may land after the TUNING SIGNATURE,
and a band signed against a tree that then shifts is stale the moment it is
signed. These belong in the composition-repairs slot, **before the owner's walk**:

1. **The Class-B cap raise (J-DISP-2)** — same-seed prose shift across four
   kinds, mechanism confirmed at `eventProse.js:95`. **Ruled; ready.**
2. **The two transcendental sites (J-DISP-3)** — replacing a transcendental
   changes decayed disposition values on the same seed. **Blocked on measurement.**
3. **`clampPrimitiveBaseline` unification** — behaviour-touching at the edges.
4. **`deepCloneHotPath` reroute** — if `clone.js` treats `Date`/`Map`/`undefined`
   differently from `JSON.parse(JSON.stringify())`, the persisted birth record's
   SHAPE moves. ⚠ Verify with a same-seed hash BEFORE landing; this touches
   persisted state.
5. **The 4 frozen prose leaks** — humanizing them rewrites rendered receipt
   sentences. Reader-facing.

**NO output move:** `domainAnyCastBaseline`, SOL-BANK-3's typing, SOL-BANK-7/8,
D-W5 pin hardening — and `ruinFilterRoster` only where a reader is *truly*
ruin-agnostic; a reader changed from raw to filtered DOES move engine behaviour.

---

## §5 A HAZARD CAUGHT IN REAL TIME, WORTH KEEPING

A sub-agent reported `supplyCompleteness.js` as a stale clamp-baseline entry.
**REFUTED** — the file has `clamp01` at line 66. Plain `grep` returned nothing
because the file carries a **raw NUL at byte 6520**, an explicitly owner-parked
allowlisted exemption in `tests/lint/controlBytes.test.js`. This is the recorded
grep-NUL hazard biting a recon pass live: **grep and diff lie silently about NUL
bytes; use `grep -a`, or read the bytes in python3.**

---

## §6 WHAT THIS DOCUMENT DOES NOT CLAIM

The red base at HEAD is **UNMEASURED** — 23 commits have landed since the last
real count, and no figure here should be cited as current. Every item marked
CONFIRMED above was read from bytes or reproduced from a walker's own logic
against a control; **nothing was executed**, because the gate is a machine mutex
and two build lanes held it throughout. `negativeAssertionAnchor`,
`mechanismLitCoverage` and `proseNumerics` are the three areas where only a run
settles the inventory, and their settling commands are listed in §3(d).
