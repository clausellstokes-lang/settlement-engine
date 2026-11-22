# STORED-UNIVERSE, WIP (V33-C1, chain C unit C1, seated by VEIL-33 on the chair's E134): the lane's universe as saves.js stores it

## THE ANSWERS (CONFIRMED = measured here; PLAUSIBLE = read off source or inferred, not witnessed)

1. CONFIRMED, WHAT THE STORED FORM ADDS. 1,948 places: the lane's full pool (1,200 part A, 608 part B) and the gate's 140 towns. Each was born by today's tree (216cb46d8, src identical to R5-RECENT's merge) and stored by `saves.save` itself, against a mocked supabase that captures the inserted row.
   - Against the bare pipeline result: **524 stored-only generalized paths, 460 unregistered.** They come from two writers. `publicProse` (522 paths over 24 sites; writer `saves.js :: supabaseSave -> publicProseForRow -> composePublicProse`, written by `saves.js :: withPublicProse`) is in 1,948/1,948 places. `mapEdits.layoutLawVersion` (2 paths, unregistered; writer `SaveToLibraryButton.jsx -> newSettlementMapEdits`) is also in 1,948/1,948.
   - Value differences: 0. Birth-only paths: 0.
   - The store's own steps change nothing here. The no-lock carries and the first-generation reconcile are the identity in 1,948 places, and `activateFaithIfEntitled` changed 0. `neighbourNetwork` is not written (no neighbour).
   - Of the 64 registered prose paths, every one is a `prose.*` row. **`publicProse.blocks.power:governance.text` and `overview:identity.{governs,scope}` have no row.**
2. CONFIRMED, THE LANE'S PROOF BIRTHS ALREADY CARRY THAT `publicProse`. Against `tell-common.mjs :: birth` (it composes `publicProse` on the bare result), the stored form differs by **mapEdits only (2 paths), with 0 value differences**. The pool's gates were therefore read on documents byte-equal to the stored ones except `mapEdits`. PLAUSIBLE, from LEGACY-POOL item 3: what lacked `publicProse` was the differential's plant (`galleryVeilRecent.pglite.test.js`), not the gates' births.
3. CONFIRMED, PROSE HOLDING A WITHHELD FIELD ON THE SERVED PAGE. Measured with the twin at every gated setting and both Reveals: 38,960 reads. **8 rows, 7 of them registered.**
   - `power.recentConflict` (withhold/always): **1,791 of 1,948 places, on every read of each (35,820)**, in `power:governance`. It is word for word in 34,080 reads and as a 40-character cut in 1,740.
   - Its copy `power.recentConflict.pressureSentence`: 140 places, 2,800 reads, word for word, same block.
   - `power.stability` (recompose/always): the owner's stability text is word for word in `overview:identity`, in 1,738 places.
   - `safety.guardEffectivenessDesc` (recompose/house-hidden): 228 places (183 B, 45 T), in `defense:posture` and `defense:state`.
   - `economy.complexity` (recompose/house-hidden): 37 places, in `economy:economics`.
   - `safety.safetyDesc` (recompose/house-hidden): 23 places, in `defense:state`.
   - PLAUSIBLE coincidences: `(unregistered) history.currentTensions[].factions[]` (18 places: the generic name "The garrison" is in defense prose) and `people.secret` (1 place, a 40-character cut that is an NPC's name and role).
   - Found in no place: `people.pressureSentence`, `safety.crimeTypes`, `safety.criminalInstitutions`, `power.desc`, `power.label`, power names, house names, and every other withhold row.
   - The registry has no rule `cut` or `mask`. Its rules are withhold 104, diffuse 25, recompose 10 and rng 11.
4. PLAUSIBLE, COMPOSED BY SOURCE (the composer's import closure, grepped; `receipts/composed-reads.txt`). Near reads (the site's reader, or a module it imports directly):
   - `recentConflict`: power sites, via `governanceAccount.js` and `powerStateProse.js`.
   - `crimeTypes` and `criminalInstitutions`: economy, stressors and defense, via `defenseDisplay.js`.
   - `powerLabel`: economy, stressors and defense via `defenseDisplay.js`, and overview via `settlementQuickGuide.js`.
   - `factions[].desc`: power, via `governanceAccount.js`.
   - Names and houses: every site.
   - Every site composes from `publicVeiledRecordOf` (the owner's strip), never from the reader's veil. The full closures run to 187-483 modules, so a far read is not evidence that the field is drawn.
5. NOT MEASURED (WIP), GATES AND DIFFERENTIAL ON THE STORED UNIVERSE. The read-stored run began at 22:07:45Z on all 1,948 stored documents. It was KILLED at 22:21Z on the owner's hand-off order (stop by 22:40Z), because its estimated end was about 23:30Z. It writes only at its end, so it produced no GATE-1, LOWER, GATE-2 or differential figure. The births' figures stand alone: GATE-1 4/92, LOWER BY RULE 7, GATE-2 20 red. PLAUSIBLE, from items 1 and 2: the stored universe gates the same as the births, because the two differ only by the constant `mapEdits.layoutLawVersion`. Unwitnessed.

## WHAT WAS DONE
- `stored.probe.jsx` / `stored-dump.sh`: the stored dump. It follows the app's path from `generateSettlementPipeline` to the row: the worker's carry, the store's carry, reconcile and faith key, `SaveToLibraryButton`'s mint, then `saves.save`. Documents and births are in `/var/tmp/v18/stored/today/{docs,births}`, and the per-document path diffs (bare and lane) in `diff-shard*.json`. The window is in `receipts/dump-meta.txt`.
- `c1-an.mjs`: the stored-only paths, their writers and registry rows, and the prose table. Receipts: `receipts/stored-paths.txt` (every path) and `receipts/stored-paths-and-prose.txt`.
- `prose.probe.jsx` / `prose.sh`: the served-page prose measure. A stored string counts as WITHHELD when the page serves it nowhere outside `publicProse`. Only strings of 40 or more characters, or names (a capital, a space, 6 or more characters), are checked, so single-word names are not covered. It counts as HELD when a served block's text contains it whole or shares a 40-character window with it. The window is in `receipts/prose-window.txt`.
- `composed-reads.mjs`: the composer's reads by source.
- The read-stored run used `legacy/stored.sh` unchanged on `/var/tmp/v18/stored/today/docs`. The template is `c1_tpl` (`createdb -T v27x211`, then lp's 212 at ff20ed89). Its public functions' definition hash equals `lp_tpl`'s: a8af5dfa5f90c6747495ea649b5cf988.

## WHAT IS LEFT, AND THE COMMANDS (re-run from /home/user/wt/lp, one heavy run at a time)
- `env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE sh scripts/gate-mutex.sh --run -- sh docs/chair/2026-11-20/veil/out/v33/stored/stored-dump.sh /home/user/wt/lp /var/tmp/v18/stored/today`. DONE, 21:38-21:42Z, 4/4 rc=0. Then `node docs/chair/2026-11-20/veil/out/v33/stored/c1-an.mjs /var/tmp/v18/stored/today /var/tmp/v18/stored/prose-today`.
- `... gate-mutex.sh --run -- sh docs/chair/2026-11-20/veil/out/v33/stored/prose.sh /home/user/wt/lp /var/tmp/v18/stored/today/docs /var/tmp/v18/stored/prose-today`. DONE, 21:42-22:07Z, 4/4 rc=0.
- Template: `PGHOST=/var/tmp/rv7 createdb -U postgres -T v27x211 c1_tpl && psql -U postgres -d c1_tpl -v ON_ERROR_STOP=1 -f supabase/migrations/212_share_veil_later_cures.sql`. DONE; it equals `lp_tpl`.
- LEFT, THE GATES AND THE DIFFERENTIAL: `... gate-mutex.sh --run -- sh docs/chair/2026-11-20/veil/out/v33/legacy/stored.sh /home/user/wt/lp /var/tmp/v18/stored/today/docs /var/tmp/v18/stored/read-today c1_tpl c1`. About 80 minutes on 4 shards. It writes `read-today/tell2-table.txt` (GATE-1, LOWER, GATE-2) and `lp-table.txt` (the differential's equal count and absence faults). It was killed once at 22:21Z. The dead run left a stale gate lock (PID 20989); `--run` reclaims it.
- The stored documents remain at `/var/tmp/v18/stored/today/docs` (1,948 documents and 4 index files), so the dump need not be redone.

C1 STOP (WIP) <commit>: gates and differential not measured (read-stored run killed at 22:21Z for the 22:58Z hand-off); stored-only paths 524 (unregistered 460; vs the lane's births 2, mapEdits only), prose blocks holding a withheld field 8 rows (7 registered), GATE-1 n/a vs 4/92, LOWER n/a vs 7, GATE-2 n/a vs 20, differential n/a, absence faults n/a
