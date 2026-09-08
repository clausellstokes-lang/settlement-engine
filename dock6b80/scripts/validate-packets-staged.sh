#!/bin/sh
# validate-packets-staged.sh — the pre-commit binding for the packet surface.
#
# THE GAP THIS CLOSES (ODQ §354.2, ruled §364 R2): the manifest's row-integrity
# joins — including the verifiedBase join that convicted the MF-T2E incident, where
# a blanket `sed` repointing one packet's base silently rewrote a sibling's row —
# are UNCONDITIONAL on status. The validator would have caught that corruption at
# DRAFT. It simply never ran: `validate:packets` lives inside gates, and DRAFT-stage
# work owes no gate, so the bad row committed and waited for the next gate to find
# it. The blind spot was WHEN the check runs, not WHAT it checks.
#
# lint-staged appends the staged filenames to this command. They are deliberately
# dropped: the CLI takes exactly one argv ("validate") and hard-rejects extras, and
# the validator's subject is the WHOLE manifest — a sibling's row is exactly what a
# staged-slice-only check would miss. File reads only; no build, no vitest, so the
# hook's ~1s contract survives and the cost is paid only when the packet surface is
# actually staged.
exec node scripts/implementation-packets.mjs validate
