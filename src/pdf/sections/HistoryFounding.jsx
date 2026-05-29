/**
 * HistoryFounding — chapter 08. Founding decomposition (origin / foundedBy /
 * initial challenge / overcoming / stress note), age + character, sorted
 * historical events with severity + lasting effects + plot hooks, and live
 * tensions with parties + severity + plot hooks.
 *
 * Editable fields:
 *   - history.character
 *   - history.founding.<key>
 *   - history.event.<i>.description
 *   - history.event.<i>.lasting.<j>
 *   - history.event.<i>.hook.<j>
 *   - history.tension.<i>.description
 *   - history.tension.<i>.hook.<j>
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, ChapterHeadline, _KeyValRow, _BulletList, _GoldRule, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { historyHeadline } from '../lib/headlines.js';
import { Pill } from '../primitives/Pill.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { EditableText, EditableProse } from '../primitives/Editable.jsx';
import { type, palette, space, pt, swatch } from '../theme.js';
import { cap, label, hookText, humanize } from '../lib/format.js';

const FOUNDING_FIELDS = [
  { key: 'origin',           label: 'ORIGIN' },
  { key: 'foundedBy',        label: 'FOUNDED BY' },
  { key: 'initialChallenge', label: 'INITIAL CHALLENGE' },
  { key: 'overcoming',       label: 'OVERCOMING' },
  { key: 'stressNote',       label: 'STRESS NOTE' },
];

// Treat empty/whitespace-only strings as missing so the FOUNDING block doesn't
// render an empty header strip when the engine emits `{ summary: '' }` etc.
const nonBlank = (v) => typeof v === 'string' ? v.trim().length > 0 : !!v;

export function HistoryFounding({ settlement, narrativeMode, vm }) {
  const h = vm.history;
  const events = [...(h.events || [])].sort((a, b) => (a?.yearsAgo ?? 0) - (b?.yearsAgo ?? 0));
  const hasFoundingDetail = FOUNDING_FIELDS.some(f => nonBlank(h.founding?.[f.key]));
  const hasFoundingSummary = nonBlank(h.founding?.summary);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="12"
        title="History & Founding"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub={h.age != null ? `${h.age}y old` : null}
      />

      <ChapterHeadline tone="gold">
        {historyHeadline(h)}
      </ChapterHeadline>

      {/* ── Age + character ──────────────────────────────────── */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: space.sm }} wrap={false}>
        <View
          style={{
            width: 90,
            padding: 6,
            backgroundColor: swatch['#FAF3E8'],
            border: `0.5pt solid ${palette.border}`,
            borderRadius: 2,
            alignItems: 'center',
          }}
        >
          <Text style={{ ...type.label, color: palette.muted, fontSize: pt['7'] }}>SETTLEMENT AGE</Text>
          <Text style={{ ...type.numeric_xl, color: palette.ink, marginTop: 2, fontSize: pt['22'] }}>
            {h.age ?? '—'}
          </Text>
          <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'] }}>
            {h.age === 1 ? 'year' : 'years'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...type.label, color: palette.muted, fontSize: pt['7.5'], marginBottom: 2 }}>
            HISTORICAL CHARACTER
          </Text>
          <EditableProse
            name="history.character"
            defaultValue={h.historicalCharacter || ''}
            lines={4}
            style={{ ...type.italic, color: palette.ink, fontSize: pt['10'] }}
          />
        </View>
      </View>

      {/* ── Founding ──────────────────────────────────────────── */}
      {(hasFoundingSummary || hasFoundingDetail) && (
        <View style={{ marginBottom: space.sm }}>
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            FOUNDING
          </Text>
          {hasFoundingSummary && (
            <Callout tone="gold" kicker="SUMMARY">
              <EditableProse
                name="history.founding.summary"
                defaultValue={h.founding.summary}
                lines={2}
                style={{ ...type.body, fontSize: pt['9.5'] }}
              />
            </Callout>
          )}
          {hasFoundingDetail && (
            <View
              style={{
                padding: 6,
                border: `0.4pt solid ${palette.border}`,
                borderRadius: 2,
                backgroundColor: palette.card,
              }}
            >
              {FOUNDING_FIELDS.map(f =>
                nonBlank(h.founding?.[f.key]) ? (
                  <View
                    key={f.key}
                    style={{ flexDirection: 'row', marginBottom: 3, alignItems: 'flex-start' }}
                  >
                    <Text
                      style={{
                        ...type.label,
                        color: palette.muted,
                        fontSize: pt['7.5'],
                        width: 110,
                        paddingTop: 2,
                      }}
                    >
                      {f.label}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <EditableText
                        name={`history.founding.${f.key}`}
                        defaultValue={h.founding[f.key]}
                        style={{ ...type.body, fontSize: pt['9.5'] }}
                      />
                    </View>
                  </View>
                ) : null,
              )}
            </View>
          )}
        </View>
      )}

      {/* ── Events ───────────────────────────────────────────── */}
      {events.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            HISTORICAL EVENTS · {events.length}
          </Text>
          <Timeline events={events} age={h.age} />
          {events.map((ev, i) => (
            <EventRow key={`ev-${i}`} ev={ev} idx={i} />
          ))}
        </View>
      )}

      {/* ── Live tensions ────────────────────────────────────── */}
      {h.tensions?.length > 0 && (
        <View>
          <HairRule />
          <Text style={{ ...type.label, color: palette.warn, fontSize: pt['8'], marginBottom: 3 }}>
            LIVE TENSIONS · {h.tensions.length}
          </Text>
          {h.tensions.map((t, i) => (
            <TensionRow key={`t-${i}`} tension={t} idx={i} />
          ))}
        </View>
      )}
    </PageChrome>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function EventRow({ ev, idx }) {
  const sevTone = severityTone(ev.severity);
  const yearLabel = ev.yearsAgo != null ? `${ev.yearsAgo}y AGO` : (ev.recencyLabel || 'PAST');
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 4,
        borderBottom: `0.3pt solid ${palette.border}`,
      }}
      wrap={false}
    >
      <View style={{ width: 60, alignItems: 'flex-start' }}>
        <Text style={{ ...type.label, color: palette.gold, fontSize: pt['7.5'] }}>{yearLabel}</Text>
        {ev.severity && (
          <View style={{ marginTop: 3 }}>
            <Tag tone={sevTone}>{cap(ev.severity)}</Tag>
          </View>
        )}
      </View>
      <View style={{ flex: 1 }}>
        {(ev.title || ev.type) && (
          <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['9.5'] }}>
            {ev.title || humanize(ev.type)}
            {ev.title && ev.type ? (
              <Text style={{ ...type.caption, color: palette.faint, fontSize: pt['8'] }}>
                {`  · ${humanize(ev.type)}`}
              </Text>
            ) : null}
          </Text>
        )}
        {ev.description && (
          <EditableProse
            name={`history.event.${idx}.description`}
            defaultValue={ev.description}
            lines={2}
            style={{ ...type.body, fontSize: pt['9'] }}
          />
        )}
        {ev.cause && (
          <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.muted, marginTop: 1 }}>
            <Text style={{ color: palette.faint }}>Cause: </Text>{ev.cause}
          </Text>
        )}
        {ev.outcome && (
          <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.muted }}>
            <Text style={{ color: palette.faint }}>Outcome: </Text>{ev.outcome}
          </Text>
        )}
        {ev.lastingEffects?.length > 0 && (
          <View style={{ marginTop: 2 }}>
            <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted, marginBottom: 1 }}>
              LASTING EFFECTS
            </Text>
            {ev.lastingEffects.map((le, j) => (
              <View key={`le-${idx}-${j}`} style={{ flexDirection: 'row', marginBottom: 1 }}>
                <Text style={{ color: palette.cool, marginRight: 4, fontSize: pt['8'] }}>·</Text>
                <View style={{ flex: 1 }}>
                  <EditableText
                    name={`history.event.${idx}.lasting.${j}`}
                    defaultValue={typeof le === 'string' ? le : (le?.text || le?.description || '')}
                    style={{ ...type.body, fontSize: pt['8.5'] }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
        {ev.hooks?.length > 0 && (
          <View style={{ marginTop: 2 }}>
            <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted, marginBottom: 1 }}>
              PLOT HOOKS
            </Text>
            {ev.hooks.map((hk, j) => (
              <View key={`eh-${idx}-${j}`} style={{ flexDirection: 'row', marginBottom: 1 }}>
                <Text style={{ color: palette.gold, marginRight: 4, fontSize: pt['8'] }}>•</Text>
                <View style={{ flex: 1 }}>
                  <EditableText
                    name={`history.event.${idx}.hook.${j}`}
                    defaultValue={hookText(hk)}
                    style={{ ...type.body, fontSize: pt['8.5'] }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

function TensionRow({ tension, idx }) {
  const sevTone = severityTone(tension.severity);
  return (
    <View
      style={{
        marginBottom: 4,
        padding: 5,
        border: `0.4pt solid ${palette.border}`,
        borderLeft: `2pt solid ${palette[sevTone] || palette.warn}`,
        borderRadius: 2,
        backgroundColor: palette.card,
      }}
      wrap={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
        <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'], flex: 1 }}>
          {humanize(tension.label || 'Tension')}
        </Text>
        {tension.severity && <Pill tone={sevTone}>{cap(tension.severity)}</Pill>}
      </View>
      {tension.parties?.length > 0 && (
        <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'], marginBottom: 2 }}>
          PARTIES: {tension.parties.map(p => label(p) || humanize(String(p))).join('  vs  ')}
        </Text>
      )}
      {tension.description && (
        <EditableProse
          name={`history.tension.${idx}.description`}
          defaultValue={tension.description}
          lines={2}
          style={{ ...type.body, fontSize: pt['9'] }}
        />
      )}
      {tension.hooks?.length > 0 && (
        <View style={{ marginTop: 3 }}>
          <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted, marginBottom: 1 }}>
            PLOT HOOKS
          </Text>
          {tension.hooks.map((hk, j) => (
            <View key={`th-${idx}-${j}`} style={{ flexDirection: 'row', marginBottom: 1 }}>
              <Text style={{ color: palette.gold, marginRight: 4, fontSize: pt['8'] }}>•</Text>
              <View style={{ flex: 1 }}>
                <EditableText
                  name={`history.tension.${idx}.hook.${j}`}
                  defaultValue={hookText(hk)}
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

function severityTone(s) {
  const x = (s || '').toString().toLowerCase();
  if (x === 'critical' || x === 'severe' || x === 'catastrophe' || x === 'high') return 'bad';
  if (x === 'major' || x === 'warning' || x === 'medium') return 'warn';
  if (x === 'minor' || x === 'note' || x === 'low') return 'muted';
  return 'gold';
}

// ── Timeline ───────────────────────────────────────────────────────────────
// Horizontal axis: founding (left) → present (right). Each event is a dot
// positioned proportionally; severity tints the dot. Labels alternate above
// and below the line to avoid overlapping for clustered events.
function Timeline({ events, age }) {
  if (!events?.length || !age) return null;
  const max = age;
  const min = 0;
  const span = max - min || 1;
  // Compute each event's position as a percentage from left (founding) to
  // right (present). yearsAgo of `age` = founding (0%); yearsAgo of 0 = now (100%).
  const items = events.map((ev, i) => {
    const ya = ev.yearsAgo ?? 0;
    const yearFromFounding = max - ya;
    const pct = Math.max(0, Math.min(100, (yearFromFounding / span) * 100));
    return {
      ev, i, pct,
      tone: severityTone(ev.severity),
      label: ev.title || (ev.type ? ev.type.replace(/_/g, ' ') : 'Event'),
    };
  });
  return (
    <View style={{ marginBottom: 8 }} wrap={false}>
      {/* Axis with end labels */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
        <Text style={{ ...type.caption, fontSize: pt['7'], color: palette.muted }}>FOUNDING (-{age}y)</Text>
        <Text style={{ ...type.caption, fontSize: pt['7'], color: palette.muted }}>NOW</Text>
      </View>
      <View style={{ position: 'relative', height: 24 }}>
        {/* Base line */}
        <View
          style={{
            position: 'absolute',
            left: 0, right: 0, top: 11,
            height: 1,
            backgroundColor: palette.border,
          }}
        />
        {/* Dots */}
        {items.map(({ _ev, i, pct, tone }) => (
          <View
            key={`tl-${i}`}
            style={{
              position: 'absolute',
              left: `${pct}%`,
              top: 7,
              width: 9,
              height: 9,
              marginLeft: -4.5,
              borderRadius: 4.5,
              backgroundColor: palette[tone] || palette.gold,
              borderColor: palette.card,
              borderWidth: 1,
            }}
          />
        ))}
      </View>
      {/* Year ticks (every ~quarter of the span) */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 1 }}>
        {[0.25, 0.5, 0.75].map(p => (
          <Text
            key={`tick-${p}`}
            style={{ ...type.caption, fontSize: pt['6.5'], color: palette.faint }}
          >
            {Math.round(min + span * p)}y after founding
          </Text>
        ))}
      </View>
    </View>
  );
}

export default HistoryFounding;
