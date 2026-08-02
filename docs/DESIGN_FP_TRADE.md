# DESIGN — THE FOREIGN POLICY TRADE ARCHITECTURE (FP-TRADE, compiled for build)

## Fable 5 drafting under the Foreign Policy Spine, 2026-08-02. This volume is BOUND
## BY DESIGN_FP_SPINE.md; where they conflict, the SPINE wins and the conflict is a
## bug to report. Its §3 FP-TRADE crux rulings are settled law elaborated here, never
## re-opened. Substrate claims below carry file:line evidence from the three
## commissioned surveys (mechanics, measurement, agency — workflow wf_bc2973f7-35f,
## executed 2026-08-02 against claude/composite-r4); anything asserted beyond that
## evidence is marked VERIFY-AT-BUILD. Implementation is assigned to the external
## implementer (Sol); this document is self-contained: an implementer with zero
## session context, this volume, and the SPINE can build every wave.

**Status: ARCHITECTURE. Nothing here is scheduled until the owner sequences it per
SPINE §5 (SP → GRAMMAR → INFO → TRADE → …), behind the sim-proof path. Every wave
ships DARK. The judgment blocks in §6 are the drafting chair's rulings under
delegation — vetoable here. The endings vocabulary {fortune, ruin, monopoly,
collapse, severance, cornered} is OWNER-SETTLED (SPINE §3) — names not vetoable;
envelopes are.**

**Reading order for the implementer [CORRECTED 2026-08-02 (fp-audit) — the prior
order left ~20 binding-law shorthands unresolvable]:** DESIGN_FP_SPINE.md (the
constitution; its twelve requirements bind every mechanism below) → this document
top to bottom → DESIGN_WAR_RULINGS_ARCHITECTURE.md §1/§3/§10 (the format
precedent, the seam-ruling idiom, and the implementer protocol that binds here
verbatim) PLUS its §5/§6 (where WR-7a/7b/7d, WR-8, WR-9, WR-10 and the J-WR
judgment blocks live — this volume consumes their machinery by name) →
DESIGN_REALM_DIRECTIVES.md's amendment ladder A..S (amendments A, B, I, L, M and
the K/P wave laws cited below are BINDING law, not colour) →
DESIGN_FP_COUPLINGS.md for every coupling this volume declares →
docs/GENERATION_CONTRACTS.md + the gate discipline. §1d below maps every
cross-program shorthand to its source document.

---

## §1 THE LAWS THAT BIND EVERY WAVE

### 1a Constitutional (the engine's standing laws — identical to the war volume's,
### restated because every one will be tested by this program)
1. **Same-seed byte identity.** Same seed and inputs ⇒ byte-identical output, forever.
2. **Dormancy.** Every wave ships DARK behind a virtual flag (absent from
   DEFAULT_SIMULATION_RULES); dark ⇒ byte-identical, golden-pinned BEFORE wiring.
3. **Seeded purity.** No Date.now, no Math.random, no locale reads, no Object-key
   iteration on user data without codepoint sort, no transcendentals in engine paths.
4. **Monotone ratchets.** Size/any-cast/first-paint baselines only shrink; new engine
   code is a lazy leaf; zero new any-casts.
5. **Receipts carry enforcement.** Every news entry carries `id` (the id-less drop
   class voids entries at BOTH normalizeEntry and the audit sink), full address
   chain, typed action, settlements BY NAME, recorded reason.
6. **Premium isolation + audience projection.** Free surfaces never see DM truth;
   every new projection rides includeCovert/includeGroundTruth.
7. **Finite semantics.** Every vocabulary here is CLOSED and banded; no float
   reaches a surface; the AI, if ever adjacent, is a bucketing clerk.

### 1b Program laws (the SPINE's twelve instantiated for commerce; violations are
### design defects)
- **T1 — NO PRICE ENGINE (Law One made commercial):** the engine models BUYERS who
  believe, never markets that clear. There is no numeric price anywhere. The one
  scarcity vocabulary is CLOSED and five-banded — `SCARCITY_BANDS = {glut, soft,
  fair, dear, desperate}` — and it exists in exactly two non-merging forms:
  TRUTH-SIDE scarcity (derived from physical stocks and the food ledger, consumed
  only by physics) and BELIEVED scarcity (an SP-2 belief subject, consumed by every
  decision). A DM can reflavor any band; the engine never contradicts a DM's economy.
- **T2 — NO COIN (standing owner ruling, recorded at treatyTransfer.js:11-20, the
  f3cf639e judgment):** no conserved coin primitive exists or may be introduced.
  House books, tolls, credit, stakes, and fortunes are BANDS. Conservation applies
  exactly where objects move: goods units in the M6a balance, grain-months at the
  granary. Money-shaped drama is band drama.
- **T3 — SINGLE WRITERS, EXTENDED NEVER FORKED [CORRECTED 2026-08-02 (fp-audit)]:**
  "extend never fork" means ONE WRITER FAMILY, never one file. `peaceTerms.js`
  remains the terms AUTHORITY, but all new commercial capability lands in LAZY
  LEAF SIBLINGS consuming its exports (the chair's R2 hot-file ruling — peaceTerms
  gains only net-zero seam lines). The granary lane's tree truth: there is NO
  single writer of food-months today — FIVE world-write sites move `storageMonths`
  (the tick advance foodStockpile.js:406/:479; the generosity/treaty delta
  applicator `generosityUpdates.applyFoodDeltasToUpdates` at generosityUpdates.js
  :65, which treatyTransfer.js:32/:121-136 names "the existing single applicator"
  FOR ITS LANE; a second near-identical delta fold at applyWorldPulse.js:322; the
  magic-buffer draw magicBufferApply.js:357; a DM event leg mutateWorld.js:1143).
  TR-4 routes ALL new grain-arrival credit through `applyFoodDeltasToUpdates` and
  lands a source-scan pin: no SIXTH writer of storageMonths lands with this
  program — the five existing sites are the fence the T7 walker covers. Whether
  applyWorldPulse.js:322 is a pre-existing second-writer defect is REPORTED to
  the validation chair at TR-4 build time, never silently ruled here.
  `dispositionLedger.js` stays the disposition writer; every new ledger below
  names its one writer. A second writer of any NEW ledger is a design defect.
- **T4 — E3 FOR COMMERCE:** books, appetite, posture, and disposition COLOUR
  thresholds; they never select a partner, a victim, or a market. No read exported
  by any house/market module may return a target list. Import lists pinned (the P4
  no-hidden-governor pattern), token scans + guard-the-guard per the K3 idiom.
- **T5 — NO RATCHETS:** fortune is reversible (ruin reachable from the top band —
  reversal pinned); monopoly and the corner are ENDINGS with counterforces, never
  steady states; appetite learns DOWN from losses (the merchantAppetite reversal,
  SP-4a); credibility falls faster than it rises. Every stock in this program
  decays toward neutral on a banded half-life.
- **T6 — MORAL PRICING, NEVER PROHIBITION:** profiteering, cornering, gouging, and
  the wartime firesale are LEGAL machinery, priced by conscience, credibility, the
  commons, the seat, and the world's judgment on the observer's axis. The estate's
  one hard alignment boundary remains razing initiation (WR-8); commerce has NONE.
  Out-of-posture acts are priced and receipted news, never forbidden (SPINE §1.10).
- **T7 — THE DOUBLE-COUNT LAW (this program's native hazard, promoted to law)
  [CORRECTED 2026-08-02 (fp-audit) — restated against the real arithmetic]:**
  exactly ONE live food-import ARM per settlement per tick. There is no per-tick
  "import term" to replace: import coverage is NETTED into the generation-baseline
  `baseDeficitPct` stash (foodStockpile.js:288 — the sacred generation baseline),
  and FOOD_IMPORT_RATES reaches the tick lane only through the blockade arm's
  `importDependency` read (:314-324). The law therefore fences TWO real sites —
  the baseDeficitPct import share and blockadePct's importDependency read — plus
  TR-4's new lit-only arrivals term; the walker asserts that exactly one of
  {netted rate share, physical arrivals} is live per settlement per tick, in BOTH
  flag states. The M2 kernel already excludes food by design (supplyKernel.js
  header — survey-verified). TR-4 SUBSTITUTES inside this fence; it never adds an
  arm and never rewrites the generation stash (GENERATION IS SACRED,
  tradeFlow.js:13-18).
- **T8 — BELIEF DISCIPLINE (K3/K4 commercialized):** no merged market estimate
  exists anywhere; believed scarcity is never refreshed from truth (updates arrive
  only via arrivals, rumor, and plants — all existing belief machinery); every
  belief-side module ships the structural pin set (import pin + token scan +
  guard-the-guard, positive control pointed at a legitimate truth reader such as
  the truth-side scarcity derivation itself).
- **T9 — SHARED-SUBSTRATE FENCE:** `tradeWar.js`, `warReasons.js`, `peaceTerms.js`,
  `treatyTransfer.js`, `supplyWebWarfare.js` are war-program surfaces this program
  touches ONLY at seams named in §3; `momentum.js` stays FOREIGN estate-wide;
  `demographicsPlans.js` carries its own fence ("must not become a general planning
  system" — its header) and TR-7 reuses its GRAMMAR, never its writer. Any conflict
  with a WR wave in flight is a STOP-and-report to the validation chair.
- **T10 — THE TWO-TIMESCALE ECHO (SPINE §1.9), named per wave:** commerce responds
  weekly (dispatches, arrivals, band moves) and concludes seasonally-to-
  generationally (pact verdicts, house fortunes, the corner's breaking, diaspora-
  grade memory of the gouge). Every wave below names its fast layer and its slow
  verdict; every clock is denominated against INTERVAL_WEEKS and asserted by the
  SP-7 temporal walker; treaty-years are 52-week years (WR-0c item 4, LANDED).

### 1c Recorded hazards that WILL bite these waves (each has bitten this estate)
- **JSON-alias trap:** factors and house members ARE `npcs[]` objects in memory;
  every roster-touching fixture JSON-round-trips.
- **Faction-key/rename family [CORRECTED 2026-08-02 (fp-audit) — omitted at
  drafting; a recorded estate hazard this program walks straight into]:**
  archetype/name/membership reads go through `factionArchetype()`/`nameOf`/
  `governingFactionOf`/`npcInFaction` ONLY, never hand-rolled; storing
  `.archetype` is FORBIDDEN. `factionArchetype()` resolves category-first and
  falls back to a NAME/description REGEX (factionArchetypes.js:85-96; the
  MERCHANT row at :63) — house eligibility is therefore RENAME-SENSITIVE while
  TR-2's books are event-accrued and NOT re-derivable (J-TR-3): a DM rename must
  land in TR-2's dormancy rule, never orphan persisted books (the rename
  round-trip pin, TR-2).
- **Writer/reader payload-spelling drift:** every new ledger gets a pin that boots
  the REAL writer and reads through the REAL reader.
- **Self-referential pins:** the corner's share denominator comes from an
  INDEPENDENT supply census, never from the house's own declared interests (a pin
  whose denominator is its own map proves list==list).
- **Vacuous absence pins:** `toHaveLength(0)` against empty-by-default harness
  state proves nothing — seed non-empty markets/houses first.
- **Unreachable predicate conjunctions:** the corner gate, the pact-formation
  crossing, and every ANDed eligibility below carry reachability pins on real
  generated corpora (a seeded failure count is a LOWER bound).
- **Stream theft:** rng keys are per-entity (`house:<factionId>`,
  `venture:<ventureId>`, `factor:<errandId>`), draw-accounted.
- **Id-less news drop / WHAT_PHRASES totality:** every minted kind registers in
  WHAT_PHRASES + heraldRouting or the totality walkers red — this program mints
  more new kinds than any since war.
- **Authored NUL bytes; sizeBaseline ceilings; domain-layer ratchets; hot files:**
  new logic is a lazy leaf; EventComposer-class files are net-zero only.

### 1d THE SHORTHAND MAP [CORRECTED 2026-08-02 (fp-audit) — the reading order
### promised this glossary; every token below carries BINDING law, not colour]
- **Amendments A/B/I/I2/K3/K4/L/M** = DESIGN_REALM_DIRECTIVES.md's amendment
  ladder: A (every cause needs a real counterforce, :174) · B (absolute
  coherence with settlement state — the suppression law: a claim contradicted
  by a live read scores 0 with a receipt naming the read, :184) · I
  (multi-party/coalition law; pairwise instruments, :509) · I2 (what an ally
  spent does not vanish — derive, never store, spent effort, :539) · K3
  (NOBODY IS EVER CURRENT — the belief discipline: import pin + token scan +
  guard-the-guard, :733) · K4 (many envoys, many truths — reconciliation +
  scope-bound reads, :765) · L (convergence: it must end, and not by a timer,
  :801) · M (travel is slow and the road is a place — the week floor, :843).
- **K.2 / K.7** = wave-K envoy laws in the same ladder: K.2 (the envoy carries
  a snapshot that decays, :648) · K.7 (the silent envoy is read as hostility,
  and the reading may be wrong, :680).
- **Wave P / "P4's law"** = the population program (P1..P4, same document):
  the demographic floor + capability collapse (:818) and the no-hidden-governor
  discipline — nothing starves or grows through an unnamed governor.
- **J2/J3/J4** = DESIGN_ROUTE_LIFECYCLE.md's route-lifecycle slices (flows,
  charters, consumers; the decay ladder's bottom rung is `hidden` — NOTHING IS
  FORGOTTEN).
- **WR-* waves and J-WR-* judgment blocks** = DESIGN_WAR_RULINGS_ARCHITECTURE.md
  (§5/§6 per the reading order).
- **W-C2** = the conscience-gated seizure-take law, recorded in the tree at
  commodityFlow.js:609 ("an evil seizer takes near-all, a good one little").
- **The two-picture law** = SP-3's negotiation discipline (each party appraises
  on its OWN believed picture; DESIGN_FP_SPINE.md §2).

---

## §2 SUBSTRATE CENSUS (from the three surveys, 2026-08-02; live code outranks this
## table — re-verify anything you build on)

| Substrate | Where (survey-verified) | State |
|---|---|---|
| M2 supply shipments: routed non-food inputs, K=3 ranked producers, hostile-gate interception, banditry, starvation latch + mandatory causal receipt, siege interdiction feedback | `spatial/supplyShipments.js` (interception :209, starvation :404-406, receipt :227, interdiction :504); adapter `worldPulse/supplyKernel.js` | BUILT, LIT under spatial canon; FOOD EXCLUDED by design |
| M6a commodity flow: finite origin stocks, integer caravan loads (MAX_SHIP 12), en-route taps, banditry, EXACT five-term integer conservation, kernel refuses to persist imbalance; seizures conserve loot to the seizer | `spatial/commodityFlow.js` (assertGoodsConservation :260, seizure :613-617); guard `supplyKernel.js:488-493` | BUILT; gated `commodityFlowEnabled`, lit only in full_simulation (simulationRules.js:424). **Stricter conservation than war's.** |
| M6b entrepôts: earned EWMA centrality, derived toll (TOLL_MAX cap), four co-built brakes, transshipment institution founding, centralityGini soak guard | `spatial/entrepots.js` (:112-116 foundings, :370 gini), `entrepotKernel.js` | BUILT. Toll is a DERIVATION — no seat chooses a rate; no actor owns the income (T2) |
| M6c dispatch EV: belief-gated go/no-go (`netDanger = believedDanger·caution − needPremium·appetite`), REFUSE/RESUME deadband, dynamic per-origin appetite with "emboldened" receipts, vassal must-go overrides | `spatial/dispatchEV.js` (:12-31, :75, :185-190); appetite receipts supplyKernel.js:599-602; ledgers `merchantAppetite` + `dispatchWillingness` | BUILT — **the SP-4a seed pattern**; belief gates WHETHER, nothing yet chooses WHERE by believed markets |
| M6d trade flow tally + display bands (shortage/adequate/surplus) beside the sacred generation baseline; blockade ⇒ decay to autarky | `spatial/tradeFlow.js` (:13-18), `display/tradeFlowEconomics.js` | BUILT — display substrate, deliberately unconserved |
| M7 smuggle: spill-on-refusal warrant, one roll vs worst gate, relational CONTRABAND_TABLE, conscience-gated seizures, criminal rumor carrier | `spatial/smuggle.js` (warrant :335, worstGate :287, pipeline :258, table :87); carrier pulseKernel.js:1758-1783 | BUILT — the corner-breaking channel already exists |
| M8 sea lanes: port eligibility (geography ∧ maritime institution), water-priced frozen digest, storm seasons slow-not-sever; capacity recorded, unenforced | `spatial/seaLanes.js` (:81-95 capacity note) | BUILT (frozen geography, not flow) |
| J route lifecycle: flow counting via ONE attribution table, demand-then-event charters through the docket, decay ladder (bottom rung `hidden`, NOTHING IS FORGOTTEN), lived-network consumers, self-sufficiency 0..1 | `worldPulse/routeNetworkFlows*.js`, `routeNetworkCharter*.js`, `routeNetworkDecay.js` | BUILT + TESTED, DARK (`routeLifecycleEnabled: false`, simulationRules.js:449-462); **17 modules, ZERO Herald presence** |
| K4 magic economy: substitution as a percentage-of-need TERM; reagents ride existing chains | `worldPulse/magicSubstitution*.js` | BUILT, DARK (`magicEconomyEnabled: false`) |
| Goods vocabulary: canonical ids, criticality (grain 0.95), alias folding `normalizeGood`; chain needs → activeChains; status envelope; generation-time trade links (hostile ⇒ NO_TRADE) | `region/goodsCatalog.js`, `data/supplyChainData.js`, `supplyChainState.js`, `region/tradeLinks.js` (:26) | BUILT — the shared denomination every wave reads |
| FOOD: import is a STANDING RATE (FOOD_IMPORT_RATES keyed on tradeRouteAccess tier); tick food moves by percentage-of-need terms through advanceFoodStockpile; conserved foodLedger feeds sustenance + salience. **THE TICK-LANE TRUTH [CORRECTED 2026-08-02 (fp-audit)]: there is NO per-tick import term** — import coverage is NETTED into the generation-baseline `baseDeficitPct` stash (foodStockpile.js:288, the sacred generation baseline); FOOD_IMPORT_RATES reaches the tick lane ONLY through the blockade arm's `importDependency` read, which already carries THREE BUILT bypass counterforces (`_bypassShare` teleport/airshipBesieged :314-317, `_underwaysShare` underways trickle :320, combined and subtracted :321-323); the effective deficit is the six-term sum at :346-347 | `generators/economy/foodBalance.js`, `worldPulse/demographicsRates.js`, `foodLedger.js`, `worldPulse/foodStockpile.js` (:288, :314-324, :346-347) | BUILT — **no grain caravan ever physically crosses the map outside treaty streams. The flagship-good asymmetry, survey-confirmed.** |
| Treaty economics: TERM_CATALOG's economic family is EXACTLY four (tribute, reparations, restitution, resource_share), all conserved sink-only grain-month streams with a reserve floor; 52-week treaty year with legacy-12 provenance markers | `worldPulse/peaceTerms.js` (:164-191), `treatyTransfer.js`, `treatyClock.js` | BUILT. `trade_exclusivity` / `market_access` / `toll_exemption` return ZERO hits tree-wide — WR-10 names them as bundle components; **their EXECUTORS land HERE (TR-5) or nowhere; catalog membership + spelling are canonical in GRAMMAR §4 per the R3 term-family ruling [CORRECTED 2026-08-02 (fp-audit)]** |
| Typed channels + relationship state: trade triple (trade_dependency, export_market, trade_route), trade_partner rules (neutral_to_trade_partner, trade_to_allied, disruption, smuggling pressure) | `region/graph.js:47-64`, `worldPulse/relationshipEvolution.js:38-50` | BUILT — drift-formed, never decided |
| tradeWar: primary-partner contest with hysteresis + FLIP_COOLDOWN 6, incumbent demotion, disposition banked, escalation deposits a war INTENT through the one opener (WR-0c item 3 landed) | `worldPulse/tradeWar.js` (:81, :500-599) | BUILT — scoring is TRUTH end-to-end (survey: zero belief imports) |
| tradeSalience: per-commodity 0..1 value-of-tie feeding the hostility dampener | `worldPulse/tradeSalience.js` | BUILT — trade-as-peace, one honest read awaiting its second sign |
| Embargo entries (three organic): conscience embargo (EMBARGO_FLOOR 0.15, auto-exit), weaponized-dependency collapse rule, merchant lever (±0.05, mean-reverting) | `institutionTolerance.js:52-61,112-119`; `relationshipRulesAdversarial.js:535-627`; `settlementStrategy.js:193-201` | BUILT — organic, hysteresis-guarded; **no typed grievance record names WHY** |
| Merchant agency today: MERCHANT_OBJECTIVE seat bias, commerce blocs damp deploy/lift sue_for_peace, faction interest domains ['wealth','trade_connectivity','debt'], institution-founding contests | `scoringObjective.js:71-114`, `settlementPolitics.js:595-617`, `factionCompetition.js:32,661-729`, `factionArchetypes.js:63` | BUILT — biased choosers and intra-town contests; **no faction holds assets, owns a route, or acts across settlements** |
| Commons voice ladder [CORRECTED 2026-08-02 (fp-audit) — omitted at drafting; TR-6's riot counterforce consumes it]: petition → gathering → riot-band escalation (RUNG_KIND :155), deterministic from existing legitimacy/corruption/unrest reads; **binding COHESION LAW in its header: a CONSUMER + REFRAMER — no new effect vocabulary, no new writer; consequences route EXCLUSIVELY through existing writers (legitimacy + stressors)** | `worldPulse/commonsVoiceKernel.js` (virtual flag `commonsVoiceEnabled`) | BUILT, DARK — censused BUILT/DARK by DESIGN_FP_POPULATIONS.md as well; the crowd may TRIGGER, never move goods |
| realmPressure01: designed for three consumers (war motive, trade-agreement propensity, expansion); ONLY the war path consumes it | consumer `warReasons.js:696-698,747` → `demographicsWar.js:172,295-312`; design DESIGN_DEMOGRAPHIC_ENGINE.md:373-377 | BUILT, half-wired — **"buy the grain before you bleed for it" has no code path. TR-5 lands it.** |
| perceivedScarcityOf: exists; sole consumer is the war-motive path | `demographicsWar.js:206` (consumer :302) | BUILT — the peace-side read this program generalizes via SP-2 |
| Generosity estate + trade overture: relief/refusal/credit_default/purchase/refuge/trade_overture receipts, warmth-carrying overture news, EV + reactions | `worldPulse/generosityKernel.js`, `generosityNews.js` (tradeOvertureNews :173), `spatial/generosityEV.js`, `generosityReactions.js`; ledger `spatialLedgers.tradeOverture` (census row subsystemRowsWaves.js:172 — [CORRECTED 2026-08-02 (fp-audit)]: the prior :379 citation was the routeNetwork row; the survey's pairing was routeNetwork:379 + tradeOverture:172 and the volume split it the wrong way) | BUILT — the famine_relief mirror's evidence lane already exists |
| The plan lane: band-crossing draw, ONE persistent plan per settlement, proposed→underway→completed/failed/abandoned, startup cost, duration, named failures, cooldown, receipt | `worldPulse/demographicsPlans.js` (header contract) | BUILT — TR-7 reuses the GRAMMAR only (the file's own fence forbids generalizing the writer) |
| Belief machinery: per-observer beliefMap, distance-priced news, rumor network, credibility ladder | `worldPulse/beliefMap.js` + wave-A spatial | BUILT (SPINE: SP-2 extends with the BELIEVED SCARCITY subject family) |
| Posture/appetite: merchantAppetite (per-origin, outcome-learned, reversal-live) | `spatialLedgers.merchantAppetite` | BUILT — SP-4a generalizes it; this program CONSUMES `postureOf`/`riskToleranceOf` |
| Moral substrate: moral drift referenced from pulseKernel.js + disposition.js; moralInstitutionPressure.js, moralMartialLean.js present | grep-verified references; exact drift module path **VERIFY-AT-BUILD** | PRESENT — TR-6's moral pricing reads it, never rebuilds it |
| Measurement estate: 9 trade/economy certification rows (routeLifecycleEnabled alone carries 7 invariants); realmSelfSufficiency additive v5 yearly field, bounds-pinned; economy-family aliveness floors + diversity gates + prosperity motion | `certification/subsystemRows*.js` (:268,:320,:398,:136,:247,:347,:444,:163,:157), `behavioralContract.js:150-191`, `behavioral-observation.mjs:855,911` | BUILT — **detects a DEAD economy, not a MONOTONOUS one**; no endings vocabulary, no dedicated receipt section, prose-only trend envelope, tickScanBudget blind to every trade lane, route_* absent from WHAT_PHRASES |

**Verified ABSENT — NEW WORK homed in a wave; never build on these as if they
existed:** any peacetime trade agreement artifact (zero engine hits for
tradeAgreement/trade_pact; demographicsRates.js:271-277 is the tree's own admission)
· a casus-commercii taxonomy (war's 13↔13 has no commercial sibling) · believed
price/scarcity reads in the commerce core (nine modules, zero belief imports) ·
actor books at faction grain (no house holds anything) · the trade endings
vocabulary + envelopes + receipt section · WHAT_PHRASES rows for the five route_*
kinds · the realmPressure trade-agreement consumer · the standing food-export
quantity · trade_exclusivity/market_access/toll_exemption terms · tickScanBudget
coverage of trade lanes.

**FORBIDDEN (ruled, not merely absent):** conserved coin (T2) · numeric prices
(T1) · per-NPC micro-agent traders (Law One; the house is the smallest merchant
actor) · any N-party pact object (SP-3 is pairwise; war law I holds here) · a
second granary writer (T3/T7) · a merged market estimate (T8).

---

## §3 THE FLAG FAMILY + THE THREE SEAM RULINGS

Nine waves, eight flags (TR-9 is measurement, flagless). All absent from
DEFAULT_SIMULATION_RULES; lit only in full_simulation at the owner-signed soak, in
build order:

| Flag | Gates | Wave |
|---|---|---|
| `casusCommerciiEnabled` | the commercial reasons ledger + taxonomy + its walkers | TR-1 |
| `merchantHousesEnabled` | houses (books, appetite, credibility, acts), factor casting reads | TR-2 |
| `believedMarketsEnabled` | SP-2 believed-scarcity consumption: destination choice, house motives | TR-3 |
| `foodCaravansEnabled` | grain on the physical pipeline; treaty streams ride caravans (slice 2) | TR-4 |
| `tradePactsEnabled` | the commercial term family, peacetime formation triggers, the realmPressure consumer | TR-5 |
| `corneringEnabled` | corner positions, the price-band corner term, the monopoly dwell detector [CORRECTED 2026-08-02 (fp-audit)], moral pricing | TR-6 |
| `venturesEnabled` | the venture lane (plan-grammar instances at house grain) | TR-7 |
| `factorErrandsEnabled` | commercial errands via SP-1; pact transport switches to factors | TR-8 |
| — (no flag) | tradeConvergence contract, envelopes, receipt section, WHAT_PHRASES, scan budgets | TR-9 |

**THE FLAG-DEPENDENCY RULING [CORRECTED 2026-08-02 (fp-audit) — the prior table
was written from build order, not from the waves' own scopes; TR-9's walker
enforces THIS table, so an omitted dependency certifies a config whose principal
mechanisms cannot run]:** independent dark switches, ORDERED lighting (the
WR precedent verbatim). Lit-preconditions, derived from each wave's scope:
TR-2 ⇒ TR-1; TR-3 ⇒ SP-2 landed + TR-1;
TR-4 ⇒ `commodityFlowEnabled` + `demographicsEnabled` (grain reads harvest/
K_food/storageMonths — wave-P machinery) — the collapse-ending arm additionally
requires `routeLifecycleEnabled` (the J decay ladder provides the mechanics;
declared FALSE today, simulationRules.js:449-462): dark J ⇒ `collapse` is
UNMINTABLE and TR-9 records its envelope as an HONEST PERMANENT ZERO (the
whole-world-soak.mjs:632 precedent), never a tuning failure;
TR-5 ⇒ SP-3 landed + TR-1 (+ TR-4 for
grain_provision's physical arm; dark-TR-4 grain_provision falls back to the
conserved rate-stream arithmetic treatyTransfer already runs — the ONE named
degraded read); TR-6 ⇒ TR-2 + TR-3 + TR-4 + `commonsVoiceEnabled` (the riot
counterforce consumes the BUILT/DARK commons ladder, §2 — a config in which a
MANDATORY counterforce is structurally dark is invalid, so no degraded four-of-
five arm exists or is needed; POP-2's `commonsArcEnabled` is NOT required — the
riot rung is commonsVoiceKernel's own); TR-7 ⇒ TR-2 + TR-3 (the venture is
CHOSEN on believed bands) + `commodityFlowEnabled` (the legs are M6a/M8
dispatches) — the `new_route` venture kind additionally requires
`routeLifecycleEnabled`: dark J ⇒ new_route SUPPRESSES to the named degraded
kind set {far_market, joint_venture}; TR-8 ⇒ SP-1 landed + TR-5 + TR-7 (slice
1's venture-supercargo errand kind suppresses when TR-7 is dark) + WR-7b's hold
writer landed (slice 2's capture path). The walker asserts KIND-AVAILABILITY
under each precondition, not merely flag order; a flag lit out of order is an
invalid config the TR-9 certification walker reds.

**SEAM RULING ONE — THE PACT SEAM (J-WR-1's commercial sibling, binding)
[CORRECTED 2026-08-02 (fp-audit) — aligned to the chair's R1/R2/R3 rulings]:**
the pact program does not fork the peace engine — it extends its CATALOG and
replaces its TRANSPORT, never its MATH. `peaceTerms.js` remains the terms
AUTHORITY (one writer FAMILY: per R2 all new commercial capability lands in lazy
leaf siblings consuming its exports; peaceTerms itself gains only net-zero seam
lines); the commercial term family (TR-5) joins TERM_CATALOG exactly as
sovereignty_transfer does in WR-10, with catalog membership + spelling CANONICAL
IN GRAMMAR §4 (R3); formation is AMENDMENT-SHAPED per R1 (one instrument per
pair — a peacetime proposal amends the pair's standing instrument, minting it
when absent; TR-5 elaborates) and runs SP-3's two-sided
drafting through `negotiationPictures.js` (built by WR-7 — consumed, never
duplicated). Transport: with `factorErrandsEnabled` DARK, a pact crossing resolves
through the abstract bounded-rounds path; LIT (TR-8), the crossing mints a
commercial errand and the same evaluators run at parlay on each party's own
picture. One evaluator, two transports. CROSS-PROGRAM NOTE (report-worthy, not
vetoable here): WR-10's bundle names trade rights (exclusivity/market access/toll
exemption) as composable components; those terms DO NOT EXIST (survey-verified) and
land in TR-5 — until TR-5 lands, WR-10's bundle composes streams/stores/allyship/
settlements only. Neither program forks the other's writer.

**SEAM RULING TWO — THE GRANARY SEAM (TR-4's architecture) [CORRECTED 2026-08-02
(fp-audit) — re-derived against foodStockpile.js's real arithmetic; the prior
draft replaced a per-tick import term that DOES NOT EXIST, resolved to rewriting
the sacred generation stash, and its suppression rule would have silently
deleted three BUILT bypass channels]:** there is NO standing per-tick import
term (T7): import coverage is NETTED into the generation-baseline
`baseDeficitPct` stash (foodStockpile.js:288), and FOOD_IMPORT_RATES reaches the
tick lane only through the blockade arm's `importDependency` read (:314-324).
When `foodCaravansEnabled` is LIT, TR-4 lands a NEW lit-only ARRIVALS TERM (new
work, carrying its own pins — never presented as reuse): physical grain units
delivered by caravan convert to storage-months by ONE authored constant
(GRAIN_UNITS_PER_MONTH) credited through
`generosityUpdates.applyFoodDeltasToUpdates` — the one DELTA applicator for this
lane (T3's corrected truth; NOT "the only writer of food-months" — five write
sites exist and the source-scan pin fences a sixth) — while an
equal-and-opposite lit-only OFFSET nets `baseDeficitPct`'s import share to zero,
computed FROM the stash it neutralizes. The generation stash is NEVER rewritten
(GENERATION IS SACRED, tradeFlow.js:13-18). The blockade arm goes physical when
lit — a cut road starves by absence of wagons — but its three BUILT bypass
counterforces are PRESERVED as physical-arm terms (`_bypassShare`
teleport/airshipBesieged :314-317, `_underwaysShare` underways trickle :320): a
teleport circle still runs a physical blockade; each carries its own
preservation pin (TR-4). Dark ⇒ byte-identical rate arithmetic. The T7 walker
asserts exactly ONE of {netted rate share, physical arrivals} live per
settlement per tick, in BOTH flag states. Treaty grain streams (tribute,
grain_provision) ride the same seam in slice 2: dispatched as caravans when lit,
conserved arithmetic when dark.

**SEAM RULING THREE — THE TWO SCARCITIES (T1/T8 made structural) [CORRECTED
2026-08-02 (fp-audit) — "no module reads both" was topologically unbuildable:
the corner NEEDS a composer holding a believed motive and a truth gate, and the
prior co-import pin would have redded it by construction]:** truth-side
scarcity is a pure derivation from stocks + foodLedger (feeds physics: production,
spoil-free warehouse ceilings, the corner's physical gate); believed scarcity is an
SP-2 subject family instance (feeds every DECISION: dispatch destination, house
acts, pact triggers, corner motives). The invariant is NO MERGING, not
no-co-reading: no code path averages or arithmetically combines a truth band
with a belief band. The read topology is three-module — a truth-side scarcity
derivation, a belief-side read, and per consumer an explicitly WHITELISTED thin
composer that reads both and averages neither. The whitelist is enumerated HERE
and only here, so the guard-the-guard control keeps its teeth: (1) the CORNER
COMPOSER (TR-6: belief supplies the motive, truth supplies the gate — two
inputs, two separate outputs, no combining expression); (2) the DISPATCH
COMPOSER (TR-3's dispatchEV rewiring: believed dearness is the belief side; the
need premium is a TRUTH-side physical-need read, dispatchEV.js:12-31 — and the
line between "need" and "scarcity" is drawn AT THE READ: `needPremium` reads
storageMonths/need state, NEVER a scarcity band, so need cannot smuggle
truth-side scarcity across the fence). Every OTHER module imports exactly one
side (import-pinned per side); truth reaches belief only through arrivals,
rumor, and plants — the existing machinery, at news speed, through the infoMode
gate.

---

## §4 CANONICAL MODEL — new state, and it is deliberately small

Everything below is conditionally materialized (drop-when-empty, zero eager bytes,
absent ⇒ byte-identical) with exactly ONE writer module.

```
worldState.spatialLedgers.commercialReasons   — TR-1, writer commercialReasons.js
  { "<from>><to>": [ { type, magnitude01, receipt, atTick } ] }
  // directed per-pair, state-derived, decay-inherent, zero-RNG —
  // the warReasons discipline verbatim; the walker enforces
  // totality + bijection over the 8 severance↔partnership pairs.

worldState.spatialLedgers.houses              — TR-2, writer houseLedger.js
  { [factionId]: {
      books: { holdings: band, credit: band,          // BANDS (T2) — never coin
               interests: [ { kind: route|market|stock|venture,
                              ref, sinceTick } ] },   // stock interests point at
                                                      // REAL commodityStocks refs
      appetite,                                        // SP-4a instance (house grain)
      credibility,                                     // SP-5 instance
      updatedTick } }
  // The house IS an existing faction (merchant/guild archetype) gaining books.
  // Factors are NEVER stored — cast per act by read-wiring (§TR-2). Cap:
  // MAX_HOUSES_PER_SETTLEMENT (band, default 2) — the K4 scope-bound idiom.

worldState.spatialLedgers.ventures            — TR-7, writer ventureLedger.js
  [ { id, houseId, kind, stakeBand, legs/shipmentRefs,
      departedTick, expectedTick, state } ]           // proposed | underway |
                                                      // completed | failed | abandoned
  // plan-lane GRAMMAR at house grain; one active venture per house.

Pacts             — NO new ledger: the existing treaties artifact (SP-3 law).
Believed scarcity — NO new ledger: beliefMap subject family (SP-2).
Factor errands    — NO new ledger: SP-1 spatialLedgers.errands, purpose commercial.
Corner positions  — NO new ledger: house books stock interests over real M6a stocks.
Grain flows       — NO new ledger: M6a commodityStocks/supplyShipments + granary.
```

**SP-5 closure declaration [CORRECTED 2026-08-02 (fp-audit) — the spine's
closed-family law admits no silent adjacents; POPULATIONS and INFORMATION declare
their non-members, and this volume now does the same]:** `books.holdings` and
`books.credit` are WEALTH bands, deliberately NOT SP-5 confidence stocks — the
SP-5 confidence family stays closed at four, and only the house's `credibility`
is an SP-5 instance here. Note the name collision: `books.credit` (the house's
standing with lenders — a wealth band) is DISTINCT from SP-5's "the seat's
domestic credit" (a confidence stock); the two never share a read, and any
future disambiguating rename lands on the wealth side. Declared so the audit
never reads the books as a family violation (the POPULATIONS departureMemory
idiom).

**What is deliberately NOT modeled:** no market object, no order book, no price
float, no per-NPC inventory, no house treasury in coin, no expenditure totals for
ventures (derived from shipment records — the I2 law), no second food writer, no
N-party fair or bourse object (the fair is a place factors travel TO, not a state
object), no merchant class outside faction grain.

---

## §5 THE WAVES (dependency order; each: one commit — TR-4 and TR-8 two slices, one
## commit each — focused gates per slice, full gate at wave end, ledger row; every
## wave DARK per §3)

**THE TELLABLE REGISTER (SPINE §1.11 — the surveys' IMPOSSIBLE/PARTIAL stories,
each now a NAMED pin in a wave below):** T-1 the wrong-market tragedy (TR-3) ·
T-2 the famine speculator (TR-6) · T-3 the corner and its breaking (TR-6) ·
T-4 the house that keeps its road (TR-2) · T-5 "buy the grain before you bleed
for it" (TR-5) · T-6 the blockade that actually starves (TR-4) · T-7 the pact kept
nine years and broken in the ninth (TR-1/TR-5) · T-8 the factor who rode with one
price in her head (TR-8) · T-9 the tribute taken on the road (TR-4) · T-10 the
ruin of the house (TR-7) · T-11 the silent road estate speaks (TR-9).

### TR-1 — THE CASUS COMMERCII (flag `casusCommerciiEnabled`)
*Historical archetype: the Hanse's grievance rolls — every embargo of Novgorod
carried a written reason.*
- **Scope:** a typed commercial-grievance/partnership ledger paralleling war's
  reasons layer: `SEVERANCE_REASON_TYPES ↔ PARTNERSHIP_REASON_TYPES`,
  walker-enforced totality + bijection (the warReasons discipline: state-derived,
  decay-inherent, zero-RNG, directed per-pair). Eight pairs (names vetoable,
  J-TR-2; structure not):
  `contract_default↔contract_honored` (compliance-stack evidence) ·
  `toll_extortion↔toll_relief` (the entrepôt toll band × route dependence — same
  read, two signs) · `market_exclusion↔market_opened` (NO_TRADE/access state) ·
  `cornering↔provision` (corner receipts vs delivery tallies) ·
  `famine_profiteering↔famine_relief` (TR-6 receipts vs the EXISTING generosity
  relief/refusal lane) · `dependency_fear↔dependency_comfort` (tradeSalience high
  + hostile drift vs salience high + warm drift — the opportunism↔hopelessness
  idiom: one honest read, two signs) · `contraband_injury↔honest_gates` (the
  criminal-rumor carrier's BELIEVED smuggling at their gate) ·
  `route_predation↔route_wardenship` (leg loss rates policed vs tolerated).
- **Force/counterforce:** every severance reason's mirror scores off the SAME
  evidence (SPINE §1.2's same-evidence discipline [CORRECTED 2026-08-02
  (fp-audit): the prior "amendment-2" token resolved to no amendment — the
  ladder is lettered A..S]) — the dependency that frightens is the dependency
  that binds; the toll that gouges is the toll that, relieved, warms. No entry is
  a ratchet: magnitudes decay as the producing state decays (amendment B
  suppression [CORRECTED 2026-08-02 (fp-audit): was "§1b-B", a dangling token —
  §1b has no item B; the binding law is DESIGN_REALM_DIRECTIVES.md:184, §1d map]:
  a casus contradicted by a live read returns 0 with a receipt naming the read).
- **Belief posture:** contraband_injury and famine_profiteering score off the
  OBSERVER'S belief (the criminal rumor, the believed gouge arriving at news
  speed) — a court can embargo an innocent gate on a planted rumor (the INFO
  coupling's tragedy, consumed here, written there).
- **Consumers:** embargo entries gain their typed reason (today's three organic
  paths mint receipts naming the casus); tradeWar's contest and escalation read
  severance magnitude as pressure (through its existing intent-deposit — never a
  new front, WR-0c item 3's law); pact formation (TR-5) reads the partnership
  side; the relationship rule matrix's trade transitions gain reason evidence.
  War coupling: a severance casus at extreme magnitude is EVIDENCE for war's
  existing taxonomy through tradeWar's deposit — this ledger never mints a war
  casus itself (J-TR-2).
- **Casting:** none — this wave is ledger + reads (persons arrive with TR-2).
- **Receipts (house voice):** "Aldenmoor shut its market to Thornwall wool and
  called it prudence" · "Nine years the grain compact held; the ninth year broke
  it."
- **Pins (negative hardest):** a healthy partnership mints no severance entry
  (reachability's negative arm on generated corpora); bijection walker green
  without exemptions; the amendment-B suppression receipt [CORRECTED 2026-08-02
  (fp-audit): was "§1b-B"] (a famine_profiteering entry
  against a house whose stocks were physically empty scores 0, receipt naming the
  stock read); decay-to-zero when the producing state heals; dormancy golden;
  T-7 TELLABLE: one fixture walks contract_honored accruing for nine 52-week
  years, then contract_default minting on the breach, Herald sentence verbatim.
- **Bands:** per-type magnitude caps, decay half-lives, the extreme-magnitude
  threshold that tradeWar may read.
- **Clock:** fast = per-tick accrual/decay; slow = the multi-year honored-contract
  record (T10 named).
- **Posture (declared empty, with the reason — silence is a decision, not an
  omission) [CORRECTED 2026-08-02 (fp-audit): the seven other flagged waves carry
  Posture; this gap was silent]:** this wave is a state-derived, zero-RNG ledger
  with NO decision surface — nothing here chooses, so nothing here consumes
  `postureOf`. Posture enters at this ledger's CONSUMERS (embargo entries,
  tradeWar's escalation deposit, TR-5's proposal appetite), each of which
  carries its own Posture line.
- **Couplings:** TRADE×WAR (escalation evidence), TRADE×INFO (believed-injury
  entries) — reads/receipts/counterforces walked in DESIGN_FP_COUPLINGS.md.
- **Endings wired:** `severance` — the formal cut, minted WITH its casus named.
- **Herald contract:** severance/partnership band-crossings are Herald-worthy with
  full address chains; registered with the pacing governor — the significance
  CLASS is drawn from the SPINE's SP-6 narration-kit significance family, assigned
  by magnitude band [CORRECTED 2026-08-02 (fp-audit) per the R5 ruling: volumes
  ASSIGN classes from the one spine family; no volume mints its own significance
  scale].
- **Lifecycle line:** commercialReasons persists — JSON-round-trip pinned; regen
  re-derives from state (it is state-derived — the ONE ledger here that rebuilds);
  undo/import round-trip; a settlement's death drops its pairs.
- **Dossier round-trip (crown):** open the town page → the relations panel renders
  each neighbour's commercial line in band words with the newest casus receipt
  ("Trade with Aldenmoor: severed — they shut their market in the spring of '43").
  Projection selector named at build; free surfaces see the public casus only
  (covert-sourced entries ride includeCovert).

### TR-2 — THE HOUSE (flag `merchantHousesEnabled`)
*Historical archetype: the Fugger, who financed emperors and were a family, a firm,
and a faction at once.*
- **Scope:** the merchant actor at FACTION grain (Law One: no micro-agents). An
  existing faction with a merchant/guild archetype (factionArchetypes.js:63) and a
  live commercial institution gains BOOKS in the houses ledger (§4): banded
  holdings/credit + typed interests. One writer, `houseLedger.js`. House ACTS are
  a closed verb set — {sponsor_caravan, take_route_interest, extend_credit,
  corner_attempt (TR-6), venture_stake (TR-7), petition_pact (TR-5),
  relief_grant (the generosity lane at house grain)} — chosen THRESHOLD-style
  (T4: books + appetite + believed bands colour; they never select a victim) and
  executed by depositing into EXISTING machinery: dispatch warrants, the credit
  lever, the plan grammar, SP-3 triggers, generosity EV. The house steers physics;
  it never owns a physics lane.
- **Formation, the ruin latch, and the rename rule [CORRECTED 2026-08-02
  (fp-audit) — the wave specified books but never WHEN the writer creates an
  entry, whether a ruined house whose predicate still holds re-opens next tick,
  or what a DM rename does to persisted, non-re-derivable books; an implementer
  would have had to invent the rule that decides whether T5's reversal is real]:**
  FORMATION — the writer CREATES an entry when the eligibility predicate holds
  (merchant/guild archetype via `factionArchetype()`, never hand-rolled — §1c —
  AND a live commercial institution) and the settlement is under
  MAX_HOUSES_PER_SETTLEMENT; among eligible factions selection is DETERMINISTIC:
  rank by institution seniority, factionId codepoint tie-break. THE RUIN LATCH —
  ruin closes the entry AND starts a ruin cooldown (band, seasons-grade) before
  the faction is re-eligible: no undead house re-opening next tick on a
  still-true predicate; re-entry after the cooldown is a NEW entry with fresh
  books and a receipt naming the lineage ("the Verren name trades again").
  ELIGIBILITY LOSS — a faction that stops matching (a DM rename breaking the
  archetype regex — the §1c rename-sensitivity; institution loss) sends its
  entry DORMANT-WITH-BOOKS (books frozen, no acts, receipt minted) — never
  orphaned, never silently deleted; eligibility restored wakes the SAME entry;
  faction dissolution closes it through the one writer. This formation rule is
  also the BUILDER for "entry" wherever this program names entry as a
  counterforce (TR-6's monopoly arm, TR-9's envelope definitions).
- **Force/counterforce:** growth (successful interests raise holdings bands) ⇔
  competition (a profitable route's dear-band belief summons rival houses — same
  evidence), credibility gravity (SP-5 falls fast on defaults/gouges), and RUIN
  (books collapse ⇒ the house entry closes, the faction survives, factors return
  to the roster — T5's reversal at actor grain). No wealth ratchet: holdings decay
  toward the settlement's own prosperity band absent live interests.
- **Belief posture:** every house motive reads BELIEVED bands (TR-3) — a house can
  be wrong, and its books pay for it.
- **Casting (named-actor rule):** the FACTOR is cast per act by read-wiring —
  deterministically the house faction's highest-ranked member scored by existing
  planes (temperament via W0/H3, goals, mercantile facets; codepoint tie-break),
  never stored, never new NPC state. Rivalries between factors of competing houses
  read the existing rivalry plane. Never-kill and never-resolve-fates hold: a
  ruined factor disperses to the roster with the grievance as facet material.
- **Receipts:** "House Verren took an interest in the river road" · "House Verren
  is broken; its factors scattered to the quays."
- **Pins (negative hardest):** the no-hidden-governor import pin on houseLedger.js
  + the act chooser (T4 — cannot name a victim; guard-the-guard positive control
  at a legitimate truth reader); no-micro-agent scan (no per-NPC trade state
  anywhere in the diff — a source scan, structural-prevention style); ruin
  reachable from the top holdings band on a real fixture (reversal pin); the cap
  (MAX_HOUSES_PER_SETTLEMENT) binds; JSON-alias round-trip (house members ARE
  npcs[]); writer/reader spelling pin boots the real writer; the rename
  round-trip pin [CORRECTED 2026-08-02 (fp-audit)]: rename the house faction,
  JSON-round-trip the world, assert the books survive DORMANT or the entry
  closes with a receipt — never orphaned persisted state; formation determinism
  pinned (two eligible factions, one slot under the cap — the codepoint
  tie-break decides, same-seed identical); the ruin latch pinned (a ruined
  house's still-eligible faction does NOT re-open inside the cooldown — the
  no-undead-house negative); dormancy golden;
  T-4 TELLABLE: a house whose route interest is threatened by a demotion event
  petitions/patrols (act receipts) — "the house that keeps its road" on one
  fixture.
- **Bands:** holdings/credit band ladders, act thresholds per verb, appetite learn
  rates (SP-4a instance), credibility moves (SP-5 instance), the house cap, the
  ruin-cooldown latch band [CORRECTED 2026-08-02 (fp-audit)].
- **Clock:** fast = weekly acts; slow = the generational house arc (books bands
  move on season-grade dwell, T10).
- **Posture:** every act consumes `riskToleranceOf(house)` (SP-4); out-of-posture
  acts (the cautious house's corner attempt) are PRICED and receipted news.
- **Couplings:** TRADE×INTERIOR (house vs seat — the house's credit to a strained
  seat is the king-who-paid arc's commercial end; walked in COUPLINGS) ·
  TRADE×FAITH (tithe: a band of house fortune flows to the temple — [CORRECTED
  2026-08-02 (fp-audit), the ownership circle broken: FAITH's WF-2a/WF-7 said the
  stream executors "land in FP-TRADE's machinery" while this volume said FAITH
  owns the read — two mechanisms owned by nobody. Ruled per the correction pass:
  FAITH owns the tithe AND feast/pilgrim stream executors END TO END — its own
  writers, its own receipts; TRADE builds NO stream-physics API for external
  consumers (no TR wave ever specced one — audit-verified); the TRADE side is a
  READ SURFACE only — house books/fortune bands read by FAITH's executor.
  Owning-wave reconciliation lands in COUPLINGS CPL-7/CPL-12).
- **Endings wired:** `fortune` and `ruin` at house grain (envelopes in TR-9).
- **Herald contract:** house rise/fall band-crossings and act receipts in the
  house voice; pacing-registered.
- **Lifecycle line:** houses persist — JSON-round-trip, regen preserves books
  (books are event-accrued, NOT re-derivable — the J-WR-3 disclosed-exception
  idiom, second instance, J-TR-3), undo/import round-trip, faction dissolution
  closes the house entry through the one writer.
- **Dossier round-trip (crown):** town page → factions panel: the house entry
  renders books as band words, interests by name, credibility, and the cast
  factor's name with whereabouts ("House Verren — prosperous; the river road, the
  salt trade; Factor Maren Verren, abroad at Threeways"). DM-only: covert
  interests ride includeCovert.

**TR-2b — THE COVERT LEDGER (the syndicate variant) [CHAIR AMENDMENT 2026-08-02
under full owner delegation — vetoable; a RECORDED DECISION + SHAPE, not a
drafted wave: the full spec (all requirements, pins, bands) is drafted when the
owner sequences it, as its own audited slice behind its own flag
`syndicateHousesEnabled`, after TR-2]:** the criminal syndicate is A HOUSE, not
a new actor class — SP-4a's closure holds; it binds to the house appetite
class. Shape, all riding built machinery: a house at the existing `criminal`
faction type (factionCatalog.js:32) carries PUBLIC books (the front — a
legitimate interest) plus COVERT interests (contraband stock/route kinds —
TR-2's existing includeCovert seam, widened); its factors travel declared
`commercial`, true `covert` (the Q amendment's declared/true split, SP-1);
direction of compromised NPCs rides the CORRUPTION WEB with the syndicate-house
admitted as a patron — the ONE substrate widening this variant needs (today
only courts mint covert assets; same caps, same leash material, same paid
eyes); counterforces are the BUILT exposure stack (IN-3's sweep,
corruption_exposed's blowback triple, conscience-gated seizures, TR-6's moral
drift, the assize) — nothing new opposes it, which is what makes it
design-cheap. INFO inherits (the syndicate as brokerage customer, no new
surface); the POP direction is DECLARED EMPTY in v1 (no protection-racket lane
without its own ruling and its own counterforce). Law One holds absolutely: the
syndicate is faction-grain, operatives cast by read-wiring, no crime-boss
micro-agent, no named-cast death, ever. Queue row CR-5 records the ruling.

**THE UNIVERSALITY CLAUSE [CHAIR RULING 2026-08-02, from the owner's question
"isn't every faction effectively a house, since everything runs on an economy?"
— vetoable]:** every faction has economic CAPACITY, and it is DERIVED — read
through its institutions (interest domains, institution status, backing),
never stored. NO faction carries BOOKS until it exercises commercial agency
through TR-2's eligibility predicate: books are EARNED STATE, not a birthright.
Universal stored books would (1) reopen SP-4a's closed actor-class set, (2)
multiply the banded-decaying-stock class the runaway lesson marks most
dangerous by the faction count, and (3) double-count the settlement's own
economy through per-faction wallets — whose band moves when the harvest fails
is J-WR-11's defect at estate scale. The actor family generalizes at the
JOINTS WHERE STORIES DIFFER: the seat's books are a derived read (INT-1), the
temple's wealth is believer-side (WF-7), the syndicate's books are covert
(TR-2b); a faction class whose economic story becomes genuinely distinct earns
its instance THERE, with its own twelve, never a default wallet.

### TR-3 — BELIEVED MARKETS (flag `believedMarketsEnabled`)
*Historical archetype: the Antwerp price letters — merchants sailed on last
month's prices and found this month's.*
- **Scope:** SP-2's BELIEVED SCARCITY subject family consumed. Per-observer,
  per-(market, good-class) banded beliefs ("grain is dear in the east, they say")
  riding the beliefMap's existing decay/update/forgetting laws. Writers: arrivals
  (a returning caravan writes the origin's true band home — the letters-home
  idiom), distance-priced rumor, INFO's plants (the LURE consumes this surface;
  written THERE). Consumers rewired here: dispatchEV gains WHERE — destination
  choice among candidate markets scored by believed dearness × need × danger
  (today belief gates only GO/NO-GO — survey-verified); house motives (TR-2);
  pact triggers (TR-5); corner motives (TR-6). tradeWar's truth-scored contest is
  DECLARED OUT of this wave (T9 fence): severance casus feed it instead — a
  disagreement with that ruling is a report, not an edit.
- **Force/counterforce (off the same evidence):** the dear-band belief that
  dispatches YOUR caravan dispatches EVERY believer's caravan — the crowd is the
  correction; arrivals write the glut home. Belief chases truth at news speed and
  overshoots at crowd speed. No band is a ratchet: the correction machinery is
  the existing belief update, not new code.
- **Belief posture (Law One):** bands only, never numbers; the engine models the
  buyer's conviction, not the market's truth; truth-side scarcity never leaks
  past the infoMode gate (Seam Three's import pins).
- **Casting:** the arriving caravan's receipt may name the sponsoring house's
  factor as the letter's voice (read-wired, TR-2).
- **Receipts:** "Grain is dear in Aldenmoor, they say — and dearer for the
  saying" · "The caravans came for the famine and found the harvest."
- **Pins (negative hardest):** dark ⇒ the omniscient dispatch path byte-identical
  (dormancy golden); the K3 structural set on every consumer module (import pin +
  token scan + guard-the-guard with the positive control at the truth-side
  scarcity derivation); the no-merge pin [CORRECTED 2026-08-02 (fp-audit) — the
  prior co-import token scan would have redded Seam Three's own whitelisted
  composers by construction]: a token scan for ARITHMETIC COMBINATION of
  truth-band and belief-band values (averaging, summing, blending — any single
  expression mixing the two sides), plus the per-side import pin with Seam
  Three's two whitelisted thin composers (the corner composer, the dispatch
  composer) enumerated as the ONLY co-importing modules; guard-the-guard seeds a
  deliberate band-average and asserts the scan reds; staleness reachable (a
  belief band ≥ two bands from truth on a real fixture, receipted); the calm
  convergence property (with free news flow, believed tracks true within one band
  — a soak observation, not a leak); T-1 TELLABLE pinned: a caravan dispatched on
  a stale dear band arrives post-correction into a glut, the arrival receipt
  names both bands ("came for the famine, found the harvest").
- **Bands:** belief update weights per writer class (arrival ≫ rumor ≫ plant),
  decay half-life toward ignorance, the dispatch destination weight, staleness
  bands.
- **Clock:** fast = rumor updates weekly; slow = conviction (dwelled beliefs decay
  on a seasonal half-life, T10).
- **Posture:** destination risk appetite consumes SP-4 (the cautious origin
  discounts far dear markets).
- **Couplings:** TRADE×INFO (the LURE: planted dearness baits real caravans —
  INFO writes, TRADE pays; the bank broken by a believed rumor is the COUPLINGS
  walk) · TRADE×POPULATIONS (believed conditions and believed scarcity share the
  gold-rush evidence grammar — divergence declared there).
- **Endings wired:** feeds `fortune`/`ruin` (the wrong market is how honest houses
  are ruined) — no ending minted here.
- **Herald contract:** wrong-market arrivals and band-crossing scarcity news;
  pacing-registered (scarcity chatter is exactly what the governor exists to
  meter).
- **Lifecycle line:** NO new persisted state — beliefs ride beliefMap's existing
  lifecycle (serialize/regen/undo already pinned there); receipts only.
- **Dossier round-trip (crown):** town page → the market line renders the LOCAL
  truth band and the town's believed picture of its neighbours in band words
  ("Grain: fair here; dear in Aldenmoor, they say") — the "they say" is
  structural honesty, not flavor. DM toggle shows truth beside belief
  (includeGroundTruth).

### TR-4 — THE GRAIN ROAD (flag `foodCaravansEnabled`; two slices, one commit each)
*Historical archetype: the Roman annona — the state's grain physically sailed, and
Rome starved when it didn't.*
- **Slice 1 — grain rides the pipeline [CORRECTED 2026-08-02 (fp-audit) — the
  prior draft replaced a per-tick import term that does not exist, and its
  suppression rule would have silently deleted three BUILT bypass channels].**
  Grain becomes an M6a good end-to-end: producer surpluses derive from the SAME
  harvest/foodLedger truth the rate arithmetic reads today (one source, two
  denominations — the derivation is the pin); integer grain units on caravans
  (MAX_SHIP discipline), warehouse ceilings, taps, banditry,
  seizure-conserves-to-seizer — all existing physics, grain now in the balance.
  Delivery lands through THE GRANARY SEAM (§3 Seam Two, re-derived): the NEW
  lit-only arrivals term credits units → storage-months via ONE authored
  constant through `generosityUpdates.applyFoodDeltasToUpdates` — the one DELTA
  applicator for this lane (T3; NOT "the only writer of food-months": five write
  sites exist, and this slice lands the source-scan pin fencing a sixth) — while
  an equal-and-opposite lit-only offset nets `baseDeficitPct`'s import share to
  zero; the generation stash is never rewritten. Interdiction becomes physical:
  a cut road starves by absence of wagons; the blockade arm's three BUILT bypass
  counterforces (teleport circle, impaired airship, the D6 underways trickle)
  are PRESERVED as physical-arm terms under this wave — a teleport circle still
  runs a physical blockade — with their own preservation pin (below).
- **Slice 2 — treaty streams ride caravans.** tribute/grain_provision dispatch as
  real caravans on real routes, interceptable. Compliance credits ARRIVAL; a
  receipted robbery converts the undelivered balance into a claim against the
  ROBBER while the debtor's dispatch-proof stands (J-TR-6, vetoable) — and what
  the creditor BELIEVES about the robbery is the creditor's picture (K4
  discipline; a court that never hears of the robbery believes default).
- **Force/counterforce:** the blockade starves (force — T-6 TELLABLE: a sieged
  town's storageMonths falls to the physical trickle, receipted week by week) ⇔
  the smugglers' road (M7's existing deep-shortage spill runs grain), the
  lean-year clause (a grain_provision seller below its own reserve floor SUSPENDS
  with a receipt — the treatyTransfer reserve-floor precedent extended;
  suspension feeds contract_default OR force-majeure per the buyer's belief), and
  the skeleton floor (nothing here may starve a settlement past the demographic
  floor wave P guarantees — grain physics inherits P4's law).
- **Belief posture:** physical food ignores belief entirely (only dispatch
  decisions read belief — a town cannot be starved by rumor alone; the negative
  pin below). Law One: no food price — need is the storageMonths band.
- **Casting:** grain caravans may carry a named supercargo only via TR-8 errands;
  none cast here.
- **Receipts:** "Fed by the river grain from Aldenmoor — two caravans a month" ·
  "No wagon has come up the river road in a season; the granaries speak of it" ·
  "The tribute was sent, and taken on the road" (T-9 TELLABLE).
- **Pins (negative hardest):** dormancy golden (dark ⇒ rate arithmetic
  byte-identical); THE CALM-EQUIVALENCE PIN — for an unshocked settlement with
  open routes, delivered months/season lands within ONE authored band of the old
  importChannel rate (the disclosed lit-path shift is bounded and stated; food
  goldens move only under the shift discipline, cause quoted); the T7
  exactly-one-import-ARM walker green in BOTH flag states [CORRECTED 2026-08-02
  (fp-audit) — restated per T7 against the real arithmetic: exactly one of
  {netted rate share, physical arrivals} live per settlement per tick]; the
  BYPASS-PRESERVATION pin [CORRECTED 2026-08-02 (fp-audit)]: under lit TR-4, a
  besieged settlement with a teleport circle / impaired airship / underways
  access still receives its bypass share as physical arrivals — three arms, each
  executed (retiring any of them would be a disclosed behaviour shift, and is
  NOT taken); conservation: the
  five-term M6a balance holds with grain rows (extend assertGoodsConservation —
  the kernel's refuse-to-persist covers grain for free, J-TR-8); grain-months
  conservation at the applicator (units in == months credited × constant);
  belief-cannot-starve (a settlement with physically arriving grain keeps its
  months regardless of any believed band — negative pin); T-6 TELLABLE promoted
  to a pin [CORRECTED 2026-08-02 (fp-audit) — the register promised a NAMED pin
  and the force clause is not a fixture]: one sieged/interdicted fixture — the
  road is cut, wagons stop, storageMonths falls week by week to the physical
  trickle with a receipt per week, the fall bounded by wave P's demographic
  floor (the skeleton-floor counterforce proven on the same fixture); its
  NEGATIVE: an open-route town under the same siege flag holds its months; the
  robbery-claim round-trip (slice 2; T-9 TELLABLE promoted to this pin
  [CORRECTED 2026-08-02 (fp-audit)]): robbed tribute mints the claim,
  compliance does NOT mark
  default when the creditor's picture includes the robbery, DOES when it does not
  (both arms).
- **Bands:** GRAIN_UNITS_PER_MONTH constant (owner-signed — it recalibrates food),
  surplus-to-export derivation bands, calm-equivalence tolerance band, lean-year
  reserve floor, robbery-claim decay.
- **Clock:** fast = weekly wagons; slow = the seasonal storageMonths verdict and
  the annual pact installment (52-week years; SP-7 walker asserts).
- **Posture:** export appetite consumes the SELLER settlement's posture (an
  insular posture holds grain home at fair — priced, receipted, never forbidden).
- **Couplings:** TRADE×WAR (siege interdiction already feeds the SIEGE verdict —
  grain deepens it; supply-web warfare gains a grain edge, walked in COUPLINGS) ·
  TRADE×POPULATIONS (storageMonths → K_food → migration pressure: the famine that
  moves people is now a cut road — the causal chain walks backward link by link,
  SPINE §1.7).
- **Endings wired:** `collapse` (a market/entrepôt dying when its grain artery
  reroutes — the Bruges silting; the J decay ladder provides the mechanics, this
  wave the food stakes).
- **Herald contract:** arrival droughts, granary band-crossings, robbed tribute —
  headline-class with full address chains; pacing-registered.
- **Lifecycle line [CORRECTED 2026-08-02 (fp-audit) — the prior line asserted
  "existing serialize/regen/undo pins" as fact; the audit found NONE (seven
  commodityStocks test files, zero persistence round-trips)]:** NO new ledger —
  grain rides commodityStocks/supplyShipments, but the delegation is
  VERIFY-AT-BUILD with the fallback named (R9): slice 1 LANDS the missing
  round-trip pin itself (serialize → regen → undo → import over
  commodityStocks/supplyShipments with grain rows) rather than inheriting one —
  the wave that physicalises the flagship good does not discharge lifecycle on
  an unverified pin. Contrast TR-5, whose treaties delegation is REAL and stays
  as written (worldStateLedger.persistence.test.js:437-494 — the implementer can
  tell the two cases apart by that citation). The suppressed-term flag state is
  derived, never stored.
- **Dossier round-trip (crown):** town page → the food security line names its
  physical sources ("Fed by the river grain from Aldenmoor; the pass grain from
  Kel — the pass closes in winter") — every named source is a live route read; a
  DM cutting that road on the map sees the line change within the season.

### TR-5 — THE PACT LANE (flag `tradePactsEnabled`)
*Historical archetype: the Hanseatic kontor charter — access, tolls, and grain,
written, sworn, and renewed or broken.*
- **Scope [CORRECTED 2026-08-02 (fp-audit) — the chair's R1/R2/R3 rulings folded
  in]:** THE COMMERCIAL TERM FAMILY joins TERM_CATALOG (Seam One; peaceTerms
  stays the terms AUTHORITY — catalog membership + spelling are CANONICAL IN
  GRAMMAR §4 per R3: one list, one spelling, one closure contract, this volume
  points and never re-derives; and per R2 this wave lands its EXECUTORS in LAZY
  LEAF SIBLINGS consuming peaceTerms' exports — peaceTerms itself, at 794/800
  lines, gains only net-zero seam lines): `market_access` (opens
  NO_TRADE/exclusion — the
  market_opened casus's instrument), `toll_exemption` (a named-pair discount on
  the entrepôt read — the derivation stays a derivation, the exemption is a
  transfer of the band, T2), `trade_exclusivity` (primacy pledged: the
  trade_dependency channel points here while honored — tradeWar's contest gains a
  treaty-shaped incumbent), `grain_provision` (the standing food-export quantity —
  the demographicsRates.js:271-277 debt PAID: grain-months per 52-week year,
  delivered physically when TR-4 is lit, conserved arithmetic when dark),
  `route_wardenship` (a patrol obligation priced against leg loss rates).
  FORMATION is SP-3's peacetime lane: typed trigger = the trade-demand crossing —
  composed of believed scarcity ≥ dear on a salient good (TR-3 × tradeSalience),
  realmPressure01's hunger arm (THE DEAD CONSUMER LANDS: "buy the grain before
  you bleed for it" — DESIGN_DEMOGRAPHIC_ENGINE.md:373-377's named intent, wired
  at last), and posture (SP-4). FORMATION IS AMENDMENT-SHAPED (the chair's R1
  ruling [CORRECTED 2026-08-02 (fp-audit)]): the treaty ledger's
  one-instrument-per-pair key is LAW, not a bug — a peacetime proposal AMENDS
  the pair's standing instrument, minting it when absent; reciprocal/two-sided
  commercial exchange rides DIRECTIONAL TERMS inside the ONE instrument (a term
  gains a beneficiary field — the §13 stacking machinery hosts bilateral
  direction; GRAMMAR §4 owns that model change, this wave points at it and
  consumes it, never re-derives); two same-family terms on one treaty compose
  under the stacking rules or the second is REFUSED with a receipt. Proposal →
  two-sided drafting via
  negotiationPictures (each side appraises on its OWN picture) → compliance on
  the existing stack → breach feeds `contract_default` (TR-1) and war's existing
  treaty_default where a war-grade treaty is the instrument.
- **Force/counterforce:** the pact that feeds ⇔ the pact that binds — an honored
  grain_provision lowers realm hunger PHYSICALLY, which lowers the war-motive
  weight through the same realmPressure read warReasons already consumes (no
  "pact suppresses war" rule anywhere — the physics does it; E3 honored); the
  exclusivity that enriches the partner mints dependency_fear in third parties
  off the same channel read (the pact's own evidence arms its rivals).
- **Belief posture:** proposals, appraisals, and acceptance run on each party's
  believed bands (K3 — nobody is ever current; a pact can be signed for grain the
  seller no longer has, and the world discovers the mismatch as the next
  grievance — the K3 absurdity law's commercial twin, pinned).
- **Casting:** dark-transport formation is abstract; TR-8 gives proposals a
  traveling factor. The signing receipt names the seats, not invented persons.
- **Receipts:** "A grain compact: Aldenmoor's wagons for Thornwall's peace of
  mind" · "They bought the grain before they bled for it" · "The compact was
  kept these nine years, and the ninth year broke it."
- **Pins (negative hardest):** below-threshold pressure mints NO proposal (pact
  spam's negative — reachability both arms on generated corpora); T-5 TELLABLE
  executed end-to-end: one fixture, hunger-pressured realm, lit lane ⇒ pact forms,
  delivery lands, realmPressure falls, the demographic war-motive weight falls —
  five subsystems, one causal chain, receipts at every link (the composition-pin
  idiom); the same fixture DARK ⇒ the war path unchanged byte-identical;
  lean-year suspension → buyer-belief fork (default vs misfortune, both arms);
  the walker: every commercial term names duration in 52-week years with the
  INTERVAL_WEEKS identity pin; bijection stays green (no filler mirror — the
  family extends the CATALOG, not the casus taxonomy); dormancy golden.
- **Bands:** trigger crossing thresholds, term budgets/durations, exclusivity
  strain rates, wardenship price vs loss-rate curve, suspension floor.
- **Clock:** fast = weekly compliance reads; slow = annual installments and the
  multi-year honored record (T10).
- **Posture:** proposal appetite and acceptance both consume postureOf (an
  insular seat refuses good pacts — priced in the missed-relief receipts).
- **Couplings:** TRADE×GRAMMAR (this wave IS SP-3's trade consumer — formation
  triggers and the term family are declared there, elaborated here; [CORRECTED
  2026-08-02 (fp-audit)] this wave SUPPLIES the commercial family that GR-2's
  `trade_demand` trigger drafts — until TR-5 lands, trade_demand runs GR-2's
  declared dark arm, and the trigger's reachability pin scopes to TR-5's commit;
  GRAMMAR §4's `labor_compact` names a TRADE production arm as its consumer —
  DEFERRED here, a decision not an omission [CORRECTED 2026-08-02 (fp-audit)]:
  no TR wave consumes labor_compact this program, and the term's reachability
  obligation stays with GR-3's degraded arm until a TRADE wave declares the
  consumer) ·
  TRADE×WAR (pact-vs-march: the crossing and the war motive read the SAME hunger —
  walked in COUPLINGS) · TRADE×INTERIOR (a pact signed against the commerce
  bloc's wishes feeds the H overturn lane exactly as a peace does).
- **Endings wired:** `severance` (the pact's formal death carries its casus and
  its Herald sentence).
- **Herald contract:** formation, renewal, suspension, breach — headline-class,
  both courts addressed (the WR-0c both-courts precedent); pacing-registered.
- **Lifecycle line:** pacts ride the treaties artifact's existing lifecycle
  (serialize/regen/undo/import pinned THERE; the 52-week marker per WR-0c item 4);
  this wave adds no persisted shape beyond the new term rows.
- **Dossier round-trip (crown):** town page → the treaties panel lists commercial
  pacts beside war treaties: term, partner, years standing, compliance band
  ("Grain compact with Aldenmoor — honored, third year of ten"). The breach
  renders the same row red-worded with the casus.

### TR-6 — THE CORNER + THE FAMINE SPECULATOR (flag `corneringEnabled`)
*Historical archetype: the forestaller of the medieval assize laws — and Joseph
Leiter, whose wheat corner broke him in a season.*
- **Scope (the program's crown drama — full depth by owner instruction):** a house
  (TR-2) reading a believed scarcity TRAJECTORY toward dear/desperate (TR-3) may
  act `corner_attempt`: sponsored caravans BUY at believed-soft markets (real M6a
  purchases into house-interest warehouse stocks — physical, conserved, ceiling-
  capped), accumulating a stock interest. THE CORNER GATE: the house's held share
  of the settlement's REACHABLE supply of that good — denominator from an
  INDEPENDENT supply census (truth-side: local stocks + inbound route capacity;
  the self-referential-pin hazard is the reason this sentence exists) — crosses
  the corner band WHILE truth-side scarcity is ≥ dear. Effect: the local truth
  band gains a CORNER TERM (held-share forces the gate's effective band up one)
  and the house's sale receipts price at the forced band. THE MORAL PRICING: when
  the forced band coincides with need (storageMonths low, famine season, siege),
  every sale mints a profiteering receipt; `famine_profiteering` (TR-1) accrues
  against the house's settlement in every buyer's ledger; moral drift moves
  (existing substrate — module path VERIFY-AT-BUILD); SP-5 credibility falls with
  every observer, SCALED BY THE OBSERVER'S ALIGNMENT AXIS (the WR-8
  world-judges idiom: the lawful-good neighbour damns what the pragmatic port
  shrugs at); the house's own settlement suffers the conscience arm (the
  institutionTolerance idiom pointed inward: abhorrence pressure against the
  house's institutions while the gouge runs).
- **THE COUNTERFORCES (each named, each scoring off the corner's OWN evidence,
  each pinned ABLE TO WIN — amendment A's discipline):**
  1. **The summoned caravans:** the corner's forced dear band IS a believed-dear
     broadcast (TR-3 propagation) — every other dispatcher reads opportunity; the
     corner is self-advertising and arrivals break the band. The corner's price
     signal and its death warrant are ONE read.
  2. **The smugglers' road:** deep-shortage links spill to M7's warrant (existing
     machinery); hidden paths (J4's bottom rung) cannot be cornered — the house
     holds the gate, never the woods.
  3. **The commons [CORRECTED 2026-08-02 (fp-audit) — the substrate is BUILT and
     censused (§2 commonsVoiceKernel.js, `commonsVoiceEnabled`, now a TR-6
     lit-precondition per §3), its header law binds (a CONSUMER + REFRAMER: no
     new effect vocabulary, no new writer), POPULATIONS builds no seizure arm,
     and the built seizure physics (commodityFlow.js:605-620) seizes a CARAVAN'S
     CARRIED LOAD at a gate mid-route — no stationary-stock arm exists]:**
     famine_profiteering at magnitude feeds the BUILT commons ladder: petition →
     gathering → riot rung. The riot TRIGGERS — it never moves goods (the
     kernel's own cohesion law is preserved: it invents no writer): TR-6's own
     house-side machinery READS the riot rung against the house's granary and
     executes THE WAREHOUSE SEIZURE — NEW conserved machinery extending the same
     conservation discipline, NOT existing physics, and NEW WORK carrying its
     own pins (R7): one writer (a lazy leaf in commodityFlow's writer family),
     its own five-term-balance pin, units → months converted ONLY at the one
     applicator inheriting TR-4's GRAIN_UNITS_PER_MONTH. The factor flees to the
     roster (never engine-killed — named-cast law).
  4. **The seat:** the seat's books bleed legitimacy while bread is dear
     (INTERIOR coupling). Two priced arms, chosen by posture + books: the FORCED
     SALE edict (stock moves to the granary at a band price THROUGH THE SAME new
     warehouse-seizure writer as counterforce 3 [CORRECTED 2026-08-02 (fp-audit)
     — new conserved machinery presented honestly, not "existing seizure
     physics"; same balance pin, same one-applicator conversion]; the house
     mints a grievance against the seat — tyranny costs too) or the EMERGENCY
     PURCHASE
     (the generosity lane's purchase receipts, at the forced band — the seat
     pays the gouge and the commons remembers who made it pay).
  5. **The house's own carry:** warehouse ceilings cap the position; credit band
     strain accrues per season held (banded carry — no invented spoilage term);
     an exit is only ever a SALE, and a corner sold into its own broken band is
     the ruin arm.
- **THE MONOPOLY ARM [CORRECTED 2026-08-02 (fp-audit) — `monopoly` was an
  owner-settled ending in the CLOSED vocabulary that NO wave minted: a
  closed-vocabulary key whose envelope is structurally zero forever. Per the R5
  ruling it gains its producer, homed here — the corner's durable cousin, sharing
  the corner's independent census and its entry counterforce]:** one supplier
  holding a market past a dwell band — the house's held share of the
  settlement's REACHABLE supply of a good (the SAME independent-census
  denominator as the corner gate) stays above the monopoly share band past
  MONOPOLY_DWELL (seasons-denominated — this wave's Clock bullet) WITHOUT the
  corner's forced band:
  the quiet toll, not the gouge. Effect: `dependency_fear` (TR-1) accrues in
  dependants' ledgers off the same channel read; sale receipts name the sole
  supplier. Counterforces (each able to win): ENTRY — the dear-band evidence
  that sustains the monopoly summons a rival house, and entry now has a BUILDER
  (TR-2's formation rule); the smugglers' road (hidden paths cannot be
  monopolized — the house holds the gate, never the woods); the pact lane
  (`market_access` opens what the monopolist holds shut). Ending: `monopoly`
  mints on the dwell crossing — envelope RARE, policed in TR-9 (J-TR-11).
- **Belief posture:** the MOTIVE is belief (the speculator can be wrong — a
  cornered good whose famine never comes is carry-cost ruin); the GATE is truth
  (no phantom corners — you hold wagons or you hold nothing); the two never
  merge (Seam Three — the corner composer is Seam Three's whitelisted thin
  composer: it reads both sides and averages neither [CORRECTED 2026-08-02
  (fp-audit)]).
- **Casting:** the corner's factor is the cast face (TR-2 read-wiring); the
  rival factor who breaks it, the commons voice who names it — all read from
  existing planes.
- **Receipts:** "House Verren holds the grain, and the bread knows it" (T-2/T-3
  TELLABLE) · "They sold dear to the starving, and the town remembers" · "The
  corner broke: the smugglers' road fed Threeways when the warehouse would not."
- **Pins (negative hardest):** NO PHANTOM CORNER (held share below band cannot
  move the price band — independent-census denominator, negative pin); corner at
  glut IMPOSSIBLE (the gate's truth-side conjunct — held share cannot force dear
  out of glut; reachability of the FALSE branch proven); amendment-B suppression
  [CORRECTED 2026-08-02 (fp-audit): was "§1b-B", a dangling token]
  (famine_profiteering against an empty warehouse scores 0, receipt naming the
  stock read — same pin as TR-1, run from this side); ALIGNMENT NEVER GATES
  (T6): a good-aligned house corners on one fixture and pays conscience +
  credibility + commons prices; an evil house corners on the same state and pays
  less morally, equally physically — both arms executed; EACH counterforce WINS
  on its own fixture (five fixtures: arrivals break it, smuggle undercuts it,
  the riot seizes it, the seat forces the sale, carry-cost ruins it — the riot
  fixture runs with `commonsVoiceEnabled` lit, a §3 precondition, so all five
  are executable [CORRECTED 2026-08-02 (fp-audit)]) — a corner
  machinery whose counterforces cannot win is decoration (the amendment-A pin);
  T-3 TELLABLE promoted to a pin [CORRECTED 2026-08-02 (fp-audit)]: the corner
  and its breaking IS this five-fixture set, each break receipted in the house
  voice; T-2 TELLABLE promoted to a pin [CORRECTED 2026-08-02 (fp-audit)]: the
  famine speculator on one fixture — the gouge runs at need, profiteering
  receipts accrue, moral pricing + commons memory land ("they sold dear to the
  starving, and the town remembers"); the WAREHOUSE-SEIZURE conservation pin
  [CORRECTED 2026-08-02 (fp-audit) — the seizure and the forced sale were two
  unpinned conservation holes in the program's strictest lane]: riot seizure and
  forced sale each hold the five-term balance (units house→granary, nothing
  minted or lost) and convert months only at the one applicator; NO PHANTOM
  MONOPOLY (share below band cannot mint — independent census, negative pin);
  the MONOPOLY ending reachable but rare (one fixture dwells past the band);
  ENTRY BREAKS THE MONOPOLY (a rival house forms on the same dear-band evidence
  via TR-2's formation rule and the share falls below band — the counterforce
  wins on its own fixture);
  the CORNERED ending reachable but rare (one fixture holds through the season —
  envelope policed in TR-9); appetite reversal after ruin (SP-4a); dormancy
  golden.
- **Bands:** corner share band, corner term magnitude (one band, capped — never
  two), carry strain per season, profiteering magnitude scale, observer-alignment
  consequence bands, forced-sale price band, riot seizure share, monopoly share
  band + MONOPOLY_DWELL [CORRECTED 2026-08-02 (fp-audit)].
- **Clock:** fast = weekly purchases and band moves; slow = the seasonal hold,
  the MONOPOLY_DWELL band (13-week-season units, INTERVAL_WEEKS-derived, SP-7
  asserted [CORRECTED 2026-08-02 (fp-audit)]), and
  the generational memory of the gouge (diaspora-grade — POPULATIONS' departure
  memory carries "the winter House Verren held the grain"; T10).
- **Posture:** corner_attempt consumes house appetite; for a cautious house it is
  out-of-posture — priced and receipted, never forbidden (T6).
- **Couplings:** TRADE×POPULATIONS (the commons ladder + famine migration — the
  gouged town that empties) · TRADE×FAITH (famine-as-wrath omen reads may name
  the speculator — FAITH owns the omen, this wave provides the receipt it
  points at) · TRADE×INTERIOR (seat-vs-house) · TRADE×INFO (a PLANTED famine
  rumor baiting a corner into carry-ruin is the LURE's commercial masterpiece —
  walked in COUPLINGS).
- **Endings wired:** `cornered` (held through the season — rare), `monopoly`
  (the dwell crossing — the durable cousin, minted HERE [CORRECTED 2026-08-02
  (fp-audit): previously an orphan of the closed vocabulary]), `ruin` (the
  break), `fortune` (the exit in time: sale triggered by believed inbound
  caravans — timing on belief, never omniscience).
- **Herald contract:** the corner's rise, the gouge, each counterforce's blow,
  the break — headline-class, the pacing governor's significance scaling is
  MANDATORY here (this arc can flood a season).
- **Lifecycle line:** corner positions are house-book stock interests over real
  M6a stocks — they serialize/regen/undo with the houses ledger and the
  commodity stocks; no separate corner object exists to leak.
- **Dossier round-trip (crown):** town page → the market line + the house entry
  together tell it: "Grain: desperate — House Verren holds the granaries" with
  the house entry's credibility band fallen and the profiteering receipt linked;
  after the break, the chronicle keeps it ("the winter of the Verren corner").

### TR-7 — VENTURES (flag `venturesEnabled`)
*Historical archetype: the joint-stock voyage — the Muscovy Company sailed on
subscribed shares and sank or paid twentyfold.*
- **Scope:** the receipted risk instrument through the plan lane's GRAMMAR (T9:
  demographicsPlans.js's writer is fenced; ventureLedger.js is a NEW writer
  implementing the same discipline — band-crossing trigger, ONE active venture
  per house, proposed→underway→completed|failed|abandoned, startup cost (books
  band down at departure), real duration (the voyage is real legs on real
  routes — M6a/M8 dispatches; travel physics, week floor), named failure
  conditions (interception, refusal, wrong-market arrival, route loss), cooldown,
  and a receipt naming why it was chosen. Venture kinds (closed): {far_market
  (a caravan/convoy to a distant believed-dear market), new_route (backing a J3
  charter — the docket's expedition-worth read gains a house sponsor),
  joint_venture (two houses split stake and take — band split; the unpaid share
  feeds contract_default at house grain)}.
- **Force/counterforce:** the stake is PHYSICALLY at risk (the venture's goods
  are on the road — banditry, interception, seizure are the existing physics);
  fortune ⇔ ruin through the same voyage; appetite learns from the outcome in
  BOTH directions (SP-4a reversal — no courage ratchet: a ruined house turns
  cautious on the receipts, a lucky one grows bold and overreaches).
- **Belief posture:** the venture is CHOSEN on believed bands (TR-3) and
  concluded by truth — the gap is the drama (Law One: the engine models the
  subscriber's conviction).
- **Casting:** the supercargo is the cast factor (TR-2 read); with TR-8 lit the
  factor RIDES (an SP-1 errand bound to the venture's legs — interceptable,
  ransomable through war's existing machinery).
- **Receipts:** "The Verren venture returned with fortune" · "The sea took the
  Verren fortune" (T-10 TELLABLE — the Bardi arc: one fixture rides a house from
  top-band fortune through a failed venture into ruin).
- **Pins (negative hardest):** stake genuinely at risk (the failed venture's
  books band falls — no phantom stakes); one-active-venture cap binds; the
  trigger is a band CROSSING, not drift (the plan lane's own anti-weather law,
  re-pinned here); joint-venture split honored and its default arm mints the
  casus (both arms); outcome-learned appetite reversal executed; T-10 TELLABLE
  promoted to a pin [CORRECTED 2026-08-02 (fp-audit) — it lived only in a
  receipt sentence]: the Bardi arc on ONE fixture — a house at top-band fortune
  stakes a venture, the venture fails, the books ride down into ruin (fortune →
  failed venture → ruin, receipts at each step); DM-KILL of the
  supercargo mid-voyage closes the errand `lost` and the venture `failed`
  through their own writers (lifecycle bug class); dormancy golden.
- **Bands:** trigger thresholds, stake bands by holdings, venture duration by
  route physics (no authored duration — the road prices it), cooldown, split
  bands.
- **Clock:** fast = the voyage's weekly legs; slow = the house's venture record
  (a generation of voyages is the books' biography; T10).
- **Posture:** venture_stake consumes house appetite; the overreach (staking
  above posture) is priced news. [CORRECTED 2026-08-02 (fp-audit) — INTERIOR
  INT-1 declares seatBooks a consumer surface for trade venture appetite and no
  TRADE wave reserved the seam; the reserved line lands here]: when
  `seatBooksEnabled` AND `venturesEnabled` are BOTH lit, venture appetite is
  additionally COLOURED by `booksOf(settlementId)` (INTERIOR's one evaluator — a
  strained seat's town backs fewer far ventures; colour only, never selection,
  T4); the venture receipt names seatBooks when consumed; until INT-1 lands the
  books term is ABSENT, not zero.
- **Couplings:** TRADE×WAR (a venture through a war zone reads the charter-danger
  belief — the frightened endpoint governs, existing law) · TRADE×INFO (a
  planted far-market lure baits a venture — the LURE again).
- **Endings wired:** `fortune`, `ruin` (the venture is their principal mint).
- **Herald contract:** departure, loss, and return are house-voice news;
  pacing-registered.
- **Lifecycle line:** `ventures` persists (§4) — JSON-round-trip, regen preserves
  in-flight ventures (event-accrued, not re-derivable), undo/import round-trip;
  shipment refs resolve or the venture closes `failed` with a receipt (no
  dangling refs).
- **Dossier round-trip (crown):** town page → house entry shows the live venture
  with state and expected return ("The Sunless Coast venture — underway, due by
  autumn"); the chronicle keeps concluded ventures as the house's story.

### TR-8 — THE TRAVELING FACTOR (flag `factorErrandsEnabled`; two slices)
*Historical archetype: the Medici branch factor — the firm's man abroad, carrying
prices in his head and the family's credit in his name.*
- **Slice 1 — commercial errands.** SP-1 consumed: purpose `commercial`, the
  factor cast per TR-2's read. Errand kinds (closed): pact proposal/renewal (the
  TR-5 transport switch — Seam One's lit arm: the crossing mints an errand; the
  abstract rounds path suppresses at the call site, dark byte-identical — the
  WR-7a suppression idiom verbatim), venture supercargo (TR-7 binding), fair
  circuit (terms-shopping: visiting N markets, carrying home believed bands as
  ARRIVAL-grade belief writes — the richest honest write in the belief economy).
  THE SNAPSHOT (K.2): believed market bands + the house's term sheet frozen at
  departure, mutating by rumor along the route, never refreshed from truth (K3
  structural set on the errand module). THE WEEK FLOOR (law M) binds — the
  transit kernel is WR-7a's; this program adds consumers, never a second kernel.
- **Slice 2 — the compromised factor + the prize.** DECLARED vs TRUE purpose
  rides the covert seam (the Q amendment generalized — a factor traveling for
  the house may truly travel for the corruption web's patron or a rival house:
  terms tilted, the TRUE stock book handed over — treachery transmits what
  loyalty cannot). INTERCEPTION: a factor is a rich prize (term sheets + market
  intelligence — interception weights band above plain travelers); a captured
  factor lands in WR-7b's foreignGuestHolds through ITS one writer (consumed,
  never forked); ransom rides the I2 person-subject claim; the ransomed factor
  returns carrying what captors let them believe (the plant-exposure idiom at
  commercial stakes).
- **Force/counterforce:** the factor's information advantage ⇔ its staleness (the
  longer the circuit, the wronger the head — same clock); the compromised
  factor ⇔ send-two corroboration (the K4 ladder catches divergent accounts of
  one fair).
- **Belief posture:** the factor IS a belief courier; everything it carries is
  banded conviction, never truth (except the traitor's stolen book — the one
  honest channel, and it is a betrayal; K.2/K3's paradox, inherited whole).
- **Casting:** all persons read-wired (TR-2); never-kill/never-resolve absolute;
  DM-KILL closes the errand `lost` through the one writer.
- **Receipts:** "Factor Maren rode for the fair with one price in her head, and
  found another at the gate" (T-8 TELLABLE) · "No word from the salt road; House
  Verren fears for its factor."
- **Pins (negative hardest):** the speed-floor walker extends to commercial
  errands (every movement site through the one kernel — totality); stale-arrival
  pin (T-8 TELLABLE, named here [CORRECTED 2026-08-02 (fp-audit)]: snapshot band
  ≠ gate band on arrival, receipted — the wrong-market tragedy
  at person grain); the suppression-at-call-site pin (lit ⇒ abstract rounds
  suppressed, dark ⇒ byte-identical — the WR-7a discipline); compromised-factor
  both arms (careful seat vets and catches; hurried seat takes the volunteer and
  bleeds); capture → hold → ransom → return round-trip on war's machinery
  (consumed, no fork — an import pin proves no second hold writer); JSON-alias
  round-trip (the factor IS a roster npc); dormancy golden.
- **Bands:** errand purpose weights, fair-circuit length cap, interception prize
  weights, snapshot mutation rate, vetting-quality derivation (reuse WR-7d's
  band).
- **Clock:** fast = weekly legs; slow = the circuit (a season's fair round) and
  the ransom arc (T10).
- **Posture:** dispatch of a factor into danger consumes house appetite + the
  route's believed danger (the M6c read at person grain).
- **Couplings:** TRADE×GRAMMAR (the factor is the envoy program's commercial
  sibling — cross-referenced, never duplicated; WR-7 owns the substrate) ·
  TRADE×INFO (the factor as plant carrier and plant target — walked in
  COUPLINGS).
- **Endings wired:** feeds `fortune`/`ruin`/`severance` (a lost factor sours a
  pact; a captured one prices it).
- **Herald contract:** departures, silences, captures, returns — the K.7
  inference receipts ("the court fears the worst") in the commercial voice;
  pacing-registered.
- **Lifecycle line:** errands ride SP-1's ledger lifecycle (pinned there); holds
  ride WR-7b's; the term sheet in transit rides the errand record; no new
  persisted state here.
- **Dossier round-trip (crown):** town page → the house entry's factor line shows
  whereabouts and errand state ("Factor Maren Verren — on the road to Threeways,
  expected by midsummer"); a silent overdue factor renders the fear ("overdue;
  no word since the spring").

### TR-9 — TRADE CONVERGENCE INSTRUMENTATION (no flag — measurement, envelopes,
certification; the program's acceptance harness)
*Historical archetype: the Domesday survey — the realm audited what it built.*
- **The tradeConvergence contract, contract-first** (the warConvergenceContract.js
  pattern, survey-named as directly reusable): `TRADE_ENDING_KEYS = {fortune,
  ruin, monopoly, collapse, severance, cornered}` — CLOSED, owner-settled — each
  with a share envelope; one ending carrying nearly all mass means the others are
  decoration (amendment L's criterion, commercialized). Definitions bind here:
  fortune/ruin = house-grain conclusions (TR-2/TR-7); monopoly = one supplier
  holding a market past a dwell band (independent-census share — the corner's
  durable cousin; envelope RARE, its counterforce is entry summoned by the same
  dear-band evidence, with TR-2's formation rule as the builder) — MINTED AT
  TR-6, whose Bands line owns the dwell + share bands [CORRECTED 2026-08-02
  (fp-audit): previously no wave minted it, so its envelope was structurally
  zero forever and the share check could not tell sequencing from decoration];
  collapse = a market/entrepôt estate dying (centrality +
  route-decay evidence) — an HONEST PERMANENT ZERO while `routeLifecycleEnabled`
  is dark, per §3 [CORRECTED 2026-08-02 (fp-audit)]; severance = the formal cut
  with casus; cornered = TR-6's
  seasonal hold (envelope RAREST).
- **The deciding-component histogram:** which of provision/circulation/sustenance
  moved realmSelfSufficiency each year (the data exists in receipts today and
  never reaches a field — survey-verified); plus the SELF-SUFFICIENCY TREND
  ENVELOPE EXECUTED (monotone improvement absent shocks — DESIGN_ROUTE_LIFECYCLE
  .md:113's prose becomes a whole-world-soak check beside the population and
  wall-time checks).
- **Health guards:** house Gini over holdings bands (no runaway house — the
  centralityGini precedent applied to TR-2); corner frequency + duration
  envelope; pact formation/breach mix; route endings mix over the five route_*
  kinds (chartered/promoted/demoted/abandoned/revived).
- **The v5 receipt section:** additive `tradeConvergence` envelope slot with
  honest-empty emission from day one (the whole-world-soak.mjs:632 precedent —
  zero histograms are sequencing evidence, not failures).
- **The Herald debt paid (T-11 TELLABLE):** WHAT_PHRASES + heraldRouting rows for
  the five route_* kinds AND every kind this program mints (the totality walkers
  make omission red); the 17-module route estate speaks at last, per
  DESIGN_ROUTE_LIFECYCLE.md's own §Herald plan.
- **The scan ratchet extended:** tickScanBudget lanes for flows.js, supplyKernel,
  commodityFlow, entrepotKernel + every new TR kernel (tickIndices consultation —
  the "cheap by prose" promise becomes an instrument; survey: every trade lane is
  invisible to the ratchet today).
- **Certification rows** for all eight TR flags (Growth-lane discipline: gated
  emission, bounds, dormancy invariants, documented non-obvious zeros).
- **Clock [CORRECTED 2026-08-02 (fp-audit) — the monopoly dwell, the corner
  envelope, and the trend window were denominated against nothing; SPINE §1.9
  requires INTERVAL_WEEKS denomination and the SP-7 walker asserts it]:** the
  monopoly dwell band and the corner frequency/duration envelope are
  denominated in 13-week seasons; the trend envelope and the deciding-component
  histogram run on 52-week years (the engine's own 4-4-5 grid); every envelope
  window is INTERVAL_WEEKS-derived and SP-7-asserted.
- **Declared empty, with reasons [CORRECTED 2026-08-02 (fp-audit) — five of the
  twelve requirements were silently absent; silence is a decision, not an
  omission (the COUPLINGS §4 idiom, applied intra-volume)]:** Force/counterforce
  — none: this wave builds no forces; its envelopes POLICE the forces built in
  TR-1..TR-8 (J-TR-11). Casting — none: the auditor casts nobody. Couplings —
  none new: this wave instruments every TR coupling; each coupling's CW-0
  registry row lands with its OWNING wave (§10). Posture — none: a flagless
  measurement wave has no decision surface and consumes no `postureOf`.
- **Pins:** every envelope carries a mutant negative control (the house
  discipline); non-vacuity gates (a verdict requires measured evidence — the
  warConvergence gate's shape); the certification walker reds out-of-order flag
  lighting (§3); T-11 TELLABLE promoted to a pin [CORRECTED 2026-08-02
  (fp-audit) — the register promised a NAMED pin]: a WHAT_PHRASES +
  heraldRouting TOTALITY assertion over the five route_* kinds
  (chartered/promoted/demoted/abandoned/revived) — the silent road estate
  speaks, and the walker reds omission.
- **Lifecycle line:** no persisted world state — envelopes, rows, receipt fields
  only.
- **Dossier round-trip:** none (nothing lands in a town page; this wave is the
  auditor). **This wave is the acceptance harness: the program is DONE when these
  envelopes hold on the owner-ordered soak, and not before.**

---

## §6 JUDGMENT BLOCKS (the drafting chair's rulings under delegation — vetoable
## here; an implementer NEVER re-rules these silently)

- **J-TR-1 (the pact seam):** the commercial term family extends TERM_CATALOG;
  formation rides SP-3; transport switches to factors at TR-8 via call-site
  suppression. VETO forks a commercial terms evaluator or a second treaty
  artifact.
- **J-TR-2 (two ledgers, one boundary):** commercialReasons is SEPARATE from
  warReasons; commerce reaches war ONLY through tradeWar's existing intent
  deposit reading severance magnitude. VETO merges the taxonomies or mints a
  commercial casus directly into the war ledger.
- **J-TR-3 (the house is a faction with books):** no new actor class; books are
  event-accrued persisted bands — the second disclosed exception to
  never-store-a-derivable (J-WR-3's idiom). VETO re-derives books from the
  chronicle per tick, or builds houses outside faction grain.
- **J-TR-4 (the granary seam semantics) [CORRECTED 2026-08-02 (fp-audit) —
  re-derived against foodStockpile.js; there is no standing per-tick import
  term to replace]:** lit ⇒ SUBSTITUTION inside the T7 fence — the lit-only
  arrivals term credits physical deliveries through the one delta applicator
  while an equal-and-opposite offset nets `baseDeficitPct`'s import share to
  zero; calm-equivalence pinned; never both arms live; the generation stash is
  never rewritten; the three blockade bypass channels are PRESERVED as
  physical-arm terms. VETO runs rate + physics additively (and accepts the
  double-count consciously — recorded as rejected here), or rewrites the
  generation stash.
- **J-TR-5 (the corner is books, not a ledger):** corner positions are house
  stock interests over real M6a stocks; no corner object. VETO a dedicated
  corner ledger.
- **J-TR-6 (robbed tribute becomes a claim):** slice-2 compliance credits
  arrival; a receipted robbery converts the balance into a claim against the
  robber, and the creditor's picture decides what it believes happened. VETO
  credits dispatch, or makes robbery a silent default.
- **J-TR-7 (moral pricing composition):** profiteering prices through moral
  drift + SP-5 credibility + observer-alignment scaling + the conscience arm —
  never a prohibition, never an alignment gate (T6). VETO adds a hard gate
  (and must reconcile with the SPINE's §1.10 pricing law).
- **J-TR-8 (grain in the balance):** grain extends assertGoodsConservation's
  five-term integer balance; the refuse-to-persist guard covers it; months
  convert only at the one delta applicator
  (`generosityUpdates.applyFoodDeltasToUpdates` — T3's lane truth [CORRECTED
  2026-08-02 (fp-audit): the applicator is now NAMED; the phrase "single
  granary applicator" previously resolved to no module anywhere in the tree]).
  VETO a parallel grain-conservation assertion.
- **J-TR-9 (factor casting read):** deterministic highest-ranked mercantile
  read with codepoint tie-break, cast per act, never stored. VETO stores a
  factor roster on the house.
- **J-TR-10 (no clamps — law L's commercial twin):** no corner timer, no forced
  break, no market holiday, no pact round limit; corners and standoffs end
  endogenously (counterforces + carry) or the soak envelopes catch the tuning
  failure. VETO adds a timer.
- **J-TR-11 (the endings envelopes police the gates):** cornered/monopoly
  envelopes are health metrics for TR-6's gates exactly as sack shares police
  R's — an envelope breach is a tuning failure, never a trigger for in-engine
  clamps. VETO wires envelopes back into engine behavior.
- **J-TR-12 (the venture lane is a sibling, not an extension):** ventureLedger.js
  implements the plan grammar fresh; demographicsPlans.js is untouched (its own
  header forbids generalization). VETO extends demographicsPlans to house grain.

---

## §7 THE TUNING SURFACE (owner-signed at the soak, per THE PROMISE; band FAMILIES
## keep the signature surface tractable per SPINE §5)

TR-1 magnitude caps + decay half-lives + extreme threshold · TR-2 holdings/credit
ladders + act thresholds + house cap + ruin-cooldown latch + SP-4a/SP-5 instance
rates · TR-3 belief
update weights (arrival ≫ rumor ≫ plant) + decay + destination weight + staleness
bands · TR-4 GRAIN_UNITS_PER_MONTH (owner-signed — recalibrates food) +
surplus-export bands + calm-equivalence tolerance + lean-year floor +
robbery-claim decay · TR-5
crossing thresholds + term budgets/durations + exclusivity strain + wardenship
curve + suspension floor · TR-6 corner share band + corner term cap + carry
strain + profiteering
scale + observer-alignment consequences + forced-sale band + riot seizure share +
monopoly share band + MONOPOLY_DWELL ·
TR-7 trigger + stake + cooldown + split bands · TR-8 purpose weights + circuit cap
+ prize weights + snapshot mutation + vetting · TR-9 envelope shapes (endings
shares, corner frequency/duration, house Gini ceiling, trend tolerance). Every one
banded, none a bare float on a surface, one tuning table per wave (the house
idiom). [CORRECTED 2026-08-02 (fp-audit): this table had drifted from the waves'
own Bands lines — robbery-claim decay (TR-4) and suspension floor (TR-5) were
named in §5 and missing here; ruin-cooldown (TR-2) and monopoly share/dwell
(TR-6) land with their waves' corrections. Significance CLASSES are not bands of
this volume: they are assignments from the SPINE's SP-6 significance family (the
R5 ruling) and are signed there.]

---

## §8 HERALD + LEGIBILITY CONTRACT (the sentences this program must be able to say,
## in the house voice, at the Bound-Book register floor; every one with id + full
## address chain + typed action + named settlements + recorded reason)

- "Grain is dear in Aldenmoor, they say — and dearer for the saying" (TR-3)
- "The caravans came for the famine and found the harvest" (TR-3)
- "They shut their market to us and called it prudence" (TR-1)
- "Nine years the grain compact held; the ninth year broke it" (TR-1/TR-5)
- "They bought the grain before they bled for it" (TR-5)
- "A grain compact: Aldenmoor's wagons for Thornwall's peace of mind" (TR-5)
- "No wagon has come up the river road in a season; the granaries speak of it" (TR-4)
- "The tribute was sent, and taken on the road" (TR-4)
- "House Verren holds the grain, and the bread knows it" (TR-6)
- "They sold dear to the starving, and the town remembers" (TR-6)
- "The corner broke: the smugglers' road fed Threeways when the warehouse would not" (TR-6)
- "The Verren venture returned with fortune" / "The sea took the Verren fortune" (TR-7)
- "Factor Maren rode for the fair with one price in her head, and found another at the gate" (TR-8)
- "No word from the salt road; House Verren fears for its factor" (TR-8)

Every news class this program mints registers with the pacing/significance
machinery (SPINE §1.12) — the corner arc and scarcity chatter are the two surfaces
most likely to flood a season, and the governor is the editor by law.

---

## §9 SEQUENCING

1. This program builds AFTER the spine infrastructure (SP-1..SP-7), GRAMMAR, and
   INFO, per SPINE §5 — TR-3 consumes SP-2, TR-5 consumes SP-3 +
   negotiationPictures (WR-7's), TR-8 consumes SP-1 + WR-7b's hold writer.
2. Build order: TR-1 → TR-2 → TR-3 → TR-4 → TR-5 → TR-6 → TR-7 → TR-8 → TR-9
   (TR-9's contract module may land contract-first any time after TR-1 — the
   war precedent — but its envelopes close the program).
3. Lighting order = build order, after `demographicsEnabled` and
   `commodityFlowEnabled` per §3's dependency ruling; no TR flag joins the
   standing lighting batch; all light at the owner-signed soak.
4. CROSS-PROGRAM COORDINATION (reported to the validation chair): WR-10's trade-
   rights bundle components degrade gracefully until TR-5 lands (§3 Seam One);
   FP-FAITH's tithe and omen couplings, FP-POPULATIONS' commons ladder and
   departure memory, FP-INFO's LURE and plant wiring are CONSUMED here where
   built there — every such pair is walked in DESIGN_FP_COUPLINGS.md, and a pair
   found unbuilt at TR build time degrades to its named fallback or STOPs.
5. THE OWNER-HELD BOUNDARY IS UNCHANGED: soak grid, 300y rerun, certification
   sweep, tuning pass, every push. These waves BUILD dark; nothing here lights a
   flag, runs a soak, or ratifies a band.

## §10 IMPLEMENTER PROTOCOL

DESIGN_WAR_RULINGS_ARCHITECTURE.md §10 binds here VERBATIM (worktree/branch
discipline, no add -A, no stash, gate-tail only, one wave one commit, dormancy
goldens before wiring, STOP-and-report on any conflict, CONFIRMED/PLAUSIBLE
labeling). Deltas for this program: TR-4 and TR-8 are two commits each (one per
slice); every new kind registers WHAT_PHRASES + heraldRouting before its first
mint lands in a commit; the T7 double-count walker lands IN TR-4 slice 1, not
after; and any fourth-instance discovery of a census overstatement in §2 follows
J-WR-13's standing STOP rule. [CORRECTED 2026-08-02 (fp-audit), per the R6
coupling-ownership ruling]: any TR wave landing a cross-layer read adds its CW-0
registry row (pairId, direction, read, receiptField, counterforce, flags,
owningVolume, owningWave, intendedDesk) in the SAME commit — the coupling's
owning wave is the TR wave whose Couplings bullet declares it, and the CW-0
walker asserts the row; a cross-layer read with no registry row reds.
