---
name: news-address-law
description: "Owner doctrine 2026-07-22 — every news item carries a fully-qualified subject address (settlement → power → faction → NPC), the action/state change, affected settlement(s), and the reason"
metadata: 
  node_type: memory
  type: project
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T07:20:56.245Z
---

# THE NEWS ADDRESS LAW (owner doctrine, 2026-07-22)

Owner's words: "essentially every piece of news needs to carry a subject, the action that they did
or something that changed regarding their state. and every piece of information needs to also
specify which settlement or settlements are effected. if it is several levels deep such as an NPC,
then you need to list all of the levels/orders" — example: "Jirak's (settlement) Religious
Authorities' (power) Twin Towers (faction) Miraak (NPC) has changed his goal or has traveled to
the neighboring settlement (name)... for whatever reason."

**The four mandatory parts of every news item** (chronicle, pulse results, letter, wizard news —
every event-narration surface):
1. SUBJECT with its FULL ADDRESS CHAIN — every containment level listed in order:
   settlement → power → faction → NPC (as deep as the actor is nested).
2. The ACTION or STATE CHANGE (typed event kind — FINITE-SEMANTICS).
3. AFFECTED SETTLEMENT(S) — always explicit, including cross-settlement targets by name.
4. The REASON — from the recorded cause (the E-J cause DAG / discourse kernel substrate).

**Implementation constraints (manager, vetoable):** the chain derives from typed containment
(npcInFaction / faction→power from the strata derivations / settlement refs) — never string
composition from prose; each level renders as an EntityLink (the link web) so the address is
navigable; realization goes through the discourse kernel grammar (deterministic, byte-stable),
never freeform. Sits under [[legibility-law]] (the glance layer's news form) and
[[finite-semantics-law]]. First applications: the chronicle surface (autoresolve-chronicle lane),
then Letter/Pulse/News in the legibility wave.
