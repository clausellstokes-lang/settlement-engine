# POOL RATES — the unmeasured third of the resolved corpus

**IN PROGRESS — this file is rewritten as the measurement lands. The last line says what is
measured and what is not.**

Seat: Opus MEASURER. Read-only against the DEF-2 dock `laneRW-DEF2` @ `49183bafe`
(`git status --porcelain` = 0 lines at the read). Nothing was written, staged or committed
in the dock.

## STATUS AT THIS WRITING

- The instrument is found: `scripts/prose-rate-corpus.mjs` → `rateTable()`, folded into the
  census by `scripts/wiring-census.mjs --rates`.
- Determinism CONFIRMED (two runs at the dock tip, 273 rows, zero differences).
- The reproduction check against the census's own `rate` block is RUNNING.

NOT YET MEASURED: the 134 resolved pools that carry no `rateBp`.
