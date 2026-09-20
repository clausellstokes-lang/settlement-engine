# -*- coding: utf-8 -*-
"""Memory: the owner's restated lane law (2026-09-19 17:05) — the topic's description line and the index's FOLD 109 row."""
import io, re, sys

M = "/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine/memory/"

# 1) the topic's description (frontmatter line 3) — replace the whole line, whatever its exact bytes
p = M + "owner-directive-2026-09-18-only-four-agents-at-a-time-for-machine-load.md"
t = io.open(p, encoding="utf-8").read()
lines = t.split("\n")
idx = [i for i, ln in enumerate(lines[:8]) if ln.startswith("description:")]
assert len(idx) == 1, idx
lines[idx[0]] = ('description: OWNER 2026-09-18 "only 4 lanes working at a time to maintain load" (raised to FIVE the same day; '
                 'RESTATED 2026-09-19 17:05 — FIVE SEATS = FOUR WORKING LANES + ONE GATE/SUITE SEAT) — a HARD ceiling on agents of ANY kind '
                 '(build, recon, survey, compile, verification) AND a floor the owner expects used; a build waiting on a gate pauses and its seat '
                 'goes to the next queued lane')
io.open(p, "w", encoding="utf-8").write("\n".join(lines))

# 2) the index row of FOLD 109 — by LINK TARGET, never by line number
ip = M + "MEMORY.md"
u = io.open(ip, encoding="utf-8").read()
rows = [ln for ln in u.split("\n") if "(archive-2026-09-19-index-fold-109.md)" in ln]
assert len(rows) == 1, len(rows)
old = rows[0]
assert "AT MOST FIVE AGENTS" in old
new = old.replace("AT MOST FIVE AGENTS", "FIVE SEATS = FOUR WORKING LANES + ONE GATE SEAT (restated 09-19 17:05; the four are a FLOOR — pipeline lanes AHEAD of the slot)")
u = u.replace(old, new, 1)
io.open(ip, "w", encoding="utf-8").write(u)
print("bytes:", len(u.encode("utf-8")))
