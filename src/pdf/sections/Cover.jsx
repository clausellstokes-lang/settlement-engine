/**
 * Cover — full-bleed first page of the dossier.
 *
 * Clean type-first cover (no procedural crest). Big serif title, gold rule,
 * italic subtitle line built from tier · race · region. Bottom strap shows
 * brand wordmark and date. If the export was triggered from the AI narrative
 * view, an AI NARRATIVE EDITION badge sits below the subtitle so the printed
 * artifact telegraphs which lens was active when it was made.
 */
import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { sheet, palette, type, page as pageGeo } from '../theme.js';

export function Cover({ settlement, narrativeMode = false }) {
  const date = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const name = settlement?.name || 'Unnamed Settlement';
  const tier = settlement?.tier || '';
  const race = settlement?.dominantRace || settlement?.race || '';
  const region = settlement?.terrain || settlement?.region || '';
  const subtitleParts = [tier, race, region].filter(Boolean);

  return (
    <Page size={pageGeo.A4.size} style={sheet.coverPage}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 60,
          paddingVertical: 60,
          position: 'relative',
        }}
      >
        {/* Top eyebrow */}
        <Text style={{ ...type.cover_meta, color: palette.muted }}>SETTLEMENT DOSSIER</Text>

        {/* Centered title block */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={type.cover_title}>{name}</Text>
          <View
            style={{
              height: 2,
              width: 80,
              backgroundColor: palette.gold,
              marginTop: 18,
              marginBottom: 18,
            }}
          />
          {subtitleParts.length > 0 && (
            <Text
              style={{
                fontFamily: 'Lora',
                fontSize: 16,
                color: palette.second,
                fontStyle: 'italic',
                lineHeight: 1.4,
              }}
            >
              {subtitleParts.join('  ·  ')}
            </Text>
          )}
          {narrativeMode && (
            <View
              style={{
                marginTop: 28,
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: palette.aiTint,
                alignSelf: 'flex-start',
                borderRadius: 3,
                borderLeft: `2pt solid ${palette.ai}`,
              }}
            >
              <Text style={{ ...type.label, color: palette.ai }}>AI NARRATIVE EDITION</Text>
            </View>
          )}
        </View>

        {/* Bottom strap */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingTop: 12,
            borderTop: `0.5pt solid ${palette.border}`,
          }}
        >
          <Text style={{ ...type.cover_meta, color: palette.faint }}>SETTLEMENTFORGE</Text>
          <Text style={{ ...type.cover_meta, color: palette.faint }}>{date}</Text>
        </View>
      </View>
    </Page>
  );
}

export default Cover;
