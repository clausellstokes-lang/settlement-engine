# THE POST-MERGE DISPLAY/AI LANE BRIEFS — SM-4, GUIDE-2b, SURVEYOR S1–S2
## All three run CONCURRENT with the soak (they touch no engine). Read docs/briefs/W_R2_COMMON_PROTOCOL.md first. Bases supplied at dispatch (post-fold-in unified lineage).

---

# SM-4 — the settlement-map endgame. Branch: `claude/sm-4`
Design authority: docs/DESIGN_SETTLEMENT_MAP.md (frozen) — SM-1..3 shipped the model, viewer,
and cosmetic edits; SM-4 is the projection endgame.
**SCOPE:** (1) the PDF town-map PLATE — a new dossier-PDF section rendering the deterministic
town-map projection (the `${_seed}::town-map:v1` fork — same single-writer model the viewer
uses; render via the worker lane, zero main-thread regressions; register in the PDF
parity/field manifest); (2) the library CARD THUMBNAIL (lazy, cached, mapThumb-pattern with
its contract pin); (3) GALLERY OPT-IN — the shared/public dossier may include the town map
ONLY behind the owner's existing share-flags lane (fail-closed default OFF; the map renders
from the PUBLIC projection — mapEdits keys already dodge the private-key strip, assert it).
**LAWS:** display-lane only; zero eager bytes; goldens byte-identical (the map is a view-time
projection — nothing persists); premium seam (anon sees the map only if the owner opted in).
**PINS:** plate render-leaf; thumb contract; opt-in default-off; projection determinism
(same seed → identical plate bytes).

---

# GUIDE-2b — the guidance layer's recorded remainder. Branch: `claude/guide-2b`
Charge per the W-GUIDE-2 ledger row's deferral record: (1) THE KEEPER'S HANDBOOK COMPRESSION —
the long-form reference (HowToUse et al.) compressed into the registry-driven, glossary-linked
form the design froze (registry prose + compendium deep-links; the ~40-fragment census is the
denominator — no instructional fragment may exist outside the registry, walker-enforced);
(2) THE DEEP TITLE TRANCHE — the remaining title= attributes on text-bearing controls get
per-title wiring into the census (current ratchet 502 post-merge — every conversion is a
ratchet-DOWN); (3) any whisper hosts minted since SURFACE-2 join the strict walker.
**LAWS:** immersion law + dissociation test per hint; zero eager; the register guards
(second-person, no UI verbs, persona placement rules) bind all new prose.

---

# SURVEYOR S1+S2 — the analyst + the briefs (the first AI ship). Branch: `claude/surveyor-s1`
Design authority: docs/DESIGN_AI_CONTROL_SURFACE.md §2 stages 1–2 + §3 hard rules (read BOTH
in full; the hard rules are constitutional). This is READ-ONLY — zero write surface exists in
this wave; the intent compiler is S3's, not yours.
**S1 — THE ANALYST:**
- New edge function `ai-analyst`: JWT auth → credits reservation (the generate-narrative
  reservation pattern generalizes — task-priced) → RETRIEVAL: a registry of STATE-SLICERS
  (question → the relevant read-model slices; DM questions may include includeGroundTruth
  slices; player-framed questions receive ONLY projections — the §3 audience rule is
  structural, never prompt-enforced) → provider adapter (Anthropic first; the adapter
  interface is provider-neutral from day one) → the answer with RECEIPT CITATIONS: every
  claim tagged with the read-model/receipt it derives from; claims without a source are
  labeled "the engine does not record this" (the honesty boundary — extend the
  invention-signal discipline from generate-narrative).
- Client: a lazy chat panel (zero eager bytes; the route stub rides existing lazy patterns).
- The aiOperationLog (design §1 row 3): prompt hash, retrieval slice list, model+version,
  answer hash — the audit spine starts here even though S1 writes nothing.
**S2 — THE BRIEFS:**
- Brief composers are PURE read-model bundles FIRST (weekly digest / session-prep / settlement
  / faction / regional / dramatic-irony / player-safe) — new lazy display modules, fully
  testable WITHOUT AI; the warCausalBrief/hegemonyRead/politicsRead/credibilityRead surfaces
  from W-R2 are your ingredients. The AI adds prose OVER the bundle (same citation law).
- The player-safe brief consumes ONLY the public projection (assert structurally).
**COMMERCIAL (recorded decisions — implement, don't re-decide):** surveyor tier axis
(entitlements gate the INTERFACE; the sim never reads tier); managed credits task-priced;
BYOK vault per §3 (encrypted server-side, per-request decrypt, never logged/client/corpus).
**EVALS:** the §5 metrics ride the analytics seam from day one (citation coverage, refusal
rate, answer acceptance) — ship the events with the wave.
**PINS:** audience-rule structural tests (a player-framed question CANNOT receive a
ground-truth slice — fail-closed); citation-coverage floor; credits reserve/refund round-trip;
BYOK never-logged scan; zero-eager verify.
