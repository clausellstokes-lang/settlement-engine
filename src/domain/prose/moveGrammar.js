/**
 * domain/prose/moveGrammar.js — THE TYPED MOVE VOCABULARY, the closed orders, and the
 * classifier that CHECKS a variant's tag (MOVE-GRAMMAR §1–§3).
 *
 * ── THE ONE IDEA ────────────────────────────────────────────────────────────────────
 * A MOVE is one typed assertion, drawn from a closed vocabulary, LICENSED by a named field.
 * A GRAMMAR is an ordered list of moves. A variant realises one grammar; a tab realises one
 * as the order of its mounts. The typed CLAIM is what the seed may never vary; the GRAMMAR
 * is what it must. Fault 35 is the law over all of it: no sampler, penalty or style
 * instruction produces the variation — the POOL'S DISPERSION does, and the grammar is
 * written into the variant at authoring time.
 *
 * ── THE TAG IS THE SOURCE; THE CLASSIFIER IS ONLY A CHECK ──────────────────────────
 * `grammar:` is DATA on the annex row beside `marks:` (§3.1), carried into the generated
 * leaf. This module defines the tag's SHAPE and the classifier that disagrees with it. The
 * classifier is an instrument and never a source: where tag and classifier disagree, arm A
 * reports the disagreement — it does not overwrite either.
 *
 * ⛔ THIS LANE TAGS NOTHING. Not one existing variant gains a `grammar:` key here; that is
 * the authoring wave's act on the annex, and the projection's contract test moves with it
 * (declared in `GRAMMAR_TAG_CONTRACT` below, so the two land together or neither does).
 *
 * ── WHAT THE CLASSIFIER IS WORTH, MEASURED ────────────────────────────────────────
 * It reads clause structure and slot references. It is a heuristic and its agreement with a
 * hand-tagged sample is MEASURED and PRINTED by the walker test, never assumed
 * (`tests/fixtures/grammarControls.js`, `HAND_TAGGED`). A classifier whose precision nobody measured is
 * the false-green instrument the estate has already burned.
 *
 * PURE, HEADLESS. Nothing here runs at the draw.
 */

/**
 * The eleven universal moves plus the two positional ones. The `licences` field names what
 * must be non-null for the move to be DRAWABLE on a block — a move whose licensing field is
 * null is not written empty, it is filtered out (§1.1).
 * @type {Readonly<Record<string, {asserts: string, licences: string}>>}
 */
export const MOVES = Object.freeze({
  PRESENT: Object.freeze({ asserts: 'the condition that stands', licences: 'a standing configuration field: the STATE-KEY, a band, a tier, a posture' }),
  HISTORY: Object.freeze({ asserts: 'what happened; a closed span', licences: 'an EVENT-PROVENANCE field only' }),
  PERSON: Object.freeze({ asserts: 'an office-holder as office, at most one recorded act', licences: 'a role: an office roll, `role`, `holderRole`' }),
  OBJECT: Object.freeze({ asserts: 'a named thing: the object, never the class', licences: 'a named-object field: `good`, `resource`, a built-fabric field' }),
  INSTITUTION: Object.freeze({ asserts: 'who holds, who counts, who is counted, what it does', licences: 'a row of the institution table; the predicate by a COLUMN value' }),
  CONTRADICTION: Object.freeze({ asserts: 'two records carry one fact differently', licences: 'a provenance field carrying TWO accounts' }),
  CONSEQUENCE: Object.freeze({ asserts: 'what an event cost, on a household, trade or office', licences: 'event provenance AND a household/office row (double-licensed)' }),
  GEOGRAPHY: Object.freeze({ asserts: 'where; the land, the route, neighbours by name', licences: 'a geography / terrain / route / dest field' }),
  TRADITION: Object.freeze({ asserts: 'a custom, a rite, a feast the world holds', licences: 'a custom/rite/creed field' }),
  OPEN: Object.freeze({ asserts: 'a civic matter left standing open; never an interrogative', licences: 'a state field whose value is unresolved / contested / pending' }),
  // ⭐ THE OWNER'S 2026-09-08 MOVE (SITTING §Q; MOVE-GRAMMAR §4.4.3, "the source of each
  // construction"). A fact has an in-world RECORD HOLDER, and naming that holder is an
  // assertion in its own right: a cited claim is TWO licensed claims, so it spends a budget
  // rather than riding along free. The licence is the holder table's KIND, which SEAM car 5b
  // derives per field; until that column exists arm A13 declares itself NOT-EXECUTABLE on
  // every licensing question and reports only the COUNT, which is what the sitting sets its
  // budget from.
  PROVENANCE: Object.freeze({ asserts: 'which record holds this fact, and therefore who counted it', licences: 'a holder KIND from the holder table, resolved to this town\'s institution' }),
  ABSENCE: Object.freeze({ asserts: 'what the record does not hold, or what the world has none of', licences: 'LACK a `none-exists` field · GAP a `not-held` field with provenance · LIMIT a computed flag' }),
  CLOSE: Object.freeze({ asserts: 'positional: the last move is a standing fact of a varied KIND', licences: 'positional: a KIND, never a position rule' }),
  LABEL: Object.freeze({ asserts: 'positional: the run-in label, the pointer, the route (chrome and docent only)', licences: 'the registry entry' }),
});

/**
 * The moves that do not exist ANYWHERE in the estate, with the arm that hunts each (§1.3).
 * Arm G's whole job.
 * @type {Readonly<Record<string, {why: string, detect: RegExp}>>}
 */
export const NON_MOVES = Object.freeze({
  FORECAST: Object.freeze({
    why: 'no field says what comes next; a bare future indicative is a FATE breach anywhere',
    detect: /\b(will|shall)\b(?!\s+(?:not\s+)?(?:have\s+)?been\b)/i,
  }),
  MEANING: Object.freeze({
    why: 'no field holds what a fact means; a second sentence is a second FACT or nothing',
    detect: /\b(which means|that means|in other words|the point (is|being)|what this means|the (meaning|significance) of)\b/i,
  }),
  VERDICT: Object.freeze({
    why: 'the record rates nothing; a rating word only where a typed rating field holds it',
    detect: /\b(admirabl\w*|shameful\w*|deserv\w+|wisely|foolish\w*|rightly|as it should be|a good thing|a bad thing|no more than \w+ deserves)\b/i,
  }),
  FEELING: Object.freeze({
    why: 'no field carries motive, belief or mood; the reaction is an ACT',
    detect: /\b(feels?|felt|resent\w*|hopes?|hoped|fears?|feared|longs? for|is proud|ashamed|delighted|bitter about|content with)\b/i,
  }),
  FIGURE: Object.freeze({
    why: 'the pools carry no simile slot; a comparison is a measurement in words',
    detect: /\b(like a |as if |as though |as a \w+ (does|would)|a kind of \w+ing)\b/i,
  }),
  SAYING: Object.freeze({
    why: 'no saying row exists in a typed table',
    detect: /\b(as the saying goes|they say here that|the old saying|as they put it here)\b/i,
  }),
});

/**
 * The dossier's closed LEVEL-1 set (§2.1) — the grammar a single variant can realise.
 * @type {Readonly<Record<string, {order: ReadonlyArray<string>, licences: string}>>}
 */
export const LEVEL1_ORDERS = Object.freeze({
  V1: Object.freeze({ order: Object.freeze(['PRESENT']), licences: 'the state key alone' }),
  V2: Object.freeze({ order: Object.freeze(['PRESENT', 'CONSEQUENCE']), licences: 'state key + a STRUCTURAL-consequence field' }),
  V3: Object.freeze({ order: Object.freeze(['PRESENT', 'ABSENCE']), licences: 'state key + a `none-exists` field (the LACK)' }),
  V4: Object.freeze({ order: Object.freeze(['OBJECT', 'PRESENT']), licences: 'a named object + the state key' }),
  V5: Object.freeze({ order: Object.freeze(['INSTITUTION', 'PRESENT']), licences: 'an institution row + the state key' }),
  V6: Object.freeze({ order: Object.freeze(['PRESENT', 'OPEN']), licences: 'a state key whose value is unresolved; NOT-EXECUTABLE today (no typed field, SITTING A12)' }),
  V7: Object.freeze({ order: Object.freeze(['HISTORY', 'PRESENT']), licences: 'R2 only: event provenance + the state key, the joint chosen' }),
  V8: Object.freeze({ order: Object.freeze(['PRESENT', 'ABSENCE']), licences: 'state key + a `not-held` field with provenance (the GAP)' }),
});

/**
 * The dossier's LEVEL-2 set — the order of a tab's mounts (§2.1). Level 2 is
 * `changesShippedSurface: true` and OWNER-GATED under THE PROMISE until the
 * fingerprint-inputs receipt exists (Part B §10 item 12), so nothing here draws anything.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const LEVEL2_ORDERS = Object.freeze({
  E1: Object.freeze(['PRESENT', 'HISTORY', 'PERSON', 'CONTRADICTION']),
  E2: Object.freeze(['PERSON', 'OBJECT', 'HISTORY', 'INSTITUTION']),
  E3: Object.freeze(['GEOGRAPHY', 'CONSEQUENCE', 'TRADITION']),
  E4: Object.freeze(['PRESENT', 'HISTORY', 'OPEN']),
  E5: Object.freeze(['INSTITUTION', 'PRESENT']),
  E6: Object.freeze(['OBJECT', 'PERSON', 'PRESENT']),
});

/**
 * The ten order constraints — the WALLS of every grammar (§1.4), each SCOPED as the chair's
 * sitting ruled (SITTING B.4.1: walls 4, 5, 6, 9 and 10 belong to the registers that
 * re-derived them; "the ten walls stand" reads "stand, five of them scoped").
 * @type {ReadonlyArray<{id: number, wall: string, scope: ReadonlyArray<string>}>}
 */
export const WALLS = Object.freeze([
  Object.freeze({ id: 1, wall: 'STATE precedes CAUSE where both appear', scope: Object.freeze(['*']) }),
  Object.freeze({ id: 2, wall: 'THRESHOLD / EDGE is always conditional or subjunctive', scope: Object.freeze(['*']) }),
  Object.freeze({ id: 3, wall: 'ABSENCE never opens and never sits beside another ABSENCE', scope: Object.freeze(['*']) }),
  Object.freeze({ id: 4, wall: 'BILL never immediately follows DEED within one sentence', scope: Object.freeze(['herald']) }),
  Object.freeze({ id: 5, wall: 'CONTRAST only where a sibling pool key or band names the rejected alternative', scope: Object.freeze(['dossier']) }),
  Object.freeze({ id: 6, wall: 'QUALIFY never as a "which" tail; never a third sentence', scope: Object.freeze(['dossier']) }),
  Object.freeze({ id: 7, wall: 'the last move is a standing fact the table could act on: the reaction point', scope: Object.freeze(['*']) }),
  Object.freeze({ id: 8, wall: 'GESTURE at most one in a Herald headline', scope: Object.freeze(['herald']) }),
  Object.freeze({ id: 9, wall: 'RECALL at most once per letter section; LIMIT never twice on one surface', scope: Object.freeze(['chronicle']) }),
  Object.freeze({ id: 10, wall: 'the settlement token opens at most one variant per pool, never two adjacent', scope: Object.freeze(['dossier']) }),
]);

/**
 * THE `grammar:` TAG — its shape, and the contract-test change that must land WITH it.
 *
 * Declared here and applied nowhere. The tag is authored on the ANNEX row (the original —
 * R-DA-24) beside `marks:`, and reaches the leaf through the projection. Landing the tag
 * therefore touches two files that must move together or the `--check` byte-compare fails:
 * the generator's variant parser and the projection contract test.
 *
 * @type {Readonly<{shape: string, annexForm: string, leafForm: string, movesWith: ReadonlyArray<string>, seedSafe: string}>}
 */
export const GRAMMAR_TAG_CONTRACT = Object.freeze({
  shape: 'a member id of LEVEL1_ORDERS (`V1`…`V8`), one per variant, optional while the wave runs',
  annexForm: 'a third bracketed tag on the row: `N. `[angle · mark]` `[grammar: V4]` text`; the'
    + ' projection already parses a SECOND bracketed tag (`VARIANT_RE`\'s optional group), so the'
    + ' grammar tag rides that slot with a `grammar:` prefix and needs no new row grammar',
  leafForm: 'a `"grammar": "V4"` key on the variant object, beside `angle`, `marks` and `slots`',
  movesWith: Object.freeze([
    'scripts/generate-dossier-state-prose.mjs: parseTag() must route a `grammar:`-prefixed tag'
    + ' to its own field instead of into `marks`, or the mark vocabulary gains eight members and'
    + ' `STATE_MARK_DIMENSIONS`\'s contract test reds',
    'tests/data/dossierStateProseProjection.contract.test.js: the `--check` byte-compare moves'
    + ' with the emitted shape',
  ]),
  seedSafe: 'THE PROMISE holds: the tag is a per-variant DATUM, not a pool member. It changes no'
    + ' pool length, no key, no index and no eligibility; `variantIsAnchored` reads `slots`,'
    + ' `variantIsAudible` reads `marks`, and neither reads `grammar`. Nothing an installed world'
    + ' draws moves.',
});

// ── the classifier ──────────────────────────────────────────────────────────────────

/** A slot reference is a typed field reference and the classifier reads it as one. */
const SLOT_RE = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;

/**
 * Which move does a slot NAME suggest? The slot is a field, so this is a licensing read.
 *
 * TYPED AS AN OPEN RECORD BECAUSE THE READ IS OPEN. `SLOT_RE` matches any identifier, so a
 * slot this table does not name is a real input: the read answers `undefined` and the
 * `filter(Boolean)` beside it drops the row. A `keyof typeof` cast would deny that input.
 * @type {Readonly<Record<string, string>>}
 */
const SLOT_MOVE = Object.freeze({
  good: 'OBJECT', resource: 'OBJECT', asset: 'OBJECT', ruin: 'OBJECT',
  institution: 'INSTITUTION', seat: 'INSTITUTION', govFaction: 'INSTITUTION',
  faction: 'PERSON', faction2: 'PERSON', npc: 'PERSON', governing: 'PERSON',
  counterpart: 'GEOGRAPHY', route: 'GEOGRAPHY', terrain: 'GEOGRAPHY',
  creed: 'TRADITION', rival_creed: 'TRADITION',
  event: 'HISTORY', calamity: 'HISTORY', timeband_age: 'HISTORY', timeband_since: 'HISTORY',
});

/**
 * The clause-level detectors, in PRIORITY ORDER. The first that matches names the clause's
 * move; PRESENT is the fallback because a stative clause with no other marking IS the
 * present state (§1.2 row 1).
 * @type {ReadonlyArray<{move: string, re: RegExp}>}
 */
export const CLAUSE_DETECTORS = Object.freeze([
  { move: 'ABSENCE', re: /\b(there (is|are) no\b|no \w+ (here|at all)\b|sends nothing\b|nothing (out|here|at|in) \w*\s*(worth|has|have)?\b|the record does not\b|does not (say|record|hold)\b|nobody has\b|none (of|is|are) (recorded|held|named)\b|is not (recorded|held|named)\b|no longer (holds|keeps|has)\b|has none\b|holds none\b|carries none\b|never had\b)/i },
  { move: 'CONTRADICTION', re: /\b(one (record|roll|account) \w+|some say\b|others say\b|two (records|accounts)|neither account|the rolls disagree|is disputed|both are recorded|account is not\b|accounts? (differ|disagree))\b/i },
  // ⭐ PROVENANCE SITS BESIDE CONTRADICTION BECAUSE BOTH ARE ASSERTIONS ABOUT THE RECORD
  // RATHER THAN ABOUT THE TOWN, and it must outrank the state detectors below for the same
  // reason ABSENCE and OPEN do: "the muster roll is long" states which BOOK holds the number
  // before it states the number. The vocabulary is the holder table's TWELVE KINDS as the
  // owner named them (treasury, muster, census, parish, toll-bar, market, watch, court,
  // elders, tradition, road, office) and NOTHING WIDER: a bare `record` or `count` is a
  // common noun, and a generic reporting verb ("the books say") names no holder at all, so
  // reading either as a citation would manufacture a habit the corpus does not have.
  //
  // ⚠ NARROWED AT SEAM CAR 5c, AND THE SENTENCE ABOVE WAS FALSE UNTIL IT WAS (SITTING §R
  // c-16). The row carried a third limb — `the (rolls|registers|ledgers|books|records)
  // (say|shows|holds|carries|names|records|has)` — plus `customs` and `tithe` (neither a
  // kind), and omitted `census`, `office` and `tradition` (all three kinds). The skeptic
  // fold measured the damage: of 18 citing variants 11 rested on the generic limb ALONE and
  // two literally read "the record has" / "the record holds", so a majority of the count
  // resolved to no holder kind at all while this docblock asserted the opposite in the
  // product source. SITTING §Q.2 defines the move as a count from an interested party or a
  // record whose holder is a power, never any sentence in which a book reports something.
  // MEASURED at this tip with the limb gone: 7 of 2,266 shipped variants carry the shape
  // (kind-only 7 · generic-only 0 · both 0, printed and asserted as integers by
  // tests/lint/proseMoveGrammar.walker.test.js), and all seven thereby realise a move
  // sequence outside LEVEL1 — which is the finding, not a defect of the detector.
  { move: 'PROVENANCE', re: /\b(the (?:treasury|watch|parish|market|court|census|office)(?:'s)? (?:books|roll|rolls|register|registers|count|ledger|ledgers)|the (?:muster|toll) (?:roll|rolls|books|register)|the elders (?:say|hold|remember|keep)|the tradition (?:says|holds|remembers|keeps)|from the road)\b/i },
  { move: 'OPEN', re: /\b(unsettled|unresolved|contested|still open|not (yet )?(decided|settled|answered)|stands open|pending|no one has (decided|settled)|remains? open)\b/i },
  { move: 'CONSEQUENCE', re: /\b(cost|costs|paid for|pays for|falls on|fell on|the bill|charged to|comes out of|is borne by|at the expense of|at a loss|the loss is)\b/i },
  // ⚠ THE HISTORY DETECTOR CARRIES NO BARE `was`/`were`, and that is a MEASURED narrowing.
  // With them in, "none of it looks like it was thrown together" and "no rival was required"
  // both read as HISTORY — a copular past inside a present-state clause. History needs a
  // temporal anchor or a past EVENT verb, which is also what R-DST-B asks of the field.
  { move: 'HISTORY', re: /\b(since the|after the|when the \w+ (came|fell|ended)|during the|left from|put on them|took \w+ out|set (this|it) in motion|(fell|burned|razed|seized|revoked|was built|were built|was founded|were founded)\b)/i },
  { move: 'INSTITUTION', re: /\b(hall|council|temple|guild|watch|garrison|granary|customs house|court|registry|barracks|chapter|the seat)\b[^.]{0,40}\b(keeps|holds|takes|levies|collects|counts|registers|hears|issues|answers|sits|rules|decides)\b/i },
  { move: 'PERSON', re: /\b(the (mayor|captain|guildmaster|steward|priest|priestess|archmagister|kingpin|lieutenant|warden|baron|advisor)|whoever (holds|sits)|the holder of)\b/i },
  { move: 'TRADITION', re: /\b(custom|customs|rite|rites|feast|festival|observance|observances|is kept (here|in)|the practice here|by tradition)\b/i },
  { move: 'GEOGRAPHY', re: /\b(upriver|downriver|the road (to|from)|the pass|the coast|the river|inland|the far bank|lies (north|south|east|west)|the ground (here|gives)|the site|the approach|a narrow way in|the way in)\b/i },
  { move: 'OBJECT', re: /\b(the (grain|stone|timber|iron|salt|wool|cloth|ore|hides|casks|carts|nets|boats|walls|mill|quay|bridge|well|wood))\b/i },
]);

/**
 * Split a variant into the clause units the classifier reads. A move is a CLAUSE-level
 * assertion (§1.1), so the unit is a clause, not a sentence.
 * @param {string} text
 * @returns {string[]}
 */
export function clauseUnits(text) {
  return String(text || '')
    .split(/(?<=[.?!;:])\s+|,\s+(?=(?:and|but|or|which|who|where|while|though)\b)|\s+—\s+/i)
    // ⚠ A FRONTED SUBORDINATE CLAUSE IS ITS OWN UNIT. Without this split, "After the fire
    // came, the granary stands half full" reads as ONE clause whose only marker is the
    // HISTORY at position zero — so the PRESENT that follows it disappears and wall 1
    // (STATE precedes CAUSE) cannot fire on the plainest possible breach of itself.
    .flatMap((c) => {
      const m = c.match(/^\s*(after|when|since|because|though|while|if|before|once)\b[^,]{0,70},\s+/i);
      return m ? [m[0].replace(/,\s*$/, ''), c.slice(m[0].length)] : [c];
    })
    .map((c) => c.trim())
    .filter((c) => c !== '');
}

/**
 * Classify one variant into an ordered move sequence. Consecutive duplicates collapse: two
 * clauses both asserting the present state are ONE move, because a move is an assertion and
 * not a clause count.
 * @param {string} text
 * @returns {string[]}
 */
export function classifyMoves(text) {
  const units = clauseUnits(text);
  /** @type {string[]} */
  const moves = [];
  for (const unit of units) {
    const slots = [...unit.matchAll(SLOT_RE)].map((m) => SLOT_MOVE[m[1]]).filter(Boolean);
    // Every detector that fires, IN THE ORDER IT FIRES — a clause can carry two assertions
    // and the sequence is the thing being measured.
    const marks = CLAUSE_DETECTORS
      .map((d) => { const m = d.re.exec(unit); return m ? { move: d.move, at: m.index } : null; })
      .filter((m) => m !== null)
      .sort((a, b) => a.at - b.at);
    /** @type {string[]} */
    const local = [];
    // A slot is a typed field reference and outranks a lexical guess for the OBJECT,
    // GEOGRAPHY and TRADITION classes, whose detectors are common nouns; it does NOT outrank
    // ABSENCE, CONTRADICTION or OPEN, which are assertions ABOUT the field's value.
    const head = slots[0] || 'PRESENT';
    if (marks.length === 0) local.push(head);
    else {
      // ⚠ THE HEAD WINDOW — twelve characters, written at its use site rather than hoisted
      // (a module-top-level named number in `src/domain` is an unregistered tuning dial by the
      // estate's register, and this is a parser's reach, not a tuning value). MEASURED:
      // without a head rule the classifier read "The town can outlast a hungry year and has NO
      // ANSWER AT ALL to a sick one" as ABSENCE → PRESENT, INVERTING the order of a variant
      // whose first assertion is plainly the capacity. Order is this walker's whole subject.
      if (marks[0].at > 12) local.push(head);
      for (const mark of marks) local.push(mark.move);
    }
    for (const move of local) if (moves[moves.length - 1] !== move) moves.push(move);
  }
  return moves.length ? moves : ['PRESENT'];
}

/**
 * The level-1 order id whose move list the classifier's sequence matches, or `''`.
 * `V3` and `V8` share a move list (PRESENT → ABSENCE) and differ only in the ABSENCE CLASS
 * (a world LACK against a record GAP), which no lexical read settles — so a match on that
 * pair returns `V3|V8` and the walker reports the ambiguity rather than picking.
 * @param {ReadonlyArray<string>} moves
 * @returns {string}
 */
export function orderIdOf(moves) {
  const key = moves.join('→');
  const hits = Object.entries(LEVEL1_ORDERS)
    .filter(([, spec]) => spec.order.join('→') === key)
    .map(([id]) => id);
  return hits.join('|');
}

/**
 * ⭐ THE COMPOSED ORDER (ARCH §8.4; T-F4). `orderIdOf` classifies ONE variant against the
 * eight LEVEL-1 orders, which is the right ruler for a pool row and the wrong one for a
 * COMPOSED unit: the unit's derived order is literally `spine.order ++ [modifier moves]`
 * (§4.2 step 8), and a spine plus a modifier can realise a TAB order rather than a variant
 * one. So the composed classifier searches LEVEL1 first and LEVEL2 second and says WHICH
 * level answered, and a sequence outside both is `''` at level `0`.
 *
 * ⛔ IT REPORTS, IT DOES NOT REFUSE, and the reason is the whole point of measuring at car 6
 * rather than legislating at car 5: the SHARE of composed units outside both sets is the
 * number that says whether the two closed sets are the right sets. A gate that failed every
 * unit outside them would have decided that question by construction. The share is printed
 * by the walker; the sitting rules on it.
 *
 * ⛔ LEVEL1 IS SEARCHED FIRST AND THE TIE IS NOT BROKEN BY LENGTH. `E5` is
 * `INSTITUTION → PRESENT`, which is `V5` exactly; a composed unit realising it is a
 * LEVEL-1 grammar that happens also to be a lawful tab order, and calling it E5 would report
 * a tab order for a single unit. The overlap is named here rather than left to whichever
 * object literal happens to be read first.
 * @param {ReadonlyArray<string>} moves
 * @returns {{id: string, level: 0|1|2}}
 */
export function composedOrderIdOf(moves) {
  const level1 = orderIdOf(moves);
  if (level1 !== '') return { id: level1, level: 1 };
  const key = moves.join('→');
  const hits = Object.entries(LEVEL2_ORDERS)
    .filter(([, order]) => order.join('→') === key)
    .map(([id]) => id);
  return hits.length ? { id: hits.join('|'), level: 2 } : { id: '', level: 0 };
}

/**
 * The classifier's reading of one entry: its move sequence, the order id it matches (if
 * any), the tag it carries, and whether the two agree.
 * @param {{text: string, grammar?: string}} entry
 * @returns {{moves: string[], orderId: string, tag: string, agrees: boolean|null}}
 */
export function readGrammar(entry) {
  const moves = classifyMoves(entry?.text || '');
  const orderId = orderIdOf(moves);
  const tag = typeof entry?.grammar === 'string' ? entry.grammar : '';
  return {
    moves,
    orderId,
    tag,
    // `null` — not "true" — where no tag exists. An untagged corpus cannot agree or
    // disagree, and reporting it as agreement is exactly the false green the §908 law bars.
    agrees: tag === '' ? null : orderId.split('|').includes(tag),
  };
}
