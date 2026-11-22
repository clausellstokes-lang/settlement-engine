/** @vitest-environment jsdom */
/**
 * accountSectionCard.test.jsx
 *
 * Account-page legibility: the account view paints account.jpg through the content
 * body, and the default-tone sections used to render text on a bare top-rule with
 * no opaque surface, washing out over the painting. Every Section now sits on an
 * opaque CARD; the feature-vs-default hierarchy is carried by the header strip
 * (tinted for feature, plain for default), not by box-vs-no-box.
 */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import Section from '../../src/components/account/AccountSection.jsx';

afterEach(cleanup);

describe('AccountSection — opaque card for legibility', () => {
  test('a default-tone section sits on an opaque, bordered, rounded card', () => {
    const { container } = render(<Section title="Profile">body</Section>);
    const card = container.firstChild;
    expect(card.style.background).toBeTruthy();
    expect(card.style.background).not.toBe('transparent');
    expect(card.style.borderRadius).not.toBe('');
    expect(card.style.border).toContain('1px');
  });

  test('the default header is plain (no tint) so it stays a quiet utility card', () => {
    const { container } = render(<Section title="Profile">body</Section>);
    const header = container.firstChild.firstChild;
    expect(header.style.background).toBe('transparent');
  });

  test('the feature section keeps a tinted header strip to stand out', () => {
    const { container } = render(<Section title="Subscription" tone="feature">body</Section>);
    const card = container.firstChild;
    const header = card.firstChild;
    // same opaque card...
    expect(card.style.background).toBeTruthy();
    // ...but a tinted, ruled header marks it as the one feature surface.
    expect(header.style.background).toBeTruthy();
    expect(header.style.background).not.toBe('transparent');
    expect(header.style.borderBottom).toContain('1px');
  });
});
