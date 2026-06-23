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

import { FolderOpen, PlusCircle, LayoutDashboard } from 'lucide-react';
import Button from '../primitives/Button.jsx';
import { GOLD, GOLD_BG, INK, FS, SP, R, sans } from '../theme.js';

export default function CampaignEmptyState({ lead, onCreateCampaign, onSelectCampaign, hasCampaigns = false }) {
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
    </div>
  );
}
