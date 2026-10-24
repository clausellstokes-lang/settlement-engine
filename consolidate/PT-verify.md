# PT — FIDELITY VERIFICATION OF THE CONSOLIDATION (P8, seat FV-PT, 2026-10-23, cloud session)

**COUNTS: sampled 190 ledger rows (150 read old-against-new side by side, 40 MOVED rows checked by containment script) · holds 190 · fails 1. The fail is at volume level, not a ledger row: F1, THE READER'S GUIDE item 3 narrows the volume's truth reads.** Six notes (N1–N6) below are NOT fidelity fails.

**THE RATCHET.** I re-ran `python3 tools/consolidate-ratchet.py history/PT-bracketed-1beabdc85.md /home/user/fp-p8/docs/DESIGN_FP_ARCH_PT.md --allow-missing-file consolidate/PT-allow.txt`, which exited 1. Its last line is **`RATCHET 1 DIFFERENCE CLASSES`**. The full results:
- tokens: old 1118, new 967, missing 0, new-in-new 8
- cites 54 = 54
- laws 18 = 18
- OD 44 = 44
- ⭐ 1 → 12
- **DRAFT 39 → 36**
- UNMEASURED 3 = 3
- waves 2 = 2
- flags 17 = 17
- review markers left: 0

This is identical to ledger §5. The volume is byte-identical to `consolidate/PT-new.md` (`cmp`).

**The DRAFT difference is explained, and I proved it by script.** The three DRAFT words lost from the old text are at:
- old L9: the STATUS line "COMPILED DRAFT", moved to history Part 1
- old L854 and L879: inside §21 THE CURE RECORD, moved to history Part 2

The remaining 36 old DRAFT marks map one-to-one, in order and with the same count per line, onto the 36 new marks (old L88:3 → new L101:3 … old L629 → new L634). No DRAFT mark of the design text is lost.

The new ⭐ marks come from three places:
- the header (1) and §2.2's `bounty` sub-field (1), which is OD-PT-4's own "THE OWNER'S SHAPE";
- §18: the heading (1), seven rows (7) and OD-PT-4's Ruled cell (1);
- the one old ⭐ (OD-PT-4), which is kept.

The eight new tokens are all accounted for:
- the history-trail paths;
- `bodyKind`, BD's field, which the old text had in a superseded longer token;
- the guide's short cite `store/settlementLifecycleHelpers.js :: reconcileWorldOnUndo`, whose full signature is at old §3.4;
- one regex artefact.

None of them is a mint.

**THE ALLOW FILE (159 entries, checked line by line by script, `scratchpad/fvpt/allow.py`).** Every entry is a token of the old text, and none is present in the new text. Each entry's location matches its ledger §4 reason:
- **Header block:** 39 entries. Each occurs only in old L6/L7/L9, in the cure record, or in old §20's REFINED list at L642.
- **The four ruling-file paths:** only at old L54.
- **"Lived ONLY in §21":** all 50 entries have 0 occurrences at old lines < 648.
- **Superseded names:** each sits in the bracket or line its successor replaced, for example:
  - `partyWhereabouts` (L166) → `whereaboutsOf`
  - `reachableAtSomeWeek` (L320) → `earliestArrivalTick`
  - `a␟b` → `stretch:<a|b>`
  - `kind01 + (marked01 − kind01) × belief` (L383) → the mark REPLACES
- **Short forms:** the new text keeps each one whole. `drainCampaignQueueIntoState`, `realmVerbExecution.js` and `atOpenWar` survive in longer cites.

No allow line lacks a true reason. Two reasons are incomplete (N4).

**THE MARKER COUNT (my own balanced-bracket scan, `scratchpad/fvpt/count.py` + `h.py`).**
- Body brackets: **424** (`CURED` 353 · `REFINED` 68 · `ADDED` 3), equal to B000–B423. Their old-line indices are identical to the ledger's (B020/B021 L41, B240 L338, B284 L421, B403 L626 …).
- Nested: 1 (N01, inside B218 at L320).
- Cure-record bracket: 1 (`[STOP-PR-2 …]` L740, C01).
- `↳` outside brackets: 2 (A01, A02).
- `ROUTED-UNAPPLIED` outside brackets: 6 (U01–U06).
- The ledger's round regex outside all brackets: **65**. Ledger H rows: **66**.
- `STOP` outside all brackets: **32**. Ledger S rows: **33**.
- Header/status lines: 7 (L rows). Cure headers: 8 (R rows).

**Unique markers: 546. The ledger's 548 rows count two markers twice:** H50 and S26 are the round word and the STOP inside C01's own bracket (N1). Nothing is missing.

**THE CURE RECORD** (`history/PT-cure-record.md`, checked by script): it contains every old line it claims, verbatim:
- Part 1: old L3–9, line by line
- Part 1b: old L640
- Part 2: old L648–893, as one contiguous byte-identical block

Only five lines of the file are not old text. They are its own title, its note and three part headings.

**THE READER'S GUIDE (whole, against the old header, §0–§2, §13–§15 and §9.2).** **F1 FAILS on item 3.** Items 1, 2 and 4–8 HOLD:
- **Item 2:** `PARTY_ENGAGEMENT_KINDS` has 15 members (old L180).
- **Item 4:** `siteLedger.js :: applySiteEvent` and `liftExclusionEdges` are present.
- **Item 5:** its hosts match old §0 and §14 (`pulseKernel.js` · `applyWorldPulse.js` · `warTermination.js` 0 lines, old L423).
- **Item 6:**
  - the three flags are "all premium" (old L421: "no free-tier arm for any of the three flags");
  - the 15 kinds are listed;
  - the chain is "(RN-0 + PT-0) → RN-1 …" (old L429);
  - the waves PT-0..PT-7 with PT-6b match old §15.
- **Item 7:** H22 and ENC-HS-01 are present; READ BY matches the old text, including DOSSIER at L108 and `marks.metParty`.
- **Item 8:** the homonyms are §2.4's.
- **The dispatch-gate sentence:** it is old L9's last sentence, verbatim.

**THE RULINGS (§18, whole).** HOLDS. The row counts match: 36 = 36 OD-PT rows.

Every row's text is the old text minus its brackets, with these exceptions:
- **OD-PT-2:** P5 C.7's employer arm is applied (the latest ruling, OD-PT-34; PT2 at old L64 carries it).
- **OD-PT-30:** "sites bracket" → "sites paragraph".
- **OD-PT-14:** carries B284's `partySanctionEnabled` (now 17 = 17 flags).
- **OD-PT-28:** loses its decision-point label and keeps the accepted ruling's words.
- **OD-PT-35:** points to §20 (9).

**The seven added ⭐ marks:** every one of OD-PT-1, 2, 3, 7, 8, 9 and 11 carries "THE OWNER'S" in the old question column (old L546–556). No other old row carries that label: OD-PT-4's label is in its ruling cell, and its ⭐ is kept.

**The Ruled column, traced by script across the ledger-branch snapshots:**
- **Snapshots used:** `b33d9174d` (10-18 01:48 EDT: OD-PT-1..17), `a399c5956` (10-18 06:35: ..26), `8a3061070` (10-19: ..33) and `1beabdc85` (10-20: ..36).
- **When each row first appears:** every row first appears in the snapshot its "first ruled" date implies. OD-PT-1..17 are 2026-10-17, the compile; the old header dates the compile "2026-10-17", and the first snapshot is 01:48 on 10-18.
- **When each row changes:** every row's later changes fall in its listed amendment windows. Examples:
  - OD-PT-11 changed between b33 and a399 → 10-18, and at P5 → 10-20.
  - OD-PT-16 changed at a399, 8a30 and P5; its "later" draw is r2, 10-18.
  - OD-PT-9 changed in the 8a30 window; its brackets are 10-18 (r2 PT-V1).
  - OD-PT-33's 10-19 is r5.
- **Unchanged rows:** OD-PT-8 and OD-PT-13 are unchanged in every snapshot and read "2026-10-17 · by delegation".

**THE OPEN STOPS: none.** The ledger records no ⛔ STOP PT-C-n and no chair ruling, so there was nothing to verify as applied.

**Cross-references and voice.**
- My § resolver found that every local § resolves. The unresolved hits are other documents' sections (R3 §1c/§1e, RN §5.1, the fold's §3.3.12).
- These words are absent from the running text: "chair", "STOP-", "RULINGS-ROUND", "fp-final" (outside the header's kit path), and finding or ruling ids (the `PT-rN` hits are probe paths).
- Dates occur only in the header, §18, the owner's words, and the host document's file name.

## THE FAIL
**F1 — THE READER'S GUIDE item 3 states a narrower law than the text (a hardened law in a new sentence, the CH-F4 pattern).**
- **GUIDE (new L13):** "BELIEF for every actor's choice toward the party: … TRUTH only for the party's own deed ledger as a pledge's evidence, the need's own state and place (`needPlaceOf`) and the world's physics of the journey (§7.1, §8)."
- **The text says more.** It names other truth reads that this closed list drops:
  - §9.2's town's gate (new L347): "(1) the ban first, from truth (`isExcludedFrom` on the `party` key) ⇒ `refused`, `banished_from_here`".
  - §9.2's road arm body half (new L351), which is PT's own read on the traversal: "the body's record AS IT STANDS (truth: the meeting RESOLVES the physics of a road the DM's party crossed; … no court's belief is read)".
  - The veil row (new L474): "truth at the court's own gate".
  - §10.3 (new L375): "the omniscient preset reads truth".
- **The old text's own sentence** (old L272, kept at new L282) was scoped to the engagement pass: "the one truth it reads is the party's own deed ledger for the pledge's evidence". The guide widens that sentence into the whole volume's "TRUTH only" and drops these named exceptions.
- **The cure (one clause, no new decision):** append to item 3 "; and TRUTH at the town's gate for the court's own ban (CH's `gateDefault`, §9.2), for a body's record as it stands on the road arm's body half (§9.2), and everywhere in the omniscient preset".

## NOTES (not fails)
- **N1.** Ledger §1's 548 rows double-count two markers inside C01's own bracket (S26, H50), as the CH ledger did. There are 546 unique markers, and none is missing.
- **N2.** §3 item 3 adds "the actor's own town for a deadline" to §8.4's list of places (new L331). P5 C.6, quoted in B094, says "§8.4/§8.6 unchanged in form". The addition completes the list from §2.3's DEADLINE arm (the latest ruling) and does not change the form of the formula. PLAUSIBLE, vetoable.
- **N3.** About 47 REFINED/CURED brackets carried an inline "vetoable". Their content was folded and the inline word dropped. Vetoability is carried by §20 THE REFINEMENTS ("each vetoable"; 44 items = the old 45 less the season/sea pair merged into one), by §18's Ruled column and by the header. This is the CH-N3 pattern.
- **N4.** Two allow-file reasons are incomplete but true:
  - `briefs/RULINGS-P5.md` is listed as "§18's ruling-file tag". It also stood outside brackets at old L197 and L249, where seat 1's §3 item 6 removed it.
  - `atOpenWar` is listed as "(line 9; …survives only inside seat 2's brackets)". The design fact survives in the new text as `roads/embassyHazard.js :: atOpenWar(graph, courtId, servedId)`.
- **N5.** Header line 5 reads "The OWNER's shapes and rows are marked ⭐". §18's heading defines the ⭐ more narrowly, as "a row whose question is the OWNER's own words". §18's definition governs, and the seven rulings stay "by delegation · vetoable". This is a presentational choice, vetoable.
- **N6.** OD-PT-2's Ruled cell "amended … 2026-10-20 (the employer arm, OD-PT-34)" records the consolidation's latest-wins application (ledger §3 items 2 and 13), not a bracket on the old row. It is honestly attributed to OD-PT-34's date.

## THE TABLE
| row | verdict | receipt |
|---|---|---|
| B013 · B016 · B023 · B031 · B037 · B038 · B039 · B061 · B076 · B077 · B084 · B090 · B091 · B129 · B130 · B139 · B147 · B156 · B157 · B215 · B266 · B283 · B310 (the BLOCKING PT-r1-1/2/3 and HOST-r1-2 rows) | HOLD | Each is a stamp or a change note whose cure the text already carries. PT3 (new L79): "ONE whereabouts read … the LATER STAMP … (tick, `partySeq`) … the deed wins ('the deed is the newer fact')". §3.1 "ONE ACT, ONE DEED" (L224); the drain "receives NO `worldState`" (L222). §3.3's registration rows plus the orphanage (L250). "canonized ≠ premium" (L67, L432). The answer paragraph follows the cured whereabouts and backing (L35). The word diff of every old line 10–647 against its new line shows only bracket removals and the corrections of ledger §3. |
| B021 (HOST-r2-1 · SEAMS-r2-1, BLOCKING) · B020 (DROPPED) | HOLD | New L54: "the journey rests on the LANDED carriers alone: the seasonal law is SLOW, NEVER SEVER (`spatial/spatialCost.js :: SLOW_NOT_SEVER_MAX = 6` …)". B020's contested "chair notes items 13–14" basis is gone. Its rule (cited, never re-minted) stands in §20's refinements. |
| B334 · B335 (old L538's scenario-to-finding index) | HOLD | The scenarios stand: 63 = 63 rows. After bracket stripping, only P36, P38, P41, P42, P49, P50, P53, P56 and P57 differ, and only by tag removal or a restated round label (P36, P50, P57). |
| B342 · B343 · B348 · B351 · B372 · B373 · B384 (§18 rows OD-PT-3, 4, 5, 18, 19, 27) | HOLD | Each ruling's text is verbatim minus tags. OD-PT-27: "the same-tick rule (to the deed) the fallback". OD-PT-19: "the `sourceEventRef` lookup plus the static skip …". |
| S01–S08 · S14–S33 · H01–H17 · U01–U06 · A02 · C01 · L03 · L06 · L07 · L09 · R01 · R03 · R65 · R97 · R118 · R164 · R227 (MOVED) | HOLD | The containment script found old L3–9, L640 and L648–893 verbatim in `history/PT-cure-record.md`. |
| L01 · L04 · L05 | HOLD | The title is verbatim. The header restates the three flags, "nothing scheduled", requirements 1–24 and the fold. |
| S09 · S10 · S11 · S12 · S13 | HOLD | The labels are removed and the content is intact: "the departure is a vetoable ruling (§18) or refinement (§20)" (L67); "PL's precedent" (L354); OD-PT-32's ruling (L586). §20's title is KEPT, with THE OPEN STOPS: none. |
| B240 (fold) | HOLD | Old: "PT's `party_gate` WIDENED to a road WHERE (no new kind; CH's words unchanged)… PR §8.2: 'fired by a patrolled traversal…'; CH gives persons the same road arm". New L349 says the same. Only "PT's row and PR's cite" is dropped, which is bookkeeping. |
| B246 (fold) | HOLD | CH's adoption is CONFIRMED in `history/CH-bracketed-1beabdc85.md` L652: "so the person's and the party's `banKeys` keep ONE ban and ONE lift rule". B246's "once D-CH-r4 lands" condition is therefore met. New L354 states the three clauses. |
| B247 (fold) | HOLD | New L354: "never the one ban-episode form `polity_ban:<subjectKey>:<banTick>`: a seat episode and a ban episode are two facts". The departure from A.8's letter is kept vetoable in §20 ("a departure from the letter of the one ban-episode form (§9.3)"). |
| B272 (fold) | HOLD | "(THE PATROLS, `DESIGN_FP_ARCH_PR.md`: PR8, PR19, PR §9.3, OD-PR-14/16)". The "§9.3" is correctly disambiguated to PR's. OD 44 = 44. |
| B297 (fold) | HOLD | §15 EDITOR line: "every actor is a real court, person or corps … — no PT kind has a menace actor (the party's hand on a menace is a deed, §3.1)". |
| B403 (fold) | HOLD | §19b row: `deed_acceptance` "…offer"), `deed_refusal`'s mirror". |
| B284 (fold into OD-PT-14) | HOLD | "three, `partyBackingEnabled` — never the brief's `partySanctionEnabled`, which would put the economic `sanctioned` word into code". Flags 17 = 17. |
| §0 seat-1 fix (old L54) | HOLD | The old list "`RULINGS-ROUND1.md` PT-r1-1 · PT-r1-2 · PT-r1-3" maps to new "the one whereabouts read `whereaboutsOf`, the institution deeds keyed on the target, one act one deed". RULINGS-ROUND1 PT-r1-1 is "ONE whereabouts read, `whereaboutsOf(party)`". The research rulings §1/§4/§5/§7 are named by their section titles (ONE PERSON SUBSTRATE · THE CARRIERS: bans, actor kinds · DEEDS, RUMOR AND REGARD: deed record, fixed order, credibility, tokens · TIER LINES). No substance beyond the names is added. |
| §6 seat-1 fix (old L263) · OD-PT-30 | HOLD | "§4's sites paragraph" now points to a paragraph that exists (new L261). |
| B178 · B179 (§7.2 seat-1 fix) | HOLD | Old B179: "NO NEW deed or telling SOURCE KIND is minted for a capture". New L287 matches word for word, with "NEW" restored. The widened parenthesis ("or a telling that arrived — RN's `heardAt` test") is folded. |
| B026 · B027 · B028 | HOLD | "THE ACTOR CONVENTION IS SIX KINDS, `settlement · person · party · menace · corps · body`" is B028's, the latest. B027's five-kind count is superseded, and its reasons are kept (L60). |
| B032 · B078 · B079 · B132 · B133 | HOLD | The doctrines are verbatim (L67). The proof words move into §2.4's `proof` row (L201). The menace paragraph (L226) is B132 + B133 verbatim, with "PT has no `DIRECT_MENACE`". |
| B067 · B068 · B069 · B070 · B071 · B074 | HOLD | The `banKeys` row (L129). B071's condition is met: CH's text of record at L209 has `banKeys?: [≤8 { settlementId, episode, untilTick }]`. `backerRole` stands beside the plain `{kind, id}` (L136). |
| B199 · B200 · B206 · B213 · B214 · B216 · B217 · B218 · N01 · A01 · B094 · B221 | HOLD | `backing_repudiated` takes both brackets: the tick form, and the tick-less `CHANGE_RULING_POWER` counting only behind a later stamped row (L305). §8.2's and §8.3's lead sentences are the heading brackets verbatim (L319, L328). §8.4 is B218's ONE integer, with "A ROAD CLOSED (PT-S1, slot C7)" (L331; N2). The ↳ row is folded into its parent (L292). §8.5's employment term (L334). |
| B234 · B235 · B238 · B253 · B254 · B258 · B262 · B269 · B278 · B393 | HOLD | The backer of record is "its EMPLOYER … else the `backing.by` of its newest unstruck backed deed" (L347). R-P5-9's four readings are all in §10.3 (L375). "usually swelling" is struck, and the alternative is at §20 (6). P36 restated by B262's own account. `road{a, b}` is PR's ONE STRETCH KEY (5×). |
| H18–H26 · H33–H42 (round words in the body) | HOLD | Each restates what the withdrawn thing did: "RN §6.1's `remove_npc` row … carries no '0.6 inside a backing's reach'"; "an inverse that only lifts the edges it wrote" (round 4a's own account); "without the DEADLINE arm" (the P5C-6 cure). §20 has 44 refinements, the old 45 less one merge. The open questions are the same ten items in order. Item (1)'s "RN's own volume carries the rest" is CONFIRMED in `history/RN-bracketed-1beabdc85.md` (THE TRIPLE; `siteId` ×14; "site … NEVER an actor"). |
| random 19: B024 B052 B116 B117 B136 B142 B145 B148 B164 B172 B190 B193 B194 B286 B306 B308 B314 B411 B418 | HOLD | Old and new were read side by side. Each is a stamp or change note whose change stands in the text, or its content is folded. B136 → L228's "a deed is the party's act and travels as a tale…". B142 → `heard_deed`, "REGARD_CAUSES gains no word" (L248). B148 → "PT's registration rows, never new rows of the landed ripple map" (L250). |
| whole-volume sweep (`alld.py` and `cov.py`: every old line 10–647 against its best new line; every inserted span checked against the same line's brackets) | HOLD | Every inserted span with low coverage traces to a named bracket on another line (`spatialLedgers.bodies.records` from B-L161) or to ledger §3's corrections. A reverse scan finds no new line without an old counterpart except the header, the guide, §21 and the corrections already listed. |
| THE READER'S GUIDE | 7 of 8 items HOLD · **item 3 FAILS (F1)** | above |
| THE RULINGS §18 | HOLD | 36 = 36 rows. The seven ⭐ labels are in the old text. The Ruled column agrees with the snapshot trace. |

**CONFIRMED vs PLAUSIBLE:** These are CONFIRMED by executed scripts and side-by-side reads:
- the ratchet re-run and its DRAFT explanation (line-by-line DRAFT map);
- the 159 allow-file locations;
- my marker count (546 unique, two double-counted);
- the cure-record containment;
- the § resolver;
- the snapshot trace of all 36 Ruled cells;
- the CH and RN text-of-record checks (B246, B071, §20 (1));
- every row receipt above and F1's four quoted passages.

Only the judgements that N2–N6 are not fidelity fails are PLAUSIBLE.
