# DESIGN — THE NARRATIVE TEMPO GOVERNOR (the pacing layer over the composed drama engines)
## Fable 5 architecture, 2026-07-14 — the anti-cacophony design; the last pre-build design of the E-family freeze
### Binds: every drama engine (war/peace/generosity/doctrine/plague/calamity/boom/schism); the CL profile system; the significance/metronome machinery it generalizes

## 0. The problem it solves
Stasis is dead; its mirror is born. Eight drama engines firing independently into one feed
produce cacophony — a soap-opera realm where nothing matters because everything happens. The
existing brakes (metronomes, significance gates, maxAuto=7, conflict budgets) protect individual
systems; NOTHING governs the composed tempo. This design is the realm-level governor, built
BEFORE the E-waves so pacing is architecture, not retrofit.

## 1. THE ONE DESIGN LAW: throttle spontaneity, never causality
The governor gates INDEPENDENT arc BIRTHS only. A consequence chain is never censored: the
war-born famine, the famine-born exodus, the exodus-born coup all fire regardless of budget —
causality is the product's soul and the governor must be provably unable to break a receipted
chain. Only SPONTANEOUS births (the seeded draws that start new arcs from quiet: calamity draws,
organic contests, opportunistic wars, independent schisms) consult the tempo ledger. A deferred
birth is DELAYED, never denied: its pressure persists and fires when a slot opens — which buys
the "quiet before the storm" texture for free.

## 2. The mechanism (the maxAuto idiom, promoted to the realm)
A conditionally-materialized `narrativeTempo` ledger: rolling counts of major-arc births by
DRAMA CLASS (war, plague, calamity, succession/coup, schism/contest, economic-shock, boom/
flourishing) over a TEMPO_WINDOW (default: one game year), realm-wide AND per-settlement.
At the candidate roll stage (the existing budget check-point in rollCandidates — one seam),
each spontaneous major-class candidate reads the ledger:
- CLASS BUDGET: births of this class in-window ≥ CLASS_MAX ⇒ defer (realm-wide).
- SETTLEMENT GRACE: a settlement inside its post-major GRACE_TICKS (it just survived a siege/
  plague/flood) is exempt from NEW independent majors — chained consequences still land.
- GLOBAL SIMULTANEITY: live major arcs realm-wide ≥ ARC_MAX ⇒ defer lowest-priority class
  (codepoint-deterministic priority; no rng — deferral is a pure function of the ledger).
Deferral is receipted at DM visibility only ("pressure builds in the west" — the irony brief's
"storm gathering" line), so the DM sees the held storm; players just feel the calm.

## 3. TEMPO AS A DIAL (the presets finally mean their names)
CLASS_MAX / ARC_MAX / GRACE_TICKS scale by a `narrativeTempo` axis on the CL profile:
quiet_local (low), realistic_regional (moderate), dramatic_campaign (HIGH — the preset's depth
review finally has its lever), full_simulation (highest, still bounded). A World-Laws dial
exposes it (fiction voice: "How loudly does history speak?"). DM-authored events NEVER consult
the governor (the DM outranks tempo).

## 4. Constitutional posture
Deterministic (pure ledger reads, codepoint priority, zero new rng); DORMANT DEFAULT = budget ∞
(flag off ⇒ current behavior byte-identical — the governor ships dark like every layer and
lights with the tempo axis); conditionally materialized, zero eager; receipts on every deferral;
constants named/frozen/owner-retunable; aggregate-only; the significance/metronome layers are
UNTOUCHED beneath it (they govern repetition; this governs birth density).

## 5. Tests + the cacophony soak
Pins: chained-consequence immunity (a war-born famine fires while the famine class is over
budget — the design law's proof); deferral determinism (same seed ⇒ same deferrals); grace-tick
exemption for chains; dial monotonicity (higher tempo ⇒ ≥ arc births, same seed). THE CACOPHONY
SOAK: 30y full_simulation, asserting arc-density envelopes — majors per settlement-year within
band, simultaneous realm majors ≤ ARC_MAX, no decade both silent AND no decade saturated; plus
the QUIET-BEFORE-STORM assertion (deferred pressure fires within N ticks of a slot opening).

## 6. Sequencing
Designed now (the freeze's one exception, per the gap-hunt ruling); BUILDS as the FIRST E-wave
(E0), before E1a — every subsequent engine registers its spontaneous-birth classes with the
governor at birth, so pacing is a registration requirement (a walker: every drama engine names
its class or documents exemption), not a hope.
