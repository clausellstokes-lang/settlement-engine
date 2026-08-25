---
name: authored-prose-is-bound-by-the-world-law
description: "⚠️⚠️ AUTHORED variant prose is CONTENT and is audited by generationCoherence's world law — a `port.riverside` origin variant saying 'sea traffic' dropped the whole dossier to needs_review; and the 525-key golden has NO port×riverside row, so it cannot catch that class at all"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-04T00:43:21.091Z
---

**THE INCIDENT (lane RR, 2026-08-03, commit 21bf1041).** Widening
`generateSettlementReason` into per-arm variant pools, two first-draft
`port.riverside` sentences read *"barge traffic rather than sea traffic"* and
*"the wharves face a current instead of a tide"*. An inland river port has **no
maritime capability** (`generationContext.createGenerationWorldLaw`: maritime
needs `terrainType === 'coastal'`, or a `port` route on non-riverside terrain),
so `generationCoherence` raised **"Maritime claim without coastal or ocean-going
capability."** on `settlementReason[0]` and the ENTIRE
`generationCoherenceReceipt` fell to `needs_review` —
`tests/generators/generationWorldLaw.test.js` went red on a settlement whose only
fault was one authored sentence. Two more variants carried no river-port token
and would have reddened the same audit's `/river port|barges/i` assertion on
whichever seed selected them.

**THE LAW.** Authored prose is CONTENT, and content is bound by the world law
exactly as generated claims are. The banned lexicon is
`MARITIME_ASSERTION_PATTERN` in `src/generators/generationContext.js:49`:
`deepwater|maritime|naval|ocean-going|seagoing|sea-going|seaport|war-vessels?`,
plus `coastal <districts|ports|raids|shipping|trade|waters>` and
`sea <access|lanes|power|raids|supply|trade|traffic|voyages>`. It is
**capability-relative, not a word ban** — the coastal arm's own pre-existing
sentence *"A coastal seaport…"* is lawful there and unlawful one arm over.

**⚠️⚠️ AND THE GOLDEN CANNOT SEE IT.** The 525-key
`generator-golden-master.json` corpus has **NO port × riverside row**: its
riverside rows take the `river` route (`TERRAIN_ROUTE`) and its port rows take
coastal terrain. The violation above passed the golden and was caught only by the
world-law test. Adding a row is a golden ADDITION → owner-signed (precedent
`aa33eba5`); recorded as J-RR-5 in FABLE_VALIDATION_QUEUE.md.

**HOW TO APPLY.** Before adding ANY authored variant to a route/terrain-keyed
pool: run every variant through the REAL `createGenerationWorldLaw(cfg,
{tradeRoute, terrainType}).allowsMaritimeClaim` for that arm's own config, and
carry a negative control proving the predicate bites. The pin set is
`tests/generators/settlementOriginProse.test.js` ("RR law 5"), which also runs a
96-generation real-pipeline sweep asserting no arm raises a `settlementReason`
coherence finding. Do not trust the golden to catch a content defect: a hash
manifest only covers the configs someone thought to enumerate.
