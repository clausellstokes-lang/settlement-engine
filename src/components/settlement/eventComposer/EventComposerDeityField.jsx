/**
 * EventComposerDeityField — the patron + cult inputs for the Make Changes composer,
 * folded in from the retired "Patron & Cults" Workshop card (PrimaryDeityPicker +
 * CultPicker). It feeds the staged SET_PRIMARY_DEITY / IMPOSE_CULT events: the user
 * picks a deity ref here, and buildEvent resolves the frozen snapshot from
 * customContent at apply time (resolveDeitySnapshot), byte-identical to the
 * setPrimaryDeity / imposeCult store actions the map still uses.
 *
 * It owns the premium gate, the zero-deities prompt, and the cult capacity/niche
 * rules. canStageDeityEvent() (below) runs the SAME placement probe the store does
 * (reconcileCultImposition), so the composer can refuse a no-op or unseatable
 * imposition before it ever reaches the change-queue.
 */

import { useMemo } from 'react';
import { buildRegistry, customRefIdFromItem, resolveDeitySnapshot } from '../../../lib/customRegistry.js';
import { reconcileCultImposition, capacityForTier } from '../../../domain/worldPulse/religionState.js';
import { MUTED, sans, FS } from '../../theme.js';
import Button from '../../primitives/Button.jsx';
import { navigate } from '../../../hooks/useRoute.js';
import { Field } from './Field.jsx';
import { selectStyle } from './EventComposerConstants.js';

function listDeities(customContent) {
  return buildRegistry(customContent || {}).listCustom('deities');
}
const refOf = (d) => d.refId || customRefIdFromItem(d.raw);

const patronRefOf = (config) => config.primaryDeityRef || config.primaryDeitySnapshot?._deityRef || '';
const cultListOf = (config) => (Array.isArray(config.cultDeitySnapshots) ? config.cultDeitySnapshots : []);

/**
 * Can the currently-formed deity event be staged WITHOUT being a no-op or a
 * refused imposition? Mirrors the guards in setPrimaryDeity / imposeCult so the
 * composer's Apply stays disabled until the action would actually land.
 */
export function canStageDeityEvent({ type, settlement, deityRef, deityMode, cultRemoveRef, customContent, canUseCustom }) {
  if (!canUseCustom) return false;
  const config = settlement?.config || {};
  if (type === 'SET_PRIMARY_DEITY') {
    if (deityMode === 'remove') return !!config.primaryDeitySnapshot; // removing requires a patron to remove
    return !!resolveDeitySnapshot(customContent, deityRef);            // assigning requires a resolvable deity
  }
  if (type === 'IMPOSE_CULT') {
    const cults = cultListOf(config);
    if (deityMode === 'remove') {
      return !!cultRemoveRef && cults.some(c => String(c._deityRef || c.name || '') === String(cultRemoveRef));
    }
    const snapshot = resolveDeitySnapshot(customContent, deityRef);
    if (!snapshot) return false;
    const probe = reconcileCultImposition({
      patron: config.primaryDeitySnapshot || null,
      cults,
      tier: settlement?.tier || config.tier || 'village',
      deity: { _deityRef: deityRef, ...snapshot },
    });
    return probe.action !== 'refused';
  }
  return false;
}

function UpsellOrEmpty({ label, prompt, canUseCustom, hasDeities, setPurchaseModalOpen }) {
  if (!canUseCustom) {
    return (
      <Field label={label}>
        <div style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5, maxWidth: 320 }}>
          {prompt}{' '}
          <Button variant="ghost" size="sm" onClick={() => setPurchaseModalOpen?.(true)}>Upgrade to premium</Button>{' '}
          to author and assign deities.
        </div>
      </Field>
    );
  }
  if (!hasDeities) {
    return (
      <Field label={label}>
        <div style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5, maxWidth: 320 }}>
          No deities authored yet.{' '}
          <Button variant="ghost" size="sm" onClick={() => navigate('compendium', { search: '?mode=custom&cat=deities' })}>Author a deity</Button>{' '}
          to assign one here.
        </div>
      </Field>
    );
  }
  return null;
}

export function EventComposerDeityField({
  type, settlement, customContent, canUseCustom, setPurchaseModalOpen,
  deityRef, setDeityRef, deityMode, setDeityMode, cultRemoveRef, setCultRemoveRef,
}) {
  const deities = useMemo(() => listDeities(customContent), [customContent]);
  const config = settlement?.config || {};

  const gate = (
    <UpsellOrEmpty
      label={type === 'IMPOSE_CULT' ? 'Cult' : 'Patron deity'}
      prompt={type === 'IMPOSE_CULT'
        ? 'Impose minor cults beneath the patron to seed a contested pantheon.'
        : 'Assign a patron god to drive the religion layer.'}
      canUseCustom={canUseCustom}
      hasDeities={deities.length > 0}
      setPurchaseModalOpen={setPurchaseModalOpen}
    />
  );
  if (!canUseCustom || deities.length === 0) return gate;

  if (type === 'SET_PRIMARY_DEITY') {
    const currentRef = patronRefOf(config);
    const value = deityMode === 'remove' ? '' : (deityRef || currentRef);
    return (
      <Field label="Patron deity" hint="Stages this settlement's patron; choose No patron to clear it">
        <select
          value={value}
          onChange={e => { const v = e.target.value; if (!v) { setDeityMode('remove'); setDeityRef(''); } else { setDeityMode('assign'); setDeityRef(v); } }}
          style={selectStyle}
        >
          <option value="">No patron deity (dormant)</option>
          {deities.map(d => { const ref = refOf(d); return <option key={ref} value={ref}>{d.name}</option>; })}
        </select>
      </Field>
    );
  }

  // IMPOSE_CULT
  const cults = cultListOf(config);
  const patronRef = patronRefOf(config);
  const tier = settlement?.tier || config.tier || 'village';
  const cultCapacity = Math.max(0, capacityForTier(tier) - (config.primaryDeitySnapshot ? 1 : 0));
  const cultRefs = new Set(cults.map(c => String(c._deityRef || c.name || '')));
  const addOptions = deities.filter(d => { const ref = refOf(d); return ref !== patronRef && !cultRefs.has(ref); });

  return (
    <>
      <Field label="Cult action" hint={`${cults.length} / ${cultCapacity} cult slots filled`}>
        <select
          value={deityMode === 'remove' ? 'remove' : 'add'}
          onChange={e => { setDeityMode(e.target.value === 'remove' ? 'remove' : 'assign'); setDeityRef(''); setCultRemoveRef(''); }}
          style={selectStyle}
          disabled={cults.length === 0}
        >
          <option value="add">Impose a cult</option>
          {cults.length > 0 && <option value="remove">Remove a cult</option>}
        </select>
      </Field>
      {deityMode === 'remove' ? (
        <Field label="Cult to remove">
          <select value={cultRemoveRef || ''} onChange={e => setCultRemoveRef(e.target.value)} style={selectStyle}>
            <option value="">Pick a cult…</option>
            {cults.map(c => { const ref = String(c._deityRef || c.name || ''); return <option key={ref} value={ref}>{c.name}</option>; })}
          </select>
        </Field>
      ) : cultCapacity === 0 ? (
        <Field label="Cult">
          <div style={{ fontSize: FS.micro, color: MUTED, lineHeight: 1.5, maxWidth: 280, fontFamily: sans, padding: '5px 0' }}>
            This settlement is too small to sustain a cult beneath its patron. Larger settlements hold more faiths.
          </div>
        </Field>
      ) : (
        <Field label="Cult to impose" hint="One faith per temperament × alignment niche; the patron's niche sparks a contest">
          <select value={deityRef || ''} onChange={e => setDeityRef(e.target.value)} style={selectStyle} disabled={addOptions.length === 0}>
            <option value="">{addOptions.length ? 'Impose a cult…' : 'No more deities to impose'}</option>
            {addOptions.map(d => { const ref = refOf(d); return <option key={ref} value={ref}>{d.name}</option>; })}
          </select>
        </Field>
      )}
    </>
  );
}
