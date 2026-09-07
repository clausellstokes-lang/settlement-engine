# -*- coding: utf-8 -*-
# mk-design-911.py — the §911 DESIGN_HORIZON.md amendment: THREE lines (the terminal-soak row in §11's schedule table; CAP-10; SOAK-1)
# each gain a dated ⟦CHAIR-AMENDED §911⟧ mark stating what CAP-HORIZON-909 measured at 3b1c0eaa5. In-place, the document's own
# convention (⟦INTEGRATOR-AMENDED …⟧, ⟦CHAIR-AMENDED §907⟧). Refuses unless every anchor is found exactly once; asserts exactly three
# lines changed and the line count unchanged. Input: design-horizon.head.911.md (= git show HEAD:docs/DESIGN_HORIZON.md).
import io,sys
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/'
src=io.open(SC+'design-horizon.head.911.md',encoding='utf-8').read()
EDITS=[
 ("≈ 35 h of owner soak wall-clock in total, which SOAK-1 now asks plainly",
  " ⟦CHAIR-AMENDED §911, 2026-09-07 — PRICED BY MEASUREMENT (CAP-HORIZON-909 at 3b1c0eaa5, `$SC/receipt-cap-horizon-909.md`): the 300 y × 12 s LIT cell ≈ 1.9–2.4 h, its DARK twin ≈ 2.1–2.7 h (a FLOOR — the dark 12-settlement world grows ×1.23 per thirty years where the lit one contracts), the total ≈ 4.0–5.1 h, not ≈ 35 h; PLAUSIBLE — a separable cost model from five measured runs, the band being the seed spread; see SOAK-1⟧"),
 ("re-run the 300 y × 12 s LIT cell after the retune (≈ 17.6 h on this Mac, before push",
  " ⟦CHAIR-AMENDED §911, 2026-09-07 — measured-priced ≈ 1.9–2.4 h by CAP-HORIZON-909 (PLAUSIBLE, separable model); the DARK twin is not re-run at a retune⟧"),
 ("or take the interim 4 s cell (≈ 2.3 h) as the signing evidence with the 12 s cell post-launch?",
  " ⟦CHAIR-AMENDED §911, 2026-09-07 — RE-PRICED BY MEASUREMENT (CAP-HORIZON-909 at 3b1c0eaa5): the interim 4 s cell runs in 25 m 43 s (§907); the 300 y × 12 s LIT cell ≈ 1.9–2.4 h and its DARK twin ≈ 2.1–2.7 h (a floor), so the terminal soak's whole ask is ≈ 4.0–5.1 h of wall-clock on this Mac, seven to nine times less than ≈ 35 h (PLAUSIBLE: five measured runs; the settlement term ×1.482 from 4 to 12 at 30 y, the horizon term ×1.179 per doubling inside one world, the cross term unmeasured, the band the seed spread). The recommendation — the 12 s cell, signed against the plateaued tree — stands at a seventh of the price; the soak stays MANUAL and AFTER the walk (the 08-06 sequencing law)⟧"),
]
out=src
for anchor,mark in EDITS:
    assert src.count(anchor)==1, (anchor[:60], src.count(anchor))
    out=out.replace(anchor, anchor+mark, 1)
assert out.count('CHAIR-AMENDED §911')==3, out.count('CHAIR-AMENDED §911')
assert out.count('\n')==src.count('\n'), (out.count('\n'), src.count('\n'))
diff=[1 for a,b in zip(src.split('\n'),out.split('\n')) if a!=b]; assert len(diff)==3, len(diff)
io.open(SC+'design-horizon.911.md','w',encoding='utf-8').write(out)
print('design-horizon.911.md written: +%d chars, 3 lines changed, %d lines'%(len(out)-len(src), out.count('\n')))
