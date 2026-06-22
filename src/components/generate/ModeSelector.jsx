/**
 * ModeSelector.jsx — Basic / Advanced generation-mode picker cards.
 *
 * Extracted byte-for-byte from GenerateWizard.jsx. Renders the two named
 * generation modes (Basic, Advanced). The HomeHero's instant generation is
 * its own surface, not a mode listed here.
 */

import { Zap, Settings } from 'lucide-react';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER2, CARD, serif_, SP, R, FS, ELEV } from '../theme.js';
import { backgroundImageUrl, MODE_BACKGROUNDS } from '../../config/pageBackgrounds.js';

export function ModeSelector({ mode, onModeChange, large = false }) {
  // The wizard exposes two named generation modes:
  //   - Basic    (formerly "Quick"): one-screen config + Generate.
  //     The hero's instant generation routes here under the hood so
  //     a user landing on the wizard sees the same shape.
  //   - Advanced: step-by-step config with institution toggles,
  //     services, and trade dynamics.
  // (Custom Generate / the Workshop was removed.) The HomeHero's instant
  // generation is its OWN surface (homepage card with size-picker chips),
  // not a mode listed here. Anonymous users see the hero only — these mode
  // cards are gated to signed-in users (Basic/Advanced require a free sign-in).
  const modes = [
    { id: 'basic',    label: 'Basic Generate',    desc: 'Character + foundations. The rest is rolled.', Icon: Zap,      longDesc: 'Pick a character and set the foundations: size, culture, terrain. The simulator rolls priorities, institutions, services, and trade for you. The fastest way to a usable settlement; refine it afterward.' },
    { id: 'advanced', label: 'Advanced Generate', desc: 'Every dial: institutions, services, trade.',   Icon: Settings, longDesc: 'Everything in Basic, plus the Fine-tune sliders and hard constraints on institutions, services, and trade. Full control over the probability space, for when you have a specific settlement in mind.' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: large ? SP.xl : SP.md,
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: large ? `${SP.xxl}px 0` : `${SP.sm}px 0`,
    }}>
      {/* Keyboard focus must be perceivable in its own right, not only via the
          JS onFocus handler that mirrors hover. This encodes focus in two
          channels — a solid outline AND a gold ring — independent of pointer
          state, so it survives even if the hover-mirroring handlers are skipped. */}
      <style>{`
        .sf-mode-card:focus-visible {
          outline: 2px solid ${GOLD};
          outline-offset: 2px;
          box-shadow: 0 0 0 4px ${GOLD_BG};
        }
      `}</style>
      {modes.map(({ id, label, desc, Icon, longDesc }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            aria-label={label}
            onClick={() => onModeChange(id)}
            className={`sf-mode-card${large ? ` mode-card-bg${active ? ' is-active' : ''}` : ''}`}
            style={{
              flex: large ? '1 1 280px' : '1 1 200px',
              maxWidth: large ? 360 : 260,
              minHeight: 44,
              padding: large ? `${SP.xxl}px ${SP.xl}px` : `${SP.xl - 2}px ${SP.lg}px`,
              ...(large
                ? { '--card-bg': backgroundImageUrl(MODE_BACKGROUNDS[id]) }
                : { background: active ? GOLD_BG : CARD }),
              border: `2px solid ${(large || active) ? GOLD : BORDER2}`,
              borderRadius: R.lg,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
              boxShadow: large ? ELEV[1] : 'none',
            }}
            onMouseOver={e => {
              if (!large) return;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = ELEV[2];
              e.currentTarget.style.borderColor = GOLD;
            }}
            onFocus={e => {
              if (!large) return;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = ELEV[2];
              e.currentTarget.style.borderColor = GOLD;
            }}
            onMouseOut={e => {
              if (!large) return;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = ELEV[1];
              e.currentTarget.style.borderColor = active ? GOLD : BORDER2;
            }}
            onBlur={e => {
              if (!large) return;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = ELEV[1];
              e.currentTarget.style.borderColor = active ? GOLD : BORDER2;
            }}
          >
            <Icon size={large ? 40 : 24} color={active ? GOLD : (large ? GOLD : MUTED)} style={{ marginBottom: large ? SP.md : 6 }} />
            <div style={{
              fontSize: large ? FS.xxl : FS.lg,
              fontWeight: 700,
              fontFamily: serif_,
              color: active ? INK : (large ? INK : SECOND),
            }}>
              {label}
            </div>
            <div style={{ fontSize: large ? FS.md : FS.sm, color: MUTED, marginTop: SP.xs }}>{desc}</div>
            {large && (
              <div style={{ fontSize: FS.sm, color: SECOND, marginTop: SP.md, lineHeight: 1.5, fontStyle: 'italic' }}>
                {longDesc}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
