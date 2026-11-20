# REVIEW-VEIL-10 probes (Phase 1B, at bedd5a392)

Each probe states its method in its head comment. Run: `RV6_SRC=<worktree> [RV10_DB=… RV10_TPL=x212 RV10_OUT=…] ./run.sh <probe> <log>`
(local PostgreSQL on the unix socket `/var/tmp/rv7`; chains by REVIEW-VEIL-6's `native/chain.sh`; pg@8.13.1 in `/var/tmp/v16/pgmod`).

| Probe | Finding / check | Output |
|---|---|---|
| chronicle.probe.jsx | V10-1 (and V10-4's row) | out/chronicle-new.json, out/chronicle-x211.json |
| tile.probe.jsx | V10-3 | out/tile-new.json |
| closed.probe.jsx | V8-9's closed answer; V10-3 beside it | out/closed-out.json |
| switch.probe.jsx | V10-2; Hide all; a town changed after Show all | out/switch-new.json |
| gaps.probe.jsx, trace.probe.jsx | V10-6 | out/gaps-new.json, out/trace-out.json |
| v82.probe.jsx, v82b.probe.jsx (control), dbg82.probe.jsx, unstamped.probe.jsx | V10-5 | out/v82-out.json, out/v82-norename.json, out/dbg82.json, out/unstamped-new.json |
| timing.probe.jsx | V10-7 | out/timing-new.json |
| dangling.probe.jsx | V8-5's class (vacuous at this tip) | out/dangling-new.json |
| ids.probe.jsx, counts.mjs | ids and counts | out/ids-out.json |
| doors/ | every function a non-owner may call (`doors-x212.txt`), RLS (`tables-x212.txt`), the definitions read | — |
