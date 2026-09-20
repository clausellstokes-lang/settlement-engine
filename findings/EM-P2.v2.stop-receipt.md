# EM-P2 — §12 COMPLETION RECEIPT (Opus build lane, session 7d3418f8, 2026-09-19 14:5x EDT)

**OUTCOME: STOP, UNCOMMITTED, ZERO EDITS.** The packet's §0 premise (b) — its measured reason
for the sibling's idiom set — is REFUTED BY EXECUTION at the sealed base. Full finding set and
the smallest measured contradiction: `EM-P2.STOP.md` beside this file.

Every line below is CONFIRMED (executed at `f31ca0eb8`) unless labelled otherwise.

---

- **Base SHA:** verified base `00fab686d31dd7bfaeb8363caa49921fb70c63e8`; branch
  `fixes-2026-09-18-consist`; HEAD `f31ca0eb8b4777f2fa7f521bd85a05bcc7272d3e`, unmoved from
  dispatch to now. CONFIRMED (`git rev-parse HEAD`).

- **Dispatch bundle and seal identity:** CONFIRMED — `npm run implementation:dispatch -- EM-P2`
  emitted the capsule and wrote
  `.git/worktrees/lane-em-b3b/implementation-sessions/EM-P2/seal.json`:
  - `capsuleDigest` `d203953bda1c4d98a071d7e5cf6df0977a1f69d0f24fd97db742452fd72be426`
  - `dispatchDigest` `94553868fae8911bb69f6a334c3634120ef56c70633c840d3f1939075bc9830e`
  - `integrityDigest` `57df0aaef2107de252dc5932749781b98cce3fc87d418986e8ebbcc062b1ea31`
  - authority: manifest `6e74c90f…`, packet `cd1c769e…`, index `a7f1ec5a…`
  - targetStates: both CREATE targets `exists: false`; `tests/lint/entropyRootCensus.walker.test.js`
    `79c8b80764227f658673d7e1cfdf3c10fb2dbfab5c6afe81a4bae2cf35676d9b`;
    `scripts/mutation-coverage-manifest.json` `f4ea313b8cbfba47e2ba97fed76f573397a90d81f51da0e1603a61e23037fd85`
  - `initialSnapshot.fingerprint` `6472f3e8ef874fb3eb84e694de0b3f977936c45d8ed31cf02a3bafd1c0cc354c`,
    `dirtyEntries: []`, `foreignEntries: []`
  ⚠ **Honest caveat on the exit status.** The FIRST dispatch's stdout was read through `| tail`,
  so its exit was not captured in-shell; the seal above is the executed evidence. A second,
  properly-captured invocation returned `DISPATCH_EXIT=1` with
  `[implementation-session] implementation session already exists: EM-P2` — the script's own
  idempotence guard, not a mismatch. No session was cleared (a chair act).

- **Preflight, all clear** (the §4 / §11 conditions that could have stopped it and did not):
  `chooseOrPin` present at `src/generators/steps/generatePopulation.js:41`; **exactly one**
  `registerStep(` in that file, at `:226`; preamble SHA-256
  `95e9a5f4aee51bb5aaa434883a708c5f2a4c71d2a49aa4ec99f9076a98c2afaa` — identical to the packet
  header's citation.

- **Final commit or working-tree state:** **CLEAN, nothing written.** `git status --short` = 0
  lines, before and after. No commit. No staging. No `src/generators` edit. Neither existing
  instrument (`habitForkRegistry.js`, `chooserTotality.walker.test.js`) opened for write.

- **Exact changed files and effective-line deltas:** **NONE.**

- **Acceptance cases A1–A6 executed and passed:** **NONE — not reached.** The stop precedes
  §8 step 2 (the first edit). A1/A2/A4 are three of the arms the findings refute.

- **Focused commands, exits, and counts:** none of §10 run — there is nothing to verify, and
  every finding is a static measurement or a plain `node` execution of the shipped generator,
  neither of which needs the test slot. Commands actually executed:
  - `node measure-scan.mjs` → `FILES_UNDER_src/generators = 114`, `SKIPPED_AS_DECLARERS =
    ["src/generators/helpers.js"]`, `RAW_MATCH_COUNTS = {"FORK":13,"PICK":13,"PRNG_MINT":5}`,
    **`SCANNED_SET_SIZE = 16`**
  - `node measure-record.mjs` → one settlement generated at seed `EM-P2-measure`; path table quoted below
  - `node measure-census.mjs` → the census figures re-derived; quoted below
  - `git grep` inventories quoted in the STOP
  - ⚠ The base lint battery
    (`GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 … entropyRootCensus + chooserTotality +
    mutationCoverageManifest`) was launched, **waited ~14 minutes at 0 bytes**, and was
    **CANCELLED** when the STOP made it moot. The exclusive lock
    `/tmp/settlementforge-vitest-gate.501.lock` is held by **pid 47470 since 14:39** — the
    chair's terminal — exactly as the brief predicted. The waiter never entered the shared pool
    (`…lock.shared` absent), so **no stale lock or pool entry was left**. The mutex was never
    polled by hand, shortened, or bypassed.

- **Sealed per-step receipt and exact-state resume status:** `npm run check:packet -- EM-P2` and
  `npm run implementation:resume -- EM-P2` **NOT RUN**. §10 places both after the edits; with
  zero edits `check:packet` would only red on a CREATE target that does not exist, and would
  write a receipt asserting steps ran. The seal is live and unconsumed.

- **Both typecheck configurations:** not run — no code was written. (`typecheck:ratchet` /
  `typecheck:domain:strict` have no subject.)

- **Wave-end gate stages actually executed:** NONE. A lane never runs `npm run check`.

- **Base-versus-wave failure identity diff:** **N/A — there is no wave.** The base-green battery
  is the one claim I could not execute (slot held by the chair's terminal); it is not
  load-bearing for any finding. What I *did* re-derive independently is stronger for this
  purpose: every entropy-census figure reproduces exactly (below), so the census is green at
  base by its own arithmetic. PLAUSIBLE (not executed): the other two walkers are green at base.

- **Dormancy/golden result — both fixtures' SHA-256 before and after:** **UNMOVED, byte-identical.**
  ```
  before (at dispatch)                                              after (now)
  7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  … same   tests/fixtures/generator-golden-master.json
  921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  … same   tests/fixtures/dossier-prose-manifest-golden.json
  ```
  Both match the chair's reading in the re-dispatch brief. `UPDATE_GOLDEN` / `GOLDEN_SHIFT_SIGNED`
  were never set. No generator was executed through a golden path (the shape probe calls
  `generateSettlementPipeline` directly and writes nothing).

- **The entropy census's figures before and after, each re-measured by execution:**
  **UNCHANGED — and every one reproduces exactly**, re-derived by running the census's *own*
  detectors over the live tree (`measure-census.mjs`, no test slot needed):
  | figure | census pins | re-measured | |
  |---|---:|---:|---|
  | `READ_SITES` length | 23 | 23 | roster read from the file |
  | distinct `READ_SITES` ids | 23 | 23 | roster read from the file |
  | measured read expressions | 22 | **22** | executed |
  | `rngSeed` LINES / FILES in `src` | 73 / 31 | **73 / 31** | executed |
  | `createPRNG(` in `src/domain` | 35 | **35** | executed |
  | `createPRNG(` whole-`src` | 46 | **46** | executed |
  | hash-helper definitions | 31 | **31** | executed |
  | write-key sites | 4 | **4**, exactly the rostered set incl. `NC-1` | executed |

  `NC-1`'s two anchors both present in `src/generators/power/economyReconciliation.js`
  (`rngSeed: stepRng.fork(POWER_STREAM).seed,` and `createPRNG(intent.rngSeed)`). `ALL_FILES` =
  **2244**. ⇒ **the census is NOT the reason this packet stopped**, and no re-record was owed.

- **Row count of the new registry, and the scanned-set size it equals:** registry **NOT
  AUTHORED**. Scanned set **MEASURED = 16** `module#symbol` keys across 114 files, and the
  STOP is that 16 is not the denominator: `pickRandom2(` alone adds **50** call sites over 5
  files that the declared signature cannot match, four `<name>Rng.fork(` sites are missed, and
  **22 files** import the ambient `kernel/rngContext.js` channel that no signature can see —
  the channel EM-P0's own §P0-E9 measured carrying **62 of 67** derive-half draws.

  **The scatter's disposition — the one judgment the brief left to measurement, ANSWERED:**
  `generatePopulation.js:101` `const roll = rng.random() * totalPower;` **IS a chooser** —
  a power-weighted selection over a real candidate set (`pfList`), reached only when neither the
  direct-category nor the attraction-profile match fires, and it WRITES a record path that
  resolves: `factions[].powerFactionName`, **n=4 on a real settlement**. So it earns a row:
  `outputKey: 'factions[].powerFactionName'`, `cardShape: 'faction'`, and necessarily
  `discovery: 'checklist'` — `rng.random()` matches none of the three declared signatures, which
  is S1 again from a fourth direction. `relationships` and `conflicts` correctly get NO row.

- **Lighting census tuple before, and the walker's MEASURED interior red after:**
  before = `2646 / 383 / 2263 / 25005 / 6671` (`tests/lint/.lighting-census-baseline.json`,
  `measuredAtSha: baf8ccc1da4f7e327ad1d4d053ad814a830a90bf`, `measuredBy: EM-P0`). **The walker
  was NOT run and there is no "after": with zero new test files there is no predicted red to
  measure**, and a green run would have spent the shared slot for nothing. **Never refrozen** —
  it was never this lane's act.

- **Generated artifacts:** `NONE`.

- **Deviations:** **STOP** — see `EM-P2.STOP.md`.

- **Out-of-scope observations, recorded without investigation:**
  1. `powerIntent`, a declared `provides` of the root-writing step `generatePower`, is **absent
     from the assembled settlement record** (measured). Anything joining on it joins to nothing.
  2. `powerStructure.seats[].holder` — quoted in §6 and twice in A4 — **exists nowhere in `src`
     or `tests`**. EM-A1's `(cardShape, outputKey)` join should be re-checked against the live
     record before it is built.
  3. The model's own `codeOnly` (`chooserTotality.walker.test.js`) blanks import lines with
     `/^\s*(?:import|export)…/gm`; under `/m` the `\s*` consumes the **preceding newlines**,
     which keeps total length but destroys line starts, so `^`-anchored declaration matching can
     drift. `[ \t]*` is the offset- *and* newline-preserving spelling. **Not touched** — that
     file is NOT EDITED by this packet. Worth a chair ruling; it weakens every `^`-anchored
     resolver copied from it.
  4. `helpers.js` exports `pickRandom2` as a pure alias of `pickRandom` ("kept for call-site
     compatibility") with a byte-identical body. Fifty call sites now depend on the alias. A
     later consolidation would shrink the registry's denominator considerably.
  5. `src/generators/helpers.js` is the sole file a `DECLARES_IDIOM` guard would skip, and it
     holds **zero** `rng.fork(` / `createPRNG(` sites — so the skip costs nothing (measured, in
     case a later cut widens the guard).

- **Judgment calls:** the scatter's disposition, **answered by measurement** and recorded above.
  Nothing architectural was decided: three of the five findings (S2 `forkKey` arity, S3 the
  absent-`outputKey` rule, S5 the `registerStep` resolver) would each have required me to settle
  a field or key semantic the packet deliberately left open, which `PACKET_STANDARD.md` rules
  invalidates READY. **I settled none of them.** A defensible shape for each is sketched at the
  end of the STOP as an offer, not a decision.
