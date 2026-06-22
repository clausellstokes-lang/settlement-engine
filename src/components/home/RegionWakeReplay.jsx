/**
 * RegionWakeReplay.jsx — the anon "Watch a region wake up" replay.
 *
 * A READ-ONLY, deterministic teaser rendered below HomeSampleDossier for anon
 * visitors. It scrubs a small CANNED fixture (domain/display/regionWakeReplay.js)
 * through the EXISTING pure projections — liveSieges / realmArcLines /
 * pantheonStandings / chronicleTimeline — so a no-account user SEES the premium
 * living simulation without it ever running.
 *
 * There is NO live engine here: "Advance a month" is an index into a frozen array
 * of pre-baked frames. Scrubbing forward/back is `setStep`; the render is a pure
 * function of the step. Nothing forks rng, mutates worldState, or reads a clock.
 *
 * Self-gates on auth.tier === 'anon' AND !settlement (mirrors HomeSampleDossier),
 * so it disappears the moment the visitor has the real thing. Fires the
 * `pantheon_preview` / `war_layer_curiosity` / `map_realm_teaser` family is NOT
 * done here — the replay is a passive teaser; the CTA routes to the canonical
 * premium-value surface (PricingPage) where the real moments live.
 */

import { useMemo, useState } from 'react';
import { Swords, Flame, Sparkles, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { FS, PARCH, INK_DEEP, INK, GOLD, GOLD_B, MUTED, BORDER, sans, serif_, swatch } from '../theme.js';
import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import {
  projectReplayStep,
  REPLAY_STEP_COUNT,
} from '../../domain/display/regionWakeReplay.js';

// No semantic violet/crimson token exists; keep these as swatch lookups.
const VIOLET = swatch['#7B4FCF'];
const CRIMSON = swatch['#8B1A1A'];

function StepDot({ active, done }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: active ? 10 : 8, height: active ? 10 : 8,
        borderRadius: '50%',
        background: active ? GOLD : done ? `${GOLD}80` : BORDER,
        transition: 'all 120ms ease',
      }}
    />
  );
}

function ArcLine({ children }) {
  return (
    <li style={{
      fontFamily: serif_, fontSize: FS['13.5'], color: swatch['#3A2F18'],
      lineHeight: 1.5, padding: '3px 0',
    }}>
      {children}
    </li>
  );
}

/**
 * @param {Object} props
 * @param {() => void} [props.onUpgrade]  route to the canonical premium-value surface.
 */
export default function RegionWakeReplay({ onUpgrade }) {
  const tier = useStore(s => s.auth.tier);
  const settlement = useStore(s => s.settlement);
  const [step, setStep] = useState(0);

  // Pure projection of the canned fixture at the current step. Memoized on step
  // only — there is no other input (no store read, no time).
  const view = useMemo(() => projectReplayStep(step), [step]);

  if (tier !== 'anon') return null;
  if (settlement) return null;

  const last = REPLAY_STEP_COUNT - 1;
  const atEnd = step >= last;

  return (
    <section
      aria-label="Watch a region wake up (read-only replay)"
      data-testid="region-wake-replay"
      style={{
        maxWidth: 480, margin: '0 auto 56px',
        background: swatch.white,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 6px 24px rgba(27,20,8,0.08)',
        fontFamily: sans,
      }}
    >
      {/* Header — eyebrow + title + step indicator */}
      <header style={{
        padding: '12px 16px',
        background: `linear-gradient(135deg, ${INK_DEEP}, ${INK})`,
        color: GOLD,
      }}>
        <div style={{
          fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: GOLD_B,
        }}>
          {t('replay.eyebrow')}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontFamily: serif_, fontSize: FS['16'], fontWeight: 600 }}>
            {t('replay.title')}
          </div>
          <div style={{ fontSize: FS.micro, color: GOLD_B, fontFamily: sans, letterSpacing: '0.05em' }}>
            {t('replay.stepLabel', { step: step + 1, total: REPLAY_STEP_COUNT })}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          {Array.from({ length: REPLAY_STEP_COUNT }, (_, i) => (
            <StepDot key={i} active={i === step} done={i < step} />
          ))}
          <span style={{ marginLeft: 'auto', fontSize: FS.micro, color: GOLD_B }}>
            {view.monthLabel}
          </span>
        </div>
      </header>

      {/* Body — the projected read-outs for this month */}
      <div style={{ padding: 14, minHeight: 168 }}>
        {/* Latest headline */}
        {view.headlines.length > 0 ? (
          <div style={{
            padding: 10, marginBottom: 10,
            background: PARCH, border: `1px solid ${BORDER}`,
            borderLeft: `3px solid ${GOLD}`, borderRadius: 5,
          }}>
            <div style={{ fontFamily: serif_, fontSize: FS['14'], fontWeight: 600, color: INK }}>
              {view.headlines[0].headline}
            </div>
            {view.headlines[0].summary && (
              <div style={{ marginTop: 2, fontSize: FS['11.5'], color: swatch['#3A2F18'], lineHeight: 1.5 }}>
                {view.headlines[0].summary}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            padding: '18px 10px', marginBottom: 10, textAlign: 'center',
            color: MUTED, fontFamily: serif_, fontStyle: 'italic', fontSize: FS['14'],
          }}>
            {t('replay.empty')}
          </div>
        )}

        {/* Live state chips — siege / pantheon */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {view.sieges.length > 0 && (
            <span style={chip(CRIMSON)}>
              <Swords size={11} /> {view.sieges.length} siege{view.sieges.length === 1 ? '' : 's'}
            </span>
          )}
          {view.pantheon.length > 0 && (
            <span style={chip(VIOLET)}>
              <Sparkles size={11} /> {view.pantheon[0].id.split(/[:_]/).pop()} · {view.pantheon[0].tier}
            </span>
          )}
          {view.sieges.length === 0 && view.arcs.length === 0 && (
            <span style={chip(swatch['#4A7A3A'])}>
              <Flame size={11} /> At peace
            </span>
          )}
        </div>

        {/* The named arcs — exactly what realmArcLines projects */}
        {view.arcs.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, borderTop: `1px dashed ${BORDER}`, paddingTop: 6 }}>
            {view.arcs.map((arc, i) => <ArcLine key={i}>{arc}</ArcLine>)}
          </ul>
        )}
      </div>

      {/* Controls — scrubber (read-only; just an index) */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px', borderTop: `1px solid ${BORDER}`, background: PARCH,
      }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          aria-label={t('replay.prev')}
          icon={<ChevronLeft size={14} />}
          style={{ minHeight: 44 }}
        >
          {t('replay.prev')}
        </Button>
        {atEnd ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setStep(0)}
            icon={<RotateCcw size={13} />}
            style={{ marginLeft: 'auto', minHeight: 44 }}
          >
            {t('replay.restart')}
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setStep(s => Math.min(last, s + 1))}
            trailingIcon={<ChevronRight size={14} />}
            style={{ marginLeft: 'auto', minHeight: 44 }}
          >
            {t('replay.next')}
          </Button>
        )}
      </div>

      {/* Footer — the pitch + CTA to the canonical premium-value surface */}
      <footer style={{
        padding: '10px 16px 14px', borderTop: `1px dashed ${BORDER}`,
        background: swatch.white, textAlign: 'center',
      }}>
        <div style={{ fontSize: FS.xs, color: MUTED, fontStyle: 'italic', fontFamily: serif_ }}>
          {t('replay.footer')}
        </div>
        {typeof onUpgrade === 'function' && (
          <Button
            variant="primary"
            size="sm"
            onClick={onUpgrade}
            style={{ marginTop: 8, minHeight: 44 }}
          >
            {t('replay.cta')}
          </Button>
        )}
      </footer>
    </section>
  );
}

function chip(color) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 8px', borderRadius: 999,
    background: `${color}14`, color, border: `1px solid ${color}40`,
    fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.03em',
  };
}
