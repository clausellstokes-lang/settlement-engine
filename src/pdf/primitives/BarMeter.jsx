/**
 * BarMeter — horizontal progress bar with label and value subtext.
 *
 * Used for percentage-style stats (faction power, defense scores, income
 * source split). Container is muted cream, fill is tone-coded.
 */
import { View, Text } from '@react-pdf/renderer';
import { type, palette, pt } from '../theme.js';
import { finite, safePct } from '../lib/format.js';

export function BarMeter({
  value = 0,
  max = 100,
  label,
  sublabel,
  tone = 'gold',
  height = 6,
}) {
  const v = finite(value, 0);
  const m = finite(max, 100) || 100;
  const pct = safePct((v / m) * 100);
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
        <Text style={{ ...type.label, fontSize: pt['8.5'], color: palette.ink }}>{label}</Text>
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
