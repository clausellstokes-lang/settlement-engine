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
import { ChapterBand, ChapterHeadline } from '../primitives/Dense.jsx';
import { type, palette, space, pt, swatch } from '../theme.js';
import { BAND_COLOR, BAND_HINT } from '../../domain/state/bands.js';

const DIM_META = {
  resilience:       { label: 'Resilience',        higherIsBetter: true,  desc: 'Can the settlement absorb shocks?' },
  volatility:       { label: 'Volatility',        higherIsBetter: false, desc: 'How close is internal conflict?' },
  externalThreat:   { label: 'External Threat',   higherIsBetter: false, desc: 'Pressure from outside.' },
  resourcePressure: { label: 'Resource Pressure', higherIsBetter: false, desc: 'Are key materials strained?' },
};
const DIM_ORDER = ['resilience', 'volatility', 'externalThreat', 'resourcePressure'];

export function SystemStateSnapshot({ settlement, narrativeMode, vm }) {
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
        sub="Four dimensions, scored 0–100, banded for quick reads"
      />
      <ChapterHeadline tone="gold">
        How healthy and how stressed the settlement is right now.
      </ChapterHeadline>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: space.sm }}>
        {DIM_ORDER.map(key => (
          <DimensionCard key={key} dimKey={key} dim={state[key]} />
        ))}
      </View>
    </PageChrome>
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
