/**
 * home/LandingArtifacts.jsx — the landing page's DERIVED artifacts (owner
 * amendment W-L2/1): the §02 mini-dossier, §03 RAW/NARRATED voice cards, and
 * §04 why-trace + realm-map cards, all rendering FROZEN REAL ENGINE OUTPUT from
 * ./landingFixture.js (seed lf-010 — the provenance the mono seed tags stamp on
 * each artifact; determinism is the moat, said quietly).
 *
 * Deliberately incomplete by design ("they should forge their own — for trust"):
 * two hooks with an honest "+N more in the dossier" count, the Summary tab
 * active with the other tabs present but inert, a CSS fade on the brief's final
 * line (.sf-landing-prose-fade).
 *
 * ONE interactive artifact control (owner addition W-L2/5): the §02 "Forge this
 * exact town" button replays the fixture's recorded { seed, config } through the
 * SAME store forge action as every other generation — generateSettlement() owns
 * the anon cap guard and the counting, so there is no special path and no cap
 * bypass. At-cap anons route to the create surface, where the existing at-cap
 * treatment lives. All other chips remain decorative spans (§3.8).
 *
 * Lives in the SAME lazy chunk as LandingBelowFold (its only importer) — the
 * store/gallery/fixture imports here never touch first paint.
 */

// NOTE: this surface now carries NO lucide at all (lane LU-2 — the icons-off
// law suppressed its ArrowRight/Sparkles anyway, so the imports were pure first-
// paint cost for glyphs nobody could see). The old rule here was "only icons
// ALREADY in the vendor-icons chunk may be used", because manualChunks routes
// every non-map lucide icon into the EAGER vendor-icons chunk regardless of
// importer laziness — a new icon on this lazy surface still grows first paint
// (measured: the forge button's Hammer cost +324 B against a sub-100 B margin).
// That rule still holds for anyone tempted to add one; the icons-off gate is
// now the first reason not to, and this cost is the second.
import { useState } from 'react';
import Button from '../primitives/Button.jsx';
import StateBadge from '../primitives/StateBadge.jsx';
import Badge from '../primitives/Badge.jsx';
import { fontFamily, radius } from '../../design/tokens.js';
import {
  INK, SECOND, BODY, MUTED, GOLD, GOLD_DEEP, GOLD_TXT,
  PARCH, PARCH_100, BORDER, CARD, CARD_ALT,
  SLATE, SLATE_BG, SLATE_DEEP, RED, RED_BG, GREEN, GREEN_BG, AMBER, AMBER_BG, AMBER_DEEP,
  FS, SP, R, ELEV, sans, serif_,
} from '../theme.js';
import { useStore } from '../../store/index.js';
import RefusalNotice from '../primitives/RefusalNotice.jsx';
import { trackLandingFixtureForge } from '../../lib/landingFunnelAnalytics.js';
import { tl } from '../../copy/landing.js';
import { fixture } from './landingFixture.js';
import { preferredImageExt } from '../../config/pageBackgrounds.js';

const MONO = fontFamily.mono;
export const SCENE = (name) => `url('/backgrounds/landing/${name}-1400.jpg')`;

// Walk W1, item 8 (owner order 2026-07-21, ledger 4f71743a): the §04 Realm map preview.
// The painted world-map/crossroads placeholder is REPLACED by W7's generated realm-map
// preview (settlements, deterministic seed, house style), folded onto the composite tip
// at d18768fa. This is the SINGLE swap site. Manager pick (vetoable): fallowmere /
// parchment. NOTE: the SVG lives on the composite TIP, not this branch's base — it
// arrives when W1 folds onto the tip, so this references the path as a string (a
// worktree-local load 404s until the fold; that is expected).
// ⛔ IT IS A PHOTOGRAPH OF THE PRODUCT NOW (owner order ODQ §934.30 item 5: "the
// realm clock map should actually be made and a screenshot of Cnocby in a drawn
// out map made in the realm with other generated settlements … with the realm
// clock advance time box over that"). The plate above is real generated output,
// but it is a DIFFERENT renderer at a DIFFERENT seed: a visitor met Cnocby in
// four artifacts and then looked at a map of Fallowmere, somewhere else entirely.
// realm-cnocby.png is the running app's own Realm view of the fixture's five
// settlements, cut in Chromium by scripts/capture-landing-realm.mjs and recorded
// in realm-cnocby.provenance.json (seed, tip, what was in frame).
//
// TWO LAYERS, AND THE ORDER IS THE FALLBACK. CSS paints the FIRST background
// image on top and simply skips one that fails to load, so the parchment plate
// shows through for anyone served the page before the capture lands — a missing
// photograph degrades to the old map rather than to a grey box. The "Realm clock
// / Advance time" block is positioned over this box unchanged (RealmMapCard).
export const REALM_MAP_BASE = '/landing-maps/realm-cnocby';
export const REALM_MAP_PLATE = '/landing-maps/realm-preview.fallowmere.parchment.svg';

/**
 * The realm card's backdrop: the photograph in the ONE format this engine can
 * decode, with the parchment plate beneath it.
 *
 * ⚠ THE TWO LAYERS ARE NOT A FORMAT FALLBACK — the twin selection above already
 * settled the format, and CSS would fetch both if asked. The plate is a
 * DIFFERENT kind of fallback: it paints if the photograph has not been cut yet
 * (a worktree before `node scripts/capture-landing-realm.mjs` runs), so a
 * missing capture degrades to the old map rather than to a grey box.
 *
 * Exported and parameterised so it is testable: the WebP probe answers 'png' in
 * jsdom (no canvas encoder), which would make a rendered assertion about WebP
 * vacuous. @enforced-by tests/ui/landingRealmTwins.test.js
 *
 * @param {string} [ext] the chosen extension; defaults to the engine's own
 */
export function realmMapPreview(ext = preferredImageExt('png')) {
  return `url('${REALM_MAP_BASE}.${ext}'), url('${REALM_MAP_PLATE}')`;
}

// Status-tint chip palette — all from tokens. `faith` reuses the app's
// faith-event convention (semantic violet), the one §9-sanctioned violet
// outside §03; it is NOT a second violet — it is the same violet token family.
const CHIP = {
  neutral:  { bg: PARCH_100, fg: BODY,        border: BORDER },
  warning:  { bg: AMBER_BG,  fg: AMBER_DEEP,  border: AMBER },
  success:  { bg: GREEN_BG,  fg: GREEN,       border: GREEN },
  danger:   { bg: RED_BG,    fg: RED,         border: RED },
  war:      { bg: RED_BG,    fg: RED,         border: RED },
  faith:    { bg: SLATE_BG, fg: SLATE_DEEP, border: SLATE },
  economic: { bg: PARCH_100, fg: GOLD_TXT,    border: BORDER },
};
const dotColor = { danger: RED, success: GREEN, gold: GOLD, warning: AMBER };

export const cardStyle = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg, boxShadow: ELEV[2] };
const eyebrowGold = { fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD_DEEP };
const monoTag = { fontFamily: MONO, fontSize: FS.xs, color: MUTED };
// The quiet provenance stamp: `seed · lf-010` (+ how far the artifact's world was
// advanced). Mono, muted, deliberately unshouty. §69.3: this is the PUBLIC landing
// page, so the raw counter `week K` is forbidden — the same fact reads as an
// elapsed span, which is what a visitor can actually use.
const seedTag = (withWeek = false) =>
  `seed · ${fixture.seed}${withWeek ? ` · ${fixture.weeks} weeks in` : ''}`;

// A small status chip (band label). radius 4 = R.sm.
export function Chip({ tone, children, style }) {
  const c = CHIP[tone] || CHIP.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.04em',
      textTransform: 'uppercase', color: c.fg, background: c.bg,
      border: `1px solid ${c.border}`, borderRadius: R.sm, padding: '1px 7px',
      whiteSpace: 'nowrap', ...style,
    }}>
      {children}
    </span>
  );
}

// ── The one interactive artifact control: Forge this exact town ─────────────
// Replays fixture.forge.config + fixture.seed through the store's ONE forge
// entry point. generateSettlement() enforces the anon daily cap and owns the
// counting (a slot is consumed only when generation actually runs); an at-cap
// anon is routed to the create surface where the existing at-cap/unlock
// treatment renders — identical to the hero path, no special case.
function ForgeExactButton({ onNavigate }) {
  const generate = useStore(s => s.generateSettlement);
  const updateConfig = useStore(s => s.updateConfig);
  const setWizardMode = useStore(s => s.setWizardMode);
  const setRandomSliderMode = useStore(s => s.setRandomSliderMode);
  const clearNeighbour = useStore(s => s.clearNeighbour);
  // ⛔ THE LANE REFUSES AND SAYS WHY (ODQ §934.24(c)). The hand-rolled cap pre-flight
  // that used to sit in this handler navigated to /create with NOTHING said — one of
  // four copies of the same silent refusal the 2026-09-19 walk found. The gate lives
  // in the generation lane, which is where it was always enforced; this surface reads
  // the reason it recorded and renders it where the reader clicked.
  const lastRefusal = useStore(s => s.lastRefusal);
  const clearRefusal = useStore(s => s.clearRefusal);
  const [forging, setForging] = useState(false);

  const forgeExact = async () => {
    if (forging) return;
    clearRefusal?.();
    // W-DOC: the landing funnel LANDED — landing_funnel_used
    // feature:'fixture_forge' via the SM-5-pattern lazy helper (the seed is the
    // fixture's constant — provenance, not user data).
    trackLandingFixtureForge({ seed: fixture.seed });
    setForging(true);
    try {
      // Replay EVERY recorded generation input (mode, slider mode, neighbour,
      // full config) so the button's output can never disagree with the frozen
      // artifact — the fixture script generated through this exact shape.
      setWizardMode(fixture.forge.mode);
      setRandomSliderMode(fixture.forge.randomSliderMode);
      clearNeighbour();
      updateConfig({ ...fixture.forge.config });
      const forged = await generate(fixture.seed);
      // ⛔ A REFUSAL NEVER NAVIGATES. The old `finally` navigated on EVERY path, so a
      // refused or failed forge still threw the reader at /create with no settlement
      // and no reason — which is indistinguishable, from the chair, from nothing
      // happening at all.
      if (!forged) { setForging(false); return; }
      setForging(false);
      onNavigate('generate');
    } catch (e) {
      console.error('[LandingArtifacts] fixture forge failed:', e);
      setForging(false);
    }
  };

  return (
    // The control and its refusal are ONE block: the notice renders directly beneath
    // the button the reader pressed, never on another page.
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: SP.sm }}>
      <Button variant="secondary" size="sm" busy={forging} onClick={forgeExact}>
        {tl('brief.forgeExact')}
      </Button>
      <RefusalNotice refusal={lastRefusal} />
    </span>
  );
}

// ── 02 · Brief — the mini dossier, frozen real engine output ────────────────
export function MiniDossierCard({ onNavigate }) {
  const tabs = tl('brief.tabs') || [];
  const town = fixture.town;
  return (
    <div style={{ ...cardStyle, overflow: 'hidden' }}>
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{ ...eyebrowGold, letterSpacing: '0.12em', marginBottom: 6 }}>
          {town.eyebrow}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.md, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: serif_, fontSize: FS['26'], fontWeight: 600, color: INK }}>
            {town.name}
          </span>
          <span style={{ display: 'inline-flex', gap: SP.sm, alignItems: 'center' }}>
            <StateBadge kind="draft" />
            <Badge tone="gold" size="md">{tl('brief.population', { n: town.population })}</Badge>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 2, marginTop: SP.md, borderBottom: `1px solid ${BORDER}` }}>
          {tabs.map((tab, i) => (
            <span key={tab} style={{
              fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
              color: i === 0 ? INK : MUTED, padding: '8px 12px',
              boxShadow: i === 0 ? `inset 0 -2px 0 ${GOLD}` : 'none',
            }}>{tab}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: '16px 22px 20px' }}>
        <p style={{ margin: '0 0 6px', fontFamily: serif_, fontSize: FS.lg, lineHeight: 1.6, color: BODY }}>
          {town.prose}
        </p>
        {/* The brief's final line fades out (deliberate incompleteness — the
            rest lives in the dossier the visitor forges). */}
        <p className="sf-landing-prose-fade" style={{ margin: '0 0 14px', fontFamily: serif_, fontStyle: 'italic', fontSize: FS.lg, lineHeight: 1.6, color: SECOND }}>
          {town.pressure}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {town.hooks.map((hook, i) => (
            <div key={i} style={{ background: CARD_ALT, border: `1px solid ${BORDER}`, borderRadius: R.md, padding: '10px 13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: SP.sm, marginBottom: 3 }}>
                <span style={{
                  fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: hook.tone === 'success' ? GREEN : AMBER_DEEP,
                }}>{hook.kind}</span>
                <span style={monoTag}>{hook.tag}</span>
              </div>
              <span style={{ fontFamily: serif_, fontSize: FS['14'], lineHeight: 1.5, color: BODY }}>
                {hook.lead && <strong style={{ color: SECOND }}>{hook.lead}</strong>}
                {hook.rest || hook.text}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: SP.sm, fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: MUTED }}>
          {tl('brief.more', { n: town.hooksMore })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginTop: SP.md, borderTop: `1px solid ${BORDER}`, paddingTop: SP.md, flexWrap: 'wrap' }}>
          {/* Decorative — non-interactive span styled like a secondary button (§3.8). */}
          <span style={{
            fontFamily: sans, fontSize: FS.xs, fontWeight: 800, color: SECOND,
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg, padding: '6px 12px',
          }}>{tl('brief.save')}</span>
          <span style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 700, color: MUTED }}>
            {tl('brief.saveNote')}
          </span>
          <span style={{ ...monoTag, marginLeft: 'auto' }}>{seedTag()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginTop: SP.md, flexWrap: 'wrap' }}>
          <ForgeExactButton onNavigate={onNavigate} />
          <span style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 700, color: MUTED }}>
            {tl('brief.deterministic')}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── 03 · Voice — RAW receipts + stock-narrated card ──────────────────────────
export function VoiceCards() {
  const receipts = fixture.voice.receipts || [];
  return (
    <div style={{
      maxWidth: 960, margin: `${SP.xl}px auto 0`, display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 18, alignItems: 'stretch',
    }}>
      {/* RAW — real trace receipts from the fixture generation. */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg, boxShadow: ELEV[1], padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.sm, marginBottom: SP.md }}>
          <StateBadge kind="raw" />
          <span style={monoTag}>{tl('voice.rawTag')}</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: FS['12.5'], lineHeight: 1.75, color: BODY, flex: 1 }}>
          {receipts.map((r) => <div key={r.label}>{r.label}: {r.text}</div>)}
        </div>
        <div style={{ ...monoTag, marginTop: SP.md, textAlign: 'right' }}>{seedTag()}</div>
      </div>
      {/* NARRATED — the one violet border on the page (§3.2/§7). Stock prose,
          owner-sanctioned, grounded exclusively in the receipts at left. */}
      <div style={{ background: CARD, border: '1px solid rgba(123,79,207,0.35)', borderRadius: R.lg, boxShadow: ELEV[1], padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.sm, marginBottom: SP.md }}>
          <StateBadge kind="narrated" />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: MONO, fontSize: FS.xs, color: SLATE_DEEP }}>
            {tl('voice.credit')}
          </span>
        </div>
        <p style={{ margin: 0, fontFamily: serif_, fontStyle: 'italic', fontSize: FS['16'], lineHeight: 1.7, color: BODY }}>
          {fixture.voice.narrated}
        </p>
      </div>
    </div>
  );
}

// ── 04 · Realm — the advance-time card (what the weeks DID, not what moved) ──
//
// ⛔ EVENTS, NOT DELTAS (owner order ODQ §934.30 item 4: "the advance time
// shouldn't describe deltas but should describe actual events that have
// happened as we have designed"). This card used to render fixture.realm.whyTrace
// — three causal BAND crossings, each headed by an internal axis name and a pair
// of band chips, with reason lines that read "Pressure increased". That is a
// readout of a variable, and a visitor who has never seen the engine has no way
// to want it. It now renders fixture.realm.advance: the town's OWN applied pulse
// events across the same run, which is what the product's own Chronicle and
// advance report show a player after every advance.
//
// THE HONESTY LINE (the chair's ruling): every entry is a record the shipped
// pulse produced for this settlement. Nothing here is written, and a thin run
// renders a thin card — the landing's whole claim is that the facts on it came
// out of the engine.
//
// THE SEASON FRAME is AdvanceReport's own (its "chapters" altitude): the weeks
// are grouped under the calendar season they fell in, using the SAME
// tickCalendarLabel helper the report uses, resolved in the emitter so this
// surface stays a renderer. One season is the common case at twelve weeks
// (13 weeks to a season), so the label rides the header's mono slot and the
// per-chapter heading appears only when a run actually crosses a season.
export function AdvanceTimeCard() {
  const entries = fixture.realm.advance || [];
  // Chapters in the order they happened. Built by a fold rather than a group-by
  // so a run that re-enters a season (a multi-year advance) reads as two
  // chapters, which is what a reader lived.
  const chapters = [];
  for (const entry of entries) {
    const open = chapters[chapters.length - 1];
    if (open && open.season === entry.season) open.entries.push(entry);
    else chapters.push({ season: entry.season, entries: [entry] });
  }
  return (
    <div style={{ ...cardStyle, padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: SP.sm, marginBottom: SP.md }}>
        <span style={eyebrowGold}>{tl('realm.whyTraceTitle', { week: fixture.weeks })}</span>
        <span style={monoTag}>{chapters[0]?.season}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {chapters.map((chapter, ci) => (
          <div key={chapter.season + ci} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {chapters.length > 1 && (
              <span style={{ ...eyebrowGold, color: MUTED, letterSpacing: '0.08em' }}>{chapter.season}</span>
            )}
            {chapter.entries.map((entry) => (
              <div key={entry.week + entry.headline} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
                  <Chip tone="neutral">{entry.week}</Chip>
                  <span style={{ fontFamily: sans, fontSize: FS['12.5'], fontWeight: 800, color: SECOND }}>{entry.headline}</span>
                </div>
                <span style={{ fontFamily: serif_, fontSize: FS['14.5'], lineHeight: 1.5, color: BODY }}>
                  {entry.text}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: SP.sm, flexWrap: 'wrap', borderTop: `1px solid ${BORDER}`, marginTop: SP.lg, paddingTop: SP.md }}>
        <span style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: MUTED }}>{tl('realm.derivedLine')}</span>
        <span style={monoTag}>{seedTag(true)}</span>
      </div>
    </div>
  );
}

// ── 04 · Realm — world map + chronicle (real names, real applied events) ─────
export function RealmMapCard() {
  const { pins = [], chronicle = [], relationships = [] } = fixture.realm;
  // Pin percentage positions (relative to the image box — spec §7). The scene
  // is the painted world-map (an in-app realm capture was blocked this wave —
  // see docs/LANDING_HANDOFF_AMENDMENTS.md); names/states are the fixture's.
  const pinPos = [{ top: '52%', left: '38%' }, { top: '22%', left: '60%' }, { top: '70%', left: '64%' }];
  return (
    <div style={{
      ...cardStyle, maxWidth: 1080, margin: `${SP.xl + SP.md}px auto 0`, overflow: 'hidden',
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    }}>
      {/* Map half */}
      <div style={{
        position: 'relative', minHeight: 320,
        backgroundImage: realmMapPreview(), backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        <div style={{
          position: 'absolute', top: 14, left: 14, background: 'rgba(255,251,245,0.94)',
          border: `1px solid ${BORDER}`, borderRadius: R.lg, padding: '12px 16px', boxShadow: ELEV[2],
        }}>
          <div style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 2 }}>
            {tl('realm.clockLabel')}
          </div>
          <div style={{ fontFamily: serif_, fontSize: FS['22'], fontWeight: 600, color: INK, marginBottom: SP.sm }}>
            {tl('realm.clockValue', { week: fixture.weeks })}
          </div>
          {/* Decorative — non-interactive span styled like a small primary button (§3.8). */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', fontFamily: sans, fontSize: FS.xs, fontWeight: 800,
            color: CARD, background: GOLD, border: `1px solid ${GOLD}`, borderRadius: R.lg, padding: '5px 12px',
          }}>{tl('realm.clockCta')}</span>
        </div>
        {pins.map((pin, i) => (
          <div key={pin.name} style={{
            position: 'absolute', top: pinPos[i]?.top, left: pinPos[i]?.left, transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          }}>
            <span style={{
              width: 13, height: 13, borderRadius: radius.button, background: dotColor[pin.dotTone] || GOLD,
              border: `2.5px solid ${CARD}`, boxShadow: ELEV[1],
            }} />
            <span style={{
              fontFamily: sans, fontSize: FS.xs, fontWeight: 800, color: INK,
              background: 'rgba(255,251,245,0.92)', borderRadius: R.sm, padding: '1px 7px',
              boxShadow: ELEV[1], whiteSpace: 'nowrap',
            }}>{pin.name}</span>
            {pin.tag && (
              <span style={{
                fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: PARCH, background: pin.tagTone === 'danger' ? RED : AMBER,
                borderRadius: R.sm, padding: '1px 7px', boxShadow: ELEV[1], whiteSpace: 'nowrap',
              }}>{pin.tag}</span>
            )}
          </div>
        ))}
      </div>
      {/* Chronicle half */}
      <div style={{ padding: '20px 22px', borderLeft: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: SP.sm, marginBottom: SP.md }}>
          <span style={{ fontFamily: serif_, fontSize: FS['18'], fontWeight: 600, color: INK }}>{tl('realm.chronicleTitle')}</span>
          <span style={monoTag}>{tl('realm.chronicleTag')}</span>
        </div>
        {/* ⛔ THE TWO CARDS NOW SAY DIFFERENT THINGS, AND THE READER IS TOLD WHICH.
            Since ODQ §934.30 item 4 the advance-time card carries the TOWN'S own
            events; this chronicle is the REGION's band — the neighbours. Without
            a line naming that, two lists of engine sentences side by side read as
            one list printed twice, which is the defect shape the 09-18 walk kept
            finding. Approved in the copy draft (owner, 2026-09-19). */}
        <p style={{ margin: `0 0 ${SP.md}px`, fontFamily: sans, fontSize: FS.sm, fontWeight: 700, color: MUTED, lineHeight: 1.5 }}>
          {tl('realm.regionLine')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {chronicle.map((entry, i) => (
            <div key={i} style={{ background: CARD_ALT, border: `1px solid ${BORDER}`, borderRadius: R.md, padding: '10px 13px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, marginBottom: 3 }}>
                <Chip tone={entry.tone} style={{ borderColor: 'transparent' }}>{entry.kind}</Chip>
                <span style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 700, color: MUTED }}>{entry.week}</span>
              </div>
              <span style={{ fontFamily: serif_, fontSize: FS['14.5'], lineHeight: 1.5, color: BODY }}>{entry.text}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: SP.md, borderTop: `1px solid ${BORDER}`, paddingTop: SP.md }}>
          {relationships.map((rel, i) => (
            <Chip key={i} tone={rel.tone} style={{ borderRadius: radius.button, padding: '3px 10px' }}>
              {rel.from} {rel.tone === 'danger' ? '⤬' : '⇆'} {rel.to} · {rel.type}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

// STRIP-1 (owner ruling, ODQ §725): the MapPlateCard — the landing page's frozen
// settlement-map lens plates and their flip control — is REMOVED with the rest of
// the legacy settlement map. The realm-map preview (realmMapPreview above) is a
// DIFFERENT surface and stays.
