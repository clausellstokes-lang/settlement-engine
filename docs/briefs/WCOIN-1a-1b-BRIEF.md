# W-COIN-1a / W-COIN-1b — OPUS DISPATCH BRIEF (pre-staged; drafted by lane R5, 2026-08-29)

**DO NOT DISPATCH until Q10 AND Q11 land** (DESIGN_W_COIN A1.21 lighting ownership; A1.23 mandate-reading ratification). This brief exists so that the instant both land, implementation dispatches same-hour with zero re-derivation. If either lands as a REDIRECT rather than a ratification, this brief is void above the affected sections and returns to the chair.

**Authority chain:** owner grant A3 (ODQ §731.1 — Q-W8 GRANTED, ruling f3cf639e no-conserved-coin REVERSED by owner order) → design volume `git show 171237b70:docs/DESIGN_W_COIN.md` (W-COIN-0, STATUS COMPLETE) → **AMENDMENT A1 (panel wf_162c3f10-2a9) OUTRANKS THE BODY** — where this brief and the body disagree, A1 rows cited here are the law. Car split per A1.24: W-COIN-1 = **1a (stock + flag + lifecycle)** then **1b (taxation + profiles + prices)**.

**Seat:** OPUS (builds → Opus per the §447 seat model; §685 seat law — chair-commit.sh REFUSES a commit with no seat trailer, and an Opus commit must enrol its queue row in the SAME act). Engine-wave slot, pre-soak, STRIP-independent. **Sequencing gate (A1.20): ST-2 (goods unification) must be LANDED before W-COIN-1a dispatches — verify at dispatch, STOP if absent. DW-0 is told `economicState.treasury` exists.**

**Receipts baseline:** every file:line below re-verified against build tip `1a2471990` on 2026-08-29 (design's own receipts were against `73f5dfc02`; nothing cited here moved). Re-run the consumer censuses at dispatch anyway (program law §1.7) — the tip will have advanced.

---

## 0 · Lane mechanics (non-negotiable, from program law + memory)

- Worktree lane; link the worktree's OWN `node_modules`; OUTLAST the gate in your own turn; capture every exit status yourself (a sibling's `pkill -f` returns your workers as SKIPS); checkpoint every 30 min; `resume-state.sh` → hand-note → ledger commit after every act. Briefs FORBID `git stash`. Never `git add -A`/`-u`/`.`.
- ⚠⚠ A pre-commit `eslint --fix` RE-STAGES, so `git diff HEAD` is blind — re-prove AT the committed tip. The OSR gate cannot pass pre-commit — prove DETACHED. ANY `package.json` byte change is a MINT TRIGGER — these cars must not touch it.
- Seal from the worktree HEAD, never from a receipt tail (a resume block can name a superseded sibling sha).
- State which greens are DISCOVERY and which are REGRESSION in every landing act (§711.4 sibling law).

---

# CAR W-COIN-1a — THE STOCK + FLAG + LIFECYCLE

**Effort M (1a's share of §10's W-COIN-1 M). Bar: raw-byte dormancy. Zero new entropy draws (assert in landing act).**

## 1a.1 · File targets

| # | file | action | content |
|---|------|--------|---------|
| 1 | `src/domain/worldPulse/treasury.js` | **NEW** lazy leaf | `advanceTreasury(settlement, {interval, tick, deployment, stressors, lit})` — the ONE pulse writer; `computeCoinTransfer` — the ONE transfer primitive (§1a.2); `applyCoinDeltasToUpdates(updates, updateIndex, coinDeltas)` — the ONE applicator (shape of `generosityUpdates.js:46-70`: clamp to derived capacity, integer, reference-identity when nothing moved); accessors `coinOf(settlement)` / `treasuryCapacity(settlement)`; frozen `TREASURY_TUNING` (every constant commented **tuning-signature-adjacent** — provisional values, owner signs at the endgame tuning pass) |
| 2 | `src/domain/worldPulse/simulationRules.js` | edit | `treasuryEnabled` entry in `ENGINE_GATED_VIRTUAL_RULE_KEYS` (`:185`; the `pactFormationEnabled` precedent at `:279`) with the joining comment. **A1.6: multi-door — each strict `=== true` read door carries a per-door necessity rationale in the list entry.** In 1a there is exactly ONE door: the writer (`advanceTreasury`). Verified absent at tip: zero `treasuryEnabled` hits in `src/` |
| 3 | `src/domain/certification/subsystemRowsVirtual.js` | edit | certification row: writer-door sites listed **at car 1** (A1.19 — the row is AMENDED by car 2 when the warCosts/coalitionExpenditure read doors join); carries the A1.21 INTERIM LAW verbatim: *the flag is not lit on any owner-presented surface before W-COIN-2's tip* |
| 4 | `src/domain/worldPulse/pulseKernel.js` | edit | ONE call site in the `@pulse-stage: settlement_clock` per-settlement loop, beside `advanceFoodStockpile` (call at `:521`). **A1.4 stage-order law: "every coin-delta emitter runs at a pulse stage after settlement_clock" — stated in the leaf header AND tested** |
| 5 | `src/domain/fieldManifest.js` | edit | FROZEN_VS_LIVE row `{path: 'economicState.treasury.coin', field: 'coin', mode: 'live', pulseWriter: 'src/domain/worldPulse/treasury.js#advanceTreasury', displayRule: <declares the unit>}` — the `economicState.foodSecurity.storageMonths` row at `:73-78` is the template |
| 6 | `src/domain/settlement.schema.js` | edit | `treasury?:` joins the `SimEconomicState` typedef (`:626-648`) — typed record, **unit declared in the typedef**: absolute integer state-coin, NEVER per-capita, NEVER months/bands at rest |
| 7 | `src/lib/importScrub.js` | edit | **A1.8: the treasury key joins the strip** (destructure-drop idiom at `:32`) — imports arrive coinless; no foreign balance ever ghosts in |
| 8 | `src/domain/rulingPower.js` (or the resolver's chosen home) | edit | **A1.12 part 2:** `transferRulingPower` STAMPS the winner's archetype onto the seat at transfer — a DECLARED future-tick shift, owner-visible/vetoable, named in the landing act; the silent-category-forever behavior recorded as the superseded alternative |
| 9 | resolver export (home: `treasury.js` or beside `rulingPowerFromArchetype`) | **NEW export** | **A1.12 part 1: ONE governing resolution law** — a single exported resolver composing `governingFactionOf` (`src/domain/rulingPower.js`) + `factionArchetype` (`src/domain/factionArchetypes.js:103`) + `rulingPowerFromArchetype` (`src/domain/spatial/cohesionWeave.js:194`, over frozen `RULING_POWERS` at `:133`). EVERY W-COIN read uses it; it is shared with W-SEAT. No governing faction, or archetype off-map (`outsider`/`other`) ⇒ `'mixed'` — fail-neutral, never throw, never silent-skip (receipt says which) |

**The record (created only by the writer, never by generators):**
```js
// settlement.economicState.treasury — ABSENT until the first lit tick.
{ coin: 0,            // UNIT: absolute integer state-coin (declared here, in the manifest displayRule, and read only via accessors)
  openedTick: N,      // the no-backfill witness
  lastTick: N,        // the granary's lastTick idiom
  flows: { taxed, upkeep, transferredIn, transferredOut, shortfall } }  // LAST-TICK integers ONLY — no history array, ever (save-size law)
```
Capacity is DERIVED each call (`treasuryCapacity`), never persisted — the `storageCapacityMonths` idiom (`foodStockpile.js:185-195`); tier base × fiscal-institution multipliers via the `hasInst` family `economicState.js:141-153` already uses.

## 1a.2 · The transfer primitive — grain's TRUE clauses (A1.1; the body's "payer floors at 0" is STRUCK)

`computeCoinTransfer({payer, payee, amount, captureFraction, committedDebit, committedCredit})` inherits, verified clause by clause against `treatyTransfer.js`:

1. **`COIN_RESERVE` floor with ALL-OR-NOTHING default** — a payer at/under reserve delivers NOTHING, receipted as shortfall (the `RESERVE_MONTHS: 1.5` precedent, `treatyTransfer.js:51-61,107-108`).
2. **NULL-ON-ABSENT, both legs** — when EITHER party lacks an opened treasury record the primitive returns null and nothing half-executes; no fabricated vault.
3. **Capture ≤ 1** — the road/graft sink; the remainder is destroyed, receipted by the out/in asymmetry (A1.5: `transferredIn` = post-clamp applied credit).
4. **Integer floor-rounding, sink-biased** — both legs floor; `credited ≤ debited × capture` always (the `computeSackFoodTransfer` direction law, `foodStockpile.js:514-537`).
5. **Same-tick composition** — `committedDebit`/`committedCredit` so a second draw sees the vault the first left behind (`treatyTransfer.js:89-117`).
6. **Single writer · single applicator** — the primitive is pure; only `advanceTreasury` writes in-tick state, only `applyCoinDeltasToUpdates` applies cross-settlement deltas. NO caller ships in 1a (first callers are W-COIN-3's; the primitive lands fully unit-tested and dormant).

**NEVER:** negative coin (unpayable cost ⇒ typed shortfall receipt — debt is owner-gated, out of scope); coin from RNG; coin written outside the writer+applicator pair; any exchange rate between coin and grain (A1.3 — no smuggling; the coin-first/grain-remainder draw is struck from car 3's future too).

## 1a.3 · Lifecycle (every path; the §7.2 table as amended)

| path | law |
|---|---|
| create | NEVER at generation — generators, worldPlan, worldCode, fingerprints ALL untouched. First lit tick: writer mints `{coin: 0, openedTick: tick}` + `treasury_opened` receipt. Zero-open = the no-backfill law: no fabricated balance, every coin forever traceable to a receipted mint |
| read | accessors ONLY — no consumer hand-reads the raw field |
| persist | rides `settlement.economicState` through settlementUpdates exactly as `foodSecurity`; ABSENT key on every dark save |
| regen | **A1.7: re-open-empty STANDS as a deliberately MORE conservative law than the precedent** — the granary regens to a generated NONZERO stock; the treasury regen coin-wipe is an accepted, documented loss (deferral written down in the landing act). Writer re-opens empty at the next lit tick, fresh `treasury_opened`, `openedTick > regen tick`. **Execute the granary regen experiment inside this car** (regen a lived settlement with lit non-generation `storageMonths`, diff `foodSecurity` before/after) and state the observed law in the landing act — it is the premise A1.7 rests on |
| undo/restore | rides the settlement snapshot wholesale; asserted by an undo round-trip test |
| import/legacy | absent key ⇒ dark until next lit tick; malformed ⇒ fail-inert (the `asObject`/finite-guard idiom, `warCosts.js:91-95`); **A1.8: imported configs scrubbed coinless — pinned in the import dormancy suite** |
| clone/gallery | plain JSON, survives structured clone; a lit-world record imported into a dark campaign is never read or written (strict gate) — dormancy suite pins it |
| DM edit | NONE in W-COIN. A1.10 recorded for the future: any edit surface routes a receipted `dm_grant` kind through the applicator — never an ordinary settlement edit |

## 1a.4 · Occupied / besieged — ruled in car 1 (A1.14)

The writer-door machinery lands in 1a; 1b's mint runs under it:

- **occupied** ⇒ taxation yields ZERO into the own vault, with a typed `suspended_by_occupation` receipt, until W-COIN-3's outward transfer exists. **No wrong-direction lived coin, ever.**
- **besieged** ⇒ ALL forms suspended — matching the generator's committed sentence (markets closed, `prosperity.js:62`; occupation revenue-outward prose at `prosperity.js:66-71`).
- Both rules feed W-SEAT's occupied-economics spec. 1a tests assert the receipts fire at the writer door; 1b extends the assertions against the real mint.

## 1a.5 · Test homes + census bills (1a)

**NEW files (exactly two — batch their landing, price the bills in THIS charter, not at the gate):**

| file | content |
|---|---|
| `tests/domain/treasury.test.js` | transfer-primitive clause tests (reserve/all-or-nothing, null-on-absent both legs, capture sink, integer floor direction, committed composition); applicator clamp + reference-identity; accessors; resolver (incl. no-faction ⇒ `'mixed'`, off-map ⇒ `'mixed'`); occupied/besieged writer-door receipts; **unit-level shortfall fixture (A1.24 — the pulse-fixture join is car 2's)**; the conservation property test (§1a.6); the cross-consumer unit assertion (every consumer's expectation stated against the same fixture — §711.6, four sightings in memory); stage-order assertion (A1.4) |
| `tests/domain/treasuryDormancy.byteIdentity.test.js` | the raw-byte bar (§1a.7). `byteIdentity` basename is deliberate — it avoids the `*Golden*` mutation-manifest bill; DO NOT rename. Family precedents at tip: `brokerageDormancy` / `religionDormancy` / `seasonsDormancy` / `rumorDormancy` / `spatialDormancy` / `tempoGovernorDormancy`.byteIdentity.test.js |

**EXTENDED files:** `tests/joins/fieldManifest.test.js` (**A1.19 correction — the §10 roster's `tests/domain/fieldManifest.test.js` DOES NOT EXIST; the home is `tests/joins/`, confirmed at tip**) · `tests/lib/importScrub.test.js` (the strip pin) · `tests/lint/engineGatedRuleKeys.walker.test.js` proves flag membership both ways (cited from `simulationRules.js`) · `tests/property/mechanismLitCoverage.test.js` lit credit — requires a LITERAL `treasuryEnabled: true` drive in a test (the credit is not a text trick) · `tests/domain/subsystemRowsVirtual.test.js` if row counts are pinned.

**THE CENSUS BILL (memory law: a new test file reds THREE censuses; two apply here):**
1. `tests/lint/sovereigntyLightingContract.walker.test.js` — `TEST_FILES.length` is an exact `.toBe()` pin. **Re-derive the lighting census WHOLE — all five figures, never patching `files` — in the SAME COMMIT that adds the files.** Two new files ⇒ ONE re-derivation covering both (land them in one window; sequential re-derivations cost a full suite run each and invalidate each other).
2. `tests/lint/negativeAssertionAnchor.walker.test.js` — every new test file starts at **ceiling 0**: anchor every negative assertion (`// anchored:` on the comment block's LAST line, never inline).
3. mutationCoverageManifest TOTALITY — does NOT fire here: `tests/domain/` is not one of the seven enforcer dirs and the `byteIdentity` basename dodges the invariant-nomenclature trigger. Keep both facts true.

## 1a.6 · The conservation property test (spec)

Fixture world with concurrent flows: two payers → one payee in the same tick (committed-composition path) · a capacity-edge payee · a reserve-edge payer (shortfall) · an absent-record party (null legs). Per tick assert **exact integer equality, `.toBe`, no epsilon**:

```
Δ(Σ coin over all settlements) === Σ mints − Σ sinks
```

with sinks enumerated by kind: capture remainder (destroyed on the road), capacity clamp at the applicator (and the writer stops mints at capacity so the clamp is a safety net, not a phantom mint-and-burn — A1.16's capacity-stop is the mint's ONLY stock read). In 1a there is no mint, so the fixture drives the primitive + applicator directly and the equality reduces to `Δ = −sinks`; **1b extends the same test with the taxation mint term** rather than writing a second property. Integer arithmetic makes this exact by construction — the §713.3 float-associativity incident (1 leaf in 29 moved) is the reason coin is integer.

## 1a.7 · Dormancy bar (raw-byte; the honest comparator)

Per §713.2 — **a dormancy claim is a bit claim, and a dormancy instrument can pass by comparing NOTHING**. The comparator is **base-dormant vs tip-dormant**: the same seeded world advanced N ticks at the pre-W-COIN base and at the 1a tip, flag absent, serialized bytes EQUAL — never a diff over stale artifacts. Plus flag-absent ≡ flag-false equivalence (the `=== true` strictness), plus the import-scrub pin, plus the gallery-clone dark pin. **A1.19: the raw-byte arm must NOT import `normalizeForDormancy`** (secondary structural arm only — normalization would launder the very bytes the bar exists to compare; `normalizeForDormancy` imports exist at tip in `beliefMapKernel.byteIdentity`/`occupation`/`pantheon`/`religionDormancy` tests — do not copy that pattern into the PRIMARY arm).

## 1a.8 · Declared shifts (program law §1.9)

- Dark path: NONE — byte-identical, no golden re-records.
- The `transferRulingPower` archetype stamp (A1.12) is a DECLARED future-tick shift on lit AND dark worlds' seat records — name it in the landing act as owner-vetoable. (It changes what a coup writes, not what any lived tick meant.)
- Lit on a lived world: treasury opens at future ticks only; zero lived-history edits. Lit on new worlds: generation identical by construction; divergence only at tick ≥ 1 state.

## 1a.9 · STOP conditions (1a)

1. Q10/Q11 not landed, or landed as redirects ⇒ do not dispatch / halt and return to chair.
2. ST-2 not landed at dispatch (A1.20) ⇒ STOP.
3. The dormancy comparator cannot reach bit-identical ⇒ STOP. Never weaken to a normalized compare; never diff artifacts.
4. Anything requires a second writer, a second applicator, a coin↔grain exchange rate (A1.3), negative coin, or a new entropy draw ⇒ STOP — these are design violations, not judgment calls.
5. The granary regen experiment contradicts A1.7's premise (granary does NOT regen to a nonzero stock) ⇒ record the observation, re-argue re-open-empty in the landing act; if re-open-empty no longer stands on its own, STOP and owner-row it (Q6 territory).
6. The consumer census at dispatch (§1.7) finds a consumer already reading `economicState.treasury` or `treasuryEnabled` ⇒ STOP (a sibling landed first; re-sync from tip).
7. Flag cannot be delivered in ONE commit with all six pieces (key + door + certification row + lit credit + dormancy proof + walker) ⇒ STOP; the one-commit idiom is the law, not a preference.

---

# CAR W-COIN-1b — TAXATION (dispatches only after 1a is SEALED at tip)

**Effort: 1b's share of §10's M. Bar: raw-byte dormancy (its own line — A1.24 makes per-car dormancy-bar lines mandatory). Zero new entropy draws.**

## 1b.1 · File targets

| # | file | action | content |
|---|------|--------|---------|
| 1 | `src/domain/worldPulse/treasury.js` | edit | the taxation mint inside `advanceTreasury` (the writer's only mint kind); `TAX_FORMS`; `TAX_RATE_BANDS`; the 6×8 profile table; the label→form mapping table; band multipliers + prosperity scalars + baseYield-per-tier into `TREASURY_TUNING` |
| 2 | `src/domain/worldPulse/generosityUpdates.js` | READ-ONLY reuse | the legitimacy price routes through the EXISTING `applyLegitimacyDeltasToUpdates` (`:80-107`) with a new typed cause — **no new applicator, no edit to the applicator itself** (bounded integer deltas, clamped [0,100]); canonical read-point stays `governanceLedger.js` (`:31-35`, neutral 50) |
| 3 | `src/domain/fieldManifest.js` | verify | the 1a row already covers `coin`; no new manifest row unless a new persisted field appears (it must not — `flows` is inside the record) |

## 1b.2 · TAX_FORMS — the closed vocabulary (8 forms; §5.2 verbatim)

`land_rents · market_tolls · port_customs · licensing · justice_fees · tithe_share · levy_extraction · misc_trade`

- Grounded in the `incomeSources` literal families `economicState.js` already mints (§3.1 enumerates every writer, `:57-518`); the mapping is a data table over those authored literals, matched at derive time; **unmatched → `misc_trade`** — the catchall that keeps the vocabulary CLOSED against open-vocabulary custom-content labels.
- **`isCriminal: true` rows are NEVER a tax base** — the generator's own sentence ("flows to criminal actors, not the public treasury", `economicState.js:348`) becomes an assertion.
- **Totality test:** a source scan over `economicState.js`'s pushed `source:` strings proves every literal the generator can emit maps (the fieldManifest walking-test idiom) — so the mapping cannot silently rot when a generator author adds a row.
- Dispatch-time census (program law §1.7 + §13 PLAUSIBLE row): confirm no module OUTSIDE `economicState.js` appends `incomeSources` rows post-generation. If one exists ⇒ STOP and report (the totality scan's denominator is wrong).

## 1b.3 · The profile: RULING_POWERS × TAX_FORMS (6×8), typed bands

- `TAX_RATE_BANDS = ['none','light','customary','heavy','extractive']` — closed, ordered, frozen.
- The 6×8 table (§5.3's illustrative shape is design flavor — **author real provisional values in this car**; they are tuning-signature-adjacent, owner signs at the tuning pass). Frozen data, walker-tested BOTH ways: every `RULING_POWERS` value has a row, no unknown row keys, every cell ∈ TAX_RATE_BANDS, **only coercive rows (`levy_extraction`, and `criminal`'s racket rows per §5.3) reach `extractive`** — an assertion, not a convention.
- The ruling-power key comes from **the 1a resolver ONLY** (A1.12/A1.23 as ratified by Q11): derived at tax time from the governing faction's archetype — NEVER the free-text `powerStructure.government` string, NEVER a ninth regex consumer (the free-text disease: four writers, no normalizer, consumers scoring zero on unmatched labels — APPENDIX A, CENSUS A). Coups retype taxation automatically via the A1.12 stamp; the normalization of the free-text field itself stays a DOCKET item (Q9), not this car.

## 1b.4 · The yield and its price (§5.4 + A1.16)

```
yield = Σ over forms f present(settlement):
          baseYield(tier) × formShare(f)             // mapped incomeSources percentages
          × bandMultiplier(profile[rulingPower][f])   // typed band via the 1a resolver
          × prosperityScalar(prosperityRank)          // opinion feeds the base, ONE-WAY
          × stressGate(f, stressors)                  // §1b.5
```
floored to integer coin, **capacity-stopped — and the capacity stop is the mint's ONLY stock read, and it damps** (A1.16; this is the §11.1 anti-loop answer: yield reads generation-frozen structure + prosperity opinion, never the stock — no tax→transfer→tax feedback can exist; the test asserts the mint's inputs).

**The legitimacy price (A1.16 — price-follows-band):** `heavy`/`extractive` bands on coercive forms emit bounded negative legitimacy deltas through the ONE existing applicator with a new typed cause. **A capacity-stopped tick STILL emits the band's price** — the crown that squeezes and cannot even bank the coin still pays the resentment. **No prosperity delta ever carries a treasury cause** — the stock's only opinion write is the legitimacy price, direction-of-read law (§4.4): opinions feed flows; the stock never writes an opinion except this one declared price.

**Receipts:** `flows.taxed` per tick; every flow entry records its **resolved band/amount at flow time** (the one FMG steal, §9: `deal.tax` recorded on the transaction) — history is never re-derived from current rates. No news beats in 1b — the news bill is priced into W-COIN-2's charter (A1.18); notable events land in `flows` and wait.

## 1b.5 · Stress gates (A1.14, honored against the generator's committed prose)

- **besieged** ⇒ ALL forms suspended (`prosperity.js:62` — markets closed; the §11.9 attack answered by matching the prose exactly).
- **occupied** ⇒ zero yield into the own vault + typed `suspended_by_occupation` receipt (until W-COIN-3's outward transfer exists — `prosperity.js:66-71` narrates revenue flowing outward; W-COIN must not mint it inward in the meantime).
- Route-gated forms (`port_customs`) and institution-gated forms (`licensing`, `tithe_share`) yield only where generation put the structure — `formShare` is zero where the settlement has no such incomeSources rows, by construction.

## 1b.6 · Test homes + census bills (1b)

**Default: EXTEND `tests/domain/treasury.test.js` — no new test file in 1b** (the census bill was priced once, in 1a's window). If file size forces a split, the new file re-triggers the FULL census bill (lighting re-derivation, all five figures, same commit + anchor ceiling 0) — price it in the act, and keep `Golden`/invariant nomenclature out of the basename.

Roster of 1b assertions:
1. Mapping totality (source scan over `economicState.js` `source:` literals; every literal maps; criminal rows excluded).
2. Profile walkers both ways (rows/keys/cells; extractive-only-on-coercive).
3. The conservation property test EXTENDED with the mint term (Δ = mints − sinks over the same fixture, now with taxation live).
4. Capacity stop: at-capacity settlement ⇒ zero mint, no phantom mint-and-burn, band price STILL emitted (A1.16, both halves).
5. Legitimacy price: bounded, integer, clamped, routed through `applyLegitimacyDeltasToUpdates` only; typed cause present; no prosperity write anywhere in the car (source scan).
6. Coup composition (§11.11): the writer reads the governing archetype under the freshest-state discipline (`treatyTransfer.js:139-156` precedent) — a coup and a tax tick in the same interval compose deterministically; test both orders.
7. No-governing-faction / off-map archetype ⇒ `'mixed'` profile row applied, receipt says which — never throw, never silent-skip.
8. Occupied/besieged: zero yield + the typed receipts (extending 1a's writer-door assertions against the real mint).
9. Cross-consumer unit assertion re-run with the mint live (§711.6 — hunt any consumer reading `coin` per-capita, as months, or as a band without the accessor).
10. Dormancy: 1b's OWN raw-byte line — base-dormant vs tip-dormant re-proved at the 1b tip (a green 1a line does not cover 1b's bytes).

## 1b.7 · Declared shifts (1b)

- Dark: NONE — raw-byte, no golden re-records.
- Lit on lived worlds: taxation begins at future ticks under the lit flag — DECLARED in the landing act (future-tick-only; zero lived-history edits; the A1.21 INTERIM LAW means no owner-presented surface is lit before W-COIN-2's tip regardless).

## 1b.8 · STOP conditions (1b)

1. 1a not sealed at tip ⇒ do not dispatch.
2. The mint reads the stock anywhere except the capacity stop ⇒ STOP (feedback loop — §11.1's exact attack).
3. Any generator-emitted `source:` literal escapes the mapping other than to `misc_trade`, or a non-`economicState.js` `incomeSources` writer surfaces ⇒ STOP, report the denominator break.
4. Any new applicator, any prosperity write with a treasury cause, any band expressed as a free float ⇒ STOP.
5. `extractive` reachable on a non-coercive row, or any profile cell outside TAX_RATE_BANDS ⇒ STOP (walker must make this structurally impossible first).
6. The free-text `government` string appears in any W-COIN read path ⇒ STOP (Q9 is docketed, not smuggled).
7. Q11's ratification (A1.23) redirected the mandate reading ⇒ this car's §1b.3 is void; return to chair.

---

## Shared closing obligations (both cars)

- Per-car landing act states: dormancy-bar line (mandatory, A1.24) · discovery-vs-regression split of greens · declared shifts · the entropy-zero assertion · deferrals written down (A1.7 regen loss; ransom/roster deferrals live in W-COIN-3's territory per A1.15 — do not touch).
- Owner-reporting law: remaining-arc table when an ITEM COMPLETES, not every commit.
- Memory: save the durable facts (the 1a resolver's home, the A1.14 receipt kinds, the census re-derivation sha) in the established format at seal.
- What these cars must NOT contain (§8 + A1): no debt/credit · no market/price model or household coin · no war gating on affordability · no realm entity/stock · no AI narration of flows · no coin leg on generosity instruments · no persisted per-tick history · no exchange rate · no DM edit surface · no news beats before car 2 · no display surface (the band chip moved INTO W-COIN-2 per A1.21; W-COIN-4 is view-plane only).
