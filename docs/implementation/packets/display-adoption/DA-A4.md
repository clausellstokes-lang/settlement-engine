# DA / DA-A4 — the date-locale outliers converge

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `1596b16590216e8a4f5330696689b0f7d595ef38`
- **Train:** `da-b`, family **DA**, member **2**. Change paths disjoint from DA-A3, DA-B1, DA-B2.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§69.2** · **J-TC21-4** (converge the outliers,
  not all 24 sites) · the Wave-4h ruling's named `en-US` pin.
- **Compile of record:** `laneTC21-DA-PLAN.md` §4.4, annex row DA.M7.

---

## §1 · THE DEFECT

Measured at base: **24** explicit `'en-US'` renders against **3** explicit `'en-GB'`. The
dominant convention agrees with the locale the Wave-4h ruling already pins, and the trio is
the outlier — the same product rendered a saved-on date as `1 Jan 26` on the settlement card
and `Jan 1, 26` a click away.

## §2 · WHAT REPLACES IT

`settlement/VersionDiffView.jsx:107` and `settlement/VersionsTab.jsx:63` flip to `'en-US'`.
The option bags are untouched, so only the field order and separators move.

⭐ **The third outlier, `SettlementCard.jsx:64`, is NOT here — it rides DA-A3**, which owns
that file for the palette convergence. Splitting it out would put two live packets on one
change path, which the validator convicts by name.

**Scope — the narrow reading, and the reason (J-TC21-4).** The audit's "one display-date
helper" would touch all 24 sanctioned `en-US` sites for no behaviour change and would collide
with da-2's files. This member converges the outliers and leaves the sanctioned sites alone.
**Deliberately deferred — documented, not a bug to re-find:** the shared display-date helper.

## §3 · THE PIN THAT MOVED, AND WHY IT IS NOT A GOLDEN RE-RECORD

`settlementCardSignals.test.jsx:178` asserted `/\d{1,2}\s+\w{3}\s+\d{2}/` — the `en-GB` FIELD
ORDER. Under `en-US` the same date renders `Jan 1, 26`, so the pin is re-keyed to
`/\w{3}\s+\d{1,2},\s+\d{2}/`. **The pin's subject is unchanged**: a real formatted date
rather than the literal `Invalid Date` the suite exists to forbid. Only the locale's spelling
of that date moved.

## §4 · SAME-SEED POSTURE

**NEUTRAL.** Display date rendering only; nothing persisted, no golden, no hash.

## §5 · STOP CONDITIONS

1. Any of the 20 sanctioned explicit `en-US` sites is touched.
2. A bare or `undefined` locale is introduced — that is DA-B2's subject and §69.4's ban.
3. The `Invalid Date` assertion is weakened rather than re-keyed.
