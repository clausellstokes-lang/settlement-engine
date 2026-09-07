/**
 * legal/LegalPage.jsx — the shared frame for the /terms, /privacy, /refunds
 * pages, plus the small prose helpers those pages compose from.
 *
 * One reading column (PROSE_MAX), the canonical PageHeader, and a visible
 * "under review" banner stamped with POLICY_STATUS + the effective date, so a
 * reader always knows this is an honest working draft, not reviewed legal text.
 *
 * Prose helpers (LegalSection / LegalP / LegalList) keep the three pages
 * consistent and route every color through a theme token (no raw hex → no
 * visual-budget ratchet growth).
 */
import Page from '../primitives/Page.jsx';
import PageHeader from '../primitives/PageHeader.jsx';
import { PROSE_MAX, INK, BODY, GOLD_DEEP, BORDER, CARD, serif_, sans, FS, SP } from '../theme.js';
import { POLICY_STATUS, POLICY_EFFECTIVE } from '../../lib/policyVersion.js';

/** A titled prose section. */
export function LegalSection({ heading, id, children }) {
  return (
    <section aria-labelledby={id} style={{ marginTop: SP.xl }}>
      <h2 id={id} style={{
        margin: 0, fontFamily: serif_, fontSize: FS.xl, fontWeight: 700,
        color: INK, lineHeight: 1.2,
      }}>
        {heading}
      </h2>
      {children}
    </section>
  );
}

/** A prose paragraph in the reading column. */
export function LegalP({ children }) {
  return (
    <p style={{
      margin: `${SP.sm}px 0 0`, fontFamily: sans, fontSize: FS.md,
      lineHeight: 1.7, color: BODY,
    }}>
      {children}
    </p>
  );
}

/** A bulleted list of prose points. */
export function LegalList({ items }) {
  return (
    <ul style={{
      margin: `${SP.sm}px 0 0`, paddingLeft: SP.lg,
      fontFamily: sans, fontSize: FS.md, lineHeight: 1.7, color: BODY,
    }}>
      {items.map((it, i) => (
        <li key={i} style={{ marginTop: SP.xs }}>{it}</li>
      ))}
    </ul>
  );
}

export default function LegalPage({ eyebrow, title, subtitle, children }) {
  return (
    <Page max={PROSE_MAX}>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />

      {/* Under-review banner — this is a first honest draft, version-stamped so a
          reader never mistakes it for reviewed legal text. */}
      <div role="note" style={{
        marginBottom: SP.lg, padding: `${SP.sm}px ${SP.md}px`,
        background: CARD, border: `1px solid ${BORDER}`,
        borderLeft: `4px solid ${GOLD_DEEP}`,
        fontFamily: sans, fontSize: FS.xs, color: BODY, lineHeight: 1.5,
      }}>
        <strong style={{ color: INK }}>{POLICY_STATUS}.</strong>{' '}
        This page is a working draft written from how the product actually
        behaves. It is not yet reviewed legal text. Last updated {POLICY_EFFECTIVE}.
      </div>

      {children}
    </Page>
  );
}
