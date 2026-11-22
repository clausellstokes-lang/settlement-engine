# U7-PAGE REPORT (CS13): under the seat law, the chain names the holder and its person. Builder BU7, for SEAT-10.

Written 2026-11-22T09:12:32Z (`date -u`). Branch `u7` in the scratch clone, cut at `46339e5c7`. The work is in `3060cb1ee`, `8634e9d9d` and `9b32160b0`. This report is the commit after them; its sha is in the final message.

Every claim is labelled: **CONFIRMED** (run) or **PLAUSIBLE** (read).

## THE CURE, BY `file :: symbol` (one file: `src/domain/dossier/powerStrata.js`)

- **`rulingHouseApartOf`** (new, private). Reads the holder only where it stands apart from the form:
  - The record must be law 2 (`seatsByHolder`); under law 1 `holderOf` is never called.
  - It asks `holderOf(…, { audience })`, where the audience is the reader's unless the caller passes `{ audience: 'owner' }`.
  - It answers null, so the read is today's, in these cases:
    - no holder (R4/R5, or an unattributed R1);
    - a holder that is the form's own row;
    - a vacant governing row;
    - for the reader, a holder `holderOf` refuses (hidden or criminal: `isVeiledRow`, or criminal by name).
- **`rulingChainOf(settlement, options)`**:
  - `power` stays the FORM.
  - `faction` is the holder.
  - `npc` comes from:
    - (0) `holderPersonOf`;
    - else (1) the holder's top ladder rung;
    - else (2) `holderFaceOf`.
- **`holderPersonOf`** (new). Keeps `holderOf`'s person unless the record files that person as the first (rank 1) of a THIRD house, neither the form nor the holder. That third house is the old holder, which is the six's exact shape.
- **`holderFaceOf`** (new). The holder's rank-1 face: the people car's seat rule (`seatCandidatesOf`'s first) applied to the holder's row. It skips anyone ousted, any office stand-in, and, for the reader, a veiled face. It does not carry over `seatCandidatesOf`'s seat-title tail, which exists for pre-car records with no memberships. PLAUSIBLE: no law-2 record reaches that tail.
- **`derivePowerStrata(settlement, options)`**: the ruler entry is the holder's row. `gated` and `contenderCount` are the incumbent's, as before.
- **`outrankingRivalOf(settlement, options)`**: the floor is the holder's power, and neither the holder nor the form counts as its rival.
- **`deciderOf(settlement, options)`**: neither the holder nor the form counts as the occupier. It falls through to `outrankingRivalOf` with the same options.
- **No new import edge.** `powerStrata.js` already reached `holderOfSeat.js` and `seatLaw.js` through `rulingPowerCoup.js`. PLAUSIBLE; `engineCoreLazyEdge.test.js` is green.
- **eslint** on both files: exit 0. CONFIRMED.

### A judgment for the chair: how I read "the holder's person"

I read "the HOLDER's person: `holderOf(…).person` where the record names one" as: keep `holderOf`'s person unless it is the old holder's first.

**Why not the literal reading:** on the six, `holderOf(…).person` IS the old house's person (Judith Weber on `u7p-town-8`). Read literally, the rule cures none of them. CONFIRMED (`bu7work/seeds-flipped.json`).

**Why not my first cut:** it kept the person only where they were filed in the holder's house. On the 160 lit births, that also moved the person on 24 births held by kind (R3) at birth. On 3 of those, a named Mayor became nobody (`u7p-town-39`, `u7p-city-2`, `u7p-city-8`). All 24 raised `seat_outside_governing_faction`. CONFIRMED. The narrowed reading, in `8634e9d9d`, moves none of them. Arm 1b pins it on `u7p-town-2`, and the chair may veto it.

## THE SIX SEEDS, RED AND GREEN (`tests/domain/seat/seatChainHolder.test.js`, arm 1)

| seed | form (kept) | holder before → after | red: today's chain (07:56:53Z–07:57:05Z) | green: the cured chain |
|---|---|---|---|---|
| `u7p-town-8` | Town Mayor | Craft Guilds → Merchant Guilds | Judith Weber | **Felix Naumann** |
| `u7p-metropolis-15` | Democratic assembly | The Merchant Bloc → Merchant Guilds | Dietrich Engel | **Josefine Wolf** |
| `u7p-metropolis-21` | Grand Council | The Trade Compact → Merchant Guilds | Dietmar Uhl | **Christine Jäger** |
| `u7p-metropolis-26` | Grand Council | The Commercial Circle → Merchant Guilds | Brunhild Steiner | **Gertrude Moser** |
| `u7p-metropolis-27` | Grand Council | The Guild Alliance → Merchant Guilds | Conrad Brandt | **Katharina Rosenfeld** |
| `u7p-metropolis-28` | Grand Council | The Trade Compact → Merchant Guilds | Josef Frank | **Notburga Weber** |

- **Red first, as first written** (`it.each`, 07:56:53Z–07:57:05Z, unchanged source): 8 failed, 7 passed. Each of the six failed on `expected '<old person>' to be '<holder's person>'`. Arm 2's two cases failed on the owner's read. CONFIRMED.
- **Red first again, in the final shape** (`9b32160b0`'s test against `46339e5c7`'s `powerStrata.js`, in the flipped copy, 09:40:50Z–09:41:31Z): arm 1 reported "6 of 6 case(s) failed", each on its person by name. Arms 1b and 2 were red, arms 3 and 4 green. CONFIRMED.
- **Why the shape changed:** the tables first ran as `it.each` with a row parameter. `sovereigntyLightingContract.walker` parks such a file, so its each-family count rose past the ceiling of 106. Arms 1, 2 and 3 are now one parameterless test each, with every row run through `collectSeedFailures`. The assertions are unchanged.
- **Green:** 5 of 5 tests (all 6 + 1 + 2 + 6 + 1 cases). CONFIRMED.
- **What each case asserts:**
  - the six are listed by name; the probe's report gave only some of them (`bu7work/seeds.mjs`, run 07:49:16Z–07:49:57Z);
  - each cured person is a literal, a member of `Merchant Guilds` at rank 1;
  - the old person is of the old house and holds no place in the holder's (`expectAbsentWithAnchor`);
  - the old person leaves the chain (`expectPresentThenAbsent`, with `// anchored:`);
  - the ruler entry of THE POWERS is `Merchant Guilds`.
- **The other arms:**
  - (2) Veiled holder, hidden or criminal: all four reads to the reader equal today's, and the chain names Judith Weber and Town Mayor. The owner reads Felix Naumann.
  - (3) Law 1 on the six born dark: the reads equal the reads with the holder unread, although `holderOf` answers a holder on each record. The control, the same record stamped law 2, moves the reads.
  - (4) `u7p-town-1` lit, R4: the reads equal the law-1 reads of the same record. The chain is Town Council and Konrad Berger.

## WHAT THE CURE MOVES ON THE LIT POOL (flipped copy, reader audience, 160 births, `bu7work/moves.mjs`, run 09:11:24Z–09:12:06Z) — CONFIRMED

| | births (160) | kept-form transfers (10) |
|---|---|---|
| holder apart, to the reader | 113 (R2 79, R3 34; R4 47) | 10 (R1) |
| vacant seat with a holder (stood down) | 1 | 0 |
| chain `faction` moves to the holder | **112** | 10 |
| chain `npc` moves | **0** | **6** (exactly the six) |
| strata ruler entry moves to the holder | **112** | 10 |
| `deciderOf` / `outrankingRivalOf` move | 21 / 21 | 1 / 1 |
| `crisisNoteFor` on the governing row moves | 0 | 0 |
| `seatHolderFindings` changes | 0 | 6 |

**For the chair:** under the brief's rule ("`faction` is the holder"), every lit town held by R2 or R3 at birth now has a chain faction other than its power. `PowerTab.jsx` already prints such a row, "Seat held by", with its existing words "<holder> holds the governing seat." So on the lit build, that row now appears on those 112 of 160 births. PLAUSIBLE by read; not rendered.

## EACH READER'S AUDIENCE

No reader file changed. None passes an audience, so every reader gets the **reader's** audience: the reads fail closed.

| reader | the read | audience |
|---|---|---|
| `PowerTab.jsx :: RulingChainBlock` | `rulingChainOf` | reader |
| `PowerStrata.jsx :: PowerStrata`, `FactionRow` | `derivePowerStrata`, `crisisNoteFor` (→ `deciderOf`) | reader |
| `DossierSearchResults.jsx` | `derivePowerStrata` (roster) | reader |
| `tonightSheet.js` | `rulingChainOf(…).npc` | reader |
| `crisisCast.js` (`deriveStakes`, the instigator read, `seatRows`) | `outrankingRivalOf`, `rulingChainOf` | reader |
| `governanceAccount.js :: governanceAccountOf` | `rulingChainOf` | reader |
| `seatHolderFindings.js` | `rulingChainOf` | reader |
| `pdf/lib/viewModel.js` (the PDF's crisis note) | `crisisNoteFor` | reader |
| `facts/factLayers.js :: powersList` | declares `derivePowerStrata` | — |
| `powerStateProse.js`, `patronage.js` | name the chain in comments only; no call | — |

The non-call rows are PLAUSIBLE (grep and read). No caller is the owner's own document today. A caller that is passes `{ audience: 'owner' }`.

**For the chair (outside the manifest, not touched): `coherence/seatHolderFindings.js :: seatHolderFindings`.** On the six, it now raises `seat_outside_governing_faction` ("Felix Naumann is not of Town Mayor"), because it checks the chain's person against the FORM's members. CONFIRMED: 6 of the 10 kept-form transfers, 0 births. It is wired into no gate. Under the seat law it should read the holder's house. That is a reader change for a later unit.

## GREEN, WITH COUNTS (clone, at `9b32160b0`'s files, shared tier, `--maxWorkers=2`, run 09:42:36Z–09:48:32Z) — CONFIRMED

- **`tests/domain/seat/` whole:** 6 files, 171 tests, all green.
  - `holderOfSeat` 51, `seatChainHolder` 5, `seatContest` 25, `seatLawSavedTown` 6, `seatTable` 45, `seatTransfer` 39.
- **Every other test file under `tests/` that names `powerStrata`** (outside `tests/lint`): 21 files, 160 tests, all green, none RED-AT-LINE.
  - `architecture/engineCoreLazyEdge` 3;
  - `components/powerSeatRender` 5, `powerStrata` 8, `powerTabSupport` 19, `seatHolderOnThePage` 3, `seatWordsOnce` 8;
  - `domain/editPools` 17, `ladderTopRungLeader` 3, `powerProseNameInSentences` 12, `dossier/seatHolder` 13, `people/dualHatReaders` 5, `people/seatKeeper` 4;
  - `generators/bar3PeoplePowers` 5, `terrainPoolsSeat` 2, `people/castDerived` 6, `people/nobleFaces` 3, `people/seatHolderCard` 6, `people/seatKeeperContender` 3, `people/successionClaimants` 6, `power/bar2PeoplePowers` 11;
  - `pdf/pdfParityFixes` 18.
- **Combined run:** 27 files, 331 tests, 0 failed. The same set was green at `3060cb1ee` (08:18:51Z–08:24:18Z) and at `8634e9d9d`, with 342 tests there because the old shape counted cases as tests (09:05:37Z–09:10:42Z).
- **eslint** on both files at `9b32160b0`: exit 0.
- **The two `tests/lint` files that name `powerStrata`** (`settlementMapSurfaceAllowlist.walker`, and `styleLaw.walker` through its baseline) ran in the whole run below.

## `tests/lint` WHOLE

Run once at the final tree (`9b32160b0`'s files, shared tier, `--maxWorkers=2`, 09:52:02Z–10:15:52Z). CONFIRMED.

**Totals:** 223 files (219 passed, 4 failed), 3,352 tests (3,348 passed, 4 failed).

**The line's own reds** (RED-AT-LINE rows, unmoved; neither file reads `powerStrata`):
- `proseComposed.walker` :: "A0b … THE SHIPPED CORPUS READING, printed and held SHRINK-ONLY" (2322 against 2103);
- `proseCorpusBytes` :: "RAW is EXACT: above fails, below demands the row be lowered";
- `proseCorpusBytes` :: "GZIP sits inside the 1 % band around its committed figure".

**The clone's environment:**
- `ledgerCitationIntegrity.test.js` fails to load: `git ls-tree … refs/heads/review-fixes-2026-07-08` finds no such ref in the scratch clone.
- I did not fetch it: the clone's source is the read-only checkout.

**Mine, and NOT cured here (outside the manifest; STOPPED by symbol):**
- **The red:** `sovereigntyLightingContract.walker` :: "THE CENSUS IS AN ASSERTION, NOT A SENTENCE — every stated figure is executed": "the estate's file count moved … expected 3749 to be 3748".
- **Why:** the brief's one new test file adds one file to the lighting census.
- **The cure:** re-freeze `tests/lint/.lighting-census-baseline.json` by its door (`LIGHTING_CENSUS_REFREEZE=… npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`, on a clean committed tree), as `a94f7d097` did for SAVED-SEAT-REDERIVE. That file is the integrator's to write.

**Mine, and cured here:**
- **The red:** an earlier whole run (09:13:36Z–09:38:14Z, at `010de1a62`) also failed "⛔ THE EACH-FAMILY PARK DEBT ONLY SHRINKS". The cause was the test's row-parameter `it.each`.
- **The cure:** `9b32160b0` reshapes the tests, and that arm is green above.
- **Checked beside it** (09:40:12Z–09:40:25Z): `seedLoopTotality.walker` 9/9 and `negativeAssertionAnchor.walker` 9/9.

## THE FLIPPED COPY

`scratchpad/bu7-flipped`: `src`, `tests` and the rest copied from the clone, `node_modules` hardlinked, never committed.

- **Its whole diff from the clone** (`diff -r -q --exclude=node_modules --exclude=.git`): exactly two files, CONFIRMED.

```
src/domain/seat/seatLaw.js:77            NEW_SETTLEMENT_SEAT_LAW_VERSION = DEFAULT_SEAT_LAW_VERSION  ->  HOLDER_SEAT_LAW_VERSION
src/domain/seat/seatCircumstances.js:50  SEAT_CONTEST_LIT = false  ->  true
```

- **Run at `9b32160b0`'s files** (09:41:39Z–09:42:29Z): `tests/domain/seat/`, 6 files, 168 passed and 3 failed. CONFIRMED. At `8634e9d9d`, the same run gave 179 passed and 3 failed.
  - **The new file:** 5 of 5 green.
  - **The three reds** are all in `seatContest.test.js`, the dial's own dark pins:
    - "(5) … the dial is dark and every factor of the registered table reads 1";
    - "(5) … under the law, dark: the kind read is today's";
    - "(8) … dark: today's read … with and without the law".
  - **Not the cure's:** the same three are red on the flipped copy with the UNCURED `powerStrata.js` (`46339e5c7`'s) put back (22 passed, 3 failed, 08:25:13Z–08:25:17Z). CONFIRMED. `seatContest.test.js` imports none of the four reads.
- **The dark proof** is the integrator's.

## WORDINGS FOR THE CHAIR

The structural cure writes no new sentence. Every surface prints the holder in words it already has:
- PowerTab: "Seat held by" plus "<holder> holds the governing seat.";
- PowerStrata: the "Ruler" card and the "↑ Holds power" marker now on the holder's row;
- the governance paragraph: "<person>, <role>, holds the seat of <form>", now the holder's person.

Two surfaces are left without a word that ties the form to the holder. These drafts are NOT written into code:

1. **`PowerStrata.jsx`, the ruler card**, where the ruler is a holder apart from the form. Draft: "Holds the seat of {form}."
   - Houses: the holder (the card's subject) and the form.
   - Not chosen by a hideable house or a crime fact: the reader is refused a hidden or criminal holder, and the card then shows the form as today.
2. **`governanceAccount.js`, the seat sentence**, where the chain's faction is a holder apart from the form. Draft: "{who} holds the seat of {ruler} for {holder}."
   - Houses: the holder and the form; the person is the holder's.
   - Not chosen by a hideable house or a crime fact: the reader is refused those. Under an occupation the existing `OCCUPIED_SEAT` twin keeps its slot.
   - If it becomes a pool, it needs U6's sameness hand list.

## SHA

The work: `3060cb1ee`, `8634e9d9d`, `9b32160b0`. The report: the commit after them, named in the final message. Not pushed.
