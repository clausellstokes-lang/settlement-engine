---
name: ""
metadata: 
  node_type: memory
  type: project
  date: 2026-07-21
  tags: 
    - w5
    - samples
    - sampleSettlements
    - narrative-parity
    - marketing
    - seed-hunt
    - fork
    - closure
  status: shipped
  branch: claude/w5-samples-real
  base: composite-r4 @ 1e92a1d3
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-21T18:25:53.001Z
---

# W5 — the three sample settlements are REAL generations (card prose matched to seed-hunted truth)

Owner order 707b7d5a (batch-4 marketing doctrine): Mossgate / Black Crag / Thornwell in
`src/data/sampleSettlements.js` must be REAL outputs of `generateSettlementPipeline`, seed-hunted
so the generated FACTS carry each card's bones, then the teasers rewritten to the generated truth
(narrative-parity applied to marketing). Opus generated; Fable authored the matching prose.

## What shipped (winning seed + config per card — QUOTE THESE FOREVER)
- **Mossgate** seed `mossgate-004`, town/coastal/port/heartland, culture germanic, customName pinned,
  priorities mil35/rel70/econ68/crim30/mag25. Generates gov "Church Council" + conflict
  `["The Clergy Alliance","The Civic Authority"]` over market licensing → the council↔temple rift;
  Merchant Guilds #2 power = "the merchant guilds profit from the silence." Coastal trade robust.
- **Black Crag** seed `blackcrag-016`, city/mountain/crossroads/frontier, culture germanic, customName pinned,
  mil60/rel35/econ78/crim45/**mag12**. **OPTION B**: `nearbyResourcesRandom:false` +
  `nearbyResources:[iron_deposits,coal_deposits,stone_quarry,mountain_timber,alpine_pasture,crossroads_position]`
  + `nearbyResourcesState:{iron_deposits:'depleted'}`. Generates gov "Merchant City Council" (economy-top guild rule),
  import "Iron ore (local mines exhausted)", smelter starved of ore.
- **Thornwell** seed `thornwell-034`, village/forest/**isolated**/**plagued**, culture germanic, customName pinned,
  mil60/rel45/econ30/crim20/mag35. Generates gov "Elected Reeve", Hunter's lodge + Citizen militia + Palisade +
  a "Woodcutter" NPC = the woodward/self-reliant/locks-twice bones; plagued = the monster-pressure tier.

## ⚠️ THE decisive hazard — per-user fork suffix erodes SEED-DRIVEN bones
`forkSeedFor` suffixes the recorded seed with the userId (`blackcrag-016-<userid>`), so each fork is a
DIFFERENT generation. Measured retention across 12 suffixed forks:
- CONFIG-driven bones survive (Mossgate coastal 12/12, clergy+civic structural 9/12; Thornwell iso+threat+woodward 12/12).
- SEED-driven bones do NOT: Black Crag iron-present-AND-depleted survived only **2/12** (iron is a 2-of-N terrain
  roll AND depletion is a chance roll). → Fix = **Option B** (pin iron depleted via the real four-state resource
  picker dial): retention 2/12 → **12/12**, deterministic, honest. Owner/Fable RATIFIED Option B on the
  fork-honesty argument. **If any future card's central promise is a specific resource/depletion, pin it — do not
  trust the random roll to survive the fork suffix.**

## Other rulings + facts (all owner/Fable RATIFIED this pass)
- **customName pin** = YES. Real wizard dial (ConfigurationPanel.jsx:254). ⚠️ NOT rng-neutral — setting it
  short-circuits generateSettlementName and SHIFTS all downstream draws (verified: NPC secrets differ). So the
  hunt was run ON the customName-set config. Forking "Black Crag" now yields a town named Black Crag.
- **culture:germanic pin** = YES (coherent English/Germanic names).
- **Thornwell 034 not 036**: the "Beast & Raider Threat" stressor and being defended are MUTUALLY EXCLUSIVE
  (the stressor models a village LOSING — monster-def→0, readiness→Undefended). No seed in 80 had both. 034 =
  self-reliant + woodward (implicit threat via plagued tier); 036 = explicit wolves but Undefended/legit-crisis
  (breaks the "Self-reliant" chip). 036 noted as a future founding-world candidate.
- Bones the engine CANNOT literally carry (prose moved, per the "prose→generation, never reverse" rule):
  lakeside→harbour (coastal=sea); harbour-master→merchant guilds (no such NPC role at town tier);
  guild-of-master-smiths→guild-masters (rule is the MERCHANT guild council; Craft Guilds are junior);
  woodward→hunter's lodge (no woodward role — Hunter's lodge + Woodcutter NPC are the substance).
- Residual: Black Crag still exports a mage-market ("Spellcasting", "Magical item market") even at mag=low —
  ACCEPTED, prose doesn't foreground it (do not rescan).

## Contract + how to reproduce
- Config shape preserved; `sampleSettlements.test.js` pins settType===tier, valid terrain/threat enums, flat
  priority numbers, seed.length>8, no `sliders`/`nearbyTerrain`. New keys (culture/customName/resource-pinning)
  are allowed (not forbidden). Both fork paths normalize identically (FoundingWorlds `normalizeConfig` ==
  Library `settlements/helpers.migrateConfig` == 2-field fill: magicExists + nearbyResourcesState default).
- Headless repro: `generateSettlementPipeline({...normalizeConfig(sample.config), _*Toggles:{}}, null, {seed: sample.config.seed, customContent:{}})`.
- No test pins the teaser STRINGS; `landingClaimsParity.test.js` binds `landing.js` copy, NOT these teasers (ran green, untouched).

## Gate (all GREEN)
Focused suites (sampleSettlements/foundingWorlds/settlementsPanel.smoke/landingClaimsParity) 19/19 · determinism
×2 identical (Mossgate 4155/Church Council, Black Crag 18911/Merchant City Council, Thornwell 642/Elected Reeve) ·
tsc 0 · eslint 0-new · domain-strict 0 (ceiling 0) · NUL 0 · full build (⚠️ `npm run build` = prebuild
generate-sitemap + vite build + **postbuild prerender-routes** — bare `vite build` fails 4 tests/build prerender
+ canonical checks; run all three) + VERIFY_DIST tests/build 220/220 (closure ≤ CLOSURE_BUDGET_BYTES 1_040_000;
sampleSettlements is LAZY so Δ=0).
