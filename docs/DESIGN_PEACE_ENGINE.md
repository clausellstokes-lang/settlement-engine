# DESIGN — THE PEACE ENGINE (negotiated terms; the round-21 Wave-8 item, comprehensively resolved)
## Fable 5 architecture, 2026-07-14 — owner-directed: strength decides terms; coalition vs separate peace; peace has a price; coherence and legibility above all
### Companions: G1a (peace now GRIPS the physical war — this design gives it TERMS), DESIGN_GENEROSITY_ENGINE.md (obligations; magnanimity), DESIGN_SUPPLY_WEB_WARFARE.md (coalition-splitting is its diplomatic twin)

## 0. The owner's directives, restated as laws
1. TERMS FOLLOW THE TABLE: who is stronger and weaker at the moment of talks — INCLUDING allied
   combined strength — prices the peace. 2. SCOPE IS A CHOICE: peace for the whole coalition, or
   one settlement's separate exit — with everything a separate exit costs. 3. THE WEAKER PAYS:
   reparations, multi-year profit streams, occupation/territorial terms — or a clean white peace
   between equals. 4. COHERENCE AND LEGIBILITY ABOVE ALL: every treaty is a visible, receipted,
   consequence-bearing artifact the DM can read like a document.

## 1. THE CENTRAL MECHANIC: wars end when beliefs converge
The table strength of a party = own effective strength + Σ committed allies' strength, each ally
DISCOUNTED by reliability (relationship strength × their own exhaustion × distance-to-theater via
hopWeeks — a far, tired, lukewarm ally counts fractionally). CRITICALLY, each side computes this
FROM ITS OWN BELIEF MAP, never truth. Peace requires the two believed ratios to OVERLAP enough
for an offer to clear: when both sides believe they are winning, every offer insults and the war
continues — and each battle, siege tick, and courier updates beliefs, so FIGHTING IS INFORMATION
and wars end when the fighting has taught both courts the same truth. (This single mechanic —
belief-divergence as the obstacle to peace — is the design's soul, it reuses Wave A wholesale,
and it produces the dramatic-irony brief's best line: "both courts believe they are winning; the
war will not end this winter.")

## 2. WILLINGNESS TO SETTLE (when a party comes to the table)
Per belligerent, per tick, deterministic: exhaustion (the existing homeostasis scar), believed
ratio trend (losing FASTER than expected accelerates willingness), war-aims progress (the
original casus resolved or hopeless), domestic pressure (legitimacy/unrest/coup lane — a shaky
seat needs peace OR victory), season/economy (levies wanted for harvest; a strangled supply web
— the W-DOCTRINE read — collapses willingness fast), faith/temper (the W0 read: a vengeful
temper holds out; a measured one settles). Crossing the threshold mints envoys (a receipted
news beat), with hysteresis + envoy cooldowns (no weekly re-suing). A COLLAPSED party (occupied
seat, starved-out, army destroyed) doesn't negotiate — it RECEIVES a dictated peace (§4's ladder
top, imposed through the existing occupation machinery).

## 3. THE NEGOTIATION (bounded, seeded, 2-3 rounds, never a haggle simulator)
Offer = the offering side's believed-fair terms (its believed ratio mapped through the §4
ladder); acceptance iff the offer ≤ the receiving side's believed-fair price + an exhaustion
tolerance. Divergent beliefs ⇒ rejection, receipted with WHY ("Thornwall's council, believing
its northern ally three days out, refused tribute") ⇒ the war continues ⇒ beliefs update ⇒ later
rounds converge. Seeded fork `peace:${a}:${b}:${round}:${tick}`; DM authority modes route
treaty acceptance through the EXISTING proposal machinery (a treaty is a MAJOR — the M10a queue
holds it; autonomy signs it; the rationale surface shows the believed ratios).

## 4. THE PRICE LADDER (terms scale with the believed ratio at signature)
- **WHITE PEACE** (ratio ≈ parity, or mutual exhaustion): status quo ante; withdrawals both
  ways (the G1a grip executes them); cheap, clean, historically the commonest.
- **REPARATIONS** (moderate advantage): a lump transfer — stock/prosperity, conservation-exact,
  optionally 2-3 installments (each a receipted shipment on the E1 transfer physics).
- **TRIBUTE** (strong advantage): the owner's "profit for the next several years" — an N-year
  stream riding the EXISTING vassal-tribute must-go caravan physics, with a treatyRef on every
  wagon. Default = breach (§6).
- **CONCESSIONS** (composable riders, victor-archetype-flavored): toll exemption at the loser's
  gates for the victor's caravans (merchant seats crave this — M6b reads it); DEMILITARIZATION
  (a mobilization-posture cap for N years — the readiness machinery enforces it);
  missionary access (the loser's contest-legitimacy shield lowers for the victor's faith —
  temple seats crave it, the deity-contest machinery prices it); a ceded border satellite
  entering VASSALIZED-to-victor state (the existing occupation ladder — never a map redraw).
- **SUBJUGATION** (collapse/dictated): full vassalization via the existing occupation→vassalized
  machinery — now reachable by treaty, not only by conquest.
VICTOR CHARACTER PRICES THE ASK: archetype picks the term TYPE (merchant→tribute/tolls,
warlord→demilitarization/territory, temple→missionary space); ALIGNMENT picks the WEIGHT — and
here the generosity engine closes the loop: **a magnanimous peace IS generosity** — light terms
on a beaten foe run the E1 reaction ledger (obligation minted, gratitude, low revanchism), harsh
terms run §5. The widow's-mite logic applies to victors: mercy from strength binds hardest.

## 5. REVANCHISM (the reaction law, on the decade scale)
Harsh terms mint a GRIEVANCE record on the loser: slow-decaying (years, within the sub-century
horizon), feeding future war willingness against the victor, alliance-shopping (the aggrieved
seek the victor's rivals — the relationship machinery reads the grievance), tribute-default
temptation (rises as the grievance ages and the believed ratio recovers), and domestic politics
(a revanchist populace pressures moderate seats — the faction/legitimacy lane). Light terms
decay fast and can CONVERT — the E1 obligation warming into genuine alliance ("the enemy that
fed us after beating us"). THE SOAK THESIS: the same war, settled harshly vs generously under
the same seed, must produce visibly divergent DECADES — the second war's alliance map is the
first war's peace terms, receipted end to end.

## 6. THE TREATY ARTIFACT (legibility above all — the owner's fourth law)
A conditionally-materialized `treaties` ledger entry: {parties, coalitionScope, terms[], signed
tick, durations, complianceState, believedRatiosAtSignature}. It is READ by: the war chooser
(an active treaty BLOCKS war between its parties for its duration — breakable, at cost), the
tribute/toll/demilitarization enforcement seams, the E1/grievance ledgers, and every surface:
a TREATIES section on the realm/war surfaces (parties, terms, years remaining, compliance,
strain — "tribute paid grudgingly; the grievance smolders"); crier beats for signing, each
installment, breach, and expiry ("The Peace of Thornwall is signed — grain shall flow south
seven years"); the chronicle holds the full document; the PDF war room prints the treaty table;
the dramatic-irony brief surfaces divergence-blocked peaces and brewing defaults. BREACH is a
first-class event: oathbreaking mints betrayal memory + moral drift (lawful breakers drift
hard) + a reputation broadcast on the rumor network + instant casus belli with the aggrieved's
allies' sympathy (stance-colored).

## 7. COALITION PEACE vs THE SEPARATE EXIT (the owner's scope directive)
- **COALITION PEACE**: the coalition's lead negotiator = its strongest committed member;
  members' willingness AGGREGATES (war-weary members pressure the leader — internal coalition
  politics through the existing relationship/faction reads, legible as council friction); terms
  bind and distribute by contribution (reparations split pro-rata to committed strength).
- **THE SEPARATE EXIT**: any member may buy its OWN peace and leave. The victor's chooser
  actively OFFERS separate terms to the weakest/most-exhausted member it BELIEVES it can peel
  (belief-read of exhaustion — an informed victor peels accurately; a fog-blind one offers to
  the wrong member and stiffens the coalition). Coalition-splitting becomes the diplomatic twin
  of supply strangulation: both are indirect victory through the enemy's structure.
  THE EXIT'S PRICE (equal-and-opposite): heavy betrayal memory with every abandoned ally
  (weighted worse when the coalition was DEFENSIVE — abandoning a defender is the blackest
  ledger entry short of treachery), moral drift for lawful/oath-bound deserters, reliability
  discount (the deserter counts fractionally in every FUTURE table-strength sum — the market
  prices flakiness), and a reputation broadcast. Sometimes worth it anyway — a starved,
  strangled member exits and the engine narrates exactly why: "Marchmont left the field; its
  granaries were ash and its patron's wagons never came."

## 8. CONSTITUTIONAL POSTURE
Rides warLayer+strategy gates (no new top-level flag; the treaties ledger is conditionally
materialized, zero eager); dormant ⇒ byte-identical (G1a's sue-for-peace remains the ungated
fallback — this engine SUPERSEDES it only when lit); aggregate-only; seeded forks; codepoint
order; bounded named constants (the ladder thresholds, grievance half-life, reliability
discounts — all owner-retunable); receipts on every willingness crossing, offer, rejection-with-
reason, signature, installment, breach, expiry; DM authority through the existing proposal/
approval machinery at every signature and breach.

## 9. PINS + THE SOAK
Ladder monotonicity (better ratio never yields worse terms); the BLAINEY PIN (divergent beliefs
block peace; a battle's information converges them; peace follows — same seed, receipted chain);
the separate-exit pin (peel offer → exit → betrayal memories + reliability discount all mint);
tribute default → breach cascade; the magnanimity pin (harsh vs generous settlement of the SAME
war under the same seed → divergent revanchism, alliance maps, and second-war likelihood); the
dictated-peace pin (collapse ⇒ no negotiation ⇒ subjugation terms via occupation machinery).
THE 30-YEAR SOAK: a two-war arc where the first war's peace TERMS demonstrably shape the second
war's coalitions — the design's success criterion: **peace must be as consequential as war.**

## 10. SEQUENCING + REUSE CENSUS
Builds as W-PEACE after the G-track merge (needs G1a's grip, the stance lane, DM-visible expiry)
and after E1a (shares the obligation/transfer physics). Reuses: belief maps (the ratio), war
exhaustion/will, vassal-tribute caravans, occupation/vassalization ladder, E1 transfers +
obligations + reactions, moral drift, rumor broadcast, proposal machinery, M6b tolls, contest
legitimacy, faction/coalition reads. NEW state: the treaties ledger + grievance records (both
conditional, bounded, pruned on expiry). Coherence-matrix rows: all filled — information (the
ratio IS belief; fighting is information), trade (tribute/tolls/reparations), factions (coalition
politics, archetype terms), alignment (magnanimity/drift), deity (missionary terms, stance),
relations (grievance/obligation/betrayal), generosity (magnanimity = E1), war doctrine (peeling =
strangulation's twin), legibility (the treaty artifact).

## 11. THE TERMS VOCABULARY (owner extension: comprehensive, composable, typed)
§4's ladder generalizes: the victor's believed ratio (+ collapse state) buys a TERM BUDGET; every
term has a price-weight; the victor's archetype/alignment SPENDS the budget (white peace = zero
budget; subjugation = unbounded). Terms compose (stacking rules per family); every term declares
its five compliance fields (§12). The catalog, each mapped to its EXISTING enforcement seam:

**SECURITY**
- NON-AGGRESSION PACT: mutual or one-way war-block, N years. ALSO A STANDALONE INSTRUMENT — two
  wary neighbors may sign preventively with no war at all (the war chooser reads it; breaking it
  is oathbreach). Weight: low. Seam: the treaty war-block.
- COMPELLED ALLIANCE (owner's "forced allyship for a set duration"): the loser joins the victor's
  defensive (or offensive — pricier, darker) wars for N years. Compelled allies enter table-
  strength sums at a DEEP reliability discount (~0.3), and they DEFECT when the victor stumbles —
  a belief-read of victor weakness opens the defection window (the crumbling-hegemon cascade:
  one lost battle and the compelled ring falls away, receipted). Weight: high. Seam: coalition
  membership + reliability machinery.
- DEMILITARIZATION: mobilization/readiness cap N years. Seam: martialReadiness ceiling.
- ARMY CAP / DISBANDMENT: militaryStrength ceiling; standing forces above it disband (returns via
  deploymentReturn conservation). FORTIFICATION BAN: defense-investment cap (defenseLedger).
- GARRISON RIGHTS: a victor garrison stationed in the loser's town — occupation-lite (a
  'protective' rung on the existing occupation ladder): burden without extraction, resented.
- HOSTAGE SURETIES (aggregate only — the named-fate law holds): an abstract compliance bond that
  raises the loser's breach cost while held; never named individuals, never resolved fates.

**ECONOMIC**
- REPARATIONS (lump, installments) · TRIBUTE (stream) — as §4.
- RESOURCE SHARE (owner's "half of raw materials/exports"): a FRACTION of named goods' production
  or exports flows to the victor for N years — rides M6a production rates + the tribute caravan
  physics PER GOOD, conservation-exact; the loser's own consumers feel the shortage (domestic
  strain is intrinsic to the term — the engine prices what extraction does to the extracted).
- TRADE EXCLUSIVITY: good X sells only to the victor (reroutes the M2/M6 links — the embargo
  lever inverted). MARKET ACCESS: the loser may never refuse the victor's caravans (overrides
  the M6c refusal seam for victor shipments). TOLL EXEMPTION — as §4.
- DEBT IMPOSITION: a harsh-maturity credit obligation (E1's credit machinery, treaty-flavored).
- RESOURCE RIGHTS: victor access to named resource sites (a resource-share variant at the source).

**POLITICAL/TERRITORIAL**
- SATELLITE CESSION → vassalized-to-victor (as §4) · FULL VASSALIZATION (as §4).
- PUPPET SEAT: the treaty installs a victor-aligned government — the government_change payload,
  REAL post-G1a. Puppet seats are born low-legitimacy and coup-prone (the existing lanes price
  the fragility): cheap control, brittle control, receipted as both.
- RECOGNITION: the loser recognizes a conquest/claim — future wars over it lose casus strength.
- SPHERE LABELS: satellites marked within the victor's influence (a relationship-tier effect on
  their edges; never a digest/territory rewrite — geometry stays frozen).

**RELIGIOUS/CULTURAL**
- MISSIONARY ACCESS (as §4) · CONVERSION MANDATE (stronger: the seat adopts/tolerates the
  victor's faith — the cultImposition machinery, with all its existing brittleness: imposed
  patrons breed heresy stain and latent revival — the term plants its own future arc).
- TEMPLE RESTITUTION: fund/rebuild the victor's faith's houses (founding lane + E1 transfer).

**INFORMATIONAL**
- COMPELLED INTEL: the loser's belief map shares to the victor for N years (the M9b ally-intel
  machinery, compelled) — the victor sees through the loser's eyes… and a deceptive-styled loser
  can feed FALSE intel through the compelled channel (M9b's alignment styles), making this term
  a double-edged sword the victor's own intel must audit. Weight: medium; risk: real.
- PASSAGE RIGHTS: victor couriers/caravans move freely (gate/hopWeeks effects; blinding-immunity
  for the victor's umbilicals through loser territory).

## 12. THE COMPLIANCE META-MACHINERY (every term declares these five)
1. ENFORCEMENT SEAM: the existing subsystem that physically executes it (named above per term).
2. MONITORING — BELIEF-MEDIATED: the victor observes compliance through INFORMATION, not truth.
   A distant victor with poor intel can be cheated — under-delivered resource shares, secret
   rearmament, ghost tribute — until rumors, inspections (a courier-visit event), or the fraud's
   physical consequences surface it. Compliance fraud is a first-class emergent story: detection
   mints a breach event with evidence receipts; NON-detection quietly rewards the informed cheat.
3. STRAIN: every term accrues domestic strain in the compliant party proportional to harshness ×
   duration-elapsed × its own scarcity (paying tribute from a full granary is politics; from a
   thin one, betrayal of one's own). Strain feeds the grievance (§5), default temptation, and —
   critically — COUP PRESSURE ON THE COMPLIANT SEAT: "the king who pays the tribute" is exactly
   whom revanchist factions unseat; his successor inherits the treaty and the choice to honor it.
4. BREACH TYPOLOGY: under-delivery (minor; renegotiation window) vs repudiation (open; full
   oathbreach cascade per §6) vs succession-repudiation (a coup-born seat disavows — softer
   reputation cost, the world understands revolutions, but the war-block still lifts).
5. EXPIRY BEHAVIOR: clean lapse / renegotiation window (either side may seek renewal at the
   CURRENT believed ratio — a rebuilt loser renegotiates from strength) / conversion (a warmed
   relationship graduates the compelled alliance into a real one — the E1 obligation bridge).

## 13. COMPOSABILITY + LEGIBILITY OF COMPOSED TREATIES
Stacking rules: one term per family axis (no tribute + resource-share on the same good; garrison
rights exclude demilitarization redundancy); total weight ≤ budget; the composed treaty prints as
ONE document with per-term status lines. The Treaties surface renders each term's compliance
state independently ("tribute: paid · resource share: UNDER-DELIVERED two seasons · garrison:
resented — strain rising"), so a fraying peace is legible term by term before it breaks — the DM
watches the seam that will tear.

## 14. THE CAUSAL LAYER — reasons for war and peace (owner directive: both equally robust)
ARCHITECTURE: both choosers consume TYPED REASON TERMS through the engine's existing causal-
contributor idiom (causalState's per-contributor receipts, extended to war/peace willingness).
Every reason is a bounded, named, scored contributor; the TOP contributors are NAMED in the
decision receipt and PERSIST on the artifact (the war record carries its casus list; the treaty
carries its peace reasons) — so "why did this war start / why did this peace happen" is always
answerable from receipts, which is the legibility law applied to motive.

### 14.1 REASONS FOR WAR (the casus belli taxonomy — each with its existing read)
- **SECURITY**: rising-neighbor threat (the threat-environment index); preemption against a
  mobilizing rival (the reaction machinery); buffer-collapse exposure (digest adjacency);
  supply-web vulnerability inviting the W-DOCTRINE preemptive.
- **ECONOMIC HUNGER**: my depleted export anchor vs their intact one (tierResourceDynamics —
  depletion now recoverable but slow, and envy is faster); route/gate control greed (entrepôt
  wealth as targetPremium — already wired in M6b); trade strangulation RECEIVED (embargo/toll
  war as grievance); the desperation war — famine with aid refused (the E1 refusal memory
  feeding a raid-becomes-policy escalation: the engine's darkest coherent chain).
- **GRIEVANCE**: treaty grievances (§5), betrayal memories, tribute default, refused-aid slights,
  raid histories — the whole relationshipMemory ledger as fuel, decaying per its own clocks.
- **IDEOLOGY/FAITH**: religious-contest escalation (the contested-conversion → holy-war seam);
  aggressive inter-deity stance (the wired lane); alignment antipathy at cultureDistance
  extremes; MORAL OUTRAGE — a neighbor's atrocities (the scorched-web reputation) makes the
  drifted-evil actor a coalition target: "someone must stop them" is a shared casus that BUILDS
  alliances among its future victims.
- **OPPORTUNISM**: weakness smelled — a BELIEF-read of a neighbor's exhaustion, plague, calamity,
  or coup chaos (the vulture war; fog applies: mis-smelled weakness walks into a bear).
- **DOMESTIC**: the DIVERSIONARY WAR — a low-legitimacy seat under revanchist faction pressure
  rallies against an external enemy (legitimacy + faction reads; the gamble is priced: losing a
  diversionary war ends the seat); prestige hunger (warlord-archetype objectives, M9a); COMPELLED
  entry (alliance terms §11 — dragged in by the treaty).
- **EXISTENTIAL**: no other option — the empty granary next to a full one, every peaceful
  instrument (purchase, aid, credit) exhausted or refused, receipted as such.

### 14.2 REASONS FOR PEACE (the casus pacis taxonomy — the owner's list, completed)
- **LEGITIMACY/DOMESTIC**: war weariness (exhaustion → unrest → the seat needs peace to survive:
  peace as coup-avoidance); the SUCCESSION PEACE — a coup mid-war births a seat that settles to
  consolidate (and may succession-repudiate the war's aims entirely, §12.4); faction pressure
  (the merchant coalition bleeding money votes peace; the temple votes mercy).
- **ECONOMIC**: trade bleeding (M6d shows MY routes severed — the war costs more than its aims);
  drain vs treasury; the HARVEST IMPERATIVE (seasons: levies wanted home before the gap);
  reconstruction triage (a mid-war calamity forces the coin elsewhere — disasters make peace).
- **NO OTHER OPTIONS**: military hopelessness (the believed ratio collapsed); STRANGLED (the
  W-DOCTRINE succeeded — supply-web death makes fighting impossible before it makes it
  unpopular); coalition collapse (separate peaces peeled the allies); the TWO-FRONT NIGHTMARE
  (a new threat opened elsewhere — close this front to survive that one).
- **THE REALIGNMENT** (the owner's "yesterday's enemies, today's new best friends"): a COMMON
  THREAT RISES — when both belligerents' threat-environment index ranks the SAME third party
  above their mutual threat by a margin, continuing the war becomes jointly irrational: both
  willingness scores surge, terms soften toward white peace or even alliance, and the receipt
  writes itself: "the Peace of the Two Rivers — signed in haste, for the horde was at the
  passes." Variants: a regional PESTILENCE as common enemy (war logistics turn suicidal +
  shared-enemy narrative); a shared religious-contest rival; ECONOMIC realignment (a new route/
  entrepôt makes old rivals complementary — the M6d flows say so before the courts do). This is
  the single most story-generative peace reason and it is nearly free: the threat index and all
  three variant reads exist.
- **SATISFACTION**: the aims are MET — the casus list (14.1) empties as its reasons resolve
  (resource seized, grievance avenged, recognition won). REASONS DECAY AND RESOLVE: a war whose
  reasons have all dissolved becomes a ZOMBIE WAR — willingness collapses on both sides and it
  ends fast, receipted honestly: "no one remembered why they were fighting."
- **MORAL/FAITH**: WAR GUILT — moral drift accumulating on an unjust war's instigator becomes
  conscience pressure to settle (the W-C5 reckoning arc feeding the peace chooser); TEMPLE
  MEDIATION — a shared or neutral faith brokers (a piety-weighted willingness bonus + an envoy
  event; temple seats gain a peacemaker role their archetype craves).
- **INFORMATIONAL**: the Blainey convergence (§1 — fighting taught both courts the truth); or a
  decisive REVELATION (the enemy's feared ally is learned to be fiction / the compelled-intel
  channel exposes the real balance).

### 14.3 THE SYMMETRY LAW (structural prevention for motive design)
Every war reason has a peace-reason mirror, and the walker for this design asserts the table
stays paired: security↔common-threat realignment · economic hunger↔economic bleeding ·
grievance↔satisfaction/war-guilt · opportunism↔hopelessness · diversionary entry↔war-weary exit ·
compelled entry↔coalition collapse · desperation war↔desperation peace. A future reason added to
either side without its mirror is a design defect the checklist catches — the owner's "equally
robust" made permanent.

### 14.4 LEGIBILITY OF MOTIVE
The realm surfaces gain the WHY line on every war and treaty (top contributors, plain voice);
the dramatic-irony brief tracks reason ACCUMULATION before decisions fire ("three of five peace
reasons now present; this war is dying") and reason DIVERGENCE (one side fights for a grievance
the other has forgotten); the chronicle can render a war's full causal arc — born of iron-hunger
and an old insult, sustained by mutual illusion, died of harvest and a horde. Motive is state,
state is receipted, receipts are fiction the DM can read aloud.

## 15. THE PRIZE RANKING + TERM LIMITS (owner refinements)
### 15.1 The victor asks for what IT values most of what the LOSER has (top-three rule)
Term selection is never generic. At the table, the victor APPRAISES the loser's portfolio through
its own lens and drafts terms from the TOP THREE of that ranking (budget permitting):
- ASSET CLASSES APPRAISED: resource/export flows (weighted by the VICTOR'S OWN scarcity — its
  bands, depletions, and supply-web gaps: the iron-starved victor ranks the mines first);
  routes/gates (weighted by the victor's trade arteries — entrepôt centrality, toll positions:
  the merchant victor beside the strait ranks the tolls first); military geography (the pass,
  the fortress satellite — weighted by the victor's threat environment); the loser's ALLIANCE
  NETWORK (compelled alliance ranks high precisely when the loser has strong friends — the
  relational asset); faith space (contested conversion ground — weighted by the victor's
  contest positions); treasury/prosperity (the default when nothing structural stands out);
  intel position (compelled intel ranks high for the fog-blind victor who just learned the cost
  of blindness).
- THE RANKING IS THE VICTOR'S OWN NEEDS, mechanically: its scarcity reads, archetype objectives
  (M9a), strategic reads (W-DOCTRINE's web view), contest positions — all existing. Alignment
  then weights HOW HARD the top items are pressed (§4's magnanimity law unchanged).
- BELIEF-APPRAISED: the victor ranks the portfolio it BELIEVES the loser has. A concealed asset
  escapes the ask — fog protects wealth, appraisal is intelligence work, and the loser's
  incentive to hide its best mine from enemy eyes now has mechanical teeth (ties to §11
  compelled-intel and §12 inspection events).
- LEGIBILITY: the treaty receipt names the ranking's logic — "Thornwall took the river tolls;
  it was always the river they wanted." The dramatic-irony brief can show the appraisal gap
  ("the victor never learned of the silver vein").

### 15.2 TERM LIMITS (durations capped, priced, never perpetual)
Every stream/status term carries a DURATION CAP, scaling with the ratio inside a hard ceiling
(named constants, owner-retunable): tribute + resource-share ≤ TRIBUTE_MAX_YEARS (guide: 3-5y
modest victory, 10-15y crushing); compelled alliance ≤ ALLY_TERM_MAX (5-8y — compelled loyalty
rots faster than that anyway, §11's defection window); demilitarization/army caps ≤ 10y;
garrison rights reviewed on an occupation-window cycle; missionary access ≤ one contest cycle;
NAPs 5-20y by mutual weight. DURATION ENTERS THE PRICE: a longer term spends more of the same
budget (victors trade breadth against length — three short takings or one long one).
PERPETUAL TERMS ARE FORBIDDEN except one-time state changes (recognition, cession — events, not
streams): the sub-century horizon, the engine's anti-permanent-ratchet doctrine, and history
itself all say open-ended extraction is a fiction — every stream ends, renegotiates (§12.5's
window, at the CURRENT ratio), converts (the E1 bridge), or breaks (§12.4). A treaty is a
season of history, never a law of physics.

> **WR-0c(4) CLOCK + DURATION RULING — LANDED 2026-08-02.** A treaty now owns
> its calendar provenance. Every NEW treaty
> persists `treatyTicksPerYear: 52`, identity-tied to the engine's canonical
> `INTERVAL_WEEKS.one_year`; display years, stream installments, and §12.3's
> resentment strain all read that per-treaty marker. The annual strain coefficient
> is divided by the treaty's cadence, so twelve legacy ticks and fifty-two current
> ticks accrue the same authored annual burden. The v2 world-state migration is a
> same-schema nested normalization: a persisted unmarked/invalid treaty is stamped
> legacy `12`, while every existing expiry, next-due, breach/repudiation horizon,
> and paid/missed counter remains untouched. This preserves lived contracts instead
> of rewriting history.
>
> The duration scale is now `0.5 + margin + margin²`, multiplied by the existing
> alignment press. The result is rounded to whole years, hard-capped by the term's
> authored maximum, and — when the ask costs more than the remaining settlement
> budget — shortened to the longest affordable whole-year term rather than dropped.
> The decisive-victory arm is therefore monotone at `.99 → 1` while duration still
> spends the same term budget. This proof applies to PRODUCT-FED appraisal rows only;
> it does not pretend that the presently unfed `reparations` or `non_intervention`
> catalog rows are reachable. The 52-tick calendar warranty applies to the promoted
> multi-tick route, where `one_year` composes 52 synchronous weekly ticks. The
> retained `advanceMultiTick=false` coarse route is compatibility behavior, not a
> weekly-correct calendar path. The complete repository gate passed 2,114 files
> with one skipped and 22,410 tests with 54 skipped; production build, 311-route
> prerender, and distribution verification (364/364) are green. No flag was lit,
> no golden or snapshot was re-recorded, and no soak ran.
