---
name: wizard-news-id-token-skews-mover-family
description: "Every wizard-news id contains the token \"news\", so moverFamilyOf classifies EVERY id-carrying news entry as `knowledge` — a shared family, never dispositive for a certification row"
metadata: 
  node_type: memory
  type: reference
  originSessionId: d93acdaf-1b3e-47b1-b554-27e20fc872f7
  modified: 2026-08-01T01:44:58.224Z
---

`moverFamilyOf` (`scripts/audit/behavioral-observation.mjs`) concatenates the record's
**id** into its match text alongside candidateType / ruleFamily / impactKind / kind, then
returns the FIRST family whose token list hits. The house id convention is
`wizard_news.<tick>.…`, which contains the token `news` — a `knowledge` family token.

**Consequence (measured 2026-07-31):** every id-carrying wizard-news entry in the tree
falls into `knowledge` unless an earlier-listed family matches first. Verified by probe:

- `{kind:'momentum_climb_down'}` with no id → `null`
- the same record with id `wizard_news.5.momentum_climb_down.a.b` → `knowledge`
- the same record with id `wn.5.momentum_climb_down.a.b` → `null`
- `{kind:'webwar_raid'}` → `war` (the `raid` token matches before `knowledge`)

**Why it matters:** it is tempting, after making a subsystem's receipts flow, to declare
`moverFamilies` on its certification row. Do not. The `knowledge` reading is an artifact
of the id convention shared by the whole estate, so it is NOT dispositive for any single
row — the same reasoning the generosity row is already held to ("generosity cannot ride
its shared families to ALIVE", pinned in `tests/domain/subsystemRowsEconomy.test.js`).

**How to apply:** when a row's `aliveness` is being written, keep `moverFamilies` empty
unless the family is genuinely specific to that subsystem. Also keep `eventTypes` empty
for news-only subsystems: `eventTypes` names PULSE EVENT types counted in a receipt's
`eventTypeCounts`, and a wizard-news receipt is not a pulse event — a distinct channel.

Context: [[idless-wizard-news-drop-class]].
