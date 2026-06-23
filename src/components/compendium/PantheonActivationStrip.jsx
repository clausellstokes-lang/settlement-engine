/**
 * PantheonActivationStrip — teaches the dormant-until-assigned + premium model
 * for authored deities. It shows the three activation milestones a
 * homebrew pantheon passes through before it touches the simulation:
 *
 *   1. AUTHORED      — at least one deity exists in customContent.deities.
 *   2. ASSIGNED      — at least one settlement (current / saved) carries a
 *                      `config.primaryDeitySnapshot` (the embed-on-assign bridge).
 *   3. DYNAMICS ON   — at least one campaign has `religionDynamicsEnabled` in its
 *                      worldState simulation rules.
 *
 * Until all three hold, the pantheon is INERT — byte-identical to a deity-free
 * world. The strip deep-links the two actionable steps into their named
 * destinations rather than the bare Realm hub:
 *
 *   - "Assign a deity" requests the Realm Inspector's Pantheon section (where
 *     AssignDeityFromMap lives) via the one-shot `requestMapWorkspace('pantheon')`
 *     signal, then navigates to the Realm. While no deity is embedded in the
 *     active campaign world the Pantheon tab self-hides and the Inspector falls
 *     back to its Dashboard, so the GM still lands inside the Realm with context.
 *   - "Enable dynamics" requests the Realm's Simulation Rules dialog (the only
 *     surface carrying the religion-dynamics toggle) via the one-shot
 *     `requestSimulationRules()` signal, then navigates to the Realm.
 *
 * Both signals are consumed once on the Realm's mount; if a selector is absent
 * (a stubbed store in tests) the CTA degrades to a plain `navigate('realm')`.
 */

import { ArrowRight } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { navigate } from '../../hooks/useRoute.js';
import { INK, SECOND as SEC, MUTED as MUT, BORDER as BOR, CARD, FS, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

const DEITY_ACCENT = swatch['#7A5A1A'];
const OK = swatch['#1A5A28'];

/** True if a settlement record carries an embedded primary-deity snapshot. */
function hasAssignedDeity(s) {
  return !!s?.config?.primaryDeitySnapshot;
}

/**
 * Compute the three activation flags from store state. Exported pure so a test
 * can assert the strip reflects authored / assigned / enabled without rendering.
 *
 * @param {{ customContent?: any, settlement?: any, savedSettlements?: any[], campaigns?: any[] }} state
 * @returns {{ authoredCount: number, authored: boolean, assigned: boolean, dynamicsOn: boolean }}
 */
export function computePantheonActivation(state) {
  const authoredCount = Array.isArray(state?.customContent?.deities)
    ? state.customContent.deities.length : 0;

  const saved = Array.isArray(state?.savedSettlements) ? state.savedSettlements : [];
  const assigned = hasAssignedDeity(state?.settlement)
    || saved.some((entry) => hasAssignedDeity(entry?.settlement));

  const campaigns = Array.isArray(state?.campaigns) ? state.campaigns : [];
  const dynamicsOn = campaigns.some(
    (c) => c?.worldState?.simulationRules?.religionDynamicsEnabled === true,
  );

  return { authoredCount, authored: authoredCount > 0, assigned, dynamicsOn };
}

function Milestone({ on, label, detail, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0' }}>
      <span aria-hidden="true" style={{ marginTop: 1, flexShrink: 0, fontSize: FS.sm, fontWeight: 800, lineHeight: 1.4, color: on ? OK : MUT }}>
        {on ? '✓' : '○'}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: FS.sm, fontWeight: 700, color: on ? INK : MUT }}>{label}</div>
        <div style={{ fontSize: FS.xs, color: SEC, lineHeight: 1.45 }}>{detail}</div>
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
  const requestMapWorkspace = useStore((s) => s.requestMapWorkspace);
  const requestSimulationRules = useStore((s) => s.requestSimulationRules);

  const { authoredCount, authored, assigned, dynamicsOn } = computePantheonActivation({
    customContent, settlement, savedSettlements, campaigns,
  });

  // Nothing authored yet → don't crowd the lane with an inert checklist.
  if (!authored) return null;

  const live = authored && assigned && dynamicsOn;

  // Deep-link into the Pantheon section (AssignDeityFromMap), then the Realm.
  const goAssignDeity = () => {
    requestMapWorkspace?.('pantheon');
    navigate('realm');
  };
  // Deep-link into the Simulation Rules dialog (the religion-dynamics toggle), then the Realm.
  const goEnableDynamics = () => {
    requestSimulationRules?.(true);
    navigate('realm');
  };

  const linkBtn = (label, onClick) => (
    <Button
      variant="secondary" size="sm"
      icon={<ArrowRight size={11} />}
      onClick={onClick}
      style={{ flexShrink: 0, padding: '2px 8px', fontSize: FS.xxs }}
    >
      {label}
    </Button>
  );

  return (
    <div
      data-testid="pantheon-activation-strip"
      style={{
        marginBottom: 12, padding: '10px 12px', background: CARD,
        border: `1px solid ${BOR}`, borderLeft: `3px solid ${DEITY_ACCENT}`, borderRadius: 7,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: FS.xs, fontWeight: 800, color: DEITY_ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em', flex: 1 }}>
          Pantheon activation
        </span>
        <span style={{
          fontSize: FS.micro, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
          color: live ? OK : MUT, background: `${live ? OK : MUT}14`, borderRadius: 8, padding: '1px 8px',
        }}>
          {live ? 'Live' : 'Dormant'}
        </span>
      </div>

      <Milestone
        on={authored}
        label={`Authored: ${authoredCount} deit${authoredCount === 1 ? 'y' : 'ies'}`}
        detail="Your homebrew pantheon exists in the catalog."
      />
      <Milestone
        on={assigned}
        label="Assigned to a settlement"
        detail="A deity must be a settlement's primary god before it embeds and acts."
        action={linkBtn('Assign a deity', goAssignDeity)}
      />
      <Milestone
        on={dynamicsOn}
        label="Religion dynamics enabled"
        detail="Turn on the campaign rule so deities contest converts and gain seats."
        action={linkBtn('Enable dynamics', goEnableDynamics)}
      />

      {!live && (
        <div style={{ fontSize: FS.micro, color: MUT, fontStyle: 'italic', marginTop: 4, lineHeight: 1.4 }}>
          Until all three are set the pantheon is dormant, byte-identical to a deity-free world.
        </div>
      )}
    </div>
  );
}
