/**
 * ComposerNavigator — "nobody ever meets the catalog" (Composer V2 §4).
 *
 * Three ways into a verb, all projections of the affordance manifest:
 *   • THE PRESSURES RAIL — the situation speaks first: active conditions
 *     surface at most THREE verbs they make relevant (§4 cap, design law).
 *   • TARGET-FIRST (primary) — pick any entity of the dossier; its legal
 *     verbs, predicate-filtered to NOW, appear as chips (typically 5–12).
 *   • FAMILY BROWSE (secondary) — the manifest's affected-domain families.
 *   • SEARCH (tertiary) — CatalogPicker generalized over the verb manifest.
 *
 * Unavailability TEACHES (§2): a predicate-false verb renders grayed with its
 * reason + unlock hint — never silently absent. Picking a verb (and, in
 * target-first, its target) is reported upward; the host owns all form state.
 */

import { useState } from 'react';
import { Compass } from 'lucide-react';
import {
  AFFORDANCE_MANIFEST, VERB_FAMILIES, ENTITY_KINDS,
  authorableVerbs, verbsForEntityKind, pressureSuggestions, buildTargetOptions,
} from '../../../domain/events/affordanceManifest.js';
import CatalogPicker from '../CatalogPicker.jsx';
import { EVENT_PROSE } from '../../../domain/events/registryProse.js';
import Button from '../../primitives/Button.jsx';
import { GOLD, INK, MUTED, BORDER, sans, FS, SP, swatch } from '../../theme.js';
import { selectStyle } from './EventComposerConstants.js';

const KIND_LABELS = Object.freeze({
  settlement: 'The settlement', institutions: 'Institution', npcs: 'NPC',
  factions: 'Faction', neighbours: 'Neighbour', resources: 'Resource',
  stressors: 'Stressor', tradeGoods: 'Trade good',
});

// Pill chip look layered over the Button primitive (focus-ring, min target,
// disabled state come from the primitive; only the silhouette is local).
const chipStyle = (enabled) => ({
  padding: '3px 9px', borderRadius: 999, minHeight: 22,
  border: `1px solid ${enabled ? GOLD : BORDER}`,
  background: enabled ? swatch['#FAF8F4'] : 'transparent',
  color: enabled ? INK : MUTED,
  fontSize: FS.xxs, fontFamily: sans, fontWeight: 700,
});

function VerbChips({ verbs, settlement, ctx, onPick }) {
  if (!verbs.length) {
    return <span style={{ fontSize: FS.xxs, fontStyle: 'italic', color: MUTED }}>No actions here yet.</span>;
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {verbs.map(v => {
        const p = v.predicate(settlement, ctx);
        const why = p.available ? '' : [...p.reasons, ...p.unlocks].join(' ');
        return (
          <Button
            key={v.type}
            size="sm"
            variant="ghost"
            disabled={!p.available}
            title={why || v.label}
            aria-label={p.available ? v.label : `${v.label} — ${why}`}
            onClick={() => onPick(v.type)}
            style={chipStyle(p.available)}
          >
            {v.label}{!p.available && ' ✕'}
          </Button>
        );
      })}
    </div>
  );
}

export function ComposerNavigator({ settlement, ctx, onPickVerb, onPickTargetVerb }) {
  const [mode, setMode] = useState('target');   // 'target' | 'family' | 'search'
  const [entityKind, setEntityKind] = useState('');
  const [entityId, setEntityId] = useState('');
  const [family, setFamily] = useState(VERB_FAMILIES[0]);

  const pressures = pressureSuggestions(settlement, 3);
  const entityOptions = entityKind && entityKind !== 'settlement'
    ? buildTargetOptions(settlement, entityKind)
    : [];

  const searchItems = authorableVerbs().map(v => {
    const p = v.predicate(settlement, ctx);
    return {
      id: v.type,
      name: v.label,
      category: v.family,
      // Grayed-with-reason beats absent (§2): an unavailable verb stays
      // findable, its description saying exactly why and what would unlock it.
      desc: p.available
        ? (EVENT_PROSE[v.type]?.description || '')
        : `Unavailable — ${[...p.reasons, ...p.unlocks].join(' ')}`,
    };
  });

  return (
    <div style={{ marginBottom: SP.sm }}>
      {/* THE PRESSURES RAIL — the situation loads what you see (≤3 by law). */}
      {pressures.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: FS.xxs, fontWeight: 800, color: swatch.danger, fontFamily: sans, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Pressing now
          </span>
          {pressures.map((sug, i) => (
            <Button
              key={`${sug.type}-${i}`}
              size="sm"
              variant="ghost"
              title={sug.reason}
              onClick={() => onPickTargetVerb(sug.type, sug.targetId || '')}
              style={chipStyle(true)}
            >
              {AFFORDANCE_MANIFEST[sug.type]?.label || sug.type}
            </Button>
          ))}
        </div>
      )}

      {/* Mode row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <Compass size={12} color={GOLD} aria-hidden="true" />
        {[['target', 'Start from a target'], ['family', 'Browse by domain'], ['search', 'Search actions']].map(([m, label]) => (
          <Button
            key={m}
            size="sm"
            variant="ghost"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            style={{
              ...chipStyle(true),
              border: `1px solid ${mode === m ? GOLD : BORDER}`,
              background: mode === m ? swatch['#FAF8F4'] : 'transparent',
              fontWeight: mode === m ? 800 : 600,
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      {mode === 'target' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: SP.sm }}>
          <select
            value={entityKind}
            onChange={e => { setEntityKind(e.target.value); setEntityId(''); }}
            aria-label="Entity kind"
            style={selectStyle}
          >
            <option value="">— What are you acting on? —</option>
            {ENTITY_KINDS.map(k => <option key={k} value={k}>{KIND_LABELS[k] || k}</option>)}
          </select>
          {entityKind && entityKind !== 'settlement' && (
            <select
              value={entityId}
              onChange={e => setEntityId(e.target.value)}
              aria-label={`${KIND_LABELS[entityKind] || entityKind} to act on`}
              style={selectStyle}
            >
              <option value="">— Pick one —</option>
              {entityOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          )}
          {entityKind && (entityKind === 'settlement' || entityId) && (
            <VerbChips
              verbs={verbsForEntityKind(entityKind)}
              settlement={settlement}
              ctx={ctx}
              onPick={(type) => onPickTargetVerb(type, entityKind === 'settlement' ? '' : entityId)}
            />
          )}
        </div>
      )}

      {mode === 'family' && (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 6 }}>
            {VERB_FAMILIES.map(f => (
              <Button
                key={f}
                size="sm"
                variant="ghost"
                onClick={() => setFamily(f)}
                aria-pressed={family === f}
                style={{
                  ...chipStyle(true),
                  border: `1px solid ${family === f ? GOLD : BORDER}`,
                  fontWeight: family === f ? 800 : 600,
                }}
              >
                {f}
              </Button>
            ))}
          </div>
          <VerbChips
            verbs={authorableVerbs().filter(v => v.family === family)}
            settlement={settlement}
            ctx={ctx}
            onPick={onPickVerb}
          />
        </div>
      )}

      {mode === 'search' && (
        <CatalogPicker
          closeOnPick
          items={searchItems}
          onAdd={(item) => onPickVerb(item.id)}
          placeholder="Search actions…"
          categoryFilters={[...VERB_FAMILIES]}
          triggerLabel="Search all actions"
        />
      )}
    </div>
  );
}
