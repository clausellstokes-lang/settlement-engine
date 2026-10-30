/**
 * components/AiAnalystPanel.jsx — the analyst (Surveyor S1), as MESSAGES in the door's log.
 *
 * ⭐ X-22 (the owner, 2026-10-30: "a simple chat interface floating as a pop-up … no
 * buttons inside"). This module used to be a docked panel with its own textarea, Ask
 * button, Segmented audience toggle, suggestion chips and thumbs. The door's one log now
 * carries the conversation, so the panel's chrome is gone and two things remain:
 *
 *   • useAnalyst() — the analyst's READS and its ASK. The anchor follows the page (§2c:
 *     the analyst reads what the DM is looking at), the zero-cost suggested questions
 *     feed the composer's rotating placeholder, and ask() calls the transport, which it
 *     DYNAMIC-imports so the transport and its brief-composer graph never touch first
 *     paint (verify:dist enforces it). The door calls ask() for a prompt its router sent
 *     here; this module never routes.
 *   • AnalystReply — one reply in the log: the cited report and the musing register,
 *     visibly distinct (§3b TWO-VOICES), the receipt line, and at most one muted cost
 *     line. It renders no control.
 *
 * ⭐ THE AUDIENCE RULE, BY PHRASE (X-22(e)). The toggle went; the rule did not. The door's
 * user is the DM, so ask() requests 'dm', and the structural rule decides from the words:
 * a player-framed question ("answer this for my players") resolves to the player
 * projection in the slicers (domain/ai/stateSlicers.js resolveAudience, a downgrade and
 * never an upgrade), the transport POSTs that resolved audience, and the server enforces
 * it again, unchanged. The reply carries the audience it was produced under, and a
 * player-safe reply is LABELLED in the log so the DM knows what they may read aloud.
 * Styling uses this tree's theme vocabulary only.
 */

import { useMemo, useCallback } from 'react';
import { useStore } from '../store/index.js';
import { useRoute } from '../hooks/useRoute.js';
import { getSurveyorAiCost } from '../config/pricing.js';
import { deriveAnchor, anchorSettlement } from '../domain/ai/contextAnchor.js';
import { suggestedQuestions } from '../domain/ai/suggestedQuestions.js';
import { BODY, MUTED, GOLD, RED, SLATE, SLATE_DEEP, sans, serif_, SP, FS } from './theme.js';
import useIsMobile from '../hooks/useIsMobile.js';
import { chromeFontSize } from '../design/proseScale.js';

/** The label a player-safe reply wears in the log. */
export const PLAYER_SAFE_LABEL = 'Player-safe: drawn from what the players can know';

/**
 * The analyst's reads and its ask. Pure of chrome: no state of its own beyond the store
 * reads, so the door's log is the only conversation memory.
 * @returns {{ suggestions: string[], cost: number, creditBalance: unknown,
 *   ask: (question: string) => Promise<object> }}
 */
export function useAnalyst() {
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

  // §2c THE CONTEXT ANCHOR — the analyst follows the page: the default retrieval scope
  // tracks what the DM is looking at.
  const { view, params } = useRoute();
  const anchor = useMemo(
    () => deriveAnchor({ view, params, selectedSettlementId, settlement, savedSettlements, activeCampaign, tick: worldState?.tick ?? null }),
    [view, params, selectedSettlementId, settlement, savedSettlements, activeCampaign, worldState?.tick],
  );
  const anchoredSettlement = useMemo(
    () => anchorSettlement(anchor, { settlement, savedSettlements }) || settlement,
    [anchor, settlement, savedSettlements],
  );
  // §2c THE ZERO-COST EMPTY STATE — read-model-derived questions, no provider call.
  const suggestions = useMemo(
    () => suggestedQuestions(anchor, { settlement: anchoredSettlement, worldState }),
    [anchor, anchoredSettlement, worldState],
  );

  const ask = useCallback(async (question) => {
    const q = typeof question === 'string' ? question.trim() : '';
    if (!q) return { error: 'Ask a question first.' };
    try {
      const { askAnalyst } = await import('../lib/aiAnalyst.js');
      // 'dm' is the request; the slicers downgrade a player-framed question by phrase.
      return await askAnalyst({
        question: q, worldState, settlements, settlement: anchoredSettlement, tick: worldState?.tick || 0, audience: 'dm',
      });
    } catch {
      return { error: 'The analyst is unavailable right now.' };
    }
  }, [worldState, settlements, anchoredSettlement]);

  return { suggestions, cost: getSurveyorAiCost('analysis'), creditBalance, ask };
}

/**
 * One analyst reply in the door's log.
 * @param {{ result: object, costLine?: string|null }} props `costLine`: the one muted
 *   cost line, passed only for the conversation's first reply.
 */
export default function AnalystReply({ result, costLine = null }) {
  const mobile = useIsMobile();
  const xs = chromeFontSize(FS.xs, mobile);
  if (!result) return null;
  if (result.error) {
    return <p data-testid="analyst-error" style={{ fontSize: FS.sm, color: RED, margin: 0, lineHeight: 1.45 }}>{result.error}</p>;
  }
  const claims = Array.isArray(result.claims) ? result.claims : [];
  const musings = Array.isArray(result.musings) ? result.musings : [];
  return (
    <div data-testid="analyst-reply" data-audience={result.audience || ''} style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
      {result.audience === 'player' && (
        <span data-testid="analyst-audience" className="sf-smallcap" style={{ fontSize: xs, color: SLATE_DEEP, fontFamily: sans }}>
          {PLAYER_SAFE_LABEL}
        </span>
      )}
      <div style={{ fontSize: FS.sm, color: BODY, whiteSpace: 'pre-wrap', lineHeight: 1.45, borderLeft: `2px solid ${SLATE}`, paddingLeft: SP.sm }}>{result.answer}</div>
      {claims.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: xs, color: MUTED }}>
          {claims.map((c, i) => (
            <li key={i} style={{ marginBottom: 2 }}>
              {/* Naming hygiene (§3c): the PUBLIC receipt name, never the internal id. */}
              {c.sourced
                ? <span style={{ color: GOLD }}>◆ {c.label || 'the campaign record'}</span>
                : <span style={{ color: MUTED }}>◇ the engine does not record this</span>}
            </li>
          ))}
        </ul>
      )}
      {/* §3b TWO-VOICES: the MUSING register, visibly distinct from the cited report
          above (serif, italic, a gold rule, a plain "suggestion" label). Never cited. */}
      {musings.length > 0 && (
        <div data-testid="analyst-musings" style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: SP.sm, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: xs, color: GOLD, fontFamily: sans, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            The Surveyor muses · suggestions, not the record
          </span>
          {musings.map((m, i) => (
            <p key={i} style={{ margin: 0, fontSize: FS.sm, color: MUTED, fontStyle: 'italic', fontFamily: serif_, lineHeight: 1.5 }}>
              {m.text}
            </p>
          ))}
        </div>
      )}
      <span style={{ fontSize: xs, color: MUTED, fontFamily: sans }}>
        Cited {claims.filter((c) => c.sourced).length}/{claims.length}
        {result.byok && <span aria-label="Answered on your own provider key"> · BYOK</span>}
      </span>
      {costLine && (
        <span data-testid="surveyor-cost" style={{ fontSize: xs, color: MUTED, fontFamily: sans }}>{costLine}</span>
      )}
    </div>
  );
}

/**
 * The one muted cost line (X-22(f): "cost is one muted line under the first reply, never
 * a control"). Pure.
 * @param {number} cost @param {unknown} creditBalance @param {string} [unit] what one
 *   charge buys ('answer' for the analyst, 'recap' for a session reading)
 * @returns {string}
 */
export function costLineFor(cost, creditBalance, unit = 'answer') {
  const each = `${cost} credit${cost === 1 ? '' : 's'} per ${unit}`;
  return Number.isFinite(creditBalance) ? `${each} · ${creditBalance} left` : each;
}
