# Accessibility Audit — Tier 7.17

## Scope

This audit covers the SettlementForge web app surfaces that an average
DM user touches during a normal session:

- Home + hero
- Generate wizard
- Settlement detail view (all 14 tabs)
- Auth modal
- Purchase modal
- Account page
- Pricing page
- Gallery + public dossier view
- Narrative drift modal
- Onboarding coach

Out of scope: developer-only admin surfaces, debug panels, FMG bridge.

## Methodology

The audit was a manual + grep-driven pass against four classes of
issue, plus a static check on the design-system primitives. We did NOT
run a full axe-core audit — that's a follow-up (likely as a Playwright
e2e add-on) once the surfaces stabilize.

The four classes:

1. **Dialog semantics.** Modal dialogs must declare `role="dialog"`,
   `aria-modal="true"`, and reference their visible heading via
   `aria-labelledby`. Without these, screen readers and AT keyboard
   shortcuts can't recognize the modal as such and won't trap focus.

2. **Icon-only buttons.** A `<button>` whose visible content is purely
   an SVG icon (lucide-react) needs `aria-label` or `title` so AT can
   announce what it does. "X" alone reads as nothing.

3. **Status announcements.** Chips that communicate state ("Narrated",
   "Critical", "Founder") need `role="status"` so AT picks them up
   when they appear or change.

4. **Heading hierarchy.** Avoid skipping levels (h1 → h3); ensure each
   tab has a single h1 or h2 establishing context.

## Findings

### Modal dialogs

| Component                | role | aria-modal | labelledby | Close-button aria-label | Status        |
|--------------------------|------|------------|------------|-------------------------|---------------|
| `NarrativeDriftModal`    | ✓    | ✓          | (heading text inline) | ✓ (aria-label="Cancel") | OK pre-audit  |
| `PurchaseModal`          | ✗ → ✓| ✗ → ✓     | ✗ → ✓      | ✗ → ✓                   | **Fixed**     |
| `AuthModal`              | ✗ → ✓| ✗ → ✓     | ✗ → ✓      | ✗ → ✓                   | **Fixed**     |
| `ExportSheet`            | ✓    | ✓          | ✓          | n/a (inline)            | OK            |
| `SuccessorPrompt`        | ✓    | ✓          | (inline)   | n/a                     | OK            |
| `PostGenCoach`           | ✓    | n/a *      | ✓          | ✓ (aria-label="Dismiss coach") | OK    |

\* PostGenCoach is a *non-modal* dialog (floating tooltip), so omitting
`aria-modal` is correct — adding it would falsely tell AT that the rest
of the page is inert.

### Design-system primitive a11y contracts

Every primitive that surfaces a meaningful state communicates it
through `role="status"` and an accessible name. Tests pin these in
`tests/ui/a11y.audit.test.jsx`:

| Primitive                 | role         | aria-label / labelledby      |
|---------------------------|--------------|------------------------------|
| `StateBadge`              | status       | from `COPY.state.tooltips`   |
| `BandPill`                | status       | computed from band + label   |
| `CanonBadge`              | status       | computed from source+status  |
| `RegenerationModeSelector`| group/radio  | per option                   |
| `RegenerationDeltaCard`   | (region)     | aria-label="Regeneration delta" |
| `CausalViewTabs`          | tablist      | per tab                      |
| `AiOverlayViolations`     | region       | summary count in label       |
| `FounderBadge`            | (status)     | "Founder seat"               |
| `EditableText`            | input/label  | per input                    |
| `IconButton`              | n/a          | requires aria-label prop     |

`IconButton` is intentionally a "supplier" abstraction — the caller is
required to pass an aria-label, and there's no graceful default. This
forces the caller to think about it.

### Other findings

- **Loading spinners**: the `Loader2` icon (lucide-react) doesn't
  carry an `aria-busy` attribute on its parent. Acceptable because all
  loading states also disable the button (`disabled={loading}`) which
  AT picks up. Lower priority.
- **Image alt text**: no `<img>` tags use src for content imagery — all
  images are CSS backgrounds (parchment, hero textures) or SVG icons
  (lucide-react, which handles its own aria). No alt-text gaps found.
- **Focus traps**: not tested in jsdom (would require Playwright).
  Modals do listen for `Escape` keypress via the backdrop's onClick
  handler — keyboard escape works.
- **Heading hierarchy**: spot-checked. Each modal has a single h2
  inside the dialog. Pages (PricingPage, GalleryPage, AccountPage)
  each have a single h1.

## Fixes applied this pass

1. `PurchaseModal.jsx`
   - Added `role="dialog"` + `aria-modal="true"` + `aria-labelledby` on
     the inner content card
   - Added `id="purchase-modal-title"` on the h2
   - Added `aria-label={t('common.close')}` on the X close button

2. `AuthModal.jsx`
   - Same three a11y additions as PurchaseModal
   - Added `id="auth-modal-title"` on the dynamic h2

3. `tests/ui/a11y.audit.test.jsx` (new)
   - Pins the dialog + primitive contracts so future refactors can't
     silently drop them

## Outstanding / Follow-up

These would be next-pass work, outside the scope of Tier 7.17:

- **Full axe-core run in Playwright** — would catch color contrast,
  duplicate ID, label-input association, and other rendered-DOM-only
  issues that jsdom can't see.
- **Keyboard focus trap testing** — Playwright can verify `Tab` cycles
  inside an open modal and `Escape` closes it.
- **Screen-reader testing** — actual NVDA/VoiceOver smoke run to verify
  the announced text matches the intent.
- **Color contrast** — the gold-on-parchment palette is borderline at
  some sizes. Worth running through WCAG AA checkers.
- **Mobile pointer targets** — Tier 7.18 covers mobile responsiveness
  separately; pointer-target sizing audit lives there.

## How to run the audit tests

```bash
npx vitest run tests/ui/a11y.audit
```

## How to extend

When you add a new modal or new primitive that displays state:

1. Add `role` + `aria-modal` (if modal) + `aria-labelledby` on the
   container.
2. Add a row to the matrix above with its a11y attributes.
3. Add a render test in `tests/ui/a11y.audit.test.jsx` asserting the
   attributes are present.
