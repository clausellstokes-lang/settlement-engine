# REVIEW-R3-TABS-3 — round three's tabs lane: the fifth seat's stage 30157258..68e9e97b5

**VERDICT: CLEAR** for lane/r3-tabs-2026-11-13 at **68e9e97b5**, read back from origin and unmoved. No HIGH and no MEDIUM
finding is the stage's own. The stage owns three LOW findings. Four HIGH findings are CARRIED: their surfaces print at
the base too, from files this lane does not hold. They are twins of the ruling the stage cured on the tab, and the
chair must place them (below).

Step 1 was written and pushed cold (c5ee2d711) before I opened the hand-back:
[REVIEW-R3-TABS-3-LINES-READ.md](REVIEW-R3-TABS-3-LINES-READ.md). Probes: `probes/REVIEW-R3-TABS-3/`. Instruments: the
first reader's 1,536 births (`births.mjs`, `seeds1536.txt`; 0 errors). They are byte-identical at base and tip, so the
stage moves no record. The Defense desk (`desk.mjs`) and the PDF print prose (`printdiff.mjs`) ran over all 1,536 at
both trees. `render.sh` ran on the 78 moved towns at both trees, then on all 1,536 at the tip. The PDF Defense chapter
was executed (`pdfprobe.census.jsx`). The Foundry journal was built (`buildJournalPages`).

## Findings, ranked

| # | Rank | Own / carried | Town · sentence or test | Fact against it | Proof |
|---|---|---|---|---|---|
| H1 | HIGH | CARRIED. Writer: `src/pdf/sections/DefenseSecurity.jsx` (prints `force.name` and the REQ/FORCED tag raw; the upkeep lanes' file). The seat declares it FOR THE JOIN | The PDF Defense chapter of all 14 gate towns, e.g. Shattkarez (r2s-famine-town-3): "Gates (if walled)". In 8 of the 14 a "FORCED" badge follows it, e.g. Ingivik (r2r-town-28): "Gates (if walled) · FORCED" | A catalogue gate in brackets, and the registry's provenance (`source: 'faction_boost'`) printed as a badge the user did not set. The tab prints "Town gates" with no badge (rulings (a), b1/(f)) | EXECUTED (`out/pdf.gates.txt`) |
| H2 | HIGH | CARRIED. Writer: `src/foundry/journalPages.js :: defensePage` (not the lane's). **Not declared** by the seat | The Foundry journal of all 14: "- Gates \(if walled\): Controlled entry points with gatekeepers. \(faction\_boost\)". Every force line carries its provenance in brackets: "(generated)", "(required)", "(coherence\_repair)", "(cascade)" | as H1 | EXECUTED (`out/surfaces.gates.txt`) |
| H3 | HIGH | CARRIED. Writer: `src/domain/crisis/crisisPage.js` levers (`l.institution` raw) → `CrisisTab.jsx` (not the lane's). **Not declared**: the seat's sweep read the Defense, History and Foundations sections only | The Crisis tab's "Levers" list of Rundfeld (r2s-monster_pressure-town-3): "Gates (if walled)", three lines above "Defence: Town walls, Town gates, …" on the same tab. Also Nordey (rr3-town-under_siege-rand-9, a siege). Across the 1,536, **209 towns'** Crisis tabs print a bracketed catalogue key: "Parish churches (10-30) · held by …" (the retired word too), "Cathedral (10,000+ only)", "Bakers (5-15)" … | kind (h), and (g): one house, two names on one tab | EXECUTED (`out/sweep.tip.txt`) |
| H4 | HIGH | CARRIED, declared FOR THE JOIN by the chair's re-ruling | Defense · Medical Readiness: "Major monasteries (5-10). Wounds and fevers …" in 12 metropolises (writer `defenseDisplay.js`, not the lane's). History: "…Taverns (5-20)…" in r2r-town-9 (`HistoryTab.jsx :: TensionRow`; this lane holds that file, but the chair re-ruled the strip to SURFACES-1) | (h) | EXECUTED (my sweep agrees with the seat's: 12; 1; Foundations 0; Magic 0) |
| L1 | LOW | **THE STAGE'S OWN** (`defenseStateProse.js :: AGAINST_THE_BAR.CRITICAL`, which strikes by pool; `rungWith` silences the supply clause with its row) | True lines lost beside Critical: Shivamandal (r2s-succession_void-town-0): "You see armed fighters at Shivamandal and no wall for them to stand behind, so any fight would happen wherever the attacker chooses." **and** "The supply book for Shivamandal's defenders runs short: the trades that should feed and equip them are failing, so the defence is weaker than its numbers suggest." Dar-al-mandi (rr3-town-occupied-rand-4): "Dar-al-mandi's defenders are a little worse off every month the trades behind them keep failing." | All three TRUE on the record: Barracks + Town watch, "Unfortified", `chainModifiers.military` −5 in both. The statement declares one true line lost. **The two supply clauses are lost undeclared** | EXECUTED (pages, desk) |
| L2 | LOW | **THE STAGE'S OWN** (the (h) guard) | `defenseInvasionWithinACriticalBand.test.js` | Plant Ph5 (the CRITICAL set also strikes 'militia only', a pool the docblock says is true beside Critical): the guard file and the seven others stay **GREEN**. Nothing pins that the true pools stay drawn beside Critical, so an over-strike (a cure by silence) is unguarded | EXECUTED (plant) |
| L3 | LOW | **THE STAGE'S OWN** (code, not a page) | `defenseStateProse.js` l. 887–895: L2's docblock ("…are silent there. The bar and the badge stay…", `@type {ReadonlySet<string>}`) is left orphaned directly above the new `AGAINST_THE_BAR` docblock; the set it typed is gone | A reader of the code reads two docblocks for one const, and the first types a value that no longer exists | EXECUTED (read) |
| C1 | MED | CARRIED, the chair's "NOT THIS SEAT'S" (`defense.generated.js` pools) | The siege deterrence line "…any attacker would think again about the cost." still prints in 11 siege towns | as the second reader's C1 | EXECUTED (desk: 11 at base, 11 at tip) |
| C2 | MED | CARRIED, as C1 | Deterrence lines under an occupation: 34 at the base, 28 at the tip. (h) took 6 of them, those beside Critical | as the second reader's C2 | EXECUTED (desk) |
| C3 | — | CARRIED, record 440 | `writerReach.walker.test.js`: "the surfaceReach grammar round-trips…" red at base and tip | NAMED, banked by the chair at the close (the seat's (d)) | EXECUTED |

**Lines I would strike, for the owner's veto:** none of the stage's. **Lines I would restore:** L1's three, by a variant
strike in 'force with NO walls' (only v1 "It answers raiders well" claims a hold). **For the join (the chair's to
place):** H1–H3. They are one cure: `institutionDisplayName` on the force name, and no `source` tag, in
`DefenseSecurity.jsx` and `journalPages.js :: defensePage`; the levers' `institution` through the same seam in
`crisisPage.js`.

## Step 2 — the statement's rows (THE FIFTH SEAT; read after step 1 was pushed)

| Row | Statement | My run on the 1,536 | Verdict |
|---|---|---|---|
| (a) force card | 14 → 0; "Town gates" | 14 → 0 (desk and pages). "Town gates" was read in its 14 towns and in Nordey (a siege) under "Town walls", each a walled town | **cured and true.** The twins H1–H3 remain (H1 declared for the join; H2 and H3 not) |
| (a) sweep | Defense 14 (cured) + "Major monasteries (5-10)" 12; History 1; Foundations 0 | the same: 12; 1; 0. Every other bracket is on tabs this lane does not hold (Institutions, Services, Power, NPCs, Economics, Outlook, Plot Hooks, Overview and the Crisis tab, H3). The roster's strip is r2-code-b's, as the seat says | confirmed: those writers are not the lane's (H4: `HistoryTab.jsx` is the lane's file; its strip was re-ruled to SURFACES-1) |
| (c) occupation | 64 → 0 of 76 (adequate 12, weak 32, critical 20) | 64 → 0 of 76 (12 already silent at base); desk, print prose and pages agree | **cured by silence.** Read against the "Under occupation" block on each base page: 44 FALSE (MED), 20 doubtful (LOW), **0 certainly true lost**. Ingili and Muulcoba (R1's towns) are silent |
| (h) Critical band | claims 6 → 0; 7 cells; one true line lost (Shivamandal) | 6 → 0; 7 rows; Invasion lines beside Critical 479 → 472 | **cured by silence**: 6 false removed. True lost: **3 sentences, not 1** (L1) |
| (e) 'no walls' made record | the plant reds the arm on the made record | plant Pe reds exactly that title, alone | **cured** (R3) |
| (d) wiring census | the door; the alias pin 39 → 42 | `--check` exit 0 at the tip (exit 1 at base); `--dry`: 0 rows, delta 0 bytes; walker 3 titles and projection contract 2 titles green at tip, red at base | **cured** (R2), except writer reach (C3, banked) |
| (f) REQ/FORCED | already cured on the tab | — | true of the tab; the PDF still prints it (H1) |
| (g) measure only | Foundations "Secure" vs Tonight "Pressured" | not re-run (the joined branch; not this stage) | — |

**The second reader's findings:** R1 cured (the posture row is silent under an occupation; plants Pc and Pc2 red the
arm). R2 cured through the doors, but for the writer-reach title (C3), which the chair banks. R3 cured. R4 is not this
seat's (named in its FOR THE JOIN). C1 and C2 are carried (above).

**Where I would rule differently.** (c): no; I agree. A narrower strike (only where the banner names the occupiers'
troops or arms) keeps only doubtful lines. (h): by variant, not by pool, and the supply clause kept or redrawn (L1).
The ruling's words "the row is silent or draws only a pool whose every line is true" already allow a variant strike.
(a): "NO SURFACE" should bind the PDF, the journal and the Crisis levers too (H1–H3). The chair must say whose lane
carries them.

## Step 3 — the laws

The stage touches no generator or data file. The births are byte-identical at base and tip (sha256 of the sorted
stream 5fac254a… at both), so no record family moves. No draw is added or moved, no key, no vocabulary word. The page
prints no new machinery: one label and 71 silences. (No field diff of the 720 is needed beyond that identity.)

## Step 4 — plants (EXECUTED; `plants3.py`: each plant alone, the file restored by content, eight guard files run)

| Plant at the tip | Reds |
|---|---|
| control | none (29/29) |
| Pa: card prints the raw key | defenseForceCardHouseLabel (2) + defenseForceCardNoProvenance's name pin (1): the label's fault only |
| Pc: occupation strike off | defensePostureAgainstItsFacts (2: the arm and Ingili's pin) only |
| Pc2: the old order (strike after the fallback) | the same two only |
| Ph: Critical arm off | defenseInvasionWithinACriticalBand (1) only |
| Ph2 / Ph3: the arm loses 'force with NO walls' / the garrison pool | the same (1) only, each |
| Ph4: the arm reads the readiness score, not the bar | 3 files, 4 titles: the wrong key reds |
| Ph5: over-strike ('militia only' added) | **NONE (L2)** |
| Pe: 'no walls' off | defensePostureAgainstItsFacts (1, the F3 arm on the made record) only |

Every guard the stage added or changed reds on its own fault and only on it. Every cure by condition has a guard; the
over-silence direction of (h) has none (L2).

## (iv) The three pins re-keyed, and the count moved

- **The provenance file's by-name pin** (`defenseForceCardNoProvenance.test.jsx`): every card is still asserted, now by
  the name the card prints through the same seam. Plant Pa reds it. **By identity, with its cause; not loosened.**
- **Ingili's ADEQUATE pin → silence** (`defensePostureAgainstItsFacts.test.js`): the town is occupied, so ruling (c)
  makes silence the truth. The fallback stays pinned on its LIFTED record. Pc and Pc2 red it. **By identity.**
- **The militia keeper → rr3-thorp-famine-rand-0** (Uxmaltzal): a walled Household-levy thorp, a Weak bar (20), not
  occupied. It draws 'walls with citizen militia' (v2, "Every household … would send someone to the walls", true
  there). Makropyrgos left because (h) now silences it. The same two assertions stand. **By identity.** Its bar sits
  on the Weak cut (20); a moved rating could flip it.
- **The alias draft 39 → 42**: at the base the walker was red (the pin said 39, the draft measured 41; R2's class). At
  the tip it measures 42 and the pin is exact. Diffed row by row (`out/aliasdraft.docblockReports.txt`), the one row
  the stage adds is `cause:occupation → row` at `defenseStateProse.js:936`, the new `silentUnderAnOccupation` docblock.
  The other four differ only by line shift. **Re-keyed with its cause and exact; not loosened.**

## (v) The registers through their own doors

- `docs/content/wiring-census.json`: `node scripts/wiring-census.mjs --check` exits 0 at the tip and 1 at the base.
  `--dry` at the tip: bytes committed 2,623,961 = fresh, 0 rows would move. The committed file IS the door's output.
- `tests/lint/.lighting-census-baseline.json` (files 3263, credited 2859, titles 29454, suiteTitles 7994): the
  walker's ordinary run at the tip is green, which is the door's checking run. I did not re-freeze it: the refreeze
  door refuses a tree with my untracked `node_modules` link, and I would not write a new register.

## (vi) The gates, by my own run at the tip

eslint on the 8 touched src and test files: exit 0. `typecheck:domain:strict`: 1113 at ceiling 1113, exit 0.
`typecheck:ratchet`: 167 at ceiling 167, exit 0. The stage's 8 guard files: 29/29 at the tip; the six that exist at the
base: 20/20 there. The four register walkers: tip 243 pass / 1 red (C3); base 238 / 6 red (C3 and the five the stage
cured).

## Step 5 — merges

There is no merge in 30157258..68e9e97b5.

## Step 7 — CENSUS-2 (`census2.sh`, the census's 720, `--files` the stage's two src files)

Run at the tip by me (exit 0, every stage's own exit read; births+render 611 s, count+trace 116 s). The base counts are the
second reader's run at 301572583, this stage's base (`census2.counts.tip.txt` on its branch).

| kind | base 30157258 (towns · distinct lines) | tip 68e9e97b5 |
|---|---|---|
| a | 712 · 610 | 712 · 610 |
| b | 70 · 98 | 70 · 98 |
| c | 301 · 298 | 301 · 298 |
| d | 105 · 37 | 105 · 37 |
| e | 46 · 18 | 46 · 18 |
| f | 720 · 344 | 720 · 344 |
| g | 720 · 14 | 720 · 14 |
| h | 20 · 63 | 20 · 63 |

**No kind rises.** None moves: the census's patterns hit neither the 71 silenced lines nor the gate label. Of 21,156 hits
at the tip, **0 trace to the stage's two files** (`--files DefenseTab.jsx,defenseStateProse.js`).

## Step 10 — measure only: does (h) follow the rebuilt rating?

**Yes, by reading the keys.** The Critical arm reads `scoreBand(settlement.defenseProfile.scores.military)`
(`defenseThreatProse` → `withinTheBar(…, dp.scores?.military)`). The tab's Invasion & War chip reads
`statusCase(scoreBand(scores.military))` (DefenseTab.jsx l. 281/422). On origin/lane/upkeep-monotone-2026-11-14 the
rebuild rewrites `scores.military` at its writer (`defenseGenerator.js`). It leaves `scoreBand`'s cuts and
`DefenseTab.jsx` unchanged (it only adds `economicSurvivalBandOf`). Chip and cure read one stored value through one
function, so the cure follows a moved band with no change. No value is left behind. NOT measured on births of the
rebuild (nothing merged).

## What I did not measure

- The Tonight sheet, shared player views and the PDF *document* (the chapter was executed as leaves, not rendered to
  bytes). The Foundry journal was built from the view model, not exported as a module.
- The lighting census's refreeze (its walker green only, above).
- The whole suite (as the brief sizes the read).
- Whether the 20 doubtful posture lines (LOW) are false: the record cannot settle whether a thorp "could not hold off
  a raid" when "its defence is someone else's to order" and names no occupying force.
- THE COUNT: context usage read 0 at my one check (no turn had yet ended: the page render ran unbroken).
