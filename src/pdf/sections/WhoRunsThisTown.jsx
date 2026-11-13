/**
 * WhoRunsThisTown — THE DM VIEW in the PDF's Power Structure chapter (the allegiance train, car 3,
 * ALLEGIANCE-CAR3, 2026-11-08; docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md §9): the same blocks as
 * the Power tab's DM panel (`components/new/tabs/WhoRunsThisTownPanel.jsx`), read from the view
 * model's `dm` rows (`pdf/lib/viewModel.js`, built only when the caller asks for the DM layer:
 * SettlementPDF, the DM's own dossier — never the Foundry journal). Renders NOTHING when `dm` is absent,
 * so every other export is byte-identical. "Who hunts whom" is car 4's: no block yet.
 */
import { View, Text } from '@react-pdf/renderer';
import { Callout } from '../primitives/Callout.jsx';
import { type, palette, pt, space } from '../theme.js';
import { boostWords, rulingHeadOf } from '../../data/people/dmPowerLines.js';
// ROUND THREE, ruling (a): a person's house is printed by its label, the one display leaf the page reads.
import { institutionHouseLabel } from '../../domain/display/institutionDisplayName.js';

const PLACE = Object.freeze({ 1: 'Head', 2: 'Second', 3: 'Third', steward: 'Steward' });
const RANK_WORD = Object.freeze({ 1: 'first', 2: 'second', 3: 'third' });

const headStyle = { ...type.label, color: palette.gold, fontSize: pt['8'], marginTop: space.sm, marginBottom: 2 };
const rowStyle = { ...type.body, fontSize: pt['9'] };
const lineStyle = { ...type.body, fontSize: pt['9'], fontStyle: 'italic', marginLeft: 8, marginBottom: 2 };

/** @param {{ dm?: ReturnType<typeof import('../../domain/people/patronage.js').dmPowerViewOf> }} props */
export function WhoRunsThisTown({ dm }) {
  if (!dm) return null;
  return (
    <View style={{ marginTop: space.sm }}>
      <Callout tone="bad" kicker="FOR THE DM ONLY" title={`Who really runs this ${dm.tierNoun}`}>
        <Text style={headStyle}>{rulingHeadOf(dm.rulingThree.length, dm.ruler).toUpperCase()}</Text>
        {dm.rulingThree.map((f) => (
          <View key={f.id} wrap={false}>
            <Text style={rowStyle}>
              {`${f.place || PLACE[f.rank]} · ${f.name}${f.title ? `, ${f.title}` : ''}`}
              {f.openPowers.length ? ` · also ${f.openPowers.map((m) => (m.rank ? `${RANK_WORD[m.rank]} in ${m.powerName}` : `in ${m.powerName}`)).join(', ')}` : ''}
              {f.answersTo ? ` · answers to ${f.answersTo.guild}${f.answersTo.handler ? ` through ${f.answersTo.handler}` : ''}` : ''}
            </Text>
            {f.lends.map((l) => <Text key={l.powerName} style={lineStyle}>{l.line}</Text>)}
          </View>
        ))}

        {dm.answers.length > 0 && <Text style={headStyle}>WHO ANSWERS TO WHOM</Text>}
        {dm.answers.map((g) => (
          <View key={g.guild}>
            <Text style={rowStyle}>{`${g.guild}${g.boss ? ` · led by ${g.boss.name}${g.boss.title ? `, ${g.boss.title}` : ''}` : ''}`}</Text>
            {g.handlers.map((h) => (
              <View key={h.id} style={{ marginLeft: 8 }}>
                <Text style={rowStyle}>{`handled by ${h.name}${h.title ? `, ${h.title}` : ''}${h.house ? ` (${institutionHouseLabel(h.house)})` : ''}`}</Text>
                {h.agents.map((a) => (
                  <Text key={a.id} style={{ ...rowStyle, marginLeft: 8 }}>
                    {`${a.name}${a.title ? `, ${a.title}` : ''}${a.house ? ` (${institutionHouseLabel(a.house)})` : ''} · brings ${a.brings}${a.tie ? ` · ${a.tie}` : ''}`}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ))}

        {dm.fronts.length > 0 && <Text style={headStyle}>THE FRONTS</Text>}
        {dm.fronts.map((f) => (
          <Text key={f.id} style={rowStyle}>{`${institutionHouseLabel(f.house)} · ${f.name} · fronts for ${f.guild}${f.handler ? ` · handled by ${f.handler}` : ''}`}</Text>
        ))}

        <Text style={headStyle}>THE HALL</Text>
        <Text style={rowStyle}>{`${dm.hall.label}. ${dm.hall.line}`}</Text>

        {dm.boosts.length > 0 && <Text style={headStyle}>THE BOOSTS</Text>}
        {dm.boosts.map((b) => (
          <View key={b.powerName} wrap={false}>
            <Text style={rowStyle}>{`${b.powerName} · ${boostWords(b.base, b.boost)}`}</Text>
            <Text style={lineStyle}>{b.line}</Text>
          </View>
        ))}
      </Callout>
    </View>
  );
}

export default WhoRunsThisTown;
