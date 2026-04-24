/**
 * Callout — bordered prose block with tinted background and accent rule.
 *
 * Used for thesis statements, food-balance verdicts, AI-only notes, and any
 * passage that should visually peel off the body text. The tone prop drives
 * background tint + left-border colour.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { type, palette, space, toneBg } from '../theme.js';

export function Callout({ tone = 'gold', title, kicker, children }) {
  const bg = toneBg[tone] || toneBg.gold;
  const accent = palette[tone] || palette.gold;
  return (
    <View
      style={{
        marginVertical: space.sm,
        padding: space.md,
        backgroundColor: bg,
        borderLeft: `2pt solid ${accent}`,
        borderRadius: 2,
      }}
    >
      {kicker && (
        <Text style={{ ...type.label, color: accent, fontSize: 7.5, marginBottom: 3 }}>
          {kicker}
        </Text>
      )}
      {title && (
        <Text style={{ ...type.section, color: accent, fontSize: 13, marginBottom: 4 }}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
}

export default Callout;
