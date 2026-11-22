# PULSE-SITES — the record (2026-11-10)

**MERGE ORDER, FIRST LINE (the chair's P6, the reviewer's finding 2): THIS LANE NEVER MERGES ALONE.** The cured sites do not see the cards the pulse itself writes until GREEN-TIP's writer cure (`lane/green-tip-2026-11-10`) lands. Those cards carry the retired field and no memberships: 40 / 40 / 70 at 1 / 3 / 12 ticks in §6. GREEN-TIP merges with it, or first.

**Seat:** PULSE-SITES, a cure seat, child of the cloud chair (session `session_01FbPLbejcfwX5nii12VM673`); this seat's session `session_01FbPLbehJ1XtTPeEP23oMyC`. **Branch:** `lane/pulse-sites-2026-11-10`, cut from `lane/integration-2026-11-07` at `5da82ea59`. **Parallel seat:** GREEN-TIP (`lane/green-tip-2026-11-10`), whose files this lane did not touch. **Brief:** the chair's dispatch of 2026-11-10, rulings S1–S5.

**Outcome:** of this lane's 15 sites, 7 are cured and 8 are named. The two narration sites drop the retired read and name no power, because the narration cure is forgone (the owner's word, §0). Four LIVE sites in four files are cured by pure re-points to the card's first-rank membership, each red first on a soak birth. One DEAD fallback is removed. Three LEGACY sites stay, each with a one-line comment. Two DEAD sites are listed. The three `npcVerdictApply.js` rows are DARK by the chair's ruling (option (c), 2026-11-10): nothing is written. The landed walker gains a per-site arm, shrink-only, whose list holds 19 rows at this tip. The generator golden master and every property-tree pulse golden are green and unmoved. One pulse-keyed register row moves by cause and is left UNSIGNED (§7). Merged onto the integration line (`79acc9120`), the lazy-edge guard is green, boot-smoke passes, and first paint is +1 B raw. `typecheck:ratchet` is 167/167 and `typecheck:domain:strict` exits 0. eslint reports 0 on the touched files.

## 0. The re-opening (the reviewer's BLOCK on `dbaa54418`, the chair's rulings P1–P7)

| Ruling | What | Commit |
|---|---|---|
| **P1** (finding 1, the blocker), **as changed by the owner's word** | The registry cure (`a09f2593e`) put a hidden or criminal power's name, and a person's tie to it, on the PUBLIC chronicle. PROMOTE/DEMOTE narration is the log entry's `narrativeSummary` (`events/applyEvent.js :: applyEvent`), which `supabase/migrations/032_gallery_public_chronicle.sql :: _gallery_chronicle_entry` publishes verbatim to anon. The chair first ruled "name it only where unveiled" (`b41bb25d9`). The owner then said, verbatim: "Forgo or isolated the simulation. My main focus is the generator and dossier. Because the simulation is not fully built yet and requires PLAT." So **the narration cure is forgone**: `events/registry.js` returns to its base text, except that both narrations say "their power" for every card and read no retired field. **Naming a power in these narrations is deferred to the simulation's own program, with the reviewer's finding as the reason.** | `b41bb25d9`, replaced by `1462a8181` |
| **P2** (finding 4) | The walker's list was not shrink-only: the reviewer grew it by a read and a row with `count: 20`, and 4/4 passed. `RETIRED_SITE_CEILING = 19` is now pinned in the test itself. | `359252677` |
| **P3** (finding 6) | The verdict seat and the house factor name hidden powers too, behind dark flags. Nothing is written in code; the three DARK rows now state that when lit, P1's rule applies to `vacatedSeatOf`'s seat name and `castHouseFactor`'s factor. | `ce7f9a2ca` |
| **P4** (finding 7) | The ladder arm's comment said "a card with no memberships". It is read for any card whose memberships do not name the faction asked about. The comment and the row's reason now say so (two lines, so the row stays at 56). | `37cca6b15` |
| P1's pin file | Lighting census door: files 3179 → 3180, parked 395 → 396 (the same file, rewritten by `1462a8181`). | `f5ecf6fdf` |

**Reach of finding 1 (the chair, 2026-11-10):** the surface is reachable only by an authoring account. The event composer is drawn only in edit mode (`src/components/SettlementDetail.jsx`), and edit mode is open only to `src/lib/viewerAuthority.js :: viewerCanAuthor` (premium, founder or elevated staff). No free or signed-out account writes an event log. The public chronicle's own missing veil goes to the simulation's program; the second lane (`lane/chronicle-veil-2026-11-10`) was cancelled before it was cut.

**P1, the pin, red first.** `tests/domain/pulseSitesChronicleVeil.test.js` (the pglite arm dropped by the change) commits a PROMOTE and a DEMOTE through the real `applyEvent` for a member of each of three powers:

- (a) hidden: soak1k-113, The Independent Bloc;
- (b) criminal: soak1k-3, Thieves' Guild;
- (c) open: soak1k-3, Guild Council.

In all three the `narrativeSummary` must name the person and not the power. At `efb2c917d` (the conditional naming) the open arm was red ("Duha al-Yamani rises within Guild Council …"); at `dbaa54418` all three were (the reviewer's "Yordan Klimov rises within The Independent Bloc …"). After the change: 7/7. Re-keyed by this cause: `pulseSitesMembershipReads`' registry describe (every card "their power") and `editorRosterEvents`' swap narration. The walker's list never held these two sites, because the retired read is gone.

**The table's narration row** is now 0 names at every tick, base and tip, veiled or not. At `efb2c917d` the split was veiled 0 / unveiled 1,504 → 1,499; that tip is superseded.

**P2, red first.** The reviewer's attack was planted: a read `npc?.factionAffiliation` appended to `corruption.js` and its row added with `count: 20`. It reds "the list may only SHRINK … expected 20 to be less than or equal to 19". Restored from a file copy; 4/4.

**P5 (finding 5), RECORD ONLY — known, post-deploy.** `corruption.js :: npcHomeInstitution` (`0db374102`) takes no settlement, so it breaks a first-rank tie by the memberships' own order. That differs from `firstRankMembershipOf(npc, powerOrderOf(s))` on **183 of 3,201 cards** (the reviewer's figure). It also returns a POWER name, which its two consumers (`corruptionImpair.js :: harborsCorruptInsider` and the reform reader beside it) match against INSTITUTION names by substring. No cure now.

**P6 (finding 2)** is the merge order on this record's first line.

**P7 (finding 3), RECORD ONLY.** The tip-only red `tests/lint/observedShapeReaders.walker.test.js` > "THE ERASURE GUARD" (the row `causeLifecycle.js / secondaryAffiliation on npcs — the read is gone (a lawful repair)`) **is owned by the closing acts' observed-shape re-freeze, after the baseline's schema 39 → 40 migration**, which the merge seat lists in its hand-back file. This lane does not cure it.

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
| 1 | `events/registry.js :: PROMOTE_NPC.narrate` (805) | factionAffiliation | names the person's faction in the event line | **LIVE**: 1793/1793 born cards narrate "their power" | **FORGONE (§0, P1 as changed)**: `'their power'` for every card, no read. Was `firstRankMembershipOf(...)` at `a09f2593e` | `a09f2593e` → `1462a8181` |
| 2 | `events/registry.js :: DEMOTE_NPC.narrate` (820) | factionAffiliation | same | **LIVE**, same figures | same as 1 | `a09f2593e` → `1462a8181` |
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
| 13–15 | `worldPulse/npcVerdictApply.js :: RELINQUISHED_FIELDS` (104, 105, 111) | factionAffiliation, secondaryAffiliation, linkedFactionIds | the verdict strip clears each listed key the card carries | **DARK** (the chair's ruling; was LIVE → STOP): current cards carry none, so the strip clears no affiliation. 1148/1148 stripped first-rank members at t0 (571 at t12) still pass `npcInFaction` through memberships | unchanged; walker class DARK (§4) | `b8a31714a` |

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

## 4. The STOP, ruled DARK: `npcVerdictApply.js :: RELINQUISHED_FIELDS`

The only re-point that carries the relation is a write: `{ key: 'memberships', to: [] }`. It would clear every power standing (rank and share included) and add `memberships` to the receipt snapshot. That is a judgment about what disgrace does to the cast, so it is not a pure re-point under S1. Options put to the chair:

- (a) clear all memberships;
- (b) clear the first-rank one only;
- (c) leave it listed.

Under (c) the rung still vacates through `importance → 'minor'`, the module's own structural path. **The chair ruled (c)** (2026-11-10): the feature is dark, and the cure is a write that decides what disgrace does to standing, which is the owner's on the day `npcConsequencesEnabled` is lit. The three rows are class **DARK** in the walker's list ("decided when npcConsequences is lit (the chair, 2026-11-10)"), distinct from LEGACY.

**Affordance and handler, for the reviewer:** the affordance (`affordanceManifest.js :: npcSwapPairsExist`) counts by `people/membership.js :: firstRankMembershipOf(npc, powerOrderOf(settlement)).power`. The chair has told GREEN-TIP that `mutateEntities :: swapNpcStanding` reads by the same reader, so check the pair once both lanes land.

## 5. The walker (S3)

`tests/lint/noLegacyFactionReaders.walker.test.js` gains a per-site arm. Its manifest row already covers the file, so no new mutation-manifest row was owed. The arm checks every read, destructure or string access of the five retired fields in `src/` outside the migration against `tests/lint/legacyFactionReaders/retired-field-sites.json`. Each row carries file, line, field, class and reason, and is keyed by `file:line field`, so a line with two reads of one field is one row. The equality is exact both ways:

- a new read reds as "not on the list";
- a cured site reds as "a STALE row".

The arm has its own planted control: four read shapes are caught, while a write and the powers are not.

**At this tip: 19 rows.**

| Class | Rows | Sites |
|---|---|---|
| LEGACY | 3 | customContent :393, batch :151, npcLadderFactionMembership :56 (its comment says it reaches a value today only on pulse-written cards, which GREEN-TIP's writer cure ends) |
| DEAD | 2 | densityRungs :92, applyDensityLaw :491 |
| DARK | 3 | npcVerdictApply :104 / :105 / :111 |
| CURED-ON-LANE | 11 | GREEN-TIP's 14 reads: factionLifecycle :117, propagate :350, mutateEntities :505 / :751 / :895 / :896 / :918, factionDensityKernel :640, npcAgency :302 / :825, successorNpc :37 |

When both lanes merge, the merge seat removes the 11 CURED-ON-LANE rows through this door, leaving the LEGACY, DEAD and DARK rows.

**Red first:** the same walker files run against the base tree went red with exactly the ten sites this lane changed. **Green at the tip:** 4/4 in 9.4 s, of which the per-site arm takes about 9 s for the 2,000+ file walk.

## 6. The table (S5)

The births, `simulateCampaignWorldPulse` and the 0/1/3/12 readings are §2's. The base is `5da82ea59`; the tip is this lane. Each cell is base → tip, summed over 60 births. "Lit" means `npcConsequencesEnabled` and `merchantHousesEnabled` are on.

| Figure (what the cured site feeds) | t0 | t1 | t3 | t12 |
|---|---|---|---|---|
| PROMOTE/DEMOTE narration names a power (registry) — FORGONE at `1462a8181`: 0 everywhere; the figures were at `dbaa54418` | 0 → 1630 | 40 → 1630 | 40 → 1628 | 70 → 1622 |
| births with the PROMOTE_NPC affordance open (affordanceManifest) | 0 → 54 | 0 → 54 | 0 → 54 | 0 → 54 |
| powers that cast a house factor (houseLedger) | 0 → 211 | 40 → 60 | 40 → 60 | 70 → 60 |
| members whose vacated seat is named (npcVerdictTable) | 0 → 1630 | 40 → 1630 | 40 → 1628 | 70 → 1622 |
| corrupt cards homed, for the reform roll (corruption) | 0 → 0 of 0 | 0 → 63 of 70 | 0 → 70 of 78 | 0 → 114 of 130 |
| lit: verdicts applied / verdicts naming the open seat (· = not measured at that tick) | 0/0 → 0/0 | 0/0 → 0/0 | 2/· → 2/· | 9/0 → 9/8 (births 5, 22, 35, 46, 53, 59) |
| npcs / powers / members (nothing exploded) | identical | identical | identical | 1863 / 130 / 1622 both |
| Wizard News entries, default (lit) | 0 → 0 | 476 → 476 | 790 → 790 (792) | 1495 → 1495 (1504 both) |
| errors | 0 | 0 | 0 | 0 |

Notes on the table:

- The house factor at t1–t12 drops from 211 to 60 because the powers dissolve (216 → 100 → 130 at both base and tip: GREEN-TIP's `factionLifecycle` cause). The base's 40 to 70 are cards the pulse wrote with the retired field.
- At the tip, a card with no `memberships` that the pulse wrote with `factionAffiliation` (40 to 70 of them) is no longer read by these sites. GREEN-TIP's writer cure makes those writers write memberships.
- The pulse's own output is identical base → tip on every count measured. The cured reads feed narration, gates, a dark lane's factor and the verdict's seat, and none of these changed a draw.
- The house-ledger row count read 0 on both trees: the probe's key, not a finding.

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

**Merged onto the integration line (the chair's condition 4).** In a scratch worktree, `origin/lane/integration-2026-11-07` at `79acc9120` was merged with this lane at `c81c544b3`; the merge was clean and nothing was committed to the lane. Later lane commits change no src except one comment line. Results:

- `tests/architecture/engineCoreLazyEdge.test.js`: 2/2 green.
- `people/membership.js` is not pinned lazy in `vite.config.js`.
- `npm run build` exits 0, and `node scripts/boot-smoke.mjs` reports **PASS**: 596/596 chunks, the shell mounted, 19,354 B under #root.
- `verify:dist` first paint is **1,121,178 raw / 357,228 gzip / 299,770 Brotli**, against the line's own 1,121,177 / 357,201 / 299,758 at `25b5617e6`. This cure adds **+1 / +27 / +12 B** to first paint, ATTRIBUTED here to `people/membership.js` entering the eager closure through `corruption.js` and `events/registry.js`. The ceiling rows (1,104,215 / 351,590 / 295,016) are red on the line before this lane; the merge seat re-records them at the final tip.

**Registers through their doors:**

- **writer reach** (`node scripts/check-writer-reach.mjs --write`, commit `8500d4268`): `factionAffiliation on npcs` reach shrinks campaign-pdf/dossier-pdf/foundry/web-transitive/world-book → dossier-pdf/foundry/web-transitive. Cohort 1362 → 1362; HOLD.
- **lighting census** (`LIGHTING_CENSUS_REFREEZE`, commit `0f2719364`): files 3178 → 3179, titles +9, suite titles +7.
- **source-citation roster:** dated 221 → 222 (commit `c51a1f53f`).
- **corruption closure pin** (`proseTasteCorruption`), re-keyed by cause (commit `e73b5d88b`): the desk already ships `membership.js`, and the byte arm is unmoved.
- **observed-shape readers, NOT re-frozen:** its erasure guard names one lawful row, `causeLifecycle.js / secondaryAffiliation on npcs — the read is gone (a lawful repair)`, from commit 6. The door refuses on the base's own schema drift ("baseline schema 39 cannot be overwritten by schema 40 … --migrate-schema=40"), and that migration is not this lane's. The row is owned by the closing acts' observed-shape re-freeze after the schema 39 → 40 migration (§0, P7).

**One pulse-keyed register row moves, left UNSIGNED:** `tests/lint/newsHeadlineContract.walker.test.js` A2, address row `applied|npc_verdict|summary|indicative`, distinctValues 1 → 2 (occurrences 3 → 3), by cause `83d79aaa2`. The verdict summary now says "the seat at <power> stands open" where it said only "The office is forfeit." The file is red at the base on other rows (applied|cause_lifecycle, strategy_deploy, stressor_aftermath), so it cannot be refrozen here; the merge seat signs it.

**Edge-shared bundles.** `supabase/functions/_shared/{aiCharter,aiGrounding,aiOutputSchema,engine}Bundle.meta.json` list `corruption.js` and/or `registry.js` among their inputs, so those inputs changed. **They are not re-emitted** (S4). `tests/build/landingFixtureFreshness` is not this lane's.

**Hand-back gate.** `sh scripts/gate-tail.sh npx vitest run tests/lint tests/scripts tests/architecture tests/domain --maxWorkers=2` at the lane tip `c81c544b3`: 1417 files, 32 failed tests in 20 files. A base-worktree run at `5da82ea59` had 27 failed. Five failing titles are tip-only, and each is now cured or named:

- `sourceCitationIntegrity` (this record): cured by the roster bump.
- `proseTasteCorruption`: re-keyed by cause.
- `writerReach`: the door, above.
- `sovereigntyLightingContract`: the census door, above.
- `observedShapeReaders`' erasure guard: OWED, above.

Each was re-run green after its cure, except the observed-shape row.

Every other red appears at the base by title:

- GREEN-TIP's list: clergyTraitPlane 2, deityStanceLane 1, killNpcDoubleImpair 3, characterConsumers 3, religionLegitimacyFactionKey 1, worldPulseFactionSeating 2.
- The base's own: layerBoundaries (the foodGenerator/isolationSupport cycle), composeStateProse, editWorldFactResources 2, phantoms, newsHeadlineContract 2 (plus this lane's one row inside A2, named above), observedShapeReaders' other 4, proseFamilyContract 3, proseRegisterLoaders, ledgerCitationIntegrity and provenanceMap (ENVIRONMENT).

## 8. CONFIRMED against PLAUSIBLE

**CONFIRMED by execution:**

- the scan's 29;
- every probe figure above;
- each red-first and its green;
- the walker's red at base and green at tip;
- the build and byte comparisons;
- the two typecheck gates;
- eslint;
- the base attribution of the two property files, the eight build tests and the gate's 27 base reds (by test title);
- the merged-line guard, build, boot-smoke and `verify:dist` figures;
- the three register doors and their diffs.

**PLAUSIBLE, not executed:**

- that the three LEGACY rows are reached only on the paths named. This rests on a src grep for writers, not on a trace of every import or replay path.
- that `causeLifecycle`'s removed fallback cannot matter to a save. Every load runs the migration chain; I did not trace each load path.
- that GREEN-TIP re-points `mutateEntities :: swapNpcStanding` to the same first-rank reader. The chair has said so; I have not seen it.
- that the base reds named by title fail for the same reason at the tip. The `newsHeadlineContract` row was checked by content; the others by title only.

**One process note:** in checking the houseLedger red-first I used `git stash` on my own uncommitted lane file in my own worktree. After that I used file copies.
