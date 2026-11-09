/**
 * @fileoverview LoginTemplate states
 * @description Auth missing, auth initializing, auth ready (providers shown),
 * signed-in redirect.
 */

import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  available: true,
  visibility: { shouldHide: false, isLoading: false, isReady: true, isAuthenticated: false },
  user: null as null | { uid: string },
  navigate: vi.fn(),
}));

vi.mock('../authImports', () => ({
  get isAuthModuleAvailable() {
    return state.available;
  },
  useAuth: () => state.user,
  MultipleAuthProviders: () => 'PROVIDERS',
}));

vi.mock('@donotdev/ui', () => ({
  useAuthVisibility: () => state.visibility,
  useNavigate: () => state.navigate,
}));

vi.mock('@donotdev/core', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@donotdev/components', () => ({
  Card: (p: { title?: string; children?: unknown }) => createElement('section', null, p.title, p.children as never),
  Stack: (p: { children?: unknown }) => createElement('div', null, p.children as never),
  Alert: (p: { description?: string }) => `ALERT:${p.description}`,
  Spinner: (p: { message?: string }) => `SPINNER:${p.message}`,
}));

const { LoginTemplate } = await import('../LoginTemplate');

const html = (props: Parameters<typeof LoginTemplate>[0] = {}) =>
  renderToStaticMarkup(createElement(LoginTemplate, props));

describe('LoginTemplate', () => {
  beforeEach(() => {
    state.available = true;
    state.visibility = { shouldHide: false, isLoading: false, isReady: true, isAuthenticated: false };
    state.user = null;
    state.navigate.mockReset();
  });

  it('renders the auth providers once auth is ready', () => {
    const out = html({ title: 'Connexion', footer: 'FOOTER' });
    expect(out).toContain('Connexion');
    expect(out).toContain('PROVIDERS');
    expect(out).toContain('FOOTER');
  });

  it('shows a spinner, not an error, while auth initializes', () => {
    state.visibility = { shouldHide: true, isLoading: true, isReady: false, isAuthenticated: false };
    const out = html();
    expect(out).toContain('SPINNER:login.loading');
    expect(out).not.toContain('ALERT');
  });

  it('explains when auth is disabled or not installed', () => {
    state.visibility = { shouldHide: true, isLoading: false, isReady: false, isAuthenticated: false };
    expect(html()).toContain('ALERT:login.authNotAvailable');
    state.available = false;
    expect(html()).toContain('ALERT:login.authNotAvailable');
  });

  describe('signed in', () => {
    let container: HTMLElement;
    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });
    afterEach(() => container.remove());

    it('navigates to redirectTo', async () => {
      state.user = { uid: 'u1' };
      const root = createRoot(container);
      await act(async () => root.render(createElement(LoginTemplate, { redirectTo: '/catalogue' })));
      expect(state.navigate).toHaveBeenCalledWith('/catalogue');
      await act(async () => root.unmount());
    });
  });
});
