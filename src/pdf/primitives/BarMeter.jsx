/**
 * BarMeter — horizontal progress bar with label and value subtext.
 *
 * Used for percentage-style stats (faction power, defense scores, income
 * source split). Container is muted cream, fill is tone-coded.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { type, palette } from '../theme.js';

export function BarMeter({
  value = 0,
  max = 100,
  label,
  sublabel,
  tone = 'gold',
  height = 6,
}) {
  const pct = Math.max(0, Math.min(100, ((value || 0) / (max || 100)) * 100));
  const fg = palette[tone] || palette.gold;
  return (
    <View style={{ marginBottom: 6 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 2,
        }}
      >
        <Text style={{ ...type.label, fontSize: 8.5, color: palette.ink }}>{label}</Text>
        {sublabel && (
          <Text style={{ ...type.caption, color: palette.muted }}>{sublabel}</Text>
        )}
      </View>
      <View
        style={{
          height,
          backgroundColor: '#f0e8d8',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: fg,
          }}
        />
      </View>
    </View>
  );
}

export default BarMeter;
