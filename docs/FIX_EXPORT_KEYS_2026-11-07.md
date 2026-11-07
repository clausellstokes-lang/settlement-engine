# FIX-EXPORT-KEYS: the public export's three dead keys, dropped at the SQL sanitizer and its client twin (2026-11-07)

> Archival record of the seat FIX-EXPORT-KEYS (Opus 5.5), a child of the cloud chair (Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), under the owner's delegation of 2026-11-06. The owner's word (2026-11-07, 22:4x UTC): the export allowlist's dead keys go BEFORE the deploy. Brief: `docs/chair/2026-11-07/BRIEF-FIX-EXPORT-KEYS-2026-11-07.md` on `lane/integration-2026-11-07`. Branch `lane/fix-export-keys-2026-11-07`, cut from `origin/lane/people-land-2026-11-07` at `f28d369b7`, pushed with `--no-verify` after every commit.

## 0. The outcome

- **Done.** Migration **205** (`supabase/migrations/205_drop_retired_faction_public_keys.sql`) recreates the public dossier sanitizer `_gallery_sanitize_public_json` without the top-level `factions` and without the NPC fields `factionAffiliation` / `secondaryAffiliation`. The client twin (`src/domain/display/publicSafe.js`) follows in the same cause. The parity pins are re-keyed, each red first.
- **Step 3 is NOT implemented.** The NPC object the sanitizer sees cannot decide "hidden or criminal house" per row. The representative's `institution`, `title` and `memberships` stay as they are today. §3 states what the row lacks, plus one finding the chair should rule on: a criminal face's `title` and `role` are ALREADY public.
- **No golden moved**, and no generator byte moved.
- **Writer reach's baseline is NOT refrozen here.** Its one red is the base's (§5).

## 1. Step 0: the measured map

| what | measured |
|---|---|
| the LIVE sanitizer | `189_scrub_faction_member_privacy.sql` holds the last `create or replace function public._gallery_sanitize_public_json`. 202 and 203 only name it in comments ("left net-current"). The production applied head is **203** (`supabase/applied-head.json`), so 189's body is the one live in production. |
| the next migration number | **205**. The repo head was 204 (`204_engine_generation_report.sql`, ENGINE-5). No remote branch carries a 205. |
| `'factions'` at the top level | It is `settlement.factions`, the grouping the car retired. **0 of the 525** golden-master settlements carry it at the car's tip. No public reader needs it: the legacy walker (`tests/lint/noLegacyFactionReaders.walker.test.js`) is 0 violations over `src/`. |
| the powers | `powerStructure.factions` is the powers. It is public through the top-level key `powerStructure`, which is untouched. Its rows carry `faction, power, desc, category, rawPower, powerLabel, modifier, isGoverning`, plus `hidden` (480 rows), `legitimacyCrisis` and `crisisNote`. |
| `factions[].members[]` | **0** objects in the 525 sit at a `members` path under a `factions` ancestor. No generator writes `powerStructure.factions[].members`. |
| the two NPC keys | **0 of 14,606** NPCs in the 525 carry `factionAffiliation` or `secondaryAffiliation`. |
| readers of the two NPC keys in `src/` | `publicSafe.js` only (the walker's `FIELD_CONTRACTS` row, deleted here), plus `settlementMigrations.js` (the v1 → v2 save migration, MIGRATION_FILES) and the FPZ list's files (M-6). |
| readers in `supabase/` | The sanitizer migrations 033 … 189 (now superseded by 205). **Outside the walker's reach:** `supabase/functions/generate-narrative/prompts.ts`, whose `frictionPoints` extract reads `n?.factionAffiliation` (three sites). It is now always undefined on a v2 record. That is not an export key and not in this manifest; it is listed in §7 for the intake. The generated bundles `supabase/functions/_shared/engineBundle.js` and `aiOutputSchemaBundle.js` carry the name in engine code (their build door). |
| the rehearsal tool | `scripts/ops/migration-rehearsal.mjs` plans read-only (`npm run ops:migrations:rehearse -- --json`). Its train is a FINITE manifest in `scripts/ops/migrationRehearsalCore.mjs` (`MIGRATION_TRAIN_REPO_HEAD`, one wave per migration since 193), and planning refuses a repo head the manifest does not cover. `--execute` needs an attested, isolated production-shaped clone (runbook §1–§4). |
| the pglite tests | `tests/security/*.pglite.test.js` extract the net-current `create or replace` (latest-wins, line-anchored) and execute it in an in-process Postgres. `tests/security/migrationSequenceAll.pglite.test.js` runs the whole train. |

The instruments are scratch scripts that are not committed: `measure-export.mjs` and `measure-minted.mjs`. Each runs `generateSettlementPipeline` over `tests/helpers/goldenMasterCorpus.js :: goldenCorpus` (525 rows) at `f28d369b7`.

## 2. Step 1: migration 205 (`bb6524157`)

**What it does.** It is 189's body by mechanical diff, and changes nothing else:
- `public_toplevel` loses `'factions'` (38 → 37 keys).
- `npc_allowed` loses `'factionAffiliation'` and `'secondaryAffiliation'` (11 → 9 keys).
- The `is_npc_obj` predicate stays byte-identical. With `factions` gone from the root allowlist, the grouping's members are never reached. The arm now guards only a deeper roster such as `powerStructure.factions[].members`, which a DM edit or a legacy record could carry. It fails closed.
- The comments and the function comment are updated. The grant posture is unchanged. Every change only hides; no public field is added.

**Its header** carries:
- the cause: the people car, ODQ §934.105, PEOPLE-RULINGS M-1b/M-2, and the owner's word;
- the measurement;
- what a reader sees: a dossier published before the car loses the three keys, as a post-car dossier already lacks them. Importing such a dossier loses a non-revealed member's two affiliation names, as every post-car import already lacks `memberships`;
- `@rollback`: recreate 189's body verbatim.

**Its doors**, in the same commit and the same way as 204's (`4b2310b44`):
- the rehearsal train's tail wave `retired-faction-public-keys` 205..205 (expectedObjects `_gallery_sanitize_public_json`), and `MIGRATION_TRAIN_REPO_HEAD` 205;
- `tests/ops/migrationRehearsal.test.js`'s head pins 204 → 205, with the wave asserted as documented-manual-reversal from its own annotation;
- `docs/DEPLOY.md` "Current migration head" set to 205;
- `ARCHITECTURE.md` migrations (205).

`supabase/applied-head.json` is NOT touched.

**The rehearsal receipt.** The plan was run read-only with `npm run ops:migrations:rehearse -- --json`. Exit 0: applied 203 → repo 205, 2 pending (204, 205). Wave 205's sha256 is `d66913034e78e99d3ddb35539dceb36bdd48a4ec134d57e90aed1a6d115a4b1c`, rollback documented-manual-reversal.

The **execute** receipt was NOT made. It needs the attended clone of runbook §1–§4: an isolated production-shaped database, an attestation and the Supabase CLI. None of these exists in this sandbox. The runbook also stores the receipt OUTSIDE the repository (mode 0600, "never overwritten"), so there is no in-repo place to commit one. The SQL was executed instead in pglite, by the security tests below and by `migrationSequenceAll.pglite`.

The 15 migration test files (`migrationSequenceAll.pglite`, `migrationRollbackDiscipline`, `migrationSearchPathPin`, `migrationGrantPosturePin`, `migrationContiguity`, `migrationAppliedHead`, …) pass 139 of 139.

## 3. Step 3: the car's public fields (the chair's ruling). NOT DECIDABLE PER ROW; LEFT NON-PUBLIC

**The rule.** A representative's `institution`, `title` and `memberships` are as public as the house they name. They are NEVER public for a hidden or criminal house.

**Where "hidden or criminal" is defined.** In `src/domain/display/galleryVeil.js :: isHideableHouse`, on the INSTITUTION ROW (`settlement.institutions[]`). A house qualifies if any of these holds:
- its classifier `category` or `priorityCategory` is `criminal`;
- a `clandestine` / `institutionFunction: 'clandestine'` / `subterranean` facet is read through `facetOf`;
- the catalog tags make it an illegal brokerage.

`_gallery_sanitize_public_json` is a per-object recursion: at an NPC object it sees that object and its path, never the root's `institutions[]` or `powerStructure`.

**What the NPC row carries** (the car's card, `src/generators/people/representatives.js :: birth`):
- `institution: { kind: 'house' | 'power', key, family, title }`;
- `category`, the POOL category (`poolMap.js`), not the house's classifier category;
- `title` and `role`, both equal to the face's title;
- `memberships: [{ power, rank, share }]`.

**What the row lacks**, measured over the 525 at `f28d369b7`:

1. **The house's veil class.** Nothing on the card says the house is criminal or clandestine. Two proxies exist, and neither holds by construction:
   - **Pool category.** `category === 'criminal'` covered all **879** faces of hideable houses (0 missed). It also caught **387** faces of houses that are not hideable (the watcher, and others whose pool is criminal). So it is a superset, but only by measurement, and a DM edit of the card's category breaks it.
   - **Family.** `institution.family` mapped to "hideable" as a function over the 525: 12 of 131 families, none mixed (Rookery, Fence (word of mouth), Underground network, Smuggling waypoint, Black market, Front businesses, Multiple criminal factions, Whisper market, Contract killer, Thieves' guild chapter, Underground city, Assassins' guild). But the predicate reads per-row tags and facets that a family does not fix (custom content, materialized facets, a DM's edit of the house). Deciding by family would need a SQL copy of a catalog-derived list, pinned to the JS.
2. **A minted face's power.** `kind: 'power'` covers **576** faces in the 525, all with pool category `government`. The card carries only the power's NAME. **480** of them are the face of a power that is `hidden: true`: the infiltrator (`stressFactions.js`, "Its presence is not known to the settlement"), minted by R-P4. The power's `hidden` flag and `category` live in `powerStructure.factions`, which the recursion cannot see from the NPC.
3. **The power behind each membership.** A membership names a power only. **152** faces of non-criminal pool category hold a membership in a criminal or hidden power. Under the ruling ("as public as the house they name") those would be public. Whether that is meant is the chair's question; either way, the SQL cannot test the power from the row.
4. **The DM's ties eye.** The veil's `field:npc:<id>:ties` (which removes `institution`) lives in `gallery_member_overrides.$veil` and is applied CLIENT-side only (`applyVeil` runs on the projected payload). The server sanitizer never sees it. If `institution` were admitted in SQL, the anon `get_gallery_dossier` RPC would return a tie the DM hid, and today it does not. That is a security-posture change, which is the owner's.

**The finding the chair should rule on, outside the three keys.** `title` and `role` are ALREADY in `npc_allowed` and on the veil's identity floor (`CARD_KINDS.npc.floor`). The car sets both to the face's title. So a hideable house's face publicly carries "the guildmaster of thieves", "the undercity boss" or "the fence", plus `category: 'criminal'`, on every public projection today. This is CONFIRMED by reading: `representatives.js :: birth` sets `card.title = title; card.role = title`; 205's `npc_allowed` keeps `role` and `title`; `applyVeil` never deletes a floor key. The ruling says `title` is never public for a criminal house. Meeting it means stripping `title`/`role` (and arguably `category`) per row, which hits the same per-row gap as §3.1, and changes the veil's identity floor (X-21b). I did not change it.

**The shapes the chair can rule between.** Each makes the per-row test decidable:
- **(a) A bit on the card.** Stamp one public-safety bit at birth, e.g. `institution.veiled: boolean`, from `isHideableHouse(row)`, or from the power's `category === 'criminal' || hidden` for a minted face. The sanitizer then tests `value -> 'institution' ->> 'veiled'` and strips `institution`, `title`, `role` and `memberships` for a veiled card; `publicSafe.js` mirrors it. This is a persisted-shape change: an observed-shape rung and a golden move (the 525 cards gain a key). Memberships naming a hidden or criminal power would need a per-entry bit too.
- **(b) A root-aware sanitizer.** At the root, compute the set of hideable house names and hidden or criminal power names, and pass it down the recursion. This needs a private helper or a new argument. The SQL would re-implement `isHideableHouse`, which reads category, priorityCategory, facets and brokerage tags: a new SQL twin of a JS predicate, needing a pin. No golden moves.
- **(c) Leave as is.** The three car fields stay non-public (today's state). The public NPC card shows no door, no face row and no role row (PEOPLE-6 §6, PLAUSIBLE there).

None of (a)–(c) touches the ties-eye point (§3.4): only a server-side veil would.

## 4. Step 2: the client twins (`9619b4cd6`)

**`publicSafe.js`:**
- `PUBLIC_TOPLEVEL_KEYS` drops `'factions'` (38 → 37).
- `NPC_PUBLIC_KEYS` drops the two fields (11 → 9).
- `publicNpc()` drops the two fields (11 → 9 fields): the "npc_allowed ⇄ publicNpc sync".
- The roster-member gate is kept, with its comment re-stated for the deeper roster. There is no new import; the file is 5 lines longer (516 → 521), comments only.

**The pins, re-keyed with the cause:**

| pin | change |
|---|---|
| `gallerySanitizeAllowlist.contract` | It parsed the FIXED file 123, which every later recreate overwrites. It now parses the NET-CURRENT definition (last `create or replace`, line-anchored, body only). `CANONICAL_ALLOWLIST` loses `factions`. Two arms added: the definition read is ≥ 205; neither allowlist names the three keys (anchored on `powerStructure`, `npcs` and `name`). |
| `gallerySanitizer.pglite` | One EXECUTED arm added: a pre-car record's grouping and two fields are dropped, while the powers and the card survive. |
| `factionMemberPublicParity.pglite` | The grouping is now dropped WHOLE on both halves (anchored on the cards and the powers). The member reduction and the no-drift pin move to `powerStructure.factions[].members`, with ALDRIC added to that roster and the two fields asserted absent there. Every sentinel is still absent, and the client equals the server field for field. |
| `writerReach.walker` (the export allowlist arm) | `unwritten` 8 → 5. The three keys are asserted out of `live.allowlist`. |
| the legacy walker's core | `publicSafe.js`'s `FIELD_CONTRACTS` and `OTHER_SHAPES` rows are deleted (no exemption is owed). |

**Red first,** in a scratch worktree at `f28d369b7`:
- The three security files at the base (189 plus the old twin): **8 failed** / 29 passed.
- 205 with the OLD twin: **6 failed**. These are the parity pins (SQL == JS at the top level, `npc_allowed ⇄ publicNpc`, client == server field for field) and two client arms.
- The tightened walker core at the base: **red, 4 violations** (`publicSafe.js` 124 ×2, 222, 223).

## 5. Step 4: the proof

FIGURES-PENDING

## 6. Registers

- **Writer reach** (`scripts/check-writer-reach.mjs`). The plain run exits 0, cohort 1397 → 1397.
  - The report arm no longer names the three keys (the walker re-key, §4).
  - **The baseline was NOT refrozen.** `--write` at the tip moved `frozenAtSha`, `verdictDigest`, `closureSizes` (web-display 750 → 751, dossier-pdf 469 → 460), `scanStats.files` 1719 → 1720 and four `processingTags` reach strings. The SAME `--write` at the base `f28d369b7` moves the same lines byte for byte (diffed, `frozenAtSha` aside).
  - So that drift comes from the car's commits after the baseline's freeze at `1994a2ef5`, not from this change. Folding it in here would sign another cause.
  - It also owns the one writer-reach red (§5): `writerReach.walker` "the surfaceReach grammar round-trips" is red at the base and cured there by the plain `--write`.
  - The landing (or the chair) should run `node scripts/check-writer-reach.mjs --write` with the car's cause named.
- **The legacy walker**: 0 violations, 2/2.
- **The rehearsal manifest, DEPLOY.md, ARCHITECTURE.md**: §2.
- **The dated roster**: this record, born dated. `tests/lint/.source-citation-baseline.json` byRule.dated 104 → 105, with `_rosterGrowth2026-11-07-fix-export-keys`, and the walker header's `dated (105)`.
- **Untouched**: the observed-shape register, the wiring census, the lighting census and the fork census. No `src/` read or write of a generated shape changed; `publicSafe.js` reads no new key.

## 7. Noticed (for the intake, not acted on)

1. `supabase/functions/generate-narrative/prompts.ts`, in the `frictionPoints` extract and two sibling extracts, reads `n?.factionAffiliation`. On a v2 record it is always undefined, so the AI prompt's NPC rows carry `faction: undefined`. The fix is a memberships read in the edge function plus its bundle door. It belongs to the AI layer's lane.
2. `docs/CURRENT_STATE.md` still states "migrations are contiguous to 203" and "head 203 is 0 migrations ahead". `tests/docs/architectureFreshness` "CURRENT_STATE.md states the real migration head" is red at the base (203 vs 204) and here (203 vs 205). It belongs to 204's lane; one prose edit cures it.
3. §3's `title`/`role` finding: a criminal face's title is already public.
4. 240 cards in the 525 carry `institution: null` (titles Watch Captain 156, Guildmaster 24, Senior Trader 24, High Priestess 24, Archmagister 12). M-7 allows null for a DM's person, but these are generated, and no ruling names them. Attribution is the car's; measured only.

## 8. CONFIRMED vs PLAUSIBLE

FIGURES-PENDING

## 9. THE DEPLOY STEP (for the owner, in plain words)

**What this changes in production.** One database function, the one that cleans a settlement before anyone can see it in the public gallery. After it, the gallery stops showing three old fields the new generator no longer writes. Nothing new becomes visible. No table, no column, no row of anyone's data is touched.

**When.** Apply the migration BEFORE (or in the same sitting as) the Vercel deploy of the client that carries this branch. The order matters in one direction only:
- **Database first, then client (recommended).** Safe at every moment. The old client simply sees three fewer fields on public pages, and it no longer reads them anyway.
- **Client first, then database.** Also safe, but between the two steps the server still sends the three old fields to the public gallery for dossiers published before the car. Nothing private leaks: the fields name public powers.

**How**, from a clean checkout of the exact commit you are deploying, never the old main checkout:

1. Optional, if you want release evidence: `npm run ops:migrations:rehearse`, then the clone rehearsal in `docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md`.
2. `npx supabase@2.122.0 db push`. Its dry run should list exactly **204** and **205** as pending: 204 is ENGINE-5's report function, already in the tree; 205 is this one. If it lists anything else, stop.
3. In the same sitting, bump `supabase/applied-head.json` to 205 with what the push printed. Then `SUPABASE_MIGRATION_HEAD=205 node scripts/check-migration-head.mjs` should print `live head 205 == repo head 205`.
4. Deploy the client on Vercel as usual. Then run `docs/ops/POST_DEPLOY_VERIFICATION_RUNBOOK.md`.

Never run the CLI's suggested `migration repair --status reverted …`.

**If it goes wrong (the rollback).** The database is forward-only.
- **Database:** write a new migration that recreates 189's version of the function, which is exactly what 205's own `@rollback` line says (put the three keys back in the two lists), and `db push` it. Nothing is lost either way, because the function holds no data.
- **Client:** revert the commit on master, or promote the last good deployment in Vercel (`docs/ops/DEPLOY_ROLLBACK_RUNBOOK.md` §1).

## 10. The tip

`lane/fix-export-keys-2026-11-07`, the commit carrying this file's last edit.
