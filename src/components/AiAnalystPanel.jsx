/**
 * components/AiAnalystPanel.jsx — the analyst chat panel (Surveyor S1).
 *
 * A LAZY, self-contained floating panel (the FeedbackWidget shape): it owns its
 * open/query state, reads the campaign read-model from the store, and calls the analyst
 * transport — which it DYNAMIC-imports, so the transport + its brief-composer graph
 * never touch first paint. Mounted once from App.jsx via React.lazy, so the whole panel
 * chunk is off the entry closure (zero eager bytes; verify:dist enforces it).
 *
 * The audience toggle is the visible face of the STRUCTURAL audience rule: "Player-safe"
 * routes the question through player projections only; the server enforces it again.
 * Styling uses this tree's theme vocabulary + primitives only (no raw buttons/colors).
 */

import { useState, useMemo, useCallback } from 'react';
import { X, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { useStore } from '../store/index.js';
import { useRoute } from '../hooks/useRoute.js';
import { getSurveyorAiCost } from '../config/pricing.js';
import { deriveAnchor, anchorSettlement } from '../domain/ai/contextAnchor.js';
import { suggestedQuestions } from '../domain/ai/suggestedQuestions.js';
import { INK, BODY, MUTED, BORDER, CARD, CARD_ALT, GOLD, RED, sans, serif_, SP, R, FS } from './theme.js';
import Button from './primitives/Button.jsx';
import IconButton from './primitives/IconButton.jsx';
import Segmented from './primitives/Segmented.jsx';

const AUDIENCE_OPTIONS = [
  { id: 'dm', label: 'DM (full truth)' },
  { id: 'player', label: 'Player-safe' },
];

export default function AiAnalystPanel({ visible = true }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [audience, setAudience] = useState('dm'); // 'dm' | 'player'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'up' | 'down' | null

  const settlement = useStore((s) => s.settlement);
  const savedSettlements = useStore((s) => s.savedSettlements);
  const campaigns = useStore((s) => s.campaigns);
  const activeCampaignId = useStore((s) => s.activeCampaignId);
  const selectedSettlementId = useStore((s) => s.selectedSettlementId);
  const creditBalance = useStore((s) => s.creditBalance);

  const activeCampaign = useMemo(
    () => (Array.isArray(campaigns) ? campaigns.find((c) => c && c.id === activeCampaignId) : null) || null,
    [campaigns, activeCampaignId],
  );
  const worldState = activeCampaign?.worldState || null;
  const settlements = useMemo(
    () => (Array.isArray(savedSettlements) ? savedSettlements.map((s) => ({ id: s?.id, name: s?.name })) : []),
    [savedSettlements],
  );
  const cost = getSurveyorAiCost('analysis');

  // §2c THE CONTEXT ANCHOR — the panel follows the page: it derives the scope from the
  // current route + selection so the "Reading: …" label + the default retrieval scope
  // track what the DM is looking at (the §3c honesty made tangible).
  const { view, params } = useRoute();
  const anchor = useMemo(
    () => deriveAnchor({ view, params, selectedSettlementId, settlement, savedSettlements, activeCampaign, tick: worldState?.tick ?? null }),
    [view, params, selectedSettlementId, settlement, savedSettlements, activeCampaign, worldState?.tick],
  );
  // the settlement the anchor points at — the analyst's DEFAULT retrieval scope
  const anchoredSettlement = useMemo(
    () => anchorSettlement(anchor, { settlement, savedSettlements }) || settlement,
    [anchor, settlement, savedSettlements],
  );
  // §2c THE ZERO-COST EMPTY STATE — read-model-derived questions, no provider call.
  const suggestions = useMemo(
    () => suggestedQuestions(anchor, { settlement: anchoredSettlement, worldState }),
    [anchor, anchoredSettlement, worldState],
  );

  const ask = useCallback(async (override) => {
    const q = (typeof override === 'string' ? override : question).trim();
    if (!q || loading) return;
    setQuestion(q);
    setLoading(true);
    setResult(null);
    setFeedback(null);
    try {
      const { askAnalyst } = await import('../lib/aiAnalyst.js');
      const res = await askAnalyst({
        // the ANCHOR is the default retrieval scope: the analyst reads what the DM sees
        question: q, worldState, settlements, settlement: anchoredSettlement, tick: worldState?.tick || 0, audience,
      });
      setResult(res);
    } catch {
      setResult({ error: 'The analyst is unavailable right now.' });
    } finally {
      setLoading(false);
    }
  }, [question, loading, worldState, settlements, anchoredSettlement, audience]);

  const rate = useCallback(async (accepted) => {
    setFeedback(accepted ? 'up' : 'down');
    try {
      const { recordAnalystFeedback } = await import('../lib/aiAnalyst.js');
      recordAnalystFeedback(accepted);
    } catch { /* telemetry is best-effort */ }
  }, []);

  if (!visible) return null;

  const dockPos = { position: 'fixed', left: SP.lg, bottom: SP.lg, zIndex: 60, fontFamily: sans };

  if (!open) {
    return (
      <div style={dockPos}>
        <Button
          variant="ai"
          size="sm"
          icon={<Sparkles size={14} />}
          onClick={() => setOpen(true)}
          aria-label="Open the campaign analyst"
        >
          Ask the analyst
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        ...dockPos,
        width: 340, maxWidth: 'calc(100vw - 32px)', background: CARD, color: BODY,
        border: `1px solid ${BORDER}`, borderRadius: R.lg, padding: SP.lg,
        boxShadow: '0 8px 28px rgba(0,0,0,0.28)', display: 'flex', flexDirection: 'column', gap: SP.sm,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: sans, fontSize: FS.md, fontWeight: 700, color: INK }}>Campaign analyst</span>
        <IconButton Icon={X} label="Close the analyst" size="sm" onClick={() => setOpen(false)} />
      </div>

      {/* §2c THE CONTEXT ANCHOR — VISIBLE: transparency about what the analyst reads.
          It follows the page (dossier ⇒ settlement · realm ⇒ realm · chronicle ⇒ advance). */}
      <div
        data-testid="surveyor-anchor"
        aria-label={anchor.label}
        style={{
          fontSize: FS.xs, color: MUTED, fontFamily: sans, background: CARD_ALT,
          border: `1px solid ${BORDER}`, borderRadius: R.sm, padding: `2px ${SP.sm}px`,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}
      >
        {anchor.label}
      </div>

      {/* Audience toggle — the visible face of the structural audience rule. */}
      <Segmented options={AUDIENCE_OPTIONS} value={audience} onChange={setAudience} size="sm" ariaLabel="Answer audience" />

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        aria-label="Your question for the campaign analyst"
        placeholder={audience === 'player' ? 'Ask something safe to share with the party…' : 'Ask about factions, wars, standings, secrets…'}
        rows={2}
        style={{
          width: '100%', boxSizing: 'border-box', resize: 'vertical', borderRadius: R.md,
          border: `1px solid ${BORDER}`, background: CARD_ALT, color: INK, padding: SP.sm,
          fontSize: FS.sm, fontFamily: sans,
        }}
      />

      {/* Per-question estimated cost (task-priced ⇒ flat per answer) + the live balance. */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
          {cost} credit{cost === 1 ? '' : 's'} per answer
          {Number.isFinite(creditBalance) && <span> · {creditBalance} left</span>}
        </span>
        <Button variant="aiSolid" size="sm" busy={loading} disabled={!question.trim()} onClick={() => ask()}>
          {loading ? 'Thinking…' : 'Ask'}
        </Button>
      </div>

      {/* §2c THE ZERO-COST EMPTY STATE — read-model-derived suggested questions (no AI
          cost until asked). One tap stages the question; the DM still presses Ask. */}
      {!result && !loading && !question.trim() && suggestions.length > 0 && (
        <div data-testid="surveyor-suggestions" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Try asking
          </span>
          {suggestions.map((q, i) => (
            <Button key={i} variant="ai" size="sm" onClick={() => setQuestion(q)} style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
              {q}
            </Button>
          ))}
        </div>
      )}

      {result && (
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {result.error ? (
            <p style={{ fontSize: FS.sm, color: RED, margin: 0, lineHeight: 1.45 }}>{result.error}</p>
          ) : (
            <>
              <div style={{ fontSize: FS.sm, color: BODY, whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>{result.answer}</div>
              {Array.isArray(result.claims) && result.claims.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: FS.xs, color: MUTED }}>
                  {result.claims.map((c, i) => (
                    <li key={i} style={{ marginBottom: 2 }}>
                      {/* Naming hygiene (§3c): the PUBLIC receipt name, never the internal id. */}
                      {c.sourced
                        ? <span style={{ color: GOLD }}>◆ {c.label || 'the campaign record'}</span>
                        : <span style={{ color: MUTED }}>◇ the engine does not record this</span>}
                    </li>
                  ))}
                </ul>
              )}
              {/* §3b TWO-VOICES: the MUSING register — visibly distinct from the cited
                  report above. Serif + italic + a gold rule + a plain "suggestion"
                  label mark it as what COULD BE; it is never cited and never a control. */}
              {Array.isArray(result.musings) && result.musings.length > 0 && (
                <div
                  data-testid="analyst-musings"
                  style={{
                    borderLeft: `2px solid ${GOLD}`, paddingLeft: SP.sm,
                    display: 'flex', flexDirection: 'column', gap: 4,
                  }}
                >
                  <span style={{ fontSize: FS.xs, color: GOLD, fontFamily: sans, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    The Surveyor muses · suggestions, not the record
                  </span>
                  {result.musings.map((m, i) => (
                    <p key={i} style={{ margin: 0, fontSize: FS.sm, color: MUTED, fontStyle: 'italic', fontFamily: serif_, lineHeight: 1.5 }}>
                      {m.text}
                    </p>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: SP.sm, alignItems: 'center', fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
                <span>Cited {result.claims?.filter((c) => c.sourced).length ?? 0}/{result.claims?.length ?? 0}</span>
                {result.byok && <span aria-label="Answered on your own provider key">· BYOK</span>}
                <span style={{ flex: 1 }} />
                <IconButton Icon={ThumbsUp} label="Answer was helpful" size="sm" onClick={() => rate(true)} aria-pressed={feedback === 'up'} />
                <IconButton Icon={ThumbsDown} label="Answer was not helpful" size="sm" onClick={() => rate(false)} aria-pressed={feedback === 'down'} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
