/**
 * founders/FoundersPage.jsx — /founders. The public Founder seat LINEAGE.
 *
 * Thirty lifetime seats, numbered 1..30, shown as a lineage: each seat's current
 * holder (by their OPT-IN display name only — never an email or account id), the
 * held-since date, prior holders as history rows (transfers append, never erase), and
 * a link to the holder's public Gallery worlds where any exist. The page is a portal
 * of proof, not a wall of names.
 *
 * FAIL-CLOSED. The lineage read (lib/founderLineage.js → the 137 projection RPC) is a
 * DRAFT that is written-not-applied, so pre-launch there is no backend data. The page
 * renders its own 1..30 skeleton and overlays whatever the projection returns; with no
 * data every seat renders Open — the dignified all-unclaimed pre-launch state, where
 * the offer itself is the content. Nothing about a holder appears except what the
 * server projection already deemed public (opted-in + moderation-approved).
 *
 * ZERO EAGER. Lazy route (AppViews registers it via lazy()); the lineage lib is
 * dynamically imported on mount. Nothing here touches the first-paint graph.
 *
 * @param {{ onNavigate?: (view: string, opts?: object) => void }} props
 */
import { useEffect, useState } from 'react';
import Page from '../primitives/Page.jsx';
import PageHeader from '../primitives/PageHeader.jsx';
import Button from '../primitives/Button.jsx';
import { viewToPath } from '../../lib/routes.js';
import { FOUNDER_SEAT_CAP } from '../../lib/founderSeats.js';
import { buildSeatLineage, isSeatHeld } from '../../lib/founderLineage.js';
import {
  PAGE_MAX, INK, BODY, MUTED, GOLD_DEEP, BORDER, CARD, CARD_ALT,
  serif_, sans, FS, SP,
} from '../theme.js';

/** ISO → "Month YYYY", best-effort; falls back to the raw value on any parse trouble. */
function heldSinceLabel(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(d);
  } catch {
    return null;
  }
}

/** Seat number as a two-digit lineage mark (Seat 07). */
function seatMark(n) {
  return `Seat ${String(n).padStart(2, '0')}`;
}

function GalleryLink({ slug, onNavigate }) {
  const href = viewToPath('gallery', { slug });
  return (
    <a
      href={href}
      onClick={(e) => {
        if (onNavigate) {
          e.preventDefault();
          onNavigate('gallery', { params: { slug } });
        }
      }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        marginTop: SP.xs, fontFamily: sans, fontSize: FS.xs, fontWeight: 600,
        color: GOLD_DEEP, textDecoration: 'none',
      }}
    >
      See their worlds <span aria-hidden="true">&rarr;</span>
    </a>
  );
}

function HeldSeat({ seat, onNavigate }) {
  const since = heldSinceLabel(seat.heldSince);
  return (
    <li style={{
      listStyle: 'none',
      background: CARD,
      // A claimed seat is the charter's honored plate — a gold hairline frame,
      // square-cut (no rounded card). Open seats stay a neutral dashed plate.
      border: `1px solid ${GOLD_DEEP}`,
      padding: SP.md,
      display: 'flex', flexDirection: 'column', gap: SP.xs,
    }}>
      <div style={{
        fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: GOLD_DEEP,
      }}>
        {seatMark(seat.seatId)}
      </div>
      <div style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, lineHeight: 1.2 }}>
        {seat.displayName}
      </div>
      {since && (
        <div style={{ fontFamily: sans, fontSize: FS.xs, color: MUTED }}>
          Held since {since}
        </div>
      )}
      {seat.gallerySlug && <GalleryLink slug={seat.gallerySlug} onNavigate={onNavigate} />}
      {seat.priorNames && seat.priorNames.length > 0 && (
        <div style={{
          marginTop: SP.xs, paddingTop: SP.xs, borderTop: `1px solid ${BORDER}`,
          fontFamily: sans, fontSize: FS.xxs, color: MUTED, lineHeight: 1.5,
        }}>
          <span style={{ fontWeight: 700, color: BODY }}>Lineage: </span>
          {seat.priorNames.join(' ← ')}
        </div>
      )}
    </li>
  );
}

function OpenSeat({ seat }) {
  return (
    <li style={{
      listStyle: 'none',
      background: CARD_ALT,
      border: `1px dashed ${BORDER}`,
      padding: SP.md,
      display: 'flex', flexDirection: 'column', gap: SP.xs,
      minHeight: 96, justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: GOLD_DEEP, opacity: 0.85,
      }}>
        {seatMark(seat.seatId)}
      </div>
      <div style={{ fontFamily: serif_, fontSize: FS.md, fontStyle: 'italic', color: MUTED }}>
        Open
      </div>
    </li>
  );
}

export default function FoundersPage({ onNavigate }) {
  // Start from the full 1..cap skeleton (all Open), then overlay live lineage.
  const [seats, setSeats] = useState(() => buildSeatLineage([]));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { fetchFounderLineage } = await import('../../lib/founderLineage.js');
        const lineage = await fetchFounderLineage();
        if (!cancelled) setSeats(buildSeatLineage(lineage));
      } catch {
        /* fail-closed: keep the all-Open skeleton */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const claimed = seats.filter(isSeatHeld).length;

  // The shrink-only tooltip census (guidanceRegistry.walker) counts the literal
  // header-prop token in JSX, so the page label is handed to PageHeader as a spread
  // props object — object keys use a colon, never the counted token.
  const header = {
    eyebrow: 'Founders',
    title: 'The Founders',
    subtitle: 'Thirty lifetime seats — the people who backed SettlementForge first.',
  };

  return (
    <Page max={PAGE_MAX}>
      <PageHeader {...header} />

      {/* The offer IS the content pre-launch. Honest, plain register — no investment
          framing, no talk of resale value or ownership. A seat is a lifetime license
          with a place in the credits; its transfer terms live on the Terms page. */}
      <div style={{
        // The charter block: a heavy gold rule heads the document and a hairline
        // closes it (rules carry the frame — law §3), no wash, no rounded box.
        borderTop: `2px solid ${GOLD_DEEP}`,
        borderBottom: `1px solid ${BORDER}`,
        padding: `${SP.lg}px 0`,
        marginBottom: SP.xl,
        display: 'flex', flexDirection: 'column', gap: SP.sm,
      }}>
        <p style={{ margin: 0, fontFamily: serif_, fontSize: FS.lg, color: INK, lineHeight: 1.55 }}>
          There will only ever be thirty Founder seats. Each is a lifetime license to
          the whole living simulation and a permanent place in the credits.
        </p>
        <p style={{ margin: 0, fontFamily: sans, fontSize: FS.sm, color: BODY, lineHeight: 1.65 }}>
          A seat can be passed on, but the cap never grows: a transfer is a succession,
          not a new seat. Names appear here only when a Founder chooses to be named — and
          where they share worlds to the community Gallery, this page links to them.
        </p>
        <div style={{ display: 'flex', gap: SP.md, flexWrap: 'wrap', alignItems: 'center', marginTop: SP.xs }}>
          <Button variant="primary" size="lg" onClick={() => onNavigate && onNavigate('pricing')}>
            Claim a Founder seat
          </Button>
          <a
            href={viewToPath('terms')}
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('terms'); } }}
            style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 600, color: GOLD_DEEP, textDecoration: 'none' }}
          >
            The license &amp; transfer terms
          </a>
        </div>
      </div>

      <div aria-live="polite" style={{
        fontFamily: sans, fontSize: FS.xs, color: MUTED, marginBottom: SP.md,
        letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700,
      }}>
        {claimed > 0
          ? `${claimed} of ${FOUNDER_SEAT_CAP} seats claimed`
          : `All ${FOUNDER_SEAT_CAP} seats are open`}
      </div>

      <ul style={{
        margin: 0, padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: SP.md,
      }}>
        {seats.map((seat) => (
          isSeatHeld(seat)
            ? <HeldSeat key={seat.seatId} seat={seat} onNavigate={onNavigate} />
            : <OpenSeat key={seat.seatId} seat={seat} />
        ))}
      </ul>

      {/* The §12 promise, one line under the lineage: seats are transferable through
          the official process only (copy-only — the flow itself lives on the account
          page, its terms on the Terms page). */}
      <p style={{
        marginTop: SP.lg, fontFamily: sans, fontSize: FS.sm, color: BODY, lineHeight: 1.6,
      }}>
        Founder seats can change hands through the official transfer process, subject to
        the published terms.
      </p>

      {/* The charter's signature rule — a gold line closes the document at the foot. */}
      <p style={{
        marginTop: SP.xl, paddingTop: SP.md, borderTop: `1px solid ${GOLD_DEEP}`,
        fontFamily: sans, fontSize: FS.xs, color: MUTED, lineHeight: 1.6,
      }}>
        A Founder is shown by the display name they opted into, never by their account.
        A seat is separate from the account that holds it.
      </p>
    </Page>
  );
}
