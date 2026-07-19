/**
 * components/auth/authUI.jsx — shared auth presentational primitives.
 *
 * Extracted verbatim from AuthModal so the modal and the dedicated
 * /signin · /register · /reset-password pages render byte-identical
 * controls from one source. No logic lives here — just inputs, buttons,
 * alerts, the OAuth button + brand glyphs, and the page shell chrome.
 */
import { useState, useId } from 'react';
import { AlertCircle, CheckCircle, Mail, Shield, Map as MapIcon, Eye, EyeOff } from 'lucide-react';
import {
  GOLD, INK, INK_DEEP, MUTED, SECOND, BORDER, BORDER_STRONG, CARD, sans, serif_,
  SP, FS, swatch, SLATE, SLATE_BG, FORM_MAX,
} from '../theme.js';
import DSButton from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import Page from '../primitives/Page.jsx';
import { t } from '../../copy/index.js';
import { navigate } from '../../hooks/useRoute.js';
import { viewToPath } from '../../lib/routes.js';

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
          textTransform: 'uppercase', color: SLATE,
          background: SLATE_BG, padding: '2px 5px',
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
        color: GOLD, fontWeight: 600, textDecoration: 'none', fontFamily: sans,
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
      fontSize: FS.xxs, fontWeight: 700, color: MUTED,
      textTransform: 'uppercase', letterSpacing: '0.08em',
    }} aria-hidden="true">
      <span style={{ flex: 1, height: 1, background: BORDER }} />
      <span>{label}</span>
      <span style={{ flex: 1, height: 1, background: BORDER }} />
    </div>
  );
}

export function Input({ type = 'text', placeholder, value, onChange, onKeyDown, label }) {
  // Password fields get an in-field show/hide toggle so the user can verify what
  // they typed (a real a11y + typo-safety win, load-bearing for the confirm-
  // password field). The toggle is a keyboard-operable IconButton (a native
  // button element, aria-pressed + aria-label from the copy registry) at the 44px
  // usability target (Fitts's Law), without changing the Input prop API its call
  // sites depend on.
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword && reveal ? 'text' : type;
  // Stable id for a VISIBLE, persistent label (a <span> wired via
  // aria-labelledby) when `label` is given — this replaces the
  // placeholder-as-only-name anti-pattern where the sighted name vanished the
  // instant the user typed. aria-label stays as the fallback (so call sites
  // without a `label` render byte-identically); when a visible label exists
  // aria-labelledby takes precedence per ARIA. A <span> + labelledby (not a
  // <label> element) avoids the password toggle tripping a <label>'s
  // focus-the-input default.
  const labelId = useId();

  const field = (
    <input
      type={effectiveType}
      placeholder={placeholder}
      aria-label={placeholder}
      {...(label ? { 'aria-labelledby': labelId } : {})}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      style={{
        width: '100%',
        // Leave room for the trailing 44px toggle on password fields so the
        // text never runs under it.
        padding: isPassword
          ? `${SP.md}px ${SP.huge}px ${SP.md}px ${SP.lg - 2}px`
          : `${SP.md}px ${SP.lg - 2}px`,
        // The ruled slip stays square-cut (restraint law — the plainest pages,
        // no rounded input chrome), but the outline uses BORDER_STRONG (3.44:1
        // on white), not the decorative parchment-200 BORDER (1.40:1): the field
        // outline is the input's only affordance cue, so it must clear the WCAG
        // 1.4.11 3:1 UI-boundary floor.
        border: `1px solid ${BORDER_STRONG}`,
        fontSize: FS['14'], fontFamily: sans,
        background: swatch.white, outline: 'none',
        boxSizing: 'border-box',
      }}
    />
  );

  const control = !isPassword ? field : (
    <div style={{ position: 'relative' }}>
      {field}
      <div style={{ position: 'absolute', top: '50%', right: SP.xs, transform: 'translateY(-50%)' }}>
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

  // No label → the bare control (aria-label carries the name, byte-identical to
  // before). With a label, render it visibly above the control as a <span>
  // wired via aria-labelledby so the name persists after the placeholder clears.
  if (!label) return control;
  return (
    <div>
      <span id={labelId} style={{
        display: 'block', marginBottom: SP.xs,
        fontSize: FS.sm, fontWeight: 700, color: SECOND, fontFamily: sans,
      }}>
        {label}
      </span>
      {control}
    </div>
  );
}

/**
 * A labelled <select> matching Input's chrome — used by the security-question
 * pickers at sign-up. `ariaLabel` names the control (the visible label is the
 * chosen option text, not a persistent label), so it stays accessible without a
 * separate <label> element.
 */
export function Select({ value, onChange, ariaLabel, children }) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: `${SP.md}px ${SP.lg - 2}px`,
        // Same BORDER_STRONG outline as Input (clears the WCAG 1.4.11 3:1
        // UI-boundary floor) so the picker and the answer field below it match.
        border: `1px solid ${BORDER_STRONG}`,
        fontSize: FS['14'], fontFamily: sans,
        background: swatch.white, color: INK, outline: 'none',
        boxSizing: 'border-box', cursor: 'pointer',
      }}
    >
      {children}
    </select>
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
    error:   { bg: '#fdf4f4', border: '#e8b0b0', text: '#8b1a1a', Icon: AlertCircle },
    success: { bg: '#f0faf2', border: '#a8d8b0', text: '#1a4a20', Icon: CheckCircle },
    info:    { bg: '#fef9ee', border: GOLD, text: SECOND, Icon: Mail },
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
        // A rubric-ruled note above the form (never a tinted wash box): one drawn
        // rule in the tone's ink, the message in that ink. Roles + strings kept.
        display: 'flex', alignItems: 'flex-start', gap: SP.sm,
        padding: `${SP.sm + 2}px 0 ${SP.sm + 2}px ${SP.md}px`,
        borderLeft: `3px solid ${c.text}`,
        fontSize: FS.sm, color: c.text, lineHeight: 1.5,
      }}>
      <c.Icon size={16} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>{children}</span>
    </div>
  );
}

/** Role badge (developer / admin). Returns null for ordinary users. */
export function RoleBadge({ role }) {
  if (role === 'user') return null;
  const cfg = {
    developer: { color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', label: 'Developer', Icon: Shield },
    admin:     { color: '#dc2626', bg: 'rgba(220,38,38,0.12)', label: 'Admin', Icon: Shield },
  };
  const c = cfg[role] || cfg.admin;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 8px',
      background: c.bg, color: c.color,
      fontSize: FS.xxs, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      <c.Icon size={10} /> {c.label}
    </span>
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
    // Route the shell through the shared Page primitive at form width instead of
    // hand-rolling maxWidth + margin, so the auth routes share the one layout cap
    // every other top-level surface uses (P12). Materials stay flat — the plainest
    // page in the app (no scrim panel, no elevation); only the layout frame moves.
    <Page
      max={FORM_MAX}
      pad={`${SP.xxl}px 0`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
    >
      {/* Brand lockup doubles as the way back to the app. The dedicated auth
          routes render full-bleed (App suppresses the persistent nav on these
          surfaces), so without a home affordance here the only exits would be the
          browser Back button and the inter-mode footer links. The wordmark is a
          real anchor to /create (crawlable, middle-click-friendly) whose onClick
          preventDefaults into the SPA navigator — the same pattern the footer
          FooterLinks use. */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: SP.lg,
      }}>
        <a
          href={viewToPath('generate')}
          onClick={(e) => { e.preventDefault(); navigate('generate'); }}
          aria-label="SettlementForge home"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: SP.sm,
            textDecoration: 'none',
          }}
        >
          <MapIcon size={22} color={GOLD} />
          <span style={{
            fontSize: FS.xl, fontWeight: 700, color: GOLD, fontFamily: serif_,
            letterSpacing: '0.02em', textTransform: 'lowercase',
          }}>
            SettlementForge
          </span>
        </a>
      </div>

      <div style={{
        // The register-desk plate: a hairline frame, square-cut, no elevation
        // shadow (the plainest page in the app — the restraint law).
        background: CARD,
        border: `1px solid ${BORDER}`,
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
          marginTop: SP.lg, textAlign: 'center',
          fontSize: FS.sm, color: SECOND, fontFamily: sans, lineHeight: 1.6,
        }}>
          {footer}
        </div>
      )}
    </Page>
  );
}
