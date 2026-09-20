# TOOL-A — RECEIPT

Lane `TOOL-A`, branch `tooling-a-2026-09-19`, advanced base `ad7ddf2c9` (EM-B1d v5 READY,
EM-B1e LANDED). Gate window 2026-09-19 18:27–19:0x EDT. No other lane held the lock.

## COMMITS

- **TOOL-1 · `52be5a1f2`** — five files: `docs/implementation/PACKET_STANDARD.md`,
  `docs/implementation/PACKET_TEMPLATE.md`, `scripts/implementation-packets.mjs`,
  `tests/scripts/implementationPackets.test.js`, `tests/scripts/implementationSession.test.js`.
  `git show --stat` names exactly those five. Pre-commit hook rewrote nothing.
- **TOOL-2 · `6fefb69e6`** — four files: `scripts/dist-gate-honesty.mjs`,
  `tests/setup/distGateHonesty.js`, `tests/lint/testRatchet.test.js`, `vite.config.js`.

## EVERY GATE LINE, WITH ITS COUNT

| step | command | result |
|---|---|---|
| ungated | `node scripts/implementation-packets.mjs validate` | `valid: 189 packets (1 READY)` exit 0 ✅ |
| 1 | vitest `tests/scripts/implementationPackets` + `implementationGate` + `implementationSession` + `baseStateCapsule` | `Test Files 4 passed (4)` · `Tests 50 passed (50)` ✅ |
| 2 | vitest `negativeAssertionAnchor.walker` + `mutationCoverageManifest` | `Test Files 2 passed (2)` · `Tests 19 passed (19)` ✅ |
| 3 | vitest `tests/copy/voiceMechanics.test.js` | `Test Files 1 passed (1)` · `Tests 30 passed (30)` ✅ |
| 4/13 | `npx eslint` on all seven touched code files | exit 0, no output ✅ |
| 5 | vitest `sovereigntyLightingContract.walker` | ⛔ EXPECTED RED · `Test Files 1 failed (1)` · `Tests 1 failed \| 33 passed (34)` |
| 7 | vitest `tests/lint/testRatchet.test.js` | `Test Files 1 passed (1)` · `Tests 86 passed (86)` ✅ |
| 8 | `npx vitest list --maxWorkers=2` UNFILTERED | see THE SWEEP below |
| 9 | vitest `tests/build/firstPaintNonJs.test.js` | ⭐ REFUSAL · `Test Files 1 failed (1)` · `Tests no tests` |
| 10 | same with `DIST_GATE_ALLOW_SKIP=1` | `Test Files 1 skipped (1)` · `Tests 8 skipped (8)` ✅ |
| 11 | `npx vitest run --dir tests/build --maxWorkers=2` | ⭐ 59 refusals · `Test Files 59 failed (59)` · exit 1 |
| 12 | vitest `tests/scripts/` whole directory | `Test Files 9 passed (9)` · `Tests 125 passed (125)` ✅ |

⚠ Steps 1, 2, 3, 7, 9, 10, 11, 12 and the eslint step were each RE-RUN after the last edit,
so every green above binds to the committed tree and not to an earlier one.

## THE THREE REDS, EACH EXPLAINED

1. **Step 5, the lighting census — EXPECTED, and NOT this lane's.**
   `expected 2649 to be 2646` against EM-P0's baseline (`measuredAtSha baf8ccc1d`). Working
   tree = 2649 test files, HEAD `ad7ddf2c9` = 2649, identical, and
   `git diff --name-status baf8ccc1d HEAD -- tests` names the three the landed editor packets
   added: `tests/domain/ruinInstitution.test.js`, `tests/lib/editTravel.test.js`,
   `tests/store/decreeRegistryPersistence.test.js`. **NOT REFROZEN.**
   **THIS LANE'S DELTA: `files +0 · parked +0 · credited +0 · titles +4 · suiteTitles +0`**
   (TOOL-1 +1, TOOL-2 +3). The walker stops at `files`, so the titles figure at this tip is
   not measured by this run; the chair re-derives the tuple at the terminal.
2. **Step 9 and 11 — the cure, demonstrated.** These reds ARE the deliverable.
3. **Three interim reds I caused and fixed inside the window** — §"What the gate caught".

## THE SWEEP (step 8)

`npx vitest list --maxWorkers=2`, unfiltered, no `dist/` on disk.

**Run 1 FAILED and that failure is load-bearing evidence twice over.** It raised
`TypeError: The URL must be of scheme file` (`ERR_INVALID_URL_SCHEME`) from
`liveDistGateState` **once per test file — 5712 stderr lines** — which proves (a) that
`vitest list` really does evaluate each test module's top level, so it is a genuine sweep
proof and not a file listing, and (b) that my guard had a defect: under `vitest list` a
module's own `import.meta.url` is not a `file:` URL and `fileURLToPath` throws.
**Dist-gate refusals in that whole unfiltered collection: ZERO** — the discriminator was
never armed, exactly as designed.

**Cure:** `repoRootFrom(metaUrl, hop, fallback)` in the leaf resolves the root without ever
throwing, falling back to `process.cwd()`. Its truth table is pinned against `file:`,
`http:`, `https:`, an unparseable string, `''` and `undefined`.

**Run 2 (after the cure): EXIT 0.** 33,996 test entries collected, 419 of them from 52
`tests/build/` files. stderr EMPTY, zero `ERR_INVALID_URL_SCHEME`, and **ZERO dist-gate
refusals**. (One loose grep hit turned out to be a pre-existing TEST TITLE in
`previewPersonaAbsent.test.js` — "a skipped post-build contract is green-on-nothing" — and
the guard's own phrase, "is a post-build contract and dist/ is absent", appears zero times
in stdout and stderr alike.) The remaining 7 `tests/build/` files contribute no entries
because `describe.runIf(false)` never runs its factory, which is the same reason a focused
run on one prints `(0 test)`; their module top level IS still evaluated, which is exactly
what run 1's per-file errors proved.

## WHAT THE GATE CAUGHT — three defects of mine, all fixed inside the window

1. **A fixture that moved two of three status homes.** `atStatus` in the new §7 test set the
   manifest and the index but not the packet Markdown header, so the terminal-exemption rows
   red with `status disagrees with packet Markdown`. The pre-existing §731.3 helper records
   being bitten by exactly this; the body is now republished at each status.
2. **A vacuous negative assertion.** The inert-leaf test's first draft used a negated
   `toContain` with an asymmetric matcher. `toContain` compares by equality and never applies
   a matcher, so it would have passed for every input forever. **My own liveness leg
   convicted it on the first run.** Rewritten as a positive pair over `.some()`.
3. **The `ERR_INVALID_URL_SCHEME` defect above**, which would have broken `npx vitest list`
   and every other non-file-URL context for the whole estate.

Also: the negative-assertion walker convicted a COMMENT of mine that quoted the forbidden
pattern verbatim. The prose was reworded and now says why.

## GOLDENS

Identical before the first edit and after the last:
`7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e` generator-golden-master.json ·
`921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41` dossier-prose-manifest-golden.json
