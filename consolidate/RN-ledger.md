# RN — THE FIDELITY LEDGER OF THE CONSOLIDATION (P8, lane C-RN, seats 1 and 2; 2026-10-23) — COMPLETE: header..§5.6 by seat 1, §6–§19 by seat 2; 0 PENDING; 0 STOPs

Old text: `history/RN-bracketed-1beabdc85.md` (388,917 bytes, 1,060 lines), byte-identical to `docs/DESIGN_FP_ARCH_RN.md` at the start (`cmp`). New text: `consolidate/RN-new.md`, built by one script over the old text (the build lives in the seat's scratchpad `crn/`, continued in `crn2/` after a container restart: `scan.py` → `brackets.json`; `build.py` + `d00.py`…`d07.py` (seat 1) and `d08.py`…`d12.py` (seat 2); `ledger.py` → `ledger2.py` → `ledger3.py`; `mkledger.py` → `mkledger3.py`): bracket spans found by balanced matching, a stamp removed, a content bracket folded as its own text (prefix stripped) or as a written fold, every running-text substitution asserted to match exactly once — so every passage not named here is byte-faithful to `1beabdc85` minus its brackets.

## 1. THE COUNT (by script, before writing)
Markers in the old text: **581** = 449 brackets (balanced scan; `[CURED …]` 392 · `[REFINED …]` 41 · `[ADDED …]` 15 · `[STRUCK …]` 1; B303 at old line 420 is UNBALANCED — its outer `[ADDED …` never closes — and is counted closed at its line's end) + 7 `↳` outside brackets + 87 round words outside brackets + 16 `STOP` outside brackets + 2 `(fp-final …)` stamps outside brackets + 7 `ROUTED-UNAPPLIED` outside brackets + 4 header/status lines (old 3, 6, 7, 9) + 9 cure-record headers. The ratchet's MARKERS regex alone finds 470 in the old text. The ledger has **581 rows** (§7).

**Dispositions (final): old markers 581 · folded 501 · dropped 0 · moved 77 · kept 3 · pending 0.** Seat 1 (header..§5.6): folded 271 · moved 24 · kept 3. Seat 2 (§6–§19): folded 230 · moved 53 (the cure record's 9 round headers, 26 round words, 10 STOPs, 3 ↳ and 5 ROUTED-UNAPPLIED, all moved verbatim with old §19) · dropped 0. FOLDED rows that carry a partial drop, named in their rows: B205 (its closing claim superseded by B206) and B233 (its last sentence superseded by B234) in seat 1's range; in seat 2's, B301 (its live read `swornDeityOf(paragon)` superseded by B302's carried oath), B439 (STRUCK: OD-RN-41's office-scope clause, replaced by OD-RN-50) and B445–B447 (each supersedes a sentence of old §18's open questions: "a court means its ruler … unchanged here"; "not before"; "RN keeps … RN-r1-1's landed read").

**THE RESUMPTION (seat 1, continued 2026-10-23).** The first seat was cut off by a container restart after §2.4. The resuming seat confirmed `cmp` (old text = the volume), re-ran the saved build (`crn/` copied to `crn2/`) and got RN-new.md byte-identical (90,876 bytes) before appending, found §2.4 complete (rendered through old line 227, the `---`), found the ledger's rows matching the build's dispositions (145 brackets B000–B144 plus the outside markers of old lines 1–226), and read the header, THE READER'S GUIDE, THE OWNER'S WORDS, THE ANSWER and the fold scripts `d00.py`…`d04.py` against the old text: no fidelity error was found, so header..§2.4 stand as the first seat left them. It then wrote §3, §4 and §5 (`d05.py`…`d07.py`).

**SEAT 2 (2026-10-23).** Confirmed `cmp` (old text = the volume), re-ran the saved build and got RN-new.md byte-identical (175,074 bytes) before appending; wrote §6 (`d08.py`), §7–§9 (`d09.py`), §10–§12 (`d10.py`), §13–§15 (`d11.py`), §16–§19 (`d12.py`: §16 rebuilt as the final four-column table, §17 rendered, §18 and the new §19 written); after every rebuild `cmp` confirmed the first 175,074 bytes (seat 1's header..§5.6) unchanged. Seat 2 read the whole old text (§6–§18 bracket by bracket from the bracket-marked copy `crn2/read.md`, the cure record §19 whole). `ledger3.py` regenerated every row: seat 1's 298 disposed rows are unchanged in substance (25 differ in wording only — the new-§ column now prints `§2.1`/`§2.2`/`§2.4` for three ↳ rows and one round row, and the 21 header/status rows name `history/RN-cure-record.md`, which seat 2 wrote). The moved text is `history/RN-cure-record.md` (Part 1 = old lines 3–9, Part 2 = old lines 777–1060, each byte-identical, asserted by substring).

| old section | folded | dropped | moved | kept | pending | STOPs |
|---|---|---|---|---|---|---|
| header | 1 | 0 | 24 | 0 | 0 | 0 |
| OWNER'S WORDS/ANSWER | 1 | 0 | 0 | 0 | 0 | 0 |
| §0 | 11 | 0 | 0 | 0 | 0 | 0 |
| §1 | 24 | 0 | 0 | 0 | 0 | 0 |
| 2.1 | 42 | 0 | 0 | 0 | 0 | 0 |
| 2.2 | 19 | 0 | 0 | 0 | 0 | 0 |
| 2.3 | 25 | 0 | 0 | 0 | 0 | 0 |
| 2.4 | 24 | 0 | 0 | 0 | 0 | 0 |
| 3.1 | 38 | 0 | 0 | 0 | 0 | 0 |
| 3.2 | 4 | 0 | 0 | 0 | 0 | 0 |
| 3.3 | 2 | 0 | 0 | 0 | 0 | 0 |
| 3.4 | 6 | 0 | 0 | 0 | 0 | 0 |
| 4.1 | 5 | 0 | 0 | 0 | 0 | 0 |
| 4.2 | 1 | 0 | 0 | 0 | 0 | 0 |
| 4.3 | 8 | 0 | 0 | 0 | 0 | 0 |
| 4.4 | 4 | 0 | 0 | 0 | 0 | 0 |
| 4.5 | 2 | 0 | 0 | 0 | 0 | 0 |
| 4.6 | 2 | 0 | 0 | 0 | 0 | 0 |
| 5.1 | 22 | 0 | 0 | 0 | 0 | 0 |
| 5.2 | 4 | 0 | 0 | 0 | 0 | 0 |
| 5.3 | 5 | 0 | 0 | 0 | 0 | 0 |
| 5.4 | 4 | 0 | 0 | 3 | 0 | 0 |
| 5.5 | 13 | 0 | 0 | 0 | 0 | 0 |
| 5.6 | 4 | 0 | 0 | 0 | 0 | 0 |
| 6.1 | 16 | 0 | 0 | 0 | 0 | 0 |
| 6.2 | 28 | 0 | 0 | 0 | 0 | 0 |
| §7 | 7 | 0 | 0 | 0 | 0 | 0 |
| §8 | 3 | 0 | 0 | 0 | 0 | 0 |
| §9 | 2 | 0 | 0 | 0 | 0 | 0 |
| §10 | 7 | 0 | 0 | 0 | 0 | 0 |
| §11 | 5 | 0 | 0 | 0 | 0 | 0 |
| §12 | 3 | 0 | 0 | 0 | 0 | 0 |
| §13 | 22 | 0 | 0 | 0 | 0 | 0 |
| §14 | 24 | 0 | 0 | 0 | 0 | 0 |
| §15 | 72 | 0 | 0 | 0 | 0 | 0 |
| §16 | 19 | 0 | 0 | 0 | 0 | 0 |
| §17 | 3 | 0 | 0 | 0 | 0 | 0 |
| §18 | 19 | 0 | 0 | 0 | 0 | 0 |
| §19 | 0 | 0 | 53 | 0 | 0 | 0 |
| **all** | 501 | 0 | 77 | 3 | 0 | 0 |
STOPs of this pass: **none** (⛔ STOP RN-C-n: none raised, either seat). No conflict in header..§5.6 was left open by two brackets. In header..§2.4, every superseded statement names its successor in a later bracket (B097 → PT's five roles; B120 → B119 the sighting store; B122 the `holderKey` rename; B126's nested refinement striking `served_with` and `gift`). Later brackets amending §0–§5 were searched in §6–§19 (`struck|supersed|withdrawn|READ INSTEAD|replaces`): the eleven hits amend §6–§16 only (B302/B303 supersede the live `swornDeityOf` read in §6.2, compatible with §2.3's `lensOne` item). In §3–§5 every superseded statement names its successor in the text of record: B185 supersedes B182's rationale (the per-tick writer exists: THE ONE PERSON STAGE); B206 withdraws B205's "cannot disagree"; B234 supersedes B233's last sentence (READ INSTEAD: no capture deed or telling kind; a capture told by an existing telling reaches the home by `heardAt`); B249 supersedes the running clause "the fold §3.1 row naming the two leaves is the chair's" (THE RENOWN owns both leaves); B171 strikes the patrol row's leader-doer clause; B255 strikes the office-scope hearer rule (OD-RN-50); B260/B261 replace the crossing's "band a tick ago"; B192's quoted arrival formula yields to the text's clamped `hopWeeks` line. Later brackets touching §3–§5 were searched in §6–§19 by mechanism names (`mintDeed`, `projectScope`, `fameIn`, `fameOf`, `notorietyProjection`, `writeHeardTerm`, `courtRegardOf`, `actingOfficer`, `voiced_regard`, the slot sources, THE ONE PERSON STAGE, `TELLING_SOURCES`, `in_office` …) and by "§3/§4/§5" cites: none conflicts (B301 reads §5.2's `ACT_OFFICE` for §6.2's sworn-doer lens; B312 is §7's; B422 is §15's pin of ONE HUNT, ONE DEED; B445/B447/B448 in §18 agree with §5.5, §2.3 and §3.4's leak key `leak:body:<bodyId>:<courtId>:<sinceTick>`). In §6–§19 (seat 2) every superseded statement names its successor in the text of record, so no conflict was left open by two brackets: B302 replaces B301's live read with the telling's CARRIED oath ("THE BRACKET ABOVE IS SUPERSEDED IN ITS READ"); B303 rules the carrier (`ver` gains `oath`, OD-RN-52 ⭐) and its nested REFINED limits the temple officer's override to a heard version whose `oath` bit is set — that bracket itself names the one alternative reading ("the chair's §J.3 parenthetical may be read as keeping the override live, which would need a carrier this bracket cannot name") and resolves it, vetoably, so the text keeps the resolution and its vetoability ("vetoable: OD-RN-52's ruling may be read as keeping the override live …"), not a STOP; B439 strikes OD-RN-41's "its scope its ruler's office scope" (OD-RN-50); OD-RN-45 re-rules OD-RN-41's "exactly as `party_slander`"; OD-RN-41's "a crossing is the band now against the band a tick ago" yields to the later crossing test (§5.5, B260/B261, already folded by seat 1), so the row reads "(§5.5; REFINED)"; B445 withdraws old §18 (4)'s "a court means its ruler"; B446 admits THE BODIES' keys (old (5)'s "not before" removed); B447 rules old (6)'s pair-read question (OD-RN-48); B448 (i) marks CH's and PR's halves of old (7) LANDED. Brackets of §0–§5 that amend §6–§19: none beyond the agreements seat 1 listed (re-checked: §2.1's `terms`.`ver`'s `oath` bit row and §2.3's `lensOne` item agree with §6.2's SWORN-DOER READING and OD-RN-52).

## 2. THE SECTION MAP (old → new; COMPLETE)
Old lines 1–11 → the new 4-line header (title verbatim) + THE READER'S GUIDE (new, 8 items) + the dispatch-gate line; old lines 3–9 (the compile line, the bracket templates, the P6c line, the STATUS block) → `history/RN-cure-record.md` Part 1 (written by seat 2 with the cure record); old line 11 (the doctrines read against the volume) → the paragraph after THE ANSWER. THE OWNER'S WORDS and THE ANSWER keep their place (B004 folded as the answer's last sentence; "the chair reads" → "read"). §0–§18 keep their numbers and titles (every "§x" resolves unchanged). Old §19 THE CURE RECORD → history Part 2 (seat 2); the new §19 is THE REVIEW TRAIL (one line, CONSOLIDATE §2 item 10). Inside sections: §2.1's ↳ `terms`.`ver` row → "`terms`.`ver`'s `oath` bit (PROPOSED)", ⭐ OD-RN-52 kept; §2.4's two ↳ rows → "`REGARD_CAUSES` (THE OPPORTUNITY's row)" and "`DEED_SOURCES` (THE OPPORTUNITY's slot row)". §3–§5 keep their sub-sections and titles; inside them: §3.1 after the slot table reads B180's paragraph (no landed door for courts and ordinary persons), then B181's SITES CONSIDERED … PATROLS CONSIDERED paragraph, then The counterforce and Determinism; §3.2 opens with B182's standing sentence; §5.1 after RN-S1 reads B233's paragraph (THE OPPORTUNITY's pinned entry on THE ONE PERSON STAGE; the order RN → CH → OP → PT, also named in RN-S1's order sentence as "OP's stage (below)") and then B234's NO CAPTURE DEED, NO CAPTURE TELLING SOURCE paragraph, then The derived arm. RN-new.md ends with old line 384 (the `---` before §6). §6–§18 (seat 2) keep their numbers and titles; inside them: §6.1 reads B266's and B267's sentences after the band sentence, the three `opportunity_act` rows carry "(OP §2.4…; DRAFT, RN's to sign)" in their first cells; §6.2's B301–B303 are ONE paragraph, **THE SWORN-DOER READING**, between the μ paragraph and the owner's rule; §8's heading "(requirement 17; RULINGS-AFTER-RESEARCH §7)" → "(requirement 17; the research rulings)"; §12 opens with B332's sentence ("Two flags, not one …"); §13's round-labelled pin groups → "Pins" / "Further pins (OD-…)"; §16 is rebuilt as a four-column table (Row · The question · Ruling · Ruled), every row's ruling-file cites and finding ids removed, its heading adding "⭐ marks the OWNER's own rows, each VISIBLE"; the Ruled column's dates come from the brackets' stamps and the cure record (the compile 2026-10-17: OD-RN-1…20, OD-RN-18 by the after-compile rulings the same evening; the rounds of 2026-10-18: OD-RN-21…47, amendments of OD-RN-6/7/12/15/19/20; OD-RN-48 ruled 2026-10-18, applied 2026-10-19; 2026-10-19: OD-RN-49…51 and the amendments of OD-RN-19/21/41/45; 2026-10-20: OD-RN-52 ⭐ PROPOSED, the owner's to sign); §18 keeps its table (old row "SEAMS-r1-6 — RULED" → "THE PARTY'S VOICE — RULED", cite OD-RN-26), adds THE OPEN STOPS line (none), the REFINED list without round labels or dates, and THE OPEN QUESTIONS AND THE ROUTES (1)–(7) in final form (each the latest bracket's text; other volumes' sections named with their volume: PT §11.3, CH §16b, the fold's §3.3.12/§3.1.22/§3.1.25). Old §19 THE CURE RECORD (old lines 777–1060) → `history/RN-cure-record.md` Part 2; the new §19 is THE REVIEW TRAIL (one line). CROSS-REFERENCES: every "§x" of RN's own in RN-new.md resolves to a section that exists (§0–§19, 2.1–2.4, 3.1–3.4, 4.1–4.6, 5.1–5.6, 6.1–6.2 — checked by script over the whole text); the other "§" cites are other volumes' sections, each named with its volume (R3 §1d, BD §7.1–§7.3, BD §9.11, PT §11.3, CH §16b, the fold's §3.1.22/§3.1.24/§3.1.25/§3.3.12/§3.3.16).

## 3. TEXT CORRECTIONS THAT ARE NOT MARKERS (wording only; each keeps the latest ruling)
Ruling-file tags, finding ids and "the chair" removed from the running text of header..§2.4: §0 (the heading's "by this lane" → "at the compile"; RULINGS-ROUND1 ADDENDUM HOST-r1-7; HOST-r1-7; SEAMS-r1-8 / V-RN; RULINGS-ROUND2 B; D-RN-r2-N1; RULINGS-ROUND4 A.15 → "the court voice's relation factor (§5.5)"; RULINGS-ROUND4 §E / A.8 → OD-RN-48; the RULINGS-AFTER-RESEARCH line restated); §1 (A.8's form; RULINGS-ROUND4 §E; RN14's "RULED by the chair, `briefs/RULINGS-AFTER-COMPILE.md` RN-S1" → "(§5.1; OD-RN-18)"); §2.1 (RULINGS-ROUND2 B; RULINGS-ROUND1 PT-r1-3; RULINGS-ROUND5 B.5 ×2; RULINGS-ROUND4 A.16; "(routed)"; "PT's round-1 `voidsRef`" → "there is no separate `voidsRef`"; "§6.2's §J.3 bracket" → "§6.2"); §2.2 (A.12/A.7, A.7/ST-r2-14, A.8, "cured on BD's side in round 5"); §2.3 (CHAIR-NOTES 18 (d) → "the shared-leaf rule", named in the section's lead; RULINGS-P5 C.15; RULINGS-ROUND6 B.2 / ROUND5 A.5; H-PD-4; RULINGS-P6 §F.1/§F.3; `patronLean` kept as "never a `patronLean`"); §2.4 ("fold §5 rows owed (at P4)" → "the fold §5"; A.15; "P6c rows" → "`opportunity_act` rows"; P5 A.2 / date). Kept as evidence or names, not review labels: executed receipts under `cure/` (`D-RN-r2-probe`…`r5-probe`, `D-MN-RN-p5b-p5-probe`, `D-CH-r4-probe`), research cites (R1, R2, R3), compile-log items (`cure/L-RN.md`, L-BD n), the host-requirements document's name, the owner's dated words. Lint (`crn/lint.py`) over header..§2.4: no review vocabulary left beyond those.

§3–§5 (seat 1, continued), each a wording change that keeps the latest ruling: §3.1 ("D-PT-r2 §5.1(a)"; "RULINGS-ROUND1 PT-r1-3, SEAMS-r1-8"; "B.16"; "(RULINGS-ROUND2 B)" → "(OD-RN-28)"; "(RN-V7)"; "D-RN-r2-N1"; "RULINGS-ROUND1 ADDENDUM SEAMS-r1-3"; "PL §9 PL-8 as cured in P5" → "PL §9 PL-8"; "§9 U4's P5 bracket; the fold §6 C4 ↳ P5" → "§9 U4; the fold §6 C4"; "— routed"; "the round-1 slot `covert_exposed` is withdrawn" → "there is no RN slot `covert_exposed`"; "RULINGS-ROUND4 A.18:" (its quoted rule kept); "(B.5; ST §7.4's RN row, r5)" → "(OD-RN-49; ST §7.4's RN row)"; "RULINGS-ROUND2 B's rule" ×2 → "the `npc_verdict` row's rule"; "RULINGS-ROUND2 A.3's ruled-against" → "the ruled-against"; "RULINGS-ROUND5 B.2"; "(B.5)" → "(OD-RN-49)"; "RULINGS-P6 §G.6 / §D.2 / §E.7 Q2 / G.1"); B181's inner text ("RULINGS-ROUND2 §E · L-ST item 20(c)"; "RULINGS-ROUND2b ADDENDUM ST-r2-14; RULINGS-ROUND3 A.7 — the round-2 … is withdrawn" → "ST's actor convention gains no `site`"; "as cured" ×2; "RULINGS-ROUND2b HOST-r2-5"); §3.4 ("on the verifier's five-town graph" → "on a five-town graph"; "the cured seed" → "the seed"; "the round-3 text's seed … reached" → "a seed whose origin is the meeting town, the guard unstamped, reaches"); §4.4 (the sentence "The round-2 bracket's … holds UP TO the stamp" removed — its limit is written into B209's folded sentence); §5.1 ("`briefs/RULINGS-AFTER-COMPILE.md` RN-S1" → "OD-RN-18"); §5.2 ("— routed to the chair"; "after RULINGS-ROUND1 CH-r1-3, … unless the chair gives ordinary roamers a wave" → "paragons move by their own leg (CH), so it stays callerless unless ordinary roamers are given a wave"); §5.4 ("the fold §3.1 row naming the two leaves is the chair's" REMOVED as superseded by B249); §5.5 ("RN-r1-21"; "RULINGS-ROUND1 ADDENDUM SEAMS-r1-6; RULINGS-ROUND2 A.5" → "OD-RN-26"; "RULINGS-ROUND3 A.11:" → "OD-RN-41; the voice's trigger:"; "RULINGS-ROUND5 B.10: …" → "OD-RN-50: …"; "(A.15, below)" → "(below)"; "round 4's \"office scope\" … reached" → "the ruler's office scope … would reach"; "RULINGS-ROUND4 A.15" → "OD-RN-45"; "RULINGS-ROUND4 §E:"; "the round-3 formula gave −0.5 (`enmity`) to every hearer" → B258's three faults of a flat −0.5; "A.11's trigger" ×2 → "the voice's trigger"); §5.6 ("as RULINGS-PL-MN SMN-19 records"; "— the last by P5 (WC-RN-49, <date> (fp-final P5))"). The OD ids substituted for ruling-file cites are the ones §16 already records for those rulings (OD-RN-18 the stage, OD-RN-26 the party voice, OD-RN-28 the verdict door, OD-RN-41/45/50 the court voice, OD-RN-48 belief, OD-RN-49 ONE HUNT, ONE DEED) — cross-references, nothing ruled anew. Kept as names or evidence, not review labels: `cure/…` probe receipts, R1/R2/R3 research cites (R2 R-2, R-13, R-14, R-18, hazards 2/4/15; R1 RF-6, RF-16, RF-17), L-BD n compile items, wave and car names (RN-0…RN-5, PT-4, CH-3, CH-7, CH-10, WC-10, BD-4, OP-3, PL-8, ENC-3, WR-7d, SP-9, W-H1/W-H2/W-H3), the FP-46 roster, ODQ §129.2, plague-R7, the owner's party brief §8, and the slot marks ⛔ RN-S2/RN-S3/RN-S4. Lint over §3–§5: no review vocabulary left beyond those (its remaining hits are the design words "the operative's findings", "the store-action lane" and the kept STOP slots).

§6–§19 (seat 2), each a wording change that keeps the latest ruling (the OD ids are the ones §16 records for those rulings — cross-references, nothing ruled anew): §6.1 ("(RULINGS-ROUND2 A.2: …)" → "(a `spoken` or `shown` mark replaces)"; "that RULINGS-ROUND1 PT-r1-2 keys" → "keyed"; "the ADDENDUM's general form" → "the general form"; "(PT-r1-2's institution rows)" → "(PT's institution rows)"); §6.2 ("(RULINGS-ROUND4 §E; A.8's form)" → "(OD-RN-48)"; "round 4's net" → "the true label's net"; "round 4's truth read" → "the truth read"; "on the cured formula" → "on this formula"; "(§6.1; RULINGS-ROUND2 A.2)" → "(§6.1)"; B301–B303's provenance and "kept, not deleted" clauses removed, "the 09-12 carve-out" → "the owner's carve-out", "the chair's §J.3 parenthetical" → "OD-RN-52's ruling", "the ↳ row at §2.1's `terms`" → "§2.1's `terms`.`ver`'s `oath` bit", "(§2.3's P6c bracket)" → "(§2.3)"); §7 ("(RULINGS-ROUND2 A.1)" → "(OD-RN-15)"; "is no longer scaled by it (RULINGS-ROUND2 A.2, §6.1)" → "is never scaled by it (§6.1)"); §8 (the heading's ruling file → "the research rulings"; "RULED COMPATIBLE (RULINGS-ROUND1 ADDENDUM HOST-r1-2)" → "RULED COMPATIBLE"); §9 ("chair notes item 2" removed); §10 ("(D-RN-r2-N1)" removed; "RULINGS-ROUND4 §E" → "OD-RN-48"; "B.10" → "OD-RN-50"; "A.15's relation factor" → "the court voice's relation factor, OD-RN-45,"); §11 ("A.11" → "OD-RN-41"; "(B.5)" → "(OD-RN-49)"); §12 ("SEAMS-r2-6" → "OD-RN-36"; "RULINGS-ROUND4 B" → "OD-RN-46"; "RULINGS-ROUND5 B.5 · B.16" → "OD-RN-49"; "A.11" → "OD-RN-41"); §13 ("(fold §6, at P4)" → "(fold §6)"; "(chair notes item 6)" removed; "(PT's lane; the fold's bracket is the chair's)" → "(PT's and the fold's)"; "MEASURED in round 2" → "MEASURED"; "V-RN's probe" → "the probe"; "SEAMS-r1-8" → "OD-RN-27"; "D-CH-r2 §5.2(d)" → "OD-RN-38"; "(SEAMS-r2-6, D-PT-r2 §5.1(a))" → "(OD-RN-36)"; "(RULINGS-ROUND3 B)" removed; the round-labelled pin groups → "Pins" or "Further pins (OD-…)" as the ledger's H-rows name; "the round-4 text's two deeds" → "two deeds for one success"; "D-CH-r2 §5.2(a)", "SEAMS-r2-11", "SEAMS-r2-6" removed; "byte-identical to round 4" → "to the truth read"; "round 4's office scope" → "the ruler's office scope"; "the bodies' rate, round 4" → "the bodies' rate"; "(RN-r1-31)", "(chair notes item 1; RN-r1-26)" removed; "(the `export` keyword, A.15)" → "(…, OD-RN-45)"); §14 ("(B.5)" → "(OD-RN-49)"; "(chair notes item 1)" removed; "(OD-RN-14, accepted by the chair)" → "(OD-RN-14)"; "(the old \"~200 bytes plus a ≤ 64-hop map\" understated it several-fold)" → "(an estimate of … understates it several-fold)"); §15 (R51 "(`readBeliefRelationship`, A.8's form; RULINGS-ROUND4 §E)" → "(`readBeliefRelationship`; OD-RN-48)" and "(CHAIR-NOTES 18 (d))" → "(the shared-leaf rule, §2.3)"; R59 "the old −0.5" → "a flat −0.5"; R62 "B.10" → "OD-RN-50"; R69 "exactly as round 4" → "exactly as the truth read"); §16 (every row's ruling-file cites, finding ids, "RULED by the chair", "ACCEPTED by the chair (RULINGS-AFTER-COMPILE)" → "ACCEPTED", "ROUND n adds"/"round n:"/"since round 5" removed, "A.15's relation factor" → "the court voice's relation factor (OD-RN-45)", "(CHAIR-NOTES 18 (d); REFINED) — RULED BY THE CHAIR (`briefs/RULINGS-ROUND4.md` §E, by delegation, vetoable)" → "(the shared-leaf rule, §2.3; REFINED)", "(§6.2's §J.3 bracket)" → "(§6.2's sworn-doer reading)", "P7 carries the visible row" → "the fold §7 and ODQ §934.94 carry the visible row"); §17 ("RULINGS-ROUND3 A.11, RULINGS-ROUND4 A.15" → "OD-RN-41, OD-RN-45"; "; round 4" removed; "round 5, B.5" → "OD-RN-49"; "RULINGS-ROUND5 B.10" → "OD-RN-50"); §18 ("SEAMS-r1-6 — RULED" → "THE PARTY'S VOICE — RULED"; "(RULINGS-AFTER-COMPILE; …)" → "(OD-RN-18; …)"; "(RULINGS-ROUND1 ADDENDUM; RULINGS-ROUND2 A.5)" → "(OD-RN-26)"; "OPEN FOR THE CHAIR:" → "THE OPEN QUESTIONS AND THE ROUTES"; the lane-log cites `cure/D-RN-r2.md` … `cure/D-RN-r5.md` §5 and `briefs/L-BD.md` removed; "(the chair's)" → "(the fold's)"; "the fold at P4" → "the fold"; finding ids (SEAMS-r1-n, HOST-r1-n, SEAMS-r4-13), ruling cites (A.n, B.n, C.25, §E, RULINGS-ROUND4 A.12) and times ("checked at 18:0x", "07:3x EDT") removed; "(A.1, A.4)" → "(OD-RN-15, OD-RN-32)"; "RN-S1 and the deed ledger's ownership are RULED (RULINGS-AFTER-COMPILE)" → "(OD-RN-18, OD-RN-4)"). Kept as names or evidence: the `cure/…-probe/…` receipts, `cure/L-RN-probe/…`, the host-requirements document's name, R2/R3 research cites, L-BD n compile items, R-RN-n refinement ids, wave and car names, PT's pin P8, CH S65/S68, ODQ §934.94, OD-FC/OD-BD/OD-CH ids. Lint over §6–§19 (`lint.py` plus a wider pattern: bracket, ADDENDUM, RULINGS, chair, verifier, skeptic, round, P4–P8, routed, cured, struck, withdrawn, finding ids, ⟦, ↳, dates): no review vocabulary left outside §16's Ruled column, §16's heading and §19's one line, beyond design words ("round trip", "UNLED round", "the findings" telling, "a struck deed", "the faith local lane").

## 4. ALLOW-MISSING (COMPLETE — `consolidate/RN-allow.txt` mirrors it, one token per line, a reason per class in its comment lines; 153 tokens: seat 1's 32 + seat 2's 121)
- HEADER TEMPLATES AND REVIEW-TRAIL PATHS: the three bracket templates of old lines 6, 7, 9; `…/cure/BRACKETS-A2-program-volumes.md`; `cure/D-RN-r1.md`; `cure/D-RN-r2-probe/` — moved with the header block or a change note; they stay in history and git. (Seat 2: the STATUS line's other paths — `briefs/RULINGS-*.md`, `skeptic/…`, `cure/D-RN-r*.md` — will join this list where no body passage keeps them.)
- SUPERSEDED NAMES AND SHAPES: `bodyKey` (→ `holderKey`, B122); `leak:body:<bodyId>:<sponsorId>:<sinceTick>` (→ `…:<courtId>:…`, B132); `party · person · settlement` (→ the six kinds, B053); `polity: true` (→ PT's five `backerRole`s, B097); `week` (struck from the regard entry; each term carries its `tick`, B077).
- SHORT FORMS AND CHANGE-NOTE QUOTES: `components/map/` (the full `src/components/map/heraldWanderers.js` stands); `leak:body` (the full grammar stands); `hash01` (a quote of the ruling that chose the landed hash; `fnv1a32` stands); `magnitude/3` (lens two's term, stated in §6.2 by seat 2's text if kept there); `enemy_in_service` (CH's read, named only in a removed cross-volume change note; it stands in CH).
- TOKENIZER ARTIFACTS: the ratchet's 200-character token bound skips the 205-character `REGARD_CAUSES` word list (old 210 / new §2.4) and the double-backtick code spans (old 58, 59, 225), so it pairs those rows' backticks off by one in BOTH texts and reports different garbage pairs; the twelve real tokens listed in the allow file stand backticked in the new text (string search: `paid_well`, `slandered`, `handsome`, `princely`, `ransom_granted`, `LURE_AXES`, `employer`, `defensiveTerrain`, `mapProfile.js`, `'exposed', 'open', 'mixed', 'sheltered'`, `party.remove_npc.remove_an_npc.s1`), plus one garbage pair of old 225.
- §3–§5 REVIEW-TRAIL PATHS (dropped with change notes and ruling cites; kept nowhere else in the old text): `briefs/RULINGS-AFTER-COMPILE.md` (RN-S1's ruling file; the ruling stands as OD-RN-18, §5.1 and §16) · `cure/D-BD-r5.md` (in B150, a change note; the ruling stands as OD-RN-49).
- §3–§5 SUPERSEDED FORMS QUOTED ONLY IN CHANGE NOTES: `arrivalTick = tick + hopWeeks(meeting, seat, season)` (B192's quote; superseded by §3.4's "0 when they are one town … else `Math.max(1, finiteNumber(hopWeeks(digest, meetingId, seatId, season), 1))`") · `applyMode: 'auto'` (B264: the verbs once borrowed the party door's auto mode; superseded by "No exemption from the proposal queue is claimed", §5.6).
- FOR SEAT 2 — RESOLVED (seat 1's list of tokens its dropped change notes carried that §6–§19 still carried): `:<retainer.sinceTick>` SURVIVES in the new text (§15 R63); fourteen survive verbatim in `history/RN-cure-record.md` (the moved cure record carries each) and are allow-listed under SEAT 1's DROPS (or, for `cure/L-BD.md` and `cure/D-CH-r5.md`, which seat 2's own change notes also carried, under seat 2's review-trail paths); `skeptic/BRACKETS-p6c-verify.md` occurred only in bracket provenance (old lines 154, 338, 420) and survives in the text of record `history/RN-bracketed-1beabdc85.md` and git (`1beabdc85`), not in the cure record. Seat 1's list was: `:<retainer.sinceTick>` (a short form; the full `leak:<wnpcId>:<employerId>:<retainer.sinceTick>` stands in §3.4) · `fourth, home, meet, post, third` (a verifier's quoted probe output) · `cure/D-BD-r4.md` · `cure/D-BRACKETS-p5.md` · `cure/D-CH-r3.md` · `cure/D-CH-r4.md` · `cure/D-CH-r5.md` · `cure/D-FOLD-p5.md` · `cure/D-PL-r2b.md` · `cure/D-ST-r4.md` · `cure/D-ST-r5.md` · `cure/L-BD.md` · `skeptic/BRACKETS-p6c-verify.md` · `skeptic/PT-r2-verify.md` · `skeptic/RN-r3-verify.md` · `skeptic/ST-r4-verify.md`.
- SEAT 2 — §6–§18 REVIEW-TRAIL PATHS (12; dropped with change notes, ruling cites and route lists; each ruling stands as its OD id in §16): `cure/D-CH-r5.md` (B278) · `cure/D-PT-r4.md` (B279) · `cure/L-BD.md` (B276) · `cure/L-CH-PD.md` (B301's provenance) · `skeptic/BRACKETS-p6c-verify.md` (B303's provenance) · `briefs/L-BD.md` (old §18 (5): "THE BODIES (`briefs/L-BD.md`, compiling)") · `briefs/RULINGS-ROUND4.md` (OD-RN-48's "RULED BY THE CHAIR (`briefs/RULINGS-ROUND4.md` §E …)") · `cure/D-RN-r2.md` · `cure/D-RN-r2b.md` · `cure/D-RN-r3.md` · `cure/D-RN-r4.md` · `cure/D-RN-r5.md` (old §18 (1)/(3)/(5)/(6)/(7)'s lane-log cites).
- SEAT 2 — PROBE OUTPUT DETAIL (2): `one` · `reading` — B300's quote of the superseded receipt's two field names; the re-executed receipt `cure/D-RN-r2-probe/r2Probe.out.json` a with `goodNonRival_m02.reading` = 0.18 stands in §6.2.
- TOKENIZER ARTIFACTS (2): `betrayed` · `sheltered` — backticked in seat 1's §2.4 `REGARD_CAUSES` row (string search finds each), mis-paired by the ratchet's tokenizer there; their other occurrences were in the moved cure record.
- SEAT 1's DROPS WHOSE OTHER OCCURRENCES WERE ONLY IN THE CURE RECORD (19): seat 1's checks counted a dropped token as kept while old lines 385–1060 carried it; with old §19 moved, these are absent from the volume: `briefs/RULINGS-ROUND2b.md` · `cure/D-BD-p5.md` · `cure/D-BD-r4.md` · `cure/D-BRACKETS-p5.md` · `cure/D-CH-r3.md` · `cure/D-CH-r4.md` · `cure/D-FOLD-p5.md` · `cure/D-PL-r2b.md` · `cure/D-ST-r4.md` · `cure/D-ST-r5.md` · `fourth, home, meet, post, third` · `hashInt` (B-bracket quote of the superseded hash; `fnv1a32` stands) · `menace` (a reviewer's quote; the menace's reason stands in words, §2.2) · `paid_well · sheltered · slandered` (a ruling quote; the three causes stand in §2.4) · `seenBy` (the superseded sighting write; MN's one store stands, §2.3) · `skeptic/FOLD-r2-verify.md` · `skeptic/PT-r2-verify.md` · `skeptic/RN-r3-verify.md` · `skeptic/ST-r4-verify.md`.
- MOVED WITH THE CURE RECORD AND THE HEADER BLOCK (86): every token only old §19 (lines 777–1060) or the moved header lines 3–9 carried — the round logs, probes, censuses, edit records and skeptic reports (`cure/D-*-r4.md`, `RN-before-r2b.md`, `apply_r3.py`, `skeptic/SEAMS-r4.md` …), the ruling files (`briefs/RULINGS-P5.md`, `briefs/RULINGS-ROUND2.md`, `briefs/RULINGS-ROUND3.md`, `briefs/RULINGS-ROUND5.md`), and the cure record's quotations (`CAUSE_LINE`, `K`, `credibilityWeight`, `paragonLean`, `factionPairOf`, `leak:body:<bodyId>:<employerId>:<sinceTick>`, `× relationFactor`, `significance`, `score` …) — each byte-identical in `history/RN-cure-record.md`.
Checks over header..§5.6 (seat 1: tokens of old lines 1–384 absent from the new text and from old lines 385–1060): exactly the allow file's 32 entries, none more and none unneeded. Checks over the whole volume (seat 2, `crn2/miss.py`): the 121 tokens of the old text absent from the new text and from the allow file before seat 2's entries are exactly seat 2's 121 entries (12 + 2 + 2 + 19 + 86), each classed by where the old text carried it. `path :: symbol` cites of old lines 1–384: none missing (`src/domain/opportunity/opportunityStage.js :: advanceOpportunities` and `npcVerdictTable.js :: npcVerdictFor` kept in folded text). OD ids of old lines 1–384: none missing. Flags and wave ids of old lines 1–384: none missing. In §3–§5: ⭐ 0 → 0 · DRAFT 23 → 23 · UNMEASURED 7 → 7 · CONFIRMED 1 → 1; PLAUSIBLE 3 → 2 (B193's "PLAUSIBLE until RN's arm took a registered source" was the past status of CH's seam, superseded when RN's arm took the closed list) and EXECUTED 12 → 11 (B258's "EXECUTED" reported the fault of the old flat formula; its content is folded in words) — neither is a ratchet count; both disclosed here.

## 5. THE RATCHET (final)
`python3 tools/consolidate-ratchet.py history/RN-bracketed-1beabdc85.md consolidate/RN-new.md --allow-missing-file consolidate/RN-allow.txt`, and the same over `docs/DESIGN_FP_ARCH_RN.md` after the copy (identical output):
```
tokens: old 1381 · new 1244 · missing 0 · new-in-new 16
  NEW tokens in the new text (each must be a registered name, never a mint):
   + " — 
   + ), a regard cause only, never printed bare (CH: "Ashford gave her shelter when Merewick's crown had barred her"); the fold §5's 
   + ), subject the court whose answer in the ransom race was 
   + ), written ONCE by RN's writer at that close, keyed by the race's engagement id — the warm twin of the landed 
   + , SLOT C1), so RN's §14 normalizer now keeps them; FREE as literals (
   + , a HOMONYM of the landed 
   + , landed in 22 source files and CH's P3 field, is avoided). · 
   + /
   + 1beabdc85
   + ; DARK until ES-2b's custody wave and the race land (opened by delegation; the wave order stands); 
   + cure/
   + history/RN-cure-record.md
   + regardLedger.js :: writeHeardTerm
   + settlement-engine-kits/fp-final-a73343ed-2026-10-17/
   + settlement-engine-kits/fp-final-a73343ed-2026-10-17/history/RN-cure-record.md
   + skeptic/
cites (path :: symbol): old 87 · new 87 · missing 0
laws (XX1–XXn bold): old 16 · new 16
OD rulings: old 62 · new 60  ← FEWER (explain in the ledger)
owner rows ⭐: old 3 · new 7
DRAFT marks: old 59 · new 54  ← FEWER (explain in the ledger)
UNMEASURED marks: old 15 · new 14  ← FEWER (explain in the ledger)
wave ids (XX-n): old 9 · new 9
flags (…Enabled): old 23 · new 23
review markers left in the new text: 0
RATCHET 3 DIFFERENCE CLASSES
```

Every remaining difference is the moved cure record or header block — none is a lost design fact:
- **OD rulings 62 → 60**: `OD-FC-47` (old lines 904, 978) and `OD-FC-63` (old line 922) occur ONLY in the moved cure record (history Part 2). Every OD id of the body of record (old lines 1–776) survives: §16 holds OD-RN-1…OD-RN-52, each once.
- **DRAFT 59 → 54**: four are in the moved cure record and one in the moved header line 7 (the P6c line's "DRAFT values"); the body of record's 54 = the new text's 54 (seat 1's range 26 = 26, seat 2's §6–§18 28 = 28, counted per section).
- **UNMEASURED 15 → 14**: the one other is in the moved cure record; the body's 14 = 14.
- **tokens: missing 0** with the allow file; **cites 87 = 87** (every `path :: symbol` survives); **laws 16 = 16 · wave ids 9 = 9 · flags 23 = 23 · ⭐ 3 → 7** (§16's heading, OD-RN-52's row and Ruled cell, §6.2's carrier sentence) · **review markers left 0**.
- NEW tokens 16: seat 1's tokenizer pairings of §2.4's long rows and the guide's first item (the seven garbage pairs and `/`), THE READER'S GUIDE's cite `regardLedger.js :: writeHeardTerm` (the one regard writer the old text names as `writeHeardTerm` in `renown/regardLedger.js`), and the trail names `1beabdc85`, `cure/`, `skeptic/`, `history/RN-cure-record.md` and the kit paths of the header — registered names and trail paths, no mint.
- Per section (seat 2, `crn2` check): DRAFT, UNMEASURED, PLAUSIBLE, FP-46, ⛔ and `path :: symbol` cites equal in every section §6–§18; EXECUTED 17 → 18 (§6.2's folded receipts); OD ids per section never fewer.

## 6. THE COMPLETION NOTE
- METHOD: `crn2/build.py` execs `d00.py`…`d12.py` over the old text (`brackets.json` from `scan.py`; `read.md` from `readcopy.py`); `ledger3.py` regenerates §7's rows and the per-section table; `mkledger3.py` wrote this head; `miss.py` classes every missing token by where the old text carried it; `lint.py` scans for review language.
- THE COPY: `consolidate/RN-new.md` (296,386 bytes, 794 lines) = the build's output; after the ratchet, ONE `cp consolidate/RN-new.md docs/DESIGN_FP_ARCH_RN.md`; `cmp` then reads identical.
- FOR THE VERIFIER: sample §6–§19's rows against `history/RN-bracketed-1beabdc85.md`; the riskiest folds are §6.2's SWORN-DOER READING (B301–B303 as one paragraph), §16 (rebuilt as a table; the Ruled column derived from the stamps and the cure record; OD-RN-41's final clause list; the two "(supersedes OD-RN-41 …)" notes on OD-RN-45 and OD-RN-50), §18's open questions (1)–(7) (each the latest bracket's text), and §13's "Further pins (OD-…)" labels (each OD id is the §16 row that records the ruling the round's pins came from).


## 7. THE ROWS (one per marker; `B` = bracket by index in old-text order · `A` = `↳` outside brackets · `H` = round word outside brackets · `S` = `STOP` outside brackets · `F` = `(fp-final …)` outside brackets · `U` = `ROUTED-UNAPPLIED` outside brackets · `L` = header/status line · `R` = cure-record header)

| id | old line | old section | first characters | disposition | new § | what happened |
|---|---|---|---|---|---|---|
| B000 | L6 | header | `[REFINED 2026-10-17 (fp-final) — …]` | MOVED | history | the header/status template moved with the header block (old lines 3–9) to history Part 1 |
| B001 | L7 | header | `[ADDED 2026-10-20 (fp-final P6c; <route>) — …]` | MOVED | history | the header/status template moved with the header block (old lines 3–9) to history Part 1 |
| B002 | L9 | header | `[CURED 2026-10-20 (fp-final P5) — <id>: …]` | MOVED | history | the header/status template moved with the header block (old lines 3–9) to history Part 1 |
| B003 | L11 | header | `[REFINED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E: the o` | FOLDED | THE OWNER'S WORDS | the doctrines read against this volume, folded as the paragraph after THE ANSWER |
| B004 | L21 | OWNER'S WORDS/ANSWER | `[CURED 2026-10-18 (fp-final r1) — RN-r1-14: a person or a co` | FOLDED | THE ANSWER | folded as the answer's closing sentence |
| B005 | L34 | §0 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-6 · RN-r1-24: the wr` | FOLDED | §0 | a change note: the row at the same place already carries the change |
| B006 | L35 | §0 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-5: a landed fade RN ` | FOLDED | §0 | a change note: the row at the same place already carries the change |
| B007 | L36 | §0 | `[CURED 2026-10-18 (fp-final r3) — the verifier's carried min` | FOLDED | §0 | a change note: the row at the same place already carries the change |
| B008 | L43 | §0 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-25 · RN-r1-20]` | FOLDED | §0 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B009 | L53 | §0 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND4 §E OD-RN-48` | FOLDED | §0 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B010 | L55 | §0 | `[CURED 2026-10-18 (fp-final r2) — HOST-r1-7]` | FOLDED | §0 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B011 | L63 | §0 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-1 · RN-r1-8 · HOST-r` | FOLDED | §0 | a change note: the row at the same place already carries the change |
| B012 | L63 | §0 | `[CURED 2026-10-18 (fp-final r2) — HOST-r1-7 · SEAMS-r1-8 · R` | FOLDED | §0 | a change note: the row at the same place already carries the change |
| B013 | L63 | §0 | `[CURED 2026-10-18 (fp-final r4) — RN-W1 · A.15: the 'posture` | FOLDED | §0 | a change note: the row at the same place already carries the change |
| B014 | L63 | §0 | `[CURED 2026-10-19 (fp-final r5) — RN-r4-verify FAIL A.8 → RU` | FOLDED | §0 | a change note: the row at the same place already carries the change |
| B015 | L81 | §1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6 · SEAMS-r2-13: ` | FOLDED | §1 | its content folded as sentences of the law it amended |
| B016 | L81 | §1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes ('cure/L-BD.md` | FOLDED | §1 | its content folded as sentences of the law it amended |
| B017 | L85 | §1 | `[REFINED 2026-10-18 (fp-final r3) — RN-V7's pace]` | FOLDED | §1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B018 | L85 | §1 | `[CURED 2026-10-18 (fp-final r3) — the carried minor on §4.3]` | FOLDED | §1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B019 | L85 | §1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-4 · RN-r1-11: the ob` | FOLDED | §1 | a change note: the law at the same place already carries the change |
| B020 | L85 | §1 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-11 (RULINGS-ROUND2 B` | FOLDED | §1 | a change note: the law at the same place already carries the change |
| B021 | L87 | §1 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-6 (RULINGS-ROUND2 B)` | FOLDED | §1 | a change note: the law at the same place already carries the change |
| B022 | L87 | §1 | `[CURED 2026-10-18 (fp-final r3) — RN-V7]` | FOLDED | §1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B023 | L87 | §1 | `[REFINED 2026-10-17 (fp-final) — R-RN-10/12: the notoriety f` | FOLDED | §1 | its one design fact folded into RN4 |
| B024 | L87 | §1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-6 (RULINGS-ROUND1 RN` | FOLDED | §1 | a change note: the law at the same place already carries the change |
| B025 | L89 | §1 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND4 §E OD-RN-48` | FOLDED | §1 | a change note: the law at the same place already carries the change |
| B026 | L89 | §1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-16: weakness defined` | FOLDED | §1 | a change note: the law at the same place already carries the change |
| B027 | L93 | §1 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-12 (RULINGS-ROUND2 A` | FOLDED | §1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B028 | L93 | §1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-2 (RULINGS-ROUND1 RN` | FOLDED | §1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B029 | L97 | §1 | `[CURED 2026-10-19 (fp-final r5) — OD-RN-48]` | FOLDED | §1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B030 | L97 | §1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-1 (RULINGS-ROUND1 RN` | FOLDED | §1 | a change note: the law at the same place already carries the change |
| B031 | L97 | §1 | `[CURED 2026-10-18 (fp-final r2) — HOST-r1-7 (RULINGS-ROUND1 ` | FOLDED | §1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B032 | L99 | §1 | `[REFINED 2026-10-17 (fp-final) — R-RN-7: the brief left the ` | FOLDED | §1 | its rationale folded as RN10's closing sentence |
| B033 | L101 | §1 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-9 · RN-r1-15 · RN` | FOLDED | §1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B034 | L109 | §1 | `[CURED 2026-10-18 (fp-final r3) — the carried minor on §4.3]` | FOLDED | §1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B035 | L109 | §1 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-2.]` | FOLDED | §1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B036 | L111 | §1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-2]` | FOLDED | §1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B037 | L111 | §1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6 ('briefs/RULING` | FOLDED | §1 | its content folded as sentences of the law it amended |
| B038 | L111 | §1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes: a NAMED BODY ` | FOLDED | §1 | its content folded as sentences of the law it amended |
| B039 | L119 | 2.1 | `[REFINED 2026-10-17 (fp-final) — R-RN-9: RN owns the deed le` | FOLDED | §2.1 | its ownership statement folded after THE DEED's lead sentence |
| B040 | L123 | 2.1 | `[REFINED 2026-10-18 (fp-final r3) — found applying RULINGS-R` | FOLDED | §2.1 | its rationale folded into the `deedId` cell |
| B041 | L123 | 2.1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-18]` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B042 | L123 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-8 (RULINGS-ROUND2` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B043 | L126 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — D-PT-r2 §5.1(b): "always" ` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B044 | L126 | 2.1 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-8 · RN-r1-10]` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B045 | L126 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-8 (the verifier's` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B046 | L127 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-8 · RN-r1-10: the` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B047 | L128 | 2.1 | `[REFINED 2026-10-18 (fp-final r3) — the deed id's collision ` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B048 | L129 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(b) (RULINGS-ROUND2 A` | FOLDED | §2.1 | its census folded into the `kind` cell |
| B049 | L130 | 2.1 | `[CURED 2026-10-19 (fp-final r5) — 'cure/D-CH-r5.md' §5 RN]` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B050 | L130 | 2.1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes ('cure/L-BD.md` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B051 | L130 | 2.1 | `[CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.7 "RN ('l` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B052 | L130 | 2.1 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 B.5 · RN-r4` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B053 | L130 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6: the doer value` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B054 | L130 | 2.1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-1]` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B055 | L130 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V4: the round-1 rule ov` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B056 | L131 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6]` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B057 | L131 | 2.1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes; L-BD 33]` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B058 | L131 | 2.1 | `[CURED 2026-10-19 (fp-final r5) — B.5 · RU-CH-h ('cure/D-CH-` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B059 | L131 | 2.1 | `[CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 B for RN (P` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B060 | L131 | 2.1 | `[REFINED 2026-10-18 (fp-final r4) — found checking A.16]` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B061 | L134 | 2.1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-29 · RN-r1-26: with ` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B062 | L135 | 2.1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-22]` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B063 | L136 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(d) (RULINGS-ROUND2 A` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B064 | L137 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(c) (RULINGS-ROUND2 A` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B065 | L138 | 2.1 | `[CURED 2026-10-18 (fp-final r1) — RULINGS-AFTER-COMPILE RN ·` | FOLDED | §2.1 | its census folded into the `proof` cell |
| B066 | L140 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(d) (RULINGS-ROUND2 A` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B067 | L141 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(d) · the verifier's ` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B068 | L142 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(d)]` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B069 | L143 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — D-PT-r2 §5.1(a): PT's roun` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B070 | L144 | 2.1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-15]` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B071 | L146 | 2.1 | `[REFINED 2026-10-18 (fp-final r4) — the seam between PR §9.3` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B072 | L148 | 2.1 | `[REFINED 2026-10-17 (fp-final) — R-RN-5: an entry is persist` | FOLDED | §2.1 | folded after THE REGARD ENTRY's lead sentence |
| B073 | L153 | 2.1 | `[CURED 2026-10-18 (fp-final r3) — RN-V2: round 2 stored 'mag` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B074 | L153 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V2: 'ver' encoded only ` | FOLDED | §2.1 | its declaration folded into the `terms` cell |
| B075 | L154 | 2.1 | `[ADDED 2026-10-20 (fp-final P6c brackets-verify; RULINGS-P6 ` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B076 | L154 | 2.1 | `[REFINED 2026-10-20 (fp-final P6c brackets-verify) — the pro` | FOLDED | §2.1 | a change note: the cell at the same place already carries the change |
| B077 | L158 | 2.1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-21: 'warmth'/'grudge` | FOLDED | §2.1 | folded as the paragraph after the regard entry's table |
| B078 | L160 | 2.1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-9.]` | FOLDED | §2.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B079 | L160 | 2.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(a) (RULINGS-ROUND2 A` | FOLDED | §2.1 | folded as THE PARTY'S CREDIBILITY's closing sentences |
| B080 | L167 | 2.2 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6 (RULINGS-ROUND2` | FOLDED | §2.2 | a change note: the text at the same place already carries the change |
| B081 | L168 | 2.2 | `[CURED 2026-10-18 (fp-final r4) — BD's routes ('cure/L-BD.md` | FOLDED | §2.2 | a change note: the text at the same place already carries the change |
| B082 | L173 | 2.2 | `[CURED 2026-10-18 (fp-final r4) — BD's routes ('cure/L-BD.md` | FOLDED | §2.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B083 | L174 | 2.2 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-12]` | FOLDED | §2.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B084 | L176 | 2.2 | `[CURED 2026-10-18 (fp-final r3) — A.7 · 'skeptic/FOLD-r2-ver` | FOLDED | §2.2 | a change note: the text at the same place already carries the change |
| B085 | L176 | 2.2 | `[CURED 2026-10-18 (fp-final r3) — A.8, RN's half: the key gr` | FOLDED | §2.2 | a change note: the text at the same place already carries the change |
| B086 | L176 | 2.2 | `[CURED 2026-10-19 (fp-final r5) — BD-r4-8, routed "BD or RN"` | FOLDED | §2.2 | a change note: the text at the same place already carries the change |
| B087 | L176 | 2.2 | `[CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 A.12 · B (L` | FOLDED | §2.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B088 | L178 | 2.2 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-1.]` | FOLDED | §2.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B089 | L178 | 2.2 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6: the rule binds` | FOLDED | §2.2 | its content folded as sentences of the Refused-pairs paragraph |
| B090 | L178 | 2.2 | `[REFINED 2026-10-18 (fp-final r2) — SEAMS-r2-11, the third v` | FOLDED | §2.2 | its content folded as sentences of the Refused-pairs paragraph |
| B091 | L178 | 2.2 | `[CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 A.4 · RN-V6` | FOLDED | §2.2 | a change note: the text at the same place already carries the change |
| B092 | L178 | 2.2 | `[CURED 2026-10-18 (fp-final r4) — BD's routes: the rule bind` | FOLDED | §2.2 | its content folded as sentences of the Refused-pairs paragraph |
| B093 | L178 | 2.2 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND4 §E OD-RN-48` | FOLDED | §2.2 | its design half folded into the Refused-pairs paragraph |
| B094 | L178 | 2.2 | `[CURED 2026-10-19 (fp-final r5) — the verifier's minor ("The` | FOLDED | §2.2 | its content folded as sentences of the Refused-pairs paragraph |
| B095 | L178 | 2.2 | `[CURED 2026-10-20 (fp-final P5) — P5C-15 (WC-RN-49; RULINGS-` | FOLDED | §2.2 | its content (the third refused class) folded into the Refused-pairs paragraph |
| B096 | L180 | 2.2 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-11.]` | FOLDED | §2.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B097 | L180 | 2.2 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 A.6: PT's f` | FOLDED | §2.2 | a change note: the text at the same place already carries the change |
| B098 | L184 | 2.3 | `[REFINED 2026-10-18 (fp-final r4) — CHAIR-NOTES 18 (d)'s cor` | FOLDED | §2.3 | its content folded as the section's lead paragraph |
| B099 | L184 | 2.3 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND4 §E OD-RN-48` | FOLDED | §2.3 | a change note: the text at the same place already carries the change |
| B100 | L186 | 2.3 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6]` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B101 | L186 | 2.3 | `[CURED 2026-10-18 (fp-final r4) — BD's routes]` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B102 | L187 | 2.3 | `[CURED 2026-10-20 (fp-final P5) — BD's route ('cure/D-BD-p5.` | FOLDED | §2.3 | its census folded into the `deedRingAt` item |
| B103 | L190 | 2.3 | `[CURED 2026-10-18 (fp-final r3) — the carried minor on §4.3]` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B104 | L190 | 2.3 | `[CURED 2026-10-18 (fp-final r3) — RN-V7]` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B105 | L190 | 2.3 | `[CURED 2026-10-18 (fp-final r3) — RN-V2: the doer as heard i` | FOLDED | §2.3 | a change note: the text at the same place already carries the change |
| B106 | L190 | 2.3 | `[CURED 2026-10-18 (fp-final r2) — RN-V1 · RN-r1-11]` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B107 | L190 | 2.3 | `[CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 A.12 ("the ` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B108 | L190 | 2.3 | `[CURED 2026-10-18 (fp-final r2) — D-CH-r2 §5.2(c): CH's read` | FOLDED | §2.3 | a change note: the text at the same place already carries the change |
| B109 | L191 | 2.3 | `[CURED 2026-10-18 (fp-final r2) — RN-V2]` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B110 | L192 | 2.3 | `[ADDED 2026-10-20 (fp-final P6c; 'cure/L-CH-PD.md' §4 RN (a)` | FOLDED | §2.3 | its content folded as the `lensOne` item |
| B111 | L197 | 2.3 | `[CURED 2026-10-18 (fp-final r4) — BD's routes]` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B112 | L199 | 2.3 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-9]` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B113 | L199 | 2.3 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor: the ` | FOLDED | §2.3 | a change note: the text at the same place already carries the change |
| B114 | L200 | 2.3 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-1]` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B115 | L200 | 2.3 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND4 §E OD-RN-48` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B116 | L201 | 2.3 | `[REFINED 2026-10-18 (fp-final r3) — the collision probe, §2.` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B117 | L201 | 2.3 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-31]` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B118 | L201 | 2.3 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-8: the feed guard` | FOLDED | §2.3 | a change note: the text at the same place already carries the change |
| B119 | L202 | 2.3 | `[CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.2: "BD's ` | FOLDED | §2.3 | a change note: the text at the same place already carries the change |
| B120 | L202 | 2.3 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 A.5, routed` | FOLDED | §2.3 | a change note: the text at the same place already carries the change |
| B121 | L202 | 2.3 | `[CURED 2026-10-18 (fp-final r4) — RULINGS-ROUND4 B (L-BD 45 ` | FOLDED | §2.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B122 | L202 | 2.3 | `[REFINED 2026-10-18 (fp-final r4) — 'courtRegardOf''s parame` | FOLDED | §2.3 | a change note: the text at the same place already carries the change |
| B123 | L208 | 2.4 | `[REFINED 2026-10-17 (fp-final) — R-RN-2: fame's band IS its ` | FOLDED | §2.4 | its ruling folded into the `FAME_SCOPES` row |
| B124 | L209 | 2.4 | `[REFINED 2026-10-17 (fp-final) — R-RN-1: the champions brief` | FOLDED | §2.4 | its census folded into the `REGARD_BANDS` row |
| B125 | L210 | 2.4 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-19]` | FOLDED | §2.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B126 | L210 | 2.4 | `[CURED 2026-10-20 (fp-final P5) — P5C-14 (WC-RN-50; RULINGS-` | FOLDED | §2.4 | its content (and its nested refinement) folded into the `REGARD_CAUSES` row |
| B127 | L211 | 2.4 | `[ADDED 2026-10-20 (fp-final P6c; OP §2.4 · OP §6.5 · OP-r1-2` | FOLDED | §2.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B128 | L212 | 2.4 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-7 (RULINGS-AFTER-` | FOLDED | §2.4 | a change note: the text at the same place already carries the change |
| B129 | L212 | 2.4 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-13]` | FOLDED | §2.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B130 | L212 | 2.4 | `[CURED 2026-10-18 (fp-final r4) — BD's routes; 'body_act' FR` | FOLDED | §2.4 | its census folded into the `DEED_SOURCES` row |
| B131 | L213 | 2.4 | `[ADDED 2026-10-20 (fp-final P6c; OP §2.4 · OP-r1-27 · RULING` | FOLDED | §2.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B132 | L214 | 2.4 | `[CURED 2026-10-19 (fp-final r5) — RN-r4-verify RU-BD-7 ('cur` | FOLDED | §2.4 | a change note: the text at the same place already carries the change |
| B133 | L214 | 2.4 | `[CURED 2026-10-18 (fp-final r3) — the verifier's minor: CH h` | FOLDED | §2.4 | a change note: the text at the same place already carries the change |
| B134 | L214 | 2.4 | `[CURED 2026-10-18 (fp-final r4) — RN-r3-verify ROUTED-UNAPPL` | FOLDED | §2.4 | a change note: the text at the same place already carries the change |
| B135 | L214 | 2.4 | `[CURED 2026-10-18 (fp-final r2) — D-CH-r2 §5.2(d)]` | FOLDED | §2.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B136 | L219 | 2.4 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-22]` | FOLDED | §2.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B137 | L220 | 2.4 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-22]` | FOLDED | §2.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B138 | L221 | 2.4 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-20]` | FOLDED | §2.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B139 | L222 | 2.4 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-17]` | FOLDED | §2.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B140 | L225 | 2.4 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor: "hop` | FOLDED | §2.4 | a change note: the text at the same place already carries the change |
| B141 | L225 | 2.4 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-5 · SEAMS-r1-22 · ` | FOLDED | §2.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B142 | L225 | 2.4 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6 · D-CH-r2 §5.2(` | FOLDED | §2.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B143 | L225 | 2.4 | `[CURED 2026-10-18 (fp-final r4) — BD's routes · A.15]` | FOLDED | §2.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B144 | L225 | 2.4 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 B.5 · OD-RN` | FOLDED | §2.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B145 | L232 | 3.1 | `[REFINED 2026-10-18 (fp-final r3)]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B146 | L232 | 3.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-8]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B147 | L237 | 3.1 | `[CURED 2026-10-18 (fp-final r2) — D-PT-r2 §5.1(b): "for EVER` | FOLDED | §3.1 | a change note: the text at the same place already carries the change |
| B148 | L238 | 3.1 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-7]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B149 | L238 | 3.1 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 A.3]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B150 | L239 | 3.1 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 B.5 · RN-X1` | FOLDED | §3.1 | its content is the row it stamps (ONE HUNT, ONE DEED; `hunt_won` a registered `paragon_act` kind; its doer any leader the `hunt_taken` card names); the ruling is OD-RN-49 (§16) |
| B151 | L239 | 3.1 | `[CURED 2026-10-19 (fp-final r5) — 'cure/D-CH-r5.md' §5 RN, a` | FOLDED | §3.1 | its content is the row it stamps (`warden_attempted`: doer a NAMED body `g:<bodyId>`, target the warden `p:<wnpcId>`, two rows) |
| B152 | L239 | 3.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B153 | L239 | 3.1 | `[CURED 2026-10-19 (fp-final r5) — the same route]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B154 | L240 | 3.1 | `[CURED 2026-10-18 (fp-final r3) — RN-V7: since round 2 every` | FOLDED | §3.1 | its rationale folded as plain law after the cap (what the cap prevents) |
| B155 | L240 | 3.1 | `[REFINED 2026-10-18 (fp-final r3) — RN-V7's pace half ("RN's` | FOLDED | §3.1 | its standing half folded into the fade sentence (the quoted old pace is already the text's "where `a_decade` held it" contrast) |
| B156 | L240 | 3.1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-6 (RULINGS-ROUND1 RN` | FOLDED | §3.1 | its design fact folded as the reason for the door (first half) |
| B157 | L240 | 3.1 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-6 (RULINGS-ROUND2 B)` | FOLDED | §3.1 | its design fact folded as the reason for the door (second half) |
| B158 | L241 | 3.1 | `[CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 A.11]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B159 | L241 | 3.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-6 (RULINGS-ROUND1` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B160 | L241 | 3.1 | `[CURED 2026-10-18 (fp-final r3) — A.11]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B161 | L247 | 3.1 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B162 | L247 | 3.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-24 (WC-RN-10; RULINGS-` | FOLDED | §3.1 | a change note: the text at the same place already carries the change |
| B163 | L248 | 3.1 | `[CURED 2026-10-20 (fp-final P5) — P5C-24 (WC-RN-11; RULINGS-` | FOLDED | §3.1 | a change note: the text at the same place already carries the change |
| B164 | L249 | 3.1 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B165 | L251 | 3.1 | `[CURED 2026-10-18 (fp-final r4) — A.18 · BD's routes]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B166 | L251 | 3.1 | `[CURED 2026-10-19 (fp-final r5) — B.5, routed by 'cure/D-ST-` | FOLDED | §3.1 | a change note: the text at the same place already carries the change |
| B167 | L251 | 3.1 | `[REFINED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B168 | L251 | 3.1 | `[CURED 2026-10-19 (fp-final r5) — RN-r4-verify RU-ST ('cure/` | FOLDED | §3.1 | a change note: the text at the same place already carries the change |
| B169 | L252 | 3.1 | `[CURED 2026-10-20 (fp-final P5) — C.25 (the rulings trace's ` | FOLDED | §3.1 | a change note: the text at the same place already carries the change |
| B170 | L252 | 3.1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes; L-BD 40]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B171 | L252 | 3.1 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND5 B.5 ("PR's ` | FOLDED | §3.1 | its rationale folded into the row (the struck leader-doer clause stays struck) |
| B172 | L252 | 3.1 | `[REFINED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B173 | L253 | 3.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-13: RN's slot tab` | FOLDED | §3.1 | a change note: the text at the same place already carries the change |
| B174 | L254 | 3.1 | `[CURED 2026-10-20 (fp-final P5) — C.25 route 4]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B175 | L254 | 3.1 | `[CURED 2026-10-19 (fp-final r5) — RN-r4-verify RU-BD-4 (MAJO` | FOLDED | §3.1 | a change note: the text at the same place already carries the change |
| B176 | L254 | 3.1 | `[CURED 2026-10-20 (fp-final P5) — C.25 (the rulings trace's ` | FOLDED | §3.1 | a change note: the text at the same place already carries the change |
| B177 | L254 | 3.1 | `[CURED 2026-10-19 (fp-final r5) — 'cure/D-CH-r5.md' §5 RN]` | FOLDED | §3.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B178 | L254 | 3.1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes ('cure/L-BD.md` | FOLDED | §3.1 | a change note: the text at the same place already carries the change |
| B179 | L255 | 3.1 | `[ADDED 2026-10-20 (fp-final P6c; OP §5.3 (d) · OP §14 row 37` | FOLDED | §3.1 | a stamp (sources only): the row it heads stands at the same place |
| B180 | L257 | 3.1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-14: the brief's "a d` | FOLDED | §3.1 | folded as the paragraph after the slot table |
| B181 | L259 | 3.1 | `[REFINED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 §E · L-ST` | FOLDED | §3.1 | folded as the SITES and PATROLS CONSIDERED paragraph after the slot table; its three nested change notes dropped (each carried by the text), the withdrawn `site` actor kept as "gains no `site`" |
| B182 | L267 | 3.2 | `[REFINED 2026-10-17 (fp-final) — per RULINGS-AFTER-RESEARCH ` | FOLDED | §3.2 | its standing content folded as the section's opening sentence; its rationale (no per-tick writer could exist) is superseded by B185 and not kept |
| B183 | L267 | 3.2 | `[CURED 2026-10-18 (fp-final r3) — RN-V7]` | FOLDED | §3.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B184 | L267 | 3.2 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-29]` | FOLDED | §3.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B185 | L267 | 3.2 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-11: the REFINED rati` | FOLDED | §3.2 | folded as the paragraph's closing clause (it supersedes B182's rationale) |
| B186 | L271 | 3.3 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-15: R2 R-13's "drop ` | FOLDED | §3.3 | its rationale folded after the unstrike sentence |
| B187 | L271 | 3.3 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(d) (RULINGS-ROUND2 A` | FOLDED | §3.3 | folded after the correction sentence |
| B188 | L275 | 3.4 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-8 · RN-r1-10: key` | FOLDED | §3.4 | its rationale folded into the ONE ACT, ONE TELLING guard |
| B189 | L275 | 3.4 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-10 · RN-r1-30.]` | FOLDED | §3.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B190 | L275 | 3.4 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-6: the verdict's doo` | FOLDED | §3.4 | a change note: the text at the same place already carries the change |
| B191 | L277 | 3.4 | `[CURED 2026-10-19 (fp-final r5) — RU-BD-7]` | FOLDED | §3.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B192 | L277 | 3.4 | `[CURED 2026-10-18 (fp-final r4) — RN-r3-verify FAIL ("RN's s` | FOLDED | §3.4 | a change note: the text carries every cure it names (the findings' origin the EMPLOYER'S SEAT, the declared `relayedTick` copied, the leak key with `:<retainer.sinceTick>`, a row declaring no guard relayed as a feed seed); its quoted `arrivalTick` formula is superseded by the text's clamped `hopWeeks` line (ALLOW-MISSING) |
| B193 | L277 | 3.4 | `[CURED 2026-10-18 (fp-final r2) — D-CH-r2 §5.2(d): CH's leak` | FOLDED | §3.4 | a change note: the text at the same place already carries the change |
| B194 | L287 | 4.1 | `[REFINED 2026-10-18 (fp-final r3) — RN-V7's pace]` | FOLDED | §4.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B195 | L287 | 4.1 | `[REFINED 2026-10-17 (fp-final) — R-RN-3: band 'a_decade' (52` | FOLDED | §4.1 | its content folded as a sentence of the read (the DRAFT pace kept) |
| B196 | L287 | 4.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6]` | FOLDED | §4.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B197 | L287 | 4.1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes; THE BODIES re` | FOLDED | §4.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B198 | L287 | 4.1 | `[CURED 2026-10-19 (fp-final r5) — RU-BD-9 · B.5]` | FOLDED | §4.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B199 | L299 | 4.2 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-13: genesis makes 87` | FOLDED | §4.2 | its rationale folded after the PL-dark arm |
| B200 | L305 | 4.3 | `[CURED 2026-10-18 (fp-final r3) — the verifier's carried min` | FOLDED | §4.3 | a change note: the text at the same place already carries the change |
| B201 | L305 | 4.3 | `[REFINED 2026-10-18 (fp-final r3) — RN-V2's doer as heard, c` | FOLDED | §4.3 | its content folded into the road arm's doer clause |
| B202 | L305 | 4.3 | `[CURED 2026-10-19 (fp-final r5) — RN-r4-verify minor: "'ledB` | FOLDED | §4.3 | a change note: the text at the same place already carries the change |
| B203 | L305 | 4.3 | `[CURED 2026-10-18 (fp-final r3) — RN-V7]` | FOLDED | §4.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B204 | L305 | 4.3 | `[CURED 2026-10-18 (fp-final r2) — RN-V1 · RN-r1-11: the omni` | FOLDED | §4.3 | its rationale folded into the "never undone by the fade" sentence |
| B205 | L305 | 4.3 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-4: the observer read` | FOLDED | §4.3 | folded after ARMS; its closing claim ("Known here" and the Why panel "cannot disagree") DROPPED as superseded by B206 |
| B206 | L305 | 4.3 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-11: that last claim ` | FOLDED | §4.3 | folded after B205's sentence (it withdraws B205's last claim) |
| B207 | L305 | 4.3 | `[CURED 2026-10-20 (fp-final P5) — BD's route]` | FOLDED | §4.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B208 | L316 | 4.4 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-6 (RULINGS-ROUND1 RN` | FOLDED | §4.4 | a change note: the text at the same place already carries the change |
| B209 | L316 | 4.4 | `[CURED 2026-10-18 (fp-final r2) — RN-V3: the verdict deed no` | FOLDED | §4.4 | folded as a sentence of RN4's projection, joined with the later "holds UP TO the stamp" limit |
| B210 | L316 | 4.4 | `[CURED 2026-10-18 (fp-final r3) — RN-V7]` | FOLDED | §4.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B211 | L316 | 4.4 | `[CURED 2026-10-18 (fp-final r4) — BD's routes (L-BD 38: "a b` | FOLDED | §4.4 | folded as the section's closing sentence |
| B212 | L320 | 4.5 | `[CURED 2026-10-18 (fp-final r2) — the verifier's detail on R` | FOLDED | §4.5 | its design fact folded into the signature car |
| B213 | L320 | 4.5 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-7: the function took` | FOLDED | §4.5 | its rationale folded as the section's closing sentence |
| B214 | L324 | 4.6 | `[REFINED 2026-10-17 (fp-final) — R-RN-4: R2 drafted 'indiffe` | FOLDED | §4.6 | its rationale folded after the mapping |
| B215 | L326 | 4.6 | `[CURED 2026-10-18 (fp-final r4) — RN-r3-verify minor: "§4.6'` | FOLDED | §4.6 | a change note: the text at the same place already carries the change |
| B216 | L333 | 5.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V1]` | FOLDED | §5.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B217 | L333 | 5.1 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6]` | FOLDED | §5.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B218 | L333 | 5.1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes]` | FOLDED | §5.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B219 | L333 | 5.1 | `[CURED 2026-10-18 (fp-final r3) — RN-V2, EXECUTED against th` | FOLDED | §5.1 | its executed evidence folded into THE TRIPLE's clause |
| B220 | L333 | 5.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V2]` | FOLDED | §5.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B221 | L333 | 5.1 | `[CURED 2026-10-19 (fp-final r5) — RN-r4-verify minor: "§5.1'` | FOLDED | §5.1 | a change note: the text at the same place already carries the change |
| B222 | L333 | 5.1 | `[CURED 2026-10-18 (fp-final r3) — RN-V2 ("a changed doer mov` | FOLDED | §5.1 | its executed evidence folded into the doer-move clause |
| B223 | L333 | 5.1 | `[CURED 2026-10-18 (fp-final r4) — RN-r3-verify minor: "A doe` | FOLDED | §5.1 | a change note: the text at the same place already carries the change |
| B224 | L333 | 5.1 | `[CURED 2026-10-18 (fp-final r3) — RN-V2]` | FOLDED | §5.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B225 | L333 | 5.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(a) (RULINGS-ROUND2 A` | FOLDED | §5.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B226 | L333 | 5.1 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor on RN` | FOLDED | §5.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B227 | L333 | 5.1 | `[CURED 2026-10-18 (fp-final r4) — RN-r3-verify minor: "§5.1'` | FOLDED | §5.1 | a change note: the text at the same place already carries the change |
| B228 | L333 | 5.1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-2 · RN-r1-16.]` | FOLDED | §5.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B229 | L335 | 5.1 | `[CURED 2026-10-18 (fp-final r2) — D-CH-r2 §5.2(a) · CH-r1-30` | FOLDED | §5.1 | a change note: the text at the same place already carries the change |
| B230 | L335 | 5.1 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-6 · SEAMS-r1-6]` | FOLDED | §5.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B231 | L335 | 5.1 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor on RN` | FOLDED | §5.1 | a change note: the text at the same place already carries the change |
| B232 | L335 | 5.1 | `[CURED 2026-10-18 (fp-final r1) — RULINGS-AFTER-COMPILE RN-S` | FOLDED | §5.1 | its standing fact folded as RN-S1's closing sentence (the STOP is closed: "RULED", OD-RN-18) |
| B233 | L337 | 5.1 | `[ADDED 2026-10-20 (fp-final P6c; OP §3.1 · RULINGS-P6 §C RN ` | FOLDED | §5.1 | folded as the paragraph after RN-S1 (the stage's fourth registered pass); its last sentence DROPPED as superseded by B234 |
| B234 | L338 | 5.1 | `[ADDED 2026-10-20 (fp-final P6c brackets-verify; RULINGS-P6 ` | FOLDED | §5.1 | its ruling (READ INSTEAD) folded as the paragraph after the stage's registration list, replacing B233's last sentence |
| B235 | L340 | 5.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V1]` | FOLDED | §5.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B236 | L340 | 5.1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-2 (RULINGS-ROUND1 RN` | FOLDED | §5.1 | a change note: the text at the same place already carries the change |
| B237 | L340 | 5.1 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor on SE` | FOLDED | §5.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B238 | L353 | 5.2 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor on RN` | FOLDED | §5.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B239 | L353 | 5.2 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-17: 'placed' is the ` | FOLDED | §5.2 | its rationale folded after the projection sentence |
| B240 | L353 | 5.2 | `[REFINED 2026-10-17 (fp-final) — R-RN-11: graduation is boun` | FOLDED | §5.2 | its bound folded as a sentence of the section |
| B241 | L353 | 5.2 | `[CURED 2026-10-18 (fp-final r2) — D-RN-r2-N1 (found by this ` | FOLDED | §5.2 | its rationale and evidence folded as the section's closing sentence |
| B242 | L357 | 5.3 | `[CURED 2026-10-18 (fp-final r2) — RN-V1]` | FOLDED | §5.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B243 | L357 | 5.3 | `[CURED 2026-10-18 (fp-final r3) — RN-V2]` | FOLDED | §5.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B244 | L357 | 5.3 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-12 (RULINGS-ROUND2 A` | FOLDED | §5.3 | its content folded after the kingdom clause |
| B245 | L357 | 5.3 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-2 (RULINGS-ROUND1 RN` | FOLDED | §5.3 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B246 | L357 | 5.3 | `[REFINED 2026-10-17 (fp-final) — R-RN-8: the brief's court d` | FOLDED | §5.3 | its rationale folded as the section's closing sentence |
| B247 | L364 | 5.4 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-14]` | FOLDED | §5.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B248 | L365 | 5.4 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-16]` | FOLDED | §5.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B249 | L372 | 5.4 | `[CURED 2026-10-20 (fp-final P5) — P5C-21 (WC-CH-81, RN's hal` | FOLDED | §5.4 | folded as the Shared-seams paragraph's closing sentences; it supersedes the running clause "the fold §3.1 row naming the two leaves is the chair's" (removed) |
| B250 | L372 | 5.4 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-21 (RN's half).]` | FOLDED | §5.4 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B251 | L376 | 5.5 | `[CURED 2026-10-18 (fp-final r2) — HOST-r1-7: the town reads ` | FOLDED | §5.5 | a change note: the text at the same place already carries the change |
| B252 | L376 | 5.5 | `[REFINED 2026-10-17 (fp-final) — R-RN-6: "spreads further" i` | FOLDED | §5.5 | its rationale folded after the condemner's cost |
| B253 | L376 | 5.5 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-6: the round-1 ST` | FOLDED | §5.5 | a change note: the text at the same place already carries the change |
| B254 | L376 | 5.5 | `[REFINED 2026-10-19 (fp-final r5) — the verifier's second cu` | FOLDED | §5.5 | its standing content folded into NO HEARER, NO CARD |
| B255 | L376 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — RN-X2 (MAJOR: "Below city ` | FOLDED | §5.5 | a change note: the text at the same place already carries the change |
| B256 | L376 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — OD-RN-48 RULED (RULINGS-RO` | FOLDED | §5.5 | its ruling folded as the clause's OD cite |
| B257 | L376 | 5.5 | `[REFINED 2026-10-18 (fp-final r4) — the members' exclusion: ` | FOLDED | §5.5 | its content folded into THE VOICE IS ITS OWN PEOPLE'S |
| B258 | L376 | 5.5 | `[CURED 2026-10-18 (fp-final r4) — RN-W1 ('skeptic/RN-r3-veri` | FOLDED | §5.5 | its content (the flat −0.5 term's three faults) folded into the EXECUTED sentence before it, in place of the old-formula contrast |
| B259 | L376 | 5.5 | `[CURED 2026-10-18 (fp-final r4) — BD's routes: with 'g:' hol` | FOLDED | §5.5 | its rationale folded into the no-body-voice clause |
| B260 | L376 | 5.5 | `[CURED 2026-10-19 (fp-final r5) — RN-r4-verify minor: "A der` | FOLDED | §5.5 | a change note: the text at the same place already carries the change |
| B261 | L376 | 5.5 | `[CURED 2026-10-18 (fp-final r4) — RN-r3-verify minor: "§5.5'` | FOLDED | §5.5 | a change note: the text at the same place already carries the change |
| B262 | L376 | 5.5 | `[CURED 2026-10-18 (fp-final r3) — A.11 · the verifier's mino` | FOLDED | §5.5 | its standing content folded as the section's closing sentence (the crossing test it names is the paragraph above) |
| B263 | L380 | 5.6 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6]` | FOLDED | §5.6 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B264 | L380 | 5.6 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-23: the verbs declar` | FOLDED | §5.6 | a change note: the text at the same place already carries the change |
| B265 | L382 | 5.6 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-5]` | FOLDED | §5.6 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B266 | L390 | 6.1 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-27 · RN-r1-22: 'reso` | FOLDED | §6.1 | its rationale folded after the band sentence (the 0.85 edge it replaced is gone) |
| B267 | L390 | 6.1 | `[CURED 2026-10-18 (fp-final r2) — HOST-r1-7: since round 2 n` | FOLDED | §6.1 | its standing content folded after the band sentence (it limits the normalizer) |
| B268 | L390 | 6.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(c) (RULINGS-ROUND2 A` | FOLDED | §6.1 | a change note: the text at the same place already carries the change |
| B269 | L405 | 6.1 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-10: the backing's` | FOLDED | §6.1 | a change note: the text at the same place already carries the change |
| B270 | L406 | 6.1 | `[ADDED 2026-10-20 (fp-final P6c; OP §2.4 (OP PROPOSES, DRAFT` | FOLDED | §6.1 | its DRAFT mark folded into the row's first cell (OP proposes; RN signs) |
| B271 | L407 | 6.1 | `[ADDED 2026-10-20 (fp-final P6c; OP §2.4, DRAFT — RN's to si` | FOLDED | §6.1 | its DRAFT mark folded into the row's first cell |
| B272 | L408 | 6.1 | `[ADDED 2026-10-20 (fp-final P6c; OP §2.4, DRAFT — RN's to si` | FOLDED | §6.1 | its DRAFT mark folded into the row's first cell (the §G.6 ruling cite removed) |
| B273 | L410 | 6.1 | `[CURED 2026-10-18 (fp-final r2) — RN-V3: no verdict row exis` | FOLDED | §6.1 | its rationale folded after the verdict rows |
| B274 | L410 | 6.1 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-2 (RN's half; CH ` | FOLDED | §6.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B275 | L410 | 6.1 | `[CURED 2026-10-18 (fp-final r2) — the verifier's owed note o` | FOLDED | §6.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B276 | L410 | 6.1 | `[CURED 2026-10-18 (fp-final r4) — BD's routes ('cure/L-BD.md` | FOLDED | §6.1 | a change note: the text at the same place already carries the change |
| B277 | L410 | 6.1 | `[CURED 2026-10-19 (fp-final r5) — RU-BD-4 · RU-BD-9 · BD §19` | FOLDED | §6.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B278 | L410 | 6.1 | `[CURED 2026-10-19 (fp-final r5) — 'cure/D-CH-r5.md' §5 RN]` | FOLDED | §6.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B279 | L410 | 6.1 | `[CURED 2026-10-19 (fp-final r5) — RN-r4-verify RU-PT-j2 ('cu` | FOLDED | §6.1 | a change note: the text at the same place already carries the change |
| B280 | L410 | 6.1 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-7.]` | FOLDED | §6.1 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B281 | L410 | 6.1 | `[CURED 2026-10-18 (fp-final r2) — RULINGS-ROUND2 A.3 (PT's k` | FOLDED | §6.1 | its executed evidence folded after the pledge reading |
| B282 | L414 | 6.2 | `[CURED 2026-10-18 (fp-final r2) — HOST-r1-7 (RULINGS-ROUND1 ` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B283 | L414 | 6.2 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-25]` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B284 | L414 | 6.2 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6]` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B285 | L414 | 6.2 | `[CURED 2026-10-18 (fp-final r4) — BD's routes]` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B286 | L414 | 6.2 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-7.]` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B287 | L414 | 6.2 | `[CURED 2026-10-18 (fp-final r2) — HOST-r1-7: the round-1 gat` | FOLDED | §6.2 | a change note: the text at the same place already carries the change |
| B288 | L416 | 6.2 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-3: the old factor tu` | FOLDED | §6.2 | a change note: the text at the same place already carries the change |
| B289 | L416 | 6.2 | `[CURED 2026-10-18 (fp-final r2) — HOST-r1-7]` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B290 | L416 | 6.2 | `[CURED 2026-10-18 (fp-final r2) — RN-V2]` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B291 | L416 | 6.2 | `[REFINED 2026-10-19 (fp-final r5) — two choices §E left to t` | FOLDED | §6.2 | its two choices and their rationale folded into the κ clause (vetoable) |
| B292 | L416 | 6.2 | `[CURED 2026-10-19 (fp-final r5) — RULINGS-ROUND4 §E OD-RN-48` | FOLDED | §6.2 | a change note: the text at the same place already carries the change |
| B293 | L416 | 6.2 | `[CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 A.12 · the ` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B294 | L416 | 6.2 | `[CURED 2026-10-18 (fp-final r4) — BD's routes]` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B295 | L416 | 6.2 | `[CURED 2026-10-19 (fp-final r5) — RU-CH-h]` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B296 | L416 | 6.2 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-1 (RULINGS-ROUND1 RN` | FOLDED | §6.2 | its rationale and evidence folded after the warm/grudge sentence |
| B297 | L416 | 6.2 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor on RN` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B298 | L416 | 6.2 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-8: 'pride', 'vengean` | FOLDED | §6.2 | its rationale folded after the μ table |
| B299 | L416 | 6.2 | `[REFINED 2026-10-18 (fp-final r1) — a holder with no tie jud` | FOLDED | §6.2 | its refinement folded as a sentence after the μ table (vetoable, §18) |
| B300 | L416 | 6.2 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor: the ` | FOLDED | §6.2 | its re-executed receipt folded into the stranger sentence |
| B301 | L418 | 6.2 | `[ADDED 2026-10-20 (fp-final P6c; 'cure/L-CH-PD.md' §4 RN (b)` | FOLDED | §6.2 | folded with B302 and B303 into ONE paragraph, THE SWORN-DOER READING: its live read `swornDeityOf(paragon)` REPLACED by B302 (the carried oath); its carrier ruled by B303 (OD-RN-52 ⭐); its provenance clause (`cure/L-CH-PD.md` §4 RN (b) · RULINGS-P6 §F.1 · §F.3, the owner's dated word) reduced to the owner's words; "the 09-12 carve-out" → "the owner's carve-out" |
| B302 | L419 | 6.2 | `[ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §H.2 · CH-PD-r1-` | FOLDED | §6.2 | FOLDED into THE SWORN-DOER READING (B301's paragraph): it supersedes B301's live read — lens one reads the TELLING's carried oath; the ONE OVERRIDE registered; the mapping CH's, monotone per half; "kept, not deleted" dropped (one paragraph states the final read) |
| B303 | L420 | 6.2 | `[ADDED 2026-10-20 (fp-final P6c brackets-verify; RULINGS-P6 ` | FOLDED | §6.2 | FOLDED into THE SWORN-DOER READING: the `oath` bit (OD-RN-52 ⭐, the OWNER's, VISIBLE); until signed no oath is read and the live read stays forbidden; its nested REFINED (the override fires only on a set `oath` bit; CH S65's flock clause DARK; vetoable) folded with "the chair's §J.3 parenthetical" → "OD-RN-52's ruling"; the review path `skeptic/BRACKETS-p6c-verify.md` dropped |
| B304 | L422 | 6.2 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-3 · RN-r1-20.]` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B305 | L422 | 6.2 | `[CURED 2026-10-18 (fp-final r2) — HOST-r1-7]` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B306 | L422 | 6.2 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-10 · RN-r1-9]` | FOLDED | §6.2 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B307 | L422 | 6.2 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(c): the round-1 cred` | FOLDED | §6.2 | its standing content folded into the reason clause (A.2's "replace") |
| B308 | L430 | §7 | `[CURED 2026-10-20 (fp-final P5) — P5C-22 (WC-PT-60; RULINGS-` | FOLDED | §7 | its standing content folded into the exposure clause (the struck "or IN's exposure once C1 lands" is gone; its ids and route removed) |
| B309 | L430 | §7 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor: neit` | FOLDED | §7 | a change note: the text at the same place already carries the change |
| B310 | L430 | §7 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(a) (RULINGS-ROUND2 A` | FOLDED | §7 | a change note: the text at the same place already carries the change |
| B311 | L430 | §7 | `[CURED 2026-10-18 (fp-final r2) — RN-V1 · RN-V5(a)]` | FOLDED | §7 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B312 | L430 | §7 | `[CURED 2026-10-18 (fp-final r2) — D-PT-r2 §5.1(c): "the trut` | FOLDED | §7 | its standing content folded into the readers' list (the struck reader "the truth chasing a rumor" is gone) |
| B313 | L430 | §7 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(c)]` | FOLDED | §7 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B314 | L430 | §7 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-9: the town's read i` | FOLDED | §7 | a change note: the text at the same place already carries the change |
| B315 | L445 | §8 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor: the ` | FOLDED | §8 | a change note: the text at the same place already carries the change |
| B316 | L445 | §8 | `[CURED 2026-10-18 (fp-final r3) — the carried minor on §4.3]` | FOLDED | §8 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B317 | L445 | §8 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-2.]` | FOLDED | §8 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B318 | L451 | §9 | `[CURED 2026-10-18 (fp-final r1) — HOST-r1-5]` | FOLDED | §9 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B319 | L453 | §9 | `[REFINED 2026-10-18 (fp-final r1) — requirement 16 for the s` | FOLDED | §9 | its refinement folded as the Herald item's closing sentence (vetoable, §18; "chair notes item 5" removed) |
| B320 | L466 | §10 | `[CURED 2026-10-18 (fp-final r2) — D-CH-r2 §5.2(a)]` | FOLDED | §10 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B321 | L467 | §10 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-6: the round-1 "≈ 3 ` | FOLDED | §10 | a change note: the text at the same place already carries the change (the deed is minted in THE ONE PERSON STAGE, said in the same cell) |
| B322 | L469 | §10 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor on RN` | FOLDED | §10 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B323 | L474 | §10 | `[CURED 2026-10-19 (fp-final r5) — OD-RN-48]` | FOLDED | §10 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B324 | L475 | §10 | `[CURED 2026-10-19 (fp-final r5) — RN-X2]` | FOLDED | §10 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B325 | L476 | §10 | `[CURED 2026-10-18 (fp-final r4) — A.15; 'cure/D-RN-r4-probe/` | FOLDED | §10 | its executed measurement folded into the row; the ruling cite (A.15) became OD-RN-45 in the row |
| B326 | L479 | §10 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-6 · RN-r1-7 · RN-r1-` | FOLDED | §10 | its evidence folded as the section's closing sentence (finding ids removed) |
| B327 | L485 | §11 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-6, RN's half: "ne` | FOLDED | §11 | a change note: the text at the same place already carries the change |
| B328 | L485 | §11 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-6 RULED]` | FOLDED | §11 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B329 | L485 | §11 | `[CURED 2026-10-18 (fp-final r4) — BD's routes]` | FOLDED | §11 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B330 | L485 | §11 | `[CURED 2026-10-19 (fp-final r5) — RU-BD-4]` | FOLDED | §11 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B331 | L485 | §11 | `[CURED 2026-10-19 (fp-final r5) — RN-X2 · B.10; REFINED]` | FOLDED | §11 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B332 | L491 | §12 | `[REFINED 2026-10-17 (fp-final) — the brief named one flag; t` | FOLDED | §12 | its refinement folded as the section's lead sentence (vetoable, §18) |
| B333 | L495 | §12 | `[CURED 2026-10-19 (fp-final r5) — B.5]` | FOLDED | §12 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B334 | L498 | §12 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-6 (RULINGS-ROUND1 RN` | FOLDED | §12 | a change note: the text at the same place already carries the change (the projection is `renownEnabled`'s; the belief-map shift is disclosed in the lighting cell) |
| B335 | L503 | §13 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-15.]` | FOLDED | §13 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B336 | L505 | §13 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-8]` | FOLDED | §13 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B337 | L509 | §13 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-6 · D-RN-r2-N1]` | FOLDED | §13 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B338 | L511 | §13 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-25 · HOST-r1-7]` | FOLDED | §13 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B339 | L511 | §13 | `[CURED 2026-10-18 (fp-final r2) — HOST-r1-7: the gate is str` | FOLDED | §13 | a change note: the text at the same place already carries the change (NO lighting gate, said in the car-0 sentence) |
| B340 | L533 | §14 | `[REFINED 2026-10-18 (fp-final r3)]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B341 | L533 | §14 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-8 · RN-r1-6]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B342 | L533 | §14 | `[CURED 2026-10-19 (fp-final r5) — RU-BD-4 · B.5]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B343 | L535 | §14 | `[CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 B ('siteId'` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B344 | L535 | §14 | `[CURED 2026-10-18 (fp-final r4) — BD's routes; REFINED ('led` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B345 | L536 | §14 | `[CURED 2026-10-18 (fp-final r4) — BD's routes]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B346 | L541 | §14 | `[REFINED 2026-10-18 (fp-final r4) — BD's 'ended' ring is bou` | FOLDED | §14 | its refinement folded into the death row as its rationale (vetoable, §18) |
| B347 | L543 | §14 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-26]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B348 | L545 | §14 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-30]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B349 | L549 | §14 | `[CURED 2026-10-18 (fp-final r2) — D-CH-r2 §5.2(d)]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B350 | L549 | §14 | `[CURED 2026-10-18 (fp-final r4) — A.9 · BD's routes]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B351 | L565 | §14 | `[CURED 2026-10-18 (fp-final r3) — RN-V2]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B352 | L568 | §14 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B353 | L568 | §14 | `[CURED 2026-10-18 (fp-final r4) — BD's routes]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B354 | L569 | §14 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-15]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B355 | L570 | §14 | `[CURED 2026-10-18 (fp-final r2) — RN-V2]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B356 | L573 | §14 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-15]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B357 | L573 | §14 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B358 | L573 | §14 | `[CURED 2026-10-18 (fp-final r4) — BD's routes]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B359 | L575 | §14 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-16 · RN-r1-19 · RN-r` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B360 | L585 | §14 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(a) (RULINGS-ROUND2 A` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B361 | L590 | §14 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-9]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B362 | L593 | §14 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-17]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B363 | L593 | §14 | `[CURED 2026-10-18 (fp-final r2) — D-RN-r2-N1]` | FOLDED | §14 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B364 | L604 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-1]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B365 | L605 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-1]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B366 | L616 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-16]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B367 | L617 | §15 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-6 RULED]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B368 | L618 | §15 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-6 · HOST-r1-7]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B369 | L619 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-9]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B370 | L619 | §15 | `[CURED 2026-10-18 (fp-final r2) — A.3 · the exposure's carri` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B371 | L626 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-3]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B372 | L627 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-11]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B373 | L627 | §15 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-11 restated]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B374 | L628 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-4]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B375 | L629 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-18]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B376 | L630 | §15 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-8 · RN-r1-10]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B377 | L631 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-15]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B378 | L632 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-15]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B379 | L633 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-2]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B380 | L634 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-17]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B381 | L635 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-9]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B382 | L635 | §15 | `[CURED 2026-10-18 (fp-final r2) — A.1 · A.3]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B383 | L636 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-12]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B384 | L636 | §15 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-12 (A.8)]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B385 | L637 | §15 | `[CURED 2026-10-18 (fp-final r1) — RN-r1-6]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B386 | L637 | §15 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-6]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B387 | L638 | §15 | `[CURED 2026-10-18 (fp-final r1) — SEAMS-r1-7]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B388 | L638 | §15 | `[CURED 2026-10-18 (fp-final r2) — A.3 · the verifier's minor` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B389 | L639 | §15 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-8]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B390 | L640 | §15 | `[CURED 2026-10-18 (fp-final r2) — RN-V1]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B391 | L641 | §15 | `[CURED 2026-10-18 (fp-final r2) — RN-V2]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B392 | L641 | §15 | `[CURED 2026-10-18 (fp-final r3) — RN-V2: the triple re-read ` | FOLDED | §15 | its executed evidence folded into R41's assertion |
| B393 | L642 | §15 | `[CURED 2026-10-18 (fp-final r2) — RN-V3]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B394 | L643 | §15 | `[CURED 2026-10-18 (fp-final r2) — RN-V4]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B395 | L644 | §15 | `[CURED 2026-10-18 (fp-final r2) — D-RN-r2-N1]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B396 | L645 | §15 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-6 (the audience)]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B397 | L646 | §15 | `[CURED 2026-10-18 (fp-final r2) — RN-V5(a)]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B398 | L647 | §15 | `[CURED 2026-10-18 (fp-final r2) — A.4]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B399 | L648 | §15 | `[CURED 2026-10-18 (fp-final r2) — A.2]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B400 | L649 | §15 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B401 | L650 | §15 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-13]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B402 | L651 | §15 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-11]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B403 | L651 | §15 | `[CURED 2026-10-19 (fp-final r5) — OD-RN-48 RULED (the verifi` | FOLDED | §15 | a change note: the text at the same place already carries the change |
| B404 | L652 | §15 | `[CURED 2026-10-18 (fp-final r2) — D-CH-r2 §5.2(a)]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B405 | L653 | §15 | `[CURED 2026-10-18 (fp-final r2) — D-CH-r2 §5.2(d)]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B406 | L654 | §15 | `[CURED 2026-10-18 (fp-final r2) — D-PT-r2 §5.1(a)]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B407 | L655 | §15 | `[CURED 2026-10-18 (fp-final r2) — D-CH-r2 §5.2(c)]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B408 | L655 | §15 | `[CURED 2026-10-18 (fp-final r3) — A.12 · the carried minor o` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B409 | L656 | §15 | `[CURED 2026-10-18 (fp-final r3) — RN-V7]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B410 | L657 | §15 | `[CURED 2026-10-18 (fp-final r3) — RN-V7]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B411 | L658 | §15 | `[CURED 2026-10-18 (fp-final r3) — RN-V2]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B412 | L659 | §15 | `[CURED 2026-10-19 (fp-final r5) — RN-X2: "R59 and R62 name a` | FOLDED | §15 | a change note: the text at the same place already carries the change |
| B413 | L659 | §15 | `[CURED 2026-10-18 (fp-final r4) — RN-W1 · RULINGS-ROUND4 A.1` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B414 | L659 | §15 | `[CURED 2026-10-18 (fp-final r3) — A.11]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B415 | L660 | §15 | `[CURED 2026-10-18 (fp-final r3) — A.12]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B416 | L661 | §15 | `[CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 B · REFINED` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B417 | L662 | §15 | `[CURED 2026-10-18 (fp-final r4) — RN-W1 · RULINGS-ROUND4 A.1` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B418 | L662 | §15 | `[CURED 2026-10-19 (fp-final r5) — RN-X2: the hearers are the` | FOLDED | §15 | a change note: the text at the same place already carries the change |
| B419 | L663 | §15 | `[CURED 2026-10-18 (fp-final r4) — RN-r3-verify FAIL and rout` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B420 | L664 | §15 | `[CURED 2026-10-18 (fp-final r4) — BD's routes · L-BD 32b/33b` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B421 | L665 | §15 | `[CURED 2026-10-18 (fp-final r4) — BD's routes · L-BD 40]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B422 | L665 | §15 | `[CURED 2026-10-19 (fp-final r5) — RN-X1 = SEAMS-r4-7 · B.5: ` | FOLDED | §15 | a change note: the text at the same place already carries the change |
| B423 | L666 | §15 | `[CURED 2026-10-18 (fp-final r4) — BD's routes (3)]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B424 | L666 | §15 | `[CURED 2026-10-19 (fp-final r5) — RU-BD-7: the leak row wide` | FOLDED | §15 | a change note: the text at the same place already carries the change |
| B425 | L667 | §15 | `[CURED 2026-10-18 (fp-final r4) — BD's routes (2)]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B426 | L668 | §15 | `[CURED 2026-10-19 (fp-final r5) — the verifier's minor]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B427 | L668 | §15 | `[REFINED 2026-10-18 (fp-final r4) — 'ledBy']` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B428 | L669 | §15 | `[CURED 2026-10-19 (fp-final r5) — OD-RN-48 RULED (RULINGS-RO` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B429 | L670 | §15 | `[CURED 2026-10-19 (fp-final r5) — RN-X2 · B.10; REFINED (no ` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B430 | L671 | §15 | `[CURED 2026-10-19 (fp-final r5) — RU-BD-9 · B.5]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B431 | L672 | §15 | `[CURED 2026-10-19 (fp-final r5) — RU-BD-4]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B432 | L673 | §15 | `[CURED 2026-10-19 (fp-final r5) — RU-ST · B.5]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B433 | L674 | §15 | `[CURED 2026-10-19 (fp-final r5) — B.5]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B434 | L675 | §15 | `[CURED 2026-10-19 (fp-final r5) — RU-PT-j2]` | FOLDED | §15 | a stamp: the amended text stands at the same place; its ids stay in the text of record |
| B435 | L701 | §16 | `[CURED 2026-10-18 (fp-final r2) — the verifier's minor: the ` | FOLDED | §16 | a change note: the stale `reach` cap 64 is absent from OD-RN-19's list |
| B436 | L701 | §16 | `[CURED 2026-10-19 (fp-final r5) — B.10]` | FOLDED | §16 | a stamp: the amended row stands; its ids stay in the text of record |
| B437 | L703 | §16 | `[CURED 2026-10-19 (fp-final r5)]` | FOLDED | §16 | a stamp: the amended row stands; its ids stay in the text of record |
| B438 | L705 | §16 | `[CURED 2026-10-18 (fp-final r2) — RN-r1-12 (A.8)]` | FOLDED | §16 | a stamp: the amended row stands; its ids stay in the text of record |
| B439 | L723 | §16 | `[STRUCK in round 5 — RULINGS-ROUND5 B.10: its hearers are th` | FOLDED | §16 | its STRUCK clause folded: OD-RN-41's "its scope its ruler's office scope" REMOVED and replaced by "its hearers the tale's — the walk … (OD-RN-50)"; OD-RN-50 carries "(supersedes OD-RN-41's … office scope of 2026-10-18)" |
| B440 | L723 | §16 | `[CURED 2026-10-18 (fp-final r4) — RN-W1]` | FOLDED | §16 | a stamp: the amended row stands; its ids stay in the text of record |
| B441 | L727 | §16 | `[CURED 2026-10-19 (fp-final r5) — OD-RN-48 · B.10]` | FOLDED | §16 | a stamp: the amended row stands; its ids stay in the text of record |
| B442 | L730 | §16 | `[CURED 2026-10-19 (fp-final r5) — the verifier's FAIL A.8 → ` | FOLDED | §16 | its executed receipt folded into OD-RN-48's ruling ("EXECUTED, `cure/D-RN-r5-probe/r5Probe.out.json` A"); its review history ("still reads 'open for the chair'") dropped |
| B443 | L734 | §16 | `[ADDED 2026-10-20 (fp-final P6c brackets-verify; RULINGS-P6 ` | FOLDED | §16 | a stamp: the row stands; its ids stay in the text of record |
| B444 | L757 | §17 | `[CURED 2026-10-18 (fp-final r2) — SEAMS-r1-6 RULED · RN-r1-1` | FOLDED | §17 | a stamp: the amended paragraph stands; its ids stay in the text of record |
| B445 | L773 | §18 | `[CURED 2026-10-18 (fp-final r3) — RULINGS-ROUND3 A.11 RULED ` | FOLDED | §18 | folded as item (4)'s final text: the trigger RULED (OD-RN-41), the court arm in §5.5, the ruler MAKES the court's voice; the superseded "a court means its ruler … unchanged here" REMOVED |
| B446 | L773 | §18 | `[CURED 2026-10-18 (fp-final r4) — BD's round routed them; RN` | FOLDED | §18 | folded into item (5): THE BODIES' RN keys are admitted (§2.2, §3.1, OD-RN-46/47); the superseded "when that volume's round routes them, not before" REMOVED |
| B447 | L773 | §18 | `[CURED 2026-10-19 (fp-final r5) — the first question RULED b` | FOLDED | §18 | folded into item (6): the pair-read question RULED through belief (OD-RN-48) with its places; `ledBy` stays vetoable; the superseded "RN keeps … RN-r1-1's landed read" REMOVED |
| B448 | L773 | §18 | `[REFINED 2026-10-19 (fp-final r5) — the resumed seat's cross` | FOLDED | §18 | folded into item (7): CH's and PR's halves LANDED, no longer owed; the body leak key's three spellings ROUTED with RN's one spelling; `warden_attempted` applied (§2.1, §3.1, §6.1); "the resumed seat's cross-volume re-grep, <time>" dropped |
| A00 | L154 | 2.1 | `↳` | FOLDED | §2.1 | the ↳ row folded into its parent row (renamed as the parent's qualified row; no arrow in the new text) |
| A01 | L211 | 2.4 | `↳` | FOLDED | §2.4 | the ↳ row folded into its parent row (renamed as the parent's qualified row; no arrow in the new text) |
| A02 | L213 | 2.4 | `↳` | FOLDED | §2.4 | the ↳ row folded into its parent row (renamed as the parent's qualified row; no arrow in the new text) |
| A03 | L248 | 3.1 | `↳` | FOLDED | §3.1 | the cross-volume cite "the fold §6 C4 ↳ P5" folded to "the fold §6 C4" (the fold's own sub-row is the fold's to consolidate) |
| A04 | L904 | §19 | `↳` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| A05 | L978 | §19 | `↳` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| A06 | L1017 | §19 | `↳` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H00 | L9 | header | `ROUND 1` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| H01 | L9 | header | `ROUND 2` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| H02 | L9 | header | `ROUND 2b` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| H03 | L9 | header | `ROUND 3a` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| H04 | L9 | header | `ROUND 4a` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| H05 | L9 | header | `ROUND 5a` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| H06 | L9 | header | `Round 1` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| H07 | L9 | header | `Round 1` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| H08 | L9 | header | `Round 2` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| H09 | L9 | header | `Round 2b` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| H10 | L9 | header | `Round 3a` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| H11 | L9 | header | `Round 4a` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| H12 | L9 | header | `Round 5a` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| H13 | L176 | 2.2 | `round 5` | FOLDED | §2.2 | the round word removed from the running text (BD §2.5 `bodyThreat01` cited without it) |
| H14 | L376 | 5.5 | `round 4` | FOLDED | §5.5 | restated as a plain contrast: "where the ruler's office scope (a small town's `settlement`, ring 0) would reach only its own commons"; the struck office-scope rule stays struck (OD-RN-50) |
| H15 | L416 | 6.2 | `round 4` | FOLDED | §6.2 | the round word removed: "round 4's net" / "round 4's truth read" → "the true label's net" / "the truth read" |
| H16 | L416 | 6.2 | `round 4` | FOLDED | §6.2 | the round word removed: "round 4's net" / "round 4's truth read" → "the true label's net" / "the truth read" |
| H17 | L505 | §13 | `round 2` | FOLDED | §13 | §13 RN-0: "MEASURED in round 2" → "MEASURED"; the round-labelled pin groups → "Further pins (OD-…)"; "the round-4 text's two deeds" → "two deeds for one success" |
| H18 | L505 | §13 | `Round 3` | FOLDED | §13 | §13 RN-0: "MEASURED in round 2" → "MEASURED"; the round-labelled pin groups → "Further pins (OD-…)"; "the round-4 text's two deeds" → "two deeds for one success" |
| H19 | L505 | §13 | `Round 4` | FOLDED | §13 | §13 RN-0: "MEASURED in round 2" → "MEASURED"; the round-labelled pin groups → "Further pins (OD-…)"; "the round-4 text's two deeds" → "two deeds for one success" |
| H20 | L505 | §13 | `Round 5` | FOLDED | §13 | §13 RN-0: "MEASURED in round 2" → "MEASURED"; the round-labelled pin groups → "Further pins (OD-…)"; "the round-4 text's two deeds" → "two deeds for one success" |
| H21 | L507 | §13 | `Round 2b` | FOLDED | §13 | §13 RN-1: the round-labelled pin groups → "Further pins (OD-RN-36, OD-RN-39)", "(OD-RN-31)", "(OD-RN-46)", "(OD-RN-47)" |
| H22 | L507 | §13 | `Round 3` | FOLDED | §13 | §13 RN-1: the round-labelled pin groups → "Further pins (OD-RN-36, OD-RN-39)", "(OD-RN-31)", "(OD-RN-46)", "(OD-RN-47)" |
| H23 | L507 | §13 | `Round 4` | FOLDED | §13 | §13 RN-1: the round-labelled pin groups → "Further pins (OD-RN-36, OD-RN-39)", "(OD-RN-31)", "(OD-RN-46)", "(OD-RN-47)" |
| H24 | L507 | §13 | `Round 5` | FOLDED | §13 | §13 RN-1: the round-labelled pin groups → "Further pins (OD-RN-36, OD-RN-39)", "(OD-RN-31)", "(OD-RN-46)", "(OD-RN-47)" |
| H25 | L509 | §13 | `round 1` | FOLDED | §13 | §13 RN-2: "Pins (added in round 1)" → "Pins"; "Round 3 pins (RN-V7)" → "Further pins (OD-RN-40)" |
| H26 | L509 | §13 | `Round 3` | FOLDED | §13 | §13 RN-2: "Pins (added in round 1)" → "Pins"; "Round 3 pins (RN-V7)" → "Further pins (OD-RN-40)" |
| H27 | L511 | §13 | `Round 5` | FOLDED | §13 | §13 RN-3: "Round 5 pins (…)" → "Further pins (OD-RN-48)"; "byte-identical to round 4" → "byte-identical to the truth read" |
| H28 | L511 | §13 | `round 4` | FOLDED | §13 | §13 RN-3: "Round 5 pins (…)" → "Further pins (OD-RN-48)"; "byte-identical to round 4" → "byte-identical to the truth read" |
| H29 | L513 | §13 | `Round 3` | FOLDED | §13 | §13 RN-4: the round-labelled pin groups → "Further pins (OD-RN-41)", "(OD-RN-45)", "(OD-RN-50, OD-RN-48)"; "round 4's office scope" → "the ruler's office scope" |
| H30 | L513 | §13 | `Round 4` | FOLDED | §13 | §13 RN-4: the round-labelled pin groups → "Further pins (OD-RN-41)", "(OD-RN-45)", "(OD-RN-50, OD-RN-48)"; "round 4's office scope" → "the ruler's office scope" |
| H31 | L513 | §13 | `Round 5` | FOLDED | §13 | §13 RN-4: the round-labelled pin groups → "Further pins (OD-RN-41)", "(OD-RN-45)", "(OD-RN-50, OD-RN-48)"; "round 4's office scope" → "the ruler's office scope" |
| H32 | L513 | §13 | `round 4` | FOLDED | §13 | §13 RN-4: the round-labelled pin groups → "Further pins (OD-RN-41)", "(OD-RN-45)", "(OD-RN-50, OD-RN-48)"; "round 4's office scope" → "the ruler's office scope" |
| H33 | L515 | §13 | `round 4` | FOLDED | §13 | §13 RN-5: "the bodies' rate, round 4" → "the bodies' rate" |
| H34 | L669 | §15 | `round 4` | FOLDED | §15 | §15 R69: "exactly as round 4" → "exactly as the truth read" |
| H35 | L688 | §16 | `round 3` | FOLDED | §16 | §16 OD-RN-6: "(OD-RN-40, round 3)" → "(OD-RN-40)"; the amendment's date in the Ruled column |
| H36 | L694 | §16 | `round 1` | FOLDED | §16 | §16 OD-RN-12: "round 1:" removed; the amendment's date in the Ruled column |
| H37 | L701 | §16 | `ROUND 1` | FOLDED | §16 | §16 OD-RN-19: "ROUND n adds" removed, the constants' list kept whole; the amendments' dates in the Ruled column |
| H38 | L701 | §16 | `ROUND 2` | FOLDED | §16 | §16 OD-RN-19: "ROUND n adds" removed, the constants' list kept whole; the amendments' dates in the Ruled column |
| H39 | L701 | §16 | `ROUND 3` | FOLDED | §16 | §16 OD-RN-19: "ROUND n adds" removed, the constants' list kept whole; the amendments' dates in the Ruled column |
| H40 | L701 | §16 | `ROUND 5` | FOLDED | §16 | §16 OD-RN-19: "ROUND n adds" removed, the constants' list kept whole; the amendments' dates in the Ruled column |
| H41 | L703 | §16 | `round 5` | FOLDED | §16 | §16 OD-RN-21: "since round 5" removed; the amendment's date in the Ruled column |
| H42 | L713 | §16 | `ROUND 3` | FOLDED | §16 | §16 OD-RN-31: "ROUND 3:" removed |
| H43 | L723 | §16 | `ROUND 4` | FOLDED | §16 | §16 OD-RN-41: "ROUND 4:" removed; its clause folded (OD-RN-45); the amendments' dates in the Ruled column |
| H44 | L727 | §16 | `round 5` | FOLDED | §16 | §16 OD-RN-45: "since round 5" removed; the amendment's date in the Ruled column |
| H45 | L753 | §17 | `round 4` | FOLDED | §17 | §17: "; round 4" removed from the line's note |
| H46 | L754 | §17 | `round 5` | FOLDED | §17 | §17: "round 5, B.5" → "OD-RN-49" |
| H47 | L771 | §18 | `round 1` | FOLDED | §18 | §18 REFINED list: the round labels and their dates removed; each refinement keeps its section |
| H48 | L771 | §18 | `round 2` | FOLDED | §18 | §18 REFINED list: the round labels and their dates removed; each refinement keeps its section |
| H49 | L771 | §18 | `round 2b` | FOLDED | §18 | §18 REFINED list: the round labels and their dates removed; each refinement keeps its section |
| H50 | L771 | §18 | `round 3` | FOLDED | §18 | §18 REFINED list: the round labels and their dates removed; each refinement keeps its section |
| H51 | L771 | §18 | `round 4` | FOLDED | §18 | §18 REFINED list: the round labels and their dates removed; each refinement keeps its section |
| H52 | L771 | §18 | `round 5` | FOLDED | §18 | §18 REFINED list: the round labels and their dates removed; each refinement keeps its section |
| H53 | L773 | §18 | `Round 2` | FOLDED | §18 | §18 the open questions and routes: the round labels (and "r3") removed; each item keeps its number (1)–(7) |
| H54 | L773 | §18 | `round 1` | FOLDED | §18 | §18 the open questions and routes: the round labels (and "r3") removed; each item keeps its number (1)–(7) |
| H55 | L773 | §18 | `round 2` | FOLDED | §18 | §18 the open questions and routes: the round labels (and "r3") removed; each item keeps its number (1)–(7) |
| H56 | L773 | §18 | `Round 2b` | FOLDED | §18 | §18 the open questions and routes: the round labels (and "r3") removed; each item keeps its number (1)–(7) |
| H57 | L773 | §18 | `Round 3` | FOLDED | §18 | §18 the open questions and routes: the round labels (and "r3") removed; each item keeps its number (1)–(7) |
| H58 | L773 | §18 | `r3:` | FOLDED | §18 | §18 the open questions and routes: the round labels (and "r3") removed; each item keeps its number (1)–(7) |
| H59 | L773 | §18 | `Round 4` | FOLDED | §18 | §18 the open questions and routes: the round labels (and "r3") removed; each item keeps its number (1)–(7) |
| H60 | L773 | §18 | `Round 5` | FOLDED | §18 | §18 the open questions and routes: the round labels (and "r3") removed; each item keeps its number (1)–(7) |
| H61 | L779 | §19 | `Round r1` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H62 | L779 | §19 | `round 1` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H63 | L833 | §19 | `Round r2` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H64 | L833 | §19 | `round 2` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H65 | L877 | §19 | `round r2` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H66 | L879 | §19 | `Round r2b` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H67 | L879 | §19 | `round 2b` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H68 | L900 | §19 | `round r2b` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H69 | L902 | §19 | `Round r3` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H70 | L902 | §19 | `round 3a` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H71 | L934 | §19 | `round r3` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H72 | L936 | §19 | `Round r4` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H73 | L936 | §19 | `round 4a` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H74 | L938 | §19 | `round 4` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H75 | L942 | §19 | `round 3` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H76 | L946 | §19 | `round 3` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H77 | L974 | §19 | `round r4` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H78 | L976 | §19 | `Round r5` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H79 | L976 | §19 | `round 5a` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H80 | L978 | §19 | `round 4` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H81 | L998 | §19 | `r5:` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H82 | L1017 | §19 | `r6:` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H83 | L1024 | §19 | `round r5` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H84 | L1026 | §19 | `Round r6` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H85 | L1026 | §19 | `round 6a` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| H86 | L1034 | §19 | `Round P5` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| S00 | L6 | header | `STOP` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| S01 | L9 | header | `STOP` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| S02 | L74 | §0 | `STOP` | FOLDED | §0 | the research-rulings line restated: departures are recorded in §16 |
| S03 | L359 | 5.4 | `STOP` | KEPT | §5.4 | a design mark: the heading's "or a STOP with its slot" names the role table's slot rows |
| S04 | L367 | 5.4 | `STOP` | KEPT | §5.4 | a design mark: ⛔ STOP RN-S2 (the general's lean; slot C4) kept in the role table |
| S05 | L368 | 5.4 | `STOP` | KEPT | §5.4 | a design mark: ⛔ STOP RN-S3 (the councillor's lean; slot C4) kept in the role table |
| S06 | L817 | §19 | `STOP` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| S07 | L831 | §19 | `STOP` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| S08 | L835 | §19 | `STOP` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| S09 | L844 | §19 | `STOP` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| S10 | L877 | §19 | `STOP` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| S11 | L900 | §19 | `STOP` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| S12 | L934 | §19 | `STOP` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| S13 | L974 | §19 | `STOP` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| S14 | L1024 | §19 | `STOP` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| S15 | L1047 | §19 | `STOP` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| F00 | L380 | 5.6 | `(fp-final P5)` | FOLDED | §5.6 | the stamp removed with its provenance clause "— the last by P5 (WC-RN-49, <date> (fp-final P5))"; the faction↔faction refusal stands (§2.2) |
| F01 | L773 | §18 | `(fp-final P5)` | FOLDED | §18 | the stamp of the "[ANSWERED <date> (fp-final P5) — …]" note removed; its answer (BD's OD-BD-60 and OD-BD-59, applied at §3.1) folded into item (7) |
| U00 | L9 | header | `ROUTED-UNAPPLIED` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| U01 | L9 | header | `ROUTED-UNAPPLIED` | MOVED | history | in the header/status block (old lines 3–9), moved to `history/RN-cure-record.md` Part 1 |
| U02 | L938 | §19 | `ROUTED-UNAPPLIED` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| U03 | L943 | §19 | `ROUTED-UNAPPLIED` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| U04 | L944 | §19 | `ROUTED-UNAPPLIED` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| U05 | L945 | §19 | `ROUTED-UNAPPLIED` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| U06 | L978 | §19 | `ROUTED-UNAPPLIED` | MOVED | history | in the cure record (old §19), moved verbatim to `history/RN-cure-record.md` Part 2 |
| L0 | L3 | header | `## Chair session a73343ed (Fable 5.1); compiled by lane L-RN` | MOVED | history | header/status line, moved with the header block to `history/RN-cure-record.md` Part 1; its design facts stand in THE READER'S GUIDE and the dispatch-gate line |
| L1 | L6 | header | `## '[REFINED 2026-10-17 (fp-final) — …]' brackets may appear` | MOVED | history | header/status line, moved with the header block to `history/RN-cure-record.md` Part 1; its design facts stand in THE READER'S GUIDE and the dispatch-gate line |
| L2 | L7 | header | `## P6c (THE BRACKETS): THE OPPORTUNITY's rows ('rescued_by',` | MOVED | history | header/status line, moved with the header block to `history/RN-cure-record.md` Part 1; its design facts stand in THE READER'S GUIDE and the dispatch-gate line |
| L3 | L9 | header | `> **Status: COMPILED, DARK, NOT SCHEDULED; P3 ROUND 1 DISPOS` | MOVED | history | header/status line, moved with the header block to `history/RN-cure-record.md` Part 1; its design facts stand in THE READER'S GUIDE and the dispatch-gate line |
| R0 | L779 | §19 | `### Round r1 (P3 round 1, 2026-10-18; lane D-RN-r1, Opus 5.5` | MOVED | history | cure-record round header, moved verbatim with old §19 to `history/RN-cure-record.md` Part 2 |
| R1 | L833 | §19 | `### Round r2 (P3 round 2, 2026-10-18; lane D-RN-r2, Opus 5.5` | MOVED | history | cure-record round header, moved verbatim with old §19 to `history/RN-cure-record.md` Part 2 |
| R2 | L879 | §19 | `### Round r2b (P3 round 2b, 2026-10-18; lane D-RN-r2b, Opus ` | MOVED | history | cure-record round header, moved verbatim with old §19 to `history/RN-cure-record.md` Part 2 |
| R3 | L902 | §19 | `### Round r3 (P3 round 3a, 2026-10-18; lane D-RN-r3, Opus 5.` | MOVED | history | cure-record round header, moved verbatim with old §19 to `history/RN-cure-record.md` Part 2 |
| R4 | L936 | §19 | `### Round r4 (P3 round 4a, 2026-10-18; lane D-RN-r4, Opus 5.` | MOVED | history | cure-record round header, moved verbatim with old §19 to `history/RN-cure-record.md` Part 2 |
| R5 | L976 | §19 | `### Round r5 (P3 round 5a, 2026-10-19; lane D-RN-r5, Opus 5.` | MOVED | history | cure-record round header, moved verbatim with old §19 to `history/RN-cure-record.md` Part 2 |
| R6 | L1026 | §19 | `### Round r6 (P3 round 6a, 2026-10-19; lane D-RESIDUE-r6 — o` | MOVED | history | cure-record round header, moved verbatim with old §19 to `history/RN-cure-record.md` Part 2 |
| R7 | L1034 | §19 | `### Round P5 (2026-10-20; lane D-MN-RN-p5b, Opus 5.5 — the s` | MOVED | history | cure-record round header, moved verbatim with old §19 to `history/RN-cure-record.md` Part 2 |
| R8 | L1049 | §19 | `### P6c (2026-10-20; lane BRACKETS-A2-program-volumes, INSER` | MOVED | history | cure-record round header, moved verbatim with old §19 to `history/RN-cure-record.md` Part 2 |

## CURES AFTER FV-RN (2026-10-23, the cloud chair)
- G1 (THE READER'S GUIDE item 3, the pass's recurring guide pattern): the BELIEF clause names `pairNet`'s two carve-outs — a true `vassal` label is read true and κ rides only a true label (§2.3, OD-RN-48). No new decision.
- N9: the strike of `served_with` and `gift` carries B126's "(vetoable)" again.
- ⛔ STOP RN-C-1 RULED by the chair (2026-10-23, by delegation, vetoable) — N4, the sworn-doer reading: B301 says the officer reads X's coordinates "in place of its own"; the later B302 says "in place of the doer's own". Both brackets register the reading as THE ONE OVERRIDE of "Which character each holder reads" ("a person its own") — the override replaces the OFFICER's own character, and lens one never reads the doer's. B302's phrase contradicts the premise both brackets state, so the text keeps "in place of its own" (B301's words, consistent with the override as both define it); B302's other content stands.

## SEAMS CURES (2026-10-23, per SEAMS-P8, the chair's rulings)

- SEAMS-P8-1 · §5.1 RN-S1 (THE ONE PERSON STAGE) · "measures it once for all three), and CH and PT REGISTER their passes" → "measures it once for all four), and CH, OP and PT REGISTER their passes".
- SEAMS-P8-8 · THE READER'S GUIDE item 4 · "; the party's credibility holder by refold (§7);" (removed from the list) → a new sentence after the list: "The party's credibility holder is written only by PT's `partyLedger.js`, which refolds §7's law — RN writes nothing on `spatialLedgers.party`."
- SEAMS-P8-8 · §7 CREDIBILITY, The undo · "REBUILDS the holder by refolding — exact" → "REBUILDS the holder by refolding (PT's `partyLedger.js` performs the refold) — exact". (Ratchet: two new-in-new tokens, `partyLedger.js` and `spatialLedgers.party`, both PT's registered names; no class changed.)
- SEAMS-P8-10 · §18 the refinements paragraph · "REFINED (each folded into its section; each vetoable): R-RN-1 the regard ladder · … · R-RN-12 the verdict as a deed source ·" → "**THE REFINEMENTS** (each vetoable; each stands in the text it changed; their ids and rounds are in the cure record): the regard ladder · … · the verdict as a deed source ·" (PT §20's form; the twelve R-RN ids go to the cure record; the named refinements unchanged).

## LENS → READINGS (2026-10-23, the chair's ruling on the fold §5 `lens` row)
The chair's ruling (2026-10-23, by delegation, vetoable; OD-FC-63, the latest ruling wins): on every DM surface a lens is a MAP LAYER, and THE RENOWN's two ways of judging a deed are "readings" in prose, never "lenses". The LENS SWEEP seat renamed every site where "lens"/"lenses" names RN's deed reading; backticked tokens, paths and every other sense are kept (listed below). No owner quotation was edited. Line numbers are the edited text's (the volume or the part; the edits add no lines).
**Renamed: 81 sites in 81 edits** (each edit an asserted single replacement, `scratchpad/lensweep/apply.py`; an edit naming two sites in one sentence is one line below).
- L11: "every deed read through two lenses (§6)" → "every deed judged by two readings (§6)"
- L32: "it reads every deed through two lenses — what the act is" → "it judges every deed by two readings — what the act is"
- L66: "| LENS TWO's read of how a" → "| READING TWO's read of how a"
- L74: "that RN's lens two (`pairNet`) and" → "that RN's reading two (`pairNet`) and"
- L110: "READS A DEED THROUGH TWO LENSES.**" → "READS A DEED THROUGH TWO READINGS.**"
- L110: "(§6). Lens one: what the act is" → "(§6). Reading one: what the act is"
- L110: "own alignment. Lens two: whom it helped" → "own alignment. Reading two: whom it helped"
- L110: "A TOWN's character enters lens one only" → "A TOWN's character enters reading one only"
- L144: "keys no regard: lens two finds no tie in" → "keys no regard: reading two finds no tie in"
- L166: "RN reads that nowhere — lens two reads the deed's" → "RN reads that nowhere — reading two reads the deed's"
- L167: "the six bits above and lens one reads NO oath (§6.2)" → "the six bits above and reading one reads NO oath (§6.2)"
- L191: "law E14), which lens two reads (§6.2)" → "law E14), which reading two reads (§6.2)"
- L191: "RN's READ of that state for lens two, never an RN regard" → "RN's READ of that state for reading two, never an RN regard"
- L191: "reason `pair_state`, and lens two reads BD's label" → "reason `pair_state`, and reading two reads BD's label"
- L191: "the gang has no tie (lens two reads none)" → "the gang has no tie (reading two reads none)"
- L204: "cause } | null` — the two lenses (§6.2)" → "cause } | null` — the two readings (§6.2)"
- L205: "— LENS ONE'S PURE CORE, EXPORTED:" → "— READING ONE'S PURE CORE, EXPORTED:"
- L213: "THE HOLDER BELIEVES IT, as lens two's net on" → "THE HOLDER BELIEVES IT, as reading two's net on"
- L239: "`lens` (RN's "two lenses" are design prose for a deed's two READINGS — never a code token and never a DM-facing word; the map module's lenses are map layers, HOST-REQUIREMENTS-2026-10-18)" → "`lens` (RN's two ways of judging a deed are its two READINGS — "reading one", "reading two" — in prose, never "lenses"; `lens` is never an RN code token (`lensOne` is the export's name) and never a DM-facing word; on every DM surface a lens is a map layer, the map module's sense, HOST-REQUIREMENTS-2026-10-18; the fold §5 `lens` row)"
- L261: "by whom it helped or hurt (lens two), never by a face" → "by whom it helped or hurt (reading two), never by a face"
- L262: "and every tie is read by lens two |" → "and every tie is read by reading two |"
- L275: "time (§4's decay), the other lens (§6)," → "time (§4's decay), the other reading (§6),"
- L347: "reads each through §6's lenses for the town (`s:`)" → "reads each through §6's readings for the town (`s:`)"
- L355: "never the decayed ring), the lenses' reading decayed on `a_few_years`" → "never the decayed ring), the readings' mix decayed on `a_few_years`"
- L391: "did not harm (its own lens two ≥ 0)" → "did not harm (its own reading two ≥ 0)"
- L391: "`pairNet(...).label`, lens two's one read," → "`pairNet(...).label`, reading two's one read,"
- L391: "belief by construction — else lens two's fallback pair" → "belief by construction — else reading two's fallback pair"
- L401: "VALUE OF A DEED AND THE TWO LENSES (RN-3)" → "VALUE OF A DEED AND THE TWO READINGS (RN-3)"
- L425: "A verdict deed is read by LENS ONE ALONE" → "A verdict deed is read by READING ONE ALONE"
- L425: "never a party lens two helps or hurts" → "never a party reading two helps or hurts"
- L425: "reads its target through lens two (CH's "yes" column)" → "reads its target through reading two (CH's "yes" column)"
- L425: "commons read them through lens two as acts upon themselves" → "commons read them through reading two as acts upon themselves"
- L425: "their lens-one values are BD's" → "their reading-one values are BD's"
- L425: "reads the deed through LENS TWO ONLY" → "reads the deed through READING TWO ONLY"
- L425: "a pledge has no lens-one reading, because" → "a pledge has no reading one, because"
- L427: "### 6.2 The two lenses (`readDeed`)" → "### 6.2 The two readings (`readDeed`)"
- L429: "each band entering the lenses at its DRAFT centre" → "each band entering the readings at its DRAFT centre"
- L431: "**Lens one — what the act is:**" → "**Reading one — what the act is:**"
- L431: "**Lens two — whom it helped" → "**Reading two — whom it helped"
- L431: "by construction, so lens two reads the engine's" → "by construction, so reading two reads the engine's"
- L431: "μ·ally` when lens two found at least one" → "μ·ally` when reading two found at least one"
- L431: "so an empty lens two never halves" → "so an empty reading two never halves"
- L433: "— reads LENS ONE with X's RECORDED" → "— takes READING ONE with X's RECORDED"
- L433: "THE GOD DOES NOT). Lens one reads the god's" → "THE GOD DOES NOT). Reading one reads the god's"
- L433: "UNTIL IT IS SIGNED lens one reads NO oath —" → "UNTIL IT IS SIGNED reading one reads NO oath —"
- L435: "rule, by construction:** when lens one is ≥ 0" → "rule, by construction:** when reading one is ≥ 0"
- L435: "< 0.67), lens two may cancel the warmth" → "< 0.67), reading two may cancel the warmth"
- L435: "a `malicious` holder's lens two stands" → "a `malicious` holder's reading two stands"
- L435: "−0.2, a grudge carried by lens two ("they saved Kell")" → "−0.2, a grudge carried by reading two ("they saved Kell")"
- L435: "(PT-4's thresholds), lens one reads the act ALONE" → "(PT-4's thresholds), reading one reads the act ALONE"
- L437: "on scrutiny which lens carried it" → "on scrutiny which reading carried it"
- L450: "the deed ledger through the lenses (towns, courts" → "the deed ledger through the readings (towns, courts"
- L486: "| `relationshipState.js` (lens two's read) |" → "| `relationshipState.js` (reading two's read) |"
- L520: "Alignment: READ (the lenses, RN-3)." → "Alignment: READ (the readings, RN-3)."
- L524: "INHERENT VALUE AND THE TWO LENSES.**" → "INHERENT VALUE AND THE TWO READINGS.**"
- L524: "the lenses inside `readDeed`" → "the readings inside `readDeed`"
- L524: "direct, every other hearer lens two only)" → "direct, every other hearer reading two only)"
- L524: "its own town's commons by lens two whatever" → "its own town's commons by reading two whatever"
- L524: "all three axes, both lenses (requirement 13's quadrant" → "all three axes, both readings (requirement 13's quadrant"
- L524: "term names the deed and the lens that carried it." → "term names the deed and the reading that carried it."
- L547: "fame, the observer read, the lenses, the deed telling," → "fame, the observer read, the readings, the deed telling,"
- L617: "ruler `balanced`) | lens two reads `pairNet`" → "ruler `balanced`) | reading two reads `pairNet`"
- L618: "reading −0.2, carried by lens two — the reason" → "reading −0.2, carried by reading two — the reason"
- L651: "the ally cools (lens two)" → "the ally cools (reading two)"
- L673: "the free company's lens two reads the pair state" → "the free company's reading two reads the pair state"
- L680: "warmly grudges the deed by lens two;" → "warmly grudges the deed by reading two;"
- L682: "the party relieves Kell | lens two at Varn reads" → "the party relieves Kell | reading two at Varn reads"
- L685: "by lens two (the act helped" → "by reading two (the act helped"
- L707: "| Inherent value and the lenses (the owner's §8 words" → "| Inherent value and the readings (the owner's §8 words"
- L707: "twelve-row table; the two lenses; personality's mix" → "twelve-row table; the two readings; personality's mix"
- L707: "condemner's cost on regard only; lens two reads the landed" → "condemner's cost on regard only; reading two reads the landed"
- L714: "the lens weights a 1.0 · b 0.5" → "the reading-one weights a 1.0 · b 0.5"
- L716: "| OD-RN-21 | Lens two for towns and courts" → "| OD-RN-21 | Reading two for towns and courts"
- L729: "stamp's scandal class, read by lens one alone" → "stamp's scandal class, read by reading one alone"
- L740: "regard of the court (else lens two's fallback pair" → "regard of the court (else reading two's fallback pair"
- L743: "`pairNet` — lens two's read and the court" → "`pairNet` — reading two's read and the court"
- L744: "its PLACE is lens two's relieved town" → "its PLACE is reading two's relieved town"
- L746: "read a quarter act through lens two as an act upon themselves" → "read a quarter act through reading two as an act upon themselves"
- L747: "live record; UNTIL SIGNED lens one reads NO oath" → "live record; UNTIL SIGNED reading one reads NO oath"
- L754: "*(surface; the two lenses, two holders)*" → "*(surface; the two readings, two holders)*"
- L788: "RN's two pair reads (lens two's `pairNet`," → "RN's two pair reads (reading two's `pairNet`,"
**Kept (not RN's deed reading):**
- L17, L205, L433 `lensOne` · L239, L788 `lens` · `renown/personLens.js`, `personLens` (L429, L490, L492, L524, L535) · `lensProbe.out.json` (L431, L435, L443, L617, L618, L639) — backticked tokens and paths, kept exactly
- L55 "the TOWN's lens (§6)" · L68 "the town lens" ×2 · L70 "the TOWN lens" · L429 "The town lens" ×2 · L724 OD-RN-29 "The town lens" — a town's CHARACTER coordinates (the axes' landed bands), the input a reading takes, not one of the two readings
- L56 "the PERSON's and the COURT's (by its ruler) lens" · L235, L425 "the person lens" · L429 "the person lens" ×2, "its ruler's person lens", "the person lens's" ×2 — a holder's character coordinates (the `personLens.js` leaf's), not a reading
- L180, L181, L731 "its lens" (a corps's or gang's character coordinates) · L330 "whose lens" (a balanced town's coordinates) · L391 "their own lens judged the deed" (the commons' own coordinates) — a holder's character, not a numbered reading
- L372, L454, L522 ×2, L534, L638 "the ruler's lens" — a court read through its ruler's coordinates (holder character)
- L458 "any future renown lens row (H23)" — a MAP lens (the H23 lens window), the map's sense
- L239 (new text) "a lens is a map layer" and "never \"lenses\"" — the ruling stated, the map's sense
**Ratchet** (`python3 KIT/tools/consolidate-ratchet.py KIT/history/RN-bracketed-1beabdc85.md DOCS/DESIGN_FP_ARCH_RN.md --allow-missing-file KIT/consolidate/RN-allow.txt`): before and after BYTE-IDENTICAL output (diffed) — `tokens: old 1381 · new 1246 · missing 0 · new-in-new 18`; last line unchanged, `RATCHET 3 DIFFERENCE CLASSES`. No token went missing (prose only).
DOCS/DESIGN_FP_ARCH_RN.md copied to KIT/consolidate/RN-new.md after the edits (`cmp` identical).
Heading renames: §6 "THE INHERENT VALUE OF A DEED AND THE TWO LENSES" → "… AND THE TWO READINGS"; §6.2 "The two lenses" → "The two readings"; law RN9 and unit RN-3 titles likewise. Title cites searched in the thirteen volumes and the fold parts: none cite the old §6/§6.2 titles verbatim; PT L17 and L440 paraphrase them (renamed in PT); PT L440 quotes RN §5.1's "through §6's lenses", renamed with RN L347 to "through §6's readings". OD-RN-12 and OD-RN-21 titles renamed; no other volume or fold part cites them by title.
