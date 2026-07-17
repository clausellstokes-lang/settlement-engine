/**
 * @vitest-environment jsdom
 *
 * ShareToGallery reload-seed round-trip — the user-visible flow behind the
 * gallery opt-in data loss.
 *
 * The flow this reproduces: the owner opts a published dossier into importing
 * and sets per-member visibility overrides; the page reloads (the store
 * rehydrates from saves.list()); the owner edits an unrelated gallery detail
 * and clicks "Save gallery details". ShareToGallery's metadata bag ALWAYS
 * carries `importable` and `memberOverrides` (galleryMetadataPatch's
 * merge-patch semantics never engage), so whatever the component seeded from
 * the loaded entry is what gets persisted. Before the saves.js fix the entry
 * carried neither column and the save silently cleared both opt-ins.
 *
 * This test drives the REAL saves.list() mapping (supabase mocked at the
 * client seam) into ShareToGallery wired exactly as DossierActionBand wires
 * it, clicks through the save-details flow, and asserts the persisted bag
 * still says importable: true with the overrides intact.
 *
 * Also pins the mount contract: every JSX mount of ShareToGallery must wire
 * galleryImportable + galleryMemberOverrides — an unwired mount seeds
 * false / {} and re-creates the wipe (SettlementDetail shipped that way).
 * CANNOT-CATCH: a mount passing the props from an object that never carried
 * the fields, spread-prop mounts ({...props}), or mounts outside
 * src/components — covered only by the seeding test above and review.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

const { storeRef, galleryRef } = vi.hoisted(() => ({
  storeRef: { current: {} },
  galleryRef: { updateCalls: [] },
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeRef.current),
}));
vi.mock('../../src/lib/gallery.js', () => ({
  publishSettlement: vi.fn(async () => 'slug'),
  unpublishSettlement: vi.fn(async () => {}),
  updateGalleryMetadata: vi.fn(async (id, metadata) => {
    galleryRef.updateCalls.push({ id, metadata });
    return metadata;
  }),
}));

const OVERRIDES = { 'npc-1': { revealDm: true }, 'npc-2': { allowImport: false } };

describe('ShareToGallery — reload round-trip preserves the gallery opt-ins', () => {
  test('save-details after a simulated reload keeps importable + member overrides', async () => {
    // The "reload": hydrate a save entry through the REAL list mapping.
    vi.resetModules();
    vi.doMock('../../src/lib/supabase.js', () => {
      const chain = {
        select: () => chain,
        order: () => Promise.resolve({
          data: [{
            id: 'sb-1', name: 'Rivermouth', tier: 'town',
            data: { name: 'Rivermouth', tier: 'town', npcs: [] },
            config: { settType: 'town' },
            access_state: 'active',
            is_public: true, public_slug: 'rivermouth',
            gallery_importable: true,
            gallery_member_overrides: OVERRIDES,
            campaign_state: { phase: 'canon', eventLog: [], locks: {} },
            updated_at: new Date().toISOString(),
          }],
          error: null,
        }),
      };
      return { supabase: { from: () => chain }, isConfigured: true };
    });
    const { saves } = await import('../../src/lib/saves.js');
    const [entry] = await saves.list();
    const { default: ShareToGallery } = await import('../../src/components/ShareToGallery.jsx');

    storeRef.current = {
      auth: { user: { id: 'u1' } },
      updateSavedSettlement: vi.fn(),
      savedSettlements: [entry],
      campaigns: [],
    };

    // Wired exactly as DossierActionBand wires the live save entry.
    render(
      <ShareToGallery
        saveId={entry.id}
        isPublic={entry.is_public}
        publicSlug={entry.public_slug}
        campaignState={entry.campaignState}
        settlement={entry.settlement}
        galleryDescription={entry.gallery_description}
        galleryImageUrl={entry.gallery_image_url}
        galleryImageAlt={entry.gallery_image_alt}
        galleryTags={entry.gallery_tags}
        galleryShareNarrated={entry.gallery_share_narrated}
        galleryShareDm={entry.gallery_share_dm}
        galleryImportable={entry.gallery_importable}
        galleryMemberOverrides={entry.gallery_member_overrides}
      />
    );

    // Open the details form and save WITHOUT touching the opt-ins.
    fireEvent.click(screen.getByRole('button', { name: /gallery details/i }));
    fireEvent.click(screen.getByRole('button', { name: /save gallery details/i }));

    await waitFor(() => expect(galleryRef.updateCalls).toHaveLength(1));
    const { metadata } = galleryRef.updateCalls[0];
    expect(metadata.importable).toBe(true);
    expect(metadata.memberOverrides).toEqual(OVERRIDES);
  });
});

// ── Mount-wiring pin ─────────────────────────────────────────────────────────
describe('ShareToGallery — every mount wires the opt-in props', () => {
  function jsxFilesUnder(dir) {
    return readdirSync(dir, { recursive: true, withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.endsWith('.jsx'))
      .map(entry => join(entry.parentPath ?? entry.path, entry.name));
  }

  test('all <ShareToGallery mounts pass galleryImportable + galleryMemberOverrides', () => {
    const componentsDir = resolve(process.cwd(), 'src/components');
    const mounts = jsxFilesUnder(componentsDir)
      .filter(file => !file.endsWith('ShareToGallery.jsx'))
      .filter(file => readFileSync(file, 'utf-8').includes('<ShareToGallery'));
    // The mount census as of this pin — a NEW mount extends this list AND wires
    // the props below (seeding them from a saves.list()-shaped entry).
    expect(mounts.length).toBeGreaterThanOrEqual(3);
    for (const file of mounts) {
      const content = readFileSync(file, 'utf-8');
      for (const prop of ['galleryImportable=', 'galleryMemberOverrides=']) {
        expect(content.includes(prop), `${file} mounts ShareToGallery without wiring ${prop} — an unwired mount seeds false/{} and silently wipes the owner's opt-ins on save`).toBe(true);
      }
    }
  });
});
