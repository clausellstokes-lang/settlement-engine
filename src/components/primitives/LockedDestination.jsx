/**
 * LockedDestination.jsx — Reusable "this destination sells itself" card.
 *
 * The critique's X-7 was explicit: locked-tier features shouldn't be
 * modal walls or quiet "upgrade to access" toasts. They should be
 * destinations the user lands on that pitch themselves — a preview
 * screenshot of the actual feature + a one-paragraph value pitch + a
 * primary CTA.
 *
 * Used by:
 *   - MapWanderer.jsx       — wanderer navigates to World Map
 *   - NeighbourWanderer.jsx — wanderer navigates to Neighbour view
 *   - WorkshopLocked.jsx    — free user navigates to Workshop
 *   - VersionsTab.jsx       — already has a hand-rolled version of this;
 *                             will fold into this primitive in a follow-up.
 *
 * Self-gates on nothing — the parent decides when to render us. We're a
 * pure presentation component. Fires the supplied trackEvent on mount
 * (once per session via useFunnelEvent) so the consumer doesn't need
 * to.
 */

import { useEffect } from 'react';
import { FS, swatch } from '../theme.js';
import { useStore } from '../../store/index.js';
import { Funnel } from '../../lib/analytics.js';

const PARCH = '#FBF5E6';
const PARCH_GRAD_HI = '#FCF6E7';
const VIOLET = '#7B4FCF';
const VIOLET_DIM = '#EBE2FA80';
const GOLD = '#C9A24C';
const INK = '#1B1408';
const BODY = '#4A3B22';
const MUTED = '#9C8068';
const BORDER = '#E8D9B0';

const sans = '"Nunito", system-ui, sans-serif';
const serif = '"Crimson Text", Georgia, serif';

/**
 * @param {Object} props
 * @param {string} props.feature                — display label ("World Map", "Workshop", etc.)
 * @param {string} props.eyebrow                — e.g. "Cartographer · Map"
 * @param {string} props.headline               — serif H2
 * @param {string} props.body                   — one-paragraph pitch
 * @param {string} [props.previewImageSrc]      — optional screenshot src
 * @param {string} [props.previewAlt]           — alt text for the screenshot
 * @param {string} [props.ctaLabel='Upgrade — $6/mo']
 * @param {Function} [props.onCta]              — defaults to opening the purchase modal
 * @param {string} [props.secondaryLink]        — optional "See sample →" link href
 * @param {string} [props.trackEvent]           — analytics event fired on mount
 */
export default function LockedDestination({
  feature,
  eyebrow,
  headline,
  body,
  previewImageSrc,
  previewAlt,
  ctaLabel = 'Upgrade — $6/mo',
  onCta,
  secondaryLink,
  trackEvent,
}) {
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);

  // Fire the mount event once per session per feature. We don't need
  // the rising-edge plumbing of useFunnelEvent here because the
  // component only mounts when the user has navigated to the locked
  // destination — the navigation IS the rising edge.
  useEffect(() => {
    if (!trackEvent) return;
    const key = `sf:locked_shown:${feature}`;
    try {
      if (typeof sessionStorage !== 'undefined') {
        if (sessionStorage.getItem(key) === '1') return;
        sessionStorage.setItem(key, '1');
      }
    } catch { /* storage unavailable; fire anyway */ }
    Funnel.track(trackEvent, { feature });
  }, [trackEvent, feature]);

  const handleCta = () => {
    if (typeof onCta === 'function') {
      onCta();
    } else if (typeof setPurchaseModalOpen === 'function') {
      setPurchaseModalOpen(true);
    }
  };

  return (
    <div
      role="region"
      aria-label={`${feature} — Cartographer feature locked`}
      style={{
        maxWidth: 720, margin: '40px auto',
        padding: 32,
        background: `linear-gradient(135deg, ${PARCH_GRAD_HI}, ${PARCH})`,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        boxShadow: '0 6px 24px rgba(27,20,8,0.10)',
        fontFamily: sans,
      }}
    >
      <div style={{
        display: 'inline-block',
        padding: '3px 10px',
        background: VIOLET_DIM,
        color: VIOLET,
        borderRadius: 4,
        fontSize: FS.xxs, fontWeight: 800,
        letterSpacing: '0.14em', textTransform: 'uppercase',
      }}>
        {eyebrow}
      </div>

      <h2 style={{
        margin: '12px 0 8px',
        fontFamily: serif, fontWeight: 600, fontSize: FS['28'],
        color: INK, letterSpacing: '-0.005em',
        lineHeight: 1.15,
      }}>
        {headline}
      </h2>

      <p style={{
        margin: 0, maxWidth: 600,
        fontSize: FS.lg, color: BODY, lineHeight: 1.6,
      }}>
        {body}
      </p>

      {previewImageSrc && (
        <div style={{
          marginTop: 24,
          padding: 8,
          background: swatch.white,
          border: `1px solid ${BORDER}`,
          borderRadius: 6,
          boxShadow: '0 4px 16px rgba(27,20,8,0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <img
            src={previewImageSrc}
            alt={previewAlt || `${feature} preview`}
            style={{
              display: 'block',
              width: '100%', maxHeight: 320,
              objectFit: 'cover', objectPosition: 'top',
              opacity: 0.55,
              filter: 'saturate(0.7)',
              borderRadius: 4,
            }}
          />
          <div style={{
            position: 'absolute', inset: 8,
            background: `linear-gradient(to bottom, transparent 30%, ${PARCH} 90%)`,
            borderRadius: 4,
            pointerEvents: 'none',
          }} />
        </div>
      )}

      <div style={{
        marginTop: 24,
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <button
          type="button"
          onClick={handleCta}
          style={{
            padding: '10px 18px',
            background: VIOLET, color: swatch.white,
            border: 'none', borderRadius: 4,
            fontSize: FS.md, fontWeight: 700, fontFamily: sans,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(123,79,207,0.35)',
          }}
        >
          {ctaLabel}
        </button>
        {secondaryLink && (
          <a
            href={secondaryLink}
            style={{
              fontSize: FS.sm, color: GOLD, fontWeight: 700,
              textDecoration: 'underline', fontFamily: sans,
            }}
          >
            See sample →
          </a>
        )}
        <span style={{
          marginLeft: 'auto',
          fontSize: FS.xs, color: MUTED, fontStyle: 'italic',
        }}>
          Free 7-day trial · cancel anytime
        </span>
      </div>
    </div>
  );
}
