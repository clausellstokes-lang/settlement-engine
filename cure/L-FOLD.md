# L-FOLD — the chair's rulings applied to the coherence fold, the spine §1 and CN (lane L-FOLD, chair a73343ed; seat Opus 5.5; 2026-10-17 20:35–20:48 EDT)

**OUTCOME.** Every item of the brief (§1 to CN) is applied. I added 171 whole lines across the three chair-owned files and changed or deleted none. Nothing is staged or committed. Every bracket is dated `2026-10-17 (fp-final)` and names its source: the ruling file and item, or the volume § and OD row. I wrote the lines with an anchored script, `scratchpad/lfold/{apply.py,texts.py}`, and each anchor matched exactly one line. A bracket beside a table row sits in a new row directly beneath it (`↳`), so every table still renders. The recount after insertion, CONFIRMED: §3.4 holds 70 kind names in 65 live rows.

**NUMSTAT** (`git diff --numstat`, 20:48 EDT; zero deletions in each file):
```
2	0	docs/DESIGN_FP_ARCH_CN.md
166	0	docs/DESIGN_FP_COHERENCE_FOLD.md
3	0	docs/DESIGN_FP_SPINE.md
```

| Section | Rows / blocks added | Brackets added |
|---|---|---|
| fold §1 | — | 5 (req-12 pointer, 16, 19, 21(a), 24) |
| fold §2 | 3 (RN, CH, PT) | 2 (PL, MN restated) |
| fold §3.1 | 2 (3.1.22 ONE PERSON STAGE, 3.1.23 CHOOSER'S CAR) + INBOX (GR · WC · ES · SP-D · EC-6) | 2 (3.1.1, 3.1.10) |
| fold §3.3 | 2 (3.3.12 actor kinds, 3.3.13 ransom) | — |
| fold §3.4 | 26 (3 PL, 9 CH, 14 PT) + count line | 11 (siege, ransom, fealty_question, 6 PL renames/amendments, menace_siege, menace_met) |
| fold §5 | 49 token rows + 1 marker row | 6 (hold words, polity war, might, course, states, chains) |
| fold §6 | 4 (C0.5, C11, C12, C13) + THE ORDER NOTE | 5 (intro, C8, C9, C10, slot row) |
| fold §7 | 15 (OD-FC-47..61) | 4 (header, OD-FC-19, 45, 46) |
| fold §8 / §9 | the 2026-10-17 block / §9.6 placeholder | — |
| SPINE §1 | — | 3 (12, 21(a), 24 + the count) |
| CN | — | 2 (cn-5, its flag row) |

**WHAT THE CHAIR MUST READ.** (1) RN, CH and PT have no coupling line of their own. The 21(a) carriers I wrote for them (RN: INFO · INTERIOR · FAITH · GRAMMAR; CH: all seven layers; PT: INFO · INTERIOR · GRAMMAR) are my reading of their seam tables and are marked PLAUSIBLE. (2) Five volume-side gaps are left for their disposition lanes, because those files are not mine:
- MN's OD-MN-21 and its §8 still gate non-sworn relief on `allyDefenseEnabled`, against the ruling that relief runs under `menaceResponseEnabled` alone.
- RN §2.1 still uses the old proof words (`kept · told · shown`).
- CH has not yet applied STOP-CH-1 (A) (`seized`, OD-CH-11), and its §6.2 still cites `menace_strikes · repelled · breached`.
- PL's OD-PL-22/23 still read as STOPs.
- CH's verdict `stand_off` repeats `armies_meet`'s option on the same docket surface.

(3) I found four homonyms that no volume had registered and registered them in §5: `presentAt`, `spoken`/`unspoken`, `polarity` and `domain`. (4) The ODQ §934.93 visible row (OD-FC-50) is the chair's to write. (5) I did not run the docs proof: it writes into the shared master worktree while P3 seats read it, and it belongs to the chair's P4.

**CONFIRMED vs PLAUSIBLE.** CONFIRMED by execution: zero deletions, the 65/70 registry recount, one match per anchor, and the four `rg` facts in §2 below. PLAUSIBLE: the RN/CH/PT carrier layers, and the volume sizes stamped at 20:35 (P3 disposition may change them).

---
## Appendix §1 — read
Kit README; briefs COMPILE-COMMON, CHAIR-NOTES-FOR-THE-FOLD, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH, RULINGS-AFTER-COMPILE, OWNERSHIP, BOARD; the fold §0–§9 whole; SPINE §1; CN cn-5 and §3; the five volumes' header, ontology/token, hearings, flags, waves, rulings, DM-reads and stops sections; cure logs L-PL and L-MN whole, plus the stops, tokens and open questions of L-RN, L-CH and L-PT.

## Appendix §2 — measured on master `81f1cd963` (read-only; CONFIRMED by `rg`)
- `strategicPosture.js :: POSTURE_ACTOR_KINDS = Object.freeze(['settlement'])`.
- `ransomChoices.js :: HOME_ANSWERS = Object.freeze(['pay', 'refuse', 'abandon'])` and `ABANDONMENT_GRIEVANCE_KIND = 'abandoned_to_captivity'`.
- Free tokens (no word or literal in src): `paragon`, `waned`, `staunch`, `paramount`, `polityHold`, `partyView`, `declaredStance`, `callBoard`, `liaison`, `covertHire`, `rendezvous`, `champion_duel`, `wanderlust`, `inherentValue`, `fated`, `frail`, `fallible`, `wildland`, `ACT_OFFICE`, `fealty_break`, `narrowed_sphere`. `renown` has one prose hit.
- New homonyms:
  - `presentAt: 0.15` is a key in `suspicion.js`.
  - `spoken` and `unspoken` are keys in `espionage/operationsVoice.js`.
  - `polarity` is a key in `canonRelationshipImpact.js` and `causalState.js`.
  - `domain` is a field in `deitySnapshot.js` and a modifier in `qualitativeBands.js`.
- No inserted line contains `enforcement-claims`' CLAIM_RE vocabulary or an `@enforced-by` tag. `tradeConvergenceContract`'s spine phrases are untouched.

## Appendix §3 — could not place
Nothing from the brief went unplaced. The fold had no "thirty-one" count sentence; that sentence was in the spine's 10-16 bracket, so the new count is a line under §3.4 and a note in the spine's bracket.
