# DEPLOY PRE-FLIGHT — `fixes-2026-09-18-consist` → `master` → production

**Lane:** Opus RECON DEPLOY-PREFLIGHT (read-only; nothing written outside this scratch, no git mutation, no migration, no CLI touching production).
**Stamp:** `2026-09-20 15:04:33 EDT` (from `date`), findings extended to 15:2x.
**Measured at:** read tip `ee204c827` · branch tip `e45c4738b` · `master` = `b9c494afe` · merge-base = `b9c494afe` exactly.

---

## VERDICT — **GO WITH CONDITIONS**

Ship it, and ship it in an order different from the one the owner's words imply. The branch carries the cure
for a live production data-loss defect, the first code that actually obeys the 2026-09-16 purchases-locked
order, and — decisively — the one-line CI change that unblocks the production deploy that has been stuck
since 2026-09-16. Nothing in the 521-commit delta is a reason to hold. But three measured facts re-order
the chain, and a fourth changes who is watching:

- **Production has not moved since July.** Master's CI run on `b9c494afe` was **cancelled**: every gate
  green except `Coverage floors (money / security)`, cut at its 45-minute cap, which skipped both
  `Deploy to production (gated)` and `Retrigger Vercel deploy (post-CI)`. This branch raises that cap to
  60. **This merge is the fix for the stuck deploy.**
- **The Vercel gate is fail-closed on migration drift.** `repoHead (203) > appliedHead (200)` ⇒ the build
  is skipped even with CI fully green. Merge-then-migrate produces a green PR and no deploy.
- **`origin`'s ledger branch is 215 commits stale**, and two suites in two *deploy-gating* CI jobs read
  that branch from origin by ref.
- **The repository is now PRIVATE** (it was public on deploy day), which almost certainly means master's
  branch-protection ruleset is no longer enforced.

### Conditions, numbered, in execution order

1. **Do not treat RUN 23 green as CI green.** `npm run check` is in pinned parity with CI's five `check-*`
   jobs *only*. Six jobs gate the deploy; five of them are outside the local chain. Pre-run the cheap ones,
   and pre-run **`npm run test:coverage:floors`** specifically — the world-locks removal cost two
   `saves.js`-covering test files a net 9 cases against a floor with ~5pt of buffer (§A-risk).
2. **Push the ledger branch FIRST, before the consist branch** — and expect its own CI run to go red, which
   is meaningless (§G-4).
3. **Consider one surgical ci.yml commit before pushing:** raise the `e2e` job's `timeout-minutes: 15`.
   The branch more than doubles the e2e suite inside an untouched 15-minute cap (§A-risk R1). This is the
   same failure mode that has blocked production for four days, one job over.
4. **Apply migrations 201–203 and bump `applied-head.json` to 203 BEFORE the commit that is supposed to
   deploy.** All three are safe to apply ahead of the client (§C).
5. **`supabase db push`, `supabase migration list` and `ops:post-deploy` all require production
   credentials — the owner's hand, not the chair's** (§C).
6. **Eight edge functions need a hand-redeploy**, from a clean checkout of the merged commit, not from the
   stale main working tree (§D).
7. **Refresh the PR body** — seven statements are stale, one materially so (§F). Close PR #48 before
   pushing the ledger; close #51/#52 after the merge.
8. **Tell the owner the repo went private** (§G-1) and give them the three owner-gated behaviour changes in
   §B-gated — especially that a rollback after this deploy is *destructive*, not neutral.

---

## A. CI, job by job

**Triggers (ci.yml):** `push: branches: ['**']` · `pull_request: [master, main]` · `workflow_dispatch` ·
`schedule: '0 6 * * 1'`. Every job below runs on **both** a branch push and a PR to master unless marked
weekly/manual. All jobs use `actions/setup-node@v4` with `node-version-file: '.nvmrc'`.

**Node pin — CONFIRMED.** `.nvmrc` is `22` at **both** `master` and the tip. Local is **`v24.12.0`**. So CI
runs Node 22 and RUN 23 runs Node 24. `tests/build/ciCheckParity.test.js:393` pins *"every setup-node use
reads the repository runtime pin"*, so this divergence is structural. **PLAUSIBLE:** nothing on this branch
is known node-version-sensitive; the 09-16 `verify:dist` boot-smoke red was diagnosed as Vite's
modulepreload polyfill under jsdom and explicitly *not* a Node-version effect.

**The local chain — CONFIRMED** (`package.json` `check`, read whole; 17 stages):
`validate:hazard-registry → premortem → packets → data → custom-content-manifest → migration-head → edge →
map → tuning-bands → foundry-module → mcp-server → typecheck:ratchet → typecheck:domain:strict → lint →
test:ratchet → build → verify:dist`.

### Covered by the local check

| CI job | Commands | Covered? |
|---|---|---|
| `check-validation` — Gate / validation | 11 `validate:*` | **Yes, except `npm audit`** |
| `check-types` — Gate / type ratchets | `typecheck:ratchet`, `typecheck:domain:strict` | Yes |
| `check-lint` — Gate / lint | `lint` | Yes |
| `check-tests` — Gate / test ratchet (45 min) | `test:ratchet` | **Yes, except the postgres service** |
| `check-build` — Gate / build and dist | `build`, `verify:dist` | Yes |
| `check` — "Validate, test, build" | aggregate; `if: always()`, requires all five `success` | n/a |

Parity is *enforced*, not assumed: `ciCheckParity.test.js:224/274/260/286` assert every local step runs
exactly once across the gate jobs, every gate step is in the local script, no job disarms a step it names,
and the aggregate cannot be skipped by a failed need. **CONFIRMED** by reading the test's `it` titles.

**Two real gaps inside the "covered" jobs:**

- **`npm audit --audit-level=high --omit=dev` is BLOCKING in `check-validation` (ci.yml:31) and is absent
  from the local chain. CONFIRMED.** It queries the live advisory database, so **this job can red with
  zero repository change**. Mitigating fact, and a strong one: **`package.json` and `package-lock.json` are
  byte-unchanged master..branch** (`git diff --stat` printed nothing), so any red would be a *new upstream
  advisory against dependencies production already ships* — a fact worth knowing either way.
- **`check-tests` runs a `postgres:17` service** (ci.yml:83–96). Exactly one suite consumes it:
  `tests/security/customContentLockOrder.postgres.test.js:42` —
  `const describeWithPostgres = ROOT_DATABASE_URL ? describe : describe.skip`. **So that suite is skipped
  in RUN 23 and executed in CI. CONFIRMED.** It is **unchanged** on the branch and loads only migrations
  183–188, none of which changed. Low risk, but a genuine CI-only execution surface.

### NOT covered — the five other deploy-gating jobs

`e2e` · `performance` · `coverage-floors` · `deno-tests` · `determinism-hostile-locale`. Each is in the
Vercel gate's required set (§E). Risks in §A-risk.

### Weekly/manual only — never report on a push

`mutation-sweep`, `religion-soak`, `generation-certification`, `world-soak` (all `if: github.event_name ==
'schedule' || 'workflow_dispatch'`), plus `.github/workflows/soak-research.yml`, whose triggers are
**CONFIRMED** to be exactly `schedule: cron '0 2 * * 6'` + `workflow_dispatch` — **no `push:`, no
`pull_request:` block, so it cannot report on this push at all.** **Note:** its last scheduled run
(2026-09-19, id `35427663417`) **FAILED**. It gates nothing, but it is the first red a reader of the
Actions tab will see during the deploy — pre-empt it in the owner's note.

### What the branch changes in CI itself — CONFIRMED

`git diff master fixes-2026-09-18-consist -- .github` = **one file, +7/−4**: `coverage-floors`
`timeout-minutes: 45 → 60`, commented *"…was cut at 45 on the master merge commit b9c494afe the same
afternoon… The Vercel build gate requires this job green, so a cap that cuts a passing run blocks the
production deploy."* **This is the most consequential line in the entire diff.**

### Secrets (names only)

`VERCEL_TOKEN` (job `deploy`), `VERCEL_DEPLOY_HOOK_URL` (job `redeploy`) — both opt-in, each job a logged
no-op when unset. No other job reads a repository secret (`grep 'secrets\.'` over the e2e/performance job
bodies returns nothing). `GITHUB_CI_STATUS_TOKEN` is a **Vercel-side** env var, not a GitHub secret (§E).

---

## A-risk. What could red the five uncovered jobs

### `e2e` — HIGHEST RISK ON THE BOARD

**R1 · Wall-clock against an untouched 15-minute cap. HIGH.**
**CONFIRMED:** e2e spec files **8 → 14**; top-level spec bytes **84,315 → 194,184 (2.30×)**; chromium-
executing tests **36 → ~73 (2.03×)**. Six specs added (`arrow-header`, `pinned-footer`,
`realm-herald-gate`, `visual-polish`, `phone-horizontal-overflow`, `landing-realm-capture`), one modified
(`regional-causality`, +4 lines seeding `worldState`). The job also pays `npm ci`, a **two-engine**
`playwright install --with-deps chromium webkit` (3–5 min), and boots both Vite dev servers **twice** (the
mobile step is a separate process). Individual costs: `realm-herald-gate.spec.js:179`
`test.setTimeout(120_000)` with a 90 s visibility wait at `:204`; `arrow-header.spec.js:234`
`test.setTimeout(60_000)` doing a real generation. `retries: 1` doubles any failure.
**CONFIRMED:** `e2e` is `timeout-minutes: 15` (ci.yml:226) and `performance` likewise (ci.yml:303) — the
commit that raised `coverage-floors` to 60 left both alone.

> **⭐ Cheapest de-risk available.** **CONFIRMED: no test pins the `e2e` job's timeout.** The only ci.yml
> timeout any test pins is `check-tests` at 45 (`ciCheckParity.test.js:390`). Raising ci.yml:226 from
> `15` to `25` therefore reds nothing. Blast radius is two files (`tests/build/ciCheckParity.test.js`,
> `tests/build/ciGateHardening.test.js` are the only readers of ci.yml), and it touches neither `src/`
> nor `tests/`, so the proof is a targeted `npx vitest run tests/build/ciCheckParity.test.js
> tests/build/ciGateHardening.test.js` — minutes, not a second RUN. Cost: it moves the tip, so RUN 23's
> exact-tip proof needs that one re-statement. **The chair's call; the precedent is in the same commit.**

**R2 · `mobile-pointer-targets` over a rewritten `/create`. MEDIUM-HIGH (PLAUSIBLE).** The mobile arm
asserts `toEqual([])` for sub-44px interactive elements at iPhone 13. The branch rewrote all three chrome
layers on `/create`. Nav and footer are explicitly floored (`ArrowHeader.jsx:100` `TOUCH_TARGET = 44`;
`LegalRibbonRow.jsx:116` `minHeight: isMobile ? 44 : undefined`). **The gauge station is the one control
with no `minHeight`** (`HomeHero.jsx:82-90`): computed ≈ **48.6 px**, clearing 44 by ~4.6 px **entirely on
font metrics**. A font-rendering difference on the runner is the failure mode.

**R3 · 37 never-CI-run sub-pixel geometry probes. MEDIUM (PLAUSIBLE).** All six new specs are correctly
project-gated, so nothing runs in the wrong engine — but macOS and ubuntu-latest Chromium rasterize
differently. Sharpest: `arrow-header.spec.js:262`
`expect(Math.abs(m.pinnedAt - m.headerBottom), 'the toolbar is pinned flush under the band').toBeLessThanOrEqual(1)`
— a 1-px tolerance is the classic cross-platform flake. `pinned-footer.spec.js` is 631 lines / 14 tests
with 14 `goto`s and 16 viewport changes.

**R4 · A source-text pin. LOW-MEDIUM (currently green, CONFIRMED).** `pinned-footer.spec.js:584-586` reads
`PipelineReveal.jsx` and throws unless it matches `/position: 'fixed', inset: 0, zIndex: (\d+)/`. Present at
the tip (`PipelineReveal.jsx:164`). Brittle to any reformat.

**REFUTED — the copy churn is not the risk. CONFIRMED.** 282 selector literals across all 15 specs were
extracted and grepped against the full 61,240-line `master→branch` diff of `src public index.html`:
`Anonymous settlement generator`, `Loading settlement view`, `New Draft`, `Save to Library`,
`Export Dossier`, `Advance Realm`, `Toggle the Realm Inspector` and the rest all show **ADDED=0 REMOVED=0**.
**The "Thorpe" change is real but inert:** `thorp: 'Thorp' → 'Thorpe'` in `TIER_LABELS` only; machine tokens
(`TIER_OPTIONS`/`SIZE_LADDER`) still `'thorp'`; **no e2e spec and no vacuity guard references it**; the one
spec regex naming it resolves against `WizardOutputToolbar.jsx:177`, which renders the raw lowercase token.
**The anti-vacuity guard pins no counts** — `check-e2e-not-vacuous.mjs:67` requires only `byProject[p] > 0`
and `:101` only `stats.expected > 0 && stats.unexpected === 0`, so **adding or removing a spec cannot red
it**. All six `data-testid`s, all nav routes and all three new module-level spec imports resolve.

### `performance`

**P1 · Runner-calibrated budgets vs a changed build graph. MEDIUM (PLAUSIBLE).**
`e2e/performance/generator-performance.spec.js:33-38` pins `appReadyMs 10_000, lcpMs 5_000,
interactionToPaintMs 500, cls 0.1` under `cpuSlowdown: 4`. **CONFIRMED: `vite.config.js` gains +240/−14
lines**, including a new `living-content-seam` manualChunk, and `/create`'s first paint is now an
image-painted header (`arrow-strip.webp`, 70,230 B). `cls: 0.1` is the tightest budget; the header does
reserve its box (`ArrowHeader.jsx:199 height: HEADER_H`), which is the right mitigation. Not settleable
statically. **P2:** `interactionToPaintMs: 500` against the new SVG-marker gauge, at 4× throttle. LOW-MED.

**REFUTED (CONFIRMED):** `productionAssetsLoaded` is safe — the `index.html` diff touches only favicon
links and two comments. The perf spec's own selectors all survive (`data-settlement-size` appears **zero**
times in the whole src diff). **`scripts/.size-baseline.json` is not a perf instrument** — its only readers
are `eslint.config.js:90` and `tests/lint/sizeBaseline.test.js:86`, i.e. the `check` job; its two moves are
lint-ratchet moves.

### `coverage-floors` — the second-highest risk

**Floors (CONFIRMED, `vite.config.js`, "measured − ~5pts" per its own comment):**
`checkoutReconcile.js` 83/78/61/83 · `creditLedger.js` 10/21/23/12 · `pendingDossier.js` 78/77/85/86 ·
**`saves.js` 68/68/75/79** · `stripe.js` 0/0/9/0 · `aiSlice.js` 42/39/35/46 · `creditsSlice.js` 11/0/7/11.
No global threshold.

**Six of seven are safe. CONFIRMED:** only `src/lib/stripe.js` changed (400 → 406 lines, +6/−0 — the
launch-gate throw); the other six are byte-identical line counts master vs branch. Of 330 changed and 7
deleted test files, **no deletion covers any floored module**. `checkoutReconcile`, `pendingDossier`,
`aiSlice`, `creditsSlice`: **zero covering tests changed**. `stripe.js`: 19 covering tests changed, all
coherent with the new gate, and its floor is already at rock bottom. `creditLedger.js`: its dedicated unit
test is untouched.

**⚠ `src/lib/saves.js` is the real risk. PLAUSIBLE-moderate.** Sixteen covering tests changed, and two lost
a **net 9 test cases** with no parameterisation to explain it: `tests/store/locksEngine.test.js` 13 → 11
blocks and `tests/components/npcRowLockToggle.test.jsx` 11 → 4 (CONFIRMED counts; CONFIRMED **zero** `.each(`
introduced; +289/−319 lines — a real rewrite). `saves.js` itself is unchanged at 873 lines, so if those
removed "locks" assertions were the only exercise of some `saves.js` branch, the percentage drops against a
floor with only ~5–6pt buffer. This is plausible cause, not measured effect — **coverage was not run**
(forbidden in this lane). **The world-locks removal (§B-gated-3) is the likely reason those tests shrank,
which makes the coupling concrete rather than hypothetical. Run `npm run test:coverage:floors` locally
before trusting this job.**

### `deno-tests` — LOW

`deno.json` tasks (CONFIRMED, quoted): `"check:edge": "deno check --frozen
supabase/functions/_shared/requestMeta.ts supabase/functions/**/index.ts supabase/functions/**/refundPolicy.ts"`
and `"test:edge": "deno test --allow-env --allow-net --no-check --frozen supabase/functions/"`.
**No `index.ts`, no `deno.json`, no `deno.lock` changed.** The generator is
`scripts/build-edge-shared.mjs`; `sourceHash` is `sha256(inputPath+":"+content over every esbuild-resolved
input).slice(0,16)`, and the bundle embeds it as a `Source hash: <hex>` banner. **Verified for
`aiCharterBundle`: meta `ed6ba60e6fb9d5ba` == the banner in the branch-tip `.js`. CONFIRMED.** All five
metas' `generatedAt` cluster within 245 ms of one commanded run.

**Important mechanism note:** neither `validate:edge` nor `check:edge` would catch a *staleness* mismatch —
`scripts/validate-edge-functions.mjs` only walks `.ts` files and never opens the `_shared/*.js` bundles.
The actual freshness gate is `tests/edgeFunctions/*.freshness.test.js` (one per bundle; each live-recomputes
the sha256 and asserts equality to `meta.sourceHash`), which lives under `tests/` and therefore runs inside
**`check-tests` — so RUN 23 covers bundle freshness.** That independently corroborates my 144-path
measurement in §D. Deno is installed locally, so this job is fully pre-runnable.

### `determinism-hostile-locale` — LOW

**None of the eight named test files changed master..branch. CONFIRMED (empty diff).**
`localeFormatGuard` bans `toLocaleString/toLocaleDateString/toLocaleTimeString/Intl.` outright in
`src/generators, src/domain, src/workers, src/kernel`, and bans only the **bare** (locale-less) form in
`src/components, src/pdf`. `localeCompareGuard` bans `.localeCompare(` in `src/generators, src/domain,
src/workers, src/kernel, src/pdf, src/lib/instantWorld` — **`src/components` is not in its scope at all.**

**Grep of every ADDED line. CONFIRMED:** `src/components` adds six hits, all benign — three
`.toLocaleString('en-US')` with an explicit locale (sanctioned) in the three admin panels, and three
`.localeCompare(` in `SummaryTab.jsx:396`, `OverviewTab.jsx:709`, `ServicesTab.jsx:53`, none of which is in
that guard's scanned trees. Across `src/domain + src/generators + src/pdf + src/kernel + src/workers`
(121 files, +5,355/−918 — this branch changed real generator code, not just UI): **zero hits of any banned
API.** Still the best value-per-minute pre-run, because the branch carries nine declared same-seed shifts
(§B) and `tests/fixtures/generator-golden-master.json` (**525** configs, CONFIRMED) had all 525 rows
rewritten.

*(Minor stale comment noted: ci.yml:436 calls it "the 155-config manifest"; the manifest actually pins 525.
Cosmetic, but this file has a documented history of stale figures in comments.)*

### Recommended pre-runs after RUN 23 — exact commands as CI spells them

`CI=1` is **mandatory**; without it you get `workers: 2`, `retries: 0`, `reuseExistingServer: true` — a
different suite.

```bash
# cheapest first — the CI-only blocking step the local chain omits
npm audit --audit-level=high --omit=dev

# determinism-hostile-locale (seconds; highest value per minute)
LANG=tr_TR.UTF-8 LC_ALL=tr_TR.UTF-8 TZ=Pacific/Chatham npx vitest run \
  tests/property/generatorGoldenMaster.test.js tests/pdf/goldenViewModel.test.js \
  tests/domain/determinismLeaks.test.js tests/generators/customContentDeterminism.test.js \
  tests/domain/formatNumber.test.js tests/kernel/rngContextFailClosed.test.js \
  tests/lint/localeFormatGuard.test.js tests/lint/localeCompareGuard.test.js

# deno-tests (deno IS installed: /opt/homebrew/bin/deno)
deno task check:edge && deno task test:edge      # or: npm run check:edge-behavior

# e2e  ⚠ webkit is NOT in the local Playwright cache — install it first
npx playwright install chromium webkit           # drop --with-deps (Linux/apt only; no-op on macOS)
CI=1 node scripts/check-e2e-not-vacuous.mjs --projects chromium
CI=1 PLAYWRIGHT_JSON_OUTPUT_NAME=playwright-chromium.json /usr/bin/time -p \
  npx playwright test --project=chromium --reporter=github,json
CI=1 node scripts/check-e2e-not-vacuous.mjs --results playwright-chromium.json
CI=1 node scripts/check-e2e-not-vacuous.mjs --projects mobile-safari
CI=1 PLAYWRIGHT_JSON_OUTPUT_NAME=playwright-mobile.json /usr/bin/time -p \
  npx playwright test e2e/mobile-pointer-targets.spec.js --project=mobile-safari --reporter=github,json
CI=1 node scripts/check-e2e-not-vacuous.mjs --results playwright-mobile.json

# performance
npm run build -- --mode e2e
CI=1 node scripts/check-e2e-not-vacuous.mjs --config playwright.perf.config.js \
  --projects performance-chromium,performance-mobile-chromium
CI=1 PLAYWRIGHT_JSON_OUTPUT_NAME=playwright-performance.json \
  SF_PERFORMANCE_RECEIPT=artifacts/performance/browser-synthetic.json \
  npx playwright test --config playwright.perf.config.js --reporter=github,json

# coverage-floors (41–43 min under v8 coverage)
npm run test:coverage:floors
```

⚠ **`ls ~/Library/Caches/ms-playwright` shows `chromium-1243`, `chromium_headless_shell`, `firefox-1522` —
and NO webkit. CONFIRMED.** The `mobile-safari` arm will fail locally until webkit is installed; that is the
exact bug ci.yml:238–245 documents.

**Cannot be reproduced locally, with reasons:**
1. **The perf budgets** — calibrated for a shared ubuntu-latest runner at 4× CPU throttle. Apple Silicon
   clears them with room to spare, so a local green does **not** predict P1/P2.
2. **R3's sub-pixel deltas** — macOS Chromium is a different rasterizer; `arrow-header.spec.js:262`'s 1-px
   tolerance is precisely what a local run cannot clear on CI's behalf.
3. **The 15-minute job cap** — no local equivalent; measure with `/usr/bin/time -p` and compare.
4. **The Node 22 runner environment**, the **origin** ledger fetch, and the **GitHub Checks API** state the
   Vercel gate reads.
5. **The postgres arm** of `check-tests` without standing up `postgres:17` locally.

### Live state of RUN 23 (read-only observation)

`scratchpad/consist-check-2-run23.log`: stages 1–15 **entered and passed** — all eleven `validate:*`
(including `validate:migration-head`), both typechecks, `lint` — and it is now inside `test:ratchet`.
**The mutex was acquired honestly:** *"gate-mutex: acquired atomic lock … after 0 atomic poll(s) + 0 legacy
poll(s) + 0 shared-drain poll(s)"* — so this is **not** a hollow 40-poll false-green run. `build` and
`verify:dist` still to come after the ratchet.

---

## B. The branch's delta since master

**Commits: 521** (`git rev-list --count master..fixes-2026-09-18-consist`). Merge-base is `b9c494afe`
exactly — a clean fast-forwardable lineage. **Files changed: 1,090. All CONFIRMED.**

| Area | Files | Area | Files |
|---|---:|---|---:|
| `src/components` | 414 | `src/data` | 11 |
| `tests` (all) | 330 | `supabase/functions` | 8 |
| `docs` (all) | 81 | `e2e` | 7 |
| `src/domain` | 72 | `src/copy` | 5 |
| `scripts` | 31 | `root config` | 5 |
| `src/pdf` | 28 | `supabase/migrations` | 3 |
| `src/generators` | 21 | `api` | 1 |
| `public` | 20 | `.github` | 1 |
| `src/lib` | 17 | `src/store` | 14 |

Root config: `.gitattributes`, `.gitignore`, `ARCHITECTURE.md`, `index.html`, `vite.config.js` (+240/−14).
**`package.json`, `package-lock.json`, `vercel.json` and `.nvmrc` are all UNCHANGED. CONFIRMED.**

### The programs, in plain language

1. **The 09-18/19 site review — "impliment every fix."** The bulk of the 414 component files. Dossier and
   Realm polish, the painted arrow header, the pinned footer, the phone front, charts and the food-deficit
   arithmetic, onboarding and dialogs, name lists in columns, unclamped text, content-leak cures, the
   landing rebuilt around a regenerated Cnocby, tier stock paintings.
2. **The data-loss cure** — `19c4cb853` (EM-B1k) plus `e96a1c33e` (EM-B1k2). See §B-gated.
3. **The Edit-Mode train's headless packets** — 12 code landings, **none reachable as editor surface**
   (§B-gated). Includes migrations 202 and 203.
4. **Tooling, gates, registers** — TOOL-*, LIGHTING refreezes, FIX-*, CURE-*, DOC-*: ratchet baselines,
   citation walkers, the dead-code disposition, the lint registers. This is most of the 330 test files and
   the 31 scripts.
5. **Ledger/doc-only** — the 81 docs files, including `DEPLOY.md`'s new head line and preview-persona
   section, and nine shift records.

### Deliberate output shifts — the doctrine item

**CONFIRMED: nine signed shift records added** under `docs/shift-records/`, and
`docs/GOLDEN_SHIFT_LEDGER.md` gains **25 lines (2,286 → 2,311)**. *(A sub-lane reported master at 848 lines
and a +1,463 growth; I re-measured on the discrepancy — `git show master:docs/GOLDEN_SHIFT_LEDGER.md | wc -l`
= **2,286**, branch = **2,311**, and `git diff --stat` = **25 insertions**. The sub-lane's figure was a bad
read; **+25 is correct.** For reference the *ledger branch's* copy has 2,360 lines — a different, diverged
file, which may be what it caught.)* The nine records:

```
2026-09-17-dossier-contradictions      2026-09-19-layout-sacred-house
2026-09-18-content-coherence           2026-09-19-parish-church-text
2026-09-18-pressure-sentence-agreement 2026-09-19-preset-lighting-witness
2026-09-19-food-balance-arithmetic     2026-09-19-religious-quarter-text
                                       2026-09-20-cure-j-provenance
```

Each carries the owner's own words and re-records the 525-row generator golden master.
**Say this to the owner plainly: a seed generated on production today will not reproduce byte-identically
after this deploy.** Every shift is individually owner-worded and recorded; the *aggregate* has never been
stated in one place, and it brushes THE PROMISE. **PLAUSIBLE:** an already-saved settlement keeps its
stored record, but dossier prose is selected at render, so an existing saved dossier can read differently
after the deploy.

### B-gated. What the owner must actually decide

**1. ⭐ The purchases lock is not in production today; this merge is what first obeys the 09-16 order.**
**CONFIRMED, independently re-verified:** `git ls-tree master -- src/lib/launchGate.js` returns **empty**;
`VITE_PURCHASES_OPEN` has **zero hits** anywhere on `master`. Production's buy buttons are gated only on
`disabled={loading || !isConfigured}` (`master:src/components/PurchaseModal.jsx:222`). At the tip,
`src/lib/launchGate.js:32-33` reads `return Boolean(flags) && flags?.VITE_PURCHASES_OPEN === 'true'` —
**LOCKED** (the variable is set nowhere in `vercel.json`, `.github`, `vite.config.js`, `.env.example` or
`scripts`), and `src/lib/stripe.js:126-128` throws **first**, before the `isConfigured` check, on all six
checkout call sites. `startCustomerPortal` stays deliberately ungated so existing subscribers can cancel.
**The owner should know the site has been able to take money since 09-16, and that the fix ships with this
merge rather than before it.**

**2. ⭐ The data-loss cure stops the bleeding, heals nothing already lost, and a rollback re-opens the
defect.** **CONFIRMED:** `19c4cb853` touches exactly one source file — `src/domain/worldPulse/pulseKernel.js`,
2 changed lines — plus 416 lines of new tests. `src/store/campaignPulseHelpers.js` has **zero diff**; its
line 197 landing statement is untouched. Only the *content* of `update.settlement.npcs` differs: the
off-stage people are back in it.
- **Shape: unchanged.** `SCHEMA_VERSION = 1` on **both** refs; `settlement.schema.js` and
  `settlementMigrations.js` both **unchanged**; `src/lib/saves.js` byte-identical. **CONFIRMED.**
- **Forward compat:** an old save from the broken client loads fine — but **does not heal**. The commit's
  own deferral list says *"Damaged saves already hold dangling relationship edges; no repair is built."*
  If the owner expects the deploy to restore lost NPCs, **it will not.**
- **Backward compat / rollback:** a new-client save loads under the old client — but the old client
  rebuilds its write base from the filtered participation view (`worldSnapshot.js:127-129`, unchanged), so
  **one committed tick after a rollback re-erases every person the cure had protected.** *(PLAUSIBLE —
  reasoned from unchanged code, not executed.)* **Rolling this back is destructive, not neutral. That
  asymmetry is the sharpest operational fact in this report.**

**3. Capability changes in both directions.** New and user-visible: Roadmap and Practical Guide finally get
in-app doors; tier stock paintings become the default share/unfurl image; new printed material in the paid
PDF (`StateProse`, `brandSeal` on the Cover); a stale-deploy auto-reload that can reload a user's tab; a
refusal-notice system with three new pages. **Removed:** world locks entirely (`LockControls.jsx` **deleted
— CONFIRMED**, commit `8a03a61a3`; *"A coup in a save that had locked its incumbent now falls without an
approval queue"* — **this changes behaviour for existing production saves**); Compendium Map Lenses and
Facets pages; the dossier Export-Image control; Realm refused on phones; Herald withheld until first
advance. **Narrowed for anonymous visitors:** `minTier: 'hamlet'` (master's `isTierAllowed` was a ceiling
only, so anon could pick a thorp) and `preGenOptions: false` (master's `LayeredConfigurationPanel` had **no
tier gate at all**) — both owner-worded, both narrowing the top of the funnel.

**4. A new persisted key on users' devices: `anonDraft`** (`src/store/persistProjection.js:283`). Master's
projection has eight keys and no `anonDraft`. An anonymous visitor's dossier (up to ~217 KB) is now written
to their browser and restored on boot. Storage key and persist version are unchanged, so both directions
are compatible. It **repairs a false promise** — master's copy said *"Your first dossier is yours to keep"*
and a refresh took it. Informational, but it is new data on a user's device.

**5. Security posture — one genuine loosening, server-side and unapplied.** Strong negatives first, all
**CONFIRMED**: `vercel.json` is the **same blob** on both refs (CSP, HSTS, all headers untouched);
`api/csp-report.js` same blob; `index.html` has zero CSP occurrences on either ref; **zero `service_role`
hits in `src/` or `api/`**; no new table, no `USING (true)`, no grant to `anon`/`public`, no new edge
function, no CORS/auth/rate-limit change, no deleted security test. The one loosening is **migration 201**
(§C) — and it is inert until the owner applies it. A new **DEV-only** admin-persona seam exists
(`authSlice.js:162`, guarded on `import.meta.env.DEV && MODE !== 'test' && VITE_PREVIEW_ROLE`, seating only
`role`; no JWT is minted, so every server gate refuses it) and `tests/build/previewPersonaAbsent.test.js`
scans the emitted `dist/` for the string under `VERIFY_DIST=1` in CI.

**6. Edit Mode is dark — for the best reason: the editor does not exist. CONFIRMED.** There is no
`VITE_EDIT_MODE` anywhere (zero hits). Of the 16 modules `docs/ARCH_EDIT_MODE_AND_DECREES.md` names, **all
16 are absent** — no `editSlice.js`, no `src/components/edit/`, no route. Two new modules are inert
(`src/domain/edit/recordRegister.js`, `src/domain/generation/generationForkRegistry.js`); the only `src/`
mention of `recordRegister` is its own header comment, and nothing imports it. Three landings are pure
**denials that ship** (`publicSafe.js:294-295`, `worldSnapshotPublic.js:92-93`, migrations 202/203).
`recordRegister.js:59` states the contract:
`export const NOT_YET_WRITTEN_KEYS = Object.freeze(['dmLayer', 'decrees', 'crossSettlementConflicts']);`
Do not confuse this with two shipped, unrelated things that share the words: the long-shipped dossier
`editMode` boolean (`settlementSlice.js:806`, the Cartographer "Edit Dossier" button) and the shipped
`decreeTracker` ("Your decrees", `AdvanceReport.jsx:333`) — **both unchanged**.
⚠ **Two forward hazards worth a ruling before EM-D0/EM-C4a, neither blocking this deploy:** `TIER_GATE.premium.editMode`,
the gate both docs name, **does not exist as a symbol** (EM-D0 must create it, not consume it); and the ARCH
spec's new state key `editMode` (an object) **collides by name** with the shipped boolean — if `editSlice.js`
lands unrenamed, the live Cartographer button becomes the unshipped editor's door. No test guards this today.

---

## C. Migrations 201, 202, 203

All three read whole. **All three are `create or replace function` and nothing else** — no table DDL, no
data rewrite, no drop, no policy change, no new grant (201 re-asserts its existing revoke/grant).

| | **201** | **202** | **203** |
|---|---|---|---|
| Purpose | Staff (`developer`/`admin`) hold the Surveyor entitlement, so the client stops showing a door the server answers 403 on. | The gallery world-snapshot scanner refuses the editor's two save keys `dmLayer`, `decrees`. | The same scanner finally refuses three DM-truth ledgers the client already denied. |
| Statements | 1 `create or replace function`; `revoke all … from public`; `grant execute … to authenticated`; `comment on` | 1 `create or replace function` | 1 `create or replace function` |
| Class | function redefinition + idempotent re-grant | function redefinition (additive denylist) | function redefinition (additive denylist) |
| Re-runnable | **Yes** — "Re-runnable." | **Yes** — "the denylist only ever GROWS." | **Yes** — same |
| Rollback | `@rollback:` — recreate 139's body without the `or public.current_user_is_privileged()` disjunct. No `.down.sql`. | `@rollback:` — recreate 136's body without the two members + one alternative. *"Nothing is destroyed on reversal."* | `@rollback:` — recreate 202's body without the three members. *"Nothing is destroyed on reversal."* |
| Depends on | 018, 139 | 136, 089, 091 | 202, 089, 091, 148 |

**202 and 203 replace the same function**; 203 is a full recreate built from 202, so the order is correct
and 203 alone would carry 202's members. Set-compared: 136 → 202 adds 2 removes 0; 202 → 203 adds 3
removes 0. **CONFIRMED — they only ever refuse more.** `create or replace` re-points `publish_map` (089),
the saved_maps guard (091) and the campaign-tiles RPC (148) with no signature change and no re-grant.

**201 is the one genuine loosening.** One line (`:96`): `if public.current_user_is_privileged() then return
true; end if;`. Blast radius: nine AI edge functions plus `surveyor_byok_set` — the **provider-key write
door**. Mitigations verified: `current_user_is_privileged()` reads `profiles.role` only (the email backdoor
was dropped in 101), the role is not self-writable (018's UPDATE policy + 061), anonymous callers are
refused at the first line, grants unchanged from 139. Owner-ordered verbatim (§934.28, *"for right now"*).
**Owner must see this.**

**203 names a gap that is open in production right now**, in its own words: *"this scanner's new refusals
are inert: the gap this migration closes is OPEN IN PRODUCTION."* `factionPairStates`, `envoyErrands`,
`concludedWars` are refused client-side but accepted server-side today. Defense-in-depth, not an active
leak — but it is a real open finding (ODQ §934.55) and an argument for running the migrations rather than
deferring them.

### Order of operations — the load-bearing answer

**All three are safe to apply BEFORE the new client ships.**

- **201 is order-independent.** With the OLD client live, the client's `isSurveyorTier` *already* admits
  `admin`/`developer` — that is the defect being cured — so applying 201 first simply makes the server
  agree with what production already shows. Not applied when the new client ships ⇒ staff see the door and
  get 403, exactly today's state.
- **202 states the rule itself:** *"THIS IS MIRROR THREE, AND IT LANDS FIRST… the server may refuse a key
  before a client token for it exists, but never after — landing the SQL first is the only safe order."*
- **203** the same posture.
- **Reverse direction is harmless for all three:** 202/203 only widen a refusal on keys no shipped client
  writes (Edit Mode is dark); 201 only widens an entitlement for staff.
- **The merge itself is safe without the migrations. CONFIRMED:** no new client code calls any RPC or edge
  function added by 201–203 (`git diff … -- src | grep '^+.*\.rpc(\|functions\.invoke('` returns empty).

**But the Vercel gate forces the order regardless** (§E): `repoHead (203) > appliedHead (200)` ⇒ skip.
**Sequence: apply migrations → bump `applied-head.json` to 203 → that commit merges → CI green → deploy
proceeds.** `ops:post-deploy` independently requires *contiguous migration history through the repo head*,
so it too will fail until 201–203 are applied — a second, independent reason.

### The applied-head ledger and its machinery

**CONFIRMED:** `supabase/applied-head.json` is **byte-identical at `master` and the tip** — both
`"appliedHead": 200, "appliedAt": "2026-09-16"`, with a `verification` field naming project
`uhozyhcdccbhigvlacdu`. Its own `note`: *"Bump this in the SAME commit/PR as the `supabase db push` that
applies new migrations."*

`validate:migration-head` = `scripts/check-migration-head.mjs`, two modes: (1) always — migration files
must be contiguously numbered and duplicate-free, **a gap fails `npm run check`**; (2) optional — if
`SUPABASE_MIGRATION_HEAD` is exported, compare to the repo head and **exit non-zero on drift**.
`classifyAppliedHead` returns `pending` when `applied < head` — *"visible, not fatal."* **RUN 23 has
already passed this stage. Expected, not a red.**

**Registrations — verified present at the tip:**
- `docs/DEPLOY.md:198` reads **`Current migration head: 203_gallery_scanner_client_mirror_totality.sql`** —
  pinned by `tests/docs/deployRunbookFreshness.test.js`.
- `tests/ops/migrationRehearsal.test.js:402` asserts `scanner.owner === '203_…sql'`. **This is the gate that
  bites at the terminal** (a throwing `beforeAll` collects zero tests and the ratchet's scope sentinel
  refuses the run) — and it is inside `test:ratchet`, so **RUN 23 covers it**.
- `tests/security/staffUnlockSurveyorEntitlement.pglite.test.js:30` loads 201;
  `tests/security/galleryScannerMirrorTotality.test.js:196-197` diffs 202 against 203 mechanically.
- `npm run ops:migrations:rehearse` is the reviewed-wave plan; a clone-rehearsal receipt is **required
  release evidence** and *"any drift after that receipt invalidates it."*

### The runbook's exact commands, and who must type them

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push          # applies EVERY pending migration, in order
npx supabase migration list   # "applied vs pending — the authority"
npx supabase db diff          # empty diff = remote schema matches the tree
```
**⛔ Production credentials + an interactive login → THE OWNER'S HAND.** The `supabase` CLI is not even
installed locally (`which supabase` → not found).

```bash
POST_DEPLOY_DATABASE_URL='…' SF_PRODUCTION_DATABASE_HOST='…' SUPABASE_URL='…' \
SUPABASE_SERVICE_ROLE_KEY='…' \
npm run ops:post-deploy -- --health 'edge=https://<ref>.functions.supabase.co/health?deep=1' \
  --receipt /secure/release/post-deploy.json
```
**⛔ Requires a read-only production DB URL and the SERVICE ROLE KEY → THE OWNER'S HAND.**

```bash
SUPABASE_MIGRATION_HEAD=<live head number> npm run validate:migration-head
```
✅ **This one needs a *number*, not a credential** — the owner reads it from `migration list` and hands it
over; the chair can then run the check itself.

**Owner-hand steps, complete list:** `supabase login` · `link` · `db push` · `migration list` / `db diff` ·
`npm run ops:post-deploy` · `npx supabase functions deploy <name>` (§D) · the Vercel dashboard Redeploy,
if the hook secret stays unset.

---

## D. Edge functions and other deployables

**Changed since master — CONFIRMED:** eight files, all under `supabase/functions/_shared`, +49/−37.

- **Three bundles changed in substance** — `aiCharterBundle.js`, `aiGroundingBundle.js`,
  `aiOutputSchemaBundle.js`, each with its `.meta.json` `sourceHash` moving (e.g. `aiGroundingBundle`
  `7f6db544ccb813f0 → 9788abb8fdb7287e`).
- **Two `.meta.json` changed with NO `.js` change** — `analyticsEventsBundle`, `intentAtlasBundle` — and
  **their `sourceHash` is unchanged** (`0a6ba64ce0b8d5e2`, `9136e063f280d77f`); **only `generatedAt` moved**.
  That is the signature of a clean `build:edge-shared` re-stamp that reproduced those two byte-for-byte.
  Benign.

**⭐ Bundle freshness at the tip — CONFIRMED FRESH.** Regenerated by CURE-K `714de0f60` (*"the edge-shared
bundles regenerated at the first composition's tip… run 22's four freshness/reproducibility reds"*). I
extracted the union of every declared `inputs` + `entry` path from all five `.meta.json` — **144 paths** —
and ran `git diff --stat 714de0f60 fixes-2026-09-18-consist -- <all 144>`: **it printed nothing.** None of
the 23 commits after CURE-K touched a declared bundle input. **No `build:edge-shared` is owed.**

**Which functions must be redeployed by hand — CONFIRMED by import trace:**

| Changed bundle | Functions reaching it |
|---|---|
| `aiGroundingBundle.js` | `generate-narrative` |
| `aiCharterBundle.js` | `custom-content`, `interpret-session`, `surveyor-autonomy`; via `_shared/constructCore.ts` → `construct-realm`, `construct-settlement`, `surveyor-byok` |
| `aiOutputSchemaBundle.js` | via `_shared/aiOutputTool.ts` → `custom-content`, `interpret-session`, `surveyor-autonomy`, `construct-realm`, `construct-settlement`; via `ai-analyst/modelResolver.ts` → `ai-analyst` |

**Union: 8 of the 32 functions** — `generate-narrative`, `custom-content`, `interpret-session`,
`surveyor-autonomy`, `construct-realm`, `construct-settlement`, `surveyor-byok`, `ai-analyst`.

**Required by the new client?** No. All eight are AI-layer functions behind `has_surveyor_entitlement()`;
with purchases locked and no entitlements sold they are reachable only by staff, and only once 201 is
applied. **No ordinary user's path breaks if they are not redeployed** — but the first staff test of the AI
layer after 201 would hit a stale bundle, which is literally a row in DEPLOY.md's breakage table:
*"AI narrative streams 'Invalid JSON' repeatedly | Stale aiGroundingBundle | `npm run build:edge-shared` +
redeploy."* **PLAUSIBLE: low user impact, high confusion risk during the owner's own post-deploy testing.**

**⚠ The runbook's own warning, quoted:** *"Edge functions are the one UNGATED path to production — deploy
them by hand, deliberately… they ship via a bare `npx supabase functions deploy` straight from whatever
your local working tree contains. Nothing checks that CI is green, nothing checks the tree is clean, and —
unlike the migration ledger — nothing records which commit's functions are live."* **The chair's main
checkout's working tree is stale, so an edge deploy from it would ship the wrong bytes. Deploy only from a
clean checkout of the merged commit.**

**`api/**` — one file changed:** `api/_galleryMeta.js`. It imports `src/domain/display/tierStockImage.js`
and changes the OG share-card fallback chain (owner's image → tier stock painting → house card), so a
shared settlement no longer unfurls as the house logo (owner order §934.32). Ships with Vercel, not
separately. The other five `api/` files are unchanged and **all present at the tip**, so `vercel.json`'s
rewrite to `/api/meta-shell` and `ops:post-deploy`'s `/api/release` probe both still resolve. **CONFIRMED.**

---

## E. Vercel / CI deploy mechanics — what actually makes production update

Two composed paths, both `master`-only and `push`-only, both `needs: [check, e2e, performance, deno-tests,
coverage-floors, determinism-hostile-locale]`:

1. **`deploy`** — `npx vercel deploy --prod --token "$VERCEL_TOKEN" --yes`, **only if `VERCEL_TOKEN` is
   set**; otherwise logs and exits green.
2. **`redeploy`** — POSTs `$VERCEL_DEPLOY_HOOK_URL`, **only if that secret is set**; otherwise logs green.

**⭐ On the last master run both were `skipped`. CONFIRMED** (`gh run view 35127725833 --json jobs`):

```
success    Gate / test ratchet          success    Gate / type ratchets
cancelled  Coverage floors (money / security)      success    Production-build browser performance
success    Gate / validation            success    Edge function execution tests (Deno)
success    Gate / build and dist        success    Golden master under tr_TR + Chatham TZ
success    Chromium end-to-end          success    Gate / lint
success    Validate, test, build
skipped    Retrigger Vercel deploy (post-CI)
skipped    Deploy to production (gated)
```

**Every gate passed except `Coverage floors`, cut at its 45-minute cap — and that single cancellation
skipped both deploy jobs.** `gh run list --branch master` shows **no CI run on master since 2026-09-16**.
Memory records the consequence: *"Production still serves the July client (`index-B1anFfJe.js`)."*
**PLAUSIBLE (strongly evidenced): production is still on the July build, so the delta the owner is actually
shipping is larger than `master..branch`.**

**The third gate, inside the repo.** `vercel.json` sets `"ignoreCommand": "node
scripts/vercel-ignore-build.mjs"`. Vercel reads the exit code **inverted**: `exit 0` = skip, `exit 1` =
build. The script is fail-closed in five ways — missing token, non-2xx from GitHub, network error, a
**crash** (`runGate` catches every throw and returns skip, because Node's default exit 1 would otherwise
*invert* the gate into fail-open), and a CLI `vercel deploy --prod` without git metadata. `REQUIRED_CHECKS`
is exactly the six job names in the `deploy` job's `needs:`, and `tests/build/ciGateHardening.test.js` pins
the list against ci.yml so a renamed job cannot leave the gate waiting forever.

**⛔ The migration-currency clause — the finding that orders the whole chain:**

```js
if (repoHead != null && appliedHead != null && repoHead > appliedHead) {
  if (env.VERCEL_ALLOW_MIGRATION_DRIFT === '1') { /* proceed loudly */ }
  return { action: 'skip', reason: `CI green, but prod is at migration ${appliedHead} while the repo head
    is ${repoHead} — run \`supabase db push\` and bump supabase/applied-head.json before deploying
    (or set VERCEL_ALLOW_MIGRATION_DRIFT=1 for a deliberate schema-free deploy)` };
}
```

At the tip that is `203 > 200`. **A merge to master with CI fully green will still be skipped by Vercel.**
`ciGateHardening.test.js:204` pins the behaviour verbatim.

**Is the gate armed?** Yes. Deploy-day evidence records the observed behaviour: *"Vercel's automatic build
was 'Canceled by Ignored Build Step' by design (six green checks on the built commit, appliedHead ≥
repoHead, `GITHUB_CI_STATUS_TOKEN` set)."* So the token is configured in Vercel and the gate works. (I did
not and cannot read Vercel's env.)

**What the owner must click.** If `VERCEL_DEPLOY_HOOK_URL` and `VERCEL_TOKEN` are both still unset — which
the 09-16 evidence implies — then after the merge: CI runs (~50–60 min), both deploy jobs no-op, and **a
human presses Redeploy in the Vercel dashboard on the merge commit**. The `ignoreCommand` then re-evaluates
with CI green and, provided `appliedHead == 203`, proceeds. Setting either secret once would automate this
permanently — a settings change, therefore the owner's.

---

## F. The PR body — seven stale statements

From `chair-kit-923472dc/PR-BODY.md`:

1. **"325 cars off the product tip `arrow-header-2026-09-16` (fe021a487)"** — **STALE, CONFIRMED**:
   `git rev-list --count fe021a487..fixes-2026-09-18-consist` = **488**. (`master..branch` = **521**.)
2. **"Check 2 (run 12, bare): RUN12_VERDICT"** — stale; RUN 23 is the current gate.
3. **"Browser pass 3: walked… on `8b277979e`"** — stale tip; the branch is `e45c4738b`.
4. **⭐ "The owner's hand, after merge. Migration 201 (`supabase db push` + the applied-head bump)"** —
   **STALE AND MATERIALLY WRONG.** It is now **201, 202 and 203**, and per §E the bump is not merely "after
   merge" — it **gates the deploy**. This sentence, left as-is, would mislead the owner into the exact
   ordering that produces a green PR and a dead deploy.
5. **"`WORKER_BUNDLE_CEILING_BYTES` 1,398,705 → 1,399,318"** — **STALE, CONFIRMED**: the tip reads
   `export const WORKER_BUNDLE_CEILING_BYTES = 1401208;`
   (`tests/build/generationWorkerLazy.test.js:159`), with a further raise recorded in the file's comments
   (*"1,399,318 → 1,399,946 (2026-09-19, the chair, ODQ §934.19 addendum)"*). The declared-rise paragraph
   understates what the owner is being asked to ratify.
6. **"§934.36–§934.41 (the settlement editor)… is the next program, built first after this merge"** —
   partly stale: EM packets have **landed on this branch** (EM-B1k `19c4cb853`, EM-B3c `ae4a643f7` carrying
   migration 203, EM-B1f, EM-B3b…). The body reads as if none of it is in the consist.
7. **"thirty-seven Opus lanes", "thirteen adversarial review passes", "six signed shift records"** — all
   pre-date the second composition sitting; the shift records are now **nine** (CONFIRMED).

**Still accurate — CONFIRMED:** *"Supersedes PR #52 and PR #51 — both branches are contained in this
consist's base."* `git merge-base --is-ancestor` says **CONTAINED** for both remote tips (`a62dcbb90`,
`46f11e2b4`).

**Open PRs — CONFIRMED** (`gh pr list --state open`, `gh` authenticated as `clausellstokes-lang`, scopes
`gist, read:org, repo, workflow`):

```
52  Arrow header 2026 09 16           arrow-header-2026-09-16            OPEN  2026-09-17
51  Fix stray config seed 2026 09 16  fix-stray-config-seed-2026-09-16   OPEN  2026-09-16
48  Review fixes 2026 07 08           review-fixes-2026-07-08            OPEN  2026-07-13
39  fix: full-review remediation …    feat/activate-multitick            OPEN  2026-07-01
```

⛔ **PR #48 is the ledger branch → master and must never be merged.** Its head is the ledger tip; pushing
the ledger adds 215 commits to it and re-triggers its checks. **Close #48 before pushing the ledger.**
Close #51/#52 after the merge.

---

## G. Everything else that could make this deploy go wrong

**G-1. ⭐ The repo is now PRIVATE. CONFIRMED** — `gh repo view … --json visibility` → `"PRIVATE"`,
`isPrivate: true`. On deploy day memory records it as **PUBLIC** (*"measured, HTTP 200 anonymous"*). Both
`repos/…/branches/master/protection` and `repos/…/rulesets` now return **403 "Upgrade to GitHub Pro or make
this repository public to enable this feature."**
**PLAUSIBLE (strong): master's protection ruleset recorded on 09-16 (`pull_request · required_status_checks
· non_fast_forward · deletion`) is no longer enforced**, because GitHub's free tier does not offer protected
branches on private repositories. Consequences: nothing forces the PR flow; nothing blocks a merge on red
CI; **the Vercel `ignoreCommand` is now the only armed gate** between a bad merge and production. Knock-ons:
Actions minutes on a private repo are **billed** (a full run here is ~10 jobs × 40–60 min), and the CI
machinery's careful "readable by a signed-out viewer" failure-receipt design (ci.yml:118–121, 178–180) is
now moot. **Put this in front of the owner before the push — they may not know it changed.**

**G-2. Pushing the ledger branch will itself trigger a full, near-certainly-red CI run. CONFIRMED.** The
ledger's own ci.yml carries `push: branches: ['**']`. The ledger's `src/` is a fossil — **zero code commits
touching `src/` since master**, and **master is 1,744 commits ahead of it on all paths**. So the run will
execute current tests against July code and fail. **It blocks nothing** (the Vercel gate only evaluates
master), but it will look alarming, it updates PR #48's checks, and it burns billed minutes. Expect it,
name it in advance, and close #48 first.

**G-3. ⭐ The ledger divergence — real mechanism, not armed today, push the ledger first anyway. CONFIRMED.**
`origin/review-fixes-2026-07-08` = `eabb40b1a` (the 09-16 account-switch handoff). Local = `d764556e3`.
**Origin is a strict ancestor and local is 215 commits ahead** (215 one way, 0 the other), so the push is a
clean fast-forward. `check-tests` and `coverage-floors` both begin with
`git fetch --no-tags origin +refs/heads/review-fixes-2026-07-08:…`, overwriting the local ref with origin's
stale copy whenever the *code* branch is under test.

**What the two suites actually assert (both scripts and both tests read whole):**
- **`provenance-map.mjs`** takes *both* sides of every comparison from the same ref, so it is
  self-consistent whichever snapshot the ref resolves to. **A stale ref alone cannot red it.**
- **`ledger-citations.mjs`** takes its census from the ref but reads its ratchet baseline,
  `tests/lint/.ledger-citation-baseline.json`, from the **code branch's own checkout**. *That* is the real
  cross-branch coupling: a baseline edited to match a newer, unpushed ledger can mismatch a census run
  against the old ref, in either direction.
- **For this diff specifically: CONFIRMED zero change to `.ledger-citation-baseline.json`,
  `ledger-citations.mjs` or `provenance-map.mjs`.** So **the mechanism is real but not currently armed** —
  pushing the code branch first would probably not red either suite today.

**Push the ledger first regardless, for a cleaner reason: when CI runs *on* a `review-fixes-2026-07-08`
push, `HEAD == review-fixes-2026-07-08`, the conditional fetch is SKIPPED entirely, and both suites run
against the just-pushed HEAD — a zero-staleness window, always. CONFIRMED from the conditional.** Pushing
code first leaves a 215-commit window that is inert today and bites the next time that baseline or its
ALIASES table is touched ahead of a ledger push.

**G-4. The pre-push hook re-runs the entire gate.** `.husky/pre-push` runs `npm run check` **and**
`npm run check:edge-behavior`. Its comment claims *"Slow (~30s)"* — two eras stale; the real cost is **40+
minutes**. Worse, `test:ratchet` and `verify:dist` both go through `sh scripts/gate-mutex.sh --run`, and
the standing hazard is that **`gate-mutex.sh` gives up after 40 polls and exits 0 — a live false green**. A
push started while another gate holds the mutex can produce a *hollow* pre-push run that passes without
executing. **Recommendation: having taken RUN 23 green at the exact tip, push with `--no-verify`** — which
is precisely the escape the hook documents (*"only when you've already run `npm run check` locally and it
passed"*) — rather than let a second, possibly hollow, 40-minute gate decide.

**G-5. Disk: 97% full. CONFIRMED** — `/System/Volumes/Data` 193Gi of 228Gi used, **6.9Gi available**;
`.git` alone is **3.0G**. A push packs objects locally first (~6,098 objects unique vs `origin/master`).
It should fit, but this is thin, and a failed push mid-pack on a 97% volume is an unpleasant place to be.
**Free space before the push.**

**G-6. `origin` has not been pushed since 2026-09-17** (`pushed_at: 2026-09-17T13:55:20Z`). Neither the
consist branch nor the last 215 ledger commits exist remotely; origin has 48 heads, none of them the
consist. **The consist push is a first push.**

**G-7. Zero packets are READY — that constraint is satisfied. CONFIRMED.**
`docs/implementation/PACKET_MANIFEST.json` status census: **193 LANDED, 2 SUPERSEDED, 0 READY.**

**G-8. The read tip is 2 commits behind the branch tip**, both `tests/lint` register commits (`da5310f30`
the citation walker's archival roster, `e45c4738b` the eighth lighting refreeze) — consistent with the
brief. **No code delta between what I read and what will be pushed.**

**G-9. `db push` applies every pending migration, and the runbook is emphatic about it:** *"Do not
hand-count from a fixed starting migration."* DEPLOY.md's destructive warnings (188's push-time quarantine,
197's data rewrite, 198's retention deletion) are all ≤ 200 and therefore **already applied**; **none of
201–203 is destructive**. Since prod is verified at 200, the pending set is exactly {201, 202, 203} — but
the owner should confirm that with `npx supabase migration list`, not from this report.

**G-10. Rollback posture.** Client rollback is `git revert` + push. For the DB: *"Database migrations
CANNOT be rolled back automatically. The default is a reviewed forward-fix."* All three carry `@rollback:`
notes and none destroys data, so reversal is three small `create or replace` statements — hand-written,
not scripted. **And remember §B-gated-2: rolling back the client re-opens the data-loss defect.**

---

## Recommended execution order

1. Let **RUN 23** finish; require green.
2. Pre-run, in this order: `npm audit --audit-level=high --omit=dev` (seconds) → the hostile-locale eight (seconds) → `deno task check:edge && test:edge` (minutes) → **`npm run test:coverage:floors`** (41–43 min — worth it for the `saves.js` question) → (install webkit) the two e2e arms with `/usr/bin/time -p` → `performance`.
3. **Decide R1**: raise `e2e` `timeout-minutes` 15 → 25 (one line, no test pins it) and re-prove with the two `tests/build` CI suites — or accept the risk knowingly.
4. **Close PR #48.** Push the **ledger** branch. Expect its CI to go red; ignore it.
5. Push the **consist** branch (`--no-verify`, RUN 23 having just passed at the tip). Open the PR with a **refreshed body** (§F).
6. Watch CI on the consist branch — this is the first honest read of the five uncovered jobs.
7. **Owner's hand:** `supabase db push` (201–203) → `migration list` to confirm → hand the chair the live head number.
8. Chair: bump `supabase/applied-head.json` to **203** with the verification text, commit, and get that commit onto master.
9. Merge to master on green CI. Watch `Coverage floors` — it now has 60 minutes and was measured at 41–43.
10. **Owner's hand:** Vercel dashboard Redeploy on the merge commit (unless a secret is set). Confirm the Ignored Build Step line says PROCEED.
11. **Owner's hand:** redeploy the **eight** edge functions from a clean checkout of the merged commit.
12. **Owner's hand:** `npm run ops:post-deploy` for the release receipt.
13. Close PRs #51 and #52.

---

## Claim labels

**CONFIRMED (command executed, output quoted or counted):** all commit counts and file counts; the `check`
chain; ci.yml's jobs, triggers, caps and its one-line diff; `.nvmrc` = 22 on both refs and local Node
v24.12.0; the parity and gate-hardening test pins; the cancelled master run's per-job results; the Vercel
gate's migration clause; `applied-head.json` identical on both refs; all three migrations read whole; the
201/202/203 registrations; the 144-path bundle-freshness diff printing nothing; the eight edge-function
consumers; `api/` and `vercel.json` state; the ledger 215-commit divergence and ancestry; repo visibility
PRIVATE and the 403s; open PRs and the #51/#52 containment; PR-body figures 488 and 1401208; 193/2/0 packet
statuses; nine shift records; `launchGate.js` absent on master and present at the tip; `SCHEMA_VERSION = 1`
on both refs; `campaignPulseHelpers.js` zero diff and the cure's two lines; `anonDraft` as a new persisted
key; `LockControls.jsx` deleted; e2e 8→14 specs and 84,315→194,184 bytes; no dependency change; the missing
local webkit; the ledger's fossil `src/`; RUN 23's stage progress and honest mutex acquisition.

**PLAUSIBLE (reasoning, not executed):** that production still serves the July client; that master's branch
protection is no longer enforced; that a rollback re-erases protected NPCs; that existing saved dossiers
read differently after the prose shifts; that the e2e job overruns 15 minutes; the two performance-budget
risks; the mobile pointer-target margin; that a production build excludes the inert Edit-Mode modules.

**Not attempted, deliberately:** any Supabase or Vercel CLI call; any fetch of the production site; any
read of Vercel's environment; any test, build, coverage or gate run; `gh` writes of any kind. No rate limit
was hit. No file outside `lane-deploy-preflight-scratch/` and my own session scratch was written; the shared
read tip was never modified.

**One sub-lane figure was refuted and corrected:** a sub-lane reported `docs/GOLDEN_SHIFT_LEDGER.md` growing
848 → 2,311 (+1,463). Re-measured on the discrepancy: master is **2,286**, branch **2,311**, diff **+25
insertions**. The +25 figure in §B is the correct one.
