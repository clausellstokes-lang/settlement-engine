/**
 * WorldMap.jsx — Azgaar Fantasy Map Generator integration.
 *
 * Embeds the FMG in an iframe and communicates via postMessage.
 * The map provides the geography layer; our engine provides settlement depth.
 *
 * postMessage protocol:
 *   Parent → FMG:
 *     { type: 'settlementEngine:setOverlay', chain, nodes, edges, status }
 *     { type: 'settlementEngine:highlightBurgs', burgIds }
 *     { type: 'settlementEngine:clearOverlays' }
 *
 *   FMG → Parent:
 *     { type: 'fmg:ready' }
 *     { type: 'fmg:burgSelected', burg: { ... } }
 *     { type: 'fmg:burgList', burgs: [ ... ] }
 *     { type: 'fmg:seed', seed: number }
 *
 * The FMG fork needs a small patch to add these message handlers.
 * See docs/azgaar-bridge.md for the fork modification guide.
 */
import React, { useRef, useEffect, useCallback } from 'react';
import { MapPin, Layers, Link2, ExternalLink } from 'lucide-react';
import { useStore } from '../store/index.js';
import { GOLD, INK, MUTED, SECOND, BORDER, CARD, PARCH, sans, serif_, SP, R, FS } from './theme.js';
import { CHAIN_DEFS } from '../lib/supplyChains.js';

// Configurable via VITE_FMG_URL env var; null shows the setup placeholder
const FMG_URL = import.meta.env.VITE_FMG_URL || null;

export default function WorldMap() {
  const iframeRef = useRef(null);

  const mapLoaded      = useStore(s => s.mapLoaded);
  const selectedBurg   = useStore(s => s.selectedBurg);
  const burgList       = useStore(s => s.burgList);
  const activeOverlays = useStore(s => s.activeOverlays);
  const canUseMapChains = useStore(s => s.canUseMapChains());

  const handleMapMessage = useStore(s => s.handleMapMessage);
  const sendMapCommand   = useStore(s => s.sendMapCommand);
  const setSelectedBurg  = useStore(s => s.setSelectedBurg);
  const burgToConfig     = useStore(s => s.burgToConfig);
  const updateConfig     = useStore(s => s.updateConfig);

  // Listen for messages from the FMG iframe
  useEffect(() => {
    const handler = (event) => {
      // In production, check event.origin against FMG_URL
      if (event.data && typeof event.data === 'object') {
        handleMapMessage(event.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [handleMapMessage]);

  // Generate settlement from selected burg
  const handleGenerateFromBurg = useCallback(() => {
    if (!selectedBurg) return;
    const configPreset = burgToConfig(selectedBurg);
    if (configPreset) {
      updateConfig(configPreset);
      // Navigate to generate view — handled by parent
    }
  }, [selectedBurg, burgToConfig, updateConfig]);

  // ── Placeholder UI when FMG is not yet configured ──────────────────────────
  if (!FMG_URL) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 700, margin: '0 auto', padding: '20px 0' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fffbf5', border: '1px solid #c8b89a', borderRadius: 10 }}>
          <MapPin size={48} color={GOLD} style={{ marginBottom: 16 }} />
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontFamily: 'Crimson Text, Georgia, serif', color: '#1c1409' }}>
            World Map Integration
          </h2>
          <p style={{ fontSize: 14, color: '#6b5340', lineHeight: 1.6, maxWidth: 500, margin: '0 auto' }}>
            The Azgaar Fantasy Map Generator will be embedded here, providing full
            cartography — terrain, rivers, borders, cultures — while your settlements
            provide the depth: institutions, factions, NPCs, supply chains, and more.
          </p>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400, margin: '24px auto 0' }}>
            <Feature icon={<MapPin size={16} />} title="Click any settlement on the map" desc="Auto-fill your generator config from map data: population, culture, terrain, trade routes" />
            <Feature icon={<Layers size={16} />} title="Supply chain overlays" desc="Toggle visibility of iron chains, grain chains, textile chains across the map" premium />
            <Feature icon={<Link2 size={16} />} title="Linked settlements" desc="Generated settlements appear as rich data points on the map, connected by trade routes" />
          </div>

          <div style={{ marginTop: 24, padding: '12px 16px', background: '#f5ede0', borderRadius: 8, fontSize: 12, color: '#6b5340' }}>
            <strong>Setup required:</strong> Host the Azgaar FMG fork and set the URL in WorldMap.jsx.
            See the integration guide for the postMessage bridge modifications.
          </div>
        </div>
      </div>
    );
  }

  // ── Live map view ──────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Map toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#f5ede0', borderRadius: 8, border: '1px solid #c8b89a' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1c1409', fontFamily: 'Crimson Text, Georgia, serif', flex: 1 }}>
          World Map
          {mapLoaded && <span style={{ fontSize: 11, color: '#4a8a4a', marginLeft: 8 }}>Connected</span>}
        </span>
        <a href={FMG_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9c8068', textDecoration: 'none' }}>
          Open full editor <ExternalLink size={12} />
        </a>
      </div>

      {/* Selected burg panel */}
      {selectedBurg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#fffbf5', border: '1px solid #c8b89a', borderRadius: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Crimson Text, Georgia, serif', color: '#1c1409' }}>{selectedBurg.name}</div>
            <div style={{ fontSize: 12, color: '#6b5340' }}>
              Pop. {selectedBurg.population?.toLocaleString()} &middot; {selectedBurg.capital ? 'Capital' : 'Settlement'}
              {selectedBurg.port ? ' &middot; Port' : ''}
            </div>
          </div>
          <button onClick={handleGenerateFromBurg} style={{
            padding: '8px 16px', background: GOLD, color: '#fff',
            border: 'none', borderRadius: 6, cursor: 'pointer',
            fontFamily: 'Nunito, sans-serif', fontSize: 12, fontWeight: 700,
          }}>
            Generate Settlement
          </button>
        </div>
      )}

      {/* Map iframe */}
      <div style={{ border: '1px solid #c8b89a', borderRadius: 8, overflow: 'hidden', height: '70vh', minHeight: 500 }}>
        <iframe
          ref={iframeRef}
          src={FMG_URL}
          title="Azgaar Fantasy Map Generator"
          style={{ width: '100%', height: '100%', border: 'none' }}
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>

      {/* Supply chain overlays (premium) */}
      {canUseMapChains && (
        <div style={{ padding: '10px 14px', background: '#f5ede0', borderRadius: 8, border: '1px solid #c8b89a' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1c1409', marginBottom: 8, fontFamily: 'Crimson Text, Georgia, serif' }}>
            Supply Chain Overlays
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CHAIN_DEFS.map(chain => {
              const active = activeOverlays.includes(chain.id);
              return (
                <button
                  key={chain.id}
                  onClick={() => {
                    useStore.getState().toggleOverlay(chain.id);
                    sendMapCommand(iframeRef, active
                      ? { type: 'settlementEngine:clearOverlays' }
                      : { type: 'settlementEngine:setOverlay', chain: chain.id, color: chain.color }
                    );
                  }}
                  title={chain.description}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 10px', borderRadius: 4,
                    border: `1px solid ${active ? chain.color : BORDER}`,
                    background: active ? `${chain.color}18` : CARD,
                    color: active ? chain.color : SECOND,
                    fontSize: 11, fontWeight: active ? 700 : 500,
                    cursor: 'pointer', fontFamily: sans,
                  }}
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: chain.color, display: 'inline-block',
                  }} />
                  {chain.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Feature({ icon, title, desc, premium }) {
  return (
    <div style={{ display: 'flex', gap: 10, textAlign: 'left', padding: '8px 10px', background: '#faf6ef', borderRadius: 6 }}>
      <div style={{ color: GOLD, flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1c1409' }}>
          {title}
          {premium && <span style={{ fontSize: 10, color: '#2a7a2a', marginLeft: 6, fontWeight: 700 }}>PRO</span>}
        </div>
        <div style={{ fontSize: 12, color: '#6b5340', lineHeight: 1.4 }}>{desc}</div>
      </div>
    </div>
  );
}
