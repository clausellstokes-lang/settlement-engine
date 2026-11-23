# COHERENCE-VEIL — phase 2 hand-back: migration 211, the server-side share veil

Seat: COHERENCE-VEIL. Lane: `lane/coherence-veil-2026-11-11`. Its base is the integration line's tip `decc7bf15`, plus the phase-1 proposal (`5b563a4aa`). Written for a reviewer who has not seen the seat's conversation.

The charter is `CHARTERS-COHERENCE-2026-11-11.md` §0 and §6 on the chair's lane. The proposal is `COHERENCE-VEIL-PHASE1-PROPOSAL.md` beside this file. The rulings come from three of the chair's messages of 2026-11-12: phase 2 GO with eight rulings; the ruling on the timing STOP; and the added gate law.

**Migration 211 is a FILE.** No seat applied it anywhere. The deploy is the owner's.

## 1. What changed, in one paragraph

The veil a DM sets by hand in the share panel ("Curate for visitors", stored in `settlements.gallery_member_overrides.$veil`) used to be applied only in the reader's browser. The server's response carried everything the page hides. Migration 211 adds an SQL twin of the browser's veil (`_gallery_veil*`) and runs it inside four public reads:
- the gallery page (`get_gallery_dossier`);
- the party link (`get_unlisted_dossier`);
- the map page's member towns (`get_gallery_map`);
- the import (`import_gallery_dossier`).

Each read now sends the dossier already veiled. Its `gallery_member_overrides` is rebuilt from an allowlist: each member's two booleans and a served marker `{v: 2, mode, at, groupings}`. No delta list and no frozen copy travel.

A share in snapshot mode is served its frozen copy, run through the same sanitiser (or DM-full strip), member splice and veil. The live row is no longer sent beside it. An old frozen copy is cleaned at read, so no re-export is owed.

The client twin reads `v: 2` as "already applied". It re-runs only the groupings (a removal, so it changes nothing) to mark them for the Defense tab, and it does not project the payload a second time.

## 2. The commits (tip `16359998`, pushed and read back; one cause each)

| Commit | Cause |
|---|---|
| `02f111f36` | **RED PIN.** `tests/security/galleryServerVeil.pglite.test.js`, red at `5b563a4aa`: 11 of 15 checks fail. The reads carry what the page hides, an array `$veil` raises, and the sanitiser runs twice per link read |
| `b545d6113` | **THE CURE**: migration 211; `galleryVeil.js` (`isServedVeil`, `projectServedVeil`, `VEIL_LIMITS.servedVersion`); `gallery.js` (`sanitizeDossier`). It also moves the head line 210 → 211 in the rehearsal wave, its test, `DEPLOY.md`, `ARCHITECTURE.md` and `CURRENT_STATE.md`. `get_gallery_dossier` takes the `pg_temp` pin and leaves both search-path ledgers |
| `d5bd5b391` | The pin's two negative assertions anchored; its mutation-coverage row |
| `aae7a00f7` | Lighting census re-measured by its own command (+1 file, +1 parked) |
| `4375d1c17` | **CURE 2 (ruling 4)**: a stored delta list read at the clamp's cost (an `offset 0` fence). The pin gains the over-limit row |
| `0d208d76b` | **GUARD (ruling 7)**: `tests/security/playerRecordVeiledFace.test.js` |
| `823770295` | Lighting census re-measured (+1 file, +1 credited, +4 titles, +1 suite) |
| `4d6203e63`, `cdb11c074`, `e6cf01787`, `e90510afd`, `16359998`, this commit | Probes and their measures under `veil-probe/` |

## 3. The class, before and after, on the same 360 rows (ruling 8)

`veil-probe/corpus.probe.mjs` builds the charter's corpus:
- 60 villages, 160 towns, 100 cities and 40 metropolises, seeds `coherence-veil-corpus-<tier>-<k>`, every dial random;
- each row veiled by hand through the panel's own model in five ways;
- every row read through the real client read at 210 and at 211.

It takes 34 minutes. The table is in `veil-probe/out/corpus.json`. Each cell is carried paths / readable strings over the 360 rows:

| Share | Read | At 210 | At 211 | Page changed at 211 |
|---|---|---|---|---|
| default veil | gallery | 18,206 / 8,277 | **0 / 0** | 0 |
| default veil | link | 18,206 / 8,277 | **0 / 0** | 0 |
| every default opened | gallery | 0 / 0 | 0 / 0 | 0 |
| every default opened | link | 0 / 0 | 0 / 0 | 0 |
| every eye shut | gallery | 349,788 / 213,498 | **0 / 0** | 0 |
| every eye shut | link | 349,788 / 213,498 | **0 / 0** | 0 |
| every eye shut + Reveal DM | gallery | 466,108 / 294,336 | **0 / 0** | 0 |
| every eye shut + Reveal DM | link | 349,788 / 213,498 | **0 / 0** | 0 |
| every eye shut, snapshot | gallery (row + frozen copy) | 699,576 / 426,996 | **0 / 0** | 0 |
| every eye shut, snapshot | link | 349,788 / 213,498 | **0 / 0** | 0 |

"Page changed" compares the 211 page with the 210 page of the same share read live. Keys are sorted and undefined keys dropped, because the 210 client rebuilt a face's card in its own key order and left `title: undefined` on a veiled face; neither reaches a reader. Faults at 211: **0 of 3,600 reads.**

**Sizes covered: village, town, city and metropolis.** Neither the routine pin nor the 360 births a thorp or a hamlet.

## 4. The pins and the guard

**`galleryServerVeil.pglite.test.js` (16 checks, all pass, about 7 minutes).**
- **The towns.** Eight towns, two of each size (village, town, city, metropolis), chosen so that every kind of hidden thing is present:
  - a criminal house hidden whole;
  - a veiled face;
  - a criminal power;
  - a HIDDEN power (one city has the "infiltrated" stress, which a DM can pick in the wizard);
  - defence vulnerabilities;
  - every card kind.
- **The configurations.** Each town runs through every configuration the panel can set:
  - default; every grouping; every class switch; every hideable house; every face; every face field; every power field; every other field; all of them; every default opened; mixed;
  - each live and as a new frozen copy;
  - for the default, all and opened configurations, also an OLD frozen copy (the raw record) and Reveal DM.
- **What it asserts:**
  1. Nothing is carried and nothing is readable on gallery `data`, link `dossier`, the map member and the import, and the overrides hold only the allowlist.
  2. No page changes against 210's live page of the same share, and the frozen copy's mode and time survive.
  3. **The red control**: 210 carries readable strings on the same rows.
- **The edges.** The `$veil` shapes never raise or leak: array, string, null, an extra key, an old copy, a stored v2. An anonymous legacy event is veiled fail-closed.
- **The over-limit row.** The real eyes come first, then malformed and over-long entries, 5,000 more, a kept tail and an eye reopened last. Response, page and the 210 client's own projection of the stored row are all equal.
- **The helpers' twins, by execution.** `_gallery_veil_slug` against `slugifyEntity`, including the two characters whose JS lower case is ASCII (U+0130, U+212A), found by scanning every code point. `_gallery_veil_house` against `isHideableHouse` on generated and crafted houses. A guard that no inference row can make a house clandestine. The SQL constants against `CARD_KINDS` and `GROUPING_REMOVERS`, field for field.
- **Ruling 4.** No client path writes a served v2 marker back. `writeShareVeil` and the one database writer (`updateGalleryMetadata`, run into the row) both store `v: 1` and no `groupings`. A closed register lists every source file that names the column, with its role.
- **Low finding 1.** The sanitiser runs once per link read, counted with an IMMUTABLE stand-in.
- **Low finding 4.** No migration from 211 on holds a raw blank character.
- **No clock in the routine suite** (ruling 5).

**`playerRecordVeiledFace.test.js` (the guard, ruling 7; 4 checks).**
- A sentinel is planted on every veiled face: house key and title, card title and role, every membership's power.
- It must reach no player-view reader's output: `composePublicProse`, `powerDeskRead`, `governanceAccountRead`, `defenseDeskRead`.
- A planted leaky reader proves the check bites. The register of the player record's importers is closed (a new importer is red until it is executed here).
- `publicSafe.js` is unchanged. It is a guard, green at birth by design.

**Registers created (empty or closed, shrink-only):** the two source-file registers above.

## 5. The restatements (condition (a))

`veil-probe/out/restatement-diffs.diff` holds each restated read as a diff against its previous body:
- `get_gallery_dossier` against 147;
- `get_unlisted_dossier` against 208 as amended;
- `import_gallery_dossier` against 131;
- `get_gallery_map` against 088.

In total: 50 lines added, 22 removed. Each is its body plus the veil:
- the projection expression moves into a lateral (`offset 0`) so the veil can read it;
- `data`, `dossier` or the member's `settlement` take the veiled body, and the overrides take the allowlist;
- the gallery read gains the snapshot source.

**ONE NON-VEIL LINE.** `get_gallery_dossier`'s header goes from `set search_path = public` to `public, pg_temp`. The search-path ledger (`tests/lint/migrationSearchPathPin.test.js`) refuses a recreated SECURITY DEFINER without that pin. The ledger rows came off in the shrink direction (the test's `POST_CONVENTION_BARE` and `.migration-searchpath-baseline.json`). It is behaviour-neutral.

**Rollback** (the file's `@rollback`): undo 211 FIRST, before 210, 207, 206, 205 and 208's set:
- recreate the four reads at their previous bodies;
- drop the `_gallery_veil*` functions.

No row is written or lost. The new client draws a v1 share exactly as before, so no client rollback goes with it.

## 6. Timing (condition (b), as ruled)

Median of 7 warm reads; 210 → 211; the largest corpus town (`server-veil-metropolis-3`, 526 KB) and the deploy-check "Force all" request (998 KB). Default veil and every eye shut, on the final SQL.

| Read | pglite 210 → 211 | ratio | native PostgreSQL 16.15 210 → 211 | ratio |
|---|---|---|---|---|
| largest, default, gallery | 306 → 407 ms | 1.33 | 194 → 320 ms | 1.65 |
| largest, default, link | 461 → 351 | 0.76 | 276 → 276 | 1.00 |
| largest, every eye shut, gallery | 314 → 537 | 1.71 | 204 → 377 | 1.85 |
| largest, every eye shut, link | 473 → 480 | 1.01 | 282 → 338 | 1.20 |
| Force all, default, gallery | 699 → 939 | 1.34 | 476 → 748 | 1.57 |
| Force all, default, link | 1,148 → 835 | 0.73 | 660 → 655 | 0.99 |
| Force all, every eye shut, gallery | 755 → **1,229** | 1.63 | 512 → 864 | 1.69 |
| Force all, every eye shut, link | 1,172 → **1,147** | 0.98 | 686 → 781 | 1.14 |

**THE TWO pglite FIGURES OVER ONE SECOND, NAMED:**
- Force-all, every eye shut, gallery: 1,229 ms (max 1,317).
- Force-all, every eye shut, link: 1,147 ms (max 1,211). 210's own reads of that row are 755 ms (gallery) and 1,172 ms (link).

pglite is a single-threaded WASM Postgres. **Native** (PostgreSQL 16.15 on x86_64, from the container image) ran in a scratch cluster run as the `postgres` user with trust auth on a unix socket, since torn down. There the chain 001–211 applied whole with the probe's shims, nothing refused, every read is under one second (max 900 ms) and none is over twice its 210 time (worst 1.85×). **The new stop did not trip.**

**THE FURTHER PASS (ruling 3): NOT TAKEN.** The native measure did not trip, and set-based address checks would make the function longer, not plainer.

Two costs were taken out because they were mistakes, not design:
- a whole-document walk for plot-hook keys, now one C-level jsonpath check (180 → 17 ms);
- the address grammar run on every stored delta (§7).

Probes: `veil-probe/timing.probe.mjs` (pglite) and `timing-native.probe.mjs` (needs `PGHOST`/`PGPORT`/`PGUSER` and `FORCE_ALL` pointing at the chair's `deploy-check-force-all.json`).

## 7. A share past the client's clamp (ruling 4)

The row is `clamp.probe.mjs`, results in `out/clamp.json` and `out/clamp-at210.json`. It holds 50,868 stored deltas (2.98 MB) on the largest corpus town: every real eye first, then 50,000 more and two over-long addresses.

- **Before cure 2.** The response already equalled the page on both reads, and the page equalled the default veil: the clamp was twinned, with the same end of the list and the same 300-character bound. But the read took 1,476 ms against 524 ms with every eye shut (2.8×). The planner pushed the address grammar below the de-duplication, so all 50,868 addresses were parsed.
- **After cure 2.** The cheap shape tests run on every entry; the grammar runs behind an `offset 0` fence only until 2,000 are kept. Gallery 774 ms against 525 (1.47×), link 732 ms against 491 (1.49×), and the response still equals the page.
- **The same row at 210:** gallery 309 ms and link 588 ms, with the response not equal to the page.

No sanitiser body was restated.

## 8. Gates

- **The equal-failing-set law.** Over `tests/generators`, `domain`, `property`, `lint`, `build` and `architecture`, the failing set at the base (`5b563a4aa`) is the same as at the tip, once the three new-file lint rows are counted as fixed (each re-run after its commit: the mutation-coverage manifest and the anchor walker, 19 passed; the census walker, 34 passed). Both sweeps ran before the guard file existed. The guard's two lint rows (its manifest row and the census) were re-checked by hand: the mutation-coverage manifest and the anchor walker pass (23 checks), and the census walker passes (34).
  - **The one common red:** `SUITE tests/lint/ledgerCitationIntegrity.test.js`. It needs the ledger branch `review-fixes-2026-07-08` as a local ref, which this checkout lacks. It is environmental, not this lane's.
  - **The rows this lane moved:** its own new files' rows in the mutation-coverage manifest (two `rationale` rows) and the lighting census (re-measured twice by its command). No row was banked in the test ratchet.
- **The gates outside the test directories** (the chair's added law), each read through `scripts/gate-tail.sh`:
  - `node scripts/check-domain-strict.mjs`: **exit 0** (1,113 errors, ceiling 1,113).
  - `npm run typecheck:ratchet`: **exit 0** (167, ceiling 167).
  - eslint on `src/domain/display/galleryVeil.js`, `src/lib/gallery.js` and the two new tests: **exit 0**.
- **Also green:** `tests/ops/migrationRehearsal.test.js`, `tests/docs/`, `tests/security/migrationSequenceAll.pglite.test.js` and `tests/security/pgliteHookTimeoutRatchet.test.js`.
- **Goldens:** none move. No generator file changed, so there is no shift record.

## 9. Files outside the granted manifest, and why

The granted manifest: the migration, `galleryVeil.js`, `gallery.js`, `migrationRehearsalCore.mjs`, `DEPLOY.md`'s head line, and the tests. Also touched, each required by a gate the moment a 211 file exists:

| File | Why |
|---|---|
| `ARCHITECTURE.md`, `docs/CURRENT_STATE.md` | the migration head figures (`architectureFreshness`, `docCounts`) |
| `tests/ops/migrationRehearsal.test.js` | the head and the wave list re-keyed 210 → 211 |
| `tests/lint/migrationSearchPathPin.test.js`, `tests/lint/.migration-searchpath-baseline.json` | one ledger row removed (shrink) |
| `scripts/mutation-coverage-manifest.json` | two rows for the two new test files |
| `tests/lint/.lighting-census-baseline.json` | re-measured by its own command |

## 10. Declared limits (each a crafted or hand-written row; none occurs in the corpus)

- **An anonymous legacy event** (no id, name, title or label) is addressed by the client through a hash of its whole content. The server reads it fail-closed: every eye addressed to any legacy event applies, and no exception does. That can hide more than the page did, never less. The corpus has 0 of 284 such events.
- **The frozen copy's size bound.** The client keeps a copy whose `JSON.stringify` length is at most 1,000,000. The server measures `jsonb::text`, which is slightly longer. A copy just under the client's bound but over the server's is served live instead of frozen. That is a different page, never a leak, and only on a hand-written row past the write clamp's bound.
- **An address naming an `Object.prototype` member** as a kind or field (e.g. `field:constructor:x:y`) throws in the 210 client and is ignored by the server.
- **Key order:** a served card's keys arrive in jsonb order, not the 210 client's allowlist order. Nothing renders by key order.

## 11. The VEIL-FIX review's low findings (ruling 6)

1, 2 and 4-for-211 are taken and pinned (§4). 3, 5 and 4-for-206/207/210 are declined.

**What WOULD trigger finding 3:** a record in which a surviving row's `id` spells a hidden power's display name verbatim, for example a tie `id: "rel.The Hidden Hand"` or a power row `id: "faction.The Hidden Hand"`. Such an id is printed unmasked while the same name in `desc`, `to` or `personality` is masked. The generator writes no such id (the phase-1 measure found none). The only id holding a power's name is `npcs[].goal.intent…target.id`, and `goal` is not public. So it takes a hand-edited, imported or custom-content record, or a future change that publishes such a field.

**What WOULD trigger finding 5:**
- (a) A hidden power whose name is a substring of other public text: every string containing it is rewritten, for example a hidden power named "Order" masking "Order" inside other sentences. That hides more and garbles text.
- (b) Two hidden powers where one name contains the other ("The Hand" and "The Hidden Hand"): the longer is left half-masked. That leaks part of the longer name.

Generated hidden powers carry distinct, specific names (the infiltrated city's is "The Independent Bloc"), so it takes a DM's own names or custom content.

## 12. For the deploy step (the chair's to write; the facts only)

- **The migrations are EIGHT** (204–211). The ledger bump is 203 → 211. Undo 211 first in any rollback.
- **No re-export is owed.** §0b's "A SECOND LIMIT" (frozen copies) retires: every frozen copy is sanitised and veiled at read. §0b's "ONE LIMIT THAT REMAINS" also retires for the four reads. One gap stands: a town shared by link ALONE still has no veil controls outside the gallery panel.
- **The fewest clicks to "every eye shut", owner-visible, on the Force-all metropolis:**
  1. In the dossier's share controls press `Export to gallery`. It must be exported: the veil controls live in the gallery panel.
  2. Press `Manage gallery`.
  3. Press `Curate for visitors`.
  4. In each section press every row reading `<label>, for everyone` (the class switches). On the Force-all town that is **9 presses**: Institutions 2, Power 1, NPCs 2, Relationships 1, History 3. Every grouping (Plot Hooks, Services, Defense, Rumors & News, War, Engine housekeeping) is already hidden by default.
  5. Press `Done`.
  6. Press `Unlisted link`, then `Copy party link`, and open the link in a private window.

  This is the heaviest state a person reaches in a few clicks. Shutting every per-box eye too would take 1,853 presses on that town (behind `Open the N boxes` in each section); the timing's "every eye shut" row is that upper bound.
- **What a refused or timed-out read looks like.** `fetchPublicDossier` logs the error and returns nothing, and the link read does the same (`src/lib/gallery.js`, `src/lib/galleryUnlisted.js`). The page then checks for a campaign party link and shows **"This settlement is not available."** (`src/hooks/useGalleryPageState.js`). The same words appear for a slug that does not exist, so a timeout cannot be told apart from a missing town on the page itself; the browser console carries the error. Not verified here: the project's role statement timeouts. Supabase's documented defaults are said to be 3 s for `anon` and 8 s for `authenticated`; read them on the project. The native measure's worst read is 0.9 s.
- **For information only, pre-push:** the counts the phase-1 proposal gave as (e) and (f): listed towns in snapshot mode, and public maps with a veiled member. Those map pages will show less after the push.

## 13. Not this lane's, reported

- `tests/lint/ledgerCitationIntegrity.test.js` is red in any checkout without the ledger branch as a local ref (environmental, at base and tip).
- On COHERENCE-POWERS's flag: `publicVeiledRecordOf` still keeps a veiled face's house and memberships in memory. The guard now holds every reader of it; the record itself was not changed (ruling 7).
