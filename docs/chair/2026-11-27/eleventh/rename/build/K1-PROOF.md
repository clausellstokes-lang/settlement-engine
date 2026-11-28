# K1 PROOF: THE KEYS STAND ON THE ID

RENAME-BUILD, 2026-11-28. Base: 5ad631588. K1: 6e08473b6 (the test and the leaf, red first), 52d8d175a (the cure), b46004d48, d1ad508bf and 2bea7c24a (the tests re-pointed). Every count is a script's (CONFIRMED).

- The corpora are all 900 births of C and all 900 of V, every size.
- Every tab of the owner's page was walked as OutputContainer renders it, plus the PDF composers and headlines, Foundry, Tonight and Session.
- Harness: `tools/e2-harness.jsx`. Analyses: `tools/analyze-e2.mjs` (base against K1) and `tools/analyze-d2.mjs` (the renames on the first 300).
- Results: `results/E2-C.res.json`, `results/E2-V.res.json`, `results/D2-C.res.json`, `results/D2-V.res.json`.

## What K1 changed

ONE leaf, `src/domain/display/pickKey.js :: pickKeyOf(holder, fallback)`. It returns the holder's own id where the holder has one (a non-empty string), else the site's key as it was before K1. Every site reads it, and no site spells the key twice:

- **The town's name, now the town's id:**
  - Daily Life A1 to A10 (`dailyLife.js :: pickKey`, which `pickNameable` now calls too);
  - the crisis vantage A18 (`crisisSummaryForSurface`'s optional key, handed by the Defense tab, Tonight, the PDF cover and overview, and the PDF defence slice);
  - fortune A19 and A20;
  - the food-gap hook A16;
  - the overview headline A26 (`vm.identity` now carries the id).
- **The person's name, now the person's id:** the people headline A28.
- **`_seed`, now the id** (the chair's ruling K1-1 (ii)):
  - every desk seed and `printProse` (A12 to A14);
  - viability A11;
  - the arrangement A21;
  - the tradition draws A22 and A23;
  - the ring note A25;
  - the scope line A29.
- **Not changed:**
  - the fallback-only names (A11, A21, A17, A31, and A30's person part);
  - A32 and A33 (unwired);
  - A15 and A30 (power names, which are K3's);
  - A24 (the founding traditions, unit K1b: measured and STOPPED, see below).
- No site file changes its line count, because the registers cite by line.

## The proofs

| proof | C | V |
|---|---|---|
| RECORDS MOVE 0 (sha1 of every born record, base against K1) | **0 of 900** | **0 of 900** |
| every page moves once | **900 of 900**, 95,981 lines | **900 of 900**, 98,212 lines |
| by surface | tabs 900, PDF 900, Foundry 729, Tonight 225 | tabs 900, PDF 900, Foundry 720, Tonight 212 |
| a town's rename (the first 300), lines moved otherwise than by the name | 33 on **2** pages (below) | **0** |
| a person's rename (the first 300) | **0** | **0** |
| owner against a FRESH shared page after a town's rename: new differences | **0** | **0** |
| PDF Daily Life against the tab's, slot for slot | 900 of 900 the same | 900 of 900 the same |
| the id guard (`node scripts/stable-pick-ids-door.mjs`) | "the baseline matches the tree (160 scopes, 819 ids)"; no line's id or words changed | |

- The line count is larger than RENAME-MEASURE's 28,031 and 28,670, because it includes the `_seed` sites ruled in K1 (ii).
- Every size moves (150 of 150 each).
- The shared stamps differ on 900 of 900 (the share's prose is re-composed from the new keys). They are not births.

**The 2 pages of C.** They are dp-thorp-21 Ögedeidavan and dp-hamlet-49 Ögedeikum: the only towns of the 300 whose name opens on a non-ASCII letter. Their base pages LACK whole desk blocks, which the rename to "Quillmarsh" restores: Power's "The shape of authority" and "Rule and succession", a History line and an Economics line.
- No pick key holds the name any more, so this is not a re-deal. It is an older, separate defect: a name opening on a letter outside ASCII suppresses lines.
- PLAUSIBLE: an ASCII `\b` somewhere in a desk's guard. Not chased; it is named for the chair.

**The imported copy** (ten towns of C, every tab walked, `results/BR-*.analysis.txt`):
- The JSON import moves 480 lines on 10 of 10 pages on the base, and 107 lines after K1, all of them on World/Traditions (A24, unit K1b).
- The gallery import keeps, besides those, only the public projection's own losses.

## The tests (CONFIRMED)

- **`tests/domain/renameKeepsThePage.test.js`:** RED on the base (arms b, c and d failed), GREEN on K1 (5 of 5).
- **The 144 test files that name a re-keyed function:** 30 went red on K1, and 3 more fail identically on the base. All 30 are re-pointed with their meaning kept, each change commented in place; the ledger is `K1-REPOINTS.md`.
- **The 345 further test files that render the sites:** 1 more re-pointed, `servicesImpairedHouseLine`. 5 fail identically on the base. `safetyReaderBytes` is red on the base by 3,139 rows and K1 moves 35 more: a byte record with its own door, NAMED and not re-recorded.
- **The mutants:** K1 reverted, the re-pointed files go red, 29 of 36. The other 7 are killed by a mutant each (the vantage key dropped or shifted, the tradition key on the name, the arrangement on a constant), except two whose claims hold on every key (`r3cRekeyedLinesTrue`, `smallPlaceTierNoun`). See the ledger.
- **The gates:** `typecheck:ratchet` and `typecheck:domain:strict` at their ceilings; `npx eslint` on the files clean.

## Registers, goldens, sizes

- **Registers:** no register is moved by K1. The stable-pick-ids door matches.
- **Goldens:** none re-recorded. `dossier-prose-manifest-golden` (red on the base) would move under K1, since every desk now draws on the id (PLAUSIBLE). Also red on the base, and unchanged by K1: generatorGoldenMaster, generatorGoldenMasterLit, dmLayerGoldenIsolation and editCorpusRatchet.
- **Sizes:** not measured. The first paint gains one 1.4 KB leaf with no import, and every site's edit is in place.

## Named, not changed

- **Shared stamps saved before K1** keep their old desk lines until the next save, because `PUBLIC_PROSE_VERSION` is not bumped. This is the chair's ruling K1-1 (iv); it is named for the share lane (A18).
- **A24, unit K1b:** STOPPED. Under the re-key, `tests/security/traditionDescriptionSharedPage.test.js` goes red on 13 of 61 cases:
  - CTR9's line 144 asserts the old defect;
  - 12 arms are seed-pinned controls.
  It awaits the chair's word.
