# PROOF-4 — the joined tip's proof (CLOSE-8 unit (4)); PARTIAL, written as each step lands

AFTER = /home/user/wt/join at 3836a832e3; BEFORE = /home/user/wt/before at 09c29806b8 (the line's tip). Raw data under
`proof/*-C`, `proof/*-V`, `*.jsonl`, `*.log` (kept out of git). Plans C and V re-made by `make-plan.mjs` /
`make-visitor-plan.mjs plan-lit.json`: byte-equal (cmp) to the plans the BEFORE battery used (CONFIRMED).

## Step 1 — AFTER battery: RUNNING (3 workers, --views)
Queued (each through `scripts/gate-mutex.sh --run`, one at a time; scripts `proof/tools-C/{battery,q1,q2}.sh`):
births on BEFORE and AFTER (C, V) with BIRTH-1's measure-d2/d2b/d3/d7/keys; measure-d5, measure-need, gi13 on AFTER;
WORDS-2 records dumps and WORDS-1 twin-strings on both trees; e8-check, d6-measure, d6-owed on AFTER; BIRTH-2 d4order on
both, p9beasts on AFTER; e8b-successor (before vs after, the seat's three seeds); sameness renders on AFTER (C, V for p9check;
the door's hxd births, 150 a size, for E13a's three slots); dp-thorp-2/-3 rendered twice on AFTER; `npm run build` + the two
VERIFY_DIST tests. Tool copies in `proof/tools/<seat>/` from each lane branch; the hard-coded `/home/user/wt/base` (gone) is
read as `/home/user/wt/before` (the base's role) or `/home/user/wt/join` where the tool reads the tree under measure.

### Step 1, C (CONFIRMED, 03:19 UTC): AFTER battery 900 of 900 rendered at 3 workers (no fill needed), exit 0; pattern table
identical row for row to BEFORE's (P5b 1, P8any 60, P14 1, P16three 348, P17 603, P18 419; all others 0).
`--diff=before-C,after-C`: record moved 746, page moved 887, battery rows moved 0 (gained 0, lost 0).
E2 census pairs (proof/tools-C/e2census.mjs, each pair by its own two printed sentences), BEFORE C: #1 34, #3 27, #4 4,
#6+7 1, #8 1, #9 0, #10 291, #11 28, #13 1; V: #1 21, #3 11, #4 2, #6+7 19, #8 10, #9 17, #10 285, #11 25, #13 9.
E1 owner pages, C (e1-measure over the battery's printed views; CONFIRMED): AFTER gap 0: 0 places, 0 hits; gap 1: 0, 0.

### Step 1, V (CONFIRMED, 03:36 UTC): AFTER battery 900 of 900 at 3 workers (no fill), exit 0. Pattern table equal to BEFORE's
except P9 129 -> 0 (thorp 44, hamlet 51, village 32, town 2). `--diff`: record moved 650, page moved 857, battery rows moved
129: every one "lost P9", none gained (BIRTH-2's P9 reported V 129 lost, 0 gained).
E2 census pairs AFTER: C #1 0, #3 4, #4..#13 0; V all 0 (#3 0).
E1 owner pages, V: BEFORE gap1 144 hits / 124 places -> AFTER 0/0 (gap 0: 143/123 -> 0/0). C BEFORE gap1 125/122 -> 0/0 (the seat's 125/122 exactly).
Render noise (CONFIRMED): dp-thorp-2 (C) rendered twice more on the SAME tree (the join): page hash d7e5f06eb598 both times,
against c7a7c4104ad7 in the AFTER battery: the only difference is the Power view's "Patron deity" premium block (2 lines),
present in the two re-renders and in BEFORE, absent in the battery's render; record hash equal throughout. dp-thorp-3 renders
the same page hash three times on the join (3fd62fe228d2): its move is G10's (a Defense line), not noise.
E13a, the three Viability slots (web Outlook, PDF canon_dossier, PDF draft_brief) on the C render of the join (sameness-census
--measure --plan=planC; e13a-door-slots read through the join's script; CONFIRMED): shareAll thorp .333, hamlet .327,
village .20, town .28, city .187, metropolis .22, the three slots equal at every size. The door's own births (hxd, 150 a size)
are queued last.
E13a on the V render: thorp .193, hamlet .167, village .153, town .287, city .18, metropolis .127 (three slots equal; CONFIRMED). V sameness render: 900 rows, 18.7 min (its driver was stopped after the render; the count printed whole).
