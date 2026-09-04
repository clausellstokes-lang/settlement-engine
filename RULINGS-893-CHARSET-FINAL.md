# §893 — THE CHARSET RULING, FINAL. The 27-widening is CANCELLED; the font is EMBEDDED.
⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧ · supersedes §6 item 4 AND its own amendment §6c.

## 1. ⛔ REVERSED, AND THIS IS THE CHAIR'S THIRD REVERSAL OF ITSELF TONIGHT
§6 item 4 FUNDED CHARSET Car 3 as a repair. §6c corrected its premises but kept it funded, saying
*"the two land together or the smaller one lands explicitly labelled a down payment."* **Lane
EMBEDFONT measured it, and the down-payment framing is wrong too. CHARSET Car 3 is CANCELLED as a
standalone act.**

**THE MEASUREMENT THAT DECIDES IT: all 27 codepoints of the widening are ALREADY INSIDE the font the
product already ships — 27 of 27.** So the widening is **not a step the embed builds on; it is a step
the embed DELETES.** It buys **12.2%** of the defect (5 of 41 instances, 4 of 35 tokens) for 100% of
the regeneration, the debt re-record and the ceremony — and it moves the register 41 → 36 in a way
that *reads as progress* while the shipped sanitiser still renders `Đorđević` as `"or evi"`. That is
not a truncation. **It is a name the reader cannot recognise.** Shipping a register improvement over
that is precisely the cheap option presented as the best available, which the owner's standing law
forbids.

## 2. ⭐⭐ RULED: EMBED THE FONT. The cost that killed this for months does not exist.
**FIRST PAINT: 0 B.** The eight faces (1,033,344 B) **already ship in `public/fonts` and already cost
nothing at first paint** — `index.html` preloads only two woff2 files, `index.css` references only
woff2, and the `.ttf` files are reached solely by the react-pdf worker. No new asset, no eager edge,
no preload, no CSS byte. `CLOSURE_BUDGET_BYTES`, the three `firstPaintNonJs` budgets and both
`fontsAndMeta` ratchets **all stay put**. The alternatives were priced honestly and rejected:
base64-inlining costs +524,267 B on an already-lazy chunk for no first-paint gain; an eager import is
a 50% overrun of a 1,048,000 B ceiling.
**THE EMITTED PDF: +~43 KB, near-constant**, because **jsPDF already subsets on emit**
(`jspdf.es.js:21896`). Three 129 KB faces cost ~41 KB, not 393 KB.
**FONT: Lora Regular + Bold + Italic** — the serif the dossier already renders, three faces because no
painter uses bold-italic, 779 codepoints, which finally makes the two paid PDF engines agree. Declared
cost: `U+00AD` leaves the book set, and it is already on the `invisible` ban list.
**COVERAGE: the embed cures 41 of 41 instances and 35 of 35 tokens.** All 8 pinned codepoints are
covered by all 8 shipped faces, 64 of 64.

⭐ **PROVED AT THE RENDER, NOT AT THE SANITISER** — the distinction this program keeps having to
relearn. The lane emitted real Identity-H documents and decoded the `Tj` operands back through the
ToUnicode CMap: `Babić Đorđević Kovačević Uroš Snežana Čupić Khān Hadžić € † — '` all round-trip, and
a helvetica control fails. That is a receipt, not an argument.

## 3. THE ONE THING INHERITED FROM THE CANCELLED CAR
**The sanitiser must still widen — but DERIVED FROM THE FONT, never from WinAnsi.** Otherwise the
embedded face sits behind a pass that still erases everything above `U+00FF`. This rides inside the
embed car; it is not a separate act.

## 4. ⛔ THE RISK THAT WOULD SILENTLY UNDO THIS
**`tests/helpers/jsPdfPaintedText.js` GOES BLIND under Identity-H.** It reads inflated content streams
as latin1, while Identity-H `Tj` operands are 2-byte glyph IDs — measured `identityTj = 27,456 B`
versus `plainTj = 0 B`. Eleven call sites across `exportDateSeam.test.js` and
`realmExportFaithSeam.test.js` **will red correctly, and the tempting repair is to loosen them into
vacuity.** ⛔ **RULED: the helper gains a ToUnicode decode IN THE SAME ACT.** Loosening those
assertions would manufacture exactly the vacuous-guard class this chair has now found three times in
one night.
Three more, none of which the brief anticipated: `writerReach.walker.test.js:382-389` **forbids the
font module living under `src/pdf/`**; `customContentCharsetLazy.test.js` locates the text pass by a
literal and would red with a FALSE "tree-shaken" message if the regex were respelled — the embed
leaves it alone, the widening would not; and **there is no negative control in the tree at all**
(`exoticUnicodeRender.test.js:15-17` says so outright), so **the car builds the failing-before arm
first.**

## 5. TWO OF THE CHAIR'S OWN PREMISES CORRECTED BY THE LANE
`sizeBaseline` is a **LINE-COUNT** ratchet, not a byte one; the byte budgets live in three other files
and none of them moves. And the 759-codepoint figure is the **INTERSECTION** of the eight faces, not
their union — the union is 958. Both were stated wrongly in the chair's brief and are corrected here.
Tests EXTEND `renderedFontEmbedding.test.js` and `fontRegistrationParity.test.js`; no new test file,
because the failure census is full at 10/10.
