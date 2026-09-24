/**
 * subsystemRowsVirtual.js — SUBSYSTEM CERTIFICATION ROWS for the ENGINE-GATED
 * VIRTUAL cohort: the dark subsystem layers the census could not see at all until
 * chair ruling CR-WR10-C (2026-08-04) taught it to enumerate them.
 *
 * WHY THESE ARE ONE LANE RATHER THAN SCATTERED ACROSS THE SUBJECT LANES. The
 * estate's lanes are organised by SUBJECT (war, place, people), and by that rule
 * these keys would scatter across most of them. They are read together anyway,
 * because they share ONE FINDING and it is not a subject: each is gated by the
 * strict `rules.<key> === true` idiom while appearing in NEITHER
 * `DEFAULT_SIMULATION_RULES` NOR any preset override spread, which is the
 * deep-couplings law-1 dormancy idiom — the dark layer that costs a campaign zero
 * persisted bytes. `simulationRuleKeys()` read exactly those two surfaces, so for
 * as long as the idiom has existed, a subsystem could enter the engine, be gated,
 * be shipped, and never be asked whether it does anything. That is the exact class
 * tests/lint/subsystemCertificationTotality.walker.test.js exists to remove, and
 * these keys were standing inside its blind spot. The rows belong together because
 * the next reader's question about all of them is the same question.
 *
 * CONSEQUENCE FOR EVERY ROW IN THIS LANE, stated once: no soak receipt in the
 * corpus can grade any of them ALIVE or SILENT. scripts/audit/whole-world-soak.mjs
 * builds its rules from the `full_simulation` preset spread, which by construction
 * declares none of these keys, so the evaluator resolves each row's ruleState to
 * `unknown` and grades UNOBSERVED. That is the honest verdict — the run was never
 * asked to light the layer — and it is what these rows will read until the owner
 * lights a flag at THE ONE REGEN or a harness declares one. It is NOT the same
 * thing as DORMANT_BY_CONFIG, which claims the receipt RECORDED the key off, and
 * no receipt records a key nothing writes.
 *
 * See subsystemRowsWaves.js for the lane split rationale, the add-a-row protocol,
 * and THE EVIDENCE LAW (every declared eventType is traceable to a `candidateType`
 * literal in source; every declared stateKey is a container the v5 census reads and
 * this subsystem owns). Both are binding here and in every leaf below.
 *
 * ── ⛔ THIS FILE IS NOW A COMPOSITION, AND THE ORDER IS THE CONTRACT ────────
 *
 * TE-VIRT-1 (ODQ §868, narrowed by §870.4) decomposed this lane after it reached
 * 800 of 800 EFFECTIVE lines against its layer's `max-lines` ceiling with ZERO
 * headroom — W-MEM's row having taken "the ceiling's LAST seat" at the T12 landing
 * and been compressed to fit it. An honest certification row costs 25-40 effective
 * lines here, so no further virtual flag could land estate-wide until this landed.
 *
 * `VIRTUAL_SUBSYSTEM_ROWS` REMAINS THE ONE EXPORT every consumer, walker and
 * bijection reads; no leaf joins subsystemCertification.js's import list, so the
 * composition, the totality audit and the ordered rule-name contract are untouched
 * and no other lane's surface moved. THE DECOMPOSITION IS BYTE-NEUTRAL: the
 * composed SUBSYSTEM_CERTIFICATION_REGISTRY serializes identically across it.
 *
 * ⛔ EVERY LEAF CARRIES A CONTIGUOUS BLOCK, SPREAD BACK AT ITS OWN POSITION, and
 * that is a hard constraint rather than a style. tests/domain/subsystemRowsVirtual
 * .test.js asserts an EXACT ORDERED EQUALITY of `VIRTUAL_SUBSYSTEM_ROWS.map(r =>
 * r.rule)` against its mirrored `VIRTUAL_RULES`, and subsystemCertification.js
 * composes the lanes in order — so a row's INDEX is a certification output. This
 * file is in AUTHORING order and its design volumes genuinely interleave (ES at 2,
 * WR at 9 and 15, GR at 13, 14, 16 and 20), so the BODY can only be cut into
 * blocks. Family leaves are possible exactly at the TAIL, where authoring order
 * and family order finally coincide, and that is where they are.
 *
 *   subsystemRowsBelief.js    rows 1-8    BLOCK   the believed world + its intents
 *   (rows 9-12 stay here)                         conquest / habit / statecraft / rumors
 *   subsystemRowsCompact.js   rows 13-20  BLOCK   the compact grammar + 2 neighbours
 *   (rows 21-25 stay here)                        WC-0E pair / epoch / faith / undercity
 *   subsystemRowsCoin.js      row 26      FAMILY  W-COIN
 *   subsystemRowsSeat.js      row 27      FAMILY  W-SEAT (SEAT-1's original leaf)
 *   subsystemRowsMemory.js    row 28      FAMILY  W-MEM
 *   subsystemRowsLives.js     (empty)     HOME    W-LIVES's waiting doors
 *   subsystemRowsOps.js       (empty)     HOME    W-OPS's waiting doors
 *
 * TO ADD A ROW: the key must be in `ENGINE_GATED_VIRTUAL_RULE_KEYS`
 * (worldPulse/simulationRules.js) — that manifest is what puts it in the census in
 * the first place, and tests/lint/engineGatedRuleKeys.walker.test.js proves the
 * manifest against the tree in both directions. The key, its first by-name
 * `=== true` gate read and its row are ONE COMMIT (ODQ §49 ruling 3, CR-WR10-C
 * item 4). ⭐ PUT THE ROW IN ITS FAMILY'S TAIL LEAF, or append it at the tail of
 * the array below if its family has none — an append at the tail shifts no
 * existing row's index and therefore moves no certification output, while a row
 * inserted into a BODY leaf shifts every row after it and owes that bill out loud
 * (ODQ §864's ordinal seat-theft is exactly this shape, caught late). Then pay the
 * three module-scope edits in tests/domain/subsystemRowsVirtual.test.js: the key
 * const, the `VIRTUAL_RULES` member IN POSITION, and the `LANE_LEAVES` entry.
 * A key that later earns a preset declaration LEAVES the manifest and its row moves
 * to the subject lane; nothing about the row itself changes.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/lint/engineGatedRuleKeys.walker.test.js,
 *   tests/domain/subsystemRowsVirtual.test.js
 */

import { BELIEF_SUBSYSTEM_ROWS } from './subsystemRowsBelief.js';
import { COIN_SUBSYSTEM_ROWS } from './subsystemRowsCoin.js';
import { COMPACT_SUBSYSTEM_ROWS } from './subsystemRowsCompact.js';
import { ENCOUNTERS_SUBSYSTEM_ROWS } from './subsystemRowsEncounters.js';
import { LIVES_SUBSYSTEM_ROWS } from './subsystemRowsLives.js';
import { MEMORY_SUBSYSTEM_ROWS } from './subsystemRowsMemory.js';
import { OPS_SUBSYSTEM_ROWS } from './subsystemRowsOps.js';
import { SEAT_SUBSYSTEM_ROWS } from './subsystemRowsSeat.js';

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The engine-gated virtual lane's rows, composed from this file's own rows and
 * the family and block leaves. THE ORDER IS THE CONTRACT.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const VIRTUAL_SUBSYSTEM_ROWS = Object.freeze([
  // ── ROWS 1-8 · THE BELIEVED WORLD, AND THE INTENTS THAT RIDE IT ────────────
  // A BLOCK cut, not a family cut: the row order below is an exact certification
  // output (see the header), so every leaf carries a CONTIGUOUS run spread back at
  // its own position. See subsystemRowsBelief.js for what these eight share.
  ...BELIEF_SUBSYSTEM_ROWS,
  // ── THE CONQUEST DOCTRINE (WR-8 amendment R2, the vengeance license) ───────
  Object.freeze({
    rule: 'conquestDoctrineEnabled',
    title: 'Conquest doctrine (the vengeance license)',
    module: 'src/domain/worldPulse/conquestDoctrineStage.js,src/domain/worldPulse/vengeanceLicense.js,src/domain/worldPulse/razingExecution.js,src/domain/worldPulse/occupation.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY per the evidence law: there is no `candidateType` literal
      // anywhere in the doctrine lane. Razing rides the war layer's existing
      // vocabulary, and the license is a RECORD rather than an event.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY for the reason every dark-lane row keeps it empty: the
      // lane authors no beat it owns, and `knowledge` is the contaminated residual.
      moverFamilies: Object.freeze([]),
      // The ONE channel the lane has, and it is exact: vengeanceLicense.js is the
      // SINGLE WRITER of this key (its four setSpatialLedger calls — mint, consume,
      // extinguish, prune — are the only ones for it in the tree), and no other
      // subsystem touches it, so a census reading is dispositive rather than shared.
      // Receipt-expressible only from the v5 subsystems.stateKeys census.
      stateKeys: Object.freeze(['spatialLedgers.vengeanceLicenses']),
      other: 'TWO GATES, AND THE OUTER ONE IS AN EIGHT-FLAG CONJUNCTION. vengeanceLicensesActive (vengeanceLicense.js) reads the layer own flag alone and deliberately does not duplicate the lighting order; conquestDoctrineActive (conquestDoctrineStage.js) is the composed gate the callers use, and CONQUEST_REQUIRED_RULES names all eight — warLayer, warTermination, peaceEngine, dispositionChannels, coalitionLedger, envoyDiplomacy, demographics and conquestDoctrine. So a receipt that lit this key alone would still read zero, and that is a correct reading of an absent precondition rather than a dead lane. WHAT IT DOES: a razing mints ONE license per burned settlement, naming the razer, the victim, the tick, and the victim-adequate settlements that thereby hold the right to answer it once. THE POPULATION IS AN ARTEFACT OF RARITY AND THE KEY DRAINS: a record exists only where a razing happened AND somebody relationship to the burned settlement cleared the adequacy band AND that somebody already shared a regional-graph edge with the razer (CR-WR8-A: a razing mints no edge to strangers), and pruneVengeanceLicenses DROPS each record the moment it is consumed, extinguished, or ages past its generational band, dropping the whole sub-ledger when the last one goes. That is why maxEntries rather than finalEntries is the aliveness signal for this row: a ledger that filled and drained still proves the doctrine ran, while a final reading of zero proves only that the debts were collected. A NON-OBVIOUS ZERO: a lit realm whose evil-aligned initiators never won a siege legitimately records nothing at all, which is a peaceful century rather than a broken layer. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt over a run whose rules record all eight CONQUEST_REQUIRED_RULES true and whose endings mix carries at least one punitive_sack.',
    }),
    // A razing is the rarest ending in the war layer's mix, and the license is minted
    // only from one. `rare` has no tempo floor beyond a single firing anywhere in the
    // span, which is the honest expectation for this lane.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_ledger_is_gated',
        description: 'Dark means the key never materializes: no writer in the lane runs without the composed conquestDoctrineActive gate above it, so a dark world serializes byte-identically to the pre-WR8 engine.',
        check: 'In any v5 receipt whose subsystems.rules records conquestDoctrineEnabled false or omits it, subsystems.stateKeys does not carry spatialLedgers.vengeanceLicenses. Expressible from the v5 subsystems section alone, with no behavioral evidence at all.',
      }),
      Object.freeze({
        name: 'one_license_per_razing_and_it_is_idempotent',
        description: 'A razing replayed on the same tick mints no second license and does not widen the first one holders behind the world back: the mint keys on razer, victim and tick, and returns the world UNCHANGED when that id already exists.',
        check: 'NOT expressible from a receipt: the census counts entries, never their ids. Pinned at the writer in tests/domain/vengeanceLicenseWr8.test.js, where a replayed razing leaves the ledger byte-identical.',
      }),
      Object.freeze({
        name: 'the_ledger_drains_rather_than_accumulates',
        description: 'The license is CONSUMED on use, extinguished when the razer is itself answered, and pruned past its generational band. A ledger that only ever grew would mean the consume and prune paths stopped running and every grievance became permanent, which is the opposite of the amendment design.',
        check: 'For any receipt whose census carries spatialLedgers.vengeanceLicenses across at least thirty observed years, either maxEntries is strictly greater than finalEntries, or the key years count is below the receipt observedYears. Expressible from the v5 stateKeys census plus the receipt observedYears.',
      }),
    ]),
    // The dispositive channel exists and is exact, but it is instrumented ONLY by the
    // v5 census and no completed case could have lit an eight-flag conjunction whose
    // eighth member no preset declares. `indirect`, not `unobserved`: the channel is
    // real and readable the day such a receipt exists.
    soakEvidence: 'indirect',
  }),
  // ── HABIT CONDITIONING (HB-2, docs/DESIGN_FP_ARCH_HB.md §4) ────────────────
  // AUTHORED, NEVER PENDING. This wave's home cohort is the ENGINE-GATED VIRTUAL one and
  // that cohort's pending array measures empty, so there is nowhere to defer to; direction 3
  // of the engine-gated walker exists because "manifested here, pending elsewhere" once
  // shipped a red.
  Object.freeze({
    rule: 'habitConditioningEnabled',
    title: 'Habit conditioning (the learned-contrast sub-ledger)',
    module: 'src/domain/worldPulse/habit/habitLedger.js,src/domain/worldPulse/habit/habitGate.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: this wave mints no pulse candidate and composes no beat, so there
      // is no candidateType literal in it to declare.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: the lane returns no news, so it classifies into no mover family.
      moverFamilies: Object.freeze([]),
      // ONE channel, and it is REACHABLE rather than aspirational: censusWorldStateKeys walks
      // one level into spatialLedgers, so this key reports the ledger's own sub-map count.
      stateKeys: Object.freeze(['spatialLedgers.habits']),
      other: 'ONE GATE, ONE DOOR, AND NO CALLER AT THIS WAVE. habitsActive requires habitConditioningEnabled === true read BY NAME (habit/habitGate.js), which is the ONE read of this key in the tree; the by-name spelling is load-bearing rather than stylistic, because a frozen-list conjunction is a computed member access and would hide a fully wired flag from the engine-gated-key census entirely. WHAT THIS WAVE BUILDS: the sub-ledger that STORES a learned contrast, its single writer, the first door of the four-door ladder, and the registration. WHAT IT DELIBERATELY DOES NOT BUILD: anything that COMPUTES a habit, DECIDES with one, or CLASSIFIES a circumstance - the class arrives as an argument, and the classifier has no lawful home yet, which is a blocking question for HB-4 rather than a gap here. THE LEDGER IS DROP-WHEN-NEUTRAL AT FOUR LEVELS - the neutral row, the emptied class, the emptied actor, and finally the whole sub-ledger, which drops the spatialLedgers namespace with it when it was the last one - so an emptied world stays byte-identical to a dormant one and this census reads real adoption rather than a materialized container. THE WRITER IS UNCALLED BY DESIGN: writeHabits exists and nothing under src calls it, so the count is structurally zero on every generated world at this wave, and that is the wave identity claim rather than a blind spot. TWO DETERMINISTIC EVICTIONS bound it: rows evict nearest-neutral against the per-actor cap and the pledge book evicts oldest-first against its own, each with a codepoint tiebreak, because consulting insertion order would break replay in an engine whose whole contract is that a seed reproduces. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt whose subsystems.stateKeys census carries spatialLedgers.habits, which requires both a preset that lights the flag and the credit fold that HB-3 adds to supply a caller.',
    }),
    // No caller is wired, so nothing runs on any tick. REACTIVE rather than per_tick is the
    // honest reading even once HB-3 supplies one: a habit row is written only when an episode
    // actually closes and grades, never on a bare pulse.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_ledger_is_gated',
        description: 'writeHabits returns its INPUT worldState reference before touching any ledger when the gate is dark, so the key cannot materialize behind a dark switch and a dark world is byte-identical. The gate returns before any allocation, which is what makes setSpatialLedger - the call that CREATES the namespace - unreachable rather than merely unused.',
        check: 'In any v5 receipt whose subsystems.rules records habitConditioningEnabled false or omits it, subsystems.stateKeys carries no spatialLedgers.habits. Expressible from the v5 subsystems section alone.',
      }),
      Object.freeze({
        name: 'aliveness_reads_the_high-water_mark',
        description: 'A ledger that filled and then drained still proves the doctrine ran, so aliveness is judged on maxEntries rather than finalEntries - the vengeanceLicenses precedent. Drop-when-neutral means a court that learned a contrast and then forgot it back to neutral leaves NO final entry at all, so a final-entries reading would grade a lane that genuinely fired as dead.',
        check: 'For a receipt whose census carries spatialLedgers.habits, maxEntries is greater than zero even where finalEntries is zero. Expressible from the v5 stateKeys census.',
      }),
    ]),
    // ⛔ `indirect`, NOT `unobserved`, and the instrument itself ruled the distinction: a row
    // that DECLARES a channel and still calls the soak blind to it converts a real SILENT into
    // an instrument GAP, and that population is ceilinged at five — *"give the new row a channel
    // the receipt can read, or accept SILENT; do not raise this ceiling."* This row declares
    // `spatialLedgers.habits`, and that channel is REAL and READABLE the day a receipt exists:
    // censusWorldStateKeys walks one level into spatialLedgers, so nothing about the reading is
    // hypothetical — it waits on a preset lighting the flag and on HB-3 supplying a caller, not
    // on an instrument that cannot see. The espionage row above carries the identical sentence
    // for the identical reason.
    soakEvidence: 'indirect',
  }),
  // ── INFORMATION STATECRAFT (D-3, docs/DESIGN_DEEP_COUPLINGS.md) ────────────
  Object.freeze({
    rule: 'infoStatecraftEnabled',
    title: 'Information statecraft (secrecy, sight, lies, credibility)',
    module: 'src/domain/worldPulse/informationStatecraft.js,src/domain/worldPulse/brokerageStamps.js,src/domain/worldPulse/generosityKernel.js,src/domain/worldPulse/npcCredibility.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY per the evidence law: the lane returns newsEntries from a
      // pure advance and mints no pulse candidate, so there is no `candidateType`
      // literal in it to declare.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: the beats this lane returns classify into `knowledge`,
      // the contaminated residual bucket, which can never carry ALIVE for one row.
      moverFamilies: Object.freeze([]),
      // FOUR channels, and every one is exact: informationStatecraft.js is the SINGLE
      // WRITER of each of these keys in the tree, and advanceInformationStatecraft
      // early-returns on a dark gate before any of them can be touched, so a census
      // reading is dispositive rather than shared. spatialLedgers.beliefMaps is
      // DELIBERATELY NOT DECLARED even though the lie lifecycle writes overrides into
      // it: the beliefs layer owns and populates that container behind its own gate,
      // so claiming it would grade this row alive off another subsystem presence.
      stateKeys: Object.freeze([
        'spatialLedgers.credibility',
        'spatialLedgers.disinfo',
        'spatialLedgers.secrecyPostures',
        'spatialLedgers.sightPostures',
      ]),
      other: 'ONE GATE COMPOSED WITH A SPATIAL PRECONDITION. infoStatecraftActive is beliefsActive (a spatial canon marker present AND infoMode is not omniscient) AND the virtual infoStatecraftEnabled, so an aspatial or omniscient realm reads zero however the flag is set, and that is an absent precondition rather than a dead lane. WHAT IT DOES, in the four movers the gate opens: HIDE (a court chooses a secrecy posture over what it knows), SEE (a rival exposure read against the PRIOR secrecy, so the two are order-independent), THE LIE LIFECYCLE (a plant injected into the target belief map, aged and eventually exposed), and CREDIBILITY AS A STOCK (a signed saturating per-settlement weight consumed by the existing corroboration math, rising slowly on proven-true information and falling sharply on exposed deception, regressed on a generational half-life). EVERY LEDGER IS DROP-WHEN-EMPTY: each of the four is written only when its serialized shape actually changed and is DROPPED rather than written empty, so the census reads real adoption rather than a materialized container. TWO CONJOINED SUB-LANES ride the same flag and are legible only through it: brokerageStamps requires infoStatecraftEnabled AND informationBrokeragesEnabled, and the generosity intel consume requires it alongside intelTradeEnabled and beliefsActive. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt over a spatially canonized realm whose infoMode is not omniscient and whose rules record infoStatecraftEnabled true.',
    }),
    // advanceInformationStatecraft runs every pulse once the gate is open, and the
    // posture ledgers materialize in the first year a court has anything to hide.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_ledgers_are_gated',
        description: 'advanceInformationStatecraft returns its input worldState unchanged before touching any ledger when the gate is dark, so none of the four keys can materialize behind a dark switch and a dark world is byte-identical.',
        check: 'In any v5 receipt whose subsystems.rules records infoStatecraftEnabled false or omits it, subsystems.stateKeys carries none of spatialLedgers.credibility, spatialLedgers.disinfo, spatialLedgers.secrecyPostures or spatialLedgers.sightPostures. Expressible from the v5 subsystems section alone.',
      }),
      Object.freeze({
        name: 'sight_reads_the_prior_secrecy',
        description: 'The exposure pass reads the PRIOR secrecy postures rather than the ones this tick just wrote, which is what makes the hide and see movers order-independent. A same-tick read would make the whole layer sensitive to mover ordering.',
        check: 'NOT expressible from a receipt: both postures are aggregated to entry counts by the census. Pinned at the writer in tests/domain/informationStatecraft.test.js.',
      }),
      Object.freeze({
        name: 'credibility_is_asymmetric_and_prunes_to_neutral',
        description: 'Trust builds in years and dies in an afternoon: the stock rises slowly on proven-true information and falls sharply on exposed deception, and a mark that has regressed back inside the prune epsilon is DROPPED rather than persisted at approximately zero. So the ledger records live reputations, never a permanent record of every rumor a town ever repeated.',
        check: 'For any receipt whose census carries spatialLedgers.credibility, its entry count is bounded by the settlement count and does not grow monotonically across observed years. Expressible from the v5 stateKeys census plus receipt.settlements; the asymmetry itself is pinned in tests/domain/informationStatecraft.test.js.',
      }),
    ]),
    // Four exact dispositive channels, instrumented ONLY by the v5 census, and no
    // completed case carries the flag at all. `indirect` on the W-J terms.
    soakEvidence: 'indirect',
  }),
  // ── THE MIGRATION RUMOR CARRIER (D-0, docs/DESIGN_DEEP_COUPLINGS.md) ───────
  Object.freeze({
    rule: 'migrationRumorsEnabled',
    title: 'Migration rumor carrier (the refugee lane)',
    module: 'src/domain/spatial/migrationRumors.js,src/domain/worldPulse/pulseKernel.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, and this one is the sharpest trap in the lane. The
      // refugee lane DOES have a vocabulary — `migration_flight` — but it is a RUMOR
      // FEED ENTRY type, not a pulse `candidateType`, and the receipt's
      // eventTypeCounts is folded from the applied candidate records alone. Declaring
      // it would look like the best-evidenced row in this file and would in fact be
      // unreadable by every receipt the estate writes.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: the lane authors no beat of its own, and `knowledge` is
      // the contaminated residual.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. The lane assembles INPUTS to advanceRumorLedgers, which
      // is the rumor ledger single writer and which armies and smuggle runs already
      // feed on every tick regardless of this flag. Declaring the rumor containers
      // would grade this row alive off the army lane traffic.
      stateKeys: Object.freeze([]),
      other: 'THE LANE ADDS ZERO WRITERS BY DESIGN, WHICH IS ALSO WHY NO RECEIPT CAN SEE IT. ONE GATE: migrationRumorsActive is the virtual migrationRumorsEnabled alone (migrationRumors.js), read from the rules the kernel threads into pulseKernel.js `rumorCarrierParams`. WHAT IT DOES: refugee columns become the third mover-carried rumor lane beside armies and smuggle runs, so migration stops being the world only silent mover. Two products, both gated: migrantPaths (the in-flight columns origin-to-destination legs, fed into the relay fan-out so a column carries the news of the towns it crosses) and flightEntries (the columns THEMSELVES as migration_flight rumor events, seeded at the origin and destination witnesses with standard lineage, fidelity and decay). The magnitude is BANDED — a small departure, a notable displacement, an exodus — and never the exact head count, because that is rumor physics; the event key encodes origin, destination and depart tick so the D-1 demographic axis can recover the direction. LAG IS LAW: migration dispatches AFTER the rumor pass, so a column first relay lands the NEXT tick and news travels behind the column. THE PRE-DRAIN READ: the release pass drains arrived columns early, so the columns are read from the pre-drain state and a column completing its journey still carries news on its final leg. WHY EVERY CHANNEL IS EMPTY: the lane writes nothing of its own — it hands params to an existing single writer whose containers two other carriers already fill. THE OBSERVATION NEEDED to close this gap is a rumor-event-type census in the soak receipt, a per-year count of feed entries by type, which would also give the belief axes above their first readable channel. Until then the lane is pinned where its bodies are readable: tests/domain/migrationRumors.test.js.',
    }),
    // The carrier params are assembled on every pulse the rumor pass runs.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_a_null_and_an_empty_list',
        description: 'With the flag dark the assembly returns migrantPaths null and flightEntries empty, so advanceRumorLedgers behaves byte-identically to the pre-D-0 engine: the refugee lane never fires and no new feed entry seeds.',
        check: 'NOT expressible from a receipt: the rumor containers are fed by the army and smuggle carriers in the same pass, so their presence proves nothing about this lane. Pinned in tests/domain/migrationRumors.test.js against a dark-versus-lit comparison of the assembled params.',
      }),
      Object.freeze({
        name: 'the_net_never_carries_the_head_count',
        description: 'A flight event carries a BAND (departure, displacement, exodus) and never the exact number of people who left. A rumor that carried a census figure would be a truth channel wearing a rumor costume, and the whole D-0 point is that the world learns about migration the way it learns about everything else.',
        check: 'NOT expressible from a receipt: feed-entry bodies are not carried. Pinned in tests/domain/migrationRumors.test.js, where the banded classifier is driven across the two floors.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so.
    soakEvidence: 'unobserved',
  }),
  // ── ROWS 13-20 · THE COMPACT GRAMMAR (and two authoring-era neighbours) ────
  // The second block cut. Two of its eight rows — settlementPolitics and
  // underwaysOrganicFounding — ride along by AUTHORING POSITION and not by
  // subject, and the leaf's header says so rather than letting the fit be assumed.
  ...COMPACT_SUBSYSTEM_ROWS,
  // ── WC-0E · THE WAR-CIRCULATION FLAGS (docs/DESIGN_FP_ARCH_WC.md §7.A.2) ──────
  Object.freeze({
    rule: 'warCirculationEnabled',
    title: 'War circulation (the layer gate: people, columns and contributions move as one conserved population)',
    module: 'src/domain/worldPulse/contributionLedger.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, and for this wave it is not a hard call: the member lands a
      // closed vocabulary, record shapes, a fail-closed normalizer and a gate. It mints no
      // pulse candidate, so there is no `candidateType` literal to declare.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. The only BEHAVIORAL_MOVER_FAMILIES member this lane could ride
      // is `war`, which would grade the row ALIVE off the entire war layer's traffic in
      // worlds where the flag has never been true — the refusal the treaty-renewal and
      // lifecycle-voice rows above make for the same reason.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, AND HERE IT IS A MEASUREMENT RATHER THAN A JUDGEMENT: this
      // member calls setSpatialLedger ZERO times. There is no container to declare because
      // the wave writes no persisted byte at all. The warContributions ledger and its
      // TRACKED row arrive together at WC-1, with the writer.
      stateKeys: Object.freeze([]),
      other: 'THE LAYER FLAG, and it gates a lane that at this wave has no writer at all. Read by name in contributionLedger.contributionLedgerActive as one half of a conjunction with contributionLedgerEnabled: either key absent or false leaves the whole lane dark, so lighting this one alone changes nothing observable. WHAT NOTHING CAN SEE: the wave calls setSpatialLedger zero times and persists no byte, so there is no container for censusWorldStateKeys to walk and no entry count for a soak to read; the module is a closed vocabulary, four declared record fields, a fail-closed normalizer and this gate. Declaring any spatialLedgers container here would grade the row ALIVE off another subsystem entirely. THE OBSERVATION THAT WOULD CLOSE IT: WC-1 lands the writer — troops-lent credit at the levy edge, supplies credit at shipment arrival — and with it the warContributions ledger and its spatialUsage TRACKED row, at which point this row gains a real stateKeys declaration and a soak can grade it.',
    }),
    // REACTIVE, not per_tick: a contribution is an event-driven deposit — a party lends
    // troops or delivers supplies when its own war reasons move it — never a scheduled
    // fold. ⚠ `none` is not a member of SUBSYSTEM_TEMPOS; the vocabulary is closed at
    // per_tick | yearly | multi_year | rare | reactive, and the row declares the cadence
    // the lane will have WHEN LIT rather than the zero it has while dark.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_lane_is_gated_by_both_flags',
        description: 'The ledger is reachable only when BOTH keys are strictly true. Either one absent or false leaves the lane dark, so lighting one alone changes nothing.',
        check: 'Pinned in tests/domain/contributionLedgerShape.test.js, which drives each flag with a LITERAL true and asserts the gate is false for each single-flag world.',
      }),
      Object.freeze({
        name: 'nothing_is_written',
        description: 'The module calls setSpatialLedger zero times and persists no byte, which is what keeps its TRACKED row out of spatialUsage until WC-1 lands the writer.',
        check: 'Pinned in tests/domain/contributionLedgerShape.test.js by a source scan of the landed module, and enforced tree-wide by the exact-set spatialLedgerCoverage walker.',
      }),
      Object.freeze({
        name: 'the_normalizer_fails_closed',
        description: 'An unknown kind, a malformed record, a negative or non-finite amount and a missing counterparty all yield null rather than a half-shaped record surviving into a save.',
        check: 'Pinned in tests/domain/contributionLedgerShape.test.js across every refusal direction.',
      }),
    ]),
    // No channel is declared, so the row can never be ALIVE and says so. `unobserved` is the
    // honest reading: declaring a channel this wave does not own would convert a real SILENT
    // into an instrument GAP.
    soakEvidence: 'unobserved',
  }),
  // ── WC-0E · THE WAR-CIRCULATION FLAGS (docs/DESIGN_FP_ARCH_WC.md §7.A.2) ──────
  Object.freeze({
    rule: 'contributionLedgerEnabled',
    title: 'The war-contribution ledger (record shapes and their fail-closed normalizer)',
    module: 'src/domain/worldPulse/contributionLedger.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, and for this wave it is not a hard call: the member lands a
      // closed vocabulary, record shapes, a fail-closed normalizer and a gate. It mints no
      // pulse candidate, so there is no `candidateType` literal to declare.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. The only BEHAVIORAL_MOVER_FAMILIES member this lane could ride
      // is `war`, which would grade the row ALIVE off the entire war layer's traffic in
      // worlds where the flag has never been true — the refusal the treaty-renewal and
      // lifecycle-voice rows above make for the same reason.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, AND HERE IT IS A MEASUREMENT RATHER THAN A JUDGEMENT: this
      // member calls setSpatialLedger ZERO times. There is no container to declare because
      // the wave writes no persisted byte at all. The warContributions ledger and its
      // TRACKED row arrive together at WC-1, with the writer.
      stateKeys: Object.freeze([]),
      other: 'THE FEATURE FLAG, read by name beside warCirculationEnabled in the same conjunction. It gates the contribution ledger specifically, within a war-circulation layer the other key gates as a whole. WHAT IT GATES AT THIS WAVE: record shapes and their fail-closed normalizer, and nothing else — an unknown kind, a malformed record, a negative or non-finite amount and a missing counterparty each yield null rather than a half-shaped row surviving into a save. WHAT NOTHING CAN SEE: there is no writer, so no ledger key exists to declare and no census or soak can distinguish a lit world from a dark one; the exact-set spatialLedgerCoverage walker enforces that symmetry from the other side, refusing a TRACKED row for a key nothing writes. THE OBSERVATION THAT WOULD CLOSE IT: the WC-1 writer, whose first setSpatialLedger call makes warContributions a real container this row can then declare.',
    }),
    // REACTIVE, not per_tick: a contribution is an event-driven deposit — a party lends
    // troops or delivers supplies when its own war reasons move it — never a scheduled
    // fold. ⚠ `none` is not a member of SUBSYSTEM_TEMPOS; the vocabulary is closed at
    // per_tick | yearly | multi_year | rare | reactive, and the row declares the cadence
    // the lane will have WHEN LIT rather than the zero it has while dark.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_lane_is_gated_by_both_flags',
        description: 'The ledger is reachable only when BOTH keys are strictly true. Either one absent or false leaves the lane dark, so lighting one alone changes nothing.',
        check: 'Pinned in tests/domain/contributionLedgerShape.test.js, which drives each flag with a LITERAL true and asserts the gate is false for each single-flag world.',
      }),
      Object.freeze({
        name: 'nothing_is_written',
        description: 'The module calls setSpatialLedger zero times and persists no byte, which is what keeps its TRACKED row out of spatialUsage until WC-1 lands the writer.',
        check: 'Pinned in tests/domain/contributionLedgerShape.test.js by a source scan of the landed module, and enforced tree-wide by the exact-set spatialLedgerCoverage walker.',
      }),
      Object.freeze({
        name: 'the_normalizer_fails_closed',
        description: 'An unknown kind, a malformed record, a negative or non-finite amount and a missing counterparty all yield null rather than a half-shaped record surviving into a save.',
        check: 'Pinned in tests/domain/contributionLedgerShape.test.js across every refusal direction.',
      }),
    ]),
    // No channel is declared, so the row can never be ALIVE and says so. `unobserved` is the
    // honest reading: declaring a channel this wave does not own would convert a real SILENT
    // into an instrument GAP.
    soakEvidence: 'unobserved',
  }),
  // ── EP-1 · THE ADVANCE EPOCH (docs/DESIGN_FP_ARCH_EP.md §2, §3a, §3b.1) ──────
  Object.freeze({
    rule: 'advanceEpochEnabled',
    title: 'The advance epoch (a per-advance nonce on the pulse root, so a re-advanced world draws a genuinely new future)',
    module: 'src/kernel/prng.js, src/domain/clock.js, src/domain/worldPulse/pulseKernel.js, src/store/campaignAdvanceSession.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, and here it is a measurement rather than a judgement: this
      // member mints no pulse candidate at all. It appends a SEGMENT to a seed string.
      // The lane's own leaves (prng.js, clock.js) contain no `candidateType` literal,
      // which the virtual lane's zero-candidate trace re-measures from source.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. The only BEHAVIORAL_MOVER_FAMILIES member this lane could
      // ride is the whole pulse, which would grade the row ALIVE off every advance in
      // every world where the flag has never been true — the refusal every row in this
      // cohort makes for the same reason.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY AND MEASURED: EP-1 calls setSpatialLedger ZERO times. Its one
      // materialization is a conditional TOP-LEVEL SCALAR on the pulse-history record
      // (`epoch`), which is not a spatialLedgers container and which no receipt walks.
      // The ledger container arrives at EP-3 with its writer, and the row gains a real
      // stateKeys declaration then. Declaring one now would grade this row off another
      // subsystem's container entirely.
      stateKeys: Object.freeze([]),
      other: 'THE STREAM-IDENTITY GATE. Lit, the store mints one nonce per USER ADVANCE and the kernel appends it to the pulse root as a new `::epoch:<nonce>` segment, so a world advanced again from the same tick draws a genuinely different future instead of replaying the one its seed already determined. THE GATE IS READ TWICE AND BOTH READS ARE REQUIRED: the store mint is gated so no epoch value comes into existence in a dark world, and the kernel re-reads the flag beside the value so a value that outlived a flag flip on the PERSISTED pause cursor cannot be used. Gating only the mint leaves a live path to the flag-dark/value-present cell — an advance pauses lit, the rule goes dark, the resume re-threads the parked epoch — and that cell is the one dark byte-identity has to close. DARK IS BYTE-IDENTICAL BY CONSTRUCTION, NOT BY PARITY ARGUMENT: `epochSuffix(null)` returns the empty string and `x + \'\' === x`, so a flag-absent or legacy world composes the pre-wave seed character-for-character; the seam moves the seed VALUE only and never a control-flow branch, so the number and ORDER of rng draws is identical in both flag states. WHAT NOTHING CAN SEE: no preset declares this key, so a soak receipt carries no entry for it and the row can only ever grade UNOBSERVED; the member writes no persisted container, so there is nothing for censusWorldStateKeys to walk; and the `epoch` field on the pulse record is materialized CONDITIONALLY on the flag-gated term, so a dark world serializes no new key and no census can distinguish it from a pre-wave one. THE OBSERVATION THAT WOULD CLOSE IT: EP-3 lands the ledger writer and its spatialLedgers.advanceEpoch container, at which point this row gains a real stateKeys declaration and a soak can grade it; until then the falsifiable claims are the four pinned below.',
    }),
    // PER_TICK is the cadence of the SEAM, not of the mint: the segment is composed on
    // every kernel pass. The nonce itself is minted once per user advance (§1.5) — a
    // per-tick nonce would be destroyed by the interval collapse, which keeps ONE record.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_byte_identical_per_advance_path',
        description: 'With the flag absent or false the composed stream identity string is character-for-character the pre-wave string, on the single-tick path and on the multi-tick composed path INDEPENDENTLY. The claim is never made ACROSS paths, because advanceMultiTick already forks the interval term and always has.',
        check: 'Pinned in tests/property/advanceEpochDormancyFence.test.js by fence 1, which drives the real kernel over four rule configurations and BOTH value states and asserts the literal legacy seed captured through a pass-through createPRNG spy.',
      }),
      Object.freeze({
        name: 'the_contract_is_flag_driven_not_value_driven',
        description: 'A real epoch value arriving at the kernel in a flag-dark world changes nothing: neither the seed string nor the serialized key set. This is the cell a mint-only gate leaves open, and the persisted pause cursor is a live path to it.',
        check: 'Pinned in tests/property/advanceEpochDormancyFence.test.js by fence 1\'s value-present column and by fence 5, and proven non-vacuous by an executed mutant that deletes the kernel flag read and must RED.',
      }),
      Object.freeze({
        name: 'draw_count_and_order_are_identical_in_both_flag_states',
        description: 'The seam moves the root seed VALUE and introduces no branch, so a lit advance draws the same NUMBER of forks in the same ORDER from a different stream. Fork labels are not unique in the kernel, so the comparison is over the ordered SEQUENCE and never a set.',
        check: 'Pinned in tests/domain/advanceEpochForkParity.test.js, which instruments createPRNG at its src/kernel/prng.js home with a strict pass-through spy and compares the ordered fork-label sequence lit against dark.',
      }),
      Object.freeze({
        name: 'the_recorded_field_is_conditional_and_keys_on_the_gated_term',
        description: 'The pulse record gains an `epoch` key only when the flag-gated term is truthy, so a dark or legacy world serializes exactly the key set it serialized before this wave. A materialization keyed on the raw threaded value would leave the stream perfectly dark and still write a brand-new key into a flag-dark world.',
        check: 'Pinned in tests/property/advanceEpochDormancyFence.test.js by an Object.keys comparison of the record in both value states, with an executed mutant that re-keys the spread onto the raw argument and must RED.',
      }),
    ]),
    // No channel is declared, so the row can never be ALIVE and says so. `unobserved` is
    // the honest reading and the only lawful one: a row that observes nothing must say so.
    soakEvidence: 'unobserved',
  }),
  // ── WF-1a · THE TYPED PATRON FALL (docs/DESIGN_FP_ARCH_WF.md §2, §3, §4-WF-1) ────
  Object.freeze({
    rule: 'faithUnseatingEnabled',
    title: 'The typed patron fall (a settlement records WHICH creed lost its patron seat, and by which of four believer-side causes)',
    module: 'src/domain/worldPulse/patronFall.js, src/domain/worldPulse/religiousContest.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY AND MEASURED: this member mints no pulse candidate at all. The
      // fall is a persisted RECORD, not a beat — the receipt, the Herald desk kind and the
      // Chronicle row are WF-1b's and WF-1d's, and declaring an eventType here would grade
      // this row off another wave's vocabulary. The lane leaf contains no `candidateType`
      // literal, which the virtual lane's zero-candidate trace re-measures from source.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. The only BEHAVIORAL_MOVER_FAMILIES member this lane could ride
      // is the whole pulse, which would grade the row ALIVE off every advance in every world
      // where the flag has never been true — the refusal every row in this cohort makes.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY AND MEASURED: WF-1a calls setSpatialLedger ZERO times. Its one
      // materialization is a CONDITIONAL array on a per-settlement religion state
      // (`religionStates[cid].patronFalls`), which is not a spatialLedgers container and
      // which the v5 census does not walk. Declaring a stateKey now would grade this row
      // off a container another subsystem owns.
      stateKeys: Object.freeze([]),
      other: 'THE UNSEATING RECORD. Today a settlement\'s patron creed changes hands and nothing survives the tick: the fold mints a conversion outcome whose `cause` is a two-token `occupation | contest` literal and then discards it, so a world can lose the same faith five times and remember none of them. Lit, every patron displacement appends one `{ ref, cause, atTick }` record to a capped ring on the settlement\'s own religion state, `cause` drawn from a CLOSED FOUR-TOKEN vocabulary whose every arm has a measured producer: `imposed` (a garrison flip, or the DM\'s SET_PRIMARY_DEITY re-assign), `suppressed` (the seat evicted by force at attemptEntry\'s gate), `discredited` (resolvePatronContest owned the seat — the schism and legitimacy-floor road), and `displaced` (the organic share flip past PATRON_FLIP_MARGIN sustained for PATRON_FLIP_TICKS). PRECEDENCE IS TOTAL AND FIRST-MATCH-WINS in that order, because the arms genuinely overlap. THE DOCTRINE IS LOAD-BEARING RATHER THAN DECORATIVE: every token names a BELIEVER-SIDE or POLITICAL act, so the record says what the faithful and their rulers did and never what a god did; there is no free text in it and no deity is minted or read from any catalogue. A FIFTH CHARTERED TOKEN WAS CUT ON A MEASUREMENT: `abandoned` — the sink crossing — has ZERO producers, because applyUnaffiliatedSink touches `state.patronRef` on no path, `none` is a scalar that can never hold the seat, and the sink runs AFTER the seat is decided, so a settlement secularizes to the SINK_MAX ceiling with its patron still seated. DARK IS BYTE-IDENTICAL BY CONSTRUCTION, AND TWICE OVER: the one gate is read by name at the single classify-and-record block, and that block sits behind the LOCAL-lane data gate `isSubsystemActive(snapshot, "religion")` which returns before any fork or mint, so a deity-free world is unchanged even with the key lit. WHAT NOTHING CAN SEE: no preset declares this key, so a soak receipt carries no entry for it and this row can only ever grade UNOBSERVED; the ring is materialized CONDITIONALLY on a real fall, so a dark world serializes no new key and no census can distinguish it from a pre-wave one; and NOTHING IN PRODUCTION READ THE RING AT THE WAVE THAT WROTE IT — the producer-first shape, stated rather than hidden; WF-1E has since landed the first reader, the settlement faith panel\'s cause-chain sentence, itself fenced on this same flag AND on a real fall, so a dark world still serializes and renders nothing. THE OBSERVATION THAT WOULD CLOSE IT: WF-1d has LANDED the war-dissolution join that consumes `fallCauseFor`, and §309 re-filed the settlement obituary beat out of WF-1b and into WF-8, so it is that member\'s landing which would let a receipt grade the layer; until then the falsifiable claims are the two pinned below.',
    }),
    // PER_TICK is the cadence of the GATE, not of the record: the block is evaluated on
    // every settlement on every pass. A fall itself is rare by construction — the flip
    // buffer requires a sustained lead — and a rare writer is not a slow one.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_ring_key_is_conditional_and_the_vocabulary_is_closed',
        description: 'A settlement that never lost a patron carries NO patronFalls key — absent, never null, never an empty array, because an empty array is a key and a key is a byte in every save, undo snapshot and same-seed hash. The one writer refuses any cause outside the four-token frozen vocabulary, so a caller cannot widen it by passing a string.',
        check: 'Pinned in tests/domain/patronFall.test.js by the absence arm, which compares the serialized key set on a deity-bearing fixture that never fell, and by the closed-vocabulary arm that asserts exactly four members with `abandoned` absent.',
      }),
      Object.freeze({
        name: 'the_outgoing_seat_is_read_before_the_dm_reassign_writes_it',
        description: 'The classifier keys on the patron as it stood in the PRIOR tick\'s state, captured before ensureReligionState runs. Keying it on the fold\'s existing `prevPatron` — read after that call — is blind to the DM flip, because the re-assign branch has already written state.patronRef by then, so a SET_PRIMARY_DEITY imposition would record no fall at all while every other arm stayed green.',
        check: 'Pinned in tests/domain/patronFall.test.js by the DM-regression arm, and proven non-vacuous by an executed mutant that re-keys the classifier onto prevPatron and must RED that arm alone.',
      }),
    ]),
    // No channel is declared, so the row can never be ALIVE and says so. `unobserved` is
    // the honest reading and the only lawful one: a row that observes nothing must say so.
    soakEvidence: 'unobserved',
  }),
  // ── THE VERTICAL HIGH-WATER MARK (MF-UC4, draft-UNDERCITY-PLAN.md §4 UC-4) ──
  // AUTHORED, NEVER PENDING. This lane's pending array is empty, so there is nowhere to defer
  // to, and manifesting is itself the act that makes a virtual key censusable.
  Object.freeze({
    rule: 'undercityHighWaterEnabled',
    title: 'The vertical high-water mark (a syndicate remembers its strongest year)',
    module: 'src/domain/undercity/colonization.js,src/domain/worldPulse/factionCompetition.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: this wave mints no pulse candidate and composes no beat, so there
      // is no `candidateType` literal in it to declare. The undercity leaf is a pure deriver
      // and the seam is a field fold — neither produces an event.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY. BEHAVIORAL_MOVER_FAMILIES is a closed vocabulary of BEHAVIOURAL
      // families and the only member this fold could ride is the faction layer's own, which
      // would grade this row ALIVE off every faction advance in worlds where the flag has
      // never been true. The treaty-renewal row above refuses the same temptation identically.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, AND THE REASON IS THE SHARP ONE. The field is written INSIDE a
      // faction record under `worldState.factionStates` and projected onto a settlement's own
      // power roster — both containers the faction competition layer fills in every world where
      // this flag has never been true, so declaring either would grade this row ALIVE off
      // somebody else's writes. There is no per-field channel to declare, so the row declares
      // nothing rather than a container it does not own.
      stateKeys: Object.freeze([]),
      other: 'ONE GATE, ONE WRITE SITE, AND ONE READER, ALL IN THIS WAVE. undercityHighWaterActive (undercity/colonization.js) reads undercityHighWaterEnabled by name with the strict === true idiom and it is the ONE read of this key in the tree; the by-name spelling is load-bearing rather than stylistic, because a frozen-list conjunction is a computed member access and would hide a fully wired flag from the engine-gated-key census entirely. WHAT THIS WAVE BUILDS: one conditional, monotone, drop-when-absent field, powerHighWater, folded at the single site in factionCompetition.ensureFactionStates that already walks every settlement roster entry every advance, plus the projection that carries the mark onto the settlement power roster beside the capture rung, the reader that resolves absence to null, and the undercity deriver that turns a fall from the mark into dated fossils. WHY IT EXISTS: faction power is renormalized from the roster on every advance, so a syndicate that ruled a town for a decade and was broken last year reads, on the parchment, as a syndicate that never ruled — and the undercity doctrine (ODQ §311.3) says the opposite about the ground: use recedes, dug space never does. A recession cannot be measured against a peak the estate does not keep, which is the whole of the §359.5 persisted-signal finding, first built here. WHAT IT DELIBERATELY DOES NOT BUILD: no catalog row, no institution, no candidate, no news kind, no Herald desk, no dossier surface, no store verb and no payload grammar, no geometry of any kind, and no default lighting — lighting this key in DEFAULT_SIMULATION_RULES is same-seed pulse motion and is docketed to the owner as R-5. THE MARK IS OBSERVED, NEVER TRUE: its source is the roster power the pulse itself renormalized, so a syndicate whose strength no advance ever saw leaves no mark. IT IS MONOTONE AND HAS NO CLEARER: it moves up and never down, and no code path deletes it. THE FOLD RECORDS HISTORY SINCE LIGHTING and says so rather than implying it — a faction state minted in the same pass takes its first mark on the next one, and a record written before this wave carries no key and is never backfilled. THE DARK PATH IS PINNED AS AN ABSENCE, NOT AS A ZERO: with the flag absent the reader answers null and the deriver returns an EMPTY fossil list, which is the honest reading (no instrument) rather than the quiet lie (no recession) — the content train is forbidden to ground a sentence in that empty list. WHAT WOULD BE NEEDED TO OBSERVE IT DISPOSITIVELY: a v5 receipt carrying a per-faction power-history distribution, which no census reads today.',
    }),
    // The fold sits inside ensureFactionStates, which the pulse runs every tick over every
    // settlement's factions — so when the flag is lit the write site is REACHED per tick, even
    // though the VALUE moves rarely and only ever upward.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'the_mark_is_gated_and_a_dark_world_gains_no_key',
        description: 'With the flag absent or false the fold expression is never evaluated — not merely harmless but unreached — so no faction state gains the key, the projection materializes nothing onto the roster, and a dark advance is byte-identical to the pre-UC4 engine. Drop-when-absent means the key is never written as null and never backfilled onto a legacy record.',
        check: 'NOT expressible from a receipt: no census reads per-faction fields. Pinned in tests/domain/undercityColonization.test.js by a dark-versus-lit differential driven through the REAL ensureFactionStates, with the dark arm asserting the serialized state is unchanged and the lit arm asserting the key appears.',
      }),
      Object.freeze({
        name: 'the_fold_is_monotone_and_the_reader_reports_absence',
        description: 'The mark moves UP and never down: a syndicate that rises and then falls keeps the rise. And an unmarked record answers null rather than zero — zero would assert that the syndicate was always powerless, which is a claim the instrument has not made. The distinction is what makes the dark-path fossil list an honest empty rather than a vacuous fence.',
        check: 'NOT expressible from a receipt. Pinned in tests/domain/undercityColonization.test.js over TWO advances driven through the real seam, feeding the first advance\'s own output world back in — a single-advance harness cannot tell a memory from a level — plus a null-versus-zero arm on an unmarked roster.',
      }),
      Object.freeze({
        name: 'the_criminal_share_is_consumed_and_never_re_weighted',
        description: 'The colonization driver `criminalShare` IS corruption.js\'s own reading of the stored profile, imported rather than recomputed, so the undercity and the corruption layer can never disagree about how criminal a town is. A parallel weighting would have minted a second truth for the one driver the doctrine names.',
        check: 'NOT expressible from a receipt: no census carries the criminal share. Pinned in tests/domain/undercityColonization.test.js by an equality arm that drives readCorruptionClimate and the deriver over the same profiles, including both precedence branches and the unset default.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so honestly.
    soakEvidence: 'unobserved',
  }),
  // ── W-COIN (W-COIN-1a..): the coin family's rows live in their own leaf ────
  // A FAMILY leaf, not a block cut. See subsystemRowsCoin.js — including the
  // reordering bill a SECOND W-COIN row appended in the body would pay.
  ...COIN_SUBSYSTEM_ROWS,
  // ── W-SEAT (SEAT-1..): the seat family's rows live in their own leaf ────────
  // ⛔ NOT AN ARBITRARY SPLIT. This file stood at 788 effective lines against the layer's
  // 800-line max-lines ceiling — the previous mint left twelve lines of headroom and an
  // honest certification row costs ~35, so the next mint was always going to red the wall.
  // The W-SEAT program charters THREE virtual keys, which makes it a habitat problem rather
  // than a one-row problem. `VIRTUAL_SUBSYSTEM_ROWS` remains the ONE export every consumer,
  // walker and bijection reads, so nothing downstream moves; see subsystemRowsSeat.js.
  ...SEAT_SUBSYSTEM_ROWS,
  // ── W-MEM (lane T12, ODQ §834/§868): the leaf T12 declined to author ───────
  // ⭐ The row is unchanged in content and RE-FLOWED out of the long-string idiom
  // it was squeezed into to fit the wall this lane removes; see
  // subsystemRowsMemory.js. It is the LAST authored row, so W-MEM-P1 and
  // W-MEM-P2 can append to that leaf without moving any other row's index.
  ...MEMORY_SUBSYSTEM_ROWS,
  // ── THE TWO WAITING DOORS · HOMES, NOT BEHAVIOUR (TE-VIRT-1 part (c)) ──────
  // Both leaves are EMPTY and spreading an empty frozen array is a no-op, so these
  // two lines change nothing any consumer can observe. They exist so the W-LIVES and
  // W-OPS door cars add a ROW to a file that already exists rather than authoring a
  // family leaf at a landing — the act ODQ §868 recorded T12 refusing. Each leaf
  // names the keys it waits for; they are spelled THERE and not here, because a key
  // spelled twice is a file enrolled twice in every mention scan that key carries.
  // ⛔ NOTHING IS LIT AND NO KEY IS REGISTERED: a manifest entry whose gate read is
  // not in the tree reds engineGatedRuleKeys direction 1, and key + gate read + row
  // are ONE commit by standing law. That commit is the door car's, not this one's.
  ...LIVES_SUBSYSTEM_ROWS,
  ...OPS_SUBSYSTEM_ROWS,
  // ENC-3 appends LAST, which shifts no existing row — the whole point of putting a
  // growing family's home at the tail (§864's append-last precedent).
  ...ENCOUNTERS_SUBSYSTEM_ROWS,
  // ── TR-2 · THE MERCHANT HOUSE (FP TR-2, docs/DESIGN_FP_TRADE.md §TR-2; block #24) ──────
  // APPENDED AT THE TAIL, the add-a-row protocol above: TR has no family leaf (TR-1's row
  // sits inside the compact BODY block, whose own header forbids an append there), and an
  // append here shifts no existing row's index.
  Object.freeze({
    rule: 'merchantHousesEnabled',
    title: 'The merchant house (books, the ruin latch, the threshold acts)',
    module: 'src/domain/worldPulse/houseLedger.js,src/domain/worldPulse/houseActs.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: the ledger mints no pulse candidate; its formations, ruins and
      // acts are RETURNED receipts, and the house news kinds are not minted at this wave.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: no behavioural family can carry a house without grading this
      // row alive off the trade layer's ordinary traffic in worlds where it never ran.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, on TR-1's reasoning: `spatialLedgers.houses` is real, this lane's
      // own, and has exactly ONE writer (advanceHouses), but the writer has NO CALLER in src/,
      // so a declared channel would grade this row SILENT for a layer that never ran.
      stateKeys: Object.freeze([]),
      other: 'A DARK INSTRUMENT WITH NO MOUNT, WHICH IS WHY EVERY CHANNEL IS EMPTY AND WHY THAT IS THE CORRECT READING. ONE GATE, by name and strict: merchantHousesActive (houseLedger.js) is the only read of the key in src/, and advanceHouses returns its input world by reference before it reads anything else. WHAT IT DOES: a faction whose canonical archetype reads merchant (factionArchetypes.factionArchetype, the only eligibility door, whose name-regex fallback makes a rename able to break it) in a town with a live commercial institution (institutionRoster.liveInstitutions) earns BOOKS in spatialLedgers.houses: banded holdings and credit, typed interests, an appetite band. Formation is deterministic (institution seniority, then the faction id by codepoint) under a per-town cap; holdings step one band per season toward the town\'s own fortune, raised one rung while an interest is live, so there is no wealth ratchet and a town fallen to its bottom band carries its houses to ruin. RUIN closes the books and leaves a tombstone whose cooldown refuses an undead house; eligibility loss (a rename, the last market ruined) sends the entry DORMANT WITH ITS BOOKS, and restored eligibility wakes the same entry. The threshold chooser (houseActs.js, import list pinned empty) picks one of four closed verbs and never names a victim; the factor is cast per act through roads/state.isOffStage and never stored. WHAT IT NEVER DOES: it draws no random number, reads no relationship graph, and moves no other layer\'s state. THE OBSERVATION NEEDED to close the gap is a WIRING WAVE: mount advanceHouses on the pulse and the v5 census over spatialLedgers.houses grades this row directly, at which point the stateKeys channel is owed. Until then the lane is pinned in tests/domain/houseLedgerTr2.test.js, which carries its four dormancy fences and the lit-mutant control.',
    }),
    // Formation and ruin are season-grade state crossings, and an act fires only when an
    // interest lapses, so the layer's expected output is sparse and driven by its world.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_byte_identical',
        description: 'With the key absent, false, or any truthy non-true value, advanceHouses returns its input world by reference over a fixture that forms two houses the moment the key is lit, so a dark world carries zero bytes of the layer in spatialLedgers.',
        check: 'Expressible from state and asserted that way in tests/domain/houseLedgerTr2.test.js fence 1, with the lit-mutant control on the same fixture.',
      }),
      Object.freeze({
        name: 'no_undead_house',
        description: 'A ruined house whose faction is still eligible does not re-open inside the ruin cooldown, and re-forms after it as a NEW entry with fresh books and a lineage count.',
        check: 'Expressible from state and asserted that way in tests/domain/houseLedgerTr2.test.js on a fixture driven from the top holdings band to ruin and back.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so honestly.
    soakEvidence: 'unobserved',
  }),
  // ── TR-3 · BELIEVED MARKETS (FP TR-3, docs/DESIGN_FP_TRADE.md §TR-3; block #25) ────────────
  // APPENDED AT THE TAIL, after TR-2's row, by the add-a-row protocol above: TR still has no
  // family leaf, and a row inserted before TR-2's would shift that row's index and move
  // certification output (the ODQ §864 ordinal class). The flag MANIFEST takes its codepoint
  // position (SR-7); this ordered array keeps the protocol's append.
  Object.freeze({
    rule: 'believedMarketsEnabled',
    title: 'Believed markets (the WHERE composer, the wrong-market tellable)',
    module: 'src/domain/spatial/dispatchDestination.js,src/domain/worldPulse/beliefScarcity.js,src/domain/worldPulse/marketNews.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: the layer mints no pulse candidate; the wrong-market arrival is
      // RETURNED evidence the orchestrator hands back, voiced by a Herald kind no mount feeds yet.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: no behavioural family can carry a queue order without grading this
      // row alive off the trade layer's ordinary traffic in worlds where it never ran.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY: the wave persists NOTHING (the TR volume: receipts only). The belief
      // pictures it reads are SP-B's and the stocks and shipments it orders are M6a's.
      stateKeys: Object.freeze([]),
      other: 'A QUEUE ORDER AND A RETURNED RECEIPT, WHICH IS WHY EVERY CHANNEL IS EMPTY AND WHY THAT IS THE CORRECT READING. ONE GATE, by name and strict: believedMarketsActive (dispatchDestination.js) is the only read of the key in src/, made once per tick by the commodity-flow orchestrator. WHAT IT DOES: when an origin\'s finite stock cannot fill every market that wants it, the destination loop stops walking its links in codepoint order and walks them in the order the WHERE composer returns, through dispatchEV.js\'s destination-consumer seam: the markets the supplying court BELIEVES dearest in the good\'s class first (SP-B\'s own believed plenty, read by the sibling leaf beliefScarcity.js), a tie between two believed markets going to the deeper TRUE need, and the loop\'s key last. The seam admits a permutation of the loop\'s own keys and nothing else, so no caravan is created, lost or duplicated. A caravan that lands and leaves its market in the truth-side surplus band while its origin still believes that market dear is returned as the wrong-market arrival, naming both bands side by side (the T-1 tellable). WHAT IT NEVER DOES: it never merges the two scarcities into one number (Seam Three: the order is lexicographic, and the acceptance file\'s token scan convicts any mixing expression), never touches the three need-premium reads the EV, the spill and the trickle make, never writes a belief, and draws no random number. THE OBSERVATION NEEDED to close the gap is a WIRING WAVE: mount the wrong-market voice on the pulse\'s news and a receipt can count the arrivals; until then the lane is pinned in tests/domain/believedMarketsTr3.test.js, which carries its four dormancy fences, the pulse hash arm and the lit-mutant control.',
    }),
    // A queue order moves only when an origin is short of stock, and a wrong-market arrival only
    // when a believed market has turned, so the layer's output is sparse and driven by its world.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_byte_identical',
        description: 'With the key absent, false, or any truthy non-true value, the orchestrator\'s whole output and six real pulse records are the pre-wave output and records byte for byte, over fixtures that send the caravan to the other market and tell a wrong-market arrival the moment the key is lit.',
        check: 'Expressible from state and asserted that way in tests/domain/believedMarketsTr3.test.js fences 1 and 2 and the hash arm, against sha256 figures measured at the lane\'s base, with the lit-mutant control on the same fixtures.',
      }),
      Object.freeze({
        name: 'the_two_scarcities_never_merge',
        description: 'The believed band and the truth-side need are read in one module only, the whitelisted dispatch composer, and no expression there combines them arithmetically: belief decides the order, truth only breaks a belief tie.',
        check: 'NOT expressible from a receipt. Pinned in tests/domain/believedMarketsTr3.test.js by a token scan with a seeded deliberate-average control and a co-import census with a planted third co-importer.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so honestly.
    soakEvidence: 'unobserved',
  }),
  // ── IN-2 · THE LURE (FP IN-2, docs/DESIGN_FP_INFORMATION.md §5 IN-2; block #18) ─────────
  // APPENDED AT THE TAIL, the add-a-row protocol above (the belief block's header forbids an
  // append there, where IN-1a's mirror sits); an append here shifts no existing row's index.
  Object.freeze({
    rule: 'infoLureEnabled',
    title: 'The lure (axis-typed lies, the spring, bluff against bluff)',
    module: 'src/domain/worldPulse/infoLure.js,src/domain/worldPulse/informationStatecraft.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: the lure mints no pulse candidate; its one beat, lure_sprung, is a
      // statecraft news entry, and a candidate channel would grade this row off nothing.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: the knowledge family is a residual bucket (IN-6's decontamination),
      // so no behavioural family can grade the lure alive without grading every bluff with it.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY: the lure writes through spatialLedgers.disinfo, whose ONE writer is
      // the statecraft head, and ordinary bluffs keep that key alive in worlds the lure never lit.
      stateKeys: Object.freeze([]),
      other: 'A LIT-ONLY SET OF ARMS ON AN EXISTING LEDGER, WHICH IS WHY EVERY CHANNEL IS EMPTY AND WHY THAT IS THE CORRECT READING. ONE GATE, by name and strict: infoLureActive (infoLure.js) is the only read of the key in src/, and processLies asks it once, before the spring, the bluff collision and the exposure clause. The axis-typed exposure law it consults is the ONE law for every record, legacy included, and moves no legacy byte: an absent axis is the head\'s own strength law, moved verbatim, and an axis record is judged on its own ladder at the same tolerance or, for the faith label, by inequality. WHAT IT DOES, LIT: a weakness bait (a deflate strength lie about a court) that stood in a mark\'s reckoning when the mark chose to march on that court, on exactly the band it asserted, becomes the DM-truth lure_sprung beat, covert and addressed to all three courts; an aged-out bluff whose audience\'s own counter-bluff was standing in the liar\'s court is exposed naming both lies; and a bought strength plant about a third court names that court and its direction at exposure. The leaf also DEFINES the commission-lie direction and the plantChannel predicate headless (IN-2-c: the consumer lands when U123 composes the direction transport), with the producer that consumer will call. WHAT IT NEVER DOES: it draws no random number and hashes nothing, reads the phantom discriminant nowhere (a phantom never enters the snapshot), and writes no ledger of its own. THE OBSERVATION NEEDED to close the gap is a lit soak in which a bought deflate plant meets its mark\'s misjudged march; until then the lane is pinned in tests/domain/infoLureIn2.test.js, which carries its four dormancy fences and the lit-mutant control.',
    }),
    // A spring needs a bought lie AND the mark's own march on the same court: sparse by design.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_byte_identical',
        description: 'With the key absent, false, or any truthy non-true value, processLies over a fixture that springs a lure and collides two bluffs the moment the key is lit returns exactly the bytes it returned before IN-2.',
        check: 'Expressible from state and asserted that way in tests/domain/infoLureIn2.test.js fence 1 (a pinned digest of the dark output), with the lit-mutant control on the same fixture.',
      }),
      Object.freeze({
        name: 'legacy_records_read_as_strength',
        description: 'A disinfo record with no axis field is judged by the strength law alone, so every save written before IN-2 exposes on exactly the tick it would have.',
        check: 'Expressible from state and asserted that way in tests/domain/infoLureIn2.test.js over a table of legacy records, beside the head\'s own pins.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so honestly.
    soakEvidence: 'unobserved',
  }),
  // ── GR-6 · MEDIATION GENERALIZED (FP GR-6, docs/DESIGN_FP_GRAMMAR.md §GR-6; block #14) ─────
  // APPENDED AT THE TAIL, the add-a-row protocol above: the compact-grammar block that holds the
  // other GR rows forbids an append in its own header, and an append here shifts no index.
  Object.freeze({
    rule: 'mediationGeneralizedEnabled',
    title: 'Mediation generalized (the broker before the blood)',
    module: 'src/domain/worldPulse/mediationPressure.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY: the layer mints no pulse candidate. Its one receipt is a news entry
      // the treaty stage returns, and no behavioural family carries it.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: a mediation leaves no mover of its own, and the war layer's and the
      // treaty layer's ordinary traffic would grade this row alive in worlds where it never ran.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, and structural: the layer owns NO state key. It reads the war-intent
      // and treaty ledgers and writes only trust, through the overlay's own writer.
      stateKeys: Object.freeze([]),
      other: 'A PRESSURE WITH NO STATE OF ITS OWN, WHICH IS WHY EVERY CHANNEL IS EMPTY AND WHY THAT IS THE CORRECT READING. ONE GATE, by name and strict: mediationGeneralizedActive (mediationPressure.js) is the only read of the key in src/, a conjunction with the peace engine\'s two keys because every occasion speaks through the treaty stage. WHAT IT DOES: the one cross-pressured finder (peaceTermsGraph.findCrossPressuredMediator), which named a broker only at a war\'s exit, gains two occasions. At the intent stage a broker standing between a pair whose seat left a march order hands the one war opener a bounded multiplier below one, which lifts the order\'s CONQUEST_MARGIN waiver and scales that soft comparison; every hard gate still runs and a strong enough court still marches. An order that reaches the end of its window still standing, with a broker between the pair, is told as the war that did not happen (the brokered_back receipt, naming the broker) and the broker earns the two-edge trust the war-exit broker does (accrueMediationTrust, reused). At a fraying pact a broker between the parties softens the strain accrual one banded notch, a smaller notch for a record already strained. WHAT IT NEVER DOES: it forces nothing, draws nothing, mints no ledger, and names no temple (the temple arm waits on a ruling). THE OBSERVATION NEEDED to close the gap is the mediation mix GR-7 owes: brokered_back beats counted per soak year against the war-intent orders that lapsed, and the decree-caused ones counted apart. Until then the lane is pinned in tests/domain/mediationGeneralizedGr6.test.js, which carries its four dormancy fences and the lit-mutant control.',
    }),
    // The pressure reads a live order and the receipt waits on a closing window, so the layer's
    // output is sparse and driven entirely by its world.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_byte_identical',
        description: 'With the key absent, false, or any truthy non-true value, the opener opens exactly the war it opens without the layer, and the treaty stage returns its input result by reference, over a fixture that holds a war back and mints a receipt the moment the key is lit.',
        check: 'Expressible from state and asserted that way in tests/domain/mediationGeneralizedGr6.test.js fences 1 and 2, with the lit-mutant control on the same fixture.',
      }),
      Object.freeze({
        name: 'mediation_never_forces',
        description: 'A pair with a broker and no standing order is untouched, and a pressured order whose court is strong enough still opens its war: the multiplier scales one soft comparison and blocks nothing.',
        check: 'Expressible from state and asserted that way in tests/domain/mediationGeneralizedGr6.test.js on two fixtures, one held back and one that still marches.',
      }),
    ]),
    // No channel at all, so the row can never be ALIVE and says so honestly.
    soakEvidence: 'unobserved',
  }),
]);

/**
 * Engine-gated virtual rule keys that do not yet carry a row. SHRINK-ONLY. Empty
 * from this lane's first commit, and deliberately exported empty so the composed
 * pending list keeps one entry per lane: a key only reaches
 * ENGINE_GATED_VIRTUAL_RULE_KEYS by being measured as a real gate, and a measured
 * gate with no row is exactly the blindness this lane exists to end.
 * @type {ReadonlyArray<string>}
 */
export const VIRTUAL_PENDING_RULE_KEYS = Object.freeze([]);
