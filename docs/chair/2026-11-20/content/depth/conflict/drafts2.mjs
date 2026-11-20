// drafts2.mjs — the SECOND draft set (CONFLICT-LINES-2): three grazing-pool lines on the three new atoms, and the military rung's pools.
export const GRAZING_NEW = [
  { id: 'n1-water-source', text: 'The households cannot agree whose turn it is to keep the water source clean, and each says another has missed a turn.', needs: ['Water source'] },
  { id: 'n2-mill-trip', text: 'The mill is a long way off, and the households argue over whose turn it is to carry everyone\'s grain there.', needs: ['Access to external mill'] },
  { id: 'n3-commons', text: 'Some households say others put more beasts on the common grazing than their share, and nobody can agree how many each may keep there.', needs: ['Common grazing land'] },
];
// militaryEffective > 68 && !seatIsMilitary: one pool a sub-branch, today's line at index 0 (its sibling twin unchanged).
export const MILITARY_A = [ // hasMilitaryInstitution && hasCourt
  { id: 'ma0-today', text: 'The military commanders are pushing for expanded authority over civilian courts, and the council is losing ground.', needs: [] },
  { id: 'ma1-watch-disputes', text: 'The watch captains want to settle small disputes themselves instead of sending them to the court, and the council has not agreed.', needs: ['watch', 'court'] },
  { id: 'ma2-gates', text: 'The garrison wants the say over who comes in at the gates, a say the council has kept until now.', needs: ['garrison', 'gate'] },
  { id: 'ma3-own-men', text: "The garrison's officers want their own soldiers judged by their own officers, not before the civil court.", needs: ['garrison', 'court'] },
  { id: 'ma4-fines', text: "The watch has started setting fines on the spot, and the council says setting fines was never the watch's business.", needs: ['watch'] },
  { id: 'ma5-walls-money', text: "The garrison wants a larger share of the settlement's money for the walls, and the council is giving ground.", needs: ['garrison', 'walls'] },
];
export const MILITARY_B = [ // hasCivicInstitution && !hasMilitaryInstitution
  { id: 'mb0-today', text: 'The village militia captain is pushing for authority over disputes that the reeve used to handle.', needs: [] },
  { id: 'mb1-night-watch', text: 'The militia want to decide who keeps the night watch, which the council used to settle.', needs: ['militia'] },
];
export const MILITARY_C = [ // else
  { id: 'mc0-today', text: "The strongest armed household has started making decisions on everyone's behalf without asking.", needs: [] },
  { id: 'mb1-night-watch', text: 'The militia want to decide who keeps the night watch, which the council used to settle.', needs: ['militia'] },
];
