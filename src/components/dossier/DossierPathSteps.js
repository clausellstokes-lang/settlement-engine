/**
 * DossierPathSteps.js — X-55 TRAIN THE DM (the owner, 2026-11-04: "And train them."), part 1:
 * the dossier's reading paths, in the world map's guided-help shape (map/WorldMapTourSteps.js).
 *
 * The first time a DM opens a dossier (and from the "?" afterwards) the product asks what
 * tonight is and walks the surfaces in the order that intent needs. Each step is
 * `{ sel, title, body }`: `sel` is a `data-tour` anchor on a real dossier control or tab, or
 * `null` for a step the dossier has no control for (it shows the centred card by design).
 * Two optional drivers move the dossier to the step before it is measured:
 *   `tab`  — the sub-tab the step is about; the path opens it (OutputContainer's setActiveTab);
 *   `open` — 'tonight': the step's anchor lives on the Tonight sheet, so the path opens it.
 *
 * ⛔ The copy is METHOD, never voice: what to DO with a surface at the table. Nothing here
 * describes a place, a person or speech (the owner's rule: that is the DM's).
 *
 * The pin (tests/components/dossierPathSteps.test.js) renders the landing fixture's town at
 * desktop and phone and requires every anchored step to resolve, so a path cannot drift from
 * the dossier the way the map's "Wizard News" step drifted from its toolbar.
 */

/** @typedef {{ sel: string|null, title: string, body: string, tab?: string, open?: 'tonight' }} DossierPathStep */

/** The chooser's order is the X-55 entry's order. */
export const DOSSIER_PATH_IDS = Object.freeze(['tonight', 'hub', 'region']);

/** @type {Readonly<Record<string, { label: string, hint: string, steps: readonly DossierPathStep[] }>>} */
export const DOSSIER_PATHS = Object.freeze({
  tonight: Object.freeze({
    label: 'Running tonight',
    hint: 'Ten minutes',
    steps: Object.freeze([
      { sel: 'tonight', tab: 'overview', title: 'Open Tonight', body: 'Tonight is the one sheet you run the session from. Open it first.' },
      { sel: 'tonight-crisis', open: 'tonight', title: 'The crisis and its person', body: 'Start here: what is urgent, and who it presses on.' },
      { sel: 'tonight-people', open: 'tonight', title: 'The people to voice', body: 'Voice these three tonight. What each wants drives the scenes.' },
      { sel: 'tonight-facts', open: 'tonight', title: 'What the players test first', body: 'Answer these straight when the players test them.' },
      { sel: 'tonight-hooks', open: 'tonight', title: 'The hooks', body: 'Doors the players can open. Let them choose which.' },
      { sel: null, title: 'What the players may know', body: 'Share the dossier and give the players its player view: it holds only what they may know.' },
    ]),
  }),
  hub: Object.freeze({
    label: 'Making this my hub',
    hint: 'An hour',
    steps: Object.freeze([
      { sel: 'tab-overview', tab: 'overview', title: 'Overview', body: 'Read this first: the town at a glance, and what is pressing.' },
      { sel: 'tab-power', tab: 'power', title: 'Power', body: 'Who holds the seat, who wants it, and what they can do.' },
      { sel: 'tab-npcs', tab: 'npcs', title: 'People', body: 'The people you will voice. Pin the ones you will use.' },
      { sel: 'tab-economics', tab: 'economics', title: 'Economy', body: 'What the town lives on, and what breaks if it stops.' },
      { sel: 'tab-defense', tab: 'defense', title: 'Defense', body: 'Who answers a threat, and how quickly.' },
      { sel: 'tab-plot_hooks', tab: 'plot_hooks', title: 'Hooks', body: 'The openings the town offers your players. Choose the ones you want.' },
      { sel: null, title: 'Edit what you want changed', body: 'Change anything that does not fit your table. The dossier is yours.' },
    ]),
  }),
  region: Object.freeze({
    label: 'Building a region',
    hint: 'The realm around it',
    steps: Object.freeze([
      { sel: null, title: 'The realm map', body: 'Place this town on a realm map from the Realm page.' },
      { sel: 'tab-relationships', tab: 'relationships', title: 'The neighbours', body: 'Who this town trades with, owes, and quarrels with.' },
      { sel: 'tab-chronicle', tab: 'chronicle', title: 'The pulse', body: 'Advance the realm; what changes here is recorded on this tab.' },
    ]),
  }),
});
