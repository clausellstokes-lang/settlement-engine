# THE OWNER'S DEPLOY STEP — this release, with the engine service turned ON (draft of 2026-11-08; final at the integration pull request)

**Written by the chair** (session `session_01FbPLbejcfwX5nii12VM673`) on the owner's words of 2026-11-08: "Pre deploy*" (the allegiance train before the one deploy), "Yeah do those before deploy" (items 14 and 15), and "Turn it on please. Or tell me the process to turn it on" (the engine service). **The source of the procedure:** [`../../DEPLOY.md`](../../DEPLOY.md) — "Turning the engine service on", "Edge function — manual", "Post-deploy verification"; the design `docs/DESIGN_ENGINE_SERVICE.md` "What the owner does". **What the chair cannot do:** none of this runs from a chair session — there is no Supabase or Vercel credential or CLI in the cloud container, and the deploy guide makes every backend step an attended command. The chair prepares; the owner executes.

## 0. What is new in this release that the servers must learn

- **Migrations 204, 205, 206 and 207** (`supabase/migrations/`): 204 the engine generation report (the Admin → Analytics line reads it); 205 the export keys (`publicSafe.js`'s SQL twin, from the export-keys lane); 206 the public veil's twins (from the public-veil lane); 207 the capture-state veil's SQL twin (ALLEGIANCE-CAR2, the chair's J-20 rulings of 23:2x and 23:4x UTC: `_gallery_sanitize_public_json` redefined from 206's body with three TARGETED deletes — `criminalCaptureState`, `factions[].captureState`, `factionRelationships[].captureState` — and the governing-to-criminal relation rows of type `corrupted` dropped from the public projection; the world-snapshot scanner untouched; the client twin `publicSafe.js` pinned field for field; so a hidden power's hold on the hall never prints on a public page. A PUBLIC-POSTURE CHANGE, conservative — players see less, the DM sees all. A FILE in the release, applied by your hand here). Master today ends at 203.
- **Two new edge functions**: `engine-generate` (birth, derive, stepMeta, regenSection) and `engine-version` (the version probe). Master today has neither. The shared engine bundle `supabase/functions/_shared/engineBundle.js` is built from the same source the client runs; its `engineBundle.meta.json :: engineVersion` is the pin.
- **The client build** with `VITE_ENGINE_REMOTE=true` LEAVES THE GENERATOR OUT of the browser bundle (no worker, no pipeline, no step registry), so every generation, re-derivation and section regeneration goes through `engine-generate`.

## 1. Once, before the first turn-on

1. **Supabase:** confirm Edge Functions are enabled on the project; read the plan's invocation allowance (the plan page is the authority) — with the flag on, every generation is an invocation.
2. **GitHub:** add the Supabase access token as a repository secret for the deploy job, so the functions can ship from CI at a green commit rather than by hand (today no workflow deploys functions; until the secret exists, the manual path below is the path).
3. **The dials:** `supabase/functions/engine-generate/index.ts :: ENGINE_GENERATE_RATE_LIMITS` — 6 a minute, 200 a day per account or IP, staff unlimited. Change them only in a commit; they are code.

## 2. The release, in order (one attended session)

1. **The merge on master** happens first: the integration pull request merges on green CI. Everything below runs from THAT commit — clean tree, pushed, CI-green.
2. **Migrations:** `npx supabase@2.122.0 login` → `npx supabase@2.122.0 link --project-ref <your-project-ref>` → `npx supabase@2.122.0 migration list` (204, 205, 206, 207 pending) → `npx supabase@2.122.0 db push` → `npx supabase@2.122.0 db diff` (empty = the remote matches the tree).
3. **Functions, from the same commit:** `npx supabase@2.122.0 functions deploy engine-generate` and `npx supabase@2.122.0 functions deploy engine-version`, plus any other function whose `_shared` stamp moved in this release (the release receipt lists them; the merge seats' records name the rebuilt edge-shared bundles — ALLEGIANCE-CAR1 rebuilt them for the allegiance model).
4. **Verify the pin:** `GET <VITE_SUPABASE_URL>/functions/v1/engine-version` must answer `engineVersion` equal to `supabase/functions/_shared/engineBundle.meta.json :: engineVersion` at the merged commit. If it does not, the functions were not deployed from that commit; fix that before the flag, or every pinned caller is answered 409 `engine_version_retired`.
5. **Vercel:** Project → Settings → Environment Variables → Production: `VITE_ENGINE_REMOTE=true` (and `VITE_ENGINE_GENERATE_URL` / `VITE_ENGINE_ADVANCE_URL` if the design's "What the owner does" names them for your project). The value is baked at build time.
6. **Redeploy the client** from the merged commit (the CI-gated deploy job, or a Vercel redeploy of that commit). The shipped `dist/` now has no generator.
7. **Post-deploy verification:** `npm run ops:post-deploy` with the production health and database settings (`docs/ops/POST_DEPLOY_VERIFICATION_RUNBOOK.md`) — it produces the release receipt. The chair's one addition, recommended: a timed call through `engine-generate` for one seed per tier, so the receipt carries a latency number for the first server-side generations.
8. **Watch:** Admin → Analytics' first line "Engine generations (today / this month)" (needs 204 applied); the Supabase dashboard's Edge Functions → engine-generate → Logs for invocations and errors; the 429 rate (the dials) and the 409 rate (a stale client meeting a new engine — the stale-deploy guard reloads such a tab).

## 3. Turning it OFF again

Set `VITE_ENGINE_REMOTE` back off in Vercel and redeploy: the client build carries the generator again and runs it in the worker; the functions may stay deployed, unused.

## 4. What the chair still owes before this step is final

The integration pull request (after MERGE-WAVE, the allegiance train and MERGE-TRAIN, the one full check through the hook, CI green) — at which point this document is amended with the final commit, the full list of functions whose `_shared` stamps moved, and the migrations' final numbers, and its text is copied into the pull request body.
