/**
 * The SAVE MUSEUM catalog (R-19).
 *
 * A committed corpus of save shapes spanning the app's schema eras. The tolerant
 * loader (saves.list → migrateSaveToV2 → migrateSettlementShape → normalizeSettlement
 * → migrateSettlementToLatest) must accept EVERY exhibit forever; saveMuseum.test.js
 * proves it against these artifacts, not against synthesized-to-fit shapes.
 *
 * PROVENANCE HONESTY (the museum's own claims-parity): each exhibit declares whether
 * it is a REAL committed historical artifact or a labeled SYNTHETIC reconstruction —
 * and where it is synthetic, whether its settlement BODY is real. The only fully-real
 * artifact that survives in the repo is the pre-v2 blob; the later-era exhibits
 * re-envelope that blob's REAL settlement bodies into the envelope shapes of their
 * era (so the content is authentic even where the envelope is reconstructed), because
 * no committed v2-era / canon-era / future-era save survives to mine.
 *
 * `envelope`: 'real' means the whole file is a verbatim historical artifact.
 *             'synthetic' means the envelope shape is a reconstruction of that era.
 * `body`:     'real' means the settlement object(s) are verbatim committed content.
 */

export const MUSEUM = [
  {
    id: 'pre-v2-2026-04',
    era: 'Pre-v2 localStorage envelope — numeric ids, ISO timestamps, spread toggles, no seed/campaignState/versionHistory; settlements pre-date schemaVersion/id/stressors; all three stress shapes.',
    file: 'legacy-saves/april-2026-v1.json', // lives in its original home; also guarded by legacySaves.fixture.test.js
    envelope: 'real',
    body: 'real',
    entries: 3,
    // Settlements enter the migration chain at v0 and get stamped to schemaVersion 1.
    expectSchemaVersion: 1,
  },
  {
    id: 'v2-draft-2026-06',
    era: 'v2 envelope — the bundled `toggles` column + dedicated `seed` column + campaignState{phase:draft}; a grandfathered pre-schemaVersion settlement body inside it.',
    file: 'save-museum/02-v2-draft-2026-06.json',
    envelope: 'synthetic',
    body: 'real', // Harrowmoor, verbatim from the pre-v2 fixture
    entries: 1,
    expectSchemaVersion: 1,
  },
  {
    id: 'campaign-canon-2026-07',
    era: 'Canonized/living save — campaignState{phase:canon} with systemState + canonizedAt + eventLog, plus a versionHistory array (the E-5 version-timeline era).',
    file: 'save-museum/03-campaign-canon-2026-07.json',
    envelope: 'synthetic',
    body: 'real', // Kelder's Reach, verbatim
    entries: 1,
    expectSchemaVersion: 1,
  },
  {
    id: 'forward-version-vNext',
    era: "The tolerant loader's HONEST LIMIT — a save from a FUTURE schema era (settlement.schemaVersion beyond this build). Must pass through with a warning, never throw, never fabricate a downgrade.",
    file: 'save-museum/04-forward-version-vNext.json',
    envelope: 'synthetic',
    body: 'real', // Thistledown, verbatim, stamped with a forward schemaVersion
    entries: 1,
    expectSchemaVersion: 99, // preserved, not clobbered — the honest pass-through
    forwardVersion: true,
  },
];
