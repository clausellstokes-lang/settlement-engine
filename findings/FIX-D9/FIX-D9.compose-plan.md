# FIX-D9 — the composition plan, READY. ⛔ THE SLOT HAS NOT BEEN TOUCHED.

**Waiting for:** the chair's message `the slot is yours` (FIX-P1's lane holds `$SP/slot-2`).
**Prepared at:** `Sun Sep 20 13:25:19 EDT 2026`, entirely READ-ONLY, from `$SP/lane-fix-d9`
against the shared object store (`git show <rev>:<path>`). No command touched slot-2's
working tree.

`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

## My three, in order

| # | sha | paths |
|---|---|---|
| 1 | `dbf3d09fe` | docs/DEAD_CODE_DISPOSITION.md + the three `dark-until` headers (4) |
| 2 | `3a5618ed8` | the retirement: 2 deletions + vite.config.js + customContentSchema.js + wiring-census.json (5) |
| 3 | `47197c30a` | the walker + its manifest row (2) |

## Conflict forecast — MEASURED at `5dd5e8e68`, not guessed

`6a3e8089f` (my base) **is an ancestor** of the slot tip, and both retired paths still exist
there, so the deletions apply.

| commit | file | tip state | forecast |
|---|---|---|---|
| 1 | all four | **UNCHANGED at tip** | **CLEAN** |
| 2 | `docs/content/wiring-census.json` | changed (EM-R0a) | ⛔ **CONFLICT — the one the chair named** |
| 2 | `vite.config.js` | changed (FIX-B2, +226 lines) but **my hunk's context is byte-identical** at tip lines 175-178 (`customCategories` / `magicFilter` / `foldTradeCategories` / `settlement.schema`) | **CLEAN** — FIX-B2's chunking change is elsewhere in the file |
| 2 | `customContentSchema.js`, both deletions | UNCHANGED | **CLEAN** |
| 3 | `scripts/mutation-coverage-manifest.json` | +13 lines / −0 at tip (three new rows elsewhere); my anchor `allianceWebRiskConsumers` intact, shifted 265 → 269 | **CLEAN** (4-line offset) |
| 3 | the walker (new file) | absent | **CLEAN** |

### The census resolution, arithmetic stated before the fact

| revision | `stamp.producerIndexFiles` |
|---|---|
| my base `6a3e8089f` | 1172 |
| my commit `3a5618ed8` | 1171 (base − 1, my one deleted `src/domain` file) |
| slot tip `5dd5e8e68` | **1173** (EM-R0a added one) |
| **correct composed** | **1172** (tip 1173 − 1) — matches the chair |

⛔ **Resolved by REGENERATING, never by hand.** The same door this lane used:
`node scripts/wiring-census.mjs --dry` (writes nothing) to quote the delta, then
`node scripts/wiring-census.mjs` to write. The expected `--dry` line is
`stamp.producerIndexFiles 1173 -> 1172`, with rows 0, shas none, leaves unmoved. If `--dry`
reports anything MORE than that single stamp delta, that is a finding: stop and report.

## The exact sequence, once released

```sh
cd "$SP/slot-2"
git status --short && git branch --show-current     # MUST be clean and ON the branch
git log -1 --oneline

git cherry-pick dbf3d09fe                            # expect clean

git cherry-pick 3a5618ed8                            # expect the census conflict only
node scripts/wiring-census.mjs --dry                 # quote the delta
node scripts/wiring-census.mjs                       # regenerate, never hand-edit
git diff -- docs/content/wiring-census.json          # expect exactly 1173 -> 1172
git commit -- src/domain/region/foldTradeCategories.js tests/domain/foldTradeCategories.test.js \
              vite.config.js src/domain/customContentSchema.js docs/content/wiring-census.json
                                                     # ⛔ never -a; keep the Opus trailer

git cherry-pick 47197c30a                            # expect clean
```

### Commit 4 — FIX-B2b, ruled by the chair (not scope creep; no deferred work exists)

⛔ **QUOTE THE LIVE ADDRESS FIRST, never carry 1138 on trust** — my vite.config.js hunk is
`1 insertion / 1 deletion` (verified by `--numstat`) and sits at line ~177, far above, so the
anchor should hold; but it is measured, not assumed:

```sh
grep -n "testTimeout" vite.config.js        # expect 1138 at the composed tip
```

Then re-address EXACTLY two citations, one token each, **line-neutral (+1/−1 per file),
nothing else in either file**:

| file | line | the text, verbatim at the tip |
|---|---|---|
| `tests/lint/siteCoherenceRatchet.test.js` | 69 | `` *  `testTimeout` at vite.config.js:912, and never an assertion on wall clock. */`` |
| `tests/scripts/implementationSession.test.js` | 187 | `` * reproduced. ⛔ The suite-wide `testTimeout` at vite.config.js:912 is NOT touched: raising`` |

```sh
git commit -- tests/lint/siteCoherenceRatchet.test.js tests/scripts/implementationSession.test.js
```

Subject, as the chair ruled it:
`FIX-B2b (by FIX-D9's lane at the composition): the two citers of vite.config.js:912 re-addressed to :1138 after FIX-B2's three moved testTimeout`

For EACH resolved commit, record both parent diffs and prove the file sets are equal:
`git diff <composed>^ <composed> --stat` and `git diff <original>^ <original> --stat`,
plus the resolved hunks quoted.

## The proof at the composed tip (SHARED tier, two exports inline, one directory per line)

```sh
npx eslint vite.config.js src/domain/customContentSchema.js \
           src/generators/density/densityAscension.js \
           src/generators/density/successionGrammar.js \
           src/generators/density/titularSuccession.js \
           tests/lint/deadCodeDisposition.walker.test.js
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/build
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/scripts
node scripts/wiring-census.mjs --check
shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json
```

- ⭐ **`tests/scripts` WHOLE IS OWED** — the chair's ruling corrects my earlier note. It is not
  owed for the walker (which lives in `tests/lint`); it is owed because **commit 4 edits
  `tests/scripts/implementationSession.test.js`**, and the lane law is that the directory of any
  test file you touch runs whole once before the commit.
- Only permitted red: the lighting walker. Record what it evaluated. **NEVER refreeze.**
- Goldens must equal `7177cd6e…8f1e` / `921c51cf…4b41`.

## ⛔ A FINDING THE CHAIR SHOULD SEE BEFORE I COMPOSE — the class has already fired

The chair slotted "a line-addressed citation into a config file rots on any insertion above it,
and the arm that would catch it is report-only" to **TOOL-15b / FIX-C2c** off this lane's
near-miss. **It is no longer hypothetical — it is live at the slot tip, from FIX-B2**, measured
by walking every commit between my base and the tip:

| commit | `testTimeout` |
|---|---|
| `05bd8d074` FIX-B2 (the four LOW anchored leaves) | 912 → **1040** |
| `bb1f15dd0` FIX-B2 (the MED pair) | 1040 → **1110** |
| `ede9b5300` FIX-B2 (the last two leaves + the owed build tests) | 1110 → **1138** |

**Both citers still say `vite.config.js:912` at `5dd5e8e68`** — `tests/lint/siteCoherenceRatchet.test.js:69`
and `tests/scripts/implementationSession.test.js:187` — so they are **stale by 226 lines**.

- It is **NOT mine**: my hunk is 1-for-1 line-neutral and leaves the anchor exactly where FIX-B2
  put it. The chair's "keep the cited lines line-neutral again" is satisfied by construction.
- It will **NOT red** the composed gate: the arm that sees it is `sourceCitationIntegrity`'s ARM 3,
  which is REPORT-ONLY, and `:912` is not past EOF (the file now has ≥1138 lines). So run 23 would
  not have caught it either.
- ⭐ **RULED: it is commit 4 of this composition** (`FIX-B2b`), because the chair assigns it and
  no deferred work exists. My "scope creep" reading is withdrawn — it was only creep while
  unassigned.

**⛔ AND THERE IS A THIRD, WHICH THE CHAIR'S TWO-FILE SCOPE DOES NOT COVER.** Sweeping every
`vite.config.js:<line>` citation in `tests/` at the tip returns THREE, not two:

`tests/data/dossierStateProseProjection.contract.test.js:1509` reads *"vite.config.js:877-878
routes `/src/data/` to `data-lazy` unless the module is in the EAGER set"*. Measured:

| revision | what is actually at `vite.config.js:877-878` |
|---|---|
| slot tip `5dd5e8e68` | `// product surface, but never by the entry's static source graph.` — unrelated prose |
| my base `6a3e8089f` | the `narrativeData.js` force-route, **not** the `/src/data/` → `data-lazy` rule |

So this one was **already imprecise before FIX-B2 and before this lane** — a different vintage of
the same class, and the live `data-lazy` rule is elsewhere in the file. **NOT folded into
commit 4**: the chair scoped that commit to "the two files", and widening a ruled scope by myself
is the thing I withdrew.

✓ **RULED AND CLOSED (the chair, 2026-09-20): it is TOOL-15b's**, written into that brief as its
second instance, to cure while TOOL-15b brings the asserted symbol arm to a zero baseline. The
slot exists, so nothing here is deferred. **Commit 4 stays two files** — this plan is unchanged
by the ruling, and the third citation is deliberately left untouched at the composition.
