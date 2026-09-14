# JUDGMENT — REWRITE of block DS-DEF-1 (Fable judge, 2026-09-09, under SITTING §T.4 / §T.5 by the chair's delegated ruling)

Seat: Fable 5.1, the JUDGE. Dock: `laneRW-DEF1`, HEAD `8236588ed3438442cbad2acef878a50656a95b6c` (the refine commit), porcelain 0 — CONFIRMED by `git rev-parse HEAD` and `git status --porcelain | wc -l` before a line was written. Nothing committed, nothing edited in the annex, no test run, no build: this file RULES.

Read whole before ruling: every `kept.md` (eight), the three `refute.md` files on disk (CRITICAL, EXPOSED, HIGH) against the verdict array handed to this seat (they agree), `draft-round-1.md` for WEAK, CRITICAL, FAVOURABLE and EXPOSED, `draft-round-3.md` for HIGH, the refinement packets for WEAK, CRITICAL, FAVOURABLE, EXPOSED and HIGH, the refine commit body, the round-1 draft commit body, the gate packet `.packets/A` and `.packets/structural.json`, and the annex section `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2500-2617` at HEAD.

## 0. The rules applied, per variant, on the refuters' verdicts

1. A FAIL that names a law and quotes the face → that FACE reverts to its draft face at the same index (one for one; the variant keeps its other faces).
2. A WITHHELD → keep, listed.
3. A FAIL naming no law → treated as WITHHELD.
4. A face reverted to a draft face that the refuter ALSO failed on the same ground → the WHOLE POOL is a REFUSAL row for the chair; its rows stay as they are; listed with the finding.
5. Never trim: no face or variant is removed.

How "the same ground" was read (the judge's one interpretive call, recorded for veto): rule 4 fires where the refuter's own finding attaches to the draft face — either stated outright ("a revert does not cure it", "the draft face carries the same claim"), or where the clause the refuter quoted and the law it named stand verbatim, or as the drafter's own declared carried claim, in the draft face at that index. It does NOT fire on a ground the refuter merely could have raised. Every rule-4 trigger below cites the refuter's own words or the byte-identical clause.

## 1. What stands in the annex at HEAD, by pool (measured)

| pool | annex rows (HEAD) | what the rows are | faces per variant | round counter (chair's) |
|---|---|---|---|---|
| readiness STRONG | 2524-2540 | refinement, applied verbatim | 4 · 4 · 4 · 4 | rounds 3, in-band |
| readiness ADEQUATE | 2542-2558 | refinement, applied verbatim | 4 · 4 · 4 · 4 | rounds 2, BANKED |
| readiness WEAK | 2560-2563 | the OLD shipped rows (draft and refinement both refused on the `[plain]` tag) | 1 · 1 · 1 | rounds 1, in-band |
| readiness CRITICAL | 2565-2568 | the OLD shipped rows (same refusal) | 1 · 1 · 1 | rounds 1, in-band |
| terrain FAVOURABLE to the defender | 2570-2582 | refinement, applied verbatim | 4 · 4 · 4 | rounds 1, in-band |
| terrain EXPOSED | 2584-2587 | the OLD shipped rows (same refusal) | 1 · 1 · 1 | rounds 1, in-band |
| strategic value HIGH | 2589-2601 | refinement, applied verbatim | 4 · 4 · 4 | rounds 3, in-band |
| strategic value LOW | 2603-2615 | refinement, applied verbatim | 4 · 4 · 4 | rounds 2, in-band |

Variants in the block: 4 + 4 + 3 + 3 + 3 + 3 + 3 + 3 = **26**. Wordings standing: 77 (matches the gate's walk of 77 units).

Verdicts were delivered to this seat for FIVE pools: WEAK, CRITICAL, FAVOURABLE, EXPOSED, HIGH. No refuter verdict reached this seat for STRONG, ADEQUATE or LOW; rules 1-4 have nothing to act on there, so those three pools stand as they are, listed in §4 as UNRULED (not as passed).

## 2. Rulings, face by face

The plain (numbered) line is face 0; the three `[face]` sub-rows are faces 1-3. "KEPT" means the standing annex row; "REFINE" means the refinement packet's row where it was not applied.

### 2.1 `ds-def-1--readiness-weak` — REFUSAL ROW (rule 4, and the packet premise)

Standing rows: the OLD shipped rows, no faces (kept.md byte-identical to annex 2561-2563, itself byte-identical to 8236588ed~2). The draft (b47d05cfd) and the refinement (8236588ed) were both refused on the second bracketed tag `[plain]` — the projector mints it as a mark and the projection contract reds `unclassified: ['plain']` (executed evidence in both commit bodies). So NO draft face at any index is an applicable revert target as it stands: every draft row carries the tag the projector refuses, and a revert would re-introduce the refused grammar.

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| PREMISE (packet) | — | FAIL | ARCH §2.5 row grammar; Part B §21.2 | `[ledger]` `[plain]` Taken whole, … | A packet-level finding, not a face; recorded as the ground on which no draft face applies without the chair's re-cut (the `[plain]` token struck). |
| 1 `[ledger]` KEPT | 0 | FAIL | ruling 5 / R-DA-20; the PROVENANCE FENCE; may-NOT a second fact; R-DA-02 | "Something is in place against most pressures" | Rule 1 would revert to draft-round-1 v1 f0: *Taken together, what {settlement} keeps against trouble is little. The town is not undefended, and it is not covered.* **Rule 4 fires**: the draft's second sentence is byte-identical to the refinement's, which the refuter FAILED ("The town is not undefended, and it is not covered." — MOVE-GRAMMAR §1.3 MEANING; R-DA-12/R-DA-03; R-DA-02's contrast licence not met). The common ground is the same on both rows: a second sentence R-DA-02 does not license (the kept row's antithesis names no sibling band; the draft's two-sided bracket is a gloss, not a claim-bearing contrast). The whole pool is a refusal row. |
| 1 KEPT | 1-3 | WITHHELD | Part B §22(b) / §21.2 | (no face rows) | Keep as absent, listed; the count is 1 wording, not 4. |
| 2 `[visitor]` KEPT | 0 | FAIL | fault 24 / ruling 5; MOVE-GRAMMAR §1.3 FEELING; R-DA-13; may-NOT a standpoint | "how much of the perimeter has nobody on it" | Would revert to draft v2 f0 *A stranger arriving at {settlement} finds little of what a defended town keeps.* — noted: its clause "what a defended town keeps" is the norm the refuter FAILED at refine v2 f3 (R-DA-12 generalisation), a different ground; not itself a rule-4 trigger. Subsumed by the pool refusal. |
| 2 KEPT | 1-3 | WITHHELD | Part B §22(b) | (no face rows) | Keep as absent, listed. |
| 3 `[unfolding]` KEPT | 0 | FAIL | MOVE-GRAMMAR §1.2 row 2 (HISTORY in R1 STATE, a wall); R-DST-B / A6; C3; R-DA-02 | "The margin has been narrowing rather than widening" | Would revert to draft v3 f0 *Thin defence is the condition {settlement} is in as matters stand.* — the refuter calls this wording the lawful literal the refiner spoiled; a clean target. Subsumed by the pool refusal. |
| 3 KEPT | 1-3 | WITHHELD | Part B §22(b) | (no face rows) | Keep as absent, listed. |
| 1 REFINE (unapplied) | 0 | FAIL | MOVE-GRAMMAR §1.3 MEANING; R-DA-12/R-DA-03; §16(6); §21 target (ii) | "The town is not undefended, and it is not covered." | Not in the annex; recorded as the rule-4 ground above. |
| 1 REFINE | 1 | FAIL | MEANING; R-DA-12 | "stands below covered and above undefended" | Not in the annex; recorded. |
| 1 REFINE | 2 | FAIL | MEANING; R-DA-18; R-DA-05 / §21 sibling distance (ADEQUATE's "keeps enough and keeps no more" mould) | "nor does it answer to covered" | Not in the annex; recorded. |
| 1 REFINE | 3 | WITHHELD | A6 vs R-DA-02; the register card | "falls short of covered without falling to undefended" | Not in the annex; a candidate for the chair's re-cut. |
| 2 REFINE | 0 | PASS | the card's angle line; R-DA-01; R-DA-04 | "a town with little defence to show" | Not in the annex; the refuter's cleanest visitor line — a re-cut candidate. |
| 2 REFINE | 1 | WITHHELD | A5 (paired with face 2); fault 24 shade | "A stranger at {settlement} meets slight defence." | Re-cut candidate. |
| 2 REFINE | 2 | FAIL | A5 / four-faces rule (a paraphrase of face 1) | "Anyone who comes to {settlement} finds a thinly defended place." | Recorded. |
| 2 REFINE | 3 | FAIL | R-DA-18; R-DA-12 generalisation; wall 5 (a second closing contrast) | "What a defended town keeps, {settlement} keeps in small measure." | Recorded. |
| 3 REFINE | 0 | FAIL | R-DA-11 (the figure asserts a fact); §21.4; the draft's F4 | "the footing {settlement} is on at present" | Recorded; the draft's literal line is the lawful one. |
| 3 REFINE | 1 | FAIL | R-DA-07 / A2 / C3 ("presently" = soon); A11 / §21.1 (a clause verbatim across variants 1 and 3) | "Presently the defence of {settlement} is thin." | Recorded. |
| 3 REFINE | 2 | PASS | the one triple; R-DA-04; R-DA-11 | "What {settlement} has in hand for its own defence is thin." | Re-cut candidate. |
| 3 REFINE | 3 | PASS | the one triple; R-DA-15; R-DA-04 | "Little is in place at {settlement} by way of defence." | The refuter's best line in the pool; re-cut candidate. |

**Refusal-row finding for the chair.** The pool cannot be reverted one for one: no draft face applies without striking `[plain]`, and the one face rule 1 would have reverted first carries a second sentence the refuter failed on the same R-DA-02 ground. The rows stay as they are (the OLD shipped rows). A lawful re-cut is already on the table from the refuter's PASSes and WITHHELDs: v2 f0 (PASS), v2 f1 (WITHHELD), v3 f2 (PASS), v3 f3 (PASS), v1 f3 (WITHHELD), plus the draft's v3 f0 literal. Two chair rows the pool also waits on: the card prints `may claim: nothing` for all four readiness pools (the template-literal recovery gap at `defenseStateProse.js:676-680`, `:752`), and the annex's STATE-KEY names `.label` where the code reads `.score` (the drafter's F2).

### 2.2 `ds-def-1--readiness-critical` — REFUSAL ROW (rule 4, and the packet premise)

Standing rows: the OLD shipped rows, no faces (kept.md byte-identical to annex 2566-2568 and to 8236588ed~2). Draft and refinement both refused on the `[plain]` tag, as WEAK.

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[ledger]` | 0 | FAIL | the card (may claim: nothing); PROVENANCE FENCE + CLERK-LAWS §1.3 LACK; C7 | "There is no arrangement here that would slow a serious attempt" | Rule 1 would revert to draft-round-1 v1 f0: *{settlement} is effectively undefended. A serious attempt on the town would meet nothing slower than the walk to its centre.* **Rule 4 fires**: the drafter's own notes declare claim (b) — "no arrangement would slow a serious attempt beyond the time of walking in" — carried in all four draft faces (f2 carries it as "by no arrangement the town keeps"), which is the very LACK across every arm the refuter failed; and the refuter states the card ground generally ("every standing face fails on that line alone"). The draft face also keeps "effectively", the hedge the refuter reported. |
| 1 | 1 | FAIL | four faces per variant; never-trim (b) | (no face) | Would restore draft f1 *The defence of {settlement} amounts to nothing an attempt in force would have to work at. …* — carries claim (b); same ground. Subsumed by the pool refusal. |
| 1 | 2 | FAIL | four faces; never-trim (b) | (no face) | Would restore draft f2 *… by no arrangement the town keeps* — the refuter's quoted clause near-verbatim; same ground. |
| 1 | 3 | FAIL | four faces; never-trim (b) | (no face) | Would restore draft f3 *For its defence {settlement} keeps nothing that would answer an attempt. …* — claim (b); same ground. |
| 2 `[street]` | 0 | FAIL | the card; MOVE-GRAMMAR §1.3 FEELING; R-DA-13; R-DA-11 (inanimate intent, "the knowledge shapes"); C3 / R-DA-07 | "The town knows perfectly well what it could not survive" | Would revert to draft v2 f0 *What the town could not survive shapes what it provokes and what it leaves alone.* — the belief frame is gone, but "shapes" on an abstraction is the R-DA-11 ground the refuter named on the kept row (the refiner struck the same verb for the same law). **Rule 4 fires.** |
| 2 | 1-3 | FAIL | four faces; never-trim (b) | (no face) | Draft f1-f3 drop the belief frame and the "shapes" verb; the card ground (may claim: nothing) the refuter generalises still attaches. Subsumed by the pool refusal. |
| 3 `[visitor]` | 0 | FAIL | REFUSED COLUMNS (a totality over persons); CLERK-LAWS §1.3; R-DA-15 row 6; the FENCE ("stopped, challenged" a per-arm claim; "counted" an institution negative) | "without being stopped, challenged or counted by anybody at all" | Would revert to draft v3 f0 *A stranger reaches the centre of {settlement} without being stopped, challenged or counted.* — the totality is dropped, but "stopped, challenged or counted" is the refuter's quoted clause verbatim, charged under the FENCE and as an institution negative. **Rule 4 fires** on that limb. |
| 3 | 1-3 | FAIL | four faces; never-trim (b) | (no face) | Draft f1-f3 (*Unasked … unasked*; *Arrival … goes unmarked … before the business of asking begins*; *Passage … is not stopped*) are clear of the totality; the card ground still attaches. Subsumed. |

**Refusal-row finding for the chair.** Every variant's draft face carries a clause the refuter failed on the kept row (v1 the LACK measure, v2 the "shapes" intent, v3 the "stopped, challenged or counted" limb), and no draft face applies without striking `[plain]`. Rows stay as they are. The gate's one walk FAIL in the block is this pool's spine (inherited, unchanged since the draft). The pool waits on the same two chair rows as WEAK (the `may claim: nothing` card; the STATE-KEY field), and on the chair's ruling whether the `[street]` belief frame is a claim of the shipped row (the drafter's declared claim-set delta) — if it is not, the refinement's v2 rows are the cleanest re-cut material; if it is, variant 2 has no lawful wording and is a banked variant.

### 2.3 `ds-def-1--terrain-favourable-to-the-defender` — REFUSAL ROW (rule 4)

Standing rows: the refinement, applied verbatim (kept.md = annex 2571-2582). Draft = `draft-round-1.md`. Nine PASS, three FAIL.

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[visitor]` | 0 | PASS | the card; MOVE-GRAMMAR §1.2 row 1; R-DA-03; C3 | "Whoever holds {settlement} holds ground that favours the defender." | Keep. |
| 1 | 1 | PASS | the card; R-DA-07; R-DA-11 | "must first cross ground that is hard on an attacker" | Keep. |
| 1 | 2 | PASS | the card; R-DA-02; R-DA-04 (band) | "The land about {settlement} is unbuilt defence." | Keep. |
| 1 | 3 | PASS | the card; §1.2 row 1; R-DA-11; §21.4 | "From any side, the way into {settlement} is the defender's own." | Keep. |
| 2 `[ledger]` | 0 | PASS | the card; A6; C7 | "Part of the defence at {settlement} stands to the site's account." | Keep. |
| 2 | 1 | PASS | the card; A5; A13 | "The site of {settlement} enters the reckoning on the defender's side." | Keep. |
| 2 | 2 | FAIL | A6 (claim-equal); the card's may-claim (the DEFENDER's favour) and may-NOT a second fact | "{settlement} draws an advantage from the country" | Rule 1 would revert to draft v2 f2 *In its siting, {settlement} has the better of the country.* **Rule 4 fires** — the refuter: "The draft's 'has the better of the country' shared the fault, so a revert does not cure it; the cure is the defensive noun inside the sentence." The refuter also invites the chair to hold that the posture header supplies the predicate. |
| 2 | 3 | PASS | the register card; R-DA-18; R-DA-04 | "Counted into what holds {settlement} is the ground." | Keep. |
| 3 `[counterforce]` | 0 | PASS | the card; R-DA-11; R-DA-04 | "contends with the ground before it contends with anybody" | Keep. |
| 3 | 1 | FAIL | the card's may-NOT a second fact (the whole balance reads readiness, not terrain); C7 (beside readiness CRITICAL at one header) | "To come at {settlement} is harder than to hold the town." | Would revert to draft v3 f1 *To come at {settlement} is harder than to hold the place.* **Rule 4 fires** — the refuter: "The draft's 'harder than to hold the place' carried the same claim, so the fault is inherited and the revert does not cure it." |
| 3 | 2 | PASS | the card; R-DA-11; A5 | "The country about {settlement} lies across the path of any force." | Keep. |
| 3 | 3 | FAIL | A6; may-NOT a second fact (an access reading); §21.2 (a regression on the named target); R-DA-11 (the pun) | "Nothing reaches {settlement} on level terms." | Rule 1 alone would revert to draft v3 f3 *Nothing comes at {settlement} on level terms.* — the refuter: "the lawful draft line stands to revert to." No rule-4 trigger on this face; it is carried into the pool refusal by rule 4's "whole pool" clause, and is the chair's cleanest one-for-one re-cut. |

**Refusal-row finding for the chair.** Two of the three failed faces (v2 f2, v3 f1) carry a fault the refuter names as inherited from the draft face at the same index, so rule 4 banks the pool; rows stay as they are (the refinement's twelve). The chair's re-cut is small and already named: v3 f3 → the draft's *Nothing comes at {settlement} on level terms.* (a clean one-for-one); v2 f2 needs the defensive noun inside the sentence (or the chair's ruling that the header supplies the predicate); v3 f1 is a claim on the whole balance that neither the draft nor the refinement can carry under this card (a contradiction beside readiness CRITICAL at the same header). Nine faces PASS and are not in question.

### 2.4 `ds-def-1--terrain-exposed` — REFUSAL ROW (rule 4, and the packet premise)

Standing rows: the OLD shipped rows, no faces (kept.md byte-identical to annex 2585-2587 and to every prior commit; the pool was never applied). Draft = `draft-round-1.md`, refused on the `[plain]` tag.

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[visitor]` | 0 | FAIL | ARCH §2.5 seam contract (T-F8) + R-DA-17 (opens on the proper slot); R-DA-02; may-NOT a cause | "{settlement} sits open. There is no ground here that helps it" | Would revert to draft v1 f0 *The ground about {settlement} lies open and level. Whatever defence stands here, the town built.* — the refuter: "carries c1 + c2 with none of these breaches." A clean target on its own. |
| 1 | 1 | FAIL | four faces; never-trim (FOLD 58); §22(b); ARCH §2.5 | (absent) | Would restore draft f1 *Level country runs up to the edge of {settlement}. Cover of any kind here is made, not found.* — lawful "apart from the same antithesis shape R-DA-02 bands" (a band, not a wall). |
| 1 | 2 | FAIL | four faces; never-trim | (absent) | Would restore draft f2 *Open ground surrounds {settlement} and gives the town nothing to work with. Its defence begins where the town does.* — "the lawful candidate at this index." |
| 1 | 3 | FAIL | four faces; never-trim | (absent) | Would restore draft f3 *Nothing in the site favours {settlement}. The town put its defence there itself.* — "the lawful candidate at this index." |
| 2 `[ledger]` | 0 | FAIL | the card's may-NOT (a cause, a future, a second fact) + MOVE-GRAMMAR §1.2 row 7; R-DST-B / C3; CLERK-LAWS C4 | "one it has paid for and must keep paying for" | Would revert to draft v2 f0 *The country around {settlement} is no part of its defence. Every advantage the town holds is one it bought, and one it is still buying.* **Rule 4 fires** — the refuter: it "cures the perfect aspect but not the cost claim itself, which stays banked." |
| 2 | 1 | FAIL | four faces; never-trim | (absent) | Draft f1 "still carries c3 … and is unlicensed on the card; restoring it would replace an absence with a banked refusal." Same ground. |
| 2 | 2 | FAIL | four faces; never-trim | (absent) | Draft f2 carries c3 ("by expense, and the expense does not stop") and opens on the fronted adverb; same ground. |
| 2 | 3 | FAIL | four faces; never-trim | (absent) | Draft f3 carries c3 ("got by paying and is held by paying still"); same ground. |
| 3 `[street]` | 0 | FAIL | the card's may-NOT (a standpoint); R-DA-14 / NL-5; MOVE-GRAMMAR §1.3 FEELING | "does not pretend otherwise" | Would revert to draft v3 f0 *No hill stands over {settlement} and no narrows close the road in. The town says as much itself, and keeps what it keeps by being where it is.* **Rule 4 fires** — the refuter: "an act rather than an interior, but still a standpoint the card refuses." |
| 3 | 1 | FAIL | four faces; never-trim | (absent) | Draft f1 ("does not talk as though it had") "remains a standpoint the card refuses"; same ground. |
| 3 | 2 | FAIL | four faces; never-trim | (absent) | Draft f2 ("makes no claim to either") "remains a standpoint the card refuses"; same ground. |
| 3 | 3 | FAIL | four faces; never-trim | (absent) | Draft f3 ("has never said otherwise") reaches into history (R-DST-B) and repeats f0's clause (A5); "not a lawful candidate for restoration." |

**Refusal-row finding for the chair.** Variants 2 and 3 have no lawful draft face at any index (c3 the cost, c4 the town's own account — the drafter's own banked R-1 and R-2), so rule 4 banks the pool; rows stay as they are (the OLD shipped rows). Variant 1's four draft faces are the refuter's own named lawful candidates and are the chair's re-cut for that variant once `[plain]` is struck. Variants 2 and 3 wait on a chair ruling: either the card licenses the cost and the self-account (a `NARROWS:` or a ruling that the terrain read carries them), or the claim-drop is accepted as a declared one-time content change — under never-trim, a writer cannot do it.

### 2.5 `ds-def-1--strategic-value-high` — REFUSAL ROW (rule 4)

Standing rows: the refinement, applied verbatim (kept.md = annex 2590-2601 = refine.md, two empty diffs per the refuter). Draft = `draft-round-3.md`. All twelve FAIL; the refuter marks each breach INHERITED (the old row and the draft face carry it) or NEW (a revert cures it).

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[ledger]` | 0 | FAIL | the card (may-NOT a cause, a second fact); the FENCE; R-DA-12 (R7); R-DA-11 | "the town's defence turns on that one fact" | INHERITED: "the old row and the draft's plain row carry both, so a revert cures nothing." **Rule 4 fires.** |
| 1 | 1 | FAIL | A6; C7; the card inherited | "the whole defence of the place is that reckoning" | INHERITED in part ("the draft face carries the same drift"); the round-1 face was faithful. Rule 4. |
| 1 | 2 | FAIL | R-DA-11 (a mind verb on an abstraction) NEW; A6; the card inherited | "the town's defence weighs nothing else" | NEW breach cured by revert to draft f2 (*there the town's whole defensive problem lies*); the card ground inherited. Subsumed by the pool refusal. |
| 1 | 3 | FAIL | A5 / four-faces (a sibling paraphrase) NEW; the card inherited | "the town's defence answers to that alone" | NEW breach cured by revert to draft f3; subsumed. |
| 2 `[street]` | 0 | FAIL | the card (a cause); FEELING inherited; A6 widening + R-DA-11 NEW | "Very little it does stands clear of that awareness" | "The draft's plain row was the old sentence, figure and all; neither wording is clean." Rule 4. |
| 2 | 1 | FAIL | REFUSED COLUMNS (totality over persons) second instance NEW; A5 NEW; FEELING + cause inherited | "the town knows it is common knowledge abroad" | The draft carried the totality once; inherited ground. Rule 4. |
| 2 | 2 | FAIL | A6 NEW; FEELING + cause inherited | "Neither of those is absent from the town's dealings" | NEW breach cured by revert to draft f2; inherited ground remains. Subsumed. |
| 2 | 3 | FAIL | FEELING + cause inherited; A5 as face 1's pair | "By that measure a great part of the town's business is settled" | No own breach; inherited ground. Rule 4. |
| 3 `[visitor]` | 0 | FAIL | the card (a count, a cause, a standpoint) inherited; A6 NEW (small) | "A stranger takes a day to see why anybody would want" | Inherited. Rule 4. |
| 3 | 1 | FAIL | A6 NEW; the card inherited | "Why the town keeps its quarrels few" | NEW breach cured by revert to draft f1; subsumed. |
| 3 | 2 | FAIL | THE THREAD (§1.4.1) NEW; the card inherited | "The town's care over whom it offends follows soon after" | NEW breach cured by revert to draft f2; subsumed. |
| 3 | 3 | FAIL | A6 NEW; the card inherited | "the care the town takes over giving offence" | NEW breach cured by revert to draft f3; subsumed. |

**Refusal-row finding for the chair.** Every face carries the card ground (one licensed fact, three claims per variant; a cause; a count; a standpoint; FEELING as variant 2's whole content) that the refuter and the drafter both place on the old row and the draft face alike — the drafter's banked R1/R2/R4/R5/R6/R7 across three rounds. Rule 4 banks the pool; rows stay as they are (the refinement's twelve). Recorded so the chair's re-cut is one motion: the refinement REGRESSED on seven faces where the draft was faithful — v1 f2, v1 f3, v2 f2, v3 f1, v3 f2, v3 f3 (each "a revert cures this") and v2 f1 (the second totality; the draft's "the town holds it known abroad as well" made neither breach) — so a chair re-cut that reverts those seven to `draft-round-3.md` and leaves the rest is the minimal lawful-at-the-draft set. The card rows the pool waits on: the standpoint contradiction (angle names `visitor`/`street`; may-NOT names a standpoint), the printed predicate (`=== Coastal` where `TERRAIN_PRIZE_OF` maps Coastal AND Mountain), and whether the pool's predicate carries the town's posture toward its own worth.

## 3. Reverts

None. Under rule 4 every pool in which rule 1 would have fired is a refusal row, and a refusal row's rows stay as they are. Faces reverted: **0**. Nothing is trimmed; no face or variant moves.

## 4. Pools with no refuter verdict delivered to this seat — UNRULED, standing as they are

| pool | standing rows | gate (arm A, round 1, at HEAD) | note |
|---|---|---|---|
| readiness STRONG | refinement, 4 × 4 | owned FAIL 0 · PASS 16 · inBand YES · rateBp 2487 | no verdict received; keep, unruled |
| readiness ADEQUATE | refinement, 4 × 4 | owned FAIL 0 · PASS 16 · inBand NO (participialOpenerRate on 1 of 16, a detector false positive on "Anything", reported in the refine commit) · rateBp 2578 | BANKED at round 2; the refine car KEPT it on the gate brief's "fell OR held" wording — that call stands recorded for the chair's veto in the refine commit body; no verdict received; keep, unruled |
| strategic value LOW | refinement, 3 × 4 | owned FAIL 0 · PASS 12 · inBand YES · rateBp 1432 | no verdict received; keep, unruled |

These are not passes. If the refuters' verdicts for the three exist elsewhere, the chair applies §0's rules to them; this seat did not see them.

## 5. The gate's final figures for the block (packet `.packets/A`, arm A round 1, 2026-09-09T17:07:19, at HEAD 8236588ed)

Projection: `node scripts/generate-dossier-state-prose.mjs --check` exit 0 — "[dossier-prose] verified 68 state blocks / 2266 variants across 6 desks, 78 causal families / 468 variants"; waivers none.

Walk: 77 units, N 77, EXHAUSTIVE, sha b2b95a259456c292…; verdicts FAIL 1 · WITHHELD 46 · PASS 30 (the one FAIL is readiness CRITICAL's spine, inherited and unchanged from the draft).

Owned verdicts, per pool:

| pool | gate verdict | units | owned FAIL | owned PASS | owned findings | walk (FAIL/WITHHELD/PASS) | inBand |
|---|---|---|---|---|---|---|---|
| readiness STRONG | WITHHELD | 16 | 0 | 16 | 0 | 0 / 15 / 1 | YES |
| readiness ADEQUATE | WITHHELD | 16 | 0 | 16 | 0 | 0 / 16 / 0 | NO |
| readiness WEAK | WITHHELD | 3 | 0 | 3 | 0 | 0 / 2 / 1 | YES |
| readiness CRITICAL | FAIL | 3 | 0 | 3 | 0 | 1 / 1 / 1 | YES |
| terrain FAVOURABLE to the defender | PASS | 12 | 0 | 12 | 0 | 0 / 0 / 12 | YES |
| terrain EXPOSED | WITHHELD | 3 | 0 | 3 | 0 | 0 / 2 / 1 | YES |
| strategic value HIGH | WITHHELD | 12 | 0 | 12 | 0 | 0 / 11 / 1 | YES |
| strategic value LOW | PASS | 12 | 0 | 12 | 0 | 0 / 0 / 12 | YES |

The gate's own round counter prints `draftRounds 0` on every pool (it slugs the packet directory with one hyphen where the writers' directories use two — `ds-def-1-readiness-strong` vs `ds-def-1--readiness-strong`); reported at the draft car, unchanged, decides nothing here. The chair's counters are the ones in §7.

The classifier's cell classes (the prose manifest diff, base `.packets/cells-draft.json`, 73,284 cells on the tip side, 525 towns), printed as the packet holds them:

```
PROSE MANIFEST DIFF · 73284 cells on the tip side
  REPLACED       cells       0 · towns     0
  RE-INDEXED     cells     170 · towns    85
  ADDITIVE       cells       0 · towns     0
  WORDING-ONLY   cells    1260 · towns   376
  UNCHANGED      cells   71854 · towns   525
  ADDED          cells       0
  REMOVED        cells       0
  (of the UNCHANGED, cells whose audience-filtered INDEX moved with no reader-visible change: 0)
```

Every moved cell is WORDING-ONLY (1,260) or RE-INDEXED (170); REPLACED 0, ADDITIVE 0, ADDED 0, REMOVED 0, index-only 0. The manifest's `stop: true` is carried from the refine commit's finding: all 170 RE-INDEXED cells are `defense.postureHeader` on readiness ADEQUATE, the one pool that gained faces at the refinement, and they read `vid: null · index: null · resolved: false` on the tip because `cellsOfTown` (`tests/helpers/dossierManifest.js:213`) resolves a one-piece unit by matching the PARENT template and a rendered face is not the parent text — the reader failing to resolve, not a draw that moved (the face draw spreads 12/13/9/6 over 40 seeds). A recorder fix, the chair's, not re-recorded here.

Duplicate-unit rate (DRIFT corpus): whole corpus 9,753 bp before and after the refinement; DS-DEF-1 alone 9,911 bp before and after (deterministic draws unmoved; wording changed under them on five pools; three pools byte-identical). The VARIETY corpus was not run at any round.

## 6. Tokens

draft 2,639,403 · refine 1,442,344 · refute 290,384 · total 4,372,131.

## 7. Round counters (the chair's)

| pool | rounds | state |
|---|---|---|
| ds-def-1--readiness-strong | 3 | in-band |
| ds-def-1--readiness-adequate | 2 | BANKED |
| ds-def-1--readiness-weak | 1 | in-band |
| ds-def-1--readiness-critical | 1 | in-band |
| ds-def-1--terrain-favourable-to-the-defender | 1 | in-band |
| ds-def-1--terrain-exposed | 1 | in-band |
| ds-def-1--strategic-value-high | 3 | in-band |
| ds-def-1--strategic-value-low | 2 | in-band |

## 8. Chair rows this judgment surfaces (not decided here)

1. The `[plain]` second tag: three pools (WEAK, CRITICAL, EXPOSED) ship one wording per variant because every draft and refinement row carried it; a packet identical but for the struck token applies cleanly (the refine commit's measured claim). Until it is struck, no revert into those pools is mechanical.
2. The four readiness pools' card prints `may claim: nothing` (the template-literal recovery gap at `defenseStateProse.js:676-680`, bound at `:752`); the refuters treated it as binding and reported the code. One ruling settles WEAK, CRITICAL, STRONG and ADEQUATE.
3. The annex's STATE-KEY for DS-DEF-1 names `defenseProfile.readiness.label` where the code reads `.score` with the 65/40/20 ladder (the WEAK drafter's F2).
4. `strategic value HIGH`: the standpoint contradiction on the card; the `=== Coastal` predicate against a two-key map; and whether the pool's predicate carries the town's posture toward its own worth. Without a ruling no wording of variant 2 is lawful.
5. `terrain EXPOSED` variants 2 and 3: the cost and the self-account are claims of the shipped rows that the card refuses; never-trim forbids the writer the drop.
6. The manifest recorder's `stop` on face-bearing pools (§5) — a fix the whole REWRITE will meet on every block.
7. The refine car's KEEP of readiness ADEQUATE on the "fell OR held" reading of the banked-pool rule against the block brief's "fallen AND none new", already recorded in that commit for veto; the new failing measure is a detector false positive (`NOT_PARTICIPLES` lacks "anything").

--- REVERTS
(none)

--- REFUSALS
ds-def-1--readiness-weak | rule 4 via variant 1 face 0 (the draft's second sentence is the refuter's failed clause verbatim, R-DA-02 unmet) + the `[plain]` premise; rows stay as the OLD shipped rows
ds-def-1--readiness-critical | rule 4 via variant 1 face 0 (the LACK measure declared carried in all four draft faces), variant 2 face 0 ("shapes", R-DA-11) and variant 3 face 0 ("stopped, challenged or counted", the FENCE) + the `[plain]` premise; rows stay as the OLD shipped rows
ds-def-1--terrain-favourable-to-the-defender | rule 4 via variant 2 face 2 and variant 3 face 1 (the refuter: "a revert does not cure it"); rows stay as the refinement's twelve; variant 3 face 3 is a clean one-for-one re-cut to the draft
ds-def-1--terrain-exposed | rule 4 via variant 2 face 0 (the cost, c3) and variant 3 face 0 (the standpoint, c4) at every draft index + the `[plain]` premise; rows stay as the OLD shipped rows; variant 1's four draft faces are the named lawful candidates
ds-def-1--strategic-value-high | rule 4 via every face (the card ground INHERITED on the old row and the draft face alike); rows stay as the refinement's twelve; seven NEW regressions (v1 f2, v1 f3, v2 f1, v2 f2, v3 f1, v3 f2, v3 f3) revert cleanly to draft-round-3 in a chair re-cut
