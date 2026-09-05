/**
 * domain/certification/subsystemRowsMemory.js — THE W-MEM FAMILY'S CERTIFICATION
 * ROWS: the Remembrance ledger of concluded wars (lane T12, ODQ §834/§868).
 *
 * ⭐ THIS IS THE LEAF T12 DECLINED TO AUTHOR, AND THE DECLINING WAS RIGHT. Its row
 * landed at the T12 landing needing the file's last twelve lines and finding only
 * ten, and it said so in the file it squeezed into: "A W-MEM leaf would be the
 * same move, but a FAMILY leaf is a structural call chartered to TE-VIRT-1, not a
 * landing's to make — so the row fits itself under the ceiling and leaves the
 * decomposition to its charter." This is that charter arriving. ODQ §868 recorded
 * the refusal as the landing's sharpest act; the leaf is its other half.
 *
 * ── WHAT THIS LEAF UNDOES, AND WHY IT IS BYTE-NEUTRAL ──────────────────────
 *
 * To fit ten lines instead of twelve, T12 re-fitted the row with the house's
 * long-string idiom — `rule`, `title` and `module` folded onto ONE line, the three
 * aliveness channels onto one, the whole invariant onto one — with "4,564
 * non-whitespace characters IDENTICAL: content preserved, whitespace paid". With
 * the wall gone the payment is refundable, so the row is re-flowed here into the
 * one-property-per-line form every sibling row uses. NOT ONE STRING BYTE MOVED:
 * the re-flow was performed by a splitter that inserts a newline only after a
 * comma provably outside every string literal, and the result was re-joined and
 * compared to the original before it was written. The proof that matters is not
 * that argument though — it is the executed one: the composed
 * `SUBSYSTEM_CERTIFICATION_REGISTRY`, serialized whole, is byte-identical across
 * this lane's whole decomposition.
 *
 * ── ⭐ THIS LEAF IS THE ONE THAT CAN GROW FOR FREE ─────────────────────────
 *
 * W-MEM carries two chartered-unbuilt cars that will each want a row — W-MEM-P1
 * (the `loserDied` producer, which the row below names as an honest absence) and
 * W-MEM-P2 (the seat-transition evidence return). Because this leaf sits LAST
 * among the rows in `VIRTUAL_SUBSYSTEM_ROWS`, an append here shifts NOTHING: every
 * existing row keeps its index and no certification output moves. That is the
 * property the two door homes below it are built to share, and it is the whole
 * reason family leaves belong at the tail.
 *
 * ⛔ IT DELIBERATELY DOES NOT JOIN `subsystemCertification.js`'s import list. The
 * row spreads back into `VIRTUAL_SUBSYSTEM_ROWS`, which stays the ONE export every
 * consumer, walker and bijection already reads.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/lint/engineGatedRuleKeys.walker.test.js,
 *   tests/domain/subsystemRowsVirtual.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The W-MEM family's authored rows (the sibling row leaves' idiom verbatim).
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const MEMORY_SUBSYSTEM_ROWS = Object.freeze([
  // ── W-MEM · THE REMEMBRANCE LEDGER OF CONCLUDED WARS (lane T12, ODQ §834) ──
  // AUTHORED, NEVER PENDING — the pending array is empty and stays empty.
  // ⛔ THIS ROW TAKES THE FILE'S LAST SEAT under its 800-line layer ceiling; it lands the
  // file at exactly 800. THE ARITHMETIC, RE-MEASURED AT THIS LANDING TIP rather than
  // inherited from the lane's base: the W-SEAT split immediately above moved this file to
  // 790 effective (it was 788 when this row was authored against it, and the row cost 12),
  // so the row was re-fitted to 10 by folding `rule`/`title`/`module` onto one line in the
  // house's long-string idiom — 790 + 10 = 800 exactly. NOT ONE CHARACTER OF PROSE WAS
  // DROPPED to make room; the seat is a LINE budget, not a content budget, which is the
  // whole reason the idiom exists. Its ONE authored invariant still carries both fences
  // (dark-is-byte-identical, and stands-down-then-seals-late).
  // ⭐ THE HABITAT CURE NOW EXISTS AND THIS ROW DELIBERATELY DID NOT TAKE IT: W-SEAT built
  // subsystemRowsSeat.js for exactly this wall. A W-MEM leaf would be the same move, but a
  // FAMILY leaf is a structural call chartered to TE-VIRT-1, not a landing's to make — so
  // the row fits itself under the ceiling and leaves the decomposition to its charter.
  // After this row the file is AT its ceiling again: the next virtual flag must either
  // author a family leaf or land TE-VIRT-1 first.
  Object.freeze({
    rule: 'warMemoryEnabled',
    title: 'The Remembrance ledger (a world remembers the wars it fought)',
    module: 'src/domain/worldPulse/concludedWars.js,src/domain/worldPulse/concludedWarRecord.js,src/domain/worldPulse/pulseKernel.js',
    aliveness: Object.freeze({
      eventTypes: Object.freeze([]),
      moverFamilies: Object.freeze([]),
      stateKeys: Object.freeze(['concludedWars']),
      other: 'ONE GATE, ONE WRITE SITE, ONE LEDGER. warMemoryActive (worldPulse/concludedWars.js) reads warMemoryEnabled by name with the strict === true idiom and it is the ONE read of this key in the tree; the by-name spelling is load-bearing rather than stylistic, because a frozen-list conjunction is a computed member access and would hide a fully wired flag from the engine-gated-key census entirely, and the receiver is spelled `rules` rather than `simulationRules` because the observed-shape corpus discovers a flag by that receiver and would then judge this key as one the corpus can light, which it cannot. WHY IT EXISTS: worldState.deployments is the engine\u2019s ONLY war record, it is deleted on seven distinct roads at war\u2019s end \u2014 one of which leaves literally nothing, no outcome and no carrier row \u2014 and every receipt that narrates a war lives in an 80-entry ring buffer, so a concluded war left no addressable trace at all within ~80 advances, which on a three-century world is essentially the whole timeline. The Herald already carried the socket: warId had exactly one reader and zero writers. WHAT THIS WAVE BUILDS: one conditionally-materialized ledger, worldState.concludedWars, keyed by a minted warId (sorted original pair + opening tick + sequence leg), holding append-closed typed records \u2014 sides, casus pins copied verbatim, the estate\u2019s own ClosedWarFact block, banded costs, and at most five engagement epitomes \u2014 written by ONE pulse writer at the consequence_fold stage, which is where the tick\u2019s dismissal verdicts, its treaty mint and its engagement feed are all simultaneously in scope. THE DISMISSAL INVERSION IS THE POINT: a DM-dismissed conquest still CONCLUDES its war (the kernel keeps the war-layer resolution and rolls back only the takeover), so the writer ALWAYS writes a record and the dismissal shapes the FACT BLOCK rather than the record\u2019s existence \u2014 no applied conquest row, so the classifier honestly yields a non-conquest ending. THE ENDING IS NEVER STORED: the record persists the classifier\u2019s INPUT and classifyWarEnding derives the ending at read, so one resolver owns the question and an improved classifier retroactively improves every war already recorded. WHAT IT DELIBERATELY DOES NOT BUILD: no prose of any kind in the record (seven close roads author no sentence at all, the one candidate voice narrates a LIVE war under a standing reader-facing refusal, and copied prose would freeze settlement names against renames), no headcount casualties anywhere, no backfill onto old worlds, no default lighting, and no Remembrance door \u2014 that door bound to T11\u2019s register form and was chartered separately. RR-2 HAS SINCE BUILT IT, so this row no longer describes a write-only ledger: the reader is src/domain/display/warRemembrance.js, which asks classifyWarEnding for the ending, resolves the persisted band KEYS back to their words, and renders the record on the Herald\u2019s Remembrance door and in the World Book realm chapter. It authors every sentence at READ time and writes nothing, which is what keeps the record\u2019s own no-prose law true on both sides of the seam. HONEST ABSENCES, NOT INVENTED PRODUCERS: loserDied has no producer in the estate at all (so the annihilation ending is unreachable) and three of the four seat-transition families are discarded at the news boundary; both stay structurally absent rather than being string-matched out of prose, and both are chartered rows (W-MEM-P1, W-MEM-P2) priced for the war-system side.',
    }),
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'dark_is_byte_identical_and_the_writer_seals_late_rather_than_lying_early',
        description: 'With the flag absent or false the writer returns before it reads anything, so no record is staged, no key is materialized, and a dark advance is byte-identical to the pre-W-MEM engine. The ledger normalizes to undefined when empty, so drop-when-empty makes an absent key and an emptied one serialize to the SAME BYTES \u2014 the bit bar, not the canonical-form bar, because the dormancy oracle\u2019s absent-equals-empty tolerance is exactly the trap this ledger had to avoid. AND, THE SAME FENCE FROM THE OTHER SIDE: Under deferred majors every major is parked and no verdict exists, so the writer returns before writing \u2014 which makes the record write exactly once, with real verdicts, and makes this layer\u2019s residue strip byte-neutral by construction rather than by care. And a record does not seal when its last edge resolves: it waits out the peace-mint window, because the treaty a negotiated war ends with is minted from a later relationship incident, and a record sealed at conclusion would report no treaty for a war about to acquire one.',
        check: 'NOT expressible from a receipt, and the reason is narrower than it first looks: the census DOES read this ledger (censusWorldStateKeys is total over top-level worldState keys, and concludedWars is one), which is exactly why this row grades `indirect` rather than calling the soak blind — what no receipt can express is the BYTE claim, because a census counts keys and cannot compare serialized bytes across a dark and a lit advance. Pinned in tests/domain/concludedWarsWriter.test.js by a dark-versus-lit differential driven through the REAL writer, the dark arm comparing serialized bytes and the LIT arm asserting the key appears and the record is populated \u2014 so the fence is proven able to SEE rather than merely quiet. Pinned in tests/domain/concludedWarsWriter.test.js: a paused tick writes nothing and leaves the serialized world unchanged; a record stays staged across the grace window and seals only after it, with a treaty arriving mid-window reaching the sealed fact block.',
      }),
    ]),
    soakEvidence: 'indirect',
  }),
]);
