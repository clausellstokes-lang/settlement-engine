# SIGNED CONSTANTS — the tuning surface's walking sheet

**Compiled §647 (2026-08-25). One row per constant the register program has pinned.
Three statuses: CHAIR-SIGNED (under §585/§604 — vetoable, and re-signable by the owner
at the tuning pass, which is LAST by the ruled tail order) · OWNER-SIGNED ·
UNMINTED-PENDING (named, awaiting its measure or source). Maintained at every
signature — a signing that skips this sheet is incomplete (the §110.3 spirit: the
table IS the declaration).**

## Op ceilings (primitives, per tier) — CHAIR-SIGNED §628 + §635.2
| tier | ceiling | note |
|---|---|---|
| thorp | 1,000 | pre-program value, holds; tightest headroom in the corpus (32) |
| hamlet | 1,400 | §628 |
| village | 2,000 | §628 |
| town | 9,300 | §628 |
| city | **10,100** | §635.2 raise (measured 10,008 at reconciled bands) |
| metropolis | 14,200 | §628 |

## Byte ceilings (SVG bytes, per tier) — CHAIR-SIGNED §641.4; BYTES is the primary ratchet unit (§635.3)
| tier | ceiling | tier-setter |
|---|---|---|
| thorp | 130,000 | thorp/parchment |
| hamlet | 150,000 | hamlet/watercolor |
| village | 190,000 | mountain/watercolor |
| town | 560,000 | polycentric/parchment |
| city | 680,000 | migration/watercolor (tightest, 0.52 %) |
| metropolis | 830,000 | metropolis/watercolor |

U = 10,000 bytes. ⛔ THE COUPLING LAW: an op-ceiling raise owes a byte re-measure in
the same act — GENERALIZED §648.3: a NEW ARM owes one too (the town tier-setter moved
polycentric→crossing, margin 4,638→1,859 B, under a standing ceiling). ⛔ Mint from the ARMED arm only. Pin `Buffer.byteLength`, never
`.length`; the ratchet renders the six lenses, never reads the artifact directory.
At town+ the byte gate binds FIRST (that is what BYTES-primary means — §641.4 signed
deliberately). No time gate (wall-clock spread is noise, §635.3).

## Register bands and floors — CHAIR-SIGNED
| constant | value | source |
|---|---|---|
| B13 market-furniture band (per void, per rung) | hamlet 0 · village 1–3 · town 3–7 · city 4–9 (secondary at village band) · metropolis 5–12 (secondary at town band) | §629.1 |
| V-B13 vocabulary | stall-row · cross · conduit/well · pillory/stocks · weigh-beam · trough · pound · pond · specimen tree (closed) | §629.1 |
| V-QUAY band (per drawn quay) | 2–5 | §636.2 |
| V-QUAY vocabulary | bollard row · hoist/crane · pier-deck edge · stacked goods (closed) | §636.2 |
| L-REG-30 floor | F-C = 6 × INK.detail · AREA_ASPECT 1.6 · CLAMP_MARGIN 1.001 | §632.2 |
| L-REG-31 bridge-angle band | ±15° of the local normal (provisional; measured refinement allowed) | §635.5 |
| Bridge corridor half-length | C = 3 × median block dimension (sweep-proven insensitive) | §641.2 / J-REG5-BR-1 |
| Bridge conformance predicate | excess = crossed ÷ shortest: conforming ≤ 1.086 · defect ≥ 1.302 | §641.5 |
| River profile: `taper` | 0.34 (accumulation amplitude; profile READ from the heightfield, never hash-minted) | §648.2 |
| River profile: `pinch` | 0.22 (confined-valley narrowing; deliberately under `taper` so a narrows is a local event) | §648.2 |
| Bridge kink budget | 75° (refuses only a road doubling back — J-BR-7; 35° inverted the law) | §648.2 |
| Countryside coverage band (village tier) | 85 % ± 10 points | A2.2 (chair's number, vetoable) |
| Silhouette blind-read target | ≥ 75 % passFraction, decoy-FP as validity gate | §622.2 |
| Trajectory THIN band | < 3 % of applicable seeds per shape | REG-T charter (chair) |
| Siege standoff (weights grade) | camps ≥ ~400 m · fortified works 250–400 m · saps < 200 m | §642.2 / R-MORPH §6 (one-site caveat) |

## UNMINTED-PENDING (named so nothing silently defaults)
| constant | blocked on | home |
|---|---|---|
| L-REG-33 acres-per-capita (subsistence tiers) | fetched-CONFIRMED source or owner signature (Elton anchor is the candidate) | REG-H |

| Intramural saturation threshold | REG-GROW-A's measure | REG-GROW |
| T2 trajectory-curve parameters | REG-GROW-A mint; OWNER signs at the tuning pass (a §643.2 constrained interpolant, never an author) | REG-GROW / tuning |
| Terracing gradient figures | R-MORPH §4 internally inconsistent — left unminted by the dossier's own flag | REG-TERR |
| In-town slope-response band | REG-TERR's measure | REG-TERR |
| Wear thresholds (rampart funding × age) | tuning-pass input (§341 family) | owner, LAST |
| Mosaic share bands (meadow/pasture/waste per tier) | R-MORPH §1 consumption + REG-H's measure | REG-H |
| Ring-census age-monotonicity tolerance | REG-GROW-B's measure | REG-GROW |

## OWNER-SIGNED (standing, untouched by this program)
The dwellings bands B0–B21 and the POWERS schema (law/SIGNED-BANDS-2026-08-23.md) ·
THE PROMISE and every constitutional law above this sheet. The TUNING SIGNATURE
itself is the owner's and is LAST — this sheet exists so that pass walks one page.
