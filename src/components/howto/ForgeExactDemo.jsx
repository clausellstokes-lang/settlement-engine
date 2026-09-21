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
import RefusalNotice from '../primitives/RefusalNotice.jsx';
import Button from '../primitives/Button.jsx';
import { GOLD, INK, SECOND as SEC, BORDER as BOR, PARCH, serif_, sans, FS } from '../theme.js';

export default function ForgeExactDemo() {
  const generate = useStore((s) => s.generateSettlement);
  const updateConfig = useStore((s) => s.updateConfig);
  const setWizardMode = useStore((s) => s.setWizardMode);
  const setRandomSliderMode = useStore((s) => s.setRandomSliderMode);
  const clearNeighbour = useStore((s) => s.clearNeighbour);
  // The lane owns the gate and records WHY it refused (ODQ §934.24(c)); this surface
  // renders it. The pre-flight that used to sit here was the third copy of the same
  // check, and it answered a refusal by navigating with nothing said.
  const lastRefusal = useStore((s) => s.lastRefusal);
  const clearRefusal = useStore((s) => s.clearRefusal);
  const [forging, setForging] = useState(false);

  const forge = async () => {
    if (forging) return;
    clearRefusal?.();
    setForging(true);
    try {
      setWizardMode(fixture.forge.mode);
      setRandomSliderMode(fixture.forge.randomSliderMode);
      clearNeighbour();
      updateConfig({ ...fixture.forge.config });
      const forged = await generate(fixture.seed);
      // A refusal STAYS HERE, under the demo, with its reason. Navigating away from a
      // refusal is what made the class invisible.
      if (!forged) { setForging(false); return; }
      setForging(false);
      navigate('generate');
    } catch (e) {
      console.error('[ForgeExactDemo] fixture forge failed:', e);
      setForging(false);
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
          <code style={{ fontFamily: 'monospace', color: GOLD }}>{fixture.seed}</code>: the exact town
          the landing page shows, every time. Same seed, same world. No re-roll behind your back.
        </p>
      </div>
      <Button variant="secondary" size="md" busy={forging} onClick={forge}>
        Forge this exact town
      </Button>
      {/* Full-width in the demo's flex row, so the refusal reads under the control
          that raised it rather than squeezed beside it. */}
      {lastRefusal && <div style={{ flexBasis: '100%' }}><RefusalNotice refusal={lastRefusal} /></div>}
    </div>
  );
}
