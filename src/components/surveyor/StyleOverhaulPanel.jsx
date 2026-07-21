/**
 * components/surveyor/StyleOverhaulPanel.jsx — AI STYLE OVERHAUL (the S2→S3 trust rung).
 * A prompt + the dossier anchor compile into a CANDIDATE bespoke map style; the candidate is
 * projected through validateBespokeStyle (only known-role visual fields survive — truth-
 * projection by construction), previewed LIVE by rendering the settlement's town map under the
 * resolved candidate (read-only consumption of the pure domain renderer), then accepted as a
 * NAMED additive save into the bespokeStyles collection, or declined (nothing persists). The
 * rejected fields are listed honestly; base lenses are permanent and always one tap back.
 *
 * PERSISTENCE (RULED — mapEdits.bespokeStyles, blob-resident + per-settlement): Accept builds
 * the additive collection (the pure addBespokeStyle op) and PERSISTS it onto the active saved
 * settlement's mapEdits via the existing applyMapEdit store verb (the same dumb, dormancy-lawful
 * setter every cosmetic map edit rides — in-memory + durable, drop-when-empty). A settlement not
 * yet saved has nowhere to persist, so accept honestly asks the user to save it first. Transport
 * + renderer are dynamic-imported; the map-edit domain ops ride the same lazy chunk.
 */

import { useState, useCallback, useEffect } from 'react';
import { useStore } from '../../store/index.js';
import { getSurveyorAiCost } from '../../config/pricing.js';
import { slugify } from '../../kernel/slugify.js';
import { MUTED, BORDER, CARD_ALT, GREEN, sans, SP, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import Segmented from '../primitives/Segmented.jsx';
import Badge from '../primitives/Badge.jsx';
import { useSurveyorContext } from './useSurveyorContext.js';
import { MoneyLine, RefusalNote, MusingsBlock, Eyebrow, PromptArea, ProposalSlipLine } from './surveyorPanelKit.jsx';

const cost = getSurveyorAiCost('styleOverhaul');
const CANDIDATE_LENS = '__candidate__';
const DEFAULT_LENS_IDS = ['parchment', 'watercolor', 'darkFantasy', 'vtt'];
const LENS_LABEL = { parchment: 'Parchment', watercolor: 'Watercolor', darkFantasy: 'Dark', vtt: 'VTT' };

/** The kernel slug primitive with this panel's namespace params (dash sep, 40-cap, fallback). */
const styleSlug = (s) => slugify(s, { max: 40, fallback: 'bespoke-style' });

export default function StyleOverhaulPanel({ initialPrompt = '' }) {
  const { creditBalance, ctx, settlement, savedSettlements, activeSaveId } = useSurveyorContext();
  const applyMapEdit = useStore((s) => s.applyMapEdit);
  const previewSettlement = settlement || savedSettlements[0] || null;

  // The DURABLE persist target: the active saved settlement (its blob carries mapEdits).
  // null ⇒ an unsaved draft with nowhere to persist (accept asks to save it first).
  const persistId = (activeSaveId != null && savedSettlements.some((s) => String(s?.id) === String(activeSaveId)))
    ? String(activeSaveId) : null;

  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { style, violations, musings, byok } | { error }
  const [lens, setLens] = useState(CANDIDATE_LENS);
  const [previewSvg, setPreviewSvg] = useState('');
  const [styleName, setStyleName] = useState('');
  const [saved, setSaved] = useState(null); // { id, label, persisted } | null
  const [lensIds, setLensIds] = useState(DEFAULT_LENS_IDS);

  // Fetch the canonical base-lens list lazily (avoids a hardcode drifting from the source).
  useEffect(() => {
    let live = true;
    import('../../domain/townMap/index.js').then((m) => {
      if (live && Array.isArray(m.TOWN_MAP_STYLE_IDS)) setLensIds(m.TOWN_MAP_STYLE_IDS);
    }).catch(() => { /* keep the default */ });
    return () => { live = false; };
  }, []);

  const compile = useCallback(async () => {
    const q = prompt.trim();
    if (!q || loading) return;
    setLoading(true); setResult(null); setSaved(null); setLens(CANDIDATE_LENS);
    try {
      const { compileStyleOverhaul } = await import('../../lib/surveyorWrite.js');
      const res = await compileStyleOverhaul({ ...ctx, prompt: q });
      if (!res.ok) { setResult({ error: res.error, refusalClass: res.refusalClass, doors: res.doors }); return; }
      const { validateBespokeStyle } = await import('../../design/townMapStyleWall.js');
      const id = styleSlug(q);
      const { style, violations } = validateBespokeStyle(res.candidate, { id, label: q.slice(0, 40) });
      setStyleName(q.slice(0, 40));
      setResult({ style, violations: Array.isArray(violations) ? violations : [], musings: res.musings, byok: res.byok, earlyAccess: res.earlyAccess });
    } catch {
      setResult({ error: 'The Surveyor is unavailable right now.' });
    } finally {
      setLoading(false);
    }
  }, [prompt, loading, ctx]);

  // LIVE PREVIEW — re-render the settlement's map whenever the candidate or the chosen lens
  // changes. Read-only consumption of the pure domain renderer (buildTownMapSvg); the candidate
  // is passed as a resolved style OBJECT (bypassing persisted styleLens entirely).
  useEffect(() => {
    let live = true;
    (async () => {
      const style = result?.style;
      if (!previewSettlement || (!style && lens === CANDIDATE_LENS)) { if (live) setPreviewSvg(''); return; }
      try {
        const { buildTownMapModel, buildTownMapSvg, hasDrawableMap } = await import('../../domain/townMap/index.js');
        const model = buildTownMapModel(previewSettlement, null);
        if (!hasDrawableMap(model)) { if (live) setPreviewSvg(''); return; }
        const styleArg = lens === CANDIDATE_LENS ? style : lens; // resolved object OR a base-lens id
        const svg = buildTownMapSvg(model, { style: styleArg, width: 300, height: 300 });
        if (live) setPreviewSvg(typeof svg === 'string' ? svg : '');
      } catch { if (live) setPreviewSvg(''); }
    })();
    return () => { live = false; };
  }, [result, lens, previewSettlement]);

  const accept = useCallback(async () => {
    const style = result?.style;
    if (!style) return;
    const id = styleSlug(styleName);
    // No saved target ⇒ nowhere to persist (unsaved draft): surface honestly, persist nothing.
    if (!persistId || typeof applyMapEdit !== 'function') { setSaved({ id, label: styleName || id, persisted: false }); return; }
    const { addBespokeStyle } = await import('../../domain/townMap/bespokeStyles.js');
    const { readMapEdits, readBespokeStyles, withBespokeStyles } = await import('../../domain/townMap/mapEdits.js');
    // Read the target's CURRENT blob FRESH from the store (no stale closure), so repeated
    // accepts accumulate additively over what is already durably saved.
    const target = useStore.getState().savedSettlements.find((s) => String(s?.id) === persistId);
    const targetEdits = readMapEdits(target?.settlement);
    const nextCollection = addBespokeStyle(readBespokeStyles(targetEdits), id, style);
    // withBespokeStyles preserves every OTHER edit (pins/lens/legend/annotations) and drops the
    // key when the collection is empty (dormancy). applyMapEdit takes the pre-normalized container.
    applyMapEdit(persistId, withBespokeStyles(targetEdits, nextCollection));
    setSaved({ id, label: styleName || id, persisted: true });
  }, [result, styleName, persistId, applyMapEdit]);

  const decline = useCallback(() => { setResult(null); setPreviewSvg(''); setSaved(null); }, []);

  const style = result?.style;
  const violations = result?.violations || [];
  const lensOptions = [
    { id: CANDIDATE_LENS, label: 'Candidate' },
    ...lensIds.map((id) => ({ id, label: LENS_LABEL[id] || id })),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
      <Eyebrow>Reskin the map: describe the look</Eyebrow>
      <PromptArea
        value={prompt}
        onChange={setPrompt}
        label="Describe the map style you want the Surveyor to compose"
        placeholder="e.g. a moody ink map, slate roofs, muted teal water, heavy contrast…"
        rows={2}
        disabled={loading}
      />
      <MoneyLine cost={cost} creditBalance={creditBalance} busy={loading} disabled={!prompt.trim()} onSubmit={compile}
        submitLabel="Compose style" busyLabel="Composing…" />

      {result?.error && <RefusalNote error={result.error} refusalClass={result.refusalClass} doors={result.doors} />}
      <MusingsBlock musings={result?.musings} />

      {style && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm }}>
          <Eyebrow>Live preview · flip back to a base lens anytime</Eyebrow>
          <ProposalSlipLine />
          <Segmented options={lensOptions} value={lens} onChange={setLens} size="sm" ariaLabel="Preview lens" />
          {previewSvg ? (
            <div
              data-testid="style-preview"
              role="img"
              aria-label={lens === CANDIDATE_LENS ? 'Map preview under the candidate style' : `Map preview under the ${LENS_LABEL[lens] || lens} base lens`}
              style={{ border: `1px solid ${BORDER}`, overflow: 'hidden', background: CARD_ALT }}
              dangerouslySetInnerHTML={{ __html: previewSvg }}
            />
          ) : (
            <p style={{ margin: 0, fontSize: FS.xs, color: MUTED }}>
              {previewSettlement ? 'This settlement has no drawable map to preview.' : 'Open a settlement to preview its map under this style.'}
            </p>
          )}

          {violations.length > 0 && (
            <div data-testid="style-violations" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Eyebrow>Fields the wall rejected · fell back to parchment</Eyebrow>
              {violations.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
                  <Badge tone="warning" size="sm">rejected</Badge>
                  <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>{String(v.field)}{v.reason ? `: ${v.reason}` : ''}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
            <input
              aria-label="Name this style"
              value={styleName}
              onChange={(e) => setStyleName(e.target.value)}
              placeholder="Name this style"
              style={{ flex: 1, minWidth: 120, fontSize: FS.sm, fontFamily: sans, border: `1px solid ${BORDER}`, padding: `4px ${SP.sm}px` }}
            />
            <Button variant="primary" size="sm" disabled={!styleName.trim()} onClick={accept}>Accept & save</Button>
            <Button variant="ghost" size="sm" onClick={decline}>Decline</Button>
          </div>

          {saved && (
            <div data-testid="style-saved" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, lineHeight: 1.5 }}>
              {saved.persisted ? (
                <>
                  <span style={{ color: GREEN }}>◆</span> Saved “{saved.label}” to this settlement’s map. It stays across
                  sessions. The base lenses stay permanent; you can flip back anytime.
                </>
              ) : (
                <>
                  <span style={{ color: GREEN }}>◆</span> Composed “{saved.label}”. Save this settlement to your library to
                  keep the style across sessions. The base lenses stay permanent; you can flip back anytime.
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
