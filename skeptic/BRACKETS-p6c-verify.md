# V-BRACKETS-p6c — refuting verifier over P6c lanes A · A2 · B (chair 6eb7b5b6; seat Opus 5.5; 2026-10-20 20:3x–20:5x CDT)

**COUNTS: 140 routes judged (A 62 · A2 51 · B 27) — HOLDS 132 · FAILS 8 · STOP 0 · NEW 1 MAJOR (0 BLOCKING).**

Insertions-only HOLDS for all three lanes, CONFIRMED by execution: `git diff --numstat 8a3061070` (read-only, 20:34 CDT) equals every lane's recorded AFTER figure in all 22 files (OP untracked), and `diff <snapshot> <volume>` shows 0 deleted lines in all 23 files (snapshots: scratchpad `bra/pre`, `brk-a2/pre`, `cure/BRACKETS-B-champions-probe/*.before.md`; A2 snapshot shas re-checked against `sha.txt`). `probe/struct.py`: no table broken, every inserted row's cell count equals its header's. Probe: `skeptic/BRACKETS-p6c-verify-probe/`.

## The table (volume · brackets applied · could-not-place · verdict)
| volume | applied | could-not-place | verdict |
|---|---|---|---|
| CH (B) | 59 lines / 25 routes | 1 (commander arm, correct) | holds; NEW V1 |
| RN (A2 + B) | 25 + 1 lines | 0 | **3 FAILS** (below) |
| OP (B) | 5 | 0 | holds (12:44 quote verbatim; 0.957/0.973/0.990/1.010 match `lean2.out.tsv`) |
| PS (A2) | 32 | 1 (Bound 2, open) | **1 FAIL** |
| PT (A2) | 6 | 0 | **FAIL site** of the telling fail |
| PR · MN · BD · HB · ST (A2) | 23 · 12 · 21 · 11 · 10 | 0 | holds |
| WC · WY · ES · IN · GR · GENERALS · POP · W-SEAT · INT · LG · SP · EP (A) | 19 · 4 · 13 · 4 · 2 · 4 · 6 · 3 · 1 · 2 · 2 · 0 | 11 | holds; **could-not-place #4 FAILS** |

## FAILS
| id | lane · site | why (receipt) |
|---|---|---|
| F1 | A2 · PS l.152 (G.2) + PS §10 l.447 | "requires the army's march row to carry the wing and BANK its `fatigueFloor01`/`groundCap01`" vs MG l.140 "the wing passes under its army's key and has no march row (§6.3)", OD-MG-1, OD-MG-24. RULINGS-P6 §I.1 supersedes l.152 ONLY — **l.447 is not named; lane C must carry it too**. |
| F2 | A2 · RN l.336 (+ PT §7.2 bracket) | "RULED NOT ACCEPTED … learns of a hold only by the roads ransom asked or WR-7d's arrived demand, RULINGS-P6 §D.1" — no ruling says so: D.1 lists "a telling that arrived (RN's `heardAt` test)"; B.1/D-OP-r2 leave it to "RN's P7 row". Contradicts OP §9/§15, CH §14 (lane B: "once RN's P7 row accepts one") and lane A's ES §3.10 bracket. Pre-empts P7. |
| F3 | A2 · RN l.416 | the live `swornDeityOf(paragon)` read (CH-PD-r1-10; already ruled §H.2) — its supersession is F4. |
| F4 | B · RN l.417 (H.2) | "reads only the oath the version it heard carried" — RN's heard row (l.153 `terms`: `ver` "one bit per PT part: act · size · reason · proof · backing · doer", `mag`, the heard doer; THE TRIPLE the re-read key) carries NO oath. Either an undeclared persisted widening (the owner's) or the `doer` bit gating the forbidden live read. |
| F5–F8 | A · could-not-place #4 (EDITOR/EM ×4) | owner named as `DESIGN_EDIT_MODE_AND_DECREES.md`, "`DESIGN_FP_ARCH_EDITOR.md` does not exist" — it EXISTS on master (`docs/DESIGN_FP_ARCH_EDITOR.md`, "LANDED 2026-09-23 … DESIGN_FP_ARCH_* family"; 28 hits for set-levy/set-muster/pin catalogue; FS l.81 cites it "NORMATIVE at master"). The fold INBOX rows must name it. |

## NEW
| id | sev | finding |
|---|---|---|
| BRACKETS-V1 | MAJOR | One lie, two deeds: CH §2.2b's new `false_word` `paragon_act` row ("a false word spoken", 0.30/0.25/0.50) and OP §7.1/RN l.212 `opportunity_act · false_word_exposed` (0.25/0.3/0.5, minted at EXPOSURE). The CH row names no minting moment or witness rule; read as a deed at speaking, a shameful-faced deed travels before the lie is exposed (Law One; the exposure counterforce pre-empted), and a paragon carrier mints both. Route carried faithfully (D-OP-r3; OP §9 says the same) — the seam is the routes'. P7/SEAMS. |

Minor (not counted): ES-1 says errand-less captives "collapse to one, then none"; `custody.out` says both erased at once.

**CONFIRMED vs PLAUSIBLE:** insertions-only, the numstat, F1, F2, F3, F5–F8 and F4's absent carrier are CONFIRMED (executed or quoted at the cited line); F4's consequence and BRACKETS-V1 are PLAUSIBLE (reasoning on quoted shapes, no probe).
