# WC-2 — WAR CIRCULATION, SECOND HALF (coherence read, 2026-10-16)

Seat: WC second half. Read WHOLE: `volumes-master/DESIGN_FP_ARCH_WC.md` lines 3437–7009 (SECTION 3 through END — the master copy is 7009 lines; it is the plain copy + a 30-line banner at :2–32, so **master line = plain line + 30** everywhere after :32, and one in-body cure at master :6813). The header :1–330 was skimmed for status and the ruling index. Also read: SPINE §1 (:17–110); the fold's WC block (`DESIGN_FP_ARCHITECTURE.md` :1795–1975, :3140–3146, :3224–3240); `DESIGN_WAR_RULINGS_ARCHITECTURE.md` :1705–1740; HB/ES/WY/EC by grep; WY.md and TR-EC.md findings by grep; ODQ by grep; SOL_QUEUE head; the code of record at `00b648c9d` by `rg`/`sed`. Citations: `WC:N` = master line; `ARCH:N` = compiled fold; `src/...:N` = code at `00b648c9d`. The sibling seat's `findings/WC-1.md` did not exist when this file was written; §3 below is therefore restricted to the laws IN MY HALF (SECTIONS 3–8 and the chair ruling), so the two files should not collide.

Ruling index used (header :171–330 + §1 headings): R1 arrival ledger (1.1) · R2 derived stance (1.2) · R3 interdiction (1.3.4) · R4 lawful relay / chaotic skim (1.3) · R6 coercion gradient + inverse (1.17) · R7 call-ins (1.9) · R8 priced shielding (1.2) · R9 doctrine reliability page (1.11); K1 peace-capable primitives (1.16) · K2 hysteresis stability · K3 jubilee beside amnesty · K4 dueling envelopes / siege showcase (1.15) · K5 terms-weight read · K6 CORE/EPIC split · K7 sentences ship in-wave + prisoners/the sea · K8 debt needs exits (1.10). CR-WC-1..22 are in SECTION 6 (WC:5051–5338), all inside this half.

---

## 1. THESIS

The war-circulation volume makes allied, vassal and occupied towns ELECT to send troops and stores to another court's army (credit at ARRIVAL, banked as obligation), derives each party's role in a war from what it actually committed (neutral → materiel → auxiliary → belligerent → principal), and then follows every lent person as an integer count — block in a composite army, column on the road, free company, shed resident, veteran cohort — until the peace returns them home as walls, crime suppression, diaspora bonds and an adventuring class. Seventeen waves, four arcs, six virtual flags (WC:3439–3466).

**The one DM sentence.** The volume authors NO finished DM sentence for any mechanism. Its closing line names where the felt value is meant to be — "its first owner-visible drama is WC-2's stance chip; its showcase is K4's dueling envelopes at WC-10; its launch-copy sentence is WC-14's: the world generates its own adventuring class, with reasons" (WC:7006–7009) — and §7.C gives SHAPES, not sentences: `wc_contribution_arrival` "[sender] fed/reinforced [receiver]'s army before [target]; the kind and band" (WC:6043–6045); `wc_stance_crossing` "[party] has become the war's [rung]; mission creep spoken" (WC:6064–6065); `wc_homecoming` "the double sentence: walls stronger, temple unsettled" (WC:6095–6096). The nearest thing to an authored line is directive (p)'s "muster the veterans and you soften the walls, embolden the alleys, and invite the brigands" (WC:4628–4629, quoted as the WC-16 pin's target, not as a Herald line).
Mechanisms with NO DM sentence at all, by name: the relay's staging and per-hop law-band loss (only the shortfall/skim beats speak); the reservation arithmetic (WC:3897–3900 — "a lapsed reservation emits no beat", WC:3934); the coercion gradient's release standing (R6, WC:3907–3920 — no beat kind in 7.C); the service integrals (blend, drift, comradeship fidelity — WC:4208–4290, no 7.C kind); the endurance envelope's burn (WC-10 has no beat kind of its own in 7.C; only the massing tell is a rumor carrier); the counts-mover manifest and conservation walker (structural, correctly silent); the cohort age bands and diaspora bonds (WC-15 — "cohort chips + tables" WC:4555, no beat); the comrade-fidelity rider (WC:4233–4243).

---

## 2. STATUS, TRUTHFULLY

**The volume's own claims (three spellings).** The 2026-10 banner (WC:3–15) says WC-0A..WC-0E LANDED and `warCirculationEnabled` is minted. The 2026-08-14 banner (WC:17–25) says "ARCHITECTED, NOT BUILT … 7 of the 9 `*Enabled` flags … are unminted" (preserved, superseded). The PROGRESS blockquote (WC:89–91) still reads "ARCHITECTED, NOT STARTED. No wave has landed." The closing line (WC:7000–7001) still reads "Chair questions CR-WC-1..CR-WC-22 await rulings" (reported stale at WC:55–61). The fold (ARCH:3229–3238) says WC-1..WC-16 NOT STARTED, WC-6..16 "Gated: CR-WC-9".

**The progress board** (`fp-kit-87797a6a/FP-PROGRESS-BOARD.md`): ZERO rows for any WC unit (`grep -n 'WC-[0-9]'` finds only an unrelated WY-1 line). `FP-ORDER.md:8` slots "WC-1 … WC-16 (WC-10 after WY-8a)" in **pair 5**, behind the CHAIN-FIRST amendment (FP-ORDER:12–17), under which no WC unit belongs to any named chain.

**The code at `00b648c9d`** — the wc-0 train IS on master (`git merge-base --is-ancestor 9602952ba0 HEAD` → true): `511d2ceb7` WC-0A (vocabularies), `4c87bae45` WC-0B (column union + three-way release fork), `cf7e64660` WC-0C (law-band shape + fence), `e47d67631` WC-0D (amnesty + jubilee, TERM_FAMILIES census), `9602952ba` WC-0E (both flags, ledger shape, blocks[] arm), plus `05b43ec7b` LGT-P13 (the two-flag dormancy fence). `rg -l 'warCirculation|auxiliary|contributionLedger' src/domain/worldPulse` → `worldState.js`, `warStance.js`, `simulationRules.js`, `contributionLedger.js`. None of the 20 other leaves the module map names exist (`contributionMoves`, `contributionDispatch`, `relayNetwork`, `warBlockRoster`, `blockForks`, `joinPreference`, `serviceIntegrals`, `enduranceEnvelope`, `freeUnits`, `freeUnitKernel`, `brigandContest`, `moverAbsorption`, `residentCohorts`, `diasporaBonds`, `veteranReads`, `demobilizationPulse`, `contributionReads`, `callInErrand`, `homecomingEffects`, `armyTransitEnvoy` — `rg --files` zero hits). Flags minted: `warCirculationEnabled` (`simulationRules.js:536`), `contributionLedgerEnabled` (`:560`); gate read `contributionLedger.js:78` (`r.warCirculationEnabled === true && r.contributionLedgerEnabled === true`). The other four (`compositeArmiesEnabled`, `freeCompaniesEnabled`, `moverAbsorptionEnabled`, `veteranCohortsEnabled`) have zero hits in `src`. Writers: NONE — the cert row says so in terms: "the wave calls setSpatialLedger zero times and persists no byte" (`subsystemRowsVirtual.js:323`).

| wave/unit | volume's claim | board | code @ 00b648c9d | verdict |
|---|---|---|---|---|
| WC-0 (A–E) | "Buildable now" (WC:3504); banner: LANDED (WC:3–15); PROGRESS: "No wave has landed" (WC:89) | no row | LANDED: `peopleLedger.js`, `warStance.js`, `contributionLedger.js`, `lawBandModulation.js`; `MILITARY_COLUMN_CLASSES` + `isMilitaryColumn` (`migration.js:504,521`); release guard widened (`migration.js:641`); amnesty/jubilee rows (`peaceTermsCatalog.js:341–342`, `executor: 'seam'`); blocks[] arm (`worldState.js:148–173`); fences `tests/lint/lawBandTable.walker.test.js` + HB-1's `strategyMoveVocabulary.walker.test.js` | **LANDED, dark**; PROGRESS blockquote + closing line STALE |
| WC-1 arrival ledger | NOT STARTED (ARCH:3229) | no row | no writer; `warContributions` 0 hits outside comments | NOT STARTED, buildable (both flags minted) |
| WC-2 derived stance | — | no row | `warStance.js` ladder only, no consumer | NOT STARTED |
| WC-3 relay | — | no row | absent | NOT STARTED; substrate premise STALE (§6 S3) |
| WC-4 strategy/coercion | — | no row | absent; HB-1 minted `STRATEGY_MOVES` + `ALL_MOVE_TOKENS` union for it (`strategyMoves.js:27–31,61`) | NOT STARTED; CR-WC-1 resolved by event |
| WC-5 call-ins/exits | — | no row | absent; NO `ERRAND_CONSUMERS` row for WC (rows: envoys, pact proposals, factors, legates, pilgrims, covert missions, couriers, ambitious — `envoyErrandVocabulary.js:297–360`) | NOT STARTED |
| WC-6..WC-9 | "Gated: CR-WC-9" (ARCH:3229–3233) | no row | absent; flag `compositeArmiesEnabled` 0 hits | NOT STARTED; gate status contradictory (§5 C6) |
| WC-10 | SPEC ROW, HARD GATE WY-8a (WC:4297–4300) | no row | `armySupply.js`, `supplyCargo`, `armySupplyEnabled` 0 hits | NOT STARTED, gate holds |
| WC-11..WC-14 | gated through WC-10 (WC:6551–6566) | no row | absent | NOT STARTED, transitively WY-8a-gated |
| WC-15, WC-16 | CR-WC-21 RULED, "lands unblocked" (WC:6474–6480) vs "UNRULED" (WC:4546, 5694) | no row | absent | NOT STARTED; volume self-contradicts (§5 C1) |

---

## 3. LAWS AND OWNER-SETTLED ITEMS (my half only)

Owner words in this half (verbatim, typography as the volume normalized it):
- R4: "per-hop efficiency reads the PARTICIPANTS' law bands" (WC:5113); spine: "depending on the efficiency of the nearest allied settlement" (WC:5114–5115).
- Directive (p): "muster the veterans and you soften the walls, embolden the alleys, and invite the brigands" (WC:4628–4629).
- The (i) clause cited as forbidding an un-reconsolidatable unit (WC:4369–4370) — paraphrased in the volume, no verbatim quote in this half.
- The owner's figures "100 here, 200 there" (WC:5990–5992, SHED_QUANTUM_BANDS rationale).
- The instruction quoted at WC:4660–4661: "COORDINATE with HB-1's move-vocabulary mint"; and at WC:4699–4700: the auxiliary moves "must join that mint or amend it AT THIS DIRECTIVE'S FOLD".

Standing laws stated in this half (each with its line):
- L1 FLAG FAMILY all virtual, `warCirculationEnabled` "the root conjunct (every WC gate reads it first, by name, !== true fails closed)" (WC:3455–3466). CQ5 one-commit trio; "FLAG WAVES SERIALIZE" (WC:3468–3472).
- L2 EVERY WAVE CARRIES: four-fence dormancy, per-door lit-mutants, rng draw parity, raw-authored tuning "owner-signed at soak (THE PROMISE); nothing enters proposedSoakBands.js before ratification", sentences in-wave (K7), DM parity through the store-action lifecycle, ALIGNMENT LINE (WC:3474–3498).
- L3 Lawband table lands SHAPE ONLY at WC-0; "NO CURVE VALUES LAND HERE … curves are constants and constants are owner-signature surface" (WC:3512–3520; restated WC:4718–4726, 5759–5770).
- L4 The release fork is three-way; `:598` guard widens in the WC-0 commit (WC:3561–3576; WC:5650–5678) — LANDED.
- L5 WR10_FAMILIES_AT_LANDING "is NEVER widened (the widening was STRUCK at §52.1" (WC:3649–3652) — LANDED and pinned (`tests/domain/sovereigntyBundleWr10.test.js:340–354`).
- L6 Single-exporter fences AT-MOST-ONE, tightening to EXACTLY-ONE in the minting volume (WC:3660–3712).
- L7 THE LEVY SWEEP IS MEASURED SILENT; no pin may be authored against levy rows on the seeded corpus (WC:3725–3743).
- L8 Credit at arrival, never at dispatch (WC:3759–3764); exact-once close is TWO pins (WC:3767–3775); decay single-owner (WC:3776–3777).
- L9 Stance is DERIVED, keyed per (party, warEpisodeKey); "AT MOST ONE PRINCIPAL PER SIDE PER EPISODE, never at least one"; "no persisted stance field anywhere" (WC:3801–3818; 7.A.1 WC:5353–5379). NO DECLARER DISJUNCT (WC:5375–5379; rung-swap pin WC:4117–4126).
- L10 People are not stores: troop columns route but never stage or skim (WC:3836–3839, 3855–3860).
- L11 Skim attribution is belief-lagged; shortfall immediate with reason `unknown_hands` (WC:3864–3876).
- L12 R6: release standing composes into `stabilizationSuitability` only; "The REGRESSION and LIBERATION arms stay resistance's and are never written" (WC:3907–3918; WC:4852–4862). Recall stops future credit; "banked credit stands -- lived history" (WC:3919–3920).
- L13 "silence is not a refusal" — `lapsed` never `refused` (WC:3994–3996; CALL_IN_ANSWERS WC:5420–5421).
- L14 ONE BALANCE: answer fork, breach grade and K5 weight all read contributionReads' single balance (WC:4001–4009).
- L15 Reconciliation is DIRECTIONAL; "The old equality-everywhere form is recorded here as UNPASSABLE so that no later wave restores it as a tightening" (WC:4057–4081).
- L16 No id-splitting on "." (WR-8) (WC:4082–4084; WC:4829–4830).
- L17 Envelope exhaustion writes the army's OWN accumulatedAttrition, NEVER realm warExhaustion — "the one-clause veto" (WC:4315–4317; WC:4772–4774).
- L18 Two caps, two names: NETWORK_CARRYING_CAPACITY (mass) reaches an army ONLY by reducing relay throughput (WC:4403–4408; 4419–4430).
- L19 Law M NOT widened; a SECOND counts-mover manifest (WC:4330–4339; WC:4787–4795).
- L20 Shed credits census AND writes the tag in ONE event (WC:4450–4458).
- L21 CR-WC-21 as ruled: "the cohort recency weighting is a BOUNDED, FLOORED band modulation registered with its consumer -- not a decay law -- and only mortality can drive a bond to zero" (WC:4913–4919).
- L22 No new intensity ladder; no new magnitude ladder; credit band BORROWS (WC:4921–4953).
- L23 hopWeeks per-digest; no absolute week literal ≥ 9 (WC:4955–4965).
- L24 No WC module joins eager first paint (WC:5040–5047).
- L25 Casus: "This volume mints NO new casus" (WC:4810–4811). Kind prefix `wc_*` (WC:4817–4818).
- L26 `warTermination.js`: "Zero edits to the frozen file" (WC:4865–4867) — still baselined at 818 (`scripts/.size-baseline.json`).
- L27 DM verbs never edit headcount — "conservation is not editable" (WC:6123–6124).

Chair rulings in this half: CR-WC-1..22 ALL RULED 2026-08-06 per the header (WC:55–61); the section-6 text still carries the pre-ruling RECOMMENDATIONS (WC:5056–5338). The 2026-08-07 CHAIR RULING (WC:6908–6997): "THE COUNT IS 23, NOT 22" (Ruling 1, discharged WC:6938–6961); Ruling 2 "THE THREE TRIPWIRE-LESS CONTRACTS ARE OWED, NOT EXCLUDED … these are WAVE obligations, not fold blockers" (WC:6963–6979). Both marked "OPUS-ERA — FABLE SURVEY OWED … VETOABLE" (WC:6910).
Not vetoable / do-not-touch: the header spelling `Neighbour` ("DO NOT 'FIX' IT", WC:47–50, 6981–6987).

---

## 4. CROSS-PROGRAM CLAIMS

| # | WC claim (line) | Reads/writes/assumes | Other side | Verdict |
|---|---|---|---|---|
| X1 | WC-4 send_reinforcements_to via `muster`/`dispatch` (WC:3891–3906) | a NEW sender-elected reinforcement road | Live: `reinforcement.js` (own-army per-tick flow, route/distance penalty, origin drain, besieged-origin zero, Herald words `REINFORCEMENT_FLOW_WORDS` :75–77), called at `warHomeCosts.js:348–349`; live `convergenceReactive.js:40` `REACTIVE_MOVES ['reinforce', …]` with `ALLY_UNDER_SIEGE → REINFORCE (the relief column)` (:44); live realm verb `REINFORCE` "Reinforce a treaty-ally", grayed: "The relief-column commitment seam is not built yet" (`realmManifest.js:471–487`). WC names none of the three (`grep -i 'reinforcement\.js\|relief\|reactiveResponse'` → 0 in WC, except the fence exclusion). | **SILENT on three live overlaps** — and WC:3667–3669 classifies REACTIVE_MOVES as "battle resolution, a different question", which is wrong for `reinforce` |
| X2 | WC-10 envelope "carried + relay throughput over mass-and-season-scaled burn" (WC:4302–4303); HARD GATE WY-8a F9 (WC:4297–4300) | carried supply as F9 `supplyCargo` | Live scalar supply: `supplyIntegrity`/`foodReserve` (`warArmyRecord.js:127,132`), eroded (`attrition.js:312`), mitigating loss (`attrition.js:226–229`), lifted by reinforcement (`reinforcement.js:213`). WY.md S1 found WY-8a never names them. WC never names them (0 hits). | **DUPLICATES a live quantity** (second supply truth on one record) |
| X3 | WC-3 relay "moves stores through supplyShipments" (WC:4766–4768); identity "debited(sender stores) = arrived + consumed + skimmed + destroyed", "Every term is a named bucket on the shipment record" (WC:1578–1583, cited by WC-3 PINS WC:3851–3853) | quantity-bearing consignments to an ARMY | Live `supplyShipments.js:17–21`: "ONE record per ACTIVE LINK … The cardinality law: records = active links, NEVER per-wagon"; keyed `${settlementId}:${institutionId}:${input}` (institution destination, not army); ":31–33 foodStockpile REMAINS the food buffer — food is never routed here"; TR-EC.md S29 "INFINITE origins". | **DISAGREES** (substrate has no quantity, no army endpoint, no food) |
| X4 | 4.1.1 / CR-WC-1 "whichever volume BUILDS ITS STRATEGY WAVE FIRST mints it" (WC:4673–4676); 8.4 "Row 1's C1 premise HOLDS … ZERO hits" (WC:6830–6833) | the move vocabulary | HB-1 MINTED `STRATEGY_MOVES` (11) + `ALL_MOVE_TOKENS` union (`strategyMoves.js:61`, `1013d58ba`), with the cure "An amending volume adds its dispatched-but-unemitted moves to the UNION and not to the emitted set" (:29–31). HB volume itself is SILENT on WC (0 hits for WC terms). | **STALE premise; resolved by event**; HB's inbound clause lives in CODE, not in the HB volume |
| X5 | 4.1.2 law-band table, four consumers incl. HB r16 learning (WC:4709–4731) | one table | Live `lawBandModulation.js:51` `LAW_BAND_KEYS ['cohesion','drift','learning','relay']`, no curve registered (`registerLawBandCurve(` 0 call sites) | AGREES |
| X6 | 4.1.3 HB r5 believed doctrine minted by HB (WC:4733–4748) | consumed axis | HB volume: believed law band in HB-6 (HB:1841–1885); flag `believedDoctrineEnabled` ABSENT (ARCH:3232) | AGREES in shape; HB gated on HB Q1 |
| X7 | 4.1.4 graded closes; HB r17 checklist "gains the auxiliary rows at ITS fold" (WC:4750–4757) | HB checklist | HB volume 0 WC hits | **SILENT** (HB never took the rows) |
| X8 | 4.2 / row 5 "F9 is owner-SIGNED under the blanket sign-off (2026-08-05) but UNBUILT" (WC:4762–4764) | F9 | ARCH:689 "F9 `supplyCargo` is UNSIGNED at this fold" vs ARCH:3142 J-EM-9 "F1..F9 and CR-WC-9 are SIGNED" (WY.md C3) | **DISAGREES** across volumes |
| X9 | 4.2 / row 8 / CR-WC-15 "kmScale does not exist at HEAD" (WC:4780–4781; 6836) | km scale | `kmScale` live in `spatialDigest.js`, `distanceRead.js`, `modeSpeeds.js`, `campaignSpatialCanonize.js` (WY-1 `d0c135f20`, board :37) | **STALE** |
| X10 | 4.2 / row 7 E16/E17 encounter rows land with resolvers (WC:4775–4778) | WY encounter table | WY.md X13 AGREES; WY's own anti-vacuity literal still unstruck in three places (WY.md C2) | AGREES (WY-side residue) |
| X11 | 4.2 / row 10 law M `MOVEMENT_SITES` named-person only; WC-11 mints counts-mover manifest over "armyTransitKernel.js's stepArmyPosition calls at :467/:502/:698/:742, migrationKernel.js's releaseMigrationArrivals at :336" (WC:4336–4339) | counts steppers | Live callers: `armyTransitKernel.js:482,517,738,789` AND `navalKernel.js:302` (`stepArmyPosition(rec, nowTick)`); `migrationKernel.js:336` exact. FPQ-18 routes the four live speed-floor pairs to WC-11's manifest (FP-QUEUE:21). | **STALE addresses + an OMITTED stepper** (naval) |
| X12 | 4.3 ES tap PRODUCTS never levels (WC:4802–4806); `espionageActive` gate (WC:4820–4822) | ES product registration | ES volume 0 WC hits; `TAP_LEVELS` live `espionageMath.js` (alias of ENVOY_COVERT_TAPS per 8.4 item 5); `espionageActive` live in cert rows | **SILENT** on ES side (Ruling 2 put the repair inbound on ES — not taken) |
| X13 | 4.4 `leviedPopulationBySource` writer "warHomeCosts.js:443/450", readers warCosts:367, warCoalitionExpenditure:159, deploymentReturn:284 (WC:4826–4828) | extend, never fork | addresses drifted (deploymentReturn `OWN conscripts` now :367, `conscripted` :396; WC cites :273/:302 at WC:4061–4064) | AGREES in substance; addresses STALE |
| X14 | 4.4 occupation.js `STATE_LADDER :117`, `stabilizationSuitability (:386)`, `advanceOccupationState (:442)`, `vassalizationOutcomes (:724)` (WC:4848–4856) | consumer input | live `occupation.js:125, 645, 724, 1059`; ladder members unchanged | AGREES; addresses STALE |
| X15 | 4.4 warTermination zero edits; WR-6 single-anchor joinLedger; WR-10 intent road only (WC:4831–4864) | WR surfaces | WAR volume §9 item 7 (WAR:1709–1739) restates all four verbatim | **AGREES** |
| X16 | 4.4 WR-6 "warHomeCosts.js:115-116" peer-levy removal; deployer exclusion ":391" (CR-WC-22, WC:5304–5318) | levy gates | live `warHomeCosts.js:116` comment; exclude set now `:393` | AGREES; :391 STALE by two |
| X17 | 4.5 traditions fourth pass; DESIGN_TRADITIONS.md ledger-only (WC:4871–4878) | relations.js | not checked beyond existence | PLAUSIBLE |
| X18 | 4.5 embattled joins `CRIME_ARCHETYPES`; stressor catalog-ordinary via `normalizeStressor` (WC:4884–4888) | stressor plane | `CRIME_ARCHETYPES` live (`pressureModel.js`), `normalizeStressor` live (`stressorsCore.js`); `stressorDynamics.js` no longer in the size baseline | AGREES; the "~759 eff forces extraction" premise is moot (file not baselined) |
| X19 | WC-14 founding "through INT leaves" + "rides the mercenary market's existing decay shape"; WC-16 readiness term at `warCapabilityOf + martialReadiness` (WC:4506–4508, 4599–4601) | martial institutions | Live `martialReadiness.js:1–31`: readiness01 "war experience … SPIKES it in seasons; extended peace DECAYS it over a generation (the peace dividend) … Feeds: martial institution emergence/viability"; experience01 recency-weighted. INT volume 0 WC hits. | **OVERLAP not reconciled** — WC-16's VETERAN_READINESS_MAX (0.25) adds a second war→readiness term on top of readiness01 (PLAUSIBLE double count) |
| X20 | EC (economy) — WC-3 relay and the EC-18 OPEN ROAD both steer flows on supplyShipments | caravan/relay | EC volume 0 WC hits (`grep '\bWC\b\|WC-\|contributionLedger'` → none in `volumes/DESIGN_FP_ARCH_EC.md`) | **SILENT both ways** |
| X21 | SP-D call-in carriage, row 23 (WC:6704, 6938–6961): "WC-5 takes its own `ERRAND_CONSUMERS` row … at built:false" | errand registry | no WC row in `ERRAND_CONSUMERS` today; `ENVOY_PURPOSES` still `['sue','self_parlay']` (`envoyErrandVocabulary.js:119`) | AGREES (owed at WC-5, not yet due) |
| X22 | Edit Mode (spine req 14): fold maps WC-4 → "realm verb `REINFORCE`" and asks "Take `REINFORCE` (bind what is built) or `resupply`" (ARCH:3227) | DM seal | WC volume 7.D (WC:6108–6147) lists 7 verbs, none is `REINFORCE`/`resupply` | **WC SILENT on the fold's binding** |

---

## 5. INTERNAL CONTRADICTIONS

- **C1 — CR-WC-21 is RULED and UNRULED in the same volume.** Ruled: "RULED (CR-WC-21). The headline claim above stands un-narrowed … not a decay law" (WC:4913–4919); WC-15 "THE CR-WC-21 RULED PIN SET (Position B as ruled…)" (WC:4557–4559); 7.E "RULED (CR-WC-21): three pins land … the wave lands unblocked" (WC:6474–6480). Unruled: WC-15 header "GATED ON CR-WC-21 for the age-band stepping rule" (WC:4539–4540) and "WHOSE STEPPING RULE IS UNRULED" (WC:4546); CR-WC-21 "BOTH POSITIONS, NEITHER TAKEN … The chair rules; until then WC-15 carries the pin in both variants and the wave does not land" (WC:5274, 5294–5295); 7.A.9 "WHAT STEPS THESE BANDS IS UNRULED" (WC:5694); seam row 21 "CARRIED IN BOTH VARIANTS until CR-WC-21 is ruled" (WC:6702). ODQ §73.4 "CR-WC-21 and CR-WC-19 stand VALIDATED" (ODQ:2866).
- **C2 — what the ruling says Position B IS.** CR-WC-21's Position B: "RECENCY_WEIGHTS becomes a decay constant, so directive (n)'s 'no new constant', 1.13.2's 'no new decay law', and 5.1's 'authors ZERO decay constants' must all be amended" (WC:5288–5292). The ruling as recorded at 5.1: "not a decay law" and "The headline claim above stands un-narrowed" (WC:4913–4917). 7.B still says "UNDER POSITION B THIS ROW IS A DECAY CONSTANT and 5.1's claim narrows in the same commit" (WC:6014–6018); WC-15 still says "under variant B this fence keeps its source-scan shape but its DOC claim narrows" (WC:4577–4578). Both cannot hold: the ruled reading is a THIRD position (B's calendar bands + a floor, reclassified as modulation), and three sites still carry B-as-drafted.
- **C3 — the cohort tag "banked in the column record".** 4.5: "the cohort tag banked in the column record is the same pattern, stated in WC-13" (WC:4875–4876); seam row 20 repeats it (WC:6701). WC-13: "the earlier plan had WC-13 credit census with a tag 'banked in the column record' and WC-15 then move those counts … a census -> cohort transfer that appears in no event list" — closed by 0.2's ruling (WC:4452–4458). 4.5 cites as live the design WC-13 retired. (CR-WC-9's field list still carries "column cohort tag" — WC:5134 — which may be the legitimate origin-capture field; the 4.5 sentence needs the distinction.)
- **C4 — the `enumerateMoves` export address, three values.** WC-0 and 4.1.1 and row 1: "bare re-export at :1360" (WC:3663, 4669, 6682); 8.4's in-place cure: "settlementStrategy.js:1294 export { enumerateMoves };" (WC:6813). Live: `settlementStrategy.js:569` / `:1314`. Neither number is current, and the volume now disagrees with itself.
- **C5 — flag count in the parallelization paragraph.** "Both flags and both trios are unchanged, so the CQ5 serialization constraint still binds only the five flag-landing commits (WC-0's two trios, WC-6's, WC-10's, WC-13's, WC-15's)" (WC:6575–6578) vs the six-flag family (WC:3455–3466). "Both flags" is residue of a two-flag draft.
- **C6 — CR-WC-9's status, five spellings across the estate.** WC CR-WC-9: "chair to confirm whether a fresh table is owed given the blanket sign-off's carve-outs" (WC:5144–5146); WC header: "ONE escalation stands — CR-WC-9 … owner-gated" (WC:60–61); SOL_QUEUE head (2026-08-09): the blanket grant "supersedes older UNSIGNED/owner-gated wording … for F9 and CR-WC-9" (SOL_QUEUE:3–7); SOL_QUEUE handoff (2026-08-11): "CR-WC-9, the persisted field batch, is OWNER-GATED and LIVE" (SOL_QUEUE:413–414); ODQ §73.4 (2026-08-15): "CR-WC-9 stays owner-parked" (ODQ:2866–2867); ARCH J-EM-9: "F1..F9 and CR-WC-9 are SIGNED" (ARCH:3142); ARCH status: "WC-6 NOT STARTED. Gated: CR-WC-9 … owner-gated" (ARCH:3229); WAR §9.7 "ONE OWNER GATE IS LIVE" (WAR:1738–1739). The latest-dated ODQ entry (§73, 08-15) says PARKED; the fold's later J-EM-9 says SIGNED; the fold's own status table says GATED.
- **C7 — WC-0's TRACKED rows.** WC-0: "spatialUsage TRACKED rows for warContributions/freeUnits/residentCohorts" land at WC-0 (WC:3580–3581). Overruled by ODQ §73.3 F-1 ("TRACKED rows land only WITH their live setSpatialLedger writers") and the code agrees (`subsystemRowsVirtual.js:373` "refusing a TRACKED row for a key nothing writes"). The volume text was never amended.
- **C8 — the crossing.** "the crossing" names two unrelated things in one volume: the stance band crossing (WC-2/WC-7, `wc_stance_crossing`, WC:3795, 4117) and the entrepot crossing counter ("relay crossings move the existing crossing counter", WC:3863–3864; STAGING "entrepot crossing registration", WC:3832). Homonym, not a logical contradiction — flagged for §9.
- **C9 — "Herald arrival + close beats" at WC-1 vs grades.** `wc_contribution_close` "the war done, the ledger read aloud: grade + band" (WC:6046–6047) lands at WC-1, but the CONTRIBUTION_CLOSE_GRADES `grade` does not exist until WC-9 (WC:4225–4231; 7.A.3 WC:5402–5406). At WC-1 the sentence can only speak `deliveryGrade`. Minor; the shape line should say which grade.

---

## 6. STALE PREMISES (spot-checked at 00b648c9d)

- **S1 — army supply already exists (highest stakes, shared with WY S1).** WC-10/WC-11 hard-gate on F9 `supplyCargo` "the envelope needs carried supply to exist" (WC:4297–4300). Live: `warArmyRecord.js:127` `supplyIntegrity: clamp01(norm(facets.logistics, 0.5) * qMult)`, `:132` `foodReserve: norm(facets.logistics, 0.5)`; `attrition.js:312` `supplyIntegrity: erode(r.supplyIntegrity, 0.5)`; `reinforcement.js:213` (applied at :134) `supplyIntegrity: lift(r.supplyIntegrity, flow.flowFraction * 0.8)`. A carried-supply quantity EXISTS, is eroded by attrition and fed by reinforcement. WC-10's "envelope" over a not-yet-built F9 is a third supply truth.
- **S2 — reinforcement already exists, three times.** WC-4 mints the auxiliary chooser + executor as if no reinforcement road existed (WC:3885–3906). Live: `reinforcement.js:1–5` "A deployed army does not just bleed — its origin can FEED it. Each tick the home settlement sends a PARTIAL, EXPENSIVE replenishment"; `convergenceReactive.js:40,44` REINFORCE relief column to `ally_under_siege`; `realmManifest.js:471–487` the grayed `REINFORCE` verb. WC's only contact is the fence EXCLUSION of `REACTIVE_MOVES` as "battle resolution" (WC:3667–3669, 3688–3690).
- **S3 — the relay's substrate carries no quantity.** WC-3 "skim credited to staging stores + booked as shortfall" over supplyShipments (WC:3835–3840); live `supplyShipments.js:17–21` one quantity-less record per active link, institution-keyed; `:31–33` food never routed. The relay conservation walker (WC:3851–3853) has no buckets to sum on the live ledger; CR-WC-9 lists "shipment relay buckets (consumed/skimmed/destroyed)" as NEW fields (WC:5134) — so WC-3 silently depends on CR-WC-9, but 7.F gives WC-3 no CR-WC-9 edge (WC:6527) and CR-WC-9 says WC-0/WC-1 "touch only the new ledgers" (WC:5144–5145).
- **S4 — CR-WC-1 resolved by event.** "Row 1's C1 premise HOLDS. `STRATEGY_MOVES` … return ZERO hits" (WC:6830–6833). Live `strategyMoves.js:61` `export const STRATEGY_MOVES`; walker `tests/lint/strategyMoveVocabulary.walker.test.js:2` "HB-1. THE SINGLE-EXPORTER FENCE".
- **S5 — kmScale.** "Row 8's premise HOLDS. `kmScale` returns ZERO hits in `src/`" (WC:6836). Live in four src files (WY-1 landed `d0c135f20`).
- **S6 — `enumerateMoves` addresses.** WC:3663 ":634 … :1360" and WC:6813 ":1294"; live `settlementStrategy.js:569` / `:1314`.
- **S7 — migration.js addresses** (the round-3 "ALL CONFIRMED" list, WC:3546–3560, 5620–5678): `:474` DEMOGRAPHIC_COLUMN_CLASSES and `:483` isDemographicColumn STILL EXACT; `:520` class spread now `:558`; key `:553` now `:591`; `releaseArrivals` `:578` now `:616`; guard `:598` now `:641` — and already reads `if (isDemographicColumn(col) || isMilitaryColumn(col))`. Landed, so the WC-0 prose describing a future widening is history.
- **S8 — TERM_FAMILIES census addresses.** `peaceTermsCatalog.js:192` → `:349`; `sovereigntyBundle.js:91/156/167` → `:116/179/191`; the "EXACT-EQUALITY PIN THAT REDS OUTRIGHT" at `sovereigntyBundleWr10.test.js:322` (WC:3636–3640) is now the consumed grown-set pin at `:347–348` (`toEqual(['amnesty','commercial','faith','jubilee','population'])`). Landed by WC-0D.
- **S9 — `convergence.js:743` REACTIVE_MOVES** (WC:3667, 3689): moved to `convergenceReactive.js:40`, re-exported at `convergence.js:774`; ENGAGEMENT_MOVES `:185` → `:190`. The fence (named by identifier) is unaffected; the cited address is wrong.
- **S10 — levy constants.** `warHomeCosts.js:80/81` → `:82/83` (values unchanged 0.004 / 300); deployer exclusion `:391` → `:393`. `subsystemRowsWar.js:55,196,202` EXACT — still MEASURED SILENT.
- **S11 — warDeployment step 5c "after applyHomeWarCosts (:1263, verified)"** (WC:3899–3901): call now `warDeployment.js:1317`.
- **S12 — counts steppers** (WC:4336–4339): `stepArmyPosition` calls now `armyTransitKernel.js:482/517/738/789`; plus an OMITTED stepper `navalKernel.js:302`. `migrationKernel.js:336` exact.
- **S13 — occupation addresses** (WC:4848–4856): `:117/:386/:442/:724` → `:125/:645/:724/:1059`.
- **S14 — warCoalitionDecision.js:108-109 pactStrength/trust** (WC:4259–4262): now `:126–127`.
- **S15 — stressorDynamics "~759 eff" forcing extraction** (WC:4886–4888): `stressorDynamics.js` is no longer in `scripts/.size-baseline.json` (entries: explanation, applyWorldPulse 907, pulseKernel 1581, roadsKernel, warTermination 818, npcGenerator, settlementSlice). The premise is moot, not refuted; the 800 layer ceiling still binds.
- **S16 — `warTermination.js` frozen at 818** (row 19, WC:6700): still exact in the baseline (raw 1091 lines). HOLDS.
- **S17 — the "frozen kernel at 1581" check**: no WC wave edits `pulseKernel.js` per the module map read in this half (the step-5c call is in warDeployment.js). HOLDS (PLAUSIBLE for WC-14's demobilizationPulse wiring — its call site is unstated in this half).
- **S18 — PRESSURE_BANDS / sovereigntyAppraisal magnitude** (WC:4925–4943): `envoyNegotiationPictureBuilder.js:28` and `sovereigntyAppraisal.js:105` EXACT.
- **S19 — `ENVOY_PURPOSES` `:119`** (WC:3961–3962): EXACT.
- **S20 — LAW_WORD_EDGES 0.67/0.33** (CR-WC-8 i, WC:5101–5103): EXACT (`lawWord.js:56`).
- Overturned-by-later-ruling checks: the coin reversal (ODQ §731.1) — WC-12's buy-off "tribute" and "BUY_OFF_PRICE_BANDS DERIVE from stores distribution" (WC:5981–5982) price in STORES, not coin; no coin premise found in this half (PLAUSIBLE clean). The birth door — WC-0's `birth` SOURCE is a people-ledger event, unrelated (clean). FP-40 CHAIN-FIRST (FP-ORDER:12) supersedes WC's CR-WC-16 queue recommendation ("slot ARC A after the current FP phase", WC:5203) — the unit of work is now the next felt chain, and no chain names WC.

---

## 7. THE CLOCK AND THE TIER

Tick = one week (`supplyShipments.js` DEFAULT_TICK_WEEKS 1; spine req 9).

| mechanism | cadence / dwell | felt clock | aspatial? |
|---|---|---|---|
| WC-1 credit at arrival | per arrival; transit = hopWeeks | FAST (weeks) | yes — "aspatial: the bank" (WC:3744) |
| WC-2 stance + crossing | event-updated share; crossing edge-detect with 0.06 margin | weeks–season | yes ("ARC A needs no roster", WC:3789–3790) |
| WC-3 relay skim / naming rumor | per consignment; rumor lag k | weeks | **NO** — supplyShipments is spatial-only; and see S3 |
| WC-4 chooser / reservation | per tick; RESERVATION_HORIZON 13 | season | aspatial arm yes |
| WC-4 R6 release standing | occupation ladder advance | **YEARLY** (ladder climbs) | yes |
| WC-5 call-in | CALL_IN_HORIZON_TICKS 26 | **half-year** to lapse | carriage needs SP-D errands (spatial-agnostic) |
| WC-5 jubilee / debt→vassalage | treaty drafting at peace | war-end (yearly) | yes |
| WC-6 rosters + walker | every tick | invisible | bank-at-arrival needs spatial canon (WC:4026–4028) |
| WC-7 composition news | at crossing; hop-worn | season | spatial (news at road speed) |
| WC-8 block forks | on news arrival at the block | weeks–season | **spatial** (news gate at block location) |
| WC-9 integrals | event-updated at engagement closes; fold at war close | **war-length** | yes |
| WC-10 envelope / massing tell | per tick burn | season (siege) | **spatial + WY-8a** |
| WC-11 fission / free units | on envelope exhaustion; peace at road speed | season → years | **spatial** |
| WC-12 brigand / embattled | per contest | season | **spatial** (nearest by road) |
| WC-13 hop-and-shed | at war end, per hop | **once per war** | **spatial** (migration columns) |
| WC-14 homecoming / institutions | at return; institution founding over peace | war-end + **years** | partly (homecoming via deploymentReturn is aspatial) |
| WC-15 cohorts / diaspora | year-fold mortality; bands at 5 / 20 YEARS | **EPOCH** | yes |
| WC-16 veterans / order dividend | at next muster | **next war (years)** | yes |

**Flags — drama living at the seasonal or yearly clock** (a DM advances a few weeks between sessions): R6 release standing; the call-in lapse (26 weeks); every war-close fold (WC-5 exits, WC-9 grades, WC-13 shed, WC-14 homecoming); WC-15 entirely (decades); WC-16 entirely (the NEXT war). ARC C and ARC D are felt only by a DM who advances years. ARC B's felt beats (forks, fission, brigands) need a lit spatial preset AND WY-8a; the spatial tier was not measured per preset here (PLAUSIBLE: only the canon-lit presets).

---

## 8. DEPTH VS FELT VALUE (the hardest call in the corpus)

The honest shape: the owner's 08-06 directive has a **felt core** — "my ally sent troops; they owe me; they ignored my call; the war I started is now his war; the veterans came home" — and an **accounting epic** built to make "every person conserved end to end, walker-enforced" literally true. ARC A carries most of the felt core and needs no persisted field the owner has not given. ARC B–D carry most of the depth: 13 of 17 waves, about 20 new leaves, four new spatialLedgers, a counts-mover manifest, three people-ledger walkers, and roughly 60 raw-authored constants (7.B), almost all spatial-only, behind WY-8a and CR-WC-9, with most of their drama at the war-end or epoch clock. A DM who plays weekly sessions sees ARC B–D through about ten 7.C beat shapes.

| mechanism | what a DM sees | judgment |
|---|---|---|
| WC-0 registration | nothing (dark) | KEEP — landed |
| WC-1 arrival ledger + close | "Aldmere reinforced Thornhold's army before Kell"; a credit chip | **KEEP** — the owner's "cost memory / charity / debt" spine; FOLD its troops arm onto the live reinforcement flow (S2) instead of a fourth road |
| WC-2 derived stance + crossing | stance chip; "the war he started is now someone else's war" (WC:1319–1321) | **KEEP** — the volume's own first drama, aspatial, weekly |
| WC-3 relay staging, per-hop law band, two-beat skim naming | at most "Kell took a cut on the Aldmere road" | **CUT-TO-SENTENCE** — keep L10/L11 (people are not stores; attribution lags) as law; the per-hop staging network and integer bucket identity have no live substrate (S3). DEFER the network to EC's open road |
| WC-4 chooser + executor | the ally decides to send or keep troops; the grayed REINFORCE verb lights | **KEEP**, FOLD with `convergenceReactive` REINFORCE and the realm verb (one reinforcement road, three entry points) |
| WC-4 R6 release standing | a loyal occupied town is vassalized sooner (yearly) | **CUT-TO-SENTENCE** — one bounded term into `stabilizationSuitability`; no beat exists |
| WC-5 call-in + answer fork + lapse | "Thornhold called on Aldmere; Aldmere refused with the debt standing" | **KEEP** — the felt payoff of WC-1; seasonal |
| WC-5 forgiveness / jubilee / debt→vassalage | war-end treaty line | **KEEP forgiveness** (one DM verb); **CUT-TO-SENTENCE** jubilee (a catalog row already landed); **DEFER** debt-to-vassalage intent road |
| WC-5 doctrine reliability page (R9) | an ally's reliability, read through HB | **DEFER** (HB-gated; HB Q1 unsigned) |
| WC-6 rosters, self-origin block, conservation walker | "the host" composition on the war card | **DEFER with ARC B**; keep the conservation identity as LAW if built |
| WC-7 composite stance + composition intel | the enemy learns who really fields the host | **FOLD into WC-2** (crossing already lives there); composition intel as an ES product row |
| WC-8 block forks | "Aldmere's companies heard their town fell and marched home" | **DEFER** — high felt value but spatial, news-gated, needs WC-6 |
| WC-9 blend / comradeship / drift / fidelity / close grades | "old comrades" colour on later reads | **CUT-TO-SENTENCE** — keep one comradeship pair integral folded at war close (it already writes `shared_service`); cut blend, drift and the fidelity rider |
| WC-10 envelope + massing tell + wick-apart | "the host can hold the siege three more weeks" | **FOLD into live `supplyIntegrity`/`foodReserve`** (S1, with WY); DEFER K4's dueling envelopes |
| WC-11 fission / free units / merge / amnesty executor | "the host broke along its weakest bonds" | **DEFER** — epoch-scale, spatial, needs WC-8/9/10 |
| WC-12 brigandage / embattled | "the free company came down on Kell; Kell is embattled" | **DEFER**, then FOLD into the existing banditry/stressor plane (ARCH:3236 notes HBF-50 `banditryLoss` adjacent) |
| WC-13 hop-and-shed + absorption market | "300 of Aldmere's people stopped at Brenmoor" | **DEFER**, FOLD with POP's migration market (`competeForDestinations` exists) |
| WC-14 homecoming double effect | "walls stronger, temple unsettled" | **KEEP-as-sentence** on the LIVE `deploymentReturn` homecoming (`army_homecoming` Herald kind exists, `heraldRouting.js:95`); FOLD institution founding into `martialReadiness`/`mercenaryMarket` (X19) |
| WC-14 introduction attempts | "a strange rite offered; refused" | DEFER (traditions pass; years) |
| WC-15 cohorts + diaspora bonds | nothing at weekly cadence; decades | **DEFER** — epoch clock; keep L20/L21 as law |
| WC-16 veterans + field-or-garrison | "muster the veterans and you soften the walls…" | **FOLD into `martialReadiness`** (readiness01 already is war-memory-in-structure); keep the field-or-garrison fork as ONE strategist weight |

Net recommendation (PLAUSIBLE judgment, owner-gated because the owner said "no just build it all shipped lit"): build ARC A (WC-1, WC-2, WC-4, WC-5 minus the doctrine page) as ONE chain, bound to the existing REINFORCE seam and the live supply scalars, with WC-14's homecoming sentence on the live return. Record ARC B–D as DEFERRED-with-slot. Their laws (conservation, tags, three-way release fork, two caps) are written down; their machinery waits for a felt chain that asks for it.

---

## 9. VOCABULARY (closed ladders this volume mints)

| name | values | line | code |
|---|---|---|---|
| WAR_STANCE_LADDER | neutral · materiel · auxiliary · belligerent · principal | WC:5353–5379 | `warStance.js:54` |
| STANCE_SCALAR_AXES | casus · exhaustion · terms | (code only) | `warStance.js:89` |
| CONTRIBUTION_KINDS | supplies_delivered · troops_lent | WC:5381–5386 | `contributionLedger.js:47` |
| CONTRIBUTION_DELIVERY_GRADES | delivered · shortfall · none | WC:5390–5396 | not yet |
| CONTRIBUTION_CLOSE_GRADES | honored · partial · unanswered · betrayed | WC:5398–5418 | not yet |
| CALL_IN_ANSWERS | answered · partial · refused · lapsed | WC:5420–5421 | not yet |
| CALL_IN_OUTCOMES | prevailed · stalemated · lost | WC:5423–5426 | not yet |
| CALL_IN_CLOSE_GRADES | the pair OUTCOMES × CLOSE_GRADES, never flattened | WC:5428–5430 | not yet |
| POOLS | block · census · column · free_unit | WC:5434 | `peopleLedger.js:59` |
| RESIDENCY_TAGS | cohort · free_lance | 7.A.4 | `peopleLedger.js:68` |
| COUNT_EVENTS (15) | arrival · arrive_home · defect · depart · dispatch · dm_removed · enlist · fell · fission · merge · mortality · muster · orphan · rejoin · shed | 7.A.4 | `peopleLedger.js:77` |
| CENSUS_DEBITING | dispatch · enlist · mortality · muster | 7.A.4 | `:88` |
| TAG_EVENTS | brigand · demobilize · reclass · untag | 7.A.4 | `:98` |
| SINKS / SOURCES | dm_removed · fell · mortality / birth | 7.A.4 (volume order fell, mortality, dm_removed; code sorts) | `:107–108` |
| TAG_SELECTIONS | pro_rata · untag_only · veterans_first | 7.A.4 | `:118` |
| BLOCK_FORK_OUTCOMES | stay · return · defect · resist | WC:5592–5603 | not yet |
| FREE_UNIT_STATES | operating · foraging · brigand · dissolving | WC:5605–5610 | not yet |
| EMBATTLED_RESOLUTIONS | suppression · attrition · absorption · buy_off | WC:5612–5618 | not yet |
| MILITARY_COLUMN_CLASSES | reinforcement_column · shed_column · veteran_return | WC:5620–5636 | `migration.js:504` |
| COHORT_AGE_BANDS | newly_arrived · settled · rooted | WC:5688–5700 | not yet |
| LAW_BAND_KEYS | cohesion · drift · learning · relay | (WC:4709–4731 by name) | `lawBandModulation.js:51` |
| beat kinds | 22 `wc_*` kinds | WC:6033–6103 | none |

**Homonym hazards for the chair:** `partial` (an answer AND a close grade, two vocabularies of one volume); `brigand` (a TAG_EVENT AND a FREE_UNIT_STATE); `attrition` (an EMBATTLED_RESOLUTION vs `attrition.js` bands vs `accumulatedAttrition`); `absorption` (a resolution vs `moverAbsorption`); `return` (a fork outcome vs the retired two-hop event split into depart + arrive_home); `reinforce`/`reinforcement` (WC's send_reinforcements_to vs `REACTIVE_MOVES.reinforce` vs `reinforcement.js` flow vs `reinforcement_column`); `materiel` (a stance rung vs `reinforcement.js` W_MATERIEL / `origin.materiel` facet); `settled` (a cohort band vs settlement); `crossing` (stance crossing vs entrepot crossing, C8); `shortfall` (a delivery grade vs `shortfallBand`); **`ALIGNMENT LINE`** (WC:3497 — a doc-row obligation) vs the spine's req 13 "Each wave carries an Alignment line" (SPINE:92, the lawfulness/malice coupling) — WC uses the spine's term for something else and never states its req-13 alignment engagement.

---

## 10. REFINEMENTS (dated-bracket corrections; master line numbers)

1. `[WC:89–91]` — "ARCHITECTED, NOT STARTED. No wave has landed." → `[CORRECTED 2026-10-16 (coherence fold) — WC-0A..WC-0E LANDED on master (511d2ceb7 · 4c87bae45 · cf7e64660 · e47d67631 · 9602952ba; dark, no writer). WC-1..WC-16 NOT STARTED.]` — status truth.
2. `[WC:4539–4546]` — "GATED ON CR-WC-21 … WHOSE STEPPING RULE IS UNRULED" → `[CORRECTED 2026-10-16 (coherence fold) — RULED 2026-08-06 (5.1, WC:4913): calendar bands 5/20 with a FLOORED recency modulation, not a decay law; WC-15 is not gated on CR-WC-21.]` — C1.
3. `[WC:5274–5295]` — "BOTH POSITIONS, NEITHER TAKEN … the wave does not land" → `[RULED 2026-08-06 (b75e8c4d) — neither A nor B as drafted: B's calendar bands, with RECENCY_WEIGHTS reclassified as a bounded floored modulation; 5.1 stands un-narrowed. See 5.1 and the WC-15 pin set.]` — C1/C2.
4. `[WC:5694]` 7.A.9 "WHAT STEPS THESE BANDS IS UNRULED" → `[CORRECTED 2026-10-16 — ruled: calendar edges 5/20 years; mortality is the only zeroing road.]` — C1.
5. `[WC:6014–6018]` 7.B RECENCY_WEIGHTS "UNDER POSITION B THIS ROW IS A DECAY CONSTANT and 5.1's claim narrows" → `[CORRECTED 2026-10-16 — under the ruling this row is a floored band modulation, NOT a decay constant; 5.1 does not narrow. The floor is the last weight (.25).]` — C2. Same at `[WC:4577–4578]` ("under variant B … DOC claim narrows") and `[WC:6007–6012]` (AGE_BAND_EDGES "LIVE ONLY UNDER CR-WC-21's position B").
6. `[WC:6702]` seam row 21 "CARRIED IN BOTH VARIANTS until CR-WC-21 is ruled" → `[CORRECTED 2026-10-16 — ruled; the three-pin set of WC-15 is the tripwire.]` — C1.
7. `[WC:7000–7001]` closing "CR-WC-1..CR-WC-22 await rulings" → `[CORRECTED 2026-10-16 — all 22 RULED 2026-08-06; CR-WC-9 status: see refinement 15 / owner question 1.]` — already reported at WC:55, but unstruck at its site.
8. `[WC:3663]`, `[WC:4669]`, `[WC:6682]`, `[WC:6813]` — ":634 … :1360" / ":1294" → `[CORRECTED 2026-10-16 — settlementStrategy.js:569 / :1314 at 00b648c9d; navigate by symbol.]` — C4/S6.
9. `[WC:6830–6833]` "Row 1's C1 premise HOLDS … ZERO hits" → `[SUPERSEDED BY EVENT 2026-10-16 — HB-1 MINTED STRATEGY_MOVES + ALL_MOVE_TOKENS (strategyMoves.js:61, 1013d58ba). WC-4 AMENDS the UNION, never the emitted set (strategyMoves.js:29–31). CR-WC-1 closed by build order.]` — S4. Beside `[WC:4663–4707]` 4.1.1 and `[WC:5056–5061]` CR-WC-1.
10. `[WC:6836]` and `[WC:4780–4781]` "kmScale … ZERO hits" → `[CORRECTED 2026-10-16 — kmScale is live (WY-1, d0c135f20); CR-WC-15's ordering note now reads against the published scale.]` — S5.
11. `[WC:4297–4303]` WC-10 gate → `[ADDED 2026-10-16 (coherence fold) — a carried supply already exists: supplyIntegrity/foodReserve (warArmyRecord.js:127,132), eroded at attrition.js:312, fed at reinforcement.js:213. The envelope reads THAT quantity or the owner rules F9's relation to it (WY owner question 1); never a third truth.]` — S1.
12. `[WC:3885–3906]` WC-4 LANDS → `[ADDED 2026-10-16 — three live reinforcement mechanisms precede this wave: reinforcement.js (own-army flow), convergenceReactive.js REINFORCE (relief column, ally_under_siege), realmManifest.js REINFORCE (the grayed DM verb "Reinforce a treaty-ally"). The executor BINDS them; it mints no fourth road.]` — S2/X1/X22.
13. `[WC:3667–3669]` and `[WC:3688–3690]` "REACTIVE_MOVES … battle resolution, a different question" → `[CORRECTED 2026-10-16 — REACTIVE_MOVES (now convergenceReactive.js:40) holds 'reinforce', the ally-relief move; it is THIS volume's question. The fence exclusion stands for the scan; the semantic overlap is owed at WC-4.]` — S2/S9.
14. `[WC:3835–3840]` WC-3 LANDS → `[ADDED 2026-10-16 — supplyShipments is one QUANTITY-LESS record per active institution link (supplyShipments.js:17–21) with food excluded (:31–33). The relay identity needs CR-WC-9's "shipment relay buckets" (WC:5134), so WC-3 depends on CR-WC-9 and 7.F's WC-3 edge is incomplete.]` — S3.
15. `[WC:5129–5152]` CR-WC-9 → `[ADDED 2026-10-16 — status spelled five ways: SOL_QUEUE:3–7 (superseded by the grant), SOL_QUEUE:413 (LIVE), ODQ §73.4 (owner-parked), ARCH:3142 J-EM-9 (SIGNED), ARCH:3229 (gated). Owner to confirm one reading.]` — C6.
16. `[WC:3580–3581]` "spatialUsage TRACKED rows for warContributions/freeUnits/residentCohorts" → `[CORRECTED 2026-10-16 — overruled by ODQ §73.3 F-1: TRACKED rows land only with their writers (WC-1, WC-11, WC-13).]` — C7.
17. `[WC:4875–4876]` and `[WC:6701]` "the cohort tag banked in the column record is the same pattern" → `[CORRECTED 2026-10-16 — the column carries the ORIGIN (capture timing law); the cohort TAG is written by `shed` in the same event (WC-13, 0.2). No tag is banked for a later transfer.]` — C3.
18. `[WC:4336–4339]` counts steppers → `[CORRECTED 2026-10-16 — stepArmyPosition calls at armyTransitKernel.js:482/517/738/789 AND navalKernel.js:302 (omitted); the manifest's discovery signature must find the naval stepper. FPQ-18 also routes four speed-floor pairs here.]` — S12.
19. `[WC:6575]` "Both flags and both trios are unchanged" → `[CORRECTED 2026-10-16 — six flags; the five flag-landing commits carry six trios (WC-0 carries two).]` — C5.
20. `[WC:4599–4601]` WC-16 readiness term → `[ADDED 2026-10-16 — martialReadiness.readiness01 already accrues from war and decays through peace; VETERAN_READINESS_MAX composes WITH it (one cap over both) or is not added. Measure double counting at build.]` — X19.
21. `[WC:3497]` "ALIGNMENT LINE: the wave's doc row lands …" → `[CLARIFIED 2026-10-16 — this is the DOC-alignment row, not the spine's req-13 Alignment line. Each wave still owes its req-13 read: lawfulness via lawWordFor (relay, cohesion, drift, rejection); malice is unengaged, and the reason is owed.]` — §9 homonym.
22. `[WC:3474–3498]` EVERY WAVE CARRIES → `[ADDED 2026-10-16 — the spine's crown law (SPINE §1 req 6) is absent: "dossier" appears ZERO times in this volume. Each wave owes its DOSSIER ROUND-TRIP pin: credit, stance, call-in, cohort and veteran each land on the town where a DM looks.]` — spine compliance.
23. `[WC:6046–6047]` wc_contribution_close "grade + band" → `[CORRECTED 2026-10-16 — at WC-1 the deliveryGrade; the CONTRIBUTION_CLOSE_GRADES grade joins at WC-9.]` — C9.
24. `[WC:6033–6103]` 7.C → `[ADDED 2026-10-16 — every shape here is judged under THE EVIDENCE LAW (owner 10-02/10-03, "COMPLETE, NOT CRYPTIC"): rung words (principal/belligerent/materiel) never reach a DM sentence raw; wc_relay_shortfall names the consignment, the loss and the road, and stays silent on the hand.]` — the voice program.

---

## 11. OPEN QUESTIONS FOR THE OWNER

1. **CR-WC-9, the persisted field batch** (deployment.blocks[] + drawnCohorts, transit projection, shipment relay buckets, column cohort tag + classes, four new spatialLedgers, one edge archive; WC:5129–5152). The estate gives five readings (C6). Is it SIGNED under the 2026-08-05 grant (J-EM-9) or still PARKED (ODQ §73.4)? It gates WC-6 onward and, per S3, WC-3 as well.
2. **Re-sequencing: build ARC A as a felt chain; ARC B–D deferred-with-slot?** This would take back the owner's "no just build it all shipped lit" for 13 of 17 WC waves. The chair cannot decide it under FP-40.
3. **One army-supply truth** (with WY owner question 1): should WC-10's envelope read the live `supplyIntegrity`/`foodReserve`, or should F9 `supplyCargo` stand as an integer stock with the scalar derived from it?
4. **The REINFORCE binding** (a DM-visible Edit Mode seal; Edit Mode is the premium surface under U16): should WC-4's executor light the grayed `REINFORCE` verb, so one road serves the reactive scorer, the realm verb and the elected send? Or should it stay a separate `resupply` seal (ARCH:3227)?
5. **CR-WC-7's lit-only coalitionShares golden shift** (WC:5094–5097). This is a declared one-time re-record at lighting. It was ruled by the chair; the signature on the shift is the owner's.

**Evidence class:** everything in §2, §4, §5 and §6 is CONFIRMED by a read (volume line or `rg`/`sed` at `00b648c9d`). §7's spatial tiers per preset, X17, X19's double count, and every §8 judgment are PLAUSIBLE (reasoning only).
