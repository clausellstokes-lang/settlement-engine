// HeraldSection.jsx — one report door's body (War / Faith / Trade / Events / the
// Divination feed). Renders the section-filed HeraldItems (heraldFeed) as the formal
// HERALD HEADLINE grammar, grouped by settlement (presence-over-repetition: the
// settlement name hoists to a group header, the nested headlines omit it). A live
// block (LiveWarStatus, PantheonPanel, TreatyPanel, RealmDocket) slots above via
// `children`.
//
// PRESENTATIONAL. Routing + normalization are upstream (heraldFeed); the headline
// grammar is HeraldHeadline. Sort here is severity-then-recency WITHIN a group; the
// alphabetical-by-settlement group order + the urgent pin (THE SORT LAW) land in
// Phase 4.

import { Section } from './WorldPulsePrimitives.jsx';
import HeraldHeadline, { HeraldGroupHeader } from './HeraldHeadline.jsx';
import { groupBySettlement } from './heraldGrammar.js';
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

/**
 * @param {object} props
 * @param {import('./heraldFeed.js').HeraldItem[]} props.items
 * @param {string} props.emptyLead   the calm empty-state line for this door
 * @param {any} [props.worldState]   for the article (cause walk)
 * @param {Map<string,string>} [props.nameById]
 * @param {import('react').ReactNode} [props.children]  a live block rendered above the feed
 * @param {string} [props.title]     the feed section heading
 */
export default function HeraldSection({ items = [], emptyLead, worldState, nameById, children, title = 'Since the last turning' }) {
  const groups = groupBySettlement(ordered(items), nameById || new Map());
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {children}
      <Section title={title} count={items.length}>
        {items.length === 0 ? (
          <div style={{ border: `1px dashed ${BORDER}`, padding: 14, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
            {emptyLead}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {groups.map(group => (
              <div key={group.settlementId || '__realm__'} style={{ display: 'grid', gap: 8 }}>
                <HeraldGroupHeader group={group} />
                {group.items.map(item => (
                  <HeraldHeadline
                    key={item.id}
                    item={item}
                    worldState={worldState}
                    nameById={nameById}
                    nested={group.settlementId != null}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
