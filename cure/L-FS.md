# L-FS — the compile log for `docs/DESIGN_FP_ARCH_FS.md` THE FISCAL SEAT (seat Opus 5.5, xhigh; chair 6eb7b5b6 Fable 5.1; P6a; 2026-10-20)

Status: COMPILED (13:17 → 13:45 CDT by `date`). The volume `docs/DESIGN_FP_ARCH_FS.md` is complete in the house idiom (parts 0–12; no cure record — a compile). Next: the skeptic FS-r1 and SEAMS-P6. Probes: `cure/L-FS-probe/` (token-census.txt · efflines.mjs + efflines.out).

## §1 MEASURE FIRST (the standard's rule 9) — receipts at master 81f1cd963 (worktree `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963`, HEAD verified 81f1cd963553f226b222714914ff34584e9911b8). Every row CONFIRMED by reading the cited symbol unless marked PLAUSIBLE.

### 1.1 The measurement that REFUTES the brief's premise ("the dark W-COIN taxes — outside FP; read … whether any coin ledger exists")
**A coin ledger and taxation ARE LANDED on master** (W-COIN-1a/1b/2/3): `src/domain/worldPulse/treasury.js` (1303 raw · 438 eslint-effective — room under 800).
- `treasury.js :: TAX_FORMS` — "'land_rents', 'market_tolls', 'port_customs', 'licensing', 'justice_fees', 'tithe_share', 'levy_extraction', 'misc_trade'".
- `treasury.js :: TAX_RATE_BANDS` — "Object.freeze(['none', 'light', 'customary', 'heavy', 'extractive'])" (closed, ORDERED lightest first).
- `treasury.js :: TAX_PROFILE` — the frozen 6×8 table keyed on `RULING_POWERS` (autocrat · council · theocracy · merchant_league · criminal · mixed).
- `treasury.js :: COERCIVE_TAX_FORMS` — "Object.freeze(['levy_extraction'])"; `isCoerciveCell(rulingPower, form)` — "return COERCIVE_TAX_FORMS.includes(form) || rulingPower === 'criminal';" (`extractive` is reachable ONLY on a coercive cell — the volume's law).
- `treasury.js :: computeTaxYield(settlement, { rulingPower, suspension })` — THE ONE MINT: "const band = profile[form];" … "price += … LEGITIMACY_PRICE_BY_BAND[band] || 0" on a coercive cell; "const owed = Math.min(TREASURY_TUNING.LEGITIMACY_PRICE_CAP, Math.round(price));".
- `treasury.js :: TREASURY_TUNING.LEGITIMACY_PRICE_BY_BAND` — "Object.freeze({ heavy: 1, extractive: 3 })", `LEGITIMACY_PRICE_CAP: 6`; `BAND_MULTIPLIERS` — "none: 0, light: 0.5, customary: 1, heavy: 1.6, extractive: 2.2".
- `treasury.js :: TREASURY_LEGITIMACY_CAUSE` — "'treasury_extraction_price'"; "The stock's ONLY write to any opinion, anywhere"; landed through `applyTreasuryLegitimacyDeltas` → `generosityUpdates.js :: applyLegitimacyDeltasToUpdates` ("THIS IS NOT A SECOND APPLICATOR AND MUST NEVER BECOME ONE").
- `treasury.js :: TREASURY_BANDS` — "['empty', 'lean', 'adequate', 'full', 'overflowing']"; `treasuryBandOf(settlement)` derived on read, never persisted.
- `treasury.js :: coffersRead(settlement, record, tick)` — the war-wage coverage read ("Pressure is the INVERSE of coverage"), `{ observed, score01, coverageTicks, upkeepPerTick }`.
- `treasury.js :: advanceTreasury(settlement, options = {})` — THE ONE PULSE WRITER; "if (!treasuryActive(options.rules)) return { settlement, summary: null };"; options = `{ interval, tick, deployment, blockade, rules }` — NO worldState. Its ONE call site: `pulseKernel.js` settlement_clock loop — "const vaulted = advanceTreasury(sieged, { interval: tickInterval, tick: worldState.tick, deployment, blockade, rules: simulationRules });" (FROZEN host, 1581). ⇒ the fiscal decision can reach the mint with ZERO kernel lines ONLY by riding the SETTLEMENT the kernel already passes.
- `treasury.js :: treasuryActive(rules)` — "rules.treasuryEnabled === true"; `simulationRules.js` lists `'treasuryEnabled'` in the virtual-key list; `rg "treasuryEnabled: true" src` = 0 hits ⇒ DARK IN EVERY PRESET (A1.21: lit in dramatic_campaign · living_realm · full_simulation only after W-COIN-2's band chip, the preset table's act).
- The record lives at `settlement.economicState.treasury` (`institutionTable.js` comment: "THE PATH IS `economicState.treasury`, NEVER `settlement.treasury`").
⇒ CONSEQUENCE (refinement, not STOP): the court's extraction decision is a BAND SHIFT on the ONE landed mint's band input, and its legitimacy price is ALREADY LANDED. No new treasury, no second tax truth, no new legitimacy writer.

### 1.2 The brief's candidate vocabulary collides on ALL FOUR words (rg -w -i; counts src/tests/master-docs/ledger-docs in `token-census.txt`)
- `lenient` — LANDED: `espionage/espionageDoctrine.js :: DOCTRINE_EMPLOYMENTS` "Object.freeze(['lenient', 'strict'])".
- `customary`, `heavy` — LANDED: `treasury.js :: TAX_RATE_BANDS` members (and `heavy` is EC-6's designed `tariffBand ∈ {none, light, heavy}`).
- `ruinous` — LANDED: `bandFamilies.js :: SEVERITY_LADDER` "Object.freeze(['glancing', 'telling', 'grave', 'ruinous'])".
- `stance` — DESIGNED THREE TIMES: EC-6 `STANCES = {open, taxed, restricted, closed}` (trade stance per pair); BD §7.1 `body_stance` (court ↔ body hearing); BD §7.6 `COMMONS_STANCES` `fear · indifference · support` + `commonsStanceOf`. 159 src hits.
- `levy` — 175 src hits; the MILITARY levy (`warLevyEnabled`, `warHomeCosts.js` levy branch, WS's levy pool). A fiscal `levy` token would be a homonym of the war levy — refused.
- `extraction` — LANDED: the condition archetype `vassal_extraction` (`relationshipRulesCore.js`, `pressureModel.js` TRADE_ARCHETYPES), the tax form `levy_extraction`.
- `tax_revolt` — LANDED (5 src hits): the `rebellion` stressor's ORIGIN VARIANT — `stressorDynamics.js :: interpretOriginContext` "if (activeHere('indebtedness') || activeHere('market_shock')) { return { ...base, variant: 'tax_revolt', reason: 'The levies of a drowning treasury finally broke the commons.' }"; `stressors.js:88` "tax_revolt: 'The levies of a drowning treasury have broken the commons.'"; `VARIANT_HOOKS.tax_revolt`; dossier pool `ORIGIN: tax_revolt` (DS-STR-2). A hearing kind named `tax_revolt` would be a homonym of a landed origin word — refused; the landed variant is REUSED as the revolt's own telling.
- FREE (0 src · 0 tests · 0 docs): `fiscalHand`, `remitting`, `wonted`, `wringing`, `exaction`, `tallage`, `fiscal_revolt`, `tax_strike`, `fiscalSeat`, `fiscalSeatEnabled`. PROSE-ONLY: `exacting` (tests/domain/userEdits.test.js personality string "Stern, exacting."; archive scripts). `revolt` 79 src (prose + the variant words).
⇒ CHOSEN: the decision is THE HAND, code `fiscalHand`, the closed ordered vocabulary `FISCAL_HANDS = ['remitting', 'wonted', 'exacting', 'wringing']` (band shift −1 · 0 · +1 · +2). [REFINED — the brief's `lenient · customary · heavy · ruinous` replaced, every word measured LANDED.]

### 1.3 The counterforce substrate
- `commonsVoiceKernel.js` (366 raw · 214 eff): `commonsGrievance01(settlement, opts)` — "THE ONE HOME of the commons grievance blend"; `CV.LEGIT_FLOOR: 55`, `W_LEGIT 0.55 · W_CORRUPT 0.35 · W_UNREST 0.55`, rungs 0.35/0.55/0.75, `DWELL_TICKS: 3`, `LEGIT_DIP: [0, 1, 2, 3]` ("step legitimacy cost on ENTERING rung"); ledger `spatialLedgers.commonsVoice` `{ rung, since, grievance, kind: 'corruption'|'misrule', accusedNid? }`; flag `commonsVoiceActive` "rules.commonsVoiceEnabled === true" — `commonsVoiceEnabled: true` 0 hits in src ⇒ DARK EVERYWHERE (OD-FC-3 RULED it lit in every world-alive preset once POP's registry lands). READERS on master: `assizeKernel.js` ("const commonsLedger = asObject(getSpatialLedger(worldState, 'commonsVoice'))"), `irregularForce.js` ("const cause = resistance == null ? commonsGrievance01(s) : resistance;"). The fold §2 POP row: "commons voice kernel (no cert row, no dossier consumer …)" — the DEAD END is that no DECISION and no dossier line reads the rung.
- Fold §3.1.3 (RULED): "POP's `commonsVoiceKernel.js` OWNS the composite AND its input registry: a closed `GRIEVANCE_INPUTS` table (kind · owning program · weight · cap) … a program that wants a term lands a ROW there in its own commit". `GRIEVANCE_INPUTS` 0 src hits (UNBUILT; POP-2's).
- POP-2 (`DESIGN_FP_ARCH_POP.md` POP-2; `DESIGN_FP_POPULATIONS.md` the commons arc): REFUSAL rung (targeted at a live SEAT ACT: "an underway §5c plan, a levy call, an encouraged emigration"), the TWO-STEP JUMP, `LEGIT_DIP` to five slots, THE MISRULE ANSWER (`commonsAnswer.js`, "one receipted, posture-colored seat verb that addresses a misrule/unrest grievance by redress"), kinds `commons_refusal` + `commons_answered`; "the SEAT'S answer is posture-colored (SP-4): a bold seat presses, a cautious one yields". ⇒ the fiscal revolt IS this ladder with the raised hand as REFUSAL's target — never a second crowd.
- J-INT-3 (`DESIGN_FP_INTERIOR.md`): "no tribute→legitimacy write … NEVER a new direct legitimacy write from treaty state … a parallel write double-counts the same drain". INT §3 "Deliberately NOT modeled: no unrest scalar (S9) · no court-opinion stock … no second legitimacy writer". ⇒ FS writes NO legitimacy and mints NO `LEGIT_*` key: the landed treasury price + the commons ladder's dips carry it. [REFINED — the brief's "writes legitimacy's typed hits (a new `LEGIT_*` key …)" withdrawn: STOP-FS-1 below, resolved by the landed roads.]
- `rulingPower.js :: rebandLegitimacy` — bands Endorsed ≥75 · Approved ≥60 · Tolerated ≥45 · Contested ≥30 · Legitimacy Crisis <30 (the read the seat's roll bands on).
- `momentum.js :: cliffStockFor(inputs)` — "fragile seat doubles down hardest"; `entityThreshold(item, worldState, courtStructure)` → `{ temperament, lawfulness01, malice01, legitimacyFragility01, cliff, … }` (PURE, exported) — the press-or-yield read at the refusal hearing. `momentum.js :: COURSE_KINDS` "['war', 'peace', 'campaign', 'contest', 'blockade', 'doctrine']" — FS adds NO course (a persisted ledger row kind).
- `stressorGates.js` (609 eff): "The ONE by-name read of `legitimacyUpheavalEnabled`" — "return snapshot?.worldState?.simulationRules?.legitimacyUpheavalEnabled === true;" (a READER scaling upheaval by legitimacy; dark everywhere).
- `stressorDynamics.js` (759 eff — 41 lines of headroom): `interpretOriginContext` rebellion arm (above) — FS's ONE clause.
- `assizeKernel.js` (281 eff) `:: advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize` — the commons stage: "Commons runs first so a fresh petition is on the ledger for the assize to answer THIS tick"; pulseKernel calls it by NAME ("the frozen pulseKernel changes by name only"). ⇒ FS's leaf mounts THIRD in this composition (+≈10 host lines, eff 281 → ≈291) — zero kernel lines.

### 1.4 Effective lines (eslint's own `max-lines` skipBlankLines+skipComments via the Linter class; `efflines.out`)
treasury.js 438 · commonsVoiceKernel.js 214 · stressorDynamics.js 759 · rulingPower.js 288 · momentum.js 633 · stressorGates.js 609 · coup.js 126 · rulingPowerCoup.js 121 · assizeKernel.js 281 · treasuryNews.js 92 · generosityUpdates.js 90 · demographicsPushPull.js 238. Frozen: pulseKernel 1581 · applyWorldPulse 907 · warTermination 818 (`scripts/.size-baseline.json`).

### 1.5 Further receipts (the brief's MEASURE FIRST list, item by item)
- INT's seat/positions/veto: `DESIGN_FP_ARCH_INT.md` §3 "New top-level/ledger keys: exactly one" (burials); INT-3's sibling decision types "(`pact_decision`, `severance_decision`, `stance_decision`, `sale_decision`, `burial_decision`) … each mints only when its producing event exists" — FS's `hand_decision` (0 · 0 · 0) is a sibling (ROUTE INT). INT-8 "no flag of its own" — the interior voice's pools; FS's beat is hand-authored (the treasury precedent).
- The cliff: `momentum.js :: cliffStockFor` / `entityThreshold` (quoted §1.3). `COURSE_KINDS` closed — FS adds no course.
- W-COIN at master: LANDED (§1.1). `importScrub.js` — "THE IMPORT COIN STRIP (W-COIN A1.8) — an imported settlement arrives COINLESS" (the treasury only; FS keeps a valid hand on import, OD-FS-7).
- W-COIN §7.2 lifecycle (design text): regen "drops the treasury record; the writer re-opens it empty"; undo "rides the settlement snapshot"; import "absent key ⇒ dark behavior … malformed record ⇒ fail-inert" — FS's record mirrors it.
- EC: `settlementFundingBand` is NOT EC's and NOT landed — it is THE SITES' designed read (ST §2.4: "THE ONE settlement band: its `prosperityRank01` (`< 0.2` unfunded · `< 0.45` meagre · `< 0.8` funded · else lavish, DRAFT)"; ST6 "FUNDING IS A DERIVED BAND, NEVER A COIN STORE"; OD-ST-5 "coin is the W-COIN slot — `UPKEEP_LEDGERS` rows `sites` · `retainers` · `patrols` … carried by one leaf-first car on the settlement record `advanceTreasury` receives"). EC-6 slice 3 (designed): "A `taxed` stance RAISES the taxing seat's `market_tolls`/`port_customs` band INPUT to that one mint by an authored notch … never a second mint" — FS composes with it (ROUTE EC).
- PL §4.2: "Dues. Unchanged (the landed rule), one hop, to every overlord edge (PL12)." The landed rule: `vassal_extraction` condition + scalar nudges, "extraction without a receiver" (W-COIN C1). W-COIN-3's vassal→overlord coin leg: designed, unlanded ("no caller of the transfer primitive ships").
- WF-7 (`DESIGN_FP_ARCH_WF.md`; `DESIGN_FP_FAITH.md` the tithe): "TITHE RELIEF is the seat/temple's lever: forgone stream buys piety + legitimacy (the famine-year remission — receipted mercy)"; fold §3.1.5 "ONE FLOW, TWO ENDS" — FS4 excludes `tithe_share`.
- POP flight: `demographicsPushPull.js` drivers "'crowding', 'defense', 'food', 'prosperity', 'security'"; `security01Of` reads "the generated criminal-opportunity score, and the live crime pressure" — NO unrest, NO commons input ⇒ STOP-FS-3.
- POP commons voice: §1.3. POP-2 (designed): REFUSAL "names a live seat act"; THE MISRULE ANSWER; posture-colored seat answer.
- Upheaval/coup gates: `stressorGates.js :: upheavalLit` (quoted); `rebellionGate` rows "The rulers have lost the streets." · "Bread and debt: the oldest fuel of uprisings." · "War taxes grind the commons toward revolt."; W-SEAT D4: "a SECOND RESOLVER FOR A QUANTITY THE GATES ALREADY ANSWER … and a silent double-count besides" ⇒ FS adds no gate row.
- The revolt word: `tax_revolt` LANDED (§1.2); its uses are words only — `stressors.js :: readerOriginReasons` "const variant = String(originContext.variant || '');" → `ORIGIN_REASON_SENTENCES`, `stressors.js:545` "originVariant: originContext.variant", `VARIANT_HOOKS.tax_revolt` (DM hooks); no `=== 'tax_revolt'` branch anywhere in src (CONFIRMED by rg).
- The deployment the war-wages term reads: `pulseKernel.js` "const deployment = simulationRules.warLayerEnabled ? (worldState.deployments?.[String(item.id)] || null) : null;" — FS reads the same record by the same path.
- The price under siege: `computeTaxYield` "const gate = suspension ? 0 : 1;" multiplies the AMOUNT only; the price loop reads the band, not the gate ⇒ the coercive price is charged under siege and occupation (CONFIRMED by reading; hazard H-FS-2, routed).
- The season: `intervalWeeks.js :: INTERVAL_WEEKS` "one_season: 13".
- The herald: `heraldRouting.js` `['treasury_', 'trade']` family prefix; `treasuryNews.js` beats `treasury_shortfall` · `treasury_band` (ids `wizard_news.${tick}.treasury_*.${stablePart(s.id)}`).
- Belief: `beliefMap.js :: believedNeedScale` (quoted in the volume §0.1).
- IN: `DESIGN_FP_ARCH_IN.md` carries no fiscal read; the neighbour's read is FS's (idiom-borrowed), its carrier IN's picture (ROUTE IN).
- Tokens: `extraction` LANDED (`vassal_extraction`, `levy_extraction`); `stance` (EC-6 · WC · BD ×2); `levy` (war levy); `tax` 102 src (prose + `TAX_*`); `toll` 231 src (the host's registered homonym "gate", "toll", … — HOST-REQUIREMENTS line 41); `revolt` 79 src (prose + the variants). `burden` LANDED (`demographicsRates.js` cause family 'burden'). `fear` LANDED in BD's `COMMONS_STANCES` (designed). `overtaxed` CH's condition (fold §5).

### 1.6 What the measurement refuted in the brief (summary)
| Brief item | Measured | Disposition |
|---|---|---|
| "the dark W-COIN taxes — outside FP" | the treasury, eight forms, five bands, the 6×8 profile and the legitimacy price are LANDED (dark) | the hand is a band shift on the ONE landed mint (§4); REFINED |
| candidate `lenient · customary · heavy · ruinous` | all four LANDED words | `remitting · wonted · exacting · wringing`; REFINED |
| `stance` | designed thrice (EC-6, WC, BD) | the HAND; REFINED |
| "writes legitimacy's typed hits (a new `LEGIT_*` key)" | J-INT-3 + the landed price + the commons dips | STOP-FS-1 → the landed roads; REFINED |
| `tax_revolt` hearing name | LANDED rebellion origin variant | the kind is `tax_refusal`; `tax_revolt` reused as the telling (FS9); REFINED |
| "the quarter rises into the landed upheaval/coup machinery, never a new revolt mechanism" | confirmed: rebellionGate + the coup lane carry it | FS adds words (one origin clause), never weight |
| "leans the faction plane" | no bounded seam measured | STOP-FS-2 (slot) |
| "moves feet (POP's flight)" | no push driver reads unrest/the commons | STOP-FS-3 (slot) |
| "the tithe share where the court sets it" | fold §3.1.5: one flow, two ends | excluded (FS4); REFINED |
| "the stance itself: … ride a landed record … or needs a field" | the mint reads only the settlement; no landed record fits | `economicState.fiscalHand` (OD-FS-2, the owner's) |
| "the keep's readiness falls" | ST's band is prosperity-derived; ST reserved the coin road (OD-ST-5) | rides ST's upkeep rows; no new band input; REFINED |
| "the dues default to the liege" | dues carry no coin on master | slot on W-COIN-3's coin leg (OD-FS-12) |
| "custom content" (the DM's set) | the kit law: custom content only for champions | requirement 14's typed DM edit; REFINED |

## §2 THE VOLUME'S STATE
`docs/DESIGN_FP_ARCH_FS.md` (≈107 KB, 18 sections): header · the owner's words verbatim · the answer · §0 substrate (23 rows) · §1 laws FS1–FS18 · §2 ontology (ONE persisted shape) · §3 the hand · §4 the mint · §5 the commons · §6 the refusal · §7 the wider world · §8 the DM's hand · §9 surface/scrutiny/machinery (+ hand × counterforce table) · §10 the hearing `tax_refusal` · §11 two flags · §12 waves FS-0…FS-5 · §13 lifecycle · §14 scenario matrix (24 rows) · §15 couplings · §16 token register · §17 rulings OD-FS-1…21 (owner rows 2 · 6 · 11 · 13 · 14) · §18 twelve felt sentences.

## §3 STOPS
- **⛔ STOP-FS-1 — the brief's direct legitimacy write.** The brief: "a `heavy`/`ruinous` stance writes legitimacy's typed hits (a new `LEGIT_*` key is a slot on the landed table — measure whether one exists for fiscal grievance; else declare it)". Measured: J-INT-3 ("NEVER a new direct legitimacy write … a parallel write double-counts the same drain"); INT §3 "no second legitimacy writer"; the treasury's own law "The stock's ONLY write to any opinion, anywhere" (`TREASURY_LEGITIMACY_CAUSE`) already prices a raised coercive form; the commons' `LEGIT_DIP` prices the grievance. A third road would double-count. RESOLVED IN THE VOLUME by the landed roads (FS3); the chair confirms (OD-FS-3).
- **⛔ STOP-FS-2 — the faction-plane lean.** No bounded seam measured (`factionCompetition.js` 775 eff per BD19; `factionRelationshipUpdate.js` deltas "never-applied", W-COIN C1). SLOT: FS-5 car-0 (OD-FS-10).
- **⛔ STOP-FS-3 — flight.** No push driver reads unrest or the commons (`demographicsPushPull.js`). A burden driver is POP's to mint. SLOT: OD-FS-11 (POP's row, owner-visible).

## §4 REFINED (every bracket in the volume; each vetoable)
1. FS1 — the vocabulary `remitting · wonted · exacting · wringing` replaces the brief's `lenient · customary · heavy · ruinous` (all four LANDED).
2. FS3 — no legitimacy writer, no `LEGIT_*` key (STOP-FS-1 resolved on J-INT-3 and the landed price).
3. FS4 — `tithe_share` excluded (fold §3.1.5); the "tolls where W-COIN lights them" generalized to the seven secular forms.
4. FS9 — the revolt keeps its landed word `tax_revolt`; the hearing is `tax_refusal`.
5. FS13 — the brief's two persisted fields are ONE record with `setBy`.
6. §2.1 — a DM-pinned `wonted` is stored (`hand: 'wonted'`) so the engine leaves it.
7. §2.1 — the record rides `economicState` (the mint reads only the settlement); neither a condition nor the ruling-power record fits.
8. §2.2 — the foreign flags read only through their owners' doors (`treasuryActive`, `commonsVoiceActive`); a by-name `treasuryEnabled` read would be an undeclared fourth door.
9. §2.2 — "a `ruinous` neighbour is a target" made two believed facts (`fiscalStrainOf`), never a truth read.
10. §2.4 — "EXTRACTION STANCE" renamed the HAND (`stance` designed thrice).
11. §4.3 — measured: the landed coercive price is charged under siege/occupation (H-FS-2), unchanged, routed.
12. §7.3 — "the keep's readiness falls" rides ST's reserved upkeep rows (OD-ST-5), no new band input.
13. §7.4 — a liege never sets a member's hand (PL5 read for the purse).
14. §8 — the DM's set is requirement 14's typed edit, not "custom content".
15. §10.2 — requirement 24's interior reach: `tax_refusal` registered on BD's `guild_war` precedent (OD-FS-9, veto arm stated).

## §5 ROUTES (cross-citations the seams seat checks; each the sibling's to confirm)
| To | What FS asks / cites | Where in FS |
|---|---|---|
| POP | (a) the `GRIEVANCE_INPUTS` row `exaction` (FS's row in POP's table, POP-2's pins re-run); (b) the commons ledger `kind` word `exaction` + the grievance word "the new taxes" (OD-FS-6, owner-visible); (c) POP-2's refusal target `hand` and its precedence (after a levy call, before an encouraged emigration, DRAFT); (d) `remitted` = POP-2's MISRULE ANSWER (one seat act); (e) `causedBy` = the hand's beat on a commons beat of kind `exaction`; (f) STOP-FS-3 — a burden push driver is POP's to mint (OD-FS-11, the owner's); (g) import validation of the new `kind` word (unknown → `misrule`) | §5, §6, §12 FS-2/FS-3, §13.2 |
| W-COIN (outside FP; the treasury) | (a) FS-1's leaf-first car into `advanceTreasury`/`computeTaxYield` (the `hand`/`refused` options; `priceBand` on an entry only when it differs; the summary's `hand`); (b) H-FS-1 the per-TICK legitimacy price (the fold §4 clock class); (c) H-FS-2 the coercive price charged under siege/occupation; (d) the door list grows by FS's mint door `mintHandOf` (no by-name `treasuryEnabled` read); (e) W-COIN-3's vassal coin leg as OD-FS-12's slot | §4, §11, §17 |
| INT | `hand_decision` as an INT-3 sibling incident type; no pHold term; INT-4's `tribute_strain` row and FS's `exaction` row are two causes, two rows | §3.1, §15 |
| WF | `tithe_share` excluded (FS4); `remission`/`remitting` one meaning, two flows | §2.4, §4.4 |
| EC | EC-6 slice 3's toll notch composes after the hand on the same band input, ONE clamp | §4.4, §14 row 23 |
| ST · PR | the keep's/riders' upkeep rows (OD-ST-5) read the vault the hand fills; NO new `settlementFundingBand` input | §7.3 |
| PL | dues as a need term (`liege_dues`); "the dues default to the liege" waits on W-COIN-3's coin leg (slot); no liege control of a member's hand | §7.4 |
| WS (compiling beside FS — cited by `briefs/L-WS.md`) | (a) ONE personality derivation (item 10) — FS reads WS's when it lands, `entityThreshold` until then; (b) the way of war as a need term (item 1–3: `attrition`, `coalition`); (c) `fiscalStrainOf` as a weakness input to WS's choosers (item 1's "treasury band — EC" strength) | §3.1, §3.2, §7.2 |
| IN | the edict carried by the observer's picture (`believedNeedScale` idiom; no belief field); a riot crosses a border, a petition does not | §7.2 |
| BD | the ransom's treasury payment as a need term (ES-2b); `fear` homonym (`COMMONS_STANCES`) | §3.2, §7.5, §2.4 |
| CH | a paragon on the seat (CH's seat arm); the corps purchase as a need term; `overtaxed` homonym | §3.1, §7.5, §2.4 |
| FOLD (P7 lane) | (a) §3.4 registry row `tax_refusal` (owner FS · WHERE `settlement` · STANDING · `remitted · abated · held_firm` · the default by posture/cliff/need); (b) requirement 24's INTERIOR reach (OD-FS-9); (c) §5 token rows (§16); (d) the chain: after C3, beside INT's interior hops (OD-FS-21); (e) §2 status row for FS (DARK; unbuilt) | §10, §16, §17 |
| the stressor lane | the one origin clause in `interpretOriginContext` (+≤3; 759 eff — STOP at build if it would cross 800) | §7.1 |
| OP · MG | none (no traveller, no unit) | §15 |

## §6 OPEN QUESTIONS FOR THE CHAIR (only what measurement cannot settle)
1. OD-FS-9 — does requirement 24 reach INTERIOR engagements (a court and its own commons)? The volume registers `tax_refusal` on BD's `guild_war` precedent; the veto arm is stated.
2. OD-FS-11 (the owner's) — should a burdened town's people LEAVE (a POP push driver keyed on the commons' rung)? Today nothing moves feet from taxes.
3. OD-FS-13 (the owner's) — H-FS-1/H-FS-2 belong to the treasury's tuning sitting; the hand AMPLIFIES H-FS-1 (a wringing autocrat pays the coercive price 3 per tick, capped 6 — at weekly ticks a seat could fall from Approved to Crisis inside a season). FS-0's car-0 measures it before FS-1 lights.
4. The chain placement (OD-FS-21) — the review panel's "build the instruments and the interior before a tenth wilds volume" suggests FS early; its hosts (the treasury's chip, the commons' registry, POP-2, SP-9) put FS-1 after C3.

## §7 CONFIRMED vs PLAUSIBLE
CONFIRMED by reading at master 81f1cd963: every `path :: symbol` in the volume's §0.1 and every token census row (`token-census.txt`), the effective lines (`efflines.out`, eslint's own Linter), the price-under-siege reading, the `tax_revolt` words-only uses, the push drivers, the deployment path. PLAUSIBLE (named in the volume): the world-week field the composition carries (§3.4), `courtPostureOf`'s `lower` read as bold (§3.3), no import cycle through `commonsVoiceKernel.js` (§4.2), the EC-6 composition order (§4.4), the neighbour-read currency gate (§7.2), CH's seat arm, every DRAFT constant (OD-FS-20, UNMEASURED).


