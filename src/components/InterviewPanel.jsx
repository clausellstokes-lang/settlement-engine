/**
 * components/InterviewPanel.jsx — THE INTERVIEW panel (Surveyor, V-1 VISION WAVE).
 *
 * The analyst panel's sibling and a DESTINATION of THE ONE DOOR: SurveyorDoor owns open
 * state; this panel renders the correspondence and calls the interview transport — which
 * it DYNAMIC-imports, so the transport + its brief graph never touch first paint. It
 * rides the FloatingAffordances lazy chunk, off the entry closure (verify:dist enforces).
 *
 * The answer renders in TWO REGISTERS from the server's per-segment breakdown: a CITED
 * segment carries receipt chips (the world-truth basis, deep-linkable to the V-4
 * cause-walk); a CONJECTURE segment is styled distinctly — the product never dresses a
 * guess as record.
 */

import { useState, useMemo, useCallback } from 'react';
import { X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useStore } from '../store/index.js';
import { useRoute } from '../hooks/useRoute.js';
import { getSurveyorAiCost } from '../config/pricing.js';
import { deriveAnchor, anchorSettlement } from '../domain/ai/contextAnchor.js';
import { suggestedQuestions } from '../domain/ai/suggestedQuestions.js';
import { t } from '../copy/index.js';
import { INK, BODY, MUTED, BORDER, CARD, CARD_ALT, GOLD, RED, SLATE, sans, serif_, SP, FS } from './theme.js';
import Button from './primitives/Button.jsx';
import IconButton from './primitives/IconButton.jsx';
import Segmented from './primitives/Segmented.jsx';

const AUDIENCE_OPTIONS = [
  { id: 'dm', label: 'DM (full truth)' },
  { id: 'player', label: 'Player-safe' },
];

function confidenceBand(v) {
  if (typeof v !== 'number') return null;
  if (v >= 0.75) return 'well-settled';
  if (v >= 0.5) return 'partly settled';
  return 'mostly conjecture';
}

export default function InterviewPanel({ open = false, onClose, initialQuestion = '' }) {
  const [question, setQuestion] = useState(initialQuestion);
  const [audience, setAudience] = useState('dm');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState(null);

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

  const { view, params } = useRoute();
  const anchor = useMemo(
    () => deriveAnchor({ view, params, selectedSettlementId, settlement, savedSettlements, activeCampaign, tick: worldState?.tick ?? null }),
    [view, params, selectedSettlementId, settlement, savedSettlements, activeCampaign, worldState?.tick],
  );
  const anchoredSettlement = useMemo(
    () => anchorSettlement(anchor, { settlement, savedSettlements }) || settlement,
    [anchor, settlement, savedSettlements],
  );
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
      const { askInterview } = await import('../lib/interview.js');
      const res = await askInterview({
        question: q, worldState, settlements, settlement: anchoredSettlement, tick: worldState?.tick || 0, audience,
      });
      setResult(res);
    } catch {
      setResult({ error: 'The Interview is unavailable right now.' });
    } finally {
      setLoading(false);
    }
  }, [question, loading, worldState, settlements, anchoredSettlement, audience]);

  const rate = useCallback(async (accepted) => {
    setFeedback(accepted ? 'up' : 'down');
    try {
      const { recordInterviewFeedback } = await import('../lib/interview.js');
      recordInterviewFeedback(accepted);
    } catch { /* telemetry is best-effort */ }
  }, []);

  if (!open) return null;

  const dockPos = { position: 'fixed', left: SP.lg, bottom: SP.lg, zIndex: 60, fontFamily: sans };
  const band = result ? confidenceBand(result.confidence) : null;
  const citedCount = Array.isArray(result?.segments) ? result.segments.filter((s) => s.register === 'cited').length : 0;

  return (
    <div
      style={{
        ...dockPos,
        width: 360, maxWidth: 'calc(100vw - 32px)', background: CARD, color: BODY,
        border: `1px solid ${SLATE}`, padding: SP.lg,
        display: 'flex', flexDirection: 'column', gap: SP.sm,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: sans, fontSize: FS.md, fontWeight: 700, color: INK }}>The Interview</span>
        <IconButton Icon={X} label="Close the Interview" size="sm" onClick={onClose} />
      </div>

      <div
        data-testid="interview-anchor"
        aria-label={anchor.label}
        style={{
          fontSize: FS.xs, color: MUTED, fontFamily: sans, background: CARD_ALT,
          border: `1px solid ${BORDER}`, padding: `2px ${SP.sm}px`,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}
      >
        {anchor.label}
      </div>

      <Segmented options={AUDIENCE_OPTIONS} value={audience} onChange={setAudience} size="sm" ariaLabel="Answer audience" />

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        aria-label="Your question for the Interview"
        placeholder={audience === 'player' ? 'Ask something safe to share with the party…' : 'Why does the temple hate the guild? Is the road safe? …'}
        rows={2}
        style={{
          width: '100%', boxSizing: 'border-box', resize: 'vertical',
          border: `1px solid ${BORDER}`, background: CARD_ALT, color: INK, padding: SP.sm,
          fontSize: FS.sm, fontFamily: sans,
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
          {cost} credit{cost === 1 ? '' : 's'} per answer
          {Number.isFinite(creditBalance) && <span> · {creditBalance} left</span>}
        </span>
        <Button variant="aiSolid" size="sm" busy={loading} disabled={!question.trim()} onClick={() => ask()}>
          {loading ? 'Asking…' : 'Ask the world'}
        </Button>
      </div>

      {!result && !loading && !question.trim() && suggestions.length > 0 && (
        <div data-testid="interview-suggestions" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
              <div data-testid="interview-correspondence" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span className="sf-smallcap" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>{t('surveyorDoor.youAsked')}</span>
                <p style={{ margin: 0, fontSize: FS.sm, color: INK, fontFamily: serif_, fontStyle: 'italic', lineHeight: 1.45 }}>{question}</p>
              </div>

              {/* THE TWO REGISTERS: cited segments carry receipt chips; conjecture
                  segments are visibly marked as a guess (never dressed as record). */}
              <div data-testid="interview-answer" style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
                {(Array.isArray(result.segments) ? result.segments : []).map((seg, i) => (
                  seg.register === 'cited' ? (
                    <div key={i} style={{ borderLeft: `2px solid ${SLATE}`, paddingLeft: SP.sm }}>
                      <p style={{ margin: 0, fontSize: FS.sm, color: BODY, lineHeight: 1.45 }}>{seg.text}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                        {seg.citations.map((c, j) => (
                          // Receipt chip → V-4 cause-walk. The ref/kind ride data-* so the
                          // cause-walk can deep-link off them (the deep-link is V-4's build).
                          <span
                            key={j}
                            data-testid="interview-citation"
                            data-cite-ref={c.ref}
                            data-cite-kind={c.kind}
                            style={{
                              fontSize: FS.xs, color: GOLD, fontFamily: sans,
                              border: `1px solid ${GOLD}`, borderRadius: 2, padding: `0 ${SP.xs}px`,
                            }}
                          >
                            ◆ {c.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      key={i}
                      data-testid="interview-conjecture"
                      style={{ borderLeft: `2px dashed ${MUTED}`, paddingLeft: SP.sm }}
                    >
                      <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Conjecture · not in the record
                      </span>
                      <p style={{ margin: 0, fontSize: FS.sm, color: MUTED, fontStyle: 'italic', fontFamily: serif_, lineHeight: 1.5 }}>{seg.text}</p>
                    </div>
                  )
                ))}
              </div>

              <div style={{ display: 'flex', gap: SP.sm, alignItems: 'center', fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
                <span>{citedCount}/{result.segments?.length ?? 0} cited</span>
                {band && <span>· {band}</span>}
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
