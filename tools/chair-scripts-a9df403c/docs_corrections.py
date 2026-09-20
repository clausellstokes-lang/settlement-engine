# -*- coding: utf-8 -*-
"""The chair's owed docs corrections on the build branch (the prior chair's 20:18 record): EM-B1d's flip note carried a
FALSE cause (retracted in ODQ §934.47 addendum 32); the standard's hot-file list is stale (convergence.js) and incomplete
(institutionLifecycle.js — ODQ §934.47 addendum 28). Run from the consist worktree ON the branch, tree clean.
argv: <convergence effective lines> <institutionLifecycle effective lines> <measured-at sha>"""
import io, sys

conv, inst, at = sys.argv[1:4]
conv_i, inst_i = int(conv), int(inst)
assert 0 < conv_i < 800 and 0 < inst_i <= 800

STD = "docs/implementation/PACKET_STANDARD.md"
u = io.open(STD, encoding="utf-8").read()
old = "| `src/domain/worldPulse/convergence.js` | 798 | 800 | 2 |"
assert u.count(old) == 1, u.count(old)
new = ("| `src/domain/worldPulse/convergence.js` | %d | 800 | %d |\n"
       "| `src/domain/worldPulse/institutionLifecycle.js` | %d | 800 | %d |") % (conv_i, 800 - conv_i, inst_i, 800 - inst_i)
u = u.replace(old, new, 1)
anchor = "⚠ The measurement is what earned the row: `convergence.js` rebinds a short local six"
assert u.count(anchor) == 1, u.count(anchor)
note = ((
    "⭐ Re-measured 2026-09-20 by the chair at `%s` with eslint's own `Linter` (`max-lines`, `skipBlankLines` and `skipComments`): `convergence.js` reads **%d** "
    "(the 798 above stood from 2026-08-14; EM-R6's compile lane noticed the drift), and `src/domain/worldPulse/institutionLifecycle.js` JOINS the list at **%d** of 800 — "
    "EM-B1h's compile found it within a handful of lines of its ceiling with no `scripts/.size-baseline.json` row and no door (ODQ §934.47 addendum 28); EM-B1a's pre-proof, "
    "the next packet likely to reach into it, prices the extraction. ⚠ `src/domain/worldPulse/pulseKernel.js` sits at EXACTLY its ceiling (1581 of 1581) but carries a "
    "`scripts/.size-baseline.json` row, so that register governs it, not this list — EM-B1k is contracted net-zero against it.\n\n") % (at[:9], conv_i, inst_i))
u = u.replace(anchor, note + anchor, 1)
io.open(STD, "w", encoding="utf-8").write(u)

PKT = "docs/implementation/packets/settlement-editor/EM-B1d.md"
s = io.open(PKT, encoding="utf-8").read()
old = "a file that uses vitest GLOBALS and is therefore PARKED by the census (`OPENER_UNRESOLVED`): its titles count nowhere"
assert s.count(old) == 1, s.count(old)
new = ("a file the census PARKS for eleven unregistered-registration and three non-straight-line reasons (measured by the cure lane at `e5bdfd031` with the walker's own "
       "`parkReasonsFor`; ⛔ the cause first recorded here — 'vitest globals, `OPENER_UNRESOLVED`' — was FALSE and is RETRACTED: 0 of the estate's 2,649 test files lack "
       "the `'vitest'` import, executed by the chair; ODQ §934.47 addendum 32; crediting that file is FIX-L2's): its titles count nowhere")
s = s.replace(old, new, 1)
io.open(PKT, "w", encoding="utf-8").write(s)
print("docs corrections applied: hot-file list (convergence %d, institutionLifecycle %d); EM-B1d's flip note retracted" % (conv_i, inst_i))
