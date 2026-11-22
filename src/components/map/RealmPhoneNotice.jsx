/**
 * map/RealmPhoneNotice.jsx — /realm ON A PHONE, ANSWERED HONESTLY.
 *
 * ⛔ THE OWNER (ODQ §934.26): "I would remove the realm from the phone. No realm view for
 * phone but it can be viewed on a tablet." The ruling as built says what must NOT happen:
 * "/realm at phone width renders an honest notice through the refusal-notice primitive
 * ('The realm map opens on a tablet or larger screen', with the loaded dossier's
 * Relationships tab offered), NEVER a blank or a redirect."
 *
 * Both of the easy answers are the ones forbidden. A redirect loses the address — a
 * bookmark, a shared link and the Back button all stop meaning what they said. A blank is
 * the silent-refusal class (lib/refusalReasons.js) on a route instead of a button. So the
 * route keeps its address and says, in words, what this screen cannot do and where the
 * same facts live.
 *
 * ⭐ IT IS A REFUSAL, SO IT IS SAID THE WAY EVERY REFUSAL IS SAID — the one register, the
 * one dictionary, the one component (primitives/RefusalNotice.jsx). Nothing about "a gate
 * in the generation lane" is essential to that machinery; what is essential is that a
 * reason has words, a raiser and a render site, which the walker proves for this reason
 * exactly as for the other five (tests/lint/refusalNoticeCoverage.walker.test.js).
 *
 * ⚠ WHAT A PHONE READER LOSES, AND IT IS DECLARED RATHER THAN QUIETLY DROPPED. Until this
 * ruling, /realm on a phone rendered map/RealmMobileGate.jsx: a desktop-only wall plus a
 * read-only Realm Dashboard (and, behind its flag, the Herald field companion). The
 * owner's order removes the Realm from the phone as a destination, so that companion is
 * no longer reachable at phone width. It is untouched and still renders from 640 px up,
 * which is where WorldMap's own useIsMobile branch puts it.
 *
 * THE DOOR. The realm map draws a relational web; the dossier draws the same web as a tab
 * that works on a phone. When a settlement is loaded the notice ends in an action that
 * opens it — the gate law's "every gate ends in an action" — and when none is, the notice
 * is the sentence alone rather than a control that would go nowhere.
 *
 * @enforced-by tests/components/realmPhoneNotice.test.jsx
 * @enforced-by tests/lint/refusalNoticeCoverage.walker.test.js
 */
import { useStore } from '../../store/index.js';
import { navigate } from '../../hooks/useRoute.js';
import { t } from '../../copy/index.js';
import { REFUSAL_REASONS, refusalOf } from '../../lib/refusalReasons.js';
import RefusalNotice from '../primitives/RefusalNotice.jsx';
import Button from '../primitives/Button.jsx';
import { SP } from '../theme.js';

/**
 * The focus target that asks the dossier for a tab rather than an entity. The `tab:`
 * namespace is read by components/dossier/useCrossSettlementFocus.js, which also carries
 * the reasoning for why this reuses `focusEntity` instead of minting a store action.
 */
export const RELATIONSHIPS_TARGET = 'tab:relationships';

/** The refusal this route raises, built once so the pin and the render agree. */
export const REALM_PHONE_REFUSAL = refusalOf(REFUSAL_REASONS.REALM_NEEDS_TABLET);

export default function RealmPhoneNotice() {
  const settlement = useStore((s) => s.settlement);
  const activeSaveId = useStore((s) => s.activeSaveId);
  const focusEntity = useStore((s) => s.focusEntity);

  // The door opens only onto a dossier that is really open. `activeSaveId` addresses the
  // saved row when there is one (so the URL is the settlement's own), and a live draft
  // with no save still has a dossier at /settlements.
  const openRelationships = settlement
    ? () => {
      // Stamp BEFORE navigating: the dossier reads the target as it mounts, and the
      // stamp is transient (uiSlice, out of the persist partialize), so a reload lands
      // on the dossier's default tab rather than repeating a request nobody made.
      focusEntity?.(RELATIONSHIPS_TARGET);
      navigate('settlements', activeSaveId ? { params: { id: String(activeSaveId) } } : {});
    }
    : null;

  return (
    <div data-testid="realm-phone-notice" style={{ paddingTop: SP.md, paddingBottom: SP.md }}>
      <RefusalNotice
        refusal={REALM_PHONE_REFUSAL}
        actions={openRelationships ? (
          <Button type="button" variant="secondary" size="sm" onClick={openRelationships} style={{ minHeight: 44 }}>
            {t('dossier.relationshipsDoor')}
          </Button>
        ) : null}
      />
    </div>
  );
}
