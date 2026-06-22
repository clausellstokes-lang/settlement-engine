/**
 * components/auth/authUI.jsx — shared auth presentational primitives.
 *
 * Extracted verbatim from AuthModal so the modal and the dedicated
 * /signin · /register · /reset-password pages render byte-identical
 * controls from one source. No logic lives here — just inputs, buttons,
 * alerts, the OAuth button + brand glyphs, and the page shell chrome.
 */
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import {
  GOLD, GOLD_TXT, INK, INK_DEEP, MUTED, SECOND, BORDER, BORDER_STRONG, CARD, PARCH, sans, serif_,
  SP, R, FS, ELEV, swatch, VIOLET, VIOLET_DEEP, VIOLET_BG, RED, RED_BG,
  GREEN_DEEP, DANGER_BORDER, SUCCESS_BORDER, layout,
} from '../theme.js';
import DSButton from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import Page from '../primitives/Page.jsx';
import Pill from '../primitives/Pill.jsx';
import { t } from '../../copy/index.js';

// ── OAuth brand glyphs ──────────────────────────────────────────────────────
// Inline SVG (vs. a brand-icon package) to control bundle size — each glyph
// is ~100 bytes. The `fill="#…"` attributes are brand colours on <path>, not
// inline-style objects, so the visual-budget no-raw-color rule doesn't apply.
export function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path fill="#EA4335" d="M12 5c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.62 14.94.5 12 .5 7.31.5 3.26 3.19 1.28 7.07l3.66 2.84C5.93 7.04 8.7 5 12 5z"/>
      <path fill="#4285F4" d="M23.5 12.28c0-.85-.08-1.67-.21-2.45H12v4.65h6.46c-.28 1.5-1.13 2.78-2.41 3.63l3.55 2.75c2.08-1.92 3.27-4.74 3.27-8.07z"/>
      <path fill="#FBBC05" d="M4.95 14.09a7.66 7.66 0 0 1 0-4.18L1.28 7.07a11.5 11.5 0 0 0 0 9.86l3.67-2.84z"/>
      <path fill="#34A853" d="M12 23.5c3.24 0 5.96-1.07 7.95-2.91l-3.55-2.75c-.98.66-2.24 1.05-4.4 1.05-3.3 0-6.07-2.04-7.05-4.91L1.28 16.93C3.26 20.81 7.31 23.5 12 23.5z"/>
    </svg>
  );
}

export function DiscordGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="#5865F2" aria-hidden="true">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.42 0-1.333.956-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.974 0c-1.183 0-2.156-1.085-2.156-2.42 0-1.333.955-2.418 2.156-2.418 1.211 0 2.176 1.094 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

export function OAuthButton({ glyph, label, onClick, disabled, soonNote }) {
  return (
    <DSButton
      variant="secondary"
      size="lg"
      fullWidth
      onClick={onClick}
      disabled={disabled}
      title={soonNote || `Continue with ${label}`}
      icon={glyph}
      trailingIcon={soonNote && (
        <span style={{
          fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: VIOLET,
          background: VIOLET_BG, padding: '2px 5px', borderRadius: 3,
          marginLeft: 4,
        }}>
          Soon
        </span>
      )}
    >
      <span>Continue with {label}</span>
    </DSButton>
  );
}

/**
 * FooterLink — a gold text link for the auth-page footers ("Create one",
 * "Sign in", "Forgot your password?"). Presentational only: the page passes
 * the real `href` (for crawlers + middle-click/open-in-new-tab) and an
 * `onClick` that preventDefault()s and calls the SPA navigator.
 */
export function FooterLink({ href, onClick, children }) {
  return (
    <a
      href={href}
      onClick={onClick}
      style={{
        color: GOLD_TXT, fontWeight: 600, textDecoration: 'none', fontFamily: sans,
      }}
    >
      {children}
    </a>
  );
}

export function OrDivider({ label = 'or with email' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm,
      fontSize: FS.xs, fontWeight: 700, color: MUTED,
      textTransform: 'uppercase', letterSpacing: '0.08em',
    }} aria-hidden="true">
      <span style={{ flex: 1, height: 1, background: BORDER }} />
      <span>{label}</span>
      <span style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  );
}

export function Input({ type = 'text', placeholder, value, onChange, onKeyDown }) {
  // Password fields get an in-field show/hide toggle so the user can verify
  // what they typed. The toggle is a labelled IconButton (aria-pressed +
  // aria-label routed through the copy registry) at the 44px usability
  // target, so it satisfies the password show/hide a11y contract without
  // changing the Input prop API its call sites depend on.
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword && reveal ? 'text' : type;

  const field = (
    <input
      type={effectiveType}
      placeholder={placeholder}
      aria-label={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      style={{
        width: '100%',
        // Leave room for the trailing toggle on password fields so the text
        // never runs under it.
        padding: isPassword
          ? `${SP.md}px ${SP.huge}px ${SP.md}px ${SP.lg - 2}px`
          : `${SP.md}px ${SP.lg - 2}px`,
        // BORDER_STRONG (3.44:1 on white), not the decorative parchment-200
        // BORDER (1.40:1): the field outline is the input's only affordance
        // cue, so it must clear the WCAG 1.4.11 3:1 UI-boundary floor — the
        // same remediation the Button `secondary` variant already adopted.
        border: `1px solid ${BORDER_STRONG}`, borderRadius: R.lg,
        fontSize: FS['14'], fontFamily: sans,
        background: swatch.white, outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );

  if (!isPassword) return field;

  return (
    <div style={{ position: 'relative' }}>
      {field}
      <div style={{
        position: 'absolute', top: '50%', right: SP.xs,
        transform: 'translateY(-50%)',
      }}>
        <IconButton
          Icon={reveal ? EyeOff : Eye}
          label={reveal ? t('auth.password.hide') : t('auth.password.show')}
          tone="ghost"
          size="xl"
          pressed={reveal}
          onClick={() => setReveal(r => !r)}
        />
      </div>
    </div>
  );
}

export function Checkbox({ checked, onChange, label }) {
  const id = `checkbox-${String(label).replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <label htmlFor={id} style={{
      display: 'flex', alignItems: 'center', gap: SP.sm,
      cursor: 'pointer', fontSize: FS.sm, color: SECOND,
      fontFamily: sans, userSelect: 'none',
    }}>
      <input
        id={id}
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ accentColor: GOLD, width: 16, height: 16, cursor: 'pointer' }}
      />
      {label}
    </label>
  );
}

export function Button({ onClick, children, variant = 'primary', disabled, style: extra }) {
  // Map this auth-CTA primitive's variants onto the design-system Button.
  // `ghost` here is gold-on-transparent with a gold border → DS `gold` (the
  // softest gold variant) is the closest faithful match.
  const variantMap = {
    primary: 'primary',
    success: 'success',
    danger:  'danger',
    ghost:   'gold',
  };
  return (
    <DSButton
      variant={variantMap[variant] || 'primary'}
      size="lg"
      fullWidth
      onClick={onClick}
      disabled={disabled}
      style={extra}
    >
      {children}
    </DSButton>
  );
}

export function Alert({ type, children }) {
  const colors = {
    error:   { bg: swatch.dangerBg, border: DANGER_BORDER, text: swatch.danger },
    success: { bg: swatch.successBg, border: SUCCESS_BORDER, text: GREEN_DEEP },
    info:    { bg: swatch['#FEF9EE'], border: GOLD, text: SECOND },
  };
  const c = colors[type] || colors.info;
  // A+ design-a11y.4 — conditionally-rendered errors are the textbook live-region
  // case (the content appears after the user acts), so assistive tech must
  // announce it: errors assertively (role=alert), everything else politely
  // (role=status). Mirrors the Toast primitive's role=status pattern.
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: SP.sm,
        padding: `${SP.sm + 2}px ${SP.md}px`,
        background: c.bg, border: `1px solid ${c.border}`, borderRadius: R.md,
        fontSize: FS.sm, color: c.text, lineHeight: 1.5,
      }}>
      <span>{children}</span>
    </div>
  );
}

/** Role badge (developer / admin). Returns null for ordinary users. */
export function RoleBadge({ role }) {
  if (role === 'user') return null;
  const cfg = {
    developer: { color: VIOLET_DEEP, bg: VIOLET_BG, label: 'Developer' },
    admin:     { color: RED, bg: RED_BG, label: 'Admin' },
  };
  const c = cfg[role] || cfg.admin;
  return (
    <Pill bg={c.bg} color={c.color}>
      {c.label}
    </Pill>
  );
}

/**
 * AuthPageShell — centered card chrome for the full-page auth routes.
 * Renders the brand lockup, a title/subtitle, the form body (children),
 * and optional footer links. The parchment background + site header/footer
 * come from App's layout; this is just the card.
 */
export function AuthPageShell({ title, subtitle, children, footer }) {
  return (
    // Route the shell through the shared Page primitive at form width instead
    // of hand-rolling maxWidth + margin, so the auth routes share the one
    // layout cap every other top-level surface uses (P12).
    <Page
      max={layout.form}
      pad={`${SP.xxl}px 0`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
    >
      {/* Scrim panel: the dedicated auth routes render over App's per-view
          PAINTED background (.page-bg). The card below gives the form its own
          readable CARD surface, but the brand lockup and footer would otherwise
          sit directly on the painting, where gold-on-painting and the
          secondary-grey footer text can fail AA. A subtle parchment scrim with
          a hairline border lifts both onto a guaranteed-readable surface so all
          text clears 4.5:1 over any painting. */}
      <div style={{
        background: PARCH, borderRadius: R.xl,
        border: `1px solid ${BORDER}`,
        boxShadow: ELEV['3'],
        padding: `${SP.xl}px`,
        display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: SP.lg,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP.sm,
        }}>
          <span style={{
            fontSize: FS.xl, fontWeight: 700, color: GOLD, fontFamily: serif_,
            letterSpacing: '0.02em', textTransform: 'lowercase',
          }}>
            SettlementForge
          </span>
        </div>

        <div style={{
          background: CARD, borderRadius: R.xl,
          border: `1px solid ${BORDER}`,
          boxShadow: ELEV['2'],
          overflow: 'hidden',
        }}>
          <div style={{
            padding: `${SP.lg}px ${SP.xl}px`,
            background: `linear-gradient(to right, ${INK}, ${INK_DEEP})`,
            color: GOLD,
          }}>
            <h1 style={{ margin: 0, fontSize: FS.xl + 1, fontFamily: serif_, fontWeight: 600 }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ margin: `${SP.xs}px 0 0`, fontSize: FS.sm, color: MUTED, lineHeight: 1.4 }}>
                {subtitle}
              </p>
            )}
          </div>
          <div style={{ padding: `${SP.xxl}px ${SP.xl}px` }}>
            {children}
          </div>
        </div>

        {footer && (
          <div style={{
            textAlign: 'center',
            fontSize: FS.sm, color: SECOND, fontFamily: sans, lineHeight: 1.6,
          }}>
            {footer}
          </div>
        )}
      </div>
    </Page>
  );
}
