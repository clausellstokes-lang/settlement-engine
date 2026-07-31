# DESIGN — INFORMATION BROKERAGES (the epistemology layer gets an address)

## Owner-commissioned 2026-07-31 (initial thoughts + invited challenge); Fable design.
## Status: DESIGN — owner veto open on the two CHALLENGE blocks. Companions:
## DESIGN_INFORMATION_STATECRAFT.md, DESIGN_NPC_CONSEQUENCES.md §6b (reputation as
## belief), the institution catalog idioms, the knowledge-lane tuning finding (soak
## 2026-07-31: 28 proposed / 0 selected — this institution is that lane's home).

## 0. THE OWNER'S SPINE (binding as given)
Two institution families, legal and illegal, specializing in information. Tier-scaled
major/minor forms (a small chapter in a town; a large guild in a metropolis). Presence
improves the settlement's news fidelity, STILL distance-scaled (bends the curve, never
abolishes it). Not the rumor plane: this is the player's/DM's access to more reliable
information. The brokerage feeds its patron power, improving that power's confidence
calibration and/or truth-closeness of its belief map.

## 0b. THE TWO INSTITUTIONAL ROLES (owner clarification 2026-07-31 — binding)
RUMOR SOURCES are not brokerages. Existing institutions — brothels, coaching inns,
fences, and their kin — are WHERE TALK HAPPENS: they contribute VOLUME and color to the
rumor plane (the mechanicalRumorSeeds lanes). Brokerages are HOW TALK IS WEIGHED:
fidelity and calibration infrastructure over the belief derivation. Distinct roles,
distinct wiring, never conflated. INTERACTION (authored synergy): the illegal house
thrives where talk is thick — Whisper Market presence weighting favors rumor-rich hosts
(fence/inn/brothel density), the natural ecology of listeners among talkers. WIRING
NOTE: the rumor-source role is design intent today, not yet an explicit catalog tag —
the brokerage wave includes a small data pass adding a closed `rumorSource` service tag
to the existing institutions so the plane's sources become census-able (and the
certification observation can count them).

## 1. CHALLENGE A (Fable, veto open): CALIBRATION PRIMARY, ACCURACY SECONDARY
Passive effect = RELIABILITY GRADES on news (calibrated confidence: 'confirmed by three
roads' vs 'tavern talk' — a closed reliability vocabulary stamped on Herald items in
brokerage settlements), plus a MODEST passive accuracy bump. Sharp truth is a SERVICE:
an active query verb with in-world cost. Rationale: flat ambient truth dissolves the
unreliable-information game and parks every serious player in brokerage towns;
calibrated uncertainty preserves the game, is worth more at the table, and is legible.

## 2. CHALLENGE B (Fable, veto open): THE TWO HOUSES KNOW DIFFERENT THINGS
- LEGAL (Chroniclers' Exchange; minor: Listening Post): masters the OVERT channels —
  trade, war, official acts; feeds the ruling power channel-specific calibration.
- ILLEGAL (Whisper Market; minor: Rookery): trades COVERT truth — corruption,
  compromise, wanderer dmTruth; feeds its criminal/faction patron; and is itself
  corruptible — it can SELL FALSEHOODS (planted information, wiring into information
  statecraft's counter-intel). Truth-fence AND lie-mint.
Hosting choice becomes settlement character, not a legality checkbox.

## 3. MECHANICS (all existing idioms)
- Catalog entries per the house shape: tier bands (minor at town-, major at city+),
  presence weighted by trade connectivity (information follows roads; seasonal
  mountain_pass carries seasonal fidelity), forbiddenTradeRoutes/combos as authored,
  custom-content compatible, first-paint neutral (lazy data leaf).
- Belief derivation (§6b consequences doc): brokerage presence enters the on-demand
  belief derivation as a fidelity/calibration term — never stored per-pair.
- Patron feeding: the patron power's belief map gains channel calibration; the
  brokerage becomes an espionage-target surface for allyIntelSharing/war reasoning.
- The knowledge mover lane gains its candidate generators here (queries, plants,
  intercepts, feeds) — the starved-lane cure has an institutional anchor; selection
  weights join the tuning agenda.
- Wanderer interaction (free, by construction): admission checks in brokerage
  settlements run against better-calibrated local belief — stories are harder to
  outrun where the listeners live.
- Dormancy: rides existing flags where possible (institutions are data; the epistemic
  effects gate behind the statecraft/knowledge machinery's existing rules); any new
  behavior flag is virtual + dormancy-pinned per constitution.

## 4. CERTIFICATION + LEGIBILITY
- Envelope: brokerage settlements show measurably LOWER belief-truth divergence (the
  certification build's belief-divergence observation gains its natural test case).
- Legibility law: players see reliability stamps and in-world prose, never numbers;
  the formula stays translated.

## 5. SEQUENCING
Catalog entries are cheap and could land early (data + tests); the epistemic effects
land with/after the certification build's belief-divergence observation and W-H §6b
(shared derivation seam). Full slice spec at wave-scheduling time.
