# COHERENCE-VEIL — hand-back, part 19: the eighteenth seat (212 finished: V8-2/4/5, B, C, D, VR7, E)

Seat: VEIL-18, branch `lane/veil-18-2026-11-19`, cut from origin/lane/veil-17-2026-11-19 at **1f501779b** (read back
from origin first: equal). Assignment: `lane/chair-2026-11-08 :: docs/chair/2026-11-19/veil/prompts/VEIL-18.txt` (the
chair is session_01FbPLbcLDSJzZFzb5B7EjxR). Every database is an in-process pglite or a scratch native PostgreSQL 16
cluster in this container (`/var/tmp/v18pg`, locale C.UTF-8, trust auth, unix socket `/var/tmp/rv7` only,
`listen_addresses = ''`). No hosted database, no production credential, no `supabase db push`, no `migration repair`,
no deploy, no pull request. **Nothing is applied anywhere but those local databases.**

**TIP:** the commit carrying the latest copy of this file, read back from origin.

## 0. The rulings this seat works to (each vetoable by the owner)

PART 18 section 0 and section 4 stand whole: VR1 to VR14 and THE CLEARANCE STANDARD (at FINAL the reader re-runs the
differ; every differing path is in the registry with its rule (a) or (b), or ruled diffuse (VR8), or rng-only (VR13):
zero unregistered paths). The laws and the push paragraph of `prompts/VEIL-17.txt` bind word for word.
THE SWITCH (the owner, 2026-11-19 ~07:30 UTC): a separate seat, VEIL-SWITCH, owns `src/components/gallery/CurateMode.jsx`
and `src/domain/display/criminalVeilSwitch.js`; this seat does not edit them; on "SWITCH <commit>" it merges that commit
with `--no-ff` before E.

## 1. The bytes (kept current)

| File | sha256 |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` (FROZEN) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` (proved at 1f501779b) |
| `supabase/rollback/211_server_side_share_veil.down.sql` (FROZEN) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` (proved at 1f501779b) |
| 212 at the base | `d1b5da911f66d41c3f0350cf93dcf792b4e000fe5ca39f1fe5ea69cd9103a938` / down `5b3eb697ae2531f83c2586d2c59b5afe414e6647ba65b9a884e9dfd09ddf694f` |

212 is NOT final.

## 2. The base, measured first (the seat's own)

- THE ACCEPTANCE RUN (REVIEW-VEIL-7 `run-all.sh` on `git archive 1f501779b`): exit 1; checks 37 | PASS 35 | FAIL 2; a07
  and d06 the only FAIL rows; server against twin: all 15 equal. As PART 18 states.
- THE READER'S DIFFER (`differ.probe.jsx` of origin/lane/review-veil-9-2026-11-19, N=2, 140 births, 91 with a hideable
  house, the base's own twin, 92 s on four shards): every eye shut, 235 paths differ A/B in two towns or more, **130 IN
  THE CLASS** (49 NUMBER/BOOLEAN, 28 CRIME-WORDED, 40 OTHER, 13 HISTORY RE-DRAW), 94 re-roll; the default veil 138 in
  the class. The reader's bound (130) reproduced exactly.
- THE SAME DIFFER THROUGH THE SERVER (VR15; `measure/differ/run-differ-server.sh`, the gallery read on a chain 001..212
  of the base): the reader's gate (empty registry, the VR13 rng ruling) `registered 0 | diffuse 0 | rng-only 20 |
  UNREGISTERED 124` (`out/v18/differS-gate-at-1f501779b.txt`): the reader's baseline at ad093c92c, exactly.

## 3. The list (PART 18 section 6), as it stands

| Item | State |
|---|---|
| V8-2, V8-4, V8-5 | BUILT by identity (the builder's 49965db7e, 07b569bf5, 8bd90b90b to `briefs/SUB-BRIEF-V8-245.md`; cherry-picked as e861caed2, 31d1eacb7, 2d92ddde5); nothing to WHAT 212 DOES NOT CLOSE. V8-2: a defence row is its house's by name OR when its name's fold is the house's `catalogId` (the fold equals the catalogue id for 252 of 252 catalogue names, the seat's check), the eye that withholds wins; V8-4: a top-level `factions[]` entry keeps `faction`/`name` only where that string, in the one fold, is a shown power's; V8-5: a tie any of whose ends the sweep removes (id, name, `npc.<slug>`) leaves whole, both shapes, its copies following ruling (5). Red -> green on town-g, 8 reads: 56 -> 0, 3 -> 0, 664 -> 0; server against twin 0 paths; born 1,152 rows 0 differ; V8-5 drops 0 on born towns; cost within twice 211 (V8-3 row 1.16x, 50/500/500 1.66x). 212 `dae0ae6c…19e247`, down `45da09eb…30a1c9`. THE SEAT READ THE DIFF LINE BY LINE: nothing to cure. THE SEAT'S OWN RUN at 2d92ddde5: the six guard files 6 of 6, 123 of 123; the twin's tests and the switch's 7 files, 130 of 130; the acceptance run exit 1, a07 and d06 the only FAIL rows, 35 of 37, the library's 15 hand rows server against twin all equal (the library's rows, not born towns: VR15 (c)) |
| B, C, D | IN HAND: a builder to `briefs/SUB-BRIEF-BCD.md` (worktree `/home/user/wt/b2`, branch `v18-b2`, base 2d92ddde5) |
| VR7 (the registry), VR9, VR10 | MEASURED (`out/v18/VR7-MEASURE.md`, a read-only seat; M1, M2's census and M4 executed, M3 read only). VR9: of 4,966 people who are not a veiled face, 0 are shown with no role on an unveiled page (180 born towns, both shapes, Reveal off and on); the 278 role-less are all `npc_veiled_` faces, so a blank role would tell: THE HOLDER'S CARD IS WITHHELD WHOLE WITH ITS TIES. VR10: no non-owner surface needs a person id stable across reads (an import is always a new save); the re-key must reach every in-payload reference (tie `id`, cast `roles[].id`, `levers[].holderId`; on Reveal DM `goal.intent.*.target.id`, `allegiance.handler`, the trace's targets); id forms: 4,875 `npc_<slug>` (3,922 spell the person's own house), 91 `npc_power_<faction>`, 278 `npc_veiled_<hex>`. M3: of the 130 class paths 52 are drawn on a non-owner page, 77 are not, 1 unread; `militaryEffective` is drawn on NO shared page; `safetyRatio` only as words (the importer's PDF prints the raw figure). M4: master's shape at N=2 is 131 in the class (113 at N=1, the reader's); 46 of them not among the new shape's 130 |
| VR7 THE REGISTRY | the sub-brief `briefs/SUB-BRIEF-VR7.md` (a staged build R1 to R7). RULING VR16 (the chair, 09:22 UTC, vetoable by the owner; copied whole in the brief): the seat's design 1 APPROVED: a field NO non-owner page draws is withheld on EVERY non-owner read whatever the veil; only drawn fields take a conditional rule, (a) by preference; conditions: (1) prove "undrawn" by a born render-twice test of every non-owner surface (byte-equal with the fields put back, through the server's payload); (2) the import never carries what a page withholds (re-derived at the save from served data, or read as "not known"; else to the chair first); (3) the owner's own reads and exports untouched. VR9 and VR10 ACCEPTED as measured. Order: R1, R2, B/C/D, VR15 (b), E. R1 IN HAND: a builder in `/home/user/wt/r1`, branch `v18-r1` (new files only, beside the B/C/D builder) |
| VR15 (b), placed by the chair after VR7 and before E (07:54 UTC) | not started: re-run the reader's `server-twin-census.probe.jsx` (origin/lane/review-veil-9-2026-11-19) at the tip; its measure: 140 of 560 shares differ, all Reveal-DM with every eye shut; NO twin-stricter class (no server leak); one server-only class (a person's open cover membership, 7 shares); the twin LAXER in 15 classes + 4 of different value (a switched-off person's gender, importance, power, structuralRank, structuralPosition, settlementCondition, stressNote; role, title and tie roles, 91 shares; the TRUE veiled membership where the server sends the cover, 80 shares). Bring the twin to the server class by class, or record a class in the pack as a known preview difference (the preview shows more, never less) and tell the chair which |
| VR17 (the chair, 09:42 UTC, from the reader's 3da0516c7), placed BEFORE E, after VR15 (b) | not started. THE FINDING: the client hides a shut grouping's DERIVED blocks through a WeakMap keyed by the settlement OBJECT (`galleryVeil.js` :: VEILED_GROUPINGS; markVeiled / veilGroupingsOf / isVeiled); a copy (structuredClone, deepClone, a JSON round trip) loses it, so a non-owner surface that copies the settlement before drawing (print, PDF, an export or journal of the shared page) loses the veil on derived blocks. THE RULE: the shut-grouping signal SURVIVES A COPY on every non-owner surface; choose and report the mechanism, preferring one that survives by construction (the signal carried as data in the served payload, stripped at an import's save if meaningless there) over re-applying after each copy; (1) a walker over every place a non-owner surface copies a page model, red on one not registered as keeping the signal; (2) a born test rendering each copying surface on a share with each family grouping shut, through the server's payload, finding no derived block of a shut grouping. A NEW KEY in the served payload is told to the chair (which and why) BEFORE it is built |
| THE SWITCH | MERGED: the chair's "SWITCH d61c63bbe" (08:03 UTC), merged with `--no-ff` at c2db1bda2 (no conflict; its four files only); its two tests at the merged tree 2 files, 10 of 10 (`criminalVeilSwitch.test.js`, `curateModeCriminalSwitch.test.jsx`), eslint 0. RULING VS2 recorded (a family grouping counts as criminal only where hiding it removes something from that town's copy). A default class this seat adds to `galleryVeil.js` must be placed in `CRIMINAL_VEIL_CLASSES` or `NOT_CRIMINAL` on purpose (the switch's walker) |
| E | not started |

## 4. How the instruments are re-made

PART 17 section 5 with `/var/tmp/v18` for `/var/tmp/v16` and `/var/tmp/v18pg` for the cluster; `pg@8.13.1` in
`/var/tmp/v18/pgmod`; the readers' library: `git archive 72a3bb24f docs/chair/2026-11-13/probes/REVIEW-VEIL-6
docs/chair/2026-11-13/probes/REVIEW-VEIL-7 docs/chair/2026-11-14/probes/REVIEW-VEIL-8` and `git archive
origin/lane/review-veil-9-2026-11-19 docs/chair/2026-11-19/veil/probes/REVIEW-VEIL-9`, both into `/var/tmp/v18/lib`.
The differ: `/var/tmp/v18/rv9/run-differ.sh <tree> <outdir> [N]` (the reader's probe, four shards, then its merge and
classify scripts). A builder's worktree takes `cp -al <real node_modules>` (PART 18 section 5's symlink trap).
