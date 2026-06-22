/**
 * LivingWorldSignalRow — the self-gating living-world pip row on a Library card
 * (UX overhaul Phase 3, plan §4.2).
 *
 * Renders, from the pure `settlementSignals()` model:
 *   - siege / at-war / occupied badge   (settlementWarStatus + occupation)
 *   - faith pip                         (deity glyph + rank, alignment-colored)
 *   - disposition chip                  (aggressive / pacifist)
 *   - war-weary pip                     (war-exhaustion band)
 *   - W/L standing pip                  (dispositionStandings)
 *
 * SELF-GATING: returns NULL when `model.hasLiveWorld` is false, so a peaceful,
 * non-campaign, deity-free card shows NO pips and looks exactly as it does today.
 * The model gate composes from read-models that each return []/null when dormant.
 *
 * Pure presentational. No store, no rng, no effects.
 */

import { Swords, Shield, Flame, Landmark, Minus } from 'lucide-react';
import { SECOND, FS, SP, sans, swatch } from '../theme.js';
import { BAND_COLOR } from '../../domain/state/bands.js';

const RED = swatch['#8B1A1A'];
// War-weary + standing hues reuse the AA-vetted band steps so the war/faith
// pip text clears 4.5:1 on the card cream (the old #8a4010 / raw greens were
// un-migrated copies of values the bands already darkened).
const WAR_WEARY = BAND_COLOR.Vulnerable;  // #9a4a16, 6.05:1 — the war-scar amber
const STANDING_WIN = BAND_COLOR.Stable;   // #1a5a28
// Light text for the solid-fill crisis pip so the loudest state stays legible
// (high contrast) on its saturated red fill.
const CRISIS_TXT = swatch.white;

/**
 * One pip chip. Flattened to tint-only (no per-chip border) so the card reads as
 * one surface, not nested boxes — the tint alone carries grouping.
 *
 * `crisis` reserves the loudest treatment (a solid-fill chip with light text) for
 * the must-not-miss war/siege/occupied states, isolating the anomaly within the
 * row (Von Restorff) so it out-weighs the faith / disposition / standing pips.
 */
function Pip({ color, icon, children, title, crisis = false }) {
  return (
    <span
      title={title}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
        color: crisis ? CRISIS_TXT : color,
        background: crisis ? color : `${color}14`,
        borderRadius: 8, padding: '1px 6px', whiteSpace: 'nowrap',
      }}
    >
      {icon}{children}
    </span>
  );
}

/** Disposition glyph — a second, non-color channel so the aggression chip is
 *  distinguishable from the same-hue faith pip without relying on color alone. */
function dispositionIcon(label) {
  const belligerent = label === 'Belligerent' || label === 'Aggressive';
  return belligerent
    ? <Swords size={11} />
    : <Shield size={11} />;
}

/**
 * @param {{ model: ReturnType<typeof import('./livingWorldSignals.js').settlementSignals> }} props
 */
// Defensive name guard: a raw engine settlement id (e.g. "s-42", "deity:Sol",
// or a bare number) must NEVER render as a besieger/occupier NAME in the
// visible title. settlementSignals resolves names via the campaign's nameFor
// map, but that falls back to String(id) when the roster can't resolve the id
// (a cross-campaign deployment, a deleted neighbour). Detect an unresolved
// id-shape and substitute a neutral label so the GM reads "a rival power",
// not the engine's internal key.
const looksLikeRawId = (s) => typeof s === 'string'
  && (/^[a-z]+[:_-]/i.test(s) || /^\d+$/.test(s) || /^[0-9a-f-]{12,}$/i.test(s));
const safeName = (s) => (looksLikeRawId(s) ? 'a rival power' : s);
const safeNames = (arr) => (Array.isArray(arr) ? arr.map(safeName) : []);

export default function LivingWorldSignalRow({ model }) {
  if (!model || !model.hasLiveWorld) return null;
  const { war, faith, aggression, standing, warWeary } = model;
  // Resolve every visible besieger/occupier through the guard before it can
  // reach a title string.
  const names = {
    besiegedBy: safeNames(model.names?.besiegedBy),
    besiegingTargets: safeNames(model.names?.besiegingTargets),
  };

  return (
    <div
      data-testid="living-world-signal-row"
      style={{ display: 'flex', gap: SP.xs, flexWrap: 'wrap', alignItems: 'center' }}
    >
      {/* Siege / occupied / at-war — the must-not-miss crisis states get the
          loudest (solid-fill) pip so they lead the row, not whisper alongside it. */}
      {war?.occupied && (
        <Pip crisis color={RED} icon={<Landmark size={11} />} title={`Occupied by ${names.besiegedBy.join(', ')}`}>
          Occupied
        </Pip>
      )}
      {war && !war.occupied && war.besiegedBy.length > 0 && (
        <Pip
          crisis
          color={RED}
          icon={<Shield size={11} />}
          title={names.besiegedBy.length >= 2
            ? `Besieged by a coalition: ${names.besiegedBy.join(', ')}`
            : `Under siege by ${names.besiegedBy[0]}`}
        >
          {names.besiegedBy.length >= 2 ? `Besieged ×${war.besiegedBy.length}` : 'Under siege'}{war.fresh ? ' · new' : ''}
        </Pip>
      )}
      {war && war.besiegingTargets.length > 0 && (
        <Pip crisis color={RED} icon={<Swords size={11} />} title={`At war, besieging ${names.besiegingTargets.join(', ')}`}>
          At war{war.fresh ? ' · new' : ''}
        </Pip>
      )}

      {/* Faith pip — deity glyph + rank, alignment-colored */}
      {faith && (
        <Pip
          color={faith.color}
          icon={<span aria-hidden style={{ fontSize: FS.xs, lineHeight: 1 }}>{faith.glyph}</span>}
          title={`Primary faith: ${faith.name}${faith.rank ? ` (${faith.rank})` : ''}`}
        >
          {faith.name}{faith.rank ? ` · ${faith.rank}` : ''}
        </Pip>
      )}

      {/* Disposition / aggression chip — carries a posture glyph so it is
          distinguishable from the same-hue faith pip by shape, not color alone. */}
      {aggression && (
        <Pip color={aggression.color} icon={dispositionIcon(aggression.label)} title={`Disposition: ${aggression.label}`}>
          {aggression.label}
        </Pip>
      )}

      {/* War-weary pip */}
      {warWeary && (
        <Pip color={WAR_WEARY} icon={<Flame size={11} />} title={`War-weariness: ${warWeary.band} (${warWeary.value.toFixed(2)})`}>
          {warWeary.band}
        </Pip>
      )}

      {/* Disposition standing W/L. The even-record (score 0) case is the lone
          icon-less pip in the row, and MUTED failed AA — so it carries a neutral
          Minus glyph + SECOND (ink-800) text, matching the icon+color+label
          pattern every other pip already follows. */}
      {standing && (standing.wins > 0 || standing.losses > 0) && (
        <Pip
          color={standing.score > 0 ? STANDING_WIN : standing.score < 0 ? RED : SECOND}
          icon={standing.score === 0 ? <Minus size={11} /> : undefined}
          title={`Cross-settlement record: ${standing.wins} wins, ${standing.losses} losses (net ${standing.score > 0 ? '+' : ''}${standing.score})`}
        >
          {standing.wins}W/{standing.losses}L
        </Pip>
      )}
    </div>
  );
}
