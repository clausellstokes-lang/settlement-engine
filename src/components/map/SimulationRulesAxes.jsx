import {
  infoModeOf,
  politicalAutonomyOf,
  worldProgressionOf,
} from '../../domain/worldPulse/simulationRules.js';
import { domainState } from '../../domain/worldPulse/simulationProfile.js';
import { BODY, BORDER2, CARD, FS, INK, MUTED, R, SP, sans } from '../theme.js';
import Button from '../primitives/Button.jsx';

/*
 * SimulationRulesAxes — the §11 world-law AXIS cards and the per-domain
 * tri-state rows for SimulationRulesDialog (Phase 5.5 CL-0). Split out as a
 * sibling leaf exactly like SimulationRulesDisclosure
 * so the dialog stays under the max-lines budget.
 *
 * THE COPY LAW (binding, §11): every control describes a FICTIONAL ASSUMPTION —
 * "time is frozen", "news is always accurate", "trade adjusts on its own" —
 * never an engine mechanism.
 */

// ── The five §11 axes, as world assumptions ─────────────────────────────────
// Each option: [value, label, fiction-level description, available?]. The
// locked rungs render honestly — visible, disabled, with when-it-arrives copy —
// so the dialog shows the ceiling without pretending it is built.
export const AXES = [
  {
    key: 'worldProgression',
    title: 'Time',
    question: 'Does the world move without you?',
    options: [
      ['frozen', 'Frozen', 'Time stands still. You reshape the world by hand.', true],
      ['dm_advanced', 'On your mark', 'The world changes only when you advance it.', true],
      ['living', 'Living', 'Routine life advances with time itself — the world catches up when you return.', true],
      ['autonomous', 'Autonomous', 'The realm carries its own story forward — it advances and acts on its own while you are away.', true],
    ],
  },
  {
    key: 'politicalAutonomy',
    title: 'Who decides',
    question: 'May the realm act without your approval?',
    options: [
      ['dm_only', 'Your word only', 'The world computes consequences; every new move awaits your word.', true],
      ['recommendations', 'Proposes to you', 'The realm suggests its moves and explains itself; you decide.', true],
      ['routine', 'Routine autonomy', 'Ordinary life runs itself; major turns ask you first.', true],
      ['full', 'Full autonomy', 'The realm acts on its own, major turns included.', true],
    ],
  },
  {
    // components-dossier-2: Distance is ENGINE-DERIVED, not a stored choice. On a
    // canonized realm the map routes trade/armies/news over the frozen distance
    // matrix (spatialCanonVersion is set), so this reads 'mapped' as a read-only
    // fact; before canonize it is 'ignore'. axisValue derives it — the chips are
    // non-interactive on both axes (you shape distance by canonizing a map).
    key: 'spatialMode',
    title: 'Distance',
    question: 'Does geography constrain the world?',
    derived: true,
    options: [
      ['ignore', 'Ignore distance', 'Every settlement is a neighbour — until you canonize a map for this realm.', true],
      ['abstract', 'Near and far', 'Nearby, regional, and distant matter.', false],
      ['mapped', 'Mapped geography', 'Real distances and routes over your canonized map — frozen at canonization.', false],
      ['full', 'Full terrain', 'Mountains, chokepoints, and blockades. Arrives in a later chapter.', false],
    ],
  },
  {
    key: 'travelMode',
    title: 'Travel',
    question: 'Does movement consume time?',
    derived: true,
    options: [
      ['instant', 'Instant', 'Word and armies arrive the moment they depart — until a map gives the realm real roads.', true],
      ['compressed', 'Swift', 'A continent crosses in a week.', false],
      ['standard', 'Standard', 'Word and armies travel the real road network — news and caravans arrive late over distance.', false],
      ['slow', 'Slow', 'A continent crosses in a season. Arrives in a later chapter.', false],
    ],
  },
  {
    // STEP 3.5: the middle rungs are LIVE. On a realm without a canonized map
    // the choice is stored and waits (word needs roads to travel); on a
    // canonized realm the trade roads carry — and, on Unreliable, twist — it.
    key: 'infoMode',
    title: 'News',
    question: 'Is knowledge of the world complete?',
    options: [
      ['omniscient', 'All-knowing', 'Everyone knows the true state of the world.', true],
      ['perfect_delayed', 'Accurate but slow', 'News is true but travels by road — a mapped realm learns of distant events late.', true],
      ['unreliable', 'Unreliable', 'News travels and twists: distance breeds rumor, error, and echo. A mapped realm hears the world as its roads tell it.', true],
      ['full', 'Rumor and lies', 'Carriers, distortion, and silence. Arrives in a later chapter.', false],
    ],
  },
];

// Effective axis read over a draft whose profile may still be VIRTUAL (an
// untouched campaign carries no profile keys until an axis is touched).
//
// Distance/Travel are ENGINE-DERIVED read-only facts (components-dossier-2), not
// stored rule values: `spatialMapped` is true once the realm has been canonized
// (worldState.spatialCanonVersion set), at which point the map routes trade/
// armies/news over the frozen distance matrix with hop-week latency — so Distance
// reads 'mapped' and Travel 'standard'. Before canonize they are 'ignore'/'instant'.
export function axisValue(draft, key, spatialMapped = false) {
  if (key === 'worldProgression') return worldProgressionOf(draft);
  if (key === 'politicalAutonomy') return politicalAutonomyOf(draft);
  if (key === 'spatialMode') return spatialMapped ? 'mapped' : 'ignore';
  if (key === 'travelMode') return spatialMapped ? 'standard' : 'instant';
  return infoModeOf(draft);
}

// ── The per-domain tri-state rows (§11 domain modules) ──────────────────────
// Off = the world holds this still. 'By your leave' (dm) = it moves only as
// proposals you approve. 'On its own' (auto) = the engine may initiate.
const DOMAIN_ROWS = [
  ['diplomacy', 'Diplomacy', 'Ties between settlements — alliances, rivalries, vassalage.'],
  ['trade', 'Trade', 'Trade relationships form, shift, and fail.'],
  ['migration', 'Migration', 'People move between settlements.'],
  ['religion', 'Faith spread', 'Creeds cross borders along trade, alliance, and war ties.'],
  ['war', 'War', 'Armies march, sieges form, conquests change rulers.'],
  ['strategy', 'Ambition', 'Settlements choose to defend, deploy, or sue for peace.'],
  ['seasons', 'Seasons', 'The turning year: harvests fill the granaries, winter draws them down.'],
];

const DOMAIN_STATE_LABELS = { off: 'Off', dm: 'By your leave', auto: 'On its own' };

const DRIFT_REASON = 'Needs Diplomacy: war is a relationship dynamic, so a frozen web cannot raise fronts.';
const WAR_DM_DEFERRED = 'War by-your-leave arrives with the war-layer rework. Off still lets you narrate wars yourself; the engine just never starts one.';
const SEASONS_DM = 'The year turns of its own accord — there is no leave to ask of winter.';
const DM_STATE_GLOBAL = 'Approval is realm-wide today: set “Who decides” to “Your word only” or “Proposes to you”. Per-domain approval arrives in a later chapter.';

// One selectable world-assumption chip inside an axis card or domain row.
// Built on the Button primitive (focus ring, disabled state, target size);
// 'gold' variant marks the selected assumption.
export function OptionChip({ label, selected, disabled, reason, onSelect, testId }) {
  return (
    <Button
      size="sm"
      variant={selected ? 'gold' : 'secondary'}
      data-testid={testId}
      aria-pressed={selected}
      disabled={disabled}
      title={reason}
      onClick={onSelect}
      style={{
        minHeight: 28,
        padding: '5px 10px',
        fontSize: FS.xxs,
        fontWeight: 900,
        ...(disabled && !selected ? { color: MUTED, opacity: 0.6 } : null),
      }}
    >
      {label}
    </Button>
  );
}

/**
 * The five world-law axis cards. Two live axes (Time, Who decides); three
 * rendered-but-locked (Distance, Travel, News) with honest fiction-level copy.
 * While frozen, the autonomy card is presentation-gated by the
 * frozen_world_pauses_autonomy law (settings preserved; wakes on unfreeze).
 */
export function WorldLawAxes({ draft, advanceBlocked, frozenAutonomyLaw, onSetField, spatialMapped = false }) {
  const frozen = worldProgressionOf(draft) === 'frozen';
  return (
    <div style={{ display: 'grid', gap: SP.sm }}>
      <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
        World laws
      </div>
      {AXES.map(axis => {
        const value = axisValue(draft, axis.key, spatialMapped);
        const axisLocked = axis.key === 'politicalAutonomy' && frozen;
        // Distance/Travel are engine-derived facts, never a click: the map sets them.
        const derivedNote = axis.derived
          ? (spatialMapped
            ? 'Set by your canonized realm map — the world reckons real distance.'
            : 'Set once you canonize a map for this realm. Until then, distance is ignored.')
          : null;
        const selectedOption = axis.options.find(([optionValue]) => optionValue === value);
        return (
          <div
            key={axis.key}
            data-testid={`axis-${axis.key}`}
            style={{
              display: 'grid',
              gap: 6,
              padding: SP.sm,
              border: `1px solid ${BORDER2}`,
              borderRadius: R.md,
              background: CARD,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, flexWrap: 'wrap' }}>
              <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 950 }}>
                {axis.title}
              </span>
              <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750 }}>
                {axis.question}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {axis.options.map(([optionValue, label, description, available]) => (
                <OptionChip
                  key={optionValue}
                  testId={`axis-${axis.key}-${optionValue}`}
                  label={label}
                  selected={optionValue === value}
                  disabled={axis.derived || !available || axisLocked || advanceBlocked}
                  reason={!available
                    ? description
                    : axisLocked
                      ? frozenAutonomyLaw?.message
                      : description}
                  onSelect={() => {
                    if (axis.derived || !available || axisLocked || advanceBlocked) return;
                    onSetField(axis.key, optionValue);
                  }}
                />
              ))}
            </div>
            <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750, lineHeight: 1.4 }}>
              {axisLocked && frozenAutonomyLaw
                ? frozenAutonomyLaw.message
                : selectedOption?.[2]}
            </div>
            {derivedNote && (
              <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, lineHeight: 1.4, fontStyle: 'italic' }}>
                {derivedNote}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * The per-domain tri-state rows over the existing boolean storage. Off and
 * On-its-own are live; the By-your-leave middle reflects the GLOBAL autonomy
 * axis (per-domain approval is a later seam), and the war row's middle is
 * honestly deferred to the war-layer initiate/resolve split.
 */
export function DomainRows({ draft, advanceBlocked, onSetDomain }) {
  return (
    <div style={{ display: 'grid', gap: SP.sm }}>
      <div style={{ display: 'grid', gap: 2 }}>
        <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
          What moves on its own
        </div>
        <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750, lineHeight: 1.4 }}>
          Off holds a domain still (you can always introduce it yourself). On its own lets the world initiate. Turning a domain off never deletes anything.
        </div>
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        {DOMAIN_ROWS.map(([domain, label, description]) => {
          const state = domainState(draft, domain);
          const warRow = domain === 'war';
          const warBlocked = (domain === 'war' || domain === 'strategy') && draft.relationshipDynamicsEnabled !== true;
          const strategyForced = domain === 'strategy' && draft.warLayerEnabled === true;
          const rowDisabled = advanceBlocked || warBlocked || strategyForced;
          return (
            <div
              key={domain}
              data-testid={`domain-${domain}`}
              title={warBlocked ? DRIFT_REASON : strategyForced ? 'Locked on while War runs: a warring realm chooses its own posture.' : description}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: SP.sm,
                flexWrap: 'wrap',
                padding: '6px 10px',
                border: `1px solid ${BORDER2}`,
                borderRadius: R.md,
                background: CARD,
                opacity: warBlocked ? 0.7 : 1,
              }}
            >
              <div style={{ minWidth: 90, flex: '1 1 120px' }}>
                <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 950 }}>{label}</div>
                <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750 }}>{description}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <OptionChip
                  testId={`domain-${domain}-off`}
                  label={DOMAIN_STATE_LABELS.off}
                  selected={state === 'off'}
                  disabled={rowDisabled}
                  reason={warBlocked ? DRIFT_REASON : undefined}
                  onSelect={() => { if (!rowDisabled) onSetDomain(domain, false); }}
                />
                <OptionChip
                  testId={`domain-${domain}-dm`}
                  label={DOMAIN_STATE_LABELS.dm}
                  selected={state === 'dm'}
                  disabled
                  reason={warRow ? WAR_DM_DEFERRED : domain === 'seasons' ? SEASONS_DM : DM_STATE_GLOBAL}
                  onSelect={() => {}}
                />
                <OptionChip
                  testId={`domain-${domain}-auto`}
                  label={DOMAIN_STATE_LABELS.auto}
                  selected={state === 'auto'}
                  disabled={rowDisabled}
                  reason={warBlocked ? DRIFT_REASON : undefined}
                  onSelect={() => { if (!rowDisabled) onSetDomain(domain, true); }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
