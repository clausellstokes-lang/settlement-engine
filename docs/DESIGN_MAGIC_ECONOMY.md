# DESIGN — MAGIC × ECONOMY (directive 10: the political economy of magic)

## Owner-commissioned 2026-07-31, argued to completion the same day (seven amendment
## rounds, all preserved in DESIGN_REALM_DIRECTIVES.md J-D10 — this document is their
## exhaustive consolidation). Fable architecture; owner veto OPEN on every judgment
## block. Status: DESIGN, frozen at dispatch — W-K executes FROM this document, LATE
## in the wave order (it consumes routes W-J, consequences W-H, and the material
## ledger everywhere). Companions: DESIGN_ROUTE_LIFECYCLE.md (reagent corridors, the
## lived profile), DESIGN_NPC_CONSEQUENCES.md (the practitioner is a person),
## DESIGN_TOWN_CARTOGRAPHY.md (the skyline is a diagnosis), calamityKernel (the
## buffer's host), the institution catalog (which already speaks this design's
## language in prose — see §2).

## 0. THESIS

Magic is modeled as an INDUSTRY without ever being granted an exemption from the
material world: presence is free (magic is a property of the world), expression is
banded (tier and magic set the floor, economy the ceiling), exploitation moves
through Herald-announced regimes, substitution enters the ledger as a capped channel,
and every capability is also a visible cost. The system deliberately governs
MAGIC-AS-INDUSTRY only; MAGIC-AS-MYSTERY (the omen, the unexplained spring, the wild
night) remains ungoverned and unexplained BY DESIGN — a world where every wonder has
a supply chain has no wonders (§14).

## 1. CONSTITUTIONAL LAWS

1. **NO EXEMPTION:** magic participates in the one material truth — its inputs are
   goods (reagents, materials), its outputs enter existing ledgers, its
   infrastructure obeys the same status vocabulary as every institution.
2. **PRESENCE IS MAGIC-GATED, EXPLOITATION ECONOMY-GATED** (the owner's split):
   magic-class institution presence keys off the magic profile alone; what the
   settlement can DO with its magic is gated by the economy regime ladder.
3. **ONE GATE FORMULA** (single-writer for formulas): the canonical
   magic-exploitation gate has exactly one definition, read by every consumer
   (buffer, output scale, wards, substitution capacity).
4. **THRESHOLDS WITH BANDS + HYSTERESIS** (the reconciliation): regimes are a closed
   ladder entered by economy thresholds (promotion above demotion — no flapping
   foundries), with continuous banded gradation within each regime; every crossing
   is a Herald EVENT with material receipts.
5. **DAMAGE TRANSMUTES, NEVER VANISHES:** the disaster buffer converts damage into
   economic drain (named stocks draw down); mitigation is ceiling-capped (tail risk
   survives at every wealth level); a spent buffer is a vulnerability window.
6. **INFRASTRUCTURE REMEMBERS:** forms outlive their regimes as SHELLS (closed, not
   demolished); recovery warm-starts from the shell. Third instance of the law
   (hidden paths, settlement remnants, institutional shells).
7. **FINITE SEMANTICS:** regimes, forms, statuses, impairment causes, substitution
   channels — closed vocabularies, all owner-vetoable.
8. **DORMANCY + DETERMINISM:** virtual flag (magicEconomyEnabled, absent from
   DEFAULT_SIMULATION_RULES), fenced dormancy goldens, seeded forks (`magicecon:*`),
   headless domain, tier-blind engine (premium isolation untouched).

## 2. WHAT EXISTS (verified in-tree — the design formalizes the catalog's own prose)

- **The forms ladder, already authored:** institutionalCatalog carries 'Traveling
  hedge wizard' (:303), 'Hedge wizard' (:804), the individual wizard residence
  "1,000+ population viable" (:1328), the druid council (:1335), the permanent
  circle — "Rare… Extremely expensive to construct and maintain. Requires magical
  expertise beyond typical town resources" (:1357 — the economy ceiling IN PROSE),
  and arcane guild tags (:1843). W-K graduates these words into bands.
- `src/domain/magicProfile.js` — the magic-level profile (presence gating's seam).
- `calamityKernel.js` — the disaster kernel (the buffer's host).
- foodBalance CHANNELS (the substitution seam), supplyChainData + goodsCatalog (the
  reagent vocabulary's home), the economy/prosperity derivations (the regime input).
- The regime/band/tuning-table idiom (SETTLEMENT_LIFECYCLE_TUNING shape), structural
  tied NPCs (factionRoles — the practitioner rung's mechanism), the consequence
  economy (W-H: the practitioner can be corrupted, exposed, banished, roam).

## 3. CANONICAL MODEL

### 3a. The two axes and the two-sided band
- MAGIC PROFILE (genesis + drift per existing rules): gates PRESENCE.
- ECONOMY REGIME (derived, worldState): a closed ladder —
  `subsistence | funded | patronized | industrial` (names owner-vetoable) — entered
  by thresholds with hysteresis, banded within.
- AVAILABLE FORMS = [ floor(tier × magic), ceiling(economy regime) ]: a high-magic
  metropolis with a weak treasury holds circles but no foundry; a thorp holds one
  practitioner however magical the wood. The skyline is a DIAGNOSIS.

### 3b. The forms ladder (closed, catalog-realized)
`practitioner → circle → tower → guild → foundry`
The practitioner rung is A TIED ROSTER CHARACTER as much as an institution row
(structural-NPC pattern): the hedge wizard has a name, facets, and full reachability
by the consequence economy — the thorp's whole magic is someone you can lose.

### 3c. Institution operational status (GENERAL — all institutions, not magic-only)
`operational | impaired | shell`
- IMPAIRED: operating-but-degraded; a CAUSE-BOUND CAPACITY MODIFIER in
  [reduced .. temporarily zero] — engine derives default severity from the cause,
  the DM may override anywhere in the range (sovereignty over operations); closed
  cause vocabulary: `supply_shortage (any root: cut route, failed harvest,
  interdicted reagents) | corruption_exposed | damage | siege_occupation | …
  authored`; the cure follows the cause; lifts AUTOMATICALLY as an event when the
  cause resolves; NEVER orphaned (pinned: no impairment without a live cause).
- SHELL: intact but unfunded — closed by regime demotion, zero output, nothing
  wrong with it; reactivated by economic recovery (warm-start). Long-neglect decay
  toward ruin is an optional depth band.
- THE TWO-TIMESCALE LAW: impairment is the FAST layer, shell the SLOW verdict (the
  trade-disruption vs organic-removal pattern, universalized).
- COMPOSITION: an impaired shell (closed AND rotten) is the darkest state short of
  ruin. Cartography renders each honestly: the frayed / the dark / the frayed-dark.

## 4. THE EXPLOITATION GATE (Law 3 — one formula)

`exploitation(settlement) = regimeBand(economy) — read by:`
- OUTPUT SCALE: magic institutions' economic contribution, service scale, wards.
- THE DISASTER BUFFER (§5). — SUBSTITUTION CAPACITY (§6).
Within-regime bands grade continuously; crossings fire events. The gate never reads
subscription tier, party state, or wall clocks.

## 5. THE DISASTER BUFFER (calamityKernel integration)

`mitigation = economy_term + magic_term × gate` — both terms banded, the sum
CEILING-CAPPED (never nullification). Mitigation CONVERTS damage: reduced structural
loss is paid for in named stocks (treasury, reagents, reserves draw down in the
same outcome — receipts: "the wards held; the granaries paid"). Repair acceleration
follows the same shape post-event. A drawn-down buffer recovers on banded dwells —
the SECOND-SHOCK WINDOW is a designed vulnerability, not an accident. Pins: the
gating asymmetry (high-magic/poor ≈ mundane/poor — proving magic eats materials),
damage-ordering envelope across the magic × economy grid, conjunction REACHABILITY
(the high-magic × high-economy cell occurs in generated corpora — the
unreachable-conjunction hazard class, pre-answered).

## 6. SUBSTITUTION (top regimes only — the channel, never the exemption)

At the highest regime(s), magic may substitute for food and supply — AS A CHANNEL in
the existing foodBalance/supply architecture: share CAP-BANDED, costs material
(reagent draw + practitioner capacity, flowing through the route ledger,
charterable and cuttable). THE DEPENDENCY METRIC: a settlement's substitution share
is a named fragility — magical dependency — Herald-narratable ("the city eats from
the Guild's hand") and enemy-targetable. CONSERVATION PIN: remove the magic source
and the deficit honestly reappears. Routes stay load-bearing: substitution shifts
WHAT moves, never whether things move.

## 7. REAGENT SUPPLY CHAINS (Fable recommendation, veto open — the full-circle move)

Denominate magic's hunger in the goods catalog: reagent chains join supplyChainData;
magic institutions generate corridor demand (W-J's flow ledger) for reagents scaled
by regime; interdiction of a reagent route IMPAIRS (fast) before economic failure
SHELLS (slow); the buffer draws down reagent stocks by name; cartography seats the
foundry beside the warehouses that feed it. One decision, and every mechanism this
program built — routes, warfare, bypasses, the lived profile — applies to magic for
free. Anti-magic siegecraft becomes economic warfare by construction.

## 8. SURFACES

- **Herald:** regime crossings ("the enchanters' circle takes a patron"; "the
  foundry falls quiet"), impairment lifts ("the road reopened; the fires relit"),
  dependency stories, buffer receipts — all address-chained, all in-world prose.
- **Cartography:** the two-sided band renders — the mystic backwater's lone tower,
  the industrial quarter, the shell's dark windows (A-8 counts and A-10 prominence
  read the LIVED regime; condition axis renders operational/impaired/shell).
- **Dossier:** the magic story in the legibility law's shapes — regime as a word,
  forms as places, dependency as a sentence; never a formula.

## 9. DYNAMICS THE SYSTEM PRODUCES (designed, to be soak-verified)

The full settlement arc: mystic backwater (latent) → patronage (awakening) →
industrialization → dependency (power balanced on a narrow material stem) → lean
years or severed roads → the quiet foundry (shell) → warm-started revival.
Punctuated, pro-cyclical, and counterable: the strategic answer to a magical city is
economic warfare — starve the treasury that pays for the wards. WATCHPOINT (tuning):
top-of-ladder stickiness — Wave A proved cities already resist decline; industrial
magic + the buffer must not make the summit untoppleable (the envelopes + the
self-spending buffer + economic warfare are the counterweights; tuning owns the
final balance). RARITY: the top regime carries rarity bands — if every third city is
industrial-magic, none are wondrous.

## 10. DETERMINISM, DORMANCY, LIFECYCLE

Seeded forks throughout; dormancy golden (flag off ⇒ byte-identical generation AND
pulse — catalog entries may exist as inert data per the brokerage precedent);
regime/status state in conditional worldState keys (drop-when-empty); JSON
round-trip + regen + undo pins; exports carry status honestly; audience projection
(a covert-cause impairment's cause is DM truth; the impairment itself is visible).

## 11. TUNING (MAGIC_ECONOMY_TUNING — the tuning pass's largest single customer)

Regime thresholds (hysteresis pairs), within-regime bands, form availability bands,
buffer terms + ceiling + recovery dwells, substitution caps, reagent demand scales,
top-regime rarity, impairment default severities per cause. Every entry PROPOSED
(soak-vetoable) per the R-15 shape.

## 12. TESTING ARCHITECTURE

- Presence-independence pin (magic-institution presence at high magic invariant
  across economy bands); archetype reachability (poor+high-magic cells generate
  practitioners/circles in real corpora); exploitation-ordering envelope (output
  monotone in economy at fixed magic).
- Buffer: gating asymmetry, damage ordering, conjunction reachability, second-shock
  window pin (a drawn buffer mitigates less, honestly).
- Substitution: conservation pin, cap enforcement, dependency-metric emission.
- Status: no-orphaned-impairment walker; cause-resolution lift events; shell
  warm-start; impaired-shell composition; two-timescale pin (route cut impairs
  before any regime motion).
- Regime ladder: crossing events with receipts, hysteresis (no flapping under
  oscillating economy fixtures), rarity envelope.
- Dormancy goldens; subsystem-certification row (magicEconomyEnabled — aliveness:
  regime events + status transitions; expectedTempo 'multi_year').

## 13. SLICES (W-K — each dark, gated, one commit, ledger row; builds LATE)

- **K1 STATUS SYSTEM (general, magic-independent):** operational|impaired|shell +
  cause vocabulary + capacity modifier + DM override verbs + the two-timescale wiring
  + no-orphan walker. Ships first — every institution benefits before magic does.
- **K2 REGIMES + FORMS:** the ladder, the two-sided band, catalog band graduation,
  the practitioner tied-NPC rung, crossing events, shells.
- **K3 THE BUFFER:** calamityKernel integration, self-spending mitigation, envelopes.
- **K4 SUBSTITUTION + REAGENTS:** the channel, dependency metric, reagent chains
  (§7 if ratified), route-ledger integration.

## 14. RISKS + DEFERRED

- **Risk — disenchantment:** governing magic-as-industry must not annex
  magic-as-mystery. DEFERRED BY DESIGN, PERMANENTLY UNGOVERNED: omens, wild magic,
  unexplained wonders — no ledger, no regime, no explanation owed. The hedge wizard
  stays a strange person at the wood's edge, not a production unit.
- **Risk — integration surface:** W-K touches catalog, economy, disasters, routes,
  war, cartography, NPCs — its true price is integration testing; hence LATE in the
  order, after its substrates land.
- **Risk — top-of-ladder stickiness** (§9 watchpoint; tuning owns it).
- **DEFERRED (recorded):** magical institutions as faction-capturable assets beyond
  normal capture rules; inter-settlement magical cooperation (circle networks);
  enchanted infrastructure (warded walls as buffer contributors) — after K4 soaks.
