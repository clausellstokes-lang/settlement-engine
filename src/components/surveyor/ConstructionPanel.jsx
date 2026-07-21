/**
 * components/surveyor/ConstructionPanel.jsx — S5/S6 CONSTRUCTION (DESIGN_AI_CONTROL_SURFACE
 * §2 stages 5–6). One panel, two scopes. An intent compiles into a generator CONFIG (the
 * config vocabulary IS the op — a hallucinated key dies at the wall, dropped-and-listed); the
 * DM reviews the config draft, then the pipeline GENERATES DETERMINISTICALLY on the client
 * (generateSettlementPipeline for a settlement, the pure instant-world composer for a realm —
 * canonizes nothing). The DETERMINISTIC comparator (zero AI) lists the DEVIATIONS from the
 * declared constraints honestly; a bounded, DELTA-ONLY revise loop corrects (each pass sends
 * only the deviations + the current config — never re-grounding). Commit rides the EXISTING
 * create/canonize paths. Every generator + the transport is dynamic-imported (off first paint).
 */

import { useState, useCallback } from 'react';
import { useStore } from '../../store/index.js';
import { getSurveyorAiCost } from '../../config/pricing.js';
import { BODY, MUTED, BORDER, GREEN, RED, sans, SP, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import Segmented from '../primitives/Segmented.jsx';
import Badge from '../primitives/Badge.jsx';
import { useSurveyorContext } from './useSurveyorContext.js';
import { MoneyLine, RefusalNote, MusingsBlock, Eyebrow, PromptArea, ProposalSlipLine } from './surveyorPanelKit.jsx';

const SCOPE_OPTIONS = [{ id: 'settlement', label: 'Settlement' }, { id: 'realm', label: 'Realm' }];
const DIMENSION_LABEL = {
  resilience: 'Resilience', volatility: 'Volatility', externalThreat: 'External threat', resourcePressure: 'Resource pressure',
};
const BAND_TONE = { low: 'muted', moderate: 'info', high: 'warning' };
const MAX_REVISE_ROUNDS = 2;

const costFor = (scope) => getSurveyorAiCost(scope === 'realm' ? 'constructRealm' : 'constructSettlement');
const newSeed = () => `surveyor-${Math.random().toString(36).slice(2, 10)}`;

export default function ConstructionPanel({ initialPrompt = '', initialScope }) {
  const { creditBalance, ctx } = useSurveyorContext();
  const instantWorld = useStore((s) => s.instantWorld);
  const setActiveSaveId = useStore((s) => s.setActiveSaveId);

  const [scope, setScope] = useState(initialScope === 'realm' ? 'realm' : 'settlement');
  const [intent, setIntent] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState('');
  const [round, setRound] = useState(0);
  const [result, setResult] = useState(null); // { config, unsupported, constraints, constraintUnsupported, musings, byok } | { error }
  const [generated, setGenerated] = useState(null); // { deviations, count, kind } | { error }
  const [generating, setGenerating] = useState(false);
  const [committed, setCommitted] = useState(null); // { kind, detail }
  const [committing, setCommitting] = useState(false);

  // Validate a raw config+constraints from the edge through the config wall (client side).
  const validate = useCallback(async (rawConfig, rawConstraints, forScope) => {
    const v = await import('../../domain/construct/configVocabulary.js');
    const { config, unsupported } = forScope === 'realm' ? v.validateRealmConfig(rawConfig) : v.validateSettlementConfig(rawConfig);
    const { constraints, unsupported: constraintUnsupported } = v.validateConstraints(rawConstraints);
    return { config, unsupported, constraints, constraintUnsupported };
  }, []);

  const compile = useCallback(async () => {
    const q = intent.trim();
    if (!q || loading) return;
    setLoading(true); setResult(null); setGenerated(null); setCommitted(null); setRound(0);
    const s = newSeed(); setSeed(s);
    try {
      const { compileConstruction } = await import('../../lib/surveyorWrite.js');
      const res = await compileConstruction({ ...ctx, intent: q, scope });
      if (!res.ok) { setResult({ error: res.error, refusalClass: res.refusalClass, doors: res.doors }); return; }
      const walled = await validate(res.rawConfig, res.rawConstraints, scope);
      setResult({ ...walled, musings: res.musings, byok: res.byok, earlyAccess: res.earlyAccess });
    } catch {
      setResult({ error: 'The Surveyor is unavailable right now.' });
    } finally {
      setLoading(false);
    }
  }, [intent, loading, ctx, scope, validate]);

  // DETERMINISTIC GENERATE (client-side) + the comparator. No AI, no persistence.
  const generate = useCallback(async (config, constraints) => {
    setGenerating(true); setGenerated(null); setCommitted(null);
    try {
      const cmp = await import('../../domain/construct/intentComparator.js');
      if (scope === 'realm') {
        const { composeInstantWorld } = await import('../../lib/instantWorld/composeInstantWorld.js');
        const { settlements } = composeInstantWorld({ seed, basicConfig: config });
        const deviations = cmp.compareRealmToConstraints(settlements, constraints);
        setGenerated({ deviations, count: Array.isArray(settlements) ? settlements.length : 0, kind: 'realm' });
      } else {
        const { generateSettlementPipeline } = await import('../../generators/generateSettlementPipeline.js');
        const dossier = generateSettlementPipeline(config, null, { seed });
        const deviations = cmp.compareResultToConstraints(dossier, constraints);
        setGenerated({ deviations, dossier, config, kind: 'settlement' });
      }
    } catch {
      setGenerated({ error: 'Generation failed. The config could not be built.' });
    } finally {
      setGenerating(false);
    }
  }, [scope, seed]);

  // DELTA-ONLY revise (directive 5): send ONLY the deviations + current config. Bounded.
  const revise = useCallback(async () => {
    if (!result?.config || !generated?.deviations?.length) return;
    const cmp = await import('../../domain/construct/intentComparator.js');
    if (!cmp.shouldRevise(generated.deviations, { round, maxRounds: MAX_REVISE_ROUNDS })) return;
    setLoading(true);
    try {
      const payload = cmp.buildRevisePayload(generated.deviations, result.config);
      const { reviseConstruction } = await import('../../lib/surveyorWrite.js');
      const res = await reviseConstruction({ scope, payload });
      if (!res.ok) { setResult((r) => ({ ...r, error: res.error })); return; }
      const walled = await validate(res.rawConfig, res.rawConstraints, scope);
      setRound((n) => n + 1);
      setResult((r) => ({ ...r, ...walled, error: null }));
      await generate(walled.config, walled.constraints);
    } finally {
      setLoading(false);
    }
  }, [result, generated, round, scope, validate, generate]);

  // COMMIT through the existing paths.
  const commit = useCallback(async () => {
    setCommitting(true);
    try {
      if (scope === 'realm') {
        // instantWorld PLACES everything; the realm's spatial canon stays UNFROZEN until a
        // separate canonize step — surfaced honestly (canonizes nothing until commit).
        const res = await instantWorld?.(result.config, { seed });
        setCommitted(res?.ok
          ? { kind: 'realm', detail: `Placed ${res.settlementCount ?? ''} settlements. The realm’s map is not yet frozen. Canonize it when you’re ready.` }
          : { kind: 'error', detail: res?.reason ? `Could not place the realm (${res.reason}).` : 'Could not place the realm.' });
      } else {
        const { saves } = await import('../../lib/saves.js');
        const dossier = generated?.dossier;
        const saveId = await saves.save({ name: dossier?.name, tier: dossier?.tier, settlement: dossier, config: result.config });
        if (saveId) setActiveSaveId?.(saveId);
        setCommitted({ kind: 'settlement', detail: saveId ? 'Created as a draft save in your library.' : 'Could not save the settlement.' });
      }
    } catch {
      setCommitted({ kind: 'error', detail: 'Commit failed.' });
    } finally {
      setCommitting(false);
    }
  }, [scope, result, generated, seed, instantWorld, setActiveSaveId]);

  const cost = costFor(scope);
  const config = result?.config;
  const configKeys = config ? Object.keys(config) : [];
  const unsupported = result?.unsupported || [];
  const constraints = result?.constraints || {};
  const constraintKeys = Object.keys(constraints);
  const deviations = generated?.deviations || [];
  const canRevise = deviations.length > 0 && round < MAX_REVISE_ROUNDS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
      <Segmented options={SCOPE_OPTIONS} value={scope} onChange={(s) => { setScope(s); setResult(null); setGenerated(null); setCommitted(null); }} size="sm" ariaLabel="Construction scope" />
      <Eyebrow>{scope === 'realm' ? 'Compose a realm: describe it' : 'Construct a settlement: describe it'}</Eyebrow>
      <PromptArea
        value={intent}
        onChange={setIntent}
        label="Describe what the Surveyor should build"
        placeholder={scope === 'realm' ? 'e.g. a small, dramatic archipelago on the brink of holy war…' : 'e.g. a hard-scarcity fishing town, high external threat, resilient…'}
        disabled={loading}
      />
      <MoneyLine cost={cost} creditBalance={creditBalance} busy={loading} disabled={!intent.trim()} onSubmit={compile}
        submitLabel="Compile config" busyLabel="Compiling…" />

      {result?.error && <RefusalNote error={result.error} refusalClass={result.refusalClass} doors={result.doors} />}
      <MusingsBlock musings={result?.musings} />

      {config && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm }}>
          <Eyebrow>Config draft{round > 0 ? ` · revise pass ${round}` : ''}</Eyebrow>
          <ProposalSlipLine />
          <div data-testid="construct-config" style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {configKeys.length === 0 && <p style={{ margin: 0, fontSize: FS.sm, color: MUTED }}>No registered config keys were emitted.</p>}
            {configKeys.map((k) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: SP.xs }}>
                <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, minWidth: 130 }}>{k}</span>
                <span style={{ fontSize: FS.xs, color: BODY, fontFamily: sans }}>{String(config[k])}</span>
              </div>
            ))}
          </div>

          {unsupported.length > 0 && (
            <div data-testid="construct-unsupported" style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Eyebrow>Dropped at the wall</Eyebrow>
              {unsupported.map((u, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
                  <Badge tone="warning" size="sm">dropped</Badge>
                  <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>{String(u.key)}{u.reason ? `: ${u.reason}` : ''}</span>
                </div>
              ))}
            </div>
          )}

          {constraintKeys.length > 0 && (
            <div data-testid="construct-constraints" style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Eyebrow>Declared targets</Eyebrow>
              {constraintKeys.map((dim) => (
                <div key={dim} style={{ display: 'flex', alignItems: 'center', gap: SP.xs }}>
                  <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, minWidth: 130 }}>{DIMENSION_LABEL[dim] || dim}</span>
                  <Badge tone={BAND_TONE[constraints[dim]] || 'muted'} size="sm">{constraints[dim]}</Badge>
                </div>
              ))}
            </div>
          )}

          <Button variant="secondary" size="sm" busy={generating} disabled={generating} onClick={() => generate(result.config, result.constraints)}>
            {generating ? 'Generating…' : 'Generate & compare'}
          </Button>
        </div>
      )}

      {generated?.error && <p style={{ margin: 0, fontSize: FS.sm, color: RED }}>{generated.error}</p>}

      {generated && !generated.error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm }}>
          <Eyebrow>{deviations.length === 0 ? 'The draft matches your targets' : 'Where the draft deviates from your targets'}</Eyebrow>
          {generated.kind === 'realm' && (
            <p style={{ margin: 0, fontSize: FS.xs, color: MUTED }}>{generated.count} settlements composed · nothing canonized yet.</p>
          )}
          {deviations.length === 0 ? (
            <p data-testid="construct-nodeviations" style={{ margin: 0, fontSize: FS.sm, color: GREEN }}>◆ Every constrained dimension is on target.</p>
          ) : (
            <div data-testid="construct-deviations" style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {deviations.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: FS.xs, color: BODY, fontFamily: sans, minWidth: 130 }}>{DIMENSION_LABEL[d.dimension] || d.dimension}</span>
                  <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
                    is <b>{d.actual}</b>, you asked <b>{d.target}</b>. {d.direction} it
                  </span>
                </div>
              ))}
            </div>
          )}

          {canRevise && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Button variant="ai" size="sm" busy={loading} disabled={loading} onClick={revise}>
                Revise (delta-only)
              </Button>
              <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
                Pass {round + 1} of {MAX_REVISE_ROUNDS}: sends only the {deviations.length} deviation{deviations.length === 1 ? '' : 's'} + the current config, no re-grounding.
              </span>
            </div>
          )}
          {!canRevise && deviations.length > 0 && (
            <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>Revise budget spent. Commit as-is or refine your prompt.</span>
          )}

          <Button variant="primary" size="sm" busy={committing} disabled={committing} onClick={commit}>
            {scope === 'realm' ? 'Place the realm' : 'Create the settlement'}
          </Button>
          {committed && (
            <div data-testid="construct-committed" style={{ fontSize: FS.xs, color: committed.kind === 'error' ? RED : MUTED, fontFamily: sans, lineHeight: 1.5 }}>
              {committed.kind !== 'error' && <span style={{ color: GREEN }}>◆ </span>}{committed.detail}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
