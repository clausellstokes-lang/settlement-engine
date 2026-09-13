# RECONCILIATION SLICE E — the composed-prose architecture and its critiques vs the kernel at the dock tip (Opus reviewer, 2026-09-13 ~12:4x; verbatim return; read at dock `60efe812b` with car 18m then uncommitted — it has since landed as `48b58031a`)

Path legend: `ARCH:N` = `$K/arch-prose/ARCH-COMPOSED-PROSE-v2.md` · `KERNEL` / `COMPOSE` / `GRAMMAR` / `FACESRC` / `REGISTER` = the dock's stateProseKernel.js / composeStateProse.js / dossier-annex-grammar.mjs / faceSources.js / prose-shift-register.json.

## 1. FINDINGS

1. `"nothing a covert piece does may be observable on the player face"` ARCH:282 | CONTRADICTED (ARCH §4.2 + kernel law 2 vs ruling 26) | ruling 26 REQUIRES the player page of a captured town to differ; the law wins | re-cut kernel law 2 to "the page never STATES a covert fact"; replace the PAIRED-TOWN byte-equality arm with an audience-gate arm.
2. `"Same seed, same state ⇒ same composed text on every visit, forever"` ARCH:452 | SUPERSEDED (26(h)) | the compromised roll is seeded on the YEAR; THE PROMISE now reads "same seed, same state, same year" | re-word §7, §4.7, §14.
3. `"Nothing reads a clock, a counter, a cache, or a locale"` ARCH:341 | CONTRADICTED (P-F8 vs 26(h)) | the year is persisted world state, not a clock; the law wins on the merits | write the distinction into §4.7 and pin it.
4. `"Every face is eligible whenever its parent is, structurally"` ARCH:165 | CONTRADICTED (15 / 18c) | drawFace's modulus is the per-town eligible count | re-ground §2.1/§2.6: the roll is two-level because the PARENT key is untouched.
5. `"No draw-time filter, weight or refusal"` ARCH:43 | CONTRADICTED (15) | the face draw refuses at render on the roster; lawful because the parent modulus never moves | amend the non-goal; pin the parent-modulus invariant.
6. `"FACES | 4 per variant … fixed at the freeze"` ARCH:388 | SUPERSEDED (21.2 / 18j) | the pin is derived: 1 + FACE_SOURCES.length | strike the constant.
7. `"Wordings: 2,266 × 4 − 7 × 3 = 9,043"` ARCH:167 | SUPERSEDED (15 + 21.2) | up to 13 per variant; §6.6's counts out by ~3× | re-measure at the block grain.
8. `"≈ 2.2 MB raw … ≈ 2.8 MB at the ceiling"` ARCH:564 | UNADDRESSED | no car re-prices the leaves at the new pin; the three first-paint ceilings are owner-signed | a byte car: re-run X-F6's 160.8 B/face at the new pin and put the number to the owner.
9. `"the unit is at most TWO sentences with at most ONE joint"` ARCH:308 | SUPERSEDED (30) | three at most | re-word §4.4; car 18o.
10. `"≤ 2 sentences, ≤ 1 joint…"` ARCH:505 | UNADDRESSED (30) | nothing asserts the drawn unit ≤3; assertFaces refuses a two-sentence WEIGH but not a two-sentence pair HALF | car 18o.
11. `wordings?: string[]` ARCH:93 | SUPERSEDED | the leaf carries `sources`, `pairs`, `compromised` | §2.3 rewritten in v3.
12. `"angle: plain — standpoint-neutral by law"` ARCH:62 | CONTRADICTED (13a/25) | a standpoint-neutral modifier is a bare assertion | strike `plain`; a modifier carries a source tag and a role slot.
13. `"the connective phrase … lives in the CONNECTIVES LEAF and nowhere else"` ARCH:122 | CONTRADICTED (23 / 18i) | joints now in two homes; the pair joint's licence is the KIND (rhetoric), not a typed edge | record the two domains; rule the rhetorical licence explicitly (car 0's F1 proved the edge table empty).
14. `"every fact acquires a typed SOURCE … frozen holder table"` ARCH:806 | IMPLEMENTED (13/13b/15; 18c/18l) | FACE_SOURCES; sourcesOf/rolesOf | promote §16.10 into §2.
15. `"the passage's shape becomes a fourth seeded draw over a CLOSED set of three"` ARCH:807 | SUPERSEDED (29) | SURVEY_FRAMES + opener classes | car 18o should re-point the existing `passage-shape` register row.
16. Ruling 29's frames and classes | UNADDRESSED | nothing exists in the dock | car 18o.
17. Rulings 27, 28 | UNADDRESSED | no `public` token; no `observed` mark; eligibleFaces excludes the archiver | car 18n (moves FACE_PIN via 18j's derivation).
18. `"the position budget is an arrangement over draws already made"` ARCH:341 | UNADDRESSED (25(e)) | the exclusion Set is minted PER DESK ENTRY (FACESRC:377) and generalDeskLines is called at six un-memoised sites per page-set — a page can print the same role six times | thread one exclusion set per page-set, or rule the desk entry as the grain.
19. `"a drop that changes no modulus of any drawn pool"` ARCH:285 | UNADDRESSED | roleRawOf mutates `printed` BEFORE fillSlots can drop the piece — a dropped face consumes a role (P-F3's shape at the role grain) | commit the role only when the piece lands; a planted pin.
20. `"THE SHIFT REGISTER: every mechanism whose change re-rolls a drawn index"` ARCH:538 | UNADDRESSED | no row for the ROLE draw (18l) or the compromised YEAR roll (18m) | add both rows, the year one flagged as the first draw input that is not seed + pool identity.
21. `"the DESK supplies KEYS … the COMPOSER supplies everything else"` ARCH:265 | CONTRADICTED (18m as written) | COMPROMISED_SYMPTOM_POOLS hard-codes DS-DEF-2 pool keys inside the pure composer | move the symptom marks into poolMeta/the census.
22. `"the LICENCE CARD … printed from the census row"` ARCH:474 | SUPERSEDED (4, 9) | the marker writes what would be false | strike §8.3's role.
23. `"k ≤ 3 − |spine.reads|"` ARCH:306 | IMPLEMENTED, now second-order | the binding constraint is ruling 30's cap and 15's one-per-source | v3 says the fact budget no longer governs density.
24. `"A5 sibling distance … REPORT → FAIL"` ARCH:502 | SUPERSEDED (1) | a per-face band by another name | demote A5 to a permanent report.
25. `"A6 … slot/mark byte-equality"` ARCH:501 | IMPLEMENTED (2) | | none.
26. `"OCCURRENCE ≥ 51 of 768 … DEPARTURE 10%"` ARCH:311 | UNADDRESSED vs 16 | the RATE corpus's population changed under the power gate (532/768 towns lose a faction) | re-run the RATE corpus after 18e lands on the product.
27. Rulings 22, 23 | IMPLEMENTED (18i) | | v3 §2.2 gains the pair and the weighing as first-class piece kinds.
28. `"the PDF — no state prose reaches it"` ARCH:555 | IMPLEMENTED (confirmed) | makes law §1 untrue of the printed artefact | record the PDF as a declared gap beside the GM edit path.
29. `"armThreeNumbers … FAIL past BUDGET/DEPTH"` ARCH:514 | IMPLEMENTED (1) | | none.
30. `"the FLOOR … spine plus ONE until the owner signs S2"` ARCH:41 | UNADDRESSED | the law never mentions S2 | the chair rules S2 moot for pairs and re-puts or retires it for modifiers, as an owner row.

## 2. COUNTS

IMPLEMENTED 6 · SUPERSEDED 8 · CONTRADICTED 7 · UNADDRESSED 9.

## 3. THE CRITIQUES REVISITED

- critique-explosion: STANDS and has moved axis — the MODIFIER cross-product was bounded; the FACE axis is now the one growing, with no occurrence floor or CUT rule; ruling 16 bounds it from the simulation side; nothing prints face-grain ATTACH COVERAGE.
- critique-economics: STANDS, unpriced — X-F5/X-F6 computed at four faces; ~3× low at a pin of 14; ruling 8 and 24 cut per-pool cost; pool 1 is the only datum; nothing re-prices the wave.
- critique-migration: largely discharged; ONE LIVE INSTANCE — the ROLE draw and the YEAR roll are undeclared re-rolls, and a per-cell classifier cannot classify a text that moved because a role was drawn differently earlier on the page.
- critique-promise: two HIGH findings overruled by the owner by name (P-F3 → ruling 26; P-F8 → 26(h)); its structural cures all hold; THE PROMISE restated at a new grain: same seed AND year → same page.
- critique-truth: T-F2 (no engine relation row joins a desk read root) stands; ruling 23 solved the joint by RHETORIC (the pair's kind) which the receipt-pools doctrine refused; T-F5 overruled by 26; T-F12 and T-F13 still owed.

## 4. VERDICT

ARCH v2 still describes the system at the draw, migration, instrument and byte-routing grain. It no longer describes it at the four grains the rulings moved: the FACE (one per seated source, count derived, eligibility per town), the UNIT (the pair with its seeded joint and the weighing is now the source of the second voice — the modifier machinery is intact and UNUSED: 0 of 708 pools declare role: modifier), the AUDIENCE (a covert fact is visible in its behaviour, inverting kernel law 2), and DETERMINISM (the year is a draw input). A v3 must be re-centred on the speaker. THE ONE ARCHITECTURAL RISK NO CRITIQUE FORESAW: the render has become PAGE-DEPENDENT and ORDER-DEPENDENT while every instrument remains keyed on the pool or the mount — three cross-unit constraints (no role twice on a page; no frame twice and no adjacent opener class; the compromised source forced into one or two pools of a page) require a mutable exclusion set threaded across desks, exactly the shared state the purity fence and the determinism law were written to forbid. It is already wrong in both directions: the set is minted per desk entry (six per page-set), so the rule implemented is not the rule signed; and a piece that drops on an unfillable slot has already consumed a role, so what a suppressed piece prevented is observable, with no arm that can see it.
