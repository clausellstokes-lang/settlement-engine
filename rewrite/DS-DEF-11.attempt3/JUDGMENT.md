# JUDGMENT — REWRITE of block DS-DEF-11 (Fable judge, 2026-09-09, under SITTING §T.4 / §T.5 by the chair's delegated ruling)

Seat: Fable 5.1, the JUDGE. Dock: `laneRW-DEF11`, HEAD `0cc78d31529581c9e4d3341f422cff38a09c5158` (the refine commit "REWRITE 8b DS-DEF-11 refine: 5/5 kept, 0 reverted"), porcelain 0 — CONFIRMED by `git rev-parse HEAD` and `git status --porcelain | wc -l` → `0`, checked before the first read and again before this file was written. Nothing committed, nothing edited in the annex, no vitest started, no build, no register written: this file RULES.

Read whole before ruling: every pool's `kept.md`, `refine.md` and the draft packet the refinement was taken off (`draft-round-1.md` for WALLED-THREATENED, UNWALLED-SMALL and UNWALLED-LARGE; `draft-round-2.md` for WALLED-QUIET and WALLED-STRAINED, whose `draft-round-1.md` was also read); the four refuter files on disk (`refute-fable.md` ×3, `refute-armA.md`) and the verdict array handed to this seat (five pools, every face — the WALLED-QUIET verdicts exist only in the handed array; no refute file is on disk for that pool); the refine commit body; the annex section `### DS-DEF-11` of `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` at HEAD — EXECUTED: all 48 `kept.md` rows stand in the block verbatim (12 · 12 · 8 · 8 · 8, ALL PRESENT); the old shipped rows at `0cc78d315~3`; the refine gate's own packet `.packets/A/measure-A.json` (arm A, round 3, 2026-09-09T18:55:54, 28 s) and the draft gate's `.packets/draft/measure-draft.json`; the previous attempt's `DS-DEF-11.attempt1/JUDGMENT.md` for the machine-section grammar the APPLY gate parses.

Code spot-checks, read-only in the dock (no probe executed): `src/data/spatialData.js:40` — `Citadel` REQUIRES `City walls and gates` or `Massive walls and fortifications`; `src/domain/institutions/defenseInstitutionBuckets.js:84-86` — `DEFENSE_BUCKET_KEYWORDS.walls` carries both `wall` and `citadel`; `src/data/constants.js:4-5` — `SMALL_TIERS = ['thorp','hamlet','village']`, `TOWN_PLUS_TIERS = ['town','city','metropolis']`; `src/domain/display/stateProse/defenseStateProse.js:912-921` — `defworkFill` returns the FIRST matching wall-class name; `:938-952` — `wallRationalePoolKey` reads `tier` only on the unwalled branch. The refuters' PLAUSIBLE "uniqueness the card does not license" class (a citadel town holds two standing wall-class works and `{defwork}` names one) is therefore CONFIRMED by reading at this seat, and the UNWALLED-SMALL "band, never the value 'village'" ground with it.

## 0. The rules applied, per variant, on the refuters' verdicts

1. A FAIL that names a law and quotes the face → that FACE reverts to its draft face at the same face index (the numbered line is face 0; the three `[face]` sub-rows are faces 1–3), one for one; the variant keeps its other faces.
2. A WITHHELD → keep, listed.
3. A FAIL naming no law → treated as WITHHELD. (None occurred: every FAIL in the array names a law.)
4. A face reverted to a draft face that the refuter ALSO failed on the same ground → the WHOLE POOL is a REFUSAL row for the chair; its rows stay as they are (no face of that pool reverts); listed with the finding.
5. Never trim: no face or variant is removed.

Interpretive calls, recorded for the chair's veto:

(a) **"The same ground"** — adopted from the DS-DEF-1 and attempt-1 judges for consistency across the block family: rule 4 fires where the refuter's OWN finding attaches to the draft face at that index — stated outright ("the draft carried the same durative", "a revert does not cure", "the draft carried the same perfect") — or where the quoted clause and the named law stand verbatim in the draft face at that index. It does NOT fire on a ground the refuter merely could have raised, and it does not fire on the REFINER's declared faults (the plural-fill article, the tier noun), which are notes, not verdicts. Every rule-4 trigger below cites the refuter's words or the verbatim clause.

(b) **The revert target** is the draft round the refinement was taken off, as each `refine.md` header records: WALLED-THREATENED → `draft-round-1.md`; WALLED-QUIET → `draft-round-2.md`; WALLED-STRAINED → `draft-round-2.md`; UNWALLED-SMALL → `draft-round-1.md` (the refine and refute headers both record that no round-2 packet exists); UNWALLED-LARGE → `draft-round-1.md` (same). The draft commits: round 1 `a9d2ffe5b`, round 2 `e09b3e8b9`.

(c) **A refusal pool reverts nothing.** Rule 4 says the rows stay as they are, so no `--- REVERTS` line names a face of a refused pool; the faces of such a pool that WOULD have reverted cleanly under rule 1 are named in §3 as carve-out candidates, which are the chair's, not this seat's.

## 1. What stands in the annex at HEAD, by pool

| pool | dir | annex rows at HEAD | what the rows are | wordings per variant | round counter (handed) |
|---|---|---|---|---|---|
| WALLED-THREATENED | `ds-def-11--walled-threatened` | 3 numbered + 9 `[face]` | the refinement, applied verbatim over draft round 1 | 4 · 4 · 4 | rounds 2, in-band |
| WALLED-QUIET | `ds-def-11--walled-quiet` | 3 numbered + 9 `[face]` | the refinement, applied verbatim over draft round 2 | 4 · 4 · 4 | rounds 2, in-band |
| WALLED-STRAINED | `ds-def-11--walled-strained` | 2 numbered + 6 `[face]` | the refinement, applied verbatim over draft round 2 | 4 · 4 | rounds 2, in-band |
| UNWALLED-SMALL | `ds-def-11--unwalled-small` | 2 numbered + 6 `[face]` | the refinement, applied verbatim over draft round 1 | 4 · 4 | rounds 2, in-band |
| UNWALLED-LARGE | `ds-def-11--unwalled-large` | 2 numbered + 6 `[face]` | the refinement, applied verbatim over draft round 1 | 4 · 4 | rounds 2, in-band |

Variants in the block: 3 + 3 + 2 + 2 + 2 = **12**. Wordings standing: 12 + 12 + 8 + 8 + 8 = **48** (matches the gate's walk of 48 units, exhaustive). Nothing is trimmed by any ruling below: 12 variants and 48 wordings before, 12 and 48 after.

## 2. Rulings, face by face

### 2.1 `ds-def-11--walled-threatened` — RULED; eight faces revert (rule 1), one WITHHELD kept, three PASS kept. Not a refusal row.

Revert target: `draft-round-1.md`. Draft faces at the reverted indices are quoted in the ruling column.

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[ledger]` | 0 | PASS | the card (may claim: present as a standing fact); order constraint 10 | "{settlement} has the {defwork} standing to its name." | KEEP. |
| 1 | 1 | **FAIL** | the card (may NOT: a second fact); MOVE-GRAMMAR §1.2 row 5 / R-DA-15 (uniqueness only where `closed` is true) | "The item of fortification {settlement} shows is the {defwork}." | **REVERT** → draft v1 f1 *The town of {settlement} is possessed of a {defwork}.* Rule-4 check: the refuter's ground is the definite singular's uniqueness claim; the draft face is an indefinite possession and the refuter attached nothing to it — no trigger. (This face is also one of the four X-arm inherited clauses in the gate; the revert removes it.) |
| 1 | 2 | **FAIL** | the card (a second fact); MOVE-GRAMMAR §1.2 row 5 | "In the {defwork} stands {settlement}'s fixed defense." | **REVERT** → draft v1 f2 *Among the defenses of {settlement} the {defwork} holds its place.* Rule-4 check: the refuter says "the draft's indefinite classification became an identity under the number cure" — the draft is the refuter's own contrast, not a failed face; no trigger. |
| 1 | 3 | PASS | the card; R-DA-18 | "Under the head of defense {settlement} holds the {defwork}." | KEEP. |
| 2 `[street]` | 0 | **FAIL** | the card (a second fact); MOVE-GRAMMAR §1.2 row 5; MOVE-GRAMMAR §3.4 and A11 (a pool's spread is not spendable); Part B §21 (regression on a named target) | "The work of defense at {settlement} is the {defwork}." | **REVERT** → draft v2 f0 *{settlement} has a {defwork} standing.* Rule-4 check: the refuter names the draft's 2-f0 as "a settlement-subject SVO distinct from V3's copular" — the draft is the standard the refinement regressed from, not a failed face; no trigger. See hazard H1 (the hybrid puts two adjacent numbered lines on the settlement token). |
| 2 | 1 | WITHHELD | the card (a second fact) — unproven | "What goes with {settlement} is the {defwork}." | KEEP, listed (rule 2). The chair may fold it with the equatives or let it stand. |
| 2 | 2 | **FAIL** | the register card (the WORD may recur, the FACT must not; a second clause is a second fact or nothing — S2) — CONFIRMED | "With the {defwork} for a fixture, {settlement} is walled." | **REVERT** → draft v2 f2 *With the town at {settlement} goes a {defwork}.* Rule-4 check: the restatement lives in the refined absolute-plus-clause shape; the draft face is one clause and the refuter attached nothing to it; no trigger. |
| 2 | 3 | PASS | the card; R-DA-05 | "For fortification {settlement} has the {defwork}." | KEEP. |
| 3 `[visitor]` | 0 | **FAIL** | the card (a second fact); MOVE-GRAMMAR §1.2 row 5 / R-DA-15 | "The fortification of {settlement} is the {defwork}." | **REVERT** → draft v3 f0 *The fortification of {settlement} is a {defwork}.* Rule-4 check: the refuter: "The draft's 'is a {defwork}' was a classification; the definite article made it an identity" — no trigger. |
| 3 | 1 | **FAIL** | the register card (the FACT must not recur inside one sentence); R-DA-22 (one term for one thing); the card (a second fact) — CONFIRMED | "Fortified, {settlement} has the {defwork} as its fabric." | **REVERT** → draft v3 f1 *Walled by a {defwork}, {settlement} stands.* Rule-4 check: both grounds ('Fortified' + 'has' as one fact twice; 'fabric' as the estate's term) are refinement words absent from the draft; no trigger. |
| 3 | 2 | **FAIL** | the card (a second fact); MOVE-GRAMMAR §1.2 row 5 | "Fixed defense at {settlement} takes its shape in the {defwork}." | **REVERT** → draft v3 f2 *Fixed defense at {settlement} takes the form of a {defwork}.* Rule-4 check: the refuter's ground is the definite `the {defwork}` as the shape of ALL fixed defense; the draft's indefinite complement is a classification of kind, and the refuter attached nothing to it. No trigger — recorded as the nearest call in this pool, since the bare mass-noun subject survives the revert. |
| 3 | 3 | **FAIL** | A5 / the four-faces rule (never a paraphrase of its sibling) — CONFIRMED; the card (a second fact) — PLAUSIBLE | "The standing work at {settlement} is the {defwork}." | **REVERT** → draft v3 f3 *The walled place at {settlement} has its {defwork}.* Rule-4 check: the A5 ground is against refined 3-f0 (itself reverting); the draft pair *The fortification of … is a* / *The walled place at … has its* are different frames; no trigger. |

Pool result: 12 wordings stand; 8 revert to draft-round-1 text that was gated lawful at `a9d2ffe5b` and re-measured lawful at `e09b3e8b9` (owned failing 0). The gate's four inherited X-arm clauses on this pool (1-f1, 2-f0, 3-f0, 3-f3 — the four copular equatives) are exactly the faces the refuter failed on the uniqueness ground, and all four leave with the reverts.

### 2.2 `ds-def-11--walled-quiet` — REFUSAL ROW (rule 4, two triggers). Rows stay as they are (the refinement's twelve).

Revert target, had rule 1 applied: `draft-round-2.md`.

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[visitor]` | 0 | PASS | the licence card; the register card; MOVE-GRAMMAR §1.4.1 | "{settlement} keeps a {defwork}, and the {defwork} stands." | KEEP. |
| 1 | 1 | PASS | the licence card; R-DA-18; Part B §21.4 | "The {defwork} at {settlement} is a work that stands." | KEEP. |
| 1 | 2 | PASS | the licence card; ARCH §2.5; §1.4.1 | "At {settlement} stands a {defwork}." | KEEP. |
| 1 | 3 | **FAIL** | the register card (the FACT must not recur; a sentence lands and stops); MOVE-GRAMMAR §1.1 R-DST-B; the licence card (may NOT: a future, a second fact) | "A {defwork} stands at {settlement}, and it goes on standing." | **RULE 4 FIRES.** The refuter, on the draft face at this index (*At {settlement} a {defwork} is up, and up it remains.*): "The draft face it replaced carried the same durative ('up it remains'), so this is not a regression against the draft; it is the face's own breach." A revert restores the same durative under the same law. |
| 2 `[elder]` | 0 | PASS | the licence card; the register card (S2; the rationed semicolon) | "The {defwork} stands; {settlement} has it up." | KEEP (held verbatim from the draft). |
| 2 | 1 | PASS | the licence card; the register card (the short line exists) | "A {defwork} at {settlement} is up." | KEEP. |
| 2 | 2 | FAIL | the register card (the FACT must not recur); Part B §16 item 6; Part B §21.4; the licence card (another civic object of the class wall, by the cleft's exhaustive reading) | "What {settlement} has is a {defwork}, up and standing." | Would REVERT under rule 1; held by the pool refusal. Carve-out note: by INDEX the draft face is *The {defwork} {settlement} has, it has standing.* (the comma-splice row the refiner called costume, R-DA-18); the refuter's "the draft face this replaced ('and it is up')" reads the draft's face 3 cleft by CONTENT. The chair chooses the target if a carve-out is ordered. |
| 2 | 3 | PASS | the licence card; R-DA-07 | "The {defwork} {settlement} has is standing." | KEEP. |
| 3 `[ledger]` | 0 | **FAIL** | the register card (the record never sums up the sentence before); the licence card (one claim) | "Set down as standing, the {defwork} stands." | **RULE 4 FIRES.** The refuter, on the draft face at this index (*Entered as standing, the {defwork} stands.*): "The draft's 'Entered as standing, the {defwork} stands' had the same shape, so no regression against the draft; the breach is the face's own." |
| 3 | 1 | PASS | the licence card; MOVE-GRAMMAR §4.4.3; Part B §21.4 | "The {defwork} stands as entered." | KEEP. |
| 3 | 2 | PASS | the licence card; the register card (the office's formula) | "A {defwork} is entered, and entered as it stands." | KEEP. |
| 3 | 3 | FAIL | A5 / the four-faces rule; Part B §21.1 | "The {defwork} is carried as standing." | Would REVERT under rule 1 → draft v3 f3 *What is entered is a {defwork}, and it is entered standing.* (the refuter: "both faces are new in the refinement, so the pair is the refiner's, not the draft's"); held by the pool refusal; a clean carve-out candidate. |

Pool result: REFUSAL ROW. The rows stay as the refinement's twelve (owned failing 0 at the gate). Two faces (1-f3, 3-f0) carry a breach the refuter attaches to the draft face at the same index; two faces (2-f2, 3-f3) have a revert the refuter did not fault, named above as carve-out candidates.

### 2.3 `ds-def-11--walled-strained` — REFUSAL ROW (rule 4, four triggers). Rows stay as they are (the refinement's eight).

Revert target, had rule 1 applied: `draft-round-2.md`.

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[ledger]` | 0 | **FAIL** | A11 / B-CLAIM: a pool's spread is never spent (MOVE-GRAMMAR §3.4; R-DA-05; Part B §16 wall list) — `check-pair.mjs:257` A11 SHARED OPENER CREATED, traced not executed | "The {defwork} at {settlement} is the town's." | **RULE 4 FIRES (the verbatim limb).** The quoted clause is, word for word, the first sentence of draft-round-2 v1 f0 (*The {defwork} at {settlement} is the town's. Its muster is paid short of the upkeep.*), and draft-round-2 v2 f0 opens *The {defwork} of {settlement}* — the shared `the {}` opener stands in the draft pair exactly as in the kept pair. The refuter's BEFORE pair (*{settlement}'s {defwork}* / *The {defwork} around*) is the shipped rows at `0cc78d315~3`, which no draft packet on file restores. A revert cures nothing on the named ground. |
| 1 | 1 | FAIL | R-DST-B / C3 (a state field licenses a structural clause, never a historical one); the card (a cause, a second fact); the PROVENANCE line | "is the town's own work" | Would REVERT under rule 1 → draft v1 f1 *At {settlement} the {defwork} is a work the town owns. The outlay against its muster falls under the charge.* (the refuter: "the draft's 'a work the town owns' carried ownership only. A new failure added by the refinement"); held by the pool refusal; a clean carve-out candidate. |
| 1 | 2 | PASS | none | "Its muster costs more than the town pays." | KEEP. |
| 1 | 3 | PASS | none | "Its muster's wage falls short." | KEEP. |
| 2 `[unfolding]` | 0 | **FAIL** | A11 / B-CLAIM (the other half of the created shared opener) | "The {defwork} of {settlement} is in the town's hands." | **RULE 4 FIRES (the verbatim limb).** The refiner HELD this line from the draft; the draft face at this index is byte-identical, so the revert is a no-op on the quoted clause and the named law. |
| 2 | 1 | **FAIL** | C3 / STATE never FATE (a perfect aspect on a standing fact; R-DA-07; CLERK-LAWS C3); the card (a STANDING shortfall, never a non-payment) | "an account the town has not answered" | **RULE 4 FIRES.** The refuter: "The draft carried the same perfect, so not a regression, but the law binds." Draft v2 f1 reads *… The account for its muster's pay is one the town has not answered.* — the same perfect, verbatim. |
| 2 | 2 | **FAIL** | the register card (a second fact takes its own sentence; S2's exception not met); R-DA-18 (costume in the syntax) | "the {defwork} its own, has the muster's hire unsettled" | **RULE 4 FIRES.** The refuter: "Same shape as the draft's 2b, so not a regression, but the law binds." Draft v2 f2 reads *The town at {settlement}, the {defwork} its own, has the muster's wage unsettled.* — the same absolute, one noun apart. |
| 2 | 3 | FAIL | A5 / the four-faces rule; §21.1 sibling distance | "Provision for its muster is not made good." | Would REVERT under rule 1 → draft v2 f3 *The town at {settlement} owns the {defwork}. What the muster's upkeep comes to is a charge not made good.* (the refuter: "The draft's 2c stood in a different frame"); held by the pool refusal; a carve-out candidate (the refuter called it "the least certain of the fails, ruled FAIL by the default"). |

Pool result: REFUSAL ROW. The rows stay as the refinement's eight (owned failing 0 at the gate; one inherited X clause on 1-f0's first sentence). The refuter's named cure for the A11 pair — move ONE numbered line off `The {defwork}` — is a re-cut, not a revert to any packet on file; the chair's. The chair's §B reserve (whether "a second fact" reaches the presence read) is untouched by this ruling, as by the refuter's.

### 2.4 `ds-def-11--unwalled-small` — REFUSAL ROW (rule 4, one trigger). Rows stay as they are (the refinement's eight).

Revert target, had rule 1 applied: `draft-round-1.md`.

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[street]` | 0 | PASS | the card (C1 + C2, nothing else); MOVE-GRAMMAR wall 3; wall 10; §1.4.1 | "No wall closes the place." | KEEP. (The gate's Q-arm WITHHELD on this sentence is answered by the refuter's PASS.) |
| 1 | 1 | PASS | the card; R-DA-11; §1.4.1; T-F8 | "Village size is where {settlement} stops." | KEEP. (Same on "The place goes unwalled.") |
| 1 | 2 | FAIL | the card (`reads: settlement.tier` licenses the band, never the value 'village'); CLERK-LAWS C2; A6; the draft's N4 rule regressed | "A village is the whole of {settlement}." | Would REVERT under rule 1 → draft v1 f2 *The size of {settlement} stops short of a town. The place goes unwalled.* (the refuter: "The draft face it replaced held the band"); held by the pool refusal; a carve-out candidate. Note: the refiner removed that draft face for its antithesis shape and the word 'town' (R-DA-02 / R-DA-22) — the refiner's grounds, not a verdict; and 'The place goes unwalled' then recurs at 1-f1 and 1-f2. |
| 1 | 3 | PASS | the card; R-DA-07; R-DA-03; §1.4.1 | "It is not a walled place." | KEEP. (Same on "No wall rings it" at 1-f2's second sentence — lawful alone, per the refuter.) |
| 2 `[visitor]` | 0 | PASS | the card (both reads in one predicate, no joint); S2 not engaged | "The most that stands at {settlement} is an unwalled village." | KEEP. |
| 2 | 1 | **FAIL** | the card, `may NOT: a cause`, on the ambiguity-that-opens-a-claim ground; the default to FAIL when uncertain; the draft's N6 flag | "A village at the largest, {settlement} is a place" | **RULE 4 FIRES.** The refuter: "The draft face it replaced carried the same fronting, so a revert does not cure; a re-cut without the fronting does." Draft v2 f1 reads *No bigger than a village, {settlement} is a place without a wall.* |
| 2 | 2 | FAIL | the card (the tier band, never the value); CLERK-LAWS C2; A6; the default | "What {settlement} amounts to is a village" | Would REVERT under rule 1 → draft v2 f2 *A village at its largest, {settlement} keeps no wall.* (a ceiling; the refuter did not fault it on this ground — "the mildest of the three tier findings"); held by the pool refusal. Note for a carve-out: the draft face carries the fronted shape the refuter faulted at 2-f1 and the verb 'keeps' the refiner cleared as WALLED-QUIET's. |
| 2 | 3 | FAIL | the card (a second fact; another civic object of the class wall) on the ambiguity ground; CLERK-LAWS C2; A6 | "The village {settlement} runs to is unwalled." | Would REVERT under rule 1 → draft v2 f3 *What stands at {settlement} is a village and no wall.* (not faulted by the refuter); held by the pool refusal. Note for a carve-out: its frame *… stands at {settlement} is …* is now the refined 2-f0's, an A5 neighbour inside the variant. |

Pool result: REFUSAL ROW. The rows stay as the refinement's eight (owned failing 0 at the gate; four inherited Q clauses on variant 1's LACK sentences, each of which the refuter read and passed). The lawful re-cut for 2-f1 is the one the refuter names: the two claims with no fronting, which the pool already carries at 2-f0.

### 2.5 `ds-def-11--unwalled-large` — RULED; two faces revert (rule 1), three WITHHELD kept, three PASS kept. Not a refusal row.

Revert target: `draft-round-1.md`.

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[counterforce]` | 0 | WITHHELD | R-DST-B / MOVE-GRAMMAR §1.2 row 2; the card (a second fact) — unproven | "Past village weight, {settlement} carries no wall." | KEEP, listed (rule 2). The ruling owed: whether the article-less fronted adjunct's garden path ('former village weight') opens a history claim. |
| 1 | 1 | WITHHELD | MOVE-GRAMMAR §1.4 wall 3 / §1.2 row 11 (ABSENCE never opens) against the card's present-holds and R-DA-02's LACK limb | "No wall encloses {settlement}, a town at the least." | KEEP, listed. The ruling owed: whether wall 3 covers the world LACK; the writer declared the reading twice. |
| 1 | 2 | PASS | R-DA-11; the card's reads row | "Larger than any village, {settlement} lies unwalled." | KEEP (the band boundary CONFIRMED in code by the refuter: `popToTier` monotone, village max 900 / town min 901). |
| 1 | 3 | **FAIL** | A5 / the owner's four-faces rule (a paraphrase of its sibling) | "Ranked a town and above, {settlement} is not walled." | **REVERT** → draft v1 f3 *Ranked with the towns, {settlement} is not walled.* Rule-4 check: the refuter did not fail the draft face and named it only for the ear ("the draft's 'Ranked with the towns' read cleanly; no law is broken by that alone"); under call (a) no trigger. See hazard H4: the draft face realises the refuter's frame description word for word against the kept 1-f2, so the A5 finding survives the revert on the refuter's own test; the revert removes only the 'and above' stumble. |
| 2 `[ledger]` | 0 | PASS | the card (C1, C2); S2 not engaged | "By weight {settlement} is a town or larger, and unwalled." | KEEP. |
| 2 | 1 | **FAIL** | A5 / the four-faces rule (a paraphrase past a synonym swap, against the spine) | "The rank of {settlement} is a town's or more" | **REVERT** → draft v2 f1 *No circuit runs about {settlement}, a town at least in weight.* Rule-4 check: the refuter calls the draft face "the denser lawful line"; no trigger. See hazard H5: the revert seats 'No circuit … runs about {settlement}' beside the kept 2-f2 *No circuit of wall runs about {settlement}, …* and raises the pool's lack-openers to three. |
| 2 | 2 | WITHHELD | MOVE-GRAMMAR §1.4 wall 3 / §1.2 row 11, the same reading as 1-f1 | "No circuit of wall runs about {settlement}, and the town" | KEEP, listed. 'circuit of wall' accepted as the wall inside its own negation; 'counted' will trip a COUNT-word arm but resolves to the band (a NOTE). |
| 2 | 3 | PASS | §21.4; the card | "Town weight attaches to {settlement}, and no wall does." | KEEP. |

Pool result: 8 wordings stand; 2 revert to draft-round-1 text gated lawful at `a9d2ffe5b` and re-measured at `e09b3e8b9`. The three WITHHELDs share one ruling (wall 3 and the LACK), which after the 2-f1 revert also reaches the restored draft face.

## 3. The refusal rows (for the chair)

| pool | trigger (rule 4) | the rows | clean carve-out candidates (rule 1 would have reverted; the chair's) | the re-cut the refuter names |
|---|---|---|---|---|
| `ds-def-11--walled-quiet` | v1 f3 ("carried the same durative", R-DST-B / the register card / may NOT a future) and v3 f0 ("had the same shape", the register card's summarising second beat) | stay as the refinement's 12 | v2 f2 (index target *The {defwork} {settlement} has, it has standing.*; content target *What {settlement} has is a {defwork}, and it is up.*); v3 f3 → *What is entered is a {defwork}, and it is entered standing.* | v1 f3: drop the tail (face 2's words reordered remain); v3 f0: one predicate once (faces 1 and 2 already do it); v2 f2: strike the doublet; v3 f3: a fourth rhythm, not a permutation of face 1 |
| `ds-def-11--walled-strained` | v1 f0 and v2 f0 (verbatim limb: the shared `The {defwork}` opener stands in draft-round-2's numbered pair exactly as in the kept pair); v2 f1 ("The draft carried the same perfect"); v2 f2 ("Same shape as the draft's 2b") | stay as the refinement's 8 | v1 f1 → *At {settlement} the {defwork} is a work the town owns. The outlay against its muster falls under the charge.*; v2 f3 → *The town at {settlement} owns the {defwork}. What the muster's upkeep comes to is a charge not made good.* | move ONE numbered line off `The {defwork}` (the refuter's cure); v2 f1 in the present; v2 f2 with the wall's presence in its own sentence |
| `ds-def-11--unwalled-small` | v2 f1 ("carried the same fronting, so a revert does not cure") | stay as the refinement's 8 | v1 f2 → *The size of {settlement} stops short of a town. The place goes unwalled.* (restores the antithesis shape and 'town' the refiner cleared); v2 f2 → *A village at its largest, {settlement} keeps no wall.* (the fronted shape again); v2 f3 → *What stands at {settlement} is a village and no wall.* (an A5 neighbour of the refined 2-f0) | v2 f1: the two claims with no fronting; v1 f2 / v2 f2: the band, never the value; v2 f3: a size verb that is not spatial |

## 4. The gate's final figures for the block (from `.packets/A/measure-A.json` — arm A, round 3, 2026-09-09T18:55:54, 28 s; the refine commit's own run; the APPLY gate re-runs it after the reverts)

**Roster and projection.** `--pools` named 5 pools by hand. Projection `ok: true`, waivers none: "[dossier-prose] verified 68 state blocks / 2266 variants across 6 desks, 78 causal families / 468 variants". Banked: count 0, pools [].

**The walk.** 48 units, `exhaustive: true` ("the whole population is walked, so every arm rate is exact"), sampleSha `ce8c8f54…`. Top-level walk verdicts: **FAIL 0 · WITHHELD 15 · PASS 33**. Per-pool walk verdicts, summed: FAIL 0 · WITHHELD 9 · PASS 39 (WALLED-THREATENED 0/4/8, WALLED-QUIET 0/0/12, WALLED-STRAINED 0/1/7, UNWALLED-SMALL 0/4/4, UNWALLED-LARGE 0/0/8). The six-unit gap between the two figures is not resolved from the packet's printed fields; both are printed as the instrument holds them, and the gap is an information row for the chair (§6, item 7), not a verdict.

**Owned verdicts (the writers' grain; what the keep-or-revert rule reads).**

| pool | owned FAIL | owned WITHHELD | owned PASS | owned findings | inBand | failing | pool verdict column | inherited (information) |
|---|---|---|---|---|---|---|---|---|
| WALLED-THREATENED | 0 | 0 | 12 | 0 | true | [] | WITHHELD | 4 — X · exhaustivity over an open column, on 1-f1, 2-f0, 3-f0, 3-f3 (the four copular equatives; all four revert under §2.1) |
| WALLED-QUIET | 0 | 0 | 12 | 0 | true | [] | PASS | 0 |
| WALLED-STRAINED | 0 | 0 | 8 | 0 | true | [] | WITHHELD | 1 — X, on 1-f0's first sentence |
| UNWALLED-SMALL | 0 | 0 | 8 | 0 | true | [] | WITHHELD | 4 — Q · a second sentence naming no second field, on v1's four LACK sentences (each read and passed by the refuter); qVocabulary 4 on the same clauses |
| UNWALLED-LARGE | 0 | 0 | 8 | 0 | true | [] | PASS | 0 |

**Corpus band (information, corpus grain):** every pool `budgetOk: false`, `depthOk: true`, `perfectionSuspect: false`; deepest metric per pool — WALLED-THREATENED `wordsPerSentence.neighbourVariation` 0.945 under; WALLED-QUIET `shareUnder8` 0.822 over; WALLED-STRAINED `neighbourVariation` 0.581 under; UNWALLED-SMALL `shareUnder8` 1.096 over; UNWALLED-LARGE `neighbourVariation` 0.697 under. Variety, shapes and ties were not asked for on this run.

**The classifier's cell classes for the block** (the prose manifest diff against the draft's cells, base `.packets/cells/base-draft.json`, 73,284 cells on the tip side):

```
PROSE MANIFEST DIFF · 73284 cells on the tip side
  REPLACED       cells       0 · towns     0
  RE-INDEXED     cells       0 · towns     0
  ADDITIVE       cells       0 · towns     0
  WORDING-ONLY   cells    1044 · towns   522
  UNCHANGED      cells   72240 · towns   525
  ADDED          cells       0
  REMOVED        cells       0
```

Every changed cell is WORDING-ONLY (1044 cells on 522 towns); none is REPLACED; none is RE-INDEXED; nothing added, nothing removed, indexOnly 0. No cell of the block changed pool at the refine commit, so no fact moved. The ten reverts ruled here restore text the same cells carried at the draft commits, so the APPLY gate's re-classification is expected to read WORDING-ONLY again with REPLACED 0 and RE-INDEXED 0; that figure is the APPLY gate's to print, not this seat's.

## 5. Tokens and round counters

**Tokens, as handed by the workflow:** draft 0 · refine 0 · refute 122261. The draft and refine zeros are the workflow's counters as passed to this seat (a run resumed off its journal re-bases the budget), not a measurement of this seat's; printed as handed.

**Round counters, as handed:** `ds-def-11--walled-threatened` rounds 2 in-band; `ds-def-11--walled-quiet` rounds 2 in-band; `ds-def-11--walled-strained` rounds 2 in-band; `ds-def-11--unwalled-small` rounds 2 in-band; `ds-def-11--unwalled-large` rounds 2 in-band. On disk: WALLED-QUIET and WALLED-STRAINED hold `draft-round-1.md` and `draft-round-2.md` (two draft packets; the refinement off round 2); WALLED-THREATENED, UNWALLED-SMALL and UNWALLED-LARGE hold `draft-round-1.md` only (lawful at round 1; the round-2 gate commit `e09b3e8b9` "5/5" re-measured them without a new packet, as the UNWALLED refine and refute headers record). The instrument's own per-pool `rounds` object reads `draftRounds 0 · refineA false · refineB false · files []` on every pool — it does not carry the counter.

**Totals of this ruling:** variants 12 (unchanged); faces reverted 10 (WALLED-THREATENED 8, UNWALLED-LARGE 2); WITHHELD kept 4 (WT 2-f1; UL 1-f0, 1-f1, 2-f2); refusal rows 3 (WALLED-QUIET, WALLED-STRAINED, UNWALLED-SMALL); faces or variants removed 0.

## 6. Rows for the chair (hazards the mechanical rules produce, and rulings owed) — none is a verdict

1. **H1 — WALLED-THREATENED's hybrid puts two ADJACENT numbered lines on the settlement token.** After the reverts: v1 f0 (refined, PASS) *{settlement} has the {defwork} standing to its name.* and v2 f0 (draft) *{settlement} has a {defwork} standing.* — order constraint 10 / MOVE-GRAMMAR wall 10 (one settlement-token opener per pool, never two adjacent), and `check-pair.mjs`'s `openerOf` reads both as `{} has` (A11 SHARED OPENER). The two lines are also near-duplicates. Neither packet has this collision (the draft's v1 f0 opened *A {defwork}*; the refinement spent the opener once, on v1 f0); it is the hybrid's. The rules give this seat no lever (v1 f0 passed; v2 f0's FAIL names a law). The chair's options: hold the v2 f0 revert as a carve-out (keeping the refined equative the refuter failed on uniqueness), or order a re-cut of v2 f0 off the settlement token. The APPLY gate should expect the pair instrument to red this pair.
2. **H2 — the eight WALLED-THREATENED draft faces bring back the refiner's two declared faults**, which are notes, not verdicts, and so cannot bar a rule-1 revert: the indefinite article / `{defwork}` as a finite subject on the plural fills (*a town walls*; `institutionalCatalog.js:1332`, `spatialData.js:37`) at 1-f1, 2-f0, 2-f2, 3-f0, 3-f1, 3-f2; and the tier noun 'town' at 1-f1 and 2-f2 (`wallRationalePoolKey` never reads `tier` on the walled branch — CONFIRMED at `:938-952`). The same two faults stand in the four sibling pools' rows as the refiner recorded. A pool-set row; the refuters did not rule on it.
3. **H3 — the uniqueness class is CONFIRMED in code by this seat** (§0 preamble): the refuters' PLAUSIBLE becomes CONFIRMED by reading. Every kept definite equative of the form *The X at/of {settlement} is the {defwork}* anywhere in the estate carries it; in this block the reverts remove all of WALLED-THREATENED's, and WALLED-STRAINED's 1-f0 (*is the town's*, a possessive not an identity) is the refuter's PASS on the claim and the gate's inherited X on the form.
4. **H4 — UNWALLED-LARGE 1-f3's revert does not cure A5 on the refuter's own test.** The draft face *Ranked with the towns, {settlement} is not walled.* is "a four-word fronted tier adjunct, comma, {settlement}, a two-word unwalled predicate" — the refuter's frame description of the refined face, word for word — beside the kept 1-f2 *Larger than any village, {settlement} lies unwalled.*; three of the variant's four faces keep one rhythm. Ruled a revert under call (a) because the refuter did not fail the draft face; the revert is a strict improvement (the 'and above' stumble goes) but not a cure. The chair may bank the pool or order a fourth rhythm at 1-f3.
5. **H5 — UNWALLED-LARGE 2-f1's revert re-creates the 'circuit' pair the refiner split.** The refiner moved the draft 2-f1's noun 'circuit' into the re-cut 2-f2; the revert restores *No circuit runs about {settlement}, a town at least in weight.* beside the kept 2-f2 *No circuit of wall runs about {settlement}, and the town is counted above the villages.* — one opener (`No circuit`), one predicate, the band as appositive against the band as clause: an A5/A11 neighbour inside the variant, and a third lack-opener in the pool under the wall-3 ruling still owed (1-f1, 2-f2 WITHHELD). Options: hold the 2-f1 revert as a carve-out (keeping the refined flat line the refuter failed only against the spine), or re-cut 2-f2 (WITHHELD, so no rule reverts it; its draft is *Entered among the towns, {settlement} has no walls.*, which the refiner cleared for the WALLED-QUIET 'Entered' and the small pool's 'has no wall' collisions).
6. **The general shape of H1, H4 and H5:** a one-for-one revert by index into a refinement that moved vocabulary and openers BETWEEN faces (the refiner's spread cures) re-creates collisions the refiner cured, because the refined siblings were re-cut against the refined face, not the draft one. The wave gate's per-variant `siblings.spread` (sameOpenerPairs, overlapBp) will measure it at the APPLY gate; that measurement, not this seat's reading, is the figure.
7. **The walk figure gap** (§4): top-level WITHHELD 15 / PASS 33 against per-pool sums WITHHELD 9 / PASS 39 on the same 48 units. Not resolved from the packet's fields; an instrument row.
8. **Rulings owed that the refuters could not close:** (i) whether MOVE-GRAMMAR wall 3 / §1.2 row 11 (ABSENCE never opens) covers the world LACK licensed by R-DA-02's first-half limb — UNWALLED-LARGE 1-f1, 2-f2 and, after the revert, 2-f1; the sibling pool UNWALLED-SMALL keeps its lack second in every row; (ii) whether the article-less *Past village weight* opens a history claim (UL 1-f0); (iii) whether the free relative *What goes with {settlement} is the {defwork}* asserts exclusivity (WT 2-f1); (iv) the WALLED-STRAINED §B reserve on the presence read; (v) the WALLED-QUIET carve-out target by index or by content (§2.2, v2 f2).
9. **Two wiring rows the packets raised, still open:** `{defwork}` is NAMED BUT NEVER FILLED at this block's call sites per the card's own bag line while `defworkFill` exists at `defenseStateProse.js:912`; and the three walled pools' cards license one and the same claim (`present`) because the census recovered no predicate for `wallRationalePoolKey` — the sitting row both drafters raised (the quiet, the threat and the strain reach the reader only through the composed modifiers).

--- REVERTS
ds-def-11--walled-threatened | variant 1 | face 1
ds-def-11--walled-threatened | variant 1 | face 2
ds-def-11--walled-threatened | variant 2 | face 0
ds-def-11--walled-threatened | variant 2 | face 2
ds-def-11--walled-threatened | variant 3 | face 0
ds-def-11--walled-threatened | variant 3 | face 1
ds-def-11--walled-threatened | variant 3 | face 2
ds-def-11--walled-threatened | variant 3 | face 3
ds-def-11--unwalled-large | variant 1 | face 3
ds-def-11--unwalled-large | variant 2 | face 1

--- REFUSALS
ds-def-11--walled-quiet | rule 4 via variant 1 face 3 (the refuter: "The draft face it replaced carried the same durative ('up it remains')" — the register card / R-DST-B / may NOT a future) and variant 3 face 0 (the refuter: "The draft's 'Entered as standing, the {defwork} stands' had the same shape" — the record's summarising second beat); rows stay as the refinement's twelve (owned failing 0); clean carve-out candidates v2 f2 and v3 f3 (§3)
ds-def-11--walled-strained | rule 4 via variant 1 face 0 and variant 2 face 0 (the quoted A11 shared-opener clauses stand verbatim in draft-round-2's numbered pair; the refuter's BEFORE pair is the shipped rows, which no packet restores), variant 2 face 1 (the refuter: "The draft carried the same perfect") and variant 2 face 2 (the refuter: "Same shape as the draft's 2b"); rows stay as the refinement's eight (owned failing 0); clean carve-out candidates v1 f1 and v2 f3 (§3)
ds-def-11--unwalled-small | rule 4 via variant 2 face 1 (the refuter: "The draft face it replaced carried the same fronting, so a revert does not cure; a re-cut without the fronting does" — the card's may NOT a cause on the ambiguity ground); rows stay as the refinement's eight (owned failing 0); carve-out candidates v1 f2, v2 f2, v2 f3 with the collisions each restores (§3)
