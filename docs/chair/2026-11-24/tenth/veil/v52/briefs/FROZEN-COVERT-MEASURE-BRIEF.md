# BRIEF: FROZEN-COVERT MEASURE (VEIL-52's builder; the chair's RULING V28 (2), "MEASURED BEFORE IT IS BUILT"). A MEASURE ONLY: NO line of
`src/`, `supabase/` or `tests/` changes. READ FIRST, WHOLE: RULING V28 in `docs/chair/2026-11-24/tenth/veil/RULING-V1.md` on
`origin/lane/chair-2026-11-08` (`git show origin/lane/chair-2026-11-08:docs/chair/2026-11-24/tenth/veil/RULING-V1.md`, the V28 section).

THE FAULT (V28 F1): in SNAPSHOT mode a share's source is its FROZEN COPY (`gallery_member_overrides -> '$veil' -> 'snapshot'`, read by 212's
gallery read, import and map member). Master's client stores that copy as `galleryPayloadFor(settlement, ...)` (master's
`src/domain/display/galleryVeil.js :: galleryPayloadFor`, which is `toPublicSafe` alone and drops every nested object whose `covert` is
true). So the copy holds no covert tie, 212 :: `_gallery_apply_member_overrides`'s `dropped` set is empty, and the covert tie's
`prominentRelationship` and the `pressureSentence` that tells it PASS at the three doors, where the party link (live row) withholds them.

THE ORACLE (not the rule): the RAW stored town says which strings tell a covert tie: `prominentRelationship` TELLS one when it copies a
tie of the raw `relationships[]` whose `covert === true` (the same two ends and type: pr.npc1/npc2/type vs t.npc1Name/npc2Name/typeName;
or pr.full === t.description; or pr.tension === t.tension); `pressureSentence` TELLS one when it names both ends of a covert tie (both
names as written) or holds the covert tie's description or tension text. Write the oracle as its own small function in your probe
(do NOT import 212's twin `withholdCovertCopies`: the oracle must not lean on the rule).

THE RUN (a copy of VEIL-44's um harness, `docs/chair/2026-11-20/veil/out/v44/mapcovert/um.probe.jsx` at 6edc79094, run as um.sh runs it;
put your copy under `docs/chair/2026-11-24/tenth/veil/v52/frozen/` on `lane/veil-52-2026-11-24-door2-wip`): the stored sets
`/var/tmp/v52/out/stored-today` and `/var/tmp/v52/out/stored-master` (140 each; index files beside them). For EVERY town whose raw record
holds a covert tie: build the frozen copy TWO ways, (M) master's client path: `galleryPayloadFor` imported from `/home/user/wt/master/src/...`
(master's tree, db832c892) with shareDm false and no overrides; (T) the tip's: the same function from `/home/user/wt/door2/src/...`. Store
the town as the owner's public row with `gallery_member_overrides = {"$veil": {"v": 1, "deltas": [], "mode": "snapshot", "at":
"2026-11-01T00:00:00.000Z", "snapshot": <copy>}}`, `gallery_share_dm` false; also one public map_with_campaign listing it. Read, at Reveal
off: `get_gallery_dossier` data, `import_gallery_dossier` data (as the premium reader), `get_gallery_map` members[0].settlement; ALSO a
LIVE-mode control (`mode: "live"`, no snapshot) and the party link (`get_unlisted_dossier` -> 'dossier'). Server: TWO templates on the
local PostgreSQL 16 (socket /var/tmp/rv7, user postgres): `v52tip` (the lane tip's 212) and `v52dsql` (unit 3's 212 at 2f849aa53): both exist.
COUNT per set x copy (M/T) x door x template: towns, reads where the served `prominentRelationship` TELLS a covert tie (by the oracle), reads
where the served `pressureSentence` TELLS one. Expected RED on both templates for the snapshot rows; 0 for the live control and the link.

THEN THE PROPOSED RULE, evaluated OFFLINE in your probe over the same served documents and the stored rows (JS, no SQL change): the dropped
set is (a) the SOURCE's own covert ties (`source.relationships[]` with covert true) PLUS (b) the LIVE STORED ROW's covert ties (`data`'s, and
for a narrated row `ai_data.aiSettlement`'s); and (c) THE ORPHAN RULE: a `prominentRelationship` that copies NO tie present in the source's
`relationships[]` (neither ends+type nor text) is withheld, and the `pressureSentence` with it; and (d) a source carrying either string with no
`relationships` key is unread (both withheld). For EVERY town of both sets (not only covert ones), at every door, Reveal off, snapshot (M and
T) and live: count (i) LEAKS left (a telling string the rule would still serve), (ii) CLEAN STRINGS the rule would withhold (a
prominentRelationship / pressureSentence that tells NO covert tie by the oracle, withheld by (b), (c) or (d)), each by which part withheld it,
with up to five examples (seed, door, the string's first 120 characters).

DISCIPLINE: through the gate mutex (`cd /home/user/settlement-engine && GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- <cmd>`),
output to logs under /var/tmp/v52/builder4/ with exit codes appended, backgrounded with an until-loop wait; never read a gate through a pipe.
Commit your probe and tables by explicit paths on `lane/veil-52-2026-11-24-door2-wip` (worktree /home/user/wt/door2), hooks as configured
(never `--no-verify` or any hooks bypass); NEVER push; no hosted database; never the `supabase` command. After a container restart, start
PostgreSQL: `su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v18pg -l /var/tmp/v18log/pg.log -w start"`. A refusal by your
permission check stands: stop and report.

REPORT: `docs/chair/2026-11-24/tenth/veil/v52/frozen/FROZEN-COVERT-TABLE.md` (committed): the leak table (RED), the rule's table (leaks left;
clean strings withheld by part, with examples), CONFIRMED vs PLAUSIBLE. Final message at most 200 words.
