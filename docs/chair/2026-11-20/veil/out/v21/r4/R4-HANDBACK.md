# R4 HAND-BACK (VEIL-22's R4 builder, branch `v22-r4`, base d136940c3)

Brief: `docs/chair/2026-11-20/veil/briefs/R4-BRIEF.md` (with R2-BRIEF's laws), the seat's R4 notes (04:50 UTC) and its
hand-over (re-key `cast.roles[].id` before R2's step; call line before `_gallery_veil_withhold_always` / `withholdAlways`,
the unmarked path too). Receipts in this folder.

## 0. The bytes
- 211 BYTE-FROZEN, proven before the first edit and after: `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01`,
  rollback `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f`.
- 212 before `05b915ab119e2f9766a3cea47fdd9ec023fc2155f588f1b4127ea5b347118f10`, rollback before
  `1454f8f3fa53943130a22d412152e0eddcf3e05684b3cf01f62e77c069e2a66e`; AFTER: see section 6 (`sha256.txt`).
- The scratch cluster `/var/tmp/rv7` was DOWN at the start (the container restarted: a stale lock, no postmaster); it
  was started again as it was made (`pg_ctl -D /var/tmp/v18pg`, `listen_addresses = ''`), nothing re-made.

## 1. MEASURE FIRST (executed through the server, scratch PG16, base chain `tplr4base`; `measure/`)
Probe `measure/r4measure.probe.jsx`: 8 born towns (village to metropolis, 5 crises), both stored shapes (new; master's
person and tie shape, `oldPerson`/`oldTie`), the default veil and unmarked, Reveal DM off and on, every read (gallery,
link, import, map member). Output `measure/r4measure-base.json`; holders `measure/r4h.json`; containment
`measure/r4contain-base.txt`.
- THE REFERENCE CENSUS (every string equal to, or holding, a stored person id, by path): exactly SUB-BRIEF-VR7's M2 list
  and nothing else: `npcs[].id`; `relationships[].from/.to` (`npc1Id/npc2Id` in master's shape); `relationships[].id`
  (HOLDS its end's id: `tie_npc_…`); `stress(ors).cast.roles[].id`, `.levers[].holderId`; with Reveal DM also
  `npcs[].goal.intent.short/long.target.id`, `npcs[].allegiance.handler` (new shape), `simulationTrace[].targetId`,
  `simulationTrace[].downstreamEffects[].target`. No object KEY equal to a person id inside `data`. OUTSIDE `data`: the
  served `gallery_member_overrides` (gallery and link) keys a person's own revealDm/allowImport entry BY THE PERSON'S ID
  (`_gallery_veil_served`): a form would survive there; R4 re-keys it with the same salt (section 2).
- THE HOLDERS SERVED TODAY (marked, default veil): every holder card of a hidden house is served on every read, both
  shapes, both Reveal settings (35 cards on 8 towns: 22 `npc_veiled_` faces + 13 of category 'criminal'), with
  `category: 'criminal'` on all 35; their ties (57 Reveal off, 83 Reveal DM) with `npc1Name/npc2Name`, description and
  tension naming them; prominentRelationship and pressureSentence on 1 town; cast roles and levers naming them on 2;
  with Reveal DM, other cards' `goal.short/long` naming them (10 and 6) and `goal.intent.*.target.id` aimed at them.
- NOT A REFUTATION, A DESIGN FACT: the 13 non-veiled criminal cards are the people of OPEN vice houses (gambling den,
  brothel, fighting pits: `isHideableHouse` false, served openly). Their house identity is readable on the new shape
  (`institution.key`), so they are NOT holders there; on master's shape Reveal off the projection strips `institution`,
  identity unreadable, and the `category: 'criminal'` fallback withholds them too (where the veil cannot be sure, it
  withholds). Master's own generator mints no `npc_veiled_` id (`/home/user/wt/master` greps none).
- THE IMPORT: needs no stable id (`galleryImportSettlement.js`: a NEW save each time, `aiData: {}`, an empty event log;
  no src reader parses an id form: only the minters `castPowers.js`, `cardVeil.js`, `resolveCrisisCast.js` spell them).
- THE SWITCH: `criminalVeilSwitch.js` (not mine, never touched) compares `JSON.stringify(applyVeil(p, []))` with
  `applyVeil(p, [address])`: a per-call random salt in the twin would make every address look effective. The twin's
  salt is therefore ONE PER PAGE LOAD (a read of a page is one load); the server's is one per read.

## 2. WHAT WAS BUILT (one section of 212, one twin module, the call lines)
SERVER, 212 section `-- R4: the people` (after `_gallery_veil_withhold_always`, before the restated `_gallery_veil`;
no DOORS part, no R3 code touched): `_gallery_veil_rekey_id`, `_rekey_ref`, `_rekey_at`, `_rekey_each`, `_rekey`,
`_rekey_served`, `_holders`; each REVOKED from public, anon, authenticated by name (VR27); the rollback drops all seven.
- `_gallery_veil_holders(doc, pub, res)` (VR9): the houses removed whole are read again from `pub` and `res.cards` exactly
  as `_gallery_veil_apply` decides them. A HOLDER: a person of `pub` whose house identity (`_gallery_veil_npc_house`)
  names a house removed whole (name, catalogue identity, a nameless one's label); where the identity cannot be read or
  names no house still served, a card `npc_veiled_…` or of category 'criminal'. Withheld WHOLE (category with it), with:
  every tie it ends (by id or by name, both shapes); prominentRelationship naming it or holding a gone tie's words;
  pressureSentence naming it or holding them; roster copies (`factions[]`, `powerStructure.factions[]` members); cast
  roles and levers naming it (both copies); another card's goal side aimed at it (intent target id) OR NAMING IT (the
  handler's "serve the patron" line, Reveal DM; found by the born test, not in the brief's list), its intent side with
  it; an allegiance it handles. `people.secret`: where a CRIMINAL house is removed whole, a secret worded by a criminal
  guild or the underworld (withTownsOwnUnderworld's choice) leaves. Dense, in order (VR21). Two bounded name checks on
  fixed paths (pressureSentence, goal.short/long: `position(name in …)` per holder name): no document-wide scan.
- `_gallery_veil_rekey(doc, salt)` (VR10): `npc_` + 16 hex of sha256(salt '|' id) for every card id of the three person
  lists and every reference of the census (ties' ends and own id, `tie_` + 16 hex; cast roles and levers; goal targets;
  handler; the trace's targets; roster copies); a reference spelled `npc_…` but naming no served person is re-keyed too
  (no form survives). `_gallery_veil_rekey_served`: the served marker's person keys re-keyed with the same salt, kept only
  where the body serves that person.
- `_gallery_veil` (R2's restatement) EDITS: `salt text := gen_random_uuid()::text` (one a read, never shipped); the
  marked body: ONE LINE `body := public._gallery_veil_rekey(public._gallery_veil_holders(body, pub, res), salt);`
  immediately BEFORE R2's step; the unmarked body: `_gallery_veil_withhold_always(_gallery_veil_rekey(pub, salt))`; both
  returns wrap the served marker in `_gallery_veil_rekey_served(…, body, salt)`. (More than one line: the salt and the
  served marker's keys need it; the seat places the marked line after R3's at the merge.)
TWIN: a NEW module `src/domain/display/galleryVeilPeople.js` (`withholdHolders`, `rekeyPeople`, `rekeyId`), NOT
`gallerySecondHomes.js` as the planned host said: that file stands at its layer's eslint size ceiling (800; my block took
it to 909, and the size baseline is shrink-only). The registry's hosts `tPeople`/`tRekey` moved there (R2's precedent:
`galleryWithholdAlways.js`). `galleryVeil.js`: one import line, ONE call line in `applyVeil` immediately before
`withholdAlways(s)`, and `rekeyPeople` in `projectShareVeil`'s unmarked line. The twin's salt: one per page load.
REGISTRY: R4's rows built (`people.entry`, `people.card`, `people.rosterCopy`, `people.secret`, `people.ties`,
`people.prominentRelationship`, `people.pressureSentence`, `cast.roles.entry`, `cast.levers.holder`), a NEW row
`people.rekey` (recompose, always: the id re-spelled by a salt that never ships), the four R4 hosts `exists`; export
regenerated by the script, `--check` exit 0.

## 3. RED FIRST / GREEN (the born test `tests/security/galleryVeilPeople.pglite.test.js`, + its manifest row)
4 born towns x 2 shapes x (default veil, unmarked) x (Reveal off, on), every read, through pglite (all migrations).
- RED at the base: `red.txt`: 4 failed of 7 (VR9, VR10 ids, VR10 one-salt-a-read, the twin), 3 passed (the corpus, the
  served npc role arm, the owner arm).
- GREEN after: `green.txt` (the final tree): 7 of 7, exit 0; `green-try2.txt` (before the twin moved to its own
  module): 7 of 7 with the registry walker 11 of 11.

## 4. THE GUARDS: NOT GREEN. STOP (the brief's stop rule: a red that cannot be cured here without changing an existing equality)
Run at the tree (`guards-try1.txt`: the six guard files, VR17's signal copies, R2's born test, the copy-sites walker;
`guards-nonpglite.txt`: the twin's tests, gallery/import, the walkers, the switch). The container was OVERLOADED (R3's
runs beside mine, load 16 on 4 cores; the kernel killed processes for memory twice), so both batches were STILL RUNNING
at this commit; their files keep filling in this worktree (uncommitted beyond what is committed here). REDS SEEN:
- `tests/security/galleryServerVeil.pglite.test.js` 10 of 17: the 8 town arms ("no page changes": the LIVE page
  deep-equals the AT210 page), LAW (4) PLANTED, the clamp arm. CAUSE (R4's, by design): VR10 re-spells every id on the
  live page (the 210 page keeps the stored ids) and VR9 removes the holders' cards, ties and copies from a page that
  hides a house whole. The equality is BYTE-EXACT against 210; it holds only after (a) mapping ids by first appearance
  (the seat's sanctioned form) AND (b) removing exactly VR9's withheld items from the 210 reference, as the test already
  does for law (4)'s role copies (`withheldFrom`). (b) re-records what the page shows: THE SEAT'S CALL.
- `tests/domain/display/publicSafe.test.js` 7 of 56 (EXISTENCE IS PUBLIC; X-21e THE ONE EXCEPTION; THE IDENTITY FLOOR can
  never be hidden; an institution hides its services and its people; everything else is shown; PROPERTY: every path and
  value in the output already sits at that path in the projection; a master switch …). CAUSE (R4's): these pin a card's
  id as the identity floor, BYTE-EQUAL to the projection's (VR10 re-spells it), and PROPERTY forbids any value not in
  the projection (a re-keyed id is a new value). Curable only by re-recording the identity floor as "the same person,
  re-spelled" and PROPERTY as "modulo the re-key": a ruling, not mine to take.
- `tests/domain/display/criminalVeilSwitch.test.js` 1 of 9 ("(a)-(e) hold on every birth"): green at the base by the
  seat's word (V10-2); PLAUSIBLY R4's (the switch measures applyVeil's effect per address: hiding a house now also
  withholds its holders). Not touched (the switch's files are VEIL-V102's).
- `tests/security/galleryVeilSignalCopies.pglite.test.js` 4 of 5 (VR17's town arms: the shut grouping's signal through
  every copying surface): NOT YET READ; PLAUSIBLY the same cause (its pages compared across surfaces carry re-keyed ids).
- THE NON-PGLITE BATCH, FINISHED (`guards-nonpglite.txt`, exit 1): 24 files: 21 passed, 2 failed (publicSafe 7,
  criminalVeilSwitch 1, above), and one worker KILLED BY THE KERNEL FOR MEMORY (an unhandled "Worker exited
  unexpectedly": that file's result is unknown; re-run it alone). Green among them: the registry walker (ARM C/D on the
  moved module), veilCopySites, ruinFilterRoster, noLegacyCorruptReaders, tuningRegister, styleLaw, sizeBaseline,
  sourceCitationIntegrity, mutationCoverage, publicSafeVeil, publicProseVeil*, publicProseEquality, curateMode, gallery,
  partyLinkClient, galleryImportRederive, galleryImportServedBand, publicPayloadVeilTotality, entityIndex (by file count;
  observedShapeReaders included: read its file for the frozen counts).
- THE PGLITE BATCH (`guards-try1.txt`) was still running at the commit (HandRows, SecondHomes, Cures, Sanitizer,
  MapMemberCount, R2's born test, the copy-sites walker): read the file.
- KNOWN, NOT MINE: `tests/lint/observedShapeReaders.walker.test.js` (violations 4 against frozen 1, its register arm: the
  close's).

## 5. COST (VR36), the largest born town (`cost-big-town.txt`; run UNDER LOAD, all three chains interleaved)
Maghwick (metropolis, 520,504 B, larger than R2's Langengrund): gallery off x211 473.8 | base 966.6 | after 751.3 ms;
gallery Reveal DM x211 307.8 | base 902.4 | after 837.7 ms; link x211 337.4 | base 639.1 | after 793.1 ms. BOUND: the
Reveal-DM read after (837.7) <= twice 211's Reveal-OFF read (947.6): MET, every read served. The v8245 rows (V8-3 row,
50/500/500, the two 300 KB rows): NOT RUN (budget and load). PLAUSIBLE: the re-key is ~3 sha256 per person a read.

## 6. NOT DONE (owed): the render-twice harness, the inversion harness, the acceptance run (REVIEW-VEIL-7), the v8245
cost rows, the guards' final counts. CONFIRMED (executed): the measure; red 4/7 and green 7/7 of the born test; the
walker 11/11; `--check` 0; eslint on the touched files 0; typecheck:domain:strict 0 (1113 = ceiling); typecheck:ratchet
0 (167 = ceiling); the big-town cost row; the sha256 (`sha256.txt`): 212 after `ba7d8631…3a51c9`, rollback after
`786c8bd8…31b2`. PLAUSIBLE: that the reds above are all of R4's re-key and holders and nothing else.
