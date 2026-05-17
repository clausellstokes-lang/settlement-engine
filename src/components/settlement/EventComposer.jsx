/**
 * EventComposer — Pick an event, see preview, confirm/cancel.
 *
 * Available in both phases. In draft mode the same engine runs but
 * nothing is logged ("see what would happen"). In canon mode applying
 * adds a timeline entry. The store handlers gate the log persistence;
 * this UI is identical in both modes.
 */

import React, { useState } from 'react';
import { Zap, Flame, Trash2, Plus, MapPinOff, AlertOctagon, X, Check } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { EVENT_REGISTRY } from '../../domain/events/registry.js';
import { BAND_COLOR } from '../../domain/state/bands.js';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, CARD, sans, FS, SP, R } from '../theme.js';

const TYPE_ICONS = {
  ADD_INSTITUTION:    Plus,
  REMOVE_INSTITUTION: Trash2,
  DAMAGE_INSTITUTION: Flame,
  DEPLETE_RESOURCE:   AlertOctagon,
  CUT_TRADE_ROUTE:    MapPinOff,
};

export default function EventComposer() {
  const phase     = useStore(s => s.phase);
  const settlement = useStore(s => s.settlement);
  const previewEvent = useStore(s => s.previewEvent);
  const applyEvent   = useStore(s => s.applyEvent);
  const applyPendingPreview = useStore(s => s.applyPendingPreview);
  const dismissPreview = useStore(s => s.dismissPreview);
  const pendingPreview = useStore(s => s.pendingPreview);

  const [type, setType]         = useState('DAMAGE_INSTITUTION');
  const [target, setTarget]     = useState('');
  const [severity, setSeverity] = useState(0.7);
  const [description, setDesc]  = useState('');
  // Per-event payload fields for the new event types. Each is rendered
  // conditionally (only shown when the active event type uses it) so
  // the form stays uncluttered for simple events.
  const [importance, setImportance] = useState('notable');     // ADD_NPC, KILL_NPC
  const [role, setRole]             = useState('');           // ADD_NPC, ASSIGN_NPC_TO_ROLE
  const [institutionId, setInstitutionId] = useState('');     // ADD_NPC, ASSIGN_NPC_TO_ROLE
  const [quality, setQuality]       = useState('competent');   // ASSIGN_NPC_TO_ROLE
  const [dimension, setDimension]   = useState('legitimacy');  // IMPAIR_INSTITUTION, IMPAIR_FACTION

  if (!settlement) return null;
  const spec = EVENT_REGISTRY[type];
  const needsTarget = !!spec?.requiresTarget;
  const canSubmit   = !needsTarget || target.trim().length > 0;

  // Derive a sensible institution list for the institution-pickers.
  const institutionOptions = (settlement.institutions || [])
    .map(i => ({ id: i.id || i.name, name: i.name || i.id }))
    .filter(o => o.id && o.name);

  function buildEvent() {
    const payload = {};
    if (type === 'DAMAGE_INSTITUTION') payload.severity = severity;
    if (type === 'ADD_NPC' || type === 'KILL_NPC') {
      payload.importance = importance;
      if (role) payload.role = role;
    }
    if (type === 'ADD_NPC' && institutionId) {
      payload.linkedInstitutionIds = [institutionId];
    }
    if (type === 'ASSIGN_NPC_TO_ROLE') {
      payload.quality = quality;
      if (role)          payload.role = role;
      if (institutionId) payload.institutionId = institutionId;
    }
    if (type === 'IMPAIR_INSTITUTION' || type === 'IMPAIR_FACTION') {
      payload.dimension = dimension;
      payload.severity  = severity;
    }
    return {
      id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      targetId: target.trim(),
      payload,
      cause: phase === 'canon' ? 'player_action' : 'authoring',
      description: description.trim() || undefined,
    };
  }

  function onPreview() {
    previewEvent(buildEvent());
  }

  function onApply() {
    // Audit fix: prefer committing the pending preview (the exact event
    // the user previewed) over building a new event. Falls back to
    // applyEvent(buildEvent()) only if no preview is pending — which
    // shouldn't happen in normal flow because the Apply button is only
    // visible after a preview.
    if (pendingPreview?.event) {
      applyPendingPreview();
    } else {
      applyEvent(buildEvent());
    }
    setTarget('');
    setDesc('');
  }

  return (
    <div data-anchor="event-composer" style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.md,
      padding: SP.sm, marginTop: SP.sm,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: FS.xs, fontWeight: 800, fontFamily: sans,
        color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: SP.sm,
      }}>
        <Zap size={12} />
        {phase === 'canon' ? 'Apply In-World Event' : 'Test a Change (Draft)'}
      </div>

      <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Field label="Event">
          <select value={type} onChange={e => { setType(e.target.value); setTarget(''); }} style={selectStyle}>
            {Object.entries(EVENT_REGISTRY).map(([k, s]) => (
              <option key={k} value={k}>{s.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Target" hint={spec?.targetPrompt}>
          <input
            value={target}
            onChange={e => setTarget(e.target.value)}
            placeholder={spec?.targetPrompt || 'optional'}
            style={inputStyle}
          />
        </Field>

        {type === 'DAMAGE_INSTITUTION' && (
          <Field label={`Severity ${(severity * 100).toFixed(0)}%`}>
            <input
              type="range" min="0.1" max="1" step="0.05"
              value={severity} onChange={e => setSeverity(Number(e.target.value))}
              style={{ width: 120 }}
            />
          </Field>
        )}

        {/* NPC events: importance tier shapes propagation magnitude.
            Pillar = institutional vacuum on death; minor = no engine effect. */}
        {(type === 'ADD_NPC' || type === 'KILL_NPC') && (
          <Field label="Importance" hint={
            importance === 'pillar' ? 'Death creates major consequences' :
            importance === 'key'    ? 'Meaningful effect on linked entity' :
            importance === 'notable'? 'Small modifier on linked entity'   :
                                      'Flavor only — no engine effect'
          }>
            <select value={importance} onChange={e => setImportance(e.target.value)} style={selectStyle}>
              <option value="minor">Minor</option>
              <option value="notable">Notable</option>
              <option value="key">Key</option>
              <option value="pillar">Pillar</option>
            </select>
          </Field>
        )}

        {(type === 'ADD_NPC' || type === 'ASSIGN_NPC_TO_ROLE') && (
          <Field label="Role" hint="e.g. High Priestess, Watch Captain">
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="optional" style={inputStyle} />
          </Field>
        )}

        {(type === 'ADD_NPC' || type === 'ASSIGN_NPC_TO_ROLE') && institutionOptions.length > 0 && (
          <Field label="Institution" hint="link this NPC to an institution">
            <select value={institutionId} onChange={e => setInstitutionId(e.target.value)} style={selectStyle}>
              <option value="">— None —</option>
              {institutionOptions.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </Field>
        )}

        {type === 'ASSIGN_NPC_TO_ROLE' && (
          <Field label="Quality" hint={
            quality === 'popular'           ? 'High legitimacy boost'   :
            quality === 'competent'         ? 'Solid capacity recovery' :
            quality === 'weak'              ? 'Minimal recovery'        :
            quality === 'corrupt'           ? 'Capacity up, legitimacy hit' :
                                              'Faction-controlled appointment'
          }>
            <select value={quality} onChange={e => setQuality(e.target.value)} style={selectStyle}>
              <option value="weak">Weak</option>
              <option value="competent">Competent</option>
              <option value="popular">Popular</option>
              <option value="corrupt">Corrupt</option>
              <option value="faction_captured">Faction-captured</option>
            </select>
          </Field>
        )}

        {(type === 'IMPAIR_INSTITUTION' || type === 'IMPAIR_FACTION') && (
          <>
            <Field label="Dimension" hint={
              type === 'IMPAIR_INSTITUTION'
                ? 'Which axis is impaired'
                : 'Which faction-side dimension'
            }>
              <select value={dimension} onChange={e => setDimension(e.target.value)} style={selectStyle}>
                {type === 'IMPAIR_INSTITUTION' ? (
                  <>
                    <option value="capacity">Capacity</option>
                    <option value="legitimacy">Legitimacy</option>
                    <option value="influence">Influence</option>
                    <option value="wealth">Wealth</option>
                    <option value="staffing">Staffing</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="access">Access</option>
                    <option value="corruption">Corruption</option>
                  </>
                ) : (
                  <>
                    <option value="leadership">Leadership</option>
                    <option value="legitimacy">Legitimacy</option>
                    <option value="wealth">Wealth</option>
                    <option value="coercive_capacity">Coercive capacity</option>
                    <option value="membership">Membership</option>
                    <option value="public_support">Public support</option>
                    <option value="access">Access</option>
                    <option value="legal_standing">Legal standing</option>
                    <option value="internal_unity">Internal unity</option>
                  </>
                )}
              </select>
            </Field>
            <Field label={`Severity ${(severity * 100).toFixed(0)}%`}>
              <input
                type="range" min="0.1" max="1" step="0.05"
                value={severity} onChange={e => setSeverity(Number(e.target.value))}
                style={{ width: 120 }}
              />
            </Field>
          </>
        )}

        <Field label="Description" hint="optional">
          <input value={description} onChange={e => setDesc(e.target.value)} placeholder="e.g. burned during a brawl" style={inputStyle} />
        </Field>
      </div>

      <div style={{ display: 'flex', gap: SP.xs, marginTop: SP.sm }}>
        <button onClick={onPreview} disabled={!canSubmit} style={primaryBtn(!canSubmit)}>
          Preview
        </button>
        {pendingPreview && (
          <>
            <button onClick={onApply} style={confirmBtn}>
              <Check size={11} /> {phase === 'canon' ? 'Apply to Timeline' : 'Apply'}
            </button>
            <button onClick={dismissPreview} style={cancelBtn}>
              <X size={11} /> Cancel
            </button>
          </>
        )}
      </div>

      {pendingPreview && <PreviewPanel preview={pendingPreview} />}
    </div>
  );
}

function PreviewPanel({ preview }) {
  if (!preview) return null;
  const { deltas, factionResponses, narrativeSummary, warnings } = preview;
  return (
    <div style={{
      marginTop: SP.sm, padding: SP.sm,
      background: '#fffbf5', border: `1px solid ${GOLD}`, borderRadius: R.sm,
    }}>
      <div style={{ fontSize: FS.sm, fontFamily: sans, color: INK, fontWeight: 700, marginBottom: 4 }}>
        {narrativeSummary || 'Preview'}
      </div>
      {warnings?.length > 0 && (
        <ul style={{ margin: '4px 0', paddingLeft: 18, color: '#8b1a1a', fontSize: FS.xs, fontFamily: sans }}>
          {warnings.map((w, i) => <li key={i}>{w.message}</li>)}
        </ul>
      )}
      {deltas?.length > 0 && (
        <div style={{ marginTop: 6 }}>
          {deltas.map((d, i) => <DeltaRow key={i} d={d} />)}
        </div>
      )}
      {factionResponses?.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{
            fontSize: FS.xxs, color: MUTED, fontWeight: 800, fontFamily: sans,
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4,
          }}>
            Faction responses
          </div>
          {factionResponses.map((r, i) => (
            <div key={i} style={{
              fontSize: FS.xs, fontFamily: sans, color: INK, lineHeight: 1.5, marginBottom: 4,
            }}>
              <strong style={{ color: GOLD }}>{r.factionName}:</strong> {r.response}
              {r.hookSeed && (
                <div style={{ color: SECOND, fontStyle: 'italic', marginTop: 2 }}>
                  Hook seed: {r.hookSeed}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeltaRow({ d }) {
  const arrow = d.change > 0 ? '↑' : '↓';
  const sevColor = d.severity === 'major' ? '#8b1a1a' : d.severity === 'moderate' ? '#a0762a' : MUTED;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: FS.xs, fontFamily: sans, color: INK, lineHeight: 1.5,
    }}>
      <span style={{ color: sevColor, fontWeight: 800, minWidth: 12 }}>{arrow}</span>
      <span>{d.explanation}</span>
      <span style={{ color: MUTED, marginLeft: 'auto' }}>
        {d.before} → {d.after}
      </span>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: FS.xxs, fontFamily: sans, color: MUTED }}>
      {label}
      {children}
      {hint && <span style={{ fontStyle: 'italic', color: MUTED, opacity: 0.7 }}>{hint}</span>}
    </label>
  );
}

const inputStyle = {
  padding: '4px 8px', border: `1px solid ${BORDER}`, borderRadius: R.sm,
  fontSize: FS.xs, fontFamily: sans, color: INK, minWidth: 180, background: '#fff',
};
const selectStyle = { ...inputStyle, minWidth: 180 };

function primaryBtn(disabled) {
  return {
    padding: '5px 12px',
    background: disabled ? '#eee' : GOLD,
    color: disabled ? '#999' : '#fff',
    border: 'none', borderRadius: R.sm,
    fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}
const confirmBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '5px 12px', background: '#1a5a28', color: '#fff',
  border: 'none', borderRadius: R.sm,
  fontSize: FS.xs, fontWeight: 700, fontFamily: sans, cursor: 'pointer',
};
const cancelBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '5px 12px', background: '#fff', color: INK,
  border: `1px solid ${BORDER}`, borderRadius: R.sm,
  fontSize: FS.xs, fontWeight: 700, fontFamily: sans, cursor: 'pointer',
};
