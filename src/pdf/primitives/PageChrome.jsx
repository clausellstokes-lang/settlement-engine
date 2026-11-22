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
import { Page, View, Text } from '@react-pdf/renderer';
import { sheet, palette, type, page as pageGeo, pt } from '../theme.js';

// ⛔ A FIXED TEXT CARRIES NO lineHeight (LANDING-7 lane C, 2026-11-06). @react-pdf/layout
// re-resolves a page's ALREADY-resolved styles on every relayout of a page split
// (relayoutPage → resolvePageStyles), and a resolved lineHeight is a bare number, so each
// pass multiplies it by the fontSize again. A body node passes through a few relayouts; a
// FIXED node is carried to every page of the chapter and compounds without bound —
// `type.caption`'s 1.35 became 10.8 on page 1, 3.5e5 on page 2, ×64 a page after, and
// 6.4e21 on page 11, where pdfkit refused the footer's border ("unsupported number"), so no
// chapter of eleven pages or more could print (the metropolis Institutions chapter). The
// footer is one line, so the font's own leading is the right one: the caption's family and
// size, nothing to re-multiply. Pinned by tests/pdf/pageChromeFixedLeading.test.jsx.
const FOOTER_TEXT = { fontFamily: type.caption.fontFamily, fontSize: type.caption.fontSize, color: palette.faint };

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
            <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.ai }}>AI NARRATIVE</Text>
          </View>
        ) : (
          <Text style={{ ...type.label, color: palette.faint, fontSize: pt['7.5'] }}>
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
        <Text style={FOOTER_TEXT}>SettlementForge</Text>
        <Text
          style={FOOTER_TEXT}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </View>
    </Page>
  );
}

export default PageChrome;
