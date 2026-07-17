/**
 * components/surveyor/StyleOverhaulPanel.jsx — AI STYLE OVERHAUL (the S2→S3 trust rung).
 * A prompt + the dossier anchor compile into a CANDIDATE bespoke map style; the candidate is
 * projected through validateBespokeStyle (only known-role visual fields survive — truth-
 * projection by construction), previewed LIVE by rendering the settlement's town map under the
 * resolved candidate (read-only consumption of the pure domain renderer), then accepted as a
 * NAMED additive save into the bespokeStyles collection, or declined (nothing persists). The
 * rejected fields are listed honestly; base lenses are permanent and always one tap back.
 *
 * PERSISTENCE SEAM (owner-gated): the bespokeStyles STORAGE surface is an owner-gated schema —
 * no store verb exists yet (flagged in the S4-S6 fold). Accept therefore builds the additive
 * collection (the pure addBespokeStyle op) and holds it for the session; the durable write-back
 * is surfaced honestly as pending, never faked. Transport + renderer are dynamic-imported.
 */

import { useState, useCallback, useEffect } from 'react';
import { getSurveyorAiCost } from '../../config/pricing.js';
import { MUTED, BORDER, CARD_ALT, GREEN, sans, SP, R, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import Segmented from '../primitives/Segmented.jsx';
import Badge from '../primitives/Badge.jsx';
import { useSurveyorContext } from './useSurveyorContext.js';
import { MoneyLine, RefusalNote, MusingsBlock, Eyebrow, PromptArea } from './surveyorPanelKit.jsx';

const cost = getSurveyorAiCost('styleOverhaul');
const CANDIDATE_LENS = '__candidate__';
const DEFAULT_LENS_IDS = ['parchment', 'watercolor', 'darkFantasy', 'vtt'];
const LENS_LABEL = { parchment: 'Parchment', watercolor: 'Watercolor', darkFantasy: 'Dark', vtt: 'VTT' };

const slugify = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'bespoke-style';

export default function StyleOverhaulPanel() {
  const { creditBalance, ctx, settlement, savedSettlements } = useSurveyorContext();
  const previewSettlement = settlement || savedSettlements[0] || null;

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { style, violations, musings, byok } | { error }
  const [lens, setLens] = useState(CANDIDATE_LENS);
  const [previewSvg, setPreviewSvg] = useState('');
  const [styleName, setStyleName] = useState('');
  const [collection, setCollection] = useState({}); // session-held additive collection (owner-gated persistence)
  const [saved, setSaved] = useState(null); // { id, label } | null
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
      const id = slugify(q);
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
    const { addBespokeStyle } = await import('../../domain/townMap/bespokeStyles.js');
    const id = slugify(styleName);
    const next = addBespokeStyle(collection, id, style);
    setCollection(next);
    setSaved({ id, label: styleName || id });
  }, [result, styleName, collection]);

  const decline = useCallback(() => { setResult(null); setPreviewSvg(''); setSaved(null); }, []);

  const style = result?.style;
  const violations = result?.violations || [];
  const lensOptions = [
    { id: CANDIDATE_LENS, label: 'Candidate' },
    ...lensIds.map((id) => ({ id, label: LENS_LABEL[id] || id })),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
      <Eyebrow>Reskin the map — describe the look</Eyebrow>
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
          <Segmented options={lensOptions} value={lens} onChange={setLens} size="sm" ariaLabel="Preview lens" />
          {previewSvg ? (
            <div
              data-testid="style-preview"
              role="img"
              aria-label={lens === CANDIDATE_LENS ? 'Map preview under the candidate style' : `Map preview under the ${LENS_LABEL[lens] || lens} base lens`}
              style={{ border: `1px solid ${BORDER}`, borderRadius: R.md, overflow: 'hidden', background: CARD_ALT }}
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
                  <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>{String(v.field)}{v.reason ? ` — ${v.reason}` : ''}</span>
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
              style={{ flex: 1, minWidth: 120, fontSize: FS.sm, fontFamily: sans, border: `1px solid ${BORDER}`, borderRadius: R.sm, padding: `4px ${SP.sm}px` }}
            />
            <Button variant="aiSolid" size="sm" disabled={!styleName.trim()} onClick={accept}>Accept & save</Button>
            <Button variant="ghost" size="sm" onClick={decline}>Decline</Button>
          </div>

          {saved && (
            <div data-testid="style-saved" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, lineHeight: 1.5 }}>
              <span style={{ color: GREEN }}>◆</span> Saved this session as “{saved.label}”. The base lenses stay permanent;
              you can flip back anytime. Durable save across sessions is pending the owner’s storage-surface ruling.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
