/**
 * SettlementMapExportMenu — the per-settlement TOWN-MAP export affordance
 * (MAP EXPORTS). One control (an "Export" popover, bottom-right of the pane) that
 * downloads the settlement's map, under the CURRENT LENS, as:
 *   • SVG / PNG / JPEG / WebP at a selectable resolution (townMapExport.js),
 *   • the VTT / Foundry token-resolution battlemap PNG (renderTownMapTokenRaster),
 *   • a single-map PDF (townMapPdfExport.js — @react-pdf/renderer dynamically
 *     imported on click, so it never touches first paint).
 *
 * GATING — the EXACT single-dossier entitlement lane (owner ruling: the $2.99
 * per-settlement EXPORT BUNDLE). resolveExportAccess (the same decision the dossier
 * "Export" button + BuyThisDossier use) drives it, so ONE purchase / gate flips
 * EVERY export affordance for this settlement:
 *   • export-capable tier (premium / founder / elevated), OR a held durable right
 *     → the format controls;
 *   • otherwise → BuyThisDossier renders the matching unlock rung (the pricing
 *     moment) instead — never a new gate class.
 * The pane only mounts this for the OWNER's saved settlement (a saveId is present);
 * the public gallery view passes saveId=null, so anon/gallery gets NO export
 * affordance (v1 — the recorded seam).
 *
 * Posture: pure text controls + theme tokens (the map's icons-off posture, like
 * SettlementMapEditControls); accessible names via aria-label, never native title=.
 */
import { useEffect, useRef, useState } from 'react';
import Button from '../primitives/Button.jsx';
import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import BuyThisDossier, { resolveExportAccess } from '../BuyThisDossier.jsx';
import { BORDER, BORDER_STRONG, CARD, CARD_ALT, ELEV, FS, INK, MUTED, RED, SP, sans } from '../theme.js';
import {
  TOWN_MAP_EXPORT_FORMATS, TOWN_MAP_EXPORT_FORMAT_LABELS,
  TOWN_MAP_EXPORT_RESOLUTIONS, DEFAULT_EXPORT_RESOLUTION,
  downloadTownMapExport, downloadTownMapTokenRaster,
} from '../../lib/townMapExport.js';

/**
 * @param {{
 *   settlement: any,
 *   saveId?: string|number|null,
 *   style?: string,
 *   dress?: import('../../domain/townMap/groundDress.js').MapDress | null,
 *   mapEdits?: any,
 *   worldState?: any,
 *   regionalGraph?: any,
 *   audience?: 'dm'|'player'|'public',
 * }} props
 *   `style` is the pane's active lens — the export honors it. `dress` (IT-3, OPTIONAL) is the
 *   resolved season/state portrait so the exported file matches the on-screen season (WYSIWYG);
 *   absent ⇒ seasonless base bytes.
 */
export default function SettlementMapExportMenu({
  settlement,
  saveId = null,
  style,
  dress = null,
  mapEdits = null,
  worldState = null,
  regionalGraph = null,
  audience = 'dm',
}) {
  const [open, setOpen] = useState(false);
  const [resolution, setResolution] = useState(DEFAULT_EXPORT_RESOLUTION);
  const [busy, setBusy] = useState(null);   // which action id is running
  const [error, setError] = useState(null);
  const wrapRef = useRef(null);

  // The EXACT dossier export lane (owner ruling — the export bundle rides it).
  const authTier = useStore(s => s.auth?.tier);
  const canExportFreely = useStore(s => (typeof s.isElevated === 'function' && s.isElevated())
    || (typeof s.canExport === 'function' && s.canExport()));
  const cachedEntitlement = useStore(s => (saveId ? s.dossierEntitlements?.[saveId] : undefined));
  const refreshDossierEntitlement = useStore(s => s.refreshDossierEntitlement);
  const access = resolveExportAccess({
    tier: authTier, canExportFreely, saveId, entitled: cachedEntitlement === true,
  });

  // Fetch the durable-right flag once when a saved dossier is not export-capable
  // and nothing is cached yet — mirrors SettlementDetail / BuyThisDossier so a
  // held right lights the controls without a purchase prompt.
  useEffect(() => {
    if (access.reason === 'unpurchased' && cachedEntitlement === undefined && saveId
        && typeof refreshDossierEntitlement === 'function') {
      refreshDossierEntitlement(saveId);
    }
  }, [access.reason, cachedEntitlement, saveId, refreshDossierEntitlement]);

  // Outside-click / Escape dismiss (the MoreMenu idiom).
  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  if (!settlement) return null;

  const run = (id, fn) => async () => {
    if (busy) return;
    setBusy(id); setError(null);
    try {
      await fn();
    } catch {
      setError(t('errors.mapExport'));
    } finally {
      setBusy(null);
    }
  };

  const doImage = (format) => run(format, () => downloadTownMapExport(settlement, { format, resolution, style, dress }));
  const doToken = run('token', () => downloadTownMapTokenRaster(settlement));
  const doPdf = run('pdf', async () => {
    // Keep @react-pdf/renderer out of the town-map chunk's static graph — load the
    // builder (and the PDF stack it pulls) only on the actual PDF-export click.
    // The builder lives in src/utils (beside generateSettlementPDF) so its .jsx
    // import stays out of the tsc-checked .js tree (see its header).
    const { generateTownMapPdf } = await import('../../utils/townMapPdfExport.js');
    await generateTownMapPdf(settlement, { style, dress });
  });
  const doPortrait = (format) => run(`portrait-${format}`, async () => {
    // Complete-scene expansion, CPU rasterization, and GLB encoding remain in a
    // nested lazy worker. Merely opening Map or this menu downloads none of it.
    const { downloadTownSceneArtifact } = await import(
      '../../lib/townScene/townSceneExport.js'
    );
    await downloadTownSceneArtifact({
      settlement,
      mapEdits,
      worldState,
      regionalGraph,
      audience,
      format,
    });
  });

  return (
    <div ref={wrapRef} data-town-export style={wrapStyle}>
      <Button
        data-town-export-toggle
        variant={open ? 'primary' : 'secondary'}
        size="sm"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Export this settlement map"
        onClick={() => { setError(null); setOpen(v => !v); }}
        style={{ minHeight: 0, padding: '3px 10px' }}
      >
        Export
      </Button>

      {open && (
        <div role="menu" style={panelStyle}>
          {access.allowed ? (
            <>
              <span style={headerStyle}>Image</span>
              <div style={rowStyle}>
                {TOWN_MAP_EXPORT_FORMATS.map((fmt) => (
                  <Button
                    key={fmt}
                    data-town-export-format={fmt}
                    variant="ghost"
                    size="sm"
                    busy={busy === fmt}
                    disabled={!!busy}
                    onClick={doImage(fmt)}
                    aria-label={`Download this map as ${TOWN_MAP_EXPORT_FORMAT_LABELS[fmt]}`}
                    style={{ minHeight: 0, padding: '2px 8px' }}
                  >
                    {TOWN_MAP_EXPORT_FORMAT_LABELS[fmt]}
                  </Button>
                ))}
              </div>

              {/* A plain row, not a <label>: the select carries its own accessible
                  name via aria-label, so no label association is needed. */}
              <div style={labelStyle}>
                <span style={{ color: MUTED }}>Resolution</span>
                <select
                  data-town-export-resolution
                  value={resolution}
                  onChange={(e) => setResolution(Number(e.target.value))}
                  aria-label="Raster export resolution in pixels"
                  style={selectStyle}
                >
                  {TOWN_MAP_EXPORT_RESOLUTIONS.map((r) => (
                    <option key={r} value={r}>{`${r} px`}</option>
                  ))}
                </select>
              </div>

              <span style={headerStyle}>Dimensional portrait</span>
              <div style={rowStyle}>
                <Button
                  data-town-export-portrait-png
                  variant="ghost"
                  size="sm"
                  busy={busy === 'portrait-png'}
                  disabled={!!busy}
                  onClick={doPortrait('png')}
                  aria-label="Download a deterministic illustrated three-dimensional settlement portrait PNG"
                  style={{ minHeight: 0, padding: '2px 8px' }}
                >
                  Portrait PNG
                </Button>
                <Button
                  data-town-export-scene-glb
                  variant="ghost"
                  size="sm"
                  busy={busy === 'portrait-glb'}
                  disabled={!!busy}
                  onClick={doPortrait('glb')}
                  aria-label="Download the complete portable three-dimensional settlement scene as GLB"
                  style={{ minHeight: 0, padding: '2px 8px' }}
                >
                  Scene GLB
                </Button>
              </div>

              <span style={headerStyle}>Tabletop</span>
              <div style={rowStyle}>
                <Button
                  data-town-export-token
                  variant="ghost"
                  size="sm"
                  busy={busy === 'token'}
                  disabled={!!busy}
                  onClick={doToken}
                  aria-label="Download the VTT / Foundry token-resolution battlemap PNG"
                  style={{ minHeight: 0, padding: '2px 8px' }}
                >
                  VTT token PNG
                </Button>
                <Button
                  data-town-export-pdf
                  variant="ghost"
                  size="sm"
                  busy={busy === 'pdf'}
                  disabled={!!busy}
                  onClick={doPdf}
                  aria-label="Download this map as a single-page PDF"
                  style={{ minHeight: 0, padding: '2px 8px' }}
                >
                  Single-map PDF
                </Button>
              </div>
              {error && <span style={errStyle}>{error}</span>}
            </>
          ) : (
            <div style={{ display: 'grid', gap: SP.xs, justifyItems: 'center' }}>
              <span style={headerStyle}>Unlock exports</span>
              <BuyThisDossier settlement={settlement} saveId={saveId} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const wrapStyle = {
  position: 'absolute', bottom: SP.sm, right: SP.sm, zIndex: 4,
  display: 'inline-flex', fontFamily: sans,
};
const panelStyle = {
  position: 'absolute', bottom: 'calc(100% + 6px)', right: 0,
  display: 'flex', flexDirection: 'column', gap: SP.xs, minWidth: 210,
  padding: SP.sm, background: CARD_ALT, border: `1px solid ${BORDER_STRONG}`,
  boxShadow: ELEV[2],
};
const headerStyle = {
  fontSize: FS.xxs, fontWeight: 800, color: INK,
  textTransform: 'uppercase', letterSpacing: '0.06em',
};
const rowStyle = { display: 'flex', flexWrap: 'wrap', gap: 2 };
const labelStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: SP.xs, fontSize: FS.xs, fontFamily: sans,
};
const selectStyle = {
  minHeight: 28, padding: '3px 8px', border: `1px solid ${BORDER}`,
  background: CARD, color: INK, fontSize: FS.xs,
  fontFamily: sans, cursor: 'pointer',
};
const errStyle = { fontSize: FS.xs, color: RED };
