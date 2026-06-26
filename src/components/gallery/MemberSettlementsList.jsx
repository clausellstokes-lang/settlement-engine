/**
 * MemberSettlementsList.jsx — the "Settlements in this realm" list on a
 * map+campaign gallery detail page.
 *
 * Each member of a shared realm (the members[] from get_gallery_map) is either:
 *   - PUBLISHED (carries a public_slug) → a deep-link card that routes to that
 *     member's own gallery dossier at /gallery?slug=<slug>, so the reader follows
 *     it to its full page rather than reading a duplicate inline.
 *   - UNPUBLISHED (no slug) → a card with an inline EXPANDER that renders the
 *     member's sanitized dossier in place (member.settlement + member.chronicle),
 *     reusing PublicDossierView so the realm stays a navigable microcosm even for
 *     members that were never published on their own.
 *
 * The member objects are already public-safe (the RPC runs them through the same
 * sanitizers as the settlement gallery), so this is a pure read-only renderer.
 */

import { lazy, Suspense, useState } from 'react';
import { ExternalLink } from 'lucide-react';

import { TIER_LABELS } from '../new/design.js';
import {
  BORDER,
  BORDER2,
  CARD,
  CARD_ALT,
  FS,
  GOLD,
  INK,
  MUTED,
  R,
  SECOND,
  SP,
  sans,
  serif_,
} from '../theme.js';
import Button from '../primitives/Button.jsx';
import { galleryUrlFor, human } from './galleryUtils.js';

const PublicDossierView = lazy(() => import('../PublicDossierView.jsx'));

/** A member that was published on its own — a deep-link card to its dossier. */
function LinkedMemberCard({ member }) {
  const tierLabel = TIER_LABELS[member?.tier] || human(member?.tier);
  return (
    <a
      href={galleryUrlFor(member.public_slug)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.sm, padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, borderRadius: R.md, background: CARD, textDecoration: 'none' }}
    >
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', color: INK, fontFamily: serif_, fontSize: FS.md, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {member?.name || 'Settlement'}
        </span>
        {tierLabel && (
          <span style={{ color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, textTransform: 'capitalize' }}>
            {tierLabel}
          </span>
        )}
      </span>
      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4, color: GOLD, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
        Open dossier <ExternalLink size={13} aria-hidden />
      </span>
    </a>
  );
}

/** A member with no own listing — an inline expander over its sanitized dossier. */
function InlineMemberCard({ member }) {
  const [open, setOpen] = useState(false);
  const tierLabel = TIER_LABELS[member?.tier] || human(member?.tier);
  // The member object is already public-safe; shape it into the dossier PublicDossierView reads.
  const dossier = {
    settlement: member?.settlement,
    name: member?.name,
    tier: member?.tier,
    chronicle: member?.chronicle,
  };
  const canExpand = !!member?.settlement;
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: R.md, background: CARD, overflow: 'hidden' }}>
      <Button
        variant="ghost"
        fullWidth
        onClick={() => canExpand && setOpen(o => !o)}
        aria-expanded={open}
        disabled={!canExpand}
        style={{ justifyContent: 'space-between', gap: SP.sm, padding: `${SP.sm}px ${SP.md}px`, borderRadius: 0, whiteSpace: 'normal', textAlign: 'left' }}
      >
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'block', color: INK, fontFamily: serif_, fontSize: FS.md, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {member?.name || 'Settlement'}
          </span>
          {tierLabel && (
            <span style={{ color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, textTransform: 'capitalize' }}>
              {tierLabel}
            </span>
          )}
        </span>
        {canExpand && (
          <span style={{ flexShrink: 0, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
            {open ? 'Hide dossier' : 'Read dossier'}
          </span>
        )}
      </Button>
      {open && canExpand && (
        <div style={{ borderTop: `1px solid ${BORDER2}`, background: CARD_ALT, padding: SP.md }}>
          <Suspense fallback={<p style={{ margin: 0, color: MUTED, fontFamily: sans, fontSize: FS.sm }}>Loading dossier...</p>}>
            <PublicDossierView dossier={dossier} showHeader={false} />
          </Suspense>
        </div>
      )}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {Array<{ old_id: string, name: string, tier: string, public_slug: string | null, settlement: any, chronicle: any }>} [props.members]
 *   the realm members from get_gallery_map. A member with a public_slug deep-links
 *   to its own gallery dossier; one without renders an inline dossier expander.
 */
export default function MemberSettlementsList({ members }) {
  const list = Array.isArray(members) ? members.filter(Boolean) : [];
  if (list.length === 0) return null;
  return (
    <section data-testid="member-settlements-list" style={{ display: 'grid', gap: SP.md }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm }}>
        <h2 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS['22'], fontWeight: 700 }}>
          Settlements in this realm
        </h2>
        <span style={{ color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
          {list.length}
        </span>
      </div>
      <div style={{ display: 'grid', gap: SP.sm }}>
        {list.map((member, i) => (
          member?.public_slug
            ? <LinkedMemberCard key={member.old_id || member.public_slug || i} member={member} />
            : <InlineMemberCard key={member.old_id || i} member={member} />
        ))}
      </div>
    </section>
  );
}
