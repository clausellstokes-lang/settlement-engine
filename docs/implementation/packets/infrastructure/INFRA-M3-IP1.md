# INFRA-M3-IP1 — the sourcemap guard

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `aa6bca77f0a04d622d363e115d663eff69f06ff6`
- **Train:** `infra-1`, member 3 of 3 — **the terminal member**
- **Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` @ SHA-256
  `cd04a46315c919694d6eb5a043d74fe6173ec11be359be932d40ecf04af232f5`
- **Authorities:** `DESIGN_IP_PROTECTION.md` **§3 IP-1** (binding), §2 L1/L2/L4, §6 (the receipt it
  owes) · `DESIGN_BUILD_EFFICIENCY.md` §8 row 3 (the slot) · `PACKET_STANDARD.md` ·
  INFRA-PREAMBLE · `OWNER_DECISION_QUEUE.md` §30 (the polarity ruling)
- **Compiled by:** Lane TC3. **Executed by:** Lane TE3.

---

## §1 Scope and boundary

**Build one test in the `verify:dist` / strict-dist family asserting, over the real built artifact
set the strict runner already discovers: no `.map` file exists anywhere under `dist/`, and no
emitted chunk carries a `sourceMappingURL` directive.**

**Why it is owed.** The bundle ships no source maps today — **but only by Vite's default**.
MEASURED at this base: `grep -n 'sourcemap' vite.config.js` returns **no match at all**; the
`build:` block carries `outDir`, `chunkSizeWarningLimit` and a `modulePreload` filter, and no
`sourcemap` key. One config line silently undoes the current posture and nothing in the gate would
notice.

**Explicit non-goals.** No product byte, no `src/` edit, no `vite.config.js` edit **that survives
the member** (the mutant flips it inside an isolated candidate and never touches this worktree's
copy). No `package.json` edit (INFRA-PREAMBLE §P2). No `check` chain edit — the guard needs none,
because `verify:dist` already runs `tests/build/`. No minification, obfuscation, or bundling
change: `DESIGN_IP_PROTECTION.md` §5 refuses blanket obfuscation by name and §2 L2 forbids claiming
any UI-hiding as protection. This member is **output-neutral**.

---

## §2 Required verified tree contract, all EXECUTED at this base

| Role | Path / symbol | State |
|---|---|---|
| The strict runner | `scripts/check-test-ratchet.mjs --verify-dist` | `verify:dist` runs it under the canonical mutex |
| Its file census | `discoverBuildTestFiles(root)` | recursive walk of `tests/build`, symlinks refused, an empty result fails closed |
| Its authority | the strict-dist arm | *"no baseline and no debt concept … every on-disk build contract must appear exactly once and pass whole"* |
| Source-phase exclusion | `SOURCE_TEST_EXCLUDE` | `tests/build/**`; a leaked row **fails the source phase closed** |
| Current corpus | `tests/build/**` | **50** files |
| Current artifact | `dist/` | **524** entries under `dist/assets`; **0** `.map` files anywhere under `dist/` |
| The shape to copy | `tests/build/firstPaintNonJs.test.js` | `distExists`, `requireDistRead`, `describe.runIf(distExists)`, `it.skipIf(!requireDistRead)` |
| The anti-vacuity idiom | `tests/build/vendorPdfLazy.test.js` | the unconditional `VERIFY_DIST` post-build guard |

**Forbidden files:** everything not in §5. **Forbidden alternative homes:** ⛔ not `tests/lint/`,
⛔ not `tests/security/`, ⛔ not an extension of an existing `tests/build/` file — each refused
with a reason in §4.2.

---

## §3 The hazard that inverts the house idiom

⛔⛔ **HZ-DISTSTALEGREEN. IP-1's ASSERTION HAS THE OPPOSITE STALE-DIST POLARITY FROM EVERY OTHER
ABSENCE CHECK IN `tests/build/`.**

The estate's rule, stated in `vendorPdfLazy.test.js`, is that absence assertions stay UNGATED
because *"a stale dist can only UNDER-report absence … so gating it would only lose coverage."*
That reasoning holds because those absences are about **newly-added eager edges**, which a stale
build simply lacks.

**IP-1's absence is about a config flip.** Set `build.sourcemap: true` and do not rebuild, and a
stale `dist/` still contains zero `.map` files — the guard reports GREEN over precisely the change
it exists to catch. A stale dist here **false-GREENS**; it does not false-RED.

⇒ Ruled by `OWNER_DECISION_QUEUE.md` §30: **the reads are `VERIFY_DIST`-gated like a SIZE read, not
ungated like an absence read**, plus an **unconditional** anti-vacuity `it` that makes
`VERIFY_DIST=1` with a missing or empty `dist/assets` a HARD failure, so the gated half can never
count green having measured nothing.

---

## §4 Exact contracts this member settles

### 4.1 The file's shape

Two suites, and the split is load-bearing:

- **Suite 1, UNCONDITIONAL `describe(...)`** — the anti-vacuity guard. It must run even when the
  `runIf` suite does not, or the guarded half can pass having measured nothing.
- **Suite 2, `describe.runIf(distExists)(...)`** — the reads, each `it.skipIf(!requireDistRead)`.

⚠ **The file therefore PARKS in the lighting census, and that is the declared, correct outcome.**
Door 3 refuses a file WHOLE if any suite it opens is `describe.runIf`. Making it credited would
mean deleting the `runIf`, which would red the whole suite on any fresh checkout with no `dist/`.
Correctness wins; the census motion is declared rather than fought.

### 4.2 The emitted-chunk census — inherited, never re-enumerated

⛔ **The test maintains no list of chunks.** It walks `dist/` from disk on every run, so a new
chunk is covered the moment Rollup emits it — `DESIGN_IP_PROTECTION.md` §3's stated requirement.
The **file census** it inherits is `discoverBuildTestFiles()`'s: by living in `tests/build/`, this
file is discovered, required to run exactly once, and required to pass whole, with no baseline and
no debt concept available to it.

Rejected homes: `tests/lint/` and `tests/security/` are enforcer dirs, so `enumerateInvariants()`
would pick the file and owe a mutation-manifest row — and worse, the file would run in the
**source** phase where `dist/` may be stale or absent. Extending an existing `tests/build/` file is
census-neutral and therefore tempting, but it buries an IP guard inside a first-paint budget file
and gives it no identity in the strict-dist failure report. The `+1 file / +1 parked` cost is paid
deliberately.

### 4.3 The two assertions, exactly

1. **ZERO `.map` FILES.** Recursive walk of all of `dist/`, collect every path matching `/\.map$/`,
   assert the array is empty; the failure message lists them. Walking all of `dist/` rather than
   just `assets/` is deliberate: `postbuild` runs the prerender step and a sourcemap could land
   outside `assets/`.
2. **NO `sourceMappingURL` DIRECTIVE IN ANY EMITTED CHUNK.** For every `dist/assets/**` file
   matching `/\.(?:js|css)$/`, read the **final 2 KB** and assert no `/[#@]\s*sourceMappingURL=/`
   match. ⛔ Read the tail, not the whole file: the comment is a trailing directive by spec, and a
   mid-file occurrence is a string literal in someone's source, not an emitted directive.

⚠⚠ **THE DIRECTIVE SCAN IS SCOPED TO `dist/assets/**` FOR A MEASURED REASON, NOT A STYLISTIC ONE.**
MEASURED at this base: **22 files under `dist/map/libs/tinymce/skins/**` carry a real
`# sourceMappingURL=…` directive.** They are vendored third-party skin assets copied into the map
fork's output, not chunks this build emits, and their referenced `.map` files are not shipped —
which is why assertion 1 still measures **0** across all of `dist/`. An unscoped directive scan
would land this guard RED at birth against third-party bytes the build never authored. Assertion 1
stays whole-tree; assertion 2 is scoped to what Rollup emits.

### 4.4 The filename is settled, and the reason is mechanical

**`tests/build/sourcemapAbsence.test.js`.** `enumerateInvariants()` picks any basename matching its
invariant-nomenclature regex; `sourcemapAbsence` matches none. ⛔ `sourcemapContract`,
`distSourcemapScan`, `sourcemapPin` and `sourcemapGovernance` would each opt the file in and put a
mutation-manifest row on this member's bill. MEASURED: `tests/build/**` contributes exactly **one**
enumerated row today.

⭐ Sitting outside the mutation manifest is not an evasion: `tests/build/**` answers to a stronger
authority (§2), and the manifest's job — catching a guard nobody proved reds — is done here by §7's
mandatory config-flip mutant, which `DESIGN_IP_PROTECTION.md` §3 requires independently.

---

## §5 Change manifest

| Action | Path | Region / symbol | Max effective-line delta | Instruction |
|---|---|---|---|---|
| CREATE | `tests/build/sourcemapAbsence.test.js` | whole file | n/a (test) | the two suites of §4.1, the two assertions of §4.3, the anti-vacuity guard of §7.1 |
| TEST | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` block | n/a | ⚠ the TRAIN's whole-census re-derivation lands in this member's commit, because the terminal is docs-only per `OWNER_DECISION_QUEUE.md` §30 — see §6 |

**One handwritten test file plus the train's census re-record.** Zero production leaves, zero
production files modified, zero registration files, **zero effective production lines**, zero
persisted families, zero flags, zero user-facing surfaces, zero new dependencies.

⚠ `vite.config.js` is **NOT** in the manifest. The mutant touches it only inside an isolated
candidate worktree; a surviving edit in this worktree is a STOP.

`retiredSymbols`: **NONE.**

---

## §6 Predicted census motion, and why the re-record lands HERE

| Census | Base | After M3 | Cause |
|---|---|---|---|
| lighting | `2416/365/2051/20016/5642` | **`2418/366/2052/20024/5643`** | this member's `+1 file / +1 parked`, plus M2's `+1/+0/+1/+8/+1`, re-derived WHOLE |
| `runtimeTests` | 28032 | **28040** | M2's eight cases; **M3 adds zero** |
| `frozenKnownFailures` | 16 | **16** | ⛔ the source baseline refuses `tests/build/**` rows; this guard cannot be banked as debt |
| `verify:dist` corpus | **50** | **51** | `discoverBuildTestFiles()` walks the directory |
| `osrFindings` | 1998 | **1998** | no `src/` byte, no governed input |

⭐ **M3 adds ZERO runtime tests.** `SOURCE_TEST_EXCLUDE` is `tests/build/**` and the source phase
**fails closed** if such a row leaks into its report.

⚠⚠ **THE WHOLE-CENSUS RE-DERIVATION LANDS IN THIS MEMBER'S COMMIT, NOT IN THE TERMINAL, AND THAT IS
WHAT MAKES §30's CAPSULE RULING TRUE.** The chair ruled that the capsule stamps at *the terminal's
parent content commit* and that the consumption law's docs-only-window clause covers the terminal
and later docs children. That is only literally true if the terminal is **docs-only relative to
this commit** — so the `tests/` edit that re-records the census must land here, with M3's file, and
the terminal carries only the three LANDED flips, the manifest, the index and the regenerated
artifact. The serialization law is untouched: the single exposed change from the train's base still
carries both the motion and its re-record.

⇒ **The named interior red M2 opened closes HERE.** From I2 until this commit the census walker
reds on its census arm; this commit re-derives the whole tuple and it goes green. No interior red
survives past this member.

**Precedent for the park:** the walker's own park-set names `tests/build/campaignRuntimeLazy.test.js`
and `tests/build/envoyPersistenceHydrationLazy.test.js`, both `SUITE_NOT_RUNNING:describe.runIf()`.

---

## §7 The proof path, and what the dist build costs

**Measured answer: the green half costs ZERO extra build; the mutant half costs EXACTLY ONE extra
`vite build`, and it is paid in an isolated candidate worktree.**

### 7.1 The green half — free, by riding the terminal's existing chain

`npm run check` already ends `… && npm run build && npm run verify:dist`. At the terminal the bare
`check:tail` therefore builds a fresh `dist/` and runs `tests/build/` against it with
`VERIFY_DIST=1`. The guard's green is proved there at zero marginal cost against a genuinely fresh
artifact — the only artifact worth proving it against.

Inside this member the implementer proves the same thing against the existing `dist/`. ⚠ That run
measures a dist built at an earlier tree: it is **corroboration, not the proof**, and the receipt
must say which is which.

**The anti-vacuity `it` (unconditional, suite 1):** when `VERIFY_DIST === '1'` and (`!distExists`
or `dist/assets` holds zero `.js` files), **fail hard** with a message naming `npm run build`.
Without it, a missing `dist/` in the post-build re-run would silently no-op the whole file while
`verify:dist` reported a passing suite.

### 7.2 The mutant half — one extra build, in an isolated candidate

⚠ **The flip happens in a detached candidate worktree with its own linked `node_modules`, never in
the code-of-record worktree.** `dist/` there is shared-tree state that sibling lanes read, and the
terminal's own `npm run build` must not inherit a sourcemapped artifact.

| step | act | requirement |
|---|---|---|
| 1 | record `sha256(vite.config.js)` in the candidate | quoted in the receipt |
| 2 | add `sourcemap: true` inside the `build: {` block | ⛔ **prove the bytes changed** — a no-op plant is a STOP |
| 3 | `npx vite build` in the candidate | the one extra build |
| 4 | `VERIFY_DIST=1 npx vitest run tests/build/sourcemapAbsence.test.js` | **must exit non-zero AND red under the named title** — a red under a different title is ambiguous and a STOP |
| 5 | restore `vite.config.js`; assert `sha256` equals step 1 **exactly** | ⛔ digest-exact, not "looks the same" |
| 6 | remove the candidate worktree entirely | ⛔ **MANDATORY.** Its `dist/` is a sourcemapped artifact and nothing may inherit it |
| 7 | rerun focused green in the code-of-record worktree | proves the file still loads and registers |

### 7.3 Plant-nothing-greens — the four controls

| # | Control | Must |
|---|---|---|
| M3-c1 | step 2's byte-change proof | a no-op plant STOPs the member |
| M3-c2 | fabricate a `.map` under `dist/assets`, run, delete | the `.map` arm reds by name — proves the walk reads disk, not a constant |
| M3-c3 | append a `sourceMappingURL` directive to one real `dist/assets/*.js`, run, restore digest-exact | the directive arm reds by name — proves the tail read is live and that the two arms convict **independently** |
| M3-c4 | with `VERIFY_DIST=1` and `dist/` moved aside, run | the anti-vacuity `it` reds — proves the gated half cannot count green having measured nothing |

⛔ **M3-c2 and M3-c3 are both required.** A single control would leave the redundant-guard class
open: if only one arm were proved, a mutant that passes would mean the other arm had silently
subsumed it, not that the code is safe.

---

## §8 Acceptance matrix — closed at 5 cases

| id | Case |
|---|---|
| **A1** | **MAIN.** With `VERIFY_DIST=1` and a built `dist/`, zero files under `dist/` match `/\.map$/`. |
| **A2** | **MAIN.** With `VERIFY_DIST=1`, no `dist/assets/**` `.js`/`.css` file's final 2 KB carries a `sourceMappingURL` directive. |
| **A3** | **ANTI-VACUITY (unconditional).** `VERIFY_DIST=1` with `dist/` absent, or with `dist/assets` holding zero `.js` files, is a HARD failure naming `npm run build`. |
| **A4** | **DISABLED / ABSENT.** Without `VERIFY_DIST=1` and without `dist/`, the file loads, registers, and no-ops cleanly — a fresh checkout's plain run is not red. |
| **A5** | **CENSUS INHERITANCE.** `discoverBuildTestFiles()` contains this file's path and `isBuildTestPath()` returns true for it, so the strict runner requires it to run exactly once and pass whole and the source phase excludes it. Pins the inheritance rather than trusting it. |

Cases 5-8 of the standard's edge-case budget are **omitted, not replaced**: this member writes no
state, has no writer and no reader, and touches no user data.

---

## §9 Mandatory implementation order

0. Preflight: branch, ancestry to I2, porcelain clean, `dist/` present with its `.map` and
   directive counts recorded, `sha256(vite.config.js)` recorded.
1. Baseline: the census walker's named interior red still reads `expected 2417 to be 2416`.
2. The smallest failing focused test: A3's anti-vacuity arm, before the guard exists.
3. Suite 1 (unconditional anti-vacuity), then suite 2 (the two gated reads).
4. — 5. — 6. (no writer, no lifecycle seam, no consumers, no registration: the prevention guard
   **is** the deliverable. Recorded as inapplicable rather than skipped.)
7. Focused verification (§10), then the mutant and the four controls (§7.2-§7.3).
8. The train's whole-census re-derivation (§6). **No wave-end full gate** — it moves to the
   terminal.

---

## §10 Focused checks (argv form)

```
VERIFY_DIST=1 npx vitest run tests/build/sourcemapAbsence.test.js   ; echo TRUE_EXIT=$?   # expect 0
npx vitest run tests/build/sourcemapAbsence.test.js                 ; echo TRUE_EXIT=$?   # expect 0 (A4)
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js; echo TRUE_EXIT=$?   # expect 0 after §9.8
npx eslint tests/build/sourcemapAbsence.test.js                     ; echo TRUE_EXIT=$?   # expect 0
node scripts/implementation-packets.mjs validate                    ; echo TRUE_EXIT=$?   # expect 0
```

⛔ Never through a pipe. ⛔ **Do not run `npm run verify:dist` inside the member** — it re-acquires
the gate mutex and is the terminal's job. ⚠ HZ-DISTBOOT: this member adds no static import edge, so
no separate `smoke:boot` is owed beyond the terminal's.

---

## §11 STOP conditions (in addition to INFRA-PREAMBLE §P8)

1. `dist/` at base already contains a `.map` file, or a `dist/assets/**` chunk already carries a
   `sourceMappingURL` directive — the guard would land RED and that is a source question, not a
   test question. **Report; do not change the config to make the guard pass.**
2. `vite.config.js`'s post-mutant SHA-256 differs from its pre-mutant SHA-256 by even one byte, or
   the code-of-record worktree's copy is touched at all.
3. The mutant reds under a title other than the named one, or reds nothing.
4. Any control of §7.3 fails to convict.
5. The lighting census lands on anything other than `2418/366/2052/20024/5643`.
6. `runtimeTests` moves at all, or a `tests/build/**` row appears in the source-phase report.
7. A `package.json` edit appears necessary.
8. `enumerateInvariants()` picks the new file.
9. Any minification, obfuscation, bundling, tuning, deploy, paid-policy or legal work would begin.

---

## §12 Completion receipt

Verified base sha and final tree state · the changed files · A1-A5 with exact argv and exits ·
**the mutant with its pre/post `vite.config.js` SHA-256 quoted, its named red title, and the
candidate teardown confirmed** · the four §7.3 controls with their convictions · the lighting
census tuple before and after · `runtimeTests` unmoved by this member · the `verify:dist` corpus
count 50 → 51 · deviations `NONE` or a STOP · judgment calls `NONE`.

⭐ `DESIGN_IP_PROTECTION.md` §6 names exactly what IP-1 owes: *"the planted-mutant conviction +
green at HEAD."* Both are above, and the receipt states them in those terms so the volume's own
ledger can be closed against it.
