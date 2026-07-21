/**
 * FoundingWorlds.jsx — CURATED FIRST SAMPLES: the create-landing surface.
 *
 * A small strip of hand-curated example settlements offered on the create flow so
 * a new DM witnesses depth in their first ten minutes. The trio is the SAME
 * Mossgate / Black Crag / Thornwell samples the Library's saves empty-state shows
 * (imported from src/data/sampleSettlements.js — single source, zero string
 * duplication); 'Fork this sample' drives the SAME fork wiring as the Library
 * (SettlementsPanel.forkSample): load the sample's config with a user-suffixed
 * seed, generate, and open the dossier. (Walk W1, owner order 2026-07-21, ledger
 * 13da1e95.)
 *
 * The older editorial FOUNDING_SEEDS registry (src/data/foundingSeeds.js) is no
 * longer rendered here; the data and its claims-parity probe
 * (tests/data/foundingSeeds.probe.test.js) remain in the repo, unrendered.
 *
 * Rule-framed plate idiom (no radius, no tint fills) so the deep-craft kill-list
 * stays tolerance-0.
 */
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { INK, BODY, MUTED, BORDER, CARD, CARD_ALT, GOLD, sans, serif_, FS, SP } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { useStore } from '../../store/index.js';
import { anonAtCap } from '../../lib/anonGenCounter.js';
import { SAMPLE_SETTLEMENTS, forkSeedFor } from '../../data/sampleSettlements.js';

// The Library's fork normalizes the config through settlements/helpers.migrateConfig.
// That module carries the whole saves-panel helper set; importing it here dragged it
// into this lazy create-surface chunk and rebalanced the shared graph (+bytes toward
// the first-paint closure — the recorded shared-chunk hazard). migrateConfig is a
// two-field default-fill, so it is inlined verbatim to keep the fork byte-identical
// without the cross-chunk import.
function normalizeConfig(config) {
  const c = { ...config };
  if (c.magicExists === undefined) c.magicExists = (c.priorityMagic ?? 50) > 0;
  if (!c.nearbyResourcesState) c.nearbyResourcesState = {};
  return c;
}

export default function FoundingWorlds({ onNavigate }) {
  const generate = useStore((s) => s.generateSettlement);
  const updateConfig = useStore((s) => s.updateConfig);
  const authTier = useStore((s) => s.auth.tier);
  const authUserId = useStore((s) => s.auth.user?.id);
  const [busyId, setBusyId] = useState(null);

  // 'Fork this sample' — identical wiring to the Library's SettlementsPanel.forkSample:
  // load the sample's config with a user-suffixed seed (so two users forking the same
  // sample get mechanically-different towns), run the engine, and reveal the dossier.
  // The auto-save-to-Library and purchase-modal branches are Library-dashboard concerns
  // and do not apply on the create-landing strip; a tier-gated null result still routes
  // to the wizard where the existing upgrade path lives.
  const forkSample = (sample) => async () => {
    if (busyId) return;
    if (authTier === 'anon' && anonAtCap()) { onNavigate?.('generate'); return; }
    setBusyId(sample.id);
    try {
      const seed = forkSeedFor(sample, authUserId);
      updateConfig({ ...normalizeConfig(sample.config), seed, _forkedFromSample: sample.id });
      await generate(seed);
      onNavigate?.('generate');
    } finally {
      setBusyId(null);
    }
  };

  if (!SAMPLE_SETTLEMENTS.length) return null;

  return (
    <section aria-label="Founding worlds"
      style={{ maxWidth: 960, margin: '0 auto', width: '100%', padding: `${SP.lg}px ${SP.md}px` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.xs }}>
        <Sparkles size={16} color={GOLD} aria-hidden="true" />
        <h2 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.lg, fontWeight: 900 }}>Founding Worlds</h2>
      </div>
      <p style={{ margin: `0 0 ${SP.md}px`, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5 }}>
        Start somewhere already alive. Fork one of these curated settlements into your own draft: no two the same, all deterministic from their seed.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: SP.md }}>
        {SAMPLE_SETTLEMENTS.map((sample) => (
          <article key={sample.id}
            style={{ border: `1px solid ${BORDER}`, background: CARD_ALT, padding: SP.md, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: SP.sm, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.md, fontWeight: 900 }}>{sample.name}</h3>
              <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, textTransform: 'capitalize' }}>{sample.tier} · {sample.terrain}</span>
            </div>
            <p style={{ margin: 0, color: BODY, fontFamily: serif_, fontStyle: 'italic', fontSize: FS.xs, lineHeight: 1.5 }}>{sample.teaser}</p>
            <ul style={{ margin: 0, padding: `0 0 0 ${SP.md}px`, color: MUTED, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.5 }}>
              {sample.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
            <div style={{ flex: 1 }} />
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm, background: CARD }}>
              <Button variant="primary" size="sm" busy={busyId === sample.id} onClick={forkSample(sample)}>
                {busyId === sample.id ? 'Forking…' : 'Fork this sample'}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
