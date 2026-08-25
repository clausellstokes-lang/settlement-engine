/**
 * PantheonActivationStrip — teaches OUR latent-pantheon activation model for
 * authored deities (Phase 5 W-C4). It shows the four milestones a homebrew
 * pantheon passes through before it touches the simulation, on OUR architecture:
 *
 *   1. LATENT IN THE SEED — every settlement is generated with a latent pantheon
 *      baked per seed (config.latentPantheon), identical for every account; tier
 *      never touches generation. This milestone is the ground truth, not an
 *      action — it is already true the moment a settlement exists.
 *   2. AUTHORED           — at least one homebrew deity exists in
 *      customContent.deities.
 *   3. ASSIGNED / ACTIVATED — at least one settlement (current / saved) carries a
 *      `config.primaryDeitySnapshot` (the embed-on-assign bridge, or the latent
 *      seam turning the key on a premium open).
 *   4. DYNAMICS ADVANCING — the realm has advanced with faith live: a campaign's
 *      `worldState.pantheon` ledger is materialized (or religion dynamics are
 *      explicitly enabled in its simulation rules).
 *
 * Until 2–4 all hold the pantheon is DORMANT — byte-identical to a deity-free
 * world. The strip NEVER names a deity (constitutional wall: no deity names to
 * non-premium; the strip is name-free for every tier by construction, counts
 * only). Pure presentational over store state.
 */

import { ArrowRight } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { navigate } from '../../hooks/useRoute.js';
import { td } from '../../copy/deityAuthoring.js';
import { BORDER, CARD, FS, GREEN, INK, MUTED, SECOND, sans, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

const DEITY_ACCENT = swatch['#7C3AED'];

/** True if a settlement record carries an embedded primary-deity snapshot. */
function hasAssignedDeity(s) {
  return !!s?.config?.primaryDeitySnapshot;
}
/** True if a settlement record carries a latent pantheon baked into its seed. */
function hasLatentPantheon(s) {
  return !!s?.config?.latentPantheon?.patron;
}
/** True if a campaign has advanced with a materialized pantheon ledger (or has
 *  religion dynamics explicitly enabled). */
function dynamicsAdvancing(c) {
  const pantheon = c?.worldState?.pantheon;
  if (pantheon && typeof pantheon === 'object' && Object.keys(pantheon).length > 0) return true;
  return c?.worldState?.simulationRules?.religionDynamicsEnabled === true;
}

/**
 * Compute the four activation flags from store state. Exported pure so a test can
 * assert the strip reflects latent / authored / assigned / dynamics without
 * rendering. @param {{ customContent?: any, settlement?: any, savedSettlements?: any[], campaigns?: any[] }} state
 * @returns {{ authoredCount: number, latent: boolean, authored: boolean, assigned: boolean, dynamicsOn: boolean }}
 */
export function computePantheonActivation(state) {
  const authoredCount = Array.isArray(state?.customContent?.deities)
    ? state.customContent.deities.length : 0;

  const saves = Array.isArray(state?.savedSettlements) ? state.savedSettlements : [];
  const latent = hasLatentPantheon(state?.settlement)
    || saves.some((entry) => hasLatentPantheon(entry?.settlement));
  const assigned = hasAssignedDeity(state?.settlement)
    || saves.some((entry) => hasAssignedDeity(entry?.settlement));

  const campaigns = Array.isArray(state?.campaigns) ? state.campaigns : [];
  const dynamicsOn = campaigns.some(dynamicsAdvancing);

  return { authoredCount, latent, authored: authoredCount > 0, assigned, dynamicsOn };
}

function Milestone({ on, label, detail, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0' }}>
      <span aria-hidden="true" style={{ marginTop: 1, flexShrink: 0, fontSize: FS.sm, fontWeight: 800, lineHeight: 1.4, color: on ? GREEN : MUTED }}>
        {on ? '✓' : '○'}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: FS.sm, fontWeight: 700, color: on ? INK : MUTED, fontFamily: sans }}>{label}</div>
        <div style={{ fontSize: FS.xs, color: SECOND, lineHeight: 1.45, fontFamily: sans }}>{detail}</div>
      </div>
      {!on && action}
    </div>
  );
}

export default function PantheonActivationStrip() {
  const customContent = useStore((s) => s.customContent);
  const settlement = useStore((s) => s.settlement);
  const savedSettlements = useStore((s) => s.savedSettlements);
  const campaigns = useStore((s) => s.campaigns);

  const { authoredCount, latent, authored, assigned, dynamicsOn } = computePantheonActivation({
    customContent, settlement, savedSettlements, campaigns,
  });

  const live = authored && assigned && dynamicsOn;

  const linkBtn = (label, onClick) => (
    <Button
      variant="secondary"
      size="sm"
      icon={<ArrowRight size={11} />}
      onClick={onClick}
      style={{ flexShrink: 0, padding: '2px 8px', minHeight: 0, fontSize: FS.xxs, fontWeight: 800, color: DEITY_ACCENT }}
    >
      {label}
    </Button>
  );

  return (
    <div
      data-testid="pantheon-activation-strip"
      style={{
        marginBottom: 12, padding: '10px 12px', background: CARD,
        border: `1px solid ${BORDER}`, borderLeft: `3px solid ${DEITY_ACCENT}`, borderRadius: 7,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: FS.xs, fontWeight: 800, color: DEITY_ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em', flex: 1, fontFamily: sans }}>
          {td('activation.heading')}
        </span>
        <span
          data-testid="pantheon-activation-badge"
          style={{
            fontSize: FS.micro, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
            color: live ? GREEN : MUTED, background: `${live ? GREEN : MUTED}14`, borderRadius: 8, padding: '1px 8px',
          }}
        >
          {live ? td('activation.live') : td('activation.dormant')}
        </span>
      </div>

      <Milestone
        on={latent}
        label={td('activation.latentLabel')}
        detail={td('activation.latentDetail')}
      />
      <Milestone
        on={authored}
        label={`Authored: ${authoredCount} deit${authoredCount === 1 ? 'y' : 'ies'}`}
        detail={td('activation.authoredDetail')}
      />
      <Milestone
        on={assigned}
        label={td('activation.assignedLabel')}
        detail={td('activation.assignedDetail')}
        action={linkBtn('Assign', () => navigate('settlements'))}
      />
      <Milestone
        on={dynamicsOn}
        label={td('activation.dynamicsLabel')}
        detail={td('activation.dynamicsDetail')}
        action={linkBtn('Realm', () => navigate('realm'))}
      />

      {!live && (
        <div style={{ fontSize: FS.micro, color: MUTED, fontStyle: 'italic', marginTop: 4, lineHeight: 1.4, fontFamily: sans }}>
          {td('activation.dormantFoot')}
        </div>
      )}
    </div>
  );
}
