# MC (VEIL-56), WORK 2: V28 (8), THE LOCK: MEASURED. Concurrent readers of one map wait in line; the counter moved after the read ends it

Written 2026-11-27T23:47:07Z (date -u). EXECUTED (CONFIRMED), `run.sh lock`, 23:43-23:47 UTC, one mutex hold a variant. Local PostgreSQL 16, 4 cores.
Each variant on its own fresh copy of `mcu3` (001..211 + unit 3's 212, 2f849aa53): ONE public campaign map of 20 UNMARKED members
(every 7th stored document by name: a mix of sizes; `lock.mjs`), one warm read, then for N = 1, 2, 4, 8: N connections opened
first, N `get_gallery_map` calls fired at once, each reader's wall ms. Each call is its own transaction (autocommit), as an RPC
through the API layer is one transaction. Raw: `mc/out/lock-{asbuilt,after,out}.json`.
- **as built**: 212's text (the view-count UPDATE is the function's first statement after the map's select).
- **after** (`lock-after.sql`, cut by `make-lock-trials.mjs`): the same text, the UPDATE moved to just before each of the two
  returns. Nothing else changes (diffed: one line removed, two added).
- **out** (`lock-out.sql`): no UPDATE at all: the floor (a counter written by some other call).

| N readers at once | AS BUILT: each reader's ms (sorted) | AFTER | OUT |
|---|---|---|---|
| 1 | 6,688 | 6,334 | 6,487 |
| 2 | 6,372; 12,813 | 6,282; 6,482 | 6,359; 6,433 |
| 4 | 6,115; 12,331; 18,280; **24,475** | 6,491 .. **6,762** | 6,390 .. 6,771 |
| 8 | 5,940; 12,352; 18,878; 25,344; 31,731; 38,153; 44,511; **50,887** | 13,266 .. **13,599** | 12,607 .. 12,823 |
| view count rise (must be N) | 1, 2, 4, 8 | 1, 2, 4, 8 | 0 (no counter) |

**WHAT IT SHOWS.** As built, the k-th reader of one map finishes at k x one read (5.9-6.7 s a read here): the UPDATE takes the
map row's lock and holds it to the transaction's end, so every other reader of THE SAME MAP waits for the whole read before its
own begins. Eight readers: the last waits 44 s to start. Moved after the read, the lock is held only for the commit's tail: four
readers finish together in one read's time; eight finish in two (this machine has 4 cores: that x2 is CPU, not the lock; the
floor with no counter at all is the same, 12.8 s against 13.6 s). Readers of DIFFERENT maps never shared the lock.

**WHAT IT MEANS AGAINST THE PLATFORM's LIMIT (A-PLATFORM-TIMEOUTS.md, PLAUSIBLE).** A statement's timeout counts the time it
waits for the lock: as built, the second visitor of a map whose read takes more than half the visitor limit (3 s) is cancelled
though its own read would fit; on a popular map the n-th concurrent reader needs n reads' time. Moved after the read, each
reader pays only its own read.

**THE SAME LINE IS ON MASTER TODAY.** origin/master's get_gallery_map (088) also takes the UPDATE first; there a member costs
the sanitiser alone (~51 ms a one-member map, V7), so the line is short, but it is the same line.

**THE CURE's SIZE (for PROPOSAL.md).** Move one statement (to after the read, before each return) in the function 212 restates:
no change to anything served (the view count is not in the payload; it still rises once a read: measured). Its risk to the veil:
none (no served byte moves). Moving the counter OUT of the read (its own call from the client) saves nothing more here and
changes the client: not proposed.
