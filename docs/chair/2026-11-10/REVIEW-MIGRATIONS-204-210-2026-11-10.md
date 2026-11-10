# Pre-deploy review: migrations 204–210 and the code that depends on them

Reviewed ref: `origin/lane/integration-2026-11-07` at `0bfe62f7e` (REF). Production comparison ref: `origin/master` at `db832c892` (migration head 203, `supabase/applied-head.json` says 203).
Deploy document: `docs/chair/2026-11-08/DEPLOY-STEP-2026-11-08.md` (working tree), sections 0a and 2.

Labels: **CONFIRMED** = traced in the SQL or code at REF, and where stated, executed (the real function bodies in an in-process Postgres, or the real composer through a test runner on an export of REF). **PLAUSIBLE** = the mechanism is traced but whether it bites depends on live production data or tool behaviour I could not observe.

Counts: 2 high, 4 medium, 4 low, plus 10 mismatches in the deploy document.

The decision for the owner: findings 1 and 2 both let DM-only content reach players. Finding 1 needs one count query against production before the push. Finding 2 needs a client change (or holding 210 back) before any shared town is re-saved.

---

## Findings, most severe first

### 1. HIGH — 208 turns existing party links into full-DM pages for any town whose "Reveal DM content" flag is set, at the moment the migration applies

- **Where:** `supabase/migrations/208_party_link_independent_idempotent_veiled.sql:156-190` (the projection at `:170-175`); compare 168's body at `168_gallery_visibility_and_featured.sql:287-312`. Client: `src/components/ShareToGallery.jsx:553` and `:590-595`.
- **Mechanism — CONFIRMED (executed).** Under 168, `get_unlisted_dossier` always returned `_gallery_sanitize_public_json(...)`. Under 208 it returns `_gallery_dm_full_json(...)` when `settlements.gallery_share_dm` is true, and splices the full DM record of any NPC whose override says `revealDm: true`. I ran 168's functions, created a link on a row with `gallery_share_dm = true`, then applied 208 whole. The same slug, read as anon:
  - before 208: top-level keys `id, name, npcs, tier, powerStructure`; NPCs reduced to `id, name`.
  - after 208: adds `secrets`, `plotHooks`, and each NPC's `secret` and `goals`.
  - a second row with `gallery_share_dm = false` and one `revealDm: true` override began returning that NPC's `secret`.
- **How a row gets into that state today.** `gallery_share_dm` is written by a direct column update (`src/lib/gallery.js:998`), not by the publish RPC, and nothing clears it: `unpublish_settlement` (059) sets `is_public = false` only, and 168's share does not touch it. So "publish with Reveal DM → remove from gallery → Unlisted link" leaves the flag set on a link that, until now, never honoured it. The old client also writes the metadata before calling `publish_settlement` (master `src/lib/gallery.js:58-63`), so a publish refused by the server leaves the flag set on a never-published row.
- **Incidence — PLAUSIBLE.** Needs this against production before the push:
  ```sql
  select count(*) from public.settlements s
   where s.unlisted_slug is not null
     and (s.gallery_share_dm
          or exists (select 1 from jsonb_each(s.gallery_member_overrides) e
                      where e.key <> '$veil' and e.value ->> 'revealDm' = 'true'));
  ```
- **Why rollback does not undo it.** The disclosure happens on the first read after apply. Restoring 168's body stops further reads; it does not recall what players already loaded.
- **No off switch for a link-only town.** In the new client the "Save gallery details" button renders only when `isPublic` (`ShareToGallery.jsx:553`), so an owner whose town has a party link but is not listed cannot persist a change to the flag without exporting to the gallery. The checkbox copy describes "this gallery page" and does not mention the players' link.
- **Going forward (by design, but worth the owner's eye):** one flag now governs two audiences. A DM who lists a town with Reveal DM on (for other DMs) and also hands players a party link gives the players every secret.
- **Smallest cure:** run the count. If it is zero, the apply-time risk is gone. If not, decide per row before pushing (clear the flag on rows that are linked and not listed, or revoke those links). Separately, show "Save gallery details" in the link-only state and say in the checkbox copy that it applies to the party link.

### 2. HIGH — 210's text projection re-publishes, as sentences, the hall-capture facts that 207 strips as data

- **Where:** `210_public_prose_text_projection.sql:59` (adds `publicProse` to the top-level allowlist; nothing below it filters text). Composer: `src/components/new/publicProseCompose.js:85-87` (`defense:criminal`, which includes a `capture` rung) and `:94` (`power:governance`). `src/components/new/powerDeskRead.js:138-146` calls `governanceAccountOf` with no audience argument. The sentences: `src/domain/display/governanceAccount.js:164-183` (reads `factionRelationships[]` type `corrupted` and `captureState`) and `:315-322`, `:334-341`.
- **Mechanism — CONFIRMED (executed).** The composer runs on the owner's full record at save and ships text. 207 removes `powerStructure.criminalCaptureState`, every `factions[].captureState`, and every relation row that is `corrupted` or carries a `captureState`. I generated corpus towns with the real pipeline, stamped them with the real `composePublicProse`, and passed them through 210's real function body:
  - Town `soak1k-15`: the sanitized output holds no `captureState` and no `corrupted` relation row, and `publicProse.blocks["power:governance"].text` reads: "…The Thieves' Guild has bought people inside the hall. … Its arrests and its offices are no longer the hall's own to give, though it still sits."
  - Town `soak1k-3` (state `equilibrium`): `publicProse.blocks["defense:criminal"].capture.sentence` reads "The hall and the criminals at Al-karez keep the peace because it suits them both, not because either is held back."
  - Town `soak1k-113` (state `none`): "No criminal's money appears in the Grand Merchant Senate's accounts at Lipono…". So the capture state is readable from the text in every stamped town, whatever its value.
  - The client projection (`toPublicSafe` + `projectShareVeil`) then hands the same governance text to the public Power tab (`governanceAccountRead(…, {publicDossier: true})` returned it unchanged).
- **Scale in the corpus:** of 240 towns, 43 have a capture state other than `none`; 17 are `corrupted` or `capture`.
- **Second path, same cause — mechanism CONFIRMED, incidence PLAUSIBLE:** the governance paragraph opens with the seat-holder's name and role (`governanceAccount.js:273-282`). 206 strips `title` and `role` from a veiled face's card; the paragraph prints them. With a crafted record, the card came out as `{id, name}` and the prose still read "Vex, Guildmaster, holds the seat of the Thieves' Guild." It needs a governing power whose face is veiled, which I did not find in the sample.
- **What the design relies on:** the only gate on this channel is each prose pool's `audience: 'player'` marking, on the client. The power desk's capture pools are marked DM-only (its `captureReading` came out null or with a null sentence in every sampled town). The governance account and the defense desk's capture lens are not. The server cannot check any of it: it passes whatever text the save carried.
- **What the tests pin:** `tests/components/publicProseEquality.test.jsx` pins that every sentence the owner's player view prints, the shared page prints. Nothing pins the other direction (that the shipped text carries nothing the sanitizer strips).
- **Smallest cure (client only, no SQL change):** in `publicProseCompose.js`, do not ship the `capture` rung of `defense:criminal`, and draw `power:governance` from a copy of the record with the same rows removed that 207 removes. Do it before the client ships, because the deploy document then tells the owner to re-save every shared town. Otherwise hold 210 (and the re-save step) until the owner rules that this text is player-facing.

### 3. MEDIUM — the gallery veil is applied in the browser only, and a town that has only a party link has no veil at all

- **Where:** `208…sql:156-176` returns the un-veiled dossier plus `gallery_member_overrides`; `src/lib/gallery.js:846-852` ("⚠ CLIENT MIRROR … until it lands the stored payload still carries the veiled facts"); `src/domain/display/galleryVeil.js:1158-1162`; `src/components/ShareToGallery.jsx:380-392` and `:294`.
- **CONFIRMED (read).** Two separate gaps:
  1. Everything the DM hides with the veil (the default-hidden criminal houses, hidden blocks, the per-card eyes) is still in the RPC response. Anyone holding the link can read it in the browser's network tab. This is already true of the gallery page and is recorded in the code; 208 extends it to the players' link, where the readers are the people the veil is aimed at. The prose rungs for hidden blocks (`VEILED_PUBLIC_PROSE`, `galleryVeil.js:752-757`) are likewise dropped client-side only. In snapshot mode the response also carries the live row beside the frozen copy (`gallery.js:827`).
  2. `projectShareVeil` does nothing unless `gallery_member_overrides.$veil` exists (`galleryVeil.js:1160`). That marker is written only by the gallery export (`ShareToGallery.jsx:294`). `handleShareUnlisted` calls the RPC and nothing else, and the veil controls sit in the public-state panel. So a town shared by party link and never exported gets no default veil and offers no way to set one.
- **Not affected:** 206's stamped card bit (`institution.veiled`) is enforced in SQL and does apply to the link.
- **Smallest cure:** write the veil marker when a party link is first made, and correct the document's wording (see D4). A server-side veil is the real fix and is a migration of its own.

### 4. MEDIUM — the hidden-power name mask in 206/207/210 can raise, or rewrite keys, on some names

- **Where:** `206_public_card_veil_bit.sql:317-319`, restated at `207…:272-274` and `210…:267-269`.
- **CONFIRMED (executed against 210's body).** The mask is `replace(out::text, <escaped name>, 'an unseen interest')::jsonb` over the whole document text. The comment says the result is valid JSON by construction; it is not, because the search also matches text outside strings.
  - Hidden power named `true`, `null`, `1`, `e`, a single space, `: ` or `{` → `invalid input syntax for type json`. The function raises, so `get_gallery_dossier`, `get_unlisted_dossier`, `import_gallery_dossier` fail for that town, and `get_gallery_map` (`088…:226`) fails for a shared campaign that contains it.
  - Hidden power named `name`, `id` or `text` → keys are rewritten: output contained `"an unseen interest":"Town"` in place of `"name"`.
  - Any name is replaced as a substring everywhere, in every public string: a hidden power "The Independent Bloc" (a name the generator does produce) turned the settlement name "The Independent Bloc Hall" into "an unseen interest Hall".
- **Reach:** one town's public reads, never a listing (no listing RPC calls the sanitizer). The generator's own names are multi-word and do not raise; the raising cases need a renamed or hand-written power. Substring replacement in other names happens with generated names.
- **Related fail-open edge — CONFIRMED (executed):** the removal of a hidden row sits inside `if hidden_names is non-empty` (`210…:220-230`). A row stamped `hidden: true` whose `faction` is missing or empty stays in the public output, description and all.
- **Smallest cure:** mask string values and keys by walking the document rather than replacing over its text, and move the hidden-row removal outside the name check. Until then, the client could refuse to save an empty or very short name for a hidden power.

### 5. MEDIUM — a stamped town can print stale sentences; the "silent, never a wrong re-draw" promise holds only for a missing stamp or a different format version

- **Where:** `src/domain/display/publicProse.js:45` (the only freshness test is the format tag `pp-1`); `src/lib/canonEventCommandPersistence.js:79, :145, :147`; `src/lib/saves.js:260-264, :278-296`.
- **CONFIRMED (read, not executed).** Nothing ties a stamp to the record it was drawn from. Three ways a current-format stamp outlives its record:
  1. The canon commands (`apply_cut_trade_route_command`, `apply_create_route_command`, migrations 183/193) write `p_next_data` straight from the store, bypassing the row builder. That record carries the stamp adopted from the last save, drawn before the command changed the town (and its partner).
  2. If the lazily loaded composer fails, `publicProseForRow` returns null and `withPublicProse(record, null)` writes the record as it is, old stamp included. The failed `import()` promise is cached (`saves.js:261-263`), so every later save in that tab does the same. A chunk that no longer exists after a deploy is the usual cause.
  3. PLAUSIBLE: an old-client tab that loaded a stamped row saves it back with its edits and the stamp untouched.
- **Consequence:** the shared page prints sentences about a town state that no longer exists, beside current data. If the change was the DM removing or renaming something, the old sentence still names it.
- **Smallest cure:** on composer failure, write the record without `publicProse`; in the command path, drop `publicProse` from `p_next_data` (or re-stamp). A content hash in the stamp would close the class.

### 6. MEDIUM — the `@rollback` headers are each correct alone but unsafe as a set, and 208's is unsafe without rolling the client back too

- **Where:** `205…:56-59`, `206…:69-72`, `207…:25-28`, `210…:21-23`, `208…:48-55`. No down script exists for 204–210 under `supabase/rollback/`.
- **CONFIRMED (read; the 208 case executed).**
  - 205, 206, 207 and 210 are four whole-body restatements of one function. Each header says "recreate the previous file's body verbatim". That is right only in strict reverse order. Rolling back 206 alone after 210 is applied, by the header, installs 205's body: it silently drops 207's capture strip and 210's `publicProse` token as well. Rolling back 207 alone drops 210's token.
  - 208: after restoring 168's bodies, a press of "Unlisted link" on a listed town (a button the new client shows in the public state, `ShareToGallery.jsx:590-595`) sets `is_public = false` and `is_featured = false` and mints a new slug. Executed: on a listed and linked row the slug changed and `is_public` became false. So "no data is lost either way" needs the condition "and the client is rolled back in the same act".
  - Data lost on rollback, per file: none in tables for any of the seven. 208's constraint drop and function restore lose nothing by themselves. `data.publicProse` stays in saved rows after a 210 rollback (inert; still passed by the DM-full share).
- **Smallest cure:** state in the document that the four sanitizer files roll back last-in-first-out only, and that a 208 rollback goes with a client rollback.

### 7. LOW — 209 stops admitting any Surveyor entitlement row whose source is not `grant`

- **Where:** `209_surveyor_premium_only.sql:70-73`; `139…:51` (`source` is nullable, free text).
- **CONFIRMED (executed) for the rule; PLAUSIBLE for incidence.** A free-tier account with an active row of source `subscription`, or with a null source (a row inserted by hand), was admitted by 201 and is refused by 209. Premium, Founder, staff and `grant` rows are admitted. The header says so for `subscription` and argues no such row provably exists; a null or other source is not discussed.
- **Pre-push check:** `select source, status, count(*) from public.surveyor_entitlements group by 1, 2;`
- **Smallest cure:** if the count shows non-`grant` active rows on non-premium accounts, re-grant them through the admin path before the push.

### 8. LOW — 204's "service_role only" grant likely leaves anon and authenticated able to call the report

- **Where:** `204_engine_generation_report.sql:61-62`.
- **PLAUSIBLE.** `revoke all … from public` removes the PUBLIC grant only. A hosted Supabase project normally carries default privileges that grant EXECUTE on new `public` functions to `anon` and `authenticated` by name; those survive. With such defaults modelled, `has_function_privilege('anon', 'public.report_engine_generations()', 'execute')` was true after 204. The function is SECURITY DEFINER and returns counts by op and outcome, no identity. Migration 113 in this repo names the two roles explicitly for this reason.
- **Check on production:** `select has_function_privilege('anon', 'public.report_engine_generations()', 'execute');`
- **Smallest cure:** add `revoke all on function public.report_engine_generations() from anon, authenticated;`.

### 9. LOW — 208 takes an ACCESS EXCLUSIVE lock on `settlements` with no lock timeout

- **Where:** `208…:63-66`.
- **CONFIRMED (read).** `add constraint … check` takes ACCESS EXCLUSIVE and validates every row. The check reads two inline columns, so the scan is proportional to row count, not to dossier size. The risk is the wait: if a long transaction holds any lock on `settlements`, the ALTER queues behind it and every read and write of the table queues behind the ALTER. If the CLI runs the file as one transaction (assumed, below), the lock is held to the end of the file, which is short.
- **Backfill:** the UPDATE touches only rows where `visibility` disagrees with the slug. Executed: zero consistent rows were touched; a drifted row was rewritten and its `updated_at` bumped by the 001 trigger. Every writer I found keeps the two in step (168's RPCs, `171…:227`), so I expect zero rows. Pre-push check: `select count(*) from public.settlements where (visibility = 'unlisted') <> (unlisted_slug is not null);`
- **Smallest cure:** `set local lock_timeout = '5s';` at the top of 208, or add the constraint `not valid` and validate in a second statement.

### 10. LOW — the cost line added by 204 needs `admin-actions` redeployed, which the document does not name

- See D9. `supabase/functions/admin-actions/index.ts` changed at REF to map `engine_generations` to `report_engine_generations`. With the old function deployed, 204 applies cleanly and the Admin → Analytics line stays empty.

---

## The deploy document, sections 0a and 2: mismatches against the SQL

| # | Document (line) | What the SQL or code says | Label |
|---|---|---|---|
| D1 | L33: "a bare Cartographer is refused on the AI layer" | The opposite. 209 newly admits an active premium tier, "Cartographer and above" (`209…:22-24, :68`); the client gate reads `tier === 'premium'`. Line 24 of the same document states it correctly. | CONFIRMED |
| D2 | L21, 206: "a face's house or secret you veiled stays veiled on the shared page" | 206 reads a bit the generator stamps (`institution.veiled`), not a choice the DM makes, and adds nothing about secrets. The DM's per-card eye stays a client-side projection (`206…:49-52`). The row also omits what 206 does do: removes hidden powers' rows, masks their names, and strips title and role from cards saved by the people car before the bit existed. | CONFIRMED |
| D3 | L22, 207: "DM truth, never shown to players" | True of the data; 210's text prints it (finding 2). | CONFIRMED |
| D4 | L23 and L31: the link "honours the veil exactly as the gallery page does"; "a veiled face stays veiled on the link" | The SQL builds the link's dossier as `get_gallery_dossier` does, which is true and is also what makes Reveal DM apply to the link (unmentioned, finding 1). The veil itself is applied in the browser, and a link-only town has none (finding 3). | CONFIRMED |
| D5 | L23: "No data is lost either way" | No row is lost. Applying can disclose DM content on existing links, which rollback cannot recall; rolling back without the client delists and un-features on the next press (finding 6). | CONFIRMED |
| D6 | L27: "The applied-head line in `docs/DEPLOY.md` is bumped in that same act" | The `docs/DEPLOY.md` line is the head on disk, already `210_…` at REF and pinned by `tests/docs/deployRunbookFreshness.test.js`. The ledger to bump is `supabase/applied-head.json` (`appliedHead` 203 → 210), as all seven migration headers say. Followed literally, the ledger stays at 203. | CONFIRMED |
| D7 | L27 and L44: `db diff` "must then be empty" / "empty = the remote matches the tree" | As I understand CLI 2.x, `db diff` without `--linked` compares against the local database and needs Docker; it does not read the remote. Not verified here. | PLAUSIBLE |
| D8 | L29: a save with "no stamp (or an older one) prints nothing … never a wrong re-draw"; "the client stamps `publicProse` into the save at every save" | Only an older format version prints nothing. The command paths do not stamp, and a failed composer keeps the old stamp (finding 5). | CONFIRMED |
| D9 | L45 and L50: deploy `engine-generate` and `engine-version` "plus any other function whose `_shared` stamp moved"; the analytics line "needs 204 applied" | `admin-actions/index.ts` itself changed (not a `_shared` stamp) and must be deployed for the line to appear. `generate-narrative/prompts.ts` and `send-email/index.ts` also changed. | CONFIRMED |
| D10 | §2 step 2 goes from `migration list` to `db push` | `docs/DEPLOY.md:228-239` calls a clone rehearsal "required release evidence" before a production push. The step names neither it nor `db push --dry-run`. | CONFIRMED |

Line 15's "nothing here is a claim a header does not make" does not hold for D1 and D2. Section 0 (outside the asked scope) describes 207 as deleting `factionRelationships[].captureState`; the SQL drops those rows whole.

Checked and correct: the seven file names and their order; "Drop that one function" (204); "Recreate 189's / 205's / 206's body verbatim" and "Re-apply 207's body" as quotes of the headers; 208's "five functions recreated, one check constraint, one backfill"; 209's "one function, no table, no row" and line 24's three admitting cases; 210's "one allowlist token added"; contiguous numbering 204–210.

---

## Per-migration table

| # | Applies on live rows | Re-run / resume | Locks | Security | Rollback header | Old client on new SQL |
|---|---|---|---|---|---|---|
| 204 | Clean. New read-only function; no table touched. Executed, including against rows without `op`. | `create or replace`; applied twice cleanly. | None. | Definer, `search_path = public, pg_temp`. Grant posture: finding 8. | Complete. | No effect. Needs new `admin-actions` to be visible. |
| 205 | Clean. Body is 189's with three keys removed (diffed: no other code line changed). Existing shared pages lose NPC faction affiliations at apply. | `create or replace`; ACL preserved. | None. | Only hides. | Correct in LIFO order only (finding 6). | Old pages show less. |
| 206 | Clean. Master's generator writes no institution record, so I expect no existing production row to carry one and the per-card rule to be inert until the new client saves. The root pass acts at once: hidden powers leave existing public pages. | Same. | None. | Finding 4 (mask). The DM's eye stays client-side. | Correct in LIFO order only. | Old pages show less. |
| 207 | Clean. 206's body plus one block (diffed: nothing removed). Capture state leaves existing public pages at apply. | Same. | None. | Only hides, as data. Undone as text by 210 (finding 2). | Correct in LIFO order only. | Old pages show less. |
| 208 | Applies. Backfill expected to touch zero rows; constraint validated on all rows. SQL-language `get_unlisted_dossier` compiled against 093's six-argument splice. | Whole file applied twice cleanly (drop-if-exists then add). | ACCESS EXCLUSIVE, validation scan, no timeout (finding 9). | Finding 1 (DM-full on existing links), finding 3. Five definer functions, all with pinned `search_path`; anon may execute `get_unlisted_dossier` by design. The read still has no filter for an admin-soft-deleted settlement, as in 168. | Loses no rows; needs the client rolled back with it (finding 6). | Works. The old client shows the link button only for unlisted towns and ignores the new fields; it receives the DM-full payload where finding 1 applies but does not render it. |
| 209 | Clean. One function. | `create or replace`, revoke and grant restated; applied twice cleanly. | None. | Widens: every premium account is admitted to the nine AI functions. Narrows: finding 7. Definer, pinned. | Complete. | Works; same signature. |
| 210 | Clean. 207's body with one token added (diffed: one line). Inert until a new-client save writes `publicProse`. | `create or replace`. | None. | Finding 2, finding 5. Readers of the text: anon through `get_gallery_dossier` and `get_unlisted_dossier`, premium accounts through `import_gallery_dossier`, and anon through `get_gallery_map` for every settlement of a shared campaign, whether or not that settlement is itself listed. Rendered as React text; I found no raw-HTML sink for it. | Correct if rolled back first. | Old client never writes or reads it. New client on an unstamped row prints nothing (pinned by `tests/domain/publicProse.test.js`). |

**Ordering.** 205 ← 189, 206 ← 205, 207 ← 206, 210 ← 207; 208 and 209 do not redefine the sanitizer, so 210 restating 207 is safe. No forward reference. Numbers are contiguous and the plan builder accepts 203 → 210 as seven one-file waves (run).

**Transactions — verified versus assumed.** Verified in the files: none of the seven contains `begin`, `commit`, `concurrently` or any statement that cannot run inside a transaction. Assumed, not verified: that `supabase db push` 2.122.0 applies each file and its history row as one atomic batch, so a failure in 208 leaves 204–207 applied and recorded and a re-push resumes at 208. If it is not atomic, every file is still safe to re-run as written.

---

## The rehearsal harness

`scripts/ops/migrationRehearsalCore.mjs` is planning and admission policy; `tests/ops/migrationRehearsal.test.js` exercises it with no database.

**What the test proves:** the wave manifest covers every pending migration exactly once and ends at the repository head (210); the chain is contiguous with no duplicate number; an applied head inside a wave is refused; each pending migration has a stated rollback posture; a clone is admitted only with a fresh, host-bound, isolated attestation that does not match a production reference; the integrity comparison fails on a shrinking row count or a worsening invariant; credentials are not printed.

**What a real clone run would add** (the shell, `migration-rehearsal.mjs`, run by the owner): each file applies without SQL error on production-shaped data, including 208's backfill and constraint validation; migration history is contiguous; `profiles`, `settlements` and the two credit tables do not lose rows; no invalid constraint; credit balances still reconcile.

**What neither proves for these seven:**
- Any behaviour of a restated function. Findings 1, 2 and 4 are invisible to it.
- That anything changed at all in six of the seven waves: the "expected objects" for 205–210 already exist before the push, so the presence check passes vacuously. Only 204's function is new.
- That `settlements_visibility_derived` exists afterwards (only that no constraint is invalid), or how many rows the backfill touched.
- Function privileges (finding 8).
- Any rollback: all seven classify as `documented-manual-reversal`, which is never executed.
- Old-client compatibility, the edge functions, or the client code.

I found no record that a clone rehearsal has been run for 204–210, and the deploy step does not call for one (D10).

---

## What I did not check

- Anything on the live database: row counts for findings 1, 7 and 9, actual function privileges, default privileges, the Postgres version. The in-process Postgres I used is not production's.
- How `supabase db push` wraps a file, and what `db diff` compares (stated as assumptions).
- The client twin `publicSafe.js` against the SQL field by field; I read it in places only.
- Every prose desk's pools for DM-only content. I traced the governance account and the defense capture lens and sampled the rest on six towns. Other sites may carry more.
- Whether the old client renders every public page without error on the reduced payload (read, not run).
- `engine-generate` beyond its cost-log insert (shape matches `analytics_events`, including `batch_id` and `seq`); its auth and rate limiting were not reviewed. `engine-version` was not read.
- The map link RPCs and `saved_maps` (untouched by 208), and how account deletion and admin soft-delete treat an existing party link.
- Sanitizer performance on large dossiers.
- The repository's own test suites: none were run. The evidence above is from my own probes, kept in the `probe/` folder (SQL probes) and the `refexport/tests/probe/` folder (composer probes on an export of REF) beside this report.
