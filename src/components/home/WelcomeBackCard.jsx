/**
 * WelcomeBackCard.jsx — return-visit personalization.
 *
 * Surfaces above the (signed-in) HomeHero when the user returns 24h+
 * after their last visit. Reads the most-recent saved settlement from
 * the store and offers a two-click resume.
 *
 * Self-gates on (GA — the welcomeBack flag was promoted and inlined):
 *   - useReturnVisit().isReturn     (24h+ since last visit)
 *   - auth.tier !== 'anon'          (anons have no saved settlement context)
 *   - lastSettlement present        (no point greeting an empty library)
 *
 * Renders nothing otherwise.
 */

import { useStore } from '../../store/index.js';
import { useReturnVisit } from '../../hooks/useReturnVisit.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { t } from '../../copy/index.js';
import { INK, BODY, BORDER, CARD, sans, serif_, FS, SP, R, GOLD_TXT, LANDING_MAX } from '../theme.js';
import Button from '../primitives/Button.jsx';

export default function WelcomeBackCard({ onOpen, onForge }) {
  const tier = useStore(s => s.auth.tier);
  const displayName = useStore(s => s.auth.displayName);
  const { isReturn, daysSinceLastVisit, lastSettlement } = useReturnVisit();

  if (tier === 'anon') return null;
  if (!isReturn) return null;
  if (!lastSettlement) return null;

  const handleOpen = () => {
    Funnel.track(EVENTS.WELCOME_BACK_OPEN_CLICKED, {
      settlementId: lastSettlement.id,
      daysSince: daysSinceLastVisit,
    });
    if (typeof onOpen === 'function') onOpen(lastSettlement);
  };

  const handleForge = () => {
    if (typeof onForge === 'function') onForge();
  };

  const name = displayName || 'there';
  const days = Math.max(1, daysSinceLastVisit);
  const settlementName = lastSettlement.name || 'your last settlement';

  // Flattened re-entry strip, not a second hero. The signed-in HomeHero below
  // is the dominant parchment gradient+shadow surface; matching that treatment
  // here produced two co-equal cards that failed the squint test. A plain CARD
  // fill + hairline border (no gradient, no shadow) drops this a clear elevation
  // level so the hero stays the single focal point, and the tighter bottom
  // margin groups it to the hero by spacing.
  return (
    <div style={{
      maxWidth: LANDING_MAX, margin: `${SP.lg}px auto ${SP.sm}px`,
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: R.lg, overflow: 'hidden',
      fontFamily: sans,
    }}>
      <div style={{ padding: SP.lg }}>
        <div style={{
          fontSize: FS.xs, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: GOLD_TXT,
        }}>
          {t('hero.welcomeBack.eyebrow') || 'Welcome back'}
        </div>
        <h2 style={{
          margin: '6px 0 0', fontFamily: serif_, fontWeight: 600,
          fontSize: FS.xxl, color: INK,
        }}>
          {t('hero.welcomeBack.titleTpl', { days: String(days), name }) ||
            `It's been ${days} days, ${name}.`}
        </h2>
        <p style={{
          margin: `${SP.sm}px 0 0`, fontSize: FS.sm, color: BODY,
          lineHeight: 1.55, fontFamily: serif_, fontStyle: 'italic',
        }}>
          {t('hero.welcomeBack.bodyTpl', { settlementName }) ||
            `How did your session in ${settlementName} go?`}
        </p>
        <div style={{ display: 'flex', gap: SP.sm, marginTop: SP.md, flexWrap: 'wrap' }}>
          {/* Both CTAs sit BELOW the signed-in hero's solid-gold "Generate"
              primary, which must stay the single gold focal point of the stack
              (P4). "Open" keeps the lead by position + outline emphasis (secondary,
              not gold) so two gold primaries don't sit one card apart; "Forge a
              follow-up" drops to ghost. */}
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleOpen}
          >
            {t('hero.welcomeBack.openCta', { settlementName }) || `Open ${settlementName}`}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleForge}
          >
            {t('hero.welcomeBack.followUp') || 'Forge a follow-up'}
          </Button>
        </div>
      </div>
    </div>
  );
}
