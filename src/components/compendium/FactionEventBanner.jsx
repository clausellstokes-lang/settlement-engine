/**
 * FactionEventBanner — the faction relabel (UX Phase 8, decision 5).
 *
 * Custom factions never reach generation (`eligibleCustomContent` doesn't read
 * the factions bucket). Rather than wire them in (fixture / byte-identity risk),
 * we RELABEL: a faction enters an EXISTING world through an in-world event, not
 * at generation time. This banner stops the honesty gap and routes to the
 * EventComposer (via an open settlement). It does NOT claim the faction will be
 * generated.
 *
 * The faction accent is read from the shared CATEGORY_BY_KEY data (not a fresh
 * literal) so the colour stays in lockstep with the bucket chip.
 */

import { Info } from 'lucide-react';
import { navigate } from '../../hooks/useRoute.js';
import { SECOND as SEC, FS } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { CATEGORY_BY_KEY } from './customCategories.js';

const FACTION = CATEGORY_BY_KEY.factions?.color || SEC;

export default function FactionEventBanner() {
  return (
    <div style={{
      marginBottom: 10, padding: '9px 12px',
      background: `${FACTION}0F`, border: `1px solid ${FACTION}44`, borderLeft: `3px solid ${FACTION}`,
      borderRadius: 7,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
        <Info size={13} color={FACTION} />
        <span style={{ fontSize: FS.xxs, fontWeight: 800, color: FACTION, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Factions enter through an event
        </span>
      </div>
      <div style={{ fontSize: FS.xs, color: SEC, lineHeight: 1.5 }}>
        A custom faction is <strong>not</strong> rolled into a fresh generation. It arrives in an
        existing settlement or region through an in-world event (a coup, an arrival, a schism) you
        author in the Event Composer &mdash; so the faction lands with consequences, not out of thin air.
      </div>
      <div style={{ marginTop: 6 }}>
        <Button variant="secondary" size="sm" onClick={() => navigate('settlements')} style={{ padding: '2px 8px', fontSize: FS.xxs }}>
          Open a settlement to compose an event &rarr;
        </Button>
      </div>
    </div>
  );
}
