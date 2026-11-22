# DESIGN — THE ESPIONAGE LAYER (ES: covert confirmation missions)

## LANDED 2026-08-05 as a member of the docs/DESIGN_FP_ARCH_* family — the
## per-program file for the ES owner-amendment program, sibling to
## docs/DESIGN_FP_ARCH_{SP,IN,GR,TR,WF,POP,INT,CW}.md and normative where the
## compiled volume docs/DESIGN_FP_ARCHITECTURE.md compresses it. Promoted whole
## from DESIGN_ESPIONAGE_ARCHITECTURE-DRAFT.md (master architect 2026-08-04,
## post-WR close; REVISED the same day by the amendment architect, same session
## family: the cohesion critic's findings F1-F9 closed in place — each marked
## ⟨F#⟩ where it lands — and owner additions G (the rooted spy — gather or
## govern) and H (the tap-order ruling), which postdate the first compile,
## integrated in full at §3.4b/§3.7/§3.14 and waves ES-2/ES-3/ES-5). The five
## chair questions at §7 are ALL RULED — CR-ES-1..CR-ES-5, chair 2026-08-05,
## joined there by the JOINT ES/WY ruling CR-ES-6 (the encounter-table
## admission), each vetoable, each recorded in FABLE_VALIDATION_QUEUE.md at
## the fold commit.
## HEAD at landing: 32cc17f7 (stamped by the landing lane).
## [RULED 2026-10-16 (coherence fold §5) — `rooted` in this volume is ES's ROOTED DWELL (§3.4b); W-OPS's infiltration rung `rooted` (operationsVoice.js ARC_RUNGS_MIRROR) is a homonym in an unsanctioned design (RULED BY DELEGATION 2026-10-16, OD-FC-4) and renames if sanctioned.]
##
## THE OWNER-AMENDMENT VOLUME that folds into DESIGN_FP_ARCHITECTURE as a wave
## family of the INFORMATION program, architected JOINTLY with the belief-legs
## waves (SP-B/SP-B2) so that spies are the SOURCE of the appraisal legs about
## non-neighbors — the owner's stated reason this program exists. Compiled from
## the owner directive (memory/espionage-confirmers-directive.md — its
## verbatim-intent section is LAW here, owner additions A-H the same authority,
## its chair refinements accepted-vetoable), six substrate censuses
## (CENSUS-{NPC,CRIME,ERRAND,ALIGN,MAGIC,LEGS}.md — COMPILE-TIME INPUTS, not
## repo artifacts: they are archived in the session scratchpad beside the draft
## this file was promoted from, every load-bearing premise RE-MEASURED against
## the live tree at HEAD 67a907fe, branch claude/composite-r4, past 71e78fe9,
## and each F-closure's symbol home re-measured at 99d63d92 — BOTH points now
## sit behind the landing HEAD, so the censuses are orientation only: LIVE CODE
## OUTRANKS THEM and every premise a wave builds on is RE-MEASURED at build),
## and the FP compiled volume — LANDED while this volume was in review:
## docs/DESIGN_FP_ARCHITECTURE.md at commit 99d63d92, with the per-program files
## beside it as docs/DESIGN_FP_ARCH_{SP,IN,GR,TR,WF,POP,INT,CW}.md; its §1 laws
## L1-L9, §3 flag law, §5 wave order, §9 seam matrix, and §10 protocol bind
## verbatim. The war volume docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md §1 and §10
## are the canon behind both. LIVE CODE OUTRANKS EVERY TABLE IN THIS DOCUMENT;
## navigate by SYMBOL, never by any line number quoted here.

**Status: ARCHITECTURE. Nothing is scheduled until the owner sequences it.
[CORRECTED 2026-10-16 (coherence fold) — THE STATUS OF RECORD IS docs/DESIGN_FP_COHERENCE_FOLD.md §2; this header is history. In one line: LIT: none (`espionageEnabled` needs `errandSpineEnabled`, dark in every preset) · BUILT DARK at 00b648c9d: ES-0, ES-1, ES-2, ES-3, ES-4 (the `ES-4-DISTANT-SOURCE-EVIDENCE` pin), ES-5a (the stage as a leaf; no autonomous dispatch mount found — PLAUSIBLE, import census only), ES-5b, ES-5c, ES-5d, ES-6a (the leak) and ES-Da (the composite rider — the ONLY mission mint path, absent from §4's wave list) · UNBUILT: ES-6b, ES-7 (no `espionage_*` kind is registered or routed; missions resolve silently), ES-Db; W-OPS's cars are orphans (RULED BY DELEGATION 2026-10-16, OD-FC-4, see §0).]
[ADDED 2026-10-16 (coherence fold §3.4, requirement 24 — the owner's HEARING WEEK) — ENGAGEMENT KINDS this program registers in the wave that builds each: `spy_at_target` (ES-2's gauntlet + ES-3's product): the mission's target leg is the hearing; a spy dwells one week before the verdict. Once `hearingWeekEnabled` is lit no kind resolves in the tick it arrives at a one-week advance: it mints its pending verdict and the DM may leave it, tilt it or give a verdict (never a "decree" — the Decree Registry's word); month/season/year advances run the engine default; the hearing never parks the advance cursor (skeptic S5). Each kind's pending card is its FIRST-VISIBLE sign.]
[ADDED 2026-10-16 (coherence fold, req 17) — TIER DECLARATION for every wave in this volume: `espionageActive` = `beliefsActive` (the spatial canon marker ∧ infoMode ≠ 'omniscient', beliefMap.js:204-209) ∧ `errandSpineEnabled` ∧ `espionageEnabled`. Only three presets record beliefs (dramatic_campaign and living_realm at 'perfect_delayed', full_simulation at 'full'; the default infoMode is 'omniscient', simulationRules.js:56), and `errandSpineEnabled` is lit in NO preset, so no mission can run in any shipped configuration. The family is spatial-canon (premium-tier) only by construction and has no aspatial degraded arm. Each wave below carries its own FIRST-VISIBLE/TIER line.]
Every wave ships DARK behind `espionageEnabled`; no flag lights, no soak runs,
no band ratifies outside the owner-signed schedule. Every judgment below is
labeled JUDGMENT and is vetoable — an implementer NEVER re-rules one silently.
Five chair questions close the volume (§7) — ALL FIVE RULED as CR-ES-1..CR-ES-5
(chair, 2026-08-05), each vetoable, joined there by CR-ES-6, the JOINT ruling
this volume shares with the WAYFARE volume (the encounter-table admission). Sizes quoted are raw `wc -l`
at HEAD 67a907fe; enforcer-effective figures re-measure at every publishing
commit (FP §2c — never inherit a figure, including from this document).**

**Reading order for the implementer:** this document → the FP volume's §1/§3/
§10 (docs/DESIGN_FP_ARCHITECTURE.md) → docs/DESIGN_FP_ARCH_SP.md (SP-B/SP-B2/
SP-D — this program's substrate) → docs/DESIGN_FP_ARCH_IN.md (the sibling
family) → the six censuses (the measured ground, archived) → the owner
directive (the law).

---

## §0 THE PREMISE — what this program is, and the four things that are new

The owner's design, compressed from the directive's verbatim-intent section:
NPCs, envoys, and traveling merchants take COVERT CONFIRMATION MISSIONS —
travel covertly to a target, gather or confirm information, and bring it home
(instantly by magic on magic-functioning ends; physically otherwise). Covert
travel is harder to catch but less credible on any simultaneous open purpose.
It serves ALL statecraft, not war alone. Capture means reputational damage,
resentment, longer hostage terms, higher ransom. Home criminal capacity scales
competence; a target's internal security scales catching. Capture risk exists
ONLY at route segments carrying enemy military and at hostile settlements.
Absence costs home political weight. Notoriety (power rank × faction
influence) makes an operative worse at hiding, worth more when caught, and
missed faster. Composite journeys chain 2-3 legs. A court noticing a foreign
notable is MISSING raises its guard. Alignment — both axes — shapes who spies
on whom, how, how often, and how captors treat the caught. Owner additions
A-H extend this with spy-before-decision deliberation, the per-waypoint
confidence gradient, infiltration modifiers (stressors, tunnels, inside
assets), the standoff option, per-stop magical transmission, the double
agent (LEAK-ONLY by chair scope ruling), the rooted spy's gather-or-govern
career economy (G — dwell to keep gathering at climbing catch odds and
climbing promotion risk; mission success GRADED by information quality;
careers are espionage's currency on both sides — §3.4b/§3.14), and the
tap-order ruling (H — a spy taps BY ACCESS DEPTH and never reports purer
than their access: the outbound performance at standoff/shallow cover, the
host's internal beliefs embedded, both plus the delta with an inside asset;
tap level is fidelity metadata, receipted in house voice — §3.7).

[ADDED 2026-10-16 (coherence fold) — RULED BY DELEGATION 2026-10-16, OD-FC-4 — W-OPS (DESIGN_W_OPS / W_LIVES) is a successor DRAFT over espionage, unsanctioned, every leaf unimported; ES's volumes are the authority for missions until the owner signs. What it adds: one operation grammar (`operations/operationGrammar.js`, "THE ONE GRAMMAR every operation walks", absorbing these missions into MISSION/GOAL/ERRAND classes), the infiltration rungs `passing_ear → observer → rooted → placed → seated`, a mission dispatcher and acceptance (`missionDispatcher.js`, `missionAcceptance.js`), infiltration depth and drift, and an operations voice (`operationsVoice.js`); its mission catalog is owner-UNSIGNED (`signedBy: null`). That is new capability, not repair; the chair's recommendation is NO for now (coherence fold §3.1.8, §7).]

**The measured verdict (all six censuses agree): this layer is overwhelmingly
a WIRING problem.** Notoriety math (`embassyEnvoyWeight01`), capture math
(`captureProbability`), hostage/ransom machinery (foreignGuestHold +
ransomClaim), a proto-CONFIRM mission (roads/verification.js), covert-exposure
blowback ⟨F1⟩ (the `SIGHT_TUNING.EXPOSE_CHARGE01`/`EXPOSE_GRIEVANCE_W` PAIR
at informationStatecraft.js — the exposed-WATCHER charge, 0.8 deception-class,
plus the target→watcher grievance already minted with incidentType
`'spy_exposed'`; distinct from `LIE_TUNING`'s EXPOSE_* TRIPLE, which lives in
disinformationPlant.js and prices exposed LIES — §3.5 names both homes;
corruptionWeb §4), per-NPC credibility,
both alignment axes (`computeLawfulness`/`computeMalice`), criminal-competence
reads (`readCorruptionClimate`, `criminalStrength01Of`), belief-derived
silence inference (`advanceEnvoySilence` → `applyEnvoySilenceInference`), the
vetting reader (`vetVolunteerEnvoy` — built, zero callers), and a DM-only
covert-truth channel all ship today, pure and gated.

**Exactly four things are genuinely new, and the FP compile already provisions
the first:**

1. **The cover story** (public face vs actual itinerary) — DISCHARGED BY SP-D:
   `declaredPurpose`/`truePurpose` on the generalized errand row, truePurpose
   covert-side fail-closed in the existing projection (SP §4, measured absent
   in the tree today — SP-D builds it). This program CONSUMES that seam; it
   does not mint a rival.
2. **The chained 2-3-leg itinerary** — new machinery, §1/§3.4 (the one
   conditional sub-record this program adds).
3. **REFUTE** — no refutation verb exists anywhere in src (measured: zero hits
   for `\brefute|refutation|correctBelief|beliefCorrection`); §3.6 builds it
   on the report road.
4. **Absence → home politics** — contradicts a WRITTEN LAW (THE ROADS §1
   law 5, verbatim at roads/state.js: "TRAVELERS … are NEVER off-stage —
   travel is narrative, captivity is mechanical") and is therefore a DESIGN
   AMENDMENT the owner signs (§3.11, chair question Q1), implemented WITHOUT
   touching `isOffStage`. TWO GRAINS under the one amendment: the faction
   bench (council weight, §3.11) and — owner addition G — the person's
   career (ladder standing under contest while away, §3.14; the ladder's
   own guards are hostage-only today, measured: npcLadderKernel.js:560 +
   npcLadderState.js:188 both guard `isOffStage`, so a traveller keeps
   full standing — exactly the gap G orders closed).

**JUDGMENT J-ES-1 (the host).** Espionage missions ride the SP-D GENERALIZED
ERRAND SPINE (`worldState.envoyErrands`, purposeClass `covert`), NOT a new
THE-ROADS purpose kind. Reasons, in order: (a) the owner directive's own
fold-in clause names "extending WR-7 errand vocabulary + npcAgency"; (b) SP-D
(J-SP-2, ruled in the FP compile) makes the errand the estate's ONE
purposeful-travel substrate, with TR-8/WF-2b/IN-4/INT-3b all riding it — a
roads-hosted mission would be a SECOND covert-travel answer the day after the
estate unified on one; (c) SP-D's declared/true split IS the cover story —
riding roads would force a duplicate spelling; (d) the errand's capture
surface is army-collision-only (exact node equality, envoyEncounter.js),
which matches the owner's "ONLY at route segments carrying enemy military"
BY CONSTRUCTION — the roads gauntlet would import T3 bandits and S1-S3 sea
hazards that the owner's list excludes and force suppression rulings.
THE ROADS is UNTOUCHED by this program: its `verification` purpose remains
the ambient neighbor-verify (it raises RUMOR fidelity;
`boostHomeRumorFidelity`), a different surface from this program's products
(which move BELIEF records through `reconcileBelief`) — no fork. Its pure
leaves (`embassyEnvoyWeight01`, `captureProbability`, `exposureOf`,
`termWeeksFor`, `riskToleranceOf`) are IMPORTED where the math is the same —
J-WR-10 forbids a second spelling. Say "veto" to re-host on roads; the cost
is a parallel cover-story spelling and two suppression rulings.

---

## §1 THE CANONICAL MODEL — zero new top-level keys, one conditional sub-record

**The fight, won:** ZERO new top-level worldState keys. ZERO new
spatialLedgers sub-keys. [CORRECTED 2026-10-16 (coherence fold) — ES-5d added one; see the bracket at §3.14's ES-5d note.] ZERO new persisted derived state — vigilance,
doctrine, notoriety, competence, the tell, the deliberation clock, the
miss clock, the rooted-dwell decision (§3.4b), the tap level (§3.7), and
the promotion-risk register (§3.14 — a READ, never a stock) are ALL derived
reads (the `ransomDwellRead` precedent: derive from ticks on every read,
store nothing). The belief-side fields this
program's products write (`conditionsBands.{tierBand,storesBand,
routePositionBand}`, `confidence01`, `lastUpdateTick`, `allianceLabel`,
`faithLabel`) are SP-B's keys and the belief partition's existing slots —
owned by the spine, fed by this program. The cover-story fields
(`purposeClass`/`declaredPurpose`/`truePurpose`) are SP-D's keys. This
program adds exactly ONE conditional field, on the existing errand row,
with the existing writer as its one owner:

```
worldState.envoyErrands[] (EXISTS; writer envoyErrand.js — unchanged; SP-D's
                           errandMint.js is the mint leaf this program extends)
  covert?: {                       // present ONLY on purposeClass 'covert'
                                   // errands; drop-when-absent (L4/T4 — absent,
                                   // never null; zero bytes on every other row)
    itinerary: [                   // 1..3 stops, mint-refused beyond 3
      { settlementId: string,      // the stop
        face: 'declared'|'covert', // whether this stop is on the public face
        stayTicks: number }        // the PLANNED dwell, priced at mint; the
                                   // rooted-dwell read (§3.4b, addition G)
                                   // may extend the actual stay through the
                                   // one amender, bounded + receipted
    ],
    product: 'confirm'|'acquire'|'refute',  // the typed mission product
    demand: 'corroborate'|'confirm'|'certain',  // addition G: the graded bar
                                   // — the confidence the goal DEMANDS
                                   // (closed set; thresholds in
                                   // ESPIONAGE_TUNING.DEMAND_BANDS; grades
                                   // the mission at close, §3.14, and is
                                   // the early-resolve threshold, §3.12)
    subjectId: string,             // the court/holding the product is ABOUT
    legRefs?: string[],            // which appraisal legs an ACQUIRE targets
                                   // ⟨F5⟩ closed set, enumerated EXACTLY:
                                   // {tierBand, storesBand,
                                   //  routePositionBand, strength,
                                   //  readiness, exports}. SP-B's
                                   // conditionsBands holds a FOURTH key,
                                   // pullBand (docs/DESIGN_FP_ARCH_SP.md
                                   // §canonical model — measured) — it is
                                   // EXCLUDED here BY RULE: pullBand is fed
                                   // by SP-B's own populations road and no
                                   // ES product can fill it; admitting it
                                   // would mint a dead vocabulary member
                                   // (the dead-band law's shape). Mint
                                   // REFUSES a legRef outside the six.
                                   // [CORRECTED 2026-10-16 (coherence fold) — FIVE members at 00b648c9d: EP-r cut 'exports' 2026-08-10 (ES-1's charter in §4; envoyErrandVocabulary.js:207-213).]
    gathered?: [                   // the confidence gradient's accrual —
                                   // path-dependent, so it MUST be row state
                                   // (census 3 §8: the one thing Option C
                                   // cannot derive); capped at 3 × stops
                                   // + DWELL_RESAMPLE_CAP rooted re-samples
      { subjectId, accuracyCap01,
        tap: 'performance'|'beliefs'|'delta',  // addition H: the access
                                   // depth this read was taken at — fidelity
                                   // metadata, receipted in house voice
                                   // (§3.7); never purer than access
        atTick, sentHome?: true }
    ],                             // `sentHome` appears only on magic-
                                   // transmitted partials (addition E)
    standoff?: true                // the mission plateaued at a satellite and
                                   // never entered the target (addition D)
  }
```

**Discipline (all inherited, none new):** the errand family validates through
exact-key versioned DTOs — `normalizeErrand` is taught the `covert` sub-record
IN THE SAME COMMIT as the first writer (the columnOf precedent, FP §2a RF-1);
the sub-record's own normalizer is total-on-garbage and rejects a malformed
sub-record to ABSENT (never nulls the whole errand — a covert mission with a
corrupt sub-record degrades to an ordinary errand of its declared class, with
a receipt). ⚠⚠ THE LEG-FIELD TRAP (census 3 §4b.5) binds: NOTHING is added to
`legs[]` — `envoyErrandTransit.normalizeLeg` silently DROPS unknown leg
fields and `foreignGuestHold.normalizeLeg` NULLS a continuation carrying one,
which drops the captive. The itinerary lives at the ERRAND level; stops are
expressed as multi-leg outbound routing (already supported —
`normalizeRoutePlan` validates N contiguous legs) with dwell as the gap
between one leg's `arrivalTick` and the next's `departTick`.

**Vocabulary members (closed-set changes, walker-visible, not keys):**
- `FOREIGN_GUEST_HOLD_CAUSES` gains `'caught_spying'` (5th member; today
  `['war_continuation','private_imprisonment','terms_shopping',
  'parlay_refused']` — measured).
- The traveller-kind franchise gains `'covert_envoy'` in `TRAVELLER_KINDS`
  AND `HIDDEN_PATH_KINDS` (routeNetworkConsumers.js — `mayUseHiddenPaths`
  fails closed today because `buildEnvoyRoutePlan` passes kind `'envoy'`,
  which is not in the set; the covert route plan passes the new kind at that
  ONE call site, so covert errands may take hidden ways and open errands
  never can — census 3 §4c).
- New Herald kinds (§5 row 7): `espionage_departed`, `espionage_confirmed`,
  `espionage_refuted` (dm-only covert, fail-closed upstream),
  `espionage_caught`, `espionage_exposed`, `espionage_betrayal` (public).

**The Lifecycle-paths clause (L4 — written before any writer builds):**
- **create** — exactly one mint road: SP-D's `errandMint.js` gains the covert
  arm (this program's ES-1 extends the leaf, never `envoyErrand.js` itself,
  which is at ceiling and gains only SP-D's delegation call). Mint validates
  the itinerary cap (≤3), the closed product/demand/legRefs sets (§1's exact
  enumerations), the dispatch-refusal seams
  (`envoyDiplomacy` refuses an off-stage or already-travelling person —
  HZ8 honored, never bypassed), and MAX_CONCURRENT_ENVOYS (episodes per
  origin, CR-WIRE-C — covert missions COUNT against the 2-cap; a court
  cannot flood the roads with spies).
- **read** — every derived read (§3) is pure over the row + worldState;
  belief-side consumers read through `beliefRecord`/`beliefLegsOf` only (L3).
- **persist** — the errand ledger's existing conditional materialization
  (top-level array, drop-when-empty, one writer `writeErrands`); the covert
  sub-record round-trips through `normalizeErrand` byte-stably; JSON-alias
  trap pinned (fixtures round-trip through REAL serialization — an in-memory
  probe cannot tell a shared reference from a copy, npcLedger.js:935-953).
- **regenerate (THE PROMISE)** — errands are event-accrued campaign state and
  are PRESERVED across regen exactly as WR-7 rows are today; a regen that
  removes a settlement the itinerary names lapses the mission through the
  existing loss machinery (`markEnvoyLost`, cause `route_lost`) with a
  receipt — never a dangling ref, never an invented name.
- **undo** — rides the pulse ring wholesale (the errand ledger already does).
- **migrate** — NO migration: legacy rows carry no `covert` and read as
  ordinary errands; `purposeClass` absent derives `diplomatic` (SP-D's law).
  Import validates the closed vocabularies and heals a malformed covert
  sub-record to ABSENT with a receipt.
- **veil** — `truePurpose`, the covert sub-record, `gathered`, and every
  dm-only kind ride the SP-D covert seam (⟨seam-nit⟩ measured:
  `envoyErrandProjection.js` carries NO includeCovert/truePurpose today —
  `includeCovert` is a house pattern in other files; SP-D BUILDS this seam,
  exactly as §0 states): fail-closed upstream
  (`includeCovert`), `envoyErrandProjection`'s audience split (SP-D pins the
  hardest negative: a non-covert projection NEVER carries truePurpose), and
  every public payload returns through `veilPublicPayload` (standing law;
  worldExport's player variant already ships "ZERO covert marks /
  whereabouts / nids" — measured in-source).

**Single-writer census:** the covert sub-record has exactly one writer (the
mint leaf) and one amender (the advance stage writing `gathered`/`standoff`/
the rooted-dwell re-timing of §3.4b through the errand writer's own
transaction) — enforced by the shrink-only source-scan census with an
executed third-writer plant (L4).

---

## §2 THE FLAG — `espionageEnabled`

**Name collision: the FLAG/read names are measured clear; the WORD is not
display-only ⟨F4⟩.** No `espionageEnabled|espionageActive|suspicionOf|
wariness01` anywhere in src (re-measured at 99d63d92). [CORRECTED 2026-10-16 (coherence fold) — HISTORICAL (99d63d92): `espionageEnabled` (simulationRules.js:310), `espionageActive` (espionageGate.js), `suspicionOf` (suspicion.js) and `wariness01Core` (espionageMath.js:375) all exist.] The word "espionage",
however, carries LIVE tokens beyond prose: relationshipRulesAdversarial.js
`internalDrift(ctx, "cold_war_espionage", …)` with metadata
`incidentType: "espionage"` — a live AMBIENT espionage-flavored internal-drift
lane on cold-war relationships (listed again in relationshipEvolution.js's
rule roster and pinned at subsystemRowsPeople.js); reframeKernel.js's dark
token `'espionage_all_along'`; and the statecraft's own incidentType
`'spy_exposed'` (informationStatecraft.js, the SIGHT exposure arm — §3.5
reuses it). Comment/prose mentions (brokerageServicesRules
"the espionage-target", brokerageServicesFeed, warStressorTypes,
institutionProbability, neighbourGenerator, newsVoice, cert prose) are this
layer being EXPECTED. The ambient cold-war lane is a REAL NEIGHBOR — the
estate will narrate TWO espionage stories (ambient cold-war drift vs real
missions) — mapped as seam row 13.

**L2 shape (FP §3, CR-WR10-C — verbatim discipline):** VIRTUAL — absent from
DEFAULT_SIMULATION_RULES and every preset spread; strict `=== true` reads,
dark-never-permissive; at least one BY-NAME read (the conjunction-gate hole);
joins `ENGINE_GATED_VIRTUAL_RULE_KEYS` (simulationRules.js, measured at :185)
+ its AUTHORED certification row + its first real gate read in ONE COMMIT.
⚠ **THE WAVE IS ES-0, NOT ES-1 (chair rider, 2026-08-05, postdating this volume),
AND THE ROW IS AUTHORED, NEVER PENDING.** ES-0 lands `espionageGate.js` carrying the
conjunction below, which IS a real by-name gate read, and the engine-gated-key walker
reds an unaccounted gated key — so the manifest entry and the row come due in the same
commit. "A row OR a pending entry" is not a state this contract can hold: manifesting is
what makes a virtual key censusable, so manifesting is the act that comes due.
The engineGatedRuleKeys walker asserts the
exact one-key delta; the FOUR-FENCE dormancy set (own-footprint golden ·
absent-vs-false differential · call-path spy · gate-polarity census) + the
lit-mutant control. Boolean, so it enters `spatialUsage.js` TRACKED_FLAGS
legally (the allowlist filters `=== true`; a non-boolean key would emit
nothing while looking measured — measured hazard, census 5). The DM mission
verb (ES-7) registers in operationRegistry + `npm run gen:compendium-data`.
The virtual flag touches neither DEFAULT_SIMULATION_RULES nor the preset
catalog, so NO edge-bundle rebuild is owed — VERIFY-AT-BUILD per the
five-bundle law if any touched file turns out to be a bundle input.
§49/§50 preflight (TL-F round): obligation (a) is ES-0-landed history;
this clause IS obligation (b)'s cover (verify-at-build); obligation
(c) — the literal `espionageEnabled: true` drive in the acceptance
file — rides ES-7's envelope work.

**The gate conjunction:**

```js
export function espionageActive(worldState) {
  if (!beliefsActive(worldState)) return false;          // products land in beliefs
  const rules = worldState?.simulationRules || null;
  if (!rules) return false;
  if (rules.errandSpineEnabled !== true) return false;   // the host substrate (SP-D)
  return rules.espionageEnabled === true;                // the BY-NAME strict read
}
```

NOT war-gated — none of the six ENVOY_REQUIRED_RULES war flags enter the
conjunction; SP-D's generalized mint is exactly what frees the errand from
`envoyDiplomacyActive`'s six-flag weld (census 3 §1a). Lighting order
(FP §3's contract): `espionageEnabled` lights only after `errandSpineEnabled`
— out-of-order lighting is an invalid config the ES certification walker
reds.

**Degraded arms, declared (the SP-C idiom — absent-not-zero, receipted):**
- `believedConditionsEnabled` dark ⇒ ACQUIRE/CONFIRM write only the core
  BeliefRecord slots (`confidence01`, `lastUpdateTick`, `strengthBand`,
  `allianceLabel`, `faithLabel`); the axis legs stay untouched and the
  product receipt names the missing family. The JOINT lighting story (§6)
  makes this arm short-lived, but it must exist and be pinned — a product
  that silently drops half its payload is the ghost-write class.
- `corruptionWebEnabled` dark ⇒ no inside assets, no double agents (the
  leash read answers nothing); vetting still prices loyalty/ties.
- `counterIntelEnabled` (IN-3) dark ⇒ target wariness derives from this
  program's own minimal read (§3.8), not suspicionOf.
- `npcConsequencesEnabled` dark ⇒ no durable person records; missions still
  run on roster people exactly as WR-7 errands do (graduateNpc is the
  existing mint-time seam and inherits its own gate).

**The magic-transmission sub-gate (world-content, not a rules flag):**

```js
// the pair rule — a single mundane end closes the arm (census 5 §0, verbatim
// the existing predicate's LOGIC; do NOT respell it)
const canTransmit = magicWorksAt(homeItem) && magicWorksAt(stopItem);
```

`magicWorksAt` is `warMagicFunctions` (warMagicGate.js:44, measured)
LIFTED to a neutrally-named leaf with `warMagicGate.js` re-exporting — the
exact `magicAssertionText.js` move R-BLD-5 already made. ⟨F7⟩ The export is
deliberately NOT named `magicFunctionsAt`: a module-PRIVATE
`magicFunctionsAt(magicById, id)` already exists at
src/domain/spatial/teleportEdges.js (measured — different arity, different
semantics: a defensive `!== false` read over a magicById map, no present
guard), and reusing the name would seed exactly the grep-conflation class
the operativeNotoriety01/riskToleranceOf lesson closed. `magicWorksAt` has
ZERO hits in src/tests (measured). The new leaf's header names the
teleportEdges twin and its arity; warMagicGate.js's re-export header names
the leaf (both-site headers, the house cure). All three
ingredients are load-bearing and pinned: the `magicLedger` accessor (never a
raw config poke), the PRESENT GUARD (`ledger.present === true &&` — the
neutral envelope for an un-generated settlement is itself
`magicExists:false`, and an unguarded read declares every config-less
fixture mundane), and BOTH ENDS. ⛔ MUST NOT USE: `realmMagicIsMundane` /
`realmMagicDefault` (MG-LAW-1 — a UI default, not an engine gate, prohibited
in its own docblock), the magic BAND (MG-LAW-4 — the DM's authored glowing
city survives), or `magicEconomyActive` as the existence gate (that is the
PRICE gate, and it is dark). **JUDGMENT J-ES-7 (the magic census §5
three-way, decided):** existence = PROJECTION-ONLY pair gate (the literal
reading of the owner's "magic-enabled maps", correct on the DM's mixed
realm); fidelity/capacity/price = the authored `Message network (high
magic)` institution + `magicExploitationGate` WHEN W-K lights (the hybrid's
second half, deferred to the magic-economy program, pre-pinned §5 row 11).
Say "veto" for institution-gated existence; the cost is that most magical
realms get no send at all today (the foundry rung is reachable nowhere while
W-K is dark — measured, census 5 §3).

---

## §3 THE MECHANISMS — math shapes, bands, and the receipts they owe

Every constant below lands in ONE frozen exported `ESPIONAGE_TUNING` (the
house idiom; L5 banded, owner-signed at the soak redo per THE PROMISE — every
value is a raw-authored proposal until then). Every band's reachability is
MEASURED at authoring (the dead-band law — three shapes have bitten). Zero
new PRNG streams: every stochastic choice is `hash01` keyed
`'es.<facet>.<errandId>.<tick>'` (L1); the catch roll, the leak roll, and the
casting draw are all keyed-hash, codepoint-ordered enumeration.

### 3.1 NOTORIETY — `operativeNotoriety01(homeSettlement, npc)`

Rides `embassyEnvoyWeight01({ importanceWeight01, factionPower01 })`
(roads/state.js:525 — measured, pure, tested) VERBATIM over
`roadsImportanceWeight(npc)` (minor 0.0 · notable 0.4 · key 0.7 · pillar 1.0)
× `factionPowerStanding01(homeSettlement, npc)` (faction power/100, keyed on
`.faction` NEVER `.name` — the FACTION-KEY DEFECT CLASS; this program picks
that existing resolver and mints no fifth spelling). The lift is a CONSUMER
WIDENING of an embassy-named pure leaf: ES-0 re-exports it as
`operativeNotoriety01` from the espionage leaf with an import-source pin
(the Q1/riskToleranceOf collision lesson — both-site headers, no rename of
the roads export). Three consequences, all reading the ONE number: worse at
hiding (§3.3), worth more when caught (§3.10), missed faster at home (§3.8).
The observer-side twin stays `believedNotorietyRank` (npcCirculation.js:714 —
belief, not truth) wherever another court is doing the noticing (HZ10:
self-belief is never written; observer→other only).

**Casting (JUDGMENT J-ES-4):** covert casting draws importance-INVERSE
(the roads draw law: `DRAW_WEIGHT_BASE − importanceWeight` over a floor),
while diplomatic casting keeps `envoyCandidate`'s importance-DESC law. The
two selection laws COEXIST BY CLASS — the realm's face is its most notable;
its spies are its least — and the covert mint leaf documents both laws
side-by-side so neither is "merged" by a future lane (census 3 hazard 6
ruled, not left to collide). Vetting rides `vetVolunteerEnvoy`
(sendTwoDivergence.js — built, spec-complete, ZERO src callers TODAY,
measured; ⟨F8⟩ IN-3's VET, which lands BEFORE ES-1 in the compiled order,
composes the same module — whichever lands first is the first consumer, and
BOTH route through the one reader per seam row 9's one-home clause) — see
§3.13.

### 3.2 COVERT COMPETENCE — `covertCompetence01(homeSettlement, npc)`

```
climate   = readCorruptionClimate(home)              // the ONE {crime, security} chokepoint
power01   = criminalStrength01Of(home)               // canonical criminal power (supplyKernel)
underways = settlementHasUnderways(home) ? UW_HOME_LIFT : 1      // clandestine facet
competence01 = clamp01( COMP_BASE
                        + COMP_POWER_W · power01                  // criminal POWER
                        + COMP_CRIME_W · climate.crime )          // criminal ACTIVITY
               · underways
               · (1 − NOTOR_W · operativeNotoriety01(home, npc))  // the notable are noteworthy
```

The power-vs-activity split is stated EXPLICITLY (census 2 §6.7: the
substrate has two spellings — power = `criminalStrength01Of` (guild/faction
grip, live), activity = `climate.crime` (criminalEffective-derived) — and the
directive draws a distinction the generator does not; conflating them is the
recorded failure mode). Proposed raw values: COMP_BASE 0.35 · COMP_POWER_W
0.35 · COMP_CRIME_W 0.15 · UW_HOME_LIFT 1.1 · NOTOR_W 0.5 — every one a
soak-proposal, none ratified.

### 3.3 THE CATCH MODEL — detection at the owner's named exposure points ONLY

Two exposure classes, BY CONSTRUCTION of the host (J-ES-1) — no bandits, no
sea lanes, no ambient risk:

**(a) Route segments carrying enemy military.** The EXISTING army-column
collision: `censusEnvoyEncounterCandidates` (envoyEncounter.js — exact node
equality is the whole collision law, one pre-mutation cut, one encounter per
envoy per tick). Covert errands enter the census like every errand (SP-D:
interceptability applies to every class BY CONSTRUCTION). The covert delta
at resolution: a covert traveller reads as what its FACE declares — the
interceptor's outcome table prices the declared class; the true purpose is
discovered only on a capture outcome (roll below), at which point SP-D's
covert→revealed machinery fires and §3.5's taint cascade begins.

**(b) Hostile settlements/chains — the stay-detection roll.** Once per stop
per DWELL INTERVAL (keyed hash on `'es.stay.<errandId>.<stopIdx>.<intervalIdx>'`
— exactly one resolution per interval; a within-plan stay is interval 0, and
only a ROOTED stay (§3.4b) accrues further intervals), only where the
host↔home relationship rung is hostile-class (the T4 rung table imported:
`{rival: 1, cold_war: 2, hostile: 3}` — a friendly host rolls NOTHING; the
friend case exists only through §3.5's exposure road, which is what makes
refinement 6's betrayal an exposure event, not a patrol event):

```
securityEff  = guildEffectiveSecurity(climate.security, criminalStrength01Of(target))
               · (1 − patronageSecurityDrag(target).drag)         // the bought watch
orderFactor  = ORDER_FACTOR[causalBand(law_order(target))]        // the LIVE term
porosity     = 1 − STRESS_POROSITY · stressLoad01(target)         // addition C: stressed = porous
underways    = settlementHasUnderways(target) ? UNDERWAYS_TUNING.EXPOSURE_DISCOUNT : 1
asset        = insideAssetAt(target, home) ? INSIDE_ASSET_RELIEF : 1   // addition C: the web
wariness     = 1 + WARINESS_W · wariness01(target, tick)          // §3.8, derived
catch01      = clamp( CATCH_BASE · rung(hostRung)
                      · securityEff · orderFactor · wariness
                      · porosity · underways · asset
                      · (1 − SHELTER_W · covertCompetence01(home, npc))
                      · legStack(k)                               // §3.4
                      · dwellRamp(intervalIdx),                   // §3.4b —
                                                                  // addition G:
                                                                  // ×1 within
                                                                  // plan; climbs
                                                                  // by dwell band
                                                                  // while rooted
                      0, CATCH_CAP )
```

**JUDGMENT J-ES-3 (the single-dip ruling).** corruption.js documents the
onset-vs-exposure security fork in-source: onset reads DRAGGED security,
exposure reads RAW, because the guild's shielding is already priced into
`exposureChance`'s −guildStrength term (double-dipping is the exact mistake
that comment records). The catch roll is a NEW roll with NO existing
−guildStrength term anywhere in its chain, so it takes the DRAGGED side
EXACTLY ONCE — `guildEffectiveSecurity` × patronage drag — and the leaf's
docblock states this ruling and cites the fork comment. Say "veto" to read
RAW security; the cost is that a criminally-captured town catches spies as
well as a clean one, which inverts the owner's sentence.

**The frozen/live split (census 2's central trap), handled:**
`climate.security` is generation-frozen (blind to war, occupation, razed
courts) and SATURATES at safetyRatio ≥ 2.5 (a wide flat-1.0 slice of the
world — measured). The cure is the `orderFactor` term: `law_order` is the
ONLY settlement security read that moves with the world (deriveLawOrder folds
defenseLedger.internal, live law-institution count via the id-first
`institutionIsLawOrder`, black-market capture, criminal faction power,
conditions, the deity law axis). ORDER_FACTOR is a closed 5-band table over
`causalBand` — and the dead-band law binds: the reachable band set of
law_order on generated corpora is MEASURED at ES-0 (python3 over the derive
inputs, the census-4 method) before the table is authored; any unreachable
rung is cut, not shipped. Traveller-side reads stay BELIEVED (HZ9 — dispatch
refusal reads believed danger; the CATCH roll itself is truth-side because
it is the WORLD acting on the traveller, exactly as the roads gauntlet rolls
truth — the K3 boundary runs between a court's DECISIONS (belief) and the
world's OUTCOMES (truth), and this program never crosses it).

**stressLoad01** derives from the target's activeConditions count over a
closed cap (the same live surface that already moves law_order and
criminal_opportunity — zero new state; the directive's "most stressors
discount detection" lands as this one banded term, not per-stressor cases).

**insideAssetAt(target, home)** — TRUE when the corruption web holds an
unexposed compromised NPC at the target whose leash resolves toward home
(`resolveLeash` over `corruptionProfile`/corruptTies — the web IS espionage
infrastructure, owner addition C; symmetric by construction: the same read
pointed at YOUR settlement is how enemies get into you). Gated
corruptionWebActive; dark ⇒ factor 1. A live asset also widens ACQUIRE's
reach (one extra legRef fillable per §3.6).

[ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §C ES · `DESIGN_FP_ARCH_OP.md` §5 (`caught`), §12 OP-3 hosts, §15 ES row) — `catchChance01` LEARNS ONE OPTIONAL FACTOR `custody01` for THE OPPORTUNITY's rescue (the rescuer's catch at the VENUE town, fed by `espionageGauntlet.js :: gauntletCatchFactors` exactly as a spy's stay is): ABSENT ⇒ ×1, byte-identical (163 → ≈ 166 eff, OP's measurement); an `escape` close is counted as a TELL in ES's derived wariness (the jailers' sharper watch — §3.8's idiom, zero new state); NOTHING joins the dwell set (a caught rescuer is held under the landed `caught_spying`). The catch law above is unchanged otherwise.]

### 3.4 THE ITINERARY — chained legs, superlinear stacking, the standoff

Itinerary ≤ 3 stops (ESPIONAGE_TUNING.MAX_ITINERARY_STOPS = 3, mint-refused
with reason `itinerary_too_long`), any declared/covert mix per stop (the
composite mission: a diplomatic leg extending covertly from its destination
is `[{A, face:'declared'}, {B, face:'covert'}]`). Superlinear leg risk
(refinement 8 — 2-3 is a CHOICE, not free efficiency):

```
legStack(k) = 1 + LEG_STACK · (k − 1) · (k − 1)     // k = 1,2,3 ⇒ ×1, ×(1+LS), ×(1+4·LS)
```

quadratic in stop index (proposed LEG_STACK 0.35 ⇒ ×1 / ×1.35 / ×2.4), plus
the taint stake grows with every stop (§3.5 — exposure retroacts over ALL
legs), which is the real deterrent. Reachability: all three rungs trivially
reachable; pinned with a three-stop fixture.

**The standoff (owner addition D).** The reach-vs-standoff choice is a
deterministic RISK ASSESSMENT read at the last safe stop:

```
assessedRisk = catch01(target) · clusterHostility01(target)   // the approach topology —
                                                              // the CLUSTER, not just the gate
             · flawDistortion(npc)                            // pride under-reads, cravenness
                                                              // over-reads — DISTORTS the
                                                              // assessment itself
appetite     = riskToleranceOf(npc)                           // roads/state.js:319 (npc-grain,
                                                              // personality-derived — imported)
             · (1 + DESPERATION_W · homeDesperation01)        // couples to §3.12's urgency
standoffBar  = appetite · (1 + INTEGRITY_W ·                  // addition H: the THIRD axis —
                 perfPoison01(satellite, home))               // a hostile-to-home satellite is
                                                              // physically safe and
                                                              // informationally POISONED
                                                              // (§3.7's performance tap), so
                                                              // poison RAISES the bar for
                                                              // standing off
standoff     = assessedRisk > standoffBar
```

`flawDistortion` is a closed table over the flaw classes `riskAppetiteOf`
(npcLadderGoals.js:95) already interprets — extended, not forked; keyed
deterministically on the npc; the choice is RECEIPTED IN CHARACTER ("pride
carried him through the gate" / "he watched from the river town instead").
A standoff mission marks `covert.standoff`, plateaus the gradient (§3.7's
SECONDHAND_CAP at tap `'performance'` — the standoff NEVER enters, so it
never taps deeper; addition H's ruling), and returns home capped — safe,
incomplete, honest, and possibly POISONED: the reach-vs-standoff choice is
the owner's THREE-WAY trade — risk vs confidence vs integrity — and the
receipt names all three in character.
[CURED 2026-10-20 (fp-final P5) — P5W-4 (L-BD 11c; the owner, BOARD 2026-10-18 22:15 EDT, verbatim: "and spies are instructed in specific hidden paths to their destinatoin in the same vein") — THE OPERATIVE'S HIDDEN-WAY ROUTING ARM. Master already admits a covert errand to the hidden rung (`covert_envoy` is a member of `HIDDEN_PATH_KINDS`, above); what is new is WHICH ways: an operative is ROUTED only on the ways its SENDING court KNOWS — the court's one known set, THE BODIES' union `knownTrailsOf(worldState, snapshot, settlementId, tick)` (`DESIGN_FP_ARCH_BD.md` §2.3: the learned ways ∪ the warden office's ways), widened by the ways its earlier operatives MAPPED in the target's land (a mapping mission's product enters that set through BD's one writer, `how: 'by_survey'` — but §3.6's THREE PRODUCTS are a closed set, so the survey is a DECLARED FOURTH product row at ES-3's unit, DARK until carried: the coherence fold's §3.1 ES INBOX (3); until then `by_survey` stays DARK, BD's P5C-23 bracket) and the ways BOUGHT from a broker (`DESIGN_FP_ARCH_IN.md`'s P5 bracket; `how: 'by_broker'`) — a BELIEF read of the home court's knowledge, never the ways' truth: a way the court believes open and that has since been WATCHED is exactly where its spy is caught. THE CHOICE is part of the mission's COVER and COST, decided at the mint by the same personality the standoff reads (`riskToleranceOf(npc)`, the doctrine's `method`): a careful court sends by the quiet way (slower — the ladder's ONE hidden price, `gradeLegMultiplier('hidden')` 2 in season — and unseen where unwatched), a cheap or hurried one by the road (faster, exposed); urgency (§3.12's forcing list) prefers the road; the choice is the same seeded race a body's route is (BD11), registered as a fork row in its wave (L10 (a)). THE CATCH on a way is THE PATROLS' trail arm, never a second catch: zero where the target court does not know the way; the round's coverage at its junctions where it does (PR §8.2; BD §5.2) — so §3.3's catch model gains the ROAD as an exposure point only through that arm, and the dwell-detection gauntlet (ES-2) is unchanged. THE CONFESSION: a caught operative is one of the ways a town LEARNS a way — it gives up the paths it was given, HOW MANY decided by this volume's interrogation/loyalty read (§3.10's hold; the count written to the captor's known set through BD's one writer, `how: 'by_catch'`), the captor learning what the operative TELLS (belief), never the sender's whole set. Receipts name the way and what it avoided ("Tolle's spy came by the goat path: Kell's column held the road"). TIER: spatial canon ∧ belief infoMode; live only where THE BODIES' `hiddenWaysEnabled` and THE PATROLS are lit; DARK ⇒ today's covert route plan (master's hidden-rung admission, no known-set filter), byte-identical. WAVE: ES-2's route plan carries the arm (its one call site that passes `covert_envoy`), after BD-5 lands the known set. PLAUSIBLE until that wave's car measures `buildEnvoyRoutePlan`'s covert call taking a known-set filter without a second planner. The `how` words are BD's closed `TRAIL_LEARNED` (`by_catch · by_survey · by_guide · by_broker · by_pursuit · by_dm`); this bracket names ES's half of `by_survey`; the word lights only with the fourth product's row above.]

### 3.4b THE ROOTED DWELL — gather or govern (owner addition G)

A spy who has reached a stop MAY dwell ROOTED past the minted `stayTicks` to
keep gathering — re-sampling the stop's read once per DWELL_INTERVAL_TICKS
(each re-sample appends a fresh `gathered` entry with staleness reset; in
magic worlds each re-sample SENDS per addition E — the live feed). The two
accumulating costs, both derived, zero new state:

- **Capture odds climb by dwell band.** `dwellRamp(intervalIdx)` — a closed,
  monotone band table (proposed [1, 1.25, 1.6, 2.1] over intervals 0..3+,
  reachability pinned) multiplied into §3.3's catch roll, place-dependent by
  construction (it multiplies the target-side terms — vigilance and local
  suspicion accrete around a face seen too long in the same market).
- **Prolonged absence feeds the PROMOTION-RISK REGISTER (§3.14).** The
  register is a derived read over away-weeks; every interval rooted is a week
  the bench lightens (§3.11) and the career decays under contest (§3.14).

**The gather-or-govern choice** is a per-interval deterministic read in the
standoff read's exact shape: continue while the demand (§1) is unmet AND
`dwellRisk < appetite`, where dwellRisk folds the CLIMBING catch (the ramp's
next band) and the promotion pressure (§3.14's register read — STAGED: the
term joins when ES-5's Q1-signed arm lands and is declared-absent before,
§3.14), and appetite
is the same temperament × flaws × home-desperation composition — temperament
decides the trade IN CHARACTER ("he stayed a third week; the ladder at home
did not wait"). Self-limiting BY CONSTRUCTION: the ramp and the register both
climb monotonically while appetite is fixed, so every rooted stay terminates
— pinned with an executed longest-stay fixture (DWELL_RESAMPLE_CAP is the
hard bound; the soft bound must bind FIRST on every reachable input, or the
cap is a dead band). Departure re-times the next leg's departure through the
ONE amender (§1) with a receipt; every clock downstream (the home miss clock
§3.8, expected-return) reads the MINTED plan — a rooted spy overshooting the
plan looks LOST from home (mundane), which is exactly the owner's drama: the
register accrues, the silence inference fires, and the man is gathering.

### 3.5 THE TAINT MODEL — public face, actual itinerary, retroactive exposure

The cover story is SP-D's `declaredPurpose`/`truePurpose` seam consumed
whole. Standing consequences while covert (refinement's "less credible on
any simultaneous open purpose"): any DIPLOMATIC/TRADE product carried by a
journey with a covert stop grades ONE RUNG LOWER on the testimony ladder
(`readEnvoyTestimony`'s discredited-source idiom — the demotion is applied
at the account-grading boundary, never by editing the ladder), and the seat
that KNOWINGLY sent a tainted double-purpose journey owns that discount as a
receipted choice at mint.

**Exposure retroacts over ALL legs (refinement 3 — the leg cap's gamble):**
on capture (§3.3) or post-hoc exposure (the corruption web's exposure
machinery, or a REFUTE by the counterparty's own spies), the taint cascade
fires ONCE, through existing machinery:
1. Credibility ⟨F1⟩: the person's stock charges through
   `npcCredibility.freshLieExposureFor` → the ladder's
   `maintainMarks(..., lieExposure)` one tick later (the working template,
   measured); the HOME COURT's settlement credibility charges through the
   covert-exposure PAIR — `SIGHT_TUNING.EXPOSE_CHARGE01` (0.8, "the
   exposed-watcher credibility charge") applied deception-class to the
   watcher, at informationStatecraft.js (SIGHT_TUNING is defined AND consumed
   there; built and tuned). TWO EXPOSE families exist and an implementer must
   not conflate them (both re-measured): SIGHT_TUNING's PAIR
   (EXPOSE_CHARGE01 0.8 / EXPOSE_GRIEVANCE_W 0.3 — the exposed covert
   WATCHER: charge on the watcher + target→watcher grievance, incidentType
   `'spy_exposed'` — THE precedent for a caught spy's home court, and this
   program REUSES its incidentType) vs LIE_TUNING's TRIPLE (EXPOSE_CHARGE01
   1 / EXPOSE_GRIEVANCE_W 0.3 / EXPOSE_CONTRADICT_BANDS 2 — the exposed
   LIAR, defined in disinformationPlant.js, re-exported and consumed by
   informationStatecraft's lie arm; §3.6's REFUTE couples to THAT family's
   contradict-bands arm, not this one).
2. Grievance: target→home `deception`-class grievance (SIGHT_TUNING's
   EXPOSE_GRIEVANCE_W road, incidentType `'spy_exposed'` — the existing
   spelling, reused not re-minted), scaled INVERSELY with target hostility
   (refinement 6: a HOSTILE
   target expects spies — small charge; a FRIEND caught hosting one takes
   the betrayal event: full grievance + trust collapse (alliance-label
   re-read through the existing belief machinery) + the casus arm, §5 row 1).
3. Deals re-read: every term sheet RATIFIED from a tainted journey is
   re-graded — `selectBelievedAccount`'s `politicalAct` flag marks the
   seat's choice to stand by tainted terms; nothing un-ratifies (CR-WIRE-B's
   nothing-binds-unratified stays inviolate; the re-read is reputational,
   not contractual — the treaty stands, the WORD of the court that carried
   it is what cheapens).
4. Herald: `espionage_exposed` (public), with the dm-only mission beats
   retroactively surfaced (refinement 9's exposure road — covert becomes
   news only through exposure).

### 3.6 THE THREE PRODUCTS — exact belief-write shapes (all through the report road)

**JUDGMENT J-ES-5 (the writer boundary).** All three products write through
`reconcileBelief` (exported, measured at beliefMap.js:591) as SYNTHETIC
BeliefReports — the generosityKernel precedent — and NEVER through
`applyBeliefOverrides`: the paid-plant road's `PAID_PLANT_OVERRIDE_KEYS` is
an exact-6-key closed envelope that would silently reject any payload
carrying an axis field (measured — the sharpest hazard in census 6), and it
is the LIAR's road besides. The picture channel (`ENVOY_PICTURE_PLANT_FIELDS`
/ `NEGOTIATION_EVIDENCE_KINDS`) is NOT touched — J-INA-2's two-channel
ruling extends: espionage products feed the persistent BELIEF-AXIS channel;
in-errand negotiation pictures stay the war lane's ephemeral state, and
future picture MINTS get better counterpart legs for free because
`buildEnvoyNegotiationPicture` already reads `beliefRecord` at mint.

The synthetic report, common shape (per product deltas below):

```
{ hopCount: 0,                          // first-hand
  completeness01: max(FLOOR, c),        // ⚠ floored > 0 — reconcileBelief carries a
                                        // documented degenerate zero-weight guard for
                                        // non-rumorNetwork callers (measured)
  accuracy01: a,                        // ≤ the gradient's cap for the stop it was
                                        // gathered at (§3.7); 1.0 only at the target
  independentSources: 1,
  sourceId: <the agent's nid>,          // weighed by the credibility closure — a
                                        // discredited agent's word is worth less,
                                        // which is the taint model reaching the
                                        // product for free
  arrivalTick: <landing tick> }         // §3.7 decides WHEN it lands
```

- **CONFIRM** (`confidence01` up, staleness reset): the report ASSERTS the
  current believed value with first-hand accuracy — `reconcileBelief`'s
  existing arithmetic raises `confidence01` by `weight · CONF_GAIN` with no
  contradiction term, and stamps `lastUpdateTick` (the two slots census 6
  measured as exactly the product's shape — zero new keys, zero new tuning;
  `decayedConfidence` is already the inverse). Consumers move for free:
  `generosityKernel.believedNeedScale` = confidence01, so a CONFIRM raises
  aid responsiveness; the sovereignty appraisal's legs firm.
- **ACQUIRE** (a leg the court lacks): the report carries the observed value
  for each targeted `legRef` — the axis fields fold through `foldBeliefAxes`
  (axesActive), filling `conditionsBands.{tierBand,storesBand,
  routePositionBand}` (SP-B's exact spellings — the closed-vocabulary seam,
  §5 row 4; ⟨F5⟩ `pullBand`, SP-B's fourth conditionsBands key, is NOT a
  legal legRef and is never written by any ES product — §1's mint rule) and
  the core slots (`strengthBand`, `readiness`); `exports`
  knowledge lands as the belief-side fill that `peaceTermsAppraisal`'s
  truth-read of loserExports was built to be replaced by (census 6 §4 — a
  banded slot with a live consumer).
  [CORRECTED 2026-10-16 (coherence fold) — AS BUILT (ES-3): the TARGET read carries `conditionsBands` and the declared `allianceLabel` ONLY — "no strengthBand, no readiness, and NO faithLabel" (espionageProducts.js:28-31); strength, readiness and faith come only from a HOST's belief row at a waypoint (:32-40). `exports` is not a legRef (see the bracket at §1). WC's "spies count banners" therefore has no road.]
  [RULED BY DELEGATION 2026-10-16 (OD-FC-12 — 2026-10-16 (coherence fold §3.2.15) — the axes these products fold (`conditionsBands`, via `foldBeliefAxes`) are exposed to the SP-B × M9b ally-share ghost-write (PLAUSIBLE, reasoned): an adopted ally share replaces the whole seat record (beliefMap.js:1117) and drops every SP-B axis, and the next report re-seeds an absent axis from ground truth (beliefAxes.js:225) — a spy-filled leg could be erased by an ally's share and re-anchored to truth. A measurement car rides the next spine lane; a confirmed cure is a one-time full_simulation belief shift the owner signs.]
- **REFUTE** (first-class "it is not what we believe" — the dramatic
  engine): the report asserts the observed value where it CONTRADICTS the
  prior — `reconcileBelief`'s contradiction term (`CONTRA_W · |obs − prior|`)
  collapses `confidence01` in the same fold that re-anchors the value, and
  first-hand accuracy ≥ CAT_ADOPT_ACCURACY (0.6) lets a wrong
  `allianceLabel`/`faithLabel` be CORRECTED through the existing categorical
  adoption gate. **JUDGMENT J-ES-6:** the REFUTE receipt lands in NEWS
  (`espionage_refuted`, dm-only until exposure), never on the ledger row —
  BeliefRecord carries no receipt field, and `beliefMisjudgmentNewsEntries`
  is the precedent for narrating a belief/truth gap while persisting zero
  bytes. Free consequence, measured: a REFUTE moving the audience's band off
  a planted lie crosses `LIE_TUNING.EXPOSE_CONTRADICT_BANDS` (⟨F1⟩ the
  LIAR-side triple — defined disinformationPlant.js, consumed at
  informationStatecraft's lie arm) and accelerates
  `processLies`' exposure arm — spies naturally burn enemy disinformation,
  with no coupling code at all. Addition H sharpens this: THE DELTA tap
  (§3.7 — inside asset) hands the spy the lie ITSELF ("X speaks one thing
  and believes another"), so a delta-tapped REFUTE is counter-disinfo by
  access depth — the highest-value product, exactly as the owner ruled.

[ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 A.4 · MG-r1-8 · `cure/D-MG-r1.md` §4 ES) — ESPIONAGE IS ONE OF THE THREE DECLARED UNIT-SIGHTING PRODUCERS. THE MENACE's `recordSighting` caller list is widened by declaration to three UNIT producers — THE PATROLS' look/screen, WAR CIRCULATION Arc A's contact, and ESPIONAGE's product (ES owns this row): a spy who SEES a hostile unit (an army, a wing, a fleet) at a stop writes ONE `unit` sighting (its place and `heading`, OD-MG-6 the owner's shape) through MN's one writer, beside the report road — belief, never truth. The three products above stay CLOSED (CONFIRM · ACQUIRE · REFUTE; the fold §3.1.17's "NO ES product" ruling stands): the unit sighting is a write to MN's sighting row, not a fourth product; ES's unit names which arm writes it. Until the first producer lands, THE MOVEMENT GRAMMAR's feint, `believedHeadingOf` and `believedMotiveOf` stay DARK. THE MOVEMENT GRAMMAR NAMES §3.4b's rooted dwell and a planned stay as a spy's held place (MG §3.3) — no change to ES.]

### 3.7 THE CONFIDENCE GRADIENT + TAP ORDER + TRANSMISSION — lose the spy, keep the intel

**The tap ladder (owner addition H — ruled, vetoable): a spy taps BY ACCESS
DEPTH and can NEVER report purer than their access.** Closed set
`TAP_LEVELS = ['beliefs','delta','performance']` (totality-exported,
codepoint-sorted; semantic depth order performance < beliefs < delta).
**JUDGMENT J-ES-16 (the tap assignment rule):** the tap at a stop is derived
from HOW the agent is present — never chosen freely:

- **`performance`** — a `face:'declared'` stop (an open visitor hears the
  official version) and EVERY standoff read (the standoff never enters —
  §3.4). The read is the host's OUTBOUND TELLING of the subject: its belief
  rows OVERLAID by its own active statecraft — where the host carries a live
  LIE record about the subject (the disinfo ledger rows, liarId = host), the
  told version carries the ASSERTED band, not the believed one; deliberate
  mutation toward the asker is priced by the measured leaf
  `lieWillingness({malice01, lawfulness01, desperation01})`
  (disinformationPlant.js, re-exported by informationStatecraft — imported,
  never respelled). `perfPoison01(host, home) = lieWillingness(host) ·
  hostileRung01(host→home)` (the T4 rung table normalized) discounts the
  cap: a hostile-to-home host's markets are physically safe and
  informationally POISONED — the waypoint-poisoning consequence, and §3.4's
  third standoff axis.
- **`beliefs`** — a `face:'covert'` stop the agent has ENTERED (embedded):
  the host's REAL belief rows about the subject, post-organic-drift,
  pre-performance (the `envoyRumorPatchFor` honesty idiom — "never fills
  either gap from truth"); nobody sees past the host's own errors — the
  epistemic constitution holds. A host with no belief about the subject
  yields NOTHING (the honesty negative).
- **`delta`** — embedded WITH a live inside asset at the stop
  (`insideAssetAt(stop, home)`, §3.3): both layers PLUS the lie itself
  detected — the host's active lie records about the subject exposed to the
  agent (counter-disinfo by access depth; feeds §3.6's REFUTE).

**The gradient (owner addition B, tap-composed).** At each stop the agent
gathers a read about each subject, appended to `covert.gathered` with its
`tap`:

```
secondhand cap:  accuracyCap01 = SECONDHAND_CAP · hostConfidence01 · staleness(host record)
                 (proposed SECONDHAND_CAP 0.75; the directive's "hop
                 distance" term rides INSIDE hostConfidence01 — the host's
                 own record quality is already hop-priced by the rumor
                 substrate (content intactness falls monotonically with
                 relay hops — the estate's executed I2 measurement), so no
                 second distance term is minted)
                 × (1 − PERF_POISON_W · perfPoison01(host, home))   // performance tap only
first-hand:      cap 1.0 ONLY at the target stop, ONLY at tap 'beliefs' or
                 'delta' (entered — H: purity requires access; a declared-face
                 visit to the target reads the target's SELF-performance:
                 cap PERF_SELF_CAP < 1, its paraded granaries)
                 [CORRECTED 2026-10-16 (coherence fold) — as built the first-hand target read carries conditions + alliance only; see the bracket at §3.6 ACQUIRE.]
```

Home discounts by tap level × host trust at landing (the report's
`accuracy01`/`completeness01` carry the discount — the BeliefReport shape is
UNTOUCHED; the tap itself is receipted, in house voice, verbatim the owner's
three registers: "as told in X's markets" (performance) / "as X itself
believes" (beliefs) / "X speaks one thing and believes another" (delta)).
Consequence, by construction: the information-rich route is the dangerous
route (the target's neighbors know most and watch most — their wariness is
highest when the tell is live); the standoff plateaus at the second-hand
performance cap; and the ONLY road to a pure read runs through a covert
entry — which is the owner's whole design in one arithmetic.

**Landing (chair refinement 2 + owner addition E), the asymmetry stated as
law:**
- **Magic (pair gate TRUE at home + the current stop):** every gathered
  partial and every product SENDS at the stop's confirmation tick —
  `gathered[i].sentHome = true`, the synthetic report's arrivalTick = the
  send tick, and a deferred decision (§3.12) may resolve EARLY when streamed
  confidence crosses the mission's DEMAND threshold (§1 — one bar, two
  consumers). A ROOTED stop (§3.4b) sends per re-sample interval — the live
  feed, addition G. Capture afterward loses the SPY, not the
  intel: everything `sentHome` stays landed; everything unsent dies.
- **Mundane:** NOTHING lands until `markEnvoyHome` — the products fold at
  the home mouth (the existing delivery slot in the pulse order), and a
  capture loses the spy AND every gathered partial (the gradient dies with
  the man). The patience-timeout band (§3.12) carries the drama.

Pricing: dormant behind `magicEconomyActive` (dark, test-forbidden to light
— measured); when W-K lights, the send prices through `magicExploitationGate`
and the banded `QUERY_PRICE_BANDS` prose (delayTicks = 0 zeroes the distance
surcharge in the existing formula — no new term), per J-ES-7's hybrid arm.

### 3.8 THE MISSING-NPC TELL — derived wariness, zero new state

**JUDGMENT J-ES-8 (the spelling and the shape).** The derived read is named
`wariness01` (measured collision-free; `vigilance` is a display tag on watch
institutions — census 2's recorded collision; `suspicionOf` is IN-3's
court-level counterintel read). It is DERIVED PER TICK and NEVER STORED —
the only shape the substrate permits: movement news cannot subject a person
(rumorNetwork.captureContent carries only settlementIds into partyIds —
measured), and npcCirculationBelief makes never-stored a structural property.

```
wariness01(target, tick) =
    W_TELL  · min(1, overdueForeignNotables(target, tick) / TELL_CAP)
  + W_CAUGHT · min(1, recentCovertHolds(target, tick, LOOKBACK) / CAUGHT_CAP)
```

⟨F3⟩ **`overdueForeignNotables` — the visibility predicate, defined
PRECISELY over what the target can lawfully observe.** It counts, from the
target's OWN belief position (observer→other, never self-belief — HZ10),
foreign notables it has reason to believe missing, where "reason to believe"
is EXACTLY the union of:
  (a) **declared-face schedules it can see**: errand rows whose PUBLIC face
      (`declaredPurpose` + declared itinerary stops — the SP-D projection's
      audience-lawful fields, never `truePurpose`, never any `covert.*`
      field) names the observer or a settlement in its cluster, and whose
      DECLARED schedule has lapsed — an announced visit that never arrived,
      an announced guest who never left on time; and
  (b) **absence-beliefs it already holds** through the npcCirculation
      observer-side belief surfaces (the `believedNotorietyRank` family —
      the same observer/subject grain, measured at npcCirculation.js),
weighted by `believedNotorietyRank` (the notable are missed loudly).
NEVER from bare covert rows: `advanceEnvoySilence` (envoyErrand.js) is
HOME-side — a court inferring about its OWN envoys — and generalizing it
across courts would read foreign errand state no court can see. THE LAW,
pinned as an anchored negative (ES-5): an in-schedule, fully-covert mission
contributes ZERO wariness at its target — a covert mission's existence
must not leak into a foreign court's derived state through any unreceipted
channel (the L3/audience-projection boundary; it would also partially cancel
the owner's "covert = less likely captured" for free, which is a design
inversion, not just a leak).
`recentCovertHolds` counts `caught_spying` holds it opened within the
lookback — a court that just caught one spy checks the next caravan harder
(holds are the target's OWN state: lawfully observable).
Consumed as §3.3's `wariness` multiplier. When IN-3 lands, `suspicionOf`
gains these two terms in ITS derivation and this leaf CONSUMES suspicionOf
where `counterIntelEnabled` is lit (one derivation, no fork — §5 row 9);
the minimal own-read above is the declared dark arm. [RULED 2026-10-16 (coherence fold §3.1.12) — ONE suspicion derivation: IN-3's `suspicionOf`. As built it is NOT WIRED — suspicion.js:8-10 records that ES carries `espionageMath.js :: wariness01Core` until its own lane composes the read, and no espionage module imports `suspicionOf` — so two derivations stand, declared only in a code comment. `wariness01Core` BECOMES A CONSUMER of `suspicionOf` where `counterIntelEnabled` is lit and keeps the minimal own-read as the dark arm; the composing lane is ES-5's next unit. HB's `awareness01` likewise consumes it (its truth read of `sightPostures` is struck).]

**The home-side miss clock (JUDGMENT J-ES-14):** the home court NOTICES an
overdue mission at `expectedReturnTick + MISS_GRACE · (1 −
operativeNotoriety01)` — a pillar is missed in days, a minor in weeks —
which drives the home-side silence inference (`applyEnvoySilenceInference`,
reversible, receipted — the existing machinery fires for covert errands
exactly as for diplomatic ones) and the `espionage`-flavored worry beat
(dm-only). The home side reads its OWN rows — no visibility predicate needed
(⟨F3⟩ home knows its own missions; the target-side predicate above is the
one that must be fenced). A ROOTED spy (§3.4b) overshoots the minted plan
BY DESIGN, so the miss clock fires while the man still gathers — the
gather-or-govern cost made observable. The counter-play is the directive's
own: the composite mission's
OFFICIAL itinerary is the true cover for the absence itself — an absence
with a declared face raises no tell until the face's clock also runs out.

### 3.9 THE DOCTRINE READ — alignment on both axes, banded and receipted

The per-court espionage doctrine is a `readConquestIntent`-shaped PURE leaf
(the house idiom, census 4 §2c — closed word tables in, `bandInput`
returning null never a default, one frozen tuning, sorted totality exports,
`unknownDoctrine(why)` at the RESOLUTION gate):

```
readEspionageDoctrine({ courtId, orderWord, natureWord })
  → { known, targeting, method, frequency01, employment, receipt }
```

- `natureWord` = `natureWordFor(settlementAlignment(item, ws).malice01)` —
  VERBATIM the estate's one moral ladder (exported precisely because J-WR-10
  forbids a second spelling).
- `orderWord` = `lawWordFor(settlementAlignment(item, ws).lawfulness01)` —
  **the ONE missing four-line leaf, minted ONCE at ES-0 and exported**, with
  `warSeatBooks.js`'s module-private `lawfulnessBand` retired to it (or the
  estate gains a fourth law-band spelling — census 4 §5.1; coordinate with
  INT-1, §5 row 10). **JUDGMENT J-ES-10:** doctrine-LOCAL thresholds 0.60/
  0.40 (vs natureWordFor's 0.67/0.33) — the reachability arithmetic (census
  4 §6, executed) shows the 0.67/0.33 middle band is so wide that neither
  the most lawful seat archetype nor the most lawless crosses ALONE, so a
  tails-only doctrine would look inert; 0.60/0.40 reads the SAME one axis
  (no second spelling) through one vetoable frozen constant pair. The
  measured range [0.031, 0.838] also bans any pin asserting 0, 1, or >0.85.
- The `unknown` arm is produced ONLY at resolution (no court/no snapshot row
  — the judgeSovereigntySale gate pattern); the axes are total and finite,
  so an axis-side unknown pin would be vacuous (census 4 hazard 4).
- The RECEIPT quotes `deriveSystemVariable('law_order', s).contributors`
  sentences for PROSE ONLY, never the number (the patron double-count
  hazard: the deity law axis feeds both computeLawfulness and deriveLawOrder
  — blending counts the patron twice, invisibly in deity-free worlds).

**Outputs (closed vocabularies, each with its totality export):**
- `targeting`: `foes_only` (benevolent) · `rivals_and_foes` (balanced) ·
  `all_courts` (malicious — friends are watched too; the friend-case catch
  in §3.3 exists because malicious courts create it).
- `method`: `lawful` ⇒ merchant/diplomatic covers, no hidden ways
  (`covert_envoy` franchise unused), standoff-leaning; `lawless` ⇒ hidden
  ways, deeper itineraries, target-reach-leaning. **RESPELLED at the
  2026-08-05 fold from `chaotic`** — CR-ES-3 makes `lawWordFor` emit the
  CONSUMER law vocabulary, so a `chaotic` arm would be keyed on a word the
  one minted law-word function never returns (the rider below, point 2).
- `frequency01`: dispatch cadence weight (lawful-benevolent lowest,
  lawless-malicious highest) — consumed by the autonomous cadence (ES-5)
  and the deliberation patience (§3.12).
- `employment`: `strict` (careful vetting — `vetVolunteerEnvoy` quality
  'careful'; abandons less; ransoms paid) · `lenient` (hurried vetting;
  abandonment-prone — feeding the existing `abandoned_to_captivity`
  grievance).
- CAPTOR-side leniency (the caught spy's fate): the captor's own doctrine
  words shape `captorRansomChoice` inputs — benevolent-lawful releases or
  ransoms clean; malicious holds long (§3.10's shifted dwell), `lawless`
  swings by keyed hash. The seat-vocabulary break (census 4 §5.3: warSeatBooks
  emits `chaotic/benevolent/contested`, testimony/ransom accept
  `lawless/merciful/holding` — a wired row VANISHES silently) was chair
  question Q3, and Q3 is RULED as **CR-ES-3** (§7).
  ⚠️ **THE GATE IS THE RETARGET, NOT THE RULING — DO NOT READ "RULED" AS
  "BUILDABLE".** CR-ES-3's operative clause, restored here verbatim from §7
  because THIS is the section an ES-2 implementer builds from: *"Until that
  lands, ES-2 ships the captor-leniency arm DARK behind the ruling's absence,
  declared not silent."* What must LAND is the vocabulary unification itself —
  the three module-private word functions in `warSeatBooks` retargeted to the
  CONSUMER vocabularies (`lawless`/`merciful`/`holding`), with the both-vocab
  equality pin, in the ES-0 commit that carries the `lawWordFor` mint. Until
  that commit exists in the tree, this sub-arm ships DARK — DECLARED, never
  silent. An implementer who treats the ruling's existence as the gate lights
  this arm against a producer still emitting `chaotic/benevolent/contested`
  and re-creates the silently-vanishing wired row the ruling exists to
  prevent. (The `lawless` spelling in the bullet above is already the
  POST-retarget word — see the amendment note at the top of this section; it
  is what the arm will read, not what the producer emits today.)

**⚠️ CR-ES-3 — THE EXECUTED-MEASUREMENT RIDER (added at the 2026-08-05 fold's
revision; THE RULING'S SUBSTANCE IS UNTOUCHED — this corrects its COST note
only, and the correction is measured, not reasoned).** CR-ES-3 stands exactly
as signed in §7: unify on the CONSUMER vocabularies by retargeting the three
module-private word functions in `warSeatBooks`, with a both-vocab equality
pin. What the ruling under-priced is what else must move in the SAME commit.

1. **THE BREAK IS EXACTLY ONE RUNG PER LADDER — measured live, not inferred.**
   ⚠ **AMENDED AT THE ES-0 LANDING (2026-08-05), MEASURED:** only TWO of the three are
   module-private FUNCTIONS. `lawfulnessBand` and `moralityBand` are functions; the
   security ladder is an INLINE TERNARY at the `securityBand` assignment inside
   `readWarSeatBooks`. The ruling's substance is unchanged — three rungs still move —
   but an implementer looking for a third private function will not find one.
   `warSeatBooks.js`'s `lawfulnessBand` returns `chaotic|balanced|lawful`,
   `moralityBand` returns `benevolent|balanced|malicious`, and the security
   read emits `secure|contested|precarious`. The consumers' frozen sets are
   `RANSOM_SEAT_LAWFULNESS`/`TESTIMONY_SEAT_LAWFULNESS` =
   `['lawless','balanced','lawful']`,
   `RANSOM_SEAT_MORALITY`/`TESTIMONY_SEAT_MORALITY` =
   `['merciful','balanced','malicious']`, and
   `*_SEAT_SECURITY` = `['unseated','precarious','holding','secure']`. So the
   producer and the consumers AGREE on every rung but one apiece —
   `chaotic`↛`lawless`, `benevolent`↛`merciful`, `contested`↛`holding`. The
   silently-vanishing row the question names is REAL and located:
   `envoyTestimony.js`'s credibility-first arm tests
   `court.lawfulnessBand === 'lawless'`, a value the producer cannot emit
   today. Retarget three rungs, not three vocabularies.
   ⚠️ **AND `benevolent` LIVES IN TWO LADDERS — only ONE moves.** This
   program's `natureWord` comes from `natureWordFor` (the estate's ONE moral
   ladder, exported from `conquestDoctrineStage.js`, emitting
   `malicious|benevolent|balanced`), which CR-ES-3 does NOT touch:
   `natureWord` stays `benevolent`. The word that becomes `merciful` is
   `warSeatBooks`'s module-private `moralityBand`, a different read for a
   different consumer. A retarget that follows the WORD instead of the SYMBOL
   would break the doctrine's own targeting arm above.
2. **`lawWordFor` IS SPELLED IN THE CONSUMER VOCABULARY —
   `lawless | balanced | lawful` — AND §3.9's `method` ARM RESPELLS IN THE
   SAME COMMIT.** The `method` output above reads `lawful` ⇒ covers /
   `chaotic` ⇒ hidden ways. `lawful` is already a consumer word; `chaotic` is
   not. Ship them together and the chaotic arm is keyed on a word the ONE
   minted law-word function never returns — a DEAD BRANCH. Spell
   `lawWordFor`'s low rung `chaotic` instead and the estate gains a FOURTH
   law-band vocabulary, which J-WR-10 forbids and §5 row 10's one-spelling
   scan reds. **`method` becomes `lawful` / `lawless`.** Both are named here
   so ES-0 cannot land the leaf and leave §3.9 pointing at the old word.
3. **THE RETARGET IS CROSS-FILE WAR-LANE WORK WITH DECLARED GOLDEN-SHIFT
   EXPOSURE — consumer-side edits land in the SAME commit as the both-vocab
   equality pin.** Measured consumers of the producer's band VALUES:
   `envoyNegotiationPictureBuilder.js` reads the literals directly
   (`books.moralityBand === 'benevolent'` is the one that moves; its
   `'malicious'` and `lawfulnessBand === 'lawful'` reads are on unchanged
   rungs); `warTermination.js` re-emits BOTH bands as `rulerLawfulnessBand` /
   `rulerMoralityBand`; and `settlementStrategy.js` enumerates those two keys
   in its frozen surface — so the retargeted words flow into a surface whose
   shape is frozen, and any golden or snapshot that captured `'chaotic'` or
   `'benevolent'` in them SHIFTS. That shift is LEGITIMATE and one-time, and
   it is DECLARED here rather than discovered at the gate. Five test files
   carry the band literals today and are the shift's blast radius.
   ⚠ **AMENDED AT THE ES-0 LANDING (2026-08-05): THERE IS A FOURTH CONSUMER, AND IT
   IS THE DANGEROUS ONE.** `warRulingsNews.js` looks the security band up in a WORD
   table — `BAND_WORD[row.band || row.refusalCostBand || row.rulerSecurityBand]` — and
   `rulerSecurityBand` really does reach it, because `peaceDecisionRulingEvidence`
   spreads the whole `warTermination` receipt onto every evidence row. A retarget that
   moved the producer's rung without moving that KEY drops the `{band}` interp slot out
   of the WR-5 receipts SILENTLY: no exception, no red, just a poorer sentence. The
   landing moved the key `contested` -> `holding` and KEPT THE WORD (`'uncertain'`), so
   the rendered prose is byte-identical for the same world. Measured blast radius at
   landing: FOUR src consumers (this one, `envoyNegotiationPictureBuilder`, plus
   `warTermination`/`settlementStrategy` which pass the values through by KEY and need
   no edit) and ONE test file, not five — `envoyTestimonyWr7c` and `ransomChoicesWr7d`
   already spell the consumer vocabulary, and `sovereigntyIntentWr10` /
   `sovereigntyMarketStageWr10w` only assert unchanged rungs. NO committed golden
   captures a seat band, so the declared golden shift did not materialise anywhere.
   `sovereigntyIntent`'s receipt prose does move, from "the seat stands contested" to
   "the seat stands holding"; no pin captured that sentence.
4. **DO NOT SWEEP THE WORD.** `warSeatBooks.js` also parses D&D ALIGNMENT
   TOKENS with `token.includes('chaotic')`, and `settlementPolitics.js` and
   `piety.js` do the same on their own inputs. Those are the alignment-token
   vocabulary, not the seat-band vocabulary, and a text sweep of `'chaotic'`
   breaks them silently. Retarget the three band FUNCTIONS by symbol; leave
   every token parse alone.

**Net:** the ruling is unchanged, the cost is three rungs + one doctrine word
+ three consumer files + a declared golden shift, and ES-0's charter carries
it. Vetoable in one clause like everything else; the veto restores the
producer vocabulary and leaves `envoyTestimony`'s `'lawless'` arm dead.

**Spine req 13 is ENGAGED ON BOTH AXES BY DESIGN — this is the program where
the Alignment line is the mechanism, not a declaration**: every ES wave's
ledger row names which doctrine outputs it consumes; ES-0's row declares the
axis derivation itself.

### 3.10 HOSTAGE + RANSOM SCALING — the caught spy is worth more, held longer

Capture opens a `foreignGuestHold` with cause `caught_spying` through THE ONE
writer (`openForeignGuestHold` — import pin proves no second, the WF-2b/TR-8
seam row already demands it). Scaling, all computed, nothing persisted
(WR-7d's ransom-persistence owner gate is inherited and untouched — claims
are computed, receipted, handed back):
- **Worth (JUDGMENT J-ES-15a):** `ransomWorthBandFromErrand(errand)` gains a
  covert arm — a row whose `truePurpose` is present lifts ONE worth band
  (common→notable→principal, capped). The function's ONE-ARGUMENT signature
  IS the enforcement (the CR-WIRE-A idiom, stated in census 3): the covert
  lift is readable off the mission row alone; no world-state importance can
  enter.
- **Term (JUDGMENT J-ES-15b):** the hold stores `heldSinceTick` ONLY (a
  duration field is refused by law); "longer hostage terms" is a LATER GATE
  — `DWELL_CUTS_COVERT = [4, 16]` (vs [2, 8]) selected by the same covert
  arm at `ransomDwellRead`'s banding, so a spy sits `fresh` twice as long
  before the ransom gate opens and `protracted` arrives at week 16. Derived
  on every read; zero new keys; the reachability of all three dwell bands
  under the shifted cuts is pinned with tick fixtures.
- Notoriety is already IN the worth via §3.1 (an important person carries
  terms-bearing/principal shapes more often) and in the home-side pressure
  via §3.8's miss clock. The abandonment arm (`HOME_ANSWERS` 'abandon' →
  `abandoned_to_captivity` on the man's own durable id) needs NOTHING new —
  a lenient-employment court abandoning its caught spy is the existing
  grievance firing through the existing choice table.

[ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 D.1 · E.7 · `DESIGN_FP_ARCH_OP.md` §15 ES row; the WR-7d slot itself is the war volume's — `DESIGN_WAR_RULINGS_ARCHITECTURE.md`, routed to the chair by this lane) — FOR THE OPPORTUNITY, WR-7d's PERSISTED demand (OPENED by P5 A.2) is the captive's HOME's one lawful road to a foreign-guest hold: OP reads the demand's ARRIVAL (its `demandLeg`, minted ONCE), never the computed claim above; a court learns its man is held only when a lawful road carried it home — the ransom demand's arrival, a roads ransom asked, or a telling that arrived. Until WR-7d's persistence wave lands, only roads hostages have a home call (OP-6's envoy arm is an explicit dependant of that wave).]

### 3.11 THE ABSENCE COST — the first consumer of a written-but-never-read roster

**JUDGMENT J-ES-9 (the amendment's implementation).** `isOffStage` is NOT
touched — it is THE one participation chokepoint consumed by six kernels,
and flipping travellers through it would move every golden in a lit-roads
world (census 1 H1). Instead, the absence effect is the FIRST CONSUMER of
`factionStates[fid].memberNpcIds` — written every tick by
`seatNpcsIntoFactions` with the in-source comment "so faction power can read
its roster", and read by NOTHING in src (measured: the writer, one empty
initializer, nothing else — census 1 H2):

```
presentShare01(faction, settlement) =
  1 − ABSENT_W · (awayMembers / max(1, memberNpcIds.length))
// awayMembers = members whose npc.whereabouts.state ∈
//   {traveling, visiting, returning}  (hostages are already off-stage —
//   unchanged); resolved through the roster (the whereabouts mirror is
//   self-healing, rewritten from the ledger each tick)
```

applied as a multiplier where `rulingBlocOf`/`blocDecisionFactor` weigh that
faction — in a LAZY LEAF consumed at the existing bloc-read sites, gated
`espionageActive` BY NAME, so: dark worlds (including roads-lit,
espionage-dark worlds) are BYTE-IDENTICAL, and the one-time bloc-math shift
in a lit world is DISCLOSED, named in the wave's commit, and fenced by its
own golden pair (⟨F6⟩ the disclosed-shift precedent: FP §9 seam row 6 —
"seatBooksEnabled lighting = pre-declared disclosed shift" — plus the house
honesty-about-shifts non-negotiable; NOT FP L9, which is the PROCESS law and
carries no shift clause — re-measured). Texture, so nobody
expects spy-driven bench-lightening: with importance-INVERSE covert casting
(J-ES-4), a PURE spy's absence costs the council little — minors carry
little weight — and the absence drama arrives through COMPOSITE missions
carrying notables on declared legs, which is coherent with the owner's
design. The PERSON-grain cost of a minor's long absence is §3.14's career
register, not the bench. The
faction's authored `power` is NEVER written (roads/state.js records
faction.power as a READ-ONLY derivation output — HZ6);
`conquestVoteWeight01` is deleted-and-pinned-absent and no second
court-vote-weight is minted under any spelling (HZ5). Rivals exploit the
window through machinery that already exists: the ladder's contest math and
factionCompetition read the same bloc weights every tick — a lightened
faction IS the two-books texture with no further code. [CORRECTED 2026-10-16 (coherence fold) — FALSE as measured; see the ES-5 block in §4: `factionCompetition.js` held no bloc read, and ES-5b BUILT the reach on its contest weight (`entry.power`). Felt value: expect almost none from a pure spy's absence (the paragraph's own texture note).]

**The amendment text (chair lands it, owner signs — Q1):** THE ROADS §1
law 5 gains one sentence in the amended-in-place voice: "AMENDED (espionage
era): travellers remain on-stage — but under `espionageEnabled`, a
faction's COUNCIL WEIGHT is discounted by its absent members' share
(`presentShare01`), and a long-absent member's LADDER STANDING feels
contest pressure while away (the promotion-risk register — gather or
govern); presence at the table is worth something, the notable abroad leave
a lighter bench, and the ambitious abroad leave an open flank. `isOffStage`
is unchanged." One amendment, two grains (§3.11 the bench, §3.14 the
career), one signature.

### 3.12 SPY-BEFORE-DECISION — deliberation, urgency, and the timeout

Owner addition A ("i leave that to you" — chair design accepted): courts MAY
defer a decision pending a confirmation mission, MUST NOT always wait.
Pure read, zero state (clocks derive from the mission row + the deciding
legs' `lastUpdateTick`):

```
deliberationRead({ court, decidingLegs, doctrine, urgency01, tick })
  → 'act_now' | 'dispatch_and_wait' | 'wait_expired'
```

- `dispatch_and_wait` requires: a deciding leg stale/low-confidence
  (`decayedConfidence` under DELIBERATION_CONF_FLOOR), doctrine
  `frequency01` × patience clearing the bar, no forcing urgency, and a
  castable operative (all the §3.1 gates). The dispatched mission's DEMAND
  band (§1, addition G) is set here — doctrine-shaped (patient courts demand
  `certain`; urgency lowers the bar) — and it is the SAME threshold the
  magic-arm early resolve reads (§3.7) and the grade is scored against
  (§3.14): one bar, three consumers, no second spelling.
- URGENCY forces `act_now`: siege on the court, overflow top band, war
  strain top band — closed three-member list, each an existing banded read.
- TIMEOUT: patience expires at `PATIENCE_WEEKS(doctrine)` past dispatch —
  a lost spy means deciding anyway on a picture now STALER than when the
  wait began (the receipt says exactly that; the drama the owner asked for).

**JUDGMENT J-ES-13 (where it wires).** In THIS program the read is consumed
at: (a) the sovereignty market's buyer side (a stage-local gated arm — the
buyer may sit out one clearing cycle pending confirmation, receipted); (b)
GR-2's pact answers (`answerDueTick` already models a dwell — the read
extends the answer clock, landed as a GR-side one-line gated consumption per
§5 row 5); (c) this program's own autonomous dispatch cadence.
`settlementStrategy` (the war chooser, 812 effective, frozen surface — "NOTHING
touches the chooser", IN-4) is NOT wired: war declarations do not wait on
spies in this program. RECORDED DEFERRAL, owner-visible — wiring the war
chooser is a future owner ruling, not an oversight. [RULED 2026-10-16 (coherence fold §3.2.9) — RELEASED: the owner's blanket grant of 2026-08-05 ("I give permission for everything that requires my sign off in the full queue", FABLE_VALIDATION_QUEUE.md:2598; its scope reading names this deferred arm, :2615-2617) is the future owner ruling this sentence waits on. The war-chooser spy-before-decision wiring is no longer deferred: it lands as ONE joint unit with HB-5 (DESIGN_FP_ARCH_HB.md R1 "REFUTED BY EVENT", :3442-3450). CR-ES-4 stands as the ruling that deferred it; coherence fold §6 places the joint unit in chain 1, THE STATECRAFT BAND.]

### 3.13 THE DOUBLE AGENT — leak-only, silent success, vetting (owner addition F)

A dispatched operative whose `corruptionProfile.corrupted` leash resolves to
an ENEMY court (`resolveLeash` — the web's existing foreign-leash
attribution) LEAKS to that enemy, whether or not it is the target:
- **What leaks:** the mission's existence, itinerary, and gathered intel —
  delivered as synthetic reports INTO THE ENEMY'S belief map (the same §3.6
  report road, sourceId the leashed agent). The existence leak is
  META-INTELLIGENCE: the enemy learns what the court SEEKS — modeled as a
  confidence bump on the enemy's belief about the HOME court's posture
  toward the subject (an ACQUIRE about intentions, landing on the existing
  allianceLabel/readiness slots — zero new surfaces).
- **When:** mirrors the report channel's world rules — magic streams to two
  addresses at each send tick; mundane leaks travel by enemy reach (the
  leak lands when the agent next touches a node in the enemy's rumor range,
  hop-priced by the existing distance machinery).
- **SILENT SUCCESS:** the mission still completes; the leak writes NO news
  and NO home-visible state — discovery ONLY through the web's own exposure
  machinery or consequence patterns; the Herald speaks RETROACTIVELY on
  exposure (`espionage_exposed` carries the double-agent clause when the
  web exposure names the leash).
- **Vetting becomes a real decision:** `vetVolunteerEnvoy` (the one-home
  reader — seam row 9 ⟨F8⟩)
  with `quality` derived from home internal security + own-web health —
  `climate.security` band × (1 − own compromised-institution share via
  `compromisedSecurityInstitutions`) — internal rot ⇒ external blindness,
  exactly the owner's sentence. The ideal-operative profile (low notoriety,
  criminal-capable) IS the most corruptible profile — a tension that needs
  no code: the web's onset already prefers the same profile.
- **SCOPE (chair ruling restated, J-ES-11):** LEAK-ONLY. No false reporting
  home — the confirmation product stays honest; falsified product belongs
  to info-statecraft disinfo if the owner ever wants it. Say "veto" to
  widen; the cost is REFUTE's honesty guarantee.
  [RULED BY DELEGATION 2026-10-16 (OD-FC-9 — 2026-10-16 (coherence fold §3.2.7) — the family holds TWO double agents with OPPOSITE honesty laws: this leak-only operative and DESIGN_FP_INFORMATION.md IN-4's courier, which "delivers a mutated telling onward". CR-ES-2 amends the owner's 2026-07-19 ruling, so widening or narrowing it is his. CHAIR RECOMMENDATION: ONE law, leak-only; a courier that falsifies is the plant road (J-INF-3) wearing a courier.]

> ⏱ **AMENDED IN PLACE, 2026-08-11 (ES-6a compilation + landing).** Every clause
> above was re-measured against live code. **Four were REFUTED and two were
> partial**, and the refutations are what split the wave. The prose is kept as the
> record of the intent; what follows is what the tree can actually hold.
>
> - **C1 — "the leash read AT DISPATCH" is REFUTED: THERE IS NO DISPATCH SITE.**
>   `espionageMissions.js` says of itself that nothing under `src/` calls it, and
>   the cadence leaf declares the same absence. ES-1 built the door, not the
>   traffic. The read is therefore sited at the PRODUCT STAGE — the one live seam
>   holding the operative, the errand and the errand id together — and the
>   errand-id keying survives verbatim.
> - **⭐ ES-Da — THE COVERT RIDER (LANDED `6dbb76c2`, dark; recorded
>   here because this volume otherwise never names it).** The rider is
>   covert cargo on an accepted peace envoy — the ONE traffic road into
>   the espionage machinery while the dispatcher stays dead-headed.
>   Landed surface: packet ES-DA; coupling row
>   `CPL-19.INFO_TO_GRAMMAR.ES-Da.covert_rider`
>   (`couplingRegistryEspionage.js:634`); HBF-06 `covertRiderFor` (the
>   classified rider chooser, DEFER with its closeOwed). ⚠ §17a NARROWS
>   this volume's premise: ES-5b/ES-5c were never covert-gated — they
>   move bloc math and ladder defense the moment `espionageEnabled`
>   lights, with or without ES-Da; what ES-Da gates is ES-5a, ES-2,
>   ES-3, ES-5d and ES-6a. POINT at the packet and §17a for the full
>   record; this paragraph does not restate them.
> - **C2 — "magic two-address sends" is REFUTED.** The belief writer takes ONE
>   `observerId` and refuses `observer === subject` generically; a second address
>   is a second call site, never a parameter widening.
> - **C3 — "mundane leaks travel by enemy reach" is REFUTED.** NO reach predicate
>   exists anywhere in `src/`: rumor propagation is a relay simulation with a hop
>   BUDGET, and only continuous hop PRICING is queryable. The mundane leak rides
>   the mission's own landing instead — the agent reports to both masters when he
>   gets home. Any design clause phrased as "within X's rumor range" is
>   unbuildable today.
> - **C4 — meta-intelligence "landing on existing slots, zero new surfaces" is
>   REFUTED AS SPECIFIED.** `BeliefRecord` is strictly TWO-PARTY: its label is
>   observer↔subject and its truth side reads the direct edge between exactly
>   those two ids. "A believes B's stance toward C" is not expressible in any
>   field. The narrowing that IS expressible — and that shipped — is a two-party
>   EXISTENCE leak, `(observer = patron, subject = the HOME court)`, CONFIRM-shaped.
>   It is mandatory rather than decorative: when the patron IS the mission's
>   subject, the intel arm is refused generically, so without it the case this
>   section names by name ("whether or not it is the target") would write nothing.
> - **C5 — the retroactive Herald clause is REFUTED TWICE.** `espionage_exposed`
>   exists nowhere in the repo, the six kinds belong to ES-7 by §4, and the
>   exposure event it would attach to emits an EMPTY news list on every path while
>   the persisted log has already dropped the leash. Folded into ES-7.
> - **C6 — vetting quality is PARTIAL.** Every part exists; the SHAPE does not.
>   The quality vocabulary is a two-member closed set, so a continuous product
>   must be thresholded to one of two words — a tuning decision no code answers —
>   and the blocking fact is the MODULE'S DISPATCHER DEAD-HEAD — zero
>   importers of `espionageMissions.js` under `src/`, re-verified both
>   shas; the consumer side is WIRED (`espionageMissions.js:72/:155/:175`),
>   and ⭐ ES-Da LANDED as the one traffic road. Deferred to ES-6b, whose
>   three deliverables build-and-pin NOW against the live call site
>   (C-TLF-11).
> - **C7 — "web dark ⇒ no leash resolution" is PARTIAL and the leaf must spell
>   it.** `resolveLeash` is NOT web-gated; a betrayal-seeded foreign patron
>   survives in a world that never lit the web. The estate's idiom is to gate the
>   CALL, and the shipped leaf copies it.
>
> **THE SPLIT (chair-ratified):** **ES-6a — THE LEAK** (this, LANDED); **ES-6b —
> THE VETTING QUALITY**, which rides the DISPATCHER wave because its consumer is
> dead-headed; **ES-6c — THE RETROACTIVE CLAUSE**, folded into ES-7.
>
> ⚠ **THE TIMING FACT THIS SECTION NEVER STATED:** espionage reads the corruption
> web **SAME TICK**, in one pulse body, always in that order. A `tick - 1` window
> here would be provably dead. The pulse order is pinned at source.

### 3.14 THE CAREER ECONOMY — graded missions, the promotion-risk register (owner addition G)

**The grade.** At mission close (`markEnvoyHome`, or the magic arm's last
send), the mission is GRADED BY INFORMATION QUALITY — the best landed
confidence achieved for the mission's `subjectId` against the mission's
`demand` band (§1): closed set `MISSION_GRADES = ['exceeded','met',
'partial','empty']` (totality-exported; reachability of all four grades
pinned with executed fixtures — `empty` is reachable via the
host-has-no-belief honesty negative, `exceeded` via a delta-tap first-hand).
The grade is computed PURE at close, receipted in doctrine words, and never
persisted (derived from `gathered` + the landed records on any read).

**The credit — careers are espionage's currency on BOTH sides.**
**JUDGMENT J-ES-17 (the ladder handoff):** where `npcLadderActive`, a graded
success feeds the operative's ladder STANDING through the ladder family's
existing maintenance road — the exact template §3.5 already uses in the
other direction: a pure espionage-close read (`freshMissionGradeFor`, the
`freshLieExposureFor` mirror) consumed by the ladder's maintenance one tick
later; success writes standing/momentum credit, exposure already writes
marks through the lieExposure arm. The ladder's OWN writers write; the ES
module set writes NO ladder state (scan-pinned). The alternative — minting
the mission as a `LadderGoal` — is REFUSED: `LadderGoal.condition` is a
VERSIONED persisted grammar (`{version, label, root{kind:'test', signalId,
…}}`, npcLadderGoals.js, measured) and a new root kind is a schema change
this program's zero-new-keys fight forbids; the handoff road delivers the
owner's "mission = an NPC goal with benefits on success" without touching
the grammar. Say "veto" to model missions as LadderGoals; the cost is a
persisted-schema version bump and a migration.

⭐ **AMENDED IN PLACE BY ES-5d (BUILT), and the amendments are three NARROWINGS
of the prose above, each measured rather than argued.**
**D1 — the maintenance road is real and the wave joins it, but it had NO `stock`
terminus and ES-5d adds one.** The road's three existing external folds all
terminate elsewhere: `freshLieExposureFor` → `maintainMarks` → stigma, and both
bond reads → `mintBond` → bonds. Its only `stock` writer, `applyGoalLifecycle`,
takes purely ladder-internal input. "The exact template §3.5 already uses" is a
template for MARKS; the credit needed a ladder-owned `stock` writer of its own
(`applyMissionCredit`, module-private to `npcLadderKernel.js`).
**D2 — the carrier is the one-tick DEPOSIT idiom, not the `freshLieExposureFor`
mirror this section names.** `freshLieExposureFor` is O(1) only because the
credibility ledger is already nid-keyed; an errand ledger is not, so copying it
literally would have put an O(errands) scan inside the per-rung loop. The
deposit Map is hoisted ONCE per advance beside the two the file already hoists.
**⚠⚠ D7 — "ONE TICK LATER" IS MEASURABLY WRONG FOR THIS PAIR, AND THE HANDOFF
IS SAME-TICK.** `simulateCampaignWorldPulse` calls the espionage product pass
and the ladder chain unconditionally in that order, in ONE function, on the SAME
`worldState.tick` — so the depositor runs EARLIER IN THE SAME PULSE than the
consumer. That makes this the `gratitudeBondEvents` twin ("generosity ran
earlier THIS tick"), not the `roadsBondEvents` one, whose one-tick lag exists
only because ROADS runs LAST, strictly after the ladder. ⛔ A `tick - 1` window
here would be SILENTLY DEAD: the deposit pass prunes the prior tick's records
before the ladder could ever look for them, so the fold would never fire on any
world while every unit pin around it stayed green. Consume-once is unaffected —
it comes from the pass replacing the whole record set each pulse, not from the
lag. ✅ **RATIFIED by chair ruling H32, 2026-08-11 (Fable chair, session `c42c8924`).** This
amendment was landed by the ES-5d lane marked vetoable — *"say 'veto' to restore the one-tick
reading; the cost is a dead feature"* — and the chair has now RULED rather than vetoed: **the
amendment STANDS and its provisionality is spent.** The dead-window proof is executable at source
and is pinned so it cannot rot silently (`espionageCareerCreditDormancy.test.js:232-251` asserts the
pulse call order and notes that flipping it must flip the window). The same finding is stated
independently for a different espionage pair at §3.14's own `:1274-1276`. All three artifacts that
carried the wrong claim — this section, the ES-5d packet's §5/§5b/§6.1, and acceptance case A5 —
were corrected together in the same change, because a correction reaching only the doc the lane
could touch would have left the contradiction alive in the two a builder actually reads.
**D3 — credit only, no debit** (§3.14's sentence is about success), and **D4 —
`stock` only: `momentum` does not exist** and the wave credits the field that does.

**The register.** `promotionRiskOf(npc, tick)` — a DERIVED read (never a
stock): away-weeks (from the active errand row's departure, the
ransomDwellRead precedent) × the operative's rung exposure (contested rungs
decay faster) × rival pressure (live `rivalryTargets`/ambition heat where
the agency layer runs). Its pure core is minted at ES-0 (espionageMath).
TWO consumers, staged honestly: (1) the ladder CONTEST math (an absent
holder defends weaker — rivals advance through the contest machinery that
already runs every tick; no new contest code) — this one CHANGES home
political outcomes and is Q1-GATED alongside the bench discount, landing
ES-5 (one amendment, two grains — §3.11); (2) §3.4b's gather-or-govern read
(the register is the "govern" half of the spy's own trade — mission
mechanics, no home-politics output). Until ES-5's Q1-signed arm lands, the
gather-or-govern read folds the CLIMBING CATCH alone and the promotion term
is DECLARED-ABSENT with a receipt (the SP-C degraded-arm idiom — never a
silently-vacuous term, and never a register that narrates risk no
machinery delivers).
Dark worlds byte-identical; the lit shift disclosed under the same golden
pair discipline as §3.11 (⟨F6⟩ the seam-row-6 precedent, not L9).

⛔ AMENDED IN PLACE BY ES-5c (2026-08-11) — "NO NEW CONTEST CODE" ABOVE IS
FALSE AS MEASURED, AND IT NAMES THE WRONG FILE. This is the THIRD reach
claim in this volume measured false at source (§3.11 was refuted on both
halves at ES-5b), and the correction is recorded rather than quietly
routed around. `npcLadderContest.js` has NO defense term, no
holder/challenger asymmetry, and no rung defense of any kind: its
`contestMargin` is a single SYMMETRIC function applied identically to both
sides, its only consumer is the `tieBreak` on the `convergent` +
both-goals-fired branch, and the entire OPPOSED family — where the words
"holder" and "raiser" actually live — never reads the margin at all.
Composing there would have meant a four-surface signature cascade to
deliver a term that fires only when two rivals' goals fire the same week.
⭐ THE MACHINERY DOES EXIST, IN A FILE THIS SECTION NEVER NAMES:
`npcLadderChallenge.js#defenseScore` already carries the exact
multiplicative-weakening idiom for §11.4's three-body strain ("a defender
who is itself straining upward defends weakened"), already holds the npc
record and the worldState with ZERO signature change, and drives THREE
live decisions rather than one tie-break — whether a challenge is
hopeless, the attempt RATE, and whether it clears the sustained margin.
ES-5c therefore lands the register at `defenseScore`, as a field STAMPED
on the Combatant record the function already receives (the file's own
post-construction idiom, exactly as `isChallenging` is stamped), and
`npcLadderContest.js` takes ZERO edits. Only the DEFENSE is discounted;
`challengeScore` is untouched, because this section's sentence is about
defending and discounting the challenge too would be a second behaviour
nothing asks for.
⭐ THE CAREER GRAIN SPLITS IN TWO, and only the first half is ES-5c's.
"Rung exposure" had NO SOURCE anywhere in `src/` — the chair authored it
as `clamp01(openWindows(...).length / RUNG_EXPOSURE_WINDOW_SPAN)`, stated
in the ladder's own vulnerability vocabulary, with the span pinned to its
producer by a test that DERIVES the window-reason count instead of
restating it. The CREDIT half ("success writes standing/momentum credit"
through the maintenance road) is split to **ES-5d**: its substrate is
fiction today — `momentum` does not exist on `LadderStanding` at all,
`maintainMarks` never writes `stock`, no `stock` writer accepts input from
outside the ladder family, and the mission grade is never persisted, so
nothing of it survives a tick boundary. ES-5d must BUILD a persisted
carrier, an identity bridge, a ladder-owned stock writer, and a coupling
row — a wave, not a composition.
⭐ **ES-5d IS BUILT, and "BUILD four things" measured as TWO builds and TWO
reuses.** The espionage set already owned a persistence road, and the identity
bridge's three hops all existed as parts (`errand.from` → `rosterPersonById` →
`npcId`) with only the composition missing — so the genuinely new construction
was the deposit family and the ladder's `stock` terminus. The carrier is a
one-tick, drop-when-empty `missionCreditEvents` deposit classified TRACKED, and
the fold is SAME-TICK rather than one-tick-lagged (deviation D7 above). [CORRECTED 2026-10-16 (coherence fold) — the carrier must be recorded against §1's law: `missionCreditEvents` is a NEW `spatialLedgers` sub-key (one-tick, drop-when-empty, classified TRACKED; espionageCareerCredit.js:16, :200-209; spatialUsage.js:307), so §1's "ZERO new spatialLedgers sub-keys" no longer holds as written. Recorded, not re-ruled; if contested, a persisted-shape question is the owner's.]

---

## §4 THE WAVES — ES-0..ES-7, dependency-ordered, every one DARK

House discipline per wave (FP §10, binding): one wave = one commit (sliced
waves one per slice); focused gates per slice + full gate at wave end through
check:tail/gate-tail.sh; ledger row with req 13 (alignment) + req 14
(edit-verb) lines; CHECK-GIT-FIRST on every shared file (the envoy family is
the war lane's most-recently-edited surface); python3 byte-scan every
authored file; pathspec commits; every load-bearing conjunction gets an
executed cp/cmp mutant + a mutation-coverage-manifest entry; every new
negative carries `// anchored:`; four-fence dormancy + lit-mutant per flagged
wave; sizes re-measured with the enforcer at the publishing commit (raw
`wc -l` below is orientation only).

[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: none — instrumentation (pure leaves + the flag's manifest row and certification row) · TIER: host flag `espionageEnabled` (manifested, lit nowhere) · DEGRADED ARM: dark by construction]
**ES-0 — THE PURE LEAVES + THE FLAG (dark by construction; early-eligible).**
⭐ **LANDED 2026-08-05.** Two charter corrections, both MEASURED against the live tree
and both vetoable. (a) **THE FLAG LANDS HERE**, with its full CQ5 trio — manifest entry,
AUTHORED certification row, and the first by-name gate read in `espionageGate.js` — per
the chair rider that postdates this volume; the block below was written "no flag".
(b) **`lawWordFor` IS MINTED IN `src/domain/worldPulse/lawWord.js`, NOT IN
`espionageDoctrine.js`.** `warSeatBooks.js` must import it, and
tests/lint/couplingInclusion.walker.test.js would then either count the doctrine leaf as
unlayered debt or license a WAR-to-INFORMATION coupling for a four-line ladder. That
walker's own recorded argument for its two SP substrate leaves applies word for word: a
shared vocabulary every layer spells against is not a port, and giving it a family
"would make every layer's reading of a band word a cross-layer coupling, which is
hosting by another name". The mint is still ONCE, the vocabulary is still the consumer's,
and the espionage family joins the INFO layer map so its leaves are claimed rather than
unlayered. The veto restores the charter's file assignment and owes a coupling-registry
row for the WAR read.
Charter: `src/domain/worldPulse/espionage/espionageDoctrine.js` —
`lawWordFor` (minted ONCE, exported; `warSeatBooks.js` (515) retires its
private `lawfulnessBand` to it in the same commit — a ~6-line edit,
coordinate with the war lane and note INT-1's future claim on the file) +
`readEspionageDoctrine` leaf (+ its stage split landing later at ES-5);
`espionageMath.js` — `operativeNotoriety01` (re-export with import-source
pin), `covertCompetence01`, `catchChance01`, `legStack`, `dwellRamp` +
`TAP_LEVELS`/`MISSION_GRADES` totality exports (G/H closed sets),
`wariness01`'s pure core, `promotionRiskOf`'s pure core (§3.14),
`deliberationRead`; `magicWorksAt.js` ⟨F7⟩ — the
neutral lift of `warMagicFunctions` with `warMagicGate.js` (82) re-exporting
(R-BLD-5 precedent); the leaf's header NAMES the module-private twin
`magicFunctionsAt(magicById, id)` at spatial/teleportEdges.js (different
arity, different semantics — the export name is distinct precisely so a
sweep never conflates them; `magicWorksAt` measured zero-hit). Budgets:
three new leaves ≤ 250 effective each; edits to warSeatBooks/warMagicGate
≤ 10 lines each. Pins: totality exports sorted for every word-keyed table;
the lawWordFor two-tail reachability pin built from REAL computeLawfulness
output (census 4 §5.9 — hand-fed numbers refused); the ORDER_FACTOR
band-reachability measurement (executed arithmetic, recorded in-file);
dwellRamp monotonicity + all-bands-reachable; zero-import pin on the
doctrine leaf (the sovereigntyAppraisal geometry); mutants on the catch
conjunction and the doctrine tuning. Dormancy: no flag,
no caller — dark by construction (the WR-10 dark-instrument precedent).
Req 13: ENGAGED — the axis derivation itself; req 14: engine-only, recorded.
Collision map: warSeatBooks (war lane + INT-1 future), warMagicGate (war
lane). Order: after SP-A (no hard dependency; SP-A's bandFamilies is not
consumed here — doctrine words are program-local closed sets, recorded
under J-WR-10-B as borrow-checked: nothing existing matched).

[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: none a DM can see at a month — the mint has no production dispatch (`espionageMissions.js` has zero importers under src; ES-Da's rider is the only traffic), and a mission's legs (one week per leg, 2-3 legs + dwell) speak no beat until ES-7 · TIER: belief infoMode (spatial canon ∧ infoMode ≠ omniscient) · host flags: `errandSpineEnabled` + `espionageEnabled` · DEGRADED ARM: dark (`envoyErrands` bytes identical)]
**ES-1 — THE MISSION (⚠ RIDES `espionageEnabled`; DOES NOT MINT IT — see §2's
correction and the FLAG-ATTRIBUTION NOTE in `DESIGN_FP_ARCHITECTURE.md` §3;
needs SP-D).** Charter: the covert arm in SP-D's `errandMint.js` (mint
validation: itinerary ≤ 3, closed products + demand bands + the five-member
legRefs set (EP-r cut 'exports' 2026-08-10) with pullBand refused ⟨F5⟩, dispatch-refusal seams,
concurrency cap) + `normalizeErrand` taught the `covert` sub-record (same
commit — the columnOf precedent) + the `covert_envoy` franchise members in
`routeNetworkConsumers.js` (519) + the one-word kind fork at
`buildEnvoyRoutePlan`'s call site + covert casting (importance-inverse draw,
J-ES-4) + `vetVolunteerEnvoy` first consumption. ⛔ **The flag manifest row, the
certification row and the first by-name gate read are STRUCK from this charter —
all three landed at ES-0 (`55674790`), and re-minting the key reds the
`engineGatedRuleKeys` walker's exact one-key delta.** ⚠ **`envoyDiplomacy.js`
CARRIES NO BUDGET LINE BELOW and it is the file the one-word kind fork edits:
measured 797/800 effective, THREE lines of headroom. Budget a lazy-leaf
extraction into this wave or it reds the tolerance-zero size ratchet.** Budgets:
errandMint growth ≤ 120; a new `espionageMissions.js` leaf ≤ 250 hosts the
casting/validation logic; envoyErrandRecords.js (634) gains the sub-record
normalizer arm (≤ 60). Pins: four-fence + lit-mutant; JSON-round-trip
through REAL serialization incl. the alias trap; the fail-closed projection
pin extended to `covert.*` (seeded covert errand, never an empty harness);
legacy-row byte-identity; mint-refusal reasons (`itinerary_too_long`,
concurrency, double-travel) each fixtured; the hidden-franchise fail-closed
negative (an OPEN errand still refuses hidden ways). Dormancy: flag dark ⇒
mint arm unreachable ⇒ `envoyErrands` bytes identical (hash-compared through
the live pulse). Req 13: casting consumes doctrine targeting (declared);
req 14: engine-only here (the DM verb is ES-7's — recorded). Collision:
envoy family (war lane, CHECK-GIT-FIRST mandatory).

[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: a `caught_spying` foreign-guest hold on the hold surfaces at a hostile stop's dwell interval; the ransom gate opens at week 4 / protracted at week 16 (`DWELL_CUTS_COVERT`) — seasonal; no `espionage_*` beat until ES-7 · TIER: belief infoMode (spatial canon ∧ infoMode ≠ omniscient) · host flags: `errandSpineEnabled` + `espionageEnabled` · DEGRADED ARM: dark (covert rows absent ⇒ the stage no-ops byte-identically)]
**ES-2 — THE GAUNTLET (second slice of `espionageEnabled`; needs ES-1;
Q2/Q3 rulings consumed).** Charter: the stay-detection stage —
`espionageGauntlet.js` leaf mounted INSIDE the errand advance (the covert
stage composes into `advanceEnvoyErrands`' existing per-tick walk — one
transition per row per pulse, read-back-before-adopt, the WR-7 stage
discipline; NEVER a pulseKernel/applyWorldPulse edit — L1) rolling §3.3 at
hostile stops; capture → `openForeignGuestHold` cause `caught_spying`
(vocabulary member + the cause's news arm); **⭐ THE ENCOUNTER-TABLE ROW,
SAME-COMMIT (CR-ES-6, binding):** mounting `espionageGauntlet.js` ADDS row
**E15 — spy-dwell detection (covert operative × host settlement watch)** to
the WAYFARE volume's §4 closed encounter-pairs table, in THIS wave's commit —
{pair, resolver, co-location law (per-stop while dwelling, §3.3(b)'s
hostile-class rung gate), outcomes (`caught_spying` hold / uncaught passage /
§3.5 retroactive exposure)}. A resolver that lands without its row is exactly
the untabled-resolver hole WY-6's walker exists to close, and WY-6 lands a
PHASE LATER — so the row cannot wait for it. WY-6 then VERIFIES fifteen; it
does not re-close the table. THE BOUNDARY: the encounter-resolver REGISTRY is
ONE (that table); the catch MATH stays here (§3.3 is mathematics, not a
manifest entry). The covert worth lift +
DWELL_CUTS_COVERT arms (J-ES-15) at `ransomWorthBandFromErrand` (184-line
envoyRansomStage) and `ransomDwellRead` (ransomClaim 311); the taint cascade
(§3.5) — credibility charge, inverse-hostility grievance, the FRIEND
betrayal event (grievance + trust collapse; the casus arm is §5 row 1's
war-chair seam, NOT minted here); doctrine-shaped captor leniency DARK
until Q3 rules the seat-vocabulary break; THE ROOTED-DWELL ARM (§3.4b, G) —
per-interval exactly-once stay rolls with `dwellRamp`, the gather-or-govern
per-interval read, departure re-timing through the one amender. Budgets:
gauntlet leaf ≤ 280 (+ ≤ 60 for the dwell arm);
ransom edits ≤ 40 combined. Pins: the friendly-host-rolls-nothing negative
(anchored); single-dip security mutant (drop the patronage term ⇒ a
fixture's catch01 moves — proves both factors live); wariness/porosity/
underways/asset each proven live BOTH SIDES (the conjunction-coverage law);
capture-at-army vs capture-at-stay attribution by RECONSTRUCTION (never
id-splitting — WR-8); dwell-cut shift reachability fixtures; the dwell
interval exactly-once pin (two rolls in one interval = red; keyed-hash
enumeration proven); the ramp-live mutant (flatten dwellRamp ⇒ a rooted
fixture's catch01 stops climbing — red); the longest-stay termination
fixture (§3.4b's soft bound binds before DWELL_RESAMPLE_CAP on every
reachable input); hold
round-trip with the caught_spying cause (the foreignGuestHoldsOf ARRAY
shape trap: positive census before any absence assert). Dormancy: covert
rows absent ⇒ stage no-ops byte-identically. Req 13: captor doctrine
declared-consumed-when-Q3-rules; req 14: engine-only. Collision: the
hold/ransom family (war lane; TR-8 slice 2 will consume the same road later
— the seam row pre-pins it).

[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: the home court's belief about the subject moving when the mission folds home — mundane at `markEnvoyHome` after 2-3 weekly legs + dwell (a month to a season), magic at the stop's confirmation tick — visible only on DM belief surfaces until ES-7 voices the tap registers · TIER: belief infoMode (spatial canon ∧ infoMode ≠ omniscient) · host flags: `errandSpineEnabled` + `espionageEnabled` (+ `believedConditionsEnabled` for the axis arm) · DEGRADED ARM: core slots only, the receipt naming the missing family]
**ES-2b — THE CUSTODY WRITE (the slot this wave left PARTIAL)** [CURED 2026-10-20 (fp-final P5) — P5W-2's ES half (RULINGS-P5 A.2: "ES-2b and WR-7d are OPENED — the custody and ransom shapes as written (CH §12.4, BD §9.10, PR §8.2; the fold OD-FC-60 ↳) become LIVE DESIGN dispatching in their own waves (ES's custody wave before BD-4's ransom race and CH's road arm)"; put to the owner in chat 2026-10-20 12:51 CDT — "keep them dark" reverses it; the owner's words of 2026-10-20, verbatim: "I give all permissions now and in the future." · "i defer everything to your judgemetn"; routed by D-CH-p5 §4 route 11; a VISIBLE row in ODQ §934.93's P5 addendum). OPENED 2026-10-20 by delegation (P5 A.2); the wave order stands.] What it is: the persisted-shape change ES-2 recorded as owner-gated — the custody row (`foreignGuestHold.js :: normalizeForeignGuestHold`, which today returns null unless a row carries `id`, `npcId`, `errandId`, `encounterId`, `captorId` and `venueId`, its one opener `envoyInterceptionStage.js :: holdInterruptedEnvoy`) admits a HELD PERSON who was not taken off an interrupted errand, in EXACTLY the shapes the consuming volumes already wrote and nothing wider: a person a BODY takes and holds for ransom (`DESIGN_FP_ARCH_BD.md` §9.10, the ransom race), a person caught on a way (`DESIGN_FP_ARCH_PR.md` §8.2's trail arm), a held PARAGON (`DESIGN_FP_ARCH_CH.md` §12.4); ONE custody road (this row), never a second; no `paragon.held` field, no second meaning of `jailed`. THE CONSUMERS, IN ORDER (the wave order stands): (1) this wave — the relaxed shape, its lifecycle (create at the capture · read · persist · undo by the proposal ring's snapshot · import normalized · dark-after-lit: rows kept, inert · release/escape/death close the row) and its cause words; (2) THE BODIES' BD-4 ransom race (BD §9.10) — the first writer of a body-held row; (3) CH's road arm and CH §12.4's held paragon (a body's TAKING of a paragon is BD's act on this hold; CH adds no verdict). WR-7d's ransom persistence (the war volume's slot) is opened beside it by the same ruling and is that volume's to land. NOT widened: no `capture` rung on CH's failure ladder (`cure/D-CH-p5.md` §5's open question, the chair's). Flag: rides `espionageEnabled`'s slice discipline with a virtual `custodyWriteEnabled` (absent-when-dark; dark ⇒ `normalizeForeignGuestHold` byte-identical — the six-field refusal stands). FIRST-VISIBLE: the first body-held captive's card in its holder's week (BD-4's). TIER: aspatial-safe for the row; the captures' own tiers. DEGRADED ARM: the DM's hand (`authored.heldAt`) stays every world's only hold of a paragon. `causedBy`: the capture names the act that took the person. PLAUSIBLE until this wave's car measures every `foreignGuestHoldsOf` reader against the relaxed shape (the ARRAY-shape trap above: a positive census before any absence assert).
[ADDED 2026-10-20 (fp-final P6c; V-ALL-p5b's one fail (P5-V1's ES half) · RULINGS-P5 ADDENDUM D.3 (b) · `cure/D-BD-p5b-p5.md` §4 · `DESIGN_FP_ARCH_BD.md` §19.0e) — TWO CLAIMS ABOUT MASTER IN THE ROW ABOVE ARE CORRECTED (the row's text stands as history; this bracket is of record): "dark ⇒ `normalizeForeignGuestHold` byte-identical — the six-field refusal stands" and "dark-after-lit: rows kept, inert" are NOT master's behaviour. AT MASTER `foreignGuestHold.js` RE-NORMALIZES THE WHOLE LEDGER ON EVERY READ AND EVERY WRITE, so while the relaxed shape is not admitted a body-held row is HIDDEN on read and DELETED by the next envoy-hold write, and the `errandId` DEDUPE ERASES errand-less captives (two errand-less captives collapse to one, then none) — EXECUTED on master's module by THE BODIES' lane (`cure/D-BD-p5b-p5-probe/custody.out`: hidden on read, deleted on the next envoy write, two errand-less captives erased by the copied dedupe). THE CURE IS ES-2b's OWN BUILD STEP, DECLARED HERE: the normalizer keeps an errand-less captive under a unique `captiveId` key (`errandId` deduped ONLY where present; `ROW_KEYS`' exact-key test admitting the relaxed key set), FLAG-BLIND for that declared shape (`custodyWriteEnabled` gates the WRITERS only, never the normalizer) — a persisted shape, THE OWNER'S, VISIBLE (the ODQ §934.93 P5 addendum's ES-2b row names `captiveId` and the flag-blind normalizer arm); never a kept-while-dark claim. The car measures every `foreignGuestHoldsOf` reader against it; THE BODIES' BD-4 ransom race STOPs until it lands (BD §9.10).]
[ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 B.1 (S-7 · OD-OP-23) · `DESIGN_FP_ARCH_OP.md` §12 OP-3, §11) — THE CUSTODY WAVE's ORDER, FOR THE OPPORTUNITY: OP's rescue wave (OP-3, `roadRescueEnabled`) dispatches AFTER this custody wave — custody → rescue. Its prerequisite is THIS wave's court-carried `host_settlement` encounter writer: without it a caught rescuer cannot be held at master (`espionageGauntlet.js`'s header, "THE ONE ARM THIS WAVE COULD NOT BUILD"), and a caught rescuer is held under the LANDED cause `caught_spying` (`caught_freeing` WITHDRAWN, OP-r1-11); OP adds no custody shape.]
[ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 D.2 · `cure/D-OP-r2.md` ROUTED ES · `DESIGN_FP_ARCH_OP.md` §15 ES row) — THE OCCUPIED-TOWN ARM: this wave's court-carried encounter that holds a caught rescuer in an OCCUPIED town takes `legalEncounterVenue`'s `occupied_enemy_settlement` arm — the OCCUPIER as the encounter's actor and as the hold's `captorId` (the jailer is the occupier, never the venue's own court; OP `jailerOf`). This wave CONFIRMS it at its car (OP's rung, grievance, caught hold, unwitnessed blame and T4 admission all read the jailer).]
**ES-3 — THE PRODUCTS + THE GRADIENT (third slice; needs SP-B landed for
the full arm, ships the degraded arm regardless).** Charter:
`espionageProducts.js` leaf — the three synthetic-report builders (§3.6
shapes, completeness floored, sourceId = agent nid) + THE TAP LADDER (§3.7,
H — `tapLevelFor(stop, face, asset)` per J-ES-16, the performance-poisoning
term over the imported `lieWillingness`, the tap-composed accuracy caps,
tap recorded on every gathered entry) + the gradient accrual
writer (`covert.gathered` through the errand writer's transaction, incl.
§3.4b's per-interval re-samples) + the
standoff read (§3.4, with the INTEGRITY bar term) + landing logic (magic
per-stop-and-per-interval send via the ES-0 pair
gate; mundane home-mouth fold into the existing delivery slot in
`envoyPulse`'s stage order; home-side tap × host-trust discount applied at
report build) + THE GRADE at close (§3.14 — `freshMissionGradeFor`'s pure
core; the ladder handoff itself is ES-5's consumer) + the deliberation
read's own-cadence consumer.
Budgets: products leaf ≤ 300 (+ ≤ 80 for the tap/grade arms); envoyPulse
(376) gains ≤ 15 composition lines.
Pins: the writer-boundary scan (no `applyBeliefOverrides` import anywhere in
the espionage module set — the closed-key envelope hazard, executed as a
mutant that tries the override road and reds); REFUTE's
confidence-collapse + categorical-correction fixtures; CONFIRM's
zero-new-keys assertion (the belief row's key set before/after differs only
in values); the gradient cap and plateau fixtures; THE TAP PINS (H) — the
never-purer-than-access law as an executed matrix (declared-face target
visit caps below 1.0; standoff caps at performance; delta requires a live
asset — the asset-less delta negative anchored), the poisoned-waypoint
fixture (a hostile-to-home satellite's performance read lands measurably
below a friendly one's — both sides live), the house-voice receipt
phrase-set pin (three registers, verbatim members); grade reachability
(all four MISSION_GRADES executed); LOSE-THE-SPY-KEEP-THE-
INTEL both arms (magic capture keeps `sentHome` products; mundane capture
loses all — the jewel pin pair); the host-has-no-belief-yields-nothing
honesty negative. Dormancy: axes dark ⇒ core-slots-only with the receipt
naming the missing family (pinned). Req 13: doctrine frequency in the
cadence; req 14: engine-only.

[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: none — instrumentation (the evidence pin); its felt sentence is WR-10's market · TIER: belief infoMode (spatial canon ∧ infoMode ≠ omniscient) · host flags: `errandSpineEnabled` + `espionageEnabled` (+ `sovereigntyTradeEnabled`, lit nowhere, for any effect) · DEGRADED ARM: dark]
**ES-4 — THE JOINT-LEGS DISCHARGE (rides SP-B/SP-B2; the lighting wave).**
Charter: ACQUIRE/CONFIRM/REFUTE wired to SP-B's `conditionsBands` spellings
(the closed-vocabulary seam pin, both sides); the fed-by-espionage companion
fixture beside SP-B2's lit-with-legs contract fixture — a non-neighbor
(court, holding) pair goes `unknown → known` through a completed mission
and `appraiseSettlementAsset` prices it end-to-end (the market clears on
spy-fed legs); the NON-NEIGHBOR DIFFERENTIAL pin — rumor-range-only feeding
leaves the far pair `known:false`, the mission fills it (proving spies are
the SOURCE at distance, not decoration); the LIGHTING-ROW AMENDMENT (§6
item 5's text) landing in the same commit — ⟨F9⟩, DISCHARGED: the phrase
"WR-9 certification lighting-order row" named NO measured artifact when this
charter was written (re-measured at 32cc17f7), and the PHANTOM CLAIM lived at
FIVE doc sites in TWO documents. **SP-B2 BUILT THE REAL INSTRUMENT ON
2026-08-05**, so ES-4's VERIFY-AT-BUILD step is now a LOCATE and it resolves:
`SOVEREIGNTY_LIGHTING_EVIDENCE` + `evaluateSovereigntyLighting` in
`src/domain/certification/warConvergenceContract.js`, measured by
`tests/lint/sovereigntyLightingContract.walker.test.js`. **ES-4 MINTS
NOTHING HERE — it SATISFIES the row that exists.** Its ONE obligation is to
carry the marker `ES-4-DISTANT-SOURCE-EVIDENCE` in the TITLE of the live pin
that proves a non-neighbour pair priced through a completed mission; that
marker is the row's declared address and the join key the walker measures, so
the condition flips from `UNSATISFIED_TRACKED / missing ['ES-4']` to
`SATISFIED` in the same commit and with no edit to the instrument. Keep the
token stable across renames (it is a join key, not a description) and put it
in the test NAME rather than a comment, so deleting the pin removes the
evidence. **THAT INSTRUCTION ALONE IS NO LONGER SUFFICIENT — THE TENTH CUT
AND THE CAP (`d48224e3`) NARROWED WHAT COUNTS AS EVIDENCE, AND A PIN THAT
MISSES THE NARROWING CARRIES THE TOKEN AND LIGHTS NOTHING.** Two facts bind
here and the rest is pointed at rather than copied: the pin must live in
`tests/domain/espionageDistantSourceEs4.test.js` — ES-4's DECLARED evidence
address, listed in the walker's `EVIDENCE_FILE_ADDRESSES` — and it must stand
in an `it`/`test` TITLE, NEVER a `describe`/`suite` title, because a suite
title is parsed and kept but joined against by nothing. **THE FULL RECIPE IS
DELIBERATELY NOT RESTATED IN THIS VOLUME** (it is the walker's own count, it
moves when the instrument moves, and a second copy would rot): read clauses
(0) and (0b), and the clauses that follow them, in the walker header of
`tests/lint/sovereigntyLightingContract.walker.test.js`, which is where that
recipe is maintained. Budgets: test estate + ≤ 20 lines of wiring. Pins: the four-leg totality and degraded-arm pins
inherited from SP-B2 re-run against espionage-fed rows; the axis-drift scan
(no espionage module spells an axis token outside SP-B's exports — seam 5's
law). **THIS WAVE, WITH SP-B AND SP-B2, IS THE DISCHARGE OF THE OWNER'S
JOINT-ARCHITECTURE CLAUSE** — the directive's "spies are the SOURCE of
tier/route/trajectory legs about non-neighbors" becomes an executed fixture,
and `sovereigntyTradeEnabled`'s green condition cites all three wave ids.
Req 13: declared-empty (wiring); req 14: engine-only.

[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: none at a month — the bench discount (ES-5b) moves bloc math per tick but a pure spy's absence costs the council little (§3.11); the career register and credit (ES-5c/5d) read at the yearly clock; the autonomous cadence (ES-5a) is not mounted · TIER: belief infoMode (spatial canon ∧ infoMode ≠ omniscient) · host flags: `errandSpineEnabled` + `espionageEnabled` (+ `npcLadderActive` for ES-5c/5d; ES-5b/5c are not covert-gated, §3.13's ES-Da note) · DEGRADED ARM: the promotion term declared-absent; ladder dark ⇒ the grade stays a receipt]
**ES-5 — DOCTRINE ENGAGED + THE ABSENCE AMENDMENT (fourth slice; needs
Q1 signed for the absence arm).**
⚠⚠ **THIS CHARTER IS SPLIT ACROSS THREE WAVES AND NO LONGER DESCRIBES ANY ONE OF
THEM. It is kept whole because it is the amendment's argument** — CR-ES5B-1
ratifies the slice rather than rewriting the reasoning. The mapping, binding:
**ES-5a** = the doctrine STAGE + the dispatch cadence + `wariness01` + the IN-3
handshake — **LANDED at `41ddeae0`**. [CURED 2026-10-20 (fp-final P5) — P5C-5 (WC-BD-75 · WC-BD-76; RULINGS-P5 C.5; routed by D-BD-p5 §4): THE `sponsor_body` OBJECTIVE — ONE more objective of THIS stage's ONE covert decider, never a second decider. THE BODIES' BD-9 OWNS THE CAR (`DESIGN_FP_ARCH_BD.md` §10.4): ONE sibling door in `espionageDoctrineStage.js`, `sponsorObjectiveFor({ worldState, item, courtId, tick, candidate })`, reading THIS stage's own doctrine words (`method`: `lawful` ⇒ only a flock of the sponsor's own creed; `lawless` ⇒ any gang or flock that bleeds a rival; `targeting` filters the target court) and its own cadence (`frequency01`), drawing ONCE on its own keyed stream `hash01(dispatchCadenceKey(courtId, tick) + ':sponsor_body')` (zero new PRNG streams) against `frequency01 × score01`, where `score01` is BD's pure leaf `bodies/sponsorObjective.js :: sponsorObjectiveScore` (purse band, believed hostility through `readBeliefRelationship`, the believed candidate; bounded, DRAFT). The doctrine read, the cadence and the stage's frame are UNCHANGED; dark (`bodySponsorshipEnabled` absent) the door answers `{ sponsor: false, reason: 'dark' }` — byte-identical. THE CALLER: this stage has no autonomous production mount (the 2026-10-16 bracket below: "imported only by `espionageRider.js`"), so THE BODIES' stage is the door's INTERIM caller for this one objective until this volume's dispatcher wave mounts the cadence — then the dispatcher calls it and BD's stage stops (one caller at a time; BD §10.4, OD-BD-63). The offer is ONE event (no errand row); the delivery's operative carrier is a later ES row (the fold's §3.1 ES INBOX).] [CORRECTED 2026-10-16 (coherence fold) — LANDED AS A LEAF: `espionageDoctrineStage.js` is imported only by `espionageRider.js` among engine modules; no autonomous dispatch mount was found (PLAUSIBLE — import census only), so "the court decides to spy" is not mounted, and the IN-3 handshake is NOT wired (see the bracket at §3.8).] **ES-5b** = `presentShare01` and the bench
grain (§3.11): the council-weight discount at `rulingBlocOf` AND the contest
weight at `topFactionEntries`. **ES-5c** = THE CAREER REGISTER (§3.14's arms A
and C) — compiled, promoted READY 2026-08-11, and BUILT: `careerRiskFor` in the
new `espionageCareer.js` INFO leaf, consumed by
`npcLadderChallenge.js#defenseScore` (NOT `npcLadderContest.js` — see the
amendment under §3.14) and by `espionageGauntlet.js#gatherOrGovernRead`, whose
declared-absent promotion term now flips CARRIER-CONDITIONALLY. It inherits the
naming drift `promotionRiskOf` → `promotionRisk01Core`. **ES-5d** = THE CAREER
CREDIT (§3.14's arm B, `freshMissionGradeFor` into the maintenance road) —
split out because it is a second behaviour family needing a named state writer
the register does not, and because its substrate does not exist yet; compile it
just-in-time after ES-5c lands. [CORRECTED 2026-10-16 (coherence fold) — STALE: ES-5d LANDED (`espionageCareerCredit.js` → npcLadderKernel.js:93); see §3.14's ES-5d notes and the bracket there.] ⛔ "BOTH GRAINS … IN THE SAME COMMIT" below is the ES-5a
draft's sentence and is SUPERSEDED: the grains ship in two commits, under ONE
CR-ES-1 signature (CR-ES5B-3). ⛔ And §3.11's "with no further code" claim is
FALSE as measured — `factionCompetition.js` holds no bloc read at all, so ES-5b
BUILDS the reach on that file's real contest weight (`entry.power`) rather than
inheriting one. Charter: the doctrine STAGE
(`espionageDoctrineStage.js` — gathers words off worldState/snapshot,
returns null when dark; the conquestDoctrineStage split) + autonomous
dispatch cadence (doctrine frequency01 × the deliberation read × candidate
availability — the court decides to spy, keyed-hash, receipted in doctrine
words, setting the mission DEMAND per §3.12) + `wariness01` wired into the
gauntlet + the IN-3 handshake
(suspicionOf terms when lit — §5 row 9) + `presentShare01` (the memberNpcIds
first consumer, the lazy bloc leaf, the DISCLOSED lit-shift golden pair, the
Roads §1 law 5 amendment sentence — BOTH GRAINS, §3.11 — landed in the
design doc IN THE SAME COMMIT) + THE CAREER CONSUMERS (§3.14, G, Q1-gated
with the bench arm): `promotionRiskOf` into the ladder contest math +
`freshMissionGradeFor` into the ladder's maintenance road (npcLadderActive-
gated; declared-degraded when the ladder is dark — the grade stays a
receipt). Budgets: stage ≤ 200; bloc leaf ≤ 120; career leaf ≤ 120;
settlementPolitics (1043)
and factionCompetition (996) gain ≤ 10 composition lines each (both
war-adjacent — CHECK-GIT-FIRST; the ladder family npcLadderKernel/State/
Contest is a THIRD collision surface — CHECK-GIT-FIRST there too). Pins:
absence dark-world byte-identity
(roads-lit espionage-dark EXPLICITLY fenced — the amendment's own
scope-guard); the discount's both-sides-live mutant; ⟨F3⟩ THE COVERT-
SILENCE NEGATIVE (anchored): an in-schedule, fully-covert mission
contributes ZERO wariness at its target — seeded with a real covert row at
the target, asserted through the REAL derivation (never an empty harness);
the declared-face-lapsed positive beside it (the conjunction proven both
sides); the ES-module source scan asserting the wariness derivation imports
no `covert.*`/truePurpose reader; the career both-arms pins (an absent
holder's contest defense measurably weakens — mutant flattens
promotionRiskOf and the contest outcome reverts; a graded success moves
standing through the ladder's own writer, scan proves ES writes none); the
JSON-alias
round-trip on the roster walk; cadence determinism (same seed, same
dispatches); the doctrine receipt's no-decimal runtime pin (L5 — composed
output). Req 13: THE ENGAGEMENT WAVE — both axes drive targeting, method,
frequency, employment; req 14: engine-only. Collision: settlementPolitics /
factionCompetition (INT-2's future surface — additive leaf keeps the diff
attributable) + the npcLadder family.

[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: none — silent success by law; the leak surfaces only on exposure (yearly; ES-7's retroactive clause) · TIER: belief infoMode (spatial canon ∧ infoMode ≠ omniscient) · host flags: `errandSpineEnabled` + `espionageEnabled` (+ the corruption web for the leash read) · DEGRADED ARM: web dark ⇒ no leash read]
**ES-6 — THE DOUBLE AGENT (fifth slice; degraded-dark when the web is
dark).** Charter: the leash read at dispatch (deterministic, keyed on the
minted errand id) + the leak delivery (magic two-address sends; mundane
reach-priced) + meta-intelligence writes + the silent-success discipline
(no news, no home state — the negative is the hardest pin) + vetting quality
from home security × own-web health + the retroactive Herald clause on web
exposure. Budgets: `espionageLeak.js` ≤ 200. Pins: leak-only scan (nothing
in the espionage set writes a FALSE report home — the honesty mutant plants
one and the scan reds); silent-success negative (a leaking mission's home-
visible state is byte-identical to a clean one until exposure); vetting
both-arms (careful refuses close-tie/suspect; hurried takes the volunteer —
both real, per the built vocabulary); leak timing both world arms. Dormancy:
web dark ⇒ no leash resolution ⇒ leaf no-ops. Req 13: employment strictness
consumed; req 14: engine-only.

> ⏱ **AMENDED IN PLACE, 2026-08-11 — ES-6 AS CHARTERED WAS REFUSED AND SPLIT
> INTO THREE.** The arithmetic: four behavior families against a cap of one, and
> **five modified production files against a cap of three**, plus a NEW belief key
> (owner-gated persistence shape and a breach of the zero-new-keys law), plus a
> Herald kind §4 gives to ES-7, plus a news producer that would have to be built
> inside another volume's file. Three of the six chartered mechanisms have no
> substrate in `src/` at all (§3.13's C1/C3/C5).
>
> - **ES-6a — THE LEAK. LANDED.** The leash read re-sited to the product stage,
>   the delivery through the existing product road with `observerId` = the patron
>   court, BOTH world arms bought from the landing's own `world` field at one
>   post-loop call site, the two-party existence leak, and the silent-success
>   negative as a DIFFERENTIAL rather than a token scan. **One behavior family,
>   ZERO new persisted families, ZERO new keys, ONE modified production file.**
>   `LEAK_TUNING.FIDELITY_W = 0.7`, chair-authored and DERIVED: at that discount
>   an enemy's copy clears the categorical-adoption threshold only when the home
>   read was above ~0.857 — a clear look leaks a conclusion, a partial look leaks
>   only that something happened. Both sides of that boundary are pinned.
> - **ES-6b — THE VETTING QUALITY.** A pure derivation plus its one consumer.
>   BLOCKED on the dispatcher, not on any lane: its consumer has no production
>   caller, so it should ride the wave that builds one.
> - **ES-6c — THE RETROACTIVE CLAUSE.** Folded into ES-7 outright.
>
> ⚠ Budgets: `espionageLeak.js` ≤ 200 held — it landed at **136 effective lines**.
> The "leak-only scan" pin above was ruled a DIFFERENTIAL rather than a source
> scan: a scan for a falsified report has no honest token to match on, so it would
> pass when the leak was absent for the wrong reason and would convict the very
> headers that state the law.

[ADDED 2026-10-16 (coherence fold, req 16/17) — FIRST-VISIBLE: UNBUILT — when built, the six `espionage_*` beats at a mission's weekly legs (departures dm-only; confirmations and refutes on the knowledge desk; captures and betrayals public) and the three tap registers; this wave is the gate to all felt value in the family · TIER: belief infoMode (spatial canon ∧ infoMode ≠ omniscient) · host flags: `errandSpineEnabled` + `espionageEnabled` (+ IN-5's desk) · DEGRADED ARM: dm-only kinds fail-closed upstream]
**ES-7 — THE VOICE + THE MEASURE (final slice; after IN-5 for the knowledge
desk; AMENDS the ES-0-landed certification row — ⛔ there is no pending
entry and never was: ES-0 landed the full CQ5 trio at `55674790`, §2's
rider is the law).** Charter: the six Herald kinds
with the FIVE JOINS each in their mint commit (annex-verbatim pool rows in
RECEIPT_POOLS_INFORMATION.md's family or the ES annex the chair assigns ·
registry row with requiredSlots + slotless fallback · WHAT_PHRASES · section
authority — knowledge desk for confirmations/refutes, the war/politics desks
for captures/betrayals per heraldRouting's EXACT_SECTION · full address
chain with typed action + recorded reasons + audience); the TAP REGISTER
in the pools (H — the three house-voice phrases ride the confirmation/
refute pool rows as fidelity clauses; the grade receipt speaks doctrine
words per §3.14); dm-only kinds
covert:true FAIL-CLOSED UPSTREAM (L6 — departures/confirmations/refutes
surface publicly ONLY through §3.5's exposure road); own walker file
(kindPoolWalker import, frequency-scaled floors); the DM verb
`DISPATCH_CONFIRMATION_MISSION` (JUDGMENT J-ES-12: ALWAYS-PROPOSAL — the
store action routes as a proposal the seat answers per doctrine + risk +
candidate availability, refusal receipted in doctrine words; the DM plays
the world, the court keeps its character; operationRegistry +
`npm run gen:compendium-data` in the same commit); the certification row —
LANDED AT ES-0 — is AMENDED with its dispositive literals; the ES envelopes
(mission mix by product, catch-rate band, standoff share, leak share, grade
mix and rooted-dwell share (G), tap mix (H) — each
INTERVAL_WEEKS-derived, each with an executed mutant). Req 13: the row
names the doctrine words each kind may speak; req 14: THE EDIT-VERB WAVE —
the one player/DM surface, named. Collision: heraldRouting (525) +
compendium regen (additive).

**Wave count: 9** [CORRECTED 2026-10-16 (coherence fold) — the count omits ES-Da, the composite rider (LANDED `6dbb76c2`; `espionageRider.js` → envoyDiplomacy.js:41, "THE ONE caller since ES-Da", subsystemRowsBelief.js:178), which is the ONLY mission mint path at 00b648c9d (§3.13's amendment records it; this list never did), and ES-Db (FP-ORDER pair 4, after U26). The program is ES-0..4, 5a-5d, 6a/6b (6c folded into ES-7), 7, Da/Db; twelve units landed at 00b648c9d (ES-0..4, 5a-5d, 6a, Da). ES-Da's own line — FIRST-VISIBLE: none (silent covert cargo on an accepted peace envoy until ES-7) · TIER: belief infoMode (spatial canon ∧ infoMode ≠ omniscient) · host flags: `errandSpineEnabled` + `espionageEnabled` + the envoy-diplomacy gate that carries the host envoy (PLAUSIBLE) · DEGRADED ARM: dark.], and ⏱ **AMENDED 2026-08-11: ES-6 IS NOW THREE SLICES**, the same
budget split ES-5 took and for the same reason. The spine's `→ ES-6 →` reads
`→ ES-6a → ES-7` today: **ES-6b** carries no place in the spine because it is
blocked on a DISPATCHER wave nobody has chartered (its consumer has zero
production callers — ⚠ read "no production caller" as the DISPATCHER
DEAD-HEAD, per C-TLF-11's corrected clause above), and **ES-6c** has been
folded into ES-7 rather than counted.
As with the ES-5 split, this is BUDGET and never scope. Dependency spine: ES-0 (free) → ES-1 (SP-D) → ES-2 →
ES-3 (SP-B for the full arm) → ES-4 (SP-B2; the discharge) → ES-5a → ES-5b
(Q1) → ES-6 → ES-7 (IN-5). ES-5 was ONE wave when this count was written; the
a/b split was taken inside ES-5a's landing commit `41ddeae0` for BUDGET (both
grains modify five logic-bearing production files against a limit of three) and
RATIFIED by CR-ES5B-1. ⚠ The CAREER grain is **ES-5c** and is not in this count:
it compiles only after ES-5b lands (CR-ES5B-7). One CR-ES-1 signature covers
ES-5b and ES-5c both (CR-ES5B-3) — the split is budget, never scope. No wave edits pulseKernel.js or applyWorldPulse.js
(banked, zero headroom — L1); every mount is the errand advance's own stage
walk or the lifecycle host.

---

## §5 SEAM CONTRACTS — every neighbor, both sides pinned, a tripwire each

| # | Neighbor | The contract | Pin / tripwire |
|---|---|---|---|
| 1 | WAR | Capture rides WR-7b's ONE hold writer + WR-7d's computed ransom road (persistence stays owner-gated); the covert worth/dwell arms are one-argument-readable (CR-WIRE-A idiom). The FRIEND-betrayal CASUS is a WAR-SURFACE change (warReasonTaxonomy is 16↔16, pinned) — ES-2 mints grievance + trust collapse ONLY and files the casus as a war-chair queue row (the WR-8 recipe: a real scorer + 6 surfaces + 5 literals — never smuggled in a wave). ⟨F2⟩ The ANONYMITY AMENDMENT (Q2) lands at the law's LIVE HOMES — the informationStatecraft.js BOUNDARY header (the file-header comment block opening `BOUNDARY (design §0.5 amendment, owner ruling 2026-07-19` — located BY SYMBOL, never by line address; the same block the npcCredibility exception was amended into) + DESIGN_FP_INFORMATION.md §1b (which carries the NO-FATES phrase-scan ENFORCEMENT ES-7's strings run under) — the war volume gets ONE cross-reference line beside the WR-7 hostage machinery, never the amendment text (it has NO §0.5 section; headers run §1..§10, measured). | Import pin: hold writer single-home; the taxonomy count pin reds any silent 17th pair; the casus queue row is the tripwire; the amendment's phrase-scan runs at its §1b home |
| 2 | THE ROADS | UNTOUCHED. Pure-leaf imports only (`embassyEnvoyWeight01`, `captureProbability` family, `riskToleranceOf`, T4 rung table). `verification` purpose stays the ambient rumor-fidelity verify — different write surface (rumor records) from ES products (belief records). | Import-source pins both sites; a source scan asserts no ES module writes `spatialLedgers.roads` |
| 3 | TRADE (TR-8) | Merchant cover = declaredPurpose `commercial` on a covert-class errand — the SAME SP-D seam TR-8's compromised factor uses from the other side (TR-8: declared-commercial hiding covert; ES: declared-anything hiding confirmation). One seam, two consumers, zero duplication; ES-2's `caught_spying` cause and TR-8's capture share the one hold writer. `secrecyTradeFactor` (IN-0d) composes untouched. | The SP-D consumer-map walker carries BOTH rows; a spelling scan keeps `caught_spying` the one covert hold cause |
| 4 | THE SPINE (SP-B/SP-D) | Products write ONLY SP-B's exported axis spellings (`conditionsBands.{tierBand,storesBand,routePositionBand}`); the mission row consumes SP-D's purposeClass/declared/true fields and adds ONLY `covert`. ES registers in SP-D's frozen consumer map (row: espionage/covert). | Seam-5 axis-drift scan (no axis token outside SP-B's module); the both-ways consumer-map walker; normalizeErrand round-trip pin |
| 5 | TREATY/GRAMMAR | Re-appraisal on confirmed/refuted legs: GR-2's pact triggers re-score on the NEXT tick's changed beliefs automatically (triggers are re-derived — no coupling code); the deliberation read extends `answerDueTick` (one gated line, GR-side, landed by whichever wave is second). Tainted-journey terms re-grade via testimony (§3.5) — no term is voided (CR-WIRE-B inviolate). | The GR-side line carries a by-name `espionageEnabled` read; a fixture proves a REFUTE flips a pact trigger the next tick |
| 6 | SOVEREIGNTY MARKET (WR-10) | THE LEGS SUPPLY (§6): ES-4 + SP-B + SP-B2 are the amended green condition of `sovereigntyTradeEnabled`'s lighting (recorded in CR-WR10-H + FP §3/§9 row 4; ⟨F9⟩ the certification lighting-order ROW was minted at SP-B2 on 2026-08-05 — `SOVEREIGNTY_LIGHTING_EVIDENCE` in src/domain/certification/warConvergenceContract.js, measured by tests/lint/sovereigntyLightingContract.walker.test.js; ES-4 SATISFIES it rather than minting it); the buyer's deliberation arm is a stage-local gated read (the stage's composition untouched — the injectable-seam law). | The fed-by-espionage contract fixture; the non-neighbor differential pin; the marker `ES-4-DISTANT-SOURCE-EVIDENCE` in the pin's TITLE — an `it`/`test` title and never a `describe` title, in the DECLARED address `tests/domain/espionageDistantSourceEs4.test.js` (the cap `d48224e3`; recipe pointed at, not copied — clauses (0) and (0b) in the walker header) — which flips the existing three-wave row to SATISFIED |
| 7 | HERALD | Six kinds × the FIVE JOINS in their mint commits; dm-only covert fail-closed UPSTREAM; public kinds carry the full address chain; own walker file; significance classes from SP-A's family (covert beats `routine`-class so quiet departures never clear `passesSignificanceGate` — refinement 9 lands on the existing gate, measured). | Per-kind walker; the covert-departure significance negative (anchored); the retroactive-exposure fixture |
| 8 | INTERIOR/POLITICS | The absence discount feeds the EXISTING bloc reads via one lazy leaf (no second vote-weight spelling — HZ5); INT-2's counsel and INT-3's decision incidents consume the lightened blocs for free; an espionage SCANDAL (public exposure) is eligible to become an INT-3 `_decision` sibling incident ONLY through INT's own mint (no ES-side incident types). | The deleted-symbol pin (`conquestVoteWeight01` absent) stands guard; the bloc leaf's import-source pin; INT-3's own walker owns incident types |
| 9 | INFORMATION siblings (IN-2/IN-3/IN-4) | J-INA-2 EXTENDED: products ride the report road; plants ride the plant roads; the two never share a writer (scan-pinned). IN-3's `suspicionOf` gains the two wariness terms when both are lit — ONE derivation, ES consumes it lit / derives minimally dark. [RULED 2026-10-16 (coherence fold §3.1.12) — not wired at 00b648c9d (suspicion.js:8-10); see the bracket at §3.8.] ⟨F8⟩ THE VETTING READ HAS ONE HOME: `vetVolunteerEnvoy` (sendTwoDivergence.js) — IN-3's VET (which lands BEFORE ES-1 in the compiled order and composes the same module's vocabulary) and ES-1's casting BOTH route through that one reader; neither program forks a second vetting derivation (the same one-derivation treatment this row gives suspicionOf; source-scan both sides). IN-4's couriers are CARGO movers, ES missions are PRODUCT movers — distinct purposes on the one spine, both in the consumer map. [RULED BY DELEGATION 2026-10-16 (OD-FC-9 — 2026-10-16 (coherence fold §3.2.7) — this row never reconciles IN-4's falsifying courier double agent with §3.13's leak-only one; see the bracket at §3.13.] | The writer-boundary scan (ES-3); the suspicionOf handshake pin lands IN-3-side with a by-name espionage read; the vetting one-home scan (no second `vetVolunteer` spelling in src); consumer-map rows distinct |
| 10 | FAITH + the alignment estate | The doctrine reads the ONE moral ladder verbatim and mints `lawWordFor` ONCE (warSeatBooks' private copy retired; INT-1 later consumes the same export — coordinate, both-site headers). Faith's observer-axis judgment of espionage scandals (a benevolent patron's court caught spying) rides WF's own judged-kind machinery (the `sovereignty_sale_judged` precedent) when WF-8 lands — pre-pinned as a declared-future kind row. | The one-spelling scan (no fourth law-band vocabulary); the WF declared-future row's red is the lift signal |
| 11 | MAGIC ECONOMY (W-K) | Existence = the pair gate NOW (projection-only, J-ES-7); price = `magicExploitationGate` + QUERY_PRICE_BANDS prose WHEN `magicEconomyActive` lights — the price arm ships DARK with its own fence; the `Message network (high magic)` institution names the instrument in prose when lit. Law 2 enforced BY SIGNATURE (the magic gate takes no economy; the price arm takes no magic axis). | The dark price-arm fence; a pin that the existence gate never reads the economy flag (signature-shape scan) |
| 12 | CORRUPTION WEB (INT/IN shared substrate) | Inside assets and double-agent leashes READ the web (resolveLeash, compromisedSecurityInstitutions, returned-captive channel); ES never writes web state — conversion of ES captives rides the web's existing returned-captive road (CHANNEL_RETURNED_CAPTIVE 0.6, already "THE ROADS §10" — the same clause serves the errand's returns). A live asset ALSO raises the tap ceiling to `delta` (H, §3.7) — the same read, a second consumer, no second leash spelling. | Read-only scan on the web ledgers from the ES module set; the returned-captive fixture; the asset-less-delta anchored negative (ES-3) |
| 13 | AMBIENT ESPIONAGE FLAVOR (relationship rules + reframe) ⟨F4⟩ | `relationshipRulesAdversarial.js`'s `cold_war_espionage` internalDrift (metadata `incidentType:'espionage'`) is a LIVE ambient lane narrating espionage-FLAVORED drift on cold-war edges, and `reframeKernel.js` holds the dark token `'espionage_all_along'` — the estate tells TWO espionage stories: ambient cold-war atmosphere vs REAL missions. Contract: the ambient rule is UNTOUCHED (it is weather, not missions); every ES receipt kind is `espionage_*`-prefixed and receipt-addressed so the two are distinguishable at the Herald and in cert rows; ES exposure feeds existing incidentTypes only through their own mints — `'spy_exposed'` through the statecraft road it already owns (§3.5), `'espionage'` (the ambient spelling) NEVER minted by ES, and any interior `_decision` incident only through INT's own mint (row 8). | A spelling scan: no ES module writes `incidentType:'espionage'`; the kind-prefix walker (all ES kinds `espionage_*`); the ambient rule's own tests untouched — a diff there is a tripwire |
| 14 | THE OPPORTUNITY (OP; the WR-7 errand spine's owner mints) [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §C ES · B.1 · `DESIGN_FP_ARCH_OP.md` §15)] | THE DECLARED MARGIN `slackTicks`: a persisted VALUE minted on the errand row AT DEPARTURE (the court's patience band × the journey, DRAFT, UNMEASURED; minted by the WR-7 spine owner beside the return window `envoyDiplomacy.js :: expectedRoundTripTick`, which at master is a ZERO-SLACK round trip — the outbound arrival + 1) — THE OWNER'S, VISIBLE; until it lands an ENVOY never detours (presence-only) and the silence inference is the receipted cost of any late return; operatives keep the covert itinerary cap (§3.4) and paragons CH's aim clock. The `custody01` factor (§3.3), the custody→rescue order and the occupied arm (ES-2b), WR-7d's arrival (§3.10). | OP's car-0 census of `catchChance01`'s factor list and `expectedRoundTripTick`; the margin's absent-⇒-presence-only pin |
| 15 | THE MOVEMENT GRAMMAR (MG) + THE MENACE's sighting row (MN) [ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 A.4 · `cure/D-MG-r1.md` §4 ES)] | ES is a declared UNIT-sighting producer (§3.6's bracket; kind `unit` + `heading`, OD-MG-6 the owner's); MG names the rooted dwell / planned stay — no change to ES | MN's closed caller list widened by declaration (three producers) |
| 16 | THE WAY OF WAR (WS) [ADDED 2026-10-20 (fp-final P6c; WS-r1-10 · `cure/D-WS-r1.md` §4 ES; `DESIGN_FP_ARCH_WS.md` §4.2 C12)] | ES NAMES, at its unit, the ERRAND-KIND input of a court's mission choice that WS's C12 leans (`way_subversion` → "toward the foe's seat"), today a ⛔ SLOT in WS (ES dark: `espionageEnabled` needs `errandSpineEnabled`); ES CONFIRMS `corruptionWeb.js :: foreignGripOf(worldState, snapshot, patronId)` (W-DOCTRINE-3b) as `way_subversion`'s carrier — WS's `way_subversion` is PARKED until then and leans nothing | the C12 slot's PRIOR lean only (`wayLeanOf`), never a second read of the court's character |

**Seam count: 13.**
[ADDED 2026-10-20 (fp-final P6c; rows 14–16 above) — THE SEAM COUNT OF RECORD becomes 16 at P7 (the line above stands as history).]

---

## §6 QUEUE SLOTTING — the amendment the chair lands in DESIGN_FP_ARCHITECTURE

The following text folds into the FP volume — now LANDED at
docs/DESIGN_FP_ARCHITECTURE.md (99d63d92; section map re-measured: §3 flag
family, §4 canonical models, §5 waves, §9 seam matrix, §11 chair questions;
the phase-3 header text verified verbatim). Each clause names its landing
section. It is written to be landed verbatim:

1. **§3 THE FLAG FAMILY — row 44 (⚠ attribution corrected: the flag
   LANDED AT ES-0 — §2's rider and ES-1's strike-note both record it;
   the parent volume's FLAG-ATTRIBUTION NOTE already matches):**
   `| 44 | espionageEnabled | ES-0 |
   covert confirmation missions on the errand spine: mission mint + gauntlet
   + typed products (CONFIRM/ACQUIRE/REFUTE) + doctrine + absence discount |`
   — and the existing-flags paragraph gains: "`espionageEnabled` requires
   `errandSpineEnabled` lit first; its axis-fed arms degrade declared while
   `believedConditionsEnabled` is dark."
2. **§4 CANONICAL MODELS — the ES entry (conditional-field family):** "ES:
   `envoyErrands[].covert` (present only on covert-class rows; itinerary ≤ 3
   + product + demand band + tap-marked gathered gradient partials +
   standoff mark; drop-when-absent;
   normalizeErrand taught in the writer's commit). Vocabulary members:
   FOREIGN_GUEST_HOLD_CAUSES + `caught_spying`; TRAVELLER_KINDS/
   HIDDEN_PATH_KINDS + `covert_envoy`. ZERO new top-level keys; zero new
   spatialLedgers sub-keys; every clock/doctrine/notoriety/wariness/
   dwell/promotion-risk read
   DERIVED (the ransomDwellRead precedent)."
3. **§5 THE WAVES — insertion:** ES-0 joins the early-ELIGIBLE set as a
   MEASURED FACT (pure leaves, no flag) — the FP volume's own §5 and §9
   early-eligible lists RECORD that measurement; neither list authorizes
   early motion, and this fold does not ask them to.
   ⛔ **THE FOLD DOES NOT WIDEN CQ2.** Chair ruling **CR-FP-12** (FP §11's
   dated addendum, 2026-08-05) DECLINES ES-0's early MOTION: the CQ2
   authorized set stays EXACTLY GR-0 + GR-1 + TR-1 + TR-9-contract. The reason
   is this volume's own ES-0 charter — it edits two live WAR-LANE files
   (`warSeatBooks.js`, `warMagicGate.js`) and its `lawWordFor` retarget is a
   cross-file war-lane VOCABULARY change with golden-shift exposure, the
   opposite of the pure-density, zero-collision profile CQ2's four members
   share. **ES-0 runs in STRICT ORDER**, early in cycle 2, so the decline
   costs no real motion. Eligibility is a measurement; membership in CQ2 is a
   ruling; the two are never the same sentence. (That Q-numbering is the FP
   volume's, not this one's.)
   ES-1..ES-3 land in
   PHASE 3 (INFORMATION) immediately after #19 IN-3 (so the suspicionOf
   handshake lands one-sided-then-joined); ES-4 lands directly after ES-3
   **and is the third member of the CR-WR10-H discharge** (see 5 below);
   ES-5a/ES-5b/ES-6 follow; ES-7 lands after #21 IN-5 (the knowledge desk
   exists).
   The phase-3 header amends from "SOL_QUEUE row 13; IN §4" to "SOL_QUEUE
   row 13; IN §4 + the ES owner-amendment family (this volume)". The wave
   count amends 60 → 69 (68 at the fold; ES-5 split into ES-5a/ES-5b —
   CR-ES5B-1).
4. **§9 THE SEAM MATRIX — rows 46-58:** the THIRTEEN rows of §5 above join
   the matrix under prefix ES; the matrix count amends 45 → 58.
5. **THE WR-10 LIGHTING CONVERGENCE ⟨F9⟩ (amends FP §3's closing paragraph
   and FP §9 seam row 4; the same amendment lands as one sentence in the war
   volume's §9 CR-WR10-H paragraph):** "The
   `sovereigntyTradeEnabled` lighting condition is satisfied by **SP-B +
   SP-B2 + ES-4 landed**: SP-B mints the leg SURFACES, SP-B2 wires the SEAM,
   and ES-4 proves the SOURCE — a non-neighbor (court, holding) pair
   appraised `known:true` through a completed confirmation mission, per the
   owner's espionage amendment (2026-08-04: spies are the source of
   tier/route/trajectory legs about non-neighbors). A market lit on surfaces
   without distant sources would clear only rumor-range holdings — the
   CR-WR10-H dead-lighting trap one level up." AND the FP §3 closing's
   sentence "the WR-9 certification lighting-order row cites those two wave
   ids as its green condition" is CORRECTED, not extended: no such row
   existed as an artifact anywhere in src/tests/docs (re-measured at
   32cc17f7 — the phantom claim lived at FIVE doc sites in TWO documents,
   all amended by this fold; the chair flagged it as an inherited phantom
   whose INSTRUMENT is built in cycle 2). **BUILT 2026-08-05 AT SP-B2.** The
   corrected clause now reads: "the lighting condition is RECORDED in
   CR-WR10-H (war volume §9), this paragraph, and seam row 4, and is
   EXECUTABLE as `SOVEREIGNTY_LIGHTING_EVIDENCE` /
   `evaluateSovereigntyLighting` in
   src/domain/certification/warConvergenceContract.js, measured by
   tests/lint/sovereigntyLightingContract.walker.test.js; it cites SP-B +
   SP-B2 + ES-4 as its green condition, reads UNSATISFIED_TRACKED while ES-4
   is unbuilt, and flips SATISFIED the commit ES-4 carries the marker
   `ES-4-DISTANT-SOURCE-EVIDENCE` into a live pin title."
6. **§11:** the FP chair-question list is CAPPED AT TEN by its own header —
   the ES questions do NOT inflate it. §11 gains one POINTER line, and the
   sentence that lands is the one the fold's §11 edit actually carries: "The
   ES owner-amendment volume (docs/DESIGN_FP_ARCH_ES.md) carries five
   ES-prefixed chair questions — its §7 is the authoritative list, RULED
   CR-ES-1..CR-ES-5." **THE POINTER NAMES RULINGS, NOT OPEN WORK:** this
   volume's §7 was retitled "ALL FIVE RULED" at the same fold and carries the
   signed rulings, so nothing in the FP volume should read the ES list as
   pending. §7 additionally carries the JOINT ruling **CR-ES-6** (the
   encounter-table admission, raised at the cohesion pass rather than as a
   numbered question, and shared with the WAYFARE volume) — recorded there so
   §7 stays the authoritative list the pointer promises. The FP cap of ten is
   untouched either way: ES rulings are never counted in it.

**Slotting rationale (why phase 3, not phase 1):** the mission machinery
needs SP-D (#6), the sibling discipline (two-channel writer boundary,
suspicionOf, the knowledge desk) lives in the IN family, and lighting is
owner-held at the terminal soak regardless — so citing ES-4 in the lighting
row delays nothing real while making the owner's joint-architecture clause
an executed fixture instead of a sentence. JUDGMENT, vetoable: pulling
ES-1..ES-4 forward to ride directly behind SP-D in phase 1 is coherent if
the owner wants the market's full supply chain proven before GRAMMAR — the
cost is landing espionage before its sibling walkers (IN-3's suspicionOf
handshake would land one-sided) and before the desk its voice routes to.

---

## §7 OPEN CHAIR QUESTIONS — ALL FIVE RULED, PLUS THE JOINT CR-ES-6 (each vetoable)

The five questions stand exactly as the volume posed them, recommendations
intact, ranked by blocking power. Each now carries the CHAIR'S RULING
(2026-08-05), labeled CR-ES-1..CR-ES-5 and recorded in
FABLE_VALIDATION_QUEUE.md at the fold commit. **CR-ES-6 closes this section
and answers no question here:** it was raised at the fold's cohesion pass, it
is JOINT with the WAYFARE volume, and it lives in this list because §7 is the
authoritative record of ES-prefixed rulings that the FP volume's §11 pointer
promises. Every ruling is vetoable by one
owner clause; an implementer NEVER re-rules, softens, or extends one silently,
and a ruling that the tree refutes is a STOP-and-report, not a re-ruling.

**Q1 — The Roads §1 law 5 amendment (blocks ES-5's absence arm).** "While
away, the NPC has NO influence on home politics" contradicts the written
law "TRAVELERS are NEVER off-stage." RECOMMENDATION: sign the §3.11
amendment — a flag-gated GRADED COUNCIL-WEIGHT DISCOUNT via memberNpcIds'
first consumer, `isOffStage` untouched, dark worlds byte-identical, the lit
shift disclosed. The literal reading (full off-stage) is refused as
implementation: it moves six kernels and every lit-roads golden, and it
makes a two-week trade trip politically identical to a hostage-taking.

**CR-ES-1 — RULED (chair, 2026-08-05; vetoable).** SIGNED — the §3.11
amendment: a flag-gated GRADED COUNCIL-WEIGHT DISCOUNT via the `memberNpcIds`
first consumer; `isOffStage` untouched; dark worlds byte-identical; the lit
shift disclosed. The literal full-off-stage reading is REFUSED as
implementation for the draft's own reasons (six kernels, every lit-roads
golden, a trade trip is not a hostage-taking).

**Q2 — The anonymity-law amendment (blocks ES-2).** The information-
statecraft header (owner ruling 2026-07-19) says a named NPC "is never
burned, turned, or executed by the engine"; this program puts named NPCs on
covert missions with capture. ⟨F2⟩ RECOMMENDATION: land the amendment IN THE
LAW'S OWN HOMES, in the amended-in-place voice — (1) the
informationStatecraft.js BOUNDARY header — NAVIGATE BY SYMBOL: the file-header
comment block opening `BOUNDARY (design §0.5 amendment, owner ruling
2026-07-19` and closing on the `the deeper no-fate carve is preserved intact.`
line, which is the SAME block the npcCredibility exception this question cites
as precedent was amended into (a line address is deliberately NOT given: the
first pass carried two spellings of it, `:43-51` and `:43-50`, off by the
block's closing `*/`, and hand-keyed line addresses rot) — and (2)
DESIGN_FP_INFORMATION.md §1b (THE ANONYMITY / NO-FATES BOUNDARY, which points
at that same header block — which ALSO carries the no-fates
PHRASE-SCAN enforcement that ES-7's Herald strings will run under, so the
law and its enforcer amend together). The war volume gets ONE
cross-reference line beside the WR-7 hostage machinery, NOT the amendment
text — the war volume has no §0.5 section (measured: its headers run
§1..§10), and landing the text only there would leave the in-force header
and its scan unamended: the exact split-brain the amended-in-place voice
exists to prevent. **THE SIGNED TEXT (CR-ES-2 — FINAL and verbatim; the
landing lane applies it to BOTH homes, unedited):**
"AMENDED (espionage era): a named NPC may
carry a covert mission and be CAUGHT — capture, hold, ransom, release, and
reputation charges resolve no fate BY THE ENGINE (the roads-hostage
precedent); the engine still never executes, permanently turns, or ends a
named character. The double agent LEAKS (an information consequence) and is
never 'flipped' as a fate." The BY-THE-ENGINE qualifier is load-bearing and
must survive edits: `FOREIGN_GUEST_HOLD_CLOSE_REASONS` already contains
`'death'` (measured — the DM-authored close vocabulary), and an unqualified
"resolves no fate" would accidentally outlaw the war lane's authored
closes. This preserves the product-scope law, the DM's authorship, and the
drama.

**CR-ES-2 — RULED (chair, 2026-08-05; vetoable). ⚠ FLAGGED — THIS RULING
AMENDS THE HEADER OF AN OWNER RULING (2026-07-19); the ledger row carries the
warning marker.** SIGNED, amended-in-place in BOTH homes — the
`informationStatecraft.js` BOUNDARY header block AND DESIGN_FP_INFORMATION.md
§1b (the law and its phrase-scan enforcer amend together); the war volume gets
exactly ONE cross-reference line beside the WR-7 hostage machinery, never the
amendment text. THE SIGNED TEXT above is FINAL and verbatim; the BY-THE-ENGINE
qualifier is load-bearing and must survive every edit
(`FOREIGN_GUEST_HOLD_CLOSE_REASONS` already contains `'death'` — an unqualified
no-fates would outlaw the war lane's authored closes). The amendment PRESERVES
the owner ruling's core — the engine still never executes, permanently turns,
or ends a named character — while admitting capture/hold/ransom/release, which
the owner's own espionage directive requires. One-clause veto restores the old
header.

**Q3 — The seat-character vocabulary break (blocks ES-2's captor-leniency
arm and any taint→testimony wiring).** warSeatBooks emits
`chaotic/benevolent/contested`; envoyTestimony + ransomChoices accept
`lawless/merciful/holding`; a wired row VANISHES silently (measured; latent
only because no src producer wires them — espionage is the first with a
reason to). This is a WR-7c/WR-7d shared-surface call, not a lane's.
RECOMMENDATION: unify on the CONSUMER vocabularies (`lawless/merciful/
holding`) by retargeting warSeatBooks' three private word functions, with a
both-vocab equality pin and the war chair countersigning — the consumer
sets are exported constants two built leaves already enforce, while the
producer's words are module-private and cheapest to move. Until ruled, ES-2
ships the captor arm DARK behind the ruling's absence (declared, not
silent).

**CR-ES-3 — RULED (chair, 2026-08-05; vetoable).** COUNTERSIGNED — the session
chair holds the war chair this era, so the countersignature the recommendation
asks for is given here. Unify on the CONSUMER vocabularies
(`lawless`/`merciful`/`holding`) by retargeting the three module-private word
functions in `warSeatBooks`; both-vocab equality pin. Until that lands, ES-2
ships the captor-leniency arm DARK behind the ruling's absence, declared not
silent.

**Q4 — Which decision sites take spy-before-decision (shapes ES-3/ES-5).**
RECOMMENDATION: this program wires the sovereignty buyer, GR-2 pact
answers, and its own cadence (J-ES-13); the WAR CHOOSER (settlementStrategy,
frozen surface) is explicitly deferred to a future owner ruling — a war
declaration that waits on a spy is a strategy-layer behavior change the war
chair should price, not a rider on an information program.

**CR-ES-4 — RULED (chair, 2026-08-05; vetoable).** ACCEPT — this program wires
the sovereignty buyer, GR-2's pact answers, and its own cadence (J-ES-13); the
WAR CHOOSER (`settlementStrategy`, frozen surface) is DEFERRED to a future
OWNER ruling and filed as an owner-queue row. No ES wave wires the chooser. [RULED 2026-10-16 (coherence fold §3.2.9) — the deferral is RELEASED by the owner's 2026-08-05 grant; see the bracket at §3.12 J-ES-13. This ruling's text stands as history.]

**Q5 — Third-party alliance topology ("A believes B stands with C") — the
one classical spy product with NO surface (owner-shaped, blocks nothing).**
warAllianceRisk reads web membership from TRUTH by design; the belief
estate owns exactly one categorical relationship axis (observer↔subject).
An ACQUIRE here would be a NEW persisted key family — owner-gated.
RECOMMENDATION: PARK IT, recorded — ship the program without it (the
pairwise `allianceLabel` REFUTE already covers "they are not the friends
you think"), and put the new-key question to the owner as a one-line
future-widening row rather than smuggling a surface into SP-B's family.

**CR-ES-5 — RULED (chair, 2026-08-05; vetoable).** PARKED, recorded — ship the
program without it; the pairwise `allianceLabel` REFUTE covers the drama; the
NEW PERSISTED KEY FAMILY question that an ACQUIRE here would raise goes to the
OWNER as a one-line future-widening row. Never smuggle a surface into the SP-B
family.

**⭐ CR-ES-6 — RULED (chair, 2026-08-05; vetoable). THE JOINT RULING —
this volume and the WAYFARE volume are BOTH bound by it, and it answers no
Q-numbered question: it was raised at the fold's cohesion pass.** The WAYFARE
volume's §4 encounter-pairs table ADMITS A FIFTEENTH ROW rather than granting
this program's gauntlet an exemption from it. **E15 = spy-dwell detection —
the covert operative × the host settlement watch**, co-located per stop while
dwelling (§3.3(b)'s hostile-class stay roll), resolver `espionageGauntlet.js`
(NEW at ES-2), outcomes in the SAME foreign-guest-hold family rows E3-E7
already carry: capture opens a hold with cause `caught_spying` through THE ONE
hold writer, and the non-capture arms are uncaught passage and §3.5's
retroactive-exposure road (taint, not a hold). WY's anti-vacuity moves from
fourteen to fifteen and WY-6's walker is BORN SEEING FIFTEEN — it VERIFIES
E15, it does not re-close the table around it. **ES-2's charter takes the
SAME-COMMIT obligation: mounting the resolver adds the table row.**
**THE CONSOLIDATION BOUNDARY, recorded in both volumes so it is never
re-derived:** the encounter-resolver REGISTRY is **ONE** — the WY table,
closed, walker-scanned, one row per resolver — while catch/probability **MATH
stays PER-RESOLVER.** This program's catch model (`catchChance01` ×
`legStack(k)` × `dwellRamp`, §3.3) is MATHEMATICS, not a registry; folding it
into a manifest whose job is totality would buy nothing and cost the manifest
its shape. **Why a row and not an exemption:** ES-2 lands in PHASE 3 and WY-6
in PHASE 4, so absent this ruling the WY-6 author writes a closed-at-fourteen
table against a tree that already contains an untabled resolver — and must
either break a pin that volume states twice or narrow the resolver-set scan,
and a narrowed scan is a hole nobody watches.

---

*Compiled read-only against HEAD 67a907fe; REVISED read-only at HEAD
99d63d92 (the FP volume landed between the two — docs/
DESIGN_FP_ARCHITECTURE.md and its per-program siblings are now the
authoritative paths). Inputs: the owner directive (verbatim-intent = law;
additions A-H — A-F in the first compile, G/H integrated in the revision —
and refinements 1-11 all landed in §3), six censuses re-verified, the FP
compiled volume (60 waves, 43 flags — this family makes 68 and 44, and the
WAYFARE volume lands in the SAME fold commit and carries the totals on to 75
and 52; 68/44 is this family's INTERMEDIATE contribution, never the parent's
post-fold state),
docs/DESIGN_FP_ARCH_SP.md §4/SP-D, and the war volume's §1/§9/§10. The
cohesion critic's F1-F9 are closed in place (⟨F#⟩ marks); every closure's
symbol home re-measured. Zero new top-level keys; one conditional
sub-record; NINE waves (§4's amended count — ES-6 split to three slices,
ES-6c folded into ES-7), all dark; [CORRECTED 2026-10-16 (coherence fold) — see the bracket at §4's wave count.] THIRTEEN seams pinned both sides; five
questions to the chair. Where this document disagrees with the tree, the
tree wins and the disagreement is a bug to report.*
