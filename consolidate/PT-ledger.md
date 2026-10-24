# PT — THE FIDELITY LEDGER OF THE CONSOLIDATION (P8, lane C-PT; SEATS 1 AND 2 OF 2, 2026-10-23, cloud session) — COMPLETE: header · THE READER'S GUIDE · the owner's words and the answer · §0..§21; every row resolved (0 PENDING); the volume replaced

> **SEAT 1 CONTINUED (2026-10-23, after the container restart of ~14:50 UTC).** A second session of the same seat found the earlier session's three files whole: `PT-new.md` ends at §8.6 complete (old line 326 word-for-word minus its brackets, then old line 328's `---`), and this ledger's 548 rows match it (424 B · 66 H · 33 S · 8 R · 7 L · 6 U · 2 A · 1 N · 1 C, ids unique; every row at old line < 330 resolved, every row beyond it PENDING). It re-confirmed `cmp` (IDENTICAL), rebuilt the text from the decision files (byte-identical to the saved `PT-new.md`), re-read every one of the 229 range brackets against the new text and word-diffed every old line 10–329 against its new line, and fixed THREE fidelity errors (§3 items 10–12; `d08.py`'s second block). Nothing else changed; the counts below stand.

> **SEAT 2 (THE CONTINUATION, 2026-10-23).** Seat 2 re-confirmed `cmp` (the volume IDENTICAL to `history/PT-bracketed-1beabdc85.md`), found the build in the scratchpad's `cpt/` (`cpt2/` is a scratch copy of it, plus seat 1's word-diff helper and the party brief), and confirmed that a rebuild through old line 329 is byte-identical to seat 1's `PT-new.md` with its three fixes in place (§0's `whereaboutsOf` and the research rulings §1/§4/§5/§7; §6 "§4's sites paragraph"; §7.2 "NO NEW deed or telling SOURCE KIND"). It read old lines 330–893 whole (every bracket in the read view) and wrote `d09.py`…`d18.py`, `mk_history.py`, `ledger_md.py` and `mk_head2.py`; `build.py 647` now writes the whole text (old §9 → §20, the new §21 THE REVIEW TRAIL), and the first 134,947 bytes of the rebuilt text are byte-identical to seat 1's file. It wrote `history/PT-cure-record.md` (Part 1 old lines 3–9 · Part 1b old line 640 · Part 2 old lines 648–893, each byte-identical), applied ledger §6's two corrections in §18 (OD-PT-2, OD-PT-30), resolved the 277 PENDING rows (§7), completed §1–§5 below, ran the ratchet over the whole volume (§5: one difference class left, DRAFT 39 → 36, explained) and copied `PT-new.md` over `docs/DESIGN_FP_ARCH_PT.md` (one `cp`). **No ⛔ STOP PT-C-n was raised** (§6).

Old text: `history/PT-bracketed-1beabdc85.md` (348,192 bytes, 893 lines), byte-identical to `docs/DESIGN_FP_ARCH_PT.md` (the P8 worktree, branch `docs/fp-consolidation-p8-2026-10-23`) at the start of this seat (`cmp`: IDENTICAL). New text: `consolidate/PT-new.md` — seat 1 wrote old lines 1–329 (up to, NOT including, `## §9 THE NET EFFECT, THE TOWN'S GATE AND THE BAN`): 340 lines, 134,947 bytes (134,698 before the continuation's three fixes). It is built by one script over the old text, the CH method: bracket spans found by balanced matching (`brackets.py` → 424 brackets in the body), removed or replaced by the decision files `d00.py`…`d08.py` (X = content folded in place · DR = dropped as superseded · MV = moved with a header line · NOTE = the fold's ledger text), then exact substitutions on the bracket-free lines, each asserted to match exactly once (`build.py`). Every passage not named below is byte-faithful to `1beabdc85` minus its brackets. The volume was NOT copied over; seat 2 does that when the whole text is complete.

## 1. THE COUNT (by script, before writing)
The ratchet's MARKERS pattern (`tools/consolidate-ratchet.py`) finds **432** in the old text = **424** bracket markers (`[CURED …]` 353 · `[REFINED …]` 68 · `[ADDED …]` 3, every one at a balanced bracket's start; 229 in old lines 1–329, 195 in old lines 330–647) + **6** `ROUTED-UNAPPLIED` outside brackets (2 in header line 6, 4 in the cure record) + **2** `↳` outside brackets (old line 284; the cure record). Beyond that minimum the ledger gives a row to every other review marker by the CH rules: **1** bracket nested inside another (N01, inside B218) · **1** cure-record bracket word (C01) · **66** round words outside brackets (H) · **33** `STOP` occurrences outside brackets (S) · **7** header/status lines (L: old lines 1, 3, 4, 5, 6, 7, 9) · **8** cure-record headers (R). No `(fp-final …)` stamp stands outside a bracket (the header's template stamps are inside B000–B012). **THE LEDGER HAS 548 ROWS (§7) = 432 + 116, one per marker.**

**Dispositions: old markers 548 · folded 438 · dropped 1 · moved 108 · kept 1 · PENDING 0** (seat 1: folded 226 · dropped 1 · moved 44 · kept 0; seat 2: folded 212 · dropped 0 · moved 64 · kept 1).

| new section (seat 1) | folded | dropped (superseded) | moved | kept | STOPs |
|---|---|---|---|---|---|
| header (old lines 1–9; history Part 1) | 3 (L01, L04, L05) | 0 | 44 | 0 | 0 |
| THE OWNER'S WORDS · THE ANSWER | 2 | 0 | 0 | 0 | 0 |
| §0 WHAT THE CODE ALREADY IS | 20 | 1 (B020) | 0 | 0 | 0 |
| §1 THE LAWS | 23 | 0 | 0 | 0 | 0 |
| §2 THE ONTOLOGY (2.1 · 2.2 · 2.3 · 2.4) | 26 · 6 · 8 · 34 | 0 | 0 | 0 | 0 |
| §3 THE DEED DOORS AND THE MARK (3.1 · 3.2 · 3.3 · 3.4) | 11 · 2 · 10 · 1 | 0 | 0 | 0 | 0 |
| §4 PRESENCE AND WHEREABOUTS | 11 | 0 | 0 | 0 | 0 |
| §5 WHAT THE WORLD THINKS OF THE PARTY | 2 | 0 | 0 | 0 | 0 |
| §6 THE DM'S HAND | 7 | 0 | 0 | 0 | 0 |
| §7 THE ENGAGEMENT PASS (7.1 · 7.2 · 7.3) | 3 · 6 · 27 | 0 | 0 | 0 | 0 |
| §8 THE CLOCKS (8.2 · 8.3 · 8.4 · 8.5 · 8.6) | 7 · 5 · 3 · 4 · 5 | 0 | 0 | 0 | 0 |
| **seat 1 total** | **226** | **1** | **44** | **0** | **0** |
| §9 THE NET EFFECT, THE TOWN'S GATE AND THE BAN (9.1 · 9.2 · 9.3) | 2 · 13 · 7 | 0 | 0 | 0 | 0 |
| §10 SANCTION — THE BACKING (10.1 · 10.2 · 10.3) | 1 · 3 · 4 | 0 | 0 | 0 | 0 |
| §11 THE STORY'S MUTATION (11.1 · 11.2 · 11.3) | 2 · 2 · 2 | 0 | 0 | 0 | 0 |
| §12 THE PARTY'S VIEW | 4 | 0 | 0 | 0 | 0 |
| §13 THE HEARINGS | 13 | 0 | 0 | 0 | 0 |
| §14 THE FLAGS AND THE HOSTS | 10 | 0 | 0 | 0 | 0 |
| §15 THE WAVES | 13 | 0 | 0 | 0 | 0 |
| §16 THE LIFECYCLE | 10 | 0 | 0 | 0 | 0 |
| §17 THE SCENARIO MATRIX | 30 | 0 | 0 | 0 | 0 |
| §18 THE RULINGS | 59 | 0 | 0 | 0 | 0 |
| §19 WHAT A DM READS · §19b THE VOICES | 4 · 11 | 0 | 0 | 0 | 0 |
| §20 THE STOPS, THE REFINEMENTS AND THE OPEN QUESTIONS | 22 | 0 | 14 (old line 640 → history Part 1b) | 1 (S13, the section's title) | 0 |
| old §21 THE CURE RECORD → history Part 2 (the new §21 THE REVIEW TRAIL, one line) | 0 | 0 | 50 | 0 | 0 |
| **seat 2 total** | **212** | **0** | **64** | **1** | **0** |
| **THE VOLUME** | **438** | **1** | **108** | **1** | **0** |

**STOPs of seat 1: none** (⛔ STOP PT-C-n: none raised in header..§8). **STOPs of seat 2: none** (none raised in §9..§21; see §6). No passage in the range was left open by two brackets: every later bracket names what it replaces, and the one superseded bracket is B020 → B021 (the season-and-sea rule re-grounded on the landed law alone, its contested chair-notes basis withdrawn). B027's five-kind count is superseded inside the same fold by B028 (six kinds, the latest); B078's last sentence is closed by B079; B103's last sentence by B104. OPEN QUESTIONS (not conflicts; the design text states the current rule and §20 lists the question — seat 2 keeps them under §20): whether `party_made_known_site` should also be ONE act through PT's door (§4 item (2), old §20 item (5)); whether the host's known-places list admits a way's address (§3.1, PLAUSIBLE; old §20 item (7)); a deed-only upward size bias and an AMEND `{ lie: true }` (old §20 item (6)); a party bounty's treasury row (§7.3; old §20 item (9)); CH's and BD's domain drift for a gang's bounty — PT reads the call's own domain either way (§7.2; old §20 item (8), CH's and BD's to align, not PT's).

## 2. THE SECTION MAP (old → new)
- Old lines 1–9 → the new 4-line header (title verbatim; line 4's three flags and line 5's requirements restated) + THE READER'S GUIDE (new, 8 items) + the dispatch-gate sentence (old line 9's last sentence, verbatim); old line 9's "PT builds on THE RENOWN … THE CHAMPIONS … THE POLITY" sentence restated as the guide's item 7 (DEPENDS ON). Old lines 3, 6, 7, 9 → **history Part 1** (`history/PT-cure-record.md`, which SEAT 2 writes: Part 1 = old lines 3–9 verbatim, Part 2 = old §21 verbatim).
- The owner's words (old lines 11–20) and the answer (old line 22) keep their place and words; old line 17's gloss "(the chair reads …)" → "("at all of" is read as "at odds with")"; the answer's two brackets removed and the employer arm of the backing default applied (§3 item 2).
- §0–§8 keep their numbers and titles; every "§x" of seat 1's text resolves unchanged. Inside them: §0's journey row takes B021's landed law; §0's posture row takes the six-kind actor convention; the binding prior words restate the ruling-file list by content and fold the owner's doctrines (B032); §2.1's old line 131 (the proof-words bracket paragraph) removed, its content in §2.4's `proof` row; §3.1's menace paragraph written from B132 + B133; §7.2's two P6c brackets (old lines 277–278) one paragraph; the ↳ `party_request` row (old line 284) folded into its parent row; §8.2, §8.3 and §8.4 take their heading brackets (B206, B213, B218) as lead sentences.
- DONE BY SEAT 2 (the CH shape; vetoable) as planned: old §9 … §19b keep their numbers and titles; old §20 THE STOPS, THE REFINEMENTS AND THE OPEN QUESTIONS keeps the number §20 (seat 1's text points to "§20" for the open questions and the refinements — §0's binding words, §3.1, §4) and becomes the ruled STOPs as rulings, the REFINEMENTS list without round labels, the OPEN QUESTIONS, and THE OPEN STOPS line (none); old §21 THE CURE RECORD → history Part 2, the new §21 THE REVIEW TRAIL (one line). §18 is cited by seat 1's header and §0 as THE RULINGS.
- **Seat 2's map (old → new).** §9 · §10 · §11 · §12 · §13 · §14 · §15 · §16 · §17 · §19 · §19b keep their numbers, titles and order; every row of their tables stands (scenario rows 63 = 63 · waves 9 = 9 · hearing rows 9 = 9 · flags 3 = 3 · lifecycle rows 13 = 13 · laws 18 = 18); old line 538 (the scenario-to-finding index) and old lines 602, 606, 608 (stamps and a change note standing alone) removed. §18 THE RULINGS keeps its number and its 36 rows, rewritten in final form with a fourth column, Ruled (first ruled · amended dates · by delegation · vetoable; the dates read from the ledger-branch snapshots `b33d9174d` (OD-PT-1..17), `a399c5956` (..26), `8a3061070` (..33) and `1beabdc85` (..36) and the brackets' own dates), ⭐ on the seven rows whose question is the OWNER's own words. §20 keeps its number and title: the two ruled slots (PT-S1 C7 · PT-S2 C1), THE OPEN STOPS (none), THE REFINEMENTS (by content) and THE OPEN QUESTIONS (the same ten items, in order). Old §21 THE CURE RECORD → history Part 2; the new §21 THE REVIEW TRAIL is one line. Every "§x" of the new text resolves to a section that exists in it (checked by script: the one bare "§5.1" is RN's, "RN §3.3, §5.1").

## 3. TEXT CORRECTIONS THAT ARE NOT MARKERS (each the latest ruling applied, or wording only — vetoable)
1. **§0 posture row (old line 47):** "joins by the chair's fold row (`settlement · person · party · menace`, RULINGS §4)" → the fold's SP-4a row and THE ACTOR CONVENTION IS SIX KINDS (B028, the latest), with B026's corps key and site rule and B027's reasons.
2. **P5 C.7's employer arm applied where its brackets never reached** (the latest ruling wins everywhere): the answer paragraph (old line 22, "pre-filled only when the party is doing the work of a request it accepted" + "or acting inside the reach of a court that employs it") and SHAPE 2's `backing` default cell (old line 123, "PT2's accepted-request arm" → "PT2's two authorization arms — an accepted request's, else a standing employment's (§3.2)"). PT2, §2.3, §3.2 and §8.5 already carried it. **For seat 2:** §18 OD-PT-2 still reads "the backing default keeps ONLY the accepted-request arm" — the same correction applies there (OD-PT-34 rules the employer arm).
3. **§8.4's fault fold** (B218) names the DEADLINE's place ("the actor's own town for a deadline") beside the stressor's, the siege's, the war's and the hunt's — §2.3's DEADLINE arm (B094, P5 C.6: "§8.4/§8.6 unchanged in form") is the latest, so the list of places is complete.
4. **The `banKeys` row (old line 116):** B071's condition ("the field set is one only once CH takes the window") is met by CH's own text of record at `1beabdc85` (`paragon.banKeys?: [≤8 { settlementId, episode, untilTick }]` — CONFIRMED by grep of `history/CH-bracketed-1beabdc85.md`), so the Meaning cell states "CH keeps the same key, with the same window".
5. **A ⭐ placed on the persisted sub-field `bounty?: { band }` in §2.2** — OD-PT-4 (§18) rules it "⭐ A DECLARED SUB-FIELD, THE OWNER'S SHAPE, VISIBLE"; §2.2 now marks it where it is declared (CONSOLIDATE §2 item 5: "the persisted shapes with their owner-marks ⭐"). The header's "marked ⭐" is the second ⭐ (the CH header's sentence).
6. **Ruling tags and ruling-file citations removed from the running text** (CH §3 item 7): "RULINGS §4 / §5", "RULINGS-AFTER-RESEARCH §4", "RULINGS-AFTER-COMPILE (RN-S1)", "RULINGS-ROUND1 PT-r1-2 / PT-r1-3 / ADDENDUM", "RULINGS-ROUND2 A.1 / A.2 / A.4 / B", "RULINGS-ROUND2b (SEAMS-r2-6; OD-PT-28 'ACCEPTED by the chair')", "RULINGS-ROUND3 A.8 / A.11 / A.14 / B", "RULINGS-ROUND4 A.15 / A.16", "RULINGS-ROUND5 B.5 / B.15", "`briefs/RULINGS-P5.md` C.12 / C.21", "CHAIR-NOTES 18 (d) / 20 (b)/(d)", "the chair notes item 3" (→ "ZERO-CLICK MARKS"), "R-RN-9", "R-P5-5", "R4-1", "(r5, PT-X1)", "(P5, P5C-7)", "(P5, P5C-22)", "round 1 / BD's round 5", "ROUTED to RN / as a HOST-ask", "(re-grepped 2026-10-20)", "HOST-r1-2 / HOST-r2-19". Where a ruling's words carry design they stay as quotations without the tag ("the deed is the newer fact"; "no third deed"; "The call's own domain governs: …"; "undo strikes the deed; the world effects stay, as on master"; "the deed target shape gains `siteId` …"; "a kept-secret site's arrival emits NO news row"). Kept: research cites (R2 Q1/Q2/Q5/Q7/Q9, R3 refinement 11, R3 §1e), compile-brief items (L-BD 32b/33/36), MN's and CH's own ids (MN M43, OD-MN-36, OD-CH-34), the executed probe receipts in running text under `cure/` (§0, §2.4), PT-S1 / PT-S2 as the names of the two ruled slots (C7, C1), and PLAUSIBLE.
7. **"the chair" removed** (old lines 17, 47, 54 ×3, 64, 68, 70, 185, 265, 318); §0's binding words restate the rulings by content and end "where this volume departs from one of them, the departure is a vetoable ruling (§18) or refinement (§20)" in place of "it says so with a STOP or a REFINED bracket"; "The chair's host ruling of 2026-10-18" → "The host ruling"; §8.4's "**PT-S1 — RULED (RULINGS-AFTER-COMPILE: slot C7):**" → "**A ROAD CLOSED (PT-S1, slot C7):**"; §4's "(HOST-REQUIREMENTS-2026-10-18)" → "(the host requirements)" (the document's path stays in §0).
8. **Struck language restated as the design's own statement:** "round 1's `voidsRef` is struck, A.4" → "PT mints no `voidsRef` (the void links by RN's `correctsRef`)"; "there is no `DIRECT_MENACE`" → "PT has no `DIRECT_MENACE`"; B195's "the ordinary graduated person's visit is STRUCK" → "never an ordinary person, who never travels on its own (RN §5.4)".
9. **Dates removed from the running text** outside the owner's words and the header (§0's binding words, §2.4's register row). The host document's file name keeps its date (a path).
10. **FIDELITY FIX (the continuation) — §0's binding prior words, the ruling list restated by content.** The earlier text read "as amended after the research (the one ban widened to actor refs; the words of §2.4) and after the compile (…), the institution deeds keyed on the target, one act one deed, …": it had DROPPED `RULINGS-ROUND1.md` PT-r1-1 (the one whereabouts read — "ONE whereabouts read, `whereaboutsOf(party)` = whichever of `presentAt` … and `lastHeard` … was set MORE RECENTLY", RE-RULED) from the list of PT-r1-1 · PT-r1-2 · PT-r1-3, and it compressed `briefs/RULINGS-AFTER-RESEARCH.md` §1/§4/§5/§7 to two of their PT rulings. Now: "as amended after the research (the one person substrate, the world-NPC ledger; the carriers — the one ban widened to actor refs, the actor-ref convention; the deed record, the story's fixed order of loss, the party's credibility holder and the words of §2.4; what each tier line says) and after the compile (…), the one whereabouts read `whereaboutsOf`, the institution deeds keyed on the target, one act one deed, …" — each phrase the content of a cited section (§1 ONE PERSON SUBSTRATE · §4 THE CARRIERS: bans, actor kinds · §5 DEEDS, RUMOR AND REGARD: the deed record, mutation's fixed order, the party's credibility, the tokens · §7 WHAT EVERY VOLUME SAYS IN ITS TIER LINES); no ruling's substance is restated beyond its name. No token added (`whereaboutsOf` is the volume's own).
11. **FIDELITY FIX (the continuation) — §6's cross-reference.** `RECORD_CLEARING`'s parenthesis still read "§4's sites bracket" (old line 263; d02 and d04 had already made the same phrase "paragraph" at old lines 195 and 249) → "§4's sites paragraph". **For seat 2:** §18 OD-PT-30 reads "§4's sites bracket:" — the same correction applies there.
12. **FIDELITY FIX (the continuation) — §7.2's capture sentence.** B179's "NO NEW deed or telling SOURCE KIND is minted for a capture" had been folded as "NO deed or telling SOURCE KIND is minted for a capture", which can be read as "no telling is minted" — while the same sentence says a capture DOES travel as a telling through RN's existing idiom. "NEW" restored (row B179).

**SEAT 2's corrections (§9..§21; each the latest ruling applied, a label removed, or wording only — vetoable; every one is in `d09.py`…`d16.py` and the word diff `wdiff.py 330 632` shows nothing else):**
13. **OD-PT-2 (§18), seat 1's §3 item 2 applied:** "the backing default keeps ONLY the accepted-request arm" → "the backing default is pre-filled only under PT2's two authorization arms — an accepted request's, else a standing employment's (§3.2; OD-PT-34) — and a friendly town's regard pre-selects nothing (P14)"; Ruled "amended 2026-10-18 and 2026-10-20 (the employer arm, OD-PT-34)". The latest ruling is P5 C.7 (OD-PT-34; PT2, §3.2, §8.5 and P14/P58 already carried it).
14. **OD-PT-30 (§18), seat 1's §3 item 11 applied:** "§4's sites bracket:" → "§4's sites paragraph:"; the same phrase made "paragraph" at §13 (old line 393) and §19b (old line 629).
15. **Brackets whose content was not yet in the running text, FOLDED as clauses (no new decision; each the bracket's own words):** B240 (the road arm's ruling: `party_gate` widened to a road WHERE, no new kind, CH's words unchanged, PR §8.2's trigger, CH's person arm `person_at_the_gate`) as §9.2's ROAD ARM lead clause; B246 (CH adopts PT's three clauses for its own keys — CONFIRMED in `history/CH-bracketed-1beabdc85.md` CH §11: "so the person's and the party's `banKeys` keep ONE ban and ONE lift rule") and B247 (`banKeys` holds seat-episode keys, never `polity_ban:<subjectKey>:<banTick>`; two facts) as two sentences of §9.3; B272 (THE PATROLS' laws and rulings, `DESIGN_FP_ARCH_PR.md`, OD-PR-14/16) as §13's "Patrols considered" parenthesis — the only place `OD-PR-14` and the PR path stood; B297 (no PT kind has a menace actor; the party's hand on a menace is a deed) as a clause of §15's EDITOR line; B403 (`deed_acceptance` is `deed_refusal`'s mirror) in §19b's row; B284 (the brief's `partySanctionEnabled` would put the economic `sanctioned` word into code) into OD-PT-14 — the only place that flag name stood, so the flags count holds (17 = 17).
16. **Ruling tags, finding ids, refinement ids and phase labels removed from the running text** (seat 1's item 6 rule): "CHAIR-NOTES 18 (d)'s one corpus law" → "the one corpus law"; "chair notes item 1 / 2 / 6 / 11" dropped; "RULINGS-ROUND1 ADDENDUM", "RULINGS-ROUND2 A.1 / A.2 / A.4 / B / §E", "RULINGS-ROUND2b (HOST-r2-5 · OD-PT-28 ACCEPTED · SEAMS-r2-6 · STOP-PR-2)", "RULINGS-ROUND3 B / A.11", "RULINGS-ROUND4 A.8 / A.12", "`briefs/RULINGS-P5.md` C.6 / C.7 / C.8 / C.22", "A.3 / A.4 / A.8 / A.11 / A.12 / A.16 / A.19 / B.5 / B.15", "RU-1", "R-PT-1/2/3/5/7/8/12", "R4-1", "R-P5-5", "(P5)", "— r5, PT-X1", "at P4", "PL's STOP-2 precedent" → "PL's precedent". Where a tag carried design it is restated: "(A.12's sixth kind)" → "(the actor convention's sixth kind)"; "(A.16's veil)" → "(the kept secret's veil)"; "the chair's host ruling 3" → "the host ruling's third item"; "(R-PT-7, R-PT-8, `party_voiced`)" → "(the CLIMAX kinds, three counterforce kinds, `party_voiced`)"; RN-V2's ruling quote kept as RN's heard pass's words.
17. **"the chair" removed** (old lines 393, 406, 421, 429, 554, 556, 567, 573, 579, 640, 642, 644; the chair-notes cites at old lines 336, 340, 409, 429, 445, 629 and 642 are item 16's; the new text has 0 "chair"): "the chair's host ruling" → "the host ruling"; "the fold §6's C11/C13 rows are the chair's" → "the C11/C13 rows are the fold's (§6)"; "amend it (the chair's ruling, SEAMS-r1-6)" → "amend it"; "OPEN FOR THE CHAIR" → "THE OPEN QUESTIONS"; "a chair who wants every coup to repudiate rules it on PL's read" → "a ruling that every coup repudiates is made on PL's read"; "if the chair rules otherwise" → "if it is ruled otherwise".
18. **Round labels restated by what the withdrawn thing did:** §10.2 "RN §6.1 struck `remove_npc`'s "0.6 inside a backing's reach" in round 1" → "RN §6.1's `remove_npc` row included: it carries no "0.6 inside a backing's reach""; P36 "never round 1's +0.23 approval" → "never the +0.23 approval of a mark that also moved `law01` and `force01`" (B262's own account); P50 "the round-3 inverse re-run leaves `[]`" → "an inverse that only lifts the edges it wrote, re-run, leaves `[]`" (§16's undo row); P57 "before the cure every case read `came_to_nothing`" → "without the DEADLINE arm every case read `came_to_nothing`"; §14 "round 1 `cure/D-PT-r1-probe/effLines-r1.out`" → "and `cure/D-PT-r1-probe/effLines-r1.out`"; "`deed_acceptance` added (in P5)" → "`deed_acceptance` among them" (§14, OD-PT-23).
19. **§18 in final form** (CONSOLIDATE §2 item 8): a Ruled column; OD-PT-28's question loses "(opened by D-PT-r2 … THE CHAIR'S DECISION POINT)" and its ruling reads as the ruling itself ("undo strikes the deed; the world effects stay, as on master", the quoted words of the acceptance kept); OD-PT-34's owner words ("I give all permissions now and in the future"; "i defer everything to your judgemetn") move verbatim to its Ruled cell; OD-PT-4's "for ODQ §934.93's P5 addendum" → "the VISIBLE row of ODQ §934.93's P5 addendum"; OD-PT-33 keeps `cure/L-BD.md` §4 (the compile brief, as seat 1 kept L-BD items); OD-PT-35 points to §20's open question (9) for its refinement's alternative. **⭐ added to the seven rows the old text marks "THE OWNER'S"** (OD-PT-1, 2, 3, 7, 8, 9, 11) — a presentational mark under CONSOLIDATE §2 item 8 ("the owner's rows ⭐ marked and VISIBLE"); the header says what ⭐ means here ("a row whose question is the OWNER's own words"), so no row's ruling is claimed as the owner's. With seat 1's two (header, §2.2) and OD-PT-4's own, the volume carries 12 ⭐ against the old 1.
20. **§20 restated** (the shape of CH's and OP's §THE RULINGS tails): the slot table's "RULED (RULINGS-AFTER-COMPILE)" → "RULED (slot C7)" / "RULED (slot C1)"; old line 640 (each round's "raised NO new STOP" with its cure-file pointers) MOVED verbatim to history Part 1b and stated as "THE OPEN STOPS: none …" (the party on a watched road ruled as `party_gate`'s road arm, OD-PT-32; the undo decision point ruled as OD-PT-28); old line 642's REFINED list by round → THE REFINEMENTS by content (all 14 + 5 + 3 + 5 + 1 + 6 + 2 + 9 items, the ids and rounds left to the cure record; the round-1 backing refinement stated with its latest form — OD-PT-34's employer arm — and "against chair notes item 3" as "a departure from the ZERO-CLICK MARKS note", seat 1's name for that note); old line 644 → THE OPEN QUESTIONS, the same ten items in order: (1) RN's halves stated as RN's (no ruling tags), (2) "CHAIR-NOTES item 16" → "the fold's corps note", (4) the struck item stated as "closed: …", (7)/(8) "[r5]" and "the HOST-ask" → "a question to the host", (8)'s "(B.15)" and "listed for the consolidation" dropped (the drift is CH's and BD's; see §6), (9)/(10) "[P5]" and the refinement ids dropped.
21. **The new §21 THE REVIEW TRAIL** (one line, CH's form): "Reviewed in rounds r1–r5 (r2b among them), P5 and P6 with its brackets pass (the kit's `skeptic/` and `cure/`), then by the seams seats and the fold; the bracketed text of record is `1beabdc85`; the cure record … is `history/PT-cure-record.md`." The volume's header (seat 1's) names the same file by its kit path.

## 4. ALLOW-MISSING (`consolidate/PT-allow.txt` carries the same list, one token per line, with comment lines: seat 1's 85 entries, then seat 2's 74 — 159 in all)
- THE HEADER'S BRACKET TEMPLATE AND REVIEW-TRAIL PATHS, MOVED with old lines 6, 7, 9 to history Part 1 (31 + 8 directory tokens): the thirteen `[CURED …— <id>: …]` / `[REFINED … — …]` templates; `*-r2-verify.md`; `assessments/P5-COMPLETENESS-2026-10-20.md`; `briefs/RULINGS-ROUND2b.md` · `ROUND3` · `ROUND4` · `ROUND5`; `cure/D-*-r4.md`; the probe directories `cure/D-PT-{r1,r2,r2b,r3,r4,r5,p5}-probe/` (each full receipt path that stands in running text is kept); the kit paths `…/cure/BRACKETS-A2-program-volumes.md` and `…/cure/L-PT.md` (the header keeps `cure/L-PT.md`); `atOpenWar` (line 9; it survives only inside seat 2's brackets); the nine `skeptic/…` reports.
- RULING-FILE PATHS removed from §0's binding prior words (the rulings restated by content): `briefs/L-PT.md`, `briefs/RULINGS-AFTER-RESEARCH.md`, `RULINGS-AFTER-COMPILE.md`, `RULINGS-ROUND1.md`.
- REVIEW-TRAIL PATHS AND PROBE RECEIPTS that lived only inside removed change notes: `cure/D-CH-r2b.md`, `cure/D-CH-r3.md`, `cure/D-OP-r1.md`, `cure/D-OP-r2.md`, `D-OP-r3.md`, `cure/D-PR-r2.md`, `cure/D-ST-r2.md`, `D-CH-r5`, `skeptic/BRACKETS-p6c-verify.md`, `census-r2-quoted.out`, `census-r4.out`, `cure/D-PT-r4-probe/census-r4.out`, `cure/D-PT-r4-probe/gateReadAndUndo.rerun.out`, `rg M-SITE`, `docs/`.
- SUPERSEDED NAMES AND SHAPES (a later ruling replaced each; the successor stands; none minted): `a␟b` (→ `stretch:<a|b>`); `kept · broken`, `kept · broken · void` (→ `made_good · fell_short · came_to_nothing`); `partyWhereabouts` (→ `whereaboutsOf`); `polity: true` (→ `backerRole`); `proof: kept · told · shown` (→ `unspoken · spoken · shown`); `reachableAtSomeWeek` (→ `earliestArrivalTick`); `seatChangedSince(…, banTick)` (→ the seat episode key in `banKeys`); `{ kind: 'body', bodyKind: 'gang' | 'beast', id }` (→ `{ kind: 'body', id }`, its `bodyKind` a field); `to: party` (BD's route wording → the `party` dial); the four- and five-kind actor conventions `settlement · person · party · menace` and `settlement · person · party · menace · corps` (→ the six kinds, B028).
- DETAIL OF A REMOVED CHANGE NOTE (a quoted landed line, a ruling's quote of a field the text declares, a sibling's homonym field, a short or long form of a cite the text keeps): `const tick = worldState.tick;`, `Engagement.bounty?: { band }`, `bounty: { band, sinceTick }`, `purseBand`, `treatySuccession.js`, `src/components/map/TravelersLayer.jsx` (the text cites `components/map/TravelersLayer.jsx`), `npcCredibility.js` (the text cites `worldPulse/npcCredibility.js`), `offer?` (the code block carries `offer?,`), `outlawed`, `season` (the text carries `pathCost(digest, fromId, toId, season)`), `target`.
- TOKEN-REGEX ARTEFACTS: `"; RULINGS-ROUND3 A.14), `, `'s mirror, so the new deed never reads …`, `, `, and `cure/D-PT-r2b-probe/census-r2b-2.out` (present in §2.4's register row; the regex pairs that line's backticks off — the same in the old text).
- SEAT 1's "STILL MISSING … STANDING IN SEAT 2's RUNNING TEXT" list is RESOLVED: 16 of its 23 tokens stand in the new text (`[]`, `anchorId`, `at_war_with_employer`, `beliefReadAndRestore.out`, `contradicts`, `creed`, `cure/D-PT-p5-probe/p5Probe.out`, `cure/D-PT-r3-probe/windowedLapse.out`, `cure/D-PT-r4-probe/beliefReadAndRestore.out`, `cure/D-PT-r5-probe/huntFault.out`, `cure/L-BD.md`, `enemy_in_service`, `hopWeeks`, `made_good · fell_short · came_to_nothing`, `p5Probe.out`, `via`); the other 7 are review-trail paths allow-listed by seat 2 below (`briefs/RULINGS-P5.md`, `cure/D-PT-p5.md`, `cure/D-PT-r2.md`, `cure/D-PT-r2b.md`, `cure/D-PT-r3.md`, `cure/D-PT-r4.md`, `cure/D-PT-r5.md`).
- **SEAT 2's 74 entries** (the whole-volume ratchet's MISSING list, each classified by script — `miss2.py` — by where the token lived in the old text):
  - **50 that lived ONLY in old §21 THE CURE RECORD**, MOVED verbatim with it to `history/PT-cure-record.md` Part 2 (byte-for-byte there): `D-BD-r4`, `D-CH-r4`, `D-RN-r4`, `INSTITUTION_MORAL_LEAN`, `MORAL_INSTITUTION_LEANS`, `PT-r1v-c1`, `PT-r1v-c9`, `PT-r2v-c1`, `PT-r2v-c6`, `PT-r2v-p`, `R2-E-*`, `advancePartyEngagements`, `assessments/WIRING-CENSUS-2026-10-20.md`, `believedWhereabouts`, `callSource`, `census-p5.out`, `classifyLegModes`, `cure/D-*-r3.md`, `cure/D-MN-r2.md`, `cure/D-PR-r3.md`, `cure/D-RN-r4.md`, `cure/L-CH-PD.md`, `drainCampaignQueueIntoState`, `fundingSet`, `homeDefense`, `huntFault.out`, `liegeAnswer`, `menace_met`, `paragonLean`, `party_stopped`, the quoted read `readBeliefRelationship(court, served, ws, relationshipTypeBetween(graph, …)) === 'hostile'`, `readiness01`, `realmVerbExecution.js`, `reliefAnswerOf`, `seenBy`, `sent`, the seven kit log paths `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-PT-{r1,r2,r2b,r3,r4,r5,p5}.md`, `siteDefense`, `skeptic/*-r2-verify.md`, `skeptic/SEAMS-r3.md`, `stretch:`, `unopposed`, `wantSince`, `warKey`. (Each is a review-trail id, a log path, or a name the cure record quotes; where the design uses the thing it stands in a longer token the text keeps — e.g. `roads/seaRoads.js :: classifyLegModes(digest, path)`, `worldPulse/realmVerbExecution.js`, the `need` of §2.2, typed per call source.)
  - **9 review-trail paths of the running text** replaced by the cure record: `cure/D-PT-r2.md`, `cure/D-PT-r2b.md`, `cure/D-PT-r3.md`, `cure/D-PT-r4.md`, `cure/D-PT-r5.md`, `cure/D-PT-p5.md` (old line 640, MOVED verbatim to history Part 1b; the first two also old §20's open-questions pointer, now "detail in the cure record"), `cure/D-RN-r2b.md`, `cure/D-ST-r3.md` (old line 644's pointers), and `briefs/RULINGS-P5.md` (§18's ruling-file tag; the Ruled column carries the date).
  - **2 bracket templates** quoted in old §20's REFINED list: `[REFINED 2026-10-18 (fp-final r2) — R2b-…]`, `[REFINED 2026-10-20 (fp-final P5) — R-P5-…]` (the list restated by content; the other five templates were seat 1's entries).
  - **7 review-trail paths and probe-output detail inside removed change notes of §9..§19b:** `cure/D-PL-r2b.md`, `cure/D-PL-r3.md`, `stillBannedAtKell: false`, `stillBannedAtKell: true` (B245's probe output; its receipt `cure/D-PT-r3-probe/windowedLapse.out` stands in P46), `war_front` (B237's probe case; the text says "a live war front"), `pair_state` (B253's account of RN R51's refusal; the text says RN refuses the pair), `regionalGraph.js` (B254's reason for `cold_war`; the text keeps `roads/embassyHazard.js :: HOSTILE_RUNGS`).
  - **4 SUPERSEDED FORMS:** `kind01 + (marked01 − kind01) × belief` and `weight × proofFactor` (the withdrawn lean formula and belief factor, B262 → the mark REPLACES `kind01`, §11.3, OD-PT-20); `road(a, b)` and `road{a,b}` (PT's old road notation and MN's quote of the fold's, B269 → `road{a, b}`, PR's ONE STRETCH KEY).
  - **2 SHORT FORMS** of a token the text keeps whole: `lensOneProbe.out` (→ `cure/D-PT-r2-probe/lensOneProbe.out`, §11.3), `passed · reaches_party` (→ `passed · reaches_party · struck`, §13, OD-PT-10/33).

## 5. THE RATCHET (the WHOLE volume: `history/PT-bracketed-1beabdc85.md` against `consolidate/PT-new.md`, seat 2)
`python3 tools/consolidate-ratchet.py history/PT-bracketed-1beabdc85.md consolidate/PT-new.md --allow-missing-file consolidate/PT-allow.txt` (exit 1: one difference class, explained):
```
tokens: old 1118 · new 967 · missing 0 · new-in-new 8
  NEW tokens in the new text (each must be a registered name, never a mint):
   + "), 
   + 1beabdc85
   + bodyKind
   + cure/
   + history/PT-cure-record.md
   + settlement-engine-kits/fp-final-a73343ed-2026-10-17/history/PT-cure-record.md
   + skeptic/
   + store/settlementLifecycleHelpers.js :: reconcileWorldOnUndo
cites (path :: symbol): old 54 · new 54 · missing 0
laws (XX1–XXn bold): old 18 · new 18
OD rulings: old 44 · new 44
owner rows ⭐: old 1 · new 12
DRAFT marks: old 39 · new 36  ← FEWER (explain in the ledger)
UNMEASURED marks: old 3 · new 3
wave ids (XX-n): old 2 · new 2
flags (…Enabled): old 17 · new 17
review markers left in the new text: 0
RATCHET 1 DIFFERENCE CLASSES
```
**Every remaining difference is explained.** **DRAFT 39 → 36:** the three are status or review words that MOVED to history, never a design mark — old line 9's "COMPILED DRAFT" (seat 1, history Part 1) and the two `DRAFT` words inside old §21 THE CURE RECORD (history Part 2); every DRAFT of the design text survives (old lines 1–329 carry 22, one of them old line 9's status word, and old lines 330–647 carry 15; the new text carries 21 + 15 = 36). **tokens: missing 0** with the 159-entry allow list (§4). **cites 54 = 54** (every `path :: symbol` cite survives). **laws 18 = 18 · OD rulings 44 = 44** (the 36 OD-PT rows and every cross-volume OD id — `OD-PR-14` kept by B272's fold, `OD-CH-34` by seat 1's range) **· UNMEASURED 3 = 3 · waves 2 = 2 · flags 17 = 17** (`partySanctionEnabled` kept by B284's fold into OD-PT-14) **· review markers left 0.** **⭐ 1 → 12** (§3 items 5 and 19). NEW tokens: `1beabdc85`, the two forms of the history path, `cure/` and `skeptic/` (THE REVIEW TRAIL line, CH's form), `bodyKind` (BD's field, seat 1), the short cite `store/settlementLifecycleHelpers.js :: reconcileWorldOnUndo` (THE READER'S GUIDE) and one regex artefact — no mint.
**Counts the ratchet does not take, by script** (`grep` over both texts): scenario rows 63 = 63 · wave rows 9 = 9 · hearing rows in §13 9 = 9 · flag rows in §14 3 = 3 · lifecycle rows in §16 13 = 13 · OD-PT rows 36 = 36 · laws 18 = 18. The word diff of every old line 330–632 against its new line (`wdiff.py 330 632`) shows only the bracket removals and the corrections of §3 items 13–19. A lint over the new text finds 0 "chair"; the review words left are design words (`struck`, "the prose lane"), the executed probe receipts under `cure/` (kept, CH §3 item 7), the scenario ids P4–P6, the Ruled column's dates and THE REVIEW TRAIL line.

**SEAT 1's RATCHET (its range alone, kept as it ran):**
`python3 tools/consolidate-ratchet.py <old lines 1–329> consolidate/PT-new.md --allow-missing-file consolidate/PT-allow.txt`:
```
tokens: old 815 · new 712 · missing 23 · new-in-new 5
  MISSING (old tokens absent from the new text; superseded names must be listed in the ledger and passed with --allow-missing):
   - []
   - anchorId
   - at_war_with_employer
   - beliefReadAndRestore.out
   - briefs/RULINGS-P5.md
   - contradicts
   - creed
   - cure/D-PT-p5-probe/p5Probe.out
   - cure/D-PT-p5.md
   - cure/D-PT-r2.md
   - cure/D-PT-r2b.md
   - cure/D-PT-r3-probe/windowedLapse.out
   - cure/D-PT-r3.md
   - cure/D-PT-r4-probe/beliefReadAndRestore.out
   - cure/D-PT-r4.md
   - cure/D-PT-r5-probe/huntFault.out
   - cure/D-PT-r5.md
   - cure/L-BD.md
   - enemy_in_service
   - hopWeeks
   - made_good · fell_short · came_to_nothing
   - p5Probe.out
   - via
  NEW tokens in the new text (each must be a registered name, never a mint):
   + "), 
   + 1beabdc85
   + bodyKind
   + settlement-engine-kits/fp-final-a73343ed-2026-10-17/history/PT-cure-record.md
   + store/settlementLifecycleHelpers.js :: reconcileWorldOnUndo
cites (path :: symbol): old 43 · new 43 · missing 0
laws (XX1–XXn bold): old 18 · new 18
OD rulings: old 7 · new 7
owner rows ⭐: old 0 · new 2
DRAFT marks: old 22 · new 21  ← FEWER (explain in the ledger)
UNMEASURED marks: old 2 · new 2
wave ids (XX-n): old 2 · new 2
flags (…Enabled): old 11 · new 11
review markers left in the new text: 0
RATCHET 2 DIFFERENCE CLASSES
```
Every remaining difference is explained: the 23 MISSING tokens stand in seat 2's running text (§4's last item); **cites 43 = 43** (every `path :: symbol` cite of the range survives, `spatial/spatialCost.js :: SLOW_NOT_SEVER_MAX` and `infoLure.js :: LIE_OUTCOMES` among them, both folded out of brackets); **laws 18 = 18**; **OD 7 = 7**; **⭐ 0 → 2** (§3 item 5); **DRAFT 22 → 21**: the one is old line 9's "COMPILED DRAFT", a status word moved with the status block — every DRAFT of the design text survives; **UNMEASURED 2 = 2**; **waves 2 = 2**; **flags 11 = 11**; **review markers left 0**. NEW tokens: `1beabdc85`, the history path, `bodyKind` (BD's field, named in the six-kind fold), the short cite `store/settlementLifecycleHelpers.js :: reconcileWorldOnUndo` (THE READER'S GUIDE; §3.4 carries its full signature) and one regex artefact — no mint.
Re-run by the continuation after its three fixes (§3 items 10–12): the output above is unchanged line for line (tokens 815 · 712 · missing 23 · new 5; cites 43 = 43; markers left 0).
A wider lint over the new text (`lint.py`: the chair · lane · round · ROUTED · RULINGS · CHAIR-NOTES · finding ids · fp-final · STOP · dates · ↳ · `cure/` · `skeptic/`) leaves only the executed probe receipts of §0 and §2.4 (kept, CH §3 item 7), the host document's path in §0, and the design words "the store-action lane" (§6's heading) and "drawn from the round" (PR's patrol round, §7.3).

## 6. SEAT 2's RECORD — THE STOPS AND WHAT IS LEFT FOR OTHERS
**⛔ STOP PT-C-n: NONE.** No passage of §9..§20 was left open by two brackets: each later bracket names the text it replaces (B245 → B246 on CH's adoption of the lift rule; B255 → B256 on the void's trigger; B261 → B262 on the marked weight; B393 withdrawing an earlier wording of the host's known-places list), and the latest ruling everywhere is the one the text states — the one case of a ruling whose brackets never reached a passage (OD-PT-2, P5 C.7's employer arm) is seat 1's §3 item 2, applied (§3 item 13).
**For the seams read (P8c) and the fold, not PT's to settle (stated in §20 THE OPEN QUESTIONS, unchanged in substance):** (8) CH §14 books a gang's bounty as `wildland`, `war` and `order` while BD §9.9 books it `order` — PT reads the call's own domain either way, so the drift is CH's and BD's to align (old text: "listed for the consolidation"; a cross-volume edit, so outside this lane's file list); (1) RN's halves and (2) the fold's party rows are the other volumes' to confirm on their consolidated texts; (7) is a question to the host.
**Vetoable presentational choices of seat 2:** the Ruled column's dates read from the ledger-branch snapshots (`git show`, read-only) and the brackets' own dates; ⭐ on the seven "THE OWNER'S" rows with the header's meaning; THE REFINEMENTS listed by content without their ids (the ids and rounds stay in history Part 2 and the text of record).

### 6a. SEAT 1's HANDOFF (as it stood; every item done — see the seat 2 note at the top)
- START at old line 330, `## §9 THE NET EFFECT, THE TOWN'S GATE AND THE BAN (PT-1, PT-6)`; append to `consolidate/PT-new.md` (it ends with old line 328's `---`). The build scripts are in this ledger's APPENDIX (`build.py` takes `END` as its argument; set `END=893` and add decision files `d09.py`…; the bracket index `brackets.json` is regenerated by `brackets.py`).
- WRITE `history/PT-cure-record.md`: Part 1 = old lines 3–9 verbatim (moved by seat 1; rows L03 · L06 · L07 · L09 and the 13 + 2 + 17 + 8 markers inside them); Part 2 = old §21 (lines 648–893) verbatim.
- APPLY in §18: OD-PT-2's "keeps ONLY the accepted-request arm" → the two authorization arms (§3 item 2); OD-PT-30's "§4's sites bracket" → "§4's sites paragraph" (§3 item 11). §20 keeps its number (seat 1's text points to it for the open questions and the refinements).
- RE-RUN the ratchet over the WHOLE old text with `consolidate/PT-allow.txt`, add seat 2's entries, then make §1's table and the totals whole and replace the PENDING rows of §7.

## 7. THE ROWS (one per marker; `B` = body bracket by index in old-text order · `N` = a bracket nested inside another · `C` = cure-record bracket word · `A` = `↳` outside brackets · `U` = `ROUTED-UNAPPLIED` outside brackets · `H` = round word outside brackets · `S` = `STOP` outside brackets · `L` = header/status line · `R` = cure-record header)

| id | old line | old section | first characters | disposition | new § | what happened |
|---|---|---|---|---|---|---|
| B000 | L6 | header | `[REFINED 2026-10-17 (fp-final) — …]` | MOVED | history Part 1 | inside old line 6, moved with it to history Part 1 |
| B001 | L6 | header | `[CURED 2026-10-18 (fp-final r1) — <finding id>: …]` | MOVED | history Part 1 | inside old line 6, moved with it to history Part 1 |
| B002 | L6 | header | `[REFINED 2026-10-18 (fp-final r1) — …]` | MOVED | history Part 1 | inside old line 6, moved with it to history Part 1 |
| B003 | L6 | header | `[CURED 2026-10-18 (fp-final r2) — <id>: …]` | MOVED | history Part 1 | inside old line 6, moved with it to history Part 1 |
| B004 | L6 | header | `[REFINED 2026-10-18 (fp-final r2) — …]` | MOVED | history Part 1 | inside old line 6, moved with it to history Part 1 |
| B005 | L6 | header | `[CURED 2026-10-18 (fp-final r3) — <id>: …]` | MOVED | history Part 1 | inside old line 6, moved with it to history Part 1 |
| B006 | L6 | header | `[REFINED 2026-10-18 (fp-final r3) — …]` | MOVED | history Part 1 | inside old line 6, moved with it to history Part 1 |
| B007 | L6 | header | `[CURED 2026-10-18 (fp-final r4) — <id>: …]` | MOVED | history Part 1 | inside old line 6, moved with it to history Part 1 |
| B008 | L6 | header | `[REFINED 2026-10-18 (fp-final r4) — …]` | MOVED | history Part 1 | inside old line 6, moved with it to history Part 1 |
| B009 | L6 | header | `[CURED 2026-10-19 (fp-final r5) — <id>: …]` | MOVED | history Part 1 | inside old line 6, moved with it to history Part 1 |
| B010 | L6 | header | `[REFINED 2026-10-19 (fp-final r5) — …]` | MOVED | history Part 1 | inside old line 6, moved with it to history Part 1 |
| B011 | L6 | header | `[CURED 2026-10-20 (fp-final P5) — <id>: …]` | MOVED | history Part 1 | inside old line 6, moved with it to history Part 1 |
| B012 | L6 | header | `[REFINED 2026-10-20 (fp-final P5) — …]` | MOVED | history Part 1 | inside old line 6, moved with it to history Part 1 |
| B013 | L22 | THE OWNER'S WORDS · THE ANSWER | `[CURED 2026-10-18 (fp-final r1) — PT-r1-1 · PT-r1-4 · PT-r1-` | FOLDED | THE OWNER'S WORDS · THE ANSWER | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B014 | L22 | THE OWNER'S WORDS · THE ANSWER | `[CURED 2026-10-18 (fp-final r2) — PT-r1-10 · PT-V2 (RULINGS-` | FOLDED | THE OWNER'S WORDS · THE ANSWER | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B015 | L35 | §0 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-23: the drain cannot` | FOLDED | §0 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B016 | L36 | §0 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-3 · SEAMS-r1-8]` | FOLDED | §0 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B017 | L37 | §0 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-7]` | FOLDED | §0 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B018 | L38 | §0 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-22 · PT-r1-35]` | FOLDED | §0 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B019 | L40 | §0 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-18]` | FOLDED | §0 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B020 | L41 | §0 | `[REFINED 2026-10-18 (fp-final r2) — weather and the sea are ` | DROPPED | — | superseded by B021: its rule (weather and the sea crossed by the landed law, PT minting neither) restated by B021 on the landed carriers alone, its "chair notes items 13–14, as corrected" basis withdrawn |
| B021 | L41 | §0 | `[REFINED 2026-10-18 (fp-final r2) — R2b-2: the journey rests` | FOLDED | §0 | its content folded into the journey row's "What it gives PT" cell (the landed slow-not-sever law, both cites kept); the contested chair-notes basis dropped with B020 |
| B022 | L42 | §0 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-5]` | FOLDED | §0 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B023 | L43 | §0 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-2]` | FOLDED | §0 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B024 | L44 | §0 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-9: the compile's "+≈` | FOLDED | §0 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B025 | L45 | §0 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-9]` | FOLDED | §0 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B026 | L47 | §0 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6 · RULINGS-ROUND` | FOLDED | §0 | folded into the posture row's "What it gives PT" cell by the line rewrite of old line 47 (THE ACTOR CONVENTION IS SIX KINDS — B028, the latest; B026's corps key and "`site` never an actor kind"; B027's reasons, its five-kind count superseded by B028) |
| B027 | L47 | §0 | `[CURED 2026-10-18 (fp-final r3) — A.7: the actor convention ` | FOLDED | §0 | folded into the posture row's "What it gives PT" cell by the line rewrite of old line 47 (THE ACTOR CONVENTION IS SIX KINDS — B028, the latest; B026's corps key and "`site` never an actor kind"; B027's reasons, its five-kind count superseded by B028) |
| B028 | L47 | §0 | `[CURED 2026-10-18 (fp-final r4) — A.12 (RULINGS-ROUND3 §G.3)` | FOLDED | §0 | folded into the posture row's "What it gives PT" cell by the line rewrite of old line 47 (THE ACTOR CONVENTION IS SIX KINDS — B028, the latest; B026's corps key and "`site` never an actor kind"; B027's reasons, its five-kind count superseded by B028) |
| B029 | L50 | §0 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-8]` | FOLDED | §0 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B030 | L50 | §0 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-8 (RULINGS-ROUND2 A.` | FOLDED | §0 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B031 | L54 | §0 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-2 · HOST-r1-3 · HO` | FOLDED | §0 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B032 | L54 | §0 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E: the own` | FOLDED | §0 | its content (the owner's doctrines and what each means for PT) folded verbatim as the last sentences of THE BINDING PRIOR WORDS; its date and ruling tag dropped |
| B033 | L56 | §0 | `[CURED 2026-10-18 (fp-final r3) — A.11]` | FOLDED | §0 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B034 | L62 | §1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-27: the unstated glo` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B035 | L64 | §1 | `[CURED 2026-10-20 (fp-final P5) — P5C-7 (WC-PT-33; 'briefs/R` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B036 | L64 | §1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-11: the warm-regard ` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B037 | L66 | §1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-1 (RULINGS-ROUND1 PT` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B038 | L66 | §1 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-1 (RULINGS-ROUND2 B)` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B039 | L68 | §1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-20: the owner's "fro` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B040 | L68 | §1 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-8 (A.1).]` | FOLDED | §1 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B041 | L70 | §1 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-6: RN's engine-mi` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B042 | L72 | §1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-27: "the single engi` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B043 | L72 | §1 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-14 (A.4).]` | FOLDED | §1 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B044 | L74 | §1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-15: two writers for ` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B045 | L76 | §1 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-5: "hold" is PL's ` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B046 | L78 | §1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-28: the ambush's own` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B047 | L80 | §1 | `[CURED 2026-10-19 (fp-final r5) — PT-X1 · m2]` | FOLDED | §1 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B048 | L80 | §1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-5 · PT-r1-4 · PT-r1-` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B049 | L82 | §1 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-14: CH's rule, "n` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B050 | L84 | §1 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-6: PT's "condemna` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B051 | L86 | §1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-10: neither volume g` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B052 | L86 | §1 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-10 · PT-V2 (A.2).]` | FOLDED | §1 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B053 | L92 | §1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-7 · PT-r1-9.]` | FOLDED | §1 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B054 | L94 | §1 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-3 · HOST-r1-9 · HO` | FOLDED | §1 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B055 | L94 | §1 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-12: M-SITE-A named` | FOLDED | §1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B056 | L96 | §1 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-5.]` | FOLDED | §1 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B057 | L104 | §2.1 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36]` | FOLDED | §2.1 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B058 | L104 | §2.1 | `[REFINED 2026-10-17 (fp-final) — R-PT-6: the toggle's field ` | FOLDED | §2.1 | its content (why `spatialLedgers`; why the field is `presentAt`) folded as the paragraph's last sentence |
| B059 | L108 | §2.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-13 (WC-PT-95; 'briefs/` | FOLDED | §2.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B060 | L109 | §2.1 | `[REFINED 2026-10-18 (fp-final r2) — R2b-3: the road arm is "` | FOLDED | §2.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B061 | L110 | §2.1 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-1 (RULINGS-ROUND2 B)` | FOLDED | §2.1 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B062 | L111 | §2.1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-8: a stored 'lastHea` | FOLDED | §2.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B063 | L112 | §2.1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-8: a clamped, decaye` | FOLDED | §2.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B064 | L112 | §2.1 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-8 (RULINGS-ROUND2 A.` | FOLDED | §2.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B065 | L115 | §2.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-22 (WC-PT-54; 'briefs/` | FOLDED | §2.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B066 | L115 | §2.1 | `[REFINED 2026-10-20 (fp-final P5) — R-P5-3: the verdict kept` | FOLDED | §2.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B067 | L116 | §2.1 | `[REFINED 2026-10-18 (fp-final r4) — R4-1 (PT-W1 · A.19's exa` | FOLDED | §2.1 | a change note: the `banKeys` row already carries the rule; its one design reason folded by the line rewrite of old line 116 |
| B068 | L116 | §2.1 | `[CURED 2026-10-18 (fp-final r3) — PT-V1 · the verifier's car` | FOLDED | §2.1 | a change note: the `banKeys` row already carries the rule; its one design reason folded by the line rewrite of old line 116 |
| B069 | L116 | §2.1 | `[REFINED 2026-10-18 (fp-final r3) — one key per door, the ne` | FOLDED | §2.1 | a change note: the `banKeys` row already carries the rule; its one design reason folded by the line rewrite of old line 116 |
| B070 | L116 | §2.1 | `[REFINED 2026-10-18 (fp-final r2) — R2b-1: §9.3 read 'seatCh` | FOLDED | §2.1 | its content (CH keeps the same key on `paragon.banKeys`; one ban, one lift rule, one sense) folded into the row's Meaning cell |
| B071 | L116 | §2.1 | `[CURED 2026-10-19 (fp-final r5) — PT-r4-verify m5: CH's row ` | FOLDED | §2.1 | its condition ("the field set is one only once CH takes the window") met by CH's own text of record at `1beabdc85` (`paragon.banKeys?: [≤8 { settlementId, episode, untilTick }]`), so the Meaning cell states "with the same window" — CONFIRMED by grep of `history/CH-bracketed-1beabdc85.md` |
| B072 | L117 | §2.1 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36 (BD's route (4): "` | FOLDED | §2.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B073 | L117 | §2.1 | `[REFINED 2026-10-19 (fp-final r5) — R5-1: one declared draft` | FOLDED | §2.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B074 | L123 | §2.1 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-11: the three und` | FOLDED | §2.1 | its content (one closed `backerRole` beside the plain `{kind, id}` convention; the crown never conflated with a liege) folded into the `backing` row; the three old qualifiers named only as dropped names (ALLOW-MISSING `polity: true`) |
| B075 | L127 | §2.1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-8 · PT-r1-4 · PT-r1-` | FOLDED | §2.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B076 | L128 | §2.1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-1: a stale toggle no` | FOLDED | §2.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B077 | L129 | §2.1 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-1 (B) · PT-r1-14 (A.` | FOLDED | §2.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B078 | L131 | §2.1 | `[REFINED 2026-10-17 (fp-final) — R-PT-1: RULINGS §5's 'proof` | FOLDED | §2.1 | its content folded into §2.4's `proof` row (the collision with the landed `told`, the cite `infoLure.js :: LIE_OUTCOMES`, the census, the owner's DM-facing words); its last sentence (RN takes the words at P4) closed by B079; the old paragraph line removed |
| B079 | L131 | §2.1 | `[CURED 2026-10-18 (fp-final r1) — the R-PT-1 bracket's last ` | FOLDED | §2.1 | its content (RN carries the same words) folded into §2.4's `proof` row |
| B080 | L133 | §2.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6 (and 'cure/D-CH` | FOLDED | §2.1 | its content (zero host lines; lit only with CH's corps and WC-10; `npcConsequencesEnabled`) folded into SHAPE 3's key grammar sentence |
| B081 | L133 | §2.1 | `[REFINED 2026-10-17 (fp-final) — R-PT-12: the writer 'addExc` | FOLDED | §2.1 | its content folded as a sentence of SHAPE 3 |
| B082 | L133 | §2.1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-9: a party ban, once` | FOLDED | §2.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B083 | L161 | §2.2 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-5: 'need' covers eve` | FOLDED | §2.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B084 | L161 | §2.2 | `[CURED 2026-10-18 (fp-final r2) — PT-V1: 'reachedTick' count` | FOLDED | §2.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B085 | L161 | §2.2 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6: a corps as act` | FOLDED | §2.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B086 | L161 | §2.2 | `[CURED 2026-10-18 (fp-final r3) — A.14: the minted 'a␟b' → t` | FOLDED | §2.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B087 | L161 | §2.2 | `[CURED 2026-10-18 (fp-final r4) — A.12 · L-BD 33 (the RULING` | FOLDED | §2.2 | its record cite (`spatialLedgers.bodies.records`) folded into the `need` comment of §2.2 |
| B088 | L161 | §2.2 | `[CURED 2026-10-20 (fp-final P5) — P5C-22 (WC-PT-36; 'briefs/` | FOLDED | §2.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B089 | L165 | §2.3 | `[REFINED 2026-10-20 (fp-final P5) — the census's WC-PT note ` | FOLDED | §2.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B090 | L166 | §2.3 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-1]` | FOLDED | §2.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B091 | L166 | §2.3 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-1 (RULINGS-ROUND1 PT` | FOLDED | §2.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B092 | L167 | §2.3 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-8]` | FOLDED | §2.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B093 | L171 | §2.3 | `[CURED 2026-10-19 (fp-final r5) — PT-X1: the hunt had "no PL` | FOLDED | §2.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B094 | L171 | §2.3 | `[CURED 2026-10-20 (fp-final P5) — P5C-6 (WC-PT-49; 'briefs/R` | FOLDED | §2.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B095 | L172 | §2.3 | `[CURED 2026-10-20 (fp-final P5) — P5C-7 (WC-PT-33): "the emp` | FOLDED | §2.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B096 | L180 | §2.4 | `[REFINED 2026-10-17 (fp-final) — R-PT-8: 'party_banned', 'ba` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B097 | L180 | §2.4 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-6: 'party_voiced'` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B098 | L182 | §2.4 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-15]` | FOLDED | §2.4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B099 | L183 | §2.4 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-13 · SEAMS-r1-5]` | FOLDED | §2.4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B100 | L183 | §2.4 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · RULINGS-ROUN` | FOLDED | §2.4 | its content (the road arm's meanings of `refused` and `admitted_under_watch`; no new kind, no new word) folded into the `party_gate` verdicts cell |
| B101 | L183 | §2.4 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route ('cure/L` | FOLDED | §2.4 | its reason (a body holds no posture toward the party, so its half takes the meeting's words) folded into the body-half clause of the same cell |
| B102 | L183 | §2.4 | `[REFINED 2026-10-18 (fp-final r4) — R4-2: the route named th` | FOLDED | §2.4 | its content ("no word is minted") folded into the body-half clause of the same cell |
| B103 | L184 | §2.4 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-16: 'kept' meant the` | FOLDED | §2.4 | its homonym reasons (`kept`, `broken`, `honoured`) folded into the pledge-verdicts cell; its "RN §2.1/§6.1 cite `kept · broken`" closed by B104 (RN aligned) |
| B104 | L184 | §2.4 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-16 (RULINGS-ROUND2 A` | FOLDED | §2.4 | its content (ONE vocabulary, PT's; `broken` out of every deed-kind list) folded into the pledge-verdicts cell |
| B105 | L186 | §2.4 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-22: 'honoured' → ` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B106 | L188 | §2.4 | `[REFINED 2026-10-17 (fp-final) — R-PT-13: invitations are an` | FOLDED | §2.4 | its content (an invitation is an offer kind) folded into the `OFFER_KINDS` cell |
| B107 | L189 | §2.4 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-34]` | FOLDED | §2.4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B108 | L190 | §2.4 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-11]` | FOLDED | §2.4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B109 | L193 | §2.4 | `[CURED 2026-10-20 (fp-final P5) — P5C-7]` | FOLDED | §2.4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B110 | L193 | §2.4 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36 · PT-X1]` | FOLDED | §2.4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B111 | L194 | §2.4 | `[REFINED 2026-10-17 (fp-final) — R-PT-9: 'party_pledge' is a` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B112 | L194 | §2.4 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-7: accepted by th` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B113 | L195 | §2.4 | `[CURED 2026-10-20 (fp-final P5) — P5C-7: 'offer_accepted', t` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B114 | L195 | §2.4 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36]` | FOLDED | §2.4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B115 | L195 | §2.4 | `[CURED 2026-10-18 (fp-final r4) — L-BD 33 · L-BD 36: both FR` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B116 | L195 | §2.4 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-14 · PT-r1-19 · SEAM` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B117 | L195 | §2.4 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E (sites):` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B118 | L195 | §2.4 | `[CURED 2026-10-18 (fp-final r2) — 'cure/D-ST-r2.md' route (H` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B119 | L196 | §2.4 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-18]` | FOLDED | §2.4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B120 | L196 | §2.4 | `[CURED 2026-10-20 (fp-final P5) — P5C-7: 'deed_acceptance' (` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B121 | L197 | §2.4 | `[REFINED 2026-10-20 (fp-final P5) — R-P5-1: the census's PT ` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B122 | L199 | §2.4 | `[CURED 2026-10-18 (fp-final r3) — A.8 (PL's routed note: "PT` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B123 | L199 | §2.4 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36; B.13's one read n` | FOLDED | §2.4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B124 | L199 | §2.4 | `[CURED 2026-10-18 (fp-final r4) — A.12 · THE BODIES' route ·` | FOLDED | §2.4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B125 | L199 | §2.4 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-5 · SEAMS-r1-22 · ` | FOLDED | §2.4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B126 | L199 | §2.4 | `[CURED 2026-10-18 (fp-final r2) — the verifier's carry ("'le` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B127 | L199 | §2.4 | `[CURED 2026-10-18 (fp-final r2) — 'cure/D-ST-r2.md' route (H` | FOLDED | §2.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B128 | L209 | §3.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-7]` | FOLDED | §3.1 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B129 | L212 | §3.1 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-1 (B) · PT-r1-14 (A.` | FOLDED | §3.1 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B130 | L214 | §3.1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-3 · SEAMS-r1-8 · PT-` | FOLDED | §3.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B131 | L214 | §3.1 | `[REFINED 2026-10-18 (fp-final r1) — the static skip beside t` | FOLDED | §3.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B132 | L216 | §3.1 | `[REFINED 2026-10-17 (fp-final) — R-PT-11: the twelve kinds h` | FOLDED | §3.1 | its content folded as the text of "The menace broken by the party's hand" (the paragraph was this bracket and B133 alone) |
| B133 | L216 | §3.1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-17: there is no 'DIR` | FOLDED | §3.1 | its content folded as the text of the same paragraph (MN's `party` dial; the deed at the verb's execution); "there is no `DIRECT_MENACE`" restated as "PT has no `DIRECT_MENACE`" |
| B134 | L218 | §3.1 | `[CURED 2026-10-18 (fp-final r4) — L-BD 33 (the claimed bount` | FOLDED | §3.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B135 | L218 | §3.1 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36 (FAIL · ROUTED-UNA` | FOLDED | §3.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B136 | L218 | §3.1 | `[REFINED 2026-10-19 (fp-final r5) — R5-1: the way shown to t` | FOLDED | §3.1 | its reason (a deed travels as a tale; a reveal is the DM telling the players) folded into the `party_made_known_trail` clause |
| B137 | L218 | §3.1 | `[REFINED 2026-10-18 (fp-final r4) — R4-3: the party's hand r` | FOLDED | §3.1 | its content (the dial rides BD's verbs; one act and one undo; MN's precedent) folded as a sentence of the bodies paragraph |
| B138 | L221 | §3.2 | `[CURED 2026-10-20 (fp-final P5) — P5C-7 (C.7)]` | FOLDED | §3.2 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B139 | L221 | §3.2 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-11 (the regard arm s` | FOLDED | §3.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B140 | L236 | §3.3 | `[REFINED 2026-10-18 (fp-final r4) — R4-4 (RULINGS-ROUND4 A.3` | FOLDED | §3.3 | its content (why `IMPOSE_CULT` reads AMBIGUOUS; the owner's correction quoted verbatim) folded after the AMBIGUOUS list |
| B141 | L238 | §3.3 | `[CURED 2026-10-20 (fp-final P5) — P5C-7 (WC-PT-33; 'briefs/R` | FOLDED | §3.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B142 | L238 | §3.3 | `[REFINED 2026-10-20 (fp-final P5) — R-P5-2: the link rides R` | FOLDED | §3.3 | its content (`heard_deed` at the mirror sign; `REGARD_CAUSES` gains no word) folded into the `offer_accepted` clause |
| B143 | L238 | §3.3 | `[CURED 2026-10-18 (fp-final r4) — A.3 (PT's word): "an untie` | FOLDED | §3.3 | its content (the untied holder is THE BODIES' body ref, its `bodyKind` a field) folded into the `party_cleared_site` clause; `band` as an untied-holder kind is gone |
| B144 | L238 | §3.3 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36: round 4's "no row` | FOLDED | §3.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B145 | L238 | §3.3 | `[CURED 2026-10-18 (fp-final r4) — L-BD 33 · L-BD 36]` | FOLDED | §3.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B146 | L238 | §3.3 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-14 (A.4) · the verif` | FOLDED | §3.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B147 | L240 | §3.3 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-2 (RULINGS-ROUND1 PT` | FOLDED | §3.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B148 | L240 | §3.3 | `[REFINED 2026-10-18 (fp-final r1) — the re-ruling's "'EVENT_` | FOLDED | §3.3 | its content (built through PT's registration rows, never the landed ripple map, and why) folded after the REGISTRATION WALKER paragraph |
| B149 | L240 | §3.3 | `[REFINED 2026-10-17 (fp-final) — R-PT-10, narrowed: "ambiguo` | FOLDED | §3.3 | its content ("ambiguous" means genuinely target-dependent) folded as the last sentence of the same paragraph |
| B150 | L243 | §3.4 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-7: undoing the autho` | FOLDED | §3.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B151 | L249 | §4 | `[CURED 2026-10-20 (fp-final P5) — P5C-7]` | FOLDED | §4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B152 | L249 | §4 | `[CURED 2026-10-20 (fp-final P5) — P5C-13]` | FOLDED | §4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B153 | L249 | §4 | `[REFINED 2026-10-20 (fp-final P5) — R-P5-4 (the census's WC-` | FOLDED | §4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B154 | L249 | §4 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36]` | FOLDED | §4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B155 | L249 | §4 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-12 (PT's half: "ci` | FOLDED | §4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B156 | L249 | §4 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-1 (RULINGS-ROUND1 PT` | FOLDED | §4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B157 | L249 | §4 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-1 (RULINGS-ROUND2 B)` | FOLDED | §4 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B158 | L251 | §4 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E; THE SIT` | FOLDED | §4 | its content (THE SITES' coverage row for PT; the volume path) folded into the paragraph's lead |
| B159 | L251 | §4 | `[CURED 2026-10-18 (fp-final r3) — the verifier's carry "RN's` | FOLDED | §4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B160 | L251 | §4 | `[REFINED 2026-10-18 (fp-final r4) — R4-5 (A.16's veil carrie` | FOLDED | §4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B161 | L251 | §4 | `[CURED 2026-10-18 (fp-final r2) — 'cure/D-ST-r2.md' route (S` | FOLDED | §4 | its open item (whether the reveal is also ONE act through PT's door) folded into item (2) as an open question pointing to §20; its `RECORD_CLEARING` naming already in the text |
| B162 | L257 | §5 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-20: the kingdom was ` | FOLDED | §5 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B163 | L257 | §5 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-8 (A.1).]` | FOLDED | §5 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B164 | L263 | §6 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6: a company may ` | FOLDED | §6 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B165 | L263 | §6 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-15: strike and amend` | FOLDED | §6 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B166 | L263 | §6 | `[REFINED 2026-10-18 (fp-final r1) — the compile let every pa` | FOLDED | §6 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B167 | L265 | §6 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b OD-PT-28]` | FOLDED | §6 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B168 | L265 | §6 | `[CURED 2026-10-18 (fp-final r4) — PT-W1 (MAJOR) · RULINGS-RO` | FOLDED | §6 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B169 | L265 | §6 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-7 · PT-r1-8.]` | FOLDED | §6 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B170 | L265 | §6 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-8 (A.1: the holder p` | FOLDED | §6 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B171 | L272 | §7.1 | `[CURED 2026-10-18 (fp-final r4) — RU-1 (ROUTED-UNAPPLIED; 'c` | FOLDED | §7.1 | its content (why the pass takes `regionalGraph`; zero host lines) folded as a clause of §7.1's first sentence |
| B172 | L272 | §7.1 | `[REFINED 2026-10-17 (fp-final) — R-PT-14: the host CH's week` | FOLDED | §7.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B173 | L272 | §7.1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-24: the compile kept` | FOLDED | §7.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B174 | L275 | §7.2 | `[CURED 2026-10-19 (fp-final r5) — 'D-CH-r5' ROUTE to PT (lat` | FOLDED | §7.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B175 | L275 | §7.2 | `[CURED 2026-10-19 (fp-final r5) — L-BD 33 (FAIL, a new contr` | FOLDED | §7.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B176 | L275 | §7.2 | `[CURED 2026-10-18 (fp-final r4) — L-BD 33 (the RULINGS-ROUND` | FOLDED | §7.2 | its content (the payment is BD's treasury row; the engine pays the party nothing) folded as a sentence of §7.2 |
| B177 | L275 | §7.2 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-37: CH's call carrie` | FOLDED | §7.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B178 | L277 | §7.2 | `[ADDED 2026-10-20 (fp-final P6c; 'cure/D-OP-r1.md' OP-r1-13 ` | FOLDED | §7.2 | its content folded as a paragraph of §7.2 in the design's voice ("CONFIRMED:" and the bracket-lane parenthesis "(CH's bracket by lane B)" dropped; "OP13 restated" → "OP13"); B179's widened parenthesis folded into it |
| B179 | L278 | §7.2 | `[ADDED 2026-10-20 (fp-final P6c brackets-verify; RULINGS-P6 ` | FOLDED | §7.2 | its content (the THIRD road — a telling that arrived, RN's `heardAt`; no new deed or telling source kind for a capture) folded into B178's paragraph ("NO NEW … SOURCE KIND" — its "NEW" restored by the continuation, §3 item 12) |
| B180 | L283 | §7.3 | `[CURED 2026-10-19 (fp-final r5) — PT-r4-verify m1]` | FOLDED | §7.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B181 | L284 | §7.3 | `[ADDED 2026-10-20 (fp-final P6c; OP-r1-13 · RULINGS-P6 §B.1)` | FOLDED | §7.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B182 | L285 | §7.3 | `[CURED 2026-10-20 (fp-final P5) — P5C-7]` | FOLDED | §7.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B183 | L287 | §7.3 | `[REFINED 2026-10-20 (fp-final P5) — R-P5-5: with the deadlin` | FOLDED | §7.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B184 | L288 | §7.3 | `[CURED 2026-10-20 (fp-final P5) — P5C-22 (WC-PT-36)]` | FOLDED | §7.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B185 | L288 | §7.3 | `[REFINED 2026-10-20 (fp-final P5) — R-P5-6, the census's ope` | FOLDED | §7.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B186 | L289 | §7.3 | `[CURED 2026-10-20 (fp-final P5) — P5C-22 (WC-PT-36): the dra` | FOLDED | §7.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B187 | L289 | §7.3 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-20: the hunters h` | FOLDED | §7.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B188 | L290 | §7.3 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-28 · HOST-r1-6]` | FOLDED | §7.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B189 | L292 | §7.3 | `[CURED 2026-10-18 (fp-final r4) — RU-1]` | FOLDED | §7.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B190 | L292 | §7.3 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route]` | FOLDED | §7.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B191 | L292 | §7.3 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-13 · SEAMS-r1-5]` | FOLDED | §7.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B192 | L292 | §7.3 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · RULINGS-ROUN` | FOLDED | §7.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B193 | L293 | §7.3 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-4]` | FOLDED | §7.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B194 | L294 | §7.3 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6]` | FOLDED | §7.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B195 | L294 | §7.3 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-34: CH's warning and` | FOLDED | §7.3 | its content (the ordinary person's visit is gone — ordinary persons never travel on their own, RN §5.4) folded into the `party_visit` row |
| B196 | L295 | §7.3 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-6 (the chair's ru` | FOLDED | §7.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B197 | L295 | §7.3 | `[CURED 2026-10-18 (fp-final r3) — A.11 · the RN verifier's n` | FOLDED | §7.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B198 | L296 | §7.3 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-14: the producer had` | FOLDED | §7.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B199 | L297 | §7.3 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-3: 'seatTransitio` | FOLDED | §7.3 | its content (a DM KILL/ASSIGN moves neither tail; the card offers "ask the new ruler about the party's backing") folded into the `backing_repudiated` row |
| B200 | L297 | §7.3 | `[CURED 2026-10-18 (fp-final r2) — the verifier's carry: PL n` | FOLDED | §7.3 | its content (under the tick form the tick-less `CHANGE_RULING_POWER` counts only behind a later stamped row; the same card) folded into the `backing_repudiated` row |
| B201 | L299 | §7.3 | `[CURED 2026-10-18 (fp-final r3) — the verifier's carry "a wa` | FOLDED | §7.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B202 | L299 | §7.3 | `[CURED 2026-10-18 (fp-final r2) — 'cure/D-PR-r2.md' route (P` | FOLDED | §7.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B203 | L299 | §7.3 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-19: no act recorded ` | FOLDED | §7.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B204 | L299 | §7.3 | `[CURED 2026-10-18 (fp-final r3) — A.11]` | FOLDED | §7.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B205 | L299 | §7.3 | `[CURED 2026-10-18 (fp-final r4) — A.15: round 3's "exactly a` | FOLDED | §7.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B206 | L310 | §8.2 | `[REFINED 2026-10-17 (fp-final) — R-PT-5: a stressor carries ` | FOLDED | §8.2 | its content folded as the lead sentence of §8.2 under its heading |
| B207 | L311 | §8.2 | `[CURED 2026-10-18 (fp-final r2) — the verifier's carry: §16 ` | FOLDED | §8.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B208 | L313 | §8.2 | `[REFINED 2026-10-19 (fp-final r5) — R5-2: the verifier's cur` | FOLDED | §8.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B209 | L313 | §8.2 | `[CURED 2026-10-18 (fp-final r4) — L-BD 33]` | FOLDED | §8.2 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B210 | L313 | §8.2 | `[CURED 2026-10-19 (fp-final r5) — PT-X1 (MAJOR): round 4's p` | FOLDED | §8.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B211 | L314 | §8.2 | `[CURED 2026-10-20 (fp-final P5) — P5C-6 (WC-PT-49): the dead` | FOLDED | §8.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B212 | L316 | §8.2 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-5: CH's call board i` | FOLDED | §8.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B213 | L318 | §8.3 | `[REFINED 2026-10-17 (fp-final) — R-PT-4: R2 offered 'hopWeek` | FOLDED | §8.3 | its content (the per-leg physics, research's `hopWeeks` alone widened to the named-person legs) folded as the lead sentence of §8.3 under its heading |
| B214 | L318 | §8.3 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-12 (4): "PT's pric` | FOLDED | §8.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B215 | L318 | §8.3 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-1 (RULINGS-ROUND1 PT` | FOLDED | §8.3 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B216 | L318 | §8.3 | `[REFINED 2026-10-18 (fp-final r2) — R2b-2: the cite rests on` | FOLDED | §8.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B217 | L318 | §8.3 | `[REFINED 2026-10-18 (fp-final r2) — the 'season' argument wa` | FOLDED | §8.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B218 | L320 | §8.4 | `[REFINED 2026-10-17 (fp-final) — R-PT-3: R2 R-16's one bit '` | FOLDED | §8.4 | its content (the fault fold, the formula, the reachability test) folded as the lead paragraph of §8.4 under its heading; R2 R-16's one bit `reachableAtSomeWeek` named only as what the integer replaces is dropped (ALLOW-MISSING); the deadline's place added from §2.3's DEADLINE arm (B094, the latest) so the list of places is complete |
| B219 | L320 | §8.4 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-25 · HOST-r1-10: the` | FOLDED | §8.4 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B220 | L323 | §8.5 | `[CURED 2026-10-20 (fp-final P5) — P5C-7 (WC-PT-33; 'briefs/R` | FOLDED | §8.5 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B221 | L323 | §8.5 | `[REFINED 2026-10-20 (fp-final P5) — R-P5-7: an employment's ` | FOLDED | §8.5 | its content (the deadline is the term of service; one pledged record; no persisted employment shape) folded into the `yes` sentence of §8.5 |
| B222 | L323 | §8.5 | `[REFINED 2026-10-18 (fp-final r2) — RN §7 names "an actor's ` | FOLDED | §8.5 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B223 | L323 | §8.5 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-6: "the walls will n` | FOLDED | §8.5 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B224 | L326 | §8.6 | `[CURED 2026-10-19 (fp-final r5) — PT-X1]` | FOLDED | §8.6 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B225 | L326 | §8.6 | `[CURED 2026-10-20 (fp-final P5) — P5C-6]` | FOLDED | §8.6 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B226 | L326 | §8.6 | `[CURED 2026-10-18 (fp-final r4) — L-BD 33]` | FOLDED | §8.6 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B227 | L326 | §8.6 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-4: a DM who answered` | FOLDED | §8.6 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B228 | L326 | §8.6 | `[CURED 2026-10-18 (fp-final r2) — PT-V1: the usual yes is gi` | FOLDED | §8.6 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B229 | L333 | §9.1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-21: the court and th` | FOLDED | §9.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B230 | L333 | §9.1 | `[CURED 2026-10-18 (fp-final r2) — PT-V4: a DM's stance on th` | FOLDED | §9.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B231 | L336 | §9.2 | `[CURED 2026-10-18 (fp-final r4) — RU-1: CH's signature carri` | FOLDED | §9.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B232 | L336 | §9.2 | `[CURED 2026-10-18 (fp-final r4) — A.8]` | FOLDED | §9.2 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B233 | L336 | §9.2 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E, the hos` | FOLDED | §9.2 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B234 | L336 | §9.2 | `[CURED 2026-10-20 (fp-final P5) — P5C-7 (WC-PT-33: "the empl` | FOLDED | §9.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B235 | L336 | §9.2 | `[REFINED 2026-10-20 (fp-final P5) — R-P5-8: CH reads "the pa` | FOLDED | §9.2 | a refinement note: the text at the same place carries the refinement; it is listed among §20's THE REFINEMENTS (vetoable); the note stays in the text of record |
| B236 | L336 | §9.2 | `[CURED 2026-10-18 (fp-final r3) — A.4 (SEAMS-r2-11's class, ` | FOLDED | §9.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B237 | L336 | §9.2 | `[CURED 2026-10-18 (fp-final r4) — SEAMS-r2-11 · A.4 (FAIL) ·` | FOLDED | §9.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B238 | L336 | §9.2 | `[CURED 2026-10-20 (fp-final P5) — P5C-22 (WC-PT-54; C.22: "'` | FOLDED | §9.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B239 | L336 | §9.2 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-13: a STANDING gate ` | FOLDED | §9.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B240 | L338 | §9.2 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · RULINGS-ROUN` | FOLDED | §9.2 | its ruling (the gate widened to a road WHERE, no new kind, CH's words unchanged; PR §8.2's trigger; CH's person arm) folded as the lead clause of §9.2's THE ROAD ARM; the ruling-file tags and finding ids dropped |
| B241 | L338 | §9.2 | `[CURED 2026-10-18 (fp-final r3) — A.14: the sea-hop test is ` | FOLDED | §9.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B242 | L338 | §9.2 | `[CURED 2026-10-18 (fp-final r4) — RU-1]` | FOLDED | §9.2 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B243 | L340 | §9.2 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route to PT ('` | FOLDED | §9.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B244 | L343 | §9.3 | `[CURED 2026-10-18 (fp-final r4) — m3: the record is 'banKeys` | FOLDED | §9.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B245 | L343 | §9.3 | `[CURED 2026-10-18 (fp-final r3) — PT-V1 (MAJOR; RULINGS-ROUN` | FOLDED | §9.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B246 | L343 | §9.3 | `[CURED 2026-10-18 (fp-final r4) — m2: round 3's "CH §11 stat` | FOLDED | §9.3 | its content (CH adopts PT's three clauses for its own keys, so the two records keep one lift rule) folded as a sentence of §9.3; CONFIRMED in CH's text of record (history/CH-bracketed-1beabdc85.md, CH §11: "so the person's and the party's `banKeys` keep ONE ban and ONE lift rule") |
| B247 | L343 | §9.3 | `[REFINED 2026-10-18 (fp-final r4) — m4: RULINGS-ROUND3 A.8's` | FOLDED | §9.3 | its content (PT's `banKeys` hold seat-episode keys, a departure from the letter of the one ban-episode form; two facts) folded as a sentence of §9.3; the departure listed among §20's refinements |
| B248 | L343 | §9.3 | `[REFINED 2026-10-18 (fp-final r2) — R2b-1: the tick form rea` | FOLDED | §9.3 | a refinement note: the text at the same place carries the refinement; it is listed among §20's THE REFINEMENTS (vetoable); the note stays in the text of record |
| B249 | L343 | §9.3 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-4: PT §7.3 named ` | FOLDED | §9.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B250 | L358 | §10.1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-33: the weight at a ` | FOLDED | §10.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B251 | L361 | §10.2 | `[CURED 2026-10-20 (fp-final P5) — P5C-22 (WC-PT-60; C.22: "t` | FOLDED | §10.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B252 | L361 | §10.2 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-10: for 'remove_n` | FOLDED | §10.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B253 | L364 | §10.3 | `[CURED 2026-10-20 (fp-final P5) — P5C-8 (WC-PT-42 · WC-PT-43` | FOLDED | §10.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B254 | L364 | §10.3 | `[REFINED 2026-10-20 (fp-final P5) — R-P5-9: (1) the ruling's` | FOLDED | §10.3 | a refinement note: the text at the same place carries the refinement; it is listed among §20's THE REFINEMENTS (vetoable); the note stays in the text of record |
| B255 | L364 | §10.3 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-14: the trigger, the` | FOLDED | §10.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B256 | L364 | §10.3 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-14 (RULINGS-ROUND2 A` | FOLDED | §10.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B257 | L376 | §11.1 | `[CURED 2026-10-18 (fp-final r3) — RN-V2 (routed by the RN ve` | FOLDED | §11.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B258 | L377 | §11.1 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-22: "usually swellin` | FOLDED | §11.1 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B259 | L380 | §11.2 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-10 (A.2): "the credi` | FOLDED | §11.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B260 | L380 | §11.2 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-12: the correction's` | FOLDED | §11.2 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B261 | L383 | §11.3 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-10: neither volume g` | FOLDED | §11.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B262 | L383 | §11.3 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-10 (RULINGS-ROUND2 A` | FOLDED | §11.3 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B263 | L388 | §12 | `[CURED 2026-10-20 (fp-final P5) — P5C-13]` | FOLDED | §12 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B264 | L388 | §12 | `[CURED 2026-10-20 (fp-final P5) — P5C-6 · P5C-7]` | FOLDED | §12 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B265 | L388 | §12 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36]` | FOLDED | §12 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B266 | L388 | §12 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-1 · HOST-r1-3 · HOST` | FOLDED | §12 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B267 | L393 | §13 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route]` | FOLDED | §13 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B268 | L393 | §13 | `[CURED 2026-10-18 (fp-final r3) — A.14: was 'a␟b']` | FOLDED | §13 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B269 | L393 | §13 | `[REFINED 2026-10-18 (fp-final r2) — R2b-5: PT's 'road(a, b)'` | FOLDED | §13 | a refinement note: the text at the same place carries the refinement; it is listed among §20's THE REFINEMENTS (vetoable); the note stays in the text of record |
| B270 | L393 | §13 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-20 · HOST-r1-6: a` | FOLDED | §13 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B271 | L393 | §13 | `[CURED 2026-10-18 (fp-final r2) — the verifier's carry: 'set` | FOLDED | §13 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B272 | L395 | §13 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E; THE PAT` | FOLDED | §13 | its source cite (THE PATROLS' PR8, PR19, §9.3, OD-PR-14/16) folded as the heading's parenthesis; the ruling tag and the brief's item numbers dropped |
| B273 | L395 | §13 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · RULINGS-ROUN` | FOLDED | §13 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B274 | L395 | §13 | `[CURED 2026-10-18 (fp-final r4) — m1 (c4's residue): "the WA` | FOLDED | §13 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B275 | L402 | §13 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route]` | FOLDED | §13 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B276 | L403 | §13 | `[CURED 2026-10-20 (fp-final P5) — P5C-6]` | FOLDED | §13 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B277 | L407 | §13 | `[CURED 2026-10-20 (fp-final P5) — P5C-8]` | FOLDED | §13 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B278 | L409 | §13 | `[REFINED 2026-10-17 (fp-final) — R-PT-7: the brief made ever` | FOLDED | §13 | a refinement note: the text at the same place carries the refinement; it is listed among §20's THE REFINEMENTS (vetoable); the note stays in the text of record |
| B279 | L409 | §13 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-13 (the gate CLIMAX ` | FOLDED | §13 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B280 | L418 | §14 | `[CURED 2026-10-18 (fp-final r3) — A.11]` | FOLDED | §14 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B281 | L418 | §14 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6 · STOP-PR-2]` | FOLDED | §14 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B282 | L418 | §14 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route · L-BD 3` | FOLDED | §14 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B283 | L421 | §14 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-36: only one flag sa` | FOLDED | §14 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B284 | L421 | §14 | `[REFINED 2026-10-17 (fp-final) — R-PT-2: the brief's 'partyS` | FOLDED | §14 | a refinement note: the text at the same place carries the refinement; it is listed among §20's THE REFINEMENTS (vetoable); the note stays in the text of record |
| B285 | L423 | §14 | `[CURED 2026-10-18 (fp-final r4) — L-BD 33 · L-BD 36]` | FOLDED | §14 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B286 | L423 | §14 | `[CURED 2026-10-20 (fp-final P5) — P5C-7]` | FOLDED | §14 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B287 | L423 | §14 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-7 · PT-r1-9 ('npcDmV` | FOLDED | §14 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B288 | L423 | §14 | `[CURED 2026-10-18 (fp-final r2) — PT-V3 (the value rows regi` | FOLDED | §14 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B289 | L429 | §15 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-15: C11's chain c` | FOLDED | §15 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B290 | L429 | §15 | `[CURED 2026-10-18 (fp-final r2) — PT-V3: PT-0 carried the va` | FOLDED | §15 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B291 | L435 | §15 | `[CURED 2026-10-20 (fp-final P5) — P5C-6 · P5C-7]` | FOLDED | §15 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B292 | L436 | §15 | `[CURED 2026-10-20 (fp-final P5) — P5C-8]` | FOLDED | §15 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B293 | L438 | §15 | `[CURED 2026-10-18 (fp-final r3) — A.11]` | FOLDED | §15 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B294 | L439 | §15 | `[CURED 2026-10-20 (fp-final P5) — P5C-22]` | FOLDED | §15 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B295 | L440 | §15 | `[CURED 2026-10-19 (fp-final r5) — PT-X1 · L-BD 36]` | FOLDED | §15 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B296 | L440 | §15 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route · L-BD 3` | FOLDED | §15 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B297 | L443 | §15 | `[CURED 2026-10-18 (fp-final r3) — the verifier's carry "§15'` | FOLDED | §15 | its content (no PT kind has a menace actor; the party's hand on a menace is a deed, §3.1) folded as a clause of the EDITOR line's counterparty |
| B298 | L443 | §15 | `[CURED 2026-10-18 (fp-final r4) — A.12]` | FOLDED | §15 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B299 | L443 | §15 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36]` | FOLDED | §15 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B300 | L443 | §15 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-15 · PT-r1-15 · P` | FOLDED | §15 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B301 | L443 | §15 | `[CURED 2026-10-18 (fp-final r2) — PT-V3 · PT-r1-10 (A.2) · P` | FOLDED | §15 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B302 | L453 | §16 | `[CURED 2026-10-20 (fp-final P5) — P5C-22]` | FOLDED | §16 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B303 | L453 | §16 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36]` | FOLDED | §16 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B304 | L455 | §16 | `[CURED 2026-10-20 (fp-final P5) — P5C-22 · P5C-7]` | FOLDED | §16 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B305 | L457 | §16 | `[CURED 2026-10-18 (fp-final r4) — PT-W1 · A.19 · R4-1]` | FOLDED | §16 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B306 | L458 | §16 | `[CURED 2026-10-20 (fp-final P5) — P5C-22]` | FOLDED | §16 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B307 | L464 | §16 | `[CURED 2026-10-18 (fp-final r3) — PT-V1 · the cap carry]` | FOLDED | §16 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B308 | L466 | §16 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36: 'waysKnown''s pat` | FOLDED | §16 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B309 | L466 | §16 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-7 (the source event'` | FOLDED | §16 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B310 | L466 | §16 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-8 (A.1) · PT-r1-1 (B` | FOLDED | §16 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B311 | L466 | §16 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6 (the 'u:' key) ` | FOLDED | §16 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B312 | L488 | §17 | `[CURED 2026-10-20 (fp-final P5) — P5C-7]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B313 | L508 | §17 | `[CURED 2026-10-20 (fp-final P5) — P5C-8: "the paramount at '` | FOLDED | §17 | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B314 | L520 | §17 | `[CURED 2026-10-18 (fp-final r3) — PT-V1]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B315 | L521 | §17 | `[CURED 2026-10-18 (fp-final r3) — the cap carry]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B316 | L522 | §17 | `[CURED 2026-10-18 (fp-final r3) — A.11]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B317 | L523 | §17 | `[CURED 2026-10-18 (fp-final r3) — A.4]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B318 | L523 | §17 | `[CURED 2026-10-18 (fp-final r4) — A.8 · SEAMS-r2-11 / A.4 (F` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B319 | L524 | §17 | `[CURED 2026-10-18 (fp-final r4) — PT-W1 · A.19]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B320 | L525 | §17 | `[CURED 2026-10-18 (fp-final r4) — A.19 · R4-1]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B321 | L526 | §17 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B322 | L527 | §17 | `[CURED 2026-10-18 (fp-final r4) — L-BD 33]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B323 | L527 | §17 | `[CURED 2026-10-19 (fp-final r5) — PT-X1 · L-BD 33 · B.5 · B.` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B324 | L528 | §17 | `[CURED 2026-10-18 (fp-final r4) — L-BD 36]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B325 | L528 | §17 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36 (BD's route (4))]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B326 | L529 | §17 | `[REFINED 2026-10-18 (fp-final r4) — R4-4 · A.3]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B327 | L530 | §17 | `[REFINED 2026-10-18 (fp-final r4) — R4-5]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B328 | L531 | §17 | `[CURED 2026-10-20 (fp-final P5) — P5C-6 (C.6's ONE pin)]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B329 | L532 | §17 | `[CURED 2026-10-20 (fp-final P5) — P5C-7]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B330 | L533 | §17 | `[CURED 2026-10-20 (fp-final P5) — P5C-8]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B331 | L534 | §17 | `[CURED 2026-10-20 (fp-final P5) — P5C-22]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B332 | L535 | §17 | `[CURED 2026-10-20 (fp-final P5) — P5C-22]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B333 | L536 | §17 | `[CURED 2026-10-20 (fp-final P5) — P5C-13]` | FOLDED | §17 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B334 | L538 | §17 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-1 (P21) · PT-r1-2 (P` | FOLDED | §17 | the scenario-to-finding index of a round (a change note or stamp) on old line 538, removed with the line; the scenarios stand in final form and the index stays in the text of record and the cure record |
| B335 | L538 | §17 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-1 (P21) · PT-r1-8 (P` | FOLDED | §17 | the scenario-to-finding index of a round (a change note or stamp) on old line 538, removed with the line; the scenarios stand in final form and the index stays in the text of record and the cure record |
| B336 | L538 | §17 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · STOP-PR-2 (P` | FOLDED | §17 | the scenario-to-finding index of a round (a change note or stamp) on old line 538, removed with the line; the scenarios stand in final form and the index stays in the text of record and the cure record |
| B337 | L538 | §17 | `[CURED 2026-10-18 (fp-final r3) — PT-V1 (P46) · the cap carr` | FOLDED | §17 | the scenario-to-finding index of a round (a change note or stamp) on old line 538, removed with the line; the scenarios stand in final form and the index stays in the text of record and the cure record |
| B338 | L538 | §17 | `[CURED 2026-10-18 (fp-final r4) — A.8 · RU-1 (P49) · PT-W1 ·` | FOLDED | §17 | the scenario-to-finding index of a round (a change note or stamp) on old line 538, removed with the line; the scenarios stand in final form and the index stays in the text of record and the cure record |
| B339 | L538 | §17 | `[CURED 2026-10-20 (fp-final P5) — P5C-6 (P57) · P5C-7 (P14, ` | FOLDED | §17 | the scenario-to-finding index of a round (a change note or stamp) on old line 538, removed with the line; the scenarios stand in final form and the index stays in the text of record and the cure record |
| B340 | L546 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-27]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B341 | L547 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-11; REFINED against ` | FOLDED | §18 | OD-PT-2 in final form: the backing default by PT2's two authorization arms (the employer arm by OD-PT-34, the latest ruling; seat 1's ledger §3 item 2); its amendment dates in the Ruled column |
| B342 | L548 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-1, RULINGS-ROUND1 PT` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B343 | L548 | §18 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-1, RULINGS-ROUND2 B;` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B344 | L549 | §18 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36; REFINED R5-1, vet` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B345 | L549 | §18 | `[CURED 2026-10-20 (fp-final P5) — P5C-22]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B346 | L549 | §18 | `[CURED 2026-10-20 (fp-final P5) — P5C-22; REFINED R-P5-3, ve` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B347 | L549 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-8]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B348 | L549 | §18 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-8, RULINGS-ROUND2 A.` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B349 | L549 | §18 | `[REFINED 2026-10-18 (fp-final r2) — R2b-3 · R2b-1, vetoable]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B350 | L550 | §18 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-11 · PT-r1-8 · PT` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B351 | L550 | §18 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-14, RULINGS-ROUND2 A` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B352 | L551 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-9]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B353 | L551 | §18 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B354 | L551 | §18 | `[REFINED 2026-10-18 (fp-final r2) — R2b-1, vetoable]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B355 | L551 | §18 | `[CURED 2026-10-18 (fp-final r3) — PT-V1 · the cap carry]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B356 | L551 | §18 | `[CURED 2026-10-18 (fp-final r4) — PT-W1 · RULINGS-ROUND4 A.1` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B357 | L551 | §18 | `[REFINED 2026-10-18 (fp-final r4) — R4-1, vetoable]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B358 | L552 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-15]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B359 | L554 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-4 · PT-r1-5]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B360 | L554 | §18 | `[CURED 2026-10-18 (fp-final r2) — PT-V1 · the verifier's car` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B361 | L554 | §18 | `[CURED 2026-10-20 (fp-final P5) — P5C-6]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B362 | L554 | §18 | `[REFINED 2026-10-20 (fp-final P5) — R-P5-5, vetoable]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B363 | L555 | §18 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-6 · HOST-r1-6 · P` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B364 | L555 | §18 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · STOP-PR-2]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B365 | L555 | §18 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B366 | L556 | §18 | `[CURED 2026-10-20 (fp-final P5) — P5C-8; REFINED R-P5-9 ('co` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B367 | L557 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-22; REFINED against ` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B368 | L559 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-36]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B369 | L560 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-24]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B370 | L562 | §18 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-15]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B371 | L562 | §18 | `[CURED 2026-10-18 (fp-final r2) — PT-V3]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B372 | L563 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-2; REFINED on the re` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B373 | L564 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-3 · SEAMS-r1-8]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B374 | L565 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-10]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B375 | L565 | §18 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-10 · PT-V2, RULINGS-` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B376 | L566 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-16]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B377 | L567 | §18 | `[CURED 2026-10-18 (fp-final r3) — A.11]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B378 | L568 | §18 | `[CURED 2026-10-20 (fp-final P5) — P5C-7]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B379 | L568 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-18]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B380 | L569 | §18 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-7]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B381 | L570 | §18 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-3 · HOST-r1-9 · HO` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B382 | L570 | §18 | `[CURED 2026-10-18 (fp-final r2) — HOST-r2-12]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B383 | L571 | §18 | `[REFINED 2026-10-18 (fp-final r1), vetoable]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B384 | L572 | §18 | `[CURED 2026-10-18 (fp-final r2) — PT-r1-1; REFINED on B's le` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B385 | L573 | §18 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2b OD-PT-28]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B386 | L574 | §18 | `[CURED 2026-10-18 (fp-final r2) — the verifier's carry]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B387 | L575 | §18 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E]` | FOLDED | §18 | OD-PT-30 in final form ("§4's sites paragraph", seat 1's ledger §3 item 11); its date in the Ruled column |
| B388 | L575 | §18 | `[CURED 2026-10-18 (fp-final r2) — 'cure/D-ST-r2.md' route (S` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B389 | L576 | §18 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B390 | L577 | §18 | `[CURED 2026-10-18 (fp-final r4) — m1]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B391 | L577 | §18 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-14 · STOP-PR-2 · ` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B392 | L578 | §18 | `[CURED 2026-10-19 (fp-final r5) — PT-X1 · B.15; round 4's "P` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B393 | L578 | §18 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36; round 4's "the ho` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B394 | L578 | §18 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route · L-BD 3` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B395 | L579 | §18 | `[CURED 2026-10-20 (fp-final P5) — P5C-7; REFINED R-P5-2 · R-` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B396 | L580 | §18 | `[REFINED 2026-10-20 (fp-final P5) — R-P5-6, vetoable: the al` | FOLDED | §18 | OD-PT-35: its refinement's alternative (ST's bounty input row) stands as §20's open question (9); the row points there |
| B397 | L581 | §18 | `[CURED 2026-10-20 (fp-final P5) — P5C-13]` | FOLDED | §18 | §18 rewritten in final form: the ruling text stands without its change notes; the row's amendment date carried in the Ruled column |
| B398 | L602 | §19 | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route · L-BD 3` | FOLDED | §19 | a stamp alone on its line; the line removed (the felt sentences of BD's route stand around it) |
| B399 | L606 | §19 | `[CURED 2026-10-20 (fp-final P5) — P5C-6 · P5C-7 · P5C-8 · P5` | FOLDED | §19 | a stamp alone on its line; the line removed (the three felt sentences above it stand) |
| B400 | L608 | §19 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-6 ("its walls are ne` | FOLDED | §19 | a change note alone on its line (the felt sentences it cured stand in final form); the line removed |
| B401 | L622 | §19b | `[CURED 2026-10-18 (fp-final r4) — R4-4 · L-BD 33 · L-BD 36: ` | FOLDED | §19b | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B402 | L622 | §19b | `[CURED 2026-10-19 (fp-final r5) — L-BD 36: 'party_made_known` | FOLDED | §19b | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B403 | L626 | §19b | `[CURED 2026-10-20 (fp-final P5) — P5C-7: the new deed's subj` | FOLDED | §19b | its design clause (the subject is `deed_refusal`'s mirror) folded into the row; its registration timing stands in §14/§15 (PT-4's rows) |
| B404 | L629 | §19b | `[CURED 2026-10-20 (fp-final P5) — P5C-13]` | FOLDED | §19b | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B405 | L629 | §19b | `[CURED 2026-10-20 (fp-final P5) — P5C-7]` | FOLDED | §19b | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B406 | L629 | §19b | `[CURED 2026-10-18 (fp-final r2) — STOP-PR-2]` | FOLDED | §19b | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B407 | L629 | §19b | `[CURED 2026-10-18 (fp-final r4) — THE BODIES' route · L-BD 3` | FOLDED | §19b | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B408 | L629 | §19b | `[CURED 2026-10-18 (fp-final r3) — A.11: "a court, a person o` | FOLDED | §19b | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B409 | L629 | §19b | `[CURED 2026-10-19 (fp-final r5) — L-BD 36]` | FOLDED | §19b | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B410 | L629 | §19b | `[CURED 2026-10-18 (fp-final r1) — PT-r1-18: PT had no voice ` | FOLDED | §19b | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B411 | L629 | §19b | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E (sites):` | FOLDED | §19b | a change note: the text at the same place already carries the change; the note stays in the text of record |
| B412 | L637 | §20 | `[CURED 2026-10-18 (fp-final r1) — PT-r1-25 · HOST-r1-10]` | FOLDED | §20 | a stamp: the cured text stands at the same place; its ids stay in the text of record |
| B413 | L642 | §20 | `[REFINED 2026-10-18 (fp-final r1) — …]` | FOLDED | §20 | a bracket template quoted in the old REFINED list; the list restated by content without round labels, ids or templates (§20 THE REFINEMENTS); the templates stay in the text of record |
| B414 | L642 | §20 | `[REFINED 2026-10-18 (fp-final r2) — …]` | FOLDED | §20 | a bracket template quoted in the old REFINED list; the list restated by content without round labels, ids or templates (§20 THE REFINEMENTS); the templates stay in the text of record |
| B415 | L642 | §20 | `[REFINED 2026-10-18 (fp-final r2) — R2b-…]` | FOLDED | §20 | a bracket template quoted in the old REFINED list; the list restated by content without round labels, ids or templates (§20 THE REFINEMENTS); the templates stay in the text of record |
| B416 | L642 | §20 | `[REFINED 2026-10-18 (fp-final r3) — …]` | FOLDED | §20 | a bracket template quoted in the old REFINED list; the list restated by content without round labels, ids or templates (§20 THE REFINEMENTS); the templates stay in the text of record |
| B417 | L642 | §20 | `[REFINED 2026-10-18 (fp-final r4) — …]` | FOLDED | §20 | a bracket template quoted in the old REFINED list; the list restated by content without round labels, ids or templates (§20 THE REFINEMENTS); the templates stay in the text of record |
| B418 | L642 | §20 | `[REFINED 2026-10-19 (fp-final r5) — …]` | FOLDED | §20 | a bracket template quoted in the old REFINED list; the list restated by content without round labels, ids or templates (§20 THE REFINEMENTS); the templates stay in the text of record |
| B419 | L642 | §20 | `[REFINED 2026-10-20 (fp-final P5) — R-P5-…]` | FOLDED | §20 | a bracket template quoted in the old REFINED list; the list restated by content without round labels, ids or templates (§20 THE REFINEMENTS); the templates stay in the text of record |
| B420 | L644 | §20 | `[CURED 2026-10-18 (fp-final r3) — routed, RN's lane]` | FOLDED | §20 | a stamp in the old open-questions line; the line restated as THE OPEN QUESTIONS (§20), the same ten items in order |
| B421 | L644 | §20 | `[CURED 2026-10-18 (fp-final r3) — the verifier's carry "§20(` | FOLDED | §20 | a stamp in the old open-questions line; the line restated as THE OPEN QUESTIONS (§20), the same ten items in order |
| B422 | L644 | §20 | `[CURED 2026-10-18 (fp-final r3) — the verifier's carry on "t` | FOLDED | §20 | a stamp in the old open-questions line; the line restated as THE OPEN QUESTIONS (§20), the same ten items in order |
| B423 | L644 | §20 | `[CURED 2026-10-19 (fp-final r5) — L-BD 36 · L-BD 33]` | FOLDED | §20 | a stamp in the old open-questions line; the line restated as THE OPEN QUESTIONS (§20), the same ten items in order |
| N01 | L320 | §8.4 | `[CURED 2026-10-19 (fp-final r5) — PT-X1]. When the clock end` | FOLDED | §8.4 | a stamp nested inside B218; removed with it (B218's content folded) |
| C01 | L740 | §21 Round r2 | `[STOP-PR-2 ruled and executed in round 2b] \| §13, §8.3 \| \| R` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| U01 | L6 | header | `its two fails — one ROUTED-UNAPPLIED — its new MAJOR and its` | MOVED | history Part 1 | inside old line 6 (the bracket-template and round-by-round review line), moved with it |
| U02 | L6 | header | `its two fails — one ROUTED-UNAPPLIED — its new MAJOR PT-X1 a` | MOVED | history Part 1 | inside old line 6 (the bracket-template and round-by-round review line), moved with it |
| H01 | L6 | header | `cure/L-PT-probe/'). Round 1 (2026-10-18, lane D-PT-r1, Opus ` | MOVED | history Part 1 | inside old line 6 (the bracket-template and round-by-round review line), moved with it |
| H02 | L6 | header | `e/D-PT-r1-probe/'). Round 2 (2026-10-18, lane D-PT-r2, Opus ` | MOVED | history Part 1 | inside old line 6 (the bracket-template and round-by-round review line), moved with it |
| H03 | L6 | header | `s 5.5) re-cured the round-1 verifier's fails and disposed it` | MOVED | history Part 1 | inside old line 6 (the bracket-template and round-by-round review line), moved with it |
| H04 | L6 | header | `e/D-PT-r2-probe/'). Round 2b (2026-10-18, lane D-PT-r2b, Opu` | MOVED | history Part 1 | inside old line 6 (the bracket-template and round-by-round review line), moved with it |
| H05 | L6 | header | `/D-PT-r2b-probe/'). Round 3a (2026-10-18, lane D-PT-r3, Opus` | MOVED | history Part 1 | inside old line 6 (the bracket-template and round-by-round review line), moved with it |
| H06 | L6 | header | `e/D-PT-r3-probe/'). Round 4a (2026-10-18, lane D-PT-r4, Opus` | MOVED | history Part 1 | inside old line 6 (the bracket-template and round-by-round review line), moved with it |
| H07 | L6 | header | `T-routed row of the round-3 cure files and of 'cure/L-BD.md'` | MOVED | history Part 1 | inside old line 6 (the bracket-template and round-by-round review line), moved with it |
| H08 | L6 | header | `e/D-PT-r4-probe/'). Round 5a (2026-10-19, lane D-PT-r5, Opus` | MOVED | history Part 1 | inside old line 6 (the bracket-template and round-by-round review line), moved with it |
| S01 | L6 | header | `measurements, every STOP and the open questions are 'settlem` | MOVED | history Part 1 | inside old line 6 (the bracket-template and round-by-round review line), moved with it |
| H09 | L9 | header | `5 block; no STOP. **Round 5a (2026-10-19).** Round 5a (lane ` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| H10 | L9 | header | ` 5a (2026-10-19).** Round 5a (lane D-PT-r5) cured PT-X1 (a b` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| H11 | L9 | header | `-r5 block; no STOP. Round 4a (lane D-PT-r4) cured A.8 ('enem` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| H12 | L9 | header | `-r4 block; no STOP. Round 3a (lane D-PT-r3) had disposed the` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| H13 | L9 | header | `erifier's findings: Round 3a (lane D-PT-r3) cured PT-V1 (a c` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| H14 | L9 | header | `-r3 block; no STOP. Round 2b (lane D-PT-r2b) disposed every ` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| H15 | L9 | header | `r2b block; no STOP. Round 2 re-cured the five fails and disp` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| H16 | L9 | header | ` round-r2 block. In round 1 every id of 'skeptic/PT-r1.md' a` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| H17 | L9 | header | `hair's rulings (the round-1 re-rulings PT-r1-1, -2, -3 and t` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| S02 | L9 | header | ` §21's P5 block; no STOP. **Round 5a (2026-10-19).** Round 5` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| S03 | L9 | header | ` round-r5 block; no STOP. Round 4a (lane D-PT-r4) cured A.8 ` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| S04 | L9 | header | ` round-r4 block; no STOP. Round 3a (lane D-PT-r3) had dispos` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| S05 | L9 | header | ` round-r3 block; no STOP. Round 2b (lane D-PT-r2b) disposed ` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| S06 | L9 | header | `b.md' names for PT (STOP-PR-2 RULED (a); the corps keyed 'u:` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| S07 | L9 | header | `round-r2b block; no STOP. Round 2 re-cured the five fails an` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| S08 | L9 | header | `The compile's two ⛔ STOPS were RULED by the chair (RULINGS-A` | MOVED | history Part 1 | inside old line 9 (the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE), moved with it |
| H18 | L26 | §0 | `L-PT.md' §1, and by round 1, 'cure/D-PT-r1.md' §1)` | FOLDED | §0 | the label removed; the passage stands in final form |
| S09 | L54 | §0 | `, it says so with a STOP or a REFINED bracket. THE HOST ('re` | FOLDED | §0 | the label removed; the passage stands in final form |
| H19 | L171 | §2.3 | `6 has read it since round 1, unchanged); for a HUNT ('need.b` | FOLDED | §2.3 | the label removed; the passage stands in final form |
| H20 | L176 | §2.4 | `-probe/tokens.out', round 1 'cure/D-PT-r1-probe/census-r1a/b` | FOLDED | §2.4 | the label removed; the passage stands in final form |
| H21 | L193 | §2.4 | `be/census-r2.out' — round 1's 'voidsRef' is struck, A.4; 'pe` | FOLDED | §2.4 | the label removed; the passage stands in final form |
| H22 | L218 | §3.1 | ` as applied in BD's round 5) and BD's 'TRAIL_KNOWN' a fourth` | FOLDED | §3.1 | the label removed; the passage stands in final form |
| A01 | L284 | §7.3 | `\| ↳ 'party_request' [ADDED 2026-10-20 (fp-` | FOLDED | §7.3 | the ↳ `party_request` row folded into its parent row (old line 283: "never from a `captive_held` call …"); the ↳ line removed |
| S10 | L343 | §9.3 | `on the party" (PL's STOP-2 precedent, as CH §11). [REFINED 2` | FOLDED | §9.3 | the label removed; the passage stands in final form |
| H23 | L361 | §10.2 | `backing's reach" in round 1). SHARED OWNERSHIP: the backer e` | FOLDED | §10.2 | the label removed; the passage stands in final form |
| H24 | L423 | §14 | `robe/effLines.out', round 1 'cure/D-PT-r1-probe/effLines-r1.` | FOLDED | §14 | the label removed; the passage stands in final form |
| H25 | L510 | §17 | `e act's own — never round 1's +0.23 approval \|` | FOLDED | §17 | the label removed; the passage stands in final form |
| H26 | L524 | §17 | `store.out' A–D; the round-3 inverse re-run leaves '[]', 'gat` | FOLDED | §17 | the label removed; the passage stands in final form |
| S11 | L577 | §18 | ` on a watched road (STOP-PR-2, RULED (a) in RULINGS-ROUND2b)` | FOLDED | §18 | the label removed; the passage stands in final form |
| S12 | L592 | §19 | `f and the officer — STOP-PR-2, RULINGS-ROUND2b)*` | FOLDED | §19 | the label removed; the passage stands in final form |
| S13 | L633 | §20 | `## §20 THE STOPS, THE REFINEMENTS AND THE OPEN QUES` | KEPT | §20 | KEPT: the word is §20's own title (THE STOPS, THE REFINEMENTS AND THE OPEN QUESTIONS), a design heading; the section now states THE OPEN STOPS: none |
| H27 | L640 | §20 | `**Round 1 raised NO new STOP.** Every find` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| H28 | L640 | §20 | `/D-PT-r1.md' §5). **Round 2 raised NO new STOP** ('cure/D-PT` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| H29 | L640 | §20 | `isted there (§5). **Round 2b raised NO new STOP** ('cure/D-P` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| H30 | L640 | §20 | `2b) and executed. **Round 3a raised NO new STOP** ('cure/D-P` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| H31 | L640 | §20 | `ure/D-PT-r3.md'). **Round 4a raised NO new STOP** ('cure/D-P` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| H32 | L640 | §20 | `d there (ROUTES). **Round 5a raised NO new STOP** ('cure/D-P` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| S14 | L640 | §20 | `und 1 raised NO new STOP.** Every finding was cured or is cu` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| S15 | L640 | §20 | `und 2 raised NO new STOP** ('cure/D-PT-r2.md' §3); its other` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| S16 | L640 | §20 | `nd 2b raised NO new STOP** ('cure/D-PT-r2b.md' §3); STOP-PR-` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| S17 | L640 | §20 | `e/D-PT-r2b.md' §3); STOP-PR-2 and OD-PT-28 are RULED (RULING` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| S18 | L640 | §20 | `nd 3a raised NO new STOP** ('cure/D-PT-r3.md'). **Round 4a r` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| S19 | L640 | §20 | `nd 4a raised NO new STOP** ('cure/D-PT-r4.md'); its other-vo` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| S20 | L640 | §20 | `nd 5a raised NO new STOP** ('cure/D-PT-r5.md'); its other-vo` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| S21 | L640 | §20 | `§5). **P5 raised NO STOP** ('cure/D-PT-p5.md'); its other-vo` | MOVED | history Part 1b | inside old line 640 (old §20's line of each round's STOPs), moved verbatim with it to history Part 1b; its content restated as §20's THE OPEN STOPS line |
| H33 | L642 | §20 | ` kinds (narrowed in round 1 to genuinely target-dependent ty` | FOLDED | §20 | the round label removed: old §20's REFINED list restated by content, without round labels, ids or bracket templates (§20 THE REFINEMENTS) |
| H34 | L642 | §20 | `gement pass's host. ROUND 1 ('[REFINED 2026-10-18 (fp-final ` | FOLDED | §20 | the round label removed: old §20's REFINED list restated by content, without round labels, ids or bracket templates (§20 THE REFINEMENTS) |
| H35 | L642 | §20 | `he world's actors). ROUND 2 ('[REFINED 2026-10-18 (fp-final ` | FOLDED | §20 | the round label removed: old §20's REFINED list restated by content, without round labels, ids or bracket templates (§20 THE REFINEMENTS) |
| H36 | L642 | §20 | `t re-minted (§8.3). ROUND 2b ('[REFINED 2026-10-18 (fp-final` | FOLDED | §20 | the round label removed: old §20's REFINED list restated by content, without round labels, ids or bracket templates (§20 THE REFINEMENTS) |
| H37 | L642 | §20 | `'s ONE STRETCH KEY. ROUND 3a ('[REFINED 2026-10-18 (fp-final` | FOLDED | §20 | the round label removed: old §20's REFINED list restated by content, without round labels, ids or bracket templates (§20 THE REFINEMENTS) |
| H38 | L642 | §20 | `e one merged edge). ROUND 4a ('[REFINED 2026-10-18 (fp-final` | FOLDED | §20 | the round label removed: old §20's REFINED list restated by content, without round labels, ids or bracket templates (§20 THE REFINEMENTS) |
| H39 | L642 | §20 | `8's letter, marked. ROUND 5a ('[REFINED 2026-10-19 (fp-final` | FOLDED | §20 | the round label removed: old §20's REFINED list restated by content, without round labels, ids or bracket templates (§20 THE REFINEMENTS) |
| H40 | L644 | §20 | ` (1) RN's halves of round 2 are CURED in RN's round 2b ('par` | FOLDED | §20 | the round label removed: old §20's OPEN FOR THE CHAIR restated as THE OPEN QUESTIONS, the same ten items in order |
| H41 | L644 | §20 | `2 are CURED in RN's round 2b ('partySeq' named in the deed n` | FOLDED | §20 | the round label removed: old §20's OPEN FOR THE CHAIR restated as THE OPEN QUESTIONS, the same ten items in order |
| H42 | L644 | §20 | ` "the reveal"]; (6) round 1's two still open: a deed-only up` | FOLDED | §20 | the round label removed: old §20's OPEN FOR THE CHAIR restated as THE OPEN QUESTIONS, the same ten items in order |
| H43 | L650 | §21 Round r1 | `### Round r1 (P3 round 1, 2026-10-18; lane D` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H44 | L650 | §21 Round r1 | `### Round r1 (P3 round 1, 2026-10-18; lane D-PT-r1, Opus ` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| S22 | L650 | §21 Round r1 | `D · 0 REFUTED · 0 ⛔ STOP · 0 NOTED` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H45 | L712 | §21 Round r2 | `### Round r2 (P3 round 2, 2026-10-18; lane D` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H46 | L712 | §21 Round r2 | `### Round r2 (P3 round 2, 2026-10-18; lane D-PT-r2, Opus ` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| S23 | L712 | §21 Round r2 | `D · 0 REFUTED · 0 ⛔ STOP · 7 NOTED` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H47 | L714 | §21 Round r2 | `'s nine unnumbered "round-2 carries" are given ids 'PT-r1v-c` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H48 | L720 | §21 Round r2 | ` shows the reason); round 1's belief scaling withdrawn, as R` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H49 | L720 | §21 Round r2 | ` withdrawn, as RN's round 2 withdrew it (RN-V5(c)) \| §11.3, ` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| S24 | L732 | §21 Round r2 | `nt' row; §5.5/§11's STOP SEAMS-r1-6) is RN's half \| §20 (1) ` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H50 | L740 | §21 Round r2 | `led and executed in round 2b] \| §13, §8.3 \|` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| S25 | L740 | §21 Round r2 | `tems 5, 13, 15, 18; STOP-PR-2 left to the chair) [STOP-PR-2 ` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| S26 | L740 | §21 Round r2 | `left to the chair) [STOP-PR-2 ruled and executed in round 2b` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H51 | L741 | §21 Round r2 | ` H16 [superseded in round 2b: the host's patrol facts go out` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H52 | L744 | §21 Round r2b | `### Round r2b (P3 round 2b, 2026-10-18; lane` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H53 | L744 | §21 Round r2b | `### Round r2b (P3 round 2b, 2026-10-18; lane D-PT-r2b, Opu` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H54 | L744 | §21 Round r2b | `he rows the sibling round-2 logs route to PT; the log is 'se` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| S27 | L744 | §21 Round r2b | `D · 0 REFUTED · 0 ⛔ STOP · 3 NOTED` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| S28 | L751 | §21 Round r2b | `\| RULINGS-ROUND2b STOP-PR-2 \| — \| CURED — RULED (a) execut` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H55 | L760 | §21 Round r2b | `RN cured PT's three round-2 halves (§20 (1) updated) \| §20 \|` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H56 | L763 | §21 Round r2b | `REFINED in round 2b (each marked in place, vetoable` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H57 | L765 | §21 Round r3 | `### Round r3 (P3 round 3a, 2026-10-18; lane ` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H58 | L765 | §21 Round r3 | `### Round r3 (P3 round 3a, 2026-10-18; lane D-PT-r3, Opus` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| S29 | L765 | §21 Round r3 | `D · 0 REFUTED · 0 ⛔ STOP · 19 NOTED` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| S30 | L783 | §21 Round r3 | `n PT; no such kind (STOP-PR-2) \| — \|` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H59 | L809 | §21 Round r3 | `REFINED in round 3a (marked in place, vetoable): R3` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| U03 | L811 | §21 Round r4 | `its two fails — one ROUTED-UNAPPLIED — its new MAJOR and its` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H60 | L811 | §21 Round r4 | `### Round r4 (P3 round 4a, 2026-10-18; lane ` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H61 | L811 | §21 Round r4 | `### Round r4 (P3 round 4a, 2026-10-18; lane D-PT-r4, Opus` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| S31 | L811 | §21 Round r4 | `D · 0 REFUTED · 0 ⛔ STOP · 16 NOTED` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| U04 | L816 | §21 Round r4 | `\| RU-1 (FAIL · ROUTED-UNAPPLIED; 'cure/D-CH-r3.md' §5 P` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H62 | L843 | §21 Round r4 | `REFINED in round 4a (marked in place, vetoable): R4` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| U05 | L845 | §21 Round r5 | `its two fails — one ROUTED-UNAPPLIED — its new MAJOR PT-X1 a` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H63 | L845 | §21 Round r5 | `### Round r5 (P3 round 5a, 2026-10-19; lane ` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H64 | L845 | §21 Round r5 | `### Round r5 (P3 round 5a, 2026-10-19; lane D-PT-r5, Opus` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| S32 | L845 | §21 Round r5 | `D · 0 REFUTED · 0 ⛔ STOP · 10 NOTED` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| U06 | L850 | §21 Round r5 | `' route (4) (FAIL · ROUTED-UNAPPLIED) \| MAJOR \| CURED per B.` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H65 | L872 | §21 Round r5 | `REFINED in round 5a (marked in place, vetoable): R5` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| H66 | L874 | §21 Round P5 | `### Round P5 (the completeness critic, 2026-` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| S33 | L874 | §21 Round P5 | `D · 0 REFUTED · 0 ⛔ STOP · 1 NOTED` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| A02 | L893 | §21 Round P5 | `acket at §7.2 and a ↳ row at §7.3; 'cure/L-CH-PD.md' §4 rout` | MOVED | history Part 2 | inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2 |
| L03 | L3 | header | `## Chair session a73343ed (Fable 5.1); compiled by lane L-PT` | MOVED | history Part 1 | header/status line moved verbatim to history Part 1 (seat 2 writes `history/PT-cure-record.md`): compile header line (the compiling session and lane) |
| L06 | L6 | header | `## '[REFINED 2026-10-17 (fp-final) — …]' brackets mark every` | MOVED | history Part 1 | header/status line moved verbatim to history Part 1 (seat 2 writes `history/PT-cure-record.md`): the bracket-template and round-by-round review line |
| L07 | L7 | header | `## P6c (THE BRACKETS, 2026-10-20): ONE CONFIRMING bracket fr` | MOVED | history Part 1 | header/status line moved verbatim to history Part 1 (seat 2 writes `history/PT-cure-record.md`): the P6c brackets line |
| L09 | L9 | header | `> **Status: COMPILED DRAFT, P5 DISPOSED (2026-10-20).** P5 (` | MOVED | history Part 1 | header/status line moved verbatim to history Part 1 (seat 2 writes `history/PT-cure-record.md`): the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER'S GUIDE |
| L01 | L1 | header | `# DESIGN_FP_ARCH_PT — THE PARTY: the world's one outside act` | FOLDED | header | the title, kept verbatim as the new header's first line |
| L04 | L4 | header | `## Compiled on the owner's word; DARK behind three virtual f` | FOLDED | header | restated in the new header (the three flags, nothing scheduled) |
| L05 | L5 | header | `## Bound by the FP constitution's requirements 1–24 ('DESIGN` | FOLDED | header | restated in the new header (requirements 1–24 and the fold) |
| R01 | L648 | §21 | `## §21 THE CURE RECORD` | MOVED | history Part 2 | cure-record header, moved verbatim to history Part 2 (the new §21 is THE REVIEW TRAIL, one line) |
| R03 | L650 | §21 Round r1 | `### Round r1 (P3 round 1, 2026-10-18; lane D-PT-r1, Opus 5.5` | MOVED | history Part 2 | cure-record header, moved verbatim to history Part 2 (the new §21 is THE REVIEW TRAIL, one line) |
| R65 | L712 | §21 Round r2 | `### Round r2 (P3 round 2, 2026-10-18; lane D-PT-r2, Opus 5.5` | MOVED | history Part 2 | cure-record header, moved verbatim to history Part 2 (the new §21 is THE REVIEW TRAIL, one line) |
| R97 | L744 | §21 Round r2b | `### Round r2b (P3 round 2b, 2026-10-18; lane D-PT-r2b, Opus ` | MOVED | history Part 2 | cure-record header, moved verbatim to history Part 2 (the new §21 is THE REVIEW TRAIL, one line) |
| R118 | L765 | §21 Round r3 | `### Round r3 (P3 round 3a, 2026-10-18; lane D-PT-r3, Opus 5.` | MOVED | history Part 2 | cure-record header, moved verbatim to history Part 2 (the new §21 is THE REVIEW TRAIL, one line) |
| R164 | L811 | §21 Round r4 | `### Round r4 (P3 round 4a, 2026-10-18; lane D-PT-r4, Opus 5.` | MOVED | history Part 2 | cure-record header, moved verbatim to history Part 2 (the new §21 is THE REVIEW TRAIL, one line) |
| R198 | L845 | §21 Round r5 | `### Round r5 (P3 round 5a, 2026-10-19; lane D-PT-r5, Opus 5.` | MOVED | history Part 2 | cure-record header, moved verbatim to history Part 2 (the new §21 is THE REVIEW TRAIL, one line) |
| R227 | L874 | §21 Round P5 | `### Round P5 (the completeness critic, 2026-10-20; lane D-PT` | MOVED | history Part 2 | cure-record header, moved verbatim to history Part 2 (the new §21 is THE REVIEW TRAIL, one line) |

## APPENDIX — THE BUILD, VERBATIM (the working copies are in the seat's scratchpad `cpt/`; run `python3 brackets.py`, then `python3 build.py 647` (it writes `body_new.md`, copied to `consolidate/PT-new.md`), `python3 mk_history.py` (it writes `history/PT-cure-record.md`), `python3 ledger.py 647`, then `python3 ledger_md.py`)

### `brackets.py`

````python
import re,json,bisect
OLD='/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit/history/PT-bracketed-1beabdc85.md'
s=open(OLD,encoding='utf-8').read(); lines=s.split('\n')
offs=[0]
for l in lines: offs.append(offs[-1]+len(l)+1)
def lineof(p): return bisect.bisect_right(offs,p)
CURE0=648
BODY_END=offs[CURE0-1]
pat=re.compile(r'\[(CURED|REFINED|ADDED|RE-POINTED|OPENED|RE-RULED|STOP|CORRECTED|AMENDED|RULED|NOTED|CONFIRMED)\b')
out=[];i=0
while True:
    m=pat.search(s,i)
    if not m or m.start()>=BODY_END: break
    st=m.start();depth=0;j=st
    while j<len(s):
        c=s[j]
        if c=='[': depth+=1
        elif c==']':
            depth-=1
            if depth==0: break
        j+=1
    out.append(dict(i=len(out),start=st,end=j+1,line=lineof(st),endline=lineof(j),kind=m.group(1),text=s[st:j+1]))
    i=j+1
stamp=re.compile(r'^\[(CURED|REFINED|ADDED) \d{4}-\d\d-\d\d \([^()]*\)( — [^:\]]{0,90})?\]$')
for b in out: b['stamp']=bool(stamp.match(b['text']))
json.dump(out,open('brackets.json','w'),ensure_ascii=False,indent=0)
from collections import Counter
print('n',len(out),Counter(b['kind'] for b in out),'multiline',sum(b['line']!=b['endline'] for b in out))
print('in range (line<330):',sum(b['line']<330 for b in out),'beyond:',sum(b['line']>=330 for b in out))
print('nested',sum(1 for b in out if pat.search(b['text'],1)))
print('stamps',sum(b['stamp'] for b in out))
# read view
o=[];p=0
for b in out:
    o.append(s[p:b['start']]); o.append('⟦%d⟧'%b['i'] if b['stamp'] else '⟦%d: %s⟧'%(b['i'],b['text'][1:-1])); p=b['end']
o.append(s[p:])
t=''.join(o).split('\n')
open('read.md','w').write('\n'.join('%d\t%s'%(k+1,l) for k,l in enumerate(t)))
# plain view (brackets as ⟦i⟧)
o=[];p=0
for b in out:
    o.append(s[p:b['start']]); o.append('⟦%d⟧'%b['i']); p=b['end']
o.append(s[p:])
open('plain.md','w').write(''.join(o))
````

### `build.py`

````python
import json,re,sys,os
D=os.path.dirname(os.path.abspath(__file__))
OLD='/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit/history/PT-bracketed-1beabdc85.md'
S=open(OLD,encoding='utf-8').read(); L=S.split('\n')
BR=json.load(open(D+'/brackets.json'))
X={}; DR={}; MV={}; SUBS=[]; LINE={}; NOTE={}; HEAD=None
END=int(sys.argv[1]) if len(sys.argv)>1 else 329
for f in sorted(x for x in os.listdir(D) if re.match(r'd\d\d\.py$',x)): exec(open(D+'/'+f).read())
offs=[0]
for l in L: offs.append(offs[-1]+len(l)+1)
byline={}
for b in BR: byline.setdefault(b['line'],[]).append(b)
def clean_line(n):
    l=L[n-1]; base=offs[n-1]
    bs=byline.get(n,[])
    out=[];p=0
    for b in bs:
        s0=b['start']-base; e0=b['end']-base
        seg=l[p:s0]
        v=X.get(b['i'])
        if b['i'] in DR or b['i'] in MV or v is None:
            seg=seg.rstrip(' ')
            out.append(seg); out.append('\x01')  # removed marker
        else:
            if v[:1] in ';,.)': seg=seg.rstrip(' ')
            out.append(seg); out.append(v)
        p=e0
    out.append(l[p:])
    t=''.join(out)
    # removed brackets: drop marker; fix spacing
    t=re.sub(r'\x01 +(?=[;,.)])','',t)
    t=re.sub(r'\x01(?=[ ]*\x01)','',t)
    t=re.sub(r'^\x01 ?','',t)
    t=t.replace('\x01','')
    t=re.sub(r'(?<=\S)  +(?=\S)',' ',t) if not t.startswith('  ') else t
    t=re.sub(r' +([.,;:)])(?![^`]*`[^`]*$)',r'\1',t) if False else t
    return t
new={}
for n in range(1,END+1):
    if n in LINE: new[n]=LINE[n]; continue
    new[n]=clean_line(n)
# substitutions on cleaned lines
for (n,a,b) in SUBS:
    c=new[n].count(a)
    assert c==1, ('SUB miss' if c==0 else 'SUB multi', n, a[:80], c)
    new[n]=new[n].replace(a,b)
json.dump({k:v for k,v in new.items()},open(D+'/newlines.json','w'),ensure_ascii=False)
out=[]
if HEAD: out.append(HEAD.rstrip('\n'))
for n in range(1,END+1):
    if new[n] is None: continue
    out.append(new[n])
txt='\n'.join(x.rstrip(' ') if '\n' not in x else '\n'.join(y.rstrip(' ') for y in x.split('\n')) for x in out)
txt=re.sub(r'\n{3,}','\n\n',txt)
open(D+'/body_new.md','w').write(txt+'\n')
print('lines',len(txt.split('\n')),'bytes',len(txt.encode()))
````

### `d00.py`

````python
# header: old lines 1-9 replaced by HEAD (head.py); 3,6,7,9 MOVED to history Part 1; 4,5 restated in HEAD
for n in range(1,10): LINE[n]=None
MV_LINES={3:'compile header line (the compiling session and lane)',6:'the bracket-template and round-by-round review line',7:'the P6c brackets line',9:'the STATUS block (P5 back to the compile STOPs); its last two sentences restated after THE READER\'S GUIDE'}
FOLD_LINES={1:'the title, kept verbatim as the new header\'s first line',4:'restated in the new header (the three flags, nothing scheduled)',5:'restated in the new header (requirements 1–24 and the fold)'}
for b in BR:
    if b['line'] in MV_LINES: MV[b['i']]='inside old line %d, moved with it to history Part 1'%b['line']
````

### `d01.py`

````python
# owner's words, the answer, §0, §1 (old lines 10-96)
SUBS+= [
(17,' (the chair reads "at all of" as "at odds with")',' ("at all of" is read as "at odds with")'),
(26,"(master `81f1cd963`; research `findings/R2.md` whole, `findings/R3.md` §1c/§1e/§2 Q4·Q8·Q9; re-measured by this lane, `cure/L-PT.md` §1, and by round 1, `cure/D-PT-r1.md` §1)","(master `81f1cd963`; measured in `findings/R2.md` whole, `findings/R3.md` §1c/§1e/§2 Q4·Q8·Q9, `cure/L-PT.md` §1 and `cure/D-PT-r1.md` §1)"),
(44,"the ONE ban (RULINGS §4); the party's edges","the ONE ban; the party's edges"),
(47,"the actor ref `{kind:'party'}` joins by the chair's fold row (`settlement · person · party · menace`, RULINGS §4)",
 "the actor ref `{kind:'party'}` joins by the fold's SP-4a row. THE ACTOR CONVENTION IS SIX KINDS, `settlement · person · party · menace · corps · body`: THE CORPS adds `corps` — a company decides (its own weekly choice, CH §16b; `{kind:'corps', id: unitKey}`, RN keys it `u:<unitKey>`); a menace stays an actor because the DM's authored course stands in for its mind (MN12, MN6); a BODY (THE BODIES, `DESIGN_FP_ARCH_BD.md` §2.1) decides its own week, its `bodyKind ∈ conclave · gang · beast` a field. For PT a body is never an engagement's ACTOR (no body is moved toward, chosen against or scored by the party — BD15), only the COUNTERPARTY of the road arm's body half (§9.2) and the quarry of a bounty the party may answer (§7.2). `site` is a WHERE kind and a subject (the `subject` dial), NEVER an actor kind: a site has no mind, no course and no choice (ST4)"),
(48,"THE ONE PERSON STAGE (RULINGS-AFTER-COMPILE RN-S1): RN owns","THE ONE PERSON STAGE: RN owns"),
(50,"PERSISTED (RULINGS-ROUND2 A.1); the law","PERSISTED; the law"),
(52,"(PT-S2, ruled: C1)","(PT-S2's slot, C1)"),
(56,"(a COURT's voice is not: RULINGS-ROUND3 A.11, §7.3)","(a COURT's voice is not, §7.3)"),
(62,"is the ban: RULINGS-AFTER-RESEARCH §4 widens the one ban system's edge","is the ban: the ruling widens the one ban system's edge"),
(64,"WITH ZERO-CLICK DEFAULTS (the chair notes item 3).**","WITH ZERO-CLICK DEFAULTS (ZERO-CLICK MARKS).**"),
(66,'the deed wins (RULINGS-ROUND2 B: "the deed is the newer fact")','the deed wins ("the deed is the newer fact")'),
(68,"written by the party door (§2.1; RULINGS-ROUND2 A.1);","written by the party door (§2.1);"),
(68,"the registry idiom the chair ruled for CH's act kinds, SEAMS-r1-2).","the registry idiom ruled for CH's act kinds)."),
(70,"(`party_voiced`, the chair's ruling of SEAMS-r1-6; its voices RULINGS-ROUND3 A.11)","(`party_voiced`, a ruled kind; its voices, §7.3)"),
(72,"(§10.3; a correction of the backed deed, RULINGS-ROUND2 A.4)","(§10.3; a correction of the backed deed)"),
(86,"(§11.3; RULINGS-ROUND2 A.2)","(§11.3)"),
(90,"(RULINGS §5, R2 Q5)","(the research rulings; R2 Q5)"),
]
# §0 the journey row: the two r2 notes -> the latest (B21) folded into the cell
DR[20]=(21,'its rule (weather and the sea crossed by the landed law, PT minting neither) restated by B021 on the landed carriers alone, its "chair notes items 13–14, as corrected" basis withdrawn')
X[21]="; the journey rests on the LANDED carriers alone: the seasonal law is SLOW, NEVER SEVER (`spatial/spatialCost.js :: SLOW_NOT_SEVER_MAX = 6`: winter makes a mountain pass \"NEAR-impassable … but NEVER infinite/cut — so a snowed-in town is dear to reach yet still RESCUABLE by spring\"), and so is the storm season (`distanceRead.js :: stormSeasonFactor`, internal: \"Always ≥ 1 (slow, not sever)\"); the party is no army and rides no navy's convoy (W-NAVY's `navalTransit` carries armies), so a sea leg is the lanes' own price"
NOTE[21]='its content folded into the journey row\'s "What it gives PT" cell (the landed slow-not-sever law, both cites kept); the contested chair-notes basis dropped with B020'
# §0 posture row: B026-B028 folded by the SUB above (six kinds = B028, the latest; B026's corps key and site rule; B027's reasons, its count superseded by B028)
for i in (26,27,28): NOTE[i]='folded into the posture row\'s "What it gives PT" cell by the line rewrite of old line 47 (THE ACTOR CONVENTION IS SIX KINDS — B028, the latest; B026\'s corps key and "`site` never an actor kind"; B027\'s reasons, its five-kind count superseded by B028)'
# §0 binding prior words (line 54): the ruling-file list restated; the doctrines bracket (B032) folded as the paragraph's last sentences
SUBS+= [
(54,"The chair's rulings (`briefs/L-PT.md` rulings 1–19, amended by `briefs/RULINGS-AFTER-RESEARCH.md` §1/§4/§5/§7, `RULINGS-AFTER-COMPILE.md` (PT-S1 · PT-S2 · THE ONE PERSON STAGE), `RULINGS-ROUND1.md` PT-r1-1 · PT-r1-2 · PT-r1-3 and its ADDENDUM (SEAMS-r1-6 `party_voiced`; SEAMS-r1-3 `seatChangedSince`; SEAMS-r1-2 the registration of act rows into RN's table)) and the chair notes item 3 (ZERO-CLICK MARKS) — where this volume departs, it says so with a STOP or a REFINED bracket.",
 "The program's rulings bind — the compile's rulings 1–19 as amended after the research (the one ban widened to actor refs; the words of §2.4) and after the compile (PT-S1 and PT-S2 given their slots; THE ONE PERSON STAGE), the institution deeds keyed on the target, one act one deed, the public voice `party_voiced`, the seat-change read `seatChangedSince`, the registration of act rows into RN's table, and ZERO-CLICK MARKS; where this volume departs from one of them, the departure is a vetoable ruling (§18) or refinement (§20)."),
(54,"The chair's host ruling of 2026-10-18: the world canon is geography, not the simulator — \"canonized ≠ premium\" (RULINGS-ROUND1 ADDENDUM, HOST-r1-2).",
 "The host ruling: the world canon is geography, not the simulator — \"canonized ≠ premium\"."),
]
X[32]=" THE OWNER'S DOCTRINES bind here. THE WORLD HOSTS THE CAMPAIGN, NEVER COMPETES — the simulation stays indifferent to the party (PT1) and no engagement exists to make the party matter. MACRO OVER MICRO — there is no trial of the party: a summons, a warrant, a bounty or a ban is a hearing card, and what happens to the party happens at the table. NO ENGINE MORTALITY CLOCK — the party's fate and every named person's death are the DM's (PT1, PT6). MEDIEVAL FOR MILLENNIA — no era changes PT's shapes; an advance by N years runs the same defaults year upon year (§13). MENACES NEVER EMERGENT — the party's hand on a menace is MN's dial on the DM's own verbs (§3.1). PURPOSE ONLY BY THE DM — an engagement is an actor's own need or grievance, never a purpose the engine gives the party (ST16 and PR19 say the same)."
NOTE[32]='its content (the owner\'s doctrines and what each means for PT) folded verbatim as the last sentences of THE BINDING PRIOR WORDS; its date and ruling tag dropped'
````

### `d02.py`

````python
# §2 THE ONTOLOGY (old lines 100-199)
X[58]=" It lives in `spatialLedgers`, never on the campaign record, because the pulse's pure functions take and return `worldState` (R2 Q7); the toggle's field is `presentAt` (`presence` is prose in 197 source files)."
NOTE[58]='its content (why `spatialLedgers`; why the field is `presentAt`) folded as the paragraph\'s last sentence'
SUBS+= [
(108,"the DOSSIER's party lines (the dossier is a reader, CHAIR-NOTES 20 (b)/(d))","the DOSSIER's party lines (the dossier is a reader)"),
(112,"PERSISTED (RULINGS-ROUND2 A.1 — RN wins);","PERSISTED (RN §7's holder);"),
(116,"or once its own `untilTick` passes, R4-1)","or once its own `untilTick` passes)"),
(116,"(a re-ban at the same door replaces its key with the newer episode;","(a re-ban at the same door replaces its key with the newer episode — the landed merge keeps one edge per door and kind, so one key per door keeps one lift rule for one fact;"),
(116,"because a landed `ExclusionEdge` carries no mint tick (`npcLedgerFacets.js :: normalizeExclusionEdge` returns `{ settlementId, kind, untilTick }` or `{ settlementId, kind, indefinite: true }`)",
 "because a landed `ExclusionEdge` carries no mint tick (`npcLedgerFacets.js :: normalizeExclusionEdge` returns `{ settlementId, kind, untilTick }` or `{ settlementId, kind, indefinite: true }`). CH keeps the same key, with the same window, on a paragon's record (`paragon.banKeys`, CH §11, OD-CH-34), where `banish`'s restoring inverse meets the same case — one ban, one lift rule, one sense of the key on two records"),
(119,"(RN owns `spatialLedgers.deeds` and its one normalizer, R-RN-9;","(RN owns `spatialLedgers.deeds` and its one normalizer;"),
(124,"(§11.3; RULINGS-ROUND2 A.2)","(§11.3)"),
(129,"carry RN's own `correctsRef` (RULINGS-ROUND2 A.4) — PT mints no link field","carry RN's own `correctsRef` — PT mints no link field (no `voidsRef`)"),
(133,"(CH §16b; RN §2.2's unit key, RULINGS-ROUND2b SEAMS-r2-6) — whose edges CH writes (the corps arm of its town's gate and its bans, CH §11) through the same writer;",
 "(CH §16b; RN §2.2's unit key) — whose edges CH writes (the corps arm of its town's gate and its bans, CH §11) through the same writer, at zero host lines, lit only with CH's corps and WC-10 and, like every edge write, under `npcConsequencesEnabled`;"),
]
for i in (67,68,69,71): NOTE[i]='a change note: the `banKeys` row already carries the rule; its one design reason folded by the line rewrite of old line 116'
NOTE[70]='its content (CH keeps the same key on `paragon.banKeys`; one ban, one lift rule, one sense) folded into the row\'s Meaning cell'
NOTE[71]='its condition ("the field set is one only once CH takes the window") met by CH\'s own text of record at `1beabdc85` (`paragon.banKeys?: [≤8 { settlementId, episode, untilTick }]`), so the Meaning cell states "with the same window" — CONFIRMED by grep of `history/CH-bracketed-1beabdc85.md`'
NOTE[80]='its content (zero host lines; lit only with CH\'s corps and WC-10; `npcConsequencesEnabled`) folded into SHAPE 3\'s key grammar sentence'
X[81]=" The writer refuses while `npcConsequencesEnabled` is dark (`if (!npcConsequencesActive(worldState)) return { worldState, changed: false };`) and no second gate stands inside the ledger, so party bans carry `npcConsequencesEnabled` in their TIER line, and the town's-gate refusal by regard (§9.2) stands without them."
NOTE[81]='its content folded as a sentence of SHAPE 3'
# the proof-words paragraph (old line 131): B078's content moved into §2.4's `proof` row; its RN sentence closed by B079
LINE[131]=None
NOTE[78]='its content folded into §2.4\'s `proof` row (the collision with the landed `told`, the cite `infoLure.js :: LIE_OUTCOMES`, the census, the owner\'s DM-facing words); its last sentence (RN takes the words at P4) closed by B079; the old paragraph line removed'
NOTE[79]='its content (RN carries the same words) folded into §2.4\'s `proof` row'
# §2.2 the engagement code block
SUBS+= [
(144,"— the digest's own pair form, `spatial/distanceRead.js :: pairKey`: \"`` a < b ? `${a}|${b}` : `${b}|${a}` ``\"; RULINGS-ROUND3 A.14)","— the digest's own pair form, `spatial/distanceRead.js :: pairKey`: \"`` a < b ? `${a}|${b}` : `${b}|${a}` ``\")"),
(145,"its place each week the body's own `where`, §8.2; r5, PT-X1)","its place each week the body's own `where`, §8.2)"),
(146,"while it stands (§8.5; P5, P5C-7)","while it stands (§8.5)"),
(147,"read by the weekly `party_hunted` draw (§7.3) (P5, P5C-22)","read by the weekly `party_hunted` draw (§7.3); ⭐ a declared sub-field, the owner's shape, VISIBLE (OD-PT-4)"),
]
# §2.3
SUBS+= [
(166,"goes to the deed (PT3; RULINGS-ROUND2 B);","goes to the deed (PT3);"),
(171,"a war need's requester's town (the need's town as §8.6 has read it since round 1, unchanged);","a war need's requester's town (the need's town, as §8.6 reads it);"),
]
# §2.4
SUBS+= [
(176,"(each `rg -w`-checked on master — `cure/L-PT-probe/tokens.out`, round 1 `cure/D-PT-r1-probe/census-r1a/b/c.out`; fold §5 rows owed at P4)","(each `rg -w`-checked on master — `cure/L-PT-probe/tokens.out`, `cure/D-PT-r1-probe/census-r1a/b/c.out`; the fold's §5 registers them)"),
(181,"| RULINGS §5; `seeking` 12 prose","| the research rulings' words; `seeking` 12 prose"),
(183,"in CH's registered sense · THE BODY HALF","in CH's registered sense; on the ROAD ARM the SAME words — `refused` = turned back on the road, `admitted_under_watch` = let pass under the riders' eye; no new kind and no new word · THE BODY HALF"),
(183,"`reaches_party` PT's own course word, `struck` the seal's","`reaches_party` PT's own course word, `struck` the seal's — a body holds no posture toward the party (BD15), so its half takes the meeting's words, never the gate's, and no word is minted"),
(184,"compounds FREE (0 · 0 · 0 · 0 each).","compounds FREE (0 · 0 · 0 · 0 each). ONE vocabulary, PT's — RN's deed lists use the same words: `kept` is avoided (PL's `relief_answer: sent · kept` means the opposite on the same registry — the liege KEPT its army home), `broken` is landed (`REMAINING_BANDS` key; `conditionGrammar.js :: DAMAGE_STATES`) and stays out of every deed-kind list, and `honoured` is avoided beside the landed `'honored'` (`pactRenewal.js`, `honored_by_silence` on the same docket)."),
(185,"the chair's ruled words (RULINGS-ROUND1 ADDENDUM, SEAMS-r1-6).","the ruled words."),
(188,"`bribe` 3 prose.","`bribe` 3 prose. An invitation is an offer kind, never a family of its own."),
(191,"| R-PT-1; `spoken`/`unspoken` registered against `operationsVoice.js`'s keys (L-FOLD's census) |",
 "| the code words for the owner's DM-facing \"kept quiet · told · shown\", because `told` is a LANDED literal on the same information surface (`infoLure.js :: LIE_OUTCOMES = Object.freeze(['told', 'believed', 'caught'])`); both FREE as literals (10 and 65 prose files, 0 literals); RN §2.1's deed table carries the same words; `spoken`/`unspoken` registered against `operationsVoice.js`'s keys (L-FOLD's census) |"),
(192,"| RULINGS §5 and RN §2.4;","| the research rulings' words and RN §2.4;"),
(193,"`cure/D-PT-r2-probe/census-r2.out` — round 1's `voidsRef` is struck, A.4;","`cure/D-PT-r2-probe/census-r2.out` — PT mints no `voidsRef` (the void links by RN's `correctsRef`);"),
(195,"(§4's sites bracket)","(§4's sites paragraph)"),
(197,"(the copy source of the fold's register pass, `briefs/RULINGS-P5.md` C.12)","(the copy source of the fold's register pass)"),
(197,"fold §5 0 hits each (re-grepped 2026-10-20) — ROUTED to the fold's register pass","fold §5 0 hits each — the fold's register pass copies this row"),
(199,"**Homonyms registered (fold §5 at P4).**","**Homonyms registered (fold §5).**"),
(199,"(ST §2.1, §2.3; HOST-r2-19)","(ST §2.1, §2.3)"),
(199,"`u:<unitKey>`; RULINGS-ROUND3 A.8, PL OD-PL-46)","`u:<unitKey>`; PL OD-PL-46)"),
]
NOTE[100]='its content (the road arm\'s meanings of `refused` and `admitted_under_watch`; no new kind, no new word) folded into the `party_gate` verdicts cell'
NOTE[101]='its reason (a body holds no posture toward the party, so its half takes the meeting\'s words) folded into the body-half clause of the same cell'
NOTE[102]='its content ("no word is minted") folded into the body-half clause of the same cell'
NOTE[103]='its homonym reasons (`kept`, `broken`, `honoured`) folded into the pledge-verdicts cell; its "RN §2.1/§6.1 cite `kept · broken`" closed by B104 (RN aligned)'
NOTE[104]='its content (ONE vocabulary, PT\'s; `broken` out of every deed-kind list) folded into the pledge-verdicts cell'
NOTE[106]='its content (an invitation is an offer kind) folded into the `OFFER_KINDS` cell'
SUBS+= [
(145,"{ bodyId } (a court's bounty on a body —","{ bodyId } (BD's record id in `spatialLedgers.bodies.records`; a court's bounty on a body —"),
(123,"with `polityEnabled` dark the two polity roles are not offered","the one closed `backerRole` stands beside the plain `{kind, id}` actor-ref convention of fold §3.3.12, so the crown is never conflated with a liege; with `polityEnabled` dark the two polity roles are not offered"),
]
NOTE[74]='its content (one closed `backerRole` beside the plain `{kind, id}` convention; the crown never conflated with a liege) folded into the `backing` row; the three old qualifiers named only as dropped names (ALLOW-MISSING `polity: true`)'
NOTE[87]='its record cite (`spatialLedgers.bodies.records`) folded into the `need` comment of §2.2'
````

### `d03.py`

````python
# §3 THE DEED DOORS AND THE MARK (old lines 203-243)
SUBS+= [
(212,"mint as CORRECTIONS of the backed deed (`correctsRef`, RULINGS-ROUND2 A.4; §10.3).","mint as CORRECTIONS of the backed deed (`correctsRef`; §10.3)."),
(214,"**ONE ACT, ONE DEED** (RULINGS-ROUND1 PT-r1-3, SEAMS-r1-8): the party-impact door","**ONE ACT, ONE DEED.** The party-impact door"),
]
# the menace paragraph is made only of B132 + B133: both folded as its text
X[132]=" The twelve kinds hold no menace target, so a menace weakened or ended by the party mints a `party_event` deed of kind `menace_weakened` or `menace_ended` with target `{kind:'menace', id}` — read by RN as relief (`resolve_stressor`'s row, §3.3; `heroic` when it ends a menace that was at the walls). A menace never holds regard (MN6, RN §2.2)."
X[133]=" PT has no `DIRECT_MENACE`: the party's hand is MN's fourth dial `party` on `MENACE_MIGHT` (subject · might · hold · party) and `MENACE_STATE` (subject · act · name · party) — ≤ 4 dials, MN OD-MN-36 — and, because MN's verbs are realm-manifest AUTHOR acts staged then approved, the deed mints at the verb's EXECUTION in `worldPulse/realmVerbExecution.js` (663; one door call, +≈2), `causedBy` the verb's outcome id: `menace_weakened` when `MENACE_MIGHT` lowers the might, `menace_ended` at `MENACE_STATE end`; dark, the dial is refused with its reason (MN M43)."
NOTE[132]='its content folded as the text of "The menace broken by the party\'s hand" (the paragraph was this bracket and B133 alone)'
NOTE[133]='its content folded as the text of the same paragraph (MN\'s `party` dial; the deed at the verb\'s execution); "there is no `DIRECT_MENACE`" restated as "PT has no `DIRECT_MENACE`"'
# the bodies paragraph
SUBS+= [
(218,"(body · party — ≤ 4 dials; BD §11 as applied in BD's round 5)","(body · party — ≤ 4 dials; BD §11)"),
(218,"Because both are realm-manifest AUTHOR acts staged then approved,","The party's hand rides BD's own verbs as a dial, never a PT table verb, so one act and one undo (the proposal ring's) carry the body's end and the deed together — the menace precedent (MN OD-MN-36). Because both are realm-manifest AUTHOR acts staged then approved,"),
(218,"RN's deed target shape takes the body ref, ROUTED to RN;","RN's deed target shape takes the body ref, RN's to write;"),
(218,"the claim IS this one deed (RULINGS-ROUND5 B.5, \"no third deed\";","the claim IS this one deed (\"no third deed\";"),
(218,"read by nothing in the world — no town learns it,","read by nothing in the world — a deed is the party's act and travels as a tale, while a reveal is the DM telling the players, which no hearer in the world could hear: no town learns it,"),
(218,"whether that list admits a way's address is the host's (PLAUSIBLE; ROUTED as a HOST-ask).","whether that list admits a way's address is the host's (PLAUSIBLE; an open question to the host, §20)."),
]
NOTE[136]='its reason (a deed travels as a tale; a reveal is the DM telling the players) folded into the `party_made_known_trail` clause'
NOTE[137]='its content (the dial rides BD\'s verbs; one act and one undo; MN\'s precedent) folded as a sentence of the bodies paragraph'
# §3.3
SUBS+= [
(226,"**The institution deeds key on the TARGET's category** (RULINGS-ROUND1 PT-r1-2) — the landed","**The institution deeds key on the TARGET's category** — the landed"),
(236,"is genuinely target-dependent: AMBIGUOUS, `neutral` until the DM marks `moralWeight` or a row registers (concern 9f).",
 "is genuinely target-dependent: AMBIGUOUS, `neutral` until the DM marks `moralWeight` or a row registers (concern 9f). `IMPOSE_CULT` is among them: the landed composer's \"Cult\" event assigns or removes a CULT deity on a town, the faith ladder's small end (`eventComposer/EventComposerDeityField.jsx`, `DeityAssignmentPanel.jsx`) — \"not all cults are evil. cults are simply small conclaves of religion\" (the owner) — so it reads as `SET_PRIMARY_DEITY` does, the deed judged by what the hearer's lens two finds (whom it helped or hurt, the creed's own character), never the god (the deity doctrine)."),
(238,"a warmth, never a debt; RN's link between the court and the party,","a warmth, never a debt; the link rides RN's landed cause `heard_deed` at the refusal's mirror sign, so RN's closed `REGARD_CAUSES` gains no word; RN's link between the court and the party,"),
(238,"(ST's body holder `{ kind: 'body', id }`)","(ST's body holder `{ kind: 'body', id }`, its `bodyKind` a field)"),
(238,"each is a CORRECTION of the backed deed (`correctsRef`; RULINGS-ROUND2 A.4),","each is a CORRECTION of the backed deed (`correctsRef`),"),
(240,"and P4 asserts it (§17).","and P4 asserts it (§17). The rows are PT's registration rows, never new rows of the landed ripple map: every row of that map needs a party-impact KIND (`mapEventToPartyImpact`: `if (!spec) return null;`), no kind has an institution target, and the map's own header says institution events \"have no campaign-scale party-impact kind\" — so the orphanage reads as harm to the innocent and a slaver's house as relief without new capability in the pulse pipeline. \"Ambiguous\" means genuinely target-dependent, never \"unregistered\"."),
]
NOTE[140]='its content (why `IMPOSE_CULT` reads AMBIGUOUS; the owner\'s correction quoted verbatim) folded after the AMBIGUOUS list'
NOTE[142]='its content (`heard_deed` at the mirror sign; `REGARD_CAUSES` gains no word) folded into the `offer_accepted` clause'
NOTE[143]='its content (the untied holder is THE BODIES\' body ref, its `bodyKind` a field) folded into the `party_cleared_site` clause; `band` as an untied-holder kind is gone'
NOTE[148]='its content (built through PT\'s registration rows, never the landed ripple map, and why) folded after the REGISTRATION WALKER paragraph'
NOTE[149]='its content ("ambiguous" means genuinely target-dependent) folded as the last sentence of the same paragraph'
````

### `d04.py`

````python
# §4 PRESENCE, §5, §6 (old lines 247-265)
SUBS+= [
(249,"goes to the deed (RULINGS-ROUND2 B).","goes to the deed."),
(249,"**The map (HOST-REQUIREMENTS-2026-10-18):**","**The map (the host requirements):**"),
(249,"(EP's, cut before the first FP map piece; `briefs/RULINGS-P5.md` C.21: \"`WorldMap.jsx` is at 605/600 — the unit is the car\")","(EP's, cut before the first FP map piece — `WorldMap.jsx` is at 605/600, so the unit is the car)"),
(249,"PT its producer (the sites bracket below)","PT its producer (the sites paragraph below)"),
(251,"(RULINGS-ROUND3 B for RN: \"the deed target shape gains `siteId` (the party's cleared site is a target)\")","(RN's rule: \"the deed target shape gains `siteId` (the party's cleared site is a target)\")"),
(251,"(THE SITES' court-veil word; ST's caller list names no PT door for it),","(THE SITES' court-veil word; ST's caller list names no PT door for it — whether the deed should also be ONE act through PT's door, as the clearing is, is an open question, §20),"),
(251,"the very site RULINGS-ROUND4 A.16 keeps unvoiced (\"a kept-secret site's arrival emits NO news row\")","the very site THE SITES keep unvoiced (\"a kept-secret site's arrival emits NO news row\")"),
(257,"(`partyCredibilityOf`, RN §7's PERSISTED holder on PT's sub-ledger — RULINGS-ROUND2 A.1 — and per town","(`partyCredibilityOf`, RN §7's PERSISTED holder on PT's sub-ledger, and per town"),
(265,"and the undo does NOT reverse the impact's outcomes — OD-PT-28, ACCEPTED by the chair (RULINGS-ROUND2b: \"undo strikes the deed; the world effects stay, as on master\").","and the undo does NOT reverse the impact's outcomes (OD-PT-28: \"undo strikes the deed; the world effects stay, as on master\")."),
]
NOTE[161]='its open item (whether the reveal is also ONE act through PT\'s door) folded into item (2) as an open question pointing to §20; its `RECORD_CLEARING` naming already in the text'
SUBS+= [
(251,"**Sites considered**: when THE SITES lands","**Sites considered** (THE SITES, `DESIGN_FP_ARCH_ST.md`; PT's coverage: presence at a site, the reach and reveal doors, the clearing deeds): when THE SITES lands"),
]
NOTE[158]='its content (THE SITES\' coverage row for PT; the volume path) folded into the paragraph\'s lead'
````

### `d05.py`

````python
# §7 THE ENGAGEMENT PASS (old lines 269-301)
X[171]=" — CH's leaf takes `graph` (`gateDefault({ worldState, snapshot, graph, actorRef, settlementId, tick })`, CH §2.2, §11) because its pair-label read needs the truth type only the graph supplies (`relationshipTypeBetween(graph, …)`), and the stage already holds the binding, so it costs zero host lines"
NOTE[171]='its content (why the pass takes `regionalGraph`; zero host lines) folded as a clause of §7.1\'s first sentence'
SUBS+= [
(272,"— REGISTERED on RN's ONE PERSON STAGE (RULINGS-AFTER-COMPILE RN-S1; fold §3.1.22):","— REGISTERED on RN's ONE PERSON STAGE (fold §3.1.22):"),
(275,"never a second table here (RULINGS-ROUND5 B.15: \"The call's own domain governs:","never a second table here (\"The call's own domain governs:"),
]
X[176]=" The bounty's payment is the posting court's treasury row (BD's), and what the party gains is the DM's at the table — the engine pays the party nothing."
NOTE[176]='its content (the payment is BD\'s treasury row; the engine pays the party nothing) folded as a sentence of §7.2'
# the two P6c brackets of old lines 277-278: one paragraph, the widened parenthesis (B179) folded into B178's
X[178]="**THE CALL BOARD's `captive_held` rows are NEVER READ HERE.** THE OPPORTUNITY adds to CH's call board (CH §14) a `captive_held` source row — domain `order`, the HELP call keyed to the CAPTIVE'S HOME (minted only from a record that ARRIVED there: a roads ransom asked, WR-7d's arrived demand, or a telling that arrived — RN's `heardAt` test) and its `harm` twin at the venue town (minted from the jailer's own hold record) — and BOTH ARE EXCLUDED FROM THIS READ: no `party_request` is ever minted from a `captive_held` call (OP13: the call is a champion's, keyed home; a rescue is the paragons' and the travellers' opportunity, never the engine's request to the party — the world hosts the campaign, never competes with it). PT's `need` list (§7.3) therefore takes no `captive_held` form; a captive the DM wants the party to free is the DM's own hook. NO deed or telling SOURCE KIND is minted for a capture: a capture told on the rumor road reaches the captive's home through RN's EXISTING telling idiom (`heardAt`, RN §4.3) and is a lawful road for the home call (OP §9's `toldBy.road: 'telling'`; CH §14's `captive_held` row), and whichever road carried the hold home, the `captive_held` rows stay excluded from this read. Nothing else of OP's touches the party (OP §15 PT: a false word about the party is heard only on `party_slander`; OP's carried bluff is about its sender)."
NOTE[178]='its content folded as a paragraph of §7.2 in the design\'s voice ("CONFIRMED:" and the bracket-lane parenthesis "(CH\'s bracket by lane B)" dropped; "OP13 restated" → "OP13"); B179\'s widened parenthesis folded into it'
NOTE[179]='its content (the THIRD road — a telling that arrived, RN\'s `heardAt`; no new deed or telling source kind for a capture) folded into B178\'s paragraph'
LINE[278]=None
# the ↳ row (old line 284) folded into its parent row (old line 283)
LINE[284]=None
SUBS+= [
(283,"· else `{ callSource }` (no clock; §8.2) |","· else `{ callSource }` (no clock; §8.2); never from a `captive_held` call (CH §14's OP row, excluded from this read — §7.2) |"),
(294,"| a paragon — a person, or a CORPS","| a paragon — never an ordinary person, who never travels on its own (RN §5.4) — a person, or a CORPS"),
(297,"(`powerStructure.previousGovernments` and `seatTransitions`; RULINGS-ROUND1 ADDENDUM) — once per backed deed |","(`powerStructure.previousGovernments` and `seatTransitions`) — once per backed deed; a DM KILL or ASSIGN moves neither tail, and under the tick form the DM's own tick-less `CHANGE_RULING_POWER` counts only behind a later stamped row (PL §2), so each such card offers \"ask the new ruler about the party's backing\" |"),
(299,"or whose `yes` is judged `fell_short` at its `party_pledge_due` (§8.6; R-P5-5) — mints","or whose `yes` is judged `fell_short` at its `party_pledge_due` (§8.6) — mints"),
(299,"and never on the voicing court's own commons (RULINGS-ROUND4 A.15) — PT computes none of it.","and never on the voicing court's own commons — PT computes none of it."),
]
NOTE[195]='its content (the ordinary person\'s visit is gone — ordinary persons never travel on their own, RN §5.4) folded into the `party_visit` row'
NOTE[199]='its content (a DM KILL/ASSIGN moves neither tail; the card offers "ask the new ruler about the party\'s backing") folded into the `backing_repudiated` row'
NOTE[200]='its content (under the tick form the tick-less `CHANGE_RULING_POWER` counts only behind a later stamped row; the same card) folded into the `backing_repudiated` row'
````

### `d06.py`

````python
# §8 THE CLOCKS (old lines 305-326)
X[206]="\nA stressor carries no forward end date (`normalizeStressor`: `severity`, `age`, `durationPolicy`, `decayRate`, `status`), and a computed end date would be a forecast; the clock is therefore read from the need itself, never authored and never forecast:"
NOTE[206]='its content folded as the lead sentence of §8.2 under its heading'
SUBS+= [
(313,"(`needPlaceOf`, §2.3; truth, the record PT §9.2's body half reads: the fairness rule RESOLVES what was physically possible, CHAIR-NOTES 18 (d)'s physics side, and reads no court's belief)","(`needPlaceOf`, §2.3; truth, the record §9.2's body half reads: the fairness rule RESOLVES what was physically possible — its physics side — and reads no court's belief)"),
]
X[213]="\nThe party travels as named persons do: each leg is `namedPersonTransit.js :: namedPersonLegTicks({ nominalWeeks: hopWeeks(digest, a, b, season) })` on a canonized map and `UNPRICED_LEG_WEEKS` (one week) a hop over the relationship graph without one — so reachability is computed in every world, aspatial included."
NOTE[213]='its content (the per-leg physics, research\'s `hopWeeks` alone widened to the named-person legs) folded as the lead sentence of §8.3 under its heading'
SUBS+= [
(318,"; the canon is geography, never the simulator's paid gate (the chair's host ruling, HOST-r1-2).","; the canon is geography, never the simulator's paid gate (§0's host ruling)."),
]
X[218]="\nThe pledge keeps ONE integer, never a bit that needs the clock's end tick (which a threshold clock does not know until it ends): each week, `earliestArrivalTick = min(earliestArrivalTick, tick + journeyWeeks(where the party stood that week → the need's place that week))`, the place `needPlaceOf(worldState, engagement, tick)` (§2.3; the nearer of its settlements) — fixed for a stressor, a siege or a war, the body's own `where` for a hunt, the actor's own town for a deadline. When the clock ends at `T`, the pledge was REACHABLE iff `earliestArrivalTick ≤ T` — \"the fastest journey through the world as it unfolded\", with no replay and no forecast."
NOTE[218]='its content (the fault fold, the formula, the reachability test) folded as the lead paragraph of §8.4 under its heading; R2 R-16\'s one bit `reachableAtSomeWeek` named only as what the integer replaces is dropped (ALLOW-MISSING); the deadline\'s place added from §2.3\'s DEADLINE arm (B094, the latest) so the list of places is complete'
SUBS+= [
(320,"**PT-S1 — RULED (RULINGS-AFTER-COMPILE: slot C7):** a road closed","**A ROAD CLOSED (PT-S1, slot C7):** a road closed"),
(323,"— read through `partyEmployerOf` (§2.3), never a second record","— read through `partyEmployerOf` (§2.3), never a second record: an employment's DEADLINE is its term of service, so the ONE pledged record carries the yes, the place the party reports to and the employment's life, and no employment shape is persisted"),
]
NOTE[221]='its content (the deadline is the term of service; one pledged record; no persisted employment shape) folded into the `yes` sentence of §8.5'
````

### `d07.py`

````python
# THE NEW HEADER, THE READER'S GUIDE and the dispatch-gate lines (replacing old lines 1-9)
HEAD = r'''# DESIGN_FP_ARCH_PT — THE PARTY: the world's one outside actor, put first in the DM's view without the world revolving around it

## Compiled on the owner's word of 2026-10-17 in the FP final architecture program (kit `settlement-engine-kits/fp-final-a73343ed-2026-10-17/`); DARK behind three virtual flags (`partyEnabled`, `partyEngagementsEnabled`, `partyBackingEnabled`) and their host flags (§14); nothing scheduled.
## CONSOLIDATED 2026-10-23 from the bracketed text of record at `1beabdc85` — the review trail is in git and in `settlement-engine-kits/fp-final-a73343ed-2026-10-17/history/PT-cure-record.md`; the compile log and its measurements (taken at master `81f1cd963`) are the kit's `cure/L-PT.md` (probes `cure/L-PT-probe/`).
## Bound by the FP constitution's requirements 1–24 (`DESIGN_FP_SPINE.md` §1; 15–24's text of record is `DESIGN_FP_COHERENCE_FOLD.md` §1) and by the coherence fold. The OWNER's shapes and rows are marked ⭐; every ruling is vetoable (§18).

---

## THE READER'S GUIDE

1. WHAT THIS IS. The party is the world's one outside actor: the engine never moves, captures, jails or harms it, and its choices enter the world only as DEEDS the DM records with zero-click marks (PT1, PT2, §3). Word of each deed travels as a tale RN owns; the actors who hear and care come for the party, each act a hearing in its week whose default is that nothing has happened to the party yet (PT5, PT6, §7); a promise is judged against the world as it unfolded (§8), a sanction is one backing mark with a reach (§10), and the DM's window puts the party first (§12).
2. ITS ONE OWNER. This volume owns the party sub-ledger `spatialLedgers.party` and its one writer `src/domain/party/partyLedger.js`; the party's fields on RN's deed (`backing`, `moralWeight`, `proof`, `actAt`, `witnessIds`, `partySeq`); the `party` arm of the ban's edge key; the engagement shape, the fifteen `PARTY_ENGAGEMENT_KINDS` and their verdict words; the pledge and its verdicts; and the rows its deed kinds register into RN's value table (§3.3).
3. WHAT IT READS. BELIEF for every actor's choice toward the party: RN's `fameIn` and `regardOf` from the actor's town, the party's whereabouts as each actor heard it, the party's word per town (`partyCredibilityAt`). TRUTH only for the party's own deed ledger as a pledge's evidence, the need's own state and place (`needPlaceOf`) and the world's physics of the journey (§7.1, §8).
4. WHAT IT WRITES, one writer each: the sub-ledger through `partyLedger.js`; deeds only through RN's `mintDeed` / `strikeDeed` (§3.1, §3.4); the party's ban edges through the landed `addExclusionEdge` / `liftExclusionEdges` (§2.1 shape 3); a cleared site only through ST's `siteLedger.js :: applySiteEvent` (§4); a hearing's outcome only by the resolver reading the HEARING SEAL (PT7).
5. WHERE IT MOUNTS. Its engagement pass REGISTERS last on RN's ONE PERSON STAGE in `envoyPulse.js :: advanceEnvoyDiplomacyPulse` (§7.1); its deed doors are `partyImpact.js :: applyPartyImpact`, the composer's `store/settlementLifecycleHelpers.js` and `store/campaignPulseHelpers.js :: drainCampaignQueueIntoState` (§3.1); the party's hand on a menace or a body mints at `worldPulse/realmVerbExecution.js`; the source event's undo rides the leaf-first car `store/settlementLifecycleHelpers.js :: reconcileWorldOnUndo`, which SHRINKS `store/settlementSlice.js` (§3.4); zero lines in `pulseKernel.js`, `applyWorldPulse.js` and `warTermination.js` (PT16).
6. FLAGS: `partyEnabled` · `partyEngagementsEnabled` · `partyBackingEnabled` (§14), all premium. HEARING KINDS: `party_request` · `party_offer` · `party_summons` · `party_warrant` · `party_bounty` · `party_hunted` · `party_ambush` · `party_slander` · `party_gate` · `party_banned` · `party_pledge_due` · `party_visit` · `party_voiced` · `backing_voided` · `backing_repudiated` (§13). CHAIN: C13 THE PARTY in the fold's §6, after C11 THE RENOWN, its head ONE UNIT with RN-0; waves PT-0 to PT-7 with PT-6b (§15).
7. DEPENDS ON: THE RENOWN (`DESIGN_FP_ARCH_RN.md`: the deed ledger, fame, regard, credibility, inherent value and the two lenses — cited, never re-specified), THE CHAMPIONS (`DESIGN_FP_ARCH_CH.md`: the call board, the champion's visit, the one town's-gate leaf `gateDefault` and the one ban), THE POLITY (`DESIGN_FP_ARCH_PL.md`: the crown's reach and the seat-change read), SP-9 THE HEARING WEEK, MN and BD (the `party` dials; a body's `where`), ST (the site record), PR (the riders on the road), IN (the plant road), OP (the `captive_held` rows it never reads) and the host map (H12 · H15 · H17 · H22; ENC-HS-01). READ BY: RN (`partyOf`, the credibility holder, the registered value rows), CH (`met_in_person` sets `marks.metParty`), ST (PT's clearing door in its caller list), the host (the H17 piece; `waysKnown` offered to its reveal) and the DOSSIER (the party's `name`).
8. THE WORDS NOT TO CONFUSE: `party` the adventuring party (`{kind:'party'}`) versus `partyId(s)`, a party TO a war or treaty; "sanction" (prose) versus the landed `sanctioned` — code says `backing`; `told` (IN's lie outcome) versus PT's `spoken`; and "the town's gate", never the bare word (§2.4's homonyms).

**The dispatch gate is the owner's:** nothing here builds before the UI + prose release is pushed and deployed; push · merge · deploy · migration · dispatch stay the owner's.

---
'''
````

### `d08.py`

````python
# THE LATEST RULING APPLIED GLOBALLY (P5 C.7, the employer arm of PT2's backing default) to two passages its brackets never reached
SUBS+= [
(22,"pre-filled only when the party is doing the work of a request it accepted;","pre-filled only when the party is doing the work of a request it accepted or acting inside the reach of a court that employs it;"),
(123,"| pre-selected only by PT2's accepted-request arm, else absent |","| pre-selected only by PT2's two authorization arms — an accepted request's, else a standing employment's (§3.2) — else absent |"),
]
# SEAT 1 CONTINUED (after the container restart): three fidelity fixes to the earlier seat's complete sections
SUBS+= [
# §0 binding prior words: the ruling-file list restated by content had dropped PT-r1-1 (the one whereabouts read) and compressed RULINGS-AFTER-RESEARCH §1/§4/§5/§7 to two of its PT rulings
(54,"as amended after the research (the one ban widened to actor refs; the words of §2.4) and after the compile (PT-S1 and PT-S2 given their slots; THE ONE PERSON STAGE), the institution deeds keyed on the target,",
 "as amended after the research (the one person substrate, the world-NPC ledger; the carriers — the one ban widened to actor refs, the actor-ref convention; the deed record, the story's fixed order of loss, the party's credibility holder and the words of §2.4; what each tier line says) and after the compile (PT-S1 and PT-S2 given their slots; THE ONE PERSON STAGE), the one whereabouts read `whereaboutsOf`, the institution deeds keyed on the target,"),
# §6: a cross-reference still named the removed bracket
(263,"one act, one undo; §4's sites bracket)","one act, one undo; §4's sites paragraph)"),
# §7.2: B179's "NO NEW deed or telling SOURCE KIND" had lost its NEW (no new source kind is minted; the capture still travels as a telling)
(277,"NO deed or telling SOURCE KIND is minted for a capture:","NO NEW deed or telling SOURCE KIND is minted for a capture:"),
]
````

### `d09.py`

````python
# SEAT 2 — §9 THE NET EFFECT, THE TOWN'S GATE AND THE BAN (old lines 330-345)
# 9.1 (old line 333): B229, B230 change notes; the text carries both cures. No other change.
# 9.2 (old line 336): B231 (RU-1, the `graph` argument) change note; B232/B233 stamps; B234/B235 the backer-of-record cure and its refinement (the text carries both; the refinement is listed in §20);
#     B236/B237 the one belief read (the text carries it; its executed receipt stands in P49); B238 the posture-last-heard cure (text carries it); B239 change note.
SUBS+= [
(336,"and PT never re-reads what it reads (CHAIR-NOTES 18 (d)'s one corpus law):","and PT never re-reads what it reads (the one corpus law):"),
(336,"and this reason reads it: plague-R7's slot, chair notes item 11)","and this reason reads it: plague-R7's slot)"),
]
# THE ROAD ARM (old line 338): B240's ruling folded as the paragraph's lead clause (the widening, no new kind, CH's words, PR §8.2's trigger, CH's person arm); B241 (A.14) change note; B242 stamp.
X[240]=" — `party_gate` widened to a road WHERE: no new kind, CH's words unchanged, \"fired by a patrolled traversal of the DM's own move\" (PR §8.2); CH gives persons the same road arm (`person_at_the_gate` at `road{a, b}`, CH §18)"
NOTE[240]="its ruling (the gate widened to a road WHERE, no new kind, CH's words unchanged; PR §8.2's trigger; CH's person arm) folded as the lead clause of §9.2's THE ROAD ARM; the ruling-file tags and finding ids dropped"
# THE ROAD ARM'S BODY HALF (old line 340): B243 change note (BD's route to PT; the text carries it).
SUBS+= [
(340,"no court's belief is read — CHAIR-NOTES 18 (d)). The first such half","no court's belief is read). The first such half"),
]
# 9.3 (old line 343): B244 (m3) change note; B245 (the windowed lapse, PT-V1) change note — its executed receipt `windowedLapse.out` stands in P46/P47;
#     B246 (CH adopts PT's three clauses for its own keys): its content folded as one sentence after the cure's rule (CONFIRMED in CH's text of record at 1beabdc85: "so the person's and the party's `banKeys` keep ONE ban and ONE lift rule");
#     B247 (m4: PT's `banKeys` hold SEAT-EPISODE keys, a departure from the one ban-episode form's letter) folded as a clause; B248 (R2b-1) change note; B249 change note.
X[246]=" CH §11 keeps the same lift rule for a paragon's own keys — the cap counts windowed keys only, one key per door, an indefinite door's key inert — so the person's and the party's keys keep ONE ban and ONE lift rule."
NOTE[246]="its content (CH adopts PT's three clauses for its own keys, so the two records keep one lift rule) folded as a sentence of §9.3; CONFIRMED in CH's text of record (history/CH-bracketed-1beabdc85.md, CH §11: \"so the person's and the party's `banKeys` keep ONE ban and ONE lift rule\")"
X[247]=" `banKeys` holds SEAT-EPISODE keys — never the one ban-episode form `polity_ban:<subjectKey>:<banTick>`: a seat episode and a ban episode are two facts (§2.4's homonym row)."
NOTE[247]="its content (PT's `banKeys` hold seat-episode keys, a departure from the letter of the one ban-episode form; two facts) folded as a sentence of §9.3; the departure listed among §20's refinements"
SUBS+= [
(343,"over both landed tails (`previousGovernments` and `seatTransitions`; RULINGS-ROUND1 ADDENDUM):","over both landed tails (`previousGovernments` and `seatTransitions`):"),
(343,"so its card offers \"lift this court's bans on the party\" (PL's STOP-2 precedent, as CH §11).","so its card offers \"lift this court's bans on the party\" (PL's precedent, as CH §11)."),
(343,"TIER: `npcConsequencesEnabled` (R-PT-12).","TIER: `npcConsequencesEnabled`."),
]
````

### `d10.py`

````python
# SEAT 2 — §10 SANCTION, §11 THE STORY'S MUTATION, §12 THE PARTY'S VIEW (old lines 347-390)
# 10.1 (old line 358): B250 change note.
# 10.2 (old line 361): B251 (the IN exposure clause withdrawn) and B252 change notes; the text carries both. The round label of RN §6.1's withdrawn row restated as the design's statement.
SUBS+= [
(361,"RN's value rows carry no backing shift (RN §6.1 struck `remove_npc`'s \"0.6 inside a backing's reach\" in round 1).","RN's value rows carry no backing shift (RN §6.1's `remove_npc` row included: it carries no \"0.6 inside a backing's reach\")."),
]
# 10.3 (old line 364): B253 (the void's pair label through belief; the repudiation's `via`) change note — the text carries the ruling and its executed receipt (`p5Probe.out` B) stands in P34;
#     B254 (R-P5-9's four readings) — the text carries all four; listed among §20's refinements; B255, B256 change notes.
SUBS+= [
(364,"CH's one belief read of a pair (RULINGS-ROUND4 A.8's form), the `graph`","CH's one belief read of a pair, the `graph`"),
(364,"A void or a repudiation is a CORRECTION of the backed deed (RULINGS-ROUND2 A.4):","A void or a repudiation is a CORRECTION of the backed deed:"),
]
# 11.1 (old lines 376-377): B257 (RN's key, RN writes it) change note; B258 (the swelling claim withdrawn; no deed-only draw) change note — the alternative stands in §20's open questions.
SUBS+= [
(376,"a changed doer moves the deed's ONE term to the new subject (RULINGS-ROUND3 B for RN, RN-V2 — \"the same gap applies to a corrected `doerRef` (PT-4's swap)\") |","a changed doer moves the deed's ONE term to the new subject (RN's heard pass: \"the same gap applies to a corrected `doerRef` (PT-4's swap)\") |"),
]
# 11.2 (old line 380): B259, B260 change notes.
# 11.3 (old line 383): B261, B262 change notes (P36's executed receipt `lensOneProbe.out` stands in the text).
SUBS+= [
(383,"THE RULE (RULINGS-ROUND2 A.2 — RN §6.1's law, scoped by PT's visibility):","THE RULE (RN §6.1's law, scoped by PT's visibility):"),
]
# §12 (old line 388): B263-B266 stamps.
````

### `d11.py`

````python
# SEAT 2 — §13 THE HEARINGS, §14 THE FLAGS AND THE HOSTS (old lines 391-424)
# The anchor and the place (old line 393): B267 stamp; B268 (A.14: the stretch key, was `a␟b`) change note — the superseded name is allow-listed by seat 1;
#     B269 (R2b-5, PT's road read as PR's ONE STRETCH KEY) — the text carries it; listed among §20's refinements; B270, B271 change notes.
SUBS+= [
(393,"HR:656; the chair's host ruling 3, a WHERE kind on every registry row)","HR:656; the host ruling's third item, a WHERE kind on every registry row)"),
(393,"cut at the digest gate — PR §2.2; the fold's WHERE companion adopts it at P4)","cut at the digest gate — PR §2.2; the fold's WHERE companion adopts it)"),
(393,"when THE SITES lands (§4's sites bracket);","when THE SITES lands (§4's sites paragraph);"),
]
# Patrols considered (old line 395): B272's source cite folded as the heading's parenthesis (THE PATROLS' laws and rulings the paragraph rests on); B273 (STOP-PR-2's ruling; the stale line) change note; B274 (m1, the warrant never on a road) change note.
X[272]=" (THE PATROLS, `DESIGN_FP_ARCH_PR.md`: PR8, PR19, PR §9.3, OD-PR-14/16)"
NOTE[272]="its source cite (THE PATROLS' PR8, PR19, §9.3, OD-PR-14/16) folded as the heading's parenthesis; the ruling tag and the brief's item numbers dropped"
SUBS+= [
(395,"and H16 — the map's INBOUND door, which the host never consumes — stays untouched (RULINGS-ROUND2b HOST-r2-5).","and H16 — the map's INBOUND door, which the host never consumes — stays untouched."),
]
# the kinds table (old lines 399-407): B275-B277 stamps; ruling tags removed.
SUBS+= [
(406,"the week RN's crossing occurs (a court's, a person's or a company's — A.11)","the week RN's crossing occurs (a court's, a person's or a company's)"),
(406,"the DM may withhold it (no trace) or amend it (the chair's ruling, SEAMS-r1-6) |","the DM may withhold it (no trace) or amend it |"),
]
# old line 409: B278 (R-PT-7, the one-moment acts CLIMAX) — the table carries it; listed among §20's refinements; B279 change note.
SUBS+= [
(409,"**Long advances:** month, season, year and N-year advances (chair notes item 1) run every party hearing","**Long advances:** month, season, year and N-year advances run every party hearing"),
]
# §14 (old lines 417-423): B280-B282 stamps; B283 change note; B284 (R-PT-2, the flag's name) — the flag table carries `partyBackingEnabled`; the brief's name stands in §2.4/§18; listed among §20's refinements; B285, B286, B288 stamps; B287 change note.
SUBS+= [
(418,"a court's voice needs neither — A.11)","a court's voice needs neither)"),
(421,"(\"canonized ≠ premium\", the chair's host ruling)","(\"canonized ≠ premium\", the host ruling)"),
(423,"`cure/L-PT-probe/effLines.out`, round 1 `cure/D-PT-r1-probe/effLines-r1.out`):**","`cure/L-PT-probe/effLines.out` and `cure/D-PT-r1-probe/effLines-r1.out`):**"),
(423,"(eighteen data rows and their pools — `deed_acceptance` added)","(eighteen data rows and their pools, `deed_acceptance` among them)"),
(423,"`engagementKinds.js` (incl. `partyEmployerOf`, P5), `needClock.js` (incl. `needPlaceOf`'s DEADLINE arm, P5),","`engagementKinds.js` (incl. `partyEmployerOf`), `needClock.js` (incl. `needPlaceOf`'s DEADLINE arm),"),
]
````

### `d12.py`

````python
# SEAT 2 — §15 THE WAVES, §16 THE LIFECYCLE (old lines 427-467)
# old line 429: B289, B290 change notes; the phase label, the chair-notes and ruling tags removed; the fold's ownership of its chain rows restated.
SUBS+= [
(429,"A coherence chain **C13 · THE PARTY** (fold §6, at P4), after C11 THE RENOWN (it reads RN) and beside C12 (chair notes item 6).","A coherence chain **C13 · THE PARTY** (fold §6), after C11 THE RENOWN (it reads RN) and beside C12."),
(429,"RN-3 carries NO lighting gate on the owner's alignment answers (RULINGS-ROUND2 B for RN, HOST-r1-7: H30 is the defects' slot),","RN-3 carries NO lighting gate on the owner's alignment answers (H30 is the defects' slot),"),
(429,"RN §13 carries the same sentence; the fold §6's C11/C13 rows are the chair's.","RN §13 carries the same sentence; the C11/C13 rows are the fold's (§6)."),
]
# the waves table (old lines 433-441): B291-B296 stamps; tags removed.
SUBS+= [
(438,"(a court's voice: `renownLeansEnabled` alone, A.11)","(a court's voice: `renownLeansEnabled` alone)"),
(440,"a THRESHOLD clock priced each week to the body's `where` — r5, PT-X1);","a THRESHOLD clock priced each week to the body's `where`);"),
]
# EDITOR (old line 443): B297's content (no PT kind has a menace actor; the party's hand on a menace is a deed) folded as a clause; B298-B301 stamps.
X[297]=" — no PT kind has a menace actor (the party's hand on a menace is a deed, §3.1)"
NOTE[297]="its content (no PT kind has a menace actor; the party's hand on a menace is a deed, §3.1) folded as a clause of the EDITOR line's counterparty"
SUBS+= [
(443,"a real record of BD's ledger on the `subject` dial (A.12's sixth kind; BD15)","a real record of BD's ledger on the `subject` dial (the actor convention's sixth kind; BD15)"),
(443,"PT-4 READ (a seen mark replaces the act's kindness in lens one — RULINGS-ROUND2 A.2);","PT-4 READ (a seen mark replaces the act's kindness in lens one);"),
(443,"every void or repudiation its backed deed (`correctsRef`, A.4);","every void or repudiation its backed deed (`correctsRef`);"),
]
# PT-7 (old line 445)
SUBS+= [
(445,"the push budget (chair notes item 2: party lines are beats inside the envelope);","the push budget (party lines are beats inside the envelope);"),
]
# §16 (old lines 453-466): B302-B307 stamps; B308-B311 change notes.
SUBS+= [
(455,"`credibility` IS stored (RN §7's holder, A.1),","`credibility` IS stored (RN §7's holder),"),
(455,"`banKeys` (with each key's `untilTick`, R4-1) stored,","`banKeys` (with each key's `untilTick`) stored,"),
(457,"never \"lifts the edges it wrote\" (§6; A.19) |","never \"lifts the edges it wrote\" (§6) |"),
(464,"≤ 6 open engagements (one `bounty` band on a bounty, P5),","≤ 6 open engagements (one `bounty` band on a bounty),"),
]
````

### `d13.py`

````python
# SEAT 2 — §17 THE SCENARIO MATRIX (old lines 470-540)
# P14 (old line 488): B312 stamp. P34 (old line 508): B313 change note (the paramount's regard of the backer could never fire; the row asserts the pair label through belief).
# P36 (old line 510): the round label restated by what the withdrawn formula did (B262: a mark that also moved `law01` and `force01` read +0.23, approval).
SUBS+= [
(510,"— never round 1's +0.23 approval |","— never the +0.23 approval of a mark that also moved `law01` and `force01` |"),
(512,"credibility never scales a told reason (A.2; RN §7);","credibility never scales a told reason (RN §7);"),
(515,"the party clears a gang (THE BODIES' body holder, A.3) from a ruin (ST's S8)","the party clears a gang (THE BODIES' body holder) from a ruin (ST's S8)"),
(516,"the undo receipt says so (OD-PT-28, ACCEPTED — RULINGS-ROUND2b) |","the undo receipt says so (OD-PT-28) |"),
]
# P46-P62 (old lines 520-536): B314-B333 stamps; ruling tags removed; P50's round label restated by what the withdrawn inverse did (§16's undo row: never "lifts the edges it wrote").
SUBS+= [
(523,"the truth type only its fallback input (A.8): so with truth `rival`","the truth type only its fallback input: so with truth `rival`"),
(523,"no RN court-to-court regard is read (A.4); PT's call passes the stage's `regionalGraph` (RU-1) and re-reads nothing","no RN court-to-court regard is read; PT's call passes the stage's `regionalGraph` and re-reads nothing"),
(524,"the round-3 inverse re-run leaves `[]`, `gateReadAndUndo.rerun.out`)","an inverse that only lifts the edges it wrote, re-run, leaves `[]`, `gateReadAndUndo.rerun.out`)"),
(527,"ONE `body_ended` deed (the claim — no `hunt_won` beside it, B.5)","ONE `body_ended` deed (the claim — no `hunt_won` beside it)"),
(527,"books the party as known for `order`, never `faith` (B.15);","books the party as known for `order`, never `faith`;"),
(530,"until the site is `made_known` (A.16's veil, unbroken by the party's own deed) |","until the site is `made_known` (the kept secret's veil, unbroken by the party's own deed) |"),
(531,"(`causedBy` the summons; R-P5-5)","(`causedBy` the summons)"),
(531,"A1–A5: before the cure every case read `came_to_nothing`) |","A1–A5: without the DEADLINE arm every case read `came_to_nothing`) |"),
]
# old line 538: B334-B339 — the scenario-to-finding index of every round (change notes and stamps); the line is removed (the index is in the cure record).
LINE[538]=None
for i in range(334,340): NOTE[i]='the scenario-to-finding index of a round (a change note or stamp) on old line 538, removed with the line; the scenarios stand in final form and the index stays in the text of record and the cure record'
````

### `d14.py`

````python
# SEAT 2 — §18 THE RULINGS (old lines 542-581), rewritten in final form (CONSOLIDATE §2 item 8): each ruling's final text; a "Ruled" column
# (first ruled · amended dates · by delegation · vetoable — the dates from the snapshots b33d9174d (OD-PT-1..17), a399c5956 (..26), 8a3061070 (..33) and
# the brackets' own dates); ⭐ on the rows whose question is the OWNER's own words (the old text's "THE OWNER'S"); ruling-file tags, finding ids,
# refinement ids and "the chair" removed; seat 1's two corrections applied (OD-PT-2: PT2's two authorization arms; OD-PT-30: "§4's sites paragraph").
R18 ="""## §18 THE RULINGS (by delegation under the owner's words of 2026-10-16, 2026-10-17 and 2026-10-20; every row vetoable; ⭐ marks a row whose question is the OWNER's own words, VISIBLE)

| Row | Question | Ruling | Ruled |
|---|---|---|---|
| ⭐ OD-PT-1 | the outside actor (THE OWNER'S: "Everything with the party is a hearing nothing is ever decided for them") | PT1, PT6; the party's exclusion edges are the research rulings' ruled departure from R3-11 (the one ban widened to actor refs) | 2026-10-17 · amended 2026-10-18 · by delegation · vetoable |
| ⭐ OD-PT-2 | the mark (THE OWNER'S "check box"; "made on the spot") | one pass on the act, zero-click defaults, batched suggestions (PT2); the backing default is pre-filled only under PT2's two authorization arms — an accepted request's, else a standing employment's (§3.2; OD-PT-34) — and a friendly town's regard pre-selects nothing (P14) | 2026-10-17 · amended 2026-10-18 and 2026-10-20 (the employer arm, OD-PT-34) · by delegation · vetoable |
| ⭐ OD-PT-3 | presence (THE OWNER'S "party is in this settlement button") | the DM's toggle; `lastHeard` derived from the deeds; ONE read `whereaboutsOf` — the LATER STAMP (tick, `partySeq`), the deed on a same-tick tie no sequence settles (PT3) | 2026-10-17 · amended 2026-10-18 · by delegation · vetoable |
| OD-PT-4 | the sub-ledger (a persisted shape) | `spatialLedgers.party`, §2.1 shape 1; `lastHeard` derived; `credibility` PERSISTED (RN §7's holder), re-folded after a strike; `partySeq`; `presentAt.fromIds` and `banKeys`; `waysKnown` (the ways the DM revealed to the party, one row per way); a `party_bounty` engagement's `bounty: { band }` — ⭐ A DECLARED SUB-FIELD, THE OWNER'S SHAPE, VISIBLE (one `FUNDING_BANDS` word set once at the bounty's mint, dropped with the engagement; the VISIBLE row of ODQ §934.93's P5 addendum); `closedRecent`'s `party_gate` rows keep the posture heard as `how` (no new field) | 2026-10-17 · amended 2026-10-18, 2026-10-19 and 2026-10-20 · by delegation · vetoable; the `bounty` sub-field ⭐ the OWNER's shape |
| OD-PT-5 | the deed's party fields (a persisted shape) | §2.1 shape 2; `proof: unspoken · spoken · shown`; `backerRole`, `actAt`, `partySeq`; the void links by RN's `correctsRef` | 2026-10-17 · amended 2026-10-18 · by delegation · vetoable |
| OD-PT-6 | the party ban (a persisted shape change, W-H1's edge key) | §2.1 shape 3 under the key `party`, `npcConsequencesEnabled`; PT's own `BAN_PARTY` / `PARDON_PARTY`; the widening's key grammar carries a corps' `u:<unitKey>` (CH writes its edges); a court's own pardon reads `banKeys` in PL's exact key form and lapses ONLY a still-windowed edge — an indefinite edge is the DM's, lifted only by `PARDON_PARTY`; the cap counts windowed keys only · `BAN_PARTY`'s inverse RESTORES each touched door's prior edge, never "lifts the edges it wrote"; `PARDON_PARTY`'s inverse re-writes the lifted edges and `banKeys` rows; each key carries its court's window (`untilTick`) so a later verdict survives the DM's undo | 2026-10-17 · amended 2026-10-18 · by delegation · vetoable |
| ⭐ OD-PT-7 | engagements (THE OWNER'S "accepted, rejected, or deferred") | one shape, `seeking · awaiting · pledged`; two answers never merged (PT7, PT8); the DM's outside answer rides the hearing seal | 2026-10-17 · amended 2026-10-18 · by delegation · vetoable |
| ⭐ OD-PT-8 | silence (THE OWNER'S) | PT9 | 2026-10-17 · by delegation · vetoable |
| ⭐ OD-PT-9 | request clocks and fault (THE OWNER'S) | threshold/deadline from the need, every call source typed (§8.2); `earliestArrivalTick`; a reachable miss counts; the world's evidence decides a kept pledge first, counting presence only after the answer's week (§8.6); a destroyed need's town ends the clock; a DEADLINE's place is the actor's own town (`needPlaceOf`'s DEADLINE arm), so a yes to a summons, an invitation or an offer is judged by the same rule; a summons whose yes fell short escalates as an unanswered one | 2026-10-17 · amended 2026-10-18 and 2026-10-20 · by delegation · vetoable |
| OD-PT-10 | the registry rows | fifteen kinds, §13 (the CLIMAX kinds, three counterforce kinds, `party_voiced`), each with its WHERE and its TILT; `party_gate` gains its ROAD ARM, no new kind (OD-PT-32), and the road arm its BODY HALF with a meeting's words `passed · reaches_party · struck` (OD-PT-33) | 2026-10-17 · amended 2026-10-18 · by delegation · vetoable |
| ⭐ OD-PT-11 | sanction (THE OWNER'S ladder) | §10; one carrier; never expires on its own; void and repudiation are hearings with triggers; the void's default reads, for a court backer, the landed pair label THROUGH BELIEF (master's hostile set `rival · cold_war · hostile`), for a body backer RN's regard of that body, and the party arm; the repudiation's default reads `seatChangedSince`'s `via` (`transfer` repudiates, `seat` upholds) and the party arm | 2026-10-17 · amended 2026-10-18 and 2026-10-20 · by delegation · vetoable |
| OD-PT-12 | mutation | the landed thresholds; the size drift symmetric as landed; no new draw for non-deed events (§11) | 2026-10-17 · amended 2026-10-18 · by delegation · vetoable |
| OD-PT-13 | one party per campaign; bans yes; a sanction never expires (the brief §4 item 5) | PT15; §9.3; PT12 | 2026-10-17 · by delegation · vetoable |
| OD-PT-14 | the flags | three, `partyBackingEnabled` — never the brief's `partySanctionEnabled`, which would put the economic `sanctioned` word into code; all premium | 2026-10-17 · amended 2026-10-18 · by delegation · vetoable |
| OD-PT-15 | the host | PT registers its pass on RN's ONE PERSON STAGE, after CH (0 host lines) | 2026-10-17 · amended 2026-10-18 · by delegation · vetoable |
| OD-PT-16 | DRAFT constants: caps 6/2/3; cooldowns 8/4; pursuit formula; patience 26; request draw `0.2 × (rung + 1) / 4`, halved by a paragon at work; the domain table; the parts' thresholds 0.85/×0.9; the swap 0.04; the backing term ±0.25; the faction voice floor 25%; offer and summons terms; suggestions 3; the §3.3 value rows; the reason's band centres; the "later" draw by the party's word (0.25 · 0.5); the refusal's −0.1; the ambush's one-week reach; the void/repudiation regard thresholds; the void deed's `notable` significance; the acceptance's + 0.1; an employment's term of service; the hunted draw's odds by purse band | each UNMEASURED (requirement 18), on the FP-46 roster; the mover constants spectrum-relative (HR:51) | 2026-10-17 · amended 2026-10-18 and 2026-10-20 · by delegation · vetoable |
| OD-PT-17 | where PT sits | chain C13, after C11; ONE head unit RN-0 + PT-0; RN-2 and RN-3 before PT-1/PT-2 (RN-3 has no lighting gate) | 2026-10-17 · amended 2026-10-18 · by delegation · vetoable |
| OD-PT-18 | the inherent value of the party's composer deeds | PT registers rows into RN's table; the institution deeds key on the target's moral lean and the registry's kind (§3.3), built through PT's rows rather than the landed ripple map | 2026-10-18 · by delegation · vetoable |
| OD-PT-19 | one act, one deed | the `sourceEventRef` lookup plus the static skip of rippling types at the composer's `party_event` door (§3.1) | 2026-10-18 · by delegation · vetoable |
| OD-PT-20 | what a told reason does | it carries only the DM's marked weight, which REPLACES the act's kindness for every hearer that can see it — its version shows the reason (§11.3); credibility never scales a told reason | 2026-10-18 · by delegation · vetoable |
| OD-PT-21 | the pledge's words | `made_good · fell_short · came_to_nothing` | 2026-10-18 · by delegation · vetoable |
| OD-PT-22 | the public voice naming the party | `party_voiced`, CLIMAX, `spoken · withheld`, default `spoken`; the voice is a COURT (any), or a PERSON or CORPS of `regional` fame or wider | 2026-10-18 · by delegation · vetoable |
| OD-PT-23 | the deed voices | §19b: eighteen doer-neutral subject rows (`deed_acceptance` among them); the corpus owner the prose lane | 2026-10-18 · amended 2026-10-20 · by delegation · vetoable |
| OD-PT-24 | the source event's undo | the leaf-first car `reconcileWorldOnUndo` (§3.4) | 2026-10-18 · by delegation · vetoable |
| OD-PT-25 | the map | the piece an H17 mover; `site` presence and ENC-HL-04 when the world-site record lands; the players' known places are the host's record, never PT's; PT-S1's producers H12/H15; the site record from M-SITE-A on, its statuses across M-SITE-A and M-SITE-F, the reach-and-reveal path in M-SITE-A; the priced journey's canon root H2 → H7, H5 + H7 + H8 + H12 → H22 | 2026-10-18 · by delegation · vetoable |
| OD-PT-26 | the verbs' hats | table records ride the party door's named exemption; acts upon the world's actors take the AUTHOR shape (§6) | 2026-10-18 · by delegation · vetoable |
| OD-PT-27 | the order of two acts in one tick | the party's own `partySeq` on the toggle, the answer and every party deed; the same-tick rule (to the deed) the fallback | 2026-10-18 · by delegation · vetoable |
| OD-PT-28 | undoing a party-caused RIPPLING event | undo strikes the deed; the world effects stay, as on master: the deed is struck and the party impact's world outcomes stand (`undoToken:null`; the slice snapshots no ripple for a party-caused event); the undo receipt says so. A reversing road (the two relationship kinds through the landed snapshot the slice skips for party-caused events) is NOT adopted: it would be new capability on a door designed with no undo, which is the owner's to ask for | 2026-10-18 · by delegation · vetoable |
| OD-PT-29 | a mark changed after the deed is minted | a `correction` deed carrying the revised marks (RN2: the deed is never rewritten); strike and re-record to unsay a mark everywhere at once (§6) | 2026-10-18 · by delegation · vetoable |
| OD-PT-30 | THE SITES | §4's sites paragraph: `siteId?` presence; `party_reached_site` (a placing deed) · `party_cleared_site` (ONE act through PT's door, `RECORD_CLEARING`, which calls ST's writer) · `party_made_known_site` (beside the DM's own `SITE_STATUS made_known`); `site` a WHERE and a subject, never an actor kind; a site deed's target the anchor with a `siteId` qualifier; no party kind from ST | 2026-10-18 · by delegation · vetoable |
| OD-PT-31 | THE CORPS (CH §16b) | the widening's key `u:<unitKey>` for a company's edges (CH writes them); a corps as an engagement's actor (its own `visit_party`) or as `officer` (retained, carrying its employer's threat); `RECORD_MEETING` takes a company; RN keys it `u:<unitKey>`, never `c:`; lit only with CH's corps and WC-10 | 2026-10-18 · by delegation · vetoable |
| OD-PT-32 | the party on a watched road | `party_gate`'s ROAD ARM: fired by a patrolled traversal of the DM's own move (`presentAt.fromIds` → the destination; the cheapest land route's halves on PR's ONE STRETCH KEY), PR's `patrolEncounter` once per power, the noticing court's `gateDefault`, at most one road card per move, the origin's and destination's riders never a road card; the WATCH of an ambush on a road is a detachment of the court's riders (PR19) — a warrant stands at the court's town; `patrolsEnabled` (C16) | 2026-10-18 · by delegation · vetoable |
| OD-PT-33 | THE BODIES (`DESIGN_FP_ARCH_BD.md`; `cure/L-BD.md` §4's PT route; L-BD 33 and 36) | a body is the SIXTH actor kind and NEVER an actor toward the party (BD15): (a) met on the DM's road it is the road arm's BODY HALF — the body's own `where` that week, truth-read as physics, one CLIMAX card inside the one-card-per-move cap, default `passed` ("nothing has happened to the party yet"), the meeting's words never the gate's (§9.2); (b) a court's bounty on a NAMED body is a request source: `party_request` with `need: { bodyId }`, read in THE CALL'S OWN DOMAIN (a conclave's is `order`), a THRESHOLD clock priced each week to the body's own `where` (truth) and judged by §8.6's one rule — `made_good` by the party's `body_ended` deed, `KEEP_PLEDGE` or presence where the body worked; a reachable miss `fell_short` and counted; else `came_to_nothing` — `party_hunted`'s mirror (§7.2, §8.2); (c) the party's hand rides BD's own verbs as a `party` dial (`END_BODY` → the deed `body_ended`, the party's bounty claim and its only deed for it; `TRAIL_KNOWN` → the `waysKnown` write `party_made_known_trail`, no deed), at execution, MN's idiom (§3.1); (d) a way revealed TO the party is PT's own `waysKnown` row (BD's route; read by nothing in the world), offered to the host's reveal on a connected map — the host's known-places list keeps its one writer; (e) `body_ended` reads CH's `hunt_won` rows (one value for one fact): a gang or a pack admirable, a conclave neutral on its face, never relief | 2026-10-18 · amended 2026-10-19 · by delegation · vetoable |
| OD-PT-34 | A YES ON AN OFFER | the `party_event` deed `offer_accepted` (target the offering court; `heard_deed` + DRAFT 0.1 at that court, lens two for every other hearer; AMBIGUOUS on its face; not a placing deed; telling `deed_acceptance`); the pledge to come to the court's town by the offer's term (the DEADLINE arm); for `employment` the pledged engagement IS the employment for its term of service — PT2's employer arm and the party's backer of record at a town's gate (`partyEmployerOf`), never a second record | 2026-10-20 · by delegation under the owner's words of that day ("I give all permissions now and in the future"; "i defer everything to your judgemetn") · vetoable |
| OD-PT-35 | the party bounty's purse (the census's open line on the treasury) | the band set once at mint from the court's `settlementFundingBand`, read by the hunted draw (`unfunded` draws none); NO treasury row and NO input to ST's band — the engine never pays a bounty on the party, which no hunter ever claims (PT1, PT6); the body bounty's band-step counterforce (BD §9.9, ST §2.3) stays the body's; the alternative is §20's open question (9) | 2026-10-20 · by delegation · vetoable |
| OD-PT-36 | the party's label | `name` is read by the DM's surfaces only — the window's title, the DM's cards and deed lines, the dossier's party lines, the H17 piece's label — never by the engine or a telling in the world | 2026-10-20 · by delegation · vetoable |
"""
LINE[542]=R18.rstrip('\n')
for n in range(543,582): LINE[n]=None
# the ledger's notes for the brackets of the rulings table (old lines 546-581)
for i in list(range(340,398)):
    NOTE.setdefault(i,'§18 rewritten in final form: the ruling text stands without its change notes; the row\'s amendment date carried in the Ruled column')
NOTE[341]='OD-PT-2 in final form: the backing default by PT2\'s two authorization arms (the employer arm by OD-PT-34, the latest ruling; seat 1\'s ledger §3 item 2); its amendment dates in the Ruled column'
NOTE[387]='OD-PT-30 in final form ("§4\'s sites paragraph", seat 1\'s ledger §3 item 11); its date in the Ruled column'
NOTE[396]='OD-PT-35: its refinement\'s alternative (ST\'s bounty input row) stands as §20\'s open question (9); the row points there'
````

### `d15.py`

````python
# SEAT 2 — §19 WHAT A DM READS, §19b THE VOICES (old lines 585-630)
SUBS+= [
(592,"*(the town's gate's road arm; on scrutiny the half and the officer — STOP-PR-2, RULINGS-ROUND2b)*","*(the town's gate's road arm; on scrutiny the half and the officer)*"),
]
# B398, B399: stamps standing alone on their lines (602, 606) — the lines removed so the list stays one list; B400: change note alone on line 608 — removed.
LINE[602]=None; LINE[606]=None; LINE[607]=None; LINE[608]=None
NOTE[398]='a stamp alone on its line; the line removed (the felt sentences of BD\'s route stand around it)'
NOTE[399]='a stamp alone on its line; the line removed (the three felt sentences above it stand)'
NOTE[400]='a change note alone on its line (the felt sentences it cured stand in final form); the line removed'
# §19b (old lines 613-629): B401/B402 change notes (the cult's subject; `party_made_known_trail` no deed — the text says so); B403's mirror clause folded; B404-B407, B409 stamps; B408, B410, B411 change notes.
SUBS+= [
(622,"every AMBIGUOUS composer type (`IMPOSE_CULT` among them, R4-4)","every AMBIGUOUS composer type (`IMPOSE_CULT` among them)"),
]
X[403]=", `deed_refusal`'s mirror"
NOTE[403]="its design clause (the subject is `deed_refusal`'s mirror) folded into the row; its registration timing stands in §14/§15 (PT-4's rows)"
SUBS+= [
(629,"**What is pushed** (the push budget, chair notes item 2):","**What is pushed** (the push budget):"),
(629,"The three site deeds (§4's sites bracket) register their subjects","The three site deeds (§4's sites paragraph) register their subjects"),
]
````

### `d16.py`

````python
# SEAT 2 — §20 THE STOPS, THE REFINEMENTS AND THE OPEN QUESTIONS (old lines 633-645) and the new §21 THE REVIEW TRAIL (old line 647; old §21 THE CURE RECORD moved verbatim to history Part 2)
SUBS+= [
(635,"| Id | What | Receipt | Slot / who rules |","| Id | What | Receipt | Slot |"),
(637,"| PT-S1 — RULED (RULINGS-AFTER-COMPILE) |","| PT-S1 — RULED (slot C7) |"),
(638,"| PT-S2 — RULED (RULINGS-AFTER-COMPILE) |","| PT-S2 — RULED (slot C1) |"),
]
# B412 (old line 637): stamp.
# old line 640 (each round's "raised NO new STOP" line, with its cure-file pointers): MOVED verbatim to history Part 1b; its content restated as THE OPEN STOPS line.
LINE[640]=("THE OPEN STOPS: none. Every STOP raised in review was ruled before the text of record — the party on a watched road as `party_gate`'s road arm (OD-PT-32), "
 "the undo of a party-caused rippling event (OD-PT-28) — each ruling folded above; this consolidation raised none. The halves that belong to other volumes are listed "
 "with each cure in the cure record and, where still open, below.")
# old line 642 (the REFINED list by round, with the bracket templates B413-B419 in backticks): restated as one list without round labels, ids or templates; each refinement by its content.
LINE[642]=("**THE REFINEMENTS** (each vetoable; each stands in the text it changed; their ids and rounds are in the cure record): "
 "the `proof` words · the flag's name, `partyBackingEnabled` · `earliestArrivalTick` · the named-person journey · the need's clock without forecasts · `presentAt` · the CLIMAX kinds · three counterforce kinds · the `party_pledge` source · ambiguous `party_event` kinds, narrowed to genuinely target-dependent types · the menace broken by the party's hand · the party ban's gate · invitations as offers · the engagement pass's host · "
 "the backing default pre-filled only by an authorization arm — an accepted request's, and (OD-PT-34) a standing employment's — never by a friendly town's regard (a departure from the ZERO-CLICK MARKS note) · the size drift kept symmetric as landed, never \"usually swelling\" (a departure from L-PT ruling 10) · the institution deeds' inherent value built through PT's registration rows, not the landed ripple map · the static skip beside the ruled `sourceEventRef` lookup · the verbs' hats split (table records vs acts upon the world's actors) · "
 "the whereabouts stamp carries the party's own sequence · the requester weighs a \"later\" by the party's word (RN §7's declared reader, §8.5) · the season and the sea cited, not re-minted, and resting on the landed law alone (§8.3) · "
 "a court's pardon of the party reads `banKeys` in PL's exact key form (CH's rule; one ban, one lift) · `presentAt.fromIds` for the road arm's traversal · the clearing's table verb `RECORD_CLEARING` · PT's road WHERE read as PR's ONE STRETCH KEY · "
 "one `banKeys` key per door, the newer episode replacing (one lift rule for the one merged edge) · "
 "each `banKeys` row carries its court's window (`untilTick`), so `BAN_PARTY`'s restoring inverse keeps a court's later ban · the road arm's body half speaks a meeting's words (`passed · reaches_party · struck`), never the gate's · the party's hand on a body and a trail rides BD's own verbs as a `party` dial (MN's idiom) · `IMPOSE_CULT` reads AMBIGUOUS, never \"shameful on its face\" (a cult is the faith ladder's small end) · a party deed at a kept-secret site never names the site in its telling (the kept secret's veil) · `banKeys` holds seat-episode keys, a departure from the letter of the one ban-episode form (§9.3) · "
 "a way revealed to the party is PT's own `waysKnown` record and never a deed, offered to the host's one reveal writer · presence where the hunted body worked after the answer counts as `made_good`, the siege's rule · "
 "the census's PT token residue gathered into ONE register row of §2.4 · `offer_accepted`'s link rides RN's landed `heard_deed` at the refusal's mirror sign · a `party_gate` archive row keeps the posture HEARD, never the DM's answer · the map piece's interim precedent is master's `TravelersLayer.jsx`, mounted in the owned FP MAP LAYERS unit · a summons whose yes fell short escalates as an unanswered one · a party bounty costs no treasury row · an employment's deadline is its term of service, so one pledged record carries it · the party's backer of record named (the employer, else the newest backed deed) · the void's hostile set is master's three rungs, the body roles keep RN's regard, the party arm stays in both defaults, PL's `via` quoted as defined.")
for i in range(413,420): NOTE[i]='a bracket template quoted in the old REFINED list; the list restated by content without round labels, ids or templates (§20 THE REFINEMENTS); the templates stay in the text of record'
# old line 644 (OPEN FOR THE CHAIR): restated as THE OPEN QUESTIONS — the same ten items in the same order, without ruling tags, round labels or cure-file pointers; item (4), closed, says so.
LINE[644]=("**THE OPEN QUESTIONS** (other volumes' halves, and questions this volume leaves to its owner; none blocks PT; detail in the cure record): "
 "(1) RN's halves: `partySeq` named in RN's deed normalizer; RN §3.1's `party_event` row narrowed to events that do not ripple; no \"truth chasing\" reader in RN §7; RN keys the corps `u:<unitKey>`; and RN's own volume carries the rest — the actor convention never gains `site`, the deed target's `siteId` field (§4), the heard pass's triple key (§11.1) and RN §5.5's court arm; "
 "(2) the fold's party rows (§3.4 — its WHERE `road` row gains `party_gate`'s road arm and `party_hunted`, while `party_visit` stays `settlement`, PT's placement winning; §3.3.12 gains `corps` and names `site` a WHERE and a subject; §5 tokens incl. `partySeq`, `fromIds`, `banKeys` (CH's sense), `RECORD_CLEARING` and the three site kinds with `party_made_known_site`; §6's C11/C13 chain with RN-3 before PT-1; the fold's corps note gains PT's corps edge arm); "
 "(3) IN's inbox: `plant_taken` skips a plant whose subject is the party; "
 "(4) closed: CH names `met_in_person` as the producer of `marks.metParty` (CH L3, §16); "
 "(5) \"the reveal\" has ONE meaning, `party_made_known_site` (ST cites PT's kind); still open: whether that deed should also be ONE act through PT's door, like the clearing — ST's closed caller list names only the clearing door, so today `party_made_known_site` rides beside the DM's `SITE_STATUS made_known` (a `party` dial on that verb is closed: it already carries four); "
 "(6) two still open: a deed-only upward size bias, and an AMEND `{ lie: true }` on `party_pledge_due` (RN §7's \"a miss the DM marks a lie\"); "
 "(7) a question to the host: whether the host's known-places list (ENC-HS-01, `MapRecord.party`) admits a WAY's address, so the map's party view can draw a way PT's `waysKnown` offers it (PLAUSIBLE; until answered the way is shown in the DM's window only); "
 "(8) CH §14 books a gang's bounty as a `wildland`, `war` and `order` call while BD §9.9 books it `order` — PT reads the call's own domain either way, so the drift is CH's and BD's to align; "
 "(9) the alternative to the bounty's purse (OD-PT-35): whether a party bounty should also take ST's bounty input row (a court that posts one loses a funding step a season, as for a body) — PT recommends NO (the engine never pays it); one ST row if it is ruled otherwise; "
 "(10) PL's `via: 'seat'` covers a ladder COUP as well as a succession, so under the ruling's letter a coup inside the court's own ladder upholds the backing by default unless the new court hates the party — PT applies the letter; a ruling that every coup repudiates is made on PL's read (a third `via` word is PL's).")
for i in range(420,424): NOTE[i]='a stamp in the old open-questions line; the line restated as THE OPEN QUESTIONS (§20), the same ten items in order'
# the new §21 THE REVIEW TRAIL (one line), written at old line 647 (the blank line after old §20's closing rule)
LINE[647]=("\n## §21 THE REVIEW TRAIL\n\n"
 "Reviewed in rounds r1–r5 (r2b among them), P5 and P6 with its brackets pass (the kit's `skeptic/` and `cure/`), then by the seams seats and the fold; "
 "the bracketed text of record is `1beabdc85`; the cure record (the round blocks, their findings and dispositions, each round's STOP line and the refinements by round) is `history/PT-cure-record.md`.")
````

### `d17.py`

````python
# SEAT 2 — ledger notes for the refinement brackets of §9..§17 whose content stands in the text (each listed among §20's THE REFINEMENTS)
for i in (235,248,254,269,278,284):
    NOTE.setdefault(i,"a refinement note: the text at the same place carries the refinement; it is listed among §20's THE REFINEMENTS (vetoable); the note stays in the text of record")
````

### `d18.py`

````python
# the ledger row of B179 as seat 1's continuation wrote it by hand (its "NEW" fix, d08.py) — reproduced here so the regenerated ledger matches
NOTE[179]='its content (the THIRD road — a telling that arrived, RN\'s `heardAt`; no new deed or telling source kind for a capture) folded into B178\'s paragraph ("NO NEW … SOURCE KIND" — its "NEW" restored by the continuation, §3 item 12)'
````

### `ledger.py`

````python
import json,re,sys,os
D=os.path.dirname(os.path.abspath(__file__))
OLD='/tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit/history/PT-bracketed-1beabdc85.md'
S=open(OLD,encoding='utf-8').read(); L=S.split('\n')
BR=json.load(open(D+'/brackets.json'))
X={}; DR={}; MV={}; SUBS=[]; LINE={}; NOTE={}; HEAD=None
for f in sorted(x for x in os.listdir(D) if re.match(r'd\d\d\.py$',x)): exec(open(D+'/'+f).read())
END=int(sys.argv[1]) if len(sys.argv)>1 else 647; CURE0=648
P1B_LINES={640:"old §20's line of each round's STOPs"}
NL={int(k):v for k,v in json.load(open(D+'/newlines.json')).items()}
sec={};cur='header'
for i,l in enumerate(L,1):
    m=re.match(r'^(#{2,3}) (.*)',l)
    if m and i>=11:
        t=m.group(2); mm=re.match(r'(§\d+b?|\d+\.\d+b?)\b',t)
        cur=('§'+mm.group(1) if mm and not mm.group(1).startswith('§') else mm.group(1)) if mm else ('§21 Round '+t.split()[1] if t.startswith('Round') else t[:28])
    if 10<=i<=23: cur="THE OWNER'S WORDS · THE ANSWER"
    sec[i]=cur
offs=[0]
for l in L: offs.append(offs[-1]+len(l)+1)
inbr=[False]*len(S)
for b in BR:
    for k in range(b['start'],b['end']): inbr[k]=True
rows=[]
def add(kind,line,text,disp,new,what): rows.append((kind,line,text,disp,new,what))
def first(t): return t[:60].replace('|','\\|').replace('`',"'").replace('\n',' ')
NEWSEC={"THE OWNER'S WORDS · THE ANSWER":"THE OWNER'S WORDS · THE ANSWER"}
def newsec(n):
    s=sec[n]
    if n<10: return 'header'
    return s
for b in BR:
    i=b['i'];n=b['line'];t=b['text']
    if n>END: add('B%03d'%i,n,first(t),'PENDING','—','beyond seat 1\'s range (seat 2: old §9 to the end)'); continue
    if i in MV: add('B%03d'%i,n,first(t),'MOVED','history Part 1',MV[i]); continue
    if i in DR: s,note=DR[i]; add('B%03d'%i,n,first(t),'DROPPED','—','superseded by B%03d: %s'%(s,note)); continue
    ns=newsec(n)
    if i in NOTE: add('B%03d'%i,n,first(t),'FOLDED',ns,NOTE[i]); continue
    if i in X: add('B%03d'%i,n,first(t),'FOLDED',ns,'its content folded into the sentence or cell it amended (latest ruling as stated)'); continue
    if b['stamp']: add('B%03d'%i,n,first(t),'FOLDED',ns,'a stamp: the cured text stands at the same place; its ids stay in the text of record'); continue
    add('B%03d'%i,n,first(t),'FOLDED',ns,'a change note: the text at the same place already carries the change; the note stays in the text of record')
# nested markers inside a bracket
nested_pat=re.compile(r'\[(CURED|REFINED|ADDED)\b')
k=0
for b in BR:
    for m in nested_pat.finditer(b['text'],1):
        k+=1; n=b['line']
        if n>END: add('N%02d'%k,n,first(b['text'][m.start():]),'PENDING','—','beyond seat 1\'s range'); continue
        add('N%02d'%k,n,first(b['text'][m.start():]),'FOLDED',newsec(n),'a stamp nested inside B%03d; removed with it (B%03d\'s content folded)'%(b['i'],b['i']))
# cure-record brackets
for m in re.finditer(r'\[(CURED|REFINED|ADDED|RE-POINTED|OPENED|STOP|CORRECTED|AMENDED|RULED)\b',S[offs[CURE0-1]:]):
    p=offs[CURE0-1]+m.start(); n=next(j for j in range(1,len(offs)) if offs[j]>p)
    add('C%02d'%(len([r for r in rows if r[0].startswith('C')])+1),n,first(S[p:p+60]),'MOVED','history Part 2','inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2')
# arrows, ROUTED-UNAPPLIED, rounds, stops, fp-final stamps outside brackets
pats=[('A','↳'),('U','ROUTED-UNAPPLIED'),('H',r'\bROUND (?:\d[ab]?|r\d[ab]?|P\d)\b|\bRound (?:\d[ab]?|r\d[ab]?|P\d)\b|\bround (?:r?\d[ab]?)\b|\bround-\d\b'),('S',r'STOP'),('F',r'\(fp-final[^)]*\)')]
cnt={}
KEEP_ROWS={633:"KEPT: the word is §20's own title (THE STOPS, THE REFINEMENTS AND THE OPEN QUESTIONS), a design heading; the section now states THE OPEN STOPS: none"}
RESTATED_ROWS={642:"the round label removed: old §20's REFINED list restated by content, without round labels, ids or bracket templates (§20 THE REFINEMENTS)",
 644:"the round label removed: old §20's OPEN FOR THE CHAIR restated as THE OPEN QUESTIONS, the same ten items in order"}
for n in range(1,len(L)+1):
    l=L[n-1]; base=offs[n-1]
    for kk,pat in pats:
        for m in re.finditer(pat,l):
            if inbr[base+m.start()]: continue
            cnt[kk]=cnt.get(kk,0)+1; rid='%s%02d'%(kk,cnt[kk])
            ctx=first(l[max(0,m.start()-20):m.start()+40])
            if n>=CURE0: add(rid,n,ctx,'MOVED','history Part 2','inside old §21 THE CURE RECORD, moved verbatim with it to history Part 2'); continue
            if n in P1B_LINES: add(rid,n,ctx,'MOVED','history Part 1b','inside old line %d (%s), moved verbatim with it to history Part 1b; its content restated as §20\'s THE OPEN STOPS line'%(n,P1B_LINES[n])); continue
            if n in KEEP_ROWS: add(rid,n,ctx,'KEPT',newsec(n),KEEP_ROWS[n]); continue
            if n in RESTATED_ROWS: add(rid,n,ctx,'FOLDED',newsec(n),RESTATED_ROWS[n]); continue
            if n in MV_LINES: add(rid,n,ctx,'MOVED','history Part 1','inside old line %d (%s), moved with it'%(n,MV_LINES[n])); continue
            if n>END: add(rid,n,ctx,'PENDING','—','beyond seat 1\'s range (seat 2)'); continue
            nl=NL.get(n)
            if kk=='A' and n==284: add(rid,n,ctx,'FOLDED','§7.3','the ↳ `party_request` row folded into its parent row (old line 283: "never from a `captive_held` call …"); the ↳ line removed'); continue
            if nl is not None and re.search(pat,nl): add(rid,n,ctx,'KEPT',newsec(n),'KEPT — CHECK'); continue
            add(rid,n,ctx,'FOLDED',newsec(n),'the label removed; the passage stands in final form')
for n,why in MV_LINES.items():
    add('L%02d'%n,n,first(L[n-1]),'MOVED','history Part 1','header/status line moved verbatim to history Part 1 (seat 2 writes `history/PT-cure-record.md`): '+why)
for n,why in FOLD_LINES.items():
    add('L%02d'%n,n,first(L[n-1]),'FOLDED','header',why)
for n in range(CURE0,len(L)+1):
    if L[n-1].startswith('## §21') or L[n-1].startswith('### '): add('R%02d'%(n-CURE0+1),n,first(L[n-1]),'MOVED','history Part 2','cure-record header, moved verbatim to history Part 2 (the new §21 is THE REVIEW TRAIL, one line)')
from collections import Counter
c=Counter(r[3] for r in rows); print('rows',len(rows),dict(c)); print(Counter(r[0][0] for r in rows))
for r in rows:
    if 'CHECK' in r[5]: print('CHECK',r)
json.dump(rows,open(D+'/ledger_rows.json','w'),ensure_ascii=False)
````

### `ledger_md.py`

````python
# renders consolidate/PT-ledger.md = ledger_head2.md (sections 1-6, written by hand) + §7 THE ROWS (from ledger_rows.json) + the APPENDIX (every build file verbatim)
import json,re,os
D=os.path.dirname(os.path.abspath(__file__))
OLD=D+'/../kit/history/PT-bracketed-1beabdc85.md'
L=open(OLD,encoding='utf-8').read().split('\n')
sec={};cur='header'
for i,l in enumerate(L,1):
    m=re.match(r'^(#{2,3}) (.*)',l)
    if m and i>=11:
        t=m.group(2); mm=re.match(r'(§\d+b?|\d+\.\d+b?)\b',t)
        cur=('§'+mm.group(1) if mm and not mm.group(1).startswith('§') else mm.group(1)) if mm else ('§21 Round '+t.split()[1] if t.startswith('Round') else t[:28])
    if 10<=i<=23: cur="THE OWNER'S WORDS · THE ANSWER"
    sec[i]=cur
R=json.load(open(D+'/ledger_rows.json'))
def row(r):
    k,n,first,disp,new,what=r
    return '| %s | L%d | %s | `%s` | %s | %s | %s |'%(k,n,sec[n],first,disp,new,what.replace('|','\\|').replace('\n',' '))
rows='\n'.join(row(r) for r in R)
head=open(D+'/ledger_head2.md',encoding='utf-8').read().rstrip('\n')
T7=("## 7. THE ROWS (one per marker; `B` = body bracket by index in old-text order · `N` = a bracket nested inside another · `C` = cure-record bracket word · "
    "`A` = `↳` outside brackets · `U` = `ROUTED-UNAPPLIED` outside brackets · `H` = round word outside brackets · `S` = `STOP` outside brackets · `L` = header/status line · `R` = cure-record header)\n\n"
    "| id | old line | old section | first characters | disposition | new § | what happened |\n|---|---|---|---|---|---|---|\n")
files=['brackets.py','build.py']+sorted(x for x in os.listdir(D) if re.match(r'd\d\d\.py$',x))+['ledger.py','ledger_md.py','mk_history.py','lint.py','miss.py','miss2.py','wdiff.py']
app=["## APPENDIX — THE BUILD, VERBATIM (the working copies are in the seat's scratchpad `cpt/`; run `python3 brackets.py`, then `python3 build.py 647` (it writes `body_new.md`, copied to `consolidate/PT-new.md`), `python3 mk_history.py` (it writes `history/PT-cure-record.md`), `python3 ledger.py 647`, then `python3 ledger_md.py`)"]
for f in files:
    app.append('### `%s`\n\n````python\n%s\n````'%(f,open(D+'/'+f,encoding='utf-8').read().rstrip('\n')))
out=head+'\n\n'+T7+rows+'\n\n'+'\n\n'.join(app)+'\n'
open(D+'/../kit/consolidate/PT-ledger.md','w',encoding='utf-8').write(out)
from collections import Counter
print('ledger rows',len(R),dict(Counter(r[3] for r in R)),'bytes',len(out.encode()))
````

### `mk_history.py`

````python
# writes history/PT-cure-record.md: Part 1 = old lines 3-9 verbatim (moved by seat 1); Part 1b = old line 640 verbatim (moved by seat 2);
# Part 2 = old §21 THE CURE RECORD, old lines 648-893 verbatim. Each block byte-identical to the text of record.
import os
D=os.path.dirname(os.path.abspath(__file__))
K=D+'/../kit'
OLD=K+'/history/PT-bracketed-1beabdc85.md'
L=open(OLD,encoding='utf-8').read().split('\n')
def span(a,b): return '\n'.join(L[a-1:b])
assert L[647].startswith('## §21 THE CURE RECORD'), L[647][:40]
assert L[639].startswith('**Round 1 raised NO new STOP.**')
out=[
"# PT — THE CURE RECORD AND THE COMPILE HEADER, moved verbatim from `docs/DESIGN_FP_ARCH_PT.md` at `1beabdc85` by the consolidation pass (P8, lane C-PT, 2026-10-23)",
"",
"Part 1 is the old header and status block (old lines 3–9); Part 1b is old §20's line of each round's STOPs (old line 640); Part 2 is the old §21 THE CURE RECORD (old lines 648–893). Each part is byte-identical to the text of record (`history/PT-bracketed-1beabdc85.md`); the consolidated volume carries the design, this file carries the trail.",
"",
"## PART 1 — the old header and status block (old lines 3–9)",
"",
span(3,9),
"",
"## PART 1b — old §20's line of each round's STOPs (old line 640)",
"",
span(640,640),
"",
"## PART 2 — the old §21 THE CURE RECORD (old lines 648–893)",
"",
span(648,893),
]
txt='\n'.join(out)
if not txt.endswith('\n'): txt+='\n'
open(K+'/history/PT-cure-record.md','w',encoding='utf-8').write(txt)
# self-check: every moved block appears byte-for-byte
for a,b in ((3,9),(640,640),(648,893)): assert span(a,b) in txt
print('history/PT-cure-record.md', len(txt.encode()), 'bytes')
````

### `lint.py`

````python
import json,re,sys
a,b=int(sys.argv[1]),int(sys.argv[2])
NL={int(k):v for k,v in json.load(open('newlines.json')).items()}
pats=[r'↳',r'\bSTOP',r'fp-final',r'\b[Rr]ound\b',r'\bROUND\b',r'\br\d[ab]?\b',r'\bfinding',r'\bskeptic',r'\bchair\b',r'\blane\b',r'\bverifier',r'RULINGS',r'\b[A-Z]{2,5}(-[A-Za-z]+)?-r\d[ab]?-\d+',r'\b(PT|CH|PL|MN|RN|SEAMS|HOST)-(V|W|X)\d+',r'\bP5C?-\d+',r'\bP5\b',r'\bP6c?\b',r'\b[A-H]\.\d{1,2}\b',r'CHAIR-NOTES',r'\brouted\b|\bROUTED\b|\bROUTE\b',r'\b20\d\d-\d\d-\d\d\b',r'\bR-?P?T?-?P?5?-\d\b|\bR\d[ab]?-\d\b|\bR-PT-\d+',r'\bstruck\b|\bSTRUCK\b',r'\bWC-PT-\d+',r'\bcure/|\bskeptic/|\bbriefs/',r'\bRU-\d',r'\bm\d\b',r'\bP4\b',r'chair notes']
for n in range(a,b+1):
    l=NL.get(n)
    if not l: continue
    hits=[]
    for p in pats:
        for m in re.finditer(p,l): hits.append(l[max(0,m.start()-40):m.end()+40].replace('\n',' '))
    if hits: print(n,' || '.join(hits)); print()
````

### `miss.py`

````python
import re,json
def tokens(s): return set(t for t in re.findall(r'`([^`\n]{1,200})`', s) if not t.startswith(' '))
old=open('old_range.md').read(); new=open('body_new.md').read()
P=open('plain.md').read().split('\n')
s2plain='\n'.join(P[329:647])            # seat 2's body range, brackets as placeholders
full=open('../kit/history/PT-bracketed-1beabdc85.md').read().split('\n')
s2full='\n'.join(full[329:647]); cure='\n'.join(full[647:])
to,tn=tokens(old),tokens(new)
miss=sorted(to-tn)
t2p,t2f,tc=tokens(s2plain),tokens(s2full),tokens(cure)
out={'survive_s2_running':[],'only_s2_brackets':[],'only_cure':[],'gone':[]}
for t in miss:
    if t in t2p: out['survive_s2_running'].append(t)
    elif t in t2f: out['only_s2_brackets'].append(t)
    elif t in tc: out['only_cure'].append(t)
    else: out['gone'].append(t)
for k,v in out.items(): print(k,len(v)); [print('   ',x) for x in v] if k!='survive_s2_running' else print('   ',v)
json.dump(out,open('miss.json','w'),ensure_ascii=False,indent=0)
````

### `miss2.py`

````python
import re,json
K='../kit'
def tokens(s): return set(t for t in re.findall(r'`([^`\n]{1,200})`', s) if not t.startswith(' '))
old=open(K+'/history/PT-bracketed-1beabdc85.md').read(); new=open(K+'/consolidate/PT-new.md').read()
allow=set(l.rstrip('\n') for l in open(K+'/consolidate/PT-allow.txt') if l.strip() and not l.startswith('#'))
F=old.split('\n'); P=open('plain.md').read().split('\n')
def j(L,a,b): return '\n'.join(L[a-1:b])
regions={'s1_run':j(P,1,329),'s1_full':j(F,1,329),'s2_run':j(P,330,647),'s2_full':j(F,330,647),'cure':j(F,648,893),'l640':j(F,640,640),'l642':j(F,642,642),'l644':j(F,644,644),'s18':j(F,542,581)}
T={k:tokens(v) for k,v in regions.items()}
miss=sorted(t for t in tokens(old)-tokens(new) if t not in allow)
cat={}
for t in miss:
    where=[k for k in ('s2_run','l640','l642','l644','s18') if t in T[k]]
    if t in T['s2_run']: c='S2_RUNNING:'+','.join(where)
    elif t in T['s2_full']: c='S2_BRACKET_ONLY'+(':'+','.join(w for w in where if w!='s2_run') if where else '')
    elif t in T['cure']: c='CURE_ONLY'
    elif t in T['s1_full']: c='S1'
    else: c='ARTEFACT'
    cat.setdefault(c,[]).append(t)
for c,v in sorted(cat.items()): print(c,len(v)); [print('   ',x) for x in v]
json.dump(cat,open('miss2.json','w'),ensure_ascii=False,indent=0)
print('DRAFT', {k:len(re.findall(r'\bDRAFT\b',v)) for k,v in regions.items()}, 'new', len(re.findall(r'\bDRAFT\b',new)))
````

### `wdiff.py`

````python
import json,re,difflib,sys
BR=json.load(open('brackets.json'))
S=open('../kit/history/PT-bracketed-1beabdc85.md').read(); L=S.split('\n')
NL={int(k):v for k,v in json.load(open('newlines.json')).items()}
offs=[0]
for l in L: offs.append(offs[-1]+len(l)+1)
byline={}
for b in BR: byline.setdefault(b['line'],[]).append(b)
def strip(n):
    l=L[n-1]; base=offs[n-1]; out=[]; p=0
    for b in byline.get(n,[]):
        out.append(l[p:b['start']-base]); out.append(' ⟦B%03d⟧ '%b['i']); p=b['end']-base
    out.append(l[p:]); return ''.join(out)
a,b=int(sys.argv[1]),int(sys.argv[2])
for n in range(a,b+1):
    A=strip(n).split(); B=(NL.get(n) or '').split()
    if A==B: continue
    sm=difflib.SequenceMatcher(None,A,B,autojunk=False)
    segs=[]
    for op,i1,i2,j1,j2 in sm.get_opcodes():
        if op=='equal': continue
        old=' '.join(A[i1:i2]); new=' '.join(B[j1:j2])
        if op=='delete' and re.fullmatch(r'(⟦B\d+⟧ ?)+',old): continue
        ctx=' '.join(A[max(0,i1-4):i1])
        segs.append('  @[%s] -{%s} +{%s}'%(ctx,old,new))
    if segs: print('L%d'%n); print('\n'.join(segs))
````

## CURE AFTER FV-PT (2026-10-23 18:55 UTC, the cloud chair)
- FV-PT: 190 sampled · 190 hold · 1 fail (THE READER'S GUIDE item 3 said "TRUTH only" and left out §9.2's two truth reads and the veil row). CURED: the clause now reads "TRUTH for … the town's own ban at its gate (`isExcludedFrom` on the `party` key, §9.2) and a hunted body's record as it stands where the party meets it on the road (§9.2); the DM's view is truth (§16, the veil row)." — no new decision; the hardening "only" removed.

## SEAMS CURES (2026-10-23, per SEAMS-P8, the chair's rulings)

- SEAMS-P8-1 · §7.1 (the engagement pass's host) · "the stage runs RN's heard pass and voices → CH's weekly pass → PT's engagement pass" → "the stage runs RN's heard pass and voices → CH's weekly pass → OP's stage → PT's engagement pass".
- SEAMS-P8-2 · §13 (the WHERE words) · "(MN §2.4: `country · road`)" → "(MN §3.4: `country · road`)" (MN §3.4 THE CLOSED VOCABULARIES holds the `MENACE_WHERE_KINDS` row).

## LENS → READINGS (2026-10-23, the chair's ruling on the fold §5 `lens` row)
The chair's ruling (2026-10-23, by delegation, vetoable; OD-FC-63, the latest ruling wins): on every DM surface a lens is a MAP LAYER, and THE RENOWN's two ways of judging a deed are "readings" in prose, never "lenses". The LENS SWEEP seat renamed every site where "lens"/"lenses" names RN's deed reading; backticked tokens, paths and every other sense are kept (listed below). No owner quotation was edited. Line numbers are the edited text's (the volume or the part; the edits add no lines).
**Renamed: 23 sites in 21 edits** (each edit an asserted single replacement, `scratchpad/lensweep/apply.py`; an edit naming two sites in one sentence is one line below).
- L17: "inherent value and the two lenses — cited, never re-specified" → "inherent value and the two readings — cited, never re-specified"
- L209: ""lens one" and "lens two" are RN's design prose for a deed's two readings (RN §2.4's homonym note), used here only in that sense" → "RN's two ways of judging a deed are "reading one" and "reading two" in prose, never lenses (RN §2.4's homonym note; the fold §5 `lens` row)"
- L246: "judged by what the hearer's lens two finds" → "judged by what the hearer's reading two finds"
- L248: "`refused_request` has no lens-one row" → "`refused_request` has no reading-one row"
- L248: "other hearer reads it through lens two only — RN §6.1's" → "other hearer reads it through reading two only — RN §6.1's"
- L248: "its MIRROR: no lens-one row" → "its MIRROR: no reading-one row"
- L248: "CH's visit reasons and RN's lens two then read), and every other hearer reads it through lens two only" → "CH's visit reasons and RN's reading two then read), and every other hearer reads it through reading two only"
- L267: "deed's inherent value and two-lens reading (`inherentValueOf`," → "deed's inherent value and its two readings (`inherentValueOf`,"
- L337: "to the requester through lens two only" → "to the requester through reading two only"
- L372: "DRAFT ±0.25 of lens one's magnitude" → "DRAFT ±0.25 of reading one's magnitude"
- L394: "For such a hearer lens one reads the act" → "For such a hearer reading one reads the act"
- L394: "how violent it was. Lens two is untouched" → "how violent it was. Reading two is untouched"
- L394: "(EXECUTED on RN §6.2's lens one, `cure/" → "(EXECUTED on RN §6.2's reading one, `cure/"
- L440: "(the inherent value, the two lenses and the registration" → "(the inherent value, the two readings and the registration"
- L440: "reads each tale "through §6's lenses" (RN §5.1)" → "reads each tale "through §6's readings" (RN §5.1)"
- L454: "RN's lenses on all three axes" → "RN's readings on all three axes"
- L454: "replaces the act's kindness in lens one)" → "replaces the act's kindness in reading one)"
- L487: "telling shows the reason, lens one reads `kind01`" → "telling shows the reason, reading one reads `kind01`"
- L521: "its reason visible | lens one equals the UNMARKED" → "its reason visible | reading one equals the UNMARKED"
- L540: "until the DM marks a weight; lens two by whom it helped" → "until the DM marks a weight; reading two by whom it helped"
- L588: "DRAFT 0.1 at that court, lens two for every other" → "DRAFT 0.1 at that court, reading two for every other"
**Kept (not RN's deed reading):**
- L203 "`lens` is the causal lens" — the causal lens of `partyView` (the fold §5 `partyView` row), not RN's
- L209 `` `lens` — never a PT code token and never a DM-facing word (the map's layers) `` — the token and the map's sense
- L301 "read through the officer's lens" — the officer's character coordinates (holder character), not a numbered reading
- L394 `cure/D-PT-r2-probe/lensOneProbe.out` — a path, kept exactly
- L406 "the lens window (H23)" — a MAP lens window
**Ratchet** (`python3 KIT/tools/consolidate-ratchet.py KIT/history/PT-bracketed-1beabdc85.md DOCS/DESIGN_FP_ARCH_PT.md --allow-missing-file KIT/consolidate/PT-allow.txt`): before and after BYTE-IDENTICAL output (diffed) — `tokens: old 1118 · new 967 · missing 0 · new-in-new 8`; last line unchanged, `RATCHET 1 DIFFERENCE CLASSES`. No token went missing (prose only).
DOCS/DESIGN_FP_ARCH_PT.md copied to KIT/consolidate/PT-new.md after the edits (`cmp` identical).
