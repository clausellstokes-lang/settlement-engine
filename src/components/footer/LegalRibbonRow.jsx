/**
 * LegalRibbonRow.jsx — the app's one legal/commercial footer row (LD-3).
 *
 * Pricing · Feedback & support · Terms · Privacy · About · Guide · Roadmap, above the
 * copyright and the "Simulated, not AI-generated." line. Lifted VERBATIM out of App.jsx's global
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
 * ABOUT APPEARS ONCE PER SURFACE (the owner, ODQ §934.26 addendum). The row's About link
 * was the phone's door to /about back when the bar's five-seat cap evicted About. The bar
 * now carries About at every width it draws, and the painted arrow's sixth plate carries
 * it above 1024, so the footer link had become the SECOND door on every surface. Which
 * links render is decided by `footerLinks` below — one predicate over the one nav order,
 * never a second hard-coded list.
 *
 * @param {object}   props
 * @param {boolean}  props.isMobile        raises tap targets to the 44px floor, AND
 *                                         selects which primary-nav set the row defers to
 * @param {Function} props.onNavigate      view id -> navigate (App's setView)
 * @param {boolean}  props.showHome        render the wordmark home button
 * @enforced-by tests/components/landingFooterMigration.test.jsx
 */
import { Fragment } from 'react';
import HouseDevice from '../brand/HouseDevice.jsx';
import Button from '../primitives/Button.jsx';
import { t } from '../../copy/footer.js';
import { barNav } from '../../lib/routes.js';
import { FOOTER_LINKS_ATTR, FS, PARCH_100, SP, sans } from '../theme.js';

const SEP = 'rgba(244,234,208,0.4)';

/**
 * THE ROW'S LINKS, AS DATA. They were seven hand-written buttons with a separator
 * between each pair; the order below is the rendered order and is unchanged.
 *
 * `view` is the route a link opens. A link with no `view` opens something else — the
 * feedback panel, through the app-wide event — and is therefore never a duplicate of a
 * nav destination.
 * @type {ReadonlyArray<Readonly<{ key: string, view?: string, feedback?: boolean }>>}
 */
const LINKS = Object.freeze([
  Object.freeze({ key: 'footer.pricing', view: 'pricing' }),
  Object.freeze({ key: 'footer.contact', feedback: true }),
  Object.freeze({ key: 'footer.terms', view: 'terms' }),
  Object.freeze({ key: 'footer.privacy', view: 'privacy' }),
  Object.freeze({ key: 'footer.about', view: 'about-what-this-is' }),
  // ⛔ THE TWO ORPHANS (2026-09-18). /about/guide (the Practical Guide) and /roadmap had
  // NO inbound link anywhere outside lib/routes.js: neither carries a `nav:` block,
  // nothing on any page pointed at either, and the only ways in were the sitemap and
  // typing the URL. They sit beside About because the Guide IS the About family's
  // operational half, and the roadmap is the one page that says what is coming.
  Object.freeze({ key: 'footer.guide', view: 'about-guide' }),
  Object.freeze({ key: 'footer.roadmap', view: 'roadmap' }),
]);

/**
 * ⭐ A DESTINATION APPEARS ONCE PER SURFACE (the owner, ODQ §934.26 addendum): "About
 * appears once per surface." A link whose route the PRIMARY NAV already shows at this
 * width is not a second door, it is the same door drawn twice — and the one the reader
 * scans first is the nav.
 *
 * ⛔ ONE PREDICATE, NOT TWO LISTS, AND IT IS WIDTH-CORRECT BY CONSTRUCTION. `barNav()` is
 * the single nav order (lib/routes.js): at 1024 px and up the painted arrow draws exactly
 * NAV, which is `barNav(false)`; from 640 to 1023 the bottom bar draws the same six; below
 * 640 it draws `barNav(true)`, the five without the Realm. So ONE call answers "what does
 * the primary nav show here" at every width — and if a destination ever leaves the nav,
 * its footer link comes back with no edit here, which a pair of hard-coded lists could
 * never do.
 *
 * Today this hides exactly one link: About, at every width — from the arrow's sixth plate
 * on desktop and the tablet bar, and from the phone's bar. `footer.about` stays in the
 * dictionary and in LINKS deliberately: the rule is a live predicate, not a deletion.
 *
 * @param {boolean} isMobile the phone flag (useIsMobile(), the 640 breakpoint)
 * @returns {ReadonlyArray<typeof LINKS[number]>}
 */
export function footerLinks(isMobile) {
  const shownByNav = new Set(barNav(isMobile).map((item) => item.id));
  return LINKS.filter((row) => !(row.view && shownByNav.has(row.view)));
}

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
          app-wide 'sf:open-feedback' event; the old mailto: dependency is gone.
          WHICH links render is `footerLinks` above: a destination the primary nav
          already shows at this width is not drawn twice (ODQ §934.26 addendum). */}
      <nav aria-label="Footer" {...{ [FOOTER_LINKS_ATTR]: '' }} style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: SP.md, flexWrap: 'wrap',
      }}>
        {/* One button per link the predicate keeps, with the separator BETWEEN them —
            so removing a link never leaves a stray bar at the end of the row. */}
        {footerLinks(isMobile).map((row, i) => (
          <Fragment key={row.key}>
            {i > 0 && <Sep />}
            <Button
              variant="ghost"
              size="sm"
              aria-haspopup={row.feedback ? 'dialog' : undefined}
              onClick={row.feedback
                ? () => window.dispatchEvent(new CustomEvent('sf:open-feedback'))
                : () => onNavigate(row.view)}
              style={link}
            >
              {t(row.key)}
            </Button>
          </Fragment>
        ))}
      </nav>
      {showHome && (
        <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}
          aria-label="SettlementForge home" style={{ minHeight: isMobile ? 44 : undefined, minWidth: isMobile ? 44 : undefined }}>
          <HouseDevice size={20} alt="" />
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
