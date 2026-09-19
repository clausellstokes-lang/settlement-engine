---
name: walker-scan-textual-blindness-classes
description: "⚠⚠ TWO WALKER-SCAN BLINDNESS CLASSES (minted 2026-08-09, both bit): (1) a textual source-scan walker CONVICTS a certification manifest that quotes writer source as evidence strings — quoted DATA reads as CODE; cure = mask string-literal CONTENTS while sparing the key's own literal, so quoted-key writes still fire; (2) an injected-seam alias (`service = campaignService`) BLINDS any literal-name census, which silently EMPTIES — cure = DERIVE each file's local bindings (import, lazy destructure, injection default) + a non-vacuity assertion"
metadata:
  type: project
  date: 2026-08-09
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T00:38:16.740Z
---

Minted by the 2026-08-09 walker-red repair lane (three guards freed; details in the
F-SURVEY-1 queue row and that lane's diff on tests/lint/envoyErrandLedgerSingleWriter
.walker.test.js + tests/build/worldStateHydrationIngress.walker.test.js).

## Class 1 — quoted source convicts a data manifest

`ledgerOwnershipManifest.js:44` stores the writer's own body as quoted evidence strings
(`'return { ...state, [ENVOY_ERRAND_LEDGER_KEY]: next }'`). The single-writer walker's
textual write regexes matched INSIDE the string literal → the certification manifest was
convicted as a second writer. **Why:** to a line-scan, quoted data is indistinguishable
from code. **How to apply:** any walker matching write-shaped text must mask string-literal
CONTENTS first — but SPARE the key's own quoted literal so `out['envoyErrands'] = rows`
still fires; preserve newlines inside the mask so per-line scans cannot fuse lines. Keep a
`CERTIFICATION DATA` pin asserting the manifest's quoted evidence rows still exist (the
blind spot must stay earned). ⚠ Pre-existing, unwidened residual: a quoted OBJECT key
(`{ 'envoyErrands': rows }`) is still invisible to the object-property form.

## Class 2 — an injected-seam alias empties a literal census silently

`6e7acc4d` routed the campaign ingress through an injected seam (`service =
campaignService`); the walker census grepping the literal `campaignService.list(` then
matched NOTHING across src — it reported `[]` and only reddened by luck (a non-empty
expectation). In `toEqual([])` shape it would have been a silently disabled guard.
**How to apply:** a consumer census must DERIVE each file's local bindings of the target
(import binding, lazy destructure, injection default) rather than grep one spelling, and
must carry an explicit non-vacuity assertion. Same family as [[filename-anchored-source-pin-vacuity]]
and the S12-W2 delegated-walk arm in [[walker-census-law-machinery]].

## Follow-up owed (green today, vacuous tomorrow)

`worldStateHydrationIngress` test 3 pins `indexOf('hydratePersistedCampaignWorld(campaign)')`,
which matches the function DECLARATION (line 4), not the call site nested in
`migrateCampaign(...)` — an order reversal would keep it green. One-line cure: start the
search from `indexOf('hydratePersistedCampaignRows')`. Recorded in F-SURVEY-1's follow-ups.
