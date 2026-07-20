/**
 * DmScreen.jsx — V-18 THE DM SCREEN (the table's desktop face).
 *
 * One at-the-table view that gathers the DM's tools: the Chronicler's Letter, the
 * Oracle, the dossier summary, the Session Ledger (R-1), and the Auspice (V-16) —
 * with a PLAYER-SAFE second face. The DM|Player toggle flips the whole screen: the
 * player face shows only the player-safe dossier (secrets stripped via the domain
 * audience gate, which reuses toPublicSafe and FAILS CLOSED), and hides every
 * DM-only tool (the ledger, the auspice, the oracle's private reads).
 *
 * SLOTS + FOLD SEAMS: the Letter panel (V-B) and the Oracle panel (V-C) are built
 * by other lanes and are NOT on this base. This screen mounts each in a SLOT that
 * degrades to a graceful placeholder when the panel is absent. The one-line mounts
 * are reported as fold seams:
 *   • Letter:  import ChroniclersLetter and render it in the letter slot.
 *   • Oracle:  import OraclePanel (V-C's RealmInspector panel) in the oracle slot.
 * Neither is depended on here; the screen stands alone without them.
 */
import { useState } from 'react';
import { useStore } from '../../store/index.js';
import { toScreenView } from '../../domain/display/dmScreen.js';
import { sans, serif_, FS, SP, R, INK, BODY, MUTED, BORDER, CARD, GOLD_DEEP } from '../theme.js';
import Page from '../primitives/Page.jsx';
import PageHeader from '../primitives/PageHeader.jsx';
import Card from '../primitives/Card.jsx';
import Segmented from '../primitives/Segmented.jsx';
import Badge from '../primitives/Badge.jsx';
import TableLedgerPanel from '../tableLedger/TableLedgerPanel.jsx';
import AuspicePanel from '../auspice/AuspicePanel.jsx';
import TemperamentPicker from '../temperament/TemperamentPicker.jsx';

const AUDIENCE_OPTIONS = [
  { id: 'dm', label: 'DM view' },
  { id: 'player', label: 'Player view' },
];

/** A graceful placeholder for a panel another lane will mount (Letter / Oracle). */
function SlotPlaceholder({ title, kicker, children }) {
  return (
    <div style={{ border: `1px dashed ${BORDER}`, borderRadius: R.lg, padding: SP.lg, background: CARD }}>
      <div style={{ fontSize: FS.xs, letterSpacing: '0.06em', textTransform: 'uppercase', color: MUTED, fontFamily: sans, marginBottom: SP.xs }}>{kicker}</div>
      <div style={{ fontFamily: serif_, fontSize: FS.lg, color: INK, marginBottom: SP.xs }}>{title}</div>
      <p style={{ fontFamily: sans, fontSize: FS.sm, color: MUTED, margin: 0 }}>{children}</p>
    </div>
  );
}

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
          Secrets, DM notes, and covert marks are hidden on this face &mdash; show it to your table.
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
        subtitle="Your letter, your oracle, your dossier — and the two faces of the table."
        actions={<Segmented options={AUDIENCE_OPTIONS} value={audience} onChange={setAudience} ariaLabel="Screen audience" />}
      />

      {!settlement && (
        <Card title="Open a settlement" kicker="Nothing on the table yet">
          <p style={{ fontFamily: sans, fontSize: FS.sm, color: MUTED, margin: 0 }}>
            Open a settlement from your library to set the table &mdash; its dossier, its ledger, and
            its auspices will gather here.
          </p>
        </Card>
      )}

      {settlement && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: SP.lg, alignItems: 'start' }}>
          <DossierSummary view={view} audience={audience} />

          {/* Letter slot — V-B's Chronicler's Letter mounts here (fold seam). */}
          <SlotPlaceholder title="The Chronicler's Letter" kicker="Session prep">
            The five-minute letter that catches you up on the realm will appear here.
          </SlotPlaceholder>

          {/* Oracle slot — V-C's OraclePanel mounts here (fold seam). Hidden on the
              player face: the oracle's reads are the GM's, not the table's. */}
          {isDm && (
            <SlotPlaceholder title="The Oracle" kicker="Ask the world">
              Put a question to the world and get a cited answer. The Oracle mounts here.
            </SlotPlaceholder>
          )}

          {/* DM-only tools. The player face never renders these. */}
          {isDm && <AuspicePanel campaign={activeCampaign} />}
          {isDm && <TableLedgerPanel />}
          {isDm && <TemperamentPicker />}
        </div>
      )}
    </Page>
  );
}
