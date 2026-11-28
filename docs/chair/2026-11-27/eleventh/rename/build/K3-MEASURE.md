# K3 MEASURE: A POWER's KIND HANGS ON ITS NAME (measure and proposal only; nothing built)

RENAME-BUILD, 2026-11-28. The tree is this branch's tip (K1, K1b and K2 in). Every count is a script's (CONFIRMED) unless marked PLAUSIBLE.

**The harness** (`tools/k3-harness.jsx`, bundled by `tools/build-k3.mjs`)
- The corpora: the first 300 of C and the first 300 of V, every size.
- Each birth is renamed twice:
  - **F, a power:** the first power of `powerStructure.factions`, which is the government in nearly every town, renamed by the product's own writer `factionRename.js :: applyFactionRenameToSettlement`.
  - **H, a house:** the first named institution, renamed by `institutionRename.js :: applyInstitutionRenameToSettlement`.
- Every view is walked as the app renders it.
- These kind classifiers log every call, with the entity's name and the verdict: `factionArchetype`, `inferFactionCategory`, `isCriminalPower`, `catalogIdForName`, `isMarketInstitution`, `institutionMatchesKeyword`, `institutionInCategory`, `isCommerceGuild`, `institutionMatchesRegex`, `facetOf`.

**The analyses**
- `tools/analyze-k3.mjs`: a moved line is one the rename moved otherwise than by the old name put to the new. It is article-aware: "the Elder Council" against "the Ashen Compact".
- `tools/attribute-k3.mjs`: each such line is put down to the source file that holds its words.
- Results: `results/K3-*.txt`.

## What a rename changes today

| | C | V |
|---|---|---|
| **F, a power's rename** (the product's own action, per RENAME-MEASURE `C-renames.md`): pages moved otherwise than by the name | **235 of 300**, 983 lines | **229 of 300**, 960 lines |
| F: the ruler kind (`facts/rulerKind.js :: rulerKindOf`) read off the new name | changed on **279 of 300** (elder -> council 240, lord -> council 33, occupier -> council 6) | changed on **288 of 300** (elder -> council 261, lord -> council 27) |
| F: any LOGGED classifier changing its verdict on the renamed power | **0** (`factionArchetype` reads the stored `category` first; 300 of 300 born powers hold one) | **0** |
| **H, a house's rename** (NO product action calls the writer: `applyInstitutionRenameToSettlement` has no caller outside its file, by grep) | 300 of 300, 3,300 lines | 283 of 300, 3,133 lines |
| H: `catalogIdForName` changing its verdict on the renamed house (`subsistence_farming` -> none) | 298 | 176 |
| H: `facetOf` (a veil reader, below) changing its verdict | **0** | **0** |

**What the record already holds beside the name**
- Powers: `category`, on 300 of 300 + 300 of 300. It is name-inferred at birth (`inferFactionCategory`, `rulingStructure.js:673`). There is no stored ruler kind and no archetype.
- Houses: `category`, `catalogId` and `tags`, on 300 of 300 each. There are no declared facets (0 of 300).
- `ADD_FACTION` (a DM's power) writes no category (PLAUSIBLE, by reading), so a DM's power has no kind beside its name.

## Every reader that reads a power's kind from its NAME

Pages are counted on the 300 + 300 where the reader's lines moved (attribution by file; the reader inside the file is PLAUSIBLE, by reading).

1. **The ruler kind, `facts/rulerKindLabel.js :: rulerKindOfLabel`, read by `rulerKindOf` over `powerStructure.government`.** The rename rewrites `government` to the new name (`factionRename.js:932`), so the kind is re-read from it. Every gate on `facts.rulerKind` follows:
   - Daily Life: `data/dailyLife/dawnWork.js` (34 pages), `commonerResentments.js` (24), `outsiderImpressions.js` (4), and the gathering-places line "the elder's door" (18, unplaced);
   - the Overview's rule clause, `summary/settlementQuickGuide.js :: scopeAgainstRule` ("run by custom more than by law", "held by clan"; about 70 lines unplaced, 3 placed);
   - the NPC role labels ("Elder", "Governor");
   - `generators/power/governanceNarrative.js` (27);
   - `governingStressVignettes.js` (4);
   - the political hooks: `data/historyData.js` (13), `coherence/hookTruth.js` (4), `data/troubleHooks.js` (5).
2. **`display/guardLineUnderTheLaw.js :: familiesHeldOf`.** It tests every power's NAME against `FAMILIES_NAMED` (`/famil(y|ies)|nobles?|nobility|clans?|elders?/`) and the noble pool's names. Defense's no-watch and quarrel lines follow (94 + 30 + 13 pages).
3. **`data/stressPowerFaces.js`**: the crisis power's face line (10 pages).
4. **The power's door id**, `faction.<slug of the name>` (`npcProfile.js:316`, `factionResponses.js:102/219`, matched by `explanation.js:412`): PDF/crisis, 412 lines. It is an identity read from the name, not a kind. A power carries no id.
5. **`factionArchetype`'s name fallback**, for a power with no mapped `category` (a DM's): no born power reaches it (0 verdict changes).
6. **The power-name pick keys A15 and A30** (RENAME-MEASURE) re-deal with the name. They are counted among the 235 and 229 pages, where they are not a kind.

**A house's name read as its kind** (no product rename reaches it):
- the name-only `catalogIdForName` call sites (`computeActiveChains.js:83/132/417`, `institutionCategory.js:53`, `institutionClassify.js:62/112`, `houseInputAtHand.js:356/358`, `seaLanes.js`, `teleportEdges.js`, `strataExistence.js`, `claimStanding.js:283`). About 20 other sites already read `catalogId ||` first;
- `facts/institutions.js :: INSTITUTION_KIND_PATTERNS` (farmland and the rest, by name);
- `dailyLife.js :: DAILY_HOUSES`;
- `tradeListDisplay.js`.

## The share veil's readers: NAMED, and the cure touches none

- `cardVeil.js :: isHideableHouse`, which reads three things:
  - `isCriminalInstitution`: `category` and `priorityCategory`;
  - `isClandestineInstitution`, through `cohesionWeave.js :: facetOf(inst, 'clandestine')`: the DECLARED facet, ELSE inference over the house's NAME, type and category (`inferFacet`, `cohesionWeave.js:421`);
  - `brokerageLegalityOf`: `serviceKeys` and `tags`.
- `cardVeil.js :: isVeiledPower`: `hidden` and `category`.
- `traditionFloor.js` (the drawn set's floor), through `isHideableHouse`.
- `galleryVeil.js`: category, facets, serviceKeys, tags and hidden.
- **The one veil reader that reads a name** is `facetOf`'s inference. It moved on 0 of 600 renames here, because no born house declares facets and no renamed house's name changed its clandestine reading. A DM renaming a house to or from a clandestine-sounding name could move its veil class. That is NAMED for the veil lane, and I propose no change to it.

## The proposal (the smallest cure; not built)

**THE RENAME WRITES THE OLD KIND DOWN BESIDE THE NEW NAME.** At its first rename, `applyFactionRenameToSettlement` writes onto the renamed power one field, `kindName`: the name its kind was read from, the old name. It is written only where absent, so a second rename keeps the first. It is read through ONE helper in a leaf, `kindNameOf(power) = power.kindName ?? power.faction ?? power.name`. Three readers move to it:
- `rulerKindOf`: the governing power's `kindNameOf`, else `government` as today. The kind travels with the power, so a coup (`transferRulingPower`) carries it with no write of its own;
- `familiesHeldOf`;
- `factionArchetype`'s name fallback.

**Optional, with the same field: the identity.** The power's door id and the A15 and A30 pick keys key on `kindNameOf`, so a power's rename re-deals nothing. This is the same choice K1 made for the town, which keys on what survives the rename.

**What it would move**
- Births: **0**, since no birth writes `kindName`.
- Pages of towns never renamed: **0**, since every reader falls back to the name it reads today.
- After a power's rename: the lines above stop moving. Expected (PLAUSIBLE, to be proven by this harness after a build): 235 and 229 pages fall to about 0 beyond the name, if the identity is keyed too, or to the door id's and the picks' pages if it is not.
- The veil: nothing (none of its readers reads `kindName`).

**Registers to name**
- `factLayers` (`rulerKind` home: `powerStructure`): the governing power is read from `powerStructure.factions`, which is the same home.
- The stable-pick-ids door, if A15 and A30 are re-keyed.

**Houses:** no product action renames one, so nothing is proposed for the product. If a house rename is ever wired, the same field and helper serve it, and the name-only `catalogIdForName` sites move to the existing `catalogId ||` idiom (0 moves on born records, whose `catalogId` is `catalogIdForName(name)` at birth, `assembleInstitutions.js:983`).
