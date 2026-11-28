# U45 REPORT (seat U45 of VEIL-56; units 4 and 5 rebuilt on the lane's tip)

CONFIRMED = executed by me in this container; PLAUSIBLE = read only. Hours from `date -u`. My first act: `u45/MISSING.md`.

## 1. WHERE THIS SEAT STANDS (current at every push)
Written 2026-11-28 (hour in the commit that writes it). THE SEAT HANDS OVER AT A STEP's END (COMMON item 7, near the mark).

BRANCHES (on origin):
- code `lane/veil-56-2026-11-27-u45-wip` at 535c7e956 (pushed 2026-11-28T00:22:04Z); base dbd4cd9e5. 15 commits.
- docs `lane/veil-56-2026-11-27-u45-docs`: this file, MISSING.md.
- NOT PUSHED, never to be: `scratch/u45-a5-trial` (2e4766ca2, A5's three commits on dbd4cd9e5, the two conflicts resolved to the
  base: see MISSING.md section 2).

DONE AND PROVED, IN VEIL-51's ORDER (each its own commit; red first, then green; logs under /var/tmp/u45/ on my box, the
figures in each commit message):
| step | commit | red first | green |
|---|---|---|---|
| merge M (M1, M2; M3's interim) | 5149cc3e3 | - (a merge) | the slices below |
| M3 census re-pin | 059ce845b | walker on the merge's interim: 3 of 11 red | 10/10 |
| M4 212 header (36)->(38) | 353391d13 | - (comments) | registry and standing-forms --check rc 0 |
| DESCARM merged | 0dcef6b88 | DESCARM is unit 4's red by design | 2/2 GREEN at da1582d40 (clean tree) |
| STANDWALK merged | e6c30ec25 | - | walkers green |
| N1 reader S narrowed to the cut | 9c375fc2f | standingReaders 2 of 5 red; domain-strict rc 1 at M (pageRederive.js +1, R5D's TS2345) | 5/5; domain-strict rc 0 (1113, ceiling 1113) |
| N2 the twin's end forced (VETOABLE) | 99e9fa43a | STANDWALK arm 5: 1 red on the un-forced twin | 19 passed, 1 skipped |
| N2b the lower-case qualifier | cffad3003 | census master UNCUT 4 (LEFTOVER 4) on the old table | master UNCUT 0, CUT EXACTLY 591/752; literal sha256 04838347... length 24,112 = VEIL-51's; 212 up/down/up rc 0 |
| N3 citations; the belt's reach | dcfc067b4 | - (comments) | V25 (4)'s measure re-run: BYTE-EQUAL to VEIL-51's v25measure-n2b.txt (7/754 today, 8/765 master) |
| item 5 power.desc 'not drawn' | da1582d40 | 2 of 15 red on the old row | 30 passed, 1 skipped |
| V27 (1) the stored belt | a08a9e80f | VEIL-51's v27twin.mjs and probe.sql: the 107 (3) desc SERVED without the stored row, both engines | WITHHELD with it, both engines; at Reveal DM served; 212 up/down/up rc 0 |
| V27 (1) the belt registered as a standing reader | 203e24e3c | the walkers reading 212 and the twin on a08a9e80f: 1 of 67 red (this site) | 66 passed, 1 skipped |
| term (a)'s doors walker | 535c7e956 | on da1582d40: 5 of 6 red (the three 212 doors, the map, no wrapper) | 15 of 16: ONE RED BY DESIGN, 211's get_gallery_map, until unit 3; manifest TOTALITY green |
| N5's slices (clean detached tree at da1582d40) | - | - | DESCARM 2/2, galleryWithholdAlways 9/9, galleryRosterChoices 39/39, domain-strict rc 0 |

THE POOLS (CONFIRMED): VEIL-51's dump.sh at d71a3ee44 (i42), LP_TOWNS=1: /var/tmp/v51/out/p1/stored-today (140, the tip's
engine at dbd4cd9e5) and stored-master (140, db832c892). They reproduce VEIL-51's: the census 743/752 served rows, 423/591
cut; V25's measure byte-equal.
THE MACHINE: PG16 /var/tmp/v18pg on /var/tmp/rv7 (make-instruments.sh: check, walker, harnesses, accept, tpl, gate all 0;
gate 0 HIGHER); v27x211 is the template; `sh /var/tmp/u45/sql.sh <tree> <tag>` does 212 up/down/up; `sh /var/tmp/u45/q.sh
<tree> <log> <vitest args>` runs a vitest through the mutex. Worktrees: /home/user/wt/u45 (code), u45red and u45b (clean
detached trees for red-first and slice runs), docs, i42, i43, master, tip, a5trial.

NOT YET DONE (the next seat's list, in order; every design is in VEIL-51's hand-back section 1 and its briefs):
1. V27 (5) THE WRITER-ORACLE CENSUS (instrument v51/u4/v27oracle.sh; red first on the pre-N2b table: master 3; then 0/754, 0/765).
2. TERM (b) CORRECTED: `_gallery_veil_stored_docs` / twin `storedDocs`; gallery and import pass jsonb_build_array(base.j, src.j),
   link base.j; the snapshot plant probed in both engines.
3. N4's arms (galleryVeilDesc re-cut to V15; V25's three standing arms) and THE MASK GAP: PROPOSE to VEIL-56 first (the measure,
   the rule "the belt treats the mask in a cut base as naming", what clean descs it would withhold). Nothing built of it.
4. A5's cut (G1 term 7): the field where it is held, '' served as it is, a non-matching field withheld whole, an absent key the
   table; `dmStanding` sent on no non-owner read (a registry row, one line of 212), both engines; the plants; births on the
   scratch tree only if VEIL-56 rules they count (asked in my first message).
5. Unit 5 U1 (twin), U2 (212 `_gallery_veil_person_named`), U3 (three registry rows), V20's six terms.
6. THE ARMS (VEIL-51's ARMS-BRIEF), A16, the proofs, the hand-in (U45-212-HUNK.diff, U45-PROOFS.md, "TIP? U45 <commit>").

STANDING REDS SEEN, NOT MINE (to compare by title on the base in the proofs): moduleScopeCwdRatchet A4 (tests/lint 19 roots,
banked 17), negativeAssertionAnchor (criminalVeilSwitch.test.js 230-231, veilCopySites.walker.test.js 244).
RECEIPTS: `receipts/` beside this file (every log's tail, the census tables, the probes, the instrument exits).

LISTED SO FAR (for U45-PROOFS.md): the map door's walker red until unit 3; N2's vetoable choice (no runtime different-span
branch); the twin's gap on a snapshot read (term (b): the twin cannot hold the live row; the server is the floor). INHERITED
REDS NAMED BY VEIL-51 at item 5 (not re-run by me yet): criminalVeilSwitch VS1 (b), galleryImportRederive "2".

ONE PROCESS NOTE: my first N5 slice run was started on my working tree and I edited V27 (1) while it ran; I stopped that run
(my own) and re-ran the slices on a clean detached tree at da1582d40. Only the clean run's figures are reported.

NEXT COMMAND (a successor): read this section, MISSING.md, the brief; `git -C /home/user/wt/u45 log --oneline -3`; then V27 (5).
