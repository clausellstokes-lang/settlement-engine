# THE COHERENCE MATRIX — Round-3 loop intake (pre-computed 2026-07-19)

Pre-computed by a 16-agent workflow (15 per-system rows + 1 synthesis) against the
composite base **aad6265e**, operationalizing THE COHERENCE MANDATE (owner ruling
2026-07-19, ledger). Each of the 105 unordered system-pairs was classified from BOTH
endpoints; disagreements between the two endpoint-reviews are recorded (they are the
richest signal). Full per-system row detail (every anchor) lives in the workflow journal:
`subagents/workflows/wf_c1cd70f8-0fa/journal.jsonl`.

**⚠ ROADS CAVEAT:** roads was read on the unfolded `claude/the-roads` branch; every
roads-bearing pair is provisional and re-verified when roads folds. Six of the 17
missing-with-foundation candidates are roads pairs → owner-queue / post-fold, NOT
immediate loop builds.

## Tally (canonical 15-home upper triangle = 105 pairs)
COHERENT **74** · MISSING_WITH_FOUNDATION **17** · INCOHERENT_DEFECT **8** ·
ORTHOGONAL **4** · MISSING_NO_FOUNDATION **2** (+1 intra-cluster defect calamity×pestilence
outside the triangle → **9 defects total**).

## THE DEFECTS (9 — fix in the loop; the ruin-class is pre-staged, see ledger)
**THE RUIN-FILTER CLASS (4 — one root cause: consumers never filter `_worldPulseInactive`/
`status` that calamityKernel.ruin() sets):**
1. calamity×war — `militaryStrength.js:181-201` counts a flattened garrison/wall as live martial force (name-match only).
2. calamity×religion — `religionLegitimacy.js:178-187` sums a destroyed cathedral at full backing weight (piety W_INSTITUTION 0.35).
3. calamity×corruption — `corruptionImpair.js:173-190` rolls reform on a calamity-destroyed impaired building.
4. calamity×pestilence (intra-cluster) — `pestilence.js:183-195` counts a flattened healing house as live plague care.
→ **CURE: one filtered-roster accessor + an inventory ratchet (structural-prevention).**

**POINT BUGS (5):**
5. occupation×corruption — `corruptionWeb.js:774-789` checks `s.occupiedBy/s.occupation/s.conqueredBy`, field names NEVER written (occupation lives in `worldState.occupations[id]`); an occupied patron's corrupt ties never collapse. CONFIRMED both endpoints.
6. religion×war — `militaryStrength.js:253` reads `deity.temperAxis||deity.temper` (retired fields), bypassing canonical `deityTemper()`; warlike/peaceful will-facet bonuses are DEAD CODE for every deity. (Same file as #1.)
7. occupation×migration — flight keys only on the one-shot 6-tick `vassal_extraction` proxy; the refreshed `occupation_resistance/occupation_burden` are absent from WAR_CRISIS/CRISIS_FLIGHT sets, so an ongoing occupation (dwell≫6t) stops generating refugees early.
8. occupation×ladder — pulse-conquest installs the occupier with `category:'military'`; `factionArchetype()` resolves category before the 'occupation' rule, so the ladder's occupation rank bucket is permanently unreachable for pulse-conquered settlements.
9. politics×beliefs — two uncoordinated 'who governs' resolvers (`rulingPower.governingFactionOf` string-fallback→may null vs `beliefMap.pickGoverningFaction` power-fallback→never null); on a malformed roster they diverge and beliefMap hands a wrong archetype to peace-terms/war-economy/schism. PLAUSIBLE.

## CANDIDATES — GATED IN (12; the loop's build queue, ranked)
Highest value / cheapest first:
1. **migration×rumor_intel** — refugee columns seeded into the rumor net exactly like army/smuggle paths already are (fixes "migration is the only silent mover"); dormant-byte-identical.
2. **THE TRADITIONS QUARTET** (the newest lit layer is missing four festival-sensitivity hooks, each a one-Set-entry / one-term edit, all converged by both endpoints):
   - trade×traditions — `trade_route_cut` joins HARD_STRESSOR_ARCHETYPES (severed-trade market festival skips like a famine one).
   - calamity×traditions — fresh-calamity penalty + boom/reconstruction bonus (symmetric to the existing weather term).
   - generosity×traditions — bounded term off the shared `obligations` ledger (debtor lowers spirit / creditor lifts).
   - corruption×traditions — `corruption_exposed` penalty symmetric to the legitimacy term (VERIFY G4 vs DESIGN_TRADITIONS §16 first).
3. **Two dead-data closures (near-zero plumbing):**
   - ladder×corruption — `npcLadderChallenge` reads the already-mirrored `faction.captureState` → a `faction_captured` challenge window.
   - politics×institutions — `institutionLifecycle` reads the already-written `controlledInstitutions/suppressedInstitutions` (currently written, never read).
4. ladder×politics — bloc-backed/conspiracy challenge window from `settlementPolitics.rulingBlocOf`.
5. prosperity×politics — `coup.js` threads a bounded `economicAdj` into `resolveCoupVerdict` (the coup contest is currently blind to economy).
6. corruption×migration — migration reads `thievesGuildStrength/criminalCaptureState` as a sharper push term.
7. corruption×calamity_upswing — rewire upswing's reconstruction skim into `npcAgency.onsetHazard`'s existing `pressureMult` (replaces a narrative-only condition).
8. beliefs×calamity_upswing — `groundTruthDistress + believedDistress01` read-side (dark-safe; the CONSUMER opt-in that shifts war/peace is an owner-gated step 2).

## CANDIDATES — GATED OUT (8 → owner-queue / deferred-seam)
- **prosperity×calamity_upswing** — G2 FAIL: plague/famine are always-on (no opt-in flag), so adding `economic_capacity` golden-shifts every existing occurrence → **owner-queue** (owner-signed re-mint, the slave_revolt precedent).
- **beliefs×roads** (the owner's OWN flagship seed — returning travelers write the home rumor ledger) — gates PASS but the write-side chokepoint lives only on unfolded roads → **owner-queue, HIGHEST priority the instant roads folds.**
- roads×{migration, calamity, trade, generosity, war-diplomacy} — five real roads seams, all PENDING-ROADS-FOLD → **deferred-seam, re-verify post-fold.**
- roads×religion — G4 FAIL (a 'pilgrimage' purpose = new capability; roads' conversion is deliberately corruption-flavored) → owner-queue.

## DISAGREEMENTS (15 — where one endpoint saw a gap its counterpart missed)
The most informative rows. Notable: every RUIN-CLASS defect was flagged by the calamity
endpoint and seen as COHERENT by its counterpart (the counterpart trusted its own read and
never checked the roster filter) — the classic "a system's owner can't see its consumers'
staleness" pattern. Also: occupation×migration (occupation saw the 6-tick staleness,
migration saw only the working trigger); politics×beliefs (politics saw the resolver
divergence, beliefs trusted the roster); religion×war (religion saw the dead temperAxis
read, war saw coherence). Full list in the journal synthesis.

## LOOP ORDER (synthesis recommendation)
1. **Pre-fold (free-slot, structural-prevention):** the RUIN-FILTER defect class + the two
   dead-read point bugs in militaryStrength.js + the occupation×corruption dead-field check.
2. **Loop cycle 1 builds:** the traditions quartet + migration→rumor carrier (the cheapest,
   highest-value, both-endpoint-converged set).
3. **Loop cycle 1 structural:** the two dead-data closures (ladder→captureState,
   institutionLifecycle→controlled/suppressed).
4. **Loop cycle 2:** coup-economic read, believed-distress read (with its owner-gated consumer step).
5. **HOLD for the roads fold:** all 6 roads seams + beliefs×roads (owner's flagship) — build
   the instant roads folds; owner-queue.
6. **Owner-signed:** prosperity×calamity (golden re-mint).

Convergence (per the mandate) = zero must-fix findings AND zero gate-passing coherence gaps
left unbuilt (built, or explicitly deferred-with-rationale above).

## DEFERRED FEATURES → NOW COMMISSIONED (owner 2026-07-19 "build them all, highest caliber, pre-loop") — see DESIGN_DEEP_COUPLINGS.md
These are MISSING_NO_FOUNDATION pairs: a coupling logic/intent wants, but which cannot be
built from existing state on both sides — each needs a new subsystem/attribute, so each is
a FUTURE FEATURE (owner-commissioned), outside the loop's four gates. Recorded here so they
are found, not re-discovered. Two are ALREADY deliberately deferred by their own design docs.

1. **beliefs×migration — a demographic belief axis.** BeliefRecord is power-oriented (readiness/
   strength/alliance/faith-lean); no slot for "City X is emptying out." Build = a new belief axis
   fed transitively (migration→rumor→belief, after the migration→rumor loop-build). DOES: observers
   can believe (rightly or wrongly) a settlement is declining and act on it.
2. **beliefs×traditions — a cultural belief axis.** Same shape: no slot for a settlement's cultural/
   observance state, so a rival's fog-of-war can't be stale about culture (still "believing" an old
   rite persists after politics rededicated it). Build = a new cultural belief attribute. DOES:
   cultural reputation becomes a believable, spoofable diplomatic fact.
3. **informationStatecraft×ladder — per-NPC credibility.** Credibility (W-DOCTRINE-2's proven-liar
   stock) is settlement/observer-scoped. Build = per-NPC credibility attribution. DOES: an NPC
   caught in a LIE takes a personal ladder-standing hit (mirrors corruption-exposure stigma); his
   future claims are discounted personally — character-level reputation.
4. **generosity×roads — third-party ransom payer.** Ransom is hard-wired to the captive's OWN
   settlement. Build = a payer≠home path + an obligation/gratitude write into the generosity ledger.
   DOES: ransoming/rescuing someone else's captive as a favor-economy move (place a freed rival in
   your debt; earn an ally's credit). ⭐ OWNER REFINEMENTS 2026-07-19: (i) the
   outcome is EITHER debt OR the freed captive becomes COMPROMISED for the payer (the
   existing corruption foreign-patron shape — beneficiary = payer; personality/circumstance
   weighted, the roads-conversion trait read); (ii) the captive can REFUSE a ransom not from
   their own settlement (personality/circumstance — a proud/loyal captive won't be bought by
   a rival; refusal keeps them captive, the no-death law intact). [PENDING-ROADS-FOLD]
5. **generosity×rumor/intel — the intel SELL lane (ALREADY DEFERRED by design).**
   informationStatecraft.js:1179 parks the SELL verb for "future wiring / the DM-verb path,"
   explicitly warning against "a constant whisper-war hum." Build = a mover/DM-verb subsystem to
   trade intelligence as a good. DOES: information-as-currency (gift/sell an enemy's movements to an
   ally). NOTE: deliberately deferred, not merely unbuilt — respect the anti-noise caution.
6. **naval/sea-lanes×roads — maritime journeys (ALREADY DEFERRED by DESIGN_THE_ROADS).** Build = a
   sea leg-type on MissionRec, a sea-aware currentHopOf, sea-specific hazards (pirates/storms/
   blockades, not patrolling armies). DOES: envoys, embassies, and captives travel by sea — opens
   roads to maritime realms. [PENDING-ROADS-FOLD]
