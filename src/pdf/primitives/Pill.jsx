/**
 * Pill — small tinted tag for tone-coded labels (status, faction, severity).
 *
 * Tones map to palette[k] / toneBg[k] in theme.js: good, warn, bad, cool,
 * gold, muted, ai. Pass `large` to bump padding for headline contexts.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { type, palette, toneBg } from '../theme.js';

export function Pill({ tone = 'muted', children, large = false }) {
  const bg = toneBg[tone] || toneBg.muted;
  const fg = palette[tone] || palette.muted;
  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: large ? 8 : 6,
        paddingVertical: large ? 3 : 2,
        borderRadius: 2,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ ...type.pill, fontSize: large ? 9.5 : 8.5, color: fg }}>{children}</Text>
    </View>
  );
}

export default Pill;
