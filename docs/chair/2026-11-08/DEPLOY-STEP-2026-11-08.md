# THE OWNER'S DEPLOY STEP — this release, with the engine service turned ON (draft of 2026-11-08, amended 2026-11-09 for migrations 204–210 and the re-save per shared town; final at the integration pull request)

> **THE ORDER, by the owner's word of 2026-11-09 ("Do it before deploy"):** this step runs AFTER the second style wave (STYLE-2: the audit of every writer and every printed block against the owner's style law, the chair's rulings, the correction lanes and the style walker — `../2026-11-09/BRIEF-STYLE-2-AUDIT-2026-11-09.md`) has merged onto the integration branch, after MERGE-TRAIN and before the CI push; the deploy waits for it.

**Written by the chair** (session `session_01FbPLbejcfwX5nii12VM673`) on the owner's words of 2026-11-08: "Pre deploy*" (the allegiance train before the one deploy), "Yeah do those before deploy" (items 14 and 15), and "Turn it on please. Or tell me the process to turn it on" (the engine service). **The source of the procedure:** [`../../DEPLOY.md`](../../DEPLOY.md) — "Turning the engine service on", "Edge function — manual", "Post-deploy verification"; the design `docs/DESIGN_ENGINE_SERVICE.md` "What the owner does". **What the chair cannot do:** none of this runs from a chair session — there is no Supabase or Vercel credential or CLI in the cloud container, and the deploy guide makes every backend step an attended command. The chair prepares; the owner executes.

## 0. What is new in this release that the servers must learn

- **Migrations 204, 205, 206 and 207** (`supabase/migrations/`): 204 the engine generation report (the Admin → Analytics line reads it); 205 the export keys (`publicSafe.js`'s SQL twin, from the export-keys lane); 206 the public veil's twins (from the public-veil lane); 207 the capture-state veil's SQL twin (ALLEGIANCE-CAR2, the chair's J-20 rulings of 23:2x and 23:4x UTC: `_gallery_sanitize_public_json` redefined from 206's body with three TARGETED deletes — `criminalCaptureState`, `factions[].captureState`, `factionRelationships[].captureState` — and the governing-to-criminal relation rows of type `corrupted` dropped from the public projection; the world-snapshot scanner untouched; the client twin `publicSafe.js` pinned field for field; so a hidden power's hold on the hall never prints on a public page. A PUBLIC-POSTURE CHANGE, conservative — players see less, the DM sees all. A FILE in the release, applied by your hand here). Master today ends at 203.
- **Two new edge functions**: `engine-generate` (birth, derive, stepMeta, regenSection) and `engine-version` (the version probe). Master today has neither. The shared engine bundle `supabase/functions/_shared/engineBundle.js` is built from the same source the client runs; its `engineBundle.meta.json :: engineVersion` is the pin.
- **The client build** with `VITE_ENGINE_REMOTE=true` LEAVES THE GENERATOR OUT of the browser bundle (no worker, no pipeline, no step registry), so every generation, re-derivation and section regeneration goes through `engine-generate`.

## 0a. AMENDED 2026-11-09 (the chair, 17:3x) — the migrations are now SEVEN, 204 to 210, and one re-save per shared town follows the deploy

Written from the seven migration files' own headers and `@rollback` annotations (nothing here is a claim a header does not make). None of them has been applied by any lane; every one is a FILE until your `supabase db push`. In plain words, in the order they apply:

| # | File | What it does for the product | If it had to be undone (the file's own `@rollback`) |
|---|---|---|---|
| 204 | `204_engine_generation_report.sql` | Adds the function the Admin → Analytics line reads ("Engine generations today / this month"). | Drop that one function. |
| 205 | `205_drop_retired_faction_public_keys.sql` | The public (shared) dossier stops carrying three retired keys from the people car — the server-side twin of the client's export allowlist. | Recreate 189's body verbatim. |
| 206 | `206_public_card_veil_bit.sql` | The public dossier honours the card's veil bit — a face's house or secret you veiled stays veiled on the shared page. | Recreate 205's body verbatim. |
| 207 | `207_public_hall_capture_veil.sql` | The public dossier drops the hall-capture state (who really holds the hall) — DM truth, never shown to players. | Recreate 206's body verbatim. |
| 208 | `208_party_link_independent_idempotent_veiled.sql` | **The party link.** Pressing "Unlisted link" twice no longer kills the link your players hold (the same link is returned); the link honours the veil exactly as the gallery page does; the owner opening their own link is sent to their library view; the link is independent of gallery listing (a town can be listed AND linked). Five functions recreated, one check constraint, one backfill of the `visibility` column from the slug. | Recreate the five functions at their migration-168 bodies and drop the `settlements_visibility_derived` constraint. No data is lost either way. |
| 209 | `209_surveyor_premium_only.sql` | **The Surveyor is Premium only** (your tier law, item 7): staff, an active premium tier (Founders count as lifetime premium), or an admin-granted entitlement admit; a purchased row alone no longer does. One function, no table, no row. | Re-run 201's body verbatim. |
| 210 | `210_public_prose_text_projection.sql` | **The shared page carries your composed text.** The dossier's written blocks, as your players see them, travel as plain sentences in the save (`publicProse`) and the shared and party pages print them instead of recomposing; the seed never travels. One allowlist token added to the public sanitiser. | Re-apply 207's body verbatim; the shared page falls silent where the blocks stood. |

**The order of operations for the migrations (replaces §2 step 2's list):** `npx supabase@2.122.0 migration list` must show 204, 205, 206, 207, 208, 209 and 210 pending; `npx supabase@2.122.0 db push` applies them in that order in one act; `npx supabase@2.122.0 db diff` must then be empty. The applied-head line in `docs/DEPLOY.md` is bumped in that same act (the gate derives the head from the files on disk and fails if the line drifts).

**ONE RE-SAVE PER SHARED TOWN, after the client is redeployed (new, from 210).** A town's shared page lights with the composed text only at its FIRST SAVE after the new client ships: the client stamps `publicProse` into the save at every save, and a page whose save has no stamp (or an older one) prints nothing where the blocks would stand — silent, never a wrong re-draw. So, once the migrations are applied and the client redeployed: open each town you share (gallery or party link), make any save (a trivial edit and save, or the save button), and reload its shared page. This is done by hand, town by town; nothing scripts it, by the chair's ruling. Towns you do not re-save keep working exactly as before 210 — their shared pages simply show no composed blocks until their next save. Campaign-dependent lenses print nothing on the shared page in this release (owner-only by ruling).

**What players see after 208, in one line each:** a party link survives a second press and a second device; a veiled face stays veiled on the link; a listed town can also be linked; the owner is routed to their own library view when opening their link.

**What changes for paying tiers after 209:** the Surveyor (the AI layer) answers only for staff, premium and Founders, and for admin-granted entitlements; a bare Cartographer is refused on the AI layer. Nothing else in the tiers moves in this migration.

## 1. Once, before the first turn-on

1. **Supabase:** confirm Edge Functions are enabled on the project; read the plan's invocation allowance (the plan page is the authority) — with the flag on, every generation is an invocation.
2. **GitHub:** add the Supabase access token as a repository secret for the deploy job, so the functions can ship from CI at a green commit rather than by hand (today no workflow deploys functions; until the secret exists, the manual path below is the path).
3. **The dials:** `supabase/functions/engine-generate/index.ts :: ENGINE_GENERATE_RATE_LIMITS` — 6 a minute, 200 a day per account or IP, staff unlimited. Change them only in a commit; they are code.

## 2. The release, in order (one attended session)

1. **The merge on master** happens first: the integration pull request merges on green CI. Everything below runs from THAT commit — clean tree, pushed, CI-green.
2. **Migrations:** `npx supabase@2.122.0 login` → `npx supabase@2.122.0 link --project-ref <your-project-ref>` → `npx supabase@2.122.0 migration list` (204, 205, 206, 207, 208, 209 and 210 pending — §0a) → `npx supabase@2.122.0 db push` → `npx supabase@2.122.0 db diff` (empty = the remote matches the tree).
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
