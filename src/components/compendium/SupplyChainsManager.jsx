/**
 * SupplyChainsManager.jsx — the "Supply Chains" tab of My Custom Content (§14 P3).
 *
 * Supply chains aren't hand-authored — they're DISCOVERED. inferSupplyChains
 * walks the inputs/outputs of the user's custom institutions, services,
 * resources, and trade goods, finds producer→consumer links, and folds in
 * trade endpoints (imports for unmet inputs, exports for surplus). Each
 * discovered chain renders through the dossier's own ChainRow, and the user
 * verifies it: name it + Confirm (persists to customContent.supplyChains) or
 * Reject (dismiss). Confirmed chains (P3b) feed generation.
 */
import { useMemo, useState } from 'react';
import { Check, X, Trash2, Sparkles } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { inferSupplyChains } from '../../domain/inferSupplyChains.js';
import { ChainRow } from '../new/SupplyChainsPanel.jsx';
import { FS, swatch } from '../theme.js';

const INK = swatch['#1B1408'];
const BODY = swatch['#3A2F18'];
const MUTED = swatch['#9C8068'];
const BORDER = swatch['#E8D9B0'];
const GREEN = swatch['#1A5A28'];
const RED = swatch['#8B1A1A'];
const AMBER = swatch['#8A5010'];
const sans = '"Nunito", system-ui, sans-serif';

function btn(color, bg) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 10px', borderRadius: 5, cursor: 'pointer',
    border: `1px solid ${color}`, background: bg, color,
    fontFamily: sans, fontSize: FS.xs, fontWeight: 700,
  };
}

export default function SupplyChainsManager() {
  const customContent = useStore((s) => s.customContent);
  const addCustomItem = useStore((s) => s.addCustomItem);
  const deleteCustomItem = useStore((s) => s.deleteCustomItem);

  const [rejected, setRejected] = useState(() => new Set());
  const [names, setNames] = useState({});

  const confirmed = useMemo(() => customContent.supplyChains || [], [customContent.supplyChains]);
  const confirmedIds = useMemo(() => new Set(confirmed.map((c) => c.chainId)), [confirmed]);

  // Discover on demand; recompute only when custom content changes.
  const discovered = useMemo(() => inferSupplyChains(customContent), [customContent]);
  const pending = discovered.filter((c) => !confirmedIds.has(c.chainId) && !rejected.has(c.chainId));

  const instNames = useMemo(
    () => (customContent.institutions || []).map((i) => i.name).filter(Boolean),
    [customContent.institutions],
  );

  const exportsOf = (chain) => (chain.discovered?.tradeEndpoints?.exports || []).map((e) => e.label);

  const confirm = (chain) => {
    const userName = (names[chain.chainId] || '').trim();
    addCustomItem('supplyChains', {
      ...chain,
      label: userName || chain.label,
      status: 'running',
      verification: { ...(chain.verification || {}), state: 'confirmed', userName: userName || null },
    });
  };
  const reject = (chainId) => setRejected((prev) => new Set([...prev, chainId]));

  const sectionLabel = {
    fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: MUTED, margin: '4px 0 8px',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', marginBottom: 12, border: `1px solid ${BORDER}`, borderRadius: 7, background: swatch['#F8F4FF'] }}>
        <Sparkles size={14} style={{ color: swatch.magic, marginTop: 2, flexShrink: 0 }} />
        <div style={{ fontSize: FS.xs, color: BODY, fontFamily: sans, lineHeight: 1.5 }}>
          Supply chains are <strong>discovered automatically</strong> from your custom institutions,
          services, resources, and trade goods — by connecting what each one produces to what
          another needs. Unmet inputs become <strong>imports</strong>; surplus outputs become
          <strong> exports</strong>. Name and <strong>confirm</strong> the ones that make sense; they
          then count toward your settlements.
        </div>
      </div>

      {/* Confirmed chains */}
      {confirmed.length > 0 && (
        <>
          <div style={sectionLabel}>Confirmed ({confirmed.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {confirmed.map((chain) => (
              <div key={chain.id || chain.chainId} style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${GREEN}`, borderRadius: 7, padding: '8px 12px', background: 'rgba(240,250,242,0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: FS.sm, fontWeight: 800, color: INK, fontFamily: sans }}>{chain.label}</span>
                  <button type="button" onClick={() => deleteCustomItem('supplyChains', chain.id)} style={btn(MUTED, 'transparent')}>
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
                <ChainRow chain={chain} instNames={instNames} primaryExports={exportsOf(chain)} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Discovered (pending verification) */}
      <div style={sectionLabel}>Discovered — needs your review ({pending.length})</div>
      {pending.length === 0 ? (
        <div style={{ padding: '18px 14px', textAlign: 'center', fontSize: FS.sm, color: MUTED, fontFamily: sans }}>
          {discovered.length === 0
            ? 'No supply chains discovered yet. Add custom institutions, resources, and trade goods with inputs/outputs that connect, and chains will appear here.'
            : 'All discovered chains have been reviewed.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pending.map((chain) => (
            <div key={chain.chainId} style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${AMBER}`, borderRadius: 7, padding: '8px 12px', background: 'rgba(253,248,236,0.6)' }}>
              <ChainRow chain={chain} instNames={instNames} primaryExports={exportsOf(chain)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <input
                  aria-label="Name this chain"
                  value={names[chain.chainId] ?? ''}
                  onChange={(e) => setNames((d) => ({ ...d, [chain.chainId]: e.target.value }))}
                  placeholder={`Name this chain (e.g. ${chain.label})`}
                  style={{ flex: '1 1 220px', minWidth: 180, padding: '5px 8px', border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: FS.xs, fontFamily: sans, color: INK, background: swatch.white, outline: 'none' }}
                />
                <button type="button" onClick={() => confirm(chain)} style={btn(GREEN, 'rgba(26,90,40,0.08)')}>
                  <Check size={12} /> Confirm
                </button>
                <button type="button" onClick={() => reject(chain.chainId)} style={btn(RED, 'transparent')}>
                  <X size={12} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
