# R4I-SQL-2 — hand-back (VEIL-42, chain B). PAUSED BY THE OWNER'S ORDER (the chair's N116, received ~16:10 UTC 2026-11-23)

Brief: `docs/chair/2026-11-20/veil/briefs/R4I-SQL-2-BRIEF.md` (at aba6be799; ADDENDUM 2, the chair's N106, at e011bf3c5). The measure:
`C-GAP.md` at c08f514d1 (`lane/veil-42-2026-11-23-meas-wip`). Worktree `/home/user/wt/sql`, LOCAL branch
`lane/veil-42-2026-11-23-sql2-wip`, cut at 392aff978. NEVER PUSHED (the seat pushes). Every database local (`PGHOST=/var/tmp/rv7`).
Every log below is in `out/v42/sql2/logs/` (this folder). The measure's instrument (`meas.probe.jsx`, `meas-an.mjs`, `meas.sh`) is
COPIED VERBATIM from c08f514d1 into this folder (cmp identical; never re-written).

## 212 AS IT NOW STANDS
- 212 sha256 **fad4b9b998f80722eef819e96fc7613774c0892b3a745b30ea3460d459bca7fd** (both cures). Before this unit:
  7a85dec31320dc6891be976458b285b0f49e463bf0a250e03dbc8636b010b5f3; after the first cure alone: 70ce3b51a0099a65a2a06acbb4756d3d9e159246c2d71e4ad3f13edd060c5d6f.
- The rollback `supabase/rollback/212_share_veil_later_cures.down.sql`: UNCHANGED, b13c5be88c6f91cb4f1300ca4837524c1f41cfaf5124077695a32c867a80f141
  (no signature moves; it drops `_gallery_veil_rekey(jsonb, text)` by signature, line 443). 211 untouched (eface6d0…0b01).
- Functions of 212 the diff touches: `_gallery_veil_rekey` (body: one path list) and `_gallery_veil_roster_choices` (the TWO guard
  lines N106 grants, no other byte). Everything else in the 212 diff is header comment ((36b), (36c) and two lines beside R4-IDS's).

## CURE 1 — THE GAP (brief items 1 to 6): DONE, every item proved
The cure: 212 :: `_gallery_veil_rekey` takes one path list `card` (`id`, `goal.intent.short.target.id`, `goal.intent.long.target.id`,
`allegiance.handler`) for npcs[] AND both roster copies (`factions[].members[]`, `powerStructure.factions[].members[]`); twin
`src/domain/display/galleryVeilPeople.js :: rekeyPeople`, the same list (`CARD_PATHS`). Registry row `people.rekey`'s path widened by
the three member paths (scope names R4I-SQL-2, the GAP, 40.8 (1), 44.7 (1)); `registry.json` re-made by its door; no other row moves.
By cause, the test helper `tests/security/personIdBijection.shared.mjs :: sites` (G): a member's three references are re-keyed sites.
Commits d344b6100 (the cure), c246709c4 (red), 70f503116 (green), 3243957f3, 84f2e2bba.
| item | receipt |
|---|---|
| 1 red first | Both reds read a READ-ONLY SNAPSHOT of the red commit (`/var/tmp/sql2red` = `git archive b5b6a5474`, code = 392aff978) so the tree could be edited while the mutex was held elsewhere. (a) handreach **5 of 14 red**, the five master-shape towns, "a stored person id is served" at the member goal targets (`logs/1a-handreach-red.txt`); (b) the measure's C on the control towns: `...short.target.id` **456 hits / 60 reads**, `...long.target.id` **443 / 60**, `...allegiance.handler` **35 / 10**, each on gallery server, gallery twin, import server, the gallery page; 0 on link and map member (`logs/1b-ctrl-red-table.txt`): C-GAP's table exactly |
| 2 the cure | `--check` 1 before, 0 after (`logs/2-registry-*.txt`); the registry walker 11/11; eslint 0; server = twin byte for byte under one salt on a hand doc (`logs/2-engines-same-salt.txt`) |
| 3 green | handreach **14 of 14** (`logs/3a-handreach-green.txt`); the measure's C: **0 hits on every path, every door (gallery, link, import, map member, the page), off and DM, both engines**, publicProse 0, fresh-shaped 0 (`logs/3b-ctrl-green-table.txt`); criminalSwitchSalt and the four non-security readers of the bijection 98/98 (`logs/3-light-units.txt`). L1 after cure 1 alone was byte-identical to the red (33 of 288 at `factions[].power`: cure 2's fault, now 0, below). The master-born set's GAP list is EMPTY (the seat's m140, R4I-MEASURE d71a3ee44): no new path |
| 4 | `logs/4-proofs.txt` (re-run on the final 212, fad4b9b9…): 001..211 + 212 + down = 001..211, 480 = 480 functions, 25,988 lines, diff EMPTY; ONE drawer among `_gallery_veil%` (`_gallery_veil`, v); the randomness closure: 0 members not VOLATILE, the four reads v; THE SALT: six functions take one (`_gallery_veil_rekey_id, _ref, _at, _each, _rekey, _served`), each ACL `{postgres, service_role}` only, anon/authenticated may execute 0; the smoke (R4I-SQL's `d-smoke.mjs`) 8 reads GREEN |
| 5 E116 | header (36b); shas above (no lane file records 212's sha outside out/v35's own proofs, so they are recorded HERE) |
| 6 | tests/security (10 files: criminalSwitchSalt, factionMemberPublicParity, gallerySanitizer, galleryVeilCures, galleryVeilIds and the bijection's readers galleryRosterChoices, gallerySecondHomes, galleryServerVeil, galleryVeilHandRows, galleryWithholdAlways) **196 of 196** (`logs/6a-security.txt`). tests/lint + tests/copy WHOLE, the ledger ref fetched (235efce1a): **lint 52 red** (the -wip's count; by name in `logs/6b-reds-by-name.txt`; writerReach 4 are the chair's; rosterChoiceComposedHosts 26 is R5's worklist), **copy 2** (voiceMechanics E2, the chair's N54). The one red naming a file of this diff: noLegacyFactionReaders lists `galleryVeilPeople.js:163 factions` x2, the pre-existing roster-copy read moved from line 154 by comment lines. Typecheck ratchet **167, ceiling 167** (`logs/6c-typecheck.txt`). PLAUSIBLE, not CONFIRMED: that the 52 are the base's same 52 by name (no by-name base list was at hand) |

## CURE 2 — N106 (ADDENDUM 2), THE TWO GUARD LINES: **WRITTEN** (f7db7b9a7); red and green **RUN** (fdc36d061); lint whole and typecheck for it NOT RUN
The diff: 212 lines 2329 (master's top-level `factions[]`) and 2360 (`powerStructure.factions[]`) of `_gallery_veil_roster_choices`:
`jsonb_typeof(e -> 'power') <> 'number'` -> `jsonb_typeof(e -> 'power') is distinct from 'number'`. No other byte of the function;
no twin edit. The pin `tests/lint/veilTypeofGuard.walker.test.js` (with its mutation-manifest rationale entry in
`scripts/mutation-coverage-manifest.json`): no `jsonb_typeof(<key lookup>)` compared by `<>`/`!=` outside a coalesce in 212; inventory
ONE line (212 :2397, `jsonb_typeof(r0 -> 'pair') <> 'array'`, NULL unreachable: `r0 @> e` with `e -> 'pair'` a non-empty array);
only shrinks. It cost under thirty minutes.
| proof | red (the snapshot `/var/tmp/sql2c1` = `git archive 84f2e2bba`, template `sql2_c1tpl`) | green (the tree, template `v42sql2b`) |
|---|---|---|
| (a) the master-born set, gallery door, Reveal DM, the 11 marked settings | **L1 352 of 3,360**, all at `factions[]#keys`/`factions[].power`, 32 places (`logs/n106-red-m-table.txt`) | **0 of 3,360**, L2 0 (`logs/n106-grn-m-table.txt`) |
| (a) the control (handreach, every door, MEAS_C=1) | L1 gallery 33 of 288 (`logs/3b-ctrl-green-table.txt`) | **0 of 288**, L1 link 0, C hits none, publicProse none (`logs/n106-grn-c-table.txt`); L2 24 left (v102-hamlet-6, Reveal off, the page's prominentRelationship: there before either cure) |
| (b) the plant `b-plant.mjs` (no `power` on either list; a criminal house hidden whole) | RED: the server ADDS `power` [50,50] on both lists, the twin none (`logs/n106-red-b.txt`) | GREEN: no `power` added, server = twin, both lists; control (every power a number) [80,20] both engines (`logs/n106-grn-b.txt`) |
| (c) no today-born read moves (`c-today.mjs`) | n/a | the gate's 140, off and DM, 12 settings, gallery and link: **6,720 of 6,720 the same hash modulo the bijection, 0 differ**; control: the raw documents differ on all 6,720 (`logs/n106-c.txt`) |
| (d) the pin | RED naming both lines (`logs/n106-red-d.txt`) | 3 of 3 (`logs/n106-grn-d.txt`); the mutation manifest 10/10 (`logs/n106-manifest.txt`); eslint 0 |
| tests/security (handreach, galleryRosterChoices, galleryServerVeil, galleryVeilHandRows) | — | **4 of 4 files, 97 of 97 tests** (`logs/n106-sec.txt`; no EXIT line: the chain's shell was stopped at the pause so nothing started after it; the run itself ended normally at ~16:23 UTC) |

## HALF-DONE (exactly where)
- tests/lint WHOLE + tests/copy WHOLE and the typecheck ratchet on the FINAL tree (after cure 2's new lint test): NOT RUN (stopped
  by the pause before they started). Cure 1's were run (above). Expected: lint 52 red with the new pin green, copy 2.

## HOW TO GO ON (from /home/user/wt/sql; each heavy step holds the gate mutex itself; logs in logs/n106-<step>.log)
    sh docs/chair/2026-11-20/veil/out/v42/sql2/run-n106.sh lint tc     # tests/lint + tests/copy whole (ledger fetched), typecheck ratchet
    # then compare logs/n106-lint-copy.log's FAIL names with logs/6b-reds-by-name.txt (the new pin must be green; no new red)
Other steps, if a re-run is wanted: `run-n106.sh red-m red-b grn-m grn-c grn-b c sec`; cure 1's: `run-1ab.sh` (needs the snapshot:
`mkdir /var/tmp/sql2red; git archive b5b6a5474 | tar -x -C /var/tmp/sql2red; ln -s /home/user/wip/node_modules /var/tmp/sql2red/node_modules`),
`run-green.sh 3a 3b 6a 6b 6c`, `run-4.sh`. Cure 2's red snapshot: the same with 84f2e2bba into /var/tmp/sql2c1 (and a `SNAPSHOT.txt`).
Databases this unit made (local, droppable): sql2_redtpl, sql2_c1tpl, v42sql2, v42sql2b, sql2_draft, sql2_ca_0..3, sql2_cb_0..3, and
meas.sh's own meas_sql2*_0..3.
