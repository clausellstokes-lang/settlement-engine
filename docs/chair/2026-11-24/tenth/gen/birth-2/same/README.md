# C6 (B): the sameness door's reading on the close's two corpora (BIRTH-2, 2026-11-25)
- Base: 0ec96f13d8 (`origin/lane/close-7-2026-11-24-cures`, point 116, lit). Corpora: C and V, 900 births each (`close-7/read24/make-{plan,visitor-plan}.mjs`).
- Commands: `node scripts/sameness-census.mjs --measure --plan=<C|V>.json --workers=4 --out=<dir>`; counted by the door's own `count()` (`--from=<dir>`); `--check --from=<C run>` (its tail: `check-C.tail60.log`; mostly register drift: 773 stale, 516 unregistered).
- The bar (the owner's): a slot printing up to 1.5 sentences a place: the top sentence's places over 150 of the size, over 15%; more a place: SEEN over 30%. Slots with at least 5 holders. Counter: `../c6/sameness-bar.js`.
- Wording slots (STATE, NARRATIVE) over the bar / counted:
  | size | C | V |
  |---|---|---|
  | thorp | 52 / 156 | 49 / 172 |
  | hamlet | 47 / 171 | 46 / 201 |
  | village | 48 / 168 | 47 / 181 |
  | town | 50 / 184 | 42 / 194 |
  | city | 65 / 184 | 45 / 198 |
  | metropolis | 71 / 179 | 54 / 194 |
- Distinct wording slots over: C 97, V 103 (`over-C.json`, `over-V.json`, worst first). Ruled G23: its own lane, "SAMENESS-LIT"; nothing built here.
