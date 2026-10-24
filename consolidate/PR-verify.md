# PR — FIDELITY VERIFICATION OF THE CONSOLIDATION (P8, seat FV-PR, cloud session, 2026-10-23)

**COUNTS: sampled 124 ledger rows · holds 121 · fails 3.** The 3 fails are F1 (row B208: a cross-reference to a passage that no longer exists), F2 (THE READER'S GUIDE item 3 claims more than the text supports) and F3 (row B563: the label of the ⭐ OD-PR-51 row). Seven notes (N1–N7) are not fidelity fails.

**THE RATCHET.** I re-ran it on `docs/DESIGN_FP_ARCH_PR.md` as it stands, with `consolidate/PR-allow.txt`. Its last line: **`RATCHET 3 DIFFERENCE CLASSES`**. Detail: tokens 1365 → 1252, missing 0, new-in-new 11; cites 77 = 77, missing 0; laws 19 = 19; OD 71 → 66; ⭐ 31 → 27; DRAFT 43 → 41; UNMEASURED 23 = 23; waves 8 = 8; flags 23 = 23; review markers left 0. This is identical to ledger §5. `consolidate/PR-new.md` is byte-identical to the volume (`cmp`). I re-proved each of the three differences by script:
- **OD 71 → 66.** The five lost ids each occur only in moved or dropped text: `OD-BD-49` at old L879, L907 and L1122; `OD-FC-46` at L911; `OD-FC-60` at L1157; `OD-ST-39` at L12, L926 and L953; `OD-OP-36` only inside B143, the P6c stamp of the §3.1 ↳ row. Every OD-PR id survives, and no id is added.
- **⭐ 31 → 27.** The old text held 17 ⭐ before L876 (one of them in the header block at L12, which moved) and 14 in §19–§20 (moved). All 16 body ⭐ map one-to-one onto ⭐ at the aligned new lines: L228 ×2, L230, L434, L436, L649, L652, L707, L725, L819, L823, L844, L845, L850, L851, L853. The new text adds 11: the header (L5, L20), L96, L217, the §17 lead (L793), OD-PR-0 (L797), L823 (second), L835 ×2 and L891 ×2. So 31 − 15 + 11 = 27. No ⭐ owner row of the old text outside the moved trail lost its ⭐. OD-PR-51's ⭐ was struck in the old text; see F3.
- **DRAFT 43 → 41.** Old L12 (moved) and the two change-note quotes B167 (old L282) and B303 (old L459) leave; the new header L5 adds one. B167 holds: new L289 reads MN's `MIGHT_LATENT`. B303 holds: new L465 keeps `NET_HOME_MIN` (DRAFT 1, UNMEASURED). Per line, every other DRAFT and UNMEASURED mark of the body survives at its aligned line (script).

**THE ALLOW FILE (124 lines, 124 unique).** I checked each line by script:
- every entry is an old token and is absent from the new text;
- old minus new is exactly the 124 entries;
- each entry's occurrences lie in the header, in old §19–§20, or inside a dropped bracket, with six running-text exceptions. Each exception is explained by its class: the two tokenizer pairings at old L166 and L338, the three pinned-array quotes in OD-PR-51's struck r5 text (L845), and `{ seasonStartTick, weeks }` (L844), OD-PR-50's pair before `swept?`.

No line lacks a true reason.

**THE MARKER COUNT (my own balanced scan, `scratchpad/fvpr/count.py`).** 580 brackets, all top-level, none nested: CURED 504 · REFINED 48 · ADDED 11 · RE-RULED 10 · OPENED 6 · PLAUSIBLE 1. My bracket index matches the ledger's B ids (B167, B303 and B563–B565 checked by content). Outside the brackets:
- `↳` 13;
- STOP markers 53 (the raw 57 hits include "STOPs" at L6 and "STOPPED" at L128, L395 and L739);
- ROUTED-UNAPPLIED 9;
- round words 54 on the ledger's basis ("round N" with a space, or "rN:").

With 7 header and status lines and 8 cure-record headers, the total is **724 = the ledger's 724 rows**. The ratchet's MARKERS regex finds 601 = 504 + 48 + 11 + 6 + 13 ↳ + 9 ROUTED-UNAPPLIED + 10 `(fp-final r6)` stamps inside the RE-RULED brackets. It misses `[RE-RULED` itself and `[PLAUSIBLE`. The ledger's statement of the basis is confirmed.

**THE CURE RECORD.** `history/PR-cure-record.md` contains old L3 and old L6–12 (Part 1), old L913–1170 (Part 2) and old L876–912 (Part 3) as contiguous byte-identical blocks (script). Old L1171–1172 ("END OF VOLUME.") stays in the volume.

**THE CHAIR'S RULING ON PL-C-1: APPLIED as written.** In PR the bare word "passage" carries THE PASSAGE's meaning, and the charter's toll right is named `toll_exemption`:
- PR11 (new L142): "whose grant is tolls only (`toll_exemption`, PL §4.5)";
- §0.5 R-9 (L116): "PL's charter grants tolls only (`toll_exemption`, PL §4.5)";
- §10.1 (c) (L452): "The charter grants tolls only (`toll_exemption`, PL §4.5), never leave to cross", with R-9's note;
- guide item 8.

The other eight bare "passage" hits (L116, L402, L425, L426, L470, L472, L619, L624) all mean PS's crossing.

**THE ELEVEN LATEST-WINS REPAIRS AND SEAT 2'S TWO EDITS IN SEAT 1'S TEXT.**
- Ten repairs HOLD: §14.1 PR-2 (L591); R52 (L781, against §5.5 at L308); the §15.2 row (L652); OD-PR-1 (L798, against §14 at L535); OD-PR-3 (L800); OD-PR-30 (L827); OD-PR-16 (L813); OD-PR-26 (L823); the OD-PR-50 ↳ (L850); STOP-PR-r4-1 (L854: the ruling's final text, the two declined proposals gone); OD-PR-52 (L852: ES-2b OPENED, "the wave order standing"). Every source is the latest bracket.
- The eleventh, OD-PR-51, holds in content but fails on its label (F3).
- PR5 (h) "a magistrate's lean (§10.5)" HOLDS: §3.1 L243 and §10.5 L482 say "never a band step and never 'for a season'".
- Guide item 3 is rewritten, but see F2.

**OLD §19, CUT TO FOUR.**
- R5a Q1 is answered by the re-ruling (§5.5 L308, PR16, OD-PR-51).
- R5a Q2 is answered by RULINGS-ROUND6 B.3 (`swept`, §7.6 L375, §2.6), which supplies the old alternative's "second field".
- The R4a and R3a lists were already "kept below as history" in the old text. Each item stands as a ruling the text carries: OD-PR-42 (alternative "not taken"), OD-PR-33's `excess`, OD-PR-26's need-only net, OD-PR-13's net witness, §5.5's "residency never moves", §6.6's PLAUSIBLE draw-share index.
- The four questions kept (R5a Q3–Q6) are still open.
- One pointer into old §19 survives: F1.

**THE RULINGS (§17, read whole).** 58 rows = 58 rows, in the same order (script). OD-PR-0 … OD-PR-53, STOP-PR-0/1/2/r4-1 and THE OPEN STOPS (none) are all present. The ⭐ rows OD-PR-0, -44, -45, -50, -51 and -53 are VISIBLE. Every row's text is the latest bracket's, and stamps and finding ids are gone.

**THE CROSS-REFERENCES.** Every bare "§x" resolves to a new heading. The resolver's misses are other volumes' sections: V13 §3.9, CH §12.4, PL §4.7 and PL §15.12. Separately, F1's "§19" resolves to a heading but not to the content it names.

## THE FAILS
- **F1 — B208 (§6.6, old L341 → new L348): a dangling cross-reference.**
  - OLD (inside the REFINED bracket, written when §19 R4a Q2 held it): "the alternative (the literal 0/0 → 0 with `points` uncapped) is in §19".
  - NEW: "vetoable: the alternative, the literal 0/0 → 0 with `points` uncapped, is in §19".
  - New §19 (L884–891) no longer carries that alternative. It is in `history/PR-cure-record.md` Part 3 (old R4a Q2). The ledger row says "its vetoable alternative kept (§19)".
  - **Cure:** drop ", is in §19" (the sentence already states the alternative).
- **F2 — THE READER'S GUIDE item 3 claims more than the text supports.**
  - The guide says "BELIEF for the courts' decisions — … ; TRUTH where the world acts — …". Its TRUTH list omits a deciding court's own facts, which the text reads as truth for its own decisions:
    - PR2 (L124): "the war state and the town's belief of what is out there set how many ride this week";
    - §3.2 (L250) and §9.1 (L424): "a live war front naming it (a declaration)", "the town's army deployed abroad, `deployments[id].targetId`";
    - §3.2 (L248): the peace fork on "the court's own risk appetite" and "the seat's alignment";
    - §9.1 (e) (L430): `keepRiders` "read from the court's risk posture".
  - This is the same pattern the CH, PT, MN, PL and RN verifiers failed.
  - **Cure:** add "and the deciding court's own facts — its war front and its army's deployment, its posture and alignment (PR2, §3.2, §9.1 (e))" to the TRUTH clause.
- **F3 — B563 (⭐ OD-PR-51, old L845 → new L851): a struck owner's mark is reasserted.**
  - OLD: "~~⭐ OD-PR-51~~ STRUCK by RULINGS-ROUND6 A.2 — the riders take NO token; … master's access law and its pins untouched by PR". The ⭐ existed because "a landed access law widened is the owner's to see" (old §19 R5a Q1). RULINGS-ROUND6 A.2 struck the token, and the owner's shape it names is the route ledger's mode `way`, which belongs to BD.
  - NEW: "⭐ OD-PR-51 (THE OWNER'S SHAPE row, re-ruled — VISIBLE)", with Ruled column "… · THE OWNER'S SHAPE (VISIBLE)". That labels as an owner's shape a ruling that changes no shape (PR16: "PR makes NO edit to master's hidden-path access law").
  - **Cure:** keep the row VISIBLE with the ⭐ shown struck: "~~⭐~~ OD-PR-51 (re-ruled — the owner's-shape row of 2026-10-19 struck; no token, no shape)". Drop "THE OWNER'S SHAPE" from the Ruled column and from §19 L891. The ⭐ character count is unchanged.

## NOTES (not fails)
- **N1** — Ledger §6's ⭐ and DRAFT explanations omit the header's moved ⭐ and DRAFT (old L12) and the new header's additions (L5, L20). The totals reconcile (above), but the stated reasons do not.
- **N2** — The 724 basis counts only spaced round words. Seven hyphenated body forms ("round-5" at L168, "round-2b" at L631, "round-3" at L632, "round-4" at L645 and L685, "round-5" at L646 and L701) have no H rows. Each is removed by a §3 substitution, and no round word is left in the new running text (grep).
- **N3** — `OD-OP-36` left with B143's stamp. The ↳ row's content and its cite "OP §14 row 37" are folded into the WILL row (L243).
- **N4** — Line-number references are inherited, not introduced: "HR:813", "kernel l.2527 …" (§4.2) and "PT §2.4 line 173" (OD-PR-32), all present in the old text.
- **N5** — Guide item 8's "the map's cadence words versus MN's might words, `RESERVE_BANDS` and PS's tolerance band" compresses R-2 loosely. The collision was the brief's `none · thin · fair · strong`.
- **N6** — §7.6 (L375) attributes RULINGS-ROUND6 B.3's quotation to "PL". B.3's owner is PL, so this is acceptable.
- **N7** — Guide item 4 is not exhaustive (the sightings through MN's `recordSighting`, the `patrol_join_refused` patch and the hearing mints go unnamed), but it says neither "only" nor "every".

## THE TABLE
| row | verdict | receipt |
|---|---|---|
| B009 · B010 · B011 (PR-r2-1/-2, BLOCKING) | HOLD | §0.1 L61–63: the draw from the SEED at deploy, never per-tick; "`facets.manpower` is NOT the pool" with both EXECUTED receipts |
| B015 · B035 · B066 · B467 · B468 (PR-r2-4, BLOCKING) | HOLD | `SLOW_NOT_SEVER_MAX` "a pass is slowed, never closed" (L83, L108); PR15 (L158); R25 and R26 (L754–755) |
| B018 · B034 · B037 (SEAMS-r2-1, BLOCKING) | HOLD | the sea's watch is W-NAVY (L86, L106); R-14 "the sea is M8's, W-NAVY's and seaRoads'"; R-1/7/10/13 settled in §0.5 (L116) |
| B042 · B043 · B045 · B138 · B149 · B150 · B447 · B448 · B450 (PR-r2-1/-2/-3, BLOCKING) | HOLD | PR2 and PR3 (L124–126); the pool formula with `pool-r2.out` (L242); the campaign `kept` rule and `arith.out` (1) (L251); R8 and R9 (L737–738) |
| B213 · B207 · B209–B212 (§6.6; PR-r2-1 BLOCKING) | HOLD | draw "RIGHT AFTER `fromCap`", the four reads on `drawn.cap`, the 0/0 guard, the stamp whenever riders are kept (L348) |
| **B208** | **FAIL (F1)** | "is in §19": the alternative now lives only in the cure record |
| B020 · B070 · B093 · B173 · B378 · B383 · B431 · B555 (RULINGS-ROUND6 A.2, BLOCKING) | HOLD | no `patrol` token anywhere; the holder's knowledge read (L88, L152, L178, L308, L557, L652, L847) |
| B563 | **FAIL (F3)** | content = the re-ruling plus §5.5's standing clauses (L308 ⇔ L851); label "THE OWNER'S SHAPE" restored on a struck ⭐ |
| B564 · B565 (DROPPED) | HOLD | struck r5 text and stamp; the two-array measurement stands in PR16 (L152) as the reason no token is declared |
| B061 · B501 · B505 · B520 (PR-r2-2/-3, A.2 hold helper) | HOLD | PR12 (L144); OD-PR-3 (L800); OD-PR-5 (L802); OD-PR-19 (L816) |
| B243 · B248 · B339 · B455 · B458 (OPENED ES-2b) | HOLD | "ES-2b, OPENED by delegation" at each site; "the wave order stands" (L403); date and ruling in OD-PR-52 (L852) |
| B245 · A02 (envoy ↳ row) | HOLD | folded into the envoy cell, `detourEnvoyErrand` and "the other registering (PS §6.5's S-e)" (L402) |
| B143 · A01 (WILL ↳ row) | HOLD (N3) | THE RESCUER'S EXERT MOVES NO WILL inside the WILL row (L243) |
| A00 · A03–A06 | HOLD | ↳ count in the new text is 0; each reworded per §3 |
| S09–S11 · S15–S17 · S19 · S26–S33 (STOP, FOLDED) | HOLD | "(ruled, §17)" / "(ruled, OD-PR-14)"; §17's four ruled rows; "THE OPEN STOPS: none" (L856) |
| S12–S14 · S18 · S20–S25 (KEPT) | HOLD | 10 build-time ⛔ STOP marks at L260 ×2, L328, L426, L538 ×2, L547, L556 ×2, L565 |
| B167 · B303 · B302 · B304 | HOLD | DRAFT explanation above; §10.3 (c) and (d) (L465–466) |
| B036 · B037 · B291 (PL-C-1) | HOLD | the chair's ruling applied (above) |
| B023 · B026 · B031 · B079 · B080 · B091 · B114 · B139 · B175 · B202 · B232 · B240 · B271 · B272 · B279 · B280–B283 · B320 · B325–B327 · B372 · B394 · B437 · B439 · B461 · B471 · B516 (random and content folds) | HOLD | old passage vs new passage side by side (`scratchpad/fvpr/ctx.py`); each is the latest bracket's text; PLAUSIBLE and vetoable marks kept (per-line vetoable count: the only drop, L460, was a superseded draft's "vetoable alternative") |
| B500 · B516 · B530 · B542 · B546–B548 · B572 (§17, §18) | HOLD | OD-PR-0 ⭐ added (owner's row); OD-PR-27 re-ruled; OD-PR-38 adds the ⭐ OD-PR-50/-53 cites that already stand; OD-PR-41 and -42 alternatives "not taken"; felt sentence 16's scrutiny note |
| the eleven latest-wins repairs | HOLD (10) · F3 (OD-PR-51) | above |
| PR5 (h) "lean" | HOLD | L130, L243, L482, L800 agree |
| THE READER'S GUIDE | **FAIL (F2)**; items 1, 2, 4–8 HOLD (N5, N7) | flags = §12's two; kinds = §11.2's two; C16 and PR-0..PR-5; mounts = PR16's |
| THE RULINGS §17 | HOLD (except F3) | 58 = 58 rows, same order, ⭐ visible, Ruled column present |
| whole-volume word diff (860 old body lines aligned to new) | HOLD except F1–F3 | every deletion outside the §3 substitutions was punctuation spacing; every insertion traced to its line's brackets (`scratchpad/fvpr/wdiff.py`, `filt.py`) |

**CONFIRMED vs PLAUSIBLE:** CONFIRMED by executed scripts and side-by-side reads:
- the ratchet re-run and its three explanations;
- the allow-file classification;
- my 724 marker count and the 601 composition;
- the cure-record containment;
- the §17 row identity and the § resolver;
- F1 (§19 at L884–891 lacks the alternative);
- every HOLD receipt above.

PLAUSIBLE (a judgement, not a measurement):
- F2: that a court's own war state and posture are truths the guide must name, the house reading of the CH, PT, MN, PL and RN guide fails;
- F3: that the struck ⭐ means OD-PR-51 is no longer the owner's shape (RULINGS-ROUND6 A.2 and old §19 R5a Q1 support it);
- the notes N1–N7.
