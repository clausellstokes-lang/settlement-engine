/**
 * SupplyChainFlow — PDF mirror of the web SupplyChainsPanel
 * (src/components/new/SupplyChainsPanel.jsx). Renders supply chains visually:
 * grouped by category (town+), each chain a bordered box with a node flow
 * [resource] > [imports] > [institutions] > [outputs], status-colored, with
 * EXPORT tags + dashed missing-institution / import nodes.
 *
 * Glyph safety: the embedded Lora/Nunito fonts have NO arrow/dot symbols
 * (→ ↗ ↑ ● ◐ ○ ✕ all render as tofu). So status is shown by node COLOR (not
 * dots), the connector is ">", and exports are tagged with the word "EXPORT".
 * Only ASCII + "·"/"•" are used.
 *
 * Behind the pdfVisualChains flag. Pure presentational; no data derivation
 * (consumes economicState.activeChains, the same source the web panel uses).
 */
import { View, Text } from '@react-pdf/renderer';
import { type, palette, pt } from '../theme.js';
import { SUPPLY_CHAIN_NEEDS } from '../../data/supplyChainData.js';
import { exactGoodId } from '../../domain/region/goodsCatalog.js';
import { safe } from '../lib/format.js';

// chainId -> definition (for upstream import labels + fallback outputs).
const CHAIN_DEFS = {};
Object.values(SUPPLY_CHAIN_NEEDS || {}).forEach((cat) => {
  (cat.chains || []).forEach((c) => { if (c.id) CHAIN_DEFS[c.id] = c; });
});

const STATUS = {
  running:     { color: '#1a5a28', bg: '#f0faf2', border: '#a8d8b0', label: 'Running' },
  operational: { color: '#1a5a28', bg: '#f0faf2', border: '#a8d8b0', label: 'Running' },
  vulnerable:  { color: '#8a5010', bg: '#fdf8ec', border: '#e0c070', label: 'Vulnerable' },
  impaired:    { color: '#8b1a1a', bg: '#fdf4f4', border: '#e8b0b0', label: 'Impaired' },
  broken:      { color: '#8b1a1a', bg: '#fdf4f4', border: '#e8b0b0', label: 'Broken' },
};
const getStatus = (s) => STATUS[s] || STATUS.vulnerable;

const IMPORT = { color: '#2a5a8a', bg: '#eef2fb', border: '#a0b0d8' };
const MISSING = { color: '#9c8068', bg: '#f8f5f0', border: '#c8b898' };
const EXPORT = { color: '#1a5a28', bg: '#f0faf2', border: '#88c880' };
const OUTPUT = { color: '#6b5340', bg: '#faf8f4', border: '#d8c8a8' };

function Node({ color, bg, border, dashed, italic, children }) {
  return (
    <View style={{
      backgroundColor: bg,
      borderWidth: 1,
      borderStyle: dashed ? 'dashed' : 'solid',
      borderColor: border,
      borderRadius: 2,
      paddingHorizontal: 4,
      paddingVertical: 1,
      marginRight: 2,
      marginBottom: 2,
    }}>
      <Text style={{ ...type.caption, fontSize: pt['7.5'], color, fontStyle: italic ? 'italic' : 'normal' }}>
        {children}
      </Text>
    </View>
  );
}

function Connector() {
  return <Text style={{ fontSize: pt['8'], color: palette.muted, marginRight: 2, marginBottom: 2 }}>&gt;</Text>;
}

function ChainRow({ chain, instNames, primaryExports }) {
  const st = getStatus(chain.status);
  const def = CHAIN_DEFS[chain.chainId] || {};
  const missing = chain.upstreamMissing || [];
  const isExportable = chain.exportable && !chain.entrepot;

  const insts = (chain.processingInstitutions || []).map((name) => ({
    name,
    present: instNames.some((n) => n.toLowerCase().includes(String(name).toLowerCase().split(/[\s(]/)[0])),
  }));

  // Canonical good id first, substring fallback — the same predicate as the
  // web SupplyChainsPanel, or the PDF badge disagrees with the screen when
  // subsumption keeps a different alias spelling as the surviving export.
  const exportIds = new Set((primaryExports || []).map(exactGoodId).filter(Boolean));
  const outputs = (chain.outputs || def.outputs || []).slice(0, 3).map((o) => {
    const oid = exactGoodId(o);
    return {
      label: o,
      isExport: isExportable && (
        (oid != null && exportIds.has(oid)) ||
        (primaryExports || []).some((ex) =>
          ex.toLowerCase().includes(String(o).toLowerCase().split(' ')[0]) ||
          String(o).toLowerCase().includes(ex.toLowerCase().split(' ')[0]))
      ),
    };
  });

  const importedUpstream = missing.map((uid) => CHAIN_DEFS[uid]?.label || uid);

  return (
    <View
      wrap={false}
      style={{
        backgroundColor: st.bg,
        borderWidth: 1,
        borderColor: st.border,
        borderLeftWidth: 3,
        borderRadius: 3,
        padding: 4,
        marginBottom: 3,
      }}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
        {chain.resource ? (
          <>
            <Node color={st.color} bg={st.bg} border={st.border}>
              {safe(chain.resource)}{chain.resourceDepleted ? ' (depleted)' : ''}
            </Node>
            <Connector />
          </>
        ) : null}

        {importedUpstream.map((imp, i) => (
          <View key={`im-${i}`} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Node {...IMPORT} dashed>{`Import: ${safe(imp)}`}</Node>
            <Connector />
          </View>
        ))}

        {insts.map((inst, i) => (
          <View key={`in-${i}`} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Node
              color={inst.present ? st.color : MISSING.color}
              bg={inst.present ? st.bg : MISSING.bg}
              border={inst.present ? st.border : MISSING.border}
              dashed={!inst.present}
              italic={!inst.present}
            >
              {safe(inst.name)}{inst.present ? '' : ' (missing)'}
            </Node>
            {i < insts.length - 1 ? <Connector /> : null}
          </View>
        ))}

        {outputs.length > 0 ? (
          <>
            <Connector />
            {outputs.map((o, i) => (
              <Node key={`o-${i}`} {...(o.isExport ? EXPORT : OUTPUT)}>
                {safe(o.label)}{o.isExport ? '  EXPORT' : ''}
              </Node>
            ))}
          </>
        ) : null}
      </View>

      {chain.upstreamNote ? (
        <Text style={{ ...type.caption, fontSize: pt['7'], color: palette.muted, fontStyle: 'italic', marginTop: 2 }}>
          · {safe(chain.upstreamNote)}
        </Text>
      ) : null}
    </View>
  );
}

function Swatch({ color, border, label }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
      <View style={{ width: 7, height: 7, backgroundColor: color, borderWidth: 1, borderColor: border, borderRadius: 1.5, marginRight: 3 }} />
      <Text style={{ ...type.caption, fontSize: pt['7'], color: palette.muted }}>{label}</Text>
    </View>
  );
}

function Legend() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 }}>
      <Swatch color={STATUS.running.bg} border={STATUS.running.border} label="Running" />
      <Swatch color={STATUS.vulnerable.bg} border={STATUS.vulnerable.border} label="Vulnerable / upstream imported" />
      <Swatch color={STATUS.impaired.bg} border={STATUS.impaired.border} label="Impaired / institution missing" />
      <Swatch color={EXPORT.bg} border={EXPORT.border} label="EXPORT = exported for income" />
    </View>
  );
}

function CategoryGroup({ needLabel, needKey, chains, instNames, primaryExports }) {
  const impaired = chains.filter((c) => c.status === 'impaired' || c.status === 'broken').length;
  const vulnerable = chains.filter((c) => c.status === 'vulnerable').length;
  return (
    <View style={{ marginBottom: 5 }}>
      <View
        wrap={false}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: palette.card,
          borderWidth: 1,
          borderColor: palette.border,
          borderRadius: 3,
          paddingHorizontal: 6,
          paddingVertical: 2,
          marginBottom: 3,
        }}
      >
        <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.ink, flex: 1, textTransform: 'uppercase' }}>
          {safe(needLabel || needKey)}
        </Text>
        <Text style={{ ...type.caption, fontSize: pt['7'], color: palette.muted }}>
          {chains.length} chain{chains.length === 1 ? '' : 's'}
          {impaired > 0 ? ` · ${impaired} impaired` : ''}
          {vulnerable > 0 ? ` · ${vulnerable} vulnerable` : ''}
        </Text>
      </View>
      {chains.map((c, i) => (
        <ChainRow key={c.chainId || i} chain={c} instNames={instNames} primaryExports={primaryExports} />
      ))}
    </View>
  );
}

export function SupplyChainFlow({ chains, instNames = [], primaryExports = [], tier = 'village' }) {
  const list = (chains || []).filter((c) => c && c.status !== 'unexploited');
  if (!list.length) return null;

  const isTownPlus = tier === 'town' || tier === 'city' || tier === 'metropolis';

  if (isTownPlus) {
    const groups = {};
    list.forEach((c) => {
      const key = c.needKey || 'other';
      if (!groups[key]) groups[key] = { needKey: key, needLabel: c.needLabel, chains: [] };
      groups[key].chains.push(c);
    });
    const severity = (g) =>
      g.chains.filter((c) => c.status === 'impaired' || c.status === 'broken').length * 100 +
      g.chains.filter((c) => c.status === 'vulnerable').length * 10;
    const sorted = Object.values(groups).sort(
      (a, b) => severity(b) - severity(a) || String(a.needLabel || '').localeCompare(String(b.needLabel || '')),
    );
    return (
      <View>
        <Legend />
        {sorted.map((g) => (
          <CategoryGroup key={g.needKey} {...g} instNames={instNames} primaryExports={primaryExports} />
        ))}
      </View>
    );
  }

  return (
    <View>
      <Legend />
      {list.map((c, i) => (
        <ChainRow key={c.chainId || i} chain={c} instNames={instNames} primaryExports={primaryExports} />
      ))}
    </View>
  );
}

export default SupplyChainFlow;
