import { FS, ELEV } from '../theme.js';
/**
 * primitives/Card — Shared card chrome.
 *
 * The current codebase invents a card border + padding + background
 * combination per component. This unifies them so the campaign-state
 * UI (NextActionRail, ProvenanceBlock, OnboardingChecklist, etc.)
 * shares one visual language.
 *
 * Variants are bounded to keep the look consistent. Add a new variant
 * here rather than overriding via inline style at call sites.
 */

const VARIANTS = {
  default:    { bg: '#fffbf5', border: '#d2bd96', titleColor: '#1c1409' },
  suggestion: { bg: '#fff7ec', border: '#e0b070', titleColor: '#7a4f0f' },  // soft amber — for AI/onboarding hooks
  danger:     { bg: '#fff5f5', border: '#c89a9a', titleColor: '#8b1a1a' },
  info:       { bg: '#f0f4ff', border: '#c0c8e8', titleColor: '#2a3a7a' },
};

/**
 * @param {Object} props
 * @param {string} [props.title]
 * @param {React.ReactNode} [props.kicker]      tiny label rendered above the title
 * @param {keyof typeof VARIANTS} [props.variant='default']
 * @param {React.ReactNode} [props.actions]     right-aligned slot (buttons, hide, etc.)
 * @param {boolean} [props.compact]             reduces padding by ~30%
 * @param {React.ReactNode} props.children
 */
export default function Card({
  title, kicker, variant = 'default',
  actions, compact, children,
  ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.default;
  const pad = compact ? 8 : 12;
  return (
    <section
      style={{
        background: v.bg,
        border: `1px solid ${v.border}`,
        borderRadius: 6,
        padding: pad,
        // V-4: subtle ink-tinted lift so the shared card reads as a surface,
        // not a flat outline. ELEV[1] is the default-card tier.
        boxShadow: ELEV[1],
      }}
      {...rest}
    >
      {(title || kicker || actions) && (
        <header style={{
          display: 'flex', alignItems: 'baseline', gap: 8,
          marginBottom: title ? 6 : 0,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {kicker && (
              <div style={{
                fontSize: FS.xxs, fontWeight: 800,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: v.titleColor, opacity: 0.7,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                marginBottom: 2,
              }}>
                {kicker}
              </div>
            )}
            {title && (
              <h3 style={{
                margin: 0,
                fontSize: FS.md, fontWeight: 700,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: v.titleColor,
              }}>
                {title}
              </h3>
            )}
          </div>
          {actions && <div style={{ flexShrink: 0 }}>{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
