/**
 * SupplyChainsManager.jsx — the "Supply Chains" tab of My Custom Content.
 *
 * Supply chains aren't hand-authored — they're DISCOVERED. inferSupplyChains
 * walks the inputs/outputs of the user's custom institutions, services,
 * resources, and trade goods, finds producer→consumer links, and folds in
 * trade endpoints (imports for unmet inputs, exports for surplus). Each
 * discovered chain renders through the dossier's own ChainRow, and the user
 * verifies it: name it + Confirm (persists to customContent.supplyChains) or
 * Reject (dismiss). Confirmation records authorial review; each generated
 * settlement separately evaluates whether the reviewed components are active,
 * blocked, or outside its tier before any trade endpoint is promoted.
 */
import { useMemo, useState } from 'react';

import { useStore } from '../../store/index.js';
import { inferSupplyChains } from '../../domain/inferSupplyChains.js';
import {
  confirmCustomSupplyChainReview,
  customSupplyChainReviewMatches,
} from '../../domain/content/customSupplyChainReview.js';
import { ChainRow } from '../new/SupplyChainsPanel.jsx';
import Button from '../primitives/Button.jsx';
import { FS, swatch, INK, BODY, MUTED, BORDER, GREEN, AMBER, sans } from '../theme.js';

export default function SupplyChainsManager() {
  const customContent = useStore((s) => s.customContent);
  const saveReviewedSupplyChain = useStore(
    (s) => s.saveReviewedSupplyChain,
  );
  const removeReviewedSupplyChain = useStore(
    (s) => s.removeReviewedSupplyChain,
  );

  const [rejected, setRejected] = useState(() => new Set());
  const [names, setNames] = useState({});

  const confirmed = useMemo(() => customContent.supplyChains || [], [customContent.supplyChains]);

  // Discover on demand; recompute only when custom content changes.
  const discovered = useMemo(() => inferSupplyChains(customContent), [customContent]);
  const discoveredById = useMemo(
    () => new Map(discovered.map(chain => [chain.chainId, chain])),
    [discovered],
  );
  const currentConfirmationIds = useMemo(() => new Set(
    confirmed
      .filter(chain => customSupplyChainReviewMatches(
        chain,
        discoveredById.get(chain.chainId),
      ))
      .map(chain => chain.chainId),
  ), [confirmed, discoveredById]);
  const pending = discovered.filter(chain => (
    !currentConfirmationIds.has(chain.chainId)
    && !rejected.has(chain.chainId)
  ));

  const instNames = useMemo(
    () => (customContent.institutions || []).map((i) => i.name).filter(Boolean),
    [customContent.institutions],
  );

  const exportsOf = (chain) => (chain.discovered?.tradeEndpoints?.exports || []).map((e) => e.label);

  const confirm = async (chain) => {
    const prior = confirmed.find(item => item.chainId === chain.chainId);
    const userName = (
      names[chain.chainId]
      || prior?.verification?.userName
      || prior?.label
      || ''
    ).trim();
    const reviewed = confirmCustomSupplyChainReview(chain, { userName });
    await saveReviewedSupplyChain(reviewed);
  };
  const reject = (chainId) => setRejected((prev) => new Set([...prev, chainId]));

  const sectionLabel = {
    fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: MUTED, margin: '4px 0 8px',
  };

  return (
    <div>
      {/* Intro callout: left-accent only (not a full box) so it matches the
          chain cards' grammar and doesn't out-weight the content it introduces
          — the heaviest container is reserved for the chains, not the explainer (P5). */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px', marginBottom: 12, borderLeft: `3px solid ${swatch.magic}`, background: swatch['#F8F4FF'] }}>
        <div style={{ fontSize: FS.xs, color: BODY, fontFamily: sans, lineHeight: 1.5 }}>
          Supply chains are <strong>discovered automatically</strong> from your custom institutions,
          services, resources, and trade goods. The engine connects what each one produces to what
          another needs. Unmet inputs become <strong>imports</strong>; surplus outputs become
          <strong> exports</strong>. Name and <strong>confirm</strong> the ones that make sense.
          Confirmation records your review; each settlement still checks its tier and whether every
          required resource, institution, and service actually exists before the chain can trade.
        </div>
      </div>

      {/* Confirmed chains */}
      {confirmed.length > 0 && (
        <>
          <div style={sectionLabel}>Confirmed ({confirmed.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {confirmed.map((chain) => {
              const current = discoveredById.get(chain.chainId);
              const reviewIsCurrent = customSupplyChainReviewMatches(chain, current);
              return (
              <div
                key={chain.id || chain.chainId}
                style={{
                  border: `1px solid ${BORDER}`,
                  borderLeft: `3px solid ${reviewIsCurrent ? GREEN : AMBER}`,
                  padding: '8px 12px',
                  background: reviewIsCurrent
                    ? 'rgba(240,250,242,0.6)'
                    : 'rgba(253,248,236,0.6)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: FS.sm, fontWeight: 800, color: INK, fontFamily: sans }}>{chain.label}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReviewedSupplyChain(
                      chain.definitionId || chain.id,
                    )}
                  >
                    Remove
                  </Button>
                </div>
                <ChainRow
                  chain={{
                    ...chain,
                    status: reviewIsCurrent ? 'confirmed' : 'stale',
                  }}
                  instNames={instNames}
                  primaryExports={[]}
                />
                <div style={{
                  fontSize: FS.xxs,
                  color: MUTED,
                  lineHeight: 1.45,
                  marginTop: 6,
                }}>
                  {reviewIsCurrent
                    ? 'Reviewed definition. Runtime status is evaluated per generated settlement; this card does not claim the chain is running.'
                    : 'Definition identity or meaning changed after this review. Review the newly discovered projection again before it can trade.'}
                </div>
              </div>
              );
            })}
          </div>
        </>
      )}

      {/* Discovered (pending verification) */}
      <div style={sectionLabel}>Discovered, needs your review ({pending.length})</div>
      {pending.length === 0 ? (
        <div style={{ padding: '18px 14px', textAlign: 'center', fontSize: FS.sm, color: BODY, fontFamily: sans }}>
          {discovered.length === 0
            ? 'No supply chains discovered yet. Add custom institutions, resources, and trade goods with inputs/outputs that connect, and chains will appear here.'
            : 'All discovered chains have been reviewed.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pending.map((chain) => (
            <div key={chain.chainId} style={{ border: `1px solid ${BORDER}`, borderLeft: `3px solid ${AMBER}`, padding: '8px 12px', background: 'rgba(253,248,236,0.6)' }}>
              <ChainRow chain={chain} instNames={instNames} primaryExports={exportsOf(chain)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <input
                  aria-label="Name this chain"
                  value={names[chain.chainId] ?? ''}
                  onChange={(e) => setNames((d) => ({ ...d, [chain.chainId]: e.target.value }))}
                  placeholder={`Name this chain (e.g. ${chain.label})`}
                  style={{ flex: '1 1 220px', minWidth: 180, padding: '5px 8px', border: `1px solid ${BORDER}`, fontSize: FS.xs, fontFamily: sans, color: INK, background: swatch.white, outline: 'none' }}
                />
                <Button variant="success" size="sm" onClick={() => confirm(chain)}>
                  {confirmed.some(item => item.chainId === chain.chainId)
                    ? 'Review again'
                    : 'Confirm'}
                </Button>
                {/* Reject is the quiet, secondary path — it dismisses a
                    suggestion, it isn't the loud primary. Demoted off the danger
                    fill to a ghost button and pushed apart from Confirm so the
                    accept action stays the one obvious move. */}
                <Button variant="ghost" size="sm" onClick={() => reject(chain.chainId)} style={{ marginLeft: 'auto', color: swatch.danger }}>
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
