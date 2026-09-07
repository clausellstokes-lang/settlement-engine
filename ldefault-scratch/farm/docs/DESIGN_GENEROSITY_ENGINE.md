# DESIGN — THE GENEROSITY ENGINE (comprehensive; supersedes Part A of DESIGN_UPSWING_RELATIONSHIP_FLOWS.md)
## Fable 5 architecture, 2026-07-14 — owner-directed deepening: relationship+history gating, action⇒reaction symmetry, full-context risk assessment
### Part B of the earlier doc (reconstruction/boom/flourishing arcs) stands unchanged and composes with this.

## 0. The owner's three laws (binding on every mechanic below)
1. **Generosity is GATED by relationship AND history.** No bond, no history, no obligation ⇒ the
   question is never even asked (sparse by construction). Strangers do not get grain — with one
   principled exception (conscience, §2.1) that is itself an alignment identity, not a default.
2. **Every action has a reaction — equal and opposite where it must be.** Giving costs the giver
   at home and binds the receiver abroad; refusing wounds the refused and is REMEMBERED; even the
   act of giving broadcasts information that changes third parties' behavior. No free kindness.
3. **Every decision carries a RISK ASSESSMENT over the giver's full context** — reserves, season,
   commitments (a deployed army eats), routes, beliefs, domestic politics, and strategy. The
   canonical example: an ally starves, but you hold a deployed army and sit a razor above your own
   hunger line ⇒ you withhold — UNLESS a strategic read (their pass shields your flank; their ore
   feeds your smithy; their collapse feeds your enemy) flips the ledger.

## 1. THE ARCHITECTURAL INSIGHT: generosity is the mirror of greed
M6c already built the decision shape this engine needs: the dispatch EV (greed vs danger, belief-
mediated, hysteresis-braked, receipted). The generosity engine is its MIRROR — one pure kernel,
`generosityEV`, that weighs GIVE-side attraction against WITHHOLD-side risk, using the same
disciplines: the ONE W0 alignment read, belief-not-truth for anything remote, enter/exit
thresholds + dwell (aid never flip-flops), seeded tie-breaks, mandatory receipts. Greed and
generosity become two instances of one decision physics — which is both cheaper to build and
philosophically right for this engine.

## 2. THE DECISION KERNEL — `generosityEV({giver, receiver, ask, ctx})`
Evaluated ONLY for qualifying pairs (the §0.1 gate): relationship ∈ {ally, trade_partner⁺,
vassal/patron} above a bond floor, OR a live obligation record, OR the conscience exception.
Codepoint-sorted pair iteration; seeded fork `generosity:${giver}:${receiver}:${kind}:${tick}`.

### 2.1 GIVE-side terms (each bounded, named, documented, retunable)
- **BOND**: relationship kind × strength (the live edge the war layer reads — never a parallel
  derivation). Vassal/patron edges carry duty weightings (a lord SHOULD relieve his vassal;
  failing to is a legitimacy event in the vassal's eyes — §3.2).
- **HISTORY** (the reciprocity memory — the owner's directive): reads relationshipMemory,
  EXTENDED with typed incidents `relief_given / relief_received / relief_refused /
  credit_repaid / credit_defaulted / refuge_granted` (the existing incident machinery + decay —
  no new memory system). They-helped-us-once is a strong positive with SLOW decay ("the old debt
  from the flood-year"); they-refused-us weighs negative; betrayal (existing weighting) can zero
  the give-side outright. Cold pairs (no history) rely on bond alone at a discount.
- **CONSCIENCE** (W-C2, the ONE W0 read): lawfulness/goodness scales how much the receiver's raw
  NEED counts by itself. The conscience exception: a strongly good-aligned giver with a
  charity-capable roster (temple/almshouse — roster read, never a toggle) evaluates even
  non-bonded neighbors at small magnitude — charity as identity, capped, receipted as such.
- **STRATEGY** (the owner's example, made mechanical — three explicit reads):
  - *War-strategic*: does the receiver's survival serve the giver's security? Reads the war
    graph: shared enemy (their front shields mine), buffer-state geometry (their fall exposes my
    border — the digest's adjacency), coalition membership. This term can OVERRIDE a thin margin
    — feeding the pass-garrison ally IS defense spending, and the receipt says so.
  - *Capacity/supply*: is the receiver upstream of me? Reads M2/M6a supply links — if my smithy
    eats their iron, their famine is my shortage next season; relief is supply-chain risk
    mitigation, priced as such.
  - *Leverage/ambition*: generosity BINDS (§3.1 obligations). An ambitious or evil-leaning giver
    weighs the obligation asset itself — gives to indebt, prefers CREDIT over gift, favors
    desperate-but-solvent targets. Evil generosity is real generosity with a ledger behind it.
- **FAITH**: temple-mediated relief adds piety warmth + uses the M11a temple-relief seam; a
  shared faith between giver/receiver adds a modest term (cultureDistance's faith axis — already
  computed, no new derivation).

### 2.2 WITHHOLD-side terms (the risk assessment)
- **OWN-MARGIN, GRADED AND FORWARD-LOOKING**: not a binary floor — margin = granary trend vs
  SEASONAL OUTLOOK (giving in autumn before the hungry gap prices the winter, not the day;
  SEASONS-A's curve is the read) vs the hard GRANARY_RESERVE_FLOOR (never crossed — property
  test). Razor-thin ⇒ this term alone approaches prohibitive, exactly per the owner's example.
- **COMMITMENT LOAD**: deployed armies and mobilized postures multiply projected consumption
  (reads the existing deployments/mobilization/war_drain state). An army afield is a standing
  claim on the granary — the owner's example term, first-class.
- **ROUTE RISK, BELIEF-MEDIATED**: the relief travels real roads — M1 embattlement, banditry,
  gate seizure (grain seized at a hostile gate FEEDS THE ENEMY — priced as a hostile-supply
  transfer, not just a loss), plague route hazard. All read through the BELIEF map, never truth:
  a giver may wrongly withhold because a stale rumor says the pass is cut — and §3.3 makes the
  refused party's judgment of that refusal belief-mediated too.
- **DOMESTIC REACTION** (the equal-and-opposite core): shipping food out of an anxious town costs
  the ruler LEGITIMACY scaled by own scarcity band — wired into the EXISTING legitimacy→unrest→
  coup pressure lane. Generosity while comfortable is cheap; generosity while hungry is political
  courage with a political price. (Inversely, comfortable generosity earns a small "granary city"
  legitimacy/reputation lift — bounded.)
- **DEPENDENCY / MORAL HAZARD**: repeated relief to the same receiver decays the receiver's own
  granary discipline (bounded decay on their buffer target, recovers when aid stops) and raises
  the giver's exposure — the kernel discounts chronic asks ("the third famine in five years is a
  governance problem, not a harvest problem" — receipted).
- **PRECEDENT / TRIAGE**: multiple simultaneous claimants are scored by the same EV; helping A
  while refusing B writes B a slight (§3.3, at reduced weight when the giver's constraint is
  publicly believed). A lawful giver gains a fairness term toward splitting; a pragmatic one
  feeds the buffer state whole.

### 2.3 The output is TIERED, not binary
GIVE_FULL / GIVE_PARTIAL (the compromise the owner's example implies — "a tenth of what was
asked, with apologies": magnitude scales with margin) / GIVE_AS_CREDIT (§4) / REFUSE. Hysteresis:
enter/exit thresholds + dwell so a border-line pair doesn't oscillate weekly. EVERY outcome mints
a receipt narrating the ACTUAL deciding terms in the house voice — this is the DM-facing gold:
"Thornwall's granaries stayed shut: the army at the front eats first" /
"Grain went to Marchmont — the old debt from the flood-year, and their pass shields the valley."

## 3. THE REACTION LEDGER (law 2, both directions, all parties)
### 3.1 On giving
Receiver: gratitude (relationship deposit) + an OBLIGATION record (a small obligations sub-ledger
under spatialLedgers: {from,to,kind,magnitude,mintTick}, ≤1 active per pair per kind, decaying
slowly, consumed by repayment/aid-in-kind). **THE WIDOW'S MITE RULE: gratitude ∝ need-relieved ×
the GIVER'S margin-sacrifice** — a poor friend's small gift binds tighter than a rich state's
surplus dump (both margins are already computed; one multiplication buys deep human texture).
Receiver's ruler banks legitimacy (fed people); a PROUD receiver (martial/honor archetype via the
existing faction-archetype axes) banks a humiliation grain alongside gratitude — net still
positive under real desperation, but it fuels an "erase the debt" pressure (early repayment,
overpayment, or resentment if the giver lords it). Giver: the domestic term (§2.2) lands; stock
conservation exact; and — the double edge — **the deed BROADCASTS on the rumor network**:
neighbors update beliefs about the giver's wealth (raid attractiveness rises at the margins) and
character (alliance attractiveness rises) — generosity is information, and information has teeth.
Third parties: the giver's enemies read the aided pair as hardening (disposition nudge); rival
claimants bank slights per §2.2 triage.
### 3.2 On refusing
The refused party banks a REFUSAL memory scaled by their desperation AND by §3.3's justification.
A refused VASSAL additionally reads it as a legitimacy breach of the patron duty (feeds the
existing vassal-resentment/rebellion strain). Repeated refusals unwind alliances through the
existing relationship-evolution machinery — no new mechanism, just honest inputs.
### 3.3 FOG-MEDIATED FORGIVENESS (the signature mechanic)
The refused party's damage is weighted by what they BELIEVE about the giver's context — through
their belief map, not truth. If rumors have carried the giver's own hunger and deployed army, the
refusal is largely forgiven ("they had nothing to send"); if their information is stale or wrong
and they believe the giver sat fat behind full walls, the same refusal reads as betrayal — heavy
damage, pact strain. Moral judgment becomes an information problem: ANOTHER reason infowar
matters, and a mechanic no competing engine has. (Implementation: the refusal reaction reads the
refused party's belief entry about the giver's scarcity/military bands — both already modeled.)
### 3.4 On credit (deepened from the prior doc)
Maturity → repayment (gratitude + trust + the obligation clears) or default (grievance + the
casus-belli seam + the lender's appetite-to-lend decays via the merchantAppetite accumulator
pattern — hardened hearts, mechanically).

## 4. THE INSTRUMENT SET (what generosity can move)
GRAIN RELIEF (the flagship; rides supplyShipments kind:'relief', tolls apply, conservation exact,
aspatial fallback = bounded instant transfer) · PURCHASE (the market twin, unchanged from the
prior doc, shares the dispatch scorer) · CREDIT/INVESTMENT (§3.4; reconstruction accelerant per
Part B) · TRADE OVERTURE (subsidized channel, unchanged) · **REFUGE** (people, not goods: an
acceptance POSTURE that gates/weights M4's destination choice toward the accepting ally during
their calamity/war exodus — generosity in refuge form, with the domestic reaction already
modeled free by M4's congestion/crowding/crime brakes) · RANSOM/TRIBUTE-RELIEF (v2: paying an
ally's tribute to a coercer — three-party, design later).

## 5. EXTRAPOLATED SITUATIONS (the scenario matrix the kernel must satisfy — each becomes a pin)
1. **The owner's canonical case**: ally famine + giver's deployed army + razor margin ⇒ REFUSE …
   flipping to GIVE_PARTIAL when the war-strategic read finds the ally garrisons the pass that
   shields the giver's flank. Pin both halves.
2. **Rich neutral, poor stranger**: never evaluated (gate) — except the good-aligned temple city
   gives small, capped, receipted charity. Pin the gate AND the exception.
3. **Evil wealth, desperate neighbor**: GIVES — as leverage; prefers credit; obligation minted at
   predatory weight; the receipt's voice is acquisitive. Generosity as a weapon. Pin.
4. **Two claimants, one granary**: triage; lawful splits, pragmatic feeds the buffer state;
   the runner-up's slight is smaller when the constraint is publicly believed (fog-forgiveness
   applies to triage too). Pin.
5. **Plagued supplicant**: the relief EV prices caravan contraction (M11a couplings); the bold
   and the faithful send anyway — mercy's price is a possible plague at home; the cautious
   deliver reduced-effectiveness aid "left at the crossroads shrine". Pin the risk term.
6. **Relief to the besieged = side-taking**: a relief convoy into a siege runs blockade physics
   (M7 worst-gate law); seized grain supplies the besieger; the besieger banks hostility toward
   the giver — generosity ESCALATES wars when aimed into one. Pin the escalation reaction.
7. **The enemy's enemy starves**: no bond — but the strategic read (their collapse strengthens my
   enemy) can unlock pragmatic relief to a non-friend; the receipt is honest realpolitik. Pin.
8. **Autumn vs spring giving**: the same bushels cost more before the hungry gap — and bind more
   (the widow's-mite multiplication uses the seasonal margin). Pin the seasonal asymmetry.
9. **The proud recipient**: honor-culture receiver under true desperation nets gratitude; under
   mild need nets humiliation-dominant (may REFUSE the aid — a reception decision on the
   receiver's side, small, same kernel shape). Pin.
10. **Chronic dependence**: three reliefs in short order ⇒ the moral-hazard discount fires, the
    receipt changes register ("Thornwall's patience thins"), receiver's buffer discipline decays
    and then recovers when aid stops. Pin the decay bound + recovery.

## 6. CONSTITUTIONAL POSTURE (unchanged laws, restated for this engine)
Dormant behind `constructiveFlowsEnabled` (+ spatial marker for traveling flows; owner lights
presets); zero eager (lazy kernels; ledgers nested — obligations under spatialLedgers,
incidents inside relationshipMemory); byte-identical off (goldens prove); conservation exact
(gift/credit/purchase all balance to the integer); aggregate-only (refuge moves populations,
never named souls); receipts mandatory; every constant frozen, named, owner-retunable; seeded
forks on stable keys; codepoint-sorted; hysteresis everywhere a flip-flop is possible; the
significance gate keeps generosity RARE AND MEANINGFUL (envelope test: relief incidence stays in
a band across the 30y soak — this is a drama engine, not a welfare optimizer).

## 7. SOAKS + THE PROOF OF MEANING
Beyond per-pin batteries: the 30-year arc soak — war → famine → a relief decision under the
canonical tension → gratitude → obligation → and the PAYOFF: the aided ally's later behavior
measurably differs (shows up as reinforcement/relief through the EXISTING ally machinery reading
the obligation ledger; stands firmer in the coalition; forgives a future refusal). The engine's
success criterion is not that aid flows — it's that **aid changes history**, visibly, receipted,
within bounds.

## 8. BUILD ORDER (Opus waves, each fenced + gated, after the owed backlog)
E1a the kernel + grain relief + the full reaction ledger (§2+§3, scenarios 1-4,8,10) →
E1b credit maturity + purchase + appetite (§3.4, scenario 3) →
E1c refuge posture + siege/plague interactions (scenarios 5,6) + fog-forgiveness (§3.3) →
E1d Part B integration (reconstruction accelerant reads obligations; boom/flourishing unchanged) →
v2 parked: ransom/tribute-relief, mis-aimed-aid comedy seam, almshouse founding lane, pride-refusal.

## 9. THE COHERENCE MATRIX (owner directive: relate to EVERYTHING — reads AND writes per system)
Every row is bidirectional: what generosity READS from the system, what it WRITES back, and the
story that coupling enables. A dead seam in either direction is a design defect.

| System | READS | WRITES BACK | The story it buys |
|---|---|---|---|
| **INFORMATION** (rumors/beliefs/infoMode) | route danger as BELIEVED; the receiver's need as BELIEVED (an exaggerated cry for help travels the same rumor physics — the DECEPTIVE ASK: under unreliable info, M9b's deceptive-outward styles can extract aid with framed need); the refused party's belief of the giver's context (§3.3) | the deed broadcasts (wealth signal → raid attractiveness; character signal → alliance attractiveness); discovered deception = heavy betrayal memory | Aid extracted by a lie, discovered a season later; a refusal forgiven because the truth arrived in time; infoMode changes generosity's whole texture — omniscient worlds judge fairly, unreliable worlds breed tragic grudges |
| **TRADE** (M2/M6a-d, entrepôts) | supply-link dependency (their famine = my shortage); commodity bands; toll costs on the aid route (a middleman hub PROFITS from passing mercy; a greedy toll on an aid corridor = diplomatic-incident seam, v2) | relief rides the SAME shipment ledger; M6d tallies count aid arrivals (the lifeline is visible on the economics tab); sustained aid corridors WARM into trade routes via the overture machinery — aid roads become trade roads | The historically-true arc: the grain road of the famine year becomes the silk road of the peace |
| **FACTIONS** (M9a beliefs, archetypes, coalition) | the GOVERNING COALITION's archetypes weight the kernel's terms — a merchant seat gives as LOANS, a temple seat gives ALMS, a warlord seat gives only STRATEGY; faction BELIEFS diverge from the seat's (the merchant faction may believe the pass is cut when the seat knows better) | a decision against a faction's interest nudges factional standing/dissent (the council_schism seam); the internal politics of mercy are real | "The council split over the grain: the temple demanded it, the merchants demanded payment, the general demanded it feed the garrison first" |
| **ALIGNMENT** (W0, W-C2, moral drift) | conscience scales the need term; risk-tolerance shapes route courage | GENEROSITY DRIVES DRIFT: refusing a desperate sworn ally while comfortable = unjust neglect → moralDrift (the mirror of unjust war); habitual leverage-giving drifts evil-lean; habitual sacrifice-giving drifts good — bounded, slow, receipted | Alignment stops being a static stat and becomes earned character: the town that always gave becomes good; the lender becomes what its ledger says |
| **DEITY** (axes, stance lane, pantheon, contest) | shared-patron warmth; the INTER-DEITY STANCE between giver's and receiver's patrons (the G1c-wired lane: rival deities cool the math, pantheon treaties warm it) | temple-mediated relief into a live RELIGIOUS CONTEST shifts contest legitimacy toward the giver's faith (bounded — the missionary-grain mechanic, historically real); plague-relief triumphs feed the temple-triumph piety pulse | "The Dawnfather's wagons fed Marchmont through the winter; by spring, half the market square prayed at dawn" — deity=alignment simplicity intact, no domains |
| **RELATIONS** (memory, evolution, obligations) | bond kind/strength; typed history incidents; live obligations | gratitude/refusal/slight/humiliation incidents; the obligation ledger; sustained balances shift the LABEL itself through the existing evolution machinery (aid-hardened ally, debt-soured partner) | Friendship with an audit trail |
| **WAR/OCCUPATION** | the strategic reads (§2.1); siege blockade physics (§5.6) | aid into a siege = side-taking (besieger hostility); relief to an OCCUPIED town is PRICED HONESTLY: an extractive occupier taxes the aid — the receipt names how much of your mercy funds the enemy — while populace-aimed relief sustains the resistance clock | "Every third wagon fed the garrison that held them — Thornwall sent them anyway" |
| **CORRUPTION** (compromise system) | the receiving institution's compromise state | aid through compromised stewards LEAKS (the reconstruction-skim generalized); the leak feeds the existing exposure/scandal machinery when discovered | Relief scandals: the famine that enriched a steward and toppled him a year later |
| **SMUGGLE** (M7) | — | a REFUSED or blockaded need keeps its unmet premium — which is exactly M7's signal: mercy smuggling emerges free (good-aligned smugglers running grain into the quarantined town); verify the refusal path sets the same premium the greed tail reads (a coupling pin, not new code) | The engine's most humane emergent story costs zero new mechanism |
| **PESTILENCE/CALAMITY** | contraction risk on aid caravans; calamity as the trigger of asks | reconstruction accelerant (Part B); plague-relief piety | Mercy's price; the rebuilt town that remembers its patron |
| **SEASONS** | the forward margin (autumn ≠ spring); the widow's-mite sacrifice scaling | — | "They gave when giving was dear" |
| **MIGRATION** (M4) | — | the refuge posture gates destination weighting; congestion brakes price the hospitality | Generosity in people, not goods — with its own domestic bill |
| **ECONOMY/LEGITIMACY/COUPS** | own scarcity band; prosperity | the domestic legitimacy term on the existing coup-pressure lane, both directions (courage costs; comfort earns) | The ruler who fed strangers while citizens queued — and what it cost him |
| **NEWS/CRIER/DM surfaces** | — | every verdict is a receipted beat; newsVoice gains a 'succor' category (the F3a pattern); the dramatic-irony brief surfaces fog-misjudged refusals FORMING | The DM watches a tragic grudge being born and can intervene — or not |
| **CUSTOM CONTENT** | user-authored charitable institutions join the roster reads (almshouses count) | — | Player-authored mercy infrastructure matters mechanically |
| **NPC AGENCY** (bounded, v2) | — | flavor hooks around pending verdicts ("X urges the granary opened") — aggregate-safe, no fate resolution | Faces on the decision without violating the named-fate law |

COMPLETENESS RULE (structural prevention for this engine): every instrument added to §4 must fill
its row in this matrix — reads, writes, story — or document the empty cell as deliberate. The E1a
wave adds a matrix-walker note to the shift ledger listing which couplings shipped vs deferred,
so coherence is auditable, not aspirational.
