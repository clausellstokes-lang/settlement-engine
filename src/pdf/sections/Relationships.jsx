/**
 * Relationships — chapter 12. Prominent relationship banner, neighbour
 * network with per-link plot hooks / lastEvent / flavour, inter-settlement
 * shared figures, cross-settlement conflicts, internal alliances, emergent
 * conditions, and cross-faction notes.
 *
 * Editable fields:
 *   - relationships.prominent.note
 *   - relationships.neighbour.<i>.description
 *   - relationships.neighbour.<i>.lastEvent
 *   - relationships.neighbour.<i>.flavour
 *   - relationships.neighbour.<i>.hook.<j>
 *   - relationships.cross.<i>.description
 *   - relationships.shared.<i>.description
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, ChapterHeadline, HairRule,
} from '../primitives/Dense.jsx';
import { relationshipsHeadline } from '../lib/headlines.js';
import { Callout } from '../primitives/Callout.jsx';
import { EditableText, EditableProse } from '../primitives/Editable.jsx';
import { type, palette, space, relColors, pt, swatch } from '../theme.js';
import { cap, label, hookText, humanize } from '../lib/format.js';

const REL_LABELS = {
  rival:            'Rival',
  cold_war:         'Cold War',
  hostile:          'Hostile',
  allied:           'Allied',
  secret_alliance:  'Secret Alliance',
  trade_partner:    'Trade Partner',
  patron:           'Patron',
  client:           'Client',
  criminal_network: 'Criminal Network',
};

export function Relationships({ settlement, narrativeMode, vm }) {
  const r = vm.relationships;
  const hasAny =
    r.neighbours?.length > 0 ||
    r.interSettlement?.length > 0 ||
    r.crossConflicts?.length > 0 ||
    r.internal?.length > 0 ||
    r.emergentConditions?.length > 0 ||
    !!r.prominentRelationship ||
    !!r.neighborSingle;

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="14"
        title="Relationships"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub={r.neighbours?.length ? `${r.neighbours.length} neighbour${r.neighbours.length === 1 ? '' : 's'}` : null}
      />

      <ChapterHeadline tone="gold">
        {/* relationshipsHeadline reads `neighbours` (external) + `internal`; the old
            `{ all }` shape left neighbours empty and mislabelled them as internal ties. */}
        {relationshipsHeadline({ neighbours: r.neighbours, internal: r.internal })}
      </ChapterHeadline>

      {!hasAny && (
        <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
          This settlement is not yet linked to any neighbours, conflicts, or shared NPCs.
          Use the Settlements panel to build a network.
        </Text>
      )}

      {/* ── Prominent relationship banner ────────────────────── */}
      {r.prominentRelationship && (
        <Callout
          tone="cool"
          kicker="PROMINENT RELATIONSHIP"
          title={`${humanize(r.prominentRelationship.otherSettlement || 'Neighbour')} · ${REL_LABELS[r.prominentRelationship.relationshipType] || cap(r.prominentRelationship.relationshipType || 'linked')}`}
        >
          <EditableProse
            name="relationships.prominent.note"
            defaultValue={r.prominentRelationship.description || r.prominentRelationship.flavour || r.prominentRelationship.flavor || ''}
            lines={2}
            style={{ ...type.body, fontSize: pt['9.5'] }}
          />
        </Callout>
      )}

      {/* ── Neighbour network ───────────────────────────────── */}
      {r.neighbours?.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            NEIGHBOUR NETWORK
          </Text>
          {r.neighbours.map((n, i) => (
            <NeighbourCard key={`n-${i}`} n={n} idx={i} />
          ))}
        </View>
      )}

      {/* ── Single live neighbour fallback ──────────────────── */}
      {!r.neighbours?.length && r.neighborSingle && (
        <View style={{ marginBottom: space.sm }}>
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            GENERATED NEIGHBOUR
          </Text>
          <NeighbourCard
            n={{
              name: r.neighborSingle.neighbourName || r.neighborSingle.name,
              type: r.neighborSingle.relationshipType,
              description: r.neighborSingle.description,
              hooks: r.neighborSingle.plotHooks || [],
              lastEvent: r.neighborSingle.lastEvent,
              flavour: r.neighborSingle.flavour || r.neighborSingle.flavor,
            }}
            idx={0}
          />
        </View>
      )}

      {/* ── Emergent conditions ─────────────────────────────── */}
      {r.emergentConditions?.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.ai, fontSize: pt['8'], marginBottom: 3 }}>
            EMERGENT CONDITIONS
          </Text>
          {r.emergentConditions.map((c, i) => (
            <View
              key={`ec-${i}`}
              style={{
                flexDirection: 'row',
                marginBottom: 2,
                padding: 4,
                backgroundColor: swatch['#F5F0FF'],
                borderLeft: `2pt solid ${palette.ai}`,
                borderRadius: 1,
              }}
              wrap={false}
            >
              <Text style={{ color: palette.ai, marginRight: 4, fontSize: pt['9'] }}>↯</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ ...type.body, fontSize: pt['9'] }}>
                  <Text style={{ ...type.body_em, color: palette.ai }}>
                    {humanize(c.label || c.name || c.type || 'Condition')}
                  </Text>
                  {c.description ? `  ${c.description}` : ''}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ── Inter-settlement (shared figures/stories) ───────── */}
      {r.interSettlement?.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.cool, fontSize: pt['8'], marginBottom: 3 }}>
            SHARED FIGURES & STORIES
          </Text>
          {r.interSettlement.map((rel, i) => (
            <View
              key={`is-${i}`}
              style={{
                paddingVertical: 3,
                borderBottom: i < r.interSettlement.length - 1 ? `0.3pt solid ${palette.border}` : undefined,
              }}
              wrap={false}
            >
              <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 1 }}>
                <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['9.5'], flex: 1 }}>
                  {humanize(rel.npcName || rel.title || rel.label || `Relationship ${i + 1}`)}
                </Text>
                {rel.relationshipType && <RelPill type={rel.relationshipType} />}
              </View>
              {rel.otherSettlement && (
                <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'] }}>
                  WITH: {humanize(rel.otherSettlement)}
                </Text>
              )}
              <EditableText
                name={`relationships.shared.${i}.description`}
                defaultValue={rel.description || ''}
                style={{ ...type.body, fontSize: pt['9'] }}
              />
            </View>
          ))}
        </View>
      )}

      {/* ── Cross-settlement conflicts ──────────────────────── */}
      {r.crossConflicts?.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8'], marginBottom: 3 }}>
            CROSS-SETTLEMENT CONFLICTS
          </Text>
          {r.crossConflicts.map((c, i) => (
            <View
              key={`cc-${i}`}
              style={{
                marginBottom: 4,
                padding: 5,
                border: `0.4pt solid ${palette.border}`,
                borderLeft: `2pt solid ${palette.bad}`,
                borderRadius: 2,
                backgroundColor: palette.card,
              }}
              wrap={false}
            >
              <Text style={{ ...type.body_em, color: palette.bad, fontSize: pt['10'] }}>
                {humanize(c.title || (Array.isArray(c.parties) ? c.parties.join(' vs ') : `Conflict ${i + 1}`))}
              </Text>
              {Array.isArray(c.parties) && (
                <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'], marginTop: 1 }}>
                  PARTIES: {c.parties.map(p => label(p) || humanize(String(p))).join('  vs  ')}
                </Text>
              )}
              <EditableText
                name={`relationships.cross.${i}.description`}
                defaultValue={c.description || ''}
                style={{ ...type.body, fontSize: pt['9'] }}
              />
            </View>
          ))}
        </View>
      )}

      {/* ── Internal relationships ──────────────────────────── */}
      {r.internal?.length > 0 && (
        <View>
          <HairRule />
          <Text style={{ ...type.label, color: palette.muted, fontSize: pt['8'], marginBottom: 3 }}>
            INTERNAL RELATIONSHIPS
          </Text>
          {r.internal.slice(0, 12).map((rel, i) => (
            <View key={`i-${i}`} style={{ flexDirection: 'row', marginBottom: 2 }} wrap={false}>
              <Text style={{ color: palette.cool, marginRight: 4, fontSize: pt['9'] }}>•</Text>
              <Text style={{ ...type.body, flex: 1, fontSize: pt['9'] }}>
                <Text style={{ ...type.body_em, color: palette.ink }}>
                  {humanize(rel.label || rel.title || (rel.from && rel.to ? `${rel.from} ↔ ${rel.to}` : 'Link'))}
                </Text>
                {rel.description ? `  ${rel.description}` : ''}
              </Text>
            </View>
          ))}
        </View>
      )}
    </PageChrome>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function NeighbourCard({ n, idx }) {
  const _relLabel = REL_LABELS[n.type] || (n.type ? cap(n.type) : 'Linked');
  const color = relColors[n.type] || palette.muted;
  return (
    <View
      style={{
        marginBottom: 4,
        padding: 5,
        border: `0.4pt solid ${palette.border}`,
        borderLeft: `2pt solid ${color}`,
        borderRadius: 2,
        backgroundColor: palette.card,
      }}
      wrap={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
        <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'], flex: 1 }}>
          {humanize(n.name || 'Neighbour')}
        </Text>
        <RelPill type={n.type} directionalLabel={n.directionalLabel} />
      </View>
      {n.description && (
        <EditableText
          name={`relationships.neighbour.${idx}.description`}
          defaultValue={n.description}
          style={{ ...type.body, fontSize: pt['9'] }}
        />
      )}
      {n.lastEvent && (
        <View style={{ marginTop: 2 }}>
          <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted, marginBottom: 1 }}>
            LAST EVENT
          </Text>
          <EditableText
            name={`relationships.neighbour.${idx}.lastEvent`}
            defaultValue={typeof n.lastEvent === 'string' ? n.lastEvent : (n.lastEvent?.text || n.lastEvent?.description || '')}
            style={{ ...type.body, fontSize: pt['8.5'], color: palette.second }}
          />
        </View>
      )}
      {n.flavour && (
        <View style={{ marginTop: 2 }}>
          <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted, marginBottom: 1 }}>
            FLAVOUR
          </Text>
          <EditableText
            name={`relationships.neighbour.${idx}.flavour`}
            defaultValue={n.flavour}
            style={{ ...type.italic, fontSize: pt['8.5'], color: palette.second }}
          />
        </View>
      )}
      {n.hooks?.length > 0 && (
        <View style={{ marginTop: 3 }}>
          <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted, marginBottom: 1 }}>
            PLOT HOOKS
          </Text>
          {n.hooks.map((h, j) => (
            <View key={`nh-${idx}-${j}`} style={{ flexDirection: 'row', marginBottom: 1 }}>
              <Text style={{ color: palette.gold, marginRight: 4, fontSize: pt['8'] }}>•</Text>
              <View style={{ flex: 1 }}>
                <EditableText
                  name={`relationships.neighbour.${idx}.hook.${j}`}
                  defaultValue={hookText(h)}
                  style={{ ...type.body, fontSize: pt['8.5'] }}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function RelPill({ type: relType, directionalLabel }) {
  if (!relType) return null;
  // Asymmetric links (overlord/vassal, patron/client) read directionally,
  // naming the neighbour ("Overlord of X"); the colour still keys off the
  // canonical base type so the pill tint is unchanged.
  const labelStr = directionalLabel || REL_LABELS[relType] || cap(relType);
  const color = relColors[relType] || palette.muted;
  return (
    <View
      style={{
        backgroundColor: hexWithAlpha(color, 0.12),
        paddingHorizontal: 5,
        paddingVertical: 1.5,
        borderRadius: 2,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          fontFamily: 'Nunito',
          fontSize: pt['7.5'],
          fontWeight: 700,
          letterSpacing: 0.15,
          color,
        }}
      >
        {labelStr}
      </Text>
    </View>
  );
}

function hexWithAlpha(hex, alpha) {
  const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `${hex}${a}`;
}

export default Relationships;
