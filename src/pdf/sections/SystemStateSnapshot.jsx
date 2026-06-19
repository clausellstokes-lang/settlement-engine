/**
 * SystemStateSnapshot — PDF chapter showing the four-dimension state.
 *
 * Renders in both draft and canon PDFs. In draft, it's a "current state
 * of the design" snapshot. In canon, it's "where the settlement stands
 * right now in the campaign" — paired with the Timeline chapter so the
 * DM has both the current pressures and the recent history at hand.
 *
 * Bands and colors come from domain/state/bands.js — same source as the
 * UI's SystemStateBar — so the PDF and screen never disagree.
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { ChapterBand, ChapterHeadline, HairRule } from '../primitives/Dense.jsx';
import { type, palette, space, pt, swatch } from '../theme.js';
import { BAND_COLOR, BAND_HINT } from '../../domain/state/bands.js';
import { deriveCausalState, SYSTEM_VARIABLES } from '../../domain/causalState.js';
import { humanize } from '../lib/format.js';

// Substrate band → tone color. Mirrors the screen's causal band coloring
// (surplus/adequate green-ish, strained/critical/collapsed warm→red) so the
// PDF and screen never disagree on what a band means.
const CAUSAL_BAND_COLOR = {
  surplus:   palette.good,
  adequate:  palette.muted,
  strained:  palette.warn,
  critical:  palette.bad,
  collapsed: palette.bad,
};
// Polarity-aware ordering: float the pressured bands (collapsed/critical/
// strained) to the top, the same "pressuresOn first" sort the dossier uses.
const BAND_RANK = { collapsed: 0, critical: 1, strained: 2, adequate: 3, surplus: 4 };

const DIM_META = {
  resilience:       { label: 'Resilience',        higherIsBetter: true,  desc: 'Can the settlement absorb shocks?' },
  volatility:       { label: 'Volatility',        higherIsBetter: false, desc: 'How close is internal conflict?' },
  externalThreat:   { label: 'External Threat',   higherIsBetter: false, desc: 'Pressure from outside.' },
  resourcePressure: { label: 'Resource Pressure', higherIsBetter: false, desc: 'Are key materials strained?' },
};
const DIM_ORDER = ['resilience', 'volatility', 'externalThreat', 'resourcePressure'];

export function SystemStateSnapshot({ settlement, narrativeMode, vm, causalDetail = false }) {
  const state = vm?.systemState;
  if (!state) {
    // No SystemState (e.g. legacy save) — render the chapter shell with
    // a polite explanatory note rather than failing the whole PDF.
    return (
      <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
        <ChapterBand
          eyebrow="03B"
          title="Current State"
          accent={narrativeMode ? palette.ai : palette.gold}
        />
        <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
          State snapshot unavailable for this settlement (load and re-save to populate).
        </Text>
      </PageChrome>
    );
  }

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="03B"
        title="Current State"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub="Four dimensions, scored 0-100, banded for quick reads"
      />
      <ChapterHeadline tone="gold">
        How healthy and how stressed the settlement is right now.
      </ChapterHeadline>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: space.sm }}>
        {DIM_ORDER.map(key => (
          <DimensionCard key={key} dimKey={key} dim={state[key]} />
        ))}
      </View>

      {/* ── Optional causal substrate (Engine altitude / Campaign State) ──── */}
      {/* Default (4-dim) export NEVER reaches this — the 4-dim output above is
          byte-identical. Only the Campaign State variant passes causalDetail. */}
      {causalDetail && <CausalSubstrate settlement={settlement} vm={vm} />}
    </PageChrome>
  );
}

/**
 * The 15-variable causal substrate grid — band-pill per variable with the
 * top "why" contributor, pressured bands first. Reads deriveCausalState (the
 * SAME 15-var substrate the screen's Substrate sub-tab uses) so the printed
 * grid and the screen agree.
 */
function CausalSubstrate({ settlement, vm }) {
  const causal = deriveCausalState(vm?.active || settlement);
  const rows = SYSTEM_VARIABLES
    .map(name => {
      const v = causal.variables[name] || {};
      const top = (v.contributors || []).find(c => c?.reason)?.reason || null;
      return { name, band: v.band || 'adequate', score: v.score ?? 50, why: top };
    })
    .sort((a, b) => (BAND_RANK[a.band] ?? 5) - (BAND_RANK[b.band] ?? 5));

  return (
    <View style={{ marginTop: space.md }} wrap={false}>
      <HairRule />
      <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
        CAUSAL SUBSTRATE — 15 VARIABLES
      </Text>
      <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['7.5'], fontStyle: 'italic', marginBottom: 4 }}>
        The deterministic engine substrate, banded; strained / critical / collapsed float to the top.
      </Text>
      {rows.map(row => {
        const color = CAUSAL_BAND_COLOR[row.band] || palette.muted;
        return (
          <View key={row.name} style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
            <Text style={{ ...type.body, fontSize: pt['8'], color: palette.ink, width: 150 }}>
              {humanize(row.name)}
            </Text>
            <Text style={{ ...type.label_em, fontSize: pt['7.5'], color, width: 60, letterSpacing: 0.4 }}>
              {row.band.toUpperCase()}
            </Text>
            <Text style={{ ...type.caption, fontSize: pt['7'], color: palette.faint, width: 22 }}>{row.score}</Text>
            {row.why && (
              <Text style={{ ...type.caption, fontSize: pt['7'], color: palette.muted, flex: 1, lineHeight: 1.3 }}>
                {row.why}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

function DimensionCard({ dimKey, dim }) {
  const meta = DIM_META[dimKey];
  if (!dim || !meta) return null;
  const color = BAND_COLOR[dim.band] || palette.muted;
  const fillPct = meta.higherIsBetter ? dim.value : (100 - dim.value);

  return (
    <View
      wrap={false}
      style={{
        width: '50%',
        padding: 6,
      }}
    >
      <View style={{
        padding: 6,
        border: `0.4pt solid ${palette.border}`,
        borderLeft: `2.5pt solid ${color}`,
        borderRadius: 2,
        backgroundColor: palette.card,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
          <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'] }}>
            {meta.label}
          </Text>
          <Text style={{ flex: 1 }} />
          <Text style={{ ...type.label_em, color, fontSize: pt['9'], letterSpacing: 0.6 }}>
            {dim.band.toUpperCase()}
          </Text>
          <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'], marginLeft: 4 }}>
            {dim.value}
          </Text>
        </View>
        {/* Bar */}
        <View style={{ height: 3, backgroundColor: swatch['#E7D7B8'], marginBottom: 4 }}>
          <View style={{ width: `${fillPct}%`, height: '100%', backgroundColor: color }} />
        </View>
        <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['7.5'], fontStyle: 'italic', marginBottom: 3 }}>
          {meta.desc} {BAND_HINT[dim.band]}
        </Text>
        {dim.drivers?.length > 0 && (
          <View style={{ marginBottom: 2 }}>
            <Text style={{ ...type.label, color: palette.gold, fontSize: pt['7'] }}>DRIVERS</Text>
            {dim.drivers.slice(0, 3).map((d, i) => (
              <Text key={i} style={{ ...type.body, fontSize: pt['7.5'], color: palette.ink, lineHeight: 1.4 }}>
                • {d}
              </Text>
            ))}
          </View>
        )}
        {dim.risks?.length > 0 && (
          <View>
            <Text style={{ ...type.label, color: palette.bad, fontSize: pt['7'] }}>RISKS</Text>
            {dim.risks.slice(0, 3).map((r, i) => (
              <Text key={i} style={{ ...type.body, fontSize: pt['7.5'], color: palette.ink, lineHeight: 1.4 }}>
                • {r}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export default SystemStateSnapshot;
