/**
 * AccountSection.jsx — shared card-section chrome for the Account page.
 *
 * Extracted verbatim from AccountPage.jsx during decomposition so the
 * extracted Profile / Subscription / Support sub-components can each render
 * the same titled card without re-implementing it. Pure presentational
 * wrapper; no behavior change.
 *
 * `tone` drives the perceivable-level hierarchy (P4/P5). Every section sits on an
 * opaque card so its text is legible against the painted account background (the
 * earlier borderless "top-rule only" default tone washed out over account.jpg).
 * The hierarchy is carried by the header treatment rather than box-vs-no-box:
 *   - feature  — the ONE conversion section (Subscription) keeps a tinted, ruled
 *                header strip + heavier serif title, so it stands out as the
 *                single distinct surface P5 reserves the strong treatment for.
 *   - default  — utility sections share the same card with a PLAIN header (no
 *                tint, lighter title). The serif title stays the scan anchor and
 *                the page-level space-7 gaps (set in AccountPage) carry grouping,
 *                so the page still reads as page header → feature card → quiet
 *                utility cards rather than six co-equal boxes.
 */
import { INK, BORDER, CARD, CARD_HDR, serif_, SP, R, FS } from '../theme.js';

// Icons are suppressed on every surface but the Realm map (P7). The legacy
// `icon` prop is still accepted so callers don't have to be edited in lockstep,
// but it is intentionally not rendered — the serif title is the scan anchor.
export default function Section({ title, icon: _icon, tone = 'default', as = 'h2', children }) {
  const feature = tone === 'feature';
  const Title = as;
  // Every section sits on an OPAQUE card so its text reads — the account view
  // paints account.jpg through the content body at ~38%, which washed out the
  // borderless default sections. The feature-vs-default hierarchy is now carried
  // by the header treatment, not box-vs-no-box: the feature (conversion) section
  // keeps a tinted, ruled header strip + heavier title; default utility sections
  // get a plain header on the same card.
  const containerStyle = { border: `1px solid ${BORDER}`, borderRadius: R.xl, overflow: 'hidden', background: CARD };
  return (
    <div style={containerStyle}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.sm,
        padding: `${SP.md}px ${SP.lg}px`,
        background: feature ? CARD_HDR : 'transparent',
        borderBottom: feature ? `1px solid ${BORDER}` : 'none',
      }}>
        <Title style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: feature ? 700 : 600, color: INK, margin: 0 }}>
          {title}
        </Title>
      </div>
      <div style={{ padding: `0 ${SP.lg}px ${SP.lg}px` }}>
        {children}
      </div>
    </div>
  );
}
