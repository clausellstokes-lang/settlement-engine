/**
 * Cover — full-bleed first page of the dossier.
 *
 * The DM picks this folder up at the table. The cover answers in one glance:
 * what is this place, how big, what shape is it in, what's actively going
 * wrong, who's in charge. Everything below the gold rule is data so a referee
 * can prep without flipping past page 1.
 *
 * Editable: cover.name, cover.subtitle, cover.tagline, cover.campaign.
 */
import { Page, View, Text } from '@react-pdf/renderer';
import { sheet, palette, type, page as pageGeo, toneBg, pt, swatch } from '../theme.js';
import { EditableText } from '../primitives/Editable.jsx';
import { humanize, num, stripZwnj, cap, label as toLabel } from '../lib/format.js';

const TONE_COLOR = (key, fallback = palette.muted) => palette[key] || fallback;

function StatCell({ label, value, sub, tone = 'gold' }) {
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: toneBg[tone] || toneBg.gold,
        borderLeft: `2pt solid ${TONE_COLOR(tone, palette.gold)}`,
        marginRight: 6,
      }}
    >
      <Text
        style={{
          fontFamily: 'Nunito',
          fontSize: pt['7.5'],
          fontWeight: 700,
          color: palette.muted,
          letterSpacing: 0.2,
        }}
      >
        {stripZwnj(String(label || '')).toUpperCase()}
      </Text>
      <Text
        style={{
          fontFamily: 'Lora',
          fontSize: pt['16'],
          fontWeight: 700,
          color: palette.ink,
          marginTop: 2,
          lineHeight: 1.05,
        }}
      >
        {value === 0 || value ? value : '—'}
      </Text>
      {sub && (
        <Text
          style={{
            fontFamily: 'Nunito',
            fontSize: pt['8'],
            color: palette.muted,
            marginTop: 1,
          }}
        >
          {sub}
        </Text>
      )}
    </View>
  );
}

function CrisisRow({ chips }) {
  if (!chips?.length) return null;
  // Show up to two crises with summary text. More than that becomes wallpaper.
  const top = chips.slice(0, 2);
  return (
    <View style={{ marginTop: 14 }}>
      <Text
        style={{
          fontFamily: 'Nunito',
          fontSize: pt['8'],
          fontWeight: 800,
          color: palette.bad,
          letterSpacing: 0.3,
          marginBottom: 4,
        }}
      >
        ACTIVE CRISES · {chips.length}
      </Text>
      {top.map((c, i) => (
        <View
          key={`crisis-${i}`}
          style={{
            flexDirection: 'row',
            marginBottom: 3,
            paddingLeft: 6,
            borderLeft: `2pt solid ${palette.bad}`,
            paddingTop: 1,
            paddingBottom: 1,
          }}
        >
          <Text style={{ fontFamily: 'Lora', fontSize: pt['11'], color: palette.ink, fontWeight: 700, marginRight: 6 }}>
            {humanize(c.label || c.icon || 'Stress')}
          </Text>
          {c.summary && (
            <Text
              style={{
                fontFamily: 'Lora',
                fontSize: pt['9.5'],
                color: palette.second,
                flex: 1,
                fontStyle: 'italic',
              }}
            >
              {c.summary}
            </Text>
          )}
        </View>
      ))}
      {chips.length > top.length && (
        <Text style={{ fontFamily: 'Nunito', fontSize: pt['8'], color: palette.muted, marginTop: 2 }}>
          + {chips.length - top.length} more. See Summary, page 2.
        </Text>
      )}
    </View>
  );
}

export function Cover({ settlement, narrativeMode = false, vm, isFounder = false, isAnonymous = false }) {
  const date = new Date().toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const ident = vm?.summary?.identity || {};
  const crisis = vm?.summary?.crisis?.chips || [];
  const situation = vm?.summary?.situation || {};
  const overview = vm?.overview || {};

  const name = ident.name || settlement?.name || 'Unnamed Settlement';
  const tier = ident.tier || (settlement?.tier ? cap(settlement.tier) : '');
  const race = ident.dominantRace || settlement?.dominantRace || settlement?.race || '';
  const region = ident.terrain || settlement?.terrain || settlement?.region || '';
  const subtitle = [tier, race && cap(race), region && cap(region)].filter(Boolean).join('  ·  ');

  // Stat strip values
  const popValue = num(ident.population);
  const popSub = ident.tier ? `${ident.tier}-tier` : null;

  const prosperity = overview.prosperity || null;
  const prosperityTone = overview.prosperityTone || 'muted';

  const safety = overview.safety || null;
  const safetyTone = overview.safetyTone || 'muted';

  const defenseLabel = situation.defense?.readiness || null;

  const govLabel = situation.power?.governanceType
    ? humanize(situation.power.governanceType)
    : null;
  const govName = situation.power?.governingName || null;

  const topExport = situation.economy?.topExport
    || (overview.primaryExports?.[0] ? toLabel(overview.primaryExports[0]) : null);

  return (
    <Page size={pageGeo.A4.size} style={sheet.coverPage}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 60,
          paddingVertical: 56,
          position: 'relative',
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ ...type.cover_meta, color: palette.muted }}>SETTLEMENT DOSSIER</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {/* Founder Edition mark — small parchment-gold pill, sits
                to the left of the AI badge when both are present so
                "Founder + AI" reads naturally rather than stacking. */}
            {isFounder && (
              <View
                style={{
                  paddingHorizontal: 10, paddingVertical: 4,
                  backgroundColor: swatch['#FBF5E6'],
                  borderRadius: 3, borderLeft: `2pt solid ${palette.gold}`,
                }}
              >
                <Text style={{ ...type.label, color: palette.ink, fontSize: pt['8'] }}>FOUNDER EDITION</Text>
              </View>
            )}
            {narrativeMode && (
              <View
                style={{
                  paddingHorizontal: 10, paddingVertical: 4,
                  backgroundColor: palette.aiTint,
                  borderRadius: 3, borderLeft: `2pt solid ${palette.ai}`,
                }}
              >
                <Text style={{ ...type.label, color: palette.ai, fontSize: pt['8'] }}>AI NARRATIVE EDITION</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Title block ───────────────────────────────────────── */}
        {/* Settlement name is plain Text, not a form field. The cover title
            must always render visibly and be extractable by text tools. */}
        <View style={{ marginTop: 38 }}>
          <Text style={{ ...type.cover_title, fontSize: pt['50'] }}>
            {stripZwnj(name).toUpperCase()}
          </Text>
          <View style={{ height: 2, width: 80, backgroundColor: palette.gold, marginTop: 14, marginBottom: 12 }} />
          <Text style={{ fontFamily: 'Lora', fontSize: pt['13'], color: palette.second, fontStyle: 'italic' }}>
            {subtitle}
          </Text>
        </View>

        {/* ── Headline stat strip ──────────────────────────────── */}
        <View style={{ marginTop: 24, flexDirection: 'row' }}>
          <StatCell
            label="Population"
            value={popValue}
            sub={popSub}
            tone="gold"
          />
          {prosperity && (
            <StatCell
              label="Prosperity"
              value={cap(prosperity)}
              sub={topExport ? `Top export: ${topExport}` : null}
              tone={prosperityTone}
            />
          )}
          {safety && (
            <StatCell
              label="Safety"
              value={cap(safety)}
              sub={defenseLabel ? `Defense: ${defenseLabel}` : null}
              tone={safetyTone}
            />
          )}
        </View>

        {/* ── Power line ───────────────────────────────────────── */}
        {(govLabel || govName) && (
          <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'baseline' }}>
            <Text
              style={{
                fontFamily: 'Nunito',
                fontSize: pt['8'],
                fontWeight: 800,
                color: palette.muted,
                letterSpacing: 0.3,
                marginRight: 6,
              }}
            >
              GOVERNED BY
            </Text>
            <Text style={{ fontFamily: 'Lora', fontSize: pt['11'], color: palette.ink, fontWeight: 700 }}>
              {govName || govLabel}
            </Text>
            {govName && govLabel && (
              <Text style={{ fontFamily: 'Lora', fontSize: pt['9'], color: palette.muted, marginLeft: 6, fontStyle: 'italic' }}>
                · {govLabel}
              </Text>
            )}
          </View>
        )}

        {/* ── Crises ──────────────────────────────────────────── */}
        <CrisisRow chips={crisis} />

        {/* ── Spacer pushes footer to bottom ──────────────────── */}
        <View style={{ flex: 1 }} />

        {/* Anonymous watermark — small parchment-stripe footer above
            the standard footer, only visible on PDFs exported without
            an account. Discourages bulk scraping for resale and frames
            the export as a "free preview" without being obnoxious.
            Wanderer/Cartographer/Founder accounts get clean exports. */}
        {isAnonymous && (
          <View
            style={{
              marginTop: 8,
              paddingHorizontal: 10, paddingVertical: 5,
              backgroundColor: swatch['#FBF5E6'],
              borderLeft: `2pt solid ${palette.gold}`,
              borderRadius: 2,
            }}
            wrap={false}
          >
            <Text style={{ ...type.cover_meta, color: palette.muted, fontSize: pt['8'] }}>
              Free preview. Forge your own at settlementforge.com
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
            paddingTop: 12, borderTop: `0.5pt solid ${palette.border}`,
          }}
        >
          <Text style={{ ...type.cover_meta, color: palette.faint }}>SETTLEMENTFORGE</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={{ ...type.cover_meta, color: palette.faint, marginRight: 6 }}>CAMPAIGN</Text>
            <View style={{ width: 130 }}>
              <EditableText
                name="cover.campaign"
                defaultValue=""
                style={{ ...type.cover_meta, color: palette.muted }}
              />
            </View>
            <Text style={{ ...type.cover_meta, color: palette.faint, marginLeft: 12, marginRight: 6 }}>DATE</Text>
            <Text style={{ ...type.cover_meta, color: palette.faint }}>{date}</Text>
          </View>
        </View>
      </View>
    </Page>
  );
}

export default Cover;
