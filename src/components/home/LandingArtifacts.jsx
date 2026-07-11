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

// NOTE: only icons ALREADY in the first-paint vendor-icons chunk may be used
// here (ArrowRight/Sparkles are). manualChunks routes every non-map lucide
// icon into the eager vendor-icons chunk regardless of importer laziness, so a
// new icon on this lazy surface would still grow first paint (measured: the
// forge button's Hammer cost +324 B against a sub-100 B budget margin).
import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../primitives/Button.jsx';
import StateBadge from '../primitives/StateBadge.jsx';
import Badge from '../primitives/Badge.jsx';
import { fontFamily, radius } from '../../design/tokens.js';
import {
  INK, SECOND, BODY, MUTED, GOLD, GOLD_DEEP, GOLD_TXT,
  PARCH, PARCH_100, BORDER, CARD, CARD_ALT,
  VIOLET, VIOLET_BG, VIOLET_DEEP, RED, RED_BG, GREEN, GREEN_BG, AMBER, AMBER_BG, AMBER_DEEP,
  FS, SP, R, ELEV, sans, serif_,
} from '../theme.js';
import { useStore } from '../../store/index.js';
import { anonAtCap } from '../../lib/anonGenCounter.js';
import { Funnel } from '../../lib/analytics.js';
import { tl } from '../../copy/landing.js';
import { fixture } from './landingFixture.js';

const MONO = fontFamily.mono;
export const SCENE = (name) => `url('/backgrounds/landing/${name}-1400.jpg')`;

// Status-tint chip palette — all from tokens. `faith` reuses the app's
// faith-event convention (semantic violet), the one §9-sanctioned violet
// outside §03; it is NOT a second violet — it is the same violet token family.
const CHIP = {
  neutral:  { bg: PARCH_100, fg: BODY,        border: BORDER },
  warning:  { bg: AMBER_BG,  fg: AMBER_DEEP,  border: AMBER },
  success:  { bg: GREEN_BG,  fg: GREEN,       border: GREEN },
  danger:   { bg: RED_BG,    fg: RED,         border: RED },
  war:      { bg: RED_BG,    fg: RED,         border: RED },
  faith:    { bg: VIOLET_BG, fg: VIOLET_DEEP, border: VIOLET },
  economic: { bg: PARCH_100, fg: GOLD_TXT,    border: BORDER },
};
const dotColor = { danger: RED, success: GREEN, gold: GOLD, warning: AMBER };

export const cardStyle = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg, boxShadow: ELEV[2] };
const eyebrowGold = { fontFamily: sans, fontSize: FS.xs, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD_DEEP };
const monoTag = { fontFamily: MONO, fontSize: FS.xs, color: MUTED };
// The quiet provenance stamp: `seed · lf-010` (+ ` · week K` where the artifact
// shows advanced state). Mono, muted, deliberately unshouty.
const seedTag = (withWeek = false) =>
  `seed · ${fixture.seed}${withWeek ? ` · week ${fixture.weeks}` : ''}`;

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
  const authTier = useStore(s => s.auth.tier);
  const [forging, setForging] = useState(false);

  const forgeExact = async () => {
    if (forging) return;
    // Optional-chained funnel tag (no new analytics plumbing) — a no-op until
    // the analytics wave lands the event, mirroring Funnel.welcomeView.
    Funnel.landingFixtureForge?.({ seed: fixture.seed });
    if (authTier === 'anon' && anonAtCap()) { onNavigate('generate'); return; }
    setForging(true);
    try {
      // Replay EVERY recorded generation input (mode, slider mode, neighbour,
      // full config) so the button's output can never disagree with the frozen
      // artifact — the fixture script generated through this exact shape.
      setWizardMode(fixture.forge.mode);
      setRandomSliderMode(fixture.forge.randomSliderMode);
      clearNeighbour();
      updateConfig({ ...fixture.forge.config });
      await generate(fixture.seed);
    } catch (e) {
      console.error('[LandingArtifacts] fixture forge failed:', e);
    } finally {
      setForging(false);
      onNavigate('generate');
    }
  };

  return (
    <Button variant="secondary" size="sm" busy={forging} onClick={forgeExact}>
      {tl('brief.forgeExact')}
    </Button>
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
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: MONO, fontSize: FS.xs, color: VIOLET_DEEP }}>
            <Sparkles size={11} aria-hidden="true" />{tl('voice.credit')}
          </span>
        </div>
        <p style={{ margin: 0, fontFamily: serif_, fontStyle: 'italic', fontSize: FS['16'], lineHeight: 1.7, color: BODY }}>
          {fixture.voice.narrated}
        </p>
      </div>
    </div>
  );
}

// ── 04 · Realm — why-trace card (real band deltas, real causes) ──────────────
export function WhyTraceCard() {
  const deltas = fixture.realm.whyTrace || [];
  return (
    <div style={{ ...cardStyle, padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: SP.sm, marginBottom: SP.md }}>
        <span style={eyebrowGold}>{tl('realm.whyTraceTitle', { week: fixture.weeks })}</span>
        <span style={monoTag}>{tl('realm.whyTraceTag')}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {deltas.map((d) => (
          <div key={d.axis} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: sans, fontSize: FS['12.5'], fontWeight: 800, color: SECOND }}>{d.axis}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Chip tone="neutral">{d.from}</Chip>
                <ArrowRight size={11} color={MUTED} aria-hidden="true" />
                <Chip tone={d.tone}>{d.to}</Chip>
              </span>
            </div>
            <span style={{ fontFamily: serif_, fontStyle: 'italic', fontSize: FS['14.5'], lineHeight: 1.5, color: BODY }}>
              {d.reason}
            </span>
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
        backgroundImage: SCENE('world-map'), backgroundSize: 'cover', backgroundPosition: 'center',
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
