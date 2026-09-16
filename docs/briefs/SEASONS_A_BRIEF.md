# SEASONS-A Implementer Brief — the aspatial food year (granary rhythm + seasonal texture)

Opus 4.8 ultracode implementer, Phase 5.5 wave SEASONS-A, /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; the manager (Fable) reviews + commits. BINDING:
docs/PHASE55_SPATIAL_ENGINE_DESIGN.md §4i (round 19 — read it in full; the owner's food-year intent
is verbatim there). DEPENDS ON: CL-0 (the domain-module tri-state seam) — verify CL-0's committed
shape before wiring the flag.

## THE CONSTITUTIONAL LAW
`seasonsEnabled` is a CL-0-style domain module, DEFAULT OFF ⇒ byte-identical to today (the
absent/off path adds no fields, no rng draws, no reads — the dormancy-oracle discipline). The
Living Realm + Full Simulation presets turn it ON (coordinate with the committed CL-0 preset
definitions). Goldens byte-identical with the flag off; a NEW seasons-on golden fixture pins the
on-path.

## Items

1. **The season clock** — a pure function in the calendar home (worldState.js owns the calendar
   law): `seasonForTick(tick) → { season: spring|summer|fall|winter, weekOfSeason, year }` off the
   13-week quarters (spring wks 1-13, summer 14-26, fall 27-39, winter 40-52). No state, no rng.

2. **Renewable resource cycling** (owner verbatim): renewable natural resources — animals/hunting,
   fisheries, farming — cycle ABUNDANT → winter TEMPORARILY DEPLETED → spring REPLENISH-to-abundant.
   Implement as a seasonal MODIFIER on food/resource production reads (find the production seams:
   populationDynamics food-pressure inputs + foodStockpile inflow + the resource/economy reads that
   feed them — verify the exact seams first; the modifier applies where production is CONSUMED, not
   by mutating generation state). BIOME AMPLITUDE: severity scales by the settlement's biome/terrain
   (tundra/mountain harsh, temperate standard, coastal milder) — read from existing config
   terrain/biome enums; keep the table small and documented.

3. **The granary rhythm** (owner verbatim): the EXISTING foodStockpile becomes the granary LEVEL —
   REFILLS through summer/fall (harvest surplus flows in), DRAWS DOWN through winter (depleted
   production forces stockpile consumption). CAPACITY derives from tier + granary-relevant
   institutions + prosperity (a derived ceiling — verify what institution kinds exist to key on;
   do NOT add an authored capacity field). The LATE-WINTER HUNGRY GAP must emerge from the
   arithmetic: a settlement entering winter with a weak harvest hits food-deficit conditions in
   late winter — driving the EXISTING deficit/famine machinery (no new famine system; the season
   feeds the machinery that exists).

4. **Inter-annual variance** (§4i, architect): rare SEEDED severity draws per (year, region/
   settlement): hard winter (depletion multiplier), drought (summer/fall replenishment partially
   fails), bountiful harvest (surplus bonus). Fork `season:${year}:${settlementId or regionKey}`
   off the pulse rng at the kernel confluence — bounded bands (document them), no tails that
   starve a healthy town to death in one year (the granary must be ABLE to absorb one bad year;
   two bad years is a crisis — tune to that shape and document the constants).

5. **Seasonal texture** (cheap reads off the clock — display/news, NOT new mechanics):
   - wizardNews: season-aware entries where they already emit (a fall entry mentioning harvest,
     a late-winter deficit entry mentioning stores running low) — extend EXISTING templates,
     do not add new event kinds beyond ONE: a `hungry_gap` / `harvest` seasonal marker entry at
     season boundaries when seasonsEnabled (significance: notable; major only when the granary
     math is actually dire).
   - lean-winter crime: a small seasonal term on the EXISTING crime-pressure input (verify seam;
     bounded, documented).
   - spring founding: the W-C3 founding lane gains a seasonal weight (spring/summer favored) —
     a multiplier on existing candidate scoring, not a gate.

6. **Dossier/read-model surface**: the settlement dossier's food/economy read shows the seasonal
   state legibly (current season, granary level vs capacity band, "stores will last until ~X"
   when in drawdown — derived, DM-speakable). Keep it in the existing food-security read-model's
   idiom; lazy surfaces only.

## Fence + gates
src/domain/worldPulse/** (the season clock, production modifiers, granary arithmetic, variance
draws — smallest possible touch per seam), the food-security/dossier read-model file(s), wizardNews
template extensions ONLY where entries already emit, the CL-0 preset definitions (adding
seasonsEnabled), tests + one new seasons-on golden fixture. NO git add/commit/stash.
Gates: full battery; goldens byte-identical FLAG-OFF (constitutional); the new flag-ON golden
deterministic across two runs; a 3-year flag-on mini-soak in the test (granary rises fall, falls
winter, hungry-gap deficit fires on a weak-harvest fixture, recovery in spring); verify:dist
(budget 1,441,000 — domain code is not first-paint; confirm unmoved). Report: the seams you found
+ modified, the constants table (amplitudes/bands), soak evidence of the annual curve, every gate.
