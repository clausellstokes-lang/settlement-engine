/**
 * heraldDeskGolden.js — THE NON-OMNISCIENT HERALD GOLDEN'S ONE PRODUCER (FP IN-5, commit 1).
 *
 * The `belief_misjudgment` refile (J-INF-6) is NOT dark-safe: its producer is gated on
 * `beliefsActive`, and the Full Simulation preset ships `infoMode: 'full'`, so moving the kind's
 * desk changes what a reachable, already-supported realm shows (docs/DESIGN_FP_INFORMATION.md §3,
 * docs/DESIGN_FP_ARCH_IN.md §2). The goldens-first discipline therefore captures the Herald of
 * such a realm BEFORE the routing table moves, and holds it byte-stable after.
 *
 * THE REALM is the reader corpus's own full_simulation row (`rr-fresh-full`), composed and
 * advanced by the repo's own harness (scripts/review/readerCorpus.mjs), one year at the harness's
 * own grain. THE READ is the Herald's pure display selector (`buildHeraldFeed`, campaign lens).
 *
 * THE MANIFEST SPLITS WHAT A REFILE MAY MOVE FROM WHAT IT MAY NOT:
 *   `<row>|contentSha256`   every item's content EXCEPT its section (id, kind, headline, summary,
 *                           severity, major, tick, reasons, affected ids, provenance), sorted by id.
 *                           A routing change moves no byte of this; a moved byte is an engine or
 *                           content change and a STOP.
 *   `<row>|itemCount`       the closure count of the above.
 *   `<row>|section|<id>`    the desk each item filed under WHEN CAPTURED. The suite asserts the
 *                           live desk equals this for every item except the declared refile set,
 *                           which must read the new desk: the one-time shift, recorded.
 *
 * ⛔ NO IMPORT OF THE PRODUCT HERE. The four product functions arrive as `deps`, so the capture
 * could run from outside the tree at the clean base (the signed door refuses a dirty tree, and
 * this file was byte-identical outside it at capture). The suite passes the same four.
 */
import { createHash } from 'node:crypto';

/** The rows of the golden: the named reachable config (the Full Simulation preset), one year. */
export const HERALD_DESK_GOLDEN_ROWS = Object.freeze([
  Object.freeze({ rowId: 'rr-fresh-full', years: 1 }),
]);

/**
 * @param {{ READER_CORPUS_ROSTER: ReadonlyArray<Record<string, any>>, composeReaderRegion: Function,
 *   advanceReaderCampaign: Function, buildHeraldFeed: Function }} deps
 * @param {{ rowId: string, years: number }} row
 * @returns {Promise<{ key: string, contentSha256: string, itemCount: number,
 *   sections: Record<string, string>, campaign: any }>}
 */
export async function heraldDeskProjection(deps, row) {
  const rosterRow = deps.READER_CORPUS_ROSTER.find((r) => r.campaignId === row.rowId);
  if (!rosterRow) throw new Error(`no reader corpus row ${row.rowId}`);
  const { campaign, saves } = deps.composeReaderRegion(rosterRow);
  const advanced = await deps.advanceReaderCampaign({ campaign, saves, years: row.years, seed: rosterRow.seed });
  const feed = deps.buildHeraldFeed(advanced.campaign, { lens: 'campaign' });
  const items = [];
  for (const [section, list] of Object.entries(feed.bySection)) {
    for (const item of list) items.push({ section, item });
  }
  items.sort((a, b) => (a.item.id < b.item.id ? -1 : a.item.id > b.item.id ? 1 : 0));
  const content = items.map(({ item }) => ({
    id: item.id, kind: item.kind, headline: item.headline, summary: item.summary,
    severity: item.severity, major: item.major, tick: item.tick, reasons: item.reasons,
    affectedIds: item.affectedIds, provenance: item.provenance,
  }));
  /** @type {Record<string, string>} */
  const sections = {};
  for (const { section, item } of items) sections[item.id] = section;
  return {
    key: `${row.rowId}|${row.years}`,
    contentSha256: createHash('sha256').update(JSON.stringify(content)).digest('hex'),
    itemCount: items.length,
    sections,
    campaign: advanced.campaign,
  };
}

/**
 * The manifest bytes: flat keys, codepoint-sorted, two-space JSON, one trailing newline.
 * @param {ReadonlyArray<{ key: string, contentSha256: string, itemCount: number, sections: Record<string, string> }>} projections
 * @returns {string}
 */
export function heraldDeskManifest(projections) {
  /** @type {Record<string, string|number>} */
  const out = {};
  for (const p of projections) {
    out[`${p.key}|contentSha256`] = p.contentSha256;
    out[`${p.key}|itemCount`] = p.itemCount;
    for (const [id, section] of Object.entries(p.sections)) out[`${p.key}|section|${id}`] = section;
  }
  const keys = Object.keys(out).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return `${JSON.stringify(out, keys, 2)}\n`;
}
