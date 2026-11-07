# BUILD-CHECK — the production build and the deploy path measured at the integration tip (2026-11-07)

Seat: BUILD-CHECK (Opus 5.5), a measure-only child of the cloud chair (Fable 5.1), session `01FE9mEvGxnFx6WTBkEC6ie9`, under the owner's full delegation of 2026-11-06. Brief: `docs/chair/2026-11-07/BRIEF-BUILD-CHECK-2026-11-07.md`. Base: `origin/lane/integration-2026-11-07` at `1031233a4`. No product byte, no ceiling and no register moved. The one register write is the dated roster, 99 → 100, for this record. Instruments and evidence live in `docs/chair/2026-11-07/build-check/`.

## 0. Verdict

The production build is **green** (`npm run build`: exit 0, 49 s wall). `npm run verify:dist` is **red on three tests, four rows**:

| row | measured | frozen | over by | whose (first-parent step that moved it) |
|---|---|---|---|---|
| lazy engine chunk ("remains large", `vendorPdfLazy`) | 681,803 | < 679,000 | +2,804 | review-intake merge `5b444331` +2,155 (crosses the line, 680,508); W0 merge `fc834a6b` +1,295 |
| generation worker (`WORKER_BUNDLE_CEILING_BYTES`, `generationWorkerLazy`) | 1,579,660 | 1,574,838 | +4,822 | review-intake merge `5b444331` +2,995; W0 merge `fc834a6b` +1,827 |
| landing fixture freshness, 2 rows (`landingFixtureFreshness`) | stale at seed `lf-033` | byte-identical | — | review-intake merge `5b444331` (fresh at `a1d5ecd0`, stale from `5b444331` on) |

The first-paint arm is **green** at this tip: the entry's static closure is **1,041,311 B raw** against 1,042,033 (722 under). gzip is 332,916 against 336,286 and Brotli 279,545 against 282,346. W0-CLOSE's two ceilings are the two lazy-bundle rows. At this tip each carries a review-intake share that W0-CLOSE's own-lane table (W0 alone) does not show. The landing-fixture red is **new**: no W0-CLOSE row names it. W0-CLOSE's first-paint raise (`0daf1618f`, 1,042,033 → 1,042,811, not merged here) is **not needed at the integration tip**, because the engine merge `a1d5ecd0` trimmed the closure by 1,775 B before W0 landed. These are findings for the chair. Nothing was cured.

## 1. `npm ci` and the production build

- `npm ci --no-audit --no-fund`: exit 0, 10.2 s.
- `npm run build` (what `vercel.json` `buildCommand` runs: `prebuild` sitemap → `vite build` → `postbuild` prerender): **exit 0, 49 s wall** (vite 7.3.6: 4,030 modules transformed, "built in 46.56s"). The prebuild wrote 317 sitemap URLs. The postbuild wrote 304 static route documents (13 views + 15 gallery hubs + 276 compendium entries). `dist/` holds 1,458 files, 185,936,459 B (videos included).
- Warnings: **7, the same 7 that master `db832c89` emits** (measured by building master in the step walk of §2):
  - 4× Rollup "contains an annotation that Rollup cannot interpret due to the position of the comment" on `src/domain/customContentSchema.js`. The comment is dropped; harmless.
  - 3× "(!) … is dynamically imported by … but also statically imported by …, dynamic import will not move module into another chunk", for `src/domain/worldPulse/temperamentPresets.js`, `src/lib/autoReloadClient.js` and `src/lib/analytics.js`. The dynamic `import()`s are no-ops; harmless.
  - No chunk-size warning.
- **The chunk table**: 593 JS chunks plus `index.html` and the CSS, banked whole in `build-check/chunks.txt` (vite's own table, raw kB). The largest, raw:

| chunk | kB | where it loads |
|---|---|---|
| `advanceInterval.worker` | 2,742.85 | lazy (worker) |
| `pdfRender.worker` | 2,444.78 | lazy (worker) |
| `vendor-pdf` | 1,852.24 | lazy |
| `customContentPreview.worker` | 1,795.13 | lazy (worker) |
| `generation.worker` | 1,579.66 | lazy (worker), **ceiling row** |
| `data-lazy` | 1,120.67 | lazy |
| `engine` | 681.80 | lazy, **ceiling row** |
| `index` (entry) | 534.41 | first paint |
| `advanceInterval` | 466.39 | lazy |
| `npcComponents` | 275.43 | lazy |
| `applyWorldPulse` | 258.55 | lazy |
| `SettlementsPanel` | 254.98 | lazy |
| `vendor-html2canvas` | 201.04 | lazy |
| `convergence` | 198.13 | lazy |
| `vendor-react` | 193.18 | first paint |
| `engine-core` | 163.18 | first paint |
| `data` | 119.84 | first paint |

- **First paint** (the entry's transitive static closure, the test's own algorithm re-run): 8 files: `index` 534,409 · `vendor-react` 193,176 · `engine-core` 163,181 · `data` 119,842 · `vendor-state` 17,046 · `content-identity` 5,356 · `kernel` 4,722 · `vendor-icons` 3,579 = **1,041,311 B**.

## 2. `npm run verify:dist` (`check-test-ratchet.mjs --verify-dist`, every build test under `VERIFY_DIST=1`)

Run through `sh scripts/gate-tail.sh`: **exit 1, 128 s wall**. Three tests are red (four rows), and the runner refused to bank. The skipped rows are the known ones: `engineAbsentWhenRemote` runs only on a flagged build, and `engineBundleReplay` is the known-stale golden fixture. Every other ceiling is green, including the first-paint raw/gzip/Brotli budgets, the vendor-pdf and engine absence-from-closure rows, and the worker's boundary rows.

**Attribution: one `vite build` per first-parent step** of `lane/integration-2026-11-07` from master `db832c89` to the tip, each in a clean detached worktree. Each step also ran `node scripts/generate-landing-fixture.mjs --seed lf-033 --check`:

| step | what | engine chunk | worker | first-paint raw | landing `--check` |
|---|---|---|---|---|---|
| `db832c89` | master (PR #73) | 678,351 | 1,574,838 | 1,042,033 | fresh |
| `a1d5ecd0` | merge engine-merge-2026-11-06 | 678,353 (+2) | 1,574,838 | 1,040,258 (−1,775) | fresh |
| `5b444331` | merge review-intake-2026-11-06 | **680,508 (+2,155)** | **1,577,833 (+2,995)** | 1,040,539 (+281) | **STALE** |
| `ff668b9f` | merge wiring-w6 | = | = | = | stale |
| `efe808f4` | merge soak-merge | = | = | = | stale |
| `7ab8a390` | merge people-0 | = | = | = | stale |
| `60d3305f` | merge wiring-inventory | = | = | = | stale |
| `fc834a6b` | merge wiring-w0 (`eb4c508e1`) | **681,803 (+1,295)** | **1,579,660 (+1,827)** | 1,041,311 (+772) | stale |
| `262e8b25`, `d71e7d00`, tip `1031233a` | registers, lint debts, briefs | 681,803 (the tip, measured in §1's build) | 1,579,660 | 1,041,311 | stale |

(In the last two step rows the step script's `ls | awk` picked `engine-core` instead of `engine`. Those two steps are register and doc commits with no `src/` byte. The tip's engine figure is the main build's own, 681,803, the same figure `verify:dist` read.)

**The causes:**

- **The review-intake merge `5b444331`** (lane tip `63a7cd852`, 22 commits) moved generation code in both lazy bundles: `src/generators/npcGenerator.js`, `hookVariety.js`, `economy/viability.js`, `resourceGenerator.js`, `steps/assembleSettlement.js`, `npc/factionLeaderSecret.js`, `npcStructure.js`, `steps/corruptionPass.js`, `services/serviceCategoryTables.js` and `src/domain/prose/holderTable.js`, under its units R1–R10 and REVIEW-INTAKE-4 (`9ae0609e`, "no roster carries one secret or one goal twice"). It also changed generation output without re-emitting `src/components/home/landingFixture.js`: no commit on that lane touches the fixture or its emitter. Its land record, `docs/REVIEW_INTAKE_LAND_2026-11-07.md`, lists `verify:dist` among the steps that "wait". So this is the record's own open item, not a hidden one.
- **The W0 merge `fc834a6b`** is the share W0-CLOSE already reported on its own lane (its table: engine +1,295 and worker +1,827 over its base). W0-CLOSE's trim `97209d8f` (−24 B each) is on `lane/wiring-w0-2026-11-07` and not merged here.
- So the integration tip is **+2,804 over on the engine chunk and +4,822 over on the worker**. W0-CLOSE's own figures (+646 and +1,827) cover only W0's share. The cure is one lane's business or one ruling. The landing fixture's cure is the emitter's own `--emit` plus re-grounding the stock narration, which `scripts/generate-landing-fixture.mjs` names. Both are **for the chair**.

## 3. The edge functions

- **Deno is not installed on this box** (`command -v deno` is empty), so no `deno check` was run, the same as ENGINE-MERGE-2's "not run: Deno is not on this box". CI's `deno-tests` job ("Edge function execution tests (Deno)") is the gate, and it is one of the six checks the Ignored Build Step requires.
- `npm run validate:edge` (node, through `gate-tail`): **exit 0**, "Edge function syntax and guard contracts are valid (81 files; 45 test suites env-scope clean)". `supabase/functions/` holds 34 functions plus `_shared`.
- **The `_shared` bundles are the ones `npm run build:edge-shared` emits at this tip.** Re-emitted in a clean detached worktree at `1031233a4` with a real copy of `node_modules`, all six bundles (`aiGrounding`, `analyticsEvents`, `aiCharter`, `intentAtlas`, `aiOutputSchema`, `engine`) are **byte-identical** (`git status`: no `*Bundle.js` modified). The six `.meta.json` files differ only in `generatedAt`, and `engineBundle.meta.json` also differs in `builtFromCommit` (`316b6712` committed → `1031233a` re-emitted). That is the commit stamp, not content. `sourceHash` and `engineVersion` (`1da6e02ceef82924`) are unchanged.
  - Instrument note: a first attempt with `node_modules` *symlinked* into the worktree leaked the absolute path into two bundles' module comments, the `inputs` lists and the `sourceHash`. That is an artifact of the symlink, not drift. The real-copy run above is the measurement.

## 4. The deploy path, plainly

**What a production deploy does** (from `vercel.json`): Vercel runs the **Ignored Build Step** `node scripts/vercel-ignore-build.mjs` first. Exit 0 means SKIP and exit 1 means BUILD (Vercel's inverted convention). If it proceeds, Vercel runs `npm run build` (sitemap, `vite build`, prerender) and serves `dist/`, with the redirects, rewrites and security headers in `vercel.json`. The `/map/*` paths go to `map.settlementforge.com`.

**The Ignored Build Step has no branch filter.** It ignores nothing by branch name. For every deployment, branch or master, it skips unless **all six required checks** are green on that exact commit: "Validate, test, build", "Chromium end-to-end", "Production-build browser performance", "Edge function execution tests (Deno)", "Coverage floors (money / security)" and "Golden master under tr_TR + Chatham TZ". It also fails closed when its token is missing, when the GitHub API errors, when the script crashes, and on a CLI `vercel deploy --prod` without git metadata. Vercel runs it seconds after a push, before CI has reported, so **every push's deployment is skipped**, and Vercel never re-evaluates that skipped deployment. On master, CI's `redeploy` job, after all six jobs succeed on a push, POSTs the Deploy Hook (when that secret is set). The hook makes a fresh deployment, which then passes the gate. Without the hook secret, the path is a manual dashboard Redeploy once CI is green.

**A second skip arm: migration currency.** With CI green, the gate still skips when the repo's migration head is ahead of `supabase/applied-head.json`. **At this tip the repo head is 204 and the applied head is 203** (204 is `204_engine_generation_report.sql`, which came in with the engine merge, `4b2310b4`; master has 203 files and the ledger matches it). So a deploy of this tip **will skip** until `supabase db push` applies 204 and `applied-head.json` is bumped in the same commit. The other way through is the loud override `VERCEL_ALLOW_MIGRATION_DRIFT=1`, which is only for a deliberate schema-free deploy, and this deploy is not one: the engine's admin line reads migration 204.

**What "Redeploy" redeploys:** the **commit of the deployment you click it on**, not the branch tip, with the project's **current** environment variables. To ship the tip, redeploy a deployment *of the tip's commit* (the skipped one the tip's push created), or fire the Deploy Hook, which builds the tip of its configured branch. A redeploy still runs the Ignored Build Step against that commit's checks. *Unverified here; Vercel's dashboard behaviour, not this repo's:* community reports say a redeploy of an already-built SHA can produce no new deployment.

**Environment the build and the gate read (names only):**
- Client, baked into the bundle at build time (`import.meta.env`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_RELEASE`, `VITE_APP_VERSION`, `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`, `VITE_PLAUSIBLE_DOMAIN`, `VITE_PLAUSIBLE_API`, `VITE_OWNER_EMAIL`, `VITE_ERROR_REPORT_URL`, `VITE_PREVIEW_ROLE`, `VITE_E2E_LOCAL_DATA` (test only), and `VITE_ENGINE_REMOTE`, which `vite.config.js` also reads. Exactly `true` builds the client **without** the generator (`engineAbsentWhenRemote`).
- Build scripts: `ANALYZE` (vite.config), `SITEMAP_INCLUDE_GALLERY`, and the two `VITE_SUPABASE_*` above (prebuild sitemap).
- The Ignored Build Step: `VERCEL`, `VERCEL_ENV`, `VERCEL_GIT_COMMIT_SHA`, `VERCEL_GIT_REPO_OWNER`, `VERCEL_GIT_REPO_SLUG` (Vercel-provided); `GITHUB_CI_STATUS_TOKEN` (the one secret it needs); and the overrides `VERCEL_ALLOW_UNGATED_DEPLOY` and `VERCEL_ALLOW_MIGRATION_DRIFT`.
- CI (GitHub secrets): `VERCEL_DEPLOY_HOOK_URL` (`redeploy` job) and `VERCEL_TOKEN` (`deploy` job, DEPLOY.md's model 2).

**The daily limit:** Vercel's Hobby (free) plan allows **100 deployments a day**. A deployment the Ignored Build Step cancels **still counts**: Vercel must start the deployment to run the step. The chair hit the cap at 01:29 UTC on 2026-11-07. Because every git push of every branch creates a deployment, **lane pushes spend the deploy budget**. When the cap is hit, the commit status reads "Deployment rate limited — retry in 24 hours", and pushes, hooks and redeploys all fail until it resets. Nothing in `vercel.json` currently turns branch deployments off. The `git.deploymentEnabled` key would, but that is a product change the chair has to rule on.

**The one safe sequence for deploy day:**
1. Freeze lane pushes for the day: no branch pushes from any seat, so the 100/day budget is the deploy's alone.
2. Land the tip on master with CI green on all six checks at that exact commit. `verify:dist` must be green first: §2's three reds are cured or ruled.
3. Apply migration 204 (`supabase db push` from a clean worktree at that commit) and bump `supabase/applied-head.json` to 204 in the commit that lands. Deploy `engine-generate` and `engine-version` from the same commit.
4. Let the `redeploy` job fire the Deploy Hook, or, without it, click Redeploy on **that master commit's** skipped production deployment. Never set `VERCEL_ALLOW_UNGATED_DEPLOY` or `VERCEL_ALLOW_MIGRATION_DRIFT`.
5. Check: the build log says "PROCEED with deploy: all required CI checks are green", then run `npm run ops:post-deploy` and §5's smoke against production.

## 5. The preview smoke

`npx vite preview --port 4173` on §1's `dist/`. Then one Playwright run (the pre-installed Chromium, 1280×900, deviceScaleFactor 2, no trace; `build-check/smoke.cjs`; the closure re-measure is `build-check/closure.mjs`):

- **Root** `/`: HTTP 200, the landing CTA "Forge your first settlement" visible in 1.5 s. Screenshot: `build-check/root.jpg`.
- **One generated dossier**: the CTA leads to `/create`, then "Forge a town →". The dossier rendered "TOWN · POP. 845" in 11.2 s. Screenshot: `build-check/dossier.jpg`.
- **Console errors: 0**; page errors: 0 (first three: none). `build-check/console-errors.json` banks the run. It lists four `net::ERR_ABORTED` requests for the landing's background videos (`/media/journey-legs/bg/leg-1…`, `leg-2…`, `/videos/realm-journey.mp4` twice). All three files are in `dist/`, so these are media loads the browser cancelled on navigation, not missing assets.
- Screenshots were taken as PNG at deviceScaleFactor 2 (3.7 MB and 1.9 MB) and are banked as JPEG at quality 78 to keep the tree small.
- Smoke-script note: Flow A's e2e selector (`[aria-label="Anonymous settlement generator"]`) no longer matches the root page. The hero there is now the "Forge your first settlement" CTA, and the size picker lives on `/create`. The smoke followed the page as it is; whether `e2e/flow-a-generate-save-export.spec.js` still passes is CI's e2e job to say.

## 6. Reproduce

```
npm ci --no-audit --no-fund
npm run build
sh scripts/gate-tail.sh npm run verify:dist
node scripts/generate-landing-fixture.mjs --seed lf-033 --check
npm run validate:edge
# edge bundles: in a clean worktree with a real node_modules copy
node scripts/build-edge-shared.mjs && git diff -U0 supabase/functions/_shared
node scripts/vercel-ignore-build.mjs   # locally: PROCEED (no Vercel context)
npx vite preview --port 4173            # then the smoke at root and /create
```
