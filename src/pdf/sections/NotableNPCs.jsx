/**
 * NotableNPCs — chapter 09. Full NPC sheets with motivation, secrets, hooks.
 *
 * Tiered relative to the cast (so a low-power-mostly settlement still gets
 * full-card treatment for its three top figures):
 *   - Major figures: top 3 by power → full editable card, all fields
 *   - Notable figures: next 4 → compact card with summary + motivation
 *   - Other names of note: remainder → one-line listing
 *
 * If absolute power is high enough (≥80) we still pull the figure into the
 * top tier even past the 3-cap, so a settlement with eight 90+ power players
 * isn't artificially trimmed.
 *
 * Every content text field is editable so the DM can adjust personalities,
 * motivations, and plot hooks per session.
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { ChapterBand, ChapterHeadline, KeyValRow, HairRule, Tag } from '../primitives/Dense.jsx';
import { npcsHeadline } from '../lib/headlines.js';
import { Pill } from '../primitives/Pill.jsx';
import { type, palette, space, pt } from '../theme.js';
import { label, hookText, humanize, stripZwnj } from '../lib/format.js';

/**
 * TextRow — Label · prose value pair, but the value is rendered as plain
 * text so PDF text extractors (and screen readers) see it. The previous
 * FieldRow primitive wrapped the value in a TextInput form field, which
 * displayed correctly but was invisible to pdftotext, leaving DMs with
 * "blank" sections when they grep'd the file.
 */
function TextRow({ label: l, value, multiline = false, labelWidth = 90, marginBottom = 3 }) {
  if (value == null || value === '') return null;
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
        {String(l || '').toUpperCase()}
      </Text>
      <Text style={{ ...type.body, fontSize: pt['9.5'], flex: 1, lineHeight: multiline ? 1.4 : 1.3 }}>
        {String(value)}
      </Text>
    </View>
  );
}

export function NotableNPCs({ settlement, narrativeMode, vm }) {
  const all = vm.npcs.sorted; // already sorted desc by power
  // Relative tiering: top 3 (or any with power ≥ 80) → major; next 4 → notable.
  const majorMin = 3;
  const notableMin = 4;
  const HIGH_POWER = 80;
  const major = [];
  const notable = [];
  const other = [];
  for (const npc of all) {
    const p = npc.power || 0;
    if (major.length < majorMin || p >= HIGH_POWER) {
      major.push(npc);
    } else if (notable.length < notableMin) {
      notable.push(npc);
    } else {
      other.push(npc);
    }
  }

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="04"
        title="Notable NPCs"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub={`${all.length} figure${all.length === 1 ? '' : 's'}`}
      />

      <ChapterHeadline tone="gold">
        {npcsHeadline(vm.npcs)}
      </ChapterHeadline>

      {all.length === 0 && (
        <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
          No NPCs detailed for this settlement.
        </Text>
      )}

      {major.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            MAJOR FIGURES
          </Text>
          {major.map((npc, i) => (
            <FullCard key={`maj-${i}`} npc={npc} />
          ))}
        </View>
      )}

      {notable.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            NOTABLE FIGURES
          </Text>
          <CompactGrid items={notable} />
        </View>
      )}

      {other.length > 0 && (
        <View>
          <HairRule />
          <Text style={{ ...type.label, color: palette.muted, fontSize: pt['8'], marginBottom: 3 }}>
            OTHER NAMES OF NOTE
          </Text>
          <OtherNamesGrid items={other} />
        </View>
      )}
    </PageChrome>
  );
}

function FullCard({ npc }) {
  const name = stripZwnj(npc.name || 'Unnamed');
  const title = stripZwnj(npc.title || '');
  return (
    <View
      style={{
        marginBottom: 8,
        padding: 8,
        border: `0.4pt solid ${palette.border}`,
        borderLeft: `2pt solid ${palette.gold}`,
        borderRadius: 2,
        backgroundColor: '#fffbf5',
      }}
      wrap={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 3 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['12'] }}>
            {name}
          </Text>
          {title && (
            <Text style={{ ...type.italic, color: palette.muted, fontSize: pt['9.5'] }}>
              {title}
            </Text>
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          {npc.factionLabel && <Pill tone="cool">{npc.factionLabel}</Pill>}
          <View style={{ width: 4 }} />
          <Pill tone="gold">PWR {npc.power}</Pill>
        </View>
      </View>

      {/* Identity meta line */}
      <KeyValRow
        pairs={[
          npc.race ? { label: 'RACE', value: humanize(npc.race) } : null,
          npc.gender ? { label: 'SEX', value: humanize(npc.gender) } : null,
          npc.age ? { label: 'AGE', value: npc.age } : null,
          npc.influenceLabel ? { label: 'INFL', value: npc.influenceLabel } : null,
        ].filter(Boolean)}
      />

      {npc.influenceDescription && (
        <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'], marginTop: 2, fontStyle: 'italic' }}>
          {npc.influenceDescription}
        </Text>
      )}

      {/* Description / blurb */}
      {npc.blurb && (
        <View style={{ marginTop: 4 }}>
          <Text style={{ ...type.body, fontSize: pt['9.5'], lineHeight: 1.4 }}>
            {stripZwnj(npc.blurb)}
          </Text>
        </View>
      )}

      {/* Personality, appearance, motivation — labeled prose blocks */}
      <View style={{ marginTop: 4 }}>
        <TextRow label="PERSONALITY" value={npc.personality} multiline />
        <TextRow label="APPEARANCE"  value={npc.appearance}  multiline />
        <TextRow label="MOTIVATION"  value={npc.motivation}  multiline />
      </View>

      {/* Secrets */}
      {npc.secrets?.length > 0 && (
        <View style={{ marginTop: 3 }}>
          <Text style={{ ...type.label, color: palette.bad, fontSize: pt['7.5'], marginBottom: 1 }}>
            SECRETS
          </Text>
          {npc.secrets.map((s, si) => {
            const t = typeof s === 'string' ? s : (s?.text || s?.description || '');
            if (!t) return null;
            return (
              <View key={`sec-${si}`} style={{ flexDirection: 'row', marginBottom: 1, alignItems: 'flex-start' }}>
                <Text style={{ color: palette.bad, marginRight: 4, fontSize: pt['9'] }}>·</Text>
                <Text style={{ ...type.body, fontSize: pt['9'], flex: 1 }}>{t}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Plot hooks (full list, not capped) */}
      {npc.plotHooks?.length > 0 && (
        <View style={{ marginTop: 3 }}>
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['7.5'], marginBottom: 1 }}>
            PLOT HOOKS
          </Text>
          {npc.plotHooks.map((h, hi) => {
            const t = hookText(h);
            if (!t) return null;
            return (
              <View key={`h-${hi}`} style={{ flexDirection: 'row', marginBottom: 1, alignItems: 'flex-start' }}>
                <Text style={{ color: palette.gold, marginRight: 4, fontSize: pt['9'] }}>•</Text>
                <Text style={{ ...type.body, fontSize: pt['9'], flex: 1 }}>{t}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Relationships */}
      {npc.relationships?.length > 0 && (
        <View style={{ marginTop: 3 }}>
          <Text style={{ ...type.label, color: palette.muted, fontSize: pt['7.5'], marginBottom: 1 }}>
            RELATIONSHIPS
          </Text>
          {npc.relationships.map((r, ri) => (
            <Text key={`rel-${ri}`} style={{ ...type.caption, color: palette.second, fontSize: pt['8'] }}>
              · {label(r?.with || r?.target || r?.name)}
              {r?.type ? ` — ${r.type}` : ''}
              {r?.description ? ` — ${r.description}` : ''}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * OtherNamesGrid — 2-col tight list for the long-tail "also exists" tier.
 * Each row is a single line: name · title · faction · PWR.
 */
function OtherNamesGrid({ items }) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push([items[i], items[i + 1] || null]);
  }
  return (
    <View>
      {rows.map((pair, ri) => (
        <View key={`og-${ri}`} style={{ flexDirection: 'row', marginBottom: 1 }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            {pair[0] && <OtherNameRow npc={pair[0]} />}
          </View>
          <View style={{ flex: 1 }}>
            {pair[1] && <OtherNameRow npc={pair[1]} />}
          </View>
        </View>
      ))}
    </View>
  );
}

function OtherNameRow({ npc }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        paddingVertical: 2,
        borderBottom: `0.3pt solid ${palette.border}`,
      }}
      wrap={false}
    >
      <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['9'] }}>
        {stripZwnj(npc.name || 'Unnamed')}
      </Text>
      {npc.title && (
        <Text style={{ ...type.body, color: palette.second, fontSize: pt['8.5'], marginLeft: 4, flex: 1 }}>
          · {stripZwnj(npc.title)}
        </Text>
      )}
      {!npc.title && <View style={{ flex: 1 }} />}
      {npc.factionLabel && (
        <Text style={{ ...type.caption, color: palette.cool, fontSize: pt['7.5'], marginLeft: 4 }}>
          {npc.factionLabel}
        </Text>
      )}
      <Text style={{ ...type.label, color: palette.muted, marginLeft: 5, fontSize: pt['7'] }}>
        {npc.power}
      </Text>
    </View>
  );
}

/**
 * CompactGrid — 2-col layout for the Notable Figures tier. Halves the
 * vertical footprint so the chapter fits more characters per page without
 * crowding the Major Figures cards.
 */
function CompactGrid({ items }) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push([items[i], items[i + 1] || null]);
  }
  return (
    <View>
      {rows.map((pair, ri) => (
        <View key={`cg-${ri}`} style={{ flexDirection: 'row', marginBottom: 4 }}>
          <View style={{ flex: 1, marginRight: 5 }}>
            {pair[0] && <CompactCard npc={pair[0]} />}
          </View>
          <View style={{ flex: 1 }}>
            {pair[1] && <CompactCard npc={pair[1]} />}
          </View>
        </View>
      ))}
    </View>
  );
}

function CompactCard({ npc }) {
  const name = stripZwnj(npc.name || 'Unnamed');
  const title = stripZwnj(npc.title || '');
  return (
    <View
      style={{
        padding: 6,
        border: `0.4pt solid ${palette.border}`,
        borderRadius: 2,
        backgroundColor: '#fffbf5',
        minHeight: 60,
      }}
      wrap={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'], flex: 1 }}>
          {name}
        </Text>
        <Pill tone="gold">PWR {npc.power}</Pill>
      </View>
      {(title || npc.factionLabel) && (
        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 1 }}>
          {title && (
            <Text style={{ ...type.italic, color: palette.muted, fontSize: pt['8.5'], flex: 1 }}>
              {title}
            </Text>
          )}
          {npc.factionLabel && <Tag tone="cool">{npc.factionLabel}</Tag>}
        </View>
      )}
      {npc.motivation && (
        <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.muted, marginTop: 2, lineHeight: 1.3 }}>
          <Text style={{ color: palette.faint }}>Motive: </Text>
          {npc.motivation}
        </Text>
      )}
      {npc.plotHooks?.length > 0 && (
        <View style={{ marginTop: 2 }}>
          {npc.plotHooks.slice(0, 2).map((h, hi) => {
            const t = hookText(h);
            if (!t) return null;
            return (
              <View key={`h-${hi}`} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text style={{ color: palette.gold, marginRight: 3, fontSize: pt['8'] }}>•</Text>
                <Text style={{ ...type.body, fontSize: pt['8'], flex: 1, lineHeight: 1.3 }}>{t}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default NotableNPCs;
