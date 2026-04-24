/**
 * TableOfContents — second page, indexes the dossier chapters.
 *
 * Driven by an `entries` array passed from SettlementPDF so that adding /
 * removing chapters in later phases automatically updates the ToC. We render
 * a simple two-column row per entry: zero-padded number, chapter title, and
 * optional muted note (e.g. "narrative + raw" hint).
 *
 * Page numbers are intentionally omitted in P0 — react-pdf can resolve them
 * via @react-pdf/renderer's bookmark / pageNumber API in a later polish pass.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { Section } from '../primitives/Section.jsx';
import { type, palette } from '../theme.js';

export function TableOfContents({ settlement, narrativeMode = false, entries = [] }) {
  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <Section eyebrow="Index" title="Contents">
        <View>
          {entries.map((entry, i) => (
            <View
              key={`toc-${i}`}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                paddingVertical: 6,
                borderBottom: i < entries.length - 1 ? `0.4pt solid ${palette.border}` : 'none',
              }}
            >
              <Text style={{ ...type.label_em, color: palette.gold, width: 30 }}>
                {String(i + 1).padStart(2, '0')}
              </Text>
              <Text style={{ ...type.body_em, flex: 1, color: palette.ink }}>{entry.title}</Text>
              {entry.note && (
                <Text style={{ ...type.caption, color: palette.muted }}>{entry.note}</Text>
              )}
            </View>
          ))}
        </View>
      </Section>
    </PageChrome>
  );
}

export default TableOfContents;
