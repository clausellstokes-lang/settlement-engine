/**
 * EventComposerTargetField — the per-event-type "Target" control. Renders the
 * right picker for the active event: catalog pickers (institution / stressor),
 * grouped selects (faction / ruling power / promote-demote NPC pair), the
 * trade-good datalist input, the resource catalog + custom escape hatch, the
 * dossier-entity dropdown, or a free-text fallback.
 *
 * Extracted verbatim from EventComposer.jsx (behavior-preserving decomposition):
 * this is the `{(() => { ... })()}` block from the form. All state lives in the
 * parent and is passed in as props; this component is purely presentational.
 */

import { X } from 'lucide-react';
import CatalogPicker from '../CatalogPicker.jsx';
import IconButton from '../../primitives/IconButton.jsx';
import { MUTED, FS } from '../../theme.js';
import { buildTargetOptions, corruptNpcOptions } from './helpers.js';
import { Field } from './Field.jsx';
import {
  TARGET_ENTITY_BY_EVENT, CUSTOM_RESOURCE_OPTION,
  inputStyle, selectStyle, pickedChipStyle,
} from './EventComposerConstants.js';

export function EventComposerTargetField({
  type, target, setTarget, spec, settlement,
  setAddCategory, setStressorPick, stressorPick,
  setCustomResourceName, customResourceName,
  setSwapWithNpcId, swapWithNpcId,
  institutionCatalogItems, institutionCategories,
  stressorPickerItems, rulingPowerOptions, factionGroups,
  tradeGoodSuggestions, resourceCatalogOptions, npcSwapGroups,
}) {
  // Catalog-backed adds. Institutions come from the catalog picker
  // (searchable, filtered to what's not already here); factions from
  // the descriptor compendium, grouped by category and filtered the
  // same way. Both set the event target to the chosen name — no free
  // typing of names the engine already knows.
  if (type === 'ADD_INSTITUTION') {
    return (
      <Field label="Institution" hint={target ? `Adding: ${target}` : 'Pick from the catalog'}>
        {target && (
          <div style={pickedChipStyle}>
            <span>{target}</span>
            <IconButton Icon={X} label="Remove institution" title="Clear" onClick={() => { setTarget(''); setAddCategory(''); }} tone="ghost" size="sm" />
          </div>
        )}
        <CatalogPicker
          closeOnPick
          items={institutionCatalogItems}
          onAdd={(item) => { setTarget(item.name); setAddCategory(item.category || 'civic'); }}
          placeholder="Search institutions..."
          categoryFilters={institutionCategories}
          triggerLabel={target ? 'Pick a different institution' : undefined}
        />
      </Field>
    );
  }
  if (type === 'APPLY_STRESSOR') {
    return (
      <Field label="Stressor" hint={target ? `Applying: ${stressorPick?.name || target}` : 'Pick from the full catalog (incl. custom)'}>
        {target && (
          <div style={pickedChipStyle}>
            <span>{stressorPick?.name || target}</span>
            <IconButton Icon={X} label="Remove stressor" title="Clear" onClick={() => { setTarget(''); setStressorPick(null); }} tone="ghost" size="sm" />
          </div>
        )}
        <CatalogPicker
          closeOnPick
          items={stressorPickerItems}
          onAdd={(item) => { setTarget(item.key); setStressorPick(item); }}
          placeholder="Search stressors..."
          categoryFilters={['Settlement', 'Campaign', 'Custom']}
          triggerLabel={target ? 'Pick a different stressor' : undefined}
        />
      </Field>
    );
  }
  if (type === 'CHANGE_RULING_POWER') {
    return (
      <Field label="New ruling power" hint={spec?.targetPrompt}>
        <select value={target} onChange={e => setTarget(e.target.value)} style={selectStyle}>
          <option value="">, Pick a faction -</option>
          {rulingPowerOptions.map(o => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
        {rulingPowerOptions.length === 0 && (
          <span style={{ fontSize: FS.xxs, fontStyle: 'italic', color: MUTED, opacity: 0.8 }}>
            No other faction holds power here. Add a faction first.
          </span>
        )}
      </Field>
    );
  }
  if (type === 'ADD_FACTION') {
    return (
      <Field label="Faction" hint="Choose a faction that isn't here yet">
        <select value={target} onChange={e => setTarget(e.target.value)} style={selectStyle}>
          <option value="">Select a faction</option>
          {factionGroups.map(g => (
            <optgroup key={g.category} label={g.label}>
              {g.options.map(o => <option key={o.name} value={o.name}>{o.name}</option>)}
            </optgroup>
          ))}
        </select>
        {factionGroups.length === 0 && (
          <span style={{ fontSize: FS.xxs, fontStyle: 'italic', color: MUTED, opacity: 0.8 }}>
            Every catalogued faction is already present. Name a new one in Description.
          </span>
        )}
      </Field>
    );
  }
  // ADD_TRADE_GOOD — free text with catalog suggestions; the label is
  // the storage format, so anything typed is a valid good.
  if (type === 'ADD_TRADE_GOOD') {
    return (
      <Field label="Good" hint={spec?.targetPrompt}>
        <input
          list="event-trade-good-suggestions"
          value={target}
          onChange={e => setTarget(e.target.value)}
          placeholder="Type a label or pick a suggestion"
          aria-label="Good"
          style={inputStyle}
        />
        <datalist id="event-trade-good-suggestions">
          {tradeGoodSuggestions.map(n => <option key={n} value={n} aria-label={n} />)}
        </datalist>
      </Field>
    );
  }
  // ADD_RESOURCE — catalog select (label shown, underscore key stored)
  // plus a "Custom resource…" escape hatch with a free-text name.
  if (type === 'ADD_RESOURCE') {
    return (
      <Field label="Resource" hint={target === CUSTOM_RESOURCE_OPTION ? 'Name the custom resource' : spec?.targetPrompt}>
        <select
          value={target}
          onChange={e => { setTarget(e.target.value); setCustomResourceName(''); }}
          style={selectStyle}
        >
          <option value="">, Pick a resource -</option>
          {resourceCatalogOptions.map(o => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
          <option value={CUSTOM_RESOURCE_OPTION}>Custom resource…</option>
        </select>
        {target === CUSTOM_RESOURCE_OPTION && (
          <input
            value={customResourceName}
            onChange={e => setCustomResourceName(e.target.value)}
            placeholder='e.g. "Moonpetal grove"'
            aria-label="Custom resource name"
            style={{ ...inputStyle, marginTop: 4 }}
          />
        )}
      </Field>
    );
  }
  // PROMOTE_NPC / DEMOTE_NPC — pick the NPC (grouped by faction), then
  // the same-faction counterpart they swap standing with.
  if (type === 'PROMOTE_NPC' || type === 'DEMOTE_NPC') {
    const pickedGroup = npcSwapGroups.find(g => g.npcs.some(n => n.id === target));
    const counterparts = pickedGroup ? pickedGroup.npcs.filter(n => n.id !== target) : [];
    return (
      <>
        <Field label="NPC" hint={spec?.targetPrompt}>
          <select
            value={target}
            onChange={e => { setTarget(e.target.value); setSwapWithNpcId(''); }}
            style={selectStyle}
          >
            <option value="">, Pick an NPC -</option>
            {npcSwapGroups.map(g => (
              <optgroup key={g.faction} label={g.faction}>
                {g.npcs.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field
          label={type === 'PROMOTE_NPC' ? 'Displaces' : 'Displaced by'}
          hint="Same faction. The two swap standing"
        >
          <select
            value={swapWithNpcId}
            onChange={e => setSwapWithNpcId(e.target.value)}
            style={selectStyle}
            disabled={!target}
          >
            <option value="">, Pick the counterpart -</option>
            {counterparts.map(n => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
        </Field>
      </>
    );
  }
  // Code-review fix: source the target from existing dossier
  // entities rather than asking the user to type a name that
  // must match. Falls back to a text input for ADD_* events
  // (new entities) and route-type events that aren't in the
  // dossier as discrete records.
  const collectionKey = TARGET_ENTITY_BY_EVENT[type];
  // EXPOSE_CORRUPTION reveals a corrupt NPC; the mutation no-ops on any clean
  // target, so the picker offers only corrupt NPCs (clean picks would move the
  // dials and write prose with no real state behind them).
  const targetOpts = type === 'EXPOSE_CORRUPTION'
    ? corruptNpcOptions(settlement)
    : buildTargetOptions(settlement, collectionKey);
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
        aria-label="Target"
        style={inputStyle}
      />
    </Field>
  );
}
