# BRIEF — BUILD-CHECK: the production build and the deploy path measured at the integration tip (2026-11-07)

A measure-only seat (an Opus 5.5 child of the cloud chair, Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), under the owner's full delegation of 2026-11-06. THE DEPLOY comes after the people car and the writing wave (the owner's order), and the day it comes nothing about the build may be a surprise. Base: `origin/lane/integration-2026-11-07` (the sha in your prompt). Branch: `lane/build-check-2026-11-07`. Read first: `docs/chair/2026-11-07/BRIEF-PEOPLE-COMMON-2026-11-07.md` §2 (setup; the push form: plain separate commands, the push alone); `package.json`'s scripts; `vercel.json` and the Ignored Build Step it names; `docs/ENGINE_MERGE2_2026-11-07.md` (its "Deno not run" line); `docs/WIRING_W0_2026-11-07.md`'s W0-CLOSE section (the first-paint budget; the two lazy-bundle ceilings W0-CLOSE is closing on its own lane — you REPORT those, you do not cure them twice).

## 1. What you run and measure (every figure by execution, outputs to files, exit codes read; never a gate through a pipe — `sh scripts/gate-tail.sh <command…>`)

1. `npm ci` then the production build (`npm run build` or whatever `vercel.json` runs): wall time, exit code, the warnings, the chunk table (every chunk with its size), banked in the record.
2. `npm run verify:dist` (or the script that enforces the dist budgets): every ceiling with its measured figure and its frozen figure; which are red and whose (W0-CLOSE's two are known; anything else is new — name the cause by `git log -S` over the integration branch's first-parent chain).
3. The edge functions: `supabase/functions/` — if `deno` is installed, `deno check` every function (output banked); if it is not, say so, and check the `_shared/*.meta.json` bundles are the ones `npm run build:edge-shared` emits at this tip (byte-identical except `generatedAt`).
4. The deploy path, read and written plainly for the owner: what the production deploy does from `vercel.json` (build command, output directory, the Ignored Build Step and which branches it ignores), what "Redeploy" on Vercel's dashboard redeploys (the last production deployment's commit, or the branch tip), the environment variables and secrets the build reads (names only, never values), and the daily deployment limit on the free plan (the chair hit 100/day at 01:29 UTC on 2026-11-07: every lane push counts even when the Ignored Build Step cancels the build) — with the one safe sequence for deploy day in five lines.
5. The preview smoke: `npm run preview` (or `vite preview`) on the built output, one Playwright visit of the root and of one generated dossier (the pre-installed Chromium; `--trace off`), a screenshot at deviceScaleFactor 2 banked under `docs/chair/2026-11-07/build-check/` with the console errors (count and first three), nothing else.

## 2. Rules

Measure-only: no product byte, no register write, no ceiling moved (W0-CLOSE owns the two; anything new is reported for the chair). `git status` at your end shows only your record, the `build-check/` directory, and the dated roster's `dated` count grown by one with a `_rosterGrowth2026-11-07-build-check` note. Commit trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01FE9mEvGxnFx6WTBkEC6ie9`; push with the bypass, the push alone.

## 3. The hand-back

`docs/chair/2026-11-07/BUILD-CHECK-2026-11-07.md` (sections 1–5); your final message at most 300 words plus ONE table (check · result · figure · whose), the tip sha, pushed.
