/**
 * home/LandingBelowFold.jsx — everything below the hero fold of the scrollable
 * Welcome page: the salt-road journey 01·Forge → 02·Visual → 03·Voice →
 * 04·Realm → 05·Commons → 06·Set out. Lazy-loaded as ONE chunk by
 * HomeLanding.jsx so the hero paints first (LCP). The page's footer is the
 * app's one global footer, pinned by App.jsx (owner order 2026-09-16).
 *
 * The §02/§03/§04 artifacts render FROZEN REAL ENGINE OUTPUT (owner amendment
 * W-L2/1) and live in ./LandingArtifacts.jsx with their fixture; §05 renders up
 * to six REAL published gallery settlements (W-L2/3, fetched on mount, ranked
 * by top_voted — the strongest signal gallery.js tracks), falling back to the
 * Create page's three curated Founding Worlds — which arrive on their OWN chunk
 * (React.lazy behind a height-reserving Suspense boundary), so single-sourcing the
 * strip costs this chunk nothing. Spec constraints held: tokens only
 * (§3.1); gold the only brand accent, violet ONLY in §03 + the faith chip in
 * the §04 chronicle (§3.2); Lucide icons, no emoji (§3.5); every control routes
 * and decorative chips are plain spans (§3.8); <section aria-labelledby> + h2.
 */

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Button from '../primitives/Button.jsx';
import AvailableAtLaunchPill from '../primitives/AvailableAtLaunchPill.jsx';
import { purchasesOpen } from '../../lib/launchGate.js';
import WelcomeJourneyBackdrop from './WelcomeJourneyBackdrop.jsx';
import { fontFamily, radius } from '../../design/tokens.js';
import {
  INK, SECOND, BODY, MUTED, GOLD, GOLD_TXT, GOLD_BG,
  PARCH, PARCH_100, BORDER,
  FS, SP, R, ELEV, sans, serif_,
} from '../theme.js';
import { tl } from '../../copy/landing.js';
// Config-sourced tier facts (brief §4 / ruling #6): the closer tier strip
// interpolates these instead of hand-typing the numbers, so a catalog change
// (anon size ceiling, free save cap) can never drift from what the strip shows.
// tierFacts imports only config/pricing.js and rides this lazy below-fold chunk,
// so it adds nothing to the first-paint closure.
import { ANON_MAX_SIZE_LABEL, FREE_SAVE_LIMIT, FOUNDER_SEATS } from '../../config/tierFacts.js';
import { isInvitationOnly } from '../../config/pricing.js';
import { fetchPublicGallery } from '../../lib/gallery.js';
// The one client-side truth about what the gallery can return. gallery.js already
// pulls this module, so reading it here costs the chunk nothing.
import { isConfigured as galleryBackendConfigured } from '../../lib/supabase.js';
// The commons fallback IS the Create page's Founding Worlds strip — the same
// component, so the heading, the lead-in, the three curated samples and the
// 'Fork this sample' wiring are single-sourced rather than restated here.
//
// ⛔ LAZY, NOT STATIC, AND THE MODULE'S OWN HEADER IS THE REASON. FoundingWorlds
// documents itself as a create-surface component on the LAZY CREATE CHUNK, and it
// records a byte hazard it already paid for once (MG-3f leak L8: importing the
// saves-panel helpers dragged a helper set toward the first-paint closure, cured by
// moving the one rule it needed into a dependency-free leaf). A static edge from
// here would have charged the LANDING chunk for that whole closure — useStore, the
// anon counter, SAMPLE_SETTLEMENTS and the config-migration leaf — on every visit,
// to render a strip most visitors never reach and, once the gallery has three
// published towns, nobody reaches. The dynamic import keeps the two surfaces
// single-sourced without making the landing pay for the create page's closure.
const FoundingWorlds = lazy(() => import('../generate/FoundingWorlds.jsx'));
import {
  MiniDossierCard, VoiceCards, VoiceNarrateButton, AdvanceTimeCard, RealmMapCard, SCENE, cardStyle,
} from './LandingArtifacts.jsx';
import { settlementCardImage, tierStockImage } from '../../domain/display/tierStockImage.js';

const MONO = fontFamily.mono;
const CONTENT_MAX = 1080; // spec §4 content column

// Cream parchment on a photographic hero (>0.88 alpha) — the panel that holds
// text on the painted (01/04) sections so prose never sits on the painting (§5).
const PANEL_BG = 'rgba(255,251,245,0.9)';

// ── Shared style fragments ───────────────────────────────────────────────────
const h2Style = (isMobile) => ({ margin: `0 0 ${SP.md}px`, fontFamily: serif_, fontSize: isMobile ? FS['26'] : FS['34'], fontWeight: 600, lineHeight: 1.15, color: INK });
const proseStyle = { margin: `0 0 ${SP.md}px`, fontFamily: serif_, fontSize: FS.xl, lineHeight: 1.65, color: BODY };
const panelStyle = { background: PANEL_BG, border: `1px solid ${BORDER}`, borderRadius: R.lg, boxShadow: ELEV[1], padding: '28px 30px' };
const capsLink = {
  fontFamily: sans, fontSize: FS.sm, fontWeight: 800, letterSpacing: '0.04em',
  textTransform: 'uppercase', color: GOLD_TXT,
};

/**
 * ⛔ ONE ASK AT THE TOP, ONE AT THE END (owner, 2026-09-19, taking the copy
 * draft's recommendation). The page used to close every section with its own
 * primary button — five asks in five stops, which is what made it read as five
 * pitches instead of one account. The three MIDDLE asks are gone; what stands in
 * their place carries the reader to the NEXT STOP of the same account.
 *
 * ⚠ NOTHING BECAME UNREACHABLE, and that was the condition for doing it:
 *   • forging  — the hero CTA, the closer CTA, and the brief card's own
 *                "Forge this exact town" all still forge;
 *   • pricing  — `voice.pricingLink` and `closer.fullPricing` both still route;
 *   • gallery  — every real published row in the commons strip carries its own
 *                'Open' button (commons.open).
 * If any of those three doors is ever removed, the ask it replaced has to come
 * back with it.
 *
 * It scrolls rather than navigates because that is what "read on" means, and it
 * is a real control (a button, not a decorative span — §3.8).
 */
function ReadOn({ to, children }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => document.getElementById(to)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      style={{ ...capsLink }}
    >
      {children}
    </Button>
  );
}

// The track minimum is capped at the column's own width: on a 390px phone the stop's
// content box is 366px, and a bare 380px minimum pushed the page 2px sideways.
const twoColGrid = (gap = 28) => ({ maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0`, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))', gap, alignItems: 'center' });

// ── The salt-road waypoint spine (spec §4) ───────────────────────────────────
function Waypoint({ pill, goldPill, dark = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} aria-hidden="true">
      <div style={{
        width: 1, height: 56,
        background: dark
          ? 'linear-gradient(rgba(244,234,208,0), rgba(244,234,208,0.55))'
          : 'linear-gradient(rgba(74,59,34,0), rgba(74,59,34,0.5))',
      }} />
      <div style={{
        width: 11, height: 11, borderRadius: radius.button, background: GOLD,
        border: dark ? '2px solid rgba(251,245,230,0.9)' : '2px solid rgba(255,251,245,1)',
        boxShadow: ELEV[1], margin: `${SP.sm}px 0`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{
          fontFamily: MONO, fontSize: FS.xs, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: dark ? 'rgba(244,234,208,0.85)' : SECOND,
          background: dark ? 'transparent' : 'rgba(255,251,245,0.9)',
          border: dark ? '1px solid rgba(244,234,208,0.35)' : `1px solid ${BORDER}`,
          borderRadius: radius.button, padding: '4px 14px', whiteSpace: 'nowrap', lineHeight: 1.4,
        }}>
          {pill}
        </span>
        {goldPill && (
          <span style={{
            fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: GOLD_TXT, background: GOLD_BG,
            border: `1px solid ${GOLD}`, borderRadius: radius.button, padding: '4px 12px',
            whiteSpace: 'nowrap', lineHeight: 1.4,
          }}>
            {goldPill}
          </span>
        )}
      </div>
    </div>
  );
}

// Section wrappers ------------------------------------------------------------
/** The empty band below a stop's content, before the next travel leg. */
const sectionTail = (isMobile) => (isMobile ? SP.xxl * 2 : 84);
const sectionPad = (isMobile) => ({ padding: isMobile ? `0 ${SP.md}px ${sectionTail(true)}px` : `0 ${SP.xxl}px ${sectionTail(false)}px` });
// THE FADED TAIL (owner orders 2026-09-17, "Fix the small visual defects"). The header
// is transparent over the page, so every translucent-cream stop scrolls under it, and
// while a stop's empty bottom band passes beneath the arrow it read as a plain cream
// strip between the shaft and the painted film. The strip was that band, not a space
// kept for the feather (measured: at 1440x900 and scroll 2400 the layer under the
// shaft is #forge's bottom padding, and the film begins where #forge ends). So the
// band fades out: the cream dissolves into the film over the tail's own height, which
// holds no content, and the painting meets the shaft at every scroll position. Masks
// read only alpha, so the gradient's colour is a token (the ArrowPaint idiom).
const creamTailFade = (isMobile) => {
  const fade = `linear-gradient(${INK} calc(100% - ${sectionTail(isMobile)}px), transparent)`;
  return { WebkitMaskImage: fade, maskImage: fade };
};

// ── 01 · Forge — the Instant Draft artifact (InstantDraftCard) was removed per
// owner order (2026-07-22): the Cnocby sample-draft card (MiniDossierCard) now
// fills that slot in §01. The widget was landing-only (never used by the Create
// page's own size picker), so its code is deleted as dead landing chrome. Its
// forge.draft* / forge.sizes / forge.mode* copy keys are unreferenced on the
// landing (left in place as inert strings, not retyped).
//
// ⚠ forge.ceiling IS THE EXCEPTION, AND WAS THE DEFECT (§320.3): the widget's
// removal took the anon SIZE-CEILING DISCLOSURE off the page with it, while the
// key and its claims-parity pin stayed green — a claim bound to enforcement that
// no visitor could read. §363.1 rules it back on: the sentence is RE-LIT in the
// §01 panel below, at the landing's anonymous entry point. The words are the
// owner-era spec string, re-referenced and NOT retyped, so the tierFacts binding
// (tests/copy/landingClaimsParity.test.js) holds unchanged — and that same file
// now carries a RENDERED arm, so un-referencing this key again reds the gate
// instead of passing quietly.

// ── 05 · Commons — REAL published towns, or the curated Founding Worlds (W1) ─
// Fetched once on below-fold mount (anon-permitted public read), ranked by
// top_voted — the strongest ranking signal src/lib/gallery.js actually tracks
// (it has net_votes + view counts; there is NO fork counter).
//
// ⛔ THE PLACEHOLDER BACKFILL IS GONE (2026-09-18). Every slot without a real
// town used to render a DECORATIVE card — an invented name, an invented author,
// an invented population, labelled ' (placeholder)' beside the name — so an
// empty gallery showed six fabricated towns to every visitor of a page that
// sells "Simulated, not AI-generated". There was no flag: the state was purely
// data-driven, and the gallery is empty before launch. The rule now:
//   • THREE OR MORE real published rows → render the real rows, up to six;
//   • fewer than three → render the Create page's three curated Founding Worlds
//     (Mossgate / Black Crag / Cnocby), with its heading, its copy and its
//     real 'Fork this sample' action. They are real generations from real seeds,
//     so the fallback offers the visitor something true to do instead of
//     something false to look at.
// The threshold is three because a one- or two-card grid reads as a broken strip;
// below it the Founding Worlds trio fills the row honestly.
const COMMONS_SLOTS = 6;      // owner order 2026-07-21, ledger 4f71743a
const COMMONS_MIN_REAL = 3;   // below this the curated trio shows instead
// One real-row card: the 150px scene box, the 52px footer row, two hairline rules.
// This is the REAL-ROW grid's geometry and is used ONLY for the pre-fetch reserve,
// because the real rows are what the section is designed around and what it shows
// once the gallery fills.
const COMMONS_ROW_H = 150 + 52 + 2;

// ⛔ THE FALLBACK'S RESERVE IS THE FALLBACK'S OWN SHAPE, NOT THE ROW GRID'S, AND IT
// IS NOT A PINNED NUMBER. FoundingWorlds is a <section> at maxWidth 960 with
// SP.lg/SP.md padding, an h2, a lead-in paragraph and a 3-up grid whose track is
// `minmax(min(100%, 280px), 1fr)` — so under about 768px it collapses to ONE column
// and the strip's height roughly triples. Reserving the row grid's 204px was wrong at
// both widths (a jump on desktop, a far bigger one on a phone), and TWO pinned
// per-breakpoint numbers would rot the first time the lead-in wraps differently.
// So the reserve MIRRORS THE STRIP: the same wrapper metrics and, critically, the
// same grid track, three plate-shaped boxes inside it. The breakpoint behaviour then
// falls out of the same CSS the real strip uses, at every width, and the only
// estimate left is one plate's height.
//
// MEASURED IN CHROMIUM on the strip's own page (/create), both widths pinned by the
// review: at 1440 the section is 296 tall, head block 19, lead-in 18 (one line),
// grid 211 in THREE columns with every plate at 211; at 375 the section is 796,
// head 19, lead-in 54 (three lines), grid 675 in ONE column with plates 223/206/223.
// The column count is the dominant term and the mirrored track reproduces it exactly
// at every width. The plate figure below is the measured pair's midpoint, which
// costs about 5px at 1440 and about 3px at 375.
// ⚠ ONE RESIDUAL, STATED RATHER THAN HIDDEN: the lead-in is the one element that
// REFLOWS with width (one line at 1440, three at 375) and the reserve cannot follow
// it without carrying a second copy of that sentence into this chunk — the very
// duplication the lazy seam exists to avoid. So the reserve is exact at desktop and
// about 39px short on a 375 phone, against a 796px section. The defect this replaces
// reserved 204px at both: about 92px out at 1440 and about 592px out at 375.
// ⚠ RAISED BY CONSTRUCTION ON 2026-09-19, NOT RE-MEASURED (ODQ §934.32). The
// curated card gained a FIXED 120px tier plate above its heading, inside a flex
// column whose gap is SP.sm (8) — so the plate is exactly 128px taller than the
// measured 216, and the arithmetic is exact rather than estimated precisely
// because the image height is pinned in FoundingWorlds.jsx
// (SAMPLE_PLATE_IMAGE_H) instead of riding an aspect ratio. The residual named
// below (the lead-in reflowing on a phone) is unchanged by this.
const SAMPLE_PLATE_H = 216 + 120 + 8;  // measured 211 at 1440, 206-223 at 375; + the tier plate + its gap
const SAMPLE_LEAD_H = 18;    // the lead-in at FS.sm / 1.5, one line at desktop
const SAMPLE_HEAD_H = 19;    // the h2 block at FS.lg

// ⛔ WHICH SHAPE TO HOLD BEFORE THE ANSWER ARRIVES. The section's height genuinely
// depends on what the fetch returns, so SOME reserve is a guess — but the guess has
// one checkable input, and holding the wrong box merely MOVES the jump from the
// Suspense swap to the settle moment, which is what the first cut did. With no
// configured backend (local development, and any build without gallery credentials)
// fetchPublicGallery cannot return a row at all: it returns `{ items: [] }` without a
// request, so the curated strip is CERTAIN and its footprint is the right box to
// hold. With a backend configured, real rows are the designed state and the row grid
// is the right box.
// ⚠ THE RESIDUAL, NAMED: a configured backend whose gallery is still EMPTY (the
// launch morning) takes the row reserve and shifts once when the fetch settles thin.
// Nothing on the client can know that before asking, and the alternative — holding
// the curated box for everyone — just moves the same shift onto the real-rows path,
// which is the state the section is designed around and the one it ends in.
const EXPECT_THIN_GALLERY = !galleryBackendConfigured;

/** The curated strip's own footprint, held while its chunk is in flight. */
function FoundingWorldsReserve({ testId }) {
  return (
    <div data-testid={testId} data-reserve="curated" aria-hidden="true" style={{
      maxWidth: 960, margin: '0 auto', width: '100%', padding: `${SP.lg}px ${SP.md}px`,
    }}>
      <div style={{ height: SAMPLE_HEAD_H, marginBottom: SP.xs }} />
      <div style={{ height: SAMPLE_LEAD_H, marginBottom: SP.md }} />
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: SP.md,
      }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ minHeight: SAMPLE_PLATE_H }} />)}
      </div>
    </div>
  );
}

// A real row without its own gallery image keeps the strip's painted-scene box
// (same height, zero layout shift). The scene is DERIVED from the row's own
// tier, never invented: it is the card's backdrop, not a claim about the town.
//
// ⛔ THE SIX-TO-THREE MAP THAT LIVED HERE IS NOW THE ESTATE'S ONE COPY (owner
// order ODQ §934.32). It was written for this card alone, and the gallery grid,
// the sample cards and the share meta were each about to grow their own — four
// maps that would drift, so a village would be painted one way on the landing
// and another on its own gallery page. It moved verbatim (including the
// `capital` alias the ladder does not carry) into
// src/domain/display/tierStockImage.js, which the other three now read too.

function GalleryCards({ onNavigate }) {
  const [tiles, setTiles] = useState(null); // null = the fetch has not settled yet
  useEffect(() => {
    let live = true;
    // PREFETCH, ON THE PATH THAT WILL RENDER IT ONLY. Deciding after the fetch fixed
    // the "requested on every visit" defect and created a serial one: the chunk was
    // then requested strictly AFTER the gallery round-trip, so on the very path that
    // shows the strip it arrived a round-trip late. Warming it at mount overlaps the
    // two, and by the time the fetch settles `lazy` resolves without suspending, so
    // the reserve never flashes. It is NOT warmed when real rows are expected, which
    // is what keeps the chunk off the common path in the first place.
    if (EXPECT_THIN_GALLERY) import('../generate/FoundingWorlds.jsx').catch(() => {});
    fetchPublicGallery({ pageSize: COMMONS_SLOTS, sort: 'top_voted' })
      .then((r) => { if (live) setTiles((r?.items || []).slice(0, COMMONS_SLOTS)); })
      .catch(() => { if (live) setTiles([]); });
    return () => { live = false; };
  }, []);

  // ⛔ NOTHING IS DECIDED UNTIL THE FETCH SETTLES, AND THAT IS THE WHOLE POINT OF
  // THE LAZY SEAM. `tiles` starts null, so treating null as "no rows yet" made
  // `real.length < COMMONS_MIN_REAL` true on the FIRST render: the lazy element
  // mounted immediately, React requested the chunk, and every landing visit paid a
  // second serial round-trip for a strip that was about to be replaced by real rows.
  // The lazy import then bought nothing at all. While the fetch is in flight the
  // section mounts NOTHING and holds the footprint of whatever that path will end in
  // (EXPECT_THIN_GALLERY, above), so the settle is one layout change and not two.
  if (tiles === null) {
    return EXPECT_THIN_GALLERY
      ? <FoundingWorldsReserve testId="commons-awaiting-gallery" />
      : <div data-testid="commons-awaiting-gallery" data-reserve="rows" aria-hidden="true" style={{ maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0`, minHeight: COMMONS_ROW_H }} />;
  }

  const real = tiles.slice(0, COMMONS_SLOTS);
  // Unreachable, empty, or a gallery too thin to fill a row: the curated trio. It
  // carries its own heading and lead-in (the Create page's), and it arrives on its
  // own chunk behind a boundary that reserves the strip's own footprint.
  if (real.length < COMMONS_MIN_REAL) {
    return (
      <Suspense fallback={<FoundingWorldsReserve />}>
        <FoundingWorlds onNavigate={onNavigate} />
      </Suspense>
    );
  }

  return (
    <div style={{
      maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0`, display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18,
    }}>
      {real.map((tile) => (
        <div key={tile.slug} style={{ ...cardStyle, boxShadow: ELEV[1], overflow: 'hidden' }}>
          <div style={{
            position: 'relative', height: 150,
            backgroundImage: `url('${settlementCardImage(tile.imageUrl, tile.tier) || tierStockImage('village')}')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}>
            <span style={{
              position: 'absolute', top: 10, right: 10, fontFamily: sans, fontSize: FS.xs, fontWeight: 800,
              letterSpacing: '0.05em', textTransform: 'uppercase', color: PARCH_100,
              background: 'rgba(27,20,8,0.6)', borderRadius: R.sm, padding: '2px 8px',
            }}>{tile.tier}</span>
            <span style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, padding: '26px 14px 10px',
              backgroundImage: 'linear-gradient(rgba(20,14,5,0), rgba(20,14,5,0.72))',
              fontFamily: serif_, fontSize: FS['18'], fontWeight: 600, color: PARCH,
            }}>{tile.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, padding: '7px 14px', minHeight: 52 }}>
            <span style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: MUTED }}>
              {tl('commons.votes', { n: tile.netVotes ?? 0 })}
            </span>
            <span style={{ marginLeft: 'auto', fontFamily: sans, fontSize: FS.sm, fontWeight: 800, color: SECOND }}>
              {tile.population ?? ''}
            </span>
            {/* Real tile → a real route (§3.8): the gallery detail view. */}
            <Button variant="secondary" size="sm" onClick={() => onNavigate('gallery', { params: { slug: tile.slug } })}>
              {tl('commons.open')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 06 · Set out — tier strip ────────────────────────────────────────────────
// Live founder-chair counter. Lazy-imports the seat module so supabase never
// rides the eager chunk; the RPC read is anon-safe and 5-minute cached. Falls
// back to the static cap line when the count is unavailable (null), so a backend
// hiccup never breaks the card.
//
// ⛔ IT COUNTS CHAIRS HELD, NOT SEATS LEFT (DESIGN_FOUNDERS_HALL §1, ODQ §118).
// "N/30 seats left" is scarcity vocabulary for a thing on sale, and no chair has
// ever been sold. The Hall's own covenant voice reads "N of 30 chairs held", and
// the landing page now says the same words as the Hall it points at.
function FounderSeatLine() {
  const [seats, setSeats] = useState(null); // { remaining, cap } once loaded
  useEffect(() => {
    let alive = true;
    import('../../lib/founderSeats.js')
      .then(async (m) => {
        const remaining = await m.fetchFounderSeatsRemaining();
        if (alive) setSeats({ remaining, cap: m.FOUNDER_SEAT_CAP });
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  const cap = seats?.cap ?? 30;
  const remaining = seats?.remaining;
  return (
    <div style={{
      marginTop: SP.sm, fontFamily: sans, fontSize: FS.xs, fontWeight: 800,
      letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(224,192,128,1)',
    }}>
      {typeof remaining === 'number'
        ? `${cap - remaining} of ${cap} chairs held`
        : `${cap} chairs, by invitation`}
    </div>
  );
}

// Interpolate the config-sourced tier facts into a closer-strip body. The copy
// carries {anonSize}/{freeSaves} tokens (copy/landing.js); the numbers come from
// config/tierFacts.js so the strip can never restate a ceiling the catalog didn't
// (brief §4 / ruling #6 — config-sourced facts, zero hand-typed numbers).
const TIER_FACT_VARS = { anonSize: ANON_MAX_SIZE_LABEL, freeSaves: FREE_SAVE_LIMIT, seats: FOUNDER_SEATS };
function fillTierBody(body) {
  return String(body).replace(/\{(\w+)\}/g, (m, name) =>
    Object.prototype.hasOwnProperty.call(TIER_FACT_VARS, name) ? String(TIER_FACT_VARS[name]) : m);
}

function TierStrip() {
  // ⛔ PUBLIC TIERS ONLY (owner, ODQ §934.24 addendum). The filter asks the TIER'S OWN
  // property, never the spelling 'Founder', so the rule is about what a tier IS and a
  // second invitation-only tier is covered the day it is added. It asks through
  // config/pricing.js's `isInvitationOnly` (car 06d04c7c4), which composed in with the
  // consist — so the strip and the pricing page now read ONE predicate rather than two
  // spellings of the same question, which is what the inline copy was a placeholder for.
  const tiers = (tl('closer.tiers') || []).filter((tier) => !isInvitationOnly(tier));
  return (
    <div style={{
      // Owner order (2026-07-22): a TWO-BY-TWO grid (Wanderer + Cartographer on
      // row 1, Surveyor + Founder on row 2, reading order preserved) — not the
      // 3+1 that orphaned Founder on its own row. maxWidth 680 + a 300px column
      // min holds exactly two columns on desktop (2*300+gap fits the cap, three
      // never do) while auto-fit still collapses to a single column on mobile —
      // the existing responsive behaviour, preserved.
      maxWidth: 680, margin: `${SP.xxl * 2}px auto 0`, display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: SP.md,
    }}>
      {tiers.map((tier) => (
        <div key={tier.name} style={{
          background: tier.aiWall ? 'rgba(123,79,207,0.10)' : 'rgba(251,245,230,0.08)',
          // Surveyor is walled in the violet AI channel (ruling #3); Cartographer
          // keeps the gold accent; the rest read as quiet parchment.
          border: tier.aiWall ? '1px solid rgba(123,79,207,0.5)'
            : tier.accent ? '1px solid rgba(224,192,128,0.55)'
            : '1px solid rgba(244,234,208,0.25)',
          borderRadius: R.lg, padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: serif_, fontSize: FS.xxl, fontWeight: 600, color: PARCH }}>{tier.name}</span>
            {/* Per-segment badge colour: the AI-channel band renders violet; a
                'Premium' segment always renders gold; everything else follows
                the tier's accent. Founder reads "By invitation" and is therefore
                deliberately NOT gold: it is not a purchasable premium segment. */}
            <span style={{
              fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {String(tier.badge).split(' · ').map((seg, i) => (
                <span key={seg}>
                  {i > 0 && <span style={{ color: 'rgba(244,234,208,0.7)' }}>{' · '}</span>}
                  <span style={{ color: tier.aiWall ? 'rgba(180,150,235,1)'
                    : (tier.accent || /^premium$/i.test(seg)) ? 'rgba(224,192,128,1)'
                    : 'rgba(244,234,208,0.7)' }}>{seg}</span>
                </span>
              ))}
            </span>
          </div>
          <div style={{ fontFamily: sans, fontSize: FS.md, fontWeight: 600, lineHeight: 1.55, color: 'rgba(251,245,230,0.85)' }}>
            {fillTierBody(tier.body)}
          </div>
          {tier.seatLive && <FounderSeatLine />}
        </div>
      ))}
    </div>
  );
}

// ── The below-fold page ──────────────────────────────────────────────────────
// The below-fold CTAs all route to real product surfaces (Forge → generate,
// See Cartographer / pricing links → pricing, Browse the gallery → gallery), so
// no onSignIn is needed here — the auth CTA lives only in the hero.
export default function LandingBelowFold({ isMobile, onNavigate }) {
  const pad = sectionPad(isMobile);
  const tail = creamTailFade(isMobile);
  // Pre-launch lockout (lib/launchGate.js): See Cartographer is the landing's one
  // purchase CTA, so it renders disabled with the pill until purchases open. The
  // pricing links are information and stay live.
  const purchasesAreOpen = purchasesOpen();
  // The scroll-journey root: the film backdrop measures the `.leg` travel spacers
  // inside this container to drive its playhead (home/useScrollJourney).
  const rootRef = useRef(null);

  return (
    <>
      {/* THE FILM (Slice C2): the fixed travel-and-stop growth film, behind the
          stops (zIndex 0). The stops + legs below sit at zIndex 1 over it. */}
      <WelcomeJourneyBackdrop rootRef={rootRef} />
      <div ref={rootRef} style={{ position: 'relative', zIndex: 1 }}>
        {/* leg 1 · desk → thorp */}
        <div className="sf-welcome-leg" data-welcome-leg="0" aria-hidden="true" />
        {/* ══ 01 · Forge + the sample draft. Translucent cream
            (sf-landing-scene-cream) with no painted scene, so the growth film
            reads through (stop 1 · thorp). ══ */}
      <section
        id="forge"
        aria-labelledby="sf-forge-title"
        className="sf-landing-scene-cream"
        style={{ ...pad, ...tail }}
      >
        <Waypoint pill={tl('forge.waypoint')} />
        <div style={twoColGrid(28)}>
          <div style={panelStyle}>
            <h2 id="sf-forge-title" style={h2Style(isMobile)}>{tl('forge.h2')}</h2>
            <p style={proseStyle}>{tl('forge.body')}</p>
            <p style={{ ...proseStyle, fontStyle: 'italic', fontSize: FS['16'], color: SECOND, marginBottom: SP.xl }}>
              {tl('forge.axiom')}
            </p>
            {/* THE ANON SIZE CEILING (§363.1). It sits with "No account needed",
                which is the promise it qualifies: that line is true, and this is
                the one sentence that says what the free door actually opens onto.
                ⚠ THE TWO USED TO BRACKET A PRIMARY CTA and the ceiling's whole
                placement rationale was "directly under the CTA row, because that
                row is where the promise is made". The row is gone (ONE ask at the
                top, one at the end), so the promise and its disclosure now stand
                as one block — which is what they always were. Always visible: no
                cap, no state, no hover, same understated idiom as §03's aiNote. */}
            <p style={{ margin: 0, fontFamily: sans, fontSize: FS.sm, fontWeight: 800, color: SECOND }}>
              {tl('forge.micro')}
            </p>
            <p style={{ margin: `${SP.sm}px 0 0`, fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: SECOND }}>
              {tl('forge.ceiling')}
            </p>
            <div style={{ marginTop: SP.lg }}>
              <ReadOn to="voice">{tl('forge.readOn')}</ReadOn>
            </div>
          </div>
          {/* Owner order (2026-07-22): the Instant Draft widget slot now hosts the
              Cnocby sample-draft card (MiniDossierCard), relocated from §02. The
              drawn-town map sub-block that used to sit below moved into §02, which
              is now "The visual". */}
          <MiniDossierCard onNavigate={onNavigate} />
        </div>
      </section>

        {/* leg 2 · thorp → hamlet */}
        <div className="sf-welcome-leg" data-welcome-leg="1" aria-hidden="true" />
        {/* STRIP-1 (owner ruling, ODQ §725): the "02 · The visual" section was the
            drawn settlement map and NOTHING else — waypoint, headline, body, the
            frozen lens plates and their flip. It is REMOVED whole; leaving the copy
            shell would promise a drawing the product no longer has.
            THE FILM IS UNTOUCHED: six travel legs (data-welcome-leg 0..5) still map
            1:1 onto the six shipped leg videos + seven stop stills under
            public/media/journey-legs/, machinery shared with the loading journey, so
            no leg is dropped. The surviving five stops renumber 01..05 in the copy
            registry (waypoint pills stay contiguous — tests/ui/homeLanding.test.jsx).
            Legs 1 and 2 now run back-to-back: one longer cinematic stretch between
            "01 · Forge" and "02 · The voice". Replacement §02 content is a MARKETING
            decision, deliberately not invented here (charter §11.2 Q9). ══ */}

        {/* leg 3 · hamlet → village */}
        <div className="sf-welcome-leg" data-welcome-leg="2" aria-hidden="true" />
        {/* ══ 03 · The voice — plain parchment (#F7F0E4), hairline borders (stop 3 · village) ══ */}
      <section
        id="voice"
        aria-labelledby="sf-voice-title"
        className="sf-landing-scene-cream"
        // The bottom hairline fades out with the tail (THE FADED TAIL, above).
        style={{ ...pad, ...tail, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}
      >
        <Waypoint pill={tl('voice.waypoint')} />
        <div style={{ maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0` }}>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <h2 id="sf-voice-title" style={{ ...h2Style(isMobile), marginBottom: SP.md }}>{tl('voice.h2')}</h2>
            <p style={{ ...proseStyle, margin: 0 }}>{tl('voice.body')}</p>
            {/* AI disclosure: upfront, deliberately understated (owner). */}
            <p style={{ margin: `${SP.sm}px 0 0`, fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: SECOND }}>
              {tl('voice.aiNote')}
            </p>
          </div>
          <VoiceCards />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP.md, marginTop: SP.xl, flexWrap: 'wrap' }}>
            {/* ⛔ THE ASK IS A CONTROL WITH A REASON NOW (REVIEW-P F4). It used to be a
                bare `onNavigate('generate')` that moved the reader off the landing with
                nothing forged and nothing said; VoiceNarrateButton keeps the navigation
                for a reader who HAS a town and raises the registered reason where the
                click happened for a reader who does not. It lives in LandingArtifacts
                beside its sibling ForgeExactButton, which already carries this chunk's
                store and notice imports, so this section gains no module of its own. */}
            <VoiceNarrateButton onNavigate={onNavigate} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('pricing')}
              style={{ ...capsLink }}
            >
              {tl('voice.pricingLink')}
            </Button>
          </div>
        </div>
      </section>

        {/* leg 4 · village → town */}
        <div className="sf-welcome-leg" data-welcome-leg="3" aria-hidden="true" />
        {/* ══ 04 · The Realm — painted city scene + CARTOGRAPHER pill (stop 4 · town) ══ */}
      <section
        id="realm"
        aria-labelledby="sf-realm-title"
        className="sf-landing-scene-cream"
        style={{ ...pad, ...tail }}
      >
        <Waypoint pill={tl('realm.waypoint')} goldPill={tl('realm.waypointPill')} />
        <div style={twoColGrid(28)}>
          <div style={panelStyle}>
            <h2 id="sf-realm-title" style={h2Style(isMobile)}>{tl('realm.h2')}</h2>
            <p style={proseStyle}>{tl('realm.body1')}</p>
            <p style={{ ...proseStyle, marginBottom: SP.xl }}>{tl('realm.body2')}</p>
            {/* ⛔ THIS ASK IS DELIBERATELY STILL HERE, AND THE LANE REFUSED TO
                REMOVE IT. The approved draft cut the three MIDDLE section asks to
                read-on links (one ask at the top, one at the end), and the other
                two are cut. This one is not, because "See Cartographer" is not
                only a section ask: it is CONTROL #5 OF THE OWNER'S PURCHASE
                LOCKOUT (2026-09-16, "disable all purchase buttons on the website
                until we are ready to launch … a pill that says available at
                launch"), pinned in both states by
                tests/components/launchLock.libraryHeaderLanding.test.jsx. Deleting
                it deletes a lock instrument, and rewriting that census to match a
                copy change is how a lock quietly stops being enforced. The chair
                and the owner rule on it; a lane does not. See .lane-resume.md. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap' }}>
              <Button variant="primary" disabled={!purchasesAreOpen} onClick={() => onNavigate('pricing')} style={purchasesAreOpen ? undefined : { flexWrap: 'wrap' }}>
                {tl('realm.cta')}
                {!purchasesAreOpen && <AvailableAtLaunchPill style={{ marginLeft: 6 }} />}
              </Button>
              <span style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: SECOND }}>{tl('realm.micro')}</span>
            </div>
          </div>
          <AdvanceTimeCard />
        </div>
        <RealmMapCard />
      </section>

        {/* leg 5 · town → city. With the map artifact folded into §02, this
            travel leg (the film still has six: data-welcome-leg 0..5) leads
            straight into §05 The commons at the city stop. */}
        <div className="sf-welcome-leg" data-welcome-leg="4" aria-hidden="true" />

      {/* ══ 05 · The commons — translucent cream (item 10) ══ */}
      <section id="commons" aria-labelledby="sf-commons-title" className="sf-landing-scene-cream" style={{ ...pad, ...tail }}>
        <Waypoint pill={tl('commons.waypoint')} />
        <div style={{ maxWidth: CONTENT_MAX, margin: `${SP.xl}px auto 0` }}>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <h2 id="sf-commons-title" style={{ ...h2Style(isMobile), marginBottom: SP.md }}>{tl('commons.h2')}</h2>
            <p style={{ ...proseStyle, margin: 0 }}>{tl('commons.body')}</p>
          </div>
          <GalleryCards onNavigate={onNavigate} />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: SP.xxl }}>
            <ReadOn to="closer">{tl('commons.readOn')}</ReadOn>
          </div>
        </div>
      </section>

        {/* leg 6 · city → metropolis */}
        <div className="sf-welcome-leg" data-welcome-leg="5" aria-hidden="true" />
        {/* ══ 06 · Set out — dark painted create scene (stop 6 · metropolis) ══ */}
      <section
        id="closer"
        aria-labelledby="sf-closer-title"
        className="sf-landing-scene-dark"
        // The band's own footer strip is gone (owner order 2026-09-16: the app's one
        // global footer now follows this band on every route, pinned on desktop), so
        // item 11's FLUSH BOTTOM (owner 2026-07-21) no longer has a strip to sit flush.
        // A bottom pad keeps "Full pricing" off the footer's edge. Set-out keeps its
        // dark scene (item-10 exempt).
        style={{ padding: isMobile ? `0 ${SP.md}px ${SP.xxl * 2}px` : `0 ${SP.xxl}px ${SP.xxl * 2}px`, '--sf-scene': SCENE('create') }}
      >
        <Waypoint pill={tl('closer.waypoint')} dark />
        <div style={{ maxWidth: 880, margin: `${SP.xxl * 2}px auto 0`, textAlign: 'center' }}>
          <h2 id="sf-closer-title" style={{
            margin: `0 0 ${SP.md}px`, fontFamily: serif_, fontSize: isMobile ? FS['32'] : FS['44'],
            fontWeight: 600, lineHeight: 1.15, color: PARCH,
          }}>{tl('closer.h2')}</h2>
          <p style={{ margin: `0 0 ${SP.xl}px`, fontFamily: serif_, fontStyle: 'italic', fontSize: FS['18'], lineHeight: 1.6, color: 'rgba(251,245,230,0.85)' }}>
            {tl('closer.sub')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="primary" size="lg" onClick={() => onNavigate('generate')}>{tl('closer.cta')}</Button>
          </div>
        </div>
        <TierStrip />
        <div style={{ textAlign: 'center', marginTop: SP.lg }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('pricing')}
            style={{ ...capsLink, color: 'rgba(224,192,128,1)' }}
          >
            {tl('closer.fullPricing')}
          </Button>
        </div>
      </section>
      </div>
    </>
  );
}
