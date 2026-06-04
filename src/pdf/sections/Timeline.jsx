/**
 * Timeline — PDF chapter rendering the canon-mode event log.
 *
 * Only meaningful for canon settlements with at least one applied
 * event. For draft settlements the chapter is skipped entirely (the
 * SettlementPDF top-level decides). When present, each entry shows the
 * narrative summary, applied date, deltas, and faction responses —
 * the same data the on-screen Timeline UI shows, in print form.
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { ChapterBand, ChapterHeadline, HairRule } from '../primitives/Dense.jsx';
import { type, palette, space, pt } from '../theme.js';

export function Timeline({ settlement, narrativeMode, vm }) {
  const log = vm?.eventLog || [];

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="03C"
        title="Timeline"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub={`${log.length} event${log.length === 1 ? '' : 's'}`}
      />
      <ChapterHeadline tone="gold">
        In-world history this settlement has acquired since canonization.
      </ChapterHeadline>

      {log.length === 0 && (
        <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
          No events recorded yet.
        </Text>
      )}

      {log.map((entry, i) => (
        <Entry key={`${entry.appliedAt}-${i}`} entry={entry} index={log.length - i} />
      ))}
    </PageChrome>
  );
}

function Entry({ entry }) {
  const ts = new Date(entry.appliedAt);
  const tsLabel = ts.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
  return (
    <View
      wrap={false}
      style={{
        marginBottom: space.sm,
        padding: 6,
        borderLeft: `2pt solid ${palette.gold}`,
        backgroundColor: palette.card,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
        <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'], flex: 1 }}>
          {entry.narrativeSummary || entry.event?.type || 'Event'}
        </Text>
        <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['7.5'] }}>
          {entry.event?.inWorldDate ? entry.event.inWorldDate : tsLabel}
        </Text>
      </View>
      {entry.event?.description && (
        <Text style={{ ...type.body, fontSize: pt['8.5'], color: palette.second, fontStyle: 'italic', marginBottom: 3 }}>
          {entry.event.description}
        </Text>
      )}
      {entry.deltas?.length > 0 && (
        <View style={{ marginBottom: 3 }}>
          {entry.deltas.slice(0, 4).map((d, i) => (
            <Text key={i} style={{ ...type.body, fontSize: pt['8'], color: palette.ink, lineHeight: 1.4 }}>
              • {d.explanation} ({d.before}→{d.after})
            </Text>
          ))}
        </View>
      )}
      {entry.factionResponses?.length > 0 && (
        <View style={{ marginTop: 3 }}>
          <HairRule />
          {entry.factionResponses.map((r, i) => (
            <View key={i} style={{ marginTop: 2 }}>
              <Text style={{ ...type.body, fontSize: pt['8'], lineHeight: 1.4 }}>
                <Text style={{ ...type.body_em, color: palette.gold }}>{r.factionName}: </Text>
                {r.response}
              </Text>
              {r.hookSeed && (
                <Text style={{ ...type.body, fontSize: pt['7.5'], color: palette.muted, fontStyle: 'italic', marginTop: 1 }}>
                  Hook: {r.hookSeed}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default Timeline;
