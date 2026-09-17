/**
 * LegalRibbonRow.jsx — the app's one legal/commercial footer row (LD-3).
 *
 * Pricing · Feedback & support · Terms · Privacy · About, above the copyright and
 * the "Simulated, not AI-generated." line. Lifted VERBATIM out of App.jsx's global
 * footer when LD-3 (2026-08-01) ordered the landing page to end on its painting:
 * the landing stopped rendering the global footer, so this row became something
 * the landing band could carry WITHOUT forking the copy or the routes.
 *
 * ONE MOUNT NOW, ON EVERY ROUTE. The owner's order of 2026-09-16 ("the footer should
 * be the same way on every page", the way the header is) supersedes LD-3's landing
 * exemption: App.jsx's global footer renders on every route, the landing included,
 * and it is pinned at the viewport bottom on desktop. The landing band's own mount
 * and its `clearMobileNav` clearance were retired with it, because a second row on
 * the landing would be exactly the "two footers" LD-3 removed. The row's rendered
 * output inside the global footer is unchanged (that mount never passed the prop).
 *
 * STILL ITS OWN MODULE, FOR TWO REASONS THAT OUTLIVED THE SECOND MOUNT. A Terms or
 * Privacy link that silently drifts or disappears is a legal defect class, not a
 * cosmetic bug, so the row keeps one home (and routes.js still gives /pricing no
 * `nav:` block, so this row is the chrome's path to it). And the row resolves its
 * labels through `t` from copy/footer.js, the eager shell's own namespace: the
 * landing's local `tl` resolves the `landing.*` namespace, so `tl('footer.terms')`
 * would silently return the literal key string. Two identically-prefixed
 * namespaces through one resolver is the trap; a separate module cannot fall into
 * it.
 *
 * THE LINKS ROW IS THE FLOATING BAND. The owner's follow-up order of 2026-09-16 keeps
 * only the links row in view on desktop; the home button and the copyright line show
 * when the page is scrolled all the way down. The <nav> carries FOOTER_LINKS_ATTR
 * (lib/chromeInsets.js), the stable hook useChromeInsets measures the band by (it ends
 * at the top of the nav's next sibling) and the keyboard-reveal rule keys on. The
 * attribute changes nothing about how the row renders.
 *
 * EAGER BY CONSTRUCTION. App.jsx imports this module statically, so it lives in the
 * entry chunk. Defining a shared row inside a lazy chunk and importing it from
 * App.jsx is the lazy-import-reparents hazard: it would drag that closure into
 * first paint.
 *
 * @param {object}   props
 * @param {boolean}  props.isMobile        raises tap targets to the 44px floor
 * @param {Function} props.onNavigate      view id -> navigate (App's setView)
 * @param {boolean}  props.showHome        render the wordmark home button
 */
import HouseDevice from '../brand/HouseDevice.jsx';
import Button from '../primitives/Button.jsx';
import { t } from '../../copy/footer.js';
import { FOOTER_LINKS_ATTR, FS, PARCH_100, SP, sans } from '../theme.js';

const SEP = 'rgba(244,234,208,0.4)';

/** The shared link register — ghost buttons in the footer's parchment tone. */
const linkStyle = (isMobile) => ({
  color: PARCH_100, fontFamily: sans, fontSize: FS.sm, fontWeight: 500,
  letterSpacing: '0.04em', minHeight: isMobile ? 44 : undefined,
});

const Sep = () => <span aria-hidden="true" style={{ color: SEP }}>|</span>;

export default function LegalRibbonRow({
  isMobile = false, onNavigate, showHome = false, style,
}) {
  const link = linkStyle(isMobile);
  return (
    <div
      data-testid="legal-ribbon-row"
      style={{
        display: 'flex', flexDirection: 'column', gap: SP.sm, alignItems: 'center',
        textAlign: 'center', fontFamily: sans, fontSize: FS.sm,
        color: PARCH_100, letterSpacing: '0.04em', userSelect: 'none',
        ...style,
      }}
    >
      {/* Refunds is deliberately NOT its own link — the policy lives in the Terms
          "Refunds and cancellation" section (the /refunds URL still resolves).
          Feedback & support OPENS the feedback panel (W2-a-REVISED) through the
          app-wide 'sf:open-feedback' event; the old mailto: dependency is gone. */}
      <nav aria-label="Footer" {...{ [FOOTER_LINKS_ATTR]: '' }} style={{
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
        <Sep />
        {/* About keeps its mobile door here: §767.3(f) restored Realm to the
            bottom bar's five seats and About yielded its seat by priority. */}
        <Button variant="ghost" size="sm" onClick={() => onNavigate('about-what-this-is')} style={link}>
          {t('footer.about')}
        </Button>
      </nav>
      {showHome && (
        <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}
          aria-label="SettlementForge home" style={{ minHeight: isMobile ? 44 : undefined, minWidth: isMobile ? 44 : undefined }}>
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
