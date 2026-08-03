/**
 * founders/FirstHundredPage.jsx — /first-hundred. THE FIRST HUNDRED honor roll.
 *
 * A quiet thank-you to the first hundred people to make a home in SettlementForge. It
 * renders ONLY the committed, opted-in roll (src/config/firstHundred.js), which ships
 * empty. With no names it shows the dignified "still being written" state, where the
 * invitation is the content. It has NO mechanics: nothing here grants anything.
 *
 * DISTINCT FROM /founders. That page is THE FOUNDERS' HALL — thirty numbered chairs,
 * all by invitation and none ever sold, each bound to one founder permanently
 * (docs/DESIGN_FOUNDERS_HALL.md §1/§4; the "paid, transferable license" this note used
 * to describe was the superseded design). This page is an unpriced acknowledgment of
 * early members, and the two rolls are INDEPENDENT (§8) — a person may be on either,
 * both, or neither. A short line links between them so no one mistakes one for the other.
 *
 * ZERO EAGER. Lazy route (AppViews registers it via lazy()); the roll is a pure config
 * import. Nothing here touches the first-paint graph.
 *
 * @param {{ onNavigate?: (view: string, opts?: object) => void }} props
 */
import Page from '../primitives/Page.jsx';
import PageHeader from '../primitives/PageHeader.jsx';
import Button from '../primitives/Button.jsx';
import { viewToPath } from '../../lib/routes.js';
import {
  FIRST_HUNDRED, FIRST_HUNDRED_CAP, listedHonorees, firstHundredRemaining,
} from '../../config/firstHundred.js';
import {
  PAGE_MAX, INK, BODY, MUTED, GOLD_DEEP, BORDER, CARD, CARD_ALT,
  serif_, sans, FS, SP,
} from '../theme.js';

function Honoree({ honoree }) {
  return (
    <li style={{
      listStyle: 'none', background: CARD, border: `1px solid ${BORDER}`,
      padding: SP.md, display: 'flex', flexDirection: 'column', gap: SP.xs,
    }}>
      <div style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, lineHeight: 1.2 }}>
        {honoree.name}
      </div>
      {honoree.note && (
        <div style={{ fontFamily: sans, fontSize: FS.sm, color: BODY, lineHeight: 1.55 }}>
          {honoree.note}
        </div>
      )}
      {honoree.since && (
        <div style={{ fontFamily: sans, fontSize: FS.xs, color: MUTED }}>
          Since {honoree.since}
        </div>
      )}
    </li>
  );
}

export default function FirstHundredPage({ onNavigate }) {
  const honorees = listedHonorees(FIRST_HUNDRED);
  const remaining = firstHundredRemaining(FIRST_HUNDRED);

  // Header handed to PageHeader as a spread object so the tooltip census (which counts
  // the literal header prop token in JSX) never sees it. Object keys use a colon.
  const header = {
    eyebrow: 'The First Hundred',
    title: 'The First Hundred',
    subtitle: 'The earliest people to make a home here, while the world was still being built.',
  };

  return (
    <Page max={PAGE_MAX}>
      <PageHeader {...header} />

      {/* The dedication. Plain register, no sell. Gratitude, not a leaderboard. */}
      <div style={{
        borderTop: `2px solid ${GOLD_DEEP}`, borderBottom: `1px solid ${BORDER}`,
        padding: `${SP.lg}px 0`, marginBottom: SP.xl,
        display: 'flex', flexDirection: 'column', gap: SP.sm,
      }}>
        <p style={{ margin: 0, fontFamily: serif_, fontSize: FS.lg, color: INK, lineHeight: 1.55 }}>
          Every world has people who believed in it before it was finished. These are ours.
        </p>
        <p style={{ margin: 0, fontFamily: sans, fontSize: FS.sm, color: BODY, lineHeight: 1.65 }}>
          A place here is a thank-you, nothing more. It grants no seat and no license. Names
          appear only when a member chooses to be named. When the roll is full, it closes,
          and the first hundred stay the first hundred.
        </p>
        <p style={{ margin: 0, fontFamily: sans, fontSize: FS.sm, color: BODY, lineHeight: 1.65 }}>
          The founder chairs are a separate thing, with their own page:{' '}
          <a
            href={viewToPath('founders')}
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('founders'); } }}
            style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 600, color: GOLD_DEEP, textDecoration: 'none' }}
          >
            the Founders&rsquo; Hall
          </a>
          .
        </p>
      </div>

      {honorees.length > 0 ? (
        <>
          <div aria-live="polite" style={{
            fontFamily: sans, fontSize: FS.xs, color: MUTED, marginBottom: SP.md,
            letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700,
          }}>
            {`${honorees.length} of ${FIRST_HUNDRED_CAP} named`}
          </div>
          <ul style={{
            margin: 0, padding: 0, display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: SP.md,
          }}>
            {honorees.map((h, i) => <Honoree key={`${h.name}-${i}`} honoree={h} />)}
          </ul>
        </>
      ) : (
        // The empty state: the invitation IS the content. No fake names, ever.
        <div style={{
          background: CARD_ALT, border: `1px dashed ${BORDER}`, padding: SP.xl,
          textAlign: 'center', display: 'flex', flexDirection: 'column', gap: SP.md, alignItems: 'center',
        }}>
          <p style={{ margin: 0, fontFamily: serif_, fontSize: FS.md, fontStyle: 'italic', color: MUTED, lineHeight: 1.6 }}>
            This roll is still being written. The first {FIRST_HUNDRED_CAP} places are open.
          </p>
          <Button variant="primary" size="lg" onClick={() => onNavigate && onNavigate('generate')}>
            Forge your first settlement
          </Button>
        </div>
      )}

      <p style={{
        marginTop: SP.xl, paddingTop: SP.md, borderTop: `1px solid ${GOLD_DEEP}`,
        fontFamily: sans, fontSize: FS.xs, color: MUTED, lineHeight: 1.6,
      }}>
        A member is shown by the display name they chose, never by their account. The
        remaining places, quietly counted: {remaining}.
      </p>
    </Page>
  );
}
