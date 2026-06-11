# Cohesion Remediation Plan — unified fix program

> **Progress.** Wave 1 _(shipped, `6ee69e8`)_ — all ten sim-wiring fixes + 21 pin tests; verify instrumented the
> new famine feedback and proved it damped (gain < 1, fixed point ~0.61). Wave 2 _(shipped, `3da02f5`)_ — producers
> for all dead consequence trees + 19 tests; verify fold-ins (fishing-community match, removal-as-ceiling, impair
> dimension gate). Wave 3 _(committed `0482584`; push pending a parallel in-flight work stream)_ — four parallel
> slices: cascade resurrected, services precedence inverted (220→40 override rows), goods/dependency keys repaired,
> chains/resources/processors re-pointed + healing pattern extended; the `tests/joins/` harness (Wave 0) landed
> with 47+ join assertions across the four slices. Wave 4a/4b _(committed `113c1a6`/`f0e7dc3`)_ — roster
> integrity + ordering trio. **Side-stream wave (2026-06-11)** — coup d'état lifecycle (politics-gated stressor,
> verdicts, power transfers, APPLY_STRESSOR/CHANGE_RULING_POWER authoring + roaming-stressor bridge), magical
> transport vs blockades (channel-throughput-capped bypass, airship impairment stamping, planar gating), trade-goods
> subsumption (exact-alias-only merging; canonical-id display predicates), defense economic-upkeep gates with a LIVE
> per-tick disaster writeback (the readiness row finally moves), plus grounding-honesty fold-ins from Wave 6 #1
> (food self-sufficiency, stability-label, surplus-%, crimeTypes joins). Partially advances Wave 5 #3/#4 and
> Wave 6 #1; the world-pulse power-transfer write-back grazes Wave 7's owner-gated dossier write-back item.
> Waves 5–6 remainder next; Wave 7 awaits owner sign-off; Wave 8 (structural prevention —
> entity ids, frozen/live + producer/consumer manifests, crisis-triple sync) proposed below
> under the same sign-off gate.

**Sources.** Two comprehensive multi-agent audits, both persisted and verified against source:
- `docs/SIMULATION_LOGIC_AUDIT.md` — simulation side (causal substrate, world-pulse loop, capacities, corruption, conditions, display). 82 findings; cohesion verdict **7/10**.
- `docs/GENERATION_COHERENCE_AUDIT.md` — generation side + cross-domain mappings (institutions ↔ services ↔ goods ↔ chains ↔ resources, subsumption, magic-as-supplement, config→sim trace). 282 findings across 12 analysts; mapping-matrix verdict **5.5/10** (coverage near-exhaustive on paper; join cleanliness fails on unvalidated free-string matching at virtually every join).

**Diagnosis in one line.** The architecture is right (one substrate, conserved ledgers, receipts everywhere) — but the *same dead-read / vocabulary-mismatch / snapped-string-join bug class the ledger refactor killed in the substrate core* survives at every seam the refactor didn't reach: generation data tables, gen→sim adapters, and the loop's organic-condition routing. None of it throws; it quietly lies to the DM.

**Method (the proven groove).** Every wave = an independent increment: fix → focused tests (incl. join-harness assertions) → `npm run check` gate → adversarial verify for anything touching the soak-guarded substrate or generation distributions → deploy (`code-hardening:master`). Same cadence as the 30+ increments already shipped this session. Same-seed generation outputs WILL change where bugs suppressed content (cascade, subsumption, services) — that is the point; tests pinning buggy outputs get reconciled, the distribution/soak runaway guards must hold.

**Owner decisions honored throughout.** No craft/welfare/transport/labor ledgers. Magic-as-supplement is load-bearing and gets first-class repair (Wave 5). publicSafe denylist only grows. Migrations/edge functions deployed by owner.

---

## Wave 0 — Join-test harness (the enforcement layer)

The dominant failure class is *snapped string-joins between data tables* (`data.p` vs `baseChance`, `'Major port'` vs real names, Title-Case mismatches, dangling override targets). The cure that keeps them dead is a **build-time join-validation suite** (`tests/joins/`), mirroring how the ledger refactor used invariant tests:

- every supply chain has ≥1 resolvable processor at every tier ≥ its minTier
- every `RESOURCE_TO_CHAINS` ref resolves to a real `needKey.chainId`
- every `LOCALE_SERVICE_OVERRIDES` target exists in `INSTITUTION_SERVICES`
- every `TRADE_DEPENDENCY_NEEDS` / goods `requiredInstitution` key matches a catalog institution (case-exact)
- every condition archetype has ≥1 producer or is explicitly tagged DM-authored-only
- every `affectedSystems` entry is a real `SYSTEM_VARIABLE`

Built incrementally: Wave 0 lands the skeleton + assertions for currently-healthy joins (pinning them); each later fix lands **with** its assertion so fix + guard ship together. Initially-failing assertions for known-broken joins land in the same wave as their fix.

## Wave 1 — Simulation wiring: stop the quiet lies (all S-effort, mechanisms ground-truthed)

1. **Organic-condition misroute (the #1 defect).** Delete the hard-coded `affectedSystems: ['public_legitimacy','trade_connectivity']` at `candidateEvents.js:72`; `activeConditions.js:368-370` already falls back to the correct per-archetype catalog routing (famine→food_security+labor, plague→healing_capacity, crime→criminal_opportunity). Emergent famine finally lowers food security; receipts blame the right systems.
2. **Polarity-aware bands.** One chokepoint: `finalizeVariable` (`causalState.js:611`) bands the polarity-adjusted score for `lower_is_better` vars. High criminal_opportunity stops reading "Abundant". Pressure loop unaffected (reads scores, not bands).
3. **Prosperity vocabulary.** `deriveResilience` (`deriveSystemState.js:64-73`) maps the REAL tier list (`Struggling/Poor/Moderate/Comfortable/Prosperous/Wealthy` + `Subsistence`), graded; export one canonical tier list from `economicGenerator` (or `constants.js`) so it can't re-drift. Kills the dead `Modest` branch.
4. **DEFENSE_CONTRIB hole.** Add `'Lightly Defended': -2` (`factionDynamics.js:43`).
5. **Arcane-instability gate.** `threatProfile.js:302` — skip when `magicExists === false` or `scores.magical === 0` (low magical *defense* is not wild-magic *threat*).
6. **NPC archetype vocabulary.** `CATEGORY_TO_ARCHETYPE` (`npcProfile.js:32`) gains `crafts→craft`, `noble→government` (or `other` per template fit), `magic→arcane`; derive keys from the actually-emitted vocabulary.
7. **Dead threat literals.** Normalize legacy `embattled/high/low/safe` branches (`safetyProfile.js:234`, `powerGenerator.js:1855`, defaults in capacity/system-state) to canonical `heartland/frontier/plagued` via one shared helper.
8. **merchant_wealth orphan.** Retire the tag from the ~8 archetypes + emitters; their economic bite routes through `trade_connectivity` (already co-listed). Receipts become honest. (Alternative — adding a 15th variable — rejected: hard-sim noise for this audience.)
9. **cold_war_sanctions template.** Add catalog entry with `defaultExpiresAtTicks: 8`; `cold_war_thaw` clears it. Kills the lone immortal condition.
10. **Corruption soak case.** The documented runaway guard runs zero corruption iterations (fixture has `institutions: []`). Add a soak case with a criminal institution + corruptible NPCs; assert corrupt fraction + capture state stabilize below total capture.

*Verify:* gate + adversarial verify (this wave touches the pressure loop via #1 — soak is load-bearing). Reconcile any tests pinning the misrouted behavior.

## Wave 2 — Producers and events: the dead consequence trees

1. **EXPOSE_CORRUPTION promotes `corruption_exposed`** (`mutate.js:489-543` + `withActiveCondition`, mirroring `cutTradeRoute`). The scandal survives re-derivation; ruling_authority's only condition reaction comes alive.
2. **`food_anchor_lost` producer.** DAMAGE/REMOVE/IMPAIR of a food-anchor institution (granary/mill/harbor) promotes the condition (severity from institution weight). The richest dead consumer tree (capacity, causal, dailyLife, districts, threats) lights up.
3. **`siege_lifted` producer + STARTED_RIOT / REMOVED_THREAT / RECOVERED_RESOURCE mutate handlers.** All three registry entries currently hit the default no-op. REMOVED_THREAT of a siege promotes `siege_lifted` (recovery arc); RECOVERED_RESOURCE clears the depleted set that `deriveResourcePressure` reads.
4. **DEPLETE_RESOURCE writes real keys.** It currently writes a format nothing reads (`mutate.js:314-325`) — write underscore keys + `nearbyResourcesDepleted` so chains/exports/food actually respond; food math respects depletion (`foodGenerator.js:110-115`).

*Verify:* gate + event-pipeline tests per producer; condition-promotion suite extended.

## Wave 3 — Generation string-join hygiene (data-table repairs)

1. **Resurrect the cascade pass.** `cascadeGenerator.js:110` reads `data.p` — a field that exists nowhere; the entire chain-adjacent-institution mechanic has never fired, and the airship/docks override is trapped inside the dead guard. Fix to `baseChance`, hoist the override. (Same-seed rosters change — intended.)
2. **Services lookup precedence.** Exact per-institution key first; legacy `LOCALE_SERVICE_OVERRIDES` becomes fallback-only; delete shadowed rows + fix/delete the ~56 dangling targets (`servicesGenerator.js:806-898`, `servicesData.js`). Kills the most DM-visible absurdities (teleportation circle selling airship moorings; aqueduct as inn; apothecary selling poisons).
3. **'Defence services' bucket.** Stop classifying patrols under Criminal Services + exempt non-criminal providers from the crime-gate (a peaceful garrisoned town currently *drops* its defence service ~55% of the time **because** crime is low).
4. **TRADE_DEPENDENCY_NEEDS + goods casing.** Fix the 10 phantom dependency keys + 7 Title-Case-suppressed export goods (`economicData.js`, `tradeGoodsData.js`).
5. **RESOURCE_TO_CHAINS namespaces + orphaned terrain chains.** Fix 9 dangling need-group refs; register the ~28 orphaned desert/mountain/river specialty chains (oasis agriculture, alpine wool, camel caravans…) so terrain actually feeds chains.
6. **Chain processors re-point (civic/religious/healing).** Churches run the faith chain, courthouses run law, hospitals run the hospital chain; extend `HEALING_INSTITUTION_PATTERN` (healingLedger.js — the established canonical classifier) with `hospital|monastery|almshouse` so a hospital city stops reading "no dedicated healing institutions".
7. **settType vs resolved tier (the DEFAULT mode is broken).** Three gates consult raw `config.settType` (`'random'`/`'custom'`) where the resolved tier is needed (`institutionProbability.js:79,210-211,252-253,264`): a random-rolled thorp gets ~5× the intended arcane-institution odds (wizard towers in thorps), patron-government suppression misfires, and goods-toggle institution penalties are a complete no-op in the default mode. Flip the lookups to `config.tier` first (resolveConfig already writes it).

*Verify:* join-harness assertions per fix + distribution test + gate. Adversarial verify on #6 (healing feeds disease pressure). New unit: a `settType:'random'` seed resolving to thorp rejects high-magic institutions and honors a goods exclusion.

## Wave 4 — Roster integrity: subsumption, ports, faction boost, power seam

1. **Subsumption guards.** Never delete self/required/forced/custom institutions; kill the producer-eating rules (verified: zero breweries survive across 120 settlements; every city loses its required courthouses; cathedrals erase parish networks). `subsumptionPass.js:74-117`.
2. **Port economy end-to-end.** Remove the docks→warehouse UPGRADE_CHAIN pair + the harbour-master-subsumes-docks rule; fix `Port Duties` gating on phantom `'Major port'`; fix `hasPort`'s `'transPORT'` substring false positive (`priorityHelpers.js:49`). The flagship trade-route type works again.
3. **Faction-institution boost.** `factionCorrelation.js`: `def.baseChance` (rarity respected), resolve user toggles with the real key format (DM exclusions honored), and run the pass **before** `generateEconomy` so boosted institutions join chains/services/income.
4. **`powerStructure.governingName` written.** Seven sim consumers read it; nothing writes it — the central gen→sim power break. Write it in `powerGenerator`/`generatePower`; consume or delete `_neighbourGovBias`.
5. **Validator step order.** Move `checkStructuralValidity` after the last roster mutation (subsumption/cascade/isolation/factionCorrelation) so the DM's coherence receipt describes the real roster.
6. **Stress confirm pass (institution modifiers are dead).** `resolveStress` (step 3) rolls stress against an EMPTY institution list (institutions assemble at step 5), so every institution stress modifier is inert — walls never suppress siege (×0.6), granaries never suppress famine (×0.5), healers never suppress plague. Add a re-weight/confirm pass after `assembleInstitutions` (keep the early roll for config threading), so "walled towns get besieged less" is finally true.
7. **Stop derived state echoing into config (scoped fix).** `assembleSettlement` persists `effectiveConfig` — including DERIVED fields (resolved stressTypes, floored priorityMilitary, `priorityMagicEffective`-overwritten priorityMagic, `_magicTradeOnly`) — as `settlement.config`, and what-if edits feed it back as input: emergent stress becomes FORCED stress on every re-edit (with a false "selected by user config" receipt), a plague-era military floor outlives the threat. Scoped fix: strip the derived keys before re-feeding (`applyChange`/`resolveStress`). The full raw-config/effectiveConfig split is Wave 7.

*Verify:* golden-settlement smoke (seeded thorp→metropolis set asserting: port city has docks, breweries survive, courthouses exist, hospital city has healing, excluded institutions stay excluded) — these become permanent regression tests. Distribution + soak + gate + adversarial verify (heaviest roster changes in the program).

## Wave 5 — Gen→sim adapters + magic-as-supplement coherence

1. **Canonical status seam (single highest-value gen→sim repair).** `magically_sustained → 'substituted'`, `unexploited → 'blocked'` in `supplyChainState.js`'s LEGACY_TO_CANONICAL; carry `magicNote/upstreamNote` through. Today a druid-propped depleted chain scores as *fully healthy* and the purpose-built `substituted` status has no producer — magic-as-supplement becomes visible to sim, PDF, AI, and receipts.
2. **needKey seam.** `causalState.js:361` `'trade'→'trade_entrepot'`; fix NEED_HEURISTICS key drift (8 of 11 groups get generic beneficiaries/victims).
3. **Dead-magic leaks.** Gate the divine food tradition on religion (it currently fires in `magicExists=false` worlds: "Temple granaries blessed" in a no-magic campaign); `magicExists` guards in `magicProfile`, `deriveMagical` demand, `hasTeleportationInfra`.
4. **Stress→condition promotion vocabulary.** `mass_migration` + `insurgency`/`wartime`/`succession_void`/`politically_fractured` promote (exact-match archetypes already exist); fix `.label` vs `.name` reads.
5. **Condition severity dynamics + capacity trajectory.** `worsening/easing` status nudges severity per tick (ramp toward easing near expiry) instead of flat-then-cliff; derive capacity `trajectory` from worst contributing condition status instead of hard-coded `'stable'`.

*Verify:* gate + adversarial verify (#1 and #5 touch the soak-guarded loop) + chainMagicSubstitution suite extended.

## Wave 6 — Receipts honesty: narrative/AI grounding + display + dead code

1. **AI/narrative grounding reads.** Fix the six fields read but never written (`aiLayer.js`, `narrativeGenerator.js:153-167`), the stability-string-as-number bug (power notes ALWAYS describe authority as contested), and the lbs/day → "1200% food surplus" render.
1b. **Silent-override receipts.** The isolated→road rewrite and the plagued military-floor apply to EXPLICIT user choices with no trace (and one trace claims a floor that didn't happen) — emit honest receipts on the explicit paths (`resolveConfig.js:101,123,184-214`).
2. **Two-band vocabulary collision.** Stop concatenating causal-band deltas (surplus/adequate/strained/critical/collapsed) with display-band deltas (Stable/Strained/Vulnerable/Critical) in one panel (`eventPipeline.js:255-261`) — substrate deltas become internal/diagnostic; the DM reads the four dials.
3. **explanation.js provenance.** Capacities described as *sibling readers of the ledger*, not "feeds the substrate" (false provenance).
4. **Noise-capacity visibility (owner decision honored).** Gate `dailyLife`/`aiGrounding` DM-facing surfaces to the five canonical capacities (food/defense/governance/magic/healing lenses) — craft/labor/transport stop leaking into prose declared noise.
5. **Dead-code purge (~800+ lines).** `_resolveUpgrades`, shadow `generateSpatialLayout`, dead servicesGenerator helpers, dead economicGenerator blocks, `supplyChainData.js:1278-1467` — dead config is where drift hides.
6. **NPC/dossier truth.** `deriveNpcProfile` surfaces `corrupt/corruptionVector/timesExposed/ousted` (the live story and the dossier currently tell contradictory tales).

*Verify:* gate + UI smoke; publicSafe denylist check on any new surfaced fields.

## Wave 7 — Structural items needing owner sign-off (not started without it)

- **Faction power substrate reconciliation** (0-100 roster vs 0-1 competition; capture-ladder scale mismatch makes capture nearly unreachable) — L effort, gameplay-shaping.
- **World-pulse → dossier write-back** beyond corruption (evolved rivalries, capture transitions, Wizard-News entries for capture) — M/L.
- **MagicProfile: surface or delete** (computed, tested, consumed by nothing).
- **`magical_stability` crisis archetype + housing/refugee condition path + monsterThreat→legitimacy term** — modeling additions, each S/M, flagged as genuinely *new* causal links rather than repairs.
- **Raw-config / effectiveConfig full split** (`settlement.config` vs `settlement.effectiveConfig`; `applyChange` regenerates from raw) — the complete cure for derived-state-as-input; touches persistence shape + the store, L effort. Wave 4's strip-keys fix removes the acute damage first.

## Wave 8 — Structural prevention (proposed 2026-06-11; owner sign-off required, like Wave 7)

Waves 1–6 fix every *found* instance and the harness pins each one dead — but the bug classes
themselves can regrow at any seam the harness doesn't watch. The coup-wave completion proved the
point twice in one session: a fresh fuzzy-merge defect (goods subsumption) and a fresh frozen-field
defect (`scores.disaster`) both appeared in NEW code, written under the program's own discipline.
These four items are the root-cause cures. Each is program-scale (the ledger-refactor precedent
applies: stage it, gate it, let the tests enforce the thesis).

1. **Entity identity: ids join, labels display.** The string-join disease's root cure. Today
   institutions, goods, chains, services, and exports join on display-label text (`slice(0,12)`
   substring processor matching, `/airship/i` sniffs, first-word export badges) — every wave has
   killed instances; nothing stops the next feature from writing a new one. Generalize the
   `exactGoodId` pattern (goodsCatalog.js): generation writes canonical ids ALONGSIDE labels
   (goods already have them; institutions get catalog ids; chains already carry `chainId`), joins
   flip to id-first with label-fallback for legacy saves, and a lint/harness rule rejects new
   label-joins at known seams. Touches persistence shape — L effort, staged by entity kind
   (goods → institutions → services).
2. **Frozen-vs-live field manifest.** Nothing marks which generation-written fields are
   snapshots and which the pulse must keep live — the disaster-freeze class (`scores.disaster`
   froze for two days of work; the rest of `defenseProfile.scores`, `magicTradeChannel`, and
   `economicGates` are still snapshots a long campaign will eventually contradict). Declare per
   field: `snapshot` (display may NOT prefer it over a live sibling) or `live` (must name its
   pulse writeback producer); a manifest-walking test enforces both directions. M effort, and it
   converts a multi-agent-audit bug class into a failing unit test.
3. **Producer/consumer manifest (dead-field CI).** The "written for the dossier, read by
   nothing" class (`blockadeBypass` today; `economicGates` until 1fd128e; Wave 6 #1's six dead
   reads). A registry of engine-written DM-facing fields with their intended consumers; the gate
   fails on writes with no reader and reads with no writer. S/M effort; mostly mechanical once
   the field list is enumerated from the two audits.
4. **Crisis-triple sync by construction.** One authored crisis lives in three representations —
   stress entry, roaming world-pulse stressor, promoted condition — kept in agreement by upsert
   conventions (severity drift and the resolution asymmetry were both found in the seam: the
   roaming twin resolves, the local entry and dossier never do). Route the lifecycle through one
   transition function (onset/escalate/resolve updates all three, or explicitly documents the
   DM-owned exception). M effort; resolves the owner decision deferred at `mutate.js`
   (applyStressor) and `stressorAftermath.js`.

Also worth a look while in there, smaller: **seeded-RNG stream isolation** (same-seed stability
currently depends on generator call ORDER — servicesGenerator had to be restructured around it;
per-subsystem forks would make refactors safe), and a **convergence audit** of the stockpile
dynamics (the tithe/drawdown see-saw shows the discrete-time branches lack hysteresis; soak
verifies boundedness, not convergence).

---

## Sequencing rationale

Waves 1–2 are pure sim-side wiring (small, independent, immediately deployable — the "quiet lies" stop first). Waves 3–4 are generation data hygiene, ordered so data-table fixes (3) land before the roster-mutation passes that consume them (4). Wave 5 repairs the adapters *between* the two halves — done after both sides are individually honest. Wave 6 fixes what the DM reads last, when the data underneath is finally true. The join harness (Wave 0 + per-fix assertions) is the enforcement layer that keeps all of it from regressing — the same tests-enforce-the-thesis methodology that made the ledger refactor stick.

Estimated shape: ~6 deploys, each gated + verified; Waves 1–3 are dominated by S-effort fixes, Wave 4 carries the heaviest behavioral change (roster integrity), Waves 5–6 close the loop.

Wave 8 sits deliberately last: it is prevention, not repair, and its items pay off most once the
instance inventory (Waves 5–6) is cleared — retrofitting ids or manifests onto known-lying data
would enshrine the lies. Wave 8 #2/#3 (the manifests) can start any time after Wave 6 with no
persistence impact; #1 and #4 want the same owner conversation as Wave 7 since they touch save
shape and DM-facing crisis semantics.
