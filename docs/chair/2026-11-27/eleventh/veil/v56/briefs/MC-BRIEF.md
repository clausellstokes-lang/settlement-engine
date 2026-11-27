# SEAT MC (measure and proposal; NOTHING IS MERGED FROM THIS SEAT): MAP-COST AND READ-COST

READ FIRST, WHOLE: `COMMON-V56.txt` beside this file. YOUR BRANCHES: documents only, `lane/veil-56-2026-11-27-mc-docs`, cut at
`origin/lane/veil-56-2026-11-27`, your files under `docs/chair/2026-11-27/eleventh/veil/v56/mc/`. Your working tree: detached worktrees of
`origin/lane/veil-52-2026-11-24-dsql-wip` 2f849aa53 (unit 3 as built) and of the lane's tip dbd4cd9e5. You change no file of `src` or
`supabase` on any pushed branch; a trial SQL lives in your documents folder as a `.sql` file applied only to your local database.

## READ (and no wider)
1. `RULING-V1.md` on the chair's record: V7, V11, V28 items (3) and (8).
2. On `origin/lane/veil-52-2026-11-24`: `docs/chair/2026-11-24/tenth/veil/VEIL-52-HANDBACK.md` SECTION 0's MAP-COST paragraph;
   `v52/mapcost/A-PLATFORM-TIMEOUTS.md`, `B-STEPS.md`, `b-steps.mjs`, `C-OWNER-COUNTS.sql`; `v52/out/READ-COST-TABLE.md`, `N115-TABLE.md`,
   `v52/n115.sh`, `n115.mjs`; `v52/restore.sh` (your machine's recipe).
3. WHOLE, in 212 at 2f849aa53: `get_gallery_map`, `_gallery_apply_member_overrides`, `_gallery_veil` and the helpers B-STEPS names as costly;
   in `147_gallery_tile_chain_aliveness_title_reactions.sql`: `_gallery_public_tile_rows`, `get_gallery_dossier`, `list_gallery_dossiers`.

## THE WORK, IN ORDER (each a file, then one line to me)
1. RE-RUN `b-steps.mjs` on your machine (a 140-member map, unmarked and marked members, the tip's 212 and unit 3's): `mc/B-STEPS-RERUN.md`,
   per member and by step, against VEIL-52's figures. CONFIRMED or the difference.
2. V28 (8), THE LOCK: `get_gallery_map`'s first statement is the view-count UPDATE, so the map's row lock is held for the whole read. Measure
   it: N concurrent readers of ONE map (N = 1, 2, 4, 8), wall time each, and the same with the UPDATE moved after the read in a local trial
   copy. `mc/LOCK.md`.
3. THE PLATFORM's LIMITS: A-PLATFORM-TIMEOUTS.md stands as PLAUSIBLE (search-rendered by VEIL-52; you fetch nothing from the web). State what
   each limit means against your figures: at how many members a map read passes 3 s (a visitor) and 8 s (a signed-in user) on this machine,
   on the tip and with unit 3. Say plainly that production's speed is unknown.
4. THE CURE PROPOSED, WITH ITS SIZE, for the chair to rule (`mc/PROPOSAL.md`, at most two pages): for the map read (candidates to weigh, by
   measured saving on a local trial: the counter moved out of the read's lock; per-member work that repeats across members hoisted; the
   sanitiser's recursion; the roster choices' cost; a member cap or paging as the floor) and for READ-COST as V11 rules it ((i) one row's
   tile; (ii) the facets as stored columns). For each: what it saves (measured), what it edits (212's text, or a migration of its own),
   what it risks for the veil (every door must stay equal to the link's by value: V1-3 point 3), its size in seat-hours. NOTHING HERE
   WEAKENS THE VEIL: a cure that skips a veil step for speed is not a candidate.
5. `C-OWNER-COUNTS.sql` is the owner's hand: read it, say whether it is still right for the chain as it stands, change nothing live.
