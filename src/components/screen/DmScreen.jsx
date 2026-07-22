/**
 * DmScreen.jsx — V-18 THE DM SCREEN (the table's desktop face).
 *
 * One at-the-table view that gathers the DM's tools: the Chronicler's Letter, the
 * dossier summary, the Session Ledger (R-1), and the Auspice (V-16) — with a
 * PLAYER-SAFE second face. The DM|Player toggle flips the whole screen: the
 * player face shows only the player-safe dossier (secrets stripped via the domain
 * audience gate, which reuses toPublicSafe and FAILS CLOSED), and hides every
 * DM-only tool (the ledger and the auspice).
 *
 * SLOTS (fold pass 2, mounts applied): the Letter panel (V-B,
 * ChroniclersLetterPanel) is on the composite base, so this screen MOUNTS it
 * directly. It null-guards its `campaign` prop — the Letter renders null with no
 * active campaign — so the screen stands even with nothing open. The Letter shows
 * on both faces (it is a reformatting of the public wizardNews chronicle, no
 * secret content), alongside the DM-only ledger and auspice.
 */
import { useState } from 'react';
import { useStore } from '../../store/index.js';
import { toScreenView } from '../../domain/display/dmScreen.js';
import { sans, serif_, FS, SP, INK, BODY, MUTED, GOLD_DEEP } from '../theme.js';
import Page from '../primitives/Page.jsx';
import PageHeader from '../primitives/PageHeader.jsx';
import Card from '../primitives/Card.jsx';
import Segmented from '../primitives/Segmented.jsx';
import Badge from '../primitives/Badge.jsx';
import TableLedgerPanel from '../tableLedger/TableLedgerPanel.jsx';
import AuspicePanel from '../auspice/AuspicePanel.jsx';
import TemperamentPicker from '../temperament/TemperamentPicker.jsx';
import ChroniclersLetterPanel from '../map/ChroniclersLetterPanel.jsx';

const AUDIENCE_OPTIONS = [
  { id: 'dm', label: 'DM view' },
  { id: 'player', label: 'Player view' },
];

/** The compact dossier summary — rendered from the AUDIENCE-projected settlement,
 * so the player face can only ever show player-safe fields. */
function DossierSummary({ view, audience }) {
  const name = view.name || 'This settlement';
  const tier = view.tier || '';
  const population = view.population;
  const institutions = Array.isArray(view.institutions) ? view.institutions.length : 0;
  const npcs = Array.isArray(view.npcs) ? view.npcs.length : 0;
  return (
    <Card title="Dossier" kicker={audience === 'player' ? 'What the table sees' : 'At a glance'}
      actions={audience === 'player' ? <Badge tone="info" size="sm">Player-safe</Badge> : null}>
      <div style={{ fontFamily: serif_, fontSize: FS.xl, color: INK, marginBottom: SP.xs }}>{name}</div>
      <div style={{ display: 'flex', gap: SP.md, flexWrap: 'wrap', fontFamily: sans, fontSize: FS.sm, color: BODY }}>
        {tier && <span><strong style={{ color: GOLD_DEEP }}>{tier}</strong></span>}
        {population != null && <span>{Number(population).toLocaleString()} souls</span>}
        <span>{institutions} institutions</span>
        <span>{npcs} named folk</span>
      </div>
      {audience === 'player' && (
        <p style={{ fontFamily: sans, fontSize: FS.xs, color: MUTED, margin: `${SP.sm}px 0 0` }}>
          Secrets, DM notes, and covert marks are hidden on this face. Show it to your table.
        </p>
      )}
    </Card>
  );
}

export default function DmScreen() {
  const settlement = useStore((s) => s.settlement);
  const campaigns = useStore((s) => s.campaigns);
  const activeCampaignId = useStore((s) => s.activeCampaignId);
  const [audience, setAudience] = useState('dm');

  const activeCampaign = (campaigns || []).find((c) => c.id === activeCampaignId) || null;
  const view = toScreenView(settlement, audience);
  const isDm = audience === 'dm';

  return (
    <Page>
      <PageHeader
        eyebrow="At the table"
        title="The DM Screen"
        subtitle="Your letter, your dossier, and the two faces of the table."
        actions={<Segmented options={AUDIENCE_OPTIONS} value={audience} onChange={setAudience} ariaLabel="Screen audience" />}
      />

      {!settlement && (
        <Card title="Open a settlement" kicker="Nothing on the table yet">
          <p style={{ fontFamily: sans, fontSize: FS.sm, color: MUTED, margin: 0 }}>
            Open a settlement from your library to set the table: its dossier, its ledger, and
            its auspices will gather here.
          </p>
        </Card>
      )}

      {settlement && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: SP.lg, alignItems: 'start' }}>
          <DossierSummary view={view} audience={audience} />

          {/* Letter slot — V-B's Chronicler's Letter (fold-pass-2 mount). Shown on
              both faces; renders null with no active campaign. The panel carries its
              own header, so the Card supplies only the frame + kicker (no dup title). */}
          <Card kicker="Session prep">
            <ChroniclersLetterPanel campaign={activeCampaign} />
          </Card>

          {/* DM-only tools. The player face never renders these. */}
          {isDm && <AuspicePanel campaign={activeCampaign} />}
          {isDm && <TableLedgerPanel />}
          {isDm && <TemperamentPicker />}
        </div>
      )}
    </Page>
  );
}
