# D-FOLD-r1 second pass (applied after texts_r1.py): the PL status row's flag count after round 1.
INS = []
def add(file, anchor, text, offset=0, expect=None, id='', table=True):
    INS.append(dict(file=file, anchor=anchor, text=text, offset=offset, expect=expect, id=id, table=table))
add('FOLD', '| [CURED 2026-10-17 (fp-final) — the PL row above, restated after the cure;', id='SEAMS-r1-17 (status of record)', text=r"""
| [AMENDED 2026-10-18 (fp-final r1) — SEAMS-r1-17: the PL row above after round 1; `DESIGN_FP_ARCH_PL.md` header and §8] THE POLITY (PL) | — | as above, plus `vassalageSeatsOf` (W-SEAT's one additive export, the member walk by basis) and the kernel's one outcome fold as the verdict's road (OD-FC-45 ↳) | PL-0..PL-12 entire — NINE virtual flags (`polityHoldEnabled` and `polityBreakEnabled` added in round 1, so PL-1 lights without PL-2's or PL-6's shifts); FOUR persisted shapes, unchanged (round 1 declares only sub-fields, PL §10); round 1: 38 of 38 ids CURED, 0 STOPs (`cure/D-PL-r1.md`); AWAITING ROUND 2 | unchanged |
""")
