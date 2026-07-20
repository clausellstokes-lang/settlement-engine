/**
 * components/surveyor/CorpusFactoryPanel.jsx — THE CORPUS FACTORY (V-5, VISION WAVE).
 *
 * A Surveyor workshop stage: draft corpus prose (institution descriptions, NPC voice,
 * tradition motifs) with the METERED custom-content surface (or author it by hand), STAGE
 * every candidate with provenance, then REVIEW (approve / reject). Approval marks a
 * candidate eligible; canon itself is the owner's build-time fold — "Copy the canon leaf"
 * renders the exact APPROVED_CORPUS body for corpusStaging.js, which the owner commits and
 * regenerates (gen:compendium-data). Nothing here writes canon: the owner's taste is the
 * gate. Rides the FloatingAffordances lazy chunk (React.lazy'd by SurveyorWorkshop).
 */
import { useState, useMemo, useCallback } from 'react';
import { Check, X, Trash2 } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { getSurveyorAiCost } from '../../config/pricing.js';
import { serializeApprovedCorpus, CORPUS_KINDS } from '../../domain/compendium/corpusStaging.js';
import { track, EVENTS } from '../../lib/analytics.js';
import { t } from '../../copy/index.js';
import { INK, BODY, MUTED, BORDER, CARD_ALT, GOLD, SLATE, sans, FS, SP } from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';

const KIND_LABEL = { institutionDesc: 'Institution description', npcVoice: 'NPC voice', traditionMotif: 'Tradition motif' };
const inputStyle = {
  width: '100%', boxSizing: 'border-box', border: `1px solid ${BORDER}`, background: CARD_ALT,
  color: INK, padding: SP.sm, fontSize: FS.sm, fontFamily: sans,
};

/** Defensively pull prose text from a custom-content draft entry (field map varies by
 *  bucket). Prefers a description-like field, then the rationale, then any flavor field. */
function entryText(e) {
  const f = (e && typeof e.fields === 'object' && e.fields) ? e.fields : {};
  for (const k of ['description', 'summary', 'blurb', 'flavor', 'text', 'prose']) {
    if (typeof f[k] === 'string' && f[k].trim()) return f[k].trim();
  }
  if (typeof e?.rationale === 'string' && e.rationale.trim()) return e.rationale.trim();
  const firstStr = Object.values(f).find((v) => typeof v === 'string' && v.trim());
  return typeof firstStr === 'string' ? firstStr.trim() : '';
}
function entryTarget(e) {
  const f = (e && typeof e.fields === 'object' && e.fields) ? e.fields : {};
  for (const k of ['name', 'title', 'label']) {
    if (typeof f[k] === 'string' && f[k].trim()) return f[k].trim();
  }
  return typeof e?.bucket === 'string' ? e.bucket : '';
}

export default function CorpusFactoryPanel({ initialPrompt = '' }) {
  const candidates = useStore((s) => s.corpusCandidates);
  const stageCorpusCandidates = useStore((s) => s.stageCorpusCandidates);
  const reviewCorpusCandidate = useStore((s) => s.reviewCorpusCandidate);
  const removeCorpusCandidate = useStore((s) => s.removeCorpusCandidate);
  const settlement = useStore((s) => s.settlement);
  const savedSettlements = useStore((s) => s.savedSettlements);
  const campaigns = useStore((s) => s.campaigns);
  const activeCampaignId = useStore((s) => s.activeCampaignId);
  const creditBalance = useStore((s) => s.creditBalance);

  const [kind, setKind] = useState('institutionDesc');
  const [intent, setIntent] = useState(initialPrompt);
  const [manualTarget, setManualTarget] = useState('');
  const [manualText, setManualText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [leaf, setLeaf] = useState('');

  const activeCampaign = useMemo(
    () => (Array.isArray(campaigns) ? campaigns.find((c) => c && c.id === activeCampaignId) : null) || null,
    [campaigns, activeCampaignId],
  );
  const cost = getSurveyorAiCost('customContent');
  const list = useMemo(() => (Array.isArray(candidates) ? candidates : []), [candidates]);

  // Metered AI draft: reuse the custom-content surface; map each drafted entry into a
  // staged corpus candidate of the selected kind (the owner reviews before approving).
  const draftWithAi = useCallback(async () => {
    const q = intent.trim();
    if (!q || loading) return;
    setLoading(true); setError(null);
    try {
      const { compileCustomContent } = await import('../../lib/surveyorWrite.js');
      const res = await compileCustomContent({
        intent: q, settlement, savedSettlements, activeCampaign,
        worldState: activeCampaign?.worldState || null,
      });
      if (!res.ok) { setError(res.error || t('errors.corpusDeclined')); return; }
      const entries = Array.isArray(res.draft?.entries) ? res.draft.entries : [];
      const items = entries
        .map((e) => ({ kind, target: entryTarget(e), text: entryText(e) }))
        .filter((it) => it.text);
      if (items.length === 0) { setError(t('errors.corpusEmpty')); return; }
      stageCorpusCandidates(items, { model: 'claude-opus-4-8', promptFamily: 'custom-content' });
    } catch {
      setError(t('errors.corpusUnavailable'));
    } finally { setLoading(false); }
  }, [intent, loading, kind, settlement, savedSettlements, activeCampaign, stageCorpusCandidates]);

  const stageManual = useCallback(() => {
    const text = manualText.trim();
    if (!text) return;
    stageCorpusCandidates([{ kind, target: manualTarget.trim(), text }], { model: 'hand-authored', promptFamily: 'manual' });
    setManualTarget(''); setManualText('');
  }, [manualText, manualTarget, kind, stageCorpusCandidates]);

  const review = useCallback((id, status) => {
    reviewCorpusCandidate(id, status);
    track(EVENTS.SURVEYOR_ADOPTION, { surface: 'corpus', verdict: status === 'approved' ? 'accepted' : status === 'rejected' ? 'declined' : 'revised' });
  }, [reviewCorpusCandidate]);

  const copyLeaf = useCallback(async () => {
    const src = serializeApprovedCorpus(list);
    setLeaf(src);
    try { await navigator.clipboard.writeText(src); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* clipboard may be blocked — the textarea below is the fallback */ }
  }, [list]);

  const approvedCount = list.filter((c) => c.status === 'approved').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, fontFamily: sans, color: BODY }}>
      <p style={{ margin: 0, fontSize: FS.xs, color: MUTED, lineHeight: 1.45 }}>
        Draft corpus prose with the Surveyor or by hand, stage it with provenance, then approve. Approved
        candidates fold into canon only when you commit the leaf and regenerate — your taste stays the gate.
      </p>

      <div style={{ display: 'flex', gap: SP.xs, flexWrap: 'wrap' }}>
        {CORPUS_KINDS.map((k) => (
          <Button key={k} variant={kind === k ? 'aiSolid' : 'ai'} size="sm" onClick={() => setKind(k)}>{KIND_LABEL[k]}</Button>
        ))}
      </div>

      {/* Metered AI draft */}
      <textarea value={intent} onChange={(e) => setIntent(e.target.value)} rows={2}
        aria-label="Describe the corpus prose to draft" placeholder="e.g. three gravelly voice lines for a harbor-master…"
        style={inputStyle} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: FS.xs, color: MUTED }}>
          {cost} credit{cost === 1 ? '' : 's'} per draft{Number.isFinite(creditBalance) && <span> · {creditBalance} left</span>}
        </span>
        <Button variant="aiSolid" size="sm" busy={loading} disabled={!intent.trim()} onClick={draftWithAi}>
          {loading ? 'Drafting…' : 'Draft with the Surveyor'}
        </Button>
      </div>

      {/* Manual authoring path (always available) */}
      <details style={{ fontSize: FS.xs, color: MUTED }}>
        <summary style={{ cursor: 'pointer' }}>…or stage by hand</summary>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
          <input value={manualTarget} onChange={(e) => setManualTarget(e.target.value)} aria-label="Candidate target (name)" placeholder="Target (e.g. the institution or NPC)" style={inputStyle} />
          <textarea value={manualText} onChange={(e) => setManualText(e.target.value)} rows={2} aria-label="Candidate text" placeholder="The prose…" style={inputStyle} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="ai" size="sm" disabled={!manualText.trim()} onClick={stageManual}>Stage it</Button>
          </div>
        </div>
      </details>

      {error && <p style={{ margin: 0, fontSize: FS.sm, color: GOLD }}>{error}</p>}

      {/* Review the staging catalog */}
      {list.length > 0 && (
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm, display: 'flex', flexDirection: 'column', gap: SP.xs }}>
          <span style={{ fontSize: FS.xs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Staging catalog · {approvedCount}/{list.length} approved
          </span>
          {list.map((c) => (
            <div key={c.id} data-testid="corpus-candidate"
              style={{ border: `1px solid ${c.status === 'approved' ? GOLD : c.status === 'rejected' ? BORDER : SLATE}`, padding: SP.sm, opacity: c.status === 'rejected' ? 0.55 : 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs, fontSize: FS.xs, color: MUTED }}>
                <span style={{ color: INK }}>{KIND_LABEL[c.kind] || c.kind}</span>
                {c.target && <span>· {c.target}</span>}
                <span style={{ flex: 1 }} />
                <IconButton Icon={Check} label="Approve" size="sm" tone={c.status === 'approved' ? 'active' : 'default'} pressed={c.status === 'approved'} onClick={() => review(c.id, 'approved')} />
                <IconButton Icon={X} label="Reject" size="sm" tone={c.status === 'rejected' ? 'active' : 'default'} pressed={c.status === 'rejected'} onClick={() => review(c.id, 'rejected')} />
                <IconButton Icon={Trash2} label="Remove" size="sm" onClick={() => removeCorpusCandidate(c.id)} />
              </div>
              <p style={{ margin: 0, fontSize: FS.sm, color: BODY, lineHeight: 1.4 }}>{c.text}</p>
              <span style={{ fontSize: FS.xs, color: MUTED }}>
                {c.provenance?.source} · {c.provenance?.model} · {c.provenance?.promptFamily}
              </span>
            </div>
          ))}

          {/* The build-time fold: copy the canon leaf, commit it, regenerate. */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <span style={{ fontSize: FS.xs, color: MUTED }}>Fold {approvedCount} approved into canon (commit + `npm run gen:compendium-data`)</span>
            <Button variant="ai" size="sm" disabled={approvedCount === 0} onClick={copyLeaf}>
              {copied ? 'Copied' : 'Copy the canon leaf'}
            </Button>
          </div>
          {leaf && (
            <textarea readOnly value={leaf} rows={4} aria-label="The APPROVED_CORPUS leaf to commit"
              style={{ ...inputStyle, fontFamily: 'monospace', fontSize: FS.xs }} />
          )}
        </div>
      )}
    </div>
  );
}
