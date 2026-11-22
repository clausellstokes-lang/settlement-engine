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

### A judgment for the chair: how I read "the holder's person" (SUPERSEDED by the chair's E70, item 2: see the last section)

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

---

## THE CHAIR'S E70 (10:26Z): THE FOUR ITEMS, BUILT on top of `0b3ed8802`

The new commits are `6aadcb7fe` (items 2, 3 and 4) and `1e028c69d` (item 1, `U7-OWNER-VIEW.md`); the report commit follows them. Every claim below is CONFIRMED by run unless it is labelled.

### Item 1: `briefs/U7-OWNER-VIEW.md`

- **What it holds:** three lit places, each with the ruler card and the governance paragraph as printed, dark beside lit:
  - `u7p-town-8` at birth (R2);
  - `u7p-town-2` at birth (R3);
  - `u7p-metropolis-15` after the DM's transfer.
- **How they were read:** off `ThePowers` over `derivePowerStrata`, and `governanceAccountRead`, by a scratch test that was never committed. It ran in a dark copy of the clone and in the flipped copy (10:39:55Z–10:40:16Z).

### Item 2: THE PERSON IS ALWAYS OF THE HOLDER'S HOUSE (`powerStrata.js :: holderPersonOf`) (SUPERSEDED by the chair's E76 and E77: see the last section)

- **The rule now:** `holderOf`'s person where it is of the holder's house (any rank); else the holder house's first, by today's ladder rule, then the roster rule (`holderFaceOf`). This replaces my "first of a third house" reading.
- **Arm 1b** now pins `u7p-town-2` (R3): Beatrix Eisenberg leaves the chain for **Ulrike Goldstein**, the Merchant Guilds' first.
- **What it moves on the lit pool** (flipped copy, 160 births, reader audience, 10:49:02Z–11:04:43Z):
  - **Births:** the person moves on **24** births, all R3.
  - **For the chair:** on **3** of those (`u7p-town-39`, `u7p-city-2`, `u7p-city-8`) the holder's house has no rank-1 face. The chain then names nobody and prints its absence line. `seatHolderFindings` raises `seat_unfilled` there.
  - **Findings at birth:** 4 births change their findings in all. The fourth is past the probe's example cap and unnamed.
  - **Kept-form transfers:** the person moves on exactly the six, with no finding.
  - **Faction and ruler entry:** unchanged from before: 112 births and 10 transfers.
- **The readers of `holderOf(…).person` in `src`:** exactly ONE, `dossier/powerStrata.js :: rulingHouseApartOf`, which hands it to `holderPersonOf`. `rulingPowerCoup.js :: coupContenders` reads `holderOf(…).holder` only. `seatCircumstances.js` and `rulingPower.js` name it in comments. PLAUSIBLE: grep and read.
- **What prints on the six after U7** (lit, `bu7work/ownerview-flipped*.json`). Cured nothing outside the manifest.
  - **Shows the holder's person, on all six:**
    - the "Who runs this place?" chain (`rulingChainOf`);
    - the governance paragraph (it names the new person and never the old);
    - the tonight sheet's seat row (`why: 'seat'`);
    - the crisis cast's seat row (it reads the chain; PLAUSIBLE: read);
    - the ruler card (the holder).
  - **Still shows the OLD house's person, through other reads than `holderOf(…).person`:**
    - **The tonight sheet's hooks.** On 4 of 6, a hook's `source` is the old person (`metropolis-15/21/26/28`). It names them as the hook's source, not as the seat's holder; I did not read the hook text.
    - **Institutions: the seat house's face.** On `u7p-metropolis-15`, the Democratic assembly's face is still Dietrich Engel. The path is `InstitutionsTab.jsx` and `crisisCast.js`, through `seatHolder.js :: seatHouseFaceOf`, which calls `seatCandidatesOf`.
    - **The old person's own card.** It still wears the office: "the exchange master and Lord Mayor", "the smelt master and Mayor" (`cardPowers.js :: cardHatsOf`, read off the card's office). So a people page can still call the old house's person the Mayor. PLAUSIBLE that the People tab prints it; `cardHatsOf` was run.
    - **The engine's seat read.** `seatCandidatesOf`'s first is still the old person on all six; its reader in `src/generators/npcStructure.js` is generation-time.
  - These are the cast's, not the seat chain's: the cast change after a transfer (CS8's neighbour, `holderOfSeat.js`'s header). They are outside the manifest.

### Item 3: `coherence/seatHolderFindings.js :: seatHolderFindings`

- **The cure:** under the seat law, where the chain's faction is a holder apart from the form, `seat_outside_governing_faction` checks the chain's person against the HOLDER. The detail names the holder. Elsewhere it reads as before.
- **Red first** (arm 5, 10:35:47Z–10:36:29Z, before the cure): "6 of 6 case(s) failed", each on `expected [ 'seat_outside_governing_faction' ] to deeply equal []`.
- **Green after.** The converse still raises it: the holder's top ladder rung is named for the old house's person, so the chain names that person and the finding reads `{ code: 'seat_outside_governing_faction', detail: '<old person> is not of Merchant Guilds' }`, on all six.
- **Covered beside it:** the finding joined the `reads()` differential, so law 1 (arm 3) and the veiled holder (arm 2) hold it at today's.

### Item 4: the chair's caption, "Holds the seat of {form}."

- **The data:** `derivePowerStrata` sets `seatOf` (the form) on the ruler entry only where the holder stands apart. It is never set for a holder veiled to the reader, who is then not the ruler.
- **The card:** `PowerStrata.jsx :: ThePowers` prints `Holds the seat of ${powerNameInProse(p.seatOf)}.` under the holder's card, through `governanceAccount.js :: powerNameInProse`, the paragraph's own helper. PowerTab already reaches `governanceAccount.js` through `powerDeskRead.js`, so the import adds no edge on that path; `engineCoreLazyEdge` is green.
- **No governance sentence was written.**
- **Arm 6** renders `ThePowers` (`renderToStaticMarkup`):
  - on `u7p-town-8` after the transfer it prints "Ruler Merchant Guilds … Holds the seat of the Town Mayor.";
  - a hidden holder gets today's card exactly (Ruler Town Mayor, no caption), and so does the record under law 1.
  - Red without the caption (the flipped copy with `0b3ed8802`'s `PowerStrata.jsx`, 10:48:07Z–10:48:23Z); green with it.

### GREEN at `1e028c69d`'s files (shared tier, `--maxWorkers=2`, 10:41:43Z–10:47:24Z)

- **The run:** `tests/domain/seat/` whole, plus every test file outside `tests/lint` that names `powerStrata`, `PowerStrata` or `seatHolderFindings`. That is 34 files: 376 passed, 1 failed.
  - `tests/domain/seat/`: `holderOfSeat` 51, `seatChainHolder` **7**, `seatContest` 25, `seatLawSavedTown` 6, `seatTable` 45, `seatTransfer` 39.
  - Newly in the set, all green: `dossierLabelCase` 14, `institutionLinkBlockContainer` 5, `powerSeatHeading` 3, `tailDisplayCivicBatch2` 2, `deepCraftKillList` 4, `coherenceBattery` 7.
- **The one red is MINE, and STOPPED by symbol (outside the manifest):** `tests/components/phoneChromeFloor.census.test.js` :: "THE PHONE CHROME FLOOR … each surface matches its registry row".
  - **The figures:** `/create` floored 620 → 621, `/settlements` 863 → 864, `/gallery` 665 → 666.
  - **The cause:** the caption, one new floored line (`proseFontSize`, not a bare size): a count, not a breach.
  - **Proven by run:** the same census on a dark copy with `0b3ed8802`'s `PowerStrata.jsx` is 9/9 green (10:47:47Z–10:47:55Z).
  - **The cure:** the census's own door re-records `ROUTE_BASELINE` with the cause named. It is the integrator's, like the line's own row for point 88.
- **eslint** on all four files: exit 0.

### THE FLIPPED COPY at `1e028c69d`'s files

- **Its diff from the clone:** exactly the two dials.
- **The run** (10:48:23Z–10:48:51Z): `tests/domain/seat/`, 170 passed and 3 failed.
  - The new file: 7/7.
  - The three reds are the same `seatContest` dark pins as before, red without the cure too.

### `tests/lint` WHOLE at the E70 tree

Run once at `1e028c69d`'s files (shared tier, 11:05:12Z–11:28:33Z). CONFIRMED.

**Totals:** 223 files, 3,352 tests (3,347 passed, 5 failed).

**The line's own reds and the clone's environment, as before:**
- `proseComposed.walker` (A0b, 2322 against 2103);
- `proseCorpusBytes` (RAW, GZIP);
- `ledgerCitationIntegrity` fails to load (no `review-fixes-2026-07-08` ref in the clone).

**Mine, as before; the integrator's door:**
- `sovereigntyLightingContract.walker` :: "THE CENSUS IS AN ASSERTION …": 3749 against 3748, from the one new test file.
- The cure is to re-freeze `tests/lint/.lighting-census-baseline.json`.

**NEW, and mine (the caption); STOPPED by symbol, outside the manifest:**
- **The red:** `tests/lint/proseNumerics.test.js` :: "path + line + category + snippet debt exactly matches the committed baseline".
- **The cause:** the caption's 8 lines in `PowerStrata.jsx` move that file's three frozen rows in `tests/lint/.prose-numerics-baseline.json` down by 8:
  - lines 277 and 279 (`` `${r.name}: ${pct} percent (power ${r.power})` ``, `{pct}`) to 285 and 287;
  - line 331 (`{r.power}`) to 339.
- **No numeric is added:** the caption carries none, and the count stays 184 on both sides.
- **Proven by run:** the same test on a dark copy with `0b3ed8802`'s `PowerStrata.jsx` is 29/29 green (11:29:27Z–11:30:09Z).
- **The cure:** regenerate the baseline by its own door and review the three moved rows. That file is the integrator's.

**Outside `tests/lint`, also the integrator's:**
- `tests/components/phoneChromeFloor.census.test.js` (above): +1 floored line on `/create`, `/settlements` and `/gallery`.

---

## THE CHAIR'S E76 (THE MEASURE) AND E77 (THE BUILD), on top of `fb0c732f9`

The new commits are `45d4a2f1e` (the page, U5-STALE, the self-check, the tests), `d83ae13cc` (the owner view re-read), `5329459ac` (U5-STALE narrowed to the old house's person) and `0a5620d14` (types, not casts). The report commit follows them. Every claim below is CONFIRMED by run unless it is labelled.

### E76, THE MEASURE (11:47:01Z–11:56:39Z, throwaway `bu7work/officeperson.mjs`)

- **All 24 are bucket (i).** Each R3 birth's hat-wearer is the form's rank-1 card, the only card wearing an office hat, and belongs to no other house. (ii) 0, (iii) 0.
- **The "nobody" births are four:** `u7p-town-39`, `u7p-city-2`, `u7p-city-8`, `u7p-city-25`. All four are in (i).

### E77 (1): THE PAGE READS ONE FACT (`powerStrata.js :: rulingChainOf`)

- **The rule:** where the holder stands apart, the chain's `npc` is the record's hat-wearer (`holderOf(…).person`) by both hats, and nothing else.
- **Removed:** `holderPersonOf`, `holderFaceOf` and the ladder read for a holder apart. Where nobody wears the hat, today's absence line stands.
- **On the lit pool** (flipped copy, 160 births, 12:50:35Z–12:51:15Z): the chain's person moves on **0** births, and no finding changes. The faction and the strata ruler move on 112, as intended. The four "nobody" births name their office person again.

### E77 (2): U5-STALE (`rulingPower.js :: transferRulingPower`, the kept-form branch only)

- **The hat** is the form's rank-1 membership plus the office word on the wearer's `role`.
- **Who loses it:** the OLD HOUSE's person, meaning a wearer who is also the first (rank 1) of a third house, neither the form nor the winner. That card loses the hat: its membership in the form goes, and its role becomes its house title.
- **Who takes it:** the winner's first (its rank-1 card, not ousted). It gets that membership, and the old office word where the old role carried one.
- **A judgment for the chair, forced by U5's own arms:** a wearer who is no other house's first is the OFFICE's own person and keeps the hat. That is a crown's sovereign, or a council's own Mayor.
  - My first cut moved every wearer. It reddened `seatTransfer.test.js` (3) and (9), CS22 (c): the crown passed to the taker's keeper, whom `holderOf` refuses, so nobody wore it.
  - It also reddened (6), "every card unmoved", on a council whose office held itself.
  - A name guard on Royal Authority reddened `seatTable.test.js` (2), "rulingPower.js spells none of its forms".
  - The narrowed rule matches the chair's words ("the old house's person") and keeps all three arms green.
- **What the transfer does where the holder's house has no first:** the old house's person still loses the hat and nobody takes it. `seatCandidatesOf` is then empty, the chain prints "No named seat-holder stands in the record. The chain ends, honestly, at the power." and `seatHolderFindings` raises `seat_unfilled` (arm 7, a planted headless Merchant Guilds).
- **Where nobody wore the hat before the transfer:** nothing moves.
- **Law 1 is untouched:** `kept` is false there. Arm 7's dark control finds the cards byte-identical after the same DM transfer.
- **What U5-STALE does not move:** the cards' `power`, `influence` and seat prose (`structuralPosition`, `activeConstraint`: "Holds the seat in good years … Still the smelt master as well." stays on the old card). Moving those is a draw or a wording, which needs a ruling.
- **First-paint risk (PLAUSIBLE, the integrator's dark proof):** `rulingPower.js` is in the eager first-paint closure. The added code is 1,200 bytes of unminified source (comments excluded; measured by `git diff`), inline and terse, but `verify:dist`'s closure budget is unmeasured here (no build).

### E77 (3): RED FIRST, then GREEN (`tests/domain/seat/seatChainHolder.test.js`, 9 tests)

- **Red against `fb0c732f9`'s source** (12:25:58Z–12:26:20Z):
  - **Arm 1, the six through U5-STALE:** "6 of 6 case(s) failed" (e.g. "the record's hat-wearer: expected 'Judith Weber' to be 'Felix Naumann'").
  - **Arm 1b, the 24 as ONE differential:** "24 of 24 case(s) failed". The four nobody cases read `expected undefined to be 'Ottilia Vogel'` and so on.
  - **Arm 2, the veiled holder:** 2 of 2.
  - **Arm 7, the headless holder:** red.
- **Green after:** 9 of 9.
- **What arm 1 asserts, per seed by literals:** the hat-wearer; the holder's first holding rank 1 in the form; its two hats ("the senior guild master and Mayor", "… and Speaker of the Assembly", "… and Lord Mayor"); the old card's lone house title; the old person leaving `seatCandidatesOf` (`expectPresentThenAbsent`); and the surfaces:
  - the chain;
  - the Institutions seat-house face (`seatHouseFaceOf`);
  - the tonight sheet's seat row;
  - the ruler entry.
- **Arm 1b:** each of the 24 names its office person by a literal, equal to the law-1 read of the same record.
- **Arm 5:** no finding on the six. The converse runs on `u7p-town-1` (R4), whose top rung is named for Martin Schäfer, of the Merchant Guilds alone; it gives `seat_outside_governing_faction`, "Martin Schäfer is not of Town Council".
- **`seatHolderFindings`:** under the law, the person may be of the holder OR the form (the hat), so an R3 birth raises nothing false.

### THE TONIGHT SHEET'S HOOK SOURCES: NOT by construction

- **The measure, at `45d4a2f1e`'s files:** on 4 of 6 the old house's person is still a hook's `source` (`metropolis-15/21/26/28`).
- **Why:** the hooks are each card's own `plotHooks`, ranked by the card's drawn `power`, which U5-STALE does not move (Dietrich Engel 10 against Josefine Wolf 8). The hooks are their own trade stories ("evidence of price-fixing …", "a family they put out of business …"). None speaks of the seat.
- **For the chair:** the sheet follows the hat only if the hat carries the power band (`people/castPowers.js :: raiseToOfficeBand`, U6's file). That is a draw, not a re-hat.

### THE OWNER VIEW (`U7-OWNER-VIEW.md`, re-read at `45d4a2f1e`, then again at `5329459ac`: the same bytes)

- **Place 2** (`u7p-town-2`): the chain names Beatrix Eisenberg again; only the ruler and the caption move.
- **Place 3** (`u7p-metropolis-15`): Josefine Wolf now wears "Speaker of the Assembly". The paragraph names her by both hats.
- **Place 1:** unchanged.

### GREEN at `5329459ac` (shared tier, 12:41:22Z–12:49:32Z), and the same result again at `0a5620d14` (13:20:57Z–13:29:27Z)

- **The set:** `tests/domain/seat/` whole, every test file outside `tests/lint` naming `powerStrata`, `PowerStrata` or `seatHolderFindings`, and every test file naming `rulingPower.js`. That is 65 files: **1,020 passed, 1 failed, 28 skipped** (`vendorPdfLazy`'s dist-reading arms, gated on `VERIFY_DIST=1`; no build).
- **The counts:** `architecture/engineCoreLazyEdge.test.js` 3, `build/vendorPdfLazy.test.js` 55, `design/deepCraftKillList.test.js` 4, `data/cultureOfficeTitles.test.js` 21, `components/dossierLabelCase.test.jsx` 14, `components/editNamesFactionRoster.test.jsx` 10, `components/engineSections.test.jsx` 9, `components/institutionLinkBlockContainer.test.jsx` 5, `components/phoneChromeFloor.census.test.js` 9, `components/powerSeatHeading.test.jsx` 3, `components/powerSeatRender.test.jsx` 5, `components/powerStrata.test.jsx` 8, `components/powerTabSupport.test.jsx` 19, `components/seatHolderOnThePage.test.jsx` 3, `components/seatWordsOnce.test.jsx` 8, `components/tailDisplayCivicBatch2.test.jsx` 2, `generators/bar3PeoplePowers.test.js` 5, `generators/census5bOffCensusDeclarations.test.js` 17, `generators/densityLaw.test.js` 151, `generators/terrainPoolsSeat.test.js` 2, `pdf/pdfParityFixes.test.js` 18, `domain/coherenceBattery.test.js` 7, `domain/editPools.test.js` 17, `domain/factionNamePrecedence.test.js` 10, `domain/factionRename.test.js` 22, `domain/ladderTopRungLeader.test.js` 3, `domain/occupationLiberationUninstall.test.js` 21, `domain/personaSlicerFactionRoster.test.js` 11, `domain/powerProseNameInSentences.test.js` 12, `domain/religionLegitimacyFactionKey.test.js` 10, `domain/rulingPower.test.js` 22, `domain/rulingPowerDoor.test.js` 2, `domain/settlementStrategy.test.js` 25, `domain/subsystemRowsVirtual.test.js` 14, `domain/treasury.test.js` 75, `domain/warMachineObeysPolitics.test.js` 25, `domain/warPeaceDecision.test.js` 18, `domain/warSeatBooksFactionAddress.test.js` 14, `property/oathHolderDormancyFence.test.js` 12, `security/traditionDescriptionSharedPage.test.js` 50, `ui/compendiumPowerExtras.test.jsx` 3, `store/factionRenameConvergence.test.js` 9, `generators/people/castDerived.test.js` 6, `generators/people/castPowers.test.js` 13, `generators/people/nobleFaces.test.js` 3, `generators/people/powersDualHat.test.js` 4, `generators/people/powersOnThePage.test.js` 6, `generators/people/representatives.test.js` 5, `generators/people/seatHolderCard.test.js` 6, `generators/people/seatKeeperContender.test.js` 3, `generators/people/stressPowersFaced.test.js` 4, `generators/people/successionClaimants.test.js` 6, `generators/power/bar2PeoplePowers.test.js` 11, `domain/dossier/criminalHouseNoDefault.test.js` 2, `domain/dossier/powerSupport.test.js` 28, `domain/dossier/seatHolder.test.js` 13, `domain/facts/rulerKind.test.js` 2, `domain/people/dualHatReaders.test.js` 5, `domain/people/seatKeeper.test.js` 4, `domain/seat/holderOfSeat.test.js` 51, `domain/seat/seatChainHolder.test.js` 9, `domain/seat/seatContest.test.js` 25, `domain/seat/seatLawSavedTown.test.js` 6, `domain/seat/seatTable.test.js` 45, `domain/seat/seatTransfer.test.js` 39.
- **The one red:** `phoneChromeFloor.census`, my caption's +1 floored line (unchanged from E70). It is the integrator's re-record.
- **RED-AT-LINE:** read from the scratchpad's `RED-AT-LINE.tsv` (63 rows, the eighth chair's amendment). `origin/lane/chair-2026-11-08` is not in the clone, and fetching it would run git against the read-only checkout.
  - It names `vendorPdfLazy` (4 rows); they did not run (skipped without `VERIFY_DIST`).
  - It names `phoneChromeFloor.census` (1 row, the line's own +1). This run measures one more line, mine.
- **eslint** on the five files: exit 0.

### THE FLIPPED COPY at `5329459ac`'s files (12:50:04Z–12:50:28Z), and the same 172/3 at `0a5620d14`'s files (13:29:42Z–13:30:06Z)

- **Its diff from the clone:** exactly the two dials.
- **`tests/domain/seat/`:** 172 passed, 3 failed.
  - The new file: 9/9.
  - The three reds are `seatContest`'s dark pins, as before.

### THE TYPECHECKERS (run for the first time in this lane, at `0a5620d14`'s files, 13:19:20Z–13:20:37Z)

- **The results:** `npm run typecheck:ratchet` OK (167 errors, ceiling 167); `npm run typecheck:domain:strict` OK (1113, ceiling 1113). Both read through `scripts/gate-tail.sh`, at the gates' own exit codes.
- **What `0a5620d14` cured,** found on the way:
  - TS2322 in `powerStrata.js :: rulingChainOf` (the npc's `via`, typed now);
  - 5 `any` casts in `rulingPower.js` (a local `HatCard` typedef now).
- **PLAUSIBLE (read, not re-run):** the TS2322 shape (an npc typed `'roster'` and then assigned `'ladder'`) dates from `3060cb1ee`, so the earlier U7 commits were likely red on both ratchets.

### `tests/lint` WHOLE at `0a5620d14`'s files (shared tier, 13:30:06Z–13:52:34Z)

**Totals:** 223 files, 3,352 tests (3,347 passed, 5 failed).

**The line's own reds and the clone's environment, as before:**
- `proseComposed.walker` (A0b, 2322 against 2103);
- `proseCorpusBytes` RAW and GZIP;
- `ledgerCitationIntegrity` fails to load (no `review-fixes-2026-07-08` ref in the clone).

**Mine, and the integrator's to re-record** (each shown green without my change earlier in this report):
- **`sovereigntyLightingContract.walker` (the census, 3749 against 3748):** the one new test file.
- **`proseNumerics.test.js`:** the caption moves `PowerStrata.jsx`'s three frozen rows down by 8 (277 to 285, 279 to 287, 331 to 339), with the same snippets and the same count, 184.

**A red I caused and cured on the way:** an earlier whole run (12:52:13Z–13:15:58Z, at `5329459ac`) also failed `domainAnyCastBaseline.test.js` (4 arms) on `rulingPower.js`'s 5 `any` casts. `0a5620d14` cured it, and it is green above.

**Outside `tests/lint`, also the integrator's:** `tests/components/phoneChromeFloor.census.test.js`, +1 floored line on three routes (the caption).
