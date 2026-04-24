/**
 * PageChrome — wraps a Page with consistent header / footer / page-number.
 *
 * Every interior page in the dossier (everything except the cover) is built
 * by passing children to <PageChrome>. It renders an absolute-positioned
 * header (settlement name + edition badge) and footer (brand + page X / Y)
 * inside the marginTop / marginBottom regions of the page, leaving the body
 * area free for section content.
 *
 * The narrativeMode flag swaps the right-hand header chip for a purple "AI
 * NARRATIVE" tag so a quick fan of the printed copy reads at-a-glance which
 * pages came from the AI lens vs raw data.
 */
import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import { sheet, palette, type, page as pageGeo } from '../theme.js';

export function PageChrome({ settlement, narrativeMode = false, children, ...pageProps }) {
  const name = settlement?.name || 'Settlement';

  return (
    <Page size={pageGeo.A4.size} style={sheet.page} wrap {...pageProps}>
      {/* ── Fixed header ──────────────────────────────────────────────── */}
      <View
        fixed
        style={{
          position: 'absolute',
          top: 22,
          left: pageGeo.A4.marginH,
          right: pageGeo.A4.marginH,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `0.5pt solid ${palette.border}`,
          paddingBottom: 6,
        }}
      >
        <Text style={{ ...type.label, color: palette.muted }}>{name}</Text>
        {narrativeMode ? (
          <View
            style={{
              backgroundColor: palette.aiTint,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 2,
            }}
          >
            <Text style={{ ...type.label, fontSize: 7.5, color: palette.ai }}>AI NARRATIVE</Text>
          </View>
        ) : (
          <Text style={{ ...type.label, color: palette.faint, fontSize: 7.5 }}>
            SETTLEMENT DOSSIER
          </Text>
        )}
      </View>

      {/* ── Page body ─────────────────────────────────────────────────── */}
      {children}

      {/* ── Fixed footer ──────────────────────────────────────────────── */}
      <View
        fixed
        style={{
          position: 'absolute',
          bottom: 24,
          left: pageGeo.A4.marginH,
          right: pageGeo.A4.marginH,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `0.5pt solid ${palette.border}`,
          paddingTop: 6,
        }}
      >
        <Text style={{ ...type.caption, color: palette.faint }}>SettlementForge</Text>
        <Text
          style={{ ...type.caption, color: palette.faint }}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </View>
    </Page>
  );
}

export default PageChrome;
