/**
 * EventComposer — Pick an event, see preview, confirm/cancel.
 *
 * Available in both phases. In draft mode the same engine runs but
 * nothing is logged ("see what would happen"). In canon mode applying
 * adds a timeline entry. The store handlers gate the log persistence;
 * this UI is identical in both modes.
 */

import { useState } from 'react';
import { Zap, Flame, Trash2, Plus, MapPinOff, AlertOctagon, X, Check } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { EVENT_REGISTRY } from '../../domain/events/registry.js';
import { inferImportance } from '../../domain/entities/npcs.js';
import { validateBatch } from '../../domain/events/batch.js';
import { rolesForInstitution, importanceForRole, influenceForImportance } from '../../domain/roles/roleCatalog.js';
import { GOLD, INK, MUTED, SECOND, BORDER, CARD, sans, FS, SP, R, swatch } from '../theme.js';

const _TYPE_ICONS = {
  ADD_INSTITUTION:    Plus,
  REMOVE_INSTITUTION: Trash2,
  DAMAGE_INSTITUTION: Flame,
  DEPLETE_RESOURCE:   AlertOctagon,
  CUT_TRADE_ROUTE:    MapPinOff,
};

// Code-review fix: target field used to be a free-text input. The user
// shouldn't have to TYPE the name of an NPC they want to kill — the NPC
// is already in the dossier. This map declares which dossier collection
// to pull the target dropdown from for each event type. ADD_*
// (institution / npc) and CUT_TRADE_ROUTE genuinely have no source list
// (the user is naming something new), so they keep the text input.
const TARGET_ENTITY_BY_EVENT = Object.freeze({
  ADD_INSTITUTION:      null,           // new entity — free text
  ADD_FACTION:          null,           // new entity — free-text name
  REMOVE_INSTITUTION:   'institutions',
  DAMAGE_INSTITUTION:   'institutions',
  IMPAIR_INSTITUTION:   'institutions',
  ADD_NPC:              null,           // new entity — free text
  KILL_NPC:             'npcs',
  ASSIGN_NPC_TO_ROLE:   'npcs',
  IMPAIR_FACTION:       'factions',
  RESTORE_FACTION:      'factions',     // recover a faction that is currently impaired
  EXPOSE_CORRUPTION:    'factions',     // or institutions; pick factions as the dominant case
  RESTORE_INSTITUTION:  'institutions', // recover an institution that is currently impaired
  DEPLETE_RESOURCE:     'resources',
  RECOVERED_RESOURCE:   'resources',    // recover a resource the campaign already depleted
  CUT_TRADE_ROUTE:      null,           // route names aren't tracked as entities — free text
});

/** Build {id, name} options from a dossier collection for the target dropdown. */
function buildTargetOptions(settlement, collectionKey) {
  if (!collectionKey || !settlement) return [];
  let list;
  switch (collectionKey) {
    case 'institutions': list = settlement.institutions || []; break;
    case 'npcs':         list = settlement.npcs || []; break;
    case 'factions':     list = settlement.powerStructure?.factions || []; break;
    case 'resources':    {
      // Nearby resources are stored as keys in nearbyResources (config) and
      // sometimes additionally on settlement.resources. Combine + dedupe.
      const fromConfig = (settlement.config?.nearbyResources || []).map(k => ({ id: k, name: k }));
      const fromList   = (settlement.resources || []).map(r => ({
        id: r.id || r.key || r.name,
        name: r.name || r.id || r.key,
      }));
      list = [...fromList, ...fromConfig];
      break;
    }
    default: return [];
  }
  // Normalize to {id, name}, dedupe by id, keep insertion order.
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const id = item.id || item.faction || item.name;
    const name = item.name || item.faction || item.id;
    if (!id || !name) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id: String(id), name: String(name) });
  }
  return out;
}

export default function EventComposer() {
  const phase     = useStore(s => s.phase);
  const settlement = useStore(s => s.settlement);
  const previewEvent = useStore(s => s.previewEvent);
  const applyEvent   = useStore(s => s.applyEvent);
  const applyPendingPreview = useStore(s => s.applyPendingPreview);
  const dismissPreview = useStore(s => s.dismissPreview);
  const pendingPreview = useStore(s => s.pendingPreview);
  const previewBatch   = useStore(s => s.previewEventBatch);
  const applyBatch     = useStore(s => s.applyEventBatch);
  const pendingBatchPreview = useStore(s => s.pendingBatchPreview);
  const dismissBatchPreview = useStore(s => s.dismissBatchPreview);

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
  const [staged, setStaged]         = useState([]);            // batch: staged changes not yet applied

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
    if (type === 'ADD_NPC') {
      payload.importance = importance;
      if (role) payload.role = role;
    }
    if (type === 'KILL_NPC') {
      // Derive the consequence tier from the NPC itself rather than asking the
      // DM to re-state what the dossier already knows. Both the state math
      // (registry KILL_NPC.stateDeltas) and the entity mutation read this, so
      // a pillar's death isn't silently down-graded to "notable".
      const npc = (settlement.npcs || []).find(
        n => String(n.id || n.name) === String(target),
      );
      if (npc) payload.importance = npc.importance || inferImportance(npc);
    }
    if (type === 'ADD_NPC' && institutionId) {
      payload.linkedInstitutionIds = [institutionId];
    }
    if (type === 'ASSIGN_NPC_TO_ROLE') {
      payload.quality = quality;
      if (role)          payload.role = role;
      if (institutionId) payload.institutionId = institutionId;
      // Importance + influence come from the role the NPC fills (the
      // institution's role catalogue), not a separate question.
      const inst = institutionId
        ? (settlement.institutions || []).find(i => String(i.id || i.name) === String(institutionId))
        : null;
      const roleOpts = inst ? rolesForInstitution(inst) : [];
      const imp = roleOpts.length ? importanceForRole(role, roleOpts) : null;
      if (imp) {
        payload.importance = imp;
        payload.influence  = influenceForImportance(imp);
      }
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
            {Object.entries(EVENT_REGISTRY)
              /* KILL_LEADER folded into KILL_NPC: killing a pillar/ruler NPC is
                 the leader event, and its consequences derive from that NPC's
                 own importance. Kept in the registry for back-compat. */
              .filter(([k]) => k !== 'KILL_LEADER')
              .map(([k, s]) => (
                <option key={k} value={k}>{s.label}</option>
              ))}
          </select>
        </Field>

        {(() => {
          // Code-review fix: source the target from existing dossier
          // entities rather than asking the user to type a name that
          // must match. Falls back to a text input for ADD_* events
          // (new entities) and route-type events that aren't in the
          // dossier as discrete records.
          const collectionKey = TARGET_ENTITY_BY_EVENT[type];
          const targetOpts = buildTargetOptions(settlement, collectionKey);
          if (collectionKey && targetOpts.length > 0) {
            return (
              <Field label="Target" hint={spec?.targetPrompt}>
                <select
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  style={selectStyle}
                >
                  <option value="">, Pick a {collectionKey.replace(/s$/, '')} -</option>
                  {targetOpts.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </Field>
            );
          }
          // No collection or empty list → keep the free text input so
          // the user can still author an event (e.g. ADD_NPC of a brand
          // new NPC, CUT_TRADE_ROUTE without a tracked route record).
          return (
            <Field label="Target" hint={spec?.targetPrompt}>
              <input
                value={target}
                onChange={e => setTarget(e.target.value)}
                placeholder={spec?.targetPrompt || 'optional'}
                style={inputStyle}
              />
            </Field>
          );
        })()}

        {type === 'DAMAGE_INSTITUTION' && (
          <Field label={`Severity ${(severity * 100).toFixed(0)}%`}>
            <input
              type="range" min="0.1" max="1" step="0.05"
              value={severity} onChange={e => setSeverity(Number(e.target.value))}
              style={{ width: 120 }}
            />
          </Field>
        )}

        {/* ADD_NPC defines a NEW NPC, so its importance is a real choice.
            KILL_NPC does not ask — it derives from the selected NPC below. */}
        {type === 'ADD_NPC' && (
          <Field label="Importance" hint={
            importance === 'pillar' ? 'Death creates major consequences' :
            importance === 'key'    ? 'Meaningful effect on linked entity' :
            importance === 'notable'? 'Small modifier on linked entity'   :
                                      'Flavor only. No engine effect'
          }>
            <select value={importance} onChange={e => setImportance(e.target.value)} style={selectStyle}>
              <option value="minor">Minor</option>
              <option value="notable">Notable</option>
              <option value="key">Key</option>
              <option value="pillar">Pillar</option>
            </select>
          </Field>
        )}

        {/* KILL_NPC: importance is pulled from the chosen NPC and shown
            read-only, so the DM sees the consequence tier before applying. */}
        {type === 'KILL_NPC' && target && (() => {
          const npc = (settlement.npcs || []).find(
            n => String(n.id || n.name) === String(target),
          );
          if (!npc) return null;
          const imp = npc.importance || inferImportance(npc);
          return (
            <Field label="Importance (from this NPC)" hint={
              imp === 'pillar' ? 'Pillar. Death shakes the settlement.' :
              imp === 'key'    ? 'Key. Meaningful effect on linked entity.' :
              imp === 'notable'? 'Notable. Small modifier on linked entity.' :
                                 'Minor. No engine effect.'
            }>
              <div style={{
                padding: '4px 8px', border: `1px solid ${BORDER}`, borderRadius: R.sm,
                fontSize: FS.xs, fontFamily: sans, color: INK, minWidth: 180,
                background: swatch['#FAF8F4'], fontWeight: 700,
                textTransform: 'capitalize', display: 'flex', alignItems: 'center',
              }}>
                {imp}
              </div>
            </Field>
          );
        })()}

        {(type === 'ADD_NPC' || type === 'ASSIGN_NPC_TO_ROLE') && (() => {
          // ASSIGN into a known institution: roles come from that institution's
          // catalogue (you can only fill seats it offers), and importance +
          // influence derive from the chosen role. ADD_NPC (inventing a person)
          // and ASSIGN with no institution keep free text.
          const inst = (type === 'ASSIGN_NPC_TO_ROLE' && institutionId)
            ? (settlement.institutions || []).find(i => String(i.id || i.name) === String(institutionId))
            : null;
          const roleOpts = inst ? rolesForInstitution(inst) : [];
          if (roleOpts.length > 0) {
            const derivedImp = importanceForRole(role, roleOpts);
            return (
              <Field label="Role" hint={role ? `Importance: ${derivedImp}` : 'Roles available at this institution'}>
                <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle}>
                  <option value="">, Pick a role -</option>
                  {roleOpts.map(r => <option key={r.role} value={r.role}>{r.role}</option>)}
                </select>
              </Field>
            );
          }
          return (
            <Field label="Role" hint="e.g. High Priestess, Watch Captain">
              <input value={role} onChange={e => setRole(e.target.value)} placeholder="optional" style={inputStyle} />
            </Field>
          );
        })()}

        {(type === 'ADD_NPC' || type === 'ASSIGN_NPC_TO_ROLE') && institutionOptions.length > 0 && (
          <Field label="Institution" hint="link this NPC to an institution">
            <select value={institutionId} onChange={e => setInstitutionId(e.target.value)} style={selectStyle}>
              <option value="">, None</option>
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
        <button
          onClick={() => { setStaged(prev => [...prev, buildEvent()]); setTarget(''); setDesc(''); }}
          disabled={!canSubmit}
          style={{
            padding: '5px 12px', background: 'transparent', color: GOLD,
            border: `1px solid ${GOLD}`, borderRadius: R.sm,
            fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
            cursor: canSubmit ? 'pointer' : 'not-allowed', opacity: canSubmit ? 1 : 0.5,
          }}
        >
          + Add to batch
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

      {staged.length > 0 && (
        <BatchCart
          staged={staged}
          settlement={settlement}
          phase={phase}
          pendingBatchPreview={pendingBatchPreview}
          onRemove={(i) => setStaged(prev => prev.filter((_, idx) => idx !== i))}
          onClear={() => { setStaged([]); dismissBatchPreview(); }}
          onPreview={() => previewBatch(staged)}
          onApply={() => { const r = applyBatch(staged); if (r?.ok) setStaged([]); }}
        />
      )}
    </div>
  );
}

function PreviewPanel({ preview }) {
  if (!preview) return null;
  const { deltas, factionResponses, narrativeSummary, warnings } = preview;
  return (
    <div style={{
      marginTop: SP.sm, padding: SP.sm,
      background: CARD, border: `1px solid ${GOLD}`, borderRadius: R.sm,
    }}>
      <div style={{ fontSize: FS.sm, fontFamily: sans, color: INK, fontWeight: 700, marginBottom: 4 }}>
        {narrativeSummary || 'Preview'}
      </div>
      {warnings?.length > 0 && (
        <ul style={{ margin: '4px 0', paddingLeft: 18, color: swatch.danger, fontSize: FS.xs, fontFamily: sans }}>
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

function labelOfTarget(targetId) {
  const tail = String(targetId || '').split('.').pop();
  return tail.replace(/_/g, ' ');
}

/**
 * BatchCart — the staging area for "multiple simultaneous changes". Lists the
 * staged events, surfaces blocking cross-reference warnings live (a change
 * that targets an entity neither in the settlement nor earlier in the batch),
 * and offers one Preview + one Apply for the whole set.
 */
function BatchCart({ staged, settlement, phase, pendingBatchPreview, onRemove, onClear, onPreview, onApply }) {
  const validation = validateBatch(settlement, staged);
  const blocks = (validation.warnings || []).filter(w => w.severity === 'block');
  return (
    <div style={{
      marginTop: SP.sm, padding: SP.sm,
      background: swatch['#FAF8F4'], border: `1px solid ${GOLD}`, borderRadius: R.sm,
    }}>
      <div style={{
        fontSize: FS.xs, fontWeight: 800, color: MUTED, fontFamily: sans,
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs,
      }}>
        Staged changes ({staged.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {staged.map((e, i) => (
          <div key={e.id || i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: FS.xs, fontFamily: sans, color: INK }}>
            <span style={{ fontWeight: 700, minWidth: 16, color: GOLD }}>{i + 1}.</span>
            <span style={{ flex: 1 }}>
              {EVENT_REGISTRY[e.type]?.label || e.type}{e.targetId ? `: ${labelOfTarget(e.targetId)}` : ''}
            </span>
            <button onClick={() => onRemove(i)} title="Remove" style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 2, display: 'flex' }}>
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      {blocks.length > 0 && (
        <ul style={{ margin: '6px 0 0', paddingLeft: 16, color: swatch.danger, fontSize: FS.xxs, fontFamily: sans }}>
          {blocks.map((w, i) => <li key={i}>{w.message}</li>)}
        </ul>
      )}
      {pendingBatchPreview?.systemStateDeltas?.length > 0 && (
        <div style={{ marginTop: 6 }}>
          {pendingBatchPreview.systemStateDeltas.map((d, i) => <DeltaRow key={i} d={d} />)}
        </div>
      )}
      <div style={{ display: 'flex', gap: SP.xs, marginTop: SP.sm }}>
        <button onClick={onPreview} style={primaryBtn(false)}>Preview batch</button>
        <button
          onClick={onApply}
          disabled={blocks.length > 0}
          style={{ ...confirmBtn, opacity: blocks.length > 0 ? 0.5 : 1, cursor: blocks.length > 0 ? 'not-allowed' : 'pointer' }}
        >
          <Check size={11} /> {phase === 'canon' ? `Apply ${staged.length} to timeline` : `Apply all (${staged.length})`}
        </button>
        <button onClick={onClear} style={cancelBtn}>Clear</button>
      </div>
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
