/**
 * AccountSection.jsx — shared card-section chrome for the Account page.
 *
 * Extracted verbatim from AccountPage.jsx during decomposition so the
 * extracted Profile / Subscription / Support sub-components can each render
 * the same titled card without re-implementing it. Pure presentational
 * wrapper; no behavior change.
 *
 * `tone` drives the perceivable-level hierarchy (P4/P5). The page used to stack
 * six identical bordered cards, so grouping was asked of the borders rather than
 * spacing and every header read co-equal. Now:
 *   - feature  — the ONE conversion section (Subscription) keeps the full
 *                bordered card + tinted header strip, so it stands out as the
 *                single distinct surface P5 reserves a strong border for.
 *   - default  — utility sections drop the surrounding box for a hairline
 *                TOP-RULE only. The icon + serif title stays as the scan anchor,
 *                so each group is still instantly findable, while the page-level
 *                space-7 gaps (set in AccountPage) carry the grouping. Six
 *                co-equal boxes collapse toward the ~3 perceivable levels P4/P5
 *                want (page header → feature card → quiet utility groups).
 */
import { GOLD_DEEP, INK, BORDER, CARD, CARD_HDR, serif_, SP, R, FS } from '../theme.js';

export default function Section({ title, icon: Icon, tone = 'default', as = 'h2', children }) {
  const feature = tone === 'feature';
  const Title = as;
  const containerStyle = feature
    ? { border: `1px solid ${BORDER}`, borderRadius: R.xl, overflow: 'hidden', background: CARD }
    : { borderTop: `1px solid ${BORDER}` };
  return (
    <div style={containerStyle}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.sm,
        padding: feature ? `${SP.md}px ${SP.lg}px` : `${SP.md}px 0 0`,
        background: feature ? CARD_HDR : 'transparent',
      }}>
        {Icon && <Icon size={feature ? 18 : 16} color={GOLD_DEEP} />}
        <Title style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: feature ? 700 : 600, color: INK, margin: 0 }}>
          {title}
        </Title>
      </div>
      <div style={{ padding: feature ? `${SP.lg}px` : `${SP.md}px 0 0`, paddingTop: feature ? 0 : SP.md }}>
        {children}
      </div>
    </div>
  );
}
