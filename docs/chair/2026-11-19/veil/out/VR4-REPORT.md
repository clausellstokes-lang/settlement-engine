# VR4 (+ VR5, V9-3, VR6) MEASURE — the roster-chosen class on the joined tree

Seat: VR4 measurement, read-only. Tree: `/home/user/wt/veil17-walk` at `3fce0a80e` (the veil lane joined with PR #75 head
`8f3b8bf4b`; merge-base `e969a75b7`; `origin/master` = `db832c892`, which is an ancestor of both). Nothing tracked was
changed. Every instrument and output is under `/var/tmp/v17/out/vr4/`. The only databases touched are this seat's own
scratch chains `vr4x212` (001..212) and `vr4x211` (001..211), built on the local cluster (unix socket `/var/tmp/rv7`) by
REVIEW-VEIL-6's `chain.sh`. The rows were inserted, read and deleted again. Nothing is hosted.

## 0. Method (what was executed, what was only read)

EXECUTED:
- `probe/vr4.probe.jsx`: 240 born towns (seed prefix `v11-ties`, six tiers × {calm, infiltrated} × 20, the r5-born set),
  generated on the joined tree. The seams that choose by roster are wrapped. On each call, each seam is answered a
  second time on the SERVED roster, meaning the roster without every `isHideableHouse` row (the default veil's
  removal). The client twin's `projectShareVeil(galleryPayloadFor(born, mo), mo)` removed exactly those houses in
  240 of 240 towns. Two whole-field producers that draw nothing, `generateSafetyProfile` and
  `settleCrimeLinesToSignal`, are re-run on the served roster, and their outputs are diffed key by key against the
  real ones. A census wrapper on `isCriminalInstitution`, `institutionMatchesRegex` and `institutionMatchesNativeName`
  records every caller that asks about a hidden house. I checked that the wrapping changes nothing: on 24 towns the
  wrapped birth is byte-equal to the unwrapped birth (0 of 24 perturbed; first run, `born240.jsonl`).
  Outputs: `born240c.jsonl`, `born240c.agg.txt`.
- publicProse: `composePublicProse(born)` against `composePublicProse(born minus hidden houses and their service
  rows)`, diffed block by block. This isolates the composer's own choices; stored strings carried into a block are
  equal on both sides.
- `probe/holders.probe.jsx` (VR5 folded in): covers the 94 towns that hold a hideable house. Each town is run in both
  stored shapes (new shape with publicProse; master's old person/tie shape, using r5-born's transform) × {the default
  veil with Reveal DM off; with Reveal DM on} × {client twin, 212 gallery, 212 link, 211 gallery, 211 link}. It
  records what each read sends at the class paths and on the holders' cards. Output: `holders.jsonl`, `hagg.py`.
- `probe/shadows.probe.jsx` (V9-3): covers all 240 births. For each it records whether the stored
  `spatialLayout.quarters[]` holds "Shadows District" and whether the served roster would have drawn it. For the
  towns that hold it, it reads them in the new shape × {Reveal off, Reveal DM} × {client, 212 gallery, link and
  import; 211 gallery, link and import}. Output: `shadows.jsonl`.
- `probe/income.probe.jsx` (VR6): runs over the 94 default-veil payloads (`pub240.jsonl`). It measures the
  income-share gap on the client twin's served read, and re-derives `economicComplexity` from the served rows.
  Output: `income.jsonl`.

READ ONLY: the (i)/(ii) attribution (git blobs at `origin/master`, `e969a75b7` and `8f3b8bf4b`), the server's
recomposability (211/212 text), the cost analysis, and master's own births (I did not run master's generator; the
master-shape rows below are this tree's births stored in master's shape).

The base population: **94 of 240 towns hold at least one hideable house** (thorp 3, hamlet 3, village 4, town 14,
city 30, metropolis 40). Under the default veil every one of them is hidden whole.

## 1. THE CLASS: every stored field chosen by a house the veil can hide whole

House class = `cardVeil.js :: isHideableHouse` (criminal category or priorityCategory; the clandestine,
institutionFunction or subterranean facet; an illegal brokerage). This is the twin of 211's `_gallery_veil_house`.

Counts are towns out of 240 (94 with a hidden house). "flips" = the served roster answers otherwise. "ships" = what
the default-veil read sends.

### (i) Introduced by PR #75 (in `git diff e969a75b7 8f3b8bf4b -- src`; absent from master and the base)

| # | Stored path(s) | Chosen by | Measured | Ships today | SQL recompose? |
|---|---|---|---|---|---|
| i-1 | `economicState.safetyProfile.guardEffectivenessDesc` tail; its copies `publicProse.blocks["defense:posture"].{posture,terrain}.field`, `blocks["defense:state"]` | `gatesSmugglersLine`: `BENEATH_THE_WALLS` regex (`smuggling network/operation`, `underground network/city`) over names | stored in **46 towns; all 46 flip**. Hidden houses involved: Smuggling network, Smuggling operation, Underground network, Underground city | **every read**: client and 211/212, gallery and link, Reveal off and on, both shapes (46/46; publicProse copies in 46) | **YES, exactly.** The twin is a fixed template `" Everyone comes and goes by the gates, so smugglers have to get past the ${lawRef}."`. `lawRef` and the verb are read back out of the chosen sentence `" The ${lawRef} keep(s) the gates, but smugglers have ways in beneath the walls."`. The choice is "any SERVED house name matches the regex", and SQL can judge that from the served roster. The tail survives the later truth passes (pay/rota/patrol), which rewrite only the head (33 of the 46 were rewritten later and the tail stood). |
| i-2 | `safetyProfile.safetyDesc` (Very Safe line) | `beneathTheWalls` → `GATES_KEPT_SMUGGLERS_BENEATH` | **3 towns stored, 3 flip** | every read | **NOT exactly.** The other wording is `said(' Everyone comes in by the gates, where the guard sees them.')`, a declared sibling resolved against `factsOf`, so the server cannot know which sibling. (a) works only through a twin stored at birth (§3). |
| i-3 | `safetyProfile.safetyDesc` "organized crime has {a limited foothold \| found no foothold}" | `footholdWord(hasCriminalOrg ‖ inst.hasCriminalInst ‖ /gambl/)`; `hasCriminalOrg` = `/thieves\|criminal\|gang\|smuggler\|fence/` over names | 17 calls with "a limited foothold" in hidden-house towns; **7 towns store it**; flips where no served house matches (gambling halls are not hideable and keep it) | every read | **YES, exactly.** Binary word swap. The predicate is three name tests over served names; 212 (15) already holds the `hasCriminalInst` keyword list. |
| i-4 | `safetyProfile.crimeTypes["Background crime"]` (`NO_DOMINANT` twin), `["Criminal governance"]` (`VACUUM` twin) | `settleRosterCrimeLines(…, seated ‖ oneRingRules)`; `oneRingRules` = crime key over the estate | oneRingRules flips 18; Background crime only on the served side in 16 | withheld, but only while `block:defense.criminalStructure` is shut (default) | twin text is fixed (exact if needed) |
| i-5 | `crimeTypes["Street gang activity"].desc` (the "Territorial gangs" variant) | `GANG_HOUSES_OF(institutions) >= 2` | flips 10/10 calls | withheld only while the grouping is shut | count over served names: exact |
| i-6 | `safetyProfile.economicDragDesc` "…without a licence or a duty paid.[ It is noticed, and so far it does little harm.]" | `factsOf({institutions}).crime === 'organized'` (UPKEEP-8 #1377) | part of the 54 below | ships | twin is fixed, but the crime key is a ladder over names + seats + income + chains: (b) |
| i-7 | `safetyProfile.plotHooks` smuggling hooks under siege | `smugglingHookUnderSiege` (the hook itself drawn when `hasSmuggling`) | in the 56 plotHooks diffs | withheld only while `tab:plot_hooks` is shut | — |
| i-8 | `safetyProfile.flags.theocraticEconomy`, `CRIME_WAVE_TWINS` lines | seats and tensions (not houses), except where the crime-wave tension was itself house-chosen (ii-6) | — | — | not house-chosen directly |
| i-9 | NPC secrets: "thieves' guild" / "the local underworld" / "a powerful outside interest" (`npcs[].secret.what`) | `crimeHasThievesGuild(crimeSignal)`, `withTownsOwnUnderworld` (castPowers flips 49/79, npcGenerator 94/94) | flips as shown | withheld by `class:npc:secret` (default); **sent on Reveal DM**, where "the local underworld" tells that crime stands when the only crime is a hidden house | (b) |
| i-10 | the composer's `publicProse.blocks["economy:economics"].shadowEconomy.sentence` (DS-ECO-6) | the desk line's facts at compose (crime atom over the roster) | **9 towns differ** | ships (no grouping covers it) | (a) at compose (§3) |
| i-11 | `publicProse.blocks["defense:criminal"].{structure.sentence, ringNote}` | crime key / rings over the roster at compose | 51 / 45 towns differ | withheld while `block:defense.criminalStructure` is shut | (a) at compose, else (b) |
| i-12 | `npcs[].institution` `{kind:'house', key, title, veiled}`, `npcs[].role`, `.title` (the house's face, VR5) | `representatives.js` births: a face per house, its title the house kind's word | see §2 | see §2 | by identity: yes (§2) |

### (ii) Already on origin/master (deployed today; master has no 211/212, only the client twin `galleryVeil.js`)

| # | Stored path(s) | Chosen by | Measured | Ships | SQL recompose? |
|---|---|---|---|---|---|
| ii-1 | `crimeTypes` entries' EXISTENCE (Smuggling 55, Street gang activity 10, Organized guild crime 3, Arcane black market 9, Commercial crime 7, Survival crime 6, Religious fraud 4, Lawlessness 3/5…) and the Survival-crime / debt-evasion line variants | `getInstFlags` (`hasSmuggling`, `hasGangInfra`, `hasThievesGuild`, `hasBlackMarket`) and `settleCrimeLinesOnly`'s `crimeSignalOf(...).present` (flips 77/108) | 77 towns differ | withheld only while `block:defense.criminalStructure` is shut | entry existence: (b) |
| ii-2 | `safetyProfile.criminalInstitutions` | `CRIMINAL_INST_LABELS` over names | 78 | withheld (grouping + name sweep, 212 (16)/(19)) | **(iii)** |
| ii-3 | `economicState.compound.inst.{hasCriminalInst, hasThievesGuild, hasBlackMarket, hasSmuggling, hasGangInfra}` and `safetyProfile.compound.inst.*` | `getInstitutionNames` | 81 / 55 / 37 / 39 / 23 | **212 recomposes (15)**; 211 alone sends them true in 17 of 28 sampled towns | (iii) on 212. Side note: 212's `hasGangInfra` keyword list holds "front business", but the client's `gangHousesOf` does not, so with Front businesses revealed and Street gang hidden, 212 leaves `true`. |
| ii-4 | `compound.inst.hasGuild` (a thieves' guild counts as a guild) and the other non-criminal flags a hidden name raises | `getInstitutionNames` | hasGuild flips 31 | ships | item C / V7-8, **d06 still red**: this is the open part |
| ii-5 | **`economicState.compound.{criminalEffective, criminalPreStress, militaryEffective, economyOutput, religionInfluence, magicInfluence, raw}`** and `safetyProfile.compound.*` | `criminalInstMult = hasCriminalInst ? 1.0 : 0.55` | **94/94 differ**; sent on **every** read | ships | **Invertible:** `criminalPreStress / (raw.criminal × three multipliers computed from raw) = 1.0 or 0.55`. This hands back exactly the `hasCriminalInst` that 212 (15) set false. Worked example: v11-ties-town-calm-5 has 22.72 / 41.31 = 0.55. Recompose: no. (b) for `raw`, `criminalPreStress`, `criminalEffective` (§3) |
| ii-6 | the stored bands `safetyProfile.safetyLabel` (49), `safetyRatio` (78), `safetyDesc` band sentences (≈44), `economicDragDesc` existence and band (54), `flags.{arcaneBlackMarket, merchantCriminalBlur, religiousFraud, anyActive, merchantArmy}` (13); defence, prosperity, ruling-structure, conflicts, ties and history-strand inputs (`getInstFlags` callers: 75 to 81 towns each) | `criminalEffective` (through `hasCriminalInst`), `hasCriminalOrg` (community-order bonus and court floor: an exact 0 vs 1.2/1.25 in `safetyRatio`) | as shown | ships | **No.** These are diffuse: the hidden house is one input among priorities, stresses and the military. Exception: `safetyRatio` landing exactly on 1.20/1.25 is the community bonus, which is the no-criminal-org flag. |
| ii-7 | `history.currentTensions[type=crime_wave]` (EXISTENCE) | `historyGenerator.js:551`: drawn only where `crimeSignalOf(...).present` | flips 7/14 | ships | (b), exactly judgeable: withhold where the SERVED signal is false (no criminal seat, no served criminal house) |
| ii-8 | the NPC roster itself: criminal NPCs drawn, their affiliations and goals (`npcGenerator.js:722`: `noCrime`) | `crimeSignalOf` | flips 94/94 | ships | draw-coupled: cannot be recomposed. Only what NAMES the kind can be withheld (§2) |
| ii-10 | **`spatialLayout.quarters[]` "Shadows District"** (V9-3; `spatialGenerator.js:228`; on master) | `has('Thieves' \| 'criminal' \| 'Black market')` over names | **66 of 240 towns (every city and metropolis that holds one: 29 + 37); 66 of 66 hold a hidden house; 0 of 66 would draw it on the served roster** | **sent in 66 of 66 on all 14 cells** (client; 211/212 gallery, link and import; Reveal off and on) | exact (a substring test), but nothing draws it: see §2b |
| ii-11 | `history.historicalEvents[type=crime_wave]` (`historyGenerator.js:434/469`, `if (hasCriminal && … _rng() > 0.5)`; :486 the small-place `fence/smuggl/bandit/outlaw` branch; on master) | `priorityCategory === 'criminal'` / name test | read only; draw-coupled (the `_rng()` call is reached only where the house stands) | the event card ships with its own eyes | (b): withhold the event of that type where no SERVED criminal house stands |
| ii-12 | `npcs[].allegiance.handler`, the handler ties ("The Patron No One Names"), the trace's "The allegiance runs to the town's criminal power" (Reveal DM; the lane's item B) | `allegiance.js :: criminalHousesOf` (isCriminalInstitution over the hidden house: 94 of 94 towns asked) | read only | Reveal DM only (`class:npc:corruption` default) | (b) by identity: the allegiance's house or handler is the gone house's holder |
| ii-13 | **the income shares `economicState.incomeSources[].percentage` (and `.weight`) once the criminal row is withheld** (VR6) | `shareIncomeRows(rows, held)`: the lawful rows share `100 − held` | **42 of 94 towns carry a criminal row; the client twin's served shares sum to 100 − held in 42 of 42: the gap IS the criminal share exactly**. The gaps run 11 to 25 (25 ×7, 16 ×5, 17 ×4 …). `weight` is sent on every row too, so the share is recoverable two ways. | ships (the row goes, the gap stays) | **YES exactly**: `round(weight / Σ lawful weights × 100)`, the remainder to the largest row, as `shareIncomeRows` does itself (or largest-remainder as VR6 asks). See §2c |
| ii-14 | `economicState.economicComplexity` and its copy `publicProse.blocks["economy:economics"].prosperityHeader.detail[Economy]` | `deriveEconomicComplexity(tier, rows.length incl. the criminal row, exports, hasInst('market','trading','merchant','guild'), food, rows' shares)` | **9 of 42 change on the served rows** ("Highly diversified" ↔ "Diversified" in 8 cities and metropolises; a town "Diversified market economy" → "Specialized production and trade"). In these 94, the market word was never raised by a hidden house alone (0), but "Black market" / "Thieves' guild" do raise it by name | ships | exact in SQL (a small ladder over stored tier, count, exports and food), or a stored twin |
| ii-15 | `publicProse.blocks["economy:economics"].incomeMix` ("depends on one source of income", 3 towns); `["power:desk"].structureFlag` ("the richest merchants and the criminal bosses are often the same people", `flags.merchantCriminalBlur`, 1 town; **not** in 211's Capture list) | the composer over the owner's rows / flags | read in the payloads | ships | (a) by second composition, else (b) |
| ii-9 | `npcs[].role/.title` of master's criminal people ("Thieves' Guild Master", "Smuggler Chief", "Crime Lord", …; old shape, `institution` = house key string) | the criminal role table (`historyData.js` `criminal:`) | the reader's V9-2: 19 people on master's shape | ships on master's shape, Reveal off and on | by identity where `institution` names the house; otherwise (b) |

### (iii) What the veil already handles

- 212 (15): the five criminal compound booleans.
- 212 (15)/(16)/(19): the criminal income row and `criminalInstitutions`, by name.
- X-21e: the hidden house's `availableServices` rows and the institutions list.
- 211 npc pass: `npcs[].institution` of a gone house.
- 206 / `publicVeiledRecordOf`: role and title of a veiled face on the new shape with Reveal off.
- The default groupings, while shut: `crimeTypes`, `plotHooks`, `blackMarketCapture`, `publicProse["defense:criminal"]`, NPC secrets and corruption.
- The trace by positive account: item B / V7-5 (a07).
- NOT handled: item C / V7-8 (d06) on the non-criminal flags.

The groupings are a weakness. They protect the class only while the owner keeps them shut. An owner who opens
"Criminal architecture" and keeps the house hidden gets ii-1, i-4, i-5 and i-11 sent.

**CLASS COUNT: 12 site-families (i) + 15 (ii) + 7 handled (iii)** (ii-10 to ii-15 added for V9-3, VR6 and the two LOWER notes).

| | Count | What |
|---|---|---|
| Assertive (a binary/count choice that can be inverted) | 9 | i-1, i-2, i-3, i-4, i-5, i-6, i-10, i-12/ii-9, ii-7 |
| Diffuse or draw-coupled | 4 | ii-5, ii-6, ii-8, i-9 |
| Shipping today on the default veil with every grouping at its default | 12 | i-1, i-2, i-3, i-6, i-10, ii-5, ii-6/7, ii-10, ii-13, ii-14, ii-15, the holders |

## 2. VR5 — the holders (executed; `holders.jsonl`, 94 towns)

94 towns; 350 cards whose `institution` (identity) is a hidden house (faces and members). Default veil
(`writeShareVeil({}, [])`), 20 read cells per town:

| shape · share | client twin | 212 gallery | 212 link | 211 gallery | 211 link |
|---|---|---|---|---|---|
| new · Reveal off | role/title 0 | 0 | 0 | 0 | 0 |
| new · Reveal DM | **335 cards / 89 towns** | **335 / 89** | 0 | **350 / 94** | 0 |
| old (master's) · Reveal off | **335 / 89** | **335 / 89** | **335 / 89** | **350 / 94** | **350 / 94** |
| old (master's) · Reveal DM | **335 / 89** | **335 / 89** | **335 / 89** | **350 / 94** | **350 / 94** |

- Wherever role/title is sent, the ties' `npc1Role`/`npc2Role` copies are sent in the same towns (89, or 94 on 211).
  On 211 alone with Reveal DM, the holders' kind-words also appear in `npcs[].goal.short/long` (3 towns).
- `npcs[].institution` is stripped on every read (0 of 350).
- **`category: 'criminal'` arrives on 350 of 350 cards in EVERY cell.**
- **The `npc_veiled_` id arrives in 94 of 94 towns in EVERY cell.**
- 212's name sweep removes 15 of the 350 (335 against 350 on 211).

This is consistent with the reader's V9-2: the new shape with Reveal DM; master's shape in both modes.

Every path a holder's kind-word lives in the record: `npcs[].role`, `npcs[].title`, `npcs[].institution.title` (the
new shape; the server strips `institution`), and `relationships[].npc1Role` / `npc2Role` (tied by `from`/`to` or
`npc1Id`/`npc2Id`). On Reveal DM, with 211 alone, also `npcs[].goal.short/long`. No faction or powerStructure member
copy carried a holder's kind-word in this set (searched as substrings across the whole document). Two more house-chosen
attributes are on every read:

- **`npcs[].category = 'criminal'`**, on every holder card in every read and shape.
- The card id prefix **`npc_veiled_`** (`VEILED_CARD_PREFIX`), on every read. Each such card says "a house the veil
  hides stands here". The id is the identity floor, so the server cannot withhold it; the cure is the minting
  (§3 G3).

THE TIE BY IDENTITY: the server already decides `gone_houses` and `gone_ids` before any eye trims (212 (18)), and
`_gallery_veil_npc_pass` already matches a card to a gone house by `_gallery_veil_npc_house(n)`. That function reads
`institution.key` on the new shape and the `institution` string on the old one. In that same branch it can drop
`role`, `title` and `category`. `_gallery_veil_tie_roles` (212, today only under Reveal DM) already drops a tie's
`npc1Role`/`npc2Role` for any card that no longer carries `role`. Calling it on every read closes the tie copies by
identity, with no word matching.

WHERE IT CANNOT BE SURE (withhold):

| Case | What the server sees | Rule |
|---|---|---|
| (a) Reveal-off new shape | the projection has already stripped `institution`, so the link is gone before the veil runs | fall back to the `npc_veiled_` id |
| (b) A legacy or old-shape card with no `institution`, or one whose institution names a renamed house | no identity tie | fall back to `category = 'criminal'` |
| (c) Master's criminal-role people ("Crime Lord", "Thieves' Guild Master"), who may be tied to no house | no identity tie | — |

The rule, failing toward withholding: where ANY house is withheld whole, a card that is `npc_veiled_*` or
`category = 'criminal'` and has no surviving tie to an open house or an open power loses `role`, `title` and
`category`, and its ties lose their role copies. The open-power name exception never restores a role whose house is
withheld (VR5).

## 2b. V9-3 — what draws `spatialLayout` on a non-owner page (read; the class row executed, ii-10)

NOTHING DRAWS `spatialLayout.quarters` ON ANY SURFACE A NON-OWNER REACHES:

| Surface | What it does with `spatialLayout` |
|---|---|
| OverviewTab | Cut by the owner's X-37 (2026-11-01): "nothing on this page reads it" (`OverviewTab.jsx:304-309`). |
| SummaryTab / SummaryTabV2 | The only components that render quarters, and both were REMOVED (X-5): "nothing in src imports them" (`dossierLazyTabs.js:13`). |
| Gallery detail, party link, public dossier | `GalleryDetail.jsx`, `PartyLinkView.jsx`, `PublicDossierView.jsx`, `GalleryPage.jsx` read no `spatialLayout` and offer no PDF or journal export. |
| PDF | Keeps `quarters` in the view model and prints none (`Overview.jsx:396`, `IdentityDailyLife.jsx:230`, pinned by `tests/pdf/quartersNotPrinted.test.jsx`). It DOES print `spatialLayout.layout` as the "Layout" row (`IdentityDailyLife.jsx:51`). |
| Foundry journal | No quarters section (`journalPages.js:294`). |
| Domain readers (`districtProfile.js`, `townLayoutV2.js`, `spatialSubstrateDerive.js`, `interiorModel.js`, the world pulse's urban-fabric/spatial kernels) | Owner-side derivations. No component, PDF or journal module imports `deriveAllDistricts`. |
| Import result | The import result becomes the importer's own record, so the importer's PDF would print `layout`, and their campaign kernels would read `quarters`. |

**A lawful cure that costs a non-owner reader nothing visible: withhold `spatialLayout.quarters` whole** on every
non-owner read (gallery, link, public, import). This is a fixed path, constant-time `#-`.

Withholding the WHOLE `spatialLayout` would also cost the importer's PDF its "Layout" row. On the gallery, link and
public pages it costs nothing, because they draw none of it. `layout` itself is not house-chosen (it was not
measured as chosen; read only). Placement: **(b) by "nothing draws it": `spatialLayout.quarters` on every read; the
whole `spatialLayout` on gallery, link and public if the chair prefers one rule.**

THE SAME REASONING ON THE REST OF THE CLASS:
- `economicState.compound.{raw, criminalPreStress, criminalEffective}` and `safetyProfile.compound.*`: no component,
  PDF or journal reads them. The readers are the world pulse (`factionDensityKernel`, `espionageMath`,
  `undercity/colonization`) and `corruption.js :: readCorruptionClimate` (its page caller is the owner's
  `EventComposer.jsx`). So nothing draws them on a non-owner page; on import they feed the importer's simulation.
  `economyOutput` and `militaryEffective` ARE drawn (`EconomicsTab.jsx:363`, `dailyLifeLogic.js:108/128`, the PDF),
  so those two do not qualify.
- `npcs[].institution` is already stripped.
- The `weight` on each income row: nothing draws it (the tab, the journal and `normalizeIncomeSources` read
  `percentage`).
- `safetyRatio`, `safetyLabel`, `flags`, `economicDragDesc`, `crimeTypes` and `plotHooks` ARE drawn (DefenseTab
  bands, `dailyLifeLogic.js:90`, `safetySeverity.js`, the PDF, the desks), so the "nothing draws it" reasoning holds
  for none of them.

The chair's earlier line, PART 9 §5 (2026-11-13 21:40 UTC), said: "THE LAW DOES NOT REACH a separate fact that does
not name the hidden thing (a stability label, a quarter's description, …)". V9-3 and VR4 now reach a quarter's
description. The diffuse bands in ii-6 are the remaining rows that line still covers, and they need the chair's
re-statement.

## 2c. VR6 — the income shares (executed: `income.jsonl`; read: the readers)

- **The tell, measured.** The criminal row is withheld today on the default veil (0 of 42 rows kept by the twin; 212
  the same, by the array-overlap `&&` over the two groupings, `212:1472`). The remaining shares sum to `100 − held`, and the gap equals
  the criminal share EXACTLY in 42 of 42 towns. Each row also carries `weight`, and `percentage / weight` gives
  `(100 − held) / Σ lawful weights`, which is a second exact route.
- **SQL can re-derive exactly.** `percentage' = round(weight / Σ lawful weight × 100)`, then put the difference to
  100 on the largest row. That is `shareIncomeRows`'s own rule (`incomeLineSiblings.js:313`); VR6 asks for
  largest-remainder rounding, and the chair picks one. It is one pass over one fixed array.
  - Every row in the 42 carries `weight`. A row without one (legacy) falls back to the stored percentages, scaled.
  - With nothing left: no breakdown (`[]`).
  - Re-deriving from `weight` keeps `percentage / weight` consistent, so the second route is closed too. The other
    option is to withhold `weight`, which nothing draws.
- **Every surface reads the served numbers.**

  | Surface | Reads |
  |---|---|
  | Economics tab bars, `EconomicsTab.jsx:246/435` | the stored `percentage` |
  | Foundry journal, `journalPages.js:391` | `Math.round(s.percentage)` |
  | PDF, `normalizeIncomeSources` | today it re-derives proportionally from the PERCENTAGES when the sum falls outside 95..105, so it disagrees with the tab |

  All three print what the server re-derived, and the PDF then trusts the field because the sum is 100.
- **The sentences that carry the criminal income go with the row.**

  | What | Count | Rule |
  |---|---|---|
  | the row's `desc` | — | goes with the row |
  | `publicProse["economy:economics"].incomeMix` | 3 | go, or are re-composed |
  | `.criminalLine` | — | go, or are re-composed |
  | `economicComplexity` | 9 of 42 change | must be re-derived (count without the row; the served shares; the market word over the served names). This is exact in SQL as a ladder, or by stored twin. |
  | prosperityHeader's "Economy" detail | — | its copy |
  | `economyStateProse :: incomeMixPoolKey` / `criminalIncomePoolKey` | — | read live on the client from the served rows, so they follow by themselves |
  | `flags.theocraticEconomy` (tithes ≥ every row) | — | cannot be flipped by removing a row: unaffected |

- **Item D** ("the income row by its house"; PART 12 §4, carried to PART 17, its line 113) meant withholding the row by
  the HOUSE's eye, not only by the two groupings. **VR6 does not subsume D. D is the trigger, VR6 the repair.**
  Proposed: withhold the row where either grouping is shut OR any criminal house is hidden whole (D), then
  re-derive (VR6). A hand reveal of the house AND both groupings restores the true row and shares. Display only: no
  new stored field.

## 3. THE ONE MECHANISM (proposed)

**Every roster-chosen field (and every figure derived from a row or a house the veil withholds) is registered once, in a ROSTER-CHOICE REGISTRY (one module; path, chooser, house
predicate, rule). At birth the generator stores, beside the chosen wording, its served-roster twin keyed by the set of
houses whose absence flips it. The server and the twin then do one of two things, path by path:**

- **(a) RECOMPOSE**: substitute the twin when every house in its key is gone. This covers both an exact binary twin
  and an exact count twin.
- **(b) WITHHOLD**: drop the field whenever a hidden-whole house could have chosen it, i.e. any house in its key is
  gone and no twin is stored, or the field is not exact.

A record born before the registry has no twins, so it falls to (b) for every registered path. publicProse is composed
twice at save: once from the owner's record, once from the record minus every hideable house. Where a block differs,
the second composition is stored as that block's twin under the same rule. All hidden → twin; none → real;
some → withhold.

Placement:

| Field | Placement | Reason |
|---|---|---|
| i-1 guard gates tail (and its publicProse copies) | **(a)** exact | Fixed template, a pure name predicate. It could even be done without a stored twin (lawRef read back from the text), but the stored twin keeps one rule. |
| i-3 foothold word | **(a)** exact | — |
| i-5 the gang count | **(a)** exact | — |
| i-4 the NO_DOMINANT / VACUUM twins | **(a)** exact | — |
| i-2 the Very Safe gates line | **(a)** by stored twin; legacy → (b) | The other wording is a facts-resolved sibling. |
| i-10 the shadow-economy sentence | **(a)** by the second composition; partial → (b) | — |
| i-11 the criminal desk | **(a)** by the second composition; partial → (b) | — |
| ii-1 crimeTypes entries and line variants | **(b)** tied to the house's eye, not the grouping's | An opened grouping cannot release an entry a withheld house chose. |
| i-7 plotHooks entries | **(b)** tied to the house's eye, not the grouping's | — |
| i-6 economicDragDesc | **(b)** with `blackMarketCapture` | It is a 3-band rendering of a figure the Capture grouping already withholds. |
| ii-5 `compound.{raw, criminalPreStress, criminalEffective}` (both compounds) | **(b)** whenever any criminal house is gone | They invert 212 (15). The page reads `economyOutput` and `militaryEffective` (Economics and Daily Life scores), and those stay as diffuse. `criminalEffective` is read by `corruption.js:606`; that reader must fall back to the served flags. |
| `safetyRatio` | **(b)** on the same condition | The raw float is retired from display (DefenseTab, OverviewTab), so the page loses nothing it prints. |
| ii-7 crime-wave tension | **(b)** where the SERVED crime signal is false | Exactly judgeable. |
| i-9 NPC secrets on Reveal DM | **(b)** where the substitution was chosen by a gone house | Fall back to the class switch. |
| i-12 / ii-9 / VR5 `role`, `title`, `category`, tie roles | **(b)** by identity, with the fallback in §2 | — |
| ii-6 bands (`safetyLabel`, `safetyDesc` band, flags, defence, prosperity) | **NOT placed: the chair's/owner's call** | Withholding them under (b) blanks the safety label and band on 49 of the 94 towns that have a hidden house (≈20% of all towns). The other inputs (priorities) are not public once `raw` is withheld, so a single read cannot invert them. I propose leaving them as diffuse and recording the boundary explicitly. |
| ii-8 NPC roster composition | **NOT placed: the chair's/owner's call** | Draw-coupled; only the kind-words are withheld (VR5). |
| ii-10 `spatialLayout.quarters` (Shadows District) | **(b), nothing draws it** | Withheld whole on every non-owner read, whatever the houses (§2b). |
| ii-11 the crime-wave historical event | **(b)** where no served criminal house stands | — |
| ii-12 the allegiance, handler tie and trace line | **(b)** by identity | Joins item B. |
| ii-13 the income shares | **(a), re-derived from `weight`** wherever the criminal row is withheld | The row is withheld by grouping OR by house (item D). VR6, §2c. |
| ii-14 economicComplexity and its prosperityHeader copy | **(a)** | SQL ladder or stored twin. |
| ii-15 incomeMix / criminalLine / power:desk.structureFlag | **(a)** by the second composition, else **(b)** | — |

What a reader of a shared page loses under (b):
- The Defense safety paragraph keeps its band but loses the "drag" line in 54 of 94 towns.
- Daily Life and Economics keep their scores.
- The crime-wave tension is gone in about 7 of 240 towns.
- Holders show as named people with no role on the card or in their ties (the reader's 19 people on master's shape,
  32 on the new shape with Reveal DM).
- Under (a) nothing is lost: the sentence reads as the served town would.

COST LAW:
- Every rule above is a fixed set of paths. The twins are a small object at a fixed key (`veilTwins`, stripped from
  every read), with one lookup per entry against `gone_ids`.
- The npc and tie passes reuse loops 211/212 already run (`_gallery_veil_npc_pass` over `npcs`;
  `_gallery_veil_tie_roles` over `relationships`, once per read). The compound and economicDragDesc withholds are
  constant-time `#-` operations.
- The income re-derivation is one pass over `incomeSources` (about 10 rows).
- `economicComplexity` is a constant ladder.
- `spatialLayout.quarters` is one `#-`.
- **No new text scan**: nothing searches strings. The legacy fallback for i-1 (reading lawRef back from one string)
  is a single regex on one fixed path.
- Expected cost: negligible against 211 on the large rows. Not timed here.

## 4. THE GUARD THAT KEEPS THE CLASS CLOSED

- **G1, the registry and its walker test.** `src/domain/veil/rosterChoiceRegistry.js` lists every registered chooser
  (`gatesSmugglersLine`, `beneathTheWalls`, `footholdWord`, `gangHousesOf`, `oneRingRules`, `crimeSignalOf`,
  `criminalStructureKeyOf`, `covertCrimeHeld`, `getInstFlags`'s crime flags, `withTownsOwnUnderworld`,
  `isCriminalInstitution`, `isHideableHouse`, `brokerageLegalityOf`, `institutionMatchesRegex` with a crime pattern,
  and the representatives' face births). For each it gives the paths it writes and the placement (a/b) or a declared
  "diffuse" row. A walker test (the tuningRegister / factLayers walker pattern) parses `src/generators/**` and
  `src/components/new/publicProseCompose.js`'s reach. It reds on:
  - any call of a registered predicate from an unregistered site;
  - any new regex literal over institution names containing `thie|smuggl|underground|black.?market|gang|criminal|fence|assassin|clandestine|outlaw|bandit`;
  - a registry row whose path has no server rule in 212's successor and no client rule in `galleryVeil.js`/`gallerySecondHomes.js`.

  The census wrapper in `probe/vr4.probe.jsx` is the dynamic half: callers that ask a hidden house. Today it lists
  safetyProfile.js:103, :705, :838, :850; npcGenerator.js:722; allegiance.js:170; powerSupport.js:276;
  criminalStructureKey.js:62; castPowers.js:314; historyGenerator.js:551. Run as a born-town test, it reds on a caller
  not in the registry.
- **G2, the born-town counterfactual test.** For N born towns, every registered (a) field equals the twin's text when
  the house is gone, and every (b) field is absent. Both engines are covered: the client twin, and the server on a
  pglite chain.
- **G3, the minting.** `VEILED_CARD_PREFIX` is replaced by an id indistinguishable from an ordinary card id (for
  example `npc_` + 16 hex for every card born after the registry). This needs an owner decision, because ids are
  stored references; older records keep their ids.

## 5. Side findings, carried for the chair

1. `publicProse["power:desk"].structureFlag` (merchantCriminalBlur: "…the criminal bosses…") is not in 211's Capture-reading list (`legitimacyReading, captureReading, operationReading, gmAdvisory`) and ships.
2. The PDF's `normalizeIncomeSources` re-derives shares differently from every other surface when the criminal row is withheld.
3. 212's `hasGangInfra` keyword list holds "front business", which the client's `gangHousesOf` excludes (UPKEEP-9). A
   true flag can survive with Street gang hidden and Front businesses revealed.
4. `compound.raw` plus `criminalPreStress` defeats 212 (15) on every read (ii-5).
5. The groupings, not the houses, guard ii-1, i-4, i-5, i-7 and i-11.
6. `npcs[].category = 'criminal'` and the `npc_veiled_` id ship on every read.
7. `safetyProfile.economicDragDesc` is a banded copy of the withheld `blackMarketCapture`.
