# Tuning Bands (the proving bands for the soak)

The declared, PROPOSED target ranges the pre-launch soak proves the world against. For
each governing coupling, a soak band says where an OBSERVED metric should land for the
world to read as **alive but not thrashing**. The machine-readable source of truth is
`src/domain/tuning/proposedSoakBands.js`; this document is its human companion.

> **Every band is PROPOSED and soak-vetoable.** Nothing here is a ratified fact. A band
> is a hypothesis: the soak either confirms it (the dials land inside) or reveals a
> divergence (a proposal for the owner to retune a dial or move the band). No band ever
> auto-promotes itself out of `PROPOSED`.

---

## What a band is (and is not)

A band is a range on an **observed metric** during the soak, not a value for a constant.
The constant (the dial) is what *produces* the metric; the band is where the metric
should *land*. Example: the contest cadence dial `CHALLENGE_RATE` is `0.05`; the band is
on the *observed* rate of court successions per faction per decade (1.5 to 4.0). The dial
is tuned so the observed rate falls in the band.

Each entry names the governing dial(s) and quotes the design intent from the dial's own
tuning comment, so a reviewer vetoes a band against the design, not against a guess. Where
a coupling has no single dial (population flight is emergent), the entry names the nearest
governing constants and the structural bound (a cap or floor) the band sits under.

## How the soak uses them

`src/domain/tuning/proposedSoakBands.js` projects each band to a `weeklyTuningJob`
envelope (`{ metric, min, max }`) via `toEnvelopes()`. Feed those envelopes and the soak's
observed distributions to `runWeeklyTuningJob`, and each metric is diagnosed against its
band exactly as production rollups would be. A metric outside its band surfaces as a
ranked divergence in the health report.

**These dials are Lane-B forever.** Every dial named here lives in the seeded
generation / worldPulse pipeline, so every one is golden-shifting. The auto-tunable
registry (`autoTunableRegistry.js`) structurally forbids any of them from the auto-apply
lane. The tuning loop may *propose* a retune from a band divergence; it may **never**
auto-apply one. A band divergence is a note for the owner, not a lever the machine pulls.

## The bands

Ranges are the current PROPOSED values (see the manifest for the full rationale strings).

### Contest / court-succession cadence
| Metric | Band | Dial(s) | Current |
|---|---|---|---|
| Successions per faction per decade | 1.5 to 4.0 | `CHALLENGE_RATE`, `COOLDOWN_WEEKS`, `REALM_SUCCESSION_CAP` | `CHALLENGE_RATE` 0.05 |
| Live contested goals per settlement | 0.05 to 1.2 | `CONTESTS_PER_SETTLEMENT_CAP`, `DISCOVER_BASE` | cap 2 |

Intent: a succession per faction every few sim-years, neither stasis nor churn. The
2-year post-succession cooldown caps the ceiling; the anti-stasis floor keeps it above
zero. Contests are hard-capped at two live per settlement; a healthy world has occasional
rivalries, not a permanent brawl.

### Bond saturation
| Metric | Band | Dial(s) | Current |
|---|---|---|---|
| Share of live bonds at or near the full-mark cap | 0.05 to 0.40 | `BOND_MAX_SEV`, `BOND_MINT_SEV`, `BOND_HALF_LIFE_WEEKS` | cap 1.0 |

Intent: a bond mints half a mark, stacks additively, is clamped to a full mark, and fades
on a 3-year half-life. If most live bonds sit maxed, the mint is too generous or decay too
slow; if almost none approach the cap, bonds never deepen.

### Festival cadence and outcome
| Metric | Band | Dial(s) | Current |
|---|---|---|---|
| Festivals observed per settlement per year | 0.55 to 0.98 | `SKIP_PROSPERITY_RANK_MAX` | 0 (Subsistence cancels) |
| Share of festivals that score a triumph | 0.15 to 0.45 | `BASE`, `TRIUMPH_OFFSET` | `BASE` 0.55 |

Intent: a window opens once a year, but hard stressors and a desperate economy cancel it,
so a healthy world celebrates most years, below the once-a-year ceiling. Triumphs are a
real minority, not routine and not vanishing.

### Gratitude mint
| Metric | Band | Dial(s) | Current |
|---|---|---|---|
| Share of qualifying gifts that mint a lasting bond | 0.40 to 0.90 | `GRATITUDE_MITE`, `TIE_BIND` | `GRATITUDE_MITE` 1.0 |
| Mean severity of a freshly minted bond | 0.20 to 0.70 | `GRATITUDE_MITE`, `TIE_BIND` | `GRATITUDE_MITE` 1.0 |

Intent: gratitude scales with need relieved and the giver's sacrifice (the widow's-mite
rule), with a small lift through a named tie, clamped to a full mark. Most meaningful
gifts leave a mark; not every trivial transfer does. A mean near 1.0 means every gift is a
life-debt; near 0 means gratitude never accumulates.

### Occupation-flight
| Metric | Band | Governing | Current |
|---|---|---|---|
| Annual share of an occupied settlement's population that flees | 0.02 to 0.15 | occupation rate-press (emergent) + severe-flight cap 0.18 | emergent |

Intent: occupation presses the population rate down; crisis-flight is capped at 18 percent
per interval. The design law is rescuable, not annihilated, so a bounded but visible bleed
is right. The 18 percent per-interval cap is the hard structural ceiling this band sits
under; below 2 percent an occupied town does not visibly bleed.

### Coup-econ swing
| Metric | Band | Governing | Current |
|---|---|---|---|
| Coup-success swing between a prosperous and a hollowed seat | 0.05 to 0.25 | economic term `(score - 50) / 400` | plus or minus 0.125 |

Intent: the economic term shifts the incumbent's hold-chance by up to plus or minus 0.125
at the extremes. The observed coup-success difference between the richest and poorest seats
should approach but not exceed twice that span. A swing near 0 means prosperity does not
matter; the band keeps the economy load-bearing without deciding every coup.

## Vetoing or retuning a band

1. Edit the band in `src/domain/tuning/proposedSoakBands.js` (change `min`/`max`, or the
   rationale). The band stays `PROPOSED`.
2. `npm run validate:tuning-bands` (also in `npm run check`) schema-guards the edit.
3. If the soak shows a dial's observed metric is outside its band, that is a divergence:
   either retune the dial (a Lane-B change, owner-signed, may re-mint goldens) or move the
   band (if the band was the wrong target). Record which, and why.

## See also
- `src/domain/tuning/proposedSoakBands.js` — the machine-readable manifest (+ validators).
- `scripts/check-tuning-bands.mjs` — the schema gate (`validate:tuning-bands`).
- `src/domain/tuning/weeklyTuningJob.js` / `autoTunableRegistry.js` — the tuning loop these bands feed, and why they are Lane-B forever.
