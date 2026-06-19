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

import { Swords, Shield, Flame, Landmark } from 'lucide-react';
import { MUTED, FS, sans, swatch } from '../theme.js';

const RED = swatch['#8B1A1A'];

/** One pip chip. */
function Pip({ color, icon, children, title }) {
  return (
    <span
      title={title}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        fontSize: FS.micro, fontWeight: 700, fontFamily: sans,
        color, background: `${color}14`, border: `1px solid ${color}40`,
        borderRadius: 8, padding: '1px 6px', whiteSpace: 'nowrap',
      }}
    >
      {icon}{children}
    </span>
  );
}

/**
 * @param {{ model: ReturnType<typeof import('./livingWorldSignals.js').settlementSignals> }} props
 */
export default function LivingWorldSignalRow({ model }) {
  if (!model || !model.hasLiveWorld) return null;
  const { war, faith, aggression, standing, warWeary, names } = model;

  return (
    <div
      data-testid="living-world-signal-row"
      style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4, alignItems: 'center' }}
    >
      {/* Siege / occupied / at-war */}
      {war?.occupied && (
        <Pip color={RED} icon={<Landmark size={9} />} title={`Occupied by ${names.besiegedBy.join(', ')}`}>
          Occupied
        </Pip>
      )}
      {war && !war.occupied && war.besiegedBy.length > 0 && (
        <Pip
          color={RED}
          icon={<Shield size={9} />}
          title={names.besiegedBy.length >= 2
            ? `Besieged by a coalition: ${names.besiegedBy.join(', ')}`
            : `Under siege by ${names.besiegedBy[0]}`}
        >
          {names.besiegedBy.length >= 2 ? `Besieged ×${war.besiegedBy.length}` : 'Under siege'}
        </Pip>
      )}
      {war && war.besiegingTargets.length > 0 && (
        <Pip color={RED} icon={<Swords size={9} />} title={`At war — besieging ${names.besiegingTargets.join(', ')}`}>
          At war
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

      {/* Disposition / aggression chip */}
      {aggression && (
        <Pip color={aggression.color} title={`Disposition: ${aggression.label}`}>
          {aggression.label}
        </Pip>
      )}

      {/* War-weary pip */}
      {warWeary && (
        <Pip color="#8a4010" icon={<Flame size={9} />} title={`War-weariness: ${warWeary.band} (${warWeary.value.toFixed(2)})`}>
          {warWeary.band}
        </Pip>
      )}

      {/* Disposition standing W/L */}
      {standing && (standing.wins > 0 || standing.losses > 0) && (
        <Pip
          color={standing.score > 0 ? '#1a5a28' : standing.score < 0 ? RED : MUTED}
          title={`Cross-settlement record: ${standing.wins} wins, ${standing.losses} losses (net ${standing.score > 0 ? '+' : ''}${standing.score})`}
        >
          {standing.wins}W/{standing.losses}L
        </Pip>
      )}
    </div>
  );
}
