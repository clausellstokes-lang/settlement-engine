/**
 * mapSnapshotImport.contract.test.js — guards finding F6.
 *
 * A published campaign's map can be imported by another user
 * (importGalleryMapWithCampaign). The raw FMG snapshot is a serialized SVG blob
 * that the /map/ iframe loads via document.body.insertAdjacentHTML on our OWN
 * origin — which holds the Supabase auth token. Copying another user's snapshot
 * verbatim into the local map was therefore a cross-user stored-XSS /
 * account-takeover sink. The fix drops the raw snapshot from cross-user imports
 * (keeping seed + placements + any image backdrop).
 *
 * Executing the full import needs the entire campaign/savesService/supabase
 * stack, so this is a source contract (same idiom as the other
 * *.contract.test.js boundary guards): it fails if the import path ever again
 * assigns an imported snapshot into the local map state.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SRC = readFileSync(resolve(process.cwd(), 'src', 'store', 'campaignSlice.js'), 'utf-8');

/** Slice out the importGalleryMapWithCampaign action body. */
function importActionBody() {
  const start = SRC.indexOf('importGalleryMapWithCampaign');
  expect(start, 'importGalleryMapWithCampaign not found — rename?').toBeGreaterThan(-1);
  // Grab a generous window; the action is well under this size.
  return SRC.slice(start, start + 6000);
}

/**
 * Slice out the sibling importGalleryMap action body (single-map import). It is
 * defined before importGalleryMapWithCampaign, so the slice ends where the
 * sibling begins. This path re-opened the same F6 sink in wave 1: it carried the
 * shared backdrop.fmgSnapshot verbatim while the *WithCampaign sibling had the
 * fix — so this guard would have failed against the pre-wave-1 code.
 */
function singleImportActionBody() {
  const start = SRC.indexOf('importGalleryMap: async');
  expect(start, 'importGalleryMap not found — rename?').toBeGreaterThan(-1);
  // End at the sibling's DEFINITION, not the first textual mention (comments in
  // importGalleryMap reference the sibling by name).
  const end = SRC.indexOf('importGalleryMapWithCampaign: async');
  expect(end, 'importGalleryMapWithCampaign not found — rename?').toBeGreaterThan(start);
  return SRC.slice(start, end);
}

describe('cross-user map import never carries an untrusted raw snapshot (F6)', () => {
  const body = importActionBody();

  it('does not assign an imported fmgSnapshot into local map state', () => {
    // Any `<lhs>.fmgSnapshot = <rhs>` where rhs reads the shared/imported map.
    const reintroduced = /\bfmgSnapshot\s*[:=]\s*(shared|imported|src|remote)\w*\.fmgSnapshot/i.test(body)
      || /mapState\.fmgSnapshot\s*=/.test(body);
    expect(reintroduced, 'cross-user import assigns a raw fmgSnapshot again — F6 regression').toBe(false);
  });

  it('still imports the safe fields (seed) so geography can regenerate locally', () => {
    // importGalleryMap reads its shared payload via `backdrop`; the WithCampaign
    // sibling uses `sharedMap`. Either safe-field-carry proves the F6 seed import.
    expect(/mapState\.seed\s*=\s*(backdrop|sharedMap)\.seed/.test(body)).toBe(true);
  });
});

describe('single-map import never carries an untrusted raw snapshot (F6 / wave-1)', () => {
  const body = singleImportActionBody();

  it('does not assign an imported fmgSnapshot into local map state', () => {
    const reintroduced = /\bfmgSnapshot\s*[:=]\s*(shared|imported|backdrop|src|remote)\w*\.fmgSnapshot/i.test(body)
      || /mapState\.fmgSnapshot\s*=/.test(body);
    expect(reintroduced, 'importGalleryMap assigns a raw fmgSnapshot again — F6 regression').toBe(false);
  });

  it('carries only the seed from the shared backdrop so geography can regenerate locally', () => {
    expect(/mapState\.seed\s*=\s*backdrop\.seed/.test(body)).toBe(true);
  });
});
