# PRF / PRF-1 — the goods-matcher RESTORATION (the sole member of `prf-1`)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `630265b341ab406bb55438b277723154d871597b`
  (the `rn-1` train's terminal, `goodsCatalog.js` blob `fc474eab`)
- **Landed:** `97ece4b7` — chain: base `630265b3` → promotion `e40e211e` (P1) → implementation
  `97ece4b7` (PRF-1) → the terminal. Member battery green at the implementation commit
  (**13 files / 219 tests, exit 0**); the differential identity battery **46,062 checks / 0
  diffs** against a `git archive` of the base; the SAME-SEED GOLDEN SUITE byte-identical at
  **87 files / 623 tests, exit 0**, run after the last edit; both typecheck ratchets at their
  exact floors (**173/173**, **1134/1134**); the anchor walker and scoped eslint exit 0.
  Census re-derived WHOLE at `2438/364/2074/20208/5672` with `files`/`parked`/`credited`
  never moving. Both guards proven to bite by planting the destroying blob `fc474eab` and
  restoring via `cp`/`cmp`: the alias-snapshot arm was the ONLY one of seven to red, and
  `validate:packets` exited 1 naming both new required symbols.
- **Train:** `prf-1`, family **PRF** (un-stamped per §96.4's enumeration, cap 4), member
  **1 of 1**. One member carries the primary behavior, its necessary integration path, and
  its prevention guard — the dispatch unit PACKET_STANDARD expressly allows. Splitting
  would reserve the same change paths across two non-terminal packets, which the compile's
  executed status-sequence simulation shows reds the validator until one reaches a terminal
  status.
- **Preamble:** ⚠ **none, deliberately.** PRF is its own family and has no preamble.
  `INFRA-PREAMBLE.md` is NOT cited: its declared volume is the build-machinery family
  (gate tooling, packet machinery, the capsule, build artifacts) and it states that an
  INFRA member "may write nothing under `src/` at all". This member's primary subject is
  `src/domain/region/goodsCatalog.js`, so citing it would be a false authority citation.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§84.2** (the goods-matcher cure is the
  review program's single highest-leverage repair, behavior-neutral by construction, a
  SOAK PREREQUISITE queued immediately after `rn-1`; proof shape = the identity pin over a
  generation+simulation corpus plus the pre-feature golden; **an ordinary repair, NOT a
  declared shift**) · **§104.4** (the bundle-closure law: a member editing any file inside
  an edge-shared bundle closure OWES the bundle regeneration) · **§105** (the compile
  accepted; prf-1 is a RESTORATION and the vacuous pin is replaced by the discriminating
  alias-snapshot guard — no new file, no new export; J-TC19-1..10 signed) · **§107.1**
  (R1 holds — prf-1's blocker discharged, TE19 dispatched).
- **Compile of record:** `laneTC19-PRF1-PLAN.md` (the annex the premise map names).

---

## §1 · ⭐⭐ THE HEADLINE IS HISTORY, NOT CODE

**The cure §84.2 ruled already existed in this repository. It landed 2026-07-02, survived
to 07-05, and was destroyed on 2026-07-15 by a master-merge resolution that took the
memo-less parent.** The transition walk is blob-exact:

| commit | date | `goodsCatalog.js` blob | `FUZZY_MEMO` lines | subject |
|---|---|---|---:|---|
| `7b7d4320` | 2026-07-02 | `5e6d8367` | **7** | the memo's origin |
| `d024286e` | 2026-07-05 | `1c65cba0` | **7** | Merge PR #47 |
| **`0168e287`** | **2026-07-15** | **`750a59c8`** | **0** | **MASTER MERGE W1 — 568 conflicts resolved** |
| `630265b3` | 2026-08-15 | `fc474eab` | **0** | this member's base |

⛔ **`tests/domain/goodsCatalogMemo.test.js` survived that merge byte-identically, and its
header described a cache the module no longer had for six weeks.** The reason nothing
reported the loss is measured, not guessed: **all five of its assertions PASS against the
un-memoized base** (5/5, executed against a `git archive` of `630265b3`). They are
equivalence pins — correct as neutrality pins, and structurally incapable of detecting the
deletion they were written beside. That is the vacuous-pin class, and it is why a ~5x
per-tick regression lived unreported.

## §2 · THE BEHAVIOR

`fuzzyMatch` gains two caches and nothing else changes:

- **`FUZZY_CANDIDATES`** — the catalog's 219 candidate strings tokenized ONCE at module
  init, in the same nested order the scan used, skipping empty-token candidates exactly
  where the scan's `continue` did, so first-strictly-better tie-breaking is unchanged.
- **`FUZZY_MEMO`** — result per `comparable(label)` key, misses included, bounded at 512.

`comparable()` is the ONLY input the match reads (`tokensOf` is `comparable` + split +
filter), so equal keys have equal results BY CONSTRUCTION — that is what makes the key
sound rather than a guess. **No export is added, removed, or re-signed; the public API
surface is byte-identical.**

⭐ The memo sits at the `fuzzyMatch` layer, never at `normalizeGood`'s returned object,
which must stay fresh per call — the landed pin already asserts `expect(b).not.toBe(a)`.

## §3 · ⭐⭐ NEUTRALITY — PROVED AT THIS COMMIT, NOT INHERITED

```
node laneTE19-identity.mjs   →   TRUE_EXIT=0
  base  = git archive of 630265b3 (blob fc474eab, verified un-instrumented)
  cured = the LIVE worktree module
  2,710 inputs x 3 orders (forward / reverse / re-sorted, so memo-eviction state
  differs per pass) over normalizeGood, normalizeGoodsList, summarizeGoods,
  exactGoodId, goodText, slugifyGood, goodCriticality, subsumeTradeGoods (plain +
  opaque), reconcileTradeLists, goodsIntersect
  checks 46,062   diffs 0   verdict IDENTICAL
```

Exceptions are compared too — each call is wrapped and a thrown message is part of the
compared value — so a divergence in failure behavior would also convict.

**The same-seed goldens are unmoved**: 87 files / 623 tests, exit 0, run after the last
edit so the green binds to the committed tree. Motion there would have been a STOP, not a
fork, because §84.2 ruled this an ordinary repair and motion would refute the ruling's own
premise. Generation contributes **zero** `normalizeGood` calls — the generation path
resolves goods through `exactCatalogEntry`/`ALIAS_INDEX` only — so no generation golden can
move by any path.

## §4 · ⭐⭐ THE GUARD — WHAT WAS ACTUALLY MISSING

The five landed titles stay byte-identical and stay equivalence pins. The member's real
deliverable is **the alias-snapshot arm**: it pushes an alias onto a catalog entry at
runtime, then resolves a label the memo has **never seen**, and asserts the resolution does
not move. A re-tokenizing matcher reads the mutation; a matcher holding a module-init
snapshot does not.

⭐⭐ **IT IS EXECUTED-PROVEN TO BITE, NOT ARGUED.** The destroying blob `fc474eab` was
planted over the cured file and restored via `cp`/`cmp` (restore verified byte-identical by
`cmp` exit 0 and hash equality):

```
planted fc474eab →  Tests  1 failed | 6 passed (7)
                 →  × a runtime alias push does not move a memo-cold resolution
```

**One arm of seven reddened, and it was the new one.** That single run is simultaneously
the proof the guard works and the proof the other six could not have caught the merge.

⚠ **The probe label must stay memo-COLD.** Resolving it before the push lets `FUZZY_MEMO`
answer from cache and the arm would pass with `FUZZY_CANDIDATES` deleted — the vacuity this
arm exists to avoid. It is documented in the test beside the code that depends on it.

⚠ **`FUZZY_MEMO` itself is behaviorally undetectable, and that is the neutrality guarantee
rather than a gap** — it returns the same reference the un-memoized path returns. Its only
honest guard is a COST guard (`tickOpBudget` / `worldTickCostEnvelope`), recorded as
**deliberately deferred — documented, not a bug to re-find**: re-measure and tighten those
budgets once prf-1's new tick cost is known. `FUZZY_CANDIDATES` carries ~99% of the win and
the adopted arm guards it.

⭐ **A SECOND, INDEPENDENT GUARD RIDES `requiredSymbols`.** `const FUZZY_CANDIDATES` and
`const FUZZY_MEMO` are named below, and the packet validator resolves required symbols
against the LIVE tree at every status. A future merge that deletes either symbol reds
`validate:packets` — which sits inside `npm run check` — without depending on any test
being run. The class that destroyed this cure once now has two independent detectors at
different layers.

## §5 · THE TIMING RECEIPT — MEASURED AT THIS COMMIT

2,000 calls per class after 200 warmups, base and cured in one process, µs per call:

| class | base | cured | speedup |
|---|---:|---:|---:|
| exact alias hit | 1.176 µs | 1.002 µs | 1.2x |
| fuzzy hit | **125.429 µs** | **1.216 µs** | **103.2x** |
| fuzzy MISS → `custom.<slug>` | **124.804 µs** | **1.593 µs** | **78.3x** |

Tick-shaped mixed workload — 3,000 calls over 99 distinct labels, 30% exact / 50%
fuzzy-hit / 20% miss:

| | base | cured | speedup |
|---|---:|---:|---:|
| 3,000 `normalizeGood` calls | **263.68 ms** | **3.82 ms** | **69.0x** |

One-time cost: module import 1.01 ms → 1.49 ms, paid once per process.

⭐ **THE WHOLE-TICK CLAIM IS STATED AS A BAND, NEVER A POINT.** From the measured 69.0x
component speedup and the audit's measured 70–83% share of tick CPU, by Amdahl
`1 / ((1−s) + s/69.0)`:

| share `s` | whole-tick speedup |
|---|---:|
| 0.70 | **3.2x** |
| 0.80 | **4.7x** |
| 0.83 | **5.5x** |

**§84.2's "~5x" is confirmed at the top of the measured share band and 4.7x at its
midpoint.** The component cure is not the limiting factor — Amdahl is. Claiming more than
5.5x would over-claim. ⚠ The 70–83% share is the one INHERITED input here; this member
re-measured the component, not the share.

## §6 · THE MEMORY BOUND — MEASURED, AND IT SATURATES

Harvested at this base by instrumenting `normalizeGood` in an integrity-counted archive
(6,443 paths in, 6,443 out) and driving the soak fixture at n=30 × 3 weekly ticks:

- calls/tick **29,656 / 29,029 / 28,994** — the audit's "~3,000 calls per tick" estimate was
  conservative by an order of magnitude, which strengthens rather than weakens its finding.
- distinct fuzzy-path keys **323 / 323 / 323** per tick, cumulative **323 / 323 / 323**:
  **every key the run will ever use appears in tick 1.** The vocabulary saturates; it does
  not grow with time.
- key residency ≈ **26,284 bytes**; `exceedsCap: false`.

**`FUZZY_MEMO_MAX = 512` is therefore never reached at realm scale.** The bounded `clear()`
exists solely for adversarial user-authored custom labels, where it converts unbounded
growth into a re-warm of at most 512 entries. It stays at 512 because the landed pin's
fourth title names the number in its own text.

## §7 · THE PRE-FEATURE FIXTURE, AND THE TRAP IN IT

⛔ `tests/fixtures/goods-matcher-identity-corpus.json` was generated by the **ARCHIVED BASE
MODULE**, before the cure was applied — a fixture generated from the code under test is the
recorded fixture-mirrors-the-deriver dead-arm class and would make the pin a tautology. It
records its own provenance (`base`, `sourceBlob: fc474eab`) and regenerating it from the
cured tree is a named STOP.

Composition: 219 static catalog strings + 730 perturbations + 25 fuzzy prose + 92 misses +
21 degenerate/object-shaped inputs + **the 323 REAL fuzzy-path keys measured off the live
engine**, deduped to **1,236 distinct inputs**, plus a **169-row deep slice**.

⚠ **Two-tier encoding, not the literal `{ corpus, expected }` the compile sketched.** The
literal shape measures 788 KB; the largest fixture in `tests/fixtures/` is 139 KB, so it
would be 5.6x the estate's demonstrated ceiling. Tier 1 pins the matcher's DECISION (the
resolved id) over every input — the only thing a result cache can change. Tier 2 pins the
FULL returned object over the deep slice, so result shape is pinned too. Both tiers are
computed by the base module. Delivered at **100 KB**.

⚠ **Tier 2 excludes `aliases` on both sides, and the reason is load-bearing:**
`normalizeGood` spreads the catalog entry, so the returned `aliases` is the catalog's own
array BY REFERENCE — and the landed tamper pin pushes `'tampered-alias'` onto it and never
pops. Pinning that reference would make the golden depend on a sibling test's deliberate
mutation while adding nothing, since WHICH entry was selected is pinned exactly by tier 1.
This was found by executing the pin, not by reading it.

## §8 · SIZE, CENSUS, AND THE BUNDLE OBLIGATION

**Effective lines** (eslint's own `Linter`, `max-lines` with `skipBlankLines` +
`skipComments`, never `wc -l`): **421 → 435, delta +14**, under the layer's 800 ceiling with
365 of headroom. `goodsCatalog.js` has no `.size-baseline.json` row and is not a hot file,
but it IS shared (29 importing `src/` modules), so the 15-effective-line shared-file cap
binds. **+14 leaves exactly ONE line of room** — a named STOP condition, measured rather
than estimated.

**The lighting census** re-derived WHOLE: `2438/364/2074/20206/5672` →
**`2438/364/2074/20208/5672`**. `files`, `parked` and `credited` do NOT move — the member
creates zero new test files, both arms joining an already-credited file. Only the evidence
layer moves: **+2 titles, +0 suite titles** (both arms join the existing `describe`). The
arms are sequenced and stop at the first red figure, so the first run reached `titles` only;
`suiteTitles` was proved by re-running with the whole tuple re-recorded, never by assuming
an unreached assertion held. **The figures were read from the walker's own output, never
predicted.**

**§104.4's bundle obligation is INCURRED and discharged.** `goodsCatalog.js` sits inside two
edge-shared bundle closures (`aiCharterBundle` 110 inputs, `aiOutputSchemaBundle` 111), both
gated by freshness tests on a recorded `sourceHash`. `npm run build:edge-shared` was run and
its output committed; zero artifacts were hand-edited. Three further metas move on
`generatedAt` alone — the recorded timestamp-churn class.

⭐ **A MEASURED CONSEQUENCE THE COMPILE DID NOT PRICE:** at base the bundler tree-shook
`TOKEN_STOPWORDS` and `tokensOf` OUT of both bundles, because `fuzzyMatch` was unreachable
from their entry points. `FUZZY_CANDIDATES` is an eagerly-invoked module-level IIFE that the
bundler cannot prove side-effect-free, so those two symbols are now retained: **+688 bytes
per bundle, on two bundles.** `fuzzyMatch` itself remains shaken out. There is no size row
or budget on these artifacts, so nothing reds — but the cost is real, it is the direct
consequence of the eager-over-lazy judgment, and it is recorded here rather than discovered
later.

## §9 · CHANGE MANIFEST

| # | action | path |
|---|---|---|
| 1 | MODIFY | `src/domain/region/goodsCatalog.js` |
| 2 | TEST | `tests/domain/goodsCatalogMemo.test.js` |
| 3 | CREATE | `tests/fixtures/goods-matcher-identity-corpus.json` |
| 4 | TEST | `tests/lint/sovereigntyLightingContract.walker.test.js` |
| 5–11 | MODIFY | the seven regenerated `supabase/functions/_shared/*Bundle` artifacts |

Handwritten files: **4** (budget 12). Changed effective production lines: **14** (budget
400). Existing logic-bearing production files modified: **1** (budget 3). New production
leaves: **0**. Flags: **0**. Persisted record families: **0**. Acceptance cases: **8**
(cap 8). `retiredSymbols`: **NONE** — no export is removed or renamed.

## §10 · STOP CONDITIONS

1. Any same-seed golden moves — §84.2 ruled this an ordinary repair; motion refutes it.
2. The cure needs a 15th effective line in `goodsCatalog.js`.
3. Any export of `goodsCatalog.js` would be added, removed, or re-signed.
4. `files`, `parked`, or `credited` moves in the lighting census.
5. The identity fixture is regenerated from the cured tree at any point.
6. Any consumer is found mutating a returned catalog entry.

**None was met.** The reference-identity census that underwrites condition 6 measured
**zero** production consumers mutating a returned catalog entry or its `aliases` across 41
call sites in 29 importing `src/` files; the single write in the corpus is the landed pin's
own tamper probe.
