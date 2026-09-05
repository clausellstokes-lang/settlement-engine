# ⛔ THE OSR MINT RULING IS WITHDRAWN — the premise was refuted, and the cure is the corpus
2026-09-05 · Opus 5 · supersedes `RULING-OSR-MINT-ISCRIMINAL.md` (`refs/preserve/ruling-osr-mint-2026-09-05`)

## WHAT I RULED, AND WHY IT WAS WRONG
I ruled a governed set-growing mint (pin 64 → 65) to admit `economyStateProse.js`'s `isCriminal`
read. Lane OSRMINT refused to execute it, re-derived the premise as the ruling required, and **two
of its three legs failed.**

1. ⛔ **"Fires on 324 of 540 generated settlements" — REFUTED.** That figure is reproducible only on
   a **stress-loaded** grid (`['wartime']` 280/540; `['insurgency','famine']` 450/540). On the
   default config it fires on **4 of 540 (0.7 %)**, and on the instrument's own 16-generation corpus,
   **zero**. Mechanism confirmed at source: the writer branch is gated on `blackMarketCapture > 10`
   and `stressShadowBonus` is zero without stress flags. **My central argument — "deleting it kills a
   live lens" — did not hold as stated.**
2. ⛔ **"The instrument already agrees" — BACKWARDS.** The exemption's recorded `why` says the read
   is *"dead on generated worlds by construction"*, which is the OPPOSITE grounding to mine.
3. ⛔ **A fact I did not have: THIS CONSIST CREATED THE READ.** Zero occurrences at product base
   `90702c3e9`; six at the tip, all introduced by `22d9a0d4d` (DESK-ECONFAITH C1). **Raising a
   ceiling to admit a read the same consist just landed is the ratchet doing its job**, and I would
   have overruled it.
4. ⛔ **A second fact: the governed path cannot execute the mint.** The baseline is at schema 16 and
   `COMPANION_GATE_TARGET_SCHEMA = 16` is the top rung — **there is no schema-17**. Fence 3 required
   the governed path; Fence 1 forbade minting a new rung as "a different act". My own fences made the
   ruling unexecutable, which is the clearest possible signal that it was not thought through.

⭐ The lane obeyed the fences and stopped rather than bending them. That is exactly right, and it is
why the fences were written.

## WHAT IS ACTUALLY TRUE
The lens is **real**: `criminalIncomePoolKey` fires on 52–83 % of STRESSED worlds and its prose
("the largest single earner is the one that is not written down") is good product. Its docblock
records a deliberate design rule — *"keyed on the record's own `isCriminal` FLAG, never on the source
LABEL"* — which is the same label-trap law this program has now hit four times. **Re-pointing at the
label is therefore out, and deleting a working feature is out.**

⚠ Its desk fixture nonetheless **hand-writes the flag it grades** (`isCriminal: !!isCriminal`),
which is why the lens looked alive in test while being near-dead on ordinary worlds. That is the
fixture-is-the-specification defect again and it is a separate finding.

## RULED INSTEAD: WIDEN THE CORPUS, WHICH IS THE INSTRUMENT'S OWN REMEDY
The finding is a false positive of **corpus reach**, not a defect — the corpus is 4 seeds × 4
configs and none of them loads stress, so a legitimately conditional writer is invisible to it. The
instrument invites exactly this cure in its own docblock: *"THE CORPUS IS THE INSTRUMENT'S REACH —
more keys observed, fewer false findings."*

**Add a stress-loaded config to the observed-shape corpus**, then take the governed **shrink**
re-freeze. Both doors are permitted: `--write` "may only lower or delete ordinary debt", and a
widened corpus can only ever *reduce* "no writer produces this" findings. **No ceiling moves, no
identity is added, no schema rung is minted, and no read is deleted.** It also cures the ROOT cause
for every other conditional writer the corpus cannot currently see, rather than papering over one.

⚠ **The one arm to watch is `SHRINK-ONLY: … no row has vanished`** — if widening makes existing
findings disappear, that arm reds until the re-freeze records the shrink. That is the expected,
governed sequence, not a surprise.

## THE THREE QUESTIONS THE LANE LEFT, ANSWERED
1. *Is a ceiling raise still warranted for a read this consist introduced?* **No.** Withdrawn.
2. *Does minting schema 17 stay inside Fence 1?* **No** — and it is now moot.
3. *Which explanation goes in the row?* **Neither.** There is no row; the corpus stops producing the
   finding.
