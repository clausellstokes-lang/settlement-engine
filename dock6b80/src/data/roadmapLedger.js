/**
 * roadmapLedger.js — R-30 THE PUBLIC ROADMAP (the single committed source of truth).
 *
 * The public roadmap page (components/howto/RoadmapPage.jsx) renders EXACTLY this list
 * and nothing else. There is no hand-typed roadmap item in the page: an item is on the
 * public roadmap if and only if it is an entry here. That is the claims-parity law for
 * this surface: the wall can never promise something the ledger does not carry.
 *
 * WHAT GOES HERE
 *   Forward-looking directions, written in the house voice: plain, concrete, no internal
 *   section references, no dev jargon, and NO promised dates. A roadmap states direction
 *   and honest status, not a delivery contract. When something ships, move it to
 *   'available'; when a direction is dropped, delete its entry (do not leave a stale
 *   promise).
 *
 * STATUS is one of ROADMAP_STATUSES, in ascending certainty from 'exploring' (considered)
 *   to 'building' (in progress) to 'available' (here now). The order also drives display.
 *
 * PURITY / BUDGET: pure data + pure helpers, no store import, no transport. Read lazily
 *   by the roadmap page; never on the first-paint graph.
 */

/** Roadmap statuses, ascending in certainty. A ledger entry must declare one. */
export const ROADMAP_STATUSES = Object.freeze(['exploring', 'building', 'available']);

/** House-register label for each status (what the reader sees). */
export const ROADMAP_STATUS_LABELS = Object.freeze({
  exploring: 'Exploring',
  building: 'Building',
  available: 'Available now',
});

/**
 * @typedef {{ id: string, title: string, status: 'exploring'|'building'|'available', summary: string }} RoadmapEntry
 */

/**
 * THE LEDGER. The public roadmap, in the house voice. Every entry is a real direction
 * with an honest status and no promised date. Frozen so no runtime path mutates it.
 * @type {ReadonlyArray<RoadmapEntry>}
 */
export const ROADMAP_LEDGER = Object.freeze(/** @type {RoadmapEntry[]} */ ([
  {
    id: 'same-seed',
    title: 'Same seed, same world, forever',
    status: 'available',
    summary: 'A world is stable and reproducible. The same seed always builds the same place, down to the last street, so what you share is exactly what the table gets.',
  },
  {
    id: 'the-dossier',
    title: 'A settlement that explains itself',
    status: 'available',
    summary: 'Every settlement reads as a dossier with a cause under each claim. Ask why the captain is corrupt and there is a real answer, one sentence away.',
  },
  {
    id: 'living-world',
    title: 'A world that runs while you are away',
    status: 'building',
    summary: 'Advance time and the region keeps going. Wars start and burn themselves out, trade routes shift, faiths win converts, and a chronicle writes itself. You return to what changed, and why.',
  },
  {
    id: 'shareable-worlds',
    title: 'Share a world, keep your secrets',
    status: 'building',
    summary: 'Publish a world to the gallery as a player-safe view. The party reads the public projection; the private layer stays yours alone.',
  },
  {
    id: 'the-interpreter',
    title: 'Ask the world anything, in plain words',
    status: 'building',
    summary: 'A second way to work. Ask a question and get an answer drawn from the record, or describe a change and get a careful, labeled proposal you approve or revise. The world is never rewritten behind your back.',
  },
  {
    id: 'campaign-import',
    title: 'Bring a world you already have',
    status: 'exploring',
    summary: 'Begin from your own notes or an existing map instead of a blank page, and let the engine fill in what coheres around them.',
  },
  {
    id: 'deep-map',
    title: 'A town that wears its history',
    status: 'exploring',
    summary: 'The map remembers. A burned quarter stays scarred for years, a boom district visibly rises, and the temple grows two sizes after the plague that made it beloved.',
  },
]));

/** A valid entry has an id, a title, a summary, and a known status. */
export function isValidRoadmapEntry(entry) {
  return !!entry && typeof entry === 'object'
    && typeof entry.id === 'string' && entry.id.length > 0
    && typeof entry.title === 'string' && entry.title.length > 0
    && typeof entry.summary === 'string' && entry.summary.length > 0
    && ROADMAP_STATUSES.includes(entry.status);
}

/**
 * The ledger, ordered for display: most-certain first (available, then building, then
 * exploring), stable within a status. Pure; the page renders this and only this.
 * @param {ReadonlyArray<RoadmapEntry>} [ledger]
 */
export function orderedRoadmap(ledger = ROADMAP_LEDGER) {
  const rank = (s) => ROADMAP_STATUSES.indexOf(s); // exploring 0 .. available 2
  return (Array.isArray(ledger) ? ledger : [])
    .filter(isValidRoadmapEntry)
    .map((e, i) => ({ e, i }))
    .sort((a, b) => (rank(b.e.status) - rank(a.e.status)) || (a.i - b.i))
    .map(({ e }) => e);
}
