/**
 * TonightAtTheTable — chapter 02, "Tonight": THE ONE TONIGHT SHEET in print (X-51, the owner
 * 2026-11-03: "There should be one consolidated dub it tonight sheet").
 *
 * The same sheet the Table View and Session Mode render (domain/summary/tonightSheet.js ::
 * composeTonightSheet): the active crisis in one line, the people to voice, the two facts the
 * players test first (the food band and stores from economicState.foodSecurity.foodRecord, and
 * the defence facts), and the hooks. The old quick guide's identity sentence and three truths
 * live on the Overview chapter; they are not printed twice.
 *
 * Editable fields:
 *   - tonight.scratch
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { ChapterBand, GoldRule, HairRule } from '../primitives/Dense.jsx';
import { NotesField } from '../primitives/Editable.jsx';
import { type, palette, space, pt } from '../theme.js';
import { composeTonightSheet, printsAsWant, secretLeadOf, TONIGHT_COPY } from '../../domain/summary/tonightSheet.js';
import { CrisisSections } from './CrisisSections.jsx';
import { plotHookPlace } from '../lib/plotHookIndex.js';

/** The pointer a hook's title carries to its home in the Plot Hooks chapter (label + number follow). */
export const TONIGHT_HOOK_PLACE = 'In full in Plot Hooks (04):';

/** @param {{ children: string, color: string }} props */
function Eyebrow({ children, color }) {
  return (
    <Text style={{ ...type.label, color, fontSize: pt['9'], marginBottom: 4, textTransform: 'uppercase' }}>
      {children}
    </Text>
  );
}

export function TonightAtTheTable({ settlement, narrativeMode, vm }) {
  const sheet = composeTonightSheet(settlement);
  // ⛔ THE KEEP-ON RULE FOR HOOKS (STYLE-0 §3; STYLE-RULINGS-2 B4, 2026-11-09): Plot Hooks (04) keeps
  // each hook's text; this sheet prints the hook's title and where it sits in chapter 04. A hook with
  // no title, or one the chapter does not print, keeps its text here. tests/pdf/restoredSubsections.test.js (B4)
  const placeOf = (h) => (h.source && vm?.hooks?.all ? plotHookPlace(vm.hooks.all, h.text) : null);
  const why = { seat: TONIGHT_COPY.seat, secret: TONIGHT_COPY.secret, cleric: TONIGHT_COPY.cleric };

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="02"
        title={TONIGHT_COPY.title}
        accent={narrativeMode ? palette.ai : palette.gold}
      />

      {sheet.opening ? (
        <View style={{
          marginBottom: space.sm,
          padding: 6,
          backgroundColor: palette.badBg,
          borderLeft: `2pt solid ${palette.bad}`,
        }} wrap={false}>
          <Eyebrow color={palette.bad}>{sheet.crisis ? TONIGHT_COPY.crisis : TONIGHT_COPY.urgent}</Eyebrow>
          <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10.5'], lineHeight: 1.35 }}>
            {sheet.opening}
          </Text>
        </View>
      ) : null}

      {sheet.people.length > 0 ? (
        <View style={{ marginBottom: space.sm }}>
          <Eyebrow color={palette.cool}>{TONIGHT_COPY.people}</Eyebrow>
          {sheet.people.map((p) => (
            <View key={p.name} style={{ marginBottom: 5, paddingLeft: 6, borderLeft: `1.5pt solid ${palette.border}` }} wrap={false}>
              <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10.5'] }}>{p.name}</Text>
              <Text style={{ ...type.italic, color: palette.muted, fontSize: pt['8.5'] }}>
                {[p.role, p.castLabel || why[p.why]].filter(Boolean).join(' · ')}
              </Text>
              {p.line ? (
                <Text style={{ ...type.body, color: palette.second, fontSize: pt['9'], lineHeight: 1.3 }}>
                  {!printsAsWant(p) ? [secretLeadOf(p), p.line].filter(Boolean).join(' ') : p.sameAs ? `${TONIGHT_COPY.wantsSame} ${p.sameAs}.` : `${TONIGHT_COPY.wants} ${p.line}`}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}

      <HairRule />

      {sheet.facts.length > 0 ? (
        <View style={{ marginBottom: space.sm }}>
          <Eyebrow color={palette.gold}>{TONIGHT_COPY.facts}</Eyebrow>
          {sheet.facts.map((f) => (
            <View key={f.id} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3 }} wrap={false}>
              <Text style={{ ...type.label_plain, color: palette.muted, fontSize: pt['8.5'], width: 56, marginRight: 5 }}>
                {f.label}
              </Text>
              <Text style={{ ...type.body, color: palette.second, fontSize: pt['9'], lineHeight: 1.3, flex: 1 }}>
                {f.text}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {sheet.hooks.length > 0 ? (
        <View style={{ marginBottom: space.sm }}>
          <Eyebrow color={palette.gold}>{TONIGHT_COPY.hooks}</Eyebrow>
          {sheet.hooks.map((h) => {
            const place = placeOf(h);
            return (
              <View key={h.text} style={{ marginBottom: 4, paddingLeft: 8, borderLeft: `2pt solid ${palette.gold}` }} wrap={false}>
                {h.source ? <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['9'] }}>{h.source}</Text> : null}
                {place
                  ? <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'] }}>{`${TONIGHT_HOOK_PLACE} ${place.label} ${place.number}`}</Text>
                  : <Text style={{ ...type.body, color: palette.second, fontSize: pt['9'], lineHeight: 1.3 }}>{h.text}</Text>}
              </View>
            );
          })}
        </View>
      ) : null}

      {/* THE CRISIS PAGE IN PRINT (docs/DESIGN_CRISIS_TAB.md): the Crisis tab's sections, one per crisis. */}
      {/* The two facts print once, on this sheet: the crisis page drops its copy (B4). */}
      <CrisisSections settlement={settlement} printedFacts={sheet.facts} />

      <GoldRule />

      <NotesField name="tonight.scratch" lines={6} label="SESSION SCRATCH" />
    </PageChrome>
  );
}

export default TonightAtTheTable;
