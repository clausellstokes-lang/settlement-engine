# MERGE-TRAIN points 4 and 5: WRITE-TITLES-14 (no golden move) and OWNER-WORDS-DOSSIER (record 5, the fence's seven rows) (2026-11-09)

Seat: MERGE-TRAIN (Opus 5.5, session `session_01FbPLbdoiwrRKttcJEP3a48`), child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`). Brief `BRIEF-MERGE-TRAIN-2026-11-09.md` §0.2, §1 steps 5–6. Written 07:43 UTC (read from `date`). Every figure CONFIRMED unless marked PLAUSIBLE.

## 1. Point 4: WRITE-TITLES-14

`lane/write-titles-14-2026-11-08` at `d0af1b93f` (rev-parse equal to the chair's named tip) was merged at `339974b93` with no conflict. It touches `faceHonorifics.js`, `cardDoor.js` and their suite.

**Measured stage to stage** against record 3's post-state and its zero-move fix (`4e9984fa7`): gm 0 · fence 0 · herald 0 · prose 0 · witness 0 · PDF 0. That matches the lane's re-stage, so no record is owed.

**The registers:**
- the lighting census (`0f2e6c097`): titles 28,775 → 28,782 (+7, the lane's seven tests, as the brief predicted at the wave's base) and suiteTitles 7,739 → 7,741;
- the observed shape and the wiring census: unchanged (both `--check` exit 0);
- tests/lint + tests/scripts + faceHonorifics + tests/generators/people: 230/230 files, 3,301/3,301 tests.

## 2. Point 5: OWNER-WORDS-DOSSIER

`lane/owner-words-dossier-2026-11-09` at `af2d80d62` (rev-parse equal to the chair's named tip; its record `docs/chair/2026-11-09/OWNER-WORDS-DOSSIER-2026-11-09.md` with the addendum of the chair's rulings) was merged at `5f6160284`. There were five conflicts:
- **`PowerTab.jsx`** merged with NO marker. Car 3's underside panel and the dossier's governance section are each in its own region (brief §0.2).
- **`PowerStructure.jsx`** keeps both imports.
- **Prose numerics:** six rows re-keyed BY LINE, by identity (PowerTab 318/519 ×2/557 → 324/541 ×2/579; PowerStructure 100/233 → 102/236).
- **The roster:** the union. **Writer reach:** the integration side, re-frozen after.

**Record 5: one act.** Record `docs/shift-records/2026-11-09-merge-train-5-owner-words.json`, measured stage to stage against point 4's post-state (the stage of `339974b93`):

| act | commit | surface | rows | sha |
|---|---|---|---|---|
| 1 | `fef2045b7` | espionage fence (the 91st movement) | 7 of 360 (village 1, town 1, city 1, metropolis 4) | `2298c333` → `e7135f8d` |
| — | — | gm, herald, prose manifest, witness, PDF snapshot | 0 | — |

**The component, signed here with the lane's own figure:** item 3b, `0baafc789` — the governance vignettes retire "faction" for "power" (`governanceNarrative.js`), fence 7/360 on its lane (village 1, town 1, city 1, metropolis 4). That is equal row for row to the chain's 7.

Every other commit of the lane moves 0 on all six surfaces: items 1, 2a, 2b, 3a, 3c, 3d, 3e and 3f.

**The prose manifest:** the lane's cells move 0 of 1,050 (measured at the lane and at this point). Its listed cells, the overview ground lens's glance flip and the governance block's paragraph, are recorded in the final manifest record as 0-cell causes.

**The stage receipt:** 470/473. The three reds are the prose manifest's own arms.

**The rendered PDF moves:** "The place" kicker becomes "Trade and the houses", the DS-POW-1/2 paragraphs are gone and the governance paragraph is printed. The PDF view-model snapshot does not move, because the paragraph is composed in the chapter.

**The registers:**
- writer reach `--write` (`85b5cba80`): cohort 1,362 held, LIT 669 → 670;
- lighting (`6510a5627`): files 3,133 → 3,135, credited 2,749 → 2,751, titles 28,782 → 28,802, suiteTitles 7,741 → 7,746;
- the wiring census: dossierMounts.js's stamp (the ground lens's glance flip) and the producer index 1,312 → 1,313;
- the edge bundles: re-emitted (governanceNarrative.js);
- the roster: this record's commit.

## 3. The merge's reds at point 5, each cured by cause

- **domainAnyCastBaseline:** governanceAccount.js's two `Record<string, any>` were typed for real with a `GovernedRecord` typedef.
- **negativeAssertionAnchor:** governanceAccount.test.js ×6 and powerGovernanceAccount.test.jsx ×2, anchored by the positives beside them.
- **mutationCoverageManifest:** the same two files, with written rationales.
- **phoneChromeFloor.census:** CAR 3's, found here. tests/components runs at this point for the first time on the train. Bisected over the stages: green at points 1–2, red from car 3's merge `c6ded8e3a`.
  - **The cause:** WhoRunsThisTownPanel's two sub-floor chrome sizes, `bare` +2 on /create, /settlements and /gallery.
  - **The cure:** both floored through `chromeFontSize`; `floored` +2 on the three rows, said in the census note.
  - It is attributed to car 3 in the train's red table.
- **The phone floors** (`dossierPhoneFloorAllViews`: MOBILE / DESKTOP baselines) are red by the train's DOM causes: car 1's badge, car 3's panel, this lane's governance paragraph and overview moves. They are re-measured ONCE at the final tip by cause (brief §0.3, GREEN-BASE §4.4), not here.
- **readerValidationOnPage soak1k-24:** red at the base `2053a809c` too (tests/components at the base stage: that one red alone). It is the base's, named in the final table.

**The proof at the point's tip:** tests/lint + tests/scripts + tests/edgeFunctions are green except the roster, which is cured in this record's commit.

## 4. CONFIRMED vs PLAUSIBLE

**CONFIRMED:**
- every figure above;
- the chrome-floor bisection (the census run at each stage).

**PLAUSIBLE:**
- the per-lane split of the phone-floor pixel rows. It is measured at the final tip by cause, as GREEN-BASE did.
