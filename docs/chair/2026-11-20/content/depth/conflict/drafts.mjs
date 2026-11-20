// drafts.mjs — the 16 DRAFT quarrels (8 a branch, today's lines kept), each with its `needs` in vocabulary atoms.
export const GRAZING_POOL = [
  { id: 'g1-grazing', text: 'A dispute over grazing rights and water access has run for two seasons, and the families on each side no longer speak to one another.', needs: [] }, // TODAY'S (its thorp twin and the no-grazing twin unchanged)
  { id: 'g2-rotation', text: 'A dispute over field rotation and grazing rights has divided the village for most of this season.', needs: ['tier: village'] }, // TODAY'S (rung 16)
  { id: 'g3-mill', text: 'The miller wants a bigger share of each sack for the grinding, and the households who bring their grain say the old share was fair.', needs: ['institution: mill'] },
  { id: 'g4-road', text: 'The households along the road cannot agree who should fill the ruts outside their doors, so the work keeps being put off.', needs: ['route: road'] },
  { id: 'g5-river', text: 'The households nearest the river and those further off disagree over who may draw water first in the dry weeks.', needs: ['river'] },
  { id: 'g6-shore', text: 'Two households both claim the same stretch of shore, and neither will give way.', needs: ['coast'] },
  { id: 'g7-cows', text: "Two households graze their cows on the same patch of grass, and each says the other's beasts take more than their share.", needs: ['trade at work: dairy'] },
  { id: 'g8-long-trip', text: 'With the nearest market days away, the households argue over whose turn it is to make the long trip.', needs: ['route: isolated'] },
];
export const LEVIES_POOL = [
  { id: 'l1-levies', text: 'The council has been debating market levies for three months. The merchants have stopped attending the sessions. Both sides are now acting as if the other has already lost.', needs: ['market'] }, // TODAY'S
  { id: 'l2-millers', text: 'The millers have raised the charge for grinding, and the households who bring their grain say the old charge was fair.', needs: ['institution: mill'] },
  { id: 'l3-granary', text: 'How much grain the granary should hold back for the winter has been argued all season, and nothing is agreed.', needs: ['institution: granary'] },
  { id: 'l4-walls', text: 'Who should pay to mend the walls has been argued since spring, and every street says the next one should pay more.', needs: ['walls'] },
  { id: 'l5-watch', text: 'Everyone agrees the watch must be paid, but no one agrees how much each household should give.', needs: ['watch'] },
  { id: 'l6-taverns', text: 'The council wants the taverns closed earlier, and the tavern keepers say an earlier hour would ruin them.', needs: ['institution: tavern'] },
  { id: 'l7-forges', text: 'The smiths start their hammering before dawn, and the households beside the forges want them moved further out.', needs: ['institution: smith'] },
  { id: 'l8-dock-dues', text: 'The dock dues were raised at the start of the season, and the boat owners have complained of it ever since.', needs: ['institution: docks'] },
];
