/**
 * AccountSection.jsx — shared card-section chrome for the Account page.
 *
 * Extracted verbatim from AccountPage.jsx during decomposition so the
 * extracted Profile / Subscription / Support sub-components can each render
 * the same titled card without re-implementing it. Pure presentational
 * wrapper; no behavior change.
 */
import { GOLD, INK, BORDER, BORDER2, CARD, CARD_HDR, serif_, SP, R, FS } from '../theme.js';

export default function Section({ title, icon: Icon, children }) {
  return (
    <div style={{
      border: `1px solid ${BORDER}`, borderRadius: R.xl, overflow: 'hidden',
      background: CARD,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.sm,
        padding: `${SP.md}px ${SP.lg}px`,
        background: CARD_HDR, borderBottom: `1px solid ${BORDER2}`,
      }}>
        {Icon && <Icon size={16} color={GOLD} />}
        <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK }}>
          {title}
        </span>
      </div>
      <div style={{ padding: `${SP.lg}px` }}>
        {children}
      </div>
    </div>
  );
}
