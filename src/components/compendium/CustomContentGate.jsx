/**
 * CustomContentGate.jsx — the free/anon premium upsell for My Custom Content.
 *
 * Split out of CustomContent.jsx (which holds the authoring manager) so the
 * manager file stays under the component-size ratchet. Re-exported through
 * CustomContent.jsx so existing import sites keep working.
 */
import { GOLD, INK, MUTED as MUT, SECOND as SEC, serif_, FS } from '../theme.js';
import { useStore } from '../../store/index.js';
import Button from '../primitives/Button.jsx';

// ── Premium upsell card (shown to free / anon users in the Custom tab) ─────
export function CustomContentUpsell({ existingCount, isAnon }) {
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  return (
    <div style={{
      padding: '24px 20px', textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(160,118,42,0.06) 100%)',
      border: '1px solid rgba(124,58,237,0.25)',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 56, height: 56, borderRadius: '50%',
        background: 'rgba(124,58,237,0.12)', marginBottom: 12,
      }}>
      </div>
      <div style={{
        fontSize: FS['18'], fontWeight: 700, fontFamily: serif_, color: INK, marginBottom: 4,
      }}>
        Custom Compendium (Premium)
      </div>
      <div style={{
        fontSize: FS.md, color: SEC, lineHeight: 1.55, marginBottom: 16,
        maxWidth: 460, margin: '0 auto 16px',
      }}>
        Build your own institutions, resources, stressors, trade goods, power presets, and defense
        scenarios. Custom content is synced to your account and available across devices.
      </div>

      {existingCount > 0 && (
        <div style={{
          padding: '10px 14px', background: 'rgba(160,118,42,0.10)',
          border: `1px solid ${GOLD}55`,
          fontSize: FS.sm, color: GOLD, fontWeight: 600, marginBottom: 16,
          maxWidth: 460, margin: '0 auto 16px',
        }}>
          You have <strong>{existingCount}</strong> grandfathered custom item{existingCount === 1 ? '' : 's'}.
          They&rsquo;re still browseable below in read-only mode.
        </div>
      )}

      {isAnon ? (
        <div style={{ fontSize: FS.sm, color: MUT }}>Sign in and upgrade to Premium to unlock.</div>
      ) : (
        <Button variant="ai" size="lg" onClick={() => setPurchaseModalOpen(true)}>
          Upgrade to Premium
        </Button>
      )}
    </div>
  );
}
