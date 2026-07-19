/**
 * howto/ForgeExactDemo.jsx — determinism experienced in three seconds.
 *
 * The About page's ONE optional interactive (never load-bearing; the covenant reads
 * fully without it). It replays the frozen landing fixture's exact recorded inputs —
 * the same seed, the same config — through the live store's generate action, so the
 * reader watches the identical town (Cnocby, seed lf-033) fall out of the engine that
 * the landing already forged. That is the same-seed promise, proven by doing.
 *
 * This mirrors the ForgeExactButton closure in components/home/LandingArtifacts.jsx
 * (a private closure there — reused as a pattern, since the Welcome surface is folded
 * and must not be edited). It reads the committed fixture module (pure data import),
 * never re-derives it.
 */

import { useState } from 'react';
import { fixture } from '../home/landingFixture.js';
import { useStore } from '../../store/index.js';
import { navigate } from '../../hooks/useRoute.js';
import { anonAtCap } from '../../lib/anonGenCounter.js';
import Button from '../primitives/Button.jsx';
import { GOLD, INK, SECOND as SEC, BORDER as BOR, PARCH, serif_, sans, FS } from '../theme.js';

export default function ForgeExactDemo() {
  const generate = useStore((s) => s.generateSettlement);
  const updateConfig = useStore((s) => s.updateConfig);
  const setWizardMode = useStore((s) => s.setWizardMode);
  const setRandomSliderMode = useStore((s) => s.setRandomSliderMode);
  const clearNeighbour = useStore((s) => s.clearNeighbour);
  const authTier = useStore((s) => s.auth.tier);
  const [forging, setForging] = useState(false);

  const forge = async () => {
    if (forging) return;
    // Anonymous visitors at their daily generation cap go to the wizard instead of
    // silently doing nothing — the same gate the landing button honours.
    if (authTier === 'anon' && anonAtCap()) { navigate('generate'); return; }
    setForging(true);
    try {
      setWizardMode(fixture.forge.mode);
      setRandomSliderMode(fixture.forge.randomSliderMode);
      clearNeighbour();
      updateConfig({ ...fixture.forge.config });
      await generate(fixture.seed);
    } catch (e) {
      // Non-fatal: the demo is optional. Fall through to the wizard.
      console.error('[ForgeExactDemo] fixture forge failed:', e);
    } finally {
      setForging(false);
      navigate('generate');
    }
  };

  return (
    <div style={{ border: `1px solid ${BOR}`, borderLeft: `3px solid ${GOLD}`,
      padding: '16px 18px', background: PARCH, display: 'flex', flexWrap: 'wrap',
      alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
      <div style={{ flex: '1 1 320px', minWidth: 0 }}>
        <div style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 600, color: INK, marginBottom: 4 }}>
          See it for yourself
        </div>
        <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: 0, fontFamily: sans }}>
          This forges <strong style={{ color: INK }}>{fixture.town.name}</strong> from seed{' '}
          <code style={{ fontFamily: 'monospace', color: GOLD }}>{fixture.seed}</code> — the exact town
          the landing page shows, every time. Same seed, same world. No re-roll behind your back.
        </p>
      </div>
      <Button variant="secondary" size="md" busy={forging} onClick={forge}>
        Forge this exact town
      </Button>
    </div>
  );
}
