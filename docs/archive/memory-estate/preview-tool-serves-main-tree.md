---
name: ""
metadata: 
  node_type: memory
  created: 2026-07-18
  type: hazard
  status: active
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

# The Browser preview tool serves the MAIN tree, not the agent worktree

**What:** During the S7 lane (2026-07-18), `preview_start` with launch.json's `dev`
config started vite rooted at `/Users/cstokes/Desktop/settlement-engine` (the main
tree, on the LEDGER branch `review-fixes-2026-07-08` — which has no src/ app code from
the engine lineage). The page loaded a stale/foreign app; the lane's new components
were absent; every path probe returned the SPA index fallback. Recurrence #10 of the
wrong-lineage-worktree-trap class, via a NEW vector.

**Why it bites:** the failure is silent — the app renders and looks real; only a
missing feature reveals it. Diagnostic that settles it in one call:
`curl -s localhost:<port>/src/<a-file-only-your-lineage-has> | head -3` — index.html
fallback ⇒ wrong root.

**How to apply:** for live verification inside an agent worktree, run
`npx vite --port <fresh> --strictPort` via Bash `run_in_background` (needs
`dangerouslyDisableSandbox: true` — the sandbox blocks listening sockets; a sandboxed
vite dies instantly with an empty log), then `navigate` the Browser pane to that port.
Verify the served lineage with the curl probe BEFORE trusting anything on screen.

**Related:** [[wrong-lineage-worktree-trap-2026-07-14]] (the class),
[[worktree-npmci-eusage-node-modules-walkup]] (agent worktrees may have an EMPTY
node_modules dir and resolve by walk-up to the main tree — a tmp-dir git worktree has
no walk-up, so symlink the MAIN tree's node_modules into it for temp-worktree builds).
