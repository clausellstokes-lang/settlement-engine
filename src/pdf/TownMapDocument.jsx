/**
 * TownMapDocument — the standalone SINGLE-MAP PDF export (MAP EXPORTS).
 *
 * A minimal one-page react-pdf Document holding just the deterministic town-map
 * plate under the CURRENT LENS — the print twin of the pane's Map view, distinct
 * from the dossier's embedded 08C TownMapPlate chapter. It maps the SAME pure
 * draw-op list (domain/townMap/townMapDraw.js → buildTownMapDrawList) to react-pdf
 * Svg PRIMITIVES via the SHARED `renderTownMapOp` (exported from the plate) — one
 * op→primitive mapping, no drift.
 *
 * WYSIWYG: like the image exports (townMapExport.js) and the VTT token raster, the
 * single-map PDF honors the owner's cosmetic mapEdits AND the current lens. (The
 * dossier's 08C plate stays base-geometry — that is a separate, golden-pinned
 * surface and is untouched.)
 *
 * DETERMINISM: pure data → Svg, every color a concrete style-palette hex, every
 * hardcoded string ASCII (the PDF font-glyph discipline). The same (settlement,
 * lens) renders the same plate. Default Helvetica (react-pdf built-in) carries the
 * caption — no font registration, so this stays a self-contained one-page doc.
 *
 * LAZY: imported only by the on-click PDF builder (townMapPdfExport.js), itself
 * dynamically imported — so @react-pdf/renderer never enters first paint (the
 * vendor-pdf lazy contract, tests/build/vendorPdfLazy.test.js).
 */
import { Document, Page, View, Text, Svg, Rect } from '@react-pdf/renderer';
import {
  buildTownMapModel, buildTownMapDrawList,
  readMapEdits, readStyleLens, readBespokeStyles, coerceStyleId, resolveActiveStyle, hasDrawableMap,
} from '../domain/townMap/index.js';
import { pt } from './theme.js';
import { renderTownMapOp } from './sections/TownMapPlate.jsx';

// The plate's square vector box in PDF points — fits a Letter page (612×792pt)
// with comfortable margins. The model lives in a 0..1000 viewBox, so this is a
// pure scale.
const PLATE_PT = 500;

/**
 * @param {{ settlement: any, style?: string, dress?: import('../domain/townMap/groundDress.js').MapDress | null }} props
 *   `style` is the lens id to draw under (the pane's active lens); omitted falls
 *   back to the settlement's persisted styleLens. `dress` (IT-3, OPTIONAL) carries the
 *   season/state portrait so the PDF plate matches the on-screen season (WYSIWYG);
 *   absent ⇒ seasonless base bytes.
 */
export function TownMapDocument({ settlement, style, dress = null }) {
  const model = buildTownMapModel(settlement, readMapEdits(settlement));

  // A map-less settlement still yields a valid one-page document (a short note),
  // so the export never emits a corrupt / zero-page PDF.
  if (!hasDrawableMap(model)) {
    return (
      <Document>
        <Page size="LETTER" style={docPage}>
          <Text style={{ fontSize: pt['12'] }}>This settlement has no drawable town map.</Text>
        </Page>
      </Document>
    );
  }

  // THE SKIN REGISTRY (IT-4): resolve the ACTIVE style through the saved bespoke collection so a
  // worn skin renders here in lockstep with the pane + image export (the WYSIWYG law). A base lens
  // id and a stale/absent bespoke id both fall through to resolveTownMapStyle (parchment-safe).
  const collection = readBespokeStyles(readMapEdits(settlement));
  const styleId = style != null ? coerceStyleId(style, Object.keys(collection)) : readStyleLens(readMapEdits(settlement));
  const st = resolveActiveStyle(styleId, collection);
  const ops = buildTownMapDrawList(model, st, dress);
  const name = typeof settlement?.name === 'string' && settlement.name.trim()
    ? settlement.name.trim()
    : 'Settlement';

  return (
    <Document>
      <Page size="LETTER" style={docPage}>
        <Text style={{ fontSize: pt['16'], fontWeight: 700, marginBottom: 4, color: st.palette.ink }}>{name}</Text>
        <Text style={{ fontSize: pt['9'], marginBottom: 12, color: st.palette.ink }}>
          {`Town map (${st.label} lens)`}
        </Text>
        <View style={{ borderRadius: 3, padding: 2, backgroundColor: st.background }}>
          <Svg width={PLATE_PT} height={PLATE_PT} viewBox="0 0 1000 1000">
            <Rect x={0} y={0} width={1000} height={1000} fill={st.background} />
            {ops.map(renderTownMapOp)}
          </Svg>
        </View>
        <Text style={{ fontSize: pt['7.5'], marginTop: 10, color: st.palette.ink }}>
          A deterministic plan derived from the settlement roster; the same settlement always draws the same map.
        </Text>
      </Page>
    </Document>
  );
}

const docPage = { padding: 48, alignItems: 'center' };

export default TownMapDocument;
