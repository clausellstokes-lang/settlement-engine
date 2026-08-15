# RP-1 Implementer Brief — the genuine RP regressions (safety / a11y / data-integrity)

Opus implementer, Phase 5 Reunification RP sweep (regressions slice), /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; manager reviews + commits. BINDING:
memory/feature-parity-ledger.md (the RP-tagged rows cited below). REFERENCE (read-only):
/Users/cstokes/Desktop/settlement-generator/settlement-engine.

This slice does ONLY the genuine REGRESSIONS (safety, a11y, data-integrity, robustness) — NOT the
cosmetic RP items (chrome bands, PageHeaders, skeletons, mobile toolbars). Verify each ledger
file:line against the LIVE tree first; adopt THEIRS' fix onto OUR floor; STOP-AND-REPORT anything
that needs absent machinery.

FENCE: src/components/AuthPanel.jsx, src/components/authUI.jsx (+ AuthModal.jsx only if a fix
requires it), src/components/map/SimulationRulesDialog.jsx, src/components/map/AutoSaveChip.jsx,
src/components/OutputContainer.jsx (the regenerate path ONLY), src/components/GalleryPage.jsx (+ a
shared error-boundary component if THEIRS has one). NO git add/commit/stash.

## Items (7 genuine regressions)

1. **AutoSaveChip content-aware dirty detection (ledger §134 — the DATA-INTEGRITY bug, do first).**
   OURS AutoSaveChip is COUNT-ONLY (AutoSaveChip.jsx:49-59) → it reads "Saved" while the map is
   actually dirty, MISSING drag-moves and renames (silent data-loss risk: user trusts "Saved" and
   loses work). Adopt THEIRS' content-aware dirty detection via a map FINGERPRINT (THEIRS
   AutoSaveChip.jsx:29,68 `mapFingerprint`) so a move/rename flips the chip to dirty. This is the
   highest-value fix — a real integrity bug, not cosmetics.

2. **SimRulesDialog focus-trap + mid-advance write guard + collapsible groups (ledger §130).**
   OURS dialog is plain outside-click only (SimulationRulesDialog.jsx:236-239) — an a11y regression
   AND a safety one: it can WRITE rules mid-advance (a race). Adopt THEIRS' focus-trap
   (:212), the mid-advance write guard (:202-207), and collapsible groups (:445-546). The write
   guard is the load-bearing part; the focus-trap is the a11y part.

3. **Confirm-password field on register + mismatch guard (ledger §57).** OURS only checks
   `length<6` (AuthPanel.jsx:114). Add the confirm-password field + a mismatch guard (THEIRS
   AuthPanel.jsx:373-375,194) so a typo'd password can't silently lock a user out.

4. **Password show/hide toggle + persistent field labels (ledger §58).** OURS `Input` is
   placeholder-only (authUI.jsx:99-117) — no reveal toggle, no persistent label = an a11y
   regression. Adopt THEIRS' reveal toggle + labels (authUI.jsx:107-188).

5. **Existing-account detection on signup (ledger §61).** OURS destructures only
   `{needsVerification}` (AuthPanel.jsx:208-212 in THEIRS) — a user signing up with an existing
   email gets no signal. Surface the existing-account case.

6. **Regenerate discard-confirm + friendly AI errors (ledger §159).** OURS fires regenerate
   DIRECTLY (OutputContainer.jsx:307) with NO confirm — discarding pending edits silently — and
   leaks raw `e.message` to the user. Adopt THEIRS' discard-confirm before regenerate + the
   friendly error mapping (THEIRS OutputContainer.jsx:405-420,965-974). Do NOT touch the rest of
   OutputContainer (the inline DossierActionBand strip etc. are cosmetic RP, out of this slice).

7. **Per-panel FeatureErrorBoundary on Gallery (ledger §182).** OURS renders detail/list/map with
   NO error boundaries (GalleryPage.jsx:95-200) — one panel throwing crashes the whole page. Adopt
   THEIRS' per-panel FeatureErrorBoundary (port the shared boundary component if OURS lacks it).

## Laws + gates
Adopt onto our floor; a11y-correct (focus actually trapped, inputs actually labelled, toggle
keyboard-operable); the AutoSaveChip fingerprint must catch move+rename (not just count); the
regenerate confirm must actually gate the discard; NEVER surface raw `e.message`. UI-only — goldens
MUST stay byte-identical (confirm). First paint: all these are LAZY surfaces — keep it that way;
verify:dist GREEN (budget 1,441,000). eslint + typecheck + domain-strict + build. Add/extend focused
tests where the fix has real logic to pin: AutoSaveChip dirty-on-rename, SimRulesDialog write-guard
blocks mid-advance, confirm-password mismatch blocks submit, regenerate-confirm gates discard. Report
per-item DONE/PARTIAL/STOP-AND-REPORT with the live-tree file:line you changed, whether a shared
error-boundary was ported, gate results, and confirmation goldens byte-identical + first paint unmoved.
