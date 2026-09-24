/**
 * engineGatedRuleKeys.walker.test.js — habitat removal for the CENSUS-INVISIBLE
 * SUBSYSTEM class (chair ruling CR-WR10-C, 2026-08-04).
 *
 * THE CLASS. `simulationRuleKeys()` is the certification census, and until
 * CR-WR10-C it read exactly two surfaces: `DEFAULT_SIMULATION_RULES` and every
 * preset override spread. The estate's dormancy idiom (deep-couplings law 1) puts a
 * dark subsystem behind a VIRTUAL flag that appears in NEITHER — that is what makes
 * a dark layer cost a campaign zero persisted bytes. So a subsystem could be built,
 * gated, and shipped while the totality walker that exists to demand its
 * certification row could not see the key at all. The blindness was structural, it
 * was silent, and the cure had to be a census that reads the ENGINE rather than the
 * declarations.
 *
 * THE WALK. Source-scan `src/` for the strict gate idiom — a `rules` /
 * `simulationRules` receiver, `.<key>`, `=== true` — with comments AND string
 * literals blanked first, then prove the manifest
 * `ENGINE_GATED_VIRTUAL_RULE_KEYS` (worldPulse/simulationRules.js) against that
 * measurement BOTH WAYS:
 *   1. MANIFEST SUBSET OF READS  — every manifest member is really gated in src/.
 *      A manifest that drifted into fiction would grow the census and demand
 *      certification rows for keys the engine never reads.
 *   2. READS SUBSET OF ACCOUNTED — every gated key is in the census (declared or
 *      manifested), in the EXEMPT list, or in the measured BACKLOG. One-way
 *      coverage is the known failure mode of a hand-listed manifest: it would let a
 *      future engine-gated key hide again, which is the class this file closes.
 *   3. MANIFEST CARRIES ITS ROW, AND IS PENDING NOWHERE — every manifest member is
 *      authored in VIRTUAL_SUBSYSTEM_ROWS and appears in no lane's pending list.
 *      See below: this is a narrower law than "a row or a pending entry", and the
 *      difference is the entire defect.
 *
 * ⚠ DIRECTION 3 EXISTS BECAUSE THE ONE-COMMIT LAW HAD ONLY HALF A GUARD, AND THE
 * MISSING HALF SHIPPED A RED. CR-WR10-C item 4 binds three things into one commit —
 * the manifest entry, the first real gate read, and the certification row — and the
 * paragraph at the bottom of this header has said so in prose since the ruling. Only
 * the first two were ENFORCED here.
 *
 * MEASURE THE GAP EXACTLY, because the obvious reading of it is wrong. A manifested key
 * with NO row and NO pending entry was never the hole: the census grows with the
 * manifest, so subsystemCertificationTotality.walker reds that shape by name today
 * (executed — deleting the casus row from a clean tree reds it with "uncertified rule
 * keys: casusCommerciiEnabled" while THIS file stays green). The hole is the shape
 * one lane further along: MANIFESTED, and its obligation PARKED as a declared pending
 * entry in some other lane file. That partition is legal — so the totality walker
 * passes — and it is simultaneously forbidden by the virtual lane's own contract, which
 * asserts ENGINE_GATED_VIRTUAL_RULE_KEYS equals the authored virtual rows exactly and
 * that no manifested key is pending anywhere. On 2026-08-04 FP wave TR-1 landed exactly
 * that shape: manifest entry here, pending entry in subsystemRowsWaves.js. Both lint
 * walkers passed; tests/domain/subsystemRowsVirtual.test.js — a DOMAIN suite the lane's
 * isolation gate never enumerated — was red at HEAD. A guard that sits where lanes do
 * not look is not a guard, so the audit below now measures the row half in the suite
 * that told the lane its flag was legal, and it measures it as the virtual lane's
 * contract states it rather than as the looser partition law.
 *
 * THE CAST IS A GATE. The dominant spelling in this estate is not the bare
 * `rules.<key> === true` but the JSDoc-cast form, a type-cast comment followed by
 * `(rules).<key> === true`. Fifteen of the seventeen backlog keys below are spelled
 * that way, and a scan that requires the receiver token to sit adjacent to the key
 * MISSES EVERY ONE OF THEM. That is not hypothetical: the chair's own pre-ruling
 * census measured 18 gate-read keys where this walker measures 51, and CR-WR10-C's
 * "blast radius is FIVE keys" was computed on the smaller number. The regex below
 * therefore tolerates an intervening `)` and an optional-chain `?.`, and the
 * non-vacuity test drives a POSITIVE CONTROL of each spelling so a future
 * simplification of the pattern reds here instead of silently re-blinding the census.
 *
 * WHY A WALKER AND NOT A RUNTIME SCAN. The census is a pure function on the eager
 * path's vocabulary module; source-scanning belongs in tests. CR-WR10-C item 2.
 *
 * GUARD THE GUARD. Both the scanner and the auditor are pure, so this file drives
 * each with synthetic inputs and asserts it REDS on every failure shape before
 * asserting the live tree is clean. Without that step a broken regex would pass
 * everything below on an empty measurement — which is exactly how the blindness
 * this walker cures came to be believed cured once already.
 *
 * TO COMPLY when this reds:
 *   - added a virtual gate for a NEW dark subsystem → add the key to
 *     ENGINE_GATED_VIRTUAL_RULE_KEYS AND author its certification row in the same
 *     commit (direction 3 below is what makes that structural rather than a good
 *     intention), or, if it is not a subsystem, add it to EXEMPT_RULE_KEYS with a
 *     written rationale. Never to the backlog: that list is a measured burn-down,
 *     not a parking space.
 *   - manifested a key and parked its row as a PENDING entry → there is no such
 *     state. A pending entry is for a key the CENSUS already sees through a preset
 *     or default declaration; a manifest entry is itself the thing that makes a
 *     virtual key censusable, so manifesting is the act that comes due. Author the
 *     row in subsystemRowsVirtual.js in the same commit, or do not manifest yet.
 *   - landed the first gate read for a PENDING_MANIFEST_KEYS member → move it into
 *     the manifest IN THE SAME COMMIT. That is CR-WR10-C item 4, and the assertion
 *     below is what makes the atomicity structural rather than a good intention.
 *   - gave a backlog key its certification row → delete its backlog entry (the list
 *     is SHRINK-ONLY and asserted EXACT; never add a row to it).
 *   - deleted a gated key → remove it from whichever list names it.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  DEFAULT_SIMULATION_RULES,
  ENGINE_GATED_DORMANT_RULE_KEYS,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  SIMULATION_RULE_PRESETS,
  deriveDormantRuleKeys,
} from '../../src/domain/worldPulse/simulationRules.js';
import {
  SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
  SUBSYSTEM_CERTIFICATION_REGISTRY,
  simulationRuleKeys,
} from '../../src/domain/certification/subsystemCertification.js';
import { VIRTUAL_SUBSYSTEM_ROWS } from '../../src/domain/certification/subsystemRowsVirtual.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Keys the engine gates on that are DELIBERATELY not census members, each with the
 * rationale that makes the exemption reviewable rather than a shrug. CR-WR10-C's
 * scope qualifier: the census covers engine-gated virtual SUBSYSTEM flags; an
 * opt-in campaign ROUTING POLICY is not a subsystem and has no aliveness to certify.
 */
const EXEMPT_RULE_KEYS = Object.freeze({
  routineMajorApproval: 'NOT A SUBSYSTEM — an opt-in campaign ROUTING POLICY. Its own'
    + ' module states the reason verbatim: "The flag is a TOLERANT READ, DELIBERATELY'
    + ' absent from DEFAULT_SIMULATION_RULES: it costs ZERO first-paint bytes (no eager'
    + ' key, no accessor branch) and off-by-absence is the dormancy law, executed."'
    + ' (src/domain/worldPulse/actorMajorApproval.js). It routes actor-initiated majors'
    + ' to the approval queue under routine autonomy; it moves no world state of its own'
    + ' and owns no vocabulary, so a certification row could only ever grade the'
    + ' proposal queue, which baseline rows already cover. Exempt BY RECORDED RATIONALE,'
    + ' never by silence.',
  // ── Joined 2026-08-14 by GAP-1, under OWNER_DECISION_QUEUE §32 rulings 1 and 5. Both
  //    keys became VISIBLE for the first time when this walker's detector widened past
  //    its canonical receiver; neither is new, and neither was hiding on purpose.
  institutionPoliticalControlEnabled: 'NOT A SUBSYSTEM — a RANKING MODIFIER inside a'
    + ' subsystem that is already certified. It gates exactly one expression in'
    + ' src/domain/worldPulse/institutionLifecycle.js: `const controlSets ='
    + ' politicalControlLit ? factionControlSets(settlement) : null`, which re-ranks the'
    + ' closure candidates institutionLifecycleEnabled already mints. Its own comment at'
    + ' the gate states the effect exactly: "Dark ⇒ closure ranking ignores'
    + ' controlled/suppressed ⇒ byte-identical (institutionLifecycleEnabled is'
    + ' default-true)." It writes no container of its own, mints no candidate type of its'
    + ' own, and owns no vocabulary — it changes the ORDER of a list another subsystem'
    + ' owns. A certification row could therefore only ever grade the institution'
    + ' lifecycle lane, which carries its own row already, and a second row over the same'
    + ' traffic is how one subsystem gets graded alive off another. Exempt BY RECORDED'
    + ' RATIONALE, never by silence.',
  biomeTruthEnabled: 'NOT A SUBSYSTEM — a CANON-FREEZE OPTION on the store canonize'
    + ' path, not the pulse path. src/store/campaignSpatialCanonize.js reads it once, to'
    + ' set `biomeTexture` into buildSpatialDigest, and its own header states the dormancy'
    + ' verbatim: "Absent ⇒ biomeTexture false ⇒ NO biomes key ⇒ byte-identical (every'
    + ' existing canon/golden)." It adds one additive sub-digest to a canon authored ONCE'
    + ' and never recomputed, so it has no per-tick aliveness to certify and no receipt'
    + ' channel can ever grade it: the whole-world soak never calls runSpatialCanonize at'
    + ' all. It matches routineMajorApproval in structure — an opt-in campaign option'
    + ' rather than a layer with a life of its own. ⚠ RECORDED COUNTER-ARGUMENT rather'
    + ' than suppressed: unlike routineMajorApproval it DOES change persisted bytes when'
    + ' lit, which is why the chair gated this exemption rather than the lane taking it;'
    + ' OWNER_DECISION_QUEUE §32 ruling 5 accepts it on that record. Exempt BY RECORDED'
    + ' RATIONALE, never by silence.',
  // ── Joined 2026-08-29 by W-CAP CAP-3 (lane TE-CAP), on biomeTruthEnabled's structure. ──
  climateTruthEnabled: 'NOT A SUBSYSTEM — the SECOND CANON-FREEZE OPTION on the store'
    + ' canonize path, minted on biomeTruthEnabled\'s idiom by the design volume\'s own'
    + ' instruction ("`climateTruthEnabled` on the `biomeTruthEnabled` idiom").'
    + ' src/store/campaignSpatialCanonize.js reads it once, to set `climateTexture` into'
    + ' buildSpatialDigest, and the gate states its dormancy verbatim: "Absent ⇒'
    + ' climateTexture false ⇒ NO climate key ⇒ byte-identical (every existing'
    + ' canon/golden)." Like its sibling it adds one additive sub-digest to a canon'
    + ' authored ONCE and never recomputed, so it has no per-tick aliveness to certify and'
    + ' no receipt channel can grade it — the whole-world soak never calls'
    + ' runSpatialCanonize at all. ⚠ THE SAME RECORDED COUNTER-ARGUMENT APPLIES AND IS NOT'
    + ' SUPPRESSED: it DOES change persisted bytes when lit, and it additionally changes'
    + ' the food-year amplitude a lit canon derives — which is why biomeTruthEnabled\'s'
    + ' exemption was CHAIR-gated rather than lane-taken. This row is therefore written as'
    + ' a PROPOSAL leaning on OWNER_DECISION_QUEUE §32 ruling 5, and the lane\'s report'
    + ' carries it to the chair as an open row rather than treating the precedent as'
    + ' self-executing. Exempt BY RECORDED RATIONALE, never by silence.',
});

/**
 * THE MEASURED BACKLOG. Every key here is a REAL engine gate on a REAL dark
 * subsystem layer, measured by this walker at HEAD, and every one of them is owed a
 * manifest entry and a certification row on exactly CR-WR10-C's reasoning. They are
 * NOT in the manifest because CR-WR10-C authorised four keys and four rows; landing
 * seventeen more rows under a ruling that measured five keys would be a lane
 * inventing its own scope. Recorded here so the hole is VISIBLE and SHRINK-ONLY
 * instead of green and blind, and reported to the chair as the reopened §5
 * stragglers branch (CERT-ROW-ARMS.md: "If the census finds stragglers … THE FORK
 * RE-OPENS with data instead of a hunch").
 *
 * SHRINK-ONLY and asserted EXACT: a key leaves only by joining the manifest (with
 * its row) or the exempt list (with its rationale), and a NEW dark gate cannot join
 * — it reds as unaccounted until somebody decides which it is.
 */
const BACKLOG_RULE_KEYS = Object.freeze({
  assizeEnabled: 'THE ASSIZE — a pulse-tick kernel behind its own virtual flag (worldPulse/assizeKernel.js).',
  commonsVoiceEnabled: "THE COMMONS' VOICE — a pulse-tick kernel behind its own virtual flag (worldPulse/commonsVoiceKernel.js).",
  contestedGoalsEnabled: 'D-4 CONTESTED GOALS — an npc-ladder sub-layer behind its own virtual flag (worldPulse/npcLadderKernel.js).',
  corruptionWebEnabled: 'THE CORRUPTION WEB — beliefs-conjoined, behind its own virtual flag (worldPulse/corruptionWeb.js).',
  discourseProseEnabled: 'DISCOURSE PROSE — a display kernel consumed only behind its own virtual flag (display/discourseKernel.js).',
  economicCoupReadEnabled: 'THE ECONOMIC COUP READ — a coup-verdict term behind its own virtual flag (worldPulse/coup.js).',
  heirsEnabled: 'V-7 HEIRS-LITE — an npc-ladder sub-layer behind its own virtual flag (worldPulse/npcLadderKernel.js).',
  heraldCausalVoiceEnabled: 'THE HERALD CAUSAL VOICE — a display layer dark behind its own virtual flag (display/heraldCausalVoice.js).',
  ladderPoliticalWindowsEnabled: 'LADDER POLITICAL WINDOWS — an npc-ladder sub-layer behind its own virtual flag (worldPulse/npcLadderKernel.js).',
  memoryWeaveEnabled: 'THE MEMORY WEAVE — a relationship-evolution layer behind its own virtual flag (worldPulse/relationshipEvolution.js).',
  migrationCorruptionPushEnabled: 'THE MIGRATION CORRUPTION PUSH — a migration multiplier dark at x1 (worldPulse/migrationKernel.js).',
  neutralNeighborsEnabled: 'NEUTRAL NEIGHBOUR EDGES — a region-layer edge class behind its own virtual flag (region/neutralNeighbourEdges.js).',
  npcCredibilityEnabled: 'THE PER-NPC CREDIBILITY LAYER — behind its own virtual flag (worldPulse/npcCredibility.js).',
  seaRoadsEnabled: 'D-6 SEA ROADS — a roads layer dark behind its own virtual flag (roads/seaRoads.js).',
  thirdPartyRansomEnabled: 'D-5 THIRD-PARTY RANSOM — a roads layer dark behind its own virtual flag (roads/thirdPartyRansom.js).',
  upswingHazardReadEnabled: 'THE UPSWING HAZARD READ — a piety multiplier dark at x1 (worldPulse/piety.js).',
});

/**
 * CR-WR10-C item 4's pending list — a key that will earn a manifest entry the moment
 * a gate read for it lands, asserted below as ZERO reads so the atomicity is
 * STRUCTURAL: the first gate read REDS this walker until the same commit moves the
 * key into the manifest with its certification row.
 *
 * EMPTIED 2026-08-04 by lane WW-A, which is the mechanism working exactly as designed.
 * `sovereigntyTradeEnabled` was the sole entry; the wiring wave landed its gate, this
 * walker went red with all three of its own failure modes naming the key, and the same
 * commit moved it into ENGINE_GATED_VIRTUAL_RULE_KEYS and authored its row in
 * subsystemRowsVirtual.js.
 *
 * ⚠ THE HOLE THIS EPISODE EXPOSED WAS RECORDED HERE AS THE FROZEN-LIST CONJUNCTION,
 * AND THE MEASURED CLASS IS BROADER THAN THAT. Restated 2026-08-14 by GAP-1 against an
 * executed scan, because the narrow statement sent the next lane looking for the wrong
 * shape. The wiring lane first spelled its gate as a conjunction over a frozen rule
 * list — `REQUIRED_RULES.every((key) => rules[key] === true)` — a COMPUTED member
 * access that attributes to no key at all. That is real, but it is one instance of the
 * general class: THE DETECTOR CONSTRAINED ITS **RECEIVER**, and its stated claim above
 * ("source-scan `src/` for the strict gate idiom") is wider than any single-token
 * receiver can reach. A real, strict, engine-gated read whose receiver is spelled any
 * other way was invisible, and this walker stayed green over it.
 *
 * MEASURED AT `5d6a0e7c`: three live receiver shapes across four files hid SEVEN keys,
 * four of them accounted for by nothing at all — while the frozen-list shape this
 * paragraph used to name had ZERO live instances. The cure is the three-arm scan below
 * (arm 1 unchanged, arms 2 and 3 added), which took the measurement from 63 keys to 70
 * with LOST = 0. The three shapes it now reaches:
 *   A — the JSDoc-cast ALIAS local: `const r = \/** @type … *\/ (rules); … r.<key> === true`
 *   B — the `||`-defaulted parenthesised expression:
 *       `(context.simulationRules || worldState?.simulationRules || {}).<key> === true`
 *   C — a differently-named local bound from a `.simulationRules` access.
 *
 * ⛔⛔ THE FROZEN-LIST CONJUNCTION REMAINS OPEN, AND THE "ZERO LIVE INSTANCES" HALF OF
 * THIS PARAGRAPH WAS FALSE — CORRECTED 2026-09-05 BY LANE L-CHAIR-901 AGAINST AN EXECUTED
 * SCAN. It read "It has zero live instances, so a guard for it would be a pin over an empty
 * population — the recorded vacuity class." That sentence sent the next reader looking for
 * an empty set. Measured over 2,188 src files through the estate's own character scanner
 * (`codeOnly`, so a comment or a string cannot forge a hit), the population is NOT empty
 * and never was on this tree:
 *
 *   THE FROZEN-LIST CONJUNCTION ITSELF — `LIST.every((key) => rules[key] === true)` — has
 *   FOUR live rules-gating sites: worldPulse/conquestDoctrineStage.js:139
 *   (CONQUEST_REQUIRED_RULES), worldPulse/envoyErrandOffer.js:43 and
 *   worldPulse/npcDmVerbAuthority.js:62 (both ENVOY_REQUIRED_RULES), and
 *   worldPulse/sovereigntyAssets.js:85 (SOVEREIGNTY_REQUIRED_RULES, itself a spread of the
 *   envoy list). A fifth, generationContentProfile.js:186, wears the same shape over a
 *   content-profile receiver rather than a rules bag and is not a gate.
 *
 *   AND THE WIDER COMPUTED-ACCESS CLASS the conjunction belongs to — ANY `<expr>[<key>]
 *   === true` whose key is a variable rather than a token — carries three SINGLE-key rules
 *   gates besides: npc/characterDrift.js:273 (`characterDriftEnabled`, the instance L-HOMES-7
 *   named), worldPulse/institutionStatusModel.js:274 (`magicEconomyEnabled`) and
 *   townScene/cartographyContract.js:618 (`townCartographyEnabled`).
 *
 * ⭐ SO THE CLASS IS LIVE, AND WHAT IT HIDES IS EXACTLY WHAT THE PARAGRAPH FEARED. None of
 * `characterDriftEnabled`, `magicEconomyEnabled`, `townCartographyEnabled`,
 * `coalitionLedgerEnabled` or the other conjunction members is a member of
 * ENGINE_GATED_VIRTUAL_RULE_KEYS, and each is invisible to all three receiver arms below
 * because a computed access attributes to no key token at all. `sovereigntyTradeEnabled` is
 * the exception that proves the mechanism: it IS a manifest member and DOES reach this
 * census — not through the conjunction at :85, but through the separate by-name
 * `ownFlagLit` read at :84 one line above it.
 *
 * ⛔ AND THE GUARD IS STILL NOT BUILT HERE, WHICH IS NOW A DECISION RATHER THAN A VACUITY.
 * A fourth arm reaching the computed class would add keys to this census, and a key that
 * reaches the census owes an AUTHORED CERTIFICATION ROW (CR-WR10-C item 4) in the same
 * commit — for at least the three single-key gates above, each of which the estate has
 * deliberately left unmanifested with its own written disposition (characterDrift awaits
 * TE-VIRT-1's flag car; the other two carry their own). That is a REGISTER ACT and an
 * owner/chair call, not a lane one, so this lane MEASURED the class and refused to open it.
 * What replaces the false sentence is an executed arm, in the non-vacuity test below, that
 * asserts the population is NON-EMPTY at named addresses — so this paragraph can rot into
 * silence but no longer into a falsehood.
 */
const PENDING_MANIFEST_KEYS = Object.freeze([]);

/**
 * ⭐ THE SOURCE STRIP MOVED TO `tests/helpers/codeOnlySource.js` AND IS RE-EXPORTED HERE.
 * The body is unchanged; only its HOME moved. It had to move because importing a symbol
 * from a `.test.js` file re-evaluates that module, so each of this walker's ten importers
 * re-registers this file's suites inside its own — which made a new adopter cost a lighting
 * census re-freeze rather than an import line. The helper carries no describe/test, so the
 * next walker that needs a USE-claim strip pays nothing and writes no second spelling.
 * ⚠ The ten existing importers are DELIBERATELY untouched: re-pointing them is a register
 * act (each one's title tuple would move), and this car does not own that bill.
 */
import { codeOnly } from '../helpers/codeOnlySource.js';
// The anchored-negative helper. Carries no describe/test, so it costs this file's twelve
// re-registering importers nothing (see the note above).
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

export { codeOnly };

/**
 * ARM 1 — the strict gate idiom on a CANONICAL receiver. `rules` or
 * `simulationRules`; an intervening `)` admits the JSDoc-cast spelling (the dominant
 * one in this estate), and `?.` admits the optional-chain spelling. UNCHANGED by
 * GAP-1: the widening is strictly additive, which is what makes the new measurement a
 * superset rather than a replacement.
 *
 * ⭐ This is the ONLY arm carrying the FULL key vocabulary, and the asymmetry is
 * deliberate (guard 3 below). It is the only arm that can measure a gate whose key
 * does not end in `Enabled` — `routineMajorApproval` is the one such key today.
 */
const GATE_RE = /\b(?:rules|simulationRules)\s*\)?\s*\??\.\s*([A-Za-z_$][\w$]*)\s*===\s*true/g;

/**
 * ARM 2 — the `||`-defaulted parenthesised receiver EXPRESSION (shape B), the spelling
 * `(context.simulationRules || worldState?.simulationRules || {}).fooEnabled === true`.
 *
 * GUARD: the segment between the receiver token and the closing paren admits NO dot and
 * NO paren, so the arm can never bridge across a member chain — in
 * `rules.aEnabled === true && x.bEnabled === true` it cannot attribute `bEnabled` to
 * `rules`. Restricted to `/Enabled$/` keys per guard 3.
 */
const GATE_EXPR_RE = /\b(?:rules|simulationRules)\b[^()\n.]*\)\s*\??\.\s*([A-Za-z_$][\w$]*Enabled)\s*===\s*true/g;

/**
 * ARM 3 — the resolved local ALIAS receiver (shapes A and C). Two regexes and a
 * binding resolver, because an alias is not a token match: it is a fact about what a
 * name was last bound to at the point of the read.
 */
const BIND_RE = /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*([^;]*);/g;
const ALIAS_READ_RE = /\b([A-Za-z_$][\w$]*)\s*\??\.\s*([A-Za-z_$][\w$]*Enabled)\s*===\s*true/g;
const CANONICAL_RECEIVERS = Object.freeze(['rules', 'simulationRules']);

/**
 * Every binding of every name in one file, in source order, tagged rules / not-rules.
 *
 * ⚠ GUARD 2 — NEAREST PRECEDING BINDING WINS, never a file-wide alias set, and this
 * guard was found EMPIRICALLY rather than reasoned into place. `convergence.js` binds
 * the name `r` SIX times; exactly one of them is the rules cast. A file-wide alias set
 * attributed `r.invited === true` — whose nearest preceding binding is
 * `const r = asObject(raw[k])` — to the rules object, which is a false positive on a
 * key no rule declares. So every binding is recorded with its offset and a read is
 * attributed only when the nearest binding PRECEDING that read is a rules binding.
 *
 * A name is a rules receiver when its right-hand side is one of exactly three shapes:
 * a pure re-alias of an already-known receiver (what `\/** @type … *\/ (rules)` reduces
 * to once comments are blanked), an rhs ENDING in a `.simulationRules` access with an
 * optional `|| {}` default, or the ternary null-guard idiom whose live arm is
 * `.simulationRules`. Iterated to a fixpoint so an alias-of-an-alias resolves.
 *
 * ⛔ REJECTED, on executed evidence: a `loose` variant admitting any rhs merely
 * CONTAINING `.simulationRules` over-admits — it made `underwaysFoundingLit`, itself
 * the RESULT of a gate read, into a receiver, taking the gained set from 7 to 8.
 *
 * @param {string} code comment- and string-blanked source
 * @returns {Map<string, Array<{ at: number, isRules: boolean }>>}
 */
export function rulesBindingsOf(code) {
  /** @type {Map<string, Array<{ at:number, isRules:boolean }>>} */
  const byName = new Map();
  let known = new Set(CANONICAL_RECEIVERS);
  // Three passes is a fixpoint with headroom: the deepest live chain is one hop.
  for (let pass = 0; pass < 3; pass += 1) {
    byName.clear();
    // ⚠ GUARD 1 — the RECEIVER-BOUNDARY guard, and this comment states exactly where it
    // bites, because an earlier draft of it overclaimed and a planted mutant proved so.
    //
    // THE HAZARD IS REAL: an unbounded receiver alternation that can match a PREFIX of a
    // longer identifier attributes reads to the wrong object. The prototype behind this
    // cure produced exactly two false positives that way — `revealed` from
    // `return leash.` and `isGoverning` from `rosterEntry ?` — once a short alias like
    // `r` entered the alternation.
    //
    // ⭐ IN THIS SPELLING THE OPERATIVE REFUSAL IS THE BINDING LOOKUP IN `scanGateReads`,
    // NOT THIS `\b`. A read is attributed only when its receiver has a RECORDED rules
    // binding, so `leash` and `rosterEntry` are refused for having no binding at all —
    // they never reach a regex boundary question. Removing the `\b` below therefore
    // convicts nothing, and that is DECLARED here rather than left for a future lane to
    // discover: it is defense in depth behind the `[\s)]*$` anchor, which already
    // forbids trailing word characters. It is kept because the anchor and the
    // alternation are edited by different hands for different reasons, and the day one
    // of them grows a `.*` the boundary is the only thing left standing.
    //
    // The two false positives are pinned as live decoys in the `guard the guard` test
    // above, where the operative refusal is what they actually exercise.
    const pureAlias = new RegExp(String.raw`^[\s(]*(?:${[...known].join('|')})\b[\s)]*$`);
    const next = new Set(known);
    for (const match of code.matchAll(BIND_RE)) {
      const [, name, rawRhs] = match;
      const rhs = rawRhs.trim();
      const isRules = pureAlias.test(rhs)
        || /\.\s*simulationRules\b\s*(?:\|\|\s*\{\s*\}\s*)?\)*\s*$/.test(rhs)
        || /\?\s*[A-Za-z_$][\w$.?]*\.\s*simulationRules\s*:\s*null\s*$/.test(rhs);
      if (!byName.has(name)) byName.set(name, []);
      byName.get(name).push({ at: match.index, isRules });
      if (isRules) next.add(name);
    }
    if (next.size === known.size) break;
    known = next;
  }
  return byName;
}

/** @param {string} dir @param {string[]} out */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * Scan the given sources for the gate idiom — the UNION of the three arms above.
 *
 * ⭐ GUARD 3, and it is a deliberate ASYMMETRY rather than an oversight: arms 2 and 3
 * are restricted to `/Enabled$/` keys and arm 1 is not. Arm 1 must keep the full
 * vocabulary because it is the only arm measuring `routineMajorApproval`. On a
 * NON-CANONICAL receiver the key name is the only discriminator left — the receiver
 * has stopped being evidence — so the naming convention carries the weight there.
 *
 * ⛔ `codeOnly` is FROZEN by GAP-1 and nothing here changes it: ten other test files
 * import it, and its blanking is what keeps a gate written in PROSE out of the
 * measurement.
 *
 * @param {Array<{ rel: string, src: string }>} files
 * @returns {Map<string, string[]>} key -> the files that gate on it
 */
export function scanGateReads(files) {
  /** @type {Map<string, Set<string>>} */
  const hits = new Map();
  const add = (key, rel) => {
    if (!hits.has(key)) hits.set(key, new Set());
    hits.get(key).add(rel);
  };
  for (const { rel, src } of files) {
    const code = codeOnly(src);
    for (const match of code.matchAll(GATE_RE)) add(match[1], rel);
    for (const match of code.matchAll(GATE_EXPR_RE)) add(match[1], rel);
    const byName = rulesBindingsOf(code);
    for (const match of code.matchAll(ALIAS_READ_RE)) {
      const [, receiver, key] = match;
      // Arm 1 already owns the canonical receivers, with the wider key vocabulary.
      if (CANONICAL_RECEIVERS.includes(receiver)) continue;
      const bindings = byName.get(receiver);
      if (!bindings) continue;
      let nearest = null;
      for (const binding of bindings) {
        if (binding.at < match.index) nearest = binding;
        else break;
      }
      if (nearest && nearest.isRules) add(key, rel);
    }
  }
  return new Map([...hits.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([key, set]) => [key, [...set].sort()]));
}

/**
 * The two-way audit. Pure set arithmetic so the tests below can drive it with
 * synthetic inputs and prove it reds (guard the guard).
 *
 * `virtualRows` and `certPending` are REQUIRED rather than defaulted: a caller that
 * forgot them would silently disable direction 3, which is the same shape of
 * blindness direction 3 exists to remove. Omitting them throws.
 *
 * @param {{
 *   reads: ReadonlyArray<string>,
 *   manifest: ReadonlyArray<string>,
 *   census: ReadonlyArray<string>,
 *   exempt: ReadonlyArray<string>,
 *   backlog: ReadonlyArray<string>,
 *   pending: ReadonlyArray<string>,
 *   virtualRows: ReadonlyArray<string>,
 *   certPending: ReadonlyArray<string>,
 * }} input
 */
export function auditEngineGatedKeys({
  reads, manifest, census, exempt, backlog, pending, virtualRows, certPending,
}) {
  if (!Array.isArray(virtualRows) || !Array.isArray(certPending)) {
    throw new TypeError('auditEngineGatedKeys: virtualRows and certPending are required '
      + '(CR-WR10-C item 4 direction 3 — a manifest entry without its certification row)');
  }
  const sorted = (list) => [...list].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const readSet = new Set(reads);
  const censusSet = new Set(census);
  const exemptSet = new Set(exempt);
  const backlogSet = new Set(backlog);
  // Direction 1: a manifest member the engine does not actually gate on.
  const manifestWithoutRead = sorted(manifest.filter((key) => !readSet.has(key)));
  // Direction 2: a gated key accounted for by nothing.
  const unaccountedReads = sorted(reads.filter((key) => !censusSet.has(key)
    && !exemptSet.has(key) && !backlogSet.has(key)));
  // A list naming a key nothing gates on has gone stale.
  const staleExempt = sorted(exempt.filter((key) => !readSet.has(key)));
  const staleBacklog = sorted(backlog.filter((key) => !readSet.has(key)));
  // A backlog key that reached the census is a burn-down win the list did not bank.
  const backlogInCensus = sorted(backlog.filter((key) => censusSet.has(key)));
  // CR-WR10-C item 4: a pending key that is now gated must join the manifest in the
  // SAME commit as its first gate read.
  const pendingAlreadyRead = sorted(pending.filter((key) => readSet.has(key)));
  // DIRECTION 3, the row half of the same one-commit law, stated as the virtual lane's
  // own contract states it. A manifest entry is what puts a virtual key INTO the
  // certification census, so manifesting IS the act that comes due: the key owes an
  // authored row in VIRTUAL_SUBSYSTEM_ROWS, and it may not stand in any lane's pending
  // list. The second half is the one the totality partition cannot see — "manifested
  // here, pending over there" satisfies the partition and breaks the virtual contract.
  const virtualRowSet = new Set(virtualRows);
  const certPendingSet = new Set(certPending);
  const manifestWithoutRow = sorted(manifest.filter((key) => !virtualRowSet.has(key)));
  const manifestStillPending = sorted(manifest.filter((key) => certPendingSet.has(key)));
  return {
    ok: manifestWithoutRead.length === 0 && unaccountedReads.length === 0
      && staleExempt.length === 0 && staleBacklog.length === 0
      && backlogInCensus.length === 0 && pendingAlreadyRead.length === 0
      && manifestWithoutRow.length === 0 && manifestStillPending.length === 0,
    manifestWithoutRead,
    unaccountedReads,
    staleExempt,
    staleBacklog,
    backlogInCensus,
    pendingAlreadyRead,
    manifestWithoutRow,
    manifestStillPending,
  };
}

const sourceFiles = walk(join(ROOT, 'src'))
  .filter((p) => /\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }));
const gateReads = scanGateReads(sourceFiles);
const readKeys = [...gateReads.keys()];

const virtualRowKeys = VIRTUAL_SUBSYSTEM_ROWS.map((row) => row.rule);

const liveAudit = () => auditEngineGatedKeys({
  reads: readKeys,
  manifest: ENGINE_GATED_VIRTUAL_RULE_KEYS,
  census: simulationRuleKeys(),
  exempt: Object.keys(EXEMPT_RULE_KEYS),
  backlog: Object.keys(BACKLOG_RULE_KEYS),
  pending: PENDING_MANIFEST_KEYS,
  virtualRows: virtualRowKeys,
  certPending: SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
});

describe('engine-gated rule keys (the census-invisible subsystem class)', () => {
  test('guard the guard: the scanner sees code and only code', () => {
    const planted = [
      '/** rules.docCommentEnabled === true is prose about a gate. */',
      "const help = 'rules.stringLiteralEnabled === true';",
      'const t = `rules.templateEnabled === true`;',
      '// rules.lineCommentEnabled === true',
      'if (rules.bareReceiverEnabled === true) run();',
      'if (/** @type {Record<string, unknown>} */ (rules).castReceiverEnabled === true) run();',
      'if (worldState?.simulationRules?.optionalChainEnabled === true) run();',
      'if (rules.notAGate !== true) skip();',
      // ── GAP-1's arms 2 and 3, each driven POSITIVELY so an arm cannot be deleted
      //    silently, and each decoy below driven NEGATIVELY in its real spelling.
      'const g2expr = (context.simulationRules || worldState?.simulationRules || {}).exprReceiverEnabled === true;',
      'const rr = /** @type {Record<string, unknown>} */ (rules);',
      'if (rr.aliasReceiverEnabled === true) run();',
      'const priorRules = (thing.simulationRules || {});',
      'const renamed = priorRules.renamedLocalEnabled === true;',
      // DECOYS — the three real non-gate receivers measured in src/ (a settlement
      // generator config, a function option, and arg forwarding). A detector that
      // admits any of these re-opens the blindness in the opposite direction.
      'const d1 = config?.ancientRuinsEnabled === true;',
      'const d2 = options?.appetiteEnabled === true;',
      'const d3 = args.dispositionEnabled === true;',
      // DECOY — GUARD 1: an unbounded receiver alternation matches the `r` inside
      // `return` and inside `rosterEntry`, which is how the prototype produced two
      // false positives on the live tree.
      'const gone = () => { return leash.revealedEnabled === true; };',
      'const g = rosterEntry ? rosterEntry.isGoverningEnabled === true : false;',
      // DECOY — GUARD 2: a REBOUND short name whose nearest preceding binding is not
      // the rules cast. A file-wide alias set would attribute this to the rules object.
      'const rr2 = asObject(raw[k]);',
      'const scoped = rr2.rebound0Enabled === true;',
      // DECOY — the member-chain bridge arm 2's tail forbids: `bEnabled` belongs to
      // `x`, not to `rules`, and no arm may attribute it here.
      'const bridged = rules.leftEnabled === true && x.rightEnabled === true;',
    ].join('\n');
    const found = [...scanGateReads([{ rel: 'planted.js', src: planted }]).keys()];
    // The SIX code spellings, and nothing from the prose, negative and receiver decoys.
    // Stated as an EXACT array rather than as bare collection negatives: this file's
    // anchor ceiling is ZERO, so `not.toContain` would red the negative-assertion
    // anchor walker, and an exact equality is the stronger claim anyway — it fails on
    // an unexpected ADDITION as loudly as on a missing expectation.
    expect(found).toEqual([
      'aliasReceiverEnabled',
      'bareReceiverEnabled',
      'castReceiverEnabled',
      'exprReceiverEnabled',
      'leftEnabled',
      'optionalChainEnabled',
      'renamedLocalEnabled',
    ]);
  });

  test('guard the guard: the auditor reds on every failure shape', () => {
    const base = {
      reads: ['aEnabled', 'bEnabled', 'cEnabled'],
      manifest: ['aEnabled'],
      census: ['aEnabled', 'bEnabled'],
      exempt: ['cEnabled'],
      backlog: [],
      pending: ['dEnabled'],
      virtualRows: ['aEnabled'],
      certPending: [],
    };
    expect(auditEngineGatedKeys(base).ok, 'a clean audit must pass, or every red below is meaningless').toBe(true);

    // 1. DIRECTION ONE — a manifest member nothing gates on (the fiction direction).
    const fiction = auditEngineGatedKeys({ ...base, manifest: ['aEnabled', 'inventedEnabled'] });
    expect(fiction.ok).toBe(false);
    expect(fiction.manifestWithoutRead).toEqual(['inventedEnabled']);

    // 2. DIRECTION TWO — a NEW dark gate accounted for by nothing (the blindness
    //    direction, and the one this walker exists for).
    const hidden = auditEngineGatedKeys({ ...base, reads: [...base.reads, 'freshDarkLayerEnabled'] });
    expect(hidden.ok).toBe(false);
    expect(hidden.unaccountedReads).toEqual(['freshDarkLayerEnabled']);

    // 3. A stale exemption: a rationale for a gate that no longer exists.
    const staleExempt = auditEngineGatedKeys({ ...base, exempt: ['cEnabled', 'retiredEnabled'] });
    expect(staleExempt.ok).toBe(false);
    expect(staleExempt.staleExempt).toEqual(['retiredEnabled']);

    // 4. A stale backlog row.
    const staleBacklog = auditEngineGatedKeys({ ...base, backlog: ['goneEnabled'] });
    expect(staleBacklog.ok).toBe(false);
    expect(staleBacklog.staleBacklog).toEqual(['goneEnabled']);

    // 5. A backlog key that reached the census: the burn-down win must be banked.
    const banked = auditEngineGatedKeys({ ...base, exempt: [], backlog: ['bEnabled', 'cEnabled'] });
    expect(banked.ok).toBe(false);
    expect(banked.backlogInCensus).toEqual(['bEnabled']);

    // 6. CR-WR10-C item 4 — the pending key gained its first gate read, so the
    //    manifest move is owed IN THIS COMMIT.
    const wired = auditEngineGatedKeys({ ...base, reads: [...base.reads, 'dEnabled'] });
    expect(wired.ok).toBe(false);
    expect(wired.pendingAlreadyRead).toEqual(['dEnabled']);

    // 7. DIRECTION 3a — the manifest entry landed and its virtual row did not.
    const unrowed = auditEngineGatedKeys({ ...base, manifest: ['aEnabled', 'bEnabled'] });
    expect(unrowed.ok).toBe(false);
    expect(unrowed.manifestWithoutRow).toEqual(['bEnabled']);

    // 8. DIRECTION 3b — THE SHAPE THAT ACTUALLY SHIPPED A RED, and the reason 3a alone
    //    would have been theatre. The key is manifested AND its obligation is parked as
    //    a declared pending entry in another lane file. That partition is legal, so
    //    subsystemCertificationTotality.walker passes it; the virtual lane's contract
    //    forbids it, so a DOMAIN suite reds while every lint walker stays green. Both
    //    halves are asserted here because the pending entry is what makes 3a's row
    //    absence look accounted-for.
    const parked = auditEngineGatedKeys({
      ...base, manifest: ['aEnabled', 'bEnabled'], certPending: ['bEnabled'],
    });
    expect(parked.ok).toBe(false);
    expect(parked.manifestWithoutRow).toEqual(['bEnabled']);
    expect(parked.manifestStillPending).toEqual(['bEnabled']);

    // 9. A manifested key that DOES carry its row but was left in a pending list too
    //    (the half-finished conversion) reds on the pending arm alone.
    const rowedAndPending = auditEngineGatedKeys({ ...base, certPending: ['aEnabled'] });
    expect(rowedAndPending.ok).toBe(false);
    expect(rowedAndPending.manifestWithoutRow).toEqual([]);
    expect(rowedAndPending.manifestStillPending).toEqual(['aEnabled']);

    // 10. THE VACUITY DIRECTION: an emptied virtual-rows list must red every manifest
    //     member rather than silently satisfying the check.
    const emptyRows = auditEngineGatedKeys({ ...base, virtualRows: [] });
    expect(emptyRows.ok).toBe(false);
    expect(emptyRows.manifestWithoutRow).toEqual(['aEnabled']);

    // 11. And the inputs are REQUIRED. A caller that omitted them would disable
    //     direction 3 silently, which is the blindness shape this direction removes.
    expect(() => auditEngineGatedKeys({ ...base, virtualRows: undefined })).toThrow(TypeError);
    expect(() => auditEngineGatedKeys({ ...base, certPending: undefined })).toThrow(TypeError);
  });

  test('the live scan is non-vacuous and reaches BOTH gate spellings', () => {
    // A scan that silently emptied would make every assertion below trivially true.
    // The floors sit under today's measurement (70 keys across the tree, re-derived by
    // GAP-1 when the detector widened from one receiver arm to three; it was 51 when
    // this comment was first written and 63 immediately before the widening) so
    // ordinary retirement does not red the walker while a collapsed scan still does.
    // The floor stays 40: it is a COLLAPSE detector, never a ceiling.
    expect(sourceFiles.length).toBeGreaterThan(200);
    expect(readKeys.length).toBeGreaterThanOrEqual(40);
    // POSITIVE CONTROL, bare receiver: `rules.warLayerEnabled === true`.
    expect(readKeys).toContain('warLayerEnabled');
    // POSITIVE CONTROL, JSDoc-cast receiver: `(rules).seaRoadsEnabled === true`. This
    // is the spelling a narrower regex misses, and missing it is what under-measured
    // the blast radius before this walker existed. Fifteen of the seventeen backlog
    // keys are only visible through it.
    expect(readKeys).toContain('seaRoadsEnabled');
    // POSITIVE CONTROL, optional chain: `rules?.economicCoupReadEnabled === true`.
    expect(readKeys).toContain('economicCoupReadEnabled');
    // ── GAP-1's three NON-CANONICAL receiver shapes, one live positive control each, so
    //    an arm cannot be deleted without reddening here. Each names a real gate at a
    //    real site rather than a synthetic one, which is what makes them controls on
    //    the LIVE scan rather than a second copy of the guard-the-guard test above.
    //
    // ⚠ This test's TITLE still says "BOTH gate spellings" and the count is now higher
    // than two. The title is left EXACTLY as it stands on purpose: GAP-1 is census-
    // NEUTRAL by ruling (OWNER_DECISION_QUEUE §32 ruling 2), the estate-wide lighting
    // census pins literal test titles by exact equality, and re-wording this one would
    // move the tuple and take the estate's single census reservation for a legibility
    // gain. The cost is recorded here rather than smoothed away.
    //
    // ARM 3, alias local: `const r = /** @type … */ (rules); r.settlementPoliticsEnabled === true`
    // at src/domain/worldPulse/settlementPolitics.js.
    expect(readKeys).toContain('settlementPoliticsEnabled');
    // ARM 2, defaulted parenthesised expression:
    // `(context.simulationRules || worldState?.simulationRules || {}).underwaysOrganicFoundingEnabled === true`
    // at src/domain/worldPulse/institutionLifecycle.js.
    expect(readKeys).toContain('underwaysOrganicFoundingEnabled');
    // ARM 3, renamed local bound from a `.simulationRules` access:
    // `const priorRules = (… .simulationRules || {}); priorRules.biomeTruthEnabled === true`
    // at src/store/campaignSpatialCanonize.js.
    expect(readKeys).toContain('biomeTruthEnabled');

    // ⛔⛔ THE NEGATIVE HALF, AND IT IS WHY THIS ARM EXISTS (lane L-CHAIR-901). The header
    // used to record the frozen-list conjunction as having ZERO live instances — "a pin over
    // an empty population, the recorded vacuity class". That was false on this tree, and a
    // prose paragraph is where a measurement goes to rot. So the population is COUNTED here
    // instead, and the header now points at this arm rather than at a remembered number.
    //
    // ⚠ THIS ARM DELIBERATELY DOES NOT WIDEN THE CENSUS. It measures the class the three
    // receiver arms above CANNOT see and asserts it is non-empty; it adds no key to
    // `readKeys`. Opening a fourth arm would pull unmanifested keys into the census, and a
    // censusable key owes an authored certification row in the same commit — a register act,
    // and a chair call. Recorded rather than taken.
    const computedGates = [];
    for (const { rel, src } of sourceFiles) {
      const code = codeOnly(src);
      code.split('\n').forEach((line, i) => {
        // A COMPUTED member access compared strictly to true. The key is an expression, so
        // no single-token receiver arm can attribute it — that is the whole blind spot.
        if (/\[\s*[A-Za-z_$][\w$.]*\s*\]\s*===\s*true/.test(line)) computedGates.push(`${rel}:${i + 1}`);
      });
    }
    // The FLOOR, not a ceiling: this is a collapse detector like the ones above it. It sits
    // under the measured population so ordinary churn cannot red it.
    expect(computedGates.length,
      'the computed-access class has collapsed to nothing — either the scanner broke, or the'
      + ' class really was closed and this arm plus the header paragraph must be re-ruled'
      + ' together, never one without the other').toBeGreaterThanOrEqual(8);
    // ⭐ THE THREE ANCHORS ARE ADDRESSES, NOT A COUNT. L-HOMES-7 named the first; the other
    // two were measured beside it. Each is a single-key rules gate whose key is NOT a
    // manifest member, so each is a live key this census cannot see.
    expect(computedGates, 'characterDrift.js:273 is the instance L-HOMES-7 named')
      .toContain('src/domain/npc/characterDrift.js:273');
    expect(computedGates).toContain('src/domain/worldPulse/institutionStatusModel.js:274');
    expect(computedGates).toContain('src/domain/townScene/cartographyContract.js:618');
    // …and the FROZEN-LIST CONJUNCTION proper, the sub-shape the header named. Four live
    // rules-gating sites; asserted by address so a deletion re-opens the question here.
    const conjunctions = [];
    for (const { rel, src } of sourceFiles) {
      const code = codeOnly(src);
      code.split('\n').forEach((line, i) => {
        if (/\.every\s*\(\s*\(?\s*([A-Za-z_$][\w$]*)\s*\)?\s*=>\s*[A-Za-z_$][\w$.?]*\s*\[\s*\1\s*\]\s*===\s*true/.test(line)) {
          conjunctions.push(`${rel}:${i + 1}`);
        }
      });
    }
    expect(conjunctions,
      'the frozen-list conjunction is the shape the header called empty; it is not')
      .toContain('src/domain/worldPulse/conquestDoctrineStage.js:139');
    expect(conjunctions).toContain('src/domain/worldPulse/sovereigntyAssets.js:85');
    // ANCHORED, and the anchor is the discrimination rather than a comment: the conjunction
    // scan is STRICTLY NARROWER than the computed-access scan it lives inside, so a regex
    // that had degenerated into matching every line would fail here instead of passing both.
    expect(conjunctions.length).toBeLessThan(computedGates.length);
    // ⛔ AND THE ONE MANIFEST MEMBER AMONG THEM REACHES THE CENSUS BY ITS OTHER SPELLING.
    // `sovereigntyTradeEnabled` is gated at :85 through the conjunction — invisible here —
    // and at :84 by name, which is the read this census actually sees. Without this line the
    // paragraph above would be a story; with it, the mechanism is executed.
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS).toContain('sovereigntyTradeEnabled');
    expect(readKeys, 'sovereigntyTradeEnabled reaches the census through its by-name read')
      .toContain('sovereigntyTradeEnabled');
    const driftMsg = 'characterDriftEnabled is gated ONLY through a computed access, so it'
      + ' must NOT appear in this census — if it does, a fourth arm landed and every key it'
      + ' newly reaches owes an authored certification row in this same commit';
    // anchored: the two lines above prove readKeys is populated AND contains the manifest member sovereigntyTradeEnabled, so this absence is a fact about the computed-access blind spot rather than about an empty scan.
    expect(readKeys, driftMsg).not.toContain('characterDriftEnabled');
  });

  test('the manifest holds against the tree in BOTH directions', () => {
    const audit = liveAudit();
    expect(
      audit,
      'engine-gated rule-key manifest broken.\n'
      + `  manifest members the engine does not gate on: ${audit.manifestWithoutRead.join(', ') || 'none'}\n`
      + `  gated keys accounted for by nothing (manifest them, exempt them with a reason, or — never — hide them): ${audit.unaccountedReads.join(', ') || 'none'}\n`
      + `  exemptions for gates that no longer exist: ${audit.staleExempt.join(', ') || 'none'}\n`
      + `  backlog rows for gates that no longer exist: ${audit.staleBacklog.join(', ') || 'none'}\n`
      + `  backlog rows whose key reached the census (bank the win, delete the row): ${audit.backlogInCensus.join(', ') || 'none'}\n`
      + `  pending keys that gained a gate read (CR-WR10-C item 4 — move into ENGINE_GATED_VIRTUAL_RULE_KEYS in THIS commit): ${audit.pendingAlreadyRead.join(', ') || 'none'}\n`
      + `  manifest members with NO authored row in subsystemRowsVirtual.js (CR-WR10-C item 4's row half — author it in THIS commit): ${audit.manifestWithoutRow.join(', ') || 'none'}\n`
      + `  manifest members ALSO standing in a lane's pending list (manifesting is what makes a virtual key censusable, so it is the act that comes due — delete the pending entry): ${audit.manifestStillPending.join(', ') || 'none'}`,
    ).toMatchObject({
      ok: true,
      manifestWithoutRead: [],
      unaccountedReads: [],
      staleExempt: [],
      staleBacklog: [],
      backlogInCensus: [],
      pendingAlreadyRead: [],
      manifestWithoutRow: [],
      manifestStillPending: [],
    });
    // NON-VACUITY for direction 3, in both of its own directions. The row arm is
    // fail-loud by construction (an emptied virtual-rows list reds every manifest
    // member, proven synthetically above), but the pending arm measures an ABSENCE and
    // an absence can go vacuous by the pending list emptying. So the live pending list
    // is asserted POPULATED here: it really does carry a key today, and that key really
    // is not manifested, which is what makes the intersection a measurement.
    expect(virtualRowKeys.length, 'the virtual lane is populated').toBeGreaterThan(0);
    expect(
      SUBSYSTEM_CERTIFICATION_PENDING_KEYS.length,
      'the pending arm measures an intersection against a NON-EMPTY list, or it proves nothing',
    ).toBeGreaterThan(0);
    // And the registry composition is the reason the virtual list is the right authority
    // to measure against: every virtual row reaches the registry the census reads.
    for (const key of virtualRowKeys) {
      expect(
        SUBSYSTEM_CERTIFICATION_REGISTRY.some((row) => row.rule === key),
        `${key} is authored in the virtual lane but did not reach SUBSYSTEM_CERTIFICATION_REGISTRY`,
      ).toBe(true);
    }
  });

  test('every REGISTER member reached the census, and the register is a set', () => {
    // ⭐ RE-CUT 2026-09-05 (lane LGT-P2-MANIFEST). This arm was titled "the manifest is
    // VIRTUAL keys only" and DEMANDED that a key declared by any preset be DELETED from
    // ENGINE_GATED_VIRTUAL_RULE_KEYS. That demand is the reason the estate's two lighting
    // contracts INVERT the moment a class-F key lights: both read BUILD STATE off this
    // list, so a deleted-because-lit key reads back as UNBUILT (tradeConvergenceContract's
    // R6 join) and its evidenced row reads back as FABRICATED. Registration is a fact about
    // `src/` and lighting does not change it, so ⛔ A KEY MAY NOW BE LIT WITHOUT BEING
    // DELETED, keeping its certification row; the dark question moved to
    // ENGINE_GATED_DORMANT_RULE_KEYS, which the split arm below measures.
    //
    // ⛔ AND THE DELETION DEMAND IS NOT MERELY GONE — ITS ABSENCE IS ASSERTED. If some
    // later lane restores it, the split arm's synthetic LIT polarity still passes (it
    // measures the derivation, not this list), so the guard against a re-collapse is the
    // containment there plus the census read here: a registered key stays censusable, and
    // that is exactly what a deletion would break.
    const census = simulationRuleKeys();
    for (const key of ENGINE_GATED_VIRTUAL_RULE_KEYS) {
      expect(census, `${key} is registered but did not reach the census`).toContain(key);
    }
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS.length).toBeGreaterThan(0);
    expect(new Set(ENGINE_GATED_VIRTUAL_RULE_KEYS).size).toBe(ENGINE_GATED_VIRTUAL_RULE_KEYS.length);

    // ── THE SPLIT — darkness is DERIVED, and lighting never deletes a register row ──
    // ⛔ THIS RIDES THE EXISTING TITLE RATHER THAN A NEW ONE, AND THE REASON IS MEASURED,
    // not stylistic. A `test()` added to THIS file does not cost one title: twelve other
    // suites `import { codeOnly }` from it, which re-evaluates this module and RE-REGISTERS
    // every suite inside each of theirs, so one new title here is THIRTEEN runtime titles
    // on the lighting census and the ratchet's totalTests. Measured on this car: a
    // 13-file battery moved 264 → 269 tests for a single added title, the +5 being this
    // file plus the four importers in that battery. (The docblock beside the `codeOnly`
    // re-export says TEN importers; the tree carries TWELVE — re-measured here.) A car
    // whose whole promise is a zero-footprint landing does not spend thirteen census rows
    // on a title, so the two claims share one. Assertions run in order, so a failure below
    // still names itself.
    // TWO ENGINES ON PURPOSE. `declared` is rebuilt here from the two rules surfaces with
    // this file's own loops rather than by calling the module's derivation, so the module
    // and the walker can only agree by both being right. Driving the module's own rule
    // against the module's own tables would agree with itself for free.
    const declared = new Set(
      Object.entries(DEFAULT_SIMULATION_RULES)
        .filter(([, value]) => typeof value === 'boolean')
        .map(([key]) => key),
    );
    for (const preset of Object.values(SIMULATION_RULE_PRESETS)) {
      for (const [key, value] of Object.entries(preset?.rules || {})) {
        if (typeof value === 'boolean') declared.add(key);
      }
    }
    const expectedDormant = ENGINE_GATED_VIRTUAL_RULE_KEYS.filter((key) => !declared.has(key));
    expect(
      [...ENGINE_GATED_DORMANT_RULE_KEYS],
      'the published dormant list disagrees with the surfaces it claims to be derived from',
    ).toEqual(expectedDormant);
    // THE INVARIANT, AS A CONTAINMENT: dormant ⊆ register, never the reverse.
    for (const key of ENGINE_GATED_DORMANT_RULE_KEYS) {
      expect(ENGINE_GATED_VIRTUAL_RULE_KEYS, `${key} is dormant but not registered`).toContain(key);
    }
    // NON-VACUITY, both sides. A derivation over an empty register, or over surfaces that
    // declare nothing, would satisfy every line above without measuring anything.
    expect(declared.size, 'no rules surface declares a boolean key').toBeGreaterThan(0);
    expect(ENGINE_GATED_DORMANT_RULE_KEYS.length, 'the dormant list is empty').toBeGreaterThan(0);

    // ⭐ GUARD THE GUARD, BOTH POLARITIES, ON SYNTHETIC SURFACES — the whole reason the
    // derivation takes its inputs. The register member below is DRIVEN into a preset and
    // must leave the dormant list; the same key declared non-boolean must stay. Neither
    // polarity is a literal, so the arm cannot rot into agreement with itself.
    const subject = ENGINE_GATED_VIRTUAL_RULE_KEYS[0];
    const darkArm = deriveDormantRuleKeys(
      ENGINE_GATED_VIRTUAL_RULE_KEYS,
      DEFAULT_SIMULATION_RULES,
      { synthetic: { rules: { [subject]: 'not a boolean' } } },
    );
    const litArm = deriveDormantRuleKeys(
      ENGINE_GATED_VIRTUAL_RULE_KEYS,
      DEFAULT_SIMULATION_RULES,
      { synthetic: { rules: { [subject]: true } } },
    );
    expect(darkArm, 'a non-boolean declaration is not a light').toContain(subject);
    // ANCHORED, and the anchor is the arm above rather than a comment: the two arms differ
    // ONLY in the planted value, so a derivation that returned [] for everything would red
    // on the dark arm instead of passing this absence for the wrong reason.
    expectPresentThenAbsent(darkArm, litArm, subject, 'a preset light leaves the dormant set');
    expect(litArm.length).toBe(darkArm.length - 1);
    // …and THE INVARIANT ITSELF, executed rather than asserted in prose: the REGISTER is
    // untouched by either arm. The lighting contracts read the register, so a lit key must
    // not vanish from it and must stay censusable.
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS, 'the derivation mutated the register').toContain(subject);
    expect(simulationRuleKeys(), 'a registered key must stay censusable').toContain(subject);

    // ── ⛔⛔ THE NO-FENCE ROSTER, DERIVED AT THE COMPOSITION (lane L-CHAIR-901) ────────────
    // ⭐ THE RULE THIS MAKES EXECUTABLE: every register member owes a DARK PROOF — a test
    // that constructs the dark state EXPLICITLY (a literal `false`, an absent key, or a named
    // DARK constant, never inherited from the default), asserts a bit-level dark claim, and
    // pairs it with a LIT CONTROL on the same fixture. Lane L-HOMES-3 (LGT-P13-FENCES) wrote
    // that rule and applied it by hand against a register of THIRTY members. The register is
    // now THIRTY-FIVE — SEAT-78 added `irregularForceEnabled` and LGT-P5-WOPS the four W-OPS
    // keys — so the hand derivation expired the moment those cars composed. It is re-derived
    // HERE, from the tree, on every gate, instead of being re-typed by the next lane.
    //
    // ⚠ A `tests/property/*DormancyFence.test.js` FILE IS ONE WAY TO PAY, NOT THE ONLY WAY,
    // and pretending otherwise would demand twelve files the estate has already ruled against
    // — `treatyRenewalEnabled` most sharply, whose chair judgment J-TC11-2
    // (tests/domain/treatyRenewalMemory.test.js) FORBIDS giving it a tests/property/ file. So
    // the roster below is the second, equally valid form: the key, and the ADDRESS of the
    // instrument that already carries its dark proof. The derivation reds when the two
    // disagree in EITHER direction.
    const NO_FENCE_DISPOSITIONS = Object.freeze({
      // The seven that predate the composition. Each verdict is L-HOMES-3's, re-checked here.
      habitConditioningEnabled: 'tests/property/habitNeutralIdentity.test.js',
      migrationRumorsEnabled: 'tests/property/migrationRumorsDormancyGolden.test.js',
      settlementPoliticsEnabled: 'tests/property/settlementPoliticsDormancyGolden.test.js',
      // ⛔ CHAIR-RULED, NOT MERELY UNFENCED: J-TC11-2 forbids a tests/property/ file here.
      treatyRenewalEnabled: 'tests/domain/treatyRenewalMemory.test.js',
      undercityHighWaterEnabled: 'tests/domain/undercityColonization.test.js',
      foreignSeatEnabled: 'tests/domain/foreignSeatDormancy.byteIdentity.test.js',
      legitimacyUpheavalEnabled: 'tests/domain/legitimacyUpheavalDormancy.byteIdentity.test.js',
      // The FIVE the composition added, each measured at this tip rather than assumed.
      // SEAT-78's key: explicit `false`, raw-byte identity, and a named LIT ANTI-VACUITY arm.
      irregularForceEnabled: 'tests/domain/irregularForceDormancy.byteIdentity.test.js',
      // ⭐ AND THE FOUR W-OPS KEYS ARE FENCED AT THE FAMILY GATE, WHICH IS WHERE THEIR READ
      // LIVES. None of the four leaves holds its own gate: `infiltrationDepthEnabled`,
      // `missionDispatcherEnabled` and `operationsVoiceEnabled` are read by name in
      // espionage/espionageGate.js (:116, :147, :177) and `envoyTaskCatalogEnabled` in
      // errandMint.js:108. A fence in the LEAF would therefore pin a module with no gate in
      // it. Each suite below drives its key false against a fully lit world, asserts the dark
      // verdict, pairs it with the lit control, AND drives the conjunction — a lit key over a
      // dark layer stays dark — which is the arm a leaf-local fence could not have written.
      infiltrationDepthEnabled: 'tests/domain/infiltrationDepth.test.js',
      missionDispatcherEnabled: 'tests/domain/missionDispatcher.test.js',
      operationsVoiceEnabled: 'tests/domain/operationsVoice.test.js',
      envoyTaskCatalogEnabled: 'tests/domain/envoyTaskCatalog.test.js',
      // FP IN-2 (lane FP-I, 2026-09-24): its brief places the four fences and the lit-mutant
      // control in the wave's own acceptance file, beside the spring they fence.
      infoLureEnabled: 'tests/domain/infoLureIn2.test.js',
      // FP IN-4 commit 1 (lane FP-I2, 2026-09-24; J-INA-4): the invisible key declared. Its dark
      // proof predates the declaration: the D-3 dormancy golden drives the gate ABSENT through a
      // fully lit substrate (beliefs, statecraft, constructive flows, bonded and trade edges),
      // hashes the projection, and carries its lit control on the same fixture.
      intelTradeEnabled: 'tests/property/intelTradeDormancyGolden.test.js',
      // FP TR-2 (lane FP-D, 2026-09-23): the register's THIRTY-SIXTH member. Its brief places
      // the four fences and the lit-mutant control in the wave's own acceptance file.
      merchantHousesEnabled: 'tests/domain/houseLedgerTr2.test.js',
      // FP TR-3 (lane FP-D2, 2026-09-24): the register's THIRTY-SEVENTH member, on TR-2's
      // footing — the four fences, the pulse hash arm and the lit-mutant control live in the
      // wave's own acceptance file.
      believedMarketsEnabled: 'tests/domain/believedMarketsTr3.test.js',
      // FP GR-6 (lane FP-B2, 2026-09-24): the register's THIRTY-SEVENTH member, on TR-2's reading:
      // its brief places the four fences and the lit-mutant control in the wave's own
      // acceptance file.
      mediationGeneralizedEnabled: 'tests/domain/mediationGeneralizedGr6.test.js',
    });
    const fenceFiles = walk(join(ROOT, 'tests/property'))
      .filter((p) => /DormancyFence\.test\.js$/.test(p))
      .map((p) => readFileSync(p, 'utf8'));
    // NON-VACUITY FIRST: a fence sweep that found nothing would put every key on the roster
    // and the equality below would still be satisfiable by editing the roster to match.
    expect(fenceFiles.length, 'the dormancy-fence sweep found no fence files at all')
      .toBeGreaterThanOrEqual(19);
    const derivedNoFence = ENGINE_GATED_VIRTUAL_RULE_KEYS
      .filter((key) => !fenceFiles.some((text) => text.includes(key)));
    expect([...derivedNoFence].sort(),
      'the register and the no-fence roster have drifted. A key that APPEARS here gained a'
      + ' manifest entry without a dormancy fence and without a written disposition — give it'
      + ' a fence, or add its dark-proof address to NO_FENCE_DISPOSITIONS. A key that VANISHES'
      + ' here gained a fence and must leave the roster, or the roster protects nothing.')
      .toEqual(Object.keys(NO_FENCE_DISPOSITIONS).sort());
    // EVERY ADDRESS IS LIVE AND NAMES ITS KEY. A disposition pointing at a file that no longer
    // mentions the key is the dead-citation class: it reads as coverage and is not.
    const rotted = Object.entries(NO_FENCE_DISPOSITIONS).filter(([key, address]) => {
      const full = join(ROOT, address);
      if (!existsSync(full)) return true;
      return !readFileSync(full, 'utf8').includes(key);
    });
    expect(rotted.map(([key, address]) => `${key} -> ${address}`),
      'a no-fence disposition names a file that is gone, or that has stopped naming its key')
      .toEqual([]);
  });

  test('every exemption carries a rationale, and the backlog is exact and shrink-only', () => {
    for (const [key, rationale] of Object.entries(EXEMPT_RULE_KEYS)) {
      // An exemption without a written reason is a shrug, and a shrug is how a real
      // subsystem escapes certification wearing a policy's clothes (R19).
      expect(typeof rationale, `${key}: exemption rationale must be prose`).toBe('string');
      expect(rationale.length, `${key}: exemption rationale is too thin to review`).toBeGreaterThan(120);
      expect(gateReads.get(key), `${key} is exempted but nothing gates on it`).toBeTruthy();
    }
    for (const [key, note] of Object.entries(BACKLOG_RULE_KEYS)) {
      expect(note.length, `${key}: backlog rows name the layer they defer`).toBeGreaterThan(20);
      expect(gateReads.get(key), `${key} is backlogged but nothing gates on it`).toBeTruthy();
    }
    // EXACT, not a ceiling: the backlog equals the measured set of gated-but-uncensused
    // keys minus the exemptions. A new dark gate cannot join it silently (it reds as
    // unaccounted above), and a key that earned its manifest entry must be deleted from
    // it rather than left to rot.
    const censusSet = new Set(simulationRuleKeys());
    const measuredGap = readKeys
      .filter((key) => !censusSet.has(key) && !(key in EXEMPT_RULE_KEYS))
      .sort();
    expect(
      Object.keys(BACKLOG_RULE_KEYS).sort(),
      'the backlog must equal the measured gated-but-uncensused set exactly — bank wins by deleting rows, never by widening the list',
    ).toEqual(measuredGap);
    // The ceiling is the burn-down marker, never the guard. Lower it whenever a key
    // earns its manifest entry and its certification row; never raise it.
    // 17 → 16 at FP IN-4 commit 1 (lane FP-I2, 2026-09-24; J-INA-4, SR-1): `intelTradeEnabled`
    // earned its manifest entry and its authored row, so its backlog row is deleted (the burn-down
    // win banked, never widened) and the ceiling follows the list down.
    expect(Object.keys(BACKLOG_RULE_KEYS).length).toBeLessThanOrEqual(16);
  });

  test('the pending manifest key is the recorded next step, not a red', () => {
    // Both absences below are anchored by the non-vacuity test above: it proves the
    // scan is populated and reaches all three gate spellings, and the manifest test
    // proves ENGINE_GATED_VIRTUAL_RULE_KEYS is non-empty. Neither can go vacuous by
    // the collection emptying, so they are stated as booleans rather than as bare
    // collection negatives.
    for (const key of PENDING_MANIFEST_KEYS) {
      expect(
        readKeys.includes(key),
        `${key} now has a gate read. CR-WR10-C item 4: it joins ENGINE_GATED_VIRTUAL_RULE_KEYS in the SAME commit as that read, with its certification row — certification tracks reality instead of preceding it.`,
      ).toBe(false);
      expect(
        ENGINE_GATED_VIRTUAL_RULE_KEYS.includes(key),
        `${key} is in the manifest but nothing gates on it yet — the manifest entry rides the gate read, not the other way round`,
      ).toBe(false);
    }
    // SHRINK-ONLY, AND NOW EMPTY — the list's single entry was banked by lane WW-A.
    // That makes the loop above vacuous by construction, so the burn-down is asserted
    // POSITIVELY instead of by an emptiness that could equally mean the list was
    // quietly cleared: the key that left this list is really gated, really in the
    // manifest, and really carries a certification row.
    expect(PENDING_MANIFEST_KEYS).toEqual([]);
    expect(readKeys, 'the banked key is genuinely gated in src/').toContain('sovereigntyTradeEnabled');
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS, 'and it is manifested').toContain('sovereigntyTradeEnabled');
    expect(
      SUBSYSTEM_CERTIFICATION_REGISTRY.some((row) => row.rule === 'sovereigntyTradeEnabled'),
      'and it carries its certification row (CR-WR10-C item 3: the row lands with the census growth)',
    ).toBe(true);
  });
});
