# REVIEW-R3-TABS-2 — step 1, cold: every line the cure prints in a new town, and every town it left silent

The stage read: **bb2bf91c5..301572583** (the cure of the first read's F1–F3, F6–F8), lane/r3-tabs-2026-11-13, tip read
back from origin at 301572583 (unmoved). Full history (`--is-shallow-repository` false). The stage's own change is
16 first-parent commits, no merge; its code is `defenseStateProse.js`, `postureLineDisqualifiers.js`, `plotHooks.js`
(+ five test files and the lighting-census baseline). **No corpus or data file changed: the cure adds no sentence of
its own; it re-labels two Plot Hooks sources and changes WHICH existing lines print where.** Written from the diffs and
my own runs only, before any of the lane's statement, any docs/chair file of the lane or any commit message was opened.

**Births:** the first reader's 1,536 (`seeds1536.txt`: the census's 720 + 816 in the app's shape), by its `births.mjs`.
The record stream is byte-identical at the stage's base, its tip and the line tip 976db5b19 (sha256 391ab147…): the
cure moves no record. **Pages:** every one of the 1,536 rendered at the tip through the real OutputContainer
(`render.sh`, 1,536 dumps, 4×384 tests passed). **Desk:** `desk.mjs` (the Defense tab's own caller) at base and tip,
`deskdiff.mjs`; my `facts.mjs` / `classify.mjs` / `cooc.mjs` (probes/REVIEW-R3-TABS-2/). The PDF's print prose
(`buildPrintProse`, which the PDF and the Foundry journal read) at base and tip: `.defense.threatAssessment` changed in
the same 166 towns as the desk's threat rows and `.defense.postureHeader` in the same 218 (`printdiff.mjs`); the
rendered Defense tab carries the desk's tip sentence in every moved town and none of the removed ones (`pagecheck.txt`).

What moved, base → tip (desk, 1,536): posture GONE 216, CHANGED 2; beasts GONE 135; invasion GONE 139, CHANGED 27;
Plot Hooks source label re-worded on 828 hooks in 482 towns. Nothing NEW in a town that was silent.

## The new or re-worded lines

| # | Line (file · function) | Declared under | Prints (of 1,536) | Towns read where it prints | Verdict |
|---|---|---|---|---|---|
| N1 | "**Occupation Legacy Event**" — Plot Hooks source label (`plotHooks.js :: EVENT_LABELS.exile_return`); also the PDF chapter's `sourceName`, the Foundry journal (same view model), the Tonight sheet's `source` | a History event of type `exile_return` with hooks | 370 hooks, 209 towns; rendered on 209 Summary/Plot Hooks pages, nowhere else as text | r2r-thorp-36 (thorp, smallest), r2r-metropolis-8 (largest), r2r-village-21, rr3-thorp-wartime-rand-0, rr3-hamlet-occupied-rand-0 (occupied); **by script all 370**: the event under it is "The Occupation" ("A previous occupation ended…") in 370/370; every hook under it is of occupiers, collaborators or resistance records | **TRUE** in every town (under an occupation the event is a past one, as its own text says) |
| N2 | "**Infiltration Fear Event**" (`EVENT_LABELS.occupation_infiltration`) | event type `occupation_infiltration` | 458 hooks, 307 towns (307 pages) | r2s-wartime-thorp-3, r2r-metropolis-8, rr3-thorp-under_siege-rand-1 (siege), r2r-thorp-17, rr3-thorp-occupied-rand-4 (occupied); **all 458**: the event is "The Purge" (enemy agents, denunciations) in 458/458 | **TRUE**. "Exile & Return" and "Occupation Event" now print on 0 pages (209 and 307 at base) |
| N3 | **"readiness ADEQUATE"** drawn in place of the strong pool beside a Weak/Critical Invasion & War bar (`defenseStateProse.js :: noStrongBesideAWeakBar`): "People at {S} expect to hold against the usual trouble, and they claim no more than that." | strong readiness beside a Weak/Critical bar | **2 towns, both OCCUPIED** (no siege or famine town reaches it): rr3-town-occupied-rand-1 Muulcoba (town, bar Weak 34) and rr3-metropolis-occupied-rand-2 Ingili (metropolis, Weak 39) — the first reader's F3 and F1 towns | read on the rendered tab, both | **FALSE, MED (g/c), THE STAGE'S OWN.** Muulcoba: two rows below, "Military status · Under occupation · Keeping order in Muulcoba is the occupiers' business now, and the locals are not trusted to help … Muulcoba's defence answers to its occupiers now: the arms in the town are theirs, and whatever the townsfolk could raise themselves would be small beside them." Ingili: beside "The occupiers' troops at Ingili protect it from everyone except the people who sent them", the guard "exists on paper. Chronically underpaid and poorly equipped", the bar Weak. **A twin that lacks its sibling's condition:** the fallback runs BEFORE the occupation strike, so an occupied town beside a Weak bar hears this line while an occupied town beside a Strong bar is silent (the strike covers the strong pool only). |
| N4 | The Invasion row's sentence now printed WITHOUT its supply clause under a siege or famine (`noSupplyUnderACrisis`) — no new words; the remaining sentence is the base's | siege or famine in force, pool `CHAIN: defence supplied` | 27 towns (siege, famine, both; thorp to metropolis) | r2r-hamlet-16 (hamlet, famine), rr3-town-under_siege+famine-rand-0 Kabahtzal, r2s-under_siege-city-2 Andronarion, rr3-metropolis-under_siege+famine-rand-2; all 27 by script | the clause's removal: see S4 (cured). What stands in its place is CARRIED and in 11 siege towns false: C1 below |

## The towns the cure left silent (each removed line judged against its own page; all of them, not thirty)

| # | Silence (cause in code) | Towns | The rendered row now | The removed lines: how many were false | Verdict |
|---|---|---|---|---|---|
| S1 | The posture's **strong pool struck WHOLE** (`corpusAdmittingPostureLines`: occupation, guard on paper, short supply) and v1 by "no walls / no watch or garrison" | 216 (189 beside the supply-short sentence, 15 beside "exists on paper", 12 occupied; famine e.g. rr3-city-famine-rand-5; none under siege: struck before) | the badge alone ("Well-defended"), no empty label: r2r-metropolis-13, rr3-city-occupied-rand-0, rr3-city-famine-rand-5, rr3-town-insurgency-rand-2 | every one of the 216 had its trigger printed on its own page (0 without). **136 FALSE** (v2 "what {S} can field and … has built are both in good order" 75, v3 "its defences are in good order" 61, beside "the defenders go short / make do / the defence is weaker than its numbers suggest", the guard on paper, or the occupiers); **52 TRUE** (v1 "reads as a defended place from the road in: the approaches are watched, the works are kept up…" beside the short-supply sentence only: how it looks from the road, which supply does not touch); **28 LOW/doubtful** (v1 beside the guard on paper or under the occupiers 16, v4 "Nothing presses {S} at present: its defences would make any attack costly" 12) | cured; **true lines lost: 52** (LOW, for the owner's veto: I would keep v1 beside short supply) |
| S2 | The **Invasion row silent in every watch-only town**, walled or not (`watchOnly ? null : …`; the militia pools no longer take a watch) | 139 newly (all walled); **220 watch-only towns now silent** (139 walled + 81 unwalled already silent at base); 7 occupied, 7 siege, 11 famine among the 139 | the bar and its rating only, no dangling label: r2r-village-40 (village, smallest), rr3-town-monster_pressure-rand-2, rr3-town-under_siege+famine-rand-2 (siege), rr3-town-famine-rand-4 (famine), r2s-occupied-town-2 (occupied) | "Every household at {S} would send someone to the walls…" **52 FALSE** (no levy: F2); "The walls and townsfolk of {S} would see off a raid but not a proper army…" 48 and "Walls at {S} with townspeople behind them: credible against raiders, and inadequate against anybody who arrives professionally…" 39: **59 TRUE** (a walled town with a watch, no force row denying it), **28 LOW** (beside the watch's own "…not built for what arrives from outside it"). Supply clauses removed with them: 6 "supplied" under a siege/famine FALSE, the rest the chain's own reading | cured where F2 was; **true lines lost: 59** (LOW). The corpus owes this cell a pool (220 silent rows) |
| S3 | The **Beasts row's held-perimeter pools** off a watch-only town (`noHeldPerimeterByAWatch`: both pools whole) | 135 newly; **207 of the 220 watch-only towns now silent** in that row | bar and rating only (same five towns as S2) | lines naming no force: "The {T} takes the frontier seriously…" 37, "Very little reaches {S} out of the wild country… the arrangements are visible from a long way off" 32, "Defense at {S} is … the week's work: the rotations run, the gates close on time" 5 — **74 TRUE**; lines naming people on the wall ("with a wall and armed people behind it" 34, "a wall to hold and there are people to hold it" 14, "walls and fighters are holding" 13) — **61 LOW** (a watch is armed people; 18 sit beside the watch's own line). **0 HIGH or MED** | cured (F7 was LOW); **true lines lost: 74** (LOW: the ruling struck whole pools, not the lines naming a force) |
| S4 | The **supply line "the defenders are well supplied"** not drawn under a siege or famine (`noSupplyUnderACrisis`) | 27 (= N4's) | the Invasion sentence alone | **27 of 27 FALSE** ("busy and well stocked", "kept supplied: food and gear come from the town's own workshops", "will not go short", "the supply book … balances" under a siege or a famine) | **cured and true**; 0 such clauses under a siege or famine remain (33 at base) |

## The rulings' facts, counted on every town (desk, 1,536; `cooc.root-base-tip.txt`)

| Co-occurrence | aac79b808 | bb2bf91c5 | 301572583 |
|---|---|---|---|
| strong posture under an occupation | 10 | 14 | **0** |
| strong posture beside a Weak/Critical Invasion & War bar | 0 | 2 | **0** |
| strong posture beside the guard "exists on paper" | 9 | 32 | **0** |
| strong posture beside the supply sentence "the defenders go short" | 141 | 203 | **0** |
| strong v1 ("the works are kept up") with no walls | 2 | 3 | **0** |
| "well supplied" clause under a siege or famine | 27 | 33 | **0** |
| household/townsfolk Invasion line with no militia or levy | 0 | 139 | **0** |
| held-perimeter beasts line in a watch-only town | 0 | 48 | **0** |
| watch-only town with an Invasion sentence | 217 | 139 | **0** (220 silent) |
| strong posture on a rendered page whose Military status reads "Under occupation" | | | **0** of 1,536 pages |

## Lines in the same rows, NOT the stage's (read on the page; false at aac79b808 too)

| # | Rank | Line | Where | Fact against it |
|---|---|---|---|---|
| C1 | MED (CARRIED; `defense.generated.js` invasion pools, `invasionRowPoolKey` has no siege condition) | "Approaching Andronarion, you see the walls and the soldiers who belong on them, and any attacker would think again about the cost." | 11 siege towns at the root, the base and the tip (e.g. r2s-under_siege-city-2, rr3-metropolis-under_siege-rand-2/5) | "Military status · Active siege … Each week the siege lasts, Andronarion has less to hold out with". LOW for the 11 "…raiders stay away and an army would pay dearly; a long siege would be another matter" (it names the siege) |
| C2 | MED (CARRIED) | "People at Petenxochitl believe the city could be held, and the soldiers on the walls give them good reason to." / "Anzhou's garrison roll puts paid soldiers on every stretch of its walls, so raiders stay away…" | 27 occupied towns at root, base and tip | "Anzhou's defence answers to its occupiers now: the arms in the city are theirs". With it: the supply line "will not go short / busy and well stocked" under an occupation, 17 towns at all three (LOW; the twin of S4 that lacks the occupation) |
| C3 | MED (CARRIED class; N3 joins it) | ADEQUATE posture under an occupation, v3 "People at Sundnes expect to hold against the usual trouble…" | 4 of the 12 occupied ADEQUATE towns at the tip are v3 (Sundnes, Qaranuur + N3's two); 14 at the root, 10 at the base | as N3. v1 "covered against what it is likely to face" (5), v4 (2): TRUE (the occupiers cover it); v2 "looks defended in the ordinary way" (1, Muulchihua): LOW |
| C4 | LOW (CARRIED) | strong posture under a famine ("its defences are in good order") | 8 root, 14 base, 5 tip | "Hunger has made Frosthavn tense…" — it speaks of works, not food |
| C5 | LOW (CARRIED) | rr3-town-monster_pressure-rand-2: "Jabalserai reads as a defended place from the road in: the approaches are watched…" | beast pressure | "Those who keep Jabalserai safe cannot cover every road and every field" |

## Step 1's count

Lines of the stage: 4 printing lines (N1–N4) and 4 silences (S1–S4), read in every town each reaches (1,536 births,
all rendered). **False at high or medium, the stage's own: 1 line, MED, in 2 towns (N3)**; 0 HIGH. Cured by silence
with true lines lost: S1 52, S2 59, S3 74 (LOW, for the owner's veto). Carried in the same rows: C1–C3 MED, C4–C5 LOW.
NEVER PRINTS: none (each line prints in at least 2 of the 1,536).
