---
name: validate-packets-existence-checks-landed-create-rows
description: "⭐ Since e1e9fd6a (2026-08-11), `npm run validate:packets` existence-checks every CREATE path of a LANDED packet — a packet flipping to LANDED must first reconcile draft path spellings to the real landed files, or the validator reds naming the packet and path"
metadata:
  type: project
  date: 2026-08-11
  sha: e1e9fd6a
  branch: claude/composite-r4
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-11T19:39:45.316Z
---

Before `e1e9fd6a`, a CREATE row was never existence-checked, so a landed packet's
manifest row could be fiction forever — TC-5A's row named three never-existent draft
paths (plus the same phantom in its `checks` argv) from landing until this repair, and
`validate:packets` stayed green throughout. The guard-live proof: exit 0 (invisible) →
validator change alone → exit 1 naming EXACTLY TC-5A and its three paths and nothing
else → row corrected from `git show --stat 41b39220 --diff-filter=A` → exit 0. The new
guard is mutant-tested (disabling it reds exactly one test).

**Why:** a manifest that says what a packet created is a record consumers trust
(promotion decisions, path reservations, collision checks); an unchecked CREATE row is
a disabled guard wearing a manifest's name.

**How to apply:** when flipping any packet to LANDED, reconcile its CREATE rows (and
its `checks` argv) to the real landed paths FIRST — derive them from the landing
commit's `--diff-filter=A`, never from the draft. ⚠ The INVERSE guard (a nonterminal
packet's CREATE paths must NOT already exist) is deliberately NOT built — it would red
on legitimate path reuse and READY-mid-flight dirt; recorded deferral at `e1e9fd6a`,
needs its own design. Related: [[implementation-packet-dispatch-system]].
