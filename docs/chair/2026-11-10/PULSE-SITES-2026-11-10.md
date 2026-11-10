# PULSE-SITES — the record (2026-11-10)

**Seat:** PULSE-SITES, a cure seat, child of the cloud chair (session `session_01FbPLbejcfwX5nii12VM673`); this seat's session `session_01FbPLbehJ1XtTPeEP23oMyC`. **Branch:** `lane/pulse-sites-2026-11-10`, cut from `lane/integration-2026-11-07` at `5da82ea59`. **Parallel seat:** GREEN-TIP (`lane/green-tip-2026-11-10`), whose files this lane did not touch. **Brief:** the chair's dispatch of 2026-11-10, rulings S1–S5.

**Outcome:** of this lane's 15 sites, 7 are cured and 8 are named. Six LIVE sites in six files are cured by pure re-points to the card's first-rank membership, each red first on a soak birth. One DEAD fallback is removed. Three LEGACY sites stay, each with a one-line comment. Two DEAD sites are listed. The three `npcVerdictApply.js` rows are a STOP held for the chair, because their cure is a write. The landed walker gains a per-site arm, shrink-only, whose list holds 19 rows at this tip. The generator golden master and every pulse golden are green and unmoved, so no golden is left unsigned. `typecheck:ratchet` is 167/167 and `typecheck:domain:strict` exits 0. eslint reports 0 on the touched files.

## 1. The scan (reproducing the brief's 29)

The landed walker's own syntax-tree pass (`tests/lint/legacyFactionReaders/ast-sites.mjs :: sitesIn`) was run over `src/` minus `settlementMigrations.js`, counting the kinds read, destructure, string and path-string, on the five retired fields (`settlementMigrations.js :: V1_CARD_FIELDS`). At `5da82ea59` it found **29 sites in 18 files: factionAffiliation 22, linkedFactionIds 4, secondaryAffiliation 2, densityRungRole 1**. That is the brief's count exactly. One path note: `factionDensityKernel.js` lives in `src/domain/worldPulse/`, not `density/`.

**The mapping a correct re-point follows** comes from `migrateV1toV2` and the reader's own note:

| Retired field | Maps to |
|---|---|
| `factionAffiliation` | a membership. The shim derived it as the FIRST-RANK power (`people/membership.js :: powersByRankOf`: "the same order the shim derives the two old fields by"), so the re-point is `firstRankMembershipOf(card, powerOrderOf(settlement)).power`. |
| `linkedFactionIds` | memberships. GREEN-TIP's P3 (`44b37a520`) reads `membershipsOf(card)` powers. |
| `secondaryAffiliation` | a membership only where it names a power. A house value is REPORTED and dropped; the criminal house now lives on the allegiance, read through `corruptionLeash.js :: resolveLeash`. |
| `densityRungRole` | deleted. |

## 2. The probe

The probe script is `scratchpad/probe.mjs`; its method is reproduced here. It births `soak1k-0..59` (`scripts/audit/soak-review/corpus.mjs :: birth`, ten per tier), pulses each alone with `pulseKernel.js :: simulateCampaignWorldPulse` (`one_week`, `commit: true`, chaining `worldState` and the settlement update), and reads every site's input and output on the current record at 0, 1, 3 and 12 ticks. There were 0 errors in 240 readings.

**The cards that carry `factionAffiliation` after a tick (0 / 40 / 40 / 70) are written by the pulse's own writers** (GREEN-TIP's `factionDensityKernel` and `successorNpc`). Birth writes none.

## 3. Each site

Lines are at `5da82ea59`. "Probe" figures are sums over the 60 births at t0 → t12 unless marked otherwise.

| # | Site | Field | What it does | Class and probe | Reads now | Commit |
|---|---|---|---|---|---|---|
| 1 | `events/registry.js :: PROMOTE_NPC.narrate` (805) | factionAffiliation | names the person's faction in the event line | **LIVE**: 1793/1793 born cards narrate "their power" | `firstRankMembershipOf(npc, powerOrderOf(settlement))?.power \|\| 'their power'` | `a09f2593e` |
| 2 | `events/registry.js :: DEMOTE_NPC.narrate` (820) | factionAffiliation | same | **LIVE**, same figures | same | `a09f2593e` |
| 3 | `events/affordanceManifest.js :: npcSwapPairsExist` (212) | factionAffiliation | gates the PROMOTE_NPC affordance ("Needs a power with two seated members") | **LIVE**: gate closed on 60/60 births at every tick; 54/60 have a power with two first-rank members | counts by first-rank power | `bf7d435fa` |
| 4 | `worldPulse/houseLedger.js :: castHouseFactor` (324) | factionAffiliation | casts the house's factor (dark: `merchantHousesEnabled`) | **LIVE**: 0 of 216 powers cast a factor at birth, 211 could | `firstRankMembershipOf(npc, order)?.power === house` | `332a5edb5` |
| 5 | `worldPulse/npcVerdictTable.js :: vacatedSeatOf` (709) | factionAffiliation | the seat a verdict opens (dark: `npcConsequencesEnabled`) | **LIVE**: 0 of 1630 first-rank members name a seat at birth | the first-rank membership, in the retired key's place in front of the remaining handles | `83d79aaa2` |
| 6 | `corruption.js :: npcHomeInstitution` (646) | factionAffiliation | a corrupt insider's home, for `corruptionImpair :: harborsCorruptInsider` | **LIVE**: corrupt cards 0/70/78/130, homed 0 at every tick | `firstRankMembershipOf(npc)?.power` first (no settlement in the signature, so the memberships' own order breaks a tie); `corruptionImpair.js` is in neither lane, so the call was not widened | `0db374102` |
| 7 | `worldPulse/causeLifecycle.js :: sustainingInstitution` (175) | secondaryAffiliation | fallback for the bearer's sustaining criminal house | **DEAD**: 0 of 1793–1863 cards carry it at any tick; no src writer; the relation is the `resolveLeash` arm in front; no test feeds the field to this module | removed (comment corrected) | `5153945c2` |
| 8 | `events/batch.js :: eventConsumes` (150 → 151) | linkedFactionIds | ADD_NPC payload ref check | **LEGACY**: an EVENT PAYLOAD key, not a card. No src composer writes it (`eventComposer/buildEvent.js` writes `linkedInstitutionIds` only). It is reached by an older or external payload, and it mirrors `mutateEntities :: addNpc` (GREEN-TIP's) | stays, one comment line | `c81c544b3` |
| 9 | `worldPulse/npcLadderFactionMembership.js :: npcFactionHandle` (54 → 55) | factionAffiliation | `npcInFaction`'s compatibility arm | **LEGACY**: runs AFTER the memberships arm. It finds a value only on a card with no memberships (DM-authored, or not migrated); today that means only the pulse-written cards GREEN-TIP cures | stays, one comment line | `c81c544b3` |
| 10 | `customContent.js :: classifyCustomNpc` (392 → 393) | factionAffiliation | a library NPC's `controlledBy` | **LEGACY**: the DM's custom-content library entity, a store no settlement migration covers. The membership read is in front | stays, one comment line; the landed walker's FIELD_CONTRACTS row re-keyed 392 → 393 | `c81c544b3` |
| 11 | `generators/density/applyDensityLaw.js :: assignRoster` (491) | factionAffiliation | rung seating | **DEAD**: the only caller, `disperseNamedRoster`, has no src caller (tests only) | listed; removal would break its tests | — |
| 12 | `domain/density/densityRungs.js :: RUNG_ROLE_FIELD` (92) | densityRungRole | the field-name constant | **DEAD**: readers are `titularSuccession.js` (no src importer) and `assignRoster` (dead) | listed; importers would break | — |
| 13–15 | `worldPulse/npcVerdictApply.js :: RELINQUISHED_FIELDS` (104, 105, 111) | factionAffiliation, secondaryAffiliation, linkedFactionIds | the verdict strip clears each listed key the card carries | **LIVE → STOP**: current cards carry none, so the strip clears no affiliation. 1148/1148 stripped first-rank members at t0 (571 at t12) still pass `npcInFaction` through memberships | unchanged; held for the chair (§4) | — |

**Tests re-keyed by cause**, each from a v1 card to a membership at the same strength:

- `editorRosterEvents` swap-narrate fixture (commit 1)
- `houseLedgerTr2`'s three cards (commit 2)
- `npcVerdictTable`'s handle-arm fixture (commit 3)

**Red first**, each on soak1k-3 and soak1k-4 (`tests/domain/pulseSitesMembershipReads.test.js`, one describe per file):

| Site | Received before the cure |
|---|---|
| registry | "Abbas al-Isfahani rises within their power" (expected "... within Thieves' Guild") |
| houseLedger | factor `''` |
| vacatedSeatOf | factionName `""` (expected "Thieves' Guild") |
| affordance | `available` false |
| npcHomeInstitution | `null` |

All five went green after their cure.

## 4. The STOP: `npcVerdictApply.js :: RELINQUISHED_FIELDS`

The only re-point that carries the relation is a write: `{ key: 'memberships', to: [] }`. It would clear every power standing (rank and share included) and add `memberships` to the receipt snapshot. That is a judgment about what disgrace does to the cast, so it is not a pure re-point under S1. Options put to the chair:

- (a) clear all memberships;
- (b) clear the first-rank one only;
- (c) leave it listed.

Under (c) the rung still vacates through `importance → 'minor'`, the module's own structural path. **Default if no ruling: (c).** The three rows are STOP rows in the walker's list.

## 5. The walker (S3)

`tests/lint/noLegacyFactionReaders.walker.test.js` gains a per-site arm. Its manifest row already covers the file, so no new mutation-manifest row was owed. The arm checks every read, destructure or string access of the five retired fields in `src/` outside the migration against `tests/lint/legacyFactionReaders/retired-field-sites.json`. Each row carries file, line, field, class and reason, and is keyed by `file:line field`, so a line with two reads of one field is one row. The equality is exact both ways:

- a new read reds as "not on the list";
- a cured site reds as "a STALE row".

The arm has its own planted control: four read shapes are caught, while a write and the powers are not.

**At this tip: 19 rows.**

| Class | Rows | Sites |
|---|---|---|
| LEGACY | 3 | customContent :393, batch :151, npcLadderFactionMembership :55 |
| DEAD | 2 | densityRungs :92, applyDensityLaw :491 |
| STOP | 3 | npcVerdictApply :104 / :105 / :111 |
| CURED-ON-LANE | 11 | GREEN-TIP's 14 reads: factionLifecycle :117, propagate :350, mutateEntities :505 / :751 / :895 / :896 / :918, factionDensityKernel :640, npcAgency :302 / :825, successorNpc :37 |

When both lanes merge, the merge seat removes the 11 CURED-ON-LANE rows through this door. The rows for each STOP the chair rules on leave the same way.

**Red first:** the same walker files run against the base tree went red with exactly the ten sites this lane changed. **Green at the tip:** 4/4 in 9.4 s, of which the per-site arm takes about 9 s for the 2,000+ file walk.

## 6. The table (S5)

[filled at hand-back]

## 7. Goldens, bytes, gates

**Goldens.** `tests/property` ran whole at the tip: 93 of 95 files green. The generator golden master and every pulse golden were green, and none moved, so **none is left unsigned**. The two red files are the base's: `dossierProseManifest` (2) and `editCorpusRatchet` (4) have the same six titles red at `5da82ea59` in a base-worktree run.

**Bytes.** A fresh `vite build` was made at the base (`/home/user/wt-base`) and at the tip. Per-chunk deltas:

| Chunk | Delta |
|---|---|
| entry `index` | +10 |
| `engine-core` | −3 |
| `advanceInterval.worker` | +85 |
| `npcDmVerbs` | +61 |
| `affordanceManifest` | +13 |
| `customContentPreview.worker` | −15 |
| generation worker | unchanged at 2,007,681 B |

`tests/build` has the same 8 reds at the base and at the tip. They are the base's:

- `bootSmoke`'s three-chunk cycle (`coherence-lazy` ↔ `engine-core` ↔ `data-lazy`, "Cannot access 'Jt' before initialization", present in the base build);
- the generation worker over its ceiling (2,007,681 > 1,976,655 at both);
- `brandDerivatives` (3), `cultureProfilesLazy`, `vendorPdfLazy` (2).

**Edge-shared bundles.** `supabase/functions/_shared/{aiCharter,aiGrounding,aiOutputSchema,engine}Bundle.meta.json` list `corruption.js` and/or `registry.js` among their inputs, so those inputs changed. **They are not re-emitted** (S4). `tests/build/landingFixtureFreshness` is not this lane's.

**Hand-back gate.** [filled at hand-back]

## 8. CONFIRMED against PLAUSIBLE

**CONFIRMED by execution:**

- the scan's 29;
- every probe figure above;
- each red-first and its green;
- the walker's red at base and green at tip;
- the build and byte comparisons;
- the two typecheck gates;
- eslint;
- the base attribution of the two property files and the eight build tests (by test title).

**PLAUSIBLE, not executed:**

- that the three LEGACY rows are reached only on the paths named. This rests on a src grep for writers, not on a trace of every import or replay path.
- that `causeLifecycle`'s removed fallback cannot matter to a save. Every load runs the migration chain; I did not trace each load path.
- that GREEN-TIP will re-point `mutateEntities :: swapNpcStanding` to the same first-rank reader the affordance now counts by. This is a coordination point, not a fact.

**One process note:** in checking the houseLedger red-first I used `git stash` on my own uncommitted lane file in my own worktree. After that I used file copies.
