# WF — THE OLDER-PROGRAMME READER'S FULL TABLE (faith, WF-0..WF-9)

Read 2026-09-15 against the product lineage at
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneCONSIST-932`,
**HEAD `315080928`** (`LT37 car 6`, 2026-09-15), and the ledger at
`…/f6ac0d98…/scratchpad/ledger-a803dee7a/docs`. Read-only; no suite executed, no git mutated.

Method follows the TRADE pilot's §C: every figure is an executed receipt (grep/read) quoted with
`path:line` and labelled **CONFIRMED**, or **PLAUSIBLE** where it is a derivation of mine or a claim
I could not drive end to end. Every wave-id substring hit was opened in context (see §6 traps).

---

## 1. THE ANSWER FIRST

**Yes — faith was built in far more depth than the WF volume, PROGRAMME-32-34, RECHECK-32-34 or
PRICING-32-33 record, and almost none of it is a WF wave.** Three different programmes have built
faith machinery, and the recon passes see only the first:

1. **The FP FAITH programme itself** (`DESIGN_FP_ARCH_WF.md`, compiled 2026-08-04) landed exactly
   one wave — WF-1, as SIX members `WF-1a…WF-1F` plus the `WF-8A` narration slice (ODQ §215 →
   §352, §376). ⚠ **It is LANDED-DARK, not "BUILT"**: every read of `faithUnseatingEnabled` is a
   strict `=== true` and no preset sets it (`simulationRules.js:295` is a manifest row only).
   PROGRAMME §B's "BUILT — code wins" row does not say that.
2. **The GRAMMAR programme (GR-2 / GR-3a / GR-3b, 2026-08-06)** built ~80 % of WF-6 under its own
   name: the five faith term rows, the crossing, the four-rung ask ladder that PRODUCES them, and
   the mounted peacetime lifecycle. One of the five, `temple_restitution`, **already executes**
   through the generic stream applicator and moves real conserved grain today.
3. ⭐⭐ **A SECOND, ENTIRELY SEPARATE FAITH PROGRAMME — `W-FAITH` (ODQ §797, cars F1c…F7c,
   2026-08-30 → 09-01) with its sibling `W-LIVES`** — built ~1,900 lines of new faith machinery the
   WF volume predates by four weeks and **no recon pass mentions even once**: an influence field
   over the whole pantheon, six boon/bane channels wired into `causalState`'s system variables, a
   vice-pole flaw register, an owner-signature tuning surface, a witness-plane adapter, a deity
   authored-character schema across four surfaces + migration 200, and the FaithTab deepening
   read-model. **The channel wiring is on the production causal path with NO FLAG AT ALL** — its
   door is a named string nothing reads — and is dormant only because no deity in the estate
   authors a boon (`ui:false`).

The two WF-family count rows move: **1 built / 1 part / 8 unbuilt → 0 built / 1 LANDED-DARK / 3 part
/ 5 unbuilt**, and the family acquires **two unflagged live producers** and **four RECORD≠CODE rows**.

---

## 2. THE FULL CLAIM TABLE

Status vocabulary: **LANDED-LIT** (runs in a shipped preset) · **LANDED-DARK** (code present, no
preset lights it) · **LANDED-INERT** (code present, unreachable regardless of flag) ·
**LANDED-UNFLAGGED** (runs on a production path with no gate; dormant only by data absence) ·
**DESIGNED-ONLY** · **RECORD≠CODE**.

| # | Mechanism | Programme (sha/date or §) | WF wave it touches | Status | Evidence at `315080928` | Label |
|---|---|---|---|---|---|---|
| 1 | The **influence field kernel** — every unsuppressed pantheon member weighted `share × rank × standing × patronAmp`, capped, magic-gated | W-FAITH F3c (`8c460ae11`/`6ec67f7f1`, 08-31) | none (new capability beside WF-3/WF-7) | **LANDED-UNFLAGGED** | `faithField.js` 472 lines; `faithFieldProjection` `:448`; called `religionState.js:43` + `:669`; that projection is on the pulse path at `pulseKernel.js:1801` | CONFIRMED |
| 2 | **Six boon/bane channels bound to causal variables** — harvest→food_security, trade→trade_connectivity, craft→economic_capacity, healing→healing_capacity, order→law_order, war_readiness→defense_readiness | W-FAITH F4c (`cae3c7838`/`bcefbf50b`, 08-31) | none | **LANDED-UNFLAGGED** | `faithChannelBindings.js:81-88`; `causalState.js:78` imports, `:156 applyFaithChannel`, called at `:561 :771 :828 :988 :1025 :1074`; swing `CAUSAL_SWING = 20` `:115` | CONFIRMED |
| 3 | The field's **door is a string no gate reads** | W-FAITH F6c (`416cd8ec9`, 08-31) | — | **RECORD≠CODE-adjacent** | `faithTuningSurface.js:175 FAITH_FIELD_DOOR = 'faithFieldEnabled'`; only 3 src hits estate-wide, all comments/the constant; header `:76` "Nothing reads the door today" | CONFIRMED |
| 4 | Dormancy of #1/#2 rests on **content absence**, not a flag | W-FAITH F4c | — | declared | `customContentManifest.generated.js:1623-1627` `boonChannel` `ui:false`, `effect:"mechanical"`, its own `condition` text states the whole wiring; `causalState.js:132` "DORMANT BY ABSENCE, which is stronger than dormant by flag" | CONFIRMED |
| 5 | …but the **admission manifest admits `boonChannel`**, so an import / AI-clerk payload could carry one even with the editor closed | W-FAITH F1c | — | reachability risk | `customContentAdmission.generated.js:709-721` (nine-value enum); same key in `supabase/functions/_shared/aiOutputSchemaBundle.js` | PLAUSIBLE (manifest row CONFIRMED; the end-to-end import was not driven) |
| 6 | The faith tuning surface is **LIT on UNSIGNED numbers** | W-FAITH F6c + ODQ row O-17 (09-03) | tuning class | declared DRAFT | `faithTuningSurface.js:125 FAITH_TUNING_SIGNATURE = { signed: false, live: true }`; `:146 faithTuningArmed = live` (was `signed && live`); `:187 signedBy: null` | CONFIRMED |
| 7 | **Vice-pole flaw register** — `jealous` fades the boon as share is contested; `wrathful` sharpens the temper pull as fortunes fall | W-FAITH F5c (`ae6934048`, 08-31) | none | **LANDED** (rides #1/#8) | `deityFlaws.js` 253 lines; `faithField.js:159 BOON_FLAW` derived from `FLAW_EFFECTS` | CONFIRMED |
| 8 | **The faith pull as a W-LIVES witness-plane source** (the deity's character moves PEOPLE) | W-FAITH F3c act 2 / §806-F14 | none | **LANDED-INERT** | `faithWitnessSource.js` 280 lines; `grep "from '.*faithWitnessSource.js'" src/` → **zero importers** | CONFIRMED |
| 9 | **Authored deity character** — `authoredTemper`, `characterAxes`, `boon/baneChannel`, `boon/baneStrength`, six optional fields across manifest + validator + embed + DB | W-FAITH F1c (`a8673e3e9`, 08-31); migration `200_deity_authored_character.sql` | WF-3's "authored axes" premise | **LANDED** (migration written, apply not verified here) | `customContentSchema.js:309-420`; `deityCommitEmbed.js:54-61 DEITY_AUTHORED_CHARACTER_KEYS` | CONFIRMED (code); migration-applied state UNTRACED — PLAUSIBLE |
| 10 | ⭐ **The engine hears an authored temper today, ungated** — `deityTemper`'s authored arm reaches ten embed consumers | W-FAITH F2c + F3c (ODQ §866) | WF-3 | **LANDED-UNFLAGGED** | `deityAxes.js:148-153` (authored arm first); `deitySnapshot.js:66 ...authoredCharacterEmbedKeys(raw)`; `deityCommitEmbed.js:55 'authoredTemper'`; census `tests/domain/deityTemperConsumerCensus.walker.test.js:30` "the ten embed consumers now hear an authored word" | CONFIRMED |
| 11 | ⛔ **RECORD≠CODE** — `deityAxes.js`'s own header still asserts the opposite of #10 | F2c comment never updated by F3c | WF-3 | **RECORD≠CODE** | `deityAxes.js:35-42`: "`deitySnapshotFrom` … does not carry `authoredTemper`, so every consumer that reads an EMBED — the whole engine — still derives" — false at `deitySnapshot.js:66` | CONFIRMED |
| 12 | ⛔ **RECORD≠CODE** — `faithField.js`'s header still says the field is uncalled | F3c comment never updated by F4c | — | **RECORD≠CODE** (comment only; the FENCE was correctly amended) | `faithField.js:12-14` "⭐ THE FIELD IS DARK. Nothing in production calls it"; contradicted by `religionState.js:43/:669`. The fence itself was updated: `tests/property/faithFieldDormancyFence.test.js:146` "⛔⛔ THIS ARM WAS 'NO PRODUCTION MODULE IMPORTS THE FAITH-FIELD SET' UNTIL W-FAITH …" | CONFIRMED |
| 13 | **The FaithTab deepening read-model** — top-3 character, boon & bane in band words, the cumulative field | W-FAITH F7c (`e126c24ed`/`cdf50747f`, 08-31/09-01) + T11 `190b83e9a` | WF-8's surface | **LANDED** (display) | `display/faithDeepening.js` 275 lines; consumed `components/settlement/faithPanelModel.js` | CONFIRMED |
| 14 | **WF-1 the unseating** — typed patron fall, capped ring, `suppressedAtTick`, the war-dissolution join, the realm last-seat beat, the FaithSection cause line | FP FAITH, six members WF-1a…WF-1F (ODQ §227 §313 §324 §329 §342 §352, 08-20→08-22) | **WF-1** | **LANDED-DARK** | `patronFall.js:2` "WF-1a, THE TYPED PATRON FALL" (167 lines); gate reads `pulseKernel.js:1637`, `religionState.js:649`, `warTermination.js:538`, `religiousContest.js:692`; **zero `faithUnseatingEnabled: true` in `simulationRules.js`** | CONFIRMED |
| 15 | `PATRON_FALL_CAUSES` frozen at **four** while the DS-FTH-3 prose enumerates **five** | ODQ §400 (FTH34), 08-22 | WF-1 / WF-8 | **RECORD≠CODE, already registered** | ODQ §400: remove `abandoned`, "rides the ALREADY-QUEUED WF-8 SHRINK-BACK CAR … THE PRODUCER DOOR STAYS OPEN"; ODQ §839 FLAG 2 records it still live in the machine-read FAITH annex | CONFIRMED |
| 16 | **WF-8a — the settlement obituary**, the estate's sixth phrased-kind registry family | FP FAITH WF-8A (ODQ §376, 08-22) | **WF-8** | **LANDED-DARK** | `faithNews.js:118-126 FAITH_KIND_REGISTRY` = **exactly one kind**, `faith_last_altar_dark`; corpus `faithReceiptPools.js`; mint gated by the dark `unseating` read at `religiousContest.js:692`; the volume charters "roughly twenty further narration kinds" (`faithNews.js:99`) | CONFIRMED |
| 17 | The **Herald faith desk is already ~19 kinds deep**, all but one minted by other programmes | WR-2 / WR-10 / pantheon / FP | **WF-8** (R6's baseline) | **LANDED-LIT** | `realm/heraldRouting.js:140-159`: 16 exact rows + the 3 deity-tier keys; only `faith_last_altar_dark:158` is WF's. `sovereignty_sale_judged:152` is WR-10's | CONFIRMED |
| 18 | R2 re-verified: **no realm Schism arc exists**; `COMPOUND_SIGNATURES` is still exactly five keys, none a schism | pre-WF | **WF-8** | substrate unchanged | `realmEvents.js:27 :38 :48 :58 :68` = `gods_abandonment · the_wasting · starving_city · calling_of_debts · shadow_court` | CONFIRMED |
| 19 | ⭐ **WF-6's five faith term rows**, the whole family, priced and labelled | GR-3a (`0be4800db`, 08-06) | **WF-6** | **LANDED-DARK** | `peaceTermsCatalog.js:228 shared_rite · :231 pilgrimage_right · :236 tolerance_guarantee · :240 missionary_access · :245 temple_restitution`, all `family:'faith'` | CONFIRMED |
| 20 | ⭐ **WF-6's PRODUCER landed too** — a four-rung ask ladder drafting all five rows off one crossing | GR-3b | **WF-6** | **LANDED-DARK** | `pactFormation.js:174-179 PACT_DRAFT_LENS.faith_communion`; `tests/domain/peaceTermsGrantTerms.test.js:156-158` "IT WAS TEN, AND NINE HAVE BEEN DISCHARGED … the five faith … rows a real producer, so their entries are DELETED" | CONFIRMED |
| 21 | ⭐ **WF-6's crossing landed** — `faith_communion`, two courts believed devout to about the same degree | GR-2 (`a18fdcfae`, 08-06) | **WF-6** | **LANDED-DARK** | `pactTriggers.js:226 scoreFaithCommunion`; called `pactFormation.js:261` with `DEVOTION_BANDS`; lifecycle `advancePeacetimePacts` mounted (TRADE pilot's confirmed trace) | CONFIRMED |
| 22 | ⭐⭐ **`temple_restitution` ALREADY EXECUTES** — it is `stream:true, executor:'transfer'`, and the stream loop is generic, so a signed temple restitution moves REAL CONSERVED GRAIN today with no WF-6 executor | GR-3a riding M2/W-GRAIN's `treatyTransfer.js` | **WF-6** | **LANDED-DARK, executes when drafted** | `peaceTermsCatalog.js:245`; `peaceTerms.js:720-733` reads `TERM_CATALOG[term.type].stream` then `computeTreatyGrainDraw`; `treatyTransfer.js:1-46` (grain is the denomination, sink-only, reserve floor 1.5 months) | CONFIRMED |
| 23 | …and the **four GRANT rows are LANDED-INERT** | GR-3a | **WF-6** | **LANDED-INERT** | `treatyEnforcement.js:268 missionaryAccessFor · :277 sharedRiteFor · :285 pilgrimageRightFor · :293 toleranceGuaranteeFor`; grep for each across `src/` → **zero callers outside the module**, one comment at `certification/couplingRegistryGrammar.js:148` | CONFIRMED |
| 24 | ⚠ **Faith terms have NO war-door producer** — a war's end cannot extract missionary access today, contra the catalog's own comment | GR-3a | **WF-6** | gap | `peaceTermsGrantTerms.test.js:132-147`: the only two producers are `CLASS_TERM` (war) and `PACT_DRAFT_LENS` (peacetime); no faith row appears in `CLASS_TERM`. The catalog at `:238-239` calls `missionary_access` "the row a war's end can EXTRACT" | CONFIRMED |
| 25 | ⚠ **The faith crossing needs THREE dark flags**, not one | GR-2/SP-B | **WF-6**, **WF-2a** | gating | `pactFormationEnabled` + `beliefAxesEnabled` + `believedDevotionEnabled`, all `lit-in-rules: 0`; `scoreFaithCommunion` returns `NO_CROSSING` when the believed word is absent (`pactTriggers.js:229-231`) | CONFIRMED |
| 26 | ⭐ **SP-B's believed-devotion axis** — `secular/lukewarm/observant/faithful/devout`, rungs keyed on religionState's own hysteretic `standing`, +1 rung for the patron | SP-B (`4c0f2f38b`, 08-05) | **WF-2a**, WF-6 | **LANDED-DARK** | `beliefAxisSubjects.js:115 DEVOTION_BANDS`, `:186 STANDING_RUNG {cult:lukewarm, established:observant, ascendant:faithful}`, `:356 devotionGroundTruth`, gate `beliefAxes.js:93`, field `beliefMap.js:349` | CONFIRMED |
| 27 | ⭐⭐ **THE PILOT'S QUESTION 1, AND WF ANSWERS IT THE OPPOSITE WAY FROM TRADE: the devotion ground truth is LIVE, not generation-frozen.** TR-3's belief axis froze because `foodRatio` had only generator writers; WF's reads `religionStates[cid].{share, standing, patronRef}`, which `advanceReligionStates` rewrites every tick | SP-B over Phase-4 religion | **WF-2a** | positive finding | `beliefAxisSubjects.js:356-372` reads only the religion state; `religionState.js:151-154 standingOf` recomputes with hysteresis; the fold is mounted at `pulseKernel.js:1183` (`advanceReligionStates`). **Believed devotion can be surprised; believed scarcity cannot** | CONFIRMED |
| 28 | **SP-1 the errand spine is BUILT**, with WF-2b's two rows reserved and typed | SP-D / CR-FP-10 | **WF-2b** | substrate + reserved rows | `errandMint.js`; `envoyErrandVocabulary.js:317-334`: `legates → legateErrand.js` (`purposeClass 'religious'`, `built:false`) and `pilgrims → pilgrimErrand.js` (`'personal'`, `built:false`), both `wave: 'WF-2b'`; neither module exists | CONFIRMED |
| 29 | **The pilgrimage draw is the traditions lane's, deity-agnostic, host-only** — V24 re-verified | pre-WF traditions | **WF-2a** | **LANDED-LIT** | `traditions/pilgrimage.js:38 PILGRIM_MAX 0.1`, `:59 drawsPilgrims`, `:82` aspatial guard; reached at `traditionsKernel.js:79`. No faith-site linkage, no co-location gate, no patron requirement | CONFIRMED |
| 30 | **WF-3's premise HOLDS exactly** — `aggression` and `treatyDurability` are still unconsumed | Phase-4 W-F2, deferral ledger G1c | **WF-3** | unchanged | `deityStance.js:164-172` (the deferral comment verbatim), `:173` returns all four; `grep treatyDurability src/` → only this file. Only `betrayalHazard` + `cooperation` are consumed (`deityStanceLane.js`) | CONFIRMED |
| 31 | ⚠ **…but the deity already has TWO live mechanical war couplings WF-3 must not double-count** — (a) the signed warlike drive, (b) WR-2's domain pressure | Phase-4 W-F2/W-F5 (`779fbfff9`/`5f0ad7b77`, 07-10); WR-2 | **WF-3** | **LANDED-LIT** | (a) `disposition.js:195 W_DEITY = 0.35`, `:208 deityTemperDrive`, `:281` multiplied by `pietyLocalMultOf`; (b) `dispositionProfile.js:168 deityPressureOf`, `:135` §851 one-arm-per-deity | CONFIRMED |
| 32 | The **§851 precedence ruling** — an authored boon/bane silences that deity's legacy `domain` arm; the volume's "domains never had mechanics" was FALSE | ODQ §851, 08-31 | **WF-3**/W-FAITH | ruling, implemented | ODQ §851 (line 31961); `dispositionProfile.js:92-94`, `:126-136 authoredAspectsOf` | CONFIRMED |
| 33 | **Track B's 4th deity axis (`lawAxis`) is live in `law_order`** | Track B B5 (`e1c7244e9`, 06-19), migration 056 | substrate (V10) | **LANDED-LIT** | `corruption.js:267 deityLawDirection`; `causalState.js:51` imports, `:957` applies with `DEITY_LAW_TUNING.lawOrderSwing = 8` — the constant W-FAITH's `CAUSAL_SWING=20` was calibrated against | CONFIRMED |
| 34 | **WF-4 omen reads: nothing exists under any name** | — | **WF-4** | **UNBUILT** | `omenReading` 0 src hits; `spatialLedgers.omenReadings` 0; `prophec|oracle|portent|augur` in `src/domain` → only the *dormancy oracle* and the `'oracle'` clergy label (`npcAgency.js:44`) | CONFIRMED |
| 35 | …the **`divination` desk it would speak through IS built and live** | Herald / IN | **WF-4** substrate | **LANDED-LIT** | `realm/heraldRouting.js:64 HERALD_SECTIONS` includes `divination`; eight forecast tokens at `:373-375`; structural doctrine `:26-38` | CONFIRMED |
| 36 | **WF-5 schism + underground: nothing exists** | — | **WF-5** | **UNBUILT** | `creedRef` 0 src hits; `covert` 0 hits in `religionState.js`; no `covertCongregation.js`; V26 holds (`clandestineFacet` criminal-only) | CONFIRMED |
| 37 | …the only "schism" is the **settlement patron contest**, and WF-1 already classifies its outcome | Phase-4 religion | **WF-5** substrate | **LANDED-LIT** (under `faithSpreadEnabled`) | `religionState.js:532 resolvePatronContest`, called `religiousContest.js:893`; `patronFall.js:113` "DISCREDITED — the schism / legitimacy-floor road: resolvePatronContest owned the seat" | CONFIRMED |
| 38 | ⚠ **W-K's whole institution impairment/shell lifecycle is LANDED-INERT and flag-dark** — the substrate WF-5a's founding and WF-6's `temple_restitution` would both want | W-K slice K1 (DESIGN_MAGIC_ECONOMY §3c) | **WF-5a**, **WF-6** | **LANDED-INERT** | `institutionStatusLifecycle.js` exports `advanceInstitutionStatus:343` / `applyInstitutionStatus:526`; `grep "institutionStatusLifecycle.js'" src/` → **zero importers**; its rule `magicEconomyEnabled: false` (`simulationRules.js:995`) | CONFIRMED |
| 39 | A **founding-viability evaluator exists** for WF-5a to ride | moral-institution lane | **WF-5a** | **LANDED** | `moralInstitutionPressure.js:448 evaluateMoralInstitutionFounding`, `:195/:207/:221` the fit ladder | CONFIRMED |
| 40 | **WF-7 the tithe: no cousin under any name.** `templeWealth` has no writer; the estate's `tithe` is the GRANARY RESERVE tithe | ECONOMY (food engine) | **WF-7** | **UNBUILT** (+ the 38-file grep trap re-confirmed) | `grep templeWealth src/` → prose corpus + two self-declaring comments only (`warFaithStateProse.js:96` "⛔ `templeWealth` HAS NO WRITER ANYWHERE IN THE ENGINE"; `dossierMounts.js:504`). `foodStockpile.js:12-24` is the reserve tithe. `treasury.js` has zero `temple` hits | CONFIRMED |
| 41 | `ENDOWED` survives as a **dossier-prose state word marked not-drawable until WF-7 lands** | ODQ §400 J5 | **WF-7** | recorded deferral | ODQ §400: "ENDOWED kept and marked not-drawable until WF-7 lands — a recorded deferral, not a gap" | CONFIRMED |
| 42 | **WF-9 convergence: no faith contract exists** | — | **WF-9** | **UNBUILT** | `ls src/domain/certification/*onvergence*` → `tradeConvergenceContract.js`, `warConvergenceContract.js`, `warConvergenceForces.js` only | CONFIRMED |
| 43 | **WF-0's observation is declared but not taken** — the certification row names the exact soak case owed and still reads UNOBSERVED | certification programme | **WF-0** | shell only | `subsystemRowsBaseline.js:60 FAITH_SPREAD_OTHER`: "THE OBSERVATION NEEDED … one soak case whose settlements carry an embedded `config.primaryDeitySnapshot` … plus a v5 `subsystems.stateKeys` census over `worldState.religionStates`. Until such a case exists the honest verdict is UNOBSERVED"; `deityBearers` is a private helper at `religiousContest.js:265` | CONFIRMED |
| 44 | ⛔⛔ **THE FRAME FOR THE WHOLE FAMILY: the release corpus is DEITY-FREE, so every faith mechanism above — lit, dark or inert — is shut by an OUTER DATA GATE in every shipped world** | measured 2026-07-31, still standing | all | data dormancy | `subsystemRowsBaseline.js:60`: "the soak fixture is DEITY-FREE … every completed release case ran this subsystem with its outer gate shut … that zero is an ABSENT PRECONDITION, not a silent engine". The gate is `isSubsystemActive(snapshot,'religion')` (deity PRESENCE, not a flag) at `religiousContest.js:536` | CONFIRMED |
| 45 | **W-LIVES landed beside W-FAITH** — the paradigm chart, lived-experience catalog and character read-model the faith pull was adapted into | W-LIVES L7/L8 (`e25c73fbf`, `e402f317c`, 08-31/09-01) | none | **LANDED** | `src/domain/npc/{paradigmAxisCatalog,livedExperienceCatalog,characterReadModel,characterConsumers,knownCharacter,characterEdit}.js` | CONFIRMED |
| 46 | ⛔ **The WF volume's §1 substrate census predates W-FAITH by four weeks and is stale in three load-bearing rows** | — | WF-3, WF-7, §2, §3 | **RECORD≠CODE (the volume)** | V10 (temper "derived-only") is now a two-arm read (#10); §2's "Nothing in this program lights a flag" sits beside an unflagged live producer (#2); §3's "zero new top-level keys" sits beside the pulse-minted `settlement.config.faithProfile.field` (`religionState.js:669-671`) | CONFIRMED |
| 47 | The **ledger carries NO stop, freeze or re-charter against any WF wave** — the TRADE pilot's §96.2 has no WF analogue | — | all | absence of a blocker | 171 word-boundary `WF-[0-9]` hits in `OWNER_DECISION_QUEUE.md`, all read: WF-1's six-member split (§215–§352), §400's prose overclaim, §839 FLAG 2, and §3000's three compile cures. Zero rulings stopping a wave | CONFIRMED |
| 48 | ODQ §3000's three compile cures for WF are already discharged in code | chair, pre-§215 | WF-1/2b/6 | recorded | ODQ line 3000-3004: "F-1 WF-2b (exact paths govern); **F-2 WF-6 re-scopes to CONSUME the already-landed GR-3 rows (headroom is 3 lines, not ~24)**; F-3 WF-1" — matches rows 19–23 and the volume's own WF-F corrections | CONFIRMED |
| 49 | The **W-FAITH programme is absent from `GOLDEN_SHIFT_LEDGER.md`, `A_PLUS_ROADMAP.md` and `START_HERE.md`** | — | — | record gap | `grep 'W-FAITH\|faithField\|boon\|authoredTemper'` over all three → zero hits; `grep 'WF-[0-9]\|W-FAITH' A_PLUS_ROADMAP.md` → zero | CONFIRMED |
| 50 | The diary is silent by construction, as the pilot predicted | — | all | — | `RESUME-NOTE.md` begins 2026-09-08; every landing above predates it | CONFIRMED (inherited from the pilot; not re-executed) |

---

## 3. WAVE BY WAVE — the verdict the pricing should carry

| Wave | PRICING §B row | What the history shows | Corrected status | Car delta |
|---|---|---|---|---|
| **WF-0** | UNBUILT, 2–3 C | Nothing built. The certification programme built the ROW and wrote the exact observation owed (#43); `deityBearers` is a private helper. | **UNBUILT** | unchanged |
| **WF-1** | (not priced — "BUILT") | Landed whole as six members + WF-8A, and **DARK in every preset** (#14). The `abandoned` cause overclaim is registered and owed to the WF-8 shrink-back car (#15). | **LANDED-DARK** — and under the owner's 09-15 *"everything built LIT ON"* directive it owes a **lighting car this programme does not price** | **+1 C (lighting/declaration)** — PLAUSIBLE |
| **WF-2** | UNBUILT, 7–10 C | Substrate only, but the substrate is better than TRADE's: the errand spine is built with both rows reserved and typed (#28), the traditions draw is live (#29), and **the belief leg's ground truth is LIVE, not frozen** (#27). The wave's own leaves (`pilgrimSeason.js`, `legateErrand.js`, `pilgrimErrand.js`) are absent. | **UNBUILT** (belief leg de-risked) | unchanged; the TR-3-shaped "join car" WF would have owed is **not owed** |
| **WF-3** | UNBUILT, 3–5 C | Premise holds exactly (#30) — but the deity now has **three** live mechanical couplings the wave must reconcile with rather than restate: the warlike drive, WR-2's domain pressure (#31) and the authored temper the engine can now hear (#10). And `faithField`'s own header forbids feeding the temper into a channel (`faithField.js:30-38`, risk #1) — a law WF-3's compile must inherit. | **UNBUILT (+1 reconciliation car)** | **+1 C** — PLAUSIBLE |
| **WF-4** | UNBUILT, 5–8 C | Truly nothing (#34); the desk exists (#35). | **UNBUILT** | unchanged |
| **WF-5** | UNBUILT, 8–12 C | Nothing of the wave (#36). Two substrate surprises: the schism contest WF-1 already classifies (#37), and **W-K's institution impairment lifecycle is INERT and flag-dark** (#38) — WF-5a's founding call cannot lean on a mounted status system. | **UNBUILT (+1 declaration)** | unchanged (declare the inert lifecycle at charter) |
| **WF-6** | UNBUILT, 4–7 C | ⭐ **The most built of the nine.** Rows (#19), producer (#20), crossing (#21) and mounted lifecycle all landed under GR-2/GR-3a/GR-3b; `temple_restitution` **already executes as a conserved grain levy** (#22). Owed: the four grant consumers (#23), the war-door producer if the catalog's own "a war's end can EXTRACT" sentence is to be true (#24), and a ruling on whether a "temple restitution" that moves grain rather than repairing a temple is the intended behaviour. | **PART-BUILT** (upgrade already made by RECHECK §1; this pass adds the executing term and the missing war door) | **+1 C** for the war-door/semantics ruling — PLAUSIBLE |
| **WF-7** | UNBUILT, 5–8 C | Nothing under any name (#40); the grep trap re-confirmed; ENDOWED is prose held open for it (#41). | **UNBUILT** | unchanged |
| **WF-8** | PART-BUILT (8a), 8–12 C | One kind of ~20 (#16), dark behind WF-1's flag; the desk is already ~19 kinds deep and **only one of them is WF's** (#17) — R6's re-baseline instruction is live and the census must not double-count WR-minted faith-desk kinds. The five-arc re-scope (R2) stands (#18). | **PART-BUILT** | unchanged |
| **WF-9** | UNBUILT, 5–9 C | Nothing (#42). | **UNBUILT** | unchanged |
| — | — | ⭐ **NEW, not in any WF row: the W-FAITH estate** (#1–#13) is ~1,900 lines of landed faith machinery with one unflagged live producer, one inert adapter, two stale headers and an unsigned-but-lit tuning surface. It is not a WF wave and should not be priced as one — but every WF compile that touches deity reads, the faith tab, the tuning surface or `config.faithProfile` must read it first. | **a reconciliation row, not a wave** | **+1–2 C** of declaration spread across WF-3/WF-7/WF-8 — PLAUSIBLE |

**Family total:** PRICING says **47–74 C**. This pass moves it to roughly **51–79 C, centre ≈ 65** (+4–5 cars, ≈ +8 %) — the same order as the TRADE pilot's +10 %. No wave moves to BUILT; **WF-1 moves from BUILT to LANDED-DARK** and acquires a lighting obligation; WF-6's PART-BUILT (already made by RECHECK) is re-confirmed with two new facts. The arithmetic is mine — **PLAUSIBLE**; every input is a CONFIRMED receipt above.

---

## 4. THE PILOT'S TWO QUESTIONS, ASKED OF EVERY MECHANISM FOUND

| Mechanism | WHAT DOES IT READ — live or generation-frozen? | IS IT REACHABLE? |
|---|---|---|
| `faithField` / `faithChannelBindings` | **LIVE** — `religionStates[cid].deities[].{share,standing}` + rank off the embed + `pietyMultOf` off `config.faithProfile.piety` (written tick-END, read tick-START) + the magic ledger. No generator-frozen input anywhere. | ⭐ **YES, ON A PRODUCTION PATH, WITH NO FLAG.** `pulseKernel.js:1801` → `religionState.js:669` mints `faithProfile.field`; `causalState.js:156` spends it on six variables. **This is the WF family's analogue of the pilot's famine-profiteering find** — an unflagged live producer whose dormancy is a content fact (`ui:false`), not an engine fact. |
| `deityTemper`'s authored arm | **LIVE** (authored content, read through the embed). | ⭐ **YES, ungated, ten embed consumers** — and the module's own header says the opposite (#11). |
| `faithWitnessSource` | LIVE inputs, but never called. | **NO** — zero importers in `src/`. LANDED-INERT. |
| `deityFlaws` | LIVE (`share`, the pantheon fortunes ledger). | Only through `faithField` (jealous) — the wrathful arm rides the inert witness adapter. |
| `devotionGroundTruth` (SP-B) | ⭐ **LIVE** — `religionStates` only, rewritten every tick. **The exact opposite of TR-3's frozen `foodRatio`.** | Through `beliefAxes` (3 dark flags) and directly as `self.devotion` in `pactFormation.js:217`. |
| The five faith peace terms | LIVE (a signed treaty ledger). | Producer LANDED but flag-dark; four grant readers INERT; `temple_restitution` reaches the generic conserved-grain applicator. |
| `deityPressureOf` / `deityTemperDrive` | LIVE (the embed + piety). | **YES, LIT** — the pre-existing war couplings. |
| `institutionStatusLifecycle` (W-K) | LIVE by design (presence re-derived every advance). | **NO** — zero importers, and `magicEconomyEnabled: false`. LANDED-INERT. |
| `pilgrimageDraw` | Generation-side digest + the observance record. | **YES, LIT** via `traditionsKernel.js:79` — but deity-agnostic and host-only (V24). |
| `patronFall` / `faithNews` | LIVE religion state. | Mounted, **DARK** behind `faithUnseatingEnabled`. |

---

## 5. THE LIGHTING CENSUS (all 16 faith-adjacent flags, executed)

`grep "<flag>: true" src/domain/worldPulse/simulationRules.js`:

| Lit in a preset | Dark everywhere | No gate reads it at all |
|---|---|---|
| `faithSpreadEnabled` (`:811`, `:875`) · `religionDynamicsEnabled` (`:817`, `:876`, the lockstep legacy mirror) | `faithUnseatingEnabled` · `beliefAxesEnabled` · `believedDevotionEnabled` · `pactFormationEnabled` · `errandSpineEnabled` · `magicEconomyEnabled` | `faithFieldEnabled` (a string at `faithTuningSurface.js:175`) · `pilgrimageEnabled` · `faithStanceConsequencesEnabled` · `omenReadsEnabled` · `faithSchismEnabled` · `faithTermsEnabled` · `titheEnabled` · `faithNarrationEnabled` · `npcTemperDriftEnabled` — **zero src hits each** |

⛔ And above all of it sits the **outer data gate**: `isSubsystemActive(snapshot,'religion')` is deity
PRESENCE, and the release corpus carries no deity (#44).

---

## 6. GREP TRAPS BANKED BY THIS PASS (all CONFIRMED at source)

- `WF-8` / `WF-8A` in the ledger's launch tail (ODQ §765, §782, §836, §839) is the **doc shrink-back car**, not a build wave; ODQ §376's `WF-8A` *is* the FP narration slice. Both are the same family, different acts — PROGRAMME's collision note stands.
- `tithe` (38 files) is the **granary reserve tithe**, `foodStockpile.js:12-24` — never a faith tithe.
- `oracle` in `src/domain` is the **dormancy oracle** (a test discipline) plus the `'oracle'` clergy label at `npcAgency.js:44`.
- `omen` in the UI is **V-16 THE AUSPICE**, a forecast preview (RECHECK §5, re-confirmed).
- `covert` across 20+ `worldPulse` files is the **espionage / brokerage / envoy** vocabulary, never a covert congregation.
- `endowment` in `resourceDynamicsKernel.js:41` is the **resource endowment**; `ENDOWED` in the faith context is a dossier-prose state word only.
- `patronCounterforce.js` is the **relationship-graph** patron (a senior protecting a junior, read by `warTermination`/`warReasons`) — **not** a religious patron.
- `brokeragePatronage.js` is INFO's **news-house patron**, not a temple patron.
- `schism` matches `patronFall.js:113`'s comment and `religionState.js:456`; the realm arc genuinely does not exist (#18).
- `restitution` mostly matches WR's `restitutionClaimBand` negotiation picture — the **term** is `peaceTermsCatalog.js:168/:245`.
- `faithProfile` is the **pulse-minted projection** on `settlement.config`, written by `religionState.js` and read by nine modules — it is not a WF wave's state.
- `W-FAITH` ≠ `WF`: the two programmes' names collide on a three-letter stem in almost every grep. `git log --grep='W-FAITH'` and `grep -E '(^|[^A-Za-z0-9-])WF-[0-9]'` are the two disjoint doors.

---

## 7. WHAT THIS PASS CHANGES, IN ONE LIST

1. **WF-1 is DARK, not simply BUILT** — and the owner's 09-15 built-lit directive makes that a live gap the pricing does not carry.
2. **A whole second faith programme (W-FAITH + W-LIVES) exists and no recon pass names it** — ~1,900 lines, nine modules, a migration, four surfaces.
3. **An unflagged live producer**: six causal variables take a faith-field lift on the production path, dormant only by content absence.
4. **A second unflagged producer**: ten engine consumers hear an authored deity temper, against its own module's written claim.
5. **`temple_restitution` already executes** as a conserved grain levy — WF-6 owes a semantics ruling, not an executor.
6. **Faith terms have no war-door producer**, contradicting the catalog's own sentence.
7. **WF's belief axis is LIVE where TRADE's was frozen** — the TR-3-shaped join car is not owed here.
8. **W-K's institution status lifecycle is inert and flag-dark** — WF-5a and WF-6 both plan against it.
9. **Four RECORD≠CODE rows** (#11, #12, #14-vs-PROGRAMME, #46) plus one already-registered (#15).
10. **No ledger stop exists against any WF wave** — unlike TRADE's §96.2, nothing blocks a compile.
