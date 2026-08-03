/**
 * LegalRibbonRow.jsx — the app's one legal/commercial footer row (LD-3).
 *
 * Pricing · Feedback & support · Terms · Privacy, above the copyright and the
 * "Simulated, not AI-generated." line. Lifted VERBATIM out of App.jsx's global
 * footer when LD-3 ordered the landing page to END ON THE PAINTING: the landing
 * route stops rendering the global footer, so this row had to become something
 * the landing band could carry WITHOUT forking the copy or the routes.
 *
 * MIGRATED, NEVER DUPLICATED. There is exactly one row module and both callers
 * mount it: App.jsx's global footer (every non-landing route) and the landing
 * band's own footer. A second hand-rolled row on the landing would be the
 * projection-as-second-truth class — and on THIS content it is a legal defect
 * class, since a Terms/Privacy link that silently drifts or disappears is not a
 * cosmetic bug. LD-3 adds Pricing to the migration list for the commercial
 * equivalent: routes.js gives /pricing no `nav:` block, so the footer is the
 * landing's ONLY path to it.
 *
 * EAGER BY CONSTRUCTION, AND THE IMPORT RUNS DOWNWARD. App.jsx imports this
 * module statically, so it lives in the entry chunk; the LAZY landing chunk
 * imports it FROM there. The reverse — a shared row defined inside the landing
 * chunk and imported by App.jsx — is the lazy-import-reparents hazard: it would
 * drag the whole below-fold closure into first paint.
 *
 * ONE COPY TRUTH, AND THE NAMESPACE TRAP IT AVOIDS. The row resolves its labels
 * through `t` from copy/footer.js — the eager shell's own namespace. This is
 * why it is a MODULE and not a block pasted into LandingBelowFold: that file's
 * local `tl` resolves the `landing.footer` namespace, so `tl('footer.terms')`
 * would silently return the literal key string rather than "Terms". Two
 * identically-prefixed namespaces through one resolver is the trap; a separate
 * module cannot fall into it.
 *
 * @param {object}   props
 * @param {boolean}  props.isMobile        raises tap targets to the 44px floor
 * @param {Function} props.onNavigate      view id -> navigate (App's setView)
 * @param {boolean}  props.showHome        render the wordmark home button
 * @param {boolean}  props.clearMobileNav  reserve space above the FIXED mobile
 *   bottom nav. The landing sets this: HomeLanding deliberately cancels main's
 *   mobile bottom pad, and the global footer's own padding was the only thing
 *   keeping landing content clear of the bar — suppressing that footer removes
 *   the clearance, so the row carries it. A bare safe-area inset does NOT cover
 *   the bar (~57px + inset), which is why this composes the frozen chrome token
 *   through bottomClearance rather than inventing a number.
 */
import HouseDevice from '../brand/HouseDevice.jsx';
import Button from '../primitives/Button.jsx';
import { t } from '../../copy/footer.js';
import { CHROME, FS, PARCH_100, SP, bottomClearance, sans } from '../theme.js';

const SEP = 'rgba(244,234,208,0.4)';

/** The shared link register — ghost buttons in the footer's parchment tone. */
const linkStyle = (isMobile) => ({
  color: PARCH_100, fontFamily: sans, fontSize: FS.sm, fontWeight: 500,
  letterSpacing: '0.04em', minHeight: isMobile ? 44 : undefined,
});

const Sep = () => <span aria-hidden="true" style={{ color: SEP }}>|</span>;

export default function LegalRibbonRow({
  isMobile = false, onNavigate, showHome = false, clearMobileNav = false, style,
}) {
  const link = linkStyle(isMobile);
  return (
    <div
      data-testid="legal-ribbon-row"
      style={{
        display: 'flex', flexDirection: 'column', gap: SP.sm, alignItems: 'center',
        textAlign: 'center', fontFamily: sans, fontSize: FS.sm,
        color: PARCH_100, letterSpacing: '0.04em', userSelect: 'none',
        ...(clearMobileNav && isMobile
          ? { paddingBottom: bottomClearance(CHROME.footerPadMobile) }
          : null),
        ...style,
      }}
    >
      {/* Refunds is deliberately NOT its own link — the policy lives in the Terms
          "Refunds and cancellation" section (the /refunds URL still resolves).
          Feedback & support OPENS the feedback panel (W2-a-REVISED) through the
          app-wide 'sf:open-feedback' event; the old mailto: dependency is gone. */}
      <nav aria-label="Footer" style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: SP.md, flexWrap: 'wrap',
      }}>
        <Button variant="ghost" size="sm" onClick={() => onNavigate('pricing')} style={link}>
          {t('footer.pricing')}
        </Button>
        <Sep />
        <Button
          variant="ghost"
          size="sm"
          aria-haspopup="dialog"
          onClick={() => window.dispatchEvent(new CustomEvent('sf:open-feedback'))}
          style={link}
        >{t('footer.contact')}</Button>
        <Sep />
        <Button variant="ghost" size="sm" onClick={() => onNavigate('terms')} style={link}>
          {t('footer.terms')}
        </Button>
        <Sep />
        <Button variant="ghost" size="sm" onClick={() => onNavigate('privacy')} style={link}>
          {t('footer.privacy')}
        </Button>
      </nav>
      {showHome && (
        <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}
          aria-label="SettlementForge home" style={{ minHeight: isMobile ? 44 : undefined }}>
          <HouseDevice size={20} />
        </Button>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
        <span>{t('footer.copyright', { year: 2026 })}</span>
        <span aria-hidden="true" style={{ color: SEP }}>·</span>
        <span style={{ fontStyle: 'italic' }}>{t('footer.antiAi')}</span>
      </div>
    </div>
  );
}
