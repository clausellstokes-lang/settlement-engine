# THE EFFICIENCY CAR — measured, not guessed (the Opus chair)

The chair estimated the card at 20–25% of a pool's cost, then MEASURED it: a card is 122 KB ≈ 30K tokens, read by six seats ≈ 180K tokens, against ~1.2M tokens per pool. Trimming it saves ~4%, not 25%. The estimate was wrong and the brief says so. The measured facts that matter:

| card section | bytes | whose |
|---|---|---|
| (4) THE SIBLING SENTENCES | 52,630 | the REFUTER's (contradiction against the page) |
| (7) THE SPEAKERS | 19,044 | everyone's |
| (2b) WHAT A FACE MAY NOT DENY | 11,061 | everyone's |
| (3) THE SAME-PAGE READ SET | 8,993 | the REFUTER's |
| (8) WHAT WOULD BE FALSE | 8,683 | everyone's |
| (6) frozen fields · (2c) covert · rest | ~22,000 | mixed |

**AND THE STRUCTURAL FACT THE MEASUREMENT EXPOSED:** sections (2), (2b), (3), (4), (5), (6) and (7) are BLOCK-level or TIER-level — identical for every pool of a block. Only (1) the key and its preimage, (2d) the sibling rungs, (8) what would be false, and (9) where the flavour is are POOL-specific. The programme has been regenerating ~85 KB of identical content per pool, six pools a batch, and making six seats read it each time.

## (A) THE BLOCK CARD AND THE POOL DELTA — the real saving
Split `scripts/prose-mark-card.mjs` (dock) so it emits, per BLOCK, ONE `block-card.md` carrying (2), (2b), (2b′), (3), (4), (5), (6), (7) — written once per batch — and per POOL a thin `card.md` carrying (1), (2c), (2d), (8), (9) plus a one-line pointer to the block card. Byte-for-byte the two together must equal what the single card carries today: prove it by generating both for a pool whose card already exists and diffing the concatenation against it (order may differ; content may not). Nothing about what any seat CAN read changes — only how many times it is written and shipped.

## (B) THE SEATS READ WHAT THEY NEED
In the kit's `rewrite/rewrite-block-v3.workflow.js` (the chair will apply these; NAME the exact prompt strings to change in your return): the WRITER and the SELECTOR read the pool card whole and the block card's (2), (2b), (5), (6), (7) — NOT (3) and NOT (4), which are the refuter's instruments and 61 KB of the 122. The REFUTER, CURER and RE-REFUTER read everything. This is ruling 9 ("the writer reads ONE PAGE") finally made true: today the writer is handed the refuter's instrument and told it is a page.

## (C) ONE MARKER PER BATCH
The workflow runs one marker per pool. With (A) landed, one marker writes the block card once and then the thin pool deltas in the same pass. Mark becomes one seat per batch plus a short delta each.

## (D) THE TARGETED CURE
The curer re-reads the whole packet to repair two faces. The WEAK pool's cure (commit `b4c8d6e04`) proved a targeted packet is both cheaper and better: it moved 9 of 30 rows and left 21 byte-identical. Make that the default shape — the cure prompt takes the failing faces, their findings, and the card sections those findings cite, not the pool's whole history.

## (E) THE GATE RUNS THE SUITE ONCE
The draft gate and the cure gate each run the full per-commit list. The draft gate's job is to APPLY and MEASURE; the cure gate's is the one that must be green. Keep `--check` and the projector on both (they are cheap and they catch a broken packet immediately); run the full suite on the CURE gate only, and say so in both prompts.

## WHAT THIS IS WORTH, HONESTLY
(A)+(B) ≈ 10–15% of a pool. (C) ≈ 5%. (D) ≈ 5–7%. (E) is wall-clock, not tokens. Together perhaps 20–25%, against the chair's earlier claim of 35–40%. The real lever is not here: it is (F), below, which is NOT chartered by this brief.

## (F) NOT IN THIS CAR — recorded so it is not lost
One writer drafting SEVERAL pools of a block in one pass would collapse 12 writer seats a batch into 2 and is worth more than everything above combined. It carries a real quality risk — one hand across six pools breeds echoes ACROSS pools, which no current instrument measures at that grain — and the region arm of wave 2 is the instrument that would catch it. It waits for that arm, and for the chair's word.

## Return
Per commit: COMMIT · FILES · PINS · SHIFT (the concatenation diff proving no card content was lost) · GATE · the exact v3 prompt strings for (B)/(C)/(D)/(E) · HAZARDS · OPEN. Final line: HEAD and `git status --short | wc -l`.
