# REVIEW-UPKEEP — `lane/coherence-upkeep-2026-11-12` at 419de26cb (base: the agreement lane at faa20bc6c)

> The first independent review of the upkeep lane. The reviewer changes nothing on the lane and cures nothing.
> Written in the brief's order. §1 was committed before the hand-back, the record or any ruling was read.

## VERDICT: NOT CLEAR

**Two findings stop the lane:**
- **F1.** The hard one-band readiness law breaks off the lane's corpus.
- **F2.** The services' upkeep roll deletes the core service of a standing institution, and with it the priests' rites. The proposal itself said a vocation is never scaled.

**What holds.** Everything the lane claims on its own corpora reproduces exactly:
- the 660 and the golden bounds;
- the field diff (507/525, 594, 346/360, 0 undeclared);
- the cast reach;
- the census (no new row; the three rises are exposure);
- the three gates;
- the whole suite (64 rows, 0 unclassed).

The restated bound (d) is a sound reading of the design (§3).

## §1 — Cold, as the owner reads it (committed before §2)

**How it was read.**
- **The forty seeds:** births as the census corpus births them (`birthConfig({...DEFAULT_CONFIG, ...dials, settType})`, the census dials, `customContent: {}`), named `cold-<size>-<i>` (calm) and `cold-<crisis>-<size>-<i>` (forced crisis).
  - **Picked from a scan of 1,288 tip births** (`cold-<size>-0..239` for five sizes, `-0..39` for the metropolis, and 4 forced births per size for `famine` and `under_siege`). The picks cover all six sizes; poor and prosperous places of each; a charter hall standing with no standing guard that can pay for it and one that cannot; 4 sieges and 4 famines.
  - **thorp:** 0 (Struggling), 5 (Poor), 22 (Comfortable), famine-thorp-0, under_siege-thorp-0.
  - **hamlet:** 56 (Comfortable, charter, no standing guard: *can pay*), 91 (Poor, charter, no standing guard: *cannot*), 32 (Prosperous), 122 (famine, charter), 29 (siege, militia, charter), under_siege-hamlet-2, 182 (Struggling, charter, no standing guard).
  - **village:** 98 and 220 (Comfortable, charter, no standing guard), 46 (Poor, charter, no standing guard), 19 (Poor, militia, charter), 193 (siege, charter, no standing guard), famine-village-1, 61 (Moderate).
  - **town:** 1 (Prosperous), 9 (Comfortable, watch and mercenary), 32 (Struggling, garrison and mercenary), 21 (Struggling), 11 (Poor), 5 (Wealthy), famine-town-1, under_siege-town-0.
  - **city:** 0 (Prosperous), 39 (Poor), 8 (Poor, occupied), 2 (Moderate), 16 (Wealthy), famine-city-2, under_siege-city-0.
  - **metropolis:** 0 (Prosperous), 11 (Poor), 38 (Moderate), 28 (Wealthy), famine-metropolis-1, under_siege-metropolis-2.
  - **Two more were rendered after the 1,288-birth band count:** famine-city-0 and famine-city-1.
- **The render:** every dossier through each tree's own `OutputContainer`, as the owner sees it. It uses the census's `render.census.jsx`, unchanged except for the seed parser: owner's view, premium, public prose stamped, every group, sub-tab and disclosure opened.
- **The diff:** line by line per view, base against tip. Defense, Services, Economics (stores and food), Magic, Power, Overview, Crisis and Foundations were read in full for all forty.
- **The page moved in 36 of the 40.** Unchanged: thorp-22, hamlet-32, town-1 and town-5 (Comfortable, Prosperous, Prosperous, Wealthy). Views moved: Defense 35, Magic 25, Overview 22, Services 20, Institutions 20, Economics 19, Crisis 14, Foundations 12, Power 11.

**What the tip's page gets wrong, in order of how badly it reads.**

1. **Readiness falls two bands.** *Bound broken.*
   - **cold-famine-city-0:** Fortress (77) on the base, Defensible (54) on the tip.
   - **Defense tab:** "What Temürbash can field and what Temürbash has built are both in good order" becomes "enough for the usual trouble and nothing spare".
   - **Power tab:** legitimacy goes from 10 to 0, and the "Defense +10" term is gone.
   - **This is 1 of the 1,288 scanned births.** The bound "never more than one band down" holds on the sample it was measured on, not by construction.
2. **A cemetery that does not bury.** *Reads broken.*
   - **cold-famine-metropolis-1, Institutions tab:** the "Cemetery network" card ("Burial has left the walls entirely: grounds beyond every gate…") now lists one service, *Central register*.
   - **The cause:** the upkeep roll took its *Burial* row; the floor kept the register.
   - **Services tab, Healing:** loses Burial and Emergency treatment.
3. **A famine granary that the hall held shut is now open.**
   - **cold-famine-town-1:**
     - *base:* "Active Famine. Stores: a granary of six months that the hall will not open"
     - *tip:* "a granary, five months of grain"
     - *Food endurance, base:* "…but the hall will not open it"
     - *Food endurance, tip:* "the granary carries the town for about six months"
   - **cold-famine-city-1:** 6 months held on the base, 4 months open on the tip.
   - **Why:** the stores' share takes the months under the six-month held window, so the clause that explained a famine beside a full granary is lost.
   - **The direction:** the months fall, but what the reader learns crosses the other way: food the town could not eat becomes food it can.
4. **Rites dropped as if bought.** Healing is a bought category, and it carries church rites.
   - **What the upkeep roll removes:**
     - *Life ceremonies* ("Births, marriages, and funerals. Essential community functions"): village-98 (Comfortable), village-46, town-11, town-21, town-32, under_siege-town-0.
     - *Last rites* ("The priest manages the graveyard"): hamlet-182.
     - *Religious services:* famine-village-1.
     - *High religious ceremony:* under_siege-metropolis-2.
     - *Poor relief:* town-11, Poor.
   - **What the same pages still say:**
     - The church card still has a graveyard and *Burial*.
     - The Economics tab's tithe row still collects "fees for burial and sacramental services".
     - town-11's Faith chain still lists *Poor relief*.
5. **The "hunger" line where the page shows none.**
   - **cold-under_siege-metropolis-2:** the guard assessment ends "Hired swords back the garrison, paid from what the hunger leaves."
   - **The same page says:** "Food: Import-Dependent. Stores: a granary, 13 months of grain." It reports no deficit.
   - **The line reads the crisis kind (siege), not hunger.**
   - **It prints in 14 siege cities and metropolises of the 1,288**, with 7 to 12.5 months in store. On this page no hunger is stated.
6. **Hired swords beside private guards.**
   - **cold-metropolis-28 (Wealthy):** "Public law enforcement is largely a formality. The merchant guilds maintain their own mercenary companies: real protection exists, but only for those with the right associations. … Hired swords back the garrison."
   - **The clash:** the paragraph says the hired companies serve the guilds' friends, and the new sentence puts them behind the public garrison.
7. **The purse line beside a pay line that reads another home.** Each new hired line reads the label. The force's own pay sentence beside it reads the economy slider (`safetyProfile.js:378`, `:404`).
   - **In the 420 hired-force births:**
     - Prosperous: 8 read "inadequate equipment and irregular pay" and 3 read "exists on paper. Chronically underpaid", each followed by "Hired swords back the garrison." (the full-purse form).
     - Struggling: 4 read "well paid, well equipped" and then "paid from what the hunger leaves".
   - **The pay sentence is older.** The lane's sentence now sits beside it in the same paragraph.

**Says less than the base, where the base was true.**
- **The "held" clause** (item 3).
- **Rows lost from the Services tab:**
  - *Burial* at the cemetery, and the rites (item 4).
  - town-11 (Poor) loses *Poor relief* while its Faith chain lists it.
- **Every other lost row (20 of the 40 towns lose rows)** is a commercial or trade row: Wool shearing, Pack animal hire, Cask repair, Window glass. No other page line names those rows.
- **No town gains a row**, and no criminal row is added: under_siege-city-0 loses one, *No-questions sales*.

**Do a poor place and a prosperous one now read differently, believably?**
- **Readiness, stores and services: yes, and further apart than the base.** In the 1,288 births:
  - *Town and larger, mean readiness:* Poor 35.0 → 32.0, Struggling 35.9 → 32.4, Prosperous 66.2 → 69.8. Wealthy is unmoved.
  - *Town and larger, mean stores:* Poor 7.1 → 6.1 months, Prosperous unmoved.
  - *Band moves:* Poor −1 in 56 and +1 in 7; Comfortable +1 in 46 and −1 in 5.
- **The guard sentence for hired force: no.**
  - **The charter hall:** one line, "takes bounty work against threats, as far as the purse runs", for every label up to Comfortable. Comfortable hamlet-56 and village-98 read word for word as Poor village-46 and Struggling hamlet-182. Only Prosperous and above would differ, and no charter-only Prosperous place was born.
  - **The mercenary pair** (the paid and short lines): these speak to the owner's case of a place with no guard that can hire if it has the cash. Their branch needs a mercenary and no garrison, watch or militia. It fired in **0 of 1,288 births**: every born mercenary stands beside a watch.
  - **So the owner's case is told by the readiness number, not by a sentence.**
- **A smaller oddity: some places read better than the base.**
  - **Examples:**
    - cold-famine-metropolis-1: economic resilience Weak → Adequate, "can pay for a crisis of the ordinary length".
    - cold-city-39 (Poor): Weak → Adequate, military 67 → 90.
    - cold-city-2 (Moderate): Lightly defended → Defensible.
  - **Why:** the label reads kinder than the old output score.
  - **Verdict:** not false (it is the lane's one home), but where the base said "already owed" it was arguably the truer line.

## §2 — What I read, after §1 was committed

- **On the lane:** `docs/chair/2026-11-12/UPKEEP-HANDBACK.md` (the fourth seat's top and the earlier seats below it), `UPKEEP-CONTINUE.md` (with the chair's rulings on the third stop and on the parked six), `docs/chair/2026-11-11/UPKEEP-PROPOSAL.md`, and the one draft record `docs/chair/2026-11-11/UPKEEP-shift-record.DRAFT.json`.
- **Already in the record before me:**
  - the held-granary flip (§1 item 3), as `families.stores.storesHeld`: 4 on the 660, "true -> false in every one";
  - the agree-city-38 trace.
- **Not in the record:**
  - the two-band fall (§1 item 1);
  - the burial ground losing Burial, and the rites (§1 item 4);
  - the hunger line on sieges with no deficit (§1 item 5);
  - the merchant-army clash (§1 item 6).
- **Against the proposal's own words (§c.6):** "Never scaled: … a vocation (the priest, the druid, the wardens)". The upkeep roll scales the priest's rites.

## §3 — The bounds, re-run

**Instrument.** The lane's harness (`docs/chair/2026-11-13/probes/UPKEEP-4/dump.mjs`, `measures.mjs`, `fielddiff.py`), run by me in fresh trees: base faa20bc6c, tip 419de26cb.

**The lane's corpora.** Every figure the hand-back states reproduces exactly:

| Bound | 660 | Golden 525 |
|---|---|---|
| Readiness, more than one band down | 0 | 0 |
| Labels moved | 131 | 63 |
| Entries into the top two bands (the 360) | 24 (line 25); exits 5; share 37.8% → 43.1% | n/a |
| Prosperity, food, safety moves | 0 | 0 |
| Service rows added / newly empty institutions | 0 / 0 | 0 / 0 |
| Service rows removed | 981 | 336 |
| Healing, Struggling | 1034 → 927 | 156 → 120 (−23.1%) |
| Criminal rows | none rises | none rises |
| Magic bands moved | 328 | 250 |
| Stores: months fall / rise | 477 / 0 | 328 / 0 |
| Stores: note crossings / toward more | 57 / 0 | 60 / 0 |
| Hired counterfactual | 9, all at or under the watch | none |
| Sign exceptions | 0 | 0 |
| Who governs | 0 | 0 |
| Danger flag where readiness did not fall | 0 | 0 |
| Capture moves | 5 | 0 |
| People re-dealt (id, name, personality) | 0 | 0 |
| Receipt status | 0 | 0 |

**Off the lane's corpora, the one-band law does not hold.**
- **The births:**
  - my 1,288 births (5 sizes × 240, plus the metropolis 40, plus 48 forced);
  - 720 more forced births: `cold-<famine|under_siege|wartime>-<town|city|metropolis>-<4..83>`, with the same dials and the same `birthConfig`.
- **Three places fall two bands. All are forced famines:**

  | Town | Base | Tip |
  |---|---|---|
  | cold-famine-city-0 | Fortress 77 | Defensible 54 |
  | cold-famine-town-25 | Defensible 45 | Vulnerable 23 |
  | cold-famine-town-68 | Lightly Defended 24 | Undefended 9 |

- **The rate:** 3 of the 264 forced-famine births at town size and above that I born, about 1.1%. The 660 holds 30 such births, so it would expect 0.3, and it saw 0.
- **One wartime birth rises two bands.**
- **What this shows:** the bound holds on the sample it was tuned on. Struggling `funded` 0.3 was "the first value that meets the bound" on the 660 (`UPKEEP-CONTINUE.md`). It does not hold by construction.

**Reach into the cast.** By my measure on the 660 and the golden, exactly the record's figures:
- `factions[0]` by name: 4 / 0.
- The roster: 9 / 0.
- The criminal power: 14 / 11.
- `representatives.js` also reads the prosperity label: unmoved.
- **Nothing undeclared reaches** `castPowers.js` or `representatives.js`.

**The restated bound: re-traced, and sound in kind.** agree-city-38:
1. The gates go to the identity at Comfortable, so readiness goes 45 → 56.
2. The defence term goes 0 → 7, so legitimacy goes 58 → 65.
3. The council's power goes 28 → 31 after `applyLegitimacyMultipliers`.
4. The seats are filled by descending power (`densityRoll.js :: chooseSeats`, "the remainder by descending power"). This is not a draw: the seeded draws there (sizing, rival, niches) run unconditionally.
5. So Religious Authorities (raw 9) falls below the last seat and Merchant Guilds (raw 8) takes it.
6. The covert retainer then ranks into the ruling three, and `hallCaptureOf` reads equilibrium.

I checked the inputs at both trees: religion influence, economic output and the governing name are equal.

**My judgment on the restatement:**
- **It follows the design.** The chair's (e) already allows memberships and ranks to move where a function keys them on power. A capture rung that reads who sits in the ruling three is downstream of exactly that.
- **It is not a line moved to fit.** On my independent 1,288 births it fires **0** times: 3 capture moves, none toward danger without a readiness fall. There were also 0 changes of who governs, 0 danger flags and 0 people re-dealt.
- **The cap of 3** was set after one case was seen, so it is a guard and not a measure. It should be re-read on the merged tree.
- **What a reader sees:** at agree-city-38 the page says the city is better defended and its rulers Approved, and that the hall is now half in the criminals' pocket. That is a true chain, but a strange page.

## §4 — The page count

**How it was run.** `census.sh` (from `origin/lane/second-wave-census-2026-11-12`, unchanged) on faa20bc6c and on 419de26cb, 720 dossiers each, with 2 workers. Then `compare.mjs`.

**The base column** is identical, row for row, to the lane's `census/faa20bc6c.counts.txt`.

**The tip:**
- **No new row.**
- **Three rows rise:** 4 (106 → 108), 9 (148 → 149) and NEW-1 (11 → 12). These are the seat's figures and its entering towns:
  - row 4: r2r-town-36, r2r-metropolis-53 and r2s-religious_conversion-city-2 enter, and r2r-city-26 leaves;
  - row 9: r2s-famine-city-0;
  - NEW-1 (NEW1b): r2r-village-8.
- **Town by town, each entering town had its fact moved by this lane:** the faction powers through the legitimacy chain, the monster score and readiness, and readiness. Each row is old (it is in the class table at the base) and has a named later cure. **EXPOSURE, as the seat says.**

**What the seat's "equal or lower" leaves out.**

- **Row 2, "two store durations": 571 → 540, but 95 towns enter it and 126 leave.**
  - *The entrants:* mostly thorps and hamlets whose household stores fell to "about a month". The endurance line still says "about two months at full rations", because it adds the harvest kept under siege.
  - *How to class it:* every entrant's stores were moved by this lane, and the row is old. So it is exposure, and acceptable by the rule.
  - *What is wrong:* the net fall hides 95 entries, and the hand-back should say them.
- **Row 15, "burial under Healing": 720 → 717. This is a count falling that is not a cure.**
  - *Which towns leave:* r2r-metropolis-31, r2s-famine-metropolis-2 and r2s-politically_fractured-metropolis-2.
  - *Why they leave:* their only Burial row was deleted by the upkeep roll. The fault was not mended.
  - *What their pages still say:* each keeps a "Cemetery network" card. Two say "Few folk keep the rites beyond weddings and burials". None offers Burial anywhere.

By the brief's rule this is no ORIGIN (no sentence of the lane's prints false in the counter). The page fault it exposes is §1 item 2 / F2 below.

## §5 — Every sentence the lane adds

**The sentences.** Seven sentences in `safetyProfile.js` (`SAFETY_LINE_SIBLINGS`, `keptGuardLine`), plus one contributor reason in `magicProfile.js`. The reason is never printed (0 of the 40 pages). On the 660 the guard lines print in 139 births, the record's figure.

| Line | Reads | Prints (660) | Against the page |
|---|---|---|---|
| "Hired swords back the garrison." | mercenary, garrison, label ≥ Prosperous | 50 | 2 after the merchant-army lead (agree-city-61, agree-metropolis-14). 4 after "irregular pay" / "exists on paper" (agree-city-10, -51, -43, agree-metropolis-23): an older line on the slider. |
| "Hired swords back the garrison when the purse allows." | the same, label ≤ Comfortable | 51 | 2 after the merchant-army lead (agree-city-52, agree-force-wartime-metropolis-7). Otherwise it reads true. |
| "Hired swords back the garrison, paid from what the hunger leaves." | the same, crisis famine or siege | 31 | **7 are sieges whose food label is Import-Dependent**, with 12.3 to 12.5 months in store (agree-force-under_siege-metropolis-3, -5, -7, -8, -9; city-1, city-8). There the page states no hunger: the line reads the crisis kind, not hunger. 1 sits after the merchant-army lead (agree-force-famine-city-1). |
| "The adventurers' charter hall takes bounty work against threats, as far as the purse runs." | charter, no garrison or watch, label ≤ Comfortable | 7 | True. The same words print at Comfortable (agree-village-30) and Poor (-40, -43, -45). |
| "…paid from what the hunger leaves." (charter) | crisis | 0 on the 660; 1 of my 40 (cold-village-193, a siege, Struggling) | True there. |
| The mercenary pair (paid / short) and its crisis line | mercenary, no standing force | **0 on the 660; 0 of 1,288** | Unreachable. |

**A count falling is not a cure. Of the lines the lane removed:**
- **Service rows, 981 on the 660.** These are the design's removals: each was a true row of an institution that stands, and is now held back by the purse. Within them:
  - **18 towns lose every Burial row while their burial ground stands.**
    - By label: 10 Struggling, 4 Comfortable, 3 Moderate, 1 Poor.
    - The towns: agree-town-87, -98, -147; city-26, -29, -38, -58, -72; force-famine-town-7, force-famine-city-9; force-wartime-metropolis-0, -8; force-under_siege-town-9, -city-4, -metropolis-1, -3, -5, -8.
  - **3 market squares lose their Weekly market** (agree-town-0, force-famine-town-0, force-famine-town-7). Each keeps only "Civic announcements".
  - **114 rite rows in 109 births:** Religious services 32, Life ceremonies 27, Burial 18, Weekly rite 12, Last rites 5, Marriage ceremony 3, and others.
- **The held-granary clause:** 4 on the 660, as true at the base as the months it read.
- **The charter hall's old lead** ("coordinates emergency response") became the purse line. Nothing true was lost there.

## §6 — The pins the lane changed (base faa20bc6c → tip)

| Pin | Re-keyed or loosened | Read |
|---|---|---|
| `defenseEconomicGate.test.js` (8 fixtures) | Re-keyed by identity. Each fixture carries the label its old slider stood for, over the same buildings. No tolerance moved. | **Planted** `keepOf` → identity: **reds 10**, the seat's figure. |
| `defenseWordsFindings.test.js` "a palisade never pays…" | Re-keyed to defense-hamlet-13, with an anchor (`defenceNames` = ["Palisade or earthworks"]). | In the same plant. |
| `census5bOffCensusDeclarations.test.js` | Widened: a band atom is lawful where a rung of its ladder admits it, and a crisis-keyed pair flips on its crisis atom. Not loosened: the arm is one shared function, and planted controls guard it. | **Planted** `lawfulSomewhere` → true: **2 reds**. **Planted** a real line with a contradictory band (≥ moderate and ≤ poor): **red**, "never lawful". |
| `generationForkCensus.test.js` | Re-measured exactly: `food.cropFortune` minted twice, both by fork; FNV 17 → 18 → 42, with the trace. | |
| `institutionTable.walker` | Re-measured exactly, 1,849 → 1,834, one cause. | |
| `proseWiringCensus.walker` | Re-measured exactly: 165 → 169, c 6 → 10, endpoints 89 → 88, docblocks 37 → 39. | |
| `.prose-numerics-baseline.json` | Two line numbers follow their lines. | |
| `heldKeyWriterCensus`, `prosperityRank` EXEMPT | One typed row each, with a reason. | |
| `upkeepHired.test.js` (new) | | **Planted** without the watch cap: the invariant **reds**. |
| **No pin loosened.** | | |

**The parked item (P5).** I applied `P5-built.patch` in a scratch tree:
- the contract test goes green;
- exactly two pins red: `proseComposed.walker` (165) and `proseCorpusBytes` RAW. The byte row grows 28249 → 28926, and its door banks the number upward.

**Parking it is right:** a lane may not bank a byte baseline upward, and P5 must land in one commit with that row. Until the chair rules, `dossierStateProseProjection` ×2 stays red at the tip because of this lane. The red is the lane's own, rightly held.

## §7 — The claims

**The field diff,** by my run of `fielddiff.py`, against the lane's `UPKEEP-FIELD-DIFF.json`:

| Corpus | Births moved | Paths | Undeclared |
|---|---|---|---|
| Golden | **507 of 525** | 145 | 0 |
| The 660 | **594** | 232 | 0 |
| The fence | **346 of 360** | 198 | 0 |

**The six golden surfaces.**

| Surface | Base (by my run) | Tip |
|---|---|---|
| Generator golden master | moves (field diff) | 507 of 525 rows move |
| Espionage fence | moves (field diff) | 346 of 360 move |
| Dossier prose manifest | DRIFT arm 990 rows; cells 73,491; mixed-pool 177 (pinned 203) | DRIFT arm **1024** rows; mixed-pool 177. The record's figures. |
| Herald desk | contentSha 02d3fa8e (banked 0fa1f3ca) | **919f46cb** |
| PDF golden | `defense.scoreAvg` 41 (banked 43) | **42** |
| Preset-lighting witness | green | green |

**The three gates,** each through `scripts/gate-tail.sh` at 419de26cb, each exit 0:

| Gate | Result |
|---|---|
| Type ratchet | 167 = ceiling 167 |
| Domain strict | 1113 = ceiling 1113 |
| Lint | 0 errors, 37 warnings |

**The whole suite** at 419de26cb.
- **The command:** `npx vitest run --maxWorkers=2 --reporter=json`, run once, 05:05–06:41 UTC, after `git fetch origin review-fixes-2026-07-08:review-fixes-2026-07-08`. The census and the dumps ran beside it for the first 40 minutes.
- **The result:** 3,221 files and **39,032 tests**: 38,719 passed, 59 failed, 254 skipped. With the 5 files that fail at load, that is **64 failing rows**.
- **The arithmetic agrees:** the seat's 75 at c950cc823, less the 11 bundle rows (class A) that the last commit cures.

**Every row is matched, by file and title, to the seat's `FAILSET.txt`:**

| Class | Rows |
|---|---|
| B. Red at the base | 20 |
| C. The lane's, parked | 2 |
| D. Named earlier | 42 |
| **Unclassed** | **0** |
| A. Bundle rows, all 11 | gone |
| The 14 "gone since the third seat" | gone |

**The rows that are the lane's to cure:**
- **C. poolDominance, the stale row and the loose row.** Rightly held for the chair's `--tighten` door.
- **D. P5 `dossierStateProseProjection` ×2.** Rightly parked (§6).

**One D row, read at the base: `institutionTable`.**
- *The readings:* the base reads 1,843 against its pin of 1,849, so it is red at the base (AGREE's −6). The tip reads 1,829 against the lane's own re-measured pin of 1,834.
- *The lane's real delta on the composed tree:* 1,843 → 1,829, which is −14. The pin's comment says −15.
- *Whose it is:* the merge seat's. The comment's figure is stale.

No other red is the lane's to cure.


## Findings, by severity

Each finding gives: what; where; how to reproduce; how bad; and what would cure it. The reviewer cures nothing.

### F1 — HIGH, stops the lane: readiness falls two bands, off the 660

- **What:**
  - Three forced-famine births fall two readiness bands (§3):
    - cold-famine-city-0: Fortress 77 → Defensible 54;
    - cold-famine-town-25: Defensible 45 → Vulnerable 23;
    - cold-famine-town-68: Lightly Defended 24 → Undefended 9.
  - On the Defense tab of cold-famine-city-0, "What Temürbash can field and what Temürbash has built are both in good order" becomes "enough for the usual trouble and nothing spare". Legitimacy goes 10 → 0.
- **Where:** `src/domain/facts/keep.js` (`KEEP_TUNING.Struggling.funded` 0.3) through `fundedGate` in `src/generators/defenseGenerator.js`. A famine caps the label at Struggling. At the base these towns' gates stood at the identity (economic output 42–62); at the tip they sit at the Struggling floor (military 0.72, economic 0.62).
- **How to reproduce:** birth `cold-famine-<tier>-<i>` as §1 does (`birthConfig({...DEFAULT_CONFIG, ...census dials, settType, selectedStresses:['famine'], selectedStressesRandom:false})`, `{seed, customContent:{}}`) at faa20bc6c and at 419de26cb, and compare `defenseProfile.readiness`.
- **How bad:** the hand-back calls this bound HARD. It fails in 3 of 264 forced-famine births at town size and above (about 1.1%). Struggling `funded` 0.3 was chosen as "the first value that meets the bound" on the 660, so the bound holds by sample.
- **What would cure it:**
  - **(a)** The chair's own option from the L2 stop: a crisis-capped label does not take the funded gates below where the base stood (the famine's own penalties already bite).
  - **(b)** Or another `funded` value.
  - **Then** re-measure on a forced corpus at least ten times the 660's 30 famine births at town size and above.

### F2 — HIGH, stops the lane: a standing institution loses the service it exists for

- **What:**
  - **Burial:** on the 660, **18 towns lose every Burial row while their burial ground stands**: 10 Struggling, 4 Comfortable, 3 Moderate and 1 Poor, among them agree-city-38, -29, -72 and agree-town-87. "Burial grounds and charnel house" keeps only "Lifting and ossuary", "Parish burial grounds" only "Register of the dead", and "Cemetery network" only "Central register".
  - **Weekly market:** 3 market squares lose their Weekly market (agree-town-0, agree-force-famine-town-0, agree-force-famine-town-7).
  - **Rites:** 114 rite rows go in 109 births: Religious services 32, Life ceremonies ("Births, marriages, and funerals. Essential community functions") 27, Burial 18, Weekly rite 12, Last rites 5, Marriage ceremony 3, and others.
  - **On the page** (§1 item 2, §4 row 15): the Cemetery network card describes burial and offers none. Two such metropolises say "Few folk keep the rites beyond weddings and burials". The tithe row still collects "fees for burial and sacramental services".
  - **The census** reads this as a fall in row 15 (720 → 717), by deletion.
- **Where:** `src/generators/services/serviceRollMaterialization.js`: `BOUGHT_CATEGORIES` holds `healing`, which carries the rites. The floor keeps the first row held back, not the institution's own kind.
- **How bad:** it reads broken, and it hits Comfortable places too. It contradicts the proposal (§c.3 "keeps at least one row **of its kind**"; §c.6 "Never scaled: … a vocation (the priest …)").
- **How to reproduce:** `measures.mjs` over the harness dumps, then compare `svcRows` for Burial per birth (§5).
- **What would cure it:**
  - the roll exempts the `religion` domain (`serviceDomainOf` already names it) and burial;
  - and the floor keeps the institution's namesake or primary row, not the first one held back.

### F3 — MODERATE: a famine granary held shut becomes an open one

- **What:** `foodRecord.storesHeld` goes true → false.
  - **On the 660:** 4 births (agree-city-58, agree-force-famine-town-4, -city-1, -city-5).
  - **In my 42:** 2 more (cold-famine-town-1, cold-famine-city-1).
  - **On the page:** "a granary of six months that the hall will not open" becomes "a granary, five months of grain", and Food endurance says the granary "carries the town".
- **Why it matters:** the record declares the count ("true -> false in every one"), but the claim "stores' crossings all toward less" misreads its direction. The months fall, while the food in the town's hands rises: the reader learns that food once withheld is now available.
- **Where:** `src/generators/economy/foodBalance.js:127`. It reads the share-scaled months against the six-month held window.
- **What would cure it:**
  - the held window reads the full-granary months (the political fact), not the months after the upkeep share;
  - or the chair rules that the direction is accepted, and the record states it.

### F4 — LOW-MODERATE: "hunger" where the page shows none

- **What:** "Hired swords back the garrison, paid from what the hunger leaves." prints in 7 of the 660's 31 crisis-line births that are sieges whose food label is **Import-Dependent**, with 12.3–12.5 months in store (agree-force-under_siege-metropolis-3, -5, -7, -8, -9; -city-1, -city-8). In my 40: cold-under_siege-metropolis-2.
- **Where:** `safetyProfile.js`, `crisisSet(…, UPKEEP_CRISIS)`. It reads the crisis kind.
- **What would cure it:** a siege twin that does not say hunger ("…paid from what the siege leaves"), or a declaration on a deficit.

### F5 — LOW: hired swords "back the garrison" after the merchant-army lead

- **What:** the lead says the guilds' companies serve "only those with the right associations"; the appended line puts them behind the public garrison.
- **Where:** 5 of the 139 guard-line births on the 660: agree-city-61, agree-metropolis-14, agree-city-52, agree-force-wartime-metropolis-7, agree-force-famine-city-1. In my 40: cold-metropolis-28. The cause is `keptGuardLine`'s third branch.
- **What would cure it:** skip the line, or declare it out, after the merchant-army lead.

### F6 — LOW, and not the lane's to cure: the purse line beside an older pay sentence

- **What:**
  - Prosperous places read "irregular pay" or "exists on paper" and then "Hired swords back the garrison." (4 on the 660).
  - A Struggling place reads "well paid" and then the hunger line (1).
- **Why:** the pay sentence reads the economy slider (`safetyProfile.js:378`, `:404`).
- **Whose it is:** an older second home of "what a place can keep up". Name it for a later lane.

### F7 — MODERATE, for the chair and the owner: the owner's case is not said in words

- **What:**
  - **The mercenary pair** (paid and short) fires in **0 of the 660 and 0 of my 1,288**: every born mercenary stands beside a watch.
  - **The charter-hall line** is one line for every label up to Comfortable, so a Comfortable place and a Poor place print the same words (agree-village-30 against -40, -43, -45; cold-hamlet-56 against cold-village-46).
  - **Only the readiness number** separates "can pay" from "cannot".
- **What would cure it:** a twin keyed on what the place can buy for the charter line (≥ moderate against ≤ poor), as the mercenary pair has. Or a ruling that the number is enough.

### F8 — LOW, reporting: what "equal or lower" hides

- **What:**
  - Census row 2 falls 571 → 540, but **95 towns enter it** and 126 leave. All are exposure: their stores were moved by the lane.
  - Row 15's fall is the deletion in F2.
  - The `institutionTable` pin's comment states the lane's delta as −15. On the composed tree it is −14.

## True statements lost

- **On the 660, 981 service rows go.** Each was true of an institution that still stands. Most are the design's own (bought goods). The ones that read false by their absence:
  - 18 towns' Burial;
  - 3 weekly markets;
  - 114 rite rows (F2).
- **The "hall will not open" clause, in 4 births** (F3).
- **No guard sentence was lost.** The charter hall's old lead became the purse line.

## Appendix — the reviewer's probes, for the next reader

**Read first:** §1 for the page, then F1 and F2. Every probe below writes nothing in the tree it reads.

**The births** (the census dials):
- calm: `cold-<size>-<i>`;
- forced: `cold-<crisis>-<size>-<i>`.

**The seed lists:**
- **§1's forty:** listed in §1.
- **The 1,288:** `cold-<thorp|hamlet|village|town|city>-0..239`, `cold-metropolis-0..39`, and `cold-<famine|under_siege>-<size>-0..3`.
- **The 720 forced (F1):** `cold-<famine|under_siege|wartime>-<town|city|metropolis>-4..83`.

**How to run them:**
- **Run a probe** with `cd <tree> && TREE=<tree> node <probe> <seedfile>`.
- **Render §1's pages** with the census's `render.census.jsx`, swapping its `cfgFor` for the one in `scan3.mjs` below, then run it as `census.sh` does.
- **Measure the 660 and the golden** with the lane's harness (`docs/chair/2026-11-13/probes/UPKEEP-4/`) on fresh trees.

### F1 — the gates of the three two-band towns (`gates.mjs`)
```js
const R=process.env.TREE+'/src';
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
const { getInstFlags } = await import(R+'/generators/priorityHelpers.js');
await loadGenerationLawPayloads();
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
for(const seed of ['cold-famine-city-0','cold-famine-town-25','cold-famine-town-68']){
  const m=seed.match(/^cold-(\w+)-(town|city)-(\d+)$/);
  const s=generateSettlementPipeline(birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:[m[1]],selectedStressesRandom:false,settType:m[2]}),null,{seed,customContent:{}});
  const sc=Object.fromEntries(Object.entries(s.defenseProfile.scores).filter(([k,v])=>typeof v!=='object').map(([k,v])=>[k,v]));
  console.log(seed,s.economicState.prosperity,'econOut',Math.round(getInstFlags(s.config,s.institutions).economyOutput),s.defenseProfile.readiness.label,s.defenseProfile.readiness.score,JSON.stringify(s.defenseProfile.economicGates),JSON.stringify(sc));
}
```

### The band and score scan, one line per birth (`scan3.mjs`)

Diff base against tip by seed. Columns: seed, tier, prosperity, readiness score, label, military, monster, internal, economic, disaster, months.

```js
const R=process.env.TREE+'/src'; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
function cfgFor(seed){
  let m=seed.match(/^cold-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,settType:m[1]});
  m=seed.match(/^cold-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:[m[1]],selectedStressesRandom:false,settType:m[2]});
}
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
  const sc=s.defenseProfile?.scores||{}; const g=k=>sc[k]?.score??sc[k];
  console.log([seed,s.tier,s.economicState?.prosperity,s.defenseProfile?.readiness?.score,s.defenseProfile?.readiness?.label,g('military'),g('monster'),g('internal'),g('economic'),g('disaster'),s.economicState?.foodSecurity?.storageMonths].join('\t'));
}
```

### The power, capture and people check, restated (d) (`cap.mjs`)
```js
const R=process.env.TREE+'/src'; import fs from 'node:fs';
const { generateSettlementPipeline } = await import(R+'/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R+'/store/configSlice.js');
await loadGenerationLawPayloads();
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
function cfgFor(seed){
  let m=seed.match(/^cold-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,settType:m[1]});
  m=seed.match(/^cold-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:[m[1]],selectedStressesRandom:false,settType:m[2]});
}
for(const seed of fs.readFileSync(process.argv[2],'utf8').trim().split('\n')){
  const s=generateSettlementPipeline(cfgFor(seed),null,{seed,customContent:{}});
  const ps=s.powerStructure||{}; const pl=ps.publicLegitimacy||{};
  const cap=ps.criminalCaptureState; const st=ps.stability;
  console.log(JSON.stringify({seed,r:s.defenseProfile?.readiness?.label,rs:s.defenseProfile?.readiness?.score,cap:typeof cap==='string'?cap:cap?.state??JSON.stringify(cap),stab:typeof st==='string'?st:st?.label,gov:ps.governingName,pl:{s:pl.score,l:pl.label,c:!!pl.isContested,x:!!pl.isLegitimacyCrisis,f:!!pl.governanceFractured},fac:(ps.factions||[]).map(f=>f.faction).sort().join('|'),npc:(s.npcs||[]).map(n=>n.id+':'+n.name).sort().join('|').length,npcIds:(s.npcs||[]).map(n=>n.id+':'+n.name+':'+JSON.stringify(n.personality)).sort().join('|')}));
}
```

### F2 — rite and namesake rows removed, over the harness summaries (`svc.py`)

Run it in the directory that holds `base/` and `tip/`.

```python
import json,collections,re,sys
def load(p): return {o['key']:o for o in map(json.loads,open(p))}
B=load('base/660.summary.0.ndjson'); T=load('tip/660.summary.0.ndjson')
RITE=re.compile(r'rite|ceremon|religious|burial|funeral|last rites|poor relief|blessing|worship|pilgrim|sacra|wedding|marriage|confession|sanctuary',re.I)
rem=collections.Counter(); remcat=collections.Counter(); towns_rite=set(); namesake=[]
for k,t in T.items():
    b=B[k]
    bc=collections.Counter(map(tuple,b['svcRows'])); tc=collections.Counter(map(tuple,t['svcRows']))
    for row,n in bc.items():
        d=n-tc.get(row,0)
        if d>0:
            cat,name,inst=row; remcat[cat]+=d
            if RITE.search(name or ''): rem[name]+=d; towns_rite.add(k)
            # namesake: removed service word appears in institution name
            w=[x for x in re.findall(r'[a-z]{5,}',(name or '').lower())]
            if any(x[:5] in (inst or '').lower() for x in w) or (re.search(r'burial|cemetery|grave',inst or '',re.I) and re.search(r'burial',name or '',re.I)):
                namesake.append((k,t['prosperity'],inst,name))
print('removed by category',dict(remcat))
print('rite rows removed',sum(rem.values()),'in',len(towns_rite),'births'); print(rem.most_common(25))
print('namesake losses',len(namesake))
for x in namesake: print('  ',x)
```

### The page diff, per view, between two dump directories (`viewdiff.py`)
```python
import sys,os,re
B,T=sys.argv[1],sys.argv[2]; views=sys.argv[3].split(',') if len(sys.argv)>3 else None
def parse(p):
    d={};cur=None
    for l in open(p):
        l=l.rstrip('\n')
        m=re.match(r'^== (.*) ==',l)
        if m: cur=m.group(1); d[cur]=[]; continue
        d.setdefault(cur,[]).append(l)
    return d
for f in sorted(os.listdir(B)):
    b=parse(os.path.join(B,f)); t=parse(os.path.join(T,f))
    out=[]
    for v in b.keys()|t.keys():
        if views and not any(x in v for x in views): continue
        bl,tl=b.get(v,[]),t.get(v,[])
        bs,ts=set(bl),set(tl)
        gone=[l for l in bl if l not in ts]; new=[l for l in tl if l not in bs]
        if gone or new:
            out.append(f'  -- {v}')
            out+= ['    - '+l for l in gone]+['    + '+l for l in new]
    print(f'## {f[:-4]}'+('' if out else ' (page unchanged in these views)'))
    print('\n'.join(out))
```
