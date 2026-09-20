# EM-B1a RE-PIN — the lane's report to the chair

**Lane:** Opus COMPILE (B1a-REPIN), session 7d3418f8, 2026-09-19. **Orders:** design §19 ruling 6 +
the chair's seven-point SHAPE ruling, then the chair's **rulings R8–R11**.
**Ran no gate; implemented nothing; adjudicated nothing.**

## Status

**DRAFT RE-PINNED to packet version 2, all four rulings applied. NOT BLOCKED.**
⛔ **The R9 audit produced NO BLOCKED FINDING** — see §2 for the one thing it did turn up.

## The three files (unchanged paths)

- `…/scratchpad/lane-b1a-repin-scratch/EM-B1a.md`
- `…/scratchpad/lane-b1a-repin-scratch/EM-B1a.manifest.json`
- `…/scratchpad/lane-b1a-repin-scratch/EM-B1a.evidence.md` — §10–§16 (the re-pin) and **§17–§21**
  (the rulings) appended; version 1's §0–§9 untouched
- report: `…/scratchpad/lane-b1a-repin-scratch/EM-B1a.repin.report.md`

Tree re-confirmed `023eda2ec2f8dd2d9286584d2496c6ac4ea5309e`, worktree clean. **CONFIRMED.**

---

# PART I — THE FOUR RULINGS

## 1 · R8 — FOURTEEN. Sites changed

The roster is now spelled **ONCE**, at **§6**, in `compareCodepoint` order, and every other site
points at that one list:

`add-faction` · `add-institution` · `add-npc` · `found-phantom` · `promote-phantom` ·
`rebalance-power` · `remove-faction` · `remove-institution` · `remove-npc` · `set-field` ·
`set-institution-state` · `set-npc-status` · `set-power-holder` · `set-relationship`

**EM-B1c's five, named beside it in §6's own table:** `rename-faction`, `rename-npc`,
`rename-settlement`, `set-world-fact` (the four that left, on the *rows that delegate* line) **plus
`schedule-event`** — the nineteenth home op, **which was never in version 1's eighteen at all**.
18 − 4 = 14 here; B1c carries 5.

**Sites changed:** the **title line** · §1 authority item 2 (an explicit SUPERSEDED clause, the ARCH
row kept) · §2 outcome + definition-of-done · §3 table row + **a new derivation table** · §6 heading
and list (**the canonical one**) · §6's A4-closure paragraph · §7 coding instruction · §8 step 3 ·
**A1** (packet §9 **and** manifest) · **A3** · **A4** · the manifest `_note` · R8's entry → CLOSED.

⭐ **A1's set-equal arm now also asserts EM-B1c's five ABSENT BY NAME**, so the split cannot be
quietly re-absorbed and B1c's own landing reds here until the arm is widened deliberately.

## 2 · R9 — option (c) as a general law. Sites changed, and the audit

**Sites changed:** §16.1 gains a **`scope (subject · stage)` column on all eleven rows** · a new
**general-law + audit block** under the table · §16.2 makes **SCOPED part of the predicate's
contract** · **§16.4/A2 gains arm 4** (still **8 of ≤8**) · the manifest's `worldConditions` `_note`
and A2 case · R9's entry → CLOSED.

**The audit, by measurement (evidence §18):**

| | reader already scoped | the leaf must filter, and on what |
|---|---|---|
| **SUBJECT** | `warInProgress` (pair args; `atOpenWar` `embassyHazard.js:61` tests both directions between exactly those two) · `forceInField` (the ledger is **keyed by the fielding settlement's own id**, `warStatus.js:133-136`) · `npcPresent` (the record's own people) · `openRoute` r1 (`if (String(channel.from) !== String(settlementId)) return false;` — `graph.js:830`) | `siegeInProgress` → `targetId`/`coalition` · `tradeWith` → `edgeKeyBetween` · **`beliefExists` → per-settlement index** · `plotInMotion` → `affectedSettlementIds` · `openRoute` r2 → `e.a`/`e.b` |
| **STAGE** | seven rows (war fronts are live-only; *"currently fielding"*; `confirmedWarFronts`; `relationshipType` is a present value; a belief entry is current; `status==='active'`; `status==='confirmed'`) | `plotInMotion` → the live-stage set · `openRoute` r2 → **`grade !== 'hidden'`** |

**`plotInMotion`** mirrors the tree's idiom by symbol — `blockadeFor` (`foodStockpile.js:207`) and
`famineFor` (`:234`), each doing exactly these two things. ⚠ **`ACTIVE_STAGES`' home is
`foodStockpile.js:98` and it is MODULE-PRIVATE** (`grep -c 'export const ACTIVE_STAGES'` → **0**),
so the leaf declares its own frozen four and A2 asserts them set-equal to `STRESSOR_LIFECYCLE_STAGES`
(`stressorsCore.js:34`, the seven) **minus** `resolved`/`residual`/`dormant`.

**`openRoute` r2's stage filter is not cosmetic:** the module's own decay law is *"the bottom rung
is HIDDEN rather than absence"* (`ROUTE_GRADES` = `['highway','road','track','hidden']`, `:64`), so
without it an overgrown remnant would offer the DM "Direct trade".

### ⛔ What the audit turned up — a READER defect, and it is **not** a BLOCKED finding

**`beliefExists`' version-1 reader is a REALM-WIDE panel gate.** `hasBeliefMaps(worldState)`
answers, in its own docstring (`settlementBeliefs.js:185-190`), *"does this world carry **ANY**
belief map?"* — it returns `true` on town A because town B has one, which is precisely the defect
your law names. **CONFIRMED.**

**The LIVE verdict survives**, because the ledger is per-observer keyed: `maps[String(observerId)]`
(`settlementBeliefs.js:150`; the same indexing at `briefs/composers.js:89`). So the leaf reads
`getSpatialLedger(ws,'beliefMaps')[record.id]` and **`hasBeliefMaps` demotes from the row's reader
to its dormancy pre-gate**. A reader defect, not a fact defect ⇒ **no contradiction of a LIVE
verdict, therefore no BLOCKED finding.** Version 1's row is corrected in place, not deleted.

**A2 arm 4** makes the whole law executable: for each of the eight live rows, **(a)** the
neighbour's world (the fact holds for a *different* settlement only) ⇒ `false`, **(b)** the
finished process (`lifecycleStage: 'resolved'`; `grade: 'hidden'`) ⇒ `false` — each paired with its
**positive control**, because an arm that only asserts `false` passes on a predicate broken to
always-`false`.

## 3 · R10 — added. 18 → 23 → **32** rows

The nine owed, each `grep -c` → **1** at `023eda2ec`:

| path | symbol |
|---|---|
| `src/domain/roads/embassyHazard.js` | `export function atWarWith` |
| `src/domain/worldPulse/tickIndices.js` | `export function atWarWithIdx` |
| `src/domain/display/warStatus.js` | `export function liveSieges` |
| `src/domain/worldPulse/relationshipCompatibility.js` | `export const PRIMARY_RELATIONSHIP_TYPES` |
| `src/domain/worldPulse/relationshipEvolution.js` | `export function edgeKeyBetween` |
| `src/domain/display/settlementBeliefs.js` | `export function hasBeliefMaps` |
| `src/domain/spatial/spatialLedgerAccess.js` | `export function getSpatialLedger` |
| `src/domain/worldPulse/routeNetworkLedger.js` | `export const ROUTE_GRADES` |
| `src/domain/worldPulse/stressorsCore.js` | `export const STRESSOR_LIFECYCLE_STAGES` |

⭐ **Four of them exist only because R9's scoping made the leaf call them** — `edgeKeyBetween`,
`getSpatialLedger`, `ROUTE_GRADES`, `STRESSOR_LIFECYCLE_STAGES`. The two rulings interlock.

⛔ **ONE ROW IS DELIBERATELY NOT ADDED — `forceInField` has no symbol to pin.** Its reader is a
**field**, `worldState.deployments[record.id]`, a keyed lookup. The two exported functions over that
field return *war pairs* (`activeWarPairs`, `composers.js:117`) and *deployment rows*
(`activeDeployments`, `warStatus.js:133`), **not a per-settlement boolean**, so the leaf calls
neither; a row naming one would pin a symbol the deliverable does not reach. Its protection is
A2 arm 4's keyed negative control. **This is the standard applied, not scope declined** — flag it
if you want the row anyway.

⚠ **One ambiguity, recorded not adjudicated:** there are **two** exported `edgeKeyBetween`, and they
are twins — `peaceTermsGraph.js:47` is the original, `relationshipEvolution.js:339` its documented
re-export (*"exported here for reuse"*). The row names the **relationshipEvolution** one because
that module also owns `relationshipStates`; a lane preferring the other door **moves** the row
rather than adding a second.

**The diff-stat, re-run over the NEW full path list read from the manifest itself:**

```
distinct paths: 20
$ git diff --stat d31af2cee 023eda2ec -- <the twenty>
(no output — NOT ONE of the twenty moved)
```

**All 32 rows present VERBATIM at `023eda2ec`** (node scan over the manifest). Base stays
`d31af2cee`; you re-pin at promotion. **CONFIRMED.**

## 4 · R11 — §7 states a delta. Sites changed

**§7's P2.1 row** now reads as a delta; a **new derivation table** follows it, each figure tied to
the walker's own expression (`measureCensus()`, `:601-604`) and to this packet's own rows:

| figure | walker's expression | delta | derivation |
|---|---|---:|---|
| `files` | `TEST_FILES.length` (`:515-518`) | **+1** | the one `CREATE` TEST row; the two `src/domain/edit/**` leaves move it by **zero** |
| `parked` | `filter(parkReasonsFor > 0)` | **+0** | the new file carries no park reason |
| `credited` | the complement | **+1** | unparked ⇒ credited; moves with `files`, never apart |
| `titles` | `reduce(+ liveTitlesIn)` | **+8** | the eight straight-line `it` arms A1–A8 — **this figure IS the acceptance count** |
| `suiteTitles` | `reduce(+ liveSuiteTitlesIn)` | **+1** | the ONE literal `describe` (§P3.4 forbids nesting) |

Plus your line verbatim: *"the absolute tuple is stamped by the chair at promotion from
`tests/lint/.lighting-census-baseline.json`; a hand-composed absolute here is the stale-numeral
class"*, and the verbatim-red **shape** kept as a clearly-marked placeholder example:
`expected ‹B›+1 to be ‹B›`.

⭐ **I went one step further than §7 and report it for your veto:** the header's verified-base note
and **§3's baseline posture** also quoted absolutes, so both now point at §7's rule instead. **Every
absolute tuple is gone from the packet.** The two worked examples (2645/2646) survive only inside
§7's placeholder explanation, labelled as illustrations.

---

# PART II — THE TWO RE-MEASURED BUDGETS

| leaf | v1 | v2 (first pass) | **v2 FINAL** | cap | verdict |
|---|---:|---:|---:|---:|---|
| `operations.js` (**fourteen** rows, R8) | ≈231–249 | ≈231–249 | **≈213–227** | 250 | ✅ ≥23 margin |
| `worldConditions.js` (ten predicates, **scoped**, R9) | ≈60 | ≈73–83 | **≈83–93** | 250 | ✅ ≥157 margin |
| **packet total** | — | ≈304–332 | **≈296–320** | 400 | ✅ ≥80 margin |

**`operations.js`, derived in the open rather than asserted:** 14 rows × 8–9 = **112–126**, plus
**+14** for the `requires: { world, registry }` split at ~+1/row, plus **87** fixed
(`makeOp` 15 · `validateOp` 40 · vocabularies 12 · helpers+freezing 15 · imports 5) ⇒ **≈213–227**.
This reproduces R6's closure figure exactly. At eighteen the same arithmetic gives
144–162 + 18 + 87 = **≈249–267, over the cap** — which is why EM-B1c exists.

**`worldConditions.js` R9 delta, +≈8:** siege `.some(targetId|coalition)` +1 · trade edge-key
resolve +1 · belief per-settlement index +1 · `plotInMotion` subject + stage + its own frozen
live-stage set +3 · `openRoute` r2 endpoint + `grade !== 'hidden'` +2. **The other five rows cost
zero** — their readers are already scoped. Imports go ≈7 → ≈9 (`edgeKeyBetween`, `getSpatialLedger`).

**Still inside 250 on leaf 2 ⇒ PROCEED, no split, no squeeze.** Line figures are **PLAUSIBLE**
(estimates, as version 1's were); caps, file counts and every file:line are **CONFIRMED**.

---

# PART III — carried forward from the first pass (unchanged and still true)

- **The ten predicates:** eight live (one gated for its second reader), two honestly absent. Roster
  stays **ten ids**; `openRoute` is one id with two readers.
- ⛔ **The survey's path `src/domain/simulationRules.js` does not exist** — the file is
  `src/domain/worldPulse/simulationRules.js`; `:976` is right. The flag has **no
  `DEFAULT_SIMULATION_RULES` entry**; its only declaration in `src/` is `false` inside the
  `full_simulation` preset (`:867`).
- **Your reachability question stays answered:** no third argument — the predicate calls
  `routeLifecycleActive(worldState)`; `worldState.js` builds `simulationRules` (`:317`) and
  `stressors` (`:318`) on one object; the store already composes `{worldState, regionalGraph}`
  (`aiSlice.js:123`).
- **Two v1 receipts corrected** (`previousGovernments` 4→**8**; `EntityStatus` 2→**4**; wrong at
  both shas ⇒ wrong receipts, not drift). Both load-bearing facts re-confirmed.
- **v1's two refuted absence citations retained** in §16.1a (`defenseStateProse.js:1498` is a
  prose-slot measurement; `collectPlotHooks` was the wrong symbol).

# PART IV — open items

**None.** R8, R9, R10 and R11 are all closed in §17, each keeping the finding that made it
necessary so a later reader can re-check the measurement rather than trusting the ruling. Three
things are recorded for your veto rather than asked as questions: the `forceInField` no-symbol
decision (§3 above), the `edgeKeyBetween` twin choice (§3), and the extension of R11's delta rule
beyond §7 to the header and §3 (§4).
