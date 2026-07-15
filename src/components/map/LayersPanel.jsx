/**
 * LayersPanel — right-side sidebar listing every overlay layer with a
 * checkbox toggle and, where applicable, a filter sub-list. The panel is the
 * single place to control every live map layer, so each layer MapOverlay gates
 * has a toggle here (the prior gap: forests, war/faith, and biomes rendered but
 * were unreachable from this panel).
 *
 * Map layers (the campaign-facing overlays):
 *   - Settlements
 *   - Relationships (with per-type filter)
 *   - Roads
 *   - Supply chains
 *   - Regional channels (with per-channel filter)
 *   - Regional impacts (with status filter + severity floor)
 *   - War & faith (deployment, siege, and occupation glyphs)
 *   - GM regional channels (reveal gm-only channels)
 *
 * Map features (decorative / native-map reference):
 *   - Labels, Markers, Forests
 *   - State borders, Culture regions, Biomes
 *
 * Biomes also has a contextual toggle in the Terrain toolbar (same layer key);
 * both stay in sync because they flip the one mapState.layers.nativeBiomes flag.
 */

import { X, Check } from 'lucide-react';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { useStore } from '../../store';
import { GOLD, INK, BODY, SECOND, BORDER2, CARD_HDR, sans, FS, SP, R, swatch } from '../theme.js';
import { REGIONAL_CHANNEL_TYPES } from '../../domain/region/index.js';
import { regionalChannelColor, regionalImpactColor } from '../../lib/regionalMapOverlay.js';
// The relationship-type list (id + label + color) is shared with RoutesToolbar
// and MapLegend so the chips here, the Routes-mode chips, and the legend rows
// never disagree on a name or a hue (P11). One list, one source.
import { REL_TYPES } from './relationshipEdgeStyle.js';

const REGIONAL_IMPACT_STATUS_FILTERS = ['queued', 'applied', 'resolved', 'ignored', 'expired'];
const DEFAULT_REGIONAL_IMPACT_FILTER = ['queued', 'applied', 'resolved'];

function human(value) {
  return String(value || '').replace(/_/g, ' ');
}

export default function LayersPanel({ onClose }) {
  const layers         = useStore(s => s.mapState.layers);
  const toggleLayer    = useStore(s => s.toggleLayer);
  const setLayerFilter = useStore(s => s.setLayerFilter);

  const relFilter = new Set(Array.isArray(layers.relationshipFilter) ? layers.relationshipFilter : []);
  const regionalChannelFilter = new Set(
    Array.isArray(layers.regionalChannelFilter) && layers.regionalChannelFilter.length
      ? layers.regionalChannelFilter
      : REGIONAL_CHANNEL_TYPES
  );
  const regionalImpactFilter = new Set(
    Array.isArray(layers.regionalImpactStatusFilter) && layers.regionalImpactStatusFilter.length
      ? layers.regionalImpactStatusFilter
      : DEFAULT_REGIONAL_IMPACT_FILTER
  );
  const regionalMinSeverity = Number.isFinite(layers.regionalMinSeverity)
    ? layers.regionalMinSeverity
    : 0;

  function toggleRelType(type) {
    const next = new Set(relFilter);
    if (next.has(type)) next.delete(type); else next.add(type);
    setLayerFilter('relationshipFilter', Array.from(next));
  }

  // An empty relationshipFilter [] means "draw NONE" to RelationshipEdges, so
  // deselecting the last chip silently blanks the layer while its toggle still
  // reads on (P8). An explicit All/None reset — the same affordance RoutesToolbar
  // carries — gives the GM a one-click way back, so the state always has a clear
  // meaning and the dead "everything off but on" trap is escapable.
  const allRelsOn = relFilter.size === REL_TYPES.length;
  function resetRelTypes() {
    setLayerFilter('relationshipFilter', allRelsOn ? [] : REL_TYPES.map(t => t.id));
  }

  function toggleRegionalChannelType(type) {
    const next = new Set(regionalChannelFilter);
    if (next.has(type)) next.delete(type); else next.add(type);
    setLayerFilter(
      'regionalChannelFilter',
      next.size === REGIONAL_CHANNEL_TYPES.length ? null : Array.from(next),
    );
  }

  function toggleRegionalImpactStatus(status) {
    const next = new Set(regionalImpactFilter);
    if (next.has(status)) next.delete(status); else next.add(status);
    setLayerFilter('regionalImpactStatusFilter', Array.from(next));
  }

  return (
    // Pure content: the framed-column shell (width/border/radius/overflow) is
    // owned by the Stage's shared SidebarShell — the SAME owner as the left
    // palette — so the two flanking sidebars are framed by one systematic recipe
    // instead of each self-framing with a duplicated literal (P5).
    <div style={{
      minHeight: 0, height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header — a tint carries the chrome grouping; no drawn rule (P5). */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `${SP.sm}px ${SP.md}px`,
        background: CARD_HDR,
      }}>
        <div style={{
          fontSize: FS.xs, fontWeight: 800, color: SECOND,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          Layers
        </div>
        <IconButton
          Icon={X}
          label="Close"
          onClick={onClose}
          tone="ghost"
          size="md"
        />
      </div>

      {/* Layer list. Two spacing-led clusters (P5/P6): the content layers a GM
          actually runs lead under "Map layers"; the decorative/reference toggles
          fall to a quieter "Map features" cluster below. Whitespace (a large
          marginTop on the second subhead), not a drawn hairline, separates them. */}
      <div style={{ flex: 1, overflowY: 'auto', padding: SP.sm }}>
        <Subhead>Map layers</Subhead>
        <LayerToggle
          label="Settlements"
          checked={layers.placements !== false}
          onChange={() => toggleLayer('placements')}
        />
        <LayerToggle
          label="Relationships"
          checked={!!layers.relationships}
          onChange={() => toggleLayer('relationships')}
        />
        {layers.relationships && (
          <ChipGroup>
            {REL_TYPES.map(t => (
              <FilterChip
                key={t.id}
                label={t.label}
                color={t.color}
                active={relFilter.has(t.id)}
                onClick={() => toggleRelType(t.id)}
              />
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetRelTypes}
              style={{ margin: '2px 3px 2px 0', padding: '3px 8px', minHeight: undefined, fontSize: FS.xs }}
            >
              {allRelsOn ? 'None' : 'All'}
            </Button>
          </ChipGroup>
        )}
        <LayerToggle
          label="Roads"
          checked={!!layers.roads}
          onChange={() => toggleLayer('roads')}
        />
        <LayerToggle
          label="Supply chains"
          checked={!!layers.chains}
          onChange={() => toggleLayer('chains')}
        />
        <LayerToggle
          label="Regional channels"
          checked={!!layers.regionalChannels}
          onChange={() => toggleLayer('regionalChannels')}
        />
        {layers.regionalChannels && (
          <ChipGroup>
            {REGIONAL_CHANNEL_TYPES.map(type => (
              <FilterChip
                key={type}
                label={human(type)}
                color={regionalChannelColor(type)}
                active={regionalChannelFilter.has(type)}
                onClick={() => toggleRegionalChannelType(type)}
              />
            ))}
          </ChipGroup>
        )}
        <LayerToggle
          label="Regional impacts"
          checked={!!layers.regionalImpacts}
          onChange={() => toggleLayer('regionalImpacts')}
        />
        {layers.regionalImpacts && (
          <ChipGroup>
            {REGIONAL_IMPACT_STATUS_FILTERS.map(status => (
              <FilterChip
                key={status}
                label={human(status)}
                color={regionalImpactColor(status)}
                active={regionalImpactFilter.has(status)}
                onClick={() => toggleRegionalImpactStatus(status)}
              />
            ))}
            <label
              htmlFor="regional-min-severity"
              style={{
              display: 'flex',
              alignItems: 'center',
              gap: SP.xs,
              marginTop: 4,
              fontSize: FS.xs,
              color: BODY,
              fontFamily: sans,
              fontWeight: 700,
            }}>
              Severity
              <input
                id="regional-min-severity"
                type="range"
                aria-label="Minimum severity"
                aria-valuetext={`${Math.round(regionalMinSeverity * 100)} percent`}
                min="0"
                max="0.8"
                step="0.1"
                value={regionalMinSeverity}
                onChange={e => setLayerFilter('regionalMinSeverity', Number(e.target.value))}
                style={{ width: 96, accentColor: GOLD }}
              />
              {Math.round(regionalMinSeverity * 100)}%
            </label>
          </ChipGroup>
        )}
        <LayerToggle
          label="War & faith"
          checked={layers.warFaith !== false}
          onChange={() => toggleLayer('warFaith')}
        />
        <LayerToggle
          label="GM regional channels"
          checked={layers.regionalShowGm !== false}
          onChange={() => toggleLayer('regionalShowGm')}
        />

        {/* Between-cluster gap is a one-off 32 (~2x the within-cluster rhythm of
            the SP.xs/SP.sm toggle rows) so the "looser between / tight within"
            P5 contrast actually survives the squint test; SP.xxl(24) read as
            barely larger than the row rhythm and the two clusters fused. */}
        <Subhead style={{ marginTop: 32 }}>Map features</Subhead>
        <LayerToggle
          label="Labels"
          checked={!!layers.labels}
          onChange={() => toggleLayer('labels')}
        />
        <LayerToggle
          label="Markers"
          checked={!!layers.markers}
          onChange={() => toggleLayer('markers')}
        />
        <LayerToggle
          label="Forests"
          checked={!!layers.forests}
          onChange={() => toggleLayer('forests')}
        />
        <LayerToggle
          label="State borders"
          checked={!!layers.nativeStateBorders}
          onChange={() => toggleLayer('nativeStateBorders')}
        />
        <LayerToggle
          label="Culture regions"
          checked={!!layers.nativeCultureRegions}
          onChange={() => toggleLayer('nativeCultureRegions')}
        />
        <LayerToggle
          label="Biomes"
          checked={!!layers.nativeBiomes}
          onChange={() => toggleLayer('nativeBiomes')}
        />
      </div>
    </div>
  );
}

// A quiet uppercase cluster label. Carries group meaning via FS.xs BODY (clears
// the contrast/size floors for a structural label) instead of a drawn divider.
function Subhead({ children, style }) {
  return (
    <div style={{
      fontSize: FS.xs, fontWeight: 800, color: BODY,
      textTransform: 'uppercase', letterSpacing: '0.05em',
      padding: `0 ${SP.xs}px ${SP.xs}px`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// Binds a filter sub-list to its parent toggle by proximity (P5): tight to the
// toggle above, indented, with a clear gap before the next peer toggle below.
function ChipGroup({ children }) {
  return (
    <div style={{ marginLeft: SP.md, marginTop: 0, marginBottom: SP.sm }}>
      {children}
    </div>
  );
}

function LayerToggle({ label, checked, onChange }) {
  const inputId = `layer-toggle-${String(label).replace(/\s+/g, '-').toLowerCase()}`;
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- handlers only apply decorative hover styling to this label-for-checkbox; no interactive behavior added
    <label
      htmlFor={inputId}
      style={{
      display: 'flex', alignItems: 'center', gap: SP.xs,
      padding: `${SP.xs}px ${SP.sm}px`,
      cursor: 'pointer', userSelect: 'none',
      borderRadius: R.sm,
      fontSize: FS.sm, color: INK,
    }}
      onMouseEnter={e => (e.currentTarget.style.background = swatch['#FAF6EF'])}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <input
        id={inputId}
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={onChange}
        style={{ accentColor: GOLD, cursor: 'pointer' }}
      />
      <span style={{ fontWeight: 600 }}>{label}</span>
    </label>
  );
}

// Filter chips are SELECTION state, not the panel's primary action, so they never
// occupy the high-emphasis primary slot (P8) — they stay ghost. Type identity
// reads in >=2 channels in BOTH states (P7): a persistent leading colored dot
// (shape, not hue-on-border alone) plus the label, with the active state adding a
// color fill + Check glyph + aria-pressed on top.
function FilterChip({ label, color, active, onClick }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      style={{
        gap: 5,
        padding: '3px 8px',
        margin: '2px 3px 2px 0',
        minHeight: undefined,
        background: active ? `${color}22` : 'transparent',
        color: INK,
        border: `1px solid ${active ? color : BORDER2}`,
        borderRadius: 12,
        fontSize: FS.xs, fontWeight: active ? 800 : 600, fontFamily: sans,
        boxShadow: 'none',
      }}
    >
      <span aria-hidden style={{
        width: 8, height: 8, borderRadius: 4, flexShrink: 0,
        background: color, opacity: active ? 1 : 0.5,
      }} />
      {label}
      {active && <Check size={10} />}
    </Button>
  );
}
