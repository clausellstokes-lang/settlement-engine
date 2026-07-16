/**
 * CampaignEmptyState — the ONE actionable no-campaign empty state shared by every
 * Realm Inspector section and the Realm Dashboard.
 *
 * P1/P8: no dead-ends. An empty section states what will appear AND offers the one
 * activation click, instead of a bare "Select a campaign" string that names an
 * action with no control on this surface. P4 cohesion: it is the SAME gold-tint
 * callout-with-CTA recipe SettlementPalette uses, so the GM stops relearning
 * "what does an empty panel look like" per section. P5: the gold tint + icon carry
 * the call-out in two channels with no extra frame inside the already-framed rail.
 *
 * A "Select a campaign" CTA when campaigns exist, a primary "Create a campaign"
 * when none do; if no handler is wired it degrades to the lead sentence alone.
 */

import { useState } from 'react';
import { FolderOpen, PlusCircle, LayoutDashboard, X } from 'lucide-react';
import Button from '../primitives/Button.jsx';
import { t } from '../../copy/index.js';
import { isGuidanceDismissed, markGuidanceDismissed } from '../../lib/guidance.js';
import { GOLD, GOLD_BG, INK, MUTED, BORDER, FS, SP, R, sans } from '../theme.js';

// content-immersion-r2-3: the registered realm_empty_invitation whisper — its body
// (guidance.invitations.realm) was dead copy that rendered NOWHERE. On the true
// no-campaign state it now mounts as a dismissible teaching line beneath the CTA
// (the Create/Select CTA itself always stays — dismissal only hides the tip).
const WHISPER_ID = 'realm_empty_invitation';

export default function CampaignEmptyState({ lead, onCreateCampaign, onSelectCampaign, hasCampaigns = false }) {
  const [invited, setInvited] = useState(() => !isGuidanceDismissed(WHISPER_ID));
  const isCreate = !hasCampaigns && typeof onCreateCampaign === 'function';
  const action = hasCampaigns && typeof onSelectCampaign === 'function'
    ? { label: 'Select a campaign', Icon: LayoutDashboard, onClick: onSelectCampaign }
    : typeof onCreateCampaign === 'function'
      ? { label: 'Create a campaign', Icon: PlusCircle, onClick: onCreateCampaign }
      : null;
  return (
    <div style={{
      display: 'grid', gap: SP.sm, justifyItems: 'start',
      padding: SP.md, borderRadius: R.md, background: GOLD_BG,
    }}>
      <FolderOpen size={18} color={GOLD} />
      <div style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 800, lineHeight: 1.4 }}>
        {lead}
      </div>
      {action && (
        <Button variant="primary" size="sm" icon={<action.Icon size={13} />} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
      {isCreate && invited && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: SP.xs }}>
          <span style={{ flex: 1, color: MUTED, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5, borderTop: `1px solid ${BORDER}`, paddingTop: SP.xs }}>
            {t('guidance.invitations.realm')}
          </span>
          <Button
            variant="ghost" size="sm" icon={<X size={11} />}
            aria-label="Dismiss this tip"
            onClick={() => { markGuidanceDismissed(WHISPER_ID); setInvited(false); }}
          />
        </div>
      )}
    </div>
  );
}
