# DESIGN — NUMERIC PRICES (round-21 Wave 7, the highest-value budget-free backlog item)
## Fable 5 architecture, 2026-07-14 — implementation-ready; Opus implements when a lane frees

## 0. Thesis + the ruling that binds it
Surface believable in-world PRICES derived from the live economy — without touching it.
GENERATION IS SACRED (the M6d ruling, verbatim precedent): prices are a LAZY DISPLAY READ-MODEL
over `economicState` + the M6a commodity bands + M6d flow drift, read-only, zero engine feedback
(prices never feed sim math — endogeneity law), zero persistence, zero eager bytes (the
newsVoice/settlementRumors chunk pattern). No numeric prices exist in the engine BY DESIGN
(M6a froze that); this module is the fiction layer those bands always intended.

## 1. The derivation (deterministic, rng-free)
`src/domain/display/marketPrices.js`, pure:
1. BASE PRICE per good: derived (never authored) from the existing goodsCatalog fields —
   tier/rarity/bulk class map to a coppers-per-unit base via a small named table
   (BASE_PRICE_BY_CLASS, documented constants). Goods missing a class fall back by category;
   a walker test asserts every catalog good resolves.
2. SCARCITY MULTIPLIER from the M6a band (absent ⇒ adequate): shortage ×1.8, adequate ×1.0,
   surplus ×0.7 (named constants; band MONOTONICITY is the load-bearing property and gets a pin:
   shortage > adequate > surplus for every good, always).
3. LOCAL COLOR: ±10% deterministic jitter via fnv1a32(`${settlementId}:${good}`) — the newsVoice
   idiom, NO rng, so the same market always quotes the same price for the same world-state.
4. DRIFT NUDGE (optional read): M6d's flowDerivedDependency qualitative drift shades the quote
   one step (±5%) when present — absent ⇒ nothing (dormancy shape).
5. FORMATTER: period voice, coarse coins — "four silver the bushel", "a copper the loaf" —
   via a denominate() that picks copper/silver/gold bands and vulgar-fraction words. The register
   rule: prices READ as a market crier, never as a spreadsheet; the raw number is a title/tooltip.

## 2. Surface
`MarketPricesSection` rendered in EconomicsTab BESIDE the M6d LiveTradeFlowSection (additive,
lazy — the exact M6d wiring pattern; zero new props if saveId is already threaded, which it is).
Shows: the settlement's primary exports (at their band-priced quotes), notable imports, and one
"dear/cheap this season" line sourced from the strongest band deviation. PDF: v2 (a later
economics-chapter row through the live-layer parity lane — note in PDF_PARITY_AUDIT).

## 3. Boundaries + tests
No engine file changes; no worldState reads outside documented read-models; free/anon see prices
(no DM truth involved — bands are player-visible economy); INERT-NOT-CRASH on absent ledgers
(aspatial worlds price from generation-time bands only). Pins: purity (no rng/clock), determinism
(same inputs ⇒ same quotes), band monotonicity, catalog totality (every good prices), register
guard (no bare decimals in rendered copy), dormancy (aspatial ⇒ generation-band prices, no crash),
byte-inertness (goldens + closure unchanged — all lazy).

## 4. Effort + sequencing
One Opus wave (~module + section + 6-8 pins). Chips into any free lane after W5; no dependency
on the golden merge (bands exist on both branches).
