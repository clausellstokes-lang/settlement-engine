# SEAT-9 — HAND-BACK (kept current at every push; first written 2026-11-20T22:14:55Z, read from `date -u`)

**For the next owner of this lane: this file, `SEAT-7-HANDBACK.md` (items 69 to 79, §2 to §7), `SEAT-6-HANDBACK.md` (items 53 to 68), `SEAT-6-TO-LIGHT.md`, `SEAT-5-HANDBACK.md` §1 (items 1 to 52) and `briefs/` are all you need.** Every ruling in force: SEAT-5's 1 to 52, SEAT-6's 53 to 68, SEAT-7's 69 to 79, this file's 80 on. SEAT-9's assignment: `docs/chair/2026-11-20/seventh/prompts/SEAT-9.txt` on `origin/lane/chair-2026-11-08` (where it differs from SEAT-8.txt, it governs).

Branch `lane/seat-9-2026-11-20`, cut at SEAT-7's handed-over tip `b2845bafc` (verified at seating). SEAT-9 is session_019yED1R6dpS2Dcy7bSasb2G.

## 0. THE STATE

- **Lane tip:** `lane/seat-9-2026-11-20`. Last code merge: UK + UK-CURE (`9624a7ac4`), its follow-up and doors (`333952f7d`, `c5f8d91d2`, `b939ed26b`).
- **OUT:** BFL (FLIP-CENSUS) in SEAT-7's container; its branch `lane/seat-7-2026-11-20-flip-wip` comes through the chair when it closes. If the container ends first: re-staff from `briefs/FLIP-CENSUS.md` + items 73, 76, 78, one shard at a time.
- **OWED (to the chair, before "SEAT <commit>"):** the owner's plain table D → L1 with six places in simple words; the flip census's size by file; rule 8 as re-ruled (item 78).

## 1. RULINGS AND FINDINGS SINCE SEAT-7's HAND-BACK

80. **UK MERGED WITH UK-CURE (SEAT-9, 2026-11-20 ~22:00Z):** one merge `9624a7ac4` of `452e6f639` (which carries UK's `fad107fcc`). Both diffs were read whole: UK's `src` and its 177-line `tests/generators/seatBandFold.test.js`, and UK-CURE's leaf `src/generators/npc/powerBand.js`, `npcGenerator.js` and `scripts/.size-baseline.json`. UK-CURE is as BUC claimed: the band is verbatim in behaviour with one statement per line, it is re-exported, and the baseline went 941 → 930 with its reason row. Then:
   - (1) `roleCategory.test.js` re-pointed to `npc/powerBand.js` (`333952f7d`, red-first: 1 failed at the merge, green after);
   - (2) the wiring census `producerIndexFiles` 1439 → 1440 by `node scripts/wiring-census.mjs` (`c5f8d91d2`; 0 rows moved);
   - (3) the lighting census 3711 → 3712 by `LIGHTING_CENSUS_REFREEZE=SEAT-9` and the mutation manifest's `rationale` row for `seatBandFold.test.js` (`b939ed26b`; uncovered baseline 186 unchanged).

   **Dark confinement of the merge:** `confine-two.sh b2845bafc b939ed26b` is EQUAL (`36ee5bb0…ce89`, 1245 places; the same hash BUC recorded).
81. **TWO FINDINGS IN UK's TEST DIFF (SEAT-9's reading; for the chair):**
   - (a) **Arm 3 is a golden in effect.** It pins sha256 digests of six WHOLE births (`uk-town-17`, `uk-city-5`, each with the law absent, 1 or '2') RECORDED at `fb937f369`. Any change the working line makes to those births reds it at the landing. If it reds with the line merged, the cause is the line's, not this lane's: name it, and re-record it only by the chair's word.
   - (b) **It reds at the flip.** `birthConfig` will mint `_seatLawVersion: 2` once the dial flips, so arm 2's "uk-town-17 born dark" (`dark.config._seatLawVersion` undefined) and arm 3's `absent` rows (and arm 2's dark half of the "one `_rng()` call" pairing) assume a birth with nothing minted. Their "dark" must then pass `_seatLawVersion: 1` explicitly or use a mocked dark seam. This joins TO-LIGHT §2's worklist. BFL's cut `9cc5045f2` lacks this file, so the flip census cannot see it.

## 2. THE UNITS

| unit | branch | state |
|---|---|---|
| UK + UK-CURE | `lane/seat-2026-11-20-uk` `fad107fcc` + `lane/seat-7-2026-11-20-uk-cure-wip` `452e6f639` | MERGED `9624a7ac4`; follow-up and doors `333952f7d` `c5f8d91d2` `b939ed26b` (item 80) |
| FLIP-CENSUS (BFL) | `lane/seat-7-2026-11-20-flip(-wip)` | OUT in SEAT-7's container |
| U6 … U12 | | not briefed (SEAT-7 §0 NEXT) |

## 3. STORED FIGURES THIS SEAT MOVED

- `docs/content/wiring-census.json` stamp `producerIndexFiles` 1439 → 1440 (UK-CURE's leaf).
- `tests/lint/.lighting-census-baseline.json`: files 3711 → 3712, credited 3237 → 3238, titles 31290 → 31303, suiteTitles 8659 → 8664 (UK's test file).
- `scripts/mutation-coverage-manifest.json`: one `rationale` row (`tests/generators/seatBandFold.test.js`).
- `scripts/.size-baseline.json`: `npcGenerator.js` 941 → 930 (UK-CURE's, by its door).

## 4. HOUSES AND CLASS-TABLE ROWS FOR THE JOIN

None added by UK or UK-CURE (no vocabulary, class table or house read).
