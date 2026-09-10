# -*- coding: utf-8 -*-
# mk-design-907.py — the §907 DESIGN_HORIZON.md amendment: ONE line (§2.5 C4′ clause (4)) gains a dated ⟦CHAIR-AMENDED §907⟧ mark
# stating what HORIZON-B6 measured at 4243bdc61. In-place, the document's own convention (⟦INTEGRATOR-AMENDED …⟧). Refuses unless the
# anchor is found exactly once; asserts one line changed and the line count unchanged. Input: design-horizon.head.907.md (= git show HEAD:docs/DESIGN_HORIZON.md).
import io,sys
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/'
src=io.open(SC+'design-horizon.head.907.md',encoding='utf-8').read()
ANCHOR="(4) the pre-lighting plateau evidence CITED in the row: the interim `research-lit-4s` 300 y × 4 s receipt run manually from SOAKCHAIN Car 4's profile (≈ 2.3 h; `plateau` shapes, `bifurcated` 0)"
assert src.count(ANCHOR)==1, src.count(ANCHOR)
MARK=" ⟦CHAIR-AMENDED §907, 2026-09-07 — MEASURED by HORIZON-B6 at 4243bdc61 (`$SC/receipt-horizon-b6.md`): the interim receipt ran in 25 m 43 s, not ≈ 2.3 h (run A 762.3 s = 0.635 s/settlement-year against the 3.5 s estimate); `runawayCount` 0, `flooredCount` 0, `bifurcated` 0 HOLD and `realm population bounded` PASSES (21844 → 12289), but the `plateau` shapes do NOT — all four settlements read `other` (the realm is still +26 % over its last fifty years at year 300) and `capacity_realm_load` fired at 0.4787, so the genesis cell stays UNFROZEN by its own door. This clause may be cited for the runaway cure, never for plateau shapes; the plateau question is CAP-7's at the sitting⟧"
out=src.replace(ANCHOR, ANCHOR+MARK, 1)
assert out.count('CHAIR-AMENDED §907')==1
assert out.count('\n')==src.count('\n'), (out.count('\n'), src.count('\n'))
diff=[1 for a,b in zip(src.split('\n'),out.split('\n')) if a!=b]; assert len(diff)==1, len(diff)
io.open(SC+'design-horizon.907.md','w',encoding='utf-8').write(out)
print('design-horizon.907.md written: +%d chars, 1 line changed, %d lines'%(len(out)-len(src), out.count('\n')))
