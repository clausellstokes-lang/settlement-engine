---
name: ""
metadata: 
  node_type: memory
  title: W-DOCTRINE-1 SUPPLY-WEB WARFARE — built + full-gate-green (unstaged)
  date: 2026-07-15
  branch: review-fixes-2026-07-08
  base_hash: 3702b9d2
  status: "BUILT, gate-green, UNSTAGED (not committed per brief)"
  tags: 
    - phase55
    - w-doctrine
    - supply-web-warfare
    - peace-engine
    - dormancy
    - indirect-war
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

# W-DOCTRINE-1 — SUPPLY-WEB WARFARE (the indirect-war doctrine)

Built 2026-07-15 on review-fixes-2026-07-08 @ 3702b9d2 (Opus implementer). Full gate GREEN
(`npm run check` exit 0: 9287 vitest pass +1 skip, 113 build/verify:dist pass, tsc full+strict,
lint, first-paint budget held). ALL WORK UNSTAGED per brief (never added/committed/pushed/stashed;
foreign stash@{0} untouched).

## Why this matters
The owner's directive: war strategy must include the INDIRECT path — a weaker/informed actor
strikes a target's satellite suppliers to weaken it BEFORE the direct confrontation, TIME priced.
Authority doc: docs/DESIGN_SUPPLY_WEB_WARFARE.md.

## What landed (files)
- NEW `src/domain/worldPulse/supplyWebWarfare.js` — the whole doctrine (lazy kernel, 0 any-casts):
  the belief-gated WEB READ (`readSupplyWeb`), the INSTRUMENT catalog (`INSTRUMENTS` raid/occupy/
  interdiction/embargo/toll_war/purchase_denial + `instrumentFit`/`chooseInstrument`), the
  DIRECT-vs-INDIRECT EV with the §3 time discount (`scoreCampaignEV`), the ATROCITY BRAKE
  (`atrocityBrakeFor` + `expectedBloodyShare`), the campaign-plan MOVER (`advanceSupplyWebWarfare`
  mint/re-score/abandon → `spatialLedgers.campaignPlans`), the peace feed read (`strangulationFelt01`),
  and the FORCEABLE VERBS (`orderSupplyRaid`/`declareTradeEmbargo` + `WEBWAR_VETO_PROSE`).
- MOD `pulseKernel.js` — static import (rides the lazy engine chunk, ZERO eager bytes) + a gated
  mover block BEFORE the moral-drift site; raid atrocities fold into the SINGLE existing
  advanceMoralDrift call (broadened guard `beliefsActive || webwarAtrocities.length` — byte-safe).
- MOD `peaceReasons.js` — `scoreEconomicStrangulation` gained `strangulation01` (byte-identical at 0);
  `advancePeaceReasons` reads `strangulationFelt01(worldState, partyId)` (the §5 economic_strangulation feed).
- NEW tests: `tests/domain/supplyWebWarfare.test.js` (19 pins) + `tests/property/supplyWebWarfareDormancyGolden.test.js`
  (dormancy golden + lit anti-vacuity) + `tests/fixtures/supply-web-warfare-dormancy-golden.json`.

## Constitutional facts (load-bearing)
- GATE = `warLayerEnabled === true && supplyWebWarfareEnabled === true`. `supplyWebWarfareEnabled`
  is a VIRTUAL flag (NO DEFAULT_SIMULATION_RULES entry — the peaceEngineEnabled idiom) ⇒ every
  existing golden byte-identical (all 108 property goldens still pass). JUDGMENT: chose the virtual
  sub-flag over the design §8 literal "no new top-level flag inside settlementStrategyEnabled +
  warLayerEnabled" — the byte-identity law (also §8) dominates; a bare composite gate would move any
  golden carrying both real flags. Documented vetoably in the kernel header.
- FIRST-PAINT closure UNCHANGED at 1,161,818 B (budget 1,161,902; margin 84 B) — the kernel is lazy
  (engine chunk absent from the entry static closure). ⚠️ do NOT ratchet mid-window; manager ratchets
  at window close.
- ⚠️ SUBSTRATE REALITY: the M2/M6a supply web (`deriveConsumingLinks`) EXCLUDES food
  (`NON_SHIPPED_CATEGORIES = {food, service, transport}` — foodStockpile owns food). So the doctrine
  strangles the NON-FOOD industrial-input web (iron/timber/coal that feed the town's army +
  institutions), NOT literal grain. The design's "granary/grain" language is metaphorical; receipt
  copy generalized to "stores/supply" accordingly.

## Deferrals (documented, clean boundaries — NOT gaps)
- enumerateMoves `weaken_first` softmax move: the mover's EV gate embodies the direct-vs-indirect
  choice; surfacing it as a DM-proposal strategy candidate is a follow-on.
- Physical raid execution (war_front mint, M4 flight, storageMonths debit): the strangulation ledger
  is the CONSERVED proxy (strangle → economic_strangulation → early suit); physical coupling deferred
  (generosity's "instruments beyond grain relief land with E1b" precedent).
- ⚠️ MANIFEST REGISTRATION of the forceable verbs is DEFERRED (JUDGMENT — diverges from the brief's
  "manifest entries are YOURS"): the affordanceCoverage walker HARD-ASSERTS scope==='settlement' and
  the exact 40/31/9 counts; realm/worldState verbs are its documented W-COMPOSER-2 deferral. The verbs
  ship in the EXACT registrable shape (pure gated worldState mutation + VETO_PROSE = coversVetoCodes
  feed) — the declareCasus/sueForPeaceOrder precedent — so W-COMPOSER-2 lifts them verbatim.
- Explicit §5 counterplay beyond emergent (the "they mean to starve us" belief nudge + counter-strangle
  symmetric doctrine): the mover already reads M2 failover as ADAPTATION → abandon, and relief keeping
  the town fed as the strangulation floor. Explicit wiring is a follow-on.
- The 30y SOAK (§9) — the tuning/soak pass (owner's endgame: NEXT AI does soaks + everything-on tuning).
- corruption_exposed war-reason feed is the INFORMATION-STATECRAFT sibling's hook (W-GUIDE), NOT this
  wave — clean boundary.
