---
name: zsh-modifier-and-binary-stdin-corrupt-per-commit-censuses
description: "TWO silent measurement-corruption bugs that BOTH bit in one gate-repair lane (2026-08-07), both producing plausible WRONG per-commit numbers at exit 0: zsh applies a history-style `:s` MODIFIER to \"$c:src/...\" so `git show` silently reads a MANGLED rev; and `git show | grep -c` on a file grep deems binary returns 0 matches. Cure: `\"${c}:${p}\"` braced, and `grep -a` on a written file."
metadata:
  type: project
  created: 2026-08-07
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T10:57:15.503Z
---

# Two ways a per-commit census invents numbers, at exit 0

Both bit inside ten minutes while attributing an any-cast ratchet overrun to
its causing commit. Each alone produces a **non-monotonic, entirely plausible
looking** table of per-commit counts. Together they produced a table in which
HEAD read 0 for a file the live tree measured at 3.

## 1. zsh eats `:src/...` as a parameter MODIFIER

```sh
for c in eca65c8a e0c8646e 9ecec2a2; do
  git show "$c:src/domain/worldPulse/npcLadderKernel.js"   # ⛔ WRONG
done
```

zsh supports history-style modifiers after a parameter expansion. In
`"$c:src/domain/worldPulse/npcLadderKernel.js"` it parses `:s` as *substitute*,
takes the next character `r` as the delimiter, and applies
`s/c\/domain\/worldPulse\/npcLadde//` to `$c`. The rev handed to git becomes
`eca65c8aKernel.js`. **Double quotes do not stop it** — the modifier is part of
the expansion, not of word splitting.

The tell is the git error `fatal: ambiguous argument 'eca65c8aKernel.js'`, which
is trivially hidden by the `2>/dev/null` everyone writes in a census loop. With
stderr suppressed the loop yields a full table of zeros and stale values.
A literal `git show "HEAD:src/..."` works, which makes the bug look impossible:
the failure needs a `$parameter` immediately before the `:`.

**Cure:** brace the expansion — `git show "${c}:${p}"`. Brace it in every
`ref:path` construction, not only the ones that have visibly failed.

## 2. `git show <blob> | grep -c` returns 0 on "binary" input

```sh
n=$(git show "${c}:${p}" | grep -c 'type {any}')   # ⛔ can be 0 while true count is 3
```

When grep decides stdin is binary it stops counting and returns 0 — exit 0, no
warning. The same bytes written to a file and read with `grep -a` counted 3.
The file contained **no NUL bytes at all** (`perl -0777 ... tr/\000//` = 0), so
"it must have a NUL" is not a reliable screen; some other byte sequence was
enough. Same family as [[shared-tree-fpg3-and-grep-nul-gotcha]], but triggered
through a PIPE rather than by a NUL.

**Cure:** in any census, `git show "${c}:${p}" > "$SCRATCH/blob"` first, then
`grep -a` the file. Never pipe a blob straight into a counting grep.

## How to apply

Before trusting any per-commit table you generated in a loop:

1. **Check monotonicity.** A count for a stable file that goes 0,2,0,0,1,0
   across sequential commits is not history, it is a broken harness. Real
   per-file debt moves in steps and stays put.
2. **Anchor on a known value.** Compute the same figure for HEAD via the loop
   AND directly against the working tree. If they disagree, the loop is wrong —
   the working tree is not.
3. Use the exact counter the ratchet uses (`countText` from
   `scripts/count-domain-any.mjs`) on the written blob, not a hand-rolled grep
   regex, whenever the number will be quoted in a commit or a ledger.

This is the same failure mode `scripts/ratchet-inventory.sh` was built to end —
hand-built censuses that report figures matching neither end — reappearing one
layer down, in the shell that feeds the census.
