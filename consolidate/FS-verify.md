# FV-FS — THE FIDELITY VERIFIER over the consolidated `docs/DESIGN_FP_ARCH_FS.md` (P8a, 2026-10-20; Opus 5.5; read-only except this file)

**COUNTS: sampled 119 ledger rows · holds 119 · fails 0.** Every BLOCKING-derived row (FS-r1-1 · FS-r1-2 · FS-r1-3: 64), every DROPPED (14), every KEPT (12), every STOP mention (15), and 26 random others (REFINED/NOTED/r2–r4 brackets, header and round-header lines). Beyond the sample I read the old body (L12–676) and the new volume (L1–683) WHOLE, side by side, section by section.

**THE RATCHET (re-run by this seat, the ledger's ALLOW-MISSING passed except the two comma-bearing paths):**
```
tokens: old 613 · new 571 · missing 2 · new-in-new 9
  - skeptic/{OP,MG,WS}-r2.md   - skeptic/{OP,MG,WS}-r3.md
cites (path :: symbol): old 50 · new 51 · missing 0
laws 18 · 18 | OD rulings 28 · 28 | ⭐ 5 · 15 | DRAFT 21 · 21 | UNMEASURED 8 · 8 | waves 6 · 7 | flags 16 · 16
review markers left in the new text: 0
RATCHET 1 DIFFERENCE CLASSES
```
The one class is EXPLAINED: both tokens live in the old text only in the cure record (old L715, L735) and survive verbatim in `history/FS-cure-record.md` (`tail -n +3 | cmp` against old L677–771: VERBATIM); `--allow-missing` splits on commas so they cannot be passed (ledger O-6). Waves 6 → 7 is the pattern catching "J-INT-3 — OD-FS-3" (O-5). The new 9 tokens are all old symbols in shorter backticks or the header's own paths.

**MARKER COUNT (independent):** 342 bracket opens (`[CURED` 305 · `[REFINED` 33 · `[NOTED` 1 · `[FS-` 3) − 9 header templates (L6, L8–11) − 1 nested quote inside the L95 bracket = **332 brackets** (328 body + 4 cure record) + 9 header lines (L3–11) + 5 round headers (§19 + r1–r4) + 15 STOP mentions (L106 · 136 · 349 · 351 · 355 · 357 · 495 · 500 · 585 · 633 · 640 · 641 · 769 ×3; the five "CAPACITY STOP" quotes are W-COIN's law, not markers) = **361 = the ledger's 361 rows**. `history/FS-bracketed-1beabdc85.md` equals `git show 1beabdc85:docs/DESIGN_FP_ARCH_FS.md` (cmp).

**OTHER RECEIPTS:** numerals — the only old-body numbers absent from the new text are 0.14 · 0.285 · 403 (r1 trail) and 61,578 (J4, the superseded round-2 control). DRAFT/UNMEASURED/PLAUSIBLE marks: every context preserved (21/8/2). Every old ⭐ survives; the six added ⭐ sit on rows the old text already titled "THE OWNER'S". Own-section cross-references: all resolve (the 17 unresolved hits are other volumes: fold §3.1.x, BD §9.10, PL §4.6, ODQ §128/§934.93, §92.2). Clause-level diff both ways (30-character windows): every old clause without a match is a rewording, a superseded clause or trail; every new clause without a match is a bracket's content restated (list in the seat's scratchpad `fvfs/lost.txt`).

## THE READER'S GUIDE and THE RULINGS, read whole
- The Reader's Guide's every claim traces to the old text: one writer `fiscalHand.js` (§2.1), the reads TRUTH/HEARD/DERIVED (FS2, §3.2), the mounts (FS17, §12 FS-4's hosts incl. `stressorGates.js`'s REASON words), the flags and conjunctions (§11), ONE hearing kind (§10, OD-FS-9 ⭐), chain C21 after C3 and INT-2 (old §12 + RULINGS-P6 §C: "C21 after INT-2"), the homonyms (§2.4). HOLD.
- §17: 25 rows, the same 25 ids; each Ruled cell's provenance checked against the old brackets and `briefs/RULINGS-P6.md` (B.4 covers FS r1; D.12 covers FS-V2; I.4 confirms the carrier, verbatim above). No ruling's substance changes; OD-FS-1 gains "its per-form output is a `TAX_RATE_BANDS` member" (FS1's A.7/D.11 Q1 text), OD-FS-22 gains "never re-mounted ahead of the commons" (old FS7's E.9 bracket). HOLD.

## OBSERVATIONS FOR THE CHAIR (not fails)
- **O-A** The ledger's M004 says "refinements are rows of §17"; that is not true for every REFINED bracket (e.g. §2.2's by-name door, §2.1's `economicState` choice, §3.3's week key, §7.4's liege, §8's "custom content"). The new header calls only OD-FS-n vetoable, so those refinements' vetoable mark now lives only in git and `history/`. The brief mandates removing the brackets, so this is not a fail. A header clause ("every refinement folded from a REFINED mark is vetoable likewise; the list is the cure record's") would keep the owner's 10-17 marking word visible.
- **O-B** O-1 stands: the volume reads the demand as TRUTH, while RULINGS-P6 A.8's wording says "BELIEVED DEMAND". The old text had this in one voice and the r1/r2 verifiers HELD it, so it is not a STOP. The wording conflict is between the volume and the rulings file.
- **O-C** The seams read (P8c) should check: FS quotes WS §16 ("no hire: the market is endogenous …"), which does not appear in today's `DESIGN_FP_ARCH_WS.md`. The text is the same as in the old FS. `docs/DESIGN_FP_ARCH_WS.md` is still the bracketed text, so FS's WS § numbers resolve against it today.
- **O-D** The fold §5 (L1074) still carries FS's "`setFiscalHand` · `believedHandOf` · `fiscalStrainOf` WITHDRAWN" note. P8d's regeneration should drop it the same way.

## THE TABLE (row · verdict · receipt)
| Ledger row (old line, old §, why sampled) | Disposition · verdict | Receipt |
|---|---|---|
| M002 (L4, header, random) | FOLDED · HOLD | old L4 header ↔ new header line 1 (compiled; DARK behind two flags; nothing scheduled) — read both; content carried, tag/trail only removed |
| M004 (L6, header, random) | FOLDED · HOLD | header vetoability line kept for OD-FS-n; the REFINED convention gone with the brackets — the ledger's "refinements are rows of §17" is not true for every REFINED (observation O-A) |
| M005 (L7, header, DROPPED) | DROPPED · HOLD | P6a sibling-compiling note obsolete (OP/MG/WS compiled; seams in §15) |
| M009 (L11, header, random) | MOVED · HOLD | r4 header moved; G.5 text folded in FS6/§2.1/§3.4/§6.1–§6.3/row 31 (f), provenance in OD-FS-8 Ruled column |
| M010 (L29, THE ANSWER, IN ONE PARAGRAPH, BLOCKING-derived) | FOLDED · HOLD | new ANSWER keeps "ASKED TO PAY … never … its vault"; struck vault/dues causes absent everywhere in new text |
| M013 (L29, THE ANSWER, IN ONE PARAGRAPH, BLOCKING-derived) | FOLDED · HOLD | new ANSWER names `set-levy`; "collected short" half superseded by the r2 D.8 bracket on the same paragraph (custom first, one step a season) |
| M015 (L48, §0.1, BLOCKING-derived) | FOLDED · HOLD | old L48 §0.1 ↔ new §0.1 `treasuryBandOf` row (the anti-loop law's two pinned quotes bind it; vault → hand → band → mint) — read both; content carried, tag/trail only removed |
| M016 (L49, §0.1, BLOCKING-derived) | FOLDED · HOLD | new §0.1 coffersRead row: wage bill over gross, `demand-stockfree.out` 3-vs-1 values kept verbatim in substance |
| M019 (L53, §0.1, BLOCKING-derived) | FOLDED · HOLD | old L53 §0.1 ↔ new §0.1 `set-levy` row (content stands; tag MOVED) — read both; content carried, tag/trail only removed |
| M021 (L55, §0.1, BLOCKING-derived) | FOLDED · HOLD | old L55 §0.1 ↔ new §0.1 `participation01` row (content stands; tag MOVED) — read both; content carried, tag/trail only removed |
| M026 (L61, §0.1, random) | FOLDED · HOLD | §0.1 assize row "the NEXT tick too (OD-FS-22)"; OD-FS-22 carries E.9 |
| M030 (L80, §0.2, BLOCKING-derived) | FOLDED · HOLD | old L80 §0.2 ↔ new §0.2 W-COIN A1.16 bullet ("stands UNAMENDED … OD-FS-23"); tag MOVED — read both; content carried, tag/trail only removed |
| M031 (L81, §0.2, BLOCKING-derived) | FOLDED · HOLD | old L81 §0.2 ↔ new §0.2 EDITOR bullet (§8 and §6.3 bindings stand); tag MOVED — read both; content carried, tag/trail only removed |
| M035 (L102, §1, BLOCKING-derived) | FOLDED · HOLD | old L102 §1 ↔ new §1 FS1 ("the four hand words stay the SEAT's decision vocabulary; the per-form OUTPUT is `TAX_RATE_BANDS`") — read both; content carried, tag/trail only removed |
| M037 (L102, §1, random) | FOLDED · HOLD | old L102 §1 ↔ new §1 FS1 (the four words FREE; the landed `lenient · customary · heavy · ruinous` refused with their cites; a sh — read both; content carried, tag/trail only removed |
| M038 (L104, §1, BLOCKING-derived) | FOLDED · HOLD | new FS2 "neither a full vault nor an empty one moves a hand" kept; struck "its OWN vault … as TRUTH" absent |
| M039 (L104, §1, random) | FOLDED · HOLD | old L104 §1 ↔ new §1 FS2 (the system-level loop and the `books` rule stand in the law; tag MOVED) — read both; content carried, tag/trail only removed |
| M041 (L106, §1, random) | FOLDED · HOLD | old L106 §1 ↔ new §1 FS3 (J-INT-3's reason and STOP-FS-1 kept; "the brief's … withdrawn" MOVED to history) — read both; content carried, tag/trail only removed |
| M045 (L106, §1, KEPT) | KEPT · HOLD | STOP-FS-1 kept in FS3 ("resolved on J-INT-3 — OD-FS-3"); OD-FS-3 old text already says "STOP-FS-1 resolved on J-INT-3" |
| M047 (L110, §1, BLOCKING-derived) | FOLDED · HOLD | old L110 §1 ↔ new §1 FS5 (the composite's signature POP's, the caller W-SEAT's — §15; the pin §14 row 25) — read both; content carried, tag/trail only removed |
| M054 (L112, §1, DROPPED) | DROPPED · HOLD | r1 SHORTFALL superseded by D.8 in the r2 bracket of the same law; "council pays to hold firm" survives in new FS3 ("never free for a non-coercive raise") |
| M056 (L114, §1, random) | FOLDED · HOLD | FS7 "never re-mounted ahead of the commons … OD-FS-22" = old "re-mount … is NOT made (the chair ruled the order by design)" |
| M058 (L114, §1, DROPPED) | DROPPED · HOLD | r1 SP-9 resolve stage superseded by D.9 (old FS7 r2 bracket: "the round-1 bracket below is superseded"); ONE DECIDER, ONE DM DOOR stands in new FS7 |
| M061 (L118, §1, BLOCKING-derived) | FOLDED · HOLD | old L118 §1 ↔ new §1 FS9 (the war-tax words are the stressor lane's car, W-SEAT's side — §15; the mult is OD-FS-13 (c)) — read both; content carried, tag/trail only removed |
| M065 (L126, §1, BLOCKING-derived) | MOVED · HOLD | `setFiscalHand`/`setBy: 'dm'` struck by A.7; new FS13 states the final lever; ALLOW-MISSING justified (live old uses only in §7.2/§16 withdrawal notes) |
| M066 (L132, §1, BLOCKING-derived) | FOLDED · HOLD | old L132 §1 ↔ new §1 FS16 (the inert stored hand made true by the row's context stands in the law; the trail MOVED) — read both; content carried, tag/trail only removed |
| M072 (L136, §1, KEPT) | KEPT · HOLD | old L136 §1 ↔ new design mark — STOP-FS-3 in FS18 (the flight slot, OD-FS-11 ⭐) — read both; content carried, tag/trail only removed |
| M073 (L160, §2.1, BLOCKING-derived) | FOLDED · HOLD | old L160 §2.1 ↔ new §2.1 record notes ("No DM field"; "The causes": `avarice`/`need_passed` FREE, `greed` refused, the two slot wo — read both; content carried, tag/trail only removed |
| M077 (L160, §2.1, KEPT) | KEPT · HOLD | REFINED carrier choice kept in new §2.1 ("OD-FS-8, vetoable") and OD-FS-8; "confirmed at I.4" verified in briefs/RULINGS-P6.md I.4: "The FS carrier reading (G.5 as the residue lane read it) is CONFIRMED by the seat and by the chair" |
| M079 (L164, §2.1, random) | FOLDED · HOLD | old L164 §2.1 ↔ new §2.1 "Why on `economicState`" (it rides no other landed record, and why); "the brief asked" MOVED to history — read both; content carried, tag/trail only removed |
| M080 (L168, §2.2, random) | FOLDED · HOLD | old L168 §2.2 ↔ new §2.2 `fiscalHandActive` (the fourth-door measurement as a sentence) — read both; content carried, tag/trail only removed |
| M081 (L169, §2.2, BLOCKING-derived) | MOVED · HOLD | old L169 §2.2 ↔ new history — `setBy` gone from the read (superseded name) — read both; content carried, tag/trail only removed |
| M082 (L170, §2.2, DROPPED) | DROPPED · HOLD | old L170 §2.2 ↔ new superseded by `pressedHandOf` (D.8) — the struck `shortfallHandOf` (ALLOW-MISSING) — read both; content carried, tag/trail only removed |
| M083 (L171, §2.2, BLOCKING-derived) | FOLDED · HOLD | old L171 §2.2 ↔ new §2.2 `fiscalNeedOf` (content stands; tag MOVED) — read both; content carried, tag/trail only removed |
| M085 (L174, §2.2, BLOCKING-derived) | FOLDED · HOLD | old L174 §2.2 ↔ new §2.2 `exaction01` (the context rule stands; "a DM-directed raise is grieved like any raise" folded into the bu — read both; content carried, tag/trail only removed |
| M087 (L182, §2.3, BLOCKING-derived) | FOLDED · HOLD | old L182 §2.3 ↔ new §2.3 causes row (the slot words held until their legs land); `empty_vault`/`plenty` DROPPED as superseded name — read both; content carried, tag/trail only removed |
| M089 (L191, §2.3, BLOCKING-derived) | MOVED · HOLD | old L191 §2.3 ↔ new history — `setFiscalHand`, `believedHandOf`, `fiscalStrainOf` struck (superseded names, ALLOW-MISSING) — read both; content carried, tag/trail only removed |
| M092 (L197, §2.4, BLOCKING-derived) | FOLDED · HOLD | old L197 §2.4 ↔ new §2.4 `levy` row (the third meaning registered stands; tag MOVED) — read both; content carried, tag/trail only removed |
| M096 (L218, §3.2, BLOCKING-derived) | FOLDED · HOLD | new §3.2 demand head carries the re-cut and the pin (row 17 (a)); A.8's "BELIEVED DEMAND" quote removed — see observation O-1 |
| M097 (L226, §3.2, random) | FOLDED · HOLD | old L226 §3.2 ↔ new §3.2 upkeep row ("WS hires nothing, §7.5"); the struck "coalition purse" DROPPED (superseded by WSV-N-FS-2) — read both; content carried, tag/trail only removed |
| M100 (L240, §3.3, BLOCKING-derived) | FOLDED · HOLD | old L240 §3.3 ↔ new §3.3 (the two candidacy laws make §14 rows 4, 4b hold by construction; `roll-r1.out` kept) — read both; content carried, tag/trail only removed |
| M105 (L260, §3.4, BLOCKING-derived) | FOLDED · HOLD | struck vault trigger absent; "No trigger reads the vault (FS2)" is the strike restated, not a new rule |
| M119 (L303, §4.2, BLOCKING-derived) | FOLDED · HOLD | old L303 §4.2 ↔ new §4.2 (the DM's direction replaces both bands; tag MOVED) — read both; content carried, tag/trail only removed |
| M121 (L304, §4.2, DROPPED) | DROPPED · HOLD | r1 shortfall yield superseded by the r2 D.8 bracket in the same bullet |
| M123 (L311, §4.3, BLOCKING-derived) | MOVED · HOLD | old L311 §4.3 ↔ new history — "the roll's need term makes this rare" withdrawn with the vault term; §4.3 states the final — read both; content carried, tag/trail only removed |
| M125 (L313, §4.3, random) | FOLDED · HOLD | old L313 §4.3 ↔ new §4.3 siege bullet (the landed charge under siege and occupation; the Why panel names it; hazard H-FS-2, W-COIN — read both; content carried, tag/trail only removed |
| M127 (L324, §4.4, BLOCKING-derived) | MOVED · HOLD | old L324 §4.4 ↔ new history — `coffersRead` no longer cited as an FS input (the row states the final) — read both; content carried, tag/trail only removed |
| M131 (L327, §4.4, random) | FOLDED · HOLD | old L327 §4.4 ↔ new §4.4 `set-levy` row (collected whole, never refused; tag MOVED) — read both; content carried, tag/trail only removed |
| M132 (L327, §4.4, BLOCKING-derived) | FOLDED · HOLD | old L327 §4.4 ↔ new §4.4 `set-levy` row (the landed cite; tag MOVED) — read both; content carried, tag/trail only removed |
| M133 (L336, §5.1, BLOCKING-derived) | FOLDED · HOLD | old L336 §5.1 ↔ new §5.1 (the signature POP's, the caller W-SEAT's — §15; tag MOVED) — read both; content carried, tag/trail only removed |
| M137 (L349, §5.3, KEPT) | KEPT · HOLD | old L349 §5.3 ↔ new design mark — STOP-FS-1 in §5.3 road 4 (resolved on J-INT-3; "the brief's design withdrawn" MOVED to history) — read both; content carried, tag/trail only removed |
| M138 (L351, §5.4, KEPT) | KEPT · HOLD | old L351 §5.4 ↔ new design mark — §5.4's heading "⛔ STOP-FS-2 (a slot, not an invention)" (OD-FS-10; cited by the fold) — read both; content carried, tag/trail only removed |
| M139 (L355, §5.5, KEPT) | KEPT · HOLD | old L355 §5.5 ↔ new design mark — §5.5's heading "⛔ STOP-FS-3 (measured: no road; a slot)" (OD-FS-11 ⭐; cited by POP and the fold) — read both; content carried, tag/trail only removed |
| M141 (L357, §5.5, STOP) | FOLDED · HOLD | STOP-FS-3 applied text folded into §5.5 and OD-FS-11 ⭐ (recommendation provenance B.4 in the Ruled column) |
| M143 (L369, §6.1, BLOCKING-derived) | FOLDED · HOLD | old L369 §6.1 ↔ new §6.1 (the target `hand` is the seat's raise; tag MOVED) — read both; content carried, tag/trail only removed |
| M154 (L373, §6.2, DROPPED) | DROPPED · HOLD | r1 B.4 shortfall superseded by D.8 (old §6.2 r2 bracket "is REPLACED") |
| M158 (L377, §6.3, DROPPED) | DROPPED · HOLD | r1 SP-9 stage superseded by D.9; new §6.3 "No SP-9 resolve-first stage exists or is asked for … SP-9 registers the kind and its seal only" = old r2 bracket |
| M160 (L379, §6.3, random) | FOLDED · HOLD | §6.3 remitted: "true when spoken" refinement folded; POP's side in §15 |
| M165 (L391, §7.1, random) | FOLDED · HOLD | old L391 §7.1 ↔ new §7.1 the telling (a DM-directed raise reaches the telling only through this read) — read both; content carried, tag/trail only removed |
| M167 (L393, §7.1, BLOCKING-derived) | MOVED · HOLD | old L393 §7.1 ↔ new history — "the coup … no FS term" restated to the measured reader; §7.1 states the reader — read both; content carried, tag/trail only removed |
| M172 (L407, §7.4, random) | FOLDED · HOLD | old L407 §7.4 ↔ new §7.4 (a liege never sets a member's hand, with PL5's reason) — read both; content carried, tag/trail only removed |
| M174 (L412, §7.5, random) | FOLDED · HOLD | old L412 §7.5 ↔ new §7.5 (the riders' purse is PR/ST's `patrols` row; tag MOVED) — read both; content carried, tag/trail only removed |
| M177 (L414, §7.5, random) | FOLDED · HOLD | old L414 §7.5 ↔ new §7.5 war-layer loop (the attacker only; WS's side reads "a poor ATTACKING court's") — read both; content carried, tag/trail only removed |
| M179 (L420, §8, BLOCKING-derived) | FOLDED · HOLD | new §8 head = A.7 quote restated; "FS has no edit verb … no DM field" = the struck verb/field |
| M183 (L435, §9, BLOCKING-derived) | FOLDED · HOLD | old L435 §9 ↔ new §9 scrutiny row (content stands; tag MOVED) — read both; content carried, tag/trail only removed |
| M190 (L448, §9, BLOCKING-derived) | FOLDED · HOLD | old L448 §9 ↔ new §9 coup row (content stands; tag MOVED) — read both; content carried, tag/trail only removed |
| M194 (L456, §9, BLOCKING-derived) | FOLDED · HOLD | old L456 §9 ↔ new §9 DM row (the landed `set-levy`; tag MOVED) — read both; content carried, tag/trail only removed |
| M202 (L474, §10.2, DROPPED) | DROPPED · HOLD | r1 tag on the Leave bullet; r2 bracket struck its SP-9 stage |
| M208 (L488, §11, BLOCKING-derived) | FOLDED · HOLD | old L488 §11 ↔ new §11 (4) the ROW door (content stands; tag MOVED) — read both; content carried, tag/trail only removed |
| M210 (L488, §11, BLOCKING-derived) | FOLDED · HOLD | old L488 §11 ↔ new §11 mutant (g) (W-COIN's pin extended over the hand; tag MOVED) — read both; content carried, tag/trail only removed |
| M211 (L488, §11, BLOCKING-derived) | FOLDED · HOLD | old L488 §11 ↔ new §11 mutant (h) (tag MOVED) — read both; content carried, tag/trail only removed |
| M212 (L488, §11, BLOCKING-derived) | FOLDED · HOLD | old L488 §11 ↔ new §11 mutant (i) (tag MOVED) — read both; content carried, tag/trail only removed |
| M218 (L489, §11, random) | FOLDED · HOLD | §11 (l2) red = r4 probe control 1,320·1,386·924 / 66·66·0 (old r4 bracket "against r3's law") |
| M223 (L495, §12, KEPT) | KEPT · HOLD | build-time "⛔ STOP at build if FS-4's clause would cross 800" kept verbatim in FS-0 (1) |
| M225 (L496, §12, BLOCKING-derived) | FOLDED · HOLD | retitle per old row 17 (a) r2 bracket "re-titled from 'system level' — it holds the war fixed" (C-4); 17 (b) "W-COIN's car-0 runs it" is in old row 17 (b) |
| M226 (L496, §12, BLOCKING-derived) | MOVED · HOLD | old L496 §12 ↔ new history — `setFiscalHand` struck (FS-1's EDITOR entry states the landed `set-levy`) — read both; content carried, tag/trail only removed |
| M227 (L497, §12, BLOCKING-derived) | FOLDED · HOLD | old L497 §12 ↔ new §12 FS-2 pins owed (tag MOVED) — read both; content carried, tag/trail only removed |
| M235 (L500, §12, KEPT) | KEPT · HOLD | old L500 §12 ↔ new design mark — STOP-FS-2 in FS-5's car-0 (OD-FS-10) — read both; content carried, tag/trail only removed |
| M237 (L512, §13.1, BLOCKING-derived) | FOLDED · HOLD | old L512 §13.1 ↔ new §13.1 create (the DM never writes this record; tag MOVED) — read both; content carried, tag/trail only removed |
| M238 (L515, §13.1, BLOCKING-derived) | MOVED · HOLD | old L515 §13.1 ↔ new history — "A DM set is lost with it" withdrawn with the DM's set; §13.1 regenerate states the final — read both; content carried, tag/trail only removed |
| M240 (L517, §13.1, BLOCKING-derived) | FOLDED · HOLD | old L517 §13.1 ↔ new §13.1 import ("a `setBy` key or a stored `wonted` is malformed"; "legacy … compile-era draft" wording dropped) — read both; content carried, tag/trail only removed |
| M243 (L534, §13.2, BLOCKING-derived) | FOLDED · HOLD | old L534 §13.2 ↔ new §13.2 decrees row (tag MOVED) — read both; content carried, tag/trail only removed |
| M251 (L552, §14, DROPPED) | DROPPED · HOLD | r1 shortfall row superseded by r2 D.8 row 8 |
| M259 (L559, §14, BLOCKING-derived) | FOLDED · HOLD | old L559 §14 ↔ new §14 row 15 (tag MOVED) — read both; content carried, tag/trail only removed |
| M260 (L559, §14, random) | FOLDED · HOLD | old L559 §14 ↔ new §14 row 15 (the two pins reconciled; the struck clause MOVED to history) — read both; content carried, tag/trail only removed |
| M261 (L561, §14, BLOCKING-derived) | MOVED · HOLD | old L561 §14 ↔ new history — the compile's neighbour row struck with the read; row 17 (a) states the input-level pin — read both; content carried, tag/trail only removed |
| M268 (L570, §14, BLOCKING-derived) | FOLDED · HOLD | old L570 §14 ↔ new §14 row 25 (tag MOVED) — read both; content carried, tag/trail only removed |
| M270 (L572, §14, random) | FOLDED · HOLD | old L572 §14 ↔ new §14 row 27 (the commons and the assize one tick, as the coin) — read both; content carried, tag/trail only removed |
| M271 (L572, §14, DROPPED) | DROPPED · HOLD | r1 row 27 superseded by the r2 bracket ("could not pass — no head-of-tick stage exists") |
| M277 (L576, §14, random) | FOLDED · HOLD | row 31 (a)/(b) restated per the r4 bracket ("SUPERSEDED by (f) … holds a fortiori … (b) holds on the refusal rung"); 61,578 moved (J4) |
| M279 (L584, §15, BLOCKING-derived) | FOLDED · HOLD | C-4: "W-COIN's car-0 confirms the system pin" → "runs the war-layer soak (row 17 (b))" — old row 17 (b) assigns the soak to W-COIN's car-0 |
| M281 (L585, §15, BLOCKING-derived) | FOLDED · HOLD | old L585 §15 ↔ new §15 POP row (registry, signature, caps, target precedence, suppression; tag MOVED) — read both; content carried, tag/trail only removed |
| M282 (L585, §15, random) | FOLDED · HOLD | old L585 §15 ↔ new §15 POP row (the dip's cadence once per refused season; the target list never admits a DM direction) — read both; content carried, tag/trail only removed |
| M285 (L585, §15, KEPT) | KEPT · HOLD | old L585 §15 ↔ new design mark — STOP-FS-3 in §15's POP row (the push-driver slot, OD-FS-11 ⭐) — read both; content carried, tag/trail only removed |
| M286 (L586, §15, BLOCKING-derived) | FOLDED · HOLD | old L586 §15 ↔ new §15 W-SEAT row (tag MOVED) — read both; content carried, tag/trail only removed |
| M288 (L588, §15, BLOCKING-derived) | FOLDED · HOLD | old L588 §15 ↔ new §15 EDITOR row (the consumer car and the predicate; tag MOVED) — read both; content carried, tag/trail only removed |
| M295 (L596, §15, random) | FOLDED · HOLD | old L596 §15 ↔ new §15 CH row (`retainers` carries the corps's pay; the struck "corps purchase" MOVED) — read both; content carried, tag/trail only removed |
| M303 (L608, §16, BLOCKING-derived) | FOLDED · HOLD | old L608 §16 ↔ new §16 `fiscalHand` row (tag MOVED) — read both; content carried, tag/trail only removed |
| M304 (L609, §16, BLOCKING-derived) | FOLDED · HOLD | old L609 §16 ↔ new §16 causes row (tag MOVED) — read both; content carried, tag/trail only removed |
| M305 (L616, §16, BLOCKING-derived) | DROPPED · HOLD | withdrawn names dropped from §16 per brief §2.5 ("superseded names gone"); the fold §5 still carries the WITHDRAWN note (fold L1074) — P8d's to regenerate |
| M306 (L616, §16, DROPPED) | DROPPED · HOLD | as M305 (`shortfallHandOf`) |
| M311 (L621, §16, BLOCKING-derived) | FOLDED · HOLD | old L621 §16 ↔ new §16 `levy` row (tag MOVED) — read both; content carried, tag/trail only removed |
| M313 (L632, §17, BLOCKING-derived) | FOLDED · HOLD | old L632 §17 ↔ new §17 OD-FS-2 ⭐ (NO DM field — A.7 in the Ruled column); "the shape is SMALLER than the compile's" MOVED to hist — read both; content carried, tag/trail only removed |
| M316 (L633, §17, KEPT) | KEPT · HOLD | old L633 §17 ↔ new design mark — STOP-FS-1 in OD-FS-3 ("resolved on J-INT-3") — read both; content carried, tag/trail only removed |
| M317 (L635, §17, BLOCKING-derived) | FOLDED · HOLD | old L635 §17 ↔ new §17 OD-FS-5 (tag MOVED) — read both; content carried, tag/trail only removed |
| M320 (L638, §17, DROPPED) | DROPPED · HOLD | r1 B.4 shortfall ruling superseded by D.8 (same row) |
| M323 (L640, §17, KEPT) | KEPT · HOLD | old L640 §17 ↔ new design mark — STOP-FS-2 in OD-FS-10 — read both; content carried, tag/trail only removed |
| M325 (L641, §17, KEPT) | KEPT · HOLD | old L641 §17 ↔ new design mark — STOP-FS-3 in OD-FS-11 ⭐ — read both; content carried, tag/trail only removed |
| M328 (L645, §17, BLOCKING-derived) | FOLDED · HOLD | old L645 §17 ↔ new §17 OD-FS-15 (A.7 in the Ruled column); `setFiscalHand` DROPPED as a superseded name — read both; content carried, tag/trail only removed |
| M333 (L650, §17, BLOCKING-derived) | FOLDED · HOLD | old L650 §17 ↔ new §17 OD-FS-20 (tag MOVED) — read both; content carried, tag/trail only removed |
| M338 (L653, §17, BLOCKING-derived) | FOLDED · HOLD | old L653 §17 ↔ new §17 OD-FS-23 (A.8 in the Ruled column) — read both; content carried, tag/trail only removed |
| M342 (L665, §18, DROPPED) | DROPPED · HOLD | r1 "collected short" superseded by r2 D.8 on §18 #5 |
| M345 (L670, §18, BLOCKING-derived) | MOVED · HOLD | old L670 §18 ↔ new history — `plenty` struck, `need_passed` its successor; §18 #10 stands — read both; content carried, tag/trail only removed |
| M346 (L671, §18, BLOCKING-derived) | MOVED · HOLD | old L671 §18 ↔ new history — "an empty vault" struck; §18 #11 stands — read both; content carried, tag/trail only removed |
| M351 (L679, Round r1 (P6b, 2026-10-20; l, random) | MOVED · HOLD | old L679 Round r1 (P6b, 2026-10-20; l ↔ new history — round header r1 (verbatim in the cure record) — read both; content carried, tag/trail only removed |
| M352 (L713, Round r1 (P6b, 2026-10-20; l, random) | MOVED · HOLD | old L713 Round r1 (P6b, 2026-10-20; l ↔ new history — the r1 [REFINED …] list (verbatim in the cure record; each refinement is folded where it was marked  — read both; content carried, tag/trail only removed |
| M358 (L769, Round r4 (P6d, consolidation, STOP) | MOVED · HOLD | cure record line, verbatim in history/FS-cure-record.md (cmp VERBATIM) |
| M359 (L769, Round r4 (P6d, consolidation, STOP) | MOVED · HOLD | as M358 |
| M360 (L769, Round r4 (P6d, consolidation, STOP) | MOVED · HOLD | as M358 |
**CONFIRMED vs PLAUSIBLE:** CONFIRMED by execution: the ratchet line, the marker count of 361, the cure record's verbatim move, the old text's identity with `1beabdc85`, the numeral, mark and ⭐ survival, the cross-reference resolution, and the clause diffs. CONFIRMED by reading both passages: every one of the 119 HOLD verdicts and the two whole-section reads. PLAUSIBLE: that no meaning shifted in clauses outside the sample. The whole-text read makes this likely, but it was judged by reading, not by a script.
