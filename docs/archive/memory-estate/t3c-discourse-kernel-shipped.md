---
name: ""
metadata: 
  node_type: memory
  title: TRANCHE 3c — THE DISCOURSE KERNEL (machinery + 6 enforcers green; DRAFT lexicon at the Fable review gate)
  date: 2026-07-21
  tags: 
    - discourse-kernel
    - cause-walk
    - finite-semantics
    - dark-gated
    - eager-closure
    - connective-lexicon
    - review-gate
    - project
  branch: claude/t3c-discourse-kernel
  base: 5e23db2d
  tip: 70cba67e
  modified: 2026-07-21T17:44:40.073Z
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
---

# TRANCHE 3c — THE DISCOURSE KERNEL

**Status: COMPLETE + FOLD-READY on branch claude/t3c-discourse-kernel (WIP eb35c328 -> FINAL
b6ce1281 -> AMENDMENT cda4cba2 -> FOLD-READY 70cba67e, off 5e23db2d). NOT folded, NOT pushed
(owner-gated) — awaiting the manager's post-3b-fold merge.** Machinery + six enforcers final;
Fable-tier lexicon incorporated; owner PREDICTION-ELISION amendment + rule-2 comma-join typography
fix incorporated; the full gate re-ran green at each tree.

## ⭐ OWNER AMENDMENT — PREDICTION ELISION (commit cda4cba2)
Forecast->fulfillment chains read redundant ("X may take hold ... X takes hold"). PRECONDITION
(owner's hard gate, VERIFIED): the pairing is TYPED, not string-matched — a candidate event C has
id `candidate.<...>`; its realization R has id `wizard_news.<tick>.<domain>.applied.<C.id>` (the
`.applied.` transition segment re-embeds C's full candidate id) AND the ledger records C->R. So
`realizationCandidateId(R.id)` recovers C from receipt-id structure, never from a headline. (Had it
been string-only the rule moves to the owner queue — it is NOT.) RULES (realizeCauseWalk now reads
`provenance`): (1) C's only in-walk child is R -> ELIDE C; (2) C has OTHER in-walk children
(responses) -> ELIDE C, responses take the ANTICIPATORY register ('Forewarned:' | 'Against what was
coming:' | 'In its shadow:', owner-authored, colon-terminal) encoding "done because of the forecast"
WITHOUT touching a verbatim headline; (3) C's realization NOT in walk -> KEEP C (unfulfilled forecast
= real info). Opener+register join (70cba67e fold-ready fix): time first, comma, register second, and
the register's first char is LOWERCASED at compose time ("In the spring of year 1, in its shadow:") --
an authored-text-only transform (never a headline), NOT a second lexicon spelling; the enforcers'
register detection matches either the standalone-capital or comma-joined-lowercase form. The ROOT is never elided (a
realization's prediction is always a hop; a prediction-root's realization is its descendant, not in
the backward walk -> rule 3). Enforcers: elision pin + anticipatory-license pin (unlicensed
anticipatory = RED) + the lit parity walker runs with elision ACTIVE (measured 338 elided, still
zero unrecorded / zero contradictions — omission is selection, proven). ⚠️ rule 2 is RARE on a drive
(a response must also be an ancestor of the realization) — exercised by the synthetic kernel test.

## The Fable rulings (recorded)
- RULING 1: byte-verbatim headlines + colon-bridge is CONFIRMED the correct strict reading;
  rewriting recorded strings = paraphrase (the generalized redaction law). Move-2 entity-slot
  anaphora is a recorded PHASE-2 FOLLOW-ON (owner-queue), possible only if clause TEMPLATES (not
  verbatim headlines) ever carry entity slots — NOT this lane.
- RULING 2: RELATION_FOR_TYPE is machinery, unchanged.

## THE AUTHORED LEXICON (final, in discourseKernel.js — every entry colon-terminal)
- causal.deep : 'From there:' | 'In its wake:'
- causal.near : 'And so:' | 'From that:' | 'In turn:'
- causal.pivot: 'So it came to this:' | 'And at the last:' | 'And in the end:'
- parallel    : 'In the same season:' | 'At the same time:' | 'Meanwhile:'
- adversative : 'And yet:' | 'Even so:'
- DEFAULT_CONNECTIVE 'And then:' ; opener `In ${tickCalendarLabel(tick)}:`

## What it is
A pure lazy leaf `src/domain/display/discourseKernel.js` — `realizeCauseWalk(walk, { seedId,
nameOf }) -> { text, clauses:[{ text, receiptKey, connective, recorded, relation, redacted }] }`.
Turns a resolved cause-walk into ONE connected passage instead of N disconnected lines. The
owner-authorized answer to "a rudimentary LLM": deterministic classical discourse realization,
NOT a neural writer. Consumer `CauseWalkPanel.jsx` picks the realizer behind virtual flag
`discourseProseEnabled` (absent from every preset; read defensively via `discourseProseActive`,
the provenanceLedgerEnabled idiom). Flag OFF = the exact current render, byte-identical.

## ⭐ THE LOAD-BEARING ARCHITECTURE DECISION (the truth-surface resolution)
Real recorded headlines are MIXED-CASE verbatim strings — many open with a proper noun
(`${name} mobilizes for war`) or "The"/a capitalized verb, some are lowercase phrases
(`a trade embargo`). Two hard constraints collide with the spec's move-2 (pronoun anaphora)
and move-4 (retense to past perfect): (1) THE FINITE-SEMANTICS LAW — AI is never the writer on
a truth surface; (2) the narrative-parity walker asserts `pulseHeadlines.has(hop.headline)` and
enforcer (a) forbids embellishment. **Resolution: headlines are carried BYTE-VERBATIM, never
rewritten / retensed / re-cased** (case-folding would corrupt `Ashford`->`ashford`). The ONLY
authored text is the finite connective, composed as a COLON-BRIDGE so a capitalized headline
follows grammatically: `clause.text === connective + ' ' + recorded`, exactly. That makes the
anti-embellishment guarantee executable (strip the connective -> the verbatim receipt remains).

**JUDGMENT (vetoable, flagged to Fable):** move-2 entity pronominalization is NOT applied INSIDE
a verbatim headline (that would rewrite the truth surface) — anaphora informs continuity register
only; `nameOf` is threaded but not injected into clause text in Phase 1. move-4 tense banding is
carried by the connective REGISTER + a `tickCalendarLabel` opener, not by conjugating headlines.
These are the honest reading of "classical realization on a truth surface", not a shortfall.

## The four moves (machinery, final)
1. CONNECTIVE SELECTION — finite RELATION_FOR_TYPE map (LITERAL over the live vocabulary:
   the 8 chronicleGraph.DRAMA_CLASSES + node kinds outcome/impact + fallbacks hidden/event).
   causal (banded deep/near/pivot by depth) | parallel (same tick+depth siblings) | adversative
   (boom_flourishing, reframe). Variant = fnv1a32(seedId + key) — the conjunction-ladder idiom.
2. ENTITY TRACKING — continuity via settlementIds; `nameOf` injected (store-free purity).
3. AGGREGATION — adjacent identical recorded shapes coalesce (C2 dedup); one clause/sentence.
4. TENSE/PACING — `In ${tickCalendarLabel(tick)}:` opener; band register for the rest.
Ordering: (tick asc, depth DESC [deepest cause first, root/effect the pivot], id codepoint).

## The six enforcers (all green)
- (a) clause-provenance + (c) determinism -> `tests/domain/discourseKernel.test.js` (12).
- (b) lit narrative-parity variant -> `tests/simulation/discourseParity.test.js` (7): real lit
  decade (30 ticks, provenanceLedgerEnabled+discourseProseEnabled), 507 roots / 699 clauses,
  ZERO unrecorded claims, ZERO contradictions, connective-only spell-break census = 0.
- (d) lexicon totality walker + PLANTED sweep mutation -> `tests/lint/discourseLexiconCoverage.test.js`
  (7) + `scripts/mutation-sweep.sh` #27 "discourse/lexicon relation-type coverage gap" (verified
  red->green) + manifest entry. Enumerated (tests/lint); manifest meta-test 6/6.
- (e) dormancy byte-identity -> temp-worktree render diff (`git show 5e23db2d:...` vs branch,
  `renderToStaticMarkup`, 4 cases byte-identical) + committed pins in `tests/components/causeWalkPanel.test.jsx`.
- (f) voice -> lexicon lives in src/domain, auto-scanned by voiceMechanics Tier-2; NO em-dash,
  NO bang; baseline UNCHANGED. Register: the calm archivist, colon-bridges.

## Hazards honored (each was live)
- ⚠️ EAGER Δ 0: branch entry-closure = **1,039,974 == base** (brief's number is right; resume-v3's
  1,039,977 is a stale/different measure). Kernel is lazy (CauseWalkPanel rides RealmInspector's
  lazy chunk). PROVEN via `npm run build` + VERIFY_DIST closure (skipIf(!VERIFY_DIST) — plain runs
  silently green). Compute BFS: `node scratchpad/closure.mjs dist`.
- ⚠️ voiceMechanics scans ALL src/domain/*.js string literals -> a new file with an em-dash/bang
  GROWS the per-file baseline and reds. Kept the lexicon clean.
- ⚠️ spellBreakCensus baseline is measured FLAG-OFF; it stays frozen. The flag-ON expectation is
  asserted INSIDE enforcer (b) over the AUTHORED connective only (recorded headlines carry the
  frozen baseline's own rawId debt and are not this gate's concern).
- ⚠️ E-A: any new enumerated test (tests/lint/* or a basename with parity/coverage/walker/...) reds
  the manifest totality until it gets a manifest entry. discourseKernel.test.js + causeWalkPanel.test.jsx
  are NOT enumerated (no token, not enforcer dirs) — no entry needed. discourseParity is a rationale.

## Dominant recorded shape (observed on the real drive)
The recorded 2-hop chains are mostly PREDICTION->REALIZATION of the same beat:
`"Criminal pressure may take hold"` -> `"Criminal pressure takes hold"`. The colon-bridge connects
them cleanly ("In the spring of year 1: X may take hold. So it came to this: X takes hold."). Deep
chains (arc-soak deepChains=6) exist but this 30-tick drive is mostly 1-2 hops.

## If the lexicon is ever re-authored (invariants for any future edit)
Edit CONNECTIVE_LEXICON (+ DEFAULT_CONNECTIVE, opener form) only. Constraints: every non-empty
connective ENDS IN A COLON (composition `connective + ' ' + recorded` depends on it); no em-dash,
no bang; house register; causal is banded deep/near/pivot; >=1 variant/cell (totality walker floor).
Tests read ALL_CONNECTIVES dynamically, so no test hard-codes a connective string. After any edit
REBUILD (the pre-commit hook runs eslint --fix, so rebuild from committed source) and re-run the
closure VERIFY_DIST + the six enforcers. The lexicon is in the LAZY chunk, so eager Δ stays 0.

## Next (owner-gated, NOT this lane)
The manager folds claude/t3c-discourse-kernel into composite-r4 post-3b (full two-shard, authoritative
BFS, ledger row, RESUME marker, memory). The OWNER's flip of discourseProseEnabled rides the SAME
ONE-REGEN batch that lights provenanceLedgerEnabled (T4 item 1, amended): the multi-hop DAG (E-J-v2)
and its connected prose light TOGETHER. Until then the kernel is dark and byte-neutral.
