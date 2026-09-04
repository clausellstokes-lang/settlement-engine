# ENC-3 — LANDING PLAN (lane ENC3CHECK, seat Opus 5, 2026-09-04)

Base of the work: `30c1667bc` (dock `laneENC-tree`, 13 uncommitted paths, UNTOUCHED).
Target: `f537ce47e` (§891 landing tip, 27 cars).
Preserved artefacts: `enc3-preserved/{tracked.patch, untracked/, BASE.txt, PORCELAIN.txt}`.

**HEADLINE: the patch still applies clean, and it must NOT land as it stands.** Six
defects, three of them gate-reddening on arrival, one a silent semantic inversion.

---

## 1. THE THIRTEEN PATHS — WHAT EACH DOES

The dock porcelain at this moment is **byte-identical** to the chair's capture, so the 13
are the complete set (`diff PORCELAIN.txt porcelain-now.txt` → identical).

### The two NEW files (untracked)

| Path | Size | What it is |
|---|---|---|
| `src/domain/worldPulse/envoyChanceMeetingStage.js` | 759 lines / 35,489 B | **The car.** The stage that wires ENC-1's pure resolution to ENC-2's ledgers. Exports `chanceEncountersActive` (the ONE by-name `=== true` gate read), `dropStaleMeetingLedgers` (the drop pass), `advanceChanceMeetings` (the stage), `chanceMeetingLessonEntries` (the out-of-leaf lived-experience adapter), `CHANCE_MEETING_EXPERIENCE_KIND`, and two tuning blocks. Projects both parties from the pulse's pre-mutation cut, calls `resolveChanceMeeting`, then routes each receipt to the writer that owns its ledger: marks → `applyMeetingMarkLedger`, leans → `applyMeetingLeanLedger`, lessons → `foldLivedExperience`, grievances → `applyRelationshipPatch`. Writes no errand row. |
| `src/domain/certification/subsystemRowsEncounters.js` | 99 lines / 12,169 B | The ENCOUNTERS family's certification leaf — one row for `chanceEncountersEnabled`, with `eventTypes: []` and `moverFamilies: []` both deliberately empty, two `stateKeys`, six invariants and `soakEvidence: 'unobserved'`. A family leaf rather than a tail row, so the family can grow without rebasing. |

### The eleven MODIFIED files (`tracked.patch`, 20 hunks)

| Path | Hunks | Change |
|---|---|---|
| `src/domain/certification/couplingRegistry.js` | 1 | Re-exports the two new ENC-3 coupling symbols. |
| `src/domain/certification/couplingRegistryEncounters.js` | 1 | +94 lines: two coupling rows — `CPL-19.INFO_TO_GRAMMAR` (the host court's wariness sharpens the exposure die) and `CPL-21.INTERIOR_TO_GRAMMAR` (one row licensing all four interior imports). Both appended to `ENC_ENCOUNTERS_COUPLINGS`. |
| `src/domain/certification/subsystemRowsVirtual.js` | 2 | Imports and spreads `ENCOUNTERS_SUBSYSTEM_ROWS` **last**, so no existing row shifts. |
| `src/domain/npc/livedExperienceCatalog.js` | 1 | Adds the `met_a_foreigner` row — personal plane, bond family, non-ambient, empty vector with `vectorSupplied: true` (the first such row in the table). |
| `src/domain/npc/livedExperienceSources.js` | 1 | Adds `met_a_foreigner` to `ADAPTER_HOMED_ELSEWHERE`, pointing at the stage's `chanceMeetingLessonEntries`. |
| `src/domain/worldPulse/envoyPulse.js` | 4 | Mounts the stage as WR-7b (5), after the parlay stage and before `advanceEnvoyErrands`; hoists `dropStaleMeetingLedgers` **above** the `envoyDiplomacyActive` early return (the P-7 cure widened by one gate); filters the pre-mutation cut by JSON identity so an already-moved errand cannot also be met on. |
| `src/domain/worldPulse/simulationRules.js` | 1 | Adds `'chanceEncountersEnabled'` to `ENGINE_GATED_VIRTUAL_RULE_KEYS`. |
| `tests/domain/couplingRegistry.test.js` | 2 | Enrols the CPL-19 row as the seventh on that direction. |
| `tests/domain/npc/livedExperienceCatalog.test.js` | 2 | `LIVED_EXPERIENCE_KINDS` 32→33; `RECEIPTED_EXPERIENCE_KINDS` 20→21. |
| `tests/domain/npc/livedExperienceSources.test.js` | 2 | `elsewhere` roster gains `met_a_foreigner`; the DARK-BY-CONSTRUCTION importer set gains the stage. |
| `tests/domain/subsystemRowsVirtual.test.js` | 3 | Adds `CHANCE_ENCOUNTERS` to `VIRTUAL_RULES` and its three lane leaves to `LANE_LEAVES`. |

**Note the shape:** four test files are *modified*; **zero test files are added**. The car
is a 759-line stage with no test of its own. See §6.

---

## 2. THE COLLISION SET

`git diff --name-only 30c1667bc f537ce47e` = **86 files**. Intersected with the 13:

> **`src/domain/worldPulse/simulationRules.js` — and nothing else.**

One file, moved by exactly one commit, `c6d598d5b` (**O-12**), which added a **+25-line
comment block only** (`1 file changed, 25 insertions(+)`) at ~line 642, inside
`SIMULATION_RULE_PRESETS`, recording that the eight war sub-flags are no longer held out
of the drama set.

ENC-3's single hunk in that file is at **line 475**, inside
`ENGINE_GATED_VIRTUAL_RULE_KEYS`. **The two edits are in disjoint regions ~167 lines
apart.** The collision is nominal, not textual.

⚠ Worth flagging for the chair: ENC-3's own comment says *"THE KEY'S LITERAL NAME MAY
APPEAR IN THIS FILE ONLY HERE"*, because the mechanism lit-coverage walker scans this
file's **raw source** for `/\b[a-zA-Z][a-zA-Z0-9]*Enabled\b/` without blanking comments.
O-12's new block names eight `…Enabled` flags in comments. That is O-12's business, not
ENC-3's — but it means the denominator moved under ENC-3's feet, and ENC-3's claim about
its own uniqueness in that file should be re-run rather than re-read.

---

## 3. DOES IT STILL APPLY? — YES, CLEANLY

Method: a **private scratch index** built from `f537ce47e` via `GIT_INDEX_FILE=… git
read-tree`, then `git apply --cached --check`. Nothing was written to any worktree, any
ref, or the repo's real index.

```
APPLY_WHOLE_EXIT=0        (no output — clean)
```

Per file, all 11 exit 0:

```
exit=0  hunks=1    src/domain/certification/couplingRegistry.js
exit=0  hunks=1    src/domain/certification/couplingRegistryEncounters.js
exit=0  hunks=2    src/domain/certification/subsystemRowsVirtual.js
exit=0  hunks=1    src/domain/npc/livedExperienceCatalog.js
exit=0  hunks=1    src/domain/npc/livedExperienceSources.js
exit=0  hunks=4    src/domain/worldPulse/envoyPulse.js
exit=0  hunks=1    src/domain/worldPulse/simulationRules.js
exit=0  hunks=2    tests/domain/couplingRegistry.test.js
exit=0  hunks=2    tests/domain/npc/livedExperienceCatalog.test.js
exit=0  hunks=2    tests/domain/npc/livedExperienceSources.test.js
exit=0  hunks=3    tests/domain/subsystemRowsVirtual.test.js
```

**Controls, both directions** (an exit-0 with no output is worthless without them):

- POSITIVE — patch vs its own base `30c1667bc`: `EXIT=0`.
- NEGATIVE 1 — patch vs `60255ca8e`: `EXIT=1`, four files fail, one absent from index.
- NEGATIVE 2 — a deliberately corrupted patch vs `f537ce47e`: `EXIT=1`.

The instrument moves in both directions, so the green is a real bit.

⚠ The first probe run in the MAIN checkout reported nonsense (`No such file or
directory` for six src files) — that tree is the **ledger line** at `88be66ab8` and does
not carry `src/`. It also printed `EXIT_A=0`, which was `head`'s exit, not `git apply`'s.
Both were discarded; every exit above was captured directly.

---

## 4. THE TWO RULINGS — BOTH STILL UNEXECUTED

Quoted from `git show f537ce47e:src/domain/worldPulse/npcLadderState.js`:

```js
// line 382-383
/** The typed contest-grudge kinds (D-4c) — the memory-weave loss→fixation loop. @type {ReadonlySet<string>} */
export const GRUDGE_KINDS = Object.freeze(new Set(['contest_loss', 'contest_forestalled']));

// line 406-407
/** The three positive-bond kinds — the grudge's mirror image. @type {ReadonlySet<string>} */
export const BOND_KINDS = Object.freeze(new Set(['loyalty', 'gratitude', 'friendship']));
```

**`respect` is absent from `BOND_KINDS`. `rivalry` is absent from `GRUDGE_KINDS`.** Both
rulings are unexecuted at the product tip.

The stale deferrals the brief describes are real, and they are in the **ENC-1/ENC-2 leaves**,
not the ENC-3 work:

- `envoyChanceMeeting.js:129-131` — *"`respect` and `rivalry` ride OWNER ROWS 2 and 3 and are REFUSED by the consumer until those rows are ruled."*
- `envoyChanceMeetingLedger.js:56` — *"only `bond` is reachable until the owner rules the rivalry word (§12 row 3)"*
- `envoyChanceMeetingLedger.js:68` — *"`grudge` is SHAPE-READY and UNREACHABLE until the owner rules the rivalry word (§12 row 3); ENC-5 lifts the stage's refusal."*

### MUST ENC-3 CARRY THEM? — YES, one way or the other, because the refusal does not exist

This is the second defect, and it is not in the brief. **The refusal those three comments
promise is not in the code.** `envoyChanceMeeting.js:975-980` emits:

```js
receipt.mark = {
  kind: outcome === 'bond' ? 'friendship' : outcome,   // ⇒ 'respect' or 'rivalry'
  sev: 'half', holderNid: one.nid, otherNid: two.nid,
};
```

and the stage's `collectDeposits` (line 587-600) writes it through with **no kind check at
all**:

```js
if (weaveLit && ladderLit && Object.keys(mark).length) {
  ...
  const row = { mark: 'bond', otherNid, foreignSid: …, kind: text(mark.kind), sev: …, depositTick };
```

`mark: 'bond'` is hardcoded and `kind` is passed through raw. The only occurrence of the
string `'respect'` anywhere in the stage is the Herald beat classifier at line 499.

Downstream, `normalizeBonds` coerces:

```js
const kind = typeof b.kind === 'string' && BOND_KINDS.has(b.kind) ? b.kind : 'friendship';
```

**So a `respect` mark silently becomes `friendship`, and a `rivalry` outcome — which is
the grudge arm — is deposited under grain `'bond'` and also coerces to `friendship`.** A
rivalry becomes a friendship. That is a semantic inversion, not a rounding.

Two lawful dispositions, and the chair must pick one:

- **(A) Carry the rulings.** Add `respect` to `BOND_KINDS`, `rivalry` to `GRUDGE_KINDS`,
  and route a `rivalry` outcome to grain `'grudge'` in `collectDeposits`. This makes the
  three stale comments true and spends the rulings that already exist.
- **(B) Implement the documented refusal.** Have the stage drop marks whose kind is not
  in `MEETING_MARK_GRAINS`-reachable territory, leaving ENC-5 to lift it.

⛔ **Not mine to choose.** (A) changes what is persisted into a ladder record, which is
persistence shape. The *kind vocabulary* is ruled; the *grain routing* is not. I refuse
the call and hand it up. What is NOT optional is that one of the two must land with the
car — shipping neither is shipping the inversion.

---

## 5. THE `nid` VERDICT — CONFIRMED, AND WORSE THAN REPORTED

`envoyChanceMeetingStage.js:654-665`, quoted whole:

```js
/** Was any axis of this subject taught inside the cadence window?
 *  @param {Record<string, unknown>} driftMap @param {string} nid @param {number} now
 *  @param {number} cadence @returns {boolean} */
function taughtRecently(driftMap, nid, now, cadence) {
  for (const axes of Object.values(driftMap)) {
    for (const cell of Object.values(asObject(axes))) {
      const updated = num(asObject(cell).updatedTick);
      if (updated > 0 && now - updated < cadence) return true;
    }
  }
  return false;
}
```

`nid` is declared, passed correctly by the caller (line 642), and **never read in the
body.**

The map's shape is confirmed from `characterDrift.js:314-328`: `characterDriftOf` returns
`Record<wnpcId, Record<axisId, AxisDrift>>`. So `Object.values(driftMap)` iterates **every
NPC in the world**, and `Object.values(axes)` their cells.

**Consequence.** The docblock says *"any axis of **this subject**"*; the body answers *"any
axis of **any subject**"*. The per-subject season cap is a **world-wide lesson lockout**:
if any NPC anywhere had any drift cell written inside the cadence window, every chance
meeting in the world is refused a lesson. In a populated world that is near-permanently
true, so `met_a_foreigner` would be **effectively dead on arrival** — and the
certification row's §7.4 rate claims would be false while every test of the lit stage
still passed, because the refusal is silent and pre-funnel.

**The cure**, one line, using the family's own single-subject reader:

```js
function taughtRecently(driftMap, nid, now, cadence) {
  for (const cell of Object.values(asObject(driftMap[nid]))) {
    const updated = num(asObject(cell).updatedTick);
    if (updated > 0 && now - updated < cadence) return true;
  }
  return false;
}
```

⚠ The cure must arrive **with a test that fails before it and passes after** — a fixture
with two subjects where one was taught inside the window and the other was not, asserting
the second still learns. Without that, the fix is unfalsifiable and the next refactor
re-introduces it.

⚠ Note `driftEntryOf(worldState, wnpcId)` already exists and is the canonical reader, but
importing it would deepen the drift-door breach in §6.3 — so index the map that is already
in hand, as above.

---

## 6. THE HARD LIMITS

### 6.1 The known-failure census — the brief's premise is STALE

`scripts/.test-ratchet-baseline.json` @ `f537ce47e`: **10 entries**. `tests/lint/testRatchet.test.js:182`: **`const CEILING = 17;`**

> **Headroom is 7, not 0.** The ceiling was raised by `9df7e428b` ("The six oldest census
> rows retire by rebuild, not relocation"). The memory row *"THE KNOWN-FAILURE CENSUS IS
> FULL — 10/10 with ZERO headroom"* is superseded and should be re-written.

That said, **banking is still the wrong move here** — every red below has a cheap real cure.

### 6.2 The Tier-2 voice arm — ⛔ **BREACHES, THREE CEILINGS**

The brief's `382/382` is right, and it is a **magnitude ceiling on a banked row**, not the
`.voice-mechanics-baseline.json` (which is 102 rows / 455 em — a different, stale object).
The four voiceMechanics arms are all banked known failures; what is armed is `magnitude`,
and `--update` can only **lower** a ceiling. So each ceiling sits exactly at its measurement.

I re-derived both sides by extracting the estate's own `stringLiteralContents` **verbatim
from the committed test source** (diffed against a hand transcription: identical but for
one variable name) and running the magnitude report over `git archive` trees in scratch.

**At `f537ce47e` my computation reproduces all five committed ceilings exactly** — the
strongest available control, five figures I did not fit:

| Measure | f537ce47e | ceiling | +ENC-3 | verdict |
|---|---|---|---|---|
| per-file arm `em` | **382** | 382 | **392** | ⛔ **BREACH +10** |
| per-file arm `bang` | 9 | 9 | 9 | ok |
| per-file arm `files` | **69** | 69 | **70** | ⛔ **BREACH +1** |
| total arm `em` | **770** | 770 | **780** | ⛔ **BREACH +10** |
| total arm `bang` | 15 | 15 | 15 | ok |

**Single cause, single file.** `src/domain/certification/subsystemRowsEncounters.js`
carries **10 em dashes inside string literals** (15 in the file; 5 are in comments and are
correctly invisible to the scanner). `envoyChanceMeetingStage.js` measures **em:0 bang:0** —
the author knew the rule for the stage and missed it for the certification leaf. The seven
modified src files add **zero** (`subsystemRowsVirtual.js` measures em:25 identically at
`f537ce47e` and in the dock).

The ten, by line, all inside quoted strings:

| line | em | field |
|---|---|---|
| 54 | 5 | `other:` (the owner-directive prose) |
| 64 | 2 | `dark_is_byte_identical` description |
| 69 | 1 | `the_flag_has_exactly_one_gate_read` description |
| 84 | 1 | `deposit_consumed_once` description |
| 89 | 1 | `willed_leash_never_ousts` description |

**CURE: strip all ten** (ODQ line 266, STRIP-never-raise — the same ruling that stripped
`aiCharter.js` 681→658 rather than banking it). Rewrite each dash as a comma, colon or
full stop per `docs/VOICE_AND_TONE.md` §6. That returns every figure to its ceiling
exactly. Raising a ceiling requires a deliberate attributed hand edit and is not available
to a lane. Lines 2, 7, 37 and 48 are comment dashes and must be **left alone** — stripping
them buys nothing and churns the file.

### 6.3 The drift door — ⛔ **REDS** (this is the §893 blocker, and the charter does not clear it)

`tests/domain/npc/characterDrift.test.js` STEP 1:

```js
expect(outside
  .filter((file) => dependsOn(readFileSync(file, 'utf8'), /from\s+'[^']*\/characterDrift\.js'/, DRIFT_SYMBOLS))
  .map((file) => relative(REPO_ROOT, file))).toEqual([DOOR]);   // DOOR = src/domain/npc/characterConsumers.js
```

`dependsOn` is a **two-arm** predicate. Measured against the stage's actual text:

```
ARM 1  module-path regex on stripped text : true
       matching line: import { characterDriftOf, positionValue } from '../npc/characterDrift.js';
ARM 2  DRIFT_SYMBOL call/deref            : true   (first hit: characterDriftOf( )
Is the stage a FAMILY member?             : false
=> STEP 1 VERDICT: RED
```

⛔ **The charter as relayed does not cure this.** `positionValue` is **already an exported
symbol** at `f537ce47e` (`characterDrift.js:407`), so "gains a legal new named export" is
either already satisfied or means something else. And measured directly:

```
Would dropping characterDriftOf (keeping positionValue) cure ARM 1? : NO — the module-path arm still matches
```

`positionValue` is **not** in `DRIFT_SYMBOLS`, so it never trips ARM 2 — but **ARM 1 fires
on any import from `characterDrift.js` whatsoever**, regardless of symbol. Three cures
exist and all are the chair's:

- **(a)** Re-export `positionValue` **and** a subject-scoped drift reader from the DOOR
  (`characterConsumers.js`) and have the stage import from there. This is the only reading
  of the charter that actually works, and it is what "a legal NEW named export with its
  reason written beside it" most plausibly means — a new export **on the door**, not on
  `characterDrift.js`. It also composes with the §5 cure, which needs only `driftMap[nid]`.
- **(b)** Enrol the stage in `FAMILY` — wrong; it is an envoy stage, not a character leaf.
- **(c)** Amend STEP 1's expected roster to `[DOOR, stage]` — a declared, vetoable
  weakening of the darkness closure. The test's own header records that this claim has been
  amended four times by *growing the family*, never by loosening the rule.

⚠ And the recorded law applies: **a red at an early assertion blinds every later assertion
in the same test.** STEP 1 red means STEPS 1b, 1c, 1d and 4 are not evaluated. Whatever
cure lands, the whole test must be re-run green, not just STEP 1.

### 6.4 Dangling `@enforced-by` — ⛔ **REDS**, and this is the citation law

`tests/docs/enforcedByExists.test.js` walks `CORPUS_DIRS = ['src', 'tests', 'scripts', …]`,
reads the wrap, and asserts `existsSync` on every path-shaped target. Simulated with its
own `PATH_RE`/`MARKER`/wrap reader:

```
=== src/domain/certification/subsystemRowsEncounters.js  (4 targets) ===
   ok        line 17 (tag)           tests/lint/subsystemCertificationTotality.walker.test.js
   ok        line 18 (continuation)  tests/lint/engineGatedRuleKeys.walker.test.js
   ok        line 19 (continuation)  tests/domain/subsystemRowsVirtual.test.js
⛔ DANGLING  line 20 (continuation)  tests/property/chanceEncountersDormancyFence.test.js

=== src/domain/worldPulse/envoyChanceMeetingStage.js  (2 targets) ===
⛔ DANGLING  line 66 (tag)           tests/domain/envoyChanceMeetingStage.test.js
⛔ DANGLING  line 67 (tag)           tests/property/chanceEncountersDormancyFence.test.js
```

**Three dangling targets naming two test files that exist nowhere** — not at `f537ce47e`,
not in the dock (`ls` on both paths: *No such file or directory*), not in the 13. Confirmed
against the live dock, whose porcelain is unchanged since capture.

That test is **not** in the known-failure census, so this is a fresh red.

⚠ Beyond the gate, this is **THE CITATION LAW**: a string is a citation or a mint by the
claim. The certification row's six invariants each carry a `check:` saying *"asserted that
way in tests/domain/envoyChanceMeetingStage.test.js"* and *"…in
tests/property/chanceEncountersDormancyFence.test.js FENCE 1/2/3/4"*. **None of those
fences exist.** The row asserts `dark_is_byte_identical` — THE PROMISE — against an
instrument that was never written. This is the single most serious finding in the car: a
759-line stage that mutates four ledgers ships with **zero tests of its own**, and its
certification row reads as though it were fully pinned.

### 6.5 The bill for the two test files that must now be written

Per the estate's recorded rule (`a-new-test-file-reds-two-censuses-at-landing`, widened
2026-08-23):

| Census | `tests/domain/envoyChanceMeetingStage.test.js` | `tests/property/chanceEncountersDormancyFence.test.js` |
|---|---|---|
| `sovereigntyLightingContract` (exact `.toBe()`) | ⛔ yes | ⛔ yes |
| `negativeAssertionAnchor` (ceiling 0) | likely — `tests/domain` carries an exact-keyed roster | ⛔ **yes** — `tests/property` is in `GENERATION_FACING_ROOTS` |
| `mutationCoverageManifest` TOTALITY | no — not an enforcer dir, basename carries no invariant token | no — same |

The lighting register is **current at `f537ce47e`**: its `files` figure is **2515** and the
live tracked count of `*.test.js(x)` under `tests/` is **2515** — exact. Adding two files
moves it to **2517**, and the register must be **re-derived WHOLE** (all five figures,
never patched), via
`LIGHTING_CENSUS_REFREEZE=… LIGHTING_CENSUS_NOTE=… npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`
**on a clean tree** — it refuses a dirty one, and it exits non-zero by design, so the
plain re-run afterwards is the proof.

### 6.6 What is NOT a problem

- **CPL-21 / INTERIOR→GRAMMAR** is an existing, registered pair+direction (GR-2, WR-5).
  `COUPLING_REGISTRY` composes `ENC_ENCOUNTERS_COUPLINGS` at position 170, **after**
  `WR5_WAR_RULING_COUPLINGS` at 147, so `couplingRegistry.test.js:753`
  (`couplingRowFor('CPL-21','INTERIOR→GRAMMAR')).toBe(WR5_SEAT_ACCEPTANCE_COUPLING)`)
  stays green. No missing test edit there.
- The `testRatchet` `totalTests`/`totalFiles` arms are **floors** (`toBeGreaterThan`), so
  adding files does not red them.
- The two sibling lane leaves named in `LANE_LEAVES` (`envoyChanceMeeting.js`,
  `envoyChanceMeetingLedger.js`) are already committed at `f537ce47e`.

---

## 7. THE ORDERED LANDING PLAN

**Register acts belong to the chair.** Steps 6 and 8 are register/ceiling work and are
marked ⚑.

| # | Act | Why here |
|---|---|---|
| 0 | **Re-verify the dock is still 13 paths** and re-run the apply-check at whatever the tip is *then*. The tip has moved once already since the work was built. | A stale apply-check is the false-report class. |
| 1 | Apply the preserved patch + drop the two untracked files onto a fresh dock at the current tip. **Do not** land yet. | |
| 2 | **Cure `taughtRecently`** to index `driftMap[nid]` (§5), and write the two-subject test that fails before and passes after. | Cheapest, fully in-lane, and it is a correctness bug that no gate would ever have caught. |
| 3 | **Strip the ten em dashes** from `subsystemRowsEncounters.js` string literals (lines 54, 64, 69, 84, 89). Leave the comment dashes. | Clears three magnitude ceilings at once. Must precede any gate run. |
| 4 | **Chair rules the drift door** (§6.3) — (a), (b) or (c) — and the cure lands. Recommend (a): a named export on `characterConsumers.js`. | Blocks the suite; everything downstream of STEP 1 is blind until it is green. |
| 5 | **Chair rules `respect`/`rivalry`** (§4) — carry the rulings or implement the refusal — and the cure lands. | Shipping neither ships a rivalry recorded as a friendship. |
| 6 | **Write the two test files** that the car already cites: `tests/domain/envoyChanceMeetingStage.test.js` and `tests/property/chanceEncountersDormancyFence.test.js`, with FENCEs 1-4 as the certification row describes. Anchor every negative in the `tests/property` file. | Clears the three dangling citations and makes the certification row true. FENCE 1 needs per-tick sha256 hashes measured **at the parent commit**, so it must be built before the car lands, not after. |
| 7 | Run the focused suites: the four modified test files, the two new ones, `characterDrift.test.js`, `enforcedByExists.test.js`, `voiceMechanics.test.js`, `subsystemCertificationTotality.walker`, `engineGatedRuleKeys.walker`, `couplingInclusion.walker`. | |
| 8 | ⚑ **Re-derive the lighting census WHOLE** on a clean tree (files 2515 → 2517 predicted; the other four figures **not predictable** — see below). Then re-run plainly for the green. | Must be last among register acts and must cover every landing lane at once, per the standing cheapest-cure-order rule. |
| 9 | ⚑ Re-run the known-failure gate. Expect **no new banked row** — every red above has a real cure. If one must be banked, note 7 slots of headroom exist, but banking here would be wrong. | |

### Figures I can derive, stated

- collision set size: **1**
- patch: **11 files, 20 hunks**, applies clean at `f537ce47e`, exit 0 whole and per-file
- voice per-file `em`: **382 → 392** (ceiling 382)
- voice per-file `files`: **69 → 70** (ceiling 69)
- voice total `em`: **770 → 780** (ceiling 770)
- em dashes to strip: **10**, in one file, at five lines
- dangling `@enforced-by` targets: **3**, naming **2** phantom test files
- known-failure census: **10 entries / ceiling 17** → 7 headroom
- lighting census `files`: **2515 → 2517**
- `LIVED_EXPERIENCE_KINDS` 32→33; `RECEIPTED_EXPERIENCE_KINDS` 20→21 (the lane's own, unverified by me against a live run)

### ⛔ Figures I REFUSE by name — not derivable from what I measured

- **`titles` and `suiteTitles`** in the lighting census. They depend on how many tests and
  describes the two unwritten test files carry. Unknowable until they exist. **Do not
  predict them; measure them.**
- **`parked` and `credited`** in the lighting census — same reason, plus they depend on
  whether each new file's test tables are statically credited under the walker's L2 rule.
- **The `negativeAssertionAnchor` count** for either new file — the files do not exist.
- **The §7.4 measured meeting/mark rates** (0.375 of foreign stops, ~0.28 marks) asserted
  in the certification row. I did not execute the leaf. Note they are stated on top of a
  season cap that is currently broken, so they are suspect in any case.
- **`sizeBaseline` / byte-budget impact** of the two new src files (+47,658 B of source).
  Not measured; a size ratchet exists in this estate and I did not run it.
- **Whether `mechanismLitCoverage`'s flag denominator moved** under O-12's new comment
  block (§2). ENC-3's uniqueness claim in `simulationRules.js` should be re-run.
- **The drift-door cure choice** and the **`respect`/`rivalry` disposition** — both are
  chair calls, one of them touching persistence shape.
