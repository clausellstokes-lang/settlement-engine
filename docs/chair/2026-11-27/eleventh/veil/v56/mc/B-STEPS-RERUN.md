# MC (VEIL-56), WORK 1: `b-steps.mjs` RE-RUN on this machine: CONFIRMED (unit 3), with one new figure (the tip's unmarked map)

Written 2026-11-27T23:43:14Z (date -u). EXECUTED (CONFIRMED): VEIL-52's `v52/mapcost/b-steps.mjs` taken UNCHANGED from `origin/lane/veil-52-2026-11-24`
(`run.sh v52`) and run by `run.sh bu3 btip` (one mutex hold each), 23:39-23:42 UTC. Local PostgreSQL 16 (4 cores, fsync off),
socket /var/tmp/rv7; VEIL-52's recipe (`v52/restore.sh` step 4, `make-instruments.sh` at dbd4cd9e5: every step rc 0).
- `mcb_u3` = v27x211 (001..211) + UNIT 3's 212 (2f849aa53; the file VEIL-52 ran as `v52mc`).
- `mcb_tip` = v28tpl = v27x211 + THE LANE TIP's 212 (dbd4cd9e5; its get_gallery_map is 211's: unit 3 restates it).
- The stored 140: `dump.sh` (byte-equal at d71a3ee44 and dbd4cd9e5) run in the tip tree dbd4cd9e5, LP_TOWNS=1 (140 towns,
  38 MB, the largest 506 KB). VEIL-52's set came from b58abc48b; between the two trees `src/` differs in 8 display/summary/
  coherence files and in no generator file, so the documents are the same seeds through the same generator (not byte-checked).
- One read a map with `track_functions = 'all'` (the CAVEAT stands: tracking inflates wall time, most where calls are many).
Raw: `mc/out/bsteps-{u3,tip}.{json,txt}`.

## PER MEMBER (wall ms / 140), against VEIL-52's figures

| map of 140 | VEIL-52 (unit 3, tracked) | MC unit 3 (tracked) | difference | MC TIP (tracked) |
|---|---|---|---|---|
| UNMARKED members (`{}`) | 68,041 ms, 486 / member | 63,149 ms, 451 / member | -7% | 15,581 ms, 111 / member |
| MARKED (the hand marker) | 62,630 ms, 447 / member | 61,368 ms, 438 / member | -2% | 56,245 ms, 402 / member |

## BY STEP (unit 3, unmarked; calls / total ms / self ms): VEIL-52 then MC

| function | VEIL-52 | MC |
|---|---|---|
| _gallery_veil_roster_choices | 140 / 31,140 / 17,422 | 140 / 28,796 / 16,104 |
| _gallery_sanitize_public_json | 1,069,366 / 15,719 / 15,719 | 1,069,366 / 14,697 / 14,697 |
| _gallery_veil_name_hit | 316,505 / 9,011 / 9,011 | 316,505 / 8,377 / 8,377 |
| _gallery_veil_copy_names | 143,515 / 13,388 / 4,808 | 143,515 / 12,384 / 4,406 |
| _gallery_veil_second_homes | 140 / 10,332 / 2,538 | 140 / 9,467 / 2,301 |
| _gallery_veil_withhold_always | 140 / 2,400 / 1,712 | 140 / 2,272 / 1,622 |
| _gallery_veil_hidden_name | 17,216 / 1,541 / 1,541 | 17,216 / 1,379 / 1,379 |
| _gallery_veil_name_ready | 12,780 / 2,641 / 1,441 | 12,780 / 2,458 / 1,346 |
| _gallery_veil_name_prep | 15,636 / 1,217 / 1,217 | 15,636 / 1,127 / 1,127 |
| _gallery_veil_name_sweep | 87 / 1,721 / 1,193 | 87 / 1,598 / 1,107 |
| _gallery_veil_name_hits | 123 / 3,764 / 1,157 | 123 / 3,501 / 1,072 |
| get_gallery_map (self) | 1,231 | 1,211 |

Marked, unit 3: the same calls to the unit (MC: roster_choices 140 / 28,432 / 16,364; sanitiser 1,069,366 / 14,507; name_hit
316,505 / 7,931; copy_names 143,515 / 11,764 / 4,224; second_homes 140 / 9,394 / 2,312), VEIL-52's 2-12% higher throughout.

**CONFIRMED.** Every call count is VEIL-52's to the unit, both maps; every time is 2-12% lower here (a different container); the
shares stand: roster choices ~46% of the read (self ~26%), the sanitiser ~23% (1.07 M calls, ~7,600 a member), the name search
(name_hit 13%, copy_names 20% nested), the second homes 15% nested, withhold-always 3.5%.

## THE NEW FIGURE: THE TIP's UNMARKED MAP (211's read, before unit 3)

On the tip an UNMARKED member takes no veil on the map (211: the listing's own gallery veil; unmarked: `res` null, so only
`_gallery_veil_roster_choices(pub, pub)`, which returns at once, 149 ms for all 140, and withhold-always): 15.6 s for 140,
the sanitiser (832,527 calls, 11.5 s) its bulk. UNIT 3 (VR23: an unmarked member takes the DEFAULT veil, as the link does)
makes the same map 63.1 s, x4.1: the veil's full per-town work is what an unmarked member now costs, as a marked one already
did on the tip (56.2 s). That is the veil working as ruled (VR23 stands, V28 (7)); it is the cost the cure must carry.
On origin/master (088) a member is the sanitiser alone: N115's ~51 ms a member read singly (V7's table).
