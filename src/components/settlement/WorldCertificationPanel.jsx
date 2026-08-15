/**
 * WorldCertificationPanel — VISION WAVE V-10 THE CERTIFICATE.
 *
 * Trust as a visible feature. Reads the committed certification manifest, finds
 * the band covering this world (by simulation preset), and renders EITHER the
 * soak's proof OR the honest pending state. It NEVER states a claim the manifest
 * has not recorded — the claims-parity law, upheld by buildWorldCertification
 * (the panel is a dumb renderer of that pure view; the pin targets the view).
 *
 * Rides SettlementDetail's already-lazy chunk (static import, like ProvenanceBlock)
 * ⇒ zero new first-paint bytes. Self-gating: with the shipped empty manifest it
 * always renders the inert-honest pending card — the panel IS the honest state.
 *
 * @enforced-by tests/domain/certificationClaimsParity.test.js (view),
 *   tests/components/worldCertificationPanel.test.jsx (DOM claims-parity).
 */

import { useStore } from '../../store/index.js';
import { FS, swatch, CARD_ALT, BORDER } from '../theme.js';
import Card from '../primitives/Card.jsx';
import { WORLD_CERTIFICATION_MANIFEST } from '../../domain/certification/certificationManifest.js';
import { buildWorldCertification } from '../../domain/certification/certificationRead.js';

/**
 * @param {Object} [props]
 * @param {string|null} [props.presetId]  the world's simulation preset (the config
 *   band). When omitted, read defensively from the active campaign.
 */
export default function WorldCertificationPanel({ presetId: presetIdProp } = {}) {
  // The world's config band = its simulation preset (seed-independent). Prefer the
  // caller's preset; else read the active campaign. null ⇒ pending (the honest default).
  const activePresetId = useStore((s) => {
    const list = Array.isArray(s.campaigns) ? s.campaigns : [];
    const active = list.find((c) => c && c.id === s.activeCampaignId);
    const rules = active && active.worldState ? active.worldState.simulationRules : null;
    return rules && typeof rules === 'object' ? (rules.presetId ?? null) : null;
  });
  const presetId = presetIdProp != null ? presetIdProp : activePresetId;

  const view = buildWorldCertification({ manifest: WORLD_CERTIFICATION_MANIFEST, presetId });
  const certified = view.status === 'certified';
  const measured = view.status === 'measured';
  const statusColor = certified
    ? swatch.success
    : measured
      ? swatch['#8A5A1A']
      : swatch.inkMag3;

  return (
    <Card kicker="World Certification" compact>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            alignSelf: 'flex-start',
            fontSize: FS.xxs,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: '2px 8px',
            // Tokens only (no raw hue, square corners — the map-palette / raw-color /
            // kill-list ratchets): the certified state reads green, pending neutral.
            color: statusColor,
            background: CARD_ALT,
            border: `1px solid ${certified || measured ? statusColor : BORDER}`,
          }}
          data-testid="certification-status"
        >
          {certified ? 'Certified' : measured ? 'Measured' : 'Pending'}
        </div>

        <div style={{ fontSize: FS.sm, fontWeight: 600, color: swatch.inkMag }}>
          {view.headline}
        </div>

        {view.detail && (
          <div style={{ fontSize: FS.xs, color: swatch.inkMag3, lineHeight: 1.45 }}>
            {view.detail}
          </div>
        )}

        {view.lines.length > 0 && (
          <ul style={{ margin: '2px 0 0', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {view.lines.map((line, i) => (
              <li key={i} style={{ fontSize: FS.xs, color: swatch.inkMag, lineHeight: 1.4 }}>
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
