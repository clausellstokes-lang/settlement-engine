# WF / WF-1b-ii — the settlement extinction obituary (stage 3 of the `wf-1` split promotion)

- **Status:** DRAFT — compiled by lane TC-WF1B under ODQ §291.5; the chair lands.
  ⛔⛔ **THIS PACKET IS NOT DISPATCHABLE AS WRITTEN.** It requires a chair-ruled budget override
  recorded **before** dispatch (§7), and it asks a scope question the chair may answer by re-filing
  the beat to WF-8 instead (§4 and `draft-WF-1B-I.md` §7.3). Both are chair acts. The packet is
  compiled in full so that whichever way the ruling goes, no second compile is needed.
- **Verified base:** `claude/composite-r4` at `9d851faeb7cac73217d508f621d1d9ee29f2c145`
- **Preamble:** `docs/implementation/preambles/WF-PREAMBLE.md`, cited **BY SHA-256
  `cd067ba1ce41232a99dee9a7247f4c82d47fbe2b4fd9bb8599784d4a33136211`**. Every refutation,
  disposition, register, STOP and census law there binds and is not restated.
- **Substrate annex:** `docs/implementation/preverification/WF-SUBSTRATE.md`. ⛔ No absolute
  inherited; every figure below is re-executed at `9d851fae`.
- **Design authority:** `docs/DESIGN_FP_ARCH_WF.md` §4-WF-1 (⭐ at `9d851fae` the build copy IS the
  §78-cured ledger text, 846 lines — ODQ §308.2 closed the divergence) · `docs/DESIGN_FP_FAITH.md`,
  **THE EXTINCTION BEAT [CORRECTED 2026-08-02 (fp-audit)]**, obituary (a) — the settlement-scoped
  half; obituary (b) is WF-1c's · `docs/DESIGN_FP_SPINE.md` §2 SP-6 (the content-depth floor) and
  reqs 13/14 · `docs/implementation/preambles/GR-PREAMBLE.md` §P2 (the registration-cost table and
  the ⛔ **AN OVERRIDE NEVER TRANSFERS** rule) · `docs/implementation/packets/foreign-policy/IN-1C-A.md`
  (the estate's ONE-ROW registry-family precedent).
- **Depends on:** ⛔ **`WF-1B-I` LANDED.** This packet consumes the pruned-refs seam that member
  returns and the `suppressedAtTick` ordering that makes the obituary derivable. It also re-opens
  `religionState.js` and `religiousContest.js`, which i reserves — **serial promotion, i first**
  (§P7.14, ODQ §45.2).
- **Train:** `wf-1`, family **WF**, member **b-ii**. WF is **STAMPED** (§78.1) ⇒ engine trains cap at
  EIGHT; this member rides alone because of the path reservation, not the cap.
- **Split authority:** ODQ **§308.3 (RAISED-3)**; **§308.4** is the compile's dispatch authority and
  the authorizing decision for every census move in §9.
- **Constitutional law binding every line below:** the DEITY DOCTRINE — faith is CULTURAL, never
  theological; no premade deity pool; typed buckets per FINITE-SEMANTICS; **AI is clerk, never
  writer.** ⛔ The obituary records that **the people stopped keeping the rite**. It never says a god
  died, left, or failed. See §5, which refuses two spellings on that ground.

---

## §0 · THE BEAT, AND THE ONE SENTENCE THAT FIXES ITS BAR

`DESIGN_FP_FAITH.md`'s corrected beat, obituary (a):

> *"the beat fires at the ONE deletion path — `pruneSuppressed` removing a creed's suppressed
> entry — which requires ≥4 suppressed entries in that settlement (the pin seeds exactly that) …
> The receipt is settlement-voiced: 'the last altar of the Pale Warden in `<town>` went dark; none
> THERE now keep the rite' — no realm-wide census exists and none is minted."*

⛔ **ODQ §308.3 (RAISED-4) RULES THE BAR AND THIS PACKET OBEYS IT BY CONSTRUCTION: the "≥4" MUST BE
EXPRESSED AS A DERIVATION FROM THE EXISTING `KEEP` CONSTANT — it fires when the suppressed count
EXCEEDS `KEEP`. A LITERAL 4 IS A STOP.** WF-1b-i lands the derivation already: the beat is emitted
from the deletion itself, where `KEEP` is in scope, and consumes the refs `pruneSuppressed` returns.
**The literal `4` appears nowhere in this member**, and this lane executed the bar to prove the
derivation is exact rather than approximately right:

```
PRUNE suppressed=3 before=[d.S0,d.S1,d.S2]           after=[d.S0,d.S1,d.S2]  deleted=[]
PRUNE suppressed=4 before=[d.S0,d.S1,d.S2,d.S3]      after=[d.S0,d.S1,d.S2]  deleted=[d.S3]
PRUNE suppressed=5 before=[d.S0..d.S4]               after=[d.S0,d.S1,d.S2]  deleted=[d.S3,d.S4]
```

⇒ **the beat is PER DELETED CREED, not per tick.** Four suppressed fires exactly one obituary; five
fires two. That mapping is asserted (A5), not assumed — and it is the reason the volume's *"asserts
the beat fires ONCE"* pin must seed **exactly four**.

---

## §1 · THE BEHAVIOUR THIS MEMBER ADDS

After WF-1b-i, a settlement that loses a fourth creed to the prune deletes the one longest gone from
the light — and **says nothing**. This member gives that deletion a voice: one settlement-scoped
Herald desk kind, `faith_last_altar_dark`, minted at the deletion, naming the creed, the settlement
by name, and the reason, with a full address chain and a typed action (L6).

**Nothing else changes.** The realm-scoped twilight is WF-1c's; the Chronicle obituary row and the
FaithSection cause-chain line are WF-1d's (`WF-1A` §5).

---

## §2 · THE CURE

### 2.1 The seam is already built, and this member only consumes it

WF-1b-i returns the deleted refs from `pruneSuppressed` through `advanceShares`. The fold collects
them and, **behind the same landed `faithUnseatingEnabled` read it already hoisted**, mints one beat
per ref. ⛔ No new flag, no new conjunction, no second gate — the beat rides the LOCAL-lane data gate
`isSubsystemActive(snapshot, 'religion')` the fold passed at its head, so a deity-free world is
byte-identical even lit.

### 2.2 ⛔⛔ THE REGISTRATION COST IS NOT FIVE FILES. THE FAITH FAMILY HAS NO KIND REGISTRY AT ALL

Executed enumeration at `9d851fae`. `tests/lint/kindPoolFloors.walker.test.js`'s `REGISTRIES` array
holds **TEN** families — WAR_DISPOSITION, WAR_LINEAGE, WAR_COST, WAR_RULING, WAR_COALITION, ENVOY,
COMMERCIAL, GRAMMAR, SOVEREIGNTY, INFORMATION — and the estate carries **THIRTEEN** per-family
`*KindPools`-class walkers, each with its own `scripts/mutation-coverage-manifest.json` row. **None is
FAITH.** GR-PREAMBLE §P2's five registration homes for a Herald DESK kind are:

| # | surface | FAITH's state at `9d851fae` | this member |
|---|---|---|---|
| 1 | the receipt pool (`grammarReceiptPools.js`-class) | ⛔ **DOES NOT EXIST** | CREATE `src/domain/worldPulse/faithReceiptPools.js` |
| 2 | the kind registry row (`grammarNews.js`-class) | ⛔ **DOES NOT EXIST** | CREATE `src/domain/worldPulse/faithNews.js` with `FAITH_KIND_REGISTRY` |
| 3 | `heraldRouting.js` — `SECTION_OF` / `EXACT_SECTION` | exists (18 faith token rows at `:138-150`) | +1 row |
| 4 | `chroniclersLetter.js` — `KIND_SECTION` | exists (220 eff) | +1 row |
| 5 | `settlementRumors.js` — `WHAT_PHRASES` | exists (508 eff, `WHAT_PHRASES` at `:116`) | +1 row |

⭐ **AND THE TWO NEW LEAVES ARE CHEAP IN LINES**, which is exactly why this member breaks a *file-count*
cap and not a *line* cap. Measured at this base with eslint's own `Linter` under
`max-lines {skipBlankLines:true, skipComments:true}` over the IN-1c-a precedent:
**`informationNews.js` = 50 effective**, **`informationReceiptPools.js` = 13 effective** (against a
250-per-leaf cap). The sovereignty family, for scale: `sovereigntyNews.js` **313**,
`sovereigntyReceiptPools.js` **125**.

### 2.3 ⛔ THE CHEAP PREFIX DOOR IS CLOSED, AND SO IS THE LEGACY DOOR

`heraldRouting.js:357-358` routes `faith_*` and `pantheon_*` through `PREFIX_RULES` with no
`EXACT_SECTION` row at all — the preamble §P4 calls it *"both the cheap door and the trap."* **For a
REGISTERED kind it is closed**, and the walker says so in its own words:

- `kindPoolFloors.walker.test.js` asserts `REGISTERED_KIND_COUNT − routedAndRegistered.length` is
  exactly **8**, under the comment *"A kind routed WITHOUT a registry row (or a desk-bearing kind
  registered without routing) still breaks it."* ⇒ a desk-bearing FAITH kind owes **both**.
- `LEGACY_UNVOICED_TOKENS = 274` is asserted **SHRINK-ONLY (`<=`)**, so the "route it and register
  nothing" road — the road `pantheon_twilight` is on — reds on arrival.

⇒ **`faith_last_altar_dark` takes its own `EXACT_SECTION` row.** The prefix rule still exists and
still routes it; the row is what keeps the census honest, and `ROUTED_TOKENS` and
`REGISTERED_KIND_COUNT` therefore move **together**, leaving the divergence identity at 8.

### 2.4 ⭐ THE ELEVENTH REGISTRY, AND THE SECOND SMALL FAMILY — A REVIEWED ACT BY DESIGN

`kindPoolFloors.walker.test.js` carries this arm:

```js
expect(REGISTRIES.filter(([, rows]) => rows.length < 5).map(([name]) => name))
  .toEqual(['INFORMATION']);
```

under a comment that states the intent in terms: naming the sole exception *"keeps all nine at
five-or-more by exact equality AND makes a SECOND small family a visible, reviewed act rather than a
number that quietly slipped."* ⛔ **A one-row FAITH registry IS that second small family.** Editing
the arm is lawful and it is exactly the review the arm exists to force — so it is named here, in the
packet body, with its authorizing decision (§308.4), rather than discovered at the terminal.

⚠ **This is the strongest single argument for §4's alternative**: under WF-8 the FAITH family lands
with roughly twenty rows and **the exception list never grows at all**.

### 2.5 The kind, the pool, and the floor

- **Kind:** `faith_last_altar_dark`. **Section:** `faith`. **Audience:** `public`.
  **Significance:** `major` (an extinction is rare).
- **Pool floor, DERIVED not quoted:** `tests/helpers/kindPoolWalker.js` computes
  `FREQUENCY_FLOORS[cls] = CHRONIC_FLOOR − rank × CADENCE_STEP` with `CHRONIC_FLOOR = 8` and
  `CADENCE_STEP = 2` over `(routine, notable, major)`. ⇒ **`major` floors at FOUR variants**, matching
  `DESIGN_FP_SPINE.md` §2 SP-6. ⛔ **Four DIFFERENT STRUCTURES AND ANGLES**, not four rewordings —
  SP-6's own words, and `CR-FP-7`'s "fixed-five" backlog is the recorded counter-example.
- **Slot contract:** `requiredSlots.length === pool.length`, asserted by every kind-pool walker. A
  slotless variant is the honest fallback when a slot's evidence is absent.
- ⛔ **NO SLOT THE ENGINE CANNOT SUPPLY.** The available evidence at the deletion is: the creed's
  ref and display name, the settlement's name and id, the tick, and `suppressedAtTick`. **There is no
  clergy name and no realm-wide count**, so no variant may ask for one. A pool carrying an unfillable
  slot is a chair annex act, never an invented value.

---

## §3 · SCOPE AND BOUNDARY

WF-1b-ii mints ONE settlement-scoped Herald desk kind at the ONE deletion path, its registry family,
its pool, and its three registration rows.

**It does not** (named affirmatively): mint a flag or a conjunction; mint a second kind; mint a realm
beat (WF-1c) or a Chronicle row or a FaithSection line (WF-1d); give `fallCauseFor` a caller
(§P2.11); write any persisted state; add a stressor, a `spatialLedgers` sub-ledger, a
`WR10_FAMILIES_AT_LANDING` member, a `TERM_CATALOG` row, or an `ERRAND_CONSUMERS` row; touch
`peaceTerms.js` (**797/800**, ZERO-HEADROOM-CLASS) or `warTermination.js` (**818/818**, ZERO
headroom); touch `simulationRules.js`, `subsystemRowsVirtual.js`, `pulseKernel.js` or
`applyWorldPulse.js`; author a tuning value; touch `package.json`/`package-lock.json`; light the flag
anywhere; or move a same-seed golden.

---

## §4 · THE SCOPE QUESTION THIS PACKET RAISES RATHER THAN ANSWERS

⭐ **WF-8 (NARRATION) CHARTERS ROUGHLY TWENTY FAITH KINDS**, and preamble §P1 R-WF-8 already calls it
*"a multi-member train by arithmetic, not by preference."* Two roads:

| | **A — land the beat here** (this packet) | **B — re-file the beat to WF-8** |
|---|---|---|
| FAITH kind registry | minted with **1** row | minted with **~20** rows |
| `kindPoolFloors` small-family exception list | ⛔ **1 → 2 members** | **unchanged at 1** |
| `REGISTRIES` length | 10 → 11 | 10 → 11 (once, later) |
| `tests/lint/faithKindPools.walker.test.js` + its mutation-coverage row | paid **here**, then re-touched by WF-8 | paid **once**, by WF-8 |
| the five registration homes | paid here | paid once, by WF-8 (the desk, once bought, is not re-owed) |
| WF-1b's shape | **two members, one with an override** | ⭐ **ONE member (`WF-1B-I`), zero overrides in the whole ladder** |
| what WF-1b-i leaves behind | the pruned-refs seam, consumed next member | the pruned-refs seam, consumed by WF-8 — **producer-first, exactly WF-1a's own shape** |

⛔ **THIS LANE DOES NOT CHOOSE.** Re-filing a chartered deliverable across waves is a chair act, and
§308.3 pre-authorized a *split*, not a re-file. Road B is RAISED with these numbers; road A is
compiled in full below.

---

## §5 · DEITY-DOCTRINE AND SPINE COMPLIANCE (binding, per member)

- ⛔ **TWO SPELLINGS ARE REFUSED AT COMPILE, NOT SOFTENED** (preamble §P2.1): any kind or pool line
  naming a **god's** act — `faith_god_departed`, `faith_deity_abandoned`, "the Pale Warden left
  Marrow's Ford" — is refused. Faith is CULTURAL. The landed spelling names what the **people** did:
  the altar went dark; none there now keep the rite. ⭐ `faith_last_altar_dark` is the volume's own
  voice, and it is doctrine-clean because the subject of the sentence is an altar and a congregation,
  never a deity's will.
- **No premade deity pool.** No deity is minted and no catalogue is read; the beat names the creed
  already in the settlement's own record. ⛔ Fixtures acquire deities ONLY through
  `SET_PRIMARY_DEITY` / `IMPOSE_CULT` — never by poking config.
- **Typed buckets (FINITE-SEMANTICS).** `kind`, `section`, `significance` and `audience` are closed
  vocabularies; slots are named identities and integers. **AI is clerk, never writer** — the pool is
  authored prose in the governed corpus discipline, chosen by a seeded pick over authored variants,
  never generated.
- **Spine req 13 (alignment engagement): alignment-EMPTY, WITH REASON, recorded.** The beat reads a
  deletion and a stamp; no arm reads a deity's authored axes and the receipt renders no axis judgment.
- **Spine req 14 (the DM edit story): RECORDED — engine-only, receipt-only.** The beat writes no
  state at all. The DM's existing suppression/imposition verbs already reach the transition; no new
  verb is minted and none is owed. Vetoable under the spine's req-14 escape.
- ⚠ **DS-FTH-3 (volume Q4, OPEN at the chair): NOT REACHED.** This member persists nothing, so no
  state spelling is bound and `npm run gen:dossier-prose` is NOT run.

---

## §6 · PRICED OBLIGATIONS

| obligation | verdict |
|---|---|
| **§49/§50/§148 — the flag mint, FIVE obligations** | **NOT INCURRED.** No flag is minted; the beat rides `faithUnseatingEnabled`, LANDED by WF-1a and already read by name in the fold. `ENGINE_GATED_VIRTUAL_RULE_KEYS` does not move ⇒ `coveringArrayCoverage.test.js`'s three SEQUENCED literals (`virtual` **24** `:167`, `union` **81** `:169`, `union − governed` **56** `:174`) all hold, and `contributionLedgerShape.test.js`'s literal holds at **24** |
| **§104.4 — edge-shared bundle closures** | **NOT INCURRED, DERIVED AT COMPILE from the committed metas' own `inputs` arrays.** Executed over all five at `9d851fae`: none of `religionState.js`, `religiousContest.js`, `heraldRouting.js`, `settlementRumors.js`, `chroniclersLetter.js` appears in `aiCharterBundle` (110), `aiOutputSchemaBundle` (111), `aiGroundingBundle` (66), `analyticsEventsBundle` (2) or `intentAtlasBundle` (2). The two CREATEd leaves are new and in none. ⚠ Re-derive at the implementing tip; do not inherit this |
| **test census (the lighting contract)** | ⛔ **INCURRED, AND IT IS A NAMED INTERIOR RED.** Live PINNED tuple at this base, re-read from the walker's own trailing record (`:4848`): **`2484/364/2120/20598/5767`**. This member mints `tests/lint/faithKindPools.walker.test.js`, so `files`, `credited`, `titles` and `suiteTitles` all move: predicted **`+1/+0/+1/+T/+1`** where `T` is the new file's title count plus the titles added to existing files. ⛔ **A NEW TEST FILE REDS THE CENSUS BY CONSTRUCTION — this is a PLANNED interior red and MUST be named in the train plan BEFORE it exists** (§P5, §P7.15). ⚠ The census is SEQUENCED: when `files` reds, `parked`/`credited`/`titles`/`suiteTitles` **never execute**, so a green there is a green that never ran. In a multi-member train `suiteTitles` is proved SEPARATELY: grep the WHOLE train diff over `tests/` for added `describe(` lines and require the exact predicted count |
| **§102.2 / §P3b — mutation coverage** | ⛔ **INCURRED.** `tests/lint/faithKindPools.walker.test.js` is an enumerated invariant file the moment it lands. ⛔ **NEVER an `uncovered` row** (that list only shrinks) and ⛔ **NEVER by re-serializing** `scripts/mutation-coverage-manifest.json` (**554** entries at this base — a formatter's diff buries the one row that matters). ⚠ **Option 1 (a standing regression in `scripts/mutation-sweep.sh`) IS UNAVAILABLE TO A BUILD LANE**: the sweep's own revert is the `git checkout --` family this program's shared-tree protocol forbids outright. ⇒ **Option 2**: ONE surgical `rationale` entry beside its twelve siblings, in the GRAMMAR / COMMERCIAL / §75 shape, describing REAL convicting power (this file carries in-suite mutant-control arms per §13) and **NAMING ITS PROMOTION PATH**. The deferral is real and recorded, not an excuse |
| **§85.4 — seeded chooser / pool mint** | ⛔⛔ **INCURRED, AND IT IS THE OBLIGATION MOST EASILY MISSED HERE.** A receipt pool resolved by a seeded pick is a **pool mint**, which carries TWO estate-wide obligations priced at compile: (a) its **decision-fork classification row**, classified by the registry's own taxonomy — ⛔ no honest class is a STOP, never a guess; (b) its **mechanism-coverage baseline row**, appended with the standard rationale idiom. Both belong to this minting wave, not to whichever family owns the file. ⚠ If the pool is resolved by a pure ordering rather than a seeded pick, this row becomes NOT INCURRED — **resolve it at the implementing tip against the chosen resolver, and say which** |
| **size baseline / hot files** | **NOT INCURRED, MEASURED.** No named file has a `scripts/.size-baseline.json` entry and none is on the hot-file list. Re-measured with eslint's own `Linter`: `religionState.js` **356/800** · `religiousContest.js` **468/800** · `heraldRouting.js` **268/800** · `settlementRumors.js` **508/800** · `chroniclersLetter.js` **220/800**. ⛔ The two ZERO-HEADROOM-CLASS files are untouched: `peaceTerms.js` **797**, `warTermination.js` **818/818** |
| **`negativeAssertionAnchor`** | ⛔ **INCURRED, CEILING ZERO — AND THE NEW FILE HAS CEILING ZERO IN EVERY TREE.** Every negative arm in `faithKindPools.walker.test.js` and in the acceptance file carries `// anchored: <why this cannot go vacuous>` on the assertion line or the line immediately above, or routes through `tests/helpers/anchoredNegatives.js` **called by name on the same line** — an alias or wrapper is not recognised. ⚠ For a multi-line comment only the **LAST** line counts. §10 step 1 runs the preflight focusedly BEFORE the member proof is declared green |
| **coupling registry — BOTH halves** | ⭐ **NOT INCURRED, BOTH HALVES MEASURED — AND THE REASON IS A REAL FINDING.** `LAYER_PATTERNS.FAITH`'s first regex is `/^src\/domain\/worldPulse\/(?:faith\|sacred\|religion\|pantheon\|conversion\|piety\|deity\|temple)/` (`couplingInclusion.walker.test.js:150`). **`faithNews.js` and `faithReceiptPools.js` both begin `faith` ⇒ both are CLAIMED ALREADY.** No `LAYER_PATTERNS` row and no `ARGUED_UNLAYERED` entry is owed — the exact opposite of `patronFall.js`, which was named for the EVENT and matched nothing (WF-1a's terminal-gate surprise). ⇒ (a) PAIR half: the two leaves sit beside their importer in the same family, `scanCrossLayerPairs` yields no new pair, `ARGUED_ROSTER_CEILING` (**20**, `:612`, `.toBe` `:889`) stands still. (b) UNLAYERED half: neither leaf is unlayered, so `UNLAYERED_BASELINE_CEILING` (**179**, `:646`, `.toBe` `:1160`, exact in BOTH directions) stands still. ⛔ **THE FILE NAMES ARE LOAD-BEARING — a rename to `obituaryNews.js` or `extinctionPools.js` mints two unlayered modules against a baseline with zero headroom** |
| **hand-keyed address rot (`.prose-numerics-baseline.json`)** | ⛔ **INCURRED — SIX ROWS.** The baseline holds six rows keyed to `religiousContest.js` at lines **894** and **926** (three categories each). This member's fold edit sits above them. ⛔ **RE-ADDRESS; NEVER DELETE.** ⚠ Re-read the live `line` fields at the implementing tip: WF-1b-i moved them first, so the figures in THIS packet are stale by construction |
| **declared shift** | **NOT INCURRED, stated affirmatively.** No preset declares `faithUnseatingEnabled`, so the lit path is exercised by no soak case and no golden corpus. Dark is byte-identical by construction. ⛔ Motion in a same-seed golden is a **STOP**, never a re-record |
| **chair value signature (§42/§43, §78 F-5)** | **NOT INCURRED.** This member authors **no number**. The fire bar is WF-1b-i's `supp.length > KEEP`, read where `KEEP` lives (RAISED-4, satisfied by construction). The pool floor of four is DERIVED from `CHRONIC_FLOOR`/`CADENCE_STEP` in the shared helper, not authored here. ⛔ No `<NAME>_TUNING` table is minted and no existing table gains a member |
| **§77 premise map** | **INCURRED.** Rows in §12 |
| **`docs/**.md` naked-claim debt** | **INCURRED — PER CLAIM.** Run the exact `CLAIM_RE` BEFORE writing; never accept a `0 problems` match that is silently `30 problems` |

---

## §7 · HARD SCOPE BUDGET — AND THE OVERRIDE THIS MEMBER MUST RECORD BEFORE DISPATCH

| limit | budget | WF-1b-ii | |
|---|---:|---:|---|
| behavior families | 1 | 1 | ✓ |
| new persisted record families | 1 | **0 — writes no state** | ✓ |
| named writer per changed state | 1 | **0 states written** | ✓ |
| feature flags | 1 | **0 new, 0 new conjunctions** | ✓ |
| user-facing surfaces | 1 | 1 — the Herald feed | ✓ |
| direct production consumers | 2 | 1 — the fold calls the new leaf | ✓ |
| new logic-bearing production leaves | 2 | **2** — `faithNews.js`, `faithReceiptPools.js` | AT CAP |
| existing logic-bearing production files modified | 3 | 2 — `religionState.js`, `religiousContest.js` | ✓ |
| **registration-only production files** | **3** | **3** — `heraldRouting.js`, `chroniclersLetter.js`, `settlementRumors.js` | AT CAP |
| **handwritten files total** | **12** | **14** | ⛔ **OVERRIDE REQUIRED** |
| new/changed effective production lines | 400 | ~70 projected | ✓ |
| each new leaf | 250 | 50 / 13 on the IN-1c-a precedent | ✓ |
| shared/hot-file delta | 15 each | **0 hot files named** | ✓ |
| acceptance cases | 8 | 7 (§9) | ✓ |

⛔⛔ **THE OVERRIDE, STATED SO IT IS VETOABLE RATHER THAN ASSUMED.** `PACKET_STANDARD` §"Default hard
scope budget" opens *"Unless the packet records a smaller or explicitly approved larger budget before
dispatch"*, and GR-PREAMBLE §P2 adds the rule that decides its form: ⛔ **"AN OVERRIDE NEVER
TRANSFERS."** CR-GR4B-2's historical `3 → 5` and `12 → 14` were approved for GR-4b-α **alone**.
**This member therefore asks for its OWN override, one row, against a MEASURED file count
enumerated one row per file from its own §8 manifest:**

> **REQUESTED — handwritten files total, 12 → 14.** Registration-only production files stay at the
> DEFAULT 3 and are not asked to move; new leaves stay at the default 2. **One row, and no others.**

**Grounds:**

1. **The two files over budget carry no independent decision.** Twelve of the fourteen are the
   default; the two beyond it are `tests/lint/faithKindPools.walker.test.js` (the family walker every
   one of the other ten registry families already has) and `scripts/mutation-coverage-manifest.json`
   (that walker's mandatory one-line row). Neither is a design act.
2. **The count is measured, not estimated** — §8 enumerates fourteen rows, one per file. ⛔ A packet
   that records N and then touches N+1 is the quiet renegotiation the standard forbids.
3. **Nothing else is asked.** The line budget is at ~18% of cap and no hot file is named.

⛔ **A CHAIR RULING ON THIS ROW IS A PRECONDITION OF DISPATCH.** Without it this packet STOPS at
promotion under preamble §P7.7.

---

## §8 · EXACT CHANGE MANIFEST

⚠ **Collision:** `religionState.js` and `religiousContest.js` are reserved by `WF-1B-I` at **every**
non-terminal status, DRAFT included (§45.2). ⛔ **SERIAL PROMOTION: i must be LANDED first.** Never a
validator edit and never a demotion.

### Handwritten (14 files)

| # | action | path | symbol / region | max eff Δ | instruction |
|---|---|---|---|---:|---|
| N1 | CREATE | `src/domain/worldPulse/faithNews.js` | `FAITH_KIND_REGISTRY`, `FAITH_KINDS`, `faithReceipt` | **≤80** | The FAITH kind registry, ONE row: `faith_last_altar_dark`, significance `major`, audience `public`, section `faith`, `requiredSlots.length === pool.length`. Copy the shape of `informationNews.js` (**50 eff**) exactly. ⛔ The filename is load-bearing — `faith*` is what `LAYER_PATTERNS.FAITH` claims |
| N2 | CREATE | `src/domain/worldPulse/faithReceiptPools.js` | the pool | **≤40** | ≥**4** authored variants (the DERIVED `major` floor), **four different STRUCTURES AND ANGLES**, not four rewordings. ⛔ No slot the engine cannot supply at the deletion — creed name, settlement name, tick, `suppressedAtTick` and nothing else. ⛔ The filename is load-bearing |
| N3 | MODIFY | `src/domain/worldPulse/religionState.js` | `pruneSuppressed` | **≤4** | Only if the returned ref shape needs widening (e.g. `{ ref, suppressedAtTick }` rather than a bare ref) to let the beat name the dormancy. ⚠ **VERIFY-FIRST: if WF-1b-i's return already suffices, this row is DROPPED and the handwritten count falls to 13** |
| N4 | MODIFY | `src/domain/worldPulse/religiousContest.js` | `advanceReligionStates` | **≤14** | Collect `advanceShares`'s returned refs; mint one beat per ref behind the already-hoisted `unseating` local. ⛔ Do not add a second flag read; do not move `priorPatron` or `prevPatron` |
| N5 | MODIFY | `src/domain/realm/heraldRouting.js` | `SECTION_OF` / `EXACT_SECTION` | **+1** | `faith_last_altar_dark: 'faith'`, in the FAITH block at `:138-150`. ⚠ The `faith_` prefix at `:357` also matches; the exact row is what keeps `ROUTED_TOKENS` and `REGISTERED_KIND_COUNT` moving together (§2.3). Base **268/800** |
| N6 | MODIFY | `src/domain/display/chroniclersLetter.js` | `KIND_SECTION` | **+1** | One row. ⚠ `tests/domain/chroniclersLetter.test.js:305` asserts every `KIND_SECTION` key is a genuinely minted kind, and `heraldRouting.walker.test.js`'s `KIND_SECTION_CORRESPONDENCE` asserts it agrees with routing modulo recorded divergences. Base **220/800** |
| N7 | MODIFY | `src/domain/display/settlementRumors.js` | `WHAT_PHRASES` (`:116`) | **+1** | One phrase. ⛔ **REQUIRED for a desk kind and FORBIDDEN for a `section: null` dossier kind** — this kind carries a desk, so the row is required. Base **508/800** |
| N8 | TEST | `tests/lint/faithKindPools.walker.test.js` | new file | — | ⛔ **NEW FILE — the planned interior red.** Both directions: unwritten claims red AND unclaimed writes red (an exact-set `toEqual` or equivalent). ⛔ **At least TWO IN-SUITE MUTANT-CONTROL arms proven to THROW on every ordinary run** (the §75 idiom) — never a sweep plant, because `git checkout --` on a live shared tree is thrice prohibited. Copy `informationKindPools.walker.test.js` (**252 raw**). ⛔ ONE literal `describe`, straight-line `it` calls, string-literal titles — no `.each`, no `runIf`, no nesting |
| N9 | TEST | `tests/lint/kindPoolFloors.walker.test.js` | `REGISTRIES`, `REGISTERED_KIND_COUNT`, `ROUTED_TOKENS`, the small-family arm | — | Import `FAITH_KIND_REGISTRY`; `REGISTRIES` **10 → 11**; `REGISTERED_KIND_COUNT` **112 → 113**; `ROUTED_TOKENS` **378 → 379**; the divergence identity **holds at 8**; ⛔ the small-family exact list `['INFORMATION']` **→ two members** (§2.4). Each is an exact equality; each is named here rather than discovered |
| N10 | TEST | `tests/domain/impactKindWalkers.test.js` | `EXPECTED_VOICE` | — | ⚠ **ONLY IF the beat is minted with the literal `impactKind: 'faith_last_altar_dark'`** — the walker's `MINT_RE` is `/impactKind:\s*['"]([a-z][a-z0-9_]*)['"]/g` over `src/domain`. If so it owes an `EXPECTED_VOICE` classification (a real crier category or an explicit `null`) and the `unphrased` `toEqual([])` arm is satisfied by N7. **Resolve at the implementing tip against the actual mint idiom** |
| N11 | TEST | `tests/domain/patronFall.test.js` | the ONE existing `describe` | — | The seven acceptance cases of §9, added as straight-line `it` calls into the existing `describe` so `suiteTitles` moves only by N8's one |
| N12 | TEST | `tests/lint/sovereigntyLightingContract.walker.test.js` | the census tuple | — | Re-derive the WHOLE five-figure tuple in THIS commit; never inherit, never patch one figure; decompose the delta per file |
| N13 | TEST | `tests/lint/.prose-numerics-baseline.json` | 6 `line` fields | — | RE-ADDRESS the six `religiousContest.js` rows. ⛔ Never delete; insert surgically; never re-serialize. ⚠ Re-read the live values — WF-1b-i moved them first |
| N14 | GUARD | `scripts/mutation-coverage-manifest.json` | ONE `rationale` entry | — | N8's mandatory row. ⛔ **NEVER an `uncovered` row. NEVER a re-serialize** — insert surgically beside its twelve `*KindPools`-class siblings and check the diff is a pure insert. NAME ITS PROMOTION PATH |
| N15 | DOC | `docs/implementation/packets/fp/WF-1B-II.md` | whole file | — | This packet. ⚠ `CLAIM_RE` before committing |

⚠ **N15 is a DOC row and N14 a GUARD row; the fourteen counted against the cap are N1–N14.** The doc
receipt is not a production line and the packet itself is the fifteenth path.

### Generated

**NONE.** No edge-shared closure contains a named path (§6). `npm run gen:dossier-prose` is NOT run.

---

## §9 · ACCEPTANCE (closed denominator — 7 cases)

⚠⚠ **RUN THE FIXTURE AND PRINT WHAT THE ENGINE DID BEFORE WRITING ANY PIN.** This lane executed the
prune bar at `9d851fae` (§0). The implementer re-runs at its own tip and compares.

| id | case |
|---|---|
| B1 | **The beat fires at the derived bar, once.** A settlement seeded with **exactly four** suppressed entries prunes one and mints exactly ONE `faith_last_altar_dark` naming that creed and the settlement by name. ⛔ The bar is `supp.length > KEEP`; **a literal 4 appears nowhere** (RAISED-4) |
| B2 | **Three suppressed mints NOTHING — the non-vacuous negative.** Executed: `suppressed=3 → deleted=[]`. The fixture is one entry short of the bar and otherwise identical to B1, so the negative is a genuine near-miss and not an empty setup. ⚠ **Spectacle-aware per §P2.9:** this beat's predicate is a deletion count, not a `drawsPilgrims`-class scale predicate, so no arm of it can be silently satisfied at `scaleBand >= SPECTACLE_SCALE` — stated affirmatively. **anchored:** the positive control in the same test proves the feed rendered at all |
| B3 | **Five suppressed mints TWO — the beat is per DELETED creed, not per tick.** Executed: `suppressed=5 → deleted=[d.S3,d.S4]`. This is the case that would go vacuous if the mint were hoisted out of the deletion loop |
| B4 | **The obituary is DERIVABLE, not alphabetical.** With stamps and refs disagreeing in order, the beat names the **longest-dormant** creed — the one lit `pruneSuppressed` deleted — and NOT the codepoint-last. ⛔ A fixture whose two orders agree is vacuous (base == cure) and is a STOP |
| B5 | **Dormancy, on a deity-BEARING world.** Dark, the deletion still happens in codepoint order and **no beat is minted**: the rendered feed carries no `faith_last_altar_dark` — **anchored** against the positive that the feed rendered and is populated (the rendered-surface-negative law's second vacuity is a negative that passes because the surface never rendered at all). `{}` vs `{faithUnseatingEnabled:false}` byte-identical; the LITERAL `faithUnseatingEnabled: true` drive moves a fenced byte (the LIT-MUTANT CONTROL). ⛔ The deity-free corpus golden is NOT this fence |
| B6 | **Registration totality, both directions.** The kind resolves a pool of at least the DERIVED `major` floor (four) with `requiredSlots.length === pool.length`; `SECTION_OF('faith_last_altar_dark')` is `'faith'` and equals the registry row's own `section`; `WHAT_PHRASES` and `KIND_SECTION` both carry it. An unregistered kind reds and an unclaimed registration reds |
| B7 | **The receipt is GAME-GRADE and address-complete (L6).** One band per clause, comparisons in words, **no floats and no decimals** on composed output; id + full address chain + typed action + the settlement named + the reason. ⛔ **DOCTRINE:** the sentence's subject is the altar and the congregation — it never says a god left, died or failed (§5) |

---

## §10 · CHECKS

```
npx vitest run tests/lint/faithKindPools.walker.test.js \
  tests/lint/kindPoolFloors.walker.test.js \
  tests/lint/heraldRouting.walker.test.js \
  tests/lint/phrasedKindPools.walker.test.js \
  tests/lint/heraldContaminationFence.test.js \
  tests/lint/mutationCoverageManifest.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js \
  tests/lint/couplingInclusion.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/domain/impactKindWalkers.test.js \
  tests/domain/chroniclersLetter.test.js \
  tests/domain/heraldIntegrity.test.js \
  tests/domain/patronFall.test.js \
  tests/domain/religionState.test.js \
  tests/domain/religiousContest.test.js \
  tests/property/worldpulseDeityGolden.test.js
```

1. ⛔ **§31 ANCHOR PREFLIGHT, MANDATORY — and N8 is a NEW FILE with CEILING ZERO in every tree:**
   `npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?` — bare,
   in-shell, never piped, BEFORE the member proof is declared green.
2. ⛔ **NEVER wrap `npm run check*` in `gate-mutex.sh --run`** — it self-deadlocks and **exit 3 is the
   mutex giving up, not a red.** Run `check:tail` bare, fresh shell, `; echo TRUE_EXIT=$?`, and
   outlast it in your own turn.
3. ⚠ **Trust no exit you did not capture**; read only SELF-NAMED logs.
4. **Report BOTH typecheck configurations** at their exact floors, naming the config AND the window.
5. ⚠ **THE LIGHTING CENSUS IS SEQUENCED AND STOPS AT ITS FIRST RED FIGURE.** `files` reds here by
   construction, so `parked`/`credited`/`titles`/`suiteTitles` **never execute** until the tuple is
   re-derived whole. ⛔ **Prove `suiteTitles` SEPARATELY**: grep the whole diff over `tests/` for added
   `describe(` lines and require the exact predicted count.
6. Pre-existing reds derived from `scripts/.test-ratchet-baseline.json` WHOLE, never from memory
   (**11** banked entries against `CEILING = 17` at this base).

---

## §11 · JUDGMENT CALLS (vetoable)

- **J-TCWF1B-6 — the kind is spelled `faith_last_altar_dark`.** Chose the volume's own voice over
  `faith_creed_extinct` and `faith_deity_departed`; the last two make a god the subject of the
  sentence and are refused under the DEITY DOCTRINE at compile, not softened.
- **J-TCWF1B-7 — the kind takes an `EXACT_SECTION` row despite the `faith_` prefix router.** The
  prefix would route it for free, but a desk-bearing REGISTERED kind with no routing row breaks
  `kindPoolFloors`'s divergence identity (held at 8) — measured, not assumed.
- **J-TCWF1B-8 — significance `major`, floor four.** An extinction is rare. The floor is DERIVED from
  the shared helper's `CHRONIC_FLOOR − rank × CADENCE_STEP`, never authored here. *Say "veto" for
  `notable`, which raises the floor to six authored variants.*
- **J-TCWF1B-9 — the override asks for ONE row.** Chose `12 → 14` on a per-file enumeration over
  copying CR-GR4B-2's `3 → 5` registration row as well; registration-only stays at the default 3
  because §8 measures exactly three. ⛔ An override never transfers, so nothing is inherited.

---

## §12 · §77 PREMISE-MAP ROWS

| id | premise | grade at `9d851fae` | how it dies |
|---|---|---|---|
| Q-1 | the estate carries TEN kind registries and NONE is FAITH | EXECUTED — `kindPoolFloors.walker.test.js` `REGISTRIES` | another family mints FAITH first ⇒ this member becomes a CONSUMER and mints no registry |
| Q-2 | `REGISTERED_KIND_COUNT` 112 · `ROUTED_TOKENS` 378 · divergence 8 · `LEGACY_UNVOICED_TOKENS` 274 shrink-only | EXECUTED | any kind landing anywhere moves them ⇒ re-read at the implementing tip; never inherit |
| Q-3 | the small-family exact list is `['INFORMATION']` | EXECUTED | a second small family lands first ⇒ the list is already two and §2.4's review has happened |
| Q-4 | `faithNews.js` / `faithReceiptPools.js` are claimed by `LAYER_PATTERNS.FAITH`'s subject-noun regex | EXECUTED — `couplingInclusion.walker.test.js:150` | a rename off the `faith` prefix ⇒ two unlayered modules against a zero-headroom baseline. ⛔ Do not rename |
| Q-5 | the `major` pool floor is FOUR, derived | EXECUTED — `CHRONIC_FLOOR` 8, `CADENCE_STEP` 2 | the owner signs new cadence constants ⇒ re-derive, never quote |
| Q-6 | WF-1b-i has LANDED and returns the pruned refs | NOT YET TRUE | i truncates or is vetoed ⇒ ⛔ **FULL STOP** — this member has no seam |
| Q-7 | a chair-ruled `12 → 14` override exists | NOT YET TRUE | no ruling ⇒ ⛔ **STOP at promotion** (§P7.7) |

---

## §13 · MUTANTS AND HAZARDS

- **MUTANT (e) — the hoisted mint.** Move the beat out of the per-deletion loop so it fires once per
  tick. Must red **B3 alone**.
- **MUTANT (f) — the alphabetical obituary.** Name the codepoint-last creed instead of the deleted
  one. Must red **B4 alone**. ⛔ If it also reds B1, the two are entangled and one is vacuous — a STOP
  and a re-shape.
- **MUTANT (g) — the off-by-one bar.** Fire at `supp.length >= KEEP`. Must red **B2 alone** — the
  three-suppressed negative is the only arm that can see it.
- **MUTANT (h) — the ungated beat.** Drop the `unseating` conjunct. Must red **B5 alone**.
- **IN-SUITE MUTANT CONTROLS (N8, mandatory, ≥2)**, each proven to THROW on every ordinary run (the
  §75 idiom): a rotted kind spelling and a duplicated registry row. ⛔ **Never a sweep plant** —
  `git checkout --` on a live shared tree is thrice prohibited.
- Every mutant is planted by `cp` backup, convicted, and restored **`cmp`/`md5`-exact**. ⛔ **NEVER
  the `git checkout` family.**
- ⚠⚠ **A COUNT MUTANT ON A LITERAL GOES VACUOUS.** Mutants (e)–(h) each convict a **BRANCH**, never a
  constant. If two convict the same arms, one guard is vacuous — **a STOP and a re-shape**.
- ⚠⚠ **THE FIXTURE MUST BE ABLE TO EXECUTE ITS OWN DEFECT.** Reaching four suppressed entries in one
  settlement through the fold is not free: it needs repeated evictions or a siege resolution, and
  `PATRON_FLIP_TICKS` is 3 while `SHARE_STEP_MAX` is 6. ⭐ **Executed by this lane: an organic seat
  flip on a 0.1/0.9 strength split takes FIVE ticks.** ⛔ And `nicheOf` is COMPUTED
  (`${deityTemper(d)}:${d?.alignmentAxis}`) — a hand-authored `niche` string routes the same-niche
  push-out to `open_slot` and suppresses nothing. **RUN THE SEEDING FIXTURE AND PRINT THE SUPPRESSED
  COUNT BEFORE WRITING B1–B4.**
- ⚠ **THE PREFIX ROUTER IS THE TRAP AS WELL AS THE DOOR.** WF-8's totality census must count a
  `faith_*` kind **exactly once** — not once by prefix and once by exact row.
- ⚠ **A DEPENDENCY BUMP IS A MINT TRIGGER**; this packet touches neither governed path.
- ⚠ **THE WRAPPER LIES.** Read the log; never believe an exit you did not capture in-shell.

---

## §14 · REQUIRED SYMBOLS (present at THIS status; the deliverable must PRESERVE them)

⚠ Symbols and anchors only — ⛔ **never a line and never a figure.** ⚠ The five created symbols are
added at the flip to LANDED, not before.

| symbol | home |
|---|---|
| `advanceReligionStates` | `src/domain/worldPulse/religiousContest.js` |
| `advanceShares` | `src/domain/worldPulse/religionState.js` |
| `RELIGION_TUNING` | `src/domain/worldPulse/religionState.js` |
| `isSubsystemActive` | `src/domain/worldPulse/subsystemActivation.js` |
| `faithUnseatingEnabled` | `src/domain/worldPulse/simulationRules.js` |
| `SECTION_OF` | `src/domain/realm/heraldRouting.js` |
| `EXACT_SECTION` | `src/domain/realm/heraldRouting.js` |
| `PREFIX_RULES` | `src/domain/realm/heraldRouting.js` |
| `HERALD_SECTIONS` | `src/domain/realm/heraldRouting.js` |
| `KIND_SECTION` | `src/domain/display/chroniclersLetter.js` |
| `WHAT_PHRASES` | `src/domain/display/settlementRumors.js` |
| `WIZARD_NEWS_SIGNIFICANCE` | `src/domain/region/wizardNews.js` |
| `INFORMATION_KIND_REGISTRY` | `src/domain/worldPulse/informationNews.js` |
| `SOVEREIGNTY_KIND_REGISTRY` | `src/domain/worldPulse/sovereigntyNews.js` |
| `GRAMMAR_KIND_REGISTRY` | `src/domain/worldPulse/grammarNews.js` |
| `FREQUENCY_FLOORS` | `tests/helpers/kindPoolWalker.js` |
| `floorFor` | `tests/helpers/kindPoolWalker.js` |
| `FAITH_KIND_REGISTRY` *(created; add at the flip)* | `src/domain/worldPulse/faithNews.js` |
| `FAITH_KINDS` *(created; add at the flip)* | `src/domain/worldPulse/faithNews.js` |

`retiredSymbols`: **none.**

---

## §15 · PREFLIGHT (each is a STOP if it fails)

0. ⛔ **`WF-1B-I` IS LANDED**, and its pruned-refs seam resolves in the live tree. Without it this
   member has no producer.
1. ⛔ **A CHAIR RULING EXISTS ON §7's `12 → 14` OVERRIDE.** Without it, STOP at promotion.
2. ⛔ **THE CHAIR HAS RULED §4** — beat here, or re-filed to WF-8. Without that ruling this packet is
   compiled but not dispatchable.
3. `git rev-parse HEAD` is an accepted descendant of `9d851fae` with every §14 symbol resolving;
   discharge by an **EXECUTED `git diff --name-only`, quoted** (§P8).
4. Packet status is **READY**. It is DRAFT as written — do not dispatch.
5. `npm run validate:packets` exits 0; re-run the collision check — `WF-1B-I` must be terminal.
6. ⛔ **RE-READ, NEVER INHERIT**, at the implementing tip: the lighting tuple; `REGISTERED_KIND_COUNT`;
   `ROUTED_TOKENS`; the divergence identity; `LEGACY_UNVOICED_TOKENS`; the small-family exact list;
   and the six `.prose-numerics-baseline.json` `line` fields (WF-1b-i moved them).
7. Re-measure with eslint's own `Linter`: `religionState.js`, `religiousContest.js`,
   `heraldRouting.js`, `settlementRumors.js`, `chroniclersLetter.js`.
8. ⛔ **Capture the own-footprint golden BEFORE wiring**, on a deity-BEARING fixture built through
   `SET_PRIMARY_DEITY` / `IMPOSE_CULT`.
9. ⛔ **RUN THE B1–B4 SEEDING FIXTURE AND PRINT THE SUPPRESSED COUNT AND THE DELETED REFS** before
   writing their pins.
10. **Name the interior red in the train plan BEFORE it exists** (§P7.15): N8 reds the lighting census
    by construction, with the predicted figures stated.
