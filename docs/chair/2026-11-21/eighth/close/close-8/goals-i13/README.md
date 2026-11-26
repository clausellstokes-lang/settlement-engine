# GOALS-I13's MEASURE, KEPT RUNNABLE (the tenth chair's G44 (2))

THE ONE COMMAND (on any tree; plans from `../tools/make-plan.mjs` and `../tools/make-visitor-plan.mjs ../tools/plan-lit.json`):

    GATE_MUTEX_MAX_POLLS=40000 sh scripts/gate-mutex.sh --run -- \
      node docs/chair/2026-11-21/eighth/close/close-8/goals-i13/tools/gi13-run.mjs --tree=<abs tree> --plan=<planC.json|planV.json> --out=<file.jsonl> --workers=4

It runs `../tools/goals-i13.census.jsx` (CLOSE-7's measure: I-13's own method over every birth: the MIDDLE card removed, both
deals on `createPRNG('i13::<name>')`, a card compared where its receipt reads nothing of the removed card) and joins the parts.
`tools/all.sh` is the builder's whole batch (census and births with keys and refs, base and tip, C and V, in one mutex hold);
`tools/keys-refs.mjs` the births' measure module (per-field hashes and receipt refs).

## THE TWO TABLES (CONFIRMED by run; base = the join at 0ef4d2a11b, tip = b136ae0b2d)
| plan | compared base -> tip | I-13 faults base -> tip (towns) |
|---|---|---|
| C (900) | 3,531 -> 2,585 | 136 (122) -> 6 (6) |
| V (900) | 3,366 -> 2,426 | 172 (148) -> 6 (6) |

| plan | records moved (hash; fields) | receipts | refs base -> tip (added) |
|---|---|---|---|
| C | 0; none | 27,360 | 22,130 -> 871,039 (+848,909) |
| V | 0; none | 26,185 | 20,285 -> 771,338 (+751,053) |

THE RESIDUAL (G44): the twelve faults left are transitive absence reads (card B read nothing of X and is no repeat in the full
deal; without X an earlier card A takes another wording, which B then repeats, so pass two rotates B; one siege line freed the
same way). The receipt does not record them (an honest "read every earlier holding" leaves the arm comparing 20 cards). Their
cure is an order-free deal, which moves births: a decision on the pre-release list for the owner, not point 118 nor 119.
