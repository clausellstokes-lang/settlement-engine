/**
 * Pill - small tinted tag for tone-coded labels (status, faction, severity).
 *
 * Tones map to palette[k] / toneBg[k] in theme.js: good, warn, bad, cool,
 * gold, muted, ai. Pass `large` to bump padding for headline contexts.
 */
import { View, Text } from '@react-pdf/renderer';
import { type, palette, toneBg } from '../theme.js';
import { stripZwnj } from '../lib/format.js';

export function Pill({ tone = 'muted', children, large = false }) {
  const bg = toneBg[tone] || toneBg.muted;
  const fg = palette[tone] || palette.muted;
  // Pill text isn't uppercase-transformed by the type style here, but consumers
  // often pass humanize()'d strings that contain ZWNJ. ZWNJ between letters
  // creates a soft line-break in some readers - strip it.
  const text = typeof children === 'string' ? stripZwnj(children) : children;
  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: large ? 8 : 6,
        paddingVertical: large ? 3 : 2,
        borderRadius: 2,
        alignSelf: 'flex-start',
        marginRight: 4,
        marginBottom: 2,
      }}
    >
      <Text style={{ ...type.pill, fontSize: large ? 9.5 : 8.5, color: fg }}>{text}</Text>
    </View>
  );
}

export default Pill;
