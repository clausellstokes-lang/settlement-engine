/**
 * StatTile — a single boxed stat with label, value, and optional sub-label.
 *
 * Used in headline rows. The tone prop lets the value pick up an accent
 * color for at-a-glance reads (e.g. red for poor prosperity).
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { type, palette } from '../theme.js';

export function StatTile({ value, label, sublabel, tone = 'ink', flex = 1 }) {
  const fg = palette[tone] || palette.ink;
  return (
    <View
      style={{
        flex,
        padding: 10,
        backgroundColor: '#faf3e8',
        border: `0.5pt solid ${palette.border}`,
        borderRadius: 3,
      }}
    >
      <Text style={{ ...type.label, color: palette.muted, fontSize: 7.5 }}>{label}</Text>
      <Text style={{ ...type.numeric, color: fg, marginTop: 4 }}>{value || '—'}</Text>
      {sublabel && (
        <Text style={{ ...type.caption, color: palette.muted, marginTop: 2 }}>{sublabel}</Text>
      )}
    </View>
  );
}

export default StatTile;
