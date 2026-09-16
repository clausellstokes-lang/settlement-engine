# DESIGN — THE NPC LIFECYCLE: the bank, the ops, stasis, instant NPCs, the no-dead-facet law
## Owner commissions 2026-07-17 (verbatim anchors in docs/COMPREHENSIVE_REVIEW_PROGRAM.md
## rows @ 785768f0 / ba8052c5 / 3f50e5fc — they BIND). Fable 5 design, frozen at dispatch.
## Ops + display + data lane. The engine's EXISTING reads are consumed, never rewritten.

## 0. The unification
NPC editability = THE FACET LAW applied to NPCs. Every NPC attribute becomes a bank-typed
facet; user changes are DECLARED facet values through typed ops; absent declaration ⇒ the
generated/inferred value (dormancy: no ops used ⇒ byte-identical worlds).

## 1. THE BANK (the bounded vocabulary — the one new substrate artifact)
Consolidates the scattered vocabularies (alignment axes, temperaments, role catalog) and
adds **THE TYPED GOAL CATALOG WITH TRANSITION SEMANTICS**: each goal carries its on-achieve
successor candidates and on-fail fallbacks, all bank-bounded. Compatibility rules
(role×institution legality; goal×role affinity) live here. The bank is the validation
source for every op below, the future S4 compiler target, and the S4+ knob surface.
OWNER CORRECTION (binding): goal EVOLUTION already exists for engine NPCs (achieve/fail
transitions) — the gap is added-NPC citizenship. Added NPCs declare (or inherit by role) a
bounded GOAL CHAIN at creation and ride the SAME evolution machinery. Only
personality/alignment DRIFT remains a parked owner question — do NOT build it.

## 2. THE OPS (typed, through the standing covenant — preview/approval/receipt; every one
## lands in the Decree Tracker with its causal cone automatically)
- **EDIT_NPC**: field-level changes selected FROM THE BANK (never free-text). EDITS CHANGE
  THE FUTURE, NEVER THE PAST: history stands; the edit is itself a receipted event;
  propagation flows through the existing chokepointed reads (agency, corruption
  recruitment, bloc glue, succession posture) on subsequent ticks.
- **REASSIGN_NPC** (institution→institution / settlement→settlement): legality from the
  bank. WHAT TRAVELS: the existing bloc-glue typology answers it — PEOPLE-HELD ties travel
  with the NPC; SEAT-HELD ties stay with the vacated seat. The vacancy flows into the
  existing role-fill machinery. New dispatcher wiring MUST add its kind to
  COMMITTABLE_EDIT_KINDS (the standing rule).
- **STASIS / RETURN**: a revocable lifecycle state with a typed reason (journey /
  imprisoned / missing / sequestered). In stasis: excluded from ALL participation reads
  (agency, recruitment, blocs); the seat vacates via the same machinery as reassignment;
  **MEMORY KEEPS FLOWING** — the world's grievances/warmth toward them continue per the D5
  lifespan rules (the reunion inherits the interim). Return is a receipted op. Stasis is a
  shelf, not a grave: STATE-NEVER-FATE holds — the engine never resolves a named
  character's fate; stasis is reversible state, and the DM (whose sovereignty the boundary
  protects) is the only author of it.

## 3. INSTANT NPC (the instant-world pattern at person scale)
One click, optionally constrained (role / institution / settlement): a seeded, fully
bank-valid NPC — name from the local naming culture, alignment/temperament from the axes
weighted by context, a role-appropriate goal chain. COUNTERPART PIN: instant ≡ generated
(same shape, same reads, indistinguishable). Deterministic per seed. Premium gating per the
instant-settlement precedent — the gate wraps the button; the generator is tier-blind.

## 4. THE NO-DEAD-FACET LAW (owner: "every facet ... coherent with the surrounding world.
## nothing is useless") — walker-enforced, two directions
(a) **GENERATION READS THE WORLD**: no facet rolled in a vacuum — minting reads settlement
conditions, institution type, local faith/alignment climate, naming culture, active drama;
goal chains seed from the settlement's actual condition; instant NPCs identical
(constraints narrow context, never replace it).
(b) **THE WORLD READS EVERY FACET**: every bank facet has ≥1 registered consumer (an agency
read, a politics/corruption/reframe input, or a display surface); agent movement traces to
facets and every facet can move the agent.
ENFORCEMENT: **THE FACET-CONSUMER WALKER** (the operation-registry/whisper-census pattern):
a facet without a declared generation-context source or a registered consumer FAILS THE
BUILD. Survey the existing facets first; pre-existing dead facets are FINDINGS (report,
wire, or get an explicit exempt-with-reason entry under a shrink-only ceiling).

## 5. PINS (mandatory)
Counterpart citizenship (added/instant ≡ generated at every read) · facts-frozen (no op
rewrites any past receipt) · bank-bounded validation (free-text rejected) · dormancy (no
ops ⇒ byte-identical; all goldens green) · stasis exclusion + memory-flow (a stasis NPC
appears in no participation read while their relationship edges still decay per D5) ·
travel/stay (a reassignment moves people-held and leaves seat-held — fixture-proven) ·
the facet-consumer walker itself · determinism (same seed ⇒ same instant NPC).

## 6. COHERENCE MATRIX
×FACET LAW (the mechanism) · ×COVENANT/DECREE TRACKER (ops = decrees; cones attach free) ·
×BLOC GLUE (people-held/seat-held answers relocation) · ×D5 MEMORY (stasis interim) ·
×D7 REFRAME (an edited goal/alignment changes future interpretation weights — consumed,
not rewritten) · ×NPC AGENCY (npcAgency is AT its line ceiling — new logic in lazy leaves,
reach via re-export precedents) · ×STATE-NEVER-FATE (clarified, intact) · ×S4 (the bank is
the compiler target) · ×PREMIUM SEAM (buttons gated, generators tier-blind) · ×GUIDANCE
(every new op ships its whisper).
