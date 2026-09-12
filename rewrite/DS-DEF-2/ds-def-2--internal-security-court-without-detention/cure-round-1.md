# CURE ROUND 1 — DS-DEF-2 · pool `Internal Security: court without detention`

Curer: Opus 5 (CURER seat, a different author from the drafter and the refiner), for the Fable chair.
REWRITE car 8b, block DS-DEF-2, cure round 1.

**Baseline (the gate's diff target).** The rows standing in the annex at HEAD
`471ce894a83658b0e0fe480819a9f1dcd22605e3` — `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2791-2803`,
section `### DS-DEF-2`, the bold pool line `` **`Internal Security`: court without detention** ``.
The row form below (three-space indent, backticked `` `[ledger]` `` / `` `[face]` `` tags) is that
baseline's own byte form, reproduced so the diff is clean.

**Targets (3), each a face the refuter failed and the judge ruled CURE:** v1 face 2 · v1 face 3 · v3 face 1.
**Every other face is BYTE-IDENTICAL to the baseline** (v1 face 0 · v1 face 1 · v2 faces 0–3 · v3 faces 0, 2, 3).
v2 face 1 is NOT a target: the judge ruled it REVERT and the annex at HEAD already carries the reverted draft face.

Read whole before a word was written: `REGISTER-CARD.md` (with S2 and S3); `RULES-V2-PART-B.md` §1 (R-DA-00…R-DA-24),
§16–§16.2, §18, §20, §21–§21.4, §22, §23, §24; `sweep/MOVE-GRAMMAR.md` §0–§3 and §4.4.1–§4.4.3 (and §1.4.1, THE THREAD);
`sweep/CLERK-LAWS.md` §2.4.1 and §2.6.1; `arch-prose/ARCH-COMPOSED-PROSE-v2.md` §2.5 (the annex grammar) and §8.3
(the licence card); this pool's `skeleton.md`, `draft-round-2.md`, `refine.md`, `kept.md`, `refute-round-2.md`;
`../JUDGMENT.md` for this pool (the verdict table, the CURE rows and the v2 f1 REVERT row).
Dock `laneRW-DEF2` READ ONLY; the only execution was `node scripts/prose-licence-card.mjs DS-DEF-2 'Internal Security: court without detention'`.
Nothing outside this packet file was written anywhere. Written under the checkpoint law, section by section.

**CONTINUED under the checkpoint law (a later sitting of the same seat; the earlier sitting was cut off after it
had written every section).** Nothing sound was re-written. What the continuation VERIFIED rather than assumed,
each by execution and each CONFIRMED: (a) the twelve rows below were diffed line for line against
`git show 471ce894a83658b0e0fe480819a9f1dcd22605e3:docs/content/RECEIPT_POOLS_DOSSIER_STATE.md | sed -n '2791,2803p'` —
**exactly three lines differ and they are exactly the three targets**, every other face byte-identical including the
three-space indent and the backticked tags; (b) `JUDGMENT.md` has been RE-RUN since the earlier sitting
(mtime 2026-09-12 01:55, the prior run kept beside it as `JUDGMENT.prior-run-2026-09-11T2252.md`) and its
`--- CURES` section still carries these three rows for this pool with the same findings and the same named cures,
and its `--- REVERTS` section still carries `variant 2 | face 1` — so no ruling moved under the packet;
(c) the v2 f1 claim in the line above was checked rather than asserted: the annex at HEAD reads
*"Here the law is formal, and there is nowhere in the town to hold under that law."*, which is
`draft-round-2.md`'s own face for that slot, while `kept.md` (the refined set) reads *"…the town is without a place
of confinement."* — the annex therefore DOES already carry the reverted draft face, and the packet leaves it
byte-identical as the gate requires; (d) the one noun the judge's cure introduces was checked against the engine:
`src/domain/display/threatAssessment.js:147` reads `'Courts prosecute but limited detention.'`, so **detention** is
the engine's own word for this branch (W14, the label at its engine meaning) and `skeleton.md:173` already lists
*"detention stands unmet at {settlement}"* among the OPEN move's lawful realisations.

**The card, re-run this session (identical to the skeleton's §0.1):**
```
  reads:      court (not-produced) · prison (not-produced)
  predicate:  court truthy (no literal)
  bag:        {band: RESERVED, route: proper, settlement: proper}; FILLED here: {settlement}
  relation:   (a spine takes no relation)   seat/form: (not a seat-taker) / sentence
  source:     (none) · standing SOURCE-UNRESOLVED — NO citation licensed (arm A13)
  may claim:  that `court` (truthy) holds, as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact,
              another civic object of the class `law`
  REFUSED COLUMNS: a totality over persons; an exemption; a named character and fate; a theological claim
```

---

## THE POOL'S REPLACEMENT ROWS (complete; the three cured faces marked in NOTES, nothing else moved)

**`Internal Security`: court without detention**
1. `[ledger]` Formal law stands entered at {settlement}, and the town holds no gaol.
   - `[face]` The town of {settlement} is entered with formal law, and has no place of confinement.
   - `[face]` At {settlement} the law is formal in its standing. On that standing no gaol is carried.
   - `[face]` What {settlement} carries standing is formal law, and no prison.
2. `[street]` The town's law is formal; the town keeps no gaol.
   - `[face]` Here the law is formal, and there is nowhere in the town to hold under that law.
   - `[face]` This town's law is formal. Beneath that law the town has nowhere to hold.
   - `[face]` Law here is formal, and under it stands no gaol.
3. `[unfolding]` Law is formal at {settlement}, and its holding half stands open.
   - `[face]` Under formal law at {settlement}, a place of detention stands unmet.
   - `[face]` Law stands formal at {settlement}. The holding under that law is not in place.
   - `[face]` The law {settlement} keeps is formal, and a place of confinement is wanting.

---

--- NOTES

**v1 face 2 — CURED.** Was: *At {settlement} the law is formal in its standing. The town carries nothing to hold under that law.* Now: *At {settlement} the law is formal in its standing. On that standing no gaol is carried.* The cure is the judge's named cure, taken as named (W4 with skeleton §1.7 A LOST ANGLE: the sentence carrying the discriminating read had no office surface and was the street sibling's own clause — v2 face 2, *Beneath that law the town has nowhere to hold* — with the adverbial moved). The claims are unmoved and the first sentence is untouched. CLAIM 1 *the law is formal* = `reads: court` truthy at its engine meaning (`hasFormatLaw`, the engine's own adjective; the referent table's function word "the law", A-16/row 20 — never "the court", W20/W15). CLAIM 2 *no gaol is carried* = `reads: prison` falsy, the LACK stated flat on the THING (MOVE-GRAMMAR row 11 class (a); R-DA-02: the first half only, no completing "but"; never over persons — a REFUSED COLUMN). The office's own formula now sits exactly where the fact lands (*is carried* = carried standing, R-vi/W7), with NO record noun and no agent-source (W24, SOURCE-UNRESOLVED; arm A13). The fronted adverbial *On that standing* both carries the noun forward from sentence one (R-i, the thread at k = 0) and keeps the LACK off the sentence's first position (MOVE-GRAMMAR wall 3 read at its strictest grain), while landing nowhere near the street sibling's *Beneath that law*. CONSTRUCTION kept and distinct (W4, A5, A11): two sentences with the turn outward placed last — face 0 is one coordinated sentence on "formal law", face 1 one coordinated sentence on the town in its naming form (W5), face 3 the pseudo-cleft; the cured face is the variant's only two-sentence face and its only passive on the lack. Verb spread inside the variant: *stands entered* · *is entered with* · *is carried* · *carries standing* — the passive on the lack and the active on the presence are two clauses of different voice, different subject and different read, so the shared root does not make the face a sibling paraphrase. W1 *its* binds to "the law", its own clause's subject. W10 one negation, on the LACK. W22 no person: the object of holding is not restored. Slots: `{settlement}` once, per the leaf's `slots: ["settlement"]` for vid 1; no `{band}`, no `{route}`. Form: two sentences, no em dash, no exclamation, no digit, no which-clause, no citation, no second tag.

**v1 face 3 — CURED.** Was: *What {settlement} keeps is formal law, and no prison.* Now: *What {settlement} carries standing is formal law, and no prison.* The cure is the judge's named cure, taken as named (skeleton §1.7 A LOST ANGLE / W4: the face carried no ledger surface at all and *keeps* is the street variant's own verb — v2 face 0 *the town keeps no gaol*, v3 face 3 *The law {settlement} keeps*). One verb is replaced; the claims, the cleft and the landing noun are unmoved, as the ruling requires. CLAIM 1 *is formal law* = `reads: court` truthy (the engine's own adjective). CLAIM 2 *and no prison* = `reads: prison` falsy, on the flag's own keyword noun (skeleton §4.1's lawful noun list), stated flat and not as the opener. The office's formula *carries standing* is R-vi/W7's third surface and is the one office verb the variant's other faces do not use, so the `[ledger]` stance is now audible in all four faces of the variant — which is the read-aloud fault the refuter recorded beside the law. No record noun (W24); no citation (A13); no person (W22); no process verb (D-15 CONDITIONAL, unresolved on this read). CONSTRUCTION kept (W4: the pseudo-cleft is this face's declared grammar and moving off it would be the regression the contract names) and distinct from its three siblings on all three axes the four-faces rule names — the subject is the cleft's free relative, the read order is presence-then-lack as the coordination, the landing noun is "prison", which no sibling of this variant lands on. It stays the variant's short line (ten words) against 14, 16 and 16, which is the pool's rhythm spread (R-DA-05/R-DA-06). CARRIED, NOT CURED, and recorded rather than acted: the refuter's SECONDARY ground — a specificational pseudo-cleft reads exhaustively, so *what the town carries standing* can be heard as everything the record carries. The ruling is CURE with the cleft and the landing noun expressly unmoved, and W4 makes the cleft this face's contract, so the curer may not drop it; the exhaustive reading is therefore left standing for the chair with the same status the refuter gave it (a secondary ground on a face whose primary ground is cured). Slots: `{settlement}` once; no `{band}`, no `{route}`; the face opens on "What", never on a `proper`-typed slot (T-F8).

**v3 face 1 — CURED.** Was: *Under formal law at {settlement}, detention stands unmet.* Now: *Under formal law at {settlement}, a place of detention stands unmet.* The cure is the judge's named cure, taken as named (the card's `may NOT` — a second fact / an observable the fields do not hold — with ENTAILMENT D-15, which refuses sentencing and enforcement off `hasCourtSystem`, and W14, the label at its engine meaning). The subject was the ACT, so standing alone the face read as a judicial outcome not delivered; it is now seated on the THING, and the thing is named in the engine's own word for this branch (`threatAssessment.js:147` "limited detention"), in A-17's always-safe *a place of …* spelling. CLAIM 1 *Under formal law at {settlement}* = `reads: court` truthy, the presence stated first as the fronted prepositional adverbial (R-iv / W8: the unfolding realises OPEN AFTER the presence; MOVE-GRAMMAR wall 3: the lack never opens the unit). CLAIM 2 *a place of detention stands unmet* = `reads: prison` falsy, realised as the `[unfolding]` angle's OPEN move (V6 PRESENT → OPEN) — the matter standing open NOW, declarative, never asked; no trend, no habit, no cause, no cost, no reputation, no future (the shipped variant's whole D-F21 breach stays dropped). No claim is added: the face says exactly what its three siblings say. CONSTRUCTION and rhythm unmoved as the ruling requires — the adverbial-fronted single sentence with the thing as subject, which no sibling of this variant carries (face 0 coordinates on "Law", face 2 is two sentences, face 3 has a relative-clause subject) — and the OPEN realisation *stands unmet* is kept, so it does not double face 3's *is wanting* or face 0's *stands open*. The face grows from eight words to eleven; it remains the variant's shortest line and the pool keeps its rhythm spread. W1 no possessive. W10 one negated surface, on the LACK. W22 no person. W24 no record word. Slots: `{settlement}` once, per the leaf's `slots: ["settlement"]` for vid 3; the face opens on "Under", never on a `proper`-typed slot.

**THE NINE UNTOUCHED FACES.** Byte-identical to the annex at HEAD, verified by eye against `:2791-2803` character for character, including the three-space indent and the backticked tags. No variant added, removed, merged or renumbered; the three angle tags stand exactly as they stand (`[ledger]` · `[street]` · `[unfolding]`), one bracketed tag each, no `[plain]` anywhere; the pool's typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) are untouched and are not repeated here.

**REFUSED TARGETS: none.** All three targets were cured lawfully.

**ONE FORM QUESTION CARRIED FOR THE CHAIR (not a claim question; the refuter recorded it as its item 4).** The annex at HEAD backticks the tags (`` `[ledger]` ``, `` - `[face]` ``) while the brief states the projector's `FACE_ROW_RE` as a bare `- [face] …`. This packet reproduces the ANNEX's byte form, because the gate diffs the untouched faces against the annex; if the projector wants the bare form, the transform is mechanical over the whole block and is the projector lane's, not a re-wording of any face.

STATUS: COMPLETE (twelve faces written, three cured, nine byte-identical; every section written). Read-only on the dock; the only execution was the licence-card script.
