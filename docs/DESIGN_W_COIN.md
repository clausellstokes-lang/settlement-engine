# W-COIN-ARCH — the state treasury + taxation typed by government form

**STATUS: COMPLETE — all sections authored; both fan-out censuses landed and folded (the government/wealth/tribute estate census in APPENDIX A, the FMG economy recon in APPENDIX B). A successor picking this up cold needs nothing beyond this file; every claim carries its receipt inline.**

**Lane W-COIN-0 (Seat: Fable — architect), 2026-08-29. Design authorship under AMENDMENT A3 (ODQ §731.1): "Q-W8 GRANTED over the chair's recommendation — ruling f3cf639e (no-conserved-coin) is REVERSED by owner order." This volume is the architecture the implementation panel judges before any car dispatches. Every claim about the existing estate carries a file:line receipt against build tip `73f5dfc02` (read via the extract at `scratchpad/fmg-study/ours/`; docs cites are `git show ad2d35693:docs/DESIGN_FMG_WEAVE.md`). Labels: CONFIRMED = quoted from executed reads this session; PLAUSIBLE = reasoning only, with the settling experiment named.**

**The charter's discipline (A3, verbatim constraints):** architecture-first (this doc + skeptic mini-panel before implementation) · finite semantics (typed stocks and flows, closed vocabularies — grain's `storageMonths` idiom is the in-estate precedent) · virtual flag · raw-byte dormancy bar · lived worlds gain the ledger only at future ticks under the lit flag, declared · the reversal's scope is exactly what this document defines and the owner sees at its panel · engine-wave slot, pre-soak.

---

## §1 · The ruling being reversed — what f3cf639e protected, in its own words

CONFIRMED — the ruling's living record is the header of `src/domain/worldPulse/treatyTransfer.js:11-33`, which is itself the module that most recently had to *route around* the ruling:

> "There is NO treasury and NO conserved-coin primitive anywhere in the estate. The only `treasury` in src/domain is faction-scale flavour prose plus the factions' 0..100 `wealth` SCORE, which is an opinion about a faction, not a stock that can be moved without minting. generosityEV.js records the standing ruling verbatim: payment is 'a prosperity BAND-STEP debit ... (the sim's prosperity vocabulary — NO conserved-coin primitive, per the f3cf639e ruling X/Z)'." (`treatyTransfer.js:13-18`)

The ruling's implemented citations (CONFIRMED):

- `src/domain/spatial/generosityEV.js:869` — the E1d **purchase** instrument: "payment = a prosperity BAND-STEP debit on the buyer + a bounded non-zero-sum seller income nudge (the sim's prosperity vocabulary — NO conserved-coin primitive, per the f3cf639e ruling X/Z)". Grain conserves through `computeSackFoodTransfer`; **money does not exist** — a sale moves grain one way and *opinion* the other.
- `src/domain/spatial/generosityEV.js:871` — ruling Y (no autonomous relationship edges; the trade overture is a trust-nudge into the EXISTING evolution rule) and ruling Z (initiation routes through `authorityFor` — existing authority law, no new posture).
- `src/domain/worldPulse/generosityKernel.js:64-88` — E1d shipped "the f3cf639e rulings implemented exactly": purchase, trade_overture, rumor — all conserving grain, all expressing payment in the `PROSPERITY_TIERS` vocabulary.
- `docs/DESIGN_FMG_WEAVE.md` A2.2 Q-W8 — the chair's row: "this would REVERSE the recorded no-conserved-coin ruling (`treatyTransfer.js:13-17`, ruling f3cf639e — **grain is deliberately the only conserved stock**). REC: decline for launch" — the recommendation the owner overrode in A3.

**Why the ruling existed** (reconstructed from its implementations; CONFIRMED as to mechanism): it kept the estate to ONE conserved material stock with a proven conservation law, and let everything money-shaped stay *opinion* (bands and scores) so that no flow could ever mint value, no second bookkeeping truth could drift against prosperity, and no save grew a ledger that lifecycle paths (regen/undo/import) would have to conserve. The grain precedent shows the full cost of doing a conserved stock *right* — §3.2 below itemizes that machinery; the treasury owes every piece of it.

### 1.1 · The grain precedent — the law a conserved stock must satisfy here (CONFIRMED)

`economicState.foodSecurity.storageMonths` is the estate's one conserved, tick-advanced stock. Its machinery, each piece a requirement the treasury inherits:

| Law | Grain's implementation | Receipt |
|---|---|---|
| ONE pulse writer, registered | `advanceFoodStockpile` is the declared pulse writer for the whole `foodSecurity` family in the FROZEN_VS_LIVE manifest | `src/domain/fieldManifest.js:73-77` (`mode: 'live'`, `pulseWriter: 'src/domain/worldPulse/foodStockpile.js#advanceFoodStockpile'`) |
| Other movers emit DELTAS through ONE applicator, never become second writers | treatyTransfer "does NOT become a sixth [writer]: it emits DELTAS and hands them to generosityUpdates.applyFoodDeltasToUpdates, the existing single applicator" | `treatyTransfer.js:29-33`; applicator at `generosityUpdates.js:46-70` (clamps to capacity, rounds to the tenth-month) |
| Conservation by rounding direction | both legs FLOOR, never round — "rounding can only under-credit"; `gained × payeePop ≤ lost × payerPop`; sink-only (CAPTURE < 1, "the remainder spoils on the road") | `foodStockpile.js:514-537` (`computeSackFoodTransfer`), `treatyTransfer.js:57-60` |
| Capacity from infrastructure, derived not persisted | `storageCapacityMonths` mirrors the generator's granary tier table each call | `foodStockpile.js:185-195` |
| Reserve floor — a flow may impoverish, not annihilate | `RESERVE_MONTHS: 1.5` mirrors mobilization's untenable-war-footing threshold; "a payer at or under the floor delivers NOTHING, which is exactly the §12 default the compliance machinery is watching for" | `treatyTransfer.js:51-61,107-108` |
| Same-tick composition | `committedDebit`/`committedCredit` so a second draw sees the granary the first left behind — "the pair could jointly over-drain a payer" otherwise | `treatyTransfer.js:89-117`; used with live deltas at `peaceTerms.js:722-731` |
| Structural base vs effective value | `stockpile.baseDeficitPct`/`baseSurplusPct` stashed once "so relief never compounds into the next tick's input" | `foodStockpile.js:35-38,288-295` |
| Freshest-state read inside a tick | `freshestSettlement` — "reading the stale snapshot here would let a levy draw grain a siege already ate earlier in the same tick" | `treatyTransfer.js:139-156` |
| Changed-flag identity discipline | unchanged tick ⇒ same references; bookkeeping transitions count as change | `foodStockpile.js:436-462`, `generosityUpdates.js:47-60` |
| Pipeline home | the `@pulse-stage: settlement_clock` loop in the pulse kernel, per settlement, beside time advance | `pulseKernel.js:464-553` (call at `:521`) |

## §2 · The reversal's exact scope — what dies, what survives (the owner-facing table)

**DIES (by owner order, A3):**

1. **"No conserved-coin primitive anywhere in the estate"** (`treatyTransfer.js:13`). A second conserved stock — state coin — joins grain. This is the whole reversal; everything below bounds it.
2. **"Grain is deliberately the only conserved stock"** (WEAVE A2.2 Q-W8). Now there are exactly two, each with its own conservation law, unit, and single writer. Any third stock is a new owner decision.
3. **Costs-without-a-stock as the *only* expression of state expense.** Today war costs are pure comparative/pressure reads (§3.3). Under the lit flag, war acquires a literal coin bite (upkeep sink) beside the existing pressure reads — the reads stay, the stock makes them material.

**SURVIVES (explicitly not reversed — the panel should hold every line):**

1. **THE PROMISE / no retroactive coin on lived history.** No lived tick is re-narrated, no balance backfilled. The treasury OPENS EMPTY at the first lit tick with a receipted `treasury_opened` event (§7.2) — the ST-1 no-backfill law applied to coin: *stamping a balance the canon never recorded is fabricated history* (WEAVE A1.3, same doctrine).
2. **Ruling X/Z's band-step machinery for PRIVATE commerce.** The E1d purchase instrument, the seller income nudge, the prosperity ladder (`data/constants.js:92-100`) stay untouched and keep OWNING prosperity movement. The treasury is the **civic/state** purse; it does not re-denominate household or market exchange. (JUDGMENT — chose narrow civic scope over re-denominating E1d; vetoable, §12 Q3.)
3. **Ruling Y and Z verbatim** — no autonomous edges from money; anything the treasury initiates routes through existing authority law (`authorityFor`).
4. **Wealth/prosperity as OPINION scores.** They are inputs to the tax base (one direction) and are never derived from, reconciled to, or written by the treasury (§4.4 — the second-truth discipline).
5. **"Hegemony is A PATTERN, NEVER AN ENTITY"** (`hegemony.js:10-15`, frozen ruling): **no realm treasury object exists**. Realm-level money is a derived display aggregation over the derived sphere, zero persisted state (§4.5).
6. **Grain's own laws.** Treaty STREAM terms keep drawing grain exactly as today in W-COIN-1/2; any coin leg on tribute is a separate declared car (W-COIN-3, owner-rowed §12 Q4).
7. **The finite-semantics law** — every new field typed, every vocabulary closed, bands where a band serves, and (per the §711.6 unit law) every numeric field carries a DECLARED UNIT at its definition.

## §3 · The estate today — everything that currently approximates money (receipts)

### 3.1 · Taxation already exists as *narration*: `incomeSources` (CONFIRMED)

`generateEconomicState` (`src/generators/economy/economicState.js:27-885`) builds, at generation time, a persisted `incomeSources` array of `{source, percentage, desc}` rows normalized to 100% (`:519-536`, sorted codepoint-stable at `:844` because "this list is persisted in the settlement"). The sources are an authored, in-practice-closed set of literals keyed to institutions, route, and stress: Agricultural Rents (`:57,65`), Market Taxes / Magical Trade Revenue (`:78-98`), Guild Licensing / Guild Fees (`:100-113`), Port Duties / River Tolls (`:115-138`), Financial Services / Banking Fees (`:140-153`), Property Rents (`:155-163`), Court Fees & Fines (`:164-171`), Toll Revenue / Gate Tolls (`:173-186`), Military Levy / Military Extraction (`:188-202`), Church Tithes (& Rents) / Pilgrim Trade (`:215-237`), the three-tier magic economy (`:238-305`), resource streams (Grain Sales … Stone Quarrying, `:387-496`), custom-good lines (`goodName + ' Trade'`, `:497-518`), criminal capture (marked `isCriminal: true` — "flows to criminal actors, not the public treasury", `:342-349`), Subsistence Production fallback (`:351-357`).

**These are percentages of an unquantified total.** No stock, no level, no flow — a pie chart with no pie. This is simultaneously the treasury's greatest asset (the tax *structure* of every settlement is already generated, persisted, institution-grounded, and stress-aware) and the seam to respect (the labels are display prose, and custom-content rows are open-vocabulary).

### 3.2 · Prosperity: the opinion ladder and the band-step "payment" machinery (CONFIRMED)

- The canonical ladder: `PROSPERITY_TIERS = ['Subsistence','Struggling','Poor','Moderate','Comfortable','Prosperous','Wealthy']` + `prosperityRank` (`src/data/constants.js:92-100`).
- Minted at generation: `computeBaseProsperity` (route/tier/sliders/food, `src/generators/economy/prosperity.js:175-290`) → `deriveProsperityLabel` (`:121-172`).
- Moved at tick ONLY by the E1d payment applicator: `applyProsperityDeltasToUpdates` (`src/domain/worldPulse/generosityUpdates.js:121-150`) — band-step on the canonical ladder, "never a hand-typed band match", shape-preserving write-back.
- Sibling applicator: `applyLegitimacyDeltasToUpdates` (`:80-107`) — bounded integer deltas on `powerStructure.publicLegitimacy.score`, clamped [0,100]. **The treasury reuses this exact applicator for the extractive-taxation legitimacy price (§5.4) — machinery, not invention.**

### 3.3 · War costs today: bands, pressure, belief — never a stock (CONFIRMED)

- `src/domain/worldPulse/warCosts.js` is "WR-4's pure comparative-cost trajectory read … This leaf owns no state, performs no roll, and imports no writer" (`:1-13`). Closed vocabularies: `WAR_COST_BALANCE_BANDS` (`:25-31`), `WAR_COST_TRAJECTORIES` (`:34`), `WAR_HOME_FRONT_BANDS` `quiet|present|pressing|decisive` (`:40-45`), duration bands (`:48-52`). `readWarHomeFront` (`:307-511`) aggregates FIVE independently-optional components — roads, stores, hands, institutions, markets — each `{score01, band, stateRead}`; **`base = sum/length` over however many components exist (`:493-494`)**, duration amplifies but never supplies evidence (`:495-505`).
- `src/domain/worldPulse/warCoalitionExpenditure.js` — "WR-6's derived bill … stores no running total" (`:1-10`); five fixed-weight components summing to 1.0 (`COALITION_EXPENDITURE_TUNING`, `:19-26`); a `completeness` record says what the live episode could establish (`:217-224`); consumed as `pressure01` by WR-1 via `coalitionSunkCostPressureFor` (`:266-275`).
- Consumers of these reads (the seam W-COIN-2 feeds): `warTermination.js:605` (home-front into the termination read), `warPeaceDecision.js:253,292,413,427` (sunk-cost pressure into the peace decision), `peaceTerms.js:486` (expenditure into reimbursement terms), `warCoalitionSettlement.js:592`, wired in the kernel at `pulseKernel.js:1257`.
- The home-side per-tick pass (`warHomeCosts.js:1-27`) debits **population and exhaustion**, never money; deployment food drain is `STOCKPILE_TUNING.deploymentDrainPct: 12` on the granary (`foodStockpile.js:88-95`).

**How costs are expressed without a stock, in one sentence:** war "costs" are *changes in banded belief about relative position* plus *conserved drains on people and grain* — nothing is ever paid.

### 3.4 · Treaty streams, the material executor (CONFIRMED)

**Six** STREAM terms (tribute · reparations · restitution · resource_share at `peaceTermsCatalog.js:160-169`, plus `temple_restitution` `:245` and `settlement_provision` `:254` on identical physics) execute as real conserved GRAIN installments each tick: `peaceTerms.js:710-734` ("STREAMS EXECUTE A REAL, CONSERVED INSTALLMENT … see treatyTransfer.js for why grain is the honest denomination here"), accumulators `extractedFromLoser`/`deliveredToVictor` record real storage-months and "DIVERGE by the road's spoilage, which is the sink" (`:716-718`). The peace-mover chain: `pulseKernel.js:2625-2629` → `dispositionChannels.js:62-63` → `peaceTerms.advanceTreaties` (`:305`) → `computeTreatyGrainDraw` (`:723-733`); installment arithmetic in `treatyEnforcement.js:334-355`, whose own docstring quotes the design's §11 vocabulary — "25% of the treasury" — for a draw that moves granary months. Coalition victory reimbursement runs the same primitive (`warCoalitionSettlement.js:511,582,694,752`). **The UI already promises a treasury that does not exist**: `peaceTermsDrafting.js:87` renders "A tribute stream — N% of the treasury for Y years" over a grain movement. W-COIN-3 makes that sentence true.

### 3.5 · The rest of the money-shaped estate (CONFIRMED; full census APPENDIX A)

- **The faction "0..100 wealth score" the ruling cites does not exist as a stored field.** It is a typed DELTA STREAM (`FactionUpdateField` includes `'wealth'`, `settlement.schema.js:1021-1022`; ~45 authored delta rows in `factionRelationshipUpdate.js`) that is **parked, never applied**: `timeProgression.js:307-324` accumulates wealth/publicTrust/manpower onto `faction._timePressure` — "tracked in tick output ... but not yet stored on the faction" — an unbounded accumulator nothing clamps and nothing spends. No `faction.wealth =` assignment exists anywhere in `src/`. The banded axis `low|medium|high` in archetype profiles (`factionProfile.js:161-217`) is a fixed template, "avoiding numbers … without false precision" (`settlement.schema.js:917-926`).
- **A phantom read the treasury can cure:** `economicState.wealthIndex` is read at `warDeployment.js:763` (`movableWealth`) and **written nowhere in the repository** — so `razingSpoils` (`razing.js:816-841`) always takes the `nothingLeft` branch and every razing returns `plunder: 0`, "there is nothing in the ash". A whole spoils subsystem is inert for want of exactly the stock this mandate creates (§6.3).
- Trade war stakes are *positions*, not money: "C's primary trade partner for commodity K is a CONTESTABLE PRIZE … derived, never stored" (`tradeWar.js:4-10`); what is won is a `trade_dependency` graph edge with 0..1 strength (`:574-585`), never a payment.
- `vassal_extraction` is a condition stamp plus five `clamp01` relationship-scalar nudges (`relationshipRulesCore.js:597-641`) — the reasons text says "The overlord benefits structurally" but **no field on the overlord moves: extraction without a receiver**.
- Hegemony/tribute topology: `SUBORDINATING_TERM_TYPES = ['tribute','compelled_alliance','puppet_seat','occupation_continuation']` (`hegemony.js:56-58`), a derived sphere with "ZERO persisted state" (`:10-15`); the tribute phrase is prose over tie-counting.
- `treasury` appears in ~30 places in `src/domain` — every one prose, comment, or metaphor; a field in zero (APPENDIX A, CENSUS B4).

### 3.6 · Breadth census (lane fan-out, landed and folded)

A dedicated census lane swept government form, wealth/prosperity scores, and tribute/extraction flows across `src/`. Its findings are folded into §5.1 (the government-form decision), §3.5 (the score inventory + the `wealthIndex` phantom), and §6.3 (flow homes); the full report is **APPENDIX A** so the panel can audit the denominator. One-line summaries: government form is free text with no closed vocabulary (the only closed enum is derived `RULING_POWERS`); nothing in the estate is money (faction wealth is an unapplied delta stream; prosperity's smallest transactable unit is one band ≈ one-sixth of the world's wealth range); the six peace STREAM terms are the only conserved flow, denominated in granary storage-months.

## §4 · The stock

### 4.1 · Where coin lives: per settlement, and only per settlement

**`settlement.economicState.treasury`** — a sibling record to `foodSecurity`, written by ONE pulse writer (§6.1), registered in FROZEN_VS_LIVE in the same act.

Why settlement-scale (JUDGMENT — vetoable):
- Every conserved-stock lifecycle path in the estate is settlement-shaped: settlementUpdates, the single applicators, the manifest, the snapshot/freshest-read discipline (§1.1). A settlement treasury inherits ALL of it.
- The realm is a **pattern, not an entity** (`hegemony.js:10-15`) — a realm stock would mint the entity the frozen ruling forbids, and the WARD lesson (a hierarchy node is not a thing with geometry — memory, §710.6 family) says exactly what goes wrong when a hierarchy node acquires state.
- The charter's first consumers (warCosts/coalitionExpenditure) are settlement-actor reads.

Rejected alternative A — **realm-level stock**: requires minting a polity entity + its lifecycle (fusion, dissolution, succession), contradicts the hegemony ruling, and no consumer needs it. Rejected alternative B — **both scales**: two stocks denominated in the same unit with flows between them is the two-truths trap squared; the realm VIEW (§4.5) buys the display value for zero state.

### 4.2 · The record and its unit (the §711.6 law applied at birth)

```js
// settlement.economicState.treasury — ABSENT until the first lit tick (§7).
{
  coin: 0,          // UNIT: absolute integer state-coin. NEVER per-capita, NEVER re-expressed
                    // in months or bands at rest. Bands are DISPLAY derivations only.
  openedTick: 141,  // the lit tick the ledger began counting — the no-backfill witness
  lastTick: 154,    // bookkeeping (the granary's lastTick idiom)
  flows: { ... }    // LAST-TICK summary only (§6.4) — bounded, never a history array
}
```

- **Unit law**: the memory's §711.6 hazard ("a numeric field with no declared unit acquires a different unit at every consumer, and nothing ever reds") is answered structurally: the unit is declared in the typedef, in the fieldManifest row's `displayRule`, and every consumer read goes through exported accessors (`coinOf(settlement)`, `treasuryCapacity(settlement)`) so no consumer hand-reads the raw field. The W-COIN-1 test roster includes a cross-consumer unit assertion (every consumer's expectation stated against the same fixture).
- **Integer coin** (not the granary's tenth-month float): integer arithmetic makes the conservation property exact by construction — no float-associativity drift of the kind that moved 1 leaf in 29 in the §713.3 incident. Floor-division on transfer legs preserves the sink-only law.
- **Capacity** is DERIVED each call, never persisted (the `storageCapacityMonths` idiom, `foodStockpile.js:183-195`): `treasuryCapacity(settlement)` from tier base × fiscal-institution multipliers (banking house / banking district / stock exchange / city hall vault — the same `hasInst` sniffing family economicState already uses at `:141-153`). Constants in `TREASURY_TUNING`, named tuning-signature-adjacent (§5.5).

### 4.3 · The conservation law (closed, testable)

- **MINTS (exactly one kind):** taxation (§5). Honesty stated plainly for the panel: households are not modeled, so taxation mints against the settlement's *generated economic structure* (incomeSources × prosperity × tier), bounded by typed rates — it cannot be a transfer from a stock that does not exist. This is the same honesty grain accepted at the other end (production mints food from `baseSurplusPct`; nobody models fields grain-by-grain — `foodStockpile.js:351-360`).
- **TRANSFERS (conserved, sink-biased):** every settlement→settlement coin movement uses one primitive `computeCoinTransfer({payer, payee, amount, captureFraction, committedDebit, committedCredit})` mirroring `computeTreatyGrainDraw` clause for clause: floor both legs, capture ≤ 1 (the road/graft sink), payer floors at 0, payee clamps at capacity headroom, same-tick composition via committed debit/credit (`treatyTransfer.js:89-117` precedent).
- **SINKS (destroy, each a typed kind):** war upkeep per deployed tick (§6.2); deployment mint cost (raising an army); transfer spoilage/graft (capture < 1); capacity clamp at the applicator (grain's exact rule, `generosityUpdates.js:58`) — with the writer additionally stopping mints at capacity so the clamp is a safety net, not a phantom mint-and-burn.
- **NEVER:** negative coin (a cost that cannot be paid becomes a typed `shortfall` receipt + pressure signal, §6.2 — never debt; debt is a genuinely new capability class, owner-gated, out of scope); coin from RNG; coin written outside the single writer + single applicator pair.
- **The property test:** per tick, `Δ Σ coin = Σ mints − Σ sinks` exactly, over a fixture world with concurrent flows (two payers, one payee, capacity edge, shortfall edge). Integer arithmetic makes this an equality assertion, not an epsilon.

### 4.4 · The stock vs the scores — averting the second truth

The rule, stated once and enforced by direction-of-read:

- **prosperity / wealth / legitimacy are OPINIONS. `treasury.coin` is a STOCK. Opinions feed the stock's flows as inputs; the stock never writes an opinion — except through the two EXISTING bounded applicators (§3.2), and only as the declared legitimacy price of extraction (§5.4).**
- Prosperity keeps its writers (generation + E1d band-step). The treasury reads `prosperityRank` as a tax-base scalar and never reconciles against it. A Wealthy settlement with an empty treasury is a *story* (a rich town, a broke crown), not an inconsistency — the dossier can say exactly that sentence.
- The faction 0..100 wealth score and the banded `factionProfile` resources axis are untouched (APPENDIX A locates every home).

### 4.5 · The realm view (display, later car)

Realm treasury = Σ `coin` over the derived hegemony sphere / vassal tree at read time — a pure display aggregation beside `hegemonyRead` (`hegemony.js`), zero persisted state, DM-tier numeric / player-tier banded per the heraldRegister legibility law (WEAVE A2.1 DESK-1). Bands (closed): `empty|lean|adequate|full|overflowing` over `coin/capacity`. No engine consumer may read the aggregate (it is not truth; the sphere is a pattern).

## §5 · Taxation — a closed vocabulary of tax forms, typed by government form

### 5.1 · The government-form key — the census's load-bearing finding, and the decision it forces

CONFIRMED (APPENDIX A, CENSUS A): **there is no closed government-form vocabulary in the estate.** `settlement.powerStructure.government` is FREE TEXT — "the governing entry's name doubles as the government type" (`src/lib/gallery.js:666-669`; mint at `rulingStructure.js:787-792`), no normalizer exists, four writers mint it (generation `rulingStructure.js:792`, reconcile `economyReconciliation.js:278`, coup `rulingPower.js:521-522`, rename `factionRename.js:662`), and every existing consumer branches by REGEX on the string (`causalState.js:764-765`, `militaryStrength.js:254-259`, `religionState.js:660-667`, …) — with the recorded consequence that common labels like `Town Council` match nothing and silently score zero (`causalState.js:762-763`). The neighbours carry a ninth, disjoint vocabulary (`neighbourGenerator.js:17-27`). The ONE genuinely closed enum is derived-on-read and never persisted:

```js
// src/domain/spatial/cohesionWeave.js:133
export const RULING_POWERS = Object.freeze(['autocrat', 'council', 'theocracy', 'merchant_league', 'criminal', 'mixed']);
// derived from the governing faction's archetype via ARCHETYPE_TO_RULING (cohesionWeave.js:180-197),
// over the closed 13-value FACTION_ARCHETYPES enum (factionArchetypes.js:34-48)
```

**The decision (JUDGMENT — vetoable): taxation is typed on `RULING_POWERS`, derived at tax time from the governing faction's archetype through the EXISTING `rulingPowerFromArchetype` resolver — never on the free-text `government` string, and never by adding a ninth regex consumer.** Reasons: (a) it is the only closed vocabulary that exists, already `Object.freeze`d, already consumed by the generosity engine's `RULING_POWER_LENS` (`cohesionWeave.js:161-172`) and `settlementPolitics.js:767` — prior art, not invention; (b) derivation-on-read means coups retype taxation automatically the moment the governing faction changes (the `transferRulingPower` path needs zero W-COIN code); (c) the free-text disease — four writers, no normalizer, regex consumers scoring zero on unmatched labels — is exactly the §711.6/no-closed-vocab class this program exists to refuse. Archetypes outside the map (`outsider`, `other`) and settlements with no governing faction resolve to `'mixed'` — the fail-neutral row (the `warCosts.js:98-99` idiom: "Invalid input fails neutral rather than inventing direction").

Rejected alternative: normalizing `powerStructure.government` itself into a closed enum — a cross-cutting migration of a four-writer persisted field with display/gallery/PDF consumers (`warStatus.js:334`, `viewModel.js:271,503`, `ShareToGallery.jsx:65`), far beyond this mandate; recorded as a candidate structural-prevention car for the docket, not smuggled in here.

### 5.2 · TAX_FORMS — the closed vocabulary of forms

One closed set, each form grounded in the incomeSources families the generator already narrates (§3.1) so taxation *taxes the economy the settlement actually has*:

| form | grounded in (incomeSources literals) | notes |
|---|---|---|
| `land_rents` | Agricultural Rents, Property Rents | the default base everywhere |
| `market_tolls` | Market Taxes, Toll Revenue, Gate Tolls, Magical Trade Revenue | zeroed under siege (markets closed — `prosperity.js:62`) |
| `port_customs` | Port Duties, River Tolls | route-gated exactly as generation gated it |
| `licensing` | Guild Licensing, Guild Fees, Financial Services, Banking Fees, Spellcasting Services, Arcane Industry | institution-gated |
| `justice_fees` | Court Fees & Fines | |
| `tithe_share` | Church Tithes (& Rents), Pilgrim Trade | the state's cut of the church's cut; DEITY DOCTRINE untouched (structure only) |
| `levy_extraction` | Military Levy, Military Extraction | the coercive form; carries the legitimacy price (§5.4) |
| `misc_trade` | every remaining/custom row (custom `_good_` lines, resource streams, Enchanted Goods Premium, …) | the catchall that keeps the vocabulary CLOSED against open-vocabulary custom labels |

Criminal rows (`isCriminal: true`) are **never** a tax base — the generator already says so in prose: "This income stays in the settlement but flows to criminal actors, not the public treasury" (`economicState.js:348`). That sentence becomes an assertion.

The label→form mapping is a data table over the authored literals (they are finite — §3.1 enumerates every writer), matched at derive time; unmatched → `misc_trade`. The mapping table ships with a totality test: every literal the generator can emit maps (a source scan over `economicState.js`'s pushed `source:` strings — the fieldManifest walking-test idiom, `fieldManifest.js:16-19`).

### 5.3 · The profile: RULING_POWERS → {form: rateBand}

Rates are TYPED BANDS, never free floats: `TAX_RATE_BANDS = ['none','light','customary','heavy','extractive']` (closed, ordered). The profile is a frozen 6×8 authored table — one row per `RULING_POWERS` value, one band per TAX_FORM — the design's analog of FMG's form-based rates (Monarchy 0.15/0.20, Theocracy 0.25/0.10, Republic 0.05/0.15 … — their `states-generator.ts:72-78`, see §9), but banded, typed, and with consequences (§5.4) instead of dangling numbers. Illustrative shape (values provisional, tuning-adjacent):

| | land_rents | market_tolls | port_customs | licensing | justice_fees | tithe_share | levy_extraction | misc_trade |
|---|---|---|---|---|---|---|---|---|
| `autocrat` | heavy | customary | customary | light | customary | light | heavy | customary |
| `council` | customary | customary | customary | customary | customary | light | light | customary |
| `theocracy` | customary | light | light | light | customary | heavy | light | light |
| `merchant_league` | light | heavy | heavy | heavy | customary | none | light | heavy |
| `criminal` | light | extractive | customary | extractive | none | none | extractive | customary |
| `mixed` | customary | customary | customary | customary | customary | light | light | customary |

Laws: total closure (every cell a band from the closed set; `Object.freeze`d data, walker-testable both ways — every RULING_POWERS row present, no unknown keys); only coercive rows reach `extractive`; `criminal` seats tax like the racket the estate already narrates ("the racket is the treasury", `rulingPower.js:181`) and pay the steepest legitimacy price. The band→multiplier constants live in `TREASURY_TUNING` (§5.5).

### 5.4 · The yield and its price

Per lit tick, per settlement, the single writer computes:

```
yield = Σ over forms f present(settlement):
          baseYield(tier) × formShare(f)            // from the mapped incomeSources percentages
          × bandMultiplier(profile[rulingPower][f]) // the typed rate; rulingPower derived per §5.1
          × prosperityScalar(prosperityRank)         // the opinion feeds the base, one-way
          × stressGate(f, stressors)                 // siege ⇒ market/toll forms 0; occupied ⇒ §6.3
```

floored to integer coin, capacity-stopped. Two consequences make taxation a *system* rather than FMG's dangling number (§9 failure d):

1. **The legitimacy price**: `heavy` and `extractive` bands on coercive forms emit bounded negative legitimacy deltas through the EXISTING `applyLegitimacyDeltasToUpdates` (`generosityUpdates.js:80-107`) — reusing the E1b machinery ("a hungry giver's ruler pays a legitimacy price") with a new typed cause; the canonical legitimacy read-point is `governanceLedger.js` (`:31-35`, neutral default 50, legacy-shape-tolerant). Bounded, integer, clamped — no new applicator.
2. **The receipt**: each tick's yield lands in `flows` (§6.4) and, when notable (band transitions, shortfalls, openings), as news under the news-address law (§6.5).

### 5.5 · TREASURY_TUNING — named as what it is

All constants (baseYield per tier, band multipliers, prosperity scalars, upkeep costs, capture fractions, coverage thresholds) live in one frozen `TREASURY_TUNING` export, explicitly commented **tuning-signature-adjacent**: W-COIN ships provisional values; the owner signs real values at the endgame tuning pass (TIME-IS-NOT-THE-CONSTRAINT law — the constants are declared inputs to that pass, never silently final). The 300y-runaway/map-leg rule applies: treasury trajectories become a tuning-pass input (a 300-year soak must not show monotone coin explosion — FMG's own PRD names unbounded accumulation as what a second tick would do to their model, §9).

## §6 · Flows — sources and sinks, each typed and receipted

### 6.1 · The writer/applicator architecture (the grain law, applied)

- **ONE pulse writer**: `advanceTreasury(settlement, {interval, tick, deployment, stressors, lit})` in a new lazy leaf `src/domain/worldPulse/treasury.js`, called from the `@pulse-stage: settlement_clock` loop beside `advanceFoodStockpile` (`pulseKernel.js:521` seam). It owns: taxation mint, upkeep sinks, the flows summary, the changed-flag identity discipline. FROZEN_VS_LIVE row registered in the same act (`path: 'economicState.treasury.coin'`, `mode: 'live'`, writer named).
- **ONE applicator** for cross-settlement deltas: `applyCoinDeltasToUpdates(updates, updateIndex, coinDeltas)` in the same leaf (the `generosityUpdates.js:46-70` shape: clamp to capacity, integer, reference-identity when nothing moved). Movers that later add coin legs (W-COIN-3) emit deltas into it — none of them ever becomes a second writer.
- **ONE transfer primitive**: `computeCoinTransfer` (§4.3), beside the writer, mirroring `computeTreatyGrainDraw`'s committed-debit/credit contract.

### 6.2 · Sinks first (the charter's order: warCosts/coalitionExpenditure FIRST)

W-COIN-2 lands the war bite:

- **Deployment upkeep**: an active outbound deployment costs `UPKEEP_PER_TICK(deployedPopulation band)` coin per tick — the coin twin of the granary's `deploymentDrainPct` (`foodStockpile.js:88-95`), read from the same one-army ledger the food pass reads (`pulseKernel.js:510-512`), gated identically on `warLayerEnabled` AND the treasury flag.
- **Shortfall, typed**: unpayable upkeep emits `{kind:'treasury_shortfall', tick, owed, paid}` into `flows` — never negative coin, never a blocked deployment (W-COIN does not gate war on money; that would be a behavior change to the war opener, deliberately out of scope — §12 Q5 records the option).
- **The coffers read** (the actual charter deliverable): `readWarHomeFront` gains a SIXTH component `coffers` **built only under the lit flag** — dark path constructs today's five components byte-identically. CONFIRMED hazard, designed around: `base = sum/length` over `Object.values(components)` (`warCosts.js:493-494`), so a sixth component at score 0 would still dilute the other five — therefore the lit arm appends `coffers` ONLY when observed (opened treasury + a live deployment), the exact independently-optional discipline the five existing components already follow ("Every component is independently optional", `warCosts.js:296-299`). Score: `clamp01(1 − coverageTicks/COVERAGE_FULL_AT)` where `coverageTicks = coin / upkeepPerTick` — "how long can the crown pay its army", banded by the existing `warHomeFrontBand`. `stateRead: 'economicState.treasury.coin'`.
- **The expenditure bill**: `readCoalitionExpenditure` gains a `coffers` component the same way; its `completeness` record grows a `coffers` key (false until the treasury has ≥ `COVERAGE_OBSERVED_AFTER` ticks of history — a newly-opened empty treasury must not fabricate "decisive" pressure; the completeness idiom at `warCoalitionExpenditure.js:217-224`). Weights: the dark path keeps the frozen five-weight `COALITION_EXPENDITURE_TUNING` (`:19-26`) untouched; the lit path uses a sibling frozen six-weight set. Downstream consumers (`warTermination.js:605`, `warPeaceDecision.js:253-427`, `peaceTerms.js:486`, `pulseKernel.js:1257`) need ZERO changes — the component flows through the existing aggregates. Lit = a declared future-tick behavior shift on war pressure reads, named in the landing act.

### 6.3 · Sources and transfers beyond taxation (W-COIN-3, each owner-visible)

- **Tribute/reparations coin leg**: the peace mover's six stream installments gain a coin-first draw (`computeCoinTransfer` with `streamInstallmentFraction`'s fraction — `treatyEnforcement.js:334-355`), grain drawn only for the remainder — the loser pays from the vault before the granary, and `peaceTermsDrafting.js:87`'s "N% of the treasury" sentence becomes literally true. Occupation extraction (`prosperity.js:66-71` already narrates "Revenue flows outward to the occupying authority") becomes a real per-tick coin transfer to the occupier under the flag. Future-tick declared shifts; both route through the applicator; both keep the grain fallback so a coinless court still pays the way it does today.
- **The vassal finally pays somebody**: `vassal_extraction`'s "extraction without a receiver" (§3.5) gains its material half — a small coin transfer vassal→overlord in the same candidate that stamps the condition (`relationshipRulesCore.js:614-641`), conserved through the primitive, capped by the vassal's coin. The condition, scalars, and rebellion valve are untouched; the flow makes the existing story arithmetic.
- **The razing cure**: `movableWealth` at `warDeployment.js:763` reads the treasury (`coinOf(conqueredSettlement)`) instead of the never-written `wealthIndex` — the inert `razingSpoils` subsystem (`razing.js:816-841`) comes alive as a SACK TRANSFER of coin (plunder = the sack primitive with an aggressive capture fraction), under the flag, dark path preserving today's `plunder: 0` byte-exactly. This is repair-shaped (a read wired to a field that never existed) but it changes future-tick outcomes on lived worlds — declared, and listed in the owner row (§12 Q8).
- **Coalition reimbursement coin leg**: `warCoalitionSettlement`'s claims (`:511-582`) gain the same optional coin-first arm.
- Relief/subsidy (a court pays another's shortfall) and construction sinks are W-COIN-4, post-first-observation.

### 6.4 · Receipts without unbounded state

`treasury.flows` is a LAST-TICK summary only — `{taxed, upkeep, transferredIn, transferredOut, shortfall}` integers — plus lifetime accumulators ONLY where a consumer needs them (the `extractedFromLoser` idiom, `peaceTerms.js:732-733`). **No per-tick history array ever persists** (the save-size discipline; the pulse news feed is the history surface, already capped).

### 6.5 · Narration under the news-address law

Every narrated flow carries the four mandatory parts (owner doctrine 2026-07-22, memory: news-address-law): full subject address chain (settlement → power), the typed action (`treasury_opened | tax_receipt | upkeep_paid | treasury_shortfall | tribute_paid_coin | …` — a closed kind set), affected settlements by name, and the reason from the recorded cause. Realized through the discourse-kernel grammar like every other beat — never freeform. Notable-only (band crossings, openings, shortfalls, first tribute) so the feed is not spammed by routine tax ticks.

## §7 · Lifecycle, flag, dormancy — THE PROMISE holds

### 7.1 · The flag, by the book (program law §1.3 verbatim)

`treasuryEnabled` — an ENGINE-GATED VIRTUAL rule key (`simulationRules.js:158-185` — "a dark layer costs a campaign zero persisted bytes"): strict by-name `rules.treasuryEnabled === true` read at the ONE writer door (the `pactFormationEnabled` precedent — "a gate standing at that door is a gate nothing can write past", `simulationRules.js:269-279`), entry in `ENGINE_GATED_VIRTUAL_RULE_KEYS` with the joining comment, certification row in `subsystemRowsVirtual.js`, lit credit under mechanismLitCoverage, dormancy proof, ONE commit. The walker (`tests/lint/engineGatedRuleKeys.walker.test.js`, cited at `simulationRules.js:177`) proves membership both ways. The W-COIN-2 read arms in warCosts/warCoalitionExpenditure gate on the same key by name (each read site listed in the certification row).

### 7.2 · Lifecycle paths (every path stated; the deep-work map)

| path | behavior | status |
|---|---|---|
| **create** | NEVER at generation. At the first lit tick the writer mints `{coin: 0, openedTick: tick}` + a `treasury_opened` receipt. Zero-open is the no-backfill law (§2.1): no fabricated balance, every coin forever traceable to a receipted mint. New worlds under a lit flag open the same way at tick 1 — generators, worldPlan, worldCode, fingerprints ALL untouched (zero generator churn; no POLIS-1 collision). | design |
| **read** | accessors only (§4.2); consumers: coffers reads (W-COIN-2), display row (W-COIN-4), news. | design |
| **persist** | rides `settlement.economicState` through settlementUpdates exactly as `foodSecurity` does; absent key on every dark save. | design |
| **regenerate** | CONFIRMED: the regenerate path runs full `GENERATE_SETTLEMENT` (`src/store/settlementSlice.js:293,377,468`), so regen re-derives `economicState` — and the generator never mints a treasury, so **regen under a lit flag drops the treasury record; the writer re-opens it empty at the next tick with a fresh `treasury_opened` receipt (openedTick > regen tick)**. That is the same lived-state-reset class the tick-advanced granary already accepts on regen (PLAUSIBLE for the granary — settling experiment: regen a lived settlement with a lit non-generation `storageMonths`, diff `foodSecurity` before/after; W-COIN-1's charter includes executing it and stating the observed law in the landing act). Stated, not hidden; the panel should attack whether re-open-empty is acceptable or the regen path must carry the record over (a one-field carry-over in the regen preserve set is the alternative — owner-visible either way, §12 Q6). |
| **undo / restore** | the treasury rides the settlement snapshot like every economicState field; undo restores the prior record wholesale. No special handling — asserted by an undo round-trip test. | design |
| **import / legacy** | absent key ⇒ dark behavior regardless of flag until the writer's next lit tick mints it; malformed record ⇒ fail-inert (the `asObject`/finite-guard idiom everywhere in the war stack, e.g. `warCosts.js:91-95`). | design |
| **clone / gallery** | the record is plain JSON on economicState — survives structured clone; gallery import of a lit-world settlement into a dark campaign carries the record but the dark engine never reads or writes it (strict gate), and the dormancy suite pins that. | design |

### 7.3 · The dormancy bar: raw-byte, with the honest comparator

Per §713.2 ("a dormancy claim is a bit claim") and the false-pass hazard recorded there (a `diff` over stale artifacts compares nothing): the proof is **base-dormant vs tip-dormant** — the same seeded world advanced N ticks at the pre-W-COIN base and at the W-COIN tip with the flag absent, serialized bytes equal, PLUS the flag-absent/flag-false equivalence (`=== true` strictness). Home: `tests/domain/treasuryDormancy.byteIdentity.test.js` (the `*Dormancy.byteIdentity.test.js` family — `brokerageDormancy`/`seasonsDormancy`/`religionDormancy` precedents confirmed at tip). The W-COIN-2 read arms owe their own dark-path pin: five components, byte-identical receipts, at the warCosts fixture.

### 7.4 · Declared shifts (program law §1.9)

- Lit on a lived world: treasury opens at future ticks; war pressure reads gain the coffers component from the observed threshold — DECLARED in the landing act, future-tick-only, zero lived-history edits.
- Lit on new worlds: same-seed worlds differ from dark same-seed worlds only at tick ≥ 1 state (generation identical by construction — no generator touch).
- No golden re-records in W-COIN-1 (dark = byte-identical); W-COIN-2's lit-path fixtures are NEW pins, not re-records.

## §8 · What W-COIN deliberately does NOT do (deferrals, written down)

1. **No debt/credit instrument** — coin floors at 0; lending is a new capability class (E1b credit exists for GRAIN with its own maturity machinery; coin credit is owner-gated future work).
2. **No market/price model, no household coin** — the E1d band-step market twin stays the whole story of private commerce (§2.2).
3. **No war-opener gating on affordability** — money pressures war reads; it does not veto deployments (§12 Q5).
4. **No realm entity, no realm stock** (§4.5).
5. **No AI narration of flows** — receipts realize through the discourse kernel (FINITE-SEMANTICS: AI = clerk never writer).
6. **No coin leg on generosity instruments** — grain relief/purchase/credit stay grain (the reversal is civic, not a re-denomination of E1).
7. **No persisted per-tick history** (§6.4).

## §9 · FMG's economy arc — the comparison the charter asked for (lane fan-out, landed; APPENDIX B verbatim)

FMG upstream is NOT economy-free: `v1.124.0 — Economy` ships goods→recipes→markets→deals→tax→treasury (their `fmg-wiki/Changelog.md:44,48`), and their own PRD states the shape: "Ticking / recurring production. Economy stays frozen at a single post-generation cycle" (`docs/prd/state-taxes-and-treasury.md:24`). What their arc teaches, each item mapped to a W-COIN answer:

| FMG failure mode (receipts in APPENDIX B) | W-COIN answer |
|---|---|
| **Treasury spelled as a stock, implemented as a derived score** — `collectTaxes()` opens with `state.treasury = 0` and recomputes (`states-generator.ts:858`) | the stock is written ONLY by credit/debit through one writer; nothing ever recomputes it from scratch (§6.1) |
| **Money not conserved** — burg sales credit with no counterparty debit; poll tax "the money simply appears" (`docs/domain/taxes.md:16`) | one mint kind (taxation, bounded + honest about being a mint), everything else conserved-with-sinks; the Δ-equality property test (§4.3) |
| **Stock/flow naming collision** — `burg.treasury` never resets, `state.treasury` always resets; same name, opposite lifecycles | one field, one lifecycle, one writer; the manifest row makes the writer contract machine-checked (§6.1) |
| **No sinks** — "taxation without administration cost or military upkeep produces monotone treasury growth the moment you add a second tick" (their PRD `:159` names spending as the missing half) | sinks land in the SAME wave family as the mint (W-COIN-2 immediately after W-COIN-1); monotone-growth is a named tuning-pass input (§5.5) |
| **Dangling political economy** — form-based tax rates exist (Monarchy 0.15/0.20, Theocracy 0.25/0.10, `states-generator.ts:72-78`) but nothing spends and military is fully decoupled (zero economic reads in `military-generator.ts`) | rates are BANDS with consequences (legitimacy price §5.4) and the first consumer is exactly the military-cost surface (§6.2) |
| **Order artifacts** — ascending-population processing order sets prices (`production-generator.ts:42-44`) | per-settlement independent mint/sink (no cross-settlement contention in W-COIN-1/2); transfers compose via committed debit/credit, codepoint-sorted iteration (the estate's determinism contract, `tradeWar.js:31-38`) |
| **Editor overrides silently destroyed** by the next recompute | there is no recompute; DM edits to coin (if ever granted) would be ordinary settlement edits riding the ordinary persistence — out of W-COIN scope, noted §12 Q7 |
| **The one steal**: `deal.tax` recorded on the transaction so collection never re-derives rates (`markets-generator.ts:33`) | adopted: every flow entry records its resolved band/amount at flow time; receipts never re-derive history from current rates (§6.4) |

## §10 · Cars, effort, ordering, test estate

| car | content | effort | bar |
|---|---|---|---|
| **W-COIN-0** | this document + skeptic mini-panel | done at panel | — |
| **W-COIN-1** | the stock: `treasury.js` leaf (writer + transfer primitive + applicator + accessors + TREASURY_TUNING) · `treasuryEnabled` full flag idiom (ONE commit, §7.1) · taxation mint (TAX_FORMS + label→form mapping + the 6×8 RULING_POWERS profile table §5.3 + legitimacy price) · fieldManifest FROZEN_VS_LIVE row · settlement.schema typedef · pulse-kernel seam (one call site) · dormancy suite + conservation property test + unit cross-consumer assertion + label-mapping totality test · the regen experiment executed and its law stated | **M** | raw-byte |
| **W-COIN-2** | war sinks + coffers: upkeep sink, shortfall receipts · `coffers` component lit arms in `readWarHomeFront` + `readCoalitionExpenditure` (+ sibling six-weight set, completeness key) · news beats (address-law kinds) · dark-path pins at both fixtures · declared lit shift | **S-M** | raw-byte (news bytes) + the warCosts/coalitionExpenditure dark pins |
| **W-COIN-3** | coin legs on flows: the six stream terms coin-first with grain fallback (peace mover; makes `peaceTermsDrafting.js:87`'s treasury sentence true) · occupation extraction transfer · vassal_extraction's receiver (§6.3) · the razing/`wealthIndex` cure (§6.3, Q8) · coalition reimbursement coin leg — each a declared future-tick shift; owner-rowed (§12 Q4/Q8) before dispatch | **M** | raw-byte |
| **W-COIN-4** (held) | dossier/DESK display row + banded vocabulary · realm aggregation view · relief/construction sinks | **S-M** | dormancyOracle (view-only parts) |

- **Sequencing**: engine-wave slot per A3, pre-soak; STRIP-independent (zero store/UI surface in cars 1-3); no collision with WEAVE cars — the only shared files are `warCosts.js`/`warCoalitionExpenditure.js` (no WEAVE car edits them; NAME-3 reads the *display* war family) and `peaceTerms.js` (W-COIN-3 only; no WEAVE car edits it). Consumer censuses re-run at dispatch (program law §1.7). W-COIN-1 before W-COIN-2 before W-COIN-3; W-COIN-4 post-STRIP-6 if it lands at all pre-soak.
- **Test-estate economics (program law §1.5 / A1.13)**: extends `tests/domain/warCosts.test.js`, `tests/domain/warCoalitionExpenditure.test.js`, `tests/domain/peaceTerms.test.js`, `tests/domain/fieldManifest.test.js` roster (all CONFIRMED present at tip). New files: `tests/domain/treasury.test.js` + `tests/domain/treasuryDormancy.byteIdentity.test.js` — TWO new files, landed batched in W-COIN-1's landing window with ONE lighting-census re-derivation (all five figures, same commit); `byteIdentity` basename avoids the `*Golden*` mutation-manifest bill; both start at negativeAssertionAnchor ceiling 0. The new-test-file-reds-three-censuses law is priced into W-COIN-1's charter, not discovered at its gate.
- **Entropy**: zero new draws anywhere in W-COIN (taxation, upkeep, transfers all deterministic) — no entropy-census row needed; asserted in each car's landing act.

## §11 · What the skeptic panel should attack

1. **The mint honesty** (§4.3): is "taxation mints against generated structure" a hole? Attack with: can any loop mint unboundedly (tax → transfer → tax)? (Answer to beat: yield reads generation-frozen structure + prosperity opinion, never the stock — no feedback loop exists; verify by reading the yield inputs.)
2. **Component dilution** (§6.2): does the observed-only sixth component keep every dark AND lit-but-unobserved read byte-identical to today's five? Demand the pin.
3. **The regen fork** (§7.2): is re-open-empty acceptable, or does a lived treasury deserve the carry-over? Force the granary experiment to run and the law to be stated before W-COIN-1 lands.
4. **Unit drift** (§711.6, four sightings in memory): hunt any consumer reading `coin` per-capita, as months, or as a band without the accessor. Demand the cross-consumer assertion.
5. **The label→form mapping** (§5.2): custom content mints open-vocabulary `source` labels — prove `misc_trade` catches them all and the totality scan cannot silently rot.
6. **Second truth** (§4.4): find any path where treasury and prosperity could be read as competing answers to the same question. The direction-of-read rule must survive the hunt.
7. **Save growth**: the record is O(1) per settlement — verify `flows` cannot grow (no arrays), and that the news feed cap governs narration volume.
8. **Dormancy comparator** (§7.3): confirm the suite compares base-dormant vs tip-dormant advancement bytes, not artifacts (§713.2's total-false-pass class).
9. **The occupied/besieged edges**: a besieged court taxing closed markets, an occupied court's yield diverted — are the stress gates honest against the prose the generator already committed to (`prosperity.js:62-71`)?
10. **Charter fidelity**: A3 says warCosts/coalitionExpenditure FIRST — W-COIN-2 delivers exactly that seam; confirm nothing in W-COIN-1 sneaks a consumer ahead of it.
11. **The derived government key under change** (§5.1): a coup transfers the governing faction mid-campaign — the tax profile follows automatically. Attack the within-tick ordering: the writer must read the governing archetype from the same freshest-state discipline the grain draws use (`treatyTransfer.js:139-156`), so a coup and a tax tick compose deterministically; and a settlement with NO governing faction must resolve `'mixed'`, not throw and not skip silently (receipt says which).

## §12 · Open questions (batched for the owner / panel, each with a recommendation)

- **Q1 — display unit word + bands** (owner vocabulary surface): engine field is unit-declared integer `coin`; the display word ("crowns"?) and the band labels land with W-COIN-4's DESK row. REC: defer the word to the display car; bands as §4.5.
- **Q2 — genesis posture for NEW worlds under a lit flag**: open-empty at tick 1 (REC — zero generator churn, no-backfill purity) vs a generation-time seeded balance (touches generators, fingerprints, worldCode — expensive, fabricates a pre-history number).
- **Q3 — scope boundary**: E1d purchase and generosity stay grain+band-step (REC: yes — the reversal is civic; §2.2 JUDGMENT, vetoable).
- **Q4 — W-COIN-3's re-denomination** of tribute/reparations to coin-first: dispatch after W-COIN-2's first observation window (REC), or hold as owner row.
- **Q5 — money gating war**: should an empty treasury ever VETO a deployment? REC: no for launch (pressure only, via coffers); record as tuning-era docket item.
- **Q6 — regen carry-over** (§7.2): re-open-empty (REC, matches the granary's class) vs preserve-set carry-over.
- **Q7 — DM edit surface for coin**: none in W-COIN (REC); if granted later it is an ordinary settlement edit + receipt, never a silent set.
- **Q8 — the razing/`wealthIndex` cure** (§6.3): wire `movableWealth` to the treasury under the flag (REC — it revives an authored subsystem that is provably inert today and is exactly what the stock is for), or leave razing inert and record the phantom read as a separate defect. Either way the phantom is now on the record.
- **Q9 — the free-text government field** (§5.1): the normalization of `powerStructure.government` into a closed persisted vocabulary is a real structural-prevention candidate surfaced by this census (four writers, no normalizer, regex consumers silently scoring zero) — docket item, NOT part of W-COIN. REC: record for the docket.

## §13 · Receipts ledger

**CONFIRMED (executed reads this session):** every file:line cited in §§1-10 was read from the extract mirroring `73f5dfc02` (verified: `git show 73f5dfc02` = "TE-SEAM-B: the shipped hamlet-boundary seam") or from `git show ad2d35693:docs/DESIGN_FMG_WEAVE.md` (§1 program laws, A1 folds, A2.2 Q-W8, A3 grant). The FMG receipts in §9/APPENDIX B are the fan-out lane's executed reads of the upstream clone.

**CONFIRMED by the landed censuses (previously open):** the government-form situation (§5.1 — free text, no normalizer, `RULING_POWERS` the one closed enum, receipts in APPENDIX A); the faction wealth score's true nature (unapplied `_timePressure` delta stream, `timeProgression.js:307-324`); the `wealthIndex` phantom (`warDeployment.js:763` read, zero writers); the six-stream-term count and the full peace-mover chain (`pulseKernel.js:2625-2629`).

**PLAUSIBLE (settling experiment named):**
- The granary's own regen behavior (§7.2) — experiment specified, executed inside W-COIN-1.
- "The incomeSources literal set is finite" — CONFIRMED for every writer in `economicState.js` (all enumerated §3.1); PLAUSIBLE that no *other* module appends rows post-generation (settling: consumer census of `incomeSources` writers at W-COIN-1 dispatch, per program law §1.7).
- The illustrative 6×8 profile table values (§5.3) are design flavor, not measurements — authored for real at W-COIN-1 and signed at the tuning pass.

---

# APPENDIX A — the estate breadth census (lane report, verbatim; paths abbreviated to repo-relative)

## CENSUS A — GOVERNMENT FORM

**A1. Canonical field path:** `settlement.powerStructure.government` — a plain **string**, not an object, not an enum. There is no `powerStructure.type` and no `powerStructure.governmentType`. The estate documents this explicitly (`src/lib/gallery.js:666-669`): "powerStructure.governmentType is never written by the generator — the engine persists powerStructure.government as a STRING (the governing entry's name doubles as the government type), with governingName as the canonical 'who governs' field. Legacy rows may carry an object with .type." Twin field `powerStructure.governingName`; at generation the two are byte-identical, diverging only through `previousGovernments`. Typedef at `src/domain/rulingPower.js:78-88`. Persisted on the save: `src/generators/steps/assembleSettlement.js:128`.

**A2. The vocabulary — THERE IS NO CLOSED LIST.** `powerStructure.government` is free text minted from a label table; every downstream consumer regex-matches the string. No enum, no normalizer, no validator (`normalizePowerStructure`/`normalizeGovernment`/`governmentArchetype`: zero hits across `src/`). Four separate, non-interoperating vocabularies exist:

(a) The generator's label table (open, tier-banded), `src/generators/power/rulingStructure.js:161-175` — `governanceLabelMap` mapping institution keys to labels ('Elder Consensus'/'Household Council', 'Free Elder Council'/'Elder Council', 'Elected Reeve', 'Feudal Stewardship', 'Feudal Appointee', 'Grand Council'/'City Council'/'Town Council', 'Grand Guild Council'/'Guild Authority'/'Guild Council', 'Grand Guild Consortium'/'Merchant Guild Council', 'Ducal Governorship'/'Noble Governorship', 'Grand Merchant Oligarchy'/'Merchant oligarchy', 'Democratic assembly', 'City-State Council', 'Royal Authority') — plus a `topCategory`-driven council-renaming cascade at `rulingStructure.js:220-330` producing: Grand Military Council, Military City Council, Military Council, High Theocratic Council, Ecclesiastical Council, Church Council, Grand Merchant Senate, Merchant City Council, Merchant Council, Shadow Senate, Corrupt City Council, Corrupt Council, Arcane Senate, Arcane Council, Headman's Authority, Priestly Guidance, Town Mayor, Elder Council, Household Council.

(b) The coup/transfer preference table (13 archetypes × 3 tier bands), `src/domain/rulingPower.js:135-150` — `GOVERNMENT_PREFERENCES` (MILITARY: Militia Command/Military Council/Grand Military Council; RELIGIOUS: Church Council/Theocratic Council/High Theocratic Council; MERCHANT: Merchant Council/Merchant City Council/Grand Merchant Senate; NOBLE: Feudal Stewardship/Ducal Governorship/Royal Authority; ARCANE: Circle of Adepts/Arcane Council/Grand Arcane Council; CRAFT: Guildmasters' Moot/Guildhall Council/Grand Guild Assembly; LABOR: Commons Assembly/Workers' Assembly/Grand Commons Assembly; CIVIC + GOVERNMENT + OTHER: Elder Council/Town Council/City Council; OUTSIDER: Foreign Stewardship/Foreign Administration; OCCUPATION: Occupation Authority; CRIMINAL: Corrupt Council/Corrupt City Council/Shadow Senate). (a) and (b) overlap but do not agree — 'Theocratic Council' and 'Grand Arcane Council' exist only in (b); 'Merchant oligarchy' and 'Democratic assembly' only in (a). Collision fallbacks `ALT_GOVERNMENT_LABELS` at `rulingPower.js:154-165`.

(c) **The only genuinely closed enum** — `src/domain/spatial/cohesionWeave.js:133`: `RULING_POWERS = Object.freeze(['autocrat','council','theocracy','merchant_league','criminal','mixed'])`, derived-on-read from the governing faction's archetype via `ARCHETYPE_TO_RULING` (`cohesionWeave.js:180-197`: noble/military/occupation→autocrat; government/civic/labor→council; religious/arcane→theocracy; merchant/craft→merchant_league; criminal→criminal). Never persisted, only computed.

(d) The underlying archetype enum — `src/domain/factionArchetypes.js:34-48`: `FACTION_ARCHETYPES` = government, noble, military, merchant, religious, criminal, arcane, craft, labor, outsider, occupation, civic, other (13 values, closed).

**A3. Minting writers (four):** `generatePowerStructure` return (`rulingStructure.js:792`, generation; the mint at `:787-792` sets `government:` to the governing faction's name); economy↔power reconcile (`economyReconciliation.js:278`, generation re-projection); `transferRulingPower` (`rulingPower.js:521-522`, coup/CHANGE_RULING_POWER); faction rename rewrite (`factionRename.js:662`, registered `:245`). Pipeline step `generatePower.js:24-31` provides `powerStructure`.

**A4. Representative consumers — all branch by REGEX on the free-text string:** `causalState.js:764-765,793-801` (law_order: LAWFUL/ANARCHIC patterns, ±8; comment at `:762-763`: "A government string absent from BOTH lists contributes nothing" — Town Council, Merchant oligarchy, Guild Authority, Elected Reeve all score zero); `militaryStrength.js:254-259` (war will: MARTIAL +14 / PACIFIST −10); `religionState.js:655,660-667` (divine mandate: /theocra/ ⇒ 1, /monarch|feudal|autocra|…|royal/ ⇒ 0.45, else 0; also `religionState.js:705,728`, `religionLegitimacy.js:500`, `religiousContest.js:195,872,944`); `cohesionWeave.js:161-172` RULING_POWER_LENS (generosity coalition weights, via `rulingPowerFromArchetype` `:222`) + `settlementPolitics.js:767` (isAutarchy); display/export with `government || governingName` fallback (`display/warStatus.js:334`, `summary/settlementQuickGuide.js:214`, `components/ShareToGallery.jsx:65`, `pdf/lib/viewModel.js:271,503`).

**A5. Realms/factions/neighbours:** Realms — NO government-form field (grep across `src/domain/realm/`: only event-routing keys, `heraldRouting.js:265,269,274`). Factions — NO government form (archetype + isGoverning only; the form is a property of the settlement seat). Neighbours — YES, a separate and incompatible vocabulary: `neighbourGenerator.js:17-27` `GOV_ANTITHESIS` over nine lowercase forms (theocracy, merchant republic, military autocracy, noble oligarchy, feudal lordship, free city council, peasant commune, ecclesiastical council, military council), minted onto `neighbourProfile.governmentType` at `:149,172` by `extractGovernmentType(power)` (`:184+`). These nine strings never intersect the settlement's own label set.

**A6. `src/domain/governanceLedger.js`** (67 lines) is NOT a government-form ledger — it is the single canonical read-point for `powerStructure.publicLegitimacy` (0..100 score + banded label), returning `{legitimacyScore, legitimacyLabel, present}`, neutral default 50/null/false (`:31-35`), legacy bare-number tolerated (`:63-65`). Header `:17-19`: "Governing-faction power is deliberately NOT folded in … two distinct notions, not a shared conserved quantity."

## CENSUS B — WEALTH / PROSPERITY SCORES

**B1. The faction 0..100 wealth score is a DELTA STREAM, never a stored balance.** Field: `FactionUpdate.field === 'wealth'`, delta only — no persisted `faction.wealth` number exists. Vocabulary: `settlement.schema.js:1021-1022` (`'power'|'legitimacy'|'wealth'|'publicTrust'|'manpower'`). Scale implicitly 0..100; magnitudes ±3..8 ("intentionally moderate (3–10 per delta)", `factionRelationshipUpdate.js:40-42`). Minted by `recalculateFactionRelationships()` (`factionRelationshipUpdate.js:804`) from `ARCHETYPE_IMPACTS` (~45 wealth rows, e.g. `:80,:253,:294,:621`); callers `timeProgression.js:388`, `events/eventPipeline.js:269`. **Persistence: PARKED, NOT APPLIED** — `timeProgression.js:307-324`: "Wealth / publicTrust / manpower: tracked in tick output ... but not yet stored on the faction"; accumulated onto `faction._timePressure`, unbounded, nothing clamps, nothing spends. Only `legitimacy` reaches a real field (`powerStructure.publicLegitimacy`, `:301-304`); only `power` moves the roster. Grep confirms: no `faction.wealth =` assignment anywhere in `src/`. Adjacent derived-on-read surfaces: `factionProfile.js:161-217` (`resources.wealth` 'low'|'medium'|'high', hardcoded per archetype; `settlement.schema.js:917-926`: "Avoiding numbers here keeps the profile legible … without false precision"); `entities/status.js:48` + `entities/propagate.js:146-151` (institution capacity/infrastructure → faction 'wealth' impairment). `factionDedup.js`/`composeInstantWorld.js`: no wealth field.

**B2. Settlement prosperity — the canonical 7-band ladder.** Field `settlement.economicState.prosperity` — string label (tolerated `{tier}` shape). Closed vocabulary `data/constants.js:92-94` (`PROSPERITY_TIERS`), rank helper `:98-101`. Minted `economicState.js:855` → `deriveProsperityLabel` (`prosperity.js:121-172`), base from `computeBaseProsperity` (`:175+`). Emission caveat `constants.js:85-87`: 'Subsistence' is internal, remapped before emission — the emitted set is 6 (`prosperity.js:125`). PERSISTED (`assembleSettlement.js:121`). Tick writer: `generosityUpdates.js:121` only. **No `wealthLevel` field exists anywhere in `src/`** (zero hits). **Phantom read found:** `economicState.wealthIndex` read at `warDeployment.js:763` (`movableWealth`), written nowhere in the repository — so `razingSpoils` (`razing.js:816-822`) always takes the `nothingLeft` branch: every razing returns `plunder: 0`, "there is nothing in the ash". Main prosperity consumers (all via `prosperityRank` per the `constants.js:88-91` warning): `causalState.js:702-718` (PROSPERITY_BASE — a 10-key map including four keys the generator never emits); `state/deriveSystemState.js:109-128` (header records the old 'Modest' bug); `generosityKernel.js:283-290`; `navalStrength.js:36-41`; `corruptionWeb.js:558`; `settlementLifecycleFirstClass.js:62-65`; `upswingKernel.js:141`; `conditionPromotion.js:122-123`; `districtProfile.js:328-331`; `neighbourGenerator.js:135-141` (its own private 11-key PROSPERITY_RANK map). Unrelated ladders that do not denominate money: district wealth 6 bands (`districtProfile.js:40`, `spatialSubstrate.js:80`, labels `qualitativeBands.js:79-86`, schema `settlement.schema.js:1575`); autonomy signal registry mirror (`autonomy/signalRegistry.js:78`).

**B3. The prosperity BAND-STEP debit machinery — this IS the money system.** The ruling verbatim at `generosityEV.js:116-128` (PURCHASE: "payment = a prosperity BAND-STEP debit on the buyer + a bounded, non-zero-sum seller income nudge (the sim's existing prosperity vocabulary — NO conserved-coin primitive; simplicity-over-fidelity)"; constants PURCHASE_AFFORD_FLOOR 0.25, PURCHASE_NEED_FLOOR 0.4, PURCHASE_MAX_BANDSTEP 1.0, PURCHASE_SELLER_INCOME_SHARE 0.4). Applicator `generosityUpdates.js:121-149` (rank → clamp → step, written back in kind). Caller `generosityKernel.js:1369-1376` (after the food pass so grain and price compose); buyer rank at `:835`. Why a payment is often invisible (`generosityUpdates.js:113-116`): "the ladder is coarse, a single sale's sub-band nudge often rounds to no change" — the denomination is ~1/6 of the world's total wealth range. Ledger registration `generosityEV.js:869` (conservationExact: true, live: true).

**B4. `treasury` — flavour prose only, confirmed.** Repo-wide grep in `src/domain`: every hit a string/comment/metaphor; no field, no accessor, no writer. Faction flavour (`factionRelationshipUpdate.js:253,274,536,542,621` — "War levies and requisitions drain the treasury"); government flavour (`rulingPower.js:181` — "the racket is the treasury"); **peace-term prose `peaceTermsDrafting.js:87` — "A tribute stream — N% of the treasury for Y years" for a term that actually moves grain-months**; appraisal belief-channel label (`peaceTermsAppraisal.js:213`); metaphors in `magicForms.js:9,60,62,69,215`, `magicBufferModel.js:88`, `magicBufferApply.js:126`, `militaryStrength.js:250`, `coup.js:119`, `rulingPowerCoup.js:141,174`, `strategicPosture.js:244`, `warHomeCosts.js:546`, `warReceiptPools.js:634-637`, `eventProse.js:996-999`, `stressorDynamics.js:844`, `defenseGenerator.js:297`, `economicState.js:348`.

## CENSUS C — TRIBUTE / EXTRACTION FLOWS

**C1. `vassal_extraction` — a CONDITION STAMP and relationship-scalar nudges; nothing material moves.** The rule at `relationshipRulesCore.js:597-604` (condition archetype 'vassal_extraction', severity `clamp01(0.28 + leverage*0.32 + dependency*0.18)`, affectedSystems trade_connectivity/public_legitimacy/faction_power/defense_readiness); candidate `vassal_tribute_extraction` at `:614-641` (probability `0.14 + leverage*0.18`; payload = five clamp01 scalar nudges: resentment +0.035, dependency +0.025, leverage +0.025, tradeBalance −0.025, pactStrength +0.015; trajectory 'extractive'). **Unit/denomination: NONE. The overlord's patch gains nothing** — the reasons text (`:620-623`) says "The overlord benefits structurally" but no field on the overlord moves: extraction without a receiver. Roles via `relationshipRoles(edge, relState)` (`:589`). Downstream reads of the stamp: `activeConditions.js:91-98` (defaultSeverity 0.55, expiry 6 ticks); `pressureModel.js:34-39` (TRADE_ARCHETYPES — "tribute drains wealth (it is NOT war…)"); `populationDynamics.js:89,99`; `archetypeCatalog.js:34`; `traditionsKernel.js:171`; `demographicsRates.js:296`; promotion from the `occupied` stressor `conditionPromotion.js:35,45`; conquest stamp `applyWorldPulse.js:169-187`; never-applied faction deltas `factionRelationshipUpdate.js:291-306`; herald lane 'trade' `heraldRouting.js:165`.

**C2. The peace-engine STREAM terms — the ONE flow with a conserved denomination, and it is GRAIN.** Declaration `peaceTermsCatalog.js:160-169` (tribute baseMag 0.25 / reparations 0.4 / restitution 0.35 / resource_share 0.5 — all `stream: true, executor: 'transfer'`), plus `temple_restitution` (`:245`) and `settlement_provision` (`:254`) on identical physics — **six** stream terms total. Executor-type vocabulary across the catalog (`:160-321`): transfer, overlay, readiness_cap, war_block, occupation_hold, seam, grant — only `transfer` moves matter. Accumulators declared `:144`. The executor chain: `pulseKernel.js:2625-2629` (simulateCampaignWorldPulse, applied via `applyPulseMover` `:2636-2639`; stage manifest `pulseStageManifest.js:142,146-149`) → `dispositionChannels.js:62-63` (`advanceTreatiesWithDisposition`) → `peaceTerms.js:305` (`advanceTreaties`) → `peaceTerms.js:723-733` (`computeTreatyGrainDraw` per stream term) → `treatyTransfer.js` → `foodStockpile.computeSackFoodTransfer` → `generosityUpdates.applyFoodDeltasToUpdates`. Unit: storage-months of granary stock, per-population — never coin (`peaceTerms.js:710-733`; accumulators `:736-737`). Tuning `treatyTransfer.js:53-64` (RESERVE_MONTHS 1.5; CAPTURE 0.6 — the channel is a sink). Installment arithmetic `treatyEnforcement.js:334-355` ("A term's magnitude is its NOMINAL YEARLY share (§11's vocabulary: '25% of the treasury')… divided across the year's ticks"). **The design-vs-engine gap, recorded** — `treatyTransfer.js:10-13`: "DESIGN_PEACE_ENGINE §11's prose says 'coin', the engine has none"; the drafting UI still says treasury (`peaceTermsDrafting.js:87`).

**C3. Hegemony/suzerain — NO separate tribute flow.** `hegemony.js` (274 lines) is a pure read over existing tie types (`:57`); counts ties, picks `dominantType` defaulting 'tribute' (`:229`), phrase table `:63`. No unit, no transfer, no writer.

**C4. `tradeWar` stakes — a graph CHANNEL, denominated in edge strength 0..1.** What is won: the primary `trade_dependency` channel edge into buyer C for commodity K, minted at `tradeWar.js:574-585` (`winnerStrength = clamp01(0.55 + scoreFor*0.35)`); the defeated incumbent's channel demoted to `winnerStrength − 0.2` (`:599-606`). Score: `supplyCompleteness × economicStrength × standing` (`:11`). Carriers `:81` (trade_dependency, trade_route, export_market). Disposition deltas `{outcome: 'win'|'loss', magnitude: 1}` (`:564-572`). Conditions: `trade_realignment` (`:620-631`), `vassal_trade_coercion` (`:459-460`) routed through the same trade pressure lever (`pressureModel.js:39`) so `vassal_rebellion` stays reachable. Anti-thrash `lastFlipTick` in `worldState.tradeWarState` (`:27-30,472-493`).

**C5. Other extraction denominations found:** razing plunder — `razing.js:272-275` (PLUNDER_SHARE 0.6), `razingSpoils()` `:816-841` returns `{plunder, tributePerYear, nothingLeft, receipt}`; unit is `movableWealth × PLUNDER_SHARE × livingShare`, and `movableWealth` is fed the non-existent `economicState.wealthIndex` (`warDeployment.js:763`) so the path is inert today; `tributePerYear` hardcoded 0 on both branches (`:825,836`) — "ash pays none"; `compareSpoils()` `:852-855`. War sack/forage — `computeSackTransfer` (`warDeployment.js:782+`). Envoy ransom — `envoyRansomStage.js`, `ransomClaim.js`; prose at `NpcLifecycleControls.jsx:208`, `roadsProse.js:140,234` speaks of a treasury that does not exist.

**Census one-liners:** A — government form is free-text with no closed vocabulary and no normalizer; four writers mint it, ~8 consumers regex it; the only real enum (`RULING_POWERS`, 6 values) is derived-on-read, never persisted; neighbours carry a ninth disjoint vocabulary. B — nothing in the estate is money: faction wealth is an unapplied delta stream parked on `_timePressure`; settlement wealth is a 7-band string ladder whose smallest transactable unit is one-sixth of the world's wealth range; `treasury` is prose in ~30 places and a field in zero; `wealthIndex` is read once and written never. C — `vassal_extraction` moves five clamp01 scalars and credits its beneficiary nothing; the six peace STREAM terms are the only conserved flow, denominated in granary storage-months; hegemony is a read; tradeWar's prize is a graph edge.

# APPENDIX B — the FMG economy recon (lane report, condensed with all receipts; upstream clone at `scratchpad/fmg-study/fmg-upstream`)

**Framing correction:** upstream is NOT economy-free — `v1.124.0 — Economy` (2026-06-17) and `1.125.0 — Economy charts` ship a full goods → recipes → markets → deals → tax → treasury stack (`fmg-wiki/Changelog.md:44,48`). The static-snapshot shape is a deliberate, documented constraint: "Ticking / recurring production. Economy stays frozen at a single post-generation cycle" (`docs/prd/state-taxes-and-treasury.md:24`).

**B.1 Economy-adjacent fields.** Burg (`src/generators/burgs-generator.ts:38-41`): `population` (one-shot, `population-generator.ts:68-72`), `production` (one-shot records, overwritten each run, `production-generator.ts:58`), `product` (one-shot flow = `max(0, phaseRevenue − ingredientCosts)`, `:56`), `treasury` (**persisted stock that is never reset** — see B.2), `market` (topology). State (`states-generator.ts:42-58`): `cells/area/burgs/rural/urban` zeroed and recomputed by `collectStatistics()` (`:437-454`); `salesTax`/`pollTax` (`:56-57`) one-shot rates; `treasury` (`:58`) spelled as a stock, behaves as a derived score; `alert` (`:55`) military modifier (`:221`). Market (`markets-generator.ts:16-22`): `goods: {stock, price}` — stock genuinely conserved within a cycle (buy `:374`, sell `:386`, inter-market moves `:533-534`) but wiped between cycles (`production-generator.ts:23`). UI scores (`controllers/burgs-overview.ts:82-103`): "Wealth" = product/population with a unit inconsistency (Population column scales by `populationRate*urbanization` `:79`, Wealth divides by unscaled `b.population` `:95`).

**B.2 The treasury/tax mechanic.** Rates one-shot at state-form assignment: `rate = rn(gauss(base, base*0.15, base*0.5, base*1.5, 4), 2)` (`states-generator.ts:812-824`); bases by form (`:72-78`): Monarchy 0.15/0.20, Theocracy 0.25/0.10, Union 0.07/0.13, Republic 0.05/0.15, Anarchy 0/0 (sales/poll). Collection `States.collectTaxes()` (`:853-883`): resets every non-neutral `state.treasury = 0` (`:858`), sums `deal.tax` into the seller's state (`:861-876`), adds `pollTax × (rural+urban)` (`:878-882`). Runs exactly once as pipeline step `taxes` after `production` (`generation-pipeline.ts:41,:89`), re-runnable via `Production.regenerate()` (`production-generator.ts:25`). **It does not advance over time** — a recompute-from-scratch snapshot ("The economy is otherwise frozen — there are no recurring ticks, no spending, no compounding", `docs/domain/taxes.md:3`). Structural leaks: (i) money not conserved — burg sales credit with no counterparty debit (`production-generator.ts:55`), buys debit into the void (`:198,:401`), poll tax "the money simply appears" (`docs/domain/taxes.md:16`); (ii) `burg.treasury` never resets while `state.treasury` always does — no initializer exists; every Regenerate Production click (`components/tools.ts:174-177`) monotonically inflates burg treasuries (writers only at `production-generator.ts:55,198,401` + migration `services/io/auto-update.ts:1198,1205`); (iii) turn-order dependence — burgs processed by ascending population (`production-generator.ts:42-44`) so small burgs move prices (`applyMarketPressure` `:375`) for everyone after; (iv) editor overrides silently destroyed — `states-editor.ts:894-911` hand-writes `state.treasury`, the next `collectTaxes()` discards it; their PRD admits it (`docs/prd/state-taxes-and-treasury.md:142`).

**B.3 Military funding link: none.** Grep of `military-generator.ts` for treasury/tax/deal/market/goods/cost/upkeep/gold: zero matches. Regiments priced purely from demography and politics (`military-generator.ts:265,285-286,323,342-343`; `alert` `:221`; regiment size `3 × populationRate` `:370`). The `military` demand category (`goods-generator.ts:40,46`, weight 0.08 of population) is civilian consumption of military-tagged goods, never reconciled against regiments; `military` runs after `taxes` (`generation-pipeline.ts:42`) and reads nothing from it. Upkeep explicitly out of scope (`docs/prd/state-taxes-and-treasury.md:159`, `docs/domain/taxes.md:53`).

**B.4 Roadmap: planned-but-unstarted.** "The map is static. Over-time simulation is planned, but not yet implemented" (`fmg-wiki/Knowledge Base.md:409`); "It's a single calculated cycle, not a running simulation" (`:645`); out-of-scope/future list (`docs/prd/state-taxes-and-treasury.md:156-162`, restated `docs/domain/taxes.md:50-55`): Regenerate Production action; **Spending** (corruption, administration cost, military upkeep); **Recurring economy ticks** — yearly cycle, accumulating treasury, population growth feedback; form modifiers; import tariffs. "Not a computationally expensive realistic ticking simulation, but it produces a plausible web of who makes what, who buys it, and who gets rich" (`docs/updates/v1.124.0/…Economy.md:21`); "no carried-over inventory between runs" (`docs/domain/production_schema.md:8`).

**B.5 Verdict (the lane's, kept whole).** The shape: a single-pass, recompute-from-scratch equilibrium sketch — real structure (recipes, worker allocation, Laplace-smoothed pricing `markets-generator.ts:219-220`, price pressure, profit-gated arbitrage with distance friction and exporter tax as drag `:486`) collapsed into one pass whose output is a plausible tableau, not a state you can step; the tell is `collectTaxes()` opening with `treasury = 0`. They chose legibility and determinism over dynamics and were honest about it. Failure modes inherited: no conservation; stock/flow naming collision (`burg.treasury` vs `state.treasury`, opposite lifecycles — a live bug); order artifacts masquerading as outcomes; dangling political economy (form-based rates with nothing spending, military fully decoupled); editor overrides destroyed. What a tick-advanced engine must avoid copying: a `treasury` field that is a derived score; unclosed money loops (conjured money compounds without bound once you iterate); implicit ordering; sources without sinks. **Most reusable idea: `deal.tax` recorded on the transaction (`markets-generator.ts:33`) so collection never re-derives rates — the one pattern that survives ticking.** Most useful artifact: their PRD's non-goals list (`docs/prd/state-taxes-and-treasury.md:22-26,156-162`) — it names precisely the mechanics a tick-advanced treasury must have and they deliberately declined.

---

# W-COIN AMENDMENT A1 — the panel's findings folded (2026-08-29, panel wf_162c3f10-2a9; lens reports in the session record and §735.1). A1 OUTRANKS THE BODY. All rulings chair-made, vetoable.

**A1.1 The transfer primitive tells the truth about its parent.** `computeCoinTransfer` adopts grain's ACTUAL clauses: a `COIN_RESERVE` floor with all-or-nothing default (a payer at/under reserve delivers nothing, receipted as shortfall), and the null-both-legs guard when EITHER party lacks an opened record (nothing half-executes; no fabricated vault). The body's "payer floors at 0" is struck. The clause-for-clause claim is restated as verified inheritance of: single writer · single applicator · reserve floor · all-or-nothing · null-on-absent · capture ≤ 1 · integer floor-rounding sink-biased.
**A1.2 The coffers key is a NEW mechanism, priced as one.** Conditional sixth component (denominator 5→6) with its own pin; the observed-after threshold applies to BOTH reads (home-front derives `tick − openedTick ≥ COVERAGE_OBSERVED_AFTER`); the "existing independently-optional discipline" citation is struck.
**A1.3 The coin-first/grain-remainder draw is STRUCK — no exchange rate exists or may be smuggled.** W-COIN-3 ships two PARALLEL typed legs: a coin fraction of the vault and a grain fraction of the granary, separate unit-declared term accumulators (`extractedCoin` beside the storage-month rows — never mixed units in one field), and a combined compliance read (a payer honest on either leg is not a defaulter). The binary fallback stands for coinless courts.
**A1.4 Stage-order is law, not luck:** "every coin-delta emitter runs at a pulse stage after settlement_clock" is stated and tested; W-COIN-3's occupation transfer names its stage home at charter.
**A1.5 Flows close:** `transferredIn` = post-clamp applied credit (transfer sinks receipted by the out/in asymmetry); the deployment-mint-cost sink is ASSIGNED to W-COIN-2 with a flows field, or does not exist.
**A1.6 Multi-door flags per the advanceEpochEnabled precedent:** each strict read door carries a per-door necessity rationale in the list entry.
**A1.7 Regen truth-telling:** re-open-empty STANDS, and §7.2/Q6 are rewritten — the granary regens to a generated NONZERO stock, so the treasury is deliberately MORE conservative than its precedent; the regen coin-wipe is an accepted, documented loss (deferral written down).
**A1.8 Imports arrive coinless:** the treasury key joins the importScrub strip; pinned in the import dormancy suite. No foreign balance ever ghosts in.
**A1.9 The owner sees all six W-COIN-3 flows:** Q4 is widened to enumerate tribute/reparations re-denomination · occupation extraction · vassal→overlord · coalition reimbursement · razing sack · ransom (added to the roster per A1.15) by name.
**A1.10 DM edits are a typed flow:** any future edit surface routes a receipted `dm_grant` kind through the applicator — never an ordinary settlement edit.
**A1.11 The DIES table gains row 4:** the lifecycle-conservation burden (regen/undo/import must now conserve a ledger) is accepted knowingly.
**A1.12 ONE governing resolution law, and coups matter:** W-COIN-1 exports the single resolver (`governingFactionOf` + `factionArchetype`) and every read uses it — shared with W-SEAT. And per the owner's §735/§736 politics: `transferRulingPower` STAMPS the winner's archetype onto the seat at transfer — a declared future-tick shift, owner-visible (vetoable) — so a coup genuinely retypes taxation. The silent-category-forever behavior is recorded as the superseded alternative.
**A1.13 The razing cure is a VAULT SACK:** input renamed `vaultCoin`; Q8 discloses that plunder becomes crown coin only and town movable wealth stays opinion-owned and unlootable (recorded residue).
**A1.14 Occupied and besieged are ruled IN CAR 1:** occupied ⇒ taxation yields ZERO into the own vault with a typed `suspended_by_occupation` receipt until W-COIN-3's outward transfer exists (no wrong-direction lived coin, ever); siege ⇒ ALL forms suspended (matching the generator's committed sentence). Both feed W-SEAT's occupied-economics spec.
**A1.15 The civic boundary is a CLOSED INSTRUMENT ROSTER** with the default "not on the roster ⇒ coinless until owner-rowed"; ransom joins the deferral list explicitly.
**A1.16 One applicator, price-follows-band:** the stock's only opinion write is the legitimacy price through its one applicator; a capacity-stopped tick still emits the band's price; no prosperity delta ever carries a treasury cause; §11.1's answer restated — the capacity stop is the mint's only stock read, and it damps.
**A1.17 Realm display membership = the hegemony sphere,** legend-noted where relationship-vassal flows cross the boundary, with a source-scan assertion that no engine module imports the aggregator.
**A1.18 W-COIN-2 pays its news bill:** the authoring-census baseline, herald lane rows, kind pools, headline/voice contracts are enumerated in its charter and the car re-prices M.
**A1.19 Estate corrections:** fieldManifest home is `tests/joins/`; the certification row ships writer-door sites at car 1 and is AMENDED by car 2 (subsystemRowsVirtual extended then); the raw-byte dormancy arm must NOT import `normalizeForDormancy` (secondary structural arm only).
**A1.20 Sequencing:** ST-2 (goods unification) lands BEFORE W-COIN-1; DW-0 is told `economicState.treasury` exists.
**A1.21 Lighting is owned (new Q10):** who lights `treasuryEnabled` and the launch posture are the owner's; INTERIM LAW — the flag is not lit on any owner-presented surface before W-COIN-2's tip (recorded in the certification row). The minimal band chip (`empty|…|overflowing`) moves INTO W-COIN-2 so a lit world is never glance-blind; relief/construction sinks split out of W-COIN-4 into an engine sub-car (raw-byte bar), leaving W-COIN-4 purely view-plane.
**A1.22 The observation window is a HARNESS,** not the soak: a lit fixture run of N ticks inside W-COIN-2's act with a terminal fork (dispatch W-COIN-3 pre-soak, or owner-row the deferral) — the A1.8 WEAVE precedent.
**A1.23 The mandate reading is ratified by row (new Q11):** "taxation typed by government form" is read as RULING_POWERS-derived-from-governing-archetype (the free-text field is unusable as a type key); the owner ratifies or redirects.
**A1.24 Car split honesty:** W-COIN-1 splits into 1a (stock + flag + lifecycle) and 1b (taxation + profiles + prices); the shortfall fixture is unit-level in 1a and joins the pulse fixture in car 2. Per-car dormancy-bar lines are mandatory throughout.
