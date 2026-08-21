/**
 * TemperamentPicker.jsx — R-6 TEMPERAMENT PRESETS (set the world's temper).
 *
 * Curated, house-voiced choices over the existing preset machinery. Picking a
 * temperament applies its bundle to the active campaign through the EXISTING
 * updateCampaignSimulationRules action — no new physics, just a chosen temper.
 *
 * Lazy: the temperament bundles module is dynamic-imported on apply, off first paint.
 */
import { useState } from 'react';
import { useStore } from '../../store/index.js';
import { sans, serif_, FS, SP, R, INK, BODY, MUTED, BORDER, CARD, GOLD_DEEP, GREEN_DEEP } from '../theme.js';
import Card from '../primitives/Card.jsx';
import Button from '../primitives/Button.jsx';
import { TEMPERAMENTS } from '../../domain/worldPulse/temperamentPresets.js';

export default function TemperamentPicker() {
  const campaigns = useStore((s) => s.campaigns);
  const activeCampaignId = useStore((s) => s.activeCampaignId);
  const updateRules = useStore((s) => s.updateCampaignSimulationRules);
  const [applied, setApplied] = useState('');
  const [busy, setBusy] = useState('');

  const hasCampaign = !!(campaigns || []).find((c) => c.id === activeCampaignId);

  async function choose(id) {
    if (!activeCampaignId || typeof updateRules !== 'function') return;
    setBusy(id); setApplied('');
    try {
      const { applyTemperament } = await import('../../domain/worldPulse/temperamentPresets.js');
      const rules = applyTemperament(id);
      if (rules) { await updateRules(activeCampaignId, rules); setApplied(id); }
    } finally { setBusy(''); }
  }

  return (
    <Card title="The World's Temper" kicker="Set the age">
      <p style={{ fontFamily: sans, fontSize: FS.sm, color: MUTED, margin: `0 0 ${SP.md}px` }}>
        Choose the temper of the age: a curated bundle of the world&rsquo;s dials, not a wall
        of switches. Each is a choice, not a new rule.
      </p>
      {!hasCampaign && (
        <p style={{ fontFamily: sans, fontSize: FS.sm, color: MUTED, margin: 0 }}>
          Open a campaign to set its temper.
        </p>
      )}
      {hasCampaign && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {TEMPERAMENTS.map((t) => (
            <div key={t.id} style={{ border: `1px solid ${BORDER}`, borderRadius: R.md, padding: SP.md, background: CARD }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: SP.sm }}>
                <span style={{ fontFamily: serif_, fontSize: FS.lg, color: INK }}>{t.label}</span>
                <Button size="sm" variant={applied === t.id ? 'ghost' : 'secondary'} disabled={busy === t.id} onClick={() => choose(t.id)}>
                  {busy === t.id ? 'Setting…' : applied === t.id ? 'Set' : 'Choose'}
                </Button>
              </div>
              <p style={{ fontFamily: sans, fontSize: FS.sm, color: BODY, lineHeight: 1.6, margin: `${SP.xs}px 0 0` }}>{t.description}</p>
              {applied === t.id && (
                <p style={{ fontFamily: sans, fontSize: FS.xs, color: GREEN_DEEP, margin: `${SP.xs}px 0 0` }}>
                  The age is set. The world will move to this temper from here.
                </p>
              )}
            </div>
          ))}
          <p style={{ fontFamily: sans, fontSize: FS.xs, fontStyle: 'italic', margin: 0, color: GOLD_DEEP }}>
            You can change the temper at any time; it shapes what comes, never what has already passed.
          </p>
        </div>
      )}
    </Card>
  );
}
