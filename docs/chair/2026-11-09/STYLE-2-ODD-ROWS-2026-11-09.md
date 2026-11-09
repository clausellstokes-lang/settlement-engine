# STYLE-2-ODD-ROWS — lane SW-9 (2026-11-09): the owner's four vetoes, then the odd rows

**Seat:** SW-9 ODD-ROWS (Opus 5.5), session `session_01FbPLbcpKsVsbxh1AwqunUs`, a child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`). **Lane:** `lane/style-2-odd-rows-2026-11-09`, cut from `8b75f466a` EXACTLY (MERGE-TRAIN's pushed tip after its eighth point), in its own worktree because the in-place checkout was refused. **Law:** the brief `BRIEF-STYLE-2-WAVE-2026-11-09.md` §0 and its SW-9 row and addenda, `STYLE-RULINGS-2-2026-11-09.md` (A7's exception, A11, B10(b)), the chair's running record (ODQ-934.105 draft: "(4) The headings"), all on `origin/lane/chair-2026-11-08`; `docs/OPERATING_STANDARD.md`. Merged by STYLE-2-MERGE after the train; this lane never touches the integration line. **Nothing here is signed:** every delta below is measured and listed for STYLE-2-MERGE.

## 0. What landed, in order

| commit | cause | files |
|---|---|---|
| `1948d1e05` | VETO 1: the moved site lines take no heading | `OverviewTab.jsx`, `StateProse.jsx`; pins `generalDeskTabFlow`, `statePrintParity` |
| `baa14f6c6` | VETO 2: the PDF governance kicker reads GOVERNANCE | `PowerStructure.jsx`, `PowerTab.jsx` (comment); pin `statePrintParity` (new arm) |
| — | VETO 3: "ORIGIN" is not in this base (§1) | none |
| `56491754d` | VETO 4: the governance paragraph's connective copy struck | `governanceAccount.js`; pin `governanceAccount.test.js` |
| `736a4b017` | the drop-cap "Amerchant" (`--lone`) | `OverviewTab.jsx`, `organic.css`; pin `generalDeskTabFlow` |
| `b93ec8ec5` | FaithWar:54 + WarTab:187 as one sentence | `FaithWar.jsx`, `WarTab.jsx`; pin `statePrintParity` |
| `66a3ba5e3` | the kernel's `ownerBit` naming an institution as a "who" | `traditionsKernel.js`; pin `traditionsKernel.test.js` |
| `3b9247975` | the Relationships empty state on a generated thorp | `RelationshipsTab.jsx`; pin `relationshipsTab.determinism` |
| `edccf4791` | TIER-PARITY-FIX's leftover: "cloud sync" | `AccountSubscriptionSection.jsx`; pin `accountSubscriptionSectionCta` |
| `7e756facb` | `InstitutionsTab.jsx:221` (A7's exception) | `InstitutionsTab.jsx`; pin `institutionsInverted` |
| `3b9626ecf` | A11: "the town" in a thorp (trade drift, freshness note) | `tradeFlowEconomics.js`, `economyFreshness.js`, `EconomicsTab.jsx`, `pdf/lib/liveWorld.js`; two pins |
| `5673f14f1` | A11: the validator's "tier minimum" frame (UNSIGNED generator cause) | `structuralValidator.js`; pin `structuralOverrideDedup` |
| `a8304e7a9` | the prose-numerics ratchet held at identity for three of the causes above | `traditionsKernel.js`, `structuralValidator.js`, `PowerStructure.jsx` (shape only, no printed byte) |
| `5310af5fa` | A11: one writer for the realm-arc sentences | `realmArcSentences.js` (new), `realmArcSummary.js`, `worldSnapshotPublic.js`; the prose-numerics baseline re-addressed through its door; pin `realmArcSummary.test.js` |

Every pin above was red at the parent `8b75f466a` and is green at its commit (the ownerBit arm run at the parent in the clean worktree: 1 failed | 26 passed, its power control green at both).

## 1. THE OWNER'S FOUR VETOES (2026-11-09 03:5x, "No."; the prior state returns), every line old → new

**Veto 1 — "Trade and the houses" (and "Trade and institutions") STRUCK.** Measured first: OWNER-WORDS 1edc73277 moved the woven site lines out of THE PLACE into their OWN block after the Systems Health Section, under the new title; that block has no heading but the struck one. The lines are NOT put inside Systems Health, because that section keeps no sentence list by the owner's order of 2026-09-17 (named at `OverviewTab.jsx` in the section's own comment). STOP 1 to the chair with this default; RULED by the chair (08:1x): the default stands.

| surface | old | new |
|---|---|---|
| web, `OverviewTab.jsx` (the block after Systems Health) | title "Trade and the houses" over the site lines; testid `overview-trade-houses` | no title; the same block, the same place; testid `overview-site-lines` |
| PDF, `StateProse.jsx` kicker `overview.market` | "Trade and the houses" | "The place" (its label before 1edc73277) |

**Veto 2 — the PDF kicker "WHO RUNS IT" STRUCK.** Measured: the web prints NO heading over the composed governance block (`PowerTab.jsx`, a bare div around `power-governance-account`), so the chair's default holds.

| surface | old | new |
|---|---|---|
| `PowerStructure.jsx` Callout kicker | "WHO RUNS IT" (before 984b08948: "RECENT EVENT") | "GOVERNANCE" |
| `PowerTab.jsx` block comment (no rendered byte) | "WHO RUNS IT, IN ONE PARAGRAPH" | "GOVERNANCE, IN ONE PARAGRAPH" |

**Veto 3 — "ORIGIN" back to its prior label: NOTHING TO REVERT IN THIS BASE.** Measured: the change "CHARACTER & ORIGIN" → "ORIGIN" is SW-B4's `f93ead0d7` (`src/pdf/sections/Overview.jsx` on `lane/style-2-pdf-foundry-2026-11-09`), and that lane is not an ancestor of `8b75f466a`; this base still prints the prior "CHARACTER & ORIGIN". The same owner list (ODQ draft, SW-B4's hand-back) also carried SW-B4's two connective lines, "In full in Plot Hooks (04):" (`TonightAtTheTable.jsx`) and "… are not touched yet; either of them could side with either camp." (`pdf/lib/crisisPrint.js`); neither is in this base. STOP 2 to the chair; RULED (08:1x): a no-op here, the merge seat takes the prior text at SW-B4's merge point (§7).

**Veto 4 — the governance paragraph's connective copy STRUCK; the sentences stand in sequence.** `governanceAccount.js`: every clause that joined two of the paragraph's facts is split into two plain sentences. Words of fact unchanged; nothing else of the paragraph moved.

| part | old | new |
|---|---|---|
| seat (arrangement 0) | {place} is governed by {ruler}, and {who} holds its seat. | {place} is governed by {ruler}. {who} holds its seat. |
| seat (1) | {who} holds the seat of {ruler}, which governs {place}. | {who} holds the seat of {ruler}. {Ruler} governs {place}. |
| seat (2) | The seat of {ruler}, which governs {place}, is held by {who}. | {Ruler} governs {place}. Its seat is held by {who}. |
| vacancy | Until it is filled, {ruler} governs without a head. | {Ruler} governs without a head. |
| unrecorded seat | {place} is governed by {ruler}, and the record names no one in its seat. | {place} is governed by {ruler}. The record names no one in its seat. |
| Legitimacy Crisis (a) | {Causes} has/have cost {ruler} its standing, and few in {place} still accept its right to rule. | {Causes} has/have cost {ruler} its standing. Few in {place} still accept its right to rule. |
| Legitimacy Crisis (b) | Few in {place} still accept {ruler's} right to rule, now that {causes} has/have cost it its standing. | Few in {place} still accept {ruler's} right to rule. {Causes} has/have cost it its standing. |
| Contested (b) | In {place}, {ruler's} right to rule is contested, and {causes} is/are the reason. | In {place}, {ruler's} right to rule is contested. {Causes} is/are the reason. |
| Tolerated (b) | {place} tolerates {ruler} and no more, and {causes} is/are the reason. | {place} tolerates {ruler} and no more. {Causes} is/are the reason. |
| Approved (b) | {Ruler} has the approval of {place}, earned by {causes}. | {Ruler} has the approval of {place}. {Causes} earned it. |
| Endorsed (b) | {place} stands behind {ruler}, won over by {causes}. | {place} stands behind {ruler}. {Causes} won it over. |

Left as they were: the estranged-power lines and the consequences (single facts, no joining clause), the fracture line, "and no more" (the band's own sentence), the seed arrangements (condition (e)), every bare band sentence. **"Noble Claimant" not touched** (a minted name; SW-8's bracket). The reading of "connective copy" as the joining clauses is PLAUSIBLE, the owner's to correct by a word.

## 2. The odd rows, old → new

| row | old | new | census note |
|---|---|---|---|
| drop-cap "Amerchant" (`OverviewTab.jsx`, `organic.css`) | the raised initial runs into the next word on a one-letter first word | `oc-dropcap-prose--lone` when the scene matches `/^[A-Za-z]\s/`; a word-space on `::first-letter` (0.3em; 0.25em under the float fallback) | the words are not touched. Chromium range measure (Georgia 20px italic, the repo's stylesheet): the gap after "A" 1.8 px at the parent → 6.0 px; "The road…" 5.0 px both |
| FaithWar:54 + WarTab:187 | The scar is healing; this realm leans toward peace. | The worst of the fighting is over; this realm leans toward peace. | prints only on the `near peace` band, the recovering tail below the condition floor (`warStatus.js`); both surfaces at once |
| `ownerBit` (`traditionsKernel.js`), an institution keeper | It is kept by {institution}, who answer for its fortune. | It is held at {institution}. | keyed on `rec.ownerKind`, which the record carries; a power keeper is unchanged ("…, who answer for its fortune."). The two reasons likewise: "…the standing of {institution}." and "…borne lightly since it is held at {institution}" |
| Relationships empty state | Generate a settlement to see relationship data. | No neighbours, ties between people or conflicts are recorded for this settlement. | prints under `!hasAny`, which reads exactly neighbours, ties and conflicts |
| `AccountSubscriptionSection.jsx:155` | Cartographer = unlimited + cloud sync. Phone, laptop, table. | Cartographer = unlimited saves. | free saves are server rows too (TIER-PARITY-FIX V6's rule); "Phone, laptop, table." was the sync claim's own tail |
| `InstitutionsTab.jsx:221` | Who this house stands behind. Your choice replaces what the engine derived. | Who this house stands behind. Your choice replaces the original. | the audit's NEW ("the one the town gave it") struck under the census law: the town gave nothing. The button "As the engine has it" is a LABEL (the owner's) and is left |
| trade drift headline (`tradeFlowEconomics.js`), on a thorp | …what the town depends on is not arriving. | …what the thorp depends on is not arriving. | the corpus line kept; the reader speaks the tier noun (`speakTierNoun`), the two readers pass the tier |
| freshness note (`economyFreshness.js`), on a thorp | Something has changed in this town since… (both variants) | …in this thorp since… | the constant kept byte-for-byte (the annex's canonical rows read it); the reader speaks the tier noun; a town reads the constant by identity |
| validator tier warning (`structuralValidator.js`) | {institution} requires {minTier} tier minimum. {reason} | {institution} is found only in a {minTier} or larger; this is a {tier}. {reason} | reads `gate.minTier` and the settlement's tier, nothing more; the reasons are SW-2's and untouched |
| realm arcs (`realmArcSummary.js`, `worldSnapshotPublic.js`) | the same five sentences spelled by two writers | one writer, `realmArcSentences.js`; each projection keeps its own selection | printed words identical in every case both reached; one edge made right: a siege naming no besieger read "…where  lays siege." on the owner's surfaces, now "…where an army lays siege." as the public one already read |

## 3. The deltas (measured in clean worktrees: the parent `8b75f466a`, the vetoes' tip `56491754d`, the product tip `5310af5fa`), UNSIGNED, for STYLE-2-MERGE

| surface | parent `8b75f466a` | vetoes `56491754d` | product tip `5310af5fa` | moved |
|---|---|---|---|---|
| generator golden master /525 | green 3/3 | green 3/3 | green 3/3 | **0** (the validator's reason is not in the master) |
| espionage fence /360 | green 21/21 | green | green | **0** |
| herald knowledge desk | green 3/3 | green | green | **0** |
| composed-prose manifest /1,050 | red, 3 arms (the DRIFT corpus, the drift arm, the mixed-pool audience arm) | the same 3 arms | the same 3 arms | **0 cells**: `prose-manifest-diff` parent → each tip, 74,491 cells UNCHANGED over 525 towns, 0 of every other class |
| witness (`presetLightingWitness`) | green 7/7 | green | green | **0** |
| PDF view-model snapshot | green 4/4 | green | green | **0** — the brief expected the kicker and heading reverts to move it; measured, they do not: the view model carries no Callout kicker (`StateProse` and `PowerStructure` render the labels from constants at draw time) |

Nothing for STYLE-2-MERGE to sign on these six. The generator cause (`5673f14f1`, the validator) and the worldPulse cause (`66a3ba5e3`, the kernel's `ownerBit`) are listed as UNSIGNED causes all the same, with these zero deltas.

**Registers through their doors:** `tests/lint/.prose-numerics-baseline.json` re-addresses `worldSnapshotPublic.js` 628 → 615 (address rot: path, category and snippet byte-identical; one -/+ pair), noted in `proseNumerics.test.js` (`5310af5fa`). Three earlier causes had disturbed the same ratchet before any push (the ownerBit reasons' nested templates read as three new rows; two comment lines re-addressed four rows); `a8304e7a9` re-shapes them so no baseline row moves for them and no printed byte changes. The roster is dated by this record (§6).

## 4. The referee (the 1,000)

`node scripts/audit/soak-review.mjs --count 1000 --workers 2` in clean worktrees at the parent `8b75f466a` and the product tip `5310af5fa` (580 s and about 540 s; 1000 settlements, 702 findings, 0 errors on both).

- **Findings:** `findings.jsonl` and `aggregates/finding-classes.json` BYTE-IDENTICAL; `coh:tier-noun` 0 on both runs.
- **The twenty most-repeated frames: RAISED BY VETO 4, and by nothing else.** The split governance sentences enter the top twenty. Two old joined frames leave it: #10 "poverty and crime have cost the @ its standing, and few in @ still accept its right to rule." (242 towns) and #11 "few in @ still accept the @'s right to rule, now that poverty and crime have cost it its standing." (234). Five enter: "@ is governed by the @." (325, NEW, the seat's arrangement 0 without its name clause), "few in @ still accept its right to rule." (302), "few in @ still accept the @'s right to rule." (290), "poverty and crime have cost the @ its standing." (242), "poverty and crime have cost it its standing." (234). Skeleton repetition, all towns, 0.108 → 0.111; skeletons in ten per cent of towns 96 → 99; the median story sentences per town 72 → 74; exact repetition, same tier, 0.096 → 0.095. **STOP 4 to the chair; RULED (08:5x): the default stands, 56491754d kept.** The five split skeletons are **the owner's frames (veto 4)**: "@ is governed by the @." 325 · "few in @ still accept its right to rule." 302 · "few in @ still accept the @'s right to rule." 290 · "poverty and crime have cost the @ its standing." 242 · "poverty and crime have cost it its standing." 234. STYLE-2-MERGE reads "the twenty frames not raised" against the base's twenty by skeleton (none raised; two leave) and records these five by name beside the gate, excepted as the owner's. No variants now; any later variation by the record is SW-9b's.
- **The walker's phrases on this lane's lines** (A10's list, by source): "the engine" 1 → 0 (`InstitutionsTab.jsx:221`); "the record" +0 (the unrecorded-seat sentence keeps its words, only split); "faction" 0 added or removed; every other phrase unchanged.

## 5. Reds named by their cause (none is this lane's)

Each was measured at the parent `8b75f466a` in a clean worktree with the same failures:
- `tests/property/dossierProseManifest.test.js`: three arms (the DRIFT corpus, the drift arm, the mixed-pool audience arm). The merge wave's, signed once at the final tip. 0 cells moved here.
- `tests/components/dossierPhoneFloorAllViews.test.jsx`: two arms, DESKTOP_BASELINE World/NPCs 220 → 222 and a hidden-allegiance line under the floor. The failures are byte-identical at the parent and this tip; the cause is upstream of this base (the NPC card's allegiance line).
- `tests/architecture/layerBoundaries.test.js`: the import cycle `generators/foodGenerator.js | generators/isolationSupport.js`, identical at the parent.
- `tests/lint` at the parent: 207 files and 3,061 tests, all green. Every lint red at this lane's commits was this lane's and is cured before the push (prose numerics, negative anchors, the drawn anchor, the wiring census stamp, the past-EOF citation, the lighting census title count).

## 6. The roster

This record is born dated: `dated` 185 → 186, `_rosterGrowth2026-11-09-style-2-odd-rows` in `tests/lint/.source-citation-baseline.json` and the header line of `tests/lint/sourceCitationIntegrity.walker.test.js`, both by the Edit tool. The three record walkers through `sh scripts/gate-tail.sh` before the push, at the record's final commit: see §6a.

**§6a. The walkers and the registers at `7caedc7f5`.** `sh scripts/gate-tail.sh npx vitest run` over `testRatchet`, `ledgerCitationIntegrity` (with the local ref `review-fixes-2026-07-08` created from origin) and `sourceCitationIntegrity`: 3 files, 111 tests, exit 0. `tree` is green at this base. The whole `tests/lint` folder: 207 files and 3,061 tests green, the same as the parent. The registers moved through their doors, one commit each: the prose-numerics baseline (`5310af5fa`, one address); the wiring census re-taken by its writer (producerIndexFiles 1313 → 1314, the new leaf); the lighting census refrozen by `LIGHTING_CENSUS_REFREEZE` (titles 28,810 → 28,821, suite titles 7,748 → 7,756; no test file added, so the testRatchet register is untouched); one past-EOF packet citation re-addressed to its symbol (`c82bbaa25`). The lint walkers caught the new negative anchors and the quoted drift sentence at their commits; both are cured in `bf4faff48`.

## 7. What stays — for SW-9b (the chair, 08:3x: one writer per line; SW-9b is cut from STYLE-2-MERGE's tip; the merge seat composes and writes no new text)

Each row: file · the owning lane · the cure in one line.

- `docs/census/declarations/DECREE_PROSE.json` · SW-3 (REALM-PROSE) · re-key the verbatim line copies to SW-3's merged decree text at the same ids (the hand batch, as SW-2's).
- `docs/census/declarations/ARRIVAL_MEMORIES.json`, `ARRIVAL_PEOPLE.json`, `ARRIVAL_SCENES.json`, `ARRIVAL_SENSES.json`, `ARRIVAL_TENSIONS.json` · SW-3 · the same hand re-key to SW-3's arrival text, at the same ids.
- `docs/census/declarations/HOOK_ESCALATION.json` · SW-4 (HOOKS-CONNECTIVE) · the same hand re-key to SW-4's `hookEscalation.js` text (CENSUS-2 unit 1; no emitting script).
- `docs/census/declarations/DAILY_LIFE_TAB.json` · SW-4 · the same hand re-key to SW-4's DailyLifeTab text.
- `src/components/new/tabs/RelationshipsTab.jsx:193` · SW-4 (its `plainConflictNature` map) · the pill reads `plainConflictNature(c.conflictNature)` instead of the raw key; the retired word in the same pill is SW-8's map.
- `src/domain/display/causeConjunctionRole/*.js` (the exposed stage) · SW-1 (CAUSE-CONJUNCTION) · more variants per exposed pair and the pick hash salted by the person, so three officials of one town never print one line.
- `src/domain/display/causeConjunctionRole/civic.js:100` (and the other "records office" lines in that file) plus "receipts" in the exposed and captured lines (17 at this base across the role files) · SW-1 · the machinery words become the plain thing (the clerk, the papers); the walker's list widened by the two phrases at the merge.

Also stays, not SW-9b's text rows:
- **The hook-template plural grammar** (FIX-HOOK-OBJECT's intake: "Religious Authorities has", "Merchant Guilds's"): `src/domain/dossier/hookLines.js` (35 two-party templates in seven families, with "it/its" pronouns bound to the party), then every other hook family that slots a power name. One number-aware cause: a party descriptor `{ name, plural }` (plurality by the head word, as `governanceAccount.js :: pluralPowerName` reads it) threaded to every template, verbs, possessives and pronouns agreeing. NOT started: it needs a fresh seat's budget and the soak's per-pool repetition measured before and after (SW-10 shares the pools).
- **`src/lib/viewerAuthority.js`'s stale comment** (TIER-PARITY-FIX's leftover): its last docblock sentence ("OutputContainer keeps a census row for a SEPARATE read (`viewerIsPremium`, War & Faith tab presence)") goes stale only with TIER-PARITY-FIX's V2, which is not in this base; here `OutputContainer.jsx` still reads `viewerIsPremium` for the Faith tab, so editing it now would make it false. After TIER-PARITY-FIX merges.
- **`legacyGenerator`'s wrapper** (A11, "if SW-7 did not take it"): `legacyGenerator.js` is in SW-7's manifest (A2); left to it.
- **Veto 3 and SW-B4's two connective lines** (§1): RULED by the chair (08:1x) — the merge seat takes the PRIOR text for the three hunks at SW-B4's merge point (`src/pdf/sections/Overview.jsx:307` "CHARACTER & ORIGIN"; `src/pdf/sections/TonightAtTheTable.jsx:24`; `src/pdf/lib/crisisPrint.js:25-26`, all on SW-B4's lane) and signs the PDF snapshot's move there.

## 8. CONFIRMED against PLAUSIBLE

CONFIRMED (executed, receipts above): the base and the cut; every pin red at the parent and green at its commit; the six deltas at the parent and the tips; the drop-cap measure; the inherited reds identical at the parent. PLAUSIBLE: the readings of veto 1 (no heading, PDF "The place") and veto 4 (the joining clauses are the connective copy), both the owner's to correct by a word; that "Your choice replaces the original." and "It is held at {institution}." read to the owner's standard.
