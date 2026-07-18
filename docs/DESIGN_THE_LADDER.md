# DESIGN — THE LADDER (intra-faction rank dynamics)
## Fable 5 architecture, 2026-07-17 — owner-commissioned ("build it… cohesive completely with the NPC's entire description and the settlement's entire state and shape — alignment, patron deity, etc."). ENGINE LIFT #3, owner-sanctioned. Builds DORMANT behind virtual `npcLadderEnabled`; lights at THE ONE REGEN (joins the list; vetoable).

## 0. One sentence
Every faction carries a persistent, contested rank ladder; NPCs rise ONLY by displacing
the rung above and fall when displaced — the missing middle rung between person-change
(the growth layer) and regime-change (coups), converting the roster from a cast into a
court.

## 1. THE CONSERVATION LAW (the owner's peon rule)
Ranks are neither created nor destroyed: promotion is DISPLACEMENT — the winner and
loser swap rungs; a peon reaches the high seat only by winning successive challenges.
No title inflation; every promotion is a story with a named loser (anti-numeric
consequence: "Maera took the second seat from Aldric"). Ladder length derives from the
institution's tier and the faction's institutional base (3–5 rungs; thorp factions may
be a single seat). Seats are SEAT-HELD-GLUE objects (the politics typology): the seat's
obligations/ties persist across holders; the person's people-held ties travel with the
person — post-usurpation drama by construction.

## 2. THE CHALLENGE MODEL
- **WINDOWS, not always-on** (the demotion-asymmetry law): a challenge may only open on
  a window — the incumbent's goal-failure record crossing a band · the faction's power
  trajectory FALLING (the owner's structural-change signal) · revealed corruption on the
  incumbent (the widest window) · faith-coherence rupture (§4b) · vacancy (death/STASIS
  → an open succession contest among adjacent rungs, the one non-displacement path).
- **DEFENDER'S ADVANTAGE is structural**: the seat defends its holder (seat weight
  scales with rung height + faction power RISING); incumbency bonus decays only under
  windows. Pushing down is harder than climbing is ambitious — as the owner required.
- **THE STAKE**: a failed challenge drops the CHALLENGER one rung (or to the floor from
  rung 1) — ambition risks something real. Both outcomes receipt fully.
- **RESOLUTION**: deterministic seeded contest — challengeScore vs defenseScore from the
  named inputs of §3, E0-classed rare-sticky events with hysteresis + a per-faction
  cooldown cap (the reframe-transition precedent); interval-invariant over elapsedWeeks;
  zero rng beyond the seed fork; the receipt enumerates every input's contribution
  (non-short-circuiting, the S7 evaluator idiom).

## 3. THE DETERMINANTS (the owner's three, made mechanical)
1. **Faction power trajectory** (exists: competition kernel + legitimacy multipliers):
   rising ⇒ defense bonus ("the current system works"); falling ⇒ windows open + a
   structural-change pressure that lowers EVERY incumbent's defense in that faction.
2. **DYNAMIC GOALS** (the crux; the reframe law applied to ambition — goals are DERIVED
   READS, never stored abstractions): goal = f(settlement's actual pressures × the
   NPC's lens), where the lens = position/rung, faction, personality + FLAWS, compromised
   status, power. Mechanism: **goal predicates REUSE the S7 signal registry +
   StopCondition evaluator** — a goal is a typed condition over registered signals
   ("restore food security above the band", "hold the tithe share while the cult
   rises"), auto-evolving as state evolves and REMINTING when rung/faction/state-band
   changes (goals evolve, as the owner required). Achievement/failure = an auditable
   per-NPC record (bounded window) feeding the scores. Flaws BIAS goal selection toward
   the flaw's shadow (a proud NPC picks prestige goals; a cruel one picks suppression
   goals) — individuality expressed exactly as the owner asked.
3. **Personality–institution alignment** (exists: the growth layer's 2-vector opposition
   metric): person-vs-institutional-character distance prices the clash — high clash
   erodes defense and sharpens rival challenges; high fit stabilizes.

## 4. THE COHERENCE MANDATE (the owner's "entire description, entire state")
a. **ALIGNMENT**: lawful challenges only through windows and pays legitimacy costs for
   norm-breaking; chaotic exploits any window at discount; good climbs on SERVICE
   (goal-achievement weight up), evil climbs on LEVERAGE (compromised-leverage weight
   up). Alignment distance to the FACTION's character joins the clash metric.
b. **PATRON DEITY** (the living pantheon composes): faith coherence with the
   institution's dominant faith is a standing input; a RELIGIOUS institution headed
   against its faith is a PERMANENT window (the high priest of a god he does not follow
   cannot rest); a devotee's deity RISING in the pantheon contest lifts their ladder
   standing in faith factions (a falling god drops its clients); deity conduct axes
   color methods (a war-god's devotee gains challenge weight in martial factions in
   wartime). Reads ride the existing deity/pantheon read models — pinned-not-imported
   where the aiGrounding trap applies.
c. **COMPROMISED** (corruption web): covert = leverage FOR the climber (evil-methods
   weight) and a time-bomb UNDER any holder (exposure ⇒ the widest window); conspiracies
   = covert blocs backing a challenger (exists).
d. **TRAITS + GROWTH** (growth layer): acquiredTraits weight the scores (tenacious aids
   challenge; cautious aids defense; cynical resists legitimacy costs); ladder outcomes
   DEPOSIT growth signals through the existing 8-signal map additively (the usurper
   trends proud; the deposed trends cynical) — never minting outside the mintable set.
e. **D5 MEMORY**: past challenge outcomes are remembered lifespan-scaled; a failed
   challenger carries the mark (repeat challenges against the same holder harden the
   defense — grudges are real but decay by species band).
f. **REFRAME**: ladder events emit acts in EXISTING act classes where they fit (an
   usurpation is reframe-eligible: liberation vs betrayal per observer) — no new act
   class minted without the matrix check.
g. **STATE, NEVER FATE**: the engine moves RANKS only. The fallen remain full citizens
   (participation, STASIS, reassignment intact); no engine-authored death/exile from a
   ladder event; the DM owns what the deposed does next.
h. **CHRONICLE + PROVENANCE**: every rise/fall/failed challenge is a narratable
   `npc_ladder` beat (unvoiced crier-wise, the urban_fabric precedent) with the full
   reason receipt; same-advance provenance edges where co-minted (the refutation's
   scoping law honored — no cross-advance edge claims).
i. **SPATIAL (light)**: where the substrate exists, the contested institution's district
   context may color beats (named quarter) — WHERE-not-WHO; no score input from
   geometry in v1.

## 5. Dormancy, storage, determinism (constitutional)
Virtual `npcLadderEnabled`, absent from DEFAULT_SIMULATION_RULES; dark ⇒ byte-identical
with a COMMITTED dormancy golden (mandatory, the fabric/spatial precedent). Storage =
the sidecar idiom: `spatialLedgers.npcLadder` (per-faction rung arrays + per-NPC
achievement windows + challenge cooldowns; compact, prose-free, drop-when-empty) + the
compact settlement mirror (the acquiredTraits idiom — defeats the ghost-write class).
Initial ladders derive at first-lit generation from the existing structural-position
indicators (dominant/subordinate) — deterministic, no stored migration. Kernel = a lazy
leaf mover joining the fabric→growth→consequence chain via the established name-swap
seam (pulseKernel net-zero; ceiling 1387 honored). No migrations. Interval-invariant;
no wall-clock; goal predicates and contests draw ONLY from the seed fork + registered
signals.

## 6. Consumers (v1)
The chronicle (beats + receipts) · the dossier Power tab reads the ladder when lit (a
read API `ladderRead.js`, empty-when-dark, null ≠ neutral — the fabricRead contract) ·
the NPC card shows rung + current goal (display stock; may land at ROUND 3) · S7
signals: the registry gains ladder-derived signals ONLY as tuning-window data mints
(none in v1 — the additive lane exists).

## 7. Coherence matrix (compact; the standing practice)
factionCompetition (power trajectory read, no writes) · settlementPolitics blocs
(conspiracy backing; bloc glue typology LOAD-BEARING for seats) · coups (the
faction-scale sibling: a coup REPLACES the top rung wholesale — the ladder defers to
coup outcomes, never contradicts them; a coup receipt truncates pending challenges) ·
deity/pantheon (§4b reads) · corruption web (§4c; the leash dials bound leverage) ·
growth layer (§4d both directions) · D5 (§4e) · reframe (§4f, existing classes only) ·
E0 governor (contest events are E0-classed; the cacophony soak guard applies) ·
provenance (same-advance edges only) · S7 (the evaluator/registry REUSED read-only;
no autonomy coupling — StopConditions may reference ladder signals only when the
tuning window mints them) · goldens (dark byte-identical; lit shifts ride THE ONE
REGEN) · first-paint (engine lazy leaf; ~0 eager) · state-never-fate + DM sovereignty
(§4g, the constitution's spine).

## 8. THE STANDING LOOP (owner refinement, 2026-07-17: ladder→faction feedback)
The circuit closes both ways. (a) **LEADERSHIP QUALITY**: the rung-holders' aggregate
standing (stakes-weighted achievement record + alignment fit − clash) deposits a bounded
modifier the faction's EFFECTIVE-power read consumes — achievers lift their faction
above its institutional base; failures sink it. (b) **CHURN IS PRICED**: every contested
challenge deposits transition instability — a decaying tax (fabric half-life idiom) on
faction power + legitimacy; replacement = new quality bought at turmoil's price.
(c) **LEGITIMACY READS THE HOW**: window-legitimate successions cost little (renewal);
norm-breaking/leverage usurpations tax faction legitimacy — and PUBLIC legitimacy via
the governance ledger when the governing faction is the stage. (d) **ENTRENCHMENT**: a
long-winning defender deposits toward entrenched/rigid traits, which RAISES their clash
score as the settlement drifts — success plants the fall; dynasties rot mechanically,
no scripted arc. SINGLE-WRITER LAW: the ladder kernel writes ONLY its sidecar; power/
legitimacy reads consume the modifiers when lit (absent ⇒ 1.0 ⇒ byte-identical dark).

## 9. WEIGHTED DEEDS (owner refinement: goals are not equal)
Every goal carries a **STAKES value priced at mint, settled at outcome**: state-distance
(famine→secure ≫ half-band nudge) × signal scope (settlement-wide ≫ one institution) ×
adversity context (war/crisis multiplies) × faction-domain relevance. The challenge
receipt cites both sides' stakes-weighted records — **the challenger who did the greater
deed beats the defender who held the smaller one, even when both succeeded** (the
owner's rule verbatim). FLAWS = RISK APPETITE: proud/bold select high-stakes goals
(fast climbs, hard falls); cautious grind small reliable deeds — one great gamble can
overtake a steady tenure, and a failed gamble drops the gambler hard. Failure mirrors
magnitude (+growth deposits toward cynicism/humility). ANTI-FARMING: stakes derive from
real state distance; the achievement window averages by WEIGHT, never count. PERSONAL
GROWTH AS EVIDENCE: deed-acquired traits (provenance-carrying) add a growth term to the
climber's score. Matrix additions: faction power read (+ladder modifier consumption,
read-only from the mirror) · public legitimacy read (+governance-ledger deposits on
norm-breaking governing successions) · growth layer (+entrenchment pathway through the
existing deposit map; no new mintable traits without the matrix check).

## 10. THE STIGMA MARK (owner refinement, 2026-07-17: exposure taxes ambition)
An NPC EXPOSED for corruption (covert → revealed) carries a stigma mark: **challengeScore
×0.5 for a long, lifespan-scaled duration** (the D5 band idiom — years for humans, longer
for the long-lived; decaying, receipted, narratable). The symmetry completes: exposure is
the widest WINDOW against a defender AND a halving TAX on a climber — crime's cost cuts
both ways; the evil/leverage path still exists but a caught schemer climbs at half
strength for years. A second exposure refreshes and extends the mark. The mark lives in
the ladder sidecar (single-writer), joins the challenge receipt by name, and deposits
toward cynical through the existing map. Pin: the exposed-climber-halved fixture +
lifespan-scaled decay + refresh-on-reexposure.
