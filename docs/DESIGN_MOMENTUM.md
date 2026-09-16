# DESIGN — W-MOMENTUM: BELIEF & DECISION MOMENTUM (the psychology of being seen)
## Fable 5 architecture, 2026-07-15 — owner-commissioned (the war-despite-the-drawbacks scenario) with four rulings, verbatim intent: momentum for "all entities that use beliefs to make decisions"; at the NPC level "this threshold has to correlate with temperment and flaws appropriately"; THE LIMIT CLAUSE ("not that they continue with certainty, but the cliff to redirect decisions becomes an order of magnitude harder"); and coherence — "make sure that the momentum is coherent with everything else and that counterforces exist. chaos x lawful, good x evil play parts in all of this where appropriate." Grounded by the three-slice momentum recon (2026-07-15): the decision-seam census, the NPC temperament substrate, the commitment-state map.
### THE FINAL ENGINE WAVE. Builds after W-LIFECYCLE, before the W-COMPOSER-2 lift (FORCE_RECONSIDERATION joins the manifest).

## 0. THE RECON VERDICT (why this wave exists)
The strategy chooser is MEMORYLESS (re-enumerates and re-samples every tick; no sunk-cost or
commitment term anywhere in enumerateMoves) and every CHOSEN exit is FREE — recall is "a
CHOICE, not a defeat: NO disposition delta", de-mobilizing costs nothing, plan abandonment is
a news beat, sue_for_peace carries no charge. Only INVOLUNTARY exits are priced. The engine's
actors are more rational than people; the doomed war knowingly pursued cannot happen. This
wave adds the missing layer — and its counterweight set — without touching any resolver.

## 1. THE COMMITMENT LEDGER (new conditional ledger `spatialLedgers.commitments`)
Keyed `${actorId}>${courseKey}` over a BOUNDED course taxonomy (war:<target>, peace:<target>,
campaign:<target>, contest:<target+side>, blockade:<port> — typed, never freetext). Records
{ stock, sinceTick, lastDepositTick, deposits: capped typed list (the receipts) }. Fold
discipline copied VERBATIM from the credibility ledger: decay-all-to-now (half-life,
soak-tunable), fold id-sorted deterministic deposits, clamp, prune-below-epsilon,
drop-when-empty, serialize-compare, gate-dark ⇒ immediate no-op. DEPOSITS ARE READS, NOT
ROLLS: the legible public acts already in state deposit deterministically — declareCasus
decrees, mobilization rungs climbed (warPosture.sinceTick), campaign stages executed,
blockade/intervention orders, treaties signed, lies seeded in the course's service. LOUDNESS
IS THE MEASURE (the rumor machinery already knows what is public): covert acts deposit little;
inciting your own population deposits most — the owner's scenario, mechanical. Gate: virtual
`momentumEnabled` AND-ed with beliefsActive (the supplyWebWarfare gate idiom); absent ⇒ prior
bytes.

## 2. THE THRESHOLD (entity-appropriate, alignment-shaped, NPC-rooted)
Reconsideration pressure vs commitment stock, evaluated where courses are chosen:
**Below the cliff** — reconsideration is free physics (today's behavior, unchanged bytes).
**Past the cliff** — THE LIMIT CLAUSE, verbatim law: redirecting becomes ~an ORDER OF
MAGNITUDE harder (CLIFF_MULT ≈ 10, soak-tunable), NEVER certain. Weights, never walls: no
absorbing state, the crack reachable from everywhere.
The threshold derives (all existing reads, all bounded, all receipted):
- **The leader's temperament (the owner's NPC ruling):** a NEW frozen map TRAIT_MOMENTUM over
  the AUTHORED personality vocabulary (the npcTraitWeights idiom exactly: lowercase
  descriptor → signed |w| ≤ 1, absent ⇒ exactly 0): proud/arrogant/stubborn/tenacious/
  zealous/wrathful/vengeful/obsessive raise; humble/patient/pragmatic/level-headed/
  opportunistic/diplomatic lower; cautious lowers commitment ENTRY but not exit. Aggregated
  importance × governing-power (the personalityDrive shape, GOVERNING_UPWEIGHT honored) ⇒
  the crown's cliff IS the court's character. Personality-less structural NPCs and the
  trait-free 10% anchor NEUTRAL (the absent-⇒-0 law). Facet law: a new `npcTemperament`
  facetOf kind — declared facets on custom NPCs COUNT, inference falls back to the authored
  traits (byte-identical degradation).
- **LAWFUL × CHAOS (owner ruling, via the existing computeLawfulness):** lawfulness scales
  DEPOSITS — formal public acts bind a lawful court hard (oaths mean things) and a chaotic
  one loosely (its public expects caprice; reversal is cheap because nothing was ever quite
  promised). The compensation: lawful courts get the PROCEDURAL CRACK — reconsideration
  through legitimate process (council, mediation, a treaty's own terms) pays a reduced
  climb-down price; chaotic reversals are cheap but erratic (the §H loading widens their
  choice distribution — variance through weights, never a new draw).
- **GOOD × EVIL (owner ruling, via the existing computeMalice/conscience):** the
  counter-evidence discount is EVIDENCE-CLASS-AWARE. A good court's cliff is porous to
  humanitarian evidence — atrocity receipts, civilian cost, its own people's suffering cut
  through the discount at near-full weight (the conscience hears the dead). An evil court
  discounts moral pressure hardest and hears only power — lost battles, broken supply,
  counter-coalitions count in full; dead villages do not. Same cliff height, different
  doors through it.
- **Legitimacy fragility** (governanceLedger read): a fragile seat doubles down hardest — it
  cannot afford to look weak; a secure one can spend legitimacy on a climb-down.
- **Court structure** (settlementPolitics): a consolidated autocratic court raises the cliff
  (no voices force the question); live opposition blocs lower it (the question keeps being
  asked).

## 3. CONSUMPTION SEAMS (each a bounded centered-on-1.0 factor; dormant ⇒ exactly ×1)
1. **The strategy chooser** (the ONE settlement decision chokepoint, beside warReasonFactor/
   blocDecisionFactor): a commitmentFactor weights course-consistent moves up and
   course-reversing moves down; past the cliff the reversal weight divides by CLIFF_MULT.
   The softmax still samples — folly is probable, never scripted.
2. **Belief updating** (reconcileBelief): a THIRD injected closure (the credibilityOf/
   sightFloor01 precedent exactly) — a bounded, COURSE-SCOPED motivated-reasoning discount
   on reports contradicting the observer's own committed course, keyed (observer, subject),
   null-when-dark ⇒ byte-identical. The recon's guarantees hold the limit clause
   structurally: the discount can only SLOW convergence, never invert it; re-anchoring
   toward truth and the contradiction-widens-uncertainty term run regardless — reality
   always eventually wins.
3. **Plan/doctrine courses**: supplyWebWarfare's ABANDON floors scale with commitment (a
   committed strangler holds a marginal campaign longer); the mobilization cool path and
   bloc reconsideration read the same factor.
4. **Blocs (the NPC grain aggregated)**: a bloc's course momentum derives from its members'
   TRAIT_MOMENTUM (importance-weighted, §G-clamped) — the proud captain holds his bloc past
   reason; the pragmatic chancellor's bloc reconsiders cheap. NPCs modulate; the engine
   still resolves no named fate.

## 4. THE COUNTERFORCES (owner ruling: they must exist — the full set, named)
(1) LOUD EVENTS AT FULL WEIGHT: battle outcomes, treaty defaults against the actor, a
cracked coalition, a fallen city — first-hand consequences are never discounted (the
discount applies to REPORTS about the course, not to the course's own receipted results).
(2) EXHAUSTION: war exhaustion accrues while waging (non-reverting scar) and feeds sentiment
against the course — staying bleeds; the bleed is the argument. (3) THE BLOCS: opposition
coalitions accumulate the counter-case; concession glue can be outbid; exposure detonates.
(4) SUCCESSION: the threshold's carrier is the leader — succession/coup/ousting REROLLS the
temperament (successorNpc re-rolls personality; the ledger's course survives but meets a new
cliff) — the new-ruler peace, emergent. (5) LEGITIMACY ECONOMICS: doubling down under a
souring course keeps paying warSentiment/coup pressure — the coup machinery is the ultimate
counterforce (the crown that cannot bend eventually breaks). (6) FACE-SAVING OFF-RAMPS
(recon-confirmed cheap exits): the white peace, non_aggression, mediation's 20% soften, and
a new symbolic `declared_resolution` seam-executor term — the climb-down price drops sharply
when the exit can be TOLD as a victory ("declared victory and went home", receipted).
(7) THE DM: FORCE_RECONSIDERATION (registrable shape; the voice of reason or the final push).
(8) THE LIMIT CLAUSE itself: CLIFF_MULT is finite, counter-pressure accumulates past the
cliff at discounted-not-zero weight, and the crack fires as a priced CONSEQUENCE event —
legitimacyDeltas hit + a new 'climb_down' credibility delta kind (the closed union extends)
— which rides E0-exempt (consequences are never censored).

## 5. COHERENCE POSTURE (owner ruling: coherent with everything else)
Dormancy: virtual flag; absent ledger + null closures ⇒ byte-identical (fenced dormancy
golden pre-wire; the injected-closure precedent guarantees the belief seam). Zero eager
(lazy leaf momentum.js; TRAIT_MOMENTUM placement follows the npcTraitWeights light-leaf
decision consciously). §H: every threshold input is a receipted weight; no new rng draws
(post-sum shifts and centered multipliers only — the stream-position law). §G: NPC
contributions clamped-aggregate, state-never-fate, receipts name the people ("the old king's
pride held the war two winters past its sense"). The alignmentAxes string/object mismatch
(settlementPolitics kinship, currently always-neutral) is documented ADJACENT, not silently
fixed (golden-sensitive; its own decision). Legibility: the commitment stock and its cliff
are dossier-readable (the war-faith tab: "the crown is committed beyond easy return"); the
chronicle narrates deposits, doubling-down, and the crack; the Blainey wars-end-slowly
behavior now has its named cause on display. Counterpart: FORCE_RECONSIDERATION, dial =
pressure magnitude, preview via the shared pipeline.

## 6. PINS (headline set)
Dormancy byte-identity (flag off ⇒ no ledger, ×1 factors, null closure — prior bytes);
below-cliff bytes UNCHANGED (an uncommitted actor behaves exactly as today); the cliff is
finite (a sufficiently loud accumulation cracks EVERY course — property test: no absorbing
state across the tuning range); first-hand results never discounted; the discount only slows
(convergence still monotone under sustained truth); temperament directionality (proud >
neutral > humble thresholds, receipted); lawful-deposits/chaotic-cheap-reversal asymmetry;
conscience doors (good cracks on atrocity evidence an evil twin ignores — paired-fixture
test); succession rerolls the cliff (the new-ruler peace fires in a fixture where the old
king's could not); climb-down is priced (legitimacy + credibility deltas land, once); the
face-saving exit reduces the price and the receipt says so; neutral anchors (trait-free NPCs
and structural leaders contribute exactly 0); no new rng draws (stream-position tripwires:
the M9d pins + strategy fork order); force ≡ organic for FORCE_RECONSIDERATION.

## 7. SEQUENCING
THE FINAL ENGINE WAVE: after W-LIFECYCLE, before W-COMPOSER-2 (the lift takes
FORCE_RECONSIDERATION with the rest). Soak owns the tuning (CLIFF_MULT, half-life, deposit
magnitudes, the trait map's weights) — the cliff's exact height is an empirical question
about drama, and the century probes will answer it.
