/**
 * Heading — sub-section headings inside a Section.
 *
 * Levels:
 *   1 → page_head (rare; usually the Section primitive owns level 1)
 *   2 → section   (mid-chapter break)
 *   3 → sub       (gold uppercase eyebrow-as-heading)
 *   4 → sub_alt   (muted variant for tertiary breaks)
 *
 * Pass `color` to override (e.g. AI purple for narrative-only headings).
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { type, palette, space } from '../theme.js';

const LEVELS = {
  1: type.page_head,
  2: type.section,
  3: type.sub,
  4: type.sub_alt,
};

export function Heading({ level = 2, children, color, eyebrow, marginTop = space.md, marginBottom = space.sm }) {
  const baseStyle = LEVELS[level] || type.section;
  const style = color ? { ...baseStyle, color } : baseStyle;
  return (
    <View style={{ marginTop, marginBottom }}>
      {eyebrow && (
        <Text style={{ ...type.sub_alt, color: palette.muted, marginBottom: 2 }}>{eyebrow}</Text>
      )}
      <Text style={style}>{children}</Text>
    </View>
  );
}

export default Heading;
