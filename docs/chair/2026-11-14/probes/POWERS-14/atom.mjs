const V = await import('/home/user/p14/src/domain/facts/factVocabulary.js');
const F = await import('/home/user/p14/src/domain/facts/factsOf.js');
for (const st of [[], ['under_siege'], ['famine'], ['occupied'], ['famine','under_siege'], ['plague_onset']]) {
  const facts = F.birthFactsOf({ institutions: [], config: { stressTypes: st }, tier: 'town' }, null);
  const d1 = V.declarationOf({ needs: [], excludes: ['crisis: under_siege, famine'] });
  const d2 = V.declarationOf({ needs: [], excludes: ['crisis: under_siege'] });
  console.log(st.join('+')||'calm', JSON.stringify(V.declarationAdmits(d1, facts)), JSON.stringify(V.declarationAdmits(d2, facts)));
}
