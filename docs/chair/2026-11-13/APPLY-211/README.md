# Applying migration 211 alone: the owner's step

**For the owner's hand only.** No session applies this. Do it in the SQL editor of the production project. Do NOT use a database push from any branch: that would send migrations 204 to 210 with it, and 208 must not go before the new site.

**A note added on 2026-11-13 at 19:45 UTC: this pack is still the right one.** After the pack was built, the veil lane's builder wrote its newer cures into the lane's copy of migration 211, so that copy no longer matched this pack. The chair has ruled that migration 211 is FROZEN at the reviewed bytes, which are the bytes in this pack; the newer cures move to a new migration 212, which is not in this pack and is not to be applied until a security review clears it. Applying this pack is correct whether or not 212 follows. If it is already applied, nothing needs redoing.

**A note added on 2026-11-13 at 21:11 UTC: one more thing 211 alone does not close.** The security reader found that the names of houses a game master hid whole still reach a reader, in lower case, inside two derived lists of the town's record, and, on shares that reveal the game master's notes, inside the town's trace. The fuller review of 21:38 UTC adds: the town's record also tells a reader by five yes-or-no flags that such a house exists, and ONE LINE OF IT IS PRINTED ON THE PAGE A READER SEES TODAY: an income line named after the hidden criminal house (for example "Thieves' Guild Revenue"), with its share of the town's trade. This is so today, before 211, and stays so after it: applying 211 makes nothing worse and still closes everything it was reviewed to close, so this pack is still the right one. Neither does the later migration 212 close it yet: the cure is being written into 212 now. Migration 212 is still NOT to be applied until its security review clears it; it will come to you as one pack.

**What it does.** Today the server sends every reader of a shared town everything its game master hid by hand, and only the reader's browser hides it. Migration 211 makes the server withhold it, on the gallery page, the party link, the map page and the import. It creates and replaces functions only: no table, column, policy or row is touched.

**What was checked.** The chair checked on 2026-11-13 at 17:18 UTC that the file inside `3-apply-211.sql` is byte for byte the reviewed file (sha256 `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01`), and that the two read-first files open a read-only transaction, end in a rollback and hold no statement that writes. The security reviewer rehearsed the whole step on a local database, not in the hosted editor. The full review is `docs/chair/2026-11-13/REVIEW-VEIL-211-333b33973-2026-11-13.md`, section 7.

## The steps

1. **Run `1-read-first-block-one.sql`** (read-only). Look at three things:
   - Section (1), the statement time limits of the roles `anon` and `authenticated`: if either is under 1.5 seconds, STOP and tell the chair.
   - Section (2), `refused_at_211`: if above zero, a frozen share that large goes dark at 211. Refresh that share first, or tell the chair.
   - Sections (9) and (10) are information. Nothing to hold for at any value.
2. **Run `2-read-first-block-two.sql`** (read-only). Look at:
   - (A) `links_that_would_revive`: if above zero, STOP. Those are party links that are dead today and would open again. Revoke each first.
   - (B) `shares_whose_page_will_hide_what_its_sharer_opened`: how many shared pages will show less than their sharer chose until the new site ships. It shows less, never more. Not a stop; it is the cost you accepted.
   - (C) and (D) are information. If convenient, send the chair the four numbers d1 to d4: they size what the next fix must cover.
3. **Run the whole of `3-apply-211.sql`, once.** It is one transaction: if any statement fails, nothing has changed. Do not split it into parts. If the editor refuses its size, stop and tell the chair.
4. **Run `4-check-after.sql`.** Expect `40 | 0` in the first result, and `search_path=public, pg_temp` on each of the four functions in the second.
5. **Look as a visitor** (a private window, signed out): a shared town whose game master hid things still draws; a frozen share shows its frozen copy (its "frozen on" label is gone from the old page: expected); a party link opens; a shared map's member towns open. Signed in: an importable town imports.
6. **Only if something is wrong: run `5-rollback-ONLY-IF-NEEDED.sql`.** One transaction; it restores the database exactly as it was, and so re-opens the leak that 211 closes.

## Afterwards

Tell the chair it is applied, with the numbers from steps 1 and 2. At the release the normal push applies 204 to 211 in order; 211 goes on again in its place and nothing else is needed.

## What 211 alone does not close

Hidden text that travels through second copies in a town's record (a sixth seat is fixing these now), the public event log, shares exported before the veil, and custom-content records on reveal-to-DM shares. And, found on 2026-11-13 at 21:08 UTC: the lower-cased names of hidden houses in two derived lists and in the trace (the note near the top).
