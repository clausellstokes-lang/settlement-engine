# R4-IDS — brief, PART ONE: THE MEASURE AND THE RED-FIRST INSTRUMENT (a builder of VEIL-34's; tests and documents only). READ WHOLE: this brief; `tests/security/personIdBijection.shared.mjs` as it stands at a4b89bf9d (`git show a4b89bf9d:tests/security/personIdBijection.shared.mjs`); in `src/generators/people/representatives.js` and `mintTitles.js` the id writers only (found by grep, read by symbol); the files under `docs/chair/2026-11-20/veil/out/v32/tell8b/measure/` (your instrument's model). READ NOTHING ELSE WHOLE. You do NOT open migration 212 or `src/domain/veil/rosterChoiceRegistry.js` beyond a grep, and you edit nothing in `src/` or `supabase/`.

Written by VEIL-34, 2026-11-22 (`lane/veil-34-2026-11-22`). Vetoable by the owner. PART TWO (the cure, split in two builders by the
chair's budget rule: one edits 212 and the registry ALONE, a second builds the twin and the proofs) is written by the seat from PART
ONE's figures, after the hand-over; no builder touches 212 before then.

## WHY (the chair's E87, E89, E94 (a); the readers' list row 17; PART 30 rulings 15, 16, 17, 53)
VR10: on every non-owner read every person's id is re-keyed under ONE salt per read, and every in-payload reference follows. The
join probe's lit act T found a hidden power's representative served under an id that SPELLS the power (`npc_power_<slug>`, 17 ids on
4 places, Reveal off; `out/v33/joinprobe/lit/` on `origin/lane/veil-33-2026-11-22-joinprobe-wip`). The engine mints person ids from
names (`npc_<house slug>`, `representatives.js`; `npc_power_<slug>`, `mintTitles.js :: OTHER_CARD_PREFIX`), and the served marker keys
each person by `_gallery_npc_key` (the id, else `npc.<the name's snake case>`). R4 (dfa031f3e) and its first cure (a4b89bf9d) on
`lane/veil-22-r4-2026-11-20` built the re-key on a base before R3 and are NOT GREEN; R4-IDS is VR10's re-key ALONE, split from
R4-CURE-2 (E89): STOP 1 (a card's own ties re-keyed; a numeric id caught as text by ONE helper per engine, ruling 53's fold) and THE
CATALOGUE RED (ruling 16: the salt VOLATILE on every function that draws randomness and on the transitive closure of its callers).
VR9's holders, STOP 3's page rule, the switch's salt and VR48 stay after R3.

## WHERE YOU RUN
Worktree `/home/user/wt/r4i` (`git -C /home/user/settlement-engine worktree add /home/user/wt/r4i -b v34-r4ids lane/veil-34-2026-11-22`).
The seat's pool `/var/tmp/v18/t2/pool-v34`, template `v34tpl` (lower case). No heavy run until the seat says the gate is free; every
heavy run through `scripts/gate-mutex.sh --run`, to a log, under `env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR
-u GIT_OBJECT_DIRECTORY -u GIT_PREFIX`, never through a pipe; pglite with `--maxWorkers=1`. Every database local (pglite, or the
scratch PostgreSQL at socket `/var/tmp/rv7`, databases named `r4i_*`). Commit by explicit paths on `v34-r4ids`; never push.

## M — THE MEASURE (first; it could refute this brief)
On the tell8b arm's page set (both engines, both stored shapes, every gated setting, Reveal off and DM, the gallery read AND the party
link): every served ID, KEY and SLUG, BY SURFACE: `npcs[].id`; every in-payload person reference (ties' `from`/`to`/`npc1Id`/`npc2Id`,
a card's own `relationships[]`, memberships, `allegiance` ids, the casts' role/lever/holder ids, `simulationTrace` targets, roster
copies `factions[].members[]`); the served marker `gallery_member_overrides` (its keys); any `npc.<slug>` or `npc_power_<slug>` or
`npc_<house slug>` string anywhere. Count, by surface, those that SPELL a power the read withholds or a house it hides whole, by THE
LANE'S FOLD (import `src/domain/display/gallerySecondHomes.js`'s name search; the name's words joined by '_' or by nothing, case-blind,
the bare form): hits / served, server and twin side by side (a disagreement: STOP with the page). Also count the ids that are
stable across two reads of one town (the re-key's own baseline: today all of them). Write the table to
`docs/chair/2026-11-20/veil/out/v34/r4ids/R4IDS-MEASURE.md`, CONFIRMED vs PLAUSIBLE per line, and name the LIT witness (act T's four
places) by reading the probe's litsurf output on that ref, never by building a pool.

## R — THE RED-FIRST INSTRUMENT (tests only; RED at the seat's tip, by design)
`tests/security/galleryVeilIds.pglite.test.js` (both engines, both stored shapes, Reveal off and on, marked and unmarked, gallery and
link), on PLANTS (born towns lack some cases): (a) a withheld-by-rule criminal power whose representative carries `npc_power_<slug>`;
(b) a hidden-whole house whose representative carries `npc_<house slug>`; (c) a card with a NUMBER id (90001) and a card whose own
`relationships[]` tie points to it (STOP 1); (d) the served marker's keys. ARMS: (1) NO served id, key or slug spells a withheld power or
hidden house, by search (ruling 28); (2) VR46's five teeth over `personIdBijection.shared.mjs` (brought from a4b89bf9d as a test helper
under the same path; say what you changed and why): a reference that does not follow its card reds; any STORED person id served as a
substring of any string or as any key (the marker included) reds; a changed non-id byte reds; the re-key is a bijection within a read;
two reads of one town differ; (3) STOP 1: every person reference inside a card's own ties follows the re-key; (4) THE CATALOGUE (ruling
16): every function 211 and 212 create or restate, `pg_proc.provolatile`, the transitive closure of calls from each that draws
randomness: any member IMMUTABLE or STABLE reds (with a plant: one closure member declared STABLE in a scratch chain, to show it can
fail). TEETH that pass today: a read that hides nothing serves the same people (modulo the bijection); a served person's every non-id
byte equal. Its mutation-manifest row (`scripts/mutation-coverage-manifest.json`, the lane's precedent `{kind: rationale, ref:
pglite-executed}`). Run it at the tip: report each arm's red count; arm (4) may be green today (no re-key draws randomness yet): say so.
THEN `tests/lint` WHOLE (you changed a test): its count against the sixteen standing reds (PART 32 section 2b's twelve + PART 30's
four); any other red is yours to cure before you stop.

## LAWS
211 byte-frozen (`eface6d0…0b01` / `ce8474ff…712f`); no line of 212, the twin or the registry; red by design and SAID; `tests/lint`
whole after any test change; a STOP rather than invention; STOP early with what is left if the work will not fit about 250,000 tokens.
Your last message: at most 250 words: your last commit, the two files' paths, M's headline figures by surface, each arm's red count,
`tests/lint` whole's count, CONFIRMED vs PLAUSIBLE.

---

# R4-IDS — PART TWO: THE CURE (written by VEIL-35, chain B, E116; DRAFT until the chair's "TIP <commit>": the base, 212's sha and the line numbers below are re-stamped then). Vetoable by the owner.
IN TWO BUILDERS, ONE AFTER THE OTHER, each on the seat's `lane/veil-35-2026-11-22-r4ids-wip` (cut from the lane's tip the chair
names, with part one's two test files and manifest row merged in from `lane/veil-34-2026-11-22-r4ids-wip` at 24a6f7ef5):
- **R4I-SQL** READS WHOLE, AS ITS FIRST ACT: `supabase/migrations/212_share_veil_later_cures.sql` and
  `src/domain/veil/rosterChoiceRegistry.js`; NOTHING ELSE WHOLE (this part two; a4b89bf9d's R4 section by `git show` of the lines
  named below; everything else by grep). IT EDITS ONLY: 212, `supabase/rollback/212_share_veil_later_cures.down.sql`, the registry
  module and `registry.json` through its door (`node scripts/veil/rosterChoiceRegistry.mjs`), and the hashes the lane records.
- **R4I-PAGE** READS WHOLE: this part two; `src/domain/display/galleryVeil.js`; the two part-one test files. IT TOUCHES NONE OF
  212, its rollback, the registry or `registry.json`. IT EDITS: the twin (`src/domain/display/galleryVeilPeople.js`, new;
  `galleryVeil.js`; `galleryRosterChoices.js` for the fold only), the walkers, the arms, the proofs and their manifest rows.

## WHY, FROM PART ONE'S FIGURES (`out/v34/r4ids/R4IDS-MEASURE.md`, 24a6f7ef5)
On the 6,528-page set NO born served id spells what the read hides (every surface 0; withheld faces and hidden houses are
born `npc_veiled_`), server = twin. The RE-KEY half has a full born witness: 316,640 of 316,640 card ids served as stored,
129,656 of 129,656 stable across two reads. The SPELLING half's witness is LIT ONLY: jp6-city-8, 5 `npc_power_noble_families`
ids (an OWNER-hidden power's face) CONFIRMED; three more places, 12 ids, PLAUSIBLE. THE RED by design: arm (1) 72 hits on 16
reads (plants only); arm (2) 72 of 72; arm (3) STOP 1, 12; arm (4) the catalogue green today (84 functions, none draws), its
STABLE plant reds. So the cure is proved on the lane by the plants and the re-key's own arms; the lit witness is re-run on a
lit tree (THE LIT WITNESS, below).

## THE CURE, RULE FOR RULE IN BOTH ENGINES (a4b89bf9d's family names; VR10, VR46, rulings 15, 16, 17, 48, 53)
1. THE ONE SALT. SERVER: `_gallery_veil` (RESTATED) draws `salt := gen_random_uuid()::text` ONCE per call, never ships it, and
   uses it for the body AND the served marker of that call. One call is one served document: a gallery read, a link read, an
   import, ONE map member (a map's members are re-keyed each under its own salt: no member references another's people). TWIN:
   `galleryVeilPeople.js :: readSalt` (`globalThis.crypto.randomUUID()`), ONE per projection call (`applyVeil`; the unmarked path
   of `projectShareVeil`), used for that call's whole payload.
2. THE CATALOGUE (ruling 16, arm 4) AND THE SALT HOLD TOGETHER: the rule is not "no function draws" but "every function that
   draws, and the transitive closure of its CALLERS, is VOLATILE". After the cure EXACTLY ONE function draws (`_gallery_veil`), and
   its callers' closure is `get_gallery_dossier`, `get_unlisted_dossier`, `import_gallery_dossier` (restated in 212: `stable` ->
   `volatile`) and 211's `get_gallery_map` (VOLATILE already, plpgsql with no marker: R4I-SQL CONFIRMS by `pg_proc`). The six salt
   CARRIERS (`_gallery_veil_rekey_id`, `_rekey_ref`, `_rekey_at`, `_rekey_each`, `_rekey`, `_rekey_served`) draw nothing and call no
   drawer; they are declared VOLATILE as a4b89bf9d did (no plan may fold or cache a salt; toward withholding). The arm's count after:
   84 + the new helpers (said), one drawer, its closure all VOLATILE; the plant still reds.
3. THE RE-KEY (`_gallery_veil_rekey(doc, salt)`; twin `rekeyPeople(s, salt)`): a4b89bf9d's sites (212 at a4b89bf9d, the R4
   section: `git show a4b89bf9d:supabase/migrations/212_share_veil_later_cures.sql`, lines 2076-2220; the twin
   `git show a4b89bf9d:src/domain/display/galleryVeilPeople.js`, `rekeyId` .. `rekeyPeople` ONLY: VR9's `withholdHolders` and
   `_gallery_veil_holders` are NOT this unit), each id `<prefix> || left(sha256(salt || '|' || id), 16 hex)` (`npc_`, `tie_`):
   the cards' ids (`npcs[]`, both roster copies `factions[].members[]`, `powerStructure.factions[].members[]`); a goal's two target
   ids; an allegiance's handler; the ties' ends (`from`, `to`, `npc1Id`, `npc2Id`) and a tie's own id (re-keyed WHOLE: it spells its
   ends); the crisis cast's role ids and lever holders (both copies, one crisis or a list); the trace's `targetId` and its effects'
   `target`. PLUS STOP 1 (part one's arm 3; `personIdBijection.shared.mjs` (C)): a card's OWN ties `npcs[].relationships[]`,
   `.from`, `.to`, `.npc1Id`, `.npc2Id`, `.targetId`, `.npcId`, and that tie's own `.id` (re-keyed whole). A value is re-keyed where it
   is a served card's id OR a string spelled `npc_` (a dangling reference: no form survives). A NUMBER id is a person's id by its
   text (ruling 48). NO TEXT IS SCANNED: fixed paths only (the cost law).
4. RULING 53's FOLD, IN THIS UNIT (STOP 1's "one helper per engine"): SERVER, ONE helper `_gallery_veil_id_text(jsonb)` (a scalar
   string, number or boolean as the client's `String()`; anything else ''), revoked by name, dropped by the rollback; the SIX inline
   "id as text" sites of `_gallery_veil_roster_choices`'s people pass (R3-CURE-5) repointed to it, and the re-key's "by its text"
   uses it. TWIN: `galleryRosterChoices.js :: idKeyOf` folded into `idText` (one function), exported, and `galleryVeilPeople.js`
   uses it. The walker that held the six inline texts identical (`tests/security/galleryRosterChoices.pglite.test.js`, "R3-CURE-7
   (ruling 53, condition 2: THE WALKER)") is re-stated by R4I-PAGE to hold: no inline form left, every site calls the helper, the
   helper's text equals the twin's `idText` on the tooth's values (`true`, `false`, '', a number, a string).
5. THE ORDER IN `_gallery_veil`: the re-key runs on the body AFTER `_gallery_veil_roster_choices` (which compares the body's people
   with `pub`'s by STORED id) and BEFORE `_gallery_veil_withhold_always` (its cast pass matches roles to people by id: both re-keyed,
   consistent), on the veiled body AND on the unmarked body (`withhold_always(rekey(roster_choices(pub, pub), salt))`). The twin in
   the same place (`applyVeil`, after `applyRosterChoices`, before `withholdAlways`; `projectShareVeil`'s unmarked path).
6. THE SERVED MARKER (`_gallery_veil_rekey_served(served, body, salt)`; the twin where it writes the marker): `$veil` as it is; a key
   that is the STORED id of a person the body serves is re-keyed exactly as that card's id; a name key (`npc.<slug>`) is kept ONLY
   where it is the member key of a served card WITH NO id; every other key leaves. A CORRECTION OF a4b89bf9d: it kept every `npc.`
   key as a name key, so a card whose stored id itself begins `npc.` (part one's plant `npc.bo`) lost its entry; the rule above
   decides by the card, never by the key's spelling (red first: a plant marker key `npc.bo` with `revealDm: true`, the card
   revealed before and after).
7. THE REGISTRY: the host `public._gallery_veil_rekey` state `exists`; the twin host RE-POINTED to `src/domain/display/
   galleryVeilPeople.js :: rekeyPeople` (the registry today names `gallerySecondHomes.js`; E116 places the twin in its own module);
   ONE row `people.rekey` (a4b89bf9d's: rule `recompose`, `when: 'always'`, drawn yes, built true), its path WIDENED by STOP 1's
   card-tie sites; the holder rows (VR9) and `cast.levers.holder`'s "re-keyed per read" note unchanged except where it names the
   host. `registry.json` by its door; `--check` 0.
8. THE ROLLBACK: drops the seven new helpers by signature (the six carriers, `_gallery_veil_id_text`); the restated
   `_gallery_veil` and the three reads go back to 211's statements as the down file already does (their volatility with them).
   001..211 + 212 + down = 001..211, rehearsed on a local chain.

## THE PLANTS THE INSTRUMENT GAINS (R4I-PAGE; red first on the -wip tree before R4I-SQL's commit is merged into it)
(e) an OWNER-hidden power (`hidden: true`, the act T case) whose face carries `npc_power_noble_families`: the lane's dark witness of
the lit case; (f) the marker key `npc.bo` of a card whose stored id is `npc.bo` (item 6). Each red before, green after; arm (1)'s
72 and arm (3)'s 12 to 0; arm (2) green on every read; tooth (v) (two reads share no person id) green.

## THE GUARDS VR46 RE-STATES (R4I-PAGE)
Every test that pins a served person id byte for byte (against another read, the owner's record, the 210 page or the twin) reds
once ids are re-keyed. FIRST, by grep and one run of `tests/security` + the files that call `galleryPayloadFor` / `applyVeil` /
`projectShareVeil` / `get_gallery_dossier` / `get_unlisted_dossier`: the list of reds, BY NAME, with the line that pins an id.
Each is re-stated MODULO THE READ'S PERSON-ID BIJECTION AND NOTHING ELSE (`personIdBijection.shared.mjs :: unkeyPeople`,
`canonPeople`, `bijectionTeeth`, five teeth executed per re-stated guard); a red that is not an id pin is a STOP to the seat.
a4b89bf9d's own list is the lead (`tests/domain/display/criminalVeilSwitch.test.js`, `publicSafe.test.js`,
`tests/security/galleryVeilPeople.pglite.test.js` there); this tree's list is measured, not copied.

## THE LIT WITNESS (the chair's 19:34 order)
The spelling half's witness is lit only (jp6-city-8). It is re-run READ-ONLY by the seat after "R4-IDS MERGED", on VEIL-33's join
branch once it carries the merge (E119: it merges every tip move; the seat asks the chair for its commit): a scratch worktree of
that commit, never pushed, the probe's act T litsurf re-run (`out/v33/joinprobe/lit/measure/litsurf/`), the 79 strings' 17
`npc_power_<slug>` ids to 0, server = twin. If the join branch does not stand by then: a scratch branch of
`lane/veil-33-2026-11-22-joinprobe-wip` (df7447e58) with the unit's commits cherry-picked, the same probe; a conflict there is a
STOP to the chair, never resolved by hand into the lane.

## THE PROOFS (the seat's, re-run by the seat before "TIP? R4-IDS <commit>")
The plants red first and green after; STOP 1 and the catalogue green (its plant still red); 001..211 + 212 + down = 001..211;
the cost law (VR36: the Reveal-DM read of the largest town within twice 211's Reveal-off read, timed); `--check` 0; a NEW pool
on the cured tree (`pool.sh` in a new directory), server = twin on every page, GATE-1 and GATE-2 NO WORSE than (0)'s (4 of 92,
7 LOWER; 20 of 40) at every setting (the signature reads row presence and key states, not id values: `tell2-signature.mjs`; any
move is read by name); readers' list row 17's count 0 on the plants and the lit witness; the arms (Tell3, 4, 5, 8, the part-one
file, the re-stated guards) and the walkers (registry, manifest, roster-choice pools, crimeTypes readers); `tests/lint` WHOLE (the
sixteen standing reds only, by name); typecheck (ceiling 167) and eslint on every touched file; ONE build (first paint's three
figures and the worker's beside the line's: `galleryVeilPeople.js` and `sha256Hex` reach the page only where `galleryVeil.js`
already does).

## LAWS
211 byte-frozen (`eface6d0…0b01` / `ce8474ff…712f`); every database local; no `supabase` command, no deploy; red first and SAID;
`tests/lint` whole after any test change; STOP rather than invent; a builder STOPS EARLY with what is left if its work will not fit
about 250,000 tokens. Each builder's last message: at most 250 words: its last commit, its files, each arm's red and green
counts, `tests/lint` whole's count, CONFIRMED vs PLAUSIBLE.
