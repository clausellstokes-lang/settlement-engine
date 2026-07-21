/**
 * FoundingWorlds.jsx — R-2 CURATED FIRST SEEDS: the create-landing surface.
 *
 * A small strip of hand-chosen starting worlds, offered on the create flow so a new
 * DM witnesses depth in their first ten minutes. Each card forges the EXACT world
 * the registry promises (the ForgeExactButton idiom: set mode + config + seed, then
 * generate). Claims-parity: the copy here is the registry's own, and every claim is
 * proven by tests/data/foundingSeeds.probe.test.js.
 *
 * Rule-framed plate idiom (no radius, no tint fills) so the deep-craft kill-list
 * stays tolerance-0. The registry (src/data/foundingSeeds.js) is imported ONLY here
 * (a lazy create-surface consumer), so it rides the lazy data chunk, never eager.
 */
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { INK, BODY, MUTED, BORDER, CARD, CARD_ALT, GOLD, sans, serif_, FS, SP } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { useStore } from '../../store/index.js';
import { anonAtCap } from '../../lib/anonGenCounter.js';
import { DEFAULT_CONFIG } from '../../store/configSlice.js';
import { archetypePatch } from './characterPresets.js';
import { FOUNDING_SEEDS } from '../../data/foundingSeeds.js';

export default function FoundingWorlds({ onNavigate }) {
  const generate = useStore((s) => s.generateSettlement);
  const updateConfig = useStore((s) => s.updateConfig);
  const setWizardMode = useStore((s) => s.setWizardMode);
  const setRandomSliderMode = useStore((s) => s.setRandomSliderMode);
  const authTier = useStore((s) => s.auth.tier);
  const [busyId, setBusyId] = useState(null);

  const forge = (entry) => async () => {
    if (busyId) return;
    if (authTier === 'anon' && anonAtCap()) { onNavigate?.('generate'); return; }
    setBusyId(entry.id);
    try {
      setWizardMode('basic');
      setRandomSliderMode(true);
      updateConfig({ ...DEFAULT_CONFIG, settType: entry.settType, ...archetypePatch(entry.archetype) });
      await generate(entry.seed);
      onNavigate?.('generate');
    } finally {
      setBusyId(null);
    }
  };

  if (!FOUNDING_SEEDS.length) return null;

  return (
    <section aria-label="Founding worlds"
      style={{ maxWidth: 960, margin: '0 auto', width: '100%', padding: `${SP.lg}px ${SP.md}px` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.xs }}>
        <Sparkles size={16} color={GOLD} aria-hidden="true" />
        <h2 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.lg, fontWeight: 900 }}>Founding Worlds</h2>
      </div>
      <p style={{ margin: `0 0 ${SP.md}px`, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5 }}>
        Start somewhere already alive. Each of these forges a real world whose opening years tell a story: no two the same, all deterministic from their seed.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: SP.md }}>
        {FOUNDING_SEEDS.map((entry) => (
          <article key={entry.id}
            style={{ border: `1px solid ${BORDER}`, background: CARD_ALT, padding: SP.md, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
            <h3 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.md, fontWeight: 900 }}>{entry.title}</h3>
            <p style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>{entry.synopsis}</p>
            <ul style={{ margin: 0, padding: `0 0 0 ${SP.md}px`, color: MUTED, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.5 }}>
              {entry.receipts.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
            <div style={{ flex: 1 }} />
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm, background: CARD }}>
              <Button variant="primary" size="sm" busy={busyId === entry.id} onClick={forge(entry)}>
                {busyId === entry.id ? 'Forging…' : 'Forge this world'}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
