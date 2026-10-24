# CN — FIDELITY VERIFICATION OF THE CONSOLIDATION (P8d, seat FV-CN, 2026-10-23)

**COUNTS: sampled 43 ledger rows (all) · holds 42 · fails 1.** There is one fail, F1: a finding id is left in the running text. Notes N1–N5 below are not fails.

**THE RATCHET (re-run on `docs/DESIGN_FP_ARCH_CN.md` as it stands; `cmp` = `consolidate/CN-new.md`): `RATCHET 1 DIFFERENCE CLASSES`.** Tokens: 201 old, 200 new, 0 missing, 5 new in the new text: `1beabdc85`, the review-record path, `00b648c9d`, `DESIGN_FP_SPINE.md` and `DESIGN_FP_COHERENCE_FOLD.md`, all from the header and Status. OD 6 = 6, the same set. Flags 10 = 10, the same set. Ids are the same sets: cn-1..6, C1–C17, J-CNC-1..8 and OQ-1..4 (script). ⭐ 1 → 2: the legend, with OD-WS-1 kept at L129. UNMEASURED 3 = 3. Review markers left: 0. The output is identical to ledger §6.
**The one difference is CONFIRMED.** DRAFT drops from 1 to 0, and the only old DRAFT is the header banner at L4, "⚠⚠ **DRAFT — NOT YET LANDED.**". That is a status claim superseded by row C-001 (LANDED at 1d77ceb67). The banner is MOVED verbatim: review-record Part 0 is byte-identical to old L1–41. No DRAFT value or band existed.
(Aside: wave ids are 1 = 1 only by coincidence. The old match was `FC-38` inside two OD-FC-38 bracket heads, and the new match is `MN-2 —` at L386. No wave id is lost.)

**THE ALLOW FILE (6 lines) holds.** Each review-trail path occurs only on bracket-head lines: L119–123, L341 and L342 (script). None is in the new text. No design name is allowed missing.

**THE MARKER COUNT (my own balanced scan):** 30 brackets, 7 ↳ outside a bracket (L118–123, L194) and 3 ⛔ outside (L22, L31, L115) give 40, which matches. Adding the three structural rows (the banner, the LANDS block, §10) gives 43, which matches. Every row aligns by old line, and 36 folded + 1 dropped + 2 moved + 4 kept = 43.

**THE REVIEW RECORD:** Part 0 matches old L1–41 and Part 10 matches old L491–514, both byte-identical (`cmp`). The old text is byte-identical to `git show 1beabdc85:docs/DESIGN_FP_ARCH_CN.md`. Quotations: all 16 in the new text stand verbatim in the old CN or the old fold (script). The owner's order of ODQ §130 is verbatim. The 7 old quotations missing from the new text are CN's self-quotes of superseded wording. One of them, "pin-first", is N2.

**THE SEAL (the lane note):**
- The "pin" → "seal" carry rests on CN's own head bracket ("read 'seal' for an Edit Mode hold and 'pin' for a test"), on the CURED r1 bracket ("the register word is \"seal\""), and on the fold §5 `pin` (CN) row ("CN's pin is not minted (§3.1.20)"), which is present in both the old fold (L839) and FOLD-D-new L30.
- CN's reading is that the hold is KEPT as an Edit Mode seal, seal 6 is its siege instance, and the persisted CN field is not minted. The RE-RULED bracket (S4 B1, BLOCKING) states the first two, and the §5 row states the third.
- It matches the consolidated MN word for word in sense. MN's §5.6 has "the STRESSOR SEAL of ODQ §128 (CN cn-4 as re-ruled: an Edit Mode seal whose siege instance is seal 6 `letSiegeFall`) … dark until Edit Mode builds that seal's persistence", and its header (L82) has "kept as an Edit Mode SEAL".
- `stressorPinsEnabled` keeps its name, and "pin" survives only where ODQ §128 is named or quoted, or as a test pin. HOLDS.

**THE READER'S GUIDE (8 items) and header:** every claim traces to the body or to the fold rows. Item 7 says PG reads CN; `DESIGN_FP_ARCH_PG.md` L75 and L368 cite CN cn-4 and OQ-2. **THE RULINGS (§8, §9):** OQ-1 is RULED inside OD-FC-38, and FOLD-E OD-FC-38 says "CN OQ-1 RULED: command powers are premium … AUTHOR is not priced apart from ORDER". "Owner signs at cn-3's compile" is dropped as superseded. J-CNC-1..8 are all present. No open STOP.

## THE FAIL
- **F1 — row C-036 (and C-035's fold).** A finding id is left in the running text. "SX-10" is a skeptic finding (`skeptic/SX.md`, the SX-10 of `briefs/RULINGS-PL-MN.md` B/SX-10), and it stands twice in the design voice:
  - new L368: "**THE HOST, AS RULED** (OD-MN-10, `DESIGN_FP_ARCH_MN.md` §12; SX-10; by delegation, vetoable)"
  - new L514: J-CNC-3 "… is never minted: the host is a menace and MN's flags carry it (SX-10; §4 cn-5)."

  The old text had it only in the bracket heads at L194 and L341. The ledger dropped the SX *path* but kept the id. No other consolidated volume carries an `SX-n` (grep over `consolidate/*-new.md`), and the spine dropped SX-15 in the same way. The ratchet's MARKERS pattern does not see it.
  **Cure:** delete "SX-10; " at L368, and change "(SX-10; §4 cn-5)" to "(§4 cn-5)" at L514. Mirror the change into `CN-new.md`.

## NOTES (not fails)
- **N1** (correction of an inherited error, evidenced): §0.3's row "| §3 | §4 | what every cn compile owes |" now reads "| §3 | — | the flag family (added in the volume form …) |". The old map listed the compile floor twice (§3 and §5 both from charter §4), and the moved §10 item 3 says §3 was ADDED. The correction is true, but strictly it lies outside the bracket fold.
- **N2** (vocabulary on a veto keyword): J-CNC-1's flip keyword changes from "pin-first" to "seal-first" ("Say 'veto' with 'seal-first' to flip"). It is the charter's judgment, not owner words, and it follows the register word. I flag it only because it is a keyword the owner would type.
- **N3** (tension, PLAUSIBLE): cn-4 Produces 1 reads "the seal on the stressor record (`normalizeStressor` …) — the persisted pin field is NOT minted; the seal's persistence is Edit Mode's", and the lifecycle row says "persist (the seal on the stressor record)". The two read slightly at odds. Both are faithful to the fold §5 row together with the RE-RULED bracket. MN's "dark until Edit Mode builds that seal's persistence" agrees.
- **N4** (seam outside CN's lane): the consolidated fold's §3.1.20 (`FOLD-B-new.md` L29) still says "cn-5's host reconciles with L10(c)'s phantom". CN applies its own later OD-MN-10 bracket (a MENACE, the phantom the off-stage counterparty), as MN does. The fold part is FV-FOLD's to check.
- **N5** (inherited date): §0.1 keeps "(2026-08-15)" on the code-of-record line. It identifies the base `30638bb7`, as in the old text, and is not a bracket date.

## THE TABLE
| row | verdict | receipt |
|---|---|---|
| C-001 · C-041 | HOLD | Header L4 reads "LANDED on the ledger at 1d77ceb67; FOLDED INTO THE EDIT MODE PROGRAM". Status matches the bracket (LIT none · BUILT DARK none · UNBUILT cn-1..6, 0 hits). The banner moved verbatim. |
| C-002 | HOLD | THE FOLD INTO EDIT MODE: cn-1/2 kept; cn-3 L10 rows; the seal kept (C-034); the host a MENACE (C-035); OQ-1 RULED (C-040). These are the three superseded clauses, each carrying its successor. |
| C-003 · C-004 · C-042 | HOLD (KEPT) | Both ⛔ laws and the LANDS block are verbatim, without the "##" prefix. "lane CN-C" becomes "the CN-C charter". |
| C-005 | HOLD | SLOTTING: the Edit Mode order governs. The charter's slot is named as superseded. WY is the prime feeder. The §109 audit sentence is dropped with the slot. |
| C-006 · C-007 · C-009 | HOLD | C7 `warSiegeVerdict.js:179` with "still 60". C13 is the §805 split (also applied to OQ-3). C17 `CONDITION_BANDS` is module-local at :133, `MARKET_CONDITION_BANDS` is EC's, and WY-8b reuses it. |
| C-008 | HOLD (KEPT) | The ⛔ is the code's own "not-interchangeable" note at `humanizeEngineTokens.js:72`. |
| C-010 … C-013 | HOLD | One note after the table: C14–C17 versus chains C14 THE PASSAGE … C17 THE BODIES (the fold §5). |
| C-014 … C-021 | HOLD | Four rows named by token. The design cites are kept (fold §3.3.19/20/25/21; WS, MG, OP §§). The `briefs/` paths are dropped. ⭐ OD-WS-1 is kept. "FREE at master `81f1cd963` (0 · 0 · 0)" is kept. |
| C-022 · C-029 | HOLD | Law 2, the cn-3 Produces / Bills / title and C3's last column all read: an L10 row through the one mutation boundary, never a spec through `execute`. |
| C-023 · C-024 · C-025 | HOLD | §3 has ONE flag in the charter, and the second (cn-5's) is never minted. "0 hits at 00b648c9d". The ↳ row is folded, and MN's `menacesEnabled` / `menaceStrikesEnabled` carry the host. |
| C-026 · C-027 · C-030 · C-039 | HOLD | The FIRST-VISIBLE · TIER · DEGRADED ARM bullets are verbatim, with UNMEASURED kept (L259, L367, L416). |
| C-028 | HOLD | cn-3 TIER reads "paid tier: premium (OQ-1, RULED inside OD-FC-38, §8)". |
| C-031 · C-033 (DROPPED) · C-034 (S4 B1, BLOCKING) | HOLD | THE SEAL, AS RULED: ODQ §128.1/.5; the `pin-fork` only a draw; `SIEGE_MAX_AGE 60` not a roll; the seal gates the roll AND the backstop; seal 6 its siege instance; cn-4 the seal's charter; re-read at compile. The superseded "seal 6 plus a stage directive" is gone. |
| C-032 | HOLD | cn-5 DEGRADED ARM: "MN's flags off ⇒ byte-identical; an unsealed menace siege resolves organically". |
| C-035 · C-036 · C-037 | **FAIL (F1)** otherwise HOLD | THE HOST, AS RULED: a MENACE, the phantom off-stage (§934.43). Produces 1–2, the flag and `disposition` are superseded by MN-0/MN-2. `disposition` is DROPPED, not renamed (MN6). COURSE and MIGHT. Valve: "SEALED besieging army … might band". `menaces: [{ menaceId, menaceName }]` with no `besiegerKind: 'menace'`. Laws 8–9, J-CNC-3 and C16 are applied. Only fault: "SX-10" at L368 and L514. |
| C-038 | HOLD | Bandit-class encounters are BD gang records. Body → menace only by the DM's hand (`PROMOTE_BODY` → `RAISE_MENACE`, or `enlists`). OD-FC-74. |
| C-040 | HOLD | OQ-1 is RULED and carries the owner's word "The simulator is gated for premium". The recommendation is kept as what the ruling agrees with. Applied to the §6 value row and cn-6. |
| C-043 | HOLD (MOVED) | §10 is reduced to one pointer line carrying "identifiers UNCHANGED so every existing citation resolves". Part 10 is byte-identical. |

**CONFIRMED vs PLAUSIBLE:** CONFIRMED by script or `cmp`: the ratchet and its one difference, the allow file, the marker count, the review-record parts, the quotations, and the id sets. CONFIRMED by reading against the old fold and the consolidated MN: the "seal" carry and F1. PLAUSIBLE by judgment: N1's map correction and N3's persistence reading.
