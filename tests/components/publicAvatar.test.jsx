/**
 * @vitest-environment jsdom
 *
 * publicAvatar.test.jsx — THE ONE AVATAR RENDER's contract
 * (DESIGN_PROFILE_IMAGE.md §6, and §7's fallback + identity-coherence pins).
 *
 * These are the pins that stop the two ways this feature could quietly go wrong
 * once other lanes start consuming it:
 *
 *   1. CONSENT. §7 asks that consent off ⇒ no surface renders name OR image. The
 *      resolver blanks the identity and this component renders NOTHING — not a
 *      letter-circle, which would still announce "a person is here" on a page
 *      the person asked to be absent from. That distinction is the test below.
 *
 *   2. ZERO LAYOUT SHIFT. §6 asks that the letter-circle render IDENTICALLY
 *      sized "so swap-in never jumps". Asserting the two arms agree on their box
 *      is the only way that survives a future style edit to one arm.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import PublicAvatar from '../../src/components/primitives/PublicAvatar.jsx';
import { publicIdentityOf } from '../../src/lib/publicIdentity.js';

afterEach(cleanup);

const MASTER = 'https://cdn.example.com/storage/v1/object/public/avatars/u1/abc123.webp';

/** Always build identities the way real consumers must: through the resolver. */
const identity = (row) => publicIdentityOf(row);

describe('consent governs the pair, and this component obeys it', () => {
  it('renders NOTHING when consent is off — not even a letter-circle', () => {
    const { container } = render(
      <PublicAvatar identity={identity({
        external_name: 'QuietCartographer418', avatar_url: MASTER, public_identity_opt_in: false,
      })} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders NOTHING when the consent column is absent (dark migration)', () => {
    const { container } = render(
      <PublicAvatar identity={identity({ external_name: 'A', avatar_url: MASTER })} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders NOTHING for a missing identity rather than throwing', () => {
    const { container } = render(<PublicAvatar identity={undefined} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('the image arm', () => {
  const opted = { external_name: 'Amber Steward', avatar_url: MASTER, public_identity_opt_in: true };

  it('serves the ladder, and never the 512 into a 32px slot', () => {
    render(<PublicAvatar identity={identity(opted)} rung="micro" />);
    const img = screen.getByTestId('public-avatar-image');
    expect(img.getAttribute('sizes')).toBe('32px');
    expect(img.getAttribute('src')).toContain('-32.webp');
    // The 512 master must be absent — anchored on a sibling candidate that
    // travels the same ladder code path, so this cannot pass merely because
    // srcSet stopped being emitted at all.
    expectAbsentWithAnchor(
      img.getAttribute('srcset'), 'abc123.webp', 'abc123-128.webp',
      'micro slot never offers the 512 master',
    );
  });

  it('alt text is the display name — identity is never carried by the image alone', () => {
    render(<PublicAvatar identity={identity(opted)} />);
    expect(screen.getByTestId('public-avatar-image').getAttribute('alt')).toBe('Amber Steward');
  });

  it('is lazy by default and eager only when asked', () => {
    const { rerender } = render(<PublicAvatar identity={identity(opted)} />);
    expect(screen.getByTestId('public-avatar-image').getAttribute('loading')).toBe('lazy');
    rerender(<PublicAvatar identity={identity(opted)} eager />);
    expect(screen.getByTestId('public-avatar-image').getAttribute('loading')).toBe('eager');
  });
});

describe('the PERMANENT letter-circle fallback', () => {
  const noImage = { external_name: 'Quiet Cartographer', public_identity_opt_in: true };

  it('renders the initial when there is no image — an ordinary state, not an error', () => {
    render(<PublicAvatar identity={identity(noImage)} />);
    expect(screen.getByTestId('public-avatar-letter').textContent).toBe('Q');
    expect(screen.queryByTestId('public-avatar-image')).toBe(null);
  });

  it('is aria-hidden — the caller renders the name as text beside it', () => {
    render(<PublicAvatar identity={identity(noImage)} />);
    expect(screen.getByTestId('public-avatar-letter').getAttribute('aria-hidden')).toBe('true');
  });

  it('is deterministic: the same person always wears the same circle', () => {
    const { container: first } = render(<PublicAvatar identity={identity(noImage)} />);
    const a = first.querySelector('[data-testid="public-avatar-letter"]').getAttribute('style');
    cleanup();
    const { container: second } = render(<PublicAvatar identity={identity(noImage)} />);
    expect(second.querySelector('[data-testid="public-avatar-letter"]').getAttribute('style')).toBe(a);
  });

  it('§6 ZERO LAYOUT SHIFT — both arms render the identical box at every rung', () => {
    for (const rung of ['micro', 'standard']) {
      const { container: withImage } = render(
        <PublicAvatar identity={identity({ ...noImage, avatar_url: MASTER })} rung={rung} />,
      );
      const imageBox = withImage.firstChild.getAttribute('style');
      cleanup();

      const { container: withLetter } = render(<PublicAvatar identity={identity(noImage)} rung={rung} />);
      const letterBox = withLetter.firstChild.getAttribute('style');
      cleanup();

      // Compare the geometry only — colour/objectFit legitimately differ.
      // Anchor each declaration to a property boundary: an unanchored /height/
      // also matches `line-height`, which the letter arm sets and the image arm
      // does not — the pin would have failed on a difference that is not a
      // layout shift, and the obvious 'fix' would have been to weaken it.
      const geometry = (style) => (style.match(/(?:^|;)\s*(?:width|height|border-radius):\s*[^;]+/g) || [])
        .map((d) => d.replace(/^;\s*/, '').trim()).sort();
      expect(geometry(letterBox)).toEqual(geometry(imageBox));
      expect(geometry(letterBox).length).toBeGreaterThan(0);
    }
  });
});
