/**
 * domain/certification/subsystemRowsSeat.js — THE W-SEAT FAMILY'S CERTIFICATION ROWS.
 *
 * A NINTH ROW LEAF, AND IT EXISTS FOR A MEASURED STRUCTURAL REASON RATHER THAN TASTE.
 * `subsystemRowsVirtual.js` sat at 788 effective lines against its layer's 800-line
 * `max-lines` ceiling — the previous flag mint (W-COIN-1a's `treasuryEnabled`) took it to
 * within twelve lines of the wall. A certification row is not small by accident: the
 * contract asserts `aliveness.other` past 400 characters and at least one falsifiable
 * invariant, so an honest row costs ~35 effective lines and the NEXT mint after treasury
 * was always going to red the ceiling. Compressing a row to fit would have landed the file
 * at exactly 800/800 and handed the wall to whichever lane touched it next.
 *
 * The W-SEAT program alone charters THREE virtual keys (the foreign seat here; the domestic
 * §736 upheaval scaling with SEAT-2b; the irregular-force physics with SEAT-7), so this is a
 * habitat problem rather than a one-row problem, and the estate had already solved it once:
 * the certification registry is ALREADY lane-split eight ways (baseline / growth / people /
 * place / regen / virtual / war / waves). This leaf is the ninth cut of that same seam.
 *
 * ⛔ IT DELIBERATELY DOES NOT JOIN `subsystemCertification.js`'s import list. The rows spread
 * back into `VIRTUAL_SUBSYSTEM_ROWS`, which stays the ONE export every consumer, walker and
 * bijection already reads — so the composition, the totality audit and the ordered
 * rule-name contract are untouched and no other lane's surface moves. The whole cost to the
 * file this relieves is one import and one spread.
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The W-SEAT family's authored rows (the sibling row leaves' idiom verbatim).
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const SEAT_SUBSYSTEM_ROWS = Object.freeze([
  Object.freeze({
    rule: 'foreignSeatEnabled',
    title: 'The foreign seat (the occupier or overlord who looms over the ruler)',
    module: 'src/domain/rulingPowerSeat.js,src/domain/worldPulse/stressorGates.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: SEAT-1 mints no `candidateType` literal. The seat is a pure
      // read and the one lit behaviour is a GATE refusing a birth, which is the absence of
      // a candidate rather than a new one.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY, and a COMMITMENT rather than an omission: SEAT-1 mints ZERO
      // news kinds. The news bill is priced by name into SEAT-2's charter (volume D8 — the
      // seat-override, posture-change, seat-backed-challenge, reaction-held and liberation
      // kinds, each paying the full V6-B3 authoring/herald/pool bill). Declaring a mover
      // family here would grade this row ALIVE off another lane's beat, the recorded
      // moverFamily hazard.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, and this is the row's honest weakness: the seat OWNS NO STATE
      // AT ALL. It is derived per call from three ledgers other subsystems own
      // (`worldState.occupations`, `worldState.relationshipStates`,
      // `spatialLedgers.treaties`), on the hegemonyRead template — "A PATTERN, NEVER AN
      // ENTITY … ZERO persisted state". There is no `spatialLedgers.*` this subsystem owns
      // and there never will be; the single persisted field the whole design allows (the
      // CHOSEN posture, Q-S2) lands on the occupations record at SEAT-3, not here.
      stateKeys: Object.freeze([]),
      other: 'THE COUNTERPART SEAT: the owner directive (ODQ 735.2) that an occupied or vassal settlement\'s ruling power has "an equal or greater counterpart in all decision-makings derived from the overlord or occupier". ONE GATE AT THIS CAR: stressorGates.occupierGovernsHere reads foreignSeatEnabled by name with the strict === true idiom, off snapshot.worldState.simulationRules rather than the normalized rules because a virtual key has no DEFAULT_SIMULATION_RULES entry to normalize (the brokerageEffectsActive idiom). WHAT THE FLAG LIGHTS AT SEAT-1, EXACTLY ONE THING: the coup spawn gate\'s occupied test widens from the STRESSOR spelling to the UNION of the stressor spelling and the occupations LEDGER. That is D4\'s named move and A1.1.2 rules it must land flag-gated rather than as plumbing, because the two spellings were MEASURED to diverge in BOTH directions - a war-layer conquest mints a ledger row at occupation.js:966 and never a type occupation stressor, so today the gate OPENS and a coup spawns in a town already held at spearpoint, while a generation-authored occupied stress has no ledger row at all and must keep blocking. The lit predicate is their UNION, so it can only ever block MORE coups than today and never fewer, and the DARK path keeps the stressor spelling VERBATIM. WHAT SEAT-1 SHIPS UNREACHED, AND THAT IS THE DESIGN: foreignSeatOf, the one seat resolver, consults the three substrates in precedence order - the occupations ledger at a rung BELOW vassalized (regime occupation, carrying PRIMACY), a vassal relationship edge on which this settlement is the junior or the vassalized rung itself (regime vassalage, carrying a banded scalar weight), and subordinating treaty ties alone (capped at the present band, because influence without a compact is pressure and not a seat). It has NO production consumer at this car and its greens are therefore REGRESSION-grade, not discovery-grade; SEAT-2a wires it into the seat books and the decision choke and carries the discovery proof. THE VASSALIZED RUNG IS RULED OUT OF OCCUPATION (A1.1.8): the ladder\'s top rung never exits the ledger because the sovereignty-sale machinery needs the row, so a presence-only predicate would keep a matured vassal under occupation PRIMACY and under W-COIN\'s zero-tax rule forever, making cultivate the road to permanent maximal domination and inverting the owner\'s design. PRIMACY IS ORDERING, WEIGHT IS SCALAR (law 2.3): occupation grants override rights on a TYPED decision-class list and never depends on a tuned number staying bigger, so no tuning pass can invert "always just greater". ONE RESOLVER PER QUANTITY: the duplicate vassalOverlordOf collapsed here - two functions of one name read different substrates from different argument shapes, the dead edge-walking export in occupation.js is deleted and the ledger question has one home. GRIP_SCALE is its OWN named table and is never folded into occupation\'s STATE_BENEFIT_SCALE: one is a POLITICAL unit and the other an ECONOMIC one, and they diverge at the bottom of the ladder on purpose. WHAT IT NEVER DOES: no persisted seat state, no rng, no wall clock, no writes of any kind, no fifth governing-truth fork - it CONSUMES governingFactionOf rather than re-deriving it, and it mints no 11-by-11 culture table because the II.5-2 derived-similarity composite is constitutional. The lane is pinned at tests/domain/foreignSeatResolver.test.js and tests/domain/foreignSeatDormancy.byteIdentity.test.js.',
    }),
    // The gate the flag reaches runs on every candidate stressor birth, so the cadence is
    // the pulse's own — even though the lit difference is a refusal rather than a beat.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_the_stressor_spelling_verbatim',
        description: 'THE PROMISE, and it is narrower than the usual dark claim because this flag lights a PREDICATE rather than a layer: with the key dark, `occupierGovernsHere` returns `activeTypesAt(snapshot, sid).has(\'occupation\')` and nothing else is evaluated, so the coup gate behaves byte-for-byte as it did before this commit. The strict `=== true` read refuses every truthy non-true value, so a string "true" or a 1 lights nothing.',
        check: 'NOT expressible from a receipt — a gate refusal leaves no receipt row by construction. Pinned behaviourally in tests/domain/foreignSeatDormancy.byteIdentity.test.js against the RAW comparator: the same seeded world advanced the same ticks with the key absent and with it explicitly false, serialized bytes compared with JSON.stringify and no normalizer (A1.19 — normalising would launder the very bytes the bar exists to compare), plus a truthy-refusal arm and a lit ANTI-VACUITY drive so a green cannot mean the instrument compared nothing.',
      }),
      Object.freeze({
        name: 'the_lit_predicate_only_ever_widens',
        description: 'The lit form is the UNION of the stressor spelling and the ledger predicate, never a swap. A settlement the stressor spelling calls occupied is STILL occupied when the flag is lit, so no coup that is blocked today becomes reachable. This is what makes the widening safe to light mid-campaign: it can refuse births that used to happen, and it can never resurrect one that did not.',
        check: 'Expressible from source and asserted that way, plus behaviourally: tests/domain/foreignSeatResolver.test.js drives the gate over the four-cell matrix (neither / ledger-only / stressor-only / both) at both flag states and asserts the lit column is a superset of the dark column, with the stressor-only cell blocked in BOTH.',
      }),
      Object.freeze({
        name: 'the_seat_is_derived_and_never_persisted',
        description: 'ZERO persisted state (law 2.2, on the hegemonyRead template). `foreignSeatOf` reads three ledgers other subsystems own and writes none of them; it holds no cache, mints no id, and creates no key anywhere. The single persisted field the design allows — the CHOSEN posture, Q-S2 GRANTED — is a SEAT-3 field on the existing occupations record and is deliberately absent from this car, so nothing in SEAT-1 can put a byte on disk whether the flag is lit or dark.',
        check: 'Expressible from source, and asserted that way in tests/domain/foreignSeatResolver.test.js: the leaf\'s source contains no assignment into `worldState`, no `setSpatialLedger`, no `Math.random`, and no `Date`; and behaviourally, that a lit resolver call over a frozen world returns the same view twice and leaves the input serializing identically.',
      }),
      Object.freeze({
        name: 'one_resolver_per_quantity',
        description: 'The resolver collapse this car owes (law 2.1). `vassalOverlordOf` existed TWICE under one name over two substrates with two argument shapes — an edge-walking snapshot reader in occupation.js (a dead export, measured zero callers tree-wide) and a ledger reader in traditions/relations.js (module-private, two live callers). The ledger question now has exactly one exported home and relations.js consumes it; the edge question was never a separate public quantity and lives as one arm of foreignSeatOf. GRIP_SCALE is likewise kept distinct from occupation\'s STATE_BENEFIT_SCALE rather than shared, because a shared numeric table with two meanings is the 711.6 failure by construction.',
        check: 'Expressible from source, and asserted that way in tests/domain/foreignSeatResolver.test.js: exactly one exported `vassalOverlordOf` exists under src/, its output equals the pre-collapse relations.js semantics over a matrix of rungs including the absent record and the non-vassalized rungs, and the leaf\'s mirrored OCCUPATION_RUNGS equals occupation.js\'s own STATE_LADDER so the second spelling can never drift.',
      }),
    ]),
    // No channel at all, so the row can never be graded ALIVE from a receipt and says so.
    // UNOBSERVED for this lane's standing reason — the soak builds its rules from the
    // full_simulation spread, which declares no virtual key — and for a second reason of
    // its own: the lit behaviour at this car is a gate REFUSAL, which leaves no receipt
    // row even on a lit run. The observation window belongs to SEAT-2a, where the seat
    // first moves a decision that receipts.
    soakEvidence: 'unobserved',
  }),
]);
