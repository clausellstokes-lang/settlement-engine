/**
 * CrisisSections — the Crisis page in print (docs/DESIGN_CRISIS_TAB.md: "The print chapter and the
 * Foundry journal page print the same sections from the same record"). Rendered inside the
 * Tonight chapter (TonightAtTheTable.jsx), after the sheet, one block per active crisis, worst
 * first, from the one composer the Crisis tab renders (domain/crisis/crisisPage.js ::
 * composeCrisisPage): the event, the cast with each reason, the stakes, the levers, what the
 * players see first, if nothing is done. Nothing prints for a calm town.
 */
import { View, Text } from '@react-pdf/renderer';
import { type, palette, space, pt } from '../theme.js';
import { composeCrisisPage, CRISIS_PAGE_COPY } from '../../domain/crisis/crisisPage.js';
// One home per sentence on the crisis page (B4): shared with the Foundry journal's crisis page.
import { stakeLines, unprintedFacts } from '../lib/crisisPrint.js';

/** @param {{ children: string }} props */
function Label({ children }) {
  return <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8.5'], marginTop: 3, textTransform: 'uppercase' }}>{children}</Text>;
}

/** @param {{ children: import('react').ReactNode }} props */
function Line({ children }) {
  return <Text style={{ ...type.body, color: palette.second, fontSize: pt['9'], lineHeight: 1.3 }}>{children}</Text>;
}

export function CrisisSections({ settlement, printedFacts = [] }) {
  const sections = composeCrisisPage(settlement);
  if (!sections.length) return null;
  return (
    <View style={{ marginBottom: space.sm }}>
      {sections.map((s) => ({ s, stakes: stakeLines(s.stakes), seeFirst: unprintedFacts(s.seeFirst, printedFacts) })).map(({ s, stakes, seeFirst }) => (
        <View key={s.id} style={{ marginBottom: space.sm, padding: 6, borderLeft: `2pt solid ${palette.bad}` }}>
          <Text style={{ ...type.body_em, color: palette.bad, fontSize: pt['10.5'] }}>{s.line}</Text>
          {s.summary ? <Line>{s.summary}</Line> : null}
          <Label>{CRISIS_PAGE_COPY.cast}</Label>
          {s.cast.length ? s.cast.map((r) => <Line key={`${r.role}-${r.id}`}>{`${r.roleLabel}: ${r.name} · ${r.reason}`}</Line>) : <Line>{CRISIS_PAGE_COPY.nobody}</Line>}
          {s.stakes.length ? <Label>{CRISIS_PAGE_COPY.stakes}</Label> : null}
          {stakes.rows.map((k) => <Line key={k.factionId}>{`${k.factionId} ${CRISIS_PAGE_COPY.stake[k.stake]} · ${k.reason}`}</Line>)}
          {stakes.untouched ? <Line>{stakes.untouched}</Line> : null}
          <Label>{CRISIS_PAGE_COPY.levers}</Label>
          {s.levers.length ? s.levers.map((l) => <Line key={l.institution}>{l.holderName ? `${l.institution}, held by ${l.holderName}.` : `${l.institution}.`}</Line>) : <Line>{CRISIS_PAGE_COPY.noLevers}</Line>}
          {seeFirst.length ? <Label>{CRISIS_PAGE_COPY.seeFirst}</Label> : null}
          {seeFirst.map((f) => <Line key={f.id}>{`${f.label}: ${f.text}`}</Line>)}
          {s.ifNothingIsDone ? <Label>{CRISIS_PAGE_COPY.ifNothing}</Label> : null}
          {s.ifNothingIsDone ? <Line>{s.ifNothingIsDone}</Line> : null}
        </View>
      ))}
    </View>
  );
}

export default CrisisSections;
