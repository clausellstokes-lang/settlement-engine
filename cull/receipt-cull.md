# RECEIPT — lane CULL (TUNEREG Car 5, "THE CULL") — **COMPLETE**

STATUS: COMPLETE. 2026-09-04. Seat: Opus 5. MEASUREMENT ONLY — no edit/stage/commit; no vitest/npm run.
READ SOURCE: .../58f0a8e2-.../scratchpad/laneKERNELMARK-tree
DOCK HEAD (CONFIRMED): 1223489c9

## Progress
- [x] scratch dir; dock HEAD confirmed
- [x] TUNEREG register + inventory LOCATED
- [x] engine semantics read; J-6 correction found written INTO the engine
- [x] re-measured at HEAD; drift vs frozen inventory = ZERO
- [x] 140-candidate set extracted
- [x] full-corpus sweep (5,854 files, single indexed pass)
- [x] dead-set.md / cull-plan.md written

## THE TWO FILES (CONFIRMED)
- `tests/lint/.tuning-register.json` — DECLARED, hand-authored ("THE PEN'S FILE"), 63,803 B.
- `tests/lint/.tuning-inventory.json` — MEASURED, machine-written, 278,205 B.
  `measuredAtSha: 250d4e46407826778c3dc38331fa3aed9cc63a9b`, `measuredBy: "Opus 5 — chair, §891 train"`, date 2026-09-03.
- Engine: `scripts/lib/tuning-inventory.mjs` (1,254 lines). Walker: `tests/lint/tuningRegister.walker.test.js` (1,503 lines).

## FINDING 1 — THE CLAIM DID **NOT** DECAY (CONFIRMED)
The inventory was frozen at `250d4e46`, which is an ancestor of HEAD with **11 commits** since
(`git merge-base --is-ancestor` exit 0). Rather than trust it, I re-ran the engine's own
`measureTree(root, register)` at HEAD and diffed every table.

Re-measured totals at HEAD `1223489c9`:
    { tables: 225, keys: 2099, unregisteredNamed: 535, bareDecimals: 6985,
      zeroDependentTables: 9, zeroNamedDependentTables: 140 }
Frozen `totals` block: **identical**. Per-table diff over `spanDigest`, `line`, `keys`,
`dependents`, `namedDependents` for all 225 ids: `only-in-remeasure: 0`, `only-in-frozen: 0`,
`TOTAL DRIFTED FIELDS: 0`. The 11 intervening commits touched only `OutputContainer.jsx` and
`EconomicsTab.jsx` under `src/`, neither a tuning home.
**CONFIRMED — the inventory is byte-faithful to HEAD; re-derivation was still the right act, and it is now receipted rather than assumed.**

## FINDING 2 — "113" IS A STALE FIGURE FROM A SMALLER DENOMINATOR (CONFIRMED)
The 113 lives in a **docblock**, not a register column — `scripts/lib/tuning-inventory.mjs:545`:
> "The estate carries 113 of 206 `_TUNING` tables with no consumer at all."
That denominator (206) is the `_TUNING` **glob** alone. The register now also enrols a
**roster** half (`homes[]`) for unsuffixed exports the glob cannot see — the density ladder,
`HALF_LIFE_WEEKS`, `INTERVAL_WEEKS`, `CAUSAL_SWING`, the faith surface. Denominator today is
**225**, and the measured zero-consumer count is **140**, not 113.
**The brief's "roughly 113" is superseded. The correct candidate count is 140.**

## FINDING 3 — THE J-6 CORRECTION IS ALREADY LAW IN THE ENGINE (CONFIRMED)
`scripts/lib/tuning-inventory.mjs:629-637` states the per-export rule verbatim:
> "⚠ THIS COLUMN AND `dependents` ANSWER DIFFERENT QUESTIONS, AND THE DIFFERENCE IS LARGE.
> `dependents` is the charter's letter — importers whose specifier resolves to the home FILE —
> and at C′ it leaves only 8 of 210 tables at zero, because a file holding six tables lends its
> one importer to all six. `namedDependents` is per EXPORT, and it is the column a cull must
> read: deleting a table because its FILE is imported somewhere would delete a live dial…"

Measured at HEAD: `dependents`-zero = **9**; `namedDependents`-zero = **140**. Of the 140,
**131** live in files that ARE imported but whose export is never named — the exact J-6 case.
**Denominator for this census is EXPORTS (225), never files.**

## FINDING 4 — THE MEASURED COLUMN SCANS `src/` ONLY; IT IS AN UPPER BOUND (CONFIRMED)
`measureTree` calls `resolveDependents(root, TREES_P1 …)` with `TREES_P1 = ["src"]`, and
`isSourcePath` excludes `*.test.js|jsx`. The engine says so at :551:
> "⚠ A TABLE READ BY A TEST ONLY IS NOT DEAD — the test is its consumer. This scans `src/` for
> the register's purposes and the caller is told which tree it measured."
So `tests/`, `docs/` (annexes), `scripts/`, and `api/` are **outside the denominator**.
**The 140 is therefore an UPPER BOUND on deadness, not the dead-set.** The remaining work is
subtraction: every candidate with a test, walker, doc, script or api consumer is NOT dead.
This is why the brief's "a table cited only by a walker is NOT dead" bites hard here.

---

# THE CENSUS — COMPLETE

## METHOD (and the denominator)
**Denominator: 225 EXPORTS**, not files — the J-6 correction, which this estate has already
written into its own engine (Finding 3). Ids are `<file>#<EXPORT>`; the engine refuses bare
names because `REACTION_TUNING` ×3, `LADDER_TUNING` ×2 and `DISPATCH_TUNING` ×2 collide.

Four passes, each executed:
1. **Re-derive, don't trust.** Ran the estate's own `measureTree(root, register)` at HEAD and
   diffed all 225 rows against the frozen inventory. Zero drift (Finding 1).
2. **Take the right column.** Candidate set = `namedDependents.length === 0` → **140**.
   (`dependents`, the file-level column, gives 9 and is the wrong question.)
3. **Search past `src/`.** Built a single identifier index over **5,854 files** (all of
   `src/ tests/ docs/ scripts/ api/`, node_modules excluded), then bucketed every hit per
   symbol. The tokenizer runs over raw text, so **quoted string spellings are included**.
   The two register JSONs were excluded from "consumers" — they are the ledger, not a reader.
4. **Test internal use.** For each candidate, comment-stripped its home file and counted uses
   excluding the declaration — this is what separates "nobody imports it" from "nobody uses it".

Gap-closing checks, both executed and both negative: **no dynamically assembled names**
(`grep -E "['\`+ ]_TUNING|\$\{…\}_TUNING"` returns only prose about the glob) and **no
namespace imports** (`import * as`) anywhere in the candidate directories.

## THE RESULT — CONFIRMED
| Verdict | Count |
|---|---|
| LIVE — used inside its own module | **130** |
| LIVE — named-imported by tests/scripts, or cited in docs | **6** |
| DEAD binding, but a register window — **HOLD** | **4** |
| CANNOT PROVE DEAD | **0** |
| **Provably dead AND safe to delete** | **0** |

**The premise does not survive measurement.** Not one of the ~113 intended deletions is a safe
deletion. `namedDependents === 0` means "no other module names this export in an import
clause" — never "no consumer".

### Confidence per group
- **The 130 (module-internal): CONFIRMED, high.** Mechanical and individually checkable;
  deleting any is a `ReferenceError` in the same file. I hand-verified 18 (all 18 of the
  no-foreign-consumer set) plus a deterministic every-13th spread of 10 more, e.g.
  `generosityEV.js:917  const T = INTEL_SALE_TUNING;` and
  `brokerageFidelity.js:111  … BROKERAGE_FIDELITY_TUNING.DISTANCE_PRICE * delay`. Both
  `internalUses === 1` samples I chased were real code, so the comment-stripper is not
  inflating the count.
- **The 6 (foreign consumer): CONFIRMED, high.** Each is a real named import, quoted in
  `dead-set.md`, e.g. `tests/domain/statefulArmies.test.js:9 ATTRITION_TUNING`,
  `tests/domain/feasibilityGate.test.js:9 FEASIBILITY_TUNING`.
- **The 4 facades: CONFIRMED that the binding is unreferenced; CONFIRMED that every member
  constant is live.** The judgment that they must be HELD rather than culled is mine — see
  the retrovalidation row.
- **Name collisions (4 symbols): handled, not hidden.** Bare-name matching over-counts
  consumers, which is the SAFE direction. The one case where it mattered —
  `mobilizationReactions.js#REACTION_TUNING`, whose foreign hits all belong to the
  *other* `REACTION_TUNING` — I chased to ground and reclassified into the facade group
  rather than letting the collision flatter it into LIVE. **CONFIRMED**: no importer names
  `REACTION_TUNING` from `mobilizationReactions.js`.

## THE TRAP IN EXECUTING THE CULL (CONFIRMED)
`countUnregisteredNamed` (`scripts/lib/tuning-inventory.mjs:758-762`) **subtracts aggregator
leaf names** — *"a const that a table references by name is that table's value written once,
not a second unregistered dial."* So deleting a facade **promotes its members into
`unregisteredNamed`**. Predicted growth, computed against the P2 regex without running any
instrument: **+20** (reinforcement +14, settlementStrategy +3, mobilizationReactions +2,
warIntent +1). `refreezeRefusals` guards exactly that population, so the refreeze would return
**`POPULATION_GREW`** on all four files. The cull is self-defeating by construction: the estate
would demand four `DECLARED_GROWTH` rows to launder the removal of four register windows.

## ONE ROW THE CULL WOULD HAVE DESTROYED
`src/domain/worldPulse/envoyChanceMeeting.js#CHANCE_MEETING_TUNING` is in the 140 and is one of
the 9 with zero file-level dependents — the most "obviously dead"-looking row in the set. Its
sibling `CHANCE_MEETING_TUNING_PROVENANCE:173` reads:
> `status: 'CANDIDATE, OWNER-UNSIGNED (§12 row 7; enrolled in TUNEREG at its landing)'`
This is the owner's **ENCOUNTERS program** (directive 2026-09-02), in flight and awaiting a
signature. It is not dead; it is **unlanded**. 23 `_PROVENANCE` exports and 21 files carrying
`OWNER-UNSIGNED` markers exist in `src/` — a whole class a file-shaped or import-shaped cull
would have read as garbage.

## WHAT I DID NOT DO
No file edited, staged, or committed. No vitest / `npm run check` / build / refreeze executed —
the running gate's lock was never contended. Every figure above came from reading the tree and
from `measureTree`, which is pure computation (no git, no writes). Deliverables are confined to
this scratch directory. Deferred deliberately, documented not dropped: **I did not run the
walker to confirm my predicted figures** — that is the next car's act at a clean tip, and the
predictions in `cull-plan.md` §4 are written down precisely so they can be scored.

---

# RETROVALIDATION ROW

**What I judged (mine, vetoable):**
1. That the correct denominator is 225 exports and the correct column is `namedDependents` —
   this follows the estate's own recorded J-6 law; low discretion.
2. **That "zero named importers" is not "dead", and therefore the cull should be retired
   entirely rather than executed on a reduced list.** This is the load-bearing judgment.
3. That the 4 aggregator facades — the only bindings that literally have zero consumers —
   should be **HELD, not culled**, because deleting them removes 21 dials from the owner's
   signable surface while deleting no value. This is a judgment about program *intent*, and
   it is the one a reviewer is most entitled to overturn.
4. That the fix is the two register repairs (`cull-plan.md` §3), of which **R1 is owner-gated**
   (register schema shape) and R2 is a docblock repair a lane may take.

**What a reviewer should re-derive first (highest value first):**
- **The 4-facade HOLD.** Re-read `reinforcement.js:217`, `settlementStrategy.js:1287`,
  `warIntent.js:420`, `mobilizationReactions.js:349` and decide whether a register window with
  no runtime consumer earns its place. If the answer is "no", the cull is 4 exports and +20
  unregisteredNamed, not 113 — and it needs four `DECLARED_GROWTH` rows.
- **The +20 growth prediction**, by refreezing at a clean tip after a trial deletion in a
  scratch worktree. I did not run it.
- **The 130 internal-use verdicts**, by spot-check: my comment-stripper is a regex, not a
  parser. It could in principle miscount a symbol appearing only inside a template literal or
  a nested block comment. I found no such case in 28 hand-checks, but I did not prove absence.
- **The 6 foreign-consumer verdicts** — cheapest of all; each is a quoted import line.

**Receipts by path:**
- `…/scratchpad/cull/dead-set.md` — 140 rows, one per export, with verdicts.
- `…/scratchpad/cull/cull-plan.md` — the do-not-cull plan + predicted figures.
- `…/scratchpad/cull/remeasured-HEAD.json` — my independent measurement at `1223489c9`.
- `…/scratchpad/cull/candidates-140.json`, `symbol-index.json`, `classified.json`,
  `internal-use.json` — the intermediate evidence, re-runnable.
- Estate sources: `scripts/lib/tuning-inventory.mjs:545` (the stale 113),
  `:551` (test-consumer rule), `:629-637` (J-6), `:717-724` (aggregator idiom),
  `:758-762` (the growth trap); `tests/lint/tuningRegister.walker.test.js:395-415`
  (inventory is EXACT both ways).

**Priority:** **HIGH — this is a stop-work finding, not a docket row.** TUNEREG Car 5 as
chartered would delete ~113 live exports, of which at least 130 candidates are used by their
own modules; the deletion would fail the build outright, and the subset that *would* compile
(the 4 facades) removes dials from the owner's signable surface on the eve of a signing wave.
The single biggest risk is **not** an over-cull slipping through review — it is that the "113
dead tables" figure is still sitting in a docblock at `tuning-inventory.mjs:545`, phrased as
*"no consumer at all"*, where the next car will read it and re-derive this same wrong plan.
**Fix the sentence, or the car comes back.**
