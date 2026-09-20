# FIX-P2 raw receipts (read-only walk, lane dev server :5233, read tip 5a3380e8d)

## R1 — two saves from ONE seed (the exact-seed door), both in ONE realm
localStorage `dnd_settlement_saves` after two "Forge seed: fixp2-alpha" → "Save to Library":
[{"saveId":"1789894750514","sid":"s_08299edf32384bbc","name":"Niederstadt","seed":"fixp2-alpha","pop":692},
 {"saveId":"1789894703388","sid":"s_08299edf32384bbc","name":"Niederstadt","seed":"fixp2-alpha","pop":692}]

## R2 — the campaign after "Add to FIXP2 Realm" on both
{"campaigns":[{"id":"80ca239c-e8a1-4903-bc25-f50ac0389967","name":"FIXP2 Realm",
  "members":[1789894750514,1789894703388]}]}

## R3 — "Discover regional channels" → the realm graph's node keys
nodes: [{"id":"1789894750514","settlementId":"s_08299edf32384bbc","name":"Niederstadt"},
        {"id":"1789894703388","settlementId":"s_08299edf32384bbc","name":"Niederstadt"}]

## R4 — a real advance (both members canonized, Advance by Month)
{"tick":8,"tickStateKeys":["1789894750514","1789894703388"],"pulse":2}
settlementTickStates: {"1789894750514":{...},"1789894703388":{...}}   ← two independent records

## R5 — the fork arm (the product's own fork door, signed in)
Fork "Mossgate" twice as the same account (mock-fixp2-lane):
 fork 1 → {"id":"s_c428e8848a3fd616","seed":"mossgate-004-mock-fix","name":"Mossgate","pop":3553}
 fork 2 → {"id":"s_c428e8848a3fd616","seed":"mossgate-004-mock-fix","name":"Mossgate","pop":3553}
saves: 1789895282594 and 1789895242218, both sid s_c428e8848a3fd616

## R6 — four members, two twin pairs, one realm
members:[1789894750514,1789894703388,1789895282594,1789895242218]
nodes  : 4, each id = a save id, each carrying the twin-shared settlementId
edges  : 10, all keyed by save-id pairs, e.g. edge.1789895282594.1789895242218 (Mossgate↔its twin)
channels: 26 suggested, all keyed by save-id pairs, e.g.
          channel.trade_dependency.1789895282594.1789895242218.salt
