# V43-MEASURE: NAMES measured, both forms; DAILY withdrawn (N91) (VEIL-43's second builder; brief 5de9073eb)

The predecessor's notes (commit 4d9f14cd3) are superseded by this file. The instrument (`wd.probe.jsx`, `wd.sh`, `wd-an.mjs`) is
reused unchanged. The full run's chain is `names-full.sh`. The tables are `wd-table-born.txt` and `wd-table-stored.txt`.

## STOPS
1. A MAP-MEMBER HIT THAT IS NOT THE KNOWN FAULT (`wd-an.mjs` exit 3, both forms). Sent to the seat at 14:05 UTC. THE CHAIR,
   N104: known, chain A's (R5-DESC, not yet on the lane's tip); nothing built here. Classed below as R5-DESC.
2. No other stop fired. No server read errored (no document missing on any of the 16,800 reads per form). My own permission check
   refused nothing. The supabase diff (`git -C /home/user/join43 diff 23bb8b8ae HEAD -- supabase`) is empty.

## THE COST
The cost shard (10 towns, born) took 305 s, 80% of it server reads. Extrapolated: about 50 min for both forms; sent to the seat.
The run itself (13:41 to 14:27 UTC, one mutex hold): the dump took 2 min, born 21 min (4 shards), stored 23 min.

## DOORS READ (by name)
- Server: `get_gallery_dossier` (gallery), `get_unlisted_dossier -> 'dossier'` (link), `import_gallery_dossier` as reader
  2222... (import), and `get_gallery_map #> '{members,0,settlement}'` (the map member, through a `saved_maps` row).
- Twin: gallery (Reveal as set) and link (Reveal off).
- Every setting `tell-common.mjs :: settings` computes (own, g:000..g:110, allOpen, off), Reveal off and DM, the gate's 140
  births (92 hidden-house towns, 48 controls).

| form | reads | hiding reads | places with a hiding read | NAMES path patterns | map known fault | map other |
|---|---|---|---|---|---|---|
| born   | 16,800 | 11,310 | 95 | 1 | 0 | 40 |
| stored | 16,800 | 11,310 | 95 | 1 | 0 | 40 |

The stored form is the lane's round trip: `out/v33/legacy/dump.probe.jsx` at 9f9b819f7, run unchanged with LP_A=0 LP_B=0 and
an empty pool. All 140 stored documents equal the born ones byte for byte (140 same, 0 differ). No birth carries a
`neighborRelationship.name` (0), so the neighbour step `dump.probe.jsx` skips is a no-op on these 140: MEASURED. Master-born
stored documents are not in this measure.

## NAMES: every hit, by class (both forms identical)
| class | path | kind | reads | places | IN R5's list |
|---|---|---|---|---|---|
| R5-DESC: cured by chain A's merge | `powerStructure.factions[].desc` | name | 240 | 2 | IN (ruling 32 / 36 (b)) |
| every other class | (none) | | **0** | 0 | |

THE 240, by seed, row, door and Reveal:
- r3m-town-none-0-17: the row is the Church's desc ("...they play the Thieves' Guild and the ..."). Withheld: Thieves' Guild,
  Street gang, Front businesses.
- r3m-city-none-1-117: the row is the City watch's desc ("...they play the Thieves' Guild and the Co...").
- Each door and Reveal holds 20 reads: server gallery, link, import and map, and twin gallery and link, each at Reveal off and
  at DM (12 x 20 = 240).
- 20 = 2 places x the 10 settings. On the map member this is CONFIRMED: the listing names both seeds at every setting, Reveal off
  and DM (40 lines). On the other doors the per-seed split is PLAUSIBLE, by the same arithmetic.
- The map member serves it at the row's Reveal DM too (the map never reads `gallery_share_dm`).

R5's named list is not a list in PART30 section 1 (grep `R5` and "named list"). Section 1 names in prose ruling 32 / 36 (b)
(`powerStructure.factions[].desc`, `factions[].desc`) and ruling 14's six alias paths
`publicProse.blocks.economy:{daily_life,resources,services}.{incomeMix,criminalLine}`. The marking is against those
(PLAUSIBLE). There are NO OUT PATHS, so no writer or landed point is owed.

## dmNote, the DM payload by design (ruled, N104)
- `powerStructure.factionRelationships[].dmNote` is served on Reveal DM reads only: 870 each on server gallery, server import
  and twin gallery (2,610 per form; born and stored alike).
- At Reveal off it is ABSENT on all six door-engine pairs.
- Even at DM it is absent from the server link and the server map member. The twin's link is read at Reveal off by design.
- No other owner-ish key (`/audience|owner|^dm|_dm$|dmOnly|dm_only|dmLayer|isDm|gmOnly/i`) is in any served document. The
  dm-slot key `commoner_resentments_dm` is absent from every served document: 0 per form. (DAILY's slot derivation is withdrawn
  and was not run.)

## TO RE-RUN
TO RE-RUN after chain A's tip is merged into the join: NAMES born form must read 0 at `powerStructure.factions[].desc`
(r3m-town-none-0-17 the Church; r3m-city-none-1-117 the City watch). From /home/user/join43 (about 21 min; if the merge changes
212, the template must first carry the merged 212):
`env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE GATE_MUTEX_MAX_POLLS=360 sh scripts/gate-mutex.sh --run -- sh /home/user/settlement-engine/docs/chair/2026-11-20/veil/out/v43/meas/wd.sh /home/user/join43 /var/tmp/v18/out/v43/meas/rerun-born v28tpl born`
Exit 0 and no `HIT` line in `/var/tmp/v18/out/v43/meas/rerun-born/wd-table.txt` is the bar.

## CONFIRMED vs PLAUSIBLE
CONFIRMED (executed, both forms):
- the counts above: 1 hit path; other classes 0; map known fault 0; dm-slot key 0; dmNote at DM only, on the three pairs
  named.
- stored equals born on all 140.
- the carried judgment lines matched the test file's bytes at start (the probe throws otherwise).
- the supabase diff is empty.

PLAUSIBLE:
- the IN marking (R5's list exists only as prose).
- the per-seed split of the 240 on the non-map doors.
- "cured by chain A's merge" is the chair's ruling, not measured here.
