/**
 * Section — chapter opener with eyebrow, big head, and accent rule.
 *
 * Every major chapter in the dossier opens with this primitive so the reader's
 * eye finds the section break without scanning. The accent prop lets a
 * narrative-only page swap the gold rule for the AI purple, signalling the
 * tonal shift without an explicit label.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { type, palette, space } from '../theme.js';

export function Section({ eyebrow, title, accent, children, marginTop = 0 }) {
  return (
    <View style={{ marginTop, marginBottom: space.lg }}>
      {eyebrow && (
        <Text style={{ ...type.sub_alt, color: palette.muted, marginBottom: 4 }}>{eyebrow}</Text>
      )}
      <Text style={type.page_head}>{title}</Text>
      <View
        style={{
          height: 1.5,
          width: 60,
          backgroundColor: accent || palette.gold,
          marginTop: space.sm,
          marginBottom: space.md,
        }}
      />
      {children}
    </View>
  );
}

export default Section;
