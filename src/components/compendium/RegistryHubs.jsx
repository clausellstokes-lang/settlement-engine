/**
 * compendium/RegistryHubs.jsx — the Operations and Living-World-Systems hubs.
 *
 * Both render entirely from the generated drift-contract artifact
 * (domain/compendium/generated/compendiumData.generated.js), so the public
 * Compendium can never diverge from the engine. THE OPERATION REGISTRY is the
 * headline trust artifact (adjudication 1): every operation, its class, its scope,
 * its receipt — rendered from the REAL shape (klass/targetScope/receiptRef/
 * undoToken), never an invented per-op schema. The read/propose/write story is told
 * as the S-stage architecture, not as a per-op access enum.
 */

import { useState, useMemo } from 'react';
import { GOLD, GOLD_TXT, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, serif_, sans, FS, swatch } from '../theme.js';
import { COMPENDIUM_DATA as CD } from '../../domain/compendium/generated/compendiumData.generated.js';
import { slug, ANCHOR_SCROLL_MARGIN } from './registrySlug.js';
import { Tag, Card } from './primitives.jsx';
import Button from '../primitives/Button.jsx';

const KLASS_COLOR = { canon: '#8b1a1a', macro: '#3a1a7a', mechanical: '#6b5340' };
const KLASS_MEANING = {
  canon: 'writes to your world’s canon (the receipt-bearing, undoable core)',
  macro: 'orchestrates a batch of changes as one intent',
  mechanical: 'moves store or view state without touching canon',
};

// ── THE OPERATION REGISTRY (public) ──────────────────────────────────────────
export function OperationsHub() {
  const ops = CD.operations;
  const [klass, setKlass] = useState('all');
  const filters = ['all', 'canon', 'macro', 'mechanical'];
  const shown = useMemo(
    () => ops.entries.filter((o) => klass === 'all' || o.klass === klass),
    [ops.entries, klass],
  );
  return (
    <div id="operations" style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN }}>
      <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.65, margin: '0 0 10px', fontFamily: sans, maxWidth: '40em' }}>
        This is every operation the engine can perform: the complete list of ways your world can
        change. It is the proof behind the covenant: canon changes flow only through these named
        operations, each carrying the receipt it leaves and whether it can be undone.
      </p>
      <div style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: 12, margin: '0 0 12px', maxWidth: '40em' }}>
        <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: 0, fontFamily: sans }}>
          The AI never appears in this list as an author. It works in three stages: an analyst
          <strong style={{ color: INK }}> reads </strong> the state, a compiler
          <strong style={{ color: INK }}> proposes </strong> a plan or prose, and only the
          deterministic engine <strong style={{ color: INK }}> writes</strong>, through these
          operations. Read, propose, write: the model narrates, it never decides.
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: FS.sm, color: INK, fontWeight: 700, fontFamily: sans }}>
          {ops.count} operations
        </div>
        <span style={{ color: MUT }}>·</span>
        {Object.entries(ops.byKlass).map(([k, n]) => (
          <span key={k} style={{ fontSize: FS.xs, color: SEC, fontFamily: sans }}>
            <Tag label={k} color={KLASS_COLOR[k] || GOLD} />{n}
          </span>
        ))}
        <span style={{ color: MUT }}>·</span>
        <span style={{ fontSize: FS.xs, color: MUT, fontFamily: sans }}>{ops.exemptCount} pure-UI actions exempt</span>
      </div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
        {filters.map((f) => (
          <Button key={f} onClick={() => setKlass(f)} variant={klass === f ? 'primary' : 'ghost'} size="sm" aria-pressed={klass === f}>
            {f === 'all' ? 'All' : f}{f !== 'all' && ` (${ops.byKlass[f] || 0})`}
          </Button>
        ))}
      </div>
      {klass !== 'all' && (
        <p style={{ fontSize: FS.xs, color: MUT, fontStyle: 'italic', margin: '0 0 10px', fontFamily: sans }}>
          {klass}: {KLASS_MEANING[klass]}.
        </p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 6 }}>
        {shown.map((o) => (
          <div key={o.opType} id={`op-${slug(o.opType)}`}
            style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN, border: `1px solid ${BOR}`,
              borderLeft: `3px solid ${KLASS_COLOR[o.klass] || GOLD}`, padding: '8px 10px' }}>
            {/* The legible, authored label headings the card; the raw camelCase
                opType stays as a small monospace reference (the deep-link anchor
                and the store-verb name). Then a plain description of what it does. */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
              <span style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 700, color: INK, flex: 1 }}>{o.label}</span>
              <Tag label={o.klass} color={KLASS_COLOR[o.klass] || GOLD} />
            </div>
            <code style={{ display: 'block', fontFamily: 'monospace', fontSize: FS.xxs, color: MUT, marginBottom: 4 }}>{o.opType}</code>
            <div style={{ fontSize: FS.xs, color: SEC, lineHeight: 1.5, marginBottom: 6, fontFamily: sans }}>{o.description}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, fontSize: FS.xxs, color: SEC, fontFamily: sans }}>
              <span style={{ background: `${GOLD}14`, padding: '1px 6px' }}>scope: {o.targetScope}</span>
              <span style={{ background: o.receiptRef ? '#1a5a2814' : swatch['#E8E2D6'],
                color: o.receiptRef ? '#1a5a28' : MUT, padding: '1px 6px' }}>
                {o.receiptRef ? `receipt: ${o.receiptRef}` : 'no receipt'}
              </span>
              <span style={{ background: o.undoToken ? '#1a3a7a14' : (swatch['#E8E2D6']),
                color: o.undoToken ? '#1a3a7a' : MUT, padding: '1px 6px' }}>
                {o.undoToken ? 'reversible' : 'one-way'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── THE LIVING WORLD — the causal substrate, pressures, systems, presets ──────
export function SystemsHub() {
  const { causal, pressures, systems, presets } = CD;
  return (
    <div id="living-world" style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN }}>
      <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: '0 0 14px', fontFamily: sans, maxWidth: '40em' }}>
        The generator builds a town in seconds; the living world then runs the region for years.
        These systems wake once a campaign advances. Each is opt-in and off by default. A
        non-campaign save stays byte-identical.
      </p>

      <Card title={`The causal substrate: ${causal.variableCount} variables`} accent="#1a3a7a" lead>
        Beneath every settlement sit {causal.variableCount} live causal variables, each with a score, a
        band ({causal.bands.join(' / ')}), and named contributors. They are the shared state every other
        system reads from. Advance time and they shift together.
      </Card>
      {/* Each variable with its authored label (not a split of the snake_case id)
          and a plain reading of what its score captures. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 6, margin: '0 0 4px' }}>
        {causal.variableEntries.map((v) => (
          <div key={v.id} style={{ border: `1px solid ${BOR}`, borderLeft: '3px solid #1a3a7a', padding: '8px 10px' }}>
            <div style={{ fontFamily: serif_, fontSize: FS['12.5'], fontWeight: 700, color: INK, marginBottom: 2 }}>{v.label}</div>
            <code style={{ display: 'block', fontFamily: 'monospace', fontSize: FS.xxs, color: MUT, marginBottom: 4 }}>{v.id}</code>
            <div style={{ fontSize: FS.xxs, color: SEC, lineHeight: 1.5, fontFamily: sans }}>{v.description}</div>
          </div>
        ))}
      </div>
      <div id="pressures" style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN }}>
        <Card title={`Pressures: ${pressures.count} axes`} accent="#a0762a">
          Above the variables ride {pressures.count} pressures, scored 0&ndash;1: the directional strain on
          the settlement, each carrying its own reasons. Pressures are how the engine turns a static state
          into a settlement about to do something.
        </Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 6, margin: '6px 0 0' }}>
          {pressures.entries.map((p) => (
            <div key={p.id} style={{ border: `1px solid ${BOR}`, borderLeft: '3px solid #a0762a', padding: '8px 10px' }}>
              <div style={{ fontFamily: serif_, fontSize: FS['12.5'], fontWeight: 700, color: INK, marginBottom: 2 }}>{p.label}</div>
              <code style={{ display: 'block', fontFamily: 'monospace', fontSize: FS.xxs, color: MUT, marginBottom: 4 }}>{p.id}</code>
              <div style={{ fontSize: FS.xxs, color: SEC, lineHeight: 1.5, fontFamily: sans }}>{p.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div id="systems" style={{ fontFamily: serif_, fontSize: FS['14'], fontWeight: 600, color: INK, margin: '18px 0 4px', scrollMarginTop: ANCHOR_SCROLL_MARGIN }}>
        The endgame systems
      </div>
      <p style={{ fontSize: FS.xs, color: MUT, margin: '0 0 8px', fontFamily: sans, fontStyle: 'italic' }}>
        Each is gated by a virtual simulation flag. Preset membership below is rendered from the real
        preset configs: a preset lights a system when its rules set that flag.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 6 }}>
        {systems.map((s) => (
          <div key={s.id} id={`system-${slug(s.id)}`}
            style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN, border: `1px solid ${BOR}`,
              borderLeft: `3px solid ${s.dormant ? MUT : GOLD}`, padding: '8px 10px' }}>
            <div style={{ fontFamily: serif_, fontSize: FS['12.5'], fontWeight: 700, color: INK, marginBottom: 3 }}>{s.label}</div>
            <code style={{ fontFamily: 'monospace', fontSize: FS.xxs, color: SEC }}>{s.flag}</code>
            <div style={{ marginTop: 5, fontSize: FS.xxs, color: SEC, lineHeight: 1.5, fontFamily: sans }}>{s.blurb}</div>
            <div style={{ marginTop: 5, fontSize: FS.xxs, color: SEC, fontFamily: sans }}>
              {s.dormant
                ? <span style={{ color: MUT, fontStyle: 'italic' }}>dormant: lit by no preset</span>
                : <>lit in: {s.presets.join(', ')}</>}
            </div>
          </div>
        ))}
      </div>

      <div id="presets" style={{ fontFamily: serif_, fontSize: FS['14'], fontWeight: 600, color: INK, margin: '18px 0 6px', scrollMarginTop: ANCHOR_SCROLL_MARGIN }}>
        The {presets.length} simulation presets
      </div>
      {presets.map((p) => (
        <div key={p.id} id={`preset-${slug(p.id)}`}
          style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN, display: 'flex', gap: 10, padding: '6px 0', borderBottom: `1px solid ${BOR}`, alignItems: 'baseline' }}>
          <span style={{ fontSize: FS.sm, fontWeight: 700, color: p.isDefault ? GOLD_TXT : INK, minWidth: 150, flexShrink: 0 }}>
            {p.label}{p.isDefault && <span style={{ fontSize: FS.xxs, color: GOLD_TXT }}> · default</span>}
          </span>
          {/* The summary + the distinguishing axes (intensity, autonomy) give a DM a
              basis to choose among the four otherwise-identical "quiet" presets. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: FS.xs, color: SEC, lineHeight: 1.5 }}>{p.summary}</span>
            <span style={{ fontSize: FS.xxs, color: MUT, fontFamily: sans }}>
              intensity: {p.intensity} · autonomy: {p.autonomyLabel} · {p.lights.length === 0 ? 'no endgame systems' : `lights ${p.lights.length}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
