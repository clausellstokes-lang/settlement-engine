/**
 * ViabilityAssessment — chapter 10. Verdict banner, magic dependency callout
 * with active magic chains, by-design contradictions, issues with suggested
 * fixes per row, warnings, structural violations, active stress with crisis
 * hooks, and key metrics.
 *
 * Editable fields:
 *   - viability.summary
 *   - viability.issue.<i>.note
 *   - viability.contradiction.<i>
 *   - viability.stress.<i>.hook
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, ChapterHeadline, _KeyValRow, BulletList, _GoldRule, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { viabilityHeadline, viabilityTone } from '../lib/headlines.js';
import { Pill } from '../primitives/Pill.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { EditableText, EditableProse } from '../primitives/Editable.jsx';
import { type, palette, space, pt, swatch } from '../theme.js';
import { cap, label, smart, humanize, upper } from '../lib/format.js';

const SEVERITY_TONE = {
  critical: 'bad', severe: 'bad', high: 'bad',
  major: 'warn', warning: 'warn', medium: 'warn',
  note: 'muted', info: 'muted', low: 'muted',
};

export function ViabilityAssessment({ settlement, narrativeMode, vm }) {
  const v = vm.viability;
  const verdict = verdictOf(v);
  const issues = v.issues || [];
  const warnings = (v.warnings || []).filter(Boolean);
  const violations = v.structuralViolations || [];
  const stress = v.stress || [];
  const stressCons = v.stressConsequences || [];
  const contradictions = v.byDesignContradictions || [];

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="13"
        title="Viability Assessment"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub={verdict.label}
      />

      <ChapterHeadline tone={viabilityTone(v)}>
        {viabilityHeadline(v)}
      </ChapterHeadline>

      {/* ── Verdict callout ────────────────────────────────── */}
      <Callout tone={verdict.tone} kicker="VERDICT" title={verdict.label}>
        <EditableProse
          name="viability.summary"
          defaultValue={v.summary || ''}
          lines={2}
          style={{ ...type.body, fontSize: pt['9.5'] }}
        />
      </Callout>

      {/* ── Magic dependency ───────────────────────────────── */}
      {(v.magicDependency || v.activeMagicChains?.length > 0) && (
        <View
          style={{
            marginBottom: space.sm,
            padding: 6,
            borderLeft: `2pt solid ${palette.ai}`,
            backgroundColor: swatch['#F5F0FF'],
            borderRadius: 2,
          }}
          wrap={false}
        >
          <Text style={{ ...type.label, color: palette.ai, fontSize: pt['8'], marginBottom: 2 }}>
            MAGIC DEPENDENCY
          </Text>
          <Text style={{ ...type.body, fontSize: pt['9.5'], color: palette.ink }}>
            This settlement leans on arcane infrastructure. If magic-supporting institutions
            are removed or their staff lost, the dependent chains below would fail.
          </Text>
          {v.activeMagicChains?.length > 0 && (
            <View style={{ marginTop: 3, flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
              {v.activeMagicChains.map((ch, i) => (
                <Tag key={`amc-${i}`} tone="ai">{label(ch) || humanize(String(ch))}</Tag>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ── By-design contradictions ───────────────────────── */}
      {contradictions.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.warn, fontSize: pt['8'], marginBottom: 3 }}>
            BY-DESIGN CONTRADICTIONS
          </Text>
          {contradictions.map((c, i) => (
            <View
              key={`bdc-${i}`}
              style={{ flexDirection: 'row', marginBottom: 3, alignItems: 'flex-start' }}
              wrap={false}
            >
              <Text style={{ color: palette.warn, marginRight: 4, fontSize: pt['9'] }}>↯</Text>
              <View style={{ flex: 1 }}>
                <EditableText
                  name={`viability.contradiction.${i}`}
                  defaultValue={typeof c === 'string' ? c : (c?.text || c?.description || c?.label || '')}
                  style={{ ...type.body, fontSize: pt['9'] }}
                />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ── Issues ─────────────────────────────────────────── */}
      {issues.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8'], marginBottom: 3 }}>
            ACTIVE ISSUES · {issues.length}
          </Text>
          {issues.map((iss, i) => (
            <IssueRow key={`iss-${i}`} iss={iss} idx={i} />
          ))}
        </View>
      )}

      {/* ── Warnings + structural violations (compact rows) ── */}
      {(warnings.length > 0 || violations.length > 0) && (
        <View style={{ marginBottom: space.sm, flexDirection: 'row', gap: space.md }}>
          {warnings.length > 0 && (
            <View style={{ flex: 1 }}>
              <Text style={{ ...type.label, color: palette.warn, fontSize: pt['8'], marginBottom: 2 }}>
                WARNINGS
              </Text>
              <BulletList
                items={warnings}
                tone="warn"
                bullet="!"
                itemRender={(w) => label(w) || (typeof w === 'string' ? w : '')}
              />
            </View>
          )}
          {violations.length > 0 && (
            <View style={{ flex: 1 }}>
              <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8'], marginBottom: 2 }}>
                STRUCTURAL VIOLATIONS
              </Text>
              <BulletList
                items={violations}
                tone="bad"
                bullet="✗"
                itemRender={(s) => label(s) || (typeof s === 'string' ? s : '')}
              />
            </View>
          )}
        </View>
      )}

      {/* ── Active stress + consequences ───────────────────── */}
      {(stress.length > 0 || stressCons.length > 0) && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8'], marginBottom: 3 }}>
            ACTIVE STRESS
          </Text>
          {stress.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginBottom: 4 }}>
              {stress.map((s, i) => (
                <Pill key={`vs-${i}`} tone="bad">{s.label || humanize(String(s))}</Pill>
              ))}
            </View>
          )}
          {stress.filter(s => s.hook).map((s, i) => (
            <View key={`vsh-${i}`} style={{ flexDirection: 'row', marginBottom: 2 }} wrap={false}>
              <Text style={{ color: palette.bad, marginRight: 4, fontSize: pt['9'] }}>•</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted }}>
                  {upper(humanize(s.label || ''))}
                </Text>
                <EditableText
                  name={`viability.stress.${i}.hook`}
                  defaultValue={typeof s.hook === 'string' ? s.hook : (s.hook?.text || s.hook?.hook || '')}
                  style={{ ...type.body, fontSize: pt['9'] }}
                />
              </View>
            </View>
          ))}
          {stressCons.length > 0 && (
            <View style={{ marginTop: 3 }}>
              <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted, marginBottom: 1 }}>
                CONSEQUENCES
              </Text>
              <BulletList
                items={stressCons}
                tone="bad"
                bullet="·"
                itemRender={(c) => label(c) || (typeof c === 'string' ? c : c?.text || '')}
              />
            </View>
          )}
        </View>
      )}

      {/* ── Metrics ────────────────────────────────────────── */}
      {v.metrics && Object.keys(v.metrics).length > 0 && (
        <View>
          <HairRule />
          <Text style={{ ...type.label, color: palette.muted, fontSize: pt['8'], marginBottom: 3 }}>
            KEY METRICS
          </Text>
          {Object.entries(v.metrics).slice(0, 12).map(([k, val]) => (
            <View
              key={`m-${k}`}
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
                paddingVertical: 3,
                borderBottom: `0.3pt solid ${palette.border}`,
              }}
              wrap={false}
            >
              <Text
                style={{
                  ...type.label,
                  color: palette.muted,
                  fontSize: pt['7.5'],
                  width: 130,
                  letterSpacing: 0.2,
                }}
              >
                {upper(humanize(k))}
              </Text>
              <Text style={{ ...type.body, flex: 1, fontSize: pt['9'], color: palette.ink }}>
                {formatVal(val)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </PageChrome>
  );
}

function IssueRow({ iss, idx }) {
  const tone = SEVERITY_TONE[(iss.severity || '').toLowerCase()] || 'gold';
  return (
    <View
      style={{
        marginBottom: 4,
        padding: 5,
        border: `0.4pt solid ${palette.border}`,
        borderLeft: `2pt solid ${palette[tone] || palette.gold}`,
        borderRadius: 2,
        backgroundColor: palette.card,
      }}
      wrap={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
        <Pill tone={tone}>{cap(iss.severity || 'note')}</Pill>
        <Text style={{ ...type.body_em, fontSize: pt['10'], color: palette.ink, marginLeft: 6, flex: 1 }}>
          {iss.title || humanize(iss.type || 'Issue')}
        </Text>
      </View>
      {iss.institution && (
        <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'] }}>
          {humanize(iss.institution)}
        </Text>
      )}
      {iss.description && (
        <Text style={{ ...type.body, fontSize: pt['9'], marginTop: 1 }}>{iss.description}</Text>
      )}
      {iss.suggestedFixes?.length > 0 && (
        <View style={{ marginTop: 3 }}>
          <Text style={{ ...type.label, fontSize: pt['7'], color: palette.good, marginBottom: 1 }}>
            SUGGESTED FIXES
          </Text>
          {iss.suggestedFixes.map((fx, j) => (
            <View key={`fx-${idx}-${j}`} style={{ flexDirection: 'row', marginBottom: 1 }}>
              <Text style={{ color: palette.good, marginRight: 4, fontSize: pt['8'] }}>↳</Text>
              <Text style={{ ...type.body, fontSize: pt['8.5'], flex: 1 }}>
                {label(fx) || (typeof fx === 'string' ? fx : '')}
              </Text>
            </View>
          ))}
        </View>
      )}
      <View style={{ marginTop: 3 }}>
        <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted, marginBottom: 1 }}>
          DM NOTE
        </Text>
        <EditableText
          name={`viability.issue.${idx}.note`}
          defaultValue={iss.priorityNote || ''}
          style={{ ...type.body, fontSize: pt['8.5'] }}
        />
      </View>
    </View>
  );
}

function verdictOf(v) {
  const verdict = (v.verdict || '').toLowerCase();
  if (v.viable === true || verdict === 'viable') return { tone: 'good', label: 'Viable' };
  if (v.viable === false || verdict === 'notviable') return { tone: 'bad', label: 'Not Viable' };
  if (verdict === 'fragile') return { tone: 'warn', label: 'Fragile' };
  if (verdict === 'collapsing') return { tone: 'bad', label: 'Collapsing' };
  return { tone: v.verdictTone || 'warn', label: cap(v.verdict || 'Uncertain') };
}

function formatVal(val) {
  if (val == null || val === '') return '—';
  if (typeof val === 'number') return smart(val);
  if (typeof val === 'string') return val;
  if (typeof val === 'boolean') return val ? 'yes' : 'no';
  if (typeof val === 'object') {
    if (val.deficit != null && val.deficit > 0) return `−${smart(val.deficit)}`;
    if (val.surplus != null) return `+${smart(val.surplus)}`;
    if (val.label) return val.label;
    if (val.value != null) return formatVal(val.value);
    return '—';
  }
  return String(val);
}

export default ViabilityAssessment;
