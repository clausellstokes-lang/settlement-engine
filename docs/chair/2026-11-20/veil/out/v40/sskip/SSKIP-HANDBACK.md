# R5D-SSKIP hand-back (VEIL-40, chain A; brief `briefs/R5D-SSKIP-BRIEF.md` at f3cdc6aa3; the chair's N94 (2), N95, N96, N101)

Worktree `/home/user/wt/sskip`, branch `lane/veil-40-2026-11-23-sskip-wip`, cut at aa54a6791. NOT PUSHED. **WIP, UNPROVED**:
nothing under `src/` or `tests/` has changed. Written 2026-11-23T13:22Z (date -u).

## 1. State, runs, figures

**State**: the FIRST MEASURE (brief step 1) is in progress. I sent a STOP on (iii) at 13:16Z. The chair ruled at 13:20Z (N101): (iii) is
judged on nothing-hidden reads, and the 508 hiding rows are judged by the never-there page. THE DECIDING COUNT is built and waits
for the lock: `mutex-order.txt` reads SSKIP: WAIT. No cure is built.

**The instrument**: `out/v40/sskip/sskip-measure.mjs` (plain node, no vitest, no pglite). It reads the TWIN engine
(`projectShareVeil` over `galleryPayloadFor`) at the owner's own setting, Reveal off and DM, on both doors (`rederiveForPage` on a
copy; `rederiveServed`). This is the fidelity arm's twin half; N67 (B2) found server sha = twin sha on every stored read. The seven
texts are read from `RIVAL_DESC_OF_HOST`'s source text (an instrument's reading; the cure will import them). The hand hides use the
test's own `handHidesOf`. `SSKIP_NT=1` adds the never-there count, which closes over the chair's N63 rule (`rivalClosure`: every
row whose stored `contestsNiche` equals a withheld row's `seatKey`, closed over). It reports how many rows the closure drops.
`SSKIP_SHAS=<file>` writes each birth's sha256, for the same-seed byte check. Outputs are `measure-today.txt` and `measure-master.txt`.

**Runs**: two runs of the probe on the stored pools, 12:59-13:15Z (today) and 13:16-13:21Z (master). Both were OUTSIDE the mutex,
which was my error: the seat's order (1) says no run outside it, light or not. A second today run, queued behind master, was
stopped before it started. No vitest runs. No edits.

**THE STORED POOL, today (440; `stored-v40/today`, B2's)**
- Density rivals (`contestsNiche`): 325. Of them, 70 have a base that is one of the seven and 255 have a copied host desc (T13).
- (c) NATURAL rows (no `contestsNiche`) whose base is one of the seven: **0** of 2,176 stored rows with a desc.
- `standingBase` vs the reference cut (`standingForms.mjs`): 0 disagree.
- **(ii)** Rows whose base is one of the seven: 70. Of them, rows that carry a stored standing: **0**. HOLDS.
- Nothing-hidden twin door-pages: 876, with 3,732 rows (20 veiled, 28 seat-contest listed). **FAULTS: 24 twin door-reads on 6 rows,
  6 places**, exactly B2's six (x 2 engines = B2's 48).
- **(i)** Faulting reads whose base is NOT one of the seven: **0**. HOLDS.
- **(iii)**, nothing-hidden: rows with no stored standing that S gives a tail: 24 have a seven-text base (the cure class); **OTHER 0**.
  HOLDS (N101's reading).
- Hiding reads (529 house and hand-hide records, 2,116 door-reads, 11,336 rows): 124 of the rows S gives a tail have a seven-text
  base; **508 OTHER rows** (stored desc without a standing) get one from S. Examples: t2p-town-none-76, noble hand hide, Merchant
  Guilds gets "They are always at the table, but cannot set their own terms."; t2p-town-none-32, Religious Authorities gets "...they
  play Merchant Guilds and Corrupt Council against each other". By N101 these are judged by THE DECIDING COUNT (NOT RUN).

**THE STORED POOL, master (440; `stored-v40/master`, master-born at db832c892, read by THIS tree's S)**
- Rivals: 346. A base that is one of the seven: 0 (master predates 14a). (c) NATURAL rows with a seven-text base: 0. (ii): 0 of 0.
- Nothing-hidden faults: 2,776 door-reads on 694 rows, 214 places. Every one has a base that is not one of the seven. This is a
  CROSS-ENGINE comparison (master's standing writer against today's S), not the 48's class.
- (iii), nothing-hidden OTHER: **140** (e.g. t2p-village-politically_fractured-9 Elder Council, stored without a standing, gets one).
  On hiding reads, OTHER is 348 (by kind: noble 82, density host 150, house hide 116; 89 record-rows, 62 places). Legacy documents
  are read by today's writer, and the seven-skip cannot touch them (no seven text on master). **For the seat**: N101 names the
  owner's page on a read that hides nothing. A master-born document's owner page shows its stored (master-written) desc, so these 140
  are N101 faults on legacy records. They are outside SSKIP's cure, and this is not ruled.

**Not run** (each waits for SSKIP's line): THE DECIDING COUNT (`SSKIP_NT=1` on today and master); the born pools (A full,
R5-RECENT full, act T); everything from brief step 2 on; N96 (seed index `/var/tmp/v18/t2/stored-v40/today-n96-seeds/pool-shard0.json`
prepared, the two seeds copied from pool-v40; the dump to `today-n96/` not run).

## 2. What needs a ruling
1. The master pool's 140 nothing-hidden OTHER rows (legacy stored descs that S re-writes with a standing): whose question are they?
