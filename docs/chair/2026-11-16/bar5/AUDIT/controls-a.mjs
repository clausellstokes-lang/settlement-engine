/**
 * Seat A's controls (BAR5 brief): `expect` FIND (a STANDS row: the detector must find it), NONE (EXPLAINED: it must
 * not), WEAK (reported apart), GONE (a STANDS row of the read before, cured since: found again is a finding).
 */
export const CONTROLS = [
  // LAW 1a magic
  ...['C17061', 'C29831', 'C9617', 'C33713', 'C43125'].map((id) => ({ id, law: '1a', expect: 'FIND' })),
  ...['C31972', 'C40444'].map((id) => ({ id, law: '1a', expect: 'NONE' })),
  // LAW 1b food
  { id: 'C40276', law: '1b', expect: 'FIND' }, { id: 'C33652', law: '1b', expect: 'NONE' },
  // LAW 1c power and force
  ...['C33631', 'C35627', 'C39734', 'C43925', 'C38889'].map((id) => ({ id, law: '1c', expect: 'FIND' })),
  // LAW 1d prosperity and stability
  { id: 'C32519', law: '1d', expect: 'FIND' }, { id: 'C16520', law: '1d', expect: 'NONE' },
  // LAW 4 things the town lacks
  ...['C44306', 'C42840', 'C15951', 'C30295', 'C22786', 'C2000', 'C39999'].map((id) => ({ id, law: '4', expect: 'FIND' })),
  ...['C31780', 'C42731', 'C37631', 'C31115'].map((id) => ({ id, law: '4', expect: 'WEAK' })),
  // the read before (final75): STANDS of these laws' kinds, cured since: should be GONE at this tree
  ...['C2056', 'C31074', 'C36862'].map((id) => ({ id, law: '1a', expect: 'GONE' })),
  ...['C19130', 'C20588'].map((id) => ({ id, law: '1b', expect: 'GONE' })),
  ...['C7336', 'C44796'].map((id) => ({ id, law: '1c', expect: 'GONE' })),
  { id: 'C34105', law: '1d', expect: 'GONE' },
  ...['C4412', 'C29106', 'C45961', 'C40862', 'C24951', 'C19497', 'C37943'].map((id) => ({ id, law: '4', expect: 'GONE' })),
];
