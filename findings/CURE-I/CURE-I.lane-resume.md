# CURE-I — lane resume note AND lane receipt (one file, deliberately: the chair reads one thing)

## ✅ LANDED IN THE SLOT — 2026-09-20 06:47 EDT

Cherry-picked onto `fixes-2026-09-18-consist` in `$SP/slot-2` on the chair's word, after
EM-B1k2 landed (`e96a1c33e`, flipped; tip was `fad5af302`).

- **Slot sha `7c233db55fbfdcb199f128c044713f579dfbea39`**, parent `fad5af302`.
- Preconditions verified first: branch `fixes-2026-09-18-consist`, `git status --short`
  EMPTY. Neither of my two files moved between my base `5a3380e8d` and `fad5af302`
  (empty `git diff --stat` over both paths), so the pick applied clean — `EXIT=0`, no conflict.
- `git show --stat HEAD` names exactly the two files (+162 / −16); `git status --short` empty.
- Goldens in the slot unchanged: `7177cd6e…8f1e`, `921c51cf…db41`.

**Re-proved in the slot, shared tier, exports inline:**

| | |
| --- | --- |
| the two suites | `Test Files  2 passed (2)` / `Tests  15 passed (15)` |
| `tests/security` WHOLE | `Test Files  147 passed \| 1 skipped (148)` / `Tests  1834 passed \| 1 skipped (1835)` |

**Delta against the lane measurement: ZERO** — byte-identical counts. EM-B1k2 added nothing
under `tests/security`, now MEASURED rather than assumed.

**⚠ LIGHTING, FOR THE CHAIR'S TERMINAL REFREEZE — read this before refreezing.** Run plainly
in the slot (never refrozen): `Tests 1 failed | 33 passed (34)`, and it now fails at the
FIRST figure — `the estate's file count moved: expected 2653 to be 2652`. That +1 file is
**EM-B1k2's**, not mine: this commit adds no file. Because the arm short-circuits at `files`,
the COMPOSED `titles` figure was **not printed and is therefore unmeasured**. My own
contribution is `titles +4`, measured in isolation at my base. Do not compose the tuple by
hand-arithmetic — the census's own doc block forbids exactly that; regenerate.

Lane: CURE-I (Opus). Chair: Fable 5.1, session a9df403c. Stamped from `date` at the
commit: **Sun Sep 20 04:57 EDT 2026**.

## State

- **Branch** `cure-i-2026-09-20`, worktree `$SP/lane-cure-i`, cut from **`5a3380e8d`**.
- **Commit** `b866847bfe1b931631b7a74d3620fab6f5cad7f9` (`b866847bf`) — the ONLY commit
  on the branch. `git show --stat HEAD` names exactly two files; `git status --short`
  is empty; the pre-commit hook rewrote nothing.
- **Patch** `$SP/lane-cure-i-scratch/CURE-I.patch` (23,718 bytes)
  sha256 `efc1a5088b67623971b5c3875c7664eb050dc05e79974ac1f28aeb5befb1710a`
- **Files** (both under `tests/`; no `src/` edit, no golden, no register file):
  - `tests/security/migrationRefIntegrity.meta.test.js`  (+169 / the marker, the lie arm, the three self-tests)
  - `tests/security/galleryScannerMirrorTotality.test.js` (+9 / two marker comments, no assertion or title changed)

## What it does

Run 19's one red was five literals the SS4 meta walker read as migration references and
that are in fact EM-B3c's A5 SORT FIXTURES (`089_a.sql` x1, `202_b.sql` x2, `1000_z.sql`
x2 — a four-digit prefix the 203-file corpus does not have, which is the only way to make
numeric order disagree with lexical order). The cure is a DECLARED, EXECUTED marker
`// synthetic-migration-name: <reason>`, placed exactly as `// anchored:` is read (the
literal's own line or the ONE line immediately above). A declared literal is excluded
from the existence check **and asserted to be absent**, so the marker can hide nothing:
aiming it at a real migration reds with its own message. Not an evasion of `MIG_REF_RE`,
not a file-level exemption, not a real filename.

## TO LAND IN THE SLOT (after the chair says "the slot and the gate are yours")

```sh
SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad

# 1. PRECONDITIONS — if either is not as stated, STOP and report, do not improvise.
git -C "$SP/slot-2" branch --show-current     # must be: fixes-2026-09-18-consist
git -C "$SP/slot-2" status --short            # must be EMPTY

# 2. Cherry-pick. EM-B1k2 touches neither file; if this conflicts anyway, STOP and report.
git -C "$SP/slot-2" cherry-pick b866847bfe1b931631b7a74d3620fab6f5cad7f9

# 3. Re-prove there (shared tier, worker-capped, exports INLINE on every line).
cd "$SP/slot-2" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/security/migrationRefIntegrity.meta.test.js tests/security/galleryScannerMirrorTotality.test.js
# expect: Test Files 2 passed (2) / Tests 15 passed (15)

cd "$SP/slot-2" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/security
# expect: Test Files 147 passed | 1 skipped (148) / Tests 1834 passed | 1 skipped (1835)
#   (+/- whatever EM-B1k2 adds under tests/security — read the delta, do not assume)

# 4. Confirm scope and cleanliness, then report the slot's sha.
git -C "$SP/slot-2" show --stat HEAD          # exactly the two files above
git -C "$SP/slot-2" status --short            # empty
git -C "$SP/slot-2" rev-parse HEAD
```

⛔ A gate line with no printed test count DID NOT RUN. Never `npm run check` / `test` /
`test:ratchet`. Never refreeze the lighting walker — that is the train's terminal act.

## RECEIPTS — all CONFIRMED by execution, in the lane worktree at `5a3380e8d`

| what | result |
| --- | --- |
| base RED reproduced, five names quoted | `Tests  1 failed \| 2 passed (3)` |
| the two suites, cured | `Test Files  2 passed (2)` / `Tests  15 passed (15)` |
| PLANT A — a lying marker on the LIVE corpus | `Tests  1 failed \| 14 passed (15)`, restored |
| PLANT B — the reader forced to drop the tag | `Tests  4 failed \| 3 passed (7)`, restored |
| mutation-sweep AREA 12, run by hand | planted `EXIT=1` `Tests 1 failed \| 6 passed (7)`; restored `EXIT=0` `Tests 7 passed (7)` |
| `tests/security` WHOLE | `Test Files  147 passed \| 1 skipped (148)` / `Tests  1834 passed \| 1 skipped (1835)` |
| `mutationCoverageManifest` + `negativeAssertionAnchor` | `Test Files  2 passed (2)` / `Tests  19 passed (19)` |
| `tests/lint` WHOLE (run unasked: six lint instruments READ `tests/security`, and this commit moves a title count there) | `Test Files  1 failed \| 171 passed (172)` / `Tests  1 failed \| 2775 passed (2776)` — the ONE red is the lighting census, expected and never refrozen |
| `tests/copy/voiceMechanics.test.js` | `Tests  30 passed (30)` |
| `npx eslint` on both files | `EXIT=0` |

The `tests/lint` whole run is the one addition to the brief's batch, and it earned its
place: `testRatchet`, `contractTestAntiVacuity`, `netCurrentExtractorAnchor`,
`migrationGrantPosturePin`, `migrationSearchPathPin` and `founderSeatsMigration` all read
`tests/security` sources, none was in the brief's list, and a moved title count is exactly
what reddens a terminal three hours later. All six are GREEN.

**PLANT A's message** (the new arm, on the live corpus):
`tests/security/galleryScannerMirrorTotality.test.js:171 declares '001_initial_schema.sql'
synthetic, but supabase/migrations/001_initial_schema.sql EXISTS. THE MARKER LIES: ...`

**PLANT B's message** (the liveness clause):
`1 tests/security file(s) carry the synthetic-name marker, and the reader found NO
synthetic literal. The two regexes have drifted apart, so the declaration is inert —
files: tests/security/galleryScannerMirrorTotality.test.js`

**AREA 12 named three real referencing suites** while the migration was moved away:
`profileStripeSubPin.test.js`, `rateLimitConfig.pglite.test.js`, `refundDedup.pglite.test.js`.
`git status --short supabase/` was empty after the restore.

## LIGHTING CENSUS — measured once, separately, NEVER refrozen

```
frozen    2652 · 383 · 2269 · 25043 · 6679   (902580c71, chair-fable-a9df403c)
measured                          25047      Tests  1 failed | 33 passed (34)
```

**DELTA: `titles` +4.** The four `it` titles this commit adds to the meta walker (the
lie arm and the three marker self-tests). `files`, `parked` and `credited` are each
asserted BEFORE `titles` in that arm and each PASSED, so those three are CONFIRMED
unmoved. `suiteTitles` was not reached (the arm short-circuits at the first moved
figure); the diff adds no `describe(`, so **+0 there is structural, PLAUSIBLE, not
measured** — the chair's refreeze at the train's terminal will measure it.

## GOLDENS — identical before the first edit and after the last (and after the hook)

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

## REGISTERS

`scripts/mutation-coverage-manifest.json` is UNTOUCHED; both rows stay true. The meta
walker's row (`kind: "mutation"`, label `security/runIf migration renumber`) is proved by
the area-12 run above. B3c's walker's row (`kind: "rationale"`) describes A5 as planting a
four-digit prefix whose lexical and numeric orders disagree — still exactly what A5 does.

## ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot (owner's law: no deferred work)

1. **A security suite that is inert in every lane, and SS4 cannot see it.**
   `tests/security/customContentLockOrder.postgres.test.js` is the 1 skipped file in the
   whole `tests/security` run (`Test Files 1 skipped (1)` on its own): line 44,
   `const describeWithPostgres = ROOT_DATABASE_URL ? describe : describe.skip;`. That env
   var is unset in this lane, in the slot, and (to check) in CI — so the suite's lock-order
   claim is enforced NOWHERE while vitest exits 0. This is the exact silent-vacancy class
   SS4 exists for, in the one shape its own CANNOT-CATCH declares out of scope ("suites
   gated on non-migration artifacts"). Slot: either an SS4 sibling walker that reds when an
   env-gated security suite is inert in the gate's own environment, or a ruling that the
   suite is a manual drill and a marker saying so.
2. **`tests/security/clientErrorReports.pglite.test.js` gates three describes on
   `describe.skipIf(!exists)`** (lines 66, 99, 129). Those ran green here, so `exists` is
   true today — but the pattern is a second instance of class 1 and will vacate the same
   silent way if its artifact moves.
3. **The meta walker self-excludes by BASENAME** (`abs.endsWith('migrationRefIntegrity.meta.test.js')`)
   while `walk` recurses into subdirectories, so a future
   `tests/security/<subdir>/migrationRefIntegrity.meta.test.js` would also be skipped.
   Harmless today (no subdirectory, no second file), one line to tighten to a path compare.
   Not touched: it is outside the red and changing it earns no proof in this commit.
4. **The marker is now available estate-wide but documented only in the meta walker.** Any
   future `tests/security` fixture that spells a migration-shaped name needs it. Slot: one
   line in whichever brief or doc tells a lane how to write a security fixture.
5. **`tests/lint/negativeAssertionAnchor.walker.test.js`'s burn-down list is untouched and
   large** — the heaviest rows measured in its own prose are `tests/security/mapForkXssChain`
   (61), `tests/domain/worldSnapshotPublic` (24), `tests/edgeFunctions/contracts` (23). This
   commit adds no row and spends no ceiling; noted only so the chair knows the list was read
   and deliberately left alone.

## ONE DEVIATION FOR THE CHAIR TO VETO

`LANE-PARALLEL.md` §7 prescribes the trailer
`Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. This commit carries
`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` instead: this harness's own
attribution directive names Opus 5 and forbids adding attribution lines it leaves out,
and an Opus lane signing as Fable would misattribute the implementation besides. Say the
word and the chair can re-trailer at composition.
