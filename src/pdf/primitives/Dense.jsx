/**
 * Dense — character-sheet-density layout primitives.
 *
 * The original PDF leaned magazine-spacious. These primitives target the
 * opposite: every page should feel like a D&D stat block — labels tight to
 * values, bullets stacked, columns packed. Generous white-space is a sin.
 *
 * Components:
 *   ChapterBand   — compact section opener (replaces tall <Section>)
 *   StatStrip     — horizontal row of mini-stats (one line each)
 *   KeyValRow     — single row of label: value pairs (no card wrapper)
 *   TwoCol        — flex: 1 / flex: 1 with optional gap
 *   ThreeCol      — three even columns
 *   BulletList    — tight bullet list, optional editable
 *   InlineMeta    — small caps meta line (e.g. "TIER · POPULATION · TERRAIN")
 *   FieldRow      — tight definition-row with EditableText value
 *   GoldRule      — thin gold rule (used between dense sections)
 *
 * All primitives default to wrap={false} where it makes sense. Use sparingly.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { type, palette, space, toneBg, pt, swatch } from '../theme.js';
import { EditableText, EditableProse } from './Editable.jsx';
import { stripZwnj } from '../lib/format.js';

// strip ZWNJ from anything destined for an uppercase-styled Text node
function up(s) {
  return typeof s === 'string' ? stripZwnj(s) : s;
}

// ── ChapterBand: dense section opener ───────────────────────────────────────
export function ChapterBand({ eyebrow, title, accent, sub }) {
  return (
    <View
      style={{
        marginBottom: space.sm,
        paddingBottom: 4,
        borderBottom: `0.6pt solid ${accent || palette.gold}`,
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
      }}
      wrap={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        {eyebrow && (
          <Text style={{ ...type.label, color: accent || palette.gold, marginRight: 8, fontSize: pt['10'] }}>
            {up(eyebrow)}
          </Text>
        )}
        <Text style={{ ...type.section, color: palette.ink, fontSize: pt['16'] }}>{title}</Text>
      </View>
      {sub && (
        <Text style={{ ...type.caption, color: palette.muted, fontStyle: 'italic' }}>{sub}</Text>
      )}
    </View>
  );
}

// ── ChapterHeadline: single-line insight that sits under the ChapterBand ────
// Lets a DM scan the chapter title + headline together to decide whether to
// flip past or read deeper. Tone color tints the leading marker bar.
export function ChapterHeadline({ children, tone = 'gold' }) {
  if (!children) return null;
  const accent = palette[tone] || palette.gold;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: space.sm,
        paddingLeft: 6,
        paddingVertical: 3,
        borderLeft: `2pt solid ${accent}`,
        backgroundColor: swatch['#FAF3E8'],
      }}
      wrap={false}
    >
      <Text
        style={{
          fontFamily: 'Lora',
          fontSize: pt['9.5'],
          fontStyle: 'italic',
          color: palette.second,
          flex: 1,
          lineHeight: 1.35,
        }}
      >
        {typeof children === 'string' ? stripZwnj(children) : children}
      </Text>
    </View>
  );
}

// ── StatStrip: row of mini-stats ────────────────────────────────────────────
export function StatStrip({ stats, marginBottom = space.sm }) {
  if (!stats?.length) return null;
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: swatch['#FAF3E8'],
        border: `0.4pt solid ${palette.border}`,
        borderRadius: 2,
        marginBottom,
      }}
      wrap={false}
    >
      {stats.map((s, i) => (
        <View
          key={`s-${i}`}
          style={{
            flex: s.flex || 1,
            paddingHorizontal: 6,
            paddingVertical: 5,
            borderLeft: i > 0 ? `0.4pt solid ${palette.border}` : undefined,
          }}
        >
          <Text style={{ ...type.label, color: palette.muted, fontSize: pt['7'] }}>{up(s.label)}</Text>
          <Text
            style={{
              fontFamily: 'Lora',
              fontSize: s.large ? 13 : 11,
              fontWeight: 700,
              color: s.tone ? palette[s.tone] || palette.ink : palette.ink,
              marginTop: 1,
            }}
          >
            {s.value || ', '}
          </Text>
          {s.sublabel && (
            <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['7.5'], marginTop: 1 }}>
              {s.sublabel}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

// ── KeyValRow: tight inline label:value pairs ───────────────────────────────
export function KeyValRow({ pairs, separator = ' · ', style }) {
  if (!pairs?.length) return null;
  const filtered = pairs.filter(p => p && (p.value != null && p.value !== ''));
  if (!filtered.length) return null;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', ...(style || {}) }}>
      {filtered.map((p, i) => (
        <React.Fragment key={`kv-${i}`}>
          {i > 0 && (
            <Text style={{ ...type.caption, color: palette.faint, marginHorizontal: 2 }}>
              {separator}
            </Text>
          )}
          <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'] }}>
            <Text style={{ color: palette.faint }}>{up(p.label)}</Text>
            <Text style={{ color: palette.ink, fontWeight: 700 }}>{` ${p.value}`}</Text>
          </Text>
        </React.Fragment>
      ))}
    </View>
  );
}

// ── TwoCol / ThreeCol ───────────────────────────────────────────────────────
// Note: `gap` on a flex row is fragile in @react-pdf/renderer. We use explicit
// `marginRight` on each non-last column instead, which always renders.
export function TwoCol({ left, right, gap = space.md, leftFlex = 1, rightFlex = 1 }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flex: leftFlex, marginRight: gap }}>{left}</View>
      <View style={{ flex: rightFlex }}>{right}</View>
    </View>
  );
}

export function ThreeCol({ a, b, c, gap = space.md }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1, marginRight: gap }}>{a}</View>
      <View style={{ flex: 1, marginRight: gap }}>{b}</View>
      <View style={{ flex: 1 }}>{c}</View>
    </View>
  );
}

// ── BulletList: tight bullets, optionally editable ──────────────────────────
export function BulletList({
  items,
  editable = false,
  fieldNamePrefix,
  bullet = '•',
  tone = 'gold',
  style,
  itemRender,
  emptyText,
}) {
  const list = (items || []).filter(x => {
    if (!x) return false;
    if (typeof x === 'string') return x.trim().length > 0;
    return true;
  });
  if (!list.length) {
    return emptyText ? (
      <Text style={{ ...type.caption, color: palette.faint, fontStyle: 'italic' }}>
        {emptyText}
      </Text>
    ) : null;
  }
  return (
    <View style={style}>
      {list.map((item, i) => {
        const text = itemRender ? itemRender(item) : labelOfItem(item);
        if (!text) return null;
        return (
          <View
            key={`b-${i}`}
            style={{ flexDirection: 'row', marginBottom: 3, alignItems: 'flex-start' }}
          >
            <Text style={{ color: palette[tone] || palette.gold, marginRight: 5, fontSize: pt['9.5'] }}>
              {bullet}
            </Text>
            {editable ? (
              <View style={{ flex: 1 }}>
                <EditableText
                  name={`${fieldNamePrefix}.${i}`}
                  defaultValue={text}
                  style={type.body}
                />
              </View>
            ) : (
              <Text style={{ ...type.body, flex: 1, fontSize: pt['9.5'] }}>{text}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

// ── FieldRow: tight Label · Editable value pair ─────────────────────────────
export function FieldRow({
  label,
  name,
  defaultValue,
  multiline = false,
  lines = 2,
  labelWidth = 90,
  marginBottom = 3,
}) {
  return (
    <View style={{ flexDirection: 'row', marginBottom, alignItems: 'flex-start' }}>
      <Text
        style={{
          ...type.label,
          color: palette.muted,
          fontSize: pt['7.5'],
          width: labelWidth,
          paddingTop: 2,
        }}
      >
        {up(label)}
      </Text>
      <View style={{ flex: 1 }}>
        {multiline ? (
          <EditableProse name={name} defaultValue={defaultValue || ''} lines={lines} style={type.body} />
        ) : (
          <EditableText name={name} defaultValue={defaultValue || ''} style={type.body} />
        )}
      </View>
    </View>
  );
}

// ── InlineMeta: small caps meta line ─────────────────────────────────────────
export function InlineMeta({ parts, color = palette.muted }) {
  const filtered = (parts || []).filter(p => p);
  if (!filtered.length) return null;
  return (
    <Text style={{ ...type.label, color, fontSize: pt['8'], letterSpacing: 0.2 }}>
      {filtered.map(p => up(p)).join('  ·  ')}
    </Text>
  );
}

// ── GoldRule: thin separator ─────────────────────────────────────────────────
export function GoldRule({ marginVertical = space.sm, color = palette.gold }) {
  return (
    <View
      style={{
        height: 0.6,
        backgroundColor: color,
        marginVertical,
        opacity: 0.7,
      }}
    />
  );
}

// ── HairRule: even thinner separator ─────────────────────────────────────────
export function HairRule({ marginVertical = 4 }) {
  return (
    <View
      style={{
        height: 0.3,
        backgroundColor: palette.border,
        marginVertical,
      }}
    />
  );
}

// ── Tag: tiny category tag (smaller than Pill) ───────────────────────────────
export function Tag({ tone = 'muted', children }) {
  const fg = palette[tone] || palette.muted;
  const bg = toneBg[tone] || toneBg.muted;
  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 1.5,
        alignSelf: 'flex-start',
        marginRight: 3,
        marginBottom: 2,
      }}
    >
      <Text style={{ ...type.pill, fontSize: pt['7'], color: fg, letterSpacing: 0.15 }}>{up(children)}</Text>
    </View>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────
function labelOfItem(item) {
  if (typeof item === 'string') return item;
  if (!item) return '';
  return item.text || item.label || item.name || item.description || item.hook || '';
}

export default {
  ChapterBand, ChapterHeadline, StatStrip, KeyValRow, TwoCol, ThreeCol,
  BulletList, FieldRow, InlineMeta, GoldRule, HairRule, Tag,
};
