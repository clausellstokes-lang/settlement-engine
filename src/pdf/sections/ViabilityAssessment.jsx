/**
 * ViabilityAssessment — chapter 10. Verdict banner, magic dependency callout
 * with active magic chains, by-design contradictions, issues with suggested
 * fixes per row, warnings, structural violations, active stress effects (the
 * stress itself and its hook are the Overview crisis card's, X-3), and key metrics.
 *
 * Editable fields:
 *   - viability.summary
 *   - viability.issue.<i>.note
 *   - viability.contradiction.<i>
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, ChapterHeadline, BulletList, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { viabilityHeadline, viabilityTone } from '../lib/headlines.js';
import { Pill } from '../primitives/Pill.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { EditableText, EditableProse } from '../primitives/Editable.jsx';
import { type, palette, space, pt, swatch } from '../theme.js';
import { cap, label, noteText, smart, humanize, stripZwnj, safe } from '../lib/format.js';
import { tokenCase } from '../../domain/display/labelCase.js';
import { viabilityVerdict } from '../../domain/display/viabilityVerdict.js';
import { trimViabilitySummary } from '../../domain/display/viabilityFilter.js';
import { StateProse } from '../primitives/StateProse.jsx';

const SEVERITY_TONE = {
  critical: 'bad', severe: 'bad', high: 'bad',
  major: 'warn', warning: 'warn', medium: 'warn',
  note: 'muted', info: 'muted', low: 'muted',
};

export function ViabilityAssessment({ settlement, narrativeMode, vm, stateProse }) {
  const v = vm.viability;
  const verdict = viabilityVerdict(v);
  const issues = v.issues || [];
  const warnings = (v.warnings || []).filter(Boolean);
  const violations = v.structuralViolations || [];
  const stressCons = v.stressConsequences || [];
  const contradictions = v.byDesignContradictions || [];

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="11"
        title="Viability Assessment"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub={verdict.label}
      />

      <ChapterHeadline tone={viabilityTone(v)}>
        {viabilityHeadline(v)}
      </ChapterHeadline>

      {/* ── The mounted state prose (the screen's ProseBlock positions) ── */}
      <StateProse stateProse={stateProse} tab="viability" />

      {/* ── Verdict callout ────────────────────────────────── */}
      {/* UX consolidation 2026-10-30 (RULINGS-T2 T2-11, T2-12; X-8), print parity with the
          Outlook tab: the summary drops the plot-hook count and the dependency clause (display
          only, the DM-editable field keeps its name), and the chapter carries ONE vintage label
          below; the section headers carry no "First Survey" suffix. */}
      <Callout tone={verdict.tone} kicker="VERDICT" title={verdict.label}>
        <EditableProse
          name="viability.summary"
          defaultValue={trimViabilitySummary(v.summary || '')}
          lines={2}
          style={{ ...type.body, fontSize: pt['9.5'] }}
        />
        <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'], marginTop: 2 }}>
          Judged at the first survey; not re-run since.
        </Text>
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
          {/* magicDependency is generation-frozen; the chapter's one vintage label covers it (X-8). */}
          <Text style={{ ...type.label, color: palette.ai, fontSize: pt['8'], marginBottom: 2 }}>
            MAGIC DEPENDENCY
          </Text>
          {/* T2-15 MERGE in print: DS-DEF-9's reading (printed with the chapter's state prose)
              replaces this static explanation where it speaks. */}
          {!stateProse?.viability?.['viability.magicDependency'] && (
            <Text style={{ ...type.body, fontSize: pt['9.5'], color: palette.ink }}>
              This settlement leans on arcane infrastructure. If magic-supporting institutions
              are removed or their staff lost, the dependent chains below would fail.
            </Text>
          )}
          {v.activeMagicChains?.length > 0 && (
            <View style={{ marginTop: 3, flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
              {v.activeMagicChains.map((ch, i) => (
                <Tag key={`amc-${i}`} tone="ai">{label(ch) || humanize(String(ch))}</Tag>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ── Magic legality (premium live exports only) ─────────────────── */}
      {/* Additive + self-gating: only a campaign export (vm.liveWorld present)
          with a functioning magic system surfaces the legality facets, so a
          non-campaign / dead-magic export is byte-identical. */}
      {vm?.liveWorld && v.magicProfile?.exists && v.magicProfile.lines.length > 0 && (
        <View
          style={{
            marginBottom: space.sm,
            padding: 6,
            borderLeft: `2pt solid ${palette.cool}`,
            backgroundColor: palette.coolBg,
            borderRadius: 2,
          }}
          wrap={false}
        >
          <Text style={{ ...type.label, color: palette.cool, fontSize: pt['8'], marginBottom: 2 }}>
            MAGIC LEGALITY
          </Text>
          {v.magicProfile.lines.map((line, i) => (
            <Text key={`mag-${i}`} style={{ ...type.body, fontSize: pt['9'], color: palette.ink, lineHeight: 1.4 }}>
              {line}
            </Text>
          ))}
        </View>
      )}

      {/* ── By-design contradictions ───────────────────────── */}
      {contradictions.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.warn, fontSize: pt['8'], marginBottom: 3 }}>
            BY-DESIGN CONTRADICTIONS
          </Text>
          {/* T2-16: the coaching intro is cut in print as on screen. */}
          {contradictions.map((c, i) => (
            <View
              key={`bdc-${i}`}
              style={{ flexDirection: 'row', marginBottom: 3, alignItems: 'flex-start' }}
              wrap={false}
            >
              <Text style={{ color: palette.warn, marginRight: 4, fontSize: pt['9'] }}>»</Text>
              <View style={{ flex: 1 }}>
                <EditableText
                  name={`viability.contradiction.${i}`}
                  defaultValue={noteText(c)}
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
                bullet="•"
                itemRender={(w) => noteText(w)}
              />
            </View>
          )}
          {violations.length > 0 && (
            <View style={{ flex: 1 }}>
              {/* structuralViolations is generation-frozen; the chapter's one vintage label covers it (X-8). */}
              <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8'], marginBottom: 2 }}>
                STRUCTURAL VIOLATIONS
              </Text>
              <BulletList
                items={violations}
                tone="bad"
                bullet="×"
                itemRender={(s) => noteText(s)}
              />
            </View>
          )}
        </View>
      )}

      {/* ── Active stress effects ─────────────────────────────
          VERIFIER F18 (X-3): the stress label pills and each stress's crisis hook left this
          chapter; the Overview's crisis card owns them. The consequences stay, the twin of the
          screen's "Active Stress Effects". */}
      {stressCons.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8'], marginBottom: 3 }}>
            ACTIVE STRESS EFFECTS
          </Text>
          <BulletList
            items={stressCons}
            tone="bad"
            bullet="·"
            itemRender={(c) => label(c) || (typeof c === 'string' ? c : c?.text || '')}
          />
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
                  ...type.label_plain,
                  color: palette.muted,
                  fontSize: pt['7.5'],
                  width: 130,
                }}
              >
                {tokenCase(stripZwnj(humanize(k)))}
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
        <Text style={{ ...type.body, fontSize: pt['9'], marginTop: 1 }}>{safe(iss.description)}</Text>
      )}
      {iss.suggestedFixes?.length > 0 && (
        <View style={{ marginTop: 3 }}>
          <Text style={{ ...type.label, fontSize: pt['7'], color: palette.good, marginBottom: 1 }}>
            SUGGESTED FIXES
          </Text>
          {iss.suggestedFixes.map((fx, j) => (
            <View key={`fx-${idx}-${j}`} style={{ flexDirection: 'row', marginBottom: 1 }}>
              <Text style={{ color: palette.good, marginRight: 4, fontSize: pt['8'] }}>»</Text>
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

function formatVal(val) {
  if (val == null || val === '') return '–';
  if (typeof val === 'number') return smart(val);
  if (typeof val === 'string') return val;
  if (typeof val === 'boolean') return val ? 'yes' : 'no';
  if (typeof val === 'object') {
    if (val.deficit != null && val.deficit > 0) return `−${smart(val.deficit)}`;
    if (val.surplus != null) return `+${smart(val.surplus)}`;
    if (val.label) return val.label;
    if (val.value != null) return formatVal(val.value);
    return '–';
  }
  return String(val);
}

export default ViabilityAssessment;
