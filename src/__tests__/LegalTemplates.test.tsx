/**
 * @fileoverview Legal templates markup
 * @description PrivacyPolicyTemplate, LegalNoticeTemplate and TermsOfServiceTemplate render one h1 (the
 * title, no emoji), h2 section headings, and the privacy agreement sentence with
 * the company name interpolated.
 */

import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@donotdev/core', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { companyName?: string }) =>
      key === 'sections.introduction.agreement'
        ? `agree ${opts?.companyName}`
        : key === 'title'
          ? 'Page title'
          : key,
    i18n: { language: 'en' },
  }),
  useAppConfig: () => ({ features: {} }),
  formatDate: () => '2026-01-01',
  isCookieNoticeRequired: () => true,
  isFeatureAvailable: () => false,
}));

vi.mock('@donotdev/components', () => {
  const pass = (p: { children?: unknown }) => createElement('div', null, p.children as never);
  const Text = (p: { as?: string; children?: unknown }) =>
    createElement(p.as ?? 'div', null, p.children as never);
  const List = (p: { items: unknown[] }) =>
    createElement('ul', null, ...p.items.map((i, k) => createElement('li', { key: k }, i as never)));
  return { Stack: pass, Section: pass, Card: pass, Text, List };
});

vi.mock('@donotdev/ui', () => ({
  Link: (p: { path: string; children?: unknown }) =>
    createElement('a', { href: p.path }, p.children as never),
}));

const { PrivacyPolicyTemplate } = await import('../legal/PrivacyPolicyTemplate');
const { LegalNoticeTemplate } = await import('../legal/LegalNoticeTemplate');
const { TermsOfServiceTemplate } = await import('../legal/TermsOfServiceTemplate');

describe('legal templates', () => {
  let container: HTMLElement;

  beforeEach(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  const render = (node: Parameters<ReturnType<typeof createRoot>['render']>[0]) => {
    act(() => createRoot(container).render(node));
  };

  it('PrivacyPolicyTemplate: one h1 without emoji, h2 sections, interpolated agreement', () => {
    render(
      createElement(PrivacyPolicyTemplate, {
        companyName: 'Acme',
        websiteUrl: 'https://acme.test',
        privacyEmail: 'p@acme.test',
        companyAddress: '1 rue X',
      })
    );
    const h1s = container.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0]!.textContent).toBe('Page title');
    expect(container.querySelectorAll('h2').length).toBeGreaterThan(5);
    expect(container.textContent).toContain('agree Acme');
    expect(container.textContent).not.toContain('{{');
  });

  it('LegalNoticeTemplate: one h1 without emoji, h2 sections', () => {
    render(
      createElement(LegalNoticeTemplate, {
        publisherName: 'Acme',
        publisherType: 'company',
        registeredOffice: '1 rue X',
        email: 'a@acme.test',
        directorName: 'Jane',
        hostingProvider: 'Host',
      })
    );
    const h1s = container.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0]!.textContent).toBe('Page title');
    expect(container.querySelectorAll('h2').length).toBeGreaterThan(4);
  });

  it('TermsOfServiceTemplate: one h1 without emoji, h2 sections', () => {
    render(
      createElement(TermsOfServiceTemplate, {
        companyName: 'Acme',
        websiteUrl: 'https://acme.test',
        legalEmail: 'l@acme.test',
        companyAddress: '1 rue X',
      })
    );
    const h1s = container.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0]!.textContent).toBe('Page title');
    expect(container.querySelectorAll('h2').length).toBeGreaterThan(10);
  });
});
