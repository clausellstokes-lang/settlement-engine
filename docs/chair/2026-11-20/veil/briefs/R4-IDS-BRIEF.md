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
