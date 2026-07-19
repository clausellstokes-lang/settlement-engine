/**
 * components/surveyor/AutonomyPanel.jsx — S7 ADVANCED AUTONOMY (DESIGN_AI_CONTROL_SURFACE
 * §2 stage 7, the MACHINERY-NOW / VOCABULARY-GROWS compromise). A lazy write-stage body:
 *
 *   · STANDING INSTRUCTIONS — campaign-scoped, versioned guidance every compile carries
 *     (persisted on the campaign record via the registered updateSavedCampaign op; never
 *     engine state).
 *   · COMPOSE (the S1 money moment) — natural language → a PROPOSED StopCondition +
 *     pressure nudges, server-walled then re-validated against the REAL signal registry.
 *   · THE CONDITION BUILDER — pickers over REGISTERED signals only (free-text ids cannot
 *     exist here; the schema wall starts at the UI).
 *   · RUN — "advance until condition OR max N weeks" through the registered
 *     advanceCampaignWorld op, evaluated at every boundary, ending in the STOP RECEIPT
 *     (condition · tick · signal values · seed + engine version — the determinism story).
 *   · NUDGES — approve/discard cards; an approved nudge dispatches the registered
 *     injectCampaignStressor op ("raise the conditions, let the simulator decide").
 */

import { useMemo, useState, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { getSurveyorAiCost } from '../../config/pricing.js';
import { INK, BODY, MUTED, BORDER, CARD_ALT, GOLD, GREEN, sans, SP, R, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import Badge from '../primitives/Badge.jsx';
import { useSurveyorContext } from './useSurveyorContext.js';
import {
  MoneyLine, RefusalNote, MusingsBlock, Eyebrow, PromptArea, ReceiptLine,
} from './surveyorPanelKit.jsx';
import {
  signalRegistryEntries, signalById,
  validateStopCondition, describeStopCondition,
  buildNudgeOp, describeNudge,
  STANDING_INSTRUCTIONS_KEY, MAX_INSTRUCTIONS_CHARS,
  normalizeStandingInstructions, nextStandingInstructions,
  AUTONOMOUS_ADVANCE_CAP_WEEKS, clampAutonomousWeeks, MAX_CONDITION_TESTS,
} from '../../domain/autonomy/index.js';

const cost = getSurveyorAiCost('autonomy');

const inputStyle = {
  fontSize: FS.xs, fontFamily: sans, color: INK, background: '#fff',
  border: `1px solid ${BORDER}`, borderRadius: R.sm, padding: `2px ${SP.xs}px`,
};

/** One picker-built test row → a TestNode (ids come ONLY from the registry/campaign). */
function TestRow({ row, index, settlements, onChange, onRemove }) {
  const entry = signalById(row.signalId);
  const set = (patch) => onChange(index, { ...row, ...patch });
  return (
    <div data-testid={`autonomy-test-${index}`} style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
      <select aria-label="Signal" value={row.signalId} style={inputStyle}
        onChange={(ev) => set({ signalId: ev.target.value, values: [], op: 'gte', value: '' })}>
        {signalRegistryEntries().map((e) => <option key={e.id} value={e.id}>{e.id}</option>)}
      </select>
      {entry && entry.scope !== 'world' && (
        <select aria-label="Settlement" value={row.settlementId || ''} style={inputStyle}
          onChange={(ev) => set({ settlementId: ev.target.value })}>
          <option value="">settlement…</option>
          {settlements.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      )}
      {entry && entry.scope === 'pair' && (
        <select aria-label="Other settlement" value={row.otherId || ''} style={inputStyle}
          onChange={(ev) => set({ otherId: ev.target.value })}>
          <option value="">with…</option>
          {settlements.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      )}
      {entry?.type === 'number' && (
        <>
          <select aria-label="Comparison" value={row.op || 'gte'} style={inputStyle} onChange={(ev) => set({ op: ev.target.value })}>
            <option value="gte">≥</option>
            <option value="lte">≤</option>
          </select>
          <input aria-label="Threshold" type="number" value={row.value ?? ''} style={{ ...inputStyle, width: 72 }}
            onChange={(ev) => set({ value: ev.target.value })} />
        </>
      )}
      {(entry?.type === 'band' || entry?.type === 'state') && (
        <select aria-label="Value" value={(row.values && row.values[0]) || ''} style={inputStyle}
          onChange={(ev) => set({ values: ev.target.value ? [ev.target.value] : [] })}>
          <option value="">becomes…</option>
          {(entry.values || []).map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      )}
      {entry?.type === 'bool' && (
        <select aria-label="Is" value={String(row.is ?? true)} style={inputStyle}
          onChange={(ev) => set({ is: ev.target.value === 'true' })}>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      )}
      <IconButton Icon={X} label="Remove this test" size="sm" onClick={() => onRemove(index)} />
    </div>
  );
}

/** Picker rows → a typed StopCondition (still walled by validateStopCondition after). */
function conditionFromRows(rows, combinator) {
  const nodes = rows.map((r) => {
    const entry = signalById(r.signalId);
    let test = null;
    if (entry?.type === 'number') test = { op: r.op === 'lte' ? 'lte' : 'gte', value: Number(r.value) };
    else if (entry?.type === 'band' || entry?.type === 'state') test = { in: Array.isArray(r.values) ? r.values : [] };
    else if (entry?.type === 'bool') test = { is: r.is !== false };
    return {
      kind: 'test', signalId: r.signalId,
      ...(r.settlementId ? { settlementId: r.settlementId } : {}),
      ...(r.otherId ? { otherId: r.otherId } : {}),
      test,
    };
  });
  if (nodes.length === 0) return null;
  if (nodes.length === 1) return { version: 1, root: nodes[0] };
  return { version: 1, root: { kind: combinator === 'all' ? 'all' : 'some', children: nodes } };
}

export default function AutonomyPanel({ initialPrompt = '' }) {
  const { creditBalance, ctx, activeCampaignId, activeCampaign, savedSettlements } = useSurveyorContext();
  const advanceCampaignWorld = useStore((s) => s.advanceCampaignWorld);
  const injectCampaignStressor = useStore((s) => s.injectCampaignStressor);
  const updateSavedCampaign = useStore((s) => s.updateSavedCampaign);

  const settlements = useMemo(() => {
    const ids = new Set((activeCampaign?.settlementIds || []).map(String));
    return (savedSettlements || [])
      .filter((s) => ids.has(String(s?.id)))
      .map((s) => ({ id: String(s.id), name: s.name || String(s.id) }));
  }, [activeCampaign, savedSettlements]);

  // ── standing instructions ──────────────────────────────────────────────────
  const persisted = normalizeStandingInstructions(activeCampaign?.[STANDING_INSTRUCTIONS_KEY]);
  const [draftText, setDraftText] = useState(null); // null = not editing
  const [savedNote, setSavedNote] = useState('');
  const saveInstructions = useCallback(() => {
    if (draftText == null || !activeCampaignId) return;
    const next = nextStandingInstructions(persisted, draftText, new Date().toISOString());
    // undefined (not null) so serialization DROPS the key entirely when cleared —
    // the campaign record returns to its pre-S7 shape (dormancy-lawful).
    updateSavedCampaign(activeCampaignId, { [STANDING_INSTRUCTIONS_KEY]: next ?? undefined });
    setSavedNote(next ? `Saved (v${next.version}) — every compile now carries this.` : 'Cleared.');
    setDraftText(null);
  }, [draftText, activeCampaignId, persisted, updateSavedCampaign]);

  // ── the condition (composed or picker-built) + run state — declared BEFORE the
  // compose callback that writes them ─────────────────────────────────────────
  const [composed, setComposed] = useState(null); // an AI-composed condition (walled)
  const [rows, setRows] = useState([]);
  const [combinator, setCombinator] = useState('some');
  const [maxWeeks, setMaxWeeks] = useState(4);

  // ── compose (the money moment) ─────────────────────────────────────────────
  const [intent, setIntent] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const compose = useCallback(async () => {
    const q = intent.trim();
    if (!q || loading) return;
    setLoading(true); setResult(null);
    try {
      const { composeAutonomy } = await import('../../lib/surveyorWrite.js');
      const res = await composeAutonomy({ ...ctx, intent: q });
      setResult(res.ok ? res : { error: res.error, refusalClass: res.refusalClass, doors: res.doors });
      if (res.ok && res.composition?.stopCondition) {
        setComposed(res.composition.stopCondition);
        setMaxWeeks(res.composition.maxWeeks);
      }
    } catch {
      setResult({ error: 'The Surveyor is unavailable right now.' });
    } finally {
      setLoading(false);
    }
  }, [intent, loading, ctx]);

  const changeRow = useCallback((i, row) => setRows((r) => r.map((x, j) => (j === i ? row : x))), []);
  const removeRow = useCallback((i) => { setRows((r) => r.filter((_, j) => j !== i)); setComposed(null); }, []);
  const addRow = useCallback(() => {
    setComposed(null);
    setRows((r) => (r.length >= MAX_CONDITION_TESTS ? r : [...r, { signalId: 'world.tick', op: 'gte', value: '' }]));
  }, []);

  const condition = composed || conditionFromRows(rows, combinator);
  const wall = condition ? validateStopCondition(condition) : null;

  // ── the run ────────────────────────────────────────────────────────────────
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(null);
  const [run, setRun] = useState(null); // { receipt, stopped }
  const startRun = useCallback(async () => {
    if (!activeCampaignId || !condition || running || !(wall && wall.ok)) return;
    setRunning(true); setRun(null); setProgress(null);
    try {
      const { runAutonomousAdvance } = await import('../../lib/surveyorAutonomy.js');
      const out = await runAutonomousAdvance({
        campaignId: activeCampaignId, condition, maxWeeks,
        deps: {
          advance: (id) => advanceCampaignWorld(id, 'one_week', { autoResolve: true }),
          readCampaign: () => {
            const s = useStore.getState();
            return (s.campaigns || []).find((c) => String(c?.id) === String(activeCampaignId)) || null;
          },
          readSaves: () => useStore.getState().savedSettlements || [],
        },
        onProgress: (p) => setProgress(p),
      });
      setRun(out);
    } catch {
      setRun({ receipt: null, stopped: 'error' });
    } finally {
      setRunning(false);
    }
  }, [activeCampaignId, condition, running, wall, maxWeeks, advanceCampaignWorld]);

  // ── nudges ─────────────────────────────────────────────────────────────────
  const [nudgeDecisions, setNudgeDecisions] = useState({});
  const decideNudge = useCallback((i, action, nudge) => {
    if (action === 'approve' && activeCampaignId) {
      const emission = buildNudgeOp(activeCampaignId, nudge);
      injectCampaignStressor(emission.campaignId, emission.stressor);
    }
    setNudgeDecisions((d) => ({ ...d, [i]: action }));
  }, [activeCampaignId, injectCampaignStressor]);

  const nudges = Array.isArray(result?.composition?.nudges) ? result.composition.nudges : [];
  const unsupported = Array.isArray(result?.composition?.unsupported) ? result.composition.unsupported : [];
  const receipt = run?.receipt;

  if (!activeCampaignId) {
    return <p style={{ margin: 0, fontSize: FS.sm, color: MUTED, fontFamily: sans }}>Open a campaign first — autonomous advances run a campaign world.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
      <Eyebrow>Standing instructions — carried by every compile</Eyebrow>
      {draftText == null ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
          <span style={{ fontSize: FS.xs, color: persisted ? BODY : MUTED, fontFamily: sans, flex: 1, minWidth: 120 }}>
            {persisted ? `“${persisted.text}” (v${persisted.version})` : 'None set.'}
          </span>
          <Button variant="ghost" size="sm" onClick={() => { setSavedNote(''); setDraftText(persisted?.text || ''); }}>Edit</Button>
          {savedNote && <span style={{ fontSize: FS.xs, color: GREEN, fontFamily: sans }}>{savedNote}</span>}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
          <PromptArea value={draftText} onChange={setDraftText} rows={2}
            label="Standing campaign instructions" placeholder="e.g. favor diplomacy; never resolve a named character's fate…" />
          <div style={{ display: 'flex', gap: SP.xs }}>
            <Button variant="aiSolid" size="sm" onClick={saveInstructions}>Save instructions</Button>
            <Button variant="ghost" size="sm" onClick={() => setDraftText(null)}>Cancel</Button>
            <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, alignSelf: 'center' }}>{(draftText || '').length}/{MAX_INSTRUCTIONS_CHARS}</span>
          </div>
        </div>
      )}

      <Eyebrow>Compose a run — describe when the world should stop</Eyebrow>
      <PromptArea value={intent} onChange={setIntent} disabled={loading}
        label="Describe the autonomous run you want"
        placeholder="e.g. run until Bramwick's food turns critical or two months pass; stir a rebellion…" />
      <MoneyLine cost={cost} creditBalance={creditBalance} busy={loading} disabled={!intent.trim()} onSubmit={compose}
        submitLabel="Compose it" busyLabel="Composing…" />
      {result?.error && <RefusalNote error={result.error} refusalClass={result.refusalClass} doors={result.doors} />}
      <MusingsBlock musings={result?.musings} />

      {unsupported.length > 0 && (
        <div data-testid="autonomy-unsupported" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Eyebrow>Asked for, but the engine cannot express it</Eyebrow>
          {unsupported.map((u, i) => (
            <span key={i} style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>◇ {u.requested} — {u.reason}</span>
          ))}
        </div>
      )}

      {nudges.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
          <Eyebrow>Proposed nudges — raise conditions, the simulator decides</Eyebrow>
          {nudges.map((n, i) => (
            <div key={i} data-testid={`autonomy-nudge-${i}`} style={{
              display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap',
              border: `1px solid ${nudgeDecisions[i] === 'discard' ? BORDER : GOLD}`, borderRadius: R.md,
              padding: SP.xs, background: nudgeDecisions[i] === 'discard' ? CARD_ALT : '#fff',
              opacity: nudgeDecisions[i] === 'discard' ? 0.6 : 1,
            }}>
              <span style={{ fontSize: FS.xs, color: BODY, fontFamily: sans, flex: 1, minWidth: 140 }}>
                {describeNudge(n)}{n.rationale ? ` — ${n.rationale}` : ''}
              </span>
              {nudgeDecisions[i] === 'approve' && <Badge tone="gold" size="sm">injected</Badge>}
              {!nudgeDecisions[i] && (
                <>
                  <IconButton Icon={Check} label="Approve this nudge" size="sm" onClick={() => decideNudge(i, 'approve', n)} />
                  <IconButton Icon={X} label="Discard this nudge" size="sm" onClick={() => decideNudge(i, 'discard', n)} />
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <Eyebrow>The stop condition — registered signals only</Eyebrow>
      {condition && (
        <p data-testid="autonomy-condition" style={{ margin: 0, fontSize: FS.xs, color: wall?.ok ? BODY : MUTED, fontFamily: sans, lineHeight: 1.5 }}>
          {describeStopCondition(condition)}
        </p>
      )}
      {wall && !wall.ok && (
        <p style={{ margin: 0, fontSize: FS.xs, color: MUTED, fontFamily: sans }}>Not runnable yet: {wall.errors[0]}</p>
      )}
      {!composed && rows.map((r, i) => (
        <TestRow key={i} row={r} index={i} settlements={settlements} onChange={changeRow} onRemove={removeRow} />
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
        <Button variant="ghost" size="sm" onClick={addRow} disabled={rows.length >= MAX_CONDITION_TESTS}>Add a test</Button>
        {rows.length > 1 && !composed && (
          <select aria-label="Combine tests with" value={combinator} style={inputStyle} onChange={(ev) => setCombinator(ev.target.value)}>
            <option value="some">any may fire (OR)</option>
            <option value="all">all must hold (AND)</option>
          </select>
        )}
        {composed && <Button variant="ghost" size="sm" onClick={() => setComposed(null)}>Build by hand instead</Button>}
      </div>

      <Eyebrow>Run — advance until it fires, or the cap</Eyebrow>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
        <label htmlFor="autonomy-max-weeks" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
          Max weeks{' '}
          <input id="autonomy-max-weeks" aria-label="Max weeks" type="number" min={1} max={AUTONOMOUS_ADVANCE_CAP_WEEKS}
            value={maxWeeks} style={{ ...inputStyle, width: 64 }}
            onChange={(ev) => setMaxWeeks(clampAutonomousWeeks(Number(ev.target.value)))} />
          {' '}(cap {AUTONOMOUS_ADVANCE_CAP_WEEKS})
        </label>
        <Button variant="aiSolid" size="sm" disabled={!condition || !(wall && wall.ok) || running} onClick={startRun}>
          {running ? `Advancing… week ${progress?.week ?? 0}/${progress?.budget ?? maxWeeks}` : 'Advance until it fires'}
        </Button>
      </div>

      {run && (
        <div data-testid="autonomy-receipt" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Eyebrow>The stop receipt</Eyebrow>
          {receipt ? (
            <>
              <p style={{ margin: 0, fontSize: FS.xs, color: BODY, fontFamily: sans, lineHeight: 1.5 }}>
                {receipt.fired
                  ? <><span style={{ color: GREEN }}>◆ Condition fired</span> at week {receipt.stopTick} after {receipt.weeksAdvanced} week{receipt.weeksAdvanced === 1 ? '' : 's'}.</>
                  : receipt.capped
                    ? <>◇ The cap stopped it: {receipt.weeksAdvanced} weeks advanced; the condition never fired.</>
                    : <>◇ The world declined to advance ({run.stopped.replace('advance_refused:', '')}) after {receipt.weeksAdvanced} week{receipt.weeksAdvanced === 1 ? '' : 's'}.</>}
              </p>
              <p style={{ margin: 0, fontSize: FS.xs, color: MUTED, fontFamily: sans, lineHeight: 1.5 }}>{receipt.conditionLabel}</p>
              {receipt.evaluations.map((ev, i) => (
                <span key={i} style={{ fontSize: FS.xs, color: ev.pass ? BODY : MUTED, fontFamily: sans }}>
                  {ev.pass ? '◆' : '◇'} {ev.signalId}{ev.settlementId ? ` @${ev.settlementId}` : ''} = {ev.value === null ? `unreadable (${ev.reason})` : String(ev.value)}
                </span>
              ))}
              <ReceiptLine engineVersion={receipt.engineVersion} seed={receipt.seed} applied={receipt.weeksAdvanced} />
            </>
          ) : (
            <p style={{ margin: 0, fontSize: FS.xs, color: MUTED, fontFamily: sans }}>The run failed before it could stop cleanly — the world is unchanged past its last committed week.</p>
          )}
        </div>
      )}
    </div>
  );
}
