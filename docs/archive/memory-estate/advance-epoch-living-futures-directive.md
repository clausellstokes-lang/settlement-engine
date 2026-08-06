---
name: advance-epoch-living-futures-directive
description: "OWNER DIRECTIVE (2026-08-05): user-facing time advances draw a FRESH history each time — undo + re-advance yields a different plausible history; byte-exact replay retained INTERNALLY (recorded nonces) for debugging. Amends THE PROMISE: a seed is a STARTING world forever + a lived history is immutable; the un-lived future is alive."
metadata:
  type: project
  created: 2026-08-05
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-05T09:31:53.813Z
---

# The advance-epoch directive (owner, 2026-08-05, in-chat — "that is what i want")

**Owner's words (intent, binding):** "the DM that loved a starting world so
much that they go back to it to see a completely different yet plausible
history. on our end, we can recreate the exact clicks and determinism to
chase bugs, but for them... the user that backtracked because he didn't
like the direction based on vibes. now he undos and advances time again to
see a different plausible history still coherent."

**The design (chair, accepted by owner in the same exchange):** every
USER-initiated advance mints a fresh entropy nonce (generateSeed()-class,
minted at the store-action layer, NEVER wall-clock inside the kernel) and
RECORDS it in the history/action log entry. The pulse stream identity
gains the nonce (the pulseKernel seed string `rngSeed::tick:N::interval`
grows an epoch/nonce term — ⚠ a PULSE-KERNEL SEAM, zero-pulse-edit law
applies, chair-signed seam required). Undo deletes the history entry; the
next advance mints a NEW nonce → a genuinely different, fully coherent
history. Replays feed the RECORDED nonces → byte-exact, so goldens,
dormancy fences, four-fence proofs, and bug reproduction all survive as
(worldState, seed, nonce)-pinned tests. Legacy saves: entries without a
nonce replay as epoch-0 (current behavior) — back-compat exact.

**What it preserves:** same seed = same STARTING world (seed-sharing
culture intact); a LIVED history never rewrites (loading a save shows the
same past — the trust floor); all internal determinism for debugging.
**What it amends (OWNER-SIGNED constitutional shift):** THE PROMISE
narrows from "a seed is a world's whole timeline" to "a seed is a starting
world, forever; a lived history, once lived, forever." Two DMs sharing a
seed share the starting world, not the same future. Save-scumming the
FUTURE is now a feature, deliberately: the user is the world's author —
re-drawing the un-lived future is brainstorming, not cheating; the
immutable past carries the meaning.

**THE GENERATOR SIDE (owner, same exchange: "and the same thing for the
generator side"):** the identical law governs generation. Every
user-facing generate/reroll/regenerate affordance — whole-world generate,
settlement regen, history reroll, any per-surface reroll button — mints
FRESH entropy per click (generateSeed()-class) and yields a different
plausible output, with the user's edits preserved per the regen-edit
preservation laws. The SEED stays the address door: typing/pasting a seed
returns the exact starting world (how the DM comes back to the beloved
one); clicking generate/reroll is the living door (always a new draw).
Fresh generation ALREADY works this way (generateSeed is the one
sanctioned non-determinism door); the directive makes it LAW across every
regen affordance and forbids any user-facing regen that silently replays
the same draw. Internal replay stays deterministic via recorded seeds.

**Status (2026-08-05, run wf_ec31fa7e-773): ✅ ARCHITECTED COHESIVE —
CHAIR-ATTESTED after SIX adversarial rounds** (findings 9→9→5→5→4→2, every
closure independently re-derived each round, each verifier writing its own
instruments) **plus three chair-executed one-line seals** (the
display-surface pin's accessor carve-out at both homes — the
never-red-a-correct-build class cured at its third address; the
folded-quote markers; A-R6-2 was self-handled by the lane's historical
banner). Final draft ~3,300 lines. QUEUE INSERTION at the next
integration point after cycle 2, WITH the §5 obligation the volume
scheduled for itself: every VERIFY-AT-FOLD figure re-derived against the
live post-fold tree before EP-0 is chartered (the fold landed mid-round;
the trigger has fired). Draft = c44e5d99 scratchpad
epoch-arch/DESIGN_EPOCH_ARCHITECTURE-DRAFT.md (1,801 lines; waves EP-0..5;
flag advanceEpochEnabled). THE MEASURED TRUTHS THAT RESHAPED IT: ⚠⚠ the
world's entropy is 25 ROOT COMPOSITIONS across 16 modules in THREE idioms
(createPRNG 16 + hash01 8 + fnv1a32 1), NOT one kernel string — split into
a TICK-VARYING family (nonce-safe) and a YEAR-KEYED family (nonce-HOSTILE
by declared law: seasonalSeverityFor's every-week-of-a-year-reads-the-
same-winter contract, with a DISPLAY caller in mapDress.js — nonce it
naively and the map dresses a different winter than the sim ran) · ⚠ the
pulse rngSeed is CAMPAIGN-IDENTITY-derived (world-pulse:${campaign.id}),
NOT the user's generation seed — two separate promises, never one · ⚠
previewCampaignWorldPulse must be threaded the SAME pending epoch or the
preview silently stops predicting the commit · ⚠ advanceMultiTick already
forks stream identity (literal one_week per composed tick) — dark-state
byte-identity is defined PER-PATH · the dark contract = empty-suffix
concatenation (flag absent → today's EXACT strings by construction) +
flag-driven mint gating · EP-4's paid-surface/persisted-shape repairs
PARKED as owner rows (never in-wave). LATENT FIND parked for the chair:
realmVerbExecution FORCE_RESETTLE's stream is tick-AND-entity-invariant
at HEAD — every resettle a campaign ever performs draws the same outcome. Slot at the next
integration point (after the ES+WY fold lands) as its own small wave —
touches: pulse stream identity (kernel seam), history-entry shape
(persistence — owner-gated class, but this directive IS the owner's
signature), undo semantics, store advance action, and the marketing
surface. ⚠ MARKETING GUARD (see [[owner-marketing-doctrine]]): "the same
world can tell entirely different histories" becomes TRUE only when this
wave SHIPS — do not claim it in copy before then. The Reddit post's
optional line once landed: "don't like where the decade went? wind back
and let it happen differently — it will, and it will still make sense."

Related: [[the-promise-ratified]] (amended by this) ·
[[rumor-durability-and-absolute-distance-directive]] (same directive-bank
pattern) · [[fable-build-era-takeover]] (rulings ledger).
