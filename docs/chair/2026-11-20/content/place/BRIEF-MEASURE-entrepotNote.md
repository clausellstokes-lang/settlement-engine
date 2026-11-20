# PLACE-1 MEASURE brief 6 — `economicState.activeChains[].entrepotNote` (the chain cards' entrepôt note)

Written by PLACE-1, `date -u` at writing: 2026-11-20T16:05Z. Read `BRIEF-MEASURE-COMMON.md` beside this file FIRST and WHOLE: it says how; this says what.
Your output: `docs/chair/2026-11-20/content/place/entrepotNote-MEASURE.md` and `docs/chair/2026-11-20/content/place/tools/entrepotNote/`.

The before at 100 places a size (the chair's census, unmodified, at 43ab0f5eb; top sentence's places / holders): `tools/census/fields-before-100.txt`.

## Where to start
- The text lives in `src/data/supplyChainData.js` (the chains' `entrepotNote` fields, one fixed string per chain) and is copied onto the record by `src/generators/computeActiveChains.js` (`entrepotNote: chain.entrepotNote || null`). The chair measured one sentence in 40 of 44 cities ("Luxury goods are the primary cargo of long-distance trade. Entrepôt cities profit en…"): measure per CHAIN and per place (a place holds several chains: 5.4 a city).
- The note is a fact about a CHAIN in an entrepôt; the place's own version can name its route (`tradeRouteOf`), its transit goods (`economicState.transit`) and the chain's own outputs. Several wordings a chain, keyed by seed + field + chain id.
- Say whether `supplyChainData.js` should keep the canonical note (index 0) and the new pool live in a new data file keyed by chain id (the pool census's preference), and where the pick happens (`computeActiveChains.js`).
