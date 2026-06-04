/**
 * primitives/CausalViewTabs - Tier 5.7 surface.
 *
 * Tabbed view-switcher that renders the same settlement through any
 * of seven causal lenses. The dossier is one set of facts; this
 * primitive lets the DM see them through whichever filter best fits
 * the question they're answering right now.
 *
 *   Narrative     simulation spine + daily-life
 *   Simulation    substrate + capacities (the structural read)
 *   Delta         recent event-log / regen deltas
 *   Faction       faction profiles + relationships
 *   Supply chain  chain states + dependencies
 *   Timeline      history beats + clocks + tensions
 *   District      per-district profiles
 *
 * Consumes domain/causalViews.js#deriveCausalView. Lazy per-tab
 * derivation: the active view is the only one computed, so flipping
 * tabs costs one derivation pass per switch (cheap; results are
 * memoised in useMemo until the settlement changes).
 *
 * Pure presentational. Parent owns the settlement; this component
 * owns only the active-tab state.
 */

import { useMemo, useState } from 'react';
import { FS, swatch } from '../theme.js';
import { deriveCausalView, CAUSAL_VIEWS } from '../../domain/causalViews.js';

const COLORS = Object.freeze({
  bg:        '#fffbf5',
  border:    '#d2bd96',
  ink:       '#1c1409',
  muted:     '#9c8068',
  active:    '#a0762a',
  activeBg:  'rgba(160,118,42,0.12)',
});

const VIEW_LABELS = Object.freeze({
  narrative:    'Narrative',
  simulation:   'Simulation',
  delta:        'Delta',
  faction:      'Faction',
  supply_chain: 'Supply chain',
  timeline:     'Timeline',
  district:     'District',
});

const VIEW_DESCRIPTIONS = Object.freeze({
  narrative:    'Prose-level read: the spine that drives the settlement plus daily-life slots.',
  simulation:   'Structural read: substrate variables and capacity bands.',
  delta:        'What changed recently: events applied and regenerations run.',
  faction:      'Political read: faction profiles + their interlock.',
  supply_chain: 'Material read: supply chains, dependencies, controllers.',
  timeline:     'Historical + future read: founding beats and escalation clocks.',
  district:     'Spatial read: per-district sensory profiles.',
});

export function CausalViewTabs({ settlement, defaultView = 'narrative', onViewChange }) {
  const [view, setView] = useState(defaultView);

  const derived = useMemo(() => {
    if (!settlement) return null;
    if (!CAUSAL_VIEWS.includes(view)) return null;
    try {
      return deriveCausalView(settlement, view);
    } catch (e) {
      console.warn(`[CausalViewTabs] deriveCausalView(${view}) failed`, e);
      return null;
    }
  }, [settlement, view]);

  const handleChange = (next) => {
    setView(next);
    if (typeof onViewChange === 'function') onViewChange(next);
  };

  if (!settlement) {
    return (
      <div style={{
        padding: 12,
        background: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 6,
        color: COLORS.muted,
        fontStyle: 'italic',
        fontFamily: 'Nunito, sans-serif',
      }}>
        No settlement loaded.
      </div>
    );
  }

  return (
    <div
      style={{
        background: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 6,
        overflow: 'hidden',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      {/* Tab strip */}
      <div
        role="tablist"
        aria-label="Causal views"
        style={{
          display: 'flex', gap: 0,
          overflowX: 'auto',
          borderBottom: `1px solid ${COLORS.border}`,
          background: swatch['#FAF6EE'],
        }}
      >
        {CAUSAL_VIEWS.map(v => {
          const active = v === view;
          return (
            <button
              key={v}
              role="tab"
              aria-selected={active}
              aria-controls={`causal-view-panel-${v}`}
              id={`causal-view-tab-${v}`}
              tabIndex={active ? 0 : -1}
              onClick={() => handleChange(v)}
              style={{
                padding: '8px 14px',
                background: active ? COLORS.activeBg : 'transparent',
                color: active ? COLORS.active : COLORS.muted,
                border: 'none',
                borderBottom: active ? `2px solid ${COLORS.active}` : '2px solid transparent',
                fontSize: FS['11.5'], fontWeight: active ? 800 : 600,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {VIEW_LABELS[v] || v}
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div
        role="tabpanel"
        id={`causal-view-panel-${view}`}
        aria-labelledby={`causal-view-tab-${view}`}
        style={{ padding: '10px 14px' }}
      >
        {/* Caption */}
        <div style={{
          fontSize: FS.xs, color: COLORS.muted, lineHeight: 1.5,
          marginBottom: 8,
          fontStyle: 'italic',
        }}>
          {VIEW_DESCRIPTIONS[view]}
        </div>

        {/* Body */}
        <ViewBody view={view} derived={derived} />
      </div>
    </div>
  );
}

function ViewBody({ view, derived }) {
  if (!derived) {
    return (
      <div style={{ fontSize: FS.xs, color: COLORS.muted, fontStyle: 'italic' }}>
        View unavailable for this settlement.
      </div>
    );
  }

  // Summary lines: every view ships with these. Render once at top.
  const summary = Array.isArray(derived.summary) ? derived.summary : [];

  return (
    <>
      {summary.length > 0 && (
        <ul style={{
          listStyle: 'none', margin: 0, padding: 0,
          marginBottom: 10,
        }}>
          {summary.map((line, i) => (
            <li key={i} style={{
              fontSize: FS.sm, color: COLORS.ink, lineHeight: 1.5,
              padding: '3px 0',
              borderBottom: i === summary.length - 1 ? 'none' : '1px dashed rgba(210,189,150,0.5)',
            }}>
              <span style={{ color: COLORS.muted, marginRight: 5 }}>·</span>
              {line}
            </li>
          ))}
        </ul>
      )}

      {/* Per-view structured surface */}
      {view === 'narrative'    && <NarrativeView derived={derived} />}
      {view === 'simulation'   && <SimulationView derived={derived} />}
      {view === 'delta'        && <DeltaView derived={derived} />}
      {view === 'faction'      && <FactionView derived={derived} />}
      {view === 'supply_chain' && <SupplyChainView derived={derived} />}
      {view === 'timeline'     && <TimelineView derived={derived} />}
      {view === 'district'     && <DistrictView derived={derived} />}
    </>
  );
}

// deriveCausalView returns { view, title, entries, summary } where
// `entries` is the inner per-view object. The view-body functions
// drill into derived.entries.<field>.

function NarrativeView({ derived }) {
  const slots = derived.entries?.dailyLife || [];
  return (
    <div>
      {Array.isArray(slots) && slots.length > 0 && (
        <Section title="Daily-life slots">
          {slots.map((slot, i) => (
            <KeyValRow key={i}
              k={slot.slot || slot.id || `slot ${i + 1}`}
              v={slot.label || slot.summary || ''}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

function SimulationView({ derived }) {
  const subBands = derived.entries?.substrate?.bands || {};
  const capBands = derived.entries?.capacities?.bands || {};
  return (
    <>
      <Section title="Substrate variables">
        {Object.entries(subBands).map(([k, b]) => (
          <KeyValRow key={k} k={k} v={String(b)} />
        ))}
      </Section>
      <Section title="Capacities">
        {Object.entries(capBands).map(([k, b]) => (
          <KeyValRow key={k} k={k} v={String(b)} />
        ))}
      </Section>
    </>
  );
}

function DeltaView({ derived }) {
  const events = Array.isArray(derived.entries?.eventLog) ? derived.entries.eventLog : [];
  return (
    <Section title="Recent changes">
      {events.length === 0
        ? <Empty text="No recent changes recorded." />
        : events.map((e, i) => (
            <KeyValRow key={i}
              k={e.event?.type || e.label || `change ${i + 1}`}
              v={e.narrativeSummary || e.detail || ''}
            />
          ))}
    </Section>
  );
}

function FactionView({ derived }) {
  const factions = Array.isArray(derived.entries?.factions) ? derived.entries.factions : [];
  return (
    <Section title="Factions">
      {factions.length === 0
        ? <Empty text="No factions in this settlement." />
        : factions.map((f, i) => (
            <KeyValRow key={i}
              k={f.name || f.faction || `faction ${i + 1}`}
              v={f.archetype || f.power || ''}
            />
          ))}
    </Section>
  );
}

function SupplyChainView({ derived }) {
  const chains = Array.isArray(derived.entries?.chains) ? derived.entries.chains : [];
  return (
    <Section title="Supply chains">
      {chains.length === 0
        ? <Empty text="No supply chains active." />
        : chains.map((c, i) => (
            <KeyValRow key={i}
              k={c.name || c.resource || `chain ${i + 1}`}
              v={c.status || ''}
            />
          ))}
    </Section>
  );
}

function TimelineView({ derived }) {
  // historyBeats is a { key: beat } map; escalationClocks is an array.
  const beats = derived.entries?.historyBeats || {};
  const clocks = Array.isArray(derived.entries?.escalationClocks) ? derived.entries.escalationClocks : [];
  const beatEntries = Object.entries(beats).filter(([, b]) => b);
  return (
    <>
      <Section title="History beats">
        {beatEntries.length === 0
          ? <Empty text="No history beats." />
          : beatEntries.map(([key, beat]) => (
              <KeyValRow key={key}
                k={beat.label || key}
                v={beat.text || ''}
              />
            ))}
      </Section>
      {clocks.length > 0 && (
        <Section title="Escalation clocks">
          {clocks.map((c, i) => (
            <KeyValRow key={i}
              k={c.label || `clock ${i + 1}`}
              v={c.triggerDescription || ''}
            />
          ))}
        </Section>
      )}
    </>
  );
}

function DistrictView({ derived }) {
  const districts = Array.isArray(derived.entries?.districts) ? derived.entries.districts : [];
  return (
    <Section title="Districts">
      {districts.length === 0
        ? <Empty text="No district profiles." />
        : districts.map((d, i) => (
            <KeyValRow key={i}
              k={d.name || d.id || `district ${i + 1}`}
              v={d.wealth || d.summary || ''}
            />
          ))}
    </Section>
  );
}

// ── Shared inner primitives ─────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 10 }}>
      <h4 style={{
        margin: '6px 0 4px',
        fontSize: FS.xxs, fontWeight: 800, letterSpacing: '0.05em',
        textTransform: 'uppercase', color: COLORS.muted,
      }}>
        {title}
      </h4>
      <div>{children}</div>
    </section>
  );
}

function KeyValRow({ k, v }) {
  if (k == null) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 10,
      padding: '3px 0',
      fontSize: FS['11.5'], lineHeight: 1.4,
      borderBottom: '1px dotted rgba(210,189,150,0.4)',
    }}>
      <span style={{ flexBasis: '40%', color: COLORS.ink, fontWeight: 700 }}>{String(k)}</span>
      <span style={{ flex: 1, color: COLORS.muted }}>{String(v)}</span>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={{ fontSize: FS.xs, color: COLORS.muted, fontStyle: 'italic', padding: '4px 0' }}>
      {text}
    </div>
  );
}

export default CausalViewTabs;
