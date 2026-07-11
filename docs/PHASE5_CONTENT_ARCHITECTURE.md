# Phase 5 — Situational Content Architecture (W2 design contract)

Owner directive (2026-07-11): overabundance of SITUATION-SPECIFIC content — "the guard
captain is compromised because the garrison is underfunded" — across war, economics, faith;
specific to the situation yet generic enough for any campaign.

## The conjunction architecture
Content is keyed to CONJUNCTIONS, not entities: (role x situation x cause).
- ROLES: the institution/NPC role vocabulary (guard captain, high priest, guildmaster,
  magistrate, harbormaster, ...).
- SITUATIONS: the engine's state vocabulary (compromised-covert, compromised-revealed,
  understaffed, underfunded, zealous, desperate, thriving, contested, ...).
- CAUSES: the trace/cause-chain classes the engine ALREADY EMITS (the legibility law's
  receipts become the content selectors): economic (underfunded, chain-starved, depleted,
  trade-strangled), war (levied-away, garrison-drained, siege-scarred, occupation), faith
  (conduct-drift, conversion-pressure, secularization, clergy-scandal), corruption
  (captured, scandal).
The dimensions multiply: ~30 roles x ~12 situations x ~10 cause classes x >=3 variants —
a few thousand authored lines covering a space that feels bottomless.

## The specific-yet-generic rule
Every variant names the MECHANISM structurally, never the setting: template slots
({name}, {institution}, {faction}, {deity}); concrete causation in the prose.
"The garrison's pay has run short three seasons now, and Captain {name} has quietly
started taking {faction}'s coin." Portable everywhere; selected only where true.

## The coverage ladder (pinned)
A coverage test enumerates the ENGINE'S actually-reachable conjunction space (derived from
the state + cause vocabularies, not hand-listed) and asserts every conjunction resolves:
specific variant -> cause-class generic -> role generic. Nothing renders empty; a coverage
gap FAILS THE GATE. Anti-repetition (familyId, drawUnique, Jaccard pins) applies per
conjunction-family; the 0.20%/6.3% repeat gates must be beaten and tightened.

## Downstream
Phase 6's funnel measures which conjunctions DMs copy (feedback widget + generation_id) —
content investment follows demand. The W2 reviewed golden regen carries the multiplication.
