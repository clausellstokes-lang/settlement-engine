# THE OWNER'S DEPLOY STEP — this release, with the engine service turned ON (draft of 2026-11-08, amended 2026-11-09 for migrations 204–210 and the re-save per shared town; final at the integration pull request)

> **THE ORDER, by the owner's word of 2026-11-09 ("Do it before deploy"):** this step runs AFTER the second style wave (STYLE-2: the audit of every writer and every printed block against the owner's style law, the chair's rulings, the correction lanes and the style walker — `../2026-11-09/BRIEF-STYLE-2-AUDIT-2026-11-09.md`) has merged onto the integration branch, after MERGE-TRAIN and before the CI push; the deploy waits for it.

**Written by the chair** (session `session_01FbPLbejcfwX5nii12VM673`) on the owner's words of 2026-11-08: "Pre deploy*" (the allegiance train before the one deploy), "Yeah do those before deploy" (items 14 and 15), and "Turn it on please. Or tell me the process to turn it on" (the engine service). **The source of the procedure:** [`../../DEPLOY.md`](../../DEPLOY.md) — "Turning the engine service on", "Edge function — manual", "Post-deploy verification"; the design `docs/DESIGN_ENGINE_SERVICE.md` "What the owner does". **What the chair cannot do:** none of this runs from a chair session — there is no Supabase or Vercel credential or CLI in the cloud container, and the deploy guide makes every backend step an attended command. The chair prepares; the owner executes.

## 0. What is new in this release that the servers must learn

- **Migrations 204, 205, 206 and 207** (`supabase/migrations/`): 204 the engine generation report (the Admin → Analytics line reads it); 205 the export keys (`publicSafe.js`'s SQL twin, from the export-keys lane); 206 the public veil's twins (from the public-veil lane); 207 the capture-state veil's SQL twin (ALLEGIANCE-CAR2, the chair's J-20 rulings of 23:2x and 23:4x UTC: `_gallery_sanitize_public_json` redefined from 206's body with three TARGETED deletes — `criminalCaptureState`, `factions[].captureState`, `factionRelationships[].captureState` — and the governing-to-criminal relation rows of type `corrupted` dropped from the public projection; the world-snapshot scanner untouched; the client twin `publicSafe.js` pinned field for field; so a hidden power's hold on the hall never prints on a public page. A PUBLIC-POSTURE CHANGE, conservative — players see less, the DM sees all. A FILE in the release, applied by your hand here). Master today ends at 203.
- **Two new edge functions**: `engine-generate` (birth, derive, stepMeta, regenSection) and `engine-version` (the version probe). Master today has neither. The shared engine bundle `supabase/functions/_shared/engineBundle.js` is built from the same source the client runs; its `engineBundle.meta.json :: engineVersion` is the pin.
- **The client build** with `VITE_ENGINE_REMOTE=true` LEAVES THE GENERATOR OUT of the browser bundle (no worker, no pipeline, no step registry), so every generation, re-derivation and section regeneration goes through `engine-generate`.

## 0a. AMENDED 2026-11-09 (the chair, 17:3x) — the migrations are now SEVEN, 204 to 210, and one re-save per shared town follows the deploy

Written from the seven migration files' own headers and `@rollback` annotations (nothing here is a claim a header does not make — CORRECTED 2026-11-10: two rows and one line below did; §0b lists them and the text here is now corrected). None of them has been applied by any lane; every one is a FILE until your `supabase db push`. In plain words, in the order they apply:

| # | File | What it does for the product | If it had to be undone (the file's own `@rollback`) |
|---|---|---|---|
| 204 | `204_engine_generation_report.sql` | Adds the function the Admin → Analytics line reads ("Engine generations today / this month"). | Drop that one function. |
| 205 | `205_drop_retired_faction_public_keys.sql` | The public (shared) dossier stops carrying three retired keys from the people car — the server-side twin of the client's export allowlist. | Recreate 189's body verbatim. |
| 206 | `206_public_card_veil_bit.sql` | The public dossier honours the veil bit the GENERATOR stamps on an institution card: a hidden power's row leaves the public page, its name is masked, and the title and role leave a veiled face's card. It adds nothing about secrets, and the eye a DM sets by hand on a card is still applied in the browser (§0b). | Recreate 205's body verbatim. |
| 207 | `207_public_hall_capture_veil.sql` | The public dossier drops the hall-capture state (who really holds the hall) — DM truth, never shown to players. That is the DATA; the composed text is held to the same rule by VEIL-FIX (§0b). | Recreate 206's body verbatim. |
| 208 | `208_party_link_independent_idempotent_veiled.sql` | **The party link.** Pressing "Unlisted link" twice no longer kills the link your players hold (the same link is returned); the link applies everything that HIDES — the sanitiser and the veil's deltas — and NEVER shows DM content, whatever the gallery's "Reveal DM content" switch says (AMENDED BEFORE FIRST APPLY by VEIL-FIX, point 28: as first written this file would have widened existing links — §0b); the owner opening their own link is sent to their library view; the link is independent of gallery listing (a town can be listed AND linked). Five functions recreated, one check constraint, one backfill of the `visibility` column from the slug. | Recreate the five functions at their migration-168 bodies and drop the `settlements_visibility_derived` constraint. No row is lost either way. A rollback of 208 goes WITH a rollback of the client: with the old functions back, the new client's "Unlisted link" press on a listed town would delist it and mint a new link. |
| 209 | `209_surveyor_premium_only.sql` | **The Surveyor is Premium only** (your tier law, item 7): staff, an active premium tier (Founders count as lifetime premium), or an admin-granted entitlement admit; a purchased row alone no longer does. One function, no table, no row. | Re-run 201's body verbatim. |
| 210 | `210_public_prose_text_projection.sql` | **The shared page carries your composed text.** The dossier's written blocks, as your players see them, travel as plain sentences in the save (`publicProse`) and the shared and party pages print them instead of recomposing; the seed never travels. One allowlist token added to the public sanitiser. The text is drawn for players and says nothing the sanitiser strips (VEIL-FIX, §0b). | Re-apply 207's body verbatim; the shared page falls silent where the blocks stood. |

**The order of operations for the migrations (replaces §2 step 2's list):** `npx supabase@2.122.0 migration list` must show 204, 205, 206, 207, 208, 209 and 210 pending; `npx supabase@2.122.0 db push` applies them in that order in one act; then `npx supabase@2.122.0 migration list` AGAIN must show all seven applied on the remote (the chair no longer names `db diff` here: it may compare against a local database rather than the remote). The applied-head LEDGER, `supabase/applied-head.json` (`appliedHead` 203 → 210, with its date and verification line), is bumped in that same act, as every one of the seven headers says; `docs/DEPLOY.md`'s head line already reads 210 from the files on disk.

**ONE RE-SAVE PER SHARED TOWN, after the client is redeployed (new, from 210).** A town's shared page lights with the composed text only at its FIRST SAVE after the new client ships: the client stamps `publicProse` into the save at every save, and a page whose save has no stamp (or one of an older FORMAT) prints nothing where the blocks would stand — silent, never a wrong re-draw. One limit: a stamp is tied to its format, not to the town's content, so after a canon route command (cutting or creating a trade route) save the town once more before relying on its shared page (VEIL-FIX drops a stale stamp on that path and when the composer fails; a content hash is a post-deploy item). So, once the migrations are applied and the client redeployed: open each town you share (gallery or party link), make any save (a trivial edit and save, or the save button), and reload its shared page. This is done by hand, town by town; nothing scripts it, by the chair's ruling. Towns you do not re-save keep working exactly as before 210 — their shared pages simply show no composed blocks until their next save. Campaign-dependent lenses print nothing on the shared page in this release (owner-only by ruling).

**What players see after 208, in one line each:** a party link survives a second press and a second device; a veiled face stays veiled on the link, and the link never shows DM content; a listed town can also be linked; the owner is routed to their own library view when opening their link.

**What changes for paying tiers after 209:** the Surveyor (the AI layer) answers for staff, for an active PREMIUM tier — CARTOGRAPHER and above, Founders as lifetime premium — and for admin-granted entitlements. [CORRECTED 2026-11-10: this line said a bare Cartographer is refused; the SQL says the opposite — 209 newly ADMITS every premium account to the nine AI functions. What it stops admitting is an entitlement row whose source is not `grant`: see the pre-push check in §0b.] Nothing else in the tiers moves in this migration.

## 0b. CORRECTED 2026-11-10 (the chair) — after the read-only pre-deploy review of the seven migrations

The review is `docs/chair/2026-11-10/REVIEW-MIGRATIONS-204-210-2026-11-10.md` (2 high, 4 medium, 4 low findings and ten mismatches between this document and the SQL). Both high findings were verified by the chair and are CURED BEFORE THE DEPLOY by VEIL-FIX (merge point 28), which amends the never-applied files 204, 208 and 210 in place; this document is final only once that point is in. What was wrong above, now corrected in the text: the 206 row (it described a DM's choice; the file reads a bit the generator stamps); the 208 row (as first written the file made the players' link return the full DM view wherever the gallery's "Reveal DM content" switch was on — the chair's own ruling of 2026-11-09, corrected: the link never widens); the 209 line (it said a bare Cartographer is refused; the file admits every premium account); the applied-head file (the ledger is `supabase/applied-head.json`); `db diff` as the proof of the push; the functions to deploy; and the missing clone rehearsal.

**THE PRE-PUSH CHECKS — three read-only queries against production, before `db push`:**

```sql
-- (a) Links on towns whose reveal switch is on. With VEIL-FIX in, no link widens, so this count is
--     for your information: these are the towns whose players would have seen DM content.
select count(*) from public.settlements s
 where s.unlisted_slug is not null
   and (s.gallery_share_dm
        or exists (select 1 from jsonb_each(s.gallery_member_overrides) e
                    where e.key <> '$veil' and e.value ->> 'revealDm' = 'true'));

-- (b) Surveyor entitlements by source. After 209 only source 'grant' admits by itself; an ACTIVE row
--     with any other source (or none) on a NON-premium account loses the Surveyor at the push.
--     Re-grant such rows through the admin path first.
select source, status, count(*) from public.surveyor_entitlements group by 1, 2;

-- (c) Rows whose visibility disagrees with their link. Expect 0; 208's backfill rewrites the rest
--     and bumps their updated_at.
select count(*) from public.settlements where (visibility = 'unlisted') <> (unlisted_slug is not null);
```

**After the push, one check:** `select has_function_privilege('anon', 'public.report_engine_generations()', 'execute');` must answer false (204, as amended, revokes it by name).

**ROLLBACK, AS A SET.** 205, 206, 207 and 210 each restate ONE function, so their `@rollback` lines are right only last-in-first-out: undo 210, then 207, then 206, then 205 — never one from the middle (rolling back 206 alone would silently drop 207's capture strip and 210's token). 208's rollback goes with the client's. No table loses a row in any of the seven; `data.publicProse` stays in saved rows after a 210 rollback, inert.

**WHAT THE REHEARSAL PROVES, AND WHAT IT DOES NOT.** The harness proves the seven files plan and apply as a contiguous chain on production-shaped data without losing rows. It cannot see what a restated function DOES; the two high findings were invisible to it. That is why the review was run.

**ONE LIMIT THAT REMAINS AFTER THIS RELEASE, said plainly:** the veil a DM sets by hand is applied in the reader's browser. The server's response still carries what that veil hides, on the gallery page as today and now on the party link, so a determined reader can find it in the network traffic. The sanitiser's own strips (secrets, hidden powers, the capture state) ARE server-side. A server-side veil is a migration of its own and is the first item of the post-deploy list. VEIL-FIX makes the veil's DEFAULT apply to a town shared by link alone, which today has none.

## 1. Once, before the first turn-on

1. **Supabase:** confirm Edge Functions are enabled on the project; read the plan's invocation allowance (the plan page is the authority) — with the flag on, every generation is an invocation.
2. **GitHub:** add the Supabase access token as a repository secret for the deploy job, so the functions can ship from CI at a green commit rather than by hand (today no workflow deploys functions; until the secret exists, the manual path below is the path).
3. **The dials:** `supabase/functions/engine-generate/index.ts :: ENGINE_GENERATE_RATE_LIMITS` — 6 a minute, 200 a day per account or IP, staff unlimited. Change them only in a commit; they are code.

## 2. The release, in order (one attended session)

1. **The merge on master** happens first: the integration pull request merges on green CI. Everything below runs from THAT commit — clean tree, pushed, CI-green.
2. **Migrations:** `npx supabase@2.122.0 login` → `npx supabase@2.122.0 link --project-ref <your-project-ref>` → `npx supabase@2.122.0 migration list` (204, 205, 206, 207, 208, 209 and 210 pending — §0a) → THE PRE-PUSH CHECKS of §0b, and the clone rehearsal the runbook requires (`docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md`; `docs/DEPLOY.md` names its receipt as required release evidence) → `npx supabase@2.122.0 db push` → `npx supabase@2.122.0 migration list` again (all seven applied on the remote) → bump `supabase/applied-head.json` to 210.
3. **Functions, from the same commit:** `npx supabase@2.122.0 functions deploy` with NO name deploys every function from that commit — the simple and safe form. The minimum, if you deploy by name (measured against master, 2026-11-10): `engine-generate` and `engine-version` (new); `admin-actions` (its own source changed — without it the Analytics line stays empty even with 204 applied), `generate-narrative` and `send-email` (their own sources changed); and every function that imports a shared bundle that moved — `ai-analyst`, `construct-realm`, `construct-settlement`, `custom-content`, `ingest-events`, `interpret-session`, `parley`, `surveyor-autonomy`.
4. **Verify the pin:** `GET <VITE_SUPABASE_URL>/functions/v1/engine-version` must answer `engineVersion` equal to `supabase/functions/_shared/engineBundle.meta.json :: engineVersion` at the merged commit. If it does not, the functions were not deployed from that commit; fix that before the flag, or every pinned caller is answered 409 `engine_version_retired`.
5. **Vercel:** Project → Settings → Environment Variables → Production: `VITE_ENGINE_REMOTE=true` (and `VITE_ENGINE_GENERATE_URL` / `VITE_ENGINE_ADVANCE_URL` if the design's "What the owner does" names them for your project). The value is baked at build time.
6. **Redeploy the client** from the merged commit (the CI-gated deploy job, or a Vercel redeploy of that commit). The shipped `dist/` now has no generator.
7. **Post-deploy verification:** `npm run ops:post-deploy` with the production health and database settings (`docs/ops/POST_DEPLOY_VERIFICATION_RUNBOOK.md`) — it produces the release receipt. The chair's one addition, recommended: a timed call through `engine-generate` for one seed per tier, so the receipt carries a latency number for the first server-side generations.
8. **Watch:** Admin → Analytics' first line "Engine generations (today / this month)" (needs 204 applied); the Supabase dashboard's Edge Functions → engine-generate → Logs for invocations and errors; the 429 rate (the dials) and the 409 rate (a stale client meeting a new engine — the stale-deploy guard reloads such a tab).

## 3. Turning it OFF again

Set `VITE_ENGINE_REMOTE` back off in Vercel and redeploy: the client build carries the generator again and runs it in the worker; the functions may stay deployed, unused.

## 4. What the chair still owes before this step is final

The integration pull request (after MERGE-WAVE, the allegiance train and MERGE-TRAIN, the one full check through the hook, CI green) — at which point this document is amended with the final commit, the full list of functions whose `_shared` stamps moved, and the migrations' final numbers, and its text is copied into the pull request body.
