import { ChevronRight } from 'lucide-react';

import { FS, MUTED, sans } from '../theme.js';
import { useRealmEntities } from './RealmEntityContext.jsx';
import RealmEntityLink from '../primitives/RealmEntityLink.jsx';

/**
 * AddressChain — THE NEWS ADDRESS LAW's linked subject chain (owner doctrine
 * 2026-07-22). Given the TYPED ids a Realm Inspector item carries, it resolves
 * the subject's containment address through the realm entity web and renders it
 * as a breadcrumb of live cross-settlement links:
 *
 *     settlement  ›  power  ›  faction  ›  npc
 *
 * as deep as the record identifies. Each level opens that entity's card in its
 * settlement's dossier. Levels that are not derivable are DROPPED (the resolver
 * never fabricates); a record that names no addressable subject resolves to
 * nothing and this component renders null, leaving the item's own prose to
 * stand.
 *
 * PRESENCE OVER REPETITION: pass `omitSettlement` when the item already sits
 * under a settlement heading, so a feed of thirty items does not repeat the
 * settlement name on every row while the full address stays derivable at a
 * glance.
 *
 * @param {object} props
 * @param {{ npcId?: string|null, factionId?: string|null, settlementId?: string|number|null, factionName?: string|null }} props.descriptor
 * @param {boolean} [props.omitSettlement]  Drop the leading settlement level (already shown by a heading).
 * @param {object} [props.style]            Extra inline style merged onto the row.
 */
export function AddressChain({ descriptor, omitSettlement = false, style }) {
  const { web } = useRealmEntities();
  const chain = web && descriptor ? web.resolveSubject(descriptor) : null;
  if (!chain || chain.length === 0) return null;

  const levels = omitSettlement ? chain.filter(l => l.role !== 'settlement') : chain;
  if (levels.length === 0) return null;

  return (
    <span style={{
      display: 'inline-flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 3,
      fontFamily: sans,
      fontSize: FS.xxs,
      fontWeight: 700,
      lineHeight: 1.4,
      ...style,
    }}>
      {levels.map((level, i) => (
        <span key={`${level.role}-${level.entityId || i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          {i > 0 && <ChevronRight size={11} color={MUTED} aria-hidden="true" style={{ flexShrink: 0 }} />}
          <RealmEntityLink
            settlementSaveId={level.settlementSaveId}
            entityId={level.entityId}
            label={level.label}
            linked={level.linked}
          />
        </span>
      ))}
    </span>
  );
}

/**
 * AffectedSettlements — the law's AFFECTED SETTLEMENT(S) part: a settlement is
 * always named, and here also LINKED. Resolves each save id through the realm web
 * so every affected settlement opens its dossier. Renders nothing when no id
 * resolves (degrade). Cross-settlement targets are named by their real name, not
 * a raw id.
 *
 * @param {object} props
 * @param {Array<string|number>} props.ids   Settlement save ids.
 * @param {string} [props.label]             Leading label (default 'Affects').
 * @param {number} [props.max]               Cap the visible links (default 4); a "+N" tail counts the rest.
 * @param {object} [props.style]             Extra inline style merged onto the row.
 */
export function AffectedSettlements({ ids, label = 'Affects', max = 4, style }) {
  const { web } = useRealmEntities();
  const list = Array.isArray(ids) ? ids : [];
  if (!web || list.length === 0) return null;

  const seen = new Set();
  const resolved = [];
  for (const id of list) {
    const key = String(id);
    if (seen.has(key)) continue;
    seen.add(key);
    const chain = web.resolveSettlement(id);
    const level = chain && chain[0];
    if (level) resolved.push(level);
  }
  if (resolved.length === 0) return null;

  const shown = resolved.slice(0, max);
  const extra = resolved.length - shown.length;

  return (
    <span style={{
      display: 'inline-flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 4,
      fontFamily: sans,
      fontSize: FS.xxs,
      fontWeight: 700,
      lineHeight: 1.4,
      ...style,
    }}>
      <span style={{ color: MUTED, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      {shown.map((level, i) => (
        <span key={level.settlementSaveId} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {i > 0 && <span style={{ color: MUTED }} aria-hidden="true">,</span>}
          <RealmEntityLink
            settlementSaveId={level.settlementSaveId}
            entityId={level.entityId}
            label={level.label}
            linked={level.linked}
          />
        </span>
      ))}
      {extra > 0 && <span style={{ color: MUTED }}>{`+${extra}`}</span>}
    </span>
  );
}
