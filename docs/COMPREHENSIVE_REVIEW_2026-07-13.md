# COMPREHENSIVE REVIEW — 2026-07-13
## The Playbook PART-9 grade-check: the whole codebase as code, as product, and against its ambition
### Fable 5 (surveyor/architect) synthesizing 20 Fable survey agents · 9.4M survey tokens · 1,837 tool uses
### Baseline: branch review-fixes-2026-07-08 @ 62c81a0c (M1–M11 ladder complete), full gate GREEN (8,348/8,348; verify:dist 108/108)

**Coverage: COMPLETE — 28/28 agents** (round 1: 20 before the session-limit cut; round 2: the 8
re-dispatched slices landed same evening — registers for both rounds below). **271 findings:
0 critical / 57 high / 121 medium / 101 low.** All verdicts are surveyor-evidenced but
PRE-VERIFICATION — Phase V (Opus adversarial verification) rules on each before any fix ships.

**§1.1 ROUND-2 DELTA (the 8 late slices; the synthesis below already anticipated most of it):**
- **security-privacy: A+ — the strongest slice.** 50-table RLS census complete; zero missing
  search_path pins net-current; DM-truth seam defended in depth with client+server twins and
  drift tests; money paths model-grade. Raises the security posture above §2's implicit read.
  (The §6.1 deploy-lag alarm stands — enforcement is only as live as the applied migrations.)
- **sim-logic-counterparts: B+ — the mechanic matrix confirms §3 wholesale.** PRESENT-and-two-way:
  war↔withdrawal/exhaustion/ceiling, siege↔relief, occupation↔resistance/liberation,
  plague↔care/recovery-floor, corruption↔exposure, conversion↔revival, boom↔bust,
  embattlement↔pacification. ABSENT/dead: calamity gate (no writer), all four plague couplings,
  retreat, umbilical, lever effects, benevolent famine relief, regional recovery. NEW sharp fact:
  **dramatic_campaign lights ZERO drama systems** (OPEN + intensity only). Stasis is preset-honesty
  + dead seams, not engine architecture.
- **code-quality: A− with one new HIGH:** the **entity-ref half-merge** — generate-narrative
  (server) injects ⟦entity:id|name⟧ tokens into thesis/notes/NPC goals while the client renderers
  (ProseParagraph/ProseText) exist only on the master lineage → paid-surface token leak on a
  deploy-order accident, and a master-merge landmine beyond the mapped worldPulse 3-way. Plus:
  ~30 divergent clamp copies, 8 slugify variants, ~12-file orphan census, no size ratchet on the
  domain layer.
- **content-immersion: B+:** player-facing rumor fiction renders raw engine tokens ("word of
  strategy deploy"); the crier proclaims plague arrivals as trade news; namingData contamination
  ("Kayla", "Gemini" as Mesoamerican women); plague can never rank MAJOR news while grain cascades
  always do. The connective tissue speaks engine between diegetic headline and crier quote.
- **determinism-constitution: A−:** ZERO purity violations across the entire M1–M11 ladder
  (systematic greps + enclosing-scope reads); independently re-confirmed the M10b cursor bug; the
  verify:dist anti-vacuity guard **exists on the master lineage and was lost in reconciliation**;
  src/workers sits outside the purity lint walls.
- **test-quality / build-tooling-docs / docs-knowledge (A−/A−/B+):** VERIFY_DIST vacuity now
  triple-confirmed; four spatial goldens self-mint on missing fixtures; M10b 'living' mode and the
  on-open trigger untested; no two-mover composition test anywhere; check-domain-strict passes
  green when tsc fails to run (executed control); sf-bridge.js (1,205 lines incl. the spatial
  capture seam) outside every gate; the STATE LEDGER contradicts git truth (M11a/M11b unrowed,
  "foreign WIP" note on committed code); ARCHITECTURE.md has zero mentions of the spatial engine;
  **playbook §0.8 and the round-21 plan double-allocate the same 1,092B headroom** (W5 ~890B +
  W2 +363B both promised out of it).

---

## 1. VERDICT

This is a genuinely excellent codebase wrapped around a genuinely deep simulation, and neither is
the problem. The problem — the consistent, cross-slice, evidence-backed problem — is that the
newest third of the engine is not yet plugged into itself or into any surface a DM can see, and
that the world's political layer *narrates* changes it never *executes*. Nothing is rotten. There
is no architectural dead end, no state-corruption epidemic, no security fire (one deploy-hygiene
alarm, §6). The fix program this review feeds is overwhelmingly **wiring, counterpart-closing, and
legibility** — high-leverage, mostly lazy/budget-free, and exactly the kind of work the
bold-over-safe directive was written for.

Grades (survey consensus, my synthesis):
- **Code: A−.** Constitution genuinely enforced, determinism engineering exceptional, remediation
  culture demonstrably works (the June review's findings are verifiably fixed across slices).
  Held back by lifecycle ghosts in the newest code and a year-two performance blind spot.
- **Simulation substance: B+.** The pressure half (war, plague, calamity, embattlement, scarcity)
  is deep and real; the release half (peace with grip, recovery, relief, reform) is selectively
  hollow — often *narrated but not executed*. The moat mechanics (moral-plane ecology, religion's
  two-way arc, constraint-driven generation) are real and rare.
- **Experience: B− for the living world, A− for the static product.** The landing/dossier/anon
  funnel is the strongest surface in the product. The mover ladder is almost entirely invisible:
  ~8 of 11 mover systems have no read surface; the PDF — the paid deliverable — contains zero
  bytes of the Phase-5.5 engine.
- **Commerce/trust: B+.** Money architecture is a crown jewel; the storefront's *facts* have
  drifted into self-contradiction across six surfaces.
- **Overall: B+ engine-of-record, A− bones, with a one-wave path to A.** The sentence that
  summarizes 208 findings: **the engine is one wiring-and-legibility program away from delivering
  its own thesis.**

---

## 2. AS CODE

The discipline is real and pervasive, not aspirational. The one-week kernel reseeds per tick and
forks by stable identity keys; dormancy is enforced by construction (materialize-only-when-non-empty
+ explicit drop-to-absent, uniformly); the residue-strip system is machine-registered and
self-verifying; the read-model layer achieves display/engine agreement by re-exporting the actual
constants; the digest is immutable-by-construction with deterministic tie-breaks; conservation
invariants (people, goods) are asserted per dispatch, not hoped. The test suite is the strongest
surveyed at this scale from a solo builder — a layered enforcement spine (goldens, ratchets,
anti-vacuity guards, mutation sweeps, honest paid-flow e2e), and the June remediation program's
fixes are *verifiably in the code*. The backend is a hardened, race-safe money machine with
complete RLS (51/51 tables census-verified by the survey).

The defect classes that survive this discipline are specific:

**(a) Lifecycle ghosts in the youngest code** — the owner's most-bitten class, alive at the exact
seams with the least soak time. M10b's `lastLivingAdvanceAt` cursor is stamped after persist and
never re-persisted (reload re-simulates lived weeks — phantom double-advance);
`revertToSnapshot` restores the settlement but ghosts `systemState`/`campaignState`;
user-canon-preservation across regeneration is promised in three places and enforced by none
(section-regens wipe `_userEdits`/`_authored`/pinned; `ASSIGN_NPC_TO_ROLE` rebuilds a rich NPC
through a 13-field `createNpc` and strips the sheet); a party-`REMOVED_THREAT` resurrects on
regeneration; DM actions during the parked-pause window and during multi-tick advances are
silently clobbered.

**(b) Vocabulary-seam mismatches** — the UI writes one vocabulary, the engine reads another, and
user intent silently vanishes: manual resource selections dropped two independent ways; category
toggles dead for random/custom types; `generatePower`'s adversarial gate checks enum values no UI
produces; fuzzy data joins (services token-overlap, terrain substring, chain prefix) yield absurd
menus and 16 dead terrain modifiers; `MapOverlay`'s prop contract breaks drag-drop silently;
`shareMap()` sends 4 of 12 RPC params. The cure is invented in-repo (id-first matching in
computeActiveChains; contract tests) — it needs extension, not invention.

**(c) Year-two performance blind spot.** First-paint (minute one) is constitutionally ratcheted;
tick cost over campaign age (year two of exactly the campaigns the product sells) has no gate:
`queuedImpacts` grows unboundedly and is re-normalized ~12×/tick; `ensureWorldState` deep-clones
the frozen 47–400KB digest ~11×/tick, which *also* churns identity and silently defeats every
distanceRead WeakMap memo (routes re-Dijkstra'd every tick against the design's own law); M10b
catch-up runs 26 sequential full store advances with 26 sync persists on campaign open. All have
clean constitution-compatible fixes (freeze+share, prune, orchestrator reuse).

**(d) Gate self-honesty holes** — the suite's own standard, unmet in four places: the claimed
VERIFY_DIST anti-vacuity hard-fail is implemented by nothing; the deity/spatial goldens thread a
stale regionalGraph every tick (one hash component inert — a golden that can't see); eight pglite
money suites are silently skippable; the known load-flake sits in the full gate undoctored.

## 3. AS SIMULATION SUBSTANCE (the cohesion/counterparts question)

The owner asked whether mechanics have their natural counterparts and whether the logic coheres.
The survey's answer, mechanism by mechanism:

**Where the loop is genuinely closed (and rare in the genre):** religion — conversion has gradual
shares, latent suppressed faiths, heresy stain, legitimacy lag, organic contest, and a
secularization→crisis→revival cycle (a complete two-way arc); food's granary rhythm has a proved
fixed point; trade flips carry cooldown+hysteresis+loser-demotion; corruption has onset AND
self-cleaning exposure; the stressor family (catalog→gates→counterforces→synergies→echoes→
aftermath) is the most coherent escalation/resolution symmetry in the engine; wars *do* end
endogenously (withdrawal, siege max-age, exhaustion homeostasis, occupation collapse).

**Where the counterpart is narrated but not executed — the flagship defect class:**
`sue_for_peace` changes labels and winds down stressor twins while the suitor's own army keeps
besieging (and can conquer) the party it made peace with; the emergency recall order re-fires
forever and no army ever comes home; approved faction proposals (government_change, institution
capture, power shift) apply as ledger cosmetics; pacific mobilization reactions (negotiate,
seek_allies) are no-ops while martial ones bite — and because the strategy slot is exclusive,
an inert move actively *pacifies* its actor; M9a's non-war levers emit and do nothing; DM
peace-making events never reach the layer that wages war. The two war representations (stressor
twins vs physical ledger) are individually coherent but peace reaches only one of them.

**Where machinery is built and unplugged:** M11b calamity cannot fire (no preset, no UI, no
writer sets `disastersEnabled`); M11a plague's graded hazard reads have zero consumers (no
avoidance, no army contraction, no trade refusal — the quarantine dilemma cannot emerge); the
field-battle loser's retreat is dead code (hostile pairs re-fight every tick); the courier
umbilical accumulates staleness nothing reads; half the inter-deity stance model (aggression,
treaty durability) is consumed nowhere; earned pantheon tiers never feed conversion strength;
the PLAGUE canon event mints no world-pulse twin (invisible to M11a).

**Asymmetries that starve the upswing:** famine has no relief counterpart (food moves between
settlements only by sack or levy — never charity, purchase, or ally relief); the regional engine
propagates shocks but never recovery; depleted export anchors ratchet permanently (excluded even
from the quiet-recovery path built to end permanent ratchets); defenders never bank disposition
wins (every survived siege credits only the aggressor's loss); occupation places no constraint on
the occupied settlement's own war machine; deity-pact betrayal never dents the betrayed edge; the
strategic-rust axis (the fully-built, carefully-tuned "blundered first war" mechanic) can
essentially never fire because mobilized posture counts as siege experience.

**The stasis question, answered:** the core loop is deliberately homeostatic (mean-reversion every
tick, auto caps, hysteresis everywhere) — quiet worlds cool to baseline *by design*, and the drama
budget genuinely lives in the opt-in layers… which default off, and whose newest members are
unplugged. Stasis is not a tuning bug; it is the compound interest of dormancy-by-default plus
dead seams. The fix is wiring and preset honesty, not constants.

## 4. AS PRODUCT / EXPERIENCE

The 60-second thesis test **passes** on the static product: the salt-road landing page shows
frozen real engine output with seed provenance and a "Forge this exact town" replay through the
real store action — determinism as a live demo; the anon funnel (hero → instant dossier → proof
card → cap-as-unlock) directly answers the old assessment's three growth blockers; the dossier's
trust receipts (pipeline rail, roll explanations, causal contributors) make the moat legible.
Premium gating is disciplined and generous (size free, simulation premium).

The living world — the actual moat — is experienced almost entirely through the news feed. The
feed shows *events*; continuous *conditions* (embattlement levels, supply fragility, belief
divergence, plague fronts, moral drift) have no home. The Wave-A belief read-model ("the fog of
war made watchable", a checkpoint definition-of-done item) has zero UI consumers.
RegionWakeReplay — the built, tested, copy-registered anon teaser of the living world — is never
mounted. M10b's "world moves while you're away" fires only from one tab's effect (most open paths
show a stale world), runs as a silent fire-and-forget with swallowed failures and no
"while you were away" digest, and its first impression on a big old campaign is a multi-second
stall. The World-Laws dialog still tells a mapped realm that distance "arrives with the map
engine" — after it arrived. The PDF — the artifact the product calls its deliverable — contains
no rumors, no beliefs, no trade flow, no movers; the campaign-level PDF renders the pre-spatial
static world; PDF_PARITY_AUDIT.md still claims no gaps. And the storefront's tier facts have
drifted into three mutually contradictory claims (save cap 3/10/unlimited; PDF export pitched
premium while shipped free; founder 500 vs 30), which for a trust-first product is not copy
polish — it is the deal terms being wrong on a purchase CTA.

The map-as-legibility deferral is real but **partially unsound as scoped**: it parks the whole
legibility gap behind FP-2 as "eager UI", while the repo's own precedent (RumorsTab, M6d's
EconomicsTab section, newsVoice) proves lazy inspector/dossier surfaces are budget-free. Roughly
half the gap needs no budget decision at all.

## 5. HOW WELL THE CODE MEETS THE AMBITION

The ambition is "cohesive, complete, immersive — in code and in experience." Scored honestly:
**cohesive** — the built layers read each other to an unusual degree (tolls join route scoring,
beliefs gate dispatch EV, refusals spill to smuggling, misjudgment feeds moral drift feeds
ally-intel styling); the incoherences are enumerable seams, not systemic. **Complete** — the
engine is complete-in-depth for M1–M10 and incomplete-in-wiring at the tail (M11 consequence-free,
political execution hollow, counterpart asymmetries above). **Immersive** — at generation time,
yes, and empirically verified (the corrupt-guard/black-market/aligned-secrets chain fires); at
living-world time, the immersion exists in the engine and dies before the screen. The constitution
held: no engine wall-clock/Math.random found by any surveyor; aggregate-only mortality is
test-pinned; premium-never-touches-generation is enforced server-side; the party never feeds fit
math. The boundaries the owner drew are boundaries the code actually has.

## 6. ⚠️ OWNER-URGENT (not code fixes — decisions/actions only you can take)

1. **Production is 12 migrations behind the repo (applied-head 117 vs 129)** — the unapplied set
   includes the latent-pantheon/_regenSeed deity-and-seed leak strips (121/128/129), the
   double-charge fix (119), and the gallery allowlist projection (123). Until a deploy runs,
   constitution law 3 (free/anon never see live deity names) is **unenforced in prod** for the
   latent pantheon. `validate:migration-head` only warns. Recommend: deploy the migration chain
   (owner-gated) and make the gate fail-on-pending-privacy-migration.
2. **The free-tier PDF monetization fork — ✅ OWNER-RULED 2026-07-13 (in-session):** free tier
   pays $2.99 per dossier PDF; ONLY premium gets unlimited export. The shipped gate (free =
   unlimited export) is the WRONG side; the pricing-page copy was right. Fix program mandate:
   flip the export gate to entitlement-per-dossier for non-premium (ride the existing
   single-dossier ladder: BuyThisDossier / dossier_purchases / verify-single-dossier), premium
   unlimited, and align all six tier-fact surfaces to one derived facts module.
3. **Preset honesty**: `disastersEnabled` (+20B, fits budget per M11b's stop-and-report),
   `commodityFlowEnabled`, infoMode defaults — the drama is owner-gated dark. The fix program can
   wire seams and surfaces, but lighting the presets is a paid-surface/product call.
4. **CSP is Report-Only on both surfaces** (zero active XSS mitigation at launch).

## 7. THE FIX-PROGRAM SHAPE (Phase P preview; Phase V verdicts first)

- **W-EXEC — "the world obeys its own decisions":** sue-for-peace grips the physical war; recall
  executes; faction proposals apply for real; pacific reactions get payloads; levers act; retreat
  lives; rust fires. (Engine, mostly lazy chunks; golden impact assessed per-fix.)
- **W-PLUG — "plug in the built machinery":** plague consumers (hazard, contraction, refusal);
  calamity reachability (engine-side seams + the owner preset call); PLAGUE event twin; courier
  umbilical read; belief/stance dead halves; deployment-to-removed-settlement lifecycle.
- **W-LIFE — "writes survive every path":** the M10b cursor persist; revertToSnapshot re-derive;
  user-canon preservation delivered for real (regen + role-assign + section-regen); REMOVED_THREAT
  suppression; pause/advance mutation guards; identity-residue chokepoint; persist version/migrate.
- **W-SEAM — "user intent never silently drops":** manual resources; category toggles; power
  vocabulary; id-first joins (services/terrain/chains); MapOverlay; shareMap params.
- **W-SURF — "the engine reaches the eye":** belief UI; pestilence read-model; mover sections in
  the Realm Inspector (lazy); catch-up digest + trigger widening + orchestrator routing;
  World-Laws dialog truth; PDF living-world chapters on the campaign_state variant (whitelist
  seam); tier-facts module; RegionWakeReplay mount.
- **W-PERF — "year two feels like day one":** freeze+share conditional ledgers; queuedImpacts
  pruning; digest identity stability (restore the memos); catch-up through the interval
  orchestrator; rollExplanations cap; a tick-cost trend gate.
- **W-GATE — "the gate keeps its own promises":** VERIFY_DIST anti-vacuity; live regionalGraph
  goldens (owner-signed regen); pglite existence asserts; metronome-class lint; config-seam
  contract test; stress-type registration manifest.

## 8. RE-DISPATCH QUEUE — ✅ COMPLETE (2026-07-13 evening)

All 8 landed (see §1.1 delta + the Round-2 register at the bottom). As predicted: refinement, not
reversal — grades and themes held; the new material is the entity-ref half-merge, the
dramatic_campaign zero-drama fact, the display-register token leaks, and the doc-drift census.
Doc-truth findings (ledger rows, stale budget lines, ARCHITECTURE/CONTRIBUTING staleness,
double-allocated headroom) are manager-verified directly rather than sent to Opus; code findings
from round 2 get the same two-lens/one-lens Opus verification as round 1.

---

# THE FINDINGS REGISTER (208 findings, by slice, severity-sorted; verdicts pending Phase V)

### Slice: worldpulse-core (grade A-)

**[worldpulse-core-1] HIGH / probable — Parked-pause window has no mutation guard: proposal applies/dismissals and party impacts made while an interval is paused are silently clobbered by resume**
- Where: `src/store/campaignWorldPulseSlice.js:540` | Category: lifecycle
- Evidence: applyWorldPulseProposal guards only `if (get().isAdvanceInFlight(campaignId)) return null;` (line 540), same for dismissWorldPulseProposal (line 609) and the party-impact action — none check getPausedAdvance. runResolveIntervalMajors then replays from the cursor's preSnapshot and wholesale-commits: `persistUpdates = applyWorldPulseResultToState(state, c, result, now)` (campaignAdvanceSession.js:393).
- Why: The pause exists precisely so the DM can read the minors-commit and interact; WorldPulsePanel.jsx has no paused gating (grep: zero 'paused' matches), so live Apply/Dismiss buttons and party impacts mutate worldState during the parked window, and resume recomputes the segment from pre-tick inputs and overwrites it — the DM's actions vanish with no trace. This is exactly the owner's most-bitten bug class (a write that survives one path and ghosts another).
- Fix shape: Either extend the advanceInFlight-style guard: proposal apply/dismiss + party impact + settlement edits return a typed { ok:false, reason:'advance_paused' } while getPausedAdvance(campaignId) is set (mirroring the fresh-advance guard at campaignWorldPulseSlice.js:339), or route mid-pause party impacts through the existing drain-queue so they replay after resume. Add a mutation-mid-pause store test beside advancePauseResume.test.js.
- Verdict: _pending Opus verification_

**[worldpulse-core-2] HIGH / probable — Party remove_npc writes a `removed:true` npcState flag that nothing in the domain reads — the removed NPC keeps its roster slot, faction seat, and NPC-agency eligibility**
- Where: `src/domain/worldPulse/partyImpact.js:331` | Category: sim-logic-gap
- Evidence: npcPatch: { loyalty: 0, momentum: 0, leverage: 0, removed: true, lastActedTick: tick, lastAction: 'party_removed' } — repo-wide grep shows `removed: true` is written only here and read nowhere; applyNpcPatch (npcAgency.js:1121-1161) merges it as an opaque field; the settlement's npcs[] roster entry is never removed or annotated.
- Why: The kind's contract is 'The party removed a key NPC (killed, exiled, captured)' (partyImpactKinds.js:33). After the DM declares the NPC dead, the dossier still lists them, seatNpcsIntoFactions can still seat them, and evaluateNpcRules can still emit 'X may protect/undermine…' headlines for a corpse — a direct immersion break on a DM-canon action.
- Fix shape: Make removal real at the roster: mark the settlement NPC (e.g. ousted:true or a removed marker the existing ouster/exposure machinery already respects — replaceOustedNpcs/pruneNpcStates then handle succession and state pruning for free), or have the sim layers read npcState.removed as a hard exclusion. Route it through the same ouster path the corruption exposure uses so succession NPCs seed naturally.
- Verdict: _pending Opus verification_

**[worldpulse-core-3] MEDIUM / probable — ACTOR_MAJOR_HOLD_WEEKS expiry counts world-ticks, so season/year advances and the 26-week catch-up expire actor-major proposals before the DM can ever see them**
- Where: `src/domain/worldPulse/actorMajorApproval.js:122` | Category: sim-logic-gap
- Evidence: `nowTick - Number(p.tick) >= ACTOR_MAJOR_HOLD_WEEKS` with ACTOR_MAJOR_HOLD_WEEKS = 6, run unconditionally every kernel tick (pulseKernel.js:257) — while a one_season advance is 13 synchronous ticks and one_year is 52 (advanceInterval runs them without returning control).
- Why: Under dm_only/recommendations (where every strategy_deploy/coup routes to proposal) or routine+routineMajorApproval with autoResolve ON, a war declaration proposed at tick t of a long advance is expired-to-declined at t+6, inside the same advance — the DM opens the panel afterwards and the decision opportunity is already gone, defeating the approval queue's whole purpose. The hold constant is documented as DM-attention time ('a DM who steps away for a session still finds the declaration waiting') but is implemented as world-time.
- Fix shape: Expire on DM-visible time, not raw ticks: e.g. only expire proposals whose tick predates the current advance's start tick (thread intervalStartTick into expireStaleActorMajors), or clamp expiry to fire only on the first tick of an advance. Alternatively pause/queue semantics: under autoResolve ON, count held weeks only across advance boundaries.
- Verdict: _pending Opus verification_

**[worldpulse-core-4] MEDIUM / probable / KNOWN-DEFERRED — mergeStressorUpsert's birth proxy (prior.createdAt === now) conflates every tick of a multi-tick advance, silently switching cross-tick re-upserts to ratchet-only merge semantics**
- Where: `src/domain/worldPulse/applyWorldPulse.js:439` | Category: correctness
- Evidence: `if (!prior || (prior.createdAt !== now && !forceCommutative)) return base;` — advanceInterval threads ONE pinned `now` across all N ticks (advanceInterval.js:249: 'the multi-tick path threads ONE pinned now across every synchronous tick'), so a stressor born at interval-tick 3 still satisfies createdAt === now when tick 9 re-upserts it, taking the commutative max-severity/union branch meant for same-apply-pass collisions.
- Why: Within any one advance, a stressor's severity and affectedSettlementIds can only ratchet up via re-upsert (max/union), while the same world advanced week-by-week (distinct now per click) gets legacy replace semantics — same seed, different stressor evolution depending on click granularity. The equivalence pins can't see it because they thread the same now on both sides. The deferred bornTick stamp (TEMPORAL_AUDIT.md:98,128; backlog Wave-5 piggyback) would fix the proxy, but the deferral note frames it as a temporal-honesty stamp, understating this live merge-semantics consequence.
- Fix shape: When bornTick lands (the already-planned owner-gated golden regen), switch the same-tick-collision test from createdAt equality to bornTick === tick; until then, thread the current tick (already a parameter) as the collision test alongside a birth-tick stamp on fresh records inside the same pass.
- Verdict: _pending Opus verification_

**[worldpulse-core-5] MEDIUM / probable — Approved siege_initiation re-mint guards the deployment seed but mints the war_front unconditionally — a blocked re-seed can leave a phantom front and a silently-dropped war**
- Where: `src/domain/worldPulse/applyWorldPulse.js:830` | Category: correctness
- Evidence: `if (pay.deployment && !(state.deployments && state.deployments[besieger])) { state = {...} }` — guarded; but immediately after, `if (pay.warFront) { ... graph = addRegionalChannels(graph, [frontChannel], { now }); }` mints the front with no matching guard and no receipt when the deployment seed was blocked.
- Why: If the besieger already holds a deployment when a held siege proposal is approved (a stale proposal approved after a mid-campaign rules flip back to auto-mint, or ordering edge cases across sessions), the approval mints a confirmed war_front channel with no army behind it — the next war tick reads a live siege that has no deployment — while the DM believes the approved war launched. Asymmetric guards on a two-part atomic mint are exactly the phantom-ledger class the conquest-dismiss fix closed.
- Fix shape: Make the re-mint atomic: mint the warFront only inside the same guard that seeds the deployment; when blocked, skip both and surface a receipt (a news entry or proposal note: 'the declaration lapsed — the army was already committed').
- Verdict: _pending Opus verification_

**[worldpulse-core-6] MEDIUM / probable — M11a reconcile filter drops the aspatial disease-spread candidate without considering political-autonomy forcing modes — the spatial front replaces a DM proposal with an unreviewed mint**
- Where: `src/domain/worldPulse/candidateEvents.js:272` | Category: sim-logic-gap
- Evidence: `candidates.push(...(epidemicTravelActive ? stressorCandidates.filter(c => c?.candidateType !== 'stressor_spread_disease_outbreak' || !frontCarriesDiseaseTo(...)) : stressorCandidates));` — the filter keys only on the spatial marker; under dm_only/recommendations the dropped spread candidate would have routed to 'proposal' via the choke point below (line 329), while the pestilence kernel materializes the same disease_outbreak stressor directly post-apply, never passing through authorityFor.
- Why: The §11 autonomy contract ('dm_only: every action awaits your word') is honored by the aspatial plague spread but bypassed by its spatial replacement: canonizing a map silently upgrades plague travel from DM-gated to autonomous. Defensible for nature-acting-autonomously, but it is an unstated behavioral change under the forcing modes, and the reconcile's own ONE-PLAGUE-TRUTH framing claims equivalence.
- Fix shape: Either document the ruling (nature is exempt from political autonomy — a one-line addition to the §11/infoMode notes and the M11a reconcile comment), or gate the front's stressor MATERIALIZATION through the proposal queue under dm_only/recommendations (the front still advances; only the stressor mint waits), mirroring the M9d withhold-then-re-mint pattern.
- Verdict: _pending Opus verification_

**[worldpulse-core-7] LOW / confirmed — moralFounding candidates are rolled and selectable but omitted from pulseRecord.candidateCount and the returned candidates array**
- Where: `src/domain/worldPulse/pulseKernel.js:1440` | Category: observability
- Evidence: stochasticCandidates includes `...moralFounding.candidates` (line 1126), but candidateCount (line 1440) sums only candidates/tierResource/instLifecycle/moralInst/structural/coup/war, and the returned `candidates` array (line 1904) likewise omits moralFounding.candidates.
- Why: A selected moral-founding outcome appears in selected/rollExplanations with no corresponding entry in the candidates surface, so the chronicle/audit view under-counts and any UI that cross-references selected→candidates dangles for that lane.
- Fix shape: Add moralFounding.candidates.length to candidateCount and spread it into the returned candidates array (two one-line edits; byte-visible only in pulseRecord fields, so check no golden pins candidateCount for a moral-founding-active fixture).
- Verdict: _pending Opus verification_

**[worldpulse-core-8] LOW / confirmed — Ruleset-change receipt copy is stale for M10b: switching worldProgression to living/autonomous reads 'time now passes as you advance it'**
- Where: `src/domain/worldPulse/simulationProfile.js:276` | Category: ux
- Evidence: worldProgression: value => (value === 'frozen' ? 'time is now frozen' : 'time now passes as you advance it') — living/autonomous fall through to the dm_advanced phrasing, the exact opposite of what autonomous now means.
- Why: The receipt is the DM-facing record of the law change; on the brand-new M10b surface it asserts the old behavior, undermining the fiction-not-internals promise the receipts exist for.
- Fix shape: Add living/autonomous branches ('time now passes on its own; the realm catches up when you return' / '…and the realm resolves its own affairs'). Lazy-chunk module, zero first-paint cost.
- Verdict: _pending Opus verification_

**[worldpulse-core-9] LOW / confirmed — normalizeSimulationRules profile comment still claims living/autonomous 'coerce to dm_advanced until built'**
- Where: `src/domain/worldPulse/simulationRules.js:467` | Category: docs-drift
- Evidence: 'worldProgression: only \'frozen\' is meaningful; \'living\'/\'autonomous\' are ACCEPTED but coerce to \'dm_advanced\' until built.' — but line 481 assigns worldProgressionOf(input), which since M10b returns living/autonomous verbatim (lines 327-330).
- Why: The normalizer is the constitutional canonicalization step; a successor reading this comment would conclude M10b's modes are still dormant and could re-introduce the coercion as a 'fix'.
- Fix shape: Update the comment block (and the sibling note in the PROFILE_COERCION_LAWS 'progression_unrecognized' law already has the correct M10b wording to copy from).
- Verdict: _pending Opus verification_

**[worldpulse-core-10] LOW / confirmed — Party ease_stressor/worsen_stressor leave no chronicle entry, violating the module's own audit-trail contract**
- Where: `src/domain/worldPulse/partyImpact.js:174` | Category: immersion
- Evidence: case 'ease_stressor': case 'worsen_stressor': { ... nextState = { ...state, stressors }; break; } — no outcome is pushed, so applyWorldPulseOutcomes emits no news; the module header promises 'Every effect is tagged party-sourced and carries the DM's note as a reason, so the audit trail (Wizard News) distinguishes…' (lines 21-23).
- Why: The table blunts a siege and the chronicle says nothing; a later severity change reads as organic world drift instead of the party's deed — the exact ambiguity the partySourced tagging was built to prevent.
- Fix shape: Push a low-severity narrative outcome (the name_attacker case at line 156 is the exact template) carrying the before/after severity and the DM's note.
- Verdict: _pending Opus verification_

**[worldpulse-core-11] LOW / confirmed — Nit batch: duplicated stablePart without the length cap; fork-only convention on the shared master rng is unenforced**
- Where: `src/domain/worldPulse/candidateEvents.js:13` | Category: code-hygiene
- Evidence: candidateEvents.js:13 re-implements stablePart locally without stablePart.js's `.slice(0, 80)` cap (id-length drift between minters); pulseKernel passes the raw master rng into advanceReligionStates/evaluateTierResourceDynamics/advanceSettlementSupply/advanceRumorLedgers/dispatchMigrations (lines 560, 1021, 1043, 1618, 1786) relying on an unenforced fork-only convention — the documented 'war-layer' shared-label invariant (793-801) shows how fragile a direct draw would be.
- Why: Both are latent-hazard hygiene: a very long settlement name yields divergent candidate ids between the two slug implementations, and one future `rng.random()` call inside a subsystem handed the master would couple draw order across layers with no test tripping.
- Fix shape: Import the stablePart leaf in candidateEvents; add a structural-prevention source-scan test asserting modules receiving the kernel master rng only call .fork() on it (grep-shaped, like the residue registry test).
- Verdict: _pending Opus verification_


### Slice: domain-readmodels (grade A-)

**[domain-readmodels-1] MEDIUM / confirmed — chronicleTimeline folds powerTransfer.losers (display NAMES) into affectedSettlementIds — the exact poisoning its public sibling fixed and documented**
- Where: `src/domain/display/chronicleTimeline.js:108` | Category: correctness
- Evidence: chronicleTimeline.js:108-109 `const losers = outcome?.powerTransfer?.losers; if (Array.isArray(losers)) for (const l of losers) ids.add(String(l));` — but warDeployment.js:1450 mints `losers = besiegers...map(id => settlementNameFor(id))` (names). worldSnapshotPublic.js:417-421 documents the fix on its own copy: "those entries are display NAMES, not save ids, so folding them in poisoned affectedSettlementIds". Probe: chronicleTimeline({pulseHistory:[...powerTransfer:{losers:['Greymarch','Larkfen']}]}) returns affectedSettlementIds ["Greymarch","Larkfen","save-uuid-1"].
- Why: The Realm Chronicle scrollback's click-to-highlight receives names as settlement ids for every conquest/coup outcome — highlights no-op or mismatch, and the two chronicle projections (DM scrollback vs public snapshot) disagree on which settlements an event touched.
- Fix shape: Delete the losers fold from collectSettlementIds (chronicleTimeline.js:107-109), matching worldSnapshotPublic.collectAffectedIds (targetSaveId + populationDeltas keys only); add a pin mirroring the public sibling's.
- Verdict: _pending Opus verification_

**[domain-readmodels-2] MEDIUM / confirmed — publicSafe PRIVATE_KEY_RE bare `note` still strips public economics-attribution fields from every gallery/anon dossier — the known half of a half-landed fix**
- Where: `src/domain/display/publicSafe.js:78` | Category: fail-closed-content-loss
- Evidence: publicSafe.js:78 regex still contains bare `note` (only `\bdm|\bgm` was boundary-fixed). Probe: toPublicSafe drops economicViability.metrics.foodBalance.magicFoodNote while keeping magicFoodOffset. REVIEW_FINDINGS.md:598 fix note: "Also tighten `note`... otherwise the fix leaves the economics notes still stripped" + "add regression tests asserting quarters keep landmarks" — neither landed (publicSafe.test.js has no landmarks/magicNote pin); all server migrations (latest 128) mirror bare `note`.
- Why: Fail-closed so no leak, but every public/gallery/anon dossier silently loses the food-deficit attribution (magicFoodNote) and the chain notes (magicNote/upstreamNote/storageNote where stored) — the explanation layer that makes the economics read coherent; the prior review explicitly instructed this narrowing and it is in no deferral ledger. deriveBlockadeRelief already dodges the trap by naming its field `display` (dossierViewModel.js:258), proving the hazard is known.
- Fix shape: Narrow `note` to the genuinely-private keys (dossierNotes|dmNotes|narrativeNotes|\bnotes?\b|tabNotes) in PRIVATE_KEY_RE + a new CREATE OR REPLACE migration for _gallery_sanitize_public_json (Postgres \y boundaries), with regression pins for landmarks + magicFoodNote surviving and dmNotes still stripped — the denylist-only-grows rule is satisfied since the private keys stay covered.
- Verdict: _pending Opus verification_

**[domain-readmodels-3] MEDIUM / confirmed — War & Resolve leadership figures exclude 'pillar' NPCs — the Lord Mayor/High Priestess/Kingpin never appear in the leadership read**
- Where: `src/domain/display/warResolve.js:193` | Category: sim-display-incoherence
- Evidence: warResolve.js:193 `npcs.filter((n) => n?.importance === 'key' || n?.importance === 'notable')` — but factionRoles.js:30 defines the vocabulary as "'pillar' for solo role-holders, 'key' for senior staff" and mints pillar for Lord Mayor/High Priestess/Kingpin/Archmagister. Probe: a settlement with a pillar Lord Mayor + key Lieutenant yields figures=[{name:'Lt Bob',role:'Lieutenant'}] only.
- Why: The docstring says figures are "the figures whose temperament colours the resolve" — the surface shows the lieutenant and omits the ruler, exactly backwards for a war-morale read a DM narrates from; also excludes every plain npcGenerator NPC (no importance stamp), so many settlements show no figures at all.
- Fix shape: Include 'pillar' first in the filter (pillar > key > notable ordering before slice(0,3)), with a fallback to power/influence ranking (the tonightAtTheTable pattern) when no importance-stamped NPC exists.
- Verdict: _pending Opus verification_

**[domain-readmodels-4] MEDIUM / probable — M11a pestilence is the only mover with no display read-model sibling — the traveling plague is invisible to the DM as a spatial phenomenon**
- Where: `src/domain/spatial/pestilence.js:1` | Category: product-gap
- Evidence: grep of src/domain/display/ for pestilence/plague hits only threatAssessment.js (static monsterThreat prose). Every other mover has its selector sibling: rumors→settlementRumors, beliefs→settlementBeliefs, trade flow→tradeFlowEconomics, occupation→occupationStatus, armies→armyStrength, war→warStatus. The M11a spec (playbook §850-889) and the round-21 map-as-legibility item ("fronts/embattlement/trade-flow") name no pestilence legibility surface.
- Why: The playbook sells the quarantine dilemma, the care counterforce, and army contraction as M11a's texture — none of it is DM-readable except the generic materialized stressor at each already-hit settlement; the front's approach (the drama) has no read. Breaks the slice's own one-mover-one-read-model contract and undercuts the living-world legibility thesis.
- Fix shape: A settlementPestilence.js selector in the established pattern (getSpatialLedger(worldState,'pestilence…'), includeGroundTruth seam if belief-vs-truth applies, banded fiction voice — 'plague burns in X, three weeks upriver', care-counterforce phrasing, hasPestilence panel gate, dormant⇒[]), lazy-only so budget-free.
- Verdict: _pending Opus verification_

**[domain-readmodels-5] LOW / confirmed — warStatus.js selectors lack the includeCovert seam — four consumers (incl. a 'PLAYER-SAFE' PDF path) would leak a covert siege the day one can mint**
- Where: `src/domain/display/warStatus.js:260` | Category: latent-visibility-gap
- Evidence: settlementWarStatus (warStatus.js:260) consumes liveSieges with no visibility filter and no includeCovert param; pdf/lib/liveWorld.js:27 claims "PLAYER-SAFE (includeCovert defaults false...)" yet calls it unfiltered (liveWorld.js:124); ShareToGallery.jsx:156 derives the public facetAtWar from it. Today war_front mints default visibility 'public' (region/graph.js:207 — DEFAULT_GM_CHANNEL_TYPES excludes war_front) so no live leak; realmArcSummary.js:120 and worldSnapshotPublic.js:220 DO filter, proving the convention exists but is not default-closed here.
- Why: Constitution law 3 names the includeCovert selector convention as THE reveal seam; warStatus is the one read-model family that trusts callers instead of failing closed, and the moment a covert front/deployment ships (M9 political lane, covert mobilization marching) it leaks simultaneously through WarFaithTab, SessionMode, the dossier PDF, and the gallery facet.
- Fix shape: Add includeCovert=false defaults to liveSieges/settlementWarStatus/activeDeployments that drop non-public fronts (and covert-posture deployments) unless opted in; DM surfaces pass true explicitly; extend visibilityAudit.js with a hidden-front fixture.
- Verdict: _pending Opus verification_

**[domain-readmodels-6] LOW / confirmed — Player rumor fiction hardcodes carrier:'trade' — army- and criminal-carried news reads as 'Merchants bring word', ignoring the framing the engine persists**
- Where: `src/domain/display/settlementRumors.js:199` | Category: immersion
- Evidence: projectPlayerRumor returns `carrier: 'trade'` (settlementRumors.js:199) and renderFiction's only non-firsthand voices are "Merchants bring word..."/"Travellers speak..." (lines 134-138); rumorNetwork.js:73/78 define RUMOR_CARRIER_ARMY/'criminal' lanes stamping per-carrier framing tags (line 698) which only the DM truth block surfaces (line 265).
- Why: The engine deliberately differentiates who carried the word (a marching army, a smuggle run) and the player fiction erases it — a soldiers'-tale reading as merchant gossip is exactly the kind of texture the 'this one simulates' thesis is sold on.
- Fix shape: Derive carrier from record.framing (army⇒'soldiers returning from the front tell of...', criminal⇒'quiet men who do not say which road they came by...'), keeping the whitelist enumeration — framing is already non-secret in banded form.
- Verdict: _pending Opus verification_

**[domain-readmodels-7] LOW / confirmed — worldSnapshotPublic doc drift: HARD-DENY 'never reads them' vs publicChronicle reading worldState.proposals; worldClock promises an 'era' field that is never serialized**
- Where: `src/domain/display/worldSnapshotPublic.js:47` | Category: docs-drift
- Evidence: Line 47: "the allowlist construction below already omits them by never reading them" while publicChronicle reads `worldState?.proposals` at line 355 (correctly — to recover DM-APPROVED outcome ids; nothing is serialized). Lines 121/521 promise "tick + calendar/era/season" but publicWorldClock emits only elapsedMonths/month/year/season.
- Why: This file is the SECURITY-CRITICAL projection; its header is the contract auditors and the SQL mirror are checked against — a claim that is already false in a benign way invites the next benign-looking read to be an actual serialization.
- Fix shape: Amend the HARD-DENY comment ('never serialized; proposals are read only to reconcile approved outcome ids') and either serialize era or drop it from both docstrings.
- Verdict: _pending Opus verification_

**[domain-readmodels-8] LOW / confirmed — armyStrength band-comment contradictions (MAX-the-pains vs min-of-health; docstring quotes a phrase no band produces)**
- Where: `src/domain/display/armyStrength.js:93` | Category: docs-drift
- Evidence: Line 93: "We MAX the two pains so the sharpest one sets the phrase" vs line 107-112 comment+code "Take the MIN over supply + morale (+food)" — equivalent semantics, contradictory prose; module header line 11 quotes "battered — about two-fifths of its strength remains" while REMAINING_BANDS' phrase is "battered, roughly half its strength spent".
- Why: Pure maintenance friction in an otherwise exemplary banded-voice module; the next tuner reads two opposite instructions.
- Fix shape: Align both comments with the min-of-health code and quote a real band phrase in the header.
- Verdict: _pending Opus verification_

**[domain-readmodels-9] LOW / confirmed — Nit batch: prose/polish one-liners across the slice**
- Where: `src/domain/display/threatAssessment.js:64` | Category: polish
- Evidence: threatAssessment.js:64 assessment sentence starts lowercase ('embattled region with no organized defense...') unlike every sibling branch; threatAssessment rows all carry dead `icon: ''` placeholders (95-193); compendium/catalogData.js:34 'Entreport economy' should be 'Entrepôt'; settlementRumors.js:176-178 whitelist doc claims whereId is 'truncated by completeness' but whereId always projects (only subjectIds truncate); settlementRumors renderFiction:148 only names parties when >1 (a single named party is never spoken).
- Why: Individually trivial; batched so the fix wave can sweep them in one lazy-display commit (all byte-inert to goldens).
- Fix shape: One display-polish commit: capitalize the sentence, drop dead icon fields or fill them, fix the Entrepôt typo, correct the whitelist comment, and decide the single-party naming rule.
- Verdict: _pending Opus verification_


### Slice: worldpulse-religion-trade (grade A-)

**[worldpulse-religion-trade-1] HIGH / confirmed — Axis-retirement miss: deityRulerFit reads the retired stored temperamentAxis, splitting temper semantics across the religion engine**
- Where: `src/domain/worldPulse/religionLegitimacy.js:245` | Category: sim-logic-consistency
- Evidence: religionLegitimacy.js:245 `const dT = TEMPER_POS[deity?.temperamentAxis] ?? 0.5;` — while deityAxes.js:20-23 declares the contract: "deityTemper ... ALWAYS derives from the two alignment axes and NEVER consults a stored temperamentAxis ... it is inert to every engine temper read." Grep confirms this is the only remaining raw engine read.
- Why: deityRulerFit feeds rulerEndorsement (W_RULER=0.42, the DOMINANT legitimacy-target weight), deityGrowthFavor (conversion speed), and chronicleMomentum — the entire ruler-fit lane. A 4-axis deity authored evil+chaotic derives 'warlike' in the niche key, mandate, occupation pull, and disposition lanes, but reads its stale/absent stored field (0.5 neutral) in the legitimacy/growth lane. The same god has two temperaments inside one engine, violating the W-F5 single-projection doctrine the rest of the slice scrupulously honors.
- Fix shape: Replace the raw read with the derivation: `TEMPER_POS[deityTemper(deity) ?? 'neutral']` (deityTemper returns 'warlike'|'peacelike'|'neutral'; note TEMPER_POS keys 'peaceful' — align the key or map 'peacelike'→0). This is a same-seed-affecting fix wherever stored temper disagrees with derived temper, so it needs the golden battery + an explicit behavior-shift note; if goldens shift, that is the legitimate cause.
- Verdict: _pending Opus verification_

**[worldpulse-religion-trade-2] HIGH / probable — Three standing-state outcome sources re-emit condition-bearing news every tick, bypassing both the roll budget and the metronome suppression**
- Where: `src/domain/worldPulse/religiousContest.js:796` | Category: cadence-immersion
- Evidence: religiousContest.js:791-814 emits footholdOutcome per tick with no cooldown (targetedFootholds is deterministic over static NPC traits); deityStanceLane.js pact branch (306-323) has no cooldown while the betrayal branch has BETRAYAL_COOLDOWN_TICKS=8; tradeWar.js:425-436 pushes vassal_trade_coercion unconditionally inside the forced branch every tick the overlord holds the prize.
- Why: All three carry a `condition` (or stressor), so applyWorldPulse.isDriftOnlyOutcome (applyWorldPulse.js:157-170) exempts them from metronome suppression, and as deterministic outcomes they bypass rollCandidates' budgets entirely. A settlement with a misaligned minister + persistent rival prints "X finds an ear in Y" EVERY tick; good-good unallied pairs re-announce the same faith pact ~every 2 ticks (effCoop ≥0.55, cap 3/tick); a standing vassal trade compulsion re-stamps a severity-0.5 coercion condition per commodity per tick. This is exactly the E4-2a metronome class (overlord-weakness flood) the owner already fixed once, and it compounds the known legibility-at-density/240-cap feed problem.
- Fix shape: Add per-arc cooldowns/latches mirroring the existing idioms: hasRecentIncident-style cooldown or a once-per-state-change latch (emit foothold only on FIRST detection per (cid,rival,npc), pact only once per pair until broken, vassal_trade_coercion only when result.changed or on an N-tick renewal cadence). Structural prevention: extend isDriftOnlyOutcome or add a standing-state marker so recurring condition refreshes are metronome-eligible.
- Verdict: _pending Opus verification_

**[worldpulse-religion-trade-3] MEDIUM / confirmed — Half the inter-deity stance model is dead: stanceOf's aggression and treatyDurability are consumed nowhere**
- Where: `src/domain/worldPulse/deityStance.js:164` | Category: dead-mechanic
- Evidence: stanceOf returns { aggression, cooperation, betrayalHazard, treatyDurability } (deityStance.js:164); repo grep shows the only engine consumers are betrayalHazard (deityStanceLane.js:78) and cooperation (deityStanceLane.js:308). No file reads .aggression or treatyDurability outside deityStance.js itself.
- Why: The owner's binding stance heuristic ("good's ONE strong consolidated aggression vs evil", "treaty durability keys on MIN lawfulness — LE×LE > LE×CE ≥ CE×CE") is carefully implemented and tuned, then never fires: no inter-deity aggression ever influences war/hostility candidates, and pact durability affects nothing (pacts don't exist as decaying state — see the pact finding). The elaborately-documented asymmetry ("coalitions of light vs a fractious darkness fall out of the numbers") cannot emerge because the numbers are never read.
- Fix shape: Either wire aggression into the deity-bearing pair lane (e.g. tilt hostile/cold_war escalation candidates or the war layer's deploy gate by stanceOf(a,b).aggression, the same signed-factor seam disposition uses) and treatyDurability into pact/alliance decay (relationship relax rate or pactStrength drift), or excise the two fields and record the deferral in the ledger so the model matches its consumption.
- Verdict: _pending Opus verification_

**[worldpulse-religion-trade-4] MEDIUM / confirmed — Earned pantheon tier never feeds back into conversion strength — the seat-won 'major god' is display-only**
- Where: `src/domain/worldPulse/pantheon.js:401` | Category: sim-logic-silo
- Evidence: advancePantheon derives tiers with dwell + MAX_TIER_CHANGES_PER_TICK caps; kernel comment: "The tier CHANGES feed the realm-arc synthesis below (Ascendancy / Twilight)" (pulseKernel.js ~1244). deityRankStrength reads only the static snapshot field: `DEITY_RANK_STRENGTH[d?.rankAxis] ?? DEITY_RANK_STRENGTH.minor` (cultImpositionApply.js:56); grep shows worldState.pantheon is consumed only by display/* modules.
- Why: A cult that wins 6 settlements is promoted to 'major' in the pantheon ledger and headlines an Ascendancy arc — but converts forever at cult strength 0.35, while a major god reduced to zero seats keeps 0.95. The success-breeds-success loop the tier machinery implies never closes, and the anti-cascade containment caps ("one cult cannot eat the map in a tick") guard a mechanically-inert output. Defensible if rankAxis means immutable cosmic rank, but then the hysteresis/cap engineering is spent on a cosmetic ledger — either way the two halves don't read each other.
- Fix shape: Bold-but-bounded: blend the earned tier into rank strength at the strength read (e.g. effective rank = max(rankAxis, pantheon tier) or a small additive seat-tier bonus ±0.1), gated on religion-active so dormant worlds stay byte-identical; the existing dwell+cap machinery already prevents runaway. Alternatively document the 'cosmic rank is immutable' ruling in the module header and ledger.
- Verdict: _pending Opus verification_

**[worldpulse-religion-trade-5] MEDIUM / probable — Disposition factor keys on targetSaveId, so victim-attributed adversarial candidates scale by the VICTIM's aggressiveness, not the aggressor's**
- Where: `src/domain/worldPulse/relationshipRuleHelpers.js:150` | Category: sim-logic
- Evidence: candidateBase: "The actor (the settlement driving this candidate) is the attributed save" → `const actorId = String(targetSaveId || settlements.from)` (relationshipRuleHelpers.js:148-154). hostile_raid sets targetSaveId: victimId with the aggressor only in metadata (relationshipRulesAdversarial.js:283-304); same shape for hostile_forced_tribute, cold_war_proxy_conflict, cold_war_supply_sanctions, trade_embargo_collapse.
- Why: computeDispositionFactorMap's contract is that a settlement's aggressiveness multiplier scales "the candidates it drives" (disposition.js:257-263). For raid/tribute/proxy/sanction/embargo candidates the attributed save is the victim (news attribution), so a pacifist victim damps its raider's raids and an aggressive settlement invites more raids against itself — the seam's documented actor semantics are inverted for exactly the adversarial family the disposition layer was built to modulate.
- Fix shape: Thread an explicit actorSaveId through candidateBase (default targetSaveId for back-compat) and set it to metadata.aggressorSaveId / extractorSaveId / imposerSaveId / supplierSaveId at the five call sites; byte-identical whenever the disposition ledger is empty (factor 1.0), so legacy goldens hold.
- Verdict: _pending Opus verification_

**[worldpulse-religion-trade-6] MEDIUM / probable — Famine/blockade has no relief counterpart: inter-settlement food transfer exists only as coercion (sack, vassal levy)**
- Where: `src/domain/worldPulse/foodStockpile.js:496` | Category: sim-logic-gap
- Evidence: computeSackFoodTransfer's gentler pair "models a voluntary levy (F2) drawing grain from a willing vassal" (foodStockpile.js:495-498) — grep shows its only consumers are foodStockpile + warDeployment (sack/levy). supplyKernel excludes food from all shipping: "FOOD is deliberately EXCLUDED ... foodStockpile remains the food-specific buffer" (supplyKernel.js:19-21); dispatchEV notes "(Ally relief = documented seam.)" but that engine never carries food.
- Why: tradeSalience explicitly models the food-insecure buyer's grain tie as the textbook high-salience case, and allies avoid war over it — yet when famine actually strikes, no ally, patron, or overlord can ever send grain: the only relief is the victim's own granary drawdown, and the only cross-settlement grain flows are hostile (sack loot, wartime levy). Drama has its drain but not its counterweight; a DM watching a famine sees neighbors with 8-month granaries do nothing, which reads as incoherent for allied/patron ties whose whole texture is mutual aid (allied_aid_buffer exists for military burden but not food).
- Fix shape: A relief lane reusing the conserved transfer: on famine/blockade of a settlement with an allied/patron/vassal tie to a surplus neighbor, emit a bounded relief outcome via computeSackFoodTransfer with voluntary fractions (donor loses months, victim gains capped by capacity), stamped with the existing relief_burden condition on the donor. Rides existing primitives; gated on warLayer/faith-free flags per dormancy law.
- Verdict: _pending Opus verification_

**[worldpulse-religion-trade-7] MEDIUM / probable — Deity-pact betrayal never touches the betrayed relationship edge — the 'broken pact' survives its own breaking**
- Where: `src/domain/worldPulse/deityStanceLane.js:117` | Category: sim-logic
- Evidence: betrayalOutcome carries stressor + condition + metadata but no relationshipKey/relationshipPatch (deityStanceLane.js:117-158); deityBearerPairs' `positive` derives from the still-allied edge each tick, so after the 8-tick cooldown the SAME intact pact is betrayal-eligible again ("a betrayal its patron's nature made only a matter of time").
- Why: A settlement whose faith "broke its pact" with an ally keeps the allied label, full pactStrength, and default trust — the betrayal is narrated but not enacted. The header documents the PACT (positive) half as deferred ("the positive relationship-WEIGHT coupling is the deferred half"), but the betrayal half's missing edge impact is not in that deferral: an allied pair can be serially betrayed every 8 ticks forever while remaining allies, which a DM would find incoherent (real betrayal should at minimum dent trust/pactStrength or propose a label change).
- Fix shape: Attach relationshipKey + a relationshipPatch (trust −, resentment +, pactStrength −) to betrayalOutcome — applyRelationshipPatch already handles exactly this shape — or emit a companion label-change proposal (allied → rival/cold_war) via the existing labelProposal machinery. Keep the stressor as-is.
- Verdict: _pending Opus verification_

**[worldpulse-religion-trade-8] MEDIUM / confirmed — Depleted primary-export resources are a permanent one-way ratchet: excluded even from the quiet-recovery path built to remove permanent ratchets**
- Where: `src/domain/worldPulse/tierResourceDynamics.js:393` | Category: one-way-ratchet
- Evidence: Recovery gate: `state === 'depleted' && ((perceivedPressureScore <= 0.32 && economicRole !== 'primary_export') || previousDrift?.direction === 'demotion')` (tierResourceDynamics.js:393). economicRole reads canonExports — the generation-frozen trade lists — which depletion never edits, so the role can never change.
- Why: E4-2b's quietRecovery was added precisely so "calm becomes gradual recovery, not permanent decay" (comment at :394-401), yet the resource most likely to matter — the settlement's export anchor — is carved out, and because primaryExports is frozen the carve-out is permanent short of a tier demotion. A prosperous exporting city that depletes its iron holds 'depleted' forever while still nominally exporting iron (the frozen export label also keeps feeding supplyCompleteness/trade contests), a coherence mismatch and a decline-attractor contributor.
- Fix shape: Let primary_export resources use the SLOW manual-recovery path under a deeper calm gate (e.g. perceivedPressure <= 0.2, the quietRecovery threshold, at the slow 0.02 probability) instead of a hard exclusion — export demand justifies slower, not never. Alternatively re-derive economicRole live from active chains so depletion actually vacates the export anchor.
- Verdict: _pending Opus verification_

**[worldpulse-religion-trade-9] LOW / confirmed — Founding catalog asymmetry: the moral system's flagship institution (slave market) is abolishable but can never be founded**
- Where: `src/domain/worldPulse/foundingCatalog.js:87` | Category: sim-logic-asymmetry
- Evidence: moralMartialLean.js:53 codes `[/slave\s*market|.../, { cruelty: 0.9, disorder: -0.4 }]` and the design examples repeat "CG abolishes the slave market"; FOUNDING_INSTITUTIONS' exploitative pole contains only Debtors' yard and Fighting pit (foundingCatalog.js:87-104).
- Why: A lawful-evil patron over a devout city can raise a fighting pit but never the ordered-exploitation institution the whole plane geometry was calibrated around — the abolition lane's marquee target is unreachable by the founding lane, so over a long campaign evil seats can only tear down or maintain generated cruelty, never institute it. Likely a deliberate content-sensitivity call, but it is documented nowhere (not in the catalog header's design notes nor any deferral ledger).
- Fix shape: Owner decision: either add the entry (the lean is already single-sourced and the display side-car pin would extend) or document the exclusion in foundingCatalog.js's header + the deferral ledger as a content-boundary ruling.
- Verdict: _pending Opus verification_

**[worldpulse-religion-trade-10] LOW / probable — Betrayal cooldown can silently miss: pulseHistory keeps only the first 24 selected outcomes per tick**
- Where: `src/domain/worldPulse/pulseKernel.js:1444` | Category: robustness
- Evidence: `selectedOutcomes: selectedForApply.slice(0, 24).map(compactOutcomeForHistory)` (pulseKernel.js:1444); betrayalCooldownPairs reads exclusively from pulseHistory selectedOutcomes (deityStanceLane.js:92-106).
- Why: On a busy everything-on tick (war + trade + occupation + religion outcomes all precede religiousOutcomes in the selectedForApply concatenation), a landed betrayal past index 24 never reaches history, so its 8-tick cooldown never arms and the same pair can be re-betrayed next tick. Bounded by MAX_BETRAYALS_PER_TICK=2 but the guard is supposed to be absolute ("guards are ABSOLUTE — never piety-amplified").
- Fix shape: Either prioritize cooldown-bearing outcomes into the compacted slice, raise/remove the slice for outcome families that feed read-back guards, or persist betrayal cooldowns in a tiny dedicated ledger (the tradeWarState lastFlipTick idiom) instead of mining compacted history.
- Verdict: _pending Opus verification_

**[worldpulse-religion-trade-11] LOW / speculative — DM-mirror authority branch can violently reverse a vetoed conversion: old patron snaps to ≥60 share**
- Where: `src/domain/worldPulse/religionState.js:215` | Category: lifecycle-edge
- Evidence: ensureReligionState treats ANY config-mirror/patronRef divergence as a DM re-assign: `if (s.patronRef !== ref) { ... const dominantShare = Math.max(60, others + 10); ... }` (religionState.js:215-224).
- Why: If a patron flip's conversion outcome is ever deferred/dismissed (CL-3 approval queue, deferred majors) while resolvePatronContest already moved state.patronRef, the next tick reads the stale config mirror as an authoritative DM re-assign and teleports the OLD patron to dominant share ≥60 — erasing the gradual-shares story rather than leaving the contest simmering. The branch is correct for real SET_PRIMARY_DEITY events; the collision is with the sim's own vetoed outputs.
- Fix shape: Distinguish DM writes from stale mirrors: stamp SET_PRIMARY_DEITY with an assignment marker (e.g. config.primaryDeityAssignedAt/eventId) and gate the dominant-share override on it; a mirror-only divergence should instead re-run selectPatron or leave state authoritative. Needs a pin across the dismiss-conversion path.
- Verdict: _pending Opus verification_

**[worldpulse-religion-trade-12] LOW / confirmed — Nit batch: cosmetic/dead-code residue**
- Where: `src/domain/worldPulse/piety.js:47` | Category: polish
- Evidence: piety.js:47 + :153 comments contain the Cyrillic word 'живой' ("a живой multi-faith pantheon"); pantheon.js:80 TIER_FOR_RANK exported but never imported; relationshipMemory.js:3-9 imports the state core via relationshipEvolution's re-export barrel rather than relationshipState.js directly (works, but contradicts the cycle-breaking leaf's stated purpose); institutionTolerance.js:215 `if (!contributors.length)` is unreachable (effective map covers every snapshot settlement, partners are byId-filtered).
- Why: Pure polish; the Cyrillic strings would look like corruption artifacts to a future byte-integrity sweep (F24-adjacent surprise), and dead exports blur the single-source discipline the slice otherwise keeps.
- Fix shape: One-line comment fix ('living'), drop or consume TIER_FOR_RANK, repoint relationshipMemory imports at relationshipState.js, delete the dead branch.
- Verdict: _pending Opus verification_


### Slice: spatial-engine (grade A-)

**[spatial-engine-1] HIGH / confirmed / KNOWN-DEFERRED — M11b calamity can never fire: disastersEnabled is set by no preset, no UI, no default — the whole mover is unreachable in the shipped product**
- Where: `src/domain/spatial/calamity.js:125` | Category: sim-logic-gap
- Evidence: calamityEnabled reads `rules.disastersEnabled === true`; repo-wide grep finds `disastersEnabled` ONLY in calamity.js, calamityKernel.js and a pulseKernel comment. simulationRules.js's full_simulation preset (lines 276-278) sets worldProgression/commodityFlowEnabled/allyIntelSharingEnabled but NOT disastersEnabled; no UI axis exposes it.
- Why: The last mover of the ladder — the flood-year, the emergent tail, 30 tests — is dead content for every real campaign. The spec (§M11b) says 'preset-gated (ON in dramatic/full-sim presets)'. The commit 62c81a0c records this as a deliberate STOP-AND-REPORT ('Left for the owner to flip one line... +20B fits'), but neither PHASE55_EXECUTION_PLAYBOOK.md nor PHASE55_ROUND21_BACKLOG_PLAN.md carries the parked decision — both still describe M11b as WIP/UNBUILT, so a successor will not find the one-line flip waiting on the owner.
- Fix shape: Owner decision queue item: flip `disastersEnabled: true` in the full_simulation (and/or dramatic) preset shape (+20B eager, measured to fit; knowingly enters the Phase-6 everything-on cert). Regardless of the flip, write the ledger row: playbook §0.0.3 M11b row + §0.6/owner-decision-queue entry for the flag, and correct the round-21 plan's 'M11b UNBUILT' lines.
- Verdict: _pending Opus verification_

**[spatial-engine-2] HIGH / confirmed / KNOWN-DEFERRED — M11a's graded plague reads have zero consumers: no mover avoids, contracts from, or re-routes around plague — the quarantine dilemma cannot emerge**
- Where: `src/domain/spatial/pestilence.js:326` | Category: sim-logic-gap
- Evidence: grep: `armyPlagueHazard`, `armyContraction`, `pestilenceLevel`, `pestilenceTemplePulse` have NO callers outside pestilence.js and tests. dispatchEV.js:41 admits '⚠️ M11a plugs PLAGUE into stressorDanger ... This module does NOT depend on M11a (unbuilt)'. stressorDanger (dispatchEV.js:169) has only siege+occupation terms.
- Why: The M11a spec's core coupling — 'plague level joins the mover hazard read as a GRADED SCALAR in route + engagement scoring', 'an army... rolls seeded contraction... becomes a VECTOR', 'movers re-route around plagued hubs → isolation → M2 supply risk', trade refusal — is entirely unwired. Plague currently materializes stressors and nothing else in the spatial engine reacts to it: no route re-score term, no dispatch-EV deterrent, no army effect, no caravan refusal. The soak criteria 'armies avoid + contract + carry' are unmet. The commit (82ad676b) claims 'Both logged in the parking-lot / deferral ledger', but grep of docs/*.md finds NO such row — the deferral exists only in the commit message and a code comment, violating the program's own deferral-ledger discipline.
- Fix shape: Wire the built primitives in a focused pass: (1) add a plague term to dispatchEV.stressorDanger (the seam is pre-built — 'a new max() argument'); (2) add pestilenceLevel to embattlement.scoreRoute or as a chooseRoute hazard term weighted by riskTolerance; (3) the fenced armyTransitKernel contraction+vector mutation as its own byte-gated wave (6 siege pins re-verified). Record the deferral rows in the playbook §0.6 NOW even if the wiring waits.
- Verdict: _pending Opus verification_

**[spatial-engine-3] HIGH / confirmed — M5 field-battle loser never retreats: retreatRoute/ARMY_ROLES.RETREAT are dead code, so the same hostile pair re-fights a fresh battle EVERY tick until one arrives**
- Where: `src/domain/worldPulse/armyTransitKernel.js:227` | Category: sim-logic-gap
- Evidence: The collision loop only writes strengths back: `records[id] = { ...records[id], strength: ns }` — role/path/destId never change. grep: `retreatRoute` has zero callers; ARMY_ROLES.RETREAT is never assigned. The kernel header (line 16-17) and fieldBattleNews ('falls back mauled to regroup') both claim the loser retreats.
- Why: detectCollisions re-fires for the same pair every tick while both are in transit (paths unchanged, battle fork key includes tick), so a multi-week crossing produces a battle-per-week grind: the loser is repeatedly mauled toward the clamp, then deterministically loses every subsequent tick — instead of the spec'd arc (one battle → mauled loser retreats home by the danger re-score → the winner marches on). The news receipt asserts a retreat that never happens — a false receipt, which the sim's receipts-mandatory culture treats as a defect. The pure primitive is built and even tested (armyTransitFieldCombat.test.js:219 tests retreatRoute directly) but never wired.
- Fix shape: On a battle resolution, re-plan the loser's record: role='retreat', destId=originId, path=retreatRoute(digest, worldState, currentRegion(loser), originId, alignment, season).path, fresh depart/arrival ticks; exclude retreat-role armies from hostilePairFor (or make a retreating army collision-immune) so the pair fights once per encounter, not once per tick. Pin with a two-army multi-tick test asserting exactly one battle then divergence.
- Verdict: _pending Opus verification_

**[spatial-engine-4] MEDIUM / confirmed — The courier umbilical is write-only state: beliefStaleness accumulates and persists but nothing ever reads it**
- Where: `src/domain/worldPulse/armyTransitKernel.js:204` | Category: sim-logic-gap
- Evidence: beliefStaleness is stepped and persisted every tick (lines 204-208); grep shows `staleAssessment` and `umbilicalFog` have zero callers repo-wide. The kernel's own comment concedes: 'the TRUE strengths resolve the battle — the mis-assessment is the DM-legible cause' — but no display/read-model surfaces it either.
- Why: The round-12 design ('an info-starved army mis-assesses enemy strength and its own siege; blinding couriers becomes a real tactic') has no mechanical OR legibility consequence — the fog is computed, stored in the persisted ledger, and discarded. It is pure ledger weight plus a misleading promise in two module headers.
- Fix shape: Either consume it (blend each army's read of the opposing strength via staleAssessment before resolveFieldBattle — keeping true physics for attrition but letting fog gate engagement/withdraw decisions, or at minimum stamp a 'fought blind' receipt on battles where fog > threshold) or delete the persisted field and its stepping until the consumer wave lands.
- Verdict: _pending Opus verification_

**[spatial-engine-5] MEDIUM / confirmed — Belief-map full-prune resets the fog of war to perfect ground truth (cold-start re-seeds confidence 1.0)**
- Where: `src/domain/worldPulse/beliefMap.js:946` | Category: sim-logic-gap
- Evidence: advanceBeliefMaps: `const priorPresent = !!prior && Object.keys(prior).length > 0; if (!priorPresent) { /* COLD-START: seed... groundTruthBelief(..., confidence: 1) */ }`. pulseKernel drops the beliefMaps sub-ledger entirely when next is null, so the next tick re-enters cold start.
- Why: If every belief decays below MIN_CONFIDENCE (0.03) in a long quiet stretch (~43 silent ticks at SILENCE_DECAY 0.92) the ledger drops, and the following tick re-seeds every observer's declared neighbourhood at ground truth with FULL confidence — the most information-starved world snaps to omniscience about the present. Silence should deepen fog, not reset it. Unlikely at normal event rates but reachable in small peaceful realms and in the everything-on soak's quiet phases.
- Fix shape: Distinguish 'never initialized' from 'decayed to empty' — e.g. cold-start only when the marker just activated (compare a persisted beliefsSeededAtVersion against spatialCanonVersion), or keep a one-key sentinel record so a pruned-empty ledger doesn't read as never-seeded.
- Verdict: _pending Opus verification_

**[spatial-engine-6] MEDIUM / confirmed — Calamity demote can mint a duplicate institution (same name/id as a ruined sibling) and keeps the greater's description/category on the demoted record**
- Where: `src/domain/worldPulse/calamityKernel.js:179` | Category: correctness
- Evidence: `alreadyStanding` checks only ACTIVE institutions (`String(i.status || 'active') === 'active'`); the demote branch writes `{ ...list[idx], name: plan.demotedTo, id: institution.${stablePart(plan.demotedTo)} }` — spreading the greater's description/tags/category onto the lesser's name and id.
- Why: If a same-named lesser exists in 'ruined'/'remnant' status (e.g. from a prior strike), demote creates a second institution with an identical name AND identical id — downstream name/id-indexed passes (institutionLifecycle's index-of-name found/build lanes, calamity's own findIndex-by-name) become ambiguous. Separately, a 'Wizard's tower' carrying the Mages' guild's description/tags is a dossier-visible incoherence.
- Fix shape: Have alreadyStanding consider any same-name row (any status) and fall through to collapse/destroy in that case — or re-raise the ruined lesser instead of renaming the greater. On demote, reset description to '' and re-derive category/tags from the catalog for the lesser name (the UPGRADE_CHAIN_PAIRS source has them).
- Verdict: _pending Opus verification_

**[spatial-engine-7] MEDIUM / confirmed — State-ledger drift: the M11b wave landed with no ledger row — both planning docs still assert M11b is WIP/unbuilt**
- Where: `docs/PHASE55_EXECUTION_PLAYBOOK.md:161` | Category: docs-drift
- Evidence: Commit 62c81a0c touches only src+tests (5 files, no docs). Playbook §0.0.3: 'M11b (calamity) is that stream's WIP'; §0.8: 'src/domain/spatial/calamity.js is that session's UNCOMMITTED WIP'; round-21 plan lines 24/74: 'M11 ... still UNBUILT', 'Ruins-as-artifacts — BLOCKED on M11b calamity (the last mover, UNBUILT)'.
- Why: The playbook's own law (§0.3-7: 'A wave is not done until its ledger row exists — this document is the successor's memory') is violated at the exact point where two parallel streams meet. A successor following the docs would re-dispatch or mis-sequence M11b, miss that ruins-as-artifacts is now unblocked, and never find the parked disastersEnabled owner decision.
- Fix shape: One doc commit: append the M11b row to §0.0.1/§0.0.3 (hash 62c81a0c, gates, the +20B preset-flip park), add the disastersEnabled decision to the owner-decision queue, add the M11a army-coupling + trade-refusal deferral rows the M11a commit claims exist, and update the round-21 plan's M11/ruins lines.
- Verdict: _pending Opus verification_

**[spatial-engine-8] LOW / confirmed — The calamity's named permanent stamp has no display surface — calamityHistory is written but never read by any dossier/UI/read-model**
- Where: `src/domain/worldPulse/calamityKernel.js:434` | Category: immersion
- Evidence: grep `calamityHistory` outside calamity modules matches only a pulseKernel comment — no display/, pdf/, or components/ consumer. The stamp ('The Great Fire of Thornwood, year 12') survives only as a one-shot news entry that scrolls off the 240-cap feed.
- Why: The spec sells the stamp as permanent legible history ('legible destiny come due'); after the news expires the DM has no way to see that a town burned five years ago, undermining the cooldown's in-world readability and the ruins-as-artifacts follow-on.
- Fix shape: A lazy display read-model (the newsVoice/institutionVocabulary pattern): surface calamityHistory entries on the settlement dossier history tab — byte-free (lazy display), fits the round-21 budget-free lane.
- Verdict: _pending Opus verification_

**[spatial-engine-9] LOW / confirmed — Nit batch: small polish items, one line each**
- Where: `src/domain/worldPulse/calamityKernel.js:579` | Category: polish
- Evidence: (a) calamityKernel.js:579 re-exports CALAMITY_TUNING it already imported (redundant surface). (b) rumorNetwork.js:245-249 rumorEventKey hardcodes the 'trade:' prefix for ALL carriers while the doc above claims recording is per-(event,carrier) — deliberate consolidation, stale comment. (c) entrepotKernel founds one transshipment institution per TICK while sustained (3 in 3 ticks) vs the tuning comment 'one per streak crossing' (entrepots.js:102). (d) pestilenceKernel materializationNews id uses the raw settlement id while calamity's strikeNews uses stablePart(id) — cosmetic id-shape inconsistency. (e) armyTransitKernel derives records solely from live deployments, so an army whose deployment resolves mid-march vanishes instantly (no return-march column). (f) calamityKernel buildExodusOutcome's ASPATIAL branch redistributes only round(exodus*0.45) with the remainder untracked — faithful to the legacy population-flight term but without M4's death receipts.
- Why: Each is minor on its own; batched per the 20-finding budget.
- Fix shape: Address opportunistically inside neighbouring waves; none blocks the ladder.
- Verdict: _pending Opus verification_


### Slice: worldpulse-war (grade A-)

**[worldpulse-war-1] HIGH / confirmed — Strategic-rust axis neutered: mobilized posture counts as 'enduring a siege' for experience, so the documented blundered-first-war can never fire**
- Where: `src/domain/worldPulse/martialReadiness.js:485` | Category: sim-logic-gap
- Evidence: const engage = engagement01({ deployed, besieged: mobilized, occupied, winloss: 0 }); — but the header (line 42) promises: "its FIRST materialization is at first mobilization, with experience ≈ 0 ⇒ the blundered first war", and engagement01's own doc says besieged = 'enduring a siege this tick' (ENGAGE_BESIEGED 0.9).
- Why: The W-F8 design's second fidelity term (rust — 'a long-peace realm blunders its first war, the 1914 problem') is defeated by this one wiring: a settlement must pass through 'mobilized' posture before the deploy gate lets it open a siege, and at that posture besieged:mobilized feeds engagement01 0.9, so stepExperience(null, 0.9) seeds experience at 0.9 > RUST_FLOOR_EXPERIENCE (0.85) ⇒ rustOf ≈ 0 at the very deploy/sizing/classify decisions rust was built to distort. Mere posturing (never a sword drawn) reads as siege-grade combat experience, collapsing the documented readiness/experience axis independence. winloss is also hardwired 0, so ENGAGE_WINLOSS_W (0.5) is a dead tunable.
- Fix shape: Feed engagement01 the real signals the kernel already has in hand at the martial pass: besieged = warFrontsInto(graph, cid).length > 0 (the same provenance-gated read pulseKernel line 1740 uses for embattlement), and winloss from this tick's dispositionDeltas (win/loss magnitude by id). Mobilized posture should contribute 0 engagement (it already contributes footing → readiness, the correct axis). Add a pin: first-deploy-after-long-peace has rustOf ≥ RUST bound. Behavior shift is gated behind faith worlds (martial record only exists there) — same-seed goldens for deity-free worlds unaffected; deity-world goldens need the documented one-time shift call-out.
- Verdict: _pending Opus verification_

**[worldpulse-war-2] HIGH / confirmed — Approved faction proposals are applied as ledger cosmetics: government_change never changes the government, institution capture/suppression never touches an institution, faction_power_shift never moves power**
- Where: `src/domain/worldPulse/applyWorldPulse.js:994` | Category: correctness
- Evidence: if (outcome.type === 'faction') state = applyFactionPatch(state, outcome); — applyFactionPatch (factionCompetition.js:712) merges only momentum/exhaustion/legitimacyClaim + the controlledInstitutions/suppressedInstitutions id lists. Grep-confirmed: the ONLY readers of proposalPayload kinds government_change/institution_capture/institution_suppression/faction_power_shift are the UI describer (WorldPulseData.js:88-96) and a candidate budget counter (candidateEvents.js:188).
- Why: The DM is shown a proposal promising a concrete world change — 'government_change → merchant_charter, preserve institutions', 'institution_capture: <name>' — clicks Apply, and applyWorldPulseProposal routes the stored outcome back through the same no-op: powerStructure.government, the governing faction, and the named institution are all untouched. Only government_challenge has any indirect bite (its faction_challenge condition erodes legitimacy, which can later open the coup gate). institution capture/suppression writes ids that project onto the dossier as text ('controls: …') with zero mechanical effect and a one-way accretion ratchet (mergeInstitutionIds comment: 'capture/suppression add one id, never remove') — control is never contested or lost. rival_power_contest's faction_power_shift payload shifts nothing. For a product whose thesis is 'this one simulates', the political layer's most dramatic verbs are table-dressing, and an explicit DM approval silently does nothing.
- Fix shape: Give each payload kind a real apply arm in applyWorldPulseOutcomes: government_change → transferRulingPower(next, <archetype-mapped faction name>, { cause:'political', preserveInstitutions }) exactly as coups do; institution_suppression → the existing corruptionImpair/withImpairment machinery (impair the named institution); institution_capture → a modest institution/faction power coupling plus a rival-side contest path so control can be lost (two-way); faction_power_shift → a bounded power transfer between the two factions' power scalars. All flag-gated additively behind the existing warLayer/strategy gates so dormant worlds stay byte-identical.
- Verdict: _pending Opus verification_

**[worldpulse-war-3] HIGH / confirmed — Sue-for-peace has no grip on the physical war: the label de-escalates and stressor twins wind down, but the suitor's own deployment and war_front grind on and can still conquer the other party**
- Where: `src/domain/worldPulse/settlementStrategy.js:484` | Category: sim-logic-gap
- Evidence: sue_for_peace emits only a relationship_label_change proposal (PEACE_STEP one rung down). On apply, syncRelationshipChannelBundle deliberately leaves war-layer fronts alone (graph.js:672 'De-alias war-layer fronts… The war layer alone re-mobilizes it') and windDownSponsoredStressors (applyWorldPulse:963) edits worldState.stressors only. Nothing touches worldState.deployments; evaluateWarLayer withdraws only on forcedLift or a failed feasibility verdict.
- Why: A besieger can be sampled into sue_for_peace while its army sits at the enemy's walls (enumerateMoves gates on inConflict = hostileTargets || besieging). The DM approves 'X sues for peace … the sponsored hostility winds down'; the stressor-side siege drops below the structural gate — and next tick the war-layer siege rolls again and can emit 'X storms Y'. Even after three approvals walk the label to trade_partner, the committed deployment persists until feasibility collapse or the 60-tick ceiling. Two shipped war representations (stressor twins vs. deployments/fronts) disagree about whether the war ended — directly contradictory feed beats a DM will notice. Also the comment says 'Target the strongest hostile edge' while the code picks hostileTargets[0] (codepoint-first), so the suit can even address a bystander hostility rather than the war it is actually fighting.
- Fix shape: Make the sue_for_peace apply the physical closer it narrates: on an approved relationship_label_change whose actor holds a deployment against the other party (or vice versa), resolve that deployment as outcome:'withdrawal' through the existing resolvedDeployments → deploymentReturnOutcomes machinery and retire its war_front channels (warFrontChannelIds already exists). Target selection should prefer ctx.besieging over codepoint-first hostileTargets. This is the cheap, coherent core of the deferred Wave-8 peace-treaty item and can land independently of negotiated terms.
- Verdict: _pending Opus verification_

**[worldpulse-war-4] HIGH / confirmed / KNOWN-DEFERRED — The emergency recall order (return_home) is never executed — an army abroad can never actually come home to defend its besieged home, and the order re-fires every tick**
- Where: `src/domain/worldPulse/settlementStrategy.js:663` | Category: sim-logic-gap
- Evidence: "it carries metadata.recallTargetId for the war layer, but the deployment itself is only physically withdrawn by warDeployment's withdrawal path; until that consumer is wired, the order (correctly) re-fires each tick" — grep confirms NO reader of recallTargetId or strategy_return_home exists outside this file.
- Why: The hard-override is the strategy layer's one deterministic, probability-1, bypass-the-softmax decision — 'home is besieged, recall the army' — and it is pure theater: the deployment stays committed, the home defends at the ARMY_DEPLOYED_CAPACITY_PENALTY, and the recall headline re-fires every tick the predicament persists (feed spam), while its exclusive tag suppresses every other strategy move the settlement could have made. The deferral is documented only in this code comment — it appears in no deferral ledger (playbook §0.0.2/§0.6/§0.8, backlog plan), which is exactly the dropped-thread class the M9-lever gap also fell into. I flag the deferral as unsound: it inverts the mechanic (the recall order makes the settlement strictly MORE passive).
- Fix shape: Wire the consumer in evaluateWarLayer: before step 3, read this tick's approved/auto return_home outcomes (or a worldState recall flag the strategy apply sets) and resolve the named deployment as outcome:'withdrawal' (resolvedDeployments + retire its fronts) so deploymentReturnOutcomes' existing home-besieged/occupied branches — siege relief, failed relief, liberation — fire naturally. Until wired, at minimum dedupe the re-firing order (the M10a pendingActorMajorFor hold pattern).
- Verdict: _pending Opus verification_

**[worldpulse-war-5] MEDIUM / confirmed / KNOWN-DEFERRED — M9a non-war levers (merchant reroute/embargo/credit, church missionize/legitimacy, warlord prestige/opportunity) are inert, and their promised apply-effects fell through the M9b→M9d sub-split with a stale deferral pointer**
- Where: `src/domain/worldPulse/settlementStrategy.js:109` | Category: docs-drift
- Evidence: LEVER_COPY comment: 'The apply-side economic effects (an actual reroute / embargo) are the M9b seam.' Playbook row 59 (M9a): 'non-war LEVERS … emitted INERT, apply-effects are M9b'. But M9b shipped components 3+4 (moral drift + ally-intel), M9c component 5, M9d component 6 — no wave shipped the lever effects and no ledger row records the remainder.
- Why: M9 is marked '✅ M9 COMPLETE (a+b+c+d)' (playbook row 62) while a piece M9a explicitly deferred INTO M9b never landed anywhere — the deferral pointer is stale, so a successor reading the ledger believes the political-depth wave is whole. Substantively: a merchant/church/warlord seat's distinctive moves emit feed prose ('X closes its markets to Y') and win the strategy:<S> exclusive slot — suppressing the seat's real deploy/sue_for_peace/defend move that tick — while mutating nothing. The archetype objectives thus make merchant polities strictly MORE passive rather than differently active, the opposite of the wave's intent.
- Fix shape: Two-part: (1) bookkeeping — add the lever apply-effects to a ledger (§0.6 parking lot or the round-21 backlog) so the thread is findable; (2) mechanics — embargo → suspend/dampen the trade edge (tradeWar/tradeSalience seams exist), reroute → a supplyShipments/logistics read, credit/missionize/legitimacy → bounded condition or relationship nudges, prestige/opportunity → disposition/objective couplings. Each lazily gated per the constitution.
- Verdict: _pending Opus verification_

**[worldpulse-war-6] MEDIUM / confirmed — The pacific mobilization reactions (negotiate, seek_allies) are narrative no-ops — only the martial reactions (fortify, pre_empt) carry any mechanical payload**
- Where: `src/domain/worldPulse/mobilizationReactions.js:118` | Category: sim-logic-gap
- Evidence: condition: move === 'fortify' || move === 'pre_empt' ? { archetype: 'war_mobilization', … } : undefined — negotiate/seek_allies candidates carry no condition, no relationshipPatch, no proposalPayload; grep confirms no consumer of metadata.reactionMove exists anywhere.
- Why: The module header promises 'seek_allies — reach for protection (a relationship overture); negotiate — open negotiations to defuse (a de-escalation overture)'. Neither ever touches a relationship, a channel, or a condition: the feed says 'X opens negotiations to defuse Y's mobilization' and the world is byte-identical (beyond the feed entry). The escalatory half of the reaction table works (fortify/pre_empt stamp war_mobilization); the de-escalatory half is theater — a systematic tilt where reactions can only ratchet toward war, never away from it. This is the missing counterweight pattern the review brief asks for.
- Fix shape: Give negotiate a small de-escalation pressure through the existing levers: a relationship_label_change proposal one PEACE_STEP down (or a recentIncidents 'talks' entry that relationshipEvolution's drift reads), and give seek_allies a bounded overture toward the strongest non-hostile neighbour (an information_flow channel + a compatibility nudge). Both additive and gated behind warLayerEnabled — dormant worlds unchanged.
- Verdict: _pending Opus verification_

**[worldpulse-war-7] MEDIUM / confirmed — Deployments targeting (or owned by) a settlement that leaves the campaign are immortal: the siege can never resolve and the home bleeds war_drain/exhaustion forever**
- Where: `src/domain/worldPulse/warDeployment.js:1250` | Category: lifecycle
- Evidence: for (const targetId of targets) { if (!snapshot?.byId?.has?.(targetId)) continue; — a deployment whose target vanished is skipped by the resolution loop, but step 5 still iterates ALL of Object.keys(deployments) each tick, re-stamping war_drain/army_deployed and ratcheting warExhaustion. Contrast occupation.js:800, which explicitly drops occupations whose parties left the canon; factionStates/npcStates got dedicated prune passes.
- Why: Removing a settlement from a campaign (roster edit, canon change) permanently locks its besieger: the one-army gate blocks any new deployment forever, posture pins at deployed/war_exhaustion, the scar ratchets to 1.0 and never decays (activeDeployers includes the ghost), and war_drain conditions cite a target that renders as its raw id. This is the owner's most-bitten class — state that survives one lifecycle path (normal resolution) and ghosts another (roster mutation).
- Fix shape: Add the missing prune, mirroring occupations: in evaluateWarLayer step 0 (or a pruneDeployments sibling of pruneFactionStates), any deployment whose attacker or target is absent from snapshot.byId resolves as outcome:'withdrawal' through resolvedDeployments (banked deployedPopulation returns via the normal homecoming, conserving population) with its fronts retired; a vanished ATTACKER's record is simply dropped. Add a pin: remove-target-mid-siege → deployment resolves within one tick.
- Verdict: _pending Opus verification_

**[worldpulse-war-8] MEDIUM / confirmed — Defenders never bank disposition wins — every siege survived, occupation thrown off, or forced lift credits only the aggressor's loss**
- Where: `src/domain/worldPulse/warDeployment.js:1393` | Category: sim-logic-gap
- Evidence: dispositionDeltas.push({ id: String(attackerId), outcome: 'loss', … }) — the withdrawal path credits only the attacker's loss; occupation.js:818 likewise pushes only { id: occupierId, outcome: 'loss' } on liberation. Only conquest is two-sided (warDeployment.js:1535-1536 pushes both win and loss).
- Why: The disposition ledger is the world's 'we succeed at war' memory feeding computeAggressiveness, mobilization ramp speed, and rival threat reads. As wired, victory only exists for aggressors: a town that outlasts a 40-tick siege until the besieger breaks off, or throws off its occupier through resistance, gains zero confidence — its aggressiveness multiplier is identical to never having been attacked, while the failed attacker correctly banks a loss. Successful defense is one of the strongest disposition signals in the fiction ('we held the walls'), and its absence makes long defensive wars psychologically weightless for the winner — a missing counterweight that flattens post-war drama (no emboldened survivor states).
- Fix shape: Push the mirror deltas: on withdrawal/forcedLift, { id: targetId, outcome: 'win', magnitude: ~0.5 } (scaled by how gutted the withdrawing army was); on occupation collapse, an occupied-side win 0.4-0.6. Behind warLayerEnabled; the ±SCORE_MAX clamp already bounds it. Same-seed shift is confined to war-active worlds — record the legitimate cause.
- Verdict: _pending Opus verification_

**[worldpulse-war-9] MEDIUM / confirmed — Occupation places no constraint on the occupied settlement's own war machine: an occupied town can mobilize, field its army abroad, and even besiege third parties or its occupier**
- Where: `src/domain/worldPulse/warDeployment.js:1581` | Category: sim-logic-gap
- Evidence: if (isBesieged(graph, fromId)) continue; // can't march while besieged/occupied — but isBesieged reads only live war_fronts, which are retired at conquest (line 1552); grep confirms warDeployment.js never reads worldState.occupations, and mobilization.stepPosture has no occupied cool trigger.
- Why: The deploy-gate comment claims 'besieged/occupied' but only the siege half is true. After conquest the fronts retire, so occupations[id] is the sole record — and nothing consults it: the occupied town keeps ramping posture (occupation even RAISES its warFooting/readiness), passes the deploy gate, and can commit its one army to a foreign siege while an occupation authority nominally rules it. The occupier's only lever is the resistance scalar; it cannot disband, redirect, or levy the occupied army. A DM watching a vassalizing occupation while the occupied town independently prosecutes its own foreign war will find the authority structure incoherent. (An occupied town marching on its OCCUPIER is a fine rebellion story — the gap is third-party adventurism under occupation with zero occupier response.)
- Fix shape: Smallest coherent fix: treat an active occupations[fromId] entry as a deploy blocker in step 4 (and a shouldCool trigger in mobilization) unless the chosen target IS the occupier (the uprising path stays open — and could earn a liberation coupling with the resistance scalar). Bolder: occupier posture control as an occupation-state perk at extractive+ rungs.
- Verdict: _pending Opus verification_

**[worldpulse-war-10] LOW / confirmed — Nit batch: dead winloss tunable; coup verdicts share one rng stream in list order; harassment names only besiegers[0]; successor NPCs draw from 27 first names; sue-for-peace comment/code mismatch; factionCapture iterates insertion order**
- Where: `src/domain/worldPulse/martialReadiness.js:99` | Category: polish
- Evidence: ENGAGE_WINLOSS_W: 0.5, // recent win/loss beats teach (either outcome) — engagement01's only caller passes winloss: 0 (martialReadiness.js:485).
- Why: One-liners: (1) ENGAGE_WINLOSS_W is a dead tunable (winloss hardwired 0). (2) coup.js draws from a single rng.fork('coup-verdict') consumed in resolved-list order — replay-stable but off the fork-per-id discipline every sibling uses (coupVerdictOutcomes, pulseKernel:331). (3) Multi-raider harassment emits one outcome naming only besiegers[0] (warDeployment.js:1429). (4) successorNpc.js picks from 27 bare first names — collision-prone, thin identities in long campaigns (successorNpc.js:13). (5) settlementStrategy.js:485 comment says 'strongest hostile edge' but code takes codepoint-first. (6) advanceFactionCapture iterates Object.entries insertion order rather than codepoint (factionCapture.js:61) — stable for persisted state but off-discipline. (7) occupation liberation credits no 'win' to the liberated town's own ledger (folded into the defender-win finding).
- Fix shape: Each is a one-line-to-small fix; batch them in a hygiene wave. None violates byte-identity if gated/sequenced with the related behavior-shift findings.
- Verdict: _pending Opus verification_


### Slice: domain-top (grade B+)

**[domain-top-1] HIGH / confirmed — ASSIGN_NPC_TO_ROLE rebuilds the NPC through createNpc's fixed field list, wiping the pipeline NPC's character sheet and user edits**
- Where: `src/domain/entities/npcs.js:118` | Category: lifecycle
- Evidence: createNpc returns only { id, name, role, importance, status, linkedInstitutionIds, linkedFactionIds, influence, legitimacyContribution, stabilityContribution, serviceContribution, potentialSuccessors, notes } — no ...input spread. assignNpcToRole (line 230) calls createNpc({ ...npc, ... }), and mutateEntities.js:496-505 replaces the roster entry with result.npc wholesale.
- Why: The shipped SuccessorPrompt flow (pillar dies → ASSIGN_NPC_TO_ROLE on an existing pipeline NPC) replaces a rich generated NPC (personality, physical, secret, goal, plotHooks, category, factionAffiliation, structuralPosition, power, corrupt/corruptionVector, createdByEventId) with a 13-field skeleton — and destroys any _userEdits/_authored the DM placed on that NPC. Undoing later events can no longer restore what apply already discarded from the live object; a committed assign permanently lobotomizes the successor. This is the owner's most-bitten class: the entity survives kill (killNpc spreads ...npc) but not promotion.
- Fix shape: Make createNpc preserve unknown input fields (spread input first, then apply structural defaults for absent fields only), or have assignNpcToRole merge structurally ({ ...npc, ...structuralPatch }) instead of rebuilding. Add a round-trip pin: assign-role on a pipeline-shaped NPC preserves personality/secret/goal/_userEdits byte-for-byte apart from the structural fields it legitimately changes.
- Verdict: _pending Opus verification_

**[domain-top-2] HIGH / confirmed — User-canon preservation across regeneration is promised in three places but enforced by none: the Tier 5.2 plan is orphaned and section-regens wipe _userEdits/_authored/pinned entities**
- Where: `src/domain/regenerationMode.js:148` | Category: lifecycle
- Evidence: buildRegenerationPlan's only consumer is RegenerationModeSelector.jsx, which is mounted nowhere (grep over src/: zero mounts). store regenSection('npcs') does `Object.assign(s.settlement, parts)` from regenNPCsPipeline, which re-rolls the full roster with no _authored/locked/pinned awareness. userEdits.js:32-34 claims "engine regenerate ... already respect that flag — no new wiring needed"; provenance.js:29 ships copy "User canon preserved across rerolls."
- Why: The entire Tier 5.2/5.3 preservation architecture (canon tags → locked → PRESERVATION_RULES) is built, tested, and documented, but no regeneration path consults it. NPC/history section-regens (live buttons on the NPCs tab) silently destroy hand-authored prose edits, _authored promotions, and dangling-pin aiData.pinnedNpcs. The edit survives save/load and the AI-overlay verifier defends it, then a one-click reroll erases it — a trust-breaking asymmetry for the exact premium hand-authoring feature the trust copy advertises.
- Fix shape: Bold-but-contained: make regenSection consult buildRegenerationPlan (default 'rebalance') — carry over roster entries whose canon tag is canon/locked (match by the same derived ids lookupTagForEntity uses), and re-apply walkUserEdits records onto surviving entities after the re-roll; mount the mode selector on the reroll confirms. At minimum, correct the userEdits.js/provenance.js claims and warn in the reroll confirm when countSettlementEdits > 0. Byte-safe when no edits/locks exist (plan preserves nothing ⇒ identical output).
- Verdict: _pending Opus verification_

**[domain-top-3] MEDIUM / confirmed — Institution→faction impairment propagation can never fire on generated settlements — link lists never written, documented category fallback never implemented**
- Where: `src/domain/entities/propagate.js:295` | Category: sim-logic-gap
- Evidence: findLinkedEntities institution branch only scores factionInstitutionStrength over controls/funds/staffs/protectsInstitutionIds; grep over src/generators finds no writer of any of these. The docstring (line 270-274) promises "Default fallback: any faction whose category matches the institution's category" — no such code exists.
- Why: IMPAIR/DESTROY_INSTITUTION handlers call propagateImpairment with institution origins (mutateEntities.js:161/180/252), so the designed second link of the cascade — 'the granary burned, the controlling merchant faction's wealth suffers' — is a silent no-op on every generated settlement. NPC-origin cascades work (factionRoles stamps linkedInstitutionIds/linkedFactionIds), which masks the gap. A DM burning a temple sees no reaction from the religious faction: mechanics that read as designed counterweights never fire.
- Fix shape: Implement the documented fallback in findLinkedEntities: match faction archetype (via the canonical factionArchetypes detector) to institution classification (institutionClassify/customContent category patterns) at a low default strength (~0.4), gated so explicit link lists still win. Alternatively have the generator stamp controlsInstitutionIds at assembly. Add a pin: DESTROY_INSTITUTION on a generated fixture lands at least one faction impairment.
- Verdict: _pending Opus verification_

**[domain-top-4] MEDIUM / confirmed — customContent.js (Tier 4.16 classifier, 400 lines) is dead code — user content never flows through the substrate as the schema claims**
- Where: `src/domain/customContent.js:368` | Category: dead-code
- Evidence: classifyCustomEntity/classifyCustomInstitution/inferCustomEntityType have zero src consumers (grep: only settlement.schema.js doc text and its own test). The live homebrew path is customContentSchema.js (§14) + lib/customContent.js service.
- Why: settlement.schema.js:1405-1410 still documents this as how "user prose flow[s] through Phase 18's pipeline and the Tier 4 derivations like a generated entity" — a successor (or the AI-grounding docs) will trust a wiring that does not exist. Its CATEGORY_TEMPLATES substrate/capacity effect deltas are a designed mechanic that can never fire. Also carries internal staleness: the arcane-context hint checks magicLevel === 'rare' (a vocabulary the generator never emits — the exact class magicLedger was built to kill).
- Fix shape: Owner decision: either wire classifyCustomEntity's effects into the substrate derivers for custom entities (the original Tier 4.16 intent — genuinely valuable: homebrew would move food_security/capacities), or delete the module and fix the schema doc to point at the §14 customContentSchema path. Do not leave both stories standing.
- Verdict: _pending Opus verification_

**[domain-top-5] MEDIUM / confirmed — provenance.js trust-signal module is orphaned and its copy overpromises**
- Where: `src/domain/provenance.js:39` | Category: dead-code
- Evidence: deriveProvenanceSummary/provenanceTrustKeys have no src consumers (ProvenanceBlock.jsx imports only useStore/theme/Card and builds its own display). TRUST_KEYS.user_canon: 'User canon preserved across rerolls.'
- Why: The transparency/trust surface (a stated product differentiator for the anti-AI audience: 'Built from procedural simulation', 'AI not used') was built as a domain module and never mounted — the product ships less trust-signaling than it authored. Worse, its user_canon line is factually wrong today (finding 2), so wiring it as-is would ship a false trust badge on a paid surface.
- Fix shape: After finding 2 is resolved, mount deriveProvenanceSummary in ProvenanceBlock/dossier header (it is pure and cheap); until then fix the user_canon label to match reality or gate it on the preservation actually working.
- Verdict: _pending Opus verification_

**[domain-top-6] LOW / confirmed — Public-safe projection leaks _userEdits records (pre-edit originalValue + timestamps) on non-NPC entities**
- Where: `src/domain/display/publicSafe.js:78` | Category: security
- Evidence: PRIVATE_KEY_RE has no token matching '_userEdits'; sanitizePublicValue's npcs-path filter drops only ['goal','secret','plotHooks','relationships']. Institutions/history.historicalEvents/currentTensions pass through the recursive denylist only (NPCs are saved by the publicNpc allowlist, settlement root by PUBLIC_TOPLEVEL_KEYS).
- Why: An edited institution desc / historical-event description carries { value, originalValue, editedAt } into the public gallery projection: if a DM edited a field precisely to redact the generated text, the redacted original still ships publicly, plus wall-clock editing metadata. Mirrored server-side (the client mirrors _gallery_sanitize_public_json), so the same gap likely exists in the SQL sanitizer — worth checking at the master-merge byte-integrity pass.
- Fix shape: Add `_userEdits` (or a general `^_` leading-underscore rule for deeper levels) to PRIVATE_KEY_RE and mirror in the SQL sanitizer + the gallerySanitizeAllowlist contract test.
- Verdict: _pending Opus verification_

**[domain-top-7] LOW / confirmed — settlement.schema.js SimHistory JSDoc block is unterminated — it swallows the SettlementIdentity typedef into the same comment**
- Where: `src/domain/settlement.schema.js:548` | Category: docs-drift
- Evidence: Line 548 ends '...not this settlement sub-object.' with no closing */; line 549 opens '/**' for SettlementIdentity, which (block comments don't nest) is plain text inside the still-open SimHistory comment until the */ at line 556.
- Why: Both typedefs currently resolve only because TS tolerates multiple @typedef tags in one comment; any future edit inside this region (or a stricter doc parser) can silently break SettlementIdentity/Tier resolution across the schema's consumers. It is a landmine in the single source-of-truth file.
- Fix shape: Add the missing '*/' after line 548. Zero-byte-risk (comment-only).
- Verdict: _pending Opus verification_

**[domain-top-8] LOW / confirmed — Substrate vocabulary drift: schema typedef and comments still say 14 system variables; the engine has 16**
- Where: `src/domain/settlement.schema.js:1054` | Category: docs-drift
- Evidence: SystemVariableName typedef enumerates 14 names ending 'social_trust' — missing 'economic_capacity' and 'law_order' which SYSTEM_VARIABLES (causalState.js:321) includes; causalState.js:13 comment says '// 14 entries'; activeConditions.js:321-323 still claims economic_capacity 'is INERT in this tree (causalState does not yet derive that system variable)'.
- Why: SystemVariableName is the documented closed vocabulary that ThreatProfile.affectedSystems and consumers type against; two live variables being absent from it means new code typed against the schema union will reject valid affectedSystems values, and the stale INERT claim invites someone to re-add a coupling that already exists (double-count risk).
- Fix shape: Add the two names to the typedef and refresh the two stale comments; comment-only plus a doc-type widening (no runtime bytes).
- Verdict: _pending Opus verification_

**[domain-top-9] LOW / confirmed — Nit batch: minor doc-vs-code and dead-wiring items**
- Where: `src/domain/canonicalAccessors.js:26` | Category: nit-batch
- Evidence: (a) canonicalAccessors.js:26-27 claims a {count,items} wrapper 'falls through to the next candidate' but line 42 wraps any non-array object as a one-entry stressor list. (b) mutateEntities.js:408-413 passes flaw/temperament/goal/constraint/secret into createNpc which drops them — and no producer anywhere sends those payload fields ('surfaced verbatim on the NPC read card' is doubly false). (c) propagate.js:442 entityName reads s.factions, not factionsList(s) — propagated-impairment descriptions show the raw id instead of the name on powerStructure-shaped settlements. (d) distributionDashboard.js (202 lines) is consumed only by its own test. (e) walkUserEdits emits kind 'plotHook' but EDITABLE_FIELDS has no 'plotHook' entry, so plotHook edits are permanently gated off while the walker advertises them.
- Why: Each is small, but (a)/(b) are doc claims a successor will code against, and (d) is dead weight in an eager-adjacent tree.
- Fix shape: One hygiene commit: fix the two comments, delete or wire distributionDashboard, use factionsList in entityName, either wire the ADD_NPC trait fields end-to-end (composer field + createNpc spread + read card) or delete the dead pass-through, and align walk kinds with EDITABLE_FIELDS.
- Verdict: _pending Opus verification_


### Slice: domain-events-region (grade A-)

**[domain-events-region-1] HIGH / probable — DM relationship events never reach the live conflict layer — peace/dispute stays cosmetic in canon campaigns**
- Where: `src/domain/events/mutateWorld.js:264` | Category: sim-logic-gap
- Evidence: mutateWorld.js:270-272: "CAVEAT (settlement-local): this writes the HOME settlement's view only. Reciprocal/regional-graph propagation of the new edge is a campaign-layer follow-up". Grep: syncRelationshipChannelBundle is called ONLY from applyWorldPulse.js (897, 922) — never from any event path. relationshipState.js:205: `const rawType = existing.relationshipType || normalizedEdge?.relationshipType` — the pulse's existing state wins over a refreshed edge label. partyEventLinkage.js:31-35 maps only KILL_NPC/IMPAIR_FACTION/RESTORE_FACTION, yet partyImpactKinds.js:26-27 already ships broker_relationship/inflame_relationship, and partyImpact.js:183-205 shows they DO move relationshipStates.
- Why: BROKERED_ALLIANCE's registry prose promises 'Relations become Allied; volatility settles and mutual defense improves', but in a canon campaign with a live pulse the war_front channel bundle stays confirmed (only the pulse's syncRelationshipChannelBundle parks bundles dormant), the pulse relationshipState stays hostile (existing-wins), and the graph edge refreshes only on a manual Discover rebuild. The DM's de-escalation lever — the counterpart to the war system — does not reach the layer that wages the war, directly undermining the 'this one simulates' thesis at the moment a DM most tests it.
- Fix shape: Wire the existing counterparts: extend EVENT_TO_PARTY_KIND with BROKERED_ALLIANCE→broker_relationship and SETTLEMENT_DISPUTE→inflame_relationship (relationshipKey derivable from saveId+targetId), and have rippleEventThroughWorld call syncRelationshipChannelBundle + a relationship-state type upsert for the three relationship events and applyStressor's instigator flip. Both mechanisms exist and are pulse-proven; this is wiring, not architecture. If this is deliberately scoped to the Wave-8 peace-treaties design, record it in a deferral ledger — today it lives only in code comments.
- Verdict: _pending Opus verification_

**[domain-events-region-2] HIGH / confirmed — REMOVED_THREAT leaves no stressorEdits suppression — a party-removed threat resurrects on any regeneration**
- Where: `src/domain/events/mutateWorld.js:175` | Category: lifecycle
- Evidence: removedThreat (mutateWorld.js:175-212) splices the entry from stressors/stress/stresses and writes NO config.stressorEdits record (contrast crisisResolve, crisisLifecycle.js:436: 'add the type to the `resolved` suppression list'). The generation overlay reads only that record: resolveStress.js:100-107 `editsResolved = stressorEdits.resolved ... resolvedSet.has(lower(st?.type))`. undoEvent.js:180-183 confirms: 'REMOVED_THREAT strikes a live stressor entry ... no provenance stamp and no stressorEdits record'.
- Why: This is the owner's most-bitten bug class — a write that survives one path and ghosts another. RESOLVE_STRESSOR got the suppression treatment (pinned by crisisTripleSync tests); its player-intervention twin REMOVED_THREAT did not, so the same fiction ('the threat is gone') is durable through one event type and evaporates through the other.
- Fix shape: Mirror crisisResolve's record write in removedThreat: on a successful strike, record the removed entry's type in config/_config stressorEdits.resolved (slug-tolerant, same dual-write discipline), and teach captureEventUndoSnapshot to snapshot stressorEdits for REMOVED_THREAT so undo restores it (the SNAPSHOT_CONFIG_KEYS table already has the pattern).
- Verdict: _pending Opus verification_

**[domain-events-region-3] HIGH / confirmed — The PLAGUE canon event mints no world-pulse twin — the event named 'Plague' is invisible to M11a's traveling pestilence**
- Where: `src/domain/crisisLifecycle.js:537` | Category: taxonomy-coherence
- Evidence: twinDirectiveForEvent (crisisLifecycle.js:540-554) returns a directive only for APPLY_STRESSOR / RESOLVE_STRESSOR; PLAGUE/REFUGEE_WAVE/RAID_OR_MONSTER_ATTACK fall through to `return null`. pestilence.js:361-363: seeds are 'settlements with an ACTIVE disease_outbreak stressor'. stressorPicker.js GEN_TO_PULSE_TYPE: `plague_onset: 'disease_outbreak'` — so APPLY_STRESSOR(plague_onset) DOES inject the traveling stressor.
- Why: Two authoring surfaces for the same fiction now diverge silently and consequentially: APPLY_STRESSOR('plague_onset') creates the roaming disease_outbreak that M11a spreads along trade routes, feeds stressorDynamics and the religious-contest crisis seam; the dedicated PLAGUE event creates only a local condition + impairments + a regional health_shock. A DM reaching for the obvious 'Plague' button gets the inert one, and nothing in the composer prose says so. Same class (weaker) for REFUGEE_WAVE vs mass_migration and RAID vs monster_pressure.
- Fix shape: Extend twinDirectiveForEvent to map PLAGUE → inject {type:'disease_outbreak', severity} (and consider REFUGEE_WAVE→mass_migration, RAID→monster_raider_pressure), with crisisWithdraw symmetry for undo; alternatively retire PLAGUE from the composer in canon campaigns in favor of the stressor path and say so in its prose. The ONE-PLAGUE-TRUTH law makes the inject route the natural fix — the DM event should drive the same stressor everything else drives.
- Verdict: _pending Opus verification_

**[domain-events-region-4] MEDIUM / confirmed — Party-caused KILL_LEADER produces no world ripple while plain KILL_NPC does**
- Where: `src/domain/events/partyEventLinkage.js:31` | Category: sim-logic-gap
- Evidence: EVENT_TO_PARTY_KIND (partyEventLinkage.js:31-35) maps KILL_NPC → remove_npc but has no KILL_LEADER entry; mapEventToPartyImpact returns null for unmapped types. KILL_LEADER is killNpcMutation forced to pillar importance (mutateEntities.js:561-567) — strictly more consequential than KILL_NPC.
- Why: The party assassinating the settlement's ruler is the strongest NPC-removal event in the taxonomy, yet it skips the party-impact pipeline (world faction/NPC state, condition resolution, Wizard News) that a lesser party-caused KILL_NPC fires. Inverted consequence ordering a DM will notice.
- Fix shape: Add KILL_LEADER: { kind: 'remove_npc', targetField: 'npcId' } to EVENT_TO_PARTY_KIND (one line + a pin); consider REMOVED_THREAT → resolve_stressor in the same pass since the kind exists (partyImpactKinds.js:22).
- Verdict: _pending Opus verification_

**[domain-events-region-5] MEDIUM / confirmed — IMPOSE_CORRUPTION has no batch hard-ref — phantom corruption events land narration and deltas while the mutation silently no-ops**
- Where: `src/domain/events/batch.js:94` | Category: correctness
- Evidence: eventConsumes' switch (batch.js:94-183) has cases for EXPOSE_CORRUPTION, KILL_NPC, PROMOTE/DEMOTE_NPC, REMOVE_TRADE_GOOD, RESOLVE_STRESSOR, CHANGE_RULING_POWER — but none for IMPOSE_CORRUPTION. The handler hard-requires preconditions: mutateEntities.js:698 `if (!npc || npc.corrupt) return s;` and :704-705 `|| null; if (!orgName) return s;`.
- Why: The module's own comments define the posture this violates: REMOVE_TRADE_GOOD's ref exists precisely because a silent no-op 'lands its authored systemState deltas + narration in the canon timeline' (batch.js:139-147). A mistyped NPC name, an already-corrupt target, or a settlement with no criminal institution produces a timeline entry claiming an NPC was turned — with volatility/resilience deltas applied — while no NPC changed.
- Fix shape: Add `case 'IMPOSE_CORRUPTION': if (targetId) refs.push({ kind: 'npc', ref: targetId })` and (bolder, matching the stressor-archetype precedent) a namespace check that the settlement has a criminal institution or the payload names one.
- Verdict: _pending Opus verification_

**[domain-events-region-6] MEDIUM / confirmed — Discovery suggests trade dependency between HOSTILE settlements at a floored 0.62 confidence, contradicting the trade layer's hostile-no-trade rule**
- Where: `src/domain/region/discoverDependencyCandidates.js:291` | Category: sim-logic-coherence
- Evidence: trade_dependency candidate: `confidence: Math.max(relConfidence, 0.62)` (line 291) — relationshipConfidence('hostile') = 0.15 (line 204) is discarded by the max. The `friendly` gate (line 344) protects only trade_route/service/migration candidates, not the goods-driven trade_dependency/export_market pairs. Contrast tradeLinks.js:23: `NO_TRADE_RELATIONSHIPS = new Set(['hostile'])` — generation-time trade excludes hostile pairs outright.
- Why: Two sibling modules encode opposite answers to 'do enemies trade': generation says never, discovery says likely-with-healthy-confidence. Suggested-only (the DM confirm gate holds), but the advisory surface tells the DM 'Ironmere likely depends on Grimhold for Grain' about two settlements at open war, and the carefully-authored relationshipConfidence table is dead code for any value below 0.62 on these two channel types.
- Fix shape: Blend instead of floor — e.g. confidence = clamp(0.62 * relFactor) where relFactor derives from relationshipConfidence, or gate the goods-driven candidates on !hostile (matching tradeLinks) and let a hostile pair surface as resource_competition/smuggling texture instead.
- Verdict: _pending Opus verification_

**[domain-events-region-7] MEDIUM / confirmed — Recovery change-kinds propagate nothing — the regional engine transmits shocks but never relief**
- Where: `src/domain/region/propagation.js:459` | Category: sim-logic-gap
- Evidence: deriveLocalDelta mints route_restored (deriveRegionalState.js:353-360), export_gained/import_gained/local_production_gained/depleted_good_lost (diffGoods:280-289). Grep across all 13 rules in propagation.js: no rule consumes any of them; only population_growth/tier_promotion appear, and only in ruleInformationFlow (line 572).
- Why: One-way ratchet in the DM-facing causality engine: a granary rebuilt or a route reopened at the source sends no relief downstream — targets suffer until their conditions time out (6-10 ticks) and the applyWorldPulse ghost-reconcile flips the impact resolved. There is no 'grain flows again' beat, so the news feed reads as unrelieved doom and a DM's restorative play produces no visible regional consequence — the exact asymmetry the whole-sim assessment flagged as the stasis/drama problem, in miniature.
- Fix shape: Add a relief lane: a rule mapping export_gained/route_restored through trade channels to a 'relief' impact whose apply step early-expires the matching negative condition at the target (reuse the ghost-reconcile machinery in applyWorldPulse.js:1032-1055) + a wizard-news 'pressure eases' transition. Bounded and additive — same rule table, positive polarity.
- Verdict: _pending Opus verification_

**[domain-events-region-8] MEDIUM / confirmed — OPENED_TRADE_ROUTE's add-new-link path hardcodes trade_partner orientation regardless of the chosen relationship type**
- Where: `src/domain/events/mutateWorld.js:274` | Category: correctness
- Evidence: `const def = relationshipDefinition('trade_partner', s.id || s.name || 'home', targetId);` (line 274) while the link written three lines later carries `relationshipType: relType` where relType = payload.relationshipType, documented as 'allied / client / patron / trade_partners' (registry.js:552-553).
- Why: For hierarchical types the from/to orientation is load-bearing (edge.from is the patron/overlord — graph.js:571-573); a patron-typed opened route mints a link whose relationshipFrom/relationshipTo describe a symmetric trade_partner edge, so the regional edge built from it loses who patronizes whom.
- Fix shape: `relationshipDefinition(relType, ...)` — pass the actual resolved type (canonicalRelType already normalized it one line above).
- Verdict: _pending Opus verification_

**[domain-events-region-9] MEDIUM / confirmed — PLAGUE handler uses a private healing-institution regex that misses most of the canonical healing vocabulary**
- Where: `src/domain/events/mutateWorld.js:428` | Category: silo
- Evidence: mutateWorld.js:428: `/hospital|temple|infirm|healer/i` vs the canonical classifier healingLedger.js:28-29: `/(temple|chapel|infirmary|healer|hospice|herbalist|apothecary|shrine|hospital|monaster|almshouse)/i` — chapel, hospice, herbalist, apothecary, shrine, monastery, almshouse are strained by no DM plague.
- Why: Two healing vocabularies in one engine: the discovery layer deliberately routed through healingLedger for exactly this reason (discoverDependencyCandidates.js:241-253), and M11a's care counterforce reads the roster — but the DM's PLAGUE event impairs only 4 of the 11 healing institution classes, so a monastery town shrugs off an authored plague that should overrun it.
- Fix shape: Import HEALING_INSTITUTION_PATTERN (or healingLedger) in mutateWorld's plague handler — one regex swap; healingLedger is a domain leaf so no layering violation.
- Verdict: _pending Opus verification_

**[domain-events-region-10] LOW / confirmed — Legacy typed neighbour graph maps both 'vassal' and 'overlord' to tax_authority/incoming — one direction is backwards**
- Where: `src/domain/regionalGraph.js:134` | Category: correctness
- Evidence: LEGACY_RELATIONSHIP_MAP: `vassal: 'tax_authority', // we are vassal -> they are tax authority` and `overlord: 'tax_authority'` (regionalGraph.js:134-136); inferDirection('tax_authority') is unconditionally 'incoming' (line 227).
- Why: A link labeled 'vassal' (the neighbour is OUR vassal, per the canonical vocabulary where edge.from is the overlord) renders the same 'they tax us / change of rule there → POLICY shifts here' hints as an overlord link — the display read-model inverts the hierarchy for one of the two spellings. Also this module is a third relationship vocabulary beside canonicalRelationship.js and region/graph.js; drift risk is structural.
- Fix shape: Split the mapping (vassal → 'dependent'/outgoing, overlord → tax_authority/incoming) or delegate classification to canonicalEdgeForLink like the region/ layer does; longer-term fold this Tier-4.13 module's display role onto the canonical vocabulary.
- Verdict: _pending Opus verification_

**[domain-events-region-11] LOW / confirmed — Graph rebuild's first-link-wins pair dedupe lets roster order decide the edge label when two settlements' views diverge**
- Where: `src/domain/region/graph.js:376` | Category: determinism
- Evidence: `const relationshipKey = link.linkId || [sourceId, targetId].sort().join('::'); if (relationshipKeys.has(relationshipKey)) continue;` (graph.js:374-377) — the first save iterated contributes the pair's label; the reciprocal link is skipped.
- Why: Relationship events write one side only (finding 1), so divergent views are the NORM after a DM dispute/alliance: whether the regional edge reflects the DM's change then depends on campaign roster order, not on which link is newer. Deterministic but arbitrary — and it silently flattens genuinely asymmetric perceptions.
- Fix shape: Prefer the most-adversarial (or most-recently-stamped via _relationshipEventId, which is currently write-only) view when the two sides disagree, or process both links and record the divergence as edge evidence — the belief-map machinery shows the house pattern for perception splits.
- Verdict: _pending Opus verification_

**[domain-events-region-12] LOW / confirmed — Nit batch: small consistency gaps (each one line to a few lines)**
- Where: `src/domain/events/batch.js:356` | Category: consistency
- Evidence: (1) batch.js:356 initNamespace factions uses `powerStructure.factions || factions` while findFaction searches the UNION — validation stricter than mutation on legacy dual-list saves. (2) discoverDependencyCandidates.js:47 relationBetween returns the raw label without canonicalRelationshipLabel, so legacy 'trade_partners' fails TRADE_FRIENDLY_RELATIONSHIPS (line 26) and relationshipConfidence, while graph.js heals the same spelling. (3) factionResponses.js:307/561 IMPAIR_FACTION self-response check `targetId.includes(name)` breaks on id-form targets ('faction.temple_of_dawn' vs 'Temple of Dawn') — an impaired temple then responds by absorbing itself. (4) factionResponses.js:583-590 duplicates the registry's classifyInstitution minus four classes — divergent classifier copies. (5) batch.js:284-287 preview narrates every event against the ORIGINAL settlement while deltas use the running `before` — later-in-batch narration can misname context.
- Why: Individually cosmetic; collectively the recurring shape is duplicated-local-copy-of-a-canonical-helper, the drift class the codebase elsewhere fights with shared canonical joins.
- Fix shape: Point each local copy at its canonical source (canonicalRelationshipLabel in discovery, the union namespace in initNamespace, factionIdOf-aware self-check, registry classifyInstitution export).
- Verdict: _pending Opus verification_


### Slice: store (grade A-)

**[store-1] HIGH / confirmed — M10b lastLivingAdvanceAt stamp is never persisted after an advance — reload re-runs caught-up weeks (double-advance)**
- Where: `src/store/campaignWorldPulseSlice.js:389` | Category: lifecycle
- Evidence: advanceCampaignWorld stamps AFTER runAdvanceCampaignWorld's flushWorldPulsePersist already ran: `set(state => { const c = findActiveCampaign(...); if (c && c.worldState) c.worldState.lastLivingAdvanceAt = nowStamp; })` — no cacheCampaignState/syncCampaignSnapshot follows (grep: no auto-persist subscription exists; main.jsx:70 subscribes only to auth.loading). Phase-2's cacheCampaignState (campaignAdvanceSession.js:246) snapshots PRE-stamp state.
- Why: The wall-clock cursor is M10b's only defense against double-counting. localStorage + cloud carry the pre-advance cursor, so after any session whose LAST pulse action was an advance (including a 1-week catch-up), reopening the campaign recomputes elapsed weeks from the stale cursor and re-advances weeks the world already lived — an autonomous realm auto-resolves majors through phantom time, and undo is session-scoped so it is unrecoverable. This directly violates the M10b design decision §0.6.1-3 ('each advance (re-stamp)' traced across 'persist round-trip'); tests/store/catchUpCampaignWorld.test.js asserts only in-memory ws state, never a persist/reload round-trip.
- Fix shape: Move the advancesOnOpen re-stamp INTO runAdvanceCampaignWorld's Phase-2 commit set() (after applyWorldPulseResultToState, before cacheCampaignState) so the stamp rides the same atomic persist; undo semantics are preserved because the Phase-1 snapshot already predates it. Add a persist-round-trip pin: advance → read the localStorage sf_campaigns mirror → assert the cursor moved.
- Verdict: _pending Opus verification_

**[store-2] HIGH / confirmed — queueSettlementEvent and regional-impact mutators are not gated by advanceInFlight — a multi-tick advance's Phase-2 wholesale worldState/regionalGraph replace silently destroys them**
- Where: `src/store/campaignSlice.js:663` | Category: concurrency-lost-write
- Evidence: queueSettlementEvent has no isAdvanceInFlight check (campaignSlice.js:663-686) and writes c.worldState.pendingEvents; Phase 2 then replaces wholesale: `campaign.worldState = ensureWorldState(result.worldState, campaign)` (campaignPulseHelpers.js:168) where result was computed from the Phase-1 drain clone (`pendingEvents: []`). The guard contract itself names only 'canonize / rules / apply-proposal / dismiss / undo' (campaignWorldPulseSlice.js:152).
- Why: advanceMultiTick and simAdvanceWorker both default TRUE (flags.js:147,158), so a year-advance is a seconds-long awaited worker round-trip with a fully interactive main thread — and a 26-week catch-up fires in the background on opening a living campaign. A DM who applies a canon event on a clock-bound settlement during that window gets `{queued:true}` back (applyEvent returns success), yet Phase 2 clobbers the pendingEvents entry — the player intention vanishes with no trace. The same window clobbers applyQueuedRegionalImpact / setRegionalImpactStatus / cancelQueuedEvent / undoCampaignStressorBridge writes to worldState/regionalGraph (campaignRegionalSlice has zero advanceInFlight reads). Lost DM intent is exactly the class the advanceInFlight contract exists to prevent; its coverage is partial across slices.
- Fix shape: Either (a) extend the isAdvanceInFlight gate to queueSettlementEvent, cancelQueuedEvent, the regional-impact mutators, and undoCampaignStressorBridge (typed no-op with a 'world is advancing' reason the UI can toast), or better (b) make Phase-2 commit MERGE-not-replace the concurrent-writable fields: re-append pendingEvents accrued on the live draft since the Phase-1 drain, and rebase regional impact status flips. (a) is the safe wave-sized fix; add a pin that queues an event between Phase 1 and Phase 2 and asserts survival.
- Verdict: _pending Opus verification_

**[store-3] MEDIUM / confirmed — requestDailyLife awaits the relationship-memory build BEFORE the loading lock / abort token / credit check — double-click double-charges**
- Where: `src/store/aiSlice.js:727` | Category: correctness
- Evidence: `const relationshipMemoryContext = await buildDailyLifeRelationshipMemory(get(), saveId);` (line 727) runs before the credit check (line 731) and before `set(state => { state.aiRequestId = myRequestId; ... state.aiLoading = true; ... })` (lines 756-765). The file's own FP-2a header claims 'the guards, credit check, set(aiLoading), and the F18/F19 abort-controller stamp ALL still run synchronously' (lines 40-44).
- Why: During the await (two dynamic imports + a world-snapshot build — the first click can be hundreds of ms) aiLoading is still false, so a second click passes the `if (!settlement || aiLoading) return` guard and both calls proceed to fire paid generateNarrative requests. The second token-bump abandons the first's commit, but the server has charged both spends — the user pays twice for one daily-life result. requestNarrative and requestProgression stamp synchronously and are safe; only this action violates the contract.
- Fix shape: Move the buildDailyLifeRelationshipMemory await to AFTER the token/loading set (alongside loadAiLib, inside the try), threading it into generateNarrative's options — the pattern the other two actions already follow. Add an orchestration pin: two synchronous requestDailyLife calls ⇒ exactly one transport invocation.
- Verdict: _pending Opus verification_

**[store-4] MEDIUM / confirmed — Gallery settlement import strips the primary-deity embed but not cultDeitySnapshots — imported settlements arrive with a live foreign cult pantheon**
- Where: `src/store/galleryImportSettlement.js:70` | Category: dormancy
- Evidence: `const { _seed, primaryDeityRef, primaryDeitySnapshot, ...rest } = src.config;` — cultDeitySnapshots is absent from the destructure, while the comment above states 'an imported settlement must arrive DORMANT — no foreign pantheon'. subsystemActivation.js:46 flips the religion gate on `(item?.settlement?.config?.cultDeitySnapshots || []).length > 0`.
- Why: The activated live embeds deliberately survive the server's public projection (publicSafe.js:74, migrations 128/129 — they are revealed content), so this client strip is the ONLY dormancy guard. A source settlement with DM-imposed cults imports with a non-empty cultDeitySnapshots carrying the AUTHOR's account-scoped `deity:<scope>:<slug>` identity refs — the religion subsystem activates in the importer's campaign and a foreign god the importer never authored enters their pantheon ratchet, exactly the resurrection class the strip names. Contradicts the dormancy/additivity discipline for imported content.
- Fix shape: Add cultDeitySnapshots (and audit faithProfile / any other embed key subsystemActivation or the pulse reads) to the destructure strip; add a pin importing a fixture with imposed cults and asserting the saved entry's config carries no deity embed keys and the religion gate stays closed.
- Verdict: _pending Opus verification_

**[store-5] MEDIUM / confirmed — setSettlement / clearSettlement leave the previous save's lifecycle slots (phase, eventLog, canonizedAt, locks, systemState, pendingSuccession) attached to the new identity**
- Where: `src/store/settlementSlice.js:949` | Category: identity-hygiene
- Evidence: `setSettlement: (settlement) => set(state => { state.settlement = settlement; state.activeSaveId = null; })` — no reset of phase/eventLog/locks/canonizedAt/systemState/pendingSuccession, unlike hydrateFromSave's exhaustive reset list (lines 1760-1816). Live caller: SettlementsPanel.jsx:94 `if (data.settlement) { setSettlement(data.settlement); setLoadedFromSave(...) }`.
- Why: This is the exact cross-identity leak class the slice documents as F17/F19 and fixed for hydrateFromSave ('opening save B never inherits save A's in-flight state'), but the sibling entry point still leaks: after viewing a canon settlement, loading another via the SettlementsPanel path leaves phase 'canon' — renameNPC/renameFaction silently no-op (canon lock), queueEdit rejects rename kinds, a stale eventLog and pendingSuccession ride on an unrelated town, and a subsequent applyEvent logs canon history against the wrong lineage (activeSaveId null so nothing persists, compounding the confusion). The identity-reset invariant has no single chokepoint, so each new load path re-finds this bug.
- Fix shape: Extract hydrateFromSave's session-reset block into one resetSettlementIdentity(state) helper and call it from setSettlement, clearSettlement, and hydrateFromSave (structural prevention: one writer for identity resets); setSettlement should also reset phase to 'draft' and clear eventLog/canonizedAt/systemState (re-derive), pendingSuccession, pendingEditsQueue.
- Verdict: _pending Opus verification_

**[store-6] MEDIUM / confirmed — persist has no version/migrate and zustand's shallow merge replaces config wholesale — new DEFAULT_CONFIG keys silently vanish for returning users**
- Where: `src/store/index.js:71` | Category: persistence-robustness
- Evidence: persist options carry only `name` + `partialize` + `onRehydrateStorage` — no `version`, no `migrate`, no custom `merge`. partialize persists `config: state.config`; zustand's default merge is a shallow `{...current, ...persisted}`, so the persisted config object replaces DEFAULT_CONFIG entirely.
- Why: Any key later added to DEFAULT_CONFIG (the file has grown: settlementAgeMode, nearbyResourcesState, powerDynamicsConfig, ...) reads `undefined` for every returning user until they hit resetConfig, while fresh users get the default — a silent config-shape fork between cohorts that reaches the generator as input. Most reads have `||` fallbacks today, but the mechanism guarantees the next config feature ships broken-for-returners unless someone remembers; this is the owner's most-bitten class (a write that survives one path and ghosts another) in persistence-shape form.
- Fix shape: Deep-merge config over DEFAULT_CONFIG on rehydrate (custom merge: `config: { ...DEFAULT_CONFIG, ...persisted.config }`, same for the four toggle maps) and set an explicit persist version with a migrate stub — one small structural fix that retires the class.
- Verdict: _pending Opus verification_

**[store-7] LOW / confirmed — authSignIn skips resolveTier — the one auth path where an elevated role does not read as premium and an undefined tier is stored raw**
- Where: `src/store/authSlice.js:308` | Category: correctness
- Evidence: `tier: result.tier, role: result.role || 'user'` — versus setAuth:88, initAuth:179, authSignUp:281 and onAuthChange:215 which all use `resolveTier(tier, role)` (elevated ⇒ 'premium', falsy ⇒ 'free').
- Why: A developer/admin whose billing tier is free (or a result with tier undefined) gets auth.tier 'free'/undefined until the SIGNED_IN listener overwrites it — isPremium()/TIER_GATE consumers read wrong for that window, and permanently under a mock auth service that fires no event. The slice's own contract (lines 51-54) says elevated roles read premium 'everywhere auth.tier is consulted'.
- Fix shape: Use `resolveTier(result.tier, result.role)` in authSignIn, matching the four sibling paths.
- Verdict: _pending Opus verification_

**[store-8] LOW / confirmed — Sign-out does not clear the live settlement view, AI narrative, or credit state — previous account's content lingers on a shared device**
- Where: `src/store/authSlice.js:106` | Category: identity-hygiene
- Evidence: clearAuth resets auth + dossierEntitlements then calls only `clearCampaigns?.(); clearSavedSettlements?.(); clearCloudCustomContent?.()` — nothing clears state.settlement / aiSettlement / aiDailyLife (a loaded save's content), creditBalance, or transactions.
- Why: After sign-out the previous user's opened settlement, its paid AI narrative, and their credit balance remain in store state until navigation happens to unmount/overwrite them — inconsistent with the slice's own per-user-cache rationale ('a later user on the same device never reads the previous account's entitlements') and with the F17/F19 hygiene standard applied elsewhere.
- Fix shape: In clearAuth, also call clearSettlement + clearAiSettlement (which additionally aborts in-flight AI), reset the lifecycle slots (or the new resetSettlementIdentity helper), and zero creditBalance/transactions.
- Verdict: _pending Opus verification_

**[store-9] LOW / confirmed — Canon eventLog is the one unbounded per-save ledger — every applyEvent re-clones and re-uploads the whole history**
- Where: `src/store/settlementSlice.js:1465` | Category: perf-scale
- Evidence: `if (s.phase === 'canon') { s.eventLog.push(logEntry); }` with no cap anywhere (grep: only MAX_EVENT_NARRATIVE_SNAPSHOTS=10, MAX_VERSION_HISTORY=50, chronicle limits, PULSE_UNDO_CAP=10 exist); pickleCampaignState spreads `[...state.eventLog]` into every save write.
- Why: Each entry carries the event plus beforeState/afterState SystemState snapshots; a years-long canon campaign (the product's core promise) grows the save row and every persistSaveUpdate payload/fingerprint linearly forever, while every sibling ledger in the store is deliberately capped. Growth is DM-action-bound so it is slow, but it is the only uncapped one and it rides the hottest persist path.
- Fix shape: Cap with rotation like the chronicle (e.g. keep the newest N full entries + roll older ones to summary lines), or archive segments into a side ledger not re-uploaded per event. Needs an owner call on undo depth (undoLastEvent only pops the tail, so a deep cap is cheap).
- Verdict: _pending Opus verification_

**[store-10] LOW / confirmed / KNOWN-DEFERRED — The reader-audience promotion inputs are dead: bumpLifetimeNarrate has no caller and spendCredits (with its CREDITS_SPENT event) is never invoked**
- Where: `src/store/settlementSlice.js:342` | Category: dead-code
- Evidence: In-code TODO: 'bumpLifetimeNarrate has no caller yet, so the count never increments and the audience-promotion signal never fires' (settlementSlice.js:342-349; grep confirms zero callers). spendCredits' only non-slice reference is a stale comment: useReaderAudience.js:91 'creditsSlice tracks lifetime narrate-spend via spendCredits'.
- Why: useReaderAudience's anonymous→intermediate promotion never fires, and the client-side CREDITS_SPENT analytics chokepoint emits nothing — two halves of the same feature both dead. The TODO's fence excuse (aiSlice out of scope) is stale: FP-2a has since rewritten aiSlice, so the one-line wire-up (`get().bumpLifetimeNarrate()` in requestNarrative's success set) has been available for a while.
- Fix shape: Wire bumpLifetimeNarrate at the requestNarrative/requestProgression success commits exactly as the TODO specifies; either delete spendCredits+CREDIT_COSTS proxy as vestigial or route the client balance decrement through it so CREDITS_SPENT fires — and fix the useReaderAudience comment.
- Verdict: _pending Opus verification_

**[store-11] LOW / confirmed — Docs drift across the store's contract comments (slice count, persistence claims, tier-gate header, staging field)**
- Where: `src/store/index.js:2` | Category: docs-drift
- Evidence: index.js:2 'Unified Zustand store with 14 slices' but 15 creators are spread (accountImportSlice missing from the doc list); cross-slice contract comments in campaignSlice.js:148 / campaignRegionalSlice.js:72 / campaignWorldPulseSlice.js:126 repeat 'All 14 slices'; configSlice.js:42 labels wizard state '(persisted)' though partialize excludes it; authSlice.js:9-10 says free tier has 'no neighbour/export/map-chains' but TIER_GATE.free.export===true; aiSlice.js:16 references a `_aiStaging` field that does not exist.
- Why: These headers are the load-bearing onboarding surface for a successor AI/maintainer (the repo's stated succession model); each one currently asserts something false about composition, persistence, or the paid-tier gate.
- Fix shape: One comment-only sweep: 15-slice list + accountImport row, drop '(persisted)', align the free-tier header with TIER_GATE, delete the _aiStaging sentence, s/14/15/ in the three contract blocks.
- Verdict: _pending Opus verification_

**[store-12] LOW / confirmed — Nit batch: producer side-effects, catch-path owner guard, transient key in persisted config, service bulk-force asymmetry, member-seed strip asymmetry, permanent no-op action**
- Where: `src/store/aiSlice.js:337` | Category: nit-batch
- Evidence: Representative: `if (aiData) reportVerifier('narrative', verification);` fires analytics INSIDE the immer producer (aiSlice.js:337; toggleNarrativeView:410 same).
- Why: Each is real but small: (1) track() inside set() producers violates producer purity (aiSlice.js:337,410). (2) loadCampaigns' .catch sets campaignsLoaded=true with no stale-owner re-check, so a stale rejection flips the NEW owner's loaded flag (campaignSlice.js:233-237). (3) setNeighbourRelType writes `state.config._neighbourRelType` (neighbourSlice.js:43) — a transient marker that rides the persisted config forever (partialize persists config wholesale). (4) bulkSetServices 'force' iterates only already-present servicesToggles keys — unlike bulkSetGoods which walks the catalog — and grep finds no UI caller (toggleSlice.js:114-127). (5) importGalleryMapWithCampaign preserves member seeds client-side (`seed: src._seed || ...`, campaignSlice.js:369) relying solely on server 099 sanitization, while the settlement path strips defensively. (6) syncActiveNeighbourFieldsImpl is a permanent no-op behind the unmounted flushSuppressPersist flag (settlementRenameHelpers.js:43 — documented as awaiting the change-queue). (7) authIntents SAVE_SETTLEMENT handler registration races a very-early SIGNED_IN (store/index.js:149 dynamic import) — the intent survives unclaimed but silently expires at TTL.
- Fix shape: Sweep-sized: hoist the two track() calls out of producers; add the owner re-check in the loadCampaigns catch; stop mirroring _neighbourRelType into config (thread it via fullConfig at generate time only); align or delete bulkSetServices; strip member seeds in the campaign import for parity; keep (6) as-documented; consume() retry after handler registration for (7).
- Verdict: _pending Opus verification_


### Slice: generators-pipeline (grade B+)

**[generators-pipeline-1] HIGH / confirmed — Manual resource mode silently drops every plain-'allow' selection once any resource is marked abundant/depleted**
- Where: `src/generators/steps/resolveResources.js:119` | Category: correctness
- Evidence: resolveResources.js:119 `if (Object.keys(resourceState).length > 0) { nearbyResources = allCompatible.filter(k => { const st = resourceState[k]; return st === 'allow' || st === 'abundant' || st === 'depleted'; });` — but the UI never writes 'allow' into the map: ConfigurationPanel.jsx cycleResourceState off→allow does `updateConfig({ nearbyResources: [...selected, key] })` (list only); only abundant/depleted enter nearbyResourcesState.
- Why: UI semantics: list membership = allow, map holds only abundant/depleted overrides. Generator semantics: when the map is non-empty the roster is ONLY the map keys. So a user who enters manual mode (all compatible resources selected as allow) and marks a single resource 'abundant' generates a settlement whose entire resource roster is that one resource — every other explicit selection is silently discarded, cascading into institutions (resource multipliers), economy chains, and food.
- Fix shape: Make the two writers agree on one contract: in the manual branch, union config.nearbyResources (list) with the state-map keys — list members without a map entry are 'allow'. One-line semantic fix; add a pin test that a mixed allow+abundant config keeps both. Note tierResourceDynamics.js:503 (applyResourceOutcomeToSettlement) also mints single-entry maps on world-pulse events, so the collapse can also be induced by the sim itself.
- Verdict: _pending Opus verification_

**[generators-pipeline-2] HIGH / confirmed — Manual resource mode computes compatibility without the terrain override — terrain-specific and water-terrain resources the UI offered are dropped at generation**
- Where: `src/generators/steps/resolveResources.js:116` | Category: correctness
- Evidence: resolveResources.js:116 `const allCompatible = getCompatibleResources(tradeRoute).filter(r => r.compatible)` — terrain param omitted, and terrainHelpers.js:52 makes every terrain-specific resource incompatible when terrain is null (`if (!terrain) { compatible = false; }`). The UI passes it: ConfigurationPanel.jsx:178 `getCompatibleResources(route,terrain)` and explicitly shows terrain resources ('If terrain override set, show terrain-specific resources even if route-incompatible').
- Why: A desert/mountain settlement built in manual mode loses every desert/mountain resource the user marked abundant/depleted (they never enter allCompatible), and riverside/coastal water unlocks (river_fish, fishing_grounds, ...) are likewise dropped for non-water routes. The random branch passes terrain correctly (line 65), so only manual mode — the mode expressing the strongest user intent — loses it.
- Fix shape: Pass the same terrain the random branch derives: `getCompatibleResources(tradeRoute, (config.terrainOverride && config.terrainOverride !== 'auto') ? config.terrainOverride : null)`. Add a manual-mode + terrain-override pin test.
- Verdict: _pending Opus verification_

**[generators-pipeline-3] HIGH / confirmed — generatePower's adversarial-relationship gate checks a vocabulary that doesn't exist — hostile and rival neighbours still never militarize governance narrative**
- Where: `src/generators/steps/generatePower.js:41` | Category: sim-logic-gap
- Evidence: generatePower.js:41 `const ADVERSARIAL_REL = new Set(['hostile_rival', 'Hostile rival', 'cold_war', 'Cold war', 'tense']);` — but the live vocabulary is canonicalRelationship.js RELATIONSHIP_SELECTIONS ('rival', 'cold_war', 'hostile') and REL_DYNAMICS keys (rival/cold_war/hostile). Set.has('hostile') and .has('rival') are false; only 'cold_war' can ever match.
- Why: This gate exists precisely to pass the neighbour relationship into generatePowerStructure so the hostile-neighbour stability band and the 'Ongoing tensions with {neighbour}' recentConflict line fire (the H14 repair the comment describes). The downstream consumer (governanceNarrative.js:124-133) tolerantly accepts 'hostile', 'rival', AND 'cold_war' — proving the gate is the sole blocker. Result: the two most adversarial relationship types a user can pick still produce zero governance-level tension, the exact dead-mechanic class the fix claimed to close. A DM linking a Hostile neighbour gets a power structure indistinguishable from a neutral one on this axis.
- Fix shape: Set = ['hostile','rival','cold_war'] (the canonical values), optionally normalized lowercase; keep the legacy spellings if old saves carry them. Add a pin: hostile-relType generation produces the neighbour-tension recentConflict. Note getInstFlags (priorityHelpers.js:363) already handles the real vocabulary via substring — the two readers should share one predicate.
- Verdict: _pending Opus verification_

**[generators-pipeline-4] MEDIUM / confirmed — Category toggles are dead for random and custom settlement types — assembly keys off raw settType while the UI writes display-tier keys**
- Where: `src/generators/steps/assembleInstitutions.js:209` | Category: correctness
- Evidence: assembleInstitutions.js:209 `const t = config.settType || 'all'; return categoryToggles[`${t}::${cat}`] !== false...` — for settType 'random'/'custom' this reads 'random::cat'/'custom::cat'. The only writer (toggleSlice.js:45 via InstitutionalGrid) keys `${tier}::${category}` where tier = resolveDisplayTier(config) = 'all' for random and the population-derived tier for custom. Neither 'random::*' nor 'custom::*' is ever written.
- Why: Disabling a category in the wizard has zero effect on generation whenever settType is random or custom. Worse, it is internally inconsistent: factionCorrelation.js:146-149 checks BOTH the resolved-tier and 'all' prefixes, so faction pulls honor the very toggle main assembly ignores — a category the user disabled is skipped by faction pulls but freely generated by the main catalog roll.
- Fix shape: Read the same keys the writer produces: check `${settType}::`, `${resolvedTier}::`, and `all::` prefixes (mirror factionCorrelation's tolerant reader, or better, extract one shared isCategoryEnabled used by both call sites — single-writer/single-reader discipline).
- Verdict: _pending Opus verification_

**[generators-pipeline-5] MEDIUM / confirmed — The 24 metropolis-only catalog institutions are invisible to every UI catalog lookup — the generator's metropolis force path is unreachable**
- Where: `src/generators/lookups.js:40` | Category: correctness
- Evidence: lookups.js:37 `if (tier === 'metropolis') return institutionalCatalog['city']`; :40 `const tierOrder = ['thorp','hamlet','village','town','city']` ('all' merge); :61 same list in getFullCatalogWithTierMeta. institutionalCatalog.metropolis (line 2126) holds 24 unique entries (Academy of magic, Great cathedral, Assassins' guild, Banking district, Underground city, ...). assembleInstitutions.js:359-362 deliberately includes metropolis in fullCatalogAllTiers ('its catalog entries were unreachable for forced out-of-tier overrides').
- Why: InstitutionalGrid renders from these lookups (selectors.js:69-71), so no user can view, require, or force-exclude any metropolis-only institution — at ANY tier, including metropolis itself. The pipeline-side fix that made metropolis institutions force-able out-of-tier is dead capability: the toggles it consumes cannot be authored. Metropolis dossiers still get them via mergeCatalogs at generation, but the DM has no control surface over the most distinctive top-tier content.
- Fix shape: Add 'metropolis' to both merge lists in lookups.js (and make getInstitutionalCatalog('metropolis') return the city+metropolis merge, mirroring assembleInstitutions.mergeCatalogs). Guard with a walker test asserting every catalog tier key is reachable from the lookup functions (inventory-ratchet).
- Verdict: _pending Opus verification_

**[generators-pipeline-6] MEDIUM / confirmed / KNOWN-DEFERRED — Legitimacy defense patch rewrites label and gov/crim multipliers without re-applying them to faction powers**
- Where: `src/generators/steps/assembleSettlement.js:168` | Category: sim-logic-gap
- Evidence: assembleSettlement.js:168-172 rewrites provLeg.label/govMultiplier/crimMultiplier when the defense-readiness delta moves the score across a band, but nothing re-runs applyLegitimacyMultipliers — powerStructure.factions[].power keeps the values scaled by the PROVISIONAL multipliers from generatePowerStructure.
- Why: A settlement whose patched legitimacy crosses a band (e.g. Tolerated→Contested: gov ×1.00→×0.80, crim ×1.00→×1.15) displays multipliers that contradict the faction power shares beside them; governing-faction dominance narratives baked from the provisional ranking can contradict the final label. This is REVIEW_FINDINGS §08 (assembleSettlement.js:110), still present; the tier-scaling half of that finding WAS fixed (DEFENSE_CONTRIB × legitimacyDefScale now applied), so the ledger entry is half-remediated and the remaining half is undocumented — it reads as dropped, not deferred.
- Fix shape: Either re-run the faction renormalization with the patched multipliers at assembly (bold: move the defense-readiness derivation before generatePower so legitimacy is computed once from real readiness), or explicitly record the one-iteration damping as by-design next to the patch and stop rewriting the multiplier fields (labels only). Either way, write the decision down.
- Verdict: _pending Opus verification_

**[generators-pipeline-7] MEDIUM / confirmed — Terrain is never rolled for explicit trade routes — 'auto' terrain + chosen route silently locks terrain to a fixed mapping**
- Where: `src/generators/steps/resolveConfig.js:95` | Category: sim-logic-gap
- Evidence: resolveConfig.js:95 `const doRandomTerrain = randomTerrain && config.tradeRouteAccess === 'random_trade';` — the TERRAIN_WEIGHTS roll only fires when the trade route is ALSO random; otherwise terrainType = getTerrainType(tradeRoute, null), a fixed map (road→plains, isolated→forest, river→riverside...).
- Why: A user who picks route='road' and leaves terrain on 'auto' can only ever get a plains settlement — hills, forest, mountain, desert road-towns are unreachable without an explicit terrain override, even though TERRAIN_ROUTE_POOLS shows road is a valid route for every terrain. This flattens variety exactly where most users sit (default terrain, chosen route), and the trace layer records no decision for it (the terrain receipt only fires on the rolled path), so the lock is invisible.
- Fix shape: If intended, document it and emit a 'terrain derived from route' trace so the receipt exists. If not: roll terrain from a route-conditioned pool for explicit routes too (invert TERRAIN_ROUTE_POOLS), gated on a config flag to preserve same-seed goldens (dormancy: absent flag ⇒ prior bytes).
- Verdict: _pending Opus verification_

**[generators-pipeline-8] LOW / confirmed — Port-infrastructure suggestion self-defeats on 'port' substring — the exact trap PORT_INFRA_RE was built to prevent**
- Where: `src/generators/structuralValidator.js:661` | Category: correctness
- Evidence: structuralValidator.js:661 `if (route === 'port' && !inExp('Dock') && !inExp('port') && !inExp('harbour'))` where inExp is substring-includes — 'Tele**port**ation circle' and 'Barge and river trans**port** company' both contain 'port'. priorityHelpers.js:27 comments the same hazard: word-bounded PORT_INFRA_RE so "'Teleportation circle' never read as harbours".
- Why: A port-route settlement whose only 'port'-matching institution is a teleportation circle or transport company never gets the 'Docks/port facilities' suggestion — the coherence layer misses the one case it was written for. Same class risk on line 625's inExp('Garrison') family.
- Fix shape: Reuse PORT_INFRA_RE from priorityHelpers (word-bounded) for this check instead of bare substring — single source for the port predicate.
- Verdict: _pending Opus verification_

**[generators-pipeline-9] LOW / confirmed — Nit batch: dead vocabulary, dead helpers, and contract-declaration drift**
- Where: `src/generators/structuralValidator.js:154` | Category: dead-code
- Evidence: (a) structuralValidator.js:154 `_getPriorityModifiers` and :179 `_getTierConstraints` are module-local and never called; :755-768 is a dangling getBaseChance JSDoc with no function (re-exported at :8). (b) subsumptionPass.js:40 greater 'major port' matches no catalog name (verified by script) — the Major-port vocabulary in SPATIAL_FEATURES:110, hasNavy (priorityHelpers.js:56), and spatialData GATE_FEATURES can only ever fire on custom/DM-authored institutions. (c) priorityHelpers.js:116 keyword 'dream parlors' (plural) never matches catalog 'Dream parlor'. (d) stepMetadata.js:83 isolationPass description ('a smith with no fuel becomes a husk') describes a mechanic the step doesn't perform (it does teleport-infra + subsistence stripping). (e) corruptionPass.js:46 declares mutates:['factions'] but never touches factions. (f) economyReconcilePass.js:81 declares reads:['economicState'] while consuming tier/institutions/tradeRoute/effectiveConfig/servicesToggles/powerStructure — incomplete reads declarations quietly weaken the dataFlowContract test's coverage. (g) assembleInstitutions.js:374-399 out-of-tier force pass ignores the toggle key's tier prefix, so a require toggle authored while viewing another tier leaks into every tier's generation as an out-of-tier override. (h) assembleInstitutions.js:250-258 duplicated exclusive-group block is unreachable-redundant after the block above it.
- Why: Individually cosmetic, but (b)+(c) are silent mechanic drift (rules that read as live but can never fire from generation), (f)+(g) erode the two contracts (data-flow strictness, per-tier toggle scoping) this pipeline's architecture is built on.
- Fix shape: One hygiene wave: delete dead helpers + dangling doc; fix 'dream parlors' → 'dream parlor'; either add 'Major port' to the city/metropolis catalog or annotate the vocabulary as custom-content-only; complete the reads declarations (the dataFlowContract test then verifies them); scope the out-of-tier pass to `${tier}::` and `all::` prefixes; correct the isolationPass rail description.
- Verdict: _pending Opus verification_


### Slice: components-dossier (grade A-)

**[components-dossier-1] HIGH / confirmed — Image-backdrop drag-drop placement is silently dead: MapOverlay prop contract broken**
- Where: `src/components/map/WorldMapStage.jsx:174` | Category: correctness
- Evidence: WorldMapStage: `<MapOverlay bridge={imageMode ? null : bridgeRef.current} onTransform={onOverlayTransform} />` but MapOverlay.jsx:37 declares `function MapOverlay({ bridge, transformOut })` and :116 does `if (transformOut) transformOut.current = transformRef.current`. WorldMap.jsx:393-394: `const t = overlayTransformRef.current; if (!container || !t || !t.scale) return;`
- Why: Two mismatches (prop name `onTransform` vs `transformOut`; callback vs ref object) mean overlayTransformRef in WorldMap is never written. In custom-image-backdrop mode (Project 1, premium), the drop handler's inverse projection guard always fails, so dragging a settlement onto an imported map does nothing — no placement, no toast, no error. FMG mode is unaffected (drops go through the bridge).
- Fix shape: Align the contract: have WorldMapStage pass `transformOut={...}` and pass the ref itself from WorldMap (or keep the callback and call `onTransform(transformRef.current)` inside MapOverlay). Add a smoke test that mounts MapOverlay in image mode and asserts the parent-visible transform is populated after the fit effect.
- Verdict: _pending Opus verification_

**[components-dossier-2] HIGH / confirmed — World-Laws dialog contradicts the built spatial engine: Distance/Travel axes claim 'Arrives with the map engine' after the map engine shipped**
- Where: `src/components/map/SimulationRulesAxes.jsx:53` | Category: sim-legibility
- Evidence: AXES spatialMode options: `['ignore','Ignore distance','Every settlement is a neighbour.',true]` with abstract/mapped/full all `false` — 'Arrives with the map engine.'; travelMode locked to `['instant',...,true]`; axisValue():91-93 hard-returns `'ignore'`/`'instant'`.
- Why: The keystone→M11 ladder is BUILT: a canonized realm routes trade/armies over the frozen distance matrix, hopWeeks delays news and caravans, winter roads and sea lanes reprice routes. Yet the DM's canonical mental-model surface — the world-laws dialog — shows 'Ignore distance / Instant travel' as the selected truth on a mapped realm and tells them the shipped capability doesn't exist. This directly defeats the slice's legibility mission ('the UI must surface the engine depth') and undercuts the 'this one simulates' thesis at the exact surface a curious DM inspects.
- Fix shape: Make axisValue derive Distance/Travel from the real gates (worldState.spatialCanonVersion ⇒ 'mapped'; hopWeeks live ⇒ 'standard'), render them as engine-derived read-only facts ('mapped — frozen at canonize v2') rather than locked stubs, and rewrite the rungs' copy. Also unlock the infoMode 'full' chip (see companion finding). Pure display; no engine or golden bytes move.
- Verdict: _pending Opus verification_

**[components-dossier-3] HIGH / confirmed — routineMajorApproval has no writer anywhere: the M10a actor-major approval queue can never fire from the product**
- Where: `src/domain/worldPulse/simulationRules.js:240` | Category: sim-logic-gap
- Evidence: Repo-wide grep for `routineMajorApproval` finds only reads: WorldPulsePanel.jsx:65, actorMajorApproval.js:75-76, changeAuthorityPolicy.js:316-322. No preset sets it — living_realm (simulationRules.js:240-247) carries only `politicalAutonomy:'routine'`; SimulationRulesDialog/Axes expose no control.
- Why: M10a built the CL-3 approval queue (war declarations and coups wait for the DM, hold-then-expire) gated behind this opt-in — and then nothing in any preset, dialog, or store action ever sets it. The Living Realm preset card promises 'Routine life runs itself; the major turns still ask you first' (SimulationRulesDialog GRID_PRESETS:79), but under routine-without-opt-in, actor-initiated majors (exactly war declarations and coups — the most campaign-altering turns) auto-mint inline without asking. WorldPulsePanel even carries dead copy for the enabled state (:70-71). A shipped mechanic that can never fire, plus preset copy that overpromises.
- Fix shape: Light the opt-in: set routineMajorApproval:true on the living_realm preset (verify against CL-0/siege pins — the M10a gate was designed for exactly this) or add a 'Who decides' sub-toggle in the rules dialog; align the routine-axis and preset copy with whichever behavior ships. This is the M10a feature's missing last mile, not new capability.
- Verdict: _pending Opus verification_

**[components-dossier-4] HIGH / confirmed — M10b living/autonomous catch-up is invisible and silently fallible — no 'while you were away' surface**
- Where: `src/components/map/WorldPulsePanel.jsx:49` | Category: ux
- Evidence: `Promise.resolve(catchUpCampaignWorld(campaignId)).catch(() => {});` — fire-and-forget, no busy state, no result surfaced. ChronicleScrollback.jsx:54-56: IntervalChronicleSummary bails `if (weeks <= 1) return null` — catch-up runs N separate one_week advances, so no interval summary ever composes for it.
- Why: The headline M10b promise is 'the world moves while you're away.' The only trigger is a silent useEffect: the DM opens the panel, the tick is suddenly +N, and nothing says what happened, that a catch-up ran, or that it failed (failure is swallowed and indistinguishable from no-catch-up-owed). The chronicle's existing composed-interval summary machinery (advanceInterval.js:103-141) is bypassed because catch-up loops single-week advances. For the sim's single most autonomous behavior, there is zero legibility: no digest, no toast, no loading state during up to 26 kernel ticks.
- Fix shape: Surface the catch-up: a 'While you were away — N weeks passed' banner in WorldPulsePanel fed by the catch-up result (count + major headlines via the existing buildChronicleGrounding lookback), a busy indicator while it runs, and an error note on failure. Lazy display-only; zero engine bytes.
- Verdict: _pending Opus verification_

**[components-dossier-5] MEDIUM / probable — pipelineHistory survives hydrateFromSave — the 'How this was simulated' receipt can show the wrong settlement's decisions**
- Where: `src/store/settlementSlice.js:1760` | Category: lifecycle
- Evidence: hydrateFromSave (:1760-1814) resets settlement, phase, eventLog, pendingEditsQueue, pendingSuccession, generationId ('opening save B never inherits save A's in-flight state') — but never touches pipelineHistory; its only writers are the initial [] (:317) and generate() (:772-860). PipelineRail.jsx:226-230 reads the global `s.pipelineHistory` + `s.settlement`.
- Why: The pipeline rail is the trust surface built to answer 'is this AI just inventing things?' with per-run receipts. After generating town A and then opening saved town B (hydrateFromSave swaps s.settlement to B), the SimulationDrawer/rail renders A's step summaries ('what each step decided on this run') against B's dossier and spine — a cross-identity leak of exactly the class the hydrate comment says it swept.
- Fix shape: Add `state.pipelineHistory = []` (and pipelineRevealActive false) to hydrateFromSave's session-state sweep; optionally persist a save's own pipeline summaries so a reopened save shows its true receipt instead of nothing.
- Verdict: _pending Opus verification_

**[components-dossier-6] MEDIUM / confirmed — RealmInspector's `advancing` prop is ignored by WorldPulsePanel — no in-panel signal during a running advance**
- Where: `src/components/map/RealmInspector.jsx:283` | Category: dead-code
- Evidence: `<WorldPulsePanel campaign={campaign} advancing={advancing} />` vs WorldPulsePanel.jsx:25 `export default function WorldPulsePanel({ campaign })` — the prop is never destructured or read.
- Why: The container threads live advance-session state (`advanceSession.phase === 'running'`) specifically so the pulse panel can show the world is mid-advance; the panel silently drops it. During a multi-tick advance the panel shows the stale prior tick with no indication anything is happening — the same illegibility class as the M10b catch-up.
- Fix shape: Consume the prop: a slim 'Advancing the realm…' banner (and optionally disable proposal actions) when advancing is true. One conditional block.
- Verdict: _pending Opus verification_

**[components-dossier-7] MEDIUM / confirmed — ChronicleScrollback's per-tick causal diff can never render: causalByTick has no supplier**
- Where: `src/components/map/ChronicleScrollback.jsx:165` | Category: dead-code
- Evidence: `export default function ChronicleScrollback({ campaign, nameFor, causalByTick })` — repo grep shows the only caller is RealmInspector.jsx:351 `<ChronicleScrollback campaign={campaign} nameFor={nameFor} />`; no code constructs a causalByTick Map.
- Why: The 'Causal shift this tick' block (tickCausalDiff over before/after snapshots, :306-318) is a designed legibility feature — per-variable ▲/▼ with polarity and explanations — that is dark because no advance path captures or threads the snapshots. Given the product thesis is causal legibility, a built-and-dead causality view is a real loss, not just hygiene.
- Fix shape: Either wire it (capture compareCausalState before/after snapshots per tick in the advance session and thread the Map from RealmInspector) or excise the prop + block and record the deferral. Wiring is the bold option and stays display-side.
- Verdict: _pending Opus verification_

**[components-dossier-8] MEDIUM / confirmed — OutputContainer rebuilds the chronicle feed and tab-group map on every render**
- Where: `src/components/OutputContainer.jsx:274` | Category: perf
- Evidence: `const chronicle = collectChronicle(liveSaveEntry, rawSettlement, publicChronicle);` — unmemoized call to buildChronicleFeed (merge + normalize + sort of 4 event sources, limit 60) in the component body; `const tabToGroup = (() => {...})()` (:446-452) likewise re-allocates per render.
- Why: OutputContainer subscribes to high-churn store fields (aiProgress strings during narration, savedSettlements, aiLoading), so it re-renders frequently; each render re-merges and re-sorts the full chronicle feed even when nothing in its inputs changed. This is the dossier hot path named in the slice focus.
- Fix shape: `useMemo(() => collectChronicle(liveSaveEntry, rawSettlement, publicChronicle), [liveSaveEntry?.campaignState, rawSettlement, publicChronicle])` and hoist tabToGroup to module scope (TAB_GROUPS is frozen). Mechanical.
- Verdict: _pending Opus verification_

**[components-dossier-9] MEDIUM / confirmed — PipelineRail nests block content and lists inside a <button>, making the expanded trace one giant control**
- Where: `src/components/PipelineRail.jsx:81` | Category: a11y
- Evidence: The row `<button type="button" onClick={() => setOpen(...)}>` wraps not just the label but the expanded description AND the structured trace blocks including `<ul style={{...listStyle:'square'}}>` (:118-169) when open.
- Why: Interactive content nested in a button is invalid HTML content-model; assistive tech reads the entire expanded trace (targets, causes, downstream effects) as the button's accessible name, and users can't select/copy the receipt text — on the surface whose whole purpose is falsifiable receipts. This slice otherwise has exemplary a11y (roving-tabindex tab strip, focus traps), so this is an outlier.
- Fix shape: Keep only the label row inside the button (aria-expanded + aria-controls) and render description/traces as a sibling region referenced by id — the DossierTabStrip pattern already in-house.
- Verdict: _pending Opus verification_

**[components-dossier-10] MEDIUM / confirmed — Bespoke modals (StaleNarrativeModal, ChroniclePanel full-entry, TableView) skip the house focus-trap primitive**
- Where: `src/components/StaleNarrativeModal.jsx:47` | Category: a11y
- Evidence: StaleNarrativeModal backdrop: `role="button" tabIndex={0}` wrapping a `role="dialog" aria-modal="true"` with no useDialogFocusTrap; ChroniclePanel.jsx:119-137 uses two nested role="button" divs and no dialog role at all; TableView.jsx:68-73 has role=dialog+Esc but no trap/restore.
- Why: The house primitive useDialogFocusTrap (used by SessionMode, Dialog.jsx) delivers focus-in, Tab trapping, Esc, and focus-restore; these three modals hand-roll partial versions. Focus can Tab out into the dimmed page behind aria-modal (a WCAG 2.4.3 failure), and ChroniclePanel's viewer isn't announced as a dialog. Also, WorldMap's keymap guard looks for [role=dialog][aria-modal] — ChroniclePanel's modal doesn't match the convention.
- Fix shape: Adopt useDialogFocusTrap + role=dialog/aria-modal in all three; delete the role=button backdrop hacks (backdrop click can stay as a plain onClick with the trap owning keys).
- Verdict: _pending Opus verification_

**[components-dossier-11] LOW / confirmed — OutputContainer 'simulation' tab is unreachable dead code with a stale narrative comment**
- Where: `src/components/OutputContainer.jsx:377` | Category: dead-code
- Evidence: `const baseTabs = TABS.filter(t => { if (t.id === 'simulation') return false; ... })` — unconditional; yet TABS:109 still declares the tab ('Now it lives as the last tab so the dossier itself is the default landing surface') and renderTab:612-616 keeps the case.
- Why: The SimulationDrawer (P135/D-5) replaced the tab, but the declaration, the render case, and the comment describing it as live all remain — three artifacts a maintainer must disprove before trusting the tab model. The drawer is also `!readOnly`-only, so saved/read-only dossiers have NO simulation-receipt surface at all, which the dead tab masks.
- Fix shape: Delete the TABS entry, the renderTab case, and the stale comment; separately decide whether the read-only saved view should get the drawer trigger (it currently loses the trust surface entirely).
- Verdict: _pending Opus verification_

**[components-dossier-12] LOW / confirmed — SettlementDetail carries ~95 lines of dead, underscore-prefixed duplicates of live domain logic**
- Where: `src/components/SettlementDetail.jsx:94` | Category: dead-code
- Evidence: `function _migrateConfig`, `_buildInterSettlementNPCs` (with full NPC_PAIR_CATS + CONTACT_DESC tables, :107-177), `_findSaveByName`, `_findSaveById` — all unreferenced; the live versions live in domain/relationships/neighbourBackLink.js and components/settlements/helpers.js.
- Why: The dead copy of buildInterSettlementNPCs is a full parallel implementation of relationship-NPC pairing — the classic two-writers drift hazard: a future fix applied to the wrong copy silently does nothing. The underscore prefix shows the deadness is known but the bodies were kept.
- Fix shape: Delete the four dead helpers + their tables; the file drops below 640 lines and one pairing implementation remains.
- Verdict: _pending Opus verification_

**[components-dossier-13] LOW / confirmed — Nit batch: small polish items**
- Where: `src/components/WorldMap.jsx:757` | Category: polish
- Evidence: (1) WorldMap.jsx:730/757 keymap comment says 'P (place)' but binds 'p' to MAP_MODES.VIEW. (2) DossierTabStrip role=tab lacks aria-controls and the content pane lacks role=tabpanel. (3) MapLegend.jsx:121 chevron shows ChevronUp when closed though content expands downward from the button within a bottom-anchored box. (4) OutputContainer.jsx:198 gates the Rumors tab on saveId only while RumorsTab itself falls back to settlement.id — a store-loaded unsaved settlement in a campaign would render the tab's data but never see the tab. (5) WizardNewsPanel.jsx:355 generateChronicle lacks try/finally around the awaited call (safe today because requestCampaignChronicle never rejects, but the busy-flag depends on that contract).
- Why: Individually trivial; collectively they are the residual friction in an otherwise disciplined surface.
- Fix shape: One small cleanup pass; none touch engine bytes.
- Verdict: _pending Opus verification_


### Slice: generators-domain (grade B+)

**[generators-domain-1] HIGH / confirmed — Five newer stress types are half-integrated: contradictory arrival scenes, no NPC secrets/weights, dead tension mappings, uncoupled probability**
- Where: `src/generators/narrativeGenerator.js:192` | Category: sim-logic-gap
- Evidence: STRESS_DESCS keys end at monster_pressure (lines 192-293; no insurgency/mass_migration/wartime/religious_conversion/slave_revolt), so generateArrivalScene:1039 falls to the generic route scene. STRESS_TO_TENSION (historyGenerator.js:611-615) maps 4 of the 5 to 'legitimacy_crisis'/'demographic_pressure' — grep of src/data/historyData.js shows neither type exists, so find() returns undefined and no tension is added (trade_partner's 'trade_dispute' likewise). STRESS_INSTITUTION_EFFECTS keys (data/stressTypes.js, python-extracted): only the original 10 — generateCrimeLevel emits no stress-driven secret for them; same 10-key gap in computeNPCWeights STRESS_BOOSTS (npcGenerator.js:130-141), STRESS_SECRET_BOOSTS (:461-472), STRESS_MANDATORY_ROLES (:1522-1533), STRESS_TO_CATEGORY (:516-527), history event-weight STRESS_BOOSTS (historyGenerator.js:260-271), STRESS_SEVERITY_WEIGHT (stressGenerator.js:196-207), STRESS_FLAVOR (settlementNarrative.js:10-21). buildStressContext (stressGenerator.js:82-191) has no modifier block for any of the 5 — slave_revolt (probability 0.012) rolls with zero coupling to slave-trade presence.
- Why: A DM opening a slave-revolt or wartime settlement sees an ordinary market-day arrival paragraph directly above a safety label reading 'Dangerous — Slave Revolt'; NPC populations, secrets, and history timelines do not reshape around 5 of the 15 crisis types the engine can roll, while faction rosters and safety profiles DO — a visible half-simulation for one-third of the stress vocabulary, in direct tension with 'this one simulates'.
- Fix shape: One integration wave per table: author 4 STRESS_DESCS vignettes per new type (patterns already exist), add the 5 to the seven NPC/history/severity weight tables, add real tension templates for legitimacy_crisis/demographic_pressure/trade_dispute (or remap to existing types), and give buildStressContext coupling blocks (slave_revolt gated/boosted by slave-trade economy or slave-market institutions, wartime by hostile neighbour, insurgency by low legitimacy inputs, mass_migration by route). Consider a structural-prevention walker test asserting every STRESS_TYPE_MAP key appears in each stress-consuming table.
- Verdict: _pending Opus verification_

**[generators-domain-2] HIGH / confirmed — Structural placeholder NPCs ('The Watch Captain', 'The High Priestess') duplicate fully-realized seat-holders and render as empty cards**
- Where: `src/generators/factionRoles.js:144` | Category: immersion
- Evidence: Probe (plain town, seed dup-probe-1): roster contains both 'Volker Krüger | role=Guard Captain | fac=Military/Guard' AND 'The Watch Captain | gen=faction_structural | fac=-'; 'Katharina Wirth | High Priest' AND 'The High Priestess'; high-crime city adds 'The Guildmaster', 'The Senior Trader', 'The Archmagister' beside a named Guild Master and Tower Wizard. Dedup at :144 `normalizeRoleKey(npc.role) === normalizeRoleKey(proposed.role)` only matches exact roles — 'Watch Captain'≠'Guard Captain', 'High Priestess'≠'High Priest', 'Kingpin'≠'Crime Lord'. NPCsTab.jsx renders all npcs with no generatedAs filter; placeholders carry no personality/goal/secret and category undefined.
- Why: Nearly every settlement's key-figures tab shows one or more literally-named 'The <Role>' entities with blank personality/secret sections next to a flavored NPC holding the same seat — two heads for one office. The prior review's dedup fix (byAffiliation) closed only the exact-role case; this is the visible remainder.
- Fix shape: Bold option: make the structural pass a RESOLVER not a generator — map each archetype seat to an existing NPC via a role-synonym table (Watch Captain≈Guard Captain/Garrison Commander/City Watch Chief; High Priestess≈High Priest/Parish Priest; Kingpin≈Crime Lord/Thieves' Guild Master; Lord Mayor≈Mayor/Governor), stamping importance/linkage onto the matched NPC, and only synthesize (with a real generated name + personality via generateSingleNPC) when no NPC covers the seat.
- Verdict: _pending Opus verification_

**[generators-domain-3] HIGH / confirmed — NPC section-regen skips the entire coherence enrichment layer — rerolled NPCs lose faction affiliation, secrets overlay, and structural positions**
- Where: `src/generators/generateSettlementPipeline.js:106` | Category: lifecycle
- Evidence: regenNPCsPipeline returns raw generateNPCs/generateRelationships/generateFactions output; settlementSlice.js:1000-1001 `const parts = eng.regenNPCsPipeline(settlement, cfg); set(s => { Object.assign(s.settlement, parts); })`. factionAffiliation/secondaryAffiliation/stress goal overrides (mergeNPCLists), crime-level secrets + presentation variants (buildPoliticalNarrative), and structuralPosition/activeConstraint (enrichNPCsWithStructure) are applied only inside generateCoherence, which runs only in assembleSettlement.
- Why: After 'Reroll NPCs', every NPC ghosts its faction chip, its criminal secondary affiliation, its settlement-condition goal, and its structural-position card — the regen path writes a structurally different (poorer) shape than the generation path, the repo's most-bitten lifecycle bug class; the corrupt-guard coherence the moat promises silently vanishes on reroll.
- Fix shape: Have regenNPCsPipeline run the same tail as assembly: after generating npcs/relationships, call buildPoliticalNarrative + mergeNPCLists + enrichNPCsWithStructure against the live settlement (all pure, all already importable), or extract generateCoherence's NPC-enrichment sub-pass and invoke it from both paths; pin with a test asserting a regen'd roster carries factionAffiliation and structuralPosition like a generated one.
- Verdict: _pending Opus verification_

**[generators-domain-4] MEDIUM / confirmed — Two parallel food models (foodSecurity vs viability foodBalance) compute the same deficit with divergent rules and can contradict each other**
- Where: `src/generators/foodGenerator.js:159` | Category: cross-generator-consistency
- Evidence: generateFoodSecurity applies seeded jitter `const cropFortune = _cropRng ? 1 + (_cropRng.random()*2-1)*0.08 : 1` (:158-161) and ignores custom food content; deriveFoodBalanceAnalysis (foodBalance.js:88-121) applies customDeps.foodImpactTally and a magic agriMod boost but no jitter. Same constants, different production numbers.
- Why: The Economics tab's foodSecurity label and the Viability tab's foodBalance deficit are computed twice with different modifiers — near thresholds one can read 'Secure' while the other emits a 'Food Import Requirement' dependency, an in-dossier contradiction a DM will notice; custom food content shifts one model but not the other.
- Fix shape: Single-writer: make generateFoodSecurity the one food engine, derive viability's foodBalance numbers from its output (or pass its dailyProduction/dailyNeed through), and move customDeps + magic-boost + cropFortune into that one path; a parity test pins label-vs-warning agreement.
- Verdict: _pending Opus verification_

**[generators-domain-5] MEDIUM / confirmed — Magic agriculture boost keys off the raw settType sentinel — dead on the default 'random' generation path**
- Where: `src/generators/economy/foodBalance.js:63` | Category: correctness
- Evidence: `const isMagicHighTier = magPriority > 75 && ['town','city','metropolis'].includes(config?.settType || '');` — DEFAULT_CONFIG.settType is 'random'; the resolved tier lives in config.tier (which line 154 correctly prefers: `config?.tier || config?.settType`).
- Why: The +0.3 magical-agriculture production boost (grow spells, blessed fields) never applies on the app's default random-rolled settlements even at magic 80+ with druid/wizard institutions, but does apply when the user explicitly picks 'town' — the same-config-different-sentinel inconsistency class the prior review fixed in institutionProbability.
- Fix shape: Read `config?.tier || config?.settType` like the sibling check at :154; add the tier-sentinel lint/walker the repo already uses for this class.
- Verdict: _pending Opus verification_

**[generators-domain-6] MEDIUM / confirmed — Timeline variety collapse: one fixed template per event category caps every settlement at the same ~8 event names; metropolis 20-event budget unreachable**
- Where: `src/generators/historyGenerator.js:819` | Category: immersion
- Evidence: `const tmpl = HISTORICAL_EVENTS_DATA.find(e => { const typeMap = { economic: ['economic_disparity','outside_debt','resource_scarcity','guild_conflict'], ... }` — find() always returns the first catalog match per category, usedCats/usedNames then forbid repeats, so ≤1 event per category (8 categories) + 1 resource event.
- Why: Every settlement's historical timeline is drawn from the same ≤8 template names regardless of tier; outside_debt/resource_scarcity/guild_conflict literally never appear as timeline events; the metropolis eventCount cap of 20 (:783) is unreachable — history reads same-y across a campaign, weakening the 'simulated past' moat. (Old LOW finding, un-retriaged, still live.)
- Fix shape: Weighted-pick among ALL catalog templates matching the category (the typeMap lists already enumerate them) instead of find(), keep usedNames dedup; let categories repeat once the roster is exhausted for city+ tiers.
- Verdict: _pending Opus verification_

**[generators-domain-7] MEDIUM / confirmed — inferFactionCategory keyword order misclassifies political blocs as 'economy' ('Bloc' shadows 'Noble')**
- Where: `src/generators/power/factionCategories.js:63` | Category: cross-generator-consistency
- Evidence: economy keywords include 'Bloc' and are checked before noble, so 'Loyalist Noble Bloc', 'Reform Noble Bloc', 'Claimant Bloc A/B', 'Third Bloc (Neutrals)' → category 'economy', while the parallel 'Noble Claimant (Senior Line)' → 'noble'.
- Why: Category drives demand imports (a noble succession bloc requests merchant-class goods), NPC-faction compatibility (economy NPCs join the noble bloc), faction boosts, and archetype detection — the politically_fractured/succession_void stress factions systematically land in the wrong category depending on which naming branch minted them.
- Fix shape: Order specificity-first (noble before economy) or drop 'Bloc' from the economy list and add explicit entries ('Claimant','Loyalist','Reform Bloc') to government/noble; pin with a table test over every faction name the stress injector can mint.
- Verdict: _pending Opus verification_

**[generators-domain-8] LOW / confirmed — buildHistoricalEvent reads economicViability.stability — a field the viability report never carries (dead succession-tension branch)**
- Where: `src/generators/historyGenerator.js:660` | Category: dead-code
- Evidence: `if (economicViability.stability === 'Unstable' && !usedTypes.has('succession_crisis'))` — generateEconomicViability returns {viable, issues, warnings, dependencies, suggestions, plotHooks, summary, metrics} (viability.js:563-578); stability lives on powerStructure.
- Why: The intended 'unstable settlements grow succession-crisis tensions' coupling never fires from this path (only the succession_void stress mapping reaches it), silently thinning tension variety for unstable-but-unstressed settlements.
- Fix shape: Thread powerStructure.stability (already a parameter's sibling — factions are passed) and branch on the label head like aiLayer's isOrderedStability.
- Verdict: _pending Opus verification_

**[generators-domain-9] LOW / confirmed — Military strategic-resource vulnerability note is dead: filters gaps on .rawResource but gap objects carry .chain**
- Where: `src/generators/resourceGenerator.js:360` | Category: dead-code
- Evidence: `const strategicGaps = (gaps || []).filter(g => ['iron ore','timber','stone'].some(kw => g.rawResource?.toLowerCase().includes(kw)))` — evaluateInstitutionChain pushes `{ chain: chain.rawResource, missing, impact, severity }` (:235-268), never a rawResource field.
- Why: High-military settlements never receive the 'iron/timber/stone processing incomplete — strategic vulnerability' priority note, one of the few military↔resource couplings in the resource analysis.
- Fix shape: Filter on g.chain and interpolate strategicGaps[0].chain; add the missing-field read to whatever field-contract test guards this class.
- Verdict: _pending Opus verification_

**[generators-domain-10] LOW / confirmed — demandProfile governing-faction conditional is a tautology — non-governing 'government' factions get no distinct demand treatment**
- Where: `src/generators/demandProfile.js:175` | Category: dead-code
- Evidence: `const cat = (faction.category === 'government' && !faction.isGoverning) ? 'government' : faction.category || 'government';` — both branches yield the same value whenever category is set.
- Why: The condition's shape implies an intended distinction (an out-of-power government faction demanding different goods than the seated one) that was never implemented; today it is pure dead logic in the culture-demand seam.
- Fix shape: Either delete the conditional or implement the intent (e.g. non-governing government blocs draw from a 'court-in-exile' pool or fall to noble demand).
- Verdict: _pending Opus verification_

**[generators-domain-11] LOW / confirmed — Nit batch: stale comment, typo in DM-visible prose, toggle-vocabulary remnant, minor dead reads**
- Where: `src/generators/npcStructure.js:273` | Category: polish
- Evidence: npcStructure.js:273 'demonstiting threat' (renders in the criminal/governance_fractured subordinate structuralPosition); priorityHelpers.js:583-585 trailing 'NPC secret tables' section comment with no data following (tables live in data/stressTypes via helpers re-export); tradeGoods.js getGoodsModifiers:164 treats an {allow:false} toggle object as truthy 'on' (legacy boolean vocabulary — defanged downstream by the chain override + final toggle filters but still a latent trap); serviceAvailability.js:8 `getPriorities(settlement)` result discarded + param receives config not settlement; generateEventNarrative (historyGenerator.js:505) String.replace substitutes only the first occurrence of a repeated token; settlementNarrative STRESS_RUMORS[2] renders 'There is a rival between X and Y'; stressFactions.js:172-175 et al. de-minified dead expressions `(factions.find(f=>f.isGoverning)||{}).faction,` computed and discarded.
- Why: Individually cosmetic; the typo and rumor grammar are user-visible prose, the toggle remnant is a latent correctness trap if the chain-override ordering ever changes.
- Fix shape: One hygiene commit: fix typo/grammar, delete stale comment and dead expressions, normalize toggle reads through one accessor that understands both boolean and {allow,force} shapes.
- Verdict: _pending Opus verification_


### Slice: data-tables (grade A-)

**[data-tables-1] HIGH / confirmed — Fuzzy service-name join gives the most common small-settlement governments absurd service menus (elder → druidic consultation, village elder → music lessons)**
- Where: `src/generators/services/institutionServices.js:82` | Category: correctness
- Evidence: Live-engine probe (seeded): getServicesForInstitution('Household elder','thorp') → ["Nature arbitration","Druidic consultation"] (resolved key 'Elder Grove Council'); 'Village elder'/'Village headman' → ["Music and entertainment"] (key 'Village musician'); 'City administration' → ["Grain storage"] (key 'City granaries'). These governments are the highest-baseChance picks at their tiers (institutionalCatalog.js:33 'Household elder' 0.9; :787 'Village elder' 0.95; :1755 'City administration' 0.92).
- Why: The token-overlap fallback matcher (institutionServices.js:66-96) resolves any government institution lacking a dedicated INSTITUTION_SERVICES entry to whatever key shares one token, so nearly every thorp/village dossier's anchor institution advertises services that contradict its own description — a farmer-elder offering 'Druidic consultation: advise city authorities on ecological matters' (p 0.9) is register-breaking on the product's most common output. tests/joins/services.test.js pins the precedence order but not these resolutions.
- Fix shape: Author dedicated INSTITUTION_SERVICES entries (or LOCALE_SERVICE_OVERRIDES rows, the documented mechanism at servicesData.js:15) for every catalog government institution — Household elder, Village headman, Village elder, Town council, City administration — with civic-register services (dispute mediation, communal decisions, record of custom). Then add a pin in tests/joins/services.test.js asserting every catalog institution resolves either exactly, via locale table, or to a same-grouping key, so a new catalog entry can never fuzzy-land on a wrong-register service set again (structural prevention, matches the house pattern).
- Verdict: _pending Opus verification_

**[data-tables-2] MEDIUM / confirmed — 16 terrain institution-boost modifiers are dead — the names match no catalog institution under the runtime substring rule, silently weakening terrain→economy flavor coupling**
- Where: `src/data/geographyData.js:459` | Category: sim-logic-gap
- Evidence: Programmatic check against the exact matcher (assembleInstitutions.js:88 `mod.name && name.includes(mod.name.toLowerCase())`): plains 'Livestock market' x2, "Weavers' guild" x1.5, "Tanners' guild" x1.5, 'Cheesemaker' x1.5; forest "Carpenters' guild" x2, "Foresters' guild" x2.5, 'Bowyer/Fletcher' x1.8, 'Herbalist' x1.5; hills "Shepherds' guild" x2, "Stonemasons' guild" x1.5, "Weavers' guild" x1.4; mountain "Stonemasons' guild" x2, "Jewelers' guild" x1.8; desert 'Salt merchant' x2, 'Water merchant' x2, "Jewelers' guild" x1.5 — all match zero catalog names.
- Why: These are the boosts meant to make forest settlements carpenter/bowyer country, hills shepherd country, plains weaver country, deserts salt-trade hubs — exactly the constraint-driven-coherence moat. They roll as ×1.0 no-ops, so terrain flavor rides only on the coarser tag modifiers. The analogous defect in RESOURCE_CHAINS ('granar', 'Salt merchant', 'Cheesemaker') was found and fixed via tag-matching + the F32 pin (tests/joins/resourceChainCatalog.test.js), but TERRAIN_DATA.institutionModifiers was never swept and has no reachability pin.
- Fix shape: Rename the dead patterns to live catalog substrings ('Bowyer/Fletcher'→'Bowyer', 'Herbalist'→'Apothecary', "Weavers' guild"→'Weavers', "Tanners' guild"→'Tanner', 'Cheesemaker'→'Dairy farmer', 'Salt merchant'→'Salt works', "Shepherds' guild"→'Shepherd', "Jewelers' guild"→'Jeweller', drop or re-point 'Livestock market'/'Water merchant'/"Foresters' guild"/"Stonemasons' guild"), and add a reachability pin in tests/data/ mirroring F32: every TERRAIN_DATA institutionModifiers name must match ≥1 catalog name under the runtime rule. NOTE: this legitimately shifts same-seed institution rolls — needs the owner golden-regen protocol, so batch it with the Wave-5 regen.
- Verdict: _pending Opus verification_

**[data-tables-3] MEDIUM / confirmed — The 5 newer stressors have no STRESS_INSTITUTION_EFFECTS entries — wartime/insurgency/plague-adjacent settlements silently lose the stress-driven NPC-secret layer**
- Where: `src/data/stressTypes.js:188` | Category: coverage-gap
- Evidence: STRESS_INSTITUTION_EFFECTS keys = under_siege, famine, occupied, politically_fractured, indebted, recently_betrayed, infiltrated, plague_onset, succession_void, monster_pressure (10 of 15 STRESS_TYPE_MAP keys). Consumer: npcGenerator.js:626 `activeStresses.flatMap(s => STRESS_INSTITUTION_EFFECTS[s] || [])` — insurgency, religious_conversion, slave_revolt, wartime, mass_migration flatMap to [].
- Why: The stress-secret layer is one of the best immersion mechanics in the data (45% of NPCs in a stressed settlement carry a stress-woven secret with stakes); a Wartime or Slave Revolt settlement — the most dramatic stressors — gets generic secrets only. This is the SAME 5-stressor set already known to lack tension templates (REVIEW_FINDINGS historyGenerator.js:639, deferred), revealing a class: the second-wave stressors were added to STRESS_TYPE_MAP without their downstream content rows, and nothing pins per-stressor coverage across the dependent tables.
- Fix shape: Author 5-8 secret/stakes rows each for the 5 missing stressors (the existing rows are a strong style template), and add a coverage pin (tests/data/): every STRESS_TYPE_MAP key must have ≥N STRESS_INSTITUTION_EFFECTS rows — the ratchet that stops a future 16th stressor from shipping content-hollow. Pure additive content, no golden shift (secrets are seeded-roll gated, but adding pool entries changes draw sequence — verify against stress-settlement goldens; if they shift, batch with the regen wave).
- Verdict: _pending Opus verification_

**[data-tables-4] MEDIUM / confirmed — NPC_ROLES is a 324-line byte-identical dead duplicate of NPC_FACTION_GOALS, and three sibling exports are misnamed (SECRETS holds goals, WANTS holds clothing, FACTION_LOYALTY holds situation hooks)**
- Where: `src/data/npcData.js:1251` | Category: dead-code
- Evidence: `export const NPC_ROLES = { Mayor: [...` (npcData.js:1251-1574) duplicates NPC_FACTION_GOALS (:392-715) key-for-key and string-for-string; grep across src/ and tests/ finds zero imports of NPC_ROLES (only two comment mentions in npcGenerator.js:3,40). NPC_WANTS is consumed as `clothes: pickFromArray(NPC_WANTS[r]...)` (npcGenerator.js:281); NPC_SECRETS rows are {short,long,driven_by} goals consumed as the goal fallback (npcGenerator.js:427).
- Why: A 324-line live-looking duplicate of an actively-consumed table is the classic edit-the-wrong-copy hazard — someone tuning a Mayor goal in NPC_ROLES gets silence, not an error, and the misnomers (SECRETS/WANTS/LOYALTY) compound the odds of editing or consuming the wrong table. The file even carries a comment ('Formerly mis-exported as NPC_RELIGION_DATA') showing this naming-drift class has bitten before.
- Fix shape: Delete NPC_ROLES outright (no importers — behavior-inert, byte-identical goldens), and rename the misnomers with re-export shims or a single mechanical rename commit: NPC_SECRETS→NPC_CATEGORY_GOALS, NPC_WANTS→NPC_ATTIRE, NPC_FACTION_LOYALTY→NPC_SITUATION_HOOKS. Add the repo's inventory-ratchet idiom: a test that fails if a data export in src/data has zero src/ importers.
- Verdict: _pending Opus verification_

**[data-tables-5] MEDIUM / confirmed — Duplicate fishing chains: 'fish' and 'fishing' are both mapped from fishing_grounds, so one coastal town displays three near-identical fishing industries including 'River Fishing' with no river**
- Where: `src/data/supplyChainData.js:1509` | Category: sim-logic-gap
- Evidence: `fishing_grounds: ['food_security.fish', 'food_security.fishing']` (:1509) plus chains 'fish' (:56 'Fish & Seafood', resource 'Fishing grounds') and 'fishing' (:103 'Fishing & Seafood', resource 'Fishing grounds') and 'river_fishing' (:126, resourceSubstitutes ['Fishing grounds']). Live probe (coastal port town, fishing_grounds, 3 of 4 seeds): activeChains = 'fishing:Fishing & Seafood | river_fishing:River Fishing | fish:Fish & Seafood'.
- Why: The Economics tab presents supply chains as the settlement's distinct industries; three near-duplicate fishing chains read as generator noise, and 'River Fishing' active on a riverless coastal town is a plain factual wrong that a DM will notice. This looks like two authoring passes both surviving ('fish' the older thin chain, 'fishing' the richer one) rather than intent — the labels differ by one word.
- Fix shape: Merge 'fish' into 'fishing' (keep the richer chain, union the outputs/processors), and make 'river_fishing' substitute-activation display-aware (either drop 'Fishing grounds' from its substitutes or rename the substitute-activated instance's label). Chain ids appear in RESOURCE_TO_CHAINS and possibly saves' activeChains — trace the chainId lifecycle (persisted dossiers, tests/joins/chains.test.js pins) before deleting an id; an alias entry is the safe shape. Shifts economics-tab output → goldens likely move; batch with the regen wave.
- Verdict: _pending Opus verification_

**[data-tables-6] MEDIUM / confirmed / KNOWN-DEFERRED — priorityCategory batch-drift runs are rationalized as deliberate by the governance doc: metropolis Criminal entries are faction-role 'entertainment', Midwife/scribe/Wildfowler are 'magic', while a live consumer keys off these values**
- Where: `src/data/institutionalCatalog.js:2250` | Category: data-quality
- Evidence: metropolis Criminal: "Thieves' guild (powerful)" :2250, 'Black market bazaar' :2258, 'Underground city' :2266, "Assassins' guild" :2274 all `priorityCategory: 'entertainment'`; village Crafts run Midwife :698 / 'Village scribe' :705 / Wildfowler :712 all `priorityCategory: 'magic'`; ~15-entry 'government' runs in hamlet/village Crafts (e.g. Tannery :621 … Tailor :691). Consumer: historyGenerator.js:635 `hasCriminal = institutions.some(i => i.priorityCategory === 'criminal')`; moralMartialLean.js:98 and mercenaryMarket.js:97 include priorityCategory in classification haystacks.
- Why: categoryVocabulary.js:17-19 declares '~1/3 of catalog entries deliberately diverge … that divergence is data, not drift' (owner-approved re-scope, commit 046af326) — but the file-order run pattern (four consecutive criminal entries all 'entertainment'; three consecutive crafts entries all 'magic') is copy-paste drift, not per-entry intent, and an assassins' guild playing an 'entertainment' faction role is indefensible. The governance pin validates tokens only, so this drift is invisible to the gate while hasCriminal and the worldPulse haystacks consume the wrong roles. The deferral (dual-axis design) is sound; the blanket 'divergence is data' claim shielding these specific runs is not.
- Fix shape: Owner-reviewed spot-fix of the implausible runs only (metropolis Criminal → 'criminal'; Midwife → 'crafts' or 'religion'; Village scribe → 'government'; Wildfowler → 'economy'; case-by-case on the 'government' runs — some genuinely are patronage roles). Behavior surface is small (hasCriminal, two haystacks, faction-role OR-chain) but nonzero — check history-tension goldens. Do NOT collapse the axes (owner-settled).
- Verdict: _pending Opus verification_

**[data-tables-7] LOW / confirmed — village-block 'Smuggling network' with minTier:'city' is unreachable through every selection path — a dead catalog entry**
- Where: `src/data/institutionalCatalog.js:855` | Category: dead-code
- Evidence: village Criminal `'Smuggling network': { required: false, minTier: 'city', baseChance: 0.1 …}` (:855-862). assembleInstitutions reads only the settlement's own tier block (:216-217, metropolis = city+metropolis merge) and rejects on minTier (:228); cascadeGenerator walks tier and tier−1 only (:127-128); factionCorrelation walks own tier only (:132) — city/metropolis never read the village block, and village/town fail the minTier check.
- Why: A mechanic that can never fire. The city block has its own 'Smuggling network' (:1896) so the intent is covered there; this entry is leftover drift that misleads anyone tuning village criminal presence and slightly pads the village catalog read every generation.
- Fix shape: Either delete the village entry, or (better, matches the intent of a village-scale smuggling presence) change it to minTier:'village' with the low baseChance — but that changes rolls, so the delete is the behavior-inert option. Add the minTier-reachability check to categoryGovernance: an entry whose minTier exceeds the highest tier that can read its block is dead by construction.
- Verdict: _pending Opus verification_

**[data-tables-8] LOW / confirmed — Seven supply-chain processor patterns match no catalog institution under the runtime 12-char fuzzy rule**
- Where: `src/data/supplyChainData.js:611` | Category: dead-code
- Evidence: Programmatic check with the exact computeActiveChains rule (`lowerName.includes(pattern.slice(0,12))`): 'Horse market' (livestock), 'Village brewhouse' (brewing), "Dyers' workshop" (textiles), 'Armourers' (weapons_armor), 'Specialist craftsmen' + "Bowyer's shop" (bowyer_fletcher), 'Leatherworkers' (leather_goods) match zero catalog names. Every affected chain retains ≥1 live processor.
- Why: The file's own inline archaeology shows a sustained campaign fixing exactly this class ('Was [] — the chain could never activate', 'Barracks (town)…match no catalog name'), so these seven are the un-swept residue. Effect is mild — narrower processor recognition, e.g. a settlement's 'Bowyer & fletcher' activates the chain but the intended guild/specialist routes never contribute — but nothing pins SUPPLY_CHAIN_NEEDS pattern reachability the way resourceChainCatalog.test.js pins RESOURCE_CHAINS.
- Fix shape: Rename to live patterns ('Armourers'→'Specialized metal', "Dyers' workshop"→'Dyer', 'Leatherworkers'→'Tanner', drop the rest) and add the reachability pin for SUPPLY_CHAIN_NEEDS.processingInstitutions mirroring the F32 harness. Pattern edits change matchedInsts lists in output → check economics goldens; renames that only ADD reachability where a live pattern already matched are byte-safe, deletions of never-matching patterns are byte-safe by construction.
- Verdict: _pending Opus verification_

**[data-tables-9] LOW / confirmed — NAMING_DATA arrays carry internal duplicates — slavic settlement suffixes are 8/30 duplicated, skewing name distributions**
- Where: `src/data/namingData.js:1934` | Category: data-quality
- Evidence: Programmatic duplicate scan: slavic settlementSuffixes dupes = burg,ichi,ka,ki,ko,nick,no,tsy (22 unique of 30); norse settlementPrefixes dupes Orm,Ulf; east_asian suffix 'yuan', maleNames Jun,Yong, surnames Song,Deng; greek suffix 'polis', maleNames Alexandros,Demetrios, femaleNames Despoina,Hypatia.
- Why: Duplicates double those tokens' draw probability and cut real variety — slavic settlements draw from 22 suffixes while every other culture has 30, so slavic worlds repeat name endings noticeably sooner. The duplicate-key gate (validate:data) catches object keys, not array members, so this class is ungated.
- Fix shape: Replace each duplicate with a fresh entry (keeping array LENGTHS identical preserves rng call counts, but the drawn VALUES change → same-seed name goldens shift; batch with the regen wave). Add a no-duplicates-in-name-arrays pin to tests/data/.
- Verdict: _pending Opus verification_

**[data-tables-10] LOW / confirmed — Nit batch: duplicate tags, one-off gating/register/docs inconsistencies across the data tables**
- Where: `src/data/institutionalCatalog.js:979` | Category: data-quality
- Evidence: Representative: `tags: ['trade', 'trade']` (institutionalCatalog.js:979, also :1341, :1572, :1579; ['education','education'] :2230); 'Contract killer' in Criminal has tags ['guild','military'] + priorityCategory 'military' — invisible to every criminal classifier (:1866-1871); hamlet 'Salt works' desc says 'Only viable near salt flats or coastal access' but carries no terrain/route gate while its village twin is gated coastal/riverside (:241-247 vs :607-615).
- Why: Individually cosmetic; together they are the residue the governance suite doesn't reach (tag-array dupes pass the ⊆-vocabulary pin; prose-only constraints aren't enforced; sibling-tier entries aren't compared).
- Fix shape: One hygiene commit: (1) dedupe tag arrays (byte-inert to classifiers); (2) add 'criminal' tag to Contract killer; (3) give hamlet 'Salt works' the village gating (roll-shifting — regen batch); (4) 'Post relay station' desc 'Requires coaching inn' → a GATE_FEATURES.requires row (:1003-1008); (5) 'Village musician' tags ['religious'] counts toward religionLegitimacy (religionLegitimacy.js:180) — retag ['entertainment']; (6) popToTier(61-80)→'thorp' contradicts POPULATION_RANGES thorp max 60 (constants.js:8,27); (7) stressTypesMeta.js:4-12 rationale is stale (stressTypes.js no longer carries rng closures) and narrativeData.js:6-7 claims 'only pure string tables' while exporting template closures — fix both headers or fold the meta duplication; (8) stripped-emoji icon fields (icon:'' / stray U+FE0F) across stressTypes/supplyChainData/RESOURCE_DATA extend the known stripped-glyph family (REVIEW_FINDINGS PowerTab.jsx:153) into data — restore or drop the fields; (9) sampleSettlements Mossgate teaser says 'lakeside town' for a coastal/port config (:46-51); (10) thorp 'Communal root cellar' + "Woodcutter's camp" resolve to zero services (only two such catalog entries).
- Verdict: _pending Opus verification_


### Slice: pdf (grade B+)

**[pdf-1] HIGH / confirmed — New engine layers (spatial movers, rumors, beliefs, live trade flow) never reached the PDF; dossier-to-PDF parity has re-opened undocumented**
- Where: `src/pdf/lib/liveWorld.js:56` | Category: parity-drift
- Evidence: grep of src/pdf for rumor|belief|embattl|shipment|caravan|migration|pestilence|commodity|tradeFlow|seaLane|smuggle matches only comments/labels; meanwhile the web gained src/components/new/tabs/RumorsTab.jsx and EconomicsTab.jsx:409 `{flowDrift && <LiveTradeFlowSection drift={flowDrift} />}` (M6d). liveWorld.js imports only pre-spatial read-models (warStatus/mobilization/occupation/pantheon).
- Why: The premium canon export's Faith & War chapter advertises 'live campaign state' but prints a pre-spatial world: no rumor ledger, no belief divergence, no embattled routes, supply starvation, migration, commodity shortage bands, or pestilence — while the on-screen dossier shows rumors and live trade drift. This is exactly the drift class PDF_PARITY_AUDIT.md existed to close (it still claims 'no remaining reads-empty gaps') and RISK_REGISTER R8 says to keep current. No deferral ledger records it. The parity harness (SHARED_FIELDS) covers generation facts only, so every new mover silently widens the gap.
- Fix shape: Extend buildPdfLiveWorld with the same pure display read-models the web uses (settlementRumors with the player WHITELIST / includeGroundTruth=false, flowDerivedDependency, embattlement/supply-status selectors), rendered inside FaithWar or a new Living Realm chapter under the SAME three-fold gate; make campaign_state the showcase variant. Add a live-layer lane to the parity contract (rows keyed on worldState-derived facts) so future movers fail the parity test instead of drifting. Update PDF_PARITY_AUDIT.md's status header. All lazy/display-side — no first-paint or golden exposure.
- Verdict: _pending Opus verification_

**[pdf-2] MEDIUM / confirmed — Object-shaped coherence notes, structural suggestions, and structural violations print as bare category keys — the prose is dropped**
- Where: `src/pdf/sections/Overview.jsx:399` | Category: correctness
- Evidence: itemRender={(it) => label(it) || (typeof it === 'string' ? it : '')} with label() = item.label||item.name||item.title||item.type (format.js:48-53). Engine shapes: coherenceNotes {type:'power_economic', severity, note} (narrativeGenerator.js:727-731), structuralSuggestions {type:'suggestion', reason, suggested[]} (structuralValidator.js:377-382), structuralViolations {type:'out_of_tier', institution, reason} (structuralValidator.js:713-720).
- Why: The PDF prints 'Power Economic' where the screen prints a full contradiction sentence (OverviewTab.jsx:269-283 renders note.note; v.reason), and every structural suggestion prints as the literal word 'Suggestion'. ViabilityAssessment.jsx:157 has the same label() path for violations, so reason prose ('X is a city-tier institution in a village — deliberate override…') is lost in print. The June fix-note explicitly warned 'the data fix alone is insufficient'; the data fix landed, the renderer fix did not.
- Fix shape: Shape-aware itemRenders: coerce {note}→note, {reason,suggested[]}→`${reason}. Consider: ${suggested.join(', ')}`, violations→`${institution||group}: ${reason}`; or extend label()/a new noteText() helper shared by Overview and ViabilityAssessment, plus a render-leaf test asserting the note prose reaches text leaves.
- Verdict: _pending Opus verification_

**[pdf-3] MEDIUM / confirmed — By-design contradictions can never render as such — derived from the wrong home, they print garbled under STRUCTURAL VIOLATIONS instead**
- Where: `src/pdf/lib/viewModel.js:870` | Category: sim-logic-gap
- Evidence: const byDesignContradictions = (v.issues || []).filter(i => i?.severity === 'by_design'); — but by_design items are pushed ONLY to violations (structuralValidator.js:717, :736) which land at the settlement root (assembleSettlement.js:78 structuralViolations), never in economicViability.issues.
- Why: The engine deliberately marks intentional tensions ('This contradiction is intentional — use it as a plot seed') to differentiate them from defects. In the PDF the BY-DESIGN CONTRADICTIONS section is permanently empty and those same items print under 'STRUCTURAL VIOLATIONS ×' as bare keys ('Out Of Tier'), inverting authored plot seeds into apparent bugs — a direct hit on DM-facing coherence/immersion. (The web's own by-design read at ViabilityTab.jsx:37 is equally empty, so fixing parity means fixing the derivation, not mirroring the screen.)
- Fix shape: Derive byDesignContradictions from s.structuralViolations.filter(x=>x.severity==='by_design') and exclude them from the violations list (both PDF and web); render institution + reason + the 'intentional' framing. Add a fixture with an out-of-tier override institution.
- Verdict: _pending Opus verification_

**[pdf-4] MEDIUM / confirmed — Defense ACTIVE MILITARY STATUS stress set drifts from the web in both directions; plague_onset missing just as M11a pestilence lands**
- Where: `src/pdf/lib/viewModel.js:671` | Category: parity-drift
- Evidence: stress.find(x => ['under_siege', 'occupied', 'wartime', 'insurgency'].includes(x?.type)) vs DefenseTab.jsx:76-83 STRESS_STATUS = { under_siege, famine, occupied, politically_fractured, recently_betrayed, plague_onset }.
- Why: famine/politically_fractured/recently_betrayed/plague_onset show a military-status callout on screen but not in print; wartime/insurgency print a banner the screen never shows. The June fix-note prescribed mirroring DefenseTab's exact set and factoring a shared helper 'so the two surfaces cannot drift again' — the applied fix took the reviewer's original (wrong) set instead. With M11a pestilence now in the engine, the missing plague_onset ('QUARANTINE ACTIVE') is the most visible half.
- Fix shape: Extract the STRESS_STATUS key set into a shared domain/display helper consumed by both DefenseTab and defenseSlice (decide once whether wartime/insurgency belong; the shared constant makes it one decision).
- Verdict: _pending Opus verification_

**[pdf-5] MEDIUM / confirmed — campaign_state 'War Room' variant is user-reachable but never rendered by any test, and is not phase-gated — a draft export silently drops its flagship chapters**
- Where: `src/pdf/variants.js:121` | Category: test-coverage
- Evidence: ExportSheet.jsx:66-70 builds cards from Object.entries(PDF_VARIANTS) and only disables timeline_packet on non-canon phase; campaign_state's timeline+faithWar are both 'if-canon'. fullPdf.render.test.jsx:85 VARIANTS = ['canon_dossier','draft_brief','timeline_packet']; grep shows FaithWar.jsx is never executed by any test (faithWarGate.test.js tests only the predicate and slice).
- Why: A draft-phase user can pick 'Campaign State / War Room' and receive a gutted document (no timeline, no faith/war) with no warning — inconsistent with timeline_packet's disabled-with-reason treatment. Worse, the premium FaithWar chapter — the paid, deity-name-bearing artifact — has zero layout-execution coverage: a react-pdf crash in it (e.g. on an unusual religionState shape) would ship undetected because every render lane excludes it.
- Fix shape: Add campaign_state (with a live-world fixture campaign) to the fullPdf.render VARIANTS lane and add a FaithWar row to the per-section lane using a synthetic worldState; phase-disable campaign_state in ExportSheet on draft (same pattern/reason as timeline_packet) and add its icon to VARIANT_ICON.
- Verdict: _pending Opus verification_

**[pdf-6] MEDIUM / confirmed — PDF Viability chapter ignores the web's issue/warning routing filters — web-suppressed noise prints, and the same issues print twice across chapters**
- Where: `src/pdf/lib/viewModel.js:879` | Category: parity-drift
- Evidence: viabilitySlice issues filter excludes only by_design + stress_consequence; warnings = [...(v?.warnings||[]), ...(s?.warnings||[])] unfiltered. Web ViabilityTab.jsx:41-49 additionally excludes VIABILITY_EXCLUDED_TYPES ['dependency','resource_chain','opportunity','incomplete_chain','trade_dependency','food_security'], severities ['dependency','opportunity'], and four Resource/Economic categories. economicsSlice.viabilityIssues (viewModel.js:608) is ALL v.issues unfiltered.
- Why: Dependency/resource-chain/opportunity items the screen deliberately routes to the Economics and Resources tabs print in the PDF's Viability chapter, and the identical v.issues array prints again in the PDF Economics chapter's ACTIVE ECONOMIC ISSUES — so a single engine issue can appear twice in one document while the chapter's signal-to-noise falls below the screen's curated view.
- Fix shape: Port the VIABILITY_EXCLUDED_TYPES/SEV/category filter into viabilitySlice (ideally as a shared domain/display constant with ViabilityTab), and give economicsSlice the complementary filter (dependency/chain/food types only) so each issue has one home per artifact.
- Verdict: _pending Opus verification_

**[pdf-7] LOW / confirmed — Relationships chapter headline mislabels neighbours as 'internal ties' via a stale adapter object**
- Where: `src/pdf/sections/Relationships.jsx:60` | Category: correctness
- Evidence: relationshipsHeadline({ all: r.neighbours || [] }) — but headlines.js:224-226 now reads rel.neighbours (→[] here) and internal = rel.internal || rel.relationships || rel.all (→ the neighbours array).
- Why: A settlement with 3 neighbours and 5 internal relationships prints '3 internal ties on file' — wrong label and wrong count — on the chapter's TLDR line the DM scans first.
- Fix shape: Pass the slice itself: relationshipsHeadline(r).
- Verdict: _pending Opus verification_

**[pdf-8] LOW / confirmed — NotableNPCs HIGH_POWER=80 promotion is dead code on the engine's 1-10 power scale — the documented anti-trim guarantee can never fire**
- Where: `src/pdf/sections/NotableNPCs.jsx:59` | Category: dead-code
- Evidence: const HIGH_POWER = 80; … if (major.length < majorMin || p >= HIGH_POWER) — but npcGenerator.js:57-59 emits power 8+floor(rng*3) max 10 / mid 4-7 / low 1-3. Header (lines 10-12) still claims 'a settlement with eight 90+ power players isn't artificially trimmed'.
- Why: The sibling NPCQuickRef was recalibrated to the 1-10 scale (its comment cites the same generator lines) but this one was missed: a settlement with five 9-power figures always trims the majors to exactly three, contradicting the file's stated design.
- Fix shape: HIGH_POWER = 8 (the engine's high tier), or promote on npc.influence === 'high'; fix the docstring.
- Verdict: _pending Opus verification_

**[pdf-9] LOW / confirmed — Cover crisis overflow points readers to a chapter that no longer exists ('See Summary, page 2')**
- Where: `src/pdf/sections/Cover.jsx:119` | Category: ux
- Evidence: + {chips.length - top.length} more. See Summary, page 2. — while SettlementPDF.jsx:9-10 records 'The legacy Summary page was removed'; page 2 is the Table of Contents and the crisis detail lives in Overview (01).
- Why: A printed artifact with a dead cross-reference reads as broken to the paying DM on the very first page; the full crisis list is actually on the Overview page.
- Fix shape: Point to 'the Overview chapter' (or drop the pointer).
- Verdict: _pending Opus verification_

**[pdf-10] LOW / confirmed — Nit batch: dead reads, precedence inconsistency, latent nondeterminism, stale docstrings**
- Where: `src/pdf/lib/viewModel.js:413` | Category: polish
- Evidence: (a) foodBalance.summary reads v.foodSecurity/metrics.foodBalance.summary — neither key is ever emitted (foodBalance.js return has no summary; foodSecurity lives on economicState) so the audit's 'food narrative paragraph' silently no-ops on both surfaces; (b) hooksSlice:1089 `s?.neighbours || s?.neighbourNetwork` vs relationshipsSlice:1126 `s?.neighbourNetwork || s?.neighbours` — opposite precedence for the same data; (c) Editable.jsx:43 safeName falls back to Math.random() for unnamed form fields (currently unreachable — all showField callers pass names — but a latent artifact-nondeterminism trap); (d) ~8 section headers carry stale chapter numbers (EconomicsTrade 'chapter 03' renders eyebrow 09; ViabilityAssessment 'chapter 10' vs 13; NotableNPCs 'chapter 09' vs 04; etc.); (e) SupplyChainFlow.jsx:234 sorts category groups with localeCompare (env-dependent collation; house norm is codepoint sort); (f) IdentityDailyLife.jsx:83-84 prints '+0 units' when surplus is exactly 0.
- Why: Individually harmless; collectively they are the debris field the next parity pass should sweep so future audits don't re-find them.
- Fix shape: One small cleanup commit: delete dead summary reads or wire economicState.foodSecurity; pick neighbourNetwork-first everywhere; replace the Math.random fallback with a deterministic counter; fix docstrings; codepoint sort; guard surplus>0.
- Verdict: _pending Opus verification_


### Slice: components-commerce (grade B+)

**[components-commerce-1] HIGH / confirmed — Tier-entitlement facts drift across six conversion surfaces — free save cap claimed as 3, 10, and unlimited; custom content and PDF export mis-attributed**
- Where: `src/components/AuthModal.jsx:160` | Category: product-coherence
- Evidence: AuthModal.jsx:160-162: 'Free Account: All tiers, 10 saves, custom content … Premium: Unlimited saves, Neighbourhood System, PDF/JSON export'. HomeHero.jsx:293-294 (anon at-cap): 'Sign in (free) to unlock thorp through metropolis, save unlimited drafts, and export the PDF.' HowToUse.jsx:126: 'Free mode can generate Thorp through Village; sign in for Town, City, and Metropolis.' AccountSubscriptionSection.jsx:64-65: 'Cartographer unlocks: every size, unlimited saves…'. Ground truth authSlice.js:36-38: anon maxTier 'town'; free maxSaves 3, customContent:false, export:true. Landing copy (copy/landing.js:156) and SingleDossierSuccessPage:345 correctly say 3 saves.
- Why: These are the exact surfaces where a visitor decides to sign up or pay. Promising 'unlimited drafts'/'10 saves' then enforcing 3, listing custom content as free when it is premium-gated, listing PDF export as premium when free users export freely, and claiming the anon ceiling is Village when it is Town, all violate the pre-launch paid-surface honesty bar and the owner's documented 'size is FREE, never pitched as premium' doctrine (en.js:365-366, 381-383 state it explicitly while AccountSubscriptionSection contradicts it).
- Fix shape: Structural prevention: mint one derived tier-facts module (from TIER_GATE + config/pricing.js — save caps, anon ceiling, export/custom-content gates, per-tier feature bullets) and have AuthModal, HomeHero at-cap card, HowToUse QuickTab, and AccountSubscriptionSection render from it; add a contract test pinning surface claims to TIER_GATE so the next repricing cannot drift.
- Verdict: _pending Opus verification_

**[components-commerce-2] HIGH / confirmed — shareMap() silently drops 8 of publish_map's parameters — first publish of a campaign map loses the configured world snapshot, section toggles, cover, importable flag, realm-arc summary, and facets**
- Where: `src/lib/gallery.js:148` | Category: correctness
- Evidence: gallery.js:148-153 sends only { target_id, p_kind, p_description, p_tags }. Migration 089:123-135 defines publish_map(target_id, p_kind, p_description, p_tags, p_importable, p_image_url, p_image_alt, p_share_world, p_world_sections, p_world_snapshot, p_realm_arc_summary, p_facets). MapShareEditor.jsx:280-305 buildShareOpts() assembles all of these and :329 passes them to shareMap, which destructures only {kind, description, tags}.
- Why: The MapShareEditor's details form is OPEN by default pre-publish (detailsOpen = !isPublic), inviting the owner to configure the living-world reveal and cover, then 'Share to gallery' discards everything but kind/description/tags. A freshly published map_with_campaign share shows no living world, no cover, no facets until the owner happens to reopen details and click 'Save gallery details'. Contrast ShareToGallery.handlePublish, which persists metadata via updateGalleryMetadata BEFORE the publish RPC — the settlement path got this right and the map path did not.
- Fix shape: Extend shareMap to pass the full parameter bag (p_importable…p_facets, mapping the buildShareOpts keys), or mirror publishSettlement by calling updateMapGalleryMetadata(campaignId, opts) before the publish RPC inside handlePublish. Add a contract test pinning shareMap's RPC params to the migration signature.
- Verdict: _pending Opus verification_

**[components-commerce-3] MEDIUM / confirmed — Pricing page (the Terms-declared source of truth) sells the free tier a $2.99-per-PDF model and Cartographer 'unlimited export', but the shipped gate gives free users unlimited free export**
- Where: `src/copy/en.js:370` | Category: product-coherence
- Evidence: en.js Wanderer features: 'Keep any dossier's PDF for $2.99, yours to re-download'; Cartographer: 'Unlimited PDF and JSON export of every settlement'. authSlice.js:37: free export:true. BuyThisDossier.jsx:18-20 header: 'In OUR current tier gates the free tier CAN export, so unpurchased/unsaved are dormant-but-wired: they light up the instant the free-export gate is ever flipped.'
- Why: TermsPage.jsx:85-87 declares the Pricing page 'the source of truth for what each option includes'. Right now it describes a monetization model (free pays per PDF) that the shipped gates do not implement — the single-dossier ladder for signed-in users is deliberately dormant. Launching with both means the legal source of truth overstates what is paid; flipping the gate later without deciding now risks a silent paid-surface change. This needs an explicit owner ruling before deploy.
- Fix shape: Owner decision queue item: either flip TIER_GATE.free.export to false to activate the built $2.99 ladder (matching the pricing copy), or rewrite the Wanderer/Cartographer export bullets to match free export. Do not leave both live at launch.
- Verdict: _pending Opus verification_

**[components-commerce-4] MEDIUM / confirmed — FounderTile hardcodes a 500-seat cap against the real 30-seat cap — seat math and scarcity copy are wrong on a $99 purchase CTA**
- Where: `src/components/pricing/FounderTile.jsx:78` | Category: correctness
- Evidence: FounderTile.jsx:78 'const claimSeat = seatsRemaining ? 500 - seatsRemaining + 1 : null;' and :126 '{seatsRemaining} of 500 seats remaining'. founderSeats.js:30 'export const FOUNDER_SEAT_CAP = 30;' — en.js:399 and PricingPage both say 30.
- Why: With 28 seats left the tile would offer 'Claim seat 473, $99 one-time' and '28 of 500 seats remaining', contradicting the pricing page's '28 of 30' on the same product. Currently latent (flag('founderRecognition') defaults off), but it is a wired paid CTA whose scarcity claim — the entire pitch of the tile — is off by 16×.
- Fix shape: Import FOUNDER_SEAT_CAP and derive both the remaining line and claimSeat from it (claimSeat = FOUNDER_SEAT_CAP - seatsRemaining + 1); the tile's eligibility check already handles seatsRemaining<=0.
- Verdict: _pending Opus verification_

**[components-commerce-5] MEDIUM / confirmed — BuyThisDossier 'save it first' rung sends an already-signed-in user to the sign-in page, which bounces them to /create — the save never happens**
- Where: `src/components/BuyThisDossier.jsx:174` | Category: ux
- Evidence: BuyThisDossier.jsx:166-175: reason 'unsaved' (signed-in, no saveId) renders CTA t('dossierExport.saveFirst.cta') = 'Save this settlement to buy its PDF' with onClick={goSignIn}; goSignIn (:96) navigates to the signin view. SignInPage/RegisterPage redirect any non-anon user straight to ?next=/create.
- Why: The rung is dormant today (free export gate is on, so 'unsaved' never renders) but it activates the moment the export gate flips (the exact decision in the pricing-truth finding). When live, the honest 'save first' CTA becomes a disorienting bounce through the sign-in route instead of triggering the save flow the copy promises.
- Fix shape: Route the 'unsaved' CTA to the save affordance (the SaveToLibraryButton path / a props.onSaveFirst callback) rather than onSignIn; keep goSignIn for the anon ladder only. Add a pin so the rung's CTA is exercised in tests before the gate ever flips.
- Verdict: _pending Opus verification_

**[components-commerce-6] LOW / confirmed — AuthModal and PurchaseModal declare aria-modal but have no focus trap, Escape, or focus restore, while five sibling dialogs use the shared useDialogFocusTrap; Dialog.jsx duplicates the trap inline and skips the trap stack**
- Where: `src/components/AuthModal.jsx:61` | Category: a11y
- Evidence: AuthModal.jsx:61-65 and PurchaseModal.jsx:91-96 render role='dialog' aria-modal='true' with no trap hook (backdrop role='button' tabIndex=0 closes on Enter/Space only). primitives/useDialogFocusTrap.js exists and is used by DossierLadderModal, BottomSheet, SimulationRulesDialog, MapShareEditorOverlay, SessionMode. Dialog.jsx:15-39 re-implements the same trap inline without the module-scope trapStack (:27 in the hook), so a Dialog stacked over another dialog double-handles Escape.
- Why: aria-modal promises an inert background; on the two money/auth modals Tab walks into the page behind and Escape does nothing — the exact gap RISK_REGISTER R7 tracks as open ('custom Dialog focus-trap… uncovered'), now half-fixed inconsistently. The Dialog.jsx duplication also re-creates the stacked-Escape bug the hook's trapStack was built to prevent.
- Fix shape: Adopt useDialogFocusTrap in AuthModal, PurchaseModal, and Dialog.Shell (deleting Shell's inline copy) so all modals share one trap + stack.
- Verdict: _pending Opus verification_

**[components-commerce-7] LOW / confirmed — Six dead components (~1,300 lines) pinned 'alive' by their own unit tests: primitives CausalViewTabs, RegenerationModeSelector, BandPill, CanonBadge, Toast, and home/RegionWakeReplay**
- Where: `src/components/primitives/CausalViewTabs.jsx:1` | Category: dead-code
- Evidence: Import census: zero non-test importers for primitives/{CausalViewTabs(416L), RegenerationModeSelector(268L), BandPill(154L), CanonBadge(142L), Toast(42L)} and home/RegionWakeReplay.jsx(249L). tests/ui/{CausalViewTabs,RegenerationModeSelector,BandPill}.test.jsx keep them green. App.jsx:900-915 renders its own inline toast instead of primitives/Toast; SubstrateTab.jsx:54 defines a LOCAL BandPill duplicate rather than the primitive.
- Why: Dead code with green tests is worse than plain dead code — the suite certifies components no user can reach, masking the deadness and inflating the maintenance surface; the SubstrateTab local BandPill shows the primitive was orphaned by divergence, not by intent.
- Fix shape: Delete the six components + their tests (or, for BandPill/Toast, re-adopt the primitive at the duplicating call sites); an only-shrinks unused-component inventory test would keep the class closed.
- Verdict: _pending Opus verification_

**[components-commerce-8] LOW / confirmed — HowToUse still carries the stripped-glyph corrupted-prose family: mid-sentence fragments where em-dash separators were destroyed**
- Where: `src/components/HowToUse.jsx:133` | Category: copy-corruption
- Evidence: HowToUse.jsx:133: 'public legitimacy, faction relationships, and. Where relevant. Legacy annotations connecting…'. :322-324: 'bounded by three things: discovery. What you find when you arrive<strong>disappointment</strong>. What isn't there, and ingenuity.' (missing separator glues 'arrive' to 'disappointment').
- Why: This is the marketing/education surface that closes the product thesis ('Most generators roll on a table. This one simulates.') — visibly mangled sentences on the DM Philosophy and Quick Start tabs undercut exactly the craftsmanship the page argues for. Same family as the 2026-06-13 snapshot's PowerTab/WorldMap findings (mediums/lows never re-triaged); verified still present here.
- Fix shape: One copy pass over HowToUse.jsx restoring the em-dash/colon separators; grep the ' and. ' / 'arrive<strong>' shapes repo-wide to close the family.
- Verdict: _pending Opus verification_

**[components-commerce-9] LOW / confirmed — Cartographer price stated three ways: en.js '$5.99', pricing.js priceCents 600 ($6.00), LivingWorldTab hardcodes '$5.99 a month' in tooltips outside the copy registry**
- Where: `src/components/howto/LivingWorldTab.jsx:106` | Category: docs-drift
- Evidence: LivingWorldTab.jsx:106 and :162 title='…$5.99 a month.' (hardcoded). config/pricing.js:189 'priceCents: 600, // $6/mo'. copy/en.js:376 priceLabel '$5.99'. The real charge is the STRIPE_PRICE_PREMIUM env price id (create-checkout/index.ts:62), unverifiable from the repo.
- Why: PricingPage's header comment promises 'hard-coding nothing here means a price change is a one-file edit' — the LivingWorldTab tooltips and the priceCents metadata break that invariant, and whichever of $5.99/$6.00 the Stripe price actually is, one internal record is wrong. Dead copy block pricing.singleDossier (en.js, zero renderers) also promises 'we'll email you a full PDF', which no flow does.
- Fix shape: Source the tooltip price from t('pricing.tiers.cartographer.priceLabel'); reconcile priceCents with the live Stripe price; delete the dead pricing.singleDossier block.
- Verdict: _pending Opus verification_

**[components-commerce-10] LOW / confirmed — GalleryDetail meta line reads config.terrain / settlement.terrain — keys the engine never writes — so terrain is silently absent from the public dossier header**
- Where: `src/components/gallery/GalleryDetail.jsx:122` | Category: correctness
- Evidence: GalleryDetail.jsx:122: 'dossier.settlement?.config?.terrain || dossier.settlement?.terrain'. ShareToGallery.jsx:52-54 documents 'the old paths (config.terrain…) were never written'; galleryUtils.js:5-8 confirms the stored key is config.terrainType (resolveTerrain).
- Why: The gallery detail hero's meta row ('town / 1,234 population / terrain / shared date') loses its terrain facet on every dossier — a small immersion/legibility gap on the flagship community surface, and the third instance of the never-written-key pattern this slice already fixed twice (suggestedTagsFor, TERRAIN_OPTIONS).
- Fix shape: Use resolveTerrain(dossier.settlement?.config) (already the sanctioned reader), matching ShareToGallery.
- Verdict: _pending Opus verification_

**[components-commerce-11] LOW / confirmed — Nit batch: focusable backdrop idiom, execCommand, fragile footer route map**
- Where: `src/components/PurchaseModal.jsx:77` | Category: polish
- Evidence: (1) PurchaseModal.jsx:77-82 / AuthModal.jsx:46-51: the fullscreen backdrop is role='button' tabIndex=0 — a tab-focusable overlay wrapping the dialog is a nonstandard a11y idiom (fold into the focus-trap fix). (2) GalleryDescriptionEditor.jsx:19-21 rides deprecated document.execCommand (works today; DOMPurify makes it safe, but it is on borrowed time). (3) LandingBelowFold.jsx:301 LandingFooter route map {Compendium,Pricing,Account} is keyed by display label — a copy edit to footer.links silently yields onNavigate(undefined).
- Why: Individually trivial; batched per instructions.
- Fix shape: Fold (1) into the shared trap adoption; note (2) as accepted debt; key (3) by id tuples in copy/landing.js.
- Verdict: _pending Opus verification_


### Slice: backend (grade A-)

**[backend-1] HIGH / confirmed — create-checkout anonymous single_dossier path has no rate limiter (Stripe-session + dossier_purchases amplification)**
- Where: `supabase/functions/create-checkout/index.ts:258` | Category: security
- Evidence: botGuard(req) (UA-only, no throttle) is the sole gate; then `await admin.from('dossier_purchases').upsert({checkout_token, settlement, byte_size})` and `stripeApi.checkout.sessions.create(...)` run with NO consume_*_rate_limit anywhere (grep-confirmed). verify_jwt=true is satisfied by the public anon key.
- Why: Every OTHER anonymous edge fn (verify-single-dossier, send-email, log-client-error, ingest-events, auth-recovery) carries a real fail-closed limiter; this one does not. With the public anon key an attacker can mint unbounded real Stripe checkout sessions (exhausting the account's ~100 req/s Stripe API budget and blocking legitimate buyers) and write up-to-512KB dossier_purchases rows per call, capped only by a 30-day purge.
- Fix shape: Add a per-IP fixed-window limiter to the anon single_dossier branch mirroring send-email/verify-single-dossier (consume_*_rate_limit via service-role, fail-closed backstop) BEFORE the persist and the Stripe session create.
- Verdict: _pending Opus verification_

**[backend-2] MEDIUM / confirmed / KNOWN-DEFERRED — Twelve committed migrations (118-129) are not applied to production; validate:migration-head only warns**
- Where: `supabase/applied-head.json:2` | Category: docs-drift
- Evidence: appliedHead=117 while repo head=129. Pending set includes 118 (free-first-narrative), 119 (double-charge fix), 121 (_regenSeed DM strip), 123 (refund idempotency + gallery allowlist), 128/129 (latent-pantheon strip). check-migration-head.mjs classifyAppliedHead('pending') emits console.warn, not exit 1.
- Why: Constitution point 3 (free/anon never see live deity names/DM truth) is currently UNENFORCED in prod for config.latentPantheon and _regenSeed, and the timeout-retry double-charge is still live. A launch that pushes an incomplete subset ships these leaks/charges, and the gate will not fail. Several REVIEW_FINDINGS items read as 'fixed' but are only fixed on paper until db push runs.
- Fix shape: Before launch, push 118-129 and bump applied-head to 129 in the same PR; consider making validate:migration-head fail (not warn) when the privacy/money migrations are pending, or pin the deploy probe as a required gate. Verify latentPantheon is actually being generated in prod (Phase 4 W-F6) to size the live-leak window.
- Verdict: _pending Opus verification_

**[backend-3] MEDIUM / confirmed — pg_temp search_path pin regressed on money-path SECURITY DEFINER functions authored after 111**
- Where: `supabase/migrations/123_money_and_public_projection_hardening.sql:47` | Category: security
- Evidence: refund_credits (123), spend_credits/get_ai_pricing/aggregate_ai_usage_stats (114), the pricing cron fns (115), import_gallery_dossier (120), toggle_gallery_vote/add_gallery_comment (125) all declare `set search_path = public` (bare), while 094/111 established `public, pg_temp` (pg_temp LAST) as the invariant and 123's own _gallery_sanitize + 128/129 use it correctly.
- Why: A bare search_path leaves pg_temp implicitly FIRST (the exact CVE-2018-1058 class 094/111 exist to close), on the two highest-stakes money functions. Practical exploitability on Supabase is low (all references are public.-qualified and anon/authenticated lack CREATE TEMP), but it is a documented-invariant drift with NO lint/test guard, so it will keep recurring on every future recreate.
- Fix shape: ALTER the affected functions to `set search_path = public, pg_temp` (a 111-style config-only pass), and add a structural guard: a test/CI scan asserting every public SECURITY DEFINER function pins pg_temp LAST (the structural-prevention ratchet the playbook favors).
- Verdict: _pending Opus verification_

**[backend-4] MEDIUM / confirmed / KNOWN-DEFERRED — Content-Security-Policy ships Report-Only for both surfaces — zero active XSS mitigation at launch**
- Where: `vercel.json:18` | Category: security
- Evidence: Both header blocks use `Content-Security-Policy-Report-Only`; csp-report.js documents the flip to enforcing as an undated OWNER PUNCH LIST item ('Rename BOTH header keys ... That single rename is the enforce flip').
- Why: Report-Only reports violations but blocks nothing, so the app has no CSP protection on day one. For a pre-launch product taking payments and rendering user-shared gallery content, an XSS that CSP would have contained is fully unmitigated until the flip.
- Fix shape: Watch the report stream for a few days of real traffic (the endpoint already exists), widen directives for any legitimate origins, then rename both keys to Content-Security-Policy before launch; treat the flip as a launch-gate item, not an open-ended punch-list entry.
- Verdict: _pending Opus verification_

**[backend-5] LOW / confirmed — verify-checkout-session bypasses the shared fail-closed CORS module**
- Where: `supabase/functions/verify-checkout-session/index.ts:36` | Category: correctness
- Evidence: It keeps an inline allowlist [CLIENT_URL, settlementforge.com, www, vercel.app, 'http://localhost:5173', 'http://localhost:3000'] and returns `accepted ? (origin || '*') : allowed[0]` — the exact drift _shared/cors.ts was written to eliminate. Every sibling (create-checkout, create-customer-portal, verify-single-dossier) uses sharedCorsHeaders.
- Why: Hardcoded localhost origins are accepted in production, an empty Origin yields Access-Control-Allow-Origin: '*', and it omits the Cloudflare Pages / Vercel preview-suffix matches AND Access-Control-Allow-Credentials the shared module provides — so the post-checkout confirmation flow (the F23 spoof-proof reconciliation anchor) fails CORS on preview deploys.
- Fix shape: Replace the inline corsHeaders with `sharedCorsHeaders(req, { methods: 'POST, OPTIONS' })` like its siblings; delete the localhost hardcodes and the '*' fallback.
- Verdict: _pending Opus verification_

**[backend-6] LOW / probable — ingest-events resolveDeviceActor insert is unguarded against a concurrent first-touch**
- Where: `supabase/functions/ingest-events/index.ts:106` | Category: correctness
- Evidence: resolveDeviceActor does `admin.from('analytics_device_links').insert({device_key, actor_id})` with no onConflict and no error check, then returns the locally-generated actor; resolveUserActor uses upsert(ignoreDuplicates) but resolveDeviceActor does not.
- Why: Two concurrent first requests for the same device_key both miss the SELECT and both INSERT; one hits the unique violation (swallowed) but each returns its own crypto.randomUUID(), so a device can briefly stitch to two actor ids — an analytics-attribution imperfection (double-counted anon funnel), not a money/security issue.
- Fix shape: Mirror resolveUserActor: `upsert({device_key, actor_id}, { onConflict: 'device_key', ignoreDuplicates: true })` then re-SELECT the winning actor_id so both callers converge.
- Verdict: _pending Opus verification_

**[backend-7] LOW / probable — Nit batch: minor robustness/coupling observations**
- Where: `supabase/functions/_shared/requestMeta.ts:37` | Category: nit-batch
- Evidence: (1) analytics-export/pricing-resync-cron gate the cron caller through botGuard before the shared-secret check; they rely on pg_net's UA never matching OBVIOUS_BOT_PATTERNS — fragile if the platform cron UA changes. (2) stripe-webhook grantMonthlyAllowanceIfNeeded throws 'no matching profile' on an unmatched subscription invoice, which releases the event claim and retry-loops forever for a manually-created Stripe customer. (3) og-image emits ACAO '*' (correct for a public image, noted for completeness).
- Why: None affects state integrity; each is a small robustness or maintenance edge worth a one-line note so a future change does not silently break a cron or wedge a webhook in a retry loop.
- Fix shape: Skip botGuard on the shared-secret cron endpoints (the secret is the real gate), and treat an unmatched monthly-allowance invoice as an ack (log + return) rather than a throw so it does not retry-loop.
- Verdict: _pending Opus verification_


### Slice: lib-infra (grade A-)

**[lib-infra-1] HIGH / confirmed — Map-share gallery thumbnail capture calls a bridge method that does not exist anywhere (bridge.exportThumb)**
- Where: `src/lib/mapThumb.js:25` | Category: correctness
- Evidence: const { dataUrl, w, h } = await bridge.exportThumb(480); — grep over the whole repo (src/, public/, tests/) finds exportThumb ONLY at mapThumb.js:25 and :111. mapBridge.js's typed api (lines 255-304) has no exportThumb, and public/map/ has no settlementEngine:exportThumb handler.
- Why: MapShareEditor.jsx:192-193 auto-seeds every map-share cover via captureMapThumb/captureCampaignThumb. The call throws TypeError immediately, every failure is swallowed by the best-effort try/catch, so generated-terrain map shares NEVER get a thumbnail — every maps-gallery tile falls back to the placeholder, silently, forever. A user-visible feature that can never fire, masked by fail-quiet error handling.
- Fix shape: Add exportThumb to the mapBridge typed surface (call('settlementEngine:exportThumb', { size })) and implement the iframe-side handler in public/map's sf-bridge (FMG has a native raster exporter). Add a structural-prevention pin: a test asserting every bridge method consumed by lib/ modules exists on the createMapBridge api (typed-surface completeness walker).
- Verdict: _pending Opus verification_

**[lib-infra-2] MEDIUM / confirmed — Research-plane snapshots are never stamped consentTier, so revoking research consent does not purge them from the queue**
- Where: `src/lib/analyticsQueue.js:204` | Category: privacy-consent
- Evidence: enqueueSnapshot pushes { ...row, ts } with NO consentTier stamp (unlike enqueueEdit/enqueuePulseEffect which stamp consentTier:'research'); purgeRevoked filters _snapshots.filter(s => s.consentTier !== 'research') — matches nothing, so no snapshot is ever purged.
- Why: The module's own contract (line 14: 'drops research-class records if research consent is revoked before flush') is false for snapshots. A snapshot built under research consent (researchCapture.js hotColumns includes seed, defense scores, legitimacy, food_resilience) survives revocation in queue + localStorage spill and flushes afterward. Server-side (ingest-events) the envelope tier is then 'product', which nulls `seed` and drops `structural` — but the research-tier hot columns (food_resilience/legitimacy/defense_*) are written regardless of tier, under consent_tier='product'. A consent-integrity defect in a system whose privacy discipline is otherwise exemplary.
- Fix shape: Stamp consentTier:'research' on the snapshot record when researchCapture builds a full (research) payload — or stamp all snapshots and let purgeRevoked strip the structural/hot research fields on revoke. Add a purge pin test: enqueue snapshot under research consent, revoke, flush, assert it (or its research fields) never leaves the queue.
- Verdict: _pending Opus verification_

**[lib-infra-3] MEDIUM / confirmed — Client can queue unlimited snapshots per envelope but the ingest function silently persists only the first 2 — campaign PDF export loses member snapshots**
- Where: `src/lib/analyticsQueue.js:244` | Category: analytics-data-loss
- Evidence: buildEnvelope: snapshots: _snapshots.map(...) sends ALL queued snapshots; drain() splices them all as delivered. Server (ingest-events/index.ts:270): `const snapshots = Array.isArray(body.snapshots) ? body.snapshots.slice(0, 2) : []` — extras are neither stored nor counted as rejected. Trigger exists: generateCampaignPDF.js:805-809 loops captureFingerprint('exported') for EVERY member settlement; enqueueSnapshot (line 204-210) never calls maybeFlush, so a 5-settlement campaign export batches 5 snapshots into one envelope and 3 vanish.
- Why: The research plane's 'exported' lifecycle waypoint is systematically lossy for multi-settlement moments: the client believes delivery succeeded (drain clears them) while the server discarded everything past index 1. The generation-spine analysis this data feeds will silently under-count exports.
- Fix shape: Either chunk envelopes client-side to ≤2 snapshots per flush (or trigger maybeFlush from enqueueSnapshot), or raise/paginate the server cap and count the overflow in `rejected` so drops are at least observable. A cross-contract test pinning client max-batch ≤ server accept-limit prevents recurrence.
- Verdict: _pending Opus verification_

**[lib-infra-4] MEDIUM / confirmed — Five of six lifecycle-email helpers have zero callers — save/export/credit-low/cap-warning emails are never sent**
- Where: `src/lib/emailLifecycle.js:14` | Category: dead-feature
- Evidence: Header documents call sites: 'notifySaved — saves.js, after a save succeeds; notifyExported — utils/generateSettlementPDF.js…; notifyCreditLow — creditsSlice.js…; notifyCapWarning — anonGenCounter.js'. Grep across src/: only notifyWelcome is called (authSlice.js:241). saves.js, generateSettlementPDF.js, creditsSlice, anonGenCounter contain no notify* calls.
- Why: The Tier 8.5 lifecycle-email system exists end-to-end (templates authored in emailTemplates.js, send-email edge function validates and dispatches them) but the client hooks were never wired, so users never receive save confirmations, export confirmations, or credit-low warnings. The module's own documentation asserts a wiring that does not exist — docs-drift plus a silently-unlaunched retention feature. (founder_thank_you is legitimately server-side; welcome works.)
- Fix shape: Either wire the four helpers at their documented call sites (respecting profiles.email_notifications and the emailPreferences categories), or explicitly retire them with a deferral note. If wiring: notifySaved belongs at the store's notePersistedSave seam, not saves.js, to fire once per fresh save.
- Verdict: _pending Opus verification_

**[lib-infra-5] MEDIUM / confirmed — Analytics envelopes never carry a sessionId and the dogfood/elevated corpus stamp is never wired — session analysis impossible, owner usage contaminates the production corpus**
- Where: `src/lib/analyticsQueue.js:235` | Category: analytics-wiring
- Evidence: buildEnvelope: `sessionId: undefined, // stamped by caller wiring if available` — grep finds no wiring anywhere; session.js getSessionId() has zero consumers. setAnalyticsElevated (line 83) likewise has zero callers outside the module, so resolveCorpus can never return 'dogfood'.
- Why: session.js promises 'A session groups events for funnel/path analysis' but no first-party row (analytics_events / edit_events / settlement_snapshots session_id columns) ever gets a session id — path analysis over the canonical sink is impossible. And per the corpus-stamp design (PHASE6_DATA_LIFECYCLE §1) elevated/owner usage should be excluded from production datasets; with the getter unwired, all the solo builder's own heavy usage is stamped 'production', which for a pre-launch product may be MOST of the corpus.
- Fix shape: One-line wirings at boot: in main.jsx (or installAnalyticsQueue) register setAnalyticsElevated(() => useStore.getState().isElevated?.()) and stamp buildEnvelope's sessionId from lib/session.getSessionId(). Both are seams already designed for exactly this.
- Verdict: _pending Opus verification_

**[lib-infra-6] MEDIUM / confirmed — F42 metadata-only library projection (saves.listMeta) is fully built but has zero consumers — the egress optimization never fires**
- Where: `src/lib/saves.js:249` | Category: dead-code
- Evidence: supabaseListMeta/localListMeta + the listMeta export (line 527) exist with extensive F42 rationale ('84–220 kB per row… hydrate per-save'); grep for listMeta/isMeta across src/ finds no consumer. SettlementsPanel.jsx:198, WorldMap.jsx:281, useGalleryPageState.js:104 all still call savesService.list().
- Why: The documented egress problem (full library pull fetches every blob + 50-snapshot version history just to paint cards) still exists in production paths; the fix was built into the service layer and abandoned before the last mile. Dead code that also misleads future readers into believing the grid is meta-driven.
- Fix shape: Wire the library grid to listMeta + per-open hydration (the F42 plan), or delete the projection and its comments with a deferral note. If keeping, an inventory test asserting listMeta has ≥1 consumer prevents silent regression.
- Verdict: _pending Opus verification_

**[lib-infra-7] MEDIUM / confirmed — Campaign PDF exports only the pre-spatial static world — none of the living simulation reaches the campaign-level artifact**
- Where: `src/utils/generateCampaignPDF.js:661` | Category: product-silo
- Evidence: The export renders cover/index/relationship map/NPC contacts/digest plus a 'Network Effects Appendix' computed by getAllModifiers (lib/relationshipGraph.js's static PROPAGATION_MATRIX BFS). No section reads campaign.worldState, wizardNews, chronicle, pantheon, wars, or the regional graph.
- Why: The product moat is the living world (mover ladder, wars, faith, trade), and the settlement-level exports honor it (PDF + Foundry carry the Faith & War chapter from live worldState). But the artifact a DM prints for a whole campaign shows a frozen pre-pulse network with matrix-derived percentages — the realm's actual history (sieges, plagues, treaties, pantheon shifts) is absent. Also jsPDF runs synchronously on the main thread, unlike the worker-rendered settlement PDF.
- Fix shape: Add a live-world chapter set to the campaign export (chronicle digest, war/siege table, pantheon standing — reuse buildChronicleGrounding + the Faith & War read-models), gated on worldState presence so legacy campaigns render as today. Lazy display work, budget-free by the round-21 doctrine.
- Verdict: _pending Opus verification_

**[lib-infra-8] MEDIUM / confirmed — Founder emails promise 'first 500 supporters' while every other surface caps founder seats at 30**
- Where: `src/lib/emailTemplates.js:125` | Category: copy-contract
- Evidence: founder_thank_you: 'You are one of the first 500 supporters.'; welcome (line 50-51): 'claim a Founder Lifetime seat (limited to the first 500 supporters)'. Versus founderSeats.js FOUNDER_SEAT_CAP = 30, pricing.js TIERS.founder.seatLimit: 30, en.js:399 '{remaining} of 30 seats remaining.', and create-checkout FOUNDER_SEAT_LIMIT = 30.
- Why: A $99 lifetime purchase is sold on 30-seat exclusivity, then the thank-you receipt tells the buyer they are one of 500 — a paid-surface contradiction that undermines the exclusivity pitch and could read as bait-and-switch in a refund dispute. (The welcome email also tells a just-signed-up user to 'sign up' and mentions 'first three saves' where saves, not generations, are capped — same stale-copy family.)
- Fix shape: Update both templates to the canonical 30-seat language (source the number from pricing.js TIERS.founder.seatLimit in the template payload rather than hardcoding), and extend the pricing contract test to scan emailTemplates for seat-count literals.
- Verdict: _pending Opus verification_

**[lib-infra-9] LOW / confirmed — cap_warning email states the anonymous cap 'resets at midnight UTC' but the counter resets at local midnight**
- Where: `src/lib/emailTemplates.js:149` | Category: copy-contract
- Evidence: Template: 'The cap resets at midnight UTC.' — anonGenCounter.js todayKey() uses now.getFullYear()/getMonth()/getDate() (local time), so the reset is the browser's local midnight.
- Why: Behavior/copy drift on a user-facing promise (currently latent because notifyCapWarning is never called — see the lifecycle-email finding — but it will bite the day that wiring lands).
- Fix shape: Change the copy to 'resets at midnight (your local time)' or switch todayKey to UTC; pick one and pin it.
- Verdict: _pending Opus verification_

**[lib-infra-10] LOW / probable — Local saves backend: localUpdate/localDelete use strict id equality while sibling functions String()-coerce — a string id silently no-ops**
- Where: `src/lib/saves.js:472` | Category: dual-backend-integrity
- Evidence: localUpdate: saves.findIndex(s => s.id === id); localDelete: filter(s => s.id !== id). Same file, localMutateBatch (509-514) and localReactivateFreeSettlement (489) deliberately compare String(s.id) === String(id) because local ids are Date.now() numbers.
- Why: In local (unconfigured) mode any caller that passes a stringified id — e.g. one derived from the /settlements/:id route param, which is always a string — silently fails to update or delete, with no error. The intra-file inconsistency shows the mixed-type hazard was known and fixed in only half the functions.
- Fix shape: String()-coerce the comparison in localUpdate and localDelete to match the batch/reactivate functions; add a local-mode test updating by String(id).
- Verdict: _pending Opus verification_

**[lib-infra-11] LOW / confirmed — forceLayout uses Math.random() for coincident nodes despite the module's own determinism guarantee**
- Where: `src/utils/graphLayout.js:90` | Category: determinism
- Evidence: Comment (line 63): 'Seed deterministically from node IDs so the same graph produces the same layout across runs (no jitter)'. Lines 90-92: `dx = (Math.random() - 0.5) * 0.01; dy = (Math.random() - 0.5) * 0.01;` when two nodes coincide.
- Why: Not an engine path (no constitution breach — this feeds the campaign PDF/UI only), but the file's stated invariant is violated exactly when the seeded initial positions collide, so two exports of the same campaign can lay out differently. Cheap to make honest.
- Fix shape: Replace the escape jitter with a deterministic offset derived from the pair's ids (the seed() helper is right there).
- Verdict: _pending Opus verification_

**[lib-infra-12] LOW / confirmed — main.jsx entry_route_kind classifier tests URL prefixes ('/dossier', '/s/') that no route ever produces**
- Where: `src/main.jsx:39` | Category: analytics-taxonomy
- Evidence: entry = p === '/' ? 'home' : p.startsWith('/dossier') || p.startsWith('/s/') ? 'dossier' : p.startsWith('/gallery') ? 'gallery' : … — routes.js defines /settlements/:id and /gallery/:slug; no /dossier or /s/ path exists in ROUTES or PARAM_ROUTES.
- Why: session_started's entry_route_kind 'dossier' can never fire, and a settlement deep-link (the most dossier-like entry) counts as 'other' — the funnel's entry-point dimension is quietly wrong.
- Fix shape: Classify on the real route table (p.startsWith('/settlements/') → 'dossier'), ideally via resolveLocation so the classifier can't drift from routes.js again.
- Verdict: _pending Opus verification_

**[lib-infra-13] LOW / confirmed — src/utils/helpers.js is an empty stub — a JSDoc header for groupBy with no code and no importers**
- Where: `src/utils/helpers.js:1` | Category: dead-code
- Evidence: The 11-line file ends at the close of the groupBy JSDoc block; no function body, no exports. Grep finds zero importers.
- Why: Dead file; trivially misleads searches and inflates the utils surface.
- Fix shape: Delete it.
- Verdict: _pending Opus verification_

**[lib-infra-14] LOW / confirmed — mapBridge.destroy() never settles a pending ready() promise — callers awaiting readiness across teardown hang forever**
- Where: `src/lib/mapBridge.js:232` | Category: robustness
- Evidence: destroy() rejects pending RPCs and queued calls but only nulls readyPromise (line 251); _readyReject (line 35) is assigned and never invoked — the underscore prefix admits it is unused.
- Why: A component that awaits bridge.ready() and unmounts (reloadKey bump in useMapBridge tears the bridge down) leaves that await permanently pending. Usually harmless (the awaiting closure is unmounted too) but it is an unresolvable promise leak and the _readyReject scaffolding shows the intent existed.
- Fix shape: In destroy(), call _readyReject(new Error('Bridge destroyed')) when readyResolved is false.
- Verdict: _pending Opus verification_

**[lib-infra-15] LOW / confirmed — Beacon flush is allowed while a fetch flush is in flight — the same records can be delivered twice and late-enqueued records can be drained undelivered**
- Where: `src/lib/analyticsQueue.js:257` | Category: analytics-transport
- Evidence: if (_inFlight && !beacon) return; — a pagehide beacon posts an envelope containing the records the in-flight fetch is also delivering; each build mints a fresh batchId (uuid()), so server upserts keyed on batch_id,seq cannot dedupe across the two posts. If both succeed, drain() runs twice and the second splice removes records enqueued after the beacon that were never sent.
- Why: Duplicate first-party events on tab-close races (funnel inflation) plus a narrow undelivered-drop window. Deliberate last-chance tradeoff per the comment, but the double-drain half is fixable without losing the beacon.
- Fix shape: Stamp a stable batchId per queue-generation (regenerate only after a successful drain) so server-side upsert dedupes the double-post, or have the beacon path mark records as sent so the fetch resolution doesn't re-drain.
- Verdict: _pending Opus verification_

**[lib-infra-16] LOW / confirmed — Nit batch: small polish items**
- Where: `src/lib/analyticsProvider.js:108` | Category: nit-batch
- Evidence: (1) analyticsProvider toPascal joins with spaces ('Homepage View') while the comment claims PascalCase mapping. (2) flags.js fromUrl re-parses URLSearchParams and writes localStorage on EVERY flag() call in render paths; a crafted ?flag.X=false link silently persists a killswitch for that user with no visible UI to clear it. (3) Two parallel last-visit stamps exist (lib/session.js 'sf_last_visit' vs hooks/useReturnVisit.js 'sf:last_visit_at') with duplicated stampVisit logic. (4) saves.js localSaveEntry can duplicate rows when called with an existing id (unshift, no replace). (5) copy memory drift: memory says support default is support@settlementforge.com but copy/support.js defaults to settlementforge@gmail.com (owner confirmation already queued — verify which is truth before deploy).
- Why: Individually trivial; batched per the 20-finding cap.
- Fix shape: One small hygiene pass: fix the toPascal comment or mapping, memoize flags URL parsing per page load, unify the visit stamps, guard localSaveEntry against existing ids, reconcile the support-email memory with code.
- Verdict: _pending Opus verification_


### Slice: tests (grade A-)

**[tests-1] HIGH / confirmed — VERIFY_DIST anti-vacuity hard-fail is claimed in CI comments but implemented by nothing in this tree**
- Where: `.github/workflows/ci.yml:106` | Category: gate-vacuity
- Evidence: ci.yml:106 'AFTER the build with VERIFY_DIST=1, which turns a missing dist/ into a HARD failure so a chunk contract can never count green having verified nothing'; package.json:32 'verify:dist': 'VERIFY_DIST=1 vitest run tests/build/'. Grep of the whole main tree: no test reads VERIFY_DIST; tests/build/vendorPdfLazy.test.js:336 gates on describe.runIf(distExists) only. The sibling lineage (.claude/worktrees/awesome-ritchie tests/build/vendorPdfLazy.test.js:39-43) HAS the guard: `const requireDist = process.env.VERIFY_DIST === '1'; it('dist/ + dist/assets exist when VERIFY_DIST=1 ...')`.
- Why: The first-paint closure budget (constitutional law 5) is the exact gate that once went vacuous and let +293B ride green (documented in vendorPdfLazy's own header). If dist/ is missing or the CI step ordering ever regresses, every dist contract — including CLOSURE_BUDGET_BYTES — skips silently and verify:dist exits 0. The claim/behavior drift also sits outside enforcement-claims.test.js's corpus (ci.yml and package.json are not in DOC_FILES), so the meta-pin cannot catch it.
- Fix shape: Port the awesome-ritchie requireDist guard into tests/build/vendorPdfLazy.test.js (an unconditional `it` that fails when VERIFY_DIST=1 and dist/assets is absent). Optionally add ci.yml + package.json to enforcement-claims' corpus so gate-behavior claims in CI wiring are pinned. Flag for the master-merge reconciliation so the guard survives from whichever lineage carries it.
- Verdict: _pending Opus verification_

**[tests-2] HIGH / confirmed — The deity and spatial worldpulse goldens thread a STALE regionalGraph every tick — the evolved graph is discarded**
- Where: `tests/property/worldpulseDeityGolden.test.js:138` | Category: golden-fidelity
- Evidence: worldpulseDeityGolden.test.js:138 and worldpulseSpatialGolden.test.js:145: `campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.worldState?.regionalGraph || campaign.regionalGraph }`. pulseKernel.js:1898 returns the evolved graph as TOP-LEVEL `regionalGraph: applied.regionalGraph` — worldState never carries a regionalGraph key (grep src/domain/worldPulse/worldState.js: zero hits) — so the fallback always re-supplies the tick-0 graph. Sibling harnesses do it right: beliefMapGolden:91, rumorLedgerGolden:90, worldpulseSeasonsGolden:128, seasonsMiniSoak:97 all thread `r.regionalGraph`.
- Why: These are the two flagship law-1 pulse pins ('the fixture's FIRST real pin' and the spatial-modulation golden). With the graph frozen at tick 0, queued impacts, relationship evolution, and arrival-release-into-queuedImpacts are dropped between ticks, so the pinned run mutes exactly the cross-settlement propagation seam the spatial golden's header claims to pin ('propagation ARRIVAL DELAY ... queued-impact count'); the projection's queuedImpacts component (spatialGolden:157-159 reads campaign.regionalGraph) is permanently the initial count — an inert hash component. Drift in the propagation/regional layer would not trip these goldens.
- Fix shape: Change both harnesses to `regionalGraph: r.regionalGraph || campaign.regionalGraph` (the sibling idiom), and read queuedImpacts from the threaded graph. This legitimately shifts both golden manifests — one-time UPDATE_GOLDEN regen, owner-signed per the golden-regen protocol, recorded as a harness-fidelity fix (engine bytes untouched). Batch with the Wave-5 owner-gated regen queue if desired.
- Verdict: _pending Opus verification_

**[tests-3] MEDIUM / confirmed — Eight pglite money/security execution suites are silently skippable: describe.runIf on migration-file existence with no unconditional existence assertion**
- Where: `tests/security/creditLedger.pglite.test.js:98` | Category: gate-vacuity
- Evidence: creditLedger.pglite.test.js:98 `describe.runIf(allExist)(...)` where allExist = every(existsSync) over 5 named migration paths; same pattern with no guard in feeSchedule:99, profileEscalation:93, actionVelocity:70, galleryDmFull:80, gallerySanitize:75, galleryViewDedup:32, emailPreferences:38. The house pattern for closing this exists: migrationSequenceAll.pglite.test.js:54 'migration chain exists (guards against silent vacuous skip)' and creditBalanceIdorGuard.pglite.test.js:36 `expect(allExist).toBe(true)`.
- Why: A renamed/renumbered migration (spend_credits 024, refund 123, the IDOR-guarded balance reader 110, RLS policies) turns the ENTIRE spend/refund/RLS execution battery into a green no-op. The imminent master merge must reconcile two divergent migration chains (memory: third-lineage-mystifying-ride, THE named high-risk item) — exactly the operation that renames/renumbers migrations — so the highest-consequence suites would go dark precisely when they matter most.
- Fix shape: One unconditional `it('fixture migrations exist')` per suite (copy creditBalanceIdorGuard's line), or better: a shared helper `requireMigrations(MIG)` that registers the existence assertion and returns allExist, adopted by all 8 suites — structural prevention over 8 hand-fixes.
- Verdict: _pending Opus verification_

**[tests-4] MEDIUM / confirmed / KNOWN-DEFERRED — pipeline.property seed-sensitivity runs ~400 full generations under the root 20s timeout — a documented machine-load red in the full gate**
- Where: `tests/property/pipeline.property.test.js:142` | Category: flake
- Evidence: Lines 128-142: `fc.assert(fc.property(configArb, (config) => { for (let i = 0; i < 8; i++) { const a = gen(...); const b = gen(...); ... } }), { numRuns: 25 })` with no per-test timeout; vite.config.js testTimeout: 20000. PHASE55_ROUND21_BACKLOG_PLAN.md progress note: 'ONE PRE-EXISTING env red: pipeline.property seed-sensitivity times out at 20s under machine load ~273 — CONFIRMED identical on untouched base 5ea117ec'.
- Why: A known load-dependent red in the constitutional full-gate battery trains gate-red fatigue on the exact suite the manager checklist re-runs on every wave; the repo already established the precedent fix (generatorGoldenMaster carries an explicit 120_000 allowance with a comment naming the wall-clock false-positive class).
- Fix shape: One-line explicit timeout on the seed-sensitivity test (e.g. 60_000) with the standard 'wall-clock false positive, not drift' comment. The deferral is recorded only as an observation in a progress blockquote, not a rationaled deferral — under-recorded for a recurring gate red.
- Verdict: _pending Opus verification_

**[tests-5] MEDIUM / confirmed — The PDF golden — the third leg of the 'three golden masters' — pins one seed, 19 fields, one rendered section**
- Where: `tests/pdf/goldenViewModel.test.js:40` | Category: test-coverage
- Evidence: goldenViewModel.test.js:40-41: `const CFG = { settType: 'town', culture: 'germanic', ... }; const SEED = 'parity-town-2026';` — a single config/seed; SHARED_FIELDS has 19 facts (grep -c 'fact:' parityContract.js = 19); render-leaf assertions cover only Overview's prosperity label + institutions count. The generator golden pins ~190 configs × full-JSON sha256; the worldpulse goldens pin 4+2 multi-tick corpora.
- Why: The PDF layer is this codebase's historically worst wrong-field hotspot (16 of the 133 REVIEW_FINDINGS were 'PDF reads a field that does not exist / never renders'). A parity contract of 19 facts on one town cannot catch tier/terrain/faith-war-dependent sections regressing to blank — the exact past failure class. (missingValuePlaceholders + sections.smoke soften but do not pin values.)
- Fix shape: Widen the golden corpus to a handful of tier-diverse seeds (thorp/city/metropolis, one spatial-campaign save) and snapshot SHARED_FIELDS per seed; extend render-leaf checks to the sections that previously shipped dead reads (Defense, Resources, Viability, Services). Cheap: the harness already exists.
- Verdict: _pending Opus verification_

**[tests-6] LOW / confirmed — M10b catch-up determinism pin compares worldState only — savedSettlements, regionalGraph, and wizardNews are outside the byte-equality**
- Where: `tests/store/catchUpCampaignWorld.test.js:137` | Category: test-coverage
- Evidence: Line 137: `expect(JSON.stringify(ws(caught))).toBe(JSON.stringify(ws(manual)))` where ws = campaigns[0].worldState. The advance also mutates state.savedSettlements (campaignWorldPulseSlice.js:687-692), c.regionalGraph and c.wizardNews — none compared. The playbook (§0.6.1) states 'catch-up == N manual advances, byte-identical'.
- Why: Today the equality holds by construction (both paths loop the same action), but the pin exists to catch a future catch-up rewrite (e.g. batching into one interval call) — a rewrite that diverges only in settlement writes, news minting, or graph evolution would pass the pin while violating the stated guarantee.
- Fix shape: Extend the comparison to JSON.stringify of { worldState, regionalGraph, wizardNews } from campaigns[0] plus savedSettlements — three extra lines, no golden impact.
- Verdict: _pending Opus verification_

**[tests-7] LOW / confirmed — Two e2e tests are vacuous relative to their names: flow-b 'modal closes' asserts nothing; flow-a 'state persistence' asserts only that the body has text**
- Where: `e2e/flow-b-auth-credits-ai.spec.js:172` | Category: vacuous-test
- Evidence: flow-b:172-188 ends 'the test simply asserts the backdrop area is interactive. Strict close-on-escape is left to the unit tests' — the block contains zero expect() calls after the interactions. flow-a:230-249 'returning to the page preserves generated settlement (state persistence)' asserts only `expect(hasContent.length).toBeGreaterThan(50)` with the comment 'We don't strictly require persistence here'.
- Why: In a suite whose signature discipline is anti-vacuity (e2eNotVacuous, runIf guards, probative soak preconditions), two always-green tests with load-bearing names inflate the perceived e2e coverage of modal lifecycle and reload persistence — surfaces with real past findings (Dialog focus management; save resurrection bugs).
- Fix shape: Either assert the real behavior (modal closed via close-button locator; settlement name survives reload in LOCAL mode where persistence IS the contract) or rename to what they test ('backdrop interaction does not crash', 'reload does not crash').
- Verdict: _pending Opus verification_

**[tests-8] LOW / confirmed — Nit batch: mutation sweep omits the constitution's own gates; local mobile e2e runs desktop journeys; dead env plumbing**
- Where: `scripts/mutation-sweep.sh:59` | Category: test-coverage
- Evidence: mutation-sweep.sh mutations 1-8 cover eslint bans/governance/parity/meta-pin/undo but no planted tuning-constant vs the three golden masters, no CLOSURE_BUDGET_BYTES bump, no dormancy-marker leak; flow-a/flow-b/regional-causality lack the `test.skip(mobile-safari)` guard the other five specs carry, so a local `npm run test:e2e` runs desktop journeys under iPhone-13 WebKit (CI unaffected — projects pinned); package.json:32 sets VERIFY_DIST=1 which nothing consumes (same root as the first finding).
- Why: The weekly mutation sweep is the proof the enforcement spine holds; the constitutional laws (goldens, budget ratchet, dormancy) are its highest-value un-swept invariants. The mobile-project gap is a local-only flake surface that erodes 'run the e2e suite' as a clean local gate.
- Fix shape: Add 2-3 sweep entries (nudge a MIGRATION_TUNING constant → expect the mover pins/goldens red; +1 CLOSURE_BUDGET_BYTES with a planted eager import → expect verify:dist red); add the standard mobile skip to the three specs; remove or implement the VERIFY_DIST env var per finding 1.
- Verdict: _pending Opus verification_


### Slice: experience-product-fit (grade B+)

**[experience-product-fit-1] HIGH / confirmed — M10b living/autonomous catch-up only fires from the Realm Inspector's Pulse tab — the world does NOT move on most open paths**
- Where: `src/components/map/WorldPulsePanel.jsx:46` | Category: lifecycle
- Evidence: useEffect(() => { if (!campaignId || !advancesOnOpen(progressionRules) || caughtUpIds.current.has(campaignId)) return; ... catchUpCampaignWorld(campaignId) — this is the SOLE live trigger: WorldMapStage's mount is dead (WorldMap.jsx:852 pins showingWorldPulse={false}), RealmInspector defaults closed with section 'dashboard' (useRealmInspector.js:87-88), and RealmMobileGate renders only RealmDashboard.
- Why: The flagship M10-complete promise ('the world moves while you're away') requires the DM to open Realm → Inspector → Pulse Results before anything advances. Opening the campaign, the Realm map, the dashboard, the chronicle, the dossier, or anything on mobile shows a stale world — and the dashboard then silently changes after visiting Pulse. The shipped trigger also deviates from the owner-vetted §0.6.1 design decision 2 ('on setActiveCampaign of an advancesOnOpen campaign'); the ledger records the deviation but not its experience consequence.
- Fix shape: Move the catch-up trigger to campaign activation (setActiveCampaign / useCampaignAutoResume) or at minimum Realm entry + inspector open, keeping the cursor-dedup. The action already exists on the store; the trigger is a placement change, budget-free (fires from already-eager campaign paths or a lazy Realm hook).
- Verdict: _pending Opus verification_

**[experience-product-fit-2] HIGH / confirmed — The Wave-A belief read-model (fog-of-war made watchable) has zero UI consumers — built, tested, invisible**
- Where: `src/domain/display/settlementBeliefs.js:1` | Category: immersion
- Evidence: Header: "the 'what they believe vs what is true' band for the DM ... the fog of war made watchable ('B believes A negligible; A is formidable; B is about to march')". grep across src/ + tests/: only importers are the module itself and tests/domain/settlementBeliefs.test.js — no component, no tab, no inspector section.
- Why: The checkpoint definition of done (playbook PART 5 #2) requires 'belief-sourced war posture with legible misjudgments'. Misjudgments partially surface as news events, but the belief-vs-truth divergence band — arguably the single most DM-compelling artifact of the whole spatial engine — is unreachable. A premium DM cannot see that a rival is about to march on a false belief until the war fires.
- Fix shape: A lazy 'Beliefs' surface on the RumorsTab pattern: either a third column / disclosure inside RumorsTab (DM-truth-gated, includeGroundTruth convention) or a Realm Inspector 'Beliefs' section. Both are lazy chunks → budget-free per the RumorsTab/M6d precedent; the read-model is finished and tested.
- Verdict: _pending Opus verification_

**[experience-product-fit-3] MEDIUM / confirmed — RegionWakeReplay — the anon 'watch a region wake up' living-world teaser — is built, copy-registered, domain-tested, and never mounted**
- Where: `src/components/home/RegionWakeReplay.jsx:1` | Category: dead-code
- Evidence: Header: 'rendered below HomeSampleDossier for anon visitors ... so a no-account user SEES the premium living simulation'. grep: no importer anywhere in src/ (WizardEmptyState mounts only HomeSampleDossier); the en.js replay.* namespace and domain/display/regionWakeReplay.js + its test all exist.
- Why: The anon funnel's one window into the premium product in motion (pre-baked deterministic frames through the real projections) is dark. Anon visitors see living-world artifacts only as static cards on the /home landing; the /create empty state — where the generation-hooked audience actually is — never shows the world move.
- Fix shape: Mount it as documented: below HomeSampleDossier in WizardEmptyState (lazy, self-gating on anon + !settlement). Verify the pricing-moment routing note in its header still holds; it is already a lazy chunk so first-paint is untouched.
- Verdict: _pending Opus verification_

**[experience-product-fit-4] MEDIUM / confirmed — Anon Basic-mode banner contradicts the tier gate and every other anon-ceiling copy: names 'Thorp, Hamlet, or Village' where the ceiling is Town**
- Where: `src/components/GenerateWizard.jsx:413` | Category: copy-accuracy
- Evidence: 'Free mode: generating Thorp, Hamlet, or Village. Sign in for all settlement tiers.' — but TIER_GATE.anon.maxTier === 'town' (authSlice.js:36), HomeHero's anon picker is ['hamlet','village','town'], and the landing says 'Without an account, forge up to a Town.'
- Why: Reachable on the main anon path (hero-generate → Back lands on the basic config screen since wizardMode stays 'basic' and anon skips the exit confirm). The conversion surface tells an anon their ceiling is a tier lower than it is, contradicting the at-cap card ('You’ve explored hamlet, village, town') shown minutes later.
- Fix shape: One-line copy fix: 'Free mode: generating up to Town size. Sign in (free) for every size.' — ideally moved into en.js per the single-registry rule (this string is a component literal).
- Verdict: _pending Opus verification_

**[experience-product-fit-5] MEDIUM / confirmed / KNOWN-DEFERRED — Map-as-legibility deferral under-scopes: ~8 of 11 mover systems have no read surface, and the blanket 'eager → parked behind FP-2' rationale ignores the repo's own budget-free lazy-surface precedent**
- Where: `docs/PHASE55_ROUND21_BACKLOG_PLAN.md:63` | Category: sim-legibility
- Evidence: Consumer inventory (grep, src/components): settlementRumors ✓, tradeFlowEconomics ✓, newsVoice ✓; embattlement/supplyShipments/armyTransit/smuggle/seaLanes/commodityFlow/entrepots/dispatchEV/moralDrift/beliefMap → NONE. supply_starved appears in zero components/display models. Map overlays (WarFaithMapOverlay, LiveWarStatus, RealmDashboard) read only the pre-spatial war ledgers.
- Why: The living world is legible almost exclusively through the news feed (movers do emit wizardNews — plague arrivals, calamity strikes, field battles — so the feed genuinely mitigates). But the engine's richest continuous state (embattlement levels, supply fragility/failover, migration flows, sea lanes, entrepôt earnings, smuggle channels) is invisible even in the Realm Inspector, and the deferral text scopes the fix as 'heavy eager UI' on the map only. RumorsTab and M6d's EconomicsTab section prove lazy dossier/inspector read-models cost zero eager bytes — roughly half this gap does not need the FP-2/budget decision it is parked behind.
- Fix shape: Split Wave 10: (a) budget-free lazy tranche now — inspector sections / dossier disclosures for embattlement + supply links/fragility + migration + beliefs, all on the RumorsTab store-selector pattern; (b) keep the true map-render overlays (fronts/flows drawn on the realm map) behind the eager budget decision.
- Verdict: _pending Opus verification_

**[experience-product-fit-6] LOW / confirmed — Mobile users have no navigation path to the Realm — including the read-only mobile dashboard built specifically for them**
- Where: `src/App.jsx:82` | Category: ux
- Evidence: MOBILE_NAV_PRIORITY = ['generate', 'settlements', 'gallery', 'compendium', 'howto'] with the comment 'The Realm is omitted ... its routes still resolve' — yet RealmMobileGate.jsx exists precisely to serve phones ('an honest "open on desktop" wall plus the one read-friendly component, the read-only Realm Dashboard').
- Why: A premium DM on a phone can check the state of their living world only by typing /realm into the URL bar. The mobile dashboard (and its anon/free pricing-moment teaser) is stranded; combined with the Pulse-tab-only catch-up trigger, a living/autonomous world is fully unreachable from mobile.
- Fix shape: Add Realm to the mobile nav (6th slot or replace howto) routing to RealmMobileGate, or surface a 'State of the Realm' card with a /realm link on the mobile Library/campaign view. Nav is data-driven from routes.js so this is a small change.
- Verdict: _pending Opus verification_

**[experience-product-fit-7] LOW / confirmed — Dossier tab Suspense fallback renders the literal text 'Loading…' (JSX text does not process unicode escapes)**
- Where: `src/components/OutputContainer.jsx:849` | Category: polish
- Evidence: >Loading…</div> — inside JSX text content, unlike the sibling JS-string usages ('Regenerating…' at line 843, which are correct).
- Why: Every first activation of a lazy dossier tab briefly shows 'Loading…' verbatim on the flagship reading surface — reads as data corruption, the exact artifact class the earlier stripped-glyph sweep cleaned up.
- Fix shape: Replace with {'Loading…'} or the literal ellipsis character, matching common.loading in en.js.
- Verdict: _pending Opus verification_

**[experience-product-fit-8] LOW / confirmed — Landing overclaims 'prices move' while numeric prices are deliberately backlog-frozen (M6d ships qualitative bands only)**
- Where: `src/copy/landing.js:111` | Category: copy-accuracy
- Evidence: realm.body2: 'Then advance time. Wars ignite and resolve, faiths rise, prices move, and every change tells you why.' — vs playbook: 'NUMERIC PRICES (backlog-frozen) — stock levels surface as qualitative shortage/adequate/surplus' and EconomicsTab's 'Qualitative only ... never a numeric price'.
- Why: A Cartographer buyer primed by the landing to watch prices move finds shortage/adequate/surplus bands. Small, but this page is the product's honesty showcase (real receipts, deterministic seed stamps) — the one unsupported claim stands out. The adjacent tier line 'Up to three forges a day, completely randomized' is similarly loose (anon picks the size).
- Fix shape: Copy-only: 'markets tighten and glut' / 'trade shifts' instead of 'prices move'; drop 'completely randomized' or say 'rolled fresh each time'. Alternatively, the round-21 numeric-prices lazy read-model (Wave 7, already triaged budget-free) would make the claim true — either direction closes it.
- Verdict: _pending Opus verification_

**[experience-product-fit-9] LOW / confirmed — Docs drift: critique-status doc says summaryMagazineV2/tableView are default-off pending sign-off (both now default-on); LandingArtifacts header cites fixture seed lf-010 (actual lf-033)**
- Where: `docs/critique-implementation-status.md:194` | Category: docs-drift
- Evidence: 'The default-off flags remain, two pending design sign-off: summaryMagazineV2, tableView' — but flags.js:119-126 has both default: true ('Replaces single-column layout'). LandingArtifacts.jsx:5 says 'seed lf-010' while landingFixture.js is '"seed": "lf-033"'.
- Why: A successor session trusting the status doc would believe the magazine summary and table view are unshipped; the stale seed comment misdirects fixture regeneration (the regen policy depends on knowing which seed is live).
- Fix shape: Two one-line doc edits: update the closeout note to 'promoted default-on', and fix the lf-010 reference (or replace with 'see landingFixture.js provenance' so it can never drift again).
- Verdict: _pending Opus verification_

**[experience-product-fit-10] LOW / confirmed — Nit batch: register and consistency one-liners**
- Where: `src/copy/en.js:121` | Category: polish
- Evidence: (1) sizes.thorp renders 'Thorpe' while onboarding copy says 'Thorp is small' and the tier key is thorp; (2) moments.map_clicked says 'World Map unlocks with Cartographer' though the Realm is reachable free (only live controls lock); (3) 'Wizard News' panel title is ambiguous register (engine feed name leaked into the DM surface) beside the otherwise in-world 'The Chronicle'; (4) workshop.upgradeCta '$6/mo' + LockedDestination default vs the actual $5.99 (workshop is retired copy, but LockedDestination is live); (5) WorldPulsePanel speaks console ('Roll 34% · Chance 45% · Severity 62%') beside the fiction-voiced feed — the recorded B+ experiential-voice item's largest remaining surface.
- Why: Individually cosmetic; together they are the residual gap between the A+ copy system and full register coherence on the newest surfaces.
- Fix shape: One copy sweep commit: unify Thorp(e), soften map_clicked to 'The Realm's live controls unlock with Cartographer', consider 'Realm News'/'Word on the Roads' for the feed title, align $5.99, and give WorldPulsePanel's stat pills a voice-sidecar treatment in the round-21 program.
- Verdict: _pending Opus verification_


### Slice: performance-scale (grade B)

**[performance-scale-1] HIGH / confirmed — regionalGraph.queuedImpacts is never pruned and is fully re-normalized ~12+ times per tick — per-tick cost and persisted size grow with campaign age**
- Where: `src/domain/region/graph.js:265` | Category: unbounded-ledger
- Evidence: graph.js:265 `const queuedImpacts = dedupeById((graph.queuedImpacts || []).map(impact => normalizeImpact(impact, now))...)` — no cap, no removal; advanceRegionalImpacts (861-877) only flips status ('expired'), setRegionalImpactStatus flips to 'resolved' (applyWorldPulse.js:1053); repo-wide grep finds zero code that ever removes a row. eventLog directly above IS capped ('Cap heals legacy saves (H18)', graph.js:261-264) — impacts got no such cap.
- Why: Every pulse mints new impacts (propagation per outcome per settlement, arrivals, realm events); dead applied/expired/resolved rows accumulate forever. ensureRegionalGraph re-normalizes EVERY row (fresh object per impact) and is called from buildWorldSnapshot (~9x/tick per worldSnapshot.js:21 comment), advanceRegionalImpacts (twice), applyWorldPulse entry, and every addRegionalChannels/syncRelationshipChannelBundle — so tick cost rises linearly with campaign age. The graph also rides every persist (Supabase campaign row + localStorage cacheCampaignState + each of 10 undo snapshots), so a multi-year living-realm campaign — the product's headline use case — gets slower and heavier the longer it lives. This is the exact 'unbounded conditionally-materialized ledger' the slice brief asks about, and it is the biggest one.
- Fix shape: Add a retention policy in ensureRegionalGraph (the one choke point): keep queued + recent-N terminal rows (e.g. resolved/expired/applied older than K ticks drop, or a hard MAX_QUEUED_IMPACTS ring like eventLog's). Terminal rows already emit their news at transition time, so dropping old ones is display-safe; goldens only span a few ticks so a >K-tick retention window keeps them byte-identical. Alternatively split terminal rows into a capped archive array. Gate with a growth test (soak N ticks, assert queuedImpacts length bounded).
- Verdict: _pending Opus verification_

**[performance-scale-2] HIGH / confirmed — ensureWorldState deep-clones every conditional ledger — including the immutable ~47-400KB spatialDigest and the whole spatialLedgers namespace — on each of ~11 calls per tick**
- Where: `src/domain/worldPulse/worldState.js:335` | Category: deep-clone-frequency
- Evidence: worldState.js:335-338 `for (const key of CONDITIONAL_LEDGER_KEYS) { ... const cloned = deepCloneConditionalLedger(raw?.[key]); }` with keys incl. 'spatialDigest', 'spatialLedgers' (295-299). Called per tick from pulseKernel:247 + nextWorldStateForPulse (150), every buildWorldSnapshot (worldSnapshot.js:79; its own comment: 'advanceCampaignWorld rebuilds the snapshot up to ~9x per tick'), and appendPulseHistory (worldState.js:513).
- Why: The digest is documented immutable ('authored ONCE ... never recomputed', worldState.js:225-231), yet it is structuredClone'd ~11x per one-week tick, along with stressors (cloneStressors deep-clones each), 4 always-on ledgers, and every spatial mover sub-ledger (rumors, beliefs at up to observers x factions x subjects records, shipments, stocks). At the 30-settlement envelope this is the dominant per-tick allocation churn — order 1-5MB of transient clones per tick, x1,560 ticks in a 30-year soak, x52 in every one-year advance. Pure waste for the frozen digest; snapshot rebuild clones are discarded immediately.
- Fix shape: Two-part, both constitution-safe: (a) share the frozen digest by reference — Object.freeze it at canonize and have deepCloneConditionalLedger pass 'spatialDigest' through by reference (byte-output identical; the no-alias invariant holds because nothing may write it — enforce with a freeze + a mutation test); (b) add an 'already-ensured' brand (non-enumerable symbol or WeakSet) so ensureWorldState fast-paths re-ensures of its own output — buildWorldSnapshot and appendPulseHistory always receive already-ensured state mid-tick. Both leave serialized bytes untouched (goldens prove it by running).
- Verdict: _pending Opus verification_

**[performance-scale-3] HIGH / confirmed — Per-tick digest identity churn defeats every distanceRead WeakMap memo — candidate routes are re-Dijkstra'd every tick, contradicting the design's 'cached at canonize, never re-pathfound per tick'**
- Where: `src/domain/spatial/distanceRead.js:953` | Category: memo-defeat
- Evidence: distanceRead.js:951-953 `/** Per-digest candidate-route cache: digest → ... */ const CANDIDATE_MEMO = new WeakMap();` keyed on digest OBJECT identity, with the module claiming routes are 'derived once ... and every per-tick read is a cache hit' (806-807) per §II.4 'cached at canonize, never re-pathfound per tick' (803-805). But ensureWorldState deep-clones spatialDigest every tick (worldState.js:337), so the mover-facing digest is a NEW identity each tick (pulseKernel:250 via nextWorldStateForPulse) — CANDIDATE_MEMO, ADJ_MEMO, CALIBRATION_MEMO, SEA/TELEPORT/PORT memos all miss at every tick start.
- Why: Every tick re-runs the full Dijkstra battery (primary + one detour-Dijkstra per primary edge, per O-D pair used) for supply links (settlements x imported goods x K sources), entrepot crossings (chooseRoute per active shipment, entrepots.js:245-254), army marches, migration, rumor relays, plus a full O(N^2) distanceMatrix calibration rescan and adjacency rebuilds. shortestPath is the O(V^2)-frontier variant (distanceRead.js:904-913), fine per call at 30 nodes but multiplied by hundreds of calls x 1,560 soak ticks. The caching architecture is right; the identity churn silently voids it — the memos only ever help WITHIN one tick. Magnitude is an estimate (order 10-40ms/tick at the envelope max with commodity flow on) but the mechanism is structural.
- Fix shape: Falls out of finding #2(a): a single frozen, reference-stable digest restores every WeakMap memo to true once-per-canonize semantics with zero API change. If reference-sharing is rejected, key the memos on digest content (spatialGeometryVersion + costLawVersion + overlayVersion + canon version string) in a bounded Map instead of object identity.
- Verdict: _pending Opus verification_

**[performance-scale-4] HIGH / confirmed — catchUpCampaignWorld runs up to 26 sequential FULL store advances on campaign open — 26x full-campaign deep-clones, 26 synchronous multi-MB localStorage writes, 26 awaited cloud syncs**
- Where: `src/store/campaignWorldPulseSlice.js:458` | Category: perf-store-path
- Evidence: campaignWorldPulseSlice.js:458-465 `for (let i = 0; i < n; i++) { const result = await get().advanceCampaignWorld(campaignId, 'one_week', ...) }` — each iteration runs capturePulseSnapshot (deep clone of worldState+graph+wizardNews+EVERY member save, campaignPulseHelpers.js:182-206), cloneJson(c)+cloneJson(settlements) sim lifts, cacheCampaignState (deepClone ALL campaigns + localStorage write, campaignSliceShared.js:115-120), and an awaited flushWorldPulsePersist + syncCampaignSnapshot. Contrast: the multi-tick advance's own comment — 'the snapshot/drain/commit/persist/analytics scaffolding below runs ONCE per Advance regardless of tick count' (campaignAdvanceSession.js:100-102).
- Why: Opening a stale autonomous 30-settlement campaign (the M10b flagship 'world moves while you're away' feature) serializes ~26 x (3+ full-campaign deep clones + a synchronous multi-MB JSON.stringify/localStorage.setItem on the main thread + a cloud round-trip + per-week analytics). That is plausibly 5-15s of open-time latency and jank, plus 26 undo-stack pushes churning the cap-10 ring so the DM cannot undo past the catch-up anyway. The one-commit interval orchestrator already exists and is proven byte-identical to N manual one-week ticks (the M10b determinism pin's own argument), so the N-fold store scaffolding buys nothing except a simpler pin.
- Fix shape: Route catch-up through simulateCampaignWorldInterval (ticksTotal=n, autoResolve per living/autonomous, worker-eligible via runAdvanceInterval) with ONE snapshot/commit/persist — the existing paused-advance machinery already handles the 'living pauses on a major' semantics. Keep the JSON-equal determinism pin (interval == N manual advances is already the invariant advanceInterval documents). Owner-vetoable: changes the number of undo steps a catch-up creates (26 -> 1, arguably the better UX).
- Verdict: _pending Opus verification_

**[performance-scale-5] MEDIUM / confirmed — pulseRecord.rollExplanations is uncapped — every rolled candidate (passed AND missed, plus all deterministic outcomes) persists x 80 history records**
- Where: `src/domain/worldPulse/pulseKernel.js:1458` | Category: state-growth
- Evidence: pulseKernel.js:1458 `rollExplanations: [...deterministicExplanations, ...rollExplanations],` inside pulseRecord — no slice, unlike its siblings (`selectedOutcomes: selectedForApply.slice(0, 24)`, corruptionEvents/factionCaptureEvents/causeLifecycleEvents all `.slice(0, 24)`). candidateEvents.js:405 pushes an explanation for EVERY candidate (`rollExplanations.push(explanation); if (!passed) continue;`), each carrying gates/reasons strings and proposalPayload.
- Why: At 30 settlements with the war/faction/NPC lanes on, a tick can roll 100+ candidates; ~300B each puts a single record at 30-50KB and the MAX_HISTORY=80 ring at potentially 2-4MB of worldState — riding every Supabase campaign-row upsert, every localStorage cacheCampaignState write (quota-warned at ~5MB, campaignSliceShared.js:96), every undo snapshot, and shallow-cloned 80x per ensureWorldState call. The consumer reads 18: WorldPulsePanel.jsx:423 `rolls.slice(0, 18)`. This is the largest uncapped field in the persisted worldState.
- Fix shape: Cap the persisted explanations per record (e.g. keep all passed/deterministic + the first K missed, or slice(0, 48) after sorting passed-first) — a shape change to NEW records only, so existing goldens shift only if their fixture exceeds the cap (verify; pick the cap above current golden counts to stay byte-identical). The full set can still ride the RETURN value for the session UI without persisting.
- Verdict: _pending Opus verification_

**[performance-scale-6] MEDIUM / confirmed — No committed tick-cost or memory baseline exists at the 5-30 settlement envelope — the largest in-battery soak is 5 settlements x 40 ticks**
- Where: `tests/domain/worldPulseSoak.test.js:93` | Category: test-coverage
- Evidence: worldPulseSoak.test.js:93 `test('40 ticks across 5 settlements stays bounded, alive, and stable', ...)`; seasonsMiniSoak is 2 towns x 156 ticks; grep for performance.now/hrtime across tests/, tools/, scripts/ returns nothing; scripts/ contains only simulate-generations.mjs (generation-side; sim-report.json 'durationSec: 7.4' for 2,000 generations). The playbook's whole-world-soak (§ PART 5 checkpoint) is deferred to the next AI and is a behavior soak, not a cost gate.
- Why: The constitution ratchets first-paint bytes with machine enforcement (CLOSURE_BUDGET_BYTES) but nothing measures the OTHER performance axis the product lives on: tick cost and worldState/graph byte growth over a 30-year, 30-settlement, everything-on run. Findings 1-3 (age-linear graph cost, per-tick clone churn, memo defeat) are invisible precisely because no soak asserts wall-time-per-tick or serialized-size trends. The known checkpoint-soak deferral covers behavioral validation, not cost — this gap is unrecorded.
- Fix shape: Add a cost-envelope soak (can be a script + a loose CI test): 30-settlement fixture, everything-on, N hundred weekly ticks; assert (a) serialized worldState+regionalGraph bytes stay under a documented ceiling / grow sublinearly after warm-up, (b) mean tick wall-time trend is flat (last-quartile mean ≤ k x first-quartile mean) — trend assertions are machine-load tolerant where absolute ms budgets are not.
- Verdict: _pending Opus verification_

**[performance-scale-7] MEDIUM / confirmed — Apply loop re-serializes full settlements (JSON.stringify x2) per changed outcome application and graph-diffs per (outcome x affected save)**
- Where: `src/domain/worldPulse/applyWorldPulse.js:483` | Category: perf
- Evidence: applyWorldPulse.js:480-487 `function settlementChanged(...) { return JSON.stringify(beforeSettlement) !== JSON.stringify(afterSettlement); }` called per (outcome x affectedSaveId) at 846; on change, propagateRegionalEvent + `deriveWizardNewsEntriesFromGraphChange(beforeGraph, graph, ...)` (880) run per application, and that diff calls `ensureRegionalGraph` on BOTH graphs (wizardNews.js:558-559) — a full node/edge/channel/impact re-normalization x2 per outcome application.
- Why: A busy war tick applies 10-25 outcomes across multiple settlements; each changed application stringifies two full settlement JSONs (tens of KB each at city tier) and re-normalizes the whole regional graph twice more — multiplying finding #1's per-normalization cost by the outcome count. Copy-on-write upstream mostly guarantees reference inequality implies real change, making the stringify compare nearly redundant.
- Fix shape: Trust copy-on-write: treat reference inequality as changed (the sub-appliers already return the same reference on no-op), keeping the JSON compare only behind a debug flag; and make deriveWizardNewsEntriesFromGraphChange accept pre-ensured graphs (both call sites already hold normalized graphs) so the diff is a Map-lookup scan, not two re-normalizations.
- Verdict: _pending Opus verification_

**[performance-scale-8] LOW / confirmed — pulseUndoStack retains up to 10 full deep campaign snapshots per campaign — each duplicating the immutable spatial digest, full member-save set, and 240-entry feed**
- Where: `src/store/campaignAdvanceSession.js:46` | Category: memory
- Evidence: campaignAdvanceSession.js:46 `const PULSE_UNDO_CAP = 10;`; capturePulseSnapshot deep-clones `worldState` (incl. spatialDigest + pulseHistory), `regionalGraph`, `wizardNews`, and every member save's settlement+campaignState (campaignPulseHelpers.js:182-206), and campaignSliceShared.js:36 notes payloads run '~1.8MB @ 10 members'.
- Why: A long DM session advancing a 30-settlement campaign retains ~10 x (several MB) = tens of MB of session heap, most of it byte-identical copies of immutable data (the frozen digest, unchanged member saves). Session-scoped and capped, so bounded — but the bound is large and mostly redundant.
- Fix shape: Share immutable sub-objects by reference in the snapshot (the frozen digest always; unchanged saves via the same fingerprint idiom persistSaveUpdates already uses), or store structural diffs against the previous snapshot. Pure memory optimization; undo semantics unchanged.
- Verdict: _pending Opus verification_

**[performance-scale-9] LOW / confirmed — Nit batch: minor per-tick and growth inefficiencies**
- Where: `src/domain/worldPulse/supplyKernel.js:229` | Category: perf
- Evidence: (1) supplyKernel.js:225-230 calls resolveConsumingInstitution twice per link per tick (once inside deriveConsumingLinks, again for meta). (2) graph.js channel/edge `evidence` arrays append a row on every status transition with no cap (e.g. graph.js:675-680) — slow unbounded growth on oscillating relationships over decades. (3) campaignSliceShared.js:96 localStorage quota failure only console.warns — after a big campaign exceeds quota, the local cache silently goes stale every advance. (4) WorldPulsePanel.jsx:34 subscribes to the whole savedSettlements array, re-rendering the panel on any save change (bounded render, minor). (5) shortestPath (distanceRead.js:904-913) uses an O(V^2) linear-scan frontier — fine at the 30-settlement envelope, worth a comment pinning the envelope assumption.
- Why: Each is small alone; together they add avoidable per-tick work and two slow leak vectors (evidence arrays, silent local-cache staleness) in exactly the long-session scenario the product targets.
- Fix shape: (1) pass the resolved institution through the link derivation; (2) cap evidence at last-K rows in normalizeChannel/normalizeEdge; (3) surface quota failure through the existing campaignSyncError chip; (4) select `s.savedSettlements` only where needed or narrow to ids+names; (5) comment or swap to a binary heap if the envelope ever widens.
- Verdict: _pending Opus verification_


### Slice: state-lifecycle (grade B+)

**[state-lifecycle-1] HIGH / confirmed — M10b lastLivingAdvanceAt re-stamp is never persisted on the advance path — reload re-simulates already-advanced weeks**
- Where: `src/store/campaignWorldPulseSlice.js:387` | Category: lifecycle
- Evidence: advanceCampaignWorld: `const result = await runAdvanceCampaignWorld({...})` … then `set(state => { … c.worldState.lastLivingAdvanceAt = nowStamp; });` with no cacheCampaignState/syncCampaignSnapshot after it. Inside runAdvanceCampaignWorld, `campaignPersist = cacheCampaignState(state)` (campaignAdvanceSession.js:246) runs in Phase-2 — BEFORE the stamp — and flushWorldPulsePersist syncs that pre-stamp snapshot.
- Why: Both persisted surfaces (localStorage cache written inside cacheCampaignState, and the cloud snapshot synced from campaignPersist.snapshot) carry the PRE-advance cursor; the moved cursor exists only in memory. The code comment claims the stamp ensures 'never double-counting a manual advance', but that only holds within a session. This is the exact write-ghosts-a-path class on the newest persisted worldState key, and the catch-up determinism pin (a headline M10b guarantee) is silently violated across reloads.
- Fix shape: Move the stamp INSIDE runAdvanceCampaignWorld's Phase-2 set(), before cacheCampaignState (gate on advancesOnOpen && tick moved, mirroring the current condition) — this coincides exactly with the already-planned §0.8 M10b eager-trim, which proposes relocating this block into campaignAdvanceSession.js; doing both in one move fixes the ghost at zero extra cost. Add a pin that reloads from the campaigns.cache mock and asserts no phantom catch-up.
- Verdict: _pending Opus verification_

**[state-lifecycle-2] HIGH / confirmed — revertToSnapshot restores the settlement but ghosts systemState and campaignState — in memory and across reload**
- Where: `src/store/settlementSlice.js:640` | Category: lifecycle
- Evidence: set(): `s.savedSettlements[idx].settlement = cloneJson(target.settlement); … s.settlement = snapshotSettlement(target.settlement);` — no deriveSystemState, no editedAt stamp; persist is `persistSaveUpdate(targetSaveId, { settlement, versionHistory })` (line 660) with NO campaignState. No component calls refreshSystemState (grep: only the definition exists).
- Why: Version history is a live premium surface (flags.js: versionHistory `default: true`, 'Cartographer-gated. PROMOTED default-on'). After a revert, the live systemState (state rail, timeline deltas, event previews which take `systemState: state.systemState` as input) reflects the reverted-AWAY settlement; the persisted campaign_state.systemState stays stale too, and hydrateFromSave prefers `cs.systemState` on reload (settlementSlice.js:1809-1811), so the incoherence survives restarts. Every sibling mutator (applyEvent, undoLastEvent, destroySavedSettlement) re-derives and persists campaignState — revert is the one path that doesn't.
- Fix shape: In the revert set(), re-derive `s.systemState = deriveSystemState(restored)` (with the same try/catch as hydrateFromSave), stamp editedAt, and extend the persist partial with `campaignState: pickleCampaignState(after)` for the active-save case (or a campaignState rebuilt from the save's own entry when reverting a non-active save). Pin: revert → reload round-trip asserts systemState derives from the restored settlement.
- Verdict: _pending Opus verification_

**[state-lifecycle-3] MEDIUM / confirmed — generateSettlement leaves the prior identity's session residue live — pendingEditsQueue/pendingSuccession/draftVersionHistory/locks/lastRegenerationDelta survive a fresh generation**
- Where: `src/store/settlementSlice.js:841` | Category: lifecycle
- Evidence: generateSettlement's set() resets settlement/activeSaveId/AI slate/phase/eventLog but never touches pendingEditsQueue, pendingEditsClock, pendingSuccession, draftVersionHistory, locks, or lastRegenerationDelta — the exact fields hydrateFromSave resets with the comment 'reset ALL session-only, non-persisted UI state so opening save B never inherits save A's in-flight state' (settlementSlice.js:1786-1800).
- Why: The identity-leak class the codebase itself names is handled on one entry path (hydrateFromSave) and not the other (generateSettlement). Cross-identity mutation is real: pending edits address entities by INDEX (commitPendingEdits → renameNPC(edit.payload.npcIndex)), and draftVersionHistory revert overwrites the live settlement wholesale.
- Fix shape: Extract a resetSessionIdentity(state) helper (the hydrateFromSave block) and call it from generateSettlement, setSettlement, and clearSettlement — structural prevention for the class rather than a third hand-maintained copy.
- Verdict: _pending Opus verification_

**[state-lifecycle-4] MEDIUM / confirmed — regenSection neither persists to the active save nor respects canon identity locks**
- Where: `src/store/settlementSlice.js:999` | Category: lifecycle
- Evidence: `if (section === 'npcs') { const parts = eng.regenNPCsPipeline(settlement, cfg); set(s => { Object.assign(s.settlement, parts); }); }` — no phase guard, no editedAt stamp, no updateSavedSettlement/persistSaveUpdate. Contrast renameNPC: `if (state.phase === 'canon') return;` (line 1141) and applyEvent's full persist block (lines 1484-1497).
- Why: Two asymmetries: (1) with a save hydrated into the live editor (activeSaveId set — SettlementDetail.jsx:255 hydrates on open, then the Create-page OutputContainer offers onRerollNPCs since readOnly is false there), a reroll mutates only memory — it ghosts on reload unless a later mutator happens to persist the whole settlement; (2) canon freezes NPC/faction NAMES (renames guarded) but the entire NPC roster and history can be rerolled on a canon settlement with no event-log entry — an identity-lock bypass that silently invalidates campaign canon.
- Fix shape: Guard regenSection on phase !== 'canon' (matching the rename locks; canon rerolls should route through the event system), and when activeSaveId is set, persist via the applyEvent pattern (updateSavedSettlement + persistSaveUpdate with settlement + pickleCampaignState) and stamp editedAt.
- Verdict: _pending Opus verification_

**[state-lifecycle-5] MEDIUM / confirmed — Atomic pulse-persist RPC (persist_world_pulse_advance, with its stale-tick guard) has zero client callers — the live path is non-atomic last-writer-wins across devices**
- Where: `supabase/migrations/102_gate_pulse_persist_on_access_state.sql:45` | Category: docs-drift
- Evidence: Migration 102 hardens `persist_world_pulse_advance` ('writes settlements + the saved_maps campaign row', with `p_expected_tick` returning `stale_tick`), but `grep -rn "persist_world_pulse_advance" src/` returns nothing; the live path is flushWorldPulsePersist → per-save savesService.update via the outbox + campaignService.upsert (saved_maps upsert, onConflict:'id', no tick/version predicate).
- Why: The single-transaction write-set and the optimistic tick guard exist server-side but protect a path this client never takes. Concretely: two devices (or two tabs after the localStorage cache diverges) advancing the same campaign interleave freely — a stale device's saved_maps upsert clobbers a newer advance wholesale (mergeCampaignLists guards LOADS by updatedAt, but syncCampaignChanges upserts unconditionally on signature diff). Also master-merge-relevant: the RPC's 084/096 'net-current' lineage suggests master's client calls it, so the merge must reconcile two different pulse-persist protocols.
- Fix shape: Either route flushWorldPulsePersist through the existing RPC (it was built for exactly this: atomic members+snapshot with the expected_tick guard — the outbox runner can carry a campaign-op kind), or add a WHERE-guard/version column to the upsert path and delete the dead RPC; at minimum document which protocol is canonical before the master merge forces the question.
- Verdict: _pending Opus verification_

**[state-lifecycle-6] LOW / confirmed — saves.js local backend: localUpdate/localDelete use strict-identity id matching while sibling methods String()-coerce**
- Where: `src/lib/saves.js:472` | Category: correctness
- Evidence: localUpdate: `saves.findIndex(s => s.id === id)`; localDelete: `.filter(s => s.id !== id)` — but localReactivateFreeSettlement uses `String(save.id) === String(id)` (line 489) and localMutateBatch builds String-keyed maps (lines 509-510). Local ids are minted as `Date.now()` numbers (line 447).
- Why: Half the local backend already learned the number-vs-string lesson (the String() coercion in reactivate/mutateBatch is the scar); update/delete didn't. Any caller that passes a stringified id — URL param, dataset attribute, or an id that round-tripped through String() as most store code does (destroySavedSettlement, renameSettlement all String()-normalize) — silently no-ops an anon user's save update or delete.
- Fix shape: String()-coerce the comparison in localUpdate and localDelete to match the two already-fixed methods; one-line each plus a local-mode round-trip test with a numeric id and a string caller.
- Verdict: _pending Opus verification_

**[state-lifecycle-7] LOW / confirmed — ensureWorldState silently downgrades a future-versioned worldState with no forward-version guard**
- Where: `src/domain/worldPulse/worldState.js:343` | Category: lifecycle
- Evidence: `return { ...base, ...shallowRaw, schemaVersion: WORLD_STATE_SCHEMA_VERSION, … }` — unconditionally re-stamps schemaVersion 2 on every ensure; runWorldStateMigrations has no `startVersion > WORLD_STATE_SCHEMA_VERSION` branch. Contrast settlementMigrations.js:101-108, which warns loudly and passes a newer save through UNCHANGED.
- Why: The two migration runners in the same codebase disagree on forward-compat policy. A campaign saved by a newer build (post-master-merge, or a future worldState v3 with a breaking shape) loaded in an older client gets its version stamp silently rewritten to 2 and its shape run through old normalization on every read — then persisted back, destroying the version evidence a proper upgrade path would need. Given campaigns cloud-sync across devices on different deploy versions, this is a realistic path, and the settlement runner's warn-and-passthrough shows the codebase already knows the right answer.
- Fix shape: Mirror the settlement runner: in runWorldStateMigrations (or ensureWorldState), when raw.schemaVersion > WORLD_STATE_SCHEMA_VERSION, console.warn and preserve the stored version stamp rather than re-stamping — the shape passthrough is already the behavior; only the stamp overwrite lies.
- Verdict: _pending Opus verification_

**[state-lifecycle-8] LOW / confirmed — deleteCampaign leaves orphaned pulse-undo snapshots and a live 'Undo last advance' affordance**
- Where: `src/store/campaignSlice.js:456` | Category: lifecycle
- Evidence: deleteCampaign filters state.campaigns and clears activeCampaignId but never touches pulseUndoStack; canUndoLastPulse is `(get().pulseUndoStack || []).some(s => s.campaignId === campaignId)` (campaignWorldPulseSlice.js:645-646), and undoLastPulse's `if (!c) return;` then no-ops without popping.
- Why: Session-scoped leak: after deleting a campaign the undo affordance can still report true for its id, the click no-ops (didUndo false, snapshot not even popped), and up to 10 full deep-cloned world snapshots (each potentially carrying a ~400KB spatialDigest plus every member settlement) stay pinned in memory for the session.
- Fix shape: In deleteCampaign's set(), also `state.pulseUndoStack = (state.pulseUndoStack || []).filter(s => s.campaignId !== id)` — one line, mirrors the advanceInFlight hygiene.
- Verdict: _pending Opus verification_

**[state-lifecycle-9] LOW / confirmed — Every pulse-undo snapshot deep-clones the immutable spatialDigest (up to 400KB) — pure clone waste on the hot advance path**
- Where: `src/store/campaignPulseHelpers.js:188` | Category: perf
- Evidence: capturePulseSnapshot: `worldState: cloneJson(campaign.worldState)` — includes spatialDigest, whose own contract is 'authored ONCE … never recomputed' (worldState.js:225-232) and whose size guard allows up to SPATIAL_DIGEST_MAX_BYTES = 400_000 (campaignSpatialCanonize.js:33).
- Why: The digest is frozen by design — cloning it into every advance's snapshot (cap 10 per campaign) burns up to 4MB of session memory per spatial campaign plus structuredClone CPU on every tick of a 26-week catch-up, for an object that cannot change between snapshot and restore. The deep-clone-no-alias invariant exists to protect MUTABLE ledgers; the digest is the one key whose immutability contract makes a by-reference share safe.
- Fix shape: In capturePulseSnapshot, clone worldState minus spatialDigest and reattach the digest by reference (documented as safe-by-immutability, with a comment pointing at the freeze contract); undo restore already round-trips it through ensureWorldState's deep clone.
- Verdict: _pending Opus verification_

**[state-lifecycle-10] LOW / confirmed — Nit batch: smaller lifecycle asymmetries**
- Where: `src/store/settlementSliceHelpers.js:124` | Category: lifecycle
- Evidence: pickleCampaignState hard-nulls `narrativeDrift: null, exportState: null` while campaignStateForRegionalImpact preserves them (campaignPulseHelpers.js:51-52); revertToSnapshot line 656 overwrites the LIVE `s.settlement` even when targetSaveId !== activeSaveId; hydrateFromSave doesn't reset lastCtx or lastRegenerationDelta; updateSavedSettlement/removeSavedSettlement use strict `s.id === id` (settlementSlice.js:1050,1055) vs String()-normalized siblings; undoLastEvent doesn't remove the event-keyed aiData narrative snapshot appendEventNarrativeSnapshot added for the undone event.
- Why: Each is a small divergence between two builders/paths that should be symmetric — the habitat for the next write-ghosts-a-path bug even though none is user-visible today (narrativeDrift/exportState currently have no writers; the live-view clobber is unreachable through current UI; the stale aiData snapshot is a bounded cosmetic archive).
- Fix shape: Unify the two campaignState builders (pickle should preserve current.narrativeDrift/exportState like its sibling); guard the live-view overwrite in revertToSnapshot on activeTarget; String()-coerce the two strict id lookups; delete the undone event's narrative snapshot in undoLastEvent.
- Verdict: _pending Opus verification_


TOTAL FINDINGS: 208


---

# THE FINDINGS REGISTER — ROUND 2 (the 8 re-dispatched slices; 71 findings)

### Slice: sim-logic-counterparts (grade B+)

**[sim-logic-counterparts-1] HIGH / confirmed / KNOWN-DEFERRED — M11b calamity can never fire: disastersEnabled has no writer — no preset, no UI, no default**
- Where: `src/domain/spatial/calamity.js:125` | Category: sim-logic-gap
- Evidence: calamityEnabled: `return !!(rules && typeof rules === 'object' && rules.disastersEnabled === true);` — repo-wide grep finds `disastersEnabled` only in calamity.js, a calamityKernel.js comment, and a pulseKernel.js comment. simulationRules.js full_simulation preset sets worldProgression/commodityFlowEnabled/allyIntelSharingEnabled but not disastersEnabled; grep of src/**/*.jsx finds no UI writer.
- Why: The final mover of the M1-M11 ladder — a complete, well-braked disaster system with a 30/30 test suite — is unreachable in the shipped product. No campaign, including Full Simulation ('everything, honestly' per the preset comment), can ever see a calamity. The M11b spec (playbook PART 7) required 'ON in dramatic/full-sim presets'. Ruins-as-artifacts (backlog) also depends on strikes actually occurring.
- Fix shape: Owner one-liner per the M11b commit's own stop-and-report: disastersEnabled:true in the full_simulation (and arguably dramatic_campaign) preset shape — measured +20B eager, fits the budget. Queue it in §0.6/owner-decision queue where it can actually be found (today it lives only in commit 62c81a0c's message).
- Verdict: _pending Opus verification_

**[sim-logic-counterparts-2] HIGH / confirmed / KNOWN-DEFERRED — M11a plague couplings entirely unwired: armyPlagueHazard/armyContraction/pestilenceLevel/pestilenceTemplePulse have zero consumers and stressorDanger has no plague term — the quarantine dilemma cannot emerge**
- Where: `src/domain/spatial/dispatchEV.js:169` | Category: dead-seam
- Evidence: stressorDanger: `const siege = stressor.besieged ? T.DANGER_SIEGE : 0; const occ = occupationDangerTerm(...); return clamp01(Math.max(siege, occ));` — no plague term. dispatchEV.js:41: '⚠️ M11a plugs PLAGUE into stressorDanger… This module does NOT depend on M11a (unbuilt).' Grep: armyPlagueHazard/armyContraction/pestilenceLevel/pestilenceTemplePulse have no callers outside pestilence.js.
- Why: The plague travels (fronts, onset, care, recovery all work) but nothing in the world reacts to it spatially: caravans read a plagued destination as danger 0, armies neither avoid nor contract nor carry it, routes don't re-score around it, and the round-22.1 trade refusal is unbuilt. The M11a spec's headline emergences — 'movers re-route around plagued hubs → isolation → M2 supply risk', 'quarantines CREATE their blockade-runners', 'armies avoid + contract + carry' (its own soak criterion) — are all structurally impossible. Commit 82ad676b defers the army mutation + trade refusal 'logged in the parking-lot / deferral ledger', but no such row exists in §0.6/§0.0.2/round-21 plan (grep-verified), and the dispatchEV plague-deterrent term is not covered by even that commit-message deferral — a dropped thread, not a recorded one.
- Fix shape: Three small passes using the already-built, already-tested primitives: (1) add a pestilenceLevel term to stressorDanger (the seam is explicitly 'a new max() argument'); (2) fold armyPlagueHazard into march/engagement scoring in armyTransitKernel and wire armyContraction + vector-carry as the fenced byte-gated pass the commit promised (re-verify the 6 siege pins); (3) write the deferral rows into §0.6 NOW regardless.
- Verdict: _pending Opus verification_

**[sim-logic-counterparts-3] HIGH / confirmed — Field-battle RETREAT is dead code: the loser never retreats, so hostile armies with overlapping paths re-fight every tick**
- Where: `src/domain/worldPulse/armyTransitKernel.js:220` | Category: sim-logic-gap
- Evidence: advanceArmyTransit assigns only ARMY_ROLES.MARCH/REINFORCEMENT (lines 188, 200) and after a battle merely writes mauled strengths back; ARMY_ROLES.RETREAT (armyTransit.js:103) and retreatRoute (armyTransit.js:413, 'A retreating/defeated army routes HOME by the M1 danger re-score') are exported but never called. detectCollisions has no fought-pair memory — any hostile pair whose remaining paths share a region collides again next tick.
- Why: The M5 spec says 'retreat = per-mover embattlement (§6)' and the module header says 'a loser retreats mauled, never annihilated'. In fact the loser keeps marching on its original objective and the same pair grinds a fresh battle each tick (new fork `battle:…:${tick}`) until someone arrives — attrition is bounded so it never explodes, but the war story a DM reads is 'the two armies fought seven identical battles in seven weeks and nobody withdrew', and a defeated army still arrives at its siege as if the defeat changed nothing but a number.
- Fix shape: On a decisive/costly loss, re-role the loser to RETREAT with retreatRoute(digest,…,homeId) and resolve its deployment as a withdrawal on arrival home (rides the existing deploymentReturn machinery); optionally add a per-pair refractory (the M1 dwell idiom) so a narrow_fail pair doesn't re-engage the same week. Byte-gated: dormant off the spatial marker.
- Verdict: _pending Opus verification_

**[sim-logic-counterparts-4] HIGH / confirmed — M9a non-war levers (reroute/embargo/credit/missionize/legitimacy/prestige/opportunity) are inert posture markers whose apply effects were never built — and they actively pacify their actor**
- Where: `src/domain/worldPulse/settlementStrategy.js:574` | Category: sim-logic-gap
- Evidence: 'M9a NON-WAR LEVER … an INERT posture marker (no condition, no proposal) … it still wins the strategy:<S> exclusive group. Apply-side effects are M9b.' M9b shipped components 3+4 (moral drift, ally intel), M9c/M9d shipped 5+6, and M9 was declared COMPLETE — no wave ever built the lever effects.
- Why: A merchant-governed seat that 'closes its markets to X' produces zero trade effect; a church that 'sends out missionaries' moves no faith number. Because the lever WINS the exclusive strategy:<S> group, choosing it also SUPPRESSES the reactive war escalation — so the archetype differentiation M9a promised ('a merchant polity de-emphasizes deploy and reaches for reroute/embargo/credit') manifests as merchant/church polities being structurally pacified while emitting headlines that promise consequences that never land. This is the narrated-but-not-executed class at the exact seam the political-depth wave was supposed to close, and it deepens autoresolve stasis for non-warlord polities.
- Fix shape: A focused M9e: embargo → sever/dampen the trade channel + tradeSalience edge (machinery exists); reroute → an M1 route-preference nudge or trade-channel repoint; credit → a bounded relationship/prosperity pulse; missionize → a faith-spread pressure pulse via the existing religiousContest lanes; legitimacy → a small governance condition. Each is a value change through existing apply paths, gated like the rest of M9. Until then, soften the copy so headlines don't promise market closures that never happen.
- Verdict: _pending Opus verification_

**[sim-logic-counterparts-5] HIGH / confirmed — sue_for_peace de-escalates the label and winds down stressor twins but never recalls the suitor's own army — peace reaches one war representation, not the other**
- Where: `src/domain/worldPulse/settlementStrategy.js:484` | Category: sim-logic-gap
- Evidence: The sue_for_peace branch emits only a relationship_label_change proposal (PEACE_STEP one rung down); nothing in the path touches worldState.deployments. warDeployment's withdrawal fires only on feasibility collapse or SIEGE_MAX_AGE, and cold_war/rival remain in HOSTILE_TYPES.
- Why: A war-bankrupt settlement can sue for peace — the edge steps hostile→cold_war, windDownSponsoredStressors deflates the siege/wartime stressor twins, the chronicle prints 'seeks to wind the conflict down' — while its own deployment ledger keeps the army at the walls, still able to conquer the party it just made peace with. The stressor-twin and physical-army representations of the same war are individually coherent but the de-escalation seam couples only the first. A DM watching both surfaces sees the sim contradict itself at the exact moment the product thesis ('this one simulates') is tested.
- Fix shape: When a sue_for_peace label change APPLIES, resolve the suitor's deployment against the de-escalated party as a withdrawal through the existing resolvedDeployments/deploymentReturn machinery (the wind-down path for warLayer-off already proves the shape). Bounded, byte-gated on the apply. Alternatively fold into the Wave-8 peace-treaty design — but then record that coupling gap in the deferral ledger, which today does not mention it.
- Verdict: _pending Opus verification_

**[sim-logic-counterparts-6] MEDIUM / confirmed — Courier umbilical accrues staleness nothing reads — and the kernel comment claims the fog degrades battle reads when it does not**
- Where: `src/domain/worldPulse/armyTransitKernel.js:224` | Category: dead-seam
- Evidence: Comment: 'The umbilical fog degrades each army's READ of the OTHER's strength… but the TRUE strengths resolve the battle'. battleInputs (line 98) returns only {size, readiness, supplyQuality, funding, ground, fatigue} — beliefStaleness is never passed anywhere; umbilicalFog (armyTransit.js:441) has zero consumers repo-wide.
- Why: The round-12 mechanic ('an info-starved army mis-assesses; blinding the enemy's couriers becomes a real tactic') is bookkeeping with no consequence: staleness increments each tick the home is besieged and affects nothing — no mis-assessment, no receipt, no news. Worse, the comment asserts a coupling that doesn't exist, which is exactly the receipts-honesty failure mode the project's own SIMULATION_LOGIC_AUDIT names as most corrosive.
- Fix shape: Either wire umbilicalFog into a fogged pre-battle read (e.g., an engagement-decision or a mis-assessment receipt on the battle news — the physics can stay true while the CAUSE is legible), or delete the accrual + fix the comment. Wire-it-or-delete-it.
- Verdict: _pending Opus verification_

**[sim-logic-counterparts-7] MEDIUM / confirmed — Famine has no relief counterpart: food moves between settlements only by conquest sack and war levy — never purchase, charity, or ally relief**
- Where: `src/domain/worldPulse/supplyKernel.js:641` | Category: sim-logic-gap
- Evidence: '(Ally relief = documented seam.)' — the dispatchEV override hook feeds only 'must-go' (vassal tribute). M2 deliberately excludes food (pulseKernel:549 'Food stays with foodStockpile (no double-count)'); the only inter-settlement food transfers are computeSackFoodTransfer at conquest (warDeployment:1466) and the war levy (warDeployment:1821) — both coercive.
- Why: Every stressor has a counterforce, but famine's counterforces (granary, resilience, trade_connectivity score) are all LOCAL abstractions — no grain ever physically travels to a starving neighbour, even from an ally with a full granary, even when M6a commodity flow is lit. The war machine can move food two ways (loot it, levy it) while peace cannot move it at all — a pointed asymmetry for a sim whose food year, granary rhythm, and hungry gap are its most polished subsystems. The M6c 'ally relief (trade-as-peace)' override was specced and left as a comment.
- Fix shape: Wire the documented relief override: an allied origin with storageMonths above a comfort floor dispatches a food shipment to a famine-stressed ally via the existing M2/M6a shipment ledger (food as a good on this one lane, or a bounded storageMonths transfer riding the levy arithmetic in reverse with a receipt). The severance/arrival machinery, conservation transfer math, and the override hook all already exist.
- Verdict: _pending Opus verification_

**[sim-logic-counterparts-8] MEDIUM / confirmed — Regional impact propagation is shock-only: no recovery, relief, or boon ever propagates**
- Where: `src/domain/region/propagation.js:305` | Category: sim-logic-gap
- Evidence: The full change-kind census (lines 305-580): import_shortage, export_market_loss, route_disruption, authority_instability, protection_gap, conflict_pressure, …_shock, route_cut, population_loss, tier_demotion — every propagated kind is negative; no route_restored/export_regained/siege_lifted/recovery kind exists.
- Why: A neighbour's collapse ripples outward through decayed waves, but its recovery reaches nobody: the importing town that gained an import_shortage condition when the route was cut sees relief only via that condition's expiry timer, never as an affirmative signal when the route reopens or the granary refills. The regional layer is a one-way ratchet softened only by expiry — recovery is the absence of new shocks rather than a propagating event, so the inter-settlement texture skews permanently grim and the upswing half of every arc is invisible at the regional lens.
- Fix shape: Add 2-3 positive change kinds (route_restored, export_regained, crisis_lifted) emitted at the natural sources (stressor resolution, channel status flips) that propagate as easing/removal waves — withoutActiveCondition is already imported here, so the removal machinery exists; this is a rules-table extension, not new architecture.
- Verdict: _pending Opus verification_

**[sim-logic-counterparts-9] MEDIUM / confirmed — Defenders never bank a disposition win: every siege outcome credits or debits the aggressor's ledger only**
- Where: `src/domain/worldPulse/warDeployment.js:1393` | Category: sim-logic-gap
- Evidence: Complete census of dispositionDeltas.push sites: withdrawal → attacker loss (1393); conquest → occupier win + target loss (1535-1536); occupation advance/regress/collapse → occupier win/loss only (occupation.js:818,863,865); tradeWar winner/loser (483-485). No site ever credits a defender that repelled a siege.
- Why: A town that holds its walls until the besieger withdraws in exhaustion gets nothing — no confidence, no deterrent reputation — while the failed attacker's loss makes it slower to re-mobilize. Successful defense is one of the most narratively-charged outcomes in the sim and it is invisible to the disposition memory that shapes future aggression; a repeatedly-victorious defender reads identically to one that was never attacked. One-way ratchet where the design intent (disposition = 'ratcheted history' of contests) implies symmetry.
- Fix shape: At the withdrawal/forcedLift site, push {id: targetId, outcome: 'win', magnitude ∝ siege length} alongside the attacker's loss; same at occupation collapse for the liberated settlement. Purely additive deltas through the existing applyDispositionDeltas fold.
- Verdict: _pending Opus verification_

**[sim-logic-counterparts-10] MEDIUM / confirmed / KNOWN-DEFERRED — dramatic_campaign lights zero drama systems: OPEN + intensity only — no war layer, no strategy, no faith contest, no seasons, no commodity flow, no disasters**
- Where: `src/domain/worldPulse/simulationRules.js:215` | Category: ux
- Evidence: dramatic_campaign: preset('dramatic_campaign', …, { ...OPEN, intensity: 'dramatic' }) where OPEN = { propagationMode:'full', majorChangesRequireProposal:false, politicalAutonomy:'full', migrationMode:'distributed' }. warLayerEnabled defaults false (line 58).
- Why: The preset a DM picks when they explicitly ask for drama gets only a probability multiplier and wider propagation of the same baseline events; every endogenous-drama system built since (war stack, settlement strategy, religion contest, seasons, commodity flow, living progression, disasters) stays dark. Given the known autoresolve-stasis finding, this makes the stasis experience the labeled-dramatic experience. Already queued as round-21 Wave 4 'dramatic_campaign preset depth review' — the deferral is sound, but this slice's evidence (it is the compounding factor behind 'tuning that makes drama impossible') raises its priority: it is preset data, not engine work.
- Fix shape: Wave-4 review with a concrete proposal: dramatic_campaign gains warLayerEnabled + settlementStrategyEnabled + seasonsEnabled (and disastersEnabled when the owner flips it) at dramatic intensity — a mid-rung between realistic_regional and full_simulation. Preset-shape change ⇒ owner-gated, accepted-drift class for preset re-inference.
- Verdict: _pending Opus verification_

**[sim-logic-counterparts-11] MEDIUM / confirmed — The M11a/M11b deferrals and ledger rows exist only in commit messages — the playbook's own succession law (§0.3-7) is broken exactly where the ladder's tail was cut**
- Where: `docs/PHASE55_EXECUTION_PLAYBOOK.md:68` | Category: docs-drift
- Evidence: §0.0.1 ends at the M10b row — no M11a or M11b row. Commit 82ad676b: 'Both logged in the parking-lot / deferral ledger' — grep of docs/*.md finds no army-vector/trade-refusal/disastersEnabled row in §0.6, §0.0.2, or the round-21 plan (whose Progress note still says 'M11 … UNBUILT').
- Why: The playbook is 'the successor's memory' by its own law; the next AI runs the checkpoint soaks against soak criteria ('armies avoid + contract + carry') that the unrecorded deferrals make unmeetable, and the parked disastersEnabled owner decision is findable only by reading git log. Three deferred threads (army-vector coupling, trade refusal, the preset flip) are one session-loss away from being permanently dropped.
- Fix shape: Append the M11a + M11b rows to §0.0.1; add three §0.6 entries (army-vector mutation pass, round-22.1 trade refusal + plague stressorDanger term, disastersEnabled preset flip ⚠️OWNER); correct the round-21 plan's stale 'M11b UNBUILT' lines and unblock ruins-as-artifacts.
- Verdict: _pending Opus verification_

**[sim-logic-counterparts-12] LOW / confirmed — Nit batch: three small dead/asymmetric seams**
- Where: `src/domain/spatial/pestilence.js:313` | Category: dead-seam
- Evidence: (1) pestilenceTemplePulse exported, zero consumers — the 'temple's hour' legibility read renders nowhere. (2) warDeployment step 4 gates new deploys on isBesieged(graph) only — worldState.occupations is never consulted, so an occupied settlement can open its own siege while occupied (softened by economy drag but never gated). (3) migration has no literal return flow — refugees never go home when the origin recovers; organic regrowth (populationDynamics +0.002/mo recovery bonus) is the implicit counterpart, defensible under simplicity-over-fidelity but worth an explicit design note.
- Why: Each is a small honesty/coherence gap: an unused read-model invites drift; an occupied town raising a siege abroad reads incoherent at the table; the missing return flow is a deliberate-looking absence that is nowhere recorded as deliberate.
- Fix shape: (1) render templePulse in the settlement faith read-model or delete it; (2) add an occupations-ledger check (state rank ≤ extractive blocks deploy) to step 4; (3) one line in the design doc recording regrowth-as-return as the accepted model.
- Verdict: _pending Opus verification_


### Slice: determinism-constitution (grade A-)

**[determinism-constitution-1] HIGH / confirmed — M10b lastLivingAdvanceAt cursor is stamped after the advance's persist and never flushed — reload re-runs already-lived weeks (phantom catch-up)**
- Where: `src/store/campaignWorldPulseSlice.js:387` | Category: lifecycle
- Evidence: advanceCampaignWorld stamps AFTER runAdvanceCampaignWorld returns: `set(state => { const c = findActiveCampaign(...); if (c && c.worldState) c.worldState.lastLivingAdvanceAt = nowStamp; });` — but campaignAdvanceSession.js:246 ran `campaignPersist = cacheCampaignState(state)` (which snapshots + localWrites state.campaigns at CALL time) and flushWorldPulsePersist before the stamp existed; no persist follows the stamp. catchUpCampaignWorld's seed path (line 444) flushes explicitly; the stamp path does not. tests/store/catchUpCampaignWorld.test.js asserts only in-memory `ws(store).lastLivingAdvanceAt` — no persist/reload round-trip pin.
- Why: The cursor is M10b's only defense against double-counting real time. Both persisted surfaces (localStorage cache + cloud snapshot) carry the pre-advance cursor, so after any session whose last pulse action was an advance (including a 1-week catch-up — where the loop's next-iteration persist never happens), reopening the campaign recomputes elapsed weeks from the stale cursor and re-advances weeks the world already lived. A living campaign reloaded hourly gains a phantom week per reload until a >1-week real gap occurs. This violates the M10b design's own mandate (§0.6.1-3: trace + pin the stamp across 'persist round-trip'), and undo is session-scoped so the phantom time is unrecoverable. Independently corroborates the parallel survey's [store-1].
- Fix shape: Move the stamp INSIDE the Phase-2 commit (campaignAdvanceSession, before cacheCampaignState) keyed on advancesOnOpen + tick-moved — the stamp then rides the same atomic persist as the advance; the undo snapshot (captured Phase 1) still restores the prior cursor. Add a persist-round-trip pin: advance → serialize campaigns via cacheCampaignState's snapshot → rehydrate → catchUp with the same now ⇒ weeksCaughtUp 0.
- Verdict: _pending Opus verification_

**[determinism-constitution-2] MEDIUM / confirmed — verify:dist is vacuous when dist/ is absent — the VERIFY_DIST hard-failure guard exists in the master lineage but is missing from this branch**
- Where: `tests/build/vendorPdfLazy.test.js:336` | Category: budget-ratchet-health
- Evidence: package.json:32 sets `VERIFY_DIST=1 vitest run tests/build/` and ci.yml:106 claims it 'turns a missing dist/ into a HARD failure' — but repo-wide grep finds NOTHING in this branch reading process.env.VERIFY_DIST; the budget suite is `describe.runIf(distExists)` (line 336) and silently skips. The guard exists only in the master-lineage worktree copy (.claude/worktrees/awesome-ritchie-063978/tests/build/vendorPdfLazy.test.js:39-43: `const requireDist = process.env.VERIFY_DIST === '1'` + a hard 'dist must exist' assertion).
- Why: The first-paint budget ratchet is constitutional law 5, and this exact vacuous-gate class already bit once (the documented W-F7 incident: +293B rode a green gate that measured nothing). Today the gate is protected only by CI/step ordering (build immediately before verify:dist); any reconciliation that reorders steps — and the master merge is precisely such a reconciliation, on a lineage whose ci.yml has diverged before — silently re-opens green-on-nothing. The CI comment asserting protection that does not exist is itself the operator hazard.
- Fix shape: Port the master-lineage guard: a top-level test `it('dist/ + dist/assets exist when VERIFY_DIST=1', ...)` asserting distExists when process.env.VERIFY_DIST==='1'. Three lines, zero product bytes; also reconcile the ci.yml comment.
- Verdict: _pending Opus verification_

**[determinism-constitution-3] MEDIUM / confirmed — Purity bans and source scans do not cover src/workers (the sim path's worker) for Math.random/localeCompare/toLocale*/Intl**
- Where: `eslint.config.js:292` | Category: determinism-guard-gap
- Evidence: The workers+kernel block (files: ['src/workers/**/*.js','src/kernel/**/*.js']) bans ONLY `new Date()` and `Date.now()`; the Math.random/locale/Intl bans live in the generators (line 161) and domain (line 223) blocks. The scan tests pin only TREES = ['src/generators','src/domain'] (localeCompareGuard.test.js:21, localeFormatGuard.test.js:24). src/workers/advanceInterval.worker.js is documented as 'the advance worker — same code as the main thread, so an ambient wall-clock read there would silently fork worker vs main-thread bytes' — the same argument applies verbatim to an ambient Math.random or locale call.
- Why: Currently clean (grep-verified zero hits), so this is prevention, not a live bug — but the worker is the one sim-path directory where a new ambient draw or locale sort would pass lint, pass the source scans, and fork worker-vs-main bytes only under the simAdvanceWorker flag, the exact silent-divergence class the whole guard suite exists to make impossible. Kernel is legitimately exempt for Math.random (the sanctioned seam) but not for locale calls.
- Fix shape: Add the Math.random + locale/Intl selectors to the workers block (workers have no legitimate ambient draw), extend the two scan tests' TREES with 'src/workers', and add the locale selectors to the kernel block (prng.js needs no locale exemption).
- Verdict: _pending Opus verification_

**[determinism-constitution-4] LOW / confirmed — Stale constitutional comments in normalizeSimulationRules contradict shipped M10a/M10b behavior (living/autonomous 'coerce until built'; infoMode 'full' 'fails closed')**
- Where: `src/domain/worldPulse/simulationRules.js:467` | Category: docs-drift
- Evidence: Comment lines 467-468: "worldProgression: only 'frozen' is meaningful; 'living'/'autonomous' are ACCEPTED but coerce to 'dm_advanced' until built" and lines 474-476: "'full' + garbage fail closed to omniscient (infoModeOf)" — but worldProgressionOf (line 329) returns living/autonomous verbatim and infoModeOf (line 371) returns 'full' verbatim.
- Why: This normalizer is the constitutional choke point every profile write flows through; a successor implementer trusting its header would conclude the M10a/M10b axes are still coerced and could 're-fix' them, breaking the shipped catch-up/full-info gates. The parallel survey's worldpulse-core-9 caught the living/autonomous half; the infoMode-'full' half is additional.
- Fix shape: Two-line comment correction in the profile-materialize block; no code change.
- Verdict: _pending Opus verification_

**[determinism-constitution-5] LOW / confirmed — Nit batch: small determinism-adjacent one-liners**
- Where: `src/store/campaignSpatialCanonize.js:81` | Category: nit-batch
- Evidence: (a) campaignSpatialCanonize.js:81 `digestBytes = JSON.stringify(digest).length` counts UTF-16 code units, not bytes — the 400KB cap under-measures any non-ASCII content (deterministic, mislabeled). (b) kernel/prng.js:65 fork seed `${seed}::${label}` is concatenation-collision-prone in principle (createPRNG('a::b').fork('c') === createPRNG('a').fork('b::c')); ids in labels are UUIDs/slugs today so unreachable, but nothing asserts it. (c) CLOSURE_BUDGET_BYTES (vendorPdfLazy.test.js:296) and the any-cast CEILING (domainAnyCastBaseline.test.js:63) are 'monotone-down' by comment/convention only — no machine check prevents a silent raise in a commit. (d) campaignWorldPulseSlice.js:459 comment 'Each advance re-stamps the cursor to `now` and persists' overstates — the stamp is not persisted (see finding 1). (e) rumorNetwork.js:247 rumorEventKey hardcodes 'trade:' for all five carriers while the header claims per-(event,carrier) recording — deliberate consolidation, stale doc (also flagged in the parallel survey's spatial-engine-9).
- Why: Individually cosmetic; collectively they are the comment-vs-code drift and convention-only-ratchet residue a successor AI will trip over during the master merge.
- Fix shape: One hygiene commit: TextEncoder byte length or a rename to digestChars; a comment on fork() documenting the label alphabet assumption; correct the two overstating comments; optionally a scripts/ check that budget consts only decrease vs the merge-base.
- Verdict: _pending Opus verification_


### Slice: security-privacy (grade A+)

**[security-privacy-1] LOW / confirmed / KNOWN-DEFERRED — CSP ships Report-Only, so DOMPurify is the sole XSS boundary on the public gallery**
- Where: `vercel.json:18` | Category: security
- Evidence: "key": "Content-Security-Policy-Report-Only" ... script-src 'self' 'wasm-unsafe-eval' https://plausible.io; ... and cspHeaderShape.test.js pins that the enforcing key is ABSENT.
- Why: The app renders user-authored HTML on public, anon-readable gallery pages (GalleryDetail/GalleryCard/MapGalleryDetail via dangerouslySetInnerHTML). Report-Only reports but does not block, so if DOMPurify 3.4.8 ever has a bypass there is no CSP backstop to contain a stored-XSS payload served to every gallery viewer. The deferral is deliberate, documented (csp-report.js rollout note) and test-pinned, so it is sound — but it is the highest-value residual to close.
- Fix shape: Follow the documented rollout: watch the csp-report sink under real traffic, widen any legitimately-reported directive, then rename both header keys from Content-Security-Policy-Report-Only to Content-Security-Policy (keeping the looser /map/ block). No new architecture required.
- Verdict: _pending Opus verification_

**[security-privacy-2] LOW / confirmed — Client import-path defense-in-depth omits the config.latentPantheon strip**
- Where: `src/lib/gallery.js:103` | Category: security
- Evidence: stripImportConfidential deletes out.seed/_seed/_config and out.config._seed but never deletes out.config.latentPantheon; the toPublicSafe display path DOES drop it via PRIVATE_KEY_RE /latentPantheon/.
- Why: import_gallery_dossier's server projection already strips latentPantheon (128/129), so this is inert today. But every other gallery read re-clamps client-side precisely because the row 'can't be fully trusted'; the import twin's asymmetry means that if the server projection ever regressed, the import path (unlike the display path) would not catch the unrevealed starting pantheon — a premium-gated secret.
- Fix shape: Add `delete out.config.latentPantheon` alongside the existing `delete out.config._seed` in stripImportConfidential so the import twin matches the display twin's PRIVATE_KEY_RE coverage.
- Verdict: _pending Opus verification_

**[security-privacy-3] LOW / confirmed — Nit-batch: minor privacy/robustness observations (all low or informational)**
- Where: `supabase/functions/send-email/index.ts:466` | Category: nit-batch
- Evidence: Authenticated templates use `safePayload = payload` (raw caller payload) into interpolate(); ANALYTICS_HASH_PEPPER falls back to '' (ingest-events.ts:20) and deviceKey is null when PEPPER is unset (ingest-events.ts:176).
- Why: (1) send-email authenticated templates interpolate caller-supplied placeholders freely, but the recipient is always the authenticated user's own email (auth.uid()), so the blast radius is self-directed spam only — not a cross-user defect. (2) An unset ANALYTICS_HASH_PEPPER degrades device linking to null (gracefully disables it) rather than producing unpeppered hashes, so it fails safe — worth an env-presence assertion at deploy but not a hole. (3) CSP style-src allows 'unsafe-inline' (standard for the React/inline-style setup) — acceptable given script-src stays strict.
- Fix shape: No code change required; optionally assert ANALYTICS_HASH_PEPPER presence in a deploy check and note the send-email self-only recipient invariant in abuse-model.md.
- Verdict: _pending Opus verification_


### Slice: code-quality (grade A-)

**[code-quality-1] HIGH / confirmed — Entity-ref token pipeline is half-merged on this lineage: server injects ⟦entity:id|name⟧ tokens into narrative prose but the client renderers exist only on master — this tree ships the producer with no consumer**
- Where: `supabase/functions/generate-narrative/index.ts:1737` | Category: correctness
- Evidence: index.ts:1737+1908 call wrapEntityRefsInProse(aiClone) unconditionally before streaming; the renderers from commit 6d95adc7 ('new ProseParagraph (web) + ProseText (PDF) render ref segments') are NOT ancestors of HEAD (git merge-base confirms; find src -iname '*ProseParagraph*' → nothing); src/lib/entityRefTokenizer.js has zero src importers and DossierNarrativeBanner.jsx:46 renders nsrc.thesis.split(/\n\n+/) raw; npcComponents.jsx:244 renders npc.goal.short raw.
- Why: If this branch's edge source is deployed (it is in-tree) — or master's already-deployed generate-narrative serves this client — every AI-narrated dossier (a paid, credit-charged surface) displays literal ⟦entity:npc_x|Name⟧ tokens in the thesis, per-tab notes, and NPC goals, on web and PDF. It is also an unmapped master-merge collision seam: the mapped worldPulse 3-way does not cover this supabase+components cross-cut.
- Fix shape: Either port master's renderer trio (ProseParagraph.jsx, pdf/primitives/ProseText.jsx, the OutputContainer provider hoist + npcComponents/NotableNPCs/Overview wiring — commit 6d95adc7, small and self-contained) onto this branch and wire tokenizeProse at the four prose sites, or gate wrapEntityRefsInProse off until the merge. Add a contract test asserting: if the edge source calls the wrapper, some src component imports the tokenizer (producer⇒consumer pin). Record the seam in the master-merge map (memory/third-lineage).
- Verdict: _pending Opus verification_

**[code-quality-2] MEDIUM / confirmed — Orphaned-module census: ~12 dead files (~1,100 lines) beyond the register's six — including two Realm-suite gallery components whose 'dedicated mounting pass' exists only in a commit message**
- Where: `src/components/gallery/MapGalleryDetail.jsx:1` | Category: dead-code
- Evidence: Import-graph scan over all 871 src files (static + dynamic import(), plus tests/scripts/api/tools): zero importers for gallery/GalleryMapsSidebar.jsx(245L), gallery/MapGalleryDetail.jsx(236L), lib/mapSaves.js(123L, untouched since 2026-06-04), settlement/NextActionRail.jsx(123L), map/SimulationRulesGateToggle.jsx(69L), primitives/Disclosure.jsx(69L), hooks/usePricingMoment.js(57L), settlement/LockToggle.jsx(57L), lib/debounce.js(33L), pdf/primitives/StatTile.jsx(32L), utils/helpers.js(12L), data/categoryVocabulary.js(80L).
- Why: Register finding components-commerce-7 names only six dead components — the class is ~2× larger and spans lib/hooks/pdf/data, so its proposed inventory test would under-scope. MapGalleryDetail/GalleryMapsSidebar were 'Landed-but-unrendered by design' (commit 9b092d55: 'mounting the Realm suite requires the WorldMap body-swap → inspector-overlay composition, a dedicated pass') but that pass is tracked in no ledger — a classic dropped thread. Dead files also carry stale doc anchors: ProvenanceBlock.jsx:4 still says it 'Lives in the right rail beneath NextActionRail'.
- Fix shape: Fold into the register's planned only-shrinks unused-module inventory test, but scope it to ALL of src via the same import-graph walker layerBoundaries.test.js already contains (JSDoc-typedef-only modules like domain/types.js and worker-URL entries need a small allowlist). Owner decides per file: mount (the gallery pair — add the mounting pass to the round-21 backlog), delete, or baseline-with-reason.
- Verdict: _pending Opus verification_

**[code-quality-3] MEDIUM / confirmed — Eight roadmap-era domain read-models (~1,780 lines) are tested-but-unconsumed, one with a header that falsely claims a live UI consumer**
- Where: `src/domain/pipelineRail.js:5` | Category: dead-code
- Evidence: pipelineRail.js:5-7: 'The PipelineRail UI already exists; this module produces the structured payload it consumes when the user taps a step open' — but components/PipelineRail.jsx imports nothing from it (grep: zero src importers). Same zero-src-importer status for counterfactual.js(355L), mapProfile.js(355L), genreProfile.js(274L), devAnomalies.js(204L), distributionDashboard.js(203L), devDebug.js(163L), provenance.js(112L); none are edge-bundled (build-edge-shared.mjs ENTRIES = aiGrounding + analyticsEvents only) and none are imported by scripts/ or tools/.
- Why: These are whole features (counterfactual 'what if removed?' projection, genre profile, dev dashboards) that generation-side code never calls and no component renders — their unit tests keep them permanently green and permanently misleading ('tested' reads as 'alive'). provenance.js additionally ships the 'User canon preserved across rerolls' copy that register finding generators-domain-…:622 shows is an unkept promise.
- Fix shape: Triage in the same inventory-test wave as the component orphans: wire the ones with product intent (counterfactual and provenance have obvious dossier/DM surfaces; dev* belong behind the existing dev-panel pattern), delete the rest with their tests. At minimum fix the pipelineRail/provenance headers so they stop asserting consumers that do not exist.
- Verdict: _pending Opus verification_

**[code-quality-4] MEDIUM / confirmed — clamp/clamp01 re-implemented ~30 times across the engine with divergent NaN/non-finite semantics**
- Where: `src/domain/worldPulse/foodStockpile.js:47` | Category: duplication
- Evidence: foodStockpile.js:47 maps non-finite→lo ('Number.isFinite(v) ? v : lo'); relationshipState.js:16 coerces 'Number(value) || 0'; migrationKernel.js:57 / armyTransitKernel.js:53 / beliefMap.js:154 pass NaN through ((x<0?0:x>1?1:x) yields NaN for NaN); generators/helpers.js:42 exports a default-0..100 clamp. ~30 definitions total across domain/worldPulse, domain, components, lib.
- Why: In a byte-identity, determinism-first engine the NaN edge is exactly where same-shaped helpers diverge: a kernel that inherits the coercing clamp behaves differently from one that inherits the passthrough clamp when a malformed ledger value leaks in — a silent inconsistency class, and every new mover copies whichever neighbour it was written next to (armyTransitKernel/migrationKernel/beliefMap are all 2026 additions).
- Fix shape: One kernel primitive (src/kernel/math.js: clamp, clamp01, with explicit documented NaN policy — kernel is already the sanctioned shared-substrate home per layerBoundaries). Adopt per-module ONLY where the local variant's NaN behaviour provably matches (goldens byte-identical gate makes each adoption cheap to verify); minimum bar: stop new copies via a lint nudge like the deepCloneHotPath pattern.
- Verdict: _pending Opus verification_

**[code-quality-5] MEDIUM / confirmed — slugify exists in 8 variants, several identity-bearing; cross-module id join-compatibility is maintained only by copy-discipline (two byte-identical copies sit in the same directory)**
- Where: `src/domain/events/mutateHelpers.js:130` | Category: duplication
- Evidence: domain/events/batch.js:468 and domain/events/mutateHelpers.js:130 are byte-identical private copies; institutionalCatalog.js slugifyInstitutionName, entityLinks.js slugifyEntity (dash, 80-cap), goodsCatalog.js slugifyGood (underscore, 64-cap), entities/npcs.js (underscore, 32-cap, 'npc' fallback), foundry/moduleBuilder.js (dash, 40-cap), lib/customRegistry.js (underscore, trim) all differ in separator/cap/fallback.
- Why: Several of these mint or match PERSISTED ids (institution id-joins, npc ids inside the seeded event pipeline, custom-content prebuilt refIds, dossier anchors). Today the underscore family happens to agree; nothing but convention prevents a future edit to one copy from silently breaking an id join — the exact aliasing class institutionalCatalog's own collision-check comment warns about ('two DIFFERENT canonical names must never slug to the same id').
- Fix shape: A kernel/leaf slugify(value, {sep, max, fallback}) with the id-minting call sites importing it (byte-identical output per site — pure refactor, goldens prove it); at minimum merge the two identical domain/events copies and add a comment cross-linking the id-join family.
- Verdict: _pending Opus verification_

**[code-quality-6] MEDIUM / confirmed — Barrel hygiene is inconsistent: region/index.js wildcard-exports the feed engine alongside graph internals into both engine and UI consumers, and worldPulse/index.js is a 22-module export* barrel with exactly one consumer**
- Where: `src/domain/region/index.js:1` | Category: barrel-hygiene
- Evidence: region/index.js: 'export * from' ×7 including wizardNews.js; imported by pulseKernel.js:74, applyWorldPulse.js:13, candidateEvents.js:10 AND components (LayersPanel.jsx:20 for one const, WizardNewsPanel.jsx:5). worldPulse/index.js re-exports 22 engine modules; sole importer is LivingWorldGates.jsx:39 (one function). Contrast spatial/index.js:11-15: curated exports + 'this module must NEVER enter the entry static closure' law.
- Why: The Wave-2 feed-retention bust (+363 B eager, blocked on FP-2) was precisely 'wizardNews.js is EAGERLY store-imported' — wildcard barrels make that class easy to recreate: any eager import of one region/worldPulse symbol drags the whole engine (feed generator included) into that chunk, and the budget test catches it only after the fact. The single-consumer worldPulse barrel also couples LivingWorldGates' chunk to the entire pulse engine for one accessor.
- Fix shape: Convert region/index.js to the spatial/index.js curated style with the same first-paint law comment (or split a display-safe leaf for REGIONAL_CHANNEL_TYPES/summarizeWizardNews); point LivingWorldGates at simulationRules.js directly and either delete worldPulse/index.js or shrink it to the intended public surface. Byte-neutral by construction; verify:dist confirms.
- Verdict: _pending Opus verification_

**[code-quality-7] MEDIUM / confirmed — The domain layer — the highest-judgment code — is the only major layer without a size ratchet; warDeployment.js is 2,024 lines with a single ~930-line function**
- Where: `src/domain/worldPulse/warDeployment.js:1092` | Category: maintainability
- Evidence: evaluateWarLayer opens at warDeployment.js:1092 and its closing brace is line 2024 (the file's last line) — one exported function spanning ~932 lines. pulseKernel.js is 1,924 lines. eslint.config.js ratchets components at 600 (line 340) and generators at 800 (line 360) with named grandfathers; no max-lines block covers src/domain.
- Why: The house doctrine is 'ratchet the shape' — and it demonstrably worked for the ten god-components and three generator monoliths — but the files where a mis-read costs most (the war layer, the tick kernel) sit in the unratcheted layer and are still growing (M9–M11 all landed here). A 930-line orchestrator is where the next lifecycle ghost hides. (RISK_REGISTER R4 covers settlementSlice as deliberately deferred; the domain layer is not covered by any deferral.)
- Fix shape: Extend the max-lines ratchet to src/domain/**/*.js at a ceiling just above today's worst offenders with the standard grandfathered-list-shrink-only pattern (warDeployment, pulseKernel, settlement.schema, causalState, explanation, capacityModel get named overrides). Independently, evaluateWarLayer decomposes along its own existing step comments (behavior-preserving extraction, goldens byte-identical — same recipe as F31).
- Verdict: _pending Opus verification_

**[code-quality-8] LOW / confirmed — FNV-1a hashing hand-rolled 10 times with divergent variants; the newest copy landed 2026-07-13, so the pattern is still propagating**
- Where: `src/domain/display/newsVoice.js:33` | Category: duplication
- Evidence: Ten 0x811c9dc5 implementations (generationTelemetry, structuralFingerprint, campaignSync, normalizeSettlement [dual-round h1], pendingEdits, relationshipRuleHelpers, contestMath [+avalanche h^=h>>>16], newsVoice [2026-07-13], causeConjunctionContent, campaignSliceShared [length-prefixed base36]).
- Why: Each use is self-contained today, but the variants differ (post-mix, width, encoding) while all LOOK like 'the FNV hash' — a future cross-module 'same hash' assumption would silently disagree. src/kernel is the designated determinism-primitive home (prng/rngContext) and has no string-hash primitive, which is why every author re-rolls one.
- Fix shape: Add fnv1a32(str) (and the length-prefixed digest helper) to src/kernel; adopt in NEW code by convention; migrate existing sites opportunistically only where output is provably identical (most sites feed persisted/golden-covered variant selection, so adoption is per-site gated by the golden battery).
- Verdict: _pending Opus verification_

**[code-quality-9] LOW / confirmed — neighbor/neighbour naming drift persists across the live schema, including a fallback read of a key nothing ever writes (neighbourRelationship)**
- Where: `src/components/OutputContainer.jsx:423` | Category: naming-drift
- Evidence: OutputContainer.jsx:423: 'rawSettlement?.neighborRelationship || rawSettlement?.neighbourRelationship || rawSettlement?.neighbourNetwork?.length' — repo-wide grep finds no writer of `neighbourRelationship` (only this read). Generator mints US-spelled neighborRelationship; the canonical persisted array is UK-spelled neighbourNetwork (saves.js:150-162 migration); spatial uses neighbourTiers; the store slice is neighbourSlice.
- Why: The mixed-spelling seam is exactly where the codebase already got burned once (the saves-migration gap in the June review); the dead middle key in the fallback chain is fossil evidence — it reads as load-bearing but can never fire, and the next author has three spellings to guess between. Directory naming compounds it: components/settlement/, settlements/, settlementDetail/, and the opaque new/ (which holds the dossier tabs) are four adjacent homes for the same surface.
- Fix shape: Delete the dead `neighbourRelationship` term from the fallback; add a one-line vocabulary note at the settlement.schema neighbour fields declaring the canonical spellings (generator-legacy US key vs persisted UK key) so the pair stops looking accidental. Directory consolidation is optional/churn-heavy — at minimum rename new/ to dossierTabs/ when it next churns.
- Verdict: _pending Opus verification_

**[code-quality-10] LOW / confirmed — Nit batch: store/index.js header says 14 slices but composes 15; one-shot codemod scripts linger unmarked in scripts/; WorldMap bridge ops swallow errors with bare empty catches**
- Where: `src/store/index.js:2` | Category: docs-drift
- Evidence: store/index.js:2 'Unified Zustand store with 14 slices' — the create() spreads 15 creators (createAccountImportSlice at line ~66 is absent from the header list). scripts/fix-backspace-regexes.js self-describes as 'One-shot script' yet sits beside live gate scripts. WorldMap.jsx:441/453/664 'try { await bridge.clearAllPlacements(); } catch (e) {}' — bridge failures vanish with no debug trace (22 empty catches in src; the map pointer-capture ones are idiomatic).
- Why: Each is minor alone; together they are the small-drift class the repo's own doctrine (docs updated same commit as code) is designed to prevent. The header miscount is the kind of stale map a successor AI trusts; the unmarked codemods invite an accidental rerun; the silent bridge catches make FMG-bridge regressions undebuggable in the field.
- Fix shape: One-line header fix (+accountImportSlice entry); move one-shot codemods to scripts/retired/ or add a RETIRED header line; give the WorldMap bridge catches a console.debug tag (components layer — no purity constraint).
- Verdict: _pending Opus verification_


### Slice: test-quality (grade A-)

**[test-quality-1] HIGH / confirmed — verify:dist anti-vacuity is claimed in CI but not implemented — a missing/renamed dist silently vacates the constitutional first-paint ratchet**
- Where: `package.json:32` | Category: gate-vacuity
- Evidence: package.json: `"verify:dist": "VERIFY_DIST=1 vitest run tests/build/"`; ci.yml:106-111 claims VERIFY_DIST "turns a missing dist/ into a HARD failure so a chunk contract can never count green having verified nothing" — but a repo-wide grep shows NO test reads process.env.VERIFY_DIST; vendorPdfLazy.test.js:336 is `describe.runIf(distExists)` and iconChunkSplit.test.js:67 is `if (!existsSync(assets)) return;`.
- Why: Constitutional law 5 (the first-paint budget ratchet) is enforced solely by this suite. If dist/assets is absent or its path changes (vite outDir restructure, partial build), every chunk contract + the CLOSURE_BUDGET_BYTES ratchet skips and vitest exits 0 — the exact green-on-nothing class this repo already shipped (+293B overage documented at vendorPdfLazy.test.js:179-200). The correct guard EXISTS in the parallel lineage (.claude/worktrees/awesome-ritchie-063978/tests/build/vendorPdfLazy.test.js:39-43 — `const requireDist = process.env.VERIFY_DIST === '1'` + a hard-fail test) and was never ported.
- Fix shape: Port the reference lineage's guard: a `describe.runIf(requireDist)` block in tests/build/vendorPdfLazy.test.js asserting `expect(distExists).toBe(true)` when VERIFY_DIST=1, so the post-build re-run hard-fails on a missing dist. Three lines, no product code, matches the ci.yml comment already written.
- Verdict: _pending Opus verification_

**[test-quality-2] MEDIUM / confirmed — Money-path pglite execution suites silently skip when a pinned migration filename disappears — no executed-count guard, and the master merge is expected to renumber migrations**
- Where: `tests/security/creditLedger.pglite.test.js:98` | Category: gate-vacuity
- Evidence: `const MIG = { '009': resolve(dir,'009_profile_security.sql'), … '123': … }; const allExist = Object.values(MIG).every(existsSync);` … `describe.runIf(allExist)('credit RPCs — execution against the real SQL (pglite)')` — same pattern in feeSchedule/profileEscalation/creditBalanceIdorGuard/gallery* pglite suites.
- Why: If any pinned migration is renamed/renumbered — precisely what the third-lineage master-merge reconciliation risks (the repo's own top-listed hazard) — the credit/refund/IDOR/gallery-privacy EXECUTION tests all skip and vitest stays green. Unlike the e2e job, there is no runtime not-vacuous guard for vitest suites, so the security spine can vacate exactly when the risk event happens.
- Fix shape: Replace runIf with a hard assertion (`it('migration fixtures exist', () => expect(allExist).toBe(true))`) or resolve migrations by pattern (glob `*_profile_security.sql`) + a manifest test asserting the pglite suite count executed > 0 (the check-e2e-not-vacuous idiom applied to vitest).
- Verdict: _pending Opus verification_

**[test-quality-3] MEDIUM / confirmed — Four spatial goldens self-mint on a missing manifest — deleting the fixture re-pins silently green**
- Where: `tests/property/spatialDigestGolden.test.js:52` | Category: tamper-evidence
- Evidence: `if (UPDATE || !existsSync(MANIFEST)) { … writeFileSync(MANIFEST, …) } const pinned = JSON.parse(readFileSync(MANIFEST…)); expect(hash).toBe(pinned.hash);` — same `UPDATE || !existsSync(MANIFEST)` in seaLanesGolden.test.js:55, seasonalOverlayGolden.test.js:50, teleportEdgesGolden.test.js:55.
- Why: A golden that recreates its own pin when absent is not tamper-evident: a merge/checkout that drops the fixture (this tree runs parallel worktrees and a 200-commit lineage merge is ahead) launders any digest/cost-law drift into a fresh green pin. Every other golden in the tree (generator, worldpulse×3, belief, rumor) uses the safe pattern — an explicit 'manifest exists (run UPDATE_GOLDEN=1)' failing test.
- Fix shape: Align the four keystone-family goldens to the manifest-exists pattern: fail when the fixture is absent unless UPDATE_GOLDEN=1 is explicitly set.
- Verdict: _pending Opus verification_

**[test-quality-4] MEDIUM / confirmed — M10b 'living' progression is untested — only 'autonomous' and 'dm_advanced' are driven; pause-on-major during catch-up has zero coverage**
- Where: `tests/store/catchUpCampaignWorld.test.js:109` | Category: test-coverage
- Evidence: All six tests seed `progression: 'autonomous'` or `'dm_advanced'`; the implementation branches `const autoResolve = worldProgressionOf(rules) === 'autonomous'` (campaignWorldPulseSlice.js:456) and on a paused advance `if (!result || result.ok === false) break; … return { ok: true, weeksCaughtUp: done, capped }` — the living early-break/partial-weeks contract is never asserted.
- Why: 'Living pauses on a major' is one of the two owner-ruled M10b semantics (§0.6.1 decision 2) and a user-visible product mode. A regression that auto-resolves majors under 'living' (or double-counts the paused tail on the next open) would ship green — and this is new persisted-cursor lifecycle code, the owner's most-bitten bug class.
- Fix shape: Add two pins: (a) a living catch-up where a mid-loop tick surfaces a major → catch-up stops early, weeksCaughtUp < elapsed, proposals queued not resolved; (b) after the DM resolves, the next catch-up resumes without double-running (cursor semantics across the pause).
- Verdict: _pending Opus verification_

**[test-quality-5] MEDIUM / confirmed — The WorldPulsePanel on-open catch-up trigger — the only production call site — has no component test**
- Where: `src/components/map/WorldPulsePanel.jsx:1` | Category: test-coverage
- Evidence: grep: `catchUpCampaignWorld` appears in exactly one component (WorldPulsePanel.jsx) and in zero files under tests/components or tests/ui; the store action is tested headlessly only.
- Why: The living-world feature's actual user behavior IS the once-per-open useEffect (Date.now-derived, cursor makes remount a no-op). A broken dep array, a removed advancesOnOpen guard, or firing against the wrong campaign would ship with the store suite fully green — the classic seam gap between a tested action and untested wiring.
- Fix shape: One jsdom smoke test mounting WorldPulsePanel with a living campaign and a mocked store: asserts catchUpCampaignWorld fires exactly once on open, not on re-render, and never for dm_advanced.
- Verdict: _pending Opus verification_

**[test-quality-6] MEDIUM / confirmed / KNOWN-DEFERRED — No test exercises two movers together — the mover-interaction matrix is entirely deferred to the checkpoint, and M10b weakened that deferral**
- Where: `tests/domain/simulationRulesPreset.stability.test.js:142` | Category: sim-logic-gap
- Evidence: grep: no test file sets both `seasonsEnabled: true` and `commodityFlowEnabled: true`; full_simulation appears only in flag-shape pins ('full_simulation lights ALL EIGHT war sub-flags') — no test runs a single pulse tick under the full_simulation preset.
- Why: The product's moat is mover COMPOSITION (winter slows caravans → stockpiles drain → EV refuses → smugglers run), yet every mover is soaked solo. This is the documented PART-5 Living-Realm-checkpoint deferral — but M10b just made full_simulation 'autonomous' (auto-advances on open), so real users will run the never-executed everything-on path automatically before the checkpoint soak exists. The deferral was ruled when full_sim was manual.
- Fix shape: A cheap interim pin, not the full checkpoint: one 26-week kernel test under the literal SIMULATION_RULE_PRESETS.full_simulation.rules asserting no-throw + conservation invariants (goods, migration) + bounded ledgers. Keeps the checkpoint as the real validation while removing the 'most feature-dense shipped preset has zero executed ticks' hole.
- Verdict: _pending Opus verification_

**[test-quality-7] MEDIUM / confirmed / KNOWN-DEFERRED — Known flake left unmitigated: pipeline.property seed-sensitivity has no per-test timeout while sibling suites carry the house override**
- Where: `tests/property/pipeline.property.test.js:123` | Category: flake
- Evidence: The seed-sensitivity test runs 8 pairs × 25 numRuns = 400 full generations with no timeout argument (root default 20s); ROUND21 plan records: 'ONE PRE-EXISTING env red: pipeline.property seed-sensitivity times out at 20s under machine load ~273 — CONFIRMED identical on untouched base'. generatorGoldenMaster.test.js:117 sets 120_000 for the same class with an explicit precedent comment.
- Why: A gate test that reds under load trains re-run habits and erodes trust in the full battery — the deferral (documented as 'pre-existing env red') is unsound because the repo's own precedent fix (a per-test wall-clock allowance, explicitly labeled 'not drift') is a one-line change already applied to three sibling suites.
- Fix shape: Add the 120_000 timeout to the seed-sensitivity (and same-seed deep-identity) tests with the standing precedent comment, mirroring generatorGoldenMaster/distributionEnvelopes.
- Verdict: _pending Opus verification_

**[test-quality-8] MEDIUM / confirmed — Paid-flow verification is honest but thin at the edges: the live purchase lane is a permanent skeleton and 3 of 7 money-module coverage floors are ≈0**
- Where: `vite.config.js:601` | Category: test-coverage
- Evidence: Floors: `'src/lib/stripe.js': { statements: 0, branches: 0, functions: 9, lines: 0 }`, creditLedger 10/21/23/12, creditsSlice 11/0/7/11 — while ci.yml:172-179 sells the job as 'a deleted money-path test is exactly the regression this catches'. e2e/flow-b-auth-credits-ai.spec.js:257-283: the live Stripe suite is `test.skip(!LIVE_AUTH)` wrapping a single `test.fail()` placeholder; no CI lane sets E2E_LIVE_AUTH.
- Why: The reconciliation e2e (flow-e/f) and Deno webhook execution tests are genuinely strong, but a deleted creditLedger/creditsSlice test cannot trip a floor of 0-11%, and no automated path has ever completed a real checkout → webhook → entitlement loop. Pre-launch on a paid product, that residual is worth stating precisely rather than absorbing into the job's confident naming.
- Fix shape: Either raise the three floors after a targeted pglite-backed unit pass (creditLedger has execution tests — measure and floor them), or annotate the ci.yml job comment to name the exempt files; separately schedule the E2E_LIVE_AUTH lane (secrets exist per the file's own contract note) as a weekly/manual job like mutation-sweep.
- Verdict: _pending Opus verification_

**[test-quality-9] LOW / confirmed — The active-path worldpulse 'goldens' pin narrow oracle-normalized projections, not bytes — active-path prose/ledger drift escapes golden coverage**
- Where: `tests/property/worldpulseSpatialGolden.test.js:154` | Category: golden-scope
- Evidence: The spatial golden hashes only `{tick, marker, arrivalKeys, arrivalTicksSeen, queuedImpacts, patrons, candidateTypes}` through normalizeForDormancy (absent === {} === []); the deity golden similarly pins pantheon/patrons/candidateTypes/rollSummary 'NEVER prose'. Ledger rows then say 'goldens byte-identical'.
- Why: Deliberate and documented per header (narrative-copy edits must not false-positive), and the generator golden IS full-JSON — but a drift in active-spatial stressor bookkeeping, news content, or ledger internals that keeps the candidate histogram and patron seats stable passes every 'golden'. Worth knowing at the master merge, where 'byte-identical' claims will be load-bearing and the oracle's absent==={} semantics differ from raw bytes (the F24 NUL class was caught only by raw byte checks).
- Fix shape: No change to the goldens; add one full-worldState-hash pin on a SINGLE active-spatial config (accepting it trips on prose — that is its job, refresh via UPDATE_GOLDEN), or document in §0.2 that law-1 'byte-identity' means raw bytes for generator/digest and normalized projection for pulse.
- Verdict: _pending Opus verification_

**[test-quality-10] LOW / confirmed — Nit batch: stale counts, vacuous test bodies, and advertised-but-missing cases**
- Where: `tests/property/beliefMapGolden.test.js:156` | Category: nit-batch
- Evidence: (1) beliefMapGolden 'anti-vacuity: …the two modes differ' asserts only non-emptiness, never pd≠un hash. (2) flow-b 'modal closes' test (flow-b:172-188) asserts nothing — comment admits 'strict close-on-escape is left to the unit tests'. (3) flow-f header advertises the terminal-mismatch → support-card state but the spec has only success + 503-retry. (4) ci.yml:217 says '155-config manifest'; generator-golden-master.json has 187 keys. (5) saveCompatibility's fixture museum holds one real save (april-2026-v1.json) — by design, but the museum will matter at the master merge.
- Why: Each is small; together they are the residue a final pre-launch sweep should clear so test names and CI comments keep meaning exactly what they say.
- Fix shape: One hygiene commit: strengthen the two weak assertions, add the flow-f terminal case, fix the ci.yml count, note the fixture-museum policy inline.
- Verdict: _pending Opus verification_


### Slice: docs-knowledge (grade B+)

**[docs-knowledge-1] HIGH / confirmed — State ledger contradicts git truth at the parallel-stream merge: M11b is committed but both live handoff docs say WIP/unbuilt/'do not touch', and M11a+M11b have no ledger rows**
- Where: `docs/PHASE55_EXECUTION_PLAYBOOK.md:414` | Category: docs-drift
- Evidence: §0.8: "⚠️ src/domain/spatial/calamity.js is that session's UNCOMMITTED WIP (M11b) in the main worktree — FOREIGN, do not touch." Git: `git merge-base --is-ancestor 62c81a0c HEAD` → true (commit "Phase 5.5, M11b — CALAMITY", 5 files, no docs). §0.0.1's last row is M10b; grep shows M11a (82ad676b, also in HEAD) appears only in merge notes (lines 159/410/441), never as a row. Round-21 plan line 74: "BLOCKED on M11b calamity (the last mover, UNBUILT)."
- Why: Violates the playbook's own law (§0.3-7: "A wave is not 'done' until its ledger row exists — this document is the successor's memory") at the exact point two parallel streams merged. A successor starting at §0.0 per the succession protocol would re-dispatch or mis-sequence M11b, treat committed code as untouchable foreign WIP, and miss that ruins-as-artifacts is now unblocked. The two newest docs directly contradict: COMPREHENSIVE_REVIEW_2026-07-13.md line 4 correctly says "M1–M11 ladder complete". Corroborates and extends register finding spatial-engine-7 (there graded medium; within this dimension the succession-mechanism breakage is the top defect).
- Fix shape: One doc commit: append M11a (82ad676b + fix 10f22f39) and M11b (62c81a0c) rows to §0.0.1 with gates and the parked disastersEnabled +20B preset decision; rewrite §0.8's calamity WIP warning and item 7; fix round-21 plan lines 24/74. Structural prevention (bold, in-repo precedent): a tests/docs pin that greps `git log` subjects matching /^Phase 5\.5, (M\d+\w*|[A-Z0-9-]+ )/ on HEAD's history and asserts each has a matching §0.0.1 row token — the ledger law becomes gate-checked like the meta-pin.
- Verdict: _pending Opus verification_

**[docs-knowledge-2] HIGH / confirmed — ARCHITECTURE.md omits the entire spatial engine — zero 'spatial' mentions while src/domain/spatial/ holds 21 modules of the product's moat**
- Where: `ARCHITECTURE.md:44` | Category: docs-drift
- Evidence: `grep -c "spatial" ARCHITECTURE.md` → 0. `ls src/domain/spatial/ | wc -l` → 21 (embattlement, migration, armyTransit, seaLanes, smuggle, pestilence, calamity, spatialDigest, rumorNetwork…). The domain/ paragraph enumerates worldPulse subsystems ("war & siege… trade war… religion… coups") as "~74 modules" — actual worldPulse count is 104.
- Why: The doc's stated purpose is "the *current* shape of the code… to lower the cost of a second contributor" (bus-factor-one is its own named risk). A newcomer onboards to a pre-Phase-5.5 architecture with the living-world engine — the thesis differentiator, M1–M11, the frozen digest, the belief/rumor layer, and its constitutional laws (byte-identity, dormancy, budget ratchet) — invisible.
- Fix shape: Add a spatial-engine paragraph to the layer map (digest-at-canonize, conditionally-materialized spatialLedgers, dormancy law, the M1–M11 mover set) plus a pointer to docs/PHASE55_EXECUTION_PLAYBOOK.md §0.2 as the constitution. Extend architectureFreshness.test.js with a derived pin (doc must mention src/domain/spatial and state its module count ±tolerance) so this layer can never silently vanish from the map again.
- Verdict: _pending Opus verification_

**[docs-knowledge-3] MEDIUM / confirmed — Playbook §0.0.2 standing-amendments budget line is stale: says 'CURRENT closure 1,255,965 = 20B margin' while its own M10b row and §0.8 record 1,254,893 / 1,092B**
- Where: `docs/PHASE55_EXECUTION_PLAYBOOK.md:73` | Category: docs-drift
- Evidence: §0.0.2: "CURRENT closure 1,255,965 = 20B margin (post-M10a; MEASURED 2026-07-13)". M10b row (§0.0.1:68): "closure 1,254,893 ≤ 1,255,985 (margin 1,092)"; §0.8: "Net budget: closure 1,254,893 ≤ 1,255,985 (margin 1,092 B)".
- Why: §0.0.2 is the "things a successor must not re-litigate" section; byte-headroom is the scarce resource every wave decision keys on. A successor doing budget math from the standing section is off by 55× (20B vs 1,092B) and would wrongly STOP budget-costing waves — the same failure mode the round-21 stream hit when it discovered the 20B wall.
- Fix shape: Update the §0.0.2 line to the post-M10b measured closure and add "(see the newest §0.0.1 row for the live number)" so the standing section defers to the ledger instead of duplicating a volatile number; the doc-refresh commit from the M11 finding should carry it.
- Verdict: _pending Opus verification_

**[docs-knowledge-4] MEDIUM / confirmed — Playbook §0.0.3 'IN-FLIGHT / ON THE DESK' is an unpruned append-log: the NEXT pointer routes a successor to Wave A → M1..M10 (all long landed) and the model/queue notes are an era stale**
- Where: `docs/PHASE55_EXECUTION_PLAYBOOK.md:171` | Category: docs-drift
- Evidence: "NEXT: W5 merge review → Wave A (PART 4) → merges (PART 6) → M1..M10 movers (PART 7) → the Living Realm checkpoint" — while §0.0.1 records Wave A and M1–M10 complete. Section also still lists 3.5/Wave-A/M1–M6a/FP-R as on-desk items, and "MODEL: main loop switched to OPUS 4.8… Fable-reserved items… queue for a Fable session" — the Fable comprehensive grade-check is now RUNNING (COMPREHENSIVE_REVIEW_PROGRAM.md).
- Why: §0.0.3's charter is "update on every dispatch + landing" — it is the successor's desk. As an append-log with a dead NEXT pointer it forces the reader to diff eras themselves, and the stale model note tells a Fable session not to do what the owner has since directed it to do (self-rule review sequencing).
- Fix shape: Prune §0.0.3 to genuinely-open items only (M10b eager-trim, W5/W2 re-apply, budget ratchet-down, 5.5-K empirical check, supplyCompleteness NUL, endgame), collapse landed entries into a one-line pointer at §0.0.1, and rewrite NEXT to the §0.8 sequence. Consider making §0.8 the single NEXT surface and §0.0.3 a pointer to it — two competing 'what next' sections is the root cause.
- Verdict: _pending Opus verification_

**[docs-knowledge-5] MEDIUM / confirmed — Two live handoff docs allocate the same 1,092B headroom without cross-reference: playbook §0.8 promises it to W5 (~890B) while the round-21 plan promises Wave 2 (+363B) 'will fit' — combined they exceed the margin**
- Where: `docs/PHASE55_ROUND21_BACKLOG_PLAN.md:41` | Category: docs-drift
- Evidence: Round-21 plan: "wait for the parallel FP-2… THEN land Wave 2 (cherry-pick 2f4f7b58, it will fit…)". Playbook §0.8 step 2: "W5… ~+890 B eager. ⚠️ CHECK FIT: margin is now 1,092 B, so W5 fits (→ ~200 B) ONLY if M10b is trimmed first". 363+890=1,253 > 1,092. The round-21 plan also still says (§6) claude/phase55-parking-lot is "UNMERGED" (merged at 4d93cba) and presents the budget fork as awaiting the owner though FP-2a's landing resolved it.
- Why: Both docs are START-HERE handoffs for potentially different sessions; each independently believes it owns the post-FP-2 headroom. A session executing either doc alone can consume the margin the other doc's wave was promised, producing a budget STOP mid-wave — the exact serialization tax the concurrency law (§0.4) exists to prevent, recreated at the docs layer.
- Fix shape: Single-writer for headroom: make playbook §0.8 the one budget queue (order: M10b trim → W5 → W2 feed-retention → ratchet-down), and change the round-21 plan's §1/§3 to defer to it ("headroom sequencing lives in playbook §0.8"). Update the plan's §6 merged-status lines in the same pass.
- Verdict: _pending Opus verification_

**[docs-knowledge-6] MEDIUM / confirmed — CONTRIBUTING.md understates the gate by half and never mentions the constitution — the second-contributor path bypasses goldens, byte-identity, and the budget ratchet**
- Where: `CONTRIBUTING.md:10` | Category: docs-drift
- Evidence: "Everything runs through `npm run check` (validate data/edge/map → typecheck → lint → ~4,500 tests → build)" — actual check (package.json:33) adds validate:migration-head, typecheck:domain:strict, and verify:dist, and the suite is 8,348 tests/726 files (review baseline). The 'what every change must carry' table has no row for engine-behavior changes (goldens byte-identical / owner-signed UPDATE_GOLDEN), no budget, no any-cast ceiling, no playbook §0.2 pointer.
- Why: generatorGoldenMaster.test.js's own header teaches `UPDATE_GOLDEN=1` regeneration; a well-meaning second contributor following CONTRIBUTING.md would regenerate goldens to green a failing gate without knowing regens are owner-gated (constitution law 1). The operating doctrine that actually governs every change is unreachable from the documented contributor entry point.
- Fix shape: Add a 'the constitution' subsection (same-seed byte-identity + owner-gated regen, dormancy, first-paint ratchet/verify:dist, any-cast 2252) linking playbook §0.2; add an engine-behavior row to the proof table; derive the gate description from package.json in prose or pin it in architectureFreshness-style (assert CONTRIBUTING names every check sub-step).
- Verdict: _pending Opus verification_

**[docs-knowledge-7] MEDIUM / confirmed — ARCHITECTURE.md 'The gate' section describes a 5-step check; the real gate is 10 steps including verify:dist — the constitutional first-paint ratchet is absent from the architecture doc**
- Where: `ARCHITECTURE.md:202` | Category: docs-drift
- Evidence: "`npm run check` = `validate:data && typecheck && lint && test && build`." package.json:33: check = validate:data && validate:migration-head && validate:edge && validate:map && typecheck && typecheck:domain:strict && lint && test && build && verify:dist. Related number drift in the same doc: "155-config golden-master hash manifest" (manifest has 187 entries) and "~7,000 tests / ~589 files" (8,348/726 — still inside the freshness test's 25% tolerance but approaching the wall).
- Why: The gate IS the product per CONTRIBUTING; a reader planning CI or local verification from ARCHITECTURE.md misses the migration-head ledger check, the domain-strict ratchet, and verify:dist — three of the enforcement mechanisms the constitution depends on. The freshness test pins other numbers but not the gate description, so this rot class is currently invisible to the gate.
- Fix shape: Rewrite 'The gate' from package.json's actual chain with one line per step, and extend architectureFreshness.test.js to assert the doc names every `npm run check` sub-script (derive from package.json exactly as the test already derives step order from steps/index.js). Refresh 155→187 and the suite numbers in the same commit.
- Verdict: _pending Opus verification_

**[docs-knowledge-8] MEDIUM / confirmed — RISK_REGISTER.md claims 'Living document' but was last reviewed 2026-06-16, pre-dating the entire spatial engine — and CONTRIBUTING/REVIEW_FINDINGS still route readers to it as the current risk view**
- Where: `docs/RISK_REGISTER.md:3` | Category: docs-drift
- Evidence: "> **Living document. Last reviewed: 2026-06-16** (branch `analytics-intelligence-layer`)"; grep for spatial/Phase 5.5/master-merge → no risk rows (only June-era fixed items). CONTRIBUTING.md:5 points here "for current risks"; REVIEW_FINDINGS.md:3 calls it "the live, maintained risk view."
- Why: The actual current top risks — prod 12 migrations behind incl. privacy strips (review §6.1: constitution law 3 unenforced in prod), the master-merge third-lineage collision, un-soaked deploy, CSP report-only — live in the playbook and the comprehensive review, not in the doc the supersession chain designates. A reader following the documented pointer chain lands one full era behind; a 'living' banner on a stale doc is worse than an honest historical banner.
- Fix shape: Either refresh the register as part of the review program's Phase E (fold in review §6 owner-urgent items + the master-merge lineage risk, stamp the review date) or demote its banner to historical with a pointer to the playbook §0.0.2 + the newest comprehensive review — and fix CONTRIBUTING's pointer accordingly. A freshness pin (last-reviewed date within N days of the newest review doc) would keep the 'living' claim honest.
- Verdict: _pending Opus verification_

**[docs-knowledge-9] LOW / confirmed — Round-21 plan internally contradicts itself on numeric prices: the START-HERE handoff lists it budget-free/lazy while the older triage section below still parks it as 'UI-eager, need owner ratification'**
- Where: `docs/PHASE55_ROUND21_BACKLOG_PLAN.md:46` | Category: docs-drift
- Evidence: §2 BUDGET-FREE WAVES: "Numeric prices (Wave 7) — HIGHEST remaining value. A LAZY display read-model… Byte-safe (rides a lazy chunk)." vs line 147 PARKED section: "Numeric prices (surfaces the economic model's numbers — UI-eager, 'generation is sacred')" under "need owner ratification before building."
- Why: The two triage tables give opposite dispatch permissions for the same wave; a successor reading the wave table (not the NEXT-STEPS handoff) would park the item the handoff calls the highest-value do-now work.
- Fix shape: Delete or update the stale PARKED row (and the pre-merge §6 'UNMERGED' lines) when the plan is next touched; the doc's own Progress-blockquote convention argues for pruning superseded triage rows rather than stacking eras.
- Verdict: _pending Opus verification_

**[docs-knowledge-10] LOW / confirmed — @enforced-by mis-tag: ARCHITECTURE.md names the analytics-bundle freshness test as the enforcer for the aiGroundingBundle claim**
- Where: `ARCHITECTURE.md:179` | Category: docs-drift
- Evidence: "`aiGroundingBundle.js` is **built** from app code… a freshness test fails the gate on drift. <!-- @enforced-by tests/edgeFunctions/analyticsEventsBundle.freshness.test.js -->" — that test covers analyticsEventsBundle.js (its header: "Mirrors the aiGrounding bundle" test); the actual enforcer tests/edgeFunctions/aiGroundingBundle.freshness.test.js exists separately.
- Why: The claim is true and enforced, but the tag points at the sibling — the meta-pin only checks the target exists and is gate-reachable, not that it enforces THIS claim, so the mis-tag passes silently. Someone deleting the real aiGrounding test would see no doc-claim failure.
- Fix shape: Point the tag at tests/edgeFunctions/aiGroundingBundle.freshness.test.js (optionally list both since _shared/ covers both bundles).
- Verdict: _pending Opus verification_

**[docs-knowledge-11] LOW / confirmed — No README.md at the repo root — a cold clone has no entry pointer to ARCHITECTURE/CONTRIBUTING/the playbook**
- Where: `?:?` | Category: docs-drift
- Evidence: `ls README*` → no matches. Root docs are ARCHITECTURE.md, ASSESSMENT.md, CONTRIBUTING.md, DESIGN_STRESSOR_DYNAMICS.md, PDF_PARITY_AUDIT.md; nothing designates the reading order (ARCHITECTURE.md self-describes as the map but nothing points to it first).
- Why: Every onboarding surface (GitHub landing, editor tree) opens on nothing; for a bus-factor-one repo whose docs explicitly exist to lower the second-contributor cost, the conventional first file is absent. Cheap to fix, disproportionate onboarding value.
- Fix shape: A 10-line README: what SettlementForge is (the simulates-not-rolls thesis), then the reading order — ARCHITECTURE.md (map) → CONTRIBUTING.md (gate + constitution pointer) → docs/PHASE55_EXECUTION_PLAYBOOK.md §0.0 (live program state). Add README.md to the enforcement-claims corpus if it makes claims.
- Verdict: _pending Opus verification_

**[docs-knowledge-12] LOW / confirmed — State-ledger rows M4 through M10a carry '(this commit)' placeholders instead of the hashes the ledger's own header promises**
- Where: `docs/PHASE55_EXECUTION_PLAYBOOK.md:51` | Category: docs-drift
- Evidence: §0.0.1 header: "(chronological, with commit hashes — verify any claim via `git show <hash>`)"; rows M1–M10a (lines 48–63) all read "| (this commit) |". M1–M3 hashes are recoverable from §0.0.3; M4–M10a only from git-log subject search (e.g. M4 = 2825b132, M9a = d3536e8e).
- Why: The ledger's verification affordance (git show <hash>) is broken for 13 consecutive rows because the row is written before the commit exists and never backfilled — the same never-backfilled pattern that produced the M11 gap. Low because subjects make recovery easy, but the self-declared contract is unmet.
- Fix shape: Backfill the 13 hashes in the M11 doc-refresh commit; amend §0.3-7 to say the NEXT commit must backfill the hash (or write the row in a follow-up commit that can name it), so '(this commit)' is never a terminal state.
- Verdict: _pending Opus verification_

**[docs-knowledge-13] LOW / confirmed — Nit batch: small staleness items across the corpus**
- Where: `ASSESSMENT.md:5` | Category: docs-drift
- Evidence: (1) ASSESSMENT.md supersession banner itself stale: "engine now has ~2,400 tests" (actual 8,348). (2) playbook:11 still lists the four shipped briefs as "BINDING COMPANIONS (do not duplicate, reference)" with no shipped-status note; briefs themselves carry no status stamps. (3) docs/PHASE6_DATA_LIFECYCLE.md:33 uses a prose @enforced-by target ("the provenance pin, §5") that resolves to nothing and sits outside the meta-pin corpus. (4) §0.0.2:76 keeps the historical "⚠️ HEADROOM CRITICAL as of 3.5: only 63 BYTES" directly under the (also stale) CURRENT line — two dead budget numbers stacked. (5) playbook:388 references "a new tests/store/lazySliceManifest.test.js" that never existed — inside the clearly-labeled SUPERSEDED §0.7.3-OLD, so acceptable, but a stray match for anyone grepping test names.
- Why: Individually harmless; collectively they add friction to the exact grep-and-verify workflow the succession docs are designed for.
- Fix shape: Fold all five one-liners into the same doc-refresh commit as the ledger fixes: refresh the ASSESSMENT banner number, stamp the four briefs SHIPPED with hashes, fix or drop the PHASE6 prose tag, delete the dead 63-byte line, no action on the superseded §0.7.3-OLD reference.
- Verdict: _pending Opus verification_


### Slice: content-immersion (grade B+)

**[content-immersion-1] HIGH / confirmed — Player-facing rumor fiction renders raw engine tokens as the rumor's subject**
- Where: `src/domain/display/settlementRumors.js:127` | Category: immersion
- Evidence: settlementRumors.js:127 `const what = human(record.content?.what) || 'unrest'` feeds "Merchants bring word of ${what} in ${where}"; rumorNetwork.js:374 `what: String(entry.impactKind || entry.kind || 'stirring')`; applyWorldPulse.js:130 `impactKind: outcome.candidateType || outcome.type`.
- Why: The 3.5 rumor surface is the flagship DM-vs-player asymmetry feature and its own banner says 'fiction-not-internals' — yet the what-token is a raw candidateType, so a war declaration rumor reads "Merchants bring word of strategy deploy in Thornwall" and a stressor birth reads "...of stressor birth religious pact betrayal..."; entries whose impactKind is absent fall to the transition kind, yielding "Travellers speak of applied somewhere near X". human() only replaces underscores — 'npc', 'strategy deploy', engine compounds all reach player prose verbatim.
- Fix shape: Add a what-token → in-world phrase vocabulary in the display layer (the IMPACT_LABELS pattern, extended over the candidateType families: war/coup/faith/flow/institution/npc), with a humanized fallback that at minimum strips 'npc_'/'stressor_birth_' prefixes and never renders bare transition kinds ('queued'/'applied' → 'trouble'). Pure lazy-display change, byte-inert to the engine; pin with a register guard test like institutionVocabulary's (no engine token may appear in a rendered headline).
- Verdict: _pending Opus verification_

**[content-immersion-2] HIGH / confirmed — The crier voice sidecar proclaims plague arrivals as market-shortage trade news**
- Where: `src/domain/display/newsVoice.js:194` | Category: immersion
- Evidence: newsVoice.js:61 TRADE_CHANNEL_TYPES includes 'trade_route'; :193-195 falls back to channelType when impactKind ('plague_arrival') classifies nothing; pestilenceKernel.js:287 `channelType: 'trade_route'` with kind 'applied'.
- Why: M11a landed after Wave 1's war/faith/trade vocabulary froze. A plague-arrival entry's impactKind 'plague_arrival' matches no impact set, so the channelType fallback fires and categorizes it TRADE with bucket 'impact' — the WizardNewsPanel renders, directly beneath the headline "Plague reaches Millbrook" and a summary about sickness, an italic crier quote like "The shortage has bitten — the stalls stand half-empty and every coin buys less than it did." The card contradicts itself on the most dramatic beat the sim now produces.
- Fix shape: Guard the fallback: exclude entries whose impactKind is set-but-unclassified from the channelType fallback (return null), or better, author a fourth 'pestilence' category (and a 'calamity' one — the Great Flood/Fire currently gets no crier line at all while a routine grain shortage gets poetry). Lazy display only; extend the newsVoice determinism/coverage tests.
- Verdict: _pending Opus verification_

**[content-immersion-3] MEDIUM / confirmed — Five of fifteen stressor types have no arrival vignette and no founding stress-note — the dossier opens on a 'normal day' during open revolt**
- Where: `src/generators/narrativeGenerator.js:192` | Category: sim-logic-gap
- Evidence: STRESS_DESCS (narrativeGenerator.js:192-293) and STRESS_NOTES (:561-582) both key exactly 10 types; STRESS_PRIORITY (stressPriority.js:10-26) lists 15 — insurgency, mass_migration, wartime, religious_conversion, slave_revolt are absent from both.
- Why: generateArrivalScene falls through to the generic route scene for the missing five, so a slave-revolt or wartime settlement's dossier opens with e.g. "${r}'s market day has the comfortable chaos of something that has worked out most of its problems" — while the pressure sentence immediately below announces conscription, revolt, or mass exodus. PRESSURE_SENTENCES and stressNarrative cover all 15, so the gap is only the arrival layer; but the arrival scene is the dossier's first paragraph, and the contradiction is exactly the kind genCoherence exists to prevent.
- Fix shape: Author 3-4 arrival vignettes + one STRESS_NOTES founding line for each of the five missing types (same register as the existing ten — sensory, gate-level observation). Generation-side content additions change same-seed prose for affected settlements, so land under the owner golden-regen batch (Wave 5 piggyback) or verify the templates only fire for stress states absent from goldens.
- Verdict: _pending Opus verification_

**[content-immersion-4] MEDIUM / confirmed — namingData pools are contaminated: modern, cross-culture, and wrong-category names reach generated NPCs and settlements**
- Where: `src/data/namingData.js:2521` | Category: immersion
- Evidence: east_asian settlementSuffixes includes 'burg' (:2348) and femaleNames includes 'Kayla' (:2521); maleNames :2462-2469 list Japanese SURNAMES (Sato, Tanaka, Nakamura…) as given names; mesoamerican femaleNames include 'Gemini' (:2878), 'Pleiades' (:2887), 'Zero' (:2896), 'Venus' (:2867); surnames include Spanish colonial 'Valladolid' (:2962), 'Quijada' (:2957), 'Yucatan' (:2964); the goddess 'Ixchel' sits in maleNames (:2762).
- Why: Names are the most-read content in any dossier and the tables are consumed raw (npcGenerator pickFirst: `${firstName} ${surname}`; generateSettlementName concatenates prefix+suffix), so the engine can mint 'Zero Valladolid', 'Gemini Yucatan', 'Tanaka Watanabe', and the town 'Jinburg' in an East Asian region — visible register breaks that undercut the 'coherent because it has to be' thesis. The file header says 'extracted from bundle / de-minified', i.e. legacy data that never got the register pass the display sidecars got.
- Fix shape: A data-hygiene sweep of NAMING_DATA: remove/replace the ~20 contaminated entries (modern names, surname-in-givenname, Greek/Latin constellation words, colonial-era surnames, cross-gender deities, the 'burg' suffix). Pure data edit but generation-facing: same-seed NPC names shift for affected cultures ⇒ batch with the owner-gated golden regen (round-21 Wave 5 already collects such shifts).
- Verdict: _pending Opus verification_

**[content-immersion-5] MEDIUM / confirmed — wizardNews card body is system-log register: 'Queued via trade dependency around Grain: …' plus scoring-receipt reason pills**
- Where: `src/domain/region/wizardNews.js:409` | Category: immersion
- Evidence: wizardNews.js:409 `const prefix = \`${transitionLabel(transition)} via ${channelType}\``; TRANSITION_LABELS (:159-166) maps engine states verbatim ('Queued', 'Ready', 'Applied'); scoreImpact reasons (:288-334) are 'high severity', 'critical impact type', 'chain propagation' — rendered by WizardNewsPanel.jsx:182.
- Why: The same card now carries three registers at war: a diegetic headline ('Import shortage takes hold in Thornwall'), a system-log summary ('Applied via trade dependency around Grain after guild collapse: …'), analytic reason pills ('critical regional channel'), and a fully in-world crier quote. The seam is visible on every feed entry and reads as debug output where the product thesis promises chronicle. The engine-state words 'Queued'/'Ready' are the worst offenders — pure internal lifecycle vocabulary.
- Fix shape: Keep the summary's structure but swap the vocabulary at the display seam: transition → in-world phrasing ('Word arrives of…', 'Now felt in…', 'Has run its course'), reasons → the fiction-not-internals treatment simulationProfile.js:259 already established for receipt headlines. Note entries persist their summary strings, so either regenerate at display time (a lazy read-model over the stored structured fields — the settlementRumors renderFiction pattern) or accept old entries keeping the old prose.
- Verdict: _pending Opus verification_

**[content-immersion-6] MEDIUM / confirmed — A plague taking hold can never be MAJOR news (and mints a nonexistent 'minor' tier) while routine trade cascades rank MAJOR**
- Where: `src/domain/worldPulse/pestilenceKernel.js:281` | Category: sim-logic-gap
- Evidence: pestilenceKernel.js:281 `significance: severity >= 0.55 ? 'notable' : 'minor'` — WIZARD_NEWS_SIGNIFICANCE has only major/notable and normalizeEntry coerces anything ≠'major' to notable (wizardNews.js:441-443); meanwhile scoreImpact promotes any waveDepth>0 trade impact with severity ≥0.4 to major (wizardNews.js:351).
- Why: Threads sort significance-first (deriveNewsThreads :731-735), so a pestilence front ripping through the realm always sorts beneath every major trade-cascade thread and never enters summarizeWizardNews's `major` list. Dramatic weight is inverted: the sim's scariest emergent event is filed under routine notices. The 'minor' literal is also dead vocabulary — it silently becomes 'notable', so the intended three-tier distinction never existed.
- Fix shape: Score plague arrivals with the same significance grammar the rest of the feed uses (severity ≥0.55 or a multi-settlement front ⇒ 'major'; drop the dead 'minor'). Display/feed-layer only — entry generation is marker-gated so aspatial goldens are untouched; re-check the feedDistribution baseline.
- Verdict: _pending Opus verification_

**[content-immersion-7] LOW / confirmed — Calamity strike news withholds its best facts: fallen institutions unnamed, 'about 0 dead' possible, internal design vocabulary in the reasons line**
- Where: `src/domain/worldPulse/calamityKernel.js:566` | Category: immersion
- Evidence: calamityKernel.js:566 `${k} institutions lie in ruin, about ${loss.deaths} dead` (targets[] with the actual names is in scope at the call site :474 but unused); :575 `reasons: ['The ${typeLabel} was the land's own — a legible destiny come due.']` — 'legible destiny' is the design doc's term (calamity.js:80).
- Why: The stamp headline ('The Great Flood of Thornwood, year 12') is exactly the chronicle voice the owner wants, but the body flattens to a count — 'The Great Fire… the granary and the Gilded Stag lie in ruin' is the difference between chronicle and telemetry, and the names are already computed. For a thorp (pop 20-80) floor(pop×deathFrac) is frequently 0 ⇒ 'about 0 dead, and many more take to the roads'. The reasons pill leaks designer jargon into the DM-visible card.
- Fix shape: Interpolate up to ~3 target names into the summary (they are codepoint-sorted already); special-case deaths===0 ('the town counts its losses in walls, not graves'); rewrite the reasons line without the internal term. News-string only; the strike entry is calamity-flag-gated so goldens are unaffected.
- Verdict: _pending Opus verification_

**[content-immersion-8] LOW / confirmed — Nit batch: register slips and inconsistencies across otherwise-strong content**
- Where: `src/data/npcData.js:681` | Category: immersion
- Evidence: npcData.js:681 'left a local merchant hospitalised'; :946 'quietly shorting investments they publicly recommend'; :954 'paying a health official'; :1003 'a development site'; historyData.js:1253 'Civil libertarians'; institutionVocabulary.js mixes 'labour'/'fibre' (:65,:72,:106) with 'organized'/'specializing' (:61,:62,:86) in adjacent card copy; en.js:120 tier label 'Thorpe' vs 'thorp… metropolis' elsewhere (hero.capUnlock, anonCap).
- Why: Each is small, but they sit in the most-read DM surfaces (NPC secrets, institution cards, the size picker) and cut against the otherwise carefully test-guarded house register (institutionVocabulary's own test bans em-dashes and enforces terminal periods but not spelling dialect; 'shorting investments'/'health official' are modern-finance/civil-service anachronisms in a medieval-register table).
- Fix shape: One copy-pass commit: medievalize the four npcData/historyData phrases ('left a merchant half-dead', 'betting against the ventures they praise', 'paying a guild inspector', 'a district not yet announced'); pick one spelling dialect for institutionVocabulary and extend its register test; unify Thorp/Thorpe. npcData edits are generation-facing (same-seed secrets shift) ⇒ ride the owner golden-regen batch; the display/copy edits are byte-inert.
- Verdict: _pending Opus verification_


### Slice: build-tooling-docs (grade A-)

**[build-tooling-docs-1] HIGH / confirmed — STATE LEDGER contradicts git truth: M11b is committed at 62c81a0c but the playbook still says it is uncommitted foreign WIP; M11a/M11b have no §0.0.1 ledger rows**
- Where: `docs/PHASE55_EXECUTION_PLAYBOOK.md:414` | Category: docs-drift
- Evidence: "⚠️ src/domain/spatial/calamity.js is that session's UNCOMMITTED WIP (M11b) in the main worktree — FOREIGN, do not touch." — but `git show 62c81a0c` commits calamity.js + calamityKernel.js + pulseKernel.js + 2 test files (1,477 insertions), and 62c81a0c touched ZERO docs. §0.0.1's last row is M10b.
- Why: The playbook §0.0 is BY LAW the successor AI's memory (§0.3-7: "A wave is not 'done' until its ledger row exists"). A successor following §0.8 verbatim would treat committed, gate-relevant M11b code as foreign/unreviewed — skipping it in review programs, avoiding its files, or re-dispatching M11b. The same drift lives in docs/PHASE55_ROUND21_BACKLOG_PLAN.md:74 ("BLOCKED on M11b calamity (the last mover, UNBUILT)") and :196 ("M11 (last mover) and M10b remain unbuilt"), and the round-21 Progress blockquote — which claims it "alone must reconstruct program state" — never records M11a (82ad676b) or M11a-FIX (10f22f39) shipping.
- Fix shape: One ledger-repair commit: append §0.0.1 rows for M11a (82ad676b + 10f22f39) and M11b (62c81a0c) with gate numbers; rewrite §0.8 item 7 and the §0.0.3 merge note to 'M11 COMPLETE'; update the round-21 plan's Progress blockquote and BLOCKED list (ruins-as-artifacts is now unblocked). Consider a freshness test in tests/docs/ that greps the ledger for the HEAD commit's wave marker — the same structural-prevention pattern the repo already uses for ARCHITECTURE.md pipeline order.
- Verdict: _pending Opus verification_

**[build-tooling-docs-2] MEDIUM / confirmed — Playbook §0.0.2 BUDGETS bullet states a stale 'CURRENT closure' that its own later rows contradict**
- Where: `docs/PHASE55_EXECUTION_PLAYBOOK.md:73` | Category: docs-drift
- Evidence: "CURRENT closure 1,255,965 = 20B margin (post-M10a; MEASURED 2026-07-13)" — while the M10b row (line 68) and §0.8 (line 409) state closure 1,254,893 / margin 1,092 after FP-2a (−2,448) + M10b (+1,376). Line 76 also still shouts "⚠️ HEADROOM CRITICAL as of 3.5: only **63 BYTES** free" with no superseded marker.
- Why: §0.0.2 is the first budget surface a successor reads; three different 'current' numbers coexist in one document. Budget decisions in this program are made at ±20-byte granularity, so a stale headroom figure directly mis-sizes the next wave's go/no-go (e.g. wrongly blocking a +300B lazy-display wave, or re-triggering an FP-2 escalation that is already funded).
- Fix shape: Make §0.0.2 BUDGETS state only the invariant (budget const location + 'never raise') plus a pointer to the newest ledger row for the measured closure; mark the 3.5-era HEADROOM CRITICAL note as historical. Ride the same ledger-repair commit as the M11 rows.
- Verdict: _pending Opus verification_

**[build-tooling-docs-3] MEDIUM / confirmed — check-domain-strict.mjs passes green when tsc fails to run at all (vacuous-pass hole in an otherwise anti-vacuity-hardened gate)**
- Where: `scripts/check-domain-strict.mjs:31` | Category: gate-vacuity
- Evidence: try { out = execSync('npx tsc --noEmit -p tsconfig.domain-strict.json', ...) } catch (e) { out = `${e.stdout||''}${e.stderr||''}`; } — then counts only lines matching /^(src\/domain\/...): error TS/. Executed control: `npx tsc -p tsconfig.nonexistent.json` emits only "error TS5058: The specified path does not exist" — zero matches → total 0 → '✓ no strict-type regressions' → exit 0.
- Why: A renamed/deleted tsconfig.domain-strict.json, a broken typescript install, or an OOM-killed tsc all read as 'zero strict errors' and keep `npm run check` and CI green — the exact green-on-nothing failure class this repo's own doctrine (VERIFY_DIST hard-fail, e2e anti-vacuity guards, the weekly mutation sweep) exists to kill. The mutation sweep plants source regressions but never exercises a broken-toolchain run, so nothing would ever catch this.
- Fix shape: Distinguish 'ran clean' from 'did not run': capture the exec error, and fail loudly when tsc exited non-zero AND zero `src/domain/...: error TS` lines were parsed AND the output contains any `error TS` diagnostic without a domain-file prefix (config/module-resolution failures). One sentinel assertion, ~6 lines; add a mutation-sweep case that renames the tsconfig to prove it.
- Verdict: _pending Opus verification_

**[build-tooling-docs-4] MEDIUM / confirmed — sf-bridge.js — 1,205 lines of first-party bridge logic including the Phase 5.5 spatial-capture seam — is outside every gate except an acorn parse**
- Where: `public/map/sf-bridge.js:863` | Category: test-coverage
- Evidence: eslint.config.js:40 ignores 'public/**'; scripts/validate-map-fork.mjs only `parse(source, ...)` (syntax); the getSpatialPack handler ('settlementEngine:getSpatialPack', sf-bridge.js:863) hand-copies pack arrays (`plain(cells.h)`, `cells.p.map(...)`) that the parent freezes into the constitutional spatial digest.
- Why: The parent side (src/lib/mapBridge.js) has contract/smoke tests, but the iframe side that actually produces the capture bytes has zero behavioral coverage and zero lint. A silent regression here (aliasing live pack state, dropping a field, TypedArray leaking through) corrupts digests at canonize time — freeze-first makes the corruption PERMANENT in the campaign. fmg-fork.md's upgrade runbook rests entirely on 'reapply sf-bridge.js as-is', so nothing re-verifies it after an FMG bump either.
- Fix shape: Extract the pure helpers (burgToMsg, parseTransformAttr, the getSpatialPack copy logic, resolveParentOrigin) into a module both sf-bridge.js and a vitest file can load (or eval the IIFE in jsdom with stubbed FMG globals) and pin: copy-not-alias, field set {h,biome,r,p,c}, TypedArray→plain conversion, origin fail-closed. Add an eslint override block for public/map/sf-bridge.js (it is first-party code, not vendored FMG).
- Verdict: _pending Opus verification_

**[build-tooling-docs-5] MEDIUM / confirmed — fmg-fork.md upgrade runbook omits the third (and largest) script the map page loads — /map/index-Bp79q281.js**
- Where: `docs/fmg-fork.md:61` | Category: docs-drift
- Evidence: Quick-reference: "index.html ← Loads main.js then sf-bridge.js (both defer)" — but public/map/index.html:169 loads `<script type="module" crossorigin src="/map/index-Bp79q281.js">` (672 KB built FMG bundle) before both, and the runbook's cachebuster step 6 lists only main.js/sf-bridge.js `?v=` suffixes.
- Why: The runbook exists precisely so an FMG upgrade can be executed cold without losing integration. Following it literally leaves the hash-named 672 KB bundle stale or orphaned (a new FMG release emits a different hash), which is the highest-risk artifact in the fork — and the doc's '4 scattered patches' inventory is silent about how that bundle is produced or refreshed.
- Fix shape: Add the built bundle to the architecture section and upgrade steps (where it comes from, how the hash-named file + the index.html:169 reference are replaced together), and note versioning.js/sw.js. Update the '~1,136 lines' sf-bridge figure (now 1,205).
- Verdict: _pending Opus verification_

**[build-tooling-docs-6] MEDIUM / confirmed — ARCHITECTURE.md's 'The gate' section describes half the actual gate**
- Where: `ARCHITECTURE.md:202` | Category: docs-drift
- Evidence: "`npm run check` = `validate:data && typecheck && lint && test && build`." — package.json:33 actually chains validate:data && validate:migration-head && validate:edge && validate:map && typecheck && typecheck:domain:strict && lint && test && build && verify:dist.
- Why: This file self-describes as the map 'for anyone picking this up cold' and exists to lower the bus-factor-one cost. It omits the constitutional first-paint ratchet (verify:dist), the domain-strict ratchet, and three validators — a second contributor would under-trust the gate and might hand-run redundant checks or, worse, assume verify:dist is CI-only. Same stale step list in .husky/pre-push's comment; ARCHITECTURE.md:237 also still says main.js is "outside all gates" (validate:map now parses it), and tsconfig.json's header claims the full gate covers "components" while tsconfig.full.json deliberately excludes JSX.
- Fix shape: Regenerate the gate paragraph from package.json (or derive it, the architectureFreshness.test.js pattern already used for the pipeline order two sections up); fix the pre-push comment and the tsconfig.json header in the same pass.
- Verdict: _pending Opus verification_

**[build-tooling-docs-7] LOW / confirmed — Chunk-graph derivations in vite.config.js parse imports with regexes that see commented-out and trailing-comment 'imports'**
- Where: `vite.config.js:119` | Category: build-robustness
- Evidence: importsOf strips only whole-line comments — .replace(/^\s*\/\/.*$/gm, '') — so `const x = 1; // import { Y } from './heavy.js'` still matches the edge regex; computeLucideIconSplit's iconsOf (line 197) strips no comments at all, so a commented-out lucide import still classifies the icon.
- Why: The failure direction is the documented-safe one (phantom edges over-classify modules/icons/tables as EAGER), but that direction is only 'harmless' for correctness — a phantom eager edge silently pins bytes into first paint that the split machinery exists to move out, consuming ratchet headroom invisibly in a program that adjudicates 20-byte margins. Nobody notices bytes that should have left.
- Fix shape: Reuse one comment-stripper across all three derivations and extend it to trailing `//` comments outside string literals (or switch importsOf to es-module-lexer, already cheap at config-eval time). Keep the documented misclassify-eager bias as the failure direction.
- Verdict: _pending Opus verification_

**[build-tooling-docs-8] LOW / probable — Deploy-gate check-run dedup lets a stale green mask a newer red when the same-named check reports from two check suites on one SHA**
- Where: `scripts/vercel-ignore-build.mjs:205` | Category: gate-nit
- Evidence: else if (existing.conclusion !== 'success' && r.conclusion === 'success') byName.set(r.name, r); — any success wins over any failure regardless of recency. `filter=latest` (line 283) dedupes within a check suite only; a push-event suite and a pull_request-event suite on the same head commit each report a 'Validate, test, build' run.
- Why: If one suite is green (e.g. cached/earlier) and the sibling suite red on the identical SHA, the gate proceeds. Both suites run identical steps so a split verdict almost always means flake, and the CI-native deploy job's needs: edge is the second lock — but the rule as written is one-directional ('success wins') where the comment only promises the green-after-rerun case.
- Fix shape: Prefer the newest run per name (list is newest-first, so first-seen wins) and drop the success-override, relying on filter=latest for the rerun case; or keep success-preference but only among runs from the same check suite id.
- Verdict: _pending Opus verification_

**[build-tooling-docs-9] LOW / confirmed — main.js drop handler ships verbose debug console.log of placement payloads in production**
- Where: `public/map/main.js:605` | Category: polish
- Evidence: console.log('[sfBridge] drop types:', _types); ... console.log('[sfBridge] sf drop payload:', sfPayload); ... console.log('[sfBridge] posting to parent:', msg);
- Why: Five debug logs fire on every settlement drag-drop in prod, printing settlement id/name/coords to the console — noise that also undermines the otherwise careful F6 hygiene story around this exact handler, and it is one of the four documented inline patches an upgrade re-applies verbatim.
- Fix shape: Gate them behind the fork's existing DEBUG flag (main.js:7) or delete; update the fmg-fork.md patch table if the patch shape changes.
- Verdict: _pending Opus verification_

**[build-tooling-docs-10] LOW / confirmed — Nit batch: small stale headers, bypassable lint precision, and coverage gaps at the edges of the gate**
- Where: `scripts/eslint-plugin-visual-budget.js:4` | Category: nit-batch
- Evidence: Header: "Three rules, all warnings (not errors ...)" — eslint.config.js:122-124 sets all three to 'error'. (Representative quote; each nit cites its own file below.)
- Why: Individually trivial; batched per instructions: (1) visual-budget plugin header says rules are warnings — they are errors. (2) scripts/fix-duplicate-keys.js:9 header says casing collisions are "NOT auto-fixed" but line 82 pushes them into removals — a re-run would drop later-cased keys on the exact-lookup path. (3) scripts/generate-sitemap.mjs:148 uses the naive `import.meta.url === \`file://${argv[1]}\`` CLI check that check-e2e-not-vacuous.mjs:139 explicitly fixed (silent no-op under symlink/spaces). (4) analytics lint rules are bypassable via `import * as A from '.../analytics'` → A.track('raw') and via string concat — runtime whitelist mitigates. (5) deno.json disables deno lint/fmt entirely and test:edge runs --no-check, so edge functions have no linter/typechecker (transpile-parse + Deno execution tests only). (6) api/ (3 Vercel functions) is outside both `eslint src/ tests/ scripts/` and tsconfig.full.json includes — covered only by dedicated vitest tests. (7) sf-bridge.js:1184 readyPoll setInterval never clears if FMG generation permanently fails (500ms poll forever). (8) .npmrc legacy-peer-deps=true hides peer conflicts. (9) scripts/verify-email-setup.sh:39 hardcodes the prod Supabase project ref as a fallback.
- Fix shape: One hygiene pass: fix the two stale headers, unify the CLI-detection idiom, add api/ to the lint glob, and either lint public/map/sf-bridge.js via override (see the dedicated sf-bridge finding) or document the exemption. Items 4/5/6 are acceptable as documented residuals if noted in ARCHITECTURE.md's gotchas.
- Verdict: _pending Opus verification_


ROUND-2 FINDINGS: 71
