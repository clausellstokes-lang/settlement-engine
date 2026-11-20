# TAIL-CLOSE-HEAP-1 — hand-back (2026-11-15)

Seat: CLOSE, branch `lane/tail-close-heap-2026-11-15`, cut from the joined line
`lane/join-2026-11-14` at `2d8a6632a`. Measured against
`origin/lane/tail-close-reach-2026-11-15` at `bfe7bc0e0` and `origin/master` at
`db832c892`. All runs were in scratch clones outside the main checkout, each with its
own `npm ci`. The ambient `NODE_OPTIONS` was `--use-openssl-ca` only, so a "default
heap" run below is Node 22's 2,096 MB limit.

## FOR THE OWNER, in plain words

- **What grew.** One test file, the writer-reach walker
  (`tests/lint/writerReach.walker.test.js`), ran out of memory. The leak was not in the
  game. The instrument held on to a full parse of every source file (about 720 MB) that
  nothing used after the first scan. While it held that, the walker parsed the whole
  tree twice more. Master already did the same thing, and its peak sat at 1,863 MB
  against a 2,096 MB limit, so it had only 233 MB to spare. This round added about
  200 MB, mostly because there are more source files and a bigger observed corpus, and
  that pushed it over at about 2,045 MB.
- **Does anything leak?** No. 300 towns of all six tiers were generated in one process
  with a forced GC every 50 towns. The heap stays flat on the line (37.0 MB at 50 towns,
  39.2 MB at 300, and −0.2 MB over the last 50) and on master (25.2 MB to 27.2 MB). Only
  the instrument retained memory.
- **What was set and why.** No heap limit was raised. `package.json`,
  `package-lock.json` and `vite.config.js` are byte-identical to the joined line. The
  fix is to stop returning the unused parse from the instrument's `measure()`. One
  line changed in `scripts/check-writer-reach.mjs`, with a comment naming this
  measurement. The walker's peak drops from 2,075 MB to 1,356 MB, which leaves about
  740 MB (35 %) under the default heap. The door's report is byte-identical before and
  after.

## (1) WHERE THE MEMORY GOES, AND IS IT NEW?

**In the vitest worker.** Retained heap is `heapUsed` after a forced `gc()` (scratch-only
instrumentation of the walker, `--execArgv=--expose-gc`, 8 GB cap so the unmodified run
survives to be measured):

| point in the walker | master | master, cured | reach tip | reach, cured |
|---|---:|---:|---:|---:|
| after `measure()` (beforeAll) | 1,186 MB | 518 MB | 1,333 MB | 615 MB |
| OSR cross-join scan (its own full parse) | 1,852 MB | 1,189 MB | 1,357–2,064 MB¹ | 1,346 MB |
| mutant pass: second full `buildIndex` | **1,863 MB** | 1,200 MB | **2,075 MB** | 1,356 MB |
| file end | 1,210 MB | 547 MB | 1,375 MB | 656 MB |
| result at the DEFAULT heap | 51/51 pass | 51/51 pass | **OOM**, 2 failed/6 passed/44 never run | **52 run**, 48 pass, 4 fail² |

¹ The reading at this point depends on whether the scan's dead temporaries are still on the
stack when `gc()` runs. The 2,064 MB reading matches the OOM at about 2,045 MB. The
peak is wherever two full parses are alive together.
² These are the same four that fail on the unmodified reach tip under an 8 GB heap
(`corpusMeta`, `shapesDigest`, "the producers ran", "THE CULTURE CLASS"). They come from
the reach branch's corpus drift, not from this seat. They are reported here and not
investigated (out of scope).

**By phase.** These figures are standalone Node, retained after GC. The probe is a copy of
`measure()` with marks at each phase boundary:

| phase | master | reach tip | growth |
|---|---:|---:|---:|
| corpus build, retained | 87 MB | 114 MB | +27 MB (shapes 1,259 → 1,741; origins 8,543 → 15,016; transitions 14,426 → 22,955; JSON 11.1 → 19.0 MB) |
| corpus build, transient garbage before GC | ~370 MB | ~1,100 MB | collected, so it does not count toward the retained peak |
| `buildIndex`, every file's TypeScript AST | 667 MB (2,363 files) | 722 MB (2,525 files) | **+55 MB per parse** |
| edges, closures, scan, judge, both dial corpora | ~24 MB | ~33 MB | +9 MB |

**Answer.** The phase that holds the memory is the parsed index, about 720 MB, and the
walker has two of them alive at its peak. The pattern is not new: master already peaked
at 1,863 MB, 89 % of the default heap. What is new is the round's growth of about
+200 MB at the peak (+55 MB per parse, twice; +27 MB of corpus; the rest is the larger
module graph inside the worker), and that crossed the limit. `scripts/lib/writer-reach-scan.mjs`
and `scripts/lib/legacy-reader-shape-scan.mjs` are byte-identical between master and
the reach tip. The instrument did not change. The tree it measures grew.

## (2) DOES THE GENERATOR RETAIN TOWNS?

No. The probe is `town-retention.mjs` in the seat's probe directory, outside the
repository and under no name vitest collects. It ran `node --expose-gc` with 300 calls to
`generateSettlementPipeline` (thorp, hamlet, village, town, city and metropolis, 50 of
each, mixed culture, terrain and route), with `gc()` and `heapUsed` every 50 towns:

| towns | joined line `2d8a6632a` | master `db832c892` |
|---:|---:|---:|
| 1 | 30.0 MB | 21.0 MB |
| 50 | 37.0 MB | 25.2 MB |
| 100 | 38.0 MB | 25.9 MB |
| 150 | 38.8 MB | 26.3 MB |
| 200 | 39.2 MB | 26.3 MB |
| 250 | 39.4 MB | 26.6 MB |
| 300 | 39.2 MB | 27.2 MB |

Both lines plateau after warm-up (JIT and inline caches). From town 50 to town 300 the
line grows +2.2 MB, about 9 KB per town and falling to zero (−0.2 MB over the last 50).
Master grows +2.0 MB. Nothing climbs by town on the line that does not also climb on
master. The higher base on the line (30 MB against 21 MB) is the larger module graph and
does not grow per town. There was no STOP.

## (3) THE CURE — option (a), in the instrument, outputs byte-identical

- **Edit.** In `scripts/check-writer-reach.mjs`, `measure()` no longer returns `index`.
  The index is still built once, and the scan still receives it. A comment at the return
  names this measurement. No caller reads `measured.index`: the door's own `run`,
  `reportOf`, `liveViewOf` and `baselineOf`, the walker, `wiring-census.mjs` and the other
  importers were each checked. The edit is in the door rather than the scan library
  because the door is the code that held the index. The scan library never retains it.
- **Outputs byte-identical.** At the reach tree, `node scripts/check-writer-reach.mjs
  --report-to=<scratch>` was run before and after. The report JSON is identical
  (487,810 bytes, sha256 `d07f3776abae71f1…` both runs). Stdout is identical except for
  the report filename it echoes. The HOLD line reads: judged 12,661 · LIT 687 · LIT-NAME
  10,567 · DARK 1,407 (reviewable 389).
- **The walker at the default heap.** At the reach tree with this exact file,
  `sh scripts/gate-tail.sh npm run test -- tests/lint/writerReach.walker.test.js` runs all
  **52** tests with no OOM. 48 pass, and the 4 that fail are the same 4 that fail on the
  unmodified tip at 8 GB. The peak is 1,356 MB retained, about 740 MB (35 %) under 2,096 MB.
  At master the peak goes from 1,863 MB to 1,200 MB, and 51/51 still pass.
- **The joined line** with this edit fails at load for the register row the reach branch
  strikes (`situationDesc on economicState`, clause S), unchanged from before the edit.
- **The three fast gates** on this branch's tree: `typecheck:ratchet` exit 0 (167, ceiling
  167), `typecheck:domain:strict` exit 0 (1,113, ceiling 1,113), `lint` exit 0. Each was
  read through `scripts/gate-tail.sh`.
- **Not touched:** `package.json`, `package-lock.json`, `vite.config.js`, the walker, the
  scan library and every register. No test was skipped or split, the measure was not
  narrowed, and no limit was raised. No other `lane/tail-*` or `lane/close-*` branch
  (37 checked, three-dot diff against the joined line) touches `scripts/check-writer-reach.mjs`.
- **One note for the record:** `check-writer-reach.mjs` is one of the `DETECTOR_SOURCES`,
  so `detectorDigestOf` moves with this edit. That digest is only written into the
  baseline by the `--write`, `--genesis` and `--rebank` doors as provenance, and no gate
  compares it against a live value (grep: its only call is `baselineOf`). The next
  shrink-only `--write` will record the new digest.
