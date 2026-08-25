---
name: vitest-list-json-clobber
description: "NEW silent-clobber family member (2026-08-06, bit live + reproduced): bare `vitest list --json <path>` consumes the NEXT POSITIONAL as the output path and OVERWRITES that file silently, exit 0 — always spell --json=<path>, path OUTSIDE the repo"
metadata:
  type: project
  created: 2026-08-06
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
---

# `vitest list --json <path>` destroys the next positional argument

`--json` takes an OPTIONAL value. The space-separated form
`npx vitest list --json tests/foo.test.js tests/bar.test.js` consumes
`tests/foo.test.js` as the OUTPUT path and overwrites that tracked source
file with collection JSON — silently, exit 0. It truncated SP-B2's evidence
file (836 → 41 lines) in the cap lane, and the arc verifier reproduced it on
a sentinel in a disposable tree.

**How to apply:** always `--json=<path>` (equals form), always to a path
OUTSIDE the repository. The only tell is `git status --porcelain` — run it
immediately after any vitest-CLI invocation with flags that take optional
values. Restore via `git show HEAD:<path> > <path>` (never the checkout
family), verify with `cmp`. Same family as [[authored-nul-byte-in-agent-edits]]
and [[shared-tree-fpg3-and-grep-nul-gotcha]]: silent, exit-0, tracked-file
damage whose only witness is git.
