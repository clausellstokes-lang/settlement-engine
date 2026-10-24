# BD — FIDELITY VERIFICATION OF THE COMPLETED CONSOLIDATION (P8, seat FV-BD, 2026-10-23, cloud)

**COUNTS: sampled 116 ledger rows · holds 109 · fails 7 (row-level), plus 2 volume-level fails in THE READER'S GUIDE (G1, G2).** In all, four fails need a cure: F1 (five corrupted numerals across six rows), F2 (B423), G1 and G2. Eight notes (N1–N8) follow. They are not fidelity fails.

**THE RATCHET (re-run on `docs/DESIGN_FP_ARCH_BD.md` as it stands, with `BD-allow.txt`): `RATCHET 3 DIFFERENCE CLASSES`.** Tokens 1729 → 1680 · missing 0 · new-in-new 9; cites 117 = 117 (missing 0); laws 28 = 28; OD 75 = 75; ⭐ 47 → 51; DRAFT 163 → 160; UNMEASURED 63 → 62; wave ids 20 → 18; flags 28 = 28; review markers left 0. This is identical to ledger §6c. `cmp consolidate/BD-new.md` against the volume gives IDENTICAL. **I checked all three classes by script, section by section (`scratchpad/fvbd/marks.py`):**
- DRAFT: §1 drops 8 → 7, which is B065's change note on the superseded `homeDefense` read. §17 drops 38 → 36, which is OD-BD-36's "DRAFT ×1.5 · ×1.4" and "DRAFT, UNMEASURED". Every other section is equal.
- UNMEASURED: only §17 drops (32 → 31), and that is OD-BD-36.
- Wave ids: the two lost are `RU-5` (old L232, a finding id) and `BD-35` (old L499, "OD-BD-35 — STOP…"). Neither is a wave.
- ⭐: the +4 are the Ruled column, the guide and the header. The −5 moved with the cure record. In §19, 12 → 11 because ⭐ OD-BD-56 was named twice in one old FOLD line and the merge names it once. All nine ⭐ OD rows survive in §17.
- New tokens: `advanceBodies` and `spatial/embattlement.js` are real (the path holds `advanceEmbattlement` on master `81f1cd963`). The rest are the trail paths and seat 2's documented tokenizer artifact.

**THE ALLOW FILE (67 lines = 39 + 8 + 20) against ledger §4 / §6b / §6c.** I located every token in the old text by script (`allow.py`).
- Each MOVED token occurs only in old L3–12 or L1189–1383.
- Each change-note token sits inside the named bracket: B121, B133, B164, B265, B295, B372, B377, B585 and others.
- Each superseded name has its successor standing: `menaceSightings` → `sightings`; `beast_never_placed` → "PLACED nameless"; OD-BD-52's first triple → its no-crime-term text.
- No line lacks a true reason. Some allowed tokens still stand in the new text (`TRAIL_WEEKS_MULT`, `wildland`, `cure/D-BD-r5.md`), which is harmless.

**THE MARKER COUNT (my own scan, a different opener regex, `count.py`).**
- Brackets: 706 = 472 CURED · 47 REFINED · 10 ADDED · 9 OPENED · 3 SUPERSEDED · 1 STRUCK · 82 `[r4` · 46 `[r5` · 22 `[r6` · 14 `[P5`, with 1 nested (L610).
- Outside brackets: ↳ 7 · STOP 21 · ROUTED-UNAPPLIED 4 · round words 79 · `(fp-final…)` 0.
- That gives 706 + 111 + L 8 + R 19 = **844 = the ledger's 843 + the `[r5;` bracket at old L829**, which the ledger's scan missed and §6c item 5 records and folds.
- All 705 B rows align with my bracket index by order and old line (0 mismatches).
- The 15 other occurrences of "round" are prose ("the round's rut", "a bypass round"), header lines, or headings that were moved or retitled.

**THE CURE RECORD.** `history/BD-cure-record.md` contains old L3–12 and old L1189–1383 byte for byte (script). Its only other lines are its title, one note and the two PART headings.

**THE RULINGS (§17, whole).** 65 old rows → 64. The only id missing is OD-BD-36, and it stands in OD-BD-52's Ruled cell ("supersedes OD-BD-36 of 2026-10-18"). Its DRAFT/UNMEASURED marks are truly superseded: the ×1.5/×1.4 gate rows are gone everywhere (§6.8 (d); §22 A7 "no row in `criminalCorridorGate` or `infiltrationGate`"; OD-BD-52 "no spawn-gate row"), and OD-BD-52 keeps its own "severity steps DRAFT, UNMEASURED". The nine ⭐ rows (1 · 2 · 4 · 5 · 6 · 31 · 35 · 49 · 56) are all VISIBLE. A per-row lost-numeral scan finds only finding ids (OD-BD-25 '4', 34 '15', 55 '5', 57 '4', 58 '2', 61 '20'). OD-BD-1, 40, 44 and 52 were read in full: each carries only its latest text. **⭐ OD-BD-35 (the hamlet end) is carried as a ruling:** its Ruled cell reads "its build STOP ruled as proposed 2026-10-18 · ⭐ THE OWNER'S", which matches RULINGS-ROUND4 l.52 and old §20.2. BD25 and §6.8 (c) carry "dark until POP's runtime founding". THE OPEN STOPS: none, correctly.

## THE FAILS
- **F1 — B032 · B139/B140 · B352 · B441/B442: five numerals changed by the builder.** `cbd/build.py`'s joint repair (`re.sub(r'(?<!\.)\.\.(?!\.)', '.', q)`) runs over every bracket-bearing line outside backtick spans, so it collapsed ranges written with "..":
  - OLD L106: `military` "0..100 conventional force …" (a quote of the code) and "on one 0..100 scale". NEW L114: "0.100" ×2.
  - OLD L290: "the latent midpoint banded 0..1". NEW L298: "banded 0.1".
  - OLD L654: "`ACT_OFFICE`, banded 0..1". NEW L662: "banded 0.1".
  - OLD L785: "filled by BD-1..10". NEW L793: "BD-1.10".

  Ledger §3 says the joints were repaired "outside backtick spans only (quoted code byte-exact)", but these sit inside double quotes or in prose. My scan of every other repair pattern (` +[.,;)]`, ` :`, `( `) over bracket lines finds nothing else changed. **Cure:** restore ".." at new L114 (×2), L298, L662 and L793, and drop the `..` rule from the builder.
- **F2 — B423 (BLOCKING BD-r5-1 row, §12 `ransom`): a superseded gloss left standing.** NEW L763 still reads "`captive_freed` (the body defeated first)". Meanwhile B357, the latest word, defines it as "FREED BY AN OUTSIDE HAND before the clock — the body DEFEATED first OR THE CAPTIVE BROKEN OUT". The lane applied that word at BD27 (R1), §15 and §17 OD-BD-40 under "the latest wins everywhere", but missed its own §12 row (old L755, also narrow), so the volume now states the closing two ways. **Cure:** "`captive_freed` (the captive freed by an outside hand before the clock — the body defeated first, or the captive broken out, §9.10)".
- **G1 — THE READER'S GUIDE item 3 over-claims (R2 does not name every truth read).**
  - "A body's CHOICE reads BELIEF and the PUBLIC FACE of everything outside it": the text's own `recruit` factor (§4.2) weighs the habitat ("unrest, famine, the levy away"), and the text calls the habitat truth ("`bodyHabitat` … (truth for the recruitment pool; the habitat is the world's)", §6.2; "habitat is the world's truth", §15.3).
  - The guide's list of truth readers (the producer, the births, the feed, a court's own stance, the omniscient arm) leaves out truth reads the text marks: §6.1 "**Reads:** TRUTH — the week's resolved acts"; §7.3 "the gang record's `standings` (truth: its grip)"; §9.5 "the ATTRIBUTION itself (`bodyOnRoute`) stays TRUTH for the receipt and the DM's scrutiny"; §12 PT's body half "the body's own `where` read as TRUTH"; §15 "the DM's view always shows the truth".
  - **Cure:** add one sentence: "the stage's own bookkeeping reads truth — the supply stock from the week's resolved acts (§6.1), size from the habitat (§6.2), the standings composed into the town's criminal power (§7.3); the attribution stays truth for the receipt and the DM's scrutiny (§9.5), and the DM's view shows the truth (§15)". Also qualify "everything outside it" with "save the habitat the recruit and size steps read".
- **G2 — THE READER'S GUIDE item 6 under-lists the widened kinds.** It gives "`raid`, `supply_raid`, `patrol_engages`, `site_taken`, `caravan_seized`, the `ransom` row's race closings and `site_sale`". §12 says "SEVEN existing kinds gain a body … `site_taken` · `site_cleared` · `site_siege` …", and also widens PT's and CH's road arms. **Cure:** add `site_cleared` · `site_siege` and "PT's and CH's road arms".

The other guide items HOLD: item 1; item 2 (nine kinds = §12); item 4; item 5 (BD19's hosts; `presenceTerms` in `advanceEmbattlement`, §0.1/§8.2); item 6's flags (five = header) and CHAIN C17 after C15 and C16 (fold §6 C17 row); item 7; item 8 (§2.6 / §2.1).

## NOTES (not fails)
- **N1** Stamps that carried receipts were dropped: B030 "measured `cure/D-BD-r5.md` m3", B032 "measured and EXECUTED … m1–m2", B033 m5 and B034 n1–n4. Ledger §3 item 1 says every `cure/` receipt is KEPT. No design fact is lost (BD14 and BD12 keep their measures).
- **N2** §21 keeps "→ ROUTED (§19.0 X)" ten times. The first CH verifier flagged the same word as voice. It is not in law (e)'s list, and it is the volume's ROUTE idiom.
- **N3** THE ANSWER's "the body beaten first loses the captive free" is a narrower paraphrase. It is inherited and descriptive, not a definition.
- **N4** §19.0 THE FOLD dropped "`brigandage_exported` retired". This is carried by the fold §5 row (fold L966) and by OD-BD-44.
- **N5** The ES §3.12 insertion quoted in §19.0 ES (3) lost its "; RULINGS-P5 C.5" tag inside the quoted text.
- **N6** §6.8 (a) calls `deedRingAt` "BELIEF, the actor's own" (RN §2.3), while §6.8 (e) and the guide call it the gang's own fact. This tension is inherited.
- **N7** §4.2's `bribe` factor reads `effectiveToleranceOf` and PR's `wantSince` with no belief frame, while BD12 says the choice reads belief. This tension is inherited. The guide repeats BD12 (part of G1).
- **N8** Ledger §1's 843 excludes the `[r5;` marker, which §6c item 5 discloses.

## THE TABLE
| row | verdict | receipt |
|---|---|---|
| B032 · B139 · B140 · B352 · B441 · B442 | **FAIL (F1)** | bracket folds correct; their lines' ".." collapsed (above) |
| B423 (BD-r5-1, BLOCKING) | **FAIL (F2)** | §12 row narrow; see F2 |
| B017 · B093 · B356 · B512 (BD-r5-1, BLOCKING) | HOLD | THE ANSWER / BD27 / §9.10 / S29: survival alone pays; `captive_released` never automatic; S29 "FOUR runs" |
| B030 · B031 · B074 · B075 · B133 · B227 · B235 · B543 · B544 (BD-r4-3 · BD-r5-2, BLOCKING) | HOLD | ONE LADDER, master's rung; mode `way` beside `land` (`waymode.out` kept, new L184); "no second trail price exists" (S47, §2.5); smugglers' ways (L-BD 11b; ROUTE EC) |
| B065 · B312 · B496 (BD-r4-2, BLOCKING) | HOLD | BD14 on `defenseLedger`, never `homeDefense`; the dropped DRAFT is in the superseded change note |
| B151 · B184 · B213 · B248 · B251 · B316 · B319 · B351 · B536 (BD-r4-1, BLOCKING) | HOLD | hostile flock raids per court, weighted by god; the zero-supply flock end `scattered`; captives where its god allows; "never never" kept |
| B055 · B239 · B241 (SEAMS-r4-1, BLOCKING) · B451 | HOLD | BD11 both networks, stance a prior; beasts take both; ⛔ STOP at build kept (L808) |
| B016 · B092 · B602 (DROPPED) | HOLD | stamps / partition superseded by B017 / B093 / B603; OD-BD-40 shows only the 18:54 closings |
| B378 (DROPPED) | HOLD | WITHDRAWN by B.19; `shared_faith` patch stands (§10.2 (a)) |
| B595 · B596 (DROPPED) | HOLD | OD-BD-36 removed; named in OD-BD-52's Ruled cell; its marks superseded (above) |
| S023 · S027 · S039 · S043 · S073 | HOLD | "no STOP" aside gone; ⭐ OD-BD-35 in §6.8 (c) and BD25; the DM's "STOP it" verb; OD-BD-47's build STOP |
| S059 · S061–S065 · S068 (KEPT) | HOLD | seven "⛔ STOP at build" in §14 (new L793 ×2, 805 ×2, 808, 817, 820) |
| S087 · S090–S094 · S096 · S101 · S102 · A099 · U005 · U007 · U100 · U103 (MOVED) | HOLD | history Part 1 and Part 2 contain them verbatim |
| A020 · A038 · A047 · A081 · A082 · A108 | HOLD | `courtStanceOf` creed-keyed row (new L285); "the fold §3.3.13"; the recount quote kept; OD-FC-74 by content |
| B357 (R1) | HOLD | BD27 (new L198) = §9.10's widened word verbatim; §15, §17 and §19 OP read it too (the §12 row is F2) |
| B657 · B668–B671 · R1103 · R1130 · R1147 · R1161 · R1170 · H075 · H079 · H080 (the §19.0 merge) | HOLD | every route of old 19.0–19.0e matched, line by line, to new §19.0. Superseded routes were removed with their successors stated: ES (3) → ES §3.12 insertion; IN (1) → "IN carries no offer row"; HB `pruneRows` → BD-10's `ends`; HB court grain → "nothing"; ST (c) → `holderSinceOf`; PR `patrol` → "neither array"; RN expose → `deedRingAt` (B259/B271 at old L497/502, OD §20.7 "APPLIED"); the fold's B.7 partition → "as §9.10 states them". No live route was lost (N4, N5) |
| B388 · B389 (`ES l.1809`) | HOLD | ES's "DISPATCHER wave nobody has chartered" stands at ES L1820, inside "## §4 THE WAVES" (L1453–1836). CONFIRMED |
| B441 · B442 line (`§20.3's resolver`) | HOLD (reading) | `DESIGN_EDIT_MODE_AND_DECREES.md` "## 20." item 3 "WITHDRAWN WITH ITS REASON"; EDITOR "The §20.3 resolver is `edit/registry.js :: resolveDecree`". CONFIRMED by text (numeral F1 aside) |
| B459 · B460 · H066 · H067 (BD-8, "no end but the compile's") | HOLD (PLAUSIBLE) | "no end goal tested (the ends before BD-8 only)": the compile's ends are the pre-BD-8 ends; no new decision |
| B263 · B360 · B377 · S29 · S37 · §8.5 crime term · §9.10 OPENED | HOLD | precedence verbatim, "Vetoable." kept; S37 → BD-10's `ends` (S61); §8.5 → §6.8 (d)'s no-crime term; "nothing builds before the owner's word" lifted by OPENED (the header dispatch gate stands) |
| random 19: B028 B144 B324 B366 B402 B447 B545 B555 B585 B614 B640 B647 H014 H017 H021 H030 H056 H072 R0852 | HOLD | old vs new read side by side (`show.py`); each is the latest bracket's content with no new decision |
| §17 THE RULINGS (whole) | HOLD | above |
| THE READER'S GUIDE (whole) | **FAIL (G1, G2)** | above |
| R2 (guide repair) | FAIL → G1 | it names the choice's own facts, the births and the feed, but not the truth reads in §6.1 · §6.2 · §7.3 · §9.5 · §12 PT · §15 |
| cross-references | HOLD | every bare local § resolves (script); the unresolved hits are other volumes' sections in context (WC §1.7.2/§1.8.1, CH §16b/§2.2b, PL §4.8/§4.9, PS §5.6, WY §3e, roadsKernel §11b); no `l.NNN` left |

**CONFIRMED vs PLAUSIBLE:** These are CONFIRMED by executed scripts and side-by-side reads: the ratchet re-run and each of its three explanations; the allow-file location check; my 844-marker count with 0 B-row mismatches; the byte containment of the cure record; the five ".." corruptions; the narrow §12 row; the guide's omitted truth reads; the §19.0 route-by-route match; and the ES §4 and DECREES §20 item 3 locations. Two judgements are only PLAUSIBLE: that "the ends before BD-8 only" is what BD-8's "no end but the compile's" meant, and that N1–N8 are not fidelity fails.
