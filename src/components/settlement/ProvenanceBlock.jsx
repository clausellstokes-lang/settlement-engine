/**
 * ProvenanceBlock — Seed + timestamps + campaign link.
 *
 * Lives in the right rail beneath NextActionRail. Audit's framing:
 * "the right rail matters" — provenance is the bottom-of-rail context
 * that makes claims like "this is canon" feel concrete. DMs need to
 * know:
 *   - which seed produced this (for replay / sharing)
 *   - when it was generated, last edited, canonized, last exported
 *   - which campaign it belongs to
 *
 * All values are read-only here; mutation happens elsewhere.
 */

import React from 'react';
import { useStore } from '../../store/index.js';
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
  const campaigns    = useStore(s => s.campaigns);
  const campaignName = save?.campaignId
    ? (campaigns.find(c => c.id === save.campaignId)?.name || null)
    : null;

  return (
    <Card kicker="Provenance" compact>
      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 8, rowGap: 4 }}>
        <Row label="Seed">{lastSeed ? <code style={codeStyle}>{shortSeed(lastSeed)}</code> : '—'}</Row>
        <Row label="Generated">{fmt(generatedAt || save?.savedAt)}</Row>
        <Row label="Last edited">{fmt(editedAt) || '—'}</Row>
        <Row label="Canonized">{fmt(canonizedAt) || 'Draft'}</Row>
        <Row label="Last export">{fmt(lastExportAt) || '—'}</Row>
        <Row label="Campaign">{campaignName || '—'}</Row>
      </dl>
    </Card>
  );
}

function Row({ label, children }) {
  return (
    <>
      <dt style={{
        fontSize: 10, fontWeight: 700, color: '#6b5340',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        letterSpacing: '0.04em', textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </dt>
      <dd style={{
        margin: 0,
        fontSize: 11, color: '#1c1409',
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
  return d.toLocaleString(undefined, {
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
  fontSize: 10, color: '#3a2a18',
  background: '#f3ead8', padding: '1px 4px', borderRadius: 3,
};
