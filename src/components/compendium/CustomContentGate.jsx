/**
 * CustomContentGate.jsx — the free/anon premium upsell for My Custom Content.
 *
 * Split out of CustomContent.jsx (which holds the authoring manager) so the
 * manager file stays under the component-size ratchet. The upsell card leads
 * with a real, non-interactive EXAMPLE item (a sample deity), so the value is
 * shown, not just asserted — an upgrade PREVIEW, not a denial (P9).
 *
 * Re-exported through CustomContent.jsx so existing import sites keep working.
 */
import { GOLD, GOLD_TXT, INK, MUTED as MUT, SECOND as SEC, serif_, FS } from '../theme.js';
import { useStore } from '../../store/index.js';
import { navigate } from '../../hooks/useRoute.js';
import { Tag } from './primitives.jsx';
import Button from '../primitives/Button.jsx';
import { CustomItemAttributes } from './CustomItemAttributes.jsx';

// ── Premium upsell card (shown to free / anon users in the Custom tab) ─────
export function CustomContentUpsell({ existingCount, isAnon }) {
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  return (
    <div style={{
      padding: '24px 20px', textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(160,118,42,0.06) 100%)',
      border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10,
    }}>
      <div style={{
        fontSize: FS['18'], fontWeight: 700, fontFamily: serif_, color: INK, marginBottom: 4,
      }}>
        Custom compendium (Premium)
      </div>
      <div style={{
        fontSize: FS.md, color: SEC, lineHeight: 1.55, marginBottom: 16,
        maxWidth: 460, margin: '0 auto 16px',
      }}>
        Author your own institutions, services, resources, trade goods, and stressors.
        Add a living-world pantheon of deities that steer the simulation. Export and import
        content packs. Everything syncs to your account across devices.
      </div>

      {/* Show the value, don't just assert it: a real but non-interactive
          example item, so the upsell reads as a preview of what you'd author
          rather than a denial behind a price tag (P9). */}
      <div aria-hidden="true" style={{ maxWidth: 460, margin: '0 auto 16px', textAlign: 'left' }}>
        <div style={{ fontSize: FS.xs, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6, textAlign: 'center' }}>
          Example
        </div>
        <div style={{ borderLeft: `3px solid #7c3aed`, borderRadius: 7, padding: '8px 12px', background: 'rgba(255,251,245,0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 700, color: INK, flex: 1 }}>Varisha, the Ember Crown</span>
            <Tag label="Deity" color="#7c3aed" />
          </div>
          <div style={{ fontSize: FS.xs, color: SEC, lineHeight: 1.4, marginTop: 4 }}>
            A warlike, major god of forge and conquest. Assigned as a settlement&rsquo;s primary deity, she pulls the realm toward aggression and anchors religious authority.
          </div>
          <CustomItemAttributes item={{ alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major', domain: 'forge and conquest' }} />
        </div>
      </div>

      {existingCount > 0 && (
        <div style={{
          padding: '10px 14px', background: 'rgba(160,118,42,0.10)',
          border: `1px solid ${GOLD}55`, borderRadius: 7,
          // GOLD_TXT (gold-800), not GOLD: gold-500 on a gold wash is ~2.3:1, a
          // hard AA fail as text. The wash + border keep GOLD (fill use). (P7)
          fontSize: FS.sm, color: GOLD_TXT, fontWeight: 600, marginBottom: 16,
          maxWidth: 460, margin: '0 auto 16px',
        }}>
          You have <strong>{existingCount}</strong> grandfathered custom item{existingCount === 1 ? '' : 's'}.
          They&rsquo;re still browseable below in read-only mode.
        </div>
      )}

      {isAnon ? (
        <Button variant="ai" size="lg" onClick={() => navigate('signin')}>
          Sign in to start
        </Button>
      ) : (
        <Button variant="ai" size="lg" onClick={() => setPurchaseModalOpen(true)}>
          Upgrade to Premium
        </Button>
      )}
    </div>
  );
}
