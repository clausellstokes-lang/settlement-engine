/**
 * OraclePanel.jsx — THE ORACLE (V-14, VISION WAVE): the solo player's GM.
 *
 * A FREE, deterministic surface (no AI, no metering, no gate): the player sets their prior
 * (the odds ladder), types a yes/no question, and the oracle answers FROM STATE — the
 * yes/no weighted by the live ledgers, a scene prompt, and a complication drawn from what
 * is actually happening, every part carrying its world-truth basis. It rides the already-
 * lazy RealmInspector chunk (statically imported there), so it costs first paint nothing.
 */
import { useState, useMemo, useCallback } from 'react';
import { useStore } from '../../store/index.js';
import { askOracle } from '../../domain/oracle.js';
import { ORACLE_LIKELIHOODS } from '../../data/oracleCorpus.js';
import { track, EVENTS } from '../../lib/analytics.js';
import Button from '../primitives/Button.jsx';
import { INK, BODY, BORDER, CARD_ALT, MUTED, GOLD, FS, SP, sans, serif_ } from '../theme.js';

const selectStyle = {
  fontSize: FS.sm, color: INK, background: CARD_ALT,
  border: `1px solid ${BORDER}`, padding: '4px 6px', maxWidth: '100%', fontFamily: sans,
};

export default function OraclePanel({ campaign }) {
  const savedSettlements = useStore((s) => s.savedSettlements);
  const selectedId = useStore((s) => s.selectedSettlementId);

  const worldState = campaign?.worldState || null;
  const anchored = useMemo(() => {
    const list = Array.isArray(savedSettlements) ? savedSettlements : [];
    return list.find((s) => s && s.id === selectedId) || list[0] || null;
  }, [savedSettlements, selectedId]);

  const [question, setQuestion] = useState('');
  const [likelihood, setLikelihood] = useState('even');
  const [nonce, setNonce] = useState(0);
  const [result, setResult] = useState(null);

  const consult = useCallback(() => {
    const q = question.trim();
    if (!q) return;
    const n = nonce + 1;
    setNonce(n);
    // Seed with the world + a per-consult nonce: a fresh reading each time, but
    // reproducible given the same inputs (the determinism pin holds on askOracle).
    const r = askOracle({
      worldState, settlement: anchored, question: q,
      seed: `${worldState?.seed ?? 'oracle'}:${worldState?.tick ?? 0}:${n}`,
      likelihood, tick: worldState?.tick ?? 0,
    });
    setResult(r);
    track(EVENTS.SURVEYOR_ADOPTION, { surface: 'oracle', verdict: 'drawn' });
  }, [question, likelihood, nonce, worldState, anchored]);

  const pct = result ? Math.round(result.odds.p * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, fontFamily: sans, color: BODY }}>
      <p style={{ margin: 0, fontSize: FS.xs, color: MUTED, lineHeight: 1.45 }}>
        A yes/no oracle that answers from your world&apos;s own ledgers. No dungeon master required.
        {anchored ? <> Reading <strong style={{ color: INK }}>{anchored.name}</strong>.</> : ' Select a settlement to read its danger and troubles.'}
      </p>

      <div style={{ fontSize: FS.xs, color: MUTED }}>
        How likely, before the world weighs in?
        <select
          value={likelihood}
          onChange={(e) => setLikelihood(e.target.value)}
          aria-label="How likely, before the world weighs in"
          style={{ ...selectStyle, display: 'block', marginTop: 2 }}
        >
          {ORACLE_LIKELIHOODS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
      </div>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        aria-label="Your yes/no question for the oracle"
        placeholder="Is the road safe? Will the guild move against us? …"
        rows={2}
        style={{
          width: '100%', boxSizing: 'border-box', resize: 'vertical',
          border: `1px solid ${BORDER}`, background: CARD_ALT, color: INK, padding: SP.sm,
          fontSize: FS.sm, fontFamily: sans,
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="aiSolid" size="sm" disabled={!question.trim()} onClick={consult}>
          {result ? 'Ask again' : 'Consult the oracle'}
        </Button>
      </div>

      {result && (
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          <div data-testid="oracle-answer" style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm }}>
            <span style={{ fontSize: FS.h1, fontWeight: 700, color: INK, fontFamily: serif_ }}>{result.answerLabel}</span>
            <span style={{ fontSize: FS.xs, color: MUTED }}>{pct}% before the roll · rolled {result.roll.toFixed(2)}</span>
          </div>

          <div style={{ borderLeft: `2px solid ${MUTED}`, paddingLeft: SP.sm }}>
            <p style={{ margin: 0, fontSize: FS.sm, color: BODY, fontStyle: 'italic', fontFamily: serif_, lineHeight: 1.5 }}>{result.scene.texture}</p>
            {result.scene.worldLines.map((line, i) => (
              <p key={i} style={{ margin: '2px 0 0', fontSize: FS.sm, color: BODY, lineHeight: 1.45 }}>{line}</p>
            ))}
          </div>

          {result.complication && (
            <div data-testid="oracle-complication" style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: SP.sm }}>
              <span style={{ fontSize: FS.xs, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Complication</span>
              <p style={{ margin: 0, fontSize: FS.sm, color: BODY, lineHeight: 1.45 }}>{result.complication.text}.</p>
            </div>
          )}

          {/* The world-truth basis — every part of the answer names the ledger it read. */}
          <div data-testid="oracle-basis" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: FS.xs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Why the oracle says so</span>
            {result.basis.map((b, i) => (
              <span key={i} style={{ fontSize: FS.xs, color: MUTED }}>◆ {b.label}: {b.detail}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
