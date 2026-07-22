// HeraldSection.jsx — one report door's body (War / Faith / Trade / Events).
// Renders the section-filed HeraldItems (from heraldFeed.buildHeraldFeed) as the
// existing OutcomeCard, which already carries the News Address Law's linked subject
// chain (AddressChain) + affected settlements. A live block (LiveWarStatus,
// PantheonPanel, TreatyPanel) may be slotted above via `children`.
//
// PRESENTATIONAL. The routing + normalization are done upstream (heraldFeed); this
// only orders and renders. Sort: severity-first then recency within — the
// alphabetical-by-settlement grouping + urgent pin (THE SORT LAW) land in Phase 4.

import { OutcomeCard, Pill, Section } from './WorldPulsePrimitives.jsx';
import { BORDER, CARD_ALT, FS, MUTED, sans } from '../theme.js';

/** Severity-first, then most-recent, then a stable id tiebreak (codepoint). */
function ordered(items = []) {
  return [...items].sort((a, b) => {
    if (b.severity !== a.severity) return b.severity - a.severity;
    const ta = a.tick == null ? -1 : a.tick;
    const tb = b.tick == null ? -1 : b.tick;
    if (tb !== ta) return tb - ta;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}

/** The non-canonical provenance chip (canon/derived stay silent). */
function ProvenanceChip({ provenance }) {
  if (provenance === 'canon') return null;
  return <Pill tone={provenance === 'covert' ? 'major' : 'neutral'}>{provenance}</Pill>;
}

/**
 * @param {object} props
 * @param {import('./heraldFeed.js').HeraldItem[]} props.items
 * @param {string} props.emptyLead   the calm empty-state line for this door
 * @param {import('react').ReactNode} [props.children]  a live block rendered above the feed
 * @param {string} [props.title]     the feed section heading (default "Since the last turning")
 */
export default function HeraldSection({ items = [], emptyLead, children, title = 'Since the last turning' }) {
  const list = ordered(items);
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {children}
      <Section title={title} count={list.length}>
        {list.length === 0 ? (
          <div style={{ border: `1px dashed ${BORDER}`, padding: 14, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
            {emptyLead}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map(item => (
              <OutcomeCard
                key={item.id}
                title={item.headline}
                summary={item.summary}
                severity={item.severity}
                reasons={item.reasons}
                subject={item.subject}
                affectedIds={item.affectedIds}
                tone={item.major ? 'major' : 'normal'}
                details={item.provenance !== 'canon' ? [item.provenance] : []}
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

export { ProvenanceChip };
