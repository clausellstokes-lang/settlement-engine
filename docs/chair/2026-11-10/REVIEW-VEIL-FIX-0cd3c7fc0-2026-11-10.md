# Re-review: the veil-fix lane at `0cd3c7fc0`

**Verdict: BLOCKED.** Two blocking findings:

1. The players' link still returns the full DM copy for a town exported to the gallery with "Reveal DM content" in snapshot mode (the default). It travels inside `gallery_member_overrides`.
2. The stale-stamp cure on the canon commands makes Cut Trade Route and Create Route fail on every settlement the new client has saved once.

Everything else the lane set out to cure is cured or cured within its ruling. Counts: 2 high (both blocking), 1 medium, 4 low.

Reviewed: `origin/lane/veil-fix-2026-11-10` at `0cd3c7fc0`, 14 commits on `58aae07fb`. Labels as in the first report: **CONFIRMED** = traced at the tip, and where stated, executed against the real SQL bodies or the real client code on an export of the tip; **PLAUSIBLE** = mechanism traced, outcome depends on something I could not observe.

---

## Findings, most severe first

### 1. HIGH, BLOCKING — the party link's response still carries DM-only content: the frozen snapshot inside `gallery_member_overrides`

- **Where:** `supabase/migrations/208_party_link_independent_idempotent_veiled.sql:188` returns `s.gallery_member_overrides` whole. The snapshot is written by `src/hooks/useGalleryShareControls.js:62` through `src/domain/display/galleryVeil.js:951-956` (`full: shareDm === true`), and kept by the write clamp (`src/lib/gallery.js`, `clampMemberOverrides`).
- **Mechanism — CONFIRMED (executed).** A gallery export in snapshot mode, which is the default mode, stores the whole public copy under `gallery_member_overrides.$veil.snapshot`. With "Reveal DM content" on, that copy is the full DM projection. I built it with the real `galleryPayloadFor(settlement, { shareDm: true })` on a corpus town: 155,710 characters against 90,463 for the public copy, and each NPC carries `goal`, `secret` and `plotHooks`. Per-member `revealDm` puts that member's DM record in the copy the same way.
- **At the tip, executed against 208's real body:** a row that is listed with Reveal DM, holds such a snapshot, and has a party link. Read as anon by slug:
  - `dossier`: sanitized (keys `id, name, npcs, tier, powerStructure`; NPCs `id, name`); `gallery_share_dm`: false. That part of the cure works.
  - the response as a whole still contains the planted secret and plot hook, under `gallery_member_overrides`.
- **Why this is the lane's own scenario, not an edge:** ruling R1 exists for the DM who lists a town with Reveal DM for other DMs and gives the players a link. With the new client that is two button presses ("Export to gallery" with the box ticked, then "Unlisted link"), and the first press writes the snapshot.
- **What the page does:** `src/lib/gallery.js:846` takes the snapshot as the page's source, then strips it in the browser (`full: false`). I ran that path: no DM key reached the render. So the page is clean and the payload is not; a player reads it in the network tab or with one request to the RPC.
- **Existing rows — PLAUSIBLE.** Under the production client "Remove from gallery" clears the overrides, so I expect few rows to hold both a link and a snapshot today. Count before the push:
  ```sql
  select count(*) from public.settlements
   where unlisted_slug is not null
     and gallery_member_overrides #> '{$veil,snapshot}' is not null;
  ```
- **Smallest cure:** in 208, return `s.gallery_member_overrides #- '{$veil,snapshot}'`. The client already falls back to the live sanitized `dossier` when the snapshot is absent (`gallery.js:846`), which also matches the link's own promise that it "always shows your latest changes". Add a pin that the whole response, not only `dossier`, holds none of the planted secrets.

### 2. HIGH, BLOCKING — Cut Trade Route and Create Route are refused by the server for every stamped settlement

- **Where:** `src/lib/canonEventCommandPersistence.js:56-60, :94, :160, :162` (the lane's `withoutPublicProse` on the next projections). Server, already applied in production: `supabase/migrations/183_application_command_journal.sql:374-389` and `193_create_route_command.sql:76-110, :338, :342`.
- **Mechanism — CONFIRMED (executed).** Both RPCs refuse a command whose next record differs from the expected record anywhere outside a short list of fields (`config`, `_config`, `activeConditions`, `reconciliationLog`, and for a route `neighbourNetwork`). The lane sends the expected record with its `publicProse` stamp (it must, to match the row) and the next record without it. `publicProse` is not on the list.
  - I drove the lane's real `commitCutTradeRouteCommand` against 183's real function. Unstamped row: `applied`. Stamped row: throws `22023: CUT_TRADE_ROUTE changed an unrelated settlement field`; the row is unchanged.
  - 193's `create_route_envelope_violation(expected with stamp, next without)` returns true; with the stamp on both sides it returns false.
- **Who is affected:** every cloud settlement after its first save by the new client, since every save stamps and the store adopts the stamp. At the lane's base the same command succeeded (carrying the old stamp).
- **Why the lane's pins did not see it:** `tests/lib/canonEventCommandPersistence.test.js` checks the arguments against a stub; the SQL suites call the RPCs with their own fixed inputs.
- **Smallest cure:** revert the three `withoutPublicProse` call sites, which restores the base behaviour (the command works; finding 5's first path stays open). The durable cure needs the server: a new migration that subtracts `publicProse` on both sides of the two envelope checks, landing before the client that strips. A client-only alternative is a normal save straight after a committed command, which re-stamps.

### 3. MEDIUM — 210's header, its rollback note and the rehearsal manifest no longer describe the file

- **Where:** `supabase/migrations/210_public_prose_text_projection.sql:24-25` ("with ONE token added") and `:33-35` (`@rollback: re-apply 207's body verbatim — this same function without 'publicProse'`); `scripts/ops/migrationRehearsalCore.mjs:819, :829` (quotes both), and `:748` (still quotes 208's old "(d)": "EXACTLY as get_gallery_dossier … returns gallery_share_dm").
- **CONFIRMED (read).** 210 now differs from 207 by the walking mask and the moved hidden-row removal as well as the token. Rolling 210 back by its header reinstalls 207's body: the mask that raises on some names and rewrites keys, and the hidden row that stays when its name is empty. 206 and 207 say in their new header notes that their own bodies are known-defective and superseded; 210's rollback note sends the operator back to one of them.
- **Smallest cure:** reword 210's "THE SHAPE" and `@rollback` (the rollback target is this body without `'publicProse'`, not 207's), and refresh the three manifest strings. Or amend the mask in 206 and 207 as well, since none has been applied; that also closes finding 6.

### 4. LOW — what the new name mask still does, or no longer does

- **Where:** `210…sql:286-309`; twin `src/domain/display/publicSafe.js:351-360`.
- **CONFIRMED (executed against the tip's body):**
  - Only the root `name` is protected. A hidden power named `1` rewrote the settlement `id` (`s1` → `san unseen interest`), every NPC `id`, and `publicProse.v` (so that town's prose reads as a wrong version and prints nothing). Short names still rewrite every string that contains them.
  - A key equal to a hidden name is now left as it is. 206's mask covered keys on purpose. Measured: of 900 corpus towns, 23 have hidden powers, and in none of them does the sanitized output contain a hidden name anywhere, keys included, so I found no live instance.
  - The server treats a no-break space as a character; the client's `/\S/` treats it as blank. A hidden power named with only that character masks on the server and not on the client.
- **Not a regression:** when one hidden name contains another, the longer one is left half-masked ("an unseen interest of Night"). The lane records it.
- **Smallest cure:** skip leaves whose last path element is `id`, and `publicProse.v`; treat the rest as accepted edges.

### 5. LOW — cost of the two cures

- **CONFIRMED (measured in the in-process engine; production will be faster in absolute terms).**
  - `publicVeiledRecordOf` deep-clones and masks the whole record on every call, and the composer reaches it ten times per record (eight defense lenses, the power desk, the governance account). `composePublicProse` on a 372 KB metropolis: 135 ms at the base, 224 ms at the tip; 43 → 81 ms on a 222 KB town. It runs on the main thread at every save, per record. The owner's player-view tabs also call it on each render.
  - The mask calls `jsonb_set` on the whole document once per changed leaf (`210…:308`). On real towns that is a handful of leaves and the cost is not visible (a 389 KB metropolis with two hidden powers: 274 ms, in line with towns without one). On a synthetic 314 KB document where 3,000 strings name the hidden power: 5,967 ms against 1,432 ms for the base body.
  - 208 now evaluates the sanitizer twice per read (`208…:190-191`).
- **Smallest cure:** one veiled record per compose call, passed to the three readers; collect the masked leaves and rebuild once if the mask cost ever shows.

### 6. LOW — if 208 times out on its new lock timeout, production runs on 207's body until the re-push

- **Where:** `208…:79`.
- **CONFIRMED (read).** The timeout is the right call, and it adds a deliberate failure path. A failed 208 leaves 204–207 applied, so the live sanitizer is 207's, with the defects finding 3 lists. Generated names do not raise, so the exposure is small and ends at the re-push.
- **Smallest cure:** say so in the deploy step (re-push at once after a timeout), or amend 206 and 207 as in finding 3.

### 7. LOW — a Reveal-DM gallery page now prints the player draw of the governance paragraph and the capture lens

- **Where:** `src/components/new/publicProseCompose.js:89, :99`.
- **CONFIRMED (read).** The shipped text is one text for every reader of a shared page. On a gallery page the owner opened to other DMs, the data shows the capture state and the paragraph no longer mentions it. This follows from the projection being the player view; every other desk already behaved this way. Recorded so the owner sees it, not as a defect.

---

## Item 1: is each finding cured at the tip?

| First-report finding | Status | Evidence at the tip |
|---|---|---|
| 1. 208 turns links into DM-full pages | **PARTLY** | `dossier` is cured: `208…:187-193`. Executed: a row with `gallery_share_dm = true` and a row with a `revealDm: true` override both return the sanitized dossier, and `gallery_share_dm` is false. Client never enters DM mode: `gallery.js:828, :867`, `PartyLinkView.jsx:33`. What remains: the snapshot in `gallery_member_overrides` (`208…:188`), finding 1 above. |
| 2. 210's text re-publishes capture facts | **CURED** | `publicSafe.js:429-444`, `powerDeskRead.js:72, :153`, `defenseDeskRead.js:89`, `publicProseCompose.js:99`. Executed on 240 corpus towns through the tip's composer and 210's body: no capture sentence in any shipped text (11 of those towns have one in the DM's paragraph); no `capture` rung shipped in any town. The three specimens: soak1k-15 no longer says "has bought people inside the hall"; soak1k-3 and soak1k-113 ship `capture: null`. The crafted veiled seat ships "Jabir ibn Khalid holds the seat", without the role. The public page prints the stripped paragraph. The DM's own draw of all three readers is identical to the base on the four towns I compared, and only the three intended sites changed in the shipped text. |
| 3, second gap. A link-only town has no veil | **CURED**, in the browser, as ruled | `gallery.js:842-844`. Executed with the real veil functions: an unmarked share reads as marked through `writeShareVeil(null, [])`, the default set applies (25 addresses on soak1k-15) and the `defense:criminal` text is dropped. An unmarked listed page is unchanged. The response itself is not veiled, and the link-only town's DM still has no controls; both were deferred by ruling. |
| 4. The name mask raises or rewrites keys | **CURED** for what was reported | `210…:195, :236-246, :286-309`. Executed with 16 names: none raises, no key is rewritten, the root `name` is kept, blank names are skipped, and hidden rows with a missing, empty or blank `faction` leave. Server and client projections are deep-equal on the 260 corpus towns I compared (the first 240, and the 20 with hidden powers among the next 660). In all 23 towns with hidden powers the name appears nowhere in the output. Residual edges: finding 4. |
| 5, path 1. Canon commands write a stale stamp | **NOT CURED; the cure breaks the command** | Finding 2 above. Net effect is worse than the base. |
| 5, path 2. A failed composer keeps the old stamp | **CURED** | `saves.js:265` (a failed import is retried), `:294` and `:302-309` (the row is written without a stamp), `settlementSlice.js:155-165` (the store drops its stamp too, so the next command's compare still matches). Read; the lane's pins for it pass when I run them. A good stamp is lost only when the composer fails, which is the intended fail-closed. |
| 8. 204 leaves anon able to call the report | **CURED** | `204…:67`. Executed with the hosted default grants modelled: anon false, authenticated false, service_role true; the anon call is refused. Applied twice cleanly. |
| 9. 208's exclusive lock with no timeout | **CURED** if the file runs in one transaction (PLAUSIBLE) | `208…:79`. In a multi-statement batch the setting was in force inside the batch and gone after it. Outside a transaction `set local` only warns, which is no worse than before. 208 as a whole still applies twice cleanly and the constraint is present. |

**Item 2, the remaining checks.** `get_unlisted_dossier` keeps its signature, definer status, pinned search path and anon grant (read from the catalog after applying). No reader of the link other than the players' page consumes the widened view. Rollback headers for 204 and 208 still match their files; 210's does not (finding 3). I found no place where the DM's own view hides more than before.

---

## What I did not check

- Anything on the live database: the count for finding 1, how `supabase db push` wraps a file, the production Postgres version. Timings are from the in-process engine.
- The lane's test edits line by line. I ran six of its files at the tip (84 tests, all pass): `saves.smoke`, `publicProseAdoption`, `partyLinkClient`, `galleryUnlisted.pglite`, `gallerySanitizer.pglite`, `partyLinkView`. I did not run its invariance pin, the ring-note pin, or the repository's sweep, and I did not verify its statement that the ten sweep failures match the base.
- Create Route end to end. I executed its envelope function, not the whole RPC.
- The ring note (R3) beyond reading it and seeing it shipped, masked and dropped with the veiled block.
- Whether the old production client renders correctly against the amended 208 (read only: it ignores the new fields).
- The prose sites that still draw on fields the sanitizer strips, apart from confirming none ships a DM-only string verbatim. On 60 towns, drawing from the sanitized record changes `overview:identity` (60), `general:viability` (29), `power:governance` (4, the seat-holder's name) and `viability` (4). Each is a derived sentence, and whether each is player-facing is the owner's ruling, outside this lane.
- The same snapshot on the gallery read (`get_gallery_dossier` also returns it, including copies frozen before 205–207). That page is outside this lane by ruling.

Probes are in the `probe2/` folder and in `tipexport/tests/probe/` beside this report.
