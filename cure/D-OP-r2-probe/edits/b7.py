from lib import apply
pairs = [
(r'''— a `wnpc_` key stamped as a mouthpiece is pruned at the next credibility pass and reads neutral [CURED 2026-10-20 (fp-final P6 r2) — OP-V1]''',
 r'''— a `wnpc_` key stamped as a mouthpiece is NEVER CHARGED (the credibility fold skips a delta whose key the roster does not list: "never resurrect a pruned NPC") and its weight reads neutral — EXECUTED, `cure/D-OP-r2-probe/mouthpiece-key.out` (the durable key: no entry, weight 1; the positional key: charged, weight 0.479) [CURED 2026-10-20 (fp-final P6 r2) — OP-V1]'''),
(r'''and the credibility pass's roster-scan prune drops every key `buildLiveNpcIds` does not list — the errand's durable `wnpc_` id would be pruned at the next pass and read neutral;''',
 r'''and the credibility pass drops every key `buildLiveNpcIds` does not list — its fold skips such a delta outright ("never resurrect a pruned NPC") and the roster-scan prune removes any entry — so the errand's durable `wnpc_` id would never be charged and would read neutral (EXECUTED, `cure/D-OP-r2-probe/mouthpiece-key.out`);'''),
]
apply(pairs, 'b7')
