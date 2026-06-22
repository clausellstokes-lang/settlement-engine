/**
 * PowerStructure — chapter 02. Stability + legitimacy + factions.
 *
 * Mirrors PowerTab.jsx in full:
 *   - Public legitimacy banner with breakdown chips
 *   - Stability + governing authority + governance fractured warning
 *   - Stacked power-distribution bar (all factions in one viz)
 *   - Per-faction full card: power meter, description, category, crisis note,
 *     modifiers with deltas, sub-faction members
 *   - Tensions list with severity, parties, plot hooks
 *   - Active conflicts with issue/stakes/intensity/parties/plot hooks
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, ChapterHeadline, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { powerHeadline, powerTone } from '../lib/headlines.js';
import { StackedBar, ScoreWithBreakdown } from '../primitives/Visuals.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { BarMeter } from '../primitives/BarMeter.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { EditableProse } from '../primitives/Editable.jsx';
import { type, palette, factionColors, space, pt, swatch } from '../theme.js';
import { cap, label, hookText, humanize } from '../lib/format.js';

export function PowerStructure({ settlement, narrativeMode, vm }) {
  const p = vm.power;
  const governing = p.factions.find(f => f.isGoverning);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="06"
        title="Power Structure"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub={p.governmentType ? cap(p.governmentType) : undefined}
      />

      <ChapterHeadline tone={powerTone(p)}>
        {powerHeadline(p, vm.identity)}
      </ChapterHeadline>

      {/* ── Legitimacy banner ─────────────────────────────────────── */}
      {p.legitimacy && (
        <ScoreWithBreakdown
          label="PUBLIC LEGITIMACY"
          score={p.legitimacy.score ?? null}
          scoreLabel={cap(p.legitimacy.label) || ''}
          tone={legitTone(p.legitimacy.score)}
          breakdown={p.legitimacyBreakdown}
          footer={p.governanceFractured ? '⚠ Governance fractured. No faction holds clear authority' : null}
        />
      )}

      {/* ── Stability strip ───────────────────────────────────────── */}
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: space.sm }}>
        <View style={{ flex: 1, padding: 6, backgroundColor: swatch['#FAF3E8'], border: `0.4pt solid ${palette.border}`, borderRadius: 2 }}>
          <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted }}>STABILITY</Text>
          <Text style={{ ...type.body_em, fontSize: pt['11'], color: palette.ink, marginTop: 1 }}>
            {cap(p.stability) || '–'}
          </Text>
        </View>
        {governing && (
          <View style={{ flex: 2, padding: 6, backgroundColor: swatch['#FAF3E8'], border: `0.4pt solid ${palette.border}`, borderRadius: 2 }}>
            <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted }}>GOVERNING</Text>
            <Text style={{ ...type.body_em, fontSize: pt['11'], color: palette.ink, marginTop: 1 }}>
              {governing.name}
            </Text>
            {governing.category && (
              <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['7.5'] }}>
                {cap(governing.category)}
              </Text>
            )}
          </View>
        )}
        {p.criminalCapture?.label && (
          <View style={{ flex: 1, padding: 6, backgroundColor: palette.badBg, border: `0.4pt solid ${palette.bad}`, borderRadius: 2 }}>
            <Text style={{ ...type.label, fontSize: pt['7'], color: palette.bad }}>CRIM. CAPTURE</Text>
            <Text style={{ ...type.body_em, fontSize: pt['10'], color: palette.bad, marginTop: 1 }}>
              {cap(p.criminalCapture.label)}
            </Text>
            {p.criminalCapture.score != null && (
              <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['7.5'] }}>
                {p.criminalCapture.score}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* ── Recent conflict ───────────────────────────────────────── */}
      {(() => {
        const rc = p.recentConflict;
        if (!rc) return null;
        const text = typeof rc === 'string'
          ? rc
          : (rc.description || rc.summary || rc.text || rc.label || '');
        if (!text || !String(text).trim()) return null;
        return (
          <Callout tone="warn" kicker="RECENT EVENT">
            <EditableProse
              name="power.recentConflict"
              defaultValue={text}
              lines={2}
              style={{ ...type.body, fontSize: pt['9.5'] }}
            />
          </Callout>
        );
      })()}

      {/* ── Power distribution stacked bar ───────────────────────── */}
      {p.distribution.length > 0 && (
        <View style={{ marginTop: space.sm }} wrap={false}>
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            POWER DISTRIBUTION
          </Text>
          <StackedBar
            segments={p.distribution.map(f => ({
              name: f.name,
              value: f.power,
              category: f.category || (f.isGoverning ? 'government' : null),
            }))}
            height={8}
            showLabels
          />
        </View>
      )}

      {/* ── Faction cards ─────────────────────────────────────────── */}
      <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3, marginTop: space.sm }}>
        FACTIONS
      </Text>
      {p.factions.map((f, i) => (
        <FactionCard key={`f-${i}`} faction={f} index={i} />
      ))}

      {/* ── Tensions ──────────────────────────────────────────────── */}
      {p.tensions.length > 0 && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.warn, fontSize: pt['8'], marginBottom: 3 }}>
            CURRENT TENSIONS · {p.tensions.length}
          </Text>
          {p.tensions.map((t, i) => (
            <View
              key={`t-${i}`}
              style={{
                marginBottom: 5,
                paddingLeft: 6,
                borderLeft: `2pt solid ${palette.warn}`,
                paddingTop: 1,
                paddingBottom: 2,
              }}
              wrap={false}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
                {t.severity && <Pill tone={severityTone(t.severity)}>{humanize(t.severity)}</Pill>}
                <Text style={{ ...type.body_em, fontSize: pt['9.5'], color: palette.ink, marginLeft: t.severity ? 6 : 0, flex: 1 }}>
                  {humanize(t.label || t.type || 'Tension')}
                </Text>
              </View>
              {t.description && (
                <Text style={{ ...type.body, fontSize: pt['9'] }}>
                  {t.description}
                </Text>
              )}
              {t.parties?.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 1 }}>
                  {t.parties.map((p, pi) => (
                    <Tag key={`tp-${i}-${pi}`} tone="muted">{label(p)}</Tag>
                  ))}
                </View>
              )}
              {t.hooks?.length > 0 && (
                <View style={{ marginTop: 2 }}>
                  {t.hooks.map((h, hi) => (
                    <View key={`th-${i}-${hi}`} style={{ flexDirection: 'row', marginBottom: 1 }}>
                      <Text style={{ color: palette.warn, marginRight: 4, fontSize: pt['8.5'] }}>»</Text>
                      <Text style={{ ...type.italic, color: palette.second, fontSize: pt['8.5'], flex: 1 }}>
                        {hookText(h)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* ── Conflicts ──────────────────────────────────────────── */}
      {p.conflicts.length > 0 && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8'], marginBottom: 3 }}>
            ACTIVE CONFLICTS · {p.conflicts.length}
          </Text>
          {p.conflicts.map((c, i) => (
            <View
              key={`c-${i}`}
              style={{
                marginBottom: 5,
                paddingLeft: 6,
                borderLeft: `2pt solid ${palette.bad}`,
                paddingTop: 1,
                paddingBottom: 2,
              }}
              wrap={false}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
                {c.intensity && <Pill tone={severityTone(c.intensity)}>{humanize(c.intensity)}</Pill>}
                <Text style={{ ...type.body_em, fontSize: pt['9.5'], color: palette.ink, marginLeft: c.intensity ? 6 : 0, flex: 1 }}>
                  {Array.isArray(c.parties) ? c.parties.map(label).filter(Boolean).join(' vs ') : 'Conflict'}
                </Text>
              </View>
              {c.issue && (
                <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'] }}>
                  <Text style={{ color: palette.faint }}>At issue: </Text>
                  {c.issue}
                </Text>
              )}
              {c.description && (
                <Text style={{ ...type.body, fontSize: pt['9'], marginTop: 1 }}>
                  {c.description}
                </Text>
              )}
              {c.stakes && (
                <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'], fontStyle: 'italic', marginTop: 1 }}>
                  Stakes: {c.stakes}
                </Text>
              )}
              {c.hooks?.length > 0 && (
                <View style={{ marginTop: 2 }}>
                  {c.hooks.map((h, hi) => (
                    <View key={`ch-${i}-${hi}`} style={{ flexDirection: 'row', marginBottom: 1 }}>
                      <Text style={{ color: palette.bad, marginRight: 4, fontSize: pt['8.5'] }}>»</Text>
                      <Text style={{ ...type.italic, color: palette.second, fontSize: pt['8.5'], flex: 1 }}>
                        {hookText(h)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* ── Rule & Succession (self-gating: regime lineage / conquest) ──── */}
      <RuleAndSuccession lineage={p.lineage} occupied={vm?.liveWorld?.occupied || null} />
    </PageChrome>
  );
}

/**
 * Rule & Succession — the regime lineage (`previousGovernments`) with conquest
 * provenance, plus the live occupation flag. Renders NOTHING when there's no
 * lineage and no live occupation (byte-identical off-state for a settlement that
 * has never changed hands).
 */
function RuleAndSuccession({ lineage, occupied }) {
  if ((!lineage || lineage.length === 0) && !occupied) return null;
  return (
    <View style={{ marginTop: space.sm }} wrap={false}>
      <HairRule />
      <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
        RULE &amp; SUCCESSION
      </Text>
      {occupied && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
          <Tag tone="bad">OCCUPIED</Tag>
          <Text style={{ ...type.body, fontSize: pt['9'], color: palette.bad, marginLeft: 4, flex: 1 }}>
            Held under {occupied.occupier} by right of conquest
            {occupied.sinceTick != null ? ` (since tick ${occupied.sinceTick})` : ''}.
          </Text>
        </View>
      )}
      {(lineage || []).map((g, i) => (
        <View key={`lin-${i}`} style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
          <Text style={{ ...type.body_em, fontSize: pt['9.5'], color: palette.ink, flex: 1 }}>
            {g.government || 'Prior government'}
          </Text>
          {g.cause && (
            <Tag tone={g.cause === 'conquest' ? 'bad' : g.cause === 'coup' ? 'warn' : 'muted'}>
              {humanize(g.cause)}
            </Tag>
          )}
          {g.tick != null && (
            <Text style={{ ...type.caption, color: palette.faint, fontSize: pt['7.5'], marginLeft: 4 }}>
              tick {g.tick}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

function FactionCard({ faction, index }) {
  const f = faction;
  const accent = factionColors[f.category] || (f.isGoverning ? palette.gold : palette.muted);
  return (
    <View
      style={{
        marginBottom: 6,
        padding: 6,
        border: `0.4pt solid ${palette.border}`,
        borderLeft: `2pt solid ${accent}`,
        borderRadius: 2,
        backgroundColor: palette.card,
      }}
      wrap={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 3 }}>
        <Text style={{ ...type.body_em, fontSize: pt['10.5'], color: palette.ink, flex: 1 }}>{f.name}</Text>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {f.category && <Tag tone="muted">{cap(f.category)}</Tag>}
          {f.isGoverning && <Tag tone="gold">GOVERNING</Tag>}
          <Pill tone="gold">PWR {f.power}</Pill>
        </View>
      </View>
      <BarMeter
        value={f.power}
        max={100}
        label={f.powerLabel || 'Influence'}
        sublabel={f.rawPower != null ? `raw ${f.rawPower}` : null}
        tone={f.isGoverning ? 'gold' : 'muted'}
        height={3}
      />
      {f.crisisNote && (
        <Text style={{ ...type.caption, color: palette.bad, fontSize: pt['8'], fontStyle: 'italic', marginTop: 2 }}>
          ⚠ {f.crisisNote}
        </Text>
      )}
      {f.blurb && (
        <EditableProse
          name={`power.faction.${index}.blurb`}
          defaultValue={f.blurb}
          lines={2}
          style={{ ...type.body, fontSize: pt['9'] }}
        />
      )}
      {f.description && f.description !== f.blurb && (
        <EditableProse
          name={`power.faction.${index}.description`}
          defaultValue={f.description}
          lines={2}
          style={{ ...type.caption, fontSize: pt['8.5'], color: palette.muted, marginTop: 2 }}
        />
      )}
      {f.modifiers?.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginTop: 3 }}>
          {f.modifiers.map((m, mi) => (
            <Tag
              key={`mod-${index}-${mi}`}
              tone={m.delta != null ? (m.delta > 0 ? 'good' : 'bad') : 'muted'}
            >
              {m.delta != null ? `${m.delta > 0 ? '+' : ''}${m.delta} ` : ''}
              {m.label}
            </Tag>
          ))}
        </View>
      )}
      {f.subFactions?.length > 0 && (
        <View style={{ marginTop: 3 }}>
          <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted }}>SUB-FACTIONS / GROUPS</Text>
          {f.subFactions.map((sf, si) => (
            <Text key={`sf-${index}-${si}`} style={{ ...type.caption, fontSize: pt['8'], color: palette.second }}>
              · {label(sf)}
              {Array.isArray(sf?.members) && sf.members.length > 0 && (
                <Text style={{ color: palette.muted }}> - {sf.members.map(label).filter(Boolean).join(', ')}</Text>
              )}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

function legitTone(score) {
  if (score == null) return 'muted';
  if (score >= 70) return 'good';
  if (score >= 40) return 'warn';
  return 'bad';
}

function severityTone(s) {
  const k = String(s || '').toLowerCase();
  if (k === 'critical' || k === 'high' || k === 'severe') return 'bad';
  if (k === 'medium' || k === 'moderate' || k === 'warning') return 'warn';
  return 'muted';
}

export default PowerStructure;
