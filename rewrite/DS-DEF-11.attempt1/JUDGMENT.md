# JUDGMENT — REWRITE of block DS-DEF-11 (Fable judge, 2026-09-09, under SITTING §T.4 / §T.5 by the chair's delegated ruling)

Seat: Fable 5.1, the JUDGE. Dock: `laneRW-DEF11`, HEAD `5eb9b2793` (the refine commit "REWRITE 8b DS-DEF-11 refine: 2/5 kept, 3 reverted"), porcelain 0 — CONFIRMED by `git rev-parse --short HEAD` → `5eb9b2793` and `git status --porcelain | wc -l` → `0` before a line was written. Nothing committed, nothing edited in the annex, no test run, no vitest started, no build: this file RULES.

Read whole before ruling: the five pools' `kept.md`, `draft-round-1.md` and `refine.md` (plus `draft-round-2/3/4.md` for WALLED-STRAINED, and the two `refute-fable.md` / `refute.md` files on disk), the verdict array handed to this seat (five pools, every face), the refine commit body at `5eb9b2793`, the annex section `### DS-DEF-11` of `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` at HEAD, the gate packets `packets/laneRW-DEF11/measure-A-before.json` (arm A round 5, 2026-09-09T17:15:09, the draft state at 2fd4bea84) and `measure-A.json` (arm A round 5, 2026-09-09T17:17:21, HEAD), and the sibling judgment `rewrite/DS-DEF-1/JUDGMENT.md` for the machine-section grammar the APPLY gate parses.

## 0. The rules applied, per variant, on the refuters' verdicts

1. A FAIL that names a law and quotes the face → that FACE reverts to its draft face at the same index (one for one; the variant keeps its other faces).
2. A WITHHELD → keep, listed.
3. A FAIL naming no law → treated as WITHHELD.
4. A face reverted to a draft face that the refuter ALSO failed on the same ground → the WHOLE POOL is a REFUSAL row for the chair; its rows stay as they are; listed with the finding.
5. Never trim: no face or variant is removed.

Two interpretive calls, both recorded for the chair's veto:

(a) **"The same ground"** (as the DS-DEF-1 judge read it, adopted here for consistency across the block family): rule 4 fires where the refuter's OWN finding attaches to the draft face — stated outright ("a revert cures nothing", "the draft's X carried the same flaw"), or where the quoted clause and the named law stand verbatim in the draft face at that index. It does NOT fire on a ground the refuter merely could have raised. Every rule-4 trigger below cites the refuter's words.

(b) **A revert target that re-reds the projector is not a revert-to-lawful.** Three pools (WALLED-QUIET, UNWALLED-SMALL, UNWALLED-LARGE) never had a draft or refinement applied: every numbered row of both packets carries a second bracketed tag `[plain]` that `generate-dossier-state-prose.mjs` folds into `marks`, and `tests/data/dossierStateProseProjection.contract.test.js` reds `unclassified: ['plain']` (EXECUTED at b6809e8ba and again at 5eb9b2793, both commit bodies). The APPLY gate restores a listed face "verbatim, one for one" from the draft packet, so a `--- REVERTS` line into one of those pools would paste the refused grammar back and red the contract test. The DS-DEF-1 judge banked its three bracket-refused pools as refusal rows on that "packet premise"; this seat does the same, and names in §8 the one-token re-cut (strike `[plain]`; one bracket per numbered row, the angle's — the cure the STRAINED round-2 packet used) that makes every such revert mechanical and moves no prose byte.

The plain (numbered) line is face 0; the three `[face]` sub-rows are faces 1-3. The draft round each revert targets: WALLED-THREATENED `draft-round-1.md` (rounds 1); WALLED-STRAINED `draft-round-4.md` (rounds 4 — `refine.md:49-56` prints the base rows and they are byte-identical to `draft-round-4.md:33-40`); the other three pools `draft-round-1.md` (rounds 1).

## 1. What stands in the annex at HEAD, by pool (measured against `kept.md`, byte-identical)

| pool | dir | annex rows at HEAD | what the rows are | wordings per variant | round counter (chair's) |
|---|---|---|---|---|---|
| WALLED-THREATENED | `ds-def-11--walled-threatened` | 3 numbered + 9 `[face]` | the refinement, applied verbatim over draft round 1 | 4 · 4 · 4 | rounds 1, in-band |
| WALLED-QUIET | `ds-def-11--walled-quiet` | 3 numbered, no faces | the OLD shipped rows (draft and refinement both refused on the `[plain]` tag) | 1 · 1 · 1 | rounds 1, in-band |
| WALLED-STRAINED | `ds-def-11--walled-strained` | 2 numbered + 6 `[face]` | the refinement, applied verbatim over draft round 4 | 4 · 4 | rounds 4, in-band |
| UNWALLED-SMALL | `ds-def-11--unwalled-small` | 2 numbered, no faces | the OLD shipped rows (same refusal) | 1 · 1 | rounds 1, in-band |
| UNWALLED-LARGE | `ds-def-11--unwalled-large` | 2 numbered, no faces | the OLD shipped rows (same refusal) | 1 · 1 | rounds 1, in-band |

Variants in the block: 3 + 3 + 2 + 2 + 2 = **12**. Wordings standing: 12 + 3 + 8 + 2 + 2 = **27** (matches the gate's walk of 27 units, exhaustive).

Verdicts reached this seat for ALL FIVE pools. For the three bracket-refused pools the refuters graded what is actually in the annex (the shipped rows) and, as information, the never-applied draft and refine faces.

## 2. Rulings, face by face

### 2.1 `ds-def-11--walled-threatened` — RULED; three faces revert (rule 1), four WITHHELD kept, five PASS kept

Standing rows: the refinement (annex = `refine.md` = `kept.md`). Revert target: `draft-round-1.md`.

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[ledger]` | 0 | PASS | none | "against that entry the town keeps its {defwork} in repair" | KEEP (held verbatim from the draft). |
| 1 | 1 | WITHHELD | R-DA-05 / A11; Part B §21.2 (opener run on the corpus grain, unproven per face) | "The cost of the {defwork} at {settlement} is a line" | KEEP, listed (rule 2). The measured regression is recorded in §5 and §8 for the chair; the gate did not count it (inBand true). |
| 1 | 2 | PASS | R-DA-03 (the gate's arm-Q WITHHELD resolved: `economicGates.military` is the second field) | "The charge for keeping it up is one the town meets." | KEEP. |
| 1 | 3 | WITHHELD | R-DA-05 / A11; Part B §21.2 | "The town is current on the upkeep of the {defwork}" | KEEP, listed. ("current on the upkeep" noted by the refuter as vocabulary, not a ground.) |
| 2 `[street]` | 0 | **FAIL** | the exhaustivity arm (SITTING §J gap (i); SPECIFICATIONAL_COPULA's rule that an inverted copula entails the subject is the column's only value); R-DA-15 (a totality only where the column is closed) | "Dangerous country is the standing condition at {settlement}" | **REVERT** to draft-round-1 v2 f0: *Against dangerous country the {defwork} at {settlement} is kept up as working fabric.* Rule-4 check: the refuter says the draft "carried no such article; … the revert is the lawful draft" — no trigger. |
| 2 | 1 | WITHHELD | R-DA-05 / A11; Part B §21.2 | "The threat in the country holds; the {defwork}" | KEEP, listed. |
| 2 | 2 | WITHHELD | R-DA-05 / A11; Part B §21.2 | "The country around {settlement} is not quiet" | KEEP, listed ("not quiet" licensed by the sibling key under R-DA-02; "in the ordinary way" a manner phrase, not a tail). |
| 2 | 3 | PASS | R-DA-03; MOVE-GRAMMAR §1.4.1 THE THREAD | "The country is dangerous, and the town keeps the work sound." | KEEP. (Shares its first four tokens with 1-f2, inherited from the draft — §8.) |
| 3 `[visitor]` | 0 | PASS | none | "A working enclosure stands at {settlement}" | KEEP (held verbatim). |
| 3 | 1 | PASS | none | "The enclosure at {settlement} is kept sound in dangerous country." | KEEP (cures the draft's "lies about" garden path). |
| 3 | 2 | **FAIL** | C3 STATE never FATE / R-DST-B (MOVE-GRAMMAR §1.2 row 1: a standing field licenses a STRUCTURAL clause, never a HISTORICAL one); the ambiguity-after-spine ground | "The enclosure is mended." | **REVERT** to draft-round-1 v3 f2: *Beyond {settlement} the country carries danger, and the town is closed against that danger. The enclosure is kept sound.* Rule-4 check: the refuter names the draft's "The enclosure is kept sound." as "the licensed form" and the refinement as "a regression on the sharper-fact target"; the secondary "closed to it" ambiguity is a refinement wording (the draft reads "closed against that danger", not failed) — no trigger. |
| 3 | 3 | **FAIL** | R-DA-20 (every clause licensed by a typed field); A6 claim-equality inside the variant; the ambiguity ground | "Enclosed and fit for use, {settlement} stands where the country" | **REVERT** to draft-round-1 v3 f3: *Enclosed against dangerous country, {settlement} keeps the enclosure fit for use.* Rule-4 check: the refuter says the draft "attached it correctly" — no trigger. |

Pool result: 12 wordings stand; 3 revert to draft text that was gated lawful at 2fd4bea84 (inBand YES, failing 0, the draft state). Not a refusal row. Effect on the measured opener run (§5): the three reverts replace the openers "Dangerous" → "Against", "Danger" → "Beyond", "Enclosed" → "Enclosed"; the "The" run the refuter measured (1-f1 → 1-f3, 2-f1 → 2-f3) is untouched, so the corpus-grain figure is not cured by this ruling and stays the chair's row.

### 2.2 `ds-def-11--walled-quiet` — REFUSAL ROW (rule 4, and the `[plain]` premise)

Standing rows: the OLD shipped rows, no faces (`kept.md` byte-identical to the annex at HEAD and to `git show 2fd4bea84:docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, per the refuter's CONFIRMED). The draft (b6809e8ba) and the refinement (5eb9b2793) were both refused on the `[plain]` tag; so `kept.md` is the shipped text, and the chair's "3 reverted" for this pool at 5eb9b2793 restored the shipped rows, never the draft faces.

The refuter graded three sets. Rule 1 is applied to the standing rows (what the annex holds); rule 4 is tested on the refine faces against their draft targets, since those are the packets a re-cut would apply.

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[visitor]` KEPT (shipped) | 0 | FAIL | the card `may NOT: a future`; R-DA-11 (comparison as measurement); R-DA-12 (gnomic closer); R-DA-13 (`obviously`, a hedge at zero); C3 | "cheaper than ever needing it again" | Rule 1 would revert to draft-round-1 v1 f0 *At {settlement} the {defwork} meets no present need, and keeping it costs the town little.* — which the refuter FAILED (A6: the banked comparison replaced by a NEW outlay-magnitude claim, pool-level). Not the same ground as the shipped row's, but a failed target and a `[plain]`-tagged row; subsumed by the pool refusal below. |
| 2 `[elder]` KEPT (shipped) | 0 | FAIL | R-DA-12 (a life-general proposition about walls as a class); the PROVENANCE line / R-DST-B (no raising fact at this tip); the card `may NOT: another civic object of the class wall`; S2 (two joints) | "walls are easier to keep than to raise" | Would revert to draft v2 f0 *The {defwork} at {settlement} stands ahead of any present need, and nothing bought keeps it standing.* — FAILED by the refuter (the register card: the FACT restated inside one sentence; A6 pool ground). Subsumed. |
| 3 `[ledger]` KEPT (shipped) | 0 | FAIL | the card `may NOT: a cause` and R-DST-B (the `now that` edge is not an engine edge); R-DA-11 (FIGURE); R-DA-12; R-DA-03 arm Q (EXECUTED: `measure-A.json` carries `DS-DEF-11 :: WALLED-QUIET`, klass Q, WITHHELD, clause "built work stands on its own patience.") | "built work stands on its own patience" | Would revert to draft v3 f0 *The town spends little on its {defwork} and asks little of it, and the work stands whatever is entered.* — WITHHELD by the refuter (the magnitude licence, the chair's one ruling for the pool). A clean target on prose, blocked only by the `[plain]` tag; held by the pool refusal, named in §8 as the first re-cut. |
| 1 REFINE (unapplied) | 0 | FAIL | A6 (the added outlay-magnitude claim, pool-level) | "stands against no present danger, and costs the town little" | **Rule 4 fires**: draft v1 f0 FAILED on A6, the same clause class ("keeping it costs the town little"). |
| 1 REFINE | 1 | FAIL | A6; the register card (`Upkeep on the {defwork}` names an upkeep line the generator exempts) | "Upkeep on the {defwork} at {settlement} runs to little" | Draft v1 f1 FAILED on A6 ("and kept for little") — same ground; rule 4. |
| 1 REFINE | 2 | FAIL | A6 (`keeps it cheaply`) | "For all the quiet, {settlement} keeps its {defwork}, and keeps it cheaply." | Draft v1 f2 FAILED on A6 + R-DA-18 — the A6 ground shared; rule 4. The refuter: "PASS if waived". |
| 1 REFINE | 3 | FAIL | A6 (sentence two); R-DA-03 unproven on `in any case` | "and the town keeps it in any case." | Draft v1 f3 FAILED on A6 (sentence two "What {settlement} spends on the work is small." is byte-identical in both) — rule 4. |
| 2 REFINE | 0 | FAIL | the register card (the FACT restated in one sentence); R-DA-18 (`is nothing bought`); A6 | "stands ahead of any present need, and the standing is nothing bought" | Draft v2 f0 FAILED on the same restatement ground ("stands … keeps it standing") — rule 4. |
| 2 REFINE | 1 | FAIL | R-DA-11 / §1.3 FIGURE (`no money holds it in place`); the comparison `need falls short of the {defwork}`; A6 | "and no money holds it in place" | Draft v2 f1 FAILED on A6-within-variant + `may NOT: a standpoint` — different ground; the refiner's claim-set repair is "not a regression". Not itself a trigger; subsumed. |
| 2 REFINE | 2 | FAIL | R-DA-12 (generalisation); R-DA-03 / §1.3 (summarising second sentence) | "A built {defwork} needs no buying to stand." | **Rule 4 fires** on the refuter's own words: "Byte-identical second sentence to the draft face … the same breach retained." |
| 2 REFINE | 3 | FAIL | the DEPTH ceiling on `shapes.participialOpenerRate` (the measure that red this block at ad62fbe21); R-DA-11 unproven on `stands without the purse`; A6 | "Kept beyond present need, the {defwork} at {settlement} stands" | Draft v2 f3 FAILED on A6 + R-DA-11 unproven — the A6 ground shared; rule 4. |
| 3 REFINE | 0 | FAIL | the card `source: muster + road`; A13 / S3 (a treasury column no field holds); a regression on the licence against the draft | "and the work stands however the column runs" | Draft v3 f0 WITHHELD — a clean target; the refiner's own fallback. Held by the pool refusal; §8. |
| 3 REFINE | 1 | WITHHELD | the magnitude licence on `Outlay … run[s] small` | "Outlay and use run small on the town's {defwork}" | KEEP-class (rule 2), listed; not in the annex. |
| 3 REFINE | 2 | FAIL | `source: muster + road`, A13 / S3, the register card (`either entry`) | "is no part of either entry." | Draft v3 f2 FAILED on S2 (three clauses, two joints) — a different ground, and the refinement cured that one; not a trigger. Neither wording is lawful as it stands: §8. |
| 3 REFINE | 3 | WITHHELD | as the draft's face 3 (R-DA-10 and R-DA-18 unproven; the magnitude licence) | "Small cost, small use, and the {defwork} stands unbought." | KEEP-class, listed; byte-identical in draft and refinement. |

Finding for the chair (rule 4): variant 1 at every face (A6, the added outlay claim, stated by the refuter as a POOL-LEVEL ground "waivable only by the chair ruling that a banked claim's licensed neighbour counts as the same claim") and variant 2 face 2 (the byte-identical generalising close). The rows stay as they are — the OLD shipped rows, which the refuter FAILED under named laws while the gate reads them inBand YES with zero owned findings: SITTING §T.5's blind spot demonstrated on shipped prose (a future comparison, a class generalisation, a figure, an unlicensed cause). Wordings: 1 · 1 · 1.

### 2.3 `ds-def-11--walled-strained` — REFUSAL ROW (rule 4)

Standing rows: the refinement, applied verbatim over draft round 4 (annex = `refine.md:35-42` = `kept.md`). Revert target: `draft-round-4.md:33-40`.

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[ledger]` | 0 | PASS | none breached (the card's reads license the presence; predicate and may-claim the shortfall) | "the muster is short of its wage" | KEEP. |
| 1 | 1 | **FAIL** | MOVE-GRAMMAR §4.4.3 with Part B §24 and amendment S3 (the provenance move; the office citing its own book; A13); A6 | "On the muster roll at {settlement} the pay sits under its due" | Rule 1 would revert to draft-round-4 v1 f1 *On the muster roll at {settlement} the pay is under its due, and the {defwork} holds.* **Rule 4 fires** on the refuter's own words: "INHERITED from round 2 (the draft face reads 'On the muster roll at {settlement} the pay is under its due'); a revert cures nothing." The whole pool is a refusal row. |
| 1 | 2 | FAIL | the card (`< 1` only; a positive share is a count in words); SITTING §T.5's "met in part" class; A6 | "Wages at {settlement} are met short of the roll." | NEW in the refinement; the refuter: "a revert cures" — target draft-round-4 v1 f2 *The wage roll at {settlement} is not met. The town's {defwork} is in place.* Held by the pool refusal; a clean carve-out for the chair (§8). |
| 1 | 3 | FAIL | the card (the same positive-share class); SITTING §T.5; A6 | "The town's muster is paid below its roll." | NEW; "a revert cures" — target draft-round-4 v1 f3 *Wages at {settlement} run short of the roll, and the {defwork} stands.* Held; carve-out (§8). |
| 2 `[unfolding]` | 0 | FAIL | R-DA-11 (pay called a term, a category figure); the register card (an agreed term no field holds); A6 | "is a term left open on the roll" | NEW; "a revert cures" — target draft-round-4 v2 f0 *Pay for {settlement}'s muster stands open on the roll, and the {defwork} is up.* Held; carve-out (§8). |
| 2 | 1 | PASS | none breached (a comparison is a measurement in words; the roll as the standard, not cited) | "sets a wage above the muster's pay" | KEEP. |
| 2 | 2 | PASS | none breached | "is not made up to the roll" | KEEP. |
| 2 | 3 | PASS | none breached | "is not paid to its full wage" | KEEP. |

Finding for the chair (rule 4): variant 1 face 1 — the fronted `On the muster roll at {settlement}` provenance move stands in the draft-round-4 face and in the refinement alike (only "is" → "sits" moved), and the refuter fails both under §4.4.3 / §24 / S3. The rows stay as they are — the refinement's eight. Three NEW regressions with clean draft-round-4 targets (v1 f2, v1 f3, v2 f0) are frozen in the annex by this rule; §8 names them as the chair's one-line carve-out (the DS-DEF-1 judgment's HIGH precedent).

### 2.4 `ds-def-11--unwalled-small` — REFUSAL ROW (the `[plain]` premise; no rule-4 trigger on prose)

Standing rows: the OLD shipped rows, no faces (`kept.md` byte-identical to the annex at HEAD). Draft (b6809e8ba) and refinement (5eb9b2793) both refused on the `[plain]` tag; rounds 2-4 never touched this pool (only `draft-round-1.md` exists).

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[street]` KEPT (shipped) | 0 | FAIL | the LICENCE CARD `may NOT: a cause, a standpoint, a second fact`; R-DA-14 and the register card (no assigned reaction); R-DA-10 (the triad) and R-DA-12 (the evaluative close); R-DA-11 (an abstraction equated to nouns); R-DA-03 (a second fact on a semicolon tail) | "too small to wall and knows it" | Rule 1 names draft-round-1 v1 f0 *{settlement} is a small town, and it carries no wall.* as the target. The refuter gave NO verdict on that draft face (its information covers the refine faces only), so rule 4 does not fire. But the draft row reads `1. \`[street]\` \`[plain]\` …`, and a verbatim restore re-reds the projection contract (interpretive call (b)). REFUSAL on the packet premise; the target is named in §8. |
| 2 `[visitor]` KEPT (shipped) | 0 | FAIL | R-DA-11 and MOVE-GRAMMAR §1.3 (FIGURE and MEANING: two abstractions "agree to differ"); the card `may NOT: a cause` (`at this size` as the cause); R-DA-03 and R-DA-12 (the glossing, epigrammatic second clause); the register card | "the country and the town simply agree to differ" | Target draft-round-1 v2 f0 *No wall marks where {settlement} ends, and the town is small.* — ungraded by the refuter (its first clause is the shipped row's own, held lawful: "No wall marks where {settlement} ends' is lawful in itself"). Same premise: REFUSAL; target named in §8. |

Information the refuter supplied on the unapplied refine faces, recorded for the re-cut: v1 plain, face b and face c "carry W and S only and would pass on claims and walls"; v1 face a ("The record enters no wall at {settlement}…") a per-entry frame the refuter "would FAIL" (R-DA-01; FRAME non-move) — the draft's face a carries the same frame; v2 face c "would FAIL" as a sibling paraphrase of face a (A5); "the bounds of {settlement}" is the GEOGRAPHY fork, the chair's; R6's spread floor (sd 3.28 against 4.0) stays the pool's declared refusal row on the composed unit. Wordings: 1 · 1.

### 2.5 `ds-def-11--unwalled-large` — REFUSAL ROW (rule 4, and the `[plain]` premise)

Standing rows: the OLD shipped rows, no faces (`kept.md` byte-identical to the annex at HEAD). The refuter graded `refine.md`'s eight faces (never applied) and recorded the packet state as a chair row.

| variant | face | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 `[counterforce]` REFINE | 0 | PASS | licence card reads; R-DA-07 | "The town of {settlement} is unwalled." | KEEP-class; not in the annex — "the pool's cleanest counterforce line", a re-cut candidate. |
| 1 REFINE | 1 | FAIL | R-DA-11 (metonymy); the licence card (a materials claim no field holds) | "{settlement} has no stone to its name" | Target draft v1 f1 *At town size, {settlement} keeps no stone.* **Rule 4 fires**: "The draft's 'keeps no stone' carried the same flaw; a breach both rounds." |
| 1 REFINE | 2 | FAIL | the register card (the FACT restated in one sentence); R-DA-11 (weight as a figure) | "the town carries that weight inside no circuit" | Target draft v1 f2 *The weight of a town belongs to {settlement}, and the town bears that weight inside no circuit.* — the same weight figure and restatement at the same index; not stated by the refuter, so not a trigger under call (a); subsumed. |
| 1 REFINE | 3 | FAIL | R-DA-02 (the lack stated flat); R-DA-12 (generalisation by implicature: towns are walled) | "Though {settlement} holds the rank of a town" | Target draft v1 f3 *For all that {settlement} holds the rank of a town, the place is not enclosed.* **Rule 4 fires**: "The draft's 'For all that' carried the same concessive." |
| 2 `[ledger]` REFINE | 0 | FAIL | the licence card (an ambiguity opening a standpoint after the spine); R-DA-18 | "A town, {settlement} stands open." | Target draft v2 f0 *By weight a town, {settlement} stands without walls.* — ungraded. The refuter: "the weakest of the fails, entered under the default; the chair may read 'stands open' as the defence-record idiom and pass it." Subsumed; §8. |
| 2 REFINE | 1 | FAIL | R-DA-01 / §1.3 (a per-entry frame); R-DA-11; A5; §21 regression | "The entry at {settlement} is a town's weight" | Target draft v2 f1 *Among the towns, {settlement} is one without an enclosure.* — the refuter cites it as the better sibling; a clean target, held by the refusal; §8. |
| 2 REFINE | 2 | FAIL | R-DA-07 (a conditional on a standing fact); R-DA-01 with §4.4.3 (self-citation); R-DA-13 | "Where {settlement} is set down as a town, it is set down" | Target draft v2 f2 *A town on the record, {settlement} carries no wall to its name.* — ungraded. Subsumed. |
| 2 REFINE | 3 | PASS | licence card reads; V3 PRESENT → LACK; R-DA-04 | "The size at {settlement} is a town's, and the town keeps no wall." | KEEP-class; "the ear's line of the pool"; a re-cut candidate. |

Finding for the chair (rule 4): variant 1 faces 1 and 3, on the refuter's own words. The rows stay as they are — the OLD shipped rows (ungraded by the refuter this round; they carry the "usually buys stone", "confidence or thrift", "the books say what" clauses every draft struck as unlicensed). Wordings: 1 · 1.

## 3. Reverts (rule 1) — three faces, all in WALLED-THREATENED, all to `draft-round-1.md`

| pool dir | variant | face | refined text (leaves) | draft text (returns) |
|---|---|---|---|---|
| ds-def-11--walled-threatened | 2 | 0 | Dangerous country is the standing condition at {settlement}, and the {defwork} is kept up as working fabric. | Against dangerous country the {defwork} at {settlement} is kept up as working fabric. |
| ds-def-11--walled-threatened | 3 | 2 | Danger stands in the country about {settlement}, and the town is closed to it. The enclosure is mended. | Beyond {settlement} the country carries danger, and the town is closed against that danger. The enclosure is kept sound. |
| ds-def-11--walled-threatened | 3 | 3 | Enclosed and fit for use, {settlement} stands where the country is dangerous. | Enclosed against dangerous country, {settlement} keeps the enclosure fit for use. |

Each target was in the annex at 2fd4bea84, where the gate read the pool inBand YES, failing 0 (measure-A-before.json). No face or variant is removed (rule 5); the pool keeps 4 · 4 · 4.

## 4. WITHHELD kept, listed (rule 2)

WALLED-THREATENED v1 f1, v1 f3, v2 f1, v2 f2 (all R-DA-05 / A11 opener-run, measured on the corpus grain, unproven per face). In the unapplied packets (information, not annex rows): WALLED-QUIET refine v3 f1 and v3 f3, draft v3 f0, f1, f3. No FAIL naming no law was delivered, so rule 3 had nothing to act on.

## 5. The gate's final figures for the block (packet `packets/laneRW-DEF11/measure-A.json`, arm A round 5, 2026-09-09T17:17:21, at HEAD 5eb9b2793, base cells at 2fd4bea84)

Read from the packet files by this seat (EXECUTED: a node read of both JSON files); the classifier and projector lines are the refine commit body's executed record, not re-run here (no test, no build, per the fences).

**Owned verdicts (per pool, `owned.verdicts`), after = before:**

| pool | inBand | failing | owned PASS | owned FAIL | owned WITHHELD | owned findings |
|---|---|---|---|---|---|---|
| WALLED-THREATENED | YES | [] | 12 | 0 | 0 | 0 |
| WALLED-QUIET | YES | [] | 3 | 0 | 0 | 0 |
| WALLED-STRAINED | YES | [] | 8 | 0 | 0 | 0 |
| UNWALLED-SMALL | YES | [] | 2 | 0 | 0 | 0 |
| UNWALLED-LARGE | YES | [] | 2 | 0 | 0 | 0 |
| **block** | 5/5 | 0 | **27** | **0** | **0** | **0** |

**The walk:** 27 units, n 27, EXHAUSTIVE ("the whole population is walked, so every arm rate is exact"), sample sha `f19f27aaa465c0b9…`; verdicts after FAIL 0 · WITHHELD 9 · PASS 18 (before: FAIL 0 · WITHHELD 8 · PASS 19). WALLED-THREATENED's own walk: FAIL 0 · WITHHELD 3 · PASS 9, all arm Q "a second sentence naming no second field" (after: clause "The charge for keeping it up is one the town meets."; before: "That charge answers the country's danger."), which the refuter resolved to PASS on `economicGates.military`. WALLED-QUIET carries the arm-Q WITHHELD on "built work stands on its own patience." in both files (the refuter's FAIL on the shipped row). BANKED 0 sets in the gate's own count (Part B §21.2), before this judgment's four refusal rows.

**The corpus grain, WALLED-THREATENED (the refuter's measured regression, not counted by the gate — inBand stayed true):** before, sentences 15, scored 13, exceeded 8 (share 0.615), deepest `wordsPerSentence.neighbourVariation` 0.316 under, budgetOk true, depthOk true; after, exceeded 11 (share 0.846), deepest `openers.sameOpenerAsPreviousRate` 1.75 over, budgetOk FALSE, depthOk FALSE, corpus words 197 → 202. Provenance: citations 0, a13 0 on every pool.

**The classifier (the refine commit body, executed against the draft's cells, 73,284 on both sides):** REPLACED 0 · RE-INDEXED 0 · ADDITIVE 0 · WORDING-ONLY 534 · UNCHANGED 72,750 · ADDED 0 · REMOVED 0. Every cell the refinement moved is WORDING-ONLY; none is RE-INDEXED and none is REPLACED, so no fact moved — Shift 1's shape for the block. The three reverts ruled here return three faces to draft text whose cells were the classifier's base, so they cannot introduce a REPLACED or RE-INDEXED cell; the APPLY gate re-runs the projector, the gate and the classifier on the applied state.

**The projector:** `node scripts/generate-dossier-state-prose.mjs --check` exit 0 at HEAD, 68 state blocks / 2266 variants across 6 desks, zero waivers. Declared reds inherited by the dock, not this block's: the contract test's face-count pins (`face-count-per-variant pin 1` / `pin 2`, red since draft round 1) and the em-dash baseline drift in `tests/copy/voiceMechanics.test.js` (labelBands.js, generalStateProse.js).

## 6. Tokens

draft 0 · refine 0 · refute 302,543 · total 302,543 (as handed to this seat by the workflow's counters for this run; the draft and refine phases of DS-DEF-11 were run in the earlier session and their tokens are not re-counted here).

## 7. Round counters (the chair's)

| pool | rounds | state |
|---|---|---|
| ds-def-11--walled-threatened | 1 | in-band |
| ds-def-11--walled-quiet | 1 | in-band |
| ds-def-11--walled-strained | 4 | in-band |
| ds-def-11--unwalled-small | 1 | in-band |
| ds-def-11--unwalled-large | 1 | in-band |

## 8. Chair rows this judgment surfaces (not decided here)

1. **The `[plain]` second tag** — three pools (WALLED-QUIET, UNWALLED-SMALL, UNWALLED-LARGE) ship one wording per variant because every draft and refinement numbered row carried it, and the writers' brief itself dictated it ("a [plain] line and three [face] sub-rows"). The one-token re-cut (one bracket per numbered row, the angle's — the STRAINED round-2 cure) makes the packets re-gateable and moves no prose byte. Until it is struck, no revert into those pools is mechanical (interpretive call (b)).
2. **UNWALLED-SMALL, the named targets once the tag is struck:** v1 f0 → draft *{settlement} is a small town, and it carries no wall.* (ungraded; W + S only; "carries" unruled); v2 f0 → draft *No wall marks where {settlement} ends, and the town is small.* (its first clause the refuter held lawful). The refine plain lines the refuter read as passing on claims and walls are the alternative. Would-fail on any re-cut: v1 face a (R-DA-01 per-entry frame, in draft and refine alike); refine v2 face c (A5).
3. **WALLED-STRAINED carve-out (rule 4 froze three clean cures):** v1 f2 → draft-round-4 *The wage roll at {settlement} is not met. The town's {defwork} is in place.*; v1 f3 → *Wages at {settlement} run short of the roll, and the {defwork} stands.*; v2 f0 → *Pay for {settlement}'s muster stands open on the roll, and the {defwork} is up.* All three are the refuter's "a revert cures". The rule-4 face itself (v1 f1) needs a fresh wording with no fronted holder (the draft-round-1 face *The wage roll at {settlement} is not met, and the {defwork} holds.* was the pre-round-2 form and carries no provenance move). Judge's recommendation: carve out the three and bank v1 f1 alone.
4. **WALLED-QUIET, the one pool-level ruling:** whether the small-outlay claim (v1 "costs the town little", v3 "spends little") may stand where the shipped comparison was banked (A6: a banked claim's licensed neighbour), given that `economicGates.military` is a funding multiplier recorded only where a paid stack exists (`defenseGenerator.js:467`) and the gate's rule is that built walls stand unpaid. If waived: refine v1 f0 and f2 and draft v3 f0 are the refuter's lawful candidates; v2's generalising close (f2) and figure (f1) fail regardless; refine v3 f0/f2 name a treasury column `source: muster + road` does not license.
5. **WALLED-THREATENED's opener regression** — measured (corpus grain: exceeded 8 → 11 of 13; `sameOpenerAsPreviousRate` 1.75 over; budget and depth both broken) but not counted by the gate (inBand true) and measured on the pool dump rather than R-DA-05's reading sequence. Ten of fifteen sentences open on "The" after the refinement; the three reverts here do not touch the run. Also: 1-f2 and 2-f3 open on the same four tokens ("The {defwork} at {settlement}"), inherited from the draft whose "twelve openers" note was miscounted.
6. **UNWALLED-LARGE re-cut candidates:** refine v1 f0 (PASS) and refine v2 f3 (PASS); draft v2 f1 *Among the towns, {settlement} is one without an enclosure.*; refine v2 f0 "stands open" is the chair's read (defence-record idiom or exposure). The shipped rows' "usually buys stone", "confidence or thrift", "the books say what" clauses are unlicensed on every draft's reading and stand in the annex only by the tag refusal.
7. **Two wiring rows the packets raised, unanswered:** `{defwork}` is NAMED BUT NEVER FILLED at this block's call sites per the card's own bag line; and the card's `may NOT: a second fact` limb is a modifier's list printed on a three-field spine (WALLED-THREATENED's reads block carries three measured fields while `may claim` names present alone — the refuters read the reads block as the licensing set, as both authors did; if the chair reads `may claim` strictly, the pool is a sitting row).
8. **SITTING §T.5's blind spot, shown on shipped prose:** WALLED-QUIET's three shipped rows and UNWALLED-SMALL's two read inBand YES with zero owned findings while carrying a future comparison, a class generalisation, a figure, an unlicensed cause, a triad and an epigram. The gate measures the shape; the refuter finds the claim.
9. **Claim-equality vs the `, and` coordination of two facts** under S2's "a second fact takes its own sentence" — kept at 5eb9b2793 for WALLED-STRAINED and inherited by UNWALLED-LARGE v2 f3; one ruling settles the block.

--- REVERTS
ds-def-11--walled-threatened | variant 2 | face 0
ds-def-11--walled-threatened | variant 3 | face 2
ds-def-11--walled-threatened | variant 3 | face 3

--- REFUSALS
ds-def-11--walled-quiet | rule 4 via variant 1 at every face (A6, the added outlay-magnitude claim, in draft and refinement alike — the refuter's pool-level ground) and variant 2 face 2 (the byte-identical generalising close "A built {defwork} needs no buying to stand.", R-DA-12) + the `[plain]` premise; rows stay as the OLD shipped rows, which the refuter FAILED under named laws; draft v3 f0 (WITHHELD) is the clean re-cut once the tag is struck
ds-def-11--walled-strained | rule 4 via variant 1 face 1 (the refuter: "INHERITED from round 2 … a revert cures nothing" — the fronted `On the muster roll at {settlement}` provenance move, §4.4.3 / §24 / S3, in draft-round-4 and the refinement alike); rows stay as the refinement's eight; three NEW regressions (v1 f2, v1 f3, v2 f0) revert cleanly to draft-round-4 in a chair carve-out
ds-def-11--unwalled-small | the `[plain]` premise (interpretive call (b)): both shipped rows FAIL under named laws, the refuter gave no verdict on the draft faces so rule 4 does not fire, but every draft revert target carries the tag the projector refuses; rows stay as the OLD shipped rows; draft v1 f0 and v2 f0 are the named targets once the tag is struck
ds-def-11--unwalled-large | rule 4 via variant 1 face 1 ("keeps no stone" — "the same flaw; a breach both rounds", R-DA-11) and variant 1 face 3 ("For all that" — "the same concessive", R-DA-02 / R-DA-12) + the `[plain]` premise; rows stay as the OLD shipped rows; refine v1 f0 and v2 f3 (PASS) and draft v2 f1 are the re-cut candidates
