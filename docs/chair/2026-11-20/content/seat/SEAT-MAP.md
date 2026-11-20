# SEAT-MEASURE — deliverable 2: THE MAP OF WHAT DEPENDS ON IT, and THE OPTIONS (written 2026-11-20T04:35Z, corrected 04:58Z for the birth law, base `85fccf898`)

> The chair's three added questions (the birth-law gate, where a true holder could live, the smallest stored change) are answered in `SEAT-GATE.md`.

Everything here is **read, not executed** (by symbol, at the base), except where a figure cites `count-*.md` and the name readings in §1, which were executed (`inferFactionCategory` → `factionArchetype` → `rulerKindOfLabel` on twelve names: Royal Authority, Noble / Ducal Governorship and Feudal Stewardship read government; Guild Council, Guildhall Council and Craft Guilds read merchant; Workers' and Commons Assembly read government; Foreign Administration reads government kind and *occupier*; Journeymen's League reads other). The two changes:
**(a)** a birth path can seat a ruling body for craftsmen, labourers, nobles as a class or outsiders;
**(b)** the contenders are chosen by weights that the town's own circumstances shift.
**Breaks** = something becomes wrong or a gate goes red. **Moves** = output changes and is re-recorded.

## 1. Generation: what is derived from the government name or kind

| consumer (symbol) | what it reads | (a) new birth bodies | (b) circumstance weights |
|---|---|---|---|
| `power/rulingStructure.js :: generatePowerStructure` (`chooseGoverning`, `governanceLabelMap`, the tables `govDescByLabel` / `govDescByFaction`, the `govPower` lists, `merchantGoverns` (+25% merchant power), `nobleGoverns` / `merchantAligned` (noble prose), `militaryDescFinal`, `militaryCap`, `religiousDesc`, `arcaneAdjPower`, `informalModifier`) | the governing **name**, by exact string or `includes` | **the change site.** A new name falls to the defaults (`govPower` base+2; the description falls to `GOV_DESC_OF_UNNAMED_SEAT` / 'Mixed Council': "This body holds the seat of government here."). It moves, and needs authored description, power and modifier rows. | untouched |
| `power/factionCategories.js :: inferFactionCategory` → `factionArchetypes.js :: factionArchetype` (category wins) | the name's **words** | **⚠ breaks silently.** The names `rulingPower.js :: GOVERNMENT_PREFERENCES` already holds would be mis-kinded: *Guildhall Council* reads economy → **merchant**; *Workers' Assembly*, *Commons Assembly* and *Foreign Administration* read **government**. That is already true today of Royal Authority, Noble / Ducal Governorship and Feudal Stewardship (counted: 103 noble-named seats, 15 read noble). A born body must have its `category` stamped, as `rulingPower.js :: transferRulingPower` already stamps `seatCategory`. | the same reading decides each contender's factor. Born Craft Guilds read **merchant** (0.95), not craft (0.85). |
| `power/rulerKin.js :: drawCouncilOfAKind` (`rulingKindOf`, `lacksHouse` → `people/representatives.js :: hasHouseOfKind`) | the kind of the chosen name; whether an open house of that kind stands | **⚠ breaks for labour and outsider.** `dossier/powerSupport.js :: RULER_KINDS` holds religious, military, merchant, arcane, noble and craft only, so a labour or outsider seat has no house test. It would be born with no house its leader comes from, against the owner's dual-hat law of 2026-11-11 quoted in `rulerKin.js`. Craft and noble pass through the test as written. | untouched |
| `power/rulerKin.js :: settleHouselessPowers` (called by `density/applyDensityLaw.js :: resizePoliticalRoster`) | the ruler's backing kind against each power's | **moves.** Under a craft seat, a Craft Guilds that no house backs **folds into the ruler** (its power added to the seat, its row removed). Under a noble-as-class seat, the Noble Houses / Families row folds the same way. | untouched |
| `power/governanceNarrative.js` (`FORMAL_AUTHORITY_LABELS`, `deriveBaselineConflict`'s `seatIsReligious` (a name regex) and `seatIsMilitary` (category), `deriveCouncilLabel`, `buildBetrayalNarrative`'s `hasRoyalAuthority`) | the name and the category | moves: stability and conflict lines fall to their civic defaults for an unlisted name | untouched |
| `power/claimStanding.js :: settleClaimsToLabel` | the label's words against the roster's claims | moves: a new label needs its claim words or its desc may claim what the roster denies | untouched |
| `people/representatives.js` (dual hat) + `data/officeTitles.js :: OFFICE_TITLES` | government name → leader's title | moves. Guildhall Council / Guildmasters' Moot / Grand Guild Assembly have titles. *Workers' Assembly*, *Commons Assembly*, *Foreign Stewardship / Administration* and *Noble Regency* have none and fall to `CIVIC_OFFICE_BY_SIZE` (Mayor) | untouched |
| `domain/facts/rulerKindLabel.js :: rulerKindOfLabel` → `facts/rulerKind.js :: rulerKindOf` → `coherence/hookTruth.js`, `summary/settlementQuickGuide.js`, `summary/tonightSheet.js`, `display/defenseDisplay.js`, `people/rareSecrets.js`, `facts/factsOf.js` / `factVocabulary.js` | the label's words → elder / lord / priest / mayor / occupier / council | moves. A guild or workers' body reads **council**. ⚠ *Foreign Administration* reads **occupier** (`\bforeign\b`), so the hooks and the quick guide would call a creditor's administration an occupation. | untouched |
| `power/factionStanding.js :: annotateFactionStanding` | `coupContenders` + `coupRiskLabel` at birth (`contestedBy`) | moves (the standing sentence) | **moves a STORED birth field**: `powerStructure.factions[].desc` ("contested by …") |
| `people/castPowers.js :: contendersOf` (the vacancy keeper's ranks, `keeperLeavesTheContest`; the lordless noble mint) | `coupContenders(...).challengers` at birth | moves | **moves stored people**: `npcs[].memberships` ranks and minted lords in vacant-seat towns |
| `power/economyReconciliation.js` | replays `generatePowerStructure` | moves with it (one law) | — |

## 2. Display: the tabs and the SHARED pages

| reader | draws | (a) | (b) |
|---|---|---|---|
| `dossier/powerStrata.js :: derivePowerStrata` / `rulingChainOf` / `deciderOf` → `components/new/tabs/power/PowerStrata.jsx`, `tabs/PowerTab.jsx` | the ruler (name, archetype chip), the contenders with weights, the ruling chain | moves (the archetype chip shows the mis-kinding above) | moves (who is listed as a contender) |
| `components/dossier/EngineSections.jsx` (the coup risk panel), `components/new/powerDeskRead.js` (desk), `display/stateProse/printProse.js` + `powerStateProse.js` (print / PDF) | `coupContenders` + `coupRiskLabel` | moves | moves (Stable / Holding / Contested / Critical); `tests/pdf/statePrintParity.test.jsx` pins the parity, not values |
| **SHARED**: `PublicDossierView.jsx` (the gallery's public page) and `PartyLinkView.jsx` (the party link) mount the same `OutputContainer` read-only | everything above | moves | moves |
| **SHARED, STORED**: `components/new/publicProseCompose.js` writes `publicProse.blocks.power:desk.*` at save (successionRisk, legitimacy) | the desk read | moves on the next save | moves on the next save |
| the gallery tile column `government_type` (migration 147 :: `_gallery_public_tile_rows`) | `powerStructure.government` | moves: new values in a public column | — |

## 3. The simulation

| consumer | reads | (a) | (b) |
|---|---|---|---|
| `worldPulse/coup.js` → `rulingPowerCoup.js :: resolveCoupVerdict` (winner ∝ weight) → `rulingPower.js :: transferRulingPower` (`GOVERNMENT_PREFERENCES[archetype]`, `resolveGovernmentLabel`, stamps `category`) | contenders and the winner's archetype | the coup **already** names craft / labour / outsider governments. But a Craft Guilds that wins today becomes a **Merchant City Council**, because it reads merchant. | **moves every future verdict**, live campaigns included: a coup still brewing resolves on live state at its verdict tick (`stressorDynamics.js` says so). Verdicts already applied are stored events and do not move. |
| `worldPulse/stressorGates.js` (the coup's spawn gate: no challengers, no coup), `worldPulse/stressorDynamics.js` (`COUP_VARIANT_BY_ARCHETYPE`, keyed by the leading contender) | the challenger set; the leader's archetype | variant: craft / labour / outsider have **no row** and fall to `palace_coup` (a guild-led plot called a palace coup). It moves, and needs rows. | moves which towns can brew a coup, and its variant |
| `worldPulse/convergence.js`, `worldPulse/irregularForce.js`, `worldPulse/deploymentReturn.js`, `region/contestOverThirdParty.js` (its own ceiling) | `coupContenders` / `resolveCoupVerdict` | moves | moves; `tests/domain/irregularForceDormancy.byteIdentity.test.js` holds only while its flag is dark |
| `worldPulse/disposition.js` (war layer, dormant for legacy campaigns) | **`COUP_COERCION`** re-centred on the **governing** archetype | moves (noble seats read government today) | **⚠ breaks the war layer** if circumstances are put INTO the `COUP_COERCION` table. Keep the table; apply the circumstance as a separate factor inside `coupContenders`. |
| the adjustment budget (`resolveCoupVerdict`, asserted at `tests/domain/foreignSeatCoupAdj.test.js`, 0.815 of 0.82) | the pHold adjustments | — | not touched: weights move `share`, not an adjustment |
| `density/densityAscension.js :: planSeatAscension` | the power that took the seat | unwired (no importer). ⚠ Corrected 04:58Z: the dial is **lit**, since Register VII was signed and made live (`daed2bf56`), so for a v2 world it would plan rather than return `dormant_law`. Nothing calls it. | unwired |
| `density/successionGrammar.js`, `density/titularSuccession.js`, `worldPulse/lineageClaim.js`, `worldPulse/warSeatBooks.js` | the governing row | moves | — |

## 4. The share veil (read on origin/lane/veil-21-2026-11-20 at `fa97f71b0`, `src/domain/veil/rosterChoiceRegistry.js`)

The registry **names**:
- `power.entry`, `power.composition` (diffuse), `power.share`, `power.desc` (composed, withhold), `power.label`, the legitimacy rows, `power.stability`;
- `tile.governmentType` (diffuse: *"its source differed in none of the four runs"*);
- among its chooser sites: `rulingStructure.js :: generatePowerStructure` and `captureClimateOf`, `factionArchetypes.js :: NAME_RULES`, `representatives.js :: hasHouseOfKind` (rows `people.card` only), `castPowers.js :: landMemberships` / `seatStressPowers`, and `powerSupport.js :: houseBacksOf`.

It names **no row** for `powerStructure.government` or `governingName` as such, and none for the contender list, which is derived on read and never stored except through the birth writers in §1.

**⚠ The most likely break here.** `drawCouncilOfAKind` already makes the government name a function of which houses stand. A craft or noble-class body born on a house would widen that. A hidden house could then change `government`, the tile's `government_type`, `power.desc` (through `contestedBy`) and the cast. The registry records the government as diffuse on four runs, and it ties `hasHouseOfKind` to `people.card` alone. (a), and (b) wherever a weight reads a house-backed fact, need the veil lane to re-measure those rows.

## 5. The stored figures that would move

- **The golden master** (`tests/property/generatorGoldenMaster.test.js`, `tests/helpers/goldenMasterCorpus.js`: 525 configurations). (a) moves every row whose seat changes, plus their cascades: desc, stability, cast, titles, conflicts. That is one cause, one signed golden-door member. (b) moves rows through `annotateFactionStanding`'s `contestedBy` desc and `castPowers`' contender reads, again one cause. `tests/property/dossierProseManifest.test.js` (the same corpus) moves with both.
- **Seeded tests that pin a seat or a field**: `tests/generators/densityLaw.test.js`, `tests/components/powerStrata.test.jsx`, `tests/generators/nobleLineNamesTheSeat.test.js`, `tests/generators/hookTruthAtBirth.test.js`, `tests/data/foundingSeeds.probe.test.js`, `tests/domain/people/dualHatReaders.test.js` (they generate). The ~18 coup and domain tests (`rulingPower.test.js`, `coupEvents.test.js`, `powerStateProseDesk.test.js`, `warDisposition.p2.test.js`, …) are hand-built fixtures and do not move unless the function's contract changes.
- **The registers keyed on `rulingStructure.js`** (`tests/lint/presumedThings.register.json`, `.widened`, `presumptionClasses.register.json`, `factLayers.register.json`, `defenceFactReaders*.register.json`, `.style-law-baseline.json`): (a) re-records them.
- **⚠ The tuning inventory** (`tests/lint/.tuning-inventory.json`, machine-written, refrozen by `tuningRegister.walker.test.js`): `bareDecimals` counts `rulingPowerCoup.js` 18 and `rulingStructure.js` 13. A circumstance table of bare decimals reds it. It needs a registered tuning table, which the register's own law makes the owner's tuning signature.
- **The reference corpus**: I found no instrument by that name. The nearest are `scripts/review/readerCorpus.mjs` (the reader corpus: composed campaigns, hashed, `--verify`), which moves with any birth or verdict change, and `docs/LANDING9_CORPUS_2026-11-06.md`.
- **Censuses**: no census walker I found pins a government type or a contender count. The prose-wiring census cites `generatePowerStructure` for `criminalCaptureState` only.

## THE OPTIONS (one page)

The record already holds the circumstances:
- **Craft-led economy**: Craft Guilds' power against Merchant Guilds'; the economy income mix; a `guild governance` house.
- **Famine**: `economicState.foodSecurity.foodRecord.failedSource`; the famine stress.
- **Questioned mandate**: `publicLegitimacy` (label, `govMultiplier`, `isLegitimacyCrisis`); the `succession_void` vacancy.
- **Outside debt**: the 'Crown Creditors (Noble Coalition)' and 'Creditor's Representative' stress powers, born in 2 and 28 default towns.
- **Occupation**: the occupation stress; 'Occupation Authority' and 'Resistance Network' (10 towns each).
- **Strong faith**: the religion priority; the religious-conversion stress; 'Reform Congregation' and 'New Faith Community'.
- **A martial house**: a noble house with military priority (`nobleInstMultiplier`, `economyDisplacesNobles`).

- **O1. Tell the truth about kind** (a prerequisite to everything; small). Stamp the governing row's `category` from its chooser's kind at birth: noble for Royal Authority, Noble / Ducal Governorship and Feudal Stewardship; merchant or craft for the guild seats. Give Craft Guilds category `craft`. *Cost*: one cause. The golden moves on every noble-named seat (103 of 900 at default; 154 of 960 under the presets), and on the 79 guild seats too if they are stamped craft rather than merchant. *Moves*: the coup variant, disposition, and the transfer label for those seats. ⚠ By itself it **lowers** Craft Guilds' weight (0.95 → 0.85), the opposite of the owner's wish, so it ships with O2.
- **O2. Circumstance weights in the contest** (answers *"compete … given the right circumstances"* most directly; read-side). Inside `coupContenders`, multiply each challenger's weight by a declared, registered circumstance factor read from the facts above. For example:
  - craft: lifted when craft power ≥ merchant power or a guild-governance house stands;
  - nobles: lifted by a noble house plus military priority, or by a vacancy;
  - labour (once born, O4): lifted by famine;
  - outsiders: lifted by a creditor power;
  - all non-ruling powers: lifted by a legitimacy crisis.

  Leave `COUP_COERCION` as it is (disposition reads it). Keep criminals out. *Cost*: a tuning table (the owner's signature), and the birth writers move (factionStanding, castPowers: one golden member). Live campaigns' next verdicts move. *Measured headroom* (today's births, v2, default): nobles miss the cut by a median of 1.05 weight (p90 5.4), craft by 3.8 (p90 5.45). Under v1 (stored towns): 2 and 4.45. Arithmetic on the v2 medians (power × factor against a third contender of 12): the median noble (10 × 1.1) needs ≈ ×1.1. The median craft guild (9 × 0.95) needs ≈ ×1.4, or ≈ ×1.6 at 0.85 once O1 makes it craft. ⚠ Weights cannot help a power the density law has already removed: craft stands in only 161 of 900 births (v2), against 504 under v1.
- **O3. Let the winner's own body take the seat.** No new code: `transferRulingPower` already crowns *Guildhall Council*, *Workers' Assembly* and *Foreign Administration*, once O1 makes a craft winner read craft. Add the missing `COUP_VARIANT_BY_ARCHETYPE` rows and `OFFICE_TITLES` rows. Fix *Foreign Administration*'s **occupier** reading if a creditor regime is not an occupation.
- **O4. Born labour and outsider powers** (needed for them at all: weights cannot lift a power that is never born). Under famine or a strike, or debt or foreign trade dominance, raise a labour or outsider power on a house of its kind. That means extending `RULER_KINDS` and `hasHouseOfKind` to labour and outsider so the dual-hat law holds. *Cost*: new capability, house catalogue rows, the veil re-measure, one golden member.
- **O5. Born rulers by circumstance** (the chair's (a); largest). Add noble, craft, labour and outsider branches to `chooseGoverning`, keyed on the facts above, each behind `drawCouncilOfAKind`'s house test. *Cost*: authored descriptions, power rows, claims, titles and stability lines for each, the registers, the veil (§4), and the biggest golden shift. Every birth's seat distribution moves.

**Recommendation: O1 + O2 + O3 as one train, then O4; O5 only if the owner means "born ruling", not "able to win it".** The owner's words are "compete for leadership or the seat", and the count says every born seat is set by label or size, never contested. So the contest is where "given the right circumstances" lives. O2 is read-side, reuses the facts the record holds, needs no new authored body, and its blast radius is one golden member plus the sim. O1 is required, or every new or noble seat stays mis-kinded, and O3 is nearly free once O1 lands. **The crux** is whether the owner wants towns to be *born* under a craft or labourers' government (O5) or wants those groups to be *able to take the seat in play* (O1–O3). One sentence from the owner settles it. A second thing that would change my answer: if the owner wants labourers and outsiders in the contest at default sliders, O4 is on the critical path, not second.
