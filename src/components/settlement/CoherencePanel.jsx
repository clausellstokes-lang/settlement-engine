/**
 * CoherencePanel — Surfaces draft-mode coherence warnings.
 *
 * Hidden in canon mode (changes are diegetic; the engine doesn't
 * second-guess what the DM said happened). Hidden in draft mode too if
 * the settlement has zero warnings.
 */

import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { checkDraftEdit } from '../../domain/coherence/checkDraftEdit.js';
import { GOLD, INK, MUTED, BORDER, CARD, sans, FS, SP, R } from '../theme.js';

export default function CoherencePanel() {
  const phase      = useStore(s => s.phase);
  const settlement = useStore(s => s.settlement);

  if (phase !== 'draft' || !settlement) return null;

  const warnings = checkDraftEdit(settlement);
  if (!warnings.length) return null;

  return (
    <div style={{
      background: '#fff7ec', border: `1px solid ${GOLD}`, borderRadius: R.md,
      padding: SP.sm, marginTop: SP.sm,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: FS.xs, fontWeight: 800, fontFamily: sans,
        color: '#7a4f0f', letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: SP.xs,
      }}>
        <AlertTriangle size={12} />
        Coherence checks · {warnings.length}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {warnings.map((w, i) => <Warning key={i} w={w} />)}
      </div>
    </div>
  );
}

function Warning({ w }) {
  const Icon = w.severity === 'mismatch' ? AlertTriangle : Info;
  const color = w.severity === 'mismatch' ? '#8b1a1a' : w.severity === 'suggestion' ? MUTED : '#7a4f0f';
  return (
    <div style={{
      padding: SP.xs,
      background: '#fff', border: `1px solid ${BORDER}`, borderRadius: R.sm,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <Icon size={12} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
        <div style={{ fontSize: FS.xs, fontFamily: sans, color: INK, lineHeight: 1.5 }}>
          {w.message}
        </div>
      </div>
      {w.suggestedFixes?.length > 0 && (
        <div style={{
          marginTop: 4, paddingLeft: 18,
          fontSize: FS.xxs, color: MUTED, fontFamily: sans, fontStyle: 'italic',
        }}>
          Suggestions: {w.suggestedFixes.join(' · ')}
        </div>
      )}
    </div>
  );
}
