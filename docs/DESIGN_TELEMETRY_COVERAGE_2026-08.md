# DESIGN — TELEMETRY COVERAGE FOR THE 2026-08 CORPUS (owner order: "make sure all
# these changes, where appropriate, are captured by the telemetry and data
# analytical layer"). Fable 5, 2026-08-02. Implementation = the external implementer.

## §0 THE TWO-LAYER RULING (first, so nothing crosses)
Tonight's changes span two observability layers that MUST stay separate:
- **SIMULATION OBSERVABILITY** (engine-side): v5 receipts, envelopes, era
  matrices, certification rows — ALREADY MANDATED for every FP mechanism by the
  spine's requirement 11 and J-D12(c). It reads worldState; it never touches
  user identity; it is not telemetry.
- **PRODUCT TELEMETRY** (user-side): the analyticsEvents registry, consent-
  gated, structure-never-content. It reads user behavior; it NEVER reads
  worldState internals; per the intent-atlas law it informs SUGGESTION and
  BUSINESS decisions, never engine math, never ranking (R-G1).
This document covers the second layer. A product event that wants simulation
detail, or an envelope that wants user identity, is a design defect.

## §1 THE BINDING LAWS (every event below complies)
1. Every event registers in the analyticsEvents registry with its EVENT_CLASS
   and consent-class mapping (the registry idiom; the gallery audit's missing-
   class finding generalizes: no classless events, ever).
2. STRUCTURE, NEVER CONTENT: no world text, no letter bodies, no bio text, no
   blocked strings, no display names in any event payload. Counts, kinds,
   bands, booleans, durations.
3. Consent classes honored: product-analytics events under the first toggle;
   aggregate market-research derivations under the third; SERVICE records
   (consent changes, moderation notices) are compliance records, not
   analytics — they persist regardless of toggles, in their own store.
4. Email stays unmeasured (no pixels — the standing renunciation).
5. Aggregate-only leaves the building: anything shared or licensed is counts
   over cohorts, never rows over users.

## §2 COVERAGE MAP — the product surfaces of 2026-08 (event · class · notes)
- **LD-1/LD-4 MINIATURES:** `miniature_engaged`, `miniature_tab` (already
  specced LD-1 §9) — extend the same pair to the Herald miniature with a
  `surface` field. Funnel-class.
- **LD-2/LD-5 NAV:** `nav_dropdown_open` (section), `nav_dropdown_item`
  (route key), `nav_section_reset` (LD-11's self-click reset — fires only on
  actual reset, carries dirty-confirm outcome as a boolean). UX-class; the
  reset event doubles as the feature's success metric.
- **LD-3/3b/LD-8 (ribbons, footer, insets):** DELIBERATELY NO EVENTS — layout
  corrections emit nothing (the non-capture list exists so silence is a
  decision, per the house discipline).
- **LD-6 ANNUAL TOGGLE:** `pricing_cadence_toggled`, `checkout_initiated`
  (cadence field) — already specced LD-6 §8; confirmed here with classes.
- **LD-7 POPUP SCOPE:** existing moment impression/dismissal events gain a
  `suppressed_by_scope` counter (aggregate only) so the law's effect is
  measurable; no new per-user event.
- **THE FOUNDERS' HALL:** `hall_visited`, `hall_plate_opened` (numeral only —
  never the name), `hall_request_started` / `hall_request_submitted` (the
  letter funnel — counts only; the letter body is a support ticket, never
  telemetry). Invitation acceptance is a SERVICE record (audit row +
  entitlement grant), not analytics.
- **PROFILE IMAGE:** `avatar_uploaded` / `avatar_removed` (ops health:
  format + size band, never the image); crop-abandonment boolean for UX.
  Moderation verbs are AUDIT ROWS (compliance layer), not analytics.
- **THE CIVILITY GUARD (the privacy-sharp one):** `guard_block_fired` —
  surface (name|comment|bio|publish) and match-class band ONLY. ⚠️ NEVER the
  attempted text, never a user-side flag or counter that accumulates into a
  reputation — the owner's proportionality ruling extends to data: the guard
  rejects strings, and the telemetry must be structurally incapable of
  building a naughty-list. Aggregate rates only, for list-tuning.
- **OPERATOR MESSAGES:** receipts ARE the dataset (delivered/read per
  message) — broadcast performance derives from receipts by aggregation;
  NO separate analytics events, no read-tracking beyond the in-product
  receipt (email unmeasured stands).
- **THE SURVEYOR CHAT:** `chat_turn` (door/capability invoked — this is the
  INTENT ATLAS's native food: observed intents inform suggestion ranking per
  its standing law), `chat_upload_processed` (media class + outcome band;
  never filenames), approval-card outcomes (proposed/approved/edited/
  dismissed — the AI layer's most valuable product signal). Costs are already
  ledgered in credits (no duplication).
- **GALLERY STANDING + SHOWCASE:** the three sponsored events with their
  EVENT_CLASS assignments (the audit's gap, closed in the corrected showcase
  doc); `standing_badge_optin_changed` (boolean, for adoption measurement).
- **THE AGE TOGGLES (directive 12):** `age_set` (axis + target + campaign-age
  band at flip — WHICH AGES PLAYERS CHOOSE is the single richest product
  signal tonight created: it feeds the aggregate market-research layer
  ["which systems and settlement shapes players build"] and the tuning
  agenda's demand signal; per the intent-atlas law it NEVER feeds the engine).
- **CONSENT CHANGES (LD-10):** `consent_changed` (toggle + prior + new +
  timestamp) as a SERVICE-CLASS compliance record with an auditable trail —
  VERIFY-AT-BUILD whether the existing consent write already logs history;
  if not, this record is a legal-tail requirement, not optional analytics.

## §3 THE FP CORPUS (engine side, for completeness)
Requirement 11 + the WR-9/J-D12 disciplines already mandate the simulation
half: endings envelopes, story-mix matrices, era transitions, deciding-term
histograms — all in receipts/certification, none in telemetry. The one
product-telemetry touchpoint the FP corpus adds when it ships: feature-
engagement events for its DM-facing surfaces (Herald era banners viewed,
treaty documents opened) — specced with those surfaces at build, under §1's
laws, and enumerated in each volume's shipping slice per the audit's census
discipline (aiSurface-census idiom generalizes).

## §4 PINS
Registry totality (no classless event — a walker over the registry);
content-absence (payload schemas carry no free-text fields — structural);
the guard's no-reputation pin (no per-user accumulation anywhere in the
guard's data path); consent-class routing (each event fires only under its
toggle — both arms); the email-unmeasured pin stands; the two-layer
separation pin (no analytics import in worldPulse; no worldState import in
analytics — the source-scan pair).
