/**
 * eventComposer/helpers.js — pure helpers extracted from EventComposer.jsx
 * (behavior-preserving decomposition). buildTargetOptions normalizes a
 * dossier collection into {id, name} dropdown options; labelOfTarget turns a
 * dotted target id into a human label.
 */

import { canonExports, canonImports, canonStressors } from '../../../domain/canonicalAccessors.js';
import { swatch } from '../../theme.js';

// Party-attribution accent — a heraldic crimson, distinct from the gold brand
// accent and the purple AI-narrative tint, so "the party did this" reads clearly.
// Shared by EventComposer (the "Caused by the party" toggle) and PreviewPanel
// (the "Party-caused" badge), so the hex is declared in one place.
export const PARTY = swatch['#8A2F4A'];
export const PARTY_BG = swatch['#F7EBF0'];

/** Build {id, name} options from a dossier collection for the target dropdown. */
export function buildTargetOptions(settlement, collectionKey) {
  if (!collectionKey || !settlement) return [];
  let list;
  switch (collectionKey) {
    case 'institutions': list = settlement.institutions || []; break;
    case 'npcs':         list = settlement.npcs || []; break;
    case 'factions':     list = settlement.powerStructure?.factions || []; break;
    case 'neighbours':   {
      const net = settlement.neighbourNetwork || settlement.neighbourLinks || [];
      list = net.map((l) => ({ id: l.name || l.neighbourName || l.id, name: l.name || l.neighbourName || l.id }));
      break;
    }
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
    case 'stressors':    {
      // canonStressors covers the mutation's full probe: the array containers
      // AND the bare-object shape pipeline settlements carry (assembleSettlement
      // dual-writes the single rolled stressor as a bare object under stress +
      // stressors). The old Array.isArray-only probe returned [] for every
      // pipeline-generated settlement, so Resolve Stressor fell back to free
      // text instead of offering the live crisis.
      list = canonStressors(settlement).filter(Boolean).map(st => ({
        id: st.type || st.name || st.label,
        name: st.label || st.name || st.type,
      }));
      break;
    }
    case 'tradeGoods':   {
      // Union of the canonical export/import lists + transit, tolerant of
      // legacy {name, good} object entries the Roster editor writes.
      const ec = settlement.economicState || {};
      const labels = [
        ...canonExports(settlement),
        ...canonImports(settlement),
        ...(Array.isArray(ec.transit) ? ec.transit : []),
      ]
        .map(e => (typeof e === 'string' ? e : e?.name || e?.good || ''))
        .filter(Boolean);
      list = labels.map(l => ({ id: l, name: l }));
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

/**
 * #6 — {id, name} options for OPENED_TRADE_ROUTE's optional campaign-settlement
 * target: every OTHER active-campaign member of the active save. Resolved from
 * the raw campaigns array keyed by activeSaveId (the PendingIntentions pattern),
 * so a trade route can open with any campaign peer, not only a linked neighbour.
 */
export function campaignPeerOptions(campaigns, savedSettlements, activeSaveId) {
  if (activeSaveId == null) return [];
  const sid = String(activeSaveId);
  const c = (campaigns || []).find(x =>
    (x?.accessState || 'active') === 'active'
    && (x.settlementIds || []).map(String).includes(sid));
  if (!c) return [];
  const others = new Set((c.settlementIds || []).map(String).filter(id => id !== sid));
  return (savedSettlements || [])
    .filter(save => others.has(String(save.id)))
    .map(save => ({ id: String(save.id), name: String(save.settlement?.name || save.name || save.id) }))
    .filter(o => o.id && o.name);
}

/**
 * The corrupt, not-yet-ousted NPCs eligible for EXPOSE_CORRUPTION, as {id, name}
 * options. The mutation no-ops on a clean target, so the picker must offer only
 * corrupt NPCs — otherwise a clean pick would move the dials and write prose
 * with no real state behind it. The name is suffixed so corrupt NPCs are not
 * indistinguishable from the rest of the roster in the dropdown.
 */
export function corruptNpcOptions(settlement) {
  return buildTargetOptions(settlement, 'npcs').filter((o) => {
    const npc = (settlement?.npcs || []).find(
      n => String(n?.id || n?.name) === o.id || String(n?.name) === o.name,
    );
    return !!(npc && npc.corrupt === true && !npc.ousted);
  }).map(o => ({ ...o, name: `${o.name} (corrupt)` }));
}

export function labelOfTarget(targetId) {
  const tail = String(targetId || '').split('.').pop();
  return tail.replace(/_/g, ' ');
}
