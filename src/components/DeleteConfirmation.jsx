/**
 * DeleteConfirmation — Reusable inline delete confirmation panel.
 *
 * Renders an expandable warning with context-aware messaging.
 * Used by SettlementsPanel, CampaignSection, Compendium, and WorldMap.
 */
import React from 'react';
import { CARD, SECOND, BORDER, sans } from './theme.js';

export default function DeleteConfirmation({ entityName, details, onConfirm, onCancel }) {
  return (
    <div style={{
      marginTop: 6, padding: '10px 12px',
      background: '#fdf4f4', border: '1px solid #e8c0c0',
      borderRadius: 6,
    }}>
      <div style={{ fontSize: 12, color: '#8b1a1a', fontWeight: 600, marginBottom: 5 }}>
        Delete "{entityName}"?
      </div>
      {details && (
        <div style={{ fontSize: 11, color: '#6b5340', lineHeight: 1.5, marginBottom: 8 }}>
          {details}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onConfirm}
          style={{
            padding: '5px 14px', background: '#8b1a1a', color: '#fff',
            border: 'none', borderRadius: 4, cursor: 'pointer',
            fontSize: 11, fontWeight: 700, fontFamily: sans,
          }}
        >
          Yes, delete permanently
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '5px 10px', background: CARD, color: SECOND,
            border: `1px solid ${BORDER}`, borderRadius: 4, cursor: 'pointer',
            fontSize: 11, fontFamily: sans,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
