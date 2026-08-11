/**
 * ProvenanceBlock — Seed + timestamps + campaign link.
 *
 * Lives in the right rail. Audit's framing:
 * "the right rail matters" — provenance is the bottom-of-rail context
 * that makes claims like "this is canon" feel concrete. DMs need to
 * know:
 *   - which seed produced this (for replay / sharing)
 *   - when it was generated, last edited, canonized, last exported
 *   - which campaign it belongs to
 *
 * All values are read-only here; mutation happens elsewhere.
 */

import { useStore } from '../../store/index.js';
import { FS, swatch, EMPTY_VALUE } from '../theme.js';
import Card from '../primitives/Card.jsx';

/**
 * @param {Object} props
 * @param {Object} [props.save]                  saved-settlement record
 */
export default function ProvenanceBlock({ save }) {
  const lastSeed     = useStore(s => s.lastSeed);
  const generatedAt  = useStore(s => s.generatedAt);
  const editedAt     = useStore(s => s.editedAt);
  const canonizedAt  = useStore(s => s.canonizedAt);
  const lastExportAt = useStore(s => s.lastExportAt);
  // Campaign membership runs from the CAMPAIGN to the settlement
  // (campaign.settlementIds), never the other way: no `campaignId` column was
  // ever created on a save (migration 104) and no writer has ever put one on a
  // save record. Reading `save.campaignId` therefore made this row an em-dash
  // for EVERY settlement, including genuine campaign members — it did not fail
  // to inform, it actively misinformed. `getCampaignForSettlement` is the
  // store's one spelling of that membership scan (String-normalized, active-
  // campaign only); OutputContainer and useTownScenePaneBridge already consume
  // it, so this is the third consumer of one derivation, not a third
  // derivation.
  const campaignName = useStore((s) => {
    const saveId = save?.id;
    if (saveId == null || typeof s.getCampaignForSettlement !== 'function') return null;
    return s.getCampaignForSettlement(saveId)?.name || null;
  });

  return (
    <Card kicker="Provenance" compact>
      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 8, rowGap: 4 }}>
        <Row label="Seed">{lastSeed ? <code style={codeStyle}>{shortSeed(lastSeed)}</code> : EMPTY_VALUE}</Row>
        <Row label="Generated">{fmt(generatedAt || save?.savedAt)}</Row>
        <Row label="Last edited">{fmt(editedAt) || EMPTY_VALUE}</Row>
        <Row label="Canonized">{fmt(canonizedAt) || 'Draft'}</Row>
        <Row label="Last export">{fmt(lastExportAt) || EMPTY_VALUE}</Row>
        <Row label="Campaign">{campaignName || EMPTY_VALUE}</Row>
      </dl>
    </Card>
  );
}

function Row({ label, children }) {
  return (
    <>
      <dt style={{
        fontSize: FS.xxs, fontWeight: 700, color: swatch.inkMag3,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        letterSpacing: '0.04em', textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </dt>
      <dd style={{
        margin: 0,
        fontSize: FS.xs, color: swatch.inkMag,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        {children}
      </dd>
    </>
  );
}

function fmt(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

function shortSeed(s) {
  const str = String(s);
  return str.length > 12 ? str.slice(0, 12) + '…' : str;
}

const codeStyle = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: FS.xxs, color: '#3a2a18',
  background: '#f3ead8', padding: '1px 4px',
};
