# REVIEW-R3-TABS — round three's tabs lane, aac79b808..bb2bf91c5, read by an independent reviewer

**VERDICT: NOT CLEAR** for lane/r3-tabs-2026-11-13 at bb2bf91c5. One HIGH and two MEDIUM findings are the stage's own (EXECUTED, read on the rendered page). Steps 3–7 were NOT run (the count, below), so this verdict can gain findings and cannot lose them: a HIGH of the stage's own stands whatever the remaining steps find.

The tip read: **bb2bf91c5** (the branch's newest, 5f8602371, is one docs-only commit later). Step 1's list, written and pushed cold before any of the lane's statement was opened: [REVIEW-R3-TABS-LINES-READ.md](REVIEW-R3-TABS-LINES-READ.md) (357018abd). Probes: `probes/REVIEW-R3-TABS/`.

## Findings, ranked

| # | Rank | Own / carried | Town · sentence | Fact against it | Proof |
|---|---|---|---|---|---|
| F1 | **HIGH** | THE STAGE'S OWN (L1 + the disqualifiers, defenseStateProse.js / postureLineDisqualifiers.js) | rr3-metropolis-occupied-rand-2 (Ingili): "What Ingili can field and what Ingili has built are both in good order; the metropolis would take real effort to threaten and knows it." | Under OCCUPATION (the banner below it: "The occupiers' troops at Ingili protect it from everyone except the people who sent them"); Invasion & War bar Weak (military 39); the guard assessment above: "exists on paper. Chronically underpaid and poorly equipped." The line tip printed an adequate line here. Strong posture beside a Weak/Critical bar: 0 towns at 976db5b19, 2 at the tip: L2 guards one direction only, and the strong pool is struck under a siege or a war, never an occupation. | EXECUTED (page) |
| F2 | MED | THE STAGE'S OWN (L0: `invasionRowPoolKey(walls, garrison \|\| contracted, militia \|\| watch)`) | 139 walled towns whose only force is a watch now draw the citizen-militia pool, e.g. r2s-occupied-town-0 (Cerrocastra, occupied, military 1): "Every household at Cerrocastra would send someone to the walls, and everyone knows that townsfolk with spears are no trained army." | No militia or levy in the record (walls + Town watch). In 41 of the 139 the same tab prints the watch's own line "…a matter of order rather than of war… not built for what arrives from outside it". 0 such towns at the line. I would rule differently from the chair's L0 note ("a watch stands with the townspeople's pools"): the owner may veto. | EXECUTED |
| F3 | MED | THE STAGE'S OWN (L1) | rr3-town-occupied-rand-1 (Muulcoba): "Muulcoba reads as a defended place from the road in: the approaches are watched, the works are kept up…" | No walls in the record; the Invasion row beside it: "The town's defense is people rather than works"; bar Weak (34); occupied. | EXECUTED (page) |
| F4 | MED ×13 | the desk's general lines, NEWLY VOICED by the stage (L3, `properFill` `/^\p{Lu}/u`) in 14 towns whose names open with a non-ASCII capital | e.g. rr3-town-recently_betrayed-port-1: "…the town keeps no wards or seers that would notice if it had." · rr3-town-calm-rand-2 (Magic tab): "Ögedeitash's trade in cavalry mounts rests on a few practitioners, not on the land." | the first beside "Arcane Support: Present · Teleportation circle. Detection, wards, counterspell"; the second beside "Economic role: absent". 115 of 148 Defense lines TRUE; 12 MED, 21 LOW (`out/l3/VERDICTS.tsv`, a helper's read, three re-checked by me); Magic 9 TRUE, 1 MED, 1 LOW. | EXECUTED (helper + sample) |
| F5 | MED | CARRIED CLASS (defenseStateProse.js posture vs invasion pools; the readiness badge against the force roster) | r2s-famine-metropolis-2 (Caththwaite): "Caththwaite could deal with a brawl or a thief, but the metropolis could not hold off a raid." | Two rows below: "Caththwaite's garrison roll puts paid soldiers on every stretch of its walls, so raiders stay away"; massive walls, multiple garrisons. The class: 80 towns at the line, 82 at the tip. | EXECUTED |
| F6 | MED | CARRIED CLASS (the defence supply pool ignores the crisis) | rr3-town-under_siege+famine-rand-1 (Shivabari, Undefended 10): "…The trades that feed and equip Shivabari's defenders are busy and well stocked, and the defenders know it." | Under a siege AND a famine. 24 towns at the line, 31 at the tip (+7 moved in by L0's `force`). | EXECUTED |
| F7 | LOW | THE STAGE'S OWN (L0, beasts) | r2r-town-11: the beasts row's held-perimeter lines beside the watch's "not built for what arrives from outside it" | 42 towns at the tip, 0 at the line. | EXECUTED |
| F8 | LOW | CARRIED twin (`plotHooks.js :: EVENT_LABELS`) | Plot Hooks: "Exile & Return Event" (209 pages), "Occupation Event" (307) | History now names the same events Occupation Legacy / Infiltration Fear: the statement's "Exile & Return 622 → 0" holds for History only. | EXECUTED |
| F9 | LOW | the stage's own (`seaRoute`) | 115 river-route towns lose the naval line | Cured by silence; about 70 of the removed ("The port is {S}'s living and its open door…", "You can sail into {S} unchallenged…") were plausibly TRUE of a river port, and 22 of the towns sit on coastal terrain. | EXECUTED (count), PLAUSIBLE (truth) |
| F10 | LOW | CARRIED (the food generator's label) | 18 towns under a siege: the Substrate Food row "Import-dependent" | roads cut; the Overview prints the same word. | EXECUTED |

**Lines I would strike, for the owner's veto:** the citizen-militia pool's v2 ("Every household at {S} would send someone to the walls…") wherever the record holds no militia; the strong posture pool under an occupation (as under a siege or a war); v1's "the works are kept up" where the record holds no walls.

## Step 2 — the lane's statement, row by row (only the cure rows; read against my own run)

| The statement's row | My run (1,536: the census's 720 + 816 in the app's shape) | Verdict |
|---|---|---|
| REQ/FORCED 360/246 → 0 | 885 pages → 0; nothing prints in place | cured by silence (the chair's b1) |
| Underworld band 118 → 0 | 254 banded → 0; prints the record's faction name | cured and true |
| "Exile & Return" 622 → 0 | History: 642 → 0, "Occupation Legacy" true in every event; **Plot Hooks still prints it (F8)** | cured on History only |
| Foundations Food word 720 → 0 | the Overview's own band in every town; 0 "Secure" under a siege or famine | cured and true (F10 low) |
| Trade row under a siege 24 → 0 | 127 → "Under siege" | cured and true |
| L0–L3 and the siege posture (the reader's classes → 0) | the removed lines were false (83 invasion "no line and no force" beside a watch; 74 posture lines struck by the stage's own rules), BUT what L0 and L1 print in their place is false in F1, F2, F3; the class the reader counted moved to new sentences | **not a cure where F1–F3 print**: still false |
| Crime rows cut mid-sentence 339 → 0 | 576 → 0; whole sentences, verbatim function | cured and true |
| Severity range (History 1,089 → 0; PDF 2,190 → 0) | History 1,395 pages → 0; the PDF view-model 2,356 ranges → no word; HistoryFounding guarded; the Foundry journal prints none | cured by silence; 379 single severities print their own word (true) |
| Naval off the sea 57 → 0 | 115 → 0 on my births | cured by silence, with true lines lost (F9) |

**The chair's rulings, where I would rule differently:** L0's note that a watch stands with the townspeople's pools (F2: the pool's own words name a household levy); and L1/L2 need the reverse guard (a strong line beside a Weak bar, or under an occupation: F1, F3).

## Step 8 — births and ranges (EXECUTED)

The tip's 1,536 records are byte-identical to the line tip 976db5b19's that the lane merged (sha256 of the stream equal; field diff 0 leaves): the lane moves no record. Base aac79b808 against the tip: 11 towns differ, all `coherenceNotes` (the line's change). A severity word printed for a range: **0** on the web History tab, the PDF's Overview and Power slices and the Foundry journal; the PDF HistoryFounding section is guarded in code (not rendered).

## What I did not measure (THE COUNT: 329,580 tokens at the step-1 check; handed back near 400,000)

- **Step 3** (the field diff over the 720 by family, and the draft shift record against `tests/fixtures/.golden-freeze-register.json`); **step 4** (plants for each guard: `tests/domain/defense*.test.js`, `tests/components/*` added by the stage, and the list of cures without a guard); **step 5** (the remerge diffs of 841945a26 and de0872aa5, and each register the stage touched re-derived by its own door); **step 6** (the strict-domain gate, the type ratchet, eslint on the touched files, the governing tests at tip and base); **step 7** (CENSUS-2's census2.sh at base and tip).
- The hand-back was read only in its rulings (lines 7–22, 58–72) and its final statement (690–723); the seats' work notes between were not read.
- The PDF and the Foundry journal were not rendered (read through `buildViewModel` and the code); shared player-view pages were not rendered.

## WHAT IS LEFT, for a successor

1. Steps 3–7 as the brief writes them. Instruments: worktrees at aac79b808 / 976db5b19 / bb2bf91c5 (`git worktree add --detach`), `npm ci` in the tip, node_modules linked in the others (same lockfile db637c28d…); births by `probes/REVIEW-R3-TABS/births.mjs` (seeds1536.txt, ~3 min per tree); pages by `render.sh <tree> <out> seeds1536.txt 4` (~25–60 min per tree); the desk by `desk.mjs` then `deskdiff.mjs`; the field diff by `fielddiff.mjs`; CENSUS-2 by the brief's step 7 command.
2. Step 4 should plant the reverse of L2 and the occupation case into the guards the stage added (does any guard red on F1?).
3. The verdict message to the chair, once steps 3–7 are read.
