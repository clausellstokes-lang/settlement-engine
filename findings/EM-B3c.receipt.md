# EM-B3c — COMPLETION RECEIPT (§12), filled BY EXECUTION

**Lane:** Opus BUILD under sealed dispatch. **Worktree:** `$SP/slot-2` on `fixes-2026-09-18-consist`.
Every claim below is **CONFIRMED** (executed, output quoted) unless explicitly marked **PLAUSIBLE**.

- **Base SHA:** verified base `21b991118ce3b4f9d7015783b9bd955547dd4815`; HEAD at dispatch
  `dbd077481f67509b64d0901cbc9bebc5fe4ea70e`. CONFIRMED.
- **Dispatch bundle and seal identity:** `npm run implementation:dispatch -- EM-B3c` exit **0**.
  `sealDigest 94f4049300273454f5590578709aa8daea2582d640107452c81b32f5df27ae4d`;
  `capsuleDigest d286fedd56dc11ba87d4a22872250e9456a8d7e6fec5fe4d61878354b7cf03cc`;
  packet sha256 `391b16918f385e19752468010c7b229252e83c5ab6ae420a61596660e406d9c5`.
  Preamble SHA-256 measured `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1`
  = the packet header's. CONFIRMED.
- **Final commit:** **`ae4a643f78d07923a8c62d3064399f98652403e4`**, ONE commit by explicit
  pathspec. `git show --stat --name-only HEAD` names **exactly the eight** manifest paths;
  `git status --short` is **empty**; `git diff HEAD` is empty, so the pre-commit hook rewrote
  nothing. CONFIRMED.
- **Exact changed files and effective-line deltas:** 8 files, 453 insertions, 20 deletions.
  - `CREATE tests/security/galleryScannerMirrorTotality.test.js` — **211 raw**, 0 eff production
    (see Deviations).
  - `CREATE supabase/migrations/203_gallery_scanner_client_mirror_totality.sql` — 159 raw,
    **58 effective SQL lines**, exactly 202's cost as §3 predicted. CONFIRMED by count.
  - `MODIFY scripts/ops/migrationRehearsalCore.mjs` — `MIGRATION_TRAIN_REPO_HEAD` 202 → 203
    (+0, one line in place) and ONE appended frozen wave row (+35 raw / ≤34 eff).
    `buildMigrationRehearsalPlan` and every other function untouched.
  - `TEST tests/ops/migrationRehearsal.test.js` — eleven figure sites + one `toMatchObject`
    block. **NO new `describe`, NO new `it`**: 3 describes / 12 its BEFORE and AFTER, executed
    count both sides ⇒ 0 contribution to the lighting title delta. ⭐ `:403` and `:409-410`
    (the `dmLayer`/`decrees` literal lines) are **KEPT UNCHANGED** per E15.2 — they appear in
    the staged diff only as unchanged context.
  - `REGISTER scripts/mutation-coverage-manifest.json` — **+5** lines (packet predicted +4),
    `"kind": "rationale"` with an inline 1,857-char reason + `kindNote`, inserted between
    `gallerySanitizer.pglite` and `gallerySeedLeak.pglite`. `uncoveredBaseline` untouched at
    186 and the uncovered count measures exactly 186 ⇒ the SHRINK-ONLY arm is green. Not
    re-serialised.
  - `DOC docs/DEPLOY.md` / `ARCHITECTURE.md` / `docs/CURRENT_STATE.md` — the three FORCED lines.

## ⭐ THE RED-FIRST PROOF (§8 step 2), quoted verbatim

Run at base `dbd077481`, walker written, migration 203 not yet authored:

```
 FAIL  tests/security/galleryScannerMirrorTotality.test.js > ... > A1 — every client
 WORLD_SNAPSHOT_HARD_DENY key is refused by the net-current scanner
AssertionError: the net-current gallery scanner (202_edit_registry_public_denylist.sql)
refuses 25 of 28 client WORLD_SNAPSHOT_HARD_DENY keys. UNREFUSED: factionPairStates,
envoyErrands, concludedWars. ... expected [ 'factionPairStates', …(2) ] to deeply equal []
- []
+ [ "factionPairStates", "envoyErrands", "concludedWars", ]

 Test Files  1 failed (1)
      Tests  2 failed | 6 passed (8)          TRUE_EXIT 1
```

**Exactly three names — no fourth, none missing — so §11's STOP did not fire.** The second
red was A8 (`203_…sql is absent: A8 is the mechanical-diff contract on migration 203`), the
cure's deliberate absence, named in advance in the lane note. A2/A3/A4/A5/A6/A7 green.

K-gate (§8 step 1, executed before the first edit): net-current owner
`202_edit_registry_public_denylist.sql` under BOTH a lexical and a numeric prefix sort, and it
is the highest-numbered declarer; `declarers \ matchedIn` `[]` over six declarers; `hard_deny`
25; alternation 34; client `WORLD_SNAPSHOT_HARD_DENY` 28; unrefused exactly the three.

## ⭐ THE MECHANICAL DIFF (§8 step 4), quoted

```
  [PASS] masked residuals BYTE-IDENTICAL: 202 3572 chars, 203 3572 chars
  [PASS] alternation UNCHANGED, same order: 34 both sides
  [PASS] three ADDED: ["factionpairstates","envoyerrands","concludedwars"]
  [PASS] zero REMOVED: []
  [PASS] hard_deny 25 -> 28: 25 -> 28
=== VERDICT: CONTRACT HELD ===
```

203 was **GENERATED from 202's body**, not transcribed, so identity outside the `hard_deny`
array literal holds by construction; the diff then proves it. Re-executed immediately before
the commit: still CONTRACT HELD.

## ⭐ THE GREEN (§8 step 5), quoted

```
 Test Files  1 passed (1)
      Tests  8 passed (8)                     exit 0
```

Post-cure enumeration (executed probe): **28 of 28 refused, every member `by='array'`,
UNREFUSED `[]`**; net-current owner is `203_gallery_scanner_client_mirror_totality.sql` under
both sorts; `declarers \ matchedIn` `[]` over seven declarers; 203 migration files on disk.

## Acceptance cases — 8 of 8 executed and passing

A1 subset claim (red-first then green) · A2 non-vacuity floors · A3 struck-member mutant
(discriminating here, accepted by the drift rule) · A4 reconciliation + two unreadable
synthetic shapes · A5 numeric latest-wins + four-digit distinguishing case · A6 exact-equality
near-miss (`npcStatesCount`, `xdm`) · A7 the two editor keys with mechanism recorded ·
A8 the mechanical diff.

## Focused commands, exits, and counts

| Command | Exit | Count line |
|---|---:|---|
| walker alone, red-first | 1 | `2 failed \| 6 passed (8)` |
| walker alone, post-203 | 0 | `8 passed (8)` |
| §10 tests/security (5 files) | 0 | `69 passed (69)` |
| tests/ops/migrationRehearsal | 0 | `15 passed (15)` |
| tests/docs (4 freshness pins) | 0 | `58 passed (58)` |
| tests/copy/voiceMechanics | 0 | `30 passed (30)` |
| **tests/lint WHOLE** | 1 | `2 failed \| 2774 passed (2776)`, 2 of 172 files |
| tests/lint instruments (3 files) | 1 | `1 failed \| 33 passed (34)` |
| `npx eslint` (3 touched code paths) | 0 | — |
| `npm run validate:migration-head` | 0 | THREE pending (201, 202, 203) |
| `implementation-packets.mjs validate` | 0 | `191 packets (1 READY)` |

Every vitest command ran through `gate-mutex.sh --run`, SHARED tier, `--maxWorkers=2`, both
exports spelled inline; **every line printed a test count**, so no gate silently did not run.
`npm run check` was never run.

### The two lawful reds in `tests/lint`, and nothing else

1. `sovereigntyLightingContract.walker` — *"the estate's file count moved — re-measure, do not
   re-word: expected 2652 to be 2651"*. This packet's **NAMED interior red** (§7).
2. `contractTestAntiVacuity.walker` Rule 2 — *literal-union vacuity:
   `tests/store/participationWriteBase.contract.test.js::A8 — the settlement_clock chain
   returns the roster BY REFERENCE at every step, over corpus towns`*. **NOT this packet's**:
   run 18's regression from CURE-G's rename opting that suite into the walker; owned by CURE-H.
   Quoted as the chair directed.

The new walker itself is in the anti-vacuity walker's scoped set and is convicted by none of
its rules. `negativeAssertionAnchor` and `mutationCoverageManifest` both GREEN.

## Sealed per-step receipt and exact-state resume status

`check:packet` and `implementation:resume` each exit **1** on ONE step, `focused-4`, which
bundles the two lawful reds above. Every other step exits 0:

```
  validate-packets: 0   typecheck-full: 0   typecheck-domain: 0   lint-manifest: 0
  focused-1: 0  focused-2: 0  focused-3: 0  focused-4: 1  focused-5: 0  focused-6: 0  focused-7: 0
```

Resume reports **no authority, HEAD, foreign-work or receipt-integrity drift** and reused every
completed step's evidence. ⚠ The dispatch brief's "both exit 0" cannot hold while the packet's
own §7 names the lighting red: `focused-4` bundles the lighting walker, whose green requires
the chair's terminal refreeze.

- **Both typecheck configurations:** packet says `n/a — no typed production surface`; `check:packet`
  ran them anyway — `typecheck-full` exit 0 (14,466 ms), `typecheck-domain` exit 0 (11,432 ms).
- **Wave-end gate stages actually executed:** `n/a — the terminal is the train's`.
- **Base-versus-wave failure identity diff:** the two `tests/lint` reds above. The lighting red
  is this packet's, predicted in §7. The anti-vacuity red pre-exists this packet (run 18) and is
  CURE-H's. No other failure identity appeared.
- **Dormancy/golden result:** `UNCHANGED`. Measured before the first edit and after the last:
  `7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e` and
  `921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41`. No `src/` byte added.
  `UPDATE_GOLDEN` / `GOLDEN_SHIFT_SIGNED` never set.
- **Bundle/first-paint result:** `NO BUDGETED CHUNK REACHED (E7.1); no edge-shared bundle staled
  (E7.2)` — no `src/` path touched, so no closure input moved. No build owed or run.
- **`validate:migration-head`:** expected — THREE pending (201, 202, 203); visible, not fatal.
- **Generated artifacts:** `NONE`. **No lighting refreeze performed.**

## Lighting census

Frozen at `files 2651 · parked 383 · credited 2268 · titles 25035 · suiteTitles 6678`.

- **MEASURED:** `files = 2652` (**+1**), quoted from the walker's own assertion. CONFIRMED.
- **NOT MEASURED:** the other four. The walker aborts at its first arm and has no print-only
  mode; the only way to read all five is the refreeze, which is forbidden and would write a
  ninth path. The packet's predicted delta `parked +0 · credited +1 · titles +8 ·
  suiteTitles +1` (⇒ `2652 · 383 · 2269 · 25043 · 6679`) is **PLAUSIBLE**, not confirmed, and
  the chair's terminal refreeze is what settles it. Structural evidence executed: the new file
  is exactly one `describe` + eight `it`s, statically registered, importing from `'vitest'`
  (⇒ credited, not parked); `tests/ops/migrationRehearsal.test.js` contributes zero titles.

## Deviations

**ONE, declared and accepted by the chair before the commit.**
`tests/security/galleryScannerMirrorTotality.test.js` measures **211 raw lines** against §7's
`<=190 raw`. Every hard scope-budget row of §3 is unmoved: 1 behavior family, 0 new persisted
record families, 0 named state writers, 0 flags, 0 surfaces, 0 direct consumers, 0 new
production leaves, 1 existing logic-bearing production file, 2 registration-only files,
**8 of ≤12 handwritten files**, **≤96 of ≤400 effective production lines**, **8 of 8 acceptance
cases**. The excess is content §7 and §9 themselves mandate. Compression passes: 257 → 243 →
216 → 211; reaching 190 would delete mandated explanation.

**Correction to a packet figure (accepted, corrected at the LANDED flip):** E14.3 predicted a
3,582-character masked residual; it **measures 3,572**. Descriptive only — the executed
contract is byte-IDENTITY.

## Judgment calls

`NONE` beyond the declared line-budget deviation. Two smaller in-scope choices, both recorded:
(1) the `scanner.owner` re-point's adjacent comment was updated from "202 IS the net-current
scanner" to name 203, because leaving it would ship a false comment beside a changed assertion;
(2) two CURRENT_STATE / migrationRehearsal comments saying "two migrations ahead" were updated
to "three", same reason. Both are inside regions §7 already names.

## ⛔⛔ THE OWNER'S HAND — carried verbatim

> **"APPLYING migrations 201–203 (`supabase db push` + the applied-head bump) is the OWNER's
> hand; until then production's scanner is the pre-202 definition and the gap this packet
> closes is OPEN IN PRODUCTION."**

`supabase/applied-head.json` is **NOT** touched and stays at `200`. No database was contacted;
the only SQL execution anywhere was the in-process pglite the security suites own.

## Out-of-scope observations, without investigation

1. **`migrationRehearsal.test.js`'s `scanner.owner` pin rots on every scanner migration** — this
   packet re-pointed it as every previous one has. The non-rotting form is E17's existence claim
   plus arm A5. Belongs beside TOOL-4; it would edit a LANDED packet's `checks` member.
2. **Three copies of the latest-wins walk now exist** (`snapshotDenylistDrift`,
   `migrationRehearsal`, this walker). TOOL-4 consolidates; arm A4 keeps all three honest.
3. **The sealed dispatch's substrate check stays path-based** — a future `204_*.sql` is still
   invisible to `implementation:dispatch`. EM-B3c closes that class **at the gate**.
4. **The lighting walker cannot report its measured tuple without writing the baseline.** A
   read-only print mode (env-gated, no write, exit 0) would let a lane record all five figures
   for the chair instead of only the first arm's. Chair's call; not built here.
5. **`tests/lint` WHOLE takes 208 s** (122 s of it module import) for 172 files. Noted only
   because every build lane now pays it once.
6. **The anti-vacuity walker's Rule 2 fires on `tests/store/participationWriteBase.contract.test.js::A8`**
   — already owned by CURE-H, recorded here as the base-vs-wave failure identity.
