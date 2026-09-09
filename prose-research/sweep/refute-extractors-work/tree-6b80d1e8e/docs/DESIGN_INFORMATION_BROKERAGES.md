# DESIGN — INFORMATION BROKERAGES (the epistemology layer gets an address)

## Owner-commissioned 2026-07-31; full architecture same day ("fully and exhaustively
## architect it out"). Fable design; owner veto OPEN on Challenges A and B. Status:
## DESIGN, frozen at dispatch — the brokerage wave (W-I) executes FROM this document.
## Companions: DESIGN_INFORMATION_STATECRAFT.md (the verbs + credibility stock),
## DESIGN_NPC_CONSEQUENCES.md §6b (reputation as belief), the institution catalog
## idioms, the knowledge-lane soak finding (2026-07-31: 28 proposed / 0 selected).

## 0. THE OWNER'S SPINE (binding as given)

Two institution families, legal and illegal, specializing in information. Tier-scaled
major/minor forms (small chapter in a town; large guild in a metropolis). Presence
improves the settlement's news fidelity, STILL distance-scaled (bends the curve, never
abolishes it). Not the rumor plane: this is the player's/DM's access to more reliable
information. The brokerage feeds its patron power, improving that power's confidence
calibration and/or truth-closeness of its belief map.

## 0b. THE TWO INSTITUTIONAL ROLES (owner clarification, binding)

RUMOR SOURCES are not brokerages. Brothels, coaching inns, fences, and their kin are
WHERE TALK HAPPENS — volume and color into the rumor plane (mechanicalRumorSeeds lanes).
Brokerages are HOW TALK IS WEIGHED — fidelity and calibration over the belief
derivation. Distinct roles, never conflated. SYNERGY (authored): Whisper Market
presence weighting favors rumor-rich hosts (fence/inn/brothel density) — listeners live
among talkers. DATA PASS: the wave adds a closed `rumorSource` service tag to the
existing talk institutions so the plane's sources become census-able.

## 1. THE CONVERGENCE (verified in-tree — why this architecture is small)

`informationStatecraft.js` (W-DOCTRINE-2, BUILT + gate-green) already carries the
CREDIBILITY STOCK (consumed by belief corroboration + Blainey convergence) and the LIE
verb (seed → propagate → contradict → expose → blowback), with SEE / HIDE / SHARE-SELL
explicitly SEAM-NOTED at the foot of the file for a follow-up pass. Per-settlement
belief maps exist (`beliefMap.js`: observerId → subject → beliefs). Distance pricing
exists. The rumor network, fog-as-staleness, and carriers exist. THE BROKERAGE IS THE
INSTITUTIONAL ANCHOR THE SEAM-NOTED VERBS WERE WAITING FOR:

- **SEE, institutionalized** = the brokerage QUERY (Challenge A's paid sharp truth).
- **SHARE-SELL, institutionalized** = the PATRON FEED (the owner's power-feeding rule).
- **LIE, institutionalized** = the Whisper Market's PLANT (Challenge B's lie-mint) —
  the verb is already built; the brokerage gives it a seller.
- **HIDE, institutionalized** = the brokerage's counter-service (suppression contracts;
  deferred to a later slice, recorded §12).

No new substrate. Thin institutional decision layers over machinery that exists — the
statecraft module's own design philosophy, extended one ring outward.

## 2. CONSTITUTIONAL LAWS

1. **DISTANCE IS NEVER ABOLISHED** (owner law): brokerage fidelity BENDS the
   distance-decay curve, bounded by an authored ceiling; omniscience is impossible.
2. **CALIBRATION HONESTY:** every reliability stamp is a testable claim — items
   stamped at a reliability grade must be true at approximately that grade's rate
   (a proper scoring-rule envelope, §10). The stamps cannot lie about lying —
   EXCEPT through the Whisper Market's plant verb, whose miscalibration is itself
   attributable, priced, and expose-able (the blowback triple).
3. **TIER-BLIND ENGINE** (premium isolation): brokerage mechanics never read
   subscription tier; costs are IN-WORLD (settlement resources, patron favor),
   never credits or real money.
4. **FINITE SEMANTICS:** reliability grades, channels, service tags, plant classes —
   closed vocabularies. The legibility law governs every stamp's surface text.
5. **DORMANCY:** catalog entries are inert data (institutions may generate dark —
   presence alone changes no bytes of pulse output until the epistemic effects light);
   effects gate behind `infoStatecraftActive` (existing) plus virtual
   `informationBrokeragesEnabled` (absent from DEFAULT_SIMULATION_RULES), fenced
   dormancy golden.
6. **ENDOGENEITY:** brokerages observe the world; party/player data never enters
   their math.

## 3. CANONICAL MODEL — catalog entries (the house idiom, exact shape)

Four entries in institutionalCatalog.js, tier-banded per the owner's major/minor rule:

- **Listening Post** (legal minor; town+): baseChance weighted by trade connectivity
  (information follows roads; seasonal routes carry seasonal fidelity), tags
  ['legal','information','brokerage'], priorityCategory 'commerce'.
- **Chroniclers' Exchange** (legal major; city+, subsumes Listening Post via the
  existing subsumption pass): the guild form; higher fidelity ceiling, more channels.
- **Rookery** (illegal minor; town+): requires a criminal-organization power present;
  presence weighting favors rumorSource density (§0b synergy); tags
  ['criminal','information','brokerage'].
- **Whisper Market** (illegal major; city+, subsumes Rookery): the covert guild;
  unlocks the plant service.

Each carries service keys (gen:institution-service-keys regen) from the closed set:
`info_calibration | info_query | info_feed | info_plant(illegal major only)`.
Custom-content compatible: custom brokerage-class institutions declare the same closed
service keys through the manifest; effects are service-key-driven, never name-driven.

## 4. CHANNELS (closed vocabulary — what a house can be good at)

`trade | war | politics | faith | crime | persons` — the persons channel carries
wanderer reputation (§6b consequences doc). LEGAL houses master overt channels
(trade/war/politics/faith at full competence, crime/persons at reduced); ILLEGAL
houses invert (crime/persons full; overt reduced). Competence per channel per form
(minor/major) is an authored table in INFORMATION_BROKERAGE_TUNING.

## 5. PASSIVE EFFECTS (Challenge A: calibration primary)

Where a brokerage stands, the settlement's derived news view gains:
- **RELIABILITY STAMPS** (primary): each news item carries a grade from the closed
  ladder `confirmed | corroborated | reported | tavern_talk` — derived from the item's
  actual provenance quality (carrier count, distance, credibility stocks, channel
  competence), surfaced in-world ("confirmed by three roads"). Stamps exist ONLY in
  brokerage settlements — elsewhere the news reads as today (the game's baseline
  uncertainty is unlabeled, by design).
- **MODEST ACCURACY BUMP** (secondary): the belief derivation's fidelity term
  (§6b consequences doc) gains the brokerage's channel competence, ceiling-bounded
  (Law 1). Wanderer admission checks in brokerage towns therefore run against
  better-calibrated local belief — stories are harder to outrun where listeners live.

## 6. ACTIVE SERVICES (the verbs, institutionalized)

- **QUERY (SEE):** a per-question sharp-truth service — the DM/player asks about a
  subject (settlement, faction, wanderer, war), pays the IN-WORLD price (banded by
  channel + distance + form), receives the brokerage's best derivation WITH its honest
  stamp. Seeded, receipt-carried, Herald-recorded ("the Exchange was asked; the
  Exchange answered"). Query results are projections of existing truth+belief — never
  new facts minted.
- **FEED (SHARE-SELL):** the standing patron contract — the patron power's belief map
  gains channel calibration each pulse (the owner's rule, formalized). The feed is a
  visible edge on the power (espionage-target surface: war intel, allyIntelSharing,
  and the statecraft EXPOSE path can all target it).
- **PLANT (LIE), Whisper Market only:** the already-built LIE verb gains a seller —
  a patron may commission a plant through the market; the market's credibility stock
  backs the lie (better launder, longer legs), and the existing
  contradict → expose → blowback triple prices failure. Plants are DM-truth until
  exposed (audience projection).
- **KNOWLEDGE-LANE CANDIDATES:** queries, feeds, plants, and intercept-attempts
  register as knowledge-mover candidates — the starved lane (soak finding) gains its
  institutional candidate generators; selection weights join the tuning agenda.

## 7. PATRONAGE (who the house serves)

Each brokerage binds to a patron power at generation (seeded, from the settlement's
power structure: legal → ruling/mercantile powers; illegal → criminal/faction powers)
and may REBIND through the existing faction-competition machinery (a contested asset —
capturing the listeners is a coup-adjacent prize; ties into
faction_institution_capture, which already exists as an event type). Patronage is
visible to the DM, audience-projected for players (a Whisper Market's patron is
covert until exposed).

## 8. SURFACES

- **Herald:** stamps on news items (brokerage settlements only); query receipts;
  plant exposures ride the existing blowback news. The stamp vocabulary is prose,
  never numbers (legibility law).
- **Dossier:** the institution renders per the catalog norm; its card names channels,
  form, patron (audience-projected), and — per the cartography program — earns a
  parcel with prominence scaled by its economic contribution (A-8/A-10 compose here
  automatically).
- **Wanderers (§6b consequences):** the persons channel is the mechanical bridge —
  brokerage competence sharpens local belief about arriving roamers.

## 9. DETERMINISM, DORMANCY, LIFECYCLE

All draws through seeded forks (`brokerage:*` labels). Dormancy per Law 5 with the
fenced golden (flag off ⇒ byte-identical pulse; entries may still generate as inert
buildings — presence without effects, pinned). Lifecycle paths: catalog entries ride
normal institution persistence; patron bindings live in worldState (conditional key,
drop-when-empty, the ledger pattern); JSON round-trip + regen + undo pins; world
export carries bindings; player export projects them (the consequences doc's audience
law extended: plant records and covert patronage are DM truth).

## 10. TESTING ARCHITECTURE

- **The calibration-honesty envelope** (the program's crown jewel): over a seeded
  corpus, items stamped `confirmed` are true at >= the confirmed band, `tavern_talk`
  at its band — a proper scoring rule executed against ground truth the sim knows.
  The stamps are the rare UI element with a THEOREM attached.
- Divergence envelope: brokerage settlements show measurably lower belief-truth
  divergence than matched non-brokerage settlements (the certification build's
  belief-divergence observation gains its natural experiment).
- Plant lifecycle pins: commission → launder → propagate → contradict → expose →
  blowback, with credibility-stock deltas asserted at each stage (extends the
  statecraft module's existing pins).
- Totality for service availability (form × channel × legality — no fall-through);
  subsumption pins (Exchange subsumes Post; Market subsumes Rookery); dormancy golden;
  catalog validation (validate:data + service-key regen).
- Subsystem-certification row: informationBrokeragesEnabled — aliveness = stamps
  emitted + query/feed/plant candidates; expectedTempo 'reactive'.

## 11. SLICES (W-I — each dark, gated, one commit, ledger row)

- **I1 CATALOG + TAGS:** four entries, service keys, rumorSource data pass (§0b),
  subsumption, presence weighting, generation pins. Inert — zero pulse effects.
- **I2 STAMPS + FIDELITY:** the reliability ladder, the belief-derivation fidelity
  term, calibration-honesty + divergence envelopes.
- **I3 SERVICES:** query, feed, patronage + rebind, knowledge-lane candidates.
- **I4 THE MARKET:** plant commissioning over the existing LIE verb, audience
  projection, blowback integration, the espionage-target surface.

## 12. RISKS + DEFERRED

- **Risk — trivializing the epistemic game:** held by Law 1's ceiling + Challenge A's
  calibration-primary design; the tuning bands own the final feel.
- **Risk — stamp trust collapse:** if calibration honesty drifts, stamps become noise;
  the envelope is gate-level, not advisory.
- **Risk — patron feed as intel superweapon:** feed calibration is channel-scoped and
  ceiling-bounded; war-reasoning consumption reviewed at I3 with its own pin.
- **DEFERRED (recorded):** HIDE institutionalized (suppression contracts — after I4);
  inter-brokerage rivalry arcs (two markets, one truth); brokerage chains
  (multi-settlement networks) — after the realm proves it wants them.
